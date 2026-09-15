export function overviewFloorId(node) {
  for (let currentNode = node; currentNode; currentNode = currentNode.parent) {
    const resolvedFloorId =
      currentNode.userData?.floorId ||
      currentNode.userData?.regionFloorId ||
      currentNode.userData?.environmentFloorId ||
      currentNode.userData?.lightFloorId;
    if (resolvedFloorId) {
      return String(resolvedFloorId);
    }
  }
  return "";
}
export function stackProjection(
  THREE,
  camera,
  stackedHeight,
  projectionOffsetY,
  targetMatrix = new THREE.Matrix4()
) {
  const translationMatrix = new THREE.Matrix4().makeTranslation(0, projectionOffsetY, 0);
  return targetMatrix
    .copy(translationMatrix)
    .multiply(camera.projectionMatrix)
    .multiply(camera.matrixWorldInverse)
    .multiply(new THREE.Matrix4().makeTranslation(0, -stackedHeight, 0))
    .multiply(camera.matrixWorld);
}
export function createOverviewStack({
  THREE: three,
  renderer: renderer,
  scene: scene,
  getCamera: getCamera,
  getLayout: getLayout
}) {
  const originalRenderBufferDirect = renderer.renderBufferDirect;
  const originalRender = renderer.render;
  const stackByFloorId = new Map();
  const savedFrustumCulled = new Map();
  let stackedLayerCamera = null;
  let lastLayoutSignature = "";
  let layout = null;
  let renderRevision = 0;
  let syncedRevision = -1;
  let lastBounds = null;
  let maxBoundHeight = 0;
  const lastProjectionMatrix = new three.Matrix4();
  const lastWorldInverse = new three.Matrix4();
  const scratchViewPosition = new three.Vector3();
  const scratchMatrix4 = new three.Matrix4();
  const stats = {
    active: false,
    floorCount: 0,
    preparations: 0
  };
  function getActiveLayout() {
    const currentLayout = getLayout();
    if (!currentLayout.enabled || currentLayout.floors.length < 2 || currentLayout.amount <= 0) {
      return null;
    }
    const layoutSignature = JSON.stringify([
      currentLayout.gap,
      currentLayout.amount,
      currentLayout.center,
      currentLayout.floors.map(floor => [floor.id, floor.elevation])
    ]);
    if (layoutSignature !== lastLayoutSignature) {
      lastLayoutSignature = layoutSignature;
      syncedRevision = -1;
    }
    layout = currentLayout;
    return currentLayout;
  }
  function restoreFrustumCulled() {
    for (const [culledNode, frustumCulled] of savedFrustumCulled) {
      culledNode.frustumCulled = frustumCulled;
    }
    savedFrustumCulled.clear();
  }
  function syncFloorCameras(renderCamera) {
    if (
      !layout ||
      (syncedRevision === renderRevision &&
        lastProjectionMatrix.equals(renderCamera.projectionMatrix) &&
        lastWorldInverse.equals(renderCamera.matrixWorldInverse))
    ) {
      return;
    }
    lastProjectionMatrix.copy(renderCamera.projectionMatrix);
    lastWorldInverse.copy(renderCamera.matrixWorldInverse);
    syncedRevision = renderRevision;
    const sortedFloors = [...layout.floors].sort(
      (floorA, floorB) => floorA.elevation - floorB.elevation
    );
    if (lastBounds !== layout.bounds) {
      lastBounds = layout.bounds;
      maxBoundHeight = 0;
      for (const boundsList of layout.bounds?.values() || []) {
        for (const boundsBox of boundsList) {
          maxBoundHeight = Math.max(maxBoundHeight, boundsBox[1]);
        }
      }
    }
    const stackCenter = new three.Vector3(layout.center[0], maxBoundHeight / 2, layout.center[2]);
    const topCenter = stackCenter.clone();
    topCenter.y += (sortedFloors.at(-1).elevation - sortedFloors[0].elevation) / 2;
    scratchViewPosition.copy(topCenter).applyMatrix4(renderCamera.matrixWorldInverse);
    const projectionElements = renderCamera.projectionMatrix.elements;
    const projectedDepth =
      projectionElements[3] * scratchViewPosition.x +
      projectionElements[7] * scratchViewPosition.y +
      projectionElements[11] * scratchViewPosition.z +
      projectionElements[15];
    const verticalScale = projectionElements[5] / Math.max(Math.abs(projectedDepth), 0.001);
    const activeFloorIds = new Set();
    for (const [floorIndex, floorEntry] of sortedFloors.entries()) {
      activeFloorIds.add(floorEntry.id);
      let stackRecord = stackByFloorId.get(floorEntry.id);
      if (!stackRecord || stackRecord.camera.type !== renderCamera.type) {
        stackRecord = {
          camera: renderCamera.clone(false),
          reflection: renderCamera.clone(false)
        };
        stackByFloorId.set(floorEntry.id, stackRecord);
      }
      stackRecord.height = floorIndex * layout.gap * layout.amount;
      stackRecord.camera.copy(renderCamera, false);
      stackProjection(
        three,
        renderCamera,
        stackRecord.height,
        0,
        stackRecord.camera.projectionMatrix
      );
      stackRecord.camera.projectionMatrixInverse.copy(stackRecord.camera.projectionMatrix).invert();
      stackRecord.reflection.copy(renderCamera, false);
      stackRecord.reflection.position.y += stackRecord.height;
      stackRecord.reflection.updateMatrixWorld(true);
    }
    const layerOffset = Math.max(0, layout.gap) * Math.abs(verticalScale);
    const middleIndex = (sortedFloors.length - 1) / 2;
    const baseScreenPosition = stackCenter.project(renderCamera);
    const topScreenPosition = topCenter.project(renderCamera);
    const screenOffsetX = (topScreenPosition.x - baseScreenPosition.x) * layout.amount;
    const screenOffsetY = (topScreenPosition.y - baseScreenPosition.y) * layout.amount;
    for (const [layerIndex, layerFloor] of sortedFloors.entries()) {
      const layerRecord = stackByFloorId.get(layerFloor.id);
      const layerOffsetY = (layerIndex - middleIndex) * layerOffset * layout.amount;
      layerRecord.camera.projectionMatrix.premultiply(
        scratchMatrix4.makeTranslation(screenOffsetX, screenOffsetY + layerOffsetY, 0)
      );
      layerRecord.camera.projectionMatrixInverse.copy(layerRecord.camera.projectionMatrix).invert();
    }
    for (const staleFloorId of stackByFloorId.keys()) {
      if (!activeFloorIds.has(staleFloorId)) {
        stackByFloorId.delete(staleFloorId);
      }
    }
    stats.preparations++;
    stats.floorCount = stackByFloorId.size;
  }
  function cameraForFloor(floorId, sourceCamera = getCamera()) {
    if (getActiveLayout()) {
      sourceCamera.updateWorldMatrix(true, false);
      syncFloorCameras(sourceCamera);
      return stackByFloorId.get(floorId)?.camera || sourceCamera;
    } else {
      return sourceCamera;
    }
  }
  renderer.render = function (renderScene, layerCamera, ...renderRest) {
    const previousLayerCamera = stackedLayerCamera;
    const isStackedLayer = renderScene === scene && layerCamera === getCamera();
    const originalOnBeforeRender = scene.onBeforeRender;
    let stackedOnBeforeRender;
    if (isStackedLayer) {
      stats.active = !!getActiveLayout();
      renderRevision++;
      if (stats.active) {
        stackedOnBeforeRender = function (...hookArgs) {
          originalOnBeforeRender?.apply(this, hookArgs);
          if (hookArgs[2] === layerCamera) {
            syncFloorCameras(layerCamera);
            scene.traverse(childNode => {
              if (
                (!!childNode.isMesh ||
                  !!childNode.isLine ||
                  !!childNode.isPoints ||
                  !!childNode.isSprite) &&
                !!overviewFloorId(childNode)
              ) {
                if (!savedFrustumCulled.has(childNode)) {
                  savedFrustumCulled.set(childNode, childNode.frustumCulled);
                }
                childNode.frustumCulled = false;
              }
            });
          }
        };
        scene.onBeforeRender = stackedOnBeforeRender;
      } else {
        restoreFrustumCulled();
      }
    }
    stackedLayerCamera = isStackedLayer && stats.active ? layerCamera : null;
    try {
      return originalRender.call(this, renderScene, layerCamera, ...renderRest);
    } finally {
      stackedLayerCamera = previousLayerCamera;
      if (isStackedLayer) {
        if (scene.onBeforeRender === stackedOnBeforeRender) {
          scene.onBeforeRender = originalOnBeforeRender;
        }
        restoreFrustumCulled();
      }
    }
  };
  renderer.renderBufferDirect = function (
    drawCamera,
    drawScene,
    geometry,
    material,
    object,
    group
  ) {
    if (stackedLayerCamera === drawCamera && drawScene === scene) {
      syncFloorCameras(drawCamera);
      drawCamera = stackByFloorId.get(overviewFloorId(object))?.camera || drawCamera;
    }
    return originalRenderBufferDirect.call(
      this,
      drawCamera,
      drawScene,
      geometry,
      material,
      object,
      group
    );
  };
  return {
    stats: stats,
    cameraForFloor: cameraForFloor,
    rayForFloor(rayFloorId, pointer, ray) {
      const activeCamera = getCamera();
      const targetCamera = cameraForFloor(rayFloorId, activeCamera);
      if (targetCamera === activeCamera) {
        ray.setFromCamera(pointer, activeCamera);
        return ray;
      }
      const nearPoint = new three.Vector3(pointer.x, pointer.y, -1).unproject(targetCamera);
      const rayDirection = new three.Vector3(pointer.x, pointer.y, 1)
        .unproject(targetCamera)
        .sub(nearPoint)
        .normalize();
      ray.set(nearPoint, rayDirection);
      ray.camera = targetCamera;
      return ray;
    },
    reflectionCamera(baseCamera, objectRoot) {
      if (baseCamera !== getCamera() || !getActiveLayout()) {
        return baseCamera;
      } else {
        syncFloorCameras(baseCamera);
        return stackByFloorId.get(overviewFloorId(objectRoot))?.reflection || baseCamera;
      }
    },
    presentationPoint(projectFloorId, point) {
      const referenceCamera = getCamera();
      const floorCamera = cameraForFloor(projectFloorId, referenceCamera);
      if (floorCamera === referenceCamera) {
        return point;
      } else {
        return point.project(floorCamera).unproject(referenceCamera);
      }
    },
    dispose() {
      restoreFrustumCulled();
      stackByFloorId.clear();
      renderer.render = originalRender;
      renderer.renderBufferDirect = originalRenderBufferDirect;
    }
  };
}
