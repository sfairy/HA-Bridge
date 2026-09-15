export function createReflectionCulling(THREE) {
  const boundsCacheByGeometry = new WeakMap();
  const boxCacheByMesh = new WeakMap();
  const entryCacheByMesh = new WeakMap();
  const candidateEntries = [];
  const hiddenMeshes = [];
  const scratchClipVector = new THREE.Vector4();
  const scratchNdcMatrix = new THREE.Matrix4();
  const scratchProjectionMatrix = new THREE.Matrix4();
  const scratchFrustum = new THREE.Frustum();
  const stats = {
    tested: 0,
    culled: 0,
    skippedCaptures: 0
  };
  const isUnsupportedMaterial = material =>
    !material || material.isShaderMaterial || material.displacementMap;
  function getGeometryBounds(geometry) {
    const positionAttribute = geometry.attributes.position;
    const cachedBounds = boundsCacheByGeometry.get(geometry);
    if (
      !cachedBounds ||
      cachedBounds.attribute !== positionAttribute ||
      cachedBounds.version !== positionAttribute?.version ||
      cachedBounds.dataVersion !== positionAttribute?.data?.version
    ) {
      geometry.computeBoundingBox();
      boundsCacheByGeometry.set(geometry, {
        attribute: positionAttribute,
        version: positionAttribute?.version,
        dataVersion: positionAttribute?.data?.version
      });
    }
    return geometry.boundingBox;
  }
  function getWorldBounds(mesh) {
    const localBounds = getGeometryBounds(mesh.geometry);
    if (!localBounds || localBounds.isEmpty()) {
      return null;
    }
    let cachedBox = boxCacheByMesh.get(mesh);
    if (!cachedBox) {
      cachedBox = {
        box: new THREE.Box3(),
        local: new THREE.Box3(),
        matrix: new THREE.Matrix4(),
        ready: false
      };
      boxCacheByMesh.set(mesh, cachedBox);
    }
    if (
      !cachedBox.ready ||
      !cachedBox.local.equals(localBounds) ||
      !cachedBox.matrix.equals(mesh.matrixWorld)
    ) {
      cachedBox.local.copy(localBounds);
      cachedBox.matrix.copy(mesh.matrixWorld);
      cachedBox.box.copy(localBounds).applyMatrix4(mesh.matrixWorld);
      cachedBox.ready = true;
    }
    return cachedBox.box;
  }
  function reset() {
    restore();
    candidateEntries.length = 0;
    stats.tested = stats.culled = stats.skippedCaptures = 0;
  }
  function add(candidateMesh, skipShadowCasters = false) {
    if (
      !candidateMesh.isMesh ||
      !candidateMesh.visible ||
      !candidateMesh.frustumCulled ||
      (skipShadowCasters && candidateMesh.castShadow) ||
      candidateMesh.children.length ||
      candidateMesh.isSkinnedMesh ||
      candidateMesh.isInstancedMesh ||
      candidateMesh.morphTargetInfluences?.length ||
      !candidateMesh.geometry?.attributes.position ||
      (Array.isArray(candidateMesh.material)
        ? candidateMesh.material.some(isUnsupportedMaterial)
        : isUnsupportedMaterial(candidateMesh.material))
    ) {
      return;
    }
    const worldBounds = getWorldBounds(candidateMesh);
    if (
      worldBounds &&
      Number.isFinite(
        worldBounds.min.x +
          worldBounds.min.y +
          worldBounds.min.z +
          worldBounds.max.x +
          worldBounds.max.y +
          worldBounds.max.z
      )
    ) {
      let entry = entryCacheByMesh.get(candidateMesh);
      if (!entry) {
        entry = {
          object: candidateMesh,
          box: worldBounds
        };
        entryCacheByMesh.set(candidateMesh, entry);
      }
      candidateEntries.push(entry);
    }
  }
  function begin(capture, camera) {
    restore();
    const sourceBounds = getWorldBounds(capture.source);
    let minU = Infinity;
    let minV = Infinity;
    let maxU = -Infinity;
    let maxV = -Infinity;
    let isInsideFrustum = !!sourceBounds;
    if (sourceBounds) {
      for (let cornerIndex = 0; cornerIndex < 8; cornerIndex++) {
        scratchClipVector
          .set(
            cornerIndex & 1 ? sourceBounds.max.x : sourceBounds.min.x,
            cornerIndex & 2 ? sourceBounds.max.y : sourceBounds.min.y,
            cornerIndex & 4 ? sourceBounds.max.z : sourceBounds.min.z,
            1
          )
          .applyMatrix4(capture.matrix);
        if (scratchClipVector.w <= 0.00001) {
          isInsideFrustum = false;
          break;
        }
        const projectedX = scratchClipVector.x / scratchClipVector.w;
        const projectedY = scratchClipVector.y / scratchClipVector.w;
        minU = Math.min(minU, projectedX);
        maxU = Math.max(maxU, projectedX);
        minV = Math.min(minV, projectedY);
        maxV = Math.max(maxV, projectedY);
      }
    }
    scratchProjectionMatrix.copy(camera.projectionMatrix);
    if (isInsideFrustum) {
      const edgePadding = 0.013671875 + 2 / capture.map.width;
      minU = Math.max(0, minU - edgePadding);
      minV = Math.max(0, minV - edgePadding);
      maxU = Math.min(1, maxU + edgePadding);
      maxV = Math.min(1, maxV + edgePadding);
      if (maxU <= minU || maxV <= minV) {
        stats.skippedCaptures++;
        return false;
      }
      const uSpan = maxU - minU;
      const vSpan = maxV - minV;
      scratchNdcMatrix.set(
        1 / uSpan,
        0,
        0,
        -(minU + maxU - 1) / uSpan,
        0,
        1 / vSpan,
        0,
        -(minV + maxV - 1) / vSpan,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
      scratchProjectionMatrix.premultiply(scratchNdcMatrix);
    }
    scratchFrustum.setFromProjectionMatrix(
      scratchProjectionMatrix.multiply(camera.matrixWorldInverse)
    );
    for (const { object: entryObject, box: entryBounds } of candidateEntries) {
      stats.tested++;
      if (!scratchFrustum.intersectsBox(entryBounds)) {
        hiddenMeshes.push(entryObject);
        entryObject.visible = false;
        stats.culled++;
      }
    }
    return true;
  }
  function restore() {
    for (const hiddenMesh of hiddenMeshes) {
      hiddenMesh.visible = true;
    }
    hiddenMeshes.length = 0;
  }
  return {
    reset: reset,
    add: add,
    begin: begin,
    restore: restore,
    stats: stats
  };
}
