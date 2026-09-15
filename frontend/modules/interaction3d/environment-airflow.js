const FLOW_STATE_COLORS = {
  cool: "#73c8ff",
  heat: "#ff8a65",
  other: "#dce2e6"
};
const AIRFLOW_ACTIONS = new Set([
  "cooling",
  "cool",
  "heating",
  "heat",
  "fan",
  "fan_only",
  "drying"
]);
const composeBindingKey = (keyFloorId, keyModelId) =>
  JSON.stringify([String(keyFloorId ?? ""), String(keyModelId ?? "")]);
export function createEnvironmentAirflow({
  THREE: THREE,
  requestFrame: requestFrame = () => {},
  reducedMotion: reducedMotion
} = {}) {
  let sceneRoot = null;
  let rootRevision;
  let isEnabled = false;
  let bindings = [];
  let entityStates = {};
  let focusedId = "";
  let isDisposed = false;
  let objectsByBindingKey = new Map();
  let effectsByBindingKey = new Map();
  let hasIndexedScene = false;
  let lastTickMs = -Infinity;
  let overviewOverride;
  const isOverviewMode = () => overviewOverride ?? !focusedId;
  let reducedMotionOverride = typeof reducedMotion == "boolean" ? reducedMotion : undefined;
  const reducedMotionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = () => reducedMotionOverride ?? reducedMotionQuery?.matches ?? false;
  const FLOW_VERTEX_SHADER =
    "attribute float flowLayer;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    void main() {\n      vFlowUv = uv; vFlowLayer = flowLayer;\n      vec3 expanded = position;\n      // Expand away from the outlet; the mouth keeps its authored position and width.\n      expanded.x *= 1.0 + flowOverview * 0.15 * uv.y;\n      expanded.y *= 1.0 + flowOverview * 0.25;\n      expanded.z *= 1.0 + flowOverview * 0.35;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(expanded, 1.0);\n    }";
  const FLOW_FRAGMENT_SHADER =
    "uniform vec3 flowColor;\n    uniform float flowOpacity;\n    uniform float flowTime;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    float hash(vec2 p) {\n      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n    }\n    float noise(vec2 p) {\n      vec2 cell = floor(p), f = fract(p);\n      f = f * f * (3.0 - 2.0 * f);\n      return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),\n        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), f.x), f.y);\n    }\n    void main() {\n      float t = vFlowUv.y, across = vFlowUv.x * 2.0 - 1.0;\n      float edge = exp(-0.8 * across * across) * (1.0 - smoothstep(0.45, 1.0, abs(across)));\n      float distanceFade = smoothstep(0.0, 0.025, t) * exp(-mix(1.15, 0.9, flowOverview) * t)\n        * (1.0 - smoothstep(0.62, 1.0, t));\n      // Advected, lengthwise fibres: deliberately much longer than they are\n      // wide, so the air reads as a continuous breeze, never dots or light bars.\n      float drift = sin(t * 4.0 - flowTime * 0.45 + vFlowLayer * 2.0) * t * 0.16;\n      // Broader, lower-frequency strands survive the smaller screen footprint\n      // in the whole-home view; focus retains the finer, softer texture.\n      vec2 p = vec2(vFlowUv.x * mix(15.0, 7.0, flowOverview) + drift + vFlowLayer * 23.0,\n        t * mix(1.8, 1.25, flowOverview) - flowTime * 0.9);\n      float detail = mix(0.28, 0.1, flowOverview);\n      float fibres = noise(p) * (1.0 - detail) + noise(p * vec2(1.9, 0.7) + 13.0) * detail;\n      // Keep the broad haze nearly invisible; most opacity belongs to the\n      // lengthwise fibres so the stronger breeze does not become a solid fan.\n      float density = 0.012 + 0.95 * fibres * fibres;\n      // A soft density ceiling keeps the stronger near-outlet strands\n      // translucent while letting their motion remain readable at room scale.\n      density = density / (1.0 + density * 0.55);\n      float alpha = flowOpacity * edge * distanceFade * density * mix(1.0, 0.42, vFlowLayer);\n      gl_FragColor = vec4(flowColor, alpha);\n      #include <colorspace_fragment>\n    }";
  function measureModelBox(modelRoot) {
    const boundsBox = new THREE.Box3();
    const rootMatrix = new THREE.Matrix4();
    function accumulateBounds(node, parentMatrix) {
      if (
        !node.userData?.environmentAirflow &&
        (node === modelRoot || node.userData?.environmentModelId == null)
      ) {
        if (node.isMesh && node.geometry?.attributes?.position) {
          const positionAttribute = node.geometry.attributes.position;
          if (positionAttribute.count > 0 && typeof positionAttribute.getX == "function") {
            const nodeBox = new THREE.Box3()
              .setFromBufferAttribute(positionAttribute)
              .applyMatrix4(parentMatrix);
            if (
              [
                nodeBox.min.x,
                nodeBox.min.y,
                nodeBox.min.z,
                nodeBox.max.x,
                nodeBox.max.y,
                nodeBox.max.z
              ].every(Number.isFinite)
            ) {
              boundsBox.union(nodeBox);
            }
          }
        }
        for (const childNode of node.children || []) {
          if (childNode.matrixAutoUpdate) {
            childNode.updateMatrix();
          }
          accumulateBounds(
            childNode,
            new THREE.Matrix4().multiplyMatrices(parentMatrix, childNode.matrix)
          );
        }
      }
    }
    accumulateBounds(modelRoot, rootMatrix);
    if (boundsBox.isEmpty()) {
      return null;
    } else {
      return boundsBox;
    }
  }
  function resolveOutletLayout(model) {
    const modelBox = measureModelBox(model);
    if (!modelBox) {
      return null;
    }
    const modelSize = modelBox.getSize(new THREE.Vector3());
    if (modelSize.x <= 0 || modelSize.y <= 0 || modelSize.z <= 0) {
      return null;
    }
    const modelType =
      model.userData.environmentModelType ||
      (modelSize.y > modelSize.x * 1.5 && modelSize.y > modelSize.z * 1.5 ? "floorac" : "wallac");
    if (modelType === "airoutlet") {
      const mouthLength = Math.min(2.4, Math.max(0.6, modelSize.z * 0.9));
      return {
        type: modelType,
        width: modelSize.z * 0.88,
        length: mouthLength,
        fall: mouthLength * 0.28,
        rotationY: Math.PI / 2,
        spread: 0.3,
        outlet: [
          modelBox.max.x + Math.max(0.003, modelSize.x * 0.03),
          modelBox.min.y + modelSize.y * 0.48,
          (modelBox.min.z + modelBox.max.z) / 2
        ]
      };
    }
    const isFloorUnit = modelType === "floorac";
    const ductWidth = modelSize.x * (isFloorUnit ? 0.48 : 0.84);
    const ductLength = Math.min(
      2.8,
      Math.max(0.3, isFloorUnit ? Math.max(modelSize.y * 0.95, modelSize.x * 3) : modelSize.x * 1.8)
    );
    return {
      type: modelType,
      width: ductWidth,
      length: ductLength,
      verticalSpan: isFloorUnit ? modelSize.y * 0.4 : 0,
      fall: ductLength * (isFloorUnit ? 0.12 : 0.38),
      outlet: [
        (modelBox.min.x + modelBox.max.x) / 2,
        modelBox.min.y + modelSize.y * (isFloorUnit ? 0.68 : 0.18),
        modelBox.max.z + Math.max(0.003, modelSize.z * 0.03)
      ]
    };
  }
  function buildFlowGeometry(layout) {
    const positions = [];
    const uvs = [];
    const layerIndices = [];
    const indexTriples = [];
    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      const baseVertexIndex = positions.length / 3;
      for (let rowIndex = 0; rowIndex <= 24; rowIndex++) {
        const rowT = rowIndex / 24;
        const rowExpansion = 1 + (rowT * 0.8 + rowT * rowT * 0.15) * (layout.spread ?? 1);
        for (let columnIndex = 0; columnIndex <= 6; columnIndex++) {
          const columnU = columnIndex / 6;
          const columnOffset = columnU * 2 - 1;
          const mouthTaper = (1 - columnOffset * columnOffset) * layout.width * rowT * 0.09;
          const layerSpread = layerIndex * layout.width * rowT * 0.075;
          const isMouthLayer = layout.verticalSpan > 0 && layerIndex === 0;
          positions.push(
            isMouthLayer ? mouthTaper : columnOffset * layout.width * 0.5 * rowExpansion,
            -layout.fall * (rowT * 0.35 + rowT * 0.65 * rowT) +
              (isMouthLayer
                ? columnOffset * layout.verticalSpan * 0.5 * (1 + rowT * 0.2)
                : mouthTaper + layerSpread),
            layout.length * rowT
          );
          uvs.push(columnU, rowT);
          layerIndices.push(layerIndex);
          if (rowIndex < 24 && columnIndex < 6) {
            const cellVertexIndex = baseVertexIndex + rowIndex * 7 + columnIndex;
            const nextRowVertexIndex = cellVertexIndex + 6 + 1;
            indexTriples.push(
              cellVertexIndex,
              cellVertexIndex + 1,
              nextRowVertexIndex,
              cellVertexIndex + 1,
              nextRowVertexIndex + 1,
              nextRowVertexIndex
            );
          }
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setAttribute("flowLayer", new THREE.Float32BufferAttribute(layerIndices, 1));
    geometry.setIndex(indexTriples);
    geometry.computeBoundingBox();
    const scratchVertex = new THREE.Vector3();
    for (let vertexIndex = 0; vertexIndex < positions.length / 3; vertexIndex++) {
      geometry.boundingBox.expandByPoint(
        scratchVertex.set(
          positions[vertexIndex * 3] * (1 + uvs[vertexIndex * 2 + 1] * 0.15),
          positions[vertexIndex * 3 + 1] * 1.25,
          positions[vertexIndex * 3 + 2] * 1.35
        )
      );
    }
    geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere());
    return geometry;
  }
  function disposeEffect(effectToDispose) {
    effectToDispose.mesh.removeFromParent();
    effectToDispose.mesh.geometry.dispose();
    effectToDispose.mesh.material.dispose();
  }
  function refreshEffectLayout(effectEntry) {
    const nextLayout = resolveOutletLayout(effectEntry.model);
    if (!nextLayout) {
      return false;
    }
    const layoutSignature = JSON.stringify(nextLayout);
    if (layoutSignature !== effectEntry.layoutSignature) {
      effectEntry.mesh.geometry.dispose();
      effectEntry.mesh.geometry = buildFlowGeometry(nextLayout);
      effectEntry.mesh.position.fromArray(nextLayout.outlet);
      effectEntry.mesh.rotation.y = nextLayout.rotationY || 0;
      effectEntry.mesh.updateMatrix();
      effectEntry.layoutSignature = layoutSignature;
      effectEntry.mesh.userData.outletLayout = nextLayout;
    }
    return true;
  }
  function createFlowEffect(modelObject, binding) {
    const outletLayout = resolveOutletLayout(modelObject);
    if (!outletLayout) {
      return null;
    }
    const overviewValue = isOverviewMode() ? 1 : 0;
    const material = new THREE.ShaderMaterial({
      vertexShader: FLOW_VERTEX_SHADER,
      fragmentShader: FLOW_FRAGMENT_SHADER,
      uniforms: {
        flowColor: {
          value: new THREE.Color(FLOW_STATE_COLORS.other)
        },
        flowOpacity: {
          value: 0
        },
        flowTime: {
          value: 0
        },
        flowOverview: {
          value: overviewValue
        }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
      forceSinglePass: true,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(buildFlowGeometry(outletLayout), material);
    mesh.name = "environment-airflow-" + (binding.id || binding.modelId);
    mesh.userData.environmentAirflow = true;
    mesh.userData.environmentEffect = true;
    mesh.userData.outletLayout = outletLayout;
    mesh.position.fromArray(outletLayout.outlet);
    mesh.rotation.y = outletLayout.rotationY || 0;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 4;
    mesh.visible = false;
    mesh.raycast = () => {};
    modelObject.add(mesh);
    return {
      mesh: mesh,
      model: modelObject,
      binding: binding,
      layoutSignature: JSON.stringify(outletLayout),
      target: 0,
      startOpacity: 0,
      overviewTarget: overviewValue,
      startOverview: overviewValue,
      startTime: null
    };
  }
  function indexSceneModels() {
    objectsByBindingKey = new Map();
    sceneRoot?.traverse?.(traversedNode => {
      if (
        traversedNode.userData?.environmentAirflow ||
        traversedNode.userData?.environmentModelId == null
      ) {
        return;
      }
      let nodeFloorId = traversedNode.userData.environmentFloorId;
      for (
        let ancestorNode = traversedNode.parent;
        nodeFloorId == null && ancestorNode;
        ancestorNode = ancestorNode.parent
      ) {
        nodeFloorId = ancestorNode.userData?.environmentFloorId;
      }
      objectsByBindingKey.set(
        composeBindingKey(nodeFloorId, traversedNode.userData.environmentModelId),
        traversedNode
      );
    });
    hasIndexedScene = true;
  }
  function syncEffects(shouldRefreshLayouts = false) {
    if (!hasIndexedScene && isEnabled && bindings.length) {
      indexSceneModels();
    }
    const activeBindingKeys = new Set();
    for (const bindingConfig of bindings) {
      if (bindingConfig.visible === false || bindingConfig.modelId == null) {
        continue;
      }
      const bindingKey = composeBindingKey(bindingConfig.floorId, bindingConfig.modelId);
      const boundModel = objectsByBindingKey.get(bindingKey);
      if (!boundModel) {
        continue;
      }
      activeBindingKeys.add(bindingKey);
      let existingEffect = effectsByBindingKey.get(bindingKey);
      if (existingEffect && existingEffect.model !== boundModel) {
        disposeEffect(existingEffect);
        effectsByBindingKey.delete(bindingKey);
        existingEffect = null;
      }
      if (!existingEffect && isEnabled) {
        existingEffect = createFlowEffect(boundModel, bindingConfig);
        if (existingEffect) {
          effectsByBindingKey.set(bindingKey, existingEffect);
        }
      }
      if (existingEffect) {
        existingEffect.binding = bindingConfig;
        if (shouldRefreshLayouts && !refreshEffectLayout(existingEffect)) {
          disposeEffect(existingEffect);
          effectsByBindingKey.delete(bindingKey);
        }
      }
    }
    for (const [removedKey, removedEffect] of effectsByBindingKey) {
      if (!activeBindingKeys.has(removedKey)) {
        disposeEffect(removedEffect);
        effectsByBindingKey.delete(removedKey);
      }
    }
  }
  function updateEffectStates() {
    let didChange = false;
    for (const effect of effectsByBindingKey.values()) {
      const effectBinding = effect.binding;
      const stateRecord =
        entityStates instanceof Map
          ? entityStates.get(effectBinding.entityId)
          : entityStates?.[effectBinding.entityId];
      const stateBody = stateRecord?.newState || stateRecord || {};
      const stateValue = String(stateBody.state || "").toLowerCase();
      const hvacAction = String(stateBody.attributes?.hvac_action || "").toLowerCase();
      const isFocusTarget = !focusedId || effectBinding.id === focusedId;
      const isAirflowActive =
        !["", "off", "unknown", "unavailable"].includes(stateValue) &&
        (hvacAction === "" || AIRFLOW_ACTIONS.has(hvacAction));
      const overviewUniformValue = isOverviewMode() ? 1 : 0;
      const targetOpacity =
        isEnabled && isFocusTarget && isAirflowActive ? (overviewUniformValue ? 1 : 0.68) : 0;
      const uniforms = effect.mesh.material.uniforms;
      const targetColor = new THREE.Color(FLOW_STATE_COLORS[stateValue] || FLOW_STATE_COLORS.other);
      if (targetOpacity > 0 && !uniforms.flowColor.value.equals(targetColor)) {
        uniforms.flowColor.value.copy(targetColor);
        didChange = true;
      }
      if (effect.target !== targetOpacity || effect.overviewTarget !== overviewUniformValue) {
        effect.target = targetOpacity;
        effect.startOpacity = uniforms.flowOpacity.value;
        effect.overviewTarget = overviewUniformValue;
        effect.startOverview = uniforms.flowOverview.value;
        effect.startTime = null;
        didChange = true;
      }
      if (!isFocusTarget || prefersReducedMotion()) {
        if (
          uniforms.flowOpacity.value !== targetOpacity ||
          uniforms.flowOverview.value !== overviewUniformValue
        ) {
          didChange = true;
        }
        uniforms.flowOpacity.value = targetOpacity;
        uniforms.flowOverview.value = overviewUniformValue;
        effect.mesh.visible = targetOpacity > 0;
        if (prefersReducedMotion()) {
          uniforms.flowTime.value = 0;
        }
      } else if (targetOpacity > 0) {
        effect.mesh.visible = true;
      } else if (uniforms.flowOpacity.value === 0) {
        effect.mesh.visible = false;
        uniforms.flowOverview.value = overviewUniformValue;
      }
    }
    if (didChange) {
      requestFrame();
    }
  }
  function setRoot(nextRoot, revision) {
    if (!isDisposed && (sceneRoot !== nextRoot || rootRevision !== revision)) {
      if (sceneRoot !== nextRoot) {
        for (const staleEffect of effectsByBindingKey.values()) {
          disposeEffect(staleEffect);
        }
        effectsByBindingKey.clear();
        objectsByBindingKey.clear();
        hasIndexedScene = false;
      }
      sceneRoot = nextRoot || null;
      rootRevision = revision;
      hasIndexedScene = false;
      if (!!isEnabled || !!effectsByBindingKey.size) {
        indexSceneModels();
        syncEffects(true);
        updateEffectStates();
        requestFrame();
      }
    }
  }
  function setState(options = {}) {
    if (isDisposed) {
      return;
    }
    const previousReducedMotion = prefersReducedMotion();
    if (Object.hasOwn(options, "enabled")) {
      isEnabled = options.enabled === true;
    }
    if (Object.hasOwn(options, "bindings")) {
      bindings = Array.isArray(options.bindings) ? options.bindings : [];
    }
    if (Object.hasOwn(options, "states")) {
      entityStates = options.states || {};
    }
    if (Object.hasOwn(options, "focusedId")) {
      focusedId = options.focusedId || "";
    }
    if (Object.hasOwn(options, "overview")) {
      overviewOverride = typeof options.overview == "boolean" ? options.overview : undefined;
    }
    if (Object.hasOwn(options, "reducedMotion")) {
      reducedMotionOverride = options.reducedMotion === true;
    }
    syncEffects();
    updateEffectStates();
    if (previousReducedMotion !== prefersReducedMotion()) {
      requestFrame();
    }
  }
  function tick(timestampMs) {
    if (
      isDisposed ||
      prefersReducedMotion() ||
      (Number.isFinite(timestampMs) || (timestampMs = globalThis.performance?.now() ?? Date.now()),
      ![...effectsByBindingKey.values()].some(
        anyEffect => anyEffect.target > 0 || anyEffect.mesh.material.uniforms.flowOpacity.value > 0
      ))
    ) {
      return false;
    }
    const frameIntervalMs = 1000 / 30;
    if (timestampMs >= lastTickMs && timestampMs - lastTickMs < frameIntervalMs) {
      return true;
    }
    lastTickMs =
      Number.isFinite(lastTickMs) && timestampMs >= lastTickMs
        ? timestampMs - ((timestampMs - lastTickMs) % frameIntervalMs)
        : timestampMs;
    let shouldAnimate = false;
    let didUniformsChange = false;
    for (const animatedEffect of effectsByBindingKey.values()) {
      const effectUniforms = animatedEffect.mesh.material.uniforms;
      if (
        effectUniforms.flowOpacity.value !== animatedEffect.target ||
        effectUniforms.flowOverview.value !== animatedEffect.overviewTarget
      ) {
        if (animatedEffect.startTime === null) {
          animatedEffect.startTime = timestampMs;
        }
        const fadeProgress = Math.max(
          0,
          Math.min(1, (timestampMs - animatedEffect.startTime) / 240)
        );
        const opacityValue =
          animatedEffect.startOpacity +
          (animatedEffect.target - animatedEffect.startOpacity) * fadeProgress;
        const easedProgress = fadeProgress * fadeProgress * (3 - fadeProgress * 2);
        const animatedOverviewValue =
          animatedEffect.startOverview +
          (animatedEffect.overviewTarget - animatedEffect.startOverview) * easedProgress;
        if (
          effectUniforms.flowOpacity.value !== opacityValue ||
          effectUniforms.flowOverview.value !== animatedOverviewValue
        ) {
          didUniformsChange = true;
        }
        effectUniforms.flowOpacity.value = opacityValue;
        effectUniforms.flowOverview.value = animatedOverviewValue;
        if (fadeProgress === 1) {
          effectUniforms.flowOpacity.value = animatedEffect.target;
          effectUniforms.flowOverview.value = animatedEffect.overviewTarget;
          animatedEffect.mesh.visible = animatedEffect.target > 0;
        } else {
          shouldAnimate = true;
        }
      }
      if (
        animatedEffect.mesh.visible &&
        (animatedEffect.target > 0 || effectUniforms.flowOpacity.value > 0)
      ) {
        const flowTimeSeconds = (timestampMs / 1000) % 1000;
        if (effectUniforms.flowTime.value !== flowTimeSeconds) {
          didUniformsChange = true;
        }
        effectUniforms.flowTime.value = flowTimeSeconds;
        shouldAnimate = true;
      }
    }
    if (didUniformsChange) {
      requestFrame();
    }
    return shouldAnimate;
  }
  const handleReducedMotionChange = () => {
    if (!isDisposed) {
      updateEffectStates();
      requestFrame();
    }
  };
  reducedMotionQuery?.addEventListener?.("change", handleReducedMotionChange);
  return {
    setRoot: setRoot,
    setState: setState,
    tick: tick,
    nextDelay() {
      if (
        !isDisposed &&
        !prefersReducedMotion() &&
        [...effectsByBindingKey.values()].some(
          candidateEffect =>
            candidateEffect.target > 0 ||
            candidateEffect.mesh.material.uniforms.flowOpacity.value > 0
        )
      ) {
        return 1000 / 30;
      } else {
        return Infinity;
      }
    },
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        reducedMotionQuery?.removeEventListener?.("change", handleReducedMotionChange);
        for (const disposedEffect of effectsByBindingKey.values()) {
          disposeEffect(disposedEffect);
        }
        effectsByBindingKey.clear();
        objectsByBindingKey.clear();
        bindings = [];
        entityStates = {};
        sceneRoot = null;
      }
    }
  };
}
