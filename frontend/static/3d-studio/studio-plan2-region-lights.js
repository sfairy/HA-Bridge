const et = 30;
const ve = ["floor", "wall", "furniture"];
const I = (arg42, arg43 = 0) => Number.isFinite(Number(arg42)) ? Number(arg42) : arg43;
const b = (arg44, arg45, arg46) => Math.min(arg46, Math.max(arg45, arg44));
const Ne = arg47 => Math.max(16, Math.ceil(arg47 / 16) * 16);
export const regionLightKey = (arg28, arg29) => JSON.stringify([String(arg28), String(arg29)]);
function Fe(arg52) {
  try {
    const length4 = JSON.parse(arg52);
    return Array.isArray(length4) && length4.length === 2 && length4.every(arg18 => typeof arg18 == "string") && regionLightKey(...length4) === arg52;
  } catch {
    return false;
  }
}
function qe(arg53) {
  const value82 = Object.create(null);
  if (!arg53 || typeof arg53 != "object" || Array.isArray(arg53)) {
    return value82;
  }
  for (const [value71, moveCenterEnabled] of Object.entries(arg53)) {
    if (!Fe(value71) || !moveCenterEnabled || typeof moveCenterEnabled != "object" || Array.isArray(moveCenterEnabled) || !["circle", "square", "ellipse", "strip"].includes(moveCenterEnabled.shape) || !["width", "depth"].every(arg4 => typeof moveCenterEnabled[arg4] == "number" && Number.isFinite(moveCenterEnabled[arg4])) || ["rotation", "softness"].some(arg12 => moveCenterEnabled[arg12] !== undefined && (typeof moveCenterEnabled[arg12] != "number" || !Number.isFinite(moveCenterEnabled[arg12]))) || ["offsetX", "offsetZ"].some(arg19 => moveCenterEnabled[arg19] !== undefined && (typeof moveCenterEnabled[arg19] != "number" || !Number.isFinite(moveCenterEnabled[arg19]))) || moveCenterEnabled.moveCenterEnabled !== undefined && typeof moveCenterEnabled.moveCenterEnabled != "boolean") {
      continue;
    }
    const value61 = moveCenterEnabled.rotation ?? 0;
    const width2 = b(moveCenterEnabled.width, 0.5, 20);
    value82[value71] = {
      width: width2,
      depth: b(moveCenterEnabled.depth, 0.5, 20),
      rotation: (value61 % 360 + 540) % 360 - 180,
      softness: b(moveCenterEnabled.softness ?? 1, 0.05, 1),
      shape: moveCenterEnabled.shape,
      ...(moveCenterEnabled.offsetX !== undefined ? {
        offsetX: b(moveCenterEnabled.offsetX, -100, 100)
      } : {}),
      ...(moveCenterEnabled.offsetZ !== undefined ? {
        offsetZ: b(moveCenterEnabled.offsetZ, -100, 100)
      } : {}),
      ...(moveCenterEnabled.moveCenterEnabled !== undefined ? {
        moveCenterEnabled: moveCenterEnabled.moveCenterEnabled
      } : {})
    };
  }
  return value82;
}
function U(arg54, arg55) {
  for (let userData4 = arg54; userData4; userData4 = userData4.parent) {
    if (userData4.userData?.[arg55] !== undefined) {
      return userData4.userData[arg55];
    }
  }
}
function He(isMeshStandardMaterial) {
  return isMeshStandardMaterial && (isMeshStandardMaterial.isMeshStandardMaterial || isMeshStandardMaterial.isMeshPhysicalMaterial || isMeshStandardMaterial.isMeshPhongMaterial || isMeshStandardMaterial.isMeshLambertMaterial);
}
function Ce(arg56, arg57) {
  for (let parent = arg56; parent; parent = parent.parent) {
    if (parent.visible === false) {
      return false;
    }
    if (parent === arg57) {
      return true;
    }
  }
  return false;
}
function Je(name) {
  const value83 = U(name, "regionReceiverKind");
  if (ve.includes(value83)) {
    return value83;
  }
  const value84 = U(name, "modelLayer");
  if (value84 === "items" || value84 === "lights") {
    return "furniture";
  }
  if (value84 === "walls" || /wall/i.test(name.name || "")) {
    return "wall";
  }
  if (/floor/i.test(name.name || "")) {
    return "floor";
  }
  const boundingBox = name.geometry;
  if (boundingBox) {
    if (!boundingBox.boundingBox) {
      boundingBox.computeBoundingBox?.();
    }
    const max = boundingBox.boundingBox;
    if (max) {
      const value44 = [max.max.x - max.min.x, max.max.y - max.min.y, max.max.z - max.min.z].sort((arg13, arg14) => arg13 - arg14);
      if (!value84 && value44[0] < 0.18 && value44[1] > 1.5) {
        return "floor";
      }
    }
  }
  if (value84) {
    return "furniture";
  } else {
    return "wall";
  }
}
function xe(x4, arg58, arg59, arg60, arg61) {
  const value85 = x4.x !== arg58 || x4.y !== arg59 || x4.z !== arg60 || x4.w !== arg61;
  x4.set(arg58, arg59, arg60, arg61);
  return value85;
}
function Qe(capacity) {
  return "\n#define PLAN2_LIGHT_CAPACITY " + capacity.capacity + "\n#define PLAN2_TEXTURE_DATA " + (capacity.textureMode ? 1 : 0) + "\nuniform int plan2LightCount;\nuniform float plan2Gain;\nuniform float plan2SunShadowStrength;\nuniform mat4 plan2MotionToLayout;\nvarying vec3 vPlan2WorldPosition;\n#if PLAN2_TEXTURE_DATA\nuniform sampler2D plan2LightData;\nvec4 plan2ReadData(int slot, float column) {\n  return texture2D(plan2LightData, vec2((column + 0.5) / 4.0, (float(slot) + 0.5) / float(PLAN2_LIGHT_CAPACITY)));\n}\n#else\nuniform vec4 plan2Centers[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Extents[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Colors[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Axes[PLAN2_LIGHT_CAPACITY];\n#endif\nvec3 plan2SurfaceLight(vec3 worldPoint) {\n  worldPoint = (plan2MotionToLayout * vec4(worldPoint, 1.0)).xyz;\n  vec3 weightedColor = vec3(0.0);\n  float totalWeight = 0.0;\n  float coverage = 0.0;\n  for (int slot = 0; slot < PLAN2_LIGHT_CAPACITY; slot++) {\n    if (slot >= plan2LightCount) break;\n    #if PLAN2_TEXTURE_DATA\n      vec4 center = plan2ReadData(slot, 0.0);\n    #else\n      vec4 center = plan2Centers[slot];\n    #endif\n    if (center.w < 0.00001) continue;\n    #if PLAN2_TEXTURE_DATA\n      vec4 extent = plan2ReadData(slot, 1.0);\n      vec4 axis = plan2ReadData(slot, 3.0);\n    #else\n      vec4 extent = plan2Extents[slot];\n      vec4 axis = plan2Axes[slot];\n    #endif\n    vec3 offset = worldPoint - center.xyz;\n    vec3 localPoint = vec3(dot(offset.xz, axis.xy), offset.y, dot(offset.xz, vec2(-axis.y, axis.x)));\n    float verticalDistance = max(abs(localPoint.y) - extent.y, 0.0);\n    if (verticalDistance >= extent.w) continue;\n    float radialDistance;\n    if (axis.z > 3.5) {\n      // Square volumes retain actual straight edges and corners. Their fade\n      // follows the normalized box metric, not a radial or rounded boundary.\n      vec2 fromCenter = abs(localPoint.xz) / max(extent.xz, vec2(0.001));\n      radialDistance = max(fromCenter.x, fromCenter.y);\n    } else if (axis.z > 2.5) {\n      // Edited strips are rounded rectangles with their zero-light boundary\n      // exactly at the requested width/depth, including both rounded ends.\n      float radius = max(min(extent.x, extent.z), 0.001);\n      vec2 fromCore = max(abs(localPoint.xz) - (extent.xz - vec2(radius)), vec2(0.0));\n      radialDistance = length(fromCore) / radius;\n    } else if (axis.z > 0.5 && axis.z < 1.5) {\n      // A strip is a line source. Brightness falls away from the line, rather\n      // than remaining constant throughout a wide rectangular room volume.\n      vec2 fromSegment = vec2(max(abs(localPoint.x) - extent.x, 0.0), localPoint.z);\n      radialDistance = length(fromSegment) / max(extent.z, 0.001);\n    } else {\n      radialDistance = length(localPoint.xz / max(extent.xz, vec2(0.001)));\n    }\n    if (radialDistance >= 1.0) continue;\n    float fadeStart = axis.z > 1.5 ? 1.0 - clamp(axis.w, 0.05, 1.0) : 0.0;\n    float influence = (1.0 - smoothstep(fadeStart, 1.0, radialDistance))\n      * (1.0 - smoothstep(0.0, extent.w, verticalDistance)) * clamp(center.w, 0.0, 1.0);\n    #if PLAN2_TEXTURE_DATA\n      vec3 lightColor = plan2ReadData(slot, 2.0).rgb;\n    #else\n      vec3 lightColor = plan2Colors[slot].rgb;\n    #endif\n    weightedColor += lightColor * influence;\n    totalWeight += influence;\n    coverage += (1.0 - coverage) * influence;\n  }\n  // Smooth bounded union: max() produced a derivative crease wherever two\n  // lamps exchanged dominance. This preserves single-lamp falloff and blends\n  // overlaps continuously, with coverage capped at one rather than added HDR.\n  return weightedColor / max(totalWeight, 0.00001) * coverage;\n}\n";
}
export function sampleRegionVolumes(arg48, x3, arg49 = 1) {
  let value72 = 0;
  let value73 = 0;
  const map2 = [0, 0, 0];
  for (const value62 of arg48) {
    const {
      center: w,
      extent: x,
      color: x2,
      axis: z
    } = value62;
    if (w.w <= 0) {
      continue;
    }
    const value50 = x3.x - w.x;
    const value51 = x3.y - w.y;
    const value52 = x3.z - w.z;
    const value53 = value50 * z.x + value52 * z.y;
    const value54 = -value50 * z.y + value52 * z.x;
    const value55 = Math.max(Math.min(x.x, x.z), 0.001);
    const value56 = z.z > 3.5 ? Math.max(Math.abs(value53) / Math.max(x.x, 0.001), Math.abs(value54) / Math.max(x.z, 0.001)) : z.z > 2.5 ? Math.hypot(Math.max(Math.abs(value53) - (x.x - value55), 0), Math.max(Math.abs(value54) - (x.z - value55), 0)) / value55 : z.z > 0.5 && z.z < 1.5 ? Math.hypot(Math.max(Math.abs(value53) - x.x, 0), value54) / Math.max(x.z, 0.001) : Math.hypot(value53 / Math.max(x.x, 0.001), value54 / Math.max(x.z, 0.001));
    const value57 = z.z > 1.5 ? 1 - b(z.w, 0.05, 1) : 0;
    const value58 = b((value56 - value57) / (1 - value57), 0, 1);
    const value59 = b(Math.max(Math.abs(value51) - x.y, 0) / x.w, 0, 1);
    const value60 = (1 - value58 * value58 * (3 - value58 * 2)) * (1 - value59 * value59 * (3 - value59 * 2)) * b(w.w, 0, 1);
    value73 += value60;
    value72 += (1 - value72) * value60;
    map2[0] += x2.x * value60;
    map2[1] += x2.y * value60;
    map2[2] += x2.z * value60;
  }
  return map2.map(arg26 => value73 > 0 ? arg26 / value73 * value72 * arg49 : 0);
}
export function createRegionLightController({
  THREE: Vector4,
  renderer: capabilities,
  scene: onBeforeRender,
  getRoot: arg50,
  contactShadows: getUniforms = null,
  requestFrame: arg51 = () => {}
}) {
  const values2 = new Map();
  const delete2 = new Set();
  const map = new Map();
  const map2 = new WeakMap();
  const get2 = new Map();
  const get3 = new Map();
  const clear = new Set();
  const y = new Vector4.Vector3();
  const setFromMatrixPosition = new Vector4.Vector3();
  const copy = new Vector4.Vector3();
  const elements = new Vector4.Matrix4();
  let value74 = null;
  const plan2ViewToWorld = {
    value: new Vector4.Matrix4()
  };
  const value75 = {
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
  let value76 = true;
  let value77 = false;
  let push3 = [];
  let set2 = new Map();
  let value78 = Object.create(null);
  let has2 = null;
  let value79 = false;
  let value80 = false;
  let value81 = null;
  const invalidate = () => {
    value76 = true;
  };
  const apply = onBeforeRender.onBeforeRender;
  function fn(floorId4, kind, value63) {
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
            value: value63
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
            value: new Vector4.Matrix4()
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
    const length5 = Ne(value63);
    if (texture3.capacity !== length5) {
      texture3.capacity = length5;
      const value35 = I(capabilities?.capabilities?.maxFragmentUniforms, 1024);
      texture3.textureMode = length5 * 4 + 128 > value35;
      texture3.texture?.dispose();
      texture3.texture = null;
      texture3.slots = Array.from({
        length: length5
      }, () => ({
        center: new Vector4.Vector4(),
        extent: new Vector4.Vector4(),
        color: new Vector4.Vector4(),
        axis: new Vector4.Vector4()
      }));
      for (const [value30, value31] of [["plan2Centers", "center"], ["plan2Extents", "extent"], ["plan2Colors", "color"], ["plan2Axes", "axis"]]) {
        texture3.uniforms[value30].value = texture3.slots.map(arg3 => arg3[value31]);
      }
      if (texture3.textureMode) {
        const value29 = I(capabilities?.capabilities?.maxTextureSize, 4096);
        if (length5 > value29) {
          throw new RangeError("区域灯数量 " + value63 + " 超出本机数据纹理容量 " + value29);
        }
        texture3.texture = new Vector4.DataTexture(new Float32Array(length5 * 16), 4, length5, Vector4.RGBAFormat, Vector4.FloatType);
        texture3.texture.minFilter = texture3.texture.magFilter = Vector4.NearestFilter;
        texture3.texture.generateMipmaps = false;
        texture3.texture.needsUpdate = true;
      }
      texture3.uniforms.plan2LightData.value = texture3.texture;
      for (const needsUpdate of texture3.materials) {
        needsUpdate.needsUpdate = true;
      }
    }
    texture3.uniforms.plan2LightCount.value = value63;
    return texture3;
  }
  function fn2(transmission, arg30, arg31, add, plan2DetailedSurface = false, arg32 = false) {
    const value64 = transmission?.environmentSourceMaterial;
    if (value64 && map2.has(value64)) {
      add.add(value64);
      return transmission;
    }
    transmission = map2.get(transmission) || transmission;
    if (!He(transmission)) {
      return transmission;
    }
    let items = get2.get(transmission);
    if (!items) {
      items = new Map();
      get2.set(transmission, items);
    }
    const value65 = arg30 + "\0" + arg31;
    const value66 = value65 + "\0" + (plan2DetailedSurface ? "detailed" : "simple") + (arg32 ? "-floor-tone" : "");
    let userData3 = items.get(value66);
    const uniforms3 = get3.get(value65);
    if (!userData3) {
      userData3 = transmission.clone();
      userData3.name = (transmission.name || transmission.type || "material") + " / region " + arg31;
      const call = transmission.onBeforeCompile;
      userData3.onBeforeCompile = function (fragmentShader, arg15) {
        call?.call(this, fragmentShader, arg15);
        Object.assign(fragmentShader.uniforms, uniforms3.uniforms);
        if (arg32) {
          fragmentShader.uniforms.plan2FloorBrightness = value75;
          fragmentShader.fragmentShader = "uniform float plan2FloorBrightness;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= plan2FloorBrightness;");
        }
        fragmentShader.uniforms.plan2ContactViewToWorld = uniforms3.uniforms.plan2ViewToWorld;
        fragmentShader.vertexShader = "uniform mat4 plan2ViewToWorld;\nvarying vec3 vPlan2WorldPosition;\n" + fragmentShader.vertexShader;
        const value10 = "#include <project_vertex>";
        if (!fragmentShader.vertexShader.includes(value10)) {
          throw new Error("区域灯材质缺少 project_vertex");
        }
        fragmentShader.vertexShader = fragmentShader.vertexShader.replace(value10, value10 + "\nvPlan2WorldPosition = (plan2ViewToWorld * mvPosition).xyz;");
        fragmentShader.fragmentShader = Qe(uniforms3) + fragmentShader.fragmentShader;
        const value11 = "#include <lights_fragment_end>";
        if (!fragmentShader.fragmentShader.includes(value11)) {
          throw new Error("区域灯材质缺少 lights_fragment_end");
        }
        const value12 = arg31 === "wall" ? "" : "\n          #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n            if (receiveShadow && plan2SunShadowStrength > 0.0 && directionalLightShadows[0].shadowIntensity > 0.0) {\n              // The studio's single shadow-casting directional light is the\n              // first shadow slot. Reuse its resident VSM map; no new capture.\n              DirectionalLightShadow plan2SunShadow = directionalLightShadows[0];\n              plan2ShadowMask = getShadow(directionalShadowMap[0], plan2SunShadow.shadowMapSize,\n                min(1.0, plan2SunShadow.shadowIntensity * plan2SunShadowStrength / 0.18),\n                plan2SunShadow.shadowBias, plan2SunShadow.shadowRadius, vDirectionalShadowCoord[0]);\n            }\n          #endif";
        fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace(value11, value11 + "\nvec3 plan2ReceivingColor = mix(diffuseColor.rgb, sqrt(max(diffuseColor.rgb, vec3(0.0))), 0.6);\n          float plan2ShadowMask = 1.0;" + value12 + "\n          reflectedLight.indirectDiffuse += plan2ReceivingColor * plan2SurfaceLight(vPlan2WorldPosition) * plan2Gain * plan2ShadowMask;");
        if (arg31 !== "wall" && getUniforms) {
          fragmentShader.fragmentShader = "uniform sampler2D plan2ContactMap;\n            uniform mat4 plan2ContactTransform;\n            uniform vec4 plan2ContactBounds;\n            uniform float plan2ContactY, plan2ContactOpacity;\n            uniform sampler2D plan2SurfaceMap;\n            uniform vec4 plan2SurfaceBounds;\n            uniform sampler2D plan2SurfaceLookup;\n            uniform vec2 plan2SurfaceLayout;\n            uniform mat4 plan2ContactViewToWorld;\n            uniform float plan2SurfaceOpacity;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <opaque_fragment>", "\n            vec3 contactPosition = (plan2ContactTransform * vec4(vPlan2WorldPosition, 1.0)).xyz;\n            vec2 contactUv = (contactPosition.xz - plan2ContactBounds.xy) / plan2ContactBounds.zw;\n            float contactHeight = contactPosition.y - plan2ContactY;\n            if (contactHeight >= -0.015 && contactHeight < 0.12\n                && all(greaterThanEqual(contactUv, vec2(0.0))) && all(lessThanEqual(contactUv, vec2(1.0)))) {\n              // Rugs and the lowest furniture surfaces also receive contact\n              // shading. Fade it over the first 12cm; upper surfaces stay lit.\n              float contactWeight = 1.0 - smoothstep(0.035, 0.12, max(contactHeight, 0.0));\n              outgoingLight *= 1.0 - texture2D(plan2ContactMap, contactUv).r * plan2ContactOpacity * contactWeight;\n            }\n            if (contactHeight > 0.12 && plan2SurfaceOpacity > 0.0) {\n              // These are already baked shadow pixels, not an occluder depth\n              // map. No shadow comparison or light-space projection per frame.\n              vec4 tile = texture2D(plan2SurfaceLookup, vec2(clamp(contactHeight / plan2SurfaceLayout.y, 0.0, 1.0), 0.5));\n              vec2 localUv = (contactPosition.xz - plan2SurfaceBounds.xy) / plan2SurfaceBounds.zw;\n              if (tile.b > 0.5 && all(greaterThanEqual(localUv, vec2(0.0))) && all(lessThanEqual(localUv, vec2(1.0)))) {\n                float upward = smoothstep(0.8, 0.98, normalize(mat3(plan2ContactTransform) * mat3(plan2ContactViewToWorld) * normal).y);\n                vec2 tileOrigin = floor(tile.rg * 255.0 + 0.5);\n                vec2 surfaceUv = (tileOrigin + clamp(localUv, vec2(0.002), vec2(0.998))) / plan2SurfaceLayout.x;\n                outgoingLight *= 1.0 - texture2D(plan2SurfaceMap, surfaceUv).r * plan2SurfaceOpacity * upward;\n              }\n            }\n            #include <opaque_fragment>");
        }
        if (!plan2DetailedSurface && (transmission.transmission == null || transmission.transmission === 0)) {
          fragmentShader.fragmentShader = "uniform mat4 plan2ViewToWorld;\n" + fragmentShader.fragmentShader;
          fragmentShader.fragmentShader = fragmentShader.fragmentShader.replace("#include <lights_fragment_begin>", "\n              vec3 simpleNormal = normalize(mat3(plan2MotionToLayout) * mat3(plan2ViewToWorld) * normal);\n              float simpleUp = simpleNormal.y * 0.5 + 0.5;\n              float simpleKey = max(dot(simpleNormal, normalize(vec3(-0.4, 0.85, 0.32))), 0.0);\n              vec3 simpleTint = mix(vec3(0.82, 0.85, 0.91), vec3(1.0, 1.0, 1.0), simpleUp);\n              reflectedLight.indirectDiffuse = diffuseColor.rgb * simpleTint * (0.30 + 0.40 * simpleUp + 0.18 * simpleKey);\n            ").replace("#include <lights_fragment_maps>", "").replace("#include <lights_fragment_end>", "");
        }
        structureScans.shaderCompiles += 1;
      };
      const value36 = transmission.customProgramCacheKey?.call(transmission) || "";
      userData3.customProgramCacheKey = () => value36 + "|plan2-baked-surface-v6-layout|" + Number(plan2DetailedSurface) + "|" + Number(arg32) + "|" + arg31 + "|" + uniforms3.capacity + "|" + Number(uniforms3.textureMode) + "|" + !!getUniforms;
      userData3.userData.plan2RegionMaterial = true;
      userData3.userData.plan2DetailedSurface = plan2DetailedSurface;
      map2.set(userData3, transmission);
      items.set(value66, userData3);
      uniforms3.materials.add(userData3);
    }
    add.add(userData3);
    return userData3;
  }
  function fn3() {
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
      light3.floorId = String(light3.light.userData?.regionFloorId ?? light3.light.userData?.lightFloorId ?? U(light3.light, "regionFloorId") ?? U(light3.light, "floorId") ?? "default");
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
    const value67 = set2.size === 1 ? set2.keys().next().value : "default";
    if (!set2.size) {
      set2.set(value67, []);
    }
    for (const [value45, length3] of set2) {
      for (const value32 of ve) {
        fn(value45, value32, length3.length);
      }
    }
    const add4 = new Set();
    const add5 = new Set();
    for (const material2 of push2) {
      if (["background", "grid", "outline", "light-source-preview"].includes(U(material2, "exportRole"))) {
        continue;
      }
      const value37 = String(U(material2, "regionFloorId") ?? U(material2, "floorId") ?? value67);
      if (!set2.has(value37)) {
        set2.set(value37, []);
        for (const value13 of ve) {
          fn(value37, value13, 0);
        }
      }
      const value38 = Je(material2);
      const map = material2.material;
      const value39 = U(material2, "preserveDetailedSurface") === true;
      const value40 = U(material2, "regionReceiverKind") === "floor";
      const some = Array.isArray(map) ? map.map(arg5 => fn2(arg5, value37, value38, add4, value39, value40)) : fn2(map, value37, value38, add4, value39, value40);
      if (Array.isArray(map) ? some.some((arg7, arg8) => arg7 !== map[arg8]) : some !== map) {
        material2.material = some;
      }
      if (Array.isArray(some) ? some.some(arg9 => map2.has(arg9)) : map2.has(some)) {
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
            const value = environmentSourceMaterial?.environmentSourceMaterial || environmentSourceMaterial;
            if (map2.has(value)) {
              add4.add(value);
            }
          }
        }
      });
    }
    for (const [value46, value47] of map) {
      if (!add5.has(value46) && !add6.has(value46)) {
        fn4(value46, value47);
        map.delete(value46);
      }
    }
    for (const [value48, entryMap] of get2) {
      for (const [slice, dispose2] of entryMap) {
        if (!add4.has(dispose2)) {
          get3.get(slice.slice(0, slice.lastIndexOf("\0")))?.materials.delete(dispose2);
          dispose2.dispose();
          entryMap.delete(slice);
        }
      }
      if (!entryMap.size) {
        get2.delete(value48);
      }
    }
    for (const [value49, floorId2] of get3) {
      if (!set2.has(floorId2.floorId) && !floorId2.materials.size) {
        floorId2.texture?.dispose();
        get3.delete(value49);
      }
    }
    push3 = [];
    onBeforeRender.traverse(isLight => {
      if (isLight.isLight && !values2.has(isLight)) {
        push3.push(isLight);
      }
    });
    structureScans.registered = structureScans.slotCount = values2.size;
    structureScans.materials = add4.size;
    structureScans.meshCount = add5.size;
    structureScans.floorCount = set2.size;
    structureScans.detailedMaterials = [...add4].filter(userData => userData.userData.plan2DetailedSurface || userData.transmission > 0).length;
    structureScans.capacity = [...set2].reduce((arg20, [, length2]) => arg20 + Ne(length2.length), 0);
    structureScans.textureFloors = [...set2.keys()].filter(arg16 => get3.get(arg16 + "\0floor")?.textureMode).length;
    value76 = false;
  }
  function fn4(material3, assigned) {
    if (material3.material === assigned.assigned) {
      material3.material = Array.isArray(material3.material) ? material3.material.map(arg6 => map2.get(arg6) || arg6) : map2.get(material3.material) || material3.material;
    }
  }
  function register(layers3, arg33 = {}) {
    if (value77 || !layers3?.isLight) {
      return;
    }
    if (!values2.get(layers3)) {
      values2.set(layers3, {
        light: layers3,
        item: {
          ...arg33
        },
        originalLayers: layers3.layers.mask,
        fullIntensity: Math.max(0.00001, I(layers3.userData?.regionFullIntensity, I(layers3.userData?.lightOnIntensity, layers3.intensity) || 1))
      });
    }
    layers3.layers.set(30);
    layers3.castShadow = false;
    value76 = true;
  }
  function syncCamera(matrixWorld) {
    if (!value77 && matrixWorld?.matrixWorld) {
      plan2ViewToWorld.value = matrixWorld.matrixWorld;
    }
  }
  function sync(layers4, arg34 = false) {
    if (value77) {
      return;
    }
    if (!arg34) {
      getUniforms?.sync();
      const value41 = arg50?.() || null;
      if (value41 !== traverse2) {
        traverse2 = value41;
        value76 = true;
      }
      if (value76 && (!value79 || value80)) {
        fn3();
      }
    }
    syncCamera(layers4);
    if (value79 && !value80) {
      return;
    }
    const value68 = value81 === null ? 1 : Math.min(1, Math.max(0, (performance.now() - value81) / 280));
    if (value68 < 1) {
      arg51();
    } else {
      value81 = null;
    }
    structureScans.active = 0;
    let value69 = false;
    for (const [floorId3, forEach] of set2) {
      const value42 = ve.map(arg10 => get3.get(floorId3 + "\0" + arg10));
      const value43 = value79 && value80 ? value74?.(floorId3) : null;
      for (const uniforms of value42) {
        if (value43) {
          uniforms.uniforms.plan2MotionToLayout.value.copy(value43);
        } else {
          uniforms.uniforms.plan2MotionToLayout.value.identity();
        }
        const element = rangeScale.gain * rangeScale[uniforms.kind + "Gain"] * value68;
        value69 ||= uniforms.uniforms.plan2Gain.value !== element;
        uniforms.uniforms.plan2Gain.value = element;
        const element2 = uniforms.kind === "wall" ? 0 : b(I(rangeScale.sunShadowStrength, 0.6), 0, 1) * value68;
        value69 ||= uniforms.uniforms.plan2SunShadowStrength.value !== element2;
        uniforms.uniforms.plan2SunShadowStrength.value = element2;
        uniforms.changed = false;
      }
      forEach.forEach((floorRoot, arg17) => {
        const {
          light: color,
          item: type
        } = floorRoot;
        color.updateWorldMatrix(true, false);
        elements.copy(color.matrixWorld);
        if (value43) {
          elements.premultiply(value43);
        }
        y.setFromMatrixPosition(elements);
        if (floorRoot.floorRoot) {
          floorRoot.floorRoot.updateWorldMatrix(true, false);
          setFromMatrixPosition.setFromMatrixPosition(floorRoot.floorRoot.matrixWorld);
        }
        if (value43) {
          setFromMatrixPosition.applyMatrix4(value43);
        }
        const value14 = floorRoot.floorRoot ? setFromMatrixPosition.y : 0;
        const realAmount = Ce(color, traverse2) ? b(I(color.intensity) / floorRoot.fullIntensity, 0, 1) : 0;
        const amount = has2 === null ? realAmount : has2.has(floorRoot.key) ? Math.max(0.6, realAmount) : 0;
        if (amount > 0.00001) {
          structureScans.active += 1;
        }
        length6.length = 0;
        length6.push(...elements.elements, value14, amount, realAmount, rangeScale.rangeScale, type.type, type.lightRange, type.width, type.depth, color.width, color.height, color.color.r, color.color.g, color.color.b, value78[floorRoot.key], structureScans.structureScans);
        if (floorRoot.volumeInputs && length6.every((arg, arg2) => arg === floorRoot.volumeInputs[arg2])) {
          structureScans.volumeCacheHits++;
          return;
        }
        floorRoot.volumeInputs = length6.slice();
        const value15 = b(I(type.lightRange, 3.5), 0.5, 10) * b(I(rangeScale.rangeScale, 1), 0.2, 3);
        const value16 = type.type === "striplight" || color.isRectAreaLight;
        const value17 = value15 * (type.type === "ceilinglight" ? 0.45 : 0.33);
        const value18 = Math.max(0.05, I(type.width, color.width || 2) / 2);
        const value19 = Math.max(0.025, I(type.depth, color.height || 0.2) / 2);
        const value20 = elements.elements;
        const value21 = Math.hypot(value20[0], value20[2]);
        const value22 = value21 > 0.00001 ? value20[0] / value21 : 1;
        const value23 = value21 > 0.00001 ? value20[2] / value21 : 0;
        const shape = value78[floorRoot.key];
        const value24 = (shape?.rotation || 0) * Math.PI / 180;
        const value25 = value24 ? value22 * Math.cos(value24) - value23 * Math.sin(value24) : value22;
        const value26 = value24 ? value22 * Math.sin(value24) + value23 * Math.cos(value24) : value23;
        const value27 = Math.max(0.3, value15 * 0.23);
        const value28 = value16 ? value19 + value15 * 0.07 + value27 : value17 + value27;
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
        width.width = (value16 ? value18 + value28 : value28) * 2;
        width.depth = value28 * 2;
        width.shape = value16 ? "strip" : "ellipse";
        width.axis[0] = value22;
        width.axis[1] = value23;
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
        center2.axis[0] = value25;
        center2.axis[1] = value26;
        center2.width = shape?.width ?? width.width;
        center2.depth = shape?.depth ?? width.depth;
        center2.rotation = shape?.rotation ?? 0;
        center2.softness = shape?.softness ?? 1;
        center2.shape = shape?.shape ?? width.shape;
        center2.overridden = !!shape;
        center2.amount = amount;
        center2.realAmount = realAmount;
        for (const texture of value42) {
          const center = texture.slots[arg17];
          const value4 = texture.kind;
          const value5 = value14 - (value4 === "floor" ? 0.18 : 0.1);
          const value6 = Math.max(value14 + 0.2, y.y + (value4 === "wall" ? 0.55 : 0.2));
          const value7 = Math.max(0.3, value15 * (value4 === "floor" ? 0.23 : value4 === "wall" ? 0.18 : 0.2));
          const value8 = shape ? shape.width / 2 : value16 ? value18 : value17 + value7;
          const value9 = shape ? shape.depth / 2 : value16 ? value19 + value15 * 0.07 + value7 : value17 + value7;
          let changed = xe(center.center, center2.center[0], (value5 + value6) / 2, center2.center[2], amount);
          changed = xe(center.extent, value8, (value6 - value5) / 2, value9, value7) || changed;
          changed = xe(center.color, color.color.r, color.color.g, color.color.b, 0) || changed;
          changed = xe(center.axis, value25, value26, shape ? shape.shape === "square" ? 4 : shape.shape === "strip" ? 3 : 2 : value16 ? 1 : 0, shape?.softness ?? 0) || changed;
          texture.changed ||= changed;
          if (changed && texture.texture) {
            const value2 = texture.texture.image.data;
            const value3 = arg17 * 16;
            center.center.toArray(value2, value3);
            center.extent.toArray(value2, value3 + 4);
            center.color.toArray(value2, value3 + 8);
            center.axis.toArray(value2, value3 + 12);
          }
        }
      });
      for (const changed2 of value42) {
        if (changed2.changed && changed2.texture) {
          changed2.texture.needsUpdate = true;
        }
        value69 ||= changed2.changed;
      }
    }
    if (value69) {
      structureScans.uniformUpdates += 1;
    }
    structureScans.nativeLights = push3.filter(layers => Ce(layers, onBeforeRender) && (!layers4 || layers.layers.test(layers4.layers))).length;
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
          amount: b(I(light.light.intensity) / light.fullIntensity, 0, 1),
          effectiveAmount: light.region?.amount ?? 0,
          regionKey: light.key,
          visible: Ce(light.light, traverse2)
        }))
      }))
    };
  }
  function setOverrides(arg35) {
    value78 = qe(arg35);
    sync(undefined, true);
    return getOverrides();
  }
  function getOverrides() {
    return Object.fromEntries(Object.entries(value78).map(([arg21, arg22]) => [arg21, {
      ...arg22
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
    has2 = Array.isArray(filter) ? new Set(filter.filter(arg11 => typeof arg11 == "string" && Fe(arg11))) : null;
    sync(undefined, true);
  }
  function sample(arg36, arg37 = set2.keys().next().value, arg38 = "floor") {
    const uniforms4 = get3.get(arg37 + "\0" + arg38);
    if (uniforms4) {
      return sampleRegionVolumes(uniforms4.slots.slice(0, uniforms4.uniforms.plan2LightCount.value), copy.copy(arg36).applyMatrix4(uniforms4.uniforms.plan2MotionToLayout.value), uniforms4.uniforms.plan2Gain.value);
    } else {
      return [0, 0, 0];
    }
  }
  function dispose3() {
    if (!value77) {
      value77 = true;
      structureScans.disposed = true;
      if (onBeforeRender.onBeforeRender === onBeforeRender2) {
        onBeforeRender.onBeforeRender = apply;
      }
      for (const removeEventListener of delete2) {
        removeEventListener.removeEventListener("childadded", invalidate);
        removeEventListener.removeEventListener("childremoved", invalidate);
      }
      for (const [value33, value34] of map) {
        fn4(value33, value34);
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
  function onBeforeRender2(...arg39) {
    apply?.apply(this, arg39);
    sync(arg39[2]);
  }
  const setFloorBrightness = arg27 => {
    const element3 = b(I(arg27, 100), 50, 150) / 100;
    if (element3 === value75.value) {
      return false;
    } else {
      value75.value = element3;
      structureScans.uniformUpdates += 1;
      return true;
    }
  };
  function setMotion(arg40, arg41 = false) {
    if (value79 === (arg40 === true) && value80 === arg41) {
      return;
    }
    const value70 = value80;
    value80 = arg41;
    value79 = arg40 === true;
    value81 = value79 || arg41 || value70 ? null : performance.now();
    if (value79 && !value80) {
      for (const uniforms2 of get3.values()) {
        uniforms2.uniforms.plan2Gain.value = 0;
        uniforms2.uniforms.plan2SunShadowStrength.value = 0;
      }
    }
    value76 = true;
    arg51();
  }
  const __plan2Region = {
    register,
    sync,
    syncCamera,
    dispose: dispose3,
    stats: structureScans,
    settings: rangeScale,
    inspect,
    sample,
    invalidate,
    setFloorBrightness,
    setMotion,
    setMotionTransformProvider(arg23) {
      value74 = arg23;
    },
    setOverrides,
    getOverrides,
    listRegions,
    setPreview,
    retainRoot(arg24) {
      clear.add(arg24);
      invalidate();
    },
    releaseRoot(arg25) {
      clear.delete(arg25);
      invalidate();
    }
  };
  onBeforeRender.onBeforeRender = onBeforeRender2;
  if (typeof window !== "undefined") {
    window.__plan2Region = __plan2Region;
  }
  return __plan2Region;
}
