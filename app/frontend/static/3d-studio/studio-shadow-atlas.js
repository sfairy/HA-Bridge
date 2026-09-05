const ae = 1;
function fn(value, value2 = 0) {
  const value3 = Math.floor(Number(value));
  if (Number.isFinite(value3) && value3 > 0) {
    return value3;
  } else {
    return value2;
  }
}
function E(value) {
  let value2 = 1;
  const count = Math.max(1, Math.ceil(Number(value) || 1));
  while (value2 < count) {
    value2 *= 2;
  }
  return value2;
}
function J(value, value2, value3) {
  let value4 = value3;
  let value5 = value3;
  let value6 = 0;
  const value7 = [];
  for (const value8 of value) {
    const size = value8.size;
    if (value4 + size + value3 > value2) {
      value4 = value3;
      value5 += value6 + value3 * 2;
      value6 = 0;
    }
    if (value5 + size + value3 > value2) {
      return null;
    }
    value7.push({
      ...value8,
      x: value4,
      y: value5,
    });
    value4 += size + value3 * 2;
    value6 = Math.max(value6, size);
  }
  return value7;
}
export function packSpotShadowAtlasTiles(
  value = [],
  value2 = 4096,
  value3 = 1,
) {
  const value4 = fn(value2, 4096);
  const count = Math.max(0, Math.floor(Number(value3) || 0));
  const value5 = value
    .map((value7, index) => ({
      index: index,
      size: fn(value7),
    }))
    .filter((value7) => value7.size > 0 && value7.size + count * 2 <= value4)
    .sort(
      (value7, value8) =>
        value8.size - value7.size || value7.index - value8.index,
    );
  if (value5.length !== value.length) {
    return null;
  }
  if (!value5.length) {
    return {
      size: 1,
      tiles: [],
    };
  }
  const value6 = value5.reduce(
    (value7, value8) => value7 + (value8.size + count * 2) ** 2,
    0,
  );
  let size = E(Math.max(value5[0].size + count * 2, Math.sqrt(value6)));
  while (size <= value4) {
    const value7 = J(value5, size, count);
    if (value7) {
      const tiles = Array(value.length);
      for (const value8 of value7) {
        tiles[value8.index] = value8;
      }
      return {
        size: size,
        tiles: tiles,
      };
    }
    size *= 2;
  }
  return null;
}
function A(value) {
  const text = String(value?.userData?.lightFloorId || "");
  const text2 = String(value?.userData?.lightItemId || "");
  if (text2) {
    return text + ":" + text2;
  } else {
    return "";
  }
}
function U(value, { includeHidden: value2 = true } = {}) {
  const value3 = [];
  value?.traverse((value4) => {
    if (
      !!value4.isSpotLight &&
      value4.userData?.shadowCandidate === true &&
      !!A(value4) &&
      (!!value2 || value4.visible !== false) &&
      !(Number(value4.userData?.lightBrightness || 0) <= 0)
    ) {
      value3.push(value4);
    }
  });
  return value3;
}
function Q(value) {
  return (
    !!value &&
    (!!value.isMeshStandardMaterial ||
      !!value.isMeshPhysicalMaterial ||
      !!value.isMeshLambertMaterial ||
      !!value.isMeshPhongMaterial ||
      !!value.isMeshToonMaterial)
  );
}
function Y() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  uniform sampler2D userSpotShadowAtlas;\n  uniform float userSpotShadowAtlasEnabled;\n  uniform vec4 userSpotShadowRect[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowParams[ NUM_SPOT_LIGHTS ];\n  varying vec4 vUserSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  float getUserSpotAtlasShadow( vec4 atlasRect, vec4 shadowParams, vec4 shadowCoord ) {\n    if ( userSpotShadowAtlasEnabled < 0.5 || shadowParams.z < 0.5 ) return 1.0;\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowParams.x;\n    bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0\n      && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n    if ( ! inFrustum || shadowCoord.z > 1.0 ) return 1.0;\n    vec2 atlasUv = atlasRect.xy + clamp( shadowCoord.xy, 0.0, 1.0 ) * atlasRect.zw;\n    vec2 distribution = texture2D( userSpotShadowAtlas, atlasUv ).rg;\n    float mean = distribution.x;\n    // The stock VSM Chebyshev tail turns half-float depth steps from a\n    // 256px local-light map into several visible contour rings. Preserve the\n    // authored VSM blur, but use its deviation only to size one bounded edge\n    // transition. This keeps the same single texture sample and removes the\n    // long probability tail that made furniture shadows look layered.\n    float softness = clamp( abs( distribution.y ) * 0.35, 0.0007, 0.004 );\n    // A slope-scaled receiver guard keeps the newly bounded edge from\n    // exposing quantized self-shadow stripes on cabinet fronts and tabletops.\n    // It changes only the depth comparison, not the map resolution or sample\n    // count, and is capped tightly so real contact shadows stay attached.\n    // Cover the complete soft transition at equal depth, then add only a\n    // small slope allowance. This prevents the half-float map's depth bands\n    // from reappearing on large floors or through transparent glass, while\n    // keeping the allowance proportional to the authored penumbra.\n    float receiverGuard = softness + clamp( fwidth( shadowCoord.z ) * 1.5, 0.0002, 0.0015 );\n    #ifdef USE_REVERSED_DEPTH_BUFFER\n      float occludedDistance = mean - shadowCoord.z;\n    #else\n      float occludedDistance = shadowCoord.z - mean;\n    #endif\n    // The atlas contains only solid architectural occluders. Once a receiver\n    // is safely behind a wall, collapse the remaining VSM depth transition\n    // quickly instead of letting it extend through nearby cabinet backs and\n    // reveal half-float depth rows. The authored blur in atlas UV space still\n    // keeps the wall silhouette soft; this only removes light bleeding behind\n    // the blocker. Equality and the complete receiver guard remain lit.\n    float blockerTransition = max( softness * 0.5, 0.00035 );\n    float shadow = 1.0 - smoothstep(\n      receiverGuard,\n      receiverGuard + blockerTransition,\n      occludedDistance\n    );\n    return mix( 1.0, shadow, shadowParams.y );\n  }\n#endif\n";
}
function Z() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  uniform mat4 userSpotShadowMatrix[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowParams[ NUM_SPOT_LIGHTS ];\n  varying vec4 vUserSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n#endif\n";
}
function fn2() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  vec3 userShadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n  vec4 userShadowWorldPosition;\n  #pragma unroll_loop_start\n  for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n    userShadowWorldPosition = worldPosition + vec4( userShadowWorldNormal * userSpotShadowParams[ i ].w, 0.0 );\n    vUserSpotShadowCoord[ i ] = userSpotShadowMatrix[ i ] * userShadowWorldPosition;\n  }\n  #pragma unroll_loop_end\n#endif\n";
}
function ee(value) {
  const value2 =
    "\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )";
  const value3 =
    "\n    #if defined( USE_USER_SPOT_SHADOW_ATLAS )\n      directLight.color *= ( directLight.visible && receiveShadow )\n        ? getUserSpotAtlasShadow( userSpotShadowRect[ i ], userSpotShadowParams[ i ], vUserSpotShadowCoord[ i ] )\n        : 1.0;\n    #endif\n";
  const lights_fragment_begin = value.ShaderChunk.lights_fragment_begin;
  if (!lights_fragment_begin.includes(value2)) {
    throw new Error("当前 Three.js 灯光 Shader 与阴影图集不兼容。");
  }
  return lights_fragment_begin.replace(value2, "" + value3 + value2);
}
function te(value) {
  value?.shadow?.map?.dispose?.();
  value?.shadow?.mapPass?.dispose?.();
  if (value?.shadow) {
    value.shadow.map = null;
    value.shadow.mapPass = null;
  }
}
export function createSpotShadowAtlasController({
  THREE: spotShadowAtlasController,
  renderer: spotShadowAtlasController2,
  scene: spotShadowAtlasController3,
  camera: spotShadowAtlasController4,
  requestFrame: spotShadowAtlasController5 = () => {},
  canBuild: spotShadowAtlasController6 = () => true,
  buildDelay: spotShadowAtlasController7 = 80,
} = {}) {
  if (
    !spotShadowAtlasController ||
    !spotShadowAtlasController2 ||
    !spotShadowAtlasController3 ||
    !spotShadowAtlasController4
  ) {
    throw new Error("创建阴影图集时缺少 Three.js 渲染上下文。");
  }
  const value6 = {
    userSpotShadowAtlas: {
      value: null,
    },
    userSpotShadowAtlasEnabled: {
      value: 0,
    },
    userSpotShadowMatrix: {
      value: [],
    },
    userSpotShadowRect: {
      value: [],
    },
    userSpotShadowParams: {
      value: [],
    },
  };
  const value7 = ee(spotShadowAtlasController);
  const index = new Map();
  let value9 = null;
  let value10 = null;
  let value11 = new WeakSet();
  let value12 = null;
  let value13 = 0;
  let value14 = 0;
  let value15 = false;
  let value16 = true;
  function fn5(value17) {
    value6.userSpotShadowAtlasEnabled.value =
      value17 && value16 && index.size ? 1 : 0;
  }
  function fn6(value17) {
    if (!Q(value17) || value11.has(value17)) {
      return;
    }
    value11.add(value17);
    const onBeforeCompile = value17.onBeforeCompile;
    const value18 = value17.customProgramCacheKey?.bind(value17);
    value17.defines = {
      ...(value17.defines || {}),
      USE_USER_SPOT_SHADOW_ATLAS: 1,
    };
    value17.onBeforeCompile = (value19, value20) => {
      onBeforeCompile?.call(value17, value19, value20);
      Object.assign(value19.uniforms, value6);
      value19.vertexShader = value19.vertexShader
        .replace(
          "#include <shadowmap_pars_vertex>",
          "#include <shadowmap_pars_vertex>\n" + Z(),
        )
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>")
        .replace(
          "#include <shadowmap_vertex>",
          "#include <shadowmap_vertex>\n" + fn2(),
        );
      value19.fragmentShader = value19.fragmentShader
        .replace(
          "#include <shadowmap_pars_fragment>",
          "#include <shadowmap_pars_fragment>\n" + Y(),
        )
        .replace("#include <lights_fragment_begin>", value7);
    };
    value17.customProgramCacheKey = () =>
      (value18?.() || "") + "|user-spot-shadow-atlas-v6";
    value17.needsUpdate = true;
  }
  function prepareRoot(value17) {
    value17?.traverse((value18) => {
      if (!value18.isMesh || value18.receiveShadow === false) {
        return;
      }
      const list = Array.isArray(value18.material)
        ? value18.material
        : value18.material
          ? [value18.material]
          : [];
      for (const value19 of list) {
        fn6(value19);
      }
    });
  }
  function fn7(value17) {
    return U(value17, {
      includeHidden: false,
    });
  }
  function sync(value17 = value12) {
    prepareRoot(value17);
    const value18 = value6.userSpotShadowMatrix.value;
    const value19 = value6.userSpotShadowRect.value;
    const value20 = value6.userSpotShadowParams.value;
    value18.length = 0;
    value19.length = 0;
    value20.length = 0;
    for (const value21 of fn7(value17)) {
      const value22 = index.get(A(value21));
      value18.push(value22?.matrix || new spotShadowAtlasController.Matrix4());
      value19.push(value22?.rect || new spotShadowAtlasController.Vector4());
      value20.push(
        value22
          ? new spotShadowAtlasController.Vector4(
              value22.bias,
              value22.intensity,
              1,
              value22.normalBias,
            )
          : new spotShadowAtlasController.Vector4(0, 0, 0, 0),
      );
      value21.castShadow = false;
    }
    value6.userSpotShadowAtlas.value = value9?.texture || null;
    fn5(true);
    const length = value20.filter((value21) => value21.z > 0.5).length;
    spotShadowAtlasController2.domElement.dataset.activeSpotShadows =
      String(length);
    return length;
  }
  function fn8(value17) {
    const value18 = new spotShadowAtlasController.WebGLRenderTarget(
      value17,
      value17,
      {
        format: spotShadowAtlasController.RGFormat,
        type: spotShadowAtlasController.HalfFloatType,
        minFilter: spotShadowAtlasController.LinearFilter,
        magFilter: spotShadowAtlasController.LinearFilter,
        depthBuffer: false,
        stencilBuffer: false,
      },
    );
    value18.texture.name = "HA Bridge shared spot shadow atlas";
    value18.texture.generateMipmaps = false;
    return value18;
  }
  function fn9(value17) {
    const value18 = spotShadowAtlasController2.getRenderTarget();
    const value19 = spotShadowAtlasController2
      .getClearColor(new spotShadowAtlasController.Color())
      .clone();
    const value20 = spotShadowAtlasController2.getClearAlpha();
    spotShadowAtlasController2.setRenderTarget(value17);
    spotShadowAtlasController2.setClearColor(16777215, 1);
    spotShadowAtlasController2.clear(true, false, false);
    spotShadowAtlasController2.setRenderTarget(value18);
    spotShadowAtlasController2.setClearColor(value19, value20);
  }
  async function fn10() {
    if (globalThis.scheduler?.yield) {
      return globalThis.scheduler.yield();
    } else {
      return new Promise((value17) => setTimeout(value17, 0));
    }
  }
  async function fn11(value17, value18) {
    if (!value17 || value15 || value18 !== value14) {
      return;
    }
    if (!spotShadowAtlasController6()) {
      schedule(value17, {
        delay: 160,
      });
      return;
    }
    const value19 = U(value17);
    if (!value19.length) {
      index.clear();
      value9?.dispose?.();
      value9 = null;
      value6.userSpotShadowAtlas.value = null;
      fn5(false);
      spotShadowAtlasController5();
      return;
    }
    const value20 = fn(
      spotShadowAtlasController2.capabilities?.maxTextureSize,
      4096,
    );
    const value21 = value19.map((value27) =>
      fn(value27.shadow?.mapSize?.x, 256),
    );
    const value22 = packSpotShadowAtlasTiles(value21, value20);
    if (!value22) {
      throw new Error(
        "当前设备最大阴影图集 " +
          value20 +
          "px 无法容纳 " +
          value19.length +
          " 盏灯。",
      );
    }
    value15 = true;
    prepareRoot(value17);
    const value23 = fn8(value22.size);
    spotShadowAtlasController2.initRenderTarget(value23);
    fn9(value23);
    value10 ||= new spotShadowAtlasController.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
    });
    const index2 = new Map();
    const value25 = spotShadowAtlasController2.getRenderTarget();
    const value26 = value19.map((light) => ({
      light: light,
      visible: light.visible,
      intensity: light.intensity,
      castShadow: light.castShadow,
    }));
    fn5(false);
    try {
      for (const value27 of value26) {
        value27.light.visible = false;
        value27.light.castShadow = false;
      }
      for (let value27 = 0; value27 < value19.length; value27 += 1) {
        if (value18 !== value14) {
          return;
        }
        const value28 = value19[value27];
        const value29 = value22.tiles[value27];
        value28.visible = true;
        value28.intensity = Math.max(
          Number(value28.userData?.lightOnIntensity || value28.intensity || 1),
          0.001,
        );
        sync(value17);
        fn5(false);
        value28.castShadow = true;
        value28.shadow.autoUpdate = false;
        value28.shadow.needsUpdate = true;
        spotShadowAtlasController2.setRenderTarget(value10);
        spotShadowAtlasController2.render(
          spotShadowAtlasController3,
          spotShadowAtlasController4,
        );
        const texture = value28.shadow?.map?.texture;
        if (!texture) {
          throw new Error("灯光 " + A(value28) + " 未生成阴影贴图。");
        }
        spotShadowAtlasController2.copyTextureToTexture(
          texture,
          value23.texture,
          new spotShadowAtlasController.Box2(
            new spotShadowAtlasController.Vector2(0, 0),
            new spotShadowAtlasController.Vector2(value29.size, value29.size),
          ),
          new spotShadowAtlasController.Vector2(value29.x, value29.y),
        );
        const value30 = 0.5;
        index2.set(A(value28), {
          matrix: value28.shadow.matrix.clone(),
          rect: new spotShadowAtlasController.Vector4(
            (value29.x + value30) / value22.size,
            (value29.y + value30) / value22.size,
            Math.max(0, value29.size - value30 * 2) / value22.size,
            Math.max(0, value29.size - value30 * 2) / value22.size,
          ),
          bias: Number(value28.shadow.bias || 0),
          normalBias: Number(value28.shadow.normalBias || 0),
          intensity: Number(value28.shadow.intensity ?? 1),
        });
        value28.castShadow = false;
        value28.visible = false;
        te(value28);
        await fn10();
      }
      if (value18 !== value14) {
        return;
      }
      value9?.dispose?.();
      value9 = value23;
      index.clear();
      for (const [value27, value28] of index2) {
        index.set(value27, value28);
      }
      value6.userSpotShadowAtlas.value = value9.texture;
      const domElement = spotShadowAtlasController2.domElement;
      domElement.dataset.spotShadowMode = "atlas";
      domElement.dataset.spotShadowAtlasSize = String(value22.size);
      domElement.dataset.spotShadowAtlasLights = String(index.size);
    } finally {
      spotShadowAtlasController2.setRenderTarget(value25);
      for (const value27 of value26) {
        value27.light.visible = value27.visible;
        value27.light.intensity = value27.intensity;
        value27.light.castShadow = false;
      }
      if (value9 !== value23) {
        value23.dispose();
      }
      value15 = false;
      sync(value17);
      spotShadowAtlasController5();
    }
  }
  function schedule(
    value17,
    { delay: value18 = spotShadowAtlasController7 } = {},
  ) {
    value12 = value17;
    prepareRoot(value17);
    for (const value20 of U(value17)) {
      value20.castShadow = false;
    }
    sync(value17);
    value14 += 1;
    const value19 = value14;
    clearTimeout(value13);
    value13 = setTimeout(
      () => {
        value13 = 0;
        fn11(value17, value19).catch((value20) => {
          console.error(value20);
          spotShadowAtlasController2.domElement.dataset.spotShadowMode =
            "fallback";
        });
      },
      Math.max(0, Number(value18) || 0),
    );
    return U(value17).length;
  }
  function setEnabled(value17) {
    value16 = value17 !== false;
    fn5(true);
    spotShadowAtlasController5();
  }
  return {
    prepareRoot: prepareRoot,
    schedule: schedule,
    sync: sync,
    setEnabled: setEnabled,
    activeCount: () => index.size,
    isBuilding: () => value15,
  };
}
