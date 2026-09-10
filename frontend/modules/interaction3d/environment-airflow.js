const T = {
  cool: "#73c8ff",
  heat: "#ff8a65",
  other: "#dce2e6"
};
const ae = new Set(["cooling", "cool", "heating", "heat", "fan", "fan_only", "drying"]);
const $ = (arg6, arg7) => JSON.stringify([String(arg6 ?? ""), String(arg7 ?? "")]);
export function createEnvironmentAirflow({
  THREE: Float32BufferAttribute,
  requestFrame: arg9 = () => {},
  reducedMotion: arg8
} = {}) {
  let traverse = null;
  let value38;
  let value39 = false;
  let length4 = [];
  let get = {};
  let value40 = "";
  let value41 = false;
  let clear = new Map();
  let values = new Map();
  let value42 = false;
  let value43 = -Infinity;
  let value44;
  const value45 = () => value44 ?? !value40;
  let value46 = typeof arg8 == "boolean" ? arg8 : undefined;
  const matches = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  const value47 = () => value46 ?? matches?.matches ?? false;
  const vertexShader = "attribute float flowLayer;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    void main() {\n      vFlowUv = uv; vFlowLayer = flowLayer;\n      vec3 expanded = position;\n      // Expand away from the outlet; the mouth keeps its authored position and width.\n      expanded.x *= 1.0 + flowOverview * 0.15 * uv.y;\n      expanded.y *= 1.0 + flowOverview * 0.25;\n      expanded.z *= 1.0 + flowOverview * 0.35;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(expanded, 1.0);\n    }";
  const fragmentShader = "uniform vec3 flowColor;\n    uniform float flowOpacity;\n    uniform float flowTime;\n    uniform float flowOverview;\n    varying vec2 vFlowUv;\n    varying float vFlowLayer;\n    float hash(vec2 p) {\n      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n    }\n    float noise(vec2 p) {\n      vec2 cell = floor(p), f = fract(p);\n      f = f * f * (3.0 - 2.0 * f);\n      return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),\n        mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), f.x), f.y);\n    }\n    void main() {\n      float t = vFlowUv.y, across = vFlowUv.x * 2.0 - 1.0;\n      float edge = exp(-0.8 * across * across) * (1.0 - smoothstep(0.45, 1.0, abs(across)));\n      float distanceFade = smoothstep(0.0, 0.025, t) * exp(-mix(1.15, 0.9, flowOverview) * t)\n        * (1.0 - smoothstep(0.62, 1.0, t));\n      // Advected, lengthwise fibres: deliberately much longer than they are\n      // wide, so the air reads as a continuous breeze, never dots or light bars.\n      float drift = sin(t * 4.0 - flowTime * 0.45 + vFlowLayer * 2.0) * t * 0.16;\n      // Broader, lower-frequency strands survive the smaller screen footprint\n      // in the whole-home view; focus retains the finer, softer texture.\n      vec2 p = vec2(vFlowUv.x * mix(15.0, 7.0, flowOverview) + drift + vFlowLayer * 23.0,\n        t * mix(1.8, 1.25, flowOverview) - flowTime * 0.9);\n      float detail = mix(0.28, 0.1, flowOverview);\n      float fibres = noise(p) * (1.0 - detail) + noise(p * vec2(1.9, 0.7) + 13.0) * detail;\n      // Keep the broad haze nearly invisible; most opacity belongs to the\n      // lengthwise fibres so the stronger breeze does not become a solid fan.\n      float density = 0.012 + 0.95 * fibres * fibres;\n      // A soft density ceiling keeps the stronger near-outlet strands\n      // translucent while letting their motion remain readable at room scale.\n      density = density / (1.0 + density * 0.55);\n      float alpha = flowOpacity * edge * distanceFade * density * mix(1.0, 0.42, vFlowLayer);\n      gl_FragColor = vec4(flowColor, alpha);\n      #include <colorspace_fragment>\n    }";
  function fn2(arg2) {
    const union = new Float32BufferAttribute.Box3();
    const value29 = new Float32BufferAttribute.Matrix4();
    function fn(userData2, arg) {
      if (!userData2.userData?.environmentAirflow && (userData2 === arg2 || userData2.userData?.environmentModelId == null)) {
        if (userData2.isMesh && userData2.geometry?.attributes?.position) {
          const count = userData2.geometry.attributes.position;
          if (count.count > 0 && typeof count.getX == "function") {
            const min = new Float32BufferAttribute.Box3().setFromBufferAttribute(count).applyMatrix4(arg);
            if ([min.min.x, min.min.y, min.min.z, min.max.x, min.max.y, min.max.z].every(Number.isFinite)) {
              union.union(min);
            }
          }
        }
        for (const matrixAutoUpdate of userData2.children || []) {
          if (matrixAutoUpdate.matrixAutoUpdate) {
            matrixAutoUpdate.updateMatrix();
          }
          fn(matrixAutoUpdate, new Float32BufferAttribute.Matrix4().multiplyMatrices(arg, matrixAutoUpdate.matrix));
        }
      }
    }
    fn(arg2, value29);
    if (union.isEmpty()) {
      return null;
    } else {
      return union;
    }
  }
  function fn3(userData3) {
    const max = fn2(userData3);
    if (!max) {
      return null;
    }
    const y = max.getSize(new Float32BufferAttribute.Vector3());
    if (y.x <= 0 || y.y <= 0 || y.z <= 0) {
      return null;
    }
    const type = userData3.userData.environmentModelType || (y.y > y.x * 1.5 && y.y > y.z * 1.5 ? "floorac" : "wallac");
    if (type === "airoutlet") {
      const length = Math.min(2.4, Math.max(0.6, y.z * 0.9));
      return {
        type,
        width: y.z * 0.88,
        length,
        fall: length * 0.28,
        rotationY: Math.PI / 2,
        spread: 0.3,
        outlet: [max.max.x + Math.max(0.003, y.x * 0.03), max.min.y + y.y * 0.48, (max.min.z + max.max.z) / 2]
      };
    }
    const value30 = type === "floorac";
    const width = y.x * (value30 ? 0.48 : 0.84);
    const length2 = Math.min(2.8, Math.max(0.3, value30 ? Math.max(y.y * 0.95, y.x * 3) : y.x * 1.8));
    return {
      type,
      width,
      length: length2,
      verticalSpan: value30 ? y.y * 0.4 : 0,
      fall: length2 * (value30 ? 0.12 : 0.38),
      outlet: [(max.min.x + max.max.x) / 2, max.min.y + y.y * (value30 ? 0.68 : 0.18), max.max.z + Math.max(0.003, y.z * 0.03)]
    };
  }
  function fn4(width2) {
    const length3 = [];
    const push = [];
    const push2 = [];
    const push3 = [];
    for (let value25 = 0; value25 < 2; value25++) {
      const value17 = length3.length / 3;
      for (let value15 = 0; value15 <= 24; value15++) {
        const value11 = value15 / 24;
        const value12 = 1 + (value11 * 0.8 + value11 * value11 * 0.15) * (width2.spread ?? 1);
        for (let value8 = 0; value8 <= 6; value8++) {
          const value3 = value8 / 6;
          const value4 = value3 * 2 - 1;
          const value5 = (1 - value4 * value4) * width2.width * value11 * 0.09;
          const value6 = value25 * width2.width * value11 * 0.075;
          const value7 = width2.verticalSpan > 0 && value25 === 0;
          length3.push(value7 ? value5 : value4 * width2.width * 0.5 * value12, -width2.fall * (value11 * 0.35 + value11 * 0.65 * value11) + (value7 ? value4 * width2.verticalSpan * 0.5 * (1 + value11 * 0.2) : value5 + value6), width2.length * value11);
          push.push(value3, value11);
          push2.push(value25);
          if (value15 < 24 && value8 < 6) {
            const value = value17 + value15 * 7 + value8;
            const value2 = value + 6 + 1;
            push3.push(value, value + 1, value2, value + 1, value2 + 1, value2);
          }
        }
      }
    }
    const setAttribute = new Float32BufferAttribute.BufferGeometry();
    setAttribute.setAttribute("position", new Float32BufferAttribute.Float32BufferAttribute(length3, 3));
    setAttribute.setAttribute("uv", new Float32BufferAttribute.Float32BufferAttribute(push, 2));
    setAttribute.setAttribute("flowLayer", new Float32BufferAttribute.Float32BufferAttribute(push2, 1));
    setAttribute.setIndex(push3);
    setAttribute.computeBoundingBox();
    const set = new Float32BufferAttribute.Vector3();
    for (let value26 = 0; value26 < length3.length / 3; value26++) {
      setAttribute.boundingBox.expandByPoint(set.set(length3[value26 * 3] * (1 + push[value26 * 2 + 1] * 0.15), length3[value26 * 3 + 1] * 1.25, length3[value26 * 3 + 2] * 1.35));
    }
    setAttribute.boundingSphere = setAttribute.boundingBox.getBoundingSphere(new Float32BufferAttribute.Sphere());
    return setAttribute;
  }
  function fn5(mesh2) {
    mesh2.mesh.removeFromParent();
    mesh2.mesh.geometry.dispose();
    mesh2.mesh.material.dispose();
  }
  function fn6(mesh3) {
    const outlet = fn3(mesh3.model);
    if (!outlet) {
      return false;
    }
    const layoutSignature = JSON.stringify(outlet);
    if (layoutSignature !== mesh3.layoutSignature) {
      mesh3.mesh.geometry.dispose();
      mesh3.mesh.geometry = fn4(outlet);
      mesh3.mesh.position.fromArray(outlet.outlet);
      mesh3.mesh.rotation.y = outlet.rotationY || 0;
      mesh3.mesh.updateMatrix();
      mesh3.layoutSignature = layoutSignature;
      mesh3.mesh.userData.outletLayout = outlet;
    }
    return true;
  }
  function fn7(add, id) {
    const outlet2 = fn3(add);
    if (!outlet2) {
      return null;
    }
    const value31 = value45() ? 1 : 0;
    const value32 = new Float32BufferAttribute.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        flowColor: {
          value: new Float32BufferAttribute.Color(T.other)
        },
        flowOpacity: {
          value: 0
        },
        flowTime: {
          value: 0
        },
        flowOverview: {
          value: value31
        }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      side: Float32BufferAttribute.DoubleSide,
      forceSinglePass: true,
      toneMapped: false
    });
    const userData4 = new Float32BufferAttribute.Mesh(fn4(outlet2), value32);
    userData4.name = "environment-airflow-" + (id.id || id.modelId);
    userData4.userData.environmentAirflow = true;
    userData4.userData.environmentEffect = true;
    userData4.userData.outletLayout = outlet2;
    userData4.position.fromArray(outlet2.outlet);
    userData4.rotation.y = outlet2.rotationY || 0;
    userData4.updateMatrix();
    userData4.matrixAutoUpdate = false;
    userData4.castShadow = false;
    userData4.receiveShadow = false;
    userData4.renderOrder = 4;
    userData4.visible = false;
    userData4.raycast = () => {};
    add.add(userData4);
    return {
      mesh: userData4,
      model: add,
      binding: id,
      layoutSignature: JSON.stringify(outlet2),
      target: 0,
      startOpacity: 0,
      overviewTarget: value31,
      startOverview: value31,
      startTime: null
    };
  }
  function fn8() {
    clear = new Map();
    traverse?.traverse?.(userData => {
      if (userData.userData?.environmentAirflow || userData.userData?.environmentModelId == null) {
        return;
      }
      let value16 = userData.userData.environmentFloorId;
      for (let parent = userData.parent; value16 == null && parent; parent = parent.parent) {
        value16 = parent.userData?.environmentFloorId;
      }
      clear.set($(value16, userData.userData.environmentModelId), userData);
    });
    value42 = true;
  }
  function fn9(arg3 = false) {
    if (!value42 && value39 && length4.length) {
      fn8();
    }
    const add2 = new Set();
    for (const modelId of length4) {
      if (modelId.visible === false || modelId.modelId == null) {
        continue;
      }
      const value18 = $(modelId.floorId, modelId.modelId);
      const value19 = clear.get(value18);
      if (!value19) {
        continue;
      }
      add2.add(value18);
      let model = values.get(value18);
      if (model && model.model !== value19) {
        fn5(model);
        values.delete(value18);
        model = null;
      }
      if (!model && value39) {
        model = fn7(value19, modelId);
        if (model) {
          values.set(value18, model);
        }
      }
      if (model) {
        model.binding = modelId;
        if (arg3 && !fn6(model)) {
          fn5(model);
          values.delete(value18);
        }
      }
    }
    for (const [value27, value28] of values) {
      if (!add2.has(value27)) {
        fn5(value28);
        values.delete(value27);
      }
    }
  }
  function fn10() {
    let value33 = false;
    for (const mesh of values.values()) {
      const entityId = mesh.binding;
      const newState = get instanceof Map ? get.get(entityId.entityId) : get?.[entityId.entityId];
      const state = newState?.newState || newState || {};
      const value20 = String(state.state || "").toLowerCase();
      const value21 = String(state.attributes?.hvac_action || "").toLowerCase();
      const value22 = !value40 || entityId.id === value40;
      const value23 = !["", "off", "unknown", "unavailable"].includes(value20) && (value21 === "" || ae.has(value21));
      const element4 = value45() ? 1 : 0;
      const target3 = value39 && value22 && value23 ? element4 ? 1 : 0.68 : 0;
      const flowOpacity = mesh.mesh.material.uniforms;
      const value24 = new Float32BufferAttribute.Color(T[value20] || T.other);
      if (target3 > 0 && !flowOpacity.flowColor.value.equals(value24)) {
        flowOpacity.flowColor.value.copy(value24);
        value33 = true;
      }
      if (mesh.target !== target3 || mesh.overviewTarget !== element4) {
        mesh.target = target3;
        mesh.startOpacity = flowOpacity.flowOpacity.value;
        mesh.overviewTarget = element4;
        mesh.startOverview = flowOpacity.flowOverview.value;
        mesh.startTime = null;
        value33 = true;
      }
      if (!value22 || value47()) {
        if (flowOpacity.flowOpacity.value !== target3 || flowOpacity.flowOverview.value !== element4) {
          value33 = true;
        }
        flowOpacity.flowOpacity.value = target3;
        flowOpacity.flowOverview.value = element4;
        mesh.mesh.visible = target3 > 0;
        if (value47()) {
          flowOpacity.flowTime.value = 0;
        }
      } else if (target3 > 0) {
        mesh.mesh.visible = true;
      } else if (flowOpacity.flowOpacity.value === 0) {
        mesh.mesh.visible = false;
        flowOpacity.flowOverview.value = element4;
      }
    }
    if (value33) {
      arg9();
    }
  }
  function setRoot(arg4, arg5) {
    if (!value41 && (traverse !== arg4 || value38 !== arg5)) {
      if (traverse !== arg4) {
        for (const value9 of values.values()) {
          fn5(value9);
        }
        values.clear();
        clear.clear();
        value42 = false;
      }
      traverse = arg4 || null;
      value38 = arg5;
      value42 = false;
      if (!!value39 || !!values.size) {
        fn8();
        fn9(true);
        fn10();
        arg9();
      }
    }
  }
  function setState(bindings = {}) {
    if (value41) {
      return;
    }
    const value34 = value47();
    if (Object.hasOwn(bindings, "enabled")) {
      value39 = bindings.enabled === true;
    }
    if (Object.hasOwn(bindings, "bindings")) {
      length4 = Array.isArray(bindings.bindings) ? bindings.bindings : [];
    }
    if (Object.hasOwn(bindings, "states")) {
      get = bindings.states || {};
    }
    if (Object.hasOwn(bindings, "focusedId")) {
      value40 = bindings.focusedId || "";
    }
    if (Object.hasOwn(bindings, "overview")) {
      value44 = typeof bindings.overview == "boolean" ? bindings.overview : undefined;
    }
    if (Object.hasOwn(bindings, "reducedMotion")) {
      value46 = bindings.reducedMotion === true;
    }
    fn9();
    fn10();
    if (value34 !== value47()) {
      arg9();
    }
  }
  function tick(startTime) {
    if (value41 || value47() || (Number.isFinite(startTime) || (startTime = globalThis.performance?.now() ?? Date.now()), ![...values.values()].some(target => target.target > 0 || target.mesh.material.uniforms.flowOpacity.value > 0))) {
      return false;
    }
    const value35 = 1000 / 30;
    if (startTime >= value43 && startTime - value43 < value35) {
      return true;
    }
    value43 = Number.isFinite(value43) && startTime >= value43 ? startTime - (startTime - value43) % value35 : startTime;
    let value36 = false;
    let value37 = false;
    for (const target4 of values.values()) {
      const flowOpacity2 = target4.mesh.material.uniforms;
      if (flowOpacity2.flowOpacity.value !== target4.target || flowOpacity2.flowOverview.value !== target4.overviewTarget) {
        if (target4.startTime === null) {
          target4.startTime = startTime;
        }
        const value13 = Math.max(0, Math.min(1, (startTime - target4.startTime) / 240));
        const element = target4.startOpacity + (target4.target - target4.startOpacity) * value13;
        const value14 = value13 * value13 * (3 - value13 * 2);
        const element2 = target4.startOverview + (target4.overviewTarget - target4.startOverview) * value14;
        if (flowOpacity2.flowOpacity.value !== element || flowOpacity2.flowOverview.value !== element2) {
          value37 = true;
        }
        flowOpacity2.flowOpacity.value = element;
        flowOpacity2.flowOverview.value = element2;
        if (value13 === 1) {
          flowOpacity2.flowOpacity.value = target4.target;
          flowOpacity2.flowOverview.value = target4.overviewTarget;
          target4.mesh.visible = target4.target > 0;
        } else {
          value36 = true;
        }
      }
      if (target4.mesh.visible && (target4.target > 0 || flowOpacity2.flowOpacity.value > 0)) {
        const element3 = startTime / 1000 % 1000;
        if (flowOpacity2.flowTime.value !== element3) {
          value37 = true;
        }
        flowOpacity2.flowTime.value = element3;
        value36 = true;
      }
    }
    if (value37) {
      arg9();
    }
    return value36;
  }
  const value48 = () => {
    if (!value41) {
      fn10();
      arg9();
    }
  };
  matches?.addEventListener?.("change", value48);
  return {
    setRoot,
    setState,
    tick,
    nextDelay() {
      if (!value41 && !value47() && [...values.values()].some(target2 => target2.target > 0 || target2.mesh.material.uniforms.flowOpacity.value > 0)) {
        return 1000 / 30;
      } else {
        return Infinity;
      }
    },
    dispose() {
      if (!value41) {
        value41 = true;
        matches?.removeEventListener?.("change", value48);
        for (const value10 of values.values()) {
          fn5(value10);
        }
        values.clear();
        clear.clear();
        length4 = [];
        get = {};
        traverse = null;
      }
    }
  };
}
