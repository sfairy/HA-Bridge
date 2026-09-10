const HVAC_COLORS = {
  cool: "#73c8ff",
  heat: "#ff8a65",
  other: "#dce2e6"
};
const ACTIVE_HVAC_ACTIONS = new Set(["cooling", "cool", "heating", "heat", "fan", "fan_only", "drying"]);
const modelKey = (floorId, modelId) => JSON.stringify([String(floorId ?? ""), String(modelId ?? "")]);
export function createEnvironmentAirflow({
  THREE,
  requestFrame = () => {},
  reducedMotion: reducedMotionOption
} = {}) {
  let root = null;
  let sceneRevision;
  let enabled = false;
  let bindings = [];
  let states = {};
  let focusedId = "";
  let disposed = false;
  let modelNodes = new Map();
  let entries = new Map();
  let modelsIndexed = false;
  let lastFrameAt = -Infinity;
  let overviewOverride;
  const isOverview = () => overviewOverride ?? !focusedId;
  let reducedMotionOverride = typeof reducedMotionOption == "boolean" ? reducedMotionOption : undefined;
  const reducedMotionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => reducedMotionOverride ?? reducedMotionQuery?.matches ?? false;
  const vertexShader = "attribute float flowLayer;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    void main() {\n      vFlowUv = uv; vFlowLayer = flowLayer;\n      vec3 expanded = position;\n      // Expand away from the outlet; the mouth keeps its authored position and width.\n      expanded.x *= 1.0 + flowOverview * 0.15 * uv.y;\n      expanded.y *= 1.0 + flowOverview * 0.25;\n      expanded.z *= 1.0 + flowOverview * 0.35;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(expanded, 1.0);\n    }";
  const fragmentShader = "uniform vec3 flowColor;\n    uniform float flowOpacity;\n    uniform float flowTime;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    float hash(vec2 p) {\n      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n    }\n    float noise(vec2 p) {\n      vec2 cell = floor(p), f = fract(p);\n      f = f * f * (3.0 - 2.0 * f);\n      return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),\n        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), f.x), f.y);\n    }\n    void main() {\n      float t = vFlowUv.y, across = vFlowUv.x * 2.0 - 1.0;\n      float edge = exp(-0.8 * across * across) * (1.0 - smoothstep(0.45, 1.0, abs(across)));\n      float distanceFade = smoothstep(0.0, 0.025, t) * exp(-mix(1.15, 0.9, flowOverview) * t)\n        * (1.0 - smoothstep(0.62, 1.0, t));\n      // Advected, lengthwise fibres: deliberately much longer than they are\n      // wide, so the air reads as a continuous breeze, never dots or light bars.\n      float drift = sin(t * 4.0 - flowTime * 0.45 + vFlowLayer * 2.0) * t * 0.16;\n      // Broader, lower-frequency strands survive the smaller screen footprint\n      // in the whole-home view; focus retains the finer, softer texture.\n      vec2 p = vec2(vFlowUv.x * mix(15.0, 7.0, flowOverview) + drift + vFlowLayer * 23.0,\n        t * mix(1.8, 1.25, flowOverview) - flowTime * 0.9);\n      float detail = mix(0.28, 0.1, flowOverview);\n      float fibres = noise(p) * (1.0 - detail) + noise(p * vec2(1.9, 0.7) + 13.0) * detail;\n      // Keep the broad haze nearly invisible; most opacity belongs to the\n      // lengthwise fibres so the stronger breeze does not become a solid fan.\n      float density = 0.012 + 0.95 * fibres * fibres;\n      // A soft density ceiling keeps the stronger near-outlet strands\n      // translucent while letting their motion remain readable at room scale.\n      density = density / (1.0 + density * 0.55);\n      float alpha = flowOpacity * edge * distanceFade * density * mix(1.0, 0.42, vFlowLayer);\n      gl_FragColor = vec4(flowColor, alpha);\n      #include <colorspace_fragment>\n    }";
  function modelBounds(modelNode) {
    const box = new THREE.Box3();
    const identity = new THREE.Matrix4();
    function accumulate(node, worldMatrix) {
      if (!node.userData?.environmentAirflow && (node === modelNode || node.userData?.environmentModelId == null)) {
        if (node.isMesh && node.geometry?.attributes?.position) {
          const position = node.geometry.attributes.position;
          if (position.count > 0 && typeof position.getX == "function") {
            const meshBox = new THREE.Box3().setFromBufferAttribute(position).applyMatrix4(worldMatrix);
            if ([meshBox.min.x, meshBox.min.y, meshBox.min.z, meshBox.max.x, meshBox.max.y, meshBox.max.z].every(Number.isFinite)) {
              box.union(meshBox);
            }
          }
        }
        for (const child of node.children || []) {
          if (child.matrixAutoUpdate) {
            child.updateMatrix();
          }
          accumulate(child, new THREE.Matrix4().multiplyMatrices(worldMatrix, child.matrix));
        }
      }
    }
    accumulate(modelNode, identity);
    if (box.isEmpty()) {
      return null;
    } else {
      return box;
    }
  }
  function outletLayout(modelNode) {
    const bounds = modelBounds(modelNode);
    if (!bounds) {
      return null;
    }
    const size = bounds.getSize(new THREE.Vector3());
    if (size.x <= 0 || size.y <= 0 || size.z <= 0) {
      return null;
    }
    const type = modelNode.userData.environmentModelType || (size.y > size.x * 1.5 && size.y > size.z * 1.5 ? "floorac" : "wallac");
    if (type === "airoutlet") {
      const length = Math.min(2.4, Math.max(0.6, size.z * 0.9));
      return {
        type,
        width: size.z * 0.88,
        length,
        fall: length * 0.28,
        rotationY: Math.PI / 2,
        spread: 0.3,
        outlet: [bounds.max.x + Math.max(0.003, size.x * 0.03), bounds.min.y + size.y * 0.48, (bounds.min.z + bounds.max.z) / 2]
      };
    }
    const isFloorAc = type === "floorac";
    const width = size.x * (isFloorAc ? 0.48 : 0.84);
    const length = Math.min(2.8, Math.max(0.3, isFloorAc ? Math.max(size.y * 0.95, size.x * 3) : size.x * 1.8));
    return {
      type,
      width,
      length,
      verticalSpan: isFloorAc ? size.y * 0.4 : 0,
      fall: length * (isFloorAc ? 0.12 : 0.38),
      outlet: [(bounds.min.x + bounds.max.x) / 2, bounds.min.y + size.y * (isFloorAc ? 0.68 : 0.18), bounds.max.z + Math.max(0.003, size.z * 0.03)]
    };
  }
  function buildFlowGeometry(layout) {
    const positions = [];
    const uvs = [];
    const layers = [];
    const indices = [];
    for (let layer = 0; layer < 2; layer++) {
      const baseIndex = positions.length / 3;
      for (let along = 0; along <= 24; along++) {
        const t = along / 24;
        const spread = 1 + (t * 0.8 + t * t * 0.15) * (layout.spread ?? 1);
        for (let across = 0; across <= 6; across++) {
          const u = across / 6;
          const acrossSigned = u * 2 - 1;
          const arch = (1 - acrossSigned * acrossSigned) * layout.width * t * 0.09;
          const layerLift = layer * layout.width * t * 0.075;
          const useVertical = layout.verticalSpan > 0 && layer === 0;
          positions.push(useVertical ? arch : acrossSigned * layout.width * 0.5 * spread, -layout.fall * (t * 0.35 + t * 0.65 * t) + (useVertical ? acrossSigned * layout.verticalSpan * 0.5 * (1 + t * 0.2) : arch + layerLift), layout.length * t);
          uvs.push(u, t);
          layers.push(layer);
          if (along < 24 && across < 6) {
            const i0 = baseIndex + along * 7 + across;
            const i1 = i0 + 6 + 1;
            indices.push(i0, i0 + 1, i1, i0 + 1, i1 + 1, i1);
          }
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("flowLayer", new THREE.Float32BufferAttribute(layers, 1));
    geometry.setIndex(indices);
    geometry.computeBoundingBox();
    const scratch = new THREE.Vector3();
    for (let i = 0; i < positions.length / 3; i++) {
      geometry.boundingBox.expandByPoint(scratch.set(positions[i * 3] * (1 + uvs[i * 2 + 1] * 0.15), positions[i * 3 + 1] * 1.25, positions[i * 3 + 2] * 1.35));
    }
    geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere());
    return geometry;
  }
  function disposeEntry(entry) {
    entry.mesh.removeFromParent();
    entry.mesh.geometry.dispose();
    entry.mesh.material.dispose();
  }
  function refreshLayout(entry) {
    const layout = outletLayout(entry.model);
    if (!layout) {
      return false;
    }
    const layoutSignature = JSON.stringify(layout);
    if (layoutSignature !== entry.layoutSignature) {
      entry.mesh.geometry.dispose();
      entry.mesh.geometry = buildFlowGeometry(layout);
      entry.mesh.position.fromArray(layout.outlet);
      entry.mesh.rotation.y = layout.rotationY || 0;
      entry.mesh.updateMatrix();
      entry.layoutSignature = layoutSignature;
      entry.mesh.userData.outletLayout = layout;
    }
    return true;
  }
  function createEntry(modelNode, binding) {
    const layout = outletLayout(modelNode);
    if (!layout) {
      return null;
    }
    const overviewAmount = isOverview() ? 1 : 0;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        flowColor: {
          value: new THREE.Color(HVAC_COLORS.other)
        },
        flowOpacity: {
          value: 0
        },
        flowTime: {
          value: 0
        },
        flowOverview: {
          value: overviewAmount
        }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      forceSinglePass: true,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(buildFlowGeometry(layout), material);
    mesh.name = "environment-airflow-" + (binding.id || binding.modelId);
    mesh.userData.environmentAirflow = true;
    mesh.userData.environmentEffect = true;
    mesh.userData.outletLayout = layout;
    mesh.position.fromArray(layout.outlet);
    mesh.rotation.y = layout.rotationY || 0;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 4;
    mesh.visible = false;
    mesh.raycast = () => {};
    modelNode.add(mesh);
    return {
      mesh,
      model: modelNode,
      binding,
      layoutSignature: JSON.stringify(layout),
      target: 0,
      startOpacity: 0,
      overviewTarget: overviewAmount,
      startOverview: overviewAmount,
      startTime: null
    };
  }
  function indexModels() {
    modelNodes = new Map();
    root?.traverse?.(node => {
      if (node.userData?.environmentAirflow || node.userData?.environmentModelId == null) {
        return;
      }
      let floorId = node.userData.environmentFloorId;
      for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
        floorId = parent.userData?.environmentFloorId;
      }
      modelNodes.set(modelKey(floorId, node.userData.environmentModelId), node);
    });
    modelsIndexed = true;
  }
  function syncEntries(refreshLayouts = false) {
    if (!modelsIndexed && enabled && bindings.length) {
      indexModels();
    }
    const activeKeys = new Set();
    for (const binding of bindings) {
      if (binding.visible === false || binding.modelId == null) {
        continue;
      }
      const key = modelKey(binding.floorId, binding.modelId);
      const modelNode = modelNodes.get(key);
      if (!modelNode) {
        continue;
      }
      activeKeys.add(key);
      let entry = entries.get(key);
      if (entry && entry.model !== modelNode) {
        disposeEntry(entry);
        entries.delete(key);
        entry = null;
      }
      if (!entry && enabled) {
        entry = createEntry(modelNode, binding);
        if (entry) {
          entries.set(key, entry);
        }
      }
      if (entry) {
        entry.binding = binding;
        if (refreshLayouts && !refreshLayout(entry)) {
          disposeEntry(entry);
          entries.delete(key);
        }
      }
    }
    for (const [key, entry] of entries) {
      if (!activeKeys.has(key)) {
        disposeEntry(entry);
        entries.delete(key);
      }
    }
  }
  function syncTargets() {
    let changed = false;
    for (const entry of entries.values()) {
      const binding = entry.binding;
      const rawState = states instanceof Map ? states.get(binding.entityId) : states?.[binding.entityId];
      const state = rawState?.newState || rawState || {};
      const hvacMode = String(state.state || "").toLowerCase();
      const hvacAction = String(state.attributes?.hvac_action || "").toLowerCase();
      const isFocused = !focusedId || binding.id === focusedId;
      const isActive = !["", "off", "unknown", "unavailable"].includes(hvacMode) && (hvacAction === "" || ACTIVE_HVAC_ACTIONS.has(hvacAction));
      const overviewAmount = isOverview() ? 1 : 0;
      const targetOpacity = enabled && isFocused && isActive ? overviewAmount ? 1 : 0.68 : 0;
      const uniforms = entry.mesh.material.uniforms;
      const flowColor = new THREE.Color(HVAC_COLORS[hvacMode] || HVAC_COLORS.other);
      if (targetOpacity > 0 && !uniforms.flowColor.value.equals(flowColor)) {
        uniforms.flowColor.value.copy(flowColor);
        changed = true;
      }
      if (entry.target !== targetOpacity || entry.overviewTarget !== overviewAmount) {
        entry.target = targetOpacity;
        entry.startOpacity = uniforms.flowOpacity.value;
        entry.overviewTarget = overviewAmount;
        entry.startOverview = uniforms.flowOverview.value;
        entry.startTime = null;
        changed = true;
      }
      if (!isFocused || prefersReducedMotion()) {
        if (uniforms.flowOpacity.value !== targetOpacity || uniforms.flowOverview.value !== overviewAmount) {
          changed = true;
        }
        uniforms.flowOpacity.value = targetOpacity;
        uniforms.flowOverview.value = overviewAmount;
        entry.mesh.visible = targetOpacity > 0;
        if (prefersReducedMotion()) {
          uniforms.flowTime.value = 0;
        }
      } else if (targetOpacity > 0) {
        entry.mesh.visible = true;
      } else if (uniforms.flowOpacity.value === 0) {
        entry.mesh.visible = false;
        uniforms.flowOverview.value = overviewAmount;
      }
    }
    if (changed) {
      requestFrame();
    }
  }
  function setRoot(nextRoot, revision) {
    if (!disposed && (root !== nextRoot || sceneRevision !== revision)) {
      if (root !== nextRoot) {
        for (const entry of entries.values()) {
          disposeEntry(entry);
        }
        entries.clear();
        modelNodes.clear();
        modelsIndexed = false;
      }
      root = nextRoot || null;
      sceneRevision = revision;
      modelsIndexed = false;
      if (!!enabled || !!entries.size) {
        indexModels();
        syncEntries(true);
        syncTargets();
        requestFrame();
      }
    }
  }
  function setState(next = {}) {
    if (disposed) {
      return;
    }
    const wasReduced = prefersReducedMotion();
    if (Object.hasOwn(next, "enabled")) {
      enabled = next.enabled === true;
    }
    if (Object.hasOwn(next, "bindings")) {
      bindings = Array.isArray(next.bindings) ? next.bindings : [];
    }
    if (Object.hasOwn(next, "states")) {
      states = next.states || {};
    }
    if (Object.hasOwn(next, "focusedId")) {
      focusedId = next.focusedId || "";
    }
    if (Object.hasOwn(next, "overview")) {
      overviewOverride = typeof next.overview == "boolean" ? next.overview : undefined;
    }
    if (Object.hasOwn(next, "reducedMotion")) {
      reducedMotionOverride = next.reducedMotion === true;
    }
    syncEntries();
    syncTargets();
    if (wasReduced !== prefersReducedMotion()) {
      requestFrame();
    }
  }
  function tick(nowMs) {
    if (disposed || prefersReducedMotion() || (Number.isFinite(nowMs) || (nowMs = globalThis.performance?.now() ?? Date.now()), ![...entries.values()].some(entry => entry.target > 0 || entry.mesh.material.uniforms.flowOpacity.value > 0))) {
      return false;
    }
    const frameIntervalMs = 1000 / 30;
    if (nowMs >= lastFrameAt && nowMs - lastFrameAt < frameIntervalMs) {
      return true;
    }
    lastFrameAt = Number.isFinite(lastFrameAt) && nowMs >= lastFrameAt ? nowMs - (nowMs - lastFrameAt) % frameIntervalMs : nowMs;
    let animating = false;
    let changed = false;
    for (const entry of entries.values()) {
      const uniforms = entry.mesh.material.uniforms;
      if (uniforms.flowOpacity.value !== entry.target || uniforms.flowOverview.value !== entry.overviewTarget) {
        if (entry.startTime === null) {
          entry.startTime = nowMs;
        }
        const progress = Math.max(0, Math.min(1, (nowMs - entry.startTime) / 240));
        const nextOpacity = entry.startOpacity + (entry.target - entry.startOpacity) * progress;
        const eased = progress * progress * (3 - progress * 2);
        const nextOverview = entry.startOverview + (entry.overviewTarget - entry.startOverview) * eased;
        if (uniforms.flowOpacity.value !== nextOpacity || uniforms.flowOverview.value !== nextOverview) {
          changed = true;
        }
        uniforms.flowOpacity.value = nextOpacity;
        uniforms.flowOverview.value = nextOverview;
        if (progress === 1) {
          uniforms.flowOpacity.value = entry.target;
          uniforms.flowOverview.value = entry.overviewTarget;
          entry.mesh.visible = entry.target > 0;
        } else {
          animating = true;
        }
      }
      if (entry.mesh.visible && (entry.target > 0 || uniforms.flowOpacity.value > 0)) {
        const flowTime = nowMs / 1000 % 1000;
        if (uniforms.flowTime.value !== flowTime) {
          changed = true;
        }
        uniforms.flowTime.value = flowTime;
        animating = true;
      }
    }
    if (changed) {
      requestFrame();
    }
    return animating;
  }
  const onReducedMotionChange = () => {
    if (!disposed) {
      syncTargets();
      requestFrame();
    }
  };
  reducedMotionQuery?.addEventListener?.("change", onReducedMotionChange);
  return {
    setRoot,
    setState,
    tick,
    nextDelay() {
      if (!disposed && !prefersReducedMotion() && [...entries.values()].some(entry => entry.target > 0 || entry.mesh.material.uniforms.flowOpacity.value > 0)) {
        return 1000 / 30;
      } else {
        return Infinity;
      }
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        reducedMotionQuery?.removeEventListener?.("change", onReducedMotionChange);
        for (const entry of entries.values()) {
          disposeEntry(entry);
        }
        entries.clear();
        modelNodes.clear();
        bindings = [];
        states = {};
        root = null;
      }
    }
  };
}
