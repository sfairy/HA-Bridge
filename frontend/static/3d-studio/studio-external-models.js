import { finite } from "./studio-normalization.js?v=20260903-studio-normalization-v2";
const ve = "20260903-home-lite-v1";
const Me = "20260903-appliance-lite-v1";
function fn(value, value2, value3) {
  return Object.freeze({
    url: "/bridge-static/3d-studio/models/" + value + "-lite.glb?v=" + ve,
    fallbackUrl:
      "/bridge-static/3d-studio/models/" + value + ".glb?v=" + value2,
    ...value3,
  });
}
function fn2(value, value2) {
  return Object.freeze({
    url: "/bridge-static/3d-studio/models/" + value + "-lite.glb?v=" + Me,
    fallbackUrl:
      "/bridge-static/3d-studio/models/" +
      value +
      ".glb?v=20260901-all-appliance-models-v1",
    ...value2,
  });
}
export const EXTERNAL_ITEM_MODELS = Object.freeze({
  sofa: {
    url: "/bridge-static/3d-studio/models/sofa-lite.glb?v=20260903-sofa-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/sofa.glb?v=20260901-sofa-draco-v1",
    scaleBasis: [2.2, 0.82, 0.9],
    preserveOrigin: true,
    groundAlign: true,
    groundOffset: -0.008,
  },
  coffeetable: fn("coffeetable", "20260901-home-assets-v2", {
    scaleBasis: [1.7, 0.5, 1.25],
    preserveOrigin: true,
  }),
  squarecoffeetable: fn("squarecoffeetable", "20260901-home-assets-v1", {
    url: "/bridge-static/3d-studio/models/squarecoffeetable-lite.glb?v=20260903-square-coffee-table-v2",
    fallbackUrl:
      "/bridge-static/3d-studio/models/squarecoffeetable.glb?v=20260903-square-coffee-table-v2",
    scaleBasis: [1.4, 0.46, 0.7],
    preserveOrigin: true,
  }),
  tvstand: fn("tvstand", "20260901-home-assets-v1", {
    url: "/bridge-static/3d-studio/models/tvstand-lite.glb?v=20260903-tvstand-top-board-v3",
    fallbackUrl:
      "/bridge-static/3d-studio/models/tvstand.glb?v=20260903-tvstand-top-board-v3",
    scaleBasis: [1.8, 0.48, 0.42],
    preserveOrigin: true,
  }),
  rug: fn("rug", "20260901-home-assets-v1", {
    scaleBasis: [2, 0.012, 1.4],
    preserveOrigin: true,
  }),
  plant: fn("plant", "20260901-home-assets-v1", {
    scaleBasis: [0.75, 1.6, 0.75],
    preserveOrigin: true,
  }),
  bed: fn("bed", "20260901-home-furniture-v1", {
    scaleBasis: [1.8, 0.62, 2],
    preserveOrigin: true,
  }),
  nightstand: fn("nightstand", "20260901-home-furniture-v1", {
    scaleBasis: [0.5, 0.55, 0.42],
    preserveOrigin: true,
  }),
  vanity: fn("vanity", "20260901-home-furniture-v1", {
    scaleBasis: [1.2, 1.55, 0.5],
    preserveOrigin: true,
  }),
  desk: fn("desk", "20260901-home-furniture-v1", {
    scaleBasis: [1.4, 0.76, 0.65],
    preserveOrigin: true,
  }),
  bookcase: fn("bookcase", "20260901-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.32],
    preserveOrigin: true,
  }),
  smallcar: {
    url: "/bridge-static/3d-studio/models/car-lite.glb?v=20260902-car-lite-v1",
    fallbackUrl: "/bridge-static/3d-studio/models/car.glb?v=20260811-car1",
  },
  airoutlet: {
    url: "/bridge-static/3d-studio/models/air-outlet-lite.glb?v=20260902-air-outlet-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/air-outlet.glb?v=20260812-air-outlet1",
  },
  pipelinewaterpurifier: {
    url: "/bridge-static/3d-studio/models/pipeline-water-purifier-lite.glb?v=20260902-pipeline-water-purifier-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/pipeline-water-purifier.glb?v=20260821-glb-material-v1",
  },
  tea_bar_machine: {
    url: "/bridge-static/3d-studio/models/tea-bar-machine-lite.glb?v=20260902-tea-bar-machine-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/tea-bar-machine.glb?v=20260821-glb-material-v1",
  },
  elevator: {
    url: "/bridge-static/3d-studio/models/elevator-lite.glb?v=20260902-elevator-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/elevator.glb?v=20260825-elevator-material-v1",
  },
  steelstairs: {
    url: "/bridge-static/3d-studio/models/steel-stairs-lite.glb?v=20260902-steel-stairs-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/steel-stairs.glb?v=20260821-stairs-v1",
  },
  glassstairs: {
    url: "/bridge-static/3d-studio/models/glass-stairs-lite.glb?v=20260902-glass-stairs-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/glass-stairs.glb?v=20260821-stairs-v1",
  },
  piano: {
    url: "/bridge-static/3d-studio/models/piano-lite.glb?v=20260902-piano-lite-v1",
    fallbackUrl:
      "/bridge-static/3d-studio/models/piano.glb?v=20260824-piano-v3",
    preserveAspect: true,
  },
});
export const ALL_ITEM_MODELS = Object.freeze({
  ...EXTERNAL_ITEM_MODELS,
  bed: fn("bed", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 0.62, 2],
    preserveOrigin: true,
  }),
  nightstand: fn("nightstand", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.5, 0.55, 0.42],
    preserveOrigin: true,
  }),
  vanity: fn("vanity", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.55, 0.5],
    preserveOrigin: true,
  }),
  desk: fn("desk", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.4, 0.76, 0.65],
    preserveOrigin: true,
  }),
  bookcase: fn("bookcase", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.32],
    preserveOrigin: true,
  }),
  aquarium: fn("aquarium", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.5, 1.4, 0.55],
    preserveOrigin: true,
  }),
  table: fn("table", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.4, 0.82, 1.8],
    preserveOrigin: true,
  }),
  rounddiningtable: fn("rounddiningtable", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.2, 0.78, 2.2],
    preserveOrigin: true,
  }),
  chair: fn("chair", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.5, 0.86, 0.5],
    preserveOrigin: true,
  }),
  bar: fn("bar", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.2, 1.05, 0.65],
    preserveOrigin: true,
  }),
  sideboard: fn("sideboard", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.6, 2.2, 0.45],
    preserveOrigin: true,
  }),
  shoecabinet: fn("shoecabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.25, 0.42],
    preserveOrigin: true,
  }),
  cabinet: fn("cabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.6, 1.9, 0.45],
    preserveOrigin: true,
  }),
  glasscabinet: fn("glasscabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.9, 0.4],
    preserveOrigin: true,
  }),
  shelf: fn("shelf", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 1.8, 0.45],
    preserveOrigin: true,
  }),
  wallcabinet: fn("wallcabinet", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.5, 0.82, 0.35],
    preserveOrigin: true,
  }),
  kitchenbase: fn("kitchenbase", "20260901-all-home-furniture-v1", {
    scaleBasis: [2.4, 0.85, 0.6],
    preserveOrigin: true,
  }),
  kitchensink: fn("kitchensink", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 0.85, 0.6],
    preserveOrigin: true,
  }),
  kitchencooktop: fn("kitchencooktop", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 0.85, 0.6],
    preserveOrigin: true,
  }),
  basin: fn("basin", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.9, 0.88, 0.5],
    preserveOrigin: true,
  }),
  toilet: fn("toilet", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.42, 0.52, 0.7],
    preserveOrigin: true,
  }),
  squattoilet: fn("squattoilet", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.45, 0.18, 0.65],
    preserveOrigin: true,
  }),
  urinal: fn("urinal", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.38, 0.72, 0.34],
    preserveOrigin: true,
  }),
  shower: fn("shower", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.9, 2.1, 0.9],
    preserveOrigin: true,
  }),
  bathtub: fn("bathtub", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.7, 0.58, 0.78],
    preserveOrigin: true,
  }),
  glasspartition: fn("glasspartition", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.2, 2, 0.08],
    preserveOrigin: true,
  }),
  stairs: fn("stairs", "20260901-all-home-furniture-v1", {
    scaleBasis: [1, 1.65, 2.8],
    preserveOrigin: true,
  }),
  pillar: fn("pillar", "20260901-all-home-furniture-v1", {
    scaleBasis: [0.45, 2.8, 0.45],
    preserveOrigin: true,
  }),
  curtain_left: fn("curtain_left", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true,
  }),
  curtain_right: fn("curtain_right", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true,
  }),
  curtain_split: fn("curtain_split", "20260901-all-home-furniture-v1", {
    scaleBasis: [1.8, 2.4, 0.18],
    preserveOrigin: true,
  }),
  rounddiningtable_turntable: fn(
    "rounddiningtable_turntable",
    "20260901-all-home-furniture-v1",
    {
      scaleBasis: [2.2, 0.78, 2.2],
      preserveOrigin: true,
    },
  ),
  tv_standard: fn2("tv_standard", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true,
  }),
  tv_tabletop: fn2("tv_tabletop", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true,
  }),
  tv_mobile: fn2("tv_mobile", {
    scaleBasis: [1.5, 0.92, 0.18],
    preserveOrigin: true,
  }),
  wallac: fn2("wallac", {
    scaleBasis: [0.9, 0.28, 0.22],
    preserveOrigin: true,
  }),
  floorac: fn2("floorac", {
    scaleBasis: [0.42, 1.75, 0.42],
    preserveOrigin: true,
  }),
  airpurifier: fn2("airpurifier", {
    scaleBasis: [0.34, 0.7, 0.34],
    preserveOrigin: true,
  }),
  robotvacuum: fn2("robotvacuum", {
    scaleBasis: [0.55, 0.85, 0.5],
    preserveOrigin: true,
  }),
  floorlamp: fn2("floorlamp", {
    scaleBasis: [1.35, 1.8, 0.5],
    preserveOrigin: true,
  }),
  walllamp: fn2("walllamp", {
    scaleBasis: [0.3, 0.34, 0.22],
    preserveOrigin: true,
  }),
  fridge: fn2("fridge", {
    scaleBasis: [0.75, 1.85, 0.72],
    preserveOrigin: true,
  }),
  rangehood: fn2("rangehood", {
    scaleBasis: [0.9, 0.55, 0.45],
    preserveOrigin: true,
  }),
  dishwasher: fn2("dishwasher", {
    scaleBasis: [0.6, 0.82, 0.6],
    preserveOrigin: true,
  }),
  steamoven: fn2("steamoven", {
    scaleBasis: [0.6, 0.6, 0.55],
    preserveOrigin: true,
  }),
  microwave: fn2("microwave", {
    scaleBasis: [0.52, 0.32, 0.42],
    preserveOrigin: true,
  }),
  ricecooker: fn2("ricecooker", {
    scaleBasis: [0.28, 0.25, 0.32],
    preserveOrigin: true,
  }),
  washer: fn2("washer", {
    scaleBasis: [0.6, 0.85, 0.65],
    preserveOrigin: true,
  }),
  dryer: fn2("dryer", {
    scaleBasis: [0.6, 0.85, 0.65],
    preserveOrigin: true,
  }),
  storagewaterheater: fn2("storagewaterheater", {
    scaleBasis: [0.86, 0.48, 0.46],
    preserveOrigin: true,
  }),
  gaswaterheater: fn2("gaswaterheater", {
    scaleBasis: [0.42, 0.72, 0.22],
    preserveOrigin: true,
  }),
  desktop: fn2("desktop", {
    scaleBasis: [0.72, 0.5, 0.32],
    preserveOrigin: true,
  }),
  laptop: fn2("laptop", {
    scaleBasis: [0.36, 0.22, 0.28],
    preserveOrigin: true,
  }),
  nas: fn2("nas", {
    scaleBasis: [0.28, 0.34, 0.24],
    preserveOrigin: true,
  }),
});
const we = new Set([
  "sofa",
  "coffeetable",
  "squarecoffeetable",
  "tvstand",
  "rug",
  "plant",
  "bed",
  "nightstand",
  "vanity",
  "desk",
  "bookcase",
  "aquarium",
  "table",
  "rounddiningtable",
  "chair",
  "bar",
  "sideboard",
  "shoecabinet",
  "cabinet",
  "glasscabinet",
  "shelf",
  "wallcabinet",
  "kitchenbase",
  "kitchensink",
  "kitchencooktop",
  "basin",
  "toilet",
  "squattoilet",
  "urinal",
  "shower",
  "bathtub",
  "glasspartition",
  "stairs",
  "pillar",
  "curtain_left",
  "curtain_right",
  "curtain_split",
  "rounddiningtable_turntable",
  "tv_standard",
  "tv_tabletop",
  "tv_mobile",
  "wallac",
  "floorac",
  "airpurifier",
  "robotvacuum",
  "floorlamp",
  "walllamp",
  "fridge",
  "rangehood",
  "dishwasher",
  "steamoven",
  "microwave",
  "ricecooker",
  "washer",
  "dryer",
  "storagewaterheater",
  "gaswaterheater",
  "desktop",
  "laptop",
  "nas",
]);
const Oe = new Set([
  "bed",
  "nightstand",
  "vanity",
  "desk",
  "bookcase",
  "table",
  "rounddiningtable",
  "chair",
  "bar",
  "sideboard",
  "shoecabinet",
  "cabinet",
  "glasscabinet",
  "shelf",
  "wallcabinet",
  "kitchenbase",
  "kitchensink",
  "kitchencooktop",
]);
const bag = new Set([
  "tv_standard",
  "tv_tabletop",
  "tv_mobile",
  "wallac",
  "floorac",
  "airpurifier",
  "robotvacuum",
  "floorlamp",
  "walllamp",
  "fridge",
  "rangehood",
  "dishwasher",
  "steamoven",
  "microwave",
  "ricecooker",
  "washer",
  "dryer",
  "storagewaterheater",
  "gaswaterheater",
  "desktop",
  "laptop",
  "nas",
  "pipelinewaterpurifier",
  "tea_bar_machine",
  "airoutlet",
]);
const xe = new Set([
  "sofa",
  "coffeetable",
  "squarecoffeetable",
  "tvstand",
  "rug",
  "plant",
  "bed",
  "nightstand",
  "vanity",
  "desk",
  "bookcase",
  "pipelinewaterpurifier",
  "tea_bar_machine",
  "elevator",
  "steelstairs",
  "glassstairs",
  "piano",
]);
export function createExternalModelManager({
  THREE: externalModelManager,
  loader: externalModelManager2,
  stairItemTypes: externalModelManager3,
  isModelInUse: externalModelManager4,
  requestRender: externalModelManager5,
  onLoadStateChange: externalModelManager6 = () => {},
  maxConcurrentLoads: externalModelManager7 = 2,
  loadTimeoutMs: externalModelManager8 = 12000,
}) {
  const index = new Map();
  const index2 = new Map();
  const value8 = [];
  const index3 = new Map();
  const limit = Math.max(1, Math.floor(finite(externalModelManager7, 2)));
  const timeoutMs = Math.max(
    50,
    Math.floor(finite(externalModelManager8, 12000)),
  );
  let active = 0;
  let materialReuses = 0;
  function modelLoadState() {
    return {
      active: active,
      queued: value8.length,
      limit: limit,
      timeoutMs: timeoutMs,
      materials: index3.size,
      materialReuses: materialReuses,
    };
  }
  function fn6() {
    externalModelManager6(modelLoadState());
  }
  function fn7() {
    while (active < limit && value8.length) {
      const value12 = value8.shift();
      active += 1;
      fn6();
      Promise.resolve()
        .then(value12.run)
        .then(value12.resolve, value12.reject)
        .finally(() => {
          active -= 1;
          fn7();
          fn6();
        });
    }
  }
  function fn8(run) {
    return new Promise((resolve, reject) => {
      value8.push({
        run: run,
        resolve: resolve,
        reject: reject,
      });
      fn6();
      fn7();
    });
  }
  function fn9(value12, value13) {
    let value14 = null;
    const fn22 = (value15) =>
      Promise.race([
        externalModelManager2.loadAsync(value15),
        new Promise((_, fn23) => {
          value14 = setTimeout(
            () => fn23(new Error("模型 " + value13 + " 加载超时")),
            timeoutMs,
          );
        }),
      ]).finally(() => clearTimeout(value14));
    if (value12?.url) {
      return fn22(value12.url).catch((value15) => {
        if (!value12.fallbackUrl) {
          throw value15;
        }
        return fn22(value12.fallbackUrl);
      });
    } else {
      return Promise.reject(new Error("模型 " + value13 + " 没有可用资源"));
    }
  }
  function modelTypeForItem(value12) {
    if (value12.type === "curtain") {
      return (
        "curtain_" +
        (["left", "right", "split"].includes(value12.curtainPosition)
          ? value12.curtainPosition
          : "split")
      );
    } else if (
      value12.type === "rounddiningtable" &&
      (value12.roundTableTurntable === true ||
        value12.type === "rounddiningtableturntable")
    ) {
      return "rounddiningtable_turntable";
    } else if (value12.type === "tv") {
      return (
        "tv_" +
        (["standard", "tabletop", "mobile"].includes(value12.tvMountStyle)
          ? value12.tvMountStyle
          : "standard")
      );
    } else {
      return value12.type;
    }
  }
  function loadExternalItemModel(value12) {
    if (
      typeof window !== "undefined" &&
      window.externalModelLoadsDeferred &&
      !window.__haBridgeReleasingDeferredModels
    ) {
      window.__haBridgeDeferExternalModel?.(value12);
      return Promise.resolve(null);
    }
    if (index.has(value12)) {
      return Promise.resolve(index.get(value12));
    }
    if (index2.has(value12)) {
      return index2.get(value12);
    }
    const value13 = ALL_ITEM_MODELS[value12];
    if (!value13) {
      return Promise.resolve(null);
    }
    const value14 = fn8(() => fn9(value13, value12))
      .then((value15) => {
        const source = value15.scene || value15.scenes?.[0];
        if (!source) {
          throw new Error("模型 " + value12 + " 没有可显示的场景");
        }
        source.updateMatrixWorld(true);
        const size = new externalModelManager.Box3()
          .setFromObject(source)
          .getSize(new externalModelManager.Vector3());
        if (
          ![size.x, size.y, size.z].every(
            (value17) => Number.isFinite(value17) && value17 > 0.001,
          )
        ) {
          throw new Error("模型 " + value12 + " 的尺寸无效");
        }
        const value16 = {
          source: source,
          size: size,
        };
        index.set(value12, value16);
        if (externalModelManager4(value12)) {
          externalModelManager5({
            force: true,
          });
        }
        return value16;
      })
      .catch((value15) => {
        globalThis.window?.HABridgeLog?.error(
          value15,
          {
            phase: "studio-model-load",
          },
          "无法载入外部模型 " + value12 + "：" + (value15?.message || value15),
        );
        if (String(value15?.message || value15).includes("加载超时")) {
          console.debug("外部模型 " + value12 + " 加载超时，继续使用原模型");
        } else {
          console.error("无法载入外部模型 " + value12, value15);
        }
        if (externalModelManager4(value12)) {
          externalModelManager5({
            force: true,
          });
        }
        return null;
      })
      .finally(() => index2.delete(value12));
    index2.set(value12, value14);
    return value14;
  }
  function fn10(value12, value13) {
    if (!value12) {
      return value12;
    }
    const value14 =
      value12.color?.clone?.() || new externalModelManager.Color(16777215);
    const value15 =
      value14.r * 0.2126 + value14.g * 0.7152 + value14.b * 0.0722;
    const emissive =
      value15 < 0.1
        ? value13.furnitureDark
        : value15 < 0.42
          ? value13.furniture
          : value15 < 0.72
            ? value13.furnitureSoft
            : value13.furnitureLight;
    const color = new externalModelManager.Color(emissive).multiplyScalar(0.34);
    const value16 = new externalModelManager.MeshStandardMaterial({
      color: color,
      roughness: value15 < 0.1 ? 0.34 : value15 < 0.42 ? 0.52 : 0.58,
      metalness: value15 < 0.1 ? 0.22 : 0.04,
      emissive: emissive,
      emissiveIntensity: 0.46,
      side: value12.side ?? externalModelManager.FrontSide,
      transparent: false,
      opacity: 1,
      depthWrite: value12.depthWrite ?? true,
      depthTest: value12.depthTest ?? true,
      toneMapped: true,
    });
    value16.name = (value12.name || "external-model") + " · HA Bridge palette";
    return value16;
  }
  function fn11(value12, color, value13 = {}) {
    if (!value12) {
      return value12;
    }
    const value14 = new externalModelManager.MeshStandardMaterial({
      color: color,
      roughness: value13.roughness ?? 0.58,
      metalness: value13.metalness ?? 0.04,
      flatShading: value13.flatShading ?? false,
      emissive: 0,
      emissiveIntensity: 0,
      side: value12.side ?? externalModelManager.FrontSide,
      transparent: value13.transparent ?? false,
      opacity: value13.opacity ?? 1,
      depthWrite: value13.depthWrite ?? value12.depthWrite ?? true,
      depthTest: value12.depthTest ?? true,
      toneMapped: true,
    });
    value14.name =
      (value12.name || "external-model") + " · HA Bridge furniture material";
    value14.polygonOffset = value13.polygonOffset === true;
    value14.polygonOffsetFactor = value13.polygonOffsetFactor ?? 0;
    value14.polygonOffsetUnits = value13.polygonOffsetUnits ?? 0;
    return value14;
  }
  function fn12(value12, value13, value14) {
    const value15 = (value12?.name || "").toLowerCase();
    let furniture = value13.furniture;
    if (/^curtain_(left|right|split)$/.test(value14)) {
      const value16 = value15.match(/material-(\d+)/)?.[1];
      if (["0", "4"].includes(value16)) {
        furniture = value13.furnitureDark;
      } else if (["1", "5", "2", "3"].includes(value16)) {
        furniture = value13.furnitureSoft;
      } else {
        furniture = value13.furniture;
      }
    } else if (value14 === "coffeetable" || value14 === "squarecoffeetable") {
      furniture = value15.endsWith("-dark")
        ? value13.furnitureDark
        : value15.endsWith("-light") || value15.endsWith("-soft")
          ? value13.furnitureSoft
          : value13.furniture;
    } else if (value14 === "tvstand") {
      const value16 =
        value12?.color?.clone?.() || new externalModelManager.Color(16777215);
      const value17 =
        value16.r * 0.2126 + value16.g * 0.7152 + value16.b * 0.0722;
      furniture =
        value15.endsWith("-dark") || value17 < 0.16
          ? value13.furnitureDark
          : value15.endsWith("-soft") ||
              value15.endsWith("-light") ||
              value17 >= 0.3
            ? value13.furnitureSoft
            : value13.furniture;
    } else if (
      ["table", "rounddiningtable", "rounddiningtable_turntable"].includes(
        value14,
      )
    ) {
      const value16 = value15.match(/material-(\d+)/)?.[1];
      const value17 =
        value14 === "rounddiningtable_turntable" ? ["0", "3"] : ["0"];
      const value18 =
        value12?.color?.clone?.() || new externalModelManager.Color(16777215);
      const value19 =
        value18.r * 0.2126 + value18.g * 0.7152 + value18.b * 0.0722;
      furniture = value17.includes(value16)
        ? value13.furnitureSoft
        : value19 < 0.2
          ? value13.furnitureDark
          : value19 < 0.55
            ? value13.furniture
            : value13.furnitureSoft;
    } else if (
      ["kitchenbase", "kitchensink", "kitchencooktop", "basin"].includes(
        value14,
      )
    ) {
      const value16 = value15.match(/material-(\d+)/)?.[1];
      const value17 = value14 === "basin" ? "1" : "2";
      const value18 =
        value12?.color?.clone?.() || new externalModelManager.Color(16777215);
      const value19 =
        value18.r * 0.2126 + value18.g * 0.7152 + value18.b * 0.0722;
      furniture =
        value16 === value17
          ? value13.furniture
          : value19 < 0.2
            ? value13.furnitureDark
            : value19 < 0.55
              ? value13.furniture
              : value13.furnitureSoft;
    } else if (value14 === "stairs") {
      furniture = value13.furniture;
    } else if (
      value14 === "plant" &&
      (value15.endsWith("-soft") || value15.endsWith("-dark"))
    ) {
      furniture = value13.furniture;
    } else if (value15.includes("foliagesoft")) {
      furniture = 7835779;
    } else if (value15.includes("foliage")) {
      furniture = 6257261;
    } else if (value15.endsWith("-soft") || value15.endsWith("-light")) {
      furniture = value13.furnitureSoft;
    } else if (value15.endsWith("-dark")) {
      furniture = value13.furnitureDark;
    } else if (Oe.has(value14)) {
      const value16 =
        value12.color?.clone?.() || new externalModelManager.Color(16777215);
      const value17 =
        value16.r * 0.2126 + value16.g * 0.7152 + value16.b * 0.0722;
      furniture =
        value17 < 0.2
          ? value13.furnitureDark
          : value17 < 0.55
            ? value13.furniture
            : value13.furnitureSoft;
    }
    const polygonOffset = value14 === "rug" && value15.endsWith("-soft");
    const transparent =
      value15.endsWith("-glass") ||
      value12?.transparent === true ||
      (value12?.opacity ?? 1) < 1;
    return fn11(value12, furniture, {
      roughness: value15.includes("foliage") || value14 === "rug" ? 0.9 : 0.72,
      metalness: value15.includes("foliage") || value14 === "rug" ? 0 : 0.02,
      polygonOffset: polygonOffset,
      polygonOffsetFactor: polygonOffset ? -2 : 0,
      polygonOffsetUnits: polygonOffset ? -4 : 0,
      transparent: transparent,
      opacity: transparent ? 0.42 : 1,
      depthWrite: !transparent,
    });
  }
  function fn13(value12, value13, value14) {
    if (!value12) {
      return value12;
    }
    if (
      value14 === "glassstairs" &&
      value12.transparent === true &&
      finite(value12.opacity, 1) < 0.5
    ) {
      const value17 = new externalModelManager.MeshStandardMaterial({
        color: value13.furnitureSoft,
        roughness: 0.12,
        metalness: 0.04,
        transparent: true,
        opacity: 0.3,
        side: externalModelManager.DoubleSide,
        depthWrite: false,
        depthTest: true,
        toneMapped: true,
      });
      value17.name = (value12.name || "stair-glass") + " · HA Bridge glass";
      return value17;
    }
    const value15 = value14 === "steelstairs";
    const color = value13.furnitureSoft;
    const value16 = new externalModelManager.MeshStandardMaterial({
      color: color,
      roughness: value15 ? 0.38 : 0.58,
      metalness: value15 ? 0.42 : 0.08,
      emissive: color,
      emissiveIntensity: 0.07,
      side: value12.side ?? externalModelManager.FrontSide,
      transparent: false,
      opacity: 1,
      depthWrite: true,
      depthTest: true,
      toneMapped: true,
    });
    value16.name = (value12.name || "stair-frame") + " · HA Bridge palette";
    return value16;
  }
  function fn14(value12, value13, value14) {
    if (typeof externalModelManager.MeshStandardMaterial != "function") {
      return value12.clone?.() || value12;
    }
    if (bag.has(value14)) {
      const value15 = (value12?.name || "").toLowerCase();
      const value16 =
        value12?.color?.clone?.() || new externalModelManager.Color(16777215);
      const value17 =
        value16.r * 0.2126 + value16.g * 0.7152 + value16.b * 0.0722;
      const value18 = value15.match(/material-(\d+)/)?.[1];
      const value19 = value13.appliance ?? value13.furniture;
      const value20 = value13.applianceSoft ?? value13.furnitureSoft;
      const value21 = value13.applianceDark ?? value13.furnitureDark;
      const value22 =
        ["desktop", "laptop", "nas"].includes(value14) && value18 === "0";
      const value23 =
        value14 === "walllamp"
          ? value18 === "2"
            ? value13.accent
            : value19
          : value14 === "floorlamp"
            ? value19
            : value14 === "desktop"
              ? value18 === "1"
                ? value21
                : value20
              : value14 === "laptop" && value18 === "2"
                ? value21
                : (value14 === "laptop" && value18 === "1") || value22
                  ? value20
                  : value14.startsWith("tv_")
                    ? value21
                    : value14 === "pipelinewaterpurifier" ||
                        value14 === "tea_bar_machine"
                      ? value17 < 0.16
                        ? value19
                        : value20
                      : value15.endsWith("-dark") || value17 < 0.16
                        ? value21
                        : value15.endsWith("-soft") || value17 < 0.45
                          ? value20
                          : value19;
      const value24 = fn11(value12, value23, {
        roughness: 0.82,
        metalness: 0,
        flatShading: false,
      });
      if (value14 === "tea_bar_machine") {
        value24.emissive = new externalModelManager.Color(0);
        value24.emissiveIntensity = 0;
      }
      return value24;
    }
    if (we.has(value14)) {
      return fn12(value12, value13, value14);
    }
    if (value14 === "sofa") {
      const value15 = /cushion/i.test(value12?.name || "");
      return fn11(
        value12,
        value15 ? value13.furnitureSoft : value13.furniture,
        {
          roughness: 0.8,
          metalness: 0.01,
        },
      );
    }
    if (value14 === "elevator") {
      const value15 = /Color_00[34]/i.test(value12?.name || "");
      const value16 = value15
        ? new externalModelManager.Color(value13.wall)
        : new externalModelManager.Color(value13.furniture);
      return fn11(
        value12,
        value16,
        value15
          ? {
              roughness: 0.82,
              metalness: 0.01,
            }
          : {},
      );
    }
    if (value14 === "piano") {
      const value15 = (value12?.name || "").toLowerCase();
      const color = value15.includes("color_009")
        ? value13.furnitureDark
        : value15.includes("blinds_weave") ||
            value15.includes("金色") ||
            value15.includes("*1")
          ? value13.furnitureSoft
          : value13.furniture;
      const value16 = new externalModelManager.MeshStandardMaterial({
        color: color,
        roughness: 0.72,
        metalness: 0.06,
        emissive: color,
        emissiveIntensity: 0.08,
        side: value12?.side ?? externalModelManager.FrontSide,
        transparent: false,
        opacity: 1,
        depthWrite: value12?.depthWrite ?? true,
        depthTest: value12?.depthTest ?? true,
        toneMapped: true,
      });
      value16.name =
        (value12?.name || "piano") + " · HA Bridge furniture palette";
      return value16;
    }
    if (externalModelManager3.has(value14)) {
      return fn13(value12, value13, value14);
    } else {
      return fn10(value12, value13);
    }
  }
  function fn15(value12) {
    const value13 = value12?.clone?.();
    if (value13?.computeVertexNormals) {
      value13.computeVertexNormals();
      if (value13.attributes?.normal) {
        value13.attributes.normal.needsUpdate = true;
      }
      value13.computeBoundingBox?.();
      value13.computeBoundingSphere?.();
      return value13;
    } else {
      return value12;
    }
  }
  function fn16(value12, value13 = null) {
    const allowed = new Set();
    const position = value12?.attributes?.position;
    if (!position) {
      return allowed;
    }
    const index = value12.index;
    const value14 = Number.isInteger(value13)
      ? (value12.groups || []).filter(
          (value15) => value15.materialIndex === value13,
        )
      : [];
    if (value14.length) {
      for (const value15 of value14) {
        const value16 = value15.start + value15.count;
        for (let start = value15.start; start < value16; start += 1) {
          allowed.add(index ? index.getX(start) : start);
        }
      }
    } else if (value13 === null) {
      for (let value15 = 0; value15 < position.count; value15 += 1) {
        allowed.add(value15);
      }
    }
    return allowed;
  }
  function fn17(value12, value13) {
    let min = Infinity;
    let max = -Infinity;
    for (const value14 of value13) {
      const value15 = value12.getY(value14);
      min = Math.min(min, value15);
      max = Math.max(max, value15);
    }
    return {
      min: min,
      max: max,
    };
  }
  function fn18(value12, value13, value14 = null, value15 = null) {
    if (!value12?.attributes?.position) {
      return value12;
    }
    const position = value12.attributes.position;
    const value16 = value12.clone?.();
    if (!value16?.attributes?.position) {
      return value12;
    }
    const position2 = value16.attributes.position;
    const value17 = fn16(value12, value14);
    if (!value17.size) {
      return value12;
    }
    const { min: value18, max: value19 } = fn17(position, value17);
    if (
      !Number.isFinite(value18) ||
      !Number.isFinite(value19) ||
      value19 - value18 < 0.001
    ) {
      return value12;
    }
    const position3 = value13?.attributes?.position;
    const value20 = fn16(value13, value15);
    if (!position3 || !value20.size) {
      return value12;
    }
    const value21 = fn17(position3, value20);
    if (!Number.isFinite(value21.min) || !Number.isFinite(value21.max)) {
      return value12;
    }
    const value22 = (value21.min + value21.max) / 2;
    let value23 = null;
    let value24 = null;
    for (const value33 of value20) {
      const value34 = {
        y: position3.getY(value33),
        z: position3.getZ(value33),
      };
      if (value34.y <= value22 && (!value23 || value34.z > value23.z)) {
        value23 = value34;
      }
      if (value34.y > value22 && (!value24 || value34.z > value24.z)) {
        value24 = value34;
      }
    }
    if (!value23 || !value24 || value24.y - value23.y < 0.001) {
      return value12;
    }
    const value25 = value24.y - value23.y;
    const value26 = value23.y + value25 * 0.04;
    const value27 = value24.y - value25 * 0.07;
    const value28 = value19 - value18;
    let value29 = Infinity;
    let value30 = -Infinity;
    for (const value33 of value17) {
      const value34 = position.getZ(value33);
      value29 = Math.min(value29, value34);
      value30 = Math.max(value30, value34);
    }
    const count = Math.max(value30 - value29, 0.001);
    const value31 = Math.min(count, value25 * 0.022);
    const value32 = value25 * 0.008;
    for (const value33 of value17) {
      const value34 = position.getY(value33);
      const value35 =
        value26 + ((value34 - value18) / value28) * (value27 - value26);
      const value36 =
        value23.z +
        ((value35 - value23.y) / value25) * (value24.z - value23.z) +
        value32;
      const value37 = (position.getZ(value33) - value29) / count;
      position2.setY(value33, value35);
      position2.setZ(value33, value36 - value31 * (1 - value37));
    }
    position2.needsUpdate = true;
    value16.computeVertexNormals?.();
    value16.computeBoundingBox?.();
    value16.computeBoundingSphere?.();
    return value16;
  }
  const value10 = Object.freeze([
    "alphaMap",
    "anisotropyMap",
    "aoMap",
    "bumpMap",
    "clearcoatMap",
    "clearcoatNormalMap",
    "clearcoatRoughnessMap",
    "displacementMap",
    "emissiveMap",
    "envMap",
    "gradientMap",
    "iridescenceMap",
    "iridescenceThicknessMap",
    "lightMap",
    "map",
    "matcap",
    "metalnessMap",
    "normalMap",
    "roughnessMap",
    "sheenColorMap",
    "sheenRoughnessMap",
    "specularColorMap",
    "specularIntensityMap",
    "thicknessMap",
    "transmissionMap",
  ]);
  const value11 = Object.freeze([
    "alphaHash",
    "alphaTest",
    "alphaToCoverage",
    "anisotropy",
    "aoMapIntensity",
    "attenuationColor",
    "attenuationDistance",
    "blendAlpha",
    "blendColor",
    "blendDst",
    "blendDstAlpha",
    "blendEquation",
    "blendEquationAlpha",
    "blending",
    "blendSrc",
    "blendSrcAlpha",
    "bumpScale",
    "clearcoat",
    "clearcoatNormalScale",
    "clearcoatRoughness",
    "clipIntersection",
    "clipShadows",
    "color",
    "colorWrite",
    "depthFunc",
    "depthTest",
    "depthWrite",
    "displacementBias",
    "displacementScale",
    "dithering",
    "emissive",
    "emissiveIntensity",
    "envMapIntensity",
    "flatShading",
    "fog",
    "forceSinglePass",
    "ior",
    "iridescence",
    "iridescenceIOR",
    "iridescenceThicknessRange",
    "lightMapIntensity",
    "metalness",
    "normalMapType",
    "normalScale",
    "opacity",
    "polygonOffset",
    "polygonOffsetFactor",
    "polygonOffsetUnits",
    "precision",
    "premultipliedAlpha",
    "reflectivity",
    "refractionRatio",
    "roughness",
    "shadowSide",
    "sheen",
    "sheenColor",
    "sheenRoughness",
    "side",
    "specularColor",
    "specularIntensity",
    "stencilFail",
    "stencilFunc",
    "stencilFuncMask",
    "stencilRef",
    "stencilWrite",
    "stencilWriteMask",
    "stencilZFail",
    "stencilZPass",
    "thickness",
    "toneMapped",
    "transmission",
    "vertexColors",
    "visible",
    "wireframe",
    "wireframeLinecap",
    "wireframeLinejoin",
    "wireframeLinewidth",
  ]);
  function fn19(value12) {
    if (value12 === undefined) {
      return "undefined";
    } else if (value12 === null) {
      return null;
    } else if (typeof value12 == "number") {
      if (Number.isNaN(value12)) {
        return "NaN";
      } else if (Number.isFinite(value12)) {
        if (Object.is(value12, -0)) {
          return 0;
        } else {
          return value12;
        }
      } else if (value12 > 0) {
        return "Infinity";
      } else {
        return "-Infinity";
      }
    } else if (["string", "boolean"].includes(typeof value12)) {
      return value12;
    } else if (value12.isTexture) {
      return ["texture", value12.uuid ?? value12.id ?? "anonymous"];
    } else if (value12.isColor) {
      return [value12.r, value12.g, value12.b];
    } else if (Array.isArray(value12)) {
      return value12.map(fn19);
    } else if (typeof value12.toArray == "function") {
      return value12.toArray().map(fn19);
    } else if (
      ["x", "y", "z", "w"].some(
        (value13) => typeof value12[value13] == "number",
      )
    ) {
      return [value12.x, value12.y, value12.z, value12.w].map(fn19);
    } else {
      return String(value12);
    }
  }
  function fn20(value12) {
    if (value12?.isShaderMaterial || value12?.isRawShaderMaterial) {
      return JSON.stringify([
        value12.type || "ShaderMaterial",
        "unique",
        value12.uuid || value12.id,
      ]);
    }
    const value13 =
      typeof value12?.customProgramCacheKey == "function"
        ? value12.customProgramCacheKey()
        : "";
    return JSON.stringify([
      value12?.type || value12?.constructor?.name || "Material",
      value13,
      value11.map((value14) => [value14, fn19(value12?.[value14])]),
      value10.map((value14) => [value14, fn19(value12?.[value14])]),
    ]);
  }
  function fn21(value12, value13, value14) {
    if (!value12) {
      return value12;
    }
    const value15 =
      xe.has(value14) || bag.has(value14)
        ? fn14(value12, value13, value14)
        : value12.clone?.() || value12;
    const value16 = fn20(value15);
    if (index3.has(value16)) {
      materialReuses += 1;
      if (value15 !== value12) {
        value15.dispose?.();
      }
      return index3.get(value16);
    } else {
      index3.set(value16, value15);
      return value15;
    }
  }
  function addExternalItemModel(
    value12,
    value13,
    value14,
    { selected: value15 = false } = {},
  ) {
    const value16 = modelTypeForItem(value13);
    const value17 = index.get(value16);
    if (!value17) {
      loadExternalItemModel(value16);
      return false;
    }
    const value18 = value17.source.clone(true);
    let value19 = null;
    if (value16 === "laptop") {
      value18.traverse((value22) => {
        if (!value22.isMesh || value19) {
          return;
        }
        const value23 = (
          Array.isArray(value22.material)
            ? value22.material
            : [value22.material]
        ).findIndex(
          (value24) =>
            (value24?.name || "").toLowerCase().match(/material-(\d+)/)?.[1] ===
            "1",
        );
        if (!(value23 < 0)) {
          value19 = {
            geometry: value22.geometry,
            materialIndex: Array.isArray(value22.material) ? value23 : null,
          };
        }
      });
    }
    value18.traverse((value22) => {
      if (!value22.isMesh) {
        return;
      }
      const geometry = value22.geometry;
      const value23 = (
        Array.isArray(value22.material) ? value22.material : [value22.material]
      ).findIndex(
        (value24) =>
          (value24?.name || "").toLowerCase().match(/material-(\d+)/)?.[1] ===
          "2",
      );
      if (value16 === "laptop" && value23 >= 0 && value19) {
        value22.geometry = fn18(
          value22.geometry,
          value19.geometry,
          Array.isArray(value22.material) ? value23 : null,
          value19.materialIndex,
        );
      } else if (value16 === "tea_bar_machine" || value16 === "dishwasher") {
        value22.geometry = fn15(value22.geometry);
      }
      const fn22 = (value24) => {
        const value25 = fn21(value24, value14, value16);
        return (value15 && value25?.clone?.()) || value25;
      };
      value22.material = Array.isArray(value22.material)
        ? value22.material.map(fn22)
        : fn22(value22.material);
      value22.castShadow = value16 !== "rug";
      value22.receiveShadow =
        value16 !== "glassstairs" || value22.material?.transparent !== true;
      if (value16 === "rug") {
        const list = Array.isArray(value22.material)
          ? value22.material
          : [value22.material];
        value22.renderOrder = list.some((value24) => value24?.polygonOffset)
          ? 1
          : 0;
      }
      value22.userData.externalModelSharedGeometry =
        value22.geometry === geometry;
      value22.userData.externalModelSharedTextures = true;
      value22.userData.externalModelSharedMaterial = !value15;
    });
    const value20 = ALL_ITEM_MODELS[value16];
    const value21 =
      Array.isArray(value20?.scaleBasis) && value20.scaleBasis.length === 3
        ? {
            x: value20.scaleBasis[0],
            y: value20.scaleBasis[1],
            z: value20.scaleBasis[2],
          }
        : value17.size;
    if (value20?.preserveAspect) {
      const value22 = Math.min(
        value13.width / value21.x,
        value13.height / value21.y,
        value13.depth / value21.z,
      );
      value18.scale.setScalar(value22);
    } else {
      value18.scale.set(
        value13.width / value21.x,
        value13.height / value21.y,
        value13.depth / value21.z,
      );
    }
    if (value20?.preserveOrigin) {
      if (value20?.groundAlign) {
        value18.updateMatrixWorld(true);
        const value22 = new externalModelManager.Box3().setFromObject(value18);
        value18.position.y -= value22.min.y;
        value18.position.y += finite(value20.groundOffset, 0);
      }
    } else {
      value18.updateMatrixWorld(true);
      const value22 = new externalModelManager.Box3().setFromObject(value18);
      const value23 = value22.getCenter(new externalModelManager.Vector3());
      value18.position.set(-value23.x, -value22.min.y, -value23.z);
    }
    value12.add(value18);
    return true;
  }
  return {
    addExternalItemModel: addExternalItemModel,
    loadExternalItemModel: loadExternalItemModel,
    modelTypeForItem: modelTypeForItem,
    modelLoadState: modelLoadState,
  };
}
