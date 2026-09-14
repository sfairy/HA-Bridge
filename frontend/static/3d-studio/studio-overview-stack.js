export function overviewFloorId(object) {
  for (let node = object; node; node = node.parent) {
    const floorId = node.userData?.floorId
      || node.userData?.regionFloorId
      || node.userData?.environmentFloorId
      || node.userData?.lightFloorId;
    if (floorId) {
      return String(floorId);
    }
  }
  return '';
}

export function stackProjection(THREE, camera, floorHeight, screenOffset, target = new THREE.Matrix4()) {
  const lift = new THREE.Matrix4().makeTranslation(0, screenOffset, 0);
  return target
    .copy(lift)
    .multiply(camera.projectionMatrix)
    .multiply(camera.matrixWorldInverse)
    .multiply(new THREE.Matrix4().makeTranslation(0, -floorHeight, 0))
    .multiply(camera.matrixWorld);
}

export function createOverviewStack({
  THREE,
  renderer,
  scene,
  getCamera,
  getLayout
}) {
  const originalRenderBufferDirect = renderer.renderBufferDirect;
  const originalRender = renderer.render;
  const floorCameras = new Map();
  const frustumCulledBackup = new Map();
  let activeRenderCamera = null;
  let layoutSignature = '';
  let layout = null;
  let preparationSerial = 0;
  let preparedSerial = -1;
  let cachedBounds = null;
  let maxFloorHeight = 0;
  const preparedProjection = new THREE.Matrix4();
  const preparedViewInverse = new THREE.Matrix4();
  const midPointView = new THREE.Vector3();
  const screenShift = new THREE.Matrix4();
  const stats = {
    active: false,
    floorCount: 0,
    preparations: 0
  };

  function currentLayout() {
    const next = getLayout();
    if (!next.enabled || next.floors.length < 2 || next.amount <= 0) {
      return null;
    }
    const signature = JSON.stringify([
      next.gap,
      next.amount,
      next.center,
      next.floors.map(floor => [floor.id, floor.elevation])
    ]);
    if (signature !== layoutSignature) {
      layoutSignature = signature;
      preparedSerial = -1;
    }
    layout = next;
    return next;
  }

  function restoreFrustumCulling() {
    for (const [object, value] of frustumCulledBackup) {
      object.frustumCulled = value;
    }
    frustumCulledBackup.clear();
  }

  function prepareFloorCameras(camera) {
    if (
      !layout
      || preparedSerial === preparationSerial
        && preparedProjection.equals(camera.projectionMatrix)
        && preparedViewInverse.equals(camera.matrixWorldInverse)
    ) {
      return;
    }
    preparedProjection.copy(camera.projectionMatrix);
    preparedViewInverse.copy(camera.matrixWorldInverse);
    preparedSerial = preparationSerial;
    const floors = [...layout.floors].sort((a, b) => a.elevation - b.elevation);
    if (cachedBounds !== layout.bounds) {
      cachedBounds = layout.bounds;
      maxFloorHeight = 0;
      for (const entries of layout.bounds?.values() || []) {
        for (const entry of entries) {
          maxFloorHeight = Math.max(maxFloorHeight, entry[1]);
        }
      }
    }
    const layoutCenter = new THREE.Vector3(layout.center[0], maxFloorHeight / 2, layout.center[2]);
    const midElevationPoint = layoutCenter.clone();
    midElevationPoint.y += (floors.at(-1).elevation - floors[0].elevation) / 2;
    midPointView.copy(midElevationPoint).applyMatrix4(camera.matrixWorldInverse);
    const projection = camera.projectionMatrix.elements;
    const clipW = projection[3] * midPointView.x
      + projection[7] * midPointView.y
      + projection[11] * midPointView.z
      + projection[15];
    const pixelsPerWorld = projection[5] / Math.max(Math.abs(clipW), 0.001);
    const keepIds = new Set();
    for (const [index, floor] of floors.entries()) {
      keepIds.add(floor.id);
      let entry = floorCameras.get(floor.id);
      if (!entry || entry.camera.type !== camera.type) {
        entry = {
          camera: camera.clone(false),
          reflection: camera.clone(false)
        };
        floorCameras.set(floor.id, entry);
      }
      entry.height = index * layout.gap * layout.amount;
      entry.camera.copy(camera, false);
      stackProjection(THREE, camera, entry.height, 0, entry.camera.projectionMatrix);
      entry.camera.projectionMatrixInverse.copy(entry.camera.projectionMatrix).invert();
      entry.reflection.copy(camera, false);
      entry.reflection.position.y += entry.height;
      entry.reflection.updateMatrixWorld(true);
    }
    const gapPixels = Math.max(0, layout.gap) * Math.abs(pixelsPerWorld);
    const midIndex = (floors.length - 1) / 2;
    const centerProjected = layoutCenter.project(camera);
    const midProjected = midElevationPoint.project(camera);
    const shiftX = (midProjected.x - centerProjected.x) * layout.amount;
    const shiftY = (midProjected.y - centerProjected.y) * layout.amount;
    for (const [index, floor] of floors.entries()) {
      const entry = floorCameras.get(floor.id);
      const floorShiftY = (index - midIndex) * gapPixels * layout.amount;
      entry.camera.projectionMatrix.premultiply(
        screenShift.makeTranslation(shiftX, shiftY + floorShiftY, 0)
      );
      entry.camera.projectionMatrixInverse.copy(entry.camera.projectionMatrix).invert();
    }
    for (const floorId of floorCameras.keys()) {
      if (!keepIds.has(floorId)) {
        floorCameras.delete(floorId);
      }
    }
    stats.preparations += 1;
    stats.floorCount = floorCameras.size;
  }

  function cameraForFloor(floorId, camera = getCamera()) {
    if (!currentLayout()) {
      return camera;
    }
    camera.updateWorldMatrix(true, false);
    prepareFloorCameras(camera);
    return floorCameras.get(floorId)?.camera || camera;
  }

  renderer.render = function (renderScene, camera, ...rest) {
    const previousActive = activeRenderCamera;
    const isPrimary = renderScene === scene && camera === getCamera();
    const previousOnBeforeRender = scene.onBeforeRender;
    let stackedOnBeforeRender;
    if (isPrimary) {
      stats.active = !!currentLayout();
      preparationSerial += 1;
      if (stats.active) {
        stackedOnBeforeRender = function (...args) {
          previousOnBeforeRender?.apply(this, args);
          if (args[2] === camera) {
            prepareFloorCameras(camera);
            scene.traverse(object => {
              if (!(object.isMesh || object.isLine || object.isPoints || object.isSprite)) {
                return;
              }
              if (!overviewFloorId(object)) {
                return;
              }
              if (!frustumCulledBackup.has(object)) {
                frustumCulledBackup.set(object, object.frustumCulled);
              }
              object.frustumCulled = false;
            });
          }
        };
        scene.onBeforeRender = stackedOnBeforeRender;
      } else {
        restoreFrustumCulling();
      }
    }
    activeRenderCamera = isPrimary && stats.active ? camera : null;
    try {
      return originalRender.call(this, renderScene, camera, ...rest);
    } finally {
      activeRenderCamera = previousActive;
      if (isPrimary) {
        if (scene.onBeforeRender === stackedOnBeforeRender) {
          scene.onBeforeRender = previousOnBeforeRender;
        }
        restoreFrustumCulling();
      }
    }
  };

  renderer.renderBufferDirect = function (camera, renderScene, geometry, material, object, group) {
    if (activeRenderCamera === camera && renderScene === scene) {
      prepareFloorCameras(camera);
      camera = floorCameras.get(overviewFloorId(object))?.camera || camera;
    }
    return originalRenderBufferDirect.call(this, camera, renderScene, geometry, material, object, group);
  };

  return {
    stats,
    cameraForFloor,
    rayForFloor(floorId, pointer, raycaster) {
      const baseCamera = getCamera();
      const floorCamera = cameraForFloor(floorId, baseCamera);
      if (floorCamera === baseCamera) {
        raycaster.setFromCamera(pointer, baseCamera);
        return raycaster;
      }
      const origin = new THREE.Vector3(pointer.x, pointer.y, -1).unproject(floorCamera);
      const direction = new THREE.Vector3(pointer.x, pointer.y, 1)
        .unproject(floorCamera)
        .sub(origin)
        .normalize();
      raycaster.set(origin, direction);
      raycaster.camera = floorCamera;
      return raycaster;
    },
    reflectionCamera(camera, object) {
      return this.captureCamera(camera, object);
    },
    captureCamera(camera, object) {
      if (!currentLayout()) {
        return camera;
      }
      const baseCamera = getCamera();
      // Mirrored / off-axis cameras keep their own projection (e.g. ground reflection flips).
      // Only the primary overview camera needs the stacked floor projection remap.
      if (camera !== baseCamera) {
        return camera;
      }
      baseCamera.updateWorldMatrix(true, false);
      prepareFloorCameras(baseCamera);
      return floorCameras.get(overviewFloorId(object))?.camera || camera;
    },
    presentationPoint(floorId, point) {
      const baseCamera = getCamera();
      const floorCamera = cameraForFloor(floorId, baseCamera);
      if (floorCamera === baseCamera) {
        return point;
      }
      return point.project(floorCamera).unproject(baseCamera);
    },
    dispose() {
      restoreFrustumCulling();
      floorCameras.clear();
      renderer.render = originalRender;
      renderer.renderBufferDirect = originalRenderBufferDirect;
    }
  };
}
