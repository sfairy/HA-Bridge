function oe(arg44, arg45) {
  for (let userData = arg44; userData; userData = userData.parent) {
    if (userData.userData?.[arg45] !== undefined) {
      return userData.userData[arg45];
    }
  }
}
function Oe(arg46) {
  for (let parent2 = arg46; parent2; parent2 = parent2.parent) {
    if (!parent2.visible) {
      return false;
    }
  }
  return true;
}
export function isContactCasterMaterial(visible2) {
  return !!visible2 && visible2.visible !== false && !!(visible2.opacity >= 0.98) && !(visible2.transmission > 0) && (!visible2.transparent || !!(visible2.alphaTest > 0));
}
export function surfaceBakeLevels(Vector3, arg38, arg39, arg40 = 32) {
  const items = new Map();
  const fromBufferAttribute = new Vector3.Vector3();
  const fromBufferAttribute2 = new Vector3.Vector3();
  const fromBufferAttribute3 = new Vector3.Vector3();
  const subVectors = new Vector3.Vector3();
  const subVectors2 = new Vector3.Vector3();
  const crossVectors = new Vector3.Vector3();
  const copy = new Vector3.Matrix4();
  const value85 = new Vector3.Matrix4();
  for (const isInstancedMesh2 of arg38) {
    const drawRange = isInstancedMesh2.geometry;
    const count = drawRange?.attributes?.position;
    if (!count) {
      continue;
    }
    const getX = drawRange.index;
    const value55 = getX?.count ?? count.count;
    const value56 = drawRange.drawRange.start;
    const value57 = Math.min(value55, value56 + drawRange.drawRange.count);
    for (let value49 = 0; value49 < (isInstancedMesh2.isInstancedMesh ? isInstancedMesh2.count : 1); value49++) {
      copy.copy(isInstancedMesh2.matrixWorld);
      if (isInstancedMesh2.isInstancedMesh) {
        isInstancedMesh2.getMatrixAt(value49, value85);
        copy.multiply(value85);
      }
      for (let value23 = value56; value23 + 2 < value57; value23 += 3) {
        fromBufferAttribute.fromBufferAttribute(count, getX ? getX.getX(value23) : value23).applyMatrix4(copy);
        fromBufferAttribute2.fromBufferAttribute(count, getX ? getX.getX(value23 + 1) : value23 + 1).applyMatrix4(copy);
        fromBufferAttribute3.fromBufferAttribute(count, getX ? getX.getX(value23 + 2) : value23 + 2).applyMatrix4(copy);
        crossVectors.crossVectors(subVectors.subVectors(fromBufferAttribute2, fromBufferAttribute), subVectors2.subVectors(fromBufferAttribute3, fromBufferAttribute));
        const area3 = crossVectors.length() * 0.5;
        const value15 = (fromBufferAttribute.y + fromBufferAttribute2.y + fromBufferAttribute3.y) / 3 - arg39;
        if (area3 < 0.004 || crossVectors.y < area3 * 1.98 || value15 <= 0.12) {
          continue;
        }
        const value16 = Math.round(value15 * 100);
        const height = items.get(value16) || {
          height: 0,
          area: 0
        };
        height.height += value15 * area3;
        height.area += area3;
        items.set(value16, height);
      }
    }
  }
  return [...items.values()].sort((area, area2) => area2.area - area.area).slice(0, arg40).map(height2 => height2.height / height2.area).sort((arg22, arg23) => arg22 - arg23);
}
export function createContactShadowController({
  THREE: RedFormat,
  renderer: setRenderTarget,
  getRoot: arg41,
  canBuild: arg42 = () => true,
  requestFrame: arg43 = () => {}
}) {
  const enabled = {
    enabled: true,
    opacity: 0.78,
    resolution: 1024,
    maxHeight: 2.5,
    heightFalloff: 1.2,
    blurMeters: 0.055,
    offsetX: 0.28,
    offsetZ: -0.22,
    surfaceEnabled: true,
    surfaceOpacity: 0.28,
    surfaceResolution: 512,
    maxSurfaceLevels: 32
  };
  const casters2 = {
    builds: 0,
    capturePasses: 0,
    floors: 0,
    casters: 0,
    instancedCasters: 0,
    receivers: 0,
    surfaceCaptures: 0,
    surfacePasses: 0,
    cacheHits: 0,
    cachedFloors: 0,
    cachedBytes: 0,
    disposed: false
  };
  const values = new Map();
  const get2 = new Map();
  const get3 = new WeakMap();
  const get4 = new WeakMap();
  const entryMap = new Map();
  const element4 = new RedFormat.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  element4.needsUpdate = true;
  let value86 = true;
  let value87 = false;
  let value88 = false;
  let value89 = false;
  let value90 = null;
  let value91 = null;
  let value92 = false;
  let value93 = false;
  const clear = new Set();
  const add2 = new RedFormat.Scene();
  const value94 = new RedFormat.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms9 = new RedFormat.ShaderMaterial({
    uniforms: {
      source: {
        value: element4
      },
      stepSize: {
        value: new RedFormat.Vector2()
      }
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    vertexShader: "varying vec2 shadowUv; void main() { shadowUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: "uniform sampler2D source; uniform vec2 stepSize; varying vec2 shadowUv;\n      void main() {\n        float value = texture2D(source, shadowUv).r * 0.227027;\n        value += texture2D(source, shadowUv + stepSize * 1.384615).r * 0.316216;\n        value += texture2D(source, shadowUv - stepSize * 1.384615).r * 0.316216;\n        value += texture2D(source, shadowUv + stepSize * 3.230769).r * 0.070270;\n        value += texture2D(source, shadowUv - stepSize * 3.230769).r * 0.070270;\n        gl_FragColor = vec4(vec3(value), 1.0);\n      }"
  });
  const frustumCulled = new RedFormat.Mesh(new RedFormat.PlaneGeometry(2, 2), uniforms9);
  frustumCulled.frustumCulled = false;
  add2.add(frustumCulled);
  function fn(arg24) {
    const id4 = String(arg24);
    if (!values.has(id4)) {
      values.set(id4, {
        id: id4,
        target: null,
        ping: null,
        surface: null,
        lookup: null,
        casters: 0,
        instancedCasters: 0,
        receivers: 0,
        uniforms: {
          plan2ContactTransform: {
            value: new RedFormat.Matrix4()
          },
          plan2ContactMap: {
            value: element4
          },
          plan2ContactBounds: {
            value: new RedFormat.Vector4(0, 0, 1, 1)
          },
          plan2ContactY: {
            value: 0
          },
          plan2ContactOpacity: {
            value: 0
          },
          plan2SurfaceMap: {
            value: element4
          },
          plan2SurfaceBounds: {
            value: new RedFormat.Vector4()
          },
          plan2SurfaceLookup: {
            value: element4
          },
          plan2SurfaceLayout: {
            value: new RedFormat.Vector2(1, 1)
          },
          plan2SurfaceOpacity: {
            value: 0
          }
        }
      });
    }
    return values.get(id4);
  }
  function invalidate(arg25, arg26 = false) {
    if (!value87) {
      if (!arg26) {
        value93 = false;
        const has = arg25 == null ? null : new Set(typeof arg25 == "string" ? [arg25] : arg25);
        for (const [value9, id2] of entryMap) {
          if (!has || has.has(id2.id)) {
            fn5(id2);
            entryMap.delete(value9);
          }
        }
      }
      if (arg25 == null) {
        value86 = true;
        clear.clear();
      } else if (!value86) {
        const value10 = typeof arg25 == "string" ? [arg25] : arg25;
        for (const value7 of value10) {
          if (value7 != null) {
            clear.add(String(value7));
          }
        }
      }
      if (value86 || clear.size) {
        arg43();
      }
    }
  }
  function setEnabled(arg27) {
    enabled.enabled = !!arg27;
    for (const uniforms3 of values.values()) {
      uniforms3.fade = null;
      uniforms3.uniforms.plan2ContactOpacity.value = enabled.enabled && !value88 && uniforms3.target ? enabled.opacity : 0;
      uniforms3.uniforms.plan2SurfaceOpacity.value = enabled.enabled && !value88 && enabled.surfaceEnabled && uniforms3.surface ? enabled.surfaceOpacity : 0;
    }
    arg43();
  }
  function setSuspended(arg28) {
    const value58 = arg28 === true;
    if (value58 !== value88) {
      value88 = value58;
      for (const uniforms of values.values()) {
        uniforms.uniforms.plan2ContactOpacity.value = 0;
        uniforms.uniforms.plan2SurfaceOpacity.value = 0;
      }
      invalidate();
    }
  }
  function setMotion(arg29) {
    if (value89 !== (arg29 === true)) {
      value89 = arg29 === true;
      if (!value89) {
        value92 = true;
        value93 = true;
      }
      invalidate(null, true);
    }
  }
  function fn2() {
    for (const uniforms4 of values.values()) {
      if (!uniforms4.bakedFrame) {
        continue;
      }
      uniforms4.anchor?.updateWorldMatrix(true, false);
      const value35 = value91?.(uniforms4.id);
      const value36 = value35 || uniforms4.anchor?.matrixWorld;
      if (value36) {
        uniforms4.uniforms.plan2ContactTransform.value.copy(value36).invert().premultiply(uniforms4.bakedFrame);
      }
      if (value89 && uniforms4.target && value36 && !uniforms4.fade && uniforms4.uniforms.plan2ContactOpacity.value === 0) {
        let value17 = false;
        for (let parent = uniforms4.anchor; parent; parent = parent.parent) {
          if (parent === arg41()) {
            value17 = true;
            break;
          }
        }
        if (value35 || value17) {
          uniforms4.uniforms.plan2ContactOpacity.value = enabled.enabled ? enabled.opacity : 0;
          uniforms4.uniforms.plan2SurfaceOpacity.value = enabled.enabled && enabled.surfaceEnabled && uniforms4.surface ? enabled.surfaceOpacity : 0;
        }
      }
    }
  }
  function fn3(map3, arg30 = false) {
    const value59 = JSON.stringify([arg30, map3.map?.uuid, map3.alphaMap?.uuid, map3.alphaTest, map3.displacementMap?.uuid, map3.displacementScale, map3.displacementBias, enabled.maxHeight, enabled.heightFalloff, enabled.offsetX, enabled.offsetZ]);
    if (get2.has(value59)) {
      const value37 = get2.get(value59);
      get2.delete(value59);
      get2.set(value59, value37);
      return value37;
    }
    const onBeforeCompile = new RedFormat.MeshDepthMaterial({
      depthPacking: RedFormat.BasicDepthPacking,
      side: RedFormat.DoubleSide,
      map: map3.map ?? null,
      alphaMap: map3.alphaMap ?? null,
      alphaTest: map3.alphaTest ?? 0,
      displacementMap: map3.displacementMap ?? null,
      displacementScale: map3.displacementScale ?? 1,
      displacementBias: map3.displacementBias ?? 0
    });
    onBeforeCompile.onBeforeCompile = vertexShader => {
      vertexShader.uniforms.contactNear = {
        value: 0.001
      };
      vertexShader.uniforms.contactFar = {
        value: arg30 ? 1.5 : enabled.maxHeight + 0.06
      };
      vertexShader.uniforms.contactFalloff = {
        value: arg30 ? 0.5 : enabled.heightFalloff
      };
      vertexShader.uniforms.contactOffset = {
        value: new RedFormat.Vector2(enabled.offsetX, enabled.offsetZ)
      };
      vertexShader.vertexShader = "uniform vec2 contactOffset;\n" + vertexShader.vertexShader;
      const value24 = "#include <project_vertex>";
      if (!vertexShader.vertexShader.includes(value24)) {
        throw new Error("接触阴影材质缺少 project_vertex");
      }
      vertexShader.vertexShader = vertexShader.vertexShader.replace(value24, value24 + "\n        // The capture looks up from 6cm below this floor. project_vertex has\n        // already applied instancing, skinning and the mesh world transform.\n        // Ground contact stays fixed; elevated surfaces reveal a short shadow\n        // beside the furniture using the same cached map and depth falloff.\n        float contactHeight = max(-mvPosition.z - " + (arg30 ? "0.0" : "0.06") + ", 0.0);\n        gl_Position.xy += vec2(projectionMatrix[0][0], projectionMatrix[1][1]) * contactHeight * contactOffset;");
      vertexShader.fragmentShader = "uniform float contactNear, contactFar, contactFalloff;\n" + vertexShader.fragmentShader;
      vertexShader.fragmentShader = vertexShader.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );", "float height = max(mix(contactNear, contactFar, fragCoordZ) - " + (arg30 ? "0.0" : "0.06") + ", 0.0);\n         float density = exp(-height / contactFalloff) * (1.0 - smoothstep(" + (arg30 ? 0.8 : 1.8) + ", " + (arg30 ? 1.5 : 2.5) + ", height));\n         gl_FragColor = vec4(vec3(density), 1.0);");
    };
    onBeforeCompile.customProgramCacheKey = () => arg30 ? "plan2-surface-bake-v1" : "plan2-contact-depth-v2-short-shadow";
    get2.set(value59, onBeforeCompile);
    return onBeforeCompile;
  }
  function fn4() {
    while (get2.size > 64) {
      const value38 = get2.keys().next().value;
      get2.get(value38).dispose();
      get2.delete(value38);
    }
  }
  function fn5(uniforms5) {
    uniforms5.fade = null;
    uniforms5.anchor = null;
    uniforms5.bakedFrame = null;
    uniforms5.target?.dispose();
    uniforms5.ping?.dispose();
    uniforms5.surface?.dispose();
    uniforms5.lookup?.dispose();
    uniforms5.target = null;
    uniforms5.ping = null;
    uniforms5.surface = null;
    uniforms5.lookup = null;
    uniforms5.uniforms.plan2ContactMap.value = element4;
    uniforms5.uniforms.plan2ContactOpacity.value = 0;
    uniforms5.uniforms.plan2SurfaceMap.value = element4;
    uniforms5.uniforms.plan2SurfaceLookup.value = element4;
    uniforms5.uniforms.plan2SurfaceOpacity.value = 0;
  }
  function fn6(target4, arg31) {
    if (target4.target?.width !== arg31 || target4.target?.height !== arg31) {
      fn5(target4);
      target4.target = new RedFormat.WebGLRenderTarget(arg31, arg31, {
        format: RedFormat.RedFormat,
        generateMipmaps: false
      });
    }
    target4.ping ||= new RedFormat.WebGLRenderTarget(arg31, arg31, {
      format: RedFormat.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    return {
      target: target4.target,
      ping: target4.ping
    };
  }
  function fn7(surface, arg32, forEach, arg33, clone, arg34, arg35) {
    const length = surfaceBakeLevels(RedFormat, arg32, arg34, enabled.maxSurfaceLevels);
    surface.uniforms.plan2SurfaceOpacity.value = 0;
    if (!length.length) {
      surface.surface?.dispose();
      surface.lookup?.dispose();
      surface.surface = surface.lookup = null;
      surface.uniforms.plan2SurfaceMap.value = element4;
      surface.uniforms.plan2SurfaceLookup.value = element4;
      return;
    }
    const value60 = Math.ceil(Math.sqrt(length.length));
    const value61 = Math.min(enabled.surfaceResolution, Math.floor(setRenderTarget.capabilities.maxTextureSize / value60));
    const value62 = value60 * value61;
    if (surface.surface?.width !== value62) {
      surface.surface?.dispose();
      surface.surface = new RedFormat.WebGLRenderTarget(value62, value62, {
        format: RedFormat.RedFormat,
        depthBuffer: false,
        generateMipmaps: false
      });
    }
    const min2 = clone.clone();
    min2.expandByVector(new RedFormat.Vector3(0.5, 0, 0.5));
    const value63 = min2.max.x - min2.min.x;
    const value64 = min2.max.z - min2.min.z;
    const value65 = (min2.min.x + min2.max.x) / 2;
    const value66 = (min2.min.z + min2.max.z) / 2;
    const position2 = new RedFormat.OrthographicCamera(-value63 / 2, value63 / 2, value64 / 2, -value64 / 2, 0.001, 1.5);
    position2.up.set(0, 0, 1);
    const dispose3 = new RedFormat.WebGLRenderTarget(value61, value61, {
      format: RedFormat.RedFormat,
      generateMipmaps: false
    });
    const dispose4 = new RedFormat.WebGLRenderTarget(value61, value61, {
      format: RedFormat.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    const has2 = new Map();
    const value67 = arg17 => isContactCasterMaterial(arg17) ? (has2.has(arg17) || has2.set(arg17, fn3(arg17, true)), has2.get(arg17)) : arg35;
    try {
      forEach.forEach((material2, arg13) => {
        const map = arg32[arg13].material;
        material2.material = Array.isArray(map) ? map.map(value67) : value67(map);
      });
      for (let value25 = 0; value25 < length.length; value25++) {
        position2.position.set(value65, arg34 + length[value25] + 0.025, value66);
        position2.lookAt(value65, position2.position.y + 1, value66);
        position2.updateMatrixWorld(true);
        setRenderTarget.autoClear = true;
        setRenderTarget.setClearColor(0, 1);
        setRenderTarget.setRenderTarget(dispose3);
        setRenderTarget.render(arg33, position2);
        casters2.surfacePasses++;
        const value18 = (texture, arg6, arg7, arg8) => {
          uniforms9.uniforms.source.value = texture.texture;
          uniforms9.uniforms.stepSize.value.set(arg7, arg8);
          setRenderTarget.setRenderTarget(arg6);
          setRenderTarget.render(add2, value94);
        };
        value18(dispose3, dispose4, 0.045 / value63, 0);
        value18(dispose4, dispose3, 0, 0.045 / value64);
        value18(dispose3, dispose4, 0.02 / value63, 0);
        value18(dispose4, dispose3, 0, 0.02 / value64);
        surface.surface.viewport.set(value25 % value60 * value61, Math.floor(value25 / value60) * value61, value61, value61);
        setRenderTarget.autoClear = false;
        value18(dispose3, surface.surface, 0, 0);
      }
      surface.surface.viewport.set(0, 0, value62, value62);
      const value39 = length.at(-1) + 0.05;
      const value40 = 2048;
      const value41 = new Uint8Array(value40 * 4);
      for (let value26 = 0; value26 < value40; value26++) {
        const value19 = (value26 + 0.5) / value40 * value39;
        let value20 = -1;
        let value21 = 0.018;
        length.forEach((arg9, arg10) => {
          const value4 = Math.abs(arg9 - value19);
          if (value4 < value21) {
            value21 = value4;
            value20 = arg10;
          }
        });
        if (!(value20 < 0)) {
          value41[value26 * 4] = value20 % value60;
          value41[value26 * 4 + 1] = Math.floor(value20 / value60);
          value41[value26 * 4 + 2] = 255;
          value41[value26 * 4 + 3] = 255;
        }
      }
      surface.lookup?.dispose();
      surface.lookup = new RedFormat.DataTexture(value41, value40, 1);
      surface.lookup.needsUpdate = true;
      surface.uniforms.plan2SurfaceMap.value = surface.surface.texture;
      surface.uniforms.plan2SurfaceLookup.value = surface.lookup;
      surface.uniforms.plan2SurfaceLayout.value.set(value60, value39);
      surface.uniforms.plan2SurfaceBounds.value.set(min2.min.x, min2.min.z, value63, value64);
      surface.uniforms.plan2SurfaceOpacity.value = enabled.enabled ? enabled.surfaceOpacity : 0;
      casters2.surfaceCaptures++;
    } finally {
      dispose3.dispose();
      dispose4.dispose();
      fn4();
      uniforms9.uniforms.source.value = element4;
    }
  }
  function fn8(uniforms6, arg36, length2) {
    const min3 = new RedFormat.Box3();
    for (const value50 of arg36) {
      min3.union(new RedFormat.Box3().setFromObject(value50));
    }
    if (min3.isEmpty() || !length2.length) {
      fn5(uniforms6);
      return;
    }
    const element3 = min3.max.y;
    min3.min.x -= 0.25;
    min3.min.z -= 0.25;
    min3.max.x += 0.25;
    min3.max.z += 0.25;
    const value68 = Math.max(min3.max.x - min3.min.x, 0.1);
    const value69 = Math.max(min3.max.z - min3.min.z, 0.1);
    const value70 = Math.min(enabled.resolution, setRenderTarget.capabilities.maxTextureSize);
    const {
      target: texture2,
      ping: texture3
    } = fn6(uniforms6, value70);
    const position3 = new RedFormat.OrthographicCamera(-value68 / 2, value68 / 2, value69 / 2, -value69 / 2, 0.001, enabled.maxHeight + 0.06);
    const value71 = (min3.min.x + min3.max.x) / 2;
    const value72 = (min3.min.z + min3.max.z) / 2;
    position3.position.set(value71, element3 - 0.06, value72);
    position3.up.set(0, 0, 1);
    position3.lookAt(value71, element3 + 1, value72);
    position3.updateMatrixWorld(true);
    const add = new RedFormat.Scene();
    const has3 = new Map();
    const push2 = [];
    const visible = new RedFormat.MeshDepthMaterial();
    visible.visible = false;
    const value73 = arg18 => isContactCasterMaterial(arg18) ? (has3.has(arg18) || has3.set(arg18, fn3(arg18)), has3.get(arg18)) : visible;
    for (const material5 of length2) {
      const material4 = material5.clone(false);
      material4.material = Array.isArray(material5.material) ? material5.material.map(value73) : value73(material5.material);
      material4.matrix.copy(material5.matrixWorld);
      material4.matrixWorld.copy(material5.matrixWorld);
      material4.matrixAutoUpdate = false;
      material4.matrixWorldAutoUpdate = true;
      material4.castShadow = false;
      material4.receiveShadow = false;
      material4.layers.set(0);
      material4.frustumCulled = false;
      add.add(material4);
      push2.push(material4);
    }
    const viewport = {
      target: setRenderTarget.getRenderTarget(),
      face: setRenderTarget.getActiveCubeFace(),
      mip: setRenderTarget.getActiveMipmapLevel(),
      clear: setRenderTarget.getClearColor(new RedFormat.Color()),
      alpha: setRenderTarget.getClearAlpha(),
      autoClear: setRenderTarget.autoClear,
      shadows: setRenderTarget.shadowMap.enabled,
      xr: setRenderTarget.xr.enabled,
      viewport: setRenderTarget.getViewport(new RedFormat.Vector4()),
      scissor: setRenderTarget.getScissor(new RedFormat.Vector4()),
      scissorTest: setRenderTarget.getScissorTest()
    };
    try {
      setRenderTarget.xr.enabled = false;
      setRenderTarget.shadowMap.enabled = false;
      setRenderTarget.autoClear = true;
      setRenderTarget.setScissorTest(false);
      setRenderTarget.setClearColor(0, 1);
      setRenderTarget.setRenderTarget(texture2);
      setRenderTarget.render(add, position3);
      casters2.capturePasses += 1;
      const value42 = arg14 => {
        uniforms9.uniforms.source.value = texture2.texture;
        uniforms9.uniforms.stepSize.value.set(enabled.blurMeters * arg14 / value68, 0);
        setRenderTarget.setRenderTarget(texture3);
        setRenderTarget.render(add2, value94);
        uniforms9.uniforms.source.value = texture3.texture;
        uniforms9.uniforms.stepSize.value.set(0, enabled.blurMeters * arg14 / value69);
        setRenderTarget.setRenderTarget(texture2);
        setRenderTarget.render(add2, value94);
      };
      value42(1);
      value42(0.4);
      if (enabled.surfaceEnabled) {
        fn7(uniforms6, length2, push2, add, min3, element3, visible);
      } else {
        uniforms6.uniforms.plan2SurfaceOpacity.value = 0;
      }
      uniforms6.uniforms.plan2ContactMap.value = texture2.texture;
      uniforms6.uniforms.plan2ContactBounds.value.set(min3.min.x, min3.min.z, value68, value69);
      uniforms6.uniforms.plan2ContactY.value = element3;
      uniforms6.uniforms.plan2ContactOpacity.value = enabled.enabled ? enabled.opacity : 0;
    } catch (value43) {
      fn5(uniforms6);
      throw value43;
    } finally {
      setRenderTarget.setViewport(viewport.viewport);
      setRenderTarget.setScissor(viewport.scissor);
      setRenderTarget.setScissorTest(viewport.scissorTest);
      setRenderTarget.setRenderTarget(viewport.target, viewport.face, viewport.mip);
      setRenderTarget.setClearColor(viewport.clear, viewport.alpha);
      setRenderTarget.autoClear = viewport.autoClear;
      setRenderTarget.shadowMap.enabled = viewport.shadows;
      setRenderTarget.xr.enabled = viewport.xr;
      visible.dispose();
      fn4();
      for (const dispose of push2) {
        if (dispose.isInstancedMesh) {
          dispose.dispose();
        }
        if (dispose.isBatchedMesh) {
          dispose.dispose();
        }
      }
      add.clear();
      uniforms9.uniforms.source.value = element4;
    }
  }
  function fn9(attributes2) {
    const version2 = attributes2.attributes.position?.version + ":" + attributes2.index?.version;
    const version3 = get3.get(attributes2);
    if (version3?.version === version2 && version3.position === attributes2.attributes.position && version3.index === attributes2.index) {
      return version3.key;
    }
    let key;
    if (attributes2.parameters && attributes2.attributes.position?.version === 0 && !(attributes2.index?.version > 0)) {
      try {
        key = JSON.stringify([attributes2.type, attributes2.parameters], (arg4, arg5) => arg4 === "uuid" ? undefined : arg5);
      } catch {}
    }
    if (!key) {
      const value44 = data => {
        if (!data) {
          return null;
        }
        const buffer = data.array || data.data?.array;
        if (!buffer) {
          return [data.count, data.version];
        }
        const value11 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        let value12 = 2166136261;
        let value13 = 3339675911;
        for (const value5 of value11) {
          value12 = Math.imul(value12 ^ value5, 16777619);
          value13 = Math.imul(value13 ^ value5, 2246822519);
        }
        return [data.itemSize, data.count, data.offset, data.data?.stride, value12 >>> 0, value13 >>> 0];
      };
      key = JSON.stringify([value44(attributes2.attributes.position), value44(attributes2.index), (attributes2.morphAttributes.position || []).map(value44), attributes2.groups, attributes2.drawRange]);
    }
    get3.set(attributes2, {
      version: version2,
      key,
      position: attributes2.attributes.position,
      index: attributes2.index
    });
    return key;
  }
  function fn10(receivers3, clone2) {
    const clone3 = clone2.clone().invert();
    const value74 = matrixWorld => {
      const value27 = clone3.clone().multiply(matrixWorld.matrixWorld);
      const value28 = elements => elements.elements.map(arg3 => Math.round(arg3 * 10000));
      if (!matrixWorld.isInstancedMesh) {
        return value28(value27);
      }
      const premultiply = new RedFormat.Matrix4();
      const push = [];
      for (let value14 = 0; value14 < matrixWorld.count; value14++) {
        matrixWorld.getMatrixAt(value14, premultiply);
        push.push(value28(premultiply.premultiply(value27)));
      }
      return push;
    };
    const value75 = map2 => map2.map(arg11 => JSON.stringify(arg11)).sort();
    return JSON.stringify([enabled, value75(receivers3.receivers.map(geometry => {
      const attributes = geometry.geometry;
      const version = attributes.attributes.position;
      const position = get4.get(attributes);
      if (!position || position.position !== version || position.version !== version?.version) {
        attributes.computeBoundingBox();
        get4.set(attributes, {
          position: version,
          version: version?.version,
          box: attributes.boundingBox?.clone()
        });
      }
      const min = get4.get(attributes).box?.clone().applyMatrix4(clone3.clone().multiply(geometry.matrixWorld));
      if (min) {
        return [...min.min.toArray(), ...min.max.toArray()].map(arg => Math.round(arg * 10000));
      } else {
        return null;
      }
    })), value75(receivers3.casters.map(material => {
      const every = (Array.isArray(material.material) ? material.material : [material.material]).map(alphaTest => {
        const value = alphaTest.alphaTest || 0;
        const value2 = alphaTest.displacementMap;
        const value3 = uuid => uuid ? [uuid.uuid, uuid.version] : null;
        return [isContactCasterMaterial(alphaTest), value, value > 0 ? value3(alphaTest.map) : null, value > 0 ? value3(alphaTest.alphaMap) : null, value3(value2), value2 ? alphaTest.displacementScale ?? 1 : 0, value2 ? alphaTest.displacementBias ?? 0 : 0];
      });
      const value8 = every.every(arg2 => JSON.stringify(arg2) === JSON.stringify(every[0]));
      return [fn9(material.geometry), material.isInstancedMesh ? material.count : null, material.morphTargetInfluences, value74(material), value8 ? every.slice(0, 1) : every];
    }))]);
  }
  const value95 = target3 => (target3.target ? target3.target.width * target3.target.height * (target3.target.texture.format === RedFormat.RedFormat ? 5 : 8) : 0) + (target3.ping ? target3.ping.width * target3.ping.height * (target3.ping.texture.format === RedFormat.RedFormat ? 1 : 4) : 0) + (target3.surface ? target3.surface.width * target3.surface.height * (target3.surface.texture.format === RedFormat.RedFormat ? 1 : 4) : 0) + (target3.lookup?.image?.data?.byteLength || 0);
  function fn11(ping2) {
    if (!ping2.target || !ping2.contentKey) {
      return;
    }
    const value76 = JSON.stringify([ping2.id, ping2.contentKey]);
    const value77 = entryMap.get(value76);
    if (value77) {
      fn5(value77);
    }
    ping2.ping?.dispose();
    ping2.ping = null;
    const value78 = {
      id: ping2.id,
      contentKey: ping2.contentKey,
      bakedFrame: ping2.bakedFrame,
      target: ping2.target,
      ping: ping2.ping,
      surface: ping2.surface,
      lookup: ping2.lookup,
      uniforms: Object.fromEntries(Object.entries(ping2.uniforms).map(([arg12, value6]) => [arg12, {
        value: value6.value?.clone && !value6.value.isTexture ? value6.value.clone() : value6.value
      }]))
    };
    entryMap.delete(value76);
    entryMap.set(value76, value78);
    ping2.target = ping2.ping = ping2.surface = ping2.lookup = null;
    ping2.uniforms.plan2ContactOpacity.value = ping2.uniforms.plan2SurfaceOpacity.value = 0;
    ping2.fade = null;
  }
  function fn12(uniforms7, arg37) {
    const value79 = JSON.stringify([uniforms7.id, arg37]);
    const uniforms8 = entryMap.get(value79);
    if (!uniforms8) {
      return false;
    }
    entryMap.delete(value79);
    fn11(uniforms7);
    for (const value51 of ["target", "ping", "surface", "lookup", "contentKey", "bakedFrame"]) {
      uniforms7[value51] = uniforms8[value51];
    }
    for (const [value52, value53] of Object.entries(uniforms8.uniforms)) {
      uniforms7.uniforms[value52].value = value53.value;
    }
    uniforms7.uniforms.plan2ContactOpacity.value = uniforms7.uniforms.plan2SurfaceOpacity.value = 0;
    return true;
  }
  function fn13(has4) {
    const value80 = [...values.values()].filter(target => target.target && !has4.has(target.id)).sort((lastUsed, lastUsed2) => (lastUsed2.lastUsed || 0) - (lastUsed.lastUsed || 0));
    let value81 = 0;
    let cachedFloors = 0;
    for (const ping of value80) {
      ping.ping?.dispose();
      ping.ping = null;
      const value45 = value95(ping);
      if (cachedFloors >= 2 || value81 + value45 > 33554432) {
        fn5(ping);
      } else {
        value81 += value45;
        cachedFloors++;
      }
    }
    let value82 = [...entryMap.values()].reduce((arg15, arg16) => arg15 + value95(arg16), 0);
    while (entryMap.size > 8 || value81 + value82 > 33554432) {
      const value46 = entryMap.keys().next().value;
      const value47 = entryMap.get(value46);
      if (!value47) {
        break;
      }
      value82 -= value95(value47);
      fn5(value47);
      entryMap.delete(value46);
    }
    casters2.cachedFloors = cachedFloors;
    casters2.cachedLayouts = entryMap.size;
    casters2.cachedBytes = value81 + value82;
  }
  function sync() {
    if (value87 || value88) {
      return;
    }
    for (const fade of values.values()) {
      if (fade.fade) {
        const value22 = Math.min(1, Math.max(0, (performance.now() - fade.fade.started) / 260));
        fade.uniforms.plan2ContactOpacity.value = fade.fade.from + (fade.fade.to - fade.fade.from) * value22;
        fade.uniforms.plan2SurfaceOpacity.value = fade.fade.fromSurface + (fade.fade.toSurface - fade.fade.fromSurface) * value22;
        if (value22 === 1) {
          fade.fade = null;
        } else {
          arg43();
        }
      }
    }
    fn2();
    const updateWorldMatrix = arg41();
    if (updateWorldMatrix !== value90) {
      for (const value29 of entryMap.values()) {
        fn5(value29);
      }
      entryMap.clear();
      value90 = updateWorldMatrix;
      value93 = false;
      value86 = true;
      clear.clear();
    }
    if (!value86 && !clear.size || value89 || !arg42() || !updateWorldMatrix) {
      return;
    }
    const value83 = value86;
    const has5 = new Set(clear);
    updateWorldMatrix.updateWorldMatrix(true, true);
    const has6 = new Map();
    updateWorldMatrix.traverse(material3 => {
      if (!material3.isMesh || !Oe(material3)) {
        return;
      }
      const value30 = String(oe(material3, "regionFloorId") ?? oe(material3, "floorId") ?? "default");
      if (!value83 && !has5.has(value30)) {
        return;
      }
      const value31 = material3.userData?.regionReceiverKind === "floor";
      const value32 = material3.castShadow && oe(material3, "modelLayer") === "items" && (Array.isArray(material3.material) ? material3.material : [material3.material]).some(isContactCasterMaterial);
      if (!!value31 || !!value32) {
        if (!has6.has(value30)) {
          has6.set(value30, {
            receivers: [],
            casters: []
          });
        }
        if (value31) {
          has6.get(value30).receivers.push(material3);
        }
        if (value32) {
          has6.get(value30).casters.push(material3);
        }
      }
    });
    for (const id3 of values.values()) {
      if (!value89 && (value83 || has5.has(id3.id)) && !has6.has(id3.id)) {
        if (value93) {
          id3.uniforms.plan2ContactOpacity.value = 0;
          id3.uniforms.plan2SurfaceOpacity.value = 0;
          id3.fade = null;
        } else {
          fn5(id3);
        }
        id3.casters = id3.instancedCasters = id3.receivers = 0;
      }
    }
    const push3 = [];
    let value84 = 0;
    for (const [value54, receivers2] of has6) {
      const uniforms2 = fn(value54);
      const matrixWorld2 = receivers2.receivers[0] || null;
      const bakedFrame = value91?.(value54)?.clone() || matrixWorld2?.matrixWorld.clone();
      const contentKey = bakedFrame ? fn10(receivers2, bakedFrame) : null;
      if (value93 && contentKey && uniforms2.contentKey !== contentKey) {
        fn12(uniforms2, contentKey);
      }
      const value48 = value93 && contentKey && uniforms2.target && uniforms2.contentKey === contentKey && uniforms2.bakedFrame;
      if (!value48 && value92 && value84 >= 1) {
        push3.push(value54);
        continue;
      }
      uniforms2.lastUsed = performance.now();
      const element = uniforms2.uniforms.plan2ContactOpacity.value;
      const element2 = uniforms2.uniforms.plan2SurfaceOpacity.value;
      if (value48) {
        casters2.cacheHits++;
        uniforms2.uniforms.plan2ContactOpacity.value = enabled.enabled ? enabled.opacity : 0;
        uniforms2.uniforms.plan2SurfaceOpacity.value = enabled.enabled && enabled.surfaceEnabled && uniforms2.surface ? enabled.surfaceOpacity : 0;
      } else {
        value84++;
        if (value93) {
          fn11(uniforms2);
        }
        fn8(uniforms2, receivers2.receivers, receivers2.casters);
        uniforms2.contentKey = contentKey;
        uniforms2.bakedFrame = bakedFrame;
        uniforms2.uniforms.plan2ContactTransform.value.identity();
      }
      if (uniforms2.fade) {
        uniforms2.fade.to = uniforms2.uniforms.plan2ContactOpacity.value;
        uniforms2.fade.toSurface = uniforms2.uniforms.plan2SurfaceOpacity.value;
        uniforms2.uniforms.plan2ContactOpacity.value = element;
        uniforms2.uniforms.plan2SurfaceOpacity.value = element2;
        arg43();
      } else if (value92 && element === 0 && uniforms2.uniforms.plan2ContactOpacity.value > 0) {
        uniforms2.fade = {
          started: performance.now(),
          from: element,
          fromSurface: element2,
          to: uniforms2.uniforms.plan2ContactOpacity.value,
          toSurface: uniforms2.uniforms.plan2SurfaceOpacity.value
        };
        uniforms2.uniforms.plan2ContactOpacity.value = element;
        uniforms2.uniforms.plan2SurfaceOpacity.value = element2;
        arg43();
      }
      uniforms2.anchor = matrixWorld2;
      uniforms2.casters = receivers2.casters.length;
      uniforms2.receivers = receivers2.receivers.length;
      uniforms2.instancedCasters = receivers2.casters.filter(isInstancedMesh => isInstancedMesh.isInstancedMesh).length;
    }
    fn2();
    fn13(value83 ? has6 : new Map([...values.values()].filter(receivers => receivers.receivers > 0).map(id => [id.id, true])));
    casters2.casters = casters2.instancedCasters = casters2.receivers = 0;
    for (const casters of values.values()) {
      casters2.casters += casters.casters;
      casters2.instancedCasters += casters.instancedCasters;
      casters2.receivers += casters.receivers;
    }
    casters2.floors = [...values.values()].filter(target2 => target2.target && target2.uniforms.plan2ContactOpacity.value > 0).length;
    casters2.builds += 1;
    value86 = false;
    clear.clear();
    push3.forEach(arg19 => clear.add(arg19));
    value92 = push3.length > 0;
    if (value92) {
      arg43();
    }
  }
  function dispose5() {
    if (!value87) {
      value87 = true;
      casters2.disposed = true;
      for (const value33 of values.values()) {
        fn5(value33);
      }
      for (const value34 of entryMap.values()) {
        fn5(value34);
      }
      entryMap.clear();
      clear.clear();
      value90 = null;
      values.clear();
      for (const dispose2 of get2.values()) {
        dispose2.dispose();
      }
      get2.clear();
      element4.dispose();
      frustumCulled.geometry.dispose();
      uniforms9.dispose();
    }
  }
  const __plan2Contact = {
    sync,
    invalidate,
    dispose: dispose5,
    stats: casters2,
    settings: enabled,
    setEnabled,
    setSuspended,
    setMotion,
    setFrameProvider(arg21) {
      value91 = arg21;
      invalidate();
    },
    getUniforms: arg20 => fn(arg20).uniforms
  };
  if (typeof window !== "undefined") {
    window.__plan2Contact = __plan2Contact;
  }
  return __plan2Contact;
}
