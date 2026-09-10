function findUserData(object, key) {
  for (let userData = object; userData; userData = userData.parent) {
    if (userData.userData?.[key] !== undefined) {
      return userData.userData[key];
    }
  }
}
function isVisibleInHierarchy(node) {
  for (let parent2 = node; parent2; parent2 = parent2.parent) {
    if (!parent2.visible) {
      return false;
    }
  }
  return true;
}
export function isContactCasterMaterial(material) {
  return !!material && material.visible !== false && !!(material.opacity >= 0.98) && !(material.transmission > 0) && (!material.transparent || !!(material.alphaTest > 0));
}
export function surfaceBakeLevels(THREE, meshes, floorY, maxLevels = 32) {
  const items = new Map();
  const fromBufferAttribute = new THREE.Vector3();
  const fromBufferAttribute2 = new THREE.Vector3();
  const fromBufferAttribute3 = new THREE.Vector3();
  const subVectors = new THREE.Vector3();
  const subVectors2 = new THREE.Vector3();
  const crossVectors = new THREE.Vector3();
  const copy = new THREE.Matrix4();
  const instanceMatrix = new THREE.Matrix4();
  for (const isInstancedMesh2 of meshes) {
    const drawRange = isInstancedMesh2.geometry;
    const count = drawRange?.attributes?.position;
    if (!count) {
      continue;
    }
    const getX = drawRange.index;
    const indexCount = getX?.count ?? count.count;
    const drawStart = drawRange.drawRange.start;
    const drawEnd = Math.min(indexCount, drawStart + drawRange.drawRange.count);
    for (let instanceIndex = 0; instanceIndex < (isInstancedMesh2.isInstancedMesh ? isInstancedMesh2.count : 1); instanceIndex++) {
      copy.copy(isInstancedMesh2.matrixWorld);
      if (isInstancedMesh2.isInstancedMesh) {
        isInstancedMesh2.getMatrixAt(instanceIndex, instanceMatrix);
        copy.multiply(instanceMatrix);
      }
      for (let triIndex = drawStart; triIndex + 2 < drawEnd; triIndex += 3) {
        fromBufferAttribute.fromBufferAttribute(count, getX ? getX.getX(triIndex) : triIndex).applyMatrix4(copy);
        fromBufferAttribute2.fromBufferAttribute(count, getX ? getX.getX(triIndex + 1) : triIndex + 1).applyMatrix4(copy);
        fromBufferAttribute3.fromBufferAttribute(count, getX ? getX.getX(triIndex + 2) : triIndex + 2).applyMatrix4(copy);
        crossVectors.crossVectors(subVectors.subVectors(fromBufferAttribute2, fromBufferAttribute), subVectors2.subVectors(fromBufferAttribute3, fromBufferAttribute));
        const area3 = crossVectors.length() * 0.5;
        const heightAboveFloor = (fromBufferAttribute.y + fromBufferAttribute2.y + fromBufferAttribute3.y) / 3 - floorY;
        if (area3 < 0.004 || crossVectors.y < area3 * 1.98 || heightAboveFloor <= 0.12) {
          continue;
        }
        const heightBucket = Math.round(heightAboveFloor * 100);
        const height = items.get(heightBucket) || {
          height: 0,
          area: 0
        };
        height.height += heightAboveFloor * area3;
        height.area += area3;
        items.set(heightBucket, height);
      }
    }
  }
  return [...items.values()].sort((area, area2) => area2.area - area.area).slice(0, maxLevels).map(height2 => height2.height / height2.area).sort((heightA, heightB) => heightA - heightB);
}
export function createContactShadowController({
  THREE,
  renderer,
  getRoot,
  canBuild = () => true,
  requestFrame = () => {}
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
    surfaceOpacity: 0.28,
    surfaceResolution: 512,
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
  const floorsById = new Map();
  const depthMaterialCache = new Map();
  const geometryKeyCache = new WeakMap();
  const boundsCache = new WeakMap();
  const contentCache = new Map();
  const blackTexture = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blackTexture.needsUpdate = true;
  let dirtyAll = true;
  let disposed = false;
  let suspended = false;
  let inMotion = false;
  let lastRoot = null;
  let frameProvider = null;
  let staggeredRebuild = false;
  let preferCache = false;
  const dirtyFloors = new Set();
  const blurScene = new THREE.Scene();
  const blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blurMaterial = new THREE.ShaderMaterial({
    uniforms: {
      source: {
        value: blackTexture
      },
      stepSize: {
        value: new THREE.Vector2()
      }
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    vertexShader: "varying vec2 shadowUv; void main() { shadowUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: "uniform sampler2D source; uniform vec2 stepSize; varying vec2 shadowUv;\n      void main() {\n        float value = texture2D(source, shadowUv).r * 0.227027;\n        value += texture2D(source, shadowUv + stepSize * 1.384615).r * 0.316216;\n        value += texture2D(source, shadowUv - stepSize * 1.384615).r * 0.316216;\n        value += texture2D(source, shadowUv + stepSize * 3.230769).r * 0.070270;\n        value += texture2D(source, shadowUv - stepSize * 3.230769).r * 0.070270;\n        gl_FragColor = vec4(vec3(value), 1.0);\n      }"
  });
  const blurQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMaterial);
  blurQuad.frustumCulled = false;
  blurScene.add(blurQuad);
  function ensureFloor(floorId) {
    const id4 = String(floorId);
    if (!floorsById.has(id4)) {
      floorsById.set(id4, {
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
            value: new THREE.Matrix4()
          },
          plan2ContactMap: {
            value: blackTexture
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
            value: blackTexture
          },
          plan2SurfaceBounds: {
            value: new THREE.Vector4()
          },
          plan2SurfaceLookup: {
            value: blackTexture
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
    return floorsById.get(id4);
  }
  function invalidate(floorIds, keepCache = false) {
    if (!disposed) {
      if (!keepCache) {
        preferCache = false;
        const has = floorIds == null ? null : new Set(typeof floorIds == "string" ? [floorIds] : floorIds);
        for (const [cacheEntryKey, id2] of contentCache) {
          if (!has || has.has(id2.id)) {
            disposeFloorTargets(id2);
            contentCache.delete(cacheEntryKey);
          }
        }
      }
      if (floorIds == null) {
        dirtyAll = true;
        dirtyFloors.clear();
      } else if (!dirtyAll) {
        const ids = typeof floorIds == "string" ? [floorIds] : floorIds;
        for (const id of ids) {
          if (id != null) {
            dirtyFloors.add(String(id));
          }
        }
      }
      if (dirtyAll || dirtyFloors.size) {
        requestFrame();
      }
    }
  }
  function setEnabled(nextEnabled) {
    settings.enabled = !!nextEnabled;
    for (const uniforms3 of floorsById.values()) {
      uniforms3.fade = null;
      uniforms3.uniforms.plan2ContactOpacity.value = settings.enabled && !suspended && uniforms3.target ? settings.opacity : 0;
      uniforms3.uniforms.plan2SurfaceOpacity.value = settings.enabled && !suspended && settings.surfaceEnabled && uniforms3.surface ? settings.surfaceOpacity : 0;
    }
    requestFrame();
  }
  function setSuspended(nextSuspended) {
    const nextSuspendedFlag = nextSuspended === true;
    if (nextSuspendedFlag !== suspended) {
      suspended = nextSuspendedFlag;
      for (const uniforms of floorsById.values()) {
        uniforms.uniforms.plan2ContactOpacity.value = 0;
        uniforms.uniforms.plan2SurfaceOpacity.value = 0;
      }
      invalidate();
    }
  }
  function setMotion(nextMotion) {
    if (inMotion !== (nextMotion === true)) {
      inMotion = nextMotion === true;
      if (!inMotion) {
        staggeredRebuild = true;
        preferCache = true;
      }
      invalidate(null, true);
    }
  }
  function updateTransforms() {
    for (const uniforms4 of floorsById.values()) {
      if (!uniforms4.bakedFrame) {
        continue;
      }
      uniforms4.anchor?.updateWorldMatrix(true, false);
      const providerFrame = frameProvider?.(uniforms4.id);
      const frameMatrix = providerFrame || uniforms4.anchor?.matrixWorld;
      if (frameMatrix) {
        uniforms4.uniforms.plan2ContactTransform.value.copy(frameMatrix).invert().premultiply(uniforms4.bakedFrame);
      }
      if (inMotion && uniforms4.target && frameMatrix && !uniforms4.fade && uniforms4.uniforms.plan2ContactOpacity.value === 0) {
        let anchorInRoot = false;
        for (let parent = uniforms4.anchor; parent; parent = parent.parent) {
          if (parent === getRoot()) {
            anchorInRoot = true;
            break;
          }
        }
        if (providerFrame || anchorInRoot) {
          uniforms4.uniforms.plan2ContactOpacity.value = settings.enabled ? settings.opacity : 0;
          uniforms4.uniforms.plan2SurfaceOpacity.value = settings.enabled && settings.surfaceEnabled && uniforms4.surface ? settings.surfaceOpacity : 0;
        }
      }
    }
  }
  function depthMaterialFor(map3, forSurface = false) {
    const materialCacheKey = JSON.stringify([forSurface, map3.map?.uuid, map3.alphaMap?.uuid, map3.alphaTest, map3.displacementMap?.uuid, map3.displacementScale, map3.displacementBias, settings.maxHeight, settings.heightFalloff, settings.offsetX, settings.offsetZ]);
    if (depthMaterialCache.has(materialCacheKey)) {
      const cachedMaterial = depthMaterialCache.get(materialCacheKey);
      depthMaterialCache.delete(materialCacheKey);
      depthMaterialCache.set(materialCacheKey, cachedMaterial);
      return cachedMaterial;
    }
    const onBeforeCompile = new THREE.MeshDepthMaterial({
      depthPacking: THREE.BasicDepthPacking,
      side: THREE.DoubleSide,
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
        value: forSurface ? 1.5 : settings.maxHeight + 0.06
      };
      vertexShader.uniforms.contactFalloff = {
        value: forSurface ? 0.5 : settings.heightFalloff
      };
      vertexShader.uniforms.contactOffset = {
        value: new THREE.Vector2(settings.offsetX, settings.offsetZ)
      };
      vertexShader.vertexShader = "uniform vec2 contactOffset;\n" + vertexShader.vertexShader;
      const projectVertexInclude = "#include <project_vertex>";
      if (!vertexShader.vertexShader.includes(projectVertexInclude)) {
        throw new Error("接触阴影材质缺少 project_vertex");
      }
      vertexShader.vertexShader = vertexShader.vertexShader.replace(projectVertexInclude, projectVertexInclude + "\n        // The capture looks up from 6cm below this floor. project_vertex has\n        // already applied instancing, skinning and the mesh world transform.\n        // Ground contact stays fixed; elevated surfaces reveal a short shadow\n        // beside the furniture using the same cached map and depth falloff.\n        float contactHeight = max(-mvPosition.z - " + (forSurface ? "0.0" : "0.06") + ", 0.0);\n        gl_Position.xy += vec2(projectionMatrix[0][0], projectionMatrix[1][1]) * contactHeight * contactOffset;");
      vertexShader.fragmentShader = "uniform float contactNear, contactFar, contactFalloff;\n" + vertexShader.fragmentShader;
      vertexShader.fragmentShader = vertexShader.fragmentShader.replace("gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );", "float height = max(mix(contactNear, contactFar, fragCoordZ) - " + (forSurface ? "0.0" : "0.06") + ", 0.0);\n         float density = exp(-height / contactFalloff) * (1.0 - smoothstep(" + (forSurface ? 0.8 : 1.8) + ", " + (forSurface ? 1.5 : 2.5) + ", height));\n         gl_FragColor = vec4(vec3(density), 1.0);");
    };
    onBeforeCompile.customProgramCacheKey = () => forSurface ? "plan2-surface-bake-v1" : "plan2-contact-depth-v2-short-shadow";
    depthMaterialCache.set(materialCacheKey, onBeforeCompile);
    return onBeforeCompile;
  }
  function trimDepthMaterials() {
    while (depthMaterialCache.size > 64) {
      const oldestMaterialKey = depthMaterialCache.keys().next().value;
      depthMaterialCache.get(oldestMaterialKey).dispose();
      depthMaterialCache.delete(oldestMaterialKey);
    }
  }
  function disposeFloorTargets(uniforms5) {
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
    uniforms5.uniforms.plan2ContactMap.value = blackTexture;
    uniforms5.uniforms.plan2ContactOpacity.value = 0;
    uniforms5.uniforms.plan2SurfaceMap.value = blackTexture;
    uniforms5.uniforms.plan2SurfaceLookup.value = blackTexture;
    uniforms5.uniforms.plan2SurfaceOpacity.value = 0;
  }
  function ensureContactTargets(target4, size) {
    if (target4.target?.width !== size || target4.target?.height !== size) {
      disposeFloorTargets(target4);
      target4.target = new THREE.WebGLRenderTarget(size, size, {
        format: THREE.RedFormat,
        generateMipmaps: false
      });
    }
    target4.ping ||= new THREE.WebGLRenderTarget(size, size, {
      format: THREE.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    return {
      target: target4.target,
      ping: target4.ping
    };
  }
  function bakeSurfaceShadows(surface, casterMeshes, forEach, captureScene, clone, floorHeight, hiddenMaterial) {
    const length = surfaceBakeLevels(THREE, casterMeshes, floorHeight, settings.maxSurfaceLevels);
    surface.uniforms.plan2SurfaceOpacity.value = 0;
    if (!length.length) {
      surface.surface?.dispose();
      surface.lookup?.dispose();
      surface.surface = surface.lookup = null;
      surface.uniforms.plan2SurfaceMap.value = blackTexture;
      surface.uniforms.plan2SurfaceLookup.value = blackTexture;
      return;
    }
    const gridSide = Math.ceil(Math.sqrt(length.length));
    const tileSize = Math.min(settings.surfaceResolution, Math.floor(renderer.capabilities.maxTextureSize / gridSide));
    const atlasSize = gridSide * tileSize;
    if (surface.surface?.width !== atlasSize) {
      surface.surface?.dispose();
      surface.surface = new THREE.WebGLRenderTarget(atlasSize, atlasSize, {
        format: THREE.RedFormat,
        depthBuffer: false,
        generateMipmaps: false
      });
    }
    const min2 = clone.clone();
    min2.expandByVector(new THREE.Vector3(0.5, 0, 0.5));
    const surfaceWidth = min2.max.x - min2.min.x;
    const surfaceDepth = min2.max.z - min2.min.z;
    const surfaceCenterX = (min2.min.x + min2.max.x) / 2;
    const surfaceCenterZ = (min2.min.z + min2.max.z) / 2;
    const position2 = new THREE.OrthographicCamera(-surfaceWidth / 2, surfaceWidth / 2, surfaceDepth / 2, -surfaceDepth / 2, 0.001, 1.5);
    position2.up.set(0, 0, 1);
    const dispose3 = new THREE.WebGLRenderTarget(tileSize, tileSize, {
      format: THREE.RedFormat,
      generateMipmaps: false
    });
    const dispose4 = new THREE.WebGLRenderTarget(tileSize, tileSize, {
      format: THREE.RedFormat,
      depthBuffer: false,
      generateMipmaps: false
    });
    const has2 = new Map();
    const resolveSurfaceMaterial = material => isContactCasterMaterial(material) ? (has2.has(material) || has2.set(material, depthMaterialFor(material, true)), has2.get(material)) : hiddenMaterial;
    try {
      forEach.forEach((material2, index) => {
        const map = casterMeshes[index].material;
        material2.material = Array.isArray(map) ? map.map(resolveSurfaceMaterial) : resolveSurfaceMaterial(map);
      });
      for (let levelIndex = 0; levelIndex < length.length; levelIndex++) {
        position2.position.set(surfaceCenterX, floorHeight + length[levelIndex] + 0.025, surfaceCenterZ);
        position2.lookAt(surfaceCenterX, position2.position.y + 1, surfaceCenterZ);
        position2.updateMatrixWorld(true);
        renderer.autoClear = true;
        renderer.setClearColor(0, 1);
        renderer.setRenderTarget(dispose3);
        renderer.render(captureScene, position2);
        stats.surfacePasses++;
        const copyBlur = (texture, destination, stepX, stepY) => {
          blurMaterial.uniforms.source.value = texture.texture;
          blurMaterial.uniforms.stepSize.value.set(stepX, stepY);
          renderer.setRenderTarget(destination);
          renderer.render(blurScene, blurCamera);
        };
        copyBlur(dispose3, dispose4, 0.045 / surfaceWidth, 0);
        copyBlur(dispose4, dispose3, 0, 0.045 / surfaceDepth);
        copyBlur(dispose3, dispose4, 0.02 / surfaceWidth, 0);
        copyBlur(dispose4, dispose3, 0, 0.02 / surfaceDepth);
        surface.surface.viewport.set(levelIndex % gridSide * tileSize, Math.floor(levelIndex / gridSide) * tileSize, tileSize, tileSize);
        renderer.autoClear = false;
        copyBlur(dispose3, surface.surface, 0, 0);
      }
      surface.surface.viewport.set(0, 0, atlasSize, atlasSize);
      const lookupRange = length.at(-1) + 0.05;
      const lookupWidth = 2048;
      const lookupData = new Uint8Array(lookupWidth * 4);
      for (let lookupIndex = 0; lookupIndex < lookupWidth; lookupIndex++) {
        const sampleHeight = (lookupIndex + 0.5) / lookupWidth * lookupRange;
        let bestIndex = -1;
        let bestDist = 0.018;
        length.forEach((levelHeight, levelIndex) => {
          const dist = Math.abs(levelHeight - sampleHeight);
          if (dist < bestDist) {
            bestDist = dist;
            bestIndex = levelIndex;
          }
        });
        if (!(bestIndex < 0)) {
          lookupData[lookupIndex * 4] = bestIndex % gridSide;
          lookupData[lookupIndex * 4 + 1] = Math.floor(bestIndex / gridSide);
          lookupData[lookupIndex * 4 + 2] = 255;
          lookupData[lookupIndex * 4 + 3] = 255;
        }
      }
      surface.lookup?.dispose();
      surface.lookup = new THREE.DataTexture(lookupData, lookupWidth, 1);
      surface.lookup.needsUpdate = true;
      surface.uniforms.plan2SurfaceMap.value = surface.surface.texture;
      surface.uniforms.plan2SurfaceLookup.value = surface.lookup;
      surface.uniforms.plan2SurfaceLayout.value.set(gridSide, lookupRange);
      surface.uniforms.plan2SurfaceBounds.value.set(min2.min.x, min2.min.z, surfaceWidth, surfaceDepth);
      surface.uniforms.plan2SurfaceOpacity.value = settings.enabled ? settings.surfaceOpacity : 0;
      stats.surfaceCaptures++;
    } finally {
      dispose3.dispose();
      dispose4.dispose();
      trimDepthMaterials();
      blurMaterial.uniforms.source.value = blackTexture;
    }
  }
  function bakeFloorShadows(uniforms6, receiverMeshes, length2) {
    const min3 = new THREE.Box3();
    for (const receiver of receiverMeshes) {
      min3.union(new THREE.Box3().setFromObject(receiver));
    }
    if (min3.isEmpty() || !length2.length) {
      disposeFloorTargets(uniforms6);
      return;
    }
    const element3 = min3.max.y;
    min3.min.x -= 0.25;
    min3.min.z -= 0.25;
    min3.max.x += 0.25;
    min3.max.z += 0.25;
    const boundsWidth = Math.max(min3.max.x - min3.min.x, 0.1);
    const boundsDepth = Math.max(min3.max.z - min3.min.z, 0.1);
    const mapSize = Math.min(settings.resolution, renderer.capabilities.maxTextureSize);
    const {
      target: texture2,
      ping: texture3
    } = ensureContactTargets(uniforms6, mapSize);
    const position3 = new THREE.OrthographicCamera(-boundsWidth / 2, boundsWidth / 2, boundsDepth / 2, -boundsDepth / 2, 0.001, settings.maxHeight + 0.06);
    const centerX = (min3.min.x + min3.max.x) / 2;
    const centerZ = (min3.min.z + min3.max.z) / 2;
    position3.position.set(centerX, element3 - 0.06, centerZ);
    position3.up.set(0, 0, 1);
    position3.lookAt(centerX, element3 + 1, centerZ);
    position3.updateMatrixWorld(true);
    const add = new THREE.Scene();
    const has3 = new Map();
    const push2 = [];
    const visible = new THREE.MeshDepthMaterial();
    visible.visible = false;
    const resolveDepthMaterial = material => isContactCasterMaterial(material) ? (has3.has(material) || has3.set(material, depthMaterialFor(material)), has3.get(material)) : visible;
    for (const material5 of length2) {
      const material4 = material5.clone(false);
      material4.material = Array.isArray(material5.material) ? material5.material.map(resolveDepthMaterial) : resolveDepthMaterial(material5.material);
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
      target: renderer.getRenderTarget(),
      face: renderer.getActiveCubeFace(),
      mip: renderer.getActiveMipmapLevel(),
      dirtyFloors: renderer.getClearColor(new THREE.Color()),
      alpha: renderer.getClearAlpha(),
      autoClear: renderer.autoClear,
      shadows: renderer.shadowMap.enabled,
      webxrEnabled: renderer.xr.enabled,
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
      renderer.setRenderTarget(texture2);
      renderer.render(add, position3);
      stats.capturePasses += 1;
      const blurPass = blurScale => {
        blurMaterial.uniforms.source.value = texture2.texture;
        blurMaterial.uniforms.stepSize.value.set(settings.blurMeters * blurScale / boundsWidth, 0);
        renderer.setRenderTarget(texture3);
        renderer.render(blurScene, blurCamera);
        blurMaterial.uniforms.source.value = texture3.texture;
        blurMaterial.uniforms.stepSize.value.set(0, settings.blurMeters * blurScale / boundsDepth);
        renderer.setRenderTarget(texture2);
        renderer.render(blurScene, blurCamera);
      };
      blurPass(1);
      blurPass(0.4);
      if (settings.surfaceEnabled) {
        bakeSurfaceShadows(uniforms6, length2, push2, add, min3, element3, visible);
      } else {
        uniforms6.uniforms.plan2SurfaceOpacity.value = 0;
      }
      uniforms6.uniforms.plan2ContactMap.value = texture2.texture;
      uniforms6.uniforms.plan2ContactBounds.value.set(min3.min.x, min3.min.z, boundsWidth, boundsDepth);
      uniforms6.uniforms.plan2ContactY.value = element3;
      uniforms6.uniforms.plan2ContactOpacity.value = settings.enabled ? settings.opacity : 0;
    } catch (error) {
      disposeFloorTargets(uniforms6);
      throw error;
    } finally {
      renderer.setViewport(viewport.viewport);
      renderer.setScissor(viewport.scissor);
      renderer.setScissorTest(viewport.scissorTest);
      renderer.setRenderTarget(viewport.target, viewport.face, viewport.mip);
      renderer.setClearColor(viewport.dirtyFloors, viewport.alpha);
      renderer.autoClear = viewport.autoClear;
      renderer.shadowMap.enabled = viewport.shadows;
      renderer.xr.enabled = viewport.webxrEnabled;
      visible.dispose();
      trimDepthMaterials();
      for (const dispose of push2) {
        if (dispose.isInstancedMesh) {
          dispose.dispose();
        }
        if (dispose.isBatchedMesh) {
          dispose.dispose();
        }
      }
      add.clear();
      blurMaterial.uniforms.source.value = blackTexture;
    }
  }
  function geometryContentKey(attributes2) {
    const version2 = attributes2.attributes.position?.version + ":" + attributes2.index?.version;
    const version3 = geometryKeyCache.get(attributes2);
    if (version3?.version === version2 && version3.position === attributes2.attributes.position && version3.index === attributes2.index) {
      return version3.key;
    }
    let key;
    if (attributes2.parameters && attributes2.attributes.position?.version === 0 && !(attributes2.index?.version > 0)) {
      try {
        key = JSON.stringify([attributes2.type, attributes2.parameters], (jsonKey, jsonValue) => jsonKey === "uuid" ? undefined : jsonValue);
      } catch {}
    }
    if (!key) {
      const hashAttribute = data => {
        if (!data) {
          return null;
        }
        const buffer = data.array || data.data?.array;
        if (!buffer) {
          return [data.count, data.version];
        }
        const bytesView = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        let hashA = 2166136261;
        let hashB = 3339675911;
        for (const byte of bytesView) {
          hashA = Math.imul(hashA ^ byte, 16777619);
          hashB = Math.imul(hashB ^ byte, 2246822519);
        }
        return [data.itemSize, data.count, data.offset, data.data?.stride, hashA >>> 0, hashB >>> 0];
      };
      key = JSON.stringify([hashAttribute(attributes2.attributes.position), hashAttribute(attributes2.index), (attributes2.morphAttributes.position || []).map(hashAttribute), attributes2.groups, attributes2.drawRange]);
    }
    geometryKeyCache.set(attributes2, {
      version: version2,
      key,
      position: attributes2.attributes.position,
      index: attributes2.index
    });
    return key;
  }
  function floorContentKey(receivers3, clone2) {
    const clone3 = clone2.clone().invert();
    const relativeMatrices = matrixWorld => {
      const localMatrix = clone3.clone().multiply(matrixWorld.matrixWorld);
      const roundElements = elements => elements.elements.map(element => Math.round(element * 10000));
      if (!matrixWorld.isInstancedMesh) {
        return roundElements(localMatrix);
      }
      const premultiply = new THREE.Matrix4();
      const push = [];
      for (let instanceIndex = 0; instanceIndex < matrixWorld.count; instanceIndex++) {
        matrixWorld.getMatrixAt(instanceIndex, premultiply);
        push.push(roundElements(premultiply.premultiply(localMatrix)));
      }
      return push;
    };
    const sortedJson = map2 => map2.map(item => JSON.stringify(item)).sort();
    return JSON.stringify([enabled, sortedJson(receivers3.receivers.map(geometry => {
      const attributes = geometry.geometry;
      const version = attributes.attributes.position;
      const position = boundsCache.get(attributes);
      if (!position || position.position !== version || position.version !== version?.version) {
        attributes.computeBoundingBox();
        boundsCache.set(attributes, {
          position: version,
          version: version?.version,
          box: attributes.boundingBox?.clone()
        });
      }
      const min = boundsCache.get(attributes).box?.clone().applyMatrix4(clone3.clone().multiply(geometry.matrixWorld));
      if (min) {
        return [...min.min.toArray(), ...min.max.toArray()].map(coord => Math.round(coord * 10000));
      } else {
        return null;
      }
    })), sortedJson(receivers3.casters.map(material => {
      const every = (Array.isArray(material.material) ? material.material : [material.material]).map(alphaTest => {
        const alphaTestValue = alphaTest.alphaTest || 0;
        const displacementMap = alphaTest.displacementMap;
        const textureSig = texture => texture ? [texture.uuid, texture.version] : null;
        return [isContactCasterMaterial(alphaTest), alphaTestValue, alphaTestValue > 0 ? textureSig(alphaTest.map) : null, alphaTestValue > 0 ? textureSig(alphaTest.alphaMap) : null, textureSig(displacementMap), displacementMap ? alphaTest.displacementScale ?? 1 : 0, displacementMap ? alphaTest.displacementBias ?? 0 : 0];
      });
      const uniformMaterials = every.every(sample => JSON.stringify(sample) === JSON.stringify(every[0]));
      return [geometryContentKey(material.geometry), material.isInstancedMesh ? material.count : null, material.morphTargetInfluences, relativeMatrices(material), uniformMaterials ? every.slice(0, 1) : every];
    }))]);
  }
  const estimateTargetBytes = target3 => (target3.target ? target3.target.width * target3.target.height * (target3.target.texture.format === THREE.RedFormat ? 5 : 8) : 0) + (target3.ping ? target3.ping.width * target3.ping.height * (target3.ping.texture.format === THREE.RedFormat ? 1 : 4) : 0) + (target3.surface ? target3.surface.width * target3.surface.height * (target3.surface.texture.format === THREE.RedFormat ? 1 : 4) : 0) + (target3.lookup?.image?.data?.byteLength || 0);
  function stashFloorCache(ping2) {
    if (!ping2.target || !ping2.contentKey) {
      return;
    }
    const cacheKey = JSON.stringify([ping2.id, ping2.contentKey]);
    const existingCache = contentCache.get(cacheKey);
    if (existingCache) {
      disposeFloorTargets(existingCache);
    }
    ping2.ping?.dispose();
    ping2.ping = null;
    const cachedEntry = {
      id: ping2.id,
      contentKey: ping2.contentKey,
      bakedFrame: ping2.bakedFrame,
      target: ping2.target,
      ping: ping2.ping,
      surface: ping2.surface,
      lookup: ping2.lookup,
      uniforms: Object.fromEntries(Object.entries(ping2.uniforms).map(([uniformName, uniformState]) => [uniformName, {
        value: uniformState.value?.clone && !uniformState.value.isTexture ? uniformState.value.clone() : uniformState.value
      }]))
    };
    contentCache.delete(cacheKey);
    contentCache.set(cacheKey, cachedEntry);
    ping2.target = ping2.ping = ping2.surface = ping2.lookup = null;
    ping2.uniforms.plan2ContactOpacity.value = ping2.uniforms.plan2SurfaceOpacity.value = 0;
    ping2.fade = null;
  }
  function restoreFloorCache(uniforms7, contentKey) {
    const cacheKey = JSON.stringify([uniforms7.id, contentKey]);
    const uniforms8 = contentCache.get(cacheKey);
    if (!uniforms8) {
      return false;
    }
    contentCache.delete(cacheKey);
    stashFloorCache(uniforms7);
    for (const prop of ["target", "ping", "surface", "lookup", "contentKey", "bakedFrame"]) {
      uniforms7[prop] = uniforms8[prop];
    }
    for (const [uniformKey, uniformValue] of Object.entries(uniforms8.uniforms)) {
      uniforms7.uniforms[uniformKey].value = uniformValue.value;
    }
    uniforms7.uniforms.plan2ContactOpacity.value = uniforms7.uniforms.plan2SurfaceOpacity.value = 0;
    return true;
  }
  function pruneCache(has4) {
    const idleFloors = [...floorsById.values()].filter(target => target.target && !has4.has(target.id)).sort((lastUsed, lastUsed2) => (lastUsed2.lastUsed || 0) - (lastUsed.lastUsed || 0));
    let activeCacheBytes = 0;
    let cachedFloors = 0;
    for (const ping of idleFloors) {
      ping.ping?.dispose();
      ping.ping = null;
      const bytes = estimateTargetBytes(ping);
      if (cachedFloors >= 2 || activeCacheBytes + bytes > 33554432) {
        disposeFloorTargets(ping);
      } else {
        activeCacheBytes += bytes;
        cachedFloors++;
      }
    }
    let cacheBytes = [...contentCache.values()].reduce((total, entry) => total + estimateTargetBytes(entry), 0);
    while (contentCache.size > 8 || activeCacheBytes + cacheBytes > 33554432) {
      const oldestKey = contentCache.keys().next().value;
      const evicted = contentCache.get(oldestKey);
      if (!evicted) {
        break;
      }
      cacheBytes -= estimateTargetBytes(evicted);
      disposeFloorTargets(evicted);
      contentCache.delete(oldestKey);
    }
    stats.cachedFloors = cachedFloors;
    stats.cachedLayouts = contentCache.size;
    stats.cachedBytes = activeCacheBytes + cacheBytes;
  }
  function sync() {
    if (disposed || suspended) {
      return;
    }
    for (const fade of floorsById.values()) {
      if (fade.fade) {
        const fadeT = Math.min(1, Math.max(0, (performance.now() - fade.fade.started) / 260));
        fade.uniforms.plan2ContactOpacity.value = fade.fade.from + (fade.fade.to - fade.fade.from) * fadeT;
        fade.uniforms.plan2SurfaceOpacity.value = fade.fade.fromSurface + (fade.fade.toSurface - fade.fade.fromSurface) * fadeT;
        if (fadeT === 1) {
          fade.fade = null;
        } else {
          requestFrame();
        }
      }
    }
    updateTransforms();
    const updateWorldMatrix = getRoot();
    if (updateWorldMatrix !== lastRoot) {
      for (const cached of contentCache.values()) {
        disposeFloorTargets(cached);
      }
      contentCache.clear();
      lastRoot = updateWorldMatrix;
      preferCache = false;
      dirtyAll = true;
      dirtyFloors.clear();
    }
    if (!dirtyAll && !dirtyFloors.size || inMotion || !canBuild() || !updateWorldMatrix) {
      return;
    }
    const rebuildAll = dirtyAll;
    const has5 = new Set(dirtyFloors);
    updateWorldMatrix.updateWorldMatrix(true, true);
    const has6 = new Map();
    updateWorldMatrix.traverse(material3 => {
      if (!material3.isMesh || !isVisibleInHierarchy(material3)) {
        return;
      }
      const meshFloorId = String(findUserData(material3, "regionFloorId") ?? findUserData(material3, "floorId") ?? "default");
      if (!rebuildAll && !has5.has(meshFloorId)) {
        return;
      }
      const isReceiver = material3.userData?.regionReceiverKind === "floor";
      const isCaster = material3.castShadow && findUserData(material3, "modelLayer") === "items" && (Array.isArray(material3.material) ? material3.material : [material3.material]).some(isContactCasterMaterial);
      if (!!isReceiver || !!isCaster) {
        if (!has6.has(meshFloorId)) {
          has6.set(meshFloorId, {
            receivers: [],
            casters: []
          });
        }
        if (isReceiver) {
          has6.get(meshFloorId).receivers.push(material3);
        }
        if (isCaster) {
          has6.get(meshFloorId).casters.push(material3);
        }
      }
    });
    for (const id3 of floorsById.values()) {
      if (!inMotion && (rebuildAll || has5.has(id3.id)) && !has6.has(id3.id)) {
        if (preferCache) {
          id3.uniforms.plan2ContactOpacity.value = 0;
          id3.uniforms.plan2SurfaceOpacity.value = 0;
          id3.fade = null;
        } else {
          disposeFloorTargets(id3);
        }
        id3.casters = id3.instancedCasters = id3.receivers = 0;
      }
    }
    const push3 = [];
    let buildsThisPass = 0;
    for (const [floorKey, receivers2] of has6) {
      const uniforms2 = ensureFloor(floorKey);
      const matrixWorld2 = receivers2.receivers[0] || null;
      const bakedFrame = frameProvider?.(floorKey)?.clone() || matrixWorld2?.matrixWorld.clone();
      const contentKey = bakedFrame ? floorContentKey(receivers2, bakedFrame) : null;
      if (preferCache && contentKey && uniforms2.contentKey !== contentKey) {
        restoreFloorCache(uniforms2, contentKey);
      }
      const cacheHit = preferCache && contentKey && uniforms2.target && uniforms2.contentKey === contentKey && uniforms2.bakedFrame;
      if (!cacheHit && staggeredRebuild && buildsThisPass >= 1) {
        push3.push(floorKey);
        continue;
      }
      uniforms2.lastUsed = performance.now();
      const element = uniforms2.uniforms.plan2ContactOpacity.value;
      const element2 = uniforms2.uniforms.plan2SurfaceOpacity.value;
      if (cacheHit) {
        stats.cacheHits++;
        uniforms2.uniforms.plan2ContactOpacity.value = settings.enabled ? settings.opacity : 0;
        uniforms2.uniforms.plan2SurfaceOpacity.value = settings.enabled && settings.surfaceEnabled && uniforms2.surface ? settings.surfaceOpacity : 0;
      } else {
        buildsThisPass++;
        if (preferCache) {
          stashFloorCache(uniforms2);
        }
        bakeFloorShadows(uniforms2, receivers2.receivers, receivers2.casters);
        uniforms2.contentKey = contentKey;
        uniforms2.bakedFrame = bakedFrame;
        uniforms2.uniforms.plan2ContactTransform.value.identity();
      }
      if (uniforms2.fade) {
        uniforms2.fade.to = uniforms2.uniforms.plan2ContactOpacity.value;
        uniforms2.fade.toSurface = uniforms2.uniforms.plan2SurfaceOpacity.value;
        uniforms2.uniforms.plan2ContactOpacity.value = element;
        uniforms2.uniforms.plan2SurfaceOpacity.value = element2;
        requestFrame();
      } else if (staggeredRebuild && element === 0 && uniforms2.uniforms.plan2ContactOpacity.value > 0) {
        uniforms2.fade = {
          started: performance.now(),
          from: element,
          fromSurface: element2,
          to: uniforms2.uniforms.plan2ContactOpacity.value,
          toSurface: uniforms2.uniforms.plan2SurfaceOpacity.value
        };
        uniforms2.uniforms.plan2ContactOpacity.value = element;
        uniforms2.uniforms.plan2SurfaceOpacity.value = element2;
        requestFrame();
      }
      uniforms2.anchor = matrixWorld2;
      uniforms2.casters = receivers2.casters.length;
      uniforms2.receivers = receivers2.receivers.length;
      uniforms2.instancedCasters = receivers2.casters.filter(isInstancedMesh => isInstancedMesh.isInstancedMesh).length;
    }
    updateTransforms();
    pruneCache(rebuildAll ? has6 : new Map([...floorsById.values()].filter(receivers => receivers.receivers > 0).map(id => [id.id, true])));
    stats.casters = stats.instancedCasters = stats.receivers = 0;
    for (const casters of floorsById.values()) {
      stats.casters += casters.casters;
      stats.instancedCasters += casters.instancedCasters;
      stats.receivers += casters.receivers;
    }
    stats.floors = [...floorsById.values()].filter(target2 => target2.target && target2.uniforms.plan2ContactOpacity.value > 0).length;
    stats.builds += 1;
    dirtyAll = false;
    dirtyFloors.clear();
    push3.forEach(pendingFloorId => dirtyFloors.add(pendingFloorId));
    staggeredRebuild = push3.length > 0;
    if (staggeredRebuild) {
      requestFrame();
    }
  }
  function disposeController() {
    if (!disposed) {
      disposed = true;
      stats.disposed = true;
      for (const floorEntry of floorsById.values()) {
        disposeFloorTargets(floorEntry);
      }
      for (const cachedFloor of contentCache.values()) {
        disposeFloorTargets(cachedFloor);
      }
      contentCache.clear();
      dirtyFloors.clear();
      lastRoot = null;
      floorsById.clear();
      for (const dispose2 of depthMaterialCache.values()) {
        dispose2.dispose();
      }
      depthMaterialCache.clear();
      blackTexture.dispose();
      blurQuad.geometry.dispose();
      blurMaterial.dispose();
    }
  }
  const __plan2Contact = {
    sync,
    invalidate,
    dispose: disposeController,
    stats,
    settings,
    setEnabled,
    setSuspended,
    setMotion,
    setFrameProvider(provider) {
      frameProvider = provider;
      invalidate();
    },
    getUniforms: id => ensureFloor(id).uniforms
  };
  if (typeof window !== "undefined") {
    window.__plan2Contact = __plan2Contact;
  }
  return __plan2Contact;
}
