function findUserDataInAncestors(startObject3d, userDataKey) {
  for (
    let ancestorObject3d = startObject3d;
    ancestorObject3d;
    ancestorObject3d = ancestorObject3d.parent
  ) {
    if (ancestorObject3d.userData?.[userDataKey] !== undefined) {
      return ancestorObject3d.userData[userDataKey];
    }
  }
}
function isVisibleWithAncestors(rootObject3d) {
  for (let ancestorNode = rootObject3d; ancestorNode; ancestorNode = ancestorNode.parent) {
    if (!ancestorNode.visible) {
      return false;
    }
  }
  return true;
}
export function isContactCasterMaterial(material) {
  return (
    !!material &&
    material.visible !== false &&
    !!(material.opacity >= 0.98) &&
    !(material.transmission > 0) &&
    (!material.transparent || !!(material.alphaTest > 0))
  );
}
export function surfaceBakeLevels(three, meshes, baseY, maxLevels = 32) {
  return computeSurfaceLevels(three, meshes, baseY, maxLevels).map(level => level.height);
}
function computeSurfaceLevels(threeLib, meshList, floorY, levelLimit = 32) {
  const levelsByHeightKey = new Map();
  const vertexA = new threeLib.Vector3();
  const vertexB = new threeLib.Vector3();
  const vertexC = new threeLib.Vector3();
  const edgeAB = new threeLib.Vector3();
  const edgeAC = new threeLib.Vector3();
  const faceNormal = new threeLib.Vector3();
  const meshMatrix = new threeLib.Matrix4();
  const instanceMatrix = new threeLib.Matrix4();
  for (const mesh of meshList) {
    const materialList = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (
      materialList.length &&
      materialList.every(materialEntry => materialEntry?.userData?.plan2SurfaceContact === false)
    ) {
      continue;
    }
    const geometry = mesh.geometry;
    const positionAttribute = geometry?.attributes?.position;
    if (!positionAttribute) {
      continue;
    }
    const indexAttribute = geometry.index;
    const vertexCount = indexAttribute?.count ?? positionAttribute.count;
    const drawStart = geometry.drawRange.start;
    const drawEnd = Math.min(vertexCount, drawStart + geometry.drawRange.count);
    for (
      let instanceIndex = 0;
      instanceIndex < (mesh.isInstancedMesh ? mesh.count : 1);
      instanceIndex++
    ) {
      meshMatrix.copy(mesh.matrixWorld);
      if (mesh.isInstancedMesh) {
        mesh.getMatrixAt(instanceIndex, instanceMatrix);
        meshMatrix.multiply(instanceMatrix);
      }
      for (let vertexCursor = drawStart; vertexCursor + 2 < drawEnd; vertexCursor += 3) {
        vertexA
          .fromBufferAttribute(
            positionAttribute,
            indexAttribute ? indexAttribute.getX(vertexCursor) : vertexCursor
          )
          .applyMatrix4(meshMatrix);
        vertexB
          .fromBufferAttribute(
            positionAttribute,
            indexAttribute ? indexAttribute.getX(vertexCursor + 1) : vertexCursor + 1
          )
          .applyMatrix4(meshMatrix);
        vertexC
          .fromBufferAttribute(
            positionAttribute,
            indexAttribute ? indexAttribute.getX(vertexCursor + 2) : vertexCursor + 2
          )
          .applyMatrix4(meshMatrix);
        faceNormal.crossVectors(
          edgeAB.subVectors(vertexB, vertexA),
          edgeAC.subVectors(vertexC, vertexA)
        );
        const triangleArea = faceNormal.length() * 0.5;
        const surfaceHeight = (vertexA.y + vertexB.y + vertexC.y) / 3 - floorY;
        if (triangleArea < 0.004 || faceNormal.y < triangleArea * 1.98 || surfaceHeight <= 0.12) {
          continue;
        }
        const heightKey = Math.round(surfaceHeight * 100);
        const bundledLevel = levelsByHeightKey.get(heightKey) || {
          height: 0,
          area: 0,
          top: -Infinity
        };
        bundledLevel.height += surfaceHeight * triangleArea;
        bundledLevel.area += triangleArea;
        bundledLevel.top = Math.max(
          bundledLevel.top,
          vertexA.y - floorY,
          vertexB.y - floorY,
          vertexC.y - floorY
        );
        levelsByHeightKey.set(heightKey, bundledLevel);
      }
    }
  }
  return [...levelsByHeightKey.values()]
    .sort((levelA, levelB) => levelB.area - levelA.area)
    .slice(0, levelLimit)
    .map(levelEntry => ({
      height: levelEntry.height / levelEntry.area,
      top: levelEntry.top
    }))
    .sort((levelLeft, levelRight) => levelLeft.height - levelRight.height);
}
export function createContactShadowController({
  THREE: THREE,
  renderer: renderer,
  getRoot: getRoot,
  canBuild: canBuild = () => true,
  requestFrame: requestFrame = () => {}
}) {
  const settings = {
    enabled: true,
    opacity: 0.78,
    resolution: 1024,
    maxHeight: 2.5,
    heightFalloff: 1.2,
    blurMeters: 0.055,
    offsetX: 0.28,
    offsetZ: -0.22,
    surfaceEnabled: true,
    surfaceOpacity: 0.55,
    surfaceResolution: 256,
    maxSurfaceLevels: 32
  };
  const stats = {
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
  const floorStatesById = new Map();
  const depthMaterialsByKey = new Map();
  const geometryCacheEntryByGeometry = new WeakMap();
  const receiverBoundsCacheByGeometry = new WeakMap();
  const cachedLayoutsByKey = new Map();
  const placeholderTexture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  placeholderTexture.needsUpdate = true;
  let needsRebuild = true;
  let isDisposed = false;
  let isSuspended = false;
  let isMotionSuspended = false;
  let lastRootObject = null;
  let frameProvider = null;
  let isIncrementalUpdate = false;
  let shouldReuseLayout = false;
  const pendingFloorIds = new Set();
  let visibleFloorId = null;
  const matchesVisibleFloor = candidateFloorId =>
    visibleFloorId === null || candidateFloorId === visibleFloorId;
  const blurScene = new THREE.Scene();
  const blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blurMaterial = new THREE.ShaderMaterial({
    uniforms: {
      source: {
        value: placeholderTexture
      },
      stepSize: {
        value: new THREE.Vector2()
      },
      spread: {
        value: 0
      }
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    vertexShader:
      "varying vec2 shadowUv; void main() { shadowUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader:
      "uniform sampler2D source; uniform vec2 stepSize; uniform float spread; varying vec2 shadowUv;\n      void main() {\n        float center = texture2D(source, shadowUv).r;\n        float nearA = texture2D(source, shadowUv + stepSize * 1.384615).r;\n        float nearB = texture2D(source, shadowUv - stepSize * 1.384615).r;\n        float farA = texture2D(source, shadowUv + stepSize * 3.230769).r;\n        float farB = texture2D(source, shadowUv - stepSize * 3.230769).r;\n        float value = mix(center * 0.227027 + (nearA + nearB) * 0.316216 + (farA + farB) * 0.070270,\n          max(center, max(max(nearA, nearB), max(farA, farB))), spread);\n        gl_FragColor = vec4(vec3(value), 1.0);\n      }"
  });
  const blurQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMaterial);
  blurQuad.frustumCulled = false;
  blurScene.add(blurQuad);
  function getFloorState(floorId) {
    const floorIdKey = String(floorId);
    if (!floorStatesById.has(floorIdKey)) {
      floorStatesById.set(floorIdKey, {
        id: floorIdKey,
        target: null,
        ping: null,
        surface: null,
        lookup: null,
        casters: 0,
        instancedCasters: 0,
        receivers: 0,
        uniforms: {
          plan2ContactTransform: {
            value: new THREE.Matrix4()
          },
          plan2ContactMap: {
            value: placeholderTexture
          },
          plan2ContactBounds: {
            value: new THREE.Vector4(0, 0, 1, 1)
          },
          plan2ContactY: {
            value: 0
          },
          plan2ContactOpacity: {
            value: 0
          },
          plan2SurfaceMap: {
            value: placeholderTexture
          },
          plan2SurfaceBounds: {
            value: new THREE.Vector4()
          },
          plan2SurfaceLookup: {
            value: placeholderTexture
          },
          plan2SurfaceLayout: {
            value: new THREE.Vector2(1, 1)
          },
          plan2SurfaceOpacity: {
            value: 0
          }
        }
      });
    }
    return floorStatesById.get(floorIdKey);
  }
  function invalidate(floorIds, keepLayoutCache = false) {
    if (!isDisposed) {
      if (!keepLayoutCache) {
        shouldReuseLayout = false;
        const targetFloorIdSet =
          floorIds == null ? null : new Set(typeof floorIds == "string" ? [floorIds] : floorIds);
        for (const [iteratedLayoutKey, detachedState] of cachedLayoutsByKey) {
          if (!targetFloorIdSet || targetFloorIdSet.has(detachedState.id)) {
            disposeFloorState(detachedState);
            cachedLayoutsByKey.delete(iteratedLayoutKey);
          }
        }
      }
      if (floorIds == null) {
        needsRebuild = true;
        pendingFloorIds.clear();
      } else if (!needsRebuild) {
        const floorIdList = typeof floorIds == "string" ? [floorIds] : floorIds;
        for (const floorIdValue of floorIdList) {
          if (floorIdValue != null) {
            pendingFloorIds.add(String(floorIdValue));
          }
        }
      }
      if (needsRebuild || pendingFloorIds.size) {
        requestFrame();
      }
    }
  }
  function setEnabled(enabled) {
    settings.enabled = !!enabled;
    for (const enabledFloor of floorStatesById.values()) {
      enabledFloor.fade = null;
      enabledFloor.uniforms.plan2ContactOpacity.value =
        settings.enabled &&
        !isSuspended &&
        !isMotionSuspended &&
        matchesVisibleFloor(enabledFloor.id) &&
        enabledFloor.target
          ? settings.opacity
          : 0;
      enabledFloor.uniforms.plan2SurfaceOpacity.value =
        settings.enabled &&
        !isSuspended &&
        !isMotionSuspended &&
        matchesVisibleFloor(enabledFloor.id) &&
        settings.surfaceEnabled &&
        enabledFloor.surface
          ? settings.surfaceOpacity
          : 0;
    }
    requestFrame();
  }
  function setSuspended(suspended) {
    const nextSuspended = suspended === true;
    if (nextSuspended !== isSuspended) {
      isSuspended = nextSuspended;
      for (const suspendedFloor of floorStatesById.values()) {
        suspendedFloor.uniforms.plan2ContactOpacity.value = 0;
        suspendedFloor.uniforms.plan2SurfaceOpacity.value = 0;
      }
      invalidate();
    }
  }
  function setMotion(motionEnabled) {
    if (isMotionSuspended !== (motionEnabled === true)) {
      isMotionSuspended = motionEnabled === true;
      if (isMotionSuspended) {
        for (const resumedFloor of floorStatesById.values()) {
          resumedFloor.fade = {
            started: performance.now(),
            from: resumedFloor.uniforms.plan2ContactOpacity.value,
            fromSurface: resumedFloor.uniforms.plan2SurfaceOpacity.value,
            to: 0,
            toSurface: 0
          };
        }
      }
      if (!isMotionSuspended) {
        for (const clearedFloor of floorStatesById.values()) {
          clearedFloor.fade = null;
        }
        isIncrementalUpdate = true;
        shouldReuseLayout = true;
      }
      invalidate(null, true);
    }
  }
  function updateBakedTransforms() {
    for (const bakedFloorState of floorStatesById.values()) {
      if (!bakedFloorState.bakedFrame) {
        continue;
      }
      bakedFloorState.anchor?.updateWorldMatrix(true, false);
      const anchorMatrix =
        frameProvider?.(bakedFloorState.id) || bakedFloorState.anchor?.matrixWorld;
      if (anchorMatrix) {
        bakedFloorState.uniforms.plan2ContactTransform.value
          .copy(anchorMatrix)
          .invert()
          .premultiply(bakedFloorState.bakedFrame);
      }
    }
  }
  function getDepthMaterial(sourceMaterial, isSurfaceBake = false) {
    const materialCacheKey = JSON.stringify([
      isSurfaceBake,
      sourceMaterial.map?.uuid,
      sourceMaterial.alphaMap?.uuid,
      sourceMaterial.alphaTest,
      sourceMaterial.displacementMap?.uuid,
      sourceMaterial.displacementScale,
      sourceMaterial.displacementBias,
      settings.maxHeight,
      settings.heightFalloff,
      settings.offsetX,
      settings.offsetZ
    ]);
    if (depthMaterialsByKey.has(materialCacheKey)) {
      const reusedMaterial = depthMaterialsByKey.get(materialCacheKey);
      depthMaterialsByKey.delete(materialCacheKey);
      depthMaterialsByKey.set(materialCacheKey, reusedMaterial);
      return reusedMaterial;
    }
    const depthMaterial = new THREE.MeshDepthMaterial({
      depthPacking: THREE.BasicDepthPacking,
      side: THREE.DoubleSide,
      map: sourceMaterial.map ?? null,
      alphaMap: sourceMaterial.alphaMap ?? null,
      alphaTest: sourceMaterial.alphaTest ?? 0,
      displacementMap: sourceMaterial.displacementMap ?? null,
      displacementScale: sourceMaterial.displacementScale ?? 1,
      displacementBias: sourceMaterial.displacementBias ?? 0
    });
    depthMaterial.onBeforeCompile = shader => {
      shader.uniforms.contactNear = {
        value: 0.001
      };
      shader.uniforms.contactFar = {
        value: isSurfaceBake ? 1.5 : settings.maxHeight + 0.06
      };
      shader.uniforms.contactFalloff = {
        value: isSurfaceBake ? 0.5 : settings.heightFalloff
      };
      shader.uniforms.contactOffset = {
        value: new THREE.Vector2(settings.offsetX, settings.offsetZ)
      };
      shader.vertexShader = "uniform vec2 contactOffset;\n" + shader.vertexShader;
      const projectVertexChunk = "#include <project_vertex>";
      if (!shader.vertexShader.includes(projectVertexChunk)) {
        throw new Error("接触阴影材质缺少 project_vertex");
      }
      shader.vertexShader = shader.vertexShader.replace(
        projectVertexChunk,
        projectVertexChunk +
          "\n        // The capture looks up from 6cm below this floor. project_vertex has\n        // already applied instancing, skinning and the mesh world transform.\n        // Ground contact stays fixed; elevated surfaces reveal a short shadow\n        // beside the furniture using the same cached map and depth falloff.\n        float contactHeight = max(-mvPosition.z - " +
          (isSurfaceBake ? "0.0" : "0.06") +
          ", 0.0);\n        gl_Position.xy += vec2(projectionMatrix[0][0], projectionMatrix[1][1]) * contactHeight * contactOffset;"
      );
      shader.fragmentShader =
        "uniform float contactNear, contactFar, contactFalloff;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );",
        "float height = max(mix(contactNear, contactFar, fragCoordZ) - " +
          (isSurfaceBake ? "0.0" : "0.06") +
          ", 0.0);\n         float density = exp(-height / contactFalloff) * (1.0 - smoothstep(" +
          (isSurfaceBake ? 0.8 : 1.8) +
          ", " +
          (isSurfaceBake ? 1.5 : 2.5) +
          ", height));\n         gl_FragColor = vec4(vec3(density), 1.0);"
      );
    };
    depthMaterial.customProgramCacheKey = () =>
      isSurfaceBake ? "plan2-surface-bake-v1" : "plan2-contact-depth-v2-short-shadow";
    depthMaterialsByKey.set(materialCacheKey, depthMaterial);
    return depthMaterial;
  }
  function trimMaterialCache() {
    while (depthMaterialsByKey.size > 64) {
      const oldestMaterialKey = depthMaterialsByKey.keys().next().value;
      depthMaterialsByKey.get(oldestMaterialKey).dispose();
      depthMaterialsByKey.delete(oldestMaterialKey);
    }
  }
  function disposeFloorState(targetState) {
    targetState.fade = null;
    targetState.anchor = null;
    targetState.bakedFrame = null;
    targetState.target?.dispose();
    targetState.ping?.dispose();
    targetState.surface?.dispose();
    targetState.lookup?.dispose();
    targetState.target = null;
    targetState.ping = null;
    targetState.surface = null;
    targetState.lookup = null;
    targetState.uniforms.plan2ContactMap.value = placeholderTexture;
    targetState.uniforms.plan2ContactOpacity.value = 0;
    targetState.uniforms.plan2SurfaceMap.value = placeholderTexture;
    targetState.uniforms.plan2SurfaceLookup.value = placeholderTexture;
    targetState.uniforms.plan2SurfaceOpacity.value = 0;
  }
  function ensureRenderTargets(floorEntry, sizePx) {
    if (floorEntry.target?.width !== sizePx || floorEntry.target?.height !== sizePx) {
      disposeFloorState(floorEntry);
      floorEntry.target = new THREE.WebGLRenderTarget(sizePx, sizePx, {
        format: THREE.RedFormat,
        generateMipmaps: false
      });
    }
    floorEntry.ping ||= new THREE.WebGLRenderTarget(sizePx, sizePx, {
      format: THREE.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    return {
      target: floorEntry.target,
      ping: floorEntry.ping
    };
  }
  function bakeSurfaceLevels(
    surfaceEntry,
    casterMeshes,
    overrideByCaster,
    renderScene,
    casterBounds,
    floorBaseY,
    fallbackMaterial
  ) {
    const levels = computeSurfaceLevels(THREE, casterMeshes, floorBaseY, settings.maxSurfaceLevels);
    const levelHeights = levels.map(levelInfo => levelInfo.height);
    surfaceEntry.uniforms.plan2SurfaceOpacity.value = 0;
    if (!levelHeights.length) {
      surfaceEntry.surface?.dispose();
      surfaceEntry.lookup?.dispose();
      surfaceEntry.surface = surfaceEntry.lookup = null;
      surfaceEntry.uniforms.plan2SurfaceMap.value = placeholderTexture;
      surfaceEntry.uniforms.plan2SurfaceLookup.value = placeholderTexture;
      return;
    }
    const atlasColumns = Math.ceil(Math.sqrt(levelHeights.length));
    const tileSizePx = Math.min(
      settings.surfaceResolution,
      Math.floor(renderer.capabilities.maxTextureSize / atlasColumns)
    );
    const atlasSizePx = atlasColumns * tileSizePx;
    if (surfaceEntry.surface?.width !== atlasSizePx) {
      surfaceEntry.surface?.dispose();
      surfaceEntry.surface = new THREE.WebGLRenderTarget(atlasSizePx, atlasSizePx, {
        format: THREE.RedFormat,
        depthBuffer: false,
        generateMipmaps: false
      });
    }
    const paddedBounds = casterBounds.clone();
    paddedBounds.expandByVector(new THREE.Vector3(0.5, 0, 0.5));
    const surfaceWidth = paddedBounds.max.x - paddedBounds.min.x;
    const surfaceDepth = paddedBounds.max.z - paddedBounds.min.z;
    const surfaceCenterX = (paddedBounds.min.x + paddedBounds.max.x) / 2;
    const surfaceCenterZ = (paddedBounds.min.z + paddedBounds.max.z) / 2;
    const bakeCamera = new THREE.OrthographicCamera(
      -surfaceWidth / 2,
      surfaceWidth / 2,
      surfaceDepth / 2,
      -surfaceDepth / 2,
      0.001,
      1.5
    );
    bakeCamera.up.set(0, 0, 1);
    const bakeTarget = new THREE.WebGLRenderTarget(tileSizePx, tileSizePx, {
      format: THREE.RedFormat,
      generateMipmaps: false
    });
    const blurTarget = new THREE.WebGLRenderTarget(tileSizePx, tileSizePx, {
      format: THREE.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    const surfaceMaterialsByCaster = new Map();
    const toSurfaceMaterial = surfaceSourceMaterial =>
      isContactCasterMaterial(surfaceSourceMaterial)
        ? (surfaceMaterialsByCaster.has(surfaceSourceMaterial) ||
            surfaceMaterialsByCaster.set(
              surfaceSourceMaterial,
              getDepthMaterial(surfaceSourceMaterial, true)
            ),
          surfaceMaterialsByCaster.get(surfaceSourceMaterial))
        : fallbackMaterial;
    try {
      overrideByCaster.forEach((overrideMaterial, casterIndex) => {
        const originalMaterial = casterMeshes[casterIndex].material;
        overrideMaterial.material = Array.isArray(originalMaterial)
          ? originalMaterial.map(toSurfaceMaterial)
          : toSurfaceMaterial(originalMaterial);
      });
      for (let levelIndex = 0; levelIndex < levelHeights.length; levelIndex++) {
        bakeCamera.position.set(
          surfaceCenterX,
          floorBaseY + levels[levelIndex].top + 0.003,
          surfaceCenterZ
        );
        bakeCamera.lookAt(surfaceCenterX, bakeCamera.position.y + 1, surfaceCenterZ);
        bakeCamera.updateMatrixWorld(true);
        renderer.autoClear = true;
        renderer.setClearColor(0, 1);
        renderer.setRenderTarget(bakeTarget);
        renderer.render(renderScene, bakeCamera);
        stats.surfacePasses++;
        const blurPass = (sourceTarget, destTarget, stepX, stepY, spread = 0) => {
          blurMaterial.uniforms.source.value = sourceTarget.texture;
          blurMaterial.uniforms.stepSize.value.set(stepX, stepY);
          blurMaterial.uniforms.spread.value = spread;
          renderer.setRenderTarget(destTarget);
          renderer.render(blurScene, blurCamera);
        };
        blurPass(bakeTarget, blurTarget, 0.006 / surfaceWidth, 0, 1);
        blurPass(blurTarget, bakeTarget, 0, 0.006 / surfaceDepth, 1);
        blurPass(bakeTarget, blurTarget, 0.012 / surfaceWidth, 0);
        blurPass(blurTarget, bakeTarget, 0, 0.012 / surfaceDepth);
        surfaceEntry.surface.viewport.set(
          (levelIndex % atlasColumns) * tileSizePx,
          Math.floor(levelIndex / atlasColumns) * tileSizePx,
          tileSizePx,
          tileSizePx
        );
        renderer.autoClear = false;
        blurPass(bakeTarget, surfaceEntry.surface, 0, 0);
      }
      surfaceEntry.surface.viewport.set(0, 0, atlasSizePx, atlasSizePx);
      const maxLookupHeight = levelHeights.at(-1) + 0.05;
      const lookupSize = 2048;
      const lookupTextureData = new Uint8Array(lookupSize * 4);
      for (let lookupIndex = 0; lookupIndex < lookupSize; lookupIndex++) {
        const lookupHeight = ((lookupIndex + 0.5) / lookupSize) * maxLookupHeight;
        let nearestLevelIndex = -1;
        let nearestLevelDistance = 0.018;
        levelHeights.forEach((height, heightIndex) => {
          const heightDistance = Math.abs(height - lookupHeight);
          if (heightDistance < nearestLevelDistance) {
            nearestLevelDistance = heightDistance;
            nearestLevelIndex = heightIndex;
          }
        });
        if (!(nearestLevelIndex < 0)) {
          lookupTextureData[lookupIndex * 4] = nearestLevelIndex % atlasColumns;
          lookupTextureData[lookupIndex * 4 + 1] = Math.floor(nearestLevelIndex / atlasColumns);
          lookupTextureData[lookupIndex * 4 + 2] = 255;
          lookupTextureData[lookupIndex * 4 + 3] = 255;
        }
      }
      surfaceEntry.lookup?.dispose();
      surfaceEntry.lookup = new THREE.DataTexture(lookupTextureData, lookupSize, 1);
      surfaceEntry.lookup.needsUpdate = true;
      surfaceEntry.uniforms.plan2SurfaceMap.value = surfaceEntry.surface.texture;
      surfaceEntry.uniforms.plan2SurfaceLookup.value = surfaceEntry.lookup;
      surfaceEntry.uniforms.plan2SurfaceLayout.value.set(atlasColumns, maxLookupHeight);
      surfaceEntry.uniforms.plan2SurfaceBounds.value.set(
        paddedBounds.min.x,
        paddedBounds.min.z,
        surfaceWidth,
        surfaceDepth
      );
      surfaceEntry.uniforms.plan2SurfaceOpacity.value = settings.enabled
        ? settings.surfaceOpacity
        : 0;
      stats.surfaceCaptures++;
    } finally {
      bakeTarget.dispose();
      blurTarget.dispose();
      trimMaterialCache();
      blurMaterial.uniforms.source.value = placeholderTexture;
      blurMaterial.uniforms.spread.value = 0;
    }
  }
  function buildContactMap(contactEntry, receivers, casters) {
    const boundsBox = new THREE.Box3();
    for (const receiverMesh of receivers) {
      boundsBox.union(new THREE.Box3().setFromObject(receiverMesh));
    }
    if (boundsBox.isEmpty() || !casters.length) {
      disposeFloorState(contactEntry);
      return;
    }
    const floorTopY = boundsBox.max.y;
    boundsBox.min.x -= 0.25;
    boundsBox.min.z -= 0.25;
    boundsBox.max.x += 0.25;
    boundsBox.max.z += 0.25;
    const boundsWidth = Math.max(boundsBox.max.x - boundsBox.min.x, 0.1);
    const boundsDepth = Math.max(boundsBox.max.z - boundsBox.min.z, 0.1);
    const captureSizePx = Math.min(settings.resolution, renderer.capabilities.maxTextureSize);
    const { target: contactTarget, ping: contactPingTarget } = ensureRenderTargets(
      contactEntry,
      captureSizePx
    );
    const captureCamera = new THREE.OrthographicCamera(
      -boundsWidth / 2,
      boundsWidth / 2,
      boundsDepth / 2,
      -boundsDepth / 2,
      0.001,
      settings.maxHeight + 0.06
    );
    const centerX = (boundsBox.min.x + boundsBox.max.x) / 2;
    const centerZ = (boundsBox.min.z + boundsBox.max.z) / 2;
    captureCamera.position.set(centerX, floorTopY - 0.06, centerZ);
    captureCamera.up.set(0, 0, 1);
    captureCamera.lookAt(centerX, floorTopY + 1, centerZ);
    captureCamera.updateMatrixWorld(true);
    const captureScene = new THREE.Scene();
    const depthMaterialsByCaster = new Map();
    const clonedCasters = [];
    const fallbackDepthMaterial = new THREE.MeshDepthMaterial();
    fallbackDepthMaterial.visible = false;
    const toDepthMaterial = casterMaterialForClone =>
      isContactCasterMaterial(casterMaterialForClone)
        ? (depthMaterialsByCaster.has(casterMaterialForClone) ||
            depthMaterialsByCaster.set(
              casterMaterialForClone,
              getDepthMaterial(casterMaterialForClone)
            ),
          depthMaterialsByCaster.get(casterMaterialForClone))
        : fallbackDepthMaterial;
    for (const casterSource of casters) {
      const casterClone = casterSource.clone(false);
      casterClone.material = Array.isArray(casterSource.material)
        ? casterSource.material.map(toDepthMaterial)
        : toDepthMaterial(casterSource.material);
      casterClone.matrix.copy(casterSource.matrixWorld);
      casterClone.matrixWorld.copy(casterSource.matrixWorld);
      casterClone.matrixAutoUpdate = false;
      casterClone.matrixWorldAutoUpdate = true;
      casterClone.castShadow = false;
      casterClone.receiveShadow = false;
      casterClone.layers.set(0);
      casterClone.frustumCulled = false;
      captureScene.add(casterClone);
      clonedCasters.push(casterClone);
    }
    const renderState = {
      target: renderer.getRenderTarget(),
      face: renderer.getActiveCubeFace(),
      mip: renderer.getActiveMipmapLevel(),
      clear: renderer.getClearColor(new THREE.Color()),
      alpha: renderer.getClearAlpha(),
      autoClear: renderer.autoClear,
      shadows: renderer.shadowMap.enabled,
      xr: renderer.xr.enabled,
      viewport: renderer.getViewport(new THREE.Vector4()),
      scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest()
    };
    try {
      renderer.xr.enabled = false;
      renderer.shadowMap.enabled = false;
      renderer.autoClear = true;
      renderer.setScissorTest(false);
      renderer.setClearColor(0, 1);
      renderer.setRenderTarget(contactTarget);
      renderer.render(captureScene, captureCamera);
      stats.capturePasses += 1;
      const blurOnce = blurScale => {
        blurMaterial.uniforms.source.value = contactTarget.texture;
        blurMaterial.uniforms.stepSize.value.set(
          (settings.blurMeters * blurScale) / boundsWidth,
          0
        );
        renderer.setRenderTarget(contactPingTarget);
        renderer.render(blurScene, blurCamera);
        blurMaterial.uniforms.source.value = contactPingTarget.texture;
        blurMaterial.uniforms.stepSize.value.set(
          0,
          (settings.blurMeters * blurScale) / boundsDepth
        );
        renderer.setRenderTarget(contactTarget);
        renderer.render(blurScene, blurCamera);
      };
      blurOnce(1);
      blurOnce(0.4);
      if (settings.surfaceEnabled) {
        bakeSurfaceLevels(
          contactEntry,
          casters,
          clonedCasters,
          captureScene,
          boundsBox,
          floorTopY,
          fallbackDepthMaterial
        );
      } else {
        contactEntry.uniforms.plan2SurfaceOpacity.value = 0;
      }
      contactEntry.uniforms.plan2ContactMap.value = contactTarget.texture;
      contactEntry.uniforms.plan2ContactBounds.value.set(
        boundsBox.min.x,
        boundsBox.min.z,
        boundsWidth,
        boundsDepth
      );
      contactEntry.uniforms.plan2ContactY.value = floorTopY;
      contactEntry.uniforms.plan2ContactOpacity.value = settings.enabled ? settings.opacity : 0;
    } catch (caughtError) {
      disposeFloorState(contactEntry);
      throw caughtError;
    } finally {
      renderer.setViewport(renderState.viewport);
      renderer.setScissor(renderState.scissor);
      renderer.setScissorTest(renderState.scissorTest);
      renderer.setRenderTarget(renderState.target, renderState.face, renderState.mip);
      renderer.setClearColor(renderState.clear, renderState.alpha);
      renderer.autoClear = renderState.autoClear;
      renderer.shadowMap.enabled = renderState.shadows;
      renderer.xr.enabled = renderState.xr;
      fallbackDepthMaterial.dispose();
      trimMaterialCache();
      for (const disposableCaster of clonedCasters) {
        if (disposableCaster.isInstancedMesh) {
          disposableCaster.dispose();
        }
        if (disposableCaster.isBatchedMesh) {
          disposableCaster.dispose();
        }
      }
      captureScene.clear();
      blurMaterial.uniforms.source.value = placeholderTexture;
    }
  }
  function computeGeometryKey(bufferGeometry) {
    const attributeVersions =
      bufferGeometry.attributes.position?.version + ":" + bufferGeometry.index?.version;
    const cachedGeometryKey = geometryCacheEntryByGeometry.get(bufferGeometry);
    if (
      cachedGeometryKey?.version === attributeVersions &&
      cachedGeometryKey.position === bufferGeometry.attributes.position &&
      cachedGeometryKey.index === bufferGeometry.index
    ) {
      return cachedGeometryKey.key;
    }
    let geometryKey;
    if (
      bufferGeometry.parameters &&
      bufferGeometry.attributes.position?.version === 0 &&
      !(bufferGeometry.index?.version > 0)
    ) {
      try {
        geometryKey = JSON.stringify(
          [bufferGeometry.type, bufferGeometry.parameters],
          (jsonKey, jsonValue) => (jsonKey === "uuid" ? undefined : jsonValue)
        );
      } catch {}
    }
    if (!geometryKey) {
      const hashAttribute = attribute => {
        if (!attribute) {
          return null;
        }
        const attributeArray = attribute.array || attribute.data?.array;
        if (!attributeArray) {
          return [attribute.count, attribute.version];
        }
        const attributeBytes = new Uint8Array(
          attributeArray.buffer,
          attributeArray.byteOffset,
          attributeArray.byteLength
        );
        let hashA = 2166136261;
        let hashB = 3339675911;
        for (const byte of attributeBytes) {
          hashA = Math.imul(hashA ^ byte, 16777619);
          hashB = Math.imul(hashB ^ byte, 2246822519);
        }
        return [
          attribute.itemSize,
          attribute.count,
          attribute.offset,
          attribute.data?.stride,
          hashA >>> 0,
          hashB >>> 0
        ];
      };
      geometryKey = JSON.stringify([
        hashAttribute(bufferGeometry.attributes.position),
        hashAttribute(bufferGeometry.index),
        (bufferGeometry.morphAttributes.position || []).map(hashAttribute),
        bufferGeometry.groups,
        bufferGeometry.drawRange
      ]);
    }
    geometryCacheEntryByGeometry.set(bufferGeometry, {
      version: attributeVersions,
      key: geometryKey,
      position: bufferGeometry.attributes.position,
      index: bufferGeometry.index
    });
    return geometryKey;
  }
  function computeLayoutKey(layout, bakeFrame) {
    const bakeFrameInverse = bakeFrame.clone().invert();
    const describeObjectMatrix = object => {
      const objectMatrix = bakeFrameInverse.clone().multiply(object.matrixWorld);
      const roundMatrixElements = matrix =>
        matrix.elements.map(element => Math.round(element * 10000));
      if (!object.isInstancedMesh) {
        return roundMatrixElements(objectMatrix);
      }
      const instanceWorldMatrix = new THREE.Matrix4();
      const instancedMatrices = [];
      for (let instanceCursor = 0; instanceCursor < object.count; instanceCursor++) {
        object.getMatrixAt(instanceCursor, instanceWorldMatrix);
        instancedMatrices.push(roundMatrixElements(instanceWorldMatrix.premultiply(objectMatrix)));
      }
      return instancedMatrices;
    };
    const normalizeEntries = matrixEntries =>
      matrixEntries.map(matrixValues => JSON.stringify(matrixValues)).sort();
    return JSON.stringify([
      settings,
      normalizeEntries(
        layout.receivers.map(receiver => {
          const receiverGeometry = receiver.geometry;
          const receiverPositionAttribute = receiverGeometry.attributes.position;
          const cachedEntry = receiverBoundsCacheByGeometry.get(receiverGeometry);
          if (
            !cachedEntry ||
            cachedEntry.position !== receiverPositionAttribute ||
            cachedEntry.version !== receiverPositionAttribute?.version
          ) {
            receiverGeometry.computeBoundingBox();
            receiverBoundsCacheByGeometry.set(receiverGeometry, {
              position: receiverPositionAttribute,
              version: receiverPositionAttribute?.version,
              box: receiverGeometry.boundingBox?.clone()
            });
          }
          const receiverBounds = receiverBoundsCacheByGeometry
            .get(receiverGeometry)
            .box?.clone()
            .applyMatrix4(bakeFrameInverse.clone().multiply(receiver.matrixWorld));
          if (receiverBounds) {
            return [...receiverBounds.min.toArray(), ...receiverBounds.max.toArray()].map(
              boundValue => Math.round(boundValue * 10000)
            );
          } else {
            return null;
          }
        })
      ),
      normalizeEntries(
        layout.casters.map(caster => {
          const casterMaterialSignatures = (
            Array.isArray(caster.material) ? caster.material : [caster.material]
          ).map(casterMaterial => {
            const materialAlphaTest = casterMaterial.alphaTest || 0;
            const displacementMap = casterMaterial.displacementMap;
            const describeTexture = texture => (texture ? [texture.uuid, texture.version] : null);
            return [
              isContactCasterMaterial(casterMaterial),
              materialAlphaTest,
              materialAlphaTest > 0 ? describeTexture(casterMaterial.map) : null,
              materialAlphaTest > 0 ? describeTexture(casterMaterial.alphaMap) : null,
              describeTexture(displacementMap),
              displacementMap ? (casterMaterial.displacementScale ?? 1) : 0,
              displacementMap ? (casterMaterial.displacementBias ?? 0) : 0
            ];
          });
          const hasUniformMaterial = casterMaterialSignatures.every(
            materialSignature =>
              JSON.stringify(materialSignature) === JSON.stringify(casterMaterialSignatures[0])
          );
          return [
            computeGeometryKey(caster.geometry),
            caster.isInstancedMesh ? caster.count : null,
            caster.morphTargetInfluences,
            describeObjectMatrix(caster),
            hasUniformMaterial ? casterMaterialSignatures.slice(0, 1) : casterMaterialSignatures
          ];
        })
      )
    ]);
  }
  const estimateStateBytes = cachedFloorState =>
    (cachedFloorState.target
      ? cachedFloorState.target.width *
        cachedFloorState.target.height *
        (cachedFloorState.target.texture.format === THREE.RedFormat ? 5 : 8)
      : 0) +
    (cachedFloorState.ping
      ? cachedFloorState.ping.width *
        cachedFloorState.ping.height *
        (cachedFloorState.ping.texture.format === THREE.RedFormat ? 1 : 4)
      : 0) +
    (cachedFloorState.surface
      ? cachedFloorState.surface.width *
        cachedFloorState.surface.height *
        (cachedFloorState.surface.texture.format === THREE.RedFormat ? 1 : 4)
      : 0) +
    (cachedFloorState.lookup?.image?.data?.byteLength || 0);
  function storeCachedLayout(builtEntry) {
    if (!builtEntry.target || !builtEntry.contentKey) {
      return;
    }
    const layoutKey = JSON.stringify([builtEntry.id, builtEntry.contentKey]);
    const displacedEntry = cachedLayoutsByKey.get(layoutKey);
    if (displacedEntry) {
      disposeFloorState(displacedEntry);
    }
    builtEntry.ping?.dispose();
    builtEntry.ping = null;
    const storedEntry = {
      id: builtEntry.id,
      contentKey: builtEntry.contentKey,
      bakedFrame: builtEntry.bakedFrame,
      target: builtEntry.target,
      ping: builtEntry.ping,
      surface: builtEntry.surface,
      lookup: builtEntry.lookup,
      uniforms: Object.fromEntries(
        Object.entries(builtEntry.uniforms).map(([uniformName, uniform]) => [
          uniformName,
          {
            value:
              uniform.value?.clone && !uniform.value.isTexture
                ? uniform.value.clone()
                : uniform.value
          }
        ])
      )
    };
    cachedLayoutsByKey.delete(layoutKey);
    cachedLayoutsByKey.set(layoutKey, storedEntry);
    builtEntry.target = builtEntry.ping = builtEntry.surface = builtEntry.lookup = null;
    builtEntry.uniforms.plan2ContactOpacity.value =
      builtEntry.uniforms.plan2SurfaceOpacity.value = 0;
    builtEntry.fade = null;
  }
  function restoreCachedLayout(restoredEntry, contentKey) {
    const restoreKey = JSON.stringify([restoredEntry.id, contentKey]);
    const restoredLayout = cachedLayoutsByKey.get(restoreKey);
    if (!restoredLayout) {
      return false;
    }
    cachedLayoutsByKey.delete(restoreKey);
    storeCachedLayout(restoredEntry);
    for (const propertyName of [
      "target",
      "ping",
      "surface",
      "lookup",
      "contentKey",
      "bakedFrame"
    ]) {
      restoredEntry[propertyName] = restoredLayout[propertyName];
    }
    for (const [cachedUniformName, cachedUniform] of Object.entries(restoredLayout.uniforms)) {
      restoredEntry.uniforms[cachedUniformName].value = cachedUniform.value;
    }
    restoredEntry.uniforms.plan2ContactOpacity.value =
      restoredEntry.uniforms.plan2SurfaceOpacity.value = 0;
    return true;
  }
  function evictCaches(protectedIds) {
    const evictionCandidates = [...floorStatesById.values()]
      .filter(candidateState => candidateState.target && !protectedIds.has(candidateState.id))
      .sort((stateA, stateB) => (stateB.lastUsed || 0) - (stateA.lastUsed || 0));
    let retainedBytes = 0;
    let retainedFloorCount = 0;
    for (const evictedFloor of evictionCandidates) {
      evictedFloor.ping?.dispose();
      evictedFloor.ping = null;
      const stateBytes = estimateStateBytes(evictedFloor);
      if (retainedBytes + stateBytes > 33554432) {
        disposeFloorState(evictedFloor);
      } else {
        retainedBytes += stateBytes;
        retainedFloorCount++;
      }
    }
    let layoutCacheBytes = [...cachedLayoutsByKey.values()].reduce(
      (totalBytes, cachedState) => totalBytes + estimateStateBytes(cachedState),
      0
    );
    while (cachedLayoutsByKey.size > 8 || retainedBytes + layoutCacheBytes > 33554432) {
      const evictedLayoutKey = cachedLayoutsByKey.keys().next().value;
      const evictedLayout = cachedLayoutsByKey.get(evictedLayoutKey);
      if (!evictedLayout) {
        break;
      }
      layoutCacheBytes -= estimateStateBytes(evictedLayout);
      disposeFloorState(evictedLayout);
      cachedLayoutsByKey.delete(evictedLayoutKey);
    }
    stats.cachedFloors = retainedFloorCount;
    stats.cachedLayouts = cachedLayoutsByKey.size;
    stats.cachedBytes = retainedBytes + layoutCacheBytes;
  }
  function syncFloors() {
    if (isDisposed || isSuspended) {
      return;
    }
    for (const fadingFloor of floorStatesById.values()) {
      if (fadingFloor.fade) {
        const fadeProgress = Math.min(
          1,
          Math.max(0, (performance.now() - fadingFloor.fade.started) / 240)
        );
        fadingFloor.uniforms.plan2ContactOpacity.value =
          fadingFloor.fade.from + (fadingFloor.fade.to - fadingFloor.fade.from) * fadeProgress;
        fadingFloor.uniforms.plan2SurfaceOpacity.value =
          fadingFloor.fade.fromSurface +
          (fadingFloor.fade.toSurface - fadingFloor.fade.fromSurface) * fadeProgress;
        if (fadeProgress === 1) {
          fadingFloor.fade = null;
        } else {
          requestFrame();
        }
      }
    }
    updateBakedTransforms();
    const rootObject = getRoot();
    if (rootObject !== lastRootObject) {
      for (const staleLayout of cachedLayoutsByKey.values()) {
        disposeFloorState(staleLayout);
      }
      cachedLayoutsByKey.clear();
      lastRootObject = rootObject;
      shouldReuseLayout = false;
      needsRebuild = true;
      pendingFloorIds.clear();
    }
    if (
      (!needsRebuild && !pendingFloorIds.size) ||
      isMotionSuspended ||
      !canBuild() ||
      !rootObject
    ) {
      return;
    }
    const rebuildAllFloors = needsRebuild;
    const pendingFloorIdSnapshot = new Set(pendingFloorIds);
    rootObject.updateWorldMatrix(true, true);
    const sceneGroupsById = new Map();
    rootObject.traverse(sceneNode => {
      if (
        !sceneNode.isMesh ||
        !isVisibleWithAncestors(sceneNode) ||
        findUserDataInAncestors(sceneNode, "floorTransitionLeaving")
      ) {
        return;
      }
      const groupFloorId = String(
        findUserDataInAncestors(sceneNode, "regionFloorId") ??
          findUserDataInAncestors(sceneNode, "floorId") ??
          "default"
      );
      if (
        !matchesVisibleFloor(groupFloorId) ||
        (!rebuildAllFloors && !pendingFloorIdSnapshot.has(groupFloorId))
      ) {
        return;
      }
      const isFloorReceiver = sceneNode.userData?.regionReceiverKind === "floor";
      const isContactCaster =
        sceneNode.castShadow &&
        findUserDataInAncestors(sceneNode, "modelLayer") === "items" &&
        (Array.isArray(sceneNode.material) ? sceneNode.material : [sceneNode.material]).some(
          isContactCasterMaterial
        );
      if (!!isFloorReceiver || !!isContactCaster) {
        if (!sceneGroupsById.has(groupFloorId)) {
          sceneGroupsById.set(groupFloorId, {
            receivers: [],
            casters: []
          });
        }
        if (isFloorReceiver) {
          sceneGroupsById.get(groupFloorId).receivers.push(sceneNode);
        }
        if (isContactCaster) {
          sceneGroupsById.get(groupFloorId).casters.push(sceneNode);
        }
      }
    });
    for (const staleFloorState of floorStatesById.values()) {
      if (
        !isMotionSuspended &&
        (rebuildAllFloors || pendingFloorIdSnapshot.has(staleFloorState.id)) &&
        !sceneGroupsById.has(staleFloorState.id)
      ) {
        if (shouldReuseLayout) {
          staleFloorState.uniforms.plan2ContactOpacity.value = 0;
          staleFloorState.uniforms.plan2SurfaceOpacity.value = 0;
          staleFloorState.fade = null;
        } else {
          disposeFloorState(staleFloorState);
        }
        staleFloorState.casters = staleFloorState.instancedCasters = staleFloorState.receivers = 0;
      }
    }
    const deferredFloorIds = [];
    let buildCount = 0;
    for (const [groupId, group] of sceneGroupsById) {
      const floorState = getFloorState(groupId);
      const anchorObject = group.receivers[0] || null;
      const anchorFrame = frameProvider?.(groupId)?.clone() || anchorObject?.matrixWorld.clone();
      const layoutHash = anchorFrame ? computeLayoutKey(group, anchorFrame) : null;
      if (shouldReuseLayout && layoutHash && floorState.contentKey !== layoutHash) {
        restoreCachedLayout(floorState, layoutHash);
      }
      const canReuseLayout =
        shouldReuseLayout &&
        layoutHash &&
        floorState.target &&
        floorState.contentKey === layoutHash &&
        floorState.bakedFrame;
      if (!canReuseLayout && isIncrementalUpdate && buildCount >= 1) {
        deferredFloorIds.push(groupId);
        continue;
      }
      floorState.lastUsed = performance.now();
      const previousContactOpacity = floorState.uniforms.plan2ContactOpacity.value;
      const previousSurfaceOpacity = floorState.uniforms.plan2SurfaceOpacity.value;
      if (canReuseLayout) {
        stats.cacheHits++;
        floorState.uniforms.plan2ContactOpacity.value = settings.enabled ? settings.opacity : 0;
        floorState.uniforms.plan2SurfaceOpacity.value =
          settings.enabled && settings.surfaceEnabled && floorState.surface
            ? settings.surfaceOpacity
            : 0;
      } else {
        buildCount++;
        if (shouldReuseLayout) {
          storeCachedLayout(floorState);
        }
        buildContactMap(floorState, group.receivers, group.casters);
        floorState.contentKey = layoutHash;
        floorState.bakedFrame = anchorFrame;
        floorState.uniforms.plan2ContactTransform.value.identity();
      }
      if (floorState.fade) {
        floorState.fade.to = floorState.uniforms.plan2ContactOpacity.value;
        floorState.fade.toSurface = floorState.uniforms.plan2SurfaceOpacity.value;
        floorState.uniforms.plan2ContactOpacity.value = previousContactOpacity;
        floorState.uniforms.plan2SurfaceOpacity.value = previousSurfaceOpacity;
        requestFrame();
      } else if (
        isIncrementalUpdate &&
        previousContactOpacity < floorState.uniforms.plan2ContactOpacity.value
      ) {
        floorState.fade = {
          started: performance.now(),
          from: previousContactOpacity,
          fromSurface: previousSurfaceOpacity,
          to: floorState.uniforms.plan2ContactOpacity.value,
          toSurface: floorState.uniforms.plan2SurfaceOpacity.value
        };
        floorState.uniforms.plan2ContactOpacity.value = previousContactOpacity;
        floorState.uniforms.plan2SurfaceOpacity.value = previousSurfaceOpacity;
        requestFrame();
      }
      floorState.anchor = anchorObject;
      floorState.casters = group.casters.length;
      floorState.receivers = group.receivers.length;
      floorState.instancedCasters = group.casters.filter(
        casterObject => casterObject.isInstancedMesh
      ).length;
    }
    updateBakedTransforms();
    evictCaches(
      rebuildAllFloors
        ? sceneGroupsById
        : new Map(
            [...floorStatesById.values()]
              .filter(stateWithReceivers => stateWithReceivers.receivers > 0)
              .map(stateWithTarget => [stateWithTarget.id, true])
          )
    );
    stats.casters = stats.instancedCasters = stats.receivers = 0;
    for (const stateForStats of floorStatesById.values()) {
      stats.casters += stateForStats.casters;
      stats.instancedCasters += stateForStats.instancedCasters;
      stats.receivers += stateForStats.receivers;
    }
    stats.floors = [...floorStatesById.values()].filter(
      stateWithVisibleTarget =>
        stateWithVisibleTarget.target &&
        stateWithVisibleTarget.uniforms.plan2ContactOpacity.value > 0
    ).length;
    stats.builds += 1;
    needsRebuild = false;
    pendingFloorIds.clear();
    deferredFloorIds.forEach(deferredId => pendingFloorIds.add(deferredId));
    isIncrementalUpdate = deferredFloorIds.length > 0;
    if (isIncrementalUpdate) {
      requestFrame();
    }
  }
  function disposeAll() {
    if (!isDisposed) {
      isDisposed = true;
      stats.disposed = true;
      for (const disposedFloorState of floorStatesById.values()) {
        disposeFloorState(disposedFloorState);
      }
      for (const disposedLayout of cachedLayoutsByKey.values()) {
        disposeFloorState(disposedLayout);
      }
      cachedLayoutsByKey.clear();
      pendingFloorIds.clear();
      lastRootObject = null;
      floorStatesById.clear();
      for (const disposedDepthMaterial of depthMaterialsByKey.values()) {
        disposedDepthMaterial.dispose();
      }
      depthMaterialsByKey.clear();
      placeholderTexture.dispose();
      blurQuad.geometry.dispose();
      blurMaterial.dispose();
    }
  }
  const controller = {
    sync: syncFloors,
    invalidate: invalidate,
    dispose: disposeAll,
    stats: stats,
    settings: settings,
    setEnabled: setEnabled,
    setSuspended: setSuspended,
    setMotion: setMotion,
    setVisibleFloor(floorIdInput) {
      const nextVisibleFloorId = floorIdInput == null ? null : String(floorIdInput);
      if (nextVisibleFloorId !== visibleFloorId) {
        visibleFloorId = nextVisibleFloorId;
        for (const floorStateToHide of floorStatesById.values()) {
          if (!isMotionSuspended && !matchesVisibleFloor(floorStateToHide.id)) {
            floorStateToHide.fade = null;
            floorStateToHide.uniforms.plan2ContactOpacity.value =
              floorStateToHide.uniforms.plan2SurfaceOpacity.value = 0;
          }
        }
        invalidate(null, true);
      }
    },
    setFrameProvider(provider) {
      frameProvider = provider;
      invalidate();
    },
    getUniforms: floorKey => getFloorState(floorKey).uniforms
  };
  if (typeof window !== "undefined") {
    window.__plan2Contact = controller;
  }
  return controller;
}
