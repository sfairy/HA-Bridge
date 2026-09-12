export function nasState(entityId, newState) {
  const state = newState?.newState || newState || {};
  const rawState = String(state.state || "").trim().toLowerCase();
  const available = /^(binary_sensor|switch|input_boolean)\.[a-z0-9_]+$/.test(entityId || "") && state.available !== false && ["on", "off"].includes(rawState);
  return {
    available,
    on: available && rawState === "on",
    name: state.attributes?.friendly_name || entityId || "NAS"
  };
}
export function nasDeviceState(binding, states = {}) {
  const lookup = entityId => states instanceof Map ? states.get(entityId) : states[entityId];
  if (binding.entityId) {
    return nasState(binding.entityId, lookup(binding.entityId));
  }
  const primaryEntityId = binding.statusSource?.primaryEntityId;
  const state = lookup(primaryEntityId)?.newState || lookup(primaryEntityId);
  const available = !!primaryEntityId && state?.available !== false && state?.state != null && !["", "unknown", "unavailable", "none"].includes(String(state.state).trim().toLowerCase());
  return {
    available,
    on: available,
    name: binding.statusSource?.name || "NAS"
  };
}
export function createNasStatus({
  THREE,
  requestFrame = () => {}
}) {
  const entries = new Map();
  const sharedGeometry = new THREE.PlaneGeometry(1, 1);
  let root;
  let sceneRevision;
  let bindingsSignature;
  let disposed = false;
  let hasVisible = false;
  let lastPulseAt = -Infinity;
  const prefersReducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true || globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const modelKey = (floorId, modelId) => JSON.stringify([floorId || "", modelId || ""]);
  function disposeEntry(entry) {
    for (const [indicator, wasVisible] of entry.indicators) {
      indicator.visible = wasVisible;
    }
    entry.mesh.removeFromParent();
    entry.mesh.material.dispose();
  }
  function modelBounds(modelNode) {
    const box = new THREE.Box3();
    function accumulate(node, worldMatrix) {
      if (!node.userData?.environmentEffect && (node === modelNode || node.userData?.environmentModelId == null)) {
        if (node.isMesh && node.geometry) {
          if (!node.geometry.boundingBox) {
            node.geometry.computeBoundingBox();
          }
          if (node.geometry.boundingBox) {
            box.union(node.geometry.boundingBox.clone().applyMatrix4(worldMatrix));
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
    accumulate(modelNode, new THREE.Matrix4());
    return box;
  }
  function sync({
    root: nextRoot,
    revision,
    bindings = [],
    states = {},
    enabled = false,
    sizeScale = 1,
    brightness = 1
  }) {
    if (disposed) {
      return;
    }
    const nextBindingsSignature = JSON.stringify(bindings.map(binding => [binding.id, binding.floorId, binding.modelId]));
    if (root !== nextRoot || sceneRevision !== revision || bindingsSignature !== nextBindingsSignature) {
      root = nextRoot;
      sceneRevision = revision;
      bindingsSignature = nextBindingsSignature;
      const modelNodes = new Map();
      root?.traverse(node => {
        if (node.userData?.environmentModelType !== "nas") {
          return;
        }
        let floorId = node.userData.environmentFloorId;
        for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
          floorId = parent.userData.environmentFloorId;
        }
        modelNodes.set(modelKey(floorId, node.userData.environmentModelId), node);
      });
      const activeIds = new Set();
      for (const binding of bindings) {
        const modelNode = modelNodes.get(modelKey(binding.floorId, binding.modelId));
        if (!modelNode) {
          continue;
        }
        activeIds.add(binding.id);
        let entry = entries.get(binding.id);
        if (entry?.model !== modelNode) {
          if (entry) {
            disposeEntry(entry);
          }
          const bounds = modelBounds(modelNode);
          if (bounds.isEmpty()) {
            entries.delete(binding.id);
            continue;
          }
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const material = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: false,
            depthWrite: false,
            toneMapped: false,
            uniforms: {
              pulse: {
                value: 1
              },
              viewportHeight: {
                value: 900
              },
              sizeScale: {
                value: 1
              },
              brightness: {
                value: 1
              }
            },
            vertexShader: "varying vec2 ledUv; uniform float viewportHeight; uniform float sizeScale; void main(){ledUv=uv;vec4 center=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);vec4 clip=projectionMatrix*center;float physicalSize=length(modelMatrix[0].xyz);float minimumSize=24.0*clip.w/(max(viewportHeight,1.0)*projectionMatrix[1][1]);center.xy+=position.xy*max(physicalSize,minimumSize)*sizeScale;gl_Position=projectionMatrix*center;}",
            fragmentShader: "varying vec2 ledUv; uniform float pulse; uniform float brightness; void main(){float r=length(ledUv-0.5)*2.0;float core=1.0-smoothstep(0.28,0.50,r);float halo=pow(max(0.0,1.0-r),1.7)*0.8;float a=min((core+halo)*pulse,1.0)*brightness;if(a<0.005)discard;gl_FragColor=vec4(mix(vec3(0.06,1.0,0.20),vec3(0.48,1.0,0.60),core),a);}"
          });
          const mesh = new THREE.Mesh(sharedGeometry, material);
          mesh.name = "nas-status-" + binding.id;
          Object.assign(mesh.userData, {
            environmentEffect: true,
            nasStatus: true,
            externalModelSharedGeometry: true,
            externalModelSharedMaterial: true
          });
          mesh.raycast = () => {};
          mesh.renderOrder = 100;
          const viewportSize = new THREE.Vector2();
          mesh.onBeforeRender = renderer => {
            material.uniforms.viewportHeight.value = renderer.getSize(viewportSize).y;
          };
          const ledScale = Math.max(0.025, Math.min(0.075, size.x * 0.22));
          mesh.scale.set(ledScale, ledScale, ledScale);
          mesh.position.set(center.x + size.x * 0.36, bounds.min.y + size.y * 0.26, bounds.max.z + 0.003);
          const indicators = new Map();
          modelNode.traverse(child => {
            if (!child.isMesh || child === mesh || child.userData?.environmentEffect) {
              return;
            }
            if ((Array.isArray(child.material) ? child.material : [child.material]).some(mat => /nas-material-4$/.test(mat?.name || "") || mat?.emissive?.getHex() > 0)) {
              indicators.set(child, child.visible);
              child.visible = false;
            }
          });
          modelNode.add(mesh);
          entry = {
            model: modelNode,
            mesh,
            indicators
          };
          entries.set(binding.id, entry);
        }
      }
      for (const [id, entry] of entries) {
        if (!activeIds.has(id)) {
          disposeEntry(entry);
          entries.delete(id);
        }
      }
    }
    hasVisible = false;
    let visibilityChanged = false;
    for (const binding of bindings) {
      const entry = entries.get(binding.id);
      if (!entry) {
        continue;
      }
      const uniforms = entry.mesh.material.uniforms;
      visibilityChanged ||= uniforms.sizeScale.value !== sizeScale || uniforms.brightness.value !== brightness;
      uniforms.sizeScale.value = sizeScale;
      uniforms.brightness.value = brightness;
      const deviceState = nasDeviceState(binding, states);
      const visible = enabled && deviceState.on;
      visibilityChanged ||= entry.mesh.visible !== visible;
      entry.mesh.visible = visible;
      if (visible) {
        hasVisible = true;
      }
    }
    if (visibilityChanged || hasVisible) {
      requestFrame();
    }
  }
  function tick(nowMs) {
    if (disposed || !hasVisible) {
      return false;
    }
    const reducedMotion = prefersReducedMotion();
    if (!reducedMotion && nowMs - lastPulseAt < 1000 / 30) {
      return true;
    }
    lastPulseAt = nowMs;
    const pulse = reducedMotion ? 1 : 0.14 + (0.5 - Math.cos(nowMs / 1400 * Math.PI * 2) * 0.5) * 0.86;
    let pulseChanged = false;
    for (const entry of entries.values()) {
      if (entry.mesh.visible) {
        pulseChanged ||= entry.mesh.material.uniforms.pulse.value !== pulse;
        entry.mesh.material.uniforms.pulse.value = pulse;
      }
    }
    if (pulseChanged) {
      requestFrame();
    }
    return !reducedMotion;
  }
  return {
    sync,
    tick,
    nextDelay: () => !disposed && hasVisible && !prefersReducedMotion() ? 1000 / 30 : Infinity,
    dispose() {
      if (!disposed) {
        disposed = true;
        for (const entry of entries.values()) {
          disposeEntry(entry);
        }
        entries.clear();
        sharedGeometry.dispose();
      }
    }
  };
}
