import { normalizeGroundReflection } from "../modules/interaction3d/reflection-settings.js";
import { createReflectionCulling } from "./studio-reflection-culling.js?v=20260909-reflection-scope-v1";
export function createGroundReflections({
  THREE: Vector4,
  renderer: xr,
  scene: background2,
  getRoot: arg19,
  syncLighting: arg20,
  getStateKey: arg21 = () => "",
  getSceneRevision: arg22 = () => "",
  floorLighting: arg23 = false,
  detail: prepare = null,
  cull: arg24 = true,
  requestFrame: arg25 = () => {}
}) {
  const mode2 = {
    ...normalizeGroundReflection(),
    fps: 30
  };
  const restore = createReflectionCulling(Vector4);
  const inCapture = {
    captures: 0,
    renders: 0,
    lastMs: 0,
    totalMs: 0,
    allocations: 0,
    reuses: 0,
    cachedRecords: 0,
    cachedBytes: 0,
    inCapture: false
  };
  const has2 = new WeakMap();
  const entryMap = new Map();
  function fn(transmission2) {
    if (!transmission2 || !(transmission2.transmission > 0)) {
      return transmission2;
    }
    if (!has2.has(transmission2)) {
      const transmission = transmission2.clone();
      transmission.transmission = 0;
      transmission.forceSinglePass = true;
      transmission.onBeforeCompile = transmission2.onBeforeCompile;
      transmission.customProgramCacheKey = () => transmission2.customProgramCacheKey() + "|reflection-no-refraction";
      const value11 = () => {
        transmission2.removeEventListener("dispose", value11);
        has2.delete(transmission2);
        entryMap.delete(transmission);
        transmission.dispose();
      };
      transmission2.addEventListener("dispose", value11);
      has2.set(transmission2, transmission);
      entryMap.set(transmission, value11);
    }
    return has2.get(transmission2);
  }
  let push5 = [];
  let traverse = null;
  let value33 = null;
  let value34 = true;
  let value35 = -Infinity;
  let value36 = "";
  let value37 = "";
  let value38 = false;
  let value39 = 0;
  let value40;
  let value41 = false;
  let value42 = false;
  let value43 = null;
  let value44 = null;
  let value45 = null;
  let value46 = 0;
  const values = new Map();
  const get3 = new Map();
  const value47 = 33554432;
  let set2 = new Map();
  let get4 = new Map();
  function fn2(arg12) {
    for (let userData4 = arg12; userData4; userData4 = userData4.parent) {
      const value12 = userData4.userData?.floorId || userData4.userData?.regionFloorId || userData4.userData?.environmentFloorId || userData4.userData?.lightFloorId;
      if (value12) {
        return String(value12);
      }
    }
    return "";
  }
  const has3 = new WeakMap();
  let value48 = 0;
  function fn3(arg13) {
    if (arg13) {
      if (!has3.has(arg13)) {
        has3.set(arg13, ++value48);
      }
      return has3.get(arg13);
    } else {
      return 0;
    }
  }
  function fn4(geometry6) {
    const index = geometry6.geometry;
    return [index.uuid, fn3(index.index), index.index?.version, ...Object.entries(index.attributes).flatMap(([arg, version]) => [arg, fn3(version), version.version, version.data?.version, version.count]), index.drawRange.start, index.drawRange.count].join("|");
  }
  function fn5(overlay6) {
    overlay6.geometry.removeEventListener("dispose", overlay6.onSourceDispose);
    overlay6.overlay.removeFromParent();
    overlay6.overlay.geometry.dispose();
    overlay6.overlay.material.dispose();
    overlay6.map.dispose();
    overlay6.scratch.dispose();
    values.delete(overlay6.source);
  }
  function fn6() {
    const has = new Set(push5);
    const value19 = [...values.values()].filter(arg4 => !has.has(arg4)).sort((used, used2) => used2.used - used.used);
    let cachedBytes = 0;
    let cachedRecords = 0;
    for (const map3 of value19) {
      const value13 = map3.map.width * map3.map.height * ((1 + map3.map.samples) * 12 + 8);
      if (map3.dead || cachedRecords >= 4 || cachedBytes + value13 > value47) {
        fn5(map3);
        continue;
      }
      cachedBytes += value13;
      cachedRecords++;
    }
    inCapture.cachedRecords = cachedRecords;
    inCapture.cachedBytes = cachedBytes;
  }
  function fn7(map5) {
    return map5.map(color => [color.uuid, fn12(color), color.intensity, color.color?.r, color.color?.g, color.color?.b, color.distance, color.decay, color.angle, color.penumbra, ...color.matrixWorld.elements, ...(color.target?.matrixWorld.elements || [])].join(",")).join(";");
  }
  function fn8(height2, get) {
    return [...set2].filter(([arg2, arg3]) => !arg23 || !arg2 || arg3 >= height2.height - 0.1).map(([arg5]) => get.get(arg5)).join("|");
  }
  function fn9(arg14) {
    if (value45 === null) {
      return true;
    }
    for (let userData5 = arg14; userData5; userData5 = userData5.parent) {
      const value14 = userData5.userData?.floorId || userData5.userData?.regionFloorId;
      if (value14) {
        return value14 === value45;
      }
    }
    return false;
  }
  const add = new Vector4.Scene();
  const value49 = new Vector4.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = new Vector4.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      source: {
        value: null
      },
      step: {
        value: new Vector4.Vector2()
      }
    },
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: "uniform sampler2D source; uniform vec2 step; varying vec2 vUv;\n      void main(){ gl_FragColor=texture2D(source,vUv)*.227027;\n      gl_FragColor+=(texture2D(source,vUv+step*1.384615)+texture2D(source,vUv-step*1.384615))*.316216;\n      gl_FragColor+=(texture2D(source,vUv+step*3.230769)+texture2D(source,vUv-step*3.230769))*.070270; }"
  });
  const geometry7 = new Vector4.Mesh(new Vector4.PlaneGeometry(2, 2), uniforms);
  add.add(geometry7);
  const value50 = (arg7, arg8 = false) => new Vector4.WebGLRenderTarget(arg7, arg7, {
    type: Vector4.HalfFloatType,
    depthBuffer: !arg8,
    samples: arg8 ? 0 : Math.min(2, xr.capabilities.maxSamples)
  });
  function fn10() {
    for (const value17 of [...values.values()]) {
      fn5(value17);
    }
    push5 = [];
    inCapture.cachedRecords = inCapture.cachedBytes = 0;
  }
  function fn11(arg15) {
    const children = arg19();
    if (!children) {
      fn10();
      traverse = value33 = null;
      return;
    }
    if (value40 === arg15 && traverse === children && value33 === children.children[0] && push5.every(source => source.source.parent && !source.dead)) {
      return;
    }
    for (const overlay4 of push5) {
      overlay4.overlay.visible = false;
      overlay4.overlay.removeFromParent();
    }
    push5 = [];
    value40 = arg15;
    traverse = children;
    value33 = children.children[0];
    traverse.updateWorldMatrix(true, true);
    set2 = new Map();
    get4 = new Map();
    const copy = new Vector4.Box3();
    traverse.traverse(geometry => {
      if (geometry.userData?.reflectionOverlay || geometry.userData?.environmentEffect) {
        return;
      }
      const value7 = fn2(geometry);
      if (geometry.isLight) {
        if (!get4.has(value7)) {
          get4.set(value7, []);
        }
        get4.get(value7).push(geometry);
      }
      if (!geometry.isMesh || !geometry.geometry) {
        return;
      }
      if (!geometry.geometry.boundingBox) {
        geometry.geometry.computeBoundingBox();
      }
      if (geometry.isInstancedMesh) {
        geometry.computeBoundingBox();
      }
      const value8 = geometry.isInstancedMesh ? geometry.boundingBox : geometry.geometry.boundingBox;
      const value9 = geometry.isSkinnedMesh || geometry.morphTargetInfluences?.length ? Infinity : value8 ? copy.copy(value8).applyMatrix4(geometry.matrixWorld).max.y : Infinity;
      set2.set(value7, Math.max(set2.get(value7) ?? -Infinity, value9));
    });
    const push = [];
    traverse.traverse(userData => {
      if (userData.isMesh && (userData.userData.regionReceiverKind === "floor" || userData.userData.exportRole === "background")) {
        push.push(userData);
      }
    });
    for (const geometry5 of push) {
      const kind2 = geometry5.userData.exportRole === "background" ? "outside" : "inside";
      if (mode2.mode !== "all" && kind2 !== mode2.mode || kind2 === "outside" && !fn9(geometry5)) {
        continue;
      }
      const max = new Vector4.Box3().setFromObject(geometry5);
      const height = max.max.y;
      const key = fn4(geometry5);
      let overlay3 = values.get(geometry5);
      if (overlay3 && (overlay3.dead || overlay3.key !== key)) {
        fn5(overlay3);
        overlay3 = null;
      }
      if (overlay3) {
        overlay3.height = height;
        overlay3.used = ++value46;
        overlay3.overlay.position.copy(geometry5.position);
        overlay3.overlay.quaternion.copy(geometry5.quaternion);
        overlay3.overlay.scale.copy(geometry5.scale);
        geometry5.parent.add(overlay3.overlay);
        push5.push(overlay3);
        inCapture.reuses++;
        continue;
      }
      const texture2 = value50(mode2.resolution);
      const scratch = value50(mode2.resolution, true);
      const value15 = new Vector4.Matrix4();
      const value16 = new Vector4.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -2,
        uniforms: {
          reflection: {
            value: texture2.texture
          },
          reflectionMatrix: {
            value: value15
          },
          strength: {
            value: mode2.strength
          }
        },
        vertexShader: "uniform mat4 reflectionMatrix; varying vec4 reflected; varying float up;\n          void main(){vec4 world=modelMatrix*vec4(position,1.);reflected=reflectionMatrix*world;\n          up=normalize(mat3(modelMatrix)*normal).y;gl_Position=projectionMatrix*viewMatrix*world;}",
        fragmentShader: "uniform sampler2D reflection; uniform float strength; varying vec4 reflected; varying float up;\n          void main(){if(up<.9||reflected.w<=0.)discard;vec2 uv=reflected.xy/reflected.w;\n          if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))discard;\n          vec4 value=texture2D(reflection,uv);gl_FragColor=vec4(value.rgb/max(value.a,.001),clamp(value.a*strength,0.,.7));\n          #include <tonemapping_fragment>\n          #include <colorspace_fragment>\n          }"
      });
      const userData3 = new Vector4.Mesh(geometry5.geometry.clone(), value16);
      userData3.position.copy(geometry5.position);
      userData3.quaternion.copy(geometry5.quaternion);
      userData3.scale.copy(geometry5.scale);
      userData3.renderOrder = 1;
      userData3.userData.environmentEffect = true;
      userData3.userData.reflectionOverlay = true;
      userData3.userData.externalModelSharedGeometry = userData3.userData.externalModelSharedMaterial = userData3.userData.externalModelSharedTextures = true;
      overlay3 = {
        source: geometry5,
        geometry: geometry5.geometry,
        kind: kind2,
        height,
        overlay: userData3,
        map: texture2,
        scratch,
        matrix: value15,
        key,
        used: ++value46,
        state: "",
        dead: false
      };
      overlay3.onSourceDispose = () => {
        overlay3.dead = true;
        userData3.visible = false;
      };
      geometry5.geometry.addEventListener("dispose", overlay3.onSourceDispose);
      values.set(geometry5, overlay3);
      inCapture.allocations++;
      geometry5.parent.add(userData3);
      push5.push(overlay3);
    }
    prepare?.prepare(traverse);
    fn6();
    value34 = true;
  }
  function fn12(arg16) {
    for (let parent = arg16; parent; parent = parent.parent) {
      if (!parent.visible) {
        return false;
      }
    }
    return true;
  }
  function fn13(kind3) {
    return (mode2.mode === "all" || mode2.mode === kind3.kind) && (kind3.kind !== "outside" || fn9(kind3.source));
  }
  function configure(arg17) {
    const mode = normalizeGroundReflection(arg17);
    if (mode.mode === mode2.mode && mode.resolution === mode2.resolution && mode.strength === mode2.strength) {
      return false;
    }
    const value20 = mode2.resolution !== mode.resolution;
    const value21 = mode2.mode !== mode.mode;
    Object.assign(mode2, mode);
    if (value20 || mode.mode === "off" || mode.strength === 0) {
      fn10();
      value33 = null;
    }
    if (value21) {
      value33 = null;
    }
    value34 ||= value20 || value21;
    arg25();
    return true;
  }
  function fn14(clone, arg18, set) {
    const projectionMatrix = clone.clone();
    projectionMatrix.layers.mask = clone.layers.mask;
    const y = clone.getWorldPosition(new Vector4.Vector3());
    const y2 = clone.getWorldDirection(new Vector4.Vector3());
    y.y = arg18 * 2 - y.y;
    y2.y *= -1;
    projectionMatrix.position.copy(y);
    projectionMatrix.up.setFromMatrixColumn(clone.matrixWorld, 1).normalize();
    projectionMatrix.up.y *= -1;
    projectionMatrix.lookAt(y.clone().add(y2));
    projectionMatrix.updateMatrixWorld(true);
    projectionMatrix.projectionMatrix.copy(clone.projectionMatrix);
    projectionMatrix.projectionMatrix.elements[8] *= -1;
    projectionMatrix.projectionMatrix.elements[12] *= -1;
    set.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(projectionMatrix.projectionMatrix).multiply(projectionMatrix.matrixWorldInverse);
    const normal = new Vector4.Plane(new Vector4.Vector3(0, 1, 0), -arg18).applyMatrix4(projectionMatrix.matrixWorldInverse);
    const x = new Vector4.Vector4(normal.normal.x, normal.normal.y, normal.normal.z, normal.constant);
    const value22 = projectionMatrix.projectionMatrix.elements;
    const value23 = new Vector4.Vector4(Math.sign(x.x), Math.sign(x.y), 1, 1).applyMatrix4(projectionMatrix.projectionMatrix.clone().invert());
    x.multiplyScalar(2 / x.dot(value23));
    value22[2] = x.x - value22[3];
    value22[6] = x.y - value22[7];
    value22[10] = x.z - value22[11];
    value22[14] = x.w - value22[15];
    projectionMatrix.projectionMatrixInverse.copy(projectionMatrix.projectionMatrix).invert();
    return projectionMatrix;
  }
  function render(matrixWorld) {
    if (value38 || inCapture.inCapture || !matrixWorld || value41 || mode2.mode === "off" || mode2.strength === 0 || (fn11(arg22()), !traverse)) {
      return;
    }
    const value24 = value42 ? 0 : value43 === null ? 1 : Math.min(1, (performance.now() - value43) / 260);
    if (value24 < 1) {
      arg25();
    } else {
      value43 = null;
    }
    for (const overlay5 of push5) {
      overlay5.overlay.visible = fn12(overlay5.kind === "outside" ? overlay5.source.parent : overlay5.source) && fn13(overlay5);
      overlay5.overlay.material.uniforms.strength.value = mode2.strength * value24;
    }
    if (mode2.mode === "off" || !push5.length) {
      return;
    }
    const value25 = performance.now();
    const value26 = matrixWorld.matrixWorld.elements.join(",") + matrixWorld.projectionMatrix.elements.join(",");
    const value27 = value26 !== value36;
    const value28 = mode2.resolution;
    for (const map4 of push5) {
      if (map4.map.width !== value28) {
        map4.map.setSize(value28, value28);
        map4.scratch.setSize(value28, value28);
        value34 = true;
      }
    }
    const value29 = arg21() + "|" + value39 + "|" + fn7(get4.get("") || []) + "|" + (arg23 ? "" : fn7([...get4.values()].flat()));
    const value30 = value34 || value27 || value29 !== value37;
    const value31 = new Map([...set2.keys()].map(arg6 => [arg6, arg6 + ":" + (get3.get(arg6) || 0) + ":" + (arg23 ? fn7(get4.get(arg6) || []) : "")]));
    const get2 = new Map();
    const length = push5.filter(overlay2 => {
      if (!overlay2.overlay.visible || matrixWorld.position.y <= overlay2.height) {
        return false;
      }
      const value5 = fn8(overlay2, value31);
      get2.set(overlay2, value5);
      return value30 || overlay2.state !== value5;
    });
    if (!length.length) {
      return;
    }
    if (!value34 && !value27 && value25 - value35 < 1000 / mode2.fps) {
      if (value44 === null) {
        value44 = setTimeout(() => {
          value44 = null;
          arg25();
        }, 1000 / mode2.fps - (value25 - value35));
      }
      return;
    }
    const background = {
      target: xr.getRenderTarget(),
      cubeFace: xr.getActiveCubeFace(),
      mipmap: xr.getActiveMipmapLevel(),
      xr: xr.xr.enabled,
      shadow: xr.shadowMap.autoUpdate,
      alpha: xr.getClearAlpha(),
      color: xr.getClearColor(new Vector4.Color()),
      background: background2.background,
      viewport: xr.getViewport(new Vector4.Vector4()),
      scissor: xr.getScissor(new Vector4.Vector4()),
      scissorTest: xr.getScissorTest(),
      autoClear: xr.autoClear
    };
    const push2 = [];
    const push3 = [];
    const push4 = [];
    restore.reset();
    traverse.traverse(userData2 => {
      if (userData2.name === "interaction3d-curtain-shadow-refresh" || userData2.userData.reflectionOverlay || ["background", "grid", "outline"].includes(userData2.userData.exportRole) || userData2.userData.regionReceiverKind === "floor" || userData2.userData.environmentEffect) {
        push2.push([userData2, userData2.visible]);
        userData2.visible = false;
      }
      if (arg24) {
        restore.add(userData2, !arg23);
      }
      const geometry2 = prepare?.get(userData2);
      if (geometry2) {
        push4.push([userData2, userData2.geometry]);
        userData2.geometry = geometry2;
      }
      if (userData2.isMesh && userData2.material) {
        const map = userData2.material;
        const material = Array.isArray(map) ? map.map(fn) : fn(map);
        if (material !== map) {
          push3.push([userData2, map]);
          userData2.material = material;
        }
      }
    });
    const value32 = performance.now();
    inCapture.inCapture = true;
    inCapture.lastDrawCalls = inCapture.lastTriangles = 0;
    try {
      xr.xr.enabled = false;
      xr.shadowMap.autoUpdate = false;
      xr.autoClear = true;
      background2.background = null;
      xr.setClearColor(0, 0);
      xr.setScissorTest(false);
      for (const map2 of length) {
        const value6 = fn14(matrixWorld, map2.height, map2.matrix);
        arg20(value6);
        if (arg24 && !restore.begin(map2, value6)) {
          map2.state = get2.get(map2);
          continue;
        }
        xr.setRenderTarget(map2.map);
        xr.clear();
        xr.render(background2, value6);
        inCapture.renders++;
        inCapture.lastDrawCalls += xr.info?.render.calls || 0;
        inCapture.lastTriangles += xr.info?.render.triangles || 0;
        restore.restore();
        for (const [texture, value, value2, value3] of [[map2.map, map2.scratch, 1, 0], [map2.scratch, map2.map, 0, 1]]) {
          uniforms.uniforms.source.value = texture.texture;
          uniforms.uniforms.step.value.set(value2 * 2 / 512, value3 * 2 / 512);
          xr.setRenderTarget(value);
          xr.clear();
          xr.render(add, value49);
        }
        inCapture.captures++;
        map2.state = get2.get(map2);
      }
      if (value42) {
        value42 = false;
        value43 = performance.now();
        arg25();
      }
      value34 = false;
      value35 = value25;
      value36 = value26;
      value37 = value29;
    } finally {
      restore.restore();
      inCapture.culling = {
        ...restore.stats
      };
      for (const [geometry3, geometry4] of push4) {
        geometry3.geometry = geometry4;
      }
      for (const [visible, visible2] of push2) {
        visible.visible = visible2;
      }
      for (const [material2, material3] of push3) {
        material2.material = material3;
      }
      background2.background = background.background;
      xr.setClearColor(background.color, background.alpha);
      xr.setRenderTarget(background.target, background.cubeFace, background.mipmap);
      xr.setViewport(background.viewport);
      xr.setScissor(background.scissor);
      xr.setScissorTest(background.scissorTest);
      xr.xr.enabled = background.xr;
      xr.shadowMap.autoUpdate = background.shadow;
      xr.autoClear = background.autoClear;
      arg20(matrixWorld);
      inCapture.inCapture = false;
      inCapture.lastMs = performance.now() - value32;
      inCapture.totalMs += inCapture.lastMs;
    }
  }
  return {
    settings: mode2,
    stats: inCapture,
    render,
    configure,
    setOutsideFloor(arg9) {
      const value18 = arg9 == null ? null : String(arg9);
      if (value18 !== value45) {
        value45 = value18;
        for (const kind of push5) {
          if (kind.kind === "outside" && !fn9(kind.source)) {
            kind.overlay.visible = false;
          }
        }
        value33 = null;
        value34 = true;
        arg25();
      }
    },
    setSuspended(arg10) {
      if (value41 !== (arg10 === true)) {
        value41 = arg10 === true;
        value43 = null;
        value42 = !value41;
        for (const overlay of push5) {
          overlay.overlay.visible = false;
          if (value41) {
            overlay.overlay.removeFromParent();
          }
        }
        value34 = true;
        if (!value41) {
          value33 = null;
          arg25();
        }
      }
    },
    get records() {
      return push5;
    },
    invalidate() {
      value34 = true;
    },
    changed(arg11) {
      if (arg11 == null) {
        value39++;
      } else {
        for (const value4 of new Set(arg11)) {
          if (!value4 || !set2.has(String(value4))) {
            value39++;
            continue;
          }
          get3.set(String(value4), (get3.get(String(value4)) || 0) + 1);
        }
      }
    },
    dispose() {
      value38 = true;
      prepare?.dispose();
      clearTimeout(value44);
      fn10();
      geometry7.geometry.dispose();
      uniforms.dispose();
      for (const value10 of [...entryMap.values()]) {
        value10();
      }
      get3.clear();
      set2.clear();
      get4.clear();
    }
  };
}
