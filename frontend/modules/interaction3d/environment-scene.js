import { createEnvironmentHalos } from "./environment-halos.js?v=20260908-model-halo-v1";
export function pageDimming(settings, pageOrAlias, focused = false) {
  const page = {
    climate: "environment",
    cover: "environment",
    nas: "devices",
    television: "devices",
    "vacuum-shortcut": "vacuum"
  }[pageOrAlias] || pageOrAlias;
  if (!["overview", "light", "environment", "devices", "vacuum", "security"].includes(page)) {
    return {
      page,
      strength: 0,
      enabled: false
    };
  }
  const clampPercent = (value, fallback) => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback;
  const dimStrength = clampPercent(settings.pageDimStrength?.[page], page === "overview" ? 0 : clampPercent(settings.environment?.dimStrength, 70));
  const saturation = clampPercent(settings.pageSaturation?.[page], page === "overview" ? 100 : 75);
  return {
    page,
    saturation,
    enabled: page !== "overview" || dimStrength > 0 || saturation < 100,
    strength: Math.min(100, dimStrength + (focused && page !== "overview" ? clampPercent(settings.focusDimStrength, 15) : 0))
  };
}
const PAGE_BY_MODEL_TYPE = {
  wallac: "environment",
  floorac: "environment",
  airoutlet: "environment",
  curtain: "environment",
  nas: "devices",
  tv: "devices",
  robotvacuum: "vacuum",
  camera: "security",
  presence: "security"
};
const DEVICE_KIND_BY_MODEL_TYPE = {
  wallac: "climate",
  floorac: "climate",
  airoutlet: "climate",
  curtain: "cover",
  nas: "nas",
  tv: "television",
  robotvacuum: "vacuum",
  camera: "camera",
  presence: "presence"
};
export function pageModelBindings(floors, bindings, page, floorFilter) {
  const bindingByModel = new Map(bindings.map(binding => [JSON.stringify([binding.floorId, binding.modelId]), binding]));
  return floors.filter(floor => floorFilter === "all" || floor.id === floorFilter).flatMap(floor => (floor.scene?.items || []).flatMap(item => {
    const itemPage = PAGE_BY_MODEL_TYPE[item.type];
    if (!itemPage || page !== "overview" && itemPage !== page) {
      return [];
    }
    const modelKey = JSON.stringify([floor.id, item.id]);
    const binding = bindingByModel.get(modelKey);
    return [{
      ...binding,
      id: binding?.id || "presentation:" + modelKey,
      floorId: floor.id,
      modelId: item.id,
      deviceKind: DEVICE_KIND_BY_MODEL_TYPE[item.type],
      modelType: item.type,
      modelAvailable: true,
      visible: true,
      previewOnly: !binding
    }];
  }));
}
export function createEnvironmentScene({
  THREE,
  requestFrame = () => {}
}) {
  const amountUniform = {
    value: 0
  };
  const modeUniform = {
    value: 0
  };
  const saturationUniform = {
    value: 0.75
  };
  const patchedMaterials = new Map();
  const materialClones = new Map();
  const fadingEntries = new Set();
  const retainedRoots = new Set();
  const retainedMeshes = new Map();
  const prefersReducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true || globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const halos = createEnvironmentHalos({
    THREE,
    modeAmount: modeUniform
  });
  const glowColors = {
    cool: new THREE.Color("#c8e2eb"),
    heat: new THREE.Color("#efd1ae"),
    other: new THREE.Color("#eee9df"),
    selected: new THREE.Color("#ffe1aa")
  };
  let root = null;
  let sceneRevision;
  let meshEntries = [];
  let disposed = false;
  let modeEnabled = false;
  let meshesIndexed = false;
  let bindings = [];
  let bindingsSignature = "[]";
  let states = {};
  let focusedId = "";
  let selectedId = "";
  const fadingOutBindings = new Map();
  const allBindings = () => [...bindings, ...fadingOutBindings.values()];
  let amountTarget = 0;
  let amountFrom = 0;
  let modeTarget = 0;
  let modeFrom = 0;
  let modeFadeStarted = null;
  let materialsApplied = false;
  let dimStrength = 0.7;
  const modelKey = (floorId, modelId) => JSON.stringify([String(floorId ?? ""), String(modelId ?? "")]);
  const bindingKey = binding => JSON.stringify([String(binding.id ?? ""), binding.floorId, binding.modelId]);
  const asMaterialList = material => Array.isArray(material) ? material : material ? [material] : [];
  const isPatchableMaterial = material => material?.isMaterial && !material.isShaderMaterial && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial || material.isMeshBasicMaterial || material.isMeshLambertMaterial || material.isMeshPhongMaterial || material.isMeshToonMaterial);
  const createUniforms = () => ({
    amount: amountUniform,
    retain: {
      value: 0
    },
    glow: {
      value: new THREE.Color(0, 0, 0)
    },
    lift: {
      value: new THREE.Vector2(0.12, 0.8)
    }
  });
  const sharedUniforms = createUniforms();
  function patchMaterial(material, uniforms, sourceMaterial = null) {
    if (!isPatchableMaterial(material) || patchedMaterials.has(material)) {
      return;
    }
    const oldCompile = material.onBeforeCompile;
    const oldKey = material.customProgramCacheKey;
    const hasCompile = Object.hasOwn(material, "onBeforeCompile");
    const hasKey = Object.hasOwn(material, "customProgramCacheKey");
    const priorPatch = sourceMaterial ? patchedMaterials.get(sourceMaterial) : null;
    const priorCompile = priorPatch?.priorCompile || oldCompile;
    const priorKey = priorPatch?.priorKey || oldKey;
    const keySource = sourceMaterial || material;
    const compile = function (shader, renderer) {
      priorCompile?.call(this, shader, renderer);
      const opaqueInclude = "#include <opaque_fragment>";
      if (!shader.fragmentShader.includes(opaqueInclude) || (shader.uniforms.hbEnvironmentAmount = uniforms.amount, shader.uniforms.hbEnvironmentMode = modeUniform, shader.uniforms.hbEnvironmentSaturation = saturationUniform, shader.uniforms.hbEnvironmentRetain = uniforms.retain, shader.uniforms.hbEnvironmentGlow = uniforms.glow, shader.uniforms.hbEnvironmentLift = uniforms.lift, shader.fragmentShader.includes("uniform float hbEnvironmentAmount;"))) {
        return;
      }
      shader.fragmentShader = "uniform float hbEnvironmentAmount;\nuniform float hbEnvironmentMode;\nuniform float hbEnvironmentSaturation;\nuniform float hbEnvironmentRetain;\nuniform vec3 hbEnvironmentGlow;\nuniform vec2 hbEnvironmentLift;\n" + shader.fragmentShader.replace(opaqueInclude, "float hbEnvironmentLuma = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));\noutgoingLight = mix(outgoingLight, vec3(hbEnvironmentLuma) * vec3(1.005, 1.0, 0.99), hbEnvironmentMode * (1.0 - hbEnvironmentRetain) * (1.0 - hbEnvironmentSaturation));\noutgoingLight += hbEnvironmentGlow * hbEnvironmentMode * (vec3(hbEnvironmentLift.x) + clamp(outgoingLight, 0.0, 1.0) * hbEnvironmentLift.y);\n" + opaqueInclude);
      const colorspaceInclude = "#include <colorspace_fragment>";
      shader.fragmentShader = shader.fragmentShader.replace(colorspaceInclude, colorspaceInclude + "\ngl_FragColor.rgb *= mix(1.0, 0.15, hbEnvironmentAmount * (1.0 - hbEnvironmentRetain));");
    };
    const cacheKey = function () {
      return (priorKey === THREE.Material.prototype.customProgramCacheKey ? priorCompile?.toString() || "" : priorKey?.call(keySource) || "") + "|hb-environment-saturation-v7";
    };
    patchedMaterials.set(material, {
      oldCompile,
      oldKey,
      hasCompile,
      hasKey,
      priorCompile,
      priorKey,
      compile,
      key: cacheKey,
      source: sourceMaterial
    });
    material.onBeforeCompile = compile;
    material.customProgramCacheKey = cacheKey;
    material.needsUpdate = true;
  }
  function hideEffects() {
    halos.setVisible(false);
    for (const entry of meshEntries) {
      if (entry.applied && entry.mesh.material === entry.applied) {
        entry.mesh.material = entry.original;
      }
    }
    materialsApplied = false;
  }
  function resetScene() {
    for (const entry of retainedMeshes.values()) {
      if (entry.applied && entry.mesh.material === entry.applied) {
        entry.mesh.material = entry.original;
      }
    }
    retainedMeshes.clear();
    retainedRoots.clear();
    hideEffects();
    halos.clear();
    fadingEntries.clear();
    fadingOutBindings.clear();
    for (const [material, patch] of patchedMaterials) {
      restoreMaterial(material, patch);
    }
    for (const cloneMap of materialClones.values()) {
      for (const cloneEntry of cloneMap.values()) {
        cloneEntry.material.dispose();
      }
    }
    patchedMaterials.clear();
    materialClones.clear();
    meshEntries = [];
    meshesIndexed = false;
  }
  function restoreMaterial(material, patch) {
    let changed = false;
    if (material.onBeforeCompile === patch.compile) {
      if (patch.hasCompile) {
        material.onBeforeCompile = patch.oldCompile;
      } else {
        delete material.onBeforeCompile;
      }
      changed = true;
    }
    if (material.customProgramCacheKey === patch.key) {
      if (patch.hasKey) {
        material.customProgramCacheKey = patch.oldKey;
      } else {
        delete material.customProgramCacheKey;
      }
      changed = true;
    }
    if (changed) {
      if (!patch.source) {
        material.dispose();
      }
      material.needsUpdate = true;
    }
  }
  function cloneMaterialForBinding(sourceMaterial, binding) {
    if (!isPatchableMaterial(sourceMaterial)) {
      return sourceMaterial;
    }
    let clonesByBinding = materialClones.get(sourceMaterial);
    if (!clonesByBinding) {
      clonesByBinding = new Map();
      materialClones.set(sourceMaterial, clonesByBinding);
    }
    const key = bindingKey(binding);
    let cloneEntry = clonesByBinding.get(key);
    if (!cloneEntry) {
      const clone = sourceMaterial.clone();
      const uniforms = createUniforms();
      if (sourceMaterial.defines) {
        clone.defines = {
          ...sourceMaterial.defines
        };
      }
      Object.defineProperty(clone, "environmentSourceMaterial", {
        value: sourceMaterial,
        configurable: true
      });
      patchMaterial(clone, uniforms, sourceMaterial);
      cloneEntry = {
        material: clone,
        uniforms,
        binding
      };
      clonesByBinding.set(key, cloneEntry);
    }
    cloneEntry.binding = binding;
    cloneEntry.uniforms.lift.value.set(...(binding.deviceKind === "cover" ? [0.025, 0.9] : binding.deviceKind === "climate" ? [0.16, 1.05] : [0.12, 0.8]));
    return cloneEntry.material;
  }
  function applyMaterials() {
    if (!root || !modeEnabled && amountUniform.value === 0 && modeUniform.value === 0) {
      hideEffects();
      pruneUnusedClones();
      return;
    }
    halos.sync(root, allBindings(), sceneRevision, new Map(meshEntries.filter(entry => entry.modelNode).map(entry => [entry.modelKey, entry.modelNode])));
    halos.setVisible(true);
    const bindingByModelKey = new Map();
    for (const binding of allBindings()) {
      if (binding.modelId != null && binding.visible !== false) {
        const key = modelKey(binding.floorId, binding.modelId);
        if (!bindingByModelKey.has(key)) {
          bindingByModelKey.set(key, binding);
        }
      }
    }
    for (const entry of meshEntries) {
      const binding = bindingByModelKey.get(entry.modelKey);
      if (binding) {
        const applied = asMaterialList(entry.original).map(material => cloneMaterialForBinding(material, binding));
        entry.applied = Array.isArray(entry.original) ? applied : applied[0];
        entry.mesh.material = entry.applied;
      } else {
        if (entry.applied && entry.mesh.material === entry.applied) {
          entry.mesh.material = entry.original;
        }
        entry.applied = null;
      }
    }
    materialsApplied = true;
    pruneUnusedClones();
  }
  function pruneUnusedClones() {
    const activeKeys = new Set(allBindings().map(bindingKey));
    for (const [sourceMaterial, cloneMap] of materialClones) {
      for (const [key, cloneEntry] of cloneMap) {
        if (!activeKeys.has(key)) {
          fadingEntries.delete(cloneEntry);
          patchedMaterials.delete(cloneEntry.material);
          cloneEntry.material.dispose();
          cloneMap.delete(key);
        }
      }
      if (!cloneMap.size) {
        materialClones.delete(sourceMaterial);
      }
    }
  }
  function syncGlowTargets(animate = false, dirtyFloors = new Set()) {
    const focusOrSelected = selectedId || focusedId;
    const hasFocusedBinding = !!focusOrSelected && bindings.some(binding => binding.id === focusOrSelected);
    let changed = false;
    for (const cloneMap of materialClones.values()) {
      for (const entry of cloneMap.values()) {
        const binding = entry.binding;
        const retainAmount = !fadingOutBindings.has(bindingKey(binding)) && (!hasFocusedBinding || binding.id === focusOrSelected) ? 1 : 0;
        const entityId = binding.entityId || (binding.deviceKind === "nas" ? binding.statusSource?.primaryEntityId : "");
        const rawState = states instanceof Map ? states.get(entityId) : states?.[entityId];
        const state = rawState?.newState || rawState || {};
        const hvacMode = String(state.state || "").toLowerCase();
        const isOn = !["", "off", "unknown", "unavailable"].includes(hvacMode);
        const isSelected = binding.id === selectedId;
        const glowScale = retainAmount ? isSelected ? 1.45 : binding.deviceKind === "cover" ? 1.2 : binding.deviceKind === "climate" ? isOn ? 1.35 : 1 : isOn ? 1.125 : 0.325 : 0;
        const baseColor = isSelected ? glowColors.selected : isOn && glowColors[hvacMode] || glowColors.other;
        const glowR = glowScale * baseColor.r;
        const glowG = glowScale * baseColor.g;
        const glowB = glowScale * baseColor.b;
        const uniforms = entry.uniforms;
        const glow = uniforms.glow.value;
        const target = [retainAmount, glowR, glowG, glowB];
        if (!entry.target?.every((value, index) => value === target[index])) {
          changed = true;
          dirtyFloors.add(binding.floorId);
          if (animate && modeUniform.value > 0 && !prefersReducedMotion()) {
            entry.fade = {
              from: [uniforms.retain.value, glow.r, glow.g, glow.b],
              started: null
            };
            fadingEntries.add(entry);
          } else {
            fadingEntries.delete(entry);
            entry.fade = null;
            uniforms.retain.value = retainAmount;
            glow.setRGB(glowR, glowG, glowB);
            halos.setColor(binding.id, glow);
          }
          entry.target = target;
        }
      }
    }
    return changed;
  }
  function setRoot(nextRoot, revision) {
    if (!disposed && (root !== nextRoot || sceneRevision !== revision)) {
      if (root !== nextRoot) {
        resetScene();
      }
      root = nextRoot || null;
      sceneRevision = revision;
      if (!!meshesIndexed || !!modeEnabled || !!bindings.length) {
        indexMeshes();
        applyMaterials();
        syncGlowTargets();
        requestFrame();
      }
    }
  }
  function indexMeshes() {
    if (!root?.traverse) {
      return;
    }
    const previousEntries = new Map([...retainedMeshes, ...meshEntries.map(entry => [entry.mesh, entry])]);
    const nextEntries = [];
    const liveMaterials = new Set();
    root?.traverse?.(mesh => {
      if (!mesh.isMesh || !mesh.material || mesh.userData?.environmentEffect) {
        return;
      }
      let modelId;
      let floorId;
      let modelNode;
      for (let node = mesh; node && (modelId == null && node.userData?.environmentModelId != null && (modelId = node.userData.environmentModelId, modelNode = node), floorId == null && node.userData?.environmentFloorId != null && (floorId = node.userData.environmentFloorId), node !== root); node = node.parent);
      const previous = previousEntries.get(mesh);
      const original = previous?.applied && mesh.material === previous.applied ? previous.original : mesh.material;
      const entry = previous && original === previous.original ? previous : {
        mesh,
        original,
        applied: null
      };
      entry.modelNode = modelNode;
      entry.modelKey = modelId == null ? null : modelKey(floorId, modelId);
      nextEntries.push(entry);
      previousEntries.delete(mesh);
      for (const material of asMaterialList(original)) {
        liveMaterials.add(material);
        patchMaterial(material, sharedUniforms);
      }
    });
    for (const entry of previousEntries.values()) {
      let underRetainedRoot = false;
      for (let node = entry.mesh; node; node = node.parent) {
        if (retainedRoots.has(node)) {
          underRetainedRoot = true;
          break;
        }
      }
      if (!underRetainedRoot && entry.applied && entry.mesh.material === entry.applied) {
        entry.mesh.material = entry.original;
      }
    }
    retainedMeshes.clear();
    const isUnderRetainedRoot = node => {
      for (let current = node; current; current = current.parent) {
        if (retainedRoots.has(current)) {
          return true;
        }
      }
      return false;
    };
    for (const entry of previousEntries.values()) {
      if (isUnderRetainedRoot(entry.mesh)) {
        retainedMeshes.set(entry.mesh, entry);
        for (const material of asMaterialList(entry.original)) {
          liveMaterials.add(material);
        }
      }
    }
    meshEntries = nextEntries;
    for (const [sourceMaterial, cloneMap] of materialClones) {
      if (!liveMaterials.has(sourceMaterial)) {
        for (const cloneEntry of cloneMap.values()) {
          fadingEntries.delete(cloneEntry);
          patchedMaterials.delete(cloneEntry.material);
          cloneEntry.material.dispose();
        }
        materialClones.delete(sourceMaterial);
      }
    }
    for (const [material, patch] of patchedMaterials) {
      if (!patch.source && !liveMaterials.has(material)) {
        restoreMaterial(material, patch);
        patchedMaterials.delete(material);
      }
    }
    meshesIndexed = true;
  }
  function setMode(options = {}) {
    if (disposed) {
      return;
    }
    if (Number.isFinite(options.saturation)) {
      const nextSaturation = Math.max(0, Math.min(100, options.saturation)) / 100;
      if (nextSaturation !== saturationUniform.value) {
        saturationUniform.value = nextSaturation;
        requestFrame();
      }
    }
    const nextEnabled = Object.hasOwn(options, "enabled") ? options.enabled === true : modeEnabled;
    if (Object.hasOwn(options, "dimStrength")) {
      const nextDim = Number(options.dimStrength);
      dimStrength = Number.isFinite(nextDim) ? Math.max(0, Math.min(100, nextDim)) / 100 : 0.7;
    }
    const nextBindings = Object.hasOwn(options, "bindings") ? Array.isArray(options.bindings) ? options.bindings : [] : bindings;
    const nextSignature = JSON.stringify(nextBindings.map(({
      id,
      floorId,
      modelId,
      entityId,
      visible
    }) => [id, floorId, modelId, entityId, visible]));
    const bindingsChanged = bindingsSignature !== nextSignature;
    const enabledChanged = modeEnabled !== nextEnabled;
    const animateBindings = bindingsChanged && options.animateBindings === true && modeUniform.value > 0 && !prefersReducedMotion();
    if (bindingsChanged) {
      if (animateBindings) {
        const nextKeys = new Set(nextBindings.map(bindingKey));
        const nextModelKeys = new Set(nextBindings.map(binding => modelKey(binding.floorId, binding.modelId)));
        for (const binding of bindings) {
          if (!nextKeys.has(bindingKey(binding))) {
            fadingOutBindings.set(bindingKey(binding), binding);
          }
        }
        for (const [key, binding] of fadingOutBindings) {
          if (nextKeys.has(key) || nextModelKeys.has(modelKey(binding.floorId, binding.modelId))) {
            fadingOutBindings.delete(key);
          }
        }
      } else {
        fadingOutBindings.clear();
      }
    }
    modeEnabled = nextEnabled;
    bindings = nextBindings;
    bindingsSignature = nextSignature;
    if (Object.hasOwn(options, "states")) {
      states = options.states || {};
    }
    const focusChanged = Object.hasOwn(options, "focusedId") && (options.focusedId || "") !== focusedId && !(options.selectedId ?? selectedId);
    if (Object.hasOwn(options, "focusedId")) {
      focusedId = options.focusedId || "";
    }
    if (Object.hasOwn(options, "selectedId")) {
      selectedId = options.selectedId || "";
    }
    const nextAmountTarget = modeEnabled ? dimStrength : 0;
    const nextModeTarget = modeEnabled ? 1 : 0;
    const targetsChanged = nextAmountTarget !== amountTarget || nextModeTarget !== modeTarget;
    if (targetsChanged) {
      amountFrom = amountUniform.value;
      modeFrom = modeUniform.value;
      amountTarget = nextAmountTarget;
      modeTarget = nextModeTarget;
      modeFadeStarted = null;
    }
    if (!meshesIndexed && (modeEnabled || bindings.length)) {
      indexMeshes();
    }
    if (bindingsChanged || enabledChanged || !materialsApplied && modeEnabled) {
      applyMaterials();
    }
    const dirtyFloors = new Set();
    const glowChanged = syncGlowTargets(focusChanged || animateBindings, dirtyFloors);
    if (fadingOutBindings.size && !fadingEntries.size) {
      fadingOutBindings.clear();
      applyMaterials();
    }
    if (enabledChanged || targetsChanged || bindingsChanged) {
      requestFrame();
    } else if (glowChanged && (modeEnabled || modeUniform.value > 0)) {
      requestFrame([...dirtyFloors]);
    }
  }
  function tick(nowMs) {
    if (disposed) {
      return false;
    }
    halos.update();
    const fadingMode = amountUniform.value !== amountTarget || modeUniform.value !== modeTarget;
    if (!fadingMode && !fadingEntries.size) {
      return false;
    }
    if (!Number.isFinite(nowMs)) {
      nowMs = globalThis.performance?.now() ?? Date.now();
    }
    let changed = false;
    const dirtyFloors = new Set();
    if (fadingMode) {
      if (modeFadeStarted === null) {
        modeFadeStarted = nowMs;
      }
      const progress = prefersReducedMotion() ? 1 : Math.max(0, Math.min(1, (nowMs - modeFadeStarted) / 400));
      const prevAmount = amountUniform.value;
      const prevMode = modeUniform.value;
      amountUniform.value = progress === 1 ? amountTarget : amountFrom + (amountTarget - amountFrom) * (1 - (1 - progress) ** 2);
      modeUniform.value = progress === 1 ? modeTarget : modeFrom + (modeTarget - modeFrom) * (1 - (1 - progress) ** 2);
      changed ||= prevAmount !== amountUniform.value || prevMode !== modeUniform.value;
    }
    for (const entry of fadingEntries) {
      const fade = entry.fade;
      if (fade.started === null) {
        fade.started = nowMs;
      }
      const progress = prefersReducedMotion() ? 1 : Math.max(0, Math.min(1, (nowMs - fade.started) / 360));
      const eased = progress * progress * (3 - progress * 2);
      const next = entry.target.map((value, index) => progress === 1 ? value : fade.from[index] + (value - fade.from[index]) * eased);
      const glow = entry.uniforms.glow.value;
      if (entry.uniforms.retain.value !== next[0] || glow.r !== next[1] || glow.g !== next[2] || glow.b !== next[3]) {
        changed = true;
        dirtyFloors.add(entry.binding.floorId);
      }
      entry.uniforms.retain.value = next[0];
      glow.setRGB(next[1], next[2], next[3]);
      halos.setColor(entry.binding.id, glow);
      if (progress === 1) {
        fadingEntries.delete(entry);
        entry.fade = null;
      }
    }
    if (fadingOutBindings.size && !fadingEntries.size) {
      fadingOutBindings.clear();
      applyMaterials();
    }
    if (!modeEnabled && amountUniform.value === 0 && modeUniform.value === 0) {
      hideEffects();
    }
    if (changed) {
      requestFrame(fadingMode ? undefined : [...dirtyFloors]);
    }
    return amountUniform.value !== amountTarget || modeUniform.value !== modeTarget || fadingEntries.size > 0;
  }
  return {
    setRoot,
    setMode,
    tick,
    retainRoot(node) {
      retainedRoots.add(node);
    },
    releaseRoot(node) {
      retainedRoots.delete(node);
    },
    get isActive() {
      return !disposed && (modeEnabled || modeUniform.value > 0);
    },
    dispose() {
      if (!disposed) {
        amountUniform.value = 0;
        modeUniform.value = 0;
        modeEnabled = false;
        resetScene();
        halos.dispose();
        root = null;
        bindings = [];
        states = {};
        disposed = true;
      }
    }
  };
}
