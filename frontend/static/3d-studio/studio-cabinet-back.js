export function repairGlassCabinetBack(THREE, root, cabinetKind = "glasscabinet") {
  root.updateMatrixWorld(true);
  let panelMesh;
  let frameMesh;
  root.traverse(child => {
    if (!!child.isMesh && !Array.isArray(child.material)) {
      if (child.material?.name === cabinetKind + "-material-0") {
        panelMesh = child;
      }
      if (
        child.material?.name ===
        cabinetKind + "-material-" + (cabinetKind === "bookcase" ? 7 : 10)
      ) {
        frameMesh = child;
      }
    }
  });
  if (!panelMesh || !frameMesh) {
    return false;
  }
  panelMesh.geometry.computeBoundingBox();
  frameMesh.geometry.computeBoundingBox();
  const panelBounds = panelMesh.geometry.boundingBox;
  const frameBounds = frameMesh.geometry.boundingBox
    .clone()
    .applyMatrix4(
      new THREE.Matrix4().copy(panelMesh.matrixWorld).invert().multiply(frameMesh.matrixWorld)
    );
  const backFaceZ = Math.min(panelBounds.min.z, frameBounds.min.z) - 0.004;
  const repairGeometry = new THREE.BoxGeometry(
    frameBounds.max.x - frameBounds.min.x,
    frameBounds.max.y - frameBounds.min.y,
    panelBounds.max.z - backFaceZ
  );
  repairGeometry.translate(
    (frameBounds.min.x + frameBounds.max.x) / 2,
    (frameBounds.min.y + frameBounds.max.y) / 2,
    (backFaceZ + panelBounds.max.z) / 2
  );
  repairGeometry.computeBoundingBox();
  repairGeometry.computeBoundingSphere();
  const originalGeometry = panelMesh.geometry;
  panelMesh.geometry = repairGeometry;
  let isShared = false;
  root.traverse(traversedNode => {
    if (traversedNode !== panelMesh && traversedNode.geometry === originalGeometry) {
      isShared = true;
    }
  });
  if (!isShared) {
    originalGeometry.dispose();
  }
  return true;
}
function buildBoxGeometry(three, boxes) {
  const positions = [];
  const normals = [];
  const uvs = [];
  for (const [boxWidth, boxHeight, boxDepth, offsetX, offsetY, offsetZ] of boxes) {
    const boxGeometry = new three.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const nonIndexed = boxGeometry.toNonIndexed();
    boxGeometry.dispose();
    nonIndexed.translate(offsetX, offsetY, offsetZ);
    positions.push(...nonIndexed.attributes.position.array);
    normals.push(...nonIndexed.attributes.normal.array);
    uvs.push(...nonIndexed.attributes.uv.array);
    nonIndexed.dispose();
  }
  const geometry = new three.BufferGeometry();
  geometry.setAttribute("position", new three.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new three.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new three.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
export function repairWallCabinetSides(threeLib, meshRoot) {
  const meshByMaterialName = new Map();
  meshRoot.traverse(mesh => {
    if (mesh.isMesh && !Array.isArray(mesh.material)) {
      meshByMaterialName.set(mesh.material?.name, mesh);
    }
  });
  const leftPanelMesh = meshByMaterialName.get("wallcabinet-material-0");
  const sidePanelMesh = meshByMaterialName.get("wallcabinet-material-1");
  const topPanelMesh = meshByMaterialName.get("wallcabinet-material-2");
  if (!leftPanelMesh || !sidePanelMesh || !topPanelMesh) {
    return false;
  }
  for (const panelMeshEntry of [leftPanelMesh, sidePanelMesh, topPanelMesh]) {
    panelMeshEntry.geometry.computeBoundingBox();
  }
  const leftBounds = leftPanelMesh.geometry.boundingBox;
  const sideBounds = sidePanelMesh.geometry.boundingBox;
  const topBounds = topPanelMesh.geometry.boundingBox;
  const leftPanelWidth = leftBounds.max.x - leftBounds.min.x;
  const sidePanelDepth = sideBounds.max.z - sideBounds.min.z;
  const leftPanelDepth = leftBounds.max.z - leftBounds.min.z;
  const leftPanelCenterX = (leftBounds.min.x + leftBounds.max.x) / 2;
  const sidePanelCenterZ = (sideBounds.min.z + sideBounds.max.z) / 2;
  const bottomY = topBounds.min.y;
  const topY = sideBounds.max.y;
  const innerTopY = topBounds.max.y;
  const innerPanelWidth = leftPanelWidth - leftPanelDepth * 2;
  const repairs = [
    [
      sidePanelMesh,
      buildBoxGeometry(threeLib, [
        [
          leftPanelDepth,
          topY - bottomY,
          sidePanelDepth,
          leftPanelCenterX - (leftPanelWidth - leftPanelDepth) / 2,
          (bottomY + topY) / 2,
          sidePanelCenterZ
        ],
        [
          leftPanelDepth,
          topY - bottomY,
          sidePanelDepth,
          leftPanelCenterX + (leftPanelWidth - leftPanelDepth) / 2,
          (bottomY + topY) / 2,
          sidePanelCenterZ
        ],
        [
          innerPanelWidth,
          topY - innerTopY,
          sidePanelDepth,
          leftPanelCenterX,
          (innerTopY + topY) / 2,
          sidePanelCenterZ
        ]
      ])
    ],
    [
      topPanelMesh,
      buildBoxGeometry(threeLib, [
        [
          innerPanelWidth,
          leftPanelDepth,
          sidePanelDepth,
          leftPanelCenterX,
          bottomY + leftPanelDepth / 2,
          sidePanelCenterZ
        ],
        [
          innerPanelWidth,
          leftPanelDepth,
          sidePanelDepth,
          leftPanelCenterX,
          innerTopY - leftPanelDepth / 2,
          sidePanelCenterZ
        ]
      ])
    ],
    [
      leftPanelMesh,
      buildBoxGeometry(threeLib, [
        [
          innerPanelWidth,
          innerTopY - bottomY - leftPanelDepth * 2,
          leftPanelDepth,
          leftPanelCenterX,
          (bottomY + innerTopY) / 2,
          sideBounds.min.z + leftPanelDepth / 2
        ]
      ])
    ]
  ];
  for (const [targetMesh, replacementGeometry] of repairs) {
    const savedGeometry = targetMesh.geometry;
    targetMesh.geometry = replacementGeometry;
    let isReferenced = false;
    meshRoot.traverse(otherNode => {
      if (otherNode !== targetMesh && otherNode.geometry === savedGeometry) {
        isReferenced = true;
      }
    });
    if (!isReferenced) {
      savedGeometry.dispose();
    }
  }
  return true;
}
