export function createReflectionCulling(Matrix4) {
  const items = new WeakMap();
  const get2 = new WeakMap();
  const get3 = new WeakMap();
  const length = [];
  const push = [];
  const w = new Matrix4.Vector4();
  const set = new Matrix4.Matrix4();
  const copy2 = new Matrix4.Matrix4();
  const setFromProjectionMatrix = new Matrix4.Frustum();
  const tested = {
    tested: 0,
    culled: 0,
    skippedCaptures: 0
  };
  const value14 = isShaderMaterial => !isShaderMaterial || isShaderMaterial.isShaderMaterial || isShaderMaterial.displacementMap;
  function fn(attributes) {
    const version = attributes.attributes.position;
    const attribute = items.get(attributes);
    if (!attribute || attribute.attribute !== version || attribute.version !== version?.version || attribute.dataVersion !== version?.data?.version) {
      attributes.computeBoundingBox();
      items.set(attributes, {
        attribute: version,
        version: version?.version,
        dataVersion: version?.data?.version
      });
    }
    return attributes.boundingBox;
  }
  function fn2(geometry) {
    const isEmpty = fn(geometry.geometry);
    if (!isEmpty || isEmpty.isEmpty()) {
      return null;
    }
    let copy = get2.get(geometry);
    if (!copy) {
      copy = new Matrix4.Box3();
      get2.set(geometry, copy);
    }
    return copy.copy(isEmpty).applyMatrix4(geometry.matrixWorld);
  }
  function reset() {
    restore();
    length.length = 0;
    tested.tested = tested.culled = tested.skippedCaptures = 0;
  }
  function add(material, arg = false) {
    if (!material.isMesh || !material.visible || !material.frustumCulled || arg && material.castShadow || material.children.length || material.isSkinnedMesh || material.isInstancedMesh || material.morphTargetInfluences?.length || !material.geometry?.attributes.position || (Array.isArray(material.material) ? material.material.some(value14) : value14(material.material))) {
      return;
    }
    const min = fn2(material);
    if (min && Number.isFinite(min.min.x + min.min.y + min.min.z + min.max.x + min.max.y + min.max.z)) {
      let value4 = get3.get(material);
      if (!value4) {
        value4 = {
          object: material,
          box: min
        };
        get3.set(material, value4);
      }
      length.push(value4);
    }
  }
  function begin(source, projectionMatrix) {
    restore();
    const max = fn2(source.source);
    let value9 = Infinity;
    let value10 = Infinity;
    let value11 = -Infinity;
    let value12 = -Infinity;
    let value13 = !!max;
    if (max) {
      for (let value3 = 0; value3 < 8; value3++) {
        w.set(value3 & 1 ? max.max.x : max.min.x, value3 & 2 ? max.max.y : max.min.y, value3 & 4 ? max.max.z : max.min.z, 1).applyMatrix4(source.matrix);
        if (w.w <= 0.00001) {
          value13 = false;
          break;
        }
        const value = w.x / w.w;
        const value2 = w.y / w.w;
        value9 = Math.min(value9, value);
        value11 = Math.max(value11, value);
        value10 = Math.min(value10, value2);
        value12 = Math.max(value12, value2);
      }
    }
    copy2.copy(projectionMatrix.projectionMatrix);
    if (value13) {
      const value5 = 0.013671875 + 2 / source.map.width;
      value9 = Math.max(0, value9 - value5);
      value10 = Math.max(0, value10 - value5);
      value11 = Math.min(1, value11 + value5);
      value12 = Math.min(1, value12 + value5);
      if (value11 <= value9 || value12 <= value10) {
        tested.skippedCaptures++;
        return false;
      }
      const value6 = value11 - value9;
      const value7 = value12 - value10;
      set.set(1 / value6, 0, 0, -(value9 + value11 - 1) / value6, 0, 1 / value7, 0, -(value10 + value12 - 1) / value7, 0, 0, 1, 0, 0, 0, 0, 1);
      copy2.premultiply(set);
    }
    setFromProjectionMatrix.setFromProjectionMatrix(copy2.multiply(projectionMatrix.matrixWorldInverse));
    for (const {
      object: visible,
      box: value8
    } of length) {
      tested.tested++;
      if (!setFromProjectionMatrix.intersectsBox(value8)) {
        push.push(visible);
        visible.visible = false;
        tested.culled++;
      }
    }
    return true;
  }
  function restore() {
    for (const visible2 of push) {
      visible2.visible = true;
    }
    push.length = 0;
  }
  return {
    reset,
    add,
    begin,
    restore,
    stats: tested
  };
}
