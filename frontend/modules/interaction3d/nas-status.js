export function nasState(arg11, newState) {
  const state = newState?.newState || newState || {};
  const value11 = String(state.state || "").trim().toLowerCase();
  const available = /^(binary_sensor|switch|input_boolean)\.[a-z0-9_]+$/.test(arg11 || "") && state.available !== false && ["on", "off"].includes(value11);
  return {
    available,
    on: available && value11 === "on",
    name: state.attributes?.friendly_name || arg11 || "NAS"
  };
}
export function nasDeviceState(entityId, get = {}) {
  const value12 = arg => get instanceof Map ? get.get(arg) : get[arg];
  if (entityId.entityId) {
    return nasState(entityId.entityId, value12(entityId.entityId));
  }
  const value13 = entityId.statusSource?.primaryEntityId;
  const state2 = value12(value13)?.newState || value12(value13);
  const available2 = !!value13 && state2?.available !== false && state2?.state != null && !["", "unknown", "unavailable", "none"].includes(String(state2.state).trim().toLowerCase());
  return {
    available: available2,
    on: available2,
    name: entityId.statusSource?.name || "NAS"
  };
}
export function createNasStatus({
  THREE: Matrix4,
  requestFrame: arg12 = () => {}
}) {
  const get2 = new Map();
  const dispose = new Matrix4.PlaneGeometry(1, 1);
  let traverse2;
  let value14;
  let value15;
  let value16 = false;
  let value17 = false;
  let value18 = -Infinity;
  const value19 = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true || globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const value20 = (arg2, arg3) => JSON.stringify([arg2 || "", arg3 || ""]);
  function fn2(mesh3) {
    for (const [visible2, visible3] of mesh3.indicators) {
      visible2.visible = visible3;
    }
    mesh3.mesh.removeFromParent();
    mesh3.mesh.material.dispose();
  }
  function fn3(arg5) {
    const union = new Matrix4.Box3();
    function fn(geometry, arg4) {
      if (!geometry.userData?.environmentEffect && (geometry === arg5 || geometry.userData?.environmentModelId == null)) {
        if (geometry.isMesh && geometry.geometry) {
          if (!geometry.geometry.boundingBox) {
            geometry.geometry.computeBoundingBox();
          }
          if (geometry.geometry.boundingBox) {
            union.union(geometry.geometry.boundingBox.clone().applyMatrix4(arg4));
          }
        }
        for (const matrixAutoUpdate of geometry.children || []) {
          if (matrixAutoUpdate.matrixAutoUpdate) {
            matrixAutoUpdate.updateMatrix();
          }
          fn(matrixAutoUpdate, new Matrix4.Matrix4().multiplyMatrices(arg4, matrixAutoUpdate.matrix));
        }
      }
    }
    fn(arg5, new Matrix4.Matrix4());
    return union;
  }
  function sync({
    root: arg6,
    revision: arg7,
    bindings: map = [],
    states: arg8 = {},
    enabled: arg9 = false
  }) {
    if (value16) {
      return;
    }
    const value7 = JSON.stringify(map.map(id => [id.id, id.floorId, id.modelId]));
    if (traverse2 !== arg6 || value14 !== arg7 || value15 !== value7) {
      traverse2 = arg6;
      value14 = arg7;
      value15 = value7;
      const set2 = new Map();
      traverse2?.traverse(userData => {
        if (userData.userData?.environmentModelType !== "nas") {
          return;
        }
        let value3 = userData.userData.environmentFloorId;
        for (let parent = userData.parent; value3 == null && parent; parent = parent.parent) {
          value3 = parent.userData.environmentFloorId;
        }
        set2.set(value20(value3, userData.userData.environmentModelId), userData);
      });
      const add = new Set();
      for (const id2 of map) {
        const traverse = set2.get(value20(id2.floorId, id2.modelId));
        if (!traverse) {
          continue;
        }
        add.add(id2.id);
        let model = get2.get(id2.id);
        if (model?.model !== traverse) {
          if (model) {
            fn2(model);
          }
          const isEmpty = fn3(traverse);
          if (isEmpty.isEmpty()) {
            get2.delete(id2.id);
            continue;
          }
          const x = isEmpty.getSize(new Matrix4.Vector3());
          const x2 = isEmpty.getCenter(new Matrix4.Vector3());
          const uniforms = new Matrix4.ShaderMaterial({
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
              }
            },
            vertexShader: "varying vec2 ledUv; uniform float viewportHeight; void main(){ledUv=uv;vec4 center=modelViewMatrix*vec4(0.0,0.0,0.0,1.0);vec4 clip=projectionMatrix*center;float physicalSize=length(modelMatrix[0].xyz);float minimumSize=24.0*clip.w/(max(viewportHeight,1.0)*projectionMatrix[1][1]);center.xy+=position.xy*max(physicalSize,minimumSize);gl_Position=projectionMatrix*center;}",
            fragmentShader: "varying vec2 ledUv; uniform float pulse; void main(){float r=length(ledUv-0.5)*2.0;float core=1.0-smoothstep(0.28,0.50,r);float halo=pow(max(0.0,1.0-r),1.7)*0.8;float a=(core+halo)*pulse;if(a<0.005)discard;gl_FragColor=vec4(mix(vec3(0.06,1.0,0.20),vec3(0.48,1.0,0.60),core),min(a,1.0));}"
          });
          const name2 = new Matrix4.Mesh(dispose, uniforms);
          name2.name = "nas-status-" + id2.id;
          Object.assign(name2.userData, {
            environmentEffect: true,
            nasStatus: true,
            externalModelSharedGeometry: true,
            externalModelSharedMaterial: true
          });
          name2.raycast = () => {};
          name2.renderOrder = 100;
          const value = new Matrix4.Vector2();
          name2.onBeforeRender = getSize => {
            uniforms.uniforms.viewportHeight.value = getSize.getSize(value).y;
          };
          const value2 = Math.max(0.025, Math.min(0.075, x.x * 0.22));
          name2.scale.set(value2, value2, value2);
          name2.position.set(x2.x + x.x * 0.36, isEmpty.min.y + x.y * 0.26, isEmpty.max.z + 0.003);
          const set = new Map();
          traverse.traverse(material => {
            if (!material.isMesh || material === name2 || material.userData?.environmentEffect) {
              return;
            }
            if ((Array.isArray(material.material) ? material.material : [material.material]).some(name => /nas-material-4$/.test(name?.name || "") || name?.emissive?.getHex() > 0)) {
              set.set(material, material.visible);
              material.visible = false;
            }
          });
          traverse.add(name2);
          model = {
            model: traverse,
            mesh: name2,
            indicators: set
          };
          get2.set(id2.id, model);
        }
      }
      for (const [value5, value6] of get2) {
        if (!add.has(value5)) {
          fn2(value6);
          get2.delete(value5);
        }
      }
    }
    value17 = false;
    let value8 = false;
    for (const id3 of map) {
      const mesh = get2.get(id3.id);
      if (!mesh) {
        continue;
      }
      const on = nasDeviceState(id3, arg8);
      const visible = arg9 && on.on;
      value8 ||= mesh.mesh.visible !== visible;
      mesh.mesh.visible = visible;
      if (visible) {
        value17 = true;
      }
    }
    if (value8 || value17) {
      arg12();
    }
  }
  function tick(arg10) {
    if (value16 || !value17) {
      return false;
    }
    const value9 = value19();
    if (!value9 && arg10 - value18 < 1000 / 30) {
      return true;
    }
    value18 = arg10;
    const element = value9 ? 1 : 0.14 + (0.5 - Math.cos(arg10 / 1400 * Math.PI * 2) * 0.5) * 0.86;
    let value10 = false;
    for (const mesh2 of get2.values()) {
      if (mesh2.mesh.visible) {
        value10 ||= mesh2.mesh.material.uniforms.pulse.value !== element;
        mesh2.mesh.material.uniforms.pulse.value = element;
      }
    }
    if (value10) {
      arg12();
    }
    return !value9;
  }
  return {
    sync,
    tick,
    nextDelay: () => !value16 && value17 && !value19() ? 1000 / 30 : Infinity,
    dispose() {
      if (!value16) {
        value16 = true;
        for (const value4 of get2.values()) {
          fn2(value4);
        }
        get2.clear();
        dispose.dispose();
      }
    }
  };
}
