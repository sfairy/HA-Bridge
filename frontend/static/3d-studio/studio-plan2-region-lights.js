const REGION_LIGHT_LAYER = 30;
const RECEIVER_KINDS = ["floor", "wall", "furniture"];
const finiteNumber = (n, fallback = 0) => Number.isFinite(Number(n)) ? Number(n) : fallback;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const alignCapacity = count => Math.max(16, Math.ceil(count / 16) * 16);
export const regionLightKey = (floorId, lightId) => JSON.stringify([String(floorId), String(lightId)]);
function isRegionLightKey(key) {
  try {
    const length4 = JSON.parse(key);
    return Array.isArray(length4) && length4.length === 2 && length4.every(part => typeof part == "string") && regionLightKey(...length4) === key;
  } catch {
    return false;
  }
}
function normalizeOverrides(raw) {
  const normalized = Object.create(null);
  if (!raw || typeof raw != "object" || Array.isArray(raw)) {
    return normalized;
  }
  for (const [overrideKey, override] of Object.entries(raw)) {
    if (!isRegionLightKey(overrideKey) || !override || typeof override != "object" || Array.isArray(override) || !["circle", "square", "ellipse", "strip"].includes(override.shape) || !["width", "depth"].every(prop => typeof override[prop] == "number" && Number.isFinite(override[prop])) || ["rotation", "softness"].some(prop => override[prop] !== undefined && (typeof override[prop] != "number" || !Number.isFinite(override[prop]))) || ["offsetX", "offsetZ"].some(prop => override[prop] !== undefined && (typeof override[prop] != "number" || !Number.isFinite(override[prop]))) || override.moveCenterEnabled !== undefined && typeof override.moveCenterEnabled != "boolean") {
      continue;
    }
    const rotation = override.rotation ?? 0;
    const width2 = clamp(override.width, 0.5, 20);
    normalized[overrideKey] = {
      width: width2,
      depth: clamp(override.depth, 0.5, 20),
      rotation: (rotation % 360 + 540) % 360 - 180,
      softness: clamp(override.softness ?? 1, 0.05, 1),
      shape: override.shape,
      ...(override.offsetX !== undefined ? {
        offsetX: clamp(override.offsetX, -100, 100)
      } : {}),
      ...(override.offsetZ !== undefined ? {
        offsetZ: clamp(override.offsetZ, -100, 100)
      } : {}),
      ...(override.moveCenterEnabled !== undefined ? {
        moveCenterEnabled: override.moveCenterEnabled
      } : {})
    };
  }
  return normalized;
}
function findUserData(object, key) {
  for (let userData4 = object; userData4; userData4 = userData4.parent) {
    if (userData4.userData?.[key] !== undefined) {
      return userData4.userData[key];
    }
  }
}
function isLitMaterial(material) {
  return material && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial || material.isMeshPhongMaterial || material.isMeshLambertMaterial);
}
function isUnderRoot(object, root) {
  for (let parent = object; parent; parent = parent.parent) {
    if (parent.visible === false) {
      return false;
    }
    if (parent === root) {
      return true;
    }
  }
  return false;
}
function inferReceiverKind(mesh) {
  const kindHint = findUserData(mesh, "regionReceiverKind");
  if (RECEIVER_KINDS.includes(kindHint)) {
    return kindHint;
  }
  const modelLayer = findUserData(mesh, "modelLayer");
  if (modelLayer === "items" || modelLayer === "lights") {
    return "furniture";
  }
  if (modelLayer === "walls" || /wall/i.test(mesh.name || "")) {
    return "wall";
  }
  if (/floor/i.test(mesh.name || "")) {
    return "floor";
  }
  const geometry = mesh.geometry;
  if (geometry) {
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox?.();
    }
    const box = geometry.boundingBox;
    if (box) {
      const dims = [box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z].sort((a, b) => a - b);
      if (!modelLayer && dims[0] < 0.18 && dims[1] > 1.5) {
        return "floor";
      }
    }
  }
  if (modelLayer) {
    return "furniture";
  } else {
    return "wall";
  }
}
function setVector4Changed(target, nextX, nextY, nextZ, nextW) {
  const changed = target.x !== nextX || target.y !== nextY || target.z !== nextZ || target.w !== nextW;
  target.set(nextX, nextY, nextZ, nextW);
  return changed;
}
function regionLightShaderPrelude(capacity) {
  return "\n#define PLAN2_LIGHT_CAPACITY " + capacity.capacity + "\n#define PLAN2_TEXTURE_DATA " + (capacity.textureMode ? 1 : 0) + "\nuniform int plan2LightCount;\nuniform float plan2Gain;\nuniform float plan2SunShadowStrength;\nuniform mat4 plan2MotionToLayout;\nvarying vec3 vPlan2WorldPosition;\n#if PLAN2_TEXTURE_DATA\nuniform sampler2D plan2LightData;\nvec4 plan2ReadData(int slot, float column) {\n  return texture2D(plan2LightData, vec2((column + 0.5) / 4.0, (float(slot) + 0.5) / float(PLAN2_LIGHT_CAPACITY)));\n}\n#else\nuniform vec4 plan2Centers[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Extents[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Colors[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Axes[PLAN2_LIGHT_CAPACITY];\n#endif\nvec3 plan2SurfaceLight(vec3 worldPoint) {\n  worldPoint = (plan2MotionToLayout * vec4(worldPoint, 1.0)).xyz;\n  vec3 weightedColor = vec3(0.0);\n  float totalWeight = 0.0;\n  float coverage = 0.0;\n  for (int slot = 0; slot < PLAN2_LIGHT_CAPACITY; slot++) {\n    if (slot >= plan2LightCount) break;\n    #if PLAN2_TEXTURE_DATA\n      vec4 center = plan2ReadData(slot, 0.0);\n    #else\n      vec4 center = plan2Centers[slot];\n    #endif\n    if (center.w < 0.00001) continue;\n    #if PLAN2_TEXTURE_DATA\n      vec4 extent = plan2ReadData(slot, 1.0);\n      vec4 axis = plan2ReadData(slot, 3.0);\n    #else\n      vec4 extent = plan2Extents[slot];\n      vec4 axis = plan2Axes[slot];\n    #endif\n    vec3 offset = worldPoint - center.xyz;\n    vec3 localPoint = vec3(dot(offset.xz, axis.xy), offset.y, dot(offset.xz, vec2(-axis.y, axis.x)));\n    float verticalDistance = max(abs(localPoint.y) - extent.y, 0.0);\n    if (verticalDistance >= extent.w) continue;\n    float radialDistance;\n    if (axis.z > 3.5) {\n      // Square volumes retain actual straight edges and corners. Their fade\n      // follows the normalized box metric, not a radial or rounded boundary.\n      vec2 fromCenter = abs(localPoint.xz) / max(extent.xz, vec2(0.001));\n      radialDistance = max(fromCenter.x, fromCenter.y);\n    } else if (axis.z > 2.5) {\n      // Edited strips are rounded rectangles with their zero-light boundary\n      // exactly at the requested width/depth, including both rounded ends.\n      float radius = max(min(extent.x, extent.z), 0.001);\n      vec2 fromCore = max(abs(localPoint.xz) - (extent.xz - vec2(radius)), vec2(0.0));\n      radialDistance = length(fromCore) / radius;\n    } else if (axis.z > 0.5 && axis.z < 1.5) {\n      // A strip is a line source. Brightness falls away from the line, rather\n      // than remaining constant throughout a wide rectangular room volume.\n      vec2 fromSegment = vec2(max(abs(localPoint.x) - extent.x, 0.0), localPoint.z);\n      radialDistance = length(fromSegment) / max(extent.z, 0.001);\n    } else {\n      radialDistance = length(localPoint.xz / max(extent.xz, vec2(0.001)));\n    }\n    if (radialDistance >= 1.0) continue;\n    float fadeStart = axis.z > 1.5 ? 1.0 - clamp(axis.w, 0.05, 1.0) : 0.0;\n    float influence = (1.0 - smoothstep(fadeStart, 1.0, radialDistance))\n      * (1.0 - smoothstep(0.0, extent.w, verticalDistance)) * clamp(center.w, 0.0, 1.0);\n    #if PLAN2_TEXTURE_DATA\n      vec3 lightColor = plan2ReadData(slot, 2.0).rgb;\n    #else\n      vec3 lightColor = plan2Colors[slot].rgb;\n    #endif\n    weightedColor += lightColor * influence;\n    totalWeight += influence;\n    coverage += (1.0 - coverage) * influence;\n  }\n  // Smooth bounded union: max() produced a derivative crease wherever two\n  // lamps exchanged dominance. This preserves single-lamp falloff and blends\n  // overlaps continuously, with coverage capped at one rather than added HDR.\n  return weightedColor / max(totalWeight, 0.00001) * coverage;\n}\n";
}
export function sampleRegionVolumes(volumes, worldPoint, gain = 1) {
  let coverage = 0;
  let weightSum = 0;
  const colorSum = [0, 0, 0];
  for (const volume of volumes) {
    const {
      center,
      extent,
      color,
      axis
    } = volume;
    if (center.w <= 0) {
      continue;
    }
    const deltaX = worldPoint.x - center.x;
    const deltaY = worldPoint.y - center.y;
    const deltaZ = worldPoint.z - center.z;
    const localX = deltaX * axis.x + deltaZ * axis.y;
    const localZ = -deltaX * axis.y + deltaZ * axis.x;
    const cornerRadius = Math.max(Math.min(extent.x, extent.z), 0.001);
    const radialDistance = axis.z > 3.5 ? Math.max(Math.abs(localX) / Math.max(extent.x, 0.001), Math.abs(localZ) / Math.max(extent.z, 0.001)) : axis.z > 2.5 ? Math.hypot(Math.max(Math.abs(localX) - (extent.x - cornerRadius), 0), Math.max(Math.abs(localZ) - (extent.z - cornerRadius), 0)) / cornerRadius : axis.z > 0.5 && axis.z < 1.5 ? Math.hypot(Math.max(Math.abs(localX) - extent.x, 0), localZ) / Math.max(extent.z, 0.001) : Math.hypot(localX / Math.max(extent.x, 0.001), localZ / Math.max(extent.z, 0.001));
    const fadeStartShape = axis.z > 1.5 ? 1 - clamp(axis.w, 0.05, 1) : 0;
    const radialT = clamp((radialDistance - fadeStartShape) / (1 - fadeStartShape), 0, 1);
    const verticalT = clamp(Math.max(Math.abs(deltaY) - extent.y, 0) / extent.w, 0, 1);
    const influence = (1 - radialT * radialT * (3 - radialT * 2)) * (1 - verticalT * verticalT * (3 - verticalT * 2)) * clamp(center.w, 0, 1);
    weightSum += influence;
    coverage += (1 - coverage) * influence;
    colorSum[0] += color.x * influence;
    colorSum[1] += color.y * influence;
    colorSum[2] += color.z * influence;
  }
  return colorSum.map(channel => weightSum > 0 ? channel / weightSum * coverage * gain : 0);
}
export function createRegionLightController({
  THREE,
  renderer,
  scene,
  getRoot,
  contactShadows: getUniforms = null,
  requestFrame = () => {}
}) {
  const values2 = new Map();
  const delete2 = new Set();
  const map = new Map();
  const map2 = new WeakMap();
  const get2 = new Map();
  const get3 = new Map();
  const clear = new Set();
  const y = new THREE.Vector3();
  const setFromMatrixPosition = new THREE.Vector3();
  const copy = new THREE.Vector3();
  const elements = new THREE.Matrix4();
  let motionTransformProvider = null;
  const plan2ViewToWorld = {
    value: new THREE.Matrix4()
  };
  const floorBrightness = {
    value: 1
  };
  const length6 = [];
  const rangeScale = {
    gain: 3,
    floorGain: 1,
    wallGain: 0.9,
    furnitureGain: 1,
    rangeScale: 0.8,
    sunShadowStrength: 0.6
  };
  const structureScans = {
    mode: "region",
    registered: 0,
    slotCount: 0,
    active: 0,
    capacity: 0,
    floorCount: 0,
    materials: 0,
    detailedMaterials: 0,
    meshCount: 0,
    nativeLights: 0,
    structureScans: 0,
    uniformUpdates: 0,
    volumeCacheHits: 0,
    shaderCompiles: 0,
    textureFloors: 0,
    disposed: false
  };
  let traverse2 = null;
  let dirty = true;
  let disposed = false;
  let push3 = [];
  let set2 = new Map();
  let overrides = Object.create(null);
  let has2 = null;
  let inMotion = false;
  let motionKeepLit = false;
  let fadeStart = null;
  const invalidate = () => {
    dirty = true;
  };
  const apply = scene.onBeforeRender;
  function ensureUniformGroup(floorId4, kind, lightCount) {
    const key = floorId4 + "\0" + kind;
    let texture3 = get3.get(key);
    if (!texture3) {
      texture3 = {
        key,
        floorId: floorId4,
        kind,
        capacity: 0,
        textureMode: false,
        slots: [],
        materials: new Set(),
        uniforms: {
          plan2LightCount: {
            value: lightCount
          },
          plan2Gain: {
            value: 1
          },
          plan2SunShadowStrength: {
            value: 0
          },
          plan2Centers: {
            value: []
          },
          plan2Extents: {
            value: []
          },
          plan2Colors: {
            value: []
          },
          plan2Axes: {
            value: []
          },
          plan2ViewToWorld,
          plan2MotionToLayout: {
            value: new THREE.Matrix4()
          },
          plan2LightData: {
            value: null
          }
        }
      };
      if (kind !== "wall" && getUniforms) {
        Object.assign(texture3.uniforms, getUniforms.getUniforms(floorId4));
      }
      get3.set(key, texture3);
    }
    const length5 = alignCapacity(lightCount);
    if (texture3.capacity !== length5) {
      texture3.capacity = length5;
      const maxFragmentUniforms = finiteNumber(renderer?.capabilities?.maxFragmentUniforms, 1024);
      texture3.textureMode = length5 * 4 + 128 > maxFragmentUniforms;
      texture3.texture?.dispose();
      texture3.texture = null;
      texture3.slots = Array.from({
        length: length5
      }, () => ({
        center: new THREE.Vector4(),
        extent: new THREE.Vector4(),
        color: new THREE.Vector4(),
        axis: new THREE.Vector4()
      }));
      for (const [uniformName, slotProp] of [["plan2Centers", "center"], ["plan2Extents", "extent"], ["plan2Colors", "color"], ["plan2Axes", "axis"]]) {
        texture3.uniforms[uniformName].value = texture3.slots.map(slot => slot[slotProp]);
      }
      if (texture3.textureMode) {
        const maxTextureSize = finiteNumber(renderer?.capabilities?.maxTextureSize, 4096);
        if (length5 > maxTextureSize) {
          throw new RangeError("区域灯数量 " + lightCount + " 超出本机数据纹理容量 " + maxTextureSize);
        }
        texture3.texture = new THREE.DataTexture(new Float32Array(length5 * 16), 4, length5, THREE.RGBAFormat, THREE.FloatType);
        texture3.texture.minFilter = texture3.texture.magFilter = THREE.NearestFilter;
        texture3.texture.generateMipmaps = false;
        texture3.texture.needsUpdate = true;
      }
      texture3.uniforms.plan2LightData.value = texture3.texture;
      for (const needsUpdate of texture3.materials) {
        needsUpdate.needsUpdate = true;
      }
    }
    texture3.uniforms.plan2LightCount.value = lightCount;
    return texture3;
  }
  function wrapRegionMaterial(transmission, floorId, kind, add, plan2DetailedSurface = false, floorTone = false) {
    const sourceMaterial = transmission?.environmentSourceMaterial;
    if (sourceMaterial && map2.has(sourceMaterial)) {
      add.add(sourceMaterial);
      return transmission;
    }
    transmission = map2.get(transmission) || transmission;
    if (!isLitMaterial(transmission)) {
      return transmission;
    }
    let items = get2.get(transmission);
    if (!items) {
      items = new Map();
      get2.set(transmission, items);
    }
    const groupKey = floorId + "\0" + kind;
    const variantKey = groupKey + "\0" + (plan2DetailedSurface ? "detailed" : "simple") + (floorTone ? "-floor-tone" : "");
    let userData3 = items.get(variantKey);
    const uniforms3 = get3.get(groupKey);
    if (!userData3) {
      userData3 = transmission.clone();
      userData3.name = (transmission.name || transmission.type || "material") + " / region " + kind;
      const call = transmission.onBeforeCompile;
      userData3.onBeforeCompile = function (fragmentShader, rendererRef) {
        call?.call(this, fragmentShader, rendererRef);
        Object.assign(fragmentShader.uniforms, uniforms3.uniforms);
        if (floorTone) {
          fragmentShader.uniforms.plan2FloorBrightness = floorBrightness;
          fragmentShader.fragmentShader = "uniform float plan2FloorBrightness;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= plan2FloorBrightness;");
        }
        fragmentShader.uniforms.plan2ContactViewToWorld = uniforms3.uniforms.plan2ViewToWorld;
        fragmentShader.vertexShader = "uniform mat4 plan2ViewToWorld;\nvarying vec3 vPlan2WorldPosition;\n" + fragmentShader.vertexShader;
        const projectVertexInclude = "#include <project_vertex>";
        if (!fragmentShader.vertexShader.includes(projectVertexInclude)) {
          throw new Error("区域灯材质缺少 project_vertex");
        }
        fragmentShader.vertexShader = fragmentShader.vertexShader.replace(projectVertexInclude, projectVertexInclude + "\nvPlan2WorldPosition = (plan2ViewToWorld * mvPosition).xyz;");
        fragmentShader.fragmentShader = regionLightShaderPrelude(uniforms3) + fragmentShader.fragmentShader;
        const lightsFragmentEnd = "#include <lights_fragment_end>";
        if (!fragmentShader.fragmentShader.includes(lightsFragmentEnd)) {
          throw new Error("区域灯材质缺少 lights_fragment_end");
        }
        const sunShadowSnippet = kind === "wall" ? "" : "\n          #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n            if (receiveShadow && plan2SunShadowStrength > 0.0 && directionalLightShadows[0].shadowIntensity > 0.0) {\n              // The studio's single shadow-casting directional light is the\n              // first shadow slot. Reuse its resident VSM map; no new capture.\n              DirectionalLightShadow plan2SunShadow = directionalLightShadows[0];\n              plan2ShadowMask = getShadow(directionalShadowMap[0], plan2SunShadow.shadowMapSize,\n                min(1.0, plan2SunShadow.shadowIntensity * plan2SunShadowStrength / 0.18),\n                plan2SunShadow.shadowBias, plan2SunShadow.shadowRadius, vDirectionalShadowCoord[0]);\n            }\n          #endif";
        fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace(lightsFragmentEnd, lightsFragmentEnd + "\nvec3 plan2ReceivingColor = mix(diffuseColor.rgb, sqrt(max(diffuseColor.rgb, vec3(0.0))), 0.6);\n          float plan2ShadowMask = 1.0;" + sunShadowSnippet + "\n          reflectedLight.indirectDiffuse += plan2ReceivingColor * plan2SurfaceLight(vPlan2WorldPosition) * plan2Gain * plan2ShadowMask;");
        if (kind !== "wall" && getUniforms) {
          fragmentShader.fragmentShader = "uniform sampler2D plan2ContactMap;\n            uniform mat4 plan2ContactTransform;\n            uniform vec4 plan2ContactBounds;\n            uniform float plan2ContactY, plan2ContactOpacity;\n            uniform sampler2D plan2SurfaceMap;\n            uniform vec4 plan2SurfaceBounds;\n            uniform sampler2D plan2SurfaceLookup;\n            uniform vec2 plan2SurfaceLayout;\n            uniform mat4 plan2ContactViewToWorld;\n            uniform float plan2SurfaceOpacity;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <opaque_fragment>", "\n            vec3 contactPosition = (plan2ContactTransform * vec4(vPlan2WorldPosition, 1.0)).xyz;\n            vec2 contactUv = (contactPosition.xz - plan2ContactBounds.xy) / plan2ContactBounds.zw;\n            float contactHeight = contactPosition.y - plan2ContactY;\n            if (contactHeight >= -0.015 && contactHeight < 0.12\n                && all(greaterThanEqual(contactUv, vec2(0.0))) && all(lessThanEqual(contactUv, vec2(1.0)))) {\n              // Rugs and the lowest furniture surfaces also receive contact\n              // shading. Fade it over the first 12cm; upper surfaces stay lit.\n              float contactWeight = 1.0 - smoothstep(0.035, 0.12, max(contactHeight, 0.0));\n              outgoingLight *= 1.0 - texture2D(plan2ContactMap, contactUv).r * plan2ContactOpacity * contactWeight;\n            }\n            if (contactHeight > 0.12 && plan2SurfaceOpacity > 0.0) {\n              // These are already baked shadow pixels, not an occluder depth\n              // map. No shadow comparison or light-space projection per frame.\n              vec4 tile = texture2D(plan2SurfaceLookup, vec2(clamp(contactHeight / plan2SurfaceLayout.y, 0.0, 1.0), 0.5));\n              vec2 localUv = (contactPosition.xz - plan2SurfaceBounds.xy) / plan2SurfaceBounds.zw;\n              if (tile.b > 0.5 && all(greaterThanEqual(localUv, vec2(0.0))) && all(lessThanEqual(localUv, vec2(1.0)))) {\n                float upward = smoothstep(0.8, 0.98, normalize(mat3(plan2ContactTransform) * mat3(plan2ContactViewToWorld) * normal).y);\n                vec2 tileOrigin = floor(tile.rg * 255.0 + 0.5);\n                vec2 surfaceUv = (tileOrigin + clamp(localUv, vec2(0.002), vec2(0.998))) / plan2SurfaceLayout.x;\n                outgoingLight *= 1.0 - texture2D(plan2SurfaceMap, surfaceUv).r * plan2SurfaceOpacity * upward;\n              }\n            }\n            #include <opaque_fragment>");
        }
        if (!plan2DetailedSurface && (transmission.transmission == null || transmission.transmission === 0)) {
          fragmentShader.fragmentShader = "uniform mat4 plan2ViewToWorld;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <lights_fragment_begin>", "\n              vec3 simpleNormal = normalize(mat3(plan2MotionToLayout) * mat3(plan2ViewToWorld) * normal);\n              float simpleUp = simpleNormal.y * 0.5 + 0.5;\n              float simpleKey = max(dot(simpleNormal, normalize(vec3(-0.4, 0.85, 0.32))), 0.0);\n              vec3 simpleTint = mix(vec3(0.82, 0.85, 0.91), vec3(1.0, 1.0, 1.0), simpleUp);\n              reflectedLight.indirectDiffuse = diffuseColor.rgb * simpleTint * (0.30 + 0.40 * simpleUp + 0.18 * simpleKey);\n            ").replace("#include <lights_fragment_maps>", "").replace("#include <lights_fragment_end>", "");
        }
        structureScans.shaderCompiles += 1;
      };
      const baseCacheKey = transmission.customProgramCacheKey?.call(transmission) || "";
      userData3.customProgramCacheKey = () => baseCacheKey + "|plan2-baked-surface-v6-layout|" + Number(plan2DetailedSurface) + "|" + Number(floorTone) + "|" + kind + "|" + uniforms3.capacity + "|" + Number(uniforms3.textureMode) + "|" + !!getUniforms;
      userData3.userData.plan2RegionMaterial = true;
      userData3.userData.plan2DetailedSurface = plan2DetailedSurface;
      map2.set(userData3, transmission);
      items.set(variantKey, userData3);
      uniforms3.materials.add(userData3);
    }
    add.add(userData3);
    return userData3;
  }
  function rebuildStructure() {
    structureScans.structureScans += 1;
    const add2 = new Set();
    const push2 = [];
    const add3 = new Set();
    traverse2?.traverse(isMesh => {
      add2.add(isMesh);
      if (values2.has(isMesh)) {
        add3.add(isMesh);
      }
      if (isMesh.isMesh) {
        push2.push(isMesh);
      }
    });
    for (const removeEventListener2 of delete2) {
      if (!add2.has(removeEventListener2)) {
        removeEventListener2.removeEventListener("childadded", invalidate);
        removeEventListener2.removeEventListener("childremoved", invalidate);
        delete2.delete(removeEventListener2);
      }
    }
    for (const addEventListener of add2) {
      if (!delete2.has(addEventListener)) {
        addEventListener.addEventListener("childadded", invalidate);
        addEventListener.addEventListener("childremoved", invalidate);
        delete2.add(addEventListener);
      }
    }
    for (const [layers2, originalLayers] of values2) {
      if (!add3.has(layers2)) {
        layers2.layers.mask = originalLayers.originalLayers;
        values2.delete(layers2);
      }
    }
    set2 = new Map();
    for (const light3 of values2.values()) {
      light3.floorId = String(light3.light.userData?.regionFloorId ?? light3.light.userData?.lightFloorId ?? findUserData(light3.light, "regionFloorId") ?? findUserData(light3.light, "floorId") ?? "default");
      light3.id = String(light3.item.id ?? light3.light.uuid);
      light3.key = regionLightKey(light3.floorId, light3.id);
      let floorRoot2 = traverse2;
      for (let userData2 = light3.light.parent; userData2 && userData2 !== traverse2; userData2 = userData2.parent) {
        if (userData2.userData?.regionFloorId !== undefined || userData2.userData?.floorId !== undefined) {
          floorRoot2 = userData2;
          break;
        }
      }
      light3.floorRoot = floorRoot2;
      const push = set2.get(light3.floorId) || [];
      push.push(light3);
      set2.set(light3.floorId, push);
    }
    const defaultFloorId = set2.size === 1 ? set2.keys().next().value : "default";
    if (!set2.size) {
      set2.set(defaultFloorId, []);
    }
    for (const [floorId, length3] of set2) {
      for (const kind of RECEIVER_KINDS) {
        ensureUniformGroup(floorId, kind, length3.length);
      }
    }
    const add4 = new Set();
    const add5 = new Set();
    for (const material2 of push2) {
      if (["background", "grid", "outline", "light-source-preview"].includes(findUserData(material2, "exportRole"))) {
        continue;
      }
      const meshFloorId = String(findUserData(material2, "regionFloorId") ?? findUserData(material2, "floorId") ?? defaultFloorId);
      if (!set2.has(meshFloorId)) {
        set2.set(meshFloorId, []);
        for (const emptyKind of RECEIVER_KINDS) {
          ensureUniformGroup(meshFloorId, emptyKind, 0);
        }
      }
      const receiverKind = inferReceiverKind(material2);
      const map = material2.material;
      const preserveDetailed = findUserData(material2, "preserveDetailedSurface") === true;
      const isFloorReceiver = findUserData(material2, "regionReceiverKind") === "floor";
      const some = Array.isArray(map) ? map.map(mat => wrapRegionMaterial(mat, meshFloorId, receiverKind, add4, preserveDetailed, isFloorReceiver)) : wrapRegionMaterial(map, meshFloorId, receiverKind, add4, preserveDetailed, isFloorReceiver);
      if (Array.isArray(map) ? some.some((mat, index) => mat !== map[index]) : some !== map) {
        material2.material = some;
      }
      if (Array.isArray(some) ? some.some(mat => map2.has(mat)) : map2.has(some)) {
        add5.add(material2);
        map.set(material2, {
          assigned: material2.material
        });
      }
    }
    const add6 = new Set();
    for (const traverse of clear) {
      traverse.traverse(material => {
        if (map.has(material)) {
          add6.add(material);
          for (const environmentSourceMaterial of Array.isArray(material.material) ? material.material : [material.material]) {
            const resolved = environmentSourceMaterial?.environmentSourceMaterial || environmentSourceMaterial;
            if (map2.has(resolved)) {
              add4.add(resolved);
            }
          }
        }
      });
    }
    for (const [mesh, assignment] of map) {
      if (!add5.has(mesh) && !add6.has(mesh)) {
        restoreOriginalMaterial(mesh, assignment);
        map.delete(mesh);
      }
    }
    for (const [sourceMat, entryMap] of get2) {
      for (const [slice, dispose2] of entryMap) {
        if (!add4.has(dispose2)) {
          get3.get(slice.slice(0, slice.lastIndexOf("\0")))?.materials.delete(dispose2);
          dispose2.dispose();
          entryMap.delete(slice);
        }
      }
      if (!entryMap.size) {
        get2.delete(sourceMat);
      }
    }
    for (const [groupEntryKey, floorId2] of get3) {
      if (!set2.has(floorId2.floorId) && !floorId2.materials.size) {
        floorId2.texture?.dispose();
        get3.delete(groupEntryKey);
      }
    }
    push3 = [];
    scene.traverse(isLight => {
      if (isLight.isLight && !values2.has(isLight)) {
        push3.push(isLight);
      }
    });
    structureScans.registered = structureScans.slotCount = values2.size;
    structureScans.materials = add4.size;
    structureScans.meshCount = add5.size;
    structureScans.floorCount = set2.size;
    structureScans.detailedMaterials = [...add4].filter(userData => userData.userData.plan2DetailedSurface || userData.transmission > 0).length;
    structureScans.capacity = [...set2].reduce((total, [, length2]) => total + alignCapacity(length2.length), 0);
    structureScans.textureFloors = [...set2.keys()].filter(floorId => get3.get(floorId + "\0floor")?.textureMode).length;
    dirty = false;
  }
  function restoreOriginalMaterial(material3, assigned) {
    if (material3.material === assigned.assigned) {
      material3.material = Array.isArray(material3.material) ? material3.material.map(mat => map2.get(mat) || mat) : map2.get(material3.material) || material3.material;
    }
  }
  function register(layers3, item = {}) {
    if (disposed || !layers3?.isLight) {
      return;
    }
    if (!values2.get(layers3)) {
      values2.set(layers3, {
        light: layers3,
        item: {
          ...item
        },
        originalLayers: layers3.layers.mask,
        fullIntensity: Math.max(0.00001, finiteNumber(layers3.userData?.regionFullIntensity, finiteNumber(layers3.userData?.lightOnIntensity, layers3.intensity) || 1))
      });
    }
    layers3.layers.set(REGION_LIGHT_LAYER);
    layers3.castShadow = false;
    dirty = true;
  }
  function syncCamera(matrixWorld) {
    if (!disposed && matrixWorld?.matrixWorld) {
      plan2ViewToWorld.value = matrixWorld.matrixWorld;
    }
  }
  function sync(layers4, skipStructure = false) {
    if (disposed) {
      return;
    }
    if (!skipStructure) {
      getUniforms?.sync();
      const nextRoot = getRoot?.() || null;
      if (nextRoot !== traverse2) {
        traverse2 = nextRoot;
        dirty = true;
      }
      if (dirty && (!inMotion || motionKeepLit)) {
        rebuildStructure();
      }
    }
    syncCamera(layers4);
    if (inMotion && !motionKeepLit) {
      return;
    }
    const fade = fadeStart === null ? 1 : Math.min(1, Math.max(0, (performance.now() - fadeStart) / 280));
    if (fade < 1) {
      requestFrame();
    } else {
      fadeStart = null;
    }
    structureScans.active = 0;
    let uniformsChanged = false;
    for (const [floorId3, forEach] of set2) {
      const uniformGroups = RECEIVER_KINDS.map(kind => get3.get(floorId3 + "\0" + kind));
      const motionMatrix = inMotion && motionKeepLit ? motionTransformProvider?.(floorId3) : null;
      for (const uniforms of uniformGroups) {
        if (motionMatrix) {
          uniforms.uniforms.plan2MotionToLayout.value.copy(motionMatrix);
        } else {
          uniforms.uniforms.plan2MotionToLayout.value.identity();
        }
        const element = rangeScale.gain * rangeScale[uniforms.kind + "Gain"] * fade;
        uniformsChanged ||= uniforms.uniforms.plan2Gain.value !== element;
        uniforms.uniforms.plan2Gain.value = element;
        const element2 = uniforms.kind === "wall" ? 0 : clamp(finiteNumber(rangeScale.sunShadowStrength, 0.6), 0, 1) * fade;
        uniformsChanged ||= uniforms.uniforms.plan2SunShadowStrength.value !== element2;
        uniforms.uniforms.plan2SunShadowStrength.value = element2;
        uniforms.changed = false;
      }
      forEach.forEach((floorRoot, slotIndex) => {
        const {
          light: color,
          item: type
        } = floorRoot;
        color.updateWorldMatrix(true, false);
        elements.copy(color.matrixWorld);
        if (motionMatrix) {
          elements.premultiply(motionMatrix);
        }
        y.setFromMatrixPosition(elements);
        if (floorRoot.floorRoot) {
          floorRoot.floorRoot.updateWorldMatrix(true, false);
          setFromMatrixPosition.setFromMatrixPosition(floorRoot.floorRoot.matrixWorld);
        }
        if (motionMatrix) {
          setFromMatrixPosition.applyMatrix4(motionMatrix);
        }
        const floorY = floorRoot.floorRoot ? setFromMatrixPosition.y : 0;
        const realAmount = isUnderRoot(color, traverse2) ? clamp(finiteNumber(color.intensity) / floorRoot.fullIntensity, 0, 1) : 0;
        const amount = has2 === null ? realAmount : has2.has(floorRoot.key) ? Math.max(0.6, realAmount) : 0;
        if (amount > 0.00001) {
          structureScans.active += 1;
        }
        length6.length = 0;
        length6.push(...elements.elements, floorY, amount, realAmount, rangeScale.rangeScale, type.type, type.lightRange, type.width, type.depth, color.width, color.height, color.color.r, color.color.g, color.color.b, overrides[floorRoot.key], structureScans.structureScans);
        if (floorRoot.volumeInputs && length6.every((prev, index) => prev === floorRoot.volumeInputs[index])) {
          structureScans.volumeCacheHits++;
          return;
        }
        floorRoot.volumeInputs = length6.slice();
        const lightRange = clamp(finiteNumber(type.lightRange, 3.5), 0.5, 10) * clamp(finiteNumber(rangeScale.rangeScale, 1), 0.2, 3);
        const isStrip = type.type === "striplight" || color.isRectAreaLight;
        const ellipseRadius = lightRange * (type.type === "ceilinglight" ? 0.45 : 0.33);
        const halfWidth = Math.max(0.05, finiteNumber(type.width, color.width || 2) / 2);
        const halfDepth = Math.max(0.025, finiteNumber(type.depth, color.height || 0.2) / 2);
        const matrixElements = elements.elements;
        const forwardLen = Math.hypot(matrixElements[0], matrixElements[2]);
        const forwardX = forwardLen > 0.00001 ? matrixElements[0] / forwardLen : 1;
        const forwardZ = forwardLen > 0.00001 ? matrixElements[2] / forwardLen : 0;
        const shape = overrides[floorRoot.key];
        const shapeRadians = (shape?.rotation || 0) * Math.PI / 180;
        const axisX = shapeRadians ? forwardX * Math.cos(shapeRadians) - forwardZ * Math.sin(shapeRadians) : forwardX;
        const axisY = shapeRadians ? forwardX * Math.sin(shapeRadians) + forwardZ * Math.cos(shapeRadians) : forwardZ;
        const softPad = Math.max(0.3, lightRange * 0.23);
        const halfExtent = isStrip ? halfDepth + lightRange * 0.07 + softPad : ellipseRadius + softPad;
        const center2 = floorRoot.region ||= {
          center: [0, 0, 0],
          lampCenter: [0, 0, 0],
          axis: [1, 0],
          defaults: {
            axis: [1, 0],
            rotation: 0,
            softness: 1
          }
        };
        const width = center2.defaults;
        width.width = (isStrip ? halfWidth + halfExtent : halfExtent) * 2;
        width.depth = halfExtent * 2;
        width.shape = isStrip ? "strip" : "ellipse";
        width.axis[0] = forwardX;
        width.axis[1] = forwardZ;
        center2.floorId = floorId3;
        center2.id = floorRoot.id;
        center2.key = floorRoot.key;
        center2.type = type.type;
        center2.lampCenter[0] = y.x;
        center2.lampCenter[1] = y.y;
        center2.lampCenter[2] = y.z;
        center2.offsetX = shape?.offsetX ?? 0;
        center2.offsetZ = shape?.offsetZ ?? 0;
        center2.moveCenterEnabled = shape?.moveCenterEnabled === true;
        center2.center[0] = y.x + center2.offsetX;
        center2.center[1] = y.y;
        center2.center[2] = y.z + center2.offsetZ;
        center2.axis[0] = axisX;
        center2.axis[1] = axisY;
        center2.width = shape?.width ?? width.width;
        center2.depth = shape?.depth ?? width.depth;
        center2.rotation = shape?.rotation ?? 0;
        center2.softness = shape?.softness ?? 1;
        center2.shape = shape?.shape ?? width.shape;
        center2.overridden = !!shape;
        center2.amount = amount;
        center2.realAmount = realAmount;
        for (const texture of uniformGroups) {
          const center = texture.slots[slotIndex];
          const slotKind = texture.kind;
          const bottomY = floorY - (slotKind === "floor" ? 0.18 : 0.1);
          const topY = Math.max(floorY + 0.2, y.y + (slotKind === "wall" ? 0.55 : 0.2));
          const verticalPad = Math.max(0.3, lightRange * (slotKind === "floor" ? 0.23 : slotKind === "wall" ? 0.18 : 0.2));
          const extentX = shape ? shape.width / 2 : isStrip ? halfWidth : ellipseRadius + verticalPad;
          const extentZ = shape ? shape.depth / 2 : isStrip ? halfDepth + lightRange * 0.07 + verticalPad : ellipseRadius + verticalPad;
          let changed = setVector4Changed(center.center, center2.center[0], (bottomY + topY) / 2, center2.center[2], amount);
          changed = setVector4Changed(center.extent, extentX, (topY - bottomY) / 2, extentZ, verticalPad) || changed;
          changed = setVector4Changed(center.color, color.color.r, color.color.g, color.color.b, 0) || changed;
          changed = setVector4Changed(center.axis, axisX, axisY, shape ? shape.shape === "square" ? 4 : shape.shape === "strip" ? 3 : 2 : isStrip ? 1 : 0, shape?.softness ?? 0) || changed;
          texture.changed ||= changed;
          if (changed && texture.texture) {
            const textureData = texture.texture.image.data;
            const dataOffset = slotIndex * 16;
            center.center.toArray(textureData, dataOffset);
            center.extent.toArray(textureData, dataOffset + 4);
            center.color.toArray(textureData, dataOffset + 8);
            center.axis.toArray(textureData, dataOffset + 12);
          }
        }
      });
      for (const changed2 of uniformGroups) {
        if (changed2.changed && changed2.texture) {
          changed2.texture.needsUpdate = true;
        }
        uniformsChanged ||= changed2.changed;
      }
    }
    if (uniformsChanged) {
      structureScans.uniformUpdates += 1;
    }
    structureScans.nativeLights = push3.filter(layers => isUnderRoot(layers, scene) && (!layers4 || layers.layers.test(layers4.layers))).length;
  }
  function inspect() {
    return {
      ...structureScans,
      settings: {
        ...rangeScale
      },
      overrides: getOverrides(),
      previewKeys: has2 ? [...has2] : null,
      regions: listRegions(),
      floors: [...set2].map(([floorId, length]) => ({
        floorId,
        slots: length.length,
        capacity: get3.get(floorId + "\0floor")?.capacity,
        lights: length.map(light => ({
          id: light.item.id || light.light.uuid,
          type: light.item.type,
          intensity: light.light.intensity,
          fullIntensity: light.fullIntensity,
          amount: clamp(finiteNumber(light.light.intensity) / light.fullIntensity, 0, 1),
          effectiveAmount: light.region?.amount ?? 0,
          regionKey: light.key,
          visible: isUnderRoot(light.light, traverse2)
        }))
      }))
    };
  }
  function setOverrides(nextOverrides) {
    overrides = normalizeOverrides(nextOverrides);
    sync(undefined, true);
    return getOverrides();
  }
  function getOverrides() {
    return Object.fromEntries(Object.entries(overrides).map(([key, override]) => [key, {
      ...override
    }]));
  }
  function listRegions() {
    return [...values2.values()].filter(region => region.region).map(({
      region: defaults
    }) => ({
      ...defaults,
      center: [...defaults.center],
      lampCenter: [...defaults.lampCenter],
      axis: [...defaults.axis],
      defaults: {
        ...defaults.defaults,
        axis: [...defaults.defaults.axis]
      }
    }));
  }
  function setPreview(filter) {
    has2 = Array.isArray(filter) ? new Set(filter.filter(key => typeof key == "string" && isRegionLightKey(key))) : null;
    sync(undefined, true);
  }
  function sample(point, floorId = set2.keys().next().value, kind = "floor") {
    const uniforms4 = get3.get(floorId + "\0" + kind);
    if (uniforms4) {
      return sampleRegionVolumes(uniforms4.slots.slice(0, uniforms4.uniforms.plan2LightCount.value), copy.copy(point).applyMatrix4(uniforms4.uniforms.plan2MotionToLayout.value), uniforms4.uniforms.plan2Gain.value);
    } else {
      return [0, 0, 0];
    }
  }
  function disposeController() {
    if (!disposed) {
      disposed = true;
      structureScans.disposed = true;
      if (scene.onBeforeRender === onBeforeRender2) {
        scene.onBeforeRender = apply;
      }
      for (const removeEventListener of delete2) {
        removeEventListener.removeEventListener("childadded", invalidate);
        removeEventListener.removeEventListener("childremoved", invalidate);
      }
      for (const [assignedMesh, assignmentState] of map) {
        restoreOriginalMaterial(assignedMesh, assignmentState);
      }
      for (const values of get2.values()) {
        for (const dispose of values.values()) {
          dispose.dispose();
        }
      }
      for (const texture2 of get3.values()) {
        texture2.texture?.dispose();
      }
      for (const light2 of values2.values()) {
        light2.light.layers.mask = light2.originalLayers;
      }
      delete2.clear();
      map.clear();
      get2.clear();
      values2.clear();
      get3.clear();
      clear.clear();
      if (typeof window !== "undefined" && window.__plan2Region === __plan2Region) {
        delete window.__plan2Region;
      }
    }
  }
  function onBeforeRender2(...args) {
    apply?.apply(this, args);
    sync(args[2]);
  }
  const setFloorBrightness = percent => {
    const element3 = clamp(finiteNumber(percent, 100), 50, 150) / 100;
    if (element3 === floorBrightness.value) {
      return false;
    } else {
      floorBrightness.value = element3;
      structureScans.uniformUpdates += 1;
      return true;
    }
  };
  function setMotion(nextMotion, keepLit = false) {
    if (inMotion === (nextMotion === true) && motionKeepLit === keepLit) {
      return;
    }
    const wasKeepLit = motionKeepLit;
    motionKeepLit = keepLit;
    inMotion = nextMotion === true;
    fadeStart = inMotion || keepLit || wasKeepLit ? null : performance.now();
    if (inMotion && !motionKeepLit) {
      for (const uniforms2 of get3.values()) {
        uniforms2.uniforms.plan2Gain.value = 0;
        uniforms2.uniforms.plan2SunShadowStrength.value = 0;
      }
    }
    dirty = true;
    requestFrame();
  }
  const __plan2Region = {
    register,
    sync,
    syncCamera,
    dispose: disposeController,
    stats: structureScans,
    settings: rangeScale,
    inspect,
    sample,
    invalidate,
    setFloorBrightness,
    setMotion,
    setMotionTransformProvider(provider) {
      motionTransformProvider = provider;
    },
    setOverrides,
    getOverrides,
    listRegions,
    setPreview,
    retainRoot(root) {
      clear.add(root);
      invalidate();
    },
    releaseRoot(root) {
      clear.delete(root);
      invalidate();
    }
  };
  scene.onBeforeRender = onBeforeRender2;
  if (typeof window !== "undefined") {
    window.__plan2Region = __plan2Region;
  }
  return __plan2Region;
}
