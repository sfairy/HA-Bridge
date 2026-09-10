import { finite } from "./studio-normalization.js?v=20260903-studio-normalization-v2";
const HOME_LITE_VERSION = "20260903-home-lite-v1";
const APPLIANCE_LITE_VERSION = "20260903-appliance-lite-v1";
function homeLiteModel(baseName, fallbackVersion, extra) {
  return Object.freeze({
    url: "/bridge-static/3d-studio/models/" + baseName + "-lite.glb?v=" + HOME_LITE_VERSION,
    fallbackUrl: "/bridge-static/3d-studio/models/" + baseName + ".glb?v=" + fallbackVersion,
    ...extra
  });
}
function applianceLiteModel(applianceName, applianceExtra) {
  return Object.freeze({
    url: "/bridge-static/3d-studio/models/" + applianceName + "-lite.glb?v=" + APPLIANCE_LITE_VERSION,
    fallbackUrl: "/bridge-static/3d-studio/models/" + applianceName + ".glb?v=20260901-all-appliance-models-v1",
    ...applianceExtra
  });
}
/** Shrink the stock bed base footprint slightly so legs sit flush without floor clipping. */
export function insetBedBaseGeometry(geometry) {
  if (!geometry?.attributes?.position) {
    return geometry;
  }
  geometry.computeBoundingBox();
  const {
    min,
    max
  } = geometry.boundingBox;
  if (Math.abs(min.y) > 0.002 || Math.abs(max.y - 0.186) > 0.002 || Math.abs(max.x - min.x - 1.8) > 0.002 || Math.abs(max.z - min.z - 2) > 0.002) {
    return geometry;
  }
  const inset = geometry.clone();
  const centerX = (min.x + max.x) / 2;
  const centerZ = (min.z + max.z) / 2;
  inset.translate(-centerX, 0, -centerZ).scale(0.996, 1, 0.996).translate(centerX, 0, centerZ);
  inset.computeBoundingBox();
  inset.computeBoundingSphere();
  return inset;
}
export const EXTERNAL_ITEM_MODELS = Object.freeze({
  sofa: {
    url: "/bridge-static/3d-studio/models/sofa-lite.glb?v=20260903-sofa-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/sofa.glb?v=20260901-sofa-draco-v1",
    scaleBasis: [2.2, 0.82, 0.9],
    preserveOrigin: true,
    groundAlign: true,
    groundOffset: -0.008
  },
  coffeetable: homeLiteModel("coffeetable", "20260901-home-assets-v2", {
    scaleBasis: [1.7, 0.5, 1.25],
    preserveOrigin: true
  }),
  squarecoffeetable: homeLiteModel("squarecoffeetable", "20260901-home-assets-v1", {
    url: "/bridge-static/3d-studio/models/squarecoffeetable-lite.glb?v=20260903-square-coffee-table-v2",
    fallbackUrl: "/bridge-static/3d-studio/models/squarecoffeetable.glb?v=20260903-square-coffee-table-v2",
    scaleBasis: [1.4, 0.46, 0.7],
    preserveOrigin: true
  }),
  tvstand: homeLiteModel("tvstand", "20260901-home-assets-v1", {
    url: "/bridge-static/3d-studio/models/tvstand-lite.glb?v=20260903-tvstand-top-board-v3",
    fallbackUrl: "/bridge-static/3d-studio/models/tvstand.glb?v=20260903-tvstand-top-board-v3",
    scaleBasis: [1.8, 0.48, 0.42],
    preserveOrigin: true
  }),
  rug: homeLiteModel("rug", "20260901-home-assets-v1", {
    scaleBasis: [2, 0.012, 1.4],
    preserveOrigin: true
  }),
  plant: homeLiteModel("plant", "20260901-home-assets-v1", {
    scaleBasis: [0.75, 1.6, 0.75],
    preserveOrigin: true
  }),
  bed: homeLiteModel("bed", "20260901-home-furniture-v1", {
    scaleBasis: [1.8, 0.62, 2],
    preserveOrigin: true
  }),
  nightstand: homeLiteModel("nightstand", "20260901-home-furniture-v1", {
    scaleBasis: [0.5, 0.55, 0.42],
    preserveOrigin: true
  }),
  vanity: homeLiteModel("vanity", "20260901-home-furniture-v1", {
    scaleBasis: [1.2, 1.55, 0.5],
    preserveOrigin: true
  }),
  desk: homeLiteModel("desk", "20260901-home-furniture-v1", {
    scaleBasis: [1.4, 0.76, 0.65],
    preserveOrigin: true
  }),
  bookcase: homeLiteModel("bookcase", "20260901-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.32],
    preserveOrigin: true
  }),
  smallcar: {
    url: "/bridge-static/3d-studio/models/car-lite.glb?v=20260902-car-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/car.glb?v=20260811-car1"
  },
  airoutlet: {
    url: "/bridge-static/3d-studio/models/air-outlet-lite.glb?v=20260902-air-outlet-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/air-outlet.glb?v=20260812-air-outlet1"
  },
  pipelinewaterpurifier: {
    url: "/bridge-static/3d-studio/models/pipeline-water-purifier-lite.glb?v=20260902-pipeline-water-purifier-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/pipeline-water-purifier.glb?v=20260821-glb-material-v1"
  },
  tea_bar_machine: {
    url: "/bridge-static/3d-studio/models/tea-bar-machine-lite.glb?v=20260902-tea-bar-machine-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/tea-bar-machine.glb?v=20260821-glb-material-v1"
  },
  elevator: {
    url: "/bridge-static/3d-studio/models/elevator-lite.glb?v=20260902-elevator-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/elevator.glb?v=20260825-elevator-material-v1"
  },
  steelstairs: {
    url: "/bridge-static/3d-studio/models/steel-stairs-lite.glb?v=20260902-steel-stairs-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/steel-stairs.glb?v=20260821-stairs-v1"
  },
  glassstairs: {
    url: "/bridge-static/3d-studio/models/glass-stairs-lite.glb?v=20260902-glass-stairs-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/glass-stairs.glb?v=20260821-stairs-v1"
  },
  piano: {
    url: "/bridge-static/3d-studio/models/piano-lite.glb?v=20260902-piano-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/piano.glb?v=20260824-piano-v3",
    preserveAspect: true
  }
});
export const ALL_ITEM_MODELS = Object.freeze({
  ...EXTERNAL_ITEM_MODELS,
  bed: homeLiteModel("bed", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 0.62, 2],
    preserveOrigin: true
  }),
  nightstand: homeLiteModel("nightstand", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.5, 0.55, 0.42],
    preserveOrigin: true
  }),
  vanity: homeLiteModel("vanity", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.55, 0.5],
    preserveOrigin: true
  }),
  desk: homeLiteModel("desk", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.4, 0.76, 0.65],
    preserveOrigin: true
  }),
  bookcase: homeLiteModel("bookcase", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.32],
    preserveOrigin: true
  }),
  aquarium: homeLiteModel("aquarium", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.5, 1.4, 0.55],
    preserveOrigin: true
  }),
  table: homeLiteModel("table", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.4, 0.82, 1.8],
    preserveOrigin: true
  }),
  rounddiningtable: homeLiteModel("rounddiningtable", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.2, 0.78, 2.2],
    preserveOrigin: true
  }),
  chair: homeLiteModel("chair", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.5, 0.86, 0.5],
    preserveOrigin: true
  }),
  bar: homeLiteModel("bar", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.2, 1.05, 0.65],
    preserveOrigin: true
  }),
  sideboard: homeLiteModel("sideboard", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.6, 2.2, 0.45],
    preserveOrigin: true
  }),
  shoecabinet: homeLiteModel("shoecabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.25, 0.42],
    preserveOrigin: true
  }),
  cabinet: homeLiteModel("cabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.6, 1.9, 0.45],
    preserveOrigin: true
  }),
  glasscabinet: homeLiteModel("glasscabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.4],
    preserveOrigin: true
  }),
  shelf: homeLiteModel("shelf", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.8, 0.45],
    preserveOrigin: true
  }),
  wallcabinet: homeLiteModel("wallcabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.5, 0.82, 0.35],
    preserveOrigin: true
  }),
  kitchenbase: homeLiteModel("kitchenbase", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.4, 0.85, 0.6],
    preserveOrigin: true
  }),
  kitchensink: homeLiteModel("kitchensink", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 0.85, 0.6],
    preserveOrigin: true
  }),
  kitchencooktop: homeLiteModel("kitchencooktop", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 0.85, 0.6],
    preserveOrigin: true
  }),
  basin: homeLiteModel("basin", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.9, 0.88, 0.5],
    preserveOrigin: true
  }),
  toilet: homeLiteModel("toilet", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.42, 0.52, 0.7],
    preserveOrigin: true
  }),
  squattoilet: homeLiteModel("squattoilet", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.45, 0.18, 0.65],
    preserveOrigin: true
  }),
  urinal: homeLiteModel("urinal", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.38, 0.72, 0.34],
    preserveOrigin: true
  }),
  shower: homeLiteModel("shower", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.9, 2.1, 0.9],
    preserveOrigin: true
  }),
  bathtub: homeLiteModel("bathtub", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.7, 0.58, 0.78],
    preserveOrigin: true
  }),
  glasspartition: homeLiteModel("glasspartition", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 2, 0.08],
    preserveOrigin: true
  }),
  stairs: homeLiteModel("stairs", "20260901-all-home-furniture-v1", {
    scaleBasis: [1, 1.65, 2.8],
    preserveOrigin: true
  }),
  pillar: homeLiteModel("pillar", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.45, 2.8, 0.45],
    preserveOrigin: true
  }),
  curtain_left: homeLiteModel("curtain_left", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true
  }),
  curtain_right: homeLiteModel("curtain_right", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true
  }),
  curtain_split: homeLiteModel("curtain_split", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true
  }),
  rounddiningtable_turntable: homeLiteModel("rounddiningtable_turntable", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.2, 0.78, 2.2],
    preserveOrigin: true
  }),
  tv_standard: applianceLiteModel("tv_standard", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true
  }),
  tv_tabletop: applianceLiteModel("tv_tabletop", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true
  }),
  tv_mobile: applianceLiteModel("tv_mobile", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true
  }),
  wallac: applianceLiteModel("wallac", {
    scaleBasis: [0.9, 0.28, 0.22],
    preserveOrigin: true
  }),
  floorac: applianceLiteModel("floorac", {
    scaleBasis: [0.42, 1.75, 0.42],
    preserveOrigin: true
  }),
  airpurifier: applianceLiteModel("airpurifier", {
    scaleBasis: [0.34, 0.7, 0.34],
    preserveOrigin: true
  }),
  robotvacuum: applianceLiteModel("robotvacuum", {
    scaleBasis: [0.55, 0.85, 0.5],
    preserveOrigin: true
  }),
  floorlamp: applianceLiteModel("floorlamp", {
    scaleBasis: [1.35, 1.8, 0.5],
    preserveOrigin: true
  }),
  walllamp: applianceLiteModel("walllamp", {
    scaleBasis: [0.3, 0.34, 0.22],
    preserveOrigin: true
  }),
  fridge: applianceLiteModel("fridge", {
    scaleBasis: [0.75, 1.85, 0.72],
    preserveOrigin: true
  }),
  rangehood: applianceLiteModel("rangehood", {
    scaleBasis: [0.9, 0.55, 0.45],
    preserveOrigin: true
  }),
  dishwasher: applianceLiteModel("dishwasher", {
    scaleBasis: [0.6, 0.82, 0.6],
    preserveOrigin: true
  }),
  steamoven: applianceLiteModel("steamoven", {
    scaleBasis: [0.6, 0.6, 0.55],
    preserveOrigin: true
  }),
  microwave: applianceLiteModel("microwave", {
    scaleBasis: [0.52, 0.32, 0.42],
    preserveOrigin: true
  }),
  ricecooker: applianceLiteModel("ricecooker", {
    scaleBasis: [0.28, 0.25, 0.32],
    preserveOrigin: true
  }),
  washer: applianceLiteModel("washer", {
    scaleBasis: [0.6, 0.85, 0.65],
    preserveOrigin: true
  }),
  dryer: applianceLiteModel("dryer", {
    scaleBasis: [0.6, 0.85, 0.65],
    preserveOrigin: true
  }),
  storagewaterheater: applianceLiteModel("storagewaterheater", {
    scaleBasis: [0.86, 0.48, 0.46],
    preserveOrigin: true
  }),
  gaswaterheater: applianceLiteModel("gaswaterheater", {
    scaleBasis: [0.42, 0.72, 0.22],
    preserveOrigin: true
  }),
  desktop: applianceLiteModel("desktop", {
    scaleBasis: [0.72, 0.5, 0.32],
    preserveOrigin: true
  }),
  laptop: applianceLiteModel("laptop", {
    scaleBasis: [0.36, 0.22, 0.28],
    preserveOrigin: true
  }),
  nas: applianceLiteModel("nas", {
    scaleBasis: [0.28, 0.34, 0.24],
    preserveOrigin: true
  })
});
const FURNITURE_MODEL_TYPES = new Set(["sofa", "coffeetable", "squarecoffeetable", "tvstand", "rug", "plant", "bed", "nightstand", "vanity", "desk", "bookcase", "aquarium", "table", "rounddiningtable", "chair", "bar", "sideboard", "shoecabinet", "cabinet", "glasscabinet", "shelf", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop", "basin", "toilet", "squattoilet", "urinal", "shower", "bathtub", "glasspartition", "stairs", "pillar", "curtain_left", "curtain_right", "curtain_split", "rounddiningtable_turntable", "tv_standard", "tv_tabletop", "tv_mobile", "wallac", "floorac", "airpurifier", "robotvacuum", "floorlamp", "walllamp", "fridge", "rangehood", "dishwasher", "steamoven", "microwave", "ricecooker", "washer", "dryer", "storagewaterheater", "gaswaterheater", "desktop", "laptop", "nas"]);
const WOOD_TONE_MODEL_TYPES = new Set(["bed", "nightstand", "vanity", "desk", "bookcase", "table", "rounddiningtable", "chair", "bar", "sideboard", "shoecabinet", "cabinet", "glasscabinet", "shelf", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop"]);
const APPLIANCE_MODEL_TYPES = new Set(["tv_standard", "tv_tabletop", "tv_mobile", "wallac", "floorac", "airpurifier", "robotvacuum", "floorlamp", "walllamp", "fridge", "rangehood", "dishwasher", "steamoven", "microwave", "ricecooker", "washer", "dryer", "storagewaterheater", "gaswaterheater", "desktop", "laptop", "nas", "pipelinewaterpurifier", "tea_bar_machine", "airoutlet"]);
const PALETTE_OVERRIDE_MODEL_TYPES = new Set(["sofa", "coffeetable", "squarecoffeetable", "tvstand", "rug", "plant", "bed", "nightstand", "vanity", "desk", "bookcase", "pipelinewaterpurifier", "tea_bar_machine", "elevator", "steelstairs", "glassstairs", "piano"]);
export function createExternalModelManager({
  THREE,
  loader,
  stairItemTypes,
  isModelInUse,
  requestRender,
  onLoadStateChange = () => {},
  maxConcurrentLoads = 2,
  loadTimeoutMs = 12000
}) {
  const loadedModels = new Map();
  const pendingLoads = new Map();
  const loadQueue = [];
  const materialCache = new Map();
  const concurrencyLimit = Math.max(1, Math.floor(finite(maxConcurrentLoads, 2)));
  const timeoutMs = Math.max(50, Math.floor(finite(loadTimeoutMs, 12000)));
  let activeLoads = 0;
  let materialReuseCount = 0;
  function modelLoadState() {
    return {
      active: activeLoads,
      queued: loadQueue.length,
      limit: concurrencyLimit,
      timeoutMs,
      materials: materialCache.size,
      materialReuses: materialReuseCount
    };
  }
  function notifyLoadState() {
    onLoadStateChange(modelLoadState());
  }
  function pumpQueue() {
    while (activeLoads < concurrencyLimit && loadQueue.length) {
      const queuedJob = loadQueue.shift();
      activeLoads += 1;
      notifyLoadState();
      Promise.resolve().then(queuedJob.run).then(queuedJob.resolve, queuedJob.reject).finally(() => {
        activeLoads -= 1;
        pumpQueue();
        notifyLoadState();
      });
    }
  }
  function enqueueLoad(runLoad) {
    return new Promise((resolveLoad, rejectLoad) => {
      loadQueue.push({
        run: runLoad,
        resolve: resolveLoad,
        reject: rejectLoad
      });
      notifyLoadState();
      pumpQueue();
    });
  }
  function loadModelAsset(modelDef, modelKey) {
    let timeoutId = null;
    const loadWithTimeout = url => Promise.race([loader.loadAsync(url), new Promise((resolveRace, rejectRace) => {
      timeoutId = setTimeout(() => rejectRace(new Error("模型 " + modelKey + " 加载超时")), timeoutMs);
    })]).finally(() => clearTimeout(timeoutId));
    if (modelDef?.url) {
      return loadWithTimeout(modelDef.url).catch(primaryError => {
        if (!modelDef.fallbackUrl) {
          throw primaryError;
        }
        return loadWithTimeout(modelDef.fallbackUrl);
      });
    } else {
      return Promise.reject(new Error("模型 " + modelKey + " 没有可用资源"));
    }
  }
  function modelTypeForItem(item) {
    if (item.type === "curtain") {
      return "curtain_" + (["left", "right", "split"].includes(item.curtainPosition) ? item.curtainPosition : "split");
    } else if (item.type === "rounddiningtable" && (item.roundTableTurntable === true || item.type === "rounddiningtableturntable")) {
      return "rounddiningtable_turntable";
    } else if (item.type === "tv") {
      return "tv_" + (["standard", "tabletop", "mobile"].includes(item.tvMountStyle) ? item.tvMountStyle : "standard");
    } else {
      return item.type;
    }
  }
  function loadExternalItemModel(typeKey) {
    if (typeof window !== "undefined" && window.externalModelLoadsDeferred && !window.__haBridgeReleasingDeferredModels) {
      window.__haBridgeDeferExternalModel?.(typeKey);
      return Promise.resolve(null);
    }
    if (loadedModels.has(typeKey)) {
      return Promise.resolve(loadedModels.get(typeKey));
    }
    if (pendingLoads.has(typeKey)) {
      return pendingLoads.get(typeKey);
    }
    const definition = ALL_ITEM_MODELS[typeKey];
    if (!definition) {
      return Promise.resolve(null);
    }
    const loadPromise = enqueueLoad(() => loadModelAsset(definition, typeKey)).then(gltf => {
      const sceneRoot = gltf.scene || gltf.scenes?.[0];
      if (!sceneRoot) {
        throw new Error("模型 " + typeKey + " 没有可显示的场景");
      }
      if (typeKey === "bed") {
        sceneRoot.traverse(node => {
          if (node.isMesh) {
            node.geometry = insetBedBaseGeometry(node.geometry);
          }
        });
      }
      sceneRoot.updateMatrixWorld(true);
      const modelSize = new THREE.Box3().setFromObject(sceneRoot).getSize(new THREE.Vector3());
      if (![modelSize.x, modelSize.y, modelSize.z].every(axisSize => Number.isFinite(axisSize) && axisSize > 0.001)) {
        throw new Error("模型 " + typeKey + " 的尺寸无效");
      }
      const cached = {
        source: sceneRoot,
        size: modelSize
      };
      loadedModels.set(typeKey, cached);
      if (isModelInUse(typeKey)) {
        requestRender({
          force: true
        });
      }
      return cached;
    }).catch(loadError => {
      globalThis.window?.HABridgeLog?.error(loadError, {
        phase: "studio-model-load"
      }, "无法载入外部模型 " + typeKey + "：" + (loadError?.message || loadError));
      if (String(loadError?.message || loadError).includes("加载超时")) {
        console.debug("外部模型 " + typeKey + " 加载超时，继续使用原模型");
      } else {
        console.error("无法载入外部模型 " + typeKey, loadError);
      }
      if (isModelInUse(typeKey)) {
        requestRender({
          force: true
        });
      }
      return null;
    }).finally(() => pendingLoads.delete(typeKey));
    pendingLoads.set(typeKey, loadPromise);
    return loadPromise;
  }
  function paletteFromLuminance(sourceMaterial, palette) {
    if (!sourceMaterial) {
      return sourceMaterial;
    }
    const sourceColor = sourceMaterial.color?.clone?.() || new THREE.Color(16777215);
    const luminance = sourceColor.r * 0.2126 + sourceColor.g * 0.7152 + sourceColor.b * 0.0722;
    const emissiveColor = luminance < 0.1 ? palette.furnitureDark : luminance < 0.42 ? palette.furniture : luminance < 0.72 ? palette.furnitureSoft : palette.furnitureLight;
    const baseColor = new THREE.Color(emissiveColor).multiplyScalar(0.34);
    const paletteMaterial = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: luminance < 0.1 ? 0.34 : luminance < 0.42 ? 0.52 : 0.58,
      metalness: luminance < 0.1 ? 0.22 : 0.04,
      emissive: emissiveColor,
      emissiveIntensity: 0.46,
      side: sourceMaterial.side ?? THREE.FrontSide,
      transparent: false,
      opacity: 1,
      depthWrite: sourceMaterial.depthWrite ?? true,
      depthTest: sourceMaterial.depthTest ?? true,
      toneMapped: true
    });
    paletteMaterial.name = (sourceMaterial.name || "external-model") + " · HA Bridge palette";
    return paletteMaterial;
  }
  function makeFurnitureMaterial(baseMaterial, color, options = {}) {
    if (!baseMaterial) {
      return baseMaterial;
    }
    const furnitureMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.58,
      metalness: options.metalness ?? 0.04,
      flatShading: options.flatShading ?? false,
      emissive: 0,
      emissiveIntensity: 0,
      side: baseMaterial.side ?? THREE.FrontSide,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1,
      depthWrite: options.depthWrite ?? baseMaterial.depthWrite ?? true,
      depthTest: baseMaterial.depthTest ?? true,
      toneMapped: true
    });
    furnitureMaterial.name = (baseMaterial.name || "external-model") + " · HA Bridge furniture material";
    furnitureMaterial.polygonOffset = options.polygonOffset === true;
    furnitureMaterial.polygonOffsetFactor = options.polygonOffsetFactor ?? 0;
    furnitureMaterial.polygonOffsetUnits = options.polygonOffsetUnits ?? 0;
    return furnitureMaterial;
  }
  function furnitureTint(material, colors, modelType) {
    const materialName = (material?.name || "").toLowerCase();
    let tint = colors.furniture;
    if (/^curtain_(left|right|split)$/.test(modelType)) {
      const curtainMatIndex = materialName.match(/material-(\d+)/)?.[1];
      if (["0", "4"].includes(curtainMatIndex)) {
        tint = colors.furnitureDark;
      } else if (["1", "5", "2", "3"].includes(curtainMatIndex)) {
        tint = colors.furnitureSoft;
      } else {
        tint = colors.furniture;
      }
    } else if (modelType === "coffeetable" || modelType === "squarecoffeetable") {
      tint = materialName.endsWith("-dark") ? colors.furnitureDark : materialName.endsWith("-light") || materialName.endsWith("-soft") ? colors.furnitureSoft : colors.furniture;
    } else if (modelType === "tvstand") {
      const tvstandColor = material?.color?.clone?.() || new THREE.Color(16777215);
      const tvstandLum = tvstandColor.r * 0.2126 + tvstandColor.g * 0.7152 + tvstandColor.b * 0.0722;
      tint = materialName.endsWith("-dark") || tvstandLum < 0.16 ? colors.furnitureDark : materialName.endsWith("-soft") || materialName.endsWith("-light") || tvstandLum >= 0.3 ? colors.furnitureSoft : colors.furniture;
    } else if (["table", "rounddiningtable", "rounddiningtable_turntable"].includes(modelType)) {
      const tableMatIndex = materialName.match(/material-(\d+)/)?.[1];
      const softMatIndexes = modelType === "rounddiningtable_turntable" ? ["0", "3"] : ["0"];
      const tableColor = material?.color?.clone?.() || new THREE.Color(16777215);
      const tableLum = tableColor.r * 0.2126 + tableColor.g * 0.7152 + tableColor.b * 0.0722;
      tint = softMatIndexes.includes(tableMatIndex) ? colors.furnitureSoft : tableLum < 0.2 ? colors.furnitureDark : tableLum < 0.55 ? colors.furniture : colors.furnitureSoft;
    } else if (["kitchenbase", "kitchensink", "kitchencooktop", "basin"].includes(modelType)) {
      const kitchenMatIndex = materialName.match(/material-(\d+)/)?.[1];
      const kitchenHardIndex = modelType === "basin" ? "1" : "2";
      const kitchenColor = material?.color?.clone?.() || new THREE.Color(16777215);
      const kitchenLum = kitchenColor.r * 0.2126 + kitchenColor.g * 0.7152 + kitchenColor.b * 0.0722;
      tint = kitchenMatIndex === kitchenHardIndex ? colors.furniture : kitchenLum < 0.2 ? colors.furnitureDark : kitchenLum < 0.55 ? colors.furniture : colors.furnitureSoft;
    } else if (modelType === "stairs") {
      tint = colors.furniture;
    } else if (modelType === "plant" && (materialName.endsWith("-soft") || materialName.endsWith("-dark"))) {
      tint = colors.furniture;
    } else if (materialName.includes("foliagesoft")) {
      tint = 7835779;
    } else if (materialName.includes("foliage")) {
      tint = 6257261;
    } else if (materialName.endsWith("-soft") || materialName.endsWith("-light")) {
      tint = colors.furnitureSoft;
    } else if (materialName.endsWith("-dark")) {
      tint = colors.furnitureDark;
    } else if (WOOD_TONE_MODEL_TYPES.has(modelType)) {
      const furnitureColor = material.color?.clone?.() || new THREE.Color(16777215);
      const furnitureLum = furnitureColor.r * 0.2126 + furnitureColor.g * 0.7152 + furnitureColor.b * 0.0722;
      tint = furnitureLum < 0.2 ? colors.furnitureDark : furnitureLum < 0.55 ? colors.furniture : colors.furnitureSoft;
    }
    const rugSoftOffset = modelType === "rug" && materialName.endsWith("-soft");
    const isGlass = materialName.endsWith("-glass") || material?.transparent === true || (material?.opacity ?? 1) < 1;
    return makeFurnitureMaterial(material, tint, {
      roughness: materialName.includes("foliage") || modelType === "rug" ? 0.9 : 0.72,
      metalness: materialName.includes("foliage") || modelType === "rug" ? 0 : 0.02,
      polygonOffset: rugSoftOffset,
      polygonOffsetFactor: rugSoftOffset ? -2 : 0,
      polygonOffsetUnits: rugSoftOffset ? -4 : 0,
      transparent: isGlass,
      opacity: isGlass ? 0.42 : 1,
      depthWrite: !isGlass
    });
  }
  function stairMaterial(stairSource, stairPalette, stairType) {
    if (!stairSource) {
      return stairSource;
    }
    if (stairType === "glassstairs" && stairSource.transparent === true && finite(stairSource.opacity, 1) < 0.5) {
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: stairPalette.furnitureSoft,
        roughness: 0.12,
        metalness: 0.04,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true,
        toneMapped: true
      });
      glassMaterial.name = (stairSource.name || "stair-glass") + " · HA Bridge glass";
      return glassMaterial;
    }
    const isSteel = stairType === "steelstairs";
    const frameColor = stairPalette.furnitureSoft;
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isSteel ? 0.38 : 0.58,
      metalness: isSteel ? 0.42 : 0.08,
      emissive: frameColor,
      emissiveIntensity: 0.07,
      side: stairSource.side ?? THREE.FrontSide,
      transparent: false,
      opacity: 1,
      depthWrite: true,
      depthTest: true,
      toneMapped: true
    });
    frameMaterial.name = (stairSource.name || "stair-frame") + " · HA Bridge palette";
    return frameMaterial;
  }
  function resolveMaterial(rawMaterial, colorPalette, itemType) {
    if (typeof THREE.MeshStandardMaterial != "function") {
      return rawMaterial.clone?.() || rawMaterial;
    }
    if (APPLIANCE_MODEL_TYPES.has(itemType)) {
      const applianceMatName = (rawMaterial?.name || "").toLowerCase();
      const applianceColor = rawMaterial?.color?.clone?.() || new THREE.Color(16777215);
      const applianceLum = applianceColor.r * 0.2126 + applianceColor.g * 0.7152 + applianceColor.b * 0.0722;
      const matIndex = applianceMatName.match(/material-(\d+)/)?.[1];
      const applianceBase = colorPalette.appliance ?? colorPalette.furniture;
      const applianceSoft = colorPalette.applianceSoft ?? colorPalette.furnitureSoft;
      const applianceDark = colorPalette.applianceDark ?? colorPalette.furnitureDark;
      const isNasScreen = ["desktop", "laptop", "nas"].includes(itemType) && matIndex === "0";
      const applianceTint = itemType === "walllamp" ? matIndex === "2" ? colorPalette.accent : applianceBase : itemType === "floorlamp" ? applianceBase : itemType === "desktop" ? matIndex === "1" ? applianceDark : applianceSoft : itemType === "laptop" && matIndex === "2" ? applianceDark : itemType === "laptop" && matIndex === "1" || isNasScreen ? applianceSoft : itemType.startsWith("tv_") ? applianceDark : itemType === "pipelinewaterpurifier" || itemType === "tea_bar_machine" ? applianceLum < 0.16 ? applianceBase : applianceSoft : applianceMatName.endsWith("-dark") || applianceLum < 0.16 ? applianceDark : applianceMatName.endsWith("-soft") || applianceLum < 0.45 ? applianceSoft : applianceBase;
      const applianceMaterial = makeFurnitureMaterial(rawMaterial, applianceTint, {
        roughness: 0.82,
        metalness: 0,
        flatShading: false
      });
      if (itemType === "tea_bar_machine") {
        applianceMaterial.emissive = new THREE.Color(0);
        applianceMaterial.emissiveIntensity = 0;
      }
      return applianceMaterial;
    }
    if (FURNITURE_MODEL_TYPES.has(itemType)) {
      return furnitureTint(rawMaterial, colorPalette, itemType);
    }
    if (itemType === "sofa") {
      const isCushion = /cushion/i.test(rawMaterial?.name || "");
      return makeFurnitureMaterial(rawMaterial, isCushion ? colorPalette.furnitureSoft : colorPalette.furniture, {
        roughness: 0.8,
        metalness: 0.01
      });
    }
    if (itemType === "elevator") {
      const isElevatorAccent = /Color_00[34]/i.test(rawMaterial?.name || "");
      const elevatorColor = isElevatorAccent ? new THREE.Color(colorPalette.wall) : new THREE.Color(colorPalette.furniture);
      return makeFurnitureMaterial(rawMaterial, elevatorColor, isElevatorAccent ? {
        roughness: 0.82,
        metalness: 0.01
      } : {});
    }
    if (itemType === "piano") {
      const pianoMatName = (rawMaterial?.name || "").toLowerCase();
      const pianoTint = pianoMatName.includes("color_009") ? colorPalette.furnitureDark : pianoMatName.includes("blinds_weave") || pianoMatName.includes("金色") || pianoMatName.includes("*1") ? colorPalette.furnitureSoft : colorPalette.furniture;
      const pianoMaterial = new THREE.MeshStandardMaterial({
        color: pianoTint,
        roughness: 0.72,
        metalness: 0.06,
        emissive: pianoTint,
        emissiveIntensity: 0.08,
        side: rawMaterial?.side ?? THREE.FrontSide,
        transparent: false,
        opacity: 1,
        depthWrite: rawMaterial?.depthWrite ?? true,
        depthTest: rawMaterial?.depthTest ?? true,
        toneMapped: true
      });
      pianoMaterial.name = (rawMaterial?.name || "piano") + " · HA Bridge furniture palette";
      return pianoMaterial;
    }
    if (stairItemTypes.has(itemType)) {
      return stairMaterial(rawMaterial, colorPalette, itemType);
    } else {
      return paletteFromLuminance(rawMaterial, colorPalette);
    }
  }
  function recomputeNormals(geometry) {
    const clonedGeometry = geometry?.clone?.();
    if (clonedGeometry?.computeVertexNormals) {
      clonedGeometry.computeVertexNormals();
      if (clonedGeometry.attributes?.normal) {
        clonedGeometry.attributes.normal.needsUpdate = true;
      }
      clonedGeometry.computeBoundingBox?.();
      clonedGeometry.computeBoundingSphere?.();
      return clonedGeometry;
    } else {
      return geometry;
    }
  }
  function collectVertexIndexes(geom, materialIndex = null) {
    const indexes = new Set();
    const positions = geom?.attributes?.position;
    if (!positions) {
      return indexes;
    }
    const indexAttr = geom.index;
    const groups = Number.isInteger(materialIndex) ? (geom.groups || []).filter(group => group.materialIndex === materialIndex) : [];
    if (groups.length) {
      for (const matchedGroup of groups) {
        const groupEnd = matchedGroup.start + matchedGroup.count;
        for (let idx = matchedGroup.start; idx < groupEnd; idx += 1) {
          indexes.add(indexAttr ? indexAttr.getX(idx) : idx);
        }
      }
    } else if (materialIndex === null) {
      for (let vertIdx = 0; vertIdx < positions.count; vertIdx += 1) {
        indexes.add(vertIdx);
      }
    }
    return indexes;
  }
  function yExtent(positionAttr, vertexSet) {
    let minY = Infinity;
    let maxY = -Infinity;
    for (const vertexIndex of vertexSet) {
      const yValue = positionAttr.getY(vertexIndex);
      minY = Math.min(minY, yValue);
      maxY = Math.max(maxY, yValue);
    }
    return {
      min: minY,
      max: maxY
    };
  }
  function reshapeLaptopScreen(screenGeometry, referenceGeometry, screenMaterialIndex = null, refMaterialIndex = null) {
    if (!screenGeometry?.attributes?.position) {
      return screenGeometry;
    }
    const screenPositions = screenGeometry.attributes.position;
    const resultGeometry = screenGeometry.clone?.();
    if (!resultGeometry?.attributes?.position) {
      return screenGeometry;
    }
    const resultPositions = resultGeometry.attributes.position;
    const screenVerts = collectVertexIndexes(screenGeometry, screenMaterialIndex);
    if (!screenVerts.size) {
      return screenGeometry;
    }
    const {
      min: screenMinY,
      max: screenMaxY
    } = yExtent(screenPositions, screenVerts);
    if (!Number.isFinite(screenMinY) || !Number.isFinite(screenMaxY) || screenMaxY - screenMinY < 0.001) {
      return screenGeometry;
    }
    const refPositions = referenceGeometry?.attributes?.position;
    const refVerts = collectVertexIndexes(referenceGeometry, refMaterialIndex);
    if (!refPositions || !refVerts.size) {
      return screenGeometry;
    }
    const refExtent = yExtent(refPositions, refVerts);
    if (!Number.isFinite(refExtent.min) || !Number.isFinite(refExtent.max)) {
      return screenGeometry;
    }
    const midY = (refExtent.min + refExtent.max) / 2;
    let lowerFront = null;
    let upperFront = null;
    for (const refVert of refVerts) {
      const point = {
        y: refPositions.getY(refVert),
        z: refPositions.getZ(refVert)
      };
      if (point.y <= midY && (!lowerFront || point.z > lowerFront.z)) {
        lowerFront = point;
      }
      if (point.y > midY && (!upperFront || point.z > upperFront.z)) {
        upperFront = point;
      }
    }
    if (!lowerFront || !upperFront || upperFront.y - lowerFront.y < 0.001) {
      return screenGeometry;
    }
    const spanY = upperFront.y - lowerFront.y;
    const targetMinY = lowerFront.y + spanY * 0.04;
    const targetMaxY = upperFront.y - spanY * 0.07;
    const screenSpanY = screenMaxY - screenMinY;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const screenVert of screenVerts) {
      const zValue = screenPositions.getZ(screenVert);
      minZ = Math.min(minZ, zValue);
      maxZ = Math.max(maxZ, zValue);
    }
    const spanZ = Math.max(maxZ - minZ, 0.001);
    const insetDepth = Math.min(spanZ, spanY * 0.022);
    const zBias = spanY * 0.008;
    for (const screenVertIdx of screenVerts) {
      const sourceY = screenPositions.getY(screenVertIdx);
      const mappedY = targetMinY + (sourceY - screenMinY) / screenSpanY * (targetMaxY - targetMinY);
      const mappedZ = lowerFront.z + (mappedY - lowerFront.y) / spanY * (upperFront.z - lowerFront.z) + zBias;
      const normalizedZ = (screenPositions.getZ(screenVertIdx) - minZ) / spanZ;
      resultPositions.setY(screenVertIdx, mappedY);
      resultPositions.setZ(screenVertIdx, mappedZ - insetDepth * (1 - normalizedZ));
    }
    resultPositions.needsUpdate = true;
    resultGeometry.computeVertexNormals?.();
    resultGeometry.computeBoundingBox?.();
    resultGeometry.computeBoundingSphere?.();
    return resultGeometry;
  }
  const textureProps = Object.freeze(["alphaMap", "anisotropyMap", "aoMap", "bumpMap", "clearcoatMap", "clearcoatNormalMap", "clearcoatRoughnessMap", "displacementMap", "emissiveMap", "envMap", "gradientMap", "iridescenceMap", "iridescenceThicknessMap", "lightMap", "map", "matcap", "metalnessMap", "normalMap", "roughnessMap", "sheenColorMap", "sheenRoughnessMap", "specularColorMap", "specularIntensityMap", "thicknessMap", "transmissionMap"]);
  const scalarProps = Object.freeze(["alphaHash", "alphaTest", "alphaToCoverage", "anisotropy", "aoMapIntensity", "attenuationColor", "attenuationDistance", "blendAlpha", "blendColor", "blendDst", "blendDstAlpha", "blendEquation", "blendEquationAlpha", "blending", "blendSrc", "blendSrcAlpha", "bumpScale", "clearcoat", "clearcoatNormalScale", "clearcoatRoughness", "clipIntersection", "clipShadows", "color", "colorWrite", "depthFunc", "depthTest", "depthWrite", "displacementBias", "displacementScale", "dithering", "emissive", "emissiveIntensity", "envMapIntensity", "flatShading", "fog", "forceSinglePass", "ior", "iridescence", "iridescenceIOR", "iridescenceThicknessRange", "lightMapIntensity", "metalness", "normalMapType", "normalScale", "opacity", "polygonOffset", "polygonOffsetFactor", "polygonOffsetUnits", "precision", "premultipliedAlpha", "reflectivity", "refractionRatio", "roughness", "shadowSide", "sheen", "sheenColor", "sheenRoughness", "side", "specularColor", "specularIntensity", "stencilFail", "stencilFunc", "stencilFuncMask", "stencilRef", "stencilWrite", "stencilWriteMask", "stencilZFail", "stencilZPass", "thickness", "toneMapped", "transmission", "vertexColors", "visible", "wireframe", "wireframeLinecap", "wireframeLinejoin", "wireframeLinewidth"]);
  function canonicalizeValue(propValue) {
    if (propValue === undefined) {
      return "undefined";
    } else if (propValue === null) {
      return null;
    } else if (typeof propValue == "number") {
      if (Number.isNaN(propValue)) {
        return "NaN";
      } else if (Number.isFinite(propValue)) {
        if (Object.is(propValue, -0)) {
          return 0;
        } else {
          return propValue;
        }
      } else if (propValue > 0) {
        return "Infinity";
      } else {
        return "-Infinity";
      }
    } else if (["string", "boolean"].includes(typeof propValue)) {
      return propValue;
    } else if (propValue.isTexture) {
      return ["texture", propValue.uuid ?? propValue.id ?? "anonymous"];
    } else if (propValue.isColor) {
      return [propValue.r, propValue.g, propValue.b];
    } else if (Array.isArray(propValue)) {
      return propValue.map(canonicalizeValue);
    } else if (typeof propValue.toArray == "function") {
      return propValue.toArray().map(canonicalizeValue);
    } else if (["x", "y", "z", "w"].some(axisKey => typeof propValue[axisKey] == "number")) {
      return [propValue.x, propValue.y, propValue.z, propValue.w].map(canonicalizeValue);
    } else {
      return String(propValue);
    }
  }
  function materialCacheKey(mat) {
    if (mat?.isShaderMaterial || mat?.isRawShaderMaterial) {
      return JSON.stringify([mat.type || "ShaderMaterial", "unique", mat.uuid || mat.id]);
    }
    const customKey = typeof mat?.customProgramCacheKey == "function" ? mat.customProgramCacheKey() : "";
    return JSON.stringify([mat?.type || mat?.constructor?.name || "Material", customKey, scalarProps.map(scalarKey => [scalarKey, canonicalizeValue(mat?.[scalarKey])]), textureProps.map(textureKey => [textureKey, canonicalizeValue(mat?.[textureKey])])]);
  }
  function cacheMaterial(inputMaterial, cachePalette, cacheModelType) {
    if (!inputMaterial) {
      return inputMaterial;
    }
    const resolvedMaterial = PALETTE_OVERRIDE_MODEL_TYPES.has(cacheModelType) || APPLIANCE_MODEL_TYPES.has(cacheModelType) ? resolveMaterial(inputMaterial, cachePalette, cacheModelType) : inputMaterial.clone?.() || inputMaterial;
    const cacheKey = materialCacheKey(resolvedMaterial);
    if (materialCache.has(cacheKey)) {
      materialReuseCount += 1;
      if (resolvedMaterial !== inputMaterial) {
        resolvedMaterial.dispose?.();
      }
      return materialCache.get(cacheKey);
    } else {
      materialCache.set(cacheKey, resolvedMaterial);
      return resolvedMaterial;
    }
  }
  function addExternalItemModel(parent, itemData, itemPalette, {
    selected = false
  } = {}) {
    const resolvedType = modelTypeForItem(itemData);
    const modelEntry = loadedModels.get(resolvedType);
    if (!modelEntry) {
      loadExternalItemModel(resolvedType);
      return false;
    }
    const clonedRoot = modelEntry.source.clone(true);
    let laptopScreenRef = null;
    if (resolvedType === "laptop") {
      clonedRoot.traverse(node => {
        if (!node.isMesh || laptopScreenRef) {
          return;
        }
        const screenMatIndex = (Array.isArray(node.material) ? node.material : [node.material]).findIndex(candidateMat => (candidateMat?.name || "").toLowerCase().match(/material-(\d+)/)?.[1] === "1");
        if (!(screenMatIndex < 0)) {
          laptopScreenRef = {
            geometry: node.geometry,
            materialIndex: Array.isArray(node.material) ? screenMatIndex : null
          };
        }
      });
    }
    clonedRoot.traverse(mesh => {
      if (!mesh.isMesh) {
        return;
      }
      const originalGeometry = mesh.geometry;
      const screenSlotIndex = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).findIndex(slotMat => (slotMat?.name || "").toLowerCase().match(/material-(\d+)/)?.[1] === "2");
      if (resolvedType === "laptop" && screenSlotIndex >= 0 && laptopScreenRef) {
        mesh.geometry = reshapeLaptopScreen(mesh.geometry, laptopScreenRef.geometry, Array.isArray(mesh.material) ? screenSlotIndex : null, laptopScreenRef.materialIndex);
      } else if (resolvedType === "tea_bar_machine" || resolvedType === "dishwasher") {
        mesh.geometry = recomputeNormals(mesh.geometry);
      }
      const mapMaterial = matCandidate => {
        const sharedMaterial = cacheMaterial(matCandidate, itemPalette, resolvedType);
        return selected && sharedMaterial?.clone?.() || sharedMaterial;
      };
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(mapMaterial) : mapMaterial(mesh.material);
      mesh.castShadow = resolvedType !== "rug";
      mesh.receiveShadow = resolvedType !== "glassstairs" || mesh.material?.transparent !== true;
      if (resolvedType === "rug") {
        const rugMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.renderOrder = rugMaterials.some(rugMat => rugMat?.polygonOffset) ? 1 : 0;
      }
      mesh.userData.externalModelSharedGeometry = mesh.geometry === originalGeometry;
      mesh.userData.externalModelSharedTextures = true;
      mesh.userData.externalModelSharedMaterial = !selected;
    });
    const modelMeta = ALL_ITEM_MODELS[resolvedType];
    const basisSize = Array.isArray(modelMeta?.scaleBasis) && modelMeta.scaleBasis.length === 3 ? {
      x: modelMeta.scaleBasis[0],
      y: modelMeta.scaleBasis[1],
      z: modelMeta.scaleBasis[2]
    } : modelEntry.size;
    if (modelMeta?.preserveAspect) {
      const aspectScale = Math.min(itemData.width / basisSize.x, itemData.height / basisSize.y, itemData.depth / basisSize.z);
      clonedRoot.scale.setScalar(aspectScale);
    } else {
      clonedRoot.scale.set(itemData.width / basisSize.x, itemData.height / basisSize.y, itemData.depth / basisSize.z);
    }
    if (modelMeta?.preserveOrigin) {
      if (modelMeta?.groundAlign) {
        clonedRoot.updateMatrixWorld(true);
        const groundBox = new THREE.Box3().setFromObject(clonedRoot);
        clonedRoot.position.y -= groundBox.min.y;
        clonedRoot.position.y += finite(modelMeta.groundOffset, 0);
      }
    } else {
      clonedRoot.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(clonedRoot);
      const center = bounds.getCenter(new THREE.Vector3());
      clonedRoot.position.set(-center.x, -bounds.min.y, -center.z);
    }
    parent.add(clonedRoot);
    return true;
  }
  return {
    addExternalItemModel,
    loadExternalItemModel,
    modelTypeForItem,
    modelLoadState,
    cacheRepresentation(items) {
      return [...new Set(items.map(modelTypeForItem).filter(Boolean))].sort().map(cachedType => ({
        type: cachedType,
        definition: ALL_ITEM_MODELS[cachedType],
        loaded: loadedModels.has(cachedType)
      }));
    }
  };
}
