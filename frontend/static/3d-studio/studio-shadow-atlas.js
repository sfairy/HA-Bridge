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
      y: cursorY
    });
    cursorX += tileSize + padding * 2;
    rowHeight = Math.max(rowHeight, tileSize);
  }
  return packed;
}
export function packSpotShadowAtlasTiles(sizes = [], maxAtlasSize = 4096, padding = DEFAULT_ATLAS_PADDING) {
  const atlasCap = positiveInt(maxAtlasSize, 4096);
  const tilePadding = Math.max(0, Math.floor(Number(padding) || 0));
  const sortedTiles = sizes.map((size, index) => ({
    index,
    size: positiveInt(size)
  })).filter(tile => tile.size > 0 && tile.size + tilePadding * 2 <= atlasCap).sort((left, right) => right.size - left.size || left.index - right.index);
  if (sortedTiles.length !== sizes.length) {
    return null;
  }
  if (!sortedTiles.length) {
    return {
      size: 1,
      tiles: []
    };
  }
  const areaEstimate = sortedTiles.reduce((sum, tile) => sum + (tile.size + tilePadding * 2) ** 2, 0);
  let atlasSize = nextPowerOfTwo(Math.max(sortedTiles[0].size + tilePadding * 2, Math.sqrt(areaEstimate)));
  while (atlasSize <= atlasCap) {
    const packed = packRowTiles(sortedTiles, atlasSize, tilePadding);
    if (packed) {
      const tilesByIndex = Array(sizes.length);
      for (const tile of packed) {
        tilesByIndex[tile.index] = tile;
      }
      return {
        size: atlasSize,
        tiles: tilesByIndex
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
function collectShadowCandidateSpots(root, {
  includeHidden = true
} = {}) {
  const lights = [];
  root?.traverse(object => {
    if (!!object.isSpotLight && object.userData?.shadowCandidate === true && !!lightIdentityKey(object) && (!!includeHidden || object.visible !== false) && (!(Number(object.userData?.lightBrightness || 0) <= 0) || object.userData?.prewarmShadow === true)) {
      lights.push(object);
    }
  });
  return lights;
}
function supportsUserSpotShadowMaterial(material) {
  return !!material && (!!material.isMeshStandardMaterial || !!material.isMeshPhysicalMaterial || !!material.isMeshLambertMaterial || !!material.isMeshPhongMaterial || !!material.isMeshToonMaterial);
}
function userSpotShadowFragmentHelpers() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  uniform sampler2D userSpotShadowAtlas;\n  uniform float userSpotShadowAtlasEnabled;\n  uniform vec4 userSpotShadowRect[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowParams[ NUM_SPOT_LIGHTS ];\n  varying vec4 vUserSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  float getUserSpotAtlasShadow( vec4 atlasRect, vec4 shadowParams, vec4 shadowCoord ) {\n    if ( userSpotShadowAtlasEnabled < 0.5 || shadowParams.z < 0.5 ) return 1.0;\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowParams.x;\n    bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0\n      && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n    if ( ! inFrustum || shadowCoord.z > 1.0 ) return 1.0;\n    vec2 atlasUv = atlasRect.xy + clamp( shadowCoord.xy, 0.0, 1.0 ) * atlasRect.zw;\n    vec2 distribution = texture2D( userSpotShadowAtlas, atlasUv ).rg;\n    float mean = distribution.x;\n    // The stock VSM Chebyshev tail turns half-float depth steps from a\n    // 256px local-light map into several visible contour rings. Preserve the\n    // authored VSM blur, but use its deviation only to size one bounded edge\n    // transition. This keeps the same single texture sample and removes the\n    // long probability tail that made furniture shadows look layered.\n    float softness = clamp( abs( distribution.y ) * 0.35, 0.0007, 0.004 );\n    // A slope-scaled receiver guard keeps the newly bounded edge from\n    // exposing quantized self-shadow stripes on cabinet fronts and tabletops.\n    // It changes only the depth comparison, not the map resolution or sample\n    // count, and is capped tightly so real contact shadows stay attached.\n    // Cover the complete soft transition at equal depth, then add only a\n    // small slope allowance. This prevents the half-float map's depth bands\n    // from reappearing on large floors or through transparent glass, while\n    // keeping the allowance proportional to the authored penumbra.\n    float receiverGuard = softness + clamp( fwidth( shadowCoord.z ) * 1.5, 0.0002, 0.0015 );\n    #ifdef USE_REVERSED_DEPTH_BUFFER\n      float occludedDistance = mean - shadowCoord.z;\n    #else\n      float occludedDistance = shadowCoord.z - mean;\n    #endif\n    // The atlas contains only solid architectural occluders. Once a receiver\n    // is safely behind a wall, collapse the remaining VSM depth transition\n    // quickly instead of letting it extend through nearby cabinet backs and\n    // reveal half-float depth rows. The authored blur in atlas UV space still\n    // keeps the wall silhouette soft; this only removes light bleeding behind\n    // the blocker. Equality and the complete receiver guard remain lit.\n    float blockerTransition = max( softness * 0.5, 0.00035 );\n    float shadow = 1.0 - smoothstep(\n      receiverGuard,\n      receiverGuard + blockerTransition,\n      occludedDistance\n    );\n    return mix( 1.0, shadow, shadowParams.y );\n  }\n#endif\n";
}
function userSpotShadowVertexPars() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  uniform mat4 userSpotShadowMatrix[ NUM_SPOT_LIGHTS ];\n  uniform vec4 userSpotShadowParams[ NUM_SPOT_LIGHTS ];\n  varying vec4 vUserSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n#endif\n";
}
function userSpotShadowVertexBody() {
  return "\n#if NUM_SPOT_LIGHTS > 0\n  vec3 userShadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n  vec4 userShadowWorldPosition;\n  #pragma unroll_loop_start\n  for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n    userShadowWorldPosition = worldPosition + vec4( userShadowWorldNormal * userSpotShadowParams[ i ].w, 0.0 );\n    vUserSpotShadowCoord[ i ] = userSpotShadowMatrix[ i ] * userShadowWorldPosition;\n  }\n  #pragma unroll_loop_end\n#endif\n";
}
function spotLightBlockRange(shaderSource) {
  const spotBlockStart = shaderSource.indexOf("#if ( NUM_SPOT_LIGHTS > 0 )");
  if (spotBlockStart < 0) {
    return null;
  }
  // Close the spot block at its own #endif (r186+ may insert NUM_SUN_LIGHTS
  // before NUM_DIR_LIGHTS; do not slice through sibling light loops).
  const loopEnd = shaderSource.indexOf("#pragma unroll_loop_end", spotBlockStart);
  if (loopEnd < 0) {
    return null;
  }
  const spotEndif = shaderSource.indexOf("#endif", loopEnd);
  if (spotEndif < 0) {
    return null;
  }
  const nextLightBlock = shaderSource.indexOf("#if ( NUM_", spotEndif + "#endif".length);
  const spotBlockEnd = nextLightBlock >= 0 ? nextLightBlock : spotEndif + "#endif".length;
  return {
    start: spotBlockStart,
    end: spotBlockEnd
  };
}
export function guardZeroContributionSpotLights(shaderSource) {
  const range = spotLightBlockRange(shaderSource);
  const directCall = "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );";
  const spotBlock = range ? shaderSource.slice(range.start, range.end) : "";
  if (!range || spotBlock.split(directCall).length !== 2) {
    throw new Error("当前 Three.js 聚光灯反射 Shader 与零贡献优化不兼容。");
  }
  const guardedCall = "\n    #ifdef HB_SKIP_ZERO_SPOT_LIGHT\n      if ( any( notEqual( directLight.color, vec3( 0.0 ) ) ) ) {\n    #endif\n      " + directCall + "\n    #ifdef HB_SKIP_ZERO_SPOT_LIGHT\n      }\n    #endif";
  return shaderSource.slice(0, range.start) + spotBlock.replace(directCall, guardedCall) + shaderSource.slice(range.end);
}
function patchLightsFragmentBegin(THREE) {
  const shadowGuard = "\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )";
  const atlasSample = "\n    #if defined( USE_USER_SPOT_SHADOW_ATLAS )\n      directLight.color *= ( directLight.visible && receiveShadow )\n        ? getUserSpotAtlasShadow( userSpotShadowRect[ i ], userSpotShadowParams[ i ], vUserSpotShadowCoord[ i ] )\n        : 1.0;\n    #endif\n";
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
function isObjectWithin(object, ancestor) {
  let cursor = object;
  while (cursor) {
    if (cursor === ancestor) {
      return true;
    }
    cursor = cursor.parent;
  }
  return false;
}
// The atlas bakes by rendering the shared scene graph once per light. Three.js
// only collects a light for the shadow pass when it is reachable from the render
// root, visible through every ancestor and matched by the render camera layers.
// Lights authored on a hidden floor group or on a dedicated layer (region
// lighting moves user spots to layer 30) would otherwise be skipped by the pass
// and leave light.shadow.map null. Force those three conditions for the bake and
// restore them immediately afterwards so nothing leaks into the live frame.
function isolateLightForBake(light, scene, camera) {
  const restores = [];
  const cameraMask = Number(camera?.layers?.mask);
  const lightMask = Number(light?.layers?.mask);
  // Three.js only requires the two masks to share one bit (Layers.test uses
  // `!== 0`), so widen only when there is no overlap at all.
  if (Number.isFinite(cameraMask) && Number.isFinite(lightMask) && (lightMask & cameraMask) === 0) {
    const appliedMask = lightMask | cameraMask;
    restores.push(() => {
      // Only undo our own widening; another system may have re-scoped the light
      // while the bake render was running.
      if (light.layers.mask === appliedMask) {
        light.layers.mask = lightMask;
      }
    });
    light.layers.mask = appliedMask;
  }
  let node = light?.parent;
  while (node && node !== scene) {
    if (node.visible === false) {
      const hiddenAncestor = node;
      restores.push(() => {
        hiddenAncestor.visible = false;
      });
      hiddenAncestor.visible = true;
    }
    node = node.parent;
  }
  return () => {
    for (let index = restores.length - 1; index >= 0; index -= 1) {
      restores[index]();
    }
  };
}
function describeUnbakeableLight(light, scene, camera) {
  let hiddenAncestor = null;
  let node = light?.parent;
  while (node && node !== scene) {
    if (node.visible === false) {
      hiddenAncestor = node.name || node.uuid || "group";
      break;
    }
    node = node.parent;
  }
  return {
    inScene: isObjectWithin(light, scene),
    visible: light?.visible !== false,
    hiddenAncestor,
    layers: light?.layers?.mask,
    cameraLayers: camera?.layers?.mask,
    castShadow: light?.castShadow,
    hasMap: !!light?.shadow?.map,
    mapSize: light?.shadow?.mapSize ? [light.shadow.mapSize.x, light.shadow.mapSize.y] : null
  };
}
export function createSpotShadowAtlasController({
  THREE,
  renderer,
  scene,
  camera,
  requestFrame = () => {},
  canBuild = () => true,
  buildDelay = 80,
  syncBeforeRender = false
} = {}) {
  if (!THREE || !renderer || !scene || !camera) {
    throw new Error("创建阴影图集时缺少 Three.js 渲染上下文。");
  }
  const uniforms = {
    userSpotShadowAtlas: {
      value: null
    },
    userSpotShadowAtlasEnabled: {
      value: 0
    },
    userSpotShadowMatrix: {
      value: []
    },
    userSpotShadowRect: {
      value: []
    },
    userSpotShadowParams: {
      value: []
    }
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
  let rebuildPending = false;
  let disposed = false;
  let atlasEnabled = true;
  const warnedUnbakeableLights = new Set();
  let previousOrderedLights = null;
  let previousOrderedEntries = [];
  let orderedLightsScratch = [];
  let orderedEntriesScratch = [];
  const emptyMatrix = new THREE.Matrix4();
  const emptyVector = new THREE.Vector4();
  const lightIndex = syncBeforeRender ? createRenderLightIndex() : null;
  let lightIndexStatsKey = "";
  function setAtlasEnabledUniform(enabled) {
    uniforms.userSpotShadowAtlasEnabled.value = enabled && atlasEnabled && atlasEntries.size ? 1 : 0;
  }
  function patchMaterial(material) {
    if (!supportsUserSpotShadowMaterial(material) || patchedMaterials.has(material)) {
      return;
    }
    if (material.environmentSourceMaterial && patchedMaterials.has(material.environmentSourceMaterial) && material.defines?.USE_USER_SPOT_SHADOW_ATLAS === 1) {
      patchedMaterials.add(material);
      return;
    }
    patchedMaterials.add(material);
    const previousOnBeforeCompile = material.onBeforeCompile;
    const previousCacheKey = material.customProgramCacheKey?.bind(material);
    material.defines = {
      ...(material.defines || {}),
      USE_USER_SPOT_SHADOW_ATLAS: 1
    };
    if (syncBeforeRender && material.isMeshStandardMaterial) {
      material.defines.HB_SKIP_ZERO_SPOT_LIGHT = 1;
    }
    material.onBeforeCompile = (shader, rendererRef) => {
      previousOnBeforeCompile?.call(material, shader, rendererRef);
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader.replace("#include <shadowmap_pars_vertex>", "#include <shadowmap_pars_vertex>\n" + userSpotShadowVertexPars()).replace("#include <worldpos_vertex>", "#include <worldpos_vertex>").replace("#include <shadowmap_vertex>", "#include <shadowmap_vertex>\n" + userSpotShadowVertexBody());
      shader.fragmentShader = shader.fragmentShader.replace("#include <shadowmap_pars_fragment>", "#include <shadowmap_pars_fragment>\n" + userSpotShadowFragmentHelpers()).replace("#include <lights_fragment_begin>", patchedLightsFragmentBegin);
    };
    material.customProgramCacheKey = () => (previousCacheKey?.() || "") + "|user-spot-shadow-atlas-v7-zero-contribution";
    material.needsUpdate = true;
  }
  function prepareRoot(root) {
    if (!disposed) {
      root?.traverse(material => {
        if (!material.isMesh || material.receiveShadow === false) {
          return;
        }
        const materials = Array.isArray(material.material) ? material.material : material.material ? [material.material] : [];
        for (const mat of materials) {
          patchMaterial(mat);
        }
      });
    }
  }
  function visibleShadowLights(root) {
    return collectShadowCandidateSpots(root, {
      includeHidden: false
    });
  }
  function sync(root = scheduledRoot) {
    if (disposed) {
      return 0;
    }
    prepareRoot(root);
    previousOrderedLights = null;
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
      params.push(entry ? new THREE.Vector4(entry.bias, entry.intensity, 1, entry.normalBias) : new THREE.Vector4(0, 0, 0, 0));
      light.castShadow = false;
    }
    uniforms.userSpotShadowAtlas.value = atlasTarget?.texture || null;
    setAtlasEnabledUniform(true);
    const activeCount = params.filter(param => param.z > 0.5).length;
    renderer.domElement.dataset.activeSpotShadows = String(activeCount);
    return activeCount;
  }
  function syncOrderedLights(sceneRoot, cameraRef) {
    if (disposed || !syncBeforeRender || !sceneRoot) {
      return;
    }
    const orderedLights = orderedLightsScratch;
    const orderedEntries = orderedEntriesScratch;
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
    let unchanged = previousOrderedLights?.length === orderedLights.length;
    for (let index = 0; index < orderedLights.length; index++) {
      orderedEntries.push(atlasEntries.get(lightIdentityKey(orderedLights[index])));
      if (orderedLights[index] !== previousOrderedLights?.[index] || orderedEntries[index] !== previousOrderedEntries[index]) {
        unchanged = false;
      }
    }
    if (unchanged) {
      return;
    }
    orderedLightsScratch = previousOrderedLights || [];
    orderedEntriesScratch = previousOrderedEntries;
    previousOrderedLights = orderedLights;
    previousOrderedEntries = orderedEntries;
    const matrices = uniforms.userSpotShadowMatrix.value;
    const rects = uniforms.userSpotShadowRect.value;
    const params = uniforms.userSpotShadowParams.value;
    matrices.length = rects.length = params.length = 0;
    for (const entry of orderedEntries) {
      matrices.push(entry?.matrix || emptyMatrix);
      rects.push(entry?.rect || emptyVector);
      params.push(entry ? entry.uniformParams ||= new THREE.Vector4(entry.bias, entry.intensity, 1, entry.normalBias) : emptyVector);
    }
  }
  function createAtlasRenderTarget(size) {
    const target = new THREE.WebGLRenderTarget(size, size, {
      format: THREE.RGFormat,
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false
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
      return new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  let buildFailures = 0;
  const MAX_BUILD_FAILURES = 3;
  async function buildAtlas(root, generation) {
    if (disposed || building || generation !== buildGeneration) {
      return;
    }
    if (!root) {
      rebuildPending = false;
      return;
    }
    if (!canBuild()) {
      scheduleBuildDelay(160);
      return;
    }
    rebuildPending = false;
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
    const mapSizes = lights.map(light => positiveInt(light.shadow?.mapSize?.x, 256));
    const packedAtlas = packSpotShadowAtlasTiles(mapSizes, maxTextureSize);
    if (!packedAtlas) {
      throw new Error("当前设备最大阴影图集 " + maxTextureSize + "px 无法容纳 " + lights.length + " 盏灯。");
    }
    let texture = null;
    let skippedLightCount = 0;
    const nextEntries = new Map();
    const previousTarget = renderer.getRenderTarget();
    const previousCubeFace = renderer.getActiveCubeFace?.() ?? 0;
    const previousMip = renderer.getActiveMipmapLevel?.() ?? 0;
    const lightSnapshots = lights.map(light => ({
      light,
      visible: light.visible,
      intensity: light.intensity,
      castShadow: light.castShadow,
      shadowAutoUpdate: light.shadow?.autoUpdate,
      shadowNeedsUpdate: light.shadow?.needsUpdate,
      shadowIntensity: light.shadow?.intensity
    }));
    const restoreLightSnapshots = () => {
      for (const snapshot of lightSnapshots) {
        snapshot.light.visible = snapshot.visible;
        snapshot.light.intensity = snapshot.intensity;
        snapshot.light.castShadow = false;
        if (snapshot.light.shadow) {
          snapshot.light.shadow.autoUpdate = snapshot.shadowAutoUpdate;
          snapshot.light.shadow.needsUpdate = snapshot.shadowNeedsUpdate;
          if (snapshot.shadowIntensity !== undefined) {
            snapshot.light.shadow.intensity = snapshot.shadowIntensity;
          }
        }
      }
    };
    const hideCandidateLights = () => {
      for (const snapshot of lightSnapshots) {
        snapshot.light.visible = false;
        snapshot.light.castShadow = false;
      }
    };
    building = true;
    try {
      prepareRoot(root);
      texture = createAtlasRenderTarget(packedAtlas.size);
      renderer.initRenderTarget(texture);
      clearAtlasTarget(texture);
      scratchTarget ||= new THREE.WebGLRenderTarget(1, 1, {
        depthBuffer: true,
        stencilBuffer: false
      });
      setAtlasEnabledUniform(false);
      root.updateWorldMatrix?.(true, true);
      hideCandidateLights();
      for (let index = 0; index < lights.length; index += 1) {
        if (generation !== buildGeneration) {
          return;
        }
        const light = lights[index];
        const tile = packedAtlas.tiles[index];
        const snapshot = lightSnapshots[index];
        light.visible = true;
        light.intensity = Math.max(Number(light.userData?.lightOnIntensity || light.intensity || 1), 0.001);
        sync(root);
        setAtlasEnabledUniform(false);
        light.castShadow = true;
        light.shadow.autoUpdate = false;
        light.shadow.needsUpdate = true;
        light.target?.updateWorldMatrix?.(true, false);
        light.updateWorldMatrix?.(true, false);
        const restoreBakeContext = isolateLightForBake(light, scene, camera);
        // Floor transitions temporarily force shadowMap.autoUpdate/needsUpdate both
        // false, which makes Three.js skip the entire shadow pass. Force a bake via
        // renderer.render so currentRenderState.lights exists (required by r182
        // setProgram). Direct shadowMap.render outside a frame crashes on null lights.
        const bakeShadowEnabled = renderer.shadowMap.enabled;
        const bakeShadowAutoUpdate = renderer.shadowMap.autoUpdate;
        try {
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.autoUpdate = false;
          renderer.shadowMap.needsUpdate = true;
          renderer.setRenderTarget(scratchTarget);
          renderer.render(scene, camera);
        } finally {
          restoreBakeContext();
          // Revert only when still at bake values so a concurrent floor-motion
          // toggle is not overwritten with a stale pre-bake snapshot.
          if (renderer.shadowMap.enabled === true) {
            renderer.shadowMap.enabled = bakeShadowEnabled;
          }
          if (renderer.shadowMap.autoUpdate === false) {
            renderer.shadowMap.autoUpdate = bakeShadowAutoUpdate;
          }
        }
        const shadowTexture = light.shadow?.map?.texture;
        if (!shadowTexture) {
          // A single un-bakeable light (detached from the render root, or authored
          // on a floor/camera layer the bake camera cannot see) must not discard
          // the whole atlas and force the no-shadow fallback. Skip it, keep the
          // remaining lights shadowed, and report the cause once.
          const unbakeableKey = lightIdentityKey(light);
          skippedLightCount += 1;
          if (!warnedUnbakeableLights.has(unbakeableKey)) {
            warnedUnbakeableLights.add(unbakeableKey);
            console.warn("[3D] 灯光 " + unbakeableKey + " 无法生成阴影贴图，已跳过该灯光的图集写入。", describeUnbakeableLight(light, scene, camera));
          }
          light.castShadow = false;
          light.visible = false;
          disposeLightShadowMaps(light);
          restoreLightSnapshots();
          await yieldFrame();
          if (generation !== buildGeneration) {
            return;
          }
          hideCandidateLights();
          continue;
        }
        renderer.copyTextureToTexture(shadowTexture, texture.texture, new THREE.Box2(new THREE.Vector2(0, 0), new THREE.Vector2(tile.size, tile.size)), new THREE.Vector2(tile.x, tile.y));
        const edgeInset = 0.5;
        const snapIntensity = Number(snapshot.shadowIntensity ?? 1);
        const liveIntensity = Number(light.shadow.intensity ?? 1);
        nextEntries.set(lightIdentityKey(light), {
          tile: {
            ...tile
          },
          matrix: light.shadow.matrix.clone(),
          rect: new THREE.Vector4((tile.x + edgeInset) / packedAtlas.size, (tile.y + edgeInset) / packedAtlas.size, Math.max(0, tile.size - edgeInset * 2) / packedAtlas.size, Math.max(0, tile.size - edgeInset * 2) / packedAtlas.size),
          bias: Number(light.shadow.bias || 0),
          normalBias: Number(light.shadow.normalBias || 0),
          // Prefer pre-bake snapshot so floor-motion zeros are not authored into the atlas.
          intensity: snapIntensity > 0 ? snapIntensity : liveIntensity > 0 ? liveIntensity : 1
        });
        light.castShadow = false;
        light.visible = false;
        disposeLightShadowMaps(light);
        // Restore authored visibility before yielding so the live frame loop does not
        // render a blacked-out light set mid-bake.
        restoreLightSnapshots();
        await yieldFrame();
        if (generation !== buildGeneration) {
          return;
        }
        hideCandidateLights();
      }
      if (generation !== buildGeneration) {
        return;
      }
      if (!nextEntries.size) {
        // Nothing at all could be baked (the whole light set is detached from the
        // render root, or every light was skipped). Reuse the retry/fallback path
        // so per-light shadows take over instead of silently losing all shadows.
        throw new Error("候选灯光（" + lights.length + " 盏）均无法生成阴影贴图，回退到逐灯阴影。");
      }
      atlasTarget?.dispose?.();
      atlasTarget = texture;
      atlasEntries.clear();
      for (const [key, entry] of nextEntries) {
        atlasEntries.set(key, entry);
      }
      uniforms.userSpotShadowAtlas.value = atlasTarget.texture;
      buildFailures = 0;
      const dom = renderer.domElement;
      dom.dataset.spotShadowMode = "atlas";
      dom.dataset.spotShadowAtlasSize = String(packedAtlas.size);
      dom.dataset.spotShadowAtlasLights = String(atlasEntries.size);
      dom.dataset.spotShadowAtlasSkipped = String(skippedLightCount);
      if (!skippedLightCount) {
        // Everything baked, so a future skip is a new problem worth reporting.
        warnedUnbakeableLights.clear();
      }
    } finally {
      renderer.setRenderTarget(previousTarget, previousCubeFace, previousMip);
      restoreLightSnapshots();
      if (atlasTarget !== texture) {
        texture?.dispose();
      }
      building = false;
      if (disposed) {
        disposeAtlas();
      } else {
        sync(scheduledRoot);
        if (rebuildPending && !buildTimer) {
          scheduleBuildDelay(0);
        }
        requestFrame();
      }
    }
  }
  function scheduleBuildDelay(enabled) {
    if (!disposed && !!rebuildPending) {
      clearTimeout(buildTimer);
      buildTimer = setTimeout(() => {
        buildTimer = 0;
        if (!disposed && !building && !!rebuildPending) {
          buildAtlas(scheduledRoot, buildGeneration).catch(error => {
            if (disposed) {
              return;
            }
            console.error(error);
            buildFailures += 1;
            if (buildFailures < MAX_BUILD_FAILURES) {
              rebuildPending = true;
              scheduleBuildDelay(320 * buildFailures);
              return;
            }
            renderer.domElement.dataset.spotShadowMode = "fallback";
            rebuildPending = false;
            requestFrame();
          });
        }
      }, Math.max(0, Number(enabled) || 0));
    }
  }
  function scheduleRebuild(root, {
    delay = buildDelay
  } = {}) {
    if (disposed) {
      return 0;
    }
    scheduledRoot = root;
    prepareRoot(root);
    for (const light of collectShadowCandidateSpots(root)) {
      light.castShadow = false;
    }
    sync(root);
    buildGeneration += 1;
    rebuildPending = true;
    buildFailures = 0;
    if (renderer.domElement.dataset.spotShadowMode === "fallback") {
      delete renderer.domElement.dataset.spotShadowMode;
    }
    scheduleBuildDelay(delay);
    return collectShadowCandidateSpots(root).length;
  }
  let lastRefreshRoot = null;
  let lastRefreshGeneration = -1;
  let lastLightIndexBuilds = -1;
  let list = [];
  function refreshGeometry(traverse = scheduledRoot, filter = null) {
    if (disposed) {
      return true;
    }
    if (building || buildTimer || rebuildPending) {
      return false;
    }
    if (!atlasTarget || !atlasEntries.size) {
      return true;
    }
    const lightIndexBuilds = lightIndex?.stats.builds || 0;
    if (lastRefreshRoot !== traverse || lastRefreshGeneration !== buildGeneration || lastLightIndexBuilds !== lightIndexBuilds) {
      lastRefreshRoot = traverse;
      lastRefreshGeneration = buildGeneration;
      lastLightIndexBuilds = lightIndexBuilds;
      list = [];
      traverse?.traverse(isSpotLight => {
        if (isSpotLight.isSpotLight && isSpotLight.shadow && atlasEntries.has(lightIdentityKey(isSpotLight))) {
          list.push(isSpotLight);
        }
      });
    }
    const some = filter === null ? null : filter.filter(isBox => isBox?.isBox3 && !isBox.isEmpty());
    const push = [];
    traverse?.updateWorldMatrix(true, true);
    for (const shadow of list) {
      const tile = atlasEntries.get(lightIdentityKey(shadow));
      if (tile?.tile) {
        shadow.target?.updateWorldMatrix(true, false);
        shadow.shadow.updateMatrices(shadow);
        if (!some || !!some.some(box => shadow.shadow.getFrustum().intersectsBox(box))) {
          push.push({
            light: shadow,
            entry: tile,
            matrix: shadow.shadow.matrix.clone(),
            cast: shadow.castShadow,
            visible: shadow.visible,
            autoUpdate: shadow.shadow.autoUpdate,
            needsUpdate: shadow.shadow.needsUpdate,
            map: shadow.shadow.map,
            mapPass: shadow.shadow.mapPass
          });
        }
      }
    }
    if (!push.length) {
      return true;
    }
    const enabled = {
      target: renderer.getRenderTarget(),
      face: renderer.getActiveCubeFace(),
      mip: renderer.getActiveMipmapLevel(),
      viewport: renderer.getViewport(new THREE.Vector4()),
      scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(),
      clear: renderer.getClearColor(new THREE.Color()),
      alpha: renderer.getClearAlpha(),
      enabled: renderer.shadowMap.enabled,
      autoUpdate: renderer.shadowMap.autoUpdate,
      needsUpdate: renderer.shadowMap.needsUpdate
    };
    try {
      renderer.shadowMap.enabled = true;
      for (const texture of push) {
        const {
          light: shadow
        } = texture;
        try {
          shadow.castShadow = true;
          shadow.visible = true;
          shadow.shadow.autoUpdate = false;
          shadow.shadow.needsUpdate = true;
          renderer.shadowMap.needsUpdate = true;
          renderer.shadowMap.render([shadow], scene, camera);
          if (!shadow.shadow.map?.texture) {
            return false;
          }
          texture.texture = shadow.shadow.map.texture;
          texture.matrix.copy(shadow.shadow.matrix);
        } finally {
          shadow.castShadow = texture.cast;
          shadow.visible = texture.visible;
        }
      }
      for (const {
        texture: shadowTexture,
        entry: tile,
        matrix: shadowMatrix
      } of push) {
        const size = tile.tile;
        renderer.copyTextureToTexture(shadowTexture, atlasTarget.texture, new THREE.Box2(new THREE.Vector2(0, 0), new THREE.Vector2(size.size, size.size)), new THREE.Vector2(size.x, size.y));
        tile.matrix.copy(shadowMatrix);
      }
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      for (const map of push) {
        const {
          light: shadow
        } = map;
        shadow.castShadow = map.cast;
        shadow.visible = map.visible;
        shadow.shadow.autoUpdate = map.autoUpdate;
        shadow.shadow.needsUpdate = map.needsUpdate;
        if (shadow.shadow.map !== map.map) {
          shadow.shadow.map?.dispose();
        }
        if (shadow.shadow.mapPass !== map.mapPass) {
          shadow.shadow.mapPass?.dispose();
        }
        shadow.shadow.map = map.map;
        shadow.shadow.mapPass = map.mapPass;
      }
      renderer.shadowMap.enabled = enabled.enabled;
      renderer.shadowMap.autoUpdate = enabled.autoUpdate;
      renderer.shadowMap.needsUpdate = enabled.needsUpdate;
      renderer.setViewport(enabled.viewport);
      renderer.setScissor(enabled.scissor);
      renderer.setScissorTest(enabled.scissorTest);
      renderer.setRenderTarget(enabled.target, enabled.face, enabled.mip);
      renderer.setClearColor(enabled.clear, enabled.alpha);
    }
    renderer.domElement.dataset.curtainShadowUpdates = String(Number(renderer.domElement.dataset.curtainShadowUpdates || 0) + 1);
    return true;
  }
  function setAtlasEnabled(enabled) {
    if (!disposed) {
      atlasEnabled = enabled !== false;
      setAtlasEnabledUniform(true);
      requestFrame();
    }
  }
  function disposeAtlas() {
    atlasTarget?.dispose();
    scratchTarget?.dispose();
    atlasTarget = null;
    scratchTarget = null;
    atlasEntries.clear();
    uniforms.userSpotShadowAtlas.value = null;
    setAtlasEnabledUniform(false);
  }
  function dispose() {
    if (!disposed) {
      disposed = true;
      buildGeneration += 1;
      rebuildPending = false;
      clearTimeout(buildTimer);
      buildTimer = 0;
      scheduledRoot = null;
      lightIndex?.dispose();
      lastRefreshRoot = null;
      list = [];
      previousOrderedLights = null;
      previousOrderedEntries = [];
      orderedLightsScratch = [];
      orderedEntriesScratch = [];
      if (!building) {
        disposeAtlas();
      }
    }
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
    refreshGeometry,
    schedule: scheduleRebuild,
    sync,
    setEnabled: setAtlasEnabled,
    dispose,
    activeCount: () => atlasEntries.size,
    isBuilding: () => building,
    isPending: () => !!buildTimer || rebuildPending,
    releaseRenderIndex: () => lightIndex?.dispose()
  };
}
