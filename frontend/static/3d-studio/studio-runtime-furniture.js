export const RUNTIME_FURNITURE_TYPES = new Set(["bed", "sofa", "cabinet", "desk", "nightstand"]);
export function compactRuntimeFurniture(updateMatrixWorld, arg4, {
  THREE: BufferAttribute,
  mergeGeometries: arg5,
  materialKey: arg6
}) {
  const map = new Map();
  const items = new Map();
  const add = new Set();
  const add2 = new Set();
  const before = {
    before: 0,
    after: 0,
    triangles: 0,
    vertexBytes: 0,
    types: []
  };
  const add3 = new Set();
  updateMatrixWorld.updateMatrixWorld(true);
  const value12 = updateMatrixWorld.matrixWorld.clone().invert();
  for (const {
    item: type,
    group: parent2
  } of arg4) {
    if (!!RUNTIME_FURNITURE_TYPES.has(type.type) && parent2.parent === updateMatrixWorld) {
      parent2.traverse(material => {
        const vertexColors = material.material;
        const attributes = material.geometry;
        if (!material.isMesh || material.isInstancedMesh || material.children.length || !attributes?.attributes.position || !attributes.attributes.normal || attributes.drawRange.start !== 0 || attributes.drawRange.count !== Infinity || material.matrixWorld.determinant() <= 0 || !arg6(material, true, true) || Object.values(vertexColors).some(isTexture => isTexture?.isTexture) || vertexColors.vertexColors && attributes.attributes.color?.itemSize !== 3) {
          return;
        }
        for (let parent = material; parent && parent !== updateMatrixWorld; parent = parent.parent) {
          if (!parent.visible) {
            return;
          }
        }
        let color = items.get(vertexColors);
        if (!color) {
          color = vertexColors.clone();
          color.color.setRGB(1, 1, 1);
          color.vertexColors = true;
          color.roughness = color.metalness = 1;
          items.set(vertexColors, color);
        }
        const material2 = Object.create(material);
        material2.material = color;
        const value6 = arg6(material2, true, false);
        if (value6) {
          if (!map.has(value6)) {
            map.set(value6, []);
          }
          map.get(value6).push({
            mesh: material,
            type: type.type,
            id: type.id
          });
        }
      });
    }
  }
  for (const length2 of map.values()) {
    if (length2.length < 2) {
      continue;
    }
    const forEach = length2.map(({
      mesh: geometry
    }) => {
      const index = geometry.geometry;
      const setAttribute = new BufferAttribute.BufferGeometry();
      const value7 = index.attributes.position.count;
      for (const value3 of ["position", "normal"]) {
        const getX = index.attributes[value3];
        const value2 = new Float32Array(value7 * 3);
        for (let value = 0; value < value7; value++) {
          value2[value * 3] = getX.getX(value);
          value2[value * 3 + 1] = getX.getY(value);
          value2[value * 3 + 2] = getX.getZ(value);
        }
        setAttribute.setAttribute(value3, new BufferAttribute.BufferAttribute(value2, 3));
      }
      const value8 = new Float32Array(value7 * 3);
      const value9 = new Float32Array(value7 * 2);
      const color2 = geometry.material;
      const getX2 = index.attributes.color;
      for (let value4 = 0; value4 < value7; value4++) {
        value8[value4 * 3] = color2.color.r * (color2.vertexColors ? getX2.getX(value4) : 1);
        value8[value4 * 3 + 1] = color2.color.g * (color2.vertexColors ? getX2.getY(value4) : 1);
        value8[value4 * 3 + 2] = color2.color.b * (color2.vertexColors ? getX2.getZ(value4) : 1);
        value9[value4 * 2] = color2.roughness;
        value9[value4 * 2 + 1] = color2.metalness;
      }
      setAttribute.setAttribute("color", new BufferAttribute.BufferAttribute(value8, 3));
      setAttribute.setAttribute("runtimeSurface", new BufferAttribute.BufferAttribute(value9, 2));
      const length = new Uint32Array(index.index ? index.index.count : value7);
      for (let value5 = 0; value5 < length.length; value5++) {
        length[value5] = index.index ? index.index.getX(value5) : value5;
      }
      setAttribute.setIndex(new BufferAttribute.BufferAttribute(length, 1));
      return setAttribute.applyMatrix4(new BufferAttribute.Matrix4().multiplyMatrices(value12, geometry.matrixWorld));
    });
    const index2 = arg5(forEach);
    forEach.forEach(dispose => dispose.dispose());
    if (!index2) {
      continue;
    }
    const material4 = length2[0].mesh;
    const onBeforeCompile = items.get(material4.material).clone();
    onBeforeCompile.onBeforeCompile = fragmentShader => {
      fragmentShader.vertexShader = "attribute vec2 runtimeSurface;\nvarying vec2 vRuntimeSurface;\n" + fragmentShader.vertexShader;
      fragmentShader.vertexShader = fragmentShader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvRuntimeSurface = runtimeSurface;");
      fragmentShader.fragmentShader = "varying vec2 vRuntimeSurface;\n" + fragmentShader.fragmentShader;
      fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor *= vRuntimeSurface.x;");
      fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor *= vRuntimeSurface.y;");
    };
    onBeforeCompile.customProgramCacheKey = () => "runtime-furniture-surface-v1";
    const userData2 = new BufferAttribute.Mesh(index2, onBeforeCompile);
    userData2.name = "runtime-compact-furniture";
    userData2.castShadow = material4.castShadow;
    userData2.receiveShadow = material4.receiveShadow;
    userData2.renderOrder = material4.renderOrder;
    userData2.layers.mask = material4.layers.mask;
    userData2.userData.modelLayer = "items";
    userData2.userData.exportRole = "plan";
    userData2.userData.runtimeFurnitureItemIds = length2.map(id => id.id);
    userData2.userData.runtimeFurnitureStats = {
      before: length2.length,
      after: 1,
      triangles: index2.index.count / 3
    };
    for (const {
      mesh: userData,
      type: value11
    } of length2) {
      add3.add(value11);
      userData.removeFromParent();
      if (!Object.entries(userData.userData).some(([endsWith, arg]) => endsWith.endsWith("SharedGeometry") && arg)) {
        add.add(userData.geometry);
      }
      if (!Object.entries(userData.userData).some(([endsWith2, arg2]) => endsWith2.endsWith("SharedMaterial") && arg2)) {
        add2.add(userData.material);
      }
    }
    before.before += length2.length;
    before.after++;
    before.triangles += index2.index.count / 3;
    before.vertexBytes += Object.values(index2.attributes).reduce((arg3, array) => arg3 + array.array.byteLength, index2.index.array.byteLength);
    updateMatrixWorld.add(userData2);
  }
  for (const dispose2 of items.values()) {
    dispose2.dispose();
  }
  updateMatrixWorld.traverse(material3 => {
    if (material3.geometry) {
      add.delete(material3.geometry);
    }
    for (const value10 of Array.isArray(material3.material) ? material3.material : material3.material ? [material3.material] : []) {
      add2.delete(value10);
    }
  });
  for (const dispose3 of add) {
    dispose3.dispose();
  }
  for (const dispose4 of add2) {
    dispose4.dispose();
  }
  before.types = [...add3];
  updateMatrixWorld.userData.runtimeFurnitureBatchStats = before;
  return before;
}
