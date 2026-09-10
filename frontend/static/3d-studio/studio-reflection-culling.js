export function createReflectionCulling(THREE) {
  const geometryBoundsCache = new WeakMap();
  const worldBoxCache = new WeakMap();
  const entryCache = new WeakMap();
  const candidates = [];
  const hidden = [];
  const corner = new THREE.Vector4();
  const cropMatrix = new THREE.Matrix4();
  const projection = new THREE.Matrix4();
  const frustum = new THREE.Frustum();
  const stats = {
    tested: 0,
    culled: 0,
    skippedCaptures: 0
  };
  const skipsCulling = material => !material || material.isShaderMaterial || material.displacementMap;
  function ensureGeometryBounds(geometry) {
    const position = geometry.attributes.position;
    const cached = geometryBoundsCache.get(geometry);
    if (!cached || cached.attribute !== position || cached.version !== position?.version || cached.dataVersion !== position?.data?.version) {
      geometry.computeBoundingBox();
      geometryBoundsCache.set(geometry, {
        attribute: position,
        version: position?.version,
        dataVersion: position?.data?.version
      });
    }
    return geometry.boundingBox;
  }
  function worldBounds(object) {
    const localBox = ensureGeometryBounds(object.geometry);
    if (!localBox || localBox.isEmpty()) {
      return null;
    }
    let box = worldBoxCache.get(object);
    if (!box) {
      box = new THREE.Box3();
      worldBoxCache.set(object, box);
    }
    return box.copy(localBox).applyMatrix4(object.matrixWorld);
  }
  function reset() {
    restore();
    candidates.length = 0;
    stats.tested = stats.culled = stats.skippedCaptures = 0;
  }
  function add(object, skipShadowCasters = false) {
    if (!object.isMesh || !object.visible || !object.frustumCulled || skipShadowCasters && object.castShadow || object.children.length || object.isSkinnedMesh || object.isInstancedMesh || object.morphTargetInfluences?.length || !object.geometry?.attributes.position || (Array.isArray(object.material) ? object.material.some(skipsCulling) : skipsCulling(object.material))) {
      return;
    }
    const box = worldBounds(object);
    if (box && Number.isFinite(box.min.x + box.min.y + box.min.z + box.max.x + box.max.y + box.max.z)) {
      let entry = entryCache.get(object);
      if (!entry) {
        entry = {
          object,
          box
        };
        entryCache.set(object, entry);
      }
      candidates.push(entry);
    }
  }
  function begin(source, camera) {
    restore();
    const sourceBox = worldBounds(source.source);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let cropValid = !!sourceBox;
    if (sourceBox) {
      for (let cornerIndex = 0; cornerIndex < 8; cornerIndex++) {
        corner.set(cornerIndex & 1 ? sourceBox.max.x : sourceBox.min.x, cornerIndex & 2 ? sourceBox.max.y : sourceBox.min.y, cornerIndex & 4 ? sourceBox.max.z : sourceBox.min.z, 1).applyMatrix4(source.matrix);
        if (corner.w <= 0.00001) {
          cropValid = false;
          break;
        }
        const ndcX = corner.x / corner.w;
        const ndcY = corner.y / corner.w;
        minX = Math.min(minX, ndcX);
        maxX = Math.max(maxX, ndcX);
        minY = Math.min(minY, ndcY);
        maxY = Math.max(maxY, ndcY);
      }
    }
    projection.copy(camera.projectionMatrix);
    if (cropValid) {
      const padding = 0.013671875 + 2 / projection.map.width;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(1, maxX + padding);
      maxY = Math.min(1, maxY + padding);
      if (maxX <= minX || maxY <= minY) {
        stats.skippedCaptures++;
        return false;
      }
      const width = maxX - minX;
      const height = maxY - minY;
      cropMatrix.set(1 / width, 0, 0, -(minX + maxX - 1) / width, 0, 1 / height, 0, -(minY + maxY - 1) / height, 0, 0, 1, 0, 0, 0, 0, 1);
      projection.premultiply(cropMatrix);
    }
    frustum.setFromProjectionMatrix(projection.multiply(camera.matrixWorldInverse));
    for (const {
      object: mesh,
      box: meshBox
    } of candidates) {
      stats.tested++;
      if (!frustum.intersectsBox(meshBox)) {
        hidden.push(mesh);
        mesh.visible = false;
        stats.culled++;
      }
    }
    return true;
  }
  function restore() {
    for (const mesh of hidden) {
      mesh.visible = true;
    }
    hidden.length = 0;
  }
  return {
    reset,
    add,
    begin,
    restore,
    stats
  };
}
