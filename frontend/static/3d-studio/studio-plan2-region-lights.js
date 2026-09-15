const REGION_LIGHT_LAYER = 30;
const REGION_KINDS = ["floor", "wall", "furniture"];
const toFiniteNumber = (candidateValue, fallbackValue = 0) =>
  Number.isFinite(Number(candidateValue)) ? Number(candidateValue) : fallbackValue;
const clamp = (targetValue, minValue, maxValue) =>
  Math.min(maxValue, Math.max(minValue, targetValue));
const alignTo16 = sizeValue => Math.max(16, Math.ceil(sizeValue / 16) * 16);
export const regionLightKey = (floorKeyId, lightKeyId) =>
  JSON.stringify([String(floorKeyId), String(lightKeyId)]);
function isRegionLightKey(keyString) {
  try {
    const parsedKey = JSON.parse(keyString);
    return (
      Array.isArray(parsedKey) &&
      parsedKey.length === 2 &&
      parsedKey.every(keyPart => typeof keyPart == "string") &&
      regionLightKey(...parsedKey) === keyString
    );
  } catch {
    return false;
  }
}
function sanitizeRegionOverrides(rawOverrides) {
  const normalizedOverrides = Object.create(null);
  if (!rawOverrides || typeof rawOverrides != "object" || Array.isArray(rawOverrides)) {
    return normalizedOverrides;
  }
  for (const [regionKey, override] of Object.entries(rawOverrides)) {
    if (
      !isRegionLightKey(regionKey) ||
      !override ||
      typeof override != "object" ||
      Array.isArray(override) ||
      !["circle", "square", "ellipse", "strip"].includes(override.shape) ||
      !["width", "depth"].every(
        dimensionField =>
          typeof override[dimensionField] == "number" && Number.isFinite(override[dimensionField])
      ) ||
      ["rotation", "softness"].some(
        numericField =>
          override[numericField] !== undefined &&
          (typeof override[numericField] != "number" || !Number.isFinite(override[numericField]))
      ) ||
      ["offsetX", "offsetZ"].some(
        offsetField =>
          override[offsetField] !== undefined &&
          (typeof override[offsetField] != "number" || !Number.isFinite(override[offsetField]))
      ) ||
      ["heightAbove", "heightBelow", "heightMin", "heightMax"].some(
        heightField =>
          override[heightField] !== undefined &&
          (typeof override[heightField] != "number" || !Number.isFinite(override[heightField]))
      ) ||
      (override.heightMin !== undefined &&
        override.heightMax !== undefined &&
        override.heightMin > override.heightMax) ||
      (override.moveCenterEnabled !== undefined && typeof override.moveCenterEnabled != "boolean")
    ) {
      continue;
    }
    const rotationDeg = override.rotation ?? 0;
    const clampedWidth = clamp(override.width, 0.5, 20);
    normalizedOverrides[regionKey] = {
      width: clampedWidth,
      depth: clamp(override.depth, 0.5, 20),
      rotation: (((rotationDeg % 360) + 540) % 360) - 180,
      softness: clamp(override.softness ?? 1, 0.05, 1),
      shape: override.shape,
      ...(override.heightMin !== undefined
        ? {
            heightMin: clamp(override.heightMin, 0, 20)
          }
        : {}),
      ...(override.heightMax !== undefined
        ? {
            heightMax: clamp(override.heightMax, 0, 20)
          }
        : {}),
      ...(override.heightAbove !== undefined
        ? {
            heightAbove: clamp(override.heightAbove, 0, 20)
          }
        : {}),
      ...(override.heightBelow !== undefined
        ? {
            heightBelow: clamp(override.heightBelow, 0, 20)
          }
        : {}),
      ...(override.offsetX !== undefined
        ? {
            offsetX: clamp(override.offsetX, -100, 100)
          }
        : {}),
      ...(override.offsetZ !== undefined
        ? {
            offsetZ: clamp(override.offsetZ, -100, 100)
          }
        : {}),
      ...(override.moveCenterEnabled !== undefined
        ? {
            moveCenterEnabled: override.moveCenterEnabled
          }
        : {})
    };
  }
  return normalizedOverrides;
}
function findAncestorUserData(startObject, userDataKey) {
  for (let ancestorObject = startObject; ancestorObject; ancestorObject = ancestorObject.parent) {
    if (ancestorObject.userData?.[userDataKey] !== undefined) {
      return ancestorObject.userData[userDataKey];
    }
  }
}
function isRegionReceiverMaterial(materialCandidate) {
  return (
    materialCandidate &&
    (materialCandidate.userData?.hbDedicatedWall ||
      materialCandidate.isMeshStandardMaterial ||
      materialCandidate.isMeshPhysicalMaterial ||
      materialCandidate.isMeshPhongMaterial ||
      materialCandidate.isMeshLambertMaterial)
  );
}
function isVisibleWithin(startNode, rootNode) {
  for (let currentNode = startNode; currentNode; currentNode = currentNode.parent) {
    if (currentNode.visible === false) {
      return false;
    }
    if (currentNode === rootNode) {
      return true;
    }
  }
  return false;
}
function classifyReceiverKind(candidateMesh) {
  const declaredKind = findAncestorUserData(candidateMesh, "regionReceiverKind");
  if (REGION_KINDS.includes(declaredKind)) {
    return declaredKind;
  }
  const modelLayer = findAncestorUserData(candidateMesh, "modelLayer");
  if (modelLayer === "items" || modelLayer === "lights") {
    return "furniture";
  }
  if (modelLayer === "walls" || /wall/i.test(candidateMesh.name || "")) {
    return "wall";
  }
  if (/floor/i.test(candidateMesh.name || "")) {
    return "floor";
  }
  const geometry = candidateMesh.geometry;
  if (geometry) {
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox?.();
    }
    const boundingBox = geometry.boundingBox;
    if (boundingBox) {
      const sortedExtent = [
        boundingBox.max.x - boundingBox.min.x,
        boundingBox.max.y - boundingBox.min.y,
        boundingBox.max.z - boundingBox.min.z
      ].sort((sizeA, sizeB) => sizeA - sizeB);
      if (!modelLayer && sortedExtent[0] < 0.18 && sortedExtent[1] > 1.5) {
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
function setVector4IfChanged(targetVector, xComponent, yComponent, zComponent, wComponent) {
  const didChange =
    targetVector.x !== xComponent ||
    targetVector.y !== yComponent ||
    targetVector.z !== zComponent ||
    targetVector.w !== wComponent;
  targetVector.set(xComponent, yComponent, zComponent, wComponent);
  return didChange;
}
function buildShaderChunk(volumeGroup) {
  return (
    "\n#define PLAN2_LIGHT_CAPACITY " +
    volumeGroup.capacity +
    "\n#define PLAN2_TEXTURE_DATA " +
    (volumeGroup.textureMode ? 1 : 0) +
    "\nuniform int plan2LightCount;\nuniform float plan2Gain;\nuniform float plan2SunShadowStrength;\nuniform mat4 plan2MotionToLayout;\nvarying vec3 vPlan2WorldPosition;\n#if PLAN2_TEXTURE_DATA\nuniform sampler2D plan2LightData;\nvec4 plan2ReadData(int slot, float column) {\n  return texture2D(plan2LightData, vec2((column + 0.5) / 4.0, (float(slot) + 0.5) / float(PLAN2_LIGHT_CAPACITY)));\n}\n#else\nuniform vec4 plan2Centers[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Extents[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Colors[PLAN2_LIGHT_CAPACITY];\nuniform vec4 plan2Axes[PLAN2_LIGHT_CAPACITY];\n#endif\nvec3 plan2SurfaceLight(vec3 worldPoint) {\n  worldPoint = (plan2MotionToLayout * vec4(worldPoint, 1.0)).xyz;\n  vec3 weightedColor = vec3(0.0);\n  float totalWeight = 0.0;\n  float coverage = 0.0;\n  for (int slot = 0; slot < PLAN2_LIGHT_CAPACITY; slot++) {\n    if (slot >= plan2LightCount) break;\n    #if PLAN2_TEXTURE_DATA\n      vec4 center = plan2ReadData(slot, 0.0);\n    #else\n      vec4 center = plan2Centers[slot];\n    #endif\n    if (center.w < 0.00001) continue;\n    #if PLAN2_TEXTURE_DATA\n      vec4 extent = plan2ReadData(slot, 1.0);\n      vec4 axis = plan2ReadData(slot, 3.0);\n    #else\n      vec4 extent = plan2Extents[slot];\n      vec4 axis = plan2Axes[slot];\n    #endif\n    vec3 offset = worldPoint - center.xyz;\n    vec3 localPoint = vec3(dot(offset.xz, axis.xy), offset.y, dot(offset.xz, vec2(-axis.y, axis.x)));\n    float verticalDistance = max(abs(localPoint.y) - extent.y, 0.0);\n    if (verticalDistance >= extent.w) continue;\n    float fadeStart = axis.z > 1.5 ? 1.0 - clamp(axis.w, 0.05, 1.0) : 0.0;\n    float squareFalloff = 1.0;\n    float radialDistance;\n    if (axis.z > 3.5) {\n      // Retain straight zero-light edges, but fade each axis independently.\n      // Using max(x,z) for brightness changes derivatives on the diagonals,\n      // making four visible triangular wedges. max is only a bounds check.\n      vec2 fromCenter = abs(localPoint.xz) / max(extent.xz, vec2(0.001));\n      radialDistance = max(fromCenter.x, fromCenter.y);\n      vec2 edgeFade = vec2(1.0) - smoothstep(vec2(fadeStart), vec2(1.0), fromCenter);\n      squareFalloff = edgeFade.x * edgeFade.y;\n    } else if (axis.z > 2.5) {\n      // Edited strips are rounded rectangles with their zero-light boundary\n      // exactly at the requested width/depth, including both rounded ends.\n      float radius = max(min(extent.x, extent.z), 0.001);\n      vec2 fromCore = max(abs(localPoint.xz) - (extent.xz - vec2(radius)), vec2(0.0));\n      radialDistance = length(fromCore) / radius;\n    } else if (axis.z > 0.5 && axis.z < 1.5) {\n      // A strip is a line source. Brightness falls away from the line, rather\n      // than remaining constant throughout a wide rectangular room volume.\n      vec2 fromSegment = vec2(max(abs(localPoint.x) - extent.x, 0.0), localPoint.z);\n      radialDistance = length(fromSegment) / max(extent.z, 0.001);\n    } else {\n      radialDistance = length(localPoint.xz / max(extent.xz, vec2(0.001)));\n    }\n    if (radialDistance >= 1.0) continue;\n    float horizontalFalloff = axis.z > 3.5 ? squareFalloff : 1.0 - smoothstep(fadeStart, 1.0, radialDistance);\n    float influence = horizontalFalloff\n      * (1.0 - smoothstep(0.0, extent.w, verticalDistance)) * clamp(center.w, 0.0, 1.0);\n    #if PLAN2_TEXTURE_DATA\n      vec3 lightColor = plan2ReadData(slot, 2.0).rgb;\n    #else\n      vec3 lightColor = plan2Colors[slot].rgb;\n    #endif\n    weightedColor += lightColor * influence;\n    totalWeight += influence;\n    coverage += (1.0 - coverage) * influence;\n  }\n  // Smooth bounded union: max() produced a derivative crease wherever two\n  // lamps exchanged dominance. This preserves single-lamp falloff and blends\n  // overlaps continuously, with coverage capped at one rather than added HDR.\n  return weightedColor / max(totalWeight, 0.00001) * coverage;\n}\n"
  );
}
export function sampleRegionVolumes(volumes, worldPoint, gain = 1) {
  let coverage = 0;
  let totalWeight = 0;
  const accumulatedColor = [0, 0, 0];
  for (const volume of volumes) {
    const { center: center, extent: extent, color: color, axis: axis } = volume;
    if (center.w <= 0) {
      continue;
    }
    const offsetX = worldPoint.x - center.x;
    const offsetY = worldPoint.y - center.y;
    const offsetZ = worldPoint.z - center.z;
    const localX = offsetX * axis.x + offsetZ * axis.y;
    const localZ = -offsetX * axis.y + offsetZ * axis.x;
    const cornerRadius = Math.max(Math.min(extent.x, extent.z), 0.001);
    const radialDistance =
      axis.z > 3.5
        ? Math.max(
            Math.abs(localX) / Math.max(extent.x, 0.001),
            Math.abs(localZ) / Math.max(extent.z, 0.001)
          )
        : axis.z > 2.5
          ? Math.hypot(
              Math.max(Math.abs(localX) - (extent.x - cornerRadius), 0),
              Math.max(Math.abs(localZ) - (extent.z - cornerRadius), 0)
            ) / cornerRadius
          : axis.z > 0.5 && axis.z < 1.5
            ? Math.hypot(Math.max(Math.abs(localX) - extent.x, 0), localZ) /
              Math.max(extent.z, 0.001)
            : Math.hypot(localX / Math.max(extent.x, 0.001), localZ / Math.max(extent.z, 0.001));
    const fadeStart = axis.z > 1.5 ? 1 - clamp(axis.w, 0.05, 1) : 0;
    const normalizedDistance = clamp((radialDistance - fadeStart) / (1 - fadeStart), 0, 1);
    const verticalRatio = clamp(Math.max(Math.abs(offsetY) - extent.y, 0) / extent.w, 0, 1);
    let horizontalFalloff =
      1 - normalizedDistance * normalizedDistance * (3 - normalizedDistance * 2);
    if (axis.z > 3.5) {
      const xEdgeRatio = clamp(
        (Math.abs(localX) / Math.max(extent.x, 0.001) - fadeStart) / (1 - fadeStart),
        0,
        1
      );
      const zEdgeRatio = clamp(
        (Math.abs(localZ) / Math.max(extent.z, 0.001) - fadeStart) / (1 - fadeStart),
        0,
        1
      );
      horizontalFalloff =
        (1 - xEdgeRatio * xEdgeRatio * (3 - xEdgeRatio * 2)) *
        (1 - zEdgeRatio * zEdgeRatio * (3 - zEdgeRatio * 2));
    }
    const influence =
      horizontalFalloff *
      (1 - verticalRatio * verticalRatio * (3 - verticalRatio * 2)) *
      clamp(center.w, 0, 1);
    totalWeight += influence;
    coverage += (1 - coverage) * influence;
    accumulatedColor[0] += color.x * influence;
    accumulatedColor[1] += color.y * influence;
    accumulatedColor[2] += color.z * influence;
  }
  return accumulatedColor.map(channelValue =>
    totalWeight > 0 ? (channelValue / totalWeight) * coverage * gain : 0
  );
}
export function createRegionLightController({
  THREE: THREE,
  renderer: renderer,
  scene: scene,
  getRoot: getRoot,
  contactShadows: contactShadows = null,
  requestFrame: requestFrame = () => {}
}) {
  const registrationsByLight = new Map();
  const listenedNodes = new Set();
  const assignmentsByMesh = new Map();
  const sourceMaterialByClone = new WeakMap();
  const clonesByMaterial = new Map();
  const groupsByKey = new Map();
  const retainedRoots = new Set();
  const lightWorldPosition = new THREE.Vector3();
  const floorRootPosition = new THREE.Vector3();
  const sampleWorldPoint = new THREE.Vector3();
  const lightWorldMatrix = new THREE.Matrix4();
  let motionTransformProvider = null;
  const viewToWorldUniform = {
    value: new THREE.Matrix4()
  };
  const floorBrightnessUniform = {
    value: 1
  };
  const volumeInputsScratch = [];
  const settings = {
    gain: 3,
    floorGain: 1,
    wallGain: 0.9,
    furnitureGain: 1,
    rangeScale: 0.8,
    sunShadowStrength: 0.6
  };
  const stats = {
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
  let rootObject = null;
  let shouldRescanStructure = true;
  let isDisposed = false;
  let nativeLights = [];
  let registrationsByFloorId = new Map();
  let overrides = Object.create(null);
  let previewKeys = null;
  let isMotionEnabled = false;
  let isMotionInstant = false;
  let motionFadeStartMs = null;
  const markStructureDirty = () => {
    shouldRescanStructure = true;
  };
  const originalOnBeforeRender = scene.onBeforeRender;
  function ensureLightGroup(groupFloorId, requestedKind, lightCount) {
    const groupKey = groupFloorId + "\0" + requestedKind;
    let lightGroup = groupsByKey.get(groupKey);
    if (!lightGroup) {
      lightGroup = {
        key: groupKey,
        floorId: groupFloorId,
        kind: requestedKind,
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
          plan2ViewToWorld: viewToWorldUniform,
          plan2MotionToLayout: {
            value: new THREE.Matrix4()
          },
          plan2LightData: {
            value: null
          }
        }
      };
      if (requestedKind !== "wall" && contactShadows) {
        Object.assign(lightGroup.uniforms, contactShadows.getUniforms(groupFloorId));
      }
      groupsByKey.set(groupKey, lightGroup);
    }
    const capacity = alignTo16(lightCount);
    if (lightGroup.capacity !== capacity) {
      lightGroup.capacity = capacity;
      const maxFragmentUniforms = toFiniteNumber(renderer?.capabilities?.maxFragmentUniforms, 1024);
      lightGroup.textureMode = capacity * 4 + 128 > maxFragmentUniforms;
      lightGroup.texture?.dispose();
      lightGroup.texture = null;
      lightGroup.slots = Array.from(
        {
          length: capacity
        },
        () => ({
          center: new THREE.Vector4(),
          extent: new THREE.Vector4(),
          color: new THREE.Vector4(),
          axis: new THREE.Vector4()
        })
      );
      for (const [uniformName, slotProperty] of [
        ["plan2Centers", "center"],
        ["plan2Extents", "extent"],
        ["plan2Colors", "color"],
        ["plan2Axes", "axis"]
      ]) {
        lightGroup.uniforms[uniformName].value = lightGroup.slots.map(slot => slot[slotProperty]);
      }
      if (lightGroup.textureMode) {
        const maxTextureSize = toFiniteNumber(renderer?.capabilities?.maxTextureSize, 4096);
        if (capacity > maxTextureSize) {
          throw new RangeError(
            "区域灯数量 " + lightCount + " 超出本机数据纹理容量 " + maxTextureSize
          );
        }
        lightGroup.texture = new THREE.DataTexture(
          new Float32Array(capacity * 16),
          4,
          capacity,
          THREE.RGBAFormat,
          THREE.FloatType
        );
        lightGroup.texture.minFilter = lightGroup.texture.magFilter = THREE.NearestFilter;
        lightGroup.texture.generateMipmaps = false;
        lightGroup.texture.needsUpdate = true;
      }
      lightGroup.uniforms.plan2LightData.value = lightGroup.texture;
      for (const cachedMaterial of lightGroup.materials) {
        cachedMaterial.needsUpdate = true;
      }
    }
    lightGroup.uniforms.plan2LightCount.value = lightCount;
    return lightGroup;
  }
  function getRegionMaterial(
    sourceMaterial,
    materialFloorId,
    materialKind,
    resultMaterials,
    isDetailedSurface = false,
    isFloorTone = false
  ) {
    const environmentSourceMaterial = sourceMaterial?.environmentSourceMaterial;
    if (environmentSourceMaterial && sourceMaterialByClone.has(environmentSourceMaterial)) {
      resultMaterials.add(environmentSourceMaterial);
      return sourceMaterial;
    }
    sourceMaterial = sourceMaterialByClone.get(sourceMaterial) || sourceMaterial;
    if (!isRegionReceiverMaterial(sourceMaterial)) {
      return sourceMaterial;
    }
    let materialClones = clonesByMaterial.get(sourceMaterial);
    if (!materialClones) {
      materialClones = new Map();
      clonesByMaterial.set(sourceMaterial, materialClones);
    }
    const materialGroupKey = materialFloorId + "\0" + materialKind;
    const variantKey =
      materialGroupKey +
      "\0" +
      (isDetailedSurface ? "detailed" : "simple") +
      (isFloorTone ? "-floor-tone" : "");
    let cloneMaterial = materialClones.get(variantKey);
    const materialGroup = groupsByKey.get(materialGroupKey);
    if (!cloneMaterial) {
      cloneMaterial = sourceMaterial.clone();
      if (sourceMaterial.userData.hbDedicatedWall) {
        cloneMaterial.color = sourceMaterial.color.clone();
      }
      cloneMaterial.name =
        (sourceMaterial.name || sourceMaterial.type || "material") + " / region " + materialKind;
      const originalOnBeforeCompile = sourceMaterial.onBeforeCompile;
      cloneMaterial.onBeforeCompile = function (shader, webglRenderer) {
        originalOnBeforeCompile?.call(this, shader, webglRenderer);
        Object.assign(shader.uniforms, materialGroup.uniforms);
        if (isFloorTone) {
          shader.uniforms.plan2FloorBrightness = floorBrightnessUniform;
          shader.fragmentShader = "uniform float plan2FloorBrightness;\n" + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            "#include <color_fragment>\ndiffuseColor.rgb *= plan2FloorBrightness;"
          );
        }
        shader.uniforms.plan2ContactViewToWorld = materialGroup.uniforms.plan2ViewToWorld;
        shader.vertexShader =
          "uniform mat4 plan2ViewToWorld;\nvarying vec3 vPlan2WorldPosition;\n" +
          shader.vertexShader;
        const PROJECT_VERTEX_INCLUDE = "#include <project_vertex>";
        if (!shader.vertexShader.includes(PROJECT_VERTEX_INCLUDE)) {
          throw new Error("区域灯材质缺少 project_vertex");
        }
        shader.vertexShader = shader.vertexShader.replace(
          PROJECT_VERTEX_INCLUDE,
          PROJECT_VERTEX_INCLUDE + "\nvPlan2WorldPosition = (plan2ViewToWorld * mvPosition).xyz;"
        );
        shader.fragmentShader = buildShaderChunk(materialGroup) + shader.fragmentShader;
        if (sourceMaterial.userData.hbDedicatedWall) {
          shader.uniforms.diffuse = {
            value: cloneMaterial.color
          };
          shader.uniforms.opacity = {
            get value() {
              return cloneMaterial.opacity;
            }
          };
          stats.shaderCompiles += 1;
          return;
        }
        const LIGHTS_FRAGMENT_END_INCLUDE = "#include <lights_fragment_end>";
        if (!shader.fragmentShader.includes(LIGHTS_FRAGMENT_END_INCLUDE)) {
          throw new Error("区域灯材质缺少 lights_fragment_end");
        }
        const sunShadowSnippet =
          materialKind === "wall"
            ? ""
            : "\n          #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n            if (receiveShadow && plan2SunShadowStrength > 0.0 && directionalLightShadows[0].shadowIntensity > 0.0) {\n              // The studio's single shadow-casting directional light is the\n              // first shadow slot. Reuse its resident VSM map; no new capture.\n              DirectionalLightShadow plan2SunShadow = directionalLightShadows[0];\n              plan2ShadowMask = getShadow(directionalShadowMap[0], plan2SunShadow.shadowMapSize,\n                min(1.0, plan2SunShadow.shadowIntensity * plan2SunShadowStrength / 0.18),\n                plan2SunShadow.shadowBias, plan2SunShadow.shadowRadius, vDirectionalShadowCoord[0]);\n            }\n          #endif";
        shader.fragmentShader = shader.fragmentShader.replace(
          LIGHTS_FRAGMENT_END_INCLUDE,
          LIGHTS_FRAGMENT_END_INCLUDE +
            "\nvec3 plan2ReceivingColor = mix(diffuseColor.rgb, sqrt(max(diffuseColor.rgb, vec3(0.0))), 0.6);\n          #ifdef HB_CAR_GLASS_FINISH\n            // Keep moderate fill on glass while avoiding the full furniture\n            // albedo lift, which exaggerates the atlas' photographed lighting.\n            plan2ReceivingColor = mix(plan2ReceivingColor, diffuseColor.rgb, hbCarGlass * 0.6);\n          #endif\n          float plan2ShadowMask = 1.0;" +
            sunShadowSnippet +
            "\n          reflectedLight.indirectDiffuse += plan2ReceivingColor * plan2SurfaceLight(vPlan2WorldPosition) * plan2Gain * plan2ShadowMask;"
        );
        if (materialKind !== "wall" && contactShadows) {
          shader.fragmentShader =
            "uniform sampler2D plan2ContactMap;\n            uniform mat4 plan2ContactTransform;\n            uniform vec4 plan2ContactBounds;\n            uniform float plan2ContactY, plan2ContactOpacity;\n            uniform sampler2D plan2SurfaceMap;\n            uniform vec4 plan2SurfaceBounds;\n            uniform sampler2D plan2SurfaceLookup;\n            uniform vec2 plan2SurfaceLayout;\n            uniform mat4 plan2ContactViewToWorld;\n            uniform float plan2SurfaceOpacity;\n" +
            shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <opaque_fragment>",
            "\n            vec3 contactPosition = (plan2ContactTransform * vec4(vPlan2WorldPosition, 1.0)).xyz;\n            vec2 contactUv = (contactPosition.xz - plan2ContactBounds.xy) / plan2ContactBounds.zw;\n            float contactHeight = contactPosition.y - plan2ContactY;\n            if (contactHeight >= -0.015 && contactHeight < 0.12\n                && all(greaterThanEqual(contactUv, vec2(0.0))) && all(lessThanEqual(contactUv, vec2(1.0)))) {\n              // Rugs and the lowest furniture surfaces also receive contact\n              // shading. Fade it over the first 12cm; upper surfaces stay lit.\n              float contactWeight = 1.0 - smoothstep(0.035, 0.12, max(contactHeight, 0.0));\n              outgoingLight *= 1.0 - texture2D(plan2ContactMap, contactUv).r * plan2ContactOpacity * contactWeight;\n            }\n            " +
              (sourceMaterial.userData?.plan2SurfaceContact === false
                ? ""
                : "if (contactHeight > 0.12 && plan2SurfaceOpacity > 0.0) {\n              // These are already baked shadow pixels, not an occluder depth\n              // map. No shadow comparison or light-space projection per frame.\n              vec4 tile = texture2D(plan2SurfaceLookup, vec2(clamp(contactHeight / plan2SurfaceLayout.y, 0.0, 1.0), 0.5));\n              vec2 localUv = (contactPosition.xz - plan2SurfaceBounds.xy) / plan2SurfaceBounds.zw;\n              if (tile.b > 0.5 && all(greaterThanEqual(localUv, vec2(0.0))) && all(lessThanEqual(localUv, vec2(1.0)))) {\n                float upward = smoothstep(0.8, 0.98, normalize(mat3(plan2ContactTransform) * mat3(plan2ContactViewToWorld) * normal).y);\n                vec2 tileOrigin = floor(tile.rg * 255.0 + 0.5);\n                vec2 surfaceUv = (tileOrigin + clamp(localUv, vec2(0.002), vec2(0.998))) / plan2SurfaceLayout.x;\n                outgoingLight *= 1.0 - texture2D(plan2SurfaceMap, surfaceUv).r * plan2SurfaceOpacity * upward;\n              }\n            }") +
              "\n            #include <opaque_fragment>"
          );
        }
        if (
          !isDetailedSurface &&
          !sourceMaterial.userData.alphaWallBand &&
          (sourceMaterial.transmission == null || sourceMaterial.transmission === 0)
        ) {
          shader.fragmentShader = "uniform mat4 plan2ViewToWorld;\n" + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <lights_fragment_begin>",
              "\n              vec3 simpleNormal = normalize(mat3(plan2MotionToLayout) * mat3(plan2ViewToWorld) * normal);\n              float simpleUp = simpleNormal.y * 0.5 + 0.5;\n              float simpleKey = max(dot(simpleNormal, normalize(vec3(-0.4, 0.85, 0.32))), 0.0);\n              vec3 simpleTint = mix(vec3(0.82, 0.85, 0.91), vec3(1.0, 1.0, 1.0), simpleUp);\n              reflectedLight.indirectDiffuse = diffuseColor.rgb * simpleTint * (0.30 + 0.40 * simpleUp + 0.18 * simpleKey);\n            "
            )
            .replace("#include <lights_fragment_maps>", "")
            .replace("#include <lights_fragment_end>", "");
        }
        stats.shaderCompiles += 1;
      };
      const baseProgramCacheKey = sourceMaterial.customProgramCacheKey?.call(sourceMaterial) || "";
      cloneMaterial.customProgramCacheKey = () =>
        baseProgramCacheKey +
        "|plan2-baked-surface-v10-glass-albedo|" +
        +(sourceMaterial.userData?.plan2SurfaceContact !== false) +
        "|" +
        +!!sourceMaterial.userData.alphaWallBand +
        "|" +
        Number(isDetailedSurface) +
        "|" +
        Number(isFloorTone) +
        "|" +
        materialKind +
        "|" +
        materialGroup.capacity +
        "|" +
        Number(materialGroup.textureMode) +
        "|" +
        !!contactShadows;
      cloneMaterial.userData.plan2RegionMaterial = true;
      cloneMaterial.userData.plan2DetailedSurface = isDetailedSurface;
      sourceMaterialByClone.set(cloneMaterial, sourceMaterial);
      materialClones.set(variantKey, cloneMaterial);
      materialGroup.materials.add(cloneMaterial);
    }
    resultMaterials.add(cloneMaterial);
    return cloneMaterial;
  }
  function rebuildStructure() {
    stats.structureScans += 1;
    const currentNodes = new Set();
    const meshList = [];
    const registeredLights = new Set();
    rootObject?.traverse(node => {
      currentNodes.add(node);
      if (registrationsByLight.has(node)) {
        registeredLights.add(node);
      }
      if (node.isMesh) {
        meshList.push(node);
      }
    });
    for (const staleNode of listenedNodes) {
      if (!currentNodes.has(staleNode)) {
        staleNode.removeEventListener("childadded", markStructureDirty);
        staleNode.removeEventListener("childremoved", markStructureDirty);
        listenedNodes.delete(staleNode);
      }
    }
    for (const newNode of currentNodes) {
      if (!listenedNodes.has(newNode)) {
        newNode.addEventListener("childadded", markStructureDirty);
        newNode.addEventListener("childremoved", markStructureDirty);
        listenedNodes.add(newNode);
      }
    }
    for (const [registeredLight, registrationRecord] of registrationsByLight) {
      if (!registeredLights.has(registeredLight)) {
        registeredLight.layers.mask = registrationRecord.originalLayers;
        registrationsByLight.delete(registeredLight);
      }
    }
    registrationsByFloorId = new Map();
    for (const registration of registrationsByLight.values()) {
      registration.floorId = String(
        registration.light.userData?.regionFloorId ??
          registration.light.userData?.lightFloorId ??
          findAncestorUserData(registration.light, "regionFloorId") ??
          findAncestorUserData(registration.light, "floorId") ??
          "default"
      );
      registration.id = String(registration.item.id ?? registration.light.uuid);
      registration.key = regionLightKey(registration.floorId, registration.id);
      let floorRoot = rootObject;
      for (
        let ancestor = registration.light.parent;
        ancestor && ancestor !== rootObject;
        ancestor = ancestor.parent
      ) {
        if (
          ancestor.userData?.regionFloorId !== undefined ||
          ancestor.userData?.floorId !== undefined
        ) {
          floorRoot = ancestor;
          break;
        }
      }
      registration.floorRoot = floorRoot;
      const floorRecords = registrationsByFloorId.get(registration.floorId) || [];
      floorRecords.push(registration);
      registrationsByFloorId.set(registration.floorId, floorRecords);
    }
    const defaultFloorId =
      registrationsByFloorId.size === 1 ? registrationsByFloorId.keys().next().value : "default";
    if (!registrationsByFloorId.size) {
      registrationsByFloorId.set(defaultFloorId, []);
    }
    for (const [entryFloorId, floorRegistrations] of registrationsByFloorId) {
      for (const groupKindName of REGION_KINDS) {
        ensureLightGroup(entryFloorId, groupKindName, floorRegistrations.length);
      }
    }
    const liveMaterials = new Set();
    const swappedMeshes = new Set();
    for (const mesh of meshList) {
      if (
        ["background", "grid", "outline", "light-source-preview"].includes(
          findAncestorUserData(mesh, "exportRole")
        )
      ) {
        continue;
      }
      const meshFloorId = String(
        findAncestorUserData(mesh, "regionFloorId") ??
          findAncestorUserData(mesh, "floorId") ??
          defaultFloorId
      );
      if (!registrationsByFloorId.has(meshFloorId)) {
        registrationsByFloorId.set(meshFloorId, []);
        for (const emptyKindName of REGION_KINDS) {
          ensureLightGroup(meshFloorId, emptyKindName, 0);
        }
      }
      const receiverKind = classifyReceiverKind(mesh);
      const material = mesh.material;
      const shouldPreserveDetailed = findAncestorUserData(mesh, "preserveDetailedSurface") === true;
      const isFloorReceiver = findAncestorUserData(mesh, "regionReceiverKind") === "floor";
      const assignedMaterial = Array.isArray(material)
        ? material.map(sourceMaterialItem =>
            getRegionMaterial(
              sourceMaterialItem,
              meshFloorId,
              receiverKind,
              liveMaterials,
              shouldPreserveDetailed,
              isFloorReceiver
            )
          )
        : getRegionMaterial(
            material,
            meshFloorId,
            receiverKind,
            liveMaterials,
            shouldPreserveDetailed,
            isFloorReceiver
          );
      if (
        Array.isArray(material)
          ? assignedMaterial.some(
              (swappedMaterial, materialIndex) => swappedMaterial !== material[materialIndex]
            )
          : assignedMaterial !== material
      ) {
        mesh.material = assignedMaterial;
      }
      if (
        Array.isArray(assignedMaterial)
          ? assignedMaterial.some(regionMaterial => sourceMaterialByClone.has(regionMaterial))
          : sourceMaterialByClone.has(assignedMaterial)
      ) {
        swappedMeshes.add(mesh);
        assignmentsByMesh.set(mesh, {
          assigned: mesh.material
        });
      }
    }
    const stillAssignedMeshes = new Set();
    for (const trackedRoot of retainedRoots) {
      trackedRoot.traverse(traversedNode => {
        if (assignmentsByMesh.has(traversedNode)) {
          stillAssignedMeshes.add(traversedNode);
          for (const meshMaterial of Array.isArray(traversedNode.material)
            ? traversedNode.material
            : [traversedNode.material]) {
            const environmentMaterial = meshMaterial?.environmentSourceMaterial || meshMaterial;
            if (sourceMaterialByClone.has(environmentMaterial)) {
              liveMaterials.add(environmentMaterial);
            }
          }
        }
      });
    }
    for (const [assignedMesh, meshAssignment] of assignmentsByMesh) {
      if (!swappedMeshes.has(assignedMesh) && !stillAssignedMeshes.has(assignedMesh)) {
        restoreMeshMaterial(assignedMesh, meshAssignment);
        assignmentsByMesh.delete(assignedMesh);
      }
    }
    for (const [cloneSourceMaterial, cloneMap] of clonesByMaterial) {
      for (const [staleVariantKey, staleClone] of cloneMap) {
        if (!liveMaterials.has(staleClone)) {
          groupsByKey
            .get(staleVariantKey.slice(0, staleVariantKey.lastIndexOf("\0")))
            ?.materials.delete(staleClone);
          staleClone.dispose();
          cloneMap.delete(staleVariantKey);
        }
      }
      if (!cloneMap.size) {
        clonesByMaterial.delete(cloneSourceMaterial);
      }
    }
    for (const [staleGroupKey, staleGroup] of groupsByKey) {
      if (!registrationsByFloorId.has(staleGroup.floorId) && !staleGroup.materials.size) {
        staleGroup.texture?.dispose();
        groupsByKey.delete(staleGroupKey);
      }
    }
    nativeLights = [];
    scene.traverse(sceneNode => {
      if (sceneNode.isLight && !registrationsByLight.has(sceneNode)) {
        nativeLights.push(sceneNode);
      }
    });
    stats.registered = stats.slotCount = registrationsByLight.size;
    stats.materials = liveMaterials.size;
    stats.meshCount = swappedMeshes.size;
    stats.floorCount = registrationsByFloorId.size;
    stats.detailedMaterials = [...liveMaterials].filter(
      surfaceMaterial =>
        surfaceMaterial.userData.plan2DetailedSurface ||
        surfaceMaterial.userData.alphaWallBand ||
        surfaceMaterial.transmission > 0
    ).length;
    stats.capacity = [...registrationsByFloorId].reduce(
      (totalCapacity, [, floorEntryList]) => totalCapacity + alignTo16(floorEntryList.length),
      0
    );
    stats.textureFloors = [...registrationsByFloorId.keys()].filter(
      floorKey => groupsByKey.get(floorKey + "\0floor")?.textureMode
    ).length;
    shouldRescanStructure = false;
  }
  function restoreMeshMaterial(swappedMesh, assignmentRecord) {
    if (swappedMesh.material === assignmentRecord.assigned) {
      swappedMesh.material = Array.isArray(swappedMesh.material)
        ? swappedMesh.material.map(
            restoredMaterial => sourceMaterialByClone.get(restoredMaterial) || restoredMaterial
          )
        : sourceMaterialByClone.get(swappedMesh.material) || swappedMesh.material;
    }
  }
  function registerLight(lightObject, lightConfig = {}) {
    if (isDisposed || !lightObject?.isLight) {
      return;
    }
    if (!registrationsByLight.get(lightObject)) {
      registrationsByLight.set(lightObject, {
        light: lightObject,
        item: {
          ...lightConfig
        },
        originalLayers: lightObject.layers.mask,
        fullIntensity: Math.max(
          0.00001,
          toFiniteNumber(
            lightObject.userData?.regionFullIntensity,
            toFiniteNumber(lightObject.userData?.lightOnIntensity, lightObject.intensity) || 1
          )
        )
      });
    }
    lightObject.layers.set(30);
    lightObject.castShadow = false;
    shouldRescanStructure = true;
  }
  function syncCamera(camera) {
    if (!isDisposed && camera?.matrixWorld) {
      viewToWorldUniform.value = camera.matrixWorld;
    }
  }
  function sync(activeCamera, skipStructureScan = false) {
    if (isDisposed) {
      return;
    }
    if (!skipStructureScan) {
      contactShadows?.sync();
      const nextRootObject = getRoot?.() || null;
      if (nextRootObject !== rootObject) {
        rootObject = nextRootObject;
        shouldRescanStructure = true;
      }
      if (shouldRescanStructure && (!isMotionEnabled || isMotionInstant)) {
        rebuildStructure();
      }
    }
    syncCamera(activeCamera);
    if (isMotionEnabled && !isMotionInstant) {
      return;
    }
    const motionFadeProgress =
      motionFadeStartMs === null
        ? 1
        : Math.min(1, Math.max(0, (performance.now() - motionFadeStartMs) / 280));
    if (motionFadeProgress < 1) {
      requestFrame();
    } else {
      motionFadeStartMs = null;
    }
    stats.active = 0;
    let shouldUpdateUniforms = false;
    for (const [loopFloorId, loopRegistrations] of registrationsByFloorId) {
      const loopGroups = REGION_KINDS.map(groupKind =>
        groupsByKey.get(loopFloorId + "\0" + groupKind)
      );
      const motionMatrix =
        isMotionEnabled && isMotionInstant ? motionTransformProvider?.(loopFloorId) : null;
      for (const activeLightGroup of loopGroups) {
        if (motionMatrix) {
          activeLightGroup.uniforms.plan2MotionToLayout.value.copy(motionMatrix);
        } else {
          activeLightGroup.uniforms.plan2MotionToLayout.value.identity();
        }
        const gainValue =
          settings.gain * settings[activeLightGroup.kind + "Gain"] * motionFadeProgress;
        shouldUpdateUniforms ||= activeLightGroup.uniforms.plan2Gain.value !== gainValue;
        activeLightGroup.uniforms.plan2Gain.value = gainValue;
        const sunShadowStrength =
          activeLightGroup.kind === "wall"
            ? 0
            : clamp(toFiniteNumber(settings.sunShadowStrength, 0.6), 0, 1) * motionFadeProgress;
        shouldUpdateUniforms ||=
          activeLightGroup.uniforms.plan2SunShadowStrength.value !== sunShadowStrength;
        activeLightGroup.uniforms.plan2SunShadowStrength.value = sunShadowStrength;
        activeLightGroup.changed = false;
      }
      loopRegistrations.forEach((floorEntry, slotIndex) => {
        const { light: light, item: lightItem } = floorEntry;
        light.updateWorldMatrix(true, false);
        lightWorldMatrix.copy(light.matrixWorld);
        if (motionMatrix) {
          lightWorldMatrix.premultiply(motionMatrix);
        }
        lightWorldPosition.setFromMatrixPosition(lightWorldMatrix);
        if (floorEntry.floorRoot) {
          floorEntry.floorRoot.updateWorldMatrix(true, false);
          floorRootPosition.setFromMatrixPosition(floorEntry.floorRoot.matrixWorld);
        }
        if (motionMatrix) {
          floorRootPosition.applyMatrix4(motionMatrix);
        }
        const floorElevation = floorEntry.floorRoot ? floorRootPosition.y : 0;
        const actualAmount = isVisibleWithin(light, rootObject)
          ? clamp(toFiniteNumber(light.intensity) / floorEntry.fullIntensity, 0, 1)
          : 0;
        const effectiveAmount =
          previewKeys === null
            ? actualAmount
            : previewKeys.has(floorEntry.key)
              ? Math.max(0.6, actualAmount)
              : 0;
        if (effectiveAmount > 0.00001) {
          stats.active += 1;
        }
        volumeInputsScratch.length = 0;
        volumeInputsScratch.push(
          ...lightWorldMatrix.elements,
          floorElevation,
          effectiveAmount,
          actualAmount,
          settings.rangeScale,
          lightItem.type,
          lightItem.lightRange,
          lightItem.width,
          lightItem.depth,
          light.width,
          light.height,
          light.color.r,
          light.color.g,
          light.color.b,
          overrides[floorEntry.key],
          stats.structureScans
        );
        if (
          floorEntry.volumeInputs &&
          volumeInputsScratch.every(
            (signatureValue, signatureIndex) =>
              signatureValue === floorEntry.volumeInputs[signatureIndex]
          )
        ) {
          stats.volumeCacheHits++;
          return;
        }
        floorEntry.volumeInputs = volumeInputsScratch.slice();
        const scaledRange =
          clamp(toFiniteNumber(lightItem.lightRange, 3.5), 0.5, 10) *
          clamp(toFiniteNumber(settings.rangeScale, 1), 0.2, 3);
        const isStripLight = lightItem.type === "striplight" || light.isRectAreaLight;
        const defaultRadius = scaledRange * (lightItem.type === "ceilinglight" ? 0.45 : 0.33);
        const halfWidth = Math.max(0.05, toFiniteNumber(lightItem.width, light.width || 2) / 2);
        const halfDepth = Math.max(0.025, toFiniteNumber(lightItem.depth, light.height || 0.2) / 2);
        const matrixElements = lightWorldMatrix.elements;
        const horizontalDistance = Math.hypot(matrixElements[0], matrixElements[2]);
        const directionX =
          horizontalDistance > 0.00001 ? matrixElements[0] / horizontalDistance : 1;
        const directionZ =
          horizontalDistance > 0.00001 ? matrixElements[2] / horizontalDistance : 0;
        const lightOverride = overrides[floorEntry.key];
        const rotationRad = ((lightOverride?.rotation || 0) * Math.PI) / 180;
        const rotatedDirectionX = rotationRad
          ? directionX * Math.cos(rotationRad) - directionZ * Math.sin(rotationRad)
          : directionX;
        const rotatedDirectionZ = rotationRad
          ? directionX * Math.sin(rotationRad) + directionZ * Math.cos(rotationRad)
          : directionZ;
        const softEdgeSize = Math.max(0.3, scaledRange * 0.23);
        const baseRadius = isStripLight
          ? halfDepth + scaledRange * 0.07 + softEdgeSize
          : defaultRadius + softEdgeSize;
        const region = (floorEntry.region ||= {
          center: [0, 0, 0],
          lampCenter: [0, 0, 0],
          axis: [1, 0],
          defaults: {
            axis: [1, 0],
            rotation: 0,
            softness: 1
          }
        });
        const regionDefaults = region.defaults;
        regionDefaults.width = (isStripLight ? halfWidth + baseRadius : baseRadius) * 2;
        regionDefaults.depth = baseRadius * 2;
        regionDefaults.shape = isStripLight ? "strip" : "ellipse";
        regionDefaults.axis[0] = directionX;
        regionDefaults.axis[1] = directionZ;
        region.floorId = loopFloorId;
        region.id = floorEntry.id;
        region.key = floorEntry.key;
        region.type = lightItem.type;
        region.lampCenter[0] = lightWorldPosition.x;
        region.lampCenter[1] = lightWorldPosition.y;
        region.lampCenter[2] = lightWorldPosition.z;
        region.offsetX = lightOverride?.offsetX ?? 0;
        region.offsetZ = lightOverride?.offsetZ ?? 0;
        region.moveCenterEnabled = lightOverride?.moveCenterEnabled === true;
        region.center[0] = lightWorldPosition.x + region.offsetX;
        region.center[1] = lightWorldPosition.y;
        region.center[2] = lightWorldPosition.z + region.offsetZ;
        region.axis[0] = rotatedDirectionX;
        region.axis[1] = rotatedDirectionZ;
        region.width = lightOverride?.width ?? regionDefaults.width;
        region.depth = lightOverride?.depth ?? regionDefaults.depth;
        region.rotation = lightOverride?.rotation ?? 0;
        region.softness = lightOverride?.softness ?? 1;
        region.shape = lightOverride?.shape ?? regionDefaults.shape;
        region.overridden = !!lightOverride;
        region.amount = effectiveAmount;
        region.realAmount = actualAmount;
        region.heightAbove = lightOverride?.heightAbove;
        region.heightBelow = lightOverride?.heightBelow;
        region.lampHeight = lightWorldPosition.y - floorElevation;
        region.heightMin =
          lightOverride?.heightMin ??
          (lightOverride?.heightBelow === undefined
            ? undefined
            : region.lampHeight - lightOverride.heightBelow);
        region.heightMax =
          lightOverride?.heightMax ??
          (lightOverride?.heightAbove === undefined
            ? undefined
            : region.lampHeight + lightOverride.heightAbove);
        for (const loopLightGroup of loopGroups) {
          const loopSlot = loopLightGroup.slots[slotIndex];
          const loopKind = loopLightGroup.kind;
          let bottomY = floorElevation - (loopKind === "floor" ? 0.18 : 0.1);
          let topY = Math.max(
            floorElevation + 0.2,
            lightWorldPosition.y + (loopKind === "wall" ? 0.55 : 0.2)
          );
          let edgeFade = Math.max(
            0.3,
            scaledRange * (loopKind === "floor" ? 0.23 : loopKind === "wall" ? 0.18 : 0.2)
          );
          let slotAmount = effectiveAmount;
          if (
            lightOverride?.heightAbove !== undefined ||
            lightOverride?.heightBelow !== undefined ||
            lightOverride?.heightMin !== undefined ||
            lightOverride?.heightMax !== undefined
          ) {
            const bottomLimit =
              lightOverride.heightMin !== undefined
                ? lightOverride.heightMin === 0
                  ? floorElevation - 0.18 - edgeFade
                  : floorElevation + lightOverride.heightMin
                : lightOverride.heightBelow === undefined
                  ? bottomY - edgeFade
                  : lightWorldPosition.y - lightOverride.heightBelow;
            const topLimit =
              lightOverride.heightMax !== undefined
                ? floorElevation + lightOverride.heightMax
                : lightOverride.heightAbove === undefined
                  ? topY + edgeFade
                  : lightWorldPosition.y + lightOverride.heightAbove;
            const heightSpan = Math.max(0, topLimit - bottomLimit);
            edgeFade = Math.max(0.00001, Math.min(edgeFade, heightSpan / 2));
            bottomY = bottomLimit + edgeFade;
            topY = Math.max(bottomY, topLimit - edgeFade);
            if (heightSpan <= 0.00001) {
              slotAmount = 0;
            }
          }
          const slotHalfWidth = lightOverride
            ? lightOverride.width / 2
            : isStripLight
              ? halfWidth
              : defaultRadius + edgeFade;
          const slotHalfDepth = lightOverride
            ? lightOverride.depth / 2
            : isStripLight
              ? halfDepth + scaledRange * 0.07 + edgeFade
              : defaultRadius + edgeFade;
          let slotChanged = setVector4IfChanged(
            loopSlot.center,
            region.center[0],
            (bottomY + topY) / 2,
            region.center[2],
            slotAmount
          );
          slotChanged =
            setVector4IfChanged(
              loopSlot.extent,
              slotHalfWidth,
              (topY - bottomY) / 2,
              slotHalfDepth,
              edgeFade
            ) || slotChanged;
          slotChanged =
            setVector4IfChanged(loopSlot.color, light.color.r, light.color.g, light.color.b, 0) ||
            slotChanged;
          slotChanged =
            setVector4IfChanged(
              loopSlot.axis,
              rotatedDirectionX,
              rotatedDirectionZ,
              lightOverride
                ? lightOverride.shape === "square"
                  ? 4
                  : lightOverride.shape === "strip"
                    ? 3
                    : 2
                : isStripLight
                  ? 1
                  : 0,
              lightOverride?.softness ?? 0
            ) || slotChanged;
          loopLightGroup.changed ||= slotChanged;
          if (slotChanged && loopLightGroup.texture) {
            const textureData = loopLightGroup.texture.image.data;
            const slotByteOffset = slotIndex * 16;
            loopSlot.center.toArray(textureData, slotByteOffset);
            loopSlot.extent.toArray(textureData, slotByteOffset + 4);
            loopSlot.color.toArray(textureData, slotByteOffset + 8);
            loopSlot.axis.toArray(textureData, slotByteOffset + 12);
          }
        }
      });
      for (const dirtyLightGroup of loopGroups) {
        if (dirtyLightGroup.changed && dirtyLightGroup.texture) {
          dirtyLightGroup.texture.needsUpdate = true;
        }
        shouldUpdateUniforms ||= dirtyLightGroup.changed;
      }
    }
    if (shouldUpdateUniforms) {
      stats.uniformUpdates += 1;
    }
    stats.nativeLights = nativeLights.filter(
      sceneLight =>
        isVisibleWithin(sceneLight, scene) &&
        (!activeCamera || sceneLight.layers.test(activeCamera.layers))
    ).length;
  }
  function inspect() {
    return {
      ...stats,
      settings: {
        ...settings
      },
      overrides: getOverrides(),
      previewKeys: previewKeys ? [...previewKeys] : null,
      regions: listRegions(),
      floors: [...registrationsByFloorId].map(([inspectFloorId, inspectRegistrations]) => ({
        floorId: inspectFloorId,
        slots: inspectRegistrations.length,
        capacity: groupsByKey.get(inspectFloorId + "\0floor")?.capacity,
        lights: inspectRegistrations.map(inspectEntry => ({
          id: inspectEntry.item.id || inspectEntry.light.uuid,
          type: inspectEntry.item.type,
          intensity: inspectEntry.light.intensity,
          fullIntensity: inspectEntry.fullIntensity,
          amount: clamp(
            toFiniteNumber(inspectEntry.light.intensity) / inspectEntry.fullIntensity,
            0,
            1
          ),
          effectiveAmount: inspectEntry.region?.amount ?? 0,
          regionKey: inspectEntry.key,
          visible: isVisibleWithin(inspectEntry.light, rootObject)
        }))
      }))
    };
  }
  function setOverrides(rawOverrideInput) {
    overrides = sanitizeRegionOverrides(rawOverrideInput);
    sync(undefined, true);
    return getOverrides();
  }
  function getOverrides() {
    return Object.fromEntries(
      Object.entries(overrides).map(([overrideKey, overrideValue]) => [
        overrideKey,
        {
          ...overrideValue
        }
      ])
    );
  }
  function listRegions() {
    return [...registrationsByLight.values()]
      .filter(regionEntry => regionEntry.region)
      .map(({ region: regionRecord }) => ({
        ...regionRecord,
        center: [...regionRecord.center],
        lampCenter: [...regionRecord.lampCenter],
        axis: [...regionRecord.axis],
        defaults: {
          ...regionRecord.defaults,
          axis: [...regionRecord.defaults.axis]
        }
      }));
  }
  function setPreview(previewKeyList) {
    previewKeys = Array.isArray(previewKeyList)
      ? new Set(
          previewKeyList.filter(
            previewKey => typeof previewKey == "string" && isRegionLightKey(previewKey)
          )
        )
      : null;
    sync(undefined, true);
  }
  function sampleFloorVolume(
    samplePoint,
    sampleFloorId = registrationsByFloorId.keys().next().value,
    sampleKind = "floor"
  ) {
    const sampleGroup = groupsByKey.get(sampleFloorId + "\0" + sampleKind);
    if (sampleGroup) {
      return sampleRegionVolumes(
        sampleGroup.slots.slice(0, sampleGroup.uniforms.plan2LightCount.value),
        sampleWorldPoint
          .copy(samplePoint)
          .applyMatrix4(sampleGroup.uniforms.plan2MotionToLayout.value),
        sampleGroup.uniforms.plan2Gain.value
      );
    } else {
      return [0, 0, 0];
    }
  }
  function dispose() {
    if (!isDisposed) {
      isDisposed = true;
      stats.disposed = true;
      if (scene.onBeforeRender === onBeforeRender) {
        scene.onBeforeRender = originalOnBeforeRender;
      }
      for (const listenedNode of listenedNodes) {
        listenedNode.removeEventListener("childadded", markStructureDirty);
        listenedNode.removeEventListener("childremoved", markStructureDirty);
      }
      for (const [swappedMeshEntry, meshAssignmentRecord] of assignmentsByMesh) {
        restoreMeshMaterial(swappedMeshEntry, meshAssignmentRecord);
      }
      for (const cloneMapToDispose of clonesByMaterial.values()) {
        for (const cloneToDispose of cloneMapToDispose.values()) {
          cloneToDispose.dispose();
        }
      }
      for (const disposedLightGroup of groupsByKey.values()) {
        disposedLightGroup.texture?.dispose();
      }
      for (const restoredLight of registrationsByLight.values()) {
        restoredLight.light.layers.mask = restoredLight.originalLayers;
      }
      listenedNodes.clear();
      assignmentsByMesh.clear();
      clonesByMaterial.clear();
      registrationsByLight.clear();
      groupsByKey.clear();
      retainedRoots.clear();
      if (typeof window !== "undefined" && window.__plan2Region === controller) {
        delete window.__plan2Region;
      }
    }
  }
  function onBeforeRender(...renderArgs) {
    originalOnBeforeRender?.apply(this, renderArgs);
    sync(renderArgs[2]);
  }
  const setFloorBrightness = brightnessPercent => {
    const brightnessRatio = clamp(toFiniteNumber(brightnessPercent, 100), 50, 150) / 100;
    if (brightnessRatio === floorBrightnessUniform.value) {
      return false;
    } else {
      floorBrightnessUniform.value = brightnessRatio;
      stats.uniformUpdates += 1;
      return true;
    }
  };
  function setMotion(motionEnabled, motionInstant = false) {
    if (isMotionEnabled === (motionEnabled === true) && isMotionInstant === motionInstant) {
      return;
    }
    const previousMotionInstant = isMotionInstant;
    isMotionInstant = motionInstant;
    isMotionEnabled = motionEnabled === true;
    motionFadeStartMs =
      isMotionEnabled || motionInstant || previousMotionInstant ? null : performance.now();
    if (isMotionEnabled && !isMotionInstant) {
      for (const frozenLightGroup of groupsByKey.values()) {
        frozenLightGroup.uniforms.plan2Gain.value = 0;
        frozenLightGroup.uniforms.plan2SunShadowStrength.value = 0;
      }
    }
    shouldRescanStructure = true;
    requestFrame();
  }
  const controller = {
    register: registerLight,
    sync: sync,
    syncCamera: syncCamera,
    dispose: dispose,
    stats: stats,
    settings: settings,
    inspect: inspect,
    sample: sampleFloorVolume,
    invalidate: markStructureDirty,
    setFloorBrightness: setFloorBrightness,
    setMotion: setMotion,
    setMotionTransformProvider(provider) {
      motionTransformProvider = provider;
    },
    setOverrides: setOverrides,
    getOverrides: getOverrides,
    listRegions: listRegions,
    setPreview: setPreview,
    retainRoot(retainedRoot) {
      retainedRoots.add(retainedRoot);
      markStructureDirty();
    },
    releaseRoot(releasedRoot) {
      retainedRoots.delete(releasedRoot);
      markStructureDirty();
    }
  };
  scene.onBeforeRender = onBeforeRender;
  if (typeof window !== "undefined") {
    window.__plan2Region = controller;
  }
  return controller;
}
