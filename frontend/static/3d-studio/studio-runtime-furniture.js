export const RUNTIME_FURNITURE_TYPES = new Set(["bed", "sofa", "cabinet", "desk", "nightstand"]);
export function compactRuntimeFurniture(
  root,
  furnitureEntries,
  { THREE: THREE, mergeGeometries: mergeGeometries, materialKey: materialKey }
) {
  const groupedMeshes = new Map();
  const cloneByMaterial = new Map();
  const replacedGeometries = new Set();
  const replacedMaterials = new Set();
  const stats = {
    before: 0,
    after: 0,
    triangles: 0,
    vertexBytes: 0,
    types: []
  };
  const usedTypes = new Set();
  root.updateMatrixWorld(true);
  const rootInverseMatrix = root.matrixWorld.clone().invert();
  for (const { item: item, group: itemGroup } of furnitureEntries) {
    if (!!RUNTIME_FURNITURE_TYPES.has(item.type) && itemGroup.parent === root) {
      itemGroup.traverse(node => {
        const material = node.material;
        const geometry = node.geometry;
        if (
          !node.isMesh ||
          node.isInstancedMesh ||
          node.children.length ||
          !geometry?.attributes.position ||
          !geometry.attributes.normal ||
          geometry.drawRange.start !== 0 ||
          geometry.drawRange.count !== Infinity ||
          node.matrixWorld.determinant() <= 0 ||
          !materialKey(node, true, true) ||
          Object.values(material).some(materialValue => materialValue?.isTexture) ||
          (material.vertexColors && geometry.attributes.color?.itemSize !== 3)
        ) {
          return;
        }
        for (let ancestor = node; ancestor && ancestor !== root; ancestor = ancestor.parent) {
          if (!ancestor.visible) {
            return;
          }
        }
        let clonedMaterial = cloneByMaterial.get(material);
        if (!clonedMaterial) {
          clonedMaterial = material.clone();
          clonedMaterial.color.setRGB(1, 1, 1);
          clonedMaterial.vertexColors = true;
          clonedMaterial.roughness = clonedMaterial.metalness = 1;
          cloneByMaterial.set(material, clonedMaterial);
        }
        const materialProxy = Object.create(node);
        materialProxy.material = clonedMaterial;
        const groupKey = materialKey(materialProxy, true, false);
        if (groupKey) {
          if (!groupedMeshes.has(groupKey)) {
            groupedMeshes.set(groupKey, []);
          }
          groupedMeshes.get(groupKey).push({
            mesh: node,
            type: item.type,
            id: item.id
          });
        }
      });
    }
  }
  for (const meshEntries of groupedMeshes.values()) {
    if (meshEntries.length < 2) {
      continue;
    }
    const geometries = meshEntries.map(({ mesh: entry }) => {
      const sourceGeometry = entry.geometry;
      const preparedGeometry = new THREE.BufferGeometry();
      const vertexCount = sourceGeometry.attributes.position.count;
      for (const attributeName of ["position", "normal"]) {
        const sourceAttribute = sourceGeometry.attributes[attributeName];
        const positionData = new Float32Array(vertexCount * 3);
        for (let vertexIndex = 0; vertexIndex < vertexCount; vertexIndex++) {
          positionData[vertexIndex * 3] = sourceAttribute.getX(vertexIndex);
          positionData[vertexIndex * 3 + 1] = sourceAttribute.getY(vertexIndex);
          positionData[vertexIndex * 3 + 2] = sourceAttribute.getZ(vertexIndex);
        }
        preparedGeometry.setAttribute(attributeName, new THREE.BufferAttribute(positionData, 3));
      }
      const colorData = new Float32Array(vertexCount * 3);
      const surfaceData = new Float32Array(vertexCount * 2);
      const sourceMaterial = entry.material;
      const vertexColorAttribute = sourceGeometry.attributes.color;
      for (let vertexCursor = 0; vertexCursor < vertexCount; vertexCursor++) {
        colorData[vertexCursor * 3] =
          sourceMaterial.color.r *
          (sourceMaterial.vertexColors ? vertexColorAttribute.getX(vertexCursor) : 1);
        colorData[vertexCursor * 3 + 1] =
          sourceMaterial.color.g *
          (sourceMaterial.vertexColors ? vertexColorAttribute.getY(vertexCursor) : 1);
        colorData[vertexCursor * 3 + 2] =
          sourceMaterial.color.b *
          (sourceMaterial.vertexColors ? vertexColorAttribute.getZ(vertexCursor) : 1);
        surfaceData[vertexCursor * 2] = sourceMaterial.roughness;
        surfaceData[vertexCursor * 2 + 1] = sourceMaterial.metalness;
      }
      preparedGeometry.setAttribute("color", new THREE.BufferAttribute(colorData, 3));
      preparedGeometry.setAttribute("runtimeSurface", new THREE.BufferAttribute(surfaceData, 2));
      const indexData = new Uint32Array(
        sourceGeometry.index ? sourceGeometry.index.count : vertexCount
      );
      for (let indexCursor = 0; indexCursor < indexData.length; indexCursor++) {
        indexData[indexCursor] = sourceGeometry.index
          ? sourceGeometry.index.getX(indexCursor)
          : indexCursor;
      }
      preparedGeometry.setIndex(new THREE.BufferAttribute(indexData, 1));
      return preparedGeometry.applyMatrix4(
        new THREE.Matrix4().multiplyMatrices(rootInverseMatrix, entry.matrixWorld)
      );
    });
    const mergedGeometry = mergeGeometries(geometries);
    geometries.forEach(mergedPiece => mergedPiece.dispose());
    if (!mergedGeometry) {
      continue;
    }
    const firstMesh = meshEntries[0].mesh;
    const mergedMaterial = cloneByMaterial.get(firstMesh.material).clone();
    mergedMaterial.onBeforeCompile = shader => {
      shader.vertexShader =
        "attribute vec2 runtimeSurface;\nvarying vec2 vRuntimeSurface;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvRuntimeSurface = runtimeSurface;"
      );
      shader.fragmentShader = "varying vec2 vRuntimeSurface;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor *= vRuntimeSurface.x;"
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <metalnessmap_fragment>",
        "#include <metalnessmap_fragment>\nmetalnessFactor *= vRuntimeSurface.y;"
      );
    };
    mergedMaterial.customProgramCacheKey = () => "runtime-furniture-surface-v1";
    const mergedMesh = new THREE.Mesh(mergedGeometry, mergedMaterial);
    mergedMesh.name = "runtime-compact-furniture";
    mergedMesh.castShadow = firstMesh.castShadow;
    mergedMesh.receiveShadow = firstMesh.receiveShadow;
    mergedMesh.renderOrder = firstMesh.renderOrder;
    mergedMesh.layers.mask = firstMesh.layers.mask;
    mergedMesh.userData.modelLayer = "items";
    mergedMesh.userData.exportRole = "plan";
    mergedMesh.userData.runtimeFurnitureItemIds = meshEntries.map(itemId => itemId.id);
    mergedMesh.userData.runtimeFurnitureStats = {
      before: meshEntries.length,
      after: 1,
      triangles: mergedGeometry.index.count / 3
    };
    for (const { mesh: removedMesh, type: removedType } of meshEntries) {
      usedTypes.add(removedType);
      removedMesh.removeFromParent();
      if (
        !Object.entries(removedMesh.userData).some(
          ([userDataKey, userDataValue]) => userDataKey.endsWith("SharedGeometry") && userDataValue
        )
      ) {
        replacedGeometries.add(removedMesh.geometry);
      }
      if (
        !Object.entries(removedMesh.userData).some(
          ([sharedKey, sharedValue]) => sharedKey.endsWith("SharedMaterial") && sharedValue
        )
      ) {
        replacedMaterials.add(removedMesh.material);
      }
    }
    stats.before += meshEntries.length;
    stats.after++;
    stats.triangles += mergedGeometry.index.count / 3;
    stats.vertexBytes += Object.values(mergedGeometry.attributes).reduce(
      (totalBytes, attribute) => totalBytes + attribute.array.byteLength,
      mergedGeometry.index.array.byteLength
    );
    root.add(mergedMesh);
  }
  for (const cachedMaterial of cloneByMaterial.values()) {
    cachedMaterial.dispose();
  }
  root.traverse(traversedNode => {
    if (traversedNode.geometry) {
      replacedGeometries.delete(traversedNode.geometry);
    }
    for (const nodeMaterial of Array.isArray(traversedNode.material)
      ? traversedNode.material
      : traversedNode.material
        ? [traversedNode.material]
        : []) {
      replacedMaterials.delete(nodeMaterial);
    }
  });
  for (const unusedGeometry of replacedGeometries) {
    unusedGeometry.dispose();
  }
  for (const unusedMaterial of replacedMaterials) {
    unusedMaterial.dispose();
  }
  stats.types = [...usedTypes];
  root.userData.runtimeFurnitureBatchStats = stats;
  return stats;
}
