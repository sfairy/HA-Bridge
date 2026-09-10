const T = new Set(["left", "right", "split"]);
const _ = new Set(["cloth", "band"]);
const nt = new Set(["rod", "cap", ..._]);
const j = 1000 / 30;
const et = 420;
const it = 0.12;
const st = 0.15;
const Q = curtainWidth2 => Math.max(4, Math.min(96, Math.round((Number(curtainWidth2.curtainWidth) || 1.8) / ($(curtainWidth2) === "split" ? 2 : 1) / st)));
const L = (arg32, arg33) => JSON.stringify([String(arg32 ?? ""), String(arg33 ?? "")]);
const $ = coverDirection => T.has(coverDirection.coverDirection) ? coverDirection.coverDirection : T.has(coverDirection.curtainPosition) ? coverDirection.curtainPosition : "split";
const X = position5 => typeof position5?.position == "number" && Number.isFinite(position5.position) ? Math.max(0, Math.min(100, position5.position)) : null;
const Y = userData7 => Array.isArray(userData7.userData?.curtainRigBasis) && userData7.userData.curtainRigBasis.length === 3 && userData7.userData.curtainRigBasis.every(arg11 => typeof arg11 == "number" && Number.isFinite(arg11) && arg11 > 0) ? [...userData7.userData.curtainRigBasis] : [1.8, 2.4, 0.18];
function at(Float32BufferAttribute, arg35) {
  const value54 = Math.max(64, arg35 * 6);
  const value55 = 2.28168;
  const value56 = 0.046;
  const value57 = 0.003;
  const length = [];
  const push = [];
  const push2 = [];
  const push3 = [];
  const value58 = arg13 => value56 * Math.sin(arg13 * arg35 * Math.PI * 2);
  const value59 = arg14 => value56 * arg35 * Math.PI * 2 * Math.cos(arg14 * arg35 * Math.PI * 2);
  const value60 = (arg15, arg16, arg17, arg18, arg19, arg20, arg21, arg22) => {
    length.push(arg15, arg16, arg17);
    push.push(arg18, arg19, arg20);
    push2.push(arg21, arg22);
  };
  for (const value43 of ["front", "back", "top", "bottom"]) {
    const value28 = length.length / 3;
    for (let value26 = 0; value26 <= value54; value26++) {
      const value17 = value26 / value54;
      const value18 = value58(value17);
      const value19 = value59(value17);
      const value20 = Math.hypot(value19, 1);
      if (value43 === "front" || value43 === "back") {
        const value6 = value43 === "front" ? 1 : -1;
        for (const value4 of [0, value55]) {
          value60(value17, value4, value18 + value6 * value57 / 2, -value6 * value19 / value20, 0, value6 / value20, value17, value4 / value55);
        }
      } else {
        const value7 = value43 === "top" ? 1 : -1;
        for (const value5 of [-value57 / 2, value57 / 2]) {
          value60(value17, value7 > 0 ? value55 : 0, value18 + value5, 0, value7, 0, value17, value5 > 0 ? 1 : 0);
        }
      }
      if (value26 < value54) {
        const value8 = value28 + value26 * 2;
        if (value43 === "front" || value43 === "bottom") {
          push3.push(value8, value8 + 2, value8 + 1, value8 + 1, value8 + 2, value8 + 3);
        } else {
          push3.push(value8, value8 + 1, value8 + 2, value8 + 1, value8 + 3, value8 + 2);
        }
      }
    }
  }
  for (const value44 of [0, 1]) {
    const value29 = length.length / 3;
    const value30 = value44 === 0 ? -1 : 1;
    for (const value27 of [0, value55]) {
      for (const value10 of [-value57 / 2, value57 / 2]) {
        value60(value44, value27, value58(value44) + value10, value30, 0, 0, value10 > 0 ? 1 : 0, value27 / value55);
      }
    }
    if (value30 > 0) {
      push3.push(value29, value29 + 2, value29 + 1, value29 + 1, value29 + 2, value29 + 3);
    } else {
      push3.push(value29, value29 + 1, value29 + 2, value29 + 1, value29 + 3, value29 + 2);
    }
  }
  const setAttribute = new Float32BufferAttribute.BufferGeometry();
  setAttribute.setAttribute("position", new Float32BufferAttribute.Float32BufferAttribute(length, 3));
  setAttribute.setAttribute("normal", new Float32BufferAttribute.Float32BufferAttribute(push, 3));
  setAttribute.setAttribute("uv", new Float32BufferAttribute.Float32BufferAttribute(push2, 2));
  setAttribute.setIndex(push3);
  setAttribute.computeBoundingBox();
  setAttribute.computeBoundingSphere();
  return setAttribute;
}
function U(arg36, arg37) {
  for (let parent2 = arg36; parent2; parent2 = parent2.parent) {
    if (parent2 === arg37) {
      return true;
    }
  }
  return false;
}
function lt(arg38) {
  const every = [];
  const push4 = [];
  function fn8(userData8) {
    if (!userData8.userData?.curtainMotionRig && !userData8.userData?.curtainMotionPanel && (userData8 === arg38 || userData8.userData?.environmentModelId == null)) {
      if (userData8.userData?.curtainRigRoot === true) {
        push4.push(userData8);
      }
      if (userData8.isMesh && nt.has(userData8.userData?.curtainPart)) {
        every.push(userData8);
      }
      for (const value11 of userData8.children || []) {
        fn8(value11);
      }
    }
  }
  fn8(arg38);
  if (!every.some(userData5 => _.has(userData5.userData.curtainPart))) {
    return null;
  }
  let parent3 = push4.find(arg12 => every.every(arg10 => U(arg10, arg12)));
  if (!parent3) {
    for (parent3 = every[0].parent; parent3 && !every.every(arg9 => U(arg9, parent3));) {
      parent3 = parent3.parent;
    }
  }
  if (parent3 && U(parent3, arg38)) {
    return {
      anchor: parent3,
      parts: every
    };
  } else {
    return null;
  }
}
export function createCurtainMotion({
  THREE: MeshStandardMaterial,
  requestRender: arg34 = () => {}
} = {}) {
  let traverse = null;
  let value45;
  let value46 = "";
  let value47 = false;
  const has4 = new Map();
  function fn(arg23) {
    if (!has4.has(arg23)) {
      has4.set(arg23, at(MeshStandardMaterial, arg23));
    }
    return has4.get(arg23);
  }
  let values = new Map();
  let keys = new Map();
  let value48 = -Infinity;
  let value49 = true;
  let value50 = "";
  let has5 = new Map();
  let value51 = 1;
  let value52 = true;
  let value53 = "";
  function fn2() {
    value49 = true;
    arg34();
  }
  function fn3(model2, id4, anchor) {
    const some = anchor.parts.filter(userData3 => _.has(userData3.userData.curtainPart));
    const reduce = some.filter(userData => userData.userData.curtainPart === "cloth").flatMap(material => Array.isArray(material.material) ? material.material : [material.material]).filter(Boolean);
    const value31 = color => color.color ? color.color.r + color.color.g + color.color.b : 0;
    const color2 = reduce.reduce((arg, arg2) => !arg || value31(arg2) > value31(arg) ? arg2 : arg, null)?.clone?.() || new MeshStandardMaterial.MeshStandardMaterial({
      color: 13094354,
      roughness: 0.94,
      metalness: 0
    });
    color2.color?.lerp(new MeshStandardMaterial.Color(16777215), 0.2);
    color2.side = MeshStandardMaterial.DoubleSide;
    color2.forceSinglePass = true;
    const folds2 = Q(id4);
    const value32 = fn(folds2);
    const name = new MeshStandardMaterial.Group();
    const basis2 = Y(anchor.anchor);
    name.name = "curtain-motion-" + id4.id;
    name.userData.curtainMotionRig = true;
    name.scale.set(basis2[0] / 1.8, basis2[1] / 2.4, basis2[2] / 0.18);
    anchor.anchor.add(name);
    const panels = ["left", "right"].map(curtainSide => {
      const userData4 = new MeshStandardMaterial.Mesh(value32, color2);
      userData4.name = "curtain-motion-" + id4.id + "-" + curtainSide;
      userData4.userData.curtainMotionPanel = true;
      userData4.userData.curtainSide = curtainSide;
      userData4.userData.externalModelSharedGeometry = true;
      userData4.userData.externalModelSharedTextures = true;
      userData4.userData.externalModelSharedMaterial = true;
      userData4.position.set(curtainSide === "left" ? -0.9 : 0.9, 0.06, 0);
      userData4.castShadow = some.some(castShadow => castShadow.castShadow);
      userData4.receiveShadow = some.some(receiveShadow => receiveShadow.receiveShadow);
      userData4.visible = false;
      name.add(userData4);
      return userData4;
    });
    return {
      model: model2,
      binding: id4,
      folds: folds2,
      anchor: anchor.anchor,
      parts: anchor.parts,
      rig: name,
      basis: basis2,
      generation: value51++,
      panels,
      material: color2,
      originals: new Map(some.map(visible => [visible, visible.visible])),
      direction: $(id4),
      position: null,
      target: null,
      motionFrom: null,
      motionStart: null
    };
  }
  function fn4(originals) {
    for (const [visible2, visible3] of originals.originals) {
      visible2.visible = visible3;
    }
    originals.rig.removeFromParent();
    originals.material.dispose();
  }
  function fn5(position4) {
    position4.position = null;
    position4.target = null;
    position4.motionFrom = null;
    position4.motionStart = null;
    fn6(position4);
  }
  function fn6(direction2) {
    const value33 = direction2.position ?? 0;
    const value34 = direction2.direction === "split";
    const value35 = value34 ? 0.906 : 1.8;
    const value36 = 1 - (1 - it) * value33 / 100;
    for (const visible4 of direction2.originals.keys()) {
      visible4.visible = false;
    }
    for (const userData6 of direction2.panels) {
      const value12 = userData6.userData.curtainSide === "left";
      userData6.visible = value34 || direction2.direction === (value12 ? "left" : "right");
      userData6.scale.x = (value12 ? 1 : -1) * value35 * value36;
      userData6.updateMatrix();
    }
    value49 = true;
  }
  function fn7(target, arg24, arg25 = false) {
    const target2 = X(arg24);
    if (target2 === null) {
      const value13 = target.target !== target.position;
      target.target = target.position;
      target.motionStart = null;
      return value13;
    }
    if (target.position === null || arg25) {
      const value14 = target.position !== target2 || target.target !== target2;
      target.position = target2;
      target.target = target2;
      target.motionStart = null;
      if (value14) {
        fn6(target);
      }
      return value14;
    }
    if (target.target === target2) {
      return false;
    } else {
      target.target = target2;
      target.motionFrom = target.position;
      target.motionStart = null;
      return true;
    }
  }
  function setBindings(arg26, arg27 = [], arg28) {
    if (value47) {
      return;
    }
    const has = new Set();
    const has2 = new Set();
    const map = (Array.isArray(arg27) ? arg27 : []).filter(id => {
      if (!id || id.id == null || id.modelId == null) {
        return false;
      }
      const value = String(id.id);
      const value2 = L(id.floorId, id.modelId);
      if (has.has(value) || has2.has(value2)) {
        return false;
      } else {
        has.add(value);
        has2.add(value2);
        return true;
      }
    }).map(curtainWidth => ({
      id: String(curtainWidth.id),
      entityId: String(curtainWidth.entityId ?? ""),
      floorId: String(curtainWidth.floorId ?? ""),
      modelId: String(curtainWidth.modelId),
      curtainWidth: Number(curtainWidth.curtainWidth) > 0 ? Number(curtainWidth.curtainWidth) : 1.8,
      coverDirection: curtainWidth.coverDirection || "auto",
      curtainPosition: curtainWidth.curtainPosition || "split"
    }));
    const value37 = JSON.stringify(map);
    if (traverse === arg26 && value45 === arg28 && value46 === value37) {
      return;
    }
    const has3 = new Map(map.map(id2 => [id2.id, id2.entityId]));
    for (const value21 of keys.keys()) {
      if (!has3.has(value21) || has5.has(value21) && has5.get(value21) !== has3.get(value21)) {
        keys.delete(value21);
      }
    }
    has5 = has3;
    traverse = arg26 || null;
    value45 = arg28;
    value46 = value37;
    const map2 = new Map();
    if (map.length) {
      traverse?.traverse?.(userData2 => {
        if (userData2.userData?.environmentModelType !== "curtain" || userData2.userData?.environmentModelId == null) {
          return;
        }
        let value3 = userData2.userData.environmentFloorId;
        for (let parent = userData2.parent; value3 == null && parent; parent = parent.parent) {
          value3 = parent.userData?.environmentFloorId;
        }
        map2.set(L(value3, userData2.userData.environmentModelId), userData2);
      });
    }
    const value38 = map.map(floorId => {
      const model = map2.get(L(floorId.floorId, floorId.modelId));
      const located = model ? lt(model) : null;
      if (located) {
        return {
          binding: floorId,
          model,
          located
        };
      } else {
        return null;
      }
    }).filter(Boolean);
    const set2 = new Map();
    for (const located2 of value38) {
      const parts = values.get(located2.binding.id);
      if (parts && parts.model === located2.model && parts.anchor === located2.located.anchor && parts.parts.length === located2.located.parts.length && parts.parts.every((arg7, arg8) => arg7 === located2.located.parts[arg8])) {
        set2.set(located2.binding.id, parts);
      }
    }
    for (const [value22, value23] of values) {
      if (!set2.has(value22)) {
        fn4(value23);
      }
    }
    values = new Map();
    for (const {
      binding: id3,
      model: value24,
      located: value25
    } of value38) {
      const basis = set2.get(id3.id) || fn3(value24, id3, value25);
      const direction = $(id3);
      if (basis.binding.entityId !== id3.entityId) {
        fn5(basis);
      }
      basis.binding = id3;
      const folds = Q(id3);
      if (basis.folds !== folds) {
        basis.folds = folds;
        for (const geometry of basis.panels) {
          geometry.geometry = fn(folds);
        }
      }
      basis.basis = Y(basis.anchor);
      basis.rig.scale.set(basis.basis[0] / 1.8, basis.basis[1] / 2.4, basis.basis[2] / 0.18);
      if (basis.direction !== direction) {
        basis.direction = direction;
        fn6(basis);
      }
      values.set(id3.id, basis);
      if (keys.has(id3.id)) {
        fn7(basis, keys.get(id3.id));
      }
      if (basis.position === null) {
        fn6(basis);
      }
    }
    value52 = true;
    fn2();
  }
  function setState(arg29, arg30, {
    immediate: arg31 = false
  } = {}) {
    if (value47 || arg29 == null) {
      return;
    }
    const value39 = String(arg29);
    const value40 = {
      position: X(arg30)
    };
    keys.set(value39, value40);
    const value41 = values.get(value39);
    if (value41 && fn7(value41, value40, arg31)) {
      fn2();
    }
  }
  function isMoving() {
    return !value47 && [...values.values()].some(position => position.position !== null && position.target !== position.position);
  }
  function update(motionStart) {
    if (!isMoving() || (Number.isFinite(motionStart) || (motionStart = globalThis.performance?.now() ?? Date.now()), motionStart >= value48 && motionStart - value48 < j)) {
      return false;
    }
    value48 = Number.isFinite(value48) && motionStart >= value48 ? motionStart - (motionStart - value48) % j : motionStart;
    let value42 = false;
    for (const position3 of values.values()) {
      if (position3.position === null || position3.target === position3.position) {
        continue;
      }
      if (position3.motionStart === null || motionStart < position3.motionStart) {
        position3.motionStart = motionStart;
      }
      const value15 = Math.min(1, (motionStart - position3.motionStart) / et);
      const value16 = value15 * value15 * (3 - value15 * 2);
      const position2 = value15 === 1 ? position3.target : position3.motionFrom + (position3.target - position3.motionFrom) * value16;
      if (position2 !== position3.position) {
        position3.position = position2;
        fn6(position3);
        value42 = true;
      }
    }
    return value42;
  }
  function poseKey() {
    if (value49) {
      value50 = JSON.stringify([...values.values()].map(binding => [binding.binding.id, binding.binding.floorId, binding.binding.modelId, binding.binding.entityId, binding.generation, binding.direction, binding.basis, binding.folds, binding.position === null ? "preview-closed" : Math.round(binding.position * 100) / 100]).sort((arg3, arg4) => arg3[0].localeCompare(arg4[0])));
      value49 = false;
    }
    return value50;
  }
  function structureKey() {
    if (value52) {
      value53 = JSON.stringify([...values.values()].map(binding2 => [binding2.binding.id, binding2.binding.floorId, binding2.binding.modelId, binding2.generation, binding2.direction, binding2.basis, binding2.folds]).sort((arg5, arg6) => arg5[0].localeCompare(arg6[0])));
      value52 = false;
    }
    return value53;
  }
  function dispose2() {
    if (!value47) {
      value47 = true;
      for (const value9 of values.values()) {
        fn4(value9);
      }
      values.clear();
      keys.clear();
      has5.clear();
      for (const dispose of has4.values()) {
        dispose.dispose();
      }
      has4.clear();
      traverse = null;
      value49 = true;
      value52 = true;
      arg34();
    }
  }
  return {
    setBindings,
    setState,
    update,
    isMoving,
    poseKey,
    structureKey,
    dispose: dispose2
  };
}
