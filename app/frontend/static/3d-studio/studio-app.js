import * as THREE from "/bridge-static/vendor/three/0.182.0/three.module.min.js";
import { OrbitControls } from "/bridge-static/vendor/three/0.182.0/OrbitControls.js?v=20260903-camera-target-smoothing-v1";
import { RoundedBoxGeometry } from "/bridge-static/vendor/three/0.182.0/RoundedBoxGeometry.js";
import { mergeGeometries } from "/bridge-static/vendor/three/0.182.0/BufferGeometryUtils.js";
import { GLTFLoader } from "/bridge-static/vendor/three/0.182.0/GLTFLoader.js?v=20260811-three-0182-glb2";
import { SameOriginDRACOLoader } from "./draco-loader.js?v=20260904-csp-static-worker-v1";
import {
  adaptiveDeviceLightBudget,
  adaptiveLightRenderCost,
  assessAdaptiveRenderFrames,
  axisLockedPoint,
  canonicalPolygonKey,
  clamp,
  clampWindowT,
  closedWallFloorPolygons,
  closedWallPolygons,
  distance,
  doorLeafRotation,
  itemRotationFromPointers,
  localSpotShadowSettings,
  mergeCollinearWallSegments,
  modelBounds,
  nearestWall,
  pointInRotatedRectangle,
  pointInPolygon,
  planLabelProjectionMetrics,
  polygonArea,
  projectPointToSegment,
  resizeRotatedItemFromCorner,
  remapWallAttachment,
  selectShadowCastingLightIds,
  segmentIntersection,
  slidingDoorPanelCenters,
  spotShadowTextureUnitLimit,
  spotLightBrightnessResponse,
  splitWallSegments,
  snapPoint,
  uncoveredCollinearWallSegments,
  unclosedWallEndpoints,
  validatedUnionPolygonLoops,
  wallLengthMeters,
  wallIntersections,
  wallJoinExtensions,
  wallSolidPieces,
} from "./geometry.js?v=20260903-wall-overlap-guard-v1-20260904-local-shadow-bands-v1";
import {
  buildLightDeltaPixels,
  buildStoredZip,
  EXPORT_IMAGE_EXTENSION,
  EXPORT_IMAGE_MIME_TYPE,
  EXPORT_IMAGE_QUALITY,
  EXPORT_RENDER_SCALE,
  scaledExportResolution,
} from "./export-utils.js?v=20260902-native-resolution-q95-v185";
import {
  MAX_EXPORT_PRESET_COUNT,
  exportPresetIsEmpty,
  normalizeActiveExportPresetSlot,
  normalizeExportPreset,
  normalizeExportPresetSlots,
} from "./export-presets.js?v=20260826-export-presets-v4";
import { reorderFloors } from "./floor-order.js?v=20260825-floor-reorder-v1";
import { syncControlValue } from "./ui-controls.js?v=20260826-input-stability-v1";
import {
  initializeNumberInputs,
  initializeStudioSelects,
  syncStudioSelect,
} from "./studio-widgets.js?v=20260901-studio-widgets-v1";
import {
  createExternalModelManager,
  ALL_ITEM_MODELS,
} from "./studio-external-models.js?v=20260904-studio-external-models-v48-load-state-20260905-client-log-v1";
import {
  createPlanDrawingTools,
  drawTrackedText,
} from "./studio-plan-drawing.js?v=20260901-studio-plan-drawing-v2";
import { createSpotShadowAtlasController } from "./studio-shadow-atlas.js?v=20260904-spot-shadow-atlas-v7";
import {
  DEFAULT_BASE_LIGHTING,
  finite,
  itemMinimumHeight,
  kelvinToRgbHex,
  normalizeCameraSettings,
  normalizeBaseLighting,
  normalizeFixedCameraView,
  normalizeFullRotation,
  normalizeLabelText,
  normalizePoint,
} from "./studio-normalization.js?v=20260903-studio-normalization-v2";
window.__haBridgeStudioModuleVersion =
  "20260904-local-shadow-edge-v6-depth-precision-v1-model-load-state-v3-floor-scope-v1-ground-grid-v3-depth-fade-v2-local-shadow-depth-v1-export-shadow-quality-v1-base-light-entry-v1-auto-diagram-preview-hd-v1-auto-diagram-floor-v1-20260905-first-light-prewarm-v3-20260905-orbit-architecture-center-v1";
const f = (selector) => document.querySelector(selector);
const Ue =
  new URLSearchParams(window.location.search).get("auto-diagram-component") ||
  "";
const $e =
  new URLSearchParams(window.location.search).get("auto-diagram-embed") === "1";
const Fl =
  new URLSearchParams(window.location.search).get("export-folder") || "";
const po = new URLSearchParams(window.location.search).has("floor-selection")
  ? new URLSearchParams(window.location.search).get("floor-selection")
  : null;
if ($e) {
  document.body.classList.add("auto-diagram-embedded");
}
const ie = f("#plan-canvas");
const Ct = f("#plan-stage");
const X0 = f("#canvas-empty");
const _0 = f("#project-name");
const Al = f("#save-state");
const Qo = f("#import-plan");
const ii = f("#plan-file");
const Lr = f("#toggle-background");
const Gl = f("#remove-plan");
const Y0 = f("#add-floor");
const Ir = f("#floor-list");
const ri = f("#align-floor");
const yn = f("#floor-context-menu");
const Tr = f("#floor-rename-dialog");
const q0 = f("#floor-rename-form");
const Cr = f("#floor-rename-input");
const si = f("#floor-delete-dialog");
const U0 = f("#floor-delete-form");
const Z0 = f("#floor-delete-name");
const Jo = f("#save-conflict-dialog");
const K0 = f("#save-conflict-load");
const Q0 = f("#save-conflict-overwrite");
const jo = f("#global-wall-height");
const ea = f("#global-wall-thickness");
const ta = f("#global-wall-opacity");
const kr = f("#toggle-floor-edge");
const $l = [...document.querySelectorAll("[data-tool]")];
const na = f("#finish-wall");
const zl = f("#delete-selection");
const Rr = f("#active-tool-label");
const Dr = f("#tool-help");
const J0 = f("#cursor-position");
const Nn = f("#snap-indicator");
const Fr = f("#snap-toggle");
const j0 = f("#snap-toggle-state");
const Bl = f("#snap-settings-toggle");
const oa = f("#snap-settings-panel");
const Ol = [...document.querySelectorAll("[data-snap-setting]")];
const mo = f("#snap-tolerance");
const Wl = f("#snap-tolerance-value");
const eh = f("#zoom-value");
const aa = f("#scale-dialog");
const th = f("#scale-form");
const nh = f("#reference-pixels");
const Ar = f("#reference-meters");
const Gr = f("#light-group-rename-dialog");
const oh = f("#light-group-rename-form");
const $r = f("#light-group-rename-input");
const zr = f("#light-property-apply-dialog");
const ah = f("#light-property-apply-form");
const Xn = f("#light-property-target-list");
const ih = f("#light-property-selection-count");
const li = f("#light-property-toggle-all");
const rh = f("#light-property-apply-title");
const sh = f("#light-property-apply-value");
const Hl = [...document.querySelectorAll("[data-apply-light-property]")];
const Br = f("#toast");
const wo = f("#inspector-empty");
const Or = f("#selection-inspector");
const Vl = f(".selection-heading");
const Wr = f("#selection-id");
const Nl = f("#light-preview-note");
const lh = f("#wall-fields");
const ch = f("#window-fields");
const dh = f("#door-fields");
const hh = f("#railing-fields");
const uh = f("#item-fields");
const fh = f("#label-text-fields");
const gh = f("#light-fields");
const ph = f("#item-height-field");
const mh = f("#item-elevation-field");
const wh = f("#item-rotation-field");
const yh = f("#item-rotation-actions");
const xh = f("#item-vertical-rotation-field");
const vh = f("#item-vertical-rotation-label");
const bh = f("#item-strip-orientation-heading");
const Mh = f("#item-strip-roll-field");
const Hr = f("#item-strip-roll");
const Sh = f("#item-light-source-visibility-field");
const Vr = f("#item-light-source-visible");
const Ph = f("#curtain-position-field");
const Eh = f("#round-table-turntable-field");
const Lh = f("#stair-direction-field");
const Ih = f("#tv-mount-style-field");
const Th = f("#shoe-cabinet-actions");
const Xl = f("#shoe-cabinet-mirror");
const Ch = f("#item-width-label");
const kh = f("#item-depth-label");
const Rh = f("#scene-counts");
const _l = [...document.querySelectorAll("[data-preview-sync]")];
const Yl = [...document.querySelectorAll("[data-preview-floor]")];
const ia = f("#refresh-preview");
const ci = f("#refresh-light-preview");
const di = f("#preview-quality-status");
const ra = f("#model-loading-status");
let ql = false;
const Ne = f("#preview-light-cache");
const ln = f("#preview-render-shield");
const Ul = [...document.querySelectorAll("[data-camera-view]")];
const Zl = [...document.querySelectorAll("[data-camera-rotate-top]")];
const Kl = [...document.querySelectorAll("[data-camera-mode]")];
const hi = [...document.querySelectorAll("[data-camera-focal-length]")];
const Ql = [...document.querySelectorAll("[data-base-light-control]")];
const Me = f("#base-light-controls");
const sa = Me?.querySelector(".base-light-controls-header");
const Dh = f("#reset-base-lighting");
const Fh = f("#save-base-lighting");
const Ah = f("#close-base-lighting");
const Gh = [f("#open-base-lighting"), f("#export-open-base-lighting")].filter(
  Boolean,
);
if (Me && Me.parentElement !== document.body) {
  document.body.append(Me);
}
const $h = f("#save-camera-view");
const Nr = f("#fixed-camera-view");
const zh = f("#floor-camera-actions");
const Bh = f("#overview-camera-actions");
const Oh = f("#save-overview-view");
const Xr = f("#fixed-overview-view");
const Wh = f("#preview-floor-gap-control");
const ui = f("#preview-floor-gap");
const je = f("#export-dialog");
const Hh = f("#export-preview-frame");
const xn = f("#export-preview-stage");
const Vh = f("#export-preset-empty-state");
const Nh = f("#export-preset-empty-title");
const wt = f("#export-width");
const yt = f("#export-height");
const vn = f("#export-lock-ratio");
const Xh = f("#export-aspect-label");
const _h = f("#export-resolution-label");
const pe = f("#export-status");
const _r = f("#export-package");
const ht = f("#export-folder-name");
const Yr = f("#export-save-view");
const Jl = f("#export-group-files");
const la = f("#export-floor-select");
const Yh = f("#export-floor-gap-control");
const ca = f("#export-floor-gap");
const jl = f("#export-preset-slots");
const ec = f("#export-preset-add");
const tc = f("#export-preset-rename");
const nc = f("#export-preset-delete");
const fi = f("#export-preset-rename-dialog");
const qh = f("#export-preset-rename-form");
const qr = f("#export-preset-rename-input");
const gi = f("#export-preset-delete-dialog");
const Uh = f("#export-preset-delete-form");
const Zh = f("#export-preset-delete-name");
const pi = f("#export-overwrite-dialog");
const Kh = f("#export-overwrite-name");
const mi = f("#export-complete-dialog");
const Qh = f("#export-complete-title");
const Jh = f("#export-complete-message");
const jh = f("#export-complete-path");
const yo = f(".studio-shell");
const da = f(".details-panel");
const Ze = f("#details-resizer");
const oc = [...document.querySelectorAll("[data-asset-category]")];
const eu = [...document.querySelectorAll("[data-asset-heading-category]")];
const ac = [...document.querySelectorAll("[data-item-type]")];
const tu = f("#asset-grid");
const nu = f("#light-asset-row");
const ic = f("#light-layer-panel");
const ha = f("#light-group-list");
const ou = f("#add-light-group");
const au = f("#light-groups-off");
const bn = f("#light-group-context-menu");
const kt = 2;
const ua = {
  background: 1120029,
  ground: 1382690,
  floor: 5792116,
  floorEdge: 16163146,
  grid: 5331300,
  wall: 9476522,
  wallTop: 13095134,
  wallOpacity: 0.25,
  furniture: 8226713,
  furnitureSoft: 10332346,
  furnitureLight: 12634839,
  furnitureDark: 5397873,
  appliance: 10134967,
  applianceSoft: 11911118,
  applianceDark: 6845576,
  glass: 11126227,
  frame: 12172999,
  doorLeaf: 10988725,
  accent: 16758886,
  accentIntensity: 3.8,
  exposure: 1.05,
};
const xt = {
  planlabel: {
    name: "户型铭牌",
    glyph: "T",
    width: 4.5,
    depth: 1.35,
    height: 0.01,
    color: "#cbd4e2",
  },
  sofa: {
    name: "沙发",
    glyph: "▰",
    width: 2.2,
    depth: 0.9,
    height: 0.82,
    color: "#c98a58",
  },
  smallcar: {
    name: "小汽车",
    glyph: "◆",
    width: 2.19,
    depth: 5.01,
    height: 1.43,
    color: "#8f969d",
  },
  bed: {
    name: "双人床",
    glyph: "▤",
    width: 1.8,
    depth: 2,
    height: 0.62,
    color: "#d8d4c9",
  },
  curtain: {
    name: "窗帘",
    glyph: "▥",
    width: 1.8,
    depth: 0.18,
    height: 2.4,
    color: "#7d8799",
  },
  nightstand: {
    name: "床头柜",
    glyph: "▣",
    width: 0.5,
    depth: 0.42,
    height: 0.55,
    color: "#8d6d57",
  },
  table: {
    name: "餐桌组合",
    glyph: "▦",
    width: 2.4,
    depth: 1.8,
    height: 0.82,
    color: "#9b6945",
  },
  rounddiningtable: {
    name: "圆形餐桌",
    glyph: "◉",
    width: 2.2,
    depth: 2.2,
    height: 0.78,
    color: "#6f5544",
  },
  rounddiningtableturntable: {
    name: "圆形餐桌（带转盘）",
    glyph: "◎",
    width: 2.2,
    depth: 2.2,
    height: 0.78,
    color: "#6f5544",
  },
  squarecoffeetable: {
    name: "方茶几",
    glyph: "▦",
    width: 1.4,
    depth: 0.7,
    height: 0.46,
    color: "#8d96aa",
  },
  bar: {
    name: "吧台",
    glyph: "▰",
    width: 2.2,
    depth: 0.65,
    height: 1.05,
    color: "#8b674d",
  },
  aquarium: {
    name: "鱼缸",
    glyph: "▣",
    width: 1.5,
    depth: 0.55,
    height: 1.4,
    color: "#7896a4",
  },
  coffeetable: {
    name: "组合茶几",
    glyph: "◉",
    width: 1.7,
    depth: 1.25,
    height: 0.5,
    color: "#8d96aa",
  },
  sideboard: {
    name: "餐边柜",
    glyph: "▤",
    width: 1.6,
    depth: 0.45,
    height: 2.2,
    color: "#94745d",
  },
  shoecabinet: {
    name: "鞋柜",
    glyph: "▥",
    width: 1.8,
    depth: 0.42,
    height: 2.25,
    color: "#8e7764",
  },
  stairs: {
    name: "楼梯",
    glyph: "⇧",
    width: 1,
    depth: 2.8,
    height: 1.65,
    color: "#8b95a6",
  },
  steelstairs: {
    name: "钢楼梯",
    glyph: "⇧",
    width: 1.86,
    depth: 2.93,
    height: 3.45,
    color: "#7d8799",
  },
  glassstairs: {
    name: "玻璃楼梯",
    glyph: "⇧",
    width: 2.51,
    depth: 2.84,
    height: 3.41,
    color: "#a9c5d3",
  },
  chair: {
    name: "椅子",
    glyph: "◇",
    width: 0.5,
    depth: 0.5,
    height: 0.86,
    color: "#b47b51",
  },
  cabinet: {
    name: "储物柜",
    glyph: "▥",
    width: 1.6,
    depth: 0.45,
    height: 1.9,
    color: "#9a7658",
  },
  glasscabinet: {
    name: "玻璃柜",
    glyph: "▧",
    width: 1.2,
    depth: 0.4,
    height: 1.9,
    color: "#90755f",
  },
  bookcase: {
    name: "书架",
    glyph: "▥",
    width: 1.2,
    depth: 0.32,
    height: 1.9,
    color: "#8f7058",
  },
  shelf: {
    name: "货架",
    glyph: "▤",
    width: 1.2,
    depth: 0.45,
    height: 1.8,
    color: "#778391",
  },
  pillar: {
    name: "柱子",
    glyph: "▣",
    width: 0.45,
    depth: 0.45,
    height: 2.8,
    color: "#9099aa",
  },
  wallcabinet: {
    name: "吊柜",
    glyph: "▧",
    width: 1.5,
    depth: 0.35,
    height: 0.82,
    color: "#9a806c",
  },
  kitchenbase: {
    name: "厨房地柜",
    glyph: "▤",
    width: 2.4,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865",
  },
  kitchensink: {
    name: "地柜带水盆",
    glyph: "▣",
    width: 1.2,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865",
  },
  kitchencooktop: {
    name: "地柜带燃气灶",
    glyph: "▦",
    width: 1.2,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865",
  },
  fridge: {
    name: "冰箱",
    glyph: "▯",
    width: 0.75,
    depth: 0.72,
    height: 1.85,
    color: "#b8c3c8",
  },
  storagewaterheater: {
    name: "储水式热水器",
    glyph: "◉",
    width: 0.86,
    depth: 0.46,
    height: 0.48,
    elevation: 1.65,
    color: "#e5e9ec",
  },
  gaswaterheater: {
    name: "燃气热水器",
    glyph: "▯",
    width: 0.42,
    depth: 0.22,
    height: 0.72,
    elevation: 1.55,
    color: "#e3e7e9",
  },
  pipelinewaterpurifier: {
    name: "管线机",
    glyph: "▥",
    width: 0.48,
    depth: 0.24,
    height: 0.68,
    elevation: 1.42,
    color: "#e2e6e7",
  },
  tea_bar_machine: {
    name: "茶吧机",
    glyph: "▤",
    width: 0.62,
    depth: 0.48,
    height: 1.8,
    color: "#b8b5ac",
  },
  elevator: {
    name: "电梯",
    glyph: "⇧",
    width: 1.4,
    depth: 1.52,
    height: 2.2,
    color: "#b8c3c8",
  },
  washer: {
    name: "洗衣机",
    glyph: "◉",
    width: 0.6,
    depth: 0.65,
    height: 0.85,
    color: "#b8c3c8",
  },
  airoutlet: {
    name: "出风口",
    glyph: "▥",
    width: 0.188,
    depth: 2,
    height: 0.3,
    elevation: 2,
    color: "#a8adb2",
  },
  dryer: {
    name: "烘干机",
    glyph: "◎",
    width: 0.6,
    depth: 0.65,
    height: 0.85,
    color: "#aeb9c3",
  },
  dishwasher: {
    name: "洗碗机",
    glyph: "▤",
    width: 0.6,
    depth: 0.6,
    height: 0.82,
    color: "#b8c3c8",
  },
  steamoven: {
    name: "蒸烤箱",
    glyph: "▣",
    width: 0.6,
    depth: 0.55,
    height: 0.6,
    elevation: 0.82,
    color: "#aeb9c3",
  },
  microwave: {
    name: "微波炉",
    glyph: "▭",
    width: 0.52,
    depth: 0.42,
    height: 0.32,
    elevation: 0.85,
    color: "#aeb9c3",
  },
  ricecooker: {
    name: "电饭煲",
    glyph: "◉",
    width: 0.28,
    depth: 0.32,
    height: 0.25,
    elevation: 0.85,
    color: "#b8c3c8",
  },
  rangehood: {
    name: "油烟机",
    glyph: "◢",
    width: 0.9,
    depth: 0.45,
    height: 0.55,
    elevation: 1.45,
    color: "#9faab5",
  },
  wallac: {
    name: "挂机空调",
    glyph: "▬",
    width: 0.9,
    depth: 0.22,
    height: 0.28,
    elevation: 2,
    color: "#c4ccd2",
  },
  floorac: {
    name: "柜机空调",
    glyph: "◉",
    width: 0.42,
    depth: 0.42,
    height: 1.75,
    color: "#b8c3c8",
  },
  robotvacuum: {
    name: "扫地机器人",
    glyph: "◎",
    width: 0.55,
    depth: 0.5,
    height: 0.85,
    color: "#b8c3c8",
  },
  nas: {
    name: "NAS",
    glyph: "▦",
    width: 0.28,
    depth: 0.24,
    height: 0.34,
    elevation: 0,
    color: "#626d7b",
  },
  airpurifier: {
    name: "空气净化器",
    glyph: "◌",
    width: 0.34,
    depth: 0.34,
    height: 0.7,
    color: "#b8c3c8",
  },
  tv: {
    name: "电视",
    glyph: "▭",
    width: 1.5,
    depth: 0.18,
    height: 0.92,
    color: "#22282d",
  },
  plant: {
    name: "绿植",
    glyph: "✦",
    width: 0.75,
    depth: 0.75,
    height: 1.6,
    color: "#4e8b63",
  },
  floorlamp: {
    name: "落地灯",
    glyph: "⌁",
    width: 1.35,
    depth: 0.5,
    height: 1.8,
    color: "#4b5361",
  },
  vanity: {
    name: "梳妆台",
    glyph: "◫",
    width: 1.2,
    depth: 0.5,
    height: 1.55,
    color: "#b68c70",
  },
  desk: {
    name: "桌子",
    glyph: "▱",
    width: 1.4,
    depth: 0.65,
    height: 0.76,
    color: "#8e6b50",
  },
  piano: {
    name: "钢琴",
    glyph: "▰",
    width: 1.8,
    depth: 1.8,
    height: 1.35,
    color: "#4b5361",
  },
  desktop: {
    name: "台式电脑",
    glyph: "▣",
    width: 0.72,
    depth: 0.32,
    height: 0.5,
    elevation: 0.76,
    color: "#434b59",
  },
  laptop: {
    name: "笔记本电脑",
    glyph: "⌨",
    width: 0.36,
    depth: 0.28,
    height: 0.22,
    elevation: 0.76,
    color: "#555e6b",
  },
  toilet: {
    name: "马桶",
    glyph: "◒",
    width: 0.42,
    depth: 0.7,
    height: 0.52,
    color: "#e1e5e8",
  },
  squattoilet: {
    name: "蹲便",
    glyph: "▱",
    width: 0.45,
    depth: 0.65,
    height: 0.18,
    color: "#e1e5e8",
  },
  urinal: {
    name: "小便斗",
    glyph: "◖",
    width: 0.38,
    depth: 0.34,
    height: 0.72,
    elevation: 0.38,
    color: "#e1e5e8",
  },
  bathtub: {
    name: "浴缸",
    glyph: "▱",
    width: 1.7,
    depth: 0.78,
    height: 0.58,
    color: "#e1e5e8",
  },
  walllamp: {
    name: "壁灯",
    glyph: "◒",
    width: 0.3,
    depth: 0.22,
    height: 0.34,
    elevation: 1.55,
    color: "#d4dbe2",
  },
  shower: {
    name: "花洒",
    glyph: "♨",
    width: 0.9,
    depth: 0.9,
    height: 2.1,
    color: "#aebac5",
  },
  glasspartition: {
    name: "玻璃隔断",
    glyph: "▥",
    width: 1.2,
    depth: 0.08,
    height: 2,
    color: "#a9c5d3",
  },
  basin: {
    name: "台盆",
    glyph: "◉",
    width: 0.9,
    depth: 0.5,
    height: 0.88,
    color: "#d9dee2",
  },
  rug: {
    name: "地毯",
    glyph: "▨",
    width: 2,
    depth: 1.4,
    height: 0.012,
    color: "#7f7180",
  },
  tvstand: {
    name: "电视柜",
    glyph: "▬",
    width: 1.8,
    depth: 0.42,
    height: 0.48,
    color: "#77675e",
  },
  downlight: {
    name: "筒射灯",
    glyph: "◎",
    width: 0.52,
    depth: 0.52,
    height: 0.08,
    elevation: 2.68,
    color: "#d4dbe2",
  },
  ceilinglight: {
    name: "吸顶灯",
    glyph: "▣",
    width: 0.58,
    depth: 0.58,
    height: 0.1,
    elevation: 2.65,
    color: "#d4dbe2",
  },
  striplight: {
    name: "灯带",
    glyph: "━",
    width: 2,
    depth: 0.28,
    height: 0.05,
    elevation: 2.7,
    color: "#d4dbe2",
  },
};
const iu = new Set([
  "nightstand",
  "bar",
  "aquarium",
  "sideboard",
  "shoecabinet",
  "stairs",
  "steelstairs",
  "glassstairs",
  "smallcar",
  "cabinet",
  "glasscabinet",
  "bookcase",
  "shelf",
  "pillar",
  "wallcabinet",
  "kitchenbase",
  "kitchensink",
  "kitchencooktop",
  "vanity",
  "basin",
  "bathtub",
  "tvstand",
  "squarecoffeetable",
  "glasspartition",
  "washer",
  "airoutlet",
  "dryer",
  "dishwasher",
  "steamoven",
  "microwave",
  "rangehood",
  "nas",
  "pipelinewaterpurifier",
  "tea_bar_machine",
]);
const rc = new Set([
  "fridge",
  "storagewaterheater",
  "gaswaterheater",
  "pipelinewaterpurifier",
  "tea_bar_machine",
  "washer",
  "airoutlet",
  "dryer",
  "dishwasher",
  "steamoven",
  "microwave",
  "ricecooker",
  "rangehood",
  "wallac",
  "floorac",
  "robotvacuum",
  "nas",
  "airpurifier",
  "tv",
  "desktop",
  "laptop",
  "floorlamp",
  "walllamp",
]);
const re = new Set(["downlight", "ceilinglight", "striplight"]);
const Ur = new Set(["stairs", "steelstairs", "glassstairs"]);
const xo = new Set(["steelstairs", "glassstairs"]);
const Mn = new Set(["rounddiningtable", "rounddiningtableturntable"]);
const fa = new Set(["standard", "tabletop", "mobile"]);
const wi = Object.freeze({
  depth: 0.55,
  height: 1.55,
});
function yi(value) {
  return (
    value?.type === "rounddiningtableturntable" ||
    value?.roundTableTurntable === true
  );
}
const Rt = {
  downlight: {
    temperature: 3000,
    brightness: 48,
    range: 3.2,
    angle: 48,
  },
  ceilinglight: {
    temperature: 3500,
    brightness: 62,
    range: 5,
    angle: 110,
  },
  striplight: {
    temperature: 3000,
    brightness: 42,
    range: 3.5,
    angle: 100,
  },
};
const ru = Object.freeze({
  downlight: 1.1,
  ceilinglight: 0.792,
  striplight: 1.3,
});
const su = {
  downlight: 120,
  ceilinglight: 150,
  striplight: 120,
};
const sc = 8;
const lu = 2;
const lc = 1;
const cc = 1024;
const dc = 0.8;
const Sn = {
  solid: {
    width: 0.9,
    height: 2.1,
  },
  double: {
    width: 1.8,
    height: 2.2,
  },
  entry: {
    width: 1.05,
    height: 2.2,
  },
  glass: {
    width: 0.9,
    height: 2.1,
  },
  "sliding-glass": {
    width: 1.8,
    height: 2.1,
  },
  "roller-shutter": {
    width: 3,
    height: 2.8,
  },
  "frame-only": {
    width: 0.9,
    height: 2.1,
  },
};
function vo(value) {
  return su[value] || 120;
}
function cu(value) {
  return !!T?.floors?.some((value2) =>
    value2.scene?.items?.some((value3) => {
      if (value.startsWith("tv_")) {
        const value4 = fa.has(value3.tvMountStyle)
          ? value3.tvMountStyle
          : "standard";
        return value3.type === "tv" && value === "tv_" + value4;
      }
      return value3.type === value;
    }),
  );
}
function du(value = []) {
  return [
    ...new Set(
      value.flatMap((value2) =>
        (value2?.scene?.items || [])
          .map((value3) => hu(value3))
          .filter((value3) => ALL_ITEM_MODELS[value3]),
      ),
    ),
  ];
}
function hc() {
  const value = fe() === "all" ? T?.floors || [] : [Te()].filter(Boolean);
  return du(value);
}
const ga = new SameOriginDRACOLoader(
  "/bridge-static/3d-studio/draco-decoder-worker.js?v=20260904-csp-static-worker-v1",
);
ga.setDecoderPath("/bridge-static/vendor/three/0.182.0/draco/");
ga.setDecoderConfig({
  type: "wasm",
});
ga.setWorkerLimit(2);
ga.preload();
const uc = new GLTFLoader();
uc.setDRACOLoader(ga);
let cn = null;
let pa = false;
let Zr = false;
let _n = false;
let bo = [];
let Pn = null;
window.externalModelLoadsDeferred = false;
window.__haBridgeDeferExternalModel = (value) => {
  if (value) {
    if (!bo.includes(value)) {
      bo.push(value);
    }
    Kr();
  }
};
function Kr(value = 900) {
  window.clearTimeout(Pn);
  Pn = window.setTimeout(
    () => {
      Pn = null;
      if (!_n || document.hidden || lt || _e) {
        if (_n) {
          Kr(300);
        }
        return;
      }
      const value2 = [...new Set(bo)];
      bo = [];
      Promise.allSettled(fc(value2));
    },
    Math.max(0, value),
  );
}
function fc(value = []) {
  window.clearTimeout(Pn);
  Pn = null;
  _n = false;
  window.externalModelLoadsDeferred = false;
  const value2 = [...new Set(value)].filter(
    (value4) => ALL_ITEM_MODELS[value4],
  );
  if (!value2.length) {
    return [];
  }
  window.__haBridgeReleasingDeferredModels = true;
  const value3 = value2.map((value4) => Qr(value4));
  window.__haBridgeReleasingDeferredModels = false;
  return value3;
}
function gc() {
  return fc(hc());
}
function pc() {
  En();
  if (!$e && !Zr) {
    if (lt || _e) {
      pa = true;
      return;
    }
    window.clearTimeout(cn);
    cn = window.setTimeout(() => {
      cn = null;
      qe({
        force: true,
        precompile: true,
      });
    }, 80);
  }
}
function mc() {
  En();
  pa = false;
  window.clearTimeout(cn);
  cn = null;
  qe({
    force: true,
    precompile: true,
  });
}
const _t = createExternalModelManager({
  THREE: THREE,
  loader: uc,
  stairItemTypes: Ur,
  isModelInUse: cu,
  requestRender: pc,
  onLoadStateChange: En,
  maxConcurrentLoads: 2,
});
const { loadExternalItemModel: Qr, modelTypeForItem: hu } = _t;
function En(value = _t.modelLoadState()) {
  if (!ra) {
    return;
  }
  const value2 = value.active > 0 || value.queued > 0;
  if (!value2 && pa) {
    pa = false;
    window.clearTimeout(cn);
    cn = null;
    ql = true;
    if (Q && !ze) {
      Q.enabled = false;
    }
    ra.hidden = false;
    ra.querySelector("span:last-child")?.replaceChildren(
      document.createTextNode("正在完成模型…"),
    );
    qe({
      force: true,
      precompile: true,
    });
    window.requestAnimationFrame(() => En());
    return;
  }
  ql = value2;
  if (Q && !ze) {
    Q.enabled = !value2;
  }
  ra.hidden = !value2;
  ra.querySelector("span:last-child")?.replaceChildren(
    document.createTextNode(
      value2 ? "正在加载模型… " + (value.active + value.queued) : "",
    ),
  );
}
const Jr = new Map();
const jr = new Map();
const es = new Map();
const ts = new Map();
const ns = new Map();
const os = new Map();
const as = new Set([
  "tv",
  "smallcar",
  "planlabel",
  "downlight",
  "ceilinglight",
  "striplight",
]);
const uu = new Set([
  "coffeetable",
  "squarecoffeetable",
  "tvstand",
  "plant",
  "bed",
  "nightstand",
  "curtain",
  "vanity",
  "desk",
  "bookcase",
  "piano",
  "table",
  "rounddiningtable",
  "rounddiningtableturntable",
  "bar",
  "sideboard",
  "shoecabinet",
  "chair",
  "cabinet",
  "glasscabinet",
  "shelf",
  "wallcabinet",
  "kitchenbase",
  "kitchensink",
  "kitchencooktop",
  "fridge",
  "washer",
  "dryer",
  "dishwasher",
  "steamoven",
  "microwave",
  "ricecooker",
  "rangehood",
  "wallac",
  "floorac",
  "nas",
  "airpurifier",
  "tv",
  "desktop",
  "laptop",
  "toilet",
  "squattoilet",
  "urinal",
  "bathtub",
  "shower",
  "basin",
]);
const fu = new Set();
const gu = new Set([
  "aquarium",
  "bed",
  "nightstand",
  "curtain",
  "vanity",
  "desk",
  "bookcase",
  "piano",
  "table",
  "rounddiningtable",
]);
const pu = new Set([
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
  "curtain",
  "table",
  "rounddiningtable",
  "rounddiningtableturntable",
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
]);
const mu = new Set([
  "tv",
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
function xi(value, value2, value3 = ao()) {
  const value4 = _t.addExternalItemModel(value, value2, value3, {
    selected: We("item", value2.id),
  });
  En();
  return value4;
}
const wc = {
  lightTemperature: {
    label: "色温",
    input: "#light-temperature",
    unit: "K",
  },
  lightBrightness: {
    label: "亮度",
    input: "#light-brightness",
    unit: "%",
  },
  lightRange: {
    label: "照射范围",
    input: "#light-range",
    unit: "m",
  },
  lightAngle: {
    label: "光束角",
    input: "#light-angle",
    unit: "°",
  },
  elevation: {
    label: "离地高度",
    input: "#item-elevation",
    unit: "m",
  },
};
function is(value, value2, value3) {
  if (value === "lightTemperature") {
    return Math.round(clamp(finite(value2, 3000), 2200, 6500));
  } else if (value === "lightBrightness") {
    return Math.round(clamp(finite(value2, 50), 0, 100));
  } else if (value === "lightRange") {
    return Math.round(clamp(finite(value2, 3.5), 0.5, 10) * 10) / 10;
  } else if (value === "lightAngle") {
    return Math.round(clamp(finite(value2, 90), 15, vo(value3)));
  } else if (value === "elevation") {
    return Math.round(clamp(finite(value2, 2.7), 0, 6) * 100) / 100;
  } else {
    return finite(value2);
  }
}
function yc(value, value2) {
  const value3 = wc[value];
  if (!value3) {
    return String(value2);
  }
  const value4 = ["lightRange", "elevation"].includes(value)
    ? Number(value2).toFixed(value === "elevation" ? 2 : 1)
    : Math.round(value2);
  if (["%", "°"].includes(value3.unit)) {
    return "" + value4 + value3.unit;
  } else {
    return value4 + " " + value3.unit;
  }
}
const xc = {
  select: [
    "选择工具",
    "移动时 Shift 锁轴；缩放时 Shift 等比例；Option/Alt 拖动复制；⌘/Ctrl+C、V 复制粘贴",
  ],
  scale: ["参考线工具", "依次单击两个端点；按住 Shift 强制锁定水平或垂直轴线"],
  wall: [
    "连续画墙",
    "逐点绘制并回到起点闭合空间；未闭合不会生成地面，按住 Shift 锁轴，Esc 结束",
  ],
  window: ["窗户工具", "靠近墙体单击，窗户会自动吸附并生成真实窗洞"],
  door: [
    "门工具",
    "靠近墙体单击，门会自动吸附并生成门洞；选中后可翻转开启方向",
  ],
  railing: ["玻璃栏杆", "靠近墙体单击，栏杆会吸附到墙段并替换对应的实体墙"],
  label: ["户型铭牌", "单击画布放置；选中后可修改文字、拖动、缩放和旋转"],
};
const wu = /^\/3d-studio\/?$/.test(window.location.pathname);
const context = ie.getContext("2d");
const vt = document.createElement("canvas");
const vi = vt.getContext("2d");
const {
  drawMetricGrid: yu,
  drawLine: Se,
  drawPoint: Xe,
  drawOpenEndpointWarning: xu,
  drawFloatingLabel: et,
} = createPlanDrawingTools({
  context: context,
  planToScreen: zo,
  screenToPlan: no,
  pixelsPerMeter: pixelsPerMeter,
  getCanvasSize: () => ({
    width: Qe,
    height: Je,
  }),
  getViewZoom: () => $.zoom,
});
let ma = null;
let bi = 0;
let rs = 0;
let scene = Is();
let T = null;
let xe = "";
let Yn = null;
let wa = null;
let we = "select";
const ya = "solid";
let st = "home";
let ut = "";
let ss = "";
let Mi = "";
let Ln = "";
let In = "";
let xa = null;
let va = [];
let ls = 0;
let X = null;
let he = [];
let Ke = null;
let Si = null;
let ba = 0;
let ft = null;
let Yt = null;
let ue = null;
let cs = 0;
let qn = "";
let ds = "";
let dn = null;
let Mo = null;
let Fe = null;
let Un = null;
let Zn = null;
let Kn = null;
let z = null;
let Pi = false;
let Ma = false;
let Sa = false;
let Qe = 1;
let Je = 1;
let vc = false;
let $ = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};
let Dt = [];
let Qn = [];
let Tn = 0;
let Jn = 0;
let Cn = null;
let hs = false;
let jn = null;
let bc = null;
let Ei = false;
let Li = false;
let Ii = false;
let us = false;
const So = new Set();
let Po = false;
let Ft = null;
let Eo = null;
let Ti = null;
let fs = 0;
let Ci = {
  scene: null,
  signature: "",
  floorPolygons: null,
  intersections: null,
  joinExtensions: null,
  unclosedEndpoints: null,
};
let Pa = null;
let Ea = 0;
let gs = 1;
let ps = null;
let La = 0;
let ms = null;
let W = null;
let ze = false;
let ws = false;
let qt = false;
let kn = null;
let ki = null;
let Lo = false;
let Ri = null;
const ys = 1852;
const xs = 1293;
let At = ys / xs;
let ve = null;
let camera = null;
let renderer = null;
let Q = null;
let B = null;
let Ia = null;
let Mc = null;
let eo = null;
let Io = null;
let se = null;
let Rn = null;
let Dn = null;
let Ut = null;
let hn = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let bt = null;
let vs = null;
try {
  if (typeof BroadcastChannel == "function") {
    vs = new BroadcastChannel("ha-bridge-studio3d-base-lighting-v1");
  }
} catch {}
let To = true;
let Ta = false;
let Ca = null;
let Fn = null;
let Mt = false;
let Di = false;
let Fi = false;
let un = 0;
let Zt = false;
let Kt = false;
let Sc = new Map();
let ka = new Map();
let Ai = 0;
let Gi = 0;
let _e = false;
let Ra = false;
let lt = false;
let Da = null;
let Qt = false;
let bs = false;
let Pc = "";
let Ms = 0;
let Fa = [];
let Co = 0;
let Aa = 0;
let Ec = null;
const Lc = new WeakSet();
let $i = false;
let zi = false;
let Ss = 0;
let Ps = null;
let Es = false;
let Ga = false;
let Ic = "";
let Tc = 0;
let Ls = null;
function Is() {
  return {
    schemaVersion: 2,
    background: null,
    calibration: null,
    settings: {
      wallHeight: 2.4,
      wallThickness: 0.15,
      wallOpacity: ua.wallOpacity,
      floorEdgeVisible: true,
      planViewRotation: 0,
      cameraView: "free",
      cameraTopRotation: 0,
      cameraMode: "perspective",
      cameraFocalLength: 50,
      fixedCameraView: null,
      livePreviewEnabled: true,
      backgroundVisible: true,
      snapEnabled: true,
      snapEndpoints: true,
      snapIntersections: true,
      snapSegments: true,
      snapOrthogonal: true,
      snapAngles: true,
      snapGrid: true,
      snapTolerance: 13,
      previewPanelRatio: 0.52,
      detailsPanelWidthRatio: 0.29,
    },
    walls: [],
    windows: [],
    doors: [],
    railings: [],
    lightGroups: [
      {
        id: "light-group-default",
        name: "默认灯组",
        enabled: true,
      },
    ],
    items: [],
  };
}
function Ts(value) {
  return (
    [
      "一层",
      "二层",
      "三层",
      "四层",
      "五层",
      "六层",
      "七层",
      "八层",
      "九层",
      "十层",
    ][value] || value + 1 + "层"
  );
}
function Cc(value = 0, value2 = Is()) {
  const scene = Rs(value2);
  const value3 = clamp(finite(T?.defaultFloorHeight, 3), 1.8, 8);
  return {
    id: Ce("floor"),
    name: Ts(value),
    elevation: value * value3,
    offsetX: 0,
    offsetZ: 0,
    rotation: 0,
    originX: scene.background?.width ? scene.background.width / 2 : 0,
    originY: scene.background?.height ? scene.background.height / 2 : 0,
    originInitialized: !!scene.background,
    aligned: value === 0,
    alignmentPending: value > 0,
    scene: scene,
  };
}
function Cs(value) {
  const list = Array.isArray(value?.floors) ? value.floors : null;
  const floors = list?.length
    ? list.map((value5, value6) => {
        const scene = Rs(value5?.scene);
        const value7 = value5?.originInitialized === true;
        const labelText = normalizeLabelText(value5?.name, Ts(value6), 24);
        const name = labelText === value6 + 1 + "层" ? Ts(value6) : labelText;
        return {
          id: String(value5?.id || Ce("floor")),
          name: name,
          elevation: clamp(finite(value5?.elevation, value6 * 3), -30, 120),
          offsetX: clamp(finite(value5?.offsetX, 0), -100, 100),
          offsetZ: clamp(finite(value5?.offsetZ, 0), -100, 100),
          rotation: clamp(finite(value5?.rotation, 0), -180, 180),
          originX: value7
            ? finite(value5?.originX, 0)
            : scene.background?.width
              ? scene.background.width / 2
              : 0,
          originY: value7
            ? finite(value5?.originY, 0)
            : scene.background?.height
              ? scene.background.height / 2
              : 0,
          originInitialized: value7 || !!scene.background,
          aligned:
            value6 === 0 ||
            value5?.aligned === true ||
            Math.abs(finite(value5?.offsetX, 0)) > 0.000001 ||
            Math.abs(finite(value5?.offsetZ, 0)) > 0.000001,
          alignmentPending: value5?.alignmentPending === true,
          scene: scene,
        };
      })
    : [Cc(0, value)];
  const text = String(value?.activeFloorId || "");
  const value2 = floors.find((value5) => value5.id === text) || floors[0];
  const value3 = clamp(finite(value?.defaultFloorHeight, 3), 0, 20);
  const value4 = finite(value?.schemaVersion, 0) >= 6;
  const exportPresets = normalizeExportPresetSlots(value?.exportPresets);
  return {
    schemaVersion: 7,
    activeFloorId: value2.id,
    defaultFloorHeight: clamp(finite(value?.defaultFloorHeight, 3), 1.8, 8),
    previewFloorGap: clamp(
      value4
        ? finite(value?.previewFloorGap, 3)
        : value3 + finite(value?.previewFloorGap, 0),
      0,
      20,
    ),
    exportFloorGap: clamp(
      value4
        ? finite(value?.exportFloorGap, 3)
        : value3 + finite(value?.exportFloorGap, 0),
      0,
      20,
    ),
    previewFloorMode: value?.previewFloorMode === "all" ? "all" : "active",
    combinedCameraSettings: normalizeCameraSettings(
      value?.combinedCameraSettings,
    ),
    combinedFixedCameraView: normalizeFixedCameraView(
      value?.combinedFixedCameraView,
    ),
    baseLighting: normalizeBaseLighting(value?.baseLighting),
    exportPresets: exportPresets,
    activeExportPresetSlot: normalizeActiveExportPresetSlot(
      value?.activeExportPresetSlot,
      exportPresets.length,
    ),
    floors: floors,
  };
}
function Te() {
  const value = W?.selectedFloorId || xe;
  return (
    T?.floors.find((value2) => value2.id === value) || T?.floors[0] || null
  );
}
function kc() {
  return structuredClone(T || Cs(scene));
}
function Rc() {
  const value = kc();
  if (!W) {
    return value;
  }
  value.previewFloorMode = W.floorMode;
  for (const value2 of value.floors || []) {
    const value3 = W.floorCameraSettings.get(value2.id);
    if (value3) {
      value2.scene.settings.cameraMode = value3.mode;
      value2.scene.settings.cameraView = value3.view;
      value2.scene.settings.cameraTopRotation = value3.topRotation;
      value2.scene.settings.cameraFocalLength = value3.focalLength;
    }
  }
  value.combinedCameraSettings = {
    ...W.combinedCameraSettings,
  };
  return value;
}
function Dc(value, value2 = "") {
  const allowed = new Set(
    (T?.floors || [])
      .filter((value4) => value4.id !== value2)
      .map((value4) => value4.name),
  );
  if (!allowed.has(value)) {
    return value;
  }
  let value3 = 2;
  while (allowed.has(value + " " + value3)) {
    value3 += 1;
  }
  return value + " " + value3;
}
function Fc() {
  yn.hidden = true;
  qn = "";
}
function vu(value, value2) {
  qn = value.id;
  const element = yn.querySelector('[data-floor-action="delete"]');
  element.disabled = T.floors.length <= 1;
  yn.hidden = false;
  yn.style.left = Math.min(value2.clientX, window.innerWidth - 116) + "px";
  yn.style.top = Math.min(value2.clientY, window.innerHeight - 82) + "px";
}
function bu(value) {
  if (!!value && !(T.floors.length <= 1)) {
    ds = value.id;
    Z0.textContent = value.name;
    si.showModal();
  }
}
function Bi() {
  ds = "";
  if (si.open) {
    si.close();
  }
}
async function Mu() {
  const value = T.floors.find((value4) => value4.id === ds);
  Bi();
  if (!value || T.floors.length <= 1) {
    return;
  }
  const value2 = T.floors.findIndex((value4) => value4.id === value.id);
  T.floors.splice(value2, 1);
  T.floors.forEach((value4, value5) => {
    value4.elevation = value5 * T.defaultFloorHeight;
  });
  const value3 = T.floors[Math.max(0, value2 - 1)] || T.floors[0];
  await Wi(value3.id, {
    persist: false,
  });
  Yo();
  V();
  _("已删除“" + value.name + "”。", "success");
}
function Su(value) {
  if (value) {
    qn = value.id;
    Cr.value = value.name;
    Tr.showModal();
    requestAnimationFrame(() => Cr.select());
  }
}
function Oi() {
  if (T) {
    Ir.replaceChildren();
    for (const value of T.floors) {
      const element = document.createElement("div");
      element.className =
        "floor-row" +
        (value.id === xe ? " active" : "") +
        (value.aligned ? "" : " unaligned");
      element.dataset.floorId = value.id;
      element.draggable = true;
      element.setAttribute(
        "aria-label",
        value.name +
          "，" +
          (value.id === xe ? "当前楼层，" : "") +
          "长按拖动排序，右键可重命名或删除",
      );
      let value2 = false;
      let value3 = null;
      const fn9 = () => {
        if (value3) {
          clearTimeout(value3);
        }
        value3 = null;
        value2 = false;
        element.classList.remove("drag-ready");
      };
      element.addEventListener("pointerdown", (value5) => {
        if (value5.button === 0 && !value5.target.closest("button")) {
          fn9();
          value3 = setTimeout(() => {
            value3 = null;
            value2 = true;
            element.classList.add("drag-ready");
          }, 280);
        }
      });
      element.addEventListener("pointerup", fn9);
      element.addEventListener("pointercancel", fn9);
      element.addEventListener("dragstart", (event) => {
        if (!value2) {
          event.preventDefault();
          fn9();
          return;
        }
        In = value.id;
        element.classList.remove("drag-ready");
        element.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-floor", value.id);
      });
      element.addEventListener("dragend", () => {
        In = "";
        element.classList.remove("dragging");
        fn9();
        ks();
      });
      element.addEventListener("dragover", (event) => {
        if (!In || In === value.id) {
          return;
        }
        event.preventDefault();
        ks();
        const value5 =
          event.clientY >=
          element.getBoundingClientRect().top +
            element.getBoundingClientRect().height / 2;
        element.dataset.dropPosition = value5 ? "after" : "before";
        element.classList.add(value5 ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      element.addEventListener("drop", (event) => {
        if (!In || In === value.id) {
          return;
        }
        event.preventDefault();
        const value5 = In;
        const value6 = element.dataset.dropPosition === "after";
        In = "";
        ks();
        Pu(value5, value.id, value6);
      });
      const element2 = document.createElement("button");
      element2.type = "button";
      element2.textContent = value.id === xe ? "●" : "○";
      element2.title = "切换到" + value.name;
      element2.addEventListener("click", (event) => {
        event.stopPropagation();
        Wi(value.id, {
          persist: true,
        });
      });
      const element3 = document.createElement("span");
      element3.textContent = value.name;
      element3.title = "长按后拖动可调整楼层顺序，右键可重命名或删除楼层";
      const element4 = document.createElement("small");
      const value4 = T.floors.findIndex((value5) => value5.id === value.id);
      element4.textContent =
        value4 === 0 ? "基准" : value.aligned ? "已对齐" : "待对齐";
      element.addEventListener("click", () => {
        Wi(value.id, {
          persist: true,
        });
      });
      element.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        vu(value, event);
      });
      element.append(element2, element3, element4);
      Ir.append(element);
    }
    to();
  }
}
function ks() {
  for (const element of Ir.querySelectorAll(".floor-row")) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
}
function Pu(value, value2, value3) {
  const value4 = reorderFloors(
    T.floors,
    value,
    value2,
    value3,
    T.defaultFloorHeight,
  );
  if (value4 === T.floors) {
    return;
  }
  const value5 = T.floors.find((value6) => value6.id === value);
  T.floors = value4;
  Oi();
  Yo();
  to();
  qe({
    force: true,
  });
  V();
  if (value5) {
    _("已调整“" + value5.name + "”的楼层顺序。", "success");
  }
}
function to() {
  const value = Te();
  const value2 = value
    ? T.floors.findIndex((value4) => value4.id === value.id)
    : -1;
  const value3 = T.floors.length > 1 && value2 > 0;
  ri.hidden = !value3;
  ri.disabled = !value3 || !value?.scene?.calibration;
  ri.textContent = value?.aligned ? "重新对齐" : "对齐楼层";
  if (ue?.stage === "reference") {
    Rr.textContent = "楼层对齐 · 参照层";
    Dr.textContent =
      "点击" + ue.referenceFloor.name + "上的楼梯角、墙角或柱点；Esc 取消";
  } else if (ue?.stage === "current") {
    Rr.textContent = "楼层对齐 · 当前层";
    Dr.textContent =
      "点击" + value.name + "上的相同位置；系统会自动重合上下楼层";
  }
}
async function Wi(value, { persist: value2 = false } = {}) {
  const value3 = T?.floors.find((value6) => value6.id === value);
  if (!value3) {
    return;
  }
  const value4 = ++cs;
  const value5 = fe() === "all" ? nl() : null;
  if (ue?.floorId !== value3.id) {
    ue = null;
  }
  xe = value3.id;
  T.activeFloorId = value3.id;
  scene = value3.scene;
  ut = "";
  Gt();
  qo();
  ft = null;
  Dt = [];
  Qn = [];
  $.rotation = scene.settings.planViewRotation;
  Promise.allSettled(gc());
  await tr();
  if (value4 === cs && xe === value3.id) {
    ye();
    to();
    oo();
    requestAnimationFrame(() => {
      if (value4 === cs && xe === value3.id) {
        if (fe() === "all") {
          if (value5) {
            uo(value5, value5.viewportAspect);
          }
          ro(Pt());
          so(gt());
          return;
        }
        if (scene.settings.fixedCameraView) {
          rr({
            recordChange: false,
            silent: true,
          });
          return;
        }
        Wt(Pt(), {
          preserveView: false,
        });
        pn();
      }
    });
    if (value2) {
      V();
    }
  }
}
async function Eu() {
  const value = Cc(T.floors.length);
  value.name = Dc(value.name);
  T.floors.push(value);
  Yo();
  await Wi(value.id, {
    persist: false,
  });
  V();
  _("已新增“" + value.name + "”，导入并校准后会设置上下层参照点。", "success");
  Bt("select");
}
function Ac(value, value2) {
  const value3 = value?.scene?.calibration?.pixelsPerMeter || 1;
  const value4 = (value2.x - finite(value?.originX, 0)) / value3;
  const value5 = (value2.y - finite(value?.originY, 0)) / value3;
  const value6 = -THREE.MathUtils.degToRad(finite(value?.rotation, 0));
  return {
    x:
      finite(value?.offsetX, 0) +
      Math.cos(value6) * value4 +
      Math.sin(value6) * value5,
    z:
      finite(value?.offsetZ, 0) -
      Math.sin(value6) * value4 +
      Math.cos(value6) * value5,
  };
}
function Lu(value, value2) {
  const value3 = value?.scene?.calibration?.pixelsPerMeter || 1;
  const value4 = -THREE.MathUtils.degToRad(finite(value?.rotation, 0));
  const value5 = value2.x - finite(value?.offsetX, 0);
  const value6 = value2.z - finite(value?.offsetZ, 0);
  return {
    x:
      finite(value?.originX, 0) +
      (Math.cos(value4) * value5 - Math.sin(value4) * value6) * value3,
    y:
      finite(value?.originY, 0) +
      (Math.sin(value4) * value5 + Math.cos(value4) * value6) * value3,
  };
}
function Hi(value, value2, value3) {
  return Lu(value3, Ac(value2, value));
}
function Gc() {
  if (!ue) {
    return [];
  }
  const value = Te();
  return ue.referenceFloor.scene.walls.map((value2) => ({
    ...value2,
    start: Hi(value2.start, ue.referenceFloor, value),
    end: Hi(value2.end, ue.referenceFloor, value),
  }));
}
function $c() {
  const value = Te();
  const value2 = T?.floors.findIndex((value3) => value3.id === value?.id) ?? -1;
  const referenceFloor = value2 > 0 ? T.floors[value2 - 1] : null;
  if (!!value && !!referenceFloor) {
    if (!value.scene.calibration || !referenceFloor.scene.calibration) {
      _("当前层和参照层都需要先完成比例校准。", "error");
      return;
    }
    ue = {
      floorId: value.id,
      referenceFloor: referenceFloor,
      stage: "reference",
      referencePoint: null,
    };
    Gt();
    Bt("select");
    ie.style.cursor = "crosshair";
    to();
    ae();
    _("先在半透明的" + referenceFloor.name + "上点击一个参照点。");
  }
}
function zc() {
  if (ue) {
    ue = null;
    ie.style.cursor = "";
    Bt("select");
    to();
    ae();
    _("已取消楼层对齐。", "success");
  }
}
function Iu(value) {
  if (!ue) {
    return false;
  }
  const value2 = Te();
  if (!value2 || value2.id !== ue.floorId) {
    zc();
    return true;
  }
  if (ue.stage === "reference") {
    const value5 = Gc();
    const value6 = nearestWall(value, value5, 18 / $.zoom)?.point || value;
    ue.referencePoint = Hi(value6, value2, ue.referenceFloor);
    ue.stage = "current";
    to();
    ae();
    _("现在点击" + value2.name + "上的同一个位置。");
    return true;
  }
  const value3 =
    nearestWall(value, value2.scene.walls, 18 / $.zoom)?.point || value;
  const value4 = Ac(ue.referenceFloor, ue.referencePoint);
  value2.originX = value3.x;
  value2.originY = value3.y;
  value2.originInitialized = true;
  value2.offsetX = value4.x;
  value2.offsetZ = value4.z;
  value2.rotation = ue.referenceFloor.rotation || 0;
  value2.aligned = true;
  value2.alignmentPending = false;
  value2.alignment = {
    referenceFloorId: ue.referenceFloor.id,
    referencePoint: {
      ...ue.referencePoint,
    },
    currentPoint: {
      ...value3,
    },
  };
  ue = null;
  ie.style.cursor = "";
  Bt("select");
  Oi();
  ae();
  qe({
    force: true,
  });
  V();
  _(value2.name + "已与下层参照点对齐。", "success");
  return true;
}
function Tu() {
  const value = clamp(finite(ui.value, T?.previewFloorGap || 3), 0, 20);
  if (!(Math.abs(value - finite(T?.previewFloorGap, 3)) < 0.000001)) {
    T.previewFloorGap = value;
    ui.value = value.toFixed(1);
    Lt();
    V();
  }
}
function Cu() {
  const value = clamp(finite(ca.value, T?.exportFloorGap || 3), 0, 20);
  if (!(Math.abs(value - finite(T?.exportFloorGap, 3)) < 0.000001)) {
    T.exportFloorGap = value;
    ca.value = value.toFixed(1);
    Lt();
    pe.textContent = "全楼层间距已设为 " + value.toFixed(1) + " m";
    V();
  }
}
function Bc(value, value2, value3, value4, value5 = []) {
  const value6 = splitWallSegments(value);
  const index = new Map();
  const walls = [];
  for (const value9 of value6) {
    const wall = {
      ...value9.sourceWall,
      id: value9.pieceIndex === 0 ? value9.sourceWall.id : Ce("wall"),
      start: value9.start,
      end: value9.end,
    };
    const value10 = {
      ...value9,
      wall: wall,
    };
    if (!index.has(value9.sourceWall.id)) {
      index.set(value9.sourceWall.id, []);
    }
    index.get(value9.sourceWall.id).push(value10);
    walls.push(wall);
  }
  const value8 = (value9) => {
    const value10 = index.get(value9.wallId);
    if (!value10?.length) {
      return value9;
    }
    const value11 = clamp(finite(value9.t, 0.5), 0, 1);
    const value12 =
      value10.find(
        (value14) =>
          value11 >= value14.startT - 1e-7 && value11 <= value14.endT + 1e-7,
      ) || value10.at(-1);
    const count = Math.max(value12.endT - value12.startT, 1e-7);
    const value13 = {
      ...value9,
      wallId: value12.wall.id,
      t: clamp((value11 - value12.startT) / count, 0, 1),
    };
    value13.t = clampWindowT(value12.wall, value13, value4 || 1);
    return value13;
  };
  return {
    walls: walls,
    windows: value2.map(value8),
    doors: value3.map(value8),
    railings: value5.map(value8),
  };
}
function Rs(value) {
  const value2 = Is();
  if (!value || typeof value != "object") {
    return value2;
  }
  const value3 = finite(value.schemaVersion, 0);
  const pixelsPerMeter = clamp(
    finite(value.calibration?.pixelsPerMeter, 0),
    0,
    100000,
  );
  const calibration =
    pixelsPerMeter > 0
      ? {
          pixelsPerMeter: pixelsPerMeter,
          reference: value.calibration?.reference
            ? {
                start: normalizePoint(value.calibration.reference.start),
                end: normalizePoint(value.calibration.reference.end),
                meters: clamp(
                  finite(value.calibration.reference.meters, 1),
                  0.01,
                  1000,
                ),
              }
            : null,
        }
      : null;
  const list = Array.isArray(value.walls)
    ? value.walls
        .map((value7) => ({
          id: String(value7?.id || Ce("wall")),
          start: normalizePoint(value7?.start),
          end: normalizePoint(value7?.end),
          height: clamp(
            finite(value7?.height, value.settings?.wallHeight || 2.8),
            0.01,
            6,
          ),
          thickness: clamp(
            finite(value7?.thickness, value.settings?.wallThickness || 0.12),
            0.01,
            3,
          ),
          opacity:
            value7?.opacity === null ||
            value7?.opacity === undefined ||
            value7?.opacity === ""
              ? null
              : clamp(
                  finite(
                    value7.opacity,
                    value.settings?.wallOpacity ?? ua.wallOpacity,
                  ),
                  0,
                  1,
                ),
          allowOpenEnd: value7?.allowOpenEnd === true,
        }))
        .filter((value7) => distance(value7.start, value7.end) > 0.1)
    : [];
  const allowed = new Set(list.map((value7) => value7.id));
  const list2 = Array.isArray(value.windows)
    ? value.windows
        .map((value7) => ({
          id: String(value7?.id || Ce("window")),
          wallId: String(value7?.wallId || ""),
          t: clamp(finite(value7?.t, 0.5), 0, 1),
          width: clamp(finite(value7?.width, 1.4), 0.3, 20),
          height: clamp(finite(value7?.height, 1.35), 0.3, 20),
          sill: clamp(finite(value7?.sill, 0.85), 0, 20),
          hasDivider: value7?.hasDivider !== false,
        }))
        .filter((value7) => allowed.has(value7.wallId))
    : [];
  const list3 = Array.isArray(value.doors)
    ? value.doors
        .map((value7) => ({
          id: String(value7?.id || Ce("door")),
          wallId: String(value7?.wallId || ""),
          t: clamp(finite(value7?.t, 0.5), 0, 1),
          width: clamp(finite(value7?.width, 0.9), 0.55, 20),
          height: clamp(finite(value7?.height, 2.1), 1.8, 20),
          sill: 0,
          doorType: Object.hasOwn(Sn, value7?.doorType)
            ? value7.doorType
            : "solid",
          hinge: value7?.hinge === "right" ? "right" : "left",
          swing: value7?.swing === -1 ? -1 : 1,
        }))
        .filter((value7) => allowed.has(value7.wallId))
    : [];
  const list4 = Array.isArray(value.railings)
    ? value.railings
        .map((value7) => ({
          id: String(value7?.id || Ce("railing")),
          wallId: String(value7?.wallId || ""),
          t: clamp(finite(value7?.t, 0.5), 0, 1),
          width: clamp(finite(value7?.width, 2), 0.3, 20),
          height: clamp(finite(value7?.height, 1.1), 0.5, 3),
          sill: 0,
        }))
        .filter((value7) => allowed.has(value7.wallId))
    : [];
  const lightGroups = [];
  const allowed2 = new Set();
  if (Array.isArray(value.lightGroups)) {
    for (const value7 of value.lightGroups) {
      const id2 = String(value7?.id || Ce("light-group"));
      if (!allowed2.has(id2)) {
        allowed2.add(id2);
        lightGroups.push({
          id: id2,
          name: normalizeLabelText(
            value7?.name,
            "灯组 " + (lightGroups.length + 1),
            24,
          ),
          enabled: value7?.enabled !== false,
        });
      }
    }
  }
  const fn9 = (value7 = "默认灯组") => {
    const name = normalizeLabelText(value7, "默认灯组", 24);
    const value8 = lightGroups.find((value10) => value10.name === name);
    if (value8) {
      return value8;
    }
    const value9 = {
      id: Ce("light-group"),
      name: name,
      enabled: true,
    };
    lightGroups.push(value9);
    allowed2.add(value9.id);
    return value9;
  };
  if (!lightGroups.length) {
    lightGroups.push({
      id: "light-group-default",
      name: "默认灯组",
      enabled: true,
    });
    allowed2.add("light-group-default");
  }
  let value4 = 0;
  let value5 = 0;
  const items = Array.isArray(value.items)
    ? value.items
        .filter(
          (value7) => !["smallseat", "entrydoor", "car"].includes(value7?.type),
        )
        .map((value7) => {
          const value8 = xt[value7?.type] || xt.table;
          const value9 = clamp(finite(value7?.width, value8.width), 0.1, 8);
          const value10 = clamp(finite(value7?.depth, value8.depth), 0.1, 8);
          const value11 =
            value3 < 2 && value7?.type === "striplight" && value10 > value9;
          const fullRotation = normalizeFullRotation(
            finite(value7?.rotation) + (value11 ? 90 : 0),
          );
          const value13 = clamp(
            finite(value7?.height, value8.height),
            itemMinimumHeight(value7?.type),
            6,
          );
          const value14 =
            value7?.type === "desktop" &&
            Math.abs(value9 - 1.2) < 0.01 &&
            Math.abs(value10 - 0.65) < 0.01;
          const value15 =
            value7?.type === "plant" &&
            Math.abs(value9 - 0.6) < 0.01 &&
            Math.abs(value10 - 0.6) < 0.01 &&
            Math.abs(value13 - 1.15) < 0.01;
          const value16 =
            value7?.type === "toilet" &&
            Math.abs(value9 - 0.7) < 0.01 &&
            Math.abs(value10 - 0.42) < 0.01;
          const value17 =
            value7?.type === "floorlamp" &&
            Math.abs(value9 - 0.9) < 0.01 &&
            Math.abs(value10 - 0.45) < 0.01 &&
            Math.abs(value13 - 1.8) < 0.01;
          const value18 = value7?.type === "rug" && value13 >= 0.045;
          const value19 =
            value7?.type === "downlight" && value9 < 0.3 && value10 < 0.3;
          const value20 = value7?.type === "piano" && value10 < 1;
          const value21 = Rt[value7?.type] || Rt.downlight;
          const lightGroupId = re.has(value7?.type)
            ? allowed2.has(String(value7?.lightGroupId || ""))
              ? String(value7.lightGroupId)
              : fn9(value7?.lightGroup || "默认灯组").id
            : "";
          const value22 = value7?.type === "tv" ? ++value4 : 0;
          const value23 = value7?.type === "smallcar" ? ++value5 : 0;
          return {
            id: String(value7?.id || Ce("item")),
            type:
              value7?.type === "rounddiningtableturntable"
                ? "rounddiningtable"
                : xt[value7?.type]
                  ? value7.type
                  : "table",
            x: finite(value7?.x),
            y: finite(value7?.y),
            rotation:
              value7?.type === "striplight"
                ? fullRotation
                : finite(value7?.rotation),
            width:
              value7?.type === "striplight"
                ? Math.max(value9, value10)
                : value14 || value15 || value17 || value16 || value19 || value20
                  ? value8.width
                  : value9,
            depth:
              value7?.type === "striplight"
                ? Math.min(value9, value10)
                : value14 || value15 || value17 || value16 || value19 || value20
                  ? value8.depth
                  : value10,
            height:
              (value7?.type === "sideboard" && value13 < 1.4) ||
              value14 ||
              value15 ||
              value16 ||
              value18 ||
              value20
                ? value8.height
                : value13,
            elevation: clamp(
              finite(value7?.elevation, value8.elevation || 0),
              0,
              6,
            ),
            color:
              value7?.type === "pillar"
                ? value8.color
                : /^#[0-9a-f]{6}$/i.test(value7?.color || "")
                  ? value7.color
                  : value8.color,
            ...(value7?.type === "planlabel"
              ? {
                  title: normalizeLabelText(value7?.title, "家庭总览", 24),
                  subtitle: normalizeLabelText(
                    value7?.subtitle,
                    "HOME PLAN",
                    36,
                  ),
                  titleSpacing: clamp(
                    finite(value7?.titleSpacing, 1.05),
                    0,
                    1.8,
                  ),
                  subtitleSpacing: clamp(
                    finite(value7?.subtitleSpacing, 0.08),
                    0,
                    0.6,
                  ),
                  lineLength: clamp(finite(value7?.lineLength, 0.86), 0.3, 1),
                }
              : {}),
            ...(value7?.type === "tv"
              ? {
                  screenEnabled: value7?.screenEnabled !== false,
                  screenLayerName: normalizeLabelText(
                    value7?.screenLayerName,
                    "电视画面 " + value22,
                    24,
                  ),
                  tvMountStyle: fa.has(value7?.tvMountStyle)
                    ? value7.tvMountStyle
                    : "standard",
                }
              : {}),
            ...(value7?.type === "smallcar"
              ? {
                  chargingEnabled: value7?.chargingEnabled === true,
                  chargingLayerName: normalizeLabelText(
                    value7?.chargingLayerName,
                    "汽车充电 " + value23,
                    24,
                  ),
                }
              : {}),
            ...(value7?.type === "curtain"
              ? {
                  curtainPosition: ["left", "right", "split"].includes(
                    value7?.curtainPosition,
                  )
                    ? value7.curtainPosition
                    : "split",
                }
              : {}),
            ...(xo.has(value7?.type)
              ? {
                  stairDirection: ["left", "right"].includes(
                    value7?.stairDirection,
                  )
                    ? value7.stairDirection
                    : "right",
                }
              : {}),
            ...(value7?.type === "shoecabinet"
              ? {
                  shoeCabinetMirrored: value7?.shoeCabinetMirrored === true,
                }
              : {}),
            ...(Mn.has(value7?.type)
              ? {
                  roundTableTurntable:
                    value7?.type === "rounddiningtableturntable" ||
                    value7?.roundTableTurntable === true,
                }
              : {}),
            ...(re.has(value7?.type)
              ? {
                  lightGroupId: lightGroupId,
                  verticalRotation:
                    value7?.type === "striplight"
                      ? normalizeFullRotation(value7?.verticalRotation)
                      : clamp(finite(value7?.verticalRotation, 0), -90, 90),
                  ...(value7?.type === "striplight"
                    ? {
                        stripRollRotation: normalizeFullRotation(
                          value7?.stripRollRotation,
                        ),
                        lightSourceVisible:
                          value7?.lightSourceVisible !== false,
                      }
                    : {}),
                  lightTemperature: clamp(
                    finite(value7?.lightTemperature, value21.temperature),
                    2200,
                    6500,
                  ),
                  lightBrightness: clamp(
                    finite(value7?.lightBrightness, value21.brightness),
                    0,
                    100,
                  ),
                  lightRange: clamp(
                    finite(value7?.lightRange, value21.range),
                    0.5,
                    10,
                  ),
                  lightAngle: clamp(
                    finite(value7?.lightAngle, value21.angle),
                    15,
                    vo(value7?.type),
                  ),
                }
              : {}),
          };
        })
    : [];
  const background =
    value.background?.assetId && value.background?.url
      ? {
          assetId: String(value.background.assetId),
          url: String(value.background.url),
          name: String(value.background.name || "户型底图"),
          width: clamp(finite(value.background.width, 1), 1, 8192),
          height: clamp(finite(value.background.height, 1), 1, 8192),
        }
      : null;
  const value6 = Bc(list, list2, list3, pixelsPerMeter, list4);
  return {
    schemaVersion: 2,
    background: background,
    calibration: calibration,
    settings: {
      wallHeight: clamp(finite(value.settings?.wallHeight, 2.8), 0.01, 6),
      wallThickness: clamp(
        finite(value.settings?.wallThickness, 0.12),
        0.01,
        3,
      ),
      wallOpacity: clamp(
        finite(value.settings?.wallOpacity, ua.wallOpacity),
        0,
        1,
      ),
      floorEdgeVisible: value.settings?.floorEdgeVisible !== false,
      planViewRotation:
        (((Math.round(finite(value.settings?.planViewRotation, 0) / 90) * 90) %
          360) +
          360) %
        360,
      cameraView: value.settings?.cameraView === "top" ? "top" : "free",
      cameraTopRotation:
        (((Math.round(finite(value.settings?.cameraTopRotation, 0) / 90) * 90) %
          360) +
          360) %
        360,
      cameraMode:
        value.settings?.cameraMode === "orthographic"
          ? "orthographic"
          : "perspective",
      cameraFocalLength: clamp(
        finite(value.settings?.cameraFocalLength, 50),
        18,
        120,
      ),
      fixedCameraView: normalizeFixedCameraView(
        value.settings?.fixedCameraView,
      ),
      livePreviewEnabled: value.settings?.livePreviewEnabled !== false,
      backgroundVisible: value.settings?.backgroundVisible !== false,
      snapEnabled: value.settings?.snapEnabled !== false,
      snapEndpoints: value.settings?.snapEndpoints !== false,
      snapIntersections: value.settings?.snapIntersections !== false,
      snapSegments: value.settings?.snapSegments !== false,
      snapOrthogonal: value.settings?.snapOrthogonal !== false,
      snapAngles: value.settings?.snapAngles !== false,
      snapGrid: value.settings?.snapGrid !== false,
      snapTolerance: clamp(
        Math.round(finite(value.settings?.snapTolerance, 13)),
        6,
        24,
      ),
      previewPanelRatio: clamp(
        finite(value.settings?.previewPanelRatio, 0.52),
        0.06,
        0.94,
      ),
      detailsPanelWidthRatio: clamp(
        finite(value.settings?.detailsPanelWidthRatio, 0.29),
        0.08,
        0.86,
      ),
    },
    walls: value6.walls,
    windows: value6.windows,
    doors: value6.doors,
    railings: value6.railings,
    lightGroups: lightGroups,
    items: items,
  };
}
function Ce(value) {
  const value2 =
    globalThis.crypto?.randomUUID?.() ||
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return value + "-" + value2;
}
function An(value = scene) {
  return structuredClone(value);
}
function Vi(value) {
  return (
    scene.lightGroups?.find((value2) => value2.id === value?.lightGroupId) ||
    scene.lightGroups?.[0] ||
    null
  );
}
function ku(value, value2 = scene) {
  return (
    value2?.lightGroups?.find((value3) => value3.id === value?.lightGroupId) ||
    value2?.lightGroups?.[0] ||
    null
  );
}
function Ds(value) {
  if (Yn !== null) {
    return Yn.has(value.id);
  } else if (Vi(value)?.enabled === false) {
    return false;
  } else {
    return W || Di || !Ye();
  }
}
function Ni() {
  return scene.items.filter((value) => value.type === "tv");
}
function Xi() {
  return scene.items.filter((value) => value.type === "smallcar");
}
function _i() {
  if (fe() === "all") {
    return T.floors;
  } else {
    return [Te()].filter(Boolean);
  }
}
function Oc(value) {
  if (fe() !== "all") {
    return 0;
  }
  const value2 = T.floors.findIndex((value3) => value3.id === value?.id);
  return Math.max(value2, 0) * finite(T.exportFloorGap, 3);
}
function Wc(value, value2) {
  return value + ":" + value2;
}
function Hc(value, value2) {
  return (value || "floor") + ":" + value2;
}
function Fs(value, value2) {
  if (fe() === "all") {
    return Wc(value, value2);
  } else {
    return value2;
  }
}
function Yi() {
  return (fe() === "all" ? T?.floors || [] : [Te()].filter(Boolean)).flatMap(
    (floor) =>
      floor.scene.items
        .filter((value) => re.has(value.type))
        .map((item) => {
          const group = ku(item, floor.scene);
          return {
            floor: floor,
            item: item,
            group: group,
            itemKey: Hc(floor.id, item.id),
            groupKey: Fs(floor.id, group?.id || "__ungrouped"),
          };
        }),
  );
}
function ko(value = T?.floors || []) {
  return value.flatMap((floor) =>
    floor.scene.lightGroups.map((group, index) => ({
      floor: floor,
      group: group,
      index: index,
      key: Wc(floor.id, group.id),
      lights: floor.scene.items.filter(
        (lights) => re.has(lights.type) && lights.lightGroupId === group.id,
      ),
    })),
  );
}
function Ro(value = T?.floors || []) {
  return value.flatMap((floor) =>
    floor.scene.items
      .filter((value2) => value2.type === "tv")
      .map((item, index) => ({
        floor: floor,
        item: item,
        index: index,
        key: floor.id + ":" + item.id,
      })),
  );
}
function Do(value = T?.floors || []) {
  return value.flatMap((floor) =>
    floor.scene.items
      .filter((value2) => value2.type === "smallcar")
      .map((item, index) => ({
        floor: floor,
        item: item,
        index: index,
        key: floor.id + ":" + item.id,
      })),
  );
}
function Ru(value) {
  const allowed = new Set(Ni().map((value3) => value3.screenLayerName));
  let value2 = 1;
  for (const value3 of value) {
    if (value3.type === "tv") {
      while (allowed.has("电视画面 " + value2)) {
        value2 += 1;
      }
      value3.screenLayerName = "电视画面 " + value2;
      value3.screenEnabled = value3.screenEnabled !== false;
      allowed.add(value3.screenLayerName);
      value2 += 1;
    }
  }
}
function Du(value) {
  const allowed = new Set(Xi().map((value3) => value3.chargingLayerName));
  let value2 = 1;
  for (const value3 of value) {
    if (value3.type === "smallcar") {
      while (allowed.has("汽车充电 " + value2)) {
        value2 += 1;
      }
      value3.chargingLayerName = "汽车充电 " + value2;
      value3.chargingEnabled = value3.chargingEnabled === true;
      allowed.add(value3.chargingLayerName);
      value2 += 1;
    }
  }
}
function qi(value) {
  Ru(value);
  Du(value);
}
function Fo() {
  const value = (scene.lightGroups ||= []);
  if (!value.length) {
    value.push({
      id: Ce("light-group"),
      name: "默认灯组",
      enabled: true,
    });
  }
  if (!value.some((value2) => value2.id === ut)) {
    ut = value[0].id;
  }
  return value.find((value2) => value2.id === ut) || value[0];
}
function Fu(value) {
  const element = f("#light-group");
  element.replaceChildren();
  for (const value2 of scene.lightGroups || []) {
    const element2 = document.createElement("option");
    element2.value = value2.id;
    element2.textContent = value2.name;
    element.append(element2);
  }
  element.value = Vi(value)?.id || Fo().id;
  syncStudioSelect(element);
}
function Ui() {
  bn.hidden = true;
  ss = "";
}
function Au(value, value2) {
  ss = value.id;
  ut = value.id;
  fn();
  const element = bn.querySelector('[data-light-group-action="delete"]');
  element.disabled = scene.lightGroups.length <= 1;
  bn.hidden = false;
  bn.style.left = Math.min(value2.clientX, window.innerWidth - 116) + "px";
  bn.style.top = Math.min(value2.clientY, window.innerHeight - 108) + "px";
}
function Gu(value) {
  if (!value || scene.lightGroups.length <= 1) {
    return;
  }
  te();
  const value2 = scene.lightGroups.find((value3) => value3.id !== value.id);
  const allowed = new Set(
    scene.items
      .filter(
        (value3) => re.has(value3.type) && value3.lightGroupId === value.id,
      )
      .map((value3) => value3.id),
  );
  scene.items = scene.items.filter((value3) => !allowed.has(value3.id));
  scene.lightGroups = scene.lightGroups.filter(
    (value3) => value3.id !== value.id,
  );
  if (X?.kind === "item" && allowed.has(X.id)) {
    X = null;
  }
  he = he.filter((value3) => value3.kind !== "item" || !allowed.has(value3.id));
  if (ut === value.id) {
    ut = value2.id;
  }
  ye("lights");
  V();
  _("已删除“" + value.name + "”及组内 " + allowed.size + " 盏灯。", "success");
}
function $u(value) {
  const allowed = new Set(scene.lightGroups.map((value3) => value3.name));
  if (!allowed.has(value)) {
    return value;
  }
  let value2 = 2;
  while (allowed.has(value + " " + value2)) {
    value2 += 1;
  }
  return value + " " + value2;
}
function zu(value) {
  if (!value) {
    return;
  }
  te();
  const value2 = {
    ...structuredClone(value),
    id: Ce("light-group"),
    name: $u(value.name + " 副本"),
  };
  const value3 = scene.lightGroups.findIndex(
    (value5) => value5.id === value.id,
  );
  scene.lightGroups.splice(value3 + 1, 0, value2);
  const value4 = scene.items
    .filter((value5) => re.has(value5.type) && value5.lightGroupId === value.id)
    .map((value5) => ({
      ...structuredClone(value5),
      id: Ce("item"),
      lightGroupId: value2.id,
    }));
  scene.items.push(...value4);
  ut = value2.id;
  X =
    value4.length === 1
      ? {
          kind: "item",
          id: value4[0].id,
        }
      : null;
  he =
    value4.length > 1
      ? value4.map((value5) => ({
          kind: "item",
          id: value5.id,
        }))
      : [];
  fn();
  ye("lights");
  V();
  _("已复制“" + value.name + "”及组内 " + value4.length + " 盏灯。", "success");
}
function As() {
  for (const element of ha.querySelectorAll(".light-group-row")) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
}
function Bu(value, value2, value3) {
  const value4 = scene.lightGroups.findIndex((value9) => value9.id === value);
  const value5 = scene.lightGroups.findIndex((value9) => value9.id === value2);
  if (value4 < 0 || value5 < 0 || value4 === value5) {
    return;
  }
  const value6 = [...scene.lightGroups];
  const [value7] = value6.splice(value4, 1);
  const value8 = value6.findIndex((value9) => value9.id === value2);
  value6.splice(value8 + (value3 ? 1 : 0), 0, value7);
  if (
    !value6.every(
      (value9, value10) => value9.id === scene.lightGroups[value10]?.id,
    )
  ) {
    te();
    scene.lightGroups = value6;
    fn();
    St();
    V();
  }
}
function fn() {
  ic.hidden = st !== "light";
  if (!ic.hidden) {
    Fo();
    ha.replaceChildren();
    for (const value of scene.lightGroups) {
      const element = document.createElement("div");
      element.className =
        "light-group-row" + (value.id === ut ? " active" : "");
      element.dataset.lightGroupId = value.id;
      element.draggable = true;
      element.setAttribute(
        "aria-label",
        value.name + "，长按拖动排序，右键可重命名、复制或删除",
      );
      let value2 = false;
      let value3 = null;
      const fn9 = () => {
        if (value3) {
          clearTimeout(value3);
        }
        value3 = null;
        value2 = false;
        element.classList.remove("drag-ready");
      };
      element.addEventListener("pointerdown", (value4) => {
        if (value4.button === 0 && !value4.target.closest("button")) {
          fn9();
          value3 = setTimeout(() => {
            value3 = null;
            value2 = true;
            element.classList.add("drag-ready");
          }, 280);
        }
      });
      element.addEventListener("pointerup", fn9);
      element.addEventListener("pointercancel", fn9);
      element.addEventListener("dragstart", (event) => {
        if (!value2) {
          event.preventDefault();
          fn9();
          return;
        }
        Ln = value.id;
        element.classList.remove("drag-ready");
        element.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
          "application/x-ha-bridge-light-group",
          value.id,
        );
      });
      element.addEventListener("dragend", () => {
        Ln = "";
        element.classList.remove("dragging");
        fn9();
        As();
      });
      element.addEventListener("click", () => {
        ut = value.id;
        fn();
      });
      element.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        Au(value, event);
      });
      element.addEventListener("dragover", (event) => {
        if (!Ln || Ln === value.id) {
          return;
        }
        event.preventDefault();
        As();
        const value4 =
          event.clientY >=
          element.getBoundingClientRect().top +
            element.getBoundingClientRect().height / 2;
        element.dataset.dropPosition = value4 ? "after" : "before";
        element.classList.add(value4 ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      element.addEventListener("drop", (event) => {
        if (!Ln || Ln === value.id) {
          return;
        }
        event.preventDefault();
        const value4 = Ln;
        const value5 = element.dataset.dropPosition === "after";
        Ln = "";
        As();
        Bu(value4, value.id, value5);
      });
      const element2 = document.createElement("button");
      element2.type = "button";
      element2.className = value.enabled ? "on" : "";
      element2.textContent = value.enabled ? "◉" : "○";
      element2.title = value.enabled ? "关闭这个灯组" : "开启这个灯组";
      element2.addEventListener("click", (event) => {
        event.stopPropagation();
        te();
        value.enabled = !value.enabled;
        hd([value.id]);
        V();
      });
      const element3 = document.createElement("span");
      element3.className = "light-group-name";
      element3.textContent = value.name;
      element3.title = "长按灯组后拖动排序，右键可重命名、复制或删除";
      const element4 = document.createElement("small");
      element4.textContent = String(
        scene.items.filter(
          (value4) => re.has(value4.type) && value4.lightGroupId === value.id,
        ).length,
      );
      element.append(element2, element3, element4);
      ha.append(element);
    }
    for (const [value, value2] of Ni().entries()) {
      const value3 = document.createElement("div");
      value3.className = "light-group-row tv-screen-layer-row";
      value3.setAttribute(
        "aria-label",
        (value2.screenLayerName || "电视画面 " + (value + 1)) +
          "，可独立开启或关闭",
      );
      const element = document.createElement("button");
      element.type = "button";
      element.className = value2.screenEnabled !== false ? "on" : "";
      element.textContent = value2.screenEnabled !== false ? "◉" : "○";
      element.title =
        value2.screenEnabled !== false ? "关闭电视画面" : "开启电视画面";
      element.addEventListener("click", () => {
        te();
        value2.screenEnabled = value2.screenEnabled === false;
        ye("items");
        V();
      });
      const element2 = document.createElement("span");
      element2.className = "light-group-name";
      element2.textContent =
        value2.screenLayerName || "电视画面 " + (value + 1);
      element2.title = "电视开启画面";
      const element3 = document.createElement("small");
      element3.textContent = "1";
      value3.append(element, element2, element3);
      ha.append(value3);
    }
    for (const [value, value2] of Xi().entries()) {
      const value3 = document.createElement("div");
      value3.className = "light-group-row car-charging-layer-row";
      value3.setAttribute(
        "aria-label",
        (value2.chargingLayerName || "汽车充电 " + (value + 1)) +
          "，可独立开启或关闭",
      );
      const element = document.createElement("button");
      element.type = "button";
      element.className = value2.chargingEnabled === true ? "on" : "";
      element.textContent = value2.chargingEnabled === true ? "◉" : "○";
      element.title =
        value2.chargingEnabled === true
          ? "关闭汽车充电状态"
          : "开启汽车充电状态";
      element.addEventListener("click", () => {
        te();
        value2.chargingEnabled = value2.chargingEnabled !== true;
        ye("items");
        V();
      });
      const element2 = document.createElement("span");
      element2.className = "light-group-name";
      element2.textContent =
        value2.chargingLayerName || "汽车充电 " + (value + 1);
      element2.title = "汽车充电中状态图层";
      const element3 = document.createElement("small");
      element3.textContent = "1";
      value3.append(element, element2, element3);
      ha.append(value3);
    }
  }
}
function Ou(value) {
  const value2 = Ni();
  const value3 = Xi();
  if (
    !(scene.lightGroups || []).every((value4) => value4.enabled === value) ||
    !value2.every((value4) => (value4.screenEnabled !== false) === value) ||
    !value3.every((value4) => (value4.chargingEnabled === true) === value)
  ) {
    te();
    for (const value4 of scene.lightGroups) {
      value4.enabled = value;
    }
    for (const value4 of value2) {
      value4.screenEnabled = value;
    }
    for (const value4 of value3) {
      value4.chargingEnabled = value;
    }
    hd(scene.lightGroups.map((value4) => value4.id));
    if (value2.length || value3.length) {
      qe({
        scope: "items",
        preserveLightCache: true,
      });
    }
    V();
  }
}
function We(value, value2) {
  return (
    (X?.kind === value && X.id === value2) ||
    he.some((value3) => value3.kind === value && value3.id === value2)
  );
}
function Gt() {
  X = null;
  he = [];
}
function $t(kind, id2) {
  X =
    kind && id2
      ? {
          kind: kind,
          id: id2,
        }
      : null;
  he = [];
}
function $a(value) {
  if (re.has(value?.type)) {
    return "lights";
  } else {
    return "items";
  }
}
function Wu(value) {
  if (!value.length || value.some((value3) => value3.kind !== "item")) {
    return "all";
  }
  const allowed = new Set(value.map((value3) => value3.id));
  const value2 = scene.items.filter((value3) => allowed.has(value3.id));
  if (!value2.length) {
    return "all";
  }
  const length = value2.filter((value3) => re.has(value3.type)).length;
  if (length === value2.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function za() {
  return Wu(he.length ? he : X ? [X] : []);
}
function Hu(value) {
  if (!value.length) {
    return null;
  }
  if (value.some((value4) => value4.kind !== "item")) {
    return "all";
  }
  const allowed = new Set(value.map((value4) => value4.id));
  const value2 = scene.items.filter((value4) => allowed.has(value4.id));
  if (!value2.length) {
    return null;
  }
  const value3 = value2.filter(
    (value4) => !re.has(value4.type) || value4.type === "striplight",
  );
  if (!value3.length) {
    return null;
  }
  const length = value3.filter((value4) => re.has(value4.type)).length;
  if (length === value3.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function Ao() {
  return Hu(he.length ? he : X ? [X] : []);
}
function Ba(value) {
  const value2 = Ao();
  const allowed = new Set([value, value2].filter(Boolean));
  if (allowed.size) {
    if (allowed.has("all")) {
      qe({
        scope: "all",
        preserveLightCache: true,
      });
      return;
    }
    for (const scope of allowed) {
      qe({
        scope: scope,
        preserveLightCache: true,
      });
    }
  }
}
function Vu() {
  const value = Bc(
    scene.walls,
    scene.windows,
    scene.doors,
    pixelsPerMeter() || 1,
    scene.railings,
  );
  scene.walls = value.walls;
  scene.windows = value.windows;
  scene.doors = value.doors;
  scene.railings = value.railings;
}
function Vc() {
  const index = new Map(scene.walls.map((value6) => [value6.id, value6]));
  const value2 = mergeCollinearWallSegments(scene.walls, 0.000001);
  if (value2.walls.length === scene.walls.length) {
    return 0;
  }
  const index2 = new Map(value2.walls.map((value6) => [value6.id, value6]));
  const value4 = (value6) => {
    const value7 = value2.wallIdMap.get(value6.wallId);
    const value8 = index.get(value6.wallId);
    const value9 = index2.get(value7);
    if (!value7 || !value8 || !value9) {
      return value6;
    }
    const value10 = remapWallAttachment(value6, value8, value9);
    value10.t = clampWindowT(value9, value10, pixelsPerMeter() || 1);
    return value10;
  };
  const value5 = scene.walls.length - value2.walls.length;
  scene.walls = value2.walls;
  scene.windows = scene.windows.map(value4);
  scene.doors = scene.doors.map(value4);
  scene.railings = scene.railings.map(value4);
  return value5;
}
function pixelsPerMeter() {
  return scene.calibration?.pixelsPerMeter || 0;
}
class Gs extends Error {
  constructor(value, value2, value3) {
    super(value);
    this.status = value2;
    this.payload = value3;
  }
}
async function Go(value, value2 = {}) {
  const response = await fetch("/api/v1" + value, {
    cache: "no-store",
    ...value2,
    headers: value2.body
      ? {
          "Content-Type": "application/json",
          ...(value2.headers || {}),
        }
      : value2.headers,
  });
  const value3 = response.status === 204 ? "" : await response.text();
  let value4 = null;
  if (value3) {
    try {
      value4 = JSON.parse(value3);
    } catch {
      value4 = null;
    }
  }
  if (response.status === 401) {
    window.location.assign(
      "/login?next=" + encodeURIComponent(window.location.pathname),
    );
    const value5 = new Gs("登录状态已失效。", response.status, value4);
    throw window.HABridgeLog?.linkError(value5, response) || value5;
  }
  if (
    response.status === 403 &&
    value4?.detail?.code === "LICENSE_RESTRICTED"
  ) {
    window.location.assign("/license");
    const value5 = new Gs(
      "当前授权无法使用户型图绘制。",
      response.status,
      value4,
    );
    throw window.HABridgeLog?.linkError(value5, response) || value5;
  }
  if (!response.ok) {
    const detail = value4?.detail;
    const value5 = new Gs(
      typeof detail == "string"
        ? detail
        : detail?.message || "请求失败（HTTP " + response.status + "）",
      response.status,
      value4,
    );
    throw window.HABridgeLog?.linkError(value5, response) || value5;
  }
  return value4;
}
function _(value, value2 = "") {
  window.clearTimeout(bc);
  Br.textContent = value;
  Br.className = ("toast visible " + value2).trim();
  bc = window.setTimeout(
    () => {
      Br.className = "toast";
    },
    value2 === "warning" ? 4400 : 2600,
  );
}
function zt(value, value2 = "") {
  Al.className = ("save-state " + value2).trim();
  Al.innerHTML = "<i></i>" + value;
}
function te() {
  Dt.push(An());
  if (Dt.length > 40) {
    Dt.shift();
  }
  Qn = [];
}
function Nu(value) {
  Dt.push(value);
  if (Dt.length > 40) {
    Dt.shift();
  }
  Qn = [];
}
async function Nc(value) {
  scene = Rs(value);
  const value2 = Te();
  if (value2) {
    value2.scene = scene;
  }
  $.rotation = scene.settings.planViewRotation;
  Gt();
  qo();
  await tr();
  ye();
  V();
}
async function Xu() {
  if (!Dt.length) {
    return;
  }
  Qn.push(An());
  const value = Dt.pop();
  await Nc(value);
}
async function _u() {
  if (!Qn.length) {
    return;
  }
  Dt.push(An());
  const value = Qn.pop();
  await Nc(value);
}
function V() {
  ws = false;
  Tn += 1;
  zt("有未保存修改", "saving");
  window.clearTimeout(Cn);
  Cn = window.setTimeout($o, 650);
  Os();
}
async function Xc(value) {
  const value2 = ++bi;
  window.clearTimeout(Pn);
  Pn = null;
  bo = [];
  _n = false;
  window.externalModelLoadsDeferred = false;
  ma = value;
  T = Cs(value.scene);
  jt(T.baseLighting);
  xe = T.activeFloorId;
  if ($e && po !== null) {
    const value6 = T.floors.find((value7) => value7.id === po);
    if (po === "all" && T.floors.length > 1) {
      T.previewFloorMode = "all";
    } else if (value6) {
      T.previewFloorMode = "active";
      T.activeFloorId = value6.id;
      xe = value6.id;
    }
  }
  scene = Te().scene;
  ut = "";
  Gt();
  qo();
  Dt = [];
  Qn = [];
  const value3 = hc();
  const value4 = $e;
  if (value4) {
    Zr = true;
  }
  let value5 = [];
  if (value4) {
    value5 = value3.map((value6) => Qr(value6));
  }
  _n = !value4;
  window.externalModelLoadsDeferred = _n;
  bo = value4 ? [] : value3;
  if (!value4) {
    Kr();
  }
  En();
  Yo();
  to();
  $.rotation = scene.settings.planViewRotation;
  await tr();
  ye(value4 ? "none" : "all");
  if (!value4) {
    Qa(1200);
  }
  if (value4) {
    try {
      const value6 = Promise.allSettled(value5);
      await Promise.race([
        value6,
        new Promise((value7) => window.setTimeout(value7, 3500)),
      ]);
      Promise.allSettled(value5).then(() => {
        if (value2 === bi) {
          mc();
        }
      });
    } finally {
      if (value2 === bi) {
        window.clearTimeout(cn);
        cn = null;
        Zr = false;
        En();
      }
    }
  } else {
    qe({
      force: true,
    });
    Promise.allSettled(value5).then(() => {
      if (value2 === bi) {
        mc();
      }
    });
  }
  zs();
  oo();
  if (!value4) {
    requestAnimationFrame(() => {
      if (_a()) {
        rr({
          recordChange: false,
          silent: true,
        });
      } else {
        Wt(Pt(), {
          preserveView: false,
        });
        pn();
      }
    });
  }
}
function Yu(latest, localScene, targetVersion) {
  jn = {
    latest: latest,
    localScene: localScene,
    targetVersion: targetVersion,
  };
  zt("等待处理保存冲突", "error");
  if (!Jo.open) {
    Jo.showModal();
  }
}
async function $o() {
  if (!ma || hs || jn || Tn === Jn) {
    return;
  }
  hs = true;
  const value = Tn;
  zt("正在保存…", "saving");
  const fn9 = async (value2) =>
    Go("/studio3d", {
      method: "PUT",
      hbLogContext: {
        phase: "studio-save",
      },
      body: JSON.stringify({
        revision: value2.revision,
        scene: Rc(),
      }),
    });
  try {
    try {
      ma = await fn9(ma);
    } catch (error) {
      if (error.status !== 409) {
        throw error;
      }
      const value2 = await Go("/studio3d");
      Yu(value2, Rc(), value);
      return;
    }
    Jn = value;
    if (Tn === Jn) {
      zt("已自动保存", "saved");
    }
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-save",
    });
    zt("保存失败", "error");
    _(error.message || "3D 草稿保存失败。", "error");
  } finally {
    hs = false;
    if (!jn && Tn !== Jn) {
      window.clearTimeout(Cn);
      Cn = window.setTimeout($o, 500);
    }
  }
}
Jo.addEventListener("cancel", (event) => event.preventDefault());
K0.addEventListener("click", async () => {
  const value = jn;
  if (value) {
    jn = null;
    Jo.close();
    try {
      await Xc(value.latest);
      Jn = Tn;
      zt("已加载服务器版本", "saved");
      _("已加载另一页面保存的户型，当前页面没有执行覆盖。", "success");
    } catch (error) {
      zt("载入失败", "error");
      _(error.message || "服务器版本载入失败。", "error");
    }
  }
});
Q0.addEventListener("click", () => {
  const value = jn;
  if (value) {
    T = Cs(value.localScene);
    xe = T.activeFloorId;
    scene = Te().scene;
    ma = value.latest;
    jn = null;
    Jo.close();
    zt("正在确认覆盖…", "saving");
    window.clearTimeout(Cn);
    Cn = window.setTimeout($o, 0);
  }
});
function zo(value) {
  return {
    x: value.x * $.zoom + $.offsetX,
    y: value.y * $.zoom + $.offsetY,
  };
}
function Zi(value) {
  const value2 = Qe / 2;
  const value3 = Je / 2;
  const value4 = (-$.rotation * Math.PI) / 180;
  const value5 = Math.cos(value4);
  const value6 = Math.sin(value4);
  const value7 = value.x - value2;
  const value8 = value.y - value3;
  return {
    x: value2 + value7 * value5 - value8 * value6,
    y: value3 + value7 * value6 + value8 * value5,
  };
}
function no(value) {
  const value2 = Zi(value);
  return {
    x: (value2.x - $.offsetX) / $.zoom,
    y: (value2.y - $.offsetY) / $.zoom,
  };
}
function Oa(value) {
  const value2 = ie.getBoundingClientRect();
  return {
    x: value.clientX - value2.left,
    y: value.clientY - value2.top,
  };
}
function qu() {
  if (scene.walls.length) {
    return modelBounds({
      background: null,
      walls: scene.walls,
      items: [],
    });
  } else if (scene.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: scene.items,
    });
  } else {
    return modelBounds(scene);
  }
}
function oo() {
  const value = qu();
  const value2 = clamp(Math.min(Qe, Je) * 0.045, 18, 34);
  const count = Math.max(Qe - value2 * 2, 80);
  const count2 = Math.max(Je - value2 * 2, 80);
  const value3 = Math.abs($.rotation / 90) % 2 === 1;
  const value4 = value3 ? value.height : value.width;
  const value5 = value3 ? value.width : value.height;
  $.zoom = clamp(Math.min(count / value4, count2 / value5), 0.03, 8);
  $.offsetX = Qe / 2 - (value.minX + value.width / 2) * $.zoom;
  $.offsetY = Je / 2 - (value.minY + value.height / 2) * $.zoom;
  vc = true;
  ae();
}
function $s(
  value,
  value2 = {
    x: Qe / 2,
    y: Je / 2,
  },
) {
  const value3 = no(value2);
  const value4 = Zi(value2);
  $.zoom = clamp($.zoom * value, 0.03, 12);
  $.offsetX = value4.x - value3.x * $.zoom;
  $.offsetY = value4.y - value3.y * $.zoom;
  ae();
}
function Uu() {
  $.rotation = ($.rotation + 90) % 360;
  scene.settings.planViewRotation = $.rotation;
  oo();
  V();
}
function zs() {
  const value = Ct.getBoundingClientRect();
  Qe = Math.max(Math.round(value.width), 1);
  Je = Math.max(Math.round(value.height), 1);
  const value2 = Math.min(window.devicePixelRatio || 1, 2);
  ie.width = Math.round(Qe * value2);
  ie.height = Math.round(Je * value2);
  context.setTransform(value2, 0, 0, value2, 0, 0);
  if (vc) {
    ae();
  } else {
    oo();
  }
}
function Ki(value) {
  const tolerance = Math.max(1, value * 0.01);
  const value2 = scene.walls
    .map(
      (value3) =>
        value3.id +
        "," +
        value3.start.x +
        "," +
        value3.start.y +
        "," +
        value3.end.x +
        "," +
        value3.end.y +
        "," +
        value3.thickness +
        "," +
        (value3.allowOpenEnd === true ? 1 : 0),
    )
    .join(";");
  if (Ci.scene !== scene || Ci.signature !== tolerance + "|" + value2) {
    Ci = {
      scene: scene,
      signature: tolerance + "|" + value2,
      tolerance: tolerance,
      floorPolygons: null,
      intersections: null,
      joinExtensions: null,
      unclosedEndpoints: null,
    };
  }
  return Ci;
}
function Bs(value) {
  const value2 = Ki(value);
  value2.floorPolygons ||= closedWallFloorPolygons(
    scene.walls,
    value2.tolerance,
  );
  return value2.floorPolygons;
}
function Zu(value) {
  const value2 = Ki(value);
  value2.intersections ||= wallIntersections(scene.walls);
  return value2.intersections;
}
function Ku(value) {
  const value2 = Ki(value);
  value2.joinExtensions ||= wallJoinExtensions(scene.walls);
  return value2.joinExtensions;
}
function Qu(value) {
  const value2 = Ki(value);
  value2.unclosedEndpoints ||= unclosedWallEndpoints(
    scene.walls,
    value2.tolerance,
    Bs(value),
  );
  return value2.unclosedEndpoints;
}
function Jt(value) {
  const wall = scene.walls.find((value7) => value7.id === value.wallId);
  if (!wall) {
    return null;
  }
  const value2 = wall.end.x - wall.start.x;
  const value3 = wall.end.y - wall.start.y;
  const value4 = Math.hypot(value2, value3);
  if (!value4) {
    return null;
  }
  const value5 = clampWindowT(wall, value, pixelsPerMeter() || 1);
  const center = {
    x: wall.start.x + value2 * value5,
    y: wall.start.y + value3 * value5,
  };
  const value6 = Math.min(
    (value.width * (pixelsPerMeter() || 1)) / 2,
    value4 / 2,
  );
  const unit = {
    x: value2 / value4,
    y: value3 / value4,
  };
  return {
    wall: wall,
    center: center,
    start: {
      x: center.x - unit.x * value6,
      y: center.y - unit.y * value6,
    },
    end: {
      x: center.x + unit.x * value6,
      y: center.y + unit.y * value6,
    },
    unit: unit,
  };
}
function _c(value, value2 = {}) {
  const value3 = Jt(value);
  if (!value3) {
    return;
  }
  const value4 = We("railing", value.id);
  const color = value2.preview
    ? "rgba(123, 220, 240, .72)"
    : value4
      ? "#ffaf46"
      : "#8bd7e8";
  const width = Math.max(
    10,
    value3.wall.thickness * (pixelsPerMeter() || 100) * $.zoom + 5,
  );
  Se(value3.start, value3.end, {
    color: "rgba(7, 16, 21, .94)",
    width: width,
    cap: "butt",
  });
  Se(value3.start, value3.end, {
    color: color,
    width: value4 ? 5 : 3,
    cap: "butt",
  });
  Se(value3.start, value3.end, {
    color: "rgba(224, 250, 255, .72)",
    width: 1,
    cap: "butt",
  });
  Xe(value3.start, color, value4 ? 3 : 2);
  Xe(value3.end, color, value4 ? 3 : 2);
  if (value4 && !value2.preview) {
    et(value3.center, "玻璃栏杆 · " + value.width.toFixed(2) + " m", "#8bd7e8");
  }
}
function Yc(value, value2 = {}) {
  const value3 = Jt(value);
  if (!value3) {
    return;
  }
  const value4 = We("door", value.id);
  const value5 = value.doorType || "solid";
  const color = value2.preview
    ? "rgba(255, 189, 110, .76)"
    : value4
      ? "#ffaf46"
      : ["solid", "double", "entry", "roller-shutter", "frame-only"].includes(
            value5,
          )
        ? "#edf2f7"
        : "#bfe9ff";
  const width = Math.max(
    10,
    value3.wall.thickness * (pixelsPerMeter() || 100) * $.zoom + 5,
  );
  Se(value3.start, value3.end, {
    color: "rgba(7, 16, 21, .94)",
    width: width,
    cap: "butt",
  });
  if (value5 === "frame-only") {
    const value16 = {
      x: -value3.unit.y,
      y: value3.unit.x,
    };
    const count = Math.max(
      5 / $.zoom,
      value3.wall.thickness * (pixelsPerMeter() || 100) * 0.55,
    );
    for (const value17 of [value3.start, value3.end]) {
      Se(
        {
          x: value17.x - value16.x * count,
          y: value17.y - value16.y * count,
        },
        {
          x: value17.x + value16.x * count,
          y: value17.y + value16.y * count,
        },
        {
          color: color,
          width: value4 ? 4 : 3,
          cap: "butt",
        },
      );
    }
    if (value4) {
      et(value3.center, "仅门框 · " + value.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value5 === "sliding-glass") {
    const value16 = {
      x: -value3.unit.y,
      y: value3.unit.x,
    };
    const count = Math.max(
      2.5 / $.zoom,
      value3.wall.thickness * (pixelsPerMeter() || 100) * 0.16,
    );
    const value17 = distance(value3.start, value3.end);
    const value18 = value.hinge === "right" ? 1 : -1;
    const value19 = slidingDoorPanelCenters(value17, value18);
    const value20 = value17 * 0.27;
    for (const [value21, value22] of [
      [value19.fixed, -1],
      [value19.moving, 1],
    ]) {
      const value23 = {
        x: value3.center.x + value3.unit.x * value21,
        y: value3.center.y + value3.unit.y * value21,
      };
      const value24 = {
        x: value16.x * count * value22,
        y: value16.y * count * value22,
      };
      const value25 = {
        x: value23.x - value3.unit.x * value20 + value24.x,
        y: value23.y - value3.unit.y * value20 + value24.y,
      };
      const value26 = {
        x: value23.x + value3.unit.x * value20 + value24.x,
        y: value23.y + value3.unit.y * value20 + value24.y,
      };
      Se(value25, value26, {
        color: color,
        width: value4 ? 4 : 3,
        cap: "butt",
      });
      Xe(value22 < 0 ? value26 : value25, color, 2);
    }
    if (value4) {
      et(
        value3.center,
        "玻璃推拉门 · " + value.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value5 === "roller-shutter") {
    const value16 = {
      x: -value3.unit.y,
      y: value3.unit.x,
    };
    const value17 =
      Math.max(
        2 / $.zoom,
        value3.wall.thickness * (pixelsPerMeter() || 100) * 0.08,
      ) * (value.swing === -1 ? -1 : 1);
    Se(
      {
        x: value3.start.x + value16.x * value17,
        y: value3.start.y + value16.y * value17,
      },
      {
        x: value3.end.x + value16.x * value17,
        y: value3.end.y + value16.y * value17,
      },
      {
        color: color,
        width: value4 ? 5 : 4,
        cap: "butt",
      },
    );
    const value18 = distance(value3.start, value3.end);
    const count = Math.max(3, Math.min(18, Math.round(value.width / 0.35)));
    for (let value19 = 1; value19 < count; value19 += 1) {
      const value20 = value18 * (value19 / count - 0.5);
      const value21 = {
        x: value3.center.x + value3.unit.x * value20 + value16.x * value17,
        y: value3.center.y + value3.unit.y * value20 + value16.y * value17,
      };
      Se(
        {
          x: value21.x - (value16.x * 3) / $.zoom,
          y: value21.y - (value16.y * 3) / $.zoom,
        },
        {
          x: value21.x + (value16.x * 3) / $.zoom,
          y: value21.y + (value16.y * 3) / $.zoom,
        },
        {
          color: "rgba(167, 178, 188, .72)",
          width: 1,
          cap: "butt",
        },
      );
    }
    if (value4) {
      et(value3.center, "卷帘门 · " + value.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value5 === "entry") {
    const value16 = {
      x: -value3.unit.y,
      y: value3.unit.x,
    };
    const count = Math.max(
      2 / $.zoom,
      value3.wall.thickness * (pixelsPerMeter() || 100) * 0.08,
    );
    Se(
      {
        x: value3.start.x + value16.x * count,
        y: value3.start.y + value16.y * count,
      },
      {
        x: value3.end.x + value16.x * count,
        y: value3.end.y + value16.y * count,
      },
      {
        color: color,
        width: value2.preview ? 3 : value4 ? 5 : 4,
        cap: "butt",
      },
    );
    Se(
      {
        x: value3.start.x - value16.x * count,
        y: value3.start.y - value16.y * count,
      },
      {
        x: value3.end.x - value16.x * count,
        y: value3.end.y - value16.y * count,
      },
      {
        color: "rgba(167, 178, 188, .72)",
        width: 1,
        cap: "butt",
      },
    );
    const value17 = value.hinge === "right" ? -1 : 1;
    Xe(
      {
        x: value3.center.x + value3.unit.x * value.width * value17 * 0.34,
        y: value3.center.y + value3.unit.y * value.width * value17 * 0.34,
      },
      color,
      value4 ? 3 : 2,
    );
    if (value4) {
      et(
        value3.center,
        "入户门（常闭）· " + value.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value5 === "double") {
    const value16 = {
      x: -value3.unit.y,
      y: value3.unit.x,
    };
    const value17 = value.swing === -1 ? -1 : 1;
    const value18 = (distance(value3.start, value3.end) / 2) * value17;
    const value19 = {
      x: value3.start.x + value16.x * value18,
      y: value3.start.y + value16.y * value18,
    };
    const value20 = {
      x: value3.end.x + value16.x * value18,
      y: value3.end.y + value16.y * value18,
    };
    Se(value3.start, value19, {
      color: color,
      width: value2.preview ? 2 : value4 ? 4 : 3,
      cap: "butt",
    });
    Se(value3.end, value20, {
      color: color,
      width: value2.preview ? 2 : value4 ? 4 : 3,
      cap: "butt",
    });
    Xe(value3.start, color, value4 ? 3.5 : 2.5);
    Xe(value3.end, color, value4 ? 3.5 : 2.5);
    if (value4) {
      et(value3.center, "双开门 · " + value.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  const value6 = value.hinge === "right";
  const value7 = value6 ? value3.end : value3.start;
  const value8 = value6 ? value3.start : value3.end;
  const value9 = {
    x: value8.x - value7.x,
    y: value8.y - value7.y,
  };
  const value10 = value.swing === -1 ? -1 : 1;
  const value11 = {
    x: value7.x - value9.y * value10,
    y: value7.y + value9.x * value10,
  };
  Se(value7, value11, {
    color: color,
    width: value2.preview ? 2 : value4 ? 4 : 3,
    cap: "butt",
    dash: value2.preview ? [5, 4] : null,
  });
  if (value5 === "glass") {
    const value16 = {
      x: (value3.unit.x * 3) / $.zoom,
      y: (value3.unit.y * 3) / $.zoom,
    };
    Se(
      {
        x: value7.x + value16.x,
        y: value7.y + value16.y,
      },
      {
        x: value11.x + value16.x,
        y: value11.y + value16.y,
      },
      {
        color: "rgba(183, 229, 247, .58)",
        width: 1,
        cap: "butt",
      },
    );
  }
  const value12 = zo(value7);
  const value13 = distance(value7, value8) * $.zoom;
  const value14 = Math.atan2(value9.y, value9.x);
  const value15 = value14 + (value10 * Math.PI) / 2;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = value2.preview ? 1 : value4 ? 2 : 1.25;
  if (value2.preview) {
    context.setLineDash([5, 4]);
  }
  context.beginPath();
  context.arc(value12.x, value12.y, value13, value14, value15, value10 < 0);
  context.stroke();
  context.restore();
  Xe(value7, color, value4 ? 3.5 : 2.5);
  if (value4) {
    et(
      value3.center,
      "" +
        (value5 === "glass" ? "玻璃门 · " : "") +
        value.width.toFixed(2) +
        " m",
      "#ffaf46",
    );
  }
}
function qc(value) {
  const value2 = zo(value);
  const value3 = value.width * pixelsPerMeter() * $.zoom;
  const value4 = value.depth * pixelsPerMeter() * $.zoom;
  const value5 = We("item", value.id);
  context.save();
  context.translate(value2.x, value2.y);
  context.rotate((value.rotation * Math.PI) / 180);
  context.fillStyle = value.color + "c7";
  context.strokeStyle = value5 ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
  context.lineWidth = value5 ? 2 : 1;
  if (re.has(value.type)) {
    const count = Math.max(
      Math.min(value3, value4) * 0.44,
      value.type === "downlight" ? 10 : 8,
    );
    const value6 =
      "#" +
      kelvinToRgbHex(value.lightTemperature).toString(16).padStart(6, "0");
    const value7 = Ds(value);
    context.fillStyle = value7 ? value6 : "#68737d";
    context.strokeStyle = value7
      ? "rgba(255, 221, 163, .88)"
      : "rgba(196, 207, 216, .48)";
    context.lineWidth = 1.2;
    if (value.type === "striplight") {
      context.beginPath();
      const value8 = Math.min(7, value4 * 0.42);
      context.roundRect(
        -value3 / 2,
        -value4 * 0.34,
        value3,
        value4 * 0.68,
        value8,
      );
      context.fill();
      context.stroke();
      context.strokeStyle = value7
        ? "rgba(255, 238, 195, .95)"
        : "rgba(196, 207, 216, .42)";
      context.lineWidth = Math.max(2, value4 * 0.12);
      context.beginPath();
      context.moveTo(-value3 * 0.42, 0);
      context.lineTo(value3 * 0.42, 0);
      context.stroke();
    } else if (value.type === "ceilinglight") {
      const count2 = Math.max(Math.min(value3, value4) * 0.82, 16);
      context.beginPath();
      context.rect(-count2 / 2, -count2 / 2, count2, count2);
      context.fill();
      context.stroke();
      const value8 = count2 * 0.58;
      context.strokeRect(-value8 / 2, -value8 / 2, value8, value8);
    } else {
      context.beginPath();
      context.arc(0, 0, count, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(0, 0, count * 0.5, 0, Math.PI * 2);
      context.stroke();
      for (let value8 = 0; value8 < 4; value8 += 1) {
        const value9 = (value8 * Math.PI) / 2;
        context.beginPath();
        context.moveTo(
          Math.cos(value9) * count * 0.68,
          Math.sin(value9) * count * 0.68,
        );
        context.lineTo(
          Math.cos(value9) * count * 1.12,
          Math.sin(value9) * count * 1.12,
        );
        context.stroke();
      }
    }
  } else if (value.type === "planlabel") {
    const value6 = planLabelProjectionMetrics(value3, value4, value.lineLength);
    context.fillStyle = "#929baa";
    const titleFontSize = value6.titleFontSize;
    context.font = "700 " + titleFontSize + "px sans-serif";
    drawTrackedText(
      context,
      value.title || "家庭总览",
      value6.titleStartX,
      value6.titleY,
      titleFontSize * clamp(finite(value.titleSpacing, 1.05), 0, 1.8),
      value6.titleMaxWidth,
    );
    const iconX = value6.iconX;
    const iconY = value6.iconY;
    const iconSize = value6.iconSize;
    context.fillStyle = "#929baa";
    context.beginPath();
    context.moveTo(iconX, iconY - iconSize * 0.58);
    context.lineTo(iconX + iconSize * 0.56, iconY - iconSize * 0.02);
    context.lineTo(iconX + iconSize * 0.38, iconY - iconSize * 0.02);
    context.lineTo(iconX + iconSize * 0.38, iconY + iconSize * 0.5);
    context.lineTo(iconX - iconSize * 0.38, iconY + iconSize * 0.5);
    context.lineTo(iconX - iconSize * 0.38, iconY - iconSize * 0.02);
    context.lineTo(iconX - iconSize * 0.56, iconY - iconSize * 0.02);
    context.lineTo(iconX, iconY - iconSize * 0.52);
    context.closePath();
    context.fill();
    context.fillStyle = "#929baa";
    context.textAlign = "left";
    const subtitleFontSize = value6.subtitleFontSize;
    context.font =
      "400 " + subtitleFontSize + 'px "Arial Narrow", Arial, sans-serif';
    drawTrackedText(
      context,
      value.subtitle || "HOME PLAN",
      value6.subtitleStartX,
      value6.subtitleY,
      subtitleFontSize * clamp(finite(value.subtitleSpacing, 0.08), 0, 0.6),
      value6.subtitleMaxWidth,
    );
    context.strokeStyle = "rgba(146, 155, 170, .72)";
    context.lineWidth = value6.baselineLineWidth;
    const baselineY = value6.baselineY;
    const baselineStartX = value6.baselineStartX;
    const value7 = baselineStartX + value6.baselineLength;
    context.beginPath();
    context.moveTo(baselineStartX, baselineY);
    context.lineTo(value7, baselineY);
    context.moveTo(baselineStartX, baselineY - value6.baselineCapHalfHeight);
    context.lineTo(baselineStartX, baselineY + value6.baselineCapHalfHeight);
    context.moveTo(value7, baselineY - value6.baselineCapHalfHeight);
    context.lineTo(value7, baselineY + value6.baselineCapHalfHeight);
    context.stroke();
  } else if (value.type === "smallcar") {
    const value6 = Math.min(value3 * 0.22, value4 * 0.08);
    if (value.chargingEnabled === true) {
      context.save();
      context.scale(value3 * 0.76, value4 * 0.62);
      const value7 = context.createRadialGradient(0, 0, 0, 0, 0, 1);
      value7.addColorStop(0, "rgba(79, 239, 183, .32)");
      value7.addColorStop(0.48, "rgba(79, 239, 183, .17)");
      value7.addColorStop(1, "rgba(79, 239, 183, 0)");
      context.fillStyle = value7;
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();
      context.fillStyle = "rgba(79, 239, 183, .24)";
      const count = Math.max(9, Math.min(value3, value4) * 0.07);
      for (
        let value8 = -value3 * 0.62;
        value8 <= value3 * 0.62;
        value8 += count
      ) {
        for (
          let value9 = -value4 * 0.54;
          value9 <= value4 * 0.54;
          value9 += count
        ) {
          const value10 = Math.hypot(
            value8 / (value3 * 0.62),
            value9 / (value4 * 0.54),
          );
          if (!(value10 >= 1)) {
            context.globalAlpha = (1 - value10) * 0.72;
            context.beginPath();
            context.arc(
              value8,
              value9,
              Math.max(0.7, count * 0.1),
              0,
              Math.PI * 2,
            );
            context.fill();
          }
        }
      }
      context.globalAlpha = 1;
      context.fillStyle = value.color + "c7";
    }
    context.beginPath();
    context.roundRect(
      -value3 * 0.48,
      -value4 * 0.49,
      value3 * 0.96,
      value4 * 0.98,
      value6,
    );
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(38, 48, 57, .72)";
    context.beginPath();
    context.roundRect(
      -value3 * 0.38,
      -value4 * 0.2,
      value3 * 0.76,
      value4 * 0.42,
      value6 * 0.7,
    );
    context.fill();
    for (const value7 of [-0.5, 0.5]) {
      for (const value8 of [-0.3, 0.3]) {
        context.fillRect(
          value7 * value3 - value3 * 0.045,
          value8 * value4 - value4 * 0.085,
          value3 * 0.09,
          value4 * 0.17,
        );
      }
    }
    if (value.chargingEnabled === true) {
      context.fillStyle = "#7dffd0";
      context.beginPath();
      context.moveTo(value3 * 0.028, -value4 * 0.095);
      context.lineTo(-value3 * 0.058, value4 * 0.008);
      context.lineTo(value3 * 0.006, value4 * 0.008);
      context.lineTo(-value3 * 0.028, value4 * 0.095);
      context.lineTo(value3 * 0.07, -value4 * 0.02);
      context.lineTo(value3 * 0.008, -value4 * 0.02);
      context.closePath();
      context.fill();
    }
  } else if (value.type === "curtain") {
    const value6 = ["left", "right", "split"].includes(value.curtainPosition)
      ? value.curtainPosition
      : "split";
    const fn9 = (value7, value8) => {
      context.beginPath();
      context.roundRect(
        value7,
        -value4 * 0.46,
        value8,
        value4 * 0.92,
        Math.min(value4 * 0.32, value8 * 0.18),
      );
      context.fill();
      context.stroke();
      context.strokeStyle = "rgba(25, 34, 43, .48)";
      context.lineWidth = 1;
      for (let value9 = 1; value9 < 5; value9 += 1) {
        const value10 = value7 + (value8 * value9) / 5;
        context.beginPath();
        context.moveTo(value10, -value4 * 0.34);
        context.lineTo(value10, value4 * 0.34);
        context.stroke();
      }
    };
    context.strokeStyle = value5 ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
    context.lineWidth = value5 ? 2 : 1.5;
    context.beginPath();
    context.moveTo(-value3 * 0.5, 0);
    context.lineTo(value3 * 0.5, 0);
    context.stroke();
    if (value6 === "left") {
      fn9(-value3 * 0.5, value3 * 0.24);
    } else if (value6 === "right") {
      fn9(value3 * 0.26, value3 * 0.24);
    } else {
      fn9(-value3 * 0.5, value3 * 0.16);
      fn9(value3 * 0.34, value3 * 0.16);
    }
  } else if (value.type === "pillar") {
    context.beginPath();
    context.rect(-value3 / 2, -value4 / 2, value3, value4);
    context.fill();
    context.stroke();
    context.strokeStyle = value5
      ? "rgba(255, 193, 116, .95)"
      : "rgba(25, 34, 43, .5)";
    context.lineWidth = 1;
    context.strokeRect(
      -value3 * 0.36,
      -value4 * 0.36,
      value3 * 0.72,
      value4 * 0.72,
    );
  } else if (value.type === "bar") {
    context.beginPath();
    context.roundRect(
      -value3 / 2,
      -value4 / 2,
      value3,
      value4,
      Math.min(5, value4 * 0.16),
    );
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-value3 * 0.44, -value4 * 0.18);
    context.lineTo(value3 * 0.44, -value4 * 0.18);
    context.stroke();
    for (const value6 of [-0.28, 0, 0.28]) {
      context.beginPath();
      context.arc(
        value3 * value6,
        value4 * 0.38,
        Math.max(2, value4 * 0.12),
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
  } else if (value.type === "aquarium") {
    context.fillStyle = "rgba(92, 174, 202, .25)";
    context.strokeStyle = value5 ? "#ff9d2e" : "rgba(178, 225, 238, .9)";
    context.beginPath();
    context.rect(-value3 / 2, -value4 / 2, value3, value4);
    context.fill();
    context.stroke();
    context.strokeRect(
      -value3 * 0.43,
      -value4 * 0.34,
      value3 * 0.86,
      value4 * 0.68,
    );
    for (const value6 of [-0.25, 0.18]) {
      context.beginPath();
      context.arc(
        value3 * value6,
        value4 * (value6 > 0 ? 0.08 : -0.06),
        Math.max(2, value4 * 0.08),
        0,
        Math.PI * 2,
      );
      context.stroke();
    }
  } else if (value.type === "coffeetable") {
    const value6 = Math.min(value3, value4) * 0.32;
    const value7 = value6 * 0.7;
    context.beginPath();
    context.arc(-value3 * 0.16, value4 * 0.08, value6, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(value3 * 0.24, -value4 * 0.2, value7, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  } else if (Mn.has(value.type)) {
    context.beginPath();
    context.ellipse(0, 0, value3 * 0.32, value4 * 0.32, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    for (const [value6, value7] of [
      [-0.38, 0],
      [0.38, 0],
      [0, -0.38],
      [0, 0.38],
    ]) {
      context.beginPath();
      context.roundRect(
        value3 * value6 - value3 * 0.085,
        value4 * value7 - value4 * 0.095,
        value3 * 0.17,
        value4 * 0.19,
        Math.min(value3, value4) * 0.035,
      );
      context.fill();
      context.stroke();
    }
    if (yi(value)) {
      context.beginPath();
      context.ellipse(0, 0, value3 * 0.27, value4 * 0.27, 0, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }
  } else if (value.type === "squarecoffeetable") {
    context.beginPath();
    context.roundRect(
      -value3 * 0.47,
      -value4 * 0.47,
      value3 * 0.94,
      value4 * 0.94,
      Math.min(value3, value4) * 0.08,
    );
    context.fill();
    context.stroke();
    context.strokeRect(
      -value3 * 0.33,
      -value4 * 0.38,
      value3 * 0.66,
      value4 * 0.76,
    );
    context.beginPath();
    context.moveTo(-value3 * 0.08, -value4 * 0.38);
    context.lineTo(-value3 * 0.08, value4 * 0.38);
    context.moveTo(value3 * 0.08, -value4 * 0.38);
    context.lineTo(value3 * 0.08, value4 * 0.38);
    context.stroke();
    context.fillStyle = "rgba(25, 34, 43, .58)";
    for (const value6 of [-0.39, 0.39]) {
      for (const value7 of [-0.34, 0.34]) {
        context.beginPath();
        context.arc(
          value3 * value6,
          value4 * value7,
          Math.max(1.5, Math.min(value3, value4) * 0.045),
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }
  } else if (value.type === "floorlamp") {
    const value6 = -value3 * 0.34;
    const value7 = value3 * 0.31;
    const value8 = Math.min(value4 * 0.34, value3 * 0.13);
    const value9 = Math.min(value4 * 0.46, value3 * 0.14);
    context.lineCap = "round";
    context.lineWidth = value5 ? 2.4 : 1.5;
    context.beginPath();
    context.moveTo(value6, 0);
    context.lineTo(value7, 0);
    context.stroke();
    context.beginPath();
    context.arc(value6, 0, value8, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.arc(value7, 0, value9, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  } else if (value.type === "toilet") {
    context.beginPath();
    context.moveTo(-value3 * 0.42, -value4 * 0.42);
    context.lineTo(value3 * 0.42, -value4 * 0.42);
    context.bezierCurveTo(
      value3 * 0.48,
      -value4 * 0.08,
      value3 * 0.48,
      value4 * 0.28,
      0,
      value4 * 0.48,
    );
    context.bezierCurveTo(
      -value3 * 0.48,
      value4 * 0.28,
      -value3 * 0.48,
      -value4 * 0.08,
      -value3 * 0.42,
      -value4 * 0.42,
    );
    context.closePath();
    context.fill();
    context.stroke();
  } else if (value.type === "squattoilet") {
    context.beginPath();
    context.roundRect(
      -value3 / 2,
      -value4 / 2,
      value3,
      value4,
      Math.min(value3, value4) * 0.12,
    );
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(
      0,
      value4 * 0.04,
      value3 * 0.18,
      value4 * 0.31,
      0,
      0,
      Math.PI * 2,
    );
    context.stroke();
    for (const value6 of [-1, 1]) {
      context.strokeRect(
        value6 * value3 * 0.38 - value3 * 0.07,
        -value4 * 0.25,
        value3 * 0.14,
        value4 * 0.5,
      );
    }
  } else if (value.type === "urinal") {
    context.beginPath();
    context.roundRect(
      -value3 * 0.38,
      -value4 * 0.42,
      value3 * 0.76,
      value4 * 0.84,
      Math.min(value3, value4) * 0.28,
    );
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(
      0,
      value4 * 0.04,
      value3 * 0.2,
      value4 * 0.28,
      0,
      0,
      Math.PI * 2,
    );
    context.stroke();
  } else if (value.type === "bathtub") {
    context.beginPath();
    context.roundRect(
      -value3 * 0.48,
      -value4 * 0.45,
      value3 * 0.96,
      value4 * 0.9,
      Math.min(value3, value4) * 0.36,
    );
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(0, 0, value3 * 0.34, value4 * 0.29, 0, 0, Math.PI * 2);
    context.stroke();
  } else if (value.type === "walllamp") {
    context.beginPath();
    context.arc(0, 0, Math.min(value3, value4) * 0.36, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-value3 * 0.42, value4 * 0.38);
    context.lineTo(value3 * 0.42, value4 * 0.38);
    context.stroke();
  } else if (value.type === "glasspartition") {
    context.fillStyle = "rgba(169, 197, 211, .2)";
    context.strokeStyle = value5 ? "#ff9d2e" : "rgba(183, 218, 231, .82)";
    context.beginPath();
    context.rect(-value3 / 2, -value4 / 2, value3, value4);
    context.fill();
    context.stroke();
  } else if (value.type === "storagewaterheater") {
    context.beginPath();
    context.ellipse(0, 0, value3 * 0.46, value4 * 0.44, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(47, 58, 69, .82)";
    context.beginPath();
    context.roundRect(
      -value3 * 0.2,
      -value4 * 0.28,
      value3 * 0.4,
      value4 * 0.22,
      Math.min(value3, value4) * 0.08,
    );
    context.fill();
    context.strokeStyle = "rgba(25, 34, 43, .5)";
    context.beginPath();
    context.moveTo(-value3 * 0.3, value4 * 0.36);
    context.lineTo(-value3 * 0.3, value4 * 0.52);
    context.moveTo(value3 * 0.3, value4 * 0.36);
    context.lineTo(value3 * 0.3, value4 * 0.52);
    context.stroke();
  } else if (value.type === "gaswaterheater") {
    context.beginPath();
    context.roundRect(
      -value3 * 0.46,
      -value4 * 0.46,
      value3 * 0.92,
      value4 * 0.92,
      Math.min(value3, value4) * 0.1,
    );
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(47, 58, 69, .82)";
    context.fillRect(
      -value3 * 0.22,
      -value4 * 0.26,
      value3 * 0.44,
      value4 * 0.17,
    );
    context.strokeStyle = "rgba(25, 34, 43, .5)";
    context.beginPath();
    context.moveTo(-value3 * 0.24, value4 * 0.44);
    context.lineTo(-value3 * 0.24, value4 * 0.58);
    context.moveTo(0, value4 * 0.44);
    context.lineTo(0, value4 * 0.58);
    context.moveTo(value3 * 0.24, value4 * 0.44);
    context.lineTo(value3 * 0.24, value4 * 0.58);
    context.stroke();
  } else if (value.type === "pipelinewaterpurifier") {
    context.beginPath();
    context.roundRect(
      -value3 * 0.46,
      -value4 * 0.46,
      value3 * 0.92,
      value4 * 0.92,
      Math.min(value3, value4) * 0.08,
    );
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(31, 39, 45, .9)";
    context.beginPath();
    context.roundRect(
      -value3 * 0.4,
      -value4 * 0.35,
      value3 * 0.8,
      value4 * 0.28,
      Math.min(value3, value4) * 0.05,
    );
    context.fill();
    context.strokeStyle = "rgba(231, 235, 236, .74)";
    context.beginPath();
    context.moveTo(-value3 * 0.12, -value4 * 0.18);
    context.lineTo(value3 * 0.12, -value4 * 0.18);
    context.stroke();
    context.fillStyle = "rgba(47, 58, 69, .7)";
    for (const value6 of [-0.2, 0.2]) {
      context.beginPath();
      context.arc(
        value3 * value6,
        value4 * 0.18,
        Math.max(1.5, Math.min(value3, value4) * 0.055),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    context.strokeStyle = "rgba(25, 34, 43, .5)";
    context.beginPath();
    context.moveTo(-value3 * 0.26, value4 * 0.36);
    context.lineTo(-value3 * 0.26, value4 * 0.5);
    context.moveTo(value3 * 0.26, value4 * 0.36);
    context.lineTo(value3 * 0.26, value4 * 0.5);
    context.stroke();
  } else if (value.type === "tea_bar_machine") {
    context.beginPath();
    context.rect(-value3 * 0.46, -value4 * 0.46, value3 * 0.92, value4 * 0.92);
    context.fill();
    context.stroke();
    context.fillStyle = "rgba(38, 44, 47, .86)";
    context.fillRect(
      -value3 * 0.38,
      -value4 * 0.36,
      value3 * 0.76,
      value4 * 0.2,
    );
    context.strokeStyle = "rgba(25, 34, 43, .5)";
    context.beginPath();
    context.moveTo(-value3 * 0.46, value4 * 0.08);
    context.lineTo(value3 * 0.46, value4 * 0.08);
    context.moveTo(-value3 * 0.46, value4 * 0.3);
    context.lineTo(value3 * 0.46, value4 * 0.3);
    context.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(value.type)) {
    context.beginPath();
    context.rect(-value3 / 2, -value4 / 2, value3, value4);
    context.fill();
    context.stroke();
  } else if (value.type === "ricecooker") {
    context.beginPath();
    context.ellipse(0, 0, value3 * 0.46, value4 * 0.46, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  } else {
    context.beginPath();
    context.roundRect(
      -value3 / 2,
      -value4 / 2,
      value3,
      value4,
      Math.min(6, value3 / 5, value4 / 5),
    );
    context.fill();
    context.stroke();
  }
  context.strokeStyle = "rgba(17, 24, 31, .5)";
  context.lineWidth = 1;
  if (value.type === "coffeetable") {
    const value6 = Math.min(value3, value4) * 0.32;
    context.beginPath();
    context.arc(-value3 * 0.16, value4 * 0.08, value6 * 0.32, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.arc(value3 * 0.24, -value4 * 0.2, value6 * 0.23, 0, Math.PI * 2);
    context.stroke();
  } else if (value.type === "squarecoffeetable") {
    context.strokeRect(
      -value3 * 0.35,
      -value4 * 0.35,
      value3 * 0.7,
      value4 * 0.7,
    );
  } else if (value.type === "bed") {
    context.strokeRect(
      -value3 * 0.4,
      -value4 * 0.4,
      value3 * 0.8,
      value4 * 0.23,
    );
    context.beginPath();
    context.moveTo(-value3 / 2, -value4 * 0.12);
    context.lineTo(value3 / 2, -value4 * 0.12);
    context.stroke();
  } else if (value.type === "sofa") {
    context.beginPath();
    context.moveTo(-value3 / 2, -value4 * 0.27);
    context.lineTo(value3 / 2, -value4 * 0.27);
    context.stroke();
    context.strokeRect(
      -value3 * 0.42,
      -value4 * 0.12,
      value3 * 0.84,
      value4 * 0.43,
    );
  } else if (value.type === "table") {
    for (const value6 of [-0.38, 0.38]) {
      for (const value7 of [-0.32, 0.32]) {
        context.beginPath();
        context.arc(
          value3 * value6,
          value4 * value7,
          Math.max(1.5, Math.min(value3, value4) * 0.045),
          0,
          Math.PI * 2,
        );
        context.stroke();
      }
    }
  } else if (Mn.has(value.type) && yi(value)) {
    context.beginPath();
    context.arc(0, 0, Math.min(value3, value4) * 0.17, 0, Math.PI * 2);
    context.stroke();
  } else if (value.type === "fridge") {
    context.beginPath();
    context.moveTo(-value3 / 2, -value4 * 0.12);
    context.lineTo(value3 / 2, -value4 * 0.12);
    context.stroke();
  } else if (value.type === "storagewaterheater") {
    context.beginPath();
    context.arc(0, 0, Math.min(value3, value4) * 0.26, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(-value3 * 0.29, value4 * 0.36);
    context.lineTo(value3 * 0.29, value4 * 0.36);
    context.stroke();
  } else if (value.type === "gaswaterheater") {
    context.beginPath();
    context.moveTo(-value3 * 0.36, -value4 * 0.08);
    context.lineTo(value3 * 0.36, -value4 * 0.08);
    context.stroke();
    context.beginPath();
    context.moveTo(-value3 * 0.3, value4 * 0.36);
    context.lineTo(value3 * 0.3, value4 * 0.36);
    context.stroke();
  } else if (value.type === "pipelinewaterpurifier") {
    context.beginPath();
    context.moveTo(-value3 * 0.3, value4 * 0.34);
    context.lineTo(value3 * 0.3, value4 * 0.34);
    context.stroke();
    context.beginPath();
    context.arc(
      value3 * 0.02,
      value4 * 0.16,
      Math.min(value3, value4) * 0.08,
      0,
      Math.PI * 2,
    );
    context.stroke();
  } else if (value.type === "tea_bar_machine") {
    context.beginPath();
    context.moveTo(-value3 * 0.38, -value4 * 0.02);
    context.lineTo(value3 * 0.38, -value4 * 0.02);
    context.moveTo(-value3 * 0.42, value4 * 0.2);
    context.lineTo(value3 * 0.42, value4 * 0.2);
    context.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(value.type)) {
    context.beginPath();
    context.moveTo(-value3 * 0.42, value4 * 0.3);
    context.lineTo(value3 * 0.42, value4 * 0.3);
    context.stroke();
  } else if (value.type === "glasspartition") {
    context.strokeStyle = "rgba(183, 218, 231, .72)";
    context.beginPath();
    context.moveTo(-value3 * 0.46, 0);
    context.lineTo(value3 * 0.46, 0);
    context.stroke();
  } else if (value.type === "ricecooker") {
    context.beginPath();
    context.arc(
      0,
      -value4 * 0.04,
      Math.min(value3, value4) * 0.28,
      0,
      Math.PI * 2,
    );
    context.stroke();
  } else if (value.type === "tv") {
    if (value.tvMountStyle === "mobile") {
      context.fillStyle = "rgba(46, 53, 61, .88)";
      context.fillRect(
        -value3 * 0.36,
        -value4 * 0.4,
        value3 * 0.72,
        value4 * 0.8,
      );
      context.strokeRect(
        -value3 * 0.08,
        -value4 * 0.42,
        value3 * 0.16,
        value4 * 0.84,
      );
    } else if (value.tvMountStyle === "tabletop") {
      context.strokeRect(
        -value3 * 0.3,
        -value4 * 0.34,
        value3 * 0.6,
        value4 * 0.68,
      );
    }
    context.fillStyle =
      value.screenEnabled === false
        ? "rgba(8, 12, 15, .8)"
        : "rgba(48, 113, 153, .86)";
    context.fillRect(
      -value3 * 0.44,
      -value4 * 0.28,
      value3 * 0.88,
      value4 * 0.56,
    );
    if (value.screenEnabled !== false) {
      context.fillStyle = "rgba(255, 159, 54, .92)";
      context.fillRect(
        -value3 * 0.37,
        -value4 * 0.18,
        value3 * 0.05,
        value4 * 0.36,
      );
    }
  } else if (value.type === "plant") {
    context.beginPath();
    context.arc(0, 0, Math.min(value3, value4) * 0.31, 0, Math.PI * 2);
    context.stroke();
  } else if (Ur.has(value.type)) {
    for (let value6 = 1; value6 < 10; value6 += 1) {
      const value7 = -value4 / 2 + (value4 * value6) / 10;
      context.beginPath();
      context.moveTo(-value3 / 2, value7);
      context.lineTo(value3 / 2, value7);
      context.stroke();
    }
    context.beginPath();
    context.moveTo(0, value4 * 0.34);
    context.lineTo(0, -value4 * 0.3);
    context.lineTo(-Math.min(value3, value4) * 0.08, -value4 * 0.2);
    context.moveTo(0, -value4 * 0.3);
    context.lineTo(Math.min(value3, value4) * 0.08, -value4 * 0.2);
    context.stroke();
  }
  if (value5) {
    context.strokeStyle = "rgba(255, 157, 46, .9)";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.strokeRect(-value3 / 2, -value4 / 2, value3, value4);
    context.setLineDash([]);
    const value6 = 7;
    context.fillStyle = "#111820";
    for (const [value8, value9] of [
      [-value3 / 2, -value4 / 2],
      [value3 / 2, -value4 / 2],
      [value3 / 2, value4 / 2],
      [-value3 / 2, value4 / 2],
    ]) {
      context.fillRect(
        value8 - value6 / 2,
        value9 - value6 / 2,
        value6,
        value6,
      );
      context.strokeRect(
        value8 - value6 / 2,
        value9 - value6 / 2,
        value6,
        value6,
      );
    }
    const value7 = -value4 / 2 - 17;
    context.strokeStyle = "#ff9d2e";
    context.beginPath();
    context.moveTo(0, -value4 / 2);
    context.lineTo(0, value7 + 4);
    context.stroke();
    context.fillStyle = "#111820";
    context.beginPath();
    context.arc(0, value7, 4, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  context.restore();
}
function Qi(value, value2, value3) {
  const value4 = ((Number(value.rotation) || 0) * Math.PI) / 180;
  return {
    x: value.x + value2 * Math.cos(value4) - value3 * Math.sin(value4),
    y: value.y + value2 * Math.sin(value4) + value3 * Math.cos(value4),
  };
}
function Ju(value) {
  const value2 = pixelsPerMeter() || 100;
  const value3 = (value.width * value2) / 2;
  const value4 = (value.depth * value2) / 2;
  return {
    corners: [
      {
        x: -1,
        y: -1,
      },
      {
        x: 1,
        y: -1,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: -1,
        y: 1,
      },
    ].map((corners) => ({
      ...corners,
      point: Qi(value, corners.x * value3, corners.y * value4),
      opposite: Qi(value, -corners.x * value3, -corners.y * value4),
    })),
    rotationStem: Qi(value, 0, -value4),
    rotationHandle: Qi(value, 0, -value4 - 17 / Math.max($.zoom, 0.01)),
  };
}
function Uc(value) {
  if (we !== "select" || X?.kind !== "item" || he.length) {
    return null;
  }
  const item = ct();
  if (!item) {
    return null;
  }
  const controls = Ju(item);
  const value2 = 9 / Math.max($.zoom, 0.01);
  if (distance(value, controls.rotationHandle) <= value2) {
    return {
      type: "rotate-item",
      item: item,
      controls: controls,
    };
  }
  const corner = controls.corners.find(
    (value3) => distance(value, value3.point) <= value2,
  );
  if (corner) {
    return {
      type: "resize-item",
      item: item,
      controls: controls,
      corner: corner,
    };
  } else {
    return null;
  }
}
function ju(value, value2) {
  return {
    minX: Math.min(value.x, value2.x),
    minY: Math.min(value.y, value2.y),
    maxX: Math.max(value.x, value2.x),
    maxY: Math.max(value.y, value2.y),
  };
}
function Ji(value, value2) {
  return (
    value.x >= value2.minX &&
    value.x <= value2.maxX &&
    value.y >= value2.minY &&
    value.y <= value2.maxY
  );
}
function ji(value, value2, value3) {
  if (Ji(value, value3) || Ji(value2, value3)) {
    return true;
  }
  const value4 = [
    {
      x: value3.minX,
      y: value3.minY,
    },
    {
      x: value3.maxX,
      y: value3.minY,
    },
    {
      x: value3.maxX,
      y: value3.maxY,
    },
    {
      x: value3.minX,
      y: value3.maxY,
    },
  ];
  for (let value5 = 0; value5 < value4.length; value5 += 1) {
    if (
      segmentIntersection(
        value,
        value2,
        value4[value5],
        value4[(value5 + 1) % value4.length],
      )
    ) {
      return true;
    }
  }
  return false;
}
function ef(value, value2) {
  const value3 = ju(value, value2);
  const value4 = pixelsPerMeter() || 100;
  const value5 = [];
  const value6 = st === "light";
  if (!value6) {
    for (const value8 of scene.walls) {
      if (ji(value8.start, value8.end, value3)) {
        value5.push({
          kind: "wall",
          id: value8.id,
        });
      }
    }
    for (const value8 of scene.windows) {
      const value9 = Jt(value8);
      if (value9 && ji(value9.start, value9.end, value3)) {
        value5.push({
          kind: "window",
          id: value8.id,
        });
      }
    }
    for (const value8 of scene.doors) {
      const value9 = Jt(value8);
      if (value9 && ji(value9.start, value9.end, value3)) {
        value5.push({
          kind: "door",
          id: value8.id,
        });
      }
    }
    for (const value8 of scene.railings) {
      const value9 = Jt(value8);
      if (value9 && ji(value9.start, value9.end, value3)) {
        value5.push({
          kind: "railing",
          id: value8.id,
        });
      }
    }
  }
  const value7 = [
    {
      x: value3.minX,
      y: value3.minY,
    },
    {
      x: value3.maxX,
      y: value3.minY,
    },
    {
      x: value3.maxX,
      y: value3.maxY,
    },
    {
      x: value3.minX,
      y: value3.maxY,
    },
  ];
  for (const value8 of scene.items) {
    if (re.has(value8.type) !== value6) {
      continue;
    }
    const value9 = (value8.rotation * Math.PI) / 180;
    const value10 = Math.cos(value9);
    const value11 = Math.sin(value9);
    const value12 = (value8.width * value4) / 2;
    const value13 = (value8.depth * value4) / 2;
    const value14 = [
      [-value12, -value13],
      [value12, -value13],
      [value12, value13],
      [-value12, value13],
    ].map(([value15, value16]) => ({
      x: value8.x + value15 * value10 - value16 * value11,
      y: value8.y + value15 * value11 + value16 * value10,
    }));
    if (
      Ji(value8, value3) ||
      value14.some((value15) => Ji(value15, value3)) ||
      value7.some((value15) => pointInRotatedRectangle(value15, value8, value4))
    ) {
      value5.push({
        kind: "item",
        id: value8.id,
      });
    }
  }
  return value5;
}
function Zc() {
  if (!ie.width || !ie.height || !vi) {
    return false;
  } else {
    if (vt.width !== ie.width) {
      vt.width = ie.width;
    }
    if (vt.height !== ie.height) {
      vt.height = ie.height;
    }
    vi.setTransform(1, 0, 0, 1, 0, 0);
    vi.clearRect(0, 0, vt.width, vt.height);
    vi.drawImage(ie, 0, 0);
    return true;
  }
}
function Kc({ offsetX: value = 0, offsetY: value2 = 0 } = {}) {
  if (
    !vt.width ||
    !vt.height ||
    vt.width !== ie.width ||
    vt.height !== ie.height
  ) {
    return false;
  }
  const value3 = ie.width / Math.max(Qe, 1);
  const value4 = ie.height / Math.max(Je, 1);
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#0d1319";
  context.fillRect(0, 0, ie.width, ie.height);
  context.drawImage(
    vt,
    Math.round(value * value3),
    Math.round(value2 * value4),
  );
  context.restore();
  return true;
}
function Qc() {
  if (z?.type !== "marquee") {
    return;
  }
  const value = zo(z.start);
  const value2 = zo(z.current);
  const value3 = Math.min(value.x, value2.x);
  const value4 = Math.min(value.y, value2.y);
  const value5 = Math.abs(value2.x - value.x);
  const value6 = Math.abs(value2.y - value.y);
  context.save();
  context.translate(Qe / 2, Je / 2);
  context.rotate(($.rotation * Math.PI) / 180);
  context.translate(-Qe / 2, -Je / 2);
  context.fillStyle = "rgba(255, 157, 46, .10)";
  context.strokeStyle = "rgba(255, 176, 74, .92)";
  context.lineWidth = 1;
  context.setLineDash([6, 4]);
  context.fillRect(value3, value4, value5, value6);
  context.strokeRect(
    value3 + 0.5,
    value4 + 0.5,
    Math.max(value5 - 1, 0),
    Math.max(value6 - 1, 0),
  );
  context.restore();
}
function ae() {
  const value = st === "light";
  context.clearRect(0, 0, Qe, Je);
  context.fillStyle = "#0d1319";
  context.fillRect(0, 0, Qe, Je);
  context.save();
  context.translate(Qe / 2, Je / 2);
  context.rotate(($.rotation * Math.PI) / 180);
  context.translate(-Qe / 2, -Je / 2);
  if (wa && scene.background && scene.settings.backgroundVisible) {
    const value3 = zo({
      x: 0,
      y: 0,
    });
    context.save();
    context.globalAlpha = value ? 0.3 : 0.54;
    context.drawImage(
      wa,
      value3.x,
      value3.y,
      scene.background.width * $.zoom,
      scene.background.height * $.zoom,
    );
    context.restore();
  }
  yu();
  const value2 = pixelsPerMeter() || 100;
  if (ue) {
    context.save();
    context.globalAlpha = 0.58;
    for (const value3 of Gc()) {
      Se(value3.start, value3.end, {
        color: "#52cfe0",
        width: Math.max(2, value3.thickness * value2 * $.zoom),
        dash: [7, 5],
        cap: "square",
      });
    }
    context.restore();
    if (ue.referencePoint) {
      const value3 = Hi(ue.referencePoint, ue.referenceFloor, Te());
      Xe(value3, "#ffb14f", 4.5);
      et(value3, "参照点", "#ffb14f");
    }
  }
  context.save();
  if (value) {
    context.globalAlpha = 0.48;
  }
  for (const value3 of scene.walls) {
    const value4 = We("wall", value3.id);
    const width = Math.max(value3.thickness * value2 * $.zoom, 4);
    if (value4) {
      Se(value3.start, value3.end, {
        color: "rgba(255, 157, 46, .38)",
        width: width + 7,
        cap: "square",
      });
    }
    Se(value3.start, value3.end, {
      color: value4 ? "#f1d7b9" : "#c7d0d7",
      width: width,
      cap: "square",
    });
    Se(value3.start, value3.end, {
      color: "rgba(39, 51, 61, .82)",
      width: 1,
    });
    if (we === "wall" || value4) {
      Xe(value3.start, value4 ? "#ff9d2e" : "#6c7c88", 3.5);
      Xe(value3.end, value4 ? "#ff9d2e" : "#6c7c88", 3.5);
    }
    if (value4 && he.length <= 1) {
      et(
        {
          x: (value3.start.x + value3.end.x) / 2,
          y: (value3.start.y + value3.end.y) / 2,
        },
        wallLengthMeters(value3, value2).toFixed(2) + " m",
        "#ffb14f",
      );
    }
  }
  for (const value3 of scene.windows) {
    const value4 = Jt(value3);
    if (!value4) {
      continue;
    }
    const value5 = We("window", value3.id);
    Se(value4.start, value4.end, {
      color: "rgba(7, 16, 21, .9)",
      width: Math.max(10, value4.wall.thickness * value2 * $.zoom + 5),
      cap: "butt",
    });
    Se(value4.start, value4.end, {
      color: value5 ? "#ffaf46" : "#43d2e6",
      width: value5 ? 5 : 3,
      cap: "butt",
    });
    Se(value4.start, value4.end, {
      color: "rgba(224, 250, 255, .9)",
      width: 1,
      cap: "butt",
    });
    if (value3.hasDivider !== false && value3.width > 1.2) {
      const value6 = {
        x: -value4.unit.y,
        y: value4.unit.x,
      };
      const count = Math.max(
        value4.wall.thickness * value2 * $.zoom * 0.72,
        5 / $.zoom,
      );
      Se(
        {
          x: value4.center.x - value6.x * count,
          y: value4.center.y - value6.y * count,
        },
        {
          x: value4.center.x + value6.x * count,
          y: value4.center.y + value6.y * count,
        },
        {
          color: value5 ? "#ffaf46" : "rgba(224, 250, 255, .9)",
          width: 1.5,
          cap: "butt",
        },
      );
    }
    if (value5 && he.length <= 1) {
      et(value4.center, value3.width.toFixed(2) + " m", "#43d2e6");
    }
  }
  for (const value3 of scene.doors) {
    Yc(value3);
  }
  for (const value3 of scene.railings) {
    _c(value3);
  }
  for (const value3 of scene.items) {
    if (!re.has(value3.type)) {
      qc(value3);
    }
  }
  if (!ue) {
    const value3 = Qu(value2);
    for (const value4 of value3) {
      xu(value4);
      if (value3.length <= 3) {
        et(value4, "未闭合", "#ff766e");
      }
    }
  }
  context.restore();
  if (value) {
    for (const value3 of scene.items) {
      if (re.has(value3.type)) {
        qc(value3);
      }
    }
  }
  const reference = scene.calibration?.reference;
  if (reference && we === "scale") {
    Se(reference.start, reference.end, {
      color: "rgba(255, 157, 46, .72)",
      width: 2,
      dash: [7, 5],
    });
    Xe(reference.start, "#ff9d2e", 3.5);
    Xe(reference.end, "#ff9d2e", 3.5);
    et(
      {
        x: (reference.start.x + reference.end.x) / 2,
        y: (reference.start.y + reference.end.y) / 2,
      },
      reference.meters.toFixed(2) + " m 参考",
      "#ffad45",
    );
  }
  if (ft && dn) {
    Se(ft, dn, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5],
    });
    Xe(ft, "#ff9d2e");
    Xe(dn, "#ff9d2e");
  }
  if (Ke && Fe) {
    const value3 = jd(Fe);
    Se(Ke, Fe.point, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5],
    });
    Xe(Ke, "#ff9d2e");
    Xe(
      Fe.point,
      value3 ? "#76cfa1" : Fe.kind ? "#43d2e6" : "#ff9d2e",
      value3 ? 5 : 3.5,
    );
    const value4 = distance(Ke, Fe.point) / value2;
    et(
      {
        x: (Ke.x + Fe.point.x) / 2,
        y: (Ke.y + Fe.point.y) / 2,
      },
      value4.toFixed(2) + " m",
      "#ffb04a",
    );
    if (value3) {
      et(Fe.point, "点击闭合空间", "#76cfa1");
    }
  } else if (Fe?.kind && ["wall", "scale"].includes(we)) {
    Xe(Fe.point, "#43d2e6");
    et(Fe.point, Fe.label, "#43d2e6");
  }
  if (we === "window" && Un) {
    const value3 = {
      wallId: Un.wall.id,
      t: Un.t,
      width: 1.4,
    };
    const value4 = Jt(value3);
    if (value4) {
      Se(value4.start, value4.end, {
        color: "rgba(67, 210, 230, .75)",
        width: 5,
        dash: [5, 4],
        cap: "butt",
      });
    }
  }
  if (we === "door" && Zn) {
    const value3 = Sn[ya] || Sn.solid;
    Yc(
      {
        wallId: Zn.wall.id,
        t: Zn.t,
        width: value3.width,
        height: value3.height,
        doorType: ya,
        hinge: "left",
        swing: 1,
      },
      {
        preview: true,
      },
    );
  }
  if (we === "railing" && Kn) {
    _c(
      {
        wallId: Kn.wall.id,
        t: Kn.t,
        width: 2,
        height: 1.1,
      },
      {
        preview: true,
      },
    );
  }
  context.restore();
  Qc();
  eh.textContent = Math.round($.zoom * 100) + "%";
}
function ct() {
  if (!X) {
    return null;
  }
  const value = (
    {
      wall: scene.walls,
      window: scene.windows,
      door: scene.doors,
      railing: scene.railings,
      item: scene.items,
    }[X.kind] || []
  ).find((value2) => value2.id === X.id);
  if (!value) {
    X = null;
  }
  return value || null;
}
function tf(value) {
  const value2 = pixelsPerMeter() || 100;
  const value3 = st === "light";
  for (const value4 of [...scene.items].reverse()) {
    if (
      re.has(value4.type) === value3 &&
      pointInRotatedRectangle(value, value4, value2)
    ) {
      return {
        kind: "item",
        id: value4.id,
      };
    }
  }
  if (value3) {
    return null;
  }
  for (const value4 of [...scene.windows].reverse()) {
    const value5 = Jt(value4);
    if (
      value5 &&
      projectPointToSegment(value, value5.start, value5.end).distance <=
        10 / $.zoom
    ) {
      return {
        kind: "window",
        id: value4.id,
      };
    }
  }
  for (const value4 of [...scene.doors].reverse()) {
    const value5 = Jt(value4);
    if (
      value5 &&
      projectPointToSegment(value, value5.start, value5.end).distance <=
        12 / $.zoom
    ) {
      return {
        kind: "door",
        id: value4.id,
      };
    }
  }
  for (const value4 of [...scene.railings].reverse()) {
    const value5 = Jt(value4);
    if (
      value5 &&
      projectPointToSegment(value, value5.start, value5.end).distance <=
        12 / $.zoom
    ) {
      return {
        kind: "railing",
        id: value4.id,
      };
    }
  }
  for (const value4 of [...scene.walls].reverse()) {
    const count = Math.max((value4.thickness * value2) / 2, 8 / $.zoom);
    if (
      projectPointToSegment(value, value4.start, value4.end).distance <= count
    ) {
      return {
        kind: "wall",
        id: value4.id,
      };
    }
  }
  return null;
}
function Os() {
  const value = {
    background: !!scene.background,
    scale: !!scene.calibration,
    walls: scene.walls.length > 0,
    items: scene.items.some((items) => !re.has(items.type)),
    lights: scene.items.some((lights) => re.has(lights.type)),
    export: ws,
  };
  const value2 =
    ["background", "scale", "walls", "items", "lights", "export"].find(
      (value3) => !value[value3],
    ) || "export";
  for (const element of document.querySelectorAll("[data-step]")) {
    element.classList.toggle("complete", value[element.dataset.step]);
    element.classList.toggle("active", element.dataset.step === value2);
  }
}
function er() {
  const value = da.getBoundingClientRect();
  const value2 = yo.getBoundingClientRect();
  const value3 = value.height || Math.max(window.innerHeight - 90, 340);
  const value4 = value2.width || Math.max(window.innerWidth - 20, 860);
  const value5 = Ze.parentElement?.getBoundingClientRect().height || 14;
  const value6 =
    yo.querySelector(".library-panel")?.getBoundingClientRect().width || 168;
  return {
    minimumHeightRatio: clamp(320 / value3, 0.08, 0.5),
    maximumHeightRatio: clamp((value3 - value5 - 170) / value3, 0.5, 0.94),
    minimumWidthRatio: clamp(360 / value4, 0.08, 0.45),
    maximumWidthRatio: clamp((value4 - value6 - 20 - 320) / value4, 0.45, 0.86),
  };
}
function Ws() {
  const value = er();
  const value2 = clamp(
    finite(scene.settings?.previewPanelRatio, 0.52),
    value.minimumHeightRatio,
    value.maximumHeightRatio,
  );
  scene.settings.previewPanelRatio = value2;
  da.style.setProperty(
    "--preview-panel-height",
    (value2 * 100).toFixed(2) + "%",
  );
  Ze.setAttribute(
    "aria-valuemin",
    String(Math.round(value.minimumHeightRatio * 100)),
  );
  Ze.setAttribute(
    "aria-valuemax",
    String(Math.round(value.maximumHeightRatio * 100)),
  );
  Ze.setAttribute("aria-valuenow", String(Math.round(value2 * 100)));
}
function Hs() {
  const value = er();
  const value2 = clamp(
    finite(scene.settings?.detailsPanelWidthRatio, 0.29),
    value.minimumWidthRatio,
    value.maximumWidthRatio,
  );
  scene.settings.detailsPanelWidthRatio = value2;
  yo.style.setProperty(
    "--details-panel-width",
    (value2 * 100).toFixed(2) + "%",
  );
}
function Wa() {
  return scene.settings.snapEnabled !== false && !Sa;
}
function Vs(value) {
  oa.hidden = !value;
  Bl.setAttribute("aria-expanded", String(value));
}
function Ns() {
  const value = scene.settings.snapEnabled !== false;
  Fr.classList.toggle("active", value);
  Fr.setAttribute("aria-pressed", String(value));
  j0.textContent = value ? "开" : "关";
  for (const value2 of Ol) {
    value2.checked = scene.settings[value2.dataset.snapSetting] !== false;
  }
  syncControlValue(
    mo,
    clamp(Math.round(finite(scene.settings.snapTolerance, 13)), 6, 24),
  );
  Wl.textContent = mo.value + " px";
  if (!Mo) {
    Nn.textContent = value ? "吸附：开启" : "吸附：关闭";
  }
}
function nf(value) {
  if (!Ft) {
    return;
  }
  const value2 = da.getBoundingClientRect();
  const value3 = yo.getBoundingClientRect();
  if (value2.height <= 0 || value3.width <= 0) {
    return;
  }
  const value4 = er();
  const value5 = value.clientX - Ft.startX;
  const value6 = value.clientY - Ft.startY;
  if (Math.hypot(value5, value6) < 2) {
    return;
  }
  Ze.dataset.resizeAxis = "both";
  const value7 = value6 / value2.height;
  const value8 = value5 / value3.width;
  scene.settings.previewPanelRatio = clamp(
    Ft.startPreviewRatio + value7,
    value4.minimumHeightRatio,
    value4.maximumHeightRatio,
  );
  scene.settings.detailsPanelWidthRatio = clamp(
    Ft.startWidthRatio - value8,
    value4.minimumWidthRatio,
    value4.maximumWidthRatio,
  );
  Ws();
  Hs();
}
function Jc() {
  Ns();
  Oi();
  Lr.disabled = !scene.background;
  Lr.textContent = scene.settings.backgroundVisible ? "隐藏" : "显示";
  Gl.disabled = !scene.background;
  syncControlValue(jo, scene.settings.wallHeight.toFixed(2));
  syncControlValue(ea, scene.settings.wallThickness.toFixed(2));
  syncControlValue(ta, Math.round(scene.settings.wallOpacity * 100));
  kr.textContent = scene.settings.floorEdgeVisible === false ? "隐藏" : "显示";
  kr.setAttribute(
    "aria-pressed",
    String(scene.settings.floorEdgeVisible !== false),
  );
  X0.hidden =
    !!scene.background || !!scene.walls.length || !!scene.items.length;
  Rh.textContent =
    scene.walls.length +
    " 墙 · " +
    scene.windows.length +
    " 窗 · " +
    scene.doors.length +
    " 门 · " +
    scene.railings.length +
    " 栏杆 · " +
    scene.items.length +
    " 物件";
  fn();
  Ws();
  Hs();
  Wt(Pt());
  Oo(gt());
  Na();
  zn();
  io();
  Os();
}
function St() {
  const value = ct();
  const length = he.length;
  wo.hidden = !!value;
  Or.hidden = !value;
  zl.disabled = !value && !length;
  if (length) {
    wo.hidden = false;
    Or.hidden = true;
    wo.querySelector("strong").textContent = "已框选 " + length + " 个对象";
    wo.querySelector("p").textContent =
      "可以直接批量删除；单击一个对象可继续精确编辑属性。";
    return;
  }
  wo.querySelector("strong").textContent = "选择画布中的对象";
  wo.querySelector("p").textContent =
    "选中墙体、窗户、门或家具后，可在这里精确调整。";
  if (!!value && !!X) {
    Nl.hidden = true;
    Vl.classList.remove("light-selected");
    lh.hidden = X.kind !== "wall";
    ch.hidden = X.kind !== "window";
    dh.hidden = X.kind !== "door";
    hh.hidden = X.kind !== "railing";
    uh.hidden = X.kind !== "item";
    Wr.hidden = X.kind === "item";
    Wr.textContent = Wr.hidden ? "" : value.id;
    if (X.kind === "wall") {
      f("#selection-title").textContent = "墙体";
      syncControlValue(
        f("#wall-length"),
        wallLengthMeters(value, pixelsPerMeter() || 1).toFixed(2) + " m",
      );
      syncControlValue(f("#wall-height"), value.height.toFixed(2));
      syncControlValue(f("#wall-thickness"), value.thickness.toFixed(2));
      const value2 =
        value.opacity === null || value.opacity === undefined
          ? null
          : clamp(finite(value.opacity, scene.settings.wallOpacity), 0, 1);
      f("#wall-opacity-mode").value = value2 === null ? "global" : "custom";
      syncControlValue(
        f("#wall-opacity"),
        Math.round((value2 ?? scene.settings.wallOpacity) * 100),
      );
      f("#wall-opacity").disabled = value2 === null;
      syncStudioSelect(f("#wall-opacity-mode"));
      f("#wall-open-end-mode").value =
        value.allowOpenEnd === true ? "allowed" : "auto";
      syncStudioSelect(f("#wall-open-end-mode"));
    } else if (X.kind === "window") {
      f("#selection-title").textContent = "窗户";
      syncControlValue(f("#window-width"), value.width.toFixed(2));
      syncControlValue(f("#window-height"), value.height.toFixed(2));
      syncControlValue(f("#window-sill"), value.sill.toFixed(2));
      f("#window-divider").value =
        value.hasDivider === false ? "without" : "with";
      syncStudioSelect(f("#window-divider"));
      syncControlValue(f("#window-position"), Math.round(value.t * 100) + "%");
    } else if (X.kind === "door") {
      f("#selection-title").textContent =
        {
          solid: "普通平开门",
          double: "双开门",
          entry: "入户门（常闭）",
          glass: "玻璃平开门",
          "sliding-glass": "玻璃推拉门",
          "roller-shutter": "卷帘门",
          "frame-only": "仅门框",
        }[value.doorType] || "普通平开门";
      f("#door-type").value = value.doorType || "solid";
      syncStudioSelect(f("#door-type"));
      syncControlValue(f("#door-width"), value.width.toFixed(2));
      syncControlValue(f("#door-height"), value.height.toFixed(2));
      syncControlValue(f("#door-position"), Math.round(value.t * 100) + "%");
      f(".door-actions").hidden = [
        "entry",
        "sliding-glass",
        "frame-only",
      ].includes(value.doorType);
      f("#door-hinge").hidden = ["double", "roller-shutter"].includes(
        value.doorType,
      );
      f("#door-swing").hidden = false;
    } else if (X.kind === "railing") {
      f("#selection-title").textContent = "玻璃栏杆";
      syncControlValue(f("#railing-width"), value.width.toFixed(2));
      syncControlValue(f("#railing-height"), value.height.toFixed(2));
      syncControlValue(f("#railing-position"), Math.round(value.t * 100) + "%");
    } else {
      const value2 = xt[value.type];
      const value3 = value.type === "planlabel";
      const value4 = re.has(value.type);
      f("#selection-title").textContent = value2?.name || "物件";
      Nl.hidden = !value4;
      Vl.classList.toggle("light-selected", value4);
      fh.hidden = !value3;
      gh.hidden = !value4;
      Ph.hidden = value.type !== "curtain";
      ph.hidden = value3 || value4;
      mh.hidden = value3;
      wh.hidden = value.type === "ceilinglight";
      yh.hidden = value.type === "ceilinglight";
      xh.hidden = !value4;
      Mh.hidden = value.type !== "striplight";
      bh.hidden = value.type !== "striplight";
      Sh.hidden = value.type !== "striplight";
      Eh.hidden = !Mn.has(value.type);
      Lh.hidden = !xo.has(value.type);
      Ih.hidden = value.type !== "tv";
      Th.hidden = value.type !== "shoecabinet";
      Xl.setAttribute(
        "aria-pressed",
        value.shoeCabinetMirrored === true ? "true" : "false",
      );
      f("#item-rotation-label").textContent =
        value.type === "striplight"
          ? "平面旋转（°）"
          : value4
            ? "平面方向（°）"
            : "旋转角度（°）";
      f("#item-rotation").min = value.type === "striplight" ? "0" : "-360";
      f("#item-rotation").max = "360";
      vh.textContent =
        value.type === "striplight" ? "安装倾斜（°）" : "出光角度（°）";
      f("#item-vertical-rotation").min =
        value.type === "striplight" ? "0" : "-90";
      f("#item-vertical-rotation").max =
        value.type === "striplight" ? "360" : "90";
      for (const value5 of Hl) {
        value5.hidden = !value4;
      }
      Ch.textContent =
        value.type === "striplight"
          ? "发光长度（m）"
          : value.type === "pillar"
            ? "长（m）"
            : "宽（m）";
      kh.textContent =
        value.type === "striplight"
          ? "发光宽度（m）"
          : value3
            ? "铭牌高（m）"
            : value.type === "pillar"
              ? "宽（m）"
              : "深（m）";
      if (value3) {
        syncControlValue(f("#label-title"), value.title || "家庭总览");
        syncControlValue(
          f("#label-title-spacing"),
          Math.round(clamp(finite(value.titleSpacing, 1.05), 0, 1.8) * 100),
        );
        syncControlValue(f("#label-subtitle"), value.subtitle || "HOME PLAN");
        syncControlValue(
          f("#label-subtitle-spacing"),
          Math.round(clamp(finite(value.subtitleSpacing, 0.08), 0, 0.6) * 100),
        );
        syncControlValue(
          f("#label-line-length"),
          Math.round(clamp(finite(value.lineLength, 0.86), 0.3, 1) * 100),
        );
      }
      if (value4) {
        const value5 = Rt[value.type] || Rt.downlight;
        ut = Vi(value)?.id || Fo().id;
        fn();
        Fu(value);
        syncControlValue(
          f("#light-temperature"),
          Math.round(
            clamp(
              finite(value.lightTemperature, value5.temperature),
              2200,
              6500,
            ),
          ),
        );
        syncControlValue(
          f("#light-brightness"),
          Math.round(
            clamp(finite(value.lightBrightness, value5.brightness), 0, 100),
          ),
        );
        syncControlValue(
          f("#light-range"),
          clamp(finite(value.lightRange, value5.range), 0.5, 10).toFixed(1),
        );
        f("#light-angle").max = String(vo(value.type));
        syncControlValue(
          f("#light-angle"),
          Math.round(
            clamp(finite(value.lightAngle, value5.angle), 15, vo(value.type)),
          ),
        );
        const value6 =
          value.type === "striplight"
            ? normalizeFullRotation(value.verticalRotation)
            : clamp(finite(value.verticalRotation, 0), -90, 90);
        syncControlValue(
          f("#item-vertical-rotation"),
          Math.round(value6 * 100) / 100,
        );
        syncControlValue(
          Hr,
          Math.round(clamp(finite(value.stripRollRotation, 0), 0, 360) * 100) /
            100,
        );
        Vr.checked = value.lightSourceVisible !== false;
      }
      if (value.type === "curtain") {
        f("#curtain-position").value = ["left", "right", "split"].includes(
          value.curtainPosition,
        )
          ? value.curtainPosition
          : "split";
        syncStudioSelect(f("#curtain-position"));
      }
      if (Mn.has(value.type)) {
        f("#round-table-turntable").value = yi(value) ? "with" : "without";
        syncStudioSelect(f("#round-table-turntable"));
      }
      if (xo.has(value.type)) {
        f("#stair-direction").value = ["left", "right"].includes(
          value.stairDirection,
        )
          ? value.stairDirection
          : "right";
        syncStudioSelect(f("#stair-direction"));
      }
      if (value.type === "tv") {
        f("#tv-mount-style").value = fa.has(value.tvMountStyle)
          ? value.tvMountStyle
          : "standard";
        syncStudioSelect(f("#tv-mount-style"));
      }
      syncControlValue(
        f("#item-x"),
        (value.x / (pixelsPerMeter() || 1)).toFixed(2),
      );
      syncControlValue(
        f("#item-y"),
        (value.y / (pixelsPerMeter() || 1)).toFixed(2),
      );
      syncControlValue(f("#item-width"), value.width.toFixed(2));
      f("#item-height").min = String(itemMinimumHeight(value.type));
      f("#item-height").step = value.type === "rug" ? "0.002" : "0.05";
      syncControlValue(
        f("#item-height"),
        value.type === "rug"
          ? value.height.toFixed(3)
          : value.height.toFixed(2),
      );
      syncControlValue(f("#item-depth"), value.depth.toFixed(2));
      syncControlValue(f("#item-elevation"), (value.elevation || 0).toFixed(2));
      syncControlValue(
        f("#item-rotation"),
        Math.round(value.rotation * 100) / 100,
      );
    }
  }
}
function ye(scope = "all") {
  Jc();
  St();
  ae();
  if (scope !== "none") {
    qe({
      scope: scope,
    });
  }
}
function Bt(value) {
  if (!xc[value]) {
    return;
  }
  if (st === "light" && value !== "select") {
    _("灯光编辑中户型已锁定，请先切回家居或电器。");
    return;
  }
  const value2 = we === "wall" && value !== "wall" && ba > 0;
  we = value;
  ie.dataset.tool = value;
  ie.style.cursor = "";
  for (const element of $l) {
    element.classList.toggle("active", element.dataset.tool === value);
  }
  [Rr.textContent, Dr.textContent] =
    st === "light"
      ? [
          "灯光编辑",
          "户型已锁定；框选多盏灯后可整体拖动，Shift 锁轴，Option/Alt 复制",
        ]
      : xc[value];
  na.hidden = value !== "wall" || !Ke;
  if (value !== "wall") {
    qo();
  }
  if (value !== "scale") {
    ft = null;
  }
  Fe = null;
  Un = null;
  Zn = null;
  Kn = null;
  ae();
  if (value2) {
    _(
      "当前墙线未闭合，不会生成地面；如果绘制的是隔墙，可以忽略此提醒。",
      "warning",
    );
  }
}
function Ha(value = "scale") {
  if (pixelsPerMeter()) {
    return true;
  } else {
    _("请先画一条参考线并填写真实长度。", "error");
    Bt(value);
    return false;
  }
}
function jc() {
  if (he.length) {
    const value3 = za();
    te();
    const allowed = new Set(
      he.filter((value4) => value4.kind === "wall").map((value4) => value4.id),
    );
    const allowed2 = new Set(
      he
        .filter((value4) => value4.kind === "window")
        .map((value4) => value4.id),
    );
    const allowed3 = new Set(
      he.filter((value4) => value4.kind === "door").map((value4) => value4.id),
    );
    const allowed4 = new Set(
      he
        .filter((value4) => value4.kind === "railing")
        .map((value4) => value4.id),
    );
    const allowed5 = new Set(
      he.filter((value4) => value4.kind === "item").map((value4) => value4.id),
    );
    scene.walls = scene.walls.filter((value4) => !allowed.has(value4.id));
    scene.windows = scene.windows.filter(
      (value4) => !allowed2.has(value4.id) && !allowed.has(value4.wallId),
    );
    scene.doors = scene.doors.filter(
      (value4) => !allowed3.has(value4.id) && !allowed.has(value4.wallId),
    );
    scene.railings = scene.railings.filter(
      (value4) => !allowed4.has(value4.id) && !allowed.has(value4.wallId),
    );
    scene.items = scene.items.filter((value4) => !allowed5.has(value4.id));
    if (allowed.size) {
      Vc();
    }
    Gt();
    ye(value3);
    V();
    return;
  }
  const value = ct();
  if (!value || !X) {
    return;
  }
  const value2 = za();
  te();
  if (X.kind === "wall") {
    scene.walls = scene.walls.filter((value3) => value3.id !== value.id);
    scene.windows = scene.windows.filter(
      (value3) => value3.wallId !== value.id,
    );
    scene.doors = scene.doors.filter((value3) => value3.wallId !== value.id);
    scene.railings = scene.railings.filter(
      (value3) => value3.wallId !== value.id,
    );
    Vc();
  } else if (X.kind === "window") {
    scene.windows = scene.windows.filter((value3) => value3.id !== value.id);
  } else if (X.kind === "door") {
    scene.doors = scene.doors.filter((value3) => value3.id !== value.id);
  } else if (X.kind === "railing") {
    scene.railings = scene.railings.filter((value3) => value3.id !== value.id);
  } else {
    scene.items = scene.items.filter((value3) => value3.id !== value.id);
  }
  Gt();
  ye(value2);
  V();
}
function Xs(type, value) {
  const value2 = xt[type];
  if (!value2 || !Ha()) {
    return;
  }
  const value3 = Rt[type] || Rt.downlight;
  const value4 = re.has(type) ? Fo() : null;
  te();
  const value5 = {
    id: Ce("item"),
    type: type,
    x: value.x,
    y: value.y,
    rotation: 0,
    width: value2.width,
    depth: value2.depth,
    height: value2.height,
    elevation: value2.elevation || 0,
    color: value2.color,
    ...(type === "planlabel"
      ? {
          title: "家庭总览",
          subtitle: "HOME PLAN",
          titleSpacing: 1.05,
          subtitleSpacing: 0.08,
          lineLength: 0.86,
        }
      : {}),
    ...(type === "tv"
      ? {
          screenEnabled: true,
          screenLayerName: "电视画面 " + (Ni().length + 1),
          tvMountStyle: "standard",
        }
      : {}),
    ...(type === "smallcar"
      ? {
          chargingEnabled: false,
          chargingLayerName: "汽车充电 " + (Xi().length + 1),
        }
      : {}),
    ...(type === "curtain"
      ? {
          curtainPosition: "split",
        }
      : {}),
    ...(xo.has(type)
      ? {
          stairDirection: "right",
        }
      : {}),
    ...(type === "shoecabinet"
      ? {
          shoeCabinetMirrored: false,
        }
      : {}),
    ...(Mn.has(type)
      ? {
          roundTableTurntable: false,
        }
      : {}),
    ...(re.has(type)
      ? {
          lightGroupId: value4.id,
          verticalRotation: 0,
          ...(type === "striplight"
            ? {
                stripRollRotation: 0,
                lightSourceVisible: true,
              }
            : {}),
          lightTemperature: value3.temperature,
          lightBrightness: value3.brightness,
          lightRange: value3.range,
          lightAngle: value3.angle,
        }
      : {}),
  };
  qi([value5]);
  scene.items.push(value5);
  $t("item", value5.id);
  Bt("select");
  ye($a(value5));
  V();
}
function of() {
  const allowed = new Set([
    ...(X?.kind === "item" ? [X.id] : []),
    ...he.filter((value5) => value5.kind === "item").map((value5) => value5.id),
  ]);
  const value = st === "light";
  const value2 = scene.items.filter(
    (value5) => allowed.has(value5.id) && re.has(value5.type) === value,
  );
  if (!value2.length) {
    _("请先选择要复制的灯具、家具或电器。");
    return;
  }
  te();
  const value3 = (pixelsPerMeter() || 100) * 0.12;
  const value4 = value2.map((value5) => ({
    ...structuredClone(value5),
    id: Ce("item"),
    x: value5.x + value3,
    y: value5.y + value3,
  }));
  qi(value4);
  scene.items.push(...value4);
  if (value4.length === 1) {
    $t("item", value4[0].id);
  } else {
    X = null;
    he = value4.map((value5) => ({
      kind: "item",
      id: value5.id,
    }));
  }
  ye(value ? "lights" : "items");
  V();
  _("已复制 " + value4.length + " 个物件。");
}
function af() {
  const allowed = new Set([
    ...(X?.kind === "item" ? [X.id] : []),
    ...he.filter((value2) => value2.kind === "item").map((value2) => value2.id),
  ]);
  const value = st === "light";
  return scene.items.filter(
    (value2) => allowed.has(value2.id) && re.has(value2.type) === value,
  );
}
function rf() {
  const value = af();
  if (!value.length) {
    _("请先选择要复制的灯具、家具或电器。");
    return;
  }
  va = value.map((value2) => structuredClone(value2));
  ls = 0;
  _("已复制 " + va.length + " 个物件，按 ⌘/Ctrl+V 粘贴。");
}
function sf() {
  if (!va.length) {
    _("暂无可粘贴的物件。");
    return;
  }
  const value = va.every((value4) => re.has(value4.type));
  if (value && st !== "light") {
    mr("light");
  } else if (!value && st === "light") {
    mr("home");
  }
  te();
  ls += 1;
  const value2 = (pixelsPerMeter() || 100) * 0.12 * ls;
  const value3 = va.map((value4) => ({
    ...structuredClone(value4),
    id: Ce("item"),
    x: value4.x + value2,
    y: value4.y + value2,
    ...(re.has(value4.type) &&
    !scene.lightGroups.some((value5) => value5.id === value4.lightGroupId)
      ? {
          lightGroupId: Fo().id,
        }
      : {}),
  }));
  qi(value3);
  scene.items.push(...value3);
  if (value3.length === 1) {
    $t("item", value3[0].id);
  } else {
    X = null;
    he = value3.map((value4) => ({
      kind: "item",
      id: value4.id,
    }));
  }
  ye(value ? "lights" : "items");
  V();
  _("已粘贴 " + value3.length + " 个物件。");
}
async function tr() {
  const value = ++rs;
  wa = null;
  if (!scene.background?.url) {
    return;
  }
  const url = scene.background.url;
  await new Promise((fn9) => {
    let value2 = false;
    const fn10 = () => {
      if (!value2) {
        value2 = true;
        fn9();
      }
    };
    const value3 = new Image();
    const value4 = window.setTimeout(fn10, 2000);
    value3.addEventListener(
      "load",
      () => {
        if (value !== rs || scene.background?.url !== url) {
          fn10();
          return;
        }
        wa = value3;
        window.clearTimeout(value4);
        if (value2) {
          ae();
        } else {
          fn10();
        }
      },
      {
        once: true,
      },
    );
    value3.addEventListener(
      "error",
      () => {
        window.clearTimeout(value4);
        if (value === rs) {
          _("底图加载失败，请重新导入。", "error");
        }
        fn10();
      },
      {
        once: true,
      },
    );
    value3.src = url;
  });
}
async function lf(body) {
  if (body) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
      _("仅支持 PNG、JPG、JPEG、WebP 和 SVG 图片。", "error");
      return;
    }
    Qo.disabled = true;
    Qo.textContent = "上传中…";
    try {
      const value = await Go("/assets/user", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": body.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(body.name),
        },
      });
      te();
      scene.background = {
        assetId: value.assetId,
        url: value.url,
        name: value.name,
        width: value.width,
        height: value.height,
      };
      const value2 = Te();
      if (value2 && !value2.originInitialized) {
        value2.originX = value.width / 2;
        value2.originY = value.height / 2;
        value2.originInitialized = true;
      }
      scene.settings.backgroundVisible = true;
      await tr();
      oo();
      ye();
      V();
      Bt("scale");
      _("底图已导入，请在图上画一条已知长度的参考线。");
    } catch (error) {
      _(error.message || "底图上传失败。", "error");
    } finally {
      Qo.disabled = false;
      Qo.textContent = "导入";
    }
  }
}
function ao() {
  return ua;
}
function _s(value, value2, value3, value4) {
  if (!value) {
    return;
  }
  const value5 = THREE.MathUtils.degToRad(value2);
  const value6 = THREE.MathUtils.degToRad(value3);
  const value7 = Math.cos(value6) * value4;
  value.position.set(
    Math.cos(value5) * value7,
    Math.sin(value6) * value4,
    Math.sin(value5) * value7,
  );
}
function io() {
  const value = ao();
  const value2 = hn;
  if (!!ve && !!renderer) {
    ve.background = null;
    renderer.setClearColor(value.background, 0);
    ve.fog = null;
    renderer.toneMappingExposure = value2.exposure;
    if (eo) {
      eo.color.setHex(14278376);
      eo.groundColor.setHex(1909296);
      eo.intensity = value2.hemisphereIntensity;
    }
    if (Io) {
      Io.color.setHex(9673384);
      Io.intensity = value2.ambientIntensity;
    }
    if (se) {
      se.color.setHex(15922426);
      se.intensity = value2.mainIntensity;
      _s(se, value2.mainAzimuth, value2.mainElevation, 18.4);
      se.shadow.bias = -0.00012;
      se.shadow.normalBias = 0.016;
      se.shadow.radius = 1.75;
      se.shadow.blurSamples = 4;
      if (Lo) {
        se.shadow.radius = 1.2;
        se.shadow.blurSamples = 8;
      }
      se.shadow.intensity = value2.mainShadowIntensity;
    }
    if (Rn) {
      Rn.color.setHex(10528437);
      Rn.intensity = value2.fillIntensity;
      _s(Rn, value2.fillAzimuth, value2.fillElevation, 15.2);
    }
    if (Dn) {
      Dn.color.setHex(16185338);
      Dn.intensity = value2.topIntensity;
      _s(Dn, value2.topAzimuth, value2.topElevation, 16.1);
    }
  }
}
function ed(value) {
  const value2 = value === true;
  if (value2 !== Lo) {
    if (value2 && se?.shadow?.camera) {
      const camera = se.shadow.camera;
      Ri = {
        left: camera.left,
        right: camera.right,
        top: camera.top,
        bottom: camera.bottom,
        near: camera.near,
        far: camera.far,
      };
    }
    Lo = value2;
    io();
    if (!value2 && Ri && se?.shadow?.camera) {
      const camera = se.shadow.camera;
      Object.assign(camera, Ri);
      camera.updateProjectionMatrix();
      Ri = null;
    }
    if (se?.shadow) {
      se.shadow.needsUpdate = true;
    }
    if (renderer?.domElement) {
      renderer.domElement.dataset.exportShadowQuality = value2
        ? "high"
        : "realtime";
    }
  }
}
function cf(value) {
  if (!Lo) {
    return value;
  }
  const count = Math.max(
    1,
    Math.floor(finite(renderer?.capabilities?.maxTextureSize, cc)),
  );
  return Math.min(count, Math.max(value, cc));
}
function Ys() {
  for (const value of Ql) {
    const value2 = hn[value.dataset.baseLightControl];
    const value3 = value.step === "5";
    syncControlValue(
      value,
      value3 ? Math.round(value2) : Number(value2.toFixed(2)),
    );
  }
}
function jt(value) {
  hn = normalizeBaseLighting(value);
  Ys();
  io();
  nt({
    shadows: true,
  });
}
function td() {
  if (!T || !Me) {
    return;
  }
  const value = je?.open ? je : document.body;
  if (Me.parentElement !== value) {
    value.append(Me);
  }
  if (Me.hidden) {
    jt(T.baseLighting);
  }
  Me.hidden = false;
  const value2 = Me.getBoundingClientRect();
  if (
    value2.right > window.innerWidth - 8 ||
    value2.bottom > window.innerHeight - 8 ||
    value2.left < 8 ||
    value2.top < 8
  ) {
    Me.style.right = "auto";
    Me.style.left =
      clamp(value2.left, 8, Math.max(8, window.innerWidth - value2.width - 8)) +
      "px";
    Me.style.top =
      clamp(
        value2.top,
        8,
        Math.max(8, window.innerHeight - value2.height - 8),
      ) + "px";
  }
}
function qs() {
  if (Me) {
    if (T) {
      jt(T.baseLighting);
    }
    Me.hidden = true;
  }
}
function nd() {
  if (!T) {
    return;
  }
  const lighting = normalizeBaseLighting(hn);
  T.baseLighting = lighting;
  jt(lighting);
  V();
  vs?.postMessage({
    type: "base-lighting-saved",
    lighting: lighting,
  });
  $o();
  _("基础光设置已保存，导图和自动化控件已同步。", "success");
}
function od(element) {
  const baseLightControl = element.dataset.baseLightControl;
  if (baseLightControl in hn) {
    hn = normalizeBaseLighting({
      ...hn,
      [baseLightControl]: finite(element.value, hn[baseLightControl]),
    });
    io();
    nt({
      shadows: true,
    });
  }
}
function dt() {
  if (fe() === "all") {
    return T.combinedCameraSettings;
  } else {
    return scene.settings;
  }
}
function Pt() {
  if (dt()?.cameraMode === "perspective") {
    return "perspective";
  } else {
    return "orthographic";
  }
}
function gt() {
  if (dt()?.cameraView === "top") {
    return "top";
  } else {
    return "free";
  }
}
function en() {
  return (
    (((Math.round(finite(dt()?.cameraTopRotation, 0) / 90) * 90) % 360) + 360) %
    360
  );
}
function Va(value = en()) {
  const value2 = THREE.MathUtils.degToRad(value);
  return new THREE.Vector3(Math.sin(value2), 0, -Math.cos(value2));
}
function tn() {
  return clamp(finite(dt()?.cameraFocalLength, 50), 18, 120);
}
function ad() {
  return Yi()
    .filter(
      ({ item: value, group: value2 }) =>
        value2?.enabled !== false && finite(value.lightBrightness, 0) > 0,
    )
    .map(({ item: value }) => value);
}
function Us() {
  const value = ad();
  const domElement = renderer?.domElement;
  const previewPixels =
    domElement?.width && domElement?.height
      ? domElement.width * domElement.height
      : Math.max(window.innerWidth * window.innerHeight * 0.32, 120000);
  return {
    count: value.length,
    cost: adaptiveLightRenderCost(
      value.map((cost) => ({
        type: cost.type,
        angle: cost.lightAngle,
        brightness: cost.lightBrightness,
        enabled: true,
      })),
    ),
    budget: adaptiveDeviceLightBudget({
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      previewPixels: previewPixels,
    }),
  };
}
function df() {
  const value = Us();
  const value2 = Qt;
  if (bs) {
    if (
      Qt &&
      value.cost < Math.min(value.budget * 0.68, Math.max(Ms * 0.55, 1))
    ) {
      Qt = false;
      Pc = "";
      Ms = 0;
      Aa = 0;
    }
  } else {
    bs = true;
  }
  if (value2 && !Qt) {
    un += 1;
    Zt = false;
    Kt = false;
    Ne.hidden = true;
  }
  return value;
}
function Ye() {
  df();
  return Qt;
}
function hf(value) {
  if (!Qt && !!value?.sufficient) {
    Qt = true;
    bs = true;
    Pc = "frame-rate";
    Ms = Us().cost;
    Ec = value.fps;
    un += 1;
    Kt = true;
    He();
  }
}
function id() {
  if (Qt) {
    return;
  }
  const value = assessAdaptiveRenderFrames(Fa);
  if (!value.sufficient) {
    return;
  }
  const value2 = Us();
  const value3 = value2.cost / Math.max(value2.budget, 1);
  const value4 = value3 >= 1.8 ? 3 : value3 >= 1 ? 4 : 5;
  Ec = value.fps;
  if (value.severe) {
    Aa = value4;
  } else if (value.slow) {
    Aa += 1;
  } else if (value.smooth) {
    Aa = 0;
  }
  if (Aa >= value4) {
    hf(value);
  }
}
function uf(value = performance.now()) {
  if (!_e || W || Qt || !ad().length) {
    Co = 0;
    return;
  }
  if (Co > 0) {
    const value2 = value - Co;
    if (value2 >= 8 && value2 <= 120) {
      Fa.push(value2);
    }
  }
  Co = value;
  if (!(Fa.length < 24)) {
    id();
    Fa.splice(0, 12);
  }
}
function nr() {
  return scene.settings?.livePreviewEnabled !== false;
}
function Na() {
  const value = nr();
  for (const element of _l) {
    const value2 = element.dataset.previewSync === (value ? "live" : "manual");
    element.classList.toggle("active", value2);
    element.setAttribute("aria-pressed", String(value2));
  }
  ia.hidden = value;
  ia.disabled = !Po;
  ia.classList.toggle("is-dirty", Po);
  ia.textContent = Po ? "待更新 · 更新" : "已更新";
}
function ro(value = Pt()) {
  for (const element of Kl) {
    element.classList.toggle("active", element.dataset.cameraMode === value);
  }
  ff(value);
}
function so(value = gt()) {
  for (const element of Ul) {
    const value2 = element.dataset.cameraView === value;
    element.classList.toggle("active", value2);
    element.setAttribute("aria-pressed", String(value2));
  }
  for (const value2 of Zl) {
    value2.disabled = value !== "top";
  }
}
function ff(value = Pt()) {
  for (const value2 of hi) {
    syncControlValue(value2, Math.round(tn()));
    value2.disabled = value !== "perspective";
    value2
      .closest(".camera-focal-control")
      ?.classList.toggle("is-disabled", value2.disabled);
  }
}
function Ot(value = camera, value2 = tn()) {
  if (value?.isPerspectiveCamera) {
    value.setFocalLength(clamp(finite(value2, 50), 18, 120));
    value.updateProjectionMatrix();
  }
}
function He() {
  if (!Q) {
    return;
  }
  const value = Ye();
  Ut?.setEnabled(!value);
  Q.enableRotate = gt() !== "top";
  if (di) {
    di.hidden = true;
    di.title = "";
    di.textContent = "";
  }
  if (ci) {
    ci.hidden = true;
    ci.disabled = true;
  }
}
function rd(value = false) {
  return Math.min(window.devicePixelRatio || 1, value ? 1 : 1.6);
}
const gf = new URLSearchParams(window.location.search).has("render-stats-test");
const Gn =
  new URLSearchParams(window.location.search).get("performance-diagnostics") ===
  "1";
const sd = 240;
const pf = 750;
const mf = 4;
const tt = {
  hud: null,
  frameIntervals: [],
  cpuRenderTimes: [],
  gpuRenderTimes: [],
  lastMotionRenderAt: 0,
  lastPublishAt: 0,
  motionActive: false,
  gpuContext: null,
  gpuExtension: null,
  gpuQueryActive: null,
  gpuQueriesPending: [],
  gpuStatus: "未初始化",
};
function ld() {
  if (!gf || !renderer) {
    return;
  }
  _o();
  const domElement = renderer.domElement;
  const value = {
    calls: Number(domElement.dataset.renderCalls || 0),
    triangles: Number(domElement.dataset.renderTriangles || 0),
    instanceSaved: Number(domElement.dataset.instanceDrawCallsSaved || 0),
    staticItemSaved: Number(domElement.dataset.staticItemDrawCallsSaved || 0),
  };
  let haBridgeRenderStatsTestOutput = document.querySelector(
    "#ha-bridge-render-stats-test-output",
  );
  if (!haBridgeRenderStatsTestOutput) {
    haBridgeRenderStatsTestOutput = document.createElement("output");
    haBridgeRenderStatsTestOutput.id = "ha-bridge-render-stats-test-output";
    document.body.append(haBridgeRenderStatsTestOutput);
  }
  haBridgeRenderStatsTestOutput.textContent =
    "渲染统计：" +
    value.calls +
    " 次调用，" +
    value.triangles +
    " 个三角面；重复实例节省 " +
    value.instanceSaved +
    " 次，跨模型材质合批节省 " +
    value.staticItemSaved +
    " 次。";
  document.documentElement.dataset.renderStatsTest = JSON.stringify(value);
}
function Zs(value, value2) {
  if (Number.isFinite(value2)) {
    value.push(value2);
    if (value.length > sd) {
      value.splice(0, value.length - sd);
    }
  }
}
function Ks(value) {
  if (value.length) {
    return value.reduce((value2, value3) => value2 + value3, 0) / value.length;
  } else {
    return null;
  }
}
function or(value, value2) {
  if (!value.length) {
    return null;
  }
  const value3 = [...value].sort((value5, value6) => value5 - value6);
  const value4 = Math.min(
    value3.length - 1,
    Math.max(0, Math.ceil(value3.length * value2) - 1),
  );
  return value3[value4];
}
function $n(value, value2 = 1) {
  if (Number.isFinite(value)) {
    return Number(value.toFixed(value2));
  } else {
    return null;
  }
}
function wf() {
  if (!Gn || !renderer || tt.hud) {
    return;
  }
  const element = document.createElement("output");
  element.id = "performance-diagnostics";
  element.className = "performance-diagnostics";
  element.setAttribute("aria-label", "3D 性能诊断");
  element.setAttribute("aria-live", "off");
  element.textContent = "性能诊断初始化中…";
  f("#preview-3d")?.append(element);
  tt.hud = element;
  tt.gpuContext = renderer.getContext?.() || null;
  tt.gpuExtension =
    tt.gpuContext?.getExtension?.("EXT_disjoint_timer_query_webgl2") || null;
  tt.gpuStatus = tt.gpuExtension ? "等待样本" : "不可用";
}
function yf(value) {
  if (!Gn || !value) {
    return false;
  }
  const value2 = tt;
  const gpuContext = value2.gpuContext;
  const gpuExtension = value2.gpuExtension;
  if (
    !gpuContext ||
    !gpuExtension ||
    value2.gpuQueryActive ||
    value2.gpuQueriesPending.length >= mf
  ) {
    return false;
  }
  try {
    const value3 = gpuContext.createQuery();
    if (value3) {
      gpuContext.beginQuery(gpuExtension.TIME_ELAPSED_EXT, value3);
      value2.gpuQueryActive = value3;
      value2.gpuStatus = "采样中";
      return true;
    } else {
      return false;
    }
  } catch {
    value2.gpuStatus = "不可用";
    return false;
  }
}
function xf(value) {
  if (!value) {
    return;
  }
  const value2 = tt;
  const gpuContext = value2.gpuContext;
  const gpuExtension = value2.gpuExtension;
  const gpuQueryActive = value2.gpuQueryActive;
  value2.gpuQueryActive = null;
  if (!!gpuContext && !!gpuExtension && !!gpuQueryActive) {
    try {
      gpuContext.endQuery(gpuExtension.TIME_ELAPSED_EXT);
      value2.gpuQueriesPending.push(gpuQueryActive);
    } catch {
      gpuContext.deleteQuery?.(gpuQueryActive);
      value2.gpuStatus = "不可用";
    }
  }
}
function vf() {
  if (!Gn) {
    return;
  }
  const value = tt;
  const gpuContext = value.gpuContext;
  const gpuExtension = value.gpuExtension;
  if (!gpuContext || !gpuExtension || !value.gpuQueriesPending.length) {
    return;
  }
  if (gpuContext.getParameter(gpuExtension.GPU_DISJOINT_EXT)) {
    for (const value3 of value.gpuQueriesPending.splice(0)) {
      gpuContext.deleteQuery(value3);
    }
    value.gpuRenderTimes.length = 0;
    value.gpuStatus = "采样失效";
    return;
  }
  const value2 = [];
  for (const value3 of value.gpuQueriesPending) {
    if (
      !gpuContext.getQueryParameter(value3, gpuContext.QUERY_RESULT_AVAILABLE)
    ) {
      value2.push(value3);
      continue;
    }
    const value4 = gpuContext.getQueryParameter(
      value3,
      gpuContext.QUERY_RESULT,
    );
    Zs(value.gpuRenderTimes, value4 / 1000000);
    gpuContext.deleteQuery(value3);
    value.gpuStatus = "可用";
  }
  value.gpuQueriesPending = value2;
}
function bf(value, value2, value3) {
  if (!Gn) {
    return;
  }
  const value4 = tt;
  if (value3) {
    Zs(value4.cpuRenderTimes, value2);
    if (value4.lastMotionRenderAt > 0) {
      const value5 = value - value4.lastMotionRenderAt;
      if (value5 >= 2 && value5 <= 250) {
        Zs(value4.frameIntervals, value5);
      }
    }
    value4.lastMotionRenderAt = value;
  } else {
    value4.lastMotionRenderAt = 0;
  }
}
function Mf() {
  const allowed = new Set();
  let meshes = 0;
  let lights = 0;
  let visibleLights = 0;
  let activeSpotShadows = 0;
  ve?.traverse((value) => {
    if (value.isMesh) {
      meshes += 1;
      const list = Array.isArray(value.material)
        ? value.material
        : [value.material];
      for (const value2 of list) {
        if (value2) {
          allowed.add(value2);
        }
      }
    }
    if (value.isLight) {
      lights += 1;
      if (value.visible !== false && finite(value.intensity, 0) > 0) {
        visibleLights += 1;
      }
      if (value.isSpotLight && value.castShadow && value.visible !== false) {
        activeSpotShadows += 1;
      }
    }
  });
  if (renderer?.domElement?.dataset.spotShadowMode === "atlas") {
    activeSpotShadows = Math.max(
      activeSpotShadows,
      Math.floor(finite(renderer.domElement.dataset.activeSpotShadows, 0)),
    );
  }
  const activeUserFixtures = Yi().filter(
    ({ item: value, group: value2 }) =>
      value2?.enabled !== false && finite(value.lightBrightness, 0) > 0,
  ).length;
  return {
    meshes: meshes,
    materials: allowed.size,
    lights: lights,
    visibleLights: visibleLights,
    activeUserFixtures: activeUserFixtures,
    activeSpotShadows: activeSpotShadows,
  };
}
function Sf(value = performance.now()) {
  if (!Gn || !renderer || !tt.hud) {
    return;
  }
  const value2 = tt;
  if (value - value2.lastPublishAt < pf) {
    return;
  }
  value2.lastPublishAt = value;
  const domElement = renderer.domElement;
  const value3 = Ks(value2.frameIntervals);
  const value4 = or(value2.frameIntervals, 0.5);
  const scene = Mf();
  const length = renderer.info.programs?.length;
  const value5 = {
    enabled: true,
    motionActive: value2.motionActive,
    frame: {
      samples: value2.frameIntervals.length,
      averageFps: $n(value3 ? 1000 / value3 : null),
      medianFps: $n(value4 ? 1000 / value4 : null),
      p95Ms: $n(or(value2.frameIntervals, 0.95), 2),
    },
    cpuRenderMs: {
      samples: value2.cpuRenderTimes.length,
      average: $n(Ks(value2.cpuRenderTimes), 2),
      p95: $n(or(value2.cpuRenderTimes, 0.95), 2),
    },
    gpuRenderMs: {
      supported: !!value2.gpuExtension,
      status: value2.gpuStatus,
      samples: value2.gpuRenderTimes.length,
      average: $n(Ks(value2.gpuRenderTimes), 2),
      p95: $n(or(value2.gpuRenderTimes, 0.95), 2),
    },
    render: {
      calls: Number(domElement.dataset.renderCalls || 0),
      triangles: Number(domElement.dataset.renderTriangles || 0),
      lines: Number(domElement.dataset.renderLines || 0),
    },
    memory: {
      geometries: Number(renderer.info.memory.geometries || 0),
      textures: Number(renderer.info.memory.textures || 0),
      programs: Number.isFinite(length) ? length : null,
    },
    scene: scene,
    viewport: {
      devicePixelRatio: $n(renderer.getPixelRatio(), 2),
      canvasWidth: domElement.width,
      canvasHeight: domElement.height,
      cssWidth: Math.round(domElement.clientWidth),
      cssHeight: Math.round(domElement.clientHeight),
    },
    lighting: {
      adaptiveCacheEnabled: Qt,
      residentCacheMode: Fi,
      cacheReady: Zt,
    },
  };
  const value6 = value5.frame.samples
    ? value5.frame.averageFps +
      " / " +
      value5.frame.medianFps +
      " FPS · P95 " +
      value5.frame.p95Ms +
      " ms"
    : "移动镜头后采样";
  const value7 = value5.gpuRenderMs.samples
    ? value5.gpuRenderMs.average + " ms · P95 " + value5.gpuRenderMs.p95 + " ms"
    : value5.gpuRenderMs.status;
  value2.hud.innerHTML = [
    "<strong>3D 性能诊断</strong><span>" +
      (value2.motionActive ? "交互 / 阻尼中" : "空闲") +
      "</span>",
    "<span>帧率</span><b>" + value6 + "</b>",
    "<span>CPU 提交</span><b>" +
      (value5.cpuRenderMs.average ?? "—") +
      " ms · P95 " +
      (value5.cpuRenderMs.p95 ?? "—") +
      " ms</b>",
    "<span>GPU 渲染</span><b>" + value7 + "</b>",
    "<span>绘制</span><b>" +
      value5.render.calls +
      " calls · " +
      value5.render.triangles.toLocaleString() +
      " tris</b>",
    "<span>场景</span><b>" +
      scene.meshes +
      " mesh · " +
      scene.materials +
      " 材质实例</b>",
    "<span>资源</span><b>" +
      value5.memory.geometries +
      " 几何 · " +
      value5.memory.textures +
      " 纹理 · " +
      (value5.memory.programs ?? "—") +
      " 程序</b>",
    "<span>灯光</span><b>" +
      scene.visibleLights +
      "/" +
      scene.lights +
      " 可见 · " +
      scene.activeUserFixtures +
      " 用户灯 · " +
      scene.activeSpotShadows +
      " 阴影</b>",
    "<span>画布</span><b>" +
      value5.viewport.canvasWidth +
      "×" +
      value5.viewport.canvasHeight +
      " · DPR " +
      value5.viewport.devicePixelRatio +
      "</b>",
    "<span>光照缓存</span><b>" +
      (value5.lighting.adaptiveCacheEnabled
        ? "自适应"
        : value5.lighting.residentCacheMode
          ? "驻留"
          : "实时") +
      "</b>",
  ].join("");
  document.documentElement.dataset.performanceDiagnostics =
    JSON.stringify(value5);
}
function Pf(value, value2) {
  if (Gn) {
    tt.motionActive = value2;
    if (!value2) {
      tt.lastMotionRenderAt = 0;
    }
    vf();
    Sf(value);
  }
}
const cd = 150;
function ar() {
  To = true;
  Ta = false;
}
function dd() {
  if (!Zt || Ne.hidden) {
    return;
  }
  const value = Ne.getContext("2d");
  if (value) {
    value.clearRect(0, 0, Ne.width, Ne.height);
    for (const [value2, value3] of Sc) {
      const value4 = clamp(finite(ka.get(value2), 0), 0, 1);
      if (!(value4 <= 0.001)) {
        value.save();
        value.globalAlpha = value4;
        value.drawImage(value3, 0, 0);
        value.restore();
      }
    }
  }
}
function Ef(value, value2 = cd) {
  const value3 = [...new Set(value)].filter(Boolean);
  if (!value3.length) {
    return;
  }
  const value4 = value3.map((value7) => ({
    groupId: Fs(xe, value7),
    from: clamp(
      finite(ka.get(Fs(xe, value7)), Qs(value7)?.enabled === false ? 0 : 1),
      0,
      1,
    ),
    to: Qs(value7)?.enabled === false ? 0 : 1,
  }));
  cancelAnimationFrame(Ai);
  if (!Zt) {
    for (const value7 of value4) {
      ka.set(value7.groupId, value7.to);
    }
    if (!Mt) {
      lo(0);
    }
    return;
  }
  const value5 = performance.now();
  const value6 = (value7) => {
    const value8 = clamp((value7 - value5) / value2, 0, 1);
    const value9 = value8 * value8 * (3 - value8 * 2);
    for (const value10 of value4) {
      ka.set(
        value10.groupId,
        value10.from + (value10.to - value10.from) * value9,
      );
    }
    dd();
    if (value8 < 1) {
      Ai = requestAnimationFrame(value6);
    } else {
      Ai = 0;
    }
  };
  Ai = requestAnimationFrame(value6);
}
function Qs(value) {
  return scene.lightGroups?.find((value2) => value2.id === value) || null;
}
function Lf(value, value2 = cd) {
  if (!B) {
    return false;
  }
  const allowed = new Set(value);
  const value3 = Ye() && !W;
  const value4 = [];
  B.traverse((object) => {
    if (!object.isLight || !allowed.has(object.userData?.lightGroupId)) {
      return;
    }
    const to2 =
      Qs(object.userData.lightGroupId)?.enabled !== false && !value3
        ? finite(object.userData.lightOnIntensity, 0)
        : 0;
    if (to2 > 0) {
      object.visible = true;
    }
    value4.push({
      object: object,
      from: finite(object.intensity, 0),
      to: to2,
    });
  });
  if (!value4.length) {
    return false;
  }
  if (value4.some(({ to: value7 }) => value7 > 0)) {
    On(B, {
      rebuildAtlas: false,
    });
  }
  cancelAnimationFrame(Gi);
  const value5 = performance.now();
  const value6 = (value7) => {
    const value8 = clamp((value7 - value5) / value2, 0, 1);
    const value9 = value8 * value8 * (3 - value8 * 2);
    for (const value10 of value4) {
      value10.object.intensity =
        value10.from + (value10.to - value10.from) * value9;
    }
    ar();
    if (value8 < 1) {
      Gi = requestAnimationFrame(value6);
    } else {
      Gi = 0;
      let value10 = false;
      for (const value11 of value4) {
        if (!(value11.to > 0)) {
          value11.object.visible = false;
          value10 = true;
        }
      }
      if (value10) {
        On(B, {
          rebuildAtlas: false,
        });
      }
    }
  };
  Gi = requestAnimationFrame(value6);
  return true;
}
function hd(value) {
  const value2 = [...new Set(value)].filter(Boolean);
  if (Ye() && !W) {
    Ef(value2);
  } else if (!Lf(value2)) {
    qe({
      scope: "lights",
      preserveLightCache: true,
    });
  }
  fn();
  St();
  ae();
  He();
}
function nt(value = {}) {
  To = true;
  Ta = false;
  if (value.shadows === true) {
    ve?.traverse((value2) => {
      if (value2.isLight && value2.castShadow && value2.shadow) {
        value2.shadow.needsUpdate = true;
      }
    });
  }
  if (!Di) {
    if (value.preserveLightCache === true && Ye() && !W) {
      if (!Zt && !Mt) {
        lo();
      }
      return;
    }
    if (Ye() && !W) {
      un += 1;
      Kt = true;
      if (value.scene === true || !Zt) {
        Ne.hidden = true;
      }
      lo();
      He();
    } else {
      window.clearTimeout(Fn);
      Fn = null;
      Zt = false;
      Kt = false;
      Ne.hidden = true;
    }
  }
}
function If() {
  Di = true;
  try {
    if (fe() === "all") {
      Lt({
        preserveLightCache: true,
      });
    } else {
      wl({
        preserveLightCache: true,
      });
    }
  } finally {
    Di = false;
  }
}
function Js() {
  const index = new Map();
  B?.traverse((value2) => {
    const lightItemId = value2.userData?.lightItemId;
    if (!value2.isLight || !lightItemId) {
      return;
    }
    const value3 = Hc(value2.userData?.lightFloorId, lightItemId);
    if (!index.has(value3)) {
      index.set(value3, []);
    }
    index.get(value3).push(value2);
  });
  return index;
}
function Tf(value) {
  let value2 = Js();
  if (value.every((value3) => value2.has(value3.itemKey))) {
    return value2;
  }
  Fi = true;
  Yn = new Set();
  try {
    If();
  } finally {
    Yn = null;
    Fi = false;
  }
  value2 = Js();
  return value2;
}
function js(value, value2 = "") {
  for (const [value3, value4] of value) {
    const value5 = value3 === value2;
    for (const value6 of value4) {
      value6.visible = value5;
      value6.intensity = value5
        ? finite(value6.userData?.lightOnIntensity, 0)
        : 0;
      if (value6.isSpotLight) {
        value6.castShadow = value5;
        if (value5 && value6.shadow && !value6.shadow.map) {
          value6.shadow.needsUpdate = true;
        }
      }
    }
  }
  ar();
}
function Cf() {
  return new Set(
    Yi()
      .filter(
        ({ item: value, group: value2 }) =>
          value2?.enabled !== false && finite(value.lightBrightness, 0) > 0,
      )
      .map(({ itemKey: value }) => value),
  );
}
function kf(value) {
  const value2 = Cf();
  for (const [value3, value4] of value) {
    const value5 = value2.has(value3);
    for (const value6 of value4) {
      value6.visible = value5;
      value6.intensity = value5
        ? finite(value6.userData?.lightOnIntensity, 0)
        : 0;
      if (value6.isSpotLight) {
        value6.castShadow = false;
      }
    }
  }
  ar();
}
function Rf() {
  if (!ln || !renderer?.domElement) {
    return;
  }
  const domElement = renderer.domElement;
  if (!domElement.width || !domElement.height) {
    return;
  }
  ln.width = domElement.width;
  ln.height = domElement.height;
  const value = ln.getContext("2d");
  if (value) {
    value.globalCompositeOperation = "source-over";
    value.globalAlpha = 1;
    value.fillStyle = "#" + ao().background.toString(16).padStart(6, "0");
    value.fillRect(0, 0, ln.width, ln.height);
    value.drawImage(domElement, 0, 0);
    if (!Ne.hidden) {
      value.drawImage(Ne, 0, 0);
    }
    ln.hidden = false;
  }
}
function ud() {
  if (ln) {
    ln.hidden = true;
  }
}
function Df() {
  Rf();
  return new Promise((value) =>
    requestAnimationFrame(() => requestAnimationFrame(value)),
  );
}
function fd(value, value2) {
  const value3 = document.createElement("canvas");
  value3.width = value;
  value3.height = value2;
  const value4 = value3.getContext("2d", {
    willReadFrequently: true,
  });
  if (!value4) {
    throw new Error("当前浏览器无法创建多灯缓存画布。");
  }
  value4.drawImage(renderer.domElement, 0, 0, value, value2);
  return value4.getImageData(0, 0, value, value2);
}
function el() {
  for (let value = 0; value < 3; value += 1) {
    renderer.render(ve, camera);
  }
}
function ir() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else {
    return new Promise((fn9) => requestAnimationFrame(() => fn9()));
  }
}
function gd() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else if (globalThis.requestIdleCallback) {
    return new Promise((fn9) =>
      requestIdleCallback(() => fn9(), {
        timeout: 80,
      }),
    );
  } else {
    return new Promise((fn9) => requestAnimationFrame(() => fn9()));
  }
}
function lo(value = 420) {
  if (!!renderer && !!B && !W && !_e && !lt && !Mt && !!Ye()) {
    window.clearTimeout(Fn);
    Fn = window.setTimeout(() => {
      const value2 = _t.modelLoadState();
      if (value2.active > 0 || value2.queued > 0) {
        Fn = null;
        lo(240);
        return;
      }
      Ff();
    }, value);
  }
}
function pd() {
  if (!!Ye() && !W && !Mt) {
    Kt = true;
    lo(0);
    He();
  }
}
async function Ff() {
  Fn = null;
  if (!renderer || W || _e || lt || Mt || !Ye()) {
    return;
  }
  const value = un;
  const value2 = Yi().filter(
    ({ item: value5 }) => finite(value5.lightBrightness, 0) > 0,
  );
  const domElement = renderer.domElement;
  const width = domElement.width;
  const height = domElement.height;
  if (!width || !height || !value2.length) {
    return;
  }
  Mt = true;
  Kt = true;
  const enabled = Q.enabled;
  const index = new Map();
  let value4 = false;
  He();
  try {
    const value5 = Ne.getContext("2d");
    if (!value5) {
      throw new Error("当前浏览器无法显示多灯缓存。");
    }
    if (Ne.hidden || !Zt || Ne.width !== width || Ne.height !== height) {
      Ne.width = width;
      Ne.height = height;
      value5.clearRect(0, 0, width, height);
    }
    const value6 = document.createElement("canvas");
    value6.width = width;
    value6.height = height;
    const value7 = value6.getContext("2d");
    const value8 = document.createElement("canvas");
    value8.width = width;
    value8.height = height;
    const value9 = value8.getContext("2d");
    if (!value7 || !value9) {
      throw new Error("当前浏览器无法合成多灯缓存。");
    }
    const index2 = new Map();
    const value11 = Tf(value2);
    await Df();
    if (value !== un || W || _e || lt || !Ye()) {
      return;
    }
    js(value11);
    value7.clearRect(0, 0, width, height);
    B.traverse((value13) => {
      if (value13.userData?.exportRole === "grid") {
        index.set(value13, value13.visible);
        value13.visible = false;
      }
    });
    el();
    const value12 = fd(width, height);
    for (const value13 of value2) {
      await gd();
      if (value !== un || W || _e || lt || !Ye()) {
        break;
      }
      const {
        item: value14,
        group: value15,
        itemKey: value16,
        groupKey: value17,
      } = value13;
      js(value11, value16);
      el();
      const value18 = fd(width, height);
      const value19 = buildLightDeltaPixels(value12.data, value18.data);
      value9.clearRect(0, 0, width, height);
      value9.putImageData(new ImageData(value19, width, height), 0, 0);
      value7.drawImage(value8, 0, 0);
      let value20 = index2.get(value17);
      if (!value20) {
        value20 = document.createElement("canvas");
        value20.width = width;
        value20.height = height;
        value20.userData = {
          enabled: value15?.enabled !== false,
        };
        index2.set(value17, value20);
      }
      value20.getContext("2d")?.drawImage(value8, 0, 0);
      await ir();
      if (value !== un || W || _e || lt || !Ye()) {
        break;
      }
    }
    if (value === un && !W && Ye()) {
      Sc = index2;
      for (const [value13, value14] of index2) {
        ka.set(value13, value14.userData?.enabled === false ? 0 : 1);
      }
      Zt = true;
      Kt = false;
      Ne.hidden = false;
      dd();
      value4 = true;
    }
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-light-cache",
    });
    console.error(error);
    Zt = !Ne.hidden;
  } finally {
    for (const [value6, value7] of index) {
      value6.visible = value7;
    }
    const value5 = Js();
    if (_e) {
      kf(value5);
    } else {
      js(value5);
    }
    el();
    if (value4) {
      requestAnimationFrame(ud);
    } else {
      ud();
    }
    Q.enabled = enabled;
    Mt = false;
    He();
    if (Kt && Ye() && !W) {
      lo();
    }
  }
}
function Bo() {
  window.clearTimeout(Da);
  Da = null;
  lt = true;
  window.clearTimeout(Fn);
  Fn = null;
  if (Mt) {
    un += 1;
    Kt = true;
  }
}
function Xa() {
  window.clearTimeout(Da);
  Da = window.setTimeout(() => {
    Da = null;
    lt = false;
    if (So.size && !Ei) {
      const value = [...So];
      const scope =
        value.includes("all") || value.length > 1 ? "all" : value[0];
      qe({
        scope: scope,
        preserveLightCache: !Ii,
      });
    }
    if (Kt) {
      lo(420);
    }
    if (pa) {
      pc();
    }
  }, 120);
}
function md(value, { preserveLightCache = false } = {}) {
  if (!renderer || (W && !$e)) {
    return;
  }
  const value2 = W ? xd(value) : rd(value);
  if (Math.abs(renderer.getPixelRatio() - value2) > 0.000001) {
    renderer.setPixelRatio(value2);
  }
  nt({
    preserveLightCache: preserveLightCache,
  });
}
function Af() {
  window.clearTimeout(Ca);
  Ca = null;
  _e = true;
  Ra = false;
  Fa = [];
  Co = 0;
  He();
}
function Gf() {
  if (!Ra) {
    Ra = true;
    He();
    md(true, {
      preserveLightCache: true,
    });
  }
}
function $f() {
  const value = Ra;
  id();
  _e = false;
  Ra = false;
  Co = 0;
  He();
  window.clearTimeout(Ca);
  if (!value) {
    if (W && !ze) {
      Za();
    }
    return;
  }
  Ca = window.setTimeout(() => {
    Ca = null;
    md(false, {
      preserveLightCache: true,
    });
  }, 140);
  if (W && !ze) {
    Za();
  }
}
function zn() {
  const value = (T?.floors.length || 0) > 1;
  const value2 = fe() === "all";
  zh.hidden = value2;
  Bh.hidden = !value || !value2;
  Wh.hidden = !value || !value2;
  syncControlValue(ui, finite(T?.previewFloorGap, 3).toFixed(1));
  const value3 = !!scene.settings?.fixedCameraView;
  const value4 = !!T?.combinedFixedCameraView;
  Nr.disabled = !value3;
  Nr.classList.toggle("has-saved-view", value3);
  Xr.disabled = !value4;
  Xr.classList.toggle("has-saved-view", value4);
  const value5 = value2 ? value4 : value3;
  Yr.textContent = value2 ? "保存总览" : "保存视角";
  Yr.title = value2
    ? "记录当前导图的全楼角度和投影方式"
    : "记录当前导图的角度、缩放和投影方式";
  f("#export-use-fixed").textContent = value2 ? "恢复总览" : "恢复视角";
  f("#export-use-fixed").title = value2
    ? "恢复已保存的全楼总览视角"
    : "恢复当前楼层已保存的视角";
  f("#export-use-fixed").disabled = !!ze || !value5;
  f("#export-use-fixed").classList.toggle("has-saved-view", value5);
}
function _a() {
  if (fe() === "all") {
    return T?.combinedFixedCameraView;
  } else {
    return scene.settings?.fixedCameraView;
  }
}
function zf(value) {
  if (fe() === "all") {
    T.combinedFixedCameraView = value;
  } else {
    scene.settings.fixedCameraView = value;
  }
}
function wd(value) {
  const value2 = new OrbitControls(value, renderer.domElement);
  value2.enableDamping = true;
  value2.rotateSmoothing = 8;
  value2.rotateSmoothingThreshold = 0.000001;
  value2.dampingFactor = 0.22;
  value2.minDistance = 2;
  value2.maxDistance = 100;
  value2.minZoom = 0.35;
  value2.maxZoom = 6;
  value2.maxPolarAngle = Math.PI * 0.49;
  value2.target.set(0, 0.6, 0);
  value2.addEventListener("start", Af);
  value2.addEventListener("change", () => {
    Ya(value, value2.target);
    if (_e) {
      Gf();
      nt({
        preserveLightCache: true,
      });
    } else {
      nt();
    }
  });
  value2.addEventListener("change", () => {
    if (!W || ze) {
      return;
    }
    const activeExportPresetSlot = normalizeActiveExportPresetSlot(
      T?.activeExportPresetSlot,
      T?.exportPresets?.length,
    );
    if (!qt && !T?.exportPresets?.[activeExportPresetSlot]) {
      qt = true;
      nn();
    }
  });
  value2.addEventListener("end", $f);
  return value2;
}
const Bf = 0.02;
const Of = 0.32;
const Wf = 0.006;
function Ya(value = camera, value2 = Q?.target) {
  if (!value || !value2) {
    return false;
  }
  const count = Math.max(value.position.distanceTo(value2), 1);
  const value3 = value.isPerspectiveCamera ? clamp(count * Wf, Bf, Of) : 0.02;
  const count2 = Math.max(count * (value.isPerspectiveCamera ? 8 : 5), 100);
  if (
    Math.abs(value.near - value3) < 0.000001 &&
    Math.abs(value.far - count2) < 0.0001
  ) {
    return false;
  } else {
    value.near = value3;
    value.far = count2;
    value.updateProjectionMatrix();
    return true;
  }
}
function co(value, value2) {
  if (value?.isOrthographicCamera) {
    return (
      Math.abs(value.top - value.bottom) / Math.max(value.zoom || 1, 0.000001)
    );
  }
  if (value?.isPerspectiveCamera) {
    const count = Math.max(value.position.distanceTo(value2), 0.0001);
    const value3 = THREE.MathUtils.degToRad(value.getEffectiveFOV());
    return count * 2 * Math.tan(value3 / 2);
  }
  return 10;
}
async function tl() {
  if (!camera || !Q) {
    return;
  }
  const value = fe() === "all" ? "总览视角" : "当前层视角";
  if (!W) {
    te();
  }
  const target = Q.target;
  zf({
    mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
    view: gt(),
    topRotation: en(),
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: target.x,
      y: target.y,
      z: target.z,
    },
    visibleHeight: co(camera, target),
    fov: camera.isPerspectiveCamera ? camera.fov : 36,
    focalLength: camera.isPerspectiveCamera ? tn() : null,
  });
  zn();
  if (W) {
    pe.textContent = value + "已保存";
    await $o();
    _(value + "已保存。");
    return;
  }
  V();
  window.clearTimeout(Cn);
  Cn = null;
  await $o();
  _(Tn === Jn ? value + "已保存。" : value + "已记录，正在保存…");
}
function rr(value = {}) {
  const value2 = _a();
  if (!value2 || !camera || !Q) {
    return;
  }
  const value3 = value2.mode !== Pt();
  const value4 = value2.view !== gt();
  const value5 = value2.topRotation !== en();
  const value6 =
    value2.focalLength !== null && Math.abs(value2.focalLength - tn()) > 1e-8;
  const value7 = value.recordChange !== false;
  if ((value3 || value4 || value5 || value6) && value7) {
    te();
  }
  const value8 = dt();
  value8.cameraMode = value2.mode;
  value8.cameraView = value2.view;
  value8.cameraTopRotation = value2.topRotation;
  if (value2.focalLength !== null) {
    value8.cameraFocalLength = value2.focalLength;
  }
  Wt(value2.mode, {
    preserveView: false,
  });
  const value9 = new THREE.Vector3(
    value2.target.x,
    value2.target.y,
    value2.target.z,
  );
  camera.position.set(value2.position.x, value2.position.y, value2.position.z);
  camera.up.copy(
    value2.view === "top" ? Va(value2.topRotation) : new THREE.Vector3(0, 1, 0),
  );
  camera.userData.frameSize = value2.visibleHeight;
  camera.userData.cameraView = value2.view;
  camera.userData.topRotation = value2.topRotation;
  camera.userData.viewportAspect ||= Math.max(
    f("#preview-3d").clientWidth / Math.max(f("#preview-3d").clientHeight, 1),
    0.1,
  );
  camera.zoom = 1;
  if (camera.isPerspectiveCamera) {
    camera.aspect = camera.userData.viewportAspect;
    if (value2.focalLength !== null) {
      Ot(camera, value2.focalLength);
    } else {
      camera.fov = value2.fov;
      camera.updateProjectionMatrix();
      value8.cameraFocalLength = clamp(camera.getFocalLength(), 18, 120);
    }
  } else {
    ho(value2.visibleHeight, camera.userData.viewportAspect, camera);
  }
  Ya(camera, value9);
  camera.lookAt(value9);
  camera.updateProjectionMatrix();
  Q.target.copy(value9);
  He();
  Q.update();
  ro(value2.mode);
  so(value2.view);
  if ((value3 || value4 || value5 || value6) && value7) {
    V();
  }
  if (!value.silent) {
    const value10 = fe() === "all" ? "总览视角" : "当前层视角";
    _("已恢复上次保存的" + value10 + "。");
  }
}
function Oo(value, value2 = {}) {
  const value3 = value === "top" ? "top" : "free";
  const value4 = en();
  so(value3);
  if (!camera || !Q) {
    return;
  }
  if (
    camera.userData.cameraView === value3 &&
    (value3 !== "top" || camera.userData.topRotation === value4) &&
    value2.force !== true
  ) {
    He();
    return;
  }
  if (value3 === "free") {
    pn({
      view: "free",
    });
    return;
  }
  const value5 = Q.target.clone();
  const value6 = co(camera, value5);
  const count = Math.max(camera.position.distanceTo(value5), 8);
  camera.up.copy(Va(value4));
  if (camera.isPerspectiveCamera) {
    Ot();
    const value7 = THREE.MathUtils.degToRad(camera.getEffectiveFOV());
    const count2 = Math.max(value6 / (Math.tan(value7 / 2) * 2), 8);
    camera.position.set(value5.x, value5.y + count2, value5.z);
  } else {
    ho(value6, camera.userData.viewportAspect || 1, camera);
    camera.position.set(value5.x, value5.y + count, value5.z);
  }
  camera.userData.frameSize = value6;
  camera.userData.cameraView = "top";
  camera.userData.topRotation = value4;
  Ya(camera, value5);
  camera.lookAt(value5);
  camera.updateProjectionMatrix();
  Q.target.copy(value5);
  He();
  Q.update();
}
function Wt(value, value2 = {}) {
  const value3 = value === "perspective" ? "perspective" : "orthographic";
  ro(value3);
  if (!renderer) {
    return;
  }
  if ((value3 === "perspective") == !!camera?.isPerspectiveCamera) {
    Ot();
    He();
    return;
  }
  const value4 = value2.preserveView !== false;
  const value5 = camera;
  const value6 = Q?.target.clone() || new THREE.Vector3(0, 0.6, 0);
  const value7 = value5
    ? value5.position.clone().sub(value6)
    : new THREE.Vector3(1.12, 1.42, 1.2);
  const count = Math.max(value7.length(), 2);
  const value8 =
    value7.lengthSq() > 1e-8
      ? value7.normalize()
      : new THREE.Vector3(1.12, 1.42, 1.2).normalize();
  const value9 =
    value5?.userData.viewportAspect ||
    Math.max(
      f("#preview-3d").clientWidth / Math.max(f("#preview-3d").clientHeight, 1),
      0.1,
    );
  const value10 =
    value4 && value5 ? co(value5, value6) : value5?.userData.frameSize || 10;
  Q?.dispose();
  if (value3 === "perspective") {
    camera = new THREE.PerspectiveCamera(36, value9, 0.02, 200);
    Ot(camera);
    const value11 =
      value10 /
      (Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV()) / 2) * 2);
    const value12 = value4 ? value11 : count;
    camera.position.copy(value6).addScaledVector(value8, Math.max(value12, 2));
  } else {
    camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.02, 200);
    camera.position.copy(value6).addScaledVector(value8, count);
    ho(value10, value9, camera);
  }
  camera.layers.enable(kt);
  camera.userData.viewportAspect = value9;
  camera.userData.frameSize = value10;
  camera.userData.cameraView = value5?.userData.cameraView || "free";
  camera.userData.topRotation = value5?.userData.topRotation || 0;
  camera.up.copy(value5?.up || new THREE.Vector3(0, 1, 0));
  Ya(camera, value6);
  camera.lookAt(value6);
  camera.updateProjectionMatrix();
  Q = wd(camera);
  Q.target.copy(value6);
  He();
  Q.update();
}
function Hf() {
  const value = f("#preview-3d");
  try {
    ve = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.05, 200);
    camera.layers.enable(kt);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(rd());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    value.append(renderer.domElement);
    wf();
    Q = wd(camera);
    En();
    ro("orthographic");
    so();
    eo = new THREE.HemisphereLight(12504556, 1515053, 1.12);
    eo.layers.enable(kt);
    ve.add(eo);
    Io = new THREE.AmbientLight(7175581, 0.42);
    Io.layers.enable(kt);
    ve.add(Io);
    se = new THREE.DirectionalLight(14543103, 2.05);
    se.position.set(-7, 22, 6);
    se.castShadow = true;
    se.shadow.mapSize.set(2048, 2048);
    se.shadow.camera.left = -20;
    se.shadow.camera.right = 20;
    se.shadow.camera.top = 20;
    se.shadow.camera.bottom = -20;
    se.shadow.autoUpdate = false;
    se.shadow.needsUpdate = true;
    se.layers.enable(kt);
    ve.add(se);
    Rn = new THREE.DirectionalLight(8886724, 0.72);
    Rn.position.set(9, 7, -10);
    Rn.layers.enable(kt);
    ve.add(Rn);
    Dn = new THREE.DirectionalLight(15791103, 0.68);
    Dn.position.set(0, 16, 1);
    Dn.layers.enable(kt);
    ve.add(Dn);
    B = new THREE.Group();
    ve.add(B);
    Ut = createSpotShadowAtlasController({
      THREE: THREE,
      renderer: renderer,
      scene: ve,
      camera: camera,
      requestFrame: ar,
      canBuild: () =>
        !document.hidden &&
        !W &&
        !_e &&
        !lt &&
        !Mt &&
        _t.modelLoadState().active === 0 &&
        _t.modelLoadState().queued === 0,
    });
    io();
    Mc = new ResizeObserver(yd);
    Mc.observe(value);
    pn();
    let value2 = performance.now();
    const fn9 = (value3 = performance.now()) => {
      if (!renderer) {
        return;
      }
      requestAnimationFrame(fn9);
      const value4 = Math.min(Math.max((value3 - value2) / 1000, 0), 0.05);
      value2 = value3;
      if (document.hidden) {
        return;
      }
      const value5 = Q.update(value4);
      if (value5) {
        To = true;
      }
      const value6 = _e || value5;
      Pf(value3, value6);
      if (!To && Ta) {
        return;
      }
      To = false;
      const value7 = yf(value6);
      const value8 = Gn ? performance.now() : 0;
      renderer.render(ve, camera);
      const value9 = Gn ? performance.now() - value8 : 0;
      xf(value7);
      bf(value3, value9, value6);
      const render = renderer.info.render;
      renderer.domElement.dataset.renderCalls = String(render.calls);
      renderer.domElement.dataset.renderTriangles = String(render.triangles);
      renderer.domElement.dataset.renderLines = String(render.lines);
      ld();
      uf();
      Ta = true;
    };
    fn9();
  } catch (error) {
    f("#webgl-message").hidden = false;
    window.HABridgeLog?.error(error, {
      phase: "studio-webgl-init",
    });
    console.error(error);
  }
}
function ho(value, value2, value3 = camera) {
  if (!value3?.isOrthographicCamera) {
    return;
  }
  const value4 = Math.max(value, 1) / 2;
  if (value2 >= 1) {
    value3.left = -value4 * value2;
    value3.right = value4 * value2;
    value3.top = value4;
    value3.bottom = -value4;
  } else {
    value3.left = -value4;
    value3.right = value4;
    value3.top = value4 / Math.max(value2, 0.1);
    value3.bottom = -value4 / Math.max(value2, 0.1);
  }
  value3.updateProjectionMatrix();
}
function yd() {
  if (!renderer) {
    return;
  }
  if (W) {
    ol();
    return;
  }
  const value = f("#preview-3d");
  const count = Math.max(value.clientWidth, 1);
  const count2 = Math.max(value.clientHeight, 1);
  renderer.setSize(count, count2, false);
  camera.userData.viewportAspect = count / count2;
  if (camera.isOrthographicCamera) {
    ho(camera.userData.frameSize || 10, camera.userData.viewportAspect);
  } else {
    camera.aspect = camera.userData.viewportAspect;
    Ot();
  }
  nt();
}
function nl() {
  if (!camera || !Q) {
    return null;
  } else {
    return {
      mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
      cameraView: camera.userData.cameraView || gt(),
      topRotation: camera.userData.topRotation || 0,
      position: camera.position.clone(),
      target: Q.target.clone(),
      up: camera.up.clone(),
      zoom: camera.zoom,
      visibleHeight: co(camera, Q.target),
      frameSize: camera.userData.frameSize || co(camera, Q.target),
      viewportAspect: camera.userData.viewportAspect || 1,
      fov: camera.isPerspectiveCamera ? camera.fov : 36,
      near: camera.near,
      far: camera.far,
    };
  }
}
function uo(value, value2 = value?.viewportAspect || 1) {
  if (!!value && !!renderer) {
    Wt(value.mode, {
      preserveView: false,
    });
    camera.position.copy(value.position);
    camera.up.copy(value.up);
    camera.zoom = value.zoom || 1;
    camera.near = value.near;
    camera.far = value.far;
    camera.userData.frameSize = value.frameSize;
    camera.userData.viewportAspect = value2;
    camera.userData.cameraView = value.cameraView || gt();
    camera.userData.topRotation = value.topRotation || 0;
    if (camera.isPerspectiveCamera) {
      camera.fov = value.fov;
      camera.aspect = value2;
    } else {
      ho(value.frameSize, value2, camera);
    }
    camera.lookAt(value.target);
    camera.updateProjectionMatrix();
    Q.target.copy(value.target);
    He();
    Q.update();
  }
}
function Et() {
  return {
    width: Math.round(clamp(finite(wt.value, ys), 320, 4096)),
    height: Math.round(clamp(finite(yt.value, xs), 320, 4096)),
  };
}
function qa() {
  const { width: value, height: value2 } = Et();
  _h.textContent = value + " × " + value2 + " px";
  const value3 = ((value6, value7) => {
    while (value7) {
      [value6, value7] = [value7, value6 % value7];
    }
    return value6;
  })(value, value2);
  const value4 = value / value3;
  const value5 = value2 / value3;
  Xh.textContent =
    value4 <= 32 && value5 <= 32
      ? value4 + " : " + value5
      : (value / value2).toFixed(2) + " : 1";
  Hh.style.setProperty("--export-aspect", String(value / value2));
}
function xd(value = false) {
  const value2 = window.devicePixelRatio || 1;
  if (!$e || !xn) {
    return value2;
  }
  const { width: value3, height: value4 } = Et();
  const count = Math.max(xn.clientWidth, 1);
  const count2 = Math.max(xn.clientHeight, 1);
  const count3 = Math.max(value2, value3 / count, value4 / count2, 1.5);
  return Math.min(count3, value ? 2 : 4);
}
function ol() {
  if (!W || ze || !renderer || !camera) {
    return;
  }
  const { width: value, height: value2 } = Et();
  const value3 = value / value2;
  const count = Math.max(xn.clientWidth, 1);
  const count2 = Math.max(xn.clientHeight, 1);
  const value4 = $e ? xd(false) : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(value4);
  renderer.setSize(count, count2, false);
  camera.userData.viewportAspect = value3;
  if (camera.isOrthographicCamera) {
    ho(camera.userData.frameSize || 10, value3, camera);
  } else {
    camera.aspect = value3;
    Ot();
  }
  Q.update();
  nt();
}
function Ua() {
  qa();
  requestAnimationFrame(() => requestAnimationFrame(ol));
}
function sr(value, fallback = false) {
  const numeric = Number((value === "width" ? wt : yt).value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return;
  }
  let value2 = value === "width" ? numeric : Number(wt.value);
  let value3 = value === "height" ? numeric : Number(yt.value);
  value2 = Number.isFinite(value2) && value2 > 0 ? value2 : ys;
  value3 = Number.isFinite(value3) && value3 > 0 ? value3 : xs;
  if (vn.checked) {
    if (value === "width") {
      if (fallback) {
        value2 = clamp(value2, 320, 4096);
        value3 = Math.round(value2 / At);
        if (value3 < 320) {
          value3 = 320;
          value2 = Math.round(value3 * At);
        }
        if (value3 > 4096) {
          value3 = 4096;
          value2 = Math.round(value3 * At);
        }
      } else {
        value3 = Math.round(clamp(value2 / At, 320, 4096));
      }
    } else if (fallback) {
      value3 = clamp(value3, 320, 4096);
      value2 = Math.round(value3 * At);
      if (value2 < 320) {
        value2 = 320;
        value3 = Math.round(value2 / At);
      }
      if (value2 > 4096) {
        value2 = 4096;
        value3 = Math.round(value2 / At);
      }
    } else {
      value2 = Math.round(clamp(value3 * At, 320, 4096));
    }
  }
  if (fallback) {
    value2 = Math.round(clamp(value2, 320, 4096));
    value3 = Math.round(clamp(value3, 320, 4096));
    wt.value = String(value2);
    yt.value = String(value3);
  } else if (vn.checked) {
    if (value === "width") {
      yt.value = String(value3);
    } else {
      wt.value = String(value2);
    }
  }
  Ua();
}
function al(value = {}) {
  const value2 = _a();
  if (!value2 || !W) {
    return;
  }
  const viewportAspect = Et().width / Et().height;
  const value3 = dt();
  value3.cameraMode = value2.mode;
  value3.cameraView = value2.view;
  value3.cameraTopRotation = value2.topRotation;
  if (value2.focalLength !== null) {
    value3.cameraFocalLength = value2.focalLength;
  }
  uo(
    {
      mode: value2.mode,
      cameraView: value2.view,
      topRotation: value2.topRotation,
      position: new THREE.Vector3(
        value2.position.x,
        value2.position.y,
        value2.position.z,
      ),
      target: new THREE.Vector3(
        value2.target.x,
        value2.target.y,
        value2.target.z,
      ),
      up:
        value2.view === "top"
          ? Va(value2.topRotation)
          : new THREE.Vector3(0, 1, 0),
      zoom: 1,
      visibleHeight: value2.visibleHeight,
      frameSize: value2.visibleHeight,
      viewportAspect: viewportAspect,
      fov: value2.fov,
      near: 0.02,
      far: Math.max(
        new THREE.Vector3(
          value2.position.x,
          value2.position.y,
          value2.position.z,
        ).distanceTo(
          new THREE.Vector3(value2.target.x, value2.target.y, value2.target.z),
        ) * (value2.mode === "perspective" ? 8 : 5),
        100,
      ),
    },
    viewportAspect,
  );
  ro(value2.mode);
  so(value2.view);
  if (!value.silent) {
    const value4 = fe() === "all" ? "总览视角" : "当前层视角";
    pe.textContent = "已恢复上次保存的" + value4;
    _("已恢复上次保存的" + value4 + "。");
  }
}
function nn() {
  const exportPresetSlots = normalizeExportPresetSlots(T?.exportPresets);
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    exportPresetSlots.length,
  );
  T.exportPresets = exportPresetSlots;
  T.activeExportPresetSlot = activeExportPresetSlot;
  const index = new Map(
    (T?.floors || []).map((value6) => [value6.id, value6.name]),
  );
  jl.replaceChildren(
    ...exportPresetSlots.map((value6, value7) => {
      const element = document.createElement("button");
      element.type = "button";
      element.dataset.exportPresetSlot = String(value7);
      element.setAttribute("role", "tab");
      const element2 = document.createElement("strong");
      const element3 = document.createElement("small");
      element2.textContent =
        value6?.name || index.get(value6?.floorId) || "未命名存档";
      element3.textContent = value6 ? "已设置" : "未设置";
      const value8 = value7 === activeExportPresetSlot;
      element.classList.toggle("active", value8);
      element.classList.toggle("has-value", !!value6);
      element.setAttribute("aria-selected", String(value8));
      element.title = value6
        ? element2.textContent + "：已设置"
        : element2.textContent + "：未设置";
      element.append(element2, element3);
      return element;
    }),
  );
  const value4 = exportPresetSlots[activeExportPresetSlot];
  ec.disabled = exportPresetSlots.length >= MAX_EXPORT_PRESET_COUNT;
  tc.disabled = !value4;
  nc.disabled = exportPresetSlots.length <= 1;
  const value5 = exportPresetIsEmpty(value4, qt);
  Vh.hidden = !value5;
  Nh.textContent = value4
    ? Ho(value4, activeExportPresetSlot) + "已设置"
    : "当前存档尚未设置";
}
function vd({ name = "" } = {}) {
  if (camera.isPerspectiveCamera) {
    const element = f("#camera-focal-length");
    const value = clamp(finite(element?.value, tn()), 18, 120);
    dt().cameraFocalLength = value;
    for (const element2 of hi) {
      element2.value = String(Math.round(value));
    }
    Ot(camera, value);
  }
  const { width: width, height: height } = Et();
  const target = Q.target;
  return normalizeExportPreset({
    name: name,
    width: width,
    height: height,
    lockRatio: vn.checked,
    floorMode: fe() === "all" ? "all" : "floor",
    floorId: Te()?.id || xe,
    floorGap: finite(T.exportFloorGap, 3),
    camera: {
      mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
      view: gt(),
      topRotation: en(),
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: {
        x: target.x,
        y: target.y,
        z: target.z,
      },
      visibleHeight: co(camera, target),
      fov: camera.isPerspectiveCamera ? camera.fov : 36,
      focalLength: camera.isPerspectiveCamera ? tn() : null,
    },
    folderName: ht.value,
    selectedFiles: [...Pd()],
  });
}
function Vf(value) {
  const viewportAspect = Et().width / Et().height;
  const value2 = dt();
  value2.cameraMode = value.mode;
  value2.cameraView = value.view;
  value2.cameraTopRotation = value.topRotation;
  if (value.focalLength !== null) {
    value2.cameraFocalLength = value.focalLength;
  }
  const position = new THREE.Vector3(
    value.position.x,
    value.position.y,
    value.position.z,
  );
  const target = new THREE.Vector3(
    value.target.x,
    value.target.y,
    value.target.z,
  );
  uo(
    {
      mode: value.mode,
      cameraView: value.view,
      topRotation: value.topRotation,
      position: position,
      target: target,
      up:
        value.view === "top"
          ? Va(value.topRotation)
          : new THREE.Vector3(0, 1, 0),
      zoom: 1,
      visibleHeight: value.visibleHeight,
      frameSize: value.visibleHeight,
      viewportAspect: viewportAspect,
      fov: value.fov,
      near: 0.02,
      far: Math.max(
        position.distanceTo(target) * (value.mode === "perspective" ? 8 : 5),
        100,
      ),
    },
    viewportAspect,
  );
  ro(value.mode);
  so(value.view);
}
function il(value, value2 = {}) {
  const preset = normalizeExportPreset(T?.exportPresets?.[value]);
  if (!preset || !W) {
    return false;
  }
  wt.value = String(preset.width);
  yt.value = String(preset.height);
  vn.checked = preset.lockRatio;
  At = preset.width / preset.height;
  T.exportFloorGap = preset.floorGap;
  const value3 = T.floors.find((value7) => value7.id === preset.floorId);
  const value4 =
    preset.floorMode === "all" && T.floors.length > 1
      ? "all"
      : value3?.id || Te()?.id || xe;
  cr(value4);
  ca.value = preset.floorGap.toFixed(1);
  ht.value = preset.folderName;
  const allowed = new Set(preset.selectedFiles);
  const value5 = allowed.has("televisionOn");
  const value6 = allowed.has("vehicleCharging");
  for (const value7 of je.querySelectorAll("input[data-export-file]")) {
    const exportFile = value7.dataset.exportFile;
    value7.checked =
      allowed.has(exportFile) ||
      (value5 && exportFile.startsWith("screen:")) ||
      (value6 && exportFile.startsWith("vehicle:"));
  }
  Vf(preset.camera);
  qa();
  zn();
  if (!value2.silent) {
    pe.textContent = "已切换到档位 " + String(value + 1).padStart(2, "0");
    _("已应用导出档位 " + String(value + 1).padStart(2, "0") + "。", "success");
  }
  Ua();
  return true;
}
function Nf(value) {
  const value2 = T?.exportPresets?.length || 0;
  if (!Number.isInteger(value) || value < 0 || value >= value2 || ze) {
    return;
  }
  Wo();
  T.activeExportPresetSlot = value;
  const value3 = il(value);
  qt = false;
  nn();
  V();
  if (!value3) {
    pe.textContent = "存档 " + String(value + 1).padStart(2, "0") + " 没有设置";
  }
}
function Wo() {
  window.clearTimeout(kn);
  kn = null;
  if (!qt) {
    return false;
  }
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    T?.exportPresets?.length,
  );
  if (!W || ze) {
    return false;
  }
  T.exportPresets = normalizeExportPresetSlots(T.exportPresets);
  const name = T.exportPresets[activeExportPresetSlot]?.name || "";
  T.exportPresets[activeExportPresetSlot] = vd({
    name: name,
  });
  qt = false;
  nn();
  V();
  return true;
}
function Za() {
  if (!!W && !ze) {
    qt = true;
    nn();
    window.clearTimeout(kn);
    kn = window.setTimeout(Wo, 360);
  }
}
function Ho(value, value2) {
  if (!value) {
    return "存档 " + String(value2 + 1).padStart(2, "0");
  }
  const name = (T?.floors || []).find(
    (value3) => value3.id === value.floorId,
  )?.name;
  return value.name || name || "存档 " + String(value2 + 1).padStart(2, "0");
}
function bd(value, value2 = -1) {
  const labelText = normalizeLabelText(value, "导出视角", 24);
  const allowed = new Set(
    (T?.exportPresets || [])
      .map((value5, value6) => (value6 === value2 ? "" : Ho(value5, value6)))
      .filter(Boolean),
  );
  if (!allowed.has(labelText)) {
    return labelText;
  }
  let value4 = 2;
  while (allowed.has(labelText + " " + value4)) {
    value4 += 1;
  }
  return (labelText + " " + value4).slice(0, 24);
}
function Xf() {
  if (!W || ze) {
    return;
  }
  Wo();
  T.exportPresets = normalizeExportPresetSlots(T.exportPresets);
  if (T.exportPresets.length >= MAX_EXPORT_PRESET_COUNT) {
    _("最多可以保存 8 个导出存档。");
    return;
  }
  const length = T.exportPresets.length;
  const value = fe() === "all" ? "全楼" : Te()?.name || "存档 " + (length + 1);
  const name = bd(value + "视角");
  const value2 = T.exportPresets.slice(0, length).reverse().find(Boolean);
  const value3 = vd({
    name: name,
  });
  if (value2) {
    value3.width = value2.width;
    value3.height = value2.height;
    value3.lockRatio = value2.lockRatio;
  }
  T.exportPresets.push(value3);
  T.activeExportPresetSlot = length;
  qt = false;
  nn();
  V();
  pe.textContent = "已新增“" + name + "”";
  _("已新增“" + name + "”，可以继续调整楼层和视角。", "success");
}
function Ka() {
  if (fi.open) {
    fi.close();
  }
}
function _f() {
  if (ze) {
    return;
  }
  Wo();
  const exportPresetSlots = normalizeExportPresetSlots(T?.exportPresets);
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    exportPresetSlots.length,
  );
  if (exportPresetSlots[activeExportPresetSlot]) {
    qr.value = Ho(
      exportPresetSlots[activeExportPresetSlot],
      activeExportPresetSlot,
    );
    fi.showModal();
    requestAnimationFrame(() => qr.select());
  }
}
function lr() {
  if (gi.open) {
    gi.close();
  }
}
function Yf() {
  if (ze) {
    return;
  }
  const exportPresetSlots = normalizeExportPresetSlots(T?.exportPresets);
  if (exportPresetSlots.length <= 1) {
    return;
  }
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    exportPresetSlots.length,
  );
  Zh.textContent = Ho(
    exportPresetSlots[activeExportPresetSlot],
    activeExportPresetSlot,
  );
  gi.showModal();
}
function qf() {
  const exportPresetSlots = normalizeExportPresetSlots(T?.exportPresets);
  if (exportPresetSlots.length <= 1) {
    return;
  }
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    exportPresetSlots.length,
  );
  const value3 = Ho(
    exportPresetSlots[activeExportPresetSlot],
    activeExportPresetSlot,
  );
  window.clearTimeout(kn);
  kn = null;
  qt = false;
  exportPresetSlots.splice(activeExportPresetSlot, 1);
  T.exportPresets = exportPresetSlots;
  T.activeExportPresetSlot = Math.min(
    activeExportPresetSlot,
    exportPresetSlots.length - 1,
  );
  lr();
  const value4 = il(T.activeExportPresetSlot, {
    silent: true,
  });
  nn();
  V();
  pe.textContent = value4 ? "已切换到相邻存档" : "当前存档尚未设置";
  _("已删除“" + value3 + "”，楼层和户型未受影响。", "success");
}
function Md(value = 0) {
  if (!!$e && !!Ue && window.parent !== window) {
    requestAnimationFrame(() => {
      if (!W || !renderer || !ve || !camera || !Q) {
        return;
      }
      ol();
      if (!B?.children?.length) {
        Lt();
      }
      const value2 = xn.clientWidth > 1 && xn.clientHeight > 1;
      const value3 = !!B?.children?.length;
      let value4 = false;
      if (value2 && value3) {
        nt({
          shadows: true,
        });
        Q.update();
        for (let value5 = 0; value5 < 2; value5 += 1) {
          renderer.render(ve, camera);
        }
        const render = renderer.info.render;
        value4 = render.calls > 0 && render.triangles > 0;
        renderer.domElement.dataset.renderCalls = String(render.calls);
        renderer.domElement.dataset.renderTriangles = String(render.triangles);
        renderer.domElement.dataset.renderLines = String(render.lines);
        To = false;
        Ta = value4;
        ld();
      }
      if (!value4 && value < 7) {
        Md(value + 1);
        return;
      }
      if (!value4) {
        window.parent.postMessage(
          {
            type: "ha-bridge-floorplan-auto-diagram-error",
            componentId: Ue,
            message: "3D户型首帧渲染失败，请刷新后重试。",
          },
          window.location.origin,
        );
        return;
      }
      window.parent.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-ready",
          componentId: Ue,
          floors: T.floors.map((floors) => ({
            id: floors.id,
            name: floors.name,
          })),
          floorSelection: fe() === "all" ? "all" : Te()?.id || xe,
        },
        window.location.origin,
      );
    });
  }
}
function rl() {
  if (W || !renderer || !camera || !Q) {
    return;
  }
  window.clearTimeout(kn);
  kn = null;
  qt = false;
  const value = ko();
  const value2 = Ro();
  const value3 = Do();
  W = {
    canvasParent: renderer.domElement.parentElement,
    camera: nl(),
    selected: X
      ? {
          ...X,
        }
      : null,
    selectedMany: he.map((selectedMany) => ({
      ...selectedMany,
    })),
    floorMode: fe(),
    selectedFloorId: xe,
    floorCameraSettings: new Map(
      T.floors.map((floorCameraSettings) => [
        floorCameraSettings.id,
        {
          mode: floorCameraSettings.scene.settings.cameraMode,
          view: floorCameraSettings.scene.settings.cameraView,
          topRotation: floorCameraSettings.scene.settings.cameraTopRotation,
          focalLength: floorCameraSettings.scene.settings.cameraFocalLength,
        },
      ]),
    ),
    combinedCameraSettings: {
      ...T.combinedCameraSettings,
    },
    groupStates: new Map(
      value.map(({ key: groupStates, group: groupStates2 }) => [
        groupStates,
        groupStates2.enabled,
      ]),
    ),
    tvStates: new Map(
      value2.map(({ key: tvStates, item: tvStates2 }) => [
        tvStates,
        tvStates2.screenEnabled !== false,
      ]),
    ),
    carChargingStates: new Map(
      value3.map(({ key: carChargingStates, item: carChargingStates2 }) => [
        carChargingStates,
        carChargingStates2.chargingEnabled === true,
      ]),
    ),
    cameraSettings: {
      mode: Pt(),
      view: gt(),
      topRotation: en(),
      focalLength: tn(),
    },
    pixelRatio: renderer.getPixelRatio(),
  };
  Ut?.setEnabled(false);
  for (const { group: value6 } of value) {
    value6.enabled = false;
  }
  Gt();
  pe.textContent = "准备保存到 NAS";
  ht.classList.remove("invalid");
  sl();
  Sd();
  zn();
  nn();
  _r.disabled = false;
  if ($e) {
    document.body.classList.add("auto-diagram-embedded");
    const value6 = new URLSearchParams(window.location.search);
    const value7 = clamp(
      finite(
        value6.get("dashboard-width"),
        finite(value6.get("component-width"), wt.value),
      ),
      320,
      4096,
    );
    const value8 = clamp(
      finite(
        value6.get("dashboard-height"),
        finite(value6.get("component-height"), yt.value),
      ),
      320,
      4096,
    );
    wt.value = String(Math.round(value7));
    yt.value = String(Math.round(value8));
    vn.checked = true;
    if (Fl) {
      ht.value = Fl;
    }
    qa();
  }
  je.showModal();
  xn.append(renderer.domElement);
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T.activeExportPresetSlot,
    T.exportPresets.length,
  );
  const value5 =
    activeExportPresetSlot !== null &&
    il(activeExportPresetSlot, {
      silent: true,
    });
  if ($e && po !== null) {
    const value6 = T.floors.find((value8) => value8.id === po);
    const value7 =
      po === "all" && T.floors.length > 1
        ? "all"
        : value6?.id || Te()?.id || xe;
    cr(value7);
  }
  if (!value5) {
    Lt();
    if (_a()) {
      al({
        silent: true,
      });
    } else if ($e) {
      Wt(Pt(), {
        preserveView: false,
      });
      pn();
    }
  }
  At = Et().width / Et().height;
  nn();
  Ua();
  Md();
}
function sl() {
  if (!Jl) {
    return;
  }
  const value = _i();
  const value2 = [];
  const fn9 = (value3, value4, value5) => {
    const value6 = document.createElement("li");
    const value7 = document.createElement("label");
    const value8 = document.createElement("input");
    value8.type = "checkbox";
    value8.checked = true;
    value8.dataset.exportFile = value3;
    const element = document.createElement("span");
    element.textContent = value4;
    const element2 = document.createElement("small");
    element2.textContent = value5;
    value7.append(value8, element);
    value6.append(value7, element2);
    value2.push(value6);
  };
  Ro(value).forEach(
    ({ floor: value3, item: value4, index: value5, key: value6 }) => {
      const value7 =
        "" +
        (value.length > 1 ? value3.name + "-" : "") +
        (value4.screenLayerName || "电视画面 " + (value5 + 1));
      fn9(
        "screen:" + value6,
        hr(value7, "电视画面-" + (value5 + 1)) + "." + EXPORT_IMAGE_EXTENSION,
        "该电视的独立开启透明层",
      );
    },
  );
  Do(value).forEach(
    ({ floor: value3, item: value4, index: value5, key: value6 }) => {
      const value7 =
        "" +
        (value.length > 1 ? value3.name + "-" : "") +
        (value4.chargingLayerName || "汽车充电 " + (value5 + 1));
      fn9(
        "vehicle:" + value6,
        hr(value7, "汽车充电-" + (value5 + 1)) + "." + EXPORT_IMAGE_EXTENSION,
        "该汽车的独立充电光效层",
      );
    },
  );
  ko(value).forEach(
    ({ floor: value3, group: value4, index: value5, key: value6 }) => {
      const value7 =
        "" +
        (value.length > 1 ? value3.name + "-" : "") +
        (value4.name || "灯组-" + (value5 + 1));
      fn9(
        "group:" + value6,
        hr(value7, "灯组-" + (value5 + 1)) + "." + EXPORT_IMAGE_EXTENSION,
        "该灯组的透明光效层",
      );
    },
  );
  Jl.replaceChildren(...value2);
}
function Sd() {
  const value = fe() === "all";
  const value2 = value ? "all" : Te()?.id || xe;
  la.replaceChildren(
    ...T.floors.map((value3) => {
      const element = document.createElement("option");
      element.value = value3.id;
      element.textContent = value3.name;
      return element;
    }),
    ...(T.floors.length > 1
      ? [
          Object.assign(document.createElement("option"), {
            value: "all",
            textContent: "全楼合并",
          }),
        ]
      : []),
  );
  la.value = value2;
  syncStudioSelect(la);
  Yh.hidden = !value || T.floors.length <= 1;
  syncControlValue(ca, finite(T.exportFloorGap, 3).toFixed(1));
  zn();
}
function cr(value) {
  if (!W || ze) {
    return;
  }
  const value2 = value === "all" && T.floors.length > 1;
  if (!value2) {
    const value3 = T.floors.find((value4) => value4.id === value);
    if (!value3) {
      return;
    }
    W.selectedFloorId = value3.id;
    scene = value3.scene;
  }
  T.previewFloorMode = value2 ? "all" : "active";
  Sd();
  Yo();
  zn();
  Lt();
  if (_a()) {
    al({
      silent: true,
    });
  } else {
    Wt(Pt(), {
      preserveView: false,
    });
    pn();
  }
  sl();
  pe.textContent =
    fe() === "all"
      ? "正在构图：全楼合并"
      : "正在构图：" + (Te()?.name || "当前层");
  Ua();
}
function Pd() {
  return new Set(
    [...je.querySelectorAll("input[data-export-file]:checked")].map(
      (value) => value.dataset.exportFile,
    ),
  );
}
function Uf() {
  if (!W || ze) {
    return;
  }
  qs();
  if (Me?.parentElement !== document.body) {
    document.body.append(Me);
  }
  Wo();
  const preset = W;
  for (const value2 of T.floors) {
    const value3 = preset.floorCameraSettings.get(value2.id);
    if (value3) {
      value2.scene.settings.cameraMode = value3.mode;
      value2.scene.settings.cameraView = value3.view;
      value2.scene.settings.cameraTopRotation = value3.topRotation;
      value2.scene.settings.cameraFocalLength = value3.focalLength;
    }
  }
  T.combinedCameraSettings = {
    ...preset.combinedCameraSettings,
  };
  W = null;
  T.previewFloorMode = preset.floorMode;
  scene =
    T.floors.find((value2) => value2.id === xe)?.scene || T.floors[0].scene;
  preset.canvasParent?.append(renderer.domElement);
  const value = dt();
  value.cameraMode = preset.cameraSettings.mode;
  value.cameraView = preset.cameraSettings.view;
  value.cameraTopRotation = preset.cameraSettings.topRotation;
  value.cameraFocalLength = preset.cameraSettings.focalLength;
  uo(preset.camera, preset.camera.viewportAspect);
  ro(preset.cameraSettings.mode);
  so(preset.cameraSettings.view);
  X = preset.selected;
  he = preset.selectedMany;
  for (const { key: value2, group: value3 } of ko()) {
    if (preset.groupStates.has(value2)) {
      value3.enabled = preset.groupStates.get(value2);
    }
  }
  for (const { key: value2, item: value3 } of Ro()) {
    if (preset.tvStates.has(value2)) {
      value3.screenEnabled = preset.tvStates.get(value2);
    }
  }
  for (const { key: value2, item: value3 } of Do()) {
    if (preset.carChargingStates.has(value2)) {
      value3.chargingEnabled = preset.carChargingStates.get(value2);
    }
  }
  renderer.setPixelRatio(preset.pixelRatio);
  Lt();
  He();
  yd();
  St();
  ae();
}
function Ed(value) {
  ze = value;
  const value2 = f("#export-busy-notice");
  if (value2) {
    value2.hidden = !value;
  }
  _r.disabled = value;
  f("#export-close").disabled = value;
  for (const value3 of je.querySelectorAll("input, button")) {
    if (value3.id !== "export-close" && value3.id !== "export-package") {
      value3.disabled = value;
    }
  }
  if (!value) {
    zn();
    nn();
  }
  Q.enabled = !value;
}
function Zf() {
  Q.update();
  for (let value = 0; value < 3; value += 1) {
    renderer.render(ve, camera);
  }
}
function dr(value) {
  return new Promise((fn9, fn10) => {
    value.toBlob(
      (value2) => {
        if (value2) {
          fn9(value2);
        } else {
          fn10(new Error("无法生成导出图像。"));
        }
      },
      EXPORT_IMAGE_MIME_TYPE,
      EXPORT_IMAGE_QUALITY,
    );
  });
}
async function Vo(value, value2, value3 = {}) {
  Zf();
  const value4 = document.createElement("canvas");
  value4.width = value;
  value4.height = value2;
  const value5 = value4.getContext("2d", {
    willReadFrequently: value3.pixels === true,
  });
  if (!value5) {
    throw new Error("当前浏览器无法创建导出画布。");
  }
  value5.drawImage(renderer.domElement, 0, 0, value, value2);
  const value6 = {};
  if (value3.pixels) {
    value6.imageData = value5.getImageData(0, 0, value, value2);
  }
  if (value3.blob) {
    value6.blob = await dr(value4);
  }
  return value6;
}
async function Ld(value, value2) {
  const value3 = document.createElement("canvas");
  value3.width = value.width;
  value3.height = value.height;
  const value4 = value3.getContext("2d");
  if (!value4) {
    throw new Error("当前浏览器无法创建透明灯光层。");
  }
  const value5 = buildLightDeltaPixels(value.data, value2.data);
  value4.putImageData(new ImageData(value5, value.width, value.height), 0, 0);
  return dr(value3);
}
async function Kf(value, value2, value3, value4, value5, value6) {
  const value7 = document.createElement("canvas");
  value7.width = value3;
  value7.height = value4;
  const value8 = value7.getContext("2d");
  const value9 = document.createElement("canvas");
  value9.width = value3;
  value9.height = value4;
  const value10 = value9.getContext("2d");
  if (!value8 || !value10) {
    throw new Error("当前浏览器无法合成逐灯阴影。");
  }
  const value11 = value2.lights.filter(
    (value12) => finite(value12.lightBrightness, 0) > 0,
  );
  try {
    for (let value12 = 0; value12 < value11.length; value12 += 1) {
      const value13 = value11[value12];
      pe.textContent =
        "正在渲染灯组 " +
        (value5 + 1) +
        "/" +
        value6 +
        "：" +
        value2.name +
        "（" +
        (value12 + 1) +
        "/" +
        value11.length +
        "）";
      Yn = new Set([value13.id]);
      if (fe() === "all") {
        Lt({
          preserveLightCache: true,
        });
      } else {
        wl({
          preserveLightCache: true,
        });
      }
      const value14 = await Vo(value3, value4, {
        pixels: true,
      });
      const value15 = buildLightDeltaPixels(value.data, value14.imageData.data);
      value10.clearRect(0, 0, value3, value4);
      value10.putImageData(new ImageData(value15, value3, value4), 0, 0);
      value8.drawImage(value9, 0, 0);
      await ir();
    }
  } finally {
    Yn = null;
  }
  return dr(value7);
}
async function Id(value, value2, value3 = null) {
  const value4 = document.createElement("canvas");
  value4.width = value;
  value4.height = value2;
  const value5 = value4.getContext("2d");
  if (!value5) {
    throw new Error("当前浏览器无法创建导出底图。");
  }
  value5.fillStyle = "#" + ao().background.toString(16).padStart(6, "0");
  value5.fillRect(0, 0, value, value2);
  if (value3) {
    const value6 = document.createElement("canvas");
    value6.width = value;
    value6.height = value2;
    const value7 = value6.getContext("2d");
    if (!value7) {
      throw new Error("当前浏览器无法合成户型底图。");
    }
    value7.putImageData(value3, 0, 0);
    value5.drawImage(value6, 0, 0);
  }
  return dr(value4);
}
function hr(value, value2) {
  return (
    String(value || "")
      .normalize("NFKC")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || value2
  );
}
function ll(value, value2, value3, value4 = EXPORT_IMAGE_EXTENSION) {
  const value5 = hr(value, "灯组-" + (value2 + 1));
  const value6 = String(value4).replace(/^\./, "");
  let value7 = 1;
  let value8 = value5 + "." + value6;
  while (value3.has(value8.toLocaleLowerCase())) {
    value7 += 1;
    value8 = value5 + "-" + value7 + "." + value6;
  }
  value3.add(value8.toLocaleLowerCase());
  return value8;
}
function Qf(value, value2) {
  const target = Q.target;
  return {
    mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: target.x,
      y: target.y,
      z: target.z,
    },
    aspect: value / value2,
    visibleHeight: co(camera, target),
    fov: camera.isPerspectiveCamera ? camera.fov : null,
  };
}
function Jf(value, value2 = Te()) {
  const value3 = value2?.scene?.calibration?.pixelsPerMeter || 1;
  return {
    id: value.id,
    floorId: value2?.id || null,
    type: value.type,
    position: {
      x: value.x / value3,
      z: value.y / value3,
      elevation: Oc(value2) + (value.elevation || 0),
    },
    rotation: value.rotation || 0,
    verticalRotation: value.verticalRotation || 0,
    stripRollRotation:
      (value.type === "striplight" && value.stripRollRotation) || 0,
    size: {
      width: value.width,
      depth: value.depth,
    },
    temperature: value.lightTemperature,
    brightness: value.lightBrightness,
    range: value.lightRange,
    angle: value.lightAngle,
  };
}
function cl(value, value2, value3 = _i()) {
  if (!value || !value2 || !camera) {
    return null;
  }
  const value4 = value2.scene?.calibration?.pixelsPerMeter || 1;
  let value5 = 0;
  let value6 =
    Math.max(0, finite(value.elevation, 0)) +
    Math.max(0.02, finite(value.height, 0.1)) / 2;
  let value7 = 0;
  if (fe() === "all") {
    const value9 = (finite(value.x, 0) - finite(value2.originX, 0)) / value4;
    const value10 = (finite(value.y, 0) - finite(value2.originY, 0)) / value4;
    const value11 = -THREE.MathUtils.degToRad(finite(value2.rotation, 0));
    value5 =
      value9 * Math.cos(value11) +
      value10 * Math.sin(value11) +
      finite(value2.offsetX, 0);
    value7 =
      -value9 * Math.sin(value11) +
      value10 * Math.cos(value11) +
      finite(value2.offsetZ, 0);
    const value12 = [...value3].sort(
      (value13, value14) => value13.elevation - value14.elevation,
    );
    const count = Math.max(
      0,
      value12.findIndex((value13) => value13.id === value2.id),
    );
    value6 += count * finite(T.exportFloorGap, 3);
  } else {
    const scene = value2.scene;
    const value9 = scene.walls?.length
      ? modelBounds({
          background: null,
          walls: scene.walls,
          items: [],
        })
      : scene.items?.length
        ? modelBounds({
            background: null,
            walls: [],
            items: scene.items,
          })
        : modelBounds(scene);
    value5 = (finite(value.x, 0) - (value9.minX + value9.maxX) / 2) / value4;
    value7 = (finite(value.y, 0) - (value9.minY + value9.maxY) / 2) / value4;
  }
  camera.updateMatrixWorld(true);
  const value8 = new THREE.Vector3(value5, value6, value7).project(camera);
  if (
    ![value8.x, value8.y, value8.z].every(Number.isFinite) ||
    value8.z < -1 ||
    value8.z > 1
  ) {
    return null;
  } else {
    return {
      x: clamp((value8.x + 1) / 2, 0, 1),
      y: clamp((1 - value8.y) / 2, 0, 1),
    };
  }
}
function jf(value, value2, value3 = _i()) {
  for (const value4 of value || []) {
    const value5 = cl(value4, value2, value3);
    if (value5) {
      return value5;
    }
  }
  return null;
}
async function No(value) {
  return new Uint8Array(await value.arrayBuffer());
}
function dl(value = "", value2 = "", value3 = "") {
  for (const { key: value4, group: value5 } of ko()) {
    value5.enabled = value === "*" || value4 === value;
  }
  for (const { key: value4, item: value5 } of Ro()) {
    value5.screenEnabled = value2 === "*" || value4 === value2;
  }
  for (const { key: value4, item: value5 } of Do()) {
    value5.chargingEnabled = value3 === "*" || value4 === value3;
  }
  Lt();
}
function on(value, value2) {
  if (B) {
    B.traverse((value3) => {
      if (value3.userData?.exportRole === value) {
        value3.visible = value2;
      }
    });
    nt({
      shadows: value === "plan",
    });
  }
}
function Xo(value = "cancel") {
  const value2 = ki;
  ki = null;
  if (pi.open) {
    pi.close();
  }
  value2?.(value);
}
function Td(value) {
  if (ki) {
    Xo("cancel");
  }
  Kh.textContent = value;
  pi.showModal();
  return new Promise((value2) => {
    ki = value2;
  });
}
function ur(reason, message) {
  if (!!$e && !!Ue && window.parent !== window) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-stopped",
        componentId: Ue,
        reason: reason,
        message: message,
      },
      window.location.origin,
    );
  }
}
function eg(value) {
  const value2 = value?.overwritten === true;
  Qh.textContent = value2 ? "导图覆盖完成" : "导图保存完成";
  Jh.textContent = value2
    ? "新导图已经安全替换原文件夹，已有仪表盘中的同名图片会自动更新。"
    : "导出的图片和数据已经保存到 NAS，可以在编辑器素材中继续使用。";
  jh.textContent = "data/" + (value?.relativePath || "exports");
  if (!mi.open) {
    mi.showModal();
  }
}
async function Cd() {
  if (!W || ze) {
    return;
  }
  Wo();
  const exportName = ht.value.trim();
  if (
    !exportName ||
    /[<>:\"/\\|?*\x00-\x1f\x7f]/.test(exportName) ||
    exportName.startsWith(".") ||
    /[. ]$/.test(exportName)
  ) {
    ht.classList.add("invalid");
    ht.focus();
    pe.textContent = "请输入有效的文件夹名";
    return;
  }
  ht.classList.remove("invalid");
  const value = Pd();
  if (!value.size) {
    pe.textContent = "请至少勾选一项图片";
    return;
  }
  const sourceResolution = Et();
  const { width: width, height: height } = scaledExportResolution(
    sourceResolution.width,
    sourceResolution.height,
    EXPORT_RENDER_SCALE,
  );
  const value2 = nl();
  const value3 = {
    background: "00底图." + EXPORT_IMAGE_EXTENSION,
    backgroundWithPlan: "00底图带户型." + EXPORT_IMAGE_EXTENSION,
    floorPlan: "00户型图." + EXPORT_IMAGE_EXTENSION,
  };
  const allowed = new Set(
    Object.values(value3).map((value12) => value12.toLocaleLowerCase()),
  );
  const value4 = _i();
  const value5 = ko(value4)
    .map(({ floor: floor, group: value12, index: value13, key: id2 }) => ({
      id: id2,
      groupId: value12.id,
      floor: floor,
      name: value4.length > 1 ? floor.name + "-" + value12.name : value12.name,
      enabledInEditor: W.groupStates.get(id2) !== false,
      file: ll(
        value4.length > 1 ? floor.name + "-" + value12.name : value12.name,
        value13,
        allowed,
      ),
      lights: floor.scene.items.filter(
        (lights) => re.has(lights.type) && lights.lightGroupId === value12.id,
      ),
    }))
    .filter((value12) => value.has("group:" + value12.id));
  const value6 = Ro(value4).map(
    ({ floor: floor, item: item, index: value12, key: key }) => ({
      id: "screen-" + key,
      key: key,
      floorId: floor.id,
      itemId: item.id,
      name:
        "" +
        (value4.length > 1 ? floor.name + "-" : "") +
        (item.screenLayerName || "电视画面 " + (value12 + 1)),
      enabledInEditor: W.tvStates.get(key) !== false,
      floor: floor,
      item: item,
      file: null,
    }),
  );
  const value7 = Do(value4).map(
    ({ floor: floor, item: item, index: value12, key: key }) => ({
      id: "vehicle-" + key,
      key: key,
      floorId: floor.id,
      itemId: item.id,
      name:
        "" +
        (value4.length > 1 ? floor.name + "-" : "") +
        (item.chargingLayerName || "汽车充电 " + (value12 + 1)),
      chargingInEditor: W.carChargingStates.get(key) === true,
      floor: floor,
      item: item,
      file: null,
    }),
  );
  for (let value12 = 0; value12 < value6.length; value12 += 1) {
    const value13 = value6[value12];
    value13.file = ll(value13.name, value12, allowed);
  }
  for (let value12 = 0; value12 < value7.length; value12 += 1) {
    const value13 = value7[value12];
    value13.file = ll(value13.name, value12, allowed);
  }
  const value8 = value6.filter((value12) => value.has("screen:" + value12.key));
  const value9 = value7.filter((value12) =>
    value.has("vehicle:" + value12.key),
  );
  const value10 =
    value.has("backgroundWithPlan") ||
    value.has("floorPlan") ||
    value8.length > 0 ||
    value9.length > 0 ||
    value5.length > 0;
  let value11 = false;
  Ed(true);
  try {
    pe.textContent = "正在检查文件夹名…";
    if (
      (
        await Go("/studio3d/exports/check", {
          headers: {
            "X-Export-Folder": encodeURIComponent(exportName),
          },
        })
      )?.exists
    ) {
      pe.textContent = "同名导图“" + exportName + "”已经存在";
      const value18 = await Td(exportName);
      if (value18 === "rename") {
        pe.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          ht.focus();
          ht.select();
        }, 0);
        ur("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (value18 !== "overwrite") {
        pe.textContent = "已取消覆盖，原导图保持不变";
        ur("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      value11 = true;
    }
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    uo(value2, width / height);
    ed(true);
    pe.textContent = "正在生成精细阴影导出图层…";
    dl();
    let value12 = null;
    let value13 = null;
    if (value.has("background")) {
      on("plan", false);
      on("label", false);
      on("outline", false);
      value12 = await Vo(width, height, {
        pixels: true,
      });
      on("plan", true);
      on("label", true);
      on("outline", true);
    }
    if (value10) {
      value13 = await Vo(width, height, {
        pixels: true,
      });
    }
    const value14 = [];
    if (value12) {
      const value18 = await Id(width, height, value12.imageData);
      value14.push({
        name: value3.background,
        data: await No(value18),
      });
    }
    if (value.has("backgroundWithPlan")) {
      const value18 = await Id(width, height, value13.imageData);
      value14.push({
        name: value3.backgroundWithPlan,
        data: await No(value18),
      });
    }
    if (value.has("floorPlan")) {
      on("background", false);
      on("grid", false);
      const value18 = await Vo(width, height, {
        blob: true,
      });
      on("background", true);
      on("grid", true);
      value14.push({
        name: value3.floorPlan,
        data: await No(value18.blob),
      });
    }
    for (let value18 = 0; value18 < value5.length; value18 += 1) {
      const value19 = value5[value18];
      const value20 = await Kf(
        value13.imageData,
        value19,
        width,
        height,
        value18,
        value5.length,
      );
      value14.push({
        name: value19.file,
        data: await No(value20),
      });
    }
    for (let value18 = 0; value18 < value8.length; value18 += 1) {
      const value19 = value8[value18];
      pe.textContent =
        "正在生成电视图层 " +
        (value18 + 1) +
        "/" +
        value8.length +
        "：" +
        value19.name;
      dl("", value19.key);
      const value20 = await Vo(width, height, {
        pixels: true,
      });
      const value21 = await Ld(value13.imageData, value20.imageData);
      value14.push({
        name: value19.file,
        data: await No(value21),
      });
    }
    for (let value18 = 0; value18 < value9.length; value18 += 1) {
      const value19 = value9[value18];
      pe.textContent =
        "正在生成汽车图层 " +
        (value18 + 1) +
        "/" +
        value9.length +
        "：" +
        value19.name;
      dl("", "", value19.key);
      const value20 = await Vo(width, height, {
        pixels: true,
      });
      const value21 = await Ld(value13.imageData, value20.imageData);
      value14.push({
        name: value19.file,
        data: await No(value21),
      });
    }
    const manifest = {
      schemaVersion: 3,
      exportName: exportName,
      floorMode: fe(),
      floorPresentationGap: fe() === "all" ? finite(T.exportFloorGap, 3) : 0,
      floors: value4.map((floors) => ({
        id: floors.id,
        name: floors.name,
        elevation: Oc(floors),
        offsetX: floors.offsetX,
        offsetZ: floors.offsetZ,
        rotation: floors.rotation,
      })),
      generatedAt: new Date().toISOString(),
      resolution: {
        width: width,
        height: height,
      },
      sourceResolution: sourceResolution,
      renderScale: EXPORT_RENDER_SCALE,
      imageFormat: {
        extension: EXPORT_IMAGE_EXTENSION,
        mimeType: EXPORT_IMAGE_MIME_TYPE,
        quality: EXPORT_IMAGE_QUALITY,
      },
      camera: Qf(width, height),
      backgroundImage: value.has("background") ? value3.background : null,
      baseImage: value.has("backgroundWithPlan")
        ? value3.backgroundWithPlan
        : null,
      floorPlanImage: value.has("floorPlan") ? value3.floorPlan : null,
      televisionOnImage: value8.length === 1 ? value8[0].file : null,
      televisionOnImages: value8.map(
        (televisionOnImages) => televisionOnImages.file,
      ),
      vehicleChargingImage: value9.length === 1 ? value9[0].file : null,
      vehicleChargingImages: value9.map(
        (vehicleChargingImages) => vehicleChargingImages.file,
      ),
      exportedFiles: value14.map((exportedFiles) => exportedFiles.name),
      groups: value5.map((groups) => ({
        id: groups.id,
        groupId: groups.groupId,
        floorId: groups.floor.id,
        name: groups.name,
        file: groups.file,
        anchor: jf(groups.lights, groups.floor, value4),
        enabledInEditor: groups.enabledInEditor,
        lights: groups.lights.map((lights) => Jf(lights, groups.floor)),
      })),
      screens: value6.map(
        ({ key: screens, floor: screens2, item: screens3, ...screens4 }) => ({
          ...screens4,
          anchor: cl(screens3, screens2, value4),
          file: value.has("screen:" + screens) ? screens4.file : null,
        }),
      ),
      vehicles: value7.map(
        ({
          key: vehicles,
          floor: vehicles2,
          item: vehicles3,
          ...vehicles4
        }) => ({
          ...vehicles4,
          anchor: cl(vehicles3, vehicles2, value4),
          file: value.has("vehicle:" + vehicles) ? vehicles4.file : null,
        }),
      ),
    };
    if (value.has("dataLights")) {
      value14.push({
        name: "lights.json",
        data: new TextEncoder().encode(
          JSON.stringify(manifest, null, 2) + "\n",
        ),
      });
    }
    if (value.has("dataScene")) {
      const value18 = fe() === "all" ? kc() : An();
      value14.push({
        name: "scene.json",
        data: new TextEncoder().encode(JSON.stringify(value18, null, 2) + "\n"),
      });
    }
    pe.textContent = "正在打包 ZIP…";
    const value15 = buildStoredZip(value14);
    pe.textContent = "正在保存到 NAS data…";
    const body = new Blob([value15], {
      type: "application/zip",
    });
    const fn9 = (value18 = false) =>
      Go("/studio3d/exports", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/zip",
          "X-Export-Folder": encodeURIComponent(exportName),
          ...(value18
            ? {
                "X-Export-Overwrite": "true",
              }
            : {}),
        },
      });
    let value16;
    try {
      value16 = await fn9(value11);
    } catch (error) {
      if (
        error?.status !== 409 ||
        error?.payload?.detail?.code !== "STUDIO3D_EXPORT_EXISTS"
      ) {
        throw error;
      }
      pe.textContent = "同名导图“" + exportName + "”已经存在";
      const value18 = await Td(exportName);
      if (value18 === "rename") {
        pe.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          ht.focus();
          ht.select();
        }, 0);
        ur("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (value18 !== "overwrite") {
        pe.textContent = "已取消覆盖，原导图保持不变";
        ur("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      pe.textContent = "正在安全覆盖原导图…";
      value16 = await fn9(true);
    }
    pe.textContent = "已保存到 data/" + value16.relativePath;
    _("导图已保存到 data/" + value16.relativePath, "success");
    const value17 = $e ? window.parent : window.opener;
    if (Ue && value17 && ($e || !value17.closed)) {
      value17.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-export",
          componentId: Ue,
          folderName: exportName,
          manifest: manifest,
        },
        window.location.origin,
      );
    }
    ws = true;
    Os();
    eg(value16);
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-export",
      componentId: Ue || "",
    });
    console.error(error);
    pe.textContent = error?.message || "导出失败，请重试。";
    _(error?.message || "导图失败。", "error");
    if ($e && Ue && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-error",
          componentId: Ue,
          message: error?.message || "后台生成失败，请重试。",
        },
        window.location.origin,
      );
    }
  } finally {
    ed(false);
    for (const { key: value12, group: value13 } of ko()) {
      if (W?.groupStates.has(value12)) {
        value13.enabled = W.groupStates.get(value12);
      }
    }
    for (const { key: value12, item: value13 } of Ro()) {
      if (W?.tvStates.has(value12)) {
        value13.screenEnabled = W.tvStates.get(value12);
      }
    }
    for (const { key: value12, item: value13 } of Do()) {
      if (W?.carChargingStates.has(value12)) {
        value13.chargingEnabled = W.carChargingStates.get(value12);
      }
    }
    Lt();
    uo(value2, width / height);
    Ed(false);
    Ua();
  }
}
function Bn(value) {
  const allowed = new Set();
  const allowed2 = new Set();
  value.traverse((value2) => {
    value2.shadow?.dispose?.();
    if (
      value2.geometry &&
      !allowed.has(value2.geometry) &&
      !value2.userData.externalModelSharedGeometry &&
      !value2.userData.sofaSharedGeometry &&
      !value2.userData.rugSharedGeometry &&
      !value2.userData.architectureSharedGeometry
    ) {
      allowed.add(value2.geometry);
      value2.geometry.dispose?.();
    }
    const list = Array.isArray(value2.material)
      ? value2.material
      : value2.material
        ? [value2.material]
        : [];
    for (const value3 of list) {
      if (!allowed2.has(value3)) {
        allowed2.add(value3);
        if (!value2.userData.externalModelSharedTextures) {
          value3.map?.dispose?.();
        }
        if (
          !value2.userData.sofaSharedMaterial &&
          !value2.userData.rugSharedMaterial &&
          !value2.userData.architectureSharedMaterial &&
          !value2.userData.externalModelSharedMaterial
        ) {
          value3.dispose?.();
        }
      }
    }
  });
}
function kd() {
  if (B) {
    for (const value of [...B.children]) {
      B.remove(value);
      Bn(value);
    }
  }
}
function fn8(
  value,
  value2,
  value3,
  value4,
  value5,
  value6,
  value7,
  color,
  value8 = {},
) {
  const value9 = new THREE.MeshStandardMaterial({
    color: color,
    roughness: value8.roughness ?? 0.8,
    metalness: value8.metalness ?? 0.01,
    transparent: !!value8.transparent,
    opacity: value8.opacity ?? 1,
    depthWrite: value8.depthWrite ?? true,
    depthFunc: value8.depthFunc ?? THREE.LessEqualDepth,
    side: value8.side ?? THREE.FrontSide,
    emissive: value8.emissive ?? 0,
    emissiveIntensity: value8.emissiveIntensity ?? 0,
  });
  const count = Math.max(Math.min(value2, value3, value4), 0.001);
  const value10 = Math.min(value8.radius ?? count * 0.14, count * 0.45, 0.08);
  const value11 =
    value8.rounded === false || value.userData.squareEdges
      ? new THREE.BoxGeometry(value2, value3, value4)
      : new RoundedBoxGeometry(
          value2,
          value3,
          value4,
          value8.segments ?? 2,
          value10,
        );
  const value12 = new THREE.Mesh(value11, value9);
  value12.position.set(value5, value6, value7);
  value12.castShadow = value8.castShadow !== false;
  value12.receiveShadow = value8.receiveShadow !== false;
  value12.renderOrder = value8.renderOrder ?? 0;
  value.add(value12);
  return value12;
}
function tg(value) {
  if (Array.isArray(value)) {
    const [
      width,
      height,
      depth,
      value2 = 0,
      value3 = 0,
      value4 = 0,
      rotationY = 0,
    ] = value;
    return {
      width: width,
      height: height,
      depth: depth,
      x: value2,
      y: value3,
      z: value4,
      rotationY: rotationY,
    };
  }
  return {
    width: value.width,
    height: value.height,
    depth: value.depth,
    x: value.x || 0,
    y: value.y || 0,
    z: value.z || 0,
    rotationY: value.rotationY || 0,
  };
}
function ng(value) {
  const value2 = value
    .map(tg)
    .filter((value4) =>
      [value4.width, value4.height, value4.depth].every(
        (value5) => Number.isFinite(value5) && value5 > 0.0001,
      ),
    );
  if (!value2.length) {
    return null;
  }
  const value3 = JSON.stringify(
    value2.map((value4) => [
      value4.width,
      value4.height,
      value4.depth,
      value4.x,
      value4.y,
      value4.z,
      value4.rotationY,
    ]),
  );
  if (!ns.has(value3)) {
    const value4 = value2.map((value6) => {
      const value7 = new THREE.BoxGeometry(
        value6.width,
        value6.height,
        value6.depth,
      );
      const value8 = new THREE.Matrix4().compose(
        new THREE.Vector3(value6.x, value6.y, value6.z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, value6.rotationY, 0),
        ),
        new THREE.Vector3(1, 1, 1),
      );
      return value7.applyMatrix4(value8);
    });
    const value5 = mergeGeometries(value4);
    value4.forEach((value6) => value6.dispose());
    if (!value5) {
      return null;
    }
    ns.set(value3, value5);
  }
  return ns.get(value3);
}
function og(value, value2 = {}) {
  const color = new THREE.Color(value).getHex();
  const value3 = JSON.stringify([
    color,
    value2.roughness ?? 0.8,
    value2.metalness ?? 0.01,
    !!value2.transparent,
    value2.opacity ?? 1,
    value2.depthWrite ?? true,
    value2.depthFunc ?? THREE.LessEqualDepth,
    value2.side ?? THREE.FrontSide,
    value2.emissive ?? 0,
    value2.emissiveIntensity ?? 0,
  ]);
  if (!os.has(value3)) {
    os.set(
      value3,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: value2.roughness ?? 0.8,
        metalness: value2.metalness ?? 0.01,
        transparent: !!value2.transparent,
        opacity: value2.opacity ?? 1,
        depthWrite: value2.depthWrite ?? true,
        depthFunc: value2.depthFunc ?? THREE.LessEqualDepth,
        side: value2.side ?? THREE.FrontSide,
        emissive: value2.emissive ?? 0,
        emissiveIntensity: value2.emissiveIntensity ?? 0,
      }),
    );
  }
  return os.get(value3);
}
function Ve(value, value2, value3, value4 = {}) {
  const value5 = ng(value2);
  if (!value5) {
    return null;
  }
  const value6 = new THREE.Mesh(value5, og(value3, value4));
  value6.castShadow = value4.castShadow !== false;
  value6.receiveShadow = value4.receiveShadow !== false;
  value6.renderOrder = value4.renderOrder ?? 0;
  value6.userData.architectureSharedGeometry = true;
  value6.userData.architectureSharedMaterial = true;
  value.add(value6);
  return value6;
}
function ag(value, value2, value3, value4, value5, value6) {
  const count = Math.max(Math.min(value, value2, value3), 0.001);
  const value7 = Math.min(count * 0.14, count * 0.45, 0.08);
  const value8 = new RoundedBoxGeometry(value, value2, value3, 2, value7);
  value8.translate(value4, value5, value6);
  return value8;
}
function Rd(value) {
  const value2 = value.map((value4) => ag(...value4));
  const value3 = mergeGeometries(value2);
  value2.forEach((value4) => value4.dispose());
  return value3;
}
function ig(value, value2, value3) {
  const value4 = value + ":" + value2 + ":" + value3;
  if (Jr.has(value4)) {
    return Jr.get(value4);
  }
  const frame = Rd([
    [
      value * 0.92,
      value2 * 0.28,
      value3 * 0.72,
      0,
      value2 * 0.28,
      value3 * 0.06,
    ],
    [
      value * 0.92,
      value2 * 0.55,
      value3 * 0.18,
      0,
      value2 * 0.56,
      -value3 * 0.35,
    ],
    [
      value * 0.1,
      value2 * 0.48,
      value3 * 0.75,
      -value * 0.46,
      value2 * 0.39,
      value3 * 0.03,
    ],
    [
      value * 0.1,
      value2 * 0.48,
      value3 * 0.75,
      value * 0.46,
      value2 * 0.39,
      value3 * 0.03,
    ],
  ]);
  const cushions = Rd([
    [
      value * 0.42,
      value2 * 0.12,
      value3 * 0.55,
      -value * 0.22,
      value2 * 0.47,
      value3 * 0.07,
    ],
    [
      value * 0.42,
      value2 * 0.12,
      value3 * 0.55,
      value * 0.22,
      value2 * 0.47,
      value3 * 0.07,
    ],
  ]);
  const value5 =
    frame && cushions
      ? {
          frame: frame,
          cushions: cushions,
        }
      : null;
  if (value5) {
    Jr.set(value4, value5);
  } else {
    frame?.dispose();
    cushions?.dispose();
  }
  return value5;
}
function Dd(color) {
  const text = String(color);
  if (!jr.has(text)) {
    jr.set(
      text,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.01,
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthFunc: THREE.LessEqualDepth,
        side: THREE.FrontSide,
        emissive: 0,
        emissiveIntensity: 0,
      }),
    );
  }
  return jr.get(text);
}
function gp(value, value2, value3, value4) {
  const value5 = ig(value2.width, value2.height, value2.depth);
  if (!value5) {
    return false;
  }
  const value6 = We("item", value2.id);
  for (const [value7, value8] of [
    [value5.frame, value3],
    [value5.cushions, value4],
  ]) {
    const value9 = value6 ? Dd(value8).clone() : Dd(value8);
    const value10 = new THREE.Mesh(value7, value9);
    value10.castShadow = true;
    value10.receiveShadow = true;
    value10.userData.sofaSharedGeometry = true;
    value10.userData.sofaSharedMaterial = !value6;
    value.add(value10);
  }
  return true;
}
function rg(value, value2, value3) {
  const rugThickness = clamp(value2, 0.004, 0.018);
  const value4 = value + ":" + rugThickness + ":" + value3;
  if (!es.has(value4)) {
    const count = Math.max(Math.min(value, rugThickness, value3), 0.001);
    const value5 = Math.min(
      Math.min(value, value3) * 0.018,
      count * 0.45,
      0.08,
    );
    const base = new RoundedBoxGeometry(value, rugThickness, value3, 2, value5);
    const inset = new THREE.PlaneGeometry(value * 0.88, value3 * 0.84);
    es.set(value4, {
      base: base,
      inset: inset,
      rugThickness: rugThickness,
    });
  }
  return es.get(value4);
}
function fr(color, value = false) {
  const value2 = (value ? "inset" : "base") + ":" + color;
  if (!ts.has(value2)) {
    ts.set(
      value2,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0,
        ...(value
          ? {
              polygonOffset: true,
              polygonOffsetFactor: -2,
              polygonOffsetUnits: -4,
            }
          : {}),
      }),
    );
  }
  return ts.get(value2);
}
function sg(value, value2, value3, value4) {
  const value5 = rg(value2.width, value2.height, value2.depth);
  if (!value5) {
    return false;
  }
  const value6 = We("item", value2.id);
  const value7 = value6 ? fr(value3).clone() : fr(value3);
  const value8 = new THREE.Mesh(value5.base, value7);
  value8.position.y = value5.rugThickness * 0.5;
  value8.castShadow = false;
  value8.receiveShadow = true;
  value8.userData.rugSharedGeometry = true;
  value8.userData.rugSharedMaterial = !value6;
  value.add(value8);
  const value9 = value6 ? fr(value4, true).clone() : fr(value4, true);
  const value10 = new THREE.Mesh(value5.inset, value9);
  value10.rotation.x = -Math.PI / 2;
  value10.position.y = value5.rugThickness + 0.001;
  value10.castShadow = false;
  value10.receiveShadow = true;
  value10.renderOrder = 1;
  value10.userData.rugSharedGeometry = true;
  value10.userData.rugSharedMaterial = !value6;
  value.add(value10);
  value.userData.optimizationStats = {
    type: "rug",
    before: 2,
    after: 2,
    sharedResources: true,
  };
  return true;
}
function Fd(value) {
  const material = value.material;
  if (
    !value.isMesh ||
    Array.isArray(material) ||
    !material?.isMeshStandardMaterial ||
    material.transparent ||
    material.opacity < 1 ||
    material.map ||
    material.alphaMap ||
    material.normalMap ||
    material.aoMap
  ) {
    return "";
  } else {
    return JSON.stringify([
      material.color?.getHex(),
      material.roughness,
      material.metalness,
      material.emissive?.getHex(),
      material.emissiveIntensity,
      material.side,
      material.depthWrite,
      material.depthTest,
      material.depthFunc,
      material.blending,
      material.polygonOffset,
      material.polygonOffsetFactor,
      material.polygonOffsetUnits,
      value.castShadow,
      value.receiveShadow,
      value.renderOrder,
    ]);
  }
}
function Ad(value) {
  const value2 = Object.entries(value.geometry?.attributes || {})
    .sort(([value3], [value4]) => value3.localeCompare(value4))
    .map(([value3, value4]) => [
      value3,
      value4.itemSize,
      value4.normalized,
      value4.array?.constructor?.name,
    ]);
  return JSON.stringify([
    !!value.geometry?.index,
    value2,
    Object.keys(value.geometry?.morphAttributes || {}).sort(),
  ]);
}
function gr(value) {
  const value2 = [];
  value.traverse((value3) => {
    if (value3 !== value && value3.isMesh) {
      value2.push(value3);
    }
  });
  return value2;
}
function Gd(value) {
  const material = value.material;
  if (Array.isArray(material) || !material?.isMeshStandardMaterial) {
    return "";
  } else {
    return JSON.stringify([
      material.color?.getHex(),
      material.roughness,
      material.metalness,
      material.emissive?.getHex(),
      material.emissiveIntensity,
      material.side,
      material.transparent,
      material.opacity,
      material.depthWrite,
      material.depthTest,
      material.depthFunc,
      material.blending,
      material.polygonOffset,
      material.polygonOffsetFactor,
      material.polygonOffsetUnits,
      material.map?.uuid || "",
    ]);
  }
}
function lg(value, type) {
  if (!fu.has(type)) {
    return;
  }
  const value2 = gr(value);
  const index = new Map();
  const index2 = new Map();
  for (const value5 of value2) {
    const parameters = value5.geometry?.parameters;
    const value6 = parameters
      ? value5.geometry.type + ":" + JSON.stringify(parameters)
      : "";
    if (value6 && index.has(value6)) {
      value5.geometry.dispose();
      value5.geometry = index.get(value6);
    } else if (value6) {
      index.set(value6, value5.geometry);
    }
    const value7 = Gd(value5);
    if (value7 && index2.has(value7)) {
      value5.material.dispose();
      value5.material = index2.get(value7);
    } else if (value7) {
      index2.set(value7, value5.material);
    }
  }
  value.userData.optimizationStats = {
    type: type,
    before: value2.length,
    after: value2.length,
    uniqueGeometries: new Set(
      value2.map((uniqueGeometries) => uniqueGeometries.geometry),
    ).size,
    uniqueMaterials: new Set(
      value2.map((uniqueMaterials) => uniqueMaterials.material),
    ).size,
  };
}
function cg(value, type) {
  if (!uu.has(type)) {
    return;
  }
  const value2 = gr(value);
  const before = value2.length;
  const index = new Map();
  for (const value5 of value2) {
    const value6 = Fd(value5);
    if (!value6) {
      continue;
    }
    const value7 = value6 + ":" + Ad(value5);
    if (!index.has(value7)) {
      index.set(value7, []);
    }
    index.get(value7).push(value5);
  }
  value.updateMatrixWorld(true);
  const value4 = value.matrixWorld.clone().invert();
  for (const value5 of index.values()) {
    if (value5.length < 2) {
      continue;
    }
    const value6 = value5.map((value10) => {
      const value11 = new THREE.Matrix4().multiplyMatrices(
        value4,
        value10.matrixWorld,
      );
      return value10.geometry.clone().applyMatrix4(value11);
    });
    const value7 = mergeGeometries(value6);
    value6.forEach((value10) => value10.dispose());
    if (!value7) {
      continue;
    }
    const value8 = value5[0];
    const value9 = new THREE.Mesh(value7, value8.material);
    value9.castShadow = value8.castShadow;
    value9.receiveShadow = value8.receiveShadow;
    value9.renderOrder = value8.renderOrder;
    value9.userData = {};
    value5.forEach((value10, value11) => {
      value10.parent?.remove(value10);
      if (!value10.userData.externalModelSharedGeometry) {
        value10.geometry.dispose();
      }
      if (value11 > 0) {
        value10.material.dispose();
      }
    });
    value.add(value9);
  }
  value.userData.optimizationStats = {
    type: type,
    before: before,
    after: gr(value).length,
  };
}
function O(
  value,
  value2,
  value3,
  value4,
  value5,
  value6,
  value7,
  color,
  value8 = {},
) {
  const value9 = new THREE.MeshStandardMaterial({
    color: color,
    roughness: value8.roughness ?? 0.62,
    metalness: value8.metalness ?? 0.03,
    transparent: !!value8.transparent,
    opacity: value8.opacity ?? 1,
    depthWrite: value8.depthWrite ?? true,
  });
  const value10 = new THREE.Mesh(
    new THREE.CylinderGeometry(value2, value3, value4, value8.segments ?? 24),
    value9,
  );
  value10.position.set(value5, value6, value7);
  if (value8.rotationX) {
    value10.rotation.x = value8.rotationX;
  }
  if (value8.rotationZ) {
    value10.rotation.z = value8.rotationZ;
  }
  value10.castShadow = value8.castShadow !== false;
  value10.receiveShadow = value8.receiveShadow !== false;
  value.add(value10);
  return value10;
}
function hl(value) {
  value.userData.exportRole = "light-source-preview";
  value.castShadow = false;
  value.receiveShadow = false;
  value.renderOrder = 20;
  return value;
}
function dg(value, value2) {
  if (value2.type !== "striplight") {
    return;
  }
  const value3 = new THREE.Group();
  value3.userData.exportRole = "light-source-preview";
  value3.userData.lightSourcePreview = true;
  value3.visible =
    value2.lightSourceVisible !== false && !W && We("item", value2.id);
  const emissive = kelvinToRgbHex(value2.lightTemperature) || 16762219;
  const value4 = clamp(finite(value2.depth, 0.28), 0.1, 8);
  const value5 = clamp(finite(value2.width, 1), 0.1, 8);
  const value6 = value4;
  const value7 = new THREE.Group();
  value7.rotation.z = THREE.MathUtils.degToRad(
    normalizeFullRotation(value2.verticalRotation),
  );
  const value8 = new THREE.Group();
  value8.rotation.x = THREE.MathUtils.degToRad(
    normalizeFullRotation(value2.stripRollRotation),
  );
  const value9 = clamp(finite(value2.lightRange, 3.5) * 0.16, 0.28, 0.72);
  hl(
    fn8(value8, value5, 0.014, value6, 0, -value9, 0, emissive, {
      rounded: false,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      emissive: emissive,
      emissiveIntensity: 0.68,
      castShadow: false,
      receiveShadow: false,
    }),
  );
  hl(
    O(value8, 0.012, 0.012, value9, 0, -value9 * 0.5, 0, emissive, {
      segments: 10,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      roughness: 0.3,
      emissive: emissive,
      emissiveIntensity: 0.8,
    }),
  );
  const value10 = new THREE.Mesh(
    new THREE.ConeGeometry(0.045, 0.12, 10),
    new THREE.MeshBasicMaterial({
      color: emissive,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    }),
  );
  value10.rotation.x = Math.PI;
  value10.position.set(0, -value9, 0);
  hl(value10);
  value8.add(value10);
  value7.add(value8);
  value3.add(value7);
  value.add(value3);
}
function hg(value, value2, value3) {
  const value4 = [
    {
      y: 0,
      halfWidth: value * 0.31,
      backZ: -value2 * 0.16,
      sideZ: value2 * 0.08,
      frontZ: value2 * 0.46,
    },
    {
      y: value3 * 0.42,
      halfWidth: value * 0.43,
      backZ: -value2 * 0.34,
      sideZ: value2 * 0.08,
      frontZ: value2 * 0.47,
    },
    {
      y: value3 * 0.72,
      halfWidth: value * 0.49,
      backZ: -value2 * 0.47,
      sideZ: value2 * 0.08,
      frontZ: value2 * 0.47,
    },
  ];
  const value5 = (value13) => {
    const value14 = [
      new THREE.Vector3(-value13.halfWidth, value13.y, value13.backZ),
      new THREE.Vector3(value13.halfWidth, value13.y, value13.backZ),
      new THREE.Vector3(value13.halfWidth, value13.y, value13.sideZ),
    ];
    for (let value15 = 1; value15 <= 18; value15 += 1) {
      const value16 = (value15 / 18) * Math.PI;
      value14.push(
        new THREE.Vector3(
          Math.cos(value16) * value13.halfWidth,
          value13.y,
          value13.sideZ + Math.sin(value16) * (value13.frontZ - value13.sideZ),
        ),
      );
    }
    return value14;
  };
  const value6 = value4.map(value5);
  const length = value6[0].length;
  const value7 = value6.flatMap((value13) =>
    value13.flatMap((value14) => [value14.x, value14.y, value14.z]),
  );
  const value8 = [];
  for (let value13 = 0; value13 < value6.length - 1; value13 += 1) {
    const value14 = value13 * length;
    const value15 = (value13 + 1) * length;
    for (let value16 = 0; value16 < length; value16 += 1) {
      const value17 = (value16 + 1) % length;
      const value18 = value14 + value16;
      const value19 = value14 + value17;
      const value20 = value15 + value16;
      const value21 = value15 + value17;
      value8.push(value18, value21, value19, value18, value20, value21);
    }
  }
  const value9 = value7.length / 3;
  value7.push(0, value4[0].y, value2 * 0.08);
  const value10 = value7.length / 3;
  value7.push(0, value4.at(-1).y, value2 * 0.08);
  const value11 = (value6.length - 1) * length;
  for (let value13 = 0; value13 < length; value13 += 1) {
    const value14 = (value13 + 1) % length;
    value8.push(value9, value13, value14);
    value8.push(value10, value11 + value14, value11 + value13);
  }
  const value12 = new THREE.BufferGeometry();
  value12.setAttribute("position", new THREE.Float32BufferAttribute(value7, 3));
  value12.setIndex(value8);
  value12.computeVertexNormals();
  value12.computeBoundingSphere();
  return value12;
}
function gn(
  value,
  value2,
  value3,
  value4,
  value5,
  value6,
  value7,
  value8,
  value9,
) {
  const value10 = new THREE.Group();
  const value11 = value4 * 0.49;
  const value12 = value4 * 0.12;
  const value13 = -value3 * 0.39;
  fn8(
    value10,
    value2 * 0.9,
    value12,
    value3 * 0.82,
    0,
    value11,
    value3 * 0.02,
    value8,
    {
      radius: Math.min(value2, value3) * 0.06,
      roughness: 0.72,
    },
  );
  fn8(
    value10,
    value2 * 0.78,
    value4 * 0.34,
    value3 * 0.09,
    0,
    value4 * 0.78,
    value13,
    value8,
    {
      radius: Math.min(value2, value3) * 0.045,
      roughness: 0.72,
    },
  );
  for (const value14 of [-0.38, 0.38]) {
    fn8(
      value10,
      0.05,
      value4 * 0.47,
      0.05,
      value2 * value14,
      value4 * 0.235,
      value3 * 0.34,
      value9,
      {
        rounded: false,
      },
    );
    fn8(
      value10,
      0.05,
      value4 * 0.94,
      0.05,
      value2 * value14,
      value4 * 0.47,
      value13,
      value9,
      {
        rounded: false,
      },
    );
  }
  value10.position.set(value5, 0, value6);
  value10.rotation.y = value7;
  value.add(value10);
}
function $d(value, value2, value3, value4) {
  const value5 = {
    rounded: false,
    metalness: 0.18,
    roughness: 0.36,
    castShadow: false,
    receiveShadow: false,
  };
  const value6 = [];
  const value7 = [];
  for (const value8 of value2) {
    const value9 = Math.min(0.045, value8.width * 0.08, value8.height * 0.04);
    const count = Math.max(value8.width - value9 * 2, 0.04);
    const count2 = Math.max(value8.height - value9 * 2, 0.08);
    value6.push([
      count,
      count2,
      0.018,
      value8.centerX,
      value8.height / 2,
      value8.centerZ,
    ]);
    value7.push(
      [value8.width, value9, 0.045, value8.centerX, value9 / 2, value8.centerZ],
      [
        value8.width,
        value9,
        0.045,
        value8.centerX,
        value8.height - value9 / 2,
        value8.centerZ,
      ],
      [
        value9,
        value8.height,
        0.045,
        value8.centerX - value8.width / 2 + value9 / 2,
        value8.height / 2,
        value8.centerZ,
      ],
      [
        value9,
        value8.height,
        0.045,
        value8.centerX + value8.width / 2 - value9 / 2,
        value8.height / 2,
        value8.centerZ,
      ],
    );
  }
  for (const value8 of value6) {
    Ve(value, [value8], value4, {
      rounded: false,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.08,
      metalness: 0.03,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 7,
    });
  }
  Ve(value, value7, value3, value5);
}
function ug(value, value2) {
  if (!value2) {
    return;
  }
  const value3 = ao();
  value.traverse((value4) => {
    const list = Array.isArray(value4.material)
      ? value4.material
      : value4.material
        ? [value4.material]
        : [];
    for (const value5 of list) {
      if (value5?.isMeshStandardMaterial) {
        value5.emissive = new THREE.Color(value3.accent);
        value5.emissiveIntensity = 0.32;
      }
    }
  });
}
function fg(value) {
  const value2 = document.createElement("canvas");
  value2.width = 2048;
  value2.height = 640;
  const value3 = value2.getContext("2d");
  value3.clearRect(0, 0, value2.width, value2.height);
  value3.fillStyle = "#929baa";
  value3.textAlign = "left";
  value3.textBaseline = "middle";
  const labelText = normalizeLabelText(value.title, "家庭总览", 24);
  const labelText2 = normalizeLabelText(value.subtitle, "HOME PLAN", 36);
  const value6 = 115;
  const value7 = 184;
  value3.font = "700 " + value7 + "px sans-serif";
  drawTrackedText(
    value3,
    labelText,
    value6,
    130,
    value7 * clamp(finite(value.titleSpacing, 1.05), 0, 1.8),
    1340,
  );
  const value8 = 1580;
  const value9 = 130;
  const value10 = 170;
  value3.fillStyle = "#929baa";
  value3.beginPath();
  value3.moveTo(value8, value9 - value10 * 0.58);
  value3.lineTo(value8 + value10 * 0.56, value9 - value10 * 0.02);
  value3.lineTo(value8 + value10 * 0.38, value9 - value10 * 0.02);
  value3.lineTo(value8 + value10 * 0.38, value9 + value10 * 0.5);
  value3.lineTo(value8 - value10 * 0.38, value9 + value10 * 0.5);
  value3.lineTo(value8 - value10 * 0.38, value9 - value10 * 0.02);
  value3.lineTo(value8 - value10 * 0.56, value9 - value10 * 0.02);
  value3.closePath();
  value3.fill();
  value3.save();
  value3.globalCompositeOperation = "destination-out";
  value3.fillRect(
    value8 - value10 * 0.09,
    value9 + value10 * 0.2,
    value10 * 0.18,
    value10 * 0.3,
  );
  value3.restore();
  value3.fillStyle = "#929baa";
  value3.textAlign = "left";
  const value11 = 310;
  value3.font = "400 " + value11 + 'px "Arial Narrow", Arial, sans-serif';
  drawTrackedText(
    value3,
    labelText2,
    72,
    410,
    value11 * clamp(finite(value.subtitleSpacing, 0.08), 0, 0.6),
    1880,
  );
  const value12 = 74;
  const value13 =
    value12 + clamp(finite(value.lineLength, 0.86), 0.3, 1) * 1880;
  value3.strokeStyle = "rgba(146, 155, 170, 0.72)";
  value3.lineWidth = 16;
  value3.beginPath();
  value3.moveTo(value12, 590);
  value3.lineTo(value13, 590);
  value3.moveTo(value12, 566);
  value3.lineTo(value12, 614);
  value3.moveTo(value13, 566);
  value3.lineTo(value13, 614);
  value3.stroke();
  const map = new THREE.CanvasTexture(value2);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = Math.min(
    renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    8,
  );
  map.needsUpdate = true;
  const value14 = new THREE.Mesh(
    new THREE.PlaneGeometry(value.width, value.depth),
    new THREE.MeshBasicMaterial({
      map: map,
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  value14.rotation.x = -Math.PI / 2;
  value14.position.y = 0.008;
  value14.castShadow = false;
  value14.receiveShadow = false;
  value14.renderOrder = 8;
  return value14;
}
function zd() {
  return new Set(
    selectShadowCastingLightIds(
      scene.items.map((value) => ({
        id: value.id,
        groupId: value.lightGroupId,
        type: value.type,
        brightness: finite(
          value.lightBrightness,
          Rt[value.type]?.brightness || 0,
        ),
        enabled: re.has(value.type) && Ds(value),
      })),
      sc,
    ),
  );
}
function gg(value) {
  if (!value || value.isMeshBasicMaterial || value.isShadowMaterial) {
    return 0;
  }
  let length = Object.values(value).filter(
    (value2) => value2?.isTexture === true,
  ).length;
  if (value.isMeshPhysicalMaterial && finite(value.transmission, 0) > 0) {
    length += 1;
  }
  return length;
}
function pg(value = B) {
  let value2 = 0;
  value?.traverse((value3) => {
    if (!value3.isMesh) {
      return;
    }
    const list = Array.isArray(value3.material)
      ? value3.material
      : value3.material
        ? [value3.material]
        : [];
    for (const value4 of list) {
      value2 = Math.max(value2, gg(value4));
    }
  });
  if (ve?.environment?.isTexture) {
    value2 += 1;
  }
  return value2;
}
function mg() {
  const value = renderer?.getContext?.();
  const value2 = value?.getParameter?.(value.MAX_TEXTURE_IMAGE_UNITS);
  return Math.max(
    1,
    Math.floor(finite(value2, renderer?.capabilities?.maxTextures || 16)),
  );
}
function Bd(value = B) {
  const value2 = [];
  value?.traverse((value3) => {
    if (!value3.isSpotLight || value3.userData?.shadowCandidate !== true) {
      return;
    }
    const text = String(value3.userData?.lightFloorId || "");
    const text2 = String(value3.userData?.lightItemId || "");
    if (text2) {
      value2.push({
        id: text + ":" + text2,
        groupId: text + ":" + String(value3.userData?.lightGroupId || ""),
        type: String(value3.userData?.lightType || "downlight"),
        brightness: finite(value3.userData?.lightBrightness, 0),
        enabled: value3.visible !== false,
      });
    }
  });
  return value2;
}
function On(value = B, { rebuildAtlas: value2 = true } = {}) {
  if (!value || !renderer) {
    return 0;
  }
  const maxTextureUnits = mg();
  const materialTextureUnits = pg(value);
  let nonSpotShadowTextureUnits = 0;
  ve?.traverse((value8) => {
    if (
      value8.visible !== false &&
      value8.isLight &&
      !value8.isSpotLight &&
      value8.castShadow
    ) {
      nonSpotShadowTextureUnits += 1;
    }
  });
  let value3 = false;
  value.traverse((value8) => {
    if (value8.visible !== false && value8.isRectAreaLight) {
      value3 = true;
    }
  });
  const rectAreaLightTextureUnits = value3 ? lu : 0;
  const value4 =
    maxTextureUnits -
    materialTextureUnits -
    nonSpotShadowTextureUnits -
    rectAreaLightTextureUnits -
    lc;
  if (!W && Ut && value4 >= 1) {
    const value8 = value2
      ? Ut.schedule(value)
      : (Ut.sync(value), Bd(value).length);
    const value9 = Ut.sync(value);
    const domElement2 = renderer.domElement;
    domElement2.dataset.fragmentTextureUnits = String(maxTextureUnits);
    domElement2.dataset.materialTextureUnits = String(materialTextureUnits);
    domElement2.dataset.spotShadowLimit = String(value8);
    domElement2.dataset.activeSpotShadows = String(value9);
    let value10 = 0;
    value.traverse((value11) => {
      if (
        value11.isLight &&
        value11.userData?.lightItemId &&
        value11.visible !== false
      ) {
        value10 += 1;
      }
    });
    domElement2.dataset.activeUserLights = String(value10);
    return value9;
  }
  const value5 = spotShadowTextureUnitLimit({
    maxTextureUnits: maxTextureUnits,
    materialTextureUnits: materialTextureUnits,
    nonSpotShadowTextureUnits: nonSpotShadowTextureUnits,
    rectAreaLightTextureUnits: rectAreaLightTextureUnits,
    reservedTextureUnits: lc,
    hardLimit: sc,
  });
  if (W && Ut) {
    Ut.setEnabled(false);
    Ut.sync(value);
  }
  const allowed = new Set(selectShadowCastingLightIds(Bd(value), value5));
  let value6 = 0;
  value.traverse((value8) => {
    if (!value8.isSpotLight || !value8.userData?.lightItemId) {
      return;
    }
    const value9 =
      String(value8.userData?.lightFloorId || "") +
      ":" +
      String(value8.userData.lightItemId);
    const value10 = allowed.has(value9);
    value8.castShadow = value10;
    if (value10) {
      value6 += 1;
      if (value8.shadow && !value8.shadow.map) {
        value8.shadow.needsUpdate = true;
      }
    }
  });
  const domElement = renderer.domElement;
  domElement.dataset.spotShadowMode = "individual";
  domElement.dataset.fragmentTextureUnits = String(maxTextureUnits);
  domElement.dataset.materialTextureUnits = String(materialTextureUnits);
  domElement.dataset.spotShadowLimit = String(value5);
  domElement.dataset.activeSpotShadows = String(value6);
  let value7 = 0;
  value.traverse((value8) => {
    if (
      value8.isLight &&
      value8.userData?.lightItemId &&
      value8.visible !== false
    ) {
      value7 += 1;
    }
  });
  domElement.dataset.activeUserLights = String(value7);
  return value6;
}
function wg(value, value2, value3) {
  const value4 = kelvinToRgbHex(value2.lightTemperature);
  const value5 = Ds(value2) && finite(value2.lightBrightness, 0) > 0;
  const value6 = !W && Yn === null && !Ye();
  const value7 = !W && Fi;
  if (!value5 && !value6 && !value7) {
    return;
  }
  const value8 = Rt[value2.type] || Rt.downlight;
  const value9 =
    clamp(finite(value2.lightBrightness, value8.brightness), 0, 100) / 100;
  const value10 = ru[value2.type] || 1.1;
  const value11 = value2.type === "striplight";
  const value12 = Vi(value2);
  if (value11) {
    const value19 = clamp(finite(value2.width, 2), 0.1, 8);
    const value20 = clamp(finite(value2.depth, 0.28), 0.1, 8);
    const value21 = clamp(finite(value2.lightRange, value8.range), 0.5, 10);
    const value22 = clamp(value21 / value8.range, 0.45, 1.65);
    const count = Math.max(finite(value2.elevation, 2.7), 0.4);
    const value23 = clamp(Math.max(1, Math.pow(count / 2.7, 2)), 1, 4);
    const value24 = new THREE.Group();
    value24.rotation.z = THREE.MathUtils.degToRad(
      normalizeFullRotation(value2.verticalRotation),
    );
    const value25 = new THREE.Group();
    value25.rotation.x = THREE.MathUtils.degToRad(
      normalizeFullRotation(value2.stripRollRotation),
    );
    const value26 = Math.pow(value9, 0.82) * 48 * value22 * value23 * value10;
    const value27 = new THREE.RectAreaLight(
      value4,
      value5 ? value26 : 0,
      value19 * 0.94,
      value20 * 0.94,
    );
    value27.visible = value5;
    value27.position.y = -0.04;
    value27.rotation.x = -Math.PI / 2;
    value27.userData.lightItemId = value2.id;
    value27.userData.lightGroupId = value12?.id || "";
    value27.userData.lightFloorId = xe;
    value27.userData.lightSourceType = "continuous-area-strip";
    value27.userData.lightOnIntensity = value26;
    value25.add(value27);
    value24.add(value25);
    value.add(value24);
    return;
  }
  const value13 = value3?.has(value2.id) === true;
  const value14 = value13 || value7 || value6;
  const value15 = clamp(finite(value2.lightRange, value8.range), 0.5, 10);
  const value16 = clamp(
    finite(value2.lightAngle, value8.angle),
    15,
    vo(value2.type),
  );
  const value17 = 1;
  const value18 =
    (value2.type === "ceilinglight" ? 680 : 520) *
    spotLightBrightnessResponse(value2.type, value9) *
    value10;
  for (let value19 = 0; value19 < value17; value19 += 1) {
    const value20 =
      value17 === 1
        ? 0
        : -value2.width * 0.47 +
          (value2.width * 0.94 * value19) / (value17 - 1);
    const value21 = new THREE.SpotLight(
      value4,
      value5 ? value18 / value17 : 0,
      value15,
      THREE.MathUtils.degToRad(value16 / 2),
      0.86,
      2,
    );
    value21.visible = value5;
    value21.position.set(value20, -0.025, 0);
    value21.castShadow = false;
    value21.layers.enable(kt);
    if (value14) {
      const value23 = localSpotShadowSettings(value2.type, value15, value16);
      const value24 = cf(value23.mapSize);
      value21.shadow.mapSize.set(value24, value24);
      value21.shadow.camera.near = clamp(value15 * 0.05, 0.12, 0.24);
      value21.shadow.camera.far = value15;
      value21.shadow.camera.layers.set(kt);
      value21.shadow.bias = -0.00005;
      value21.shadow.normalBias = value23.normalBias;
      value21.shadow.radius = value23.radius;
      value21.shadow.blurSamples = Lo
        ? Math.max(8, value23.blurSamples)
        : value23.blurSamples;
      value21.shadow.autoUpdate = false;
      value21.shadow.needsUpdate = value13;
    }
    value21.userData.lightItemId = value2.id;
    value21.userData.lightGroupId = value12?.id || "";
    value21.userData.lightFloorId = xe;
    value21.userData.lightType = value2.type;
    value21.userData.lightBrightness = finite(
      value2.lightBrightness,
      value8.brightness,
    );
    value21.userData.shadowCandidate = true;
    value21.userData.lightOnIntensity = value18 / value17;
    const value22 = new THREE.Object3D();
    value22.position.set(
      value20,
      -Math.max(finite(value2.elevation, 2.68), 0.8),
      0,
    );
    value.add(value22);
    value21.target = value22;
    value.add(value21);
  }
}
function yg() {
  const value = document.createElement("canvas");
  value.width = 960;
  value.height = 540;
  const value2 = value.getContext("2d");
  if (!value2) {
    return null;
  }
  value2.fillStyle = "#07111d";
  value2.fillRect(0, 0, value.width, value.height);
  value2.fillStyle = "#0f2031";
  value2.fillRect(0, 0, 510, value.height);
  value2.fillStyle = "#ff9f36";
  value2.fillRect(54, 54, 12, 54);
  value2.fillStyle = "#f4f8fb";
  value2.font = "700 42px Arial, sans-serif";
  value2.fillText("HA BRIDGE", 88, 92);
  value2.fillStyle = "#7f93a6";
  value2.font = "600 15px Arial, sans-serif";
  value2.fillText("SMART HOME, SIMPLY CONNECTED", 88, 119);
  value2.fillStyle = "#ffffff";
  value2.font = "700 48px sans-serif";
  value2.fillText("让全屋设备", 54, 224);
  value2.fillText("自然协作", 54, 286);
  value2.fillStyle = "#9cafbf";
  value2.font = "400 20px sans-serif";
  value2.fillText("一张图，连接灯光、环境与家庭场景", 56, 331);
  [
    {
      label: "LIGHT",
      color: "#ff9f36",
    },
    {
      label: "CLIMATE",
      color: "#32c59b",
    },
    {
      label: "SECURITY",
      color: "#5c9dff",
    },
  ].forEach((value5, value6) => {
    const value7 = 54 + value6 * 142;
    value2.fillStyle = "#172d40";
    value2.beginPath();
    value2.roundRect(value7, 398, 126, 54, 8);
    value2.fill();
    value2.fillStyle = value5.color;
    value2.fillRect(value7 + 14, 414, 8, 22);
    value2.fillStyle = "#dbe5ed";
    value2.font = "700 13px Arial, sans-serif";
    value2.fillText(value5.label, value7 + 32, 432);
  });
  value2.fillStyle = "#0a1624";
  value2.fillRect(510, 0, 450, 540);
  value2.fillStyle = "#15283a";
  value2.beginPath();
  value2.roundRect(552, 44, 366, 164, 12);
  value2.fill();
  value2.fillStyle = "#8295a6";
  value2.font = "600 14px Arial, sans-serif";
  value2.fillText("HOME STATUS", 578, 76);
  value2.fillStyle = "#f5f8fb";
  value2.font = "700 58px Arial, sans-serif";
  value2.fillText("24°", 578, 148);
  value2.fillStyle = "#32c59b";
  value2.beginPath();
  value2.arc(856, 118, 31, 0, Math.PI * 2);
  value2.fill();
  value2.fillStyle = "#07111d";
  value2.font = "700 17px Arial, sans-serif";
  value2.textAlign = "center";
  value2.fillText("ON", 856, 124);
  value2.textAlign = "left";
  value2.fillStyle = "#91a4b5";
  value2.font = "400 15px Arial, sans-serif";
  value2.fillText("COMFORT MODE · ALL SYSTEMS READY", 578, 181);
  const value3 = [
    {
      x: 552,
      y: 230,
      color: "#ff9f36",
      value: "8",
      label: "LIGHTS",
    },
    {
      x: 742,
      y: 230,
      color: "#5c9dff",
      value: "4",
      label: "ROOMS",
    },
    {
      x: 552,
      y: 360,
      color: "#32c59b",
      value: "92%",
      label: "AIR",
    },
    {
      x: 742,
      y: 360,
      color: "#ef6580",
      value: "SAFE",
      label: "HOME",
    },
  ];
  for (const element of value3) {
    value2.fillStyle = "#15283a";
    value2.beginPath();
    value2.roundRect(element.x, element.y, 176, 108, 10);
    value2.fill();
    value2.fillStyle = element.color;
    value2.fillRect(element.x + 18, element.y + 18, 30, 5);
    value2.fillStyle = "#f4f8fb";
    value2.font = "700 29px Arial, sans-serif";
    value2.fillText(element.value, element.x + 18, element.y + 66);
    value2.fillStyle = "#8295a6";
    value2.font = "600 12px Arial, sans-serif";
    value2.fillText(element.label, element.x + 18, element.y + 89);
  }
  const value4 = new THREE.CanvasTexture(value);
  value4.colorSpace = THREE.SRGBColorSpace;
  value4.anisotropy = Math.min(
    renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    8,
  );
  value4.needsUpdate = true;
  return value4;
}
function Od(value, value2) {
  const value3 = value.tvMountStyle === "mobile";
  const value4 = value.tvMountStyle === "tabletop";
  return {
    bodyHeight: value2 * (value3 ? 0.43 : value4 ? 0.56 : 0.62),
    centerY: value2 * (value3 ? 0.76 : value4 ? 0.67 : 0.62),
  };
}
function xg(value, value2, value3, value4, value5) {
  const { bodyHeight: value6, centerY: value7 } = Od(value2, value5);
  const value8 = value3 * 0.965;
  const value9 = value6 * 0.94;
  const value10 = 0.012;
  const value11 = Math.max(value4 * 0.28, 0.05) * 0.5 + 0.006;
  const value12 = value11 - value10 * 0.5;
  if (value2.screenEnabled === false) {
    fn8(value, value8, value9, value10, 0, value7, value12, 527122, {
      roughness: 0.18,
    });
    return;
  }
  const value13 = new THREE.Mesh(
    new THREE.PlaneGeometry(value8 * 1.035, value9 * 1.08),
    new THREE.MeshBasicMaterial({
      color: 7253215,
      transparent: true,
      opacity: 0.09,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  value13.position.set(0, value7, value11 - 0.014);
  value13.renderOrder = 6;
  value13.castShadow = false;
  value13.receiveShadow = false;
  value.add(value13);
  const map = yg();
  const value14 = new THREE.MeshBasicMaterial({
    color: 527122,
    toneMapped: false,
  });
  const value15 = new THREE.MeshBasicMaterial({
    color: map ? 16777215 : 1519946,
    map: map,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const value16 = new THREE.Mesh(
    new THREE.BoxGeometry(value8, value9, value10),
    [value14, value14, value14, value14, value15, value14],
  );
  value16.position.set(0, value7, value12);
  value16.renderOrder = 7;
  value16.castShadow = false;
  value16.receiveShadow = false;
  value.add(value16);
}
function vg(value, value2, value3, value4, value5) {
  if (value2.chargingEnabled !== true) {
    return;
  }
  const value6 = 5238711;
  const value7 = document.createElement("canvas");
  value7.width = 256;
  value7.height = 256;
  const value8 = value7.getContext("2d");
  const value9 = value7.width / 2;
  const value10 = value8.createRadialGradient(
    value9,
    value9,
    0,
    value9,
    value9,
    value9,
  );
  value10.addColorStop(0, "rgba(79, 239, 183, .48)");
  value10.addColorStop(0.46, "rgba(79, 239, 183, .23)");
  value10.addColorStop(1, "rgba(79, 239, 183, 0)");
  value8.fillStyle = value10;
  value8.fillRect(0, 0, value7.width, value7.height);
  for (let value14 = 18; value14 < value7.height - 18; value14 += 10) {
    for (let value15 = 18; value15 < value7.width - 18; value15 += 10) {
      const value16 = Math.hypot(value15 - value9, value14 - value9) / value9;
      const value17 = Math.max(0, 1 - value16) * 0.32;
      if (!(value17 <= 0.01)) {
        value8.fillStyle = "rgba(116, 255, 202, " + value17 + ")";
        value8.beginPath();
        value8.arc(value15, value14, 1.45, 0, Math.PI * 2);
        value8.fill();
      }
    }
  }
  const map = new THREE.CanvasTexture(value7);
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;
  const value11 = new THREE.Mesh(
    new THREE.PlaneGeometry(value3 * 1.72, value4 * 1.42),
    new THREE.MeshBasicMaterial({
      map: map,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -3,
    }),
  );
  value11.rotation.x = -Math.PI / 2;
  value11.position.y = 0.014;
  value11.renderOrder = 2;
  value11.castShadow = false;
  value11.receiveShadow = false;
  value.add(value11);
  const value12 = new THREE.Shape();
  value12.moveTo(0.08, 0.5);
  value12.lineTo(-0.22, 0.04);
  value12.lineTo(-0.03, 0.04);
  value12.lineTo(-0.13, -0.5);
  value12.lineTo(0.25, -0.02);
  value12.lineTo(0.05, -0.02);
  value12.closePath();
  const value13 = new THREE.Mesh(
    new THREE.ShapeGeometry(value12),
    new THREE.MeshBasicMaterial({
      color: 8257488,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  const count = Math.max(Math.min(value3, value4) * 0.22, 0.18);
  value13.scale.setScalar(count);
  value13.rotation.x = -Math.PI / 2;
  value13.position.set(0, value5 + 0.04, 0);
  value13.renderOrder = 9;
  value13.castShadow = false;
  value13.receiveShadow = false;
  value.add(value13);
}
function ul(value, value2 = null) {
  const value3 = new THREE.Group();
  value3.userData.squareEdges = iu.has(value.type);
  if (gu.has(value.type)) {
    value3.userData.optimizationBatch = "v1-next-ten";
  }
  const width = value.width;
  const depth = value.depth;
  const height = value.height;
  const value4 = ao();
  const furniture = value4.furniture;
  const value5 = value4.appliance ?? furniture;
  const color = value4.furnitureSoft;
  const color2 = value4.furnitureLight;
  const color3 = value4.furnitureDark;
  if (re.has(value.type)) {
    wg(value3, value, value2);
    dg(value3, value);
  } else if (value.type === "planlabel") {
    value3.add(fg(value));
  } else if (
    value.offlineModelExport !== true &&
    ALL_ITEM_MODELS[value.type] &&
    value.type !== "smallcar" &&
    value.type !== "sofa"
  ) {
    if (!xi(value3, value)) {
      fn8(
        value3,
        width,
        height,
        depth,
        0,
        height * 0.5,
        0,
        rc.has(value.type) ? value5 : furniture,
        {
          rounded: false,
          roughness: 0.6,
          metalness: 0.1,
        },
      );
    }
  } else if (value.type === "smallcar") {
    if (!xi(value3, value)) {
      fn8(
        value3,
        width * 0.96,
        height * 0.38,
        depth * 0.9,
        0,
        height * 0.28,
        0,
        furniture,
        {
          roughness: 0.46,
          metalness: 0.18,
        },
      );
      fn8(
        value3,
        width * 0.78,
        height * 0.42,
        depth * 0.48,
        0,
        height * 0.62,
        -depth * 0.03,
        color,
        {
          roughness: 0.38,
          metalness: 0.12,
        },
      );
      for (const value6 of [-0.48, 0.48]) {
        for (const value7 of [-0.3, 0.3]) {
          fn8(
            value3,
            width * 0.1,
            height * 0.22,
            depth * 0.17,
            value6 * width,
            height * 0.17,
            value7 * depth,
            color3,
            {
              rounded: false,
              roughness: 0.82,
            },
          );
        }
      }
    }
    vg(value3, value, width, depth, height);
  } else if (value.type === "curtain") {
    const value6 = ["left", "right", "split"].includes(value.curtainPosition)
      ? value.curtainPosition
      : "split";
    const value7 = Math.min(Math.max(depth * 0.09, 0.012), 0.028);
    const value8 = height - value7 * 1.8;
    const value9 = value8 - value7 * 1.8;
    const count = Math.max(height * 0.025, 0.025);
    const count2 = Math.max(value9 - count, height * 0.72);
    O(value3, value7, value7, width * 1.06, 0, value8, 0, color3, {
      segments: 18,
      rotationZ: Math.PI / 2,
      metalness: 0.68,
      roughness: 0.22,
    });
    for (const value10 of [-width * 0.52, width * 0.52]) {
      O(
        value3,
        value7 * 1.45,
        value7 * 1.45,
        value7 * 0.9,
        value10,
        value8,
        0,
        color2,
        {
          segments: 18,
          rotationZ: Math.PI / 2,
          metalness: 0.52,
          roughness: 0.26,
        },
      );
    }
    const fn9 = (value10, value11) => {
      const value12 = value11 / 7;
      for (let value13 = 0; value13 < 7; value13 += 1) {
        const value14 = value10 + value12 * (value13 + 0.5);
        const value15 = value13 % 2 === 0 ? depth * 0.1 : -depth * 0.1;
        fn8(
          value3,
          value12 * 1.24,
          count2,
          depth * 0.62,
          value14,
          count + count2 * 0.5,
          value15,
          color2,
          {
            radius: Math.min(value12 * 0.34, 0.035),
            roughness: 0.94,
            metalness: 0,
          },
        );
      }
      fn8(
        value3,
        value11 * 1.03,
        Math.max(height * 0.018, 0.025),
        depth * 0.74,
        value10 + value11 * 0.5,
        count + height * 0.015,
        0,
        color3,
        {
          radius: 0.01,
          roughness: 0.72,
          metalness: 0.02,
        },
      );
      fn8(
        value3,
        value11 * 1.06,
        Math.max(height * 0.025, 0.035),
        depth * 0.82,
        value10 + value11 * 0.5,
        count + count2 * 0.52,
        0,
        color2,
        {
          radius: 0.012,
          roughness: 0.48,
          metalness: 0.08,
        },
      );
    };
    if (value6 === "left") {
      fn9(-width * 0.5, width * 0.24);
    } else if (value6 === "right") {
      fn9(width * 0.26, width * 0.24);
    } else {
      fn9(-width * 0.5, width * 0.16);
      fn9(width * 0.34, width * 0.16);
    }
  } else if (Ur.has(value.type)) {
    const value6 = depth / 10;
    for (let value7 = 0; value7 < 10; value7 += 1) {
      const value8 = (height * (value7 + 1)) / 10;
      const value9 = -depth * 0.5 + value6 * (value7 + 0.5);
      fn8(
        value3,
        width,
        value8,
        value6 * 1.015,
        0,
        value8 * 0.5,
        value9,
        value7 % 2 ? furniture : color,
        {
          rounded: false,
          roughness: 0.82,
        },
      );
      fn8(
        value3,
        width * 1.01,
        0.018,
        value6 * 0.94,
        0,
        value8 + 0.009,
        value9,
        color2,
        {
          rounded: false,
          castShadow: false,
          roughness: 0.72,
        },
      );
    }
  } else if (value.type === "sofa") {
    const value6 = height * 0.14;
    const fn9 = (value7) => value7 - value6 + -0.008;
    fn8(
      value3,
      width * 0.92,
      height * 0.28,
      depth * 0.72,
      0,
      fn9(height * 0.28),
      depth * 0.06,
      furniture,
    );
    fn8(
      value3,
      width * 0.92,
      height * 0.55,
      depth * 0.18,
      0,
      fn9(height * 0.56),
      -depth * 0.35,
      furniture,
    );
    fn8(
      value3,
      width * 0.1,
      height * 0.48,
      depth * 0.75,
      -width * 0.46,
      fn9(height * 0.39),
      depth * 0.03,
      furniture,
    );
    fn8(
      value3,
      width * 0.1,
      height * 0.48,
      depth * 0.75,
      width * 0.46,
      fn9(height * 0.39),
      depth * 0.03,
      furniture,
    );
    fn8(
      value3,
      width * 0.42,
      height * 0.12,
      depth * 0.55,
      -width * 0.22,
      fn9(height * 0.47),
      depth * 0.07,
      color,
    );
    fn8(
      value3,
      width * 0.42,
      height * 0.12,
      depth * 0.55,
      width * 0.22,
      fn9(height * 0.47),
      depth * 0.07,
      color,
    );
  } else if (value.type === "bed") {
    fn8(value3, width, height * 0.3, depth, 0, height * 0.15, 0, color3);
    fn8(
      value3,
      width * 0.96,
      height * 0.32,
      depth * 0.92,
      0,
      height * 0.43,
      depth * 0.03,
      color,
    );
    fn8(
      value3,
      width,
      height * 0.95,
      depth * 0.09,
      0,
      height * 0.48,
      -depth * 0.455,
      furniture,
    );
    fn8(
      value3,
      width * 0.38,
      height * 0.14,
      depth * 0.22,
      -width * 0.23,
      height * 0.66,
      -depth * 0.29,
      color2,
    );
    fn8(
      value3,
      width * 0.38,
      height * 0.14,
      depth * 0.22,
      width * 0.23,
      height * 0.66,
      -depth * 0.29,
      color2,
    );
  } else if (value.type === "nightstand") {
    fn8(value3, width, height * 0.78, depth, 0, height * 0.49, 0, furniture);
    fn8(
      value3,
      width * 1.04,
      height * 0.07,
      depth * 1.05,
      0,
      height * 0.91,
      0,
      color,
      {
        roughness: 0.5,
      },
    );
    fn8(
      value3,
      width * 0.9,
      0.014,
      depth * 1.01,
      0,
      height * 0.63,
      depth * 0.01,
      color3,
      {
        rounded: false,
      },
    );
    fn8(
      value3,
      width * 0.9,
      0.014,
      depth * 1.01,
      0,
      height * 0.38,
      depth * 0.01,
      color3,
      {
        rounded: false,
      },
    );
    fn8(
      value3,
      width * 0.22,
      0.022,
      0.032,
      0,
      height * 0.5,
      depth * 0.52,
      color2,
      {
        metalness: 0.5,
      },
    );
    for (const value6 of [-0.38, 0.38]) {
      for (const value7 of [-0.35, 0.35]) {
        fn8(
          value3,
          0.035,
          height * 0.2,
          0.035,
          width * value6,
          height * 0.1,
          depth * value7,
          color3,
          {
            metalness: 0.18,
          },
        );
      }
    }
  } else if (value.type === "table") {
    const value6 = width * 0.64;
    const value7 = depth * 0.48;
    fn8(value3, value6, height * 0.1, value7, 0, height * 0.93, 0, furniture);
    for (const value11 of [-0.43, 0.43]) {
      for (const value12 of [-0.38, 0.38]) {
        fn8(
          value3,
          0.07,
          height * 0.9,
          0.07,
          value6 * value11,
          height * 0.45,
          value7 * value12,
          color3,
        );
      }
    }
    const value8 = Math.min(width * 0.2, 0.5);
    const value9 = Math.min(depth * 0.27, 0.5);
    const value10 = height * 1.18;
    gn(
      value3,
      value8,
      value9,
      value10,
      -width * 0.37,
      0,
      Math.PI / 2,
      color,
      color3,
    );
    gn(
      value3,
      value8,
      value9,
      value10,
      width * 0.37,
      0,
      -Math.PI / 2,
      color,
      color3,
    );
    gn(value3, value8, value9, value10, 0, -depth * 0.35, 0, color, color3);
    gn(
      value3,
      value8,
      value9,
      value10,
      0,
      depth * 0.35,
      Math.PI,
      color,
      color3,
    );
  } else if (Mn.has(value.type)) {
    const value6 = Math.min(width, depth) * 0.32;
    const count = Math.max(height * 0.07, 0.045);
    const value7 = height * 0.92;
    O(value3, value6, value6, count, 0, value7, 0, color2, {
      segments: 48,
      roughness: 0.5,
      metalness: 0.08,
    });
    O(
      value3,
      Math.min(width, depth) * 0.22,
      Math.min(width, depth) * 0.3,
      height * 0.68,
      0,
      height * 0.43,
      0,
      furniture,
      {
        segments: 36,
        roughness: 0.55,
        metalness: 0.06,
      },
    );
    O(
      value3,
      Math.min(width, depth) * 0.34,
      Math.min(width, depth) * 0.34,
      height * 0.07,
      0,
      height * 0.045,
      0,
      color3,
      {
        segments: 40,
        roughness: 0.42,
        metalness: 0.12,
      },
    );
    if (yi(value)) {
      O(
        value3,
        value6 * 0.58,
        value6 * 0.58,
        Math.max(height * 0.035, 0.025),
        0,
        value7 + count * 0.58,
        0,
        color,
        {
          segments: 48,
          roughness: 0.48,
          metalness: 0.08,
        },
      );
      O(
        value3,
        value6 * 0.44,
        value6 * 0.44,
        0.018,
        0,
        value7 + count * 0.58 + 0.036,
        0,
        color3,
        {
          segments: 48,
          roughness: 0.32,
          metalness: 0.12,
        },
      );
    }
    const value8 = Math.min(width * 0.17, 0.42);
    const value9 = Math.min(depth * 0.19, 0.44);
    const value10 = height * 1.15;
    gn(
      value3,
      value8,
      value9,
      value10,
      -width * 0.38,
      0,
      Math.PI / 2,
      color,
      color3,
    );
    gn(
      value3,
      value8,
      value9,
      value10,
      width * 0.38,
      0,
      -Math.PI / 2,
      color,
      color3,
    );
    gn(value3, value8, value9, value10, 0, -depth * 0.38, 0, color, color3);
    gn(
      value3,
      value8,
      value9,
      value10,
      0,
      depth * 0.38,
      Math.PI,
      color,
      color3,
    );
  } else if (value.type === "bar") {
    fn8(value3, width, height * 0.12, depth, 0, height * 0.94, 0, color, {
      roughness: 0.5,
    });
    fn8(
      value3,
      width * 0.92,
      height * 0.78,
      depth * 0.46,
      0,
      height * 0.45,
      -depth * 0.18,
      furniture,
      {
        roughness: 0.65,
      },
    );
    fn8(
      value3,
      width * 0.86,
      height * 0.48,
      0.035,
      0,
      height * 0.42,
      depth * 0.28,
      color3,
      {
        rounded: false,
        roughness: 0.48,
      },
    );
    for (const value6 of [-0.3, 0, 0.3]) {
      O(
        value3,
        depth * 0.14,
        depth * 0.14,
        0.045,
        width * value6,
        height * 0.66,
        depth * 0.52,
        color,
        {
          segments: 28,
          roughness: 0.52,
        },
      );
      O(
        value3,
        0.025,
        0.025,
        height * 0.62,
        width * value6,
        height * 0.34,
        depth * 0.52,
        color3,
        {
          segments: 18,
          metalness: 0.38,
          roughness: 0.28,
        },
      );
      O(
        value3,
        depth * 0.1,
        depth * 0.12,
        0.035,
        width * value6,
        0.018,
        depth * 0.52,
        color3,
        {
          segments: 24,
          metalness: 0.3,
          roughness: 0.34,
        },
      );
    }
  } else if (value.type === "aquarium") {
    const count = Math.max(height * 0.52, 0.45);
    const value6 = count;
    const count2 = Math.max(height - count, 0.2);
    const value7 = Math.min(
      Math.max(Math.min(width, depth) * 0.025, 0.012),
      0.028,
    );
    const value8 = {
      rounded: false,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.06,
      metalness: 0.02,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 6,
    };
    fn8(value3, width, count, depth, 0, count * 0.5, 0, furniture, {
      rounded: false,
      roughness: 0.56,
    });
    fn8(value3, width, 0.035, depth, 0, count, 0, value4.frame, {
      rounded: false,
      metalness: 0.34,
      roughness: 0.3,
    });
    fn8(
      value3,
      width - value7 * 2,
      count2,
      value7,
      0,
      value6 + count2 * 0.5,
      -depth * 0.5 + value7 * 0.5,
      value4.glass,
      value8,
    );
    fn8(
      value3,
      width - value7 * 2,
      count2,
      value7,
      0,
      value6 + count2 * 0.5,
      depth * 0.5 - value7 * 0.5,
      value4.glass,
      value8,
    );
    fn8(
      value3,
      value7,
      count2,
      depth - value7 * 2,
      -width * 0.5 + value7 * 0.5,
      value6 + count2 * 0.5,
      0,
      value4.glass,
      value8,
    );
    fn8(
      value3,
      value7,
      count2,
      depth - value7 * 2,
      width * 0.5 - value7 * 0.5,
      value6 + count2 * 0.5,
      0,
      value4.glass,
      value8,
    );
  } else if (value.type === "coffeetable") {
    const value6 = Math.min(width * 0.34, depth * 0.42);
    const value7 = Math.min(width * 0.23, depth * 0.29);
    const value8 = -width * 0.16;
    const value9 = depth * 0.08;
    const value10 = width * 0.24;
    const value11 = -depth * 0.2;
    const value12 = height * 0.58;
    const value13 = height * 0.76;
    const value14 = height * 0.68;
    const value15 = height * 0.9;
    O(
      value3,
      value6 * 0.3,
      value6 * 0.5,
      value12,
      value8,
      value12 * 0.5,
      value9,
      furniture,
      {
        segments: 40,
        roughness: 0.82,
      },
    );
    const value16 = height * 0.07;
    const value17 = height * 0.055;
    const value18 = value12 + value16 * 0.5 + 0.001;
    const value19 = value18 + (value16 + value17) * 0.5 + 0.001;
    O(
      value3,
      value6 * 1.02,
      value6 * 1.02,
      value16,
      value8,
      value18,
      value9,
      color3,
      {
        segments: 48,
        roughness: 0.72,
      },
    );
    O(value3, value6, value6, value17, value8, value19, value9, color2, {
      segments: 48,
      roughness: 0.9,
    });
    O(
      value3,
      value7 * 0.32,
      value7 * 0.52,
      value13,
      value10,
      value13 * 0.5,
      value11,
      color,
      {
        segments: 40,
        roughness: 0.82,
      },
    );
    const value20 = height * 0.07;
    const value21 = height * 0.055;
    const value22 = value13 + value20 * 0.5 + 0.001;
    const value23 = value22 + (value20 + value21) * 0.5 + 0.001;
    O(
      value3,
      value7 * 1.02,
      value7 * 1.02,
      value20,
      value10,
      value22,
      value11,
      color3,
      {
        segments: 48,
        roughness: 0.72,
      },
    );
    O(value3, value7, value7, value21, value10, value23, value11, color2, {
      segments: 48,
      roughness: 0.9,
    });
  } else if (value.type === "squarecoffeetable") {
    const count = Math.max(height * 0.22, 0.085);
    const count2 = Math.max(height * 0.16, 0.065);
    const value6 = count + 0.012;
    const count3 = Math.max(height - value6 - count2, 0.16);
    const count4 = Math.max(width * 0.075, 0.045);
    const count5 = Math.max(depth * 0.035, 0.018);
    const value7 = count3 * 0.72;
    const value8 = value6 + count3 * 0.48;
    const value9 = width * 0.27;
    const value10 = width * 0.34;
    const value11 = furniture;
    const value12 = color;
    fn8(
      value3,
      width * 0.98,
      count2,
      depth * 1.03,
      0,
      value6 + count3 + count2 * 0.5,
      0,
      value12,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.5,
        metalness: 0.02,
      },
    );
    fn8(
      value3,
      count4,
      count3,
      depth * 0.92,
      -width * 0.5 + count4 * 0.5,
      value6 + count3 * 0.5,
      0,
      value11,
      {
        rounded: false,
        roughness: 0.6,
      },
    );
    fn8(
      value3,
      count4,
      count3,
      depth * 0.92,
      width * 0.5 - count4 * 0.5,
      value6 + count3 * 0.5,
      0,
      value11,
      {
        rounded: false,
        roughness: 0.6,
      },
    );
    fn8(
      value3,
      width * 0.86,
      count3 * 0.9,
      0.035,
      0,
      value6 + count3 * 0.52,
      -depth * 0.45,
      value11,
      {
        rounded: false,
        roughness: 0.75,
      },
    );
    fn8(
      value3,
      width * 0.86,
      count3 * 0.1,
      depth * 0.9,
      0,
      value6 + count3 * 0.08,
      0,
      value11,
      {
        rounded: false,
        roughness: 0.58,
      },
    );
    for (const value13 of [-value10, 0, value10]) {
      fn8(
        value3,
        value9,
        value7,
        count5,
        value13,
        value8,
        depth * 0.48,
        value12,
        {
          radius: Math.min(width, depth) * 0.025,
          roughness: 0.52,
        },
      );
      const value14 =
        value13 === 0
          ? 0
          : value13 + (value13 < 0 ? value9 * 0.3 : -value9 * 0.3);
      fn8(
        value3,
        0.022,
        value7 * 0.2,
        0.025,
        value14,
        value8,
        depth * 0.505,
        color3,
        {
          radius: 0.009,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
    }
    const count6 = Math.max(Math.min(width, depth) * 0.055, 0.035);
    for (const value13 of [-width * 0.4, width * 0.4]) {
      for (const value14 of [-depth * 0.36, depth * 0.36]) {
        const value15 = fn8(
          value3,
          count6,
          count,
          count6,
          value13,
          count * 0.5,
          value14,
          color3,
          {
            radius: count6 * 0.22,
            roughness: 0.55,
            metalness: 0.02,
          },
        );
        value15.rotation.z = (value13 < 0 ? -1 : 1) * 0.09;
        value15.rotation.x = (value14 < 0 ? -1 : 1) * 0.06;
      }
    }
  } else if (value.type === "chair") {
    gn(value3, width, depth, height, 0, 0, 0, furniture, color3);
  } else if (value.type === "sideboard") {
    const count = Math.max(height, 1.8);
    const value6 = count * 0.39;
    const value7 = count * 0.22;
    const value8 = value6 + value7;
    const value9 = count - value8;
    const value10 = color;
    const value11 = width * 0.31;
    const value12 = value6 * 0.88;
    const value13 = value9 * 0.86;
    fn8(value3, width, value6, depth, 0, value6 * 0.5, 0, furniture, {
      roughness: 0.58,
    });
    fn8(value3, width, 0.045, depth, 0, value6, 0, color, {
      roughness: 0.5,
    });
    fn8(
      value3,
      width,
      value7,
      0.045,
      0,
      value6 + value7 * 0.5,
      -depth * 0.46,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    fn8(value3, width, value9, depth, 0, value8 + value9 * 0.5, 0, furniture, {
      roughness: 0.58,
    });
    for (const value14 of [-0.33, 0, 0.33]) {
      fn8(
        value3,
        value11,
        value12,
        0.026,
        width * value14,
        value6 * 0.48,
        depth * 0.515,
        value10,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
      fn8(
        value3,
        value11,
        value13,
        0.026,
        width * value14,
        value8 + value9 * 0.5,
        depth * 0.515,
        value10,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (value.type === "shoecabinet") {
    const count = Math.max(height, 1.9);
    const value6 = color;
    const value7 = color;
    const value8 = width * 0.5;
    const value9 = width * 0.5;
    const value10 = -width * 0.25;
    const value11 = width * 0.25;
    const value12 = count * 0.22;
    const value13 = count * 0.43;
    const value14 = count * 0.21;
    const value15 = count * 0.37;
    fn8(
      value3,
      width * 0.98,
      count * 0.93,
      0.045,
      0,
      count * 0.48,
      -depth * 0.47,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    fn8(
      value3,
      value8,
      value12 * 0.56,
      depth * 0.92,
      value10,
      value12 * 0.35,
      0,
      furniture,
      {
        roughness: 0.56,
      },
    );
    fn8(
      value3,
      value8 * 1.02,
      0.055,
      depth * 1.04,
      value10,
      value12 * 0.67,
      0,
      value7,
      {
        roughness: 0.5,
      },
    );
    fn8(value3, value9, value13, depth, value11, value13 * 0.5, 0, furniture, {
      roughness: 0.58,
    });
    for (const value18 of [-0.245, 0.245]) {
      fn8(
        value3,
        value9 * 0.47,
        value13 * 0.84,
        0.026,
        value11 + value9 * value18,
        value13 * 0.48,
        depth * 0.515,
        value6,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
    const value16 = count - value14 - 0.045;
    fn8(
      value3,
      value8,
      value14,
      depth,
      value10,
      value16 + value14 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const value18 of [-0.245, 0.245]) {
      fn8(
        value3,
        value8 * 0.47,
        value14 * 0.86,
        0.026,
        value10 + value8 * value18,
        value16 + value14 * 0.5,
        depth * 0.515,
        value6,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
    const value17 = count - value15 - 0.045;
    fn8(
      value3,
      value9,
      value15,
      depth,
      value11,
      value17 + value15 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const value18 of [-0.245, 0.245]) {
      fn8(
        value3,
        value9 * 0.47,
        value15 * 0.9,
        0.026,
        value11 + value9 * value18,
        value17 + value15 * 0.5,
        depth * 0.515,
        value6,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (value.type === "cabinet") {
    fn8(value3, width, height, depth, 0, height / 2, 0, furniture);
    fn8(
      value3,
      0.018,
      height * 0.9,
      depth * 1.01,
      0,
      height * 0.52,
      depth * 0.01,
      color3,
    );
    fn8(
      value3,
      0.025,
      0.16,
      0.035,
      -0.08,
      height * 0.55,
      depth * 0.515,
      color2,
      {
        metalness: 0.55,
      },
    );
    fn8(
      value3,
      0.025,
      0.16,
      0.035,
      0.08,
      height * 0.55,
      depth * 0.515,
      color2,
      {
        metalness: 0.55,
      },
    );
  } else if (value.type === "glasscabinet") {
    const value6 = Math.min(
      Math.max(Math.min(width, depth) * 0.1, 0.032),
      0.058,
    );
    const value7 = Math.min(Math.max(depth * 0.075, 0.018), 0.032);
    const value8 = Math.min(Math.max(width * 0.014, 0.016), 0.03);
    const count = Math.max(width - value6 * 2, width * 0.7);
    const value9 = 0.13;
    const value10 = 0.3;
    const value11 = 4;
    const value12 = height * value9;
    const value13 = height * value10;
    const value14 = height - value6 - value13;
    const value15 = value14 / value11;
    const value16 = [0.56, 0.24, 0.2];
    const value17 = [0, value16[0], value16[0] + value16[1]];
    const value18 = value17.slice(1);
    const count2 = Math.max(width * 0.005, 0.005);
    const value19 = depth * 0.5 + 0.012;
    const value20 = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015,
    };
    const value21 = {
      rounded: false,
      roughness: 0.48,
      metalness: 0.035,
    };
    const value22 = {
      rounded: false,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.08,
      metalness: 0.08,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 7,
    };
    const value23 = {
      rounded: false,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      roughness: 0.12,
      metalness: 0,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 8,
    };
    fn8(
      value3,
      value6,
      height,
      depth,
      -width * 0.5 + value6 * 0.5,
      height * 0.5,
      0,
      furniture,
      value20,
    );
    fn8(
      value3,
      value6,
      height,
      depth,
      width * 0.5 - value6 * 0.5,
      height * 0.5,
      0,
      furniture,
      value20,
    );
    fn8(
      value3,
      count,
      height - value6 * 2,
      value7,
      0,
      height * 0.5,
      -depth * 0.5 + value7 * 0.5,
      9073497,
      {
        ...value20,
        roughness: 0.76,
      },
    );
    fn8(
      value3,
      width,
      value6,
      depth,
      0,
      height - value6 * 0.5,
      0,
      furniture,
      value20,
    );
    for (let value28 = 0; value28 < value11; value28 += 1) {
      fn8(
        value3,
        count,
        value6 * 0.72,
        depth * 0.9,
        0,
        value13 + value15 * value28,
        -depth * 0.025,
        color,
        value20,
      );
    }
    fn8(
      value3,
      count,
      value6 * 0.72,
      depth * 0.9,
      0,
      value12,
      -depth * 0.025,
      color,
      value20,
    );
    for (const value28 of value18) {
      const value29 = -count * 0.5 + count * value28;
      fn8(
        value3,
        value6 * 0.72,
        height - value6,
        depth * 0.9,
        value29,
        (height - value6) * 0.5,
        -depth * 0.025,
        furniture,
        value20,
      );
    }
    const value24 = value13 - value12 - value6 * 0.9;
    const value25 = [count * value16[0], count * (1 - value16[0])];
    let value26 = -count * 0.5;
    for (let value28 = 0; value28 < value25.length; value28 += 1) {
      const value29 = value25[value28] - count2;
      const value30 = value26 + value25[value28] * 0.5;
      fn8(
        value3,
        value29,
        value24,
        0.03,
        value30,
        value12 + (value13 - value12) * 0.5,
        value19,
        value28 ? color : furniture,
        {
          ...value21,
          roughness: 0.56,
        },
      );
      value26 += value25[value28];
    }
    for (let value28 = 0; value28 < value16.length; value28 += 1) {
      const value29 = -count * 0.5 + count * value17[value28];
      const value30 = count * value16[value28];
      const value31 = value29 + value30 * 0.5;
      const count3 = Math.max(value30 - value8 * 1.65, value30 * 0.76);
      const count4 = Math.max(value14 - value8 * 1.55, value14 * 0.86);
      fn8(
        value3,
        count3,
        count4,
        0.018,
        value31,
        value13 + value14 * 0.5,
        value19,
        value4.glass,
        value22,
      );
      fn8(
        value3,
        value8,
        value14,
        0.032,
        value29 + value8 * 0.5,
        value13 + value14 * 0.5,
        value19 + 0.009,
        furniture,
        value21,
      );
      if (value28 === value16.length - 1) {
        fn8(
          value3,
          value8,
          value14,
          0.032,
          value29 + value30 - value8 * 0.5,
          value13 + value14 * 0.5,
          value19 + 0.009,
          furniture,
          value21,
        );
      }
      const count5 = Math.max(count3 * 0.025, 0.007);
      fn8(
        value3,
        count5,
        count4 * 0.88,
        0.006,
        value31 - count3 * 0.37,
        value13 + value14 * 0.52,
        value19 + 0.014,
        14282227,
        value23,
      );
      fn8(
        value3,
        count3 * 0.34,
        Math.max(value8 * 0.11, 0.004),
        0.006,
        value31 - count3 * 0.18,
        value13 + value14 * 0.88,
        value19 + 0.014,
        15267578,
        value23,
      );
    }
    fn8(
      value3,
      count,
      value8,
      0.032,
      0,
      value13 + value8 * 0.5,
      value19 + 0.009,
      furniture,
      value21,
    );
    fn8(
      value3,
      count,
      value8,
      0.032,
      0,
      height - value6 - value8 * 0.5,
      value19 + 0.009,
      furniture,
      value21,
    );
    const value27 = [14736852, 13025203, 10327434, 7301474, color, color2];
    const fn9 = (value28, value29, value30 = 5, value31 = 0) => {
      const value32 = count * value16[value28];
      const value33 = -count * 0.5 + count * value17[value28];
      const value34 = value13 + value15 * value29 + value6 * 0.42;
      const count3 = Math.max(value32 * 0.022, 0.004);
      const value35 = (value32 * 0.72 - count3 * (value30 - 1)) / value30;
      let value36 = value33 + value32 * 0.13;
      for (let value37 = 0; value37 < value30; value37 += 1) {
        const value38 =
          value35 * [0.8, 1.05, 0.9, 0.72, 0.96][(value37 + value31) % 5];
        const value39 =
          value15 * [0.48, 0.58, 0.52, 0.64, 0.55][(value37 * 2 + value31) % 5];
        fn8(
          value3,
          value38,
          value39,
          depth * 0.42,
          value36 + value38 * 0.5,
          value34 + value39 * 0.5,
          depth * 0.12,
          value27[(value37 + value31) % value27.length],
          {
            radius: Math.min(value38 * 0.12, 0.009),
            roughness: 0.78,
            metalness: 0,
          },
        );
        value36 += value38 + count3;
      }
    };
    const fn10 = (value28, value29, value30 = 3, value31 = 0) => {
      const value32 = count * value16[value28];
      const value33 = -count * 0.5 + count * value17[value28] + value32 * 0.5;
      const value34 = value13 + value15 * value29 + value6 * 0.42;
      for (let value35 = 0; value35 < value30; value35 += 1) {
        fn8(
          value3,
          value32 * 0.56,
          value6 * 0.48,
          depth * 0.4,
          value33,
          value34 + value6 * (0.3 + value35 * 0.52),
          depth * 0.12,
          value27[(value35 + value31) % value27.length],
          {
            radius: 0.006,
            roughness: 0.78,
            metalness: 0,
          },
        );
      }
    };
    fn9(0, 1, 7, 0);
    fn9(2, 2, 4, 2);
    fn10(0, 0, 3, 2);
    fn10(1, 2, 3, 4);
    for (const [value28, value29, value30, value31] of [
      [1, 1, 0.16, 12169895],
      [0, 2, 0.075, 9406334],
      [2, 3, 0.14, 13749184],
    ]) {
      const value32 = count * value16[value28];
      const value33 = -count * 0.5 + count * value17[value28] + value32 * 0.5;
      const value34 = value13 + value15 * value29 + value6 * 0.42;
      O(
        value3,
        value32 * value30 * 0.72,
        value32 * value30,
        value15 * 0.46,
        value33,
        value34 + value15 * 0.23,
        depth * 0.12,
        value31,
        {
          segments: 24,
          roughness: 0.68,
        },
      );
    }
  } else if (value.type === "bookcase") {
    const value6 = Math.min(
      Math.max(Math.min(width, depth) * 0.11, 0.032),
      0.062,
    );
    const value7 = Math.min(Math.max(depth * 0.075, 0.018), 0.032);
    const count = Math.max(width - value6 * 2, width * 0.72);
    const value8 = 0.255;
    const value9 = [value8, 0.47, 0.59, 0.79];
    const value10 = height - value6 * 0.5;
    const value11 = count * 0.27;
    const value12 = width * 0.5 - value6 * 1.5 - value11;
    const value13 = count - value11 - value6;
    const value14 = -count * 0.5 + value13 * 0.5;
    const value15 = count * 0.5 - value11 * 0.5;
    const value16 = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015,
    };
    const value17 = depth * 0.5 + 0.013;
    fn8(
      value3,
      value6,
      height,
      depth,
      -width * 0.5 + value6 * 0.5,
      height * 0.5,
      0,
      furniture,
      value16,
    );
    fn8(
      value3,
      value6,
      height,
      depth,
      width * 0.5 - value6 * 0.5,
      height * 0.5,
      0,
      furniture,
      value16,
    );
    fn8(
      value3,
      count,
      height * 0.95,
      value7,
      0,
      height * 0.5,
      -depth * 0.5 + value7 * 0.5,
      color3,
      {
        ...value16,
        roughness: 0.76,
      },
    );
    fn8(
      value3,
      count,
      height * value8 - value6 * 0.5,
      depth * 0.9,
      0,
      height * value8 * 0.5,
      -depth * 0.025,
      color,
      {
        ...value16,
        roughness: 0.66,
      },
    );
    for (const value30 of value9) {
      fn8(value3, count, value6, depth, 0, height * value30, 0, color, value16);
    }
    fn8(value3, width, value6, depth, 0, value10, 0, furniture, value16);
    const value18 = height * value9[1] + value6 * 0.5;
    const value19 = height - value6;
    fn8(
      value3,
      value6,
      value19 - value18,
      depth,
      value12,
      (value19 + value18) * 0.5,
      0,
      furniture,
      value16,
    );
    const value20 = 3;
    const value21 = value6 * 0.72;
    const value22 = height * value8 - value6 * 0.5;
    const count2 = Math.max(value22 - value21, height * 0.16);
    const count3 = Math.max(width * 0.008, 0.008);
    const value23 = -count * 0.18;
    const value24 = value23 + count * 0.5 - count3 * 0.5;
    const value25 = count - value24 - count3;
    const value26 = (count2 - count3 * (value20 - 1)) / value20;
    for (let value30 = 0; value30 < value20; value30 += 1) {
      const value31 = value21 + value26 * 0.5 + value30 * (value26 + count3);
      fn8(
        value3,
        value24,
        value26,
        0.026,
        -count * 0.5 + value24 * 0.5,
        value31,
        value17,
        furniture,
        {
          ...value16,
          roughness: 0.55,
        },
      );
      fn8(
        value3,
        value25,
        value26,
        0.026,
        value23 + count3 * 0.5 + value25 * 0.5,
        value31,
        value17,
        color,
        {
          ...value16,
          roughness: 0.55,
        },
      );
    }
    const value27 = height * (value9[2] - value9[1]) - value6 * 1.15;
    fn8(
      value3,
      value13 * 0.97,
      value27,
      0.028,
      value14,
      height * (value9[1] + value9[2]) * 0.5,
      value17,
      furniture,
      {
        ...value16,
        roughness: 0.54,
      },
    );
    const value28 = [14276045, 12499117, 10459536, 7828334, color2, color];
    const fn9 = ({
      startX: value30,
      maxWidth: value31,
      shelfY: value32,
      availableHeight: value33,
      count: value34 = 6,
      seed: value35 = 0,
    }) => {
      const count4 = Math.max(value31 * 0.018, 0.006);
      const count5 = Math.max(
        (value31 - count4 * (value34 + 1)) / value34,
        0.026,
      );
      let value36 = value30 + count4;
      for (let value37 = 0; value37 < value34; value37 += 1) {
        const value38 = [0.72, 0.9, 0.78, 1.04, 0.82, 0.68][
          (value37 + value35) % 6
        ];
        const value39 = count5 * value38;
        const value40 = [0.72, 0.88, 0.78, 0.94, 0.82, 0.68][
          (value37 * 2 + value35) % 6
        ];
        const value41 = value33 * value40;
        if (value36 + value39 > value30 + value31 - count4) {
          break;
        }
        const value42 = fn8(
          value3,
          value39,
          value41,
          depth * (0.47 + ((value37 + value35) % 3) * 0.045),
          value36 + value39 * 0.5,
          value32 + value41 * 0.5,
          depth * 0.15,
          value28[(value37 + value35) % value28.length],
          {
            radius: Math.min(value39 * 0.14, 0.012),
            roughness: 0.78,
            metalness: 0,
          },
        );
        if (value37 === value34 - 1 && value35 % 2 === 1) {
          value42.rotation.z = -0.07;
        }
        value36 += value39 + count4;
      }
    };
    const fn10 = (value30, value31, value32, value33 = 3, value34 = 0) => {
      for (let value35 = 0; value35 < value33; value35 += 1) {
        fn8(
          value3,
          value32,
          value6 * 0.54,
          depth * 0.48,
          value30,
          value31 + value6 * (0.38 + value35 * 0.56),
          depth * 0.15,
          value28[(value35 + value34) % value28.length],
          {
            radius: 0.007,
            roughness: 0.78,
            metalness: 0,
          },
        );
      }
    };
    const shelfY = height * value9[0] + value6 * 0.5;
    fn9({
      startX: -count * 0.47,
      maxWidth: count * 0.29,
      shelfY: shelfY,
      availableHeight: height * 0.15,
      count: 5,
      seed: 2,
    });
    fn9({
      startX: count * 0.04,
      maxWidth: count * 0.38,
      shelfY: shelfY,
      availableHeight: height * 0.16,
      count: 7,
      seed: 4,
    });
    const shelfY2 = height * value9[1] + value6 * 0.5;
    fn9({
      startX: value12 + value6 * 0.6,
      maxWidth: value11 * 0.82,
      shelfY: shelfY2,
      availableHeight: height * 0.075,
      count: 4,
      seed: 1,
    });
    const shelfY3 = height * value9[2] + value6 * 0.5;
    fn9({
      startX: -count * 0.47,
      maxWidth: value13 * 0.42,
      shelfY: shelfY3,
      availableHeight: height * 0.14,
      count: 6,
      seed: 0,
    });
    fn8(
      value3,
      value13 * 0.17,
      height * 0.12,
      0.022,
      value14 + value13 * 0.27,
      shelfY3 + height * 0.065,
      depth * 0.22,
      11972517,
      {
        rounded: false,
        roughness: 0.5,
      },
    );
    fn8(
      value3,
      value13 * 0.125,
      height * 0.085,
      0.026,
      value14 + value13 * 0.27,
      shelfY3 + height * 0.065,
      depth * 0.235,
      7762283,
      {
        rounded: false,
        roughness: 0.42,
      },
    );
    fn10(value15, shelfY3, value11 * 0.48, 3, 3);
    const value29 = height * value9[3] + value6 * 0.5;
    fn10(value14 - value13 * 0.22, value29, value13 * 0.24, 2, 1);
    O(
      value3,
      value13 * 0.055,
      value13 * 0.075,
      height * 0.12,
      value14 - value13 * 0.08,
      value29 + height * 0.06,
      depth * 0.12,
      5196615,
      {
        segments: 22,
        roughness: 0.66,
      },
    );
    O(
      value3,
      value13 * 0.045,
      value13 * 0.064,
      height * 0.15,
      value14 + value13 * 0.08,
      value29 + height * 0.075,
      depth * 0.12,
      6643802,
      {
        segments: 22,
        roughness: 0.66,
      },
    );
    fn10(value15, value29, value11 * 0.5, 2, 4);
  } else if (value.type === "shelf") {
    const value6 = Math.min(
      Math.max(Math.min(width, depth) * 0.07, 0.028),
      0.052,
    );
    const value7 = Math.min(Math.max(height * 0.022, 0.028), 0.052);
    const count = Math.max(depth - value6 * 1.4, depth * 0.78);
    const value8 = {
      rounded: false,
      metalness: 0.62,
      roughness: 0.28,
    };
    const value9 = {
      rounded: false,
      metalness: 0.18,
      roughness: 0.48,
    };
    for (const value12 of [
      -width * 0.5 + value6 * 0.5,
      width * 0.5 - value6 * 0.5,
    ]) {
      for (const value13 of [
        -depth * 0.5 + value6 * 0.5,
        depth * 0.5 - value6 * 0.5,
      ]) {
        fn8(
          value3,
          value6,
          height,
          value6,
          value12,
          height * 0.5,
          value13,
          furniture,
          value8,
        );
      }
    }
    for (const value12 of [0.04, 0.26, 0.49, 0.72, 0.96]) {
      fn8(
        value3,
        width,
        value7,
        count,
        0,
        height * value12,
        0,
        value12 === 0.96 ? color2 : color,
        value9,
      );
      fn8(
        value3,
        width,
        value6 * 0.65,
        value6,
        0,
        height * value12,
        -depth * 0.5 + value6 * 0.5,
        furniture,
        value8,
      );
    }
    const count2 = Math.max(width - value6 * 2, value6);
    const value10 = height * 0.84;
    const value11 = Math.hypot(count2, value10);
    for (const value12 of [-1, 1]) {
      const value13 = fn8(
        value3,
        value6 * 0.48,
        value11,
        value6 * 0.42,
        0,
        height * 0.5,
        -depth * 0.5 + value6 * 0.18,
        furniture,
        {
          ...value8,
          castShadow: false,
        },
      );
      value13.rotation.z = value12 * Math.atan2(count2, value10);
    }
  } else if (value.type === "pillar") {
    const value6 = Math.min(value4.wallOpacity * 1.75, 0.55);
    const value7 = Xd(value4.wall, value6, {
      depthWrite: false,
      depthFunc: THREE.LessDepth,
    });
    const value8 = _d(value4.wall, value6, {
      topColor: value4.wallTop ?? value4.wall,
    });
    const value9 = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [
      value7,
      value7,
      value8,
      value7,
      value7,
      value7,
    ]);
    value9.position.y = height * 0.5;
    value9.castShadow = true;
    value9.receiveShadow = true;
    value9.renderOrder = 4;
    value9.layers.set(kt);
    value3.add(value9);
  } else if (value.type === "wallcabinet") {
    const value6 = height * 0.28;
    const value7 = height - value6;
    const value8 = 1.4 + value6;
    fn8(value3, width, value7, depth, 0, value8 + value7 * 0.5, 0, furniture);
    fn8(
      value3,
      width,
      value6,
      0.045,
      0,
      1.4 + value6 * 0.5,
      -depth * 0.45,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    fn8(value3, width * 1.02, 0.045, depth * 1.05, 0, 1.4, 0, color, {
      roughness: 0.5,
    });
    fn8(value3, width * 1.02, 0.045, depth * 1.05, 0, value8, 0, color, {
      roughness: 0.5,
    });
    fn8(
      value3,
      0.045,
      value6,
      depth,
      -width * 0.49,
      1.4 + value6 * 0.5,
      0,
      furniture,
    );
    fn8(
      value3,
      0.045,
      value6,
      depth,
      width * 0.49,
      1.4 + value6 * 0.5,
      0,
      furniture,
    );
    const value9 = width * 0.31;
    for (const value10 of [-0.33, 0, 0.33]) {
      fn8(
        value3,
        value9,
        value7 * 0.9,
        0.026,
        width * value10,
        value8 + value7 * 0.5,
        depth * 0.515,
        color,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (
    ["kitchenbase", "kitchensink", "kitchencooktop"].includes(value.type)
  ) {
    const value6 = height * 0.1;
    const value7 = height * 0.07;
    const value8 = height - value6 - value7;
    const value9 = value6 + value8 * 0.5;
    fn8(
      value3,
      width * 0.96,
      value6,
      depth * 0.8,
      0,
      value6 * 0.5,
      -depth * 0.06,
      color3,
      {
        rounded: false,
        roughness: 0.52,
      },
    );
    fn8(value3, width, value8, depth, 0, value9, 0, furniture, {
      rounded: false,
      roughness: 0.58,
    });
    fn8(
      value3,
      width * 1.02,
      value7,
      depth * 1.04,
      0,
      height - value7 * 0.5,
      0,
      color2,
      {
        rounded: false,
        roughness: 0.42,
      },
    );
    const count = Math.max(2, Math.min(6, Math.round(width / 0.6)));
    const value10 = width / count;
    for (let value11 = 0; value11 < count; value11 += 1) {
      const value12 = -width * 0.5 + value10 * (value11 + 0.5);
      fn8(
        value3,
        value10 * 0.92,
        value8 * 0.9,
        0.025,
        value12,
        value9,
        depth * 0.515,
        color,
        {
          rounded: false,
          roughness: 0.46,
        },
      );
      fn8(
        value3,
        value10 * 0.28,
        0.022,
        0.03,
        value12,
        value6 + value8 * 0.83,
        depth * 0.535,
        color3,
        {
          rounded: false,
          metalness: 0.28,
          roughness: 0.3,
        },
      );
    }
    if (value.type === "kitchensink") {
      fn8(
        value3,
        width * 0.42,
        0.025,
        depth * 0.52,
        0,
        height + 0.008,
        0,
        color3,
        {
          rounded: false,
          metalness: 0.42,
          roughness: 0.28,
        },
      );
      fn8(
        value3,
        width * 0.34,
        0.02,
        depth * 0.4,
        0,
        height + 0.022,
        0,
        color,
        {
          rounded: false,
          metalness: 0.18,
          roughness: 0.34,
        },
      );
      O(
        value3,
        0.018,
        0.018,
        height * 0.22,
        width * 0.22,
        height + height * 0.11,
        -depth * 0.17,
        color3,
        {
          segments: 20,
          metalness: 0.65,
          roughness: 0.2,
        },
      );
      fn8(
        value3,
        width * 0.16,
        0.035,
        0.035,
        width * 0.14,
        height + height * 0.2,
        -depth * 0.17,
        color3,
        {
          rounded: false,
          metalness: 0.65,
          roughness: 0.2,
        },
      );
    } else if (value.type === "kitchencooktop") {
      fn8(
        value3,
        width * 0.48,
        0.025,
        depth * 0.55,
        0,
        height + 0.008,
        0,
        color3,
        {
          rounded: false,
          metalness: 0.32,
          roughness: 0.25,
        },
      );
      for (const value11 of [-width * 0.13, width * 0.13]) {
        for (const value12 of [-depth * 0.14, depth * 0.14]) {
          O(
            value3,
            width * 0.06,
            width * 0.06,
            0.018,
            value11,
            height + 0.028,
            value12,
            color,
            {
              segments: 28,
              metalness: 0.42,
              roughness: 0.26,
            },
          );
          O(
            value3,
            width * 0.025,
            width * 0.025,
            0.025,
            value11,
            height + 0.045,
            value12,
            color3,
            {
              segments: 24,
              metalness: 0.5,
              roughness: 0.22,
            },
          );
        }
      }
    }
  } else if (value.type === "fridge") {
    fn8(value3, width, height, depth, 0, height / 2, 0, color2, {
      metalness: 0.18,
      roughness: 0.5,
    });
    fn8(
      value3,
      width * 0.88,
      0.018,
      depth * 1.01,
      0,
      height * 0.42,
      depth * 0.01,
      color3,
      {
        metalness: 0.5,
      },
    );
    fn8(
      value3,
      0.025,
      height * 0.27,
      0.035,
      width * 0.35,
      height * 0.65,
      depth * 0.515,
      color3,
      {
        metalness: 0.7,
      },
    );
  } else if (value.type === "storagewaterheater") {
    const value6 = Math.min(depth * 0.43, height * 0.44);
    const value7 = height * 0.52;
    fn8(
      value3,
      width * 0.78,
      height * 0.12,
      depth * 0.22,
      0,
      height * 0.1,
      -depth * 0.36,
      color3,
      {
        rounded: false,
        metalness: 0.55,
        roughness: 0.3,
      },
    );
    O(value3, value6, value6, width * 0.82, 0, value7, 0, color2, {
      segments: 36,
      rotationZ: Math.PI / 2,
      metalness: 0.2,
      roughness: 0.42,
    });
    for (const value8 of [-width * 0.43, width * 0.43]) {
      O(value3, value6 * 1.03, value6 * 1.03, 0.025, value8, value7, 0, color, {
        segments: 36,
        rotationZ: Math.PI / 2,
        metalness: 0.28,
        roughness: 0.34,
      });
    }
    fn8(
      value3,
      width * 0.31,
      height * 0.23,
      0.026,
      0,
      height * 0.51,
      depth * 0.44,
      color3,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.25,
      },
    );
    fn8(
      value3,
      width * 0.16,
      height * 0.045,
      0.018,
      0,
      height * 0.58,
      depth * 0.46,
      7706534,
      {
        rounded: false,
        emissive: 7706534,
        emissiveIntensity: 0.18,
        roughness: 0.2,
      },
    );
    for (const value8 of [-width * 0.28, width * 0.28]) {
      O(
        value3,
        0.022,
        0.022,
        height * 0.16,
        value8,
        height * 0.08,
        depth * 0.12,
        value8 < 0 ? 4885698 : 12868184,
        {
          segments: 18,
          metalness: 0.55,
          roughness: 0.24,
        },
      );
      O(value3, 0.04, 0.04, 0.028, value8, 0.015, depth * 0.12, color3, {
        segments: 20,
        metalness: 0.45,
        roughness: 0.28,
      });
    }
  } else if (value.type === "gaswaterheater") {
    const value6 = height * 0.82;
    fn8(value3, width, value6, depth, 0, height * 0.47, 0, color2, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.46,
    });
    fn8(
      value3,
      width * 0.86,
      value6 * 0.42,
      0.026,
      0,
      height * 0.55,
      depth * 0.515,
      color,
      {
        rounded: false,
        roughness: 0.36,
      },
    );
    fn8(
      value3,
      width * 0.44,
      value6 * 0.18,
      0.018,
      0,
      height * 0.67,
      depth * 0.54,
      color3,
      {
        rounded: false,
        metalness: 0.14,
        roughness: 0.22,
      },
    );
    for (let value7 = 0; value7 < 5; value7 += 1) {
      fn8(
        value3,
        width * 0.62,
        0.012,
        0.02,
        0,
        height * (0.24 + value7 * 0.07),
        depth * 0.525,
        color3,
        {
          rounded: false,
          roughness: 0.3,
        },
      );
    }
    O(
      value3,
      depth * 0.17,
      depth * 0.17,
      height * 0.18,
      0,
      height * 0.91,
      0,
      color3,
      {
        segments: 24,
        metalness: 0.58,
        roughness: 0.24,
      },
    );
    O(value3, depth * 0.22, depth * 0.22, 0.035, 0, height * 0.84, 0, color, {
      segments: 24,
      metalness: 0.5,
      roughness: 0.25,
    });
    for (const [value7, value8] of [
      [-width * 0.28, 4885698],
      [0, 9410205],
      [width * 0.28, 12868184],
    ]) {
      O(
        value3,
        0.018,
        0.018,
        height * 0.18,
        value7,
        height * 0.09,
        depth * 0.12,
        value8,
        {
          segments: 18,
          metalness: 0.62,
          roughness: 0.22,
        },
      );
      O(value3, 0.034, 0.034, 0.025, value7, 0.014, depth * 0.12, color3, {
        segments: 18,
        metalness: 0.5,
        roughness: 0.25,
      });
    }
  } else if (value.type === "pipelinewaterpurifier") {
    const value6 = height * 0.9;
    fn8(value3, width, value6, depth, 0, value6 * 0.5, 0, color2, {
      rounded: false,
      metalness: 0.04,
      roughness: 0.4,
    });
    fn8(
      value3,
      width * 0.92,
      value6 * 0.27,
      0.028,
      0,
      height * 0.76,
      depth * 0.515,
      color3,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.18,
      },
    );
    fn8(
      value3,
      width * 0.34,
      value6 * 0.045,
      0.014,
      -width * 0.08,
      height * 0.79,
      depth * 0.54,
      10470608,
      {
        rounded: false,
        emissive: 10470608,
        emissiveIntensity: 0.2,
        roughness: 0.22,
      },
    );
    for (const value7 of [-0.26, 0, 0.26]) {
      O(
        value3,
        Math.min(width, depth) * 0.055,
        Math.min(width, depth) * 0.055,
        0.018,
        width * value7,
        height * 0.66,
        depth * 0.535,
        color,
        {
          segments: 24,
          rotationX: Math.PI / 2,
          metalness: 0.22,
          roughness: 0.28,
        },
      );
    }
    for (const value7 of [-width * 0.2, width * 0.2]) {
      O(
        value3,
        0.014,
        0.014,
        height * 0.12,
        value7,
        height * 0.49,
        depth * 0.48,
        color3,
        {
          segments: 18,
          metalness: 0.46,
          roughness: 0.22,
        },
      );
      O(
        value3,
        0.024,
        0.018,
        0.035,
        value7,
        height * 0.425,
        depth * 0.52,
        color3,
        {
          segments: 18,
          rotationX: Math.PI / 2,
          metalness: 0.46,
          roughness: 0.22,
        },
      );
    }
    fn8(
      value3,
      width * 0.68,
      height * 0.045,
      depth * 0.52,
      0,
      height * 0.11,
      depth * 0.16,
      color3,
      {
        rounded: false,
        metalness: 0.2,
        roughness: 0.3,
      },
    );
    fn8(
      value3,
      width * 0.42,
      0.028,
      depth * 0.28,
      0,
      height * 0.16,
      depth * 0.28,
      color,
      {
        rounded: false,
        roughness: 0.34,
      },
    );
  } else if (value.type === "tea_bar_machine") {
    const value6 = height * 0.67;
    const value7 = value6 + height * 0.045;
    const value8 = height - value7;
    fn8(value3, width, value6, depth, 0, value6 * 0.5, 0, color2, {
      rounded: false,
      roughness: 0.5,
      metalness: 0.04,
    });
    fn8(
      value3,
      width * 0.94,
      0.028,
      depth * 1.02,
      0,
      value6 * 0.5,
      depth * 0.515,
      color3,
      {
        rounded: false,
        roughness: 0.34,
      },
    );
    fn8(value3, width * 0.94, 0.032, depth * 1.02, 0, value6, 0, color, {
      rounded: false,
      roughness: 0.42,
    });
    fn8(
      value3,
      width * 0.94,
      height * 0.04,
      depth * 1.04,
      0,
      value7,
      0,
      color2,
      {
        rounded: false,
        roughness: 0.36,
        metalness: 0.1,
      },
    );
    fn8(
      value3,
      width * 0.92,
      value8,
      0.032,
      0,
      value7 + value8 * 0.5,
      -depth * 0.46,
      color,
      {
        rounded: false,
        roughness: 0.56,
      },
    );
    for (const value9 of [-width * 0.46, width * 0.46]) {
      fn8(
        value3,
        width * 0.075,
        value8,
        depth * 0.78,
        value9,
        value7 + value8 * 0.5,
        0,
        color2,
        {
          rounded: false,
          roughness: 0.48,
        },
      );
    }
    fn8(
      value3,
      width * 0.86,
      height * 0.14,
      depth * 0.18,
      0,
      height * 0.9,
      depth * 0.48,
      color3,
      {
        rounded: false,
        metalness: 0.32,
        roughness: 0.22,
      },
    );
    for (const value9 of [-width * 0.22, width * 0.22]) {
      O(
        value3,
        Math.min(width, depth) * 0.035,
        Math.min(width, depth) * 0.035,
        0.018,
        value9,
        height * 0.9,
        depth * 0.585,
        color,
        {
          segments: 20,
          rotationX: Math.PI / 2,
          metalness: 0.2,
          roughness: 0.25,
        },
      );
      O(
        value3,
        0.012,
        0.012,
        height * 0.11,
        value9,
        height * 0.79,
        depth * 0.5,
        color3,
        {
          segments: 18,
          metalness: 0.48,
          roughness: 0.22,
        },
      );
      const value10 = Math.min(width, depth) * 0.16;
      O(
        value3,
        value10 * 0.9,
        value10,
        height * 0.13,
        value9,
        height * 0.75,
        depth * 0.12,
        value9 < 0 ? 8752009 : color,
        {
          segments: 28,
          metalness: 0.08,
          roughness: 0.34,
        },
      );
      O(
        value3,
        value10 * 0.84,
        value10 * 0.84,
        0.016,
        value9,
        height * 0.82,
        depth * 0.12,
        color3,
        {
          segments: 28,
          metalness: 0.18,
          roughness: 0.28,
        },
      );
      fn8(
        value3,
        width * 0.12,
        height * 0.06,
        0.016,
        value9,
        height * 0.77,
        depth * 0.3,
        color3,
        {
          radius: 0.012,
          metalness: 0.24,
          roughness: 0.24,
        },
      );
    }
    fn8(
      value3,
      width * 0.92,
      height * 0.055,
      depth * 0.82,
      0,
      0.028,
      0,
      color3,
      {
        rounded: false,
        roughness: 0.36,
      },
    );
  } else if (value.type === "washer" || value.type === "dryer") {
    const value6 = value.type === "dryer";
    const value7 = width * (value6 ? 0.32 : 0.29);
    fn8(value3, width, height, depth, 0, height * 0.5, 0, color2, {
      rounded: false,
      metalness: 0.1,
      roughness: 0.48,
    });
    fn8(
      value3,
      width * 0.92,
      height * 0.18,
      0.035,
      0,
      height * 0.86,
      depth * 0.505,
      color,
      {
        rounded: false,
        roughness: 0.4,
      },
    );
    O(value3, value7, value7, 0.045, 0, height * 0.47, depth * 0.515, color3, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.32,
      roughness: 0.28,
    });
    O(
      value3,
      value7 * 0.74,
      value7 * 0.74,
      0.03,
      0,
      height * 0.47,
      depth * 0.545,
      value6 ? 2502715 : 3622485,
      {
        segments: 40,
        rotationX: Math.PI / 2,
        metalness: 0.08,
        roughness: 0.22,
      },
    );
    O(
      value3,
      width * 0.055,
      width * 0.055,
      0.035,
      width * 0.27,
      height * 0.86,
      depth * 0.535,
      color3,
      {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.4,
        roughness: 0.25,
      },
    );
    fn8(
      value3,
      width * 0.25,
      height * 0.035,
      0.026,
      -width * 0.23,
      height * 0.86,
      depth * 0.535,
      color3,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    if (!value6) {
      fn8(
        value3,
        width * 0.2,
        height * 0.055,
        0.025,
        -width * 0.3,
        height * 0.12,
        depth * 0.525,
        color,
        {
          rounded: false,
          roughness: 0.42,
        },
      );
    }
  } else if (value.type === "dishwasher") {
    fn8(value3, width, height, depth, 0, height * 0.5, 0, color2, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.48,
    });
    fn8(
      value3,
      width * 0.93,
      height * 0.74,
      0.028,
      0,
      height * 0.46,
      depth * 0.515,
      color,
      {
        rounded: false,
        metalness: 0.08,
        roughness: 0.44,
      },
    );
    fn8(
      value3,
      width * 0.93,
      height * 0.14,
      0.032,
      0,
      height * 0.87,
      depth * 0.52,
      color3,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.3,
      },
    );
    fn8(
      value3,
      width * 0.58,
      height * 0.026,
      0.034,
      0,
      height * 0.78,
      depth * 0.54,
      color3,
      {
        rounded: false,
        metalness: 0.5,
        roughness: 0.22,
      },
    );
    fn8(
      value3,
      width * 0.9,
      height * 0.075,
      depth * 0.78,
      0,
      height * 0.038,
      -depth * 0.04,
      color3,
      {
        rounded: false,
        roughness: 0.4,
      },
    );
    for (const value6 of [0.22, 0.31, 0.4]) {
      O(
        value3,
        width * 0.018,
        width * 0.018,
        0.012,
        width * value6,
        height * 0.88,
        depth * 0.545,
        color,
        {
          segments: 18,
          rotationX: Math.PI / 2,
          metalness: 0.26,
          roughness: 0.24,
        },
      );
    }
  } else if (value.type === "steamoven") {
    fn8(value3, width, height, depth, 0, height * 0.5, 0, color2, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.42,
    });
    fn8(
      value3,
      width * 0.94,
      height * 0.9,
      0.026,
      0,
      height * 0.5,
      depth * 0.515,
      color3,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.25,
      },
    );
    fn8(
      value3,
      width * 0.78,
      height * 0.56,
      0.018,
      -width * 0.03,
      height * 0.42,
      depth * 0.54,
      1515819,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.18,
      },
    );
    fn8(
      value3,
      width * 0.72,
      height * 0.035,
      0.038,
      -width * 0.03,
      height * 0.74,
      depth * 0.56,
      color,
      {
        rounded: false,
        metalness: 0.52,
        roughness: 0.22,
      },
    );
    fn8(
      value3,
      width * 0.24,
      height * 0.075,
      0.022,
      0,
      height * 0.86,
      depth * 0.545,
      7706534,
      {
        rounded: false,
        emissive: 7706534,
        emissiveIntensity: 0.18,
        roughness: 0.2,
      },
    );
    for (const value6 of [-0.36, 0.36]) {
      O(
        value3,
        width * 0.045,
        width * 0.045,
        0.026,
        width * value6,
        height * 0.86,
        depth * 0.55,
        color,
        {
          segments: 24,
          rotationX: Math.PI / 2,
          metalness: 0.4,
          roughness: 0.24,
        },
      );
    }
  } else if (value.type === "microwave") {
    fn8(value3, width, height, depth, 0, height * 0.5, 0, color2, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.44,
    });
    fn8(
      value3,
      width * 0.93,
      height * 0.82,
      0.025,
      0,
      height * 0.49,
      depth * 0.515,
      color3,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.24,
      },
    );
    fn8(
      value3,
      width * 0.62,
      height * 0.63,
      0.018,
      -width * 0.13,
      height * 0.48,
      depth * 0.54,
      1515819,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.18,
      },
    );
    fn8(
      value3,
      width * 0.035,
      height * 0.54,
      0.03,
      width * 0.19,
      height * 0.48,
      depth * 0.55,
      color,
      {
        rounded: false,
        metalness: 0.46,
        roughness: 0.22,
      },
    );
    fn8(
      value3,
      width * 0.17,
      height * 0.1,
      0.02,
      width * 0.36,
      height * 0.72,
      depth * 0.54,
      7706534,
      {
        rounded: false,
        emissive: 7706534,
        emissiveIntensity: 0.16,
        roughness: 0.2,
      },
    );
    for (const value6 of [0.48, 0.34, 0.2]) {
      fn8(
        value3,
        width * 0.13,
        height * 0.055,
        0.018,
        width * 0.36,
        height * value6,
        depth * 0.545,
        color,
        {
          rounded: false,
          roughness: 0.3,
        },
      );
    }
  } else if (value.type === "ricecooker") {
    const value6 = Math.min(width, depth) * 0.47;
    O(
      value3,
      value6 * 0.9,
      value6,
      height * 0.68,
      0,
      height * 0.38,
      0,
      color2,
      {
        segments: 36,
        roughness: 0.46,
      },
    );
    O(
      value3,
      value6 * 0.94,
      value6 * 0.94,
      height * 0.12,
      0,
      height * 0.77,
      0,
      color,
      {
        segments: 36,
        roughness: 0.38,
      },
    );
    O(
      value3,
      value6 * 0.72,
      value6 * 0.74,
      height * 0.035,
      0,
      height * 0.85,
      0,
      color3,
      {
        segments: 32,
        metalness: 0.12,
        roughness: 0.28,
      },
    );
    fn8(
      value3,
      width * 0.5,
      height * 0.16,
      0.026,
      0,
      height * 0.42,
      depth * 0.47,
      color3,
      {
        radius: Math.min(width, depth) * 0.04,
        roughness: 0.28,
      },
    );
    fn8(
      value3,
      width * 0.24,
      height * 0.06,
      0.018,
      0,
      height * 0.43,
      depth * 0.49,
      7706534,
      {
        rounded: false,
        emissive: 7706534,
        emissiveIntensity: 0.16,
        roughness: 0.2,
      },
    );
    fn8(
      value3,
      width * 0.05,
      height * 0.16,
      depth * 0.1,
      -width * 0.27,
      height * 0.86,
      0,
      color3,
      {
        roughness: 0.3,
      },
    );
    fn8(
      value3,
      width * 0.05,
      height * 0.16,
      depth * 0.1,
      width * 0.27,
      height * 0.86,
      0,
      color3,
      {
        roughness: 0.3,
      },
    );
    fn8(
      value3,
      width * 0.58,
      height * 0.055,
      depth * 0.1,
      0,
      height * 0.94,
      0,
      color3,
      {
        roughness: 0.3,
      },
    );
  } else if (value.type === "rangehood") {
    fn8(
      value3,
      width * 0.34,
      height * 0.72,
      depth * 0.42,
      0,
      height * 0.6,
      -depth * 0.18,
      furniture,
      {
        rounded: false,
        metalness: 0.22,
        roughness: 0.42,
      },
    );
    fn8(value3, width, height * 0.22, depth, 0, height * 0.18, 0, color2, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.4,
    });
    fn8(
      value3,
      width * 0.9,
      height * 0.07,
      depth * 0.8,
      0,
      height * 0.055,
      depth * 0.02,
      color3,
      {
        rounded: false,
        metalness: 0.35,
        roughness: 0.28,
      },
    );
    fn8(
      value3,
      width * 0.22,
      height * 0.035,
      0.025,
      width * 0.3,
      height * 0.2,
      depth * 0.515,
      color,
      {
        rounded: false,
        emissive: color,
        emissiveIntensity: 0.12,
        roughness: 0.3,
      },
    );
  } else if (value.type === "wallac") {
    fn8(value3, width, height, depth, 0, height * 0.5, 0, color2, {
      roughness: 0.46,
    });
    fn8(
      value3,
      width * 0.9,
      height * 0.08,
      depth * 0.18,
      0,
      height * 0.18,
      depth * 0.46,
      color3,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    fn8(
      value3,
      width * 0.12,
      height * 0.08,
      depth * 0.05,
      width * 0.34,
      height * 0.68,
      depth * 0.51,
      color,
      {
        rounded: false,
        emissive: color,
        emissiveIntensity: 0.18,
      },
    );
  } else if (value.type === "floorac") {
    O(value3, width * 0.46, width * 0.48, height, 0, height * 0.5, 0, color2, {
      segments: 32,
      roughness: 0.48,
    });
    fn8(
      value3,
      width * 0.5,
      height * 0.42,
      0.025,
      0,
      height * 0.68,
      depth * 0.48,
      color3,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    for (const value6 of [0.58, 0.68, 0.78]) {
      fn8(
        value3,
        width * 0.42,
        0.018,
        0.03,
        0,
        height * value6,
        depth * 0.5,
        color,
        {
          rounded: false,
          roughness: 0.34,
        },
      );
    }
  } else if (value.type === "robotvacuum") {
    fn8(value3, width * 0.82, 0.035, depth * 0.92, 0, 0.018, 0, color, {
      radius: Math.min(width, depth) * 0.05,
      roughness: 0.58,
    });
    fn8(
      value3,
      width * 0.68,
      height * 0.82,
      depth * 0.48,
      0,
      height * 0.47,
      -depth * 0.23,
      color2,
      {
        radius: Math.min(width, depth) * 0.12,
        roughness: 0.48,
      },
    );
    fn8(
      value3,
      width * 0.44,
      height * 0.16,
      0.03,
      0,
      height * 0.2,
      depth * 0.02,
      color,
      {
        radius: Math.min(width, depth) * 0.04,
        roughness: 0.42,
      },
    );
    fn8(
      value3,
      width * 0.34,
      height * 0.07,
      0.035,
      0,
      height * 0.14,
      depth * 0.04,
      color3,
      {
        radius: Math.min(width, depth) * 0.025,
        roughness: 0.28,
      },
    );
    O(
      value3,
      width * 0.31,
      width * 0.32,
      height * 0.12,
      0,
      height * 0.07,
      depth * 0.2,
      color2,
      {
        segments: 32,
        roughness: 0.42,
      },
    );
    O(
      value3,
      width * 0.085,
      width * 0.09,
      height * 0.055,
      -width * 0.08,
      height * 0.16,
      depth * 0.15,
      color,
      {
        segments: 24,
        roughness: 0.34,
      },
    );
    fn8(
      value3,
      width * 0.36,
      height * 0.045,
      0.025,
      0,
      height * 0.08,
      depth * 0.52,
      color3,
      {
        radius: Math.min(width, depth) * 0.025,
        roughness: 0.24,
      },
    );
  } else if (value.type === "nas") {
    fn8(value3, width, height, depth, 0, height * 0.5, 0, furniture, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.46,
    });
    fn8(
      value3,
      width * 0.9,
      height * 0.88,
      0.025,
      0,
      height * 0.5,
      depth * 0.515,
      color3,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.32,
      },
    );
    for (const value6 of [-width * 0.23, width * 0.23]) {
      for (const value7 of [height * 0.3, height * 0.7]) {
        fn8(
          value3,
          width * 0.38,
          height * 0.34,
          0.018,
          value6,
          value7,
          depth * 0.535,
          color,
          {
            rounded: false,
            roughness: 0.38,
          },
        );
        fn8(
          value3,
          width * 0.18,
          0.018,
          0.012,
          value6,
          value7 + height * 0.1,
          depth * 0.55,
          color3,
          {
            rounded: false,
            metalness: 0.25,
            roughness: 0.3,
          },
        );
      }
    }
    for (const value6 of [0.18, 0.26, 0.34]) {
      fn8(
        value3,
        0.012,
        0.012,
        0.012,
        width * 0.42,
        height * value6,
        depth * 0.55,
        9550021,
        {
          rounded: false,
          emissive: 9550021,
          emissiveIntensity: 0.28,
          roughness: 0.2,
        },
      );
    }
  } else if (value.type === "airpurifier") {
    const value6 = Math.min(width, depth) * 0.47;
    O(
      value3,
      value6 * 0.96,
      value6,
      height * 0.92,
      0,
      height * 0.46,
      0,
      color2,
      {
        segments: 36,
        roughness: 0.5,
      },
    );
    O(
      value3,
      value6 * 0.92,
      value6 * 0.92,
      height * 0.055,
      0,
      height * 0.965,
      0,
      color3,
      {
        segments: 36,
        metalness: 0.18,
        roughness: 0.3,
      },
    );
    O(
      value3,
      value6 * 0.55,
      value6 * 0.55,
      height * 0.018,
      0,
      height * 1.005,
      0,
      color,
      {
        segments: 32,
        metalness: 0.08,
        roughness: 0.35,
      },
    );
    for (const value7 of [-0.28, -0.14, 0, 0.14, 0.28]) {
      fn8(
        value3,
        0.012,
        height * 0.45,
        0.012,
        width * value7,
        height * 0.35,
        depth * 0.46,
        color,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (value.type === "tv") {
    const { bodyHeight: value6, centerY: value7 } = Od(value, height);
    const value8 = value7 - value6 * 0.5;
    if (value.tvMountStyle === "mobile") {
      const count = Math.max(height * 0.045, 0.055);
      const value9 = width * 0.7;
      const count2 = Math.max(depth * 0.78, 0.3);
      const count3 = Math.max(value8 - count * 0.7, height * 0.22);
      const value10 = count * 0.7 + count3 * 0.5;
      fn8(value3, value9, count, count2, 0, count * 0.72, 0, color3, {
        radius: Math.min(count, count2) * 0.22,
        metalness: 0.18,
        roughness: 0.32,
      });
      fn8(
        value3,
        width * 0.075,
        count3,
        Math.max(depth * 0.2, 0.06),
        -width * 0.035,
        value10,
        -depth * 0.03,
        color3,
        {
          rounded: false,
          metalness: 0.2,
          roughness: 0.3,
        },
      );
      fn8(
        value3,
        width * 0.105,
        count3 * 0.86,
        Math.max(depth * 0.12, 0.04),
        width * 0.025,
        value10 + count3 * 0.02,
        depth * 0.015,
        color,
        {
          rounded: false,
          metalness: 0.35,
          roughness: 0.28,
        },
      );
      fn8(
        value3,
        width * 0.34,
        Math.max(height * 0.018, 0.025),
        Math.max(depth * 0.5, 0.2),
        0,
        value8 * 0.76,
        depth * 0.04,
        color3,
        {
          radius: 0.012,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
      const count4 = Math.max(Math.min(width, depth) * 0.045, 0.025);
      for (const value11 of [-value9 * 0.42, value9 * 0.42]) {
        for (const value12 of [-count2 * 0.34, count2 * 0.34]) {
          O(
            value3,
            count4,
            count4,
            Math.max(count4 * 0.56, 0.018),
            value11,
            count4,
            value12,
            1448479,
            {
              segments: 20,
              rotationZ: Math.PI / 2,
              roughness: 0.38,
              metalness: 0.1,
            },
          );
        }
      }
    } else if (value.tvMountStyle === "tabletop") {
      const count = Math.max(height * 0.035, 0.028);
      const value9 = width * 0.34;
      const count2 = Math.max(depth * 0.72, 0.16);
      const count3 = Math.max(value8 - count, height * 0.12);
      fn8(value3, value9, count, count2, 0, count * 0.5, 0, color3, {
        radius: Math.min(count, count2) * 0.26,
        metalness: 0.2,
        roughness: 0.3,
      });
      fn8(
        value3,
        width * 0.075,
        count3,
        Math.max(depth * 0.24, 0.05),
        0,
        count + count3 * 0.5,
        -depth * 0.03,
        color,
        {
          rounded: false,
          metalness: 0.34,
          roughness: 0.28,
        },
      );
      fn8(
        value3,
        width * 0.18,
        Math.max(height * 0.025, 0.022),
        Math.max(depth * 0.34, 0.08),
        0,
        value8,
        0,
        color3,
        {
          radius: 0.008,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
    }
    fn8(
      value3,
      width,
      value6,
      Math.max(depth * 0.28, 0.05),
      0,
      value7,
      0,
      color3,
      {
        radius: Math.min(width, value6) * 0.012,
        roughness: 0.28,
      },
    );
  } else if (value.type === "vanity") {
    const value6 = Math.min(0.76, height * 0.5);
    fn8(value3, width, 0.075, depth, 0, value6, 0, furniture);
    fn8(
      value3,
      width * 0.27,
      value6 * 0.82,
      depth * 0.88,
      -width * 0.34,
      value6 * 0.42,
      0,
      furniture,
    );
    fn8(
      value3,
      width * 0.27,
      value6 * 0.82,
      depth * 0.88,
      width * 0.34,
      value6 * 0.42,
      0,
      furniture,
    );
    for (const value7 of [-0.34, 0.34]) {
      for (const value8 of [0.23, 0.48]) {
        fn8(
          value3,
          width * 0.22,
          0.012,
          depth * 0.02,
          width * value7,
          value6 * value8,
          depth * 0.46,
          color3,
          {
            rounded: false,
          },
        );
      }
    }
    const count = Math.max(height - value6 - 0.08, 0.45);
    fn8(
      value3,
      width * 0.54,
      count,
      0.025,
      0,
      value6 + count * 0.5,
      -depth * 0.43,
      value4.glass,
      {
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        metalness: 0.22,
        roughness: 0.16,
      },
    );
    fn8(
      value3,
      width * 0.59,
      0.045,
      0.05,
      0,
      value6 + count,
      -depth * 0.43,
      color2,
      {
        metalness: 0.12,
      },
    );
    fn8(value3, width * 0.59, 0.045, 0.05, 0, value6, -depth * 0.43, color2, {
      metalness: 0.12,
    });
    fn8(
      value3,
      0.045,
      count,
      0.05,
      -width * 0.295,
      value6 + count * 0.5,
      -depth * 0.43,
      color2,
      {
        metalness: 0.12,
      },
    );
    fn8(
      value3,
      0.045,
      count,
      0.05,
      width * 0.295,
      value6 + count * 0.5,
      -depth * 0.43,
      color2,
      {
        metalness: 0.12,
      },
    );
  } else if (value.type === "desk") {
    fn8(value3, width, height * 0.1, depth, 0, height * 0.93, 0, furniture);
    fn8(
      value3,
      width * 0.05,
      height * 0.88,
      depth * 0.82,
      -width * 0.44,
      height * 0.44,
      0,
      color3,
    );
    fn8(
      value3,
      width * 0.05,
      height * 0.88,
      depth * 0.82,
      width * 0.44,
      height * 0.44,
      0,
      color3,
    );
    fn8(
      value3,
      width * 0.34,
      height * 0.18,
      depth * 0.78,
      width * 0.22,
      height * 0.74,
      0,
      furniture,
    );
    fn8(
      value3,
      width * 0.27,
      0.018,
      depth * 0.04,
      width * 0.22,
      height * 0.73,
      depth * 0.41,
      color2,
      {
        metalness: 0.35,
      },
    );
  } else if (value.type === "desktop") {
    const value6 = width * 0.72;
    const value7 = height * 0.58;
    fn8(
      value3,
      value6,
      value7,
      0.035,
      -width * 0.06,
      height * 0.66,
      -depth * 0.25,
      color3,
      {
        rounded: false,
        roughness: 0.24,
      },
    );
    fn8(
      value3,
      value6 * 0.9,
      value7 * 0.84,
      0.01,
      -width * 0.06,
      height * 0.66,
      -depth * 0.19,
      659481,
      {
        rounded: false,
        roughness: 0.18,
        emissive: 1517112,
        emissiveIntensity: 0.35,
      },
    );
    fn8(
      value3,
      0.035,
      height * 0.24,
      0.035,
      -width * 0.06,
      height * 0.25,
      -depth * 0.25,
      color3,
      {
        metalness: 0.5,
      },
    );
    fn8(
      value3,
      width * 0.28,
      0.025,
      depth * 0.3,
      -width * 0.06,
      0.02,
      -depth * 0.22,
      color3,
      {
        metalness: 0.42,
      },
    );
    fn8(
      value3,
      width * 0.58,
      0.022,
      depth * 0.38,
      -width * 0.08,
      0.025,
      depth * 0.24,
      color,
      {
        rounded: false,
        roughness: 0.5,
      },
    );
    fn8(
      value3,
      width * 0.1,
      0.035,
      depth * 0.22,
      width * 0.36,
      0.028,
      depth * 0.24,
      color,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.46,
      },
    );
  } else if (value.type === "laptop") {
    fn8(value3, width, 0.025, depth * 0.72, 0, 0.018, depth * 0.08, furniture, {
      metalness: 0.28,
      roughness: 0.36,
    });
    const value6 = fn8(
      value3,
      width * 0.96,
      height * 0.78,
      0.018,
      0,
      height * 0.43,
      -depth * 0.29,
      color3,
      {
        rounded: false,
        metalness: 0.22,
        roughness: 0.25,
      },
    );
    value6.rotation.x = -Math.PI * 0.08;
    fn8(
      value3,
      width * 0.86,
      height * 0.63,
      0.01,
      0,
      height * 0.43,
      -depth * 0.278,
      659740,
      {
        rounded: false,
        emissive: 1585226,
        emissiveIntensity: 0.38,
        roughness: 0.18,
      },
    );
    fn8(
      value3,
      width * 0.62,
      0.009,
      depth * 0.34,
      0,
      0.035,
      depth * 0.12,
      color3,
      {
        rounded: false,
      },
    );
  } else if (value.type === "toilet") {
    const value6 = new THREE.Mesh(
      hg(width, depth, height),
      new THREE.MeshStandardMaterial({
        color: color2,
        roughness: 0.4,
        metalness: 0.02,
      }),
    );
    value6.castShadow = true;
    value6.receiveShadow = true;
    value3.add(value6);
    const value7 = new THREE.Shape();
    value7.moveTo(-width * 0.46, -depth * 0.44);
    value7.lineTo(width * 0.46, -depth * 0.44);
    value7.bezierCurveTo(
      width * 0.49,
      -depth * 0.05,
      width * 0.49,
      depth * 0.29,
      0,
      depth * 0.47,
    );
    value7.bezierCurveTo(
      -width * 0.49,
      depth * 0.29,
      -width * 0.49,
      -depth * 0.05,
      -width * 0.46,
      -depth * 0.44,
    );
    value7.closePath();
    const value8 = new THREE.Mesh(
      new THREE.ExtrudeGeometry(value7, {
        depth: height * 0.085,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.012,
        bevelThickness: 0.01,
        steps: 1,
      }),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.34,
        metalness: 0.01,
      }),
    );
    value8.rotation.x = Math.PI / 2;
    value8.position.set(0, height * 0.82, 0);
    value8.castShadow = true;
    value8.receiveShadow = true;
    value3.add(value8);
    fn8(
      value3,
      width * 0.9,
      height * 0.095,
      depth * 0.2,
      0,
      height * 0.775,
      -depth * 0.34,
      color2,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.36,
      },
    );
    fn8(
      value3,
      0.016,
      height * 0.38,
      0.024,
      -width * 0.42,
      height * 0.38,
      -depth * 0.18,
      color3,
      {
        rounded: false,
        roughness: 0.46,
      },
    );
    O(
      value3,
      width * 0.035,
      width * 0.035,
      0.018,
      -width * 0.46,
      height * 0.66,
      depth * 0.12,
      color,
      {
        segments: 24,
        rotationZ: Math.PI / 2,
        metalness: 0.08,
        roughness: 0.3,
      },
    );
  } else if (value.type === "squattoilet") {
    fn8(value3, width, height * 0.58, depth, 0, height * 0.29, 0, color2, {
      radius: Math.min(width, depth) * 0.08,
      roughness: 0.38,
    });
    fn8(
      value3,
      width * 0.28,
      height * 0.12,
      depth * 0.58,
      -width * 0.34,
      height * 0.66,
      0,
      color,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.4,
      },
    );
    fn8(
      value3,
      width * 0.28,
      height * 0.12,
      depth * 0.58,
      width * 0.34,
      height * 0.66,
      0,
      color,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.4,
      },
    );
    const value6 = new THREE.Mesh(
      new THREE.CylinderGeometry(width * 0.16, width * 0.2, height * 0.18, 28),
      new THREE.MeshStandardMaterial({
        color: color3,
        roughness: 0.34,
        metalness: 0.02,
      }),
    );
    value6.scale.z = 1.75;
    value6.position.y = height * 0.67;
    value3.add(value6);
  } else if (value.type === "urinal") {
    fn8(
      value3,
      width * 0.78,
      height * 0.88,
      depth * 0.72,
      0,
      height * 0.5,
      -depth * 0.06,
      color2,
      {
        radius: Math.min(width, depth) * 0.16,
        roughness: 0.32,
      },
    );
    const value6 = new THREE.Mesh(
      new THREE.SphereGeometry(
        Math.min(width, depth) * 0.3,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.58,
      ),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.28,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    );
    value6.scale.set(0.9, 1.1, 0.62);
    value6.rotation.x = Math.PI;
    value6.position.set(0, height * 0.53, depth * 0.17);
    value3.add(value6);
    O(
      value3,
      0.018,
      0.018,
      height * 0.22,
      0,
      height * 0.95,
      -depth * 0.18,
      color3,
      {
        segments: 16,
        metalness: 0.72,
        roughness: 0.22,
      },
    );
  } else if (value.type === "bathtub") {
    const value6 = height * 0.84;
    const value7 = Math.min(width, depth) * 0.11;
    const value8 = value6 * 0.8;
    const count = Math.max(width - value7 * 2, width * 0.48);
    const count2 = Math.max(depth - value7 * 2, depth * 0.42);
    fn8(value3, count, value6 * 0.16, count2, 0, value6 * 0.14, 0, color, {
      radius: Math.min(width, depth) * 0.16,
      roughness: 0.33,
    });
    fn8(
      value3,
      width,
      value8,
      value7,
      0,
      value8 * 0.5,
      -depth * 0.5 + value7 * 0.5,
      color2,
      {
        radius: value7 * 0.5,
        roughness: 0.34,
      },
    );
    fn8(
      value3,
      width,
      value8,
      value7,
      0,
      value8 * 0.5,
      depth * 0.5 - value7 * 0.5,
      color2,
      {
        radius: value7 * 0.5,
        roughness: 0.34,
      },
    );
    fn8(
      value3,
      value7,
      value8,
      count2,
      -width * 0.5 + value7 * 0.5,
      value8 * 0.5,
      0,
      color2,
      {
        radius: value7 * 0.5,
        roughness: 0.34,
      },
    );
    fn8(
      value3,
      value7,
      value8,
      count2,
      width * 0.5 - value7 * 0.5,
      value8 * 0.5,
      0,
      color2,
      {
        radius: value7 * 0.5,
        roughness: 0.34,
      },
    );
    const value9 = value6 * 0.075;
    const value10 = value8 + value9 * 0.5;
    fn8(
      value3,
      width,
      value9,
      value7,
      0,
      value10,
      -depth * 0.5 + value7 * 0.5,
      color2,
      {
        radius: value7 * 0.45,
        roughness: 0.29,
      },
    );
    fn8(
      value3,
      width,
      value9,
      value7,
      0,
      value10,
      depth * 0.5 - value7 * 0.5,
      color2,
      {
        radius: value7 * 0.45,
        roughness: 0.29,
      },
    );
    fn8(
      value3,
      value7,
      value9,
      count2,
      -width * 0.5 + value7 * 0.5,
      value10,
      0,
      color2,
      {
        radius: value7 * 0.45,
        roughness: 0.29,
      },
    );
    fn8(
      value3,
      value7,
      value9,
      count2,
      width * 0.5 - value7 * 0.5,
      value10,
      0,
      color2,
      {
        radius: value7 * 0.45,
        roughness: 0.29,
      },
    );
    for (const value11 of [-width * 0.38, width * 0.38]) {
      for (const value12 of [-depth * 0.3, depth * 0.3]) {
        O(
          value3,
          0.026,
          0.026,
          height * 0.16,
          value11,
          height * 0.08,
          value12,
          value4.furnitureDark,
          {
            segments: 12,
            metalness: 0.42,
            roughness: 0.3,
          },
        );
      }
    }
    O(
      value3,
      0.016,
      0.016,
      height * 0.25,
      width * 0.34,
      height * 0.96,
      -depth * 0.22,
      color3,
      {
        segments: 16,
        metalness: 0.72,
        roughness: 0.2,
      },
    );
    O(
      value3,
      0.016,
      0.016,
      depth * 0.28,
      width * 0.34,
      height * 1.08,
      -depth * 0.08,
      color3,
      {
        segments: 16,
        rotationX: Math.PI / 2,
        metalness: 0.72,
        roughness: 0.2,
      },
    );
  } else if (value.type === "walllamp") {
    const value6 = -depth * 0.5 + 0.018;
    const value7 = {
      rounded: false,
      metalness: 0.64,
      roughness: 0.22,
    };
    fn8(
      value3,
      width * 0.68,
      height * 0.5,
      0.035,
      0,
      height * 0.52,
      value6,
      value4.furniture,
      {
        radius: 0.02,
        metalness: 0.18,
        roughness: 0.46,
      },
    );
    O(
      value3,
      width * 0.11,
      width * 0.11,
      0.035,
      0,
      height * 0.57,
      value6 - 0.012,
      value4.furnitureSoft,
      {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.3,
        roughness: 0.34,
      },
    );
    fn8(
      value3,
      0.04,
      height * 0.2,
      depth * 0.28,
      0,
      height * 0.57,
      -depth * 0.3,
      value4.furniture,
      {
        ...value7,
        metalness: 0.18,
        roughness: 0.46,
      },
    );
    const value8 = new THREE.Mesh(
      new THREE.CylinderGeometry(
        width * 0.3,
        width * 0.19,
        height * 0.38,
        24,
        1,
        true,
      ),
      new THREE.MeshStandardMaterial({
        color: color2,
        roughness: 0.3,
        metalness: 0.04,
        emissive: 16767386,
        emissiveIntensity: 0.24,
        side: THREE.DoubleSide,
      }),
    );
    value8.position.set(0, height * 0.4, -depth * 0.16);
    value8.castShadow = true;
    value8.receiveShadow = true;
    value3.add(value8);
    O(
      value3,
      width * 0.15,
      width * 0.15,
      0.025,
      0,
      height * 0.19,
      -depth * 0.16,
      16769707,
      {
        segments: 24,
        emissive: 16760156,
        emissiveIntensity: 0.38,
        roughness: 0.24,
      },
    );
  } else if (value.type === "glasspartition") {
    const value6 = Math.min(Math.max(width * 0.018, 0.018), 0.035);
    const count = Math.max(depth, 0.045);
    const count2 = Math.max(width - value6 * 2.4, value6);
    const count3 = Math.max(height - value6 * 2.4, value6);
    const value7 = {
      rounded: false,
      metalness: 0.58,
      roughness: 0.24,
      castShadow: false,
      receiveShadow: false,
    };
    fn8(
      value3,
      count2,
      count3,
      Math.max(depth * 0.24, 0.012),
      0,
      height * 0.5,
      0,
      value4.glass,
      {
        rounded: false,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
        metalness: 0.04,
        roughness: 0.08,
        castShadow: false,
        receiveShadow: false,
        renderOrder: 6,
      },
    );
    fn8(value3, width, value6, count, 0, value6 * 0.5, 0, value4.frame, value7);
    fn8(
      value3,
      width,
      value6,
      count,
      0,
      height - value6 * 0.5,
      0,
      value4.frame,
      value7,
    );
    fn8(
      value3,
      value6,
      height,
      count,
      -width * 0.5 + value6 * 0.5,
      height * 0.5,
      0,
      value4.frame,
      value7,
    );
    fn8(
      value3,
      value6,
      height,
      count,
      width * 0.5 - value6 * 0.5,
      height * 0.5,
      0,
      value4.frame,
      value7,
    );
    for (const value8 of [-width * 0.34, width * 0.34]) {
      fn8(
        value3,
        value6 * 1.7,
        value6 * 2.2,
        count * 1.18,
        value8,
        value6 * 1.3,
        0,
        color,
        value7,
      );
    }
  } else if (value.type === "shower") {
    const value6 = color2;
    const value7 = -depth * 0.42;
    const value8 = height * 0.13;
    const value9 = height * 0.9;
    const value10 = value9 - value8;
    const value11 = {
      rounded: false,
      metalness: 0.68,
      roughness: 0.22,
    };
    fn8(
      value3,
      0.045,
      value10,
      0.045,
      0,
      (value8 + value9) * 0.5,
      value7,
      value6,
      value11,
    );
    for (const value19 of [value8, height * 0.47, height * 0.78, value9]) {
      fn8(value3, 0.085, 0.085, 0.065, 0, value19, value7, value6, value11);
    }
    for (const value19 of [value8, value9]) {
      O(
        value3,
        width * 0.055,
        width * 0.055,
        0.04,
        0,
        value19,
        -depth * 0.47,
        value6,
        {
          segments: 28,
          rotationX: Math.PI / 2,
          metalness: 0.7,
          roughness: 0.2,
        },
      );
    }
    const value12 = height * 0.12;
    fn8(
      value3,
      width * 0.36,
      0.065,
      0.065,
      0,
      value12,
      value7 + depth * 0.08,
      value6,
      value11,
    );
    for (const value19 of [-width * 0.2, width * 0.2]) {
      O(
        value3,
        width * 0.055,
        width * 0.055,
        0.045,
        value19,
        value12,
        -depth * 0.45,
        value6,
        {
          segments: 28,
          rotationX: Math.PI / 2,
          metalness: 0.7,
          roughness: 0.2,
        },
      );
      fn8(
        value3,
        0.05,
        0.05,
        depth * 0.13,
        value19,
        value12,
        value7 + depth * 0.01,
        value6,
        value11,
      );
    }
    fn8(
      value3,
      0.045,
      height * 0.12,
      0.045,
      0,
      value12 - height * 0.045,
      value7 + depth * 0.13,
      value6,
      value11,
    );
    const value13 = new THREE.Vector3(0, value9, value7);
    const value14 = new THREE.Vector3(0, height * 0.76, depth * 0.08);
    const value15 = value14.y - value13.y;
    const value16 = value14.z - value13.z;
    const value17 = Math.hypot(value15, value16);
    const value18 = fn8(
      value3,
      0.055,
      value17,
      0.055,
      0,
      (value13.y + value14.y) * 0.5,
      (value13.z + value14.z) * 0.5,
      value6,
      value11,
    );
    value18.rotation.x = Math.atan2(value16, value15);
    fn8(
      value3,
      0.055,
      height * 0.13,
      0.055,
      0,
      height * 0.705,
      value14.z,
      value6,
      value11,
    );
    fn8(
      value3,
      width * 0.34,
      0.035,
      depth * 0.3,
      0,
      height * 0.64,
      value14.z + depth * 0.03,
      value6,
      {
        rounded: false,
        metalness: 0.64,
        roughness: 0.24,
      },
    );
  } else if (value.type === "basin") {
    fn8(
      value3,
      width * 0.92,
      height * 0.72,
      depth * 0.9,
      0,
      height * 0.36,
      0,
      furniture,
    );
    fn8(value3, width, 0.065, depth, 0, height * 0.75, 0, color2, {
      roughness: 0.3,
    });
    O(
      value3,
      width * 0.25,
      width * 0.21,
      0.08,
      0,
      height * 0.8,
      depth * 0.02,
      color,
      {
        roughness: 0.28,
      },
    );
    O(
      value3,
      0.018,
      0.018,
      height * 0.2,
      0,
      height * 0.9,
      -depth * 0.2,
      color3,
      {
        metalness: 0.78,
        roughness: 0.18,
      },
    );
    O(
      value3,
      0.018,
      0.018,
      depth * 0.2,
      0,
      height * 0.99,
      -depth * 0.11,
      color3,
      {
        rotationX: Math.PI / 2,
        metalness: 0.78,
        roughness: 0.18,
      },
    );
    fn8(
      value3,
      0.012,
      height * 0.62,
      depth * 0.02,
      0,
      height * 0.34,
      depth * 0.46,
      color3,
      {
        rounded: false,
      },
    );
    const value6 = height * 1.05;
    const value7 = width * 0.72;
    const value8 = 0.72;
    const value9 = -depth * 0.46;
    fn8(
      value3,
      value7,
      value8,
      0.018,
      0,
      value6 + value8 * 0.5,
      value9,
      value4.glass,
      {
        rounded: false,
        transparent: true,
        opacity: 0.46,
        depthWrite: false,
        metalness: 0.26,
        roughness: 0.12,
        castShadow: false,
      },
    );
    fn8(value3, value7 + 0.055, 0.035, 0.045, 0, value6, value9, color3, {
      metalness: 0.35,
    });
    fn8(
      value3,
      value7 + 0.055,
      0.035,
      0.045,
      0,
      value6 + value8,
      value9,
      color3,
      {
        metalness: 0.35,
      },
    );
    fn8(
      value3,
      0.035,
      value8,
      0.045,
      -value7 * 0.5,
      value6 + value8 * 0.5,
      value9,
      color3,
      {
        metalness: 0.35,
      },
    );
    fn8(
      value3,
      0.035,
      value8,
      0.045,
      value7 * 0.5,
      value6 + value8 * 0.5,
      value9,
      color3,
      {
        metalness: 0.35,
      },
    );
  } else if (value.type === "rug") {
    if (!sg(value3, value, furniture, color)) {
      const value6 = clamp(height, 0.004, 0.018);
      fn8(value3, width, value6, depth, 0, value6 * 0.5, 0, furniture, {
        radius: Math.min(width, depth) * 0.018,
        roughness: 1,
        metalness: 0,
        castShadow: false,
        receiveShadow: true,
      });
      const value7 = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.88, depth * 0.84),
        new THREE.MeshStandardMaterial({
          color: color,
          roughness: 1,
          metalness: 0,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -4,
        }),
      );
      value7.rotation.x = -Math.PI / 2;
      value7.position.y = value6 + 0.001;
      value7.castShadow = false;
      value7.receiveShadow = true;
      value7.renderOrder = 1;
      value3.add(value7);
    }
  } else if (value.type === "tvstand") {
    fn8(value3, width, height * 0.76, depth, 0, height * 0.42, 0, furniture);
    const value6 = height * 0.08;
    const value7 = height * 0.8;
    fn8(
      value3,
      width * 0.98,
      value6,
      depth,
      0,
      value7 + value6 * 0.5,
      0,
      color,
    );
    fn8(
      value3,
      0.018,
      height * 0.58,
      depth * 1.01,
      0,
      height * 0.43,
      depth * 0.01,
      color3,
      {
        rounded: false,
      },
    );
    fn8(
      value3,
      width * 0.91,
      0.015,
      depth * 1.01,
      0,
      height * 0.43,
      depth * 0.01,
      color3,
      {
        rounded: false,
      },
    );
    for (const value8 of [-0.4, 0.4]) {
      fn8(
        value3,
        0.055,
        height * 0.2,
        0.055,
        width * value8,
        height * 0.1,
        0,
        color3,
        {
          metalness: 0.32,
        },
      );
    }
  } else if (value.type === "floorlamp") {
    const value6 = -width * 0.34;
    const value7 = width * 0.31;
    const value8 = Math.min(width * 0.13, depth * 0.34);
    const value9 = Math.min(width * 0.18, depth * 0.46);
    const value10 = height * 0.115;
    const value11 = height * 0.76;
    const value12 = value11 + value10;
    O(value3, value8 * 0.82, value8, 0.045, value6, 0.0225, 0, color3, {
      segments: 32,
      metalness: 0.38,
      roughness: 0.3,
    });
    const value13 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(value6, 0.045, 0),
      new THREE.Vector3(value6, height * 0.72, 0),
      new THREE.Vector3(width * 0.02, height * 1.01, 0),
      new THREE.Vector3(value7, value12, 0),
    );
    const value14 = new THREE.Mesh(
      new THREE.TubeGeometry(
        value13,
        48,
        Math.max(0.012, width * 0.012),
        8,
        false,
      ),
      new THREE.MeshStandardMaterial({
        color: color3,
        roughness: 0.3,
        metalness: 0.48,
      }),
    );
    value14.castShadow = true;
    value3.add(value14);
    const value15 = new THREE.Mesh(
      new THREE.SphereGeometry(value9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.62,
        metalness: 0.04,
      }),
    );
    value15.scale.set(1, value10 / value9, 1);
    value15.position.set(value7, value11, 0);
    value15.castShadow = true;
    value3.add(value15);
    O(value3, value9 * 0.94, value9 * 0.98, 0.025, value7, value11, 0, color3, {
      segments: 32,
      metalness: 0.12,
      roughness: 0.5,
    });
    O(
      value3,
      Math.max(0.018, width * 0.014),
      Math.max(0.022, width * 0.018),
      0.045,
      value7,
      value12 + 0.012,
      0,
      color3,
      {
        segments: 20,
        metalness: 0.42,
        roughness: 0.28,
      },
    );
  } else if (value.type === "plant") {
    O(
      value3,
      width * 0.25,
      width * 0.21,
      height * 0.22,
      0,
      height * 0.11,
      0,
      color,
      {
        segments: 24,
        roughness: 0.82,
      },
    );
    O(value3, width * 0.22, width * 0.22, 0.035, 0, height * 0.22, 0, color3, {
      segments: 24,
      roughness: 0.96,
    });
    const value6 = [
      [
        new THREE.Vector3(0, height * 0.21, 0),
        new THREE.Vector3(-width * 0.06, height * 0.58, 0),
        new THREE.Vector3(-width * 0.27, height * 0.78, 0),
      ],
      [
        new THREE.Vector3(width * 0.03, height * 0.21, 0),
        new THREE.Vector3(width * 0.06, height * 0.64, 0),
        new THREE.Vector3(width * 0.12, height * 0.94, 0),
      ],
      [
        new THREE.Vector3(0, height * 0.28, 0),
        new THREE.Vector3(width * 0.18, height * 0.62, 0),
        new THREE.Vector3(width * 0.31, height * 0.79, 0),
      ],
    ];
    for (const value8 of value6) {
      const value9 = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(value8),
          20,
          0.014,
          7,
          false,
        ),
        new THREE.MeshStandardMaterial({
          color: color3,
          roughness: 0.86,
        }),
      );
      value9.castShadow = true;
      value3.add(value9);
    }
    const value7 = [
      [-0.27, 0.78, 0],
      [-0.1, 0.61, 0.02],
      [0.12, 0.94, 0],
      [0.31, 0.79, 0],
      [0.18, 0.63, -0.02],
      [0.02, 0.46, 0.03],
    ];
    for (const [value8, value9, value10] of value7) {
      for (let value11 = 0; value11 < 5; value11 += 1) {
        const value12 = (value11 / 5) * Math.PI * 2;
        const value13 = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 10, 6),
          new THREE.MeshStandardMaterial({
            color: value11 % 2 ? 7835779 : 6257261,
            roughness: 0.9,
          }),
        );
        value13.scale.set(width * 0.045, height * 0.085, depth * 0.025);
        value13.position.set(
          width * value8 + Math.cos(value12) * width * 0.08,
          height * value9 + Math.sin(value12) * height * 0.035,
          depth * value10 + Math.sin(value12) * depth * 0.06,
        );
        value13.rotation.z = value12 - Math.PI / 2;
        value13.rotation.y = value12 * 0.6;
        value13.castShadow = true;
        value3.add(value13);
      }
    }
  }
  if (
    (pu.has(value.type) || mu.has(value.type)) &&
    value.offlineModelExport !== true
  ) {
    const value6 = [...value3.children];
    if (xi(value3, value)) {
      value6.forEach((value7) => {
        value3.remove(value7);
        Bn(value7);
      });
    }
  }
  if (value.type === "tv" && value.offlineModelExport !== true) {
    xg(value3, value, width, depth, height);
  }
  lg(value3, value.type);
  cg(value3, value.type);
  ug(value3, We("item", value.id));
  return value3;
}
function Wd(value, value2) {
  value.rotation.y = -THREE.MathUtils.degToRad(finite(value2.rotation, 0));
  if (xo.has(value2.type)) {
    value.scale.x = value2.stairDirection === "left" ? -1 : 1;
  }
  if (value2.type === "shoecabinet" && value2.shoeCabinetMirrored === true) {
    value.scale.x = -1;
  }
  if (re.has(value2.type)) {
    if (value2.type === "striplight") {
      value.rotation.order = "YXZ";
      value.rotation.x = 0;
      value.rotation.z = 0;
    } else {
      const value3 = THREE.MathUtils.degToRad(
        clamp(finite(value2.verticalRotation, 0), -90, 90),
      );
      value.rotation.order = "YXZ";
      value.rotation.x = value3;
    }
  }
}
function bg(value) {
  value.updateMatrixWorld(true);
  value.updateMatrix();
  if (value.matrix.determinant() < 0) {
    return null;
  }
  const value2 = value.matrixWorld.clone().invert();
  const value3 = [];
  let value4 = true;
  value.traverse((mesh) => {
    if (!value4 || !mesh.isMesh) {
      return;
    }
    const material = mesh.material;
    if (
      !mesh.userData.externalModelSharedGeometry ||
      Array.isArray(material) ||
      !material ||
      material.transparent === true ||
      finite(material.opacity, 1) < 0.999 ||
      mesh.isSkinnedMesh ||
      mesh.morphTargetInfluences
    ) {
      value4 = false;
      return;
    }
    const relativeMatrix = new THREE.Matrix4().multiplyMatrices(
      value2,
      mesh.matrixWorld,
    );
    const value5 = Gd(mesh);
    if (!value5) {
      value4 = false;
      return;
    }
    value3.push({
      mesh: mesh,
      relativeMatrix: relativeMatrix,
      signature: JSON.stringify([
        mesh.geometry.uuid,
        value5,
        relativeMatrix.elements.map(
          (signature) => Math.round(signature * 1000000) / 1000000,
        ),
        mesh.castShadow,
        mesh.receiveShadow,
        mesh.renderOrder,
      ]),
    });
  });
  if (value4 && value3.length) {
    return value3;
  } else {
    return null;
  }
}
function fl(value, value2) {
  const index = new Map();
  for (const { item: item, group: group } of value2) {
    if (as.has(item.type) || We("item", item.id)) {
      continue;
    }
    const descriptors = bg(group);
    if (!descriptors) {
      continue;
    }
    const value6 = JSON.stringify([
      item.type,
      descriptors.map((value7) => value7.signature),
    ]);
    if (!index.has(value6)) {
      index.set(value6, []);
    }
    index.get(value6).push({
      item: item,
      group: group,
      descriptors: descriptors,
    });
  }
  value.updateMatrixWorld(true);
  const value4 = value.matrixWorld.clone().invert();
  const value5 = [];
  for (const value6 of index.values()) {
    if (value6.length < 2) {
      continue;
    }
    const after = value6[0].descriptors.length;
    for (let value7 = 0; value7 < after; value7 += 1) {
      const mesh = value6[0].descriptors[value7].mesh;
      const value8 = mesh.userData.externalModelSharedMaterial
        ? mesh.material
        : mesh.material.clone();
      const value9 = new THREE.InstancedMesh(
        mesh.geometry,
        value8,
        value6.length,
      );
      value9.name =
        "ha-bridge-instance-" + value6[0].item.type + "-" + (value7 + 1);
      value9.castShadow = mesh.castShadow;
      value9.receiveShadow = mesh.receiveShadow;
      value9.renderOrder = mesh.renderOrder;
      value9.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      value9.userData.externalModelSharedGeometry = true;
      value9.userData.externalModelSharedTextures = true;
      value9.userData.externalModelSharedMaterial =
        mesh.userData.externalModelSharedMaterial === true;
      value9.userData.modelLayer = "items";
      value9.userData.exportRole = "plan";
      value9.userData.instanceItemType = value6[0].item.type;
      value9.userData.instanceItemIds = value6.map(
        ({ item: value10 }) => value10.id,
      );
      value6.forEach(({ descriptors: value10 }, value11) => {
        const value12 = new THREE.Matrix4().multiplyMatrices(
          value4,
          value10[value7].mesh.matrixWorld,
        );
        value9.setMatrixAt(value11, value12);
      });
      value9.instanceMatrix.needsUpdate = true;
      value9.computeBoundingBox();
      value9.computeBoundingSphere();
      value.add(value9);
    }
    for (const { group: value7 } of value6) {
      value.remove(value7);
      Bn(value7);
    }
    value5.push({
      type: value6[0].item.type,
      instances: value6.length,
      before: value6.length * after,
      after: after,
    });
  }
  value.userData.instanceBatchStats = value5;
  if (renderer?.domElement) {
    renderer.domElement.dataset.instanceBatchCount = String(value5.length);
    renderer.domElement.dataset.instanceCount = String(
      value5.reduce((value6, value7) => value6 + value7.instances, 0),
    );
    renderer.domElement.dataset.instanceDrawCallsSaved = String(
      value5.reduce(
        (value6, value7) => value6 + value7.before - value7.after,
        0,
      ),
    );
  }
  return value5;
}
function Hd(value, value2) {
  const index = new Map();
  value.updateMatrixWorld(true);
  for (const { item: value6, group: value7 } of value2) {
    if (
      value7.parent === value &&
      !as.has(value6.type) &&
      !We("item", value6.id)
    ) {
      value7.traverse((value8) => {
        if (!value8.isMesh || value8.isInstancedMesh) {
          return;
        }
        const value9 = Fd(value8);
        if (!value9 || value8.matrixWorld.determinant() < 0) {
          return;
        }
        const value10 = value9 + ":" + Ad(value8);
        if (!index.has(value10)) {
          index.set(value10, []);
        }
        index.get(value10).push(value8);
      });
    }
  }
  const value4 = value.matrixWorld.clone().invert();
  const value5 = [];
  for (const value6 of index.values()) {
    if (value6.length < 2) {
      continue;
    }
    const value7 = value6.map((value11) => {
      const value12 = new THREE.Matrix4().multiplyMatrices(
        value4,
        value11.matrixWorld,
      );
      return value11.geometry.clone().applyMatrix4(value12);
    });
    const value8 = mergeGeometries(value7);
    value7.forEach((value11) => value11.dispose());
    if (!value8) {
      continue;
    }
    const value9 = value6[0];
    const value10 = new THREE.Mesh(value8, value9.material);
    value10.castShadow = value9.castShadow;
    value10.receiveShadow = value9.receiveShadow;
    value10.renderOrder = value9.renderOrder;
    value10.userData.externalModelSharedMaterial =
      value9.userData.externalModelSharedMaterial === true;
    value10.userData.modelLayer = "items";
    value10.userData.exportRole = "plan";
    for (const value11 of value6) {
      value11.parent?.remove(value11);
      if (!value11.userData.externalModelSharedGeometry) {
        value11.geometry.dispose();
      }
      if (
        value11 !== value9 &&
        value11.material !== value9.material &&
        !value11.userData.externalModelSharedMaterial
      ) {
        value11.material.dispose?.();
      }
    }
    value.add(value10);
    value5.push({
      before: value6.length,
      after: 1,
    });
  }
  for (const { group: value6 } of value2) {
    if (value6.parent === value && gr(value6).length === 0) {
      value.remove(value6);
    }
  }
  value.userData.staticItemBatchStats = value5;
  if (renderer?.domElement) {
    renderer.domElement.dataset.staticItemBatchCount = String(value5.length);
    renderer.domElement.dataset.staticItemDrawCallsSaved = String(
      value5.reduce(
        (value6, value7) => value6 + value7.before - value7.after,
        0,
      ),
    );
  }
  return value5;
}
function Vd() {
  const allowed = new Set();
  B?.traverse((value) => {
    if (!value.isMesh || !value.userData.externalModelSharedGeometry) {
      return;
    }
    const list = Array.isArray(value.material)
      ? value.material
      : value.material
        ? [value.material]
        : [];
    for (const value2 of list) {
      if (value2 && !Lc.has(value2)) {
        allowed.add(value2);
      }
    }
  });
  return [...allowed];
}
function _o() {
  if (!renderer?.domElement) {
    return;
  }
  const value = _t.modelLoadState();
  renderer.domElement.dataset.externalSharedMaterialCount = String(
    value.materials,
  );
  renderer.domElement.dataset.externalMaterialReuseCount = String(
    value.materialReuses,
  );
  renderer.domElement.dataset.externalPrecompilePassCount = String(Ss);
  renderer.domElement.dataset.lightPrecompilePassCount = String(Tc);
}
function Mg(value) {
  let value2 = 0;
  let value3 = 0;
  let value4 = 0;
  let value5 = 0;
  for (const value6 of value) {
    if (value6.isSpotLight) {
      value2 += 1;
    } else if (value6.isRectAreaLight) {
      value3 += 1;
    } else if (value6.isPointLight) {
      value4 += 1;
    } else {
      value5 += 1;
    }
  }
  return value2 + ":" + value3 + ":" + value4 + ":" + value5;
}
function Sg() {
  if (!B) {
    return [];
  }
  const value = [];
  const index = new Map();
  B.traverse((value4) => {
    if (
      !value4.isLight ||
      !value4.userData?.lightItemId ||
      finite(value4.userData.lightOnIntensity, 0) <= 0
    ) {
      return;
    }
    if (value4.visible !== false) {
      value.push(value4);
    }
    const text = String(value4.userData.lightGroupId || "");
    if (text) {
      if (!index.has(text)) {
        index.set(text, []);
      }
      index.get(text).push(value4);
    }
  });
  const allowed = new Set();
  const value3 = [];
  for (const [groupId, value4] of index) {
    const lights = value4.filter((value5) => value5.visible === false);
    if (!lights.length) {
      continue;
    }
    const signature = Mg([...value, ...lights]);
    if (!allowed.has(signature)) {
      allowed.add(signature);
      value3.push({
        groupId: groupId,
        lights: lights,
        signature: signature,
      });
    }
  }
  return value3;
}
const Pg = 4500;
function Eg(value) {
  let value2 = null;
  return Promise.race([
    Promise.resolve(value).then(() => true),
    new Promise((fn9) => {
      value2 = window.setTimeout(() => fn9(false), Pg);
    }),
  ]).finally(() => window.clearTimeout(value2));
}
function Qa(value = 360) {
  if (!$e) {
    Ga = true;
    window.clearTimeout(Ls);
    if (!Es) {
      Ls = window.setTimeout(async () => {
        Ls = null;
        const value2 = _t.modelLoadState();
        if (
          !renderer ||
          !ve ||
          !camera ||
          !B ||
          W ||
          document.hidden ||
          _e ||
          lt ||
          Mt ||
          $i ||
          _n ||
          Pn ||
          value2.active > 0 ||
          value2.queued > 0 ||
          Ye()
        ) {
          Qa(240);
          return;
        }
        const value3 = Sg();
        const value4 = [
          fe(),
          xe,
          Ss,
          ...value3.map((value6) => value6.signature).sort(),
        ].join("|");
        if (!value3.length || value4 === Ic) {
          Ga = false;
          renderer.domElement.dataset.lightPrecompileState = "ready";
          _o();
          return;
        }
        Es = true;
        Ga = false;
        renderer.domElement.dataset.lightPrecompileState = "working";
        renderer.domElement.dataset.lightPrecompilePlanCount = String(
          value3.length,
        );
        let value5 = true;
        try {
          for (const value6 of value3) {
            await gd();
            if (W || document.hidden || _e || lt || Mt || Ye()) {
              value5 = false;
              Ga = true;
              break;
            }
            const value7 = value6.lights.map((light) => ({
              light: light,
              visible: light.visible,
              intensity: light.intensity,
            }));
            let value8 = null;
            try {
              for (const value9 of value7) {
                value9.light.intensity = 0;
                value9.light.visible = true;
              }
              On(B, {
                rebuildAtlas: false,
              });
              value8 =
                typeof renderer.compileAsync == "function"
                  ? renderer.compileAsync(B, camera, ve)
                  : Promise.resolve(renderer.compile(B, camera, ve));
            } finally {
              for (const value9 of value7) {
                value9.light.visible = value9.visible;
                value9.light.intensity = value9.intensity;
              }
              On(B, {
                rebuildAtlas: false,
              });
            }
            if (!(await Eg(value8))) {
              renderer.domElement.dataset.lightPrecompileDeferred = "true";
              break;
            }
            Tc += 1;
          }
          if (value5) {
            Ic = value4;
            renderer.domElement.dataset.lightPrecompileState = "ready";
          }
        } catch (error) {
          value5 = false;
          renderer.domElement.dataset.lightPrecompileState = "fallback";
          console.debug("3D first-light precompile skipped", error);
        } finally {
          Es = false;
          _o();
          if (Ga) {
            Qa(240);
          }
        }
      }, value);
    }
  }
}
function gl(value = 0) {
  zi = true;
  window.clearTimeout(Ps);
  if (!$i) {
    Ps = window.setTimeout(async () => {
      Ps = null;
      if (
        !renderer ||
        !ve ||
        !camera ||
        !B ||
        W ||
        document.hidden ||
        _e ||
        lt ||
        Mt
      ) {
        gl(240);
        return;
      }
      const value2 = Vd();
      if (!value2.length) {
        zi = false;
        _o();
        Qa();
        return;
      }
      $i = true;
      zi = false;
      renderer.domElement.dataset.externalPrecompileState = "working";
      try {
        On(B, {
          rebuildAtlas: false,
        });
        renderer.compile(B, camera, ve);
        value2.forEach((value3) => Lc.add(value3));
        Ss += 1;
        renderer.domElement.dataset.externalPrecompileState = "ready";
      } catch (error) {
        renderer.domElement.dataset.externalPrecompileState = "fallback";
        console.debug("3D model precompile skipped", error);
      } finally {
        $i = false;
        _o();
        if (zi) {
          gl(120);
        } else {
          Qa();
        }
      }
    }, value);
  }
}
function qe(value = {}) {
  const value2 = value.force === true;
  const value3 = ["items", "lights"].includes(value.scope)
    ? value.scope
    : "all";
  if (!nr() && !value2) {
    if (value.transient !== true) {
      Po = true;
    }
    Na();
    return;
  }
  if (value2) {
    Li = true;
    So.add("all");
  } else {
    So.add(value3);
  }
  if (value.precompile === true) {
    us = true;
  }
  if (value.preserveLightCache !== true) {
    Ii = true;
  }
  if (!Ei) {
    Ei = true;
    requestAnimationFrame(() => {
      Ei = false;
      if (lt && !Li) {
        return;
      }
      const value4 = nr() || Li;
      Li = false;
      if (!value4) {
        Po = true;
        Na();
        return;
      }
      const allowed = new Set(So);
      So.clear();
      const preserveLightCache = !Ii;
      Ii = false;
      if (fe() === "all" || allowed.has("all") || !scene.walls.length) {
        Lt({
          preserveLightCache: preserveLightCache,
        });
      } else {
        if (allowed.has("items")) {
          Gg({
            preserveLightCache: preserveLightCache,
          });
        }
        if (allowed.has("lights")) {
          wl({
            preserveLightCache: preserveLightCache,
          });
        }
      }
      const value5 = us;
      us = false;
      _o();
      if (value5 || Vd().length) {
        gl();
      }
      Po = false;
      Na();
    });
  }
}
function pl() {
  if (scene.walls.length) {
    return modelBounds({
      background: null,
      walls: scene.walls,
      items: [],
    });
  } else if (scene.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: scene.items,
    });
  } else {
    return modelBounds(scene);
  }
}
function Lg(value, value2, _2, fn9, value3 = {}) {
  const value4 = fn9(value.start);
  const value5 = fn9(value.end);
  const value6 = value5.x - value4.x;
  const value7 = value5.z - value4.z;
  const value8 = Math.hypot(value6, value7);
  if (value8 <= 1e-7) {
    return null;
  }
  const value9 = {
    x: value6 / value8,
    y: value7 / value8,
  };
  const value10 = {
    x: -value9.y,
    y: value9.x,
  };
  const value11 = value.thickness / 2;
  const value12 =
    value2.start <= 0.000001
      ? value2.start - Math.max(Number(value3.start) || 0, 0)
      : value2.start;
  const value13 =
    value2.end >= value8 - 0.000001
      ? value2.end + Math.max(Number(value3.end) || 0, 0)
      : value2.end;
  const value14 = {
    x: value4.x + value9.x * value12,
    y: value4.z + value9.y * value12,
  };
  const value15 = {
    x: value4.x + value9.x * value13,
    y: value4.z + value9.y * value13,
  };
  return [
    {
      x: value14.x + value10.x * value11,
      y: value14.y + value10.y * value11,
    },
    {
      x: value14.x - value10.x * value11,
      y: value14.y - value10.y * value11,
    },
    {
      x: value15.x - value10.x * value11,
      y: value15.y - value10.y * value11,
    },
    {
      x: value15.x + value10.x * value11,
      y: value15.y + value10.y * value11,
    },
  ];
}
function pr(value, value2) {
  const value3 = new value();
  value2.forEach((value4, value5) => {
    if (value5 === 0) {
      value3.moveTo(value4.x, value4.y);
    } else {
      value3.lineTo(value4.x, value4.y);
    }
  });
  value3.closePath();
  return value3;
}
function Nd(value) {
  const value2 = [];
  const value3 = [];
  for (const loop of value) {
    const area = polygonArea(loop);
    if (area > 0) {
      value2.push({
        loop: loop,
        area: area,
        holes: [],
      });
    } else if (area < 0) {
      value3.push(loop);
    }
  }
  if (!value2.length) {
    for (const value4 of value3.splice(0)) {
      const loop = [...value4].reverse();
      value2.push({
        loop: loop,
        area: Math.abs(polygonArea(loop)),
        holes: [],
      });
    }
  }
  for (const value4 of value3) {
    const value5 = value2
      .filter((value6) => pointInPolygon(value4[0], value6.loop, 0.000001))
      .sort((value6, value7) => value6.area - value7.area)[0];
    if (value5) {
      value5.holes.push(value4);
    }
  }
  return value2.map((value4) => {
    const value5 = pr(THREE.Shape, value4.loop);
    for (const value6 of value4.holes) {
      value5.holes.push(pr(THREE.Path, value6));
    }
    return value5;
  });
}
function Xd(color, opacity, value = {}) {
  const value2 = opacity >= 0.999;
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.72,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.82,
    transmission: value2 ? 0 : 0.012,
    thickness: 0.1,
    ior: 1.22,
    transparent: !value2,
    opacity: opacity,
    depthWrite: value.depthWrite ?? value2,
    depthFunc:
      value.depthFunc ?? (value2 ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: value.polygonOffset === true,
    polygonOffsetFactor: value.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: value.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: value.emissive ?? color,
    emissiveIntensity: value.emissiveIntensity ?? 0.025,
  });
}
function Ig() {
  const value = new THREE.MeshBasicMaterial();
  value.visible = false;
  return value;
}
function _d(value, value2, value3 = {}) {
  const value4 = value2 >= 0.999;
  return new THREE.MeshStandardMaterial({
    color: value3.topColor ?? value,
    roughness: 0.76,
    metalness: 0,
    transparent: !value4,
    opacity: value3.topOpacity ?? (value4 ? 1 : Math.min(value2 * 1.08, 0.42)),
    depthWrite: value3.depthWrite ?? value4,
    depthFunc:
      value3.depthFunc ?? (value4 ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: value3.polygonOffset === true,
    polygonOffsetFactor: value3.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: value3.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: value3.emissive ?? value3.topColor ?? value,
    emissiveIntensity: value3.emissiveIntensity
      ? value3.emissiveIntensity * 0.3
      : 0.08,
  });
}
function Yd(value, value2, value3, value4, value5, value6 = {}) {
  if (!value.length || value3 - value2 <= 0.000001) {
    return;
  }
  const value7 = validatedUnionPolygonLoops(value, 0.000001);
  const value8 = value7.length > 0;
  const value9 = Nd(value8 ? value7 : value);
  const value10 =
    !value8 && value5 < 0.999 && value6.depthWrite === undefined
      ? {
          ...value6,
          depthWrite: true,
          depthFunc: THREE.LessDepth,
        }
      : value6;
  for (const value11 of value9) {
    const value12 = new THREE.ExtrudeGeometry(value11, {
      depth: value3 - value2,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1,
    });
    const value13 = Ig();
    const value14 = Xd(value4, value5, value10);
    const value15 = new THREE.Mesh(value12, [value13, value14]);
    value15.rotation.x = Math.PI / 2;
    value15.position.y = value3;
    const value16 = value5 >= 0.999;
    value15.castShadow = value6.castShadow === true;
    if (value6.lightOccluder) {
      value15.layers.set(kt);
    }
    value15.receiveShadow = value16;
    value15.renderOrder = value6.renderOrder ?? 4;
    B.add(value15);
  }
}
function qd(value, value2, value3, value4, value5 = {}) {
  if (!value.length) {
    return;
  }
  const value6 = validatedUnionPolygonLoops(value, 0.000001);
  const value7 = value6.length > 0;
  const value8 = Nd(value7 ? value6 : value);
  const value9 =
    !value7 && value4 < 0.999 && value5.depthWrite === undefined
      ? {
          ...value5,
          depthWrite: true,
          depthFunc: THREE.LessDepth,
        }
      : value5;
  for (const value10 of value8) {
    const value11 = new THREE.ShapeGeometry(value10, 1);
    const value12 = _d(value3, value4, value9);
    const value13 = new THREE.Mesh(value11, value12);
    value13.rotation.x = Math.PI / 2;
    value13.position.y = value2 + 0.0005;
    value13.castShadow = false;
    value13.receiveShadow = false;
    value13.renderOrder = value5.renderOrder ?? 4;
    B.add(value13);
  }
}
function Tg(value, color, value2) {
  const value3 = [];
  const value4 = [];
  for (let value7 = 0; value7 < value.length; value7 += 1) {
    const value8 = value[value7];
    const value9 = value[(value7 + 1) % value.length];
    const value10 = value9.x - value8.x;
    const value11 = value9.z - value8.z;
    const value12 = Math.hypot(value10, value11);
    if (value12 <= 0.001) {
      continue;
    }
    const value13 = (value8.x + value9.x) / 2;
    const value14 = (value8.z + value9.z) / 2;
    const value15 = -Math.atan2(value11, value10);
    const value16 = new THREE.Matrix4().compose(
      new THREE.Vector3(value13, value2 + 0.021, value14),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        value15,
      ),
      new THREE.Vector3(1, 1, 1),
    );
    const value17 = new THREE.Matrix4().compose(
      new THREE.Vector3(value13, value2 + 0.026, value14),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        value15,
      ),
      new THREE.Vector3(1, 1, 1),
    );
    value3.push(
      new THREE.BoxGeometry(value12, 0.042, 0.038).applyMatrix4(value16),
    );
    value4.push(
      new THREE.BoxGeometry(value12 + 0.025, 0.066, 0.078).applyMatrix4(
        value17,
      ),
    );
  }
  const value5 = value3.length ? mergeGeometries(value3) : null;
  const value6 = value4.length ? mergeGeometries(value4) : null;
  value3.forEach((value7) => value7.dispose());
  value4.forEach((value7) => value7.dispose());
  if (value5) {
    const value7 = new THREE.Mesh(
      value5,
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.82,
        toneMapped: false,
      }),
    );
    value7.renderOrder = 3;
    value7.userData.exportRole = "outline";
    value7.userData.batchedFloorEdgeCount = value.length;
    B.add(value7);
  }
  if (value6) {
    const value7 = new THREE.Mesh(
      value6,
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    value7.renderOrder = 2;
    value7.userData.exportRole = "outline";
    value7.userData.batchedFloorEdgeCount = value.length;
    B.add(value7);
  }
}
function pp(value, value2, value3) {
  if (!Array.isArray(value) || value.length < 3) {
    return;
  }
  const value4 = value.map((value7) => ({
    x: value7.x,
    y: value7.z,
  }));
  const value5 = value4.map((value7, value8) =>
    distance(value7, value4[(value8 + 1) % value4.length]),
  );
  const value6 = [0];
  for (const value7 of value5) {
    value6.push(value6.at(-1) + value7);
  }
  const fn9 = ({
    distance: value7,
    innerAlpha: value8,
    outerAlpha: value9,
    columnStrength: value10,
    y: value11,
    renderOrder: value12,
  }) => {
    const value13 = ml(value4, value7);
    const value14 = [];
    const value15 = [];
    const value16 = [];
    const value17 = [];
    for (let value20 = 0; value20 < value4.length; value20 += 1) {
      const value21 = (value20 + 1) % value4.length;
      const value22 = value4[value20];
      const value23 = value4[value21];
      const value24 = value13[value20];
      const value25 = value13[value21];
      value14.push(
        value22.x,
        value11,
        value22.y,
        value24.x,
        value11,
        value24.y,
        value25.x,
        value11,
        value25.y,
        value22.x,
        value11,
        value22.y,
        value25.x,
        value11,
        value25.y,
        value23.x,
        value11,
        value23.y,
      );
      value15.push(value8, value9, value9, value8, value9, value8);
      value16.push(0, 1, 1, 0, 1, 0);
      const value26 = value6[value20];
      const value27 = value6[value20 + 1];
      value17.push(value26, value26, value27, value26, value27, value27);
    }
    const value18 = new THREE.BufferGeometry();
    value18.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(value14, 3),
    );
    value18.setAttribute(
      "glowAlpha",
      new THREE.Float32BufferAttribute(value15, 1),
    );
    value18.setAttribute(
      "glowAcross",
      new THREE.Float32BufferAttribute(value16, 1),
    );
    value18.setAttribute(
      "glowAlong",
      new THREE.Float32BufferAttribute(value17, 1),
    );
    value18.computeVertexNormals();
    const value19 = new THREE.Mesh(
      value18,
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: {
            value: new THREE.Color(value2),
          },
          glowColumnStrength: {
            value: value10,
          },
        },
        vertexShader:
          "\n          attribute float glowAlpha;\n          attribute float glowAcross;\n          attribute float glowAlong;\n          varying float vGlowAlpha;\n          varying float vGlowAcross;\n          varying float vGlowAlong;\n          void main() {\n            vGlowAlpha = glowAlpha;\n            vGlowAcross = glowAcross;\n            vGlowAlong = glowAlong;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n          }\n        ",
        fragmentShader:
          "\n          uniform vec3 glowColor;\n          uniform float glowColumnStrength;\n          varying float vGlowAlpha;\n          varying float vGlowAcross;\n          varying float vGlowAlong;\n          void main() {\n            float columnA = 0.5 + 0.5 * sin(vGlowAlong * 4.7 + 0.6);\n            float columnB = 0.5 + 0.5 * sin(vGlowAlong * 9.3 + 2.1);\n            float broadColumns = clamp(0.46 + columnA * 0.34 + columnB * 0.2, 0.0, 1.0);\n            float distanceMix = smoothstep(0.16, 0.88, vGlowAcross);\n            float reflection = mix(1.0, 0.48 + broadColumns * 0.52, glowColumnStrength * distanceMix);\n            gl_FragColor = vec4(glowColor, vGlowAlpha * reflection);\n          }\n        ",
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    value19.renderOrder = value12;
    B.add(value19);
  };
  fn9({
    distance: 0.24,
    innerAlpha: 0.4,
    outerAlpha: 0.055,
    columnStrength: 0,
    y: value3 + 0.008,
    renderOrder: 3,
  });
  fn9({
    distance: 1.25,
    innerAlpha: 0.3,
    outerAlpha: 0.008,
    columnStrength: 0.82,
    y: value3 + 0.005,
    renderOrder: 2,
  });
}
function ml(value, value2) {
  const value3 = value.reduce(
    (value4, value5) => ({
      x: value4.x + value5.x / value.length,
      y: value4.y + value5.y / value.length,
    }),
    {
      x: 0,
      y: 0,
    },
  );
  return value.map((value4) => {
    const value5 = value4.x - value3.x;
    const value6 = value4.y - value3.y;
    const count = Math.max(Math.hypot(value5, value6), 0.000001);
    return {
      x: value4.x + (value5 / count) * value2,
      y: value4.y + (value6 / count) * value2,
    };
  });
}
function Cg(value, value2) {
  if (!value.length) {
    return;
  }
  const value3 = value.map((value7) => {
    const value8 = ml(value7, 0.028);
    const value9 = polygonArea(value8) >= 0 ? value8 : [...value8].reverse();
    return pr(THREE.Shape, value9);
  });
  const value4 = value3.map((value7) => {
    const value8 = new THREE.ShapeGeometry(value7, 1);
    value8.rotateX(Math.PI / 2);
    value8.translate(0, value2, 0);
    return value8;
  });
  const value5 = mergeGeometries(value4);
  value4.forEach((value7) => value7.dispose());
  if (!value5) {
    return;
  }
  const value6 = new THREE.Mesh(
    value5,
    new THREE.MeshBasicMaterial({
      color: 527122,
      transparent: true,
      opacity: 0.052,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  value6.renderOrder = 1;
  value6.userData.batchedWallContactShadowCount = value3.length;
  B.add(value6);
}
function kg(value, value2, value3) {
  const count = Math.max(Math.round(value / 1.25), 12);
  const value4 = new THREE.GridHelper(value, count, value2.grid, value2.grid);
  const value5 = new THREE.Vector3();
  value4.material.transparent = true;
  value4.material.opacity = 0.24;
  value4.material.depthWrite = false;
  value4.material.toneMapped = false;
  value4.material.onBeforeCompile = (value6) => {
    value6.uniforms.gridFadeNear = {
      value: value * 0.18,
    };
    value6.uniforms.gridFadeFar = {
      value: value * 0.46,
    };
    value6.uniforms.gridDepthFadeNear = {
      value: value * 0.18,
    };
    value6.uniforms.gridDepthFadeFar = {
      value: value * 0.36,
    };
    value6.vertexShader = value6.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;",
      )
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvGridLocalPosition = position.xz;\nvGridViewDepth = max(-mvPosition.z, 0.0);",
      );
    value6.fragmentShader = value6.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float gridFadeNear;\nuniform float gridFadeFar;\nuniform float gridDepthFadeNear;\nuniform float gridDepthFadeFar;\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;",
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "vec4 diffuseColor = vec4( diffuse, opacity );\nfloat radialFade = 1.0 - smoothstep(gridFadeNear, gridFadeFar, length(vGridLocalPosition));\nfloat depthFade = 1.0 - smoothstep(gridDepthFadeNear, gridDepthFadeFar, vGridViewDepth);\ndiffuseColor.a *= radialFade * mix(0.28, 1.0, depthFade);",
      );
    value4.material.userData.depthFadeShader = value6;
  };
  value4.onBeforeRender = (_2, _3, value6) => {
    const depthFadeShader = value4.material.userData.depthFadeShader;
    if (!depthFadeShader) {
      return;
    }
    value4.getWorldPosition(value5);
    const count2 = Math.max(value6.position.distanceTo(Q?.target || value5), 1);
    const value7 = value6.isOrthographicCamera
      ? Math.abs(value6.top - value6.bottom) / Math.max(value6.zoom, 0.001)
      : count2 * 2 * Math.tan(THREE.MathUtils.degToRad(value6.fov * 0.5));
    const count3 = Math.max(
      Math.hypot(value7 * Math.max(value6.aspect, 0.1), value7),
      2,
    );
    const value8 = count2 + count3 * 0.2;
    depthFadeShader.uniforms.gridDepthFadeNear.value = value8;
    depthFadeShader.uniforms.gridDepthFadeFar.value = Math.max(
      value8 + 1,
      count2 + count3 * 0.85,
    );
  };
  value4.position.y = value3 + 0.012;
  value4.renderOrder = 2;
  value4.userData.exportRole = "grid";
  B.add(value4);
}
function Rg(value, value2) {
  if (!Array.isArray(value) || value.length < 3) {
    return;
  }
  const value3 = value.map((value4) => ({
    x: value4.x,
    y: value4.z,
  }));
  [
    {
      spread: 0.035,
      offsetX: 0.13,
      offsetY: -0.1,
      opacity: 0.12,
    },
    {
      spread: 0.13,
      offsetX: 0.18,
      offsetY: -0.14,
      opacity: 0.055,
    },
    {
      spread: 0.3,
      offsetX: 0.24,
      offsetY: -0.19,
      opacity: 0.018,
    },
  ].forEach((value4, value5) => {
    const value6 = ml(value3, value4.spread).map((value9) => ({
      x: value9.x + value4.offsetX,
      y: value9.y + value4.offsetY,
    }));
    const value7 = pr(THREE.Shape, value6);
    const value8 = new THREE.Mesh(
      new THREE.ShapeGeometry(value7, 1),
      new THREE.MeshBasicMaterial({
        color: 329482,
        transparent: true,
        opacity: value4.opacity,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    value8.rotation.x = Math.PI / 2;
    value8.position.y = value2 + 0.001 + value5 * 0.00015;
    value8.renderOrder = 1 + value5;
    B.add(value8);
  });
}
function Ud({ preserveLightCache = false } = {}) {
  if (!B) {
    return;
  }
  io();
  kd();
  nt({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
  const value = pixelsPerMeter();
  if (!value) {
    return;
  }
  const value2 = ao();
  const value3 = pl();
  const value4 = Ia?.x ?? (value3.minX + value3.maxX) / 2;
  const value5 = Ia?.y ?? (value3.minY + value3.maxY) / 2;
  const fn9 = (value18) => ({
    x: (value18.x - value4) / value,
    z: (value18.y - value5) / value,
  });
  const count = Math.max(value3.width / value + 1, 3);
  const count2 = Math.max(value3.height / value + 1, 3);
  const value6 = -0.008;
  const depth = 0.16;
  const value7 = value6 - depth;
  const value8 = value7 - 0.035;
  const count3 = Math.max(Math.max(count, count2) * 16, 260);
  const value9 = new THREE.Mesh(
    new THREE.PlaneGeometry(count3, count3),
    new THREE.MeshBasicMaterial({
      color: value2.ground,
      toneMapped: false,
    }),
  );
  value9.rotation.x = -Math.PI / 2;
  value9.position.y = value8;
  value9.receiveShadow = false;
  value9.userData.exportRole = "background";
  B.add(value9);
  kg(count3, value2, value8);
  const value10 = new THREE.MeshStandardMaterial({
    color: value2.floor,
    roughness: 0.96,
    metalness: 0,
    emissive: value2.floor,
    emissiveIntensity: 0.025,
  });
  const value11 = Bs(value);
  const fn10 = (value18) => {
    Rg(value18, value8);
    if (scene.settings.floorEdgeVisible !== false) {
      Tg(value18, value2.floorEdge, value7);
    }
  };
  const fn11 = (value18, value19, value20) => {
    const value21 = new THREE.Mesh(value19, value10);
    value21.rotation.x = value20 ? Math.PI / 2 : 0;
    value21.position.y = value20 ? value6 : value6 - depth / 2;
    value21.castShadow = false;
    value21.receiveShadow = true;
    value21.userData.exportRole = "plan";
    B.add(value21);
    fn10(value18);
  };
  if (value11.length) {
    const value18 = value11.map((value20) => value20.map(fn9));
    const value19 = value18.map((value20) => {
      const value21 = new THREE.Shape();
      value20.forEach((value22, value23) => {
        if (value23 === 0) {
          value21.moveTo(value22.x, value22.z);
        } else {
          value21.lineTo(value22.x, value22.z);
        }
      });
      value21.closePath();
      return value21;
    });
    fn11(
      value18[0],
      new THREE.ExtrudeGeometry(value19, {
        depth: depth,
        bevelEnabled: false,
        steps: 1,
      }),
      true,
    );
    for (const value20 of value18.slice(1)) {
      fn10(value20);
    }
  } else {
    const value18 = [
      {
        x: -count / 2,
        z: -count2 / 2,
      },
      {
        x: count / 2,
        z: -count2 / 2,
      },
      {
        x: count / 2,
        z: count2 / 2,
      },
      {
        x: -count / 2,
        z: count2 / 2,
      },
    ];
    fn11(value18, new THREE.BoxGeometry(count, depth, count2), false);
  }
  const value12 = [
    ...scene.windows,
    ...scene.doors.map((value18) => ({
      ...value18,
      sill: 0,
    })),
    ...scene.railings.map((value18) => {
      const value19 = scene.walls.find(
        (value20) => value20.id === value18.wallId,
      );
      return {
        ...value18,
        sill: 0,
        height: value19?.height || scene.settings.wallHeight,
      };
    }),
  ];
  const value13 = [];
  const allowed = new Set();
  const value14 = Ku(value);
  for (const value18 of scene.walls) {
    const opacity =
      value18.opacity === null || value18.opacity === undefined
        ? scene.settings.wallOpacity
        : clamp(finite(value18.opacity, scene.settings.wallOpacity), 0, 1);
    for (const value19 of wallSolidPieces(
      value18,
      value12,
      value,
      value18.height,
    )) {
      const footprint = Lg(value18, value19, value, fn9, value14[value18.id]);
      if (!footprint) {
        continue;
      }
      const value20 = [
        canonicalPolygonKey(footprint, 4),
        value19.bottom.toFixed(5),
        value19.top.toFixed(5),
        opacity.toFixed(4),
      ].join("|");
      if (!allowed.has(value20)) {
        allowed.add(value20);
        value13.push({
          wallId: value18.id,
          footprint: footprint,
          bottom: value19.bottom,
          top: value19.top,
          opacity: opacity,
        });
      }
    }
  }
  const value15 = [
    ...new Set(
      value13
        .flatMap((value18) => [value18.bottom, value18.top])
        .map((value18) => value18.toFixed(6)),
    ),
  ]
    .map(Number)
    .sort((value18, value19) => value18 - value19);
  Cg(
    value13
      .filter((value18) => value18.bottom <= 0.000001)
      .map((value18) => value18.footprint),
    value6 + 0.0025,
  );
  for (let value18 = 0; value18 < value15.length - 1; value18 += 1) {
    const value19 = value15[value18];
    const value20 = value15[value18 + 1];
    if (value20 - value19 <= 0.000001) {
      continue;
    }
    const value21 = (value19 + value20) / 2;
    const value22 = value13.filter(
      (value25) =>
        value21 > value25.bottom - 0.000001 && value21 < value25.top + 0.000001,
    );
    const index = new Map();
    for (const value25 of value22) {
      const value26 = value25.opacity.toFixed(4);
      if (!index.has(value26)) {
        index.set(value26, {
          opacity: value25.opacity,
          volumes: [],
        });
      }
      index.get(value26).volumes.push(value25);
    }
    for (const value25 of index.values()) {
      Yd(
        value25.volumes.map((value27) => value27.footprint),
        value19,
        value20,
        value2.wall,
        value25.opacity,
        {
          castShadow: true,
          lightOccluder: true,
        },
      );
      const value26 = value25.volumes
        .filter((value27) => Math.abs(value27.top - value20) <= 0.000001)
        .map((value27) => value27.footprint);
      qd(value26, value20, value2.wall, value25.opacity, {
        topColor: value2.wall,
      });
    }
    const value24 = value22
      .filter((value25) => We("wall", value25.wallId))
      .map((value25) => value25.footprint);
    if (value24.length) {
      Yd(value24, value19, value20, value2.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value2.accent,
        emissiveIntensity: 0.12,
        renderOrder: 5,
      });
      const value25 = value22
        .filter(
          (value26) =>
            We("wall", value26.wallId) &&
            Math.abs(value26.top - value20) <= 0.000001,
        )
        .map((value26) => value26.footprint);
      qd(value25, value20, value2.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value2.accent,
        emissiveIntensity: 0.12,
        topOpacity: 0.12,
        renderOrder: 6,
      });
    }
  }
  for (const value18 of scene.walls) {
    const value19 = value18.end.x - value18.start.x;
    const value20 = value18.end.y - value18.start.y;
    const value21 = Math.hypot(value19, value20);
    if (!value21) {
      continue;
    }
    const value22 = {
      x: value19 / value21,
      y: value20 / value21,
    };
    const value23 = -Math.atan2(value20, value19);
    for (const value24 of scene.windows.filter(
      (value25) => value25.wallId === value18.id,
    )) {
      const value25 = clampWindowT(value18, value24, value);
      const value26 = {
        x: value18.start.x + value19 * value25,
        y: value18.start.y + value20 * value25,
      };
      const value27 = fn9(value26);
      const value28 = new THREE.Group();
      value28.position.set(value27.x, 0, value27.z);
      value28.rotation.y = value23;
      const value29 = Math.min(value24.width, wallLengthMeters(value18, value));
      const value30 = Math.min(
        value24.height,
        Math.max(value18.height - value24.sill, 0.2),
      );
      Ve(
        value28,
        [
          [
            value29 * 0.94,
            value30 * 0.92,
            0.025,
            0,
            value24.sill + value30 / 2,
            0,
          ],
        ],
        value2.glass,
        {
          rounded: false,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
          side: THREE.DoubleSide,
          roughness: 0.08,
          metalness: 0.04,
          castShadow: false,
          renderOrder: 6,
        },
      );
      const value31 = We("window", value24.id) ? value2.accent : value2.frame;
      const value32 = 0.045;
      const value33 = {
        rounded: false,
        metalness: 0.15,
        castShadow: false,
        receiveShadow: false,
      };
      const value34 = [
        [value29, value32, 0.06, 0, value24.sill, 0],
        [value29, value32, 0.06, 0, value24.sill + value30, 0],
        [value32, value30, 0.06, -value29 / 2, value24.sill + value30 / 2, 0],
        [value32, value30, 0.06, value29 / 2, value24.sill + value30 / 2, 0],
      ];
      const value35 = value24.hasDivider !== false && value29 > 1.2;
      if (value35) {
        value34.push([
          value32 * 0.7,
          value30,
          0.055,
          0,
          value24.sill + value30 / 2,
          0,
        ]);
      }
      Ve(value28, value34, value31, value33);
      value28.userData.optimizationStats = {
        type: value35 ? "window-divided" : "window-plain",
        before: value35 ? 6 : 5,
        after: 2,
      };
      B.add(value28);
    }
    for (const value24 of scene.railings.filter(
      (value25) => value25.wallId === value18.id,
    )) {
      const value25 = clampWindowT(value18, value24, value);
      const value26 = {
        x: value18.start.x + value19 * value25,
        y: value18.start.y + value20 * value25,
      };
      const value27 = fn9(value26);
      const value28 = new THREE.Group();
      value28.position.set(value27.x, 0, value27.z);
      value28.rotation.y = value23;
      const value29 = Math.min(value24.width, wallLengthMeters(value18, value));
      const value30 = Math.min(value24.height, value18.height);
      const value31 = We("railing", value24.id) ? value2.accent : value2.frame;
      const value32 = Math.min(Math.max(value29 * 0.012, 0.028), 0.05);
      const value33 = 0.08;
      const count4 = Math.max(value30 - value33 - value32 * 1.4, 0.2);
      Ve(
        value28,
        [
          [
            Math.max(value29 - value32 * 2.4, 0.2),
            count4,
            0.018,
            0,
            value33 + count4 * 0.5,
            0,
          ],
        ],
        value2.glass,
        {
          rounded: false,
          transparent: true,
          opacity: 0.24,
          depthWrite: false,
          side: THREE.DoubleSide,
          metalness: 0.04,
          roughness: 0.08,
          castShadow: false,
          receiveShadow: false,
          renderOrder: 6,
        },
      );
      const value34 = {
        rounded: false,
        metalness: 0.58,
        roughness: 0.24,
        castShadow: false,
        receiveShadow: false,
      };
      const count5 = Math.max(2, Math.min(16, Math.ceil(value29 / 1.5) + 1));
      const value35 = [[value29, value32, 0.055, 0, value30, 0]];
      const value36 = [];
      for (let value37 = 0; value37 < count5; value37 += 1) {
        const value38 = -value29 / 2 + (value29 * value37) / (count5 - 1);
        value35.push([value32, value30, 0.055, value38, value30 * 0.5, 0]);
        value36.push([
          value32 * 2,
          value32 * 0.8,
          0.08,
          value38,
          value32 * 0.4,
          0,
        ]);
      }
      Ve(value28, value35, value31, value34);
      Ve(value28, value36, value2.furnitureSoft, value34);
      value28.userData.optimizationStats = {
        type: "glass-railing",
        before: 2 + count5 * 2,
        after: 3,
      };
      B.add(value28);
    }
    for (const value24 of scene.doors.filter(
      (value25) => value25.wallId === value18.id,
    )) {
      const value25 = clampWindowT(value18, value24, value);
      const value26 = {
        x: value18.start.x + value19 * value25,
        y: value18.start.y + value20 * value25,
      };
      const value27 = fn9(value26);
      const value28 = new THREE.Group();
      value28.position.set(value27.x, 0, value27.z);
      value28.rotation.y = value23;
      const value29 = Math.min(value24.width, wallLengthMeters(value18, value));
      const value30 = Math.min(value24.height, value18.height);
      const value31 = We("door", value24.id);
      const value32 = value24.doorType || "solid";
      const value33 = value31 ? value2.accent : value2.frame;
      const value34 = 0.065;
      const value35 = {
        rounded: false,
        metalness: 0.08,
        castShadow: false,
        receiveShadow: false,
      };
      const value36 = [
        [value34, value30, 0.09, -value29 / 2, value30 / 2, 0],
        [value34, value30, 0.09, value29 / 2, value30 / 2, 0],
        [value29 + value34, value34, 0.09, 0, value30, 0],
      ];
      if (value32 === "roller-shutter") {
        const value40 = value24.swing === -1 ? -1 : 1;
        value36.push([
          value29 + value34 * 0.6,
          value34 * 1.8,
          0.13,
          0,
          value30 - value34 * 0.35,
          value40 * 0.04,
        ]);
      }
      Ve(value28, value36, value33, value35);
      if (value32 === "frame-only") {
        value28.userData.optimizationStats = {
          type: "door-frame-only",
          before: 3,
          after: 1,
        };
        B.add(value28);
        continue;
      }
      if (value32 === "sliding-glass") {
        const height2 = Math.max(value30 - value34 * 0.85, 0.4);
        const width2 = Math.max(value29 * 0.54, 0.28);
        const value40 = value24.hinge === "right" ? 1 : -1;
        const value41 = slidingDoorPanelCenters(value29, value40);
        $d(
          value28,
          [
            {
              width: width2,
              height: height2,
              centerX: value41.fixed,
              centerZ: -0.024,
            },
            {
              width: width2,
              height: height2,
              centerX: value41.moving,
              centerZ: 0.024,
            },
          ],
          value33,
          value2.glass,
        );
        const value42 = value41.moving - value40 * width2 * 0.36;
        Ve(
          value28,
          [
            [0.026, 0.15, 0.055, value42, value30 * 0.52, -0.052],
            [0.026, 0.15, 0.055, value42, value30 * 0.52, 0.052],
          ],
          value2.furnitureDark,
          {
            rounded: false,
            metalness: 0.5,
            castShadow: false,
            receiveShadow: false,
          },
        );
        value28.userData.optimizationStats = {
          type: "door-sliding-glass",
          before: 15,
          after: 5,
        };
        B.add(value28);
        continue;
      }
      if (value32 === "roller-shutter") {
        const count4 = Math.max(value29 - value34 * 1.3, 0.4);
        const count5 = Math.max(value30 - value34 * 0.85, 0.8);
        const value40 = value24.swing === -1 ? -1 : 1;
        Ve(
          value28,
          [[count4, count5, 0.045, 0, count5 * 0.5, value40 * 0.04]],
          value31 ? value2.accent : value2.furnitureSoft,
          {
            rounded: false,
            metalness: 0.36,
            roughness: 0.42,
            castShadow: false,
            receiveShadow: false,
          },
        );
        const count6 = Math.max(5, Math.min(36, Math.round(count5 / 0.12)));
        const value41 = [];
        for (let value42 = 1; value42 < count6; value42 += 1) {
          const value43 = (count5 * value42) / count6;
          value41.push([
            count4 * 0.98,
            0.012,
            0.052,
            0,
            value43,
            value40 * 0.052,
          ]);
        }
        Ve(value28, value41, value2.furnitureDark, {
          rounded: false,
          metalness: 0.42,
          roughness: 0.34,
          castShadow: false,
          receiveShadow: false,
        });
        value28.userData.optimizationStats = {
          type: "door-roller-shutter",
          before: 5 + count6,
          after: 3,
        };
        B.add(value28);
        continue;
      }
      if (value32 === "entry") {
        const count4 = Math.max(value29 - value34 * 1.5, 0.4);
        const count5 = Math.max(value30 - value34 * 0.85, 0.8);
        const value40 = value31 ? value2.accent : value2.furnitureDark;
        Ve(value28, [[count4, count5, 0.065, 0, count5 * 0.5, 0]], value40, {
          rounded: false,
          roughness: 0.58,
          metalness: 0.1,
          castShadow: false,
          receiveShadow: false,
        });
        Ve(
          value28,
          [
            [count4 * 0.76, 0.022, 0.078, 0, value30 * 0.68, 0.012],
            [count4 * 0.76, 0.022, 0.078, 0, value30 * 0.34, 0.012],
          ],
          value2.furnitureSoft,
          {
            rounded: false,
            roughness: 0.5,
            castShadow: false,
            receiveShadow: false,
          },
        );
        const value41 =
          value24.hinge === "right" ? -count4 * 0.34 : count4 * 0.34;
        Ve(
          value28,
          [[0.035, 0.18, 0.085, value41, value30 * 0.5, 0.055]],
          value2.furnitureLight,
          {
            rounded: false,
            metalness: 0.58,
            roughness: 0.24,
            castShadow: false,
            receiveShadow: false,
          },
        );
        value28.userData.optimizationStats = {
          type: "door-entry",
          before: 7,
          after: 4,
        };
        B.add(value28);
        continue;
      }
      if (value32 === "double") {
        const width2 = Math.max((value29 - value34 * 1.8) / 2, 0.25);
        const height2 = Math.max(value30 - value34 * 0.8, 0.4);
        const value40 = (value24.swing === -1 ? 1 : -1) * Math.PI * 0.42;
        const value41 = [];
        const value42 = [];
        for (const value43 of [-1, 1]) {
          const value44 = value43 * (value29 / 2 - value34 * 0.5);
          const rotationY = value43 < 0 ? value40 : -value40;
          const value45 = value43 < 0 ? width2 / 2 : -width2 / 2;
          const value46 = {
            x: value44 + value45 * Math.cos(rotationY),
            z: -value45 * Math.sin(rotationY),
          };
          value41.push({
            width: width2,
            height: height2,
            depth: 0.04,
            x: value46.x,
            y: height2 / 2,
            z: value46.z,
            rotationY: rotationY,
          });
          const value47 = value43 < 0 ? width2 * 0.42 : -width2 * 0.42;
          value42.push({
            width: 0.035,
            height: 0.055,
            depth: 0.065,
            x:
              value44 +
              value47 * Math.cos(rotationY) +
              Math.sin(rotationY) * 0.04,
            y: value30 * 0.5,
            z: -value47 * Math.sin(rotationY) + Math.cos(rotationY) * 0.04,
            rotationY: rotationY,
          });
        }
        Ve(value28, value41, value31 ? value2.accent : value2.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false,
        });
        Ve(value28, value42, value2.furnitureDark, {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false,
        });
        value28.userData.optimizationStats = {
          type: "door-double",
          before: 7,
          after: 3,
        };
        B.add(value28);
        continue;
      }
      const value37 = value24.hinge === "right";
      const width = Math.max(value29 - value34 * 1.4, 0.2);
      const height = Math.max(value30 - value34 * 0.8, 0.4);
      const value38 = new THREE.Group();
      value38.position.x = value37
        ? value29 / 2 - value34 * 0.5
        : -value29 / 2 + value34 * 0.5;
      value38.rotation.y = doorLeafRotation(value24, Math.PI * 0.42);
      value28.add(value38);
      const centerX = value37 ? -width / 2 : width / 2;
      if (value32 === "glass") {
        $d(
          value38,
          [
            {
              width: width,
              height: height,
              centerX: centerX,
              centerZ: 0,
            },
          ],
          value33,
          value2.glass,
        );
      } else {
        Ve(
          value38,
          [[width, height, 0.04, centerX, height / 2, 0]],
          value31 ? value2.accent : value2.doorLeaf,
          {
            rounded: false,
            roughness: 0.66,
            castShadow: false,
            receiveShadow: false,
          },
        );
      }
      const value39 = value37 ? -width * 0.42 : width * 0.42;
      Ve(
        value38,
        [[0.035, 0.055, 0.065, value39, value30 * 0.5, 0.04]],
        value2.furnitureDark,
        {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false,
        },
      );
      value28.userData.optimizationStats = {
        type: value32 === "glass" ? "door-glass" : "door-solid",
        before: value32 === "glass" ? 9 : 5,
        after: value32 === "glass" ? 4 : 3,
      };
      B.add(value28);
    }
  }
  const value16 = zd();
  const value17 = [];
  for (const item of scene.items) {
    const value18 = fn9(item);
    const group = ul(item, value16);
    group.position.set(value18.x, item.elevation || 0, value18.z);
    Wd(group, item);
    group.userData.modelLayer = re.has(item.type) ? "lights" : "items";
    group.userData.exportRole = item.type === "planlabel" ? "label" : "plan";
    B.add(group);
    if (!re.has(item.type)) {
      value17.push({
        item: item,
        group: group,
      });
    }
  }
  fl(B, value17);
  Hd(B, value17);
  B.traverse((value18) => {
    if (value18 !== B && !value18.userData.exportRole) {
      value18.userData.exportRole = "plan";
    }
  });
  On(B, {
    rebuildAtlas: !preserveLightCache,
  });
}
function fe() {
  if (T?.previewFloorMode === "all" && T.floors.length > 1) {
    return "all";
  } else {
    return "active";
  }
}
function Yo() {
  const value = fe();
  const value2 = (T?.floors.length || 0) > 1;
  for (const element of Yl) {
    const value3 = element.dataset.previewFloor === value;
    element.classList.toggle("active", value3);
    element.setAttribute("aria-pressed", String(value3));
    element.disabled = element.dataset.previewFloor === "all" && !value2;
  }
}
function Dg(value, { persist: value2 = true } = {}) {
  if (T) {
    T.previewFloorMode =
      value === "all" && T.floors.length > 1 ? "all" : "active";
    Yo();
    zn();
    Wt(Pt(), {
      preserveView: false,
    });
    Promise.allSettled(gc());
    Lt();
    pn();
    if (value2) {
      V();
    }
  }
}
function Lt({ preserveLightCache = false } = {}) {
  if (!B) {
    return;
  }
  if (fe() !== "all") {
    Ud({
      preserveLightCache: preserveLightCache,
    });
    Qd();
    return;
  }
  const value = B;
  const value2 = scene;
  const value3 = xe;
  const value4 = Ia;
  io();
  kd();
  nt({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
  const value5 = [...T.floors].sort(
    (value7, value8) => value7.elevation - value8.elevation,
  );
  const value6 = W ? finite(T.exportFloorGap, 3) : finite(T.previewFloorGap, 3);
  value5.forEach((value7, value8) => {
    const value9 = new THREE.Group();
    value9.name = "floor-" + value7.id;
    value9.userData.floorId = value7.id;
    B = value9;
    scene = value7.scene;
    xe = value7.id;
    Ia = {
      x: finite(value7.originX, 0),
      y: finite(value7.originY, 0),
    };
    Ud({
      preserveLightCache: preserveLightCache,
    });
    if (value8 > 0) {
      for (const value10 of [...value9.children]) {
        if (["background", "grid"].includes(value10.userData?.exportRole)) {
          value9.remove(value10);
          Bn(value10);
        }
      }
    }
    value9.position.set(
      finite(value7.offsetX, 0),
      value8 * value6,
      finite(value7.offsetZ, 0),
    );
    value9.rotation.y = -THREE.MathUtils.degToRad(finite(value7.rotation, 0));
    value.add(value9);
  });
  B = value;
  scene = value2;
  xe = value3;
  Ia = value4;
  On(B, {
    rebuildAtlas: !preserveLightCache,
  });
  Qd();
  nt({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
}
function Fg() {
  const ppm = pixelsPerMeter();
  if (!ppm) {
    return null;
  }
  const value = pl();
  const value2 = (value.minX + value.maxX) / 2;
  const value3 = (value.minY + value.maxY) / 2;
  return {
    ppm: ppm,
    floorSurfaceY: -0.008,
    floorPolygons: Bs(ppm),
    toWorld: (toWorld) => ({
      x: (toWorld.x - value2) / ppm,
      z: (toWorld.y - value3) / ppm,
    }),
  };
}
function Ag(value) {
  if (B) {
    for (const value2 of [...B.children]) {
      if (value2.userData.modelLayer === value) {
        B.remove(value2);
        Bn(value2);
      }
    }
  }
}
function Zd(value, { preserveLightCache = false } = {}) {
  if (!B) {
    return;
  }
  const value2 = Fg();
  if (!value2) {
    return;
  }
  Ag(value);
  const value3 = value === "lights";
  const value4 = value3 ? zd() : null;
  const value5 = [];
  for (const item of scene.items) {
    if (re.has(item.type) !== value3) {
      continue;
    }
    const value6 = value2.toWorld(item);
    const group = ul(item, value4);
    group.position.set(value6.x, item.elevation || 0, value6.z);
    Wd(group, item);
    group.userData.modelLayer = value;
    B.add(group);
    if (!value3) {
      value5.push({
        item: item,
        group: group,
      });
    }
  }
  if (!value3) {
    fl(B, value5);
    Hd(B, value5);
  }
  On(B, {
    rebuildAtlas: !preserveLightCache,
  });
  if (value3) {
    He();
  }
  nt({
    shadows: !value3 && !preserveLightCache,
    preserveLightCache: preserveLightCache,
  });
}
function Gg(value = {}) {
  Zd("items", value);
}
function wl(value = {}) {
  Zd("lights", value);
}
function $g(value, value2) {
  for (let value3 = value; value3 && value3 !== B; value3 = value3.parent) {
    if (value2.has(value3.userData?.modelLayer)) {
      return true;
    }
  }
  return false;
}
function Kd({ excludeModelLayers: value = null } = {}) {
  const value2 = new THREE.Box3();
  B.updateWorldMatrix(true, true);
  B.traverse((value3) => {
    if (
      !!value3.isMesh &&
      !["background", "grid", "light-source-preview"].includes(
        value3.userData?.exportRole,
      ) &&
      (!value || !$g(value3, value))
    ) {
      if (value3.isInstancedMesh) {
        value3.computeBoundingBox();
        if (value3.boundingBox) {
          value2.union(
            value3.boundingBox.clone().applyMatrix4(value3.matrixWorld),
          );
        }
        return;
      }
      value3.geometry.computeBoundingBox();
      if (value3.geometry.boundingBox) {
        value2.union(
          value3.geometry.boundingBox.clone().applyMatrix4(value3.matrixWorld),
        );
      }
    }
  });
  return value2;
}
function Qd() {
  if (!Lo || !se?.shadow?.camera || !B) {
    return false;
  }
  const value = Kd();
  if (value.isEmpty()) {
    return false;
  }
  B.updateWorldMatrix(true, true);
  se.updateWorldMatrix(true, false);
  se.target.updateWorldMatrix(true, false);
  const camera = se.shadow.camera;
  const value2 = new THREE.Vector3().setFromMatrixPosition(se.matrixWorld);
  const value3 = new THREE.Vector3().setFromMatrixPosition(
    se.target.matrixWorld,
  );
  camera.position.copy(value2);
  camera.lookAt(value3);
  camera.updateMatrixWorld(true);
  const value4 = new THREE.Vector3(Infinity, Infinity, Infinity);
  const value5 = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const value8 of [value.min.x, value.max.x]) {
    for (const value9 of [value.min.y, value.max.y]) {
      for (const value10 of [value.min.z, value.max.z]) {
        const value11 = new THREE.Vector3(value8, value9, value10).applyMatrix4(
          camera.matrixWorldInverse,
        );
        value4.min(value11);
        value5.max(value11);
      }
    }
  }
  const count = Math.max(value5.x - value4.x, value5.y - value4.y, 1);
  const count2 = Math.max(dc, count * 0.05);
  const value6 = -value5.z;
  const value7 = -value4.z;
  const count3 = Math.max(dc, (value7 - value6) * 0.08);
  camera.left = value4.x - count2;
  camera.right = value5.x + count2;
  camera.bottom = value4.y - count2;
  camera.top = value5.y + count2;
  camera.near = Math.max(0.1, value6 - count3);
  camera.far = Math.max(camera.near + 1, value7 + count3);
  camera.updateProjectionMatrix();
  se.shadow.needsUpdate = true;
  return true;
}
function pn(value = {}) {
  if (!camera || !Q) {
    return;
  }
  const value2 =
    value.view === "top" ? "top" : value.view === "free" ? "free" : gt();
  const value3 = en();
  const value4 = fe() === "all";
  const value5 = pixelsPerMeter() || 100;
  const value6 = pl();
  const value7 = Kd({
    excludeModelLayers: new Set(["items", "lights"]),
  });
  const value8 =
    value4 && !value7.isEmpty() ? value7.getSize(new THREE.Vector3()) : null;
  const value9 = value7.isEmpty()
    ? null
    : value7.getCenter(new THREE.Vector3());
  const value10 =
    value4 && value8
      ? clamp(Math.max(value8.x, value8.z), 5, 100)
      : clamp(Math.max(value6.width, value6.height) / value5, 5, 35);
  const value11 =
    value4 && value8
      ? value8.y
      : Math.max(0, ...scene.walls.map((value14) => value14.height || 0));
  const count = Math.max(value10 * 1.18, value10 + value11 * 0.32);
  camera.userData.frameSize = count;
  camera.userData.cameraView = value2;
  camera.userData.topRotation = value3;
  const value12 = value9
    ? new THREE.Vector3(value9.x, value9.y, value9.z)
    : new THREE.Vector3(0, Math.min(0.78, value10 * 0.055), 0);
  let value13;
  if (camera.isPerspectiveCamera) {
    camera.aspect = camera.userData.viewportAspect || 1;
    Ot();
    const value14 =
      count /
      (Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV()) / 2) * 2);
    value13 = Math.max(value14 * 1.04, value10 * 1.65, 8);
  } else {
    ho(count, camera.userData.viewportAspect || 1);
    value13 = Math.max(value10 * 3.2, 18);
  }
  if (value2 === "top") {
    camera.up.copy(Va(value3));
    camera.position.set(value12.x, value12.y + value13, value12.z);
  } else {
    camera.up.set(0, 1, 0);
    const value14 = new THREE.Vector3(1.08, 1.7, 1.12).normalize();
    camera.position.copy(value12).addScaledVector(value14, value13);
  }
  Ya(camera, value12);
  camera.zoom = 1;
  camera.lookAt(value12);
  camera.updateProjectionMatrix();
  Q.target.copy(value12);
  He();
  Q.update();
}
function Jd(value, anchor, forceOrthogonalAxis = false) {
  const value2 = pixelsPerMeter() || 100;
  if (!Wa()) {
    if (forceOrthogonalAxis && anchor) {
      const value3 = axisLockedPoint(value, anchor);
      return {
        ...value3,
        kind: "axis",
        distance: distance(value, value3.point),
      };
    }
    return {
      point: {
        ...value,
      },
      kind: null,
      label: "",
      distance: 0,
    };
  }
  const settings = scene.settings;
  return snapPoint(value, scene.walls, {
    zoom: $.zoom,
    screenTolerance: clamp(
      Math.round(finite(settings.snapTolerance, 13)),
      6,
      24,
    ),
    anchor: anchor,
    forceOrthogonalAxis: forceOrthogonalAxis,
    preferVerticalAxis: settings.snapOrthogonal !== false,
    angleStepDegrees: 15,
    gridSize: value2 * 0.1,
    intersections: settings.snapIntersections === false ? [] : Zu(value2),
    snapEndpoints: settings.snapEndpoints !== false,
    snapIntersections: settings.snapIntersections !== false,
    snapSegments: settings.snapSegments !== false,
    snapOrthogonal: settings.snapOrthogonal !== false,
    snapAngles: settings.snapAngles !== false,
    snapGrid: settings.snapGrid !== false,
  });
}
function jd(value = Fe) {
  if (!Si || ba < 2 || !value?.point) {
    return false;
  }
  const count = Math.max(1, (pixelsPerMeter() || 100) * 0.01);
  return value.kind === "endpoint" && distance(value.point, Si) <= count;
}
function Wn(value = Ma) {
  if (!Mo) {
    return;
  }
  dn = {
    ...Mo,
  };
  const value2 = pixelsPerMeter() || 100;
  const value3 = Sa ? "吸附：临时关闭" : "吸附：关闭";
  if (we === "scale" && ft && value) {
    const value4 = axisLockedPoint(Mo, ft);
    dn = value4.point;
    Fe = null;
    Nn.textContent = "吸附：" + value4.label;
  } else if (we === "scale") {
    Fe = null;
    Nn.textContent = "吸附：自由";
  }
  J0.textContent =
    "X " +
    (dn.x / value2).toFixed(2) +
    " m · Y " +
    (dn.y / value2).toFixed(2) +
    " m";
  if (we === "wall") {
    Fe = Jd(Mo, Ke, value);
    Nn.textContent = jd(Fe)
      ? "闭合：点击闭合空间"
      : Fe.kind
        ? (!Wa() && value ? "锁定" : "吸附") + "：" + Fe.label
        : Wa()
          ? "吸附：自由"
          : value3;
  } else if (["window", "door", "railing"].includes(we)) {
    const value4 = nearestWall(dn, scene.walls, 16 / $.zoom);
    if (value4) {
      const value5 = Sn[ya] || Sn.solid;
      const value6 = {
        width: we === "door" ? value5.width : we === "railing" ? 2 : 1.4,
        t: value4.t,
      };
      const value7 = {
        wall: value4.wall,
        t: clampWindowT(value4.wall, value6, value2),
      };
      Un = we === "window" ? value7 : null;
      Zn = we === "door" ? value7 : null;
      Kn = we === "railing" ? value7 : null;
      Nn.textContent =
        we === "door"
          ? "吸附：墙体门洞"
          : we === "railing"
            ? "吸附：墙体栏杆"
            : "吸附：墙体";
    } else {
      Un = null;
      Zn = null;
      Kn = null;
      Nn.textContent = "吸附：未找到墙体";
    }
  } else if (we !== "scale") {
    Fe = null;
    Un = null;
    Zn = null;
    Kn = null;
    Nn.textContent = Wa() ? "吸附：开启" : value3;
    const value4 = Uc(dn);
    ie.style.cursor =
      value4?.type === "rotate-item"
        ? "grab"
        : value4?.type === "resize-item"
          ? "nwse-resize"
          : "";
  }
}
function zg(value) {
  Ma = value.shiftKey;
  Mo = no(Oa(value));
  Wn();
}
function Bg(event) {
  if (event.button !== 0 && event.button !== 1) {
    return;
  }
  ie.focus({
    preventScroll: true,
  });
  const visibleScreen = Oa(event);
  const start = no(visibleScreen);
  if (event.button === 1 || Pi) {
    event.preventDefault();
    Bo();
    z = {
      type: "pan",
      pointerId: event.pointerId,
      screen: Zi(visibleScreen),
      visibleScreen: visibleScreen,
      offsetX: $.offsetX,
      offsetY: $.offsetY,
    };
    ie.classList.add("panning");
    Zc();
    ie.setPointerCapture(event.pointerId);
    return;
  }
  if (ue && Iu(start)) {
    return;
  }
  if (we === "scale") {
    if (!ft) {
      ft = start;
      ae();
      return;
    }
    const end = event.shiftKey ? axisLockedPoint(start, ft).point : start;
    if (distance(ft, end) < 12 / $.zoom) {
      _("参考线太短，请重新选择终点。", "error");
      return;
    }
    Yt = {
      start: ft,
      end: end,
    };
    ft = null;
    nh.textContent = Math.round(distance(Yt.start, Yt.end)) + " px";
    Ar.value = scene.calibration?.reference?.meters || 3;
    aa.showModal();
    requestAnimationFrame(() => Ar.select());
    ae();
    return;
  }
  if (we === "wall") {
    if (!Ha()) {
      return;
    }
    const value7 = Jd(start, Ke, event.shiftKey);
    if (!Ke) {
      Ke = {
        ...value7.point,
      };
      Si = {
        ...value7.point,
      };
      ba = 0;
      na.hidden = false;
      ae();
      return;
    }
    if (distance(Ke, value7.point) < pixelsPerMeter() * 0.08) {
      _("墙段太短，请选择更远的终点。", "error");
      return;
    }
    const value8 = {
      id: Ce("wall"),
      start: {
        ...Ke,
      },
      end: {
        ...value7.point,
      },
      height: scene.settings.wallHeight,
      thickness: scene.settings.wallThickness,
    };
    const count = Math.max(0.75, pixelsPerMeter() * 0.01);
    const value9 = uncoveredCollinearWallSegments(value8, scene.walls, count);
    if (!value9.length) {
      Ke = {
        ...value7.point,
      };
      _("该位置已有墙体，已跳过重复墙段。");
      ae();
      return;
    }
    const value10 =
      value9.length !== 1 ||
      distance(value9[0].start, value8.start) > count ||
      distance(value9[0].end, value8.end) > count;
    te();
    const count2 = Math.max(1, pixelsPerMeter() * 0.01);
    const length = closedWallPolygons(scene.walls, count2).length;
    const value11 = value9.map((value13, value14) => ({
      ...value8,
      id: value14 === 0 ? value8.id : Ce("wall"),
      start: value13.start,
      end: value13.end,
    }));
    scene.walls.push(...value11);
    Vu();
    ba += 1;
    const value12 = closedWallPolygons(scene.walls, count2).length > length;
    if (value12) {
      qo();
    } else {
      Ke = {
        ...value7.point,
      };
    }
    $t("wall", value11[0].id);
    na.hidden = value12;
    ye();
    V();
    if (value12) {
      _("空间已闭合，地面已生成。可继续绘制下一个空间。", "success");
    } else if (value10) {
      _("已跳过与现有墙体重合的部分。", "success");
    }
    return;
  }
  if (we === "window") {
    if (!Ha()) {
      return;
    }
    const value7 = nearestWall(start, scene.walls, 18 / $.zoom);
    if (!value7) {
      _("请靠近一段墙体放置窗户。", "error");
      return;
    }
    te();
    const value8 = {
      id: Ce("window"),
      wallId: value7.wall.id,
      t: value7.t,
      width: 1.4,
      height: 1.35,
      sill: 0.85,
    };
    value8.t = clampWindowT(value7.wall, value8, pixelsPerMeter());
    scene.windows.push(value8);
    $t("window", value8.id);
    ye();
    V();
    return;
  }
  if (we === "door") {
    if (!Ha()) {
      return;
    }
    const value7 = nearestWall(start, scene.walls, 18 / $.zoom);
    if (!value7) {
      _("请靠近一段墙体放置门。", "error");
      return;
    }
    te();
    const value8 = Sn[ya] || Sn.solid;
    const value9 = {
      id: Ce("door"),
      wallId: value7.wall.id,
      t: value7.t,
      width: value8.width,
      height: value8.height,
      sill: 0,
      doorType: ya,
      hinge: "left",
      swing: 1,
    };
    value9.t = clampWindowT(value7.wall, value9, pixelsPerMeter());
    scene.doors.push(value9);
    $t("door", value9.id);
    ye();
    V();
    return;
  }
  if (we === "railing") {
    if (!Ha()) {
      return;
    }
    const value7 = nearestWall(start, scene.walls, 18 / $.zoom);
    if (!value7) {
      _("请靠近一段墙体放置栏杆。", "error");
      return;
    }
    te();
    const value8 = {
      id: Ce("railing"),
      wallId: value7.wall.id,
      t: value7.t,
      width: 2,
      height: 1.1,
      sill: 0,
    };
    value8.t = clampWindowT(value7.wall, value8, pixelsPerMeter());
    scene.railings.push(value8);
    $t("railing", value8.id);
    ye();
    V();
    return;
  }
  if (we === "label") {
    Xs("planlabel", start);
    return;
  }
  const value = Uc(start);
  if (value) {
    Bo();
    const originalItem = {
      ...value.item,
    };
    z =
      value.type === "resize-item"
        ? {
            type: "resize-item",
            pointerId: event.pointerId,
            originalItem: originalItem,
            handle: {
              x: value.corner.x,
              y: value.corner.y,
            },
            anchor: {
              ...value.corner.opposite,
            },
            before: An(),
            moved: false,
          }
        : {
            type: "rotate-item",
            pointerId: event.pointerId,
            originalItem: originalItem,
            center: {
              x: originalItem.x,
              y: originalItem.y,
            },
            startPointer: {
              ...start,
            },
            before: An(),
            moved: false,
          };
    ie.setPointerCapture(event.pointerId);
    return;
  }
  const value2 = Ao();
  const value3 = tf(start);
  if (!value3) {
    Bo();
    if (!event.shiftKey) {
      Gt();
    }
    z = {
      type: "marquee",
      pointerId: event.pointerId,
      start: start,
      current: start,
      additive: event.shiftKey,
      moved: false,
    };
    St();
    ae();
    Zc();
    if (!event.shiftKey) {
      Ba(value2);
    }
    ie.setPointerCapture(event.pointerId);
    return;
  }
  Bo();
  const before = value3.kind === "item" ? An() : null;
  const value4 =
    value3.kind === "item" && he.length > 0 && We("item", value3.id);
  let value5 = [];
  let copied = false;
  if (value3.kind === "item") {
    if (value4) {
      const allowed = new Set(
        he
          .filter((value7) => value7.kind === "item")
          .map((value7) => value7.id),
      );
      value5 = scene.items.filter((value7) => allowed.has(value7.id));
    } else {
      $t("item", value3.id);
      const value7 = scene.items.find((value8) => value8.id === value3.id);
      if (value7) {
        value5 = [value7];
      }
    }
    if (event.altKey && value5.length) {
      const value7 = value5.map((value8) => ({
        ...structuredClone(value8),
        id: Ce("item"),
      }));
      qi(value7);
      scene.items.push(...value7);
      value5 = value7;
      if (value7.length === 1) {
        $t("item", value7[0].id);
      } else {
        X = null;
        he = value7.map((value8) => ({
          kind: "item",
          id: value8.id,
        }));
      }
      copied = true;
    }
  } else {
    $t(value3.kind, value3.id);
  }
  St();
  ae();
  Ba(value2);
  const value6 = za();
  const previewScope = value2 === value6 ? value6 : "all";
  if (value3.kind === "item") {
    z = {
      type: "move-items",
      pointerId: event.pointerId,
      start: start,
      originals: value5.map((originals) => ({
        id: originals.id,
        x: originals.x,
        y: originals.y,
      })),
      before: before,
      copied: copied,
      previewScope: previewScope,
      moved: false,
    };
  } else if (["window", "door", "railing"].includes(value3.kind)) {
    z = {
      type: "move-opening",
      pointerId: event.pointerId,
      start: start,
      before: An(),
      previewScope: "all",
      moved: false,
    };
  }
  if (z) {
    ie.setPointerCapture(event.pointerId);
  } else {
    Xa();
  }
}
function Og(value) {
  const value2 = Oa(value);
  const value3 = no(value2);
  if (z?.pointerId === value.pointerId) {
    if (z.type === "marquee") {
      z.current = value3;
      z.moved = distance(z.start, value3) * $.zoom >= 4;
      if (Kc()) {
        Qc();
      } else {
        ae();
      }
      return;
    }
    if (z.type === "pan") {
      const value4 = Zi(value2);
      $.offsetX = z.offsetX + value4.x - z.screen.x;
      $.offsetY = z.offsetY + value4.y - z.screen.y;
      const offsetX = value2.x - z.visibleScreen.x;
      const offsetY = value2.y - z.visibleScreen.y;
      if (
        !Kc({
          offsetX: offsetX,
          offsetY: offsetY,
        })
      ) {
        ae();
      }
      return;
    }
    if (z.type === "move-items") {
      if (!z.moved && distance(value3, z.start) * $.zoom < 3) {
        return;
      }
      const value4 = pixelsPerMeter() * 0.05;
      const value5 = Wa() && scene.settings.snapGrid !== false;
      let value6 = value3.x - z.start.x;
      let value7 = value3.y - z.start.y;
      if (value.shiftKey) {
        if (Math.abs(value6) >= Math.abs(value7)) {
          value7 = 0;
        } else {
          value6 = 0;
        }
      }
      const index = new Map(scene.items.map((value9) => [value9.id, value9]));
      for (const value9 of z.originals) {
        const value10 = index.get(value9.id);
        if (value10) {
          value10.x = value5
            ? Math.round((value9.x + value6) / value4) * value4
            : value9.x + value6;
          value10.y = value5
            ? Math.round((value9.y + value7) / value4) * value4
            : value9.y + value7;
        }
      }
      z.moved = z.originals.some((value9) => {
        const value10 = index.get(value9.id);
        return (
          value10 &&
          (Math.abs(value10.x - value9.x) > 0.000001 ||
            Math.abs(value10.y - value9.y) > 0.000001)
        );
      });
      ae();
      return;
    }
    if (z.type === "resize-item") {
      if (!z.moved && distance(value3, z.handle) * $.zoom < 3) {
        return;
      }
      const value4 = ct();
      if (!value4) {
        return;
      }
      const count = Math.max(finite(z.originalItem.height, 0.05), 0.001);
      const value5 = value.shiftKey
        ? {
            minimum: Math.max(
              0.1 / Math.max(z.originalItem.width, 0.1),
              0.1 / Math.max(z.originalItem.depth, 0.1),
              itemMinimumHeight(z.originalItem.type) / count,
            ),
            maximum: Math.min(
              8 / Math.max(z.originalItem.width, 0.1),
              8 / Math.max(z.originalItem.depth, 0.1),
              6 / count,
            ),
          }
        : undefined;
      const value6 = resizeRotatedItemFromCorner(
        z.originalItem,
        z.handle,
        z.anchor,
        value3,
        pixelsPerMeter() || 1,
        value.shiftKey,
        value5,
      );
      Object.assign(value4, value6);
      z.moved =
        Math.abs(value4.x - z.originalItem.x) > 0.000001 ||
        Math.abs(value4.y - z.originalItem.y) > 0.000001 ||
        Math.abs(value4.width - z.originalItem.width) > 0.000001 ||
        Math.abs(value4.depth - z.originalItem.depth) > 0.000001 ||
        Math.abs(value4.height - z.originalItem.height) > 0.000001;
      ae();
      return;
    }
    if (z.type === "rotate-item") {
      if (!z.moved && distance(value3, z.startPointer) * $.zoom < 3) {
        return;
      }
      const value4 = ct();
      if (!value4) {
        return;
      }
      value4.rotation = itemRotationFromPointers(
        z.originalItem.rotation,
        z.center,
        z.startPointer,
        value3,
        value.shiftKey ? 15 : 0,
      );
      z.moved = Math.abs(value4.rotation - z.originalItem.rotation) > 0.000001;
      ae();
      return;
    }
    if (z.type === "move-opening") {
      if (!z.moved && distance(value3, z.start) * $.zoom < 3) {
        return;
      }
      const value4 = ct();
      const value5 = scene.walls.find((value7) => value7.id === value4?.wallId);
      if (!value4 || !value5) {
        return;
      }
      value4.t = clampWindowT(
        value5,
        {
          ...value4,
          t: projectPointToSegment(value3, value5.start, value5.end).t,
        },
        pixelsPerMeter(),
      );
      const value6 = z.before?.[X?.kind + "s"]?.find?.(
        (value7) => value7.id === value4.id,
      );
      z.moved = !value6 || Math.abs(value4.t - value6.t) > 0.000001;
      ae();
      return;
    }
  }
  zg(value);
  if (ue || ["scale", "wall", "window", "door", "railing"].includes(we)) {
    ae();
  }
}
function e0() {
  Ea = 0;
  const value = Pa;
  Pa = null;
  if (value) {
    Og(value);
  }
}
function Wg(value) {
  Pa = {
    clientX: value.clientX,
    clientY: value.clientY,
    pointerId: value.pointerId,
    shiftKey: value.shiftKey,
  };
  Ea ||= requestAnimationFrame(e0);
}
function Hg(value) {
  if (!!Pa && Pa.pointerId === value) {
    if (Ea) {
      cancelAnimationFrame(Ea);
    }
    e0();
  }
}
function t0() {
  La = 0;
  const value = gs;
  const value2 = ps;
  gs = 1;
  ps = null;
  if (value2 && Math.abs(value - 1) > 1e-8) {
    $s(value, value2);
  }
}
function Vg(value) {
  gs *= Math.exp(-value.deltaY * 0.0012);
  ps = Oa(value);
  Bo();
  La ||= requestAnimationFrame(t0);
  window.clearTimeout(ms);
  ms = window.setTimeout(() => {
    ms = null;
    if (La) {
      cancelAnimationFrame(La);
      t0();
    }
    Xa();
  }, 90);
}
function Ng(value) {
  if (!z || z.pointerId !== value.pointerId) {
    return;
  }
  if (z.type === "marquee") {
    const value4 = Ao();
    const value5 = z.additive ? [...(X ? [X] : []), ...he] : [];
    const value6 = z.moved ? ef(z.start, z.current) : [];
    const value7 = [
      ...new Map(
        [...value5, ...value6].map((value8) => [
          value8.kind + ":" + value8.id,
          value8,
        ]),
      ).values(),
    ];
    if (value7.length === 1) {
      $t(value7[0].kind, value7[0].id);
    } else {
      X = null;
      he = value7;
    }
    try {
      ie.releasePointerCapture(value.pointerId);
    } catch {}
    z = null;
    St();
    ae();
    Ba(value4);
    Xa();
    return;
  }
  const value2 = z;
  const value3 = value2.moved || value2.copied;
  if (value3) {
    Nu(z.before);
    V();
  }
  if (
    ["move-items", "resize-item", "rotate-item", "move-opening"].includes(
      value2.type,
    )
  ) {
    St();
  }
  if (value3 && value2.type === "move-opening") {
    qe({
      scope: "all",
    });
  } else if (
    value3 &&
    ["move-items", "resize-item", "rotate-item"].includes(value2.type)
  ) {
    const value4 = ct();
    qe({
      scope: value2.previewScope || (value4 ? $a(value4) : za()),
    });
  }
  if (z.type === "pan") {
    ie.classList.remove("panning");
  }
  try {
    ie.releasePointerCapture(value.pointerId);
  } catch {}
  z = null;
  if (value2.type === "pan") {
    ae();
  }
  Xa();
}
function n0(value) {
  Hg(value.pointerId);
  Ng(value);
}
function It(value) {
  const value2 = ct();
  if (!value2 || X?.kind !== value) {
    return;
  }
  const value3 = value === "item" ? $a(value2) : "all";
  te();
  if (value === "wall") {
    value2.height = clamp(
      finite(f("#wall-height").value, value2.height),
      0.01,
      6,
    );
    value2.thickness = clamp(
      finite(f("#wall-thickness").value, value2.thickness),
      0.01,
      3,
    );
    value2.opacity =
      f("#wall-opacity-mode").value === "custom"
        ? clamp(
            finite(f("#wall-opacity").value, scene.settings.wallOpacity * 100),
            0,
            100,
          ) / 100
        : null;
    value2.allowOpenEnd = f("#wall-open-end-mode").value === "allowed";
    scene.settings.wallHeight = value2.height;
    scene.settings.wallThickness = value2.thickness;
  } else if (value === "window") {
    value2.width = clamp(
      finite(f("#window-width").value, value2.width),
      0.3,
      20,
    );
    value2.height = clamp(
      finite(f("#window-height").value, value2.height),
      0.3,
      20,
    );
    value2.sill = clamp(finite(f("#window-sill").value, value2.sill), 0, 20);
    value2.hasDivider = f("#window-divider").value !== "without";
    const value4 = scene.walls.find((value5) => value5.id === value2.wallId);
    if (value4) {
      value2.t = clampWindowT(value4, value2, pixelsPerMeter());
    }
  } else if (value === "door") {
    value2.doorType = Object.hasOwn(Sn, f("#door-type").value)
      ? f("#door-type").value
      : "solid";
    value2.width = clamp(
      finite(f("#door-width").value, value2.width),
      0.55,
      20,
    );
    value2.height = clamp(
      finite(f("#door-height").value, value2.height),
      1.8,
      20,
    );
    const value4 = scene.walls.find((value5) => value5.id === value2.wallId);
    if (value4) {
      value2.t = clampWindowT(value4, value2, pixelsPerMeter());
    }
  } else if (value === "railing") {
    value2.width = clamp(
      finite(f("#railing-width").value, value2.width),
      0.3,
      20,
    );
    value2.height = clamp(
      finite(f("#railing-height").value, value2.height),
      0.5,
      3,
    );
    const value4 = scene.walls.find((value5) => value5.id === value2.wallId);
    if (value4) {
      value2.t = clampWindowT(value4, value2, pixelsPerMeter());
    }
  } else {
    const value4 = pixelsPerMeter() || 1;
    value2.x = finite(f("#item-x").value, value2.x / value4) * value4;
    value2.y = finite(f("#item-y").value, value2.y / value4) * value4;
    value2.width = clamp(finite(f("#item-width").value, value2.width), 0.1, 8);
    value2.height = clamp(
      finite(f("#item-height").value, value2.height),
      itemMinimumHeight(value2.type),
      6,
    );
    value2.depth = clamp(finite(f("#item-depth").value, value2.depth), 0.1, 8);
    value2.elevation = clamp(
      finite(f("#item-elevation").value, value2.elevation || 0),
      0,
      6,
    );
    value2.rotation =
      value2.type === "striplight"
        ? normalizeFullRotation(f("#item-rotation").value, value2.rotation)
        : finite(f("#item-rotation").value, value2.rotation);
    if (value2.type === "planlabel") {
      value2.title = normalizeLabelText(
        f("#label-title").value,
        "家庭总览",
        24,
      );
      value2.subtitle = normalizeLabelText(
        f("#label-subtitle").value,
        "HOME PLAN",
        36,
      );
      value2.titleSpacing = clamp(
        finite(f("#label-title-spacing").value, 105) / 100,
        0,
        1.8,
      );
      value2.subtitleSpacing = clamp(
        finite(f("#label-subtitle-spacing").value, 8) / 100,
        0,
        0.6,
      );
      value2.lineLength = clamp(
        finite(f("#label-line-length").value, 86) / 100,
        0.3,
        1,
      );
      value2.height = 0.01;
      value2.elevation = 0;
    }
    if (value2.type === "curtain") {
      value2.curtainPosition = ["left", "right", "split"].includes(
        f("#curtain-position").value,
      )
        ? f("#curtain-position").value
        : "split";
    }
    if (Mn.has(value2.type)) {
      value2.roundTableTurntable = f("#round-table-turntable").value === "with";
    }
    if (xo.has(value2.type)) {
      value2.stairDirection = ["left", "right"].includes(
        f("#stair-direction").value,
      )
        ? f("#stair-direction").value
        : "right";
    }
    if (value2.type === "tv") {
      const value5 = fa.has(value2.tvMountStyle)
        ? value2.tvMountStyle
        : "standard";
      const value6 = fa.has(f("#tv-mount-style").value)
        ? f("#tv-mount-style").value
        : "standard";
      if (value5 !== value6 && value6 === "mobile") {
        value2.height = Math.max(value2.height, wi.height);
        value2.depth = Math.max(value2.depth, wi.depth);
        value2.elevation = 0;
      } else if (
        value5 === "mobile" &&
        value6 !== "mobile" &&
        Math.abs(value2.height - wi.height) < 0.001 &&
        Math.abs(value2.depth - wi.depth) < 0.001
      ) {
        value2.height = xt.tv.height;
        value2.depth = xt.tv.depth;
      }
      value2.tvMountStyle = value6;
    }
    if (re.has(value2.type)) {
      const value5 = Rt[value2.type] || Rt.downlight;
      value2.verticalRotation =
        value2.type === "striplight"
          ? normalizeFullRotation(
              f("#item-vertical-rotation").value,
              value2.verticalRotation || 0,
            )
          : clamp(
              finite(
                f("#item-vertical-rotation").value,
                value2.verticalRotation || 0,
              ),
              -90,
              90,
            );
      if (value2.type === "striplight") {
        value2.stripRollRotation = normalizeFullRotation(
          Hr.value,
          value2.stripRollRotation || 0,
        );
        value2.lightSourceVisible = Vr.checked;
      }
      value2.lightGroupId = scene.lightGroups.some(
        (value6) => value6.id === f("#light-group").value,
      )
        ? f("#light-group").value
        : Fo().id;
      value2.lightTemperature = clamp(
        finite(f("#light-temperature").value, value5.temperature),
        2200,
        6500,
      );
      value2.lightBrightness = clamp(
        finite(f("#light-brightness").value, value5.brightness),
        0,
        100,
      );
      value2.lightRange = clamp(
        finite(f("#light-range").value, value5.range),
        0.5,
        10,
      );
      value2.lightAngle = clamp(
        finite(f("#light-angle").value, value5.angle),
        15,
        vo(value2.type),
      );
      value2.height = xt[value2.type].height;
    }
  }
  ye(value3);
  V();
}
function qo() {
  Ke = null;
  Si = null;
  ba = 0;
  na.hidden = true;
}
function o0() {
  qo();
  ae();
}
async function Xg() {
  if (!wu) {
    zt("地址无效", "error");
    return;
  }
  Hf();
  zs();
  try {
    const value = await Go("/studio3d");
    _0.textContent = "户型图绘制";
    document.title = "户型图绘制";
    await Xc(value);
    zt("已自动保存", "saved");
    if (Ue) {
      if ($e) {
        rl();
      } else {
        window.setTimeout(() => rl(), 180);
      }
    }
  } catch (error) {
    zt("载入失败", "error");
    _(error.message || "无法载入项目。", "error");
  }
}
$l.forEach((value) =>
  value.addEventListener("click", () => Bt(value.dataset.tool)),
);
Y0.addEventListener("click", () => {
  Eu();
});
ri.addEventListener("click", $c);
ui.addEventListener("change", Tu);
ca.addEventListener("change", Cu);
for (const e of Yl) {
  e.addEventListener("click", () => Dg(e.dataset.previewFloor));
}
Qo.addEventListener("click", () => ii.click());
ii.addEventListener("change", async () => {
  await lf(ii.files?.[0]);
  ii.value = "";
});
Lr.addEventListener("click", () => {
  if (scene.background) {
    te();
    scene.settings.backgroundVisible = !scene.settings.backgroundVisible;
    Jc();
    ae();
    V();
  }
});
Gl.addEventListener("click", () => {
  if (scene.background) {
    te();
    scene.background = null;
    wa = null;
    ye();
    oo();
    V();
    _("底图引用已移除，现在可以在编辑器中删除这张图片。", "success");
  }
});
function yl(value) {
  if (Eo && Eo !== value) {
    a0();
  }
  if (!Eo) {
    te();
    Eo = value;
    Bo();
  }
}
function _g() {
  fs ||= requestAnimationFrame(() => {
    fs = 0;
    ae();
  });
}
function a0() {
  window.clearTimeout(Ti);
  Ti = null;
  if (Eo) {
    Eo = null;
    syncControlValue(jo, scene.settings.wallHeight.toFixed(2));
    syncControlValue(ea, scene.settings.wallThickness.toFixed(2));
    syncControlValue(ta, Math.round(scene.settings.wallOpacity * 100));
    St();
    qe({
      scope: "all",
    });
    Xa();
  }
}
function i0(value = 80) {
  window.clearTimeout(Ti);
  Ti = window.setTimeout(a0, value);
}
function Yg() {
  const value = clamp(finite(jo.value, scene.settings.wallHeight), 0.01, 6);
  if (
    !(Math.abs(value - scene.settings.wallHeight) < 1e-8) ||
    !scene.walls.every((value2) => Math.abs(value2.height - value) < 1e-8)
  ) {
    yl(jo);
    scene.settings.wallHeight = value;
    for (const value2 of scene.walls) {
      value2.height = value;
    }
    V();
  }
}
function qg() {
  const value = clamp(finite(ea.value, scene.settings.wallThickness), 0.01, 3);
  if (
    !(Math.abs(value - scene.settings.wallThickness) < 1e-8) ||
    !scene.walls.every((value2) => Math.abs(value2.thickness - value) < 1e-8)
  ) {
    yl(ea);
    scene.settings.wallThickness = value;
    for (const value2 of scene.walls) {
      value2.thickness = value;
    }
    _g();
    V();
  }
}
function Ug() {
  const value =
    clamp(finite(ta.value, scene.settings.wallOpacity * 100), 0, 100) / 100;
  if (!(Math.abs(value - scene.settings.wallOpacity) < 1e-8)) {
    yl(ta);
    scene.settings.wallOpacity = value;
    V();
  }
}
for (const [e, o] of [
  [jo, Yg],
  [ea, qg],
  [ta, Ug],
]) {
  e.addEventListener("input", o);
  e.addEventListener("change", () => {
    o();
    i0();
  });
  e.addEventListener("blur", () => i0(0));
}
kr.addEventListener("click", () => {
  te();
  scene.settings.floorEdgeVisible = scene.settings.floorEdgeVisible === false;
  ye();
  V();
});
function Zg() {
  for (const value of eu) {
    value.hidden = value.dataset.assetHeadingCategory !== st;
  }
  for (const value of ac) {
    const itemType = value.dataset.itemType;
    const value2 = re.has(itemType);
    const value3 = rc.has(itemType);
    const value4 =
      st === "light"
        ? value2
        : st === "appliance"
          ? value3
          : !value3 && !value2;
    value.hidden = !value4;
  }
}
function mr(value) {
  const value2 = ["home", "appliance", "light"].includes(value)
    ? value
    : "home";
  const value3 = Ao();
  Ui();
  st = value2;
  for (const element of oc) {
    const value6 = element.dataset.assetCategory === value2;
    element.classList.toggle("active", value6);
    element.setAttribute("aria-pressed", String(value6));
  }
  Zg();
  tu.hidden = value2 === "light";
  nu.hidden = value2 !== "light";
  const value4 = ct();
  const value5 = X?.kind === "item" && value4 && re.has(value4.type);
  if (X && (value2 === "light") != !!value5) {
    Gt();
  }
  if (he.length) {
    Gt();
  }
  Bt("select");
  fn();
  St();
  ae();
  if (value3 !== Ao()) {
    Ba(value3);
  }
}
for (const e of oc) {
  e.addEventListener("click", () => mr(e.dataset.assetCategory));
}
mr("home");
ou.addEventListener("click", () => {
  te();
  const allowed = new Set(scene.lightGroups.map((value3) => value3.name));
  let value = scene.lightGroups.length + 1;
  while (allowed.has("灯组 " + value)) {
    value += 1;
  }
  const value2 = {
    id: Ce("light-group"),
    name: "灯组 " + value,
    enabled: true,
  };
  scene.lightGroups.push(value2);
  ut = value2.id;
  fn();
  St();
  V();
});
au.addEventListener("click", () => Ou(false));
for (const e of bn.querySelectorAll("[data-light-group-action]")) {
  e.addEventListener("click", () => {
    const value = scene.lightGroups.find((value2) => value2.id === ss);
    const lightGroupAction = e.dataset.lightGroupAction;
    Ui();
    if (value) {
      if (lightGroupAction === "rename") {
        Mi = value.id;
        $r.value = value.name;
        Gr.showModal();
        requestAnimationFrame(() => $r.select());
      } else if (lightGroupAction === "duplicate") {
        zu(value);
      } else if (lightGroupAction === "delete") {
        Gu(value);
      }
    }
  });
}
for (const e of yn.querySelectorAll("[data-floor-action]")) {
  e.addEventListener("click", () => {
    const value = T.floors.find((value2) => value2.id === qn);
    const floorAction = e.dataset.floorAction;
    Fc();
    if (value) {
      if (floorAction === "rename") {
        Su(value);
      } else if (floorAction === "delete") {
        bu(value);
      }
    }
  });
}
document.addEventListener("pointerdown", (value) => {
  if (!bn.hidden && !bn.contains(value.target)) {
    Ui();
  }
  if (!yn.hidden && !yn.contains(value.target)) {
    Fc();
  }
  if (!oa.hidden && !value.target.closest(".snap-control")) {
    Vs(false);
  }
});
function wr() {
  qn = "";
  Tr.close();
}
f("#floor-rename-close").addEventListener("click", wr);
f("#floor-rename-cancel").addEventListener("click", wr);
Tr.addEventListener("cancel", () => {
  qn = "";
});
q0.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = T.floors.find((value3) => value3.id === qn);
  if (!value) {
    wr();
    return;
  }
  const value2 = Dc(normalizeLabelText(Cr.value, value.name, 24), value.id);
  if (value2 !== value.name) {
    value.name = value2;
    Oi();
    sl();
    V();
    _("已重命名为“" + value2 + "”。", "success");
  }
  wr();
});
f("#floor-delete-close").addEventListener("click", Bi);
f("#floor-delete-cancel").addEventListener("click", Bi);
si.addEventListener("cancel", (event) => {
  event.preventDefault();
  Bi();
});
U0.addEventListener("submit", (event) => {
  event.preventDefault();
  Mu();
});
function yr() {
  Mi = "";
  Gr.close();
}
f("#light-group-rename-close").addEventListener("click", yr);
f("#light-group-rename-cancel").addEventListener("click", yr);
Gr.addEventListener("cancel", () => {
  Mi = "";
});
oh.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = scene.lightGroups.find((value3) => value3.id === Mi);
  if (!value) {
    yr();
    return;
  }
  const labelText = normalizeLabelText($r.value, value.name, 24);
  if (labelText !== value.name) {
    te();
    value.name = labelText;
    ye("none");
    V();
  }
  yr();
});
function xr() {
  xa = null;
  zr.close();
}
function Ja(value = Xn) {
  return [...value.querySelectorAll("[data-light-target-item-id]")];
}
function vr() {
  const value = Ja();
  const length = value.filter((value2) => value2.checked).length;
  ih.textContent = length + "/" + value.length + " 灯";
  li.disabled = !value.length;
  li.textContent =
    value.length && length === value.length ? "取消全选" : "全选";
  for (const value2 of Xn.querySelectorAll("[data-light-target-group-id]")) {
    const value3 = Ja(value2);
    const length2 = value3.filter((value4) => value4.checked).length;
    value2.querySelector("[data-light-target-group-count]").textContent =
      length2 + "/" + value3.length + " 灯";
    value2.querySelector("[data-light-target-group-toggle]").textContent =
      value3.length && length2 === value3.length ? "取消全选" : "全选";
  }
}
function Kg(value) {
  Xn.replaceChildren();
  let value2 = 0;
  for (const value3 of scene.lightGroups) {
    const value4 = scene.items.filter(
      (value11) => re.has(value11.type) && value11.lightGroupId === value3.id,
    );
    if (!value4.length) {
      continue;
    }
    value2 += value4.length;
    const value5 = document.createElement("section");
    value5.className = "light-property-target-group";
    value5.dataset.lightTargetGroupId = value3.id;
    const value6 = document.createElement("header");
    const element = document.createElement("strong");
    element.textContent = value3.name;
    const value7 = document.createElement("span");
    value7.dataset.lightTargetGroupCount = "";
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.dataset.lightTargetGroupToggle = "";
    element2.textContent = "取消全选";
    value6.append(element, value7, element2);
    const value8 = document.createElement("div");
    value8.className = "light-property-target-grid";
    const index = new Map();
    for (const value11 of value4) {
      index.set(value11.type, (index.get(value11.type) || 0) + 1);
    }
    const index2 = new Map();
    for (const value11 of value4) {
      const value12 = xt[value11.type] || xt.downlight;
      const value13 = (index2.get(value11.type) || 0) + 1;
      index2.set(value11.type, value13);
      const value14 = document.createElement("label");
      value14.className = "light-property-target-item";
      const value15 = document.createElement("input");
      value15.type = "checkbox";
      value15.checked = true;
      value15.dataset.lightTargetItemId = value11.id;
      const value16 = document.createElement("span");
      const element3 = document.createElement("strong");
      element3.textContent =
        index.get(value11.type) > 1
          ? value12.name + " " + value13
          : value12.name;
      const element4 = document.createElement("small");
      const value17 = is(value, value11[value], value11.type);
      element4.textContent =
        (value11.id === X?.id ? "当前灯 · " : "") +
        "当前 " +
        yc(value, value17);
      value16.append(element3, element4);
      value14.append(value15, value16);
      value8.append(value14);
    }
    value5.append(value6, value8);
    Xn.append(value5);
  }
  if (!value2) {
    const element = document.createElement("p");
    element.className = "light-property-target-empty";
    element.textContent = "当前没有可应用的灯具。";
    Xn.append(element);
  }
  vr();
}
for (const e of Hl) {
  e.addEventListener("click", () => {
    const value = ct();
    const property = e.dataset.applyLightProperty;
    const value2 = wc[property];
    if (!value || X?.kind !== "item" || !re.has(value.type) || !value2) {
      return;
    }
    const value3 = is(property, f(value2.input).value, value.type);
    xa = {
      property: property,
      label: value2.label,
      value: value3,
    };
    rh.textContent = "应用" + value2.label;
    sh.textContent = yc(property, value3);
    Kg(property);
    zr.showModal();
    requestAnimationFrame(() => li.focus());
  });
}
li.addEventListener("click", () => {
  const value = Ja();
  const value2 = !value.length || !value.every((value3) => value3.checked);
  for (const value3 of value) {
    value3.checked = value2;
  }
  vr();
});
Xn.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-light-target-group-toggle]");
  if (!value2) {
    return;
  }
  const value3 = value2.closest("[data-light-target-group-id]");
  const value4 = Ja(value3);
  const value5 = !value4.every((value6) => value6.checked);
  for (const value6 of value4) {
    value6.checked = value5;
  }
  vr();
});
Xn.addEventListener("change", vr);
f("#light-property-apply-close").addEventListener("click", xr);
f("#light-property-apply-cancel").addEventListener("click", xr);
zr.addEventListener("cancel", () => {
  xa = null;
});
ah.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!xa) {
    xr();
    return;
  }
  const { property: value, label: value2, value: value3 } = xa;
  const allowed = new Set(
    Ja()
      .filter((value6) => value6.checked)
      .map((value6) => value6.dataset.lightTargetItemId),
  );
  const value4 = scene.items.filter(
    (value6) => re.has(value6.type) && allowed.has(value6.id),
  );
  if (!value4.length) {
    _("请至少选择一盏灯。", "error");
    return;
  }
  const value5 = value4
    .map((item) => ({
      item: item,
      value: is(value, value3, item.type),
    }))
    .filter(
      (element) =>
        Math.abs(finite(element.item[value]) - element.value) > 0.000001,
    );
  if (value5.length) {
    te();
    for (const element of value5) {
      element.item[value] = element.value;
    }
    ye("lights");
    V();
  }
  xr();
  _("已将" + value2 + "应用到 " + value4.length + " 盏灯。", "success");
});
for (const e of ac) {
  e.addEventListener("dragstart", (value) => {
    value.dataTransfer.effectAllowed = "copy";
    value.dataTransfer.setData(
      "application/x-ha-bridge-3d-item",
      e.dataset.itemType,
    );
  });
  e.addEventListener("click", () => {
    const value = no({
      x: Qe / 2,
      y: Je / 2,
    });
    Xs(e.dataset.itemType, value);
  });
}
Ct.addEventListener("dragenter", (value) => {
  if (
    [...value.dataTransfer.types].includes("application/x-ha-bridge-3d-item")
  ) {
    Ct.classList.add("dragging-item");
  }
});
Ct.addEventListener("dragover", (event) => {
  if (
    [...event.dataTransfer.types].includes("application/x-ha-bridge-3d-item")
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    Ct.classList.add("dragging-item");
  }
});
Ct.addEventListener("dragleave", (value) => {
  if (!Ct.contains(value.relatedTarget)) {
    Ct.classList.remove("dragging-item");
  }
});
Ct.addEventListener("drop", (event) => {
  event.preventDefault();
  Ct.classList.remove("dragging-item");
  const value = event.dataTransfer.getData("application/x-ha-bridge-3d-item");
  if (value) {
    Xs(value, no(Oa(event)));
  }
});
ie.addEventListener("pointerdown", Bg);
ie.addEventListener("pointermove", Wg);
ie.addEventListener("pointerup", n0);
ie.addEventListener("pointercancel", n0);
ie.addEventListener("contextmenu", (event) => event.preventDefault());
ie.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    Vg(event);
  },
  {
    passive: false,
  },
);
f("#fit-view").addEventListener("click", oo);
f("#rotate-plan-view").addEventListener("click", Uu);
f("#zoom-in").addEventListener("click", () => $s(1.18));
f("#zoom-out").addEventListener("click", () => $s(1 / 1.18));
f("#reset-camera").addEventListener("click", pn);
$h.addEventListener("click", tl);
Nr.addEventListener("click", rr);
Oh.addEventListener("click", tl);
Xr.addEventListener("click", rr);
Yr.addEventListener("click", tl);
f("#open-export").addEventListener("click", rl);
f("#export-close").addEventListener("click", () => {
  if (!ze) {
    je.close();
  }
});
je.addEventListener("cancel", (event) => {
  event.preventDefault();
  if (!ze) {
    je.close();
  }
});
je.addEventListener("close", Uf);
f("#export-overwrite-close").addEventListener("click", () => Xo("cancel"));
f("#export-overwrite-cancel").addEventListener("click", () => Xo("cancel"));
f("#export-overwrite-rename").addEventListener("click", () => Xo("rename"));
f("#export-overwrite-confirm").addEventListener("click", () => Xo("overwrite"));
pi.addEventListener("cancel", (event) => {
  event.preventDefault();
  Xo("cancel");
});
const r0 = () => {
  if (mi.open) {
    mi.close();
  }
};
f("#export-complete-close").addEventListener("click", r0);
f("#export-complete-confirm").addEventListener("click", r0);
jl.addEventListener("click", (value) => {
  const value2 = value.target.closest("[data-export-preset-slot]");
  if (value2) {
    Nf(Number(value2.dataset.exportPresetSlot));
  }
});
ec.addEventListener("click", Xf);
tc.addEventListener("click", _f);
nc.addEventListener("click", Yf);
f("#export-preset-rename-close").addEventListener("click", Ka);
f("#export-preset-rename-cancel").addEventListener("click", Ka);
fi.addEventListener("cancel", (event) => {
  event.preventDefault();
  Ka();
});
qh.addEventListener("submit", (event) => {
  event.preventDefault();
  const exportPresetSlots = normalizeExportPresetSlots(T?.exportPresets);
  const activeExportPresetSlot = normalizeActiveExportPresetSlot(
    T?.activeExportPresetSlot,
    exportPresetSlots.length,
  );
  const value3 = exportPresetSlots[activeExportPresetSlot];
  if (!value3) {
    Ka();
    return;
  }
  const value4 = Ho(value3, activeExportPresetSlot);
  const value5 = bd(qr.value, activeExportPresetSlot);
  value3.name = value5;
  T.exportPresets = exportPresetSlots;
  Ka();
  nn();
  V();
  if (value5 !== value4) {
    _("已重命名为“" + value5 + "”。", "success");
  }
});
f("#export-preset-delete-close").addEventListener("click", lr);
f("#export-preset-delete-cancel").addEventListener("click", lr);
gi.addEventListener("cancel", (event) => {
  event.preventDefault();
  lr();
});
Uh.addEventListener("submit", (event) => {
  event.preventDefault();
  qf();
});
je.addEventListener("input", (value) => {
  if (!value.target?.closest?.("#export-preset-slots")) {
    Za();
  }
});
je.addEventListener("change", (value) => {
  if (!value.target?.closest?.("#export-preset-slots")) {
    Za();
  }
});
je.addEventListener("click", (value) => {
  if (
    value.target?.closest?.(
      "[data-camera-view], [data-camera-mode], [data-camera-rotate-top]",
    )
  ) {
    Za();
  }
});
wt.addEventListener("input", () => sr("width"));
yt.addEventListener("input", () => sr("height"));
wt.addEventListener("change", () => sr("width", true));
yt.addEventListener("change", () => sr("height", true));
vn.addEventListener("change", () => {
  const { width: value, height: value2 } = Et();
  if (vn.checked) {
    At = value / value2;
  }
  qa();
});
f("#export-use-fixed").addEventListener("click", al);
la.addEventListener("change", () => cr(la.value));
_r.addEventListener("click", Cd);
function ja(status = "ready") {
  if (!!$e && !!Ue && window.parent !== window && !!T) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-base-lighting-state",
        componentId: Ue,
        status: status,
        lighting: normalizeBaseLighting(hn),
        savedLighting: normalizeBaseLighting(T.baseLighting),
        defaults: normalizeBaseLighting(DEFAULT_BASE_LIGHTING),
      },
      window.location.origin,
    );
  }
}
function Qg() {
  if (!!$e && !!Ue && window.parent !== window && !!T) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-floor-state",
        componentId: Ue,
        floors: T.floors.map((floors) => ({
          id: floors.id,
          name: floors.name,
        })),
        floorSelection: fe() === "all" ? "all" : Te()?.id || xe,
      },
      window.location.origin,
    );
  }
}
window.addEventListener("message", (value) => {
  if (
    !$e ||
    value.origin !== window.location.origin ||
    value.source !== window.parent
  ) {
    return;
  }
  const data = value.data;
  if (!!data && data.componentId === Ue) {
    if (data.type === "ha-bridge-floorplan-auto-diagram-floor") {
      if (data.command === "set-floor") {
        const value2 = T.floors.find((value4) => value4.id === data.value);
        const value3 =
          data.value === "all" && T.floors.length > 1
            ? "all"
            : value2?.id || Te()?.id || xe;
        cr(value3);
        Qg();
      }
      return;
    }
    if (data.type === "ha-bridge-floorplan-auto-diagram-base-lighting") {
      if (data.command === "request-state") {
        Me.hidden = true;
        jt(T.baseLighting);
        ja("ready");
      } else if (data.command === "preview") {
        Me.hidden = true;
        jt(data.lighting);
        ja("preview");
      } else if (data.command === "reset") {
        Me.hidden = true;
        jt(DEFAULT_BASE_LIGHTING);
        ja("preview");
      } else if (data.command === "save") {
        Me.hidden = true;
        jt(data.lighting);
        nd();
        ja("saved");
      } else if (data.command === "cancel" || data.command === "close") {
        qs();
        ja("cancelled");
      } else {
        td();
      }
      return;
    }
    if (data.type === "ha-bridge-floorplan-auto-diagram-camera") {
      const value2 = dt();
      if (data.command === "restore") {
        const value3 = data.value || {};
        value2.cameraMode =
          value3.mode === "perspective" ? "perspective" : "orthographic";
        value2.cameraView = value3.view === "top" ? "top" : "free";
        value2.cameraTopRotation =
          (((Math.round(finite(value3.topRotation, 0) / 90) * 90) % 360) +
            360) %
          360;
        value2.cameraFocalLength = clamp(
          finite(value3.focalLength, 50),
          18,
          120,
        );
        if (value3.snapshot) {
          uo(value3.snapshot, value3.snapshot.viewportAspect);
        } else {
          Wt(value2.cameraMode, {
            preserveView: true,
          });
          Oo(value2.cameraView, {
            force: true,
          });
          Ot();
        }
      } else if (data.command === "set-view") {
        value2.cameraView = data.value === "top" ? "top" : "free";
        Oo(value2.cameraView);
      } else if (data.command === "set-mode") {
        value2.cameraMode =
          data.value === "perspective" ? "perspective" : "orthographic";
        Wt(value2.cameraMode);
      } else if (data.command === "rotate-top") {
        value2.cameraView = "top";
        value2.cameraTopRotation = (en() + 90) % 360;
        Oo("top", {
          force: true,
        });
      } else if (data.command === "set-focal-length") {
        value2.cameraFocalLength = clamp(finite(data.value, tn()), 18, 120);
        Ot();
      }
      nt();
      return;
    }
    if (data.type === "ha-bridge-floorplan-auto-diagram-generate" && !ze) {
      for (const value2 of je.querySelectorAll("input[data-export-file]")) {
        value2.checked = true;
      }
      ht.value = String(data.folderName || "").trim();
      wt.value = String(
        Math.round(clamp(finite(data.width, wt.value), 320, 4096)),
      );
      yt.value = String(
        Math.round(clamp(finite(data.height, yt.value), 320, 4096)),
      );
      vn.checked = true;
      qa();
      Cd();
    }
  }
});
for (const e of _l) {
  e.addEventListener("click", () => {
    const value = e.dataset.previewSync !== "manual";
    if (value !== nr()) {
      te();
      scene.settings.livePreviewEnabled = value;
      V();
      Na();
      if (value) {
        qe({
          force: true,
        });
      } else {
        pd();
      }
    }
  });
}
ia.addEventListener("click", () =>
  qe({
    force: true,
  }),
);
ci?.addEventListener("click", pd);
Ze.addEventListener("pointerdown", (value) => {
  if (value.button === 0) {
    Ft = {
      pointerId: value.pointerId,
      startX: value.clientX,
      startY: value.clientY,
      startPreviewRatio: scene.settings.previewPanelRatio,
      startWidthRatio: scene.settings.detailsPanelWidthRatio,
    };
    da.classList.add("resizing");
    yo.classList.add("resizing");
    Ze.dataset.resizeAxis = "pending";
    Ze.setPointerCapture(value.pointerId);
  }
});
Ze.addEventListener("pointermove", (value) => {
  if (Ft?.pointerId === value.pointerId) {
    if ((value.buttons & 1) === 0) {
      fo(value);
      return;
    }
    nf(value);
  }
});
const fo = (value, value2 = true) => {
  if (
    !Ft ||
    (value?.pointerId !== undefined && Ft.pointerId !== value.pointerId)
  ) {
    return;
  }
  const value3 = Ft;
  Ft = null;
  const value4 =
    Math.abs(scene.settings.previewPanelRatio - value3.startPreviewRatio) >
      0.0001 ||
    Math.abs(scene.settings.detailsPanelWidthRatio - value3.startWidthRatio) >
      0.0001;
  da.classList.remove("resizing");
  yo.classList.remove("resizing");
  delete Ze.dataset.resizeAxis;
  if (value2) {
    try {
      if (Ze.hasPointerCapture(value3.pointerId)) {
        Ze.releasePointerCapture(value3.pointerId);
      }
    } catch {}
  }
  if (value4) {
    V();
  }
};
Ze.addEventListener("pointerup", fo);
Ze.addEventListener("pointercancel", fo);
Ze.addEventListener("lostpointercapture", (value) => fo(value, false));
window.addEventListener("pointerup", fo, true);
window.addEventListener("pointercancel", fo, true);
window.addEventListener("blur", () => fo());
Ze.addEventListener("keydown", (event) => {
  const value =
    event.key === "ArrowUp" ? -0.03 : event.key === "ArrowDown" ? 0.03 : 0;
  const value2 =
    event.key === "ArrowLeft" ? 0.03 : event.key === "ArrowRight" ? -0.03 : 0;
  if (!value && !value2) {
    return;
  }
  event.preventDefault();
  const value3 = er();
  scene.settings.previewPanelRatio = clamp(
    scene.settings.previewPanelRatio + value,
    value3.minimumHeightRatio,
    value3.maximumHeightRatio,
  );
  scene.settings.detailsPanelWidthRatio = clamp(
    scene.settings.detailsPanelWidthRatio + value2,
    value3.minimumWidthRatio,
    value3.maximumWidthRatio,
  );
  Ws();
  Hs();
  V();
});
for (const e of Kl) {
  e.addEventListener("click", () => {
    const value =
      e.dataset.cameraMode === "perspective" ? "perspective" : "orthographic";
    if (value !== Pt()) {
      if (!W) {
        te();
      }
      dt().cameraMode = value;
      Wt(value);
      if (W) {
        pe.textContent =
          value === "perspective" ? "已切换为透视构图" : "已切换为正交构图";
      } else {
        V();
      }
    }
  });
}
for (const e of Ul) {
  e.addEventListener("click", () => {
    const value = e.dataset.cameraView === "top" ? "top" : "free";
    if (value !== gt()) {
      if (!W) {
        te();
      }
      dt().cameraView = value;
      Oo(value);
      if (W) {
        pe.textContent =
          value === "top" ? "已切换为顶视构图" : "已切换为自由构图";
      } else {
        V();
      }
    }
  });
}
for (const e of Zl) {
  e.addEventListener("click", () => {
    if (gt() === "top") {
      if (!W) {
        te();
      }
      dt().cameraTopRotation = (en() + 90) % 360;
      Oo("top", {
        force: true,
      });
      if (W) {
        pe.textContent = "顶视已旋转 " + en() + "°";
      } else {
        V();
      }
    }
  });
}
for (const e of hi) {
  e.addEventListener("change", () => {
    const value = clamp(finite(e.value, tn()), 18, 120);
    for (const element of hi) {
      element.value = String(Math.round(value));
    }
    if (!(Math.abs(value - tn()) < 1e-8)) {
      if (!W) {
        te();
      }
      dt().cameraFocalLength = value;
      Ot();
      if (W) {
        pe.textContent = "焦段已设为 " + Math.round(value) + " mm";
      } else {
        V();
      }
    }
  });
}
for (const e of Ql) {
  e.addEventListener("input", () => od(e));
  e.addEventListener("change", () => {
    od(e);
    Ys();
  });
}
for (const e of Gh) {
  e.addEventListener("click", td);
}
Ah?.addEventListener("click", qs);
Fh?.addEventListener("click", nd);
Dh?.addEventListener("click", () => {
  jt(DEFAULT_BASE_LIGHTING);
});
sa?.addEventListener("pointerdown", (value) => {
  if (value.button !== 0 || value.target.closest("button")) {
    return;
  }
  const value2 = Me.getBoundingClientRect();
  bt = {
    pointerId: value.pointerId,
    startX: value.clientX,
    startY: value.clientY,
    startLeft: value2.left,
    startTop: value2.top,
    moved: false,
  };
  try {
    sa.setPointerCapture(value.pointerId);
  } catch {}
});
sa?.addEventListener("pointermove", (event) => {
  if (!bt || event.pointerId !== bt.pointerId) {
    return;
  }
  const value = event.clientX - bt.startX;
  const value2 = event.clientY - bt.startY;
  if (!bt.moved && Math.hypot(value, value2) < 4) {
    return;
  }
  bt.moved = true;
  event.preventDefault();
  const value3 = Me.getBoundingClientRect();
  const count = Math.max(8, window.innerWidth - value3.width - 8);
  const count2 = Math.max(8, window.innerHeight - value3.height - 8);
  Me.style.right = "auto";
  Me.style.left = clamp(bt.startLeft + value, 8, count) + "px";
  Me.style.top = clamp(bt.startTop + value2, 8, count2) + "px";
});
const s0 = (value) => {
  if (!!bt && value.pointerId === bt.pointerId) {
    bt = null;
  }
};
sa?.addEventListener("pointerup", s0);
sa?.addEventListener("pointercancel", s0);
vs?.addEventListener("message", (value) => {
  if (value.data?.type !== "base-lighting-saved") {
    return;
  }
  const baseLighting = normalizeBaseLighting(value.data.lighting);
  if (T) {
    T.baseLighting = baseLighting;
  }
  jt(baseLighting);
});
Fr.addEventListener("click", () => {
  te();
  scene.settings.snapEnabled = scene.settings.snapEnabled === false;
  Ns();
  Wn();
  ae();
  V();
});
Bl.addEventListener("click", (event) => {
  event.stopPropagation();
  Vs(oa.hidden);
});
oa.addEventListener("pointerdown", (event) => event.stopPropagation());
for (const e of Ol) {
  e.addEventListener("change", () => {
    te();
    scene.settings[e.dataset.snapSetting] = e.checked;
    Wn();
    ae();
    V();
  });
}
mo.addEventListener("input", () => {
  Wl.textContent = mo.value + " px";
});
mo.addEventListener("change", () => {
  const value = clamp(Math.round(finite(mo.value, 13)), 6, 24);
  if (value !== scene.settings.snapTolerance) {
    te();
    scene.settings.snapTolerance = value;
    Ns();
    Wn();
    ae();
    V();
  }
});
na.addEventListener("click", () => o0());
zl.addEventListener("click", jc);
f("#scale-close").addEventListener("click", () => {
  Yt = null;
  aa.close();
  ae();
});
f("#scale-cancel").addEventListener("click", () => {
  Yt = null;
  aa.close();
  Bt("scale");
});
th.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!Yt) {
    return;
  }
  const meters = finite(Ar.value, 0);
  const value = distance(Yt.start, Yt.end);
  if (meters <= 0 || value <= 0) {
    _("请输入有效的真实长度。", "error");
    return;
  }
  te();
  scene.calibration = {
    pixelsPerMeter: value / meters,
    reference: {
      ...Yt,
      meters: meters,
    },
  };
  Yt = null;
  aa.close();
  Bt("wall");
  ye();
  pn();
  V();
  const value2 = Te();
  if (
    T.floors.findIndex((value3) => value3.id === value2?.id) > 0 &&
    value2?.alignmentPending
  ) {
    requestAnimationFrame(() => $c());
    _("比例已标定，接下来设置上下楼层的参照点。");
  } else {
    _("比例已标定，可以沿着底图连续描墙了。");
  }
});
for (const e of [
  f("#wall-height"),
  f("#wall-thickness"),
  f("#wall-opacity-mode"),
  f("#wall-opacity"),
  f("#wall-open-end-mode"),
]) {
  e.addEventListener("change", () => It("wall"));
}
for (const e of [
  f("#window-width"),
  f("#window-height"),
  f("#window-sill"),
  f("#window-divider"),
]) {
  e.addEventListener("change", () => It("window"));
}
for (const e of [f("#door-type"), f("#door-width"), f("#door-height")]) {
  e.addEventListener("change", () => It("door"));
}
for (const e of [f("#railing-width"), f("#railing-height")]) {
  e.addEventListener("change", () => It("railing"));
}
for (const e of [
  f("#item-x"),
  f("#item-y"),
  f("#item-width"),
  f("#item-height"),
  f("#item-depth"),
  f("#item-elevation"),
  f("#item-rotation"),
  f("#item-vertical-rotation"),
  Hr,
]) {
  e.addEventListener("change", () => It("item"));
}
Vr.addEventListener("change", () => It("item"));
for (const e of [
  f("#label-title"),
  f("#label-title-spacing"),
  f("#label-subtitle"),
  f("#label-subtitle-spacing"),
  f("#label-line-length"),
]) {
  e.addEventListener("change", () => It("item"));
}
for (const e of [
  f("#light-group"),
  f("#light-temperature"),
  f("#light-brightness"),
  f("#light-range"),
  f("#light-angle"),
]) {
  e.addEventListener("change", () => It("item"));
}
f("#curtain-position").addEventListener("change", () => It("item"));
f("#round-table-turntable").addEventListener("change", () => It("item"));
f("#stair-direction").addEventListener("change", () => It("item"));
f("#tv-mount-style").addEventListener("change", () => It("item"));
Xl.addEventListener("click", () => {
  const value = ct();
  if (!!value && X?.kind === "item" && value.type === "shoecabinet") {
    te();
    value.shoeCabinetMirrored = value.shoeCabinetMirrored !== true;
    ye($a(value));
    V();
  }
});
Or.addEventListener("submit", (event) => event.preventDefault());
f("#door-hinge").addEventListener("click", () => {
  const value = ct();
  if (
    !!value &&
    X?.kind === "door" &&
    !["double", "entry", "sliding-glass", "roller-shutter"].includes(
      value.doorType,
    )
  ) {
    te();
    value.hinge = value.hinge === "right" ? "left" : "right";
    ye();
    V();
  }
});
f("#door-swing").addEventListener("click", () => {
  const value = ct();
  if (
    !!value &&
    X?.kind === "door" &&
    !["entry", "sliding-glass", "frame-only"].includes(value.doorType)
  ) {
    te();
    value.swing = value.swing === -1 ? 1 : -1;
    ye();
    V();
  }
});
for (const e of document.querySelectorAll("[data-rotate]")) {
  e.addEventListener("click", () => {
    const value = ct();
    if (!value || X?.kind !== "item") {
      return;
    }
    te();
    const value2 = value.rotation + Number(e.dataset.rotate);
    value.rotation =
      value.type === "striplight"
        ? normalizeFullRotation(value2)
        : value2 % 360;
    ye($a(value));
    V();
  });
}
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || je.open) {
    return;
  }
  if (event.key === "Escape" && !oa.hidden) {
    Vs(false);
    return;
  }
  const value =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    aa.open;
  if (event.code === "Space" && !value) {
    Pi = true;
    event.preventDefault();
  }
  if (event.key.toLowerCase() === "s" && !value) {
    Sa = true;
    Wn();
    ae();
  }
  if (value) {
    return;
  }
  if (event.key === "Shift" && !z && (we === "scale" || we === "wall")) {
    Ma = true;
    Wn();
    ae();
  }
  const value2 = event.metaKey || event.ctrlKey;
  if (value2 && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      _u();
    } else {
      Xu();
    }
    return;
  }
  if (value2 && event.key.toLowerCase() === "d") {
    event.preventDefault();
    of();
    return;
  }
  if (value2 && event.key.toLowerCase() === "c") {
    event.preventDefault();
    rf();
    return;
  }
  if (value2 && event.key.toLowerCase() === "v") {
    event.preventDefault();
    sf();
    return;
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    jc();
    return;
  }
  const value3 = {
    ArrowLeft: {
      x: -1,
      y: 0,
    },
    ArrowRight: {
      x: 1,
      y: 0,
    },
    ArrowUp: {
      x: 0,
      y: -1,
    },
    ArrowDown: {
      x: 0,
      y: 1,
    },
  }[event.key];
  if (value3 && !value2) {
    const value4 =
      X?.kind === "item"
        ? [X.id]
        : he
            .filter((value5) => value5.kind === "item")
            .map((value5) => value5.id);
    if (value4.length) {
      event.preventDefault();
      if (!event.repeat) {
        te();
      }
      const value5 =
        (event.altKey ? 0.01 : event.shiftKey ? 0.25 : 0.05) *
        (pixelsPerMeter() || 1);
      const allowed = new Set(value4);
      for (const value6 of scene.items) {
        if (allowed.has(value6.id)) {
          value6.x += value3.x * value5;
          value6.y += value3.y * value5;
        }
      }
      ye(za());
      V();
      return;
    }
  }
  if (event.key === "Escape") {
    if (ue) {
      event.preventDefault();
      zc();
      return;
    }
    Ui();
    o0();
    const value4 = Ao();
    Gt();
    St();
    ae();
    Ba(value4);
  }
});
window.addEventListener("keyup", (value) => {
  if (value.code === "Space") {
    Pi = false;
  }
  if (value.key.toLowerCase() === "s") {
    Sa = false;
    Wn();
    ae();
  }
  if (value.key === "Shift") {
    Ma = false;
    Wn();
    ae();
  }
});
window.addEventListener("blur", () => {
  Pi = false;
  Ma = false;
  Sa = false;
});
window.addEventListener("beforeunload", (event) => {
  if (Tn !== Jn) {
    event.preventDefault();
    event.returnValue = "";
  }
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    nt();
  }
});
if (new URLSearchParams(window.location.search).has("model-export")) {
  window.__haBridgeExportFurnitureJson = (type, value = {}) => {
    const value2 = xt[type];
    if (!value2) {
      throw new Error("Unknown furniture type: " + type);
    }
    const value3 = {
      id: "offline-export-" + type,
      type: type,
      width: value2.width,
      height: value2.height,
      depth: value2.depth,
      elevation: value2.elevation || 0,
      rotation: 0,
      curtainPosition: "split",
      roundTableTurntable: false,
      stairDirection: "right",
      shoeCabinetMirrored: false,
      tvMountStyle: "standard",
      screenEnabled: true,
      offlineModelExport: true,
      ...value,
    };
    const value4 = ul(value3);
    value4.name = "ha-bridge-v1-" + type;
    value4.updateMatrixWorld(true);
    const value5 = value4.toJSON();
    Bn(value4);
    return value5;
  };
  const o = new URLSearchParams(window.location.search).get("model-export");
  if (o && o !== "1") {
    const n =
      {
        curtain_left: {
          type: "curtain",
          curtainPosition: "left",
        },
        curtain_right: {
          type: "curtain",
          curtainPosition: "right",
        },
        curtain_split: {
          type: "curtain",
          curtainPosition: "split",
        },
        rounddiningtable_turntable: {
          type: "rounddiningtable",
          roundTableTurntable: true,
        },
        tv_standard: {
          type: "tv",
          tvMountStyle: "standard",
        },
        tv_tabletop: {
          type: "tv",
          tvMountStyle: "tabletop",
        },
        tv_mobile: {
          type: "tv",
          tvMountStyle: "mobile",
        },
      }[o] || {};
    const a = n.type || o;
    requestAnimationFrame(() => {
      try {
        const element = document.createElement("textarea");
        element.id = "ha-bridge-model-export";
        element.hidden = true;
        const value = JSON.stringify(
          window.__haBridgeExportFurnitureJson(a, n),
        );
        element.value = value;
        element.textContent = value;
        document.body.append(element);
        document.documentElement.dataset.modelExportReady = o;
      } catch (error) {
        document.documentElement.dataset.modelExportError =
          error?.message || String(error);
      }
    });
  }
}
const Ht = new URLSearchParams(window.location.search).get("material-test");
if (Ht) {
  (async () => {
    const value = new THREE.Group();
    try {
      document.documentElement.dataset.materialTestStage = "loading";
      const value2 = xt[Ht];
      if (!value2 || !ALL_ITEM_MODELS[Ht]) {
        throw new Error("Unsupported material test type: " + Ht);
      }
      if (!(await Qr(Ht))) {
        throw new Error("Material test model failed to load: " + Ht);
      }
      document.documentElement.dataset.materialTestStage = "renderer";
      for (let value6 = 0; !renderer && value6 < 120; value6 += 1) {
        await ir();
      }
      if (!renderer || !camera || !ve) {
        throw new Error("Material test renderer was not initialized");
      }
      const value3 = [];
      for (let value6 = 0; value6 < 3; value6 += 1) {
        const value7 = {
          id: "material-test-" + Ht + "-" + (value6 + 1),
          type: Ht,
          width: value2.width,
          height: value2.height,
          depth: value2.depth,
          elevation: 0,
          rotation: 0,
        };
        const value8 = new THREE.Group();
        if (!xi(value8, value7)) {
          throw new Error("Material test model was not mounted: " + Ht);
        }
        value8.traverse((value9) => {
          if (!value9.isMesh) {
            return;
          }
          const list = Array.isArray(value9.material)
            ? value9.material
            : [value9.material];
          value3.push(...list.filter(Boolean));
        });
        value.add(value8);
      }
      document.documentElement.dataset.materialTestStage = "compiling";
      renderer.compile(value, camera, ve);
      const unique = new Set(value3).size;
      for (let value6 = 0; value6 < 600; value6 += 1) {
        const value7 = _t.modelLoadState();
        if (value7.active === 0 && value7.queued === 0) {
          break;
        }
        await ir();
      }
      const value4 = _t.modelLoadState();
      const value5 = {
        models: 3,
        slots: value3.length,
        unique: unique,
        shared: value3.length - unique,
        cacheMaterials: value4.materials,
        cacheReuses: value4.materialReuses,
      };
      document.documentElement.dataset.materialTestStats =
        JSON.stringify(value5);
      const element = document.createElement("output");
      element.id = "ha-bridge-material-test-output";
      element.setAttribute("aria-live", "polite");
      element.textContent =
        "材质测试 " +
        Ht +
        "：" +
        value5.models +
        " 个模型，" +
        value5.slots +
        " 个材质槽，" +
        value5.unique +
        " 种唯一材质，" +
        value5.shared +
        " 个槽复用；当前缓存 " +
        value5.cacheMaterials +
        " 种，累计复用 " +
        value5.cacheReuses +
        " 次。";
      document.body.append(element);
      document.documentElement.dataset.materialTestReady = Ht;
      document.documentElement.dataset.materialTestStage = "ready";
    } catch (error) {
      document.documentElement.dataset.materialTestError =
        error?.message || String(error);
      document.documentElement.dataset.materialTestStage = "error";
    } finally {
      Bn(value);
    }
  })();
}
const Uo = new URLSearchParams(window.location.search).get("instance-test");
if (Uo) {
  const e = new THREE.Group();
  const o = new THREE.BoxGeometry(0.5, 0.86, 0.5);
  try {
    if (as.has(Uo)) {
      throw new Error("Unsupported instance test type: " + Uo);
    }
    const t = [];
    for (let a = 0; a < 3; a += 1) {
      const i = {
        id: "instance-test-" + Uo + "-" + (a + 1),
        type: Uo,
      };
      const group = new THREE.Group();
      const r = new THREE.Mesh(
        o,
        new THREE.MeshStandardMaterial({
          color: ua.furniture,
          roughness: 0.72,
        }),
      );
      r.position.y = 0.43;
      r.userData.externalModelSharedGeometry = true;
      group.position.x = a * 0.9;
      group.rotation.y = THREE.MathUtils.degToRad(a * 30);
      group.add(r);
      e.add(group);
      t.push({
        item: i,
        group: group,
      });
    }
    const n = fl(e, t);
    document.documentElement.dataset.instanceTestStats = JSON.stringify(n);
    document.documentElement.dataset.instanceTestReady = Uo;
  } catch (error) {
    document.documentElement.dataset.instanceTestError =
      error?.message || String(error);
  } finally {
    Bn(e);
    o.dispose();
  }
}
new ResizeObserver(zs).observe(Ct);
initializeStudioSelects();
initializeNumberInputs();
Ys();
Xg();
