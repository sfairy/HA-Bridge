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
export function createWalker(Group, color = 5421233, design = "traveler") {
  if (!DESIGNS[design]) {
    design = "traveler";
  }
  const userData = new Group.Group();
  userData.name = "HB-" + design;
  const outfitMaterial = new Group.MeshStandardMaterial({
    color,
    roughness: 0.9
  });
  const value11 = new Group.MeshStandardMaterial({
    color: 16774886,
    roughness: 0.9
  });
  const value12 = new Group.MeshStandardMaterial({
    color: 3425857,
    roughness: 1
  });
  function fn(arg5, arg6, arg7, add = userData) {
    const position4 = new Group.Mesh(arg5, arg6);
    position4.position.set(...arg7);
    position4.castShadow = true;
    position4.receiveShadow = false;
    add.add(position4);
    return position4;
  }
  function fn2(arg8, arg9, arg10, arg11 = userData) {
    const scale = fn(new Group.SphereGeometry(1, 32, 20), arg10, arg9, arg11);
    scale.scale.set(...arg8);
    return scale;
  }
  function fn3(map, arg12, arg13 = userData) {
    return fn(new Group.LatheGeometry(map.map(([arg, arg2]) => new Group.Vector2(arg, arg2)), 36), arg12, [0, 0, 0], arg13);
  }
  const add2 = new Group.Group();
  userData.add(add2);
  const headRig = new Group.Group();
  add2.add(headRig);
  const arms = [];
  const legs = [];
  const robe = {
    body: add2,
    headRig,
    arms,
    legs
  };
  function fn4(arg14, arg15, arg16 = 0.055, arg17 = 0.012, arg18 = headRig) {
    for (const value3 of [-1, 1]) {
      fn2([arg17, arg17 * 1.3, 0.01], [value3 * arg16, arg14, arg15], value12, arg18);
    }
  }
  function fn5(arg19, arg20, arg21, arg22) {
    for (const value4 of [-1, 1]) {
      const position = new Group.Group();
      position.position.set(value4 * arg20, arg19, 0);
      add2.add(position);
      fn2([arg22, arg21 / 2, arg22], [value4 * 0.012, -arg21 / 2, 0], outfitMaterial, position);
      fn2([arg22 * 0.57, arg22 * 0.66, arg22 * 0.58], [value4 * 0.012, -arg21, 0], value11, position);
      position.rotation.z = value4 * 0.12;
      arms.push(position);
    }
  }
  function fn6(arg23, arg24, arg25, arg26, arg27, soleHeight) {
    for (const value5 of [-1, 1]) {
      const position2 = new Group.Group();
      position2.position.set(value5 * arg24, arg23, 0);
      userData.add(position2);
      fn(new Group.CylinderGeometry(arg26, arg26 * 0.94, arg25, 12), value11, [0, -arg25 / 2, 0], position2);
      const position3 = new Group.Group();
      position3.position.y = -arg25;
      position2.add(position3);
      fn(new Group.CylinderGeometry(arg26 * 0.94, arg26 * 0.85, arg25, 12), value11, [0, -arg25 / 2, 0], position3);
      const foot = fn2([arg26 * 1.6, soleHeight, arg27], [0, -arg25, 0.025], value12, position3);
      legs.push({
        hip: position2,
        knee: position3,
        foot
      });
    }
    userData.userData.soleHeight = soleHeight;
  }
  if (design === "traveler") {
    robe.robe = fn3([[0, 0.36], [0.16, 0.36], [0.209, 0.38], [0.225, 0.43], [0.224, 0.56], [0.21, 0.71], [0.176, 0.83], [0.105, 0.877], [0, 0.884]], outfitMaterial, add2);
    fn(new Group.CylinderGeometry(0.049, 0.052, 0.09, 16), value11, [0, 0.903, 0], add2);
    fn2([0.188, 0.206, 0.177], [0, 1.052, 0.01], value11, headRig);
    fn4(1.064, 0.184);
    const attributes = new Group.LatheGeometry([[0, 0], [0.177, 0], [0.215, 0.019], [0.255, 0.072], [0.25, 0.104], [0.209, 0.153], [0.13, 0.19], [0, 0.203]].map(([arg3, arg4]) => new Group.Vector2(arg3, arg4)), 40);
    const getX = attributes.attributes.position;
    for (let value6 = 0; value6 < getX.count; value6++) {
      const value2 = getX.getY(value6);
      getX.setX(value6, getX.getX(value6) - value2 * 0.088 / 0.203);
      getX.setY(value6, value2 + getX.getX(value6) * 0.022);
    }
    attributes.computeVertexNormals();
    robe.hat = fn(attributes, outfitMaterial, [0, 1.152, 0], headRig);
    fn5(0.801, 0.18, 0.205, 0.061);
    fn6(0.404, 0.099, 0.174, 0.029, 0.066, 0.028);
  }
  if (design === "bean") {
    robe.robe = fn2([0.274, 0.298, 0.224], [0, 0.538, 0], outfitMaterial, add2);
    fn2([0.281, 0.279, 0.253], [0, 0.998, 0.018], value11, headRig);
    fn4(1.006, 0.269, 0.075, 0.016);
    robe.hat = fn2([0.205, 0.073, 0.188], [-0.052, 1.238, -0.025], outfitMaterial, headRig);
    fn2([0.026, 0.037, 0.024], [-0.102, 1.308, -0.025], outfitMaterial, headRig);
    fn5(0.646, 0.258, 0.135, 0.051);
    fn6(0.282, 0.125, 0.096, 0.039, 0.083, 0.039);
  }
  if (design === "glow") {
    robe.robe = fn3([[0, 0.32], [0.13, 0.32], [0.183, 0.35], [0.207, 0.43], [0.199, 0.57], [0.155, 0.72], [0.1, 0.8], [0, 0.817]], outfitMaterial, add2);
    fn(new Group.CylinderGeometry(0.038, 0.043, 0.1, 16), value12, [0, 0.832, 0], add2);
    const glowMat = new Group.MeshStandardMaterial({
      color: 16770998,
      emissive: 16762222,
      emissiveIntensity: 1,
      roughness: 0.6
    });
    const castShadow = fn2([0.11, 0.143, 0.104], [0, 1.083, 0], glowMat, headRig);
    castShadow.castShadow = false;
    castShadow.visible = false;
    const shadeMat = new Group.MeshPhysicalMaterial({
      color: 16774877,
      emissive: 16765588,
      emissiveIntensity: 0.38,
      roughness: 0.72,
      metalness: 0
    });
    const castShadow2 = fn3([[0, 0.858], [0.135, 0.858], [0.189, 0.88], [0.222, 0.946], [0.228, 1.15], [0.2, 1.29], [0.155, 1.33], [0, 1.33]], shadeMat, headRig);
    castShadow2.castShadow = false;
    castShadow2.renderOrder = 1;
    robe.hat = fn2([0.213, 0.036, 0.213], [0, 1.316, 0], outfitMaterial, headRig);
    const value7 = fn(new Group.TorusGeometry(0.04, 0.009, 8, 24), outfitMaterial, [0, 1.387, 0], headRig);
    fn4(1.103, 0.229, 0.06, 0.012);
    fn5(0.694, 0.172, 0.14, 0.045);
    fn6(0.363, 0.085, 0.145, 0.024, 0.053, 0.026);
    robe.glowMat = glowMat;
    robe.shadeMat = shadeMat;
  }
  userData.userData.parts = robe;
  userData.userData.outfitMaterial = outfitMaterial;
  userData.userData.design = design;
  return userData;
}
export function setWalkerColor(userData2, arg28) {
  userData2.userData.outfitMaterial.color.set(arg28);
}
export function animateWalker(userData3, arg29, arg30, arg31) {
  const {
    body: rotation,
    legs: length,
    arms: length2,
    headRig: rotation2
  } = userData3.userData.parts;
  const value13 = userData3.userData.design === "bean";
  rotation.position.y = Math.abs(Math.sin(arg29)) * (value13 ? 0.026 : 0.012) * arg30 + Math.sin(arg31 * 1.65) * 0.003 * (1 - arg30);
  rotation.rotation.z = Math.sin(arg29) * (value13 ? 0.055 : 0.018) * arg30;
  rotation.rotation.x = arg30 * 0.015;
  rotation2.rotation.y = Math.sin(arg31 * 0.65) * 0.14 * (1 - arg30);
  for (let value9 = 0; value9 < length.length; value9++) {
    const value8 = arg29 + value9 * Math.PI;
    length[value9].hip.rotation.x = Math.sin(value8) * (value13 ? 0.4 : 0.3) * arg30;
    length[value9].knee.rotation.x = -Math.max(0, Math.cos(value8)) * 0.24 * arg30;
  }
  for (let value10 = 0; value10 < length2.length; value10++) {
    length2[value10].rotation.x = -Math.sin(arg29 + value10 * Math.PI) * 0.14 * arg30;
  }
  if (userData3.userData.parts.glowMat) {
    userData3.userData.parts.glowMat.emissiveIntensity = 0.9 + Math.sin(arg31 * 1.7) * 0.13;
    userData3.userData.parts.shadeMat.emissiveIntensity = 0.38 + Math.sin(arg31 * 1.7) * 0.045;
  }
}
export function disposeWalker(traverse) {
  const add3 = new Set();
  const add4 = new Set();
  traverse.traverse(material => {
    if (material.isMesh) {
      add3.add(material.geometry);
      for (const value of Array.isArray(material.material) ? material.material : [material.material]) {
        add4.add(value);
      }
    }
  });
  add3.forEach(dispose => dispose.dispose());
  add4.forEach(dispose2 => dispose2.dispose());
  traverse.removeFromParent();
}
