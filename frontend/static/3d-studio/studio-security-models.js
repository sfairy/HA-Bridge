export function addSecurityModel(THREE, parent, dimensions, palette) {
  const {
    width,
    depth,
    height
  } = dimensions;
  const materials = {
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
  const addMesh = (geometry, materialKey, x, y, z, scale) => {
    const mesh = new THREE.Mesh(geometry, materials[materialKey]);
    mesh.position.set(x, y, z);
    scale && mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const addCylinder = (radiusTop, radiusBottom, cylinderHeight, centerY, materialKey = 'shell') => addMesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, cylinderHeight, 24), materialKey, 0, centerY, 0);
  const addEllipsoid = (materialKey, x, y, z, scaleX, scaleY, scaleZ) => addMesh(new THREE.SphereGeometry(1, 24, 16), materialKey, x, y, z, [scaleX, scaleY, scaleZ]);
  if (dimensions.type === 'camera') {
    addCylinder(width * 0.35, width * 0.36, height * 0.075, height * 0.0375, 'trim');
    addCylinder(width * 0.27, width * 0.4, height * 0.35, height * 0.245);
    addEllipsoid('shell', 0, height * 0.71, 0, width * 0.49, height * 0.29, depth * 0.48);
    addEllipsoid('dark', 0, height * 0.71, depth * 0.34, width * 0.385, height * 0.215, depth * 0.16);
    for (const lensOffsetX of [-width * 0.145, width * 0.145]) {
      const lensHousing = addMesh(new THREE.CylinderGeometry(width * 0.115, width * 0.115, depth * 0.065, 20), 'trim', lensOffsetX, height * 0.71, depth * 0.485);
      lensHousing.rotation.x = Math.PI / 2;
      const lensGlass = addMesh(new THREE.CylinderGeometry(width * 0.078, width * 0.078, depth * 0.018, 20), 'lens', lensOffsetX, height * 0.71, depth * 0.525);
      lensGlass.rotation.x = Math.PI / 2;
      addEllipsoid('trim', lensOffsetX - width * 0.018, height * 0.733, depth * 0.538, width * 0.018, height * 0.01, depth * 0.006);
    }
    const statusRing = addMesh(new THREE.TorusGeometry(width * 0.043, width * 0.006, 4, 20), 'trim', 0, height * 0.3, depth * 0.355);
    statusRing.rotation.x = 0.1;
  } else {
    addCylinder(width * 0.09, width * 0.49, height * 0.31, height * 0.155);
    addCylinder(width * 0.065, width * 0.065, height * 0.18, height * 0.38, 'trim');
    addCylinder(width * 0.44, width * 0.44, height * 0.43, height * 0.755);
    addCylinder(width * 0.45, width * 0.45, height * 0.035, height * 0.9825, 'trim');
    addCylinder(width * 0.45, width * 0.45, height * 0.04, height * 0.52, 'trim');
    const sensorWindow = addMesh(new THREE.CylinderGeometry(width * 0.446, width * 0.446, height * 0.31, 16, 1, true, -Math.PI * 0.36, Math.PI * 0.72), 'trim', 0, height * 0.755, 0);
    sensorWindow.scale.z = depth / width;
  }
  if (dimensions.type === 'presence') {
    for (const child of parent.children) {
      (child.geometry?.type !== 'CylinderGeometry' || !child.geometry.parameters.openEnded) && (child.scale.z = depth / width);
    }
  }
  const usedMaterials = new Set(parent.children.map(child => child.material));
  for (const material of Object.values(materials)) {
    usedMaterials.has(material) || material.dispose();
  }
  return parent;
}
