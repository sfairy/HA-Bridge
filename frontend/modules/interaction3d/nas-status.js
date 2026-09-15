export function nasState(entityId, state) {
  const stateObject = state?.newState || state || {};
  const stateValue = String(stateObject.state || "")
    .trim()
    .toLowerCase();
  const available =
    /^(binary_sensor|switch|input_boolean)\.[a-z0-9_]+$/.test(entityId || "") &&
    stateObject.available !== false &&
    ["on", "off"].includes(stateValue);
  return {
    available: available,
    on: available && stateValue === "on",
    name: stateObject.attributes?.friendly_name || entityId || "NAS"
  };
}
export function nasDeviceState(item, stateSources = {}) {
  const readState = stateEntityId =>
    stateSources instanceof Map ? stateSources.get(stateEntityId) : stateSources[stateEntityId];
  if (item.entityId) {
    return nasState(item.entityId, readState(item.entityId));
  }
  const hasActiveMetric = [
    ...new Set([
      item.statusSource?.primaryEntityId,
      ...(item.statusSource?.metrics || []).map(metricSource => metricSource.entityId)
    ])
  ].some(metricEntityId => {
    const metricState = readState(metricEntityId)?.newState || readState(metricEntityId);
    return (
      !!metricEntityId &&
      metricState?.available !== false &&
      metricState?.state != null &&
      !["", "unknown", "unavailable", "none"].includes(
        String(metricState.state).trim().toLowerCase()
      )
    );
  });
  return {
    available: hasActiveMetric,
    on: hasActiveMetric,
    name: item.statusSource?.name || "NAS"
  };
}
export function createNasStatus({ THREE: THREE, requestFrame: requestFrame = () => {} }) {
  const meshesByBindingId = new Map();
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  let syncedRoot;
  let syncedRevision;
  let syncedBindingsSignature;
  let isDisposed = false;
  let hasVisibleIndicator = false;
  let lastTickMs = -Infinity;
  const prefersReducedMotion = () =>
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true ||
    globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const locationKey = (floorId, modelId) => JSON.stringify([floorId || "", modelId || ""]);
  function releaseEntry(entry) {
    for (const [indicator, wasVisible] of entry.indicators) {
      indicator.visible = wasVisible;
    }
    entry.mesh.removeFromParent();
    entry.mesh.material.dispose();
  }
  function computeModelBounds(model) {
    const bounds = new THREE.Box3();
    function unionMeshBounds(object, matrix) {
      if (
        !object.userData?.environmentEffect &&
        (object === model || object.userData?.environmentModelId == null)
      ) {
        if (object.isMesh && object.geometry) {
          if (!object.geometry.boundingBox) {
            object.geometry.computeBoundingBox();
          }
          if (object.geometry.boundingBox) {
            bounds.union(object.geometry.boundingBox.clone().applyMatrix4(matrix));
          }
        }
        for (const descendant of object.children || []) {
          if (descendant.matrixAutoUpdate) {
            descendant.updateMatrix();
          }
          unionMeshBounds(
            descendant,
            new THREE.Matrix4().multiplyMatrices(matrix, descendant.matrix)
          );
        }
      }
    }
    unionMeshBounds(model, new THREE.Matrix4());
    return bounds;
  }
  function sync({
    root: root,
    revision: revision,
    bindings: bindings = [],
    states: states = {},
    enabled: enabled = false,
    sizeScale: sizeScale = 1,
    brightness: brightness = 1
  }) {
    if (isDisposed) {
      return;
    }
    const bindingsSignature = JSON.stringify(
      bindings.map(bindingConfig => [
        bindingConfig.id,
        bindingConfig.floorId,
        bindingConfig.modelId
      ])
    );
    if (
      syncedRoot !== root ||
      syncedRevision !== revision ||
      syncedBindingsSignature !== bindingsSignature
    ) {
      syncedRoot = root;
      syncedRevision = revision;
      syncedBindingsSignature = bindingsSignature;
      const modelsByLocation = new Map();
      syncedRoot?.traverse(sceneObject => {
        if (sceneObject.userData?.environmentModelType !== "nas") {
          return;
        }
        let ancestorFloorId = sceneObject.userData.environmentFloorId;
        for (
          let ancestor = sceneObject.parent;
          ancestorFloorId == null && ancestor;
          ancestor = ancestor.parent
        ) {
          ancestorFloorId = ancestor.userData.environmentFloorId;
        }
        modelsByLocation.set(
          locationKey(ancestorFloorId, sceneObject.userData.environmentModelId),
          sceneObject
        );
      });
      const activeBindingIds = new Set();
      for (const binding of bindings) {
        const matchedModel = modelsByLocation.get(locationKey(binding.floorId, binding.modelId));
        if (!matchedModel) {
          continue;
        }
        activeBindingIds.add(binding.id);
        let existing = meshesByBindingId.get(binding.id);
        if (existing?.model !== matchedModel) {
          if (existing) {
            releaseEntry(existing);
          }
          const modelBounds = computeModelBounds(matchedModel);
          if (modelBounds.isEmpty()) {
            meshesByBindingId.delete(binding.id);
            continue;
          }
          const modelSize = modelBounds.getSize(new THREE.Vector3());
          const modelCenter = modelBounds.getCenter(new THREE.Vector3());
          const ledMaterial = new THREE.ShaderMaterial({
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
            vertexShader:
              "varying vec2 ledUv; uniform float viewportHeight; uniform float sizeScale; void main(){ledUv=uv;vec4 center=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);vec4 clip=projectionMatrix*center;float physicalSize=length(modelMatrix[0].xyz);float minimumSize=24.0*clip.w/(max(viewportHeight,1.0)*projectionMatrix[1][1]);center.xy+=position.xy*max(physicalSize,minimumSize)*sizeScale;gl_Position=projectionMatrix*center;}",
            fragmentShader:
              "varying vec2 ledUv; uniform float pulse; uniform float brightness; void main(){float r=length(ledUv-0.5)*2.0;float core=1.0-smoothstep(0.28,0.50,r);float halo=pow(max(0.0,1.0-r),1.7)*0.8;float a=min((core+halo)*pulse,1.0)*brightness;if(a<0.005)discard;gl_FragColor=vec4(mix(vec3(0.06,1.0,0.20),vec3(0.48,1.0,0.60),core),a);}"
          });
          const ledMesh = new THREE.Mesh(planeGeometry, ledMaterial);
          ledMesh.name = "nas-status-" + binding.id;
          Object.assign(ledMesh.userData, {
            environmentEffect: true,
            nasStatus: true,
            externalModelSharedGeometry: true,
            externalModelSharedMaterial: true
          });
          ledMesh.raycast = () => {};
          ledMesh.renderOrder = 100;
          const viewportSize = new THREE.Vector2();
          ledMesh.onBeforeRender = renderer => {
            ledMaterial.uniforms.viewportHeight.value = renderer.getSize(viewportSize).y;
          };
          const indicatorSize = Math.max(0.025, Math.min(0.075, modelSize.x * 0.22));
          ledMesh.scale.set(indicatorSize, indicatorSize, indicatorSize);
          ledMesh.position.set(
            modelCenter.x + modelSize.x * 0.36,
            modelBounds.min.y + modelSize.y * 0.26,
            modelBounds.max.z + 0.003
          );
          const suppressedIndicators = new Map();
          matchedModel.traverse(child => {
            if (!child.isMesh || child === ledMesh || child.userData?.environmentEffect) {
              return;
            }
            if (
              (Array.isArray(child.material) ? child.material : [child.material]).some(
                childMaterial =>
                  /nas-material-4$/.test(childMaterial?.name || "") ||
                  childMaterial?.emissive?.getHex() > 0
              )
            ) {
              suppressedIndicators.set(child, child.visible);
              child.visible = false;
            }
          });
          matchedModel.add(ledMesh);
          existing = {
            model: matchedModel,
            mesh: ledMesh,
            indicators: suppressedIndicators
          };
          meshesByBindingId.set(binding.id, existing);
        }
      }
      for (const [bindingId, staleEntry] of meshesByBindingId) {
        if (!activeBindingIds.has(bindingId)) {
          releaseEntry(staleEntry);
          meshesByBindingId.delete(bindingId);
        }
      }
    }
    hasVisibleIndicator = false;
    let needsRender = false;
    for (const activeBinding of bindings) {
      const bindingEntry = meshesByBindingId.get(activeBinding.id);
      if (!bindingEntry) {
        continue;
      }
      const uniforms = bindingEntry.mesh.material.uniforms;
      needsRender ||=
        uniforms.sizeScale.value !== sizeScale || uniforms.brightness.value !== brightness;
      uniforms.sizeScale.value = sizeScale;
      uniforms.brightness.value = brightness;
      const deviceState = nasDeviceState(activeBinding, states);
      const shouldShow = enabled && deviceState.on;
      needsRender ||= bindingEntry.mesh.visible !== shouldShow;
      bindingEntry.mesh.visible = shouldShow;
      if (shouldShow) {
        hasVisibleIndicator = true;
      }
    }
    if (needsRender || hasVisibleIndicator) {
      requestFrame();
    }
  }
  function tick(nowMs) {
    if (isDisposed || !hasVisibleIndicator) {
      return false;
    }
    const reducedMotion = prefersReducedMotion();
    if (!reducedMotion && nowMs - lastTickMs < 1000 / 30) {
      return true;
    }
    lastTickMs = nowMs;
    const pulse = reducedMotion
      ? 1
      : 0.14 + (0.5 - Math.cos((nowMs / 1400) * Math.PI * 2) * 0.5) * 0.86;
    let changed = false;
    for (const meshEntry of meshesByBindingId.values()) {
      if (meshEntry.mesh.visible) {
        changed ||= meshEntry.mesh.material.uniforms.pulse.value !== pulse;
        meshEntry.mesh.material.uniforms.pulse.value = pulse;
      }
    }
    if (changed) {
      requestFrame();
    }
    return !reducedMotion;
  }
  return {
    sync: sync,
    tick: tick,
    nextDelay: () =>
      !isDisposed && hasVisibleIndicator && !prefersReducedMotion() ? 1000 / 30 : Infinity,
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        for (const disposedEntry of meshesByBindingId.values()) {
          releaseEntry(disposedEntry);
        }
        meshesByBindingId.clear();
        planeGeometry.dispose();
      }
    }
  };
}
