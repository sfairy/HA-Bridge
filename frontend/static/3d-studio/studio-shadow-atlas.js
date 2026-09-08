import { createRenderLightIndex } from "../modules/interaction3d/render-light-index.js?v=20260907-focus-work-v1";
const DEFAULT_ATLAS_PADDING = 1;
function positiveInt(value, fallback = 0) {
  const parsed = Math.floor(Number(value));
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  } else {
    return fallback;
  }
}
function nextPowerOfTwo(value) {
  let size = 1;
  const target = Math.max(1, Math.ceil(Number(value) || 1));
  while (size < target) {
    size *= 2;
  }
  return size;
}
function packRowTiles(tiles, atlasSize, padding) {
  let cursorX = padding;
  let cursorY = padding;
  let rowHeight = 0;
  const packed = [];
  for (const tile of tiles) {
    const tileSize = tile.size;
    if (cursorX + tileSize + padding > atlasSize) {
      cursorX = padding;
      cursorY += rowHeight + padding * 2;
      rowHeight = 0;
    }
    if (cursorY + tileSize + padding > atlasSize) {
      return null;
    }
    packed.push({
      ...tile,
      x: cursorX,
      y: cursorY,
    });
    cursorX += tileSize + padding * 2;
    rowHeight = Math.max(rowHeight, tileSize);
  }
  return packed;
}
export function packSpotShadowAtlasTiles(sizes = [], maxAtlasSize = 4096, padding = DEFAULT_ATLAS_PADDING) {
  const atlasCap = positiveInt(maxAtlasSize, 4096);
  const tilePadding = Math.max(0, Math.floor(Number(padding) || 0));
  const sortedTiles = sizes
    .map((size, index) => ({
      index,
      size: positiveInt(size),
    }))
    .filter((tile) => tile.size > 0 && tile.size + tilePadding * 2 <= atlasCap)
    .sort((left, right) => right.size - left.size || left.index - right.index);
  if (sortedTiles.length !== sizes.length) {
    return null;
  }
  if (!sortedTiles.length) {
    return {
      size: 1,
      tiles: [],
    };
  }
  const areaEstimate = sortedTiles.reduce(
    (sum, tile) => sum + (tile.size + tilePadding * 2) ** 2,
    0,
  );
  let atlasSize = nextPowerOfTwo(
    Math.max(sortedTiles[0].size + tilePadding * 2, Math.sqrt(areaEstimate)),
  );
  while (atlasSize <= atlasCap) {
    const packed = packRowTiles(sortedTiles, atlasSize, tilePadding);
    if (packed) {
      const tilesByIndex = Array(sizes.length);
      for (const tile of packed) {
        tilesByIndex[tile.index] = tile;
      }
      return {
        size: atlasSize,
        tiles: tilesByIndex,
      };
    }
    atlasSize *= 2;
  }
  return null;
}
function lightIdentityKey(light) {
  const floorId = String(light?.userData?.lightFloorId || "");
  const itemId = String(light?.userData?.lightItemId || "");
  if (itemId) {
    return floorId + ":" + itemId;
  } else {
    return "";
  }
}
function collectShadowCandidateSpots(root, { includeHidden = true } = {}) {
  const lights = [];
  root?.traverse((object) => {
    if (
      !!object.isSpotLight &&
      object.userData?.shadowCandidate === true &&
      !!lightIdentityKey(object) &&
      (!!includeHidden || object.visible !== false) &&
      (!(Number(object.userData?.lightBrightness || 0) <= 0) ||
        object.userData?.prewarmShadow === true)
    ) {
      lights.push(object);
    }
  });
  return lights;
}
function supportsUserSpotShadowMaterial(material) {
  return (
    !!material &&
    (!!material.isMeshStandardMaterial ||
      !!material.isMeshPhysicalMaterial ||
      !!material.isMeshLambertMaterial ||
      !!material.isMeshPhongMaterial ||
      !!material.isMeshToonMaterial)
  );
}
function userSpotShadowFragmentHelpers() {
  // Shadow coords used to be a per-spot varying array. That quickly exceeds
  // MAX_VARYING_VECTORS once a floor has more than a handful of fixtures.
  // Pass world position + normal once, then build each light's shadow coord
  // in the fragment stage from the matching atlas matrix.
  return "\n#if NUM_SPOT_LIGHTS > 0\n  uniform sampler2D userSpotShadowAtlas;\n  uniform float userSpotShadowAtlasEnabled;\n  uniform mat4 userSpotShadowMatrix[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowRect[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowParams[ NUM_SPOT_LIGHTS ];\n  varying vec3 vUserSpotShadowWorldPosition;\n  varying vec3 vUserSpotShadowWorldNormal;\n\n  float getUserSpotAtlasShadow( vec4 atlasRect, vec4 shadowParams, mat4 shadowMatrix ) {\n    if ( userSpotShadowAtlasEnabled < 0.5 || shadowParams.z < 0.5 ) return 1.0;\n    vec4 shadowCoord = shadowMatrix * vec4( vUserSpotShadowWorldPosition + vUserSpotShadowWorldNormal * shadowParams.w, 1.0 );\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowParams.x;\n    bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0\n      && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n    if ( ! inFrustum || shadowCoord.z > 1.0 ) return 1.0;\n    vec2 atlasUv = atlasRect.xy + clamp( shadowCoord.xy, 0.0, 1.0 ) * atlasRect.zw;\n    vec2 distribution = texture2D( userSpotShadowAtlas, atlasUv ).rg;\n    float mean = distribution.x;\n    // The stock VSM Chebyshev tail turns half-float depth steps from a\n    // 256px local-light map into several visible contour rings. Preserve the\n    // authored VSM blur, but use its deviation only to size one bounded edge\n    // transition. This keeps the same single texture sample and removes the\n    // long probability tail that made furniture shadows look layered.\n    float softness = clamp( abs( distribution.y ) * 0.35, 0.0007, 0.004 );\n    // A slope-scaled receiver guard keeps the newly bounded edge from\n    // exposing quantized self-shadow stripes on cabinet fronts and tabletops.\n    // It changes only the depth comparison, not the map resolution or sample\n    // count, and is capped tightly so real contact shadows stay attached.\n    // Cover the complete soft transition at equal depth, then add only a\n    // small slope allowance. This prevents the half-float map's depth bands\n    // from reappearing on large floors or through transparent glass, while\n    // keeping the allowance proportional to the authored penumbra.\n    float receiverGuard = softness + clamp( fwidth( shadowCoord.z ) * 1.5, 0.0002, 0.0015 );\n    #ifdef USE_REVERSED_DEPTH_BUFFER\n      float occludedDistance = mean - shadowCoord.z;\n    #else\n      float occludedDistance = shadowCoord.z - mean;\n    #endif\n    // The atlas contains only solid architectural occluders. Once a receiver\n    // is safely behind a wall, collapse the remaining VSM depth transition\n    // quickly instead of letting it extend through nearby cabinet backs and\n    // reveal half-float depth rows. The authored blur in atlas UV space still\n    // keeps the wall silhouette soft; this only removes light bleeding behind\n    // the blocker. Equality and the complete receiver guard remain lit.\n    float blockerTransition = max( softness * 0.5, 0.00035 );\n    float shadow = 1.0 - smoothstep(\n      receiverGuard,\n      receiverGuard + blockerTransition,\n      occludedDistance\n    );\n    return mix( 1.0, shadow, shadowParams.y );\n  }\n#endif\n";
}
function userSpotShadowVertexPars() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  varying vec3 vUserSpotShadowWorldPosition;\n  varying vec3 vUserSpotShadowWorldNormal;\n#endif\n";
}
function userSpotShadowVertexBody() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  vUserSpotShadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n  #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined( USE_SHADOWMAP ) || defined( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n    vUserSpotShadowWorldPosition = worldPosition.xyz;\n  #else\n    vUserSpotShadowWorldPosition = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;\n  #endif\n#endif\n";
}
export function guardZeroContributionSpotLights(shaderSource) {
  const spotBlockStart = shaderSource.indexOf("#if ( NUM_SPOT_LIGHTS > 0 )");
  const dirBlockStart = shaderSource.indexOf("#if ( NUM_DIR_LIGHTS > 0 )", spotBlockStart);
  const directCall =
    "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );";
  const spotBlock = shaderSource.slice(spotBlockStart, dirBlockStart);
  if (spotBlockStart < 0 || dirBlockStart < 0 || spotBlock.split(directCall).length !== 2) {
    throw new Error("当前 Three.js 聚光灯反射 Shader 与零贡献优化不兼容。");
  }
  const guardedCall =
    "\n    #ifdef HB_SKIP_ZERO_SPOT_LIGHT\n      if ( any( notEqual( directLight.color, vec3( 0.0 ) ) ) ) {\n    #endif\n      " +
    directCall +
    "\n    #ifdef HB_SKIP_ZERO_SPOT_LIGHT\n      }\n    #endif";
  return shaderSource.slice(0, spotBlockStart) + spotBlock.replace(directCall, guardedCall) + shaderSource.slice(dirBlockStart);
}
function patchLightsFragmentBegin(THREE) {
  const shadowGuard =
    "\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )";
  const atlasSample =
    "\n    #if defined( USE_USER_SPOT_SHADOW_ATLAS )\n      directLight.color *= ( directLight.visible && receiveShadow )\n        ? getUserSpotAtlasShadow( userSpotShadowRect[ i ], userSpotShadowParams[ i ], userSpotShadowMatrix[ i ] )\n        : 1.0;\n    #endif\n";
  const lightsFragmentBegin = THREE.ShaderChunk.lights_fragment_begin;
  if (!lightsFragmentBegin.includes(shadowGuard)) {
    throw new Error("当前 Three.js 灯光 Shader 与阴影图集不兼容。");
  }
  return guardZeroContributionSpotLights(lightsFragmentBegin.replace(shadowGuard, "" + atlasSample + shadowGuard));
}
function disposeLightShadowMaps(light) {
  light?.shadow?.map?.dispose?.();
  light?.shadow?.mapPass?.dispose?.();
  if (light?.shadow) {
    light.shadow.map = null;
    light.shadow.mapPass = null;
  }
}
export function createSpotShadowAtlasController({
  THREE,
  renderer,
  scene,
  camera,
  requestFrame = () => {},
  canBuild = () => true,
  buildDelay = 80,
  syncBeforeRender = false,
} = {}) {
  if (!THREE || !renderer || !scene || !camera) {
    throw new Error("创建阴影图集时缺少 Three.js 渲染上下文。");
  }
  const uniforms = {
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
  const patchedLightsFragmentBegin = patchLightsFragmentBegin(THREE);
  const atlasEntries = new Map();
  let atlasTarget = null;
  let scratchTarget = null;
  let patchedMaterials = new WeakSet();
  let scheduledRoot = null;
  let buildTimer = 0;
  let buildGeneration = 0;
  let building = false;
  let atlasEnabled = true;
  let lastSyncedLights = null;
  let lastSyncedEntries = [];
  let syncLightScratch = [];
  let syncEntryScratch = [];
  const fallbackMatrix = new THREE.Matrix4();
  const fallbackVector4 = new THREE.Vector4();
  const lightIndex = syncBeforeRender ? createRenderLightIndex() : null;
  let lightIndexStatsKey = "";
  function setAtlasEnabledUniform(enabled) {
    uniforms.userSpotShadowAtlasEnabled.value = enabled && atlasEnabled && atlasEntries.size ? 1 : 0;
  }
  function patchMaterial(material) {
    if (!supportsUserSpotShadowMaterial(material) || patchedMaterials.has(material)) {
      return;
    }
    patchedMaterials.add(material);
    const previousOnBeforeCompile = material.onBeforeCompile;
    const previousCacheKey = material.customProgramCacheKey?.bind(material);
    material.defines = {
      ...(material.defines || {}),
      USE_USER_SPOT_SHADOW_ATLAS: 1,
    };
    if (syncBeforeRender && material.isMeshStandardMaterial) {
      material.defines.HB_SKIP_ZERO_SPOT_LIGHT = 1;
    }
    material.onBeforeCompile = (shader, rendererRef) => {
      previousOnBeforeCompile?.call(material, shader, rendererRef);
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <shadowmap_pars_vertex>",
          "#include <shadowmap_pars_vertex>\n" + userSpotShadowVertexPars(),
        )
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>")
        .replace(
          "#include <shadowmap_vertex>",
          "#include <shadowmap_vertex>\n" + userSpotShadowVertexBody(),
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <shadowmap_pars_fragment>",
          "#include <shadowmap_pars_fragment>\n" + userSpotShadowFragmentHelpers(),
        )
        .replace("#include <lights_fragment_begin>", patchedLightsFragmentBegin);
    };
    material.customProgramCacheKey = () =>
      (previousCacheKey?.() || "") + "|user-spot-shadow-atlas-v8-frag-shadow-coord";
    material.needsUpdate = true;
  }
  function prepareRoot(root) {
    root?.traverse((object) => {
      if (!object.isMesh || object.receiveShadow === false) {
        return;
      }
      const materials = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : [];
      for (const material of materials) {
        patchMaterial(material);
      }
    });
  }
  function visibleShadowLights(root) {
    return collectShadowCandidateSpots(root, {
      includeHidden: false,
    });
  }
  function sync(root = scheduledRoot) {
    prepareRoot(root);
    lastSyncedLights = null;
    const matrices = uniforms.userSpotShadowMatrix.value;
    const rects = uniforms.userSpotShadowRect.value;
    const params = uniforms.userSpotShadowParams.value;
    matrices.length = 0;
    rects.length = 0;
    params.length = 0;
    for (const light of visibleShadowLights(root)) {
      const entry = atlasEntries.get(lightIdentityKey(light));
      matrices.push(entry?.matrix || new THREE.Matrix4());
      rects.push(entry?.rect || new THREE.Vector4());
      params.push(
        entry
          ? new THREE.Vector4(entry.bias, entry.intensity, 1, entry.normalBias)
          : new THREE.Vector4(0, 0, 0, 0),
      );
      light.castShadow = false;
    }
    uniforms.userSpotShadowAtlas.value = atlasTarget?.texture || null;
    setAtlasEnabledUniform(true);
    const activeCount = params.filter((param) => param.z > 0.5).length;
    renderer.domElement.dataset.activeSpotShadows = String(activeCount);
    return activeCount;
  }
  function syncOrderedLights(sceneRoot, cameraRef) {
    if (!syncBeforeRender || !sceneRoot) {
      return;
    }
    const orderedLights = syncLightScratch;
    const orderedEntries = syncEntryScratch;
    orderedLights.length = orderedEntries.length = 0;
    for (const light of lightIndex.read(sceneRoot, cameraRef)) {
      orderedLights.push(light);
    }
    const statsKey = lightIndex.stats.builds + ":" + lightIndex.stats.sorts;
    if (statsKey !== lightIndexStatsKey) {
      lightIndexStatsKey = statsKey;
      renderer.domElement.dataset.lightIndexBuilds = String(lightIndex.stats.builds);
      renderer.domElement.dataset.lightIndexSorts = String(lightIndex.stats.sorts);
    }
    let unchanged = lastSyncedLights?.length === orderedLights.length;
    for (let index = 0; index < orderedLights.length; index++) {
      orderedEntries.push(atlasEntries.get(lightIdentityKey(orderedLights[index])));
      if (orderedLights[index] !== lastSyncedLights?.[index] || orderedEntries[index] !== lastSyncedEntries[index]) {
        unchanged = false;
      }
    }
    if (unchanged) {
      return;
    }
    syncLightScratch = lastSyncedLights || [];
    syncEntryScratch = lastSyncedEntries;
    lastSyncedLights = orderedLights;
    lastSyncedEntries = orderedEntries;
    const matrices = uniforms.userSpotShadowMatrix.value;
    const rects = uniforms.userSpotShadowRect.value;
    const params = uniforms.userSpotShadowParams.value;
    matrices.length = rects.length = params.length = 0;
    for (const entry of orderedEntries) {
      matrices.push(entry?.matrix || fallbackMatrix);
      rects.push(entry?.rect || fallbackVector4);
      params.push(
        entry
          ? (entry.uniformParams ||= new THREE.Vector4(
              entry.bias,
              entry.intensity,
              1,
              entry.normalBias,
            ))
          : fallbackVector4,
      );
    }
  }
  function createAtlasRenderTarget(size) {
    const target = new THREE.WebGLRenderTarget(size, size, {
      format: THREE.RGFormat,
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    target.texture.name = "HA Bridge shared spot shadow atlas";
    target.texture.generateMipmaps = false;
    return target;
  }
  function clearAtlasTarget(target) {
    const previousTarget = renderer.getRenderTarget();
    const previousColor = renderer.getClearColor(new THREE.Color()).clone();
    const previousAlpha = renderer.getClearAlpha();
    renderer.setRenderTarget(target);
    renderer.setClearColor(16777215, 1);
    renderer.clear(true, false, false);
    renderer.setRenderTarget(previousTarget);
    renderer.setClearColor(previousColor, previousAlpha);
  }
  async function yieldFrame() {
    if (globalThis.scheduler?.yield) {
      return globalThis.scheduler.yield();
    } else {
      return new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  async function buildAtlas(root, generation) {
    if (!root || building || generation !== buildGeneration) {
      return;
    }
    if (!canBuild()) {
      schedule(root, {
        delay: 160,
      });
      return;
    }
    const lights = collectShadowCandidateSpots(root);
    if (!lights.length) {
      atlasEntries.clear();
      atlasTarget?.dispose?.();
      atlasTarget = null;
      uniforms.userSpotShadowAtlas.value = null;
      setAtlasEnabledUniform(false);
      requestFrame();
      return;
    }
    const maxTextureSize = positiveInt(renderer.capabilities?.maxTextureSize, 4096);
    const mapSizes = lights.map((light) => positiveInt(light.shadow?.mapSize?.x, 256));
    const packedAtlas = packSpotShadowAtlasTiles(mapSizes, maxTextureSize);
    if (!packedAtlas) {
      throw new Error(
        "当前设备最大阴影图集 " +
          maxTextureSize +
          "px 无法容纳 " +
          lights.length +
          " 盏灯。",
      );
    }
    building = true;
    prepareRoot(root);
    const nextAtlas = createAtlasRenderTarget(packedAtlas.size);
    renderer.initRenderTarget(nextAtlas);
    clearAtlasTarget(nextAtlas);
    scratchTarget ||= new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
    });
    const nextEntries = new Map();
    const previousTarget = renderer.getRenderTarget();
    const lightSnapshots = lights.map((light) => ({
      light,
      visible: light.visible,
      intensity: light.intensity,
      castShadow: light.castShadow,
    }));
    setAtlasEnabledUniform(false);
    try {
      for (const snapshot of lightSnapshots) {
        snapshot.light.visible = false;
        snapshot.light.castShadow = false;
      }
      for (let index = 0; index < lights.length; index += 1) {
        if (generation !== buildGeneration) {
          return;
        }
        const light = lights[index];
        const tile = packedAtlas.tiles[index];
        light.visible = true;
        light.intensity = Math.max(
          Number(light.userData?.lightOnIntensity || light.intensity || 1),
          0.001,
        );
        sync(root);
        setAtlasEnabledUniform(false);
        light.castShadow = true;
        light.shadow.autoUpdate = false;
        light.shadow.needsUpdate = true;
        renderer.setRenderTarget(scratchTarget);
        renderer.render(scene, camera);
        const shadowTexture = light.shadow?.map?.texture;
        if (!shadowTexture) {
          throw new Error("灯光 " + lightIdentityKey(light) + " 未生成阴影贴图。");
        }
        renderer.copyTextureToTexture(
          shadowTexture,
          nextAtlas.texture,
          new THREE.Box2(
            new THREE.Vector2(0, 0),
            new THREE.Vector2(tile.size, tile.size),
          ),
          new THREE.Vector2(tile.x, tile.y),
        );
        const edgeInset = 0.5;
        nextEntries.set(lightIdentityKey(light), {
          matrix: light.shadow.matrix.clone(),
          rect: new THREE.Vector4(
            (tile.x + edgeInset) / packedAtlas.size,
            (tile.y + edgeInset) / packedAtlas.size,
            Math.max(0, tile.size - edgeInset * 2) / packedAtlas.size,
            Math.max(0, tile.size - edgeInset * 2) / packedAtlas.size,
          ),
          bias: Number(light.shadow.bias || 0),
          normalBias: Number(light.shadow.normalBias || 0),
          intensity: Number(light.shadow.intensity ?? 1),
        });
        light.castShadow = false;
        light.visible = false;
        disposeLightShadowMaps(light);
        await yieldFrame();
      }
      if (generation !== buildGeneration) {
        return;
      }
      atlasTarget?.dispose?.();
      atlasTarget = nextAtlas;
      atlasEntries.clear();
      for (const [key, entry] of nextEntries) {
        atlasEntries.set(key, entry);
      }
      uniforms.userSpotShadowAtlas.value = atlasTarget.texture;
      const dom = renderer.domElement;
      dom.dataset.spotShadowMode = "atlas";
      dom.dataset.spotShadowAtlasSize = String(packedAtlas.size);
      dom.dataset.spotShadowAtlasLights = String(atlasEntries.size);
    } finally {
      renderer.setRenderTarget(previousTarget);
      for (const snapshot of lightSnapshots) {
        snapshot.light.visible = snapshot.visible;
        snapshot.light.intensity = snapshot.intensity;
        snapshot.light.castShadow = false;
      }
      if (atlasTarget !== nextAtlas) {
        nextAtlas.dispose();
      }
      building = false;
      sync(root);
      requestFrame();
    }
  }
  function schedule(root, { delay = buildDelay } = {}) {
    scheduledRoot = root;
    prepareRoot(root);
    for (const light of collectShadowCandidateSpots(root)) {
      light.castShadow = false;
    }
    sync(root);
    buildGeneration += 1;
    const generation = buildGeneration;
    clearTimeout(buildTimer);
    buildTimer = setTimeout(
      () => {
        buildTimer = 0;
        buildAtlas(root, generation).catch((error) => {
          console.error(error);
          renderer.domElement.dataset.spotShadowMode = "fallback";
        });
      },
      Math.max(0, Number(delay) || 0),
    );
    return collectShadowCandidateSpots(root).length;
  }
  function setEnabled(enabled) {
    atlasEnabled = enabled !== false;
    setAtlasEnabledUniform(true);
    requestFrame();
  }
  if (syncBeforeRender) {
    const previousOnBeforeRender = scene.onBeforeRender;
    scene.onBeforeRender = function (...args) {
      previousOnBeforeRender?.apply(this, args);
      syncOrderedLights(args[1] || scene, args[2] || camera);
    };
  }
  return {
    prepareRoot,
    schedule,
    sync,
    setEnabled,
    activeCount: () => atlasEntries.size,
    isBuilding: () => building,
    isPending: () => !!buildTimer,
    releaseRenderIndex: () => lightIndex?.dispose(),
  };
}
