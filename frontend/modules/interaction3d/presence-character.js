export const DESIGNS = {
  traveler: {
    name: "软帽小旅人",
    en: "THE SOFT-HAT TRAVELER",
    description: "偏向一侧的软帽，圆润短外套。\n小步轻走，停下来会看看周围。",
    height: 1.35,
    pace: 1
  },
  bean: {
    name: "豆豆小人",
    en: "THE LITTLE BEAN",
    description: "大圆头、豆子身体与迷你小帽。\n短腿交替迈步，带一点俏皮摇摆。",
    height: 1.33,
    pace: 0.78
  },
  glow: {
    name: "小灯灵",
    en: "THE LITTLE GLOW",
    description: "实心灯罩、温暖微光与小披肩。\n细腿慢走，光线像呼吸一样起伏。",
    height: 1.45,
    pace: 0.82
  }
};
export function createWalker(THREE, color = 5421233, design = "traveler") {
  if (!DESIGNS[design]) {
    design = "traveler";
  }
  const root = new THREE.Group();
  root.name = "HB-" + design;
  const outfitMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9
  });
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 16774886,
    roughness: 0.9
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 3425857,
    roughness: 1
  });
  function addMesh(geometry, material, position, parent = root) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    parent.add(mesh);
    return mesh;
  }
  function addEllipsoid(scale, position, material, parent = root) {
    const mesh = addMesh(new THREE.SphereGeometry(1, 32, 20), material, position, parent);
    mesh.scale.set(...scale);
    return mesh;
  }
  function addLathe(profile, material, parent = root) {
    return addMesh(new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 36), material, [0, 0, 0], parent);
  }
  const body = new THREE.Group();
  root.add(body);
  const headRig = new THREE.Group();
  body.add(headRig);
  const arms = [];
  const legs = [];
  const parts = {
    body,
    headRig,
    arms,
    legs
  };
  function addEyes(y, z, spacing = 0.055, radius = 0.012, parent = headRig) {
    for (const side of [-1, 1]) {
      addEllipsoid([radius, radius * 1.3, 0.01], [side * spacing, y, z], darkMaterial, parent);
    }
  }
  function addArms(y, spacing, length, radius) {
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * spacing, y, 0);
      body.add(arm);
      addEllipsoid([radius, length / 2, radius], [side * 0.012, -length / 2, 0], outfitMaterial, arm);
      addEllipsoid([radius * 0.57, radius * 0.66, radius * 0.58], [side * 0.012, -length, 0], skinMaterial, arm);
      arm.rotation.z = side * 0.12;
      arms.push(arm);
    }
  }
  function addLegs(y, spacing, segmentLength, radius, footLength, soleHeight) {
    for (const side of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(side * spacing, y, 0);
      root.add(hip);
      addMesh(new THREE.CylinderGeometry(radius, radius * 0.94, segmentLength, 12), skinMaterial, [0, -segmentLength / 2, 0], hip);
      const knee = new THREE.Group();
      knee.position.y = -segmentLength;
      hip.add(knee);
      addMesh(new THREE.CylinderGeometry(radius * 0.94, radius * 0.85, segmentLength, 12), skinMaterial, [0, -segmentLength / 2, 0], knee);
      const foot = addEllipsoid([radius * 1.6, soleHeight, footLength], [0, -segmentLength, 0.025], darkMaterial, knee);
      legs.push({
        hip,
        knee,
        foot
      });
    }
    root.userData.soleHeight = soleHeight;
  }
  if (design === "traveler") {
    parts.robe = addLathe([[0, 0.36], [0.16, 0.36], [0.209, 0.38], [0.225, 0.43], [0.224, 0.56], [0.21, 0.71], [0.176, 0.83], [0.105, 0.877], [0, 0.884]], outfitMaterial, body);
    addMesh(new THREE.CylinderGeometry(0.049, 0.052, 0.09, 16), skinMaterial, [0, 0.903, 0], body);
    addEllipsoid([0.188, 0.206, 0.177], [0, 1.052, 0.01], skinMaterial, headRig);
    addEyes(1.064, 0.184);
    const hatGeometry = new THREE.LatheGeometry([[0, 0], [0.177, 0], [0.215, 0.019], [0.255, 0.072], [0.25, 0.104], [0.209, 0.153], [0.13, 0.19], [0, 0.203]].map(([x, y]) => new THREE.Vector2(x, y)), 40);
    const positions = hatGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      positions.setX(i, positions.getX(i) - y * 0.088 / 0.203);
      positions.setY(i, y + positions.getX(i) * 0.022);
    }
    hatGeometry.computeVertexNormals();
    parts.hat = addMesh(hatGeometry, outfitMaterial, [0, 1.152, 0], headRig);
    addArms(0.801, 0.18, 0.205, 0.061);
    addLegs(0.404, 0.099, 0.174, 0.029, 0.066, 0.028);
  }
  if (design === "bean") {
    parts.robe = addEllipsoid([0.274, 0.298, 0.224], [0, 0.538, 0], outfitMaterial, body);
    addEllipsoid([0.281, 0.279, 0.253], [0, 0.998, 0.018], skinMaterial, headRig);
    addEyes(1.006, 0.269, 0.075, 0.016);
    parts.hat = addEllipsoid([0.205, 0.073, 0.188], [-0.052, 1.238, -0.025], outfitMaterial, headRig);
    addEllipsoid([0.026, 0.037, 0.024], [-0.102, 1.308, -0.025], outfitMaterial, headRig);
    addArms(0.646, 0.258, 0.135, 0.051);
    addLegs(0.282, 0.125, 0.096, 0.039, 0.083, 0.039);
  }
  if (design === "glow") {
    parts.robe = addLathe([[0, 0.32], [0.13, 0.32], [0.183, 0.35], [0.207, 0.43], [0.199, 0.57], [0.155, 0.72], [0.1, 0.8], [0, 0.817]], outfitMaterial, body);
    addMesh(new THREE.CylinderGeometry(0.038, 0.043, 0.1, 16), darkMaterial, [0, 0.832, 0], body);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 16770998,
      emissive: 16762222,
      emissiveIntensity: 1,
      roughness: 0.6
    });
    const glowCore = addEllipsoid([0.11, 0.143, 0.104], [0, 1.083, 0], glowMat, headRig);
    glowCore.castShadow = false;
    glowCore.visible = false;
    const shadeMat = new THREE.MeshPhysicalMaterial({
      color: 16774877,
      emissive: 16765588,
      emissiveIntensity: 0.38,
      roughness: 0.72,
      metalness: 0
    });
    const shade = addLathe([[0, 0.858], [0.135, 0.858], [0.189, 0.88], [0.222, 0.946], [0.228, 1.15], [0.2, 1.29], [0.155, 1.33], [0, 1.33]], shadeMat, headRig);
    shade.castShadow = false;
    shade.renderOrder = 1;
    parts.hat = addEllipsoid([0.213, 0.036, 0.213], [0, 1.316, 0], outfitMaterial, headRig);
    addMesh(new THREE.TorusGeometry(0.04, 0.009, 8, 24), outfitMaterial, [0, 1.387, 0], headRig);
    addEyes(1.103, 0.229, 0.06, 0.012);
    addArms(0.694, 0.172, 0.14, 0.045);
    addLegs(0.363, 0.085, 0.145, 0.024, 0.053, 0.026);
    parts.glowMat = glowMat;
    parts.shadeMat = shadeMat;
  }
  root.userData.parts = parts;
  root.userData.outfitMaterial = outfitMaterial;
  root.userData.design = design;
  return root;
}
export function setWalkerColor(walker, color) {
  walker.userData.outfitMaterial.color.set(color);
}
export function animateWalker(walker, stridePhase, walkBlend, time) {
  const {
    body,
    legs,
    arms,
    headRig
  } = walker.userData.parts;
  const isBean = walker.userData.design === "bean";
  body.position.y = Math.abs(Math.sin(stridePhase)) * (isBean ? 0.026 : 0.012) * walkBlend + Math.sin(time * 1.65) * 0.003 * (1 - walkBlend);
  body.rotation.z = Math.sin(stridePhase) * (isBean ? 0.055 : 0.018) * walkBlend;
  body.rotation.x = walkBlend * 0.015;
  headRig.rotation.y = Math.sin(time * 0.65) * 0.14 * (1 - walkBlend);
  for (let i = 0; i < legs.length; i++) {
    const phase = stridePhase + i * Math.PI;
    legs[i].hip.rotation.x = Math.sin(phase) * (isBean ? 0.4 : 0.3) * walkBlend;
    legs[i].knee.rotation.x = -Math.max(0, Math.cos(phase)) * 0.24 * walkBlend;
  }
  for (let i = 0; i < arms.length; i++) {
    arms[i].rotation.x = -Math.sin(stridePhase + i * Math.PI) * 0.14 * walkBlend;
  }
  if (walker.userData.parts.glowMat) {
    walker.userData.parts.glowMat.emissiveIntensity = 0.9 + Math.sin(time * 1.7) * 0.13;
    walker.userData.parts.shadeMat.emissiveIntensity = 0.38 + Math.sin(time * 1.7) * 0.045;
  }
}
export function disposeWalker(walker) {
  const geometries = new Set();
  const materials = new Set();
  walker.traverse(object => {
    if (object.isMesh) {
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
      }
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
  walker.removeFromParent();
}
