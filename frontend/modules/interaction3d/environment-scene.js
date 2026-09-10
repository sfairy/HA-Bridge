import { createEnvironmentHalos } from "./environment-halos.js?v=20260908-model-halo-v1";
export function pageDimming(pageDimStrength, arg23, arg24 = false) {
  const page = {
    climate: "environment",
    cover: "environment",
    nas: "devices",
    television: "devices",
    "vacuum-shortcut": "vacuum"
  }[arg23] || arg23;
  if (!["overview", "light", "environment", "devices", "vacuum", "security"].includes(page)) {
    return {
      page,
      strength: 0,
      enabled: false
    };
  }
  const value56 = (arg13, arg14) => Number.isFinite(arg13) ? Math.max(0, Math.min(100, arg13)) : arg14;
  const value57 = value56(pageDimStrength.pageDimStrength?.[page], page === "overview" ? 0 : value56(pageDimStrength.environment?.dimStrength, 70));
  const saturation2 = value56(pageDimStrength.pageSaturation?.[page], page === "overview" ? 100 : 75);
  return {
    page,
    saturation: saturation2,
    enabled: page !== "overview" || value57 > 0 || saturation2 < 100,
    strength: Math.min(100, value57 + (arg24 && page !== "overview" ? value56(pageDimStrength.focusDimStrength, 15) : 0))
  };
}
const Ce = {
  wallac: "environment",
  floorac: "environment",
  airoutlet: "environment",
  curtain: "environment",
  nas: "devices",
  tv: "devices",
  robotvacuum: "vacuum"
};
const Ie = {
  wallac: "climate",
  floorac: "climate",
  airoutlet: "climate",
  curtain: "cover",
  nas: "nas",
  tv: "television",
  robotvacuum: "vacuum"
};
export function pageModelBindings(filter, map2, arg25, arg26) {
  const get2 = new Map(map2.map(floorId3 => [JSON.stringify([floorId3.floorId, floorId3.modelId]), floorId3]));
  return filter.filter(id3 => arg26 === "all" || id3.id === arg26).flatMap(id5 => (id5.scene?.items || []).flatMap(type => {
    const value15 = Ce[type.type];
    if (!value15 || arg25 !== "overview" && value15 !== arg25) {
      return [];
    }
    const value16 = JSON.stringify([id5.id, type.id]);
    const id4 = get2.get(value16);
    return [{
      ...id4,
      id: id4?.id || "presentation:" + value16,
      floorId: id5.id,
      modelId: type.id,
      deviceKind: Ie[type.type],
      modelType: type.type,
      modelAvailable: true,
      visible: true,
      previewOnly: !id4
    }];
  }));
}
export function createEnvironmentScene({
  THREE: Color,
  requestFrame: arg27 = () => {}
}) {
  const value58 = {
    value: 0
  };
  const value59 = {
    value: 0
  };
  const value60 = {
    value: 0.75
  };
  const delete2 = new Map();
  const values5 = new Map();
  const delete3 = new Set();
  const has5 = new Set();
  const clear = new Map();
  const value61 = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true || globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const setVisible = createEnvironmentHalos({
    THREE: Color,
    modeAmount: value59
  });
  const selected = {
    cool: new Color.Color("#c8e2eb"),
    heat: new Color.Color("#efd1ae"),
    other: new Color.Color("#eee9df"),
    selected: new Color.Color("#ffe1aa")
  };
  let traverse = null;
  let value62;
  let filter2 = [];
  let value63 = false;
  let value64 = false;
  let value65 = false;
  let length = [];
  let value66 = "[]";
  let get3 = {};
  let value67 = "";
  let value68 = "";
  const clear2 = new Map();
  const value69 = () => [...length, ...clear2.values()];
  let value70 = 0;
  let value71 = 0;
  let value72 = 0;
  let value73 = 0;
  let value74 = null;
  let value75 = false;
  let value76 = 0.7;
  const value77 = (arg15, arg16) => JSON.stringify([String(arg15 ?? ""), String(arg16 ?? "")]);
  const value78 = id6 => JSON.stringify([String(id6.id ?? ""), id6.floorId, id6.modelId]);
  const value79 = arg17 => Array.isArray(arg17) ? arg17 : arg17 ? [arg17] : [];
  const value80 = isMaterial => isMaterial?.isMaterial && !isMaterial.isShaderMaterial && (isMaterial.isMeshStandardMaterial || isMaterial.isMeshPhysicalMaterial || isMaterial.isMeshBasicMaterial || isMaterial.isMeshLambertMaterial || isMaterial.isMeshPhongMaterial || isMaterial.isMeshToonMaterial);
  const value81 = () => ({
    amount: value58,
    retain: {
      value: 0
    },
    glow: {
      value: new Color.Color(0, 0, 0)
    }
  });
  const value82 = value81();
  function fn(onBeforeCompile, amount, source2 = null) {
    if (!value80(onBeforeCompile) || delete2.has(onBeforeCompile)) {
      return;
    }
    const oldCompile = onBeforeCompile.onBeforeCompile;
    const oldKey = onBeforeCompile.customProgramCacheKey;
    const hasCompile = Object.hasOwn(onBeforeCompile, "onBeforeCompile");
    const hasKey = Object.hasOwn(onBeforeCompile, "customProgramCacheKey");
    const priorCompile = source2 ? delete2.get(source2) : null;
    const call = priorCompile?.priorCompile || oldCompile;
    const call2 = priorCompile?.priorKey || oldKey;
    const value36 = source2 || onBeforeCompile;
    const compile = function (fragmentShader, arg11) {
      call?.call(this, fragmentShader, arg11);
      const value17 = "#include <opaque_fragment>";
      if (!fragmentShader.fragmentShader.includes(value17) || (fragmentShader.uniforms.hbEnvironmentAmount = amount.amount, fragmentShader.uniforms.hbEnvironmentMode = value59, fragmentShader.uniforms.hbEnvironmentSaturation = value60, fragmentShader.uniforms.hbEnvironmentRetain = amount.retain, fragmentShader.uniforms.hbEnvironmentGlow = amount.glow, fragmentShader.fragmentShader.includes("uniform float hbEnvironmentAmount;"))) {
        return;
      }
      fragmentShader.fragmentShader = "uniform float hbEnvironmentAmount;\nuniform float hbEnvironmentMode;\nuniform float hbEnvironmentSaturation;\nuniform float hbEnvironmentRetain;\nuniform vec3 hbEnvironmentGlow;\n" + fragmentShader.fragmentShader.replace(value17, "float hbEnvironmentLuma = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));\noutgoingLight = mix(outgoingLight, vec3(hbEnvironmentLuma) * vec3(1.005, 1.0, 0.99), hbEnvironmentMode * (1.0 - hbEnvironmentRetain) * (1.0 - hbEnvironmentSaturation));\noutgoingLight += hbEnvironmentGlow * hbEnvironmentMode * (vec3(0.12) + clamp(outgoingLight, 0.0, 1.0) * 0.8);\n" + value17);
      const value18 = "#include <colorspace_fragment>";
      fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace(value18, value18 + "\ngl_FragColor.rgb *= mix(1.0, 0.15, hbEnvironmentAmount * (1.0 - hbEnvironmentRetain));");
    };
    const key = function () {
      return (call2 === Color.Material.prototype.customProgramCacheKey ? call?.toString() || "" : call2?.call(value36) || "") + "|hb-environment-saturation-v6";
    };
    delete2.set(onBeforeCompile, {
      oldCompile,
      oldKey,
      hasCompile,
      hasKey,
      priorCompile: call,
      priorKey: call2,
      compile,
      key,
      source: source2
    });
    onBeforeCompile.onBeforeCompile = compile;
    onBeforeCompile.customProgramCacheKey = key;
    onBeforeCompile.needsUpdate = true;
  }
  function fn2() {
    setVisible.setVisible(false);
    for (const applied2 of filter2) {
      if (applied2.applied && applied2.mesh.material === applied2.applied) {
        applied2.mesh.material = applied2.original;
      }
    }
    value75 = false;
  }
  function fn3() {
    for (const applied3 of clear.values()) {
      if (applied3.applied && applied3.mesh.material === applied3.applied) {
        applied3.mesh.material = applied3.original;
      }
    }
    clear.clear();
    has5.clear();
    fn2();
    setVisible.clear();
    delete3.clear();
    clear2.clear();
    for (const [value31, value32] of delete2) {
      fn4(value31, value32);
    }
    for (const values of values5.values()) {
      for (const material2 of values.values()) {
        material2.material.dispose();
      }
    }
    delete2.clear();
    values5.clear();
    filter2 = [];
    value65 = false;
  }
  function fn4(onBeforeCompile2, compile2) {
    let value37 = false;
    if (onBeforeCompile2.onBeforeCompile === compile2.compile) {
      if (compile2.hasCompile) {
        onBeforeCompile2.onBeforeCompile = compile2.oldCompile;
      } else {
        delete onBeforeCompile2.onBeforeCompile;
      }
      value37 = true;
    }
    if (onBeforeCompile2.customProgramCacheKey === compile2.key) {
      if (compile2.hasKey) {
        onBeforeCompile2.customProgramCacheKey = compile2.oldKey;
      } else {
        delete onBeforeCompile2.customProgramCacheKey;
      }
      value37 = true;
    }
    if (value37) {
      if (!compile2.source) {
        onBeforeCompile2.dispose();
      }
      onBeforeCompile2.needsUpdate = true;
    }
  }
  function fn5(defines2, binding) {
    if (!value80(defines2)) {
      return defines2;
    }
    let items = values5.get(defines2);
    if (!items) {
      items = new Map();
      values5.set(defines2, items);
    }
    const value38 = value78(binding);
    let binding2 = items.get(value38);
    if (!binding2) {
      const defines = defines2.clone();
      const uniforms = value81();
      if (defines2.defines) {
        defines.defines = {
          ...defines2.defines
        };
      }
      Object.defineProperty(defines, "environmentSourceMaterial", {
        value: defines2,
        configurable: true
      });
      fn(defines, uniforms, defines2);
      binding2 = {
        material: defines,
        uniforms,
        binding
      };
      items.set(value38, binding2);
    }
    binding2.binding = binding;
    return binding2.material;
  }
  function fn6() {
    if (!traverse || !value64 && value58.value === 0 && value59.value === 0) {
      fn2();
      fn7();
      return;
    }
    setVisible.sync(traverse, value69(), value62, new Map(filter2.filter(modelNode => modelNode.modelNode).map(modelKey => [modelKey.modelKey, modelKey.modelNode])));
    setVisible.setVisible(true);
    const has3 = new Map();
    for (const modelId of value69()) {
      if (modelId.modelId != null && modelId.visible !== false) {
        const value5 = value77(modelId.floorId, modelId.modelId);
        if (!has3.has(value5)) {
          has3.set(value5, modelId);
        }
      }
    }
    for (const applied4 of filter2) {
      const value22 = has3.get(applied4.modelKey);
      if (value22) {
        const value6 = value79(applied4.original).map(arg => fn5(arg, value22));
        applied4.applied = Array.isArray(applied4.original) ? value6 : value6[0];
        applied4.mesh.material = applied4.applied;
      } else {
        if (applied4.applied && applied4.mesh.material === applied4.applied) {
          applied4.mesh.material = applied4.original;
        }
        applied4.applied = null;
      }
    }
    value75 = true;
    fn7();
  }
  function fn7() {
    const has4 = new Set(value69().map(value78));
    for (const [value33, entryMap] of values5) {
      for (const [value19, material3] of entryMap) {
        if (!has4.has(value19)) {
          delete3.delete(material3);
          delete2.delete(material3.material);
          material3.material.dispose();
          entryMap.delete(value19);
        }
      }
      if (!entryMap.size) {
        values5.delete(value33);
      }
    }
  }
  function fn8(arg20 = false, add = new Set()) {
    const value39 = value68 || value67;
    const value40 = !!value39 && length.some(id => id.id === value39);
    let value41 = false;
    for (const values2 of values5.values()) {
      for (const target2 of values2.values()) {
        const id2 = target2.binding;
        const element = !clear2.has(value78(id2)) && (!value40 || id2.id === value39) ? 1 : 0;
        const value7 = id2.entityId || (id2.deviceKind === "nas" ? id2.statusSource?.primaryEntityId : "");
        const newState = get3 instanceof Map ? get3.get(value7) : get3?.[value7];
        const state = newState?.newState || newState || {};
        const value8 = String(state.state || "").toLowerCase();
        const value9 = !["", "off", "unknown", "unavailable"].includes(value8);
        const value10 = id2.id === value68;
        const value11 = element ? value10 ? 1.45 : id2.deviceKind === "cover" ? 1.2 : value9 ? 1.125 : 0.325 : 0;
        const r = value10 ? selected.selected : value9 && selected[value8] || selected.other;
        const value12 = value11 * r.r;
        const value13 = value11 * r.g;
        const value14 = value11 * r.b;
        const retain = target2.uniforms;
        const r2 = retain.glow.value;
        const target = [element, value12, value13, value14];
        if (!target2.target?.every((arg2, arg3) => arg2 === target[arg3])) {
          value41 = true;
          add.add(id2.floorId);
          if (arg20 && value59.value > 0 && !value61()) {
            target2.fade = {
              from: [retain.retain.value, r2.r, r2.g, r2.b],
              started: null
            };
            delete3.add(target2);
          } else {
            delete3.delete(target2);
            target2.fade = null;
            retain.retain.value = element;
            r2.setRGB(value12, value13, value14);
            setVisible.setColor(id2.id, r2);
          }
          target2.target = target;
        }
      }
    }
    return value41;
  }
  function setRoot(arg21, arg22) {
    if (!value63 && (traverse !== arg21 || value62 !== arg22)) {
      if (traverse !== arg21) {
        fn3();
      }
      traverse = arg21 || null;
      value62 = arg22;
      if (!!value65 || !!value64 || !!length.length) {
        fn9();
        fn6();
        fn8();
        arg27();
      }
    }
  }
  function fn9() {
    if (!traverse?.traverse) {
      return;
    }
    const values4 = new Map([...clear, ...filter2.map(mesh => [mesh.mesh, mesh])]);
    const push = [];
    const add2 = new Set();
    traverse?.traverse?.(material4 => {
      if (!material4.isMesh || !material4.material || material4.userData?.environmentEffect) {
        return;
      }
      let value20;
      let value21;
      let modelNode2;
      for (let userData = material4; userData && (value20 == null && userData.userData?.environmentModelId != null && (value20 = userData.userData.environmentModelId, modelNode2 = userData), value21 == null && userData.userData?.environmentFloorId != null && (value21 = userData.userData.environmentFloorId), userData !== traverse); userData = userData.parent);
      const applied = values4.get(material4);
      const original = applied?.applied && material4.material === applied.applied ? applied.original : material4.material;
      const modelNode3 = applied && original === applied.original ? applied : {
        mesh: material4,
        original,
        applied: null
      };
      modelNode3.modelNode = modelNode2;
      modelNode3.modelKey = value20 == null ? null : value77(value21, value20);
      push.push(modelNode3);
      values4.delete(material4);
      for (const value of value79(original)) {
        add2.add(value);
        fn(value, value82);
      }
    });
    for (const mesh2 of values4.values()) {
      let value23 = false;
      for (let parent2 = mesh2.mesh; parent2; parent2 = parent2.parent) {
        if (has5.has(parent2)) {
          value23 = true;
          break;
        }
      }
      if (!value23 && mesh2.applied && mesh2.mesh.material === mesh2.applied) {
        mesh2.mesh.material = mesh2.original;
      }
    }
    clear.clear();
    const value42 = arg12 => {
      for (let parent = arg12; parent; parent = parent.parent) {
        if (has5.has(parent)) {
          return true;
        }
      }
      return false;
    };
    for (const mesh3 of values4.values()) {
      if (value42(mesh3.mesh)) {
        clear.set(mesh3.mesh, mesh3);
        for (const value2 of value79(mesh3.original)) {
          add2.add(value2);
        }
      }
    }
    filter2 = push;
    for (const [value34, values3] of values5) {
      if (!add2.has(value34)) {
        for (const material of values3.values()) {
          delete3.delete(material);
          delete2.delete(material.material);
          material.material.dispose();
        }
        values5.delete(value34);
      }
    }
    for (const [value35, source] of delete2) {
      if (!source.source && !add2.has(value35)) {
        fn4(value35, source);
        delete2.delete(value35);
      }
    }
    value65 = true;
  }
  function setMode(saturation = {}) {
    if (value63) {
      return;
    }
    if (Number.isFinite(saturation.saturation)) {
      const element2 = Math.max(0, Math.min(100, saturation.saturation)) / 100;
      if (element2 !== value60.value) {
        value60.value = element2;
        arg27();
      }
    }
    const value43 = Object.hasOwn(saturation, "enabled") ? saturation.enabled === true : value64;
    if (Object.hasOwn(saturation, "dimStrength")) {
      const value24 = Number(saturation.dimStrength);
      value76 = Number.isFinite(value24) ? Math.max(0, Math.min(100, value24)) / 100 : 0.7;
    }
    const map = Object.hasOwn(saturation, "bindings") ? Array.isArray(saturation.bindings) ? saturation.bindings : [] : length;
    const value44 = JSON.stringify(map.map(({
      id: arg6,
      floorId: arg7,
      modelId: arg8,
      entityId: arg9,
      visible: arg10
    }) => [arg6, arg7, arg8, arg9, arg10]));
    const value45 = value66 !== value44;
    const value46 = value64 !== value43;
    const value47 = value45 && saturation.animateBindings === true && value59.value > 0 && !value61();
    if (value45) {
      if (value47) {
        const map2 = new Set(map.map(value78));
        const has2 = new Set(map.map(floorId => value77(floorId.floorId, floorId.modelId)));
        for (const value3 of length) {
          if (!map2.has(value78(value3))) {
            clear2.set(value78(value3), value3);
          }
        }
        for (const [value4, floorId2] of clear2) {
          if (map2.has(value4) || has2.has(value77(floorId2.floorId, floorId2.modelId))) {
            clear2.delete(value4);
          }
        }
      } else {
        clear2.clear();
      }
    }
    value64 = value43;
    length = map;
    value66 = value44;
    if (Object.hasOwn(saturation, "states")) {
      get3 = saturation.states || {};
    }
    const value48 = Object.hasOwn(saturation, "focusedId") && (saturation.focusedId || "") !== value67 && !(saturation.selectedId ?? value68);
    if (Object.hasOwn(saturation, "focusedId")) {
      value67 = saturation.focusedId || "";
    }
    if (Object.hasOwn(saturation, "selectedId")) {
      value68 = saturation.selectedId || "";
    }
    const value49 = value64 ? value76 : 0;
    const value50 = value64 ? 1 : 0;
    const value51 = value49 !== value70 || value50 !== value72;
    if (value51) {
      value71 = value58.value;
      value73 = value59.value;
      value70 = value49;
      value72 = value50;
      value74 = null;
    }
    if (!value65 && (value64 || length.length)) {
      fn9();
    }
    if (value45 || value46 || !value75 && value64) {
      fn6();
    }
    const value52 = new Set();
    const value53 = fn8(value48 || value47, value52);
    if (clear2.size && !delete3.size) {
      clear2.clear();
      fn6();
    }
    if (value46 || value51 || value45) {
      arg27();
    } else if (value53 && (value64 || value59.value > 0)) {
      arg27([...value52]);
    }
  }
  function tick(started2) {
    if (value63) {
      return false;
    }
    setVisible.update();
    const value54 = value58.value !== value70 || value59.value !== value72;
    if (!value54 && !delete3.size) {
      return false;
    }
    if (!Number.isFinite(started2)) {
      started2 = globalThis.performance?.now() ?? Date.now();
    }
    let value55 = false;
    const add3 = new Set();
    if (value54) {
      if (value74 === null) {
        value74 = started2;
      }
      const value25 = value61() ? 1 : Math.max(0, Math.min(1, (started2 - value74) / 400));
      const value26 = value58.value;
      const value27 = value59.value;
      value58.value = value25 === 1 ? value70 : value71 + (value70 - value71) * (1 - (1 - value25) ** 2);
      value59.value = value25 === 1 ? value72 : value73 + (value72 - value73) * (1 - (1 - value25) ** 2);
      value55 ||= value26 !== value58.value || value27 !== value59.value;
    }
    for (const uniforms2 of delete3) {
      const started = uniforms2.fade;
      if (started.started === null) {
        started.started = started2;
      }
      const value28 = value61() ? 1 : Math.max(0, Math.min(1, (started2 - started.started) / 360));
      const value29 = value28 * value28 * (3 - value28 * 2);
      const value30 = uniforms2.target.map((arg4, arg5) => value28 === 1 ? arg4 : started.from[arg5] + (arg4 - started.from[arg5]) * value29);
      const r3 = uniforms2.uniforms.glow.value;
      if (uniforms2.uniforms.retain.value !== value30[0] || r3.r !== value30[1] || r3.g !== value30[2] || r3.b !== value30[3]) {
        value55 = true;
        add3.add(uniforms2.binding.floorId);
      }
      uniforms2.uniforms.retain.value = value30[0];
      r3.setRGB(value30[1], value30[2], value30[3]);
      setVisible.setColor(uniforms2.binding.id, r3);
      if (value28 === 1) {
        delete3.delete(uniforms2);
        uniforms2.fade = null;
      }
    }
    if (clear2.size && !delete3.size) {
      clear2.clear();
      fn6();
    }
    if (!value64 && value58.value === 0 && value59.value === 0) {
      fn2();
    }
    if (value55) {
      arg27(value54 ? undefined : [...add3]);
    }
    return value58.value !== value70 || value59.value !== value72 || delete3.size > 0;
  }
  return {
    setRoot,
    setMode,
    tick,
    retainRoot(arg18) {
      has5.add(arg18);
    },
    releaseRoot(arg19) {
      has5.delete(arg19);
    },
    get isActive() {
      return !value63 && (value64 || value59.value > 0);
    },
    dispose() {
      if (!value63) {
        value58.value = 0;
        value59.value = 0;
        value64 = false;
        fn3();
        setVisible.dispose();
        traverse = null;
        length = [];
        get3 = {};
        value63 = true;
      }
    }
  };
}
