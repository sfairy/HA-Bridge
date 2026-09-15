export function addSecurityModel(THREE, modelGroup, modelSpec, palette) {
  const { width: modelWidth, depth: modelDepth, height: modelHeight } = modelSpec;
  const materialsByPart = {
    shell: new THREE.MeshStandardMaterial({
      color: palette.applianceSoft ?? palette.furnitureLight,
      roughness: 0.5
    }),
    trim: new THREE.MeshStandardMaterial({
      color: palette.appliance ?? palette.furniture,
      roughness: 0.42
    }),
    dark: new THREE.MeshStandardMaterial({
      color: palette.applianceDark ?? palette.furnitureDark,
      roughness: 0.23,
      metalness: 0.12
    }),
    lens: new THREE.MeshStandardMaterial({
      color: palette.furnitureDark,
      roughness: 0.12,
      metalness: 0.3
    })
  };
  const addPartMesh = (geometry, materialKey, positionX, positionY, positionZ, scaleFactors) => {
    const mesh = new THREE.Mesh(geometry, materialsByPart[materialKey]);
    mesh.position.set(positionX, positionY, positionZ);
    if (scaleFactors) {
      mesh.scale.set(...scaleFactors);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    modelGroup.add(mesh);
    return mesh;
  };
  const addCylinderPart = (topRadius, bottomRadius, partHeight, partY, partMaterial = "shell") =>
    addPartMesh(
      new THREE.CylinderGeometry(topRadius, bottomRadius, partHeight, 24),
      partMaterial,
      0,
      partY,
      0
    );
  const addSpherePart = (sphereMaterial, sphereX, sphereY, sphereZ, scaleX, scaleY, scaleZ) =>
    addPartMesh(new THREE.SphereGeometry(1, 24, 16), sphereMaterial, sphereX, sphereY, sphereZ, [
      scaleX,
      scaleY,
      scaleZ
    ]);
  if (modelSpec.type === "camera") {
    addCylinderPart(
      modelWidth * 0.35,
      modelWidth * 0.36,
      modelHeight * 0.075,
      modelHeight * 0.0375,
      "trim"
    );
    addCylinderPart(modelWidth * 0.27, modelWidth * 0.4, modelHeight * 0.35, modelHeight * 0.245);
    addSpherePart(
      "shell",
      0,
      modelHeight * 0.71,
      0,
      modelWidth * 0.49,
      modelHeight * 0.29,
      modelDepth * 0.48
    );
    addSpherePart(
      "dark",
      0,
      modelHeight * 0.71,
      modelDepth * 0.34,
      modelWidth * 0.385,
      modelHeight * 0.215,
      modelDepth * 0.16
    );
    for (const lensOffsetX of [-modelWidth * 0.145, modelWidth * 0.145]) {
      const lensBarrelMesh = addPartMesh(
        new THREE.CylinderGeometry(modelWidth * 0.115, modelWidth * 0.115, modelDepth * 0.065, 20),
        "trim",
        lensOffsetX,
        modelHeight * 0.71,
        modelDepth * 0.485
      );
      lensBarrelMesh.rotation.x = Math.PI / 2;
      const lensGlassMesh = addPartMesh(
        new THREE.CylinderGeometry(modelWidth * 0.078, modelWidth * 0.078, modelDepth * 0.018, 20),
        "lens",
        lensOffsetX,
        modelHeight * 0.71,
        modelDepth * 0.525
      );
      lensGlassMesh.rotation.x = Math.PI / 2;
      addSpherePart(
        "trim",
        lensOffsetX - modelWidth * 0.018,
        modelHeight * 0.733,
        modelDepth * 0.538,
        modelWidth * 0.018,
        modelHeight * 0.01,
        modelDepth * 0.006
      );
    }
    const mountRingMesh = addPartMesh(
      new THREE.TorusGeometry(modelWidth * 0.043, modelWidth * 0.006, 4, 20),
      "trim",
      0,
      modelHeight * 0.3,
      modelDepth * 0.355
    );
    mountRingMesh.rotation.x = 0.1;
  } else {
    addCylinderPart(modelWidth * 0.09, modelWidth * 0.49, modelHeight * 0.31, modelHeight * 0.155);
    addCylinderPart(
      modelWidth * 0.065,
      modelWidth * 0.065,
      modelHeight * 0.18,
      modelHeight * 0.38,
      "trim"
    );
    addCylinderPart(modelWidth * 0.44, modelWidth * 0.44, modelHeight * 0.43, modelHeight * 0.755);
    addCylinderPart(
      modelWidth * 0.45,
      modelWidth * 0.45,
      modelHeight * 0.035,
      modelHeight * 0.9825,
      "trim"
    );
    addCylinderPart(
      modelWidth * 0.45,
      modelWidth * 0.45,
      modelHeight * 0.04,
      modelHeight * 0.52,
      "trim"
    );
    const sensorBodyMesh = addPartMesh(
      new THREE.CylinderGeometry(
        modelWidth * 0.446,
        modelWidth * 0.446,
        modelHeight * 0.31,
        16,
        1,
        true,
        -Math.PI * 0.36,
        Math.PI * 0.72
      ),
      "trim",
      0,
      modelHeight * 0.755,
      0
    );
    sensorBodyMesh.scale.z = modelDepth / modelWidth;
  }
  if (modelSpec.type === "presence") {
    for (const childMesh of modelGroup.children) {
      if (
        childMesh.geometry?.type !== "CylinderGeometry" ||
        !childMesh.geometry.parameters.openEnded
      ) {
        childMesh.scale.z = modelDepth / modelWidth;
      }
    }
  }
  const usedMaterials = new Set(modelGroup.children.map(child => child.material));
  for (const material of Object.values(materialsByPart)) {
    if (!usedMaterials.has(material)) {
      material.dispose();
    }
  }
  return modelGroup;
}
