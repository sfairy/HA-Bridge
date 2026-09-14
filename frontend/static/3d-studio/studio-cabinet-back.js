export function repairGlassCabinetBack(THREE, root, modelType = 'glasscabinet') {
  root.updateMatrixWorld(true);
  let backMesh;
  let shelfMesh;
  root.traverse(node => {
    if (!node.isMesh || Array.isArray(node.material)) {
      return;
    }
    if (node.material?.name === modelType + '-material-0') {
      backMesh = node;
    }
    if (node.material?.name === modelType + '-material-' + (modelType === 'bookcase' ? 7 : 10)) {
      shelfMesh = node;
    }
  });
  if (!backMesh || !shelfMesh) {
    return false;
  }
  backMesh.geometry.computeBoundingBox();
  shelfMesh.geometry.computeBoundingBox();
  const backBox = backMesh.geometry.boundingBox;
  const shelfBox = shelfMesh.geometry.boundingBox.clone().applyMatrix4(
    new THREE.Matrix4().copy(backMesh.matrixWorld).invert().multiply(shelfMesh.matrixWorld)
  );
  const backMinZ = Math.min(backBox.min.z, shelfBox.min.z) - 0.004;
  const geometry = new THREE.BoxGeometry(
    shelfBox.max.x - shelfBox.min.x,
    shelfBox.max.y - shelfBox.min.y,
    backBox.max.z - backMinZ
  );
  geometry.translate(
    (shelfBox.min.x + shelfBox.max.x) / 2,
    (shelfBox.min.y + shelfBox.max.y) / 2,
    (backMinZ + backBox.max.z) / 2
  );
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const previousGeometry = backMesh.geometry;
  backMesh.geometry = geometry;
  let geometryShared = false;
  root.traverse(node => {
    if (node !== backMesh && node.geometry === previousGeometry) {
      geometryShared = true;
    }
  });
  if (!geometryShared) {
    previousGeometry.dispose();
  }
  return true;
}

function mergeBoxGeometries(THREE, boxes) {
  const positions = [];
  const normals = [];
  const uvs = [];
  for (const [width, height, depth, x, y, z] of boxes) {
    const box = new THREE.BoxGeometry(width, height, depth);
    const nonIndexed = box.toNonIndexed();
    box.dispose();
    nonIndexed.translate(x, y, z);
    positions.push(...nonIndexed.attributes.position.array);
    normals.push(...nonIndexed.attributes.normal.array);
    uvs.push(...nonIndexed.attributes.uv.array);
    nonIndexed.dispose();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function repairWallCabinetSides(THREE, root) {
  const meshByMaterial = new Map();
  root.traverse(node => {
    if (node.isMesh && !Array.isArray(node.material)) {
      meshByMaterial.set(node.material?.name, node);
    }
  });
  const carcassMesh = meshByMaterial.get('wallcabinet-material-0');
  const sideMesh = meshByMaterial.get('wallcabinet-material-1');
  const trimMesh = meshByMaterial.get('wallcabinet-material-2');
  if (!carcassMesh || !sideMesh || !trimMesh) {
    return false;
  }
  for (const mesh of [carcassMesh, sideMesh, trimMesh]) {
    mesh.geometry.computeBoundingBox();
  }
  const carcassBox = carcassMesh.geometry.boundingBox;
  const sideBox = sideMesh.geometry.boundingBox;
  const trimBox = trimMesh.geometry.boundingBox;
  const carcassWidth = carcassBox.max.x - carcassBox.min.x;
  const sideDepth = sideBox.max.z - sideBox.min.z;
  const panelThickness = carcassBox.max.z - carcassBox.min.z;
  const centerX = (carcassBox.min.x + carcassBox.max.x) / 2;
  const centerZ = (sideBox.min.z + sideBox.max.z) / 2;
  const trimMinY = trimBox.min.y;
  const sideMaxY = sideBox.max.y;
  const trimMaxY = trimBox.max.y;
  const innerWidth = carcassWidth - panelThickness * 2;
  const replacements = [
    [
      sideMesh,
      mergeBoxGeometries(THREE, [
        [
          panelThickness,
          sideMaxY - trimMinY,
          sideDepth,
          centerX - (carcassWidth - panelThickness) / 2,
          (trimMinY + sideMaxY) / 2,
          centerZ
        ],
        [
          panelThickness,
          sideMaxY - trimMinY,
          sideDepth,
          centerX + (carcassWidth - panelThickness) / 2,
          (trimMinY + sideMaxY) / 2,
          centerZ
        ],
        [
          innerWidth,
          sideMaxY - trimMaxY,
          sideDepth,
          centerX,
          (trimMaxY + sideMaxY) / 2,
          centerZ
        ]
      ])
    ],
    [
      trimMesh,
      mergeBoxGeometries(THREE, [
        [
          innerWidth,
          panelThickness,
          sideDepth,
          centerX,
          trimMinY + panelThickness / 2,
          centerZ
        ],
        [
          innerWidth,
          panelThickness,
          sideDepth,
          centerX,
          trimMaxY - panelThickness / 2,
          centerZ
        ]
      ])
    ],
    [
      carcassMesh,
      mergeBoxGeometries(THREE, [
        [
          innerWidth,
          trimMaxY - trimMinY - panelThickness * 2,
          panelThickness,
          centerX,
          (trimMinY + trimMaxY) / 2,
          sideBox.min.z + panelThickness / 2
        ]
      ])
    ]
  ];
  for (const [mesh, geometry] of replacements) {
    const previousGeometry = mesh.geometry;
    mesh.geometry = geometry;
    let geometryShared = false;
    root.traverse(node => {
      if (node !== mesh && node.geometry === previousGeometry) {
        geometryShared = true;
      }
    });
    if (!geometryShared) {
      previousGeometry.dispose();
    }
  }
  return true;
}
