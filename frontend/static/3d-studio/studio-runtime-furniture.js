export const RUNTIME_FURNITURE_TYPES = new Set(["bed", "sofa", "cabinet", "desk", "nightstand"]);
export function compactRuntimeFurniture(root, furnitureEntries, {
  THREE,
  mergeGeometries,
  materialKey
}) {
  const batchesByKey = new Map();
  const whitenedMaterials = new Map();
  const geometriesToDispose = new Set();
  const materialsToDispose = new Set();
  const stats = {
    before: 0,
    after: 0,
    triangles: 0,
    vertexBytes: 0,
    types: []
  };
  const compactedTypes = new Set();
  root.updateMatrixWorld(true);
  const rootInverse = root.matrixWorld.clone().invert();
  for (const {
    item,
    group
  } of furnitureEntries) {
    if (!!RUNTIME_FURNITURE_TYPES.has(item.type) && group.parent === root) {
      group.traverse(mesh => {
        const material = mesh.material;
        const geometry = mesh.geometry;
        if (!mesh.isMesh || mesh.isInstancedMesh || mesh.children.length || !geometry?.attributes.position || !geometry.attributes.normal || geometry.drawRange.start !== 0 || geometry.drawRange.count !== Infinity || mesh.matrixWorld.determinant() <= 0 || !materialKey(mesh, true, true) || Object.values(material).some(texture => texture?.isTexture) || material.vertexColors && geometry.attributes.color?.itemSize !== 3) {
          return;
        }
        for (let ancestor = mesh; ancestor && ancestor !== root; ancestor = ancestor.parent) {
          if (!ancestor.visible) {
            return;
          }
        }
        let whitened = whitenedMaterials.get(material);
        if (!whitened) {
          whitened = material.clone();
          whitened.color.setRGB(1, 1, 1);
          whitened.vertexColors = true;
          whitened.roughness = whitened.metalness = 1;
          whitenedMaterials.set(material, whitened);
        }
        const proxy = Object.create(mesh);
        proxy.material = whitened;
        const key = materialKey(proxy, true, false);
        if (key) {
          if (!batchesByKey.has(key)) {
            batchesByKey.set(key, []);
          }
          batchesByKey.get(key).push({
            mesh,
            type: item.type,
            id: item.id
          });
        }
      });
    }
  }
  for (const batch of batchesByKey.values()) {
    if (batch.length < 2) {
      continue;
    }
    const transformedGeometries = batch.map(({
      mesh
    }) => {
      const sourceGeometry = mesh.geometry;
      const bufferGeometry = new THREE.BufferGeometry();
      const vertexCount = sourceGeometry.attributes.position.count;
      for (const attributeName of ["position", "normal"]) {
        const attribute = sourceGeometry.attributes[attributeName];
        const array = new Float32Array(vertexCount * 3);
        for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex++) {
          array[vertexIndex * 3] = attribute.getX(vertexIndex);
          array[vertexIndex * 3 + 1] = attribute.getY(vertexIndex);
          array[vertexIndex * 3 + 2] = attribute.getZ(vertexIndex);
        }
        bufferGeometry.setAttribute(attributeName, new THREE.BufferAttribute(array, 3));
      }
      const colorArray = new Float32Array(vertexCount * 3);
      const surfaceArray = new Float32Array(vertexCount * 2);
      const meshMaterial = mesh.material;
      const colorAttribute = sourceGeometry.attributes.color;
      for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex++) {
        colorArray[vertexIndex * 3] = meshMaterial.color.r * (meshMaterial.vertexColors ? colorAttribute.getX(vertexIndex) : 1);
        colorArray[vertexIndex * 3 + 1] = meshMaterial.color.g * (meshMaterial.vertexColors ? colorAttribute.getY(vertexIndex) : 1);
        colorArray[vertexIndex * 3 + 2] = meshMaterial.color.b * (meshMaterial.vertexColors ? colorAttribute.getZ(vertexIndex) : 1);
        surfaceArray[vertexIndex * 2] = meshMaterial.roughness;
        surfaceArray[vertexIndex * 2 + 1] = meshMaterial.metalness;
      }
      bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
      bufferGeometry.setAttribute("runtimeSurface", new THREE.BufferAttribute(surfaceArray, 2));
      const indexArray = new Uint32Array(sourceGeometry.index ? sourceGeometry.index.count : vertexCount);
      for (let index = 0; index < indexArray.length; index++) {
        indexArray[index] = sourceGeometry.index ? sourceGeometry.index.getX(index) : index;
      }
      bufferGeometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
      return bufferGeometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(rootInverse, mesh.matrixWorld));
    });
    const mergedGeometry = mergeGeometries(transformedGeometries);
    transformedGeometries.forEach(geometry => geometry.dispose());
    if (!mergedGeometry) {
      continue;
    }
    const templateMesh = batch[0].mesh;
    const compiledMaterial = whitenedMaterials.get(templateMesh.material).clone();
    compiledMaterial.onBeforeCompile = shader => {
      shader.vertexShader = "attribute vec2 runtimeSurface;\nvarying vec2 vRuntimeSurface;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvRuntimeSurface = runtimeSurface;");
      shader.fragmentShader = "varying vec2 vRuntimeSurface;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor *= vRuntimeSurface.x;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor *= vRuntimeSurface.y;");
    };
    compiledMaterial.customProgramCacheKey = () => "runtime-furniture-surface-v1";
    const compactMesh = new THREE.Mesh(mergedGeometry, compiledMaterial);
    compactMesh.name = "runtime-compact-furniture";
    compactMesh.castShadow = templateMesh.castShadow;
    compactMesh.receiveShadow = templateMesh.receiveShadow;
    compactMesh.renderOrder = templateMesh.renderOrder;
    compactMesh.layers.mask = templateMesh.layers.mask;
    compactMesh.userData.modelLayer = "items";
    compactMesh.userData.exportRole = "plan";
    compactMesh.userData.runtimeFurnitureItemIds = batch.map(entry => entry.id);
    compactMesh.userData.runtimeFurnitureStats = {
      before: batch.length,
      after: 1,
      triangles: mergedGeometry.index.count / 3
    };
    for (const {
      mesh,
      type
    } of batch) {
      compactedTypes.add(type);
      mesh.removeFromParent();
      if (!Object.entries(mesh.userData).some(([key, shared]) => key.endsWith("SharedGeometry") && shared)) {
        geometriesToDispose.add(mesh.geometry);
      }
      if (!Object.entries(mesh.userData).some(([key, shared]) => key.endsWith("SharedMaterial") && shared)) {
        materialsToDispose.add(mesh.material);
      }
    }
    stats.before += batch.length;
    stats.after++;
    stats.triangles += mergedGeometry.index.count / 3;
    stats.vertexBytes += Object.values(mergedGeometry.attributes).reduce((total, attribute) => total + attribute.array.byteLength, mergedGeometry.index.array.byteLength);
    root.add(compactMesh);
  }
  for (const material of whitenedMaterials.values()) {
    material.dispose();
  }
  root.traverse(object => {
    if (object.geometry) {
      geometriesToDispose.delete(object.geometry);
    }
    for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) {
      materialsToDispose.delete(material);
    }
  });
  for (const geometry of geometriesToDispose) {
    geometry.dispose();
  }
  for (const material of materialsToDispose) {
    material.dispose();
  }
  stats.types = [...compactedTypes];
  root.userData.runtimeFurnitureBatchStats = stats;
  return stats;
}
