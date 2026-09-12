import { windowGeometryParts } from "./studio-window-geometry.js?v=20260911-wide-window-v1";
import { addSecurityModel } from "./studio-security-models.js?v=20260911-reference-palette-v1";
import { compactRuntimeFurniture } from "./studio-runtime-furniture.js?v=20260909-runtime-furniture-v1";
import { createReflectionDetail } from "./studio-reflection-detail.js?v=20260909-reflection-scope-v1";
import { createFloorTransition } from "./studio-floor-transition.js?v=20260909-floor-reuse-v2-20260911-floor-handoff-v1";
import { floorOpeningPolygon } from "./studio-floor-openings.js?v=20260908-floor-openings-v1";
import { createGroundReflections } from "./studio-ground-reflections.js?v=20260909-reflection-scope-v1-20260910-wall-runtime-v21-floor-handoff-v20-effects-settle-v5-no-blur-v1-overlay-scope-v1";
import { createMotionPresentation } from "./studio-motion-presentation.js?v=20260910-effects-settle-v6-focus-live-v1";
import { createWallSideMaterial, setWallGradientHeight, setWallCornerDistances, mergeWallBands } from "./studio-wall-materials.js?v=wall-device-D6-20260910210335-shade-v2";
import { RENDER_CACHE_VERSION, createRenderCache, cacheSceneDescriptor, sha256, stableCacheJSON } from "../modules/interaction3d/render-cache.js?v=20260907-demand-v1-20260908-curtains-v1-20260912-sha-export-v2";
import { transformSceneCamera } from "../modules/interaction3d/scene-frame.js?v=20260907-scene-sync-v1-20260908-curtains-v1";
import { sceneUpdatePlan } from "../modules/interaction3d/scene-update.js?v=20260907-update-v1-20260908-curtains-v1";
import { createDemandFrameLoop } from "../modules/interaction3d/frame-loop.js?v=20260907-demand-v1-20260908-curtains-v1";
import { cacheObjectTransforms } from "../modules/interaction3d/scene-matrices.js?v=20260907-demand-v2-20260908-curtains-v1";
import { withRequestTimeout } from "../utils/request-timeout.js?v=20260907-browser-compat-v1";
import * as THREE from "/bridge-static/vendor/three/0.186.0/three.module.min.js";
import { OrbitControls } from "/bridge-static/vendor/three/0.186.0/OrbitControls.js?v=20260910-three-0186-rotate-smoothing-v1";
import { RoundedBoxGeometry } from "/bridge-static/vendor/three/0.186.0/RoundedBoxGeometry.js";
import { mergeGeometries } from "/bridge-static/vendor/three/0.186.0/BufferGeometryUtils.js";
import { GLTFLoader } from "/bridge-static/vendor/three/0.186.0/GLTFLoader.js?v=20260910-three-0186-glb";
import { SameOriginDRACOLoader } from "./draco-loader.js?v=20260910-three-0186-decoder-path-v1";
import { createLightTransition, sampleLightTransition, lightTransitionDurationMs, mapLightEffectState, lightEffectColorHex } from "../modules/interaction3d/light-motion.js?v=20260907-light-defaults-v1-20260908-curtains-v1";
import { adaptiveDeviceLightBudget, adaptiveLightRenderCost, assessAdaptiveRenderFrames, axisLockedPoint, canonicalPolygonKey, clamp, clampWindowT, closedWallFloorPolygons, closedWallPolygons, distance, doorLeafRotation, itemRotationFromPointers, localSpotShadowSettings, mergeCollinearWallSegments, modelBounds, nearestWall, pointInRotatedRectangle, pointInPolygon, planLabelProjectionMetrics, polygonArea, projectPointToSegment, resizeRotatedItemFromCorner, remapWallAttachment, selectShadowCastingLightIds, segmentIntersection, slidingDoorPanelCenters, spotShadowTextureUnitLimit, spotLightBrightnessResponse, splitWallSegments, snapPoint, uncoveredCollinearWallSegments, unclosedWallEndpoints, subtractPolygonLoops, validatedUnionPolygonLoops, wallLengthMeters, wallIntersections, wallJoinExtensions, wallSolidPieces } from "./geometry.js?v=20260903-wall-overlap-guard-v1-20260904-local-shadow-bands-v1-20260905-bounded-wall-faces-v1-20260908-floor-openings-v1";
import { buildLightDeltaPixels, buildStoredZip, EXPORT_IMAGE_EXTENSION, EXPORT_IMAGE_MIME_TYPE, EXPORT_IMAGE_QUALITY, EXPORT_RENDER_SCALE, scaledExportResolution } from "./export-utils.js?v=20260902-native-resolution-q95-v185";
import { MAX_EXPORT_PRESET_COUNT, exportPresetIsEmpty, normalizeActiveExportPresetSlot, normalizeExportPreset, normalizeExportPresetSlots } from "./export-presets.js?v=20260826-export-presets-v4";
import { reorderFloors } from "./floor-order.js?v=20260825-floor-reorder-v1";
import { syncControlValue } from "./ui-controls.js?v=20260826-input-stability-v1";
import { initializeNumberInputs, initializeStudioSelects, syncStudioSelect } from "./studio-widgets.js?v=20260901-studio-widgets-v1";
import { createExternalModelManager, ALL_ITEM_MODELS } from "./studio-external-models.js?v=20260904-studio-external-models-v48-load-state-20260905-client-log-v1-20260907-cache-representation-v1-20260908-curtains-v1-20260908-bed-base-v1-20260910-glasscabinet-back-v1-20260912-bed-geometry-revision-v1";
import { createPlanDrawingTools, drawTrackedText } from "./studio-plan-drawing.js?v=20260901-studio-plan-drawing-v2";
import { createSpotShadowAtlasController } from "./studio-shadow-atlas.js?v=20260912-shadow-atlas-skip-unbakeable-v2";
import { createRegionLightController } from "./studio-plan2-region-lights.js?v=20260909-reflection-scope-v1";
import { createContactShadowController } from "./studio-plan2-contact-shadows.js?v=20260909-batch-shadow-v4";
import { DEFAULT_BASE_LIGHTING, finite, itemMinimumHeight, kelvinToRgbHex, normalizeCameraSettings, normalizeBaseLighting, normalizeFixedCameraView, normalizeFullRotation, normalizeLabelText, normalizePoint } from "./studio-normalization.js?v=20260903-studio-normalization-v2";
window.__haBridgeStudioModuleVersion = "20260904-local-shadow-edge-v6-depth-precision-v1-model-load-state-v3-floor-scope-v1-ground-grid-v3-depth-fade-v2-local-shadow-depth-v1-export-shadow-quality-v1-base-light-entry-v1-auto-diagram-preview-hd-v1-auto-diagram-floor-v1-20260905-first-light-prewarm-v3-20260905-orbit-architecture-center-v1";
const selectEl = selector => document.querySelector(selector);
const isStageEmbed = window.location.pathname === "/api/v1/modules/interaction3d/stage.html";
const yt = isStageEmbed && new URLSearchParams(location.search).get("lighting") === "region";
const wallRuntimeProfile = "shader";
window.__haBridgeWallRuntimeProfile = wallRuntimeProfile || "baseline";
let studioReady = null;
let renderCache = null;
let ur = 1;
let isAutoDiagramEmbed = null;
let exportFolderQuery = "off";
let floorSelectionQuery = false;
let planCanvas = 0;
let vacuumMotionActive = false;
let canvasEmpty = 0;
let curtainMotionActive = false;
let saveState = "[]";
let importPlan = "[]";
let Vo = true;
const cache = isStageEmbed ? createRenderCache({
  sceneId: new URLSearchParams(window.location.search).get("sceneId"),
  projectId: new URLSearchParams(window.location.search).get("projectId"),
  report: argPrimary => {
    document.documentElement.dataset.lightRenderCache = JSON.stringify(argPrimary);
  }
}) : null;
window.addEventListener("pagehide", () => cache?.close(), {
  once: true
});
function computeLightRenderCacheKey(width, height) {
  const floors = getPreviewFloorModeCurrent() === "all" ? projectDocCurrent.floors : [activeFloor()];
  cameraCurrent.updateMatrixWorld();
  const roundMatrix = elements => elements.map(argPrimary => Math.round(argPrimary * 100000000) / 100000000);
  const visibility = [];
  worldGroup.traverse(object3d => {
    if (["background", "grid"].includes(object3d.userData?.exportRole)) {
      visibility.push([object3d.userData.exportRole, object3d.visible]);
    }
  });
  return sha256(stableCacheJSON({
    version: RENDER_CACHE_VERSION,
    scene: cacheSceneDescriptor(floors),
    mode: getPreviewFloorModeCurrent(),
    gap: projectDocCurrent.previewFloorGap,
    lighting: baseLighting,
    style: themeColors,
    visibility,
    reflections: exportFolderQuery,
    curtains: saveState,
    models: manager.cacheRepresentation(floors.flatMap(scene => scene.scene.items)),
    camera: {
      world: roundMatrix(cameraCurrent.matrixWorld.elements),
      projection: roundMatrix(cameraCurrent.projectionMatrix.elements)
    },
    width,
    height,
    toneMapping: renderer.toneMapping,
    exposure: renderer.toneMappingExposure,
    colorSpace: renderer.outputColorSpace,
    shadows: renderer.shadowMap.type
  }));
}
const autoDiagramComponentId = new URLSearchParams(window.location.search).get("auto-diagram-component") || "";
const isAutoDiagramEmbedCurrent = new URLSearchParams(window.location.search).get("auto-diagram-embed") === "1";
const entry = new URLSearchParams(window.location.search).get("export-folder") || "";
const floorSelectionQueryCurrent = new URLSearchParams(window.location.search).has("floor-selection") ? new URLSearchParams(window.location.search).get("floor-selection") : null;
if (isAutoDiagramEmbedCurrent) {
  document.body.classList.add("auto-diagram-embedded");
}
const element = selectEl("#plan-canvas");
const planStage = selectEl("#plan-stage");
const mf = selectEl("#canvas-empty");
const floorRenameInput = selectEl("#project-name");
const el = selectEl("#save-state");
const importPlanCurrent = selectEl("#import-plan");
const Ia = selectEl("#plan-file");
const toggleBackground = selectEl("#toggle-background");
const Ud = selectEl("#remove-plan");
const yf = selectEl("#add-floor");
const floorList = selectEl("#floor-list");
const alignFloor = selectEl("#align-floor");
const floorContextMenu = selectEl("#floor-context-menu");
const bl = selectEl("#floor-rename-dialog");
const toolEls = selectEl("#floor-rename-form");
const floorRenameInputCurrent = selectEl("#floor-rename-input");
const floorDeleteDialog = selectEl("#floor-delete-dialog");
const activeToolLabel = selectEl("#floor-delete-form");
const bf = selectEl("#floor-delete-name");
const saveConflictDialog = selectEl("#save-conflict-dialog");
const Mf = selectEl("#save-conflict-load");
const Sf = selectEl("#save-conflict-overwrite");
const globalWallHeight = selectEl("#global-wall-height");
const globalWallThickness = selectEl("#global-wall-thickness");
const globalWallOpacity = selectEl("#global-wall-opacity");
const toggleFloorEdge = selectEl("#toggle-floor-edge");
const Zd = [...document.querySelectorAll("[data-tool]")];
const yr = selectEl("#finish-wall");
const Kd = selectEl("#delete-selection");
const activeToolLabelCurrent = selectEl("#active-tool-label");
const toolHelp = selectEl("#tool-help");
const referencePixels = selectEl("#cursor-position");
const No = selectEl("#snap-indicator");
const snapToggle = selectEl("#snap-toggle");
const Ef = selectEl("#snap-toggle-state");
const Qd = selectEl("#snap-settings-toggle");
const xr = selectEl("#snap-settings-panel");
const snapSettingEls = [...document.querySelectorAll("[data-snap-setting]")];
const snapTolerance = selectEl("#snap-tolerance");
const jd = selectEl("#snap-tolerance-value");
const Lf = selectEl("#zoom-value");
const lightPropertyApplyTitle = selectEl("#scale-dialog");
const lightPropertyApplyValue = selectEl("#scale-form");
const applyLightPropertyEls = selectEl("#reference-pixels");
const toast = selectEl("#reference-meters");
const Il = selectEl("#light-group-rename-dialog");
const Tf = selectEl("#light-group-rename-form");
const lightGroupRenameInput = selectEl("#light-group-rename-input");
const Rl = selectEl("#light-property-apply-dialog");
const Rf = selectEl("#light-property-apply-form");
const wallFields = selectEl("#light-property-target-list");
const windowFields = selectEl("#light-property-selection-count");
const ka = selectEl("#light-property-toggle-all");
const Df = selectEl("#light-property-apply-title");
const Ff = selectEl("#light-property-apply-value");
const list = [...document.querySelectorAll("[data-apply-light-property]")];
const toastCurrent = selectEl("#toast");
const inspectorEmpty = selectEl("#inspector-empty");
const selectionInspector = selectEl("#selection-inspector");
const selectionHeadingEl = selectEl(".selection-heading");
const selectionId = selectEl("#selection-id");
const lightPreviewNote = selectEl("#light-preview-note");
const Af = selectEl("#wall-fields");
const zf = selectEl("#window-fields");
const Of = selectEl("#door-fields");
const Bf = selectEl("#railing-fields");
const Gf = selectEl("#item-fields");
const $f = selectEl("#label-text-fields");
const Wf = selectEl("#light-fields");
const Vf = selectEl("#item-height-field");
const Hf = selectEl("#item-elevation-field");
const Nf = selectEl("#item-rotation-field");
const Xf = selectEl("#item-rotation-actions");
const qf = selectEl("#item-vertical-rotation-field");
const _f = selectEl("#item-vertical-rotation-label");
const Yf = selectEl("#item-strip-orientation-heading");
const Uf = selectEl("#item-strip-roll-field");
const itemStripRoll = selectEl("#item-strip-roll");
const Zf = selectEl("#item-light-source-visibility-field");
const zl = selectEl("#item-light-source-visible");
const Kf = selectEl("#curtain-position-field");
const Qf = selectEl("#round-table-turntable-field");
const Jf = selectEl("#stair-direction-field");
const jf = selectEl("#tv-mount-style-field");
const eg = selectEl("#shoe-cabinet-actions");
const o0 = selectEl("#shoe-cabinet-mirror");
const tg = selectEl("#item-width-label");
const ng = selectEl("#item-depth-label");
const og = selectEl("#scene-counts");
const previewSyncEls = [...document.querySelectorAll("[data-preview-sync]")];
const r0 = [...document.querySelectorAll("[data-preview-floor]")];
const refreshPreview = selectEl("#refresh-preview");
const refreshLightPreview = selectEl("#refresh-light-preview");
const previewQualityStatus = selectEl("#preview-quality-status");
const modelLoadingStatus = selectEl("#model-loading-status");
let orbitResumeAfterModels = false;
const previewLightCache = selectEl("#preview-light-cache");
const previewRenderShield = selectEl("#preview-render-shield");
let cameraViewDebounceTimer = null;
const cameraViewEls = [...document.querySelectorAll("[data-camera-view]")];
const cameraRotateTopEls = [...document.querySelectorAll("[data-camera-rotate-top]")];
const cameraModeEls = [...document.querySelectorAll("[data-camera-mode]")];
const cameraFocalLengthEls = [...document.querySelectorAll("[data-camera-focal-length]")];
const baseLightControlEls = [...document.querySelectorAll("[data-base-light-control]")];
const baseLightControls = selectEl("#base-light-controls");
const baseLightControlsHeader = baseLightControls?.querySelector(".base-light-controls-header");
const ig = selectEl("#reset-base-lighting");
const rg = selectEl("#save-base-lighting");
const ag = selectEl("#close-base-lighting");
const sg = [selectEl("#open-base-lighting"), selectEl("#export-open-base-lighting")].filter(Boolean);
if (baseLightControls && baseLightControls.parentElement !== document.body) {
  document.body.append(baseLightControls);
}
const lg = selectEl("#save-camera-view");
const fixedCameraView = selectEl("#fixed-camera-view");
const cg = selectEl("#floor-camera-actions");
const dg = selectEl("#overview-camera-actions");
const ug = selectEl("#save-overview-view");
const fixedOverviewView = selectEl("#fixed-overview-view");
const hg = selectEl("#preview-floor-gap-control");
const previewFloorGapInput = selectEl("#preview-floor-gap");
const exportDialog = selectEl("#export-dialog");
const fg = selectEl("#export-preview-frame");
const exportPreviewStage = selectEl("#export-preview-stage");
const gg = selectEl("#export-preset-empty-state");
const pg = selectEl("#export-preset-empty-title");
const exportWidth = selectEl("#export-width");
const exportHeight = selectEl("#export-height");
const exportLockRatio = selectEl("#export-lock-ratio");
const mg = selectEl("#export-aspect-label");
const wg = selectEl("#export-resolution-label");
const exportStatus = selectEl("#export-status");
const exportPackage = selectEl("#export-package");
const exportFolderName = selectEl("#export-folder-name");
const exportSaveView = selectEl("#export-save-view");
const exportGroupFiles = selectEl("#export-group-files");
const exportFloorSelect = selectEl("#export-floor-select");
const yg = selectEl("#export-floor-gap-control");
const exportFloorGap = selectEl("#export-floor-gap");
const h0 = selectEl("#export-preset-slots");
const f0 = selectEl("#export-preset-add");
const g0 = selectEl("#export-preset-rename");
const p0 = selectEl("#export-preset-delete");
const exportPresetRenameDialog = selectEl("#export-preset-rename-dialog");
const detailsPanelEl = selectEl("#export-preset-rename-form");
const exportPresetRenameInput = selectEl("#export-preset-rename-input");
const exportPresetDeleteDialog = selectEl("#export-preset-delete-dialog");
const vg = selectEl("#export-preset-delete-form");
const bg = selectEl("#export-preset-delete-name");
const exportOverwriteDialog = selectEl("#export-overwrite-dialog");
const Mg = selectEl("#export-overwrite-name");
const exportCompleteDialog = selectEl("#export-complete-dialog");
const Sg = selectEl("#export-complete-title");
const Pg = selectEl("#export-complete-message");
const Eg = selectEl("#export-complete-path");
const studioShellEl = selectEl(".studio-shell");
const detailsPanelElCurrent = selectEl(".details-panel");
const detailsResizer = selectEl("#details-resizer");
const m0 = [...document.querySelectorAll("[data-asset-category]")];
const itemCatalog = [...document.querySelectorAll("[data-asset-heading-category]")];
const w0 = [...document.querySelectorAll("[data-item-type]")];
const lightItemTypes = selectEl("#asset-grid");
const stairLikeTypes = selectEl("#light-asset-row");
const lightLayerPanel = selectEl("#light-layer-panel");
const lightGroupList = selectEl("#light-group-list");
const Tg = selectEl("#add-light-group");
const fridgeSize = selectEl("#light-groups-off");
const lightGroupContextMenu = selectEl("#light-group-context-menu");
const HELPER_LAYER = 2;
const themeColors = {
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
  exposure: 1.05
};
const furnitureCatalog = {
  flooropening: {
    name: "楼板洞口",
    glyph: "▧",
    width: 2,
    depth: 3,
    height: 0.16,
    color: "#db9e54"
  },
  planlabel: {
    name: "户型铭牌",
    glyph: "T",
    width: 4.5,
    depth: 1.35,
    height: 0.01,
    color: "#cbd4e2"
  },
  sofa: {
    name: "沙发",
    glyph: "▰",
    width: 2.2,
    depth: 0.9,
    height: 0.82,
    color: "#c98a58"
  },
  smallcar: {
    name: "小汽车",
    glyph: "◆",
    width: 2.19,
    depth: 5.01,
    height: 1.43,
    color: "#8f969d"
  },
  bed: {
    name: "双人床",
    glyph: "▤",
    width: 1.8,
    depth: 2,
    height: 0.62,
    color: "#d8d4c9"
  },
  curtain: {
    name: "窗帘",
    glyph: "▥",
    width: 1.8,
    depth: 0.18,
    height: 2.4,
    color: "#7d8799"
  },
  nightstand: {
    name: "床头柜",
    glyph: "▣",
    width: 0.5,
    depth: 0.42,
    height: 0.55,
    color: "#8d6d57"
  },
  table: {
    name: "餐桌组合",
    glyph: "▦",
    width: 2.4,
    depth: 1.8,
    height: 0.82,
    color: "#9b6945"
  },
  rounddiningtable: {
    name: "圆形餐桌",
    glyph: "◉",
    width: 2.2,
    depth: 2.2,
    height: 0.78,
    color: "#6f5544"
  },
  rounddiningtableturntable: {
    name: "圆形餐桌（带转盘）",
    glyph: "◎",
    width: 2.2,
    depth: 2.2,
    height: 0.78,
    color: "#6f5544"
  },
  squarecoffeetable: {
    name: "方茶几",
    glyph: "▦",
    width: 1.4,
    depth: 0.7,
    height: 0.46,
    color: "#8d96aa"
  },
  bar: {
    name: "吧台",
    glyph: "▰",
    width: 2.2,
    depth: 0.65,
    height: 1.05,
    color: "#8b674d"
  },
  aquarium: {
    name: "鱼缸",
    glyph: "▣",
    width: 1.5,
    depth: 0.55,
    height: 1.4,
    color: "#7896a4"
  },
  coffeetable: {
    name: "组合茶几",
    glyph: "◉",
    width: 1.7,
    depth: 1.25,
    height: 0.5,
    color: "#8d96aa"
  },
  sideboard: {
    name: "餐边柜",
    glyph: "▤",
    width: 1.6,
    depth: 0.45,
    height: 2.2,
    color: "#94745d"
  },
  shoecabinet: {
    name: "鞋柜",
    glyph: "▥",
    width: 1.8,
    depth: 0.42,
    height: 2.25,
    color: "#8e7764"
  },
  stairs: {
    name: "楼梯",
    glyph: "⇧",
    width: 1,
    depth: 2.8,
    height: 1.65,
    color: "#8b95a6"
  },
  steelstairs: {
    name: "钢楼梯",
    glyph: "⇧",
    width: 1.86,
    depth: 2.93,
    height: 3.45,
    color: "#7d8799"
  },
  glassstairs: {
    name: "玻璃楼梯",
    glyph: "⇧",
    width: 2.51,
    depth: 2.84,
    height: 3.41,
    color: "#a9c5d3"
  },
  chair: {
    name: "椅子",
    glyph: "◇",
    width: 0.5,
    depth: 0.5,
    height: 0.86,
    color: "#b47b51"
  },
  cabinet: {
    name: "储物柜",
    glyph: "▥",
    width: 1.6,
    depth: 0.45,
    height: 1.9,
    color: "#9a7658"
  },
  glasscabinet: {
    name: "玻璃柜",
    glyph: "▧",
    width: 1.2,
    depth: 0.4,
    height: 1.9,
    color: "#90755f"
  },
  bookcase: {
    name: "书架",
    glyph: "▥",
    width: 1.2,
    depth: 0.32,
    height: 1.9,
    color: "#8f7058"
  },
  shelf: {
    name: "货架",
    glyph: "▤",
    width: 1.2,
    depth: 0.45,
    height: 1.8,
    color: "#778391"
  },
  pillar: {
    name: "柱子",
    glyph: "▣",
    width: 0.45,
    depth: 0.45,
    height: 2.8,
    color: "#9099aa"
  },
  wallcabinet: {
    name: "吊柜",
    glyph: "▧",
    width: 1.5,
    depth: 0.35,
    height: 0.82,
    color: "#9a806c"
  },
  kitchenbase: {
    name: "厨房地柜",
    glyph: "▤",
    width: 2.4,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865"
  },
  kitchensink: {
    name: "地柜带水盆",
    glyph: "▣",
    width: 1.2,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865"
  },
  kitchencooktop: {
    name: "地柜带燃气灶",
    glyph: "▦",
    width: 1.2,
    depth: 0.6,
    height: 0.85,
    color: "#8f7865"
  },
  fridge: {
    name: "冰箱",
    glyph: "▯",
    width: 0.75,
    depth: 0.72,
    height: 1.85,
    color: "#b8c3c8"
  },
  storagewaterheater: {
    name: "储水式热水器",
    glyph: "◉",
    width: 0.86,
    depth: 0.46,
    height: 0.48,
    elevation: 1.65,
    color: "#e5e9ec"
  },
  gaswaterheater: {
    name: "燃气热水器",
    glyph: "▯",
    width: 0.42,
    depth: 0.22,
    height: 0.72,
    elevation: 1.55,
    color: "#e3e7e9"
  },
  pipelinewaterpurifier: {
    name: "管线机",
    glyph: "▥",
    width: 0.48,
    depth: 0.24,
    height: 0.68,
    elevation: 1.42,
    color: "#e2e6e7"
  },
  tea_bar_machine: {
    name: "茶吧机",
    glyph: "▤",
    width: 0.62,
    depth: 0.48,
    height: 1.8,
    color: "#b8b5ac"
  },
  elevator: {
    name: "电梯",
    glyph: "⇧",
    width: 1.4,
    depth: 1.52,
    height: 2.2,
    color: "#b8c3c8"
  },
  washer: {
    name: "洗衣机",
    glyph: "◉",
    width: 0.6,
    depth: 0.65,
    height: 0.85,
    color: "#b8c3c8"
  },
  airoutlet: {
    name: "出风口",
    glyph: "▥",
    width: 0.188,
    depth: 2,
    height: 0.3,
    elevation: 2,
    color: "#a8adb2"
  },
  dryer: {
    name: "烘干机",
    glyph: "◎",
    width: 0.6,
    depth: 0.65,
    height: 0.85,
    color: "#aeb9c3"
  },
  dishwasher: {
    name: "洗碗机",
    glyph: "▤",
    width: 0.6,
    depth: 0.6,
    height: 0.82,
    color: "#b8c3c8"
  },
  steamoven: {
    name: "蒸烤箱",
    glyph: "▣",
    width: 0.6,
    depth: 0.55,
    height: 0.6,
    elevation: 0.82,
    color: "#aeb9c3"
  },
  microwave: {
    name: "微波炉",
    glyph: "▭",
    width: 0.52,
    depth: 0.42,
    height: 0.32,
    elevation: 0.85,
    color: "#aeb9c3"
  },
  ricecooker: {
    name: "电饭煲",
    glyph: "◉",
    width: 0.28,
    depth: 0.32,
    height: 0.25,
    elevation: 0.85,
    color: "#b8c3c8"
  },
  rangehood: {
    name: "油烟机",
    glyph: "◢",
    width: 0.9,
    depth: 0.45,
    height: 0.55,
    elevation: 1.45,
    color: "#9faab5"
  },
  wallac: {
    name: "挂机空调",
    glyph: "▬",
    width: 0.9,
    depth: 0.22,
    height: 0.28,
    elevation: 2,
    color: "#c4ccd2"
  },
  floorac: {
    name: "柜机空调",
    glyph: "◉",
    width: 0.42,
    depth: 0.42,
    height: 1.75,
    color: "#b8c3c8"
  },
  robotvacuum: {
    name: "扫地机器人",
    glyph: "◎",
    width: 0.55,
    depth: 0.5,
    height: 0.85,
    color: "#b8c3c8"
  },
  nas: {
    name: "NAS",
    glyph: "▦",
    width: 0.28,
    depth: 0.24,
    height: 0.34,
    elevation: 0,
    color: "#626d7b"
  },
  camera: {
    name: "摄像头",
    glyph: "◉",
    width: 0.12,
    depth: 0.12,
    height: 0.16,
    elevation: 1.2,
    color: "#5d6978"
  },
  presence: {
    name: "人体传感器",
    glyph: "◌",
    width: 0.065,
    depth: 0.065,
    height: 0.14,
    elevation: 1.2,
    color: "#6d8994"
  },
  airpurifier: {
    name: "空气净化器",
    glyph: "◌",
    width: 0.34,
    depth: 0.34,
    height: 0.7,
    color: "#b8c3c8"
  },
  tv: {
    name: "电视",
    glyph: "▭",
    width: 1.5,
    depth: 0.18,
    height: 0.92,
    color: "#22282d"
  },
  plant: {
    name: "绿植",
    glyph: "✦",
    width: 0.75,
    depth: 0.75,
    height: 1.6,
    color: "#4e8b63"
  },
  floorlamp: {
    name: "落地灯",
    glyph: "⌁",
    width: 1.35,
    depth: 0.5,
    height: 1.8,
    color: "#4b5361"
  },
  vanity: {
    name: "梳妆台",
    glyph: "◫",
    width: 1.2,
    depth: 0.5,
    height: 1.55,
    color: "#b68c70"
  },
  desk: {
    name: "桌子",
    glyph: "▱",
    width: 1.4,
    depth: 0.65,
    height: 0.76,
    color: "#8e6b50"
  },
  piano: {
    name: "钢琴",
    glyph: "▰",
    width: 1.8,
    depth: 1.8,
    height: 1.35,
    color: "#4b5361"
  },
  desktop: {
    name: "台式电脑",
    glyph: "▣",
    width: 0.72,
    depth: 0.32,
    height: 0.5,
    elevation: 0.76,
    color: "#434b59"
  },
  laptop: {
    name: "笔记本电脑",
    glyph: "⌨",
    width: 0.36,
    depth: 0.28,
    height: 0.22,
    elevation: 0.76,
    color: "#555e6b"
  },
  toilet: {
    name: "马桶",
    glyph: "◒",
    width: 0.42,
    depth: 0.7,
    height: 0.52,
    color: "#e1e5e8"
  },
  squattoilet: {
    name: "蹲便",
    glyph: "▱",
    width: 0.45,
    depth: 0.65,
    height: 0.18,
    color: "#e1e5e8"
  },
  urinal: {
    name: "小便斗",
    glyph: "◖",
    width: 0.38,
    depth: 0.34,
    height: 0.72,
    elevation: 0.38,
    color: "#e1e5e8"
  },
  bathtub: {
    name: "浴缸",
    glyph: "▱",
    width: 1.7,
    depth: 0.78,
    height: 0.58,
    color: "#e1e5e8"
  },
  walllamp: {
    name: "壁灯",
    glyph: "◒",
    width: 0.3,
    depth: 0.22,
    height: 0.34,
    elevation: 1.55,
    color: "#d4dbe2"
  },
  shower: {
    name: "花洒",
    glyph: "♨",
    width: 0.9,
    depth: 0.9,
    height: 2.1,
    color: "#aebac5"
  },
  glasspartition: {
    name: "玻璃隔断",
    glyph: "▥",
    width: 1.2,
    depth: 0.08,
    height: 2,
    color: "#a9c5d3"
  },
  basin: {
    name: "台盆",
    glyph: "◉",
    width: 0.9,
    depth: 0.5,
    height: 0.88,
    color: "#d9dee2"
  },
  rug: {
    name: "地毯",
    glyph: "▨",
    width: 2,
    depth: 1.4,
    height: 0.012,
    color: "#7f7180"
  },
  tvstand: {
    name: "电视柜",
    glyph: "▬",
    width: 1.8,
    depth: 0.42,
    height: 0.48,
    color: "#77675e"
  },
  downlight: {
    name: "筒射灯",
    glyph: "◎",
    width: 0.52,
    depth: 0.52,
    height: 0.08,
    elevation: 2.68,
    color: "#d4dbe2"
  },
  ceilinglight: {
    name: "吸顶灯",
    glyph: "▣",
    width: 0.58,
    depth: 0.58,
    height: 0.1,
    elevation: 2.65,
    color: "#d4dbe2"
  },
  striplight: {
    name: "灯带",
    glyph: "━",
    width: 2,
    depth: 0.28,
    height: 0.05,
    elevation: 2.7,
    color: "#d4dbe2"
  }
};
const SOFT_TEXTURE_UNIT_RESERVE = new Set(["nightstand", "bar", "aquarium", "sideboard", "shoecabinet", "stairs", "steelstairs", "glassstairs", "smallcar", "cabinet", "glasscabinet", "bookcase", "shelf", "pillar", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop", "vanity", "basin", "bathtub", "tvstand", "squarecoffeetable", "glasspartition", "washer", "airoutlet", "dryer", "dishwasher", "steamoven", "microwave", "rangehood", "nas", "pipelinewaterpurifier", "tea_bar_machine"]);
const RESERVED_TEXTURE_UNITS = new Set(["fridge", "storagewaterheater", "gaswaterheater", "pipelinewaterpurifier", "tea_bar_machine", "washer", "airoutlet", "dryer", "dishwasher", "steamoven", "microwave", "ricecooker", "rangehood", "wallac", "floorac", "robotvacuum", "nas", "camera", "presence", "airpurifier", "tv", "desktop", "laptop", "floorlamp", "walllamp"]);
const set = new Set(["downlight", "ceilinglight", "striplight"]);
const Vl = new Set(["stairs", "steelstairs", "glassstairs"]);
const stairItemTypes = new Set(["steelstairs", "glassstairs"]);
const roundTableTypes = new Set(["rounddiningtable", "rounddiningtableturntable"]);
const tvMountStyles = new Set(["standard", "tabletop", "mobile"]);
const modelLoadStatusTimer = Object.freeze({
  depth: 0.55,
  height: 1.55
});
function hasRoundTableTurntable(item) {
  return item?.type === "rounddiningtableturntable" || item?.roundTableTurntable === true;
}
const defaultLightPresets = {
  downlight: {
    temperature: 3000,
    brightness: 48,
    range: 3.2,
    angle: 48
  },
  ceilinglight: {
    temperature: 3500,
    brightness: 62,
    range: 5,
    angle: 110
  },
  striplight: {
    temperature: 3000,
    brightness: 42,
    range: 3.5,
    angle: 100
  }
};
const deferExternalModels = Object.freeze({
  downlight: 1.1,
  ceilinglight: 0.792,
  striplight: 1.3
});
const Dg = {
  downlight: 120,
  ceilinglight: 150,
  striplight: 120
};
const b0 = 8;
const deferredModelTimer = 2;
const externalModels = 1;
const DEFAULT_MAX_TEXTURE_SIZE = 1024;
const sofaGeometryCache = 0.8;
const yo = {
  solid: {
    width: 0.9,
    height: 2.1
  },
  double: {
    width: 1.8,
    height: 2.2
  },
  entry: {
    width: 1.05,
    height: 2.2
  },
  glass: {
    width: 0.9,
    height: 2.1
  },
  "sliding-glass": {
    width: 1.8,
    height: 2.1
  },
  "roller-shutter": {
    width: 3,
    height: 2.8
  },
  "frame-only": {
    width: 0.9,
    height: 2.1
  }
};
function defaultItemDepth(itemType) {
  return Dg[itemType] || 120;
}
function projectHasItemModel(prefixText) {
  return !!projectDocCurrent?.floors?.some(floor => floor.scene?.items?.some(tvMountStyle => {
    if (prefixText.startsWith("tv_")) {
      const value = tvMountStyles.has(tvMountStyle.tvMountStyle) ? tvMountStyle.tvMountStyle : "standard";
      return tvMountStyle.type === "tv" && prefixText === "tv_" + value;
    }
    return tvMountStyle.type === prefixText;
  }));
}
function collectExternalModelKeysFromFloors(floors = []) {
  return [...new Set(floors.flatMap(floor => (floor?.scene?.items || []).map(item => modelTypeForItem(item)).filter(modelType => ALL_ITEM_MODELS[modelType])))];
}
function visibleExternalModelKeys() {
  const floors = getPreviewFloorModeCurrent() === "all" ? projectDocCurrent?.floors || [] : [activeFloor()].filter(Boolean);
  return collectExternalModelKeysFromFloors(floors);
}
const dracoLoader = new SameOriginDRACOLoader("/bridge-static/3d-studio/draco-decoder-worker.js?v=20260904-csp-static-worker-v1");
dracoLoader.setDecoderPath("/bridge-static/vendor/three/0.186.0/draco/");
// Prefer WASM when available; avoid deprecated setDecoderConfig (removed in r194).
dracoLoader.decoderConfig = {
  ...(dracoLoader.decoderConfig || {}),
  type: typeof WebAssembly === "object" ? "wasm" : "js"
};
dracoLoader.setWorkerLimit(2);
dracoLoader.preload();
const L = new GLTFLoader();
L.setDRACOLoader(dracoLoader);
let modelLoadStatusTimerCurrent = null;
let modelsLoading = false;
let deferExternalModelsCurrent = false;
let externalModelQueueActive = false;
let deferredModelTasks = [];
let deferredModelTimerCurrent = null;
window.externalModelLoadsDeferred = false;
window.__haBridgeDeferExternalModel = flag => {
  if (flag) {
    if (!deferredModelTasks.includes(flag)) {
      deferredModelTasks.push(flag);
    }
    scheduleDeferredModelLoad();
  }
};
function scheduleDeferredModelLoad(delayMs = 900) {
  window.clearTimeout(deferredModelTimerCurrent);
  deferredModelTimerCurrent = window.setTimeout(() => {
    deferredModelTimerCurrent = null;
    if (!externalModelQueueActive || document.hidden || isLeavingStudio || previewOrbitLocked) {
      if (externalModelQueueActive) {
        scheduleDeferredModelLoad(300);
      }
      return;
    }
    const keysVar = [...new Set(deferredModelTasks)];
    deferredModelTasks = [];
    Promise.allSettled(flushDeferredModelLoads(keysVar));
  }, Math.max(0, delayMs));
}
function flushDeferredModelLoads(keyArg = []) {
  window.clearTimeout(deferredModelTimerCurrent);
  deferredModelTimerCurrent = null;
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  const modelKeys = [...new Set(keyArg)].filter(key => ALL_ITEM_MODELS[key]);
  if (!modelKeys.length) {
    return [];
  }
  window.__haBridgeReleasingDeferredModels = true;
  const loads = modelKeys.map(key => loadExternalItemModel(key));
  window.__haBridgeReleasingDeferredModels = false;
  return loads;
}
function loadVisibleExternalModels() {
  return flushDeferredModelLoads(visibleExternalModelKeys());
}
function requestModelRender() {
  updateModelLoadStatus();
  if (!isAutoDiagramEmbedCurrent && !deferExternalModelsCurrent) {
    if (isLeavingStudio || previewOrbitLocked) {
      modelsLoading = true;
      return;
    }
    window.clearTimeout(modelLoadStatusTimerCurrent);
    modelLoadStatusTimerCurrent = window.setTimeout(() => {
      modelLoadStatusTimerCurrent = null;
      rebuildPreviewMeshes({
        force: true,
        precompile: true
      });
    }, 80);
  }
}
function refreshStudioChrome() {
  updateModelLoadStatus();
  modelsLoading = false;
  window.clearTimeout(modelLoadStatusTimerCurrent);
  modelLoadStatusTimerCurrent = null;
  rebuildPreviewMeshes({
    force: true,
    precompile: true
  });
}
const manager = createExternalModelManager({
  THREE,
  loader: L,
  stairItemTypes: Vl,
  isModelInUse: projectHasItemModel,
  requestRender: requestModelRender,
  onLoadStateChange: updateModelLoadStatus,
  maxConcurrentLoads: 2
});
const {
  loadExternalItemModel,
  modelTypeForItem
} = manager;
function updateModelLoadStatus(active = manager.modelLoadState()) {
  if (!modelLoadingStatus) {
    return;
  }
  const flag = active.active > 0 || active.queued > 0;
  if (!flag && modelsLoading) {
    modelsLoading = false;
    window.clearTimeout(modelLoadStatusTimerCurrent);
    modelLoadStatusTimerCurrent = null;
    orbitResumeAfterModels = true;
    if (orbitControls && !orbitSuspended) {
      orbitControls.enabled = false;
    }
    modelLoadingStatus.hidden = false;
    modelLoadingStatus.querySelector("span:last-child")?.replaceChildren(document.createTextNode("正在完成模型…"));
    rebuildPreviewMeshes({
      force: true,
      precompile: true
    });
    window.requestAnimationFrame(() => updateModelLoadStatus());
    return;
  }
  orbitResumeAfterModels = flag;
  if (orbitControls && !orbitSuspended) {
    orbitControls.enabled = !flag;
  }
  modelLoadingStatus.hidden = !flag;
  modelLoadingStatus.querySelector("span:last-child")?.replaceChildren(document.createTextNode(flag ? "正在加载模型… " + (active.active + active.queued) : ""));
}
const lightPropertyMeta = new Map();
const colorMaterialCache = new Map();
const isStudioRoute = new Map();
const Zl = new Map();
const mergedBoxGeometryCache = new Map();
const rugMaterialCache = new Map();
const skipInstanceMergeTypes = new Set(["tv", "smallcar", "planlabel", "downlight", "ceilinglight", "striplight"]);
const hasProjectLoaded = new Set(["coffeetable", "squarecoffeetable", "tvstand", "plant", "bed", "nightstand", "curtain", "vanity", "desk", "bookcase", "piano", "table", "rounddiningtable", "rounddiningtableturntable", "bar", "sideboard", "shoecabinet", "chair", "cabinet", "glasscabinet", "shelf", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop", "fridge", "washer", "dryer", "dishwasher", "steamoven", "microwave", "ricecooker", "rangehood", "wallac", "floorac", "nas", "airpurifier", "tv", "desktop", "laptop", "toilet", "squattoilet", "urinal", "bathtub", "shower", "basin"]);
const Gg = new Set();
const $g = new Set(["aquarium", "bed", "nightstand", "curtain", "vanity", "desk", "bookcase", "piano", "table", "rounddiningtable"]);
const floorScene = new Set(["coffeetable", "squarecoffeetable", "tvstand", "rug", "plant", "bed", "nightstand", "vanity", "desk", "bookcase", "aquarium", "curtain", "table", "rounddiningtable", "rounddiningtableturntable", "chair", "bar", "sideboard", "shoecabinet", "cabinet", "glasscabinet", "shelf", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop", "basin", "toilet", "squattoilet", "urinal", "shower", "bathtub", "glasspartition", "stairs", "pillar"]);
const projectDoc = new Set(["tv", "wallac", "floorac", "airpurifier", "robotvacuum", "floorlamp", "walllamp", "fridge", "rangehood", "dishwasher", "steamoven", "microwave", "ricecooker", "washer", "dryer", "storagewaterheater", "gaswaterheater", "desktop", "laptop", "nas"]);
function attachExternalItemModel(item, group, theme = resolvedThemeColors()) {
  const value = manager.addExternalItemModel(item, group, theme, {
    selected: isSelected("item", group.id)
  });
  updateModelLoadStatus();
  return value;
}
const options = {
  lightTemperature: {
    label: "色温",
    input: "#light-temperature",
    unit: "K"
  },
  lightBrightness: {
    label: "亮度",
    input: "#light-brightness",
    unit: "%"
  },
  lightRange: {
    label: "照射范围",
    input: "#light-range",
    unit: "m"
  },
  lightAngle: {
    label: "光束角",
    input: "#light-angle",
    unit: "°"
  },
  elevation: {
    label: "离地高度",
    input: "#item-elevation",
    unit: "m"
  }
};
function clampLightPropertyValue(prop, value, itemType) {
  if (prop === "lightTemperature") {
    return Math.round(clamp(finite(value, 3000), 2200, 6500));
  } else if (prop === "lightBrightness") {
    return Math.round(clamp(finite(value, 50), 0, 100));
  } else if (prop === "lightRange") {
    return Math.round(clamp(finite(value, 3.5), 0.5, 10) * 10) / 10;
  } else if (prop === "lightAngle") {
    return Math.round(clamp(finite(value, 90), 15, defaultItemDepth(itemType)));
  } else if (prop === "elevation") {
    return Math.round(clamp(finite(value, 2.7), 0, 6) * 100) / 100;
  } else {
    return finite(value);
  }
}
function formatLightPropertyValue(prop, value) {
  const propMeta = options[prop];
  if (!propMeta) {
    return String(value);
  }
  const displayValue = ["lightRange", "elevation"].includes(prop) ? Number(value).toFixed(prop === "elevation" ? 2 : 1) : Math.round(value);
  if (["%", "°"].includes(propMeta.unit)) {
    return "" + displayValue + propMeta.unit;
  } else {
    return displayValue + " " + propMeta.unit;
  }
}
const toolHelpText = {
  flooropening: ["楼板洞口", "拖出矩形洞口；仅切除当前层楼板，楼梯通往上层时请在上层开洞。Esc 取消"],
  select: ["选择工具", "移动时 Shift 锁轴；缩放时 Shift 等比例；Option/Alt 拖动复制；⌘/Ctrl+C、V 复制粘贴"],
  scale: ["参考线工具", "依次单击两个端点；按住 Shift 强制锁定水平或垂直轴线"],
  wall: ["连续画墙", "逐点绘制并回到起点闭合空间；未闭合不会生成地面，按住 Shift 锁轴，Esc 结束"],
  window: ["窗户工具", "靠近墙体单击，窗户会自动吸附并生成真实窗洞"],
  door: ["门工具", "靠近墙体单击，门会自动吸附并生成门洞；选中后可翻转开启方向"],
  railing: ["玻璃栏杆", "靠近墙体单击，栏杆会吸附到墙段并替换对应的实体墙"],
  label: ["户型铭牌", "单击画布放置；选中后可修改文字、拖动、缩放和旋转"]
};
const planBackgroundImage = isStageEmbed || /^\/3d-studio\/?$/.test(window.location.pathname);
const planCtx = element.getContext("2d");
const measureCanvas = document.createElement("canvas");
const measureCtx = measureCanvas.getContext("2d");
const {
  drawMetricGrid,
  drawLine: drawPlanLine,
  drawPoint: drawPlanPoint,
  drawOpenEndpointWarning: Xg,
  drawFloatingLabel
} = createPlanDrawingTools({
  context: planCtx,
  planToScreen,
  screenToPlan: screenToPlanWithView,
  pixelsPerMeter,
  getCanvasSize: () => ({
    width: planWidth,
    height: planHeight
  }),
  getViewZoom: () => planView.zoom
});
let hasProjectLoadedCurrent = null;
let projectLoadGeneration = 0;
let planBackgroundRevision = 0;
let floorSceneCurrent = createEmptyFloorScene();
let projectDocCurrent = null;
let activeFloorId = "";
let forcedVisibleLightGroupIds = null;
let planBackgroundImageCurrent = null;
let activeTool = "select";
const wallDrawAnchor = "solid";
let assetCategory = "home";
let on = "";
let lightGroupContextMenuId = "";
let _a = "";
let draggingLightGroupId = "";
let draggingFloorId = "";
let Dr = null;
let clipboardItems = [];
let Fr = null;
let clipboardPasteCount = 0;
let selection = null;
let multiSelection = [];
let Tt = null;
let railingPlacementPreview = null;
let Ar = 0;
let wallDrawAnchorCurrent = null;
let shiftKeyHeld = null;
let alignSession = null;
let floorSwitchGeneration = 0;
let contextFloorId = "";
let pendingDeleteFloorId = "";
let no = null;
let Fi = null;
let at = null;
let Uo = null;
let railingPlacementPreviewCurrent = null;
let Ko = null;
let dragState = null;
let saveConflictState = false;
let zr = false;
let Or = false;
let planWidth = 1;
let planHeight = 1;
let planNeedsRedraw = false;
let planView = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0
};
let undoStack = [];
let redoStack = [];
let saveGeneration = 0;
let savedGeneration = 0;
let saveTimer = null;
let isFlushingSave = false;
let saveConflictStateCurrent = null;
let toastTimer = null;
let isSceneRebuildQueued = false;
let planZoomAnchor = false;
let Ka = false;
let orbitAnimSettleTimer = false;
const pendingRebuildReasons = new Set();
let previewNeedsRefresh = false;
let detailsResizeDrag = null;
let exportPresetEditorOpen = null;
let exportUiDebounceTimer = null;
let exportOverwriteResolver = 0;
let wallAnalysisCache = {
  scene: null,
  signature: "",
  floorPolygons: null,
  intersections: null,
  joinExtensions: null,
  unclosedEndpoints: null
};
let Gr = null;
let $r = 0;
let defaultExportHeight = 1;
let exportAspectRatio = null;
let previewScene = 0;
let camera = null;
let stageSession = null;
let orbitSuspended = false;
let isExporting = false;
let exportPresetEditorOpenCurrent = false;
let exportUiDebounceTimerCurrent = null;
let exportOverwriteResolverCurrent = null;
let shadowCameraExpanded = false;
let savedSpotShadowCamera = null;
const hc = 1852;
const fc = 1293;
let Tn = hc / fc;
let previewSceneCurrent = null;
let cameraCurrent = null;
let renderer = null;
let orbitControls = null;
let worldGroup = null;
let Lo = null;
let orbitResumeTimer = null;
let hemisphereLight = null;
let ambientLight = null;
let previewSpotLight = null;
let fillLight = null;
let topLight = null;
let shadowAtlas = null;
let baseLighting = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let lightCacheTileMap = null;
let baseLightingChannel = null;
try {
  if (typeof BroadcastChannel == "function") {
    baseLightingChannel = new BroadcastChannel("ha-bridge-studio3d-base-lighting-v1");
  }
} catch {}
let needsRenderFrame = true;
let renderIdle = false;
let demandFrameLoop = null;
let orbitResumeTimerCurrent = null;
let stageSessionEndTimer = null;
let isBakingLightCache = false;
let isRebuildingWorld = false;
let residentCacheMode = false;
let lightCacheEpoch = 0;
let lightCacheReady = false;
let previewQualityJustBecameReady = false;
let map = new Map();
let pendingModelLoads = new Map();
let recentFrameMsSamples = 0;
let is = 0;
let isCapturingFrame = null;
let isStageWarmup = false;
let rs = false;
let previewOrbitLocked = false;
let floorShadowMotionActive = false;
let orbitSoftSuspend = false;
let isLeavingStudio = false;
let leaveStudioTimer = null;
let previewQualityReady = false;
let as = false;
let previewQualityPath = "";
let baselineLightRenderCost = 0;
let recentFrameMsSamplesCurrent = [];
let qualityProbeStartMs = 0;
let slowFrameStreak = 0;
let adaptiveFpsEstimate = null;
const O = new WeakSet();
let isLightPrecompiling = false;
let lightPrecompileRequested = false;
let cs = 0;
let lightPrecompileTimer = null;
let ORBIT_DOLLY_SPEED_MAX = false;
let ORBIT_DOLLY_SPEED_SCALE = false;
let PRECOMPILE_TIMEOUT_MS = "";
let G = 0;
let endDetailsPanelResize = null;
let endBaseLightPanelDrag = false;
let materialTestTypeQuery = "";
const instanceTestTypeQuery = new Set();
const qg = 16;
function createEmptyFloorScene() {
  return {
    schemaVersion: 2,
    background: null,
    calibration: null,
    settings: {
      wallHeight: 2.4,
      wallThickness: 0.15,
      wallOpacity: themeColors.wallOpacity,
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
      detailsPanelWidthRatio: 0.29
    },
    walls: [],
    windows: [],
    doors: [],
    railings: [],
    lightGroups: [{
      id: "light-group-default",
      name: "默认灯组",
      enabled: true
    }],
    items: []
  };
}
function defaultFloorChineseName(argPrimary) {
  return ["一层", "二层", "三层", "四层", "五层", "六层", "七层", "八层", "九层", "十层"][argPrimary] || argPrimary + 1 + "层";
}
function createFloorEntry(elevation = 0, scene = createEmptyFloorScene()) {
  const sceneCurrent = normalizeFloorScene(scene);
  const clampCurrent = clamp(finite(projectDocCurrent?.defaultFloorHeight, 3), 1.8, 8);
  return {
    id: makeId("floor"),
    name: defaultFloorChineseName(elevation),
    elevation: elevation * clampCurrent,
    offsetX: 0,
    offsetZ: 0,
    rotation: 0,
    originX: sceneCurrent.background?.width ? sceneCurrent.background.width / 2 : 0,
    originY: sceneCurrent.background?.height ? sceneCurrent.background.height / 2 : 0,
    originInitialized: !!sceneCurrent.background,
    aligned: elevation === 0,
    alignmentPending: elevation > 0,
    scene: sceneCurrent
  };
}
function normalizeProjectDocument(projectDoc) {
  const list = Array.isArray(projectDoc?.floors) ? projectDoc.floors : null;
  const floors = list?.length ? list.map((floor, argSecondary) => {
    const scene = normalizeFloorScene(floor?.scene);
    const flag = floor?.originInitialized === true;
    const text = normalizeLabelText(floor?.name, defaultFloorChineseName(argSecondary), 24);
    const name = text === argSecondary + 1 + "层" ? defaultFloorChineseName(argSecondary) : text;
    return {
      id: String(floor?.id || makeId("floor")),
      name,
      elevation: clamp(finite(floor?.elevation, argSecondary * 3), -30, 120),
      offsetX: clamp(finite(floor?.offsetX, 0), -100, 100),
      offsetZ: clamp(finite(floor?.offsetZ, 0), -100, 100),
      rotation: clamp(finite(floor?.rotation, 0), -180, 180),
      originX: flag ? finite(floor?.originX, 0) : scene.background?.width ? scene.background.width / 2 : 0,
      originY: flag ? finite(floor?.originY, 0) : scene.background?.height ? scene.background.height / 2 : 0,
      originInitialized: flag || !!scene.background,
      aligned: argSecondary === 0 || floor?.aligned === true || Math.abs(finite(floor?.offsetX, 0)) > 0.000001 || Math.abs(finite(floor?.offsetZ, 0)) > 0.000001,
      alignmentPending: floor?.alignmentPending === true,
      scene
    };
  }) : [createFloorEntry(0, projectDoc)];
  const id = String(projectDoc?.activeFloorId || "");
  const found = floors.find(item => item.id === id) || floors[0];
  const clampCurrent = clamp(finite(projectDoc?.defaultFloorHeight, 3), 0, 20);
  const flag = finite(projectDoc?.schemaVersion, 0) >= 6;
  const exportPresets = normalizeExportPresetSlots(projectDoc?.exportPresets);
  return {
    schemaVersion: 7,
    activeFloorId: found.id,
    defaultFloorHeight: clamp(finite(projectDoc?.defaultFloorHeight, 3), 1.8, 8),
    previewFloorGap: clamp(flag ? finite(projectDoc?.previewFloorGap, 3) : clampCurrent + finite(projectDoc?.previewFloorGap, 0), 0, 20),
    exportFloorGap: clamp(flag ? finite(projectDoc?.exportFloorGap, 3) : clampCurrent + finite(projectDoc?.exportFloorGap, 0), 0, 20),
    previewFloorMode: projectDoc?.previewFloorMode === "all" ? "all" : "active",
    combinedCameraSettings: normalizeCameraSettings(projectDoc?.combinedCameraSettings),
    combinedFixedCameraView: normalizeFixedCameraView(projectDoc?.combinedFixedCameraView),
    baseLighting: normalizeBaseLighting(projectDoc?.baseLighting),
    exportPresets,
    activeExportPresetSlot: normalizeActiveExportPresetSlot(projectDoc?.activeExportPresetSlot, exportPresets.length),
    floors
  };
}
function activeFloor() {
  const value = stageSession?.selectedFloorId || activeFloorId;
  return projectDocCurrent?.floors.find(item => item.id === value) || projectDocCurrent?.floors[0] || null;
}
function cloneProjectDoc() {
  return structuredClone(projectDocCurrent || normalizeProjectDocument(floorSceneCurrent));
}
function cloneProjectForStage() {
  const projectDoc = cloneProjectDoc();
  if (!stageSession) {
    return projectDoc;
  }
  projectDoc.previewFloorMode = stageSession.floorMode;
  for (const floor of projectDoc.floors || []) {
    const floorCameraSetting = stageSession.floorCameraSettings.get(floor.id);
    if (floorCameraSetting) {
      floor.scene.settings.cameraMode = floorCameraSetting.mode;
      floor.scene.settings.cameraView = floorCameraSetting.view;
      floor.scene.settings.cameraTopRotation = floorCameraSetting.topRotation;
      floor.scene.settings.cameraFocalLength = floorCameraSetting.focalLength;
    }
  }
  projectDoc.combinedCameraSettings = {
    ...stageSession.combinedCameraSettings
  };
  return projectDoc;
}
function uniqueFloorName(name, exceptId = "") {
  const usedNames = new Set((projectDocCurrent?.floors || []).filter(floor => floor.id !== exceptId).map(floor => floor.name));
  if (!usedNames.has(name)) {
    return name;
  }
  let suffix = 2;
  while (usedNames.has(name + " " + suffix)) {
    suffix += 1;
  }
  return name + " " + suffix;
}
function hideFloorContextMenu() {
  floorContextMenu.hidden = true;
  contextFloorId = "";
}
function showFloorContextMenu(id, event) {
  contextFloorId = id.id;
  const disabled = floorContextMenu.querySelector("[data-floor-action=\"delete\"]");
  disabled.disabled = projectDocCurrent.floors.length <= 1;
  floorContextMenu.hidden = false;
  floorContextMenu.style.left = Math.min(event.clientX, window.innerWidth - 116) + "px";
  floorContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 82) + "px";
}
function confirmDeleteFloor(id) {
  if (!!id && !(projectDocCurrent.floors.length <= 1)) {
    pendingDeleteFloorId = id.id;
    bf.textContent = id.name;
    floorDeleteDialog.showModal();
  }
}
function closeFloorDeleteDialog() {
  pendingDeleteFloorId = "";
  if (floorDeleteDialog.open) {
    floorDeleteDialog.close();
  }
}
async function executePendingFloorDelete() {
  const id2 = projectDocCurrent.floors.find(id => id.id === pendingDeleteFloorId);
  closeFloorDeleteDialog();
  if (!id2 || projectDocCurrent.floors.length <= 1) {
    return;
  }
  const value = projectDocCurrent.floors.findIndex(id => id.id === id2.id);
  projectDocCurrent.floors.splice(value, 1);
  projectDocCurrent.floors.forEach((elevation, argSecondary) => {
    elevation.elevation = argSecondary * projectDocCurrent.defaultFloorHeight;
  });
  const id = projectDocCurrent.floors[Math.max(0, value - 1)] || projectDocCurrent.floors[0];
  await switchActiveFloor(id.id, {
    persist: false
  });
  syncPreviewFloorButtons();
  scheduleSave();
  showToast("已删除“" + id2.name + "”。", "success");
}
function openFloorRenameDialog(id) {
  if (id) {
    contextFloorId = id.id;
    floorRenameInputCurrent.value = id.name;
    bl.showModal();
    requestAnimationFrame(() => floorRenameInputCurrent.select());
  }
}
function renderFloorList() {
  if (projectDocCurrent) {
    floorList.replaceChildren();
    for (const floor of projectDocCurrent.floors) {
      const el = document.createElement("div");
      el.className = "floor-row" + (floor.id === activeFloorId ? " active" : "") + (floor.aligned ? "" : " unaligned");
      el.dataset.floorId = floor.id;
      el.draggable = true;
      el.setAttribute("aria-label", floor.name + "，" + (floor.id === activeFloorId ? "当前楼层，" : "") + "长按拖动排序，右键可重命名或删除");
      let dragReady = false;
      let dragTimer = null;
      const clearDragReady = () => {
        if (dragTimer) {
          clearTimeout(dragTimer);
        }
        dragTimer = null;
        dragReady = false;
        el.classList.remove("drag-ready");
      };
      el.addEventListener("pointerdown", event => {
        if (event.button === 0 && !event.target.closest("button")) {
          clearDragReady();
          dragTimer = setTimeout(() => {
            dragTimer = null;
            dragReady = true;
            el.classList.add("drag-ready");
          }, 280);
        }
      });
      el.addEventListener("pointerup", clearDragReady);
      el.addEventListener("pointercancel", clearDragReady);
      el.addEventListener("dragstart", event => {
        if (!dragReady) {
          event.preventDefault();
          clearDragReady();
          return;
        }
        draggingFloorId = floor.id;
        el.classList.remove("drag-ready");
        el.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-floor", floor.id);
      });
      el.addEventListener("dragend", () => {
        draggingFloorId = "";
        el.classList.remove("dragging");
        clearDragReady();
        clearFloorDropIndicators();
      });
      el.addEventListener("dragover", event => {
        if (!draggingFloorId || draggingFloorId === floor.id) {
          return;
        }
        event.preventDefault();
        clearFloorDropIndicators();
        const placeAfter = event.clientY >= el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
        el.dataset.dropPosition = placeAfter ? "after" : "before";
        el.classList.add(placeAfter ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el.addEventListener("drop", event => {
        if (!draggingFloorId || draggingFloorId === floor.id) {
          return;
        }
        event.preventDefault();
        const sourceId = draggingFloorId;
        const placeAfter = el.dataset.dropPosition === "after";
        draggingFloorId = "";
        clearFloorDropIndicators();
        applyFloorReorder(sourceId, floor.id, placeAfter);
      });
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = floor.id === activeFloorId ? "●" : "○";
      button.title = "切换到" + floor.name;
      button.addEventListener("click", event => {
        event.stopPropagation();
        switchActiveFloor(floor.id, {
          persist: true
        });
      });
      const nameEl = document.createElement("span");
      nameEl.textContent = floor.name;
      nameEl.title = "长按后拖动可调整楼层顺序，右键可重命名或删除楼层";
      const statusEl = document.createElement("small");
      const floorIndex = projectDocCurrent.floors.findIndex(entry => entry.id === floor.id);
      statusEl.textContent = floorIndex === 0 ? "基准" : floor.aligned ? "已对齐" : "待对齐";
      el.addEventListener("click", () => {
        switchActiveFloor(floor.id, {
          persist: true
        });
      });
      el.addEventListener("contextmenu", event => {
        event.preventDefault();
        showFloorContextMenu(floor, event);
      });
      el.append(button, nameEl, statusEl);
      floorList.append(el);
    }
    updateAlignFloorButton();
  }
}
function clearFloorDropIndicators() {
  for (const element of floorList.querySelectorAll(".floor-row")) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
}
function applyFloorReorder(sourceId, targetId, placeAfter) {
  const floors = reorderFloors(projectDocCurrent.floors, sourceId, targetId, placeAfter, projectDocCurrent.defaultFloorHeight);
  if (floors === projectDocCurrent.floors) {
    return;
  }
  const floor = projectDocCurrent.floors.find(item => item.id === sourceId);
  projectDocCurrent.floors = floors;
  renderFloorList();
  syncPreviewFloorButtons();
  updateAlignFloorButton();
  rebuildPreviewMeshes({
    force: true
  });
  scheduleSave();
  if (floor) {
    showToast("已调整“" + floor.name + "”的楼层顺序。", "success");
  }
}
function updateAlignFloorButton() {
  const floor = activeFloor();
  const value = floor ? projectDocCurrent.floors.findIndex(item => item.id === floor.id) : -1;
  const flag = projectDocCurrent.floors.length > 1 && value > 0;
  alignFloor.hidden = !flag;
  alignFloor.disabled = !flag || !floor?.scene?.calibration;
  alignFloor.textContent = floor?.aligned ? "重新对齐" : "对齐楼层";
  if (alignSession?.stage === "reference") {
    activeToolLabelCurrent.textContent = "楼层对齐 · 参照层";
    toolHelp.textContent = "点击" + alignSession.referenceFloor.name + "上的楼梯角、墙角或柱点；Esc 取消";
  } else if (alignSession?.stage === "current") {
    activeToolLabelCurrent.textContent = "楼层对齐 · 当前层";
    toolHelp.textContent = "点击" + floor.name + "上的相同位置；系统会自动重合上下楼层";
  }
}
async function switchActiveFloor(floorId, {
  persist: flag = false
} = {}) {
  const id = projectDocCurrent?.floors.find(item => item.id === floorId);
  if (!id) {
    return;
  }
  const value = ++floorSwitchGeneration;
  const view = getPreviewFloorModeCurrent() === "all" ? serializeCameraState() : null;
  if (alignSession?.floorId !== id.id) {
    alignSession = null;
  }
  activeFloorId = id.id;
  projectDocCurrent.activeFloorId = id.id;
  floorSceneCurrent = id.scene;
  on = "";
  clearSelection();
  resetWallDrawingCurrent();
  wallDrawAnchorCurrent = null;
  undoStack = [];
  redoStack = [];
  planView.rotation = floorSceneCurrent.settings.planViewRotation;
  Promise.allSettled(loadVisibleExternalModels());
  await reloadPlanBackground();
  if (value === floorSwitchGeneration && activeFloorId === id.id) {
    refreshViews();
    updateAlignFloorButton();
    fitPlanViewToContent();
    requestAnimationFrame(() => {
      if (value === floorSwitchGeneration && activeFloorId === id.id) {
        if (getPreviewFloorModeCurrent() === "all") {
          if (view) {
            applyStoredCameraPose(view, view.viewportAspect);
          }
          syncCameraModeButtons(getCameraProjectionMode());
          syncCameraViewButtons(cameraViewMode());
          return;
        }
        if (floorSceneCurrent.settings.fixedCameraView) {
          restoreFixedCameraView({
            recordChange: false,
            silent: true
          });
          return;
        }
        setCameraProjectionMode(getCameraProjectionMode(), {
          preserveView: false
        });
        applyCameraViewCurrent();
      }
    });
    if (flag) {
      scheduleSave();
    }
  }
}
async function addNewFloor() {
  const value = createFloorEntry(projectDocCurrent.floors.length);
  value.name = uniqueFloorName(value.name);
  projectDocCurrent.floors.push(value);
  syncPreviewFloorButtons();
  await switchActiveFloor(value.id, {
    persist: false
  });
  scheduleSave();
  showToast("已新增“" + value.name + "”，导入并校准后会设置上下层参照点。", "success");
  setActiveTool("select");
}
function planPointToWorldXZ(floor, planPoint) {
  const pixelsPerMeter = floor?.scene?.calibration?.pixelsPerMeter || 1;
  const localX = (planPoint.x - finite(floor?.originX, 0)) / pixelsPerMeter;
  const localY = (planPoint.y - finite(floor?.originY, 0)) / pixelsPerMeter;
  const rotationRad = -THREE.MathUtils.degToRad(finite(floor?.rotation, 0));
  return {
    x: finite(floor?.offsetX, 0) + Math.cos(rotationRad) * localX + Math.sin(rotationRad) * localY,
    z: finite(floor?.offsetZ, 0) - Math.sin(rotationRad) * localX + Math.cos(rotationRad) * localY
  };
}
function rotatePlanPointByFloor(floor, worldPoint) {
  const pixelsPerMeter = floor?.scene?.calibration?.pixelsPerMeter || 1;
  const rotationRad = -THREE.MathUtils.degToRad(finite(floor?.rotation, 0));
  const dx = worldPoint.x - finite(floor?.offsetX, 0);
  const dz = worldPoint.z - finite(floor?.offsetZ, 0);
  return {
    x: finite(floor?.originX, 0) + (Math.cos(rotationRad) * dx - Math.sin(rotationRad) * dz) * pixelsPerMeter,
    y: finite(floor?.originY, 0) + (Math.sin(rotationRad) * dx + Math.cos(rotationRad) * dz) * pixelsPerMeter
  };
}
function floorLocalToWorldPoint(planPoint, sourceFloor, targetFloor) {
  return rotatePlanPointByFloor(targetFloor, planPointToWorldXZ(sourceFloor, planPoint));
}
function alignReferenceWalls() {
  if (!alignSession) {
    return [];
  }
  const targetFloor = activeFloor();
  return alignSession.referenceFloor.scene.walls.map(wall => ({
    ...wall,
    start: floorLocalToWorldPoint(wall.start, alignSession.referenceFloor, targetFloor),
    end: floorLocalToWorldPoint(wall.end, alignSession.referenceFloor, targetFloor)
  }));
}
function startAlignFloorSession() {
  const floor = activeFloor();
  const floorIndex = projectDocCurrent?.floors.findIndex(entry => entry.id === floor?.id) ?? -1;
  const referenceFloor = floorIndex > 0 ? projectDocCurrent.floors[floorIndex - 1] : null;
  if (!!floor && !!referenceFloor) {
    if (!floor.scene.calibration || !referenceFloor.scene.calibration) {
      showToast("当前层和参照层都需要先完成比例校准。", "error");
      return;
    }
    alignSession = {
      floorId: floor.id,
      referenceFloor,
      stage: "reference",
      referencePoint: null
    };
    clearSelection();
    setActiveTool("select");
    element.style.cursor = "crosshair";
    updateAlignFloorButton();
    drawPlan();
    showToast("先在半透明的" + referenceFloor.name + "上点击一个参照点。");
  }
}
function cancelAlignFloorSession() {
  if (alignSession) {
    alignSession = null;
    element.style.cursor = "";
    setActiveTool("select");
    updateAlignFloorButton();
    drawPlan();
    showToast("已取消楼层对齐。", "success");
  }
}
function handleAlignFloorClick(clickPoint) {
  if (!alignSession) {
    return false;
  }
  const floor = activeFloor();
  if (!floor || floor.id !== alignSession.floorId) {
    cancelAlignFloorSession();
    return true;
  }
  if (alignSession.stage === "reference") {
    const referenceWalls = alignReferenceWalls();
    const snappedPoint = nearestWall(clickPoint, referenceWalls, 18 / planView.zoom)?.point || clickPoint;
    alignSession.referencePoint = floorLocalToWorldPoint(snappedPoint, floor, alignSession.referenceFloor);
    alignSession.stage = "current";
    updateAlignFloorButton();
    drawPlan();
    showToast("现在点击" + floor.name + "上的同一个位置。");
    return true;
  }
  const planPoint = nearestWall(clickPoint, floor.scene.walls, 18 / planView.zoom)?.point || clickPoint;
  const worldPoint = planPointToWorldXZ(alignSession.referenceFloor, alignSession.referencePoint);
  floor.originX = planPoint.x;
  floor.originY = planPoint.y;
  floor.originInitialized = true;
  floor.offsetX = worldPoint.x;
  floor.offsetZ = worldPoint.z;
  floor.rotation = alignSession.referenceFloor.rotation || 0;
  floor.aligned = true;
  floor.alignmentPending = false;
  floor.alignment = {
    referenceFloorId: alignSession.referenceFloor.id,
    referencePoint: {
      ...alignSession.referencePoint
    },
    currentPoint: {
      ...planPoint
    }
  };
  alignSession = null;
  element.style.cursor = "";
  setActiveTool("select");
  renderFloorList();
  drawPlan();
  rebuildPreviewMeshes({
    force: true
  });
  scheduleSave();
  showToast(floor.name + "已与下层参照点对齐。", "success");
  return true;
}
function commitPreviewFloorGap() {
  const gap = clamp(finite(previewFloorGapInput.value, projectDocCurrent?.previewFloorGap || 3), 0, 20);
  if (!(Math.abs(gap - finite(projectDocCurrent?.previewFloorGap, 3)) < 0.000001)) {
    projectDocCurrent.previewFloorGap = gap;
    previewFloorGapInput.value = gap.toFixed(1);
    rebuildWorldPreviewCurrent();
    scheduleSave();
  }
}
function commitExportFloorGap() {
  const gap = clamp(finite(exportFloorGap.value, projectDocCurrent?.exportFloorGap || 3), 0, 20);
  if (!(Math.abs(gap - finite(projectDocCurrent?.exportFloorGap, 3)) < 0.000001)) {
    projectDocCurrent.exportFloorGap = gap;
    exportFloorGap.value = gap.toFixed(1);
    rebuildWorldPreviewCurrent();
    exportStatus.textContent = "全楼层间距已设为 " + gap.toFixed(1) + " m";
    scheduleSave();
  }
}
function buildWallOpeningsIndex(wallsInput, windowsInput, doorsInput, openingWidthScale, railingsInput = []) {
  const splitPieces = splitWallSegments(wallsInput);
  const piecesBySourceWall = new Map();
  const walls = [];
  for (const piece of splitPieces) {
    const wall = {
      ...piece.sourceWall,
      id: piece.pieceIndex === 0 ? piece.sourceWall.id : makeId("wall"),
      start: piece.start,
      end: piece.end
    };
    const pieceWithWall = {
      ...piece,
      wall
    };
    if (!piecesBySourceWall.has(piece.sourceWall.id)) {
      piecesBySourceWall.set(piece.sourceWall.id, []);
    }
    piecesBySourceWall.get(piece.sourceWall.id).push(pieceWithWall);
    walls.push(wall);
  }
  const remapAttachment = attachment => {
    const pieces = piecesBySourceWall.get(attachment.wallId);
    if (!pieces?.length) {
      return attachment;
    }
    const clampedValue = clamp(finite(attachment.t, 0.5), 0, 1);
    const piece = pieces.find(entry => clampedValue >= entry.startT - 1e-7 && clampedValue <= entry.endT + 1e-7) || pieces.at(-1);
    const span = Math.max(piece.endT - piece.startT, 1e-7);
    const remapped = {
      ...attachment,
      wallId: piece.wall.id,
      t: clamp((clampedValue - piece.startT) / span, 0, 1)
    };
    remapped.t = clampWindowT(piece.wall, remapped, openingWidthScale || 1);
    return remapped;
  };
  return {
    walls,
    windows: windowsInput.map(remapAttachment),
    doors: doorsInput.map(remapAttachment),
    railings: railingsInput.map(remapAttachment)
  };
}
function normalizeFloorScene(scene) {
  const value = createEmptyFloorScene();
  if (!scene || typeof scene != "object") {
    return value;
  }
  const finiteCurrent = finite(scene.schemaVersion, 0);
  const pixelsPerMeter = clamp(finite(scene.calibration?.pixelsPerMeter, 0), 0, 100000);
  const calibration = pixelsPerMeter > 0 ? {
    pixelsPerMeter: pixelsPerMeter,
    reference: scene.calibration?.reference ? {
      start: normalizePoint(scene.calibration.reference.start),
      end: normalizePoint(scene.calibration.reference.end),
      meters: clamp(finite(scene.calibration.reference.meters, 1), 0.01, 1000)
    } : null
  } : null;
  const list = Array.isArray(scene.walls) ? scene.walls.map(size => ({
    id: String(size?.id || makeId("wall")),
    start: normalizePoint(size?.start),
    end: normalizePoint(size?.end),
    height: clamp(finite(size?.height, scene.settings?.wallHeight || 2.8), 0.01, 6),
    thickness: clamp(finite(size?.thickness, scene.settings?.wallThickness || 0.12), 0.01, 3),
    opacity: size?.opacity === null || size?.opacity === undefined || size?.opacity === "" ? null : clamp(finite(size.opacity, scene.settings?.wallOpacity ?? themeColors.wallOpacity), 0, 1),
    allowOpenEnd: size?.allowOpenEnd === true
  })).filter(wall => distance(wall.start, wall.end) > 0.1) : [];
  const wallIdSet = new Set(list.map(item => item.id));
  const entriesVar = Array.isArray(scene.windows) ? scene.windows.map(attachment => ({
    id: String(attachment?.id || makeId("window")),
    wallId: String(attachment?.wallId || ""),
    t: clamp(finite(attachment?.t, 0.5), 0, 1),
    width: clamp(finite(attachment?.width, 1.4), 0.3, 20),
    height: clamp(finite(attachment?.height, 1.35), 0.3, 20),
    sill: clamp(finite(attachment?.sill, 0.85), 0, 20),
    hasDivider: attachment?.hasDivider !== false
  })).filter(wall => wallIdSet.has(wall.wallId)) : [];
  const entries = Array.isArray(scene.doors) ? scene.doors.map(attachment => ({
    id: String(attachment?.id || makeId("door")),
    wallId: String(attachment?.wallId || ""),
    t: clamp(finite(attachment?.t, 0.5), 0, 1),
    width: clamp(finite(attachment?.width, 0.9), 0.55, 20),
    height: clamp(finite(attachment?.height, 2.1), 1.8, 20),
    sill: 0,
    doorType: Object.hasOwn(yo, attachment?.doorType) ? attachment.doorType : "solid",
    hinge: attachment?.hinge === "right" ? "right" : "left",
    swing: attachment?.swing === -1 ? -1 : 1
  })).filter(wall => wallIdSet.has(wall.wallId)) : [];
  const filtered = Array.isArray(scene.railings) ? scene.railings.map(attachment => ({
    id: String(attachment?.id || makeId("railing")),
    wallId: String(attachment?.wallId || ""),
    t: clamp(finite(attachment?.t, 0.5), 0, 1),
    width: clamp(finite(attachment?.width, 2), 0.3, 20),
    height: clamp(finite(attachment?.height, 1.1), 0.5, 3),
    sill: 0
  })).filter(wall => wallIdSet.has(wall.wallId)) : [];
  const lightGroups = [];
  const lightGroupIds = new Set();
  if (Array.isArray(scene.lightGroups)) {
    for (const lightGroup of scene.lightGroups) {
      const groupId = String(lightGroup?.id || makeId("light-group"));
      if (!lightGroupIds.has(groupId)) {
        lightGroupIds.add(groupId);
        lightGroups.push({
          id: groupId,
          name: normalizeLabelText(lightGroup?.name, "灯组 " + (lightGroups.length + 1), 24),
          enabled: lightGroup?.enabled !== false
        });
      }
    }
  }
  const ensureLightGroup = (label = "默认灯组") => {
    const name = normalizeLabelText(label, "默认灯组", 24);
    const existing = lightGroups.find(group => group.name === name);
    if (existing) {
      return existing;
    }
    const created = {
      id: makeId("light-group"),
      name,
      enabled: true
    };
    lightGroups.push(created);
    lightGroupIds.add(created.id);
    return created;
  };
  if (!lightGroups.length) {
    lightGroups.push({
      id: "light-group-default",
      name: "默认灯组",
      enabled: true
    });
    lightGroupIds.add("light-group-default");
  }
  let tvCount = 0;
  let smallCarCount = 0;
  const items = Array.isArray(scene.items) ? scene.items.filter(item => !["smallseat", "entrydoor", "car"].includes(item?.type)).map(item => {
    const size = furnitureCatalog[item?.type] || furnitureCatalog.table;
    const clampCurrent = clamp(finite(item?.width, size.width), 0.1, 8);
    const clampNext = clamp(finite(item?.depth, size.depth), 0.1, 8);
    const flag = finiteCurrent < 2 && item?.type === "striplight" && clampNext > clampCurrent;
    const rotation = normalizeFullRotation(finite(item?.rotation) + (flag ? 90 : 0));
    const clampPrevious = clamp(finite(item?.height, size.height), itemMinimumHeight(item?.type), 6);
    const value = item?.type === "desktop" && Math.abs(clampCurrent - 1.2) < 0.01 && Math.abs(clampNext - 0.65) < 0.01;
    const flagCurrent = item?.type === "plant" && Math.abs(clampCurrent - 0.6) < 0.01 && Math.abs(clampNext - 0.6) < 0.01 && Math.abs(clampPrevious - 1.15) < 0.01;
    const flagNext = item?.type === "toilet" && Math.abs(clampCurrent - 0.7) < 0.01 && Math.abs(clampNext - 0.42) < 0.01;
    const flagPrevious = item?.type === "floorlamp" && Math.abs(clampCurrent - 0.9) < 0.01 && Math.abs(clampNext - 0.45) < 0.01 && Math.abs(clampPrevious - 1.8) < 0.01;
    const flagLocal = item?.type === "rug" && clampPrevious >= 0.045;
    const flagItem = item?.type === "downlight" && clampCurrent < 0.3 && clampNext < 0.3;
    const flagEntry = item?.type === "piano" && clampNext < 1;
    const temperature = defaultLightPresets[item?.type] || defaultLightPresets.downlight;
    const lightGroupId = set.has(item?.type) ? lightGroupIds.has(String(item?.lightGroupId || "")) ? String(item.lightGroupId) : ensureLightGroup(item?.lightGroup || "默认灯组").id : "";
    const tvLayerIndex = item?.type === "tv" ? ++tvCount : 0;
    const smallCarLayerIndex = item?.type === "smallcar" ? ++smallCarCount : 0;
    return {
      id: String(item?.id || makeId("item")),
      type: item?.type === "rounddiningtableturntable" ? "rounddiningtable" : furnitureCatalog[item?.type] ? item.type : "table",
      x: finite(item?.x),
      y: finite(item?.y),
      rotation: item?.type === "striplight" ? rotation : finite(item?.rotation),
      width: item?.type === "striplight" ? Math.max(clampCurrent, clampNext) : value || flagCurrent || flagPrevious || flagNext || flagItem || flagEntry ? size.width : clampCurrent,
      depth: item?.type === "striplight" ? Math.min(clampCurrent, clampNext) : value || flagCurrent || flagPrevious || flagNext || flagItem || flagEntry ? size.depth : clampNext,
      height: item?.type === "sideboard" && clampPrevious < 1.4 || value || flagCurrent || flagNext || flagLocal || flagEntry ? size.height : clampPrevious,
      elevation: clamp(finite(item?.elevation, size.elevation || 0), 0, 6),
      color: item?.type === "pillar" ? size.color : /^#[0-9a-f]{6}$/i.test(item?.color || "") ? item.color : size.color,
      ...(item?.type === "planlabel" ? {
        title: normalizeLabelText(item?.title, "家庭总览", 24),
        subtitle: normalizeLabelText(item?.subtitle, "HOME PLAN", 36),
        titleSpacing: clamp(finite(item?.titleSpacing, 1.05), 0, 1.8),
        subtitleSpacing: clamp(finite(item?.subtitleSpacing, 0.08), 0, 0.6),
        lineLength: clamp(finite(item?.lineLength, 0.86), 0.3, 1)
      } : {}),
      ...(item?.type === "tv" ? {
        screenEnabled: item?.screenEnabled !== false,
        screenLayerName: normalizeLabelText(item?.screenLayerName, "电视画面 " + tvLayerIndex, 24),
        tvMountStyle: tvMountStyles.has(item?.tvMountStyle) ? item.tvMountStyle : "standard"
      } : {}),
      ...(item?.type === "smallcar" ? {
        chargingEnabled: item?.chargingEnabled === true,
        chargingLayerName: normalizeLabelText(item?.chargingLayerName, "汽车充电 " + smallCarLayerIndex, 24)
      } : {}),
      ...(item?.type === "curtain" ? {
        curtainPosition: ["left", "right", "split"].includes(item?.curtainPosition) ? item.curtainPosition : "split"
      } : {}),
      ...(stairItemTypes.has(item?.type) ? {
        stairDirection: ["left", "right"].includes(item?.stairDirection) ? item.stairDirection : "right"
      } : {}),
      ...(item?.type === "shoecabinet" ? {
        shoeCabinetMirrored: item?.shoeCabinetMirrored === true
      } : {}),
      ...(roundTableTypes.has(item?.type) ? {
        roundTableTurntable: item?.type === "rounddiningtableturntable" || item?.roundTableTurntable === true
      } : {}),
      ...(item?.type === "camera" || item?.type === "presence" ? {
        verticalRotation: clamp(finite(item?.verticalRotation, 0), -180, 180)
      } : {}),
      ...(set.has(item?.type) ? {
        lightGroupId,
        verticalRotation: item?.type === "striplight" ? normalizeFullRotation(item?.verticalRotation) : clamp(finite(item?.verticalRotation, 0), -90, 90),
        ...(item?.type === "striplight" ? {
          stripRollRotation: normalizeFullRotation(item?.stripRollRotation),
          lightSourceVisible: item?.lightSourceVisible !== false
        } : {}),
        lightTemperature: clamp(finite(item?.lightTemperature, temperature.temperature), 2200, 6500),
        lightBrightness: clamp(finite(item?.lightBrightness, temperature.brightness), 0, 100),
        lightRange: clamp(finite(item?.lightRange, temperature.range), 0.5, 10),
        lightAngle: clamp(finite(item?.lightAngle, temperature.angle), 15, defaultItemDepth(item?.type))
      } : {})
    };
  }) : [];
  const background = scene.background?.assetId && scene.background?.url ? {
    assetId: String(scene.background.assetId),
    url: String(scene.background.url),
    name: String(scene.background.name || "户型底图"),
    width: clamp(finite(scene.background.width, 1), 1, 8192),
    height: clamp(finite(scene.background.height, 1), 1, 8192)
  } : null;
  const wallOpenings = buildWallOpeningsIndex(list, entriesVar, entries, pixelsPerMeter, filtered);
  return {
    schemaVersion: 2,
    background,
    calibration,
    settings: {
      wallHeight: clamp(finite(scene.settings?.wallHeight, 2.8), 0.01, 6),
      wallThickness: clamp(finite(scene.settings?.wallThickness, 0.12), 0.01, 3),
      wallOpacity: clamp(finite(scene.settings?.wallOpacity, themeColors.wallOpacity), 0, 1),
      floorEdgeVisible: scene.settings?.floorEdgeVisible !== false,
      planViewRotation: (Math.round(finite(scene.settings?.planViewRotation, 0) / 90) * 90 % 360 + 360) % 360,
      cameraView: scene.settings?.cameraView === "top" ? "top" : "free",
      cameraTopRotation: (Math.round(finite(scene.settings?.cameraTopRotation, 0) / 90) * 90 % 360 + 360) % 360,
      cameraMode: scene.settings?.cameraMode === "orthographic" ? "orthographic" : "perspective",
      cameraFocalLength: clamp(finite(scene.settings?.cameraFocalLength, 50), 18, 120),
      fixedCameraView: normalizeFixedCameraView(scene.settings?.fixedCameraView),
      livePreviewEnabled: scene.settings?.livePreviewEnabled !== false,
      backgroundVisible: scene.settings?.backgroundVisible !== false,
      snapEnabled: scene.settings?.snapEnabled !== false,
      snapEndpoints: scene.settings?.snapEndpoints !== false,
      snapIntersections: scene.settings?.snapIntersections !== false,
      snapSegments: scene.settings?.snapSegments !== false,
      snapOrthogonal: scene.settings?.snapOrthogonal !== false,
      snapAngles: scene.settings?.snapAngles !== false,
      snapGrid: scene.settings?.snapGrid !== false,
      snapTolerance: clamp(Math.round(finite(scene.settings?.snapTolerance, 13)), 6, 24),
      previewPanelRatio: clamp(finite(scene.settings?.previewPanelRatio, 0.52), 0.06, 0.94),
      detailsPanelWidthRatio: clamp(finite(scene.settings?.detailsPanelWidthRatio, 0.29), 0.08, 0.86)
    },
    walls: wallOpenings.walls,
    windows: wallOpenings.windows,
    doors: wallOpenings.doors,
    railings: wallOpenings.railings,
    lightGroups,
    items
  };
}
function makeId(argPrimary) {
  const value = globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return argPrimary + "-" + value;
}
function cloneFloorScene(argPrimary = floorSceneCurrent) {
  return structuredClone(argPrimary);
}
function resolveLightGroup(lightGroup) {
  return floorSceneCurrent.lightGroups?.find(item => item.id === lightGroup?.lightGroupId) || floorSceneCurrent.lightGroups?.[0] || null;
}
function findLightGroup(lightGroup, lightGroups = floorSceneCurrent) {
  return lightGroups?.lightGroups?.find(item => item.id === lightGroup?.lightGroupId) || lightGroups?.lightGroups?.[0] || null;
}
function isLightGroupVisible(lightGroup) {
  if (forcedVisibleLightGroupIds !== null) {
    return forcedVisibleLightGroupIds.has(lightGroup.id);
  } else if (resolveLightGroup(lightGroup)?.enabled === false) {
    return false;
  } else {
    return stageSession || isRebuildingWorld || !isPreviewQualityReady();
  }
}
function tvItemsOnFloor() {
  return floorSceneCurrent.items.filter(item => item.type === "tv");
}
function smallCarItemsOnFloor() {
  return floorSceneCurrent.items.filter(item => item.type === "smallcar");
}
function previewFloorEntries() {
  if (getPreviewFloorModeCurrent() === "all") {
    return projectDocCurrent.floors;
  } else {
    return [activeFloor()].filter(Boolean);
  }
}
function floorStackOffsetY(id) {
  if (getPreviewFloorModeCurrent() !== "all") {
    return 0;
  }
  const value = projectDocCurrent.floors.findIndex(item => item.id === id?.id);
  return Math.max(value, 0) * finite(projectDocCurrent.exportFloorGap, 3);
}
function floorScopedKey(argPrimary, argSecondary) {
  return argPrimary + ":" + argSecondary;
}
function layerScopedKey(flag, argSecondary) {
  return (flag || "floor") + ":" + argSecondary;
}
function previewScopedItemKey(argPrimary, value) {
  if (getPreviewFloorModeCurrent() === "all") {
    return floorScopedKey(argPrimary, value);
  } else {
    return value;
  }
}
function collectVisibleLights() {
  return (getPreviewFloorModeCurrent() === "all" ? projectDocCurrent?.floors || [] : [activeFloor()].filter(Boolean)).flatMap(floor => floor.scene.items.filter(item => set.has(item.type)).map(item => {
    const group = findLightGroup(item, floor.scene);
    return {
      floor,
      item,
      group,
      itemKey: layerScopedKey(floor.id, item.id),
      groupKey: previewScopedItemKey(floor.id, group?.id || "__ungrouped")
    };
  }));
}
function collectLightGroupsAcrossFloors(list = projectDocCurrent?.floors || []) {
  return list.flatMap(floor => floor.scene.lightGroups.map((group, index) => ({
    floor,
    group,
    index,
    key: floorScopedKey(floor.id, group.id),
    lights: floor.scene.items.filter(item => set.has(item.type) && item.lightGroupId === group.id)
  })));
}
function collectTvsAcrossFloors(list = projectDocCurrent?.floors || []) {
  return list.flatMap(floor => floor.scene.items.filter(item => item.type === "tv").map((item, index) => ({
    floor,
    item,
    index,
    key: floor.id + ":" + item.id
  })));
}
function collectSmallCarsAcrossFloors(list = projectDocCurrent?.floors || []) {
  return list.flatMap(floor => floor.scene.items.filter(item => item.type === "smallcar").map((item, index) => ({
    floor,
    item,
    index,
    key: floor.id + ":" + item.id
  })));
}
function ensureTvScreenLayerNames(argPrimary) {
  const idSet = new Set(tvItemsOnFloor().map(screenLayerName => screenLayerName.screenLayerName));
  let value = 1;
  for (const screenLayerName of argPrimary) {
    if (screenLayerName.type === "tv") {
      while (idSet.has("电视画面 " + value)) {
        value += 1;
      }
      screenLayerName.screenLayerName = "电视画面 " + value;
      screenLayerName.screenEnabled = screenLayerName.screenEnabled !== false;
      idSet.add(screenLayerName.screenLayerName);
      value += 1;
    }
  }
}
function ensureSmallCarChargingLayerNames(argPrimary) {
  const idSet = new Set(smallCarItemsOnFloor().map(chargingLayerName => chargingLayerName.chargingLayerName));
  let value = 1;
  for (const chargingLayerName of argPrimary) {
    if (chargingLayerName.type === "smallcar") {
      while (idSet.has("汽车充电 " + value)) {
        value += 1;
      }
      chargingLayerName.chargingLayerName = "汽车充电 " + value;
      chargingLayerName.chargingEnabled = chargingLayerName.chargingEnabled === true;
      idSet.add(chargingLayerName.chargingLayerName);
      value += 1;
    }
  }
}
function ensureItemLayerNames(argPrimary) {
  ensureTvScreenLayerNames(argPrimary);
  ensureSmallCarChargingLayerNames(argPrimary);
}
function ensureDefaultLightGroup() {
  const list = floorSceneCurrent.lightGroups ||= [];
  if (!list.length) {
    list.push({
      id: makeId("light-group"),
      name: "默认灯组",
      enabled: true
    });
  }
  if (!list.some(item => item.id === on)) {
    on = list[0].id;
  }
  return list.find(item => item.id === on) || list[0];
}
function syncLightGroupSelect(lightGroup) {
  const value = selectEl("#light-group");
  value.replaceChildren();
  for (const id2 of floorSceneCurrent.lightGroups || []) {
    const el = document.createElement("option");
    el.value = id2.id;
    el.textContent = id2.name;
    value.append(el);
  }
  value.value = resolveLightGroup(lightGroup)?.id || ensureDefaultLightGroup().id;
  syncStudioSelect(value);
}
function hideLightGroupContextMenu() {
  lightGroupContextMenu.hidden = true;
  lightGroupContextMenuId = "";
}
function showLightGroupContextMenu(id, event) {
  lightGroupContextMenuId = id.id;
  on = id.id;
  renderLightLayerPanel();
  const disabled = lightGroupContextMenu.querySelector("[data-light-group-action=\"delete\"]");
  disabled.disabled = floorSceneCurrent.lightGroups.length <= 1;
  lightGroupContextMenu.hidden = false;
  lightGroupContextMenu.style.left = Math.min(event.clientX, window.innerWidth - 116) + "px";
  lightGroupContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 108) + "px";
}
function deleteLightGroup(id) {
  if (!id || floorSceneCurrent.lightGroups.length <= 1) {
    return;
  }
  pushHistory();
  const found = floorSceneCurrent.lightGroups.find(item => item.id !== id.id);
  const value = new Set(floorSceneCurrent.items.filter(item => set.has(item.type) && item.lightGroupId === id.id).map(id => id.id));
  floorSceneCurrent.items = floorSceneCurrent.items.filter(id => !value.has(id.id));
  floorSceneCurrent.lightGroups = floorSceneCurrent.lightGroups.filter(item => item.id !== id.id);
  if (selection?.kind === "item" && value.has(selection.id)) {
    selection = null;
  }
  multiSelection = multiSelection.filter(kind => kind.kind !== "item" || !value.has(kind.id));
  if (on === id.id) {
    on = found.id;
  }
  refreshViews("lights");
  scheduleSave();
  showToast("已删除“" + id.name + "”及组内 " + value.size + " 盏灯。", "success");
}
function uniqueLightGroupName(argPrimary) {
  const value = new Set(floorSceneCurrent.lightGroups.map(named => named.name));
  if (!value.has(argPrimary)) {
    return argPrimary;
  }
  let nameSuffix = 2;
  while (value.has(argPrimary + " " + nameSuffix)) {
    nameSuffix += 1;
  }
  return argPrimary + " " + nameSuffix;
}
function duplicateLightGroup(lightGroup) {
  if (!lightGroup) {
    return;
  }
  pushHistory();
  const id = {
    ...structuredClone(lightGroup),
    id: makeId("light-group"),
    name: uniqueLightGroupName(lightGroup.name + " 副本")
  };
  const value = floorSceneCurrent.lightGroups.findIndex(item => item.id === lightGroup.id);
  floorSceneCurrent.lightGroups.splice(value + 1, 0, id);
  const list = floorSceneCurrent.items.filter(item => set.has(item.type) && item.lightGroupId === lightGroup.id).map(argPrimary => ({
    ...structuredClone(argPrimary),
    id: makeId("item"),
    lightGroupId: id.id
  }));
  floorSceneCurrent.items.push(...list);
  on = id.id;
  selection = list.length === 1 ? {
    kind: "item",
    id: list[0].id
  } : null;
  multiSelection = list.length > 1 ? list.map(id => ({
    kind: "item",
    id: id.id
  })) : [];
  renderLightLayerPanel();
  refreshViews("lights");
  scheduleSave();
  showToast("已复制“" + lightGroup.name + "”及组内 " + list.length + " 盏灯。", "success");
}
function clearLightGroupDropIndicators() {
  for (const element of lightGroupList.querySelectorAll(".light-group-row")) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
}
function reorderLightGroups(argPrimary, argSecondary, flag) {
  const value = floorSceneCurrent.lightGroups.findIndex(item => item.id === argPrimary);
  const fromIndex = floorSceneCurrent.lightGroups.findIndex(item => item.id === argSecondary);
  if (value < 0 || fromIndex < 0 || value === fromIndex) {
    return;
  }
  const list = [...floorSceneCurrent.lightGroups];
  const [movedGroup] = list.splice(value, 1);
  const targetIndex = list.findIndex(item => item.id === argSecondary);
  list.splice(targetIndex + (flag ? 1 : 0), 0, movedGroup);
  if (!list.every((id, mutateFlag) => id.id === floorSceneCurrent.lightGroups[mutateFlag]?.id)) {
    pushHistory();
    floorSceneCurrent.lightGroups = list;
    renderLightLayerPanel();
    updateSelectionInspector();
    scheduleSave();
  }
}
function renderLightLayerPanel() {
  lightLayerPanel.hidden = assetCategory !== "light";
  if (!lightLayerPanel.hidden) {
    ensureDefaultLightGroup();
    lightGroupList.replaceChildren();
    for (const id2 of floorSceneCurrent.lightGroups) {
      const el = document.createElement("div");
      el.className = "light-group-row" + (id2.id === on ? " active" : "");
      el.dataset.lightGroupId = id2.id;
      el.draggable = true;
      el.setAttribute("aria-label", id2.name + "，长按拖动排序，右键可重命名、复制或删除");
      let flag = false;
      let flagCurrent = null;
      const onPointerUp = () => {
        if (flagCurrent) {
          clearTimeout(flagCurrent);
        }
        flagCurrent = null;
        flag = false;
        el.classList.remove("drag-ready");
      };
      el.addEventListener("pointerdown", event => {
        if (event.button === 0 && !event.target.closest("button")) {
          onPointerUp();
          flagCurrent = setTimeout(() => {
            flagCurrent = null;
            flag = true;
            el.classList.add("drag-ready");
          }, 280);
        }
      });
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
      el.addEventListener("dragstart", event => {
        if (!flag) {
          event.preventDefault();
          onPointerUp();
          return;
        }
        draggingLightGroupId = id2.id;
        el.classList.remove("drag-ready");
        el.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-light-group", id2.id);
      });
      el.addEventListener("dragend", () => {
        draggingLightGroupId = "";
        el.classList.remove("dragging");
        onPointerUp();
        clearLightGroupDropIndicators();
      });
      el.addEventListener("click", () => {
        on = id2.id;
        renderLightLayerPanel();
      });
      el.addEventListener("contextmenu", event => {
        event.preventDefault();
        showLightGroupContextMenu(id2, event);
      });
      el.addEventListener("dragover", event => {
        if (!draggingLightGroupId || draggingLightGroupId === id2.id) {
          return;
        }
        event.preventDefault();
        clearLightGroupDropIndicators();
        const flag = event.clientY >= el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
        el.dataset.dropPosition = flag ? "after" : "before";
        el.classList.add(flag ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el.addEventListener("drop", event => {
        if (!draggingLightGroupId || draggingLightGroupId === id2.id) {
          return;
        }
        event.preventDefault();
        const argPrimary = draggingLightGroupId;
        const value = el.dataset.dropPosition === "after";
        draggingLightGroupId = "";
        clearLightGroupDropIndicators();
        reorderLightGroups(argPrimary, id2.id, value);
      });
      const button = document.createElement("button");
      button.type = "button";
      button.className = id2.enabled ? "on" : "";
      button.textContent = id2.enabled ? "◉" : "○";
      button.title = id2.enabled ? "关闭这个灯组" : "开启这个灯组";
      button.addEventListener("click", event => {
        event.stopPropagation();
        pushHistory();
        id2.enabled = !id2.enabled;
        requestLightGroupCacheRefresh([id2.id]);
        scheduleSave();
      });
      const element = document.createElement("span");
      element.className = "light-group-name";
      element.textContent = id2.name;
      element.title = "长按灯组后拖动排序，右键可重命名、复制或删除";
      const elCurrent = document.createElement("small");
      elCurrent.textContent = String(floorSceneCurrent.items.filter(item => set.has(item.type) && item.lightGroupId === id2.id).length);
      el.append(button, element, elCurrent);
      lightGroupList.append(el);
    }
    for (const [value, screenEnabled] of tvItemsOnFloor().entries()) {
      const el = document.createElement("div");
      el.className = "light-group-row tv-screen-layer-row";
      el.setAttribute("aria-label", (screenEnabled.screenLayerName || "电视画面 " + (value + 1)) + "，可独立开启或关闭");
      const button = document.createElement("button");
      button.type = "button";
      button.className = screenEnabled.screenEnabled !== false ? "on" : "";
      button.textContent = screenEnabled.screenEnabled !== false ? "◉" : "○";
      button.title = screenEnabled.screenEnabled !== false ? "关闭电视画面" : "开启电视画面";
      button.addEventListener("click", () => {
        pushHistory();
        screenEnabled.screenEnabled = screenEnabled.screenEnabled === false;
        refreshViews("items");
        scheduleSave();
      });
      const element = document.createElement("span");
      element.className = "light-group-name";
      element.textContent = screenEnabled.screenLayerName || "电视画面 " + (value + 1);
      element.title = "电视开启画面";
      const elCurrent = document.createElement("small");
      elCurrent.textContent = "1";
      el.append(button, element, elCurrent);
      lightGroupList.append(el);
    }
    for (const [value, chargingEnabled] of smallCarItemsOnFloor().entries()) {
      const el = document.createElement("div");
      el.className = "light-group-row car-charging-layer-row";
      el.setAttribute("aria-label", (chargingEnabled.chargingLayerName || "汽车充电 " + (value + 1)) + "，可独立开启或关闭");
      const button = document.createElement("button");
      button.type = "button";
      button.className = chargingEnabled.chargingEnabled === true ? "on" : "";
      button.textContent = chargingEnabled.chargingEnabled === true ? "◉" : "○";
      button.title = chargingEnabled.chargingEnabled === true ? "关闭汽车充电状态" : "开启汽车充电状态";
      button.addEventListener("click", () => {
        pushHistory();
        chargingEnabled.chargingEnabled = chargingEnabled.chargingEnabled !== true;
        refreshViews("items");
        scheduleSave();
      });
      const element = document.createElement("span");
      element.className = "light-group-name";
      element.textContent = chargingEnabled.chargingLayerName || "汽车充电 " + (value + 1);
      element.title = "汽车充电中状态图层";
      const elCurrent = document.createElement("small");
      elCurrent.textContent = "1";
      el.append(button, element, elCurrent);
      lightGroupList.append(el);
    }
  }
}
function setAllLightGroupsEnabled(mutateFlag) {
  const list = tvItemsOnFloor();
  const floor = smallCarItemsOnFloor();
  if (!(floorSceneCurrent.lightGroups || []).every(enabled => enabled.enabled === mutateFlag) || !list.every(screenEnabled => screenEnabled.screenEnabled !== false === mutateFlag) || !floor.every(chargingEnabled => chargingEnabled.chargingEnabled === true === mutateFlag)) {
    pushHistory();
    for (const enabled of floorSceneCurrent.lightGroups) {
      enabled.enabled = mutateFlag;
    }
    for (const screenEnabled of list) {
      screenEnabled.screenEnabled = mutateFlag;
    }
    for (const chargingEnabled of floor) {
      chargingEnabled.chargingEnabled = mutateFlag;
    }
    requestLightGroupCacheRefresh(floorSceneCurrent.lightGroups.map(item => item.id));
    if (list.length || floor.length) {
      rebuildPreviewMeshes({
        scope: "items",
        preserveLightCache: true
      });
    }
    scheduleSave();
  }
}
function isSelected(argPrimary, argSecondary) {
  return selection?.kind === argPrimary && selection.id === argSecondary || multiSelection.some(kind => kind.kind === argPrimary && kind.id === argSecondary);
}
function clearSelection() {
  selection = null;
  multiSelection = [];
}
function setSelection(kind, id) {
  selection = kind && id ? {
    kind,
    id
  } : null;
  multiSelection = [];
}
function itemPreviewScope(item) {
  if (item?.type === "flooropening") {
    return "all";
  } else if (set.has(item?.type)) {
    return "lights";
  } else {
    return "items";
  }
}
function selectionAssetCategoryFromList(list) {
  if (!list.length || list.some(kind => kind.kind !== "item")) {
    return "all";
  }
  const value = new Set(list.map(item => item.id));
  const filtered = floorSceneCurrent.items.filter(id => value.has(id.id));
  if (!filtered.length || filtered.some(type => type.type === "flooropening")) {
    return "all";
  }
  const length = filtered.filter(item => set.has(item.type)).length;
  if (length === filtered.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function activeSelectionAssetCategory() {
  return selectionAssetCategoryFromList(multiSelection.length ? multiSelection : selection ? [selection] : []);
}
function selectionLightGroupFilter(list) {
  if (!list.length) {
    return null;
  }
  if (list.some(kind => kind.kind !== "item")) {
    return "all";
  }
  const value = new Set(list.map(item => item.id));
  const filtered = floorSceneCurrent.items.filter(id => value.has(id.id));
  if (!filtered.length) {
    return null;
  }
  const listCurrent = filtered.filter(item => !set.has(item.type) || item.type === "striplight");
  if (!listCurrent.length) {
    return null;
  }
  const length = listCurrent.filter(item => set.has(item.type)).length;
  if (length === listCurrent.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function activeSelectionLightGroupFilter() {
  return selectionLightGroupFilter(multiSelection.length ? multiSelection : selection ? [selection] : []);
}
function rebuildPreviewForAssetFilters(argPrimary) {
  const value = activeSelectionLightGroupFilter();
  const scopeSet = new Set([argPrimary, value].filter(Boolean));
  if (scopeSet.size) {
    if (scopeSet.has("all")) {
      rebuildPreviewMeshes({
        scope: "all",
        preserveLightCache: true
      });
      return;
    }
    for (const scope of scopeSet) {
      rebuildPreviewMeshes({
        scope,
        preserveLightCache: true
      });
    }
  }
}
function cachedWallOpenings() {
  const value = buildWallOpeningsIndex(floorSceneCurrent.walls, floorSceneCurrent.windows, floorSceneCurrent.doors, pixelsPerMeter() || 1, floorSceneCurrent.railings);
  floorSceneCurrent.walls = value.walls;
  floorSceneCurrent.windows = value.windows;
  floorSceneCurrent.doors = value.doors;
  floorSceneCurrent.railings = value.railings;
}
function wallIdMap() {
  const lookupMap = new Map(floorSceneCurrent.walls.map(id => [id.id, id]));
  const segments = mergeCollinearWallSegments(floorSceneCurrent.walls, 0.000001);
  if (segments.walls.length === floorSceneCurrent.walls.length) {
    return 0;
  }
  const map = new Map(segments.walls.map(id => [id.id, id]));
  const remapOpeningWall = wall => {
    const flag = segments.wallIdMap.get(wall.wallId);
    const entry = lookupMap.get(wall.wallId);
    const flagCurrent = map.get(flag);
    if (!flag || !entry || !flagCurrent) {
      return wall;
    }
    const attachment = remapWallAttachment(wall, entry, flagCurrent);
    attachment.t = clampWindowT(flagCurrent, attachment, pixelsPerMeter() || 1);
    return attachment;
  };
  const value = floorSceneCurrent.walls.length - segments.walls.length;
  floorSceneCurrent.walls = segments.walls;
  floorSceneCurrent.windows = floorSceneCurrent.windows.map(remapOpeningWall);
  floorSceneCurrent.doors = floorSceneCurrent.doors.map(remapOpeningWall);
  floorSceneCurrent.railings = floorSceneCurrent.railings.map(remapOpeningWall);
  return value;
}
function pixelsPerMeter() {
  return floorSceneCurrent.calibration?.pixelsPerMeter || 0;
}
class StudioHttpError extends Error {
  constructor(argPrimary, argSecondary, argTertiary) {
    super(argPrimary);
    this.status = argSecondary;
    this.payload = argTertiary;
  }
}
async function studioFetch(argPrimary, method = {}) {
  if (isStageEmbed && method.method && method.method !== "GET") {
    throw new Error("交互户型为只读视图。");
  }
  const status = await fetch("/api/v1" + argPrimary, {
    cache: "no-store",
    ...method,
    headers: method.body ? {
      "Content-Type": "application/json",
      ...(method.headers || {})
    } : method.headers
  });
  const flag = status.status === 204 ? "" : await status.text();
  let detail = null;
  if (flag) {
    try {
      detail = JSON.parse(flag);
    } catch {
      detail = null;
    }
  }
  if (status.status === 401) {
    window.location.assign("/login?next=" + encodeURIComponent(window.location.pathname));
    const flag = new StudioHttpError("登录状态已失效。", status.status, detail);
    throw window.HABridgeLog?.linkError(flag, status) || flag;
  }
  if (status.status === 403 && detail?.detail?.code === "LICENSE_RESTRICTED") {
    window.location.assign("/license");
    const flag = new StudioHttpError("当前授权无法使用户型图绘制。", status.status, detail);
    throw window.HABridgeLog?.linkError(flag, status) || flag;
  }
  if (!status.ok) {
    const message = detail?.detail;
    const flag = new StudioHttpError(typeof message == "string" ? message : message?.message || "请求失败（HTTP " + status.status + "）", status.status, detail);
    throw window.HABridgeLog?.linkError(flag, status) || flag;
  }
  return detail;
}
function showToast(argPrimary, argSecondary = "") {
  window.clearTimeout(toastTimer);
  toastCurrent.textContent = argPrimary;
  toastCurrent.className = ("toast visible " + argSecondary).trim();
  toastTimer = window.setTimeout(() => {
    toastCurrent.className = "toast";
  }, argSecondary === "warning" ? 4400 : 2600);
}
function setSaveStateLabel(mutateFlag, argSecondary = "") {
  el.className = ("save-state " + argSecondary).trim();
  el.innerHTML = "<i></i>" + mutateFlag;
}
function pushHistory() {
  undoStack.push(cloneFloorScene());
  if (undoStack.length > 40) {
    undoStack.shift();
  }
  redoStack = [];
}
function pushUndoSnapshot(argPrimary) {
  undoStack.push(argPrimary);
  if (undoStack.length > 40) {
    undoStack.shift();
  }
  redoStack = [];
}
async function restoreFloorScene(scene) {
  floorSceneCurrent = normalizeFloorScene(scene);
  const floor = activeFloor();
  if (floor) {
    floor.scene = floorSceneCurrent;
  }
  planView.rotation = floorSceneCurrent.settings.planViewRotation;
  clearSelection();
  resetWallDrawingCurrent();
  await reloadPlanBackground();
  refreshViews();
  scheduleSave();
}
async function undoEdit() {
  if (!undoStack.length) {
    return;
  }
  redoStack.push(cloneFloorScene());
  const scene = undoStack.pop();
  await restoreFloorScene(scene);
}
async function redoEdit() {
  if (!redoStack.length) {
    return;
  }
  undoStack.push(cloneFloorScene());
  const scene = redoStack.pop();
  await restoreFloorScene(scene);
}
function scheduleSave() {
  if (!isStageEmbed) {
    isExporting = false;
    saveGeneration += 1;
    setSaveStateLabel("有未保存修改", "saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(flushSave, 650);
    updateProgressChecklist();
  }
}
async function loadProjectDocument(floor) {
  const value = ++projectLoadGeneration;
  window.clearTimeout(deferredModelTimerCurrent);
  deferredModelTimerCurrent = null;
  deferredModelTasks = [];
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  hasProjectLoadedCurrent = floor;
  projectDocCurrent = normalizeProjectDocument(floor.scene);
  if (isStageEmbed) {
    for (const floor of projectDocCurrent.floors) {
      floor.scene.settings.livePreviewEnabled = true;
    }
  }
  applyBaseLighting(projectDocCurrent.baseLighting);
  activeFloorId = projectDocCurrent.activeFloorId;
  if (isAutoDiagramEmbedCurrent && floorSelectionQueryCurrent !== null) {
    const id = projectDocCurrent.floors.find(item => item.id === floorSelectionQueryCurrent);
    if (floorSelectionQueryCurrent === "all" && projectDocCurrent.floors.length > 1) {
      projectDocCurrent.previewFloorMode = "all";
    } else if (id) {
      projectDocCurrent.previewFloorMode = "active";
      projectDocCurrent.activeFloorId = id.id;
      activeFloorId = id.id;
    }
  }
  floorSceneCurrent = activeFloor().scene;
  on = "";
  clearSelection();
  resetWallDrawingCurrent();
  undoStack = [];
  redoStack = [];
  const list = visibleExternalModelKeys();
  const flag = isAutoDiagramEmbedCurrent;
  if (flag) {
    deferExternalModelsCurrent = true;
  }
  let modelPromises = [];
  if (flag) {
    modelPromises = list.map(argPrimary => loadExternalItemModel(argPrimary));
  }
  externalModelQueueActive = !flag;
  window.externalModelLoadsDeferred = externalModelQueueActive;
  deferredModelTasks = flag ? [] : list;
  if (!flag) {
    scheduleDeferredModelLoad();
  }
  updateModelLoadStatus();
  syncPreviewFloorButtons();
  updateAlignFloorButton();
  planView.rotation = floorSceneCurrent.settings.planViewRotation;
  await reloadPlanBackground();
  refreshViews(flag ? "none" : "all");
  if (!flag) {
    scheduleOrbitInteractionWarmup(1200);
  }
  if (flag) {
    try {
      const settledResults = Promise.allSettled(modelPromises);
      await Promise.race([settledResults, new Promise(argPrimary => window.setTimeout(argPrimary, 3500))]);
      Promise.allSettled(modelPromises).then(() => {
        if (value === projectLoadGeneration) {
          refreshStudioChrome();
        }
      });
    } finally {
      if (value === projectLoadGeneration) {
        window.clearTimeout(modelLoadStatusTimerCurrent);
        modelLoadStatusTimerCurrent = null;
        deferExternalModelsCurrent = false;
        updateModelLoadStatus();
      }
    }
  } else {
    rebuildPreviewMeshes({
      force: true
    });
    Promise.allSettled(modelPromises).then(() => {
      if (value === projectLoadGeneration) {
        refreshStudioChrome();
      }
    });
  }
  resizePlanCanvas();
  fitPlanViewToContent();
  if (!flag) {
    requestAnimationFrame(() => {
      if (activeFixedCameraView()) {
        restoreFixedCameraView({
          recordChange: false,
          silent: true
        });
      } else {
        setCameraProjectionMode(getCameraProjectionMode(), {
          preserveView: false
        });
        applyCameraViewCurrent();
      }
    });
  }
}
function showSaveConflict(latest, localScene, targetVersion) {
  saveConflictStateCurrent = {
    latest,
    localScene,
    targetVersion
  };
  setSaveStateLabel("等待处理保存冲突", "error");
  if (!saveConflictDialog.open) {
    saveConflictDialog.showModal();
  }
}
async function flushSave() {
  if (isStageEmbed || !hasProjectLoadedCurrent || isFlushingSave || saveConflictStateCurrent || saveGeneration === savedGeneration) {
    return;
  }
  isFlushingSave = true;
  const targetVersion = saveGeneration;
  setSaveStateLabel("正在保存…", "saving");
  const putStudioDocument = async revision => studioFetch("/studio3d", {
    method: "PUT",
    hbLogContext: {
      phase: "studio-save"
    },
    body: JSON.stringify({
      revision: revision.revision,
      scene: cloneProjectForStage()
    })
  });
  try {
    try {
      hasProjectLoadedCurrent = await putStudioDocument(hasProjectLoadedCurrent);
    } catch (error) {
      if (error.status !== 409) {
        throw error;
      }
      const latest = await studioFetch("/studio3d");
      showSaveConflict(latest, cloneProjectForStage(), targetVersion);
      return;
    }
    savedGeneration = targetVersion;
    if (saveGeneration === savedGeneration) {
      setSaveStateLabel("已自动保存", "saved");
    }
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-save"
    });
    setSaveStateLabel("保存失败", "error");
    showToast(error.message || "3D 草稿保存失败。", "error");
  } finally {
    isFlushingSave = false;
    if (!saveConflictStateCurrent && saveGeneration !== savedGeneration) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(flushSave, 500);
    }
  }
}
saveConflictDialog.addEventListener("cancel", event => event.preventDefault());
Mf.addEventListener("click", async () => {
  const isLatest = saveConflictStateCurrent;
  if (isLatest) {
    saveConflictStateCurrent = null;
    saveConflictDialog.close();
    try {
      await loadProjectDocument(isLatest.latest);
      savedGeneration = saveGeneration;
      setSaveStateLabel("已加载服务器版本", "saved");
      showToast("已加载另一页面保存的户型，当前页面没有执行覆盖。", "success");
    } catch (error) {
      setSaveStateLabel("载入失败", "error");
      showToast(error.message || "服务器版本载入失败。", "error");
    }
  }
});
Sf.addEventListener("click", () => {
  const isLocalScene = saveConflictStateCurrent;
  if (isLocalScene) {
    projectDocCurrent = normalizeProjectDocument(isLocalScene.localScene);
    activeFloorId = projectDocCurrent.activeFloorId;
    floorSceneCurrent = activeFloor().scene;
    hasProjectLoadedCurrent = isLocalScene.latest;
    saveConflictStateCurrent = null;
    saveConflictDialog.close();
    setSaveStateLabel("正在确认覆盖…", "saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(flushSave, 0);
  }
});
function planToScreen(planPoint) {
  return {
    x: planPoint.x * planView.zoom + planView.offsetX,
    y: planPoint.y * planView.zoom + planView.offsetY
  };
}
function screenToPlan(planPoint) {
  const value = planWidth / 2;
  const halfPlanHeight = planHeight / 2;
  const rotationRad = -planView.rotation * Math.PI / 180;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  const localX = planPoint.x - value;
  const localY = planPoint.y - halfPlanHeight;
  return {
    x: value + localX * cos - localY * sin,
    y: halfPlanHeight + localX * sin + localY * cos
  };
}
function screenToPlanWithView(planPointCurrent) {
  const planPoint = screenToPlan(planPointCurrent);
  return {
    x: (planPoint.x - planView.offsetX) / planView.zoom,
    y: (planPoint.y - planView.offsetY) / planView.zoom
  };
}
function pointerEventToCanvasPoint(event) {
  const left = element.getBoundingClientRect();
  return {
    x: event.clientX - left.left,
    y: event.clientY - left.top
  };
}
function planContentBounds() {
  if (floorSceneCurrent.walls.length) {
    return modelBounds({
      background: null,
      walls: floorSceneCurrent.walls,
      items: []
    });
  } else if (floorSceneCurrent.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorSceneCurrent.items
    });
  } else {
    return modelBounds(floorSceneCurrent);
  }
}
function fitPlanViewToContent() {
  const value = planContentBounds();
  const clampCurrent = clamp(Math.min(planWidth, planHeight) * 0.045, 18, 34);
  const fitWidth = Math.max(planWidth - clampCurrent * 2, 80);
  const fitHeight = Math.max(planHeight - clampCurrent * 2, 80);
  const flag = Math.abs(planView.rotation / 90) % 2 === 1;
  const fitContentHeight = flag ? value.height : value.width;
  const fitContentWidth = flag ? value.width : value.height;
  planView.zoom = clamp(Math.min(fitWidth / fitContentHeight, fitHeight / fitContentWidth), 0.03, 8);
  planView.offsetX = planWidth / 2 - (value.minX + value.width / 2) * planView.zoom;
  planView.offsetY = planHeight / 2 - (value.minY + value.height / 2) * planView.zoom;
  planNeedsRedraw = true;
  drawPlan();
}
function zoomPlanViewAt(argPrimary, planPointCurrent = {
  x: planWidth / 2,
  y: planHeight / 2
}) {
  const planPoint = screenToPlanWithView(planPointCurrent);
  const point = screenToPlan(planPointCurrent);
  planView.zoom = clamp(planView.zoom * argPrimary, 0.03, 12);
  planView.offsetX = point.x - planPoint.x * planView.zoom;
  planView.offsetY = point.y - planPoint.y * planView.zoom;
  drawPlan();
}
function rotatePlanView() {
  planView.rotation = (planView.rotation + 90) % 360;
  floorSceneCurrent.settings.planViewRotation = planView.rotation;
  fitPlanViewToContent();
  scheduleSave();
}
function resizePlanCanvas() {
  const size = planStage.getBoundingClientRect();
  planWidth = Math.max(Math.round(size.width), 1);
  planHeight = Math.max(Math.round(size.height), 1);
  const value = Math.min(window.devicePixelRatio || 1, 2);
  element.width = Math.round(planWidth * value);
  element.height = Math.round(planHeight * value);
  planCtx.setTransform(value, 0, 0, value, 0, 0);
  if (planNeedsRedraw) {
    drawPlan();
  } else {
    fitPlanViewToContent();
  }
}
function getWallAnalysis(argPrimary) {
  const tolerance = Math.max(1, argPrimary * 0.01);
  const value = floorSceneCurrent.walls.map(wall => wall.id + "," + wall.start.x + "," + wall.start.y + "," + wall.end.x + "," + wall.end.y + "," + wall.thickness + "," + (wall.allowOpenEnd === true ? 1 : 0)).join(";");
  if (wallAnalysisCache.scene !== floorSceneCurrent || wallAnalysisCache.signature !== tolerance + "|" + value) {
    wallAnalysisCache = {
      scene: floorSceneCurrent,
      signature: tolerance + "|" + value,
      tolerance,
      floorPolygons: null,
      intersections: null,
      joinExtensions: null,
      unclosedEndpoints: null
    };
  }
  return wallAnalysisCache;
}
function getFloorPolygons(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.floorPolygons ||= closedWallFloorPolygons(floorSceneCurrent.walls, value.tolerance);
  return value.floorPolygons;
}
function getWallIntersections(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.intersections ||= wallIntersections(floorSceneCurrent.walls);
  return value.intersections;
}
function getWallJoinExtensions(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.joinExtensions ||= wallJoinExtensions(floorSceneCurrent.walls);
  return value.joinExtensions;
}
function getUnclosedWallEndpoints(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.unclosedEndpoints ||= unclosedWallEndpoints(floorSceneCurrent.walls, value.tolerance, getFloorPolygons(argPrimary));
  return value.unclosedEndpoints;
}
function wallAttachmentWorldPoint(size) {
  const wall = floorSceneCurrent.walls.find(item => item.id === size.wallId);
  if (!wall) {
    return null;
  }
  const value = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const flag = Math.hypot(value, dy);
  if (!flag) {
    return null;
  }
  const t = clampWindowT(wall, size, pixelsPerMeter() || 1);
  const center = {
    x: wall.start.x + value * t,
    y: wall.start.y + dy * t
  };
  const minValue = Math.min(size.width * (pixelsPerMeter() || 1) / 2, flag / 2);
  const unit = {
    x: value / flag,
    y: dy / flag
  };
  return {
    wall,
    center,
    start: {
      x: center.x - unit.x * minValue,
      y: center.y - unit.y * minValue
    },
    end: {
      x: center.x + unit.x * minValue,
      y: center.y + unit.y * minValue
    },
    unit
  };
}
function drawWindowPreview(size, preview = {}) {
  const isWall = wallAttachmentWorldPoint(size);
  if (!isWall) {
    return;
  }
  const flag = isSelected("railing", size.id);
  const color = preview.preview ? "rgba(123, 220, 240, .72)" : flag ? "#ffaf46" : "#8bd7e8";
  const width = Math.max(10, isWall.wall.thickness * (pixelsPerMeter() || 100) * planView.zoom + 5);
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(7, 16, 21, .94)",
    width,
    cap: "butt"
  });
  drawPlanLine(isWall.start, isWall.end, {
    color,
    width: flag ? 5 : 3,
    cap: "butt"
  });
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(224, 250, 255, .72)",
    width: 1,
    cap: "butt"
  });
  drawPlanPoint(isWall.start, color, flag ? 3 : 2);
  drawPlanPoint(isWall.end, color, flag ? 3 : 2);
  if (flag && !preview.preview) {
    drawFloatingLabel(isWall.center, "玻璃栏杆 · " + size.width.toFixed(2) + " m", "#8bd7e8");
  }
}
function drawDoorPreview(size, preview = {}) {
  const isWall = wallAttachmentWorldPoint(size);
  if (!isWall) {
    return;
  }
  const flag = isSelected("door", size.id);
  const value = size.doorType || "solid";
  const color = preview.preview ? "rgba(255, 189, 110, .76)" : flag ? "#ffaf46" : ["solid", "double", "entry", "roller-shutter", "frame-only"].includes(value) ? "#edf2f7" : "#bfe9ff";
  const width = Math.max(10, isWall.wall.thickness * (pixelsPerMeter() || 100) * planView.zoom + 5);
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(7, 16, 21, .94)",
    width,
    cap: "butt"
  });
  if (value === "frame-only") {
    const planPoint = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(5 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.55);
    for (const point of [isWall.start, isWall.end]) {
      drawPlanLine({
        x: point.x - planPoint.x * maxValue,
        y: point.y - planPoint.y * maxValue
      }, {
        x: point.x + planPoint.x * maxValue,
        y: point.y + planPoint.y * maxValue
      }, {
        color,
        width: flag ? 4 : 3,
        cap: "butt"
      });
    }
    if (flag) {
      drawFloatingLabel(isWall.center, "仅门框 · " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value === "sliding-glass") {
    const planPoint = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2.5 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.16);
    const distanceCurrent = distance(isWall.start, isWall.end);
    const doorHingeSign = size.hinge === "right" ? 1 : -1;
    const centers = slidingDoorPanelCenters(distanceCurrent, doorHingeSign);
    const doorPanelInset = distanceCurrent * 0.27;
    for (const [panelOffset, hingeSign] of [[centers.fixed, -1], [centers.moving, 1]]) {
      const point = {
        x: isWall.center.x + isWall.unit.x * panelOffset,
        y: isWall.center.y + isWall.unit.y * panelOffset
      };
      const options = {
        x: planPoint.x * maxValue * hingeSign,
        y: planPoint.y * maxValue * hingeSign
      };
      const doorHandlePointA = {
        x: point.x - isWall.unit.x * doorPanelInset + options.x,
        y: point.y - isWall.unit.y * doorPanelInset + options.y
      };
      const doorHandlePointB = {
        x: point.x + isWall.unit.x * doorPanelInset + options.x,
        y: point.y + isWall.unit.y * doorPanelInset + options.y
      };
      drawPlanLine(doorHandlePointA, doorHandlePointB, {
        color,
        width: flag ? 4 : 3,
        cap: "butt"
      });
      drawPlanPoint(hingeSign < 0 ? doorHandlePointB : doorHandlePointA, color, 2);
    }
    if (flag) {
      drawFloatingLabel(isWall.center, "玻璃推拉门 · " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value === "roller-shutter") {
    const planPoint = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08) * (size.swing === -1 ? -1 : 1);
    drawPlanLine({
      x: isWall.start.x + planPoint.x * maxValue,
      y: isWall.start.y + planPoint.y * maxValue
    }, {
      x: isWall.end.x + planPoint.x * maxValue,
      y: isWall.end.y + planPoint.y * maxValue
    }, {
      color,
      width: flag ? 5 : 4,
      cap: "butt"
    });
    const distanceCurrent = distance(isWall.start, isWall.end);
    const max = Math.max(3, Math.min(18, Math.round(size.width / 0.35)));
    for (let step = 1; step < max; step += 1) {
      const doorLeafOffset = distanceCurrent * (step / max - 0.5);
      const point = {
        x: isWall.center.x + isWall.unit.x * doorLeafOffset + planPoint.x * maxValue,
        y: isWall.center.y + isWall.unit.y * doorLeafOffset + planPoint.y * maxValue
      };
      drawPlanLine({
        x: point.x - planPoint.x * 3 / planView.zoom,
        y: point.y - planPoint.y * 3 / planView.zoom
      }, {
        x: point.x + planPoint.x * 3 / planView.zoom,
        y: point.y + planPoint.y * 3 / planView.zoom
      }, {
        color: "rgba(167, 178, 188, .72)",
        width: 1,
        cap: "butt"
      });
    }
    if (flag) {
      drawFloatingLabel(isWall.center, "卷帘门 · " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value === "entry") {
    const planPoint = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08);
    drawPlanLine({
      x: isWall.start.x + planPoint.x * maxValue,
      y: isWall.start.y + planPoint.y * maxValue
    }, {
      x: isWall.end.x + planPoint.x * maxValue,
      y: isWall.end.y + planPoint.y * maxValue
    }, {
      color,
      width: preview.preview ? 3 : flag ? 5 : 4,
      cap: "butt"
    });
    drawPlanLine({
      x: isWall.start.x - planPoint.x * maxValue,
      y: isWall.start.y - planPoint.y * maxValue
    }, {
      x: isWall.end.x - planPoint.x * maxValue,
      y: isWall.end.y - planPoint.y * maxValue
    }, {
      color: "rgba(167, 178, 188, .72)",
      width: 1,
      cap: "butt"
    });
    const local = size.hinge === "right" ? -1 : 1;
    drawPlanPoint({
      x: isWall.center.x + isWall.unit.x * size.width * local * 0.34,
      y: isWall.center.y + isWall.unit.y * size.width * local * 0.34
    }, color, flag ? 3 : 2);
    if (flag) {
      drawFloatingLabel(isWall.center, "入户门（常闭）· " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value === "double") {
    const planPoint = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const local = size.swing === -1 ? -1 : 1;
    const value = distance(isWall.start, isWall.end) / 2 * local;
    const options = {
      x: isWall.start.x + planPoint.x * value,
      y: isWall.start.y + planPoint.y * value
    };
    const localCurrent = {
      x: isWall.end.x + planPoint.x * value,
      y: isWall.end.y + planPoint.y * value
    };
    drawPlanLine(isWall.start, options, {
      color,
      width: preview.preview ? 2 : flag ? 4 : 3,
      cap: "butt"
    });
    drawPlanLine(isWall.end, localCurrent, {
      color,
      width: preview.preview ? 2 : flag ? 4 : 3,
      cap: "butt"
    });
    drawPlanPoint(isWall.start, color, flag ? 3.5 : 2.5);
    drawPlanPoint(isWall.end, color, flag ? 3.5 : 2.5);
    if (flag) {
      drawFloatingLabel(isWall.center, "双开门 · " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  const flagCurrent = size.hinge === "right";
  const planPoint = flagCurrent ? isWall.end : isWall.start;
  const point = flagCurrent ? isWall.start : isWall.end;
  const options = {
    x: point.x - planPoint.x,
    y: point.y - planPoint.y
  };
  const local = size.swing === -1 ? -1 : 1;
  const planPointCurrent = {
    x: planPoint.x - options.y * local,
    y: planPoint.y + options.x * local
  };
  drawPlanLine(planPoint, planPointCurrent, {
    color,
    width: preview.preview ? 2 : flag ? 4 : 3,
    cap: "butt",
    dash: preview.preview ? [5, 4] : null
  });
  if (value === "glass") {
    const point = {
      x: isWall.unit.x * 3 / planView.zoom,
      y: isWall.unit.y * 3 / planView.zoom
    };
    drawPlanLine({
      x: planPoint.x + point.x,
      y: planPoint.y + point.y
    }, {
      x: planPointCurrent.x + point.x,
      y: planPointCurrent.y + point.y
    }, {
      color: "rgba(183, 229, 247, .58)",
      width: 1,
      cap: "butt"
    });
  }
  const screen = planToScreen(planPoint);
  const dist = distance(planPoint, point) * planView.zoom;
  const angle = Math.atan2(options.y, options.x);
  const localCurrent = angle + local * Math.PI / 2;
  planCtx.save();
  planCtx.strokeStyle = color;
  planCtx.lineWidth = preview.preview ? 1 : flag ? 2 : 1.25;
  if (preview.preview) {
    planCtx.setLineDash([5, 4]);
  }
  planCtx.beginPath();
  planCtx.arc(screen.x, screen.y, dist, angle, localCurrent, local < 0);
  planCtx.stroke();
  planCtx.restore();
  drawPlanPoint(planPoint, color, flag ? 3.5 : 2.5);
  if (flag) {
    drawFloatingLabel(isWall.center, "" + (value === "glass" ? "玻璃门 · " : "") + size.width.toFixed(2) + " m", "#ffaf46");
  }
}
function drawItemOnPlan(item) {
  const planPoint = planToScreen(item);
  const planItemWidthPx = item.width * pixelsPerMeter() * planView.zoom;
  const planItemDepthPx = item.depth * pixelsPerMeter() * planView.zoom;
  const selected = isSelected("item", item.id);
  planCtx.save();
  planCtx.translate(planPoint.x, planPoint.y);
  planCtx.rotate(item.rotation * Math.PI / 180);
  planCtx.fillStyle = item.color + "c7";
  planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
  planCtx.lineWidth = selected ? 2 : 1;
  if (item.type === "flooropening") {
    planCtx.fillStyle = "rgba(9, 17, 25, .55)";
    planCtx.fillRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.setLineDash([6, 4]);
    planCtx.strokeRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.setLineDash([]);
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx / 2, -planItemDepthPx / 2);
    planCtx.lineTo(planItemWidthPx / 2, planItemDepthPx / 2);
    planCtx.moveTo(planItemWidthPx / 2, -planItemDepthPx / 2);
    planCtx.lineTo(-planItemWidthPx / 2, planItemDepthPx / 2);
    planCtx.stroke();
    planCtx.fillStyle = "#ffd39c";
    planCtx.font = "12px sans-serif";
    planCtx.textAlign = "center";
    planCtx.fillText("楼板洞口", 0, 4);
  } else if (set.has(item.type)) {
    const planLabelProjectionMetrics = Math.max(Math.min(planItemWidthPx, planItemDepthPx) * 0.44, item.type === "downlight" ? 10 : 8);
    const titleFontSize = "#" + kelvinToRgbHex(item.lightTemperature).toString(16).padStart(6, "0");
    const iconX = isLightGroupVisible(item);
    planCtx.fillStyle = iconX ? titleFontSize : "#68737d";
    planCtx.strokeStyle = iconX ? "rgba(255, 221, 163, .88)" : "rgba(196, 207, 216, .48)";
    planCtx.lineWidth = 1.2;
    if (item.type === "striplight") {
      planCtx.beginPath();
      const localValue = Math.min(7, planItemDepthPx * 0.42);
      planCtx.roundRect(-planItemWidthPx / 2, -planItemDepthPx * 0.34, planItemWidthPx, planItemDepthPx * 0.68, localValue);
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = iconX ? "rgba(255, 238, 195, .95)" : "rgba(196, 207, 216, .42)";
      planCtx.lineWidth = Math.max(2, planItemDepthPx * 0.12);
      planCtx.beginPath();
      planCtx.moveTo(-planItemWidthPx * 0.42, 0);
      planCtx.lineTo(planItemWidthPx * 0.42, 0);
      planCtx.stroke();
    } else if (item.type === "ceilinglight") {
      const localValue = Math.max(Math.min(planItemWidthPx, planItemDepthPx) * 0.82, 16);
      planCtx.beginPath();
      planCtx.rect(-localValue / 2, -localValue / 2, localValue, localValue);
      planCtx.fill();
      planCtx.stroke();
      const computedValue = localValue * 0.58;
      planCtx.strokeRect(-computedValue / 2, -computedValue / 2, computedValue, computedValue);
    } else {
      planCtx.beginPath();
      planCtx.arc(0, 0, planLabelProjectionMetrics, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.stroke();
      planCtx.beginPath();
      planCtx.arc(0, 0, planLabelProjectionMetrics * 0.5, 0, Math.PI * 2);
      planCtx.stroke();
      for (let zeroValue = 0; zeroValue < 4; zeroValue += 1) {
        const halfValue = zeroValue * Math.PI / 2;
        planCtx.beginPath();
        planCtx.moveTo(Math.cos(halfValue) * planLabelProjectionMetrics * 0.68, Math.sin(halfValue) * planLabelProjectionMetrics * 0.68);
        planCtx.lineTo(Math.cos(halfValue) * planLabelProjectionMetrics * 1.12, Math.sin(halfValue) * planLabelProjectionMetrics * 1.12);
        planCtx.stroke();
      }
    }
  } else if (item.type === "planlabel") {
    const cornerRadius = planLabelProjectionMetrics(planItemWidthPx, planItemDepthPx, item.lineLength);
    planCtx.fillStyle = "#929baa";
    const localValue = cornerRadius.titleFontSize;
    planCtx.font = "700 " + localValue + "px sans-serif";
    drawTrackedText(planCtx, item.title || "家庭总览", cornerRadius.titleStartX, cornerRadius.titleY, localValue * clamp(finite(item.titleSpacing, 1.05), 0, 1.8), cornerRadius.titleMaxWidth);
    const iconX = cornerRadius.iconX;
    const iconY = cornerRadius.iconY;
    const iconSize = cornerRadius.iconSize;
    planCtx.fillStyle = "#929baa";
    planCtx.beginPath();
    planCtx.moveTo(iconX, iconY - iconSize * 0.58);
    planCtx.lineTo(iconX + iconSize * 0.56, iconY - iconSize * 0.02);
    planCtx.lineTo(iconX + iconSize * 0.38, iconY - iconSize * 0.02);
    planCtx.lineTo(iconX + iconSize * 0.38, iconY + iconSize * 0.5);
    planCtx.lineTo(iconX - iconSize * 0.38, iconY + iconSize * 0.5);
    planCtx.lineTo(iconX - iconSize * 0.38, iconY - iconSize * 0.02);
    planCtx.lineTo(iconX - iconSize * 0.56, iconY - iconSize * 0.02);
    planCtx.lineTo(iconX, iconY - iconSize * 0.52);
    planCtx.closePath();
    planCtx.fill();
    planCtx.fillStyle = "#929baa";
    planCtx.textAlign = "left";
    const subtitleFontSize = cornerRadius.subtitleFontSize;
    planCtx.font = "400 " + subtitleFontSize + "px \"Arial Narrow\", Arial, sans-serif";
    drawTrackedText(planCtx, item.subtitle || "HOME PLAN", cornerRadius.subtitleStartX, cornerRadius.subtitleY, subtitleFontSize * clamp(finite(item.subtitleSpacing, 0.08), 0, 0.6), cornerRadius.subtitleMaxWidth);
    planCtx.strokeStyle = "rgba(146, 155, 170, .72)";
    planCtx.lineWidth = cornerRadius.baselineLineWidth;
    const baselineY = cornerRadius.baselineY;
    const baselineStartX = cornerRadius.baselineStartX;
    const computedValue = baselineStartX + cornerRadius.baselineLength;
    planCtx.beginPath();
    planCtx.moveTo(baselineStartX, baselineY);
    planCtx.lineTo(computedValue, baselineY);
    planCtx.moveTo(baselineStartX, baselineY - cornerRadius.baselineCapHalfHeight);
    planCtx.lineTo(baselineStartX, baselineY + cornerRadius.baselineCapHalfHeight);
    planCtx.moveTo(computedValue, baselineY - cornerRadius.baselineCapHalfHeight);
    planCtx.lineTo(computedValue, baselineY + cornerRadius.baselineCapHalfHeight);
    planCtx.stroke();
  } else if (item.type === "smallcar") {
    const curtainPosition = Math.min(planItemWidthPx * 0.22, planItemDepthPx * 0.08);
    if (item.chargingEnabled === true) {
      planCtx.save();
      planCtx.scale(planItemWidthPx * 0.76, planItemDepthPx * 0.62);
      const addColorStop = planCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
      addColorStop.addColorStop(0, "rgba(79, 239, 183, .32)");
      addColorStop.addColorStop(0.48, "rgba(79, 239, 183, .17)");
      addColorStop.addColorStop(1, "rgba(79, 239, 183, 0)");
      planCtx.fillStyle = addColorStop;
      planCtx.beginPath();
      planCtx.arc(0, 0, 1, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.restore();
      planCtx.fillStyle = "rgba(79, 239, 183, .24)";
      const dotStep = Math.max(9, Math.min(planItemWidthPx, planItemDepthPx) * 0.07);
      for (let dotX = -planItemWidthPx * 0.62; dotX <= planItemWidthPx * 0.62; dotX += dotStep) {
        for (let dotY = -planItemDepthPx * 0.54; dotY <= planItemDepthPx * 0.54; dotY += dotStep) {
          const radial = Math.hypot(dotX / (planItemWidthPx * 0.62), dotY / (planItemDepthPx * 0.54));
          if (!(radial >= 1)) {
            planCtx.globalAlpha = (1 - radial) * 0.72;
            planCtx.beginPath();
            planCtx.arc(dotX, dotY, Math.max(0.7, dotStep * 0.1), 0, Math.PI * 2);
            planCtx.fill();
          }
        }
      }
      planCtx.globalAlpha = 1;
      planCtx.fillStyle = item.color + "c7";
    }
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.48, -planItemDepthPx * 0.49, planItemWidthPx * 0.96, planItemDepthPx * 0.98, curtainPosition);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(38, 48, 57, .72)";
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.38, -planItemDepthPx * 0.2, planItemWidthPx * 0.76, planItemDepthPx * 0.42, curtainPosition * 0.7);
    planCtx.fill();
    for (const localValue of [-0.5, 0.5]) {
      for (const localValue of [-0.3, 0.3]) {
        planCtx.fillRect(localValue * planItemWidthPx - planItemWidthPx * 0.045, localValue * planItemDepthPx - planItemDepthPx * 0.085, planItemWidthPx * 0.09, planItemDepthPx * 0.17);
      }
    }
    if (item.chargingEnabled === true) {
      planCtx.fillStyle = "#7dffd0";
      planCtx.beginPath();
      planCtx.moveTo(planItemWidthPx * 0.028, -planItemDepthPx * 0.095);
      planCtx.lineTo(-planItemWidthPx * 0.058, planItemDepthPx * 0.008);
      planCtx.lineTo(planItemWidthPx * 0.006, planItemDepthPx * 0.008);
      planCtx.lineTo(-planItemWidthPx * 0.028, planItemDepthPx * 0.095);
      planCtx.lineTo(planItemWidthPx * 0.07, -planItemDepthPx * 0.02);
      planCtx.lineTo(planItemWidthPx * 0.008, -planItemDepthPx * 0.02);
      planCtx.closePath();
      planCtx.fill();
    }
  } else if (item.type === "curtain") {
    const conditionalValue = ["left", "right", "split"].includes(item.curtainPosition) ? item.curtainPosition : "split";
    const helperFn = (argPrimary, argSecondary) => {
      planCtx.beginPath();
      planCtx.roundRect(argPrimary, -planItemDepthPx * 0.46, argSecondary, planItemDepthPx * 0.92, Math.min(planItemDepthPx * 0.32, argSecondary * 0.18));
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = "rgba(25, 34, 43, .48)";
      planCtx.lineWidth = 1;
      for (let oneValue = 1; oneValue < 5; oneValue += 1) {
        const halfValue = argPrimary + argSecondary * oneValue / 5;
        planCtx.beginPath();
        planCtx.moveTo(halfValue, -planItemDepthPx * 0.34);
        planCtx.lineTo(halfValue, planItemDepthPx * 0.34);
        planCtx.stroke();
      }
    };
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
    planCtx.lineWidth = selected ? 2 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.5, 0);
    planCtx.lineTo(planItemWidthPx * 0.5, 0);
    planCtx.stroke();
    if (conditionalValue === "left") {
      helperFn(-planItemWidthPx * 0.5, planItemWidthPx * 0.24);
    } else if (conditionalValue === "right") {
      helperFn(planItemWidthPx * 0.26, planItemWidthPx * 0.24);
    } else {
      helperFn(-planItemWidthPx * 0.5, planItemWidthPx * 0.16);
      helperFn(planItemWidthPx * 0.34, planItemWidthPx * 0.16);
    }
  } else if (item.type === "pillar") {
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
    planCtx.lineWidth = 1;
    planCtx.strokeRect(-planItemWidthPx * 0.36, -planItemDepthPx * 0.36, planItemWidthPx * 0.72, planItemDepthPx * 0.72);
  } else if (item.type === "bar") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx, Math.min(5, planItemDepthPx * 0.16));
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.44, -planItemDepthPx * 0.18);
    planCtx.lineTo(planItemWidthPx * 0.44, -planItemDepthPx * 0.18);
    planCtx.stroke();
    for (const factor of [-0.28, 0, 0.28]) {
      planCtx.beginPath();
      planCtx.arc(planItemWidthPx * factor, planItemDepthPx * 0.38, Math.max(2, planItemDepthPx * 0.12), 0, Math.PI * 2);
      planCtx.stroke();
    }
  } else if (item.type === "aquarium") {
    planCtx.fillStyle = "rgba(92, 174, 202, .25)";
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(178, 225, 238, .9)";
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeRect(-planItemWidthPx * 0.43, -planItemDepthPx * 0.34, planItemWidthPx * 0.86, planItemDepthPx * 0.68);
    for (const localValue of [-0.25, 0.18]) {
      planCtx.beginPath();
      planCtx.arc(planItemWidthPx * localValue, planItemDepthPx * (localValue > 0 ? 0.08 : -0.06), Math.max(2, planItemDepthPx * 0.08), 0, Math.PI * 2);
      planCtx.stroke();
    }
  } else if (item.type === "coffeetable") {
    const computedValue = Math.min(planItemWidthPx, planItemDepthPx) * 0.32;
    const value = computedValue * 0.7;
    planCtx.beginPath();
    planCtx.arc(-planItemWidthPx * 0.16, planItemDepthPx * 0.08, computedValue, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(planItemWidthPx * 0.24, -planItemDepthPx * 0.2, value, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (roundTableTypes.has(item.type)) {
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.32, planItemDepthPx * 0.32, 0, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    for (const [localValue, localValueCurrent] of [[-0.38, 0], [0.38, 0], [0, -0.38], [0, 0.38]]) {
      planCtx.beginPath();
      planCtx.roundRect(planItemWidthPx * localValue - planItemWidthPx * 0.085, planItemDepthPx * localValueCurrent - planItemDepthPx * 0.095, planItemWidthPx * 0.17, planItemDepthPx * 0.19, Math.min(planItemWidthPx, planItemDepthPx) * 0.035);
      planCtx.fill();
      planCtx.stroke();
    }
    if (hasRoundTableTurntable(item)) {
      planCtx.beginPath();
      planCtx.ellipse(0, 0, planItemWidthPx * 0.27, planItemDepthPx * 0.27, 0, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.stroke();
    }
  } else if (item.type === "squarecoffeetable") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.47, -planItemDepthPx * 0.47, planItemWidthPx * 0.94, planItemDepthPx * 0.94, Math.min(planItemWidthPx, planItemDepthPx) * 0.08);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeRect(-planItemWidthPx * 0.33, -planItemDepthPx * 0.38, planItemWidthPx * 0.66, planItemDepthPx * 0.76);
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.08, -planItemDepthPx * 0.38);
    planCtx.lineTo(-planItemWidthPx * 0.08, planItemDepthPx * 0.38);
    planCtx.moveTo(planItemWidthPx * 0.08, -planItemDepthPx * 0.38);
    planCtx.lineTo(planItemWidthPx * 0.08, planItemDepthPx * 0.38);
    planCtx.stroke();
    planCtx.fillStyle = "rgba(25, 34, 43, .58)";
    for (const localValue of [-0.39, 0.39]) {
      for (const localValue of [-0.34, 0.34]) {
        planCtx.beginPath();
        planCtx.arc(planItemWidthPx * localValue, planItemDepthPx * localValue, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.045), 0, Math.PI * 2);
        planCtx.fill();
      }
    }
  } else if (item.type === "floorlamp") {
    const computedValue = -planItemWidthPx * 0.34;
    const value = planItemWidthPx * 0.31;
    const localValue = Math.min(planItemDepthPx * 0.34, planItemWidthPx * 0.13);
    const min = Math.min(planItemDepthPx * 0.46, planItemWidthPx * 0.14);
    planCtx.lineCap = "round";
    planCtx.lineWidth = selected ? 2.4 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(computedValue, 0);
    planCtx.lineTo(value, 0);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(computedValue, 0, localValue, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(value, 0, min, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "toilet") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.42, -planItemDepthPx * 0.42);
    planCtx.lineTo(planItemWidthPx * 0.42, -planItemDepthPx * 0.42);
    planCtx.bezierCurveTo(planItemWidthPx * 0.48, -planItemDepthPx * 0.08, planItemWidthPx * 0.48, planItemDepthPx * 0.28, 0, planItemDepthPx * 0.48);
    planCtx.bezierCurveTo(-planItemWidthPx * 0.48, planItemDepthPx * 0.28, -planItemWidthPx * 0.48, -planItemDepthPx * 0.08, -planItemWidthPx * 0.42, -planItemDepthPx * 0.42);
    planCtx.closePath();
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "squattoilet") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx, Math.min(planItemWidthPx, planItemDepthPx) * 0.12);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(0, planItemDepthPx * 0.04, planItemWidthPx * 0.18, planItemDepthPx * 0.31, 0, 0, Math.PI * 2);
    planCtx.stroke();
    for (const localValue of [-1, 1]) {
      planCtx.strokeRect(localValue * planItemWidthPx * 0.38 - planItemWidthPx * 0.07, -planItemDepthPx * 0.25, planItemWidthPx * 0.14, planItemDepthPx * 0.5);
    }
  } else if (item.type === "urinal") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.38, -planItemDepthPx * 0.42, planItemWidthPx * 0.76, planItemDepthPx * 0.84, Math.min(planItemWidthPx, planItemDepthPx) * 0.28);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(0, planItemDepthPx * 0.04, planItemWidthPx * 0.2, planItemDepthPx * 0.28, 0, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "bathtub") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.48, -planItemDepthPx * 0.45, planItemWidthPx * 0.96, planItemDepthPx * 0.9, Math.min(planItemWidthPx, planItemDepthPx) * 0.36);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.34, planItemDepthPx * 0.29, 0, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "walllamp") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(planItemWidthPx, planItemDepthPx) * 0.36, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.42, planItemDepthPx * 0.38);
    planCtx.lineTo(planItemWidthPx * 0.42, planItemDepthPx * 0.38);
    planCtx.stroke();
  } else if (item.type === "glasspartition") {
    planCtx.fillStyle = "rgba(169, 197, 211, .2)";
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(183, 218, 231, .82)";
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "storagewaterheater") {
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.46, planItemDepthPx * 0.44, 0, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .82)";
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.2, -planItemDepthPx * 0.28, planItemWidthPx * 0.4, planItemDepthPx * 0.22, Math.min(planItemWidthPx, planItemDepthPx) * 0.08);
    planCtx.fill();
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.3, planItemDepthPx * 0.36);
    planCtx.lineTo(-planItemWidthPx * 0.3, planItemDepthPx * 0.52);
    planCtx.moveTo(planItemWidthPx * 0.3, planItemDepthPx * 0.36);
    planCtx.lineTo(planItemWidthPx * 0.3, planItemDepthPx * 0.52);
    planCtx.stroke();
  } else if (item.type === "gaswaterheater") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.46, -planItemDepthPx * 0.46, planItemWidthPx * 0.92, planItemDepthPx * 0.92, Math.min(planItemWidthPx, planItemDepthPx) * 0.1);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .82)";
    planCtx.fillRect(-planItemWidthPx * 0.22, -planItemDepthPx * 0.26, planItemWidthPx * 0.44, planItemDepthPx * 0.17);
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.24, planItemDepthPx * 0.44);
    planCtx.lineTo(-planItemWidthPx * 0.24, planItemDepthPx * 0.58);
    planCtx.moveTo(0, planItemDepthPx * 0.44);
    planCtx.lineTo(0, planItemDepthPx * 0.58);
    planCtx.moveTo(planItemWidthPx * 0.24, planItemDepthPx * 0.44);
    planCtx.lineTo(planItemWidthPx * 0.24, planItemDepthPx * 0.58);
    planCtx.stroke();
  } else if (item.type === "pipelinewaterpurifier") {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.46, -planItemDepthPx * 0.46, planItemWidthPx * 0.92, planItemDepthPx * 0.92, Math.min(planItemWidthPx, planItemDepthPx) * 0.08);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(31, 39, 45, .9)";
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.4, -planItemDepthPx * 0.35, planItemWidthPx * 0.8, planItemDepthPx * 0.28, Math.min(planItemWidthPx, planItemDepthPx) * 0.05);
    planCtx.fill();
    planCtx.strokeStyle = "rgba(231, 235, 236, .74)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.12, -planItemDepthPx * 0.18);
    planCtx.lineTo(planItemWidthPx * 0.12, -planItemDepthPx * 0.18);
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .7)";
    for (const localValue of [-0.2, 0.2]) {
      planCtx.beginPath();
      planCtx.arc(planItemWidthPx * localValue, planItemDepthPx * 0.18, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.055), 0, Math.PI * 2);
      planCtx.fill();
    }
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.26, planItemDepthPx * 0.36);
    planCtx.lineTo(-planItemWidthPx * 0.26, planItemDepthPx * 0.5);
    planCtx.moveTo(planItemWidthPx * 0.26, planItemDepthPx * 0.36);
    planCtx.lineTo(planItemWidthPx * 0.26, planItemDepthPx * 0.5);
    planCtx.stroke();
  } else if (item.type === "tea_bar_machine") {
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx * 0.46, -planItemDepthPx * 0.46, planItemWidthPx * 0.92, planItemDepthPx * 0.92);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(38, 44, 47, .86)";
    planCtx.fillRect(-planItemWidthPx * 0.38, -planItemDepthPx * 0.36, planItemWidthPx * 0.76, planItemDepthPx * 0.2);
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.46, planItemDepthPx * 0.08);
    planCtx.lineTo(planItemWidthPx * 0.46, planItemDepthPx * 0.08);
    planCtx.moveTo(-planItemWidthPx * 0.46, planItemDepthPx * 0.3);
    planCtx.lineTo(planItemWidthPx * 0.46, planItemDepthPx * 0.3);
    planCtx.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(item.type)) {
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "ricecooker") {
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.46, planItemDepthPx * 0.46, 0, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else {
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx, Math.min(6, planItemWidthPx / 5, planItemDepthPx / 5));
    planCtx.fill();
    planCtx.stroke();
  }
  planCtx.strokeStyle = "rgba(17, 24, 31, .5)";
  planCtx.lineWidth = 1;
  if (item.type === "coffeetable") {
    const radius = Math.min(planItemWidthPx, planItemDepthPx) * 0.32;
    planCtx.beginPath();
    planCtx.arc(-planItemWidthPx * 0.16, planItemDepthPx * 0.08, radius * 0.32, 0, Math.PI * 2);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(planItemWidthPx * 0.24, -planItemDepthPx * 0.2, radius * 0.23, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "squarecoffeetable") {
    planCtx.strokeRect(-planItemWidthPx * 0.35, -planItemDepthPx * 0.35, planItemWidthPx * 0.7, planItemDepthPx * 0.7);
  } else if (item.type === "bed") {
    planCtx.strokeRect(-planItemWidthPx * 0.4, -planItemDepthPx * 0.4, planItemWidthPx * 0.8, planItemDepthPx * 0.23);
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx / 2, -planItemDepthPx * 0.12);
    planCtx.lineTo(planItemWidthPx / 2, -planItemDepthPx * 0.12);
    planCtx.stroke();
  } else if (item.type === "sofa") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx / 2, -planItemDepthPx * 0.27);
    planCtx.lineTo(planItemWidthPx / 2, -planItemDepthPx * 0.27);
    planCtx.stroke();
    planCtx.strokeRect(-planItemWidthPx * 0.42, -planItemDepthPx * 0.12, planItemWidthPx * 0.84, planItemDepthPx * 0.43);
  } else if (item.type === "table") {
    for (const factor of [-0.38, 0.38]) {
      for (const factorCurrent of [-0.32, 0.32]) {
        planCtx.beginPath();
        planCtx.arc(planItemWidthPx * factor, planItemDepthPx * factorCurrent, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.045), 0, Math.PI * 2);
        planCtx.stroke();
      }
    }
  } else if (roundTableTypes.has(item.type) && hasRoundTableTurntable(item)) {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(planItemWidthPx, planItemDepthPx) * 0.17, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "fridge") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx / 2, -planItemDepthPx * 0.12);
    planCtx.lineTo(planItemWidthPx / 2, -planItemDepthPx * 0.12);
    planCtx.stroke();
  } else if (item.type === "storagewaterheater") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(planItemWidthPx, planItemDepthPx) * 0.26, 0, Math.PI * 2);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.29, planItemDepthPx * 0.36);
    planCtx.lineTo(planItemWidthPx * 0.29, planItemDepthPx * 0.36);
    planCtx.stroke();
  } else if (item.type === "gaswaterheater") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.36, -planItemDepthPx * 0.08);
    planCtx.lineTo(planItemWidthPx * 0.36, -planItemDepthPx * 0.08);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.3, planItemDepthPx * 0.36);
    planCtx.lineTo(planItemWidthPx * 0.3, planItemDepthPx * 0.36);
    planCtx.stroke();
  } else if (item.type === "pipelinewaterpurifier") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.3, planItemDepthPx * 0.34);
    planCtx.lineTo(planItemWidthPx * 0.3, planItemDepthPx * 0.34);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(planItemWidthPx * 0.02, planItemDepthPx * 0.16, Math.min(planItemWidthPx, planItemDepthPx) * 0.08, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "tea_bar_machine") {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.38, -planItemDepthPx * 0.02);
    planCtx.lineTo(planItemWidthPx * 0.38, -planItemDepthPx * 0.02);
    planCtx.moveTo(-planItemWidthPx * 0.42, planItemDepthPx * 0.2);
    planCtx.lineTo(planItemWidthPx * 0.42, planItemDepthPx * 0.2);
    planCtx.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(item.type)) {
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.42, planItemDepthPx * 0.3);
    planCtx.lineTo(planItemWidthPx * 0.42, planItemDepthPx * 0.3);
    planCtx.stroke();
  } else if (item.type === "glasspartition") {
    planCtx.strokeStyle = "rgba(183, 218, 231, .72)";
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.46, 0);
    planCtx.lineTo(planItemWidthPx * 0.46, 0);
    planCtx.stroke();
  } else if (item.type === "ricecooker") {
    planCtx.beginPath();
    planCtx.arc(0, -planItemDepthPx * 0.04, Math.min(planItemWidthPx, planItemDepthPx) * 0.28, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "tv") {
    if (item.tvMountStyle === "mobile") {
      planCtx.fillStyle = "rgba(46, 53, 61, .88)";
      planCtx.fillRect(-planItemWidthPx * 0.36, -planItemDepthPx * 0.4, planItemWidthPx * 0.72, planItemDepthPx * 0.8);
      planCtx.strokeRect(-planItemWidthPx * 0.08, -planItemDepthPx * 0.42, planItemWidthPx * 0.16, planItemDepthPx * 0.84);
    } else if (item.tvMountStyle === "tabletop") {
      planCtx.strokeRect(-planItemWidthPx * 0.3, -planItemDepthPx * 0.34, planItemWidthPx * 0.6, planItemDepthPx * 0.68);
    }
    planCtx.fillStyle = item.screenEnabled === false ? "rgba(8, 12, 15, .8)" : "rgba(48, 113, 153, .86)";
    planCtx.fillRect(-planItemWidthPx * 0.44, -planItemDepthPx * 0.28, planItemWidthPx * 0.88, planItemDepthPx * 0.56);
    if (item.screenEnabled !== false) {
      planCtx.fillStyle = "rgba(255, 159, 54, .92)";
      planCtx.fillRect(-planItemWidthPx * 0.37, -planItemDepthPx * 0.18, planItemWidthPx * 0.05, planItemDepthPx * 0.36);
    }
  } else if (item.type === "plant") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(planItemWidthPx, planItemDepthPx) * 0.31, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (Vl.has(item.type)) {
    for (let oneValue = 1; oneValue < 10; oneValue += 1) {
      const halfValue = -planItemDepthPx / 2 + planItemDepthPx * oneValue / 10;
      planCtx.beginPath();
      planCtx.moveTo(-planItemWidthPx / 2, halfValue);
      planCtx.lineTo(planItemWidthPx / 2, halfValue);
      planCtx.stroke();
    }
    planCtx.beginPath();
    planCtx.moveTo(0, planItemDepthPx * 0.34);
    planCtx.lineTo(0, -planItemDepthPx * 0.3);
    planCtx.lineTo(-Math.min(planItemWidthPx, planItemDepthPx) * 0.08, -planItemDepthPx * 0.2);
    planCtx.moveTo(0, -planItemDepthPx * 0.3);
    planCtx.lineTo(Math.min(planItemWidthPx, planItemDepthPx) * 0.08, -planItemDepthPx * 0.2);
    planCtx.stroke();
  }
  if (selected) {
    planCtx.strokeStyle = "rgba(255, 157, 46, .9)";
    planCtx.lineWidth = 1;
    planCtx.setLineDash([5, 3]);
    planCtx.strokeRect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
    planCtx.setLineDash([]);
    const numericValue = 7;
    planCtx.fillStyle = "#111820";
    for (const [fx, fy] of [[-planItemWidthPx / 2, -planItemDepthPx / 2], [planItemWidthPx / 2, -planItemDepthPx / 2], [planItemWidthPx / 2, planItemDepthPx / 2], [-planItemWidthPx / 2, planItemDepthPx / 2]]) {
      planCtx.fillRect(fx - numericValue / 2, fy - numericValue / 2, numericValue, numericValue);
      planCtx.strokeRect(fx - numericValue / 2, fy - numericValue / 2, numericValue, numericValue);
    }
    const halfValue = -planItemDepthPx / 2 - 17;
    planCtx.strokeStyle = "#ff9d2e";
    planCtx.beginPath();
    planCtx.moveTo(0, -planItemDepthPx / 2);
    planCtx.lineTo(0, halfValue + 4);
    planCtx.stroke();
    planCtx.fillStyle = "#111820";
    planCtx.beginPath();
    planCtx.arc(0, halfValue, 4, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  }
  planCtx.restore();
}
function rotatedItemCorner(planPoint, argSecondary, argTertiary) {
  const value = (Number(planPoint.rotation) || 0) * Math.PI / 180;
  return {
    x: planPoint.x + argSecondary * Math.cos(value) - argTertiary * Math.sin(value),
    y: planPoint.y + argSecondary * Math.sin(value) + argTertiary * Math.cos(value)
  };
}
function itemPlanBounds(size) {
  const value = pixelsPerMeter() || 100;
  const halfItemWidth = size.width * value / 2;
  const halfItemDepth = size.depth * value / 2;
  return {
    corners: [{
      x: -1,
      y: -1
    }, {
      x: 1,
      y: -1
    }, {
      x: 1,
      y: 1
    }, {
      x: -1,
      y: 1
    }].map(planPoint => ({
      ...planPoint,
      point: rotatedItemCorner(size, planPoint.x * halfItemWidth, planPoint.y * halfItemDepth),
      opposite: rotatedItemCorner(size, -planPoint.x * halfItemWidth, -planPoint.y * halfItemDepth)
    })),
    rotationStem: rotatedItemCorner(size, 0, -halfItemDepth),
    rotationHandle: rotatedItemCorner(size, 0, -halfItemDepth - 17 / Math.max(planView.zoom, 0.01))
  };
}
function beginItemDrag(argPrimary) {
  if (activeTool !== "select" || selection?.kind !== "item" || multiSelection.length) {
    return null;
  }
  const item = selectedEntity();
  if (!item) {
    return null;
  }
  const controls = itemPlanBounds(item);
  const value = 9 / Math.max(planView.zoom, 0.01);
  if (distance(argPrimary, controls.rotationHandle) <= value) {
    return {
      type: "rotate-item",
      item,
      controls
    };
  }
  const corner = controls.corners.find(point => distance(argPrimary, point.point) <= value);
  if (corner) {
    return {
      type: "resize-item",
      item,
      controls,
      corner
    };
  } else {
    return null;
  }
}
function axisAlignedBounds(planPoint, point) {
  return {
    minX: Math.min(planPoint.x, point.x),
    minY: Math.min(planPoint.y, point.y),
    maxX: Math.max(planPoint.x, point.x),
    maxY: Math.max(planPoint.y, point.y)
  };
}
function pointInBounds(planPoint, minX) {
  return planPoint.x >= minX.minX && planPoint.x <= minX.maxX && planPoint.y >= minX.minY && planPoint.y <= minX.maxY;
}
function segmentHitsBounds(planPoint, point, minX) {
  if (pointInBounds(planPoint, minX) || pointInBounds(point, minX)) {
    return true;
  }
  const list = [{
    x: minX.minX,
    y: minX.minY
  }, {
    x: minX.maxX,
    y: minX.minY
  }, {
    x: minX.maxX,
    y: minX.maxY
  }, {
    x: minX.minX,
    y: minX.maxY
  }];
  for (let value = 0; value < list.length; value += 1) {
    if (segmentIntersection(planPoint, point, list[value], list[(value + 1) % list.length])) {
      return true;
    }
  }
  return false;
}
function marqueeSelectHits(planPoint, point) {
  const minX = axisAlignedBounds(planPoint, point);
  const value = pixelsPerMeter() || 100;
  const list = [];
  const flag = assetCategory === "light";
  if (!flag) {
    for (const wall of floorSceneCurrent.walls) {
      if (segmentHitsBounds(wall.start, wall.end, minX)) {
        list.push({
          kind: "wall",
          id: wall.id
        });
      }
    }
    for (const size of floorSceneCurrent.windows) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "window",
          id: size.id
        });
      }
    }
    for (const size of floorSceneCurrent.doors) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "door",
          id: size.id
        });
      }
    }
    for (const size of floorSceneCurrent.railings) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "railing",
          id: size.id
        });
      }
    }
  }
  const someFlag = [{
    x: minX.minX,
    y: minX.minY
  }, {
    x: minX.maxX,
    y: minX.minY
  }, {
    x: minX.maxX,
    y: minX.maxY
  }, {
    x: minX.minX,
    y: minX.maxY
  }];
  for (const item of floorSceneCurrent.items) {
    if (set.has(item.type) !== flag) {
      continue;
    }
    const rotationRad = item.rotation * Math.PI / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);
    const halfMeshWidth = item.width * value / 2;
    const halfMeshDepth = item.depth * value / 2;
    const some = [[-halfMeshWidth, -halfMeshDepth], [halfMeshWidth, -halfMeshDepth], [halfMeshWidth, halfMeshDepth], [-halfMeshWidth, halfMeshDepth]].map(([argPrimary, argPrimaryCurrent]) => ({
      x: item.x + argPrimary * cos - argPrimaryCurrent * sin,
      y: item.y + argPrimary * sin + argPrimaryCurrent * cos
    }));
    if (pointInBounds(item, minX) || some.some(point => pointInBounds(point, minX)) || someFlag.some(argPrimary => pointInRotatedRectangle(argPrimary, item, value))) {
      list.push({
        kind: "item",
        id: item.id
      });
    }
  }
  return list;
}
function ensureMeasureCanvas() {
  if (!element.width || !element.height || !measureCtx) {
    return false;
  } else {
    if (measureCanvas.width !== element.width) {
      measureCanvas.width = element.width;
    }
    if (measureCanvas.height !== element.height) {
      measureCanvas.height = element.height;
    }
    measureCtx.setTransform(1, 0, 0, 1, 0, 0);
    measureCtx.clearRect(0, 0, measureCanvas.width, measureCanvas.height);
    measureCtx.drawImage(element, 0, 0);
    return true;
  }
}
function blitMeasureOverlay({
  offsetX: options = 0,
  offsetY: optionsCurrent = 0
} = {}) {
  if (!measureCanvas.width || !measureCanvas.height || measureCanvas.width !== element.width || measureCanvas.height !== element.height) {
    return false;
  }
  const value = element.width / Math.max(planWidth, 1);
  const fitHeight = element.height / Math.max(planHeight, 1);
  planCtx.save();
  planCtx.setTransform(1, 0, 0, 1, 0, 0);
  planCtx.fillStyle = "#0d1319";
  planCtx.fillRect(0, 0, element.width, element.height);
  planCtx.drawImage(measureCanvas, Math.round(options * value), Math.round(optionsCurrent * fitHeight));
  planCtx.restore();
  return true;
}
function drawMarqueeSelection() {
  if (dragState?.type !== "marquee") {
    return;
  }
  const planPoint = planToScreen(dragState.start);
  const point = planToScreen(dragState.current);
  const value = Math.min(planPoint.x, point.x);
  const minValue = Math.min(planPoint.y, point.y);
  const absResult = Math.abs(point.x - planPoint.x);
  const abs = Math.abs(point.y - planPoint.y);
  planCtx.save();
  planCtx.translate(planWidth / 2, planHeight / 2);
  planCtx.rotate(planView.rotation * Math.PI / 180);
  planCtx.translate(-planWidth / 2, -planHeight / 2);
  planCtx.fillStyle = "rgba(255, 157, 46, .10)";
  planCtx.strokeStyle = "rgba(255, 176, 74, .92)";
  planCtx.lineWidth = 1;
  planCtx.setLineDash([6, 4]);
  planCtx.fillRect(value, minValue, absResult, abs);
  planCtx.strokeRect(value + 0.5, minValue + 0.5, Math.max(absResult - 1, 0), Math.max(abs - 1, 0));
  planCtx.restore();
}
function drawPlan() {
  const flag = assetCategory === "light";
  planCtx.clearRect(0, 0, planWidth, planHeight);
  planCtx.fillStyle = "#0d1319";
  planCtx.fillRect(0, 0, planWidth, planHeight);
  planCtx.save();
  planCtx.translate(planWidth / 2, planHeight / 2);
  planCtx.rotate(planView.rotation * Math.PI / 180);
  planCtx.translate(-planWidth / 2, -planHeight / 2);
  if (planBackgroundImageCurrent && floorSceneCurrent.background && floorSceneCurrent.settings.backgroundVisible) {
    const planPoint = planToScreen({
      x: 0,
      y: 0
    });
    planCtx.save();
    planCtx.globalAlpha = flag ? 0.3 : 0.54;
    planCtx.drawImage(planBackgroundImageCurrent, planPoint.x, planPoint.y, floorSceneCurrent.background.width * planView.zoom, floorSceneCurrent.background.height * planView.zoom);
    planCtx.restore();
  }
  drawMetricGrid();
  const value = pixelsPerMeter() || 100;
  if (alignSession) {
    planCtx.save();
    planCtx.globalAlpha = 0.58;
    for (const wall of alignReferenceWalls()) {
      drawPlanLine(wall.start, wall.end, {
        color: "#52cfe0",
        width: Math.max(2, wall.thickness * value * planView.zoom),
        dash: [7, 5],
        cap: "square"
      });
    }
    planCtx.restore();
    if (alignSession.referencePoint) {
      const worldPoint = floorLocalToWorldPoint(alignSession.referencePoint, alignSession.referenceFloor, activeFloor());
      drawPlanPoint(worldPoint, "#ffb14f", 4.5);
      drawFloatingLabel(worldPoint, "参照点", "#ffb14f");
    }
  }
  planCtx.save();
  if (flag) {
    planCtx.globalAlpha = 0.48;
  }
  for (const wall of floorSceneCurrent.walls) {
    const flag = isSelected("wall", wall.id);
    const width = Math.max(wall.thickness * value * planView.zoom, 4);
    if (flag) {
      drawPlanLine(wall.start, wall.end, {
        color: "rgba(255, 157, 46, .38)",
        width: width + 7,
        cap: "square"
      });
    }
    drawPlanLine(wall.start, wall.end, {
      color: flag ? "#f1d7b9" : "#c7d0d7",
      width,
      cap: "square"
    });
    drawPlanLine(wall.start, wall.end, {
      color: "rgba(39, 51, 61, .82)",
      width: 1
    });
    if (activeTool === "wall" || flag) {
      drawPlanPoint(wall.start, flag ? "#ff9d2e" : "#6c7c88", 3.5);
      drawPlanPoint(wall.end, flag ? "#ff9d2e" : "#6c7c88", 3.5);
    }
    if (flag && multiSelection.length <= 1) {
      drawFloatingLabel({
        x: (wall.start.x + wall.end.x) / 2,
        y: (wall.start.y + wall.end.y) / 2
      }, wallLengthMeters(wall, value).toFixed(2) + " m", "#ffb14f");
    }
  }
  for (const size of floorSceneCurrent.windows) {
    const isStart = wallAttachmentWorldPoint(size);
    if (!isStart) {
      continue;
    }
    const flag = isSelected("window", size.id);
    drawPlanLine(isStart.start, isStart.end, {
      color: "rgba(7, 16, 21, .9)",
      width: Math.max(10, isStart.wall.thickness * value * planView.zoom + 5),
      cap: "butt"
    });
    drawPlanLine(isStart.start, isStart.end, {
      color: flag ? "#ffaf46" : "#43d2e6",
      width: flag ? 5 : 3,
      cap: "butt"
    });
    drawPlanLine(isStart.start, isStart.end, {
      color: "rgba(224, 250, 255, .9)",
      width: 1,
      cap: "butt"
    });
    if (size.hasDivider !== false && size.width > 1.2) {
      const planPoint = {
        x: -isStart.unit.y,
        y: isStart.unit.x
      };
      const maxValue = Math.max(isStart.wall.thickness * value * planView.zoom * 0.72, 5 / planView.zoom);
      drawPlanLine({
        x: isStart.center.x - planPoint.x * maxValue,
        y: isStart.center.y - planPoint.y * maxValue
      }, {
        x: isStart.center.x + planPoint.x * maxValue,
        y: isStart.center.y + planPoint.y * maxValue
      }, {
        color: flag ? "#ffaf46" : "rgba(224, 250, 255, .9)",
        width: 1.5,
        cap: "butt"
      });
    }
    if (flag && multiSelection.length <= 1) {
      drawFloatingLabel(isStart.center, size.width.toFixed(2) + " m", "#43d2e6");
    }
  }
  for (const size of floorSceneCurrent.doors) {
    drawDoorPreview(size);
  }
  for (const size of floorSceneCurrent.railings) {
    drawWindowPreview(size);
  }
  if (dragState?.type === "draw-flooropening") {
    const {
      start: x33,
      current: x34
    } = dragState;
    drawItemOnPlan({
      ...furnitureCatalog.flooropening,
      type: "flooropening",
      id: "opening-preview",
      rotation: 0,
      x: (x33.x + x34.x) / 2,
      y: (x33.y + x34.y) / 2,
      width: Math.abs(x34.x - x33.x) / value,
      depth: Math.abs(x34.y - x33.y) / value
    });
  }
  for (const size of floorSceneCurrent.items) {
    if (!set.has(size.type)) {
      drawItemOnPlan(size);
    }
  }
  if (!alignSession) {
    const length = getUnclosedWallEndpoints(value);
    for (const size of length) {
      Xg(size);
      if (length.length <= 3) {
        drawFloatingLabel(size, "未闭合", "#ff766e");
      }
    }
  }
  planCtx.restore();
  if (flag) {
    for (const type of floorSceneCurrent.items) {
      if (set.has(type.type)) {
        drawItemOnPlan(type);
      }
    }
  }
  const start = floorSceneCurrent.calibration?.reference;
  if (start && activeTool === "scale") {
    drawPlanLine(start.start, start.end, {
      color: "rgba(255, 157, 46, .72)",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(start.start, "#ff9d2e", 3.5);
    drawPlanPoint(start.end, "#ff9d2e", 3.5);
    drawFloatingLabel({
      x: (start.start.x + start.end.x) / 2,
      y: (start.start.y + start.end.y) / 2
    }, start.meters.toFixed(2) + " m 参考", "#ffad45");
  }
  if (wallDrawAnchorCurrent && no) {
    drawPlanLine(wallDrawAnchorCurrent, no, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(wallDrawAnchorCurrent, "#ff9d2e");
    drawPlanPoint(no, "#ff9d2e");
  }
  if (Tt && at) {
    const localValue = onPlanPointerDown(at);
    drawPlanLine(Tt, at.point, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(Tt, "#ff9d2e");
    drawPlanPoint(at.point, localValue ? "#76cfa1" : at.kind ? "#43d2e6" : "#ff9d2e", localValue ? 5 : 3.5);
    const isStart = distance(Tt, at.point) / value;
    drawFloatingLabel({
      x: (Tt.x + at.point.x) / 2,
      y: (Tt.y + at.point.y) / 2
    }, isStart.toFixed(2) + " m", "#ffb04a");
    if (localValue) {
      drawFloatingLabel(at.point, "点击闭合空间", "#76cfa1");
    }
  } else if (at?.kind && ["wall", "scale"].includes(activeTool)) {
    drawPlanPoint(at.point, "#43d2e6");
    drawFloatingLabel(at.point, at.label, "#43d2e6");
  }
  if (activeTool === "window" && Uo) {
    const size = {
      wallId: Uo.wall.id,
      t: Uo.t,
      width: 1.4
    };
    const start = wallAttachmentWorldPoint(size);
    if (start) {
      drawPlanLine(start.start, start.end, {
        color: "rgba(67, 210, 230, .75)",
        width: 5,
        dash: [5, 4],
        cap: "butt"
      });
    }
  }
  if (activeTool === "door" && railingPlacementPreviewCurrent) {
    const width = yo[wallDrawAnchor] || yo.solid;
    drawDoorPreview({
      wallId: railingPlacementPreviewCurrent.wall.id,
      t: railingPlacementPreviewCurrent.t,
      width: width.width,
      height: width.height,
      doorType: wallDrawAnchor,
      hinge: "left",
      swing: 1
    }, {
      preview: true
    });
  }
  if (activeTool === "railing" && Ko) {
    drawWindowPreview({
      wallId: Ko.wall.id,
      t: Ko.t,
      width: 2,
      height: 1.1
    }, {
      preview: true
    });
  }
  planCtx.restore();
  drawMarqueeSelection();
  Lf.textContent = Math.round(planView.zoom * 100) + "%";
}
function selectedEntity() {
  if (!selection) {
    return null;
  }
  const flag = ({
    wall: floorSceneCurrent.walls,
    window: floorSceneCurrent.windows,
    door: floorSceneCurrent.doors,
    railing: floorSceneCurrent.railings,
    item: floorSceneCurrent.items
  }[selection.kind] || []).find(item => item.id === selection.id);
  if (!flag) {
    selection = null;
  }
  return flag || null;
}
function placeCatalogItemAt(argPrimary) {
  const value = pixelsPerMeter() || 100;
  const flag = assetCategory === "light";
  for (const item of [...floorSceneCurrent.items].reverse()) {
    if (set.has(item.type) === flag && pointInRotatedRectangle(argPrimary, item, value)) {
      return {
        kind: "item",
        id: item.id
      };
    }
  }
  if (flag) {
    return null;
  }
  for (const size of [...floorSceneCurrent.windows].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 10 / planView.zoom) {
      return {
        kind: "window",
        id: size.id
      };
    }
  }
  for (const size of [...floorSceneCurrent.doors].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 12 / planView.zoom) {
      return {
        kind: "door",
        id: size.id
      };
    }
  }
  for (const size of [...floorSceneCurrent.railings].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 12 / planView.zoom) {
      return {
        kind: "railing",
        id: size.id
      };
    }
  }
  for (const wall of [...floorSceneCurrent.walls].reverse()) {
    const maxValue = Math.max(wall.thickness * value / 2, 8 / planView.zoom);
    if (projectPointToSegment(argPrimary, wall.start, wall.end).distance <= maxValue) {
      return {
        kind: "wall",
        id: wall.id
      };
    }
  }
  return null;
}
function updateProgressChecklist() {
  const value = {
    background: !!floorSceneCurrent.background,
    scale: !!floorSceneCurrent.calibration,
    walls: floorSceneCurrent.walls.length > 0,
    items: floorSceneCurrent.items.some(item => !set.has(item.type)),
    lights: floorSceneCurrent.items.some(item => set.has(item.type)),
    export: isExporting
  };
  const layerKeys = ["background", "scale", "walls", "items", "lights", "export"].find(argPrimary => !value[argPrimary]) || "export";
  for (const element of document.querySelectorAll("[data-step]")) {
    element.classList.toggle("complete", value[element.dataset.step]);
    element.classList.toggle("active", element.dataset.step === layerKeys);
  }
}
function studioLayoutMetrics() {
  const size = detailsPanelElCurrent.getBoundingClientRect();
  const rect = studioShellEl.getBoundingClientRect();
  const value = size.height || Math.max(window.innerHeight - 90, 340);
  const maxValue = rect.width || Math.max(window.innerWidth - 20, 860);
  const detailsResizerHeight = detailsResizer.parentElement?.getBoundingClientRect().height || 14;
  const querySelectorResult = studioShellEl.querySelector(".library-panel")?.getBoundingClientRect().width || 168;
  return {
    minimumHeightRatio: clamp(320 / value, 0.08, 0.5),
    maximumHeightRatio: clamp((value - detailsResizerHeight - 170) / value, 0.5, 0.94),
    minimumWidthRatio: clamp(360 / maxValue, 0.08, 0.45),
    maximumWidthRatio: clamp((maxValue - querySelectorResult - 20 - 320) / maxValue, 0.45, 0.86)
  };
}
function applyPreviewPaneWidth() {
  const value = studioLayoutMetrics();
  const clampCurrent = clamp(finite(floorSceneCurrent.settings?.previewPanelRatio, 0.52), value.minimumHeightRatio, value.maximumHeightRatio);
  floorSceneCurrent.settings.previewPanelRatio = clampCurrent;
  detailsPanelElCurrent.style.setProperty("--preview-panel-height", (clampCurrent * 100).toFixed(2) + "%");
  detailsResizer.setAttribute("aria-valuemin", String(Math.round(value.minimumHeightRatio * 100)));
  detailsResizer.setAttribute("aria-valuemax", String(Math.round(value.maximumHeightRatio * 100)));
  detailsResizer.setAttribute("aria-valuenow", String(Math.round(clampCurrent * 100)));
}
function applyDetailsPaneWidth() {
  const value = studioLayoutMetrics();
  const clampCurrent = clamp(finite(floorSceneCurrent.settings?.detailsPanelWidthRatio, 0.29), value.minimumWidthRatio, value.maximumWidthRatio);
  floorSceneCurrent.settings.detailsPanelWidthRatio = clampCurrent;
  studioShellEl.style.setProperty("--details-panel-width", (clampCurrent * 100).toFixed(2) + "%");
}
function isSnapActive() {
  return floorSceneCurrent.settings.snapEnabled !== false && !Or;
}
function setSnapSettingsOpen(flag) {
  xr.hidden = !flag;
  Qd.setAttribute("aria-expanded", String(flag));
}
function syncSnapUi() {
  const flag = floorSceneCurrent.settings.snapEnabled !== false;
  snapToggle.classList.toggle("active", flag);
  snapToggle.setAttribute("aria-pressed", String(flag));
  Ef.textContent = flag ? "开" : "关";
  for (const el of snapSettingEls) {
    el.checked = floorSceneCurrent.settings[el.dataset.snapSetting] !== false;
  }
  syncControlValue(snapTolerance, clamp(Math.round(finite(floorSceneCurrent.settings.snapTolerance, 13)), 6, 24));
  jd.textContent = snapTolerance.value + " px";
  if (!Fi) {
    No.textContent = flag ? "吸附：开启" : "吸附：关闭";
  }
}
function onDetailsResizePointerMove(event) {
  if (!detailsResizeDrag) {
    return;
  }
  const size = detailsPanelElCurrent.getBoundingClientRect();
  const rect = studioShellEl.getBoundingClientRect();
  if (size.height <= 0 || rect.width <= 0) {
    return;
  }
  const value = studioLayoutMetrics();
  const detailsResizeDeltaX = event.clientX - detailsResizeDrag.startX;
  const detailsResizeDeltaY = event.clientY - detailsResizeDrag.startY;
  if (Math.hypot(detailsResizeDeltaX, detailsResizeDeltaY) < 2) {
    return;
  }
  detailsResizer.dataset.resizeAxis = "both";
  const detailsResizeNormY = detailsResizeDeltaY / size.height;
  const detailsResizeNormX = detailsResizeDeltaX / rect.width;
  floorSceneCurrent.settings.previewPanelRatio = clamp(detailsResizeDrag.startPreviewRatio + detailsResizeNormY, value.minimumHeightRatio, value.maximumHeightRatio);
  floorSceneCurrent.settings.detailsPanelWidthRatio = clamp(detailsResizeDrag.startWidthRatio - detailsResizeNormX, value.minimumWidthRatio, value.maximumWidthRatio);
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
}
function refreshStudioPanels() {
  syncSnapUi();
  renderFloorList();
  toggleBackground.disabled = !floorSceneCurrent.background;
  toggleBackground.textContent = floorSceneCurrent.settings.backgroundVisible ? "隐藏" : "显示";
  Ud.disabled = !floorSceneCurrent.background;
  syncControlValue(globalWallHeight, floorSceneCurrent.settings.wallHeight.toFixed(2));
  syncControlValue(globalWallThickness, floorSceneCurrent.settings.wallThickness.toFixed(2));
  syncControlValue(globalWallOpacity, Math.round(floorSceneCurrent.settings.wallOpacity * 100));
  toggleFloorEdge.textContent = floorSceneCurrent.settings.floorEdgeVisible === false ? "隐藏" : "显示";
  toggleFloorEdge.setAttribute("aria-pressed", String(floorSceneCurrent.settings.floorEdgeVisible !== false));
  mf.hidden = !!floorSceneCurrent.background || !!floorSceneCurrent.walls.length || !!floorSceneCurrent.items.length;
  og.textContent = floorSceneCurrent.walls.length + " 墙 · " + floorSceneCurrent.windows.length + " 窗 · " + floorSceneCurrent.doors.length + " 门 · " + floorSceneCurrent.railings.length + " 栏杆 · " + floorSceneCurrent.items.length + " 物件";
  renderLightLayerPanel();
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
  setCameraProjectionMode(getCameraProjectionMode());
  nudgeCamera(cameraViewMode());
  syncLivePreviewButtons();
  syncFloorCameraChrome();
  applyPreviewEnvironment();
  updateProgressChecklist();
}
function updateSelectionInspector() {
  const lightGroup = selectedEntity();
  const flag = multiSelection.length;
  inspectorEmpty.hidden = !!lightGroup;
  selectionInspector.hidden = !lightGroup;
  Kd.disabled = !lightGroup && !flag;
  if (flag) {
    inspectorEmpty.hidden = false;
    selectionInspector.hidden = true;
    inspectorEmpty.querySelector("strong").textContent = "已框选 " + flag + " 个对象";
    inspectorEmpty.querySelector("p").textContent = "可以直接批量删除；单击一个对象可继续精确编辑属性。";
    return;
  }
  inspectorEmpty.querySelector("strong").textContent = "选择画布中的对象";
  inspectorEmpty.querySelector("p").textContent = "选中墙体、窗户、门或家具后，可在这里精确调整。";
  if (!!lightGroup && !!selection) {
    lightPreviewNote.hidden = true;
    selectionHeadingEl.classList.remove("light-selected");
    Af.hidden = selection.kind !== "wall";
    zf.hidden = selection.kind !== "window";
    Of.hidden = selection.kind !== "door";
    Bf.hidden = selection.kind !== "railing";
    Gf.hidden = selection.kind !== "item";
    selectionId.hidden = selection.kind === "item";
    selectionId.textContent = selectionId.hidden ? "" : lightGroup.id;
    if (selection.kind === "wall") {
      selectEl("#selection-title").textContent = "墙体";
      syncControlValue(selectEl("#wall-length"), wallLengthMeters(lightGroup, pixelsPerMeter() || 1).toFixed(2) + " m");
      syncControlValue(selectEl("#wall-height"), lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#wall-thickness"), lightGroup.thickness.toFixed(2));
      const flag = lightGroup.opacity === null || lightGroup.opacity === undefined ? null : clamp(finite(lightGroup.opacity, floorSceneCurrent.settings.wallOpacity), 0, 1);
      selectEl("#wall-opacity-mode").value = flag === null ? "global" : "custom";
      syncControlValue(selectEl("#wall-opacity"), Math.round((flag ?? floorSceneCurrent.settings.wallOpacity) * 100));
      selectEl("#wall-opacity").disabled = flag === null;
      syncStudioSelect(selectEl("#wall-opacity-mode"));
      selectEl("#wall-open-end-mode").value = lightGroup.allowOpenEnd === true ? "allowed" : "auto";
      syncStudioSelect(selectEl("#wall-open-end-mode"));
    } else if (selection.kind === "window") {
      selectEl("#selection-title").textContent = "窗户";
      syncControlValue(selectEl("#window-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#window-height"), lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#window-sill"), lightGroup.sill.toFixed(2));
      selectEl("#window-divider").value = lightGroup.hasDivider === false ? "without" : "with";
      syncStudioSelect(selectEl("#window-divider"));
      syncControlValue(selectEl("#window-position"), Math.round(lightGroup.t * 100) + "%");
    } else if (selection.kind === "door") {
      selectEl("#selection-title").textContent = {
        solid: "普通平开门",
        double: "双开门",
        entry: "入户门（常闭）",
        glass: "玻璃平开门",
        "sliding-glass": "玻璃推拉门",
        "roller-shutter": "卷帘门",
        "frame-only": "仅门框"
      }[lightGroup.doorType] || "普通平开门";
      selectEl("#door-type").value = lightGroup.doorType || "solid";
      syncStudioSelect(selectEl("#door-type"));
      syncControlValue(selectEl("#door-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#door-height"), lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#door-position"), Math.round(lightGroup.t * 100) + "%");
      selectEl(".door-actions").hidden = ["entry", "sliding-glass", "frame-only"].includes(lightGroup.doorType);
      selectEl("#door-hinge").hidden = ["double", "roller-shutter"].includes(lightGroup.doorType);
      selectEl("#door-swing").hidden = false;
    } else if (selection.kind === "railing") {
      selectEl("#selection-title").textContent = "玻璃栏杆";
      syncControlValue(selectEl("#railing-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#railing-height"), lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#railing-position"), Math.round(lightGroup.t * 100) + "%");
    } else {
      const named = furnitureCatalog[lightGroup.type];
      const flag = lightGroup.type === "planlabel";
      const present = set.has(lightGroup.type);
      const isSecurityDevice = lightGroup.type === "camera" || lightGroup.type === "presence";
      selectEl("#selection-title").textContent = named?.name || "物件";
      lightPreviewNote.hidden = !present;
      selectionHeadingEl.classList.toggle("light-selected", present);
      $f.hidden = !flag;
      Wf.hidden = !present;
      Wf.title = "";
      Kf.hidden = lightGroup.type !== "curtain";
      Vf.hidden = flag || present || lightGroup.type === "flooropening";
      Hf.hidden = flag || lightGroup.type === "flooropening";
      Nf.hidden = lightGroup.type === "ceilinglight";
      Xf.hidden = lightGroup.type === "ceilinglight";
      qf.hidden = !(present || isSecurityDevice);
      qf.title = isSecurityDevice ? "0° 正装，±90° 侧装，180° 倒装；离地高度为底座安装点高度" : "";
      Uf.hidden = lightGroup.type !== "striplight";
      Yf.hidden = lightGroup.type !== "striplight";
      Zf.hidden = lightGroup.type !== "striplight";
      Qf.hidden = !roundTableTypes.has(lightGroup.type);
      Jf.hidden = !stairItemTypes.has(lightGroup.type);
      jf.hidden = lightGroup.type !== "tv";
      eg.hidden = lightGroup.type !== "shoecabinet";
      o0.setAttribute("aria-pressed", lightGroup.shoeCabinetMirrored === true ? "true" : "false");
      selectEl("#item-rotation-label").textContent = lightGroup.type === "striplight" ? "平面旋转（°）" : present ? "平面方向（°）" : "旋转角度（°）";
      selectEl("#item-rotation").min = lightGroup.type === "striplight" ? "0" : "-360";
      selectEl("#item-rotation").max = "360";
      _f.textContent = lightGroup.type === "striplight" ? "安装倾斜（°）" : isSecurityDevice ? "安装翻转／侧装（°）" : "出光角度（°）";
      selectEl("#item-vertical-rotation").min = lightGroup.type === "striplight" ? "0" : isSecurityDevice ? "-180" : "-90";
      selectEl("#item-vertical-rotation").max = lightGroup.type === "striplight" ? "360" : isSecurityDevice ? "180" : "90";
      for (const hidden of list) {
        hidden.hidden = !present;
      }
      tg.textContent = lightGroup.type === "flooropening" ? "洞口宽（m）" : lightGroup.type === "striplight" ? "发光长度（m）" : lightGroup.type === "pillar" ? "长（m）" : "宽（m）";
      ng.textContent = lightGroup.type === "flooropening" ? "洞口长（m）" : lightGroup.type === "striplight" ? "发光宽度（m）" : flag ? "铭牌高（m）" : lightGroup.type === "pillar" ? "宽（m）" : "深（m）";
      if (flag) {
        syncControlValue(selectEl("#label-title"), lightGroup.title || "家庭总览");
        syncControlValue(selectEl("#label-title-spacing"), Math.round(clamp(finite(lightGroup.titleSpacing, 1.05), 0, 1.8) * 100));
        syncControlValue(selectEl("#label-subtitle"), lightGroup.subtitle || "HOME PLAN");
        syncControlValue(selectEl("#label-subtitle-spacing"), Math.round(clamp(finite(lightGroup.subtitleSpacing, 0.08), 0, 0.6) * 100));
        syncControlValue(selectEl("#label-line-length"), Math.round(clamp(finite(lightGroup.lineLength, 0.86), 0.3, 1) * 100));
      }
      if (present) {
        const temperature = defaultLightPresets[lightGroup.type] || defaultLightPresets.downlight;
        on = resolveLightGroup(lightGroup)?.id || ensureDefaultLightGroup().id;
        renderLightLayerPanel();
        syncLightGroupSelect(lightGroup);
        syncControlValue(selectEl("#light-temperature"), Math.round(clamp(finite(lightGroup.lightTemperature, temperature.temperature), 2200, 6500)));
        syncControlValue(selectEl("#light-brightness"), Math.round(clamp(finite(lightGroup.lightBrightness, temperature.brightness), 0, 100)));
        syncControlValue(selectEl("#light-range"), clamp(finite(lightGroup.lightRange, temperature.range), 0.5, 10).toFixed(1));
        selectEl("#light-angle").max = String(defaultItemDepth(lightGroup.type));
        syncControlValue(selectEl("#light-angle"), Math.round(clamp(finite(lightGroup.lightAngle, temperature.angle), 15, defaultItemDepth(lightGroup.type))));
        const value = lightGroup.type === "striplight" ? normalizeFullRotation(lightGroup.verticalRotation) : clamp(finite(lightGroup.verticalRotation, 0), -90, 90);
        syncControlValue(selectEl("#item-vertical-rotation"), Math.round(value * 100) / 100);
        syncControlValue(itemStripRoll, Math.round(clamp(finite(lightGroup.stripRollRotation, 0), 0, 360) * 100) / 100);
        zl.checked = lightGroup.lightSourceVisible !== false;
      }
      if (isSecurityDevice) {
        syncControlValue(selectEl("#item-vertical-rotation"), Math.round(clamp(finite(lightGroup.verticalRotation, 0), -180, 180) * 100) / 100);
      }
      if (lightGroup.type === "curtain") {
        selectEl("#curtain-position").value = ["left", "right", "split"].includes(lightGroup.curtainPosition) ? lightGroup.curtainPosition : "split";
        syncStudioSelect(selectEl("#curtain-position"));
      }
      if (roundTableTypes.has(lightGroup.type)) {
        selectEl("#round-table-turntable").value = hasRoundTableTurntable(lightGroup) ? "with" : "without";
        syncStudioSelect(selectEl("#round-table-turntable"));
      }
      if (stairItemTypes.has(lightGroup.type)) {
        selectEl("#stair-direction").value = ["left", "right"].includes(lightGroup.stairDirection) ? lightGroup.stairDirection : "right";
        syncStudioSelect(selectEl("#stair-direction"));
      }
      if (lightGroup.type === "tv") {
        selectEl("#tv-mount-style").value = tvMountStyles.has(lightGroup.tvMountStyle) ? lightGroup.tvMountStyle : "standard";
        syncStudioSelect(selectEl("#tv-mount-style"));
      }
      syncControlValue(selectEl("#item-x"), (lightGroup.x / (pixelsPerMeter() || 1)).toFixed(2));
      syncControlValue(selectEl("#item-y"), (lightGroup.y / (pixelsPerMeter() || 1)).toFixed(2));
      syncControlValue(selectEl("#item-width"), lightGroup.width.toFixed(2));
      selectEl("#item-height").min = String(itemMinimumHeight(lightGroup.type));
      selectEl("#item-height").step = lightGroup.type === "rug" ? "0.002" : "0.05";
      syncControlValue(selectEl("#item-height"), lightGroup.type === "rug" ? lightGroup.height.toFixed(3) : lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#item-depth"), lightGroup.depth.toFixed(2));
      syncControlValue(selectEl("#item-elevation"), (lightGroup.elevation || 0).toFixed(2));
      syncControlValue(selectEl("#item-rotation"), Math.round(lightGroup.rotation * 100) / 100);
    }
  }
}
function refreshViews(scope = "all") {
  refreshStudioPanels();
  updateSelectionInspector();
  drawPlan();
  if (scope !== "none") {
    rebuildPreviewMeshes({
      scope
    });
  }
}
function setActiveTool(argPrimary) {
  if (!toolHelpText[argPrimary]) {
    return;
  }
  if (assetCategory === "light" && argPrimary !== "select") {
    showToast("灯光编辑中户型已锁定，请先切回家居或电器。");
    return;
  }
  const flag = activeTool === "wall" && argPrimary !== "wall" && Ar > 0;
  activeTool = argPrimary;
  element.dataset.tool = argPrimary;
  element.style.cursor = "";
  for (const element of Zd) {
    element.classList.toggle("active", element.dataset.tool === argPrimary);
  }
  [activeToolLabelCurrent.textContent, toolHelp.textContent] = assetCategory === "light" ? ["灯光编辑", "户型已锁定；框选多盏灯后可整体拖动，Shift 锁轴，Option/Alt 复制"] : toolHelpText[argPrimary];
  yr.hidden = argPrimary !== "wall" || !Tt;
  if (argPrimary !== "wall") {
    resetWallDrawingCurrent();
  }
  if (argPrimary !== "scale") {
    wallDrawAnchorCurrent = null;
  }
  at = null;
  Uo = null;
  railingPlacementPreviewCurrent = null;
  Ko = null;
  drawPlan();
  if (flag) {
    showToast("当前墙线未闭合，不会生成地面；如果绘制的是隔墙，可以忽略此提醒。", "warning");
  }
}
function requireCalibration(argPrimary = "scale") {
  if (pixelsPerMeter()) {
    return true;
  } else {
    showToast("请先画一条参考线并填写真实长度。", "error");
    setActiveTool(argPrimary);
    return false;
  }
}
function deleteCurrentSelection() {
  if (multiSelection.length) {
    const scope = activeSelectionAssetCategory();
    pushHistory();
    const value = new Set(multiSelection.filter(kind => kind.kind === "wall").map(item => item.id));
    const idSet = new Set(multiSelection.filter(kind => kind.kind === "window").map(item => item.id));
    const wallIdSet = new Set(multiSelection.filter(kind => kind.kind === "door").map(item => item.id));
    const set = new Set(multiSelection.filter(kind => kind.kind === "railing").map(item => item.id));
    const wallIdSetCurrent = new Set(multiSelection.filter(kind => kind.kind === "item").map(item => item.id));
    floorSceneCurrent.walls = floorSceneCurrent.walls.filter(id => !value.has(id.id));
    floorSceneCurrent.windows = floorSceneCurrent.windows.filter(id => !idSet.has(id.id) && !value.has(id.wallId));
    floorSceneCurrent.doors = floorSceneCurrent.doors.filter(id => !wallIdSet.has(id.id) && !value.has(id.wallId));
    floorSceneCurrent.railings = floorSceneCurrent.railings.filter(id => !set.has(id.id) && !value.has(id.wallId));
    floorSceneCurrent.items = floorSceneCurrent.items.filter(id => !wallIdSetCurrent.has(id.id));
    if (value.size) {
      wallIdMap();
    }
    clearSelection();
    refreshViews(scope);
    scheduleSave();
    return;
  }
  const floor = selectedEntity();
  if (!floor || !selection) {
    return;
  }
  const scope = activeSelectionAssetCategory();
  pushHistory();
  if (selection.kind === "wall") {
    floorSceneCurrent.walls = floorSceneCurrent.walls.filter(item => item.id !== floor.id);
    floorSceneCurrent.windows = floorSceneCurrent.windows.filter(wall => wall.wallId !== floor.id);
    floorSceneCurrent.doors = floorSceneCurrent.doors.filter(wall => wall.wallId !== floor.id);
    floorSceneCurrent.railings = floorSceneCurrent.railings.filter(wall => wall.wallId !== floor.id);
    wallIdMap();
  } else if (selection.kind === "window") {
    floorSceneCurrent.windows = floorSceneCurrent.windows.filter(item => item.id !== floor.id);
  } else if (selection.kind === "door") {
    floorSceneCurrent.doors = floorSceneCurrent.doors.filter(item => item.id !== floor.id);
  } else if (selection.kind === "railing") {
    floorSceneCurrent.railings = floorSceneCurrent.railings.filter(item => item.id !== floor.id);
  } else {
    floorSceneCurrent.items = floorSceneCurrent.items.filter(item => item.id !== floor.id);
  }
  clearSelection();
  refreshViews(scope);
  scheduleSave();
}
function placeCatalogFurnitureItem(argPrimary, argSecondary, width = {}) {
  const lastMotionRenderAt = furnitureCatalog[argPrimary];
  if (!lastMotionRenderAt || !requireCalibration()) {
    return;
  }
  const temperature = defaultLightPresets[argPrimary] || defaultLightPresets.downlight;
  const id = set.has(argPrimary) ? ensureDefaultLightGroup() : null;
  pushHistory();
  const options = {
    id: makeId("item"),
    type: argPrimary,
    x: argSecondary.x,
    y: argSecondary.y,
    rotation: 0,
    width: width.width ?? lastMotionRenderAt.width,
    depth: width.depth ?? lastMotionRenderAt.depth,
    height: lastMotionRenderAt.height,
    elevation: lastMotionRenderAt.elevation || 0,
    color: lastMotionRenderAt.color,
    ...(argPrimary === "planlabel" ? {
      title: "家庭总览",
      subtitle: "HOME PLAN",
      titleSpacing: 1.05,
      subtitleSpacing: 0.08,
      lineLength: 0.86
    } : {}),
    ...(argPrimary === "camera" || argPrimary === "presence" ? {
      verticalRotation: 0
    } : {}),
    ...(argPrimary === "tv" ? {
      screenEnabled: true,
      screenLayerName: "电视画面 " + (tvItemsOnFloor().length + 1),
      tvMountStyle: "standard"
    } : {}),
    ...(argPrimary === "smallcar" ? {
      chargingEnabled: false,
      chargingLayerName: "汽车充电 " + (smallCarItemsOnFloor().length + 1)
    } : {}),
    ...(argPrimary === "curtain" ? {
      curtainPosition: "split"
    } : {}),
    ...(stairItemTypes.has(argPrimary) ? {
      stairDirection: "right"
    } : {}),
    ...(argPrimary === "shoecabinet" ? {
      shoeCabinetMirrored: false
    } : {}),
    ...(roundTableTypes.has(argPrimary) ? {
      roundTableTurntable: false
    } : {}),
    ...(set.has(argPrimary) ? {
      lightGroupId: id.id,
      verticalRotation: 0,
      ...(argPrimary === "striplight" ? {
        stripRollRotation: 0,
        lightSourceVisible: true
      } : {}),
      lightTemperature: temperature.temperature,
      lightBrightness: temperature.brightness,
      lightRange: temperature.range,
      lightAngle: temperature.angle
    } : {})
  };
  ensureItemLayerNames([options]);
  floorSceneCurrent.items.push(options);
  setSelection("item", options.id);
  setActiveTool("select");
  refreshViews(itemPreviewScope(options));
  scheduleSave();
}
function selectedItemIds() {
  const value = new Set([...(selection?.kind === "item" ? [selection.id] : []), ...multiSelection.filter(kind => kind.kind === "item").map(item => item.id)]);
  const flag = assetCategory === "light";
  const list = floorSceneCurrent.items.filter(id => value.has(id.id) && set.has(id.type) === flag);
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  pushHistory();
  const snapInsetPixels = (pixelsPerMeter() || 100) * 0.12;
  const mapped = list.map(planPoint => ({
    ...structuredClone(planPoint),
    id: makeId("item"),
    x: planPoint.x + snapInsetPixels,
    y: planPoint.y + snapInsetPixels
  }));
  ensureItemLayerNames(mapped);
  floorSceneCurrent.items.push(...mapped);
  if (mapped.length === 1) {
    setSelection("item", mapped[0].id);
  } else {
    selection = null;
    multiSelection = mapped.map(id => ({
      kind: "item",
      id: id.id
    }));
  }
  refreshViews(list.some(type => type.type === "flooropening") ? "all" : flag ? "lights" : "items");
  scheduleSave();
  showToast("已复制 " + mapped.length + " 个物件。");
}
function cloneSelectedItems() {
  const value = new Set([...(selection?.kind === "item" ? [selection.id] : []), ...multiSelection.filter(kind => kind.kind === "item").map(item => item.id)]);
  const isLightAssetCategory = assetCategory === "light";
  return floorSceneCurrent.items.filter(id => value.has(id.id) && set.has(id.type) === isLightAssetCategory);
}
function copySelectedItems() {
  const list = cloneSelectedItems();
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  clipboardItems = list.map(argPrimary => structuredClone(argPrimary));
  const id = activeFloor();
  Fr = {
    id: id.id,
    originX: id.originX,
    originY: id.originY,
    offsetX: id.offsetX,
    offsetZ: id.offsetZ,
    rotation: id.rotation,
    scene: {
      calibration: structuredClone(floorSceneCurrent.calibration)
    }
  };
  clipboardPasteCount = 0;
  showToast("已复制 " + clipboardItems.length + " 个物件，按 ⌘/Ctrl+V 粘贴。");
}
function pasteClipboardItems() {
  if (!clipboardItems.length) {
    showToast("暂无可粘贴的物件。");
    return;
  }
  if (clipboardItems.some(type => type.type === "flooropening") && !requireCalibration()) {
    return;
  }
  const flag = clipboardItems.every(item => set.has(item.type));
  if (flag && assetCategory !== "light") {
    setAssetCategoryFilter("light");
  } else if (!flag && assetCategory === "light") {
    setAssetCategoryFilter("home");
  }
  pushHistory();
  clipboardPasteCount += 1;
  const value = (pixelsPerMeter() || 100) * 0.12 * clipboardPasteCount;
  const list = clipboardItems.map(planPoint => ({
    ...structuredClone(planPoint),
    id: makeId("item"),
    x: planPoint.x + value,
    y: planPoint.y + value,
    ...(planPoint.type === "flooropening" && Fr && Fr.id !== activeFloor().id ? {
      ...floorLocalToWorldPoint(planPoint, Fr, activeFloor()),
      rotation: planPoint.rotation + finite(Fr.rotation, 0) - finite(activeFloor().rotation, 0)
    } : {}),
    ...(set.has(planPoint.type) && !floorSceneCurrent.lightGroups.some(object3d => object3d.id === planPoint.lightGroupId) ? {
      lightGroupId: ensureDefaultLightGroup().id
    } : {})
  }));
  ensureItemLayerNames(list);
  floorSceneCurrent.items.push(...list);
  if (list.length === 1) {
    setSelection("item", list[0].id);
  } else {
    selection = null;
    multiSelection = list.map(id => ({
      kind: "item",
      id: id.id
    }));
  }
  refreshViews(list.some(type => type.type === "flooropening") ? "all" : flag ? "lights" : "items");
  scheduleSave();
  showToast("已粘贴 " + list.length + " 个物件。");
}
async function reloadPlanBackground() {
  const value = ++planBackgroundRevision;
  planBackgroundImageCurrent = null;
  if (!floorSceneCurrent.background?.url) {
    return;
  }
  const bgUrl = floorSceneCurrent.background.url;
  await new Promise(argPrimary => {
    let flag = false;
    const onComplete = () => {
      if (!flag) {
        flag = true;
        argPrimary();
      }
    };
    const el = new Image();
    const setTimeoutResult = window.setTimeout(onComplete, 2000);
    el.addEventListener("load", () => {
      if (value !== planBackgroundRevision || floorSceneCurrent.background?.url !== bgUrl) {
        onComplete();
        return;
      }
      planBackgroundImageCurrent = el;
      window.clearTimeout(setTimeoutResult);
      if (flag) {
        drawPlan();
      } else {
        onComplete();
      }
    }, {
      once: true
    });
    el.addEventListener("error", () => {
      window.clearTimeout(setTimeoutResult);
      if (value === planBackgroundRevision) {
        showToast("底图加载失败，请重新导入。", "error");
      }
      onComplete();
    }, {
      once: true
    });
    el.src = bgUrl;
  });
}
async function importPlanBackgroundFile(body) {
  if (body) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
      showToast("仅支持 PNG、JPG、JPEG、WebP 和 SVG 图片。", "error");
      return;
    }
    importPlanCurrent.disabled = true;
    importPlanCurrent.textContent = "上传中…";
    try {
      const size = await studioFetch("/assets/user", {
        method: "POST",
        body,
        headers: {
          "Content-Type": body.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(body.name)
        }
      });
      pushHistory();
      floorSceneCurrent.background = {
        assetId: size.assetId,
        url: size.url,
        name: size.name,
        width: size.width,
        height: size.height
      };
      const floor = activeFloor();
      if (floor && !floor.originInitialized) {
        floor.originX = size.width / 2;
        floor.originY = size.height / 2;
        floor.originInitialized = true;
      }
      floorSceneCurrent.settings.backgroundVisible = true;
      await reloadPlanBackground();
      fitPlanViewToContent();
      refreshViews();
      scheduleSave();
      setActiveTool("scale");
      showToast("底图已导入，请在图上画一条已知长度的参考线。");
    } catch (error) {
      showToast(error.message || "底图上传失败。", "error");
    } finally {
      importPlanCurrent.disabled = false;
      importPlanCurrent.textContent = "导入";
    }
  }
}
function resolvedThemeColors() {
  return themeColors;
}
function positionDirectionalLight(light, azimuthDeg, elevationDeg, distanceMeters) {
  if (!light) {
    return;
  }
  const azimuthRad = THREE.MathUtils.degToRad(azimuthDeg);
  const elevationRad = THREE.MathUtils.degToRad(elevationDeg);
  const horizontal = Math.cos(elevationRad) * distanceMeters;
  light.position.set(Math.cos(azimuthRad) * horizontal, Math.sin(elevationRad) * distanceMeters, Math.sin(azimuthRad) * horizontal);
}
function applyPreviewEnvironment() {
  const value = resolvedThemeColors();
  const exposure = baseLighting;
  if (!previewSceneCurrent || !renderer) {
    return;
  }
  previewSceneCurrent.background = null;
  renderer.setClearColor(value.background, 0);
  previewSceneCurrent.fog = null;
  renderer.toneMappingExposure = exposure.exposure;
  const conditionalValue = yt ? 0.5 : 1;
  if (hemisphereLight) {
    hemisphereLight.color.setHex(14278376);
    hemisphereLight.groundColor.setHex(1909296);
    hemisphereLight.intensity = exposure.hemisphereIntensity * conditionalValue;
  }
  if (ambientLight) {
    ambientLight.color.setHex(9673384);
    ambientLight.intensity = exposure.ambientIntensity * conditionalValue;
  }
  if (previewSpotLight) {
    previewSpotLight.color.setHex(15922426);
    previewSpotLight.intensity = exposure.mainIntensity * conditionalValue;
    positionDirectionalLight(previewSpotLight, exposure.mainAzimuth, exposure.mainElevation, 18.4);
    previewSpotLight.shadow.bias = -0.00012;
    previewSpotLight.shadow.normalBias = 0.016;
    previewSpotLight.shadow.radius = 1.75;
    previewSpotLight.shadow.blurSamples = 4;
    if (shadowCameraExpanded) {
      previewSpotLight.shadow.radius = 1.2;
      previewSpotLight.shadow.blurSamples = 8;
    }
    previewSpotLight.shadow.intensity = exposure.mainShadowIntensity;
  }
  if (fillLight) {
    fillLight.color.setHex(10528437);
    fillLight.intensity = exposure.fillIntensity * conditionalValue;
    positionDirectionalLight(fillLight, exposure.fillAzimuth, exposure.fillElevation, 15.2);
  }
  if (topLight) {
    topLight.color.setHex(16185338);
    topLight.intensity = exposure.topIntensity * conditionalValue;
    positionDirectionalLight(topLight, exposure.topAzimuth, exposure.topElevation, 16.1);
  }
}
function setShadowCameraExpanded(argPrimary) {
  const flag = argPrimary === true;
  if (flag !== shadowCameraExpanded) {
    if (flag && previewSpotLight?.shadow?.camera) {
      const camera = previewSpotLight.shadow.camera;
      savedSpotShadowCamera = {
        left: camera.left,
        right: camera.right,
        top: camera.top,
        bottom: camera.bottom,
        near: camera.near,
        far: camera.far
      };
    }
    shadowCameraExpanded = flag;
    applyPreviewEnvironment();
    if (!flag && savedSpotShadowCamera && previewSpotLight?.shadow?.camera) {
      const camera = previewSpotLight.shadow.camera;
      Object.assign(camera, savedSpotShadowCamera);
      camera.updateProjectionMatrix();
      savedSpotShadowCamera = null;
    }
    if (previewSpotLight?.shadow) {
      previewSpotLight.shadow.needsUpdate = true;
    }
    if (renderer?.domElement) {
      renderer.domElement.dataset.exportShadowQuality = flag ? "high" : "realtime";
    }
  }
}
function scaledShadowMapSize(argPrimary) {
  if (!shadowCameraExpanded) {
    return argPrimary;
  }
  const value = Math.max(1, Math.floor(finite(renderer?.capabilities?.maxTextureSize, DEFAULT_MAX_TEXTURE_SIZE)));
  return Math.min(value, Math.max(argPrimary, DEFAULT_MAX_TEXTURE_SIZE));
}
function syncBaseLightingControls() {
  for (const el of baseLightControlEls) {
    const toFixed = baseLighting[el.dataset.baseLightControl];
    const flag = el.step === "5";
    syncControlValue(el, flag ? Math.round(toFixed) : Number(toFixed.toFixed(2)));
  }
}
function applyBaseLighting(argPrimary) {
  const localValue = baseLighting;
  baseLighting = normalizeBaseLighting(argPrimary);
  syncBaseLightingControls();
  applyPreviewEnvironment();
  requestRender({
    shadows: Object.keys(DEFAULT_BASE_LIGHTING).some(argPrimary => localValue[argPrimary] !== baseLighting[argPrimary])
  });
}
function relocateBaseLightControls() {
  if (!projectDocCurrent || !baseLightControls) {
    return;
  }
  const appendVar = exportDialog?.open ? exportDialog : document.body;
  if (baseLightControls.parentElement !== appendVar) {
    appendVar.append(baseLightControls);
  }
  if (baseLightControls.hidden) {
    applyBaseLighting(projectDocCurrent.baseLighting);
  }
  baseLightControls.hidden = false;
  const size = baseLightControls.getBoundingClientRect();
  if (size.right > window.innerWidth - 8 || size.bottom > window.innerHeight - 8 || size.left < 8 || size.top < 8) {
    baseLightControls.style.right = "auto";
    baseLightControls.style.left = clamp(size.left, 8, Math.max(8, window.innerWidth - size.width - 8)) + "px";
    baseLightControls.style.top = clamp(size.top, 8, Math.max(8, window.innerHeight - size.height - 8)) + "px";
  }
}
function closeBaseLightControls() {
  if (baseLightControls) {
    if (projectDocCurrent) {
      applyBaseLighting(projectDocCurrent.baseLighting);
    }
    baseLightControls.hidden = true;
  }
}
function commitBaseLightingFromControls() {
  if (!projectDocCurrent) {
    return;
  }
  const lighting = normalizeBaseLighting(baseLighting);
  projectDocCurrent.baseLighting = lighting;
  applyBaseLighting(lighting);
  scheduleSave();
  baseLightingChannel?.postMessage({
    type: "base-lighting-saved",
    lighting
  });
  flushSave();
  showToast("基础光设置已保存，导图和自动化控件已同步。", "success");
}
function onBaseLightControlInput(el) {
  const baseLightControl = el.dataset.baseLightControl;
  if (baseLightControl in baseLighting) {
    baseLighting = normalizeBaseLighting({
      ...baseLighting,
      [baseLightControl]: finite(el.value, baseLighting[baseLightControl])
    });
    applyPreviewEnvironment();
    requestRender({
      shadows: true
    });
  }
}
function activeCameraSettings() {
  if (getPreviewFloorModeCurrent() === "all") {
    return projectDocCurrent.combinedCameraSettings;
  } else {
    return floorSceneCurrent.settings;
  }
}
function getCameraProjectionMode() {
  if (activeCameraSettings()?.cameraMode === "perspective") {
    return "perspective";
  } else {
    return "orthographic";
  }
}
function cameraViewMode() {
  if (activeCameraSettings()?.cameraView === "top") {
    return "top";
  } else {
    return "free";
  }
}
function topViewRotation() {
  return (Math.round(finite(activeCameraSettings()?.cameraTopRotation, 0) / 90) * 90 % 360 + 360) % 360;
}
function topViewForwardVector(argPrimary = topViewRotation()) {
  const value = THREE.MathUtils.degToRad(argPrimary);
  return new THREE.Vector3(Math.sin(value), 0, -Math.cos(value));
}
function getCameraFocalLength() {
  return clamp(finite(activeCameraSettings()?.cameraFocalLength, 50), 18, 120);
}
function enabledVisibleLights() {
  return collectVisibleLights().filter(({
    item,
    group
  }) => group?.enabled !== false && finite(item.lightBrightness, 0) > 0).map(({
    item
  }) => item);
}
function estimateLightRenderCost() {
  const list = enabledVisibleLights();
  const size = renderer?.domElement;
  const previewPixels = size?.width && size?.height ? size.width * size.height : Math.max(window.innerWidth * window.innerHeight * 0.32, 120000);
  return {
    count: list.length,
    cost: adaptiveLightRenderCost(list.map(item => ({
      type: item.type,
      angle: item.lightAngle,
      brightness: item.lightBrightness,
      enabled: true
    }))),
    budget: adaptiveDeviceLightBudget({
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      previewPixels
    })
  };
}
function evaluatePreviewLightBudget() {
  if (isStageEmbed) {
    previewQualityReady = true;
    as = true;
    previewQualityPath = "cache-first";
    return {
      count: 0,
      cost: 0,
      budget: 0
    };
  }
  const value = estimateLightRenderCost();
  const flag = previewQualityReady;
  if (as) {
    if (previewQualityReady && value.cost < Math.min(value.budget * 0.68, Math.max(baselineLightRenderCost * 0.55, 1))) {
      previewQualityReady = false;
      previewQualityPath = "";
      baselineLightRenderCost = 0;
      slowFrameStreak = 0;
    }
  } else {
    as = true;
  }
  if (flag && !previewQualityReady) {
    lightCacheEpoch += 1;
    lightCacheReady = false;
    previewQualityJustBecameReady = false;
    setPreviewLightCacheVisible(false);
  }
  return value;
}
function isPreviewQualityReady() {
  if (yt) {
    return false;
  } else {
    evaluatePreviewLightBudget();
    return previewQualityReady && !floorSelectionQuery && !curtainMotionActive && !vacuumMotionActive;
  }
}
function markPreviewQualityReady(sufficient) {
  if (!previewQualityReady && !!sufficient?.sufficient) {
    previewQualityReady = true;
    as = true;
    previewQualityPath = "frame-rate";
    baselineLightRenderCost = estimateLightRenderCost().cost;
    adaptiveFpsEstimate = sufficient.fps;
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
    syncOrbitControls();
  }
}
function checkAdaptiveQuality() {
  if (previewQualityReady) {
    return;
  }
  const sufficient = assessAdaptiveRenderFrames(recentFrameMsSamplesCurrent);
  if (!sufficient.sufficient) {
    return;
  }
  const value = estimateLightRenderCost();
  const maxValue = value.cost / Math.max(value.budget, 1);
  const adaptiveQualityTier = maxValue >= 1.8 ? 3 : maxValue >= 1 ? 4 : 5;
  adaptiveFpsEstimate = sufficient.fps;
  if (sufficient.severe) {
    slowFrameStreak = adaptiveQualityTier;
  } else if (sufficient.slow) {
    slowFrameStreak += 1;
  } else if (sufficient.smooth) {
    slowFrameStreak = 0;
  }
  if (slowFrameStreak >= adaptiveQualityTier) {
    markPreviewQualityReady(sufficient);
  }
}
function tickQualityProbe(argPrimary = performance.now()) {
  if (!previewOrbitLocked && (!isStageEmbed || !isStageWarmup) || stageSession || previewQualityReady || !enabledVisibleLights().length) {
    qualityProbeStartMs = 0;
    return;
  }
  if (qualityProbeStartMs > 0) {
    const value = argPrimary - qualityProbeStartMs;
    if (value >= 8 && (value <= 120 || isStageEmbed && value <= 2000)) {
      recentFrameMsSamplesCurrent.push(Math.min(value, 120));
    }
  }
  qualityProbeStartMs = argPrimary;
  if (!(recentFrameMsSamplesCurrent.length < 24)) {
    checkAdaptiveQuality();
    recentFrameMsSamplesCurrent.splice(0, 12);
  }
}
function isLivePreviewEnabled() {
  return floorSceneCurrent.settings?.livePreviewEnabled !== false;
}
function syncLivePreviewButtons() {
  const livePreviewEnabled = isLivePreviewEnabled();
  for (const element of previewSyncEls) {
    const value = element.dataset.previewSync === (livePreviewEnabled ? "live" : "manual");
    element.classList.toggle("active", value);
    element.setAttribute("aria-pressed", String(value));
  }
  refreshPreview.hidden = livePreviewEnabled;
  refreshPreview.disabled = !previewNeedsRefresh;
  refreshPreview.classList.toggle("is-dirty", previewNeedsRefresh);
  refreshPreview.textContent = previewNeedsRefresh ? "待更新 · 更新" : "已更新";
}
function syncCameraModeButtons(argPrimary = getCameraProjectionMode()) {
  for (const element of cameraModeEls) {
    element.classList.toggle("active", element.dataset.cameraMode === argPrimary);
  }
  syncCameraFocalControls(argPrimary);
}
function syncCameraViewButtons(cameraView = cameraViewMode()) {
  for (const element of cameraViewEls) {
    const value = element.dataset.cameraView === cameraView;
    element.classList.toggle("active", value);
    element.setAttribute("aria-pressed", String(value));
  }
  for (const disabled of cameraRotateTopEls) {
    disabled.disabled = cameraView !== "top";
  }
}
function syncCameraFocalControls(argPrimary = getCameraProjectionMode()) {
  for (const disabled of cameraFocalLengthEls) {
    syncControlValue(disabled, Math.round(getCameraFocalLength()));
    disabled.disabled = argPrimary !== "perspective";
    disabled.closest(".camera-focal-control")?.classList.toggle("is-disabled", disabled.disabled);
  }
}
function applyCameraFocalLength(isPerspectiveCamera = cameraCurrent, argSecondary = getCameraFocalLength()) {
  if (isPerspectiveCamera?.isPerspectiveCamera) {
    isPerspectiveCamera.setFocalLength(clamp(finite(argSecondary, 50), 18, 120));
  }
}
function syncOrbitControls() {
  if (!orbitControls) {
    return;
  }
  const flag = isPreviewQualityReady();
  const flagCurrent = isStageEmbed && isCapturingFrame && !isBakingLightCache;
  shadowAtlas?.setEnabled(isStageEmbed || !flag || !!flagCurrent);
  orbitControls.enableRotate = cameraViewMode() !== "top";
  if (previewQualityStatus) {
    previewQualityStatus.hidden = true;
    previewQualityStatus.title = "";
    previewQualityStatus.textContent = "";
  }
  if (refreshLightPreview) {
    refreshLightPreview.hidden = true;
    refreshLightPreview.disabled = true;
  }
}
function computeStudioPixelRatio(flag = false) {
  if (isStageEmbed && flag && isAutoDiagramEmbed !== null && (!isStageWarmup || previewOrbitLocked)) {
    return Math.min(window.devicePixelRatio || 1, 1.6) * ur * isAutoDiagramEmbed;
  }
  if (yt) {
    const computedValue = Math.min(window.devicePixelRatio || 1, 1.6) * ur;
    if (flag) {
      return Math.min(computedValue, 1);
    } else {
      return computedValue;
    }
  }
  const flagCurrent = isStageEmbed && isStageWarmup;
  let value = Math.min(window.devicePixelRatio || 1, flag ? 1 : 1.6) * (isStageEmbed ? ur : 1);
  if (isStageEmbed && (flag || flagCurrent)) {
    const {
      cost: localValue,
      budget: cost
    } = estimateLightRenderCost();
    if (localValue > cost) {
      value = Math.min(value, clamp(Math.sqrt(cost / localValue) * 0.85, 0.5, 0.85));
    }
  }
  return value;
}
const isRenderStatsTest = new URLSearchParams(window.location.search).has("render-stats-test");
const isPerfDiagnosticsEnabled = new URLSearchParams(window.location.search).get("performance-diagnostics") === "1";
const hu = 240;
const PERF_HUD_PUBLISH_MS = 750;
const MAX_GPU_QUERIES_PENDING = 4;
const perfStats = {
  hud: null,
  frameIntervals: [],
  cpuRenderTimes: [],
  gpuRenderTimes: [],
  lastMotionRenderAt: 0,
  floorSwitch: null,
  lastPublishAt: 0,
  motionActive: false,
  gpuContext: null,
  gpuExtension: null,
  gpuQueryActive: null,
  gpuQueriesPending: [],
  gpuStatus: "未初始化"
};
function initRenderStatsHud() {
  if (!isRenderStatsTest || !renderer) {
    return;
  }
  syncExternalModelDomStats();
  const domElement = renderer.domElement;
  const calls = {
    calls: Number(domElement.dataset.renderCalls || 0),
    triangles: Number(domElement.dataset.renderTriangles || 0),
    instanceSaved: Number(domElement.dataset.instanceDrawCallsSaved || 0),
    staticItemSaved: Number(domElement.dataset.staticItemDrawCallsSaved || 0)
  };
  let id = document.querySelector("#ha-bridge-render-stats-test-output");
  if (!id) {
    id = document.createElement("output");
    id.id = "ha-bridge-render-stats-test-output";
    document.body.append(id);
  }
  id.textContent = "渲染统计：" + calls.calls + " 次调用，" + calls.triangles + " 个三角面；重复实例节省 " + calls.instanceSaved + " 次，跨模型材质合批节省 " + calls.staticItemSaved + " 次。";
  document.documentElement.dataset.renderStatsTest = JSON.stringify(calls);
}
function pushBoundedTimingSample(isPerspectiveCamera, sampleMs) {
  if (Number.isFinite(sampleMs)) {
    isPerspectiveCamera.push(sampleMs);
    if (isPerspectiveCamera.length > hu) {
      isPerspectiveCamera.splice(0, isPerspectiveCamera.length - hu);
    }
  }
}
function averagePerfSample(list) {
  if (list.length) {
    return list.reduce((argPrimary, argSecondary) => argPrimary + argSecondary, 0) / list.length;
  } else {
    return null;
  }
}
function percentileOfSorted(list, argSecondary) {
  if (!list.length) {
    return null;
  }
  const length = [...list].sort((argPrimary, argSecondary) => argPrimary - argSecondary);
  const localValue = Math.min(length.length - 1, Math.max(0, Math.ceil(length.length * argSecondary) - 1));
  return length[localValue];
}
function fitCameraToSelection(list, numericParam = 1) {
  if (Number.isFinite(list)) {
    return Number(list.toFixed(numericParam));
  } else {
    return null;
  }
}
function ensurePerfHud() {
  if (!isPerfDiagnosticsEnabled || !renderer || perfStats.hud) {
    return;
  }
  const el = document.createElement("output");
  el.id = "performance-diagnostics";
  el.className = "performance-diagnostics";
  el.setAttribute("aria-label", "3D 性能诊断");
  el.setAttribute("aria-live", "off");
  el.textContent = "性能诊断初始化中…";
  selectEl("#preview-3d")?.append(el);
  perfStats.hud = el;
  perfStats.gpuContext = renderer.getContext?.() || null;
  perfStats.gpuExtension = perfStats.gpuContext?.getExtension?.("EXT_disjoint_timer_query_webgl2") || null;
  perfStats.gpuStatus = perfStats.gpuExtension ? "等待样本" : "不可用";
}
function beginGpuTimingQuery(flag) {
  if (!isPerfDiagnosticsEnabled || !flag) {
    return false;
  }
  const gpuQueryActive = perfStats;
  const isCreateQuery = gpuQueryActive.gpuContext;
  const isTIME_ELAPSED_EXT = gpuQueryActive.gpuExtension;
  if (!isCreateQuery || !isTIME_ELAPSED_EXT || gpuQueryActive.gpuQueryActive || gpuQueryActive.gpuQueriesPending.length >= MAX_GPU_QUERIES_PENDING) {
    return false;
  }
  try {
    const flag = isCreateQuery.createQuery();
    if (flag) {
      isCreateQuery.beginQuery(isTIME_ELAPSED_EXT.TIME_ELAPSED_EXT, flag);
      gpuQueryActive.gpuQueryActive = flag;
      gpuQueryActive.gpuStatus = "采样中";
      return true;
    } else {
      return false;
    }
  } catch {
    gpuQueryActive.gpuStatus = "不可用";
    return false;
  }
}
function endGpuTimingQuery(flag) {
  if (!flag) {
    return;
  }
  const gpuQueryActive = perfStats;
  const isEndQuery = gpuQueryActive.gpuContext;
  const isTIME_ELAPSED_EXT = gpuQueryActive.gpuExtension;
  const flagCurrent = gpuQueryActive.gpuQueryActive;
  gpuQueryActive.gpuQueryActive = null;
  if (!!isEndQuery && !!isTIME_ELAPSED_EXT && !!flagCurrent) {
    try {
      isEndQuery.endQuery(isTIME_ELAPSED_EXT.TIME_ELAPSED_EXT);
      gpuQueryActive.gpuQueriesPending.push(flagCurrent);
    } catch {
      isEndQuery.deleteQuery?.(flagCurrent);
      gpuQueryActive.gpuStatus = "不可用";
    }
  }
}
function collectGpuTimingResults() {
  if (!isPerfDiagnosticsEnabled) {
    return;
  }
  const gpuQueriesPending = perfStats;
  const isGetParameter = gpuQueriesPending.gpuContext;
  const isGPU_DISJOINT_EXT = gpuQueriesPending.gpuExtension;
  if (!isGetParameter || !isGPU_DISJOINT_EXT || !gpuQueriesPending.gpuQueriesPending.length) {
    return;
  }
  if (isGetParameter.getParameter(isGPU_DISJOINT_EXT.GPU_DISJOINT_EXT)) {
    for (const value of gpuQueriesPending.gpuQueriesPending.splice(0)) {
      isGetParameter.deleteQuery(value);
    }
    gpuQueriesPending.gpuRenderTimes.length = 0;
    gpuQueriesPending.gpuStatus = "采样失效";
    return;
  }
  const list = [];
  for (const value of gpuQueriesPending.gpuQueriesPending) {
    if (!isGetParameter.getQueryParameter(value, isGetParameter.QUERY_RESULT_AVAILABLE)) {
      list.push(value);
      continue;
    }
    const queryParameter = isGetParameter.getQueryParameter(value, isGetParameter.QUERY_RESULT);
    pushBoundedTimingSample(gpuQueriesPending.gpuRenderTimes, queryParameter / 1000000);
    isGetParameter.deleteQuery(value);
    gpuQueriesPending.gpuStatus = "可用";
  }
  gpuQueriesPending.gpuQueriesPending = list;
}
function fitCameraToSelectionCurrent(toFixed, Number) {
  const pendingPhases = isPerfDiagnosticsEnabled && perfStats.floorSwitch;
  if (!pendingPhases || performance.now() > pendingPhases.until) {
    return Number();
  }
  const timestampMs = performance.now();
  try {
    return Number();
  } finally {
    const totalMs = performance.now() - timestampMs;
    pendingPhases.phases ||= {};
    pendingPhases.pendingPhases ||= {};
    const maxMs = pendingPhases.phases[toFixed] ||= {
      calls: 0,
      totalMs: 0,
      maxMs: 0
    };
    maxMs.calls++;
    maxMs.totalMs += totalMs;
    maxMs.maxMs = Math.max(maxMs.maxMs, totalMs);
    pendingPhases.pendingPhases[toFixed] = (pendingPhases.pendingPhases[toFixed] || 0) + totalMs;
  }
}
function setPerfMotionActive(lastTick, flag = true) {
  const floorSwitch = isPerfDiagnosticsEnabled && perfStats.floorSwitch;
  if (!!floorSwitch && !(performance.now() > floorSwitch.until)) {
    if (!flag) {
      floorSwitch.lastTick = null;
      return;
    }
    if (floorSwitch.lastTick != null) {
      const computedValue = lastTick - floorSwitch.lastTick;
      floorSwitch.maxTickMs = Math.max(floorSwitch.maxTickMs || 0, computedValue);
      if (computedValue > 50) {
        floorSwitch.tickLongFrames = (floorSwitch.tickLongFrames || 0) + 1;
      }
    }
    floorSwitch.lastTick = lastTick;
    floorSwitch.checksSinceRender = (floorSwitch.checksSinceRender || 0) + 1;
  }
}
function recordPerfFloorSwitchSample(argPrimary, argSecondary, argTertiary) {
  if (!isPerfDiagnosticsEnabled) {
    return;
  }
  const value = perfStats;
  const left = value.floorSwitch;
  const last = performance.now();
  if (left && last <= left.until) {
    const renderGapMs = last - left.last;
    left.last = last;
    left.frames++;
    if (renderGapMs > left.maxMs) {
      left.worstFrame = {
        renderGapMs,
        cpuRenderMs: argSecondary,
        checksSinceRender: left.checksSinceRender,
        phases: {
          ...left.pendingPhases
        },
        programs: renderer.info.programs?.length,
        geometries: renderer.info.memory.geometries,
        contact: renderCache ? {
          ...renderCache.stats
        } : null
      };
    }
    left.pendingPhases = {};
    left.checksSinceRender = 0;
    left.maxMs = Math.max(left.maxMs, renderGapMs);
    if (renderGapMs > 50) {
      left.longFrames++;
    }
    left.cpuMs += argSecondary;
    left.maxRenderCpuMs = Math.max(left.maxRenderCpuMs || 0, argSecondary);
    if (argSecondary > 50) {
      left.slowRenderCount = (left.slowRenderCount || 0) + 1;
    }
  }
  if (argTertiary) {
    pushBoundedTimingSample(value.cpuRenderTimes, argSecondary);
    if (value.lastMotionRenderAt > 0) {
      const computedValue = argPrimary - value.lastMotionRenderAt;
      if (computedValue >= 2 && computedValue <= 250) {
        pushBoundedTimingSample(value.frameIntervals, computedValue);
      }
    }
    value.lastMotionRenderAt = argPrimary;
  } else {
    value.lastMotionRenderAt = 0;
  }
}
function collectSceneMeshStats() {
  const value = new Set();
  const meshes = {
    before: 0,
    after: 0,
    triangles: 0
  };
  let count = 0;
  let lights = 0;
  let visibleLights = 0;
  let activeSpotShadows = 0;
  previewSceneCurrent?.traverse(light => {
    if (light.isMesh) {
      count += 1;
      if (light.userData.runtimeFurnitureStats) {
        for (const localValue of Object.keys(meshes)) {
          meshes[localValue] += light.userData.runtimeFurnitureStats[localValue];
        }
      }
      const isArrayResult = Array.isArray(light.material) ? light.material : [light.material];
      for (const flag of isArrayResult) {
        if (flag) {
          value.add(flag);
        }
      }
    }
    if (light.isLight) {
      lights += 1;
      if (light.visible !== false && finite(light.intensity, 0) > 0) {
        visibleLights += 1;
      }
      if (light.isSpotLight && light.castShadow && light.visible !== false) {
        activeSpotShadows += 1;
      }
    }
  });
  if (renderer?.domElement?.dataset.spotShadowMode === "atlas") {
    activeSpotShadows = Math.max(activeSpotShadows, Math.floor(finite(renderer.domElement.dataset.activeSpotShadows, 0)));
  }
  const activeUserFixtures = collectVisibleLights().filter(({
    item: lightBrightness,
    group: enabled
  }) => enabled?.enabled !== false && finite(lightBrightness.lightBrightness, 0) > 0).length;
  return {
    meshes: count,
    materials: value.size,
    lights,
    visibleLights,
    activeUserFixtures,
    activeSpotShadows,
    runtimeFurniture: meshes
  };
}
function publishPerfHud(argPrimary = performance.now()) {
  if (!isPerfDiagnosticsEnabled || !renderer || !perfStats.hud) {
    return;
  }
  const frameIntervals = perfStats;
  if (argPrimary - frameIntervals.lastPublishAt < PERF_HUD_PUBLISH_MS) {
    return;
  }
  frameIntervals.lastPublishAt = argPrimary;
  const domElement = renderer.domElement;
  const flag = averagePerfSample(frameIntervals.frameIntervals);
  const sorted = percentileOfSorted(frameIntervals.frameIntervals, 0.5);
  const scene = collectSceneMeshStats();
  const value = renderer.info.programs?.length;
  const frame = {
    enabled: true,
    floorSwitch: frameIntervals.floorSwitch ? {
      target: frameIntervals.floorSwitch.target,
      frames: frameIntervals.floorSwitch.frames,
      maxFrameMs: fitCameraToSelection(frameIntervals.floorSwitch.maxTickMs || 0, 2),
      longFrames: frameIntervals.floorSwitch.tickLongFrames || 0,
      maxRenderGapMs: fitCameraToSelection(frameIntervals.floorSwitch.maxMs, 2),
      maxRenderCpuMs: fitCameraToSelection(frameIntervals.floorSwitch.maxRenderCpuMs || 0, 2),
      slowRenderCount: frameIntervals.floorSwitch.slowRenderCount || 0,
      phases: frameIntervals.floorSwitch.phases,
      worstFrame: frameIntervals.floorSwitch.worstFrame,
      averageCpuMs: fitCameraToSelection(frameIntervals.floorSwitch.cpuMs / Math.max(1, frameIntervals.floorSwitch.frames), 2)
    } : null,
    motionActive: frameIntervals.motionActive,
    frame: {
      samples: frameIntervals.frameIntervals.length,
      averageFps: fitCameraToSelection(flag ? 1000 / flag : null),
      medianFps: fitCameraToSelection(sorted ? 1000 / sorted : null),
      p95Ms: fitCameraToSelection(percentileOfSorted(frameIntervals.frameIntervals, 0.95), 2)
    },
    cpuRenderMs: {
      samples: frameIntervals.cpuRenderTimes.length,
      average: fitCameraToSelection(averagePerfSample(frameIntervals.cpuRenderTimes), 2),
      p95: fitCameraToSelection(percentileOfSorted(frameIntervals.cpuRenderTimes, 0.95), 2)
    },
    gpuRenderMs: {
      supported: !!frameIntervals.gpuExtension,
      status: frameIntervals.gpuStatus,
      samples: frameIntervals.gpuRenderTimes.length,
      average: fitCameraToSelection(averagePerfSample(frameIntervals.gpuRenderTimes), 2),
      p95: fitCameraToSelection(percentileOfSorted(frameIntervals.gpuRenderTimes, 0.95), 2)
    },
    render: {
      calls: Number(domElement.dataset.renderCalls || 0),
      triangles: Number(domElement.dataset.renderTriangles || 0),
      lines: Number(domElement.dataset.renderLines || 0)
    },
    memory: {
      geometries: Number(renderer.info.memory.geometries || 0),
      textures: Number(renderer.info.memory.textures || 0),
      programs: Number.isFinite(value) ? value : null
    },
    scene,
    viewport: {
      devicePixelRatio: fitCameraToSelection(renderer.getPixelRatio(), 2),
      canvasWidth: domElement.width,
      canvasHeight: domElement.height,
      cssWidth: Math.round(domElement.clientWidth),
      cssHeight: Math.round(domElement.clientHeight)
    },
    lighting: {
      adaptiveCacheEnabled: previewQualityReady,
      residentCacheMode,
      cacheReady: lightCacheReady
    }
  };
  const perfFpsSummaryText = frame.frame.samples ? frame.frame.averageFps + " / " + frame.frame.medianFps + " FPS · P95 " + frame.frame.p95Ms + " ms" : "移动镜头后采样";
  const perfGpuSummaryText = frame.gpuRenderMs.samples ? frame.gpuRenderMs.average + " ms · P95 " + frame.gpuRenderMs.p95 + " ms" : frame.gpuRenderMs.status;
  frameIntervals.hud.innerHTML = ["<strong>3D 性能诊断</strong><span>" + (frameIntervals.motionActive ? "交互 / 阻尼中" : "空闲") + "</span>", "<span>帧率</span><b>" + perfFpsSummaryText + "</b>", "<span>CPU 提交</span><b>" + (frame.cpuRenderMs.average ?? "—") + " ms · P95 " + (frame.cpuRenderMs.p95 ?? "—") + " ms</b>", "<span>GPU 渲染</span><b>" + perfGpuSummaryText + "</b>", "<span>绘制</span><b>" + frame.render.calls + " calls · " + frame.render.triangles.toLocaleString() + " tris</b>", "<span>场景</span><b>" + scene.meshes + " mesh · " + scene.materials + " 材质实例</b>", "<span>资源</span><b>" + frame.memory.geometries + " 几何 · " + frame.memory.textures + " 纹理 · " + (frame.memory.programs ?? "—") + " 程序</b>", "<span>灯光</span><b>" + scene.visibleLights + "/" + scene.lights + " 可见 · " + scene.activeUserFixtures + " 用户灯 · " + scene.activeSpotShadows + " 阴影</b>", "<span>画布</span><b>" + frame.viewport.canvasWidth + "×" + frame.viewport.canvasHeight + " · DPR " + frame.viewport.devicePixelRatio + "</b>", "<span>光照缓存</span><b>" + (frame.lighting.adaptiveCacheEnabled ? "自适应" : frame.lighting.residentCacheMode ? "驻留" : "实时") + "</b>"].join("");
  document.documentElement.dataset.performanceDiagnostics = JSON.stringify(frame);
}
function updatePerfMotionState(argPrimary, motionActive) {
  if (isPerfDiagnosticsEnabled) {
    perfStats.motionActive = motionActive;
    if (!motionActive) {
      perfStats.lastMotionRenderAt = 0;
    }
    collectGpuTimingResults();
    publishPerfHud(argPrimary);
  }
}
const LIGHT_CACHE_TILE_MS = 150;
function updateLightPreview() {
  needsRenderFrame = true;
  renderIdle = false;
  demandFrameLoop?.wake();
}
function setPreviewLightCacheVisible(flag) {
  previewLightCache.hidden = !flag;
  if (isStageEmbed && renderer) {
    renderer.domElement.style.opacity = flag ? "0" : "1";
  }
}
function hasPendingModelLoads() {
  const active = manager.modelLoadState();
  return active.active > 0 || active.queued > 0 || modelsLoading || modelLoadStatusTimerCurrent !== null || isSceneRebuildQueued;
}
let Ds = null;
function capturePreviewCanvas(argPrimary, argSecondary, argTertiary) {
  Ds?.cancel();
  const blob = orbitControls;
  const frame = {
    cancelled: false,
    frame: null,
    timer: null,
    idle: null,
    cancel: null
  };
  const imageData = () => !frame.cancelled && argTertiary();
  const callback = () => {
    frame.cancelled = true;
    if (frame.frame !== null) {
      window.cancelAnimationFrame(frame.frame);
    }
    if (frame.timer !== null) {
      window.clearTimeout(frame.timer);
    }
    if (frame.idle !== null) {
      window.cancelIdleCallback?.(frame.idle);
    }
    frame.frame = frame.timer = frame.idle = null;
    window.removeEventListener("pagehide", callback);
    window.removeEventListener("pointerdown", callback, true);
    window.removeEventListener("wheel", callback, true);
    blob?.removeEventListener("start", callback);
    blob?.removeEventListener("change", callback);
    if (argSecondary) {
      argSecondary.width = argSecondary.height = 0;
      argSecondary = null;
    }
    if (Ds === frame) {
      Ds = null;
    }
  };
  frame.cancel = callback;
  Ds = frame;
  const helperFn = argPrimary => window.HABridgeLog?.error(argPrimary, {
    phase: "interaction3d-cache-write"
  });
  const helperFnCurrent = () => {
    frame.idle = null;
    Promise.resolve().then(() => {
      if (imageData()) {
        return cache?.write(argPrimary, argSecondary, imageData);
      }
    }).catch(helperFn).finally(callback);
  };
  try {
    window.addEventListener("pagehide", callback, {
      once: true
    });
    window.addEventListener("pointerdown", callback, {
      capture: true,
      passive: true
    });
    window.addEventListener("wheel", callback, {
      capture: true,
      passive: true
    });
    blob?.addEventListener("start", callback);
    blob?.addEventListener("change", callback);
    frame.frame = window.requestAnimationFrame(() => {
      frame.frame = null;
      if (!imageData()) {
        callback();
        return;
      }
      frame.timer = window.setTimeout(() => {
        frame.timer = null;
        if (!imageData()) {
          callback();
          return;
        }
        try {
          if (typeof window.requestIdleCallback == "function") {
            frame.idle = window.requestIdleCallback(helperFnCurrent);
          } else {
            helperFnCurrent();
          }
        } catch (localValue) {
          callback();
          helperFn(localValue);
        }
      }, 180);
    });
  } catch (localValue) {
    callback();
    helperFn(localValue);
  }
}
async function finishStageSessionWarmup() {
  stageSessionEndTimer = null;
  if (!Vo || cache?.closed || !renderer || stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isCapturingFrame || isStageWarmup || curtainMotionActive || vacuumMotionActive || rs) {
    return;
  }
  if (hasPendingModelLoads() || shadowAtlas?.isBuilding() || shadowAtlas?.isPending()) {
    scheduleAdaptiveQuality(120);
    return;
  }
  const domElement = renderer.domElement;
  const width = domElement.width;
  const height = domElement.height;
  if (!width || !height) {
    return;
  }
  const value = lightCacheEpoch;
  const onComplete = () => Vo && !cache?.closed && !hasPendingModelLoads() && value === lightCacheEpoch && !stageSession && !previewOrbitLocked && !isLeavingStudio && !isCapturingFrame && !isStageWarmup && !curtainMotionActive && !vacuumMotionActive && !rs;
  isBakingLightCache = true;
  let rect;
  let flag = null;
  let el;
  let flagCurrent = false;
  try {
    const entry = collectVisibleLights();
    const sha = sha256(stableCacheJSON({
      kind: "settled-rgba-v1",
      base: computeLightRenderCacheKey(width, height),
      lights: entry.map(({
        item,
        itemKey: key,
        group
      }) => ({
        key,
        enabled: group?.enabled !== false,
        brightness: item.lightBrightness,
        temperature: item.lightTemperature
      }))
    }));
    el = sha;
    rect = await cache?.acquire(sha, width, height, onComplete);
    if (!onComplete()) {
      return;
    }
    if (!rect) {
      const worldItemsCached = ensureWorldItemsCached(entry);
      syncLightGroupVisibility(worldItemsCached);
      syncOrbitControls();
      renderer.render(previewSceneCurrent, cameraCurrent);
      rect = document.createElement("canvas");
      flag = rect;
      rect.width = width;
      rect.height = height;
      const isDrawImage = rect.getContext("2d");
      if (!isDrawImage) {
        throw new Error("当前浏览器无法创建静止画面缓存。");
      }
      isDrawImage.drawImage(domElement, 0, 0);
    }
    if (!onComplete()) {
      return;
    }
    const clearRect = previewLightCache.getContext("2d");
    if (!clearRect) {
      throw new Error("当前浏览器无法创建静止画面缓存。");
    }
    previewLightCache.width = width;
    previewLightCache.height = height;
    clearRect.clearRect(0, 0, width, height);
    clearRect.drawImage(rect.image || rect, 0, 0);
    map.clear();
    pendingModelLoads.clear();
    lightCacheReady = true;
    previewQualityJustBecameReady = false;
    domElement.dataset.lightCachePixels = String(width * height);
    domElement.dataset.lightCacheRetainedGroups = "complete-frame";
    setPreviewLightCacheVisible(true);
    if (flag) {
      capturePreviewCanvas(el, flag, onComplete);
      flag = null;
    }
  } catch (error) {
    flagCurrent = true;
    setPreviewLightCacheVisible(false);
    window.HABridgeLog?.error(error, {
      phase: "interaction3d-settled-cache"
    });
  } finally {
    try {
      rect?.close?.();
      if (flag) {
        flag.width = flag.height = 0;
      }
    } finally {
      isBakingLightCache = false;
    }
    if (previewQualityJustBecameReady && (!flagCurrent || value !== lightCacheEpoch)) {
      scheduleAdaptiveQuality(420);
    }
  }
}
function blitLightCacheToOverlay() {
  if (!lightCacheReady || previewLightCache.hidden) {
    return;
  }
  const isClearRect = previewLightCache.getContext("2d");
  if (isClearRect) {
    isClearRect.clearRect(0, 0, previewLightCache.width, previewLightCache.height);
    for (const [value, tileCanvas] of map) {
      const clampCurrent = clamp(finite(pendingModelLoads.get(value), 0), 0, 1);
      if (!(clampCurrent <= 0.001)) {
        isClearRect.save();
        isClearRect.globalAlpha = clampCurrent;
        isClearRect.drawImage(tileCanvas, 0, 0);
        isClearRect.restore();
      }
    }
  }
}
function scheduleLightCacheForGroups(argPrimary, cacheDurationMs = LIGHT_CACHE_TILE_MS) {
  const value = [...new Set(argPrimary)].filter(Boolean);
  if (!value.length) {
    return;
  }
  const flag = value.map(argPrimary => ({
    groupId: previewScopedItemKey(activeFloorId, argPrimary),
    from: clamp(finite(pendingModelLoads.get(previewScopedItemKey(activeFloorId, argPrimary)), findLightGroupById(argPrimary)?.enabled === false ? 0 : 1), 0, 1),
    to: findLightGroupById(argPrimary)?.enabled === false ? 0 : 1
  }));
  cancelAnimationFrame(recentFrameMsSamples);
  if (!lightCacheReady) {
    for (const groupId of flag) {
      pendingModelLoads.set(groupId.groupId, groupId.to);
    }
    if (!isBakingLightCache) {
      scheduleAdaptiveQuality(0);
    }
    return;
  }
  const list = performance.now();
  const nowResult = argPrimary => {
    const clampedValue = clamp((argPrimary - list) / cacheDurationMs, 0, 1);
    const computedValue = clampedValue * clampedValue * (3 - clampedValue * 2);
    for (const from of flag) {
      pendingModelLoads.set(from.groupId, from.from + (from.to - from.from) * computedValue);
    }
    blitLightCacheToOverlay();
    if (clampedValue < 1) {
      recentFrameMsSamples = requestAnimationFrame(nowResult);
    } else {
      recentFrameMsSamples = 0;
    }
  };
  recentFrameMsSamples = requestAnimationFrame(nowResult);
}
function findLightGroupById(argPrimary) {
  return floorSceneCurrent.lightGroups?.find(item => item.id === argPrimary) || null;
}
function warmLightCacheMeshesForGroups(argPrimary, cacheDurationMs = LIGHT_CACHE_TILE_MS) {
  if (!worldGroup) {
    return false;
  }
  const value = new Set(argPrimary);
  const canWarmLightCache = isPreviewQualityReady() && !stageSession;
  const warmCacheMeshList = [];
  worldGroup.traverse(userData => {
    if (!userData.isLight || !value.has(userData.userData?.lightGroupId)) {
      return;
    }
    const to = findLightGroupById(userData.userData.lightGroupId)?.enabled !== false && !canWarmLightCache ? finite(userData.userData.lightOnIntensity, 0) : 0;
    if (to > 0) {
      userData.visible = true;
    }
    warmCacheMeshList.push({
      object: userData,
      from: finite(userData.intensity, 0),
      to: to
    });
  });
  if (!warmCacheMeshList.length) {
    return false;
  }
  if (warmCacheMeshList.some(({
    to: argPrimary
  }) => argPrimary > 0)) {
    syncSpotShadowCastingLights(worldGroup, {
      rebuildAtlas: false
    });
  }
  cancelAnimationFrame(is);
  const flag = performance.now();
  const helperFn = argPrimary => {
    const clampedValue = clamp((argPrimary - flag) / cacheDurationMs, 0, 1);
    const computedValue = clampedValue * clampedValue * (3 - clampedValue * 2);
    for (const from of warmCacheMeshList) {
      from.object.intensity = from.from + (from.to - from.from) * computedValue;
    }
    updateLightPreview();
    if (clampedValue < 1) {
      is = requestAnimationFrame(helperFn);
    } else {
      is = 0;
      let boolFlag = false;
      for (const to of warmCacheMeshList) {
        if (!(to.to > 0)) {
          to.object.visible = false;
          boolFlag = true;
        }
      }
      if (boolFlag) {
        syncSpotShadowCastingLights(worldGroup, {
          rebuildAtlas: false
        });
      }
    }
  };
  is = requestAnimationFrame(helperFn);
  return true;
}
function requestLightGroupCacheRefresh(argPrimary) {
  const filtered = [...new Set(argPrimary)].filter(Boolean);
  if (isPreviewQualityReady() && !stageSession) {
    scheduleLightCacheForGroups(filtered);
  } else if (!warmLightCacheMeshesForGroups(filtered)) {
    rebuildPreviewMeshes({
      scope: "lights",
      preserveLightCache: true
    });
  }
  renderLightLayerPanel();
  updateSelectionInspector();
  drawPlan();
  syncOrbitControls();
  scheduleOrbitInteractionWarmup();
}
function requestRender(floor = {}) {
  if (isStageEmbed && (floor.scene === true || floor.shadows === true)) {
    planCanvas++;
  }
  needsRenderFrame = true;
  renderIdle = false;
  demandFrameLoop?.wake();
  if (isStageEmbed && (floor.scene === true || floor.shadows === true)) {
    cacheObjectTransforms(previewSceneCurrent, THREE.Object3D);
  }
  if (floor.shadows === true) {
    previewSceneCurrent?.traverse(shadow => {
      if (shadow.isLight && shadow.castShadow && shadow.shadow) {
        shadow.shadow.needsUpdate = true;
      }
    });
  }
  if (!isRebuildingWorld) {
    if (floor.preserveLightCache === true && isPreviewQualityReady() && !stageSession) {
      if (!lightCacheReady && !isBakingLightCache) {
        scheduleAdaptiveQuality();
      }
      return;
    }
    if (isPreviewQualityReady() && !stageSession) {
      lightCacheEpoch += 1;
      previewQualityJustBecameReady = true;
      if (isStageEmbed || floor.scene === true || !lightCacheReady) {
        setPreviewLightCacheVisible(false);
      }
      scheduleAdaptiveQuality();
      syncOrbitControls();
    } else {
      window.clearTimeout(stageSessionEndTimer);
      stageSessionEndTimer = null;
      lightCacheReady = false;
      previewQualityJustBecameReady = false;
      setPreviewLightCacheVisible(false);
    }
  }
}
function rebuildWorldPreserveLights() {
  isRebuildingWorld = true;
  try {
    if (getPreviewFloorModeCurrent() === "all") {
      rebuildWorldPreviewCurrent({
        preserveLightCache: true
      });
    } else {
      rebuildPreviewLightMeshesCurrent({
        preserveLightCache: true
      });
    }
  } finally {
    isRebuildingWorld = false;
  }
}
function collectWorldItemKeys() {
  const lookupMap = new Map();
  worldGroup?.traverse(object3d => {
    const argPrimary = object3d.userData?.lightItemId;
    if (!object3d.isLight || !argPrimary) {
      return;
    }
    const value = layerScopedKey(object3d.userData?.lightFloorId, argPrimary);
    if (!lookupMap.has(value)) {
      lookupMap.set(value, []);
    }
    lookupMap.get(value).push(object3d);
  });
  return lookupMap;
}
function ensureWorldItemsCached(entry) {
  let hasVar = collectWorldItemKeys();
  if (entry.every(itemKey => hasVar.has(itemKey.itemKey))) {
    return hasVar;
  }
  if (isStageEmbed) {
    return runWithResidentFloorCache(entry, hasVar);
  }
  residentCacheMode = true;
  forcedVisibleLightGroupIds = new Set();
  try {
    rebuildWorldPreserveLights();
  } finally {
    forcedVisibleLightGroupIds = null;
    residentCacheMode = false;
  }
  hasVar = collectWorldItemKeys();
  return hasVar;
}
function runWithResidentFloorCache(argPrimary, has) {
  const localValue = floorSceneCurrent;
  const localValueCurrent = activeFloorId;
  const localValueNext = residentCacheMode;
  const comparisonFlag = getPreviewFloorModeCurrent() === "all";
  try {
    residentCacheMode = true;
    for (const {
      floor: id,
      item: x28,
      itemKey: localValue
    } of argPrimary) {
      if (has.has(localValue) || !comparisonFlag && id.id !== localValueCurrent) {
        continue;
      }
      const addedObject = comparisonFlag ? worldGroup?.children.find(userData => userData.userData?.floorId === id.id) : worldGroup;
      if (!addedObject) {
        continue;
      }
      floorSceneCurrent = id.scene;
      activeFloorId = id.id;
      const pixelsPerMeterValue = pixelsPerMeter();
      if (!pixelsPerMeterValue) {
        continue;
      }
      const minX = getPreviewFloorMode();
      const conditionalValue = comparisonFlag ? finite(id.originX, 0) : (minX.minX + minX.maxX) / 2;
      const conditionalValueCurrent = comparisonFlag ? finite(id.originY, 0) : (minX.minY + minX.maxY) / 2;
      const userData = new THREE.Group();
      buildWallCornerCaps(userData, x28, shadowCastingLightIdSet());
      userData.position.set((x28.x - conditionalValue) / pixelsPerMeterValue, x28.elevation || 0, (x28.y - conditionalValueCurrent) / pixelsPerMeterValue);
      instanceMergeIdenticalItems(userData, x28);
      userData.userData.modelLayer = "lights";
      userData.userData.exportRole = "plan";
      addedObject.add(userData);
      if (isStageEmbed) {
        cacheObjectTransforms(userData, THREE.Object3D);
      }
      const push = [];
      userData.traverse(isLight => {
        if (isLight.isLight) {
          push.push(isLight);
        }
      });
      if (push.length) {
        has.set(localValue, push);
      }
    }
  } finally {
    floorSceneCurrent = localValue;
    activeFloorId = localValueCurrent;
    residentCacheMode = localValueNext;
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: false
  });
  return has;
}
function setGroupVisibilityByKey(argPrimary, argSecondary = "") {
  for (const [localValue, localValueCurrent] of argPrimary) {
    const visible = localValue === argSecondary;
    for (const shadow of localValueCurrent) {
      shadow.visible = visible;
      shadow.intensity = visible ? finite(shadow.userData?.lightOnIntensity, 0) : 0;
      if (shadow.isSpotLight) {
        shadow.castShadow = visible;
        if (visible && shadow.shadow && !shadow.shadow.map) {
          shadow.shadow.needsUpdate = true;
        }
      }
    }
  }
  updateLightPreview();
}
function enabledVisibleLightKeys() {
  return new Set(collectVisibleLights().filter(({
    item,
    group
  }) => group?.enabled !== false && finite(item.lightBrightness, 0) > 0).map(({
    itemKey
  }) => itemKey));
}
function syncLightGroupVisibility(argPrimary) {
  const value = enabledVisibleLightKeys();
  for (const [groupKey, lights] of argPrimary) {
    const flag = value.has(groupKey);
    for (const light of lights) {
      light.visible = flag;
      light.intensity = flag ? finite(light.userData?.lightOnIntensity, 0) : 0;
      if (light.isSpotLight) {
        light.castShadow = false;
      }
    }
  }
  updateLightPreview();
}
function syncPreviewRenderShield() {
  if (!previewRenderShield || !renderer?.domElement) {
    return;
  }
  const domElement = renderer.domElement;
  if (!domElement.width || !domElement.height) {
    return;
  }
  if (isStageEmbed) {
    window.clearTimeout(cameraViewDebounceTimer);
    cameraViewDebounceTimer = null;
    previewRenderShield.style.transition = "none";
    previewRenderShield.style.opacity = "1";
  }
  previewRenderShield.width = domElement.width;
  previewRenderShield.height = domElement.height;
  const canvasCtx = previewRenderShield.getContext("2d");
  if (canvasCtx) {
    canvasCtx.globalCompositeOperation = "source-over";
    canvasCtx.globalAlpha = 1;
    canvasCtx.fillStyle = "#" + resolvedThemeColors().background.toString(16).padStart(6, "0");
    canvasCtx.fillRect(0, 0, previewRenderShield.width, previewRenderShield.height);
    if (isStageEmbed) {
      renderer.render(previewSceneCurrent, cameraCurrent);
    }
    canvasCtx.drawImage(domElement, 0, 0);
    if (!previewLightCache.hidden) {
      if (isStageEmbed) {
        canvasCtx.drawImage(previewLightCache, 0, 0, previewRenderShield.width, previewRenderShield.height);
      } else {
        canvasCtx.drawImage(previewLightCache, 0, 0);
      }
    }
    previewRenderShield.hidden = false;
  }
}
function showPreviewRenderShield({
  smooth: flag = false
} = {}) {
  if (previewRenderShield) {
    if (isStageEmbed) {
      window.clearTimeout(cameraViewDebounceTimer);
      cameraViewDebounceTimer = null;
      if (flag && !previewRenderShield.hidden) {
        previewRenderShield.style.transition = "opacity 180ms ease-out";
        previewRenderShield.style.opacity = "0";
        cameraViewDebounceTimer = window.setTimeout(() => {
          cameraViewDebounceTimer = null;
          previewRenderShield.hidden = true;
          previewRenderShield.style.transition = "none";
          previewRenderShield.style.opacity = "1";
        }, 180);
        return;
      }
      previewRenderShield.style.transition = "none";
      previewRenderShield.style.opacity = "1";
    }
    previewRenderShield.hidden = true;
  }
}
function waitTwoAnimationFrames() {
  syncPreviewRenderShield();
  return new Promise(argPrimary => requestAnimationFrame(() => requestAnimationFrame(argPrimary)));
}
function createOffscreenCanvas(flag, height) {
  const value = document.createElement("canvas");
  value.width = flag;
  value.height = height;
  const drawImage = value.getContext("2d", {
    willReadFrequently: true
  });
  if (!drawImage) {
    throw new Error("当前浏览器无法创建多灯缓存画布。");
  }
  drawImage.drawImage(renderer.domElement, 0, 0, flag, height);
  return drawImage.getImageData(0, 0, flag, height);
}
function warmPreviewRenderer() {
  for (let value = 0; value < 3; value += 1) {
    renderer.render(previewSceneCurrent, cameraCurrent);
  }
}
function yieldToScheduler() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else {
    return new Promise(argPrimary => requestAnimationFrame(() => argPrimary()));
  }
}
function yieldToIdle() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else if (globalThis.requestIdleCallback) {
    return new Promise(argPrimary => requestIdleCallback(() => argPrimary(), {
      timeout: 80
    }));
  } else {
    return new Promise(argPrimary => requestAnimationFrame(() => argPrimary()));
  }
}
function scheduleAdaptiveQuality(numericParam = 420) {
  if ((!isStageEmbed || !!Vo) && (!isStageEmbed || !cache?.closed) && !!renderer && !!worldGroup && !stageSession && !previewOrbitLocked && !isLeavingStudio && !isBakingLightCache && !isCapturingFrame && !isStageWarmup && !!isPreviewQualityReady()) {
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = window.setTimeout(() => {
      const active = manager.modelLoadState();
      if (active.active > 0 || active.queued > 0) {
        stageSessionEndTimer = null;
        scheduleAdaptiveQuality(240);
        return;
      }
      endStageSession();
    }, numericParam);
  }
}
function markPreviewQualityDirty() {
  if (!!isPreviewQualityReady() && !stageSession && !isBakingLightCache) {
    previewQualityJustBecameReady = true;
    scheduleAdaptiveQuality(0);
    syncOrbitControls();
  }
}
async function endStageSession() {
  if (isStageEmbed) {
    return finishStageSessionWarmup();
  }
  stageSessionEndTimer = null;
  if (!renderer || stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isCapturingFrame || isStageWarmup || !isPreviewQualityReady()) {
    return;
  }
  const value = lightCacheEpoch;
  const entry = collectVisibleLights().filter(({
    item,
    group
  }) => finite(item.lightBrightness, 0) > 0);
  const domElement = renderer.domElement;
  let width = domElement.width;
  let height = domElement.height;
  if (!width || !height || !entry.length) {
    return;
  }
  isBakingLightCache = true;
  previewQualityJustBecameReady = true;
  const enabled = orbitControls.enabled;
  const lookupMap = new Map();
  let flag = false;
  syncOrbitControls();
  try {
    const isClearRect = previewLightCache.getContext("2d");
    if (!isClearRect) {
      throw new Error("当前浏览器无法显示多灯缓存。");
    }
    if (previewLightCache.hidden || !lightCacheReady || previewLightCache.width !== width || previewLightCache.height !== height) {
      previewLightCache.width = width;
      previewLightCache.height = height;
      isClearRect.clearRect(0, 0, width, height);
    }
    const el = document.createElement("canvas");
    el.width = width;
    el.height = height;
    const context = el.getContext("2d");
    const rect = document.createElement("canvas");
    rect.width = width;
    rect.height = height;
    const isClearRectCurrent = rect.getContext("2d");
    if (!context || !isClearRectCurrent) {
      throw new Error("当前浏览器无法合成多灯缓存。");
    }
    const mapCurrent = new Map();
    const worldItemsCached = ensureWorldItemsCached(entry);
    await waitTwoAnimationFrames();
    if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
      return;
    }
    setGroupVisibilityByKey(worldItemsCached);
    context.clearRect(0, 0, width, height);
    worldGroup.traverse(object3d => {
      if (object3d.userData?.exportRole === "grid") {
        lookupMap.set(object3d, object3d.visible);
        object3d.visible = false;
      }
    });
    let isData;
    for (const entryCurrent of entry) {
      await yieldToIdle();
      if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
        break;
      }
      const {
        item,
        group,
        itemKey,
        groupKey
      } = entryCurrent;
      isClearRectCurrent.clearRect(0, 0, width, height);
      {
        if (!isData) {
          setGroupVisibilityByKey(worldItemsCached);
          warmPreviewRenderer();
          isData = createOffscreenCanvas(width, height);
        }
        setGroupVisibilityByKey(worldItemsCached, itemKey);
        warmPreviewRenderer();
        const offscreenCanvas = createOffscreenCanvas(width, height);
        const pixels = buildLightDeltaPixels(isData.data, offscreenCanvas.data);
        isClearRectCurrent.putImageData(new ImageData(pixels, width, height), 0, 0);
      }
      context.drawImage(rect, 0, 0);
      let object3d = mapCurrent.get(groupKey);
      if (!object3d) {
        object3d = document.createElement("canvas");
        object3d.width = width;
        object3d.height = height;
        object3d.userData = {
          enabled: group?.enabled !== false
        };
        mapCurrent.set(groupKey, object3d);
      }
      object3d.getContext("2d")?.drawImage(rect, 0, 0);
      await yieldToScheduler();
      if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
        break;
      }
    }
    if (value === lightCacheEpoch && !stageSession && isPreviewQualityReady()) {
      map = mapCurrent;
      for (const [tileKey, object3d] of mapCurrent) {
        pendingModelLoads.set(tileKey, object3d.userData?.enabled === false ? 0 : 1);
      }
      lightCacheReady = true;
      previewQualityJustBecameReady = false;
      setPreviewLightCacheVisible(true);
      blitLightCacheToOverlay();
      flag = true;
    }
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-light-cache"
    });
    console.error(error);
    lightCacheReady = !previewLightCache.hidden;
  } finally {
    for (const [object3d, wasVisible] of lookupMap) {
      object3d.visible = wasVisible;
    }
    const worldItemKeys = collectWorldItemKeys();
    if (isCapturingFrame) {
      isCapturingFrame.restore();
    } else if (previewOrbitLocked) {
      syncLightGroupVisibility(worldItemKeys);
    } else {
      setGroupVisibilityByKey(worldItemKeys);
    }
    warmPreviewRenderer();
    if (flag) {
      requestAnimationFrame(() => showPreviewRenderShield());
    } else {
      showPreviewRenderShield();
    }
    orbitControls.enabled = enabled;
    isBakingLightCache = false;
    syncOrbitControls();
    if (previewQualityJustBecameReady && isPreviewQualityReady() && !stageSession) {
      scheduleAdaptiveQuality();
    }
  }
}
function markLeavingStudio() {
  window.clearTimeout(leaveStudioTimer);
  leaveStudioTimer = null;
  isLeavingStudio = true;
  window.clearTimeout(stageSessionEndTimer);
  stageSessionEndTimer = null;
  if (isBakingLightCache) {
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
  }
}
function scheduleLeaveStudio() {
  window.clearTimeout(leaveStudioTimer);
  leaveStudioTimer = window.setTimeout(() => {
    leaveStudioTimer = null;
    isLeavingStudio = false;
    if (pendingRebuildReasons.size && !isSceneRebuildQueued) {
      const list = [...pendingRebuildReasons];
      const scope = list.includes("all") || list.length > 1 ? "all" : list[0];
      rebuildPreviewMeshes({
        scope,
        preserveLightCache: !Ka
      });
    }
    if (previewQualityJustBecameReady) {
      scheduleAdaptiveQuality(420);
    }
    if (modelsLoading) {
      requestModelRender();
    }
  }, 120);
}
function setPreviewPixelRatio(argPrimary, {
  preserveLightCache: preserveLightCache = false
} = {}) {
  if (!renderer || stageSession && !isAutoDiagramEmbedCurrent) {
    return;
  }
  const value = stageSession ? stageEmbedPixelRatio(argPrimary) : computeStudioPixelRatio(argPrimary);
  if (Math.abs(renderer.getPixelRatio() - value) > 0.000001) {
    renderer.setPixelRatio(value);
  }
  requestRender({
    preserveLightCache: preserveLightCache
  });
}
function lockPreviewOrbit() {
  window.clearTimeout(orbitResumeTimerCurrent);
  orbitResumeTimerCurrent = null;
  previewOrbitLocked = true;
  orbitSoftSuspend = false;
  recentFrameMsSamplesCurrent = [];
  qualityProbeStartMs = 0;
  syncOrbitControls();
}
function softLockPreviewOrbit() {
  if (!orbitSoftSuspend) {
    orbitSoftSuspend = true;
    syncOrbitControls();
    setPreviewPixelRatio(true, {
      preserveLightCache: true
    });
  }
}
function unlockPreviewOrbit() {
  const flag = orbitSoftSuspend;
  checkAdaptiveQuality();
  previewOrbitLocked = false;
  orbitSoftSuspend = false;
  qualityProbeStartMs = 0;
  syncOrbitControls();
  window.clearTimeout(orbitResumeTimerCurrent);
  if (!flag) {
    if (stageSession && !orbitSuspended) {
      openExportPresetEditor();
    }
    return;
  }
  orbitResumeTimerCurrent = window.setTimeout(() => {
    orbitResumeTimerCurrent = null;
    setPreviewPixelRatio(false, {
      preserveLightCache: true
    });
  }, 140);
  if (stageSession && !orbitSuspended) {
    openExportPresetEditor();
  }
}
function syncFloorCameraChrome() {
  const flag = (projectDocCurrent?.floors.length || 0) > 1;
  const value = getPreviewFloorModeCurrent() === "all";
  cg.hidden = value;
  dg.hidden = !flag || !value;
  hg.hidden = !flag || !value;
  syncControlValue(previewFloorGapInput, finite(projectDocCurrent?.previewFloorGap, 3).toFixed(1));
  const flagCurrent = !!floorSceneCurrent.settings?.fixedCameraView;
  const flagNext = !!projectDocCurrent?.combinedFixedCameraView;
  fixedCameraView.disabled = !flagCurrent;
  fixedCameraView.classList.toggle("has-saved-view", flagCurrent);
  fixedOverviewView.disabled = !flagNext;
  fixedOverviewView.classList.toggle("has-saved-view", flagNext);
  const flagPrevious = value ? flagNext : flagCurrent;
  exportSaveView.textContent = value ? "保存总览" : "保存视角";
  exportSaveView.title = value ? "记录当前导图的全楼角度和投影方式" : "记录当前导图的角度、缩放和投影方式";
  selectEl("#export-use-fixed").textContent = value ? "恢复总览" : "恢复视角";
  selectEl("#export-use-fixed").title = value ? "恢复已保存的全楼总览视角" : "恢复当前楼层已保存的视角";
  selectEl("#export-use-fixed").disabled = !!orbitSuspended || !flagPrevious;
  selectEl("#export-use-fixed").classList.toggle("has-saved-view", flagPrevious);
}
function activeFixedCameraView() {
  if (getPreviewFloorModeCurrent() === "all") {
    return projectDocCurrent?.combinedFixedCameraView;
  } else {
    return floorSceneCurrent.settings?.fixedCameraView;
  }
}
function setActiveFixedCameraView(argPrimary) {
  if (getPreviewFloorModeCurrent() === "all") {
    projectDocCurrent.combinedFixedCameraView = argPrimary;
  } else {
    floorSceneCurrent.settings.fixedCameraView = argPrimary;
  }
}
function createOrbitControls(view) {
  const el = new OrbitControls(view, renderer.domElement);
  el.enableDamping = true;
  el.rotateSmoothing = 8;
  el.rotateSmoothingThreshold = 0.000001;
  el.dampingFactor = 0.22;
  el.minDistance = 2;
  el.maxDistance = 100;
  el.minZoom = 0.35;
  el.maxZoom = 6;
  el.maxPolarAngle = Math.PI * 0.49;
  el.target.set(0, 0.6, 0);
  el.addEventListener("start", lockPreviewOrbit);
  el.addEventListener("change", () => {
    getCameraPose(view, el.target);
    if (previewOrbitLocked) {
      softLockPreviewOrbit();
      requestRender({
        preserveLightCache: true
      });
    } else {
      requestRender();
    }
  });
  el.addEventListener("change", () => {
    if (!stageSession || orbitSuspended) {
      return;
    }
    const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, projectDocCurrent?.exportPresets?.length);
    if (!exportPresetEditorOpenCurrent && !projectDocCurrent?.exportPresets?.[slot]) {
      exportPresetEditorOpenCurrent = true;
      normalizeProjectExportPresets();
    }
  });
  el.addEventListener("end", unlockPreviewOrbit);
  return el;
}
const am = 0.02;
const sm = 0.32;
const lm = 0.006;
function getCameraPose(isPerspectiveCamera = cameraCurrent, argSecondary = orbitControls?.target) {
  if (!isPerspectiveCamera || !argSecondary) {
    return false;
  }
  const localValue = Math.max(isPerspectiveCamera.position.distanceTo(argSecondary), 1);
  const near = isPerspectiveCamera.isPerspectiveCamera ? clamp(localValue * lm, am, sm) : 0.02;
  const far = Math.max(localValue * (isPerspectiveCamera.isPerspectiveCamera ? 8 : 5), 100);
  if (Math.abs(isPerspectiveCamera.near - near) < 0.000001 && Math.abs(isPerspectiveCamera.far - far) < 0.0001) {
    return false;
  } else {
    isPerspectiveCamera.near = near;
    isPerspectiveCamera.far = far;
    isPerspectiveCamera.updateProjectionMatrix();
    return true;
  }
}
function resetOrbitTarget(argPrimary, argSecondary) {
  if (argPrimary?.isOrthographicCamera) {
    return Math.abs(argPrimary.top - argPrimary.bottom) / Math.max(argPrimary.zoom || 1, 0.000001);
  }
  if (argPrimary?.isPerspectiveCamera) {
    const localValue = Math.max(argPrimary.position.distanceTo(argSecondary), 0.0001);
    const rad = THREE.MathUtils.degToRad(argPrimary.getEffectiveFOV());
    return localValue * 2 * Math.tan(rad / 2);
  }
  return 10;
}
async function saveCurrentCameraView() {
  if (!cameraCurrent || !orbitControls) {
    return;
  }
  const value = getPreviewFloorModeCurrent() === "all" ? "总览视角" : "当前层视角";
  if (!stageSession) {
    pushHistory();
  }
  const point = orbitControls.target;
  setActiveFixedCameraView({
    mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
    view: cameraViewMode(),
    topRotation: topViewRotation(),
    position: {
      x: cameraCurrent.position.x,
      y: cameraCurrent.position.y,
      z: cameraCurrent.position.z
    },
    target: {
      x: point.x,
      y: point.y,
      z: point.z
    },
    visibleHeight: resetOrbitTarget(cameraCurrent, point),
    fov: cameraCurrent.isPerspectiveCamera ? cameraCurrent.fov : 36,
    focalLength: cameraCurrent.isPerspectiveCamera ? getCameraFocalLength() : null
  });
  syncFloorCameraChrome();
  if (stageSession) {
    exportStatus.textContent = value + "已保存";
    await flushSave();
    showToast(value + "已保存。");
    return;
  }
  scheduleSave();
  window.clearTimeout(saveTimer);
  saveTimer = null;
  await flushSave();
  showToast(saveGeneration === savedGeneration ? value + "已保存。" : value + "已记录，正在保存…");
}
function restoreFixedCameraView(recordChange = {}) {
  const isMode = activeFixedCameraView();
  if (!isMode || !cameraCurrent || !orbitControls) {
    return;
  }
  const flag = isMode.mode !== getCameraProjectionMode();
  const flagCurrent = isMode.view !== cameraViewMode();
  const flagNext = isMode.topRotation !== topViewRotation();
  const flagPrevious = isMode.focalLength !== null && Math.abs(isMode.focalLength - getCameraFocalLength()) > 1e-8;
  const flagLocal = recordChange.recordChange !== false;
  if ((flag || flagCurrent || flagNext || flagPrevious) && flagLocal) {
    pushHistory();
  }
  const value = activeCameraSettings();
  value.cameraMode = isMode.mode;
  value.cameraView = isMode.view;
  value.cameraTopRotation = isMode.topRotation;
  if (isMode.focalLength !== null) {
    value.cameraFocalLength = isMode.focalLength;
  }
  setCameraProjectionMode(isMode.mode, {
    preserveView: false
  });
  const vector = new THREE.Vector3(isMode.target.x, isMode.target.y, isMode.target.z);
  cameraCurrent.position.set(isMode.position.x, isMode.position.y, isMode.position.z);
  cameraCurrent.up.copy(isMode.view === "top" ? topViewForwardVector(isMode.topRotation) : new THREE.Vector3(0, 1, 0));
  cameraCurrent.userData.frameSize = isMode.visibleHeight;
  cameraCurrent.userData.cameraView = isMode.view;
  cameraCurrent.userData.topRotation = isMode.topRotation;
  cameraCurrent.userData.viewportAspect ||= Math.max(selectEl("#preview-3d").clientWidth / Math.max(selectEl("#preview-3d").clientHeight, 1), 0.1);
  cameraCurrent.zoom = 1;
  if (cameraCurrent.isPerspectiveCamera) {
    cameraCurrent.aspect = cameraCurrent.userData.viewportAspect;
    if (isMode.focalLength !== null) {
      applyCameraFocalLength(cameraCurrent, isMode.focalLength);
    } else {
      cameraCurrent.fov = isMode.fov;
      cameraCurrent.updateProjectionMatrix();
      value.cameraFocalLength = clamp(cameraCurrent.getFocalLength(), 18, 120);
    }
  } else {
    focusCameraOnPoint(isMode.visibleHeight, cameraCurrent.userData.viewportAspect, cameraCurrent);
  }
  getCameraPose(cameraCurrent, vector);
  cameraCurrent.lookAt(vector);
  cameraCurrent.updateProjectionMatrix();
  orbitControls.target.copy(vector);
  syncOrbitControls();
  orbitControls.update();
  syncCameraModeButtons(isMode.mode);
  syncCameraViewButtons(isMode.view);
  if ((flag || flagCurrent || flagNext || flagPrevious) && flagLocal) {
    scheduleSave();
  }
  if (!recordChange.silent) {
    const previewFloorMode = getPreviewFloorModeCurrent() === "all" ? "总览视角" : "当前层视角";
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function nudgeCamera(argPrimary, preserveView = {}) {
  const value = argPrimary === "top" ? "top" : "free";
  const topRotation = topViewRotation();
  syncCameraViewButtons(value);
  if (!cameraCurrent || !orbitControls) {
    return;
  }
  if (cameraCurrent.userData.cameraView === value && (value !== "top" || cameraCurrent.userData.topRotation === topRotation) && preserveView.force !== true) {
    syncOrbitControls();
    return;
  }
  if (value === "free") {
    applyCameraViewCurrent({
      view: "free"
    });
    return;
  }
  const x45 = orbitControls.target.clone();
  const vector = resetOrbitTarget(cameraCurrent, x45);
  const list = Math.max(cameraCurrent.position.distanceTo(x45), 8);
  cameraCurrent.up.copy(topViewForwardVector(topRotation));
  if (cameraCurrent.isPerspectiveCamera) {
    applyCameraFocalLength();
    const localValue = THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV());
    const max = Math.max(vector / (Math.tan(localValue / 2) * 2), 8);
    cameraCurrent.position.set(x45.x, x45.y + max, x45.z);
  } else {
    focusCameraOnPoint(vector, cameraCurrent.userData.viewportAspect || 1, cameraCurrent);
    cameraCurrent.position.set(x45.x, x45.y + list, x45.z);
  }
  cameraCurrent.userData.frameSize = vector;
  cameraCurrent.userData.cameraView = "top";
  cameraCurrent.userData.topRotation = topRotation;
  getCameraPose(cameraCurrent, x45);
  cameraCurrent.lookAt(x45);
  cameraCurrent.updateProjectionMatrix();
  orbitControls.target.copy(x45);
  syncOrbitControls();
  orbitControls.update();
}
function setCameraProjectionMode(view, viewportAspect = {}) {
  const conditionalValue = view === "perspective" ? "perspective" : "orthographic";
  syncCameraModeButtons(conditionalValue);
  if (!renderer) {
    return;
  }
  if (conditionalValue === "perspective" == !!cameraCurrent?.isPerspectiveCamera) {
    applyCameraFocalLength();
    syncOrbitControls();
    return;
  }
  const comparisonFlag = viewportAspect.preserveView !== false;
  const userData = cameraCurrent;
  const computedValue = orbitControls?.target.clone() || new THREE.Vector3(0, 0.6, 0);
  const length = userData ? userData.position.clone().sub(computedValue) : new THREE.Vector3(1.12, 1.42, 1.2);
  const localValue = Math.max(length.length(), 2);
  const normalize = length.lengthSq() > 1e-8 ? length.normalize() : new THREE.Vector3(1.12, 1.42, 1.2).normalize();
  const max = userData?.userData.viewportAspect || Math.max(selectEl("#preview-3d").clientWidth / Math.max(selectEl("#preview-3d").clientHeight, 1), 0.1);
  const frameSize = comparisonFlag && userData ? resetOrbitTarget(userData, computedValue) : userData?.userData.frameSize || 10;
  orbitControls?.dispose();
  if (conditionalValue === "perspective") {
    cameraCurrent = new THREE.PerspectiveCamera(36, max, 0.02, 200);
    applyCameraFocalLength(cameraCurrent);
    const halfValue = frameSize / (Math.tan(THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV()) / 2) * 2);
    const conditionalValue = comparisonFlag ? halfValue : localValue;
    cameraCurrent.position.copy(computedValue).addScaledVector(normalize, Math.max(conditionalValue, 2));
  } else {
    cameraCurrent = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.02, 200);
    cameraCurrent.position.copy(computedValue).addScaledVector(normalize, localValue);
    focusCameraOnPoint(frameSize, max, cameraCurrent);
  }
  cameraCurrent.layers.enable(HELPER_LAYER);
  cameraCurrent.userData.viewportAspect = max;
  cameraCurrent.userData.frameSize = frameSize;
  cameraCurrent.userData.cameraView = userData?.userData.cameraView || "free";
  cameraCurrent.userData.topRotation = userData?.userData.topRotation || 0;
  cameraCurrent.up.copy(userData?.up || new THREE.Vector3(0, 1, 0));
  getCameraPose(cameraCurrent, computedValue);
  cameraCurrent.lookAt(computedValue);
  cameraCurrent.updateProjectionMatrix();
  orbitControls = createOrbitControls(cameraCurrent);
  orbitControls.target.copy(computedValue);
  syncOrbitControls();
  if (!isStageEmbed || viewportAspect.deferControlUpdate !== true) {
    orbitControls.update();
  }
}
function initPreviewRenderer() {
  const value = selectEl("#preview-3d");
  try {
    previewSceneCurrent = new THREE.Scene();
    cameraCurrent = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.05, 200);
    cameraCurrent.layers.enable(HELPER_LAYER);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    if (isStageEmbed) {
      renderer.domElement.addEventListener("webglcontextrestored", () => {
        materialTestTypeQuery = "";
        instanceTestTypeQuery.clear();
        PRECOMPILE_TIMEOUT_MS = "";
        scheduleOrbitInteractionWarmup();
      });
    }
    renderer.setPixelRatio(computeStudioPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = !yt;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    value.append(renderer.domElement);
    ensurePerfHud();
    orbitControls = createOrbitControls(cameraCurrent);
    updateModelLoadStatus();
    syncCameraModeButtons("orthographic");
    syncCameraViewButtons();
    hemisphereLight = new THREE.HemisphereLight(12504556, 1515053, 1.12);
    hemisphereLight.layers.enable(HELPER_LAYER);
    previewSceneCurrent.add(hemisphereLight);
    ambientLight = new THREE.AmbientLight(7175581, 0.42);
    ambientLight.layers.enable(HELPER_LAYER);
    previewSceneCurrent.add(ambientLight);
    previewSpotLight = new THREE.DirectionalLight(14543103, 2.05);
    previewSpotLight.position.set(-7, 22, 6);
    previewSpotLight.castShadow = true;
    previewSpotLight.shadow.mapSize.set(2048, 2048);
    previewSpotLight.shadow.camera.left = -20;
    previewSpotLight.shadow.camera.right = 20;
    previewSpotLight.shadow.camera.top = 20;
    previewSpotLight.shadow.camera.bottom = -20;
    previewSpotLight.shadow.autoUpdate = false;
    previewSpotLight.shadow.needsUpdate = true;
    previewSpotLight.layers.enable(HELPER_LAYER);
    previewSceneCurrent.add(previewSpotLight);
    fillLight = new THREE.DirectionalLight(8886724, 0.72);
    fillLight.position.set(9, 7, -10);
    fillLight.layers.enable(HELPER_LAYER);
    previewSceneCurrent.add(fillLight);
    topLight = new THREE.DirectionalLight(15791103, 0.68);
    topLight.position.set(0, 16, 1);
    topLight.layers.enable(HELPER_LAYER);
    previewSceneCurrent.add(topLight);
    worldGroup = new THREE.Group();
    previewSceneCurrent.add(worldGroup);
    if (yt) {
      renderCache = createContactShadowController({
        THREE,
        renderer,
        getRoot: () => worldGroup,
        requestFrame: updateLightPreview,
        canBuild: () => manager.modelLoadState().active === 0 && manager.modelLoadState().queued === 0
      });
      studioReady = createRegionLightController({
        THREE,
        renderer,
        scene: previewSceneCurrent,
        getRoot: () => worldGroup,
        contactShadows: renderCache,
        requestFrame: updateLightPreview
      });
    } else {
      shadowAtlas = createSpotShadowAtlasController({
        THREE,
        renderer,
        scene: previewSceneCurrent,
        camera: cameraCurrent,
        syncBeforeRender: isStageEmbed,
        requestFrame: updateLightPreview,
        canBuild: () => !document.hidden && !stageSession && !previewOrbitLocked && !isStageWarmup && !curtainMotionActive && !vacuumMotionActive && !isLeavingStudio && !isBakingLightCache && !floorShadowMotionActive && manager.modelLoadState().active === 0 && manager.modelLoadState().queued === 0
      });
    }
    applyPreviewEnvironment();
    orbitResumeTimer = new ResizeObserver(onPreviewContainerResize);
    orbitResumeTimer.observe(value);
    applyCameraViewCurrent();
    let nowResult = performance.now();
    let lastInteractiveRenderAt = -Infinity;
    const handler = (param = performance.now()) => {
      if (!renderer) {
        return;
      }
      if (!isStageEmbed) {
        requestAnimationFrame(handler);
      }
      const maxValue = Math.min(Math.max((param - nowResult) / 1000, 0), 0.05);
      nowResult = param;
      if (document.hidden) {
        return Infinity;
      }
      const flag = orbitControls.update(maxValue);
      if (flag) {
        lastInteractiveRenderAt = param;
      }
      const interactiveRenderBudget = param - lastInteractiveRenderAt < 600 ? 0 : Infinity;
      if (flag) {
        needsRenderFrame = true;
      }
      const isInteractiveRenderHot = previewOrbitLocked || flag || isStageWarmup;
      updatePerfMotionState(param, isInteractiveRenderHot);
      if (!needsRenderFrame && renderIdle) {
        return interactiveRenderBudget;
      }
      if (shadowAtlas?.isBuilding()) {
        needsRenderFrame = true;
        return interactiveRenderBudget;
      }
      needsRenderFrame = false;
      const beginGpuTimingQueryResult = beginGpuTimingQuery(isInteractiveRenderHot);
      const perfSampleStartedAt = isPerfDiagnosticsEnabled ? performance.now() : 0;
      renderer.render(previewSceneCurrent, cameraCurrent);
      const perfSampleElapsedMs = isPerfDiagnosticsEnabled ? performance.now() - perfSampleStartedAt : 0;
      endGpuTimingQuery(beginGpuTimingQueryResult);
      recordPerfFloorSwitchSample(param, perfSampleElapsedMs, isInteractiveRenderHot);
      const render = renderer.info.render;
      renderer.domElement.dataset.renderCalls = String(render.calls);
      renderer.domElement.dataset.renderTriangles = String(render.triangles);
      renderer.domElement.dataset.renderLines = String(render.lines);
      if (isStageEmbed) {
        const renderResources = JSON.stringify({
          ...renderer.info.memory,
          programs: renderer.info.programs?.length,
          contact: renderCache?.stats
        });
        if (renderer.domElement.dataset.renderResources !== renderResources) {
          renderer.domElement.dataset.renderResources = renderResources;
        }
      }
      initRenderStatsHud();
      tickQualityProbe();
      renderIdle = true;
      if (isStageEmbed) {
        renderer.domElement.dispatchEvent(new Event("hb-i3d-camera-frame"));
      }
      return interactiveRenderBudget;
    };
    if (isStageEmbed) {
      demandFrameLoop = createDemandFrameLoop({
        onWake() {
          nowResult = performance.now();
        },
        step(argPrimary) {
          const localValue = handler(argPrimary);
          renderer.domElement.dataset.renderFrameChecks = String(demandFrameLoop.stats.frames);
          return localValue;
        }
      });
      const helperFn = () => demandFrameLoop.wake();
      const callback = () => {
        nowResult = performance.now();
        const computedValue = !document.hidden && Vo;
        demandFrameLoop.setAvailable(computedValue);
        if (computedValue) {
          updateLightPreview();
          if (previewQualityJustBecameReady) {
            scheduleAdaptiveQuality();
          }
        } else {
          window.clearTimeout(stageSessionEndTimer);
          stageSessionEndTimer = null;
        }
      };
      const helperFnCurrent = detail => {
        Vo = detail.detail === true;
        callback();
        if (Vo && ORBIT_DOLLY_SPEED_SCALE) {
          scheduleOrbitInteractionWarmup();
        }
      };
      renderer.domElement.addEventListener("hb-i3d-parent-visibility", helperFnCurrent);
      for (const localValue of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
        renderer.domElement.addEventListener(localValue, helperFn, {
          passive: true
        });
      }
      document.addEventListener("visibilitychange", callback);
      window.addEventListener("pagehide", () => {
        demandFrameLoop.dispose();
        document.removeEventListener("visibilitychange", callback);
        shadowAtlas?.dispose?.();
        studioReady?.dispose();
        renderCache?.dispose();
        renderer.domElement.removeEventListener("hb-i3d-parent-visibility", helperFnCurrent);
        for (const localValue of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
          renderer.domElement.removeEventListener(localValue, helperFn);
        }
      }, {
        once: true
      });
      callback();
      helperFn();
    } else {
      handler();
    }
  } catch (error) {
    selectEl("#webgl-message").hidden = false;
    window.HABridgeLog?.error(error, {
      phase: "studio-webgl-init"
    });
    console.error(error);
  }
}
function focusCameraOnPoint(argPrimary, argSecondary, left = cameraCurrent) {
  if (!left?.isOrthographicCamera) {
    return;
  }
  const blob = Math.max(argPrimary, 1) / 2;
  if (argSecondary >= 1) {
    left.left = -blob * argSecondary;
    left.right = blob * argSecondary;
    left.top = blob;
    left.bottom = -blob;
  } else {
    left.left = -blob;
    left.right = blob;
    left.top = blob / Math.max(argSecondary, 0.1);
    left.bottom = -blob / Math.max(argSecondary, 0.1);
  }
  left.updateProjectionMatrix();
}
function onPreviewContainerResize() {
  if (!renderer) {
    return;
  }
  if (stageSession) {
    resizeStageEmbedViewport();
    return;
  }
  const value = selectEl("#preview-3d");
  const maxValue = Math.max(value.clientWidth, 1);
  const max = Math.max(value.clientHeight, 1);
  const planPoint = isStageEmbed ? renderer.getSize(new THREE.Vector2()) : null;
  const flag = planPoint?.x === maxValue && planPoint?.y === max;
  const projectionMatrixCacheKey = isStageEmbed ? cameraCurrent.projectionMatrix.elements.join(",") : "";
  if (!flag) {
    renderer.setSize(maxValue, max, false);
  }
  cameraCurrent.userData.viewportAspect = maxValue / max;
  if (cameraCurrent.isOrthographicCamera) {
    focusCameraOnPoint(cameraCurrent.userData.frameSize || 10, cameraCurrent.userData.viewportAspect);
  } else {
    cameraCurrent.aspect = cameraCurrent.userData.viewportAspect;
    applyCameraFocalLength();
  }
  if (!flag || projectionMatrixCacheKey !== cameraCurrent.projectionMatrix.elements.join(",")) {
    requestRender();
  }
}
function serializeCameraState() {
  if (!cameraCurrent || !orbitControls) {
    return null;
  } else {
    return {
      mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
      cameraView: cameraCurrent.userData.cameraView || cameraViewMode(),
      topRotation: cameraCurrent.userData.topRotation || 0,
      position: cameraCurrent.position.clone(),
      target: orbitControls.target.clone(),
      up: cameraCurrent.up.clone(),
      zoom: cameraCurrent.zoom,
      visibleHeight: resetOrbitTarget(cameraCurrent, orbitControls.target),
      frameSize: cameraCurrent.userData.frameSize || resetOrbitTarget(cameraCurrent, orbitControls.target),
      viewportAspect: cameraCurrent.userData.viewportAspect || 1,
      fov: cameraCurrent.isPerspectiveCamera ? cameraCurrent.fov : 36,
      near: cameraCurrent.near,
      far: cameraCurrent.far
    };
  }
}
function applyStoredCameraPose(cameraPose, flag = cameraPose?.viewportAspect || 1) {
  if (!!cameraPose && !!renderer) {
    setCameraProjectionMode(cameraPose.mode, {
      preserveView: false
    });
    cameraCurrent.position.copy(cameraPose.position);
    cameraCurrent.up.copy(cameraPose.up);
    cameraCurrent.zoom = cameraPose.zoom || 1;
    cameraCurrent.near = cameraPose.near;
    cameraCurrent.far = cameraPose.far;
    cameraCurrent.userData.frameSize = cameraPose.frameSize;
    cameraCurrent.userData.viewportAspect = flag;
    cameraCurrent.userData.cameraView = cameraPose.cameraView || cameraViewMode();
    cameraCurrent.userData.topRotation = cameraPose.topRotation || 0;
    if (cameraCurrent.isPerspectiveCamera) {
      cameraCurrent.fov = cameraPose.fov;
      cameraCurrent.aspect = flag;
    } else {
      focusCameraOnPoint(cameraPose.frameSize, flag, cameraCurrent);
    }
    cameraCurrent.lookAt(cameraPose.target);
    cameraCurrent.updateProjectionMatrix();
    orbitControls.target.copy(cameraPose.target);
    syncOrbitControls();
    orbitControls.update();
  }
}
function readExportResolution() {
  return {
    width: Math.round(clamp(finite(exportWidth.value, hc), 320, 4096)),
    height: Math.round(clamp(finite(exportHeight.value, fc), 320, 4096))
  };
}
function syncExportResolutionLabel() {
  const {
    width,
    height
  } = readExportResolution();
  wg.textContent = width + " × " + height + " px";
  const value = ((gcdA, gcdB) => {
    while (gcdB) {
      [gcdA, gcdB] = [gcdB, gcdA % gcdB];
    }
    return gcdA;
  })(width, height);
  const screenExtentWidth = width / value;
  const screenExtentHeight = height / value;
  mg.textContent = screenExtentWidth <= 32 && screenExtentHeight <= 32 ? screenExtentWidth + " : " + screenExtentHeight : (width / height).toFixed(2) + " : 1";
  fg.style.setProperty("--export-aspect", String(width / height));
}
function stageEmbedPixelRatio(flag = false) {
  const value = window.devicePixelRatio || 1;
  if (!isAutoDiagramEmbedCurrent || !exportPreviewStage) {
    return value;
  }
  const {
    width,
    height
  } = readExportResolution();
  const maxValue = Math.max(exportPreviewStage.clientWidth, 1);
  const max = Math.max(exportPreviewStage.clientHeight, 1);
  const maxValueCurrent = Math.max(value, width / maxValue, height / max, 1.5);
  return Math.min(maxValueCurrent, flag ? 2 : 4);
}
function resizeStageEmbedViewport() {
  if (!stageSession || orbitSuspended || !renderer || !cameraCurrent) {
    return;
  }
  const {
    width,
    height
  } = readExportResolution();
  const cameraPose = width / height;
  const value = Math.max(exportPreviewStage.clientWidth, 1);
  const maxValue = Math.max(exportPreviewStage.clientHeight, 1);
  const minValue = isAutoDiagramEmbedCurrent ? stageEmbedPixelRatio(false) : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(minValue);
  renderer.setSize(value, maxValue, false);
  cameraCurrent.userData.viewportAspect = cameraPose;
  if (cameraCurrent.isOrthographicCamera) {
    focusCameraOnPoint(cameraCurrent.userData.frameSize || 10, cameraPose, cameraCurrent);
  } else {
    cameraCurrent.aspect = cameraPose;
    applyCameraFocalLength();
  }
  orbitControls.update();
  requestRender();
}
function scheduleStageEmbedResize() {
  syncExportResolutionLabel();
  requestAnimationFrame(() => requestAnimationFrame(resizeStageEmbedViewport));
}
function onExportDimensionInput(argPrimary, silent = false) {
  const isWidth = Number((argPrimary === "width" ? exportWidth : exportHeight).value);
  if (!Number.isFinite(isWidth) || isWidth <= 0) {
    return;
  }
  let id = argPrimary === "width" ? isWidth : Number(exportWidth.value);
  let argPrimaryCurrent = argPrimary === "height" ? isWidth : Number(exportHeight.value);
  id = Number.isFinite(id) && id > 0 ? id : hc;
  argPrimaryCurrent = Number.isFinite(argPrimaryCurrent) && argPrimaryCurrent > 0 ? argPrimaryCurrent : fc;
  if (exportLockRatio.checked) {
    if (argPrimary === "width") {
      if (silent) {
        id = clamp(id, 320, 4096);
        argPrimaryCurrent = Math.round(id / Tn);
        if (argPrimaryCurrent < 320) {
          argPrimaryCurrent = 320;
          id = Math.round(argPrimaryCurrent * Tn);
        }
        if (argPrimaryCurrent > 4096) {
          argPrimaryCurrent = 4096;
          id = Math.round(argPrimaryCurrent * Tn);
        }
      } else {
        argPrimaryCurrent = Math.round(clamp(id / Tn, 320, 4096));
      }
    } else if (silent) {
      argPrimaryCurrent = clamp(argPrimaryCurrent, 320, 4096);
      id = Math.round(argPrimaryCurrent * Tn);
      if (id < 320) {
        id = 320;
        argPrimaryCurrent = Math.round(id / Tn);
      }
      if (id > 4096) {
        id = 4096;
        argPrimaryCurrent = Math.round(id / Tn);
      }
    } else {
      id = Math.round(clamp(argPrimaryCurrent * Tn, 320, 4096));
    }
  }
  if (silent) {
    id = Math.round(clamp(id, 320, 4096));
    argPrimaryCurrent = Math.round(clamp(argPrimaryCurrent, 320, 4096));
    exportWidth.value = String(id);
    exportHeight.value = String(argPrimaryCurrent);
  } else if (exportLockRatio.checked) {
    if (argPrimary === "width") {
      exportHeight.value = String(argPrimaryCurrent);
    } else {
      exportWidth.value = String(id);
    }
  }
  scheduleStageEmbedResize();
}
function applyStageFixedCameraView(silent = {}) {
  const isMode = activeFixedCameraView();
  if (!isMode || !stageSession) {
    return;
  }
  const viewportAspect = readExportResolution().width / readExportResolution().height;
  const value = activeCameraSettings();
  value.cameraMode = isMode.mode;
  value.cameraView = isMode.view;
  value.cameraTopRotation = isMode.topRotation;
  if (isMode.focalLength !== null) {
    value.cameraFocalLength = isMode.focalLength;
  }
  applyStoredCameraPose({
    mode: isMode.mode,
    cameraView: isMode.view,
    topRotation: isMode.topRotation,
    position: new THREE.Vector3(isMode.position.x, isMode.position.y, isMode.position.z),
    target: new THREE.Vector3(isMode.target.x, isMode.target.y, isMode.target.z),
    up: isMode.view === "top" ? topViewForwardVector(isMode.topRotation) : new THREE.Vector3(0, 1, 0),
    zoom: 1,
    visibleHeight: isMode.visibleHeight,
    frameSize: isMode.visibleHeight,
    viewportAspect,
    fov: isMode.fov,
    near: 0.02,
    far: Math.max(new THREE.Vector3(isMode.position.x, isMode.position.y, isMode.position.z).distanceTo(new THREE.Vector3(isMode.target.x, isMode.target.y, isMode.target.z)) * (isMode.mode === "perspective" ? 8 : 5), 100)
  }, viewportAspect);
  syncCameraModeButtons(isMode.mode);
  syncCameraViewButtons(isMode.view);
  if (!silent.silent) {
    const previewFloorMode = getPreviewFloorModeCurrent() === "all" ? "总览视角" : "当前层视角";
    exportStatus.textContent = "已恢复上次保存的" + previewFloorMode;
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function normalizeProjectExportPresets() {
  const list = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, list.length);
  projectDocCurrent.exportPresets = list;
  projectDocCurrent.activeExportPresetSlot = slot;
  const lookupMap = new Map((projectDocCurrent?.floors || []).map(floor => [floor.id, floor.name]));
  h0.replaceChildren(...list.map((preset, argSecondary) => {
    const element = document.createElement("button");
    element.type = "button";
    element.dataset.exportPresetSlot = String(argSecondary);
    element.setAttribute("role", "tab");
    const el = document.createElement("strong");
    const elCurrent = document.createElement("small");
    el.textContent = preset?.name || lookupMap.get(preset?.floorId) || "未命名存档";
    elCurrent.textContent = preset ? "已设置" : "未设置";
    const value = argSecondary === slot;
    element.classList.toggle("active", value);
    element.classList.toggle("has-value", !!preset);
    element.setAttribute("aria-selected", String(value));
    element.title = preset ? el.textContent + "：已设置" : el.textContent + "：未设置";
    element.append(el, elCurrent);
    return element;
  }));
  const floor = list[slot];
  f0.disabled = list.length >= MAX_EXPORT_PRESET_COUNT;
  g0.disabled = !floor;
  p0.disabled = list.length <= 1;
  const flag = exportPresetIsEmpty(floor, exportPresetEditorOpenCurrent);
  gg.hidden = !flag;
  pg.textContent = floor ? defaultExportPresetLabel(floor, slot) + "已设置" : "当前存档尚未设置";
}
function syncExportCameraFocalUi({
  name = ""
} = {}) {
  if (cameraCurrent.isPerspectiveCamera) {
    const value = selectEl("#camera-focal-length");
    const clampCurrent = clamp(finite(value?.value, getCameraFocalLength()), 18, 120);
    activeCameraSettings().cameraFocalLength = clampCurrent;
    for (const entry of cameraFocalLengthEls) {
      entry.value = String(Math.round(clampCurrent));
    }
    applyCameraFocalLength(cameraCurrent, clampCurrent);
  }
  const {
    width,
    height
  } = readExportResolution();
  const point = orbitControls.target;
  return normalizeExportPreset({
    name,
    width,
    height,
    lockRatio: exportLockRatio.checked,
    floorMode: getPreviewFloorModeCurrent() === "all" ? "all" : "floor",
    floorId: activeFloor()?.id || activeFloorId,
    floorGap: finite(projectDocCurrent.exportFloorGap, 3),
    camera: {
      mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
      view: cameraViewMode(),
      topRotation: topViewRotation(),
      position: {
        x: cameraCurrent.position.x,
        y: cameraCurrent.position.y,
        z: cameraCurrent.position.z
      },
      target: {
        x: point.x,
        y: point.y,
        z: point.z
      },
      visibleHeight: resetOrbitTarget(cameraCurrent, point),
      fov: cameraCurrent.isPerspectiveCamera ? cameraCurrent.fov : 36,
      focalLength: cameraCurrent.isPerspectiveCamera ? getCameraFocalLength() : null
    },
    folderName: exportFolderName.value,
    selectedFiles: [...checkedExportFileKeys()]
  });
}
function fitExportCameraAspect(camera) {
  const viewportAspect = readExportResolution().width / readExportResolution().height;
  const value = activeCameraSettings();
  value.cameraMode = camera.mode;
  value.cameraView = camera.view;
  value.cameraTopRotation = camera.topRotation;
  if (camera.focalLength !== null) {
    value.cameraFocalLength = camera.focalLength;
  }
  const position = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
  const target = new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z);
  applyStoredCameraPose({
    mode: camera.mode,
    cameraView: camera.view,
    topRotation: camera.topRotation,
    position,
    target,
    up: camera.view === "top" ? topViewForwardVector(camera.topRotation) : new THREE.Vector3(0, 1, 0),
    zoom: 1,
    visibleHeight: camera.visibleHeight,
    frameSize: camera.visibleHeight,
    viewportAspect,
    fov: camera.fov,
    near: 0.02,
    far: Math.max(position.distanceTo(target) * (camera.mode === "perspective" ? 8 : 5), 100)
  }, viewportAspect);
  syncCameraModeButtons(camera.mode);
  syncCameraViewButtons(camera.view);
}
function activateExportPresetSlot(floor, silent = {}) {
  const flag = normalizeExportPreset(projectDocCurrent?.exportPresets?.[floor]);
  if (!flag || !stageSession) {
    return false;
  }
  exportWidth.value = String(flag.width);
  exportHeight.value = String(flag.height);
  exportLockRatio.checked = flag.lockRatio;
  Tn = flag.width / flag.height;
  projectDocCurrent.exportFloorGap = flag.floorGap;
  const id = projectDocCurrent.floors.find(lightBrightness => lightBrightness.id === flag.floorId);
  const conditionalValue = flag.floorMode === "all" && projectDocCurrent.floors.length > 1 ? "all" : id?.id || activeFloor()?.id || activeFloorId;
  setExportFloorScope(conditionalValue);
  exportFloorGap.value = flag.floorGap.toFixed(1);
  exportFolderName.value = flag.folderName;
  const has = new Set(flag.selectedFiles);
  const localValue = has.has("televisionOn");
  const present = has.has("vehicleCharging");
  for (const dataset of exportDialog.querySelectorAll("input[data-export-file]")) {
    const prefixText = dataset.dataset.exportFile;
    dataset.checked = has.has(prefixText) || localValue && prefixText.startsWith("screen:") || present && prefixText.startsWith("vehicle:");
  }
  fitExportCameraAspect(flag.camera);
  syncExportResolutionLabel();
  syncFloorCameraChrome();
  if (!silent.silent) {
    exportStatus.textContent = "已切换到档位 " + String(floor + 1).padStart(2, "0");
    showToast("已应用导出档位 " + String(floor + 1).padStart(2, "0") + "。", "success");
  }
  scheduleStageEmbedResize();
  return true;
}
function selectExportPresetIndex(argPrimary) {
  const value = projectDocCurrent?.exportPresets?.length || 0;
  if (!Number.isInteger(argPrimary) || argPrimary < 0 || argPrimary >= value || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDocCurrent.activeExportPresetSlot = argPrimary;
  const flag = activateExportPresetSlot(argPrimary);
  exportPresetEditorOpenCurrent = false;
  normalizeProjectExportPresets();
  scheduleSave();
  if (!flag) {
    exportStatus.textContent = "存档 " + String(argPrimary + 1).padStart(2, "0") + " 没有设置";
  }
}
function flushExportUiDebounce() {
  window.clearTimeout(exportUiDebounceTimerCurrent);
  exportUiDebounceTimerCurrent = null;
  if (!exportPresetEditorOpenCurrent) {
    return false;
  }
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, projectDocCurrent?.exportPresets?.length);
  if (!stageSession || orbitSuspended) {
    return false;
  }
  projectDocCurrent.exportPresets = normalizeExportPresetSlots(projectDocCurrent.exportPresets);
  const name = projectDocCurrent.exportPresets[slot]?.name || "";
  projectDocCurrent.exportPresets[slot] = syncExportCameraFocalUi({
    name
  });
  exportPresetEditorOpenCurrent = false;
  normalizeProjectExportPresets();
  scheduleSave();
  return true;
}
function openExportPresetEditor() {
  if (!!stageSession && !orbitSuspended) {
    exportPresetEditorOpenCurrent = true;
    normalizeProjectExportPresets();
    window.clearTimeout(exportUiDebounceTimerCurrent);
    exportUiDebounceTimerCurrent = window.setTimeout(flushExportUiDebounce, 360);
  }
}
function defaultExportPresetLabel(argPrimary, argSecondary) {
  if (!argPrimary) {
    return "存档 " + String(argSecondary + 1).padStart(2, "0");
  }
  const normalizeLabelText = (projectDocCurrent?.floors || []).find(item => item.id === argPrimary.floorId)?.name;
  return argPrimary.name || normalizeLabelText || "存档 " + String(argSecondary + 1).padStart(2, "0");
}
function uniqueExportPresetLabel(size, argSecondary = -1) {
  const blob = normalizeLabelText(size, "导出视角", 24);
  const isPutImageData = new Set((projectDocCurrent?.exportPresets || []).map((argPrimary, item) => item === argSecondary ? "" : defaultExportPresetLabel(argPrimary, item)).filter(Boolean));
  if (!isPutImageData.has(blob)) {
    return blob;
  }
  let buildLightDeltaPixels = 2;
  while (isPutImageData.has(blob + " " + buildLightDeltaPixels)) {
    buildLightDeltaPixels += 1;
  }
  return (blob + " " + buildLightDeltaPixels).slice(0, 24);
}
function addExportPresetSlot() {
  if (!stageSession || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDocCurrent.exportPresets = normalizeExportPresetSlots(projectDocCurrent.exportPresets);
  if (projectDocCurrent.exportPresets.length >= MAX_EXPORT_PRESET_COUNT) {
    showToast("最多可以保存 8 个导出存档。");
    return;
  }
  const length = projectDocCurrent.exportPresets.length;
  const value = getPreviewFloorModeCurrent() === "all" ? "全楼" : activeFloor()?.name || "存档 " + (length + 1);
  const name = uniqueExportPresetLabel(value + "视角");
  const size = projectDocCurrent.exportPresets.slice(0, length).reverse().find(Boolean);
  const syncExportCameraFocalUiResult = syncExportCameraFocalUi({
    name
  });
  if (size) {
    syncExportCameraFocalUiResult.width = size.width;
    syncExportCameraFocalUiResult.height = size.height;
    syncExportCameraFocalUiResult.lockRatio = size.lockRatio;
  }
  projectDocCurrent.exportPresets.push(syncExportCameraFocalUiResult);
  projectDocCurrent.activeExportPresetSlot = length;
  exportPresetEditorOpenCurrent = false;
  normalizeProjectExportPresets();
  scheduleSave();
  exportStatus.textContent = "已新增“" + name + "”";
  showToast("已新增“" + name + "”，可以继续调整楼层和视角。", "success");
}
function closeExportPresetRenameDialog() {
  if (exportPresetRenameDialog.open) {
    exportPresetRenameDialog.close();
  }
}
function duplicateActiveExportPreset() {
  if (orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  const slots = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, slots.length);
  if (slots[slot]) {
    exportPresetRenameInput.value = defaultExportPresetLabel(slots[slot], slot);
    exportPresetRenameDialog.showModal();
    requestAnimationFrame(() => exportPresetRenameInput.select());
  }
}
function closeExportPresetDeleteDialog() {
  if (exportPresetDeleteDialog.open) {
    exportPresetDeleteDialog.close();
  }
}
function removeActiveExportPreset() {
  if (orbitSuspended) {
    return;
  }
  const slots = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  if (slots.length <= 1) {
    return;
  }
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, slots.length);
  bg.textContent = defaultExportPresetLabel(slots[slot], slot);
  exportPresetDeleteDialog.showModal();
}
function confirmExportPresetDelete() {
  const slots = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  if (slots.length <= 1) {
    return;
  }
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, slots.length);
  const value = defaultExportPresetLabel(slots[slot], slot);
  window.clearTimeout(exportUiDebounceTimerCurrent);
  exportUiDebounceTimerCurrent = null;
  exportPresetEditorOpenCurrent = false;
  slots.splice(slot, 1);
  projectDocCurrent.exportPresets = slots;
  projectDocCurrent.activeExportPresetSlot = Math.min(slot, slots.length - 1);
  closeExportPresetDeleteDialog();
  const flag = activateExportPresetSlot(projectDocCurrent.activeExportPresetSlot, {
    silent: true
  });
  normalizeProjectExportPresets();
  scheduleSave();
  exportStatus.textContent = flag ? "已切换到相邻存档" : "当前存档尚未设置";
  showToast("已删除“" + value + "”，楼层和户型未受影响。", "success");
}
function postAutoDiagramMessage(numericParam = 0) {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window) {
    requestAnimationFrame(() => {
      if (!stageSession || !renderer || !previewSceneCurrent || !cameraCurrent || !orbitControls) {
        return;
      }
      resizeStageEmbedViewport();
      if (!worldGroup?.children?.length) {
        rebuildWorldPreviewCurrent();
      }
      const flag = exportPreviewStage.clientWidth > 1 && exportPreviewStage.clientHeight > 1;
      const flagCurrent = !!worldGroup?.children?.length;
      let flagNext = false;
      if (flag && flagCurrent) {
        requestRender({
          shadows: true
        });
        orbitControls.update();
        for (let value = 0; value < 2; value += 1) {
          renderer.render(previewSceneCurrent, cameraCurrent);
        }
        const render = renderer.info.render;
        flagNext = render.calls > 0 && render.triangles > 0;
        renderer.domElement.dataset.renderCalls = String(render.calls);
        renderer.domElement.dataset.renderTriangles = String(render.triangles);
        renderer.domElement.dataset.renderLines = String(render.lines);
        needsRenderFrame = false;
        renderIdle = flagNext;
        initRenderStatsHud();
      }
      if (!flagNext && numericParam < 7) {
        postAutoDiagramMessage(numericParam + 1);
        return;
      }
      if (!flagNext) {
        window.parent.postMessage({
          type: "ha-bridge-floorplan-auto-diagram-error",
          componentId: autoDiagramComponentId,
          message: "3D户型首帧渲染失败，请刷新后重试。"
        }, window.location.origin);
        return;
      }
      window.parent.postMessage({
        type: "ha-bridge-floorplan-auto-diagram-ready",
        componentId: autoDiagramComponentId,
        floors: projectDocCurrent.floors.map(id => ({
          id: id.id,
          name: id.name
        })),
        floorSelection: getPreviewFloorModeCurrent() === "all" ? "all" : activeFloor()?.id || activeFloorId
      }, window.location.origin);
    });
  }
}
function scheduleOrbitResumeAfterModels() {
  if (stageSession || !renderer || !cameraCurrent || !orbitControls) {
    return;
  }
  window.clearTimeout(exportUiDebounceTimerCurrent);
  exportUiDebounceTimerCurrent = null;
  exportPresetEditorOpenCurrent = false;
  const list = collectLightGroupsAcrossFloors();
  const floors = collectTvsAcrossFloors();
  const listCurrent = collectSmallCarsAcrossFloors();
  stageSession = {
    canvasParent: renderer.domElement.parentElement,
    camera: serializeCameraState(),
    selected: selection ? {
      ...selection
    } : null,
    selectedMany: multiSelection.map(argPrimary => ({
      ...argPrimary
    })),
    floorMode: getPreviewFloorModeCurrent(),
    selectedFloorId: activeFloorId,
    floorCameraSettings: new Map(projectDocCurrent.floors.map(floor => [floor.id, {
      mode: floor.scene.settings.cameraMode,
      view: floor.scene.settings.cameraView,
      topRotation: floor.scene.settings.cameraTopRotation,
      focalLength: floor.scene.settings.cameraFocalLength
    }])),
    combinedCameraSettings: {
      ...projectDocCurrent.combinedCameraSettings
    },
    groupStates: new Map(list.map(({
      key,
      group
    }) => [key, group.enabled])),
    tvStates: new Map(floors.map(({
      key,
      item
    }) => [key, item.screenEnabled !== false])),
    carChargingStates: new Map(listCurrent.map(({
      key,
      item
    }) => [key, item.chargingEnabled === true])),
    cameraSettings: {
      mode: getCameraProjectionMode(),
      view: cameraViewMode(),
      topRotation: topViewRotation(),
      focalLength: getCameraFocalLength()
    },
    pixelRatio: renderer.getPixelRatio()
  };
  shadowAtlas?.setEnabled(false);
  for (const {
    group
  } of list) {
    group.enabled = false;
  }
  clearSelection();
  exportStatus.textContent = "准备保存到 NAS";
  exportFolderName.classList.remove("invalid");
  renderExportFileChecklist();
  currentExportFloorScope();
  syncFloorCameraChrome();
  normalizeProjectExportPresets();
  exportPackage.disabled = false;
  if (isAutoDiagramEmbedCurrent) {
    document.body.classList.add("auto-diagram-embedded");
    const value = new URLSearchParams(window.location.search);
    const clampCurrent = clamp(finite(value.get("dashboard-width"), finite(value.get("component-width"), exportWidth.value)), 320, 4096);
    const clampNext = clamp(finite(value.get("dashboard-height"), finite(value.get("component-height"), exportHeight.value)), 320, 4096);
    exportWidth.value = String(Math.round(clampCurrent));
    exportHeight.value = String(Math.round(clampNext));
    exportLockRatio.checked = true;
    if (entry) {
      exportFolderName.value = entry;
    }
    syncExportResolutionLabel();
  }
  exportDialog.showModal();
  exportPreviewStage.append(renderer.domElement);
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent.activeExportPresetSlot, projectDocCurrent.exportPresets.length);
  const flag = slot !== null && activateExportPresetSlot(slot, {
    silent: true
  });
  if (isAutoDiagramEmbedCurrent && floorSelectionQueryCurrent !== null) {
    const id = projectDocCurrent.floors.find(item => item.id === floorSelectionQueryCurrent);
    const value = floorSelectionQueryCurrent === "all" && projectDocCurrent.floors.length > 1 ? "all" : id?.id || activeFloor()?.id || activeFloorId;
    setExportFloorScope(value);
  }
  if (!flag) {
    rebuildWorldPreviewCurrent();
    if (activeFixedCameraView()) {
      applyStageFixedCameraView({
        silent: true
      });
    } else if (isAutoDiagramEmbedCurrent) {
      setCameraProjectionMode(getCameraProjectionMode(), {
        preserveView: false
      });
      applyCameraViewCurrent();
    }
  }
  Tn = readExportResolution().width / readExportResolution().height;
  normalizeProjectExportPresets();
  scheduleStageEmbedResize();
  postAutoDiagramMessage();
}
function renderExportFileChecklist() {
  if (!exportGroupFiles) {
    return;
  }
  const list = previewFloorEntries();
  const listCurrent = [];
  const handler = (argPrimary, argSecondary, argTertiary) => {
    const appendEl = document.createElement("li");
    const append = document.createElement("label");
    const button = document.createElement("input");
    button.type = "checkbox";
    button.checked = true;
    button.dataset.exportFile = argPrimary;
    const el = document.createElement("span");
    el.textContent = argSecondary;
    const element = document.createElement("small");
    element.textContent = argTertiary;
    append.append(button, el);
    appendEl.append(append, element);
    listCurrent.push(appendEl);
  };
  collectTvsAcrossFloors(list).forEach(({
    floor,
    item,
    index,
    key
  }) => {
    const flag = "" + (list.length > 1 ? floor.name + "-" : "") + (item.screenLayerName || "电视画面 " + (index + 1));
    handler("screen:" + key, sanitizeExportFileName(flag, "电视画面-" + (index + 1)) + "." + EXPORT_IMAGE_EXTENSION, "该电视的独立开启透明层");
  });
  collectSmallCarsAcrossFloors(list).forEach(({
    floor,
    item,
    index,
    key
  }) => {
    const flag = "" + (list.length > 1 ? floor.name + "-" : "") + (item.chargingLayerName || "汽车充电 " + (index + 1));
    handler("vehicle:" + key, sanitizeExportFileName(flag, "汽车充电-" + (index + 1)) + "." + EXPORT_IMAGE_EXTENSION, "该汽车的独立充电光效层");
  });
  collectLightGroupsAcrossFloors(list).forEach(({
    floor,
    group,
    index,
    key
  }) => {
    const flag = "" + (list.length > 1 ? floor.name + "-" : "") + (group.name || "灯组-" + (index + 1));
    handler("group:" + key, sanitizeExportFileName(flag, "灯组-" + (index + 1)) + "." + EXPORT_IMAGE_EXTENSION, "该灯组的透明光效层");
  });
  exportGroupFiles.replaceChildren(...listCurrent);
}
function currentExportFloorScope() {
  const flag = getPreviewFloorModeCurrent() === "all";
  const value = flag ? "all" : activeFloor()?.id || activeFloorId;
  exportFloorSelect.replaceChildren(...projectDocCurrent.floors.map(id => {
    const el = document.createElement("option");
    el.value = id.id;
    el.textContent = id.name;
    return el;
  }), ...(projectDocCurrent.floors.length > 1 ? [Object.assign(document.createElement("option"), {
    value: "all",
    textContent: "全楼合并"
  })] : []));
  exportFloorSelect.value = value;
  syncStudioSelect(exportFloorSelect);
  yg.hidden = !flag || projectDocCurrent.floors.length <= 1;
  syncControlValue(exportFloorGap, finite(projectDocCurrent.exportFloorGap, 3).toFixed(1));
  syncFloorCameraChrome();
}
function setExportFloorScope(floorEntry) {
  if (!stageSession || orbitSuspended) {
    return;
  }
  const flag = floorEntry === "all" && projectDocCurrent.floors.length > 1;
  if (!flag) {
    const id = projectDocCurrent.floors.find(item => item.id === floorEntry);
    if (!id) {
      return;
    }
    stageSession.selectedFloorId = id.id;
    floorSceneCurrent = id.scene;
  }
  projectDocCurrent.previewFloorMode = flag ? "all" : "active";
  currentExportFloorScope();
  syncPreviewFloorButtons();
  syncFloorCameraChrome();
  rebuildWorldPreviewCurrent();
  if (activeFixedCameraView()) {
    applyStageFixedCameraView({
      silent: true
    });
  } else {
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false
    });
    applyCameraViewCurrent();
  }
  renderExportFileChecklist();
  exportStatus.textContent = getPreviewFloorModeCurrent() === "all" ? "正在构图：全楼合并" : "正在构图：" + (activeFloor()?.name || "当前层");
  scheduleStageEmbedResize();
}
function checkedExportFileKeys() {
  return new Set([...exportDialog.querySelectorAll("input[data-export-file]:checked")].map(el => el.dataset.exportFile));
}
function openExportDialog() {
  if (!stageSession || orbitSuspended) {
    return;
  }
  closeBaseLightControls();
  if (baseLightControls?.parentElement !== document.body) {
    document.body.append(baseLightControls);
  }
  flushExportUiDebounce();
  const cameraSettings = stageSession;
  for (const floor of projectDocCurrent.floors) {
    const floorCameraSetting = cameraSettings.floorCameraSettings.get(floor.id);
    if (floorCameraSetting) {
      floor.scene.settings.cameraMode = floorCameraSetting.mode;
      floor.scene.settings.cameraView = floorCameraSetting.view;
      floor.scene.settings.cameraTopRotation = floorCameraSetting.topRotation;
      floor.scene.settings.cameraFocalLength = floorCameraSetting.focalLength;
    }
  }
  projectDocCurrent.combinedCameraSettings = {
    ...cameraSettings.combinedCameraSettings
  };
  stageSession = null;
  projectDocCurrent.previewFloorMode = cameraSettings.floorMode;
  floorSceneCurrent = projectDocCurrent.floors.find(item => item.id === activeFloorId)?.scene || projectDocCurrent.floors[0].scene;
  cameraSettings.canvasParent?.append(renderer.domElement);
  const value = activeCameraSettings();
  value.cameraMode = cameraSettings.cameraSettings.mode;
  value.cameraView = cameraSettings.cameraSettings.view;
  value.cameraTopRotation = cameraSettings.cameraSettings.topRotation;
  value.cameraFocalLength = cameraSettings.cameraSettings.focalLength;
  applyStoredCameraPose(cameraSettings.camera, cameraSettings.camera.viewportAspect);
  syncCameraModeButtons(cameraSettings.cameraSettings.mode);
  syncCameraViewButtons(cameraSettings.cameraSettings.view);
  selection = cameraSettings.selected;
  multiSelection = cameraSettings.selectedMany;
  for (const {
    key,
    group
  } of collectLightGroupsAcrossFloors()) {
    if (cameraSettings.groupStates.has(key)) {
      group.enabled = cameraSettings.groupStates.get(key);
    }
  }
  for (const {
    key,
    item
  } of collectTvsAcrossFloors()) {
    if (cameraSettings.tvStates.has(key)) {
      item.screenEnabled = cameraSettings.tvStates.get(key);
    }
  }
  for (const {
    key,
    item
  } of collectSmallCarsAcrossFloors()) {
    if (cameraSettings.carChargingStates.has(key)) {
      item.chargingEnabled = cameraSettings.carChargingStates.get(key);
    }
  }
  renderer.setPixelRatio(cameraSettings.pixelRatio);
  rebuildWorldPreviewCurrent();
  syncOrbitControls();
  onPreviewContainerResize();
  updateSelectionInspector();
  drawPlan();
}
function setOrbitSuspended(flag) {
  orbitSuspended = flag;
  const isHidden = selectEl("#export-busy-notice");
  if (isHidden) {
    isHidden.hidden = !flag;
  }
  exportPackage.disabled = flag;
  selectEl("#export-close").disabled = flag;
  for (const id of exportDialog.querySelectorAll("input, button")) {
    if (id.id !== "export-close" && id.id !== "export-package") {
      id.disabled = flag;
    }
  }
  if (!flag) {
    syncFloorCameraChrome();
    normalizeProjectExportPresets();
  }
  orbitControls.enabled = !flag;
}
function forceTripleRender() {
  orbitControls.update();
  for (let value = 0; value < 3; value += 1) {
    renderer.render(previewSceneCurrent, cameraCurrent);
  }
}
function canvasToBlob(blob) {
  return new Promise((argPrimary, argSecondary) => {
    blob.toBlob(flag => {
      if (flag) {
        argPrimary(flag);
      } else {
        argSecondary(new Error("无法生成导出图像。"));
      }
    }, EXPORT_IMAGE_MIME_TYPE, EXPORT_IMAGE_QUALITY);
  });
}
async function capturePreviewCanvasCurrent(planPoint, floor, options = {}) {
  forceTripleRender();
  const value = document.createElement("canvas");
  value.width = planPoint;
  value.height = floor;
  const count = value.getContext("2d", {
    willReadFrequently: options.pixels === true
  });
  if (!count) {
    throw new Error("当前浏览器无法创建导出画布。");
  }
  count.drawImage(renderer.domElement, 0, 0, planPoint, floor);
  const maxValue = {};
  if (options.pixels) {
    maxValue.imageData = count.getImageData(0, 0, planPoint, floor);
  }
  if (options.blob) {
    maxValue.blob = await canvasToBlob(value);
  }
  return maxValue;
}
async function composeExportCanvas(flag, flagCurrent) {
  const width = document.createElement("canvas");
  width.width = flag.width;
  width.height = flag.height;
  const putImageData = width.getContext("2d");
  if (!putImageData) {
    throw new Error("当前浏览器无法创建透明灯光层。");
  }
  const localValue = buildLightDeltaPixels(flag.data, flagCurrent.data);
  putImageData.putImageData(new ImageData(localValue, flag.width, flag.height), 0, 0);
  return canvasToBlob(width);
}
async function drawExportAnnotations(data, lights, argTertiary, value, argN, argNCurrent) {
  const blob = document.createElement("canvas");
  blob.width = argTertiary;
  blob.height = value;
  const isDrawImage = blob.getContext("2d");
  const el = document.createElement("canvas");
  el.width = argTertiary;
  el.height = value;
  const isClearRect = el.getContext("2d");
  if (!isDrawImage || !isClearRect) {
    throw new Error("当前浏览器无法合成逐灯阴影。");
  }
  const list = lights.lights.filter(lightBrightness => finite(lightBrightness.lightBrightness, 0) > 0);
  try {
    for (let count = 0; count < list.length; count += 1) {
      const id = list[count];
      exportStatus.textContent = "正在渲染灯组 " + (argN + 1) + "/" + argNCurrent + "：" + lights.name + "（" + (count + 1) + "/" + list.length + "）";
      forcedVisibleLightGroupIds = new Set([id.id]);
      if (getPreviewFloorModeCurrent() === "all") {
        rebuildWorldPreviewCurrent({
          preserveLightCache: true
        });
      } else {
        rebuildPreviewLightMeshesCurrent({
          preserveLightCache: true
        });
      }
      const imageData = await capturePreviewCanvasCurrent(argTertiary, value, {
        pixels: true
      });
      const pixels = buildLightDeltaPixels(data.data, imageData.imageData.data);
      isClearRect.clearRect(0, 0, argTertiary, value);
      isClearRect.putImageData(new ImageData(pixels, argTertiary, value), 0, 0);
      isDrawImage.drawImage(el, 0, 0);
      await yieldToScheduler();
    }
  } finally {
    forcedVisibleLightGroupIds = null;
  }
  return canvasToBlob(blob);
}
async function buildExportImageCanvas(flag, floor, optionalValue = null) {
  const width = document.createElement("canvas");
  width.width = flag;
  width.height = floor;
  const fillStyle = width.getContext("2d");
  if (!fillStyle) {
    throw new Error("当前浏览器无法创建导出底图。");
  }
  fillStyle.fillStyle = "#" + resolvedThemeColors().background.toString(16).padStart(6, "0");
  fillStyle.fillRect(0, 0, flag, floor);
  if (optionalValue) {
    const width = document.createElement("canvas");
    width.width = flag;
    width.height = floor;
    const putImageData = width.getContext("2d");
    if (!putImageData) {
      throw new Error("当前浏览器无法合成户型底图。");
    }
    putImageData.putImageData(optionalValue, 0, 0);
    fillStyle.drawImage(width, 0, 0);
  }
  return canvasToBlob(width);
}
function sanitizeExportFileName(argPrimary, argSecondary) {
  return String(argPrimary || "").normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || argSecondary;
}
function uniqueExportFileName(flag, argSecondary, idSet, argN = EXPORT_IMAGE_EXTENSION) {
  const value = sanitizeExportFileName(flag, "灯组-" + (argSecondary + 1));
  const string = String(argN).replace(/^\./, "");
  let uniqueExportNameSuffix = 1;
  let toLocaleLowerCaseVar = value + "." + string;
  while (idSet.has(toLocaleLowerCaseVar.toLocaleLowerCase())) {
    uniqueExportNameSuffix += 1;
    toLocaleLowerCaseVar = value + "-" + uniqueExportNameSuffix + "." + string;
  }
  idSet.add(toLocaleLowerCaseVar.toLocaleLowerCase());
  return toLocaleLowerCaseVar;
}
function captureCameraPoseSnapshot(item, argSecondary) {
  const value = orbitControls.target;
  return {
    mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
    position: {
      x: cameraCurrent.position.x,
      y: cameraCurrent.position.y,
      z: cameraCurrent.position.z
    },
    target: {
      x: value.x,
      y: value.y,
      z: value.z
    },
    aspect: item / argSecondary,
    visibleHeight: resetOrbitTarget(cameraCurrent, value),
    fov: cameraCurrent.isPerspectiveCamera ? cameraCurrent.fov : null
  };
}
function serializeFloorLightItem(argPrimary, scene = activeFloor()) {
  const computedValue = scene?.scene?.calibration?.pixelsPerMeter || 1;
  return {
    id: argPrimary.id,
    floorId: scene?.id || null,
    type: argPrimary.type,
    position: {
      x: argPrimary.x / computedValue,
      z: argPrimary.y / computedValue,
      elevation: floorStackOffsetY(scene) + (argPrimary.elevation || 0)
    },
    rotation: argPrimary.rotation || 0,
    verticalRotation: argPrimary.verticalRotation || 0,
    stripRollRotation: argPrimary.type === "striplight" && argPrimary.stripRollRotation || 0,
    size: {
      width: argPrimary.width,
      depth: argPrimary.depth
    },
    temperature: argPrimary.lightTemperature,
    brightness: argPrimary.lightBrightness,
    range: argPrimary.lightRange,
    angle: argPrimary.lightAngle
  };
}
function projectItemToScreenNorm(x46, scene, floorEntries = previewFloorEntries()) {
  if (!x46 || !scene || !cameraCurrent) {
    return null;
  }
  const computedValue = scene.scene?.calibration?.pixelsPerMeter || 1;
  let zeroValue = 0;
  let halfValue = Math.max(0, finite(x46.elevation, 0)) + Math.max(0.02, finite(x46.height, 0.1)) / 2;
  let count = 0;
  if (getPreviewFloorModeCurrent() === "all") {
    const value = (finite(x46.x, 0) - finite(scene.originX, 0)) / computedValue;
    const computedValueCurrent = (finite(x46.y, 0) - finite(scene.originY, 0)) / computedValue;
    const localValue = -THREE.MathUtils.degToRad(finite(scene.rotation, 0));
    zeroValue = value * Math.cos(localValue) + computedValueCurrent * Math.sin(localValue) + finite(scene.offsetX, 0);
    count = -value * Math.sin(localValue) + computedValueCurrent * Math.cos(localValue) + finite(scene.offsetZ, 0);
    const foundIndex = [...floorEntries].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation);
    const max = Math.max(0, foundIndex.findIndex(wall => wall.id === scene.id));
    halfValue += max * finite(projectDocCurrent.exportFloorGap, 3);
  } else {
    const walls = scene.scene;
    const minX = walls.walls?.length ? modelBounds({
      background: null,
      walls: walls.walls,
      items: []
    }) : walls.items?.length ? modelBounds({
      background: null,
      walls: [],
      items: walls.items
    }) : modelBounds(walls);
    zeroValue = (finite(x46.x, 0) - (minX.minX + minX.maxX) / 2) / computedValue;
    count = (finite(x46.y, 0) - (minX.minY + minX.maxY) / 2) / computedValue;
  }
  cameraCurrent.updateMatrixWorld(true);
  const z3 = new THREE.Vector3(zeroValue, halfValue, count).project(cameraCurrent);
  if (![z3.x, z3.y, z3.z].every(Number.isFinite) || z3.z < -1 || z3.z > 1) {
    return null;
  } else {
    return {
      x: clamp((z3.x + 1) / 2, 0, 1),
      y: clamp((1 - z3.y) / 2, 0, 1)
    };
  }
}
function projectItemsToScreenAnchors(argPrimary, argSecondary, floorEntries = previewFloorEntries()) {
  for (const localValue of argPrimary || []) {
    const norm = projectItemToScreenNorm(localValue, argSecondary, floorEntries);
    if (norm) {
      return norm;
    }
  }
  return null;
}
async function readFileAsUint8Array(arrayBuffer) {
  return new Uint8Array(await arrayBuffer.arrayBuffer());
}
function applyCrossFloorLayerEnableMasks(argPrimary = "", argSecondary = "", argTertiary = "") {
  for (const {
    key: localValue,
    group: enabled
  } of collectLightGroupsAcrossFloors()) {
    enabled.enabled = argPrimary === "*" || localValue === argPrimary;
  }
  for (const {
    key: localValue,
    item: screenEnabled
  } of collectTvsAcrossFloors()) {
    screenEnabled.screenEnabled = argSecondary === "*" || localValue === argSecondary;
  }
  for (const {
    key: localValue,
    item: chargingEnabled
  } of collectSmallCarsAcrossFloors()) {
    chargingEnabled.chargingEnabled = argTertiary === "*" || localValue === argTertiary;
  }
  rebuildWorldPreviewCurrent();
}
function setExportRoleVisibility(reason, message) {
  if (worldGroup) {
    worldGroup.traverse(userData => {
      if (userData.userData?.exportRole === reason) {
        userData.visible = message;
      }
    });
    requestRender({
      shadows: reason === "plan"
    });
  }
}
function notifyAutoDiagramInteraction(active) {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-interaction",
      componentId: autoDiagramComponentId,
      active: active === true
    }, window.location.origin);
  }
}
function resolveExportOverwrite(argPrimary = "cancel") {
  const value = exportOverwriteResolverCurrent;
  exportOverwriteResolverCurrent = null;
  if (exportOverwriteDialog.open) {
    exportOverwriteDialog.close();
  }
  notifyAutoDiagramInteraction(false);
  value?.(argPrimary);
}
function promptExportOverwrite(argPrimary) {
  if (exportOverwriteResolverCurrent) {
    resolveExportOverwrite("cancel");
  }
  Mg.textContent = argPrimary;
  notifyAutoDiagramInteraction(true);
  exportOverwriteDialog.showModal();
  return new Promise(argPrimary => {
    exportOverwriteResolverCurrent = argPrimary;
  });
}
function notifyAutoDiagramExport(argPrimary, message) {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-stopped",
      componentId: autoDiagramComponentId,
      reason: argPrimary,
      message: message
    }, window.location.origin);
  }
}
function showExportCompleteDialog(overwritten) {
  const flag = overwritten?.overwritten === true;
  Sg.textContent = flag ? "导图覆盖完成" : "导图保存完成";
  Pg.textContent = flag ? "新导图已经安全替换原文件夹，已有仪表盘中的同名图片会自动更新。" : "导出的图片和数据已经保存到 NAS，可以在编辑器素材中继续使用。";
  Eg.textContent = "data/" + (overwritten?.relativePath || "exports");
  if (!exportCompleteDialog.open) {
    exportCompleteDialog.showModal();
  }
}
async function runExportPipeline() {
  if (!stageSession || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  const exportName = exportFolderName.value.trim();
  if (!exportName || /[<>:\"/\\|?*\x00-\x1f\x7f]/.test(exportName) || exportName.startsWith(".") || /[. ]$/.test(exportName)) {
    exportFolderName.classList.add("invalid");
    exportFolderName.focus();
    exportStatus.textContent = "请输入有效的文件夹名";
    return;
  }
  exportFolderName.classList.remove("invalid");
  const value = checkedExportFileKeys();
  if (!value.size) {
    exportStatus.textContent = "请至少勾选一项图片";
    return;
  }
  const sourceResolution = readExportResolution();
  const {
    width,
    height
  } = scaledExportResolution(sourceResolution.width, sourceResolution.height, EXPORT_RENDER_SCALE);
  const view = serializeCameraState();
  const background = {
    background: "00底图." + EXPORT_IMAGE_EXTENSION,
    backgroundWithPlan: "00底图带户型." + EXPORT_IMAGE_EXTENSION,
    floorPlan: "00户型图." + EXPORT_IMAGE_EXTENSION
  };
  const idSet = new Set(Object.values(background).map(fileNameCandidate => fileNameCandidate.toLocaleLowerCase()));
  const list = previewFloorEntries();
  const filtered = collectLightGroupsAcrossFloors(list).map(({
    floor,
    group,
    index,
    key: id
  }) => ({
    id: id,
    groupId: group.id,
    floor,
    name: list.length > 1 ? floor.name + "-" + group.name : group.name,
    enabledInEditor: stageSession.groupStates.get(id) !== false,
    file: uniqueExportFileName(list.length > 1 ? floor.name + "-" + group.name : group.name, index, idSet),
    lights: floor.scene.items.filter(item => set.has(item.type) && item.lightGroupId === group.id)
  })).filter(id => value.has("group:" + id.id));
  const mapped = collectTvsAcrossFloors(list).map(({
    floor,
    item,
    index,
    key
  }) => ({
    id: "screen-" + key,
    key,
    floorId: floor.id,
    itemId: item.id,
    name: "" + (list.length > 1 ? floor.name + "-" : "") + (item.screenLayerName || "电视画面 " + (index + 1)),
    enabledInEditor: stageSession.tvStates.get(key) !== false,
    floor,
    item,
    file: null
  }));
  const listCurrent = collectSmallCarsAcrossFloors(list).map(({
    floor,
    item,
    index,
    key
  }) => ({
    id: "vehicle-" + key,
    key,
    floorId: floor.id,
    itemId: item.id,
    name: "" + (list.length > 1 ? floor.name + "-" : "") + (item.chargingLayerName || "汽车充电 " + (index + 1)),
    chargingInEditor: stageSession.carChargingStates.get(key) === true,
    floor,
    item,
    file: null
  }));
  for (let count = 0; count < mapped.length; count += 1) {
    const file = mapped[count];
    file.file = uniqueExportFileName(file.name, count, idSet);
  }
  for (let count = 0; count < listCurrent.length; count += 1) {
    const file = listCurrent[count];
    file.file = uniqueExportFileName(file.name, count, idSet);
  }
  const listNext = mapped.filter(key => value.has("screen:" + key.key));
  const listPrevious = listCurrent.filter(key => value.has("vehicle:" + key.key));
  const flag = value.has("backgroundWithPlan") || value.has("floorPlan") || listNext.length > 0 || listPrevious.length > 0 || filtered.length > 0;
  let flagCurrent = false;
  setOrbitSuspended(true);
  try {
    exportStatus.textContent = "正在检查文件夹名…";
    if ((await studioFetch("/studio3d/exports/check", {
      headers: {
        "X-Export-Folder": encodeURIComponent(exportName)
      }
    }))?.exists) {
      exportStatus.textContent = "同名导图“" + exportName + "”已经存在";
      const local = await promptExportOverwrite(exportName);
      if (local === "rename") {
        exportStatus.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          exportFolderName.focus();
          exportFolderName.select();
        }, 0);
        notifyAutoDiagramExport("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (local !== "overwrite") {
        exportStatus.textContent = "已取消覆盖，原导图保持不变";
        notifyAutoDiagramExport("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      flagCurrent = true;
    }
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    applyStoredCameraPose(view, width / height);
    setShadowCameraExpanded(true);
    exportStatus.textContent = "正在生成精细阴影导出图层…";
    applyCrossFloorLayerEnableMasks();
    let isImageData = null;
    let imageData = null;
    if (value.has("background")) {
      setExportRoleVisibility("plan", false);
      setExportRoleVisibility("label", false);
      setExportRoleVisibility("outline", false);
      isImageData = await capturePreviewCanvasCurrent(width, height, {
        pixels: true
      });
      setExportRoleVisibility("plan", true);
      setExportRoleVisibility("label", true);
      setExportRoleVisibility("outline", true);
    }
    if (flag) {
      imageData = await capturePreviewCanvasCurrent(width, height, {
        pixels: true
      });
    }
    const listLocal = [];
    if (isImageData) {
      const arrayBuffer = await buildExportImageCanvas(width, height, isImageData.imageData);
      listLocal.push({
        name: background.background,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    if (value.has("backgroundWithPlan")) {
      const arrayBuffer = await buildExportImageCanvas(width, height, imageData.imageData);
      listLocal.push({
        name: background.backgroundWithPlan,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    if (value.has("floorPlan")) {
      setExportRoleVisibility("background", false);
      setExportRoleVisibility("grid", false);
      const blob = await capturePreviewCanvasCurrent(width, height, {
        blob: true
      });
      setExportRoleVisibility("background", true);
      setExportRoleVisibility("grid", true);
      listLocal.push({
        name: background.floorPlan,
        data: await readFileAsUint8Array(blob.blob)
      });
    }
    for (let count = 0; count < filtered.length; count += 1) {
      const lights = filtered[count];
      const arrayBuffer = await drawExportAnnotations(imageData.imageData, lights, width, height, count, filtered.length);
      listLocal.push({
        name: lights.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    for (let count = 0; count < listNext.length; count += 1) {
      const named = listNext[count];
      exportStatus.textContent = "正在生成电视图层 " + (count + 1) + "/" + listNext.length + "：" + named.name;
      applyCrossFloorLayerEnableMasks("", named.key);
      const canvas = await capturePreviewCanvasCurrent(width, height, {
        pixels: true
      });
      const arrayBuffer = await composeExportCanvas(imageData.imageData, canvas.imageData);
      listLocal.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    for (let count = 0; count < listPrevious.length; count += 1) {
      const named = listPrevious[count];
      exportStatus.textContent = "正在生成汽车图层 " + (count + 1) + "/" + listPrevious.length + "：" + named.name;
      applyCrossFloorLayerEnableMasks("", "", named.key);
      const canvas = await capturePreviewCanvasCurrent(width, height, {
        pixels: true
      });
      const arrayBuffer = await composeExportCanvas(imageData.imageData, canvas.imageData);
      listLocal.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    const manifest = {
      schemaVersion: 3,
      exportName,
      floorMode: getPreviewFloorModeCurrent(),
      floorPresentationGap: getPreviewFloorModeCurrent() === "all" ? finite(projectDocCurrent.exportFloorGap, 3) : 0,
      floors: list.map(id => ({
        id: id.id,
        name: id.name,
        elevation: floorStackOffsetY(id),
        offsetX: id.offsetX,
        offsetZ: id.offsetZ,
        rotation: id.rotation
      })),
      generatedAt: new Date().toISOString(),
      resolution: {
        width,
        height
      },
      sourceResolution,
      renderScale: EXPORT_RENDER_SCALE,
      imageFormat: {
        extension: EXPORT_IMAGE_EXTENSION,
        mimeType: EXPORT_IMAGE_MIME_TYPE,
        quality: EXPORT_IMAGE_QUALITY
      },
      camera: captureCameraPoseSnapshot(width, height),
      backgroundImage: value.has("background") ? background.background : null,
      baseImage: value.has("backgroundWithPlan") ? background.backgroundWithPlan : null,
      floorPlanImage: value.has("floorPlan") ? background.floorPlan : null,
      televisionOnImage: listNext.length === 1 ? listNext[0].file : null,
      televisionOnImages: listNext.map(file => file.file),
      vehicleChargingImage: listPrevious.length === 1 ? listPrevious[0].file : null,
      vehicleChargingImages: listPrevious.map(file => file.file),
      exportedFiles: listLocal.map(named => named.name),
      groups: filtered.map(floor => ({
        id: floor.id,
        groupId: floor.groupId,
        floorId: floor.floor.id,
        name: floor.name,
        file: floor.file,
        anchor: projectItemsToScreenAnchors(floor.lights, floor.floor, list),
        enabledInEditor: floor.enabledInEditor,
        lights: floor.lights.map(item => serializeFloorLightItem(item, floor.floor))
      })),
      screens: mapped.map(({
        key,
        floor,
        item,
        ...argPrimary
      }) => ({
        ...argPrimary,
        anchor: projectItemToScreenNorm(item, floor, list),
        file: value.has("screen:" + key) ? argPrimary.file : null
      })),
      vehicles: listCurrent.map(({
        key,
        floor,
        item,
        ...argPrimary
      }) => ({
        ...argPrimary,
        anchor: projectItemToScreenNorm(item, floor, list),
        file: value.has("vehicle:" + key) ? argPrimary.file : null
      }))
    };
    if (value.has("dataLights")) {
      listLocal.push({
        name: "lights.json",
        data: new TextEncoder().encode(JSON.stringify(manifest, null, 2) + "\n")
      });
    }
    if (value.has("dataScene")) {
      const previewFloorMode = getPreviewFloorModeCurrent() === "all" ? cloneProjectDoc() : cloneFloorScene();
      listLocal.push({
        name: "scene.json",
        data: new TextEncoder().encode(JSON.stringify(previewFloorMode, null, 2) + "\n")
      });
    }
    exportStatus.textContent = "正在打包 ZIP…";
    const zip = buildStoredZip(listLocal);
    exportStatus.textContent = "正在保存到 NAS data…";
    const body = new Blob([zip], {
      type: "application/zip"
    });
    const putStudioDocument = (flag = false) => studioFetch("/studio3d/exports", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/zip",
        "X-Export-Folder": encodeURIComponent(exportName),
        ...(flag ? {
          "X-Export-Overwrite": "true"
        } : {})
      }
    });
    let overwritten;
    try {
      overwritten = await putStudioDocument(flagCurrent);
    } catch (error) {
      if (error?.status !== 409 || error?.payload?.detail?.code !== "STUDIO3D_EXPORT_EXISTS") {
        throw error;
      }
      exportStatus.textContent = "同名导图“" + exportName + "”已经存在";
      const local = await promptExportOverwrite(exportName);
      if (local === "rename") {
        exportStatus.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          exportFolderName.focus();
          exportFolderName.select();
        }, 0);
        notifyAutoDiagramExport("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (local !== "overwrite") {
        exportStatus.textContent = "已取消覆盖，原导图保持不变";
        notifyAutoDiagramExport("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      exportStatus.textContent = "正在安全覆盖原导图…";
      overwritten = await putStudioDocument(true);
    }
    exportStatus.textContent = "已保存到 data/" + overwritten.relativePath;
    showToast("导图已保存到 data/" + overwritten.relativePath, "success");
    const isClosed = isAutoDiagramEmbedCurrent ? window.parent : window.opener;
    if (autoDiagramComponentId && isClosed && (isAutoDiagramEmbedCurrent || !isClosed.closed)) {
      isClosed.postMessage({
        type: "ha-bridge-floorplan-auto-diagram-export",
        componentId: autoDiagramComponentId,
        folderName: exportName,
        manifest
      }, window.location.origin);
    }
    isExporting = true;
    updateProgressChecklist();
    showExportCompleteDialog(overwritten);
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-export",
      componentId: autoDiagramComponentId || ""
    });
    console.error(error);
    exportStatus.textContent = error?.message || "导出失败，请重试。";
    showToast(error?.message || "导图失败。", "error");
    if (isAutoDiagramEmbedCurrent && autoDiagramComponentId && window.parent !== window) {
      window.parent.postMessage({
        type: "ha-bridge-floorplan-auto-diagram-error",
        componentId: autoDiagramComponentId,
        message: error?.message || "后台生成失败，请重试。"
      }, window.location.origin);
    }
  } finally {
    setShadowCameraExpanded(false);
    for (const {
      key,
      group
    } of collectLightGroupsAcrossFloors()) {
      if (stageSession?.groupStates.has(key)) {
        group.enabled = stageSession.groupStates.get(key);
      }
    }
    for (const {
      key,
      item
    } of collectTvsAcrossFloors()) {
      if (stageSession?.tvStates.has(key)) {
        item.screenEnabled = stageSession.tvStates.get(key);
      }
    }
    for (const {
      key,
      item
    } of collectSmallCarsAcrossFloors()) {
      if (stageSession?.carChargingStates.has(key)) {
        item.chargingEnabled = stageSession.carChargingStates.get(key);
      }
    }
    rebuildWorldPreviewCurrent();
    applyStoredCameraPose(view, width / height);
    setOrbitSuspended(false);
    scheduleStageEmbedResize();
  }
}
function disposeObject3dResources(object3d) {
  const idSet = new Set();
  const set = new Set();
  object3d.traverse(object3d => {
    object3d.shadow?.dispose?.();
    if (object3d.geometry && !idSet.has(object3d.geometry) && !object3d.userData.externalModelSharedGeometry && !object3d.userData.sofaSharedGeometry && !object3d.userData.rugSharedGeometry && !object3d.userData.architectureSharedGeometry) {
      idSet.add(object3d.geometry);
      object3d.geometry.dispose?.();
    }
    const value = Array.isArray(object3d.material) ? object3d.material : object3d.material ? [object3d.material] : [];
    for (const entriesVar of value) {
      if (!set.has(entriesVar)) {
        set.add(entriesVar);
        if (!object3d.userData.externalModelSharedTextures) {
          entriesVar.map?.dispose?.();
        }
        if (!object3d.userData.sofaSharedMaterial && !object3d.userData.rugSharedMaterial && !object3d.userData.architectureSharedMaterial && !object3d.userData.externalModelSharedMaterial) {
          entriesVar.dispose?.();
        }
      }
    }
  });
}
function clearWorldGroupChildren() {
  if (worldGroup) {
    for (const object3d of [...worldGroup.children]) {
      worldGroup.remove(object3d);
      disposeObject3dResources(object3d);
    }
  }
}
function addBoxMesh(group, width, height, depth, argN, argNCurrent, argNNext, color, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.8,
    metalness: options.metalness ?? 0.01,
    transparent: !!options.transparent,
    opacity: options.opacity ?? 1,
    depthWrite: options.depthWrite ?? true,
    depthFunc: options.depthFunc ?? THREE.LessEqualDepth,
    side: options.side ?? THREE.FrontSide,
    emissive: options.emissive ?? 0,
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
  const minDim = Math.max(Math.min(width, height, depth), 0.001);
  const radius = Math.min(options.radius ?? minDim * 0.14, minDim * 0.45, 0.08);
  const geometry = options.rounded === false || group.userData.squareEdges ? new THREE.BoxGeometry(width, height, depth) : new RoundedBoxGeometry(width, height, depth, options.segments ?? 2, radius);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(argN, argNCurrent, argNNext);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  mesh.renderOrder = options.renderOrder ?? 0;
  group.add(mesh);
  return mesh;
}
function normalizeBoxPartSpec(point) {
  if (Array.isArray(point)) {
    const [width, height, depth, x35 = 0, y2 = 0, z2 = 0, rotationY = 0] = point;
    return {
      width,
      height,
      depth,
      x: x35,
      y: y2,
      z: z2,
      rotationY
    };
  }
  return {
    width: point.width,
    height: point.height,
    depth: point.depth,
    x: point.x || 0,
    y: point.y || 0,
    z: point.z || 0,
    rotationY: point.rotationY || 0
  };
}
function buildMergedBoxGeometry(list) {
  const filtered = list.map(normalizeBoxPartSpec).filter(size => [size.width, size.height, size.depth].every(argPrimary => Number.isFinite(argPrimary) && argPrimary > 0.0001));
  if (!filtered.length) {
    return null;
  }
  const value = JSON.stringify(filtered.map(point => [point.width, point.height, point.depth, point.x, point.y, point.z, point.rotationY]));
  if (!mergedBoxGeometryCache.has(value)) {
    const item = filtered.map(point => {
      const applyMatrix = new THREE.BoxGeometry(point.width, point.height, point.depth);
      const vector = new THREE.Matrix4().compose(new THREE.Vector3(point.x, point.y, point.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, point.rotationY, 0)), new THREE.Vector3(1, 1, 1));
      return applyMatrix.applyMatrix4(vector);
    });
    const flag = mergeGeometries(item);
    item.forEach(dispose => dispose.dispose());
    if (!flag) {
      return null;
    }
    mergedBoxGeometryCache.set(value, flag);
  }
  return mergedBoxGeometryCache.get(value);
}
function getCachedMeshStandardMaterial(color, flag = {}) {
  const hex = new THREE.Color(color).getHex();
  const value = JSON.stringify([hex, flag.roughness ?? 0.8, flag.metalness ?? 0.01, !!flag.transparent, flag.opacity ?? 1, flag.depthWrite ?? true, flag.depthFunc ?? THREE.LessEqualDepth, flag.side ?? THREE.FrontSide, flag.emissive ?? 0, flag.emissiveIntensity ?? 0]);
  if (!rugMaterialCache.has(value)) {
    rugMaterialCache.set(value, new THREE.MeshStandardMaterial({
      color: hex,
      roughness: flag.roughness ?? 0.8,
      metalness: flag.metalness ?? 0.01,
      transparent: !!flag.transparent,
      opacity: flag.opacity ?? 1,
      depthWrite: flag.depthWrite ?? true,
      depthFunc: flag.depthFunc ?? THREE.LessEqualDepth,
      side: flag.side ?? THREE.FrontSide,
      emissive: flag.emissive ?? 0,
      emissiveIntensity: flag.emissiveIntensity ?? 0
    }));
  }
  return rugMaterialCache.get(value);
}
function addSharedArchMesh(group, entriesArg, argTertiary, roughness = {}) {
  const flag = buildMergedBoxGeometry(entriesArg);
  if (!flag) {
    return null;
  }
  const light = new THREE.Mesh(flag, getCachedMeshStandardMaterial(argTertiary, roughness));
  light.castShadow = roughness.castShadow !== false;
  light.receiveShadow = roughness.receiveShadow !== false;
  light.renderOrder = roughness.renderOrder ?? 0;
  light.userData.architectureSharedGeometry = true;
  light.userData.architectureSharedMaterial = true;
  group.add(light);
  return light;
}
function createBoxPartMesh(argPrimary, argSecondary, argTertiary, argN, argNCurrent, argNNext) {
  const value = Math.max(Math.min(argPrimary, argSecondary, argTertiary), 0.001);
  const minValue = Math.min(value * 0.14, value * 0.45, 0.08);
  const boxGeometry = new RoundedBoxGeometry(argPrimary, argSecondary, argTertiary, 2, minValue);
  boxGeometry.translate(argN, argNCurrent, argNNext);
  return boxGeometry;
}
function mergeBoxPartGeometries(list) {
  const item = list.map(argPrimary => createBoxPartMesh(...argPrimary));
  const geometries = mergeGeometries(item);
  item.forEach(dispose => dispose.dispose());
  return geometries;
}
function getCachedSofaSeatGeometry(argPrimary, argSecondary, argTertiary) {
  const list = argPrimary + ":" + argSecondary + ":" + argTertiary;
  if (lightPropertyMeta.has(list)) {
    return lightPropertyMeta.get(list);
  }
  const handler = mergeBoxPartGeometries([[argPrimary * 0.92, argSecondary * 0.28, argTertiary * 0.72, 0, argSecondary * 0.28, argTertiary * 0.06], [argPrimary * 0.92, argSecondary * 0.55, argTertiary * 0.18, 0, argSecondary * 0.56, -argTertiary * 0.35], [argPrimary * 0.1, argSecondary * 0.48, argTertiary * 0.75, -argPrimary * 0.46, argSecondary * 0.39, argTertiary * 0.03], [argPrimary * 0.1, argSecondary * 0.48, argTertiary * 0.75, argPrimary * 0.46, argSecondary * 0.39, argTertiary * 0.03]]);
  const geometries = mergeBoxPartGeometries([[argPrimary * 0.42, argSecondary * 0.12, argTertiary * 0.55, -argPrimary * 0.22, argSecondary * 0.47, argTertiary * 0.07], [argPrimary * 0.42, argSecondary * 0.12, argTertiary * 0.55, argPrimary * 0.22, argSecondary * 0.47, argTertiary * 0.07]]);
  const conditionalValue = handler && geometries ? {
    frame: handler,
    cushions: geometries
  } : null;
  if (conditionalValue) {
    lightPropertyMeta.set(list, conditionalValue);
  } else {
    handler?.dispose();
    geometries?.dispose();
  }
  return conditionalValue;
}
function getCachedColorMaterial(color) {
  const id = String(color);
  if (!colorMaterialCache.has(id)) {
    colorMaterialCache.set(id, new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.01,
      transparent: false,
      opacity: 1,
      depthWrite: true,
      depthFunc: THREE.LessEqualDepth,
      side: THREE.FrontSide,
      emissive: 0,
      emissiveIntensity: 0
    }));
  }
  return colorMaterialCache.get(id);
}
function addSofaMeshes(group, size, color, cushionColor) {
  const sofaGeometry = getCachedSofaSeatGeometry(size.width, size.height, size.depth);
  if (!sofaGeometry) {
    return false;
  }
  const selected = isSelected("item", size.id);
  for (const [geometry, meshColor] of [[sofaGeometry.frame, color], [sofaGeometry.cushions, cushionColor]]) {
    const material = selected ? getCachedColorMaterial(meshColor).clone() : getCachedColorMaterial(meshColor);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.sofaSharedGeometry = true;
    mesh.userData.sofaSharedMaterial = !selected;
    group.add(mesh);
  }
  return true;
}
function getCachedRoundedBoxGeometry(group, id, hasFlag) {
  const value = clamp(id, 0.004, 0.018);
  const flag = group + ":" + value + ":" + hasFlag;
  if (!isStudioRoute.has(flag)) {
    const localValue = Math.max(Math.min(group, value, hasFlag), 0.001);
    const min = Math.min(Math.min(group, hasFlag) * 0.018, localValue * 0.45, 0.08);
    const base = new RoundedBoxGeometry(group, value, hasFlag, 2, min);
    const inset = new THREE.PlaneGeometry(group * 0.88, hasFlag * 0.84);
    isStudioRoute.set(flag, {
      base,
      inset,
      rugThickness: value
    });
  }
  return isStudioRoute.get(flag);
}
function getCachedRugMaterial(object3d, flag = false) {
  const computedValue = (flag ? "inset" : "base") + ":" + object3d;
  if (!Zl.has(computedValue)) {
    Zl.set(computedValue, new THREE.MeshStandardMaterial({
      color: object3d,
      roughness: 1,
      metalness: 0,
      ...(flag ? {
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -4
      } : {})
    }));
  }
  return Zl.get(computedValue);
}
function addRugMeshes(group, size, color, colorCurrent) {
  const base = getCachedRoundedBoxGeometry(size.width, size.height, size.depth);
  if (!base) {
    return false;
  }
  const flag = isSelected("item", size.id);
  const value = flag ? getCachedRugMaterial(color).clone() : getCachedRugMaterial(color);
  const light = new THREE.Mesh(base.base, value);
  light.position.y = base.rugThickness * 0.5;
  light.castShadow = false;
  light.receiveShadow = true;
  light.userData.rugSharedGeometry = true;
  light.userData.rugSharedMaterial = !flag;
  group.add(light);
  const rugMaterialInstance = flag ? getCachedRugMaterial(colorCurrent, true).clone() : getCachedRugMaterial(colorCurrent, true);
  const object3d = new THREE.Mesh(base.inset, rugMaterialInstance);
  object3d.rotation.x = -Math.PI / 2;
  object3d.position.y = base.rugThickness + 0.001;
  object3d.castShadow = false;
  object3d.receiveShadow = true;
  object3d.renderOrder = 1;
  object3d.userData.rugSharedGeometry = true;
  object3d.userData.rugSharedMaterial = !flag;
  group.add(object3d);
  group.userData.optimizationStats = {
    type: "rug",
    before: 2,
    after: 2,
    sharedResources: true
  };
  return true;
}
function createGlassMaterial(color, flagCurrent = false, depthWrite = false) {
  const flag = color.material;
  if (!color.isMesh || color.isSkinnedMesh || color.isBatchedMesh || color.morphTargetInfluences || Array.isArray(flag) || !flag?.isMeshStandardMaterial || flag.transparent || flag.opacity < 1 || flag.transmission > 0 || flag.alphaHash || flag.displacementMap || flag.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile || flag.customProgramCacheKey !== THREE.Material.prototype.customProgramCacheKey || color.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender || flag.clippingPlanes?.length || !flagCurrent && Object.values(flag).some(isTexture => isTexture?.isTexture)) {
    return "";
  }
  const push = [];
  for (const localValue of Object.keys(flag).sort()) {
    if (["id", "uuid", "name", "userData", "version", "_listeners"].includes(localValue)) {
      continue;
    }
    const isTexture = flag[localValue];
    if (localValue === "color" && depthWrite) {
      push.push([localValue, [1, 1, 1]]);
      continue;
    }
    if (isTexture == null || ["number", "boolean", "string"].includes(typeof isTexture)) {
      push.push([localValue, isTexture]);
    } else if (isTexture.isTexture) {
      push.push([localValue, isTexture.uuid]);
    } else if (isTexture.isColor || isTexture.isVector2 || isTexture.isVector3 || isTexture.isVector4 || isTexture.isMatrix3 || isTexture.isMatrix4 || isTexture.isEuler) {
      push.push([localValue, isTexture.toArray()]);
    } else if (Array.isArray(isTexture) && isTexture.every(argPrimary => ["number", "boolean", "string"].includes(typeof argPrimary))) {
      push.push([localValue, isTexture]);
    } else if (localValue === "defines") {
      push.push([localValue, Object.entries(isTexture).sort(([localeCompare], [argSecondary]) => localeCompare.localeCompare(argSecondary))]);
    } else {
      return "";
    }
  }
  return JSON.stringify([push, color.castShadow, color.receiveShadow, color.renderOrder, color.layers.mask]);
}
function meshMaterialSignature(light) {
  const material = Object.entries(light.geometry?.attributes || {}).sort(([localeCompare], [argSecondary]) => localeCompare.localeCompare(argSecondary)).map(([argPrimary, itemSize]) => [argPrimary, itemSize.itemSize, itemSize.normalized, itemSize.array?.constructor?.name]);
  return JSON.stringify([!!light.geometry?.index, material, Object.keys(light.geometry?.morphAttributes || {}).sort()]);
}
function collectDescendantMeshes(geometry) {
  const value = [];
  geometry.traverse(isMesh => {
    if (isMesh !== geometry && isMesh.isMesh) {
      value.push(isMesh);
    }
  });
  return value;
}
function collectChildMeshes(object3d) {
  const list = object3d.material;
  if (Array.isArray(list) || !list?.isMeshStandardMaterial) {
    return "";
  } else {
    return JSON.stringify([list.color?.getHex(), list.roughness, list.metalness, list.emissive?.getHex(), list.emissiveIntensity, list.side, list.transparent, list.opacity, list.depthWrite, list.depthTest, list.depthFunc, list.blending, list.polygonOffset, list.polygonOffsetFactor, list.polygonOffsetUnits, list.map?.uuid || ""]);
  }
}
function mergeSimilarItemMeshes(object3d, type) {
  if (!Gg.has(type)) {
    return;
  }
  const list = collectDescendantMeshes(object3d);
  const beforeCount = new Map();
  const lookupMap = new Map();
  for (const light of list) {
    const flag = light.geometry?.parameters;
    const mergedGeometryCacheKey = flag ? light.geometry.type + ":" + JSON.stringify(flag) : "";
    if (mergedGeometryCacheKey && beforeCount.has(mergedGeometryCacheKey)) {
      light.geometry.dispose();
      light.geometry = beforeCount.get(mergedGeometryCacheKey);
    } else if (mergedGeometryCacheKey) {
      beforeCount.set(mergedGeometryCacheKey, light.geometry);
    }
    const localValue = collectChildMeshes(light);
    if (localValue && lookupMap.has(localValue)) {
      light.material.dispose();
      light.material = lookupMap.get(localValue);
    } else if (localValue) {
      lookupMap.set(localValue, light.material);
    }
  }
  object3d.userData.optimizationStats = {
    type,
    before: list.length,
    after: list.length,
    uniqueGeometries: new Set(list.map(geometry => geometry.geometry)).size,
    uniqueMaterials: new Set(list.map(material => material.material)).size
  };
}
function addStripLightHelpers(updateMatrixWorld, item) {
  if (!hasProjectLoaded.has(item) || item === "curtain") {
    return;
  }
  const group = collectDescendantMeshes(updateMatrixWorld);
  const emissive = group.length;
  const clamp = new Map();
  for (const userData of group) {
    if (userData.userData.televisionScreen || userData.userData.televisionGlow || userData.userData.curtainPart) {
      continue;
    }
    const localValue = createGlassMaterial(userData);
    if (!localValue) {
      continue;
    }
    const computedValue = localValue + ":" + meshMaterialSignature(userData);
    if (!clamp.has(computedValue)) {
      clamp.set(computedValue, []);
    }
    clamp.get(computedValue).push(userData);
  }
  updateMatrixWorld.updateMatrixWorld(true);
  const invert = updateMatrixWorld.matrixWorld.clone().invert();
  for (const length of clamp.values()) {
    if (length.length < 2) {
      continue;
    }
    const forEach = length.map(matrixWorld => {
      const localValue = new THREE.Matrix4().multiplyMatrices(invert, matrixWorld.matrixWorld);
      return matrixWorld.geometry.clone().applyMatrix4(localValue);
    });
    const localValue = mergeGeometries(forEach);
    forEach.forEach(dispose => dispose.dispose());
    if (!localValue) {
      continue;
    }
    const material = length[0];
    const castShadow = new THREE.Mesh(localValue, material.material);
    castShadow.castShadow = material.castShadow;
    castShadow.receiveShadow = material.receiveShadow;
    castShadow.renderOrder = material.renderOrder;
    castShadow.userData = {};
    length.forEach((parent, argSecondary) => {
      parent.parent?.remove(parent);
      if (!parent.userData.externalModelSharedGeometry) {
        parent.geometry.dispose();
      }
      if (argSecondary > 0) {
        parent.material.dispose();
      }
    });
    updateMatrixWorld.add(castShadow);
  }
  updateMatrixWorld.userData.optimizationStats = {
    type: item,
    before: emissive,
    after: collectDescendantMeshes(updateMatrixWorld).length
  };
}
function addSoftBoxMesh(group, argSecondary, argTertiary, argN, argNCurrent, argNNext, argNPrevious, color, light = {}) {
  const value = new THREE.MeshStandardMaterial({
    color,
    roughness: light.roughness ?? 0.62,
    metalness: light.metalness ?? 0.03,
    transparent: !!light.transparent,
    opacity: light.opacity ?? 1,
    depthWrite: light.depthWrite ?? true
  });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(argSecondary, argTertiary, argN, light.segments ?? 24), value);
  mesh.position.set(argNCurrent, argNNext, argNPrevious);
  if (light.rotationX) {
    mesh.rotation.x = light.rotationX;
  }
  if (light.rotationZ) {
    mesh.rotation.z = light.rotationZ;
  }
  mesh.castShadow = light.castShadow !== false;
  mesh.receiveShadow = light.receiveShadow !== false;
  group.add(mesh);
  return mesh;
}
function materialFingerprint(material) {
  material.userData.exportRole = "light-source-preview";
  material.castShadow = false;
  material.receiveShadow = false;
  material.renderOrder = 20;
  return material;
}
function applySelectionHighlight(object3d, flag) {
  if (flag.type !== "striplight") {
    return;
  }
  const value = new THREE.Group();
  value.userData.exportRole = "light-source-preview";
  value.userData.lightSourcePreview = true;
  value.visible = flag.lightSourceVisible !== false && !stageSession && isSelected("item", flag.id);
  const emissive = kelvinToRgbHex(flag.lightTemperature) || 16762219;
  const clampedValue = clamp(finite(flag.depth, 0.28), 0.1, 8);
  const clampedValueCurrent = clamp(finite(flag.width, 1), 0.1, 8);
  const localValue = clampedValue;
  const rotation = new THREE.Group();
  rotation.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(flag.verticalRotation));
  const group = new THREE.Group();
  group.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(flag.stripRollRotation));
  const clampedValueNext = clamp(finite(flag.lightRange, 3.5) * 0.16, 0.28, 0.72);
  materialFingerprint(addBoxMesh(group, clampedValueCurrent, 0.014, localValue, 0, -clampedValueNext, 0, emissive, {
    rounded: false,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    emissive,
    emissiveIntensity: 0.68,
    castShadow: false,
    receiveShadow: false
  }));
  materialFingerprint(addSoftBoxMesh(group, 0.012, 0.012, clampedValueNext, 0, -clampedValueNext * 0.5, 0, emissive, {
    segments: 10,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    roughness: 0.3,
    emissive,
    emissiveIntensity: 0.8
  }));
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 10), new THREE.MeshBasicMaterial({
    color: emissive,
    transparent: true,
    opacity: 0.82,
    depthWrite: false
  }));
  mesh.rotation.x = Math.PI;
  mesh.position.set(0, -clampedValueNext, 0);
  materialFingerprint(mesh);
  group.add(mesh);
  rotation.add(group);
  value.add(rotation);
  object3d.add(value);
}
function createWallTopMaterial(flag, argSecondary, argTertiary) {
  const list = [{
    y: 0,
    halfWidth: flag * 0.31,
    backZ: -argSecondary * 0.16,
    sideZ: argSecondary * 0.08,
    frontZ: argSecondary * 0.46
  }, {
    y: argTertiary * 0.42,
    halfWidth: flag * 0.43,
    backZ: -argSecondary * 0.34,
    sideZ: argSecondary * 0.08,
    frontZ: argSecondary * 0.47
  }, {
    y: argTertiary * 0.72,
    halfWidth: flag * 0.49,
    backZ: -argSecondary * 0.47,
    sideZ: argSecondary * 0.08,
    frontZ: argSecondary * 0.47
  }];
  const helperFn = halfWidth => {
    const push = [new THREE.Vector3(-halfWidth.halfWidth, halfWidth.y, halfWidth.backZ), new THREE.Vector3(halfWidth.halfWidth, halfWidth.y, halfWidth.backZ), new THREE.Vector3(halfWidth.halfWidth, halfWidth.y, halfWidth.sideZ)];
    for (let oneValue = 1; oneValue <= 18; oneValue += 1) {
      const halfValue = oneValue / 18 * Math.PI;
      push.push(new THREE.Vector3(Math.cos(halfValue) * halfWidth.halfWidth, halfWidth.y, halfWidth.sideZ + Math.sin(halfValue) * (halfWidth.frontZ - halfWidth.sideZ)));
    }
    return push;
  };
  const length = list.map(helperFn);
  const lengthValue = length[0].length;
  const flattened = length.flatMap(flatMap => flatMap.flatMap(point => [point.x, point.y, point.z]));
  const push = [];
  for (let ring = 0; ring < length.length - 1; ring += 1) {
    const ringBase = ring * lengthValue;
    const nextRingBase = (ring + 1) * lengthValue;
    for (let i = 0; i < lengthValue; i += 1) {
      const next = (i + 1) % lengthValue;
      const a = ringBase + i;
      const b = ringBase + next;
      const c = nextRingBase + i;
      const d = nextRingBase + next;
      push.push(a, d, b, a, c, d);
    }
  }
  const topCenter = flattened.length / 3;
  flattened.push(0, list[0].y, argSecondary * 0.08);
  const bottomCenter = flattened.length / 3;
  flattened.push(0, list.at(-1).y, argSecondary * 0.08);
  const lastRingBase = (length.length - 1) * lengthValue;
  for (let i = 0; i < lengthValue; i += 1) {
    const next = (i + 1) % lengthValue;
    push.push(topCenter, i, next);
    push.push(bottomCenter, lastRingBase + next, lastRingBase + i);
  }
  const setAttribute = new THREE.BufferGeometry();
  setAttribute.setAttribute("position", new THREE.Float32BufferAttribute(flattened, 3));
  setAttribute.setIndex(push);
  setAttribute.computeVertexNormals();
  setAttribute.computeBoundingSphere();
  return setAttribute;
}
function buildTelevisionMesh(group, argSecondary, argTertiary, argN, argNCurrent, argNNext, argNPrevious, color, colorCurrent) {
  const groupCurrent = new THREE.Group();
  const computedValue = argN * 0.49;
  const height = argN * 0.12;
  const computedValueCurrent = -argTertiary * 0.39;
  addBoxMesh(groupCurrent, argSecondary * 0.9, height, argTertiary * 0.82, 0, computedValue, argTertiary * 0.02, color, {
    radius: Math.min(argSecondary, argTertiary) * 0.06,
    roughness: 0.72
  });
  addBoxMesh(groupCurrent, argSecondary * 0.78, argN * 0.34, argTertiary * 0.09, 0, argN * 0.78, computedValueCurrent, color, {
    radius: Math.min(argSecondary, argTertiary) * 0.045,
    roughness: 0.72
  });
  for (const value of [-0.38, 0.38]) {
    addBoxMesh(groupCurrent, 0.05, argN * 0.47, 0.05, argSecondary * value, argN * 0.235, argTertiary * 0.34, colorCurrent, {
      rounded: false
    });
    addBoxMesh(groupCurrent, 0.05, argN * 0.94, 0.05, argSecondary * value, argN * 0.47, computedValueCurrent, colorCurrent, {
      rounded: false
    });
  }
  groupCurrent.position.set(argNCurrent, 0, argNNext);
  groupCurrent.rotation.y = argNPrevious;
  group.add(groupCurrent);
}
function stairRiserMaterialOptions(group, argSecondary, value, param) {
  const light = {
    rounded: false,
    metalness: 0.18,
    roughness: 0.36,
    castShadow: false,
    receiveShadow: false
  };
  const list = [];
  const entriesVar = [];
  for (const size of argSecondary) {
    const minValue = Math.min(0.045, size.width * 0.08, size.height * 0.04);
    const maxValue = Math.max(size.width - minValue * 2, 0.04);
    const max = Math.max(size.height - minValue * 2, 0.08);
    list.push([maxValue, max, 0.018, size.centerX, size.height / 2, size.centerZ]);
    entriesVar.push([size.width, minValue, 0.045, size.centerX, minValue / 2, size.centerZ], [size.width, minValue, 0.045, size.centerX, size.height - minValue / 2, size.centerZ], [minValue, size.height, 0.045, size.centerX - size.width / 2 + minValue / 2, size.height / 2, size.centerZ], [minValue, size.height, 0.045, size.centerX + size.width / 2 - minValue / 2, size.height / 2, size.centerZ]);
  }
  for (const tupleItem of list) {
    addSharedArchMesh(group, [tupleItem], param, {
      rounded: false,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.08,
      metalness: 0.03,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 7
    });
  }
  addSharedArchMesh(group, entriesVar, value, light);
}
function countShadowLights(traverse, argSecondary) {
  if (!argSecondary) {
    return;
  }
  const maxTextureUnits = resolvedThemeColors();
  traverse.traverse(material => {
    const conditionalValue = Array.isArray(material.material) ? material.material : material.material ? [material.material] : [];
    for (const isMeshStandardMaterial of conditionalValue) {
      if (isMeshStandardMaterial?.isMeshStandardMaterial) {
        isMeshStandardMaterial.emissive = new THREE.Color(maxTextureUnits.accent);
        isMeshStandardMaterial.emissiveIntensity = 0.32;
      }
    }
  });
}
function markAsLightSourcePreview(light) {
  const rect = document.createElement("canvas");
  rect.width = 2048;
  rect.height = 640;
  const context = rect.getContext("2d");
  context.clearRect(0, 0, rect.width, rect.height);
  context.fillStyle = "#929baa";
  context.textAlign = "left";
  context.textBaseline = "middle";
  const normalizedLabel = normalizeLabelText(light.title, "家庭总览", 24);
  const text = normalizeLabelText(light.subtitle, "HOME PLAN", 36);
  const numericValue = 115;
  const count = 184;
  context.font = "700 " + count + "px sans-serif";
  drawTrackedText(context, normalizedLabel, numericValue, 130, count * clamp(finite(light.titleSpacing, 1.05), 0, 1.8), 1340);
  const numericValueCurrent = 1580;
  const numericValueNext = 130;
  const numericValuePrevious = 170;
  context.fillStyle = "#929baa";
  context.beginPath();
  context.moveTo(numericValueCurrent, numericValueNext - numericValuePrevious * 0.58);
  context.lineTo(numericValueCurrent + numericValuePrevious * 0.56, numericValueNext - numericValuePrevious * 0.02);
  context.lineTo(numericValueCurrent + numericValuePrevious * 0.38, numericValueNext - numericValuePrevious * 0.02);
  context.lineTo(numericValueCurrent + numericValuePrevious * 0.38, numericValueNext + numericValuePrevious * 0.5);
  context.lineTo(numericValueCurrent - numericValuePrevious * 0.38, numericValueNext + numericValuePrevious * 0.5);
  context.lineTo(numericValueCurrent - numericValuePrevious * 0.38, numericValueNext - numericValuePrevious * 0.02);
  context.lineTo(numericValueCurrent - numericValuePrevious * 0.56, numericValueNext - numericValuePrevious * 0.02);
  context.closePath();
  context.fill();
  context.save();
  context.globalCompositeOperation = "destination-out";
  context.fillRect(numericValueCurrent - numericValuePrevious * 0.09, numericValueNext + numericValuePrevious * 0.2, numericValuePrevious * 0.18, numericValuePrevious * 0.3);
  context.restore();
  context.fillStyle = "#929baa";
  context.textAlign = "left";
  const numericValueLocal = 310;
  context.font = "400 " + numericValueLocal + "px \"Arial Narrow\", Arial, sans-serif";
  drawTrackedText(context, text, 72, 410, numericValueLocal * clamp(finite(light.subtitleSpacing, 0.08), 0, 0.6), 1880);
  const numericValueItem = 74;
  const computedValue = numericValueItem + clamp(finite(light.lineLength, 0.86), 0.3, 1) * 1880;
  context.strokeStyle = "rgba(146, 155, 170, 0.72)";
  context.lineWidth = 16;
  context.beginPath();
  context.moveTo(numericValueItem, 590);
  context.lineTo(computedValue, 590);
  context.moveTo(numericValueItem, 566);
  context.lineTo(numericValueItem, 614);
  context.moveTo(computedValue, 566);
  context.lineTo(computedValue, 614);
  context.stroke();
  const colorSpace = new THREE.CanvasTexture(rect);
  colorSpace.colorSpace = THREE.SRGBColorSpace;
  colorSpace.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  colorSpace.needsUpdate = true;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(light.width, light.depth), new THREE.MeshBasicMaterial({
    map: colorSpace,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    forceSinglePass: isStageEmbed
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.008;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.renderOrder = 8;
  return mesh;
}
function shadowCastingLightIdSet() {
  return new Set(selectShadowCastingLightIds(floorSceneCurrent.items.map(id => ({
    id: id.id,
    groupId: id.lightGroupId,
    type: id.type,
    brightness: finite(id.lightBrightness, defaultLightPresets[id.type]?.brightness || 0),
    enabled: set.has(id.type) && isLightGroupVisible(id)
  })), b0));
}
function createPlanLabelSprite(size) {
  if (!size || size.isMeshBasicMaterial || size.isShadowMaterial) {
    return 0;
  }
  let lengthValue = Object.values(size).filter(isTexture => isTexture?.isTexture === true).length;
  if (size.isMeshPhysicalMaterial && finite(size.transmission, 0) > 0) {
    lengthValue += 1;
  }
  return lengthValue;
}
function countMaterialTextures(traverse = worldGroup) {
  let length = 0;
  traverse?.traverse(material => {
    if (!material.isMesh) {
      return;
    }
    const conditionalValue = Array.isArray(material.material) ? material.material : material.material ? [material.material] : [];
    for (const localValue of conditionalValue) {
      length = Math.max(length, createPlanLabelSprite(localValue));
    }
  });
  if (previewSceneCurrent?.environment?.isTexture) {
    length += 1;
  }
  return length;
}
function maxTextureUnits() {
  const getParameter = renderer?.getContext?.();
  const value = getParameter?.getParameter?.(getParameter.MAX_TEXTURE_IMAGE_UNITS);
  return Math.max(1, Math.floor(finite(value, renderer?.capabilities?.maxTextures || 16)));
}
function countSceneMeshes(object3d = worldGroup) {
  const value = [];
  object3d?.traverse(object3d => {
    if (!object3d.isSpotLight || object3d.userData?.shadowCandidate !== true) {
      return;
    }
    const isArrayResult = String(object3d.userData?.lightFloorId || "");
    const localValue = String(object3d.userData?.lightItemId || "");
    if (localValue) {
      value.push({
        id: isArrayResult + ":" + localValue,
        groupId: isArrayResult + ":" + String(object3d.userData?.lightGroupId || ""),
        type: String(object3d.userData?.lightType || "downlight"),
        brightness: finite(object3d.userData?.lightBrightness, 0),
        enabled: object3d.visible !== false
      });
    }
  });
  return value;
}
function syncSpotShadowCastingLights(traverse = worldGroup, {
  rebuildAtlas: options = true
} = {}) {
  if (yt) {
    traverse?.traverse(isLight => {
      if (isLight.isLight && isLight.userData?.lightItemId) {
        isLight.castShadow = false;
        isLight.layers.set(30);
      }
    });
    if (renderer) {
      renderer.domElement.dataset.spotShadowMode = "region";
      renderer.domElement.dataset.activeSpotShadows = "0";
    }
    return 0;
  }
  if (!traverse || !renderer) {
    return 0;
  }
  const flag = maxTextureUnits();
  const textures = countMaterialTextures(traverse);
  let nonSpotShadowTextureUnits = 0;
  previewSceneCurrent?.traverse(visible => {
    if (visible.visible !== false && visible.isLight && !visible.isSpotLight && visible.castShadow) {
      nonSpotShadowTextureUnits += 1;
    }
  });
  let boolFlag = false;
  traverse.traverse(visible => {
    if (visible.visible !== false && visible.isRectAreaLight) {
      boolFlag = true;
    }
  });
  const rectAreaLightTextureUnits = boolFlag ? deferredModelTimer : 0;
  const computedValue = flag - textures - nonSpotShadowTextureUnits - rectAreaLightTextureUnits - externalModels;
  if (!stageSession && shadowAtlas && computedValue >= 1 && renderer.domElement.dataset.spotShadowMode !== "fallback") {
    const conditionalValue = options ? shadowAtlas.schedule(traverse) : countSceneMeshes(traverse).length;
    const localValue = shadowAtlas.sync(traverse);
    const dataset = renderer.domElement;
    dataset.dataset.fragmentTextureUnits = String(flag);
    dataset.dataset.materialTextureUnits = String(textures);
    dataset.dataset.spotShadowLimit = String(conditionalValue);
    dataset.dataset.activeSpotShadows = String(localValue);
    let zeroValue = 0;
    traverse.traverse(isLight => {
      if (isLight.isLight && isLight.userData?.lightItemId && isLight.visible !== false) {
        zeroValue += 1;
      }
    });
    dataset.dataset.activeUserLights = String(zeroValue);
    return localValue;
  }
  const localValue = spotShadowTextureUnitLimit({
    maxTextureUnits: flag,
    materialTextureUnits: textures,
    nonSpotShadowTextureUnits,
    rectAreaLightTextureUnits,
    reservedTextureUnits: externalModels,
    hardLimit: b0
  });
  if (stageSession && shadowAtlas) {
    shadowAtlas.setEnabled(false);
    shadowAtlas.sync(traverse);
  }
  const has = new Set(selectShadowCastingLightIds(countSceneMeshes(traverse), localValue));
  let zeroValue = 0;
  traverse.traverse(userData => {
    if (!userData.isSpotLight || !userData.userData?.lightItemId) {
      return;
    }
    const computedValue = String(userData.userData?.lightFloorId || "") + ":" + String(userData.userData.lightItemId);
    const castShadow = has.has(computedValue);
    userData.castShadow = castShadow;
    if (castShadow) {
      zeroValue += 1;
      if (userData.shadow && !userData.shadow.map) {
        userData.shadow.needsUpdate = true;
      }
    }
  });
  const dataset = renderer.domElement;
  dataset.dataset.spotShadowMode = "individual";
  dataset.dataset.fragmentTextureUnits = String(flag);
  dataset.dataset.materialTextureUnits = String(textures);
  dataset.dataset.spotShadowLimit = String(localValue);
  dataset.dataset.activeSpotShadows = String(zeroValue);
  let count = 0;
  traverse.traverse(isLight => {
    if (isLight.isLight && isLight.userData?.lightItemId && isLight.visible !== false) {
      count += 1;
    }
  });
  dataset.dataset.activeUserLights = String(count);
  return zeroValue;
}
function buildWallCornerCaps(list, color, argTertiary) {
  const hex = isStageEmbed ? lightEffectColorHex(color.lightTemperature) : kelvinToRgbHex(color.lightTemperature);
  const visible = isLightGroupVisible(color) && finite(color.lightBrightness, 0) > 0;
  const flag = !stageSession && forcedVisibleLightGroupIds === null && (isStageEmbed || !isPreviewQualityReady());
  const flagCurrent = !stageSession && residentCacheMode;
  if (!visible && !flag && !flagCurrent) {
    return;
  }
  const range = defaultLightPresets[color.type] || defaultLightPresets.downlight;
  const halfValue = clamp(finite(color.lightBrightness, range.brightness), 0, 100) / 100;
  const computedValue = deferExternalModels[color.type] || 1.1;
  const value = color.type === "striplight";
  const id = resolveLightGroup(color);
  if (value) {
    const object3d = clamp(finite(color.width, 2), 0.1, 8);
    const clampedValue = clamp(finite(color.depth, 0.28), 0.1, 8);
    const clampedValueCurrent = clamp(finite(color.lightRange, range.range), 0.5, 10);
    const clampedValueNext = clamp(clampedValueCurrent / range.range, 0.45, 1.65);
    const localValue = Math.max(finite(color.elevation, 2.7), 0.4);
    const clampedValuePrevious = clamp(Math.max(1, Math.pow(localValue / 2.7, 2)), 1, 4);
    const rotation = new THREE.Group();
    rotation.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(color.verticalRotation));
    const group = new THREE.Group();
    group.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(color.stripRollRotation));
    const lightOnIntensity = (yt ? halfValue : Math.pow(halfValue, 0.82)) * 48 * clampedValueNext * clampedValuePrevious * computedValue;
    const userData = new THREE.RectAreaLight(hex, visible ? lightOnIntensity : 0, object3d * 0.94, clampedValue * 0.94);
    userData.visible = visible;
    userData.position.y = -0.04;
    userData.rotation.x = -Math.PI / 2;
    userData.userData.lightItemId = color.id;
    userData.userData.lightGroupId = id?.id || "";
    userData.userData.lightFloorId = activeFloorId;
    userData.userData.lightSourceType = "continuous-area-strip";
    userData.userData.lightOnIntensity = lightOnIntensity;
    if (yt) {
      userData.userData.regionFullIntensity = clampedValueNext * 48 * clampedValuePrevious * computedValue;
      studioReady?.register(userData, color);
    }
    group.add(userData);
    rotation.add(group);
    list.add(rotation);
    return;
  }
  const needsUpdate = argTertiary?.has(color.id) === true;
  const computedValueCurrent = needsUpdate || flagCurrent || flag;
  const far = clamp(finite(color.lightRange, range.range), 0.5, 10);
  const clampedValue = clamp(finite(color.lightAngle, range.angle), 15, defaultItemDepth(color.type));
  const oneValue = 1;
  const comparisonFlag = (color.type === "ceilinglight" ? 680 : 520) * (yt ? halfValue : spotLightBrightnessResponse(color.type, halfValue)) * computedValue;
  for (let value = 0; value < oneValue; value += 1) {
    const worldPoint = oneValue === 1 ? 0 : -color.width * 0.47 + color.width * 0.94 * value / (oneValue - 1);
    const spotLight = new THREE.SpotLight(hex, visible ? comparisonFlag / oneValue : 0, far, THREE.MathUtils.degToRad(clampedValue / 2), 0.86, 2);
    spotLight.visible = visible;
    spotLight.position.set(worldPoint, -0.025, 0);
    spotLight.castShadow = false;
    spotLight.layers.enable(HELPER_LAYER);
    if (computedValueCurrent) {
      const blurSamples = localSpotShadowSettings(color.type, far, clampedValue);
      const localValue = scaledShadowMapSize(blurSamples.mapSize);
      spotLight.shadow.mapSize.set(localValue, localValue);
      spotLight.shadow.camera.near = clamp(far * 0.05, 0.12, 0.24);
      spotLight.shadow.camera.far = far;
      spotLight.shadow.camera.layers.set(HELPER_LAYER);
      spotLight.shadow.bias = -0.00005;
      spotLight.shadow.normalBias = blurSamples.normalBias;
      spotLight.shadow.radius = blurSamples.radius;
      spotLight.shadow.blurSamples = shadowCameraExpanded ? Math.max(8, blurSamples.blurSamples) : blurSamples.blurSamples;
      spotLight.shadow.autoUpdate = false;
      spotLight.shadow.needsUpdate = needsUpdate;
    }
    spotLight.userData.lightItemId = color.id;
    spotLight.userData.lightGroupId = id?.id || "";
    spotLight.userData.lightFloorId = activeFloorId;
    spotLight.userData.lightType = color.type;
    spotLight.userData.lightBrightness = finite(color.lightBrightness, range.brightness);
    spotLight.userData.shadowCandidate = true;
    spotLight.userData.prewarmShadow = isStageEmbed;
    spotLight.userData.lightOnIntensity = comparisonFlag / oneValue;
    if (yt) {
      spotLight.userData.regionFullIntensity = (color.type === "ceilinglight" ? 680 : 520) * computedValue;
      studioReady?.register(spotLight, color);
    }
    const shadowCameraHelperTarget = new THREE.Object3D();
    shadowCameraHelperTarget.position.set(worldPoint, -Math.max(finite(color.elevation, 2.68), 0.8), 0);
    list.add(shadowCameraHelperTarget);
    spotLight.target = shadowCameraHelperTarget;
    list.add(spotLight);
  }
}
function createTvScreenTexture() {
  const el = document.createElement("canvas");
  el.width = 960;
  el.height = 540;
  const canvasCtx = el.getContext("2d");
  if (!canvasCtx) {
    return null;
  }
  canvasCtx.fillStyle = "#07111d";
  canvasCtx.fillRect(0, 0, el.width, el.height);
  canvasCtx.fillStyle = "#0f2031";
  canvasCtx.fillRect(0, 0, 510, el.height);
  canvasCtx.fillStyle = "#ff9f36";
  canvasCtx.fillRect(54, 54, 12, 54);
  canvasCtx.fillStyle = "#f4f8fb";
  canvasCtx.font = "700 42px Arial, sans-serif";
  canvasCtx.fillText("HA BRIDGE", 88, 92);
  canvasCtx.fillStyle = "#7f93a6";
  canvasCtx.font = "600 15px Arial, sans-serif";
  canvasCtx.fillText("SMART HOME, SIMPLY CONNECTED", 88, 119);
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.font = "700 48px sans-serif";
  canvasCtx.fillText("让全屋设备", 54, 224);
  canvasCtx.fillText("自然协作", 54, 286);
  canvasCtx.fillStyle = "#9cafbf";
  canvasCtx.font = "400 20px sans-serif";
  canvasCtx.fillText("一张图，连接灯光、环境与家庭场景", 56, 331);
  [{
    label: "LIGHT",
    color: "#ff9f36"
  }, {
    label: "CLIMATE",
    color: "#32c59b"
  }, {
    label: "SECURITY",
    color: "#5c9dff"
  }].forEach((color, argSecondary) => {
    const contactShadowTint = 54 + argSecondary * 142;
    canvasCtx.fillStyle = "#172d40";
    canvasCtx.beginPath();
    canvasCtx.roundRect(contactShadowTint, 398, 126, 54, 8);
    canvasCtx.fill();
    canvasCtx.fillStyle = color.color;
    canvasCtx.fillRect(contactShadowTint + 14, 414, 8, 22);
    canvasCtx.fillStyle = "#dbe5ed";
    canvasCtx.font = "700 13px Arial, sans-serif";
    canvasCtx.fillText(color.label, contactShadowTint + 32, 432);
  });
  canvasCtx.fillStyle = "#0a1624";
  canvasCtx.fillRect(510, 0, 450, 540);
  canvasCtx.fillStyle = "#15283a";
  canvasCtx.beginPath();
  canvasCtx.roundRect(552, 44, 366, 164, 12);
  canvasCtx.fill();
  canvasCtx.fillStyle = "#8295a6";
  canvasCtx.font = "600 14px Arial, sans-serif";
  canvasCtx.fillText("HOME STATUS", 578, 76);
  canvasCtx.fillStyle = "#f5f8fb";
  canvasCtx.font = "700 58px Arial, sans-serif";
  canvasCtx.fillText("24°", 578, 148);
  canvasCtx.fillStyle = "#32c59b";
  canvasCtx.beginPath();
  canvasCtx.arc(856, 118, 31, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.fillStyle = "#07111d";
  canvasCtx.font = "700 17px Arial, sans-serif";
  canvasCtx.textAlign = "center";
  canvasCtx.fillText("ON", 856, 124);
  canvasCtx.textAlign = "left";
  canvasCtx.fillStyle = "#91a4b5";
  canvasCtx.font = "400 15px Arial, sans-serif";
  canvasCtx.fillText("COMFORT MODE · ALL SYSTEMS READY", 578, 181);
  const value = [{
    x: 552,
    y: 230,
    color: "#ff9f36",
    value: "8",
    label: "LIGHTS"
  }, {
    x: 742,
    y: 230,
    color: "#5c9dff",
    value: "4",
    label: "ROOMS"
  }, {
    x: 552,
    y: 360,
    color: "#32c59b",
    value: "92%",
    label: "AIR"
  }, {
    x: 742,
    y: 360,
    color: "#ef6580",
    value: "SAFE",
    label: "HOME"
  }];
  for (const planPoint of value) {
    canvasCtx.fillStyle = "#15283a";
    canvasCtx.beginPath();
    canvasCtx.roundRect(planPoint.x, planPoint.y, 176, 108, 10);
    canvasCtx.fill();
    canvasCtx.fillStyle = planPoint.color;
    canvasCtx.fillRect(planPoint.x + 18, planPoint.y + 18, 30, 5);
    canvasCtx.fillStyle = "#f4f8fb";
    canvasCtx.font = "700 29px Arial, sans-serif";
    canvasCtx.fillText(planPoint.value, planPoint.x + 18, planPoint.y + 66);
    canvasCtx.fillStyle = "#8295a6";
    canvasCtx.font = "600 12px Arial, sans-serif";
    canvasCtx.fillText(planPoint.label, planPoint.x + 18, planPoint.y + 89);
  }
  const colorSpace = new THREE.CanvasTexture(el);
  colorSpace.colorSpace = THREE.SRGBColorSpace;
  colorSpace.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  colorSpace.needsUpdate = true;
  return colorSpace;
}
function tvMountLayoutMetrics(item, argSecondary) {
  const group = item.tvMountStyle === "mobile";
  const width = item.tvMountStyle === "tabletop";
  return {
    bodyHeight: argSecondary * (group ? 0.43 : width ? 0.56 : 0.62),
    centerY: argSecondary * (group ? 0.76 : width ? 0.67 : 0.62)
  };
}
function addTvMountMeshes(group, tvMountStyle, argTertiary, argN, argNCurrent) {
  const {
    bodyHeight,
    centerY
  } = tvMountLayoutMetrics(tvMountStyle, argNCurrent);
  const width = argTertiary * 0.965;
  const height = bodyHeight * 0.94;
  const depth = 0.012;
  const value = Math.max(argN * 0.28, 0.05) * 0.5 + 0.006;
  const scaledDepth = value - depth * 0.5;
  if (tvMountStyle.screenEnabled === false) {
    const userData = addBoxMesh(group, width, height, depth, 0, centerY, scaledDepth, 527122, {
      roughness: 0.18
    });
    userData.userData.televisionScreen = true;
    if (isStageEmbed) {
      userData.userData.environmentEffect = true;
    }
    return;
  }
  const userData = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.035, height * 1.08), new THREE.MeshBasicMaterial({
    color: 7253215,
    transparent: true,
    opacity: 0.09,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  userData.userData.televisionGlow = true;
  if (isStageEmbed) {
    userData.userData.environmentEffect = true;
  }
  userData.position.set(0, centerY, value - 0.014);
  userData.renderOrder = 6;
  userData.castShadow = false;
  userData.receiveShadow = false;
  group.add(userData);
  const mapVar = createTvScreenTexture();
  const meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 527122,
    toneMapped: false
  });
  const material = new THREE.MeshBasicMaterial({
    color: mapVar ? 16777215 : 1519946,
    mapVar,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const light = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, material, meshBasicMaterial]);
  light.userData.televisionScreen = true;
  if (isStageEmbed) {
    light.userData.environmentEffect = true;
  }
  light.position.set(0, centerY, scaledDepth);
  light.renderOrder = 7;
  light.castShadow = false;
  light.receiveShadow = false;
  group.add(light);
}
function addSmallCarMeshes(group, chargingEnabled, argTertiary, argN, argNCurrent) {
  if (chargingEnabled.chargingEnabled !== true) {
    return;
  }
  const value = 5238711;
  const el = document.createElement("canvas");
  el.width = 256;
  el.height = 256;
  const canvasCtx = el.getContext("2d");
  const halfScreenWidth = el.width / 2;
  const addColorStop = canvasCtx.createRadialGradient(halfScreenWidth, halfScreenWidth, 0, halfScreenWidth, halfScreenWidth, halfScreenWidth);
  addColorStop.addColorStop(0, "rgba(79, 239, 183, .48)");
  addColorStop.addColorStop(0.46, "rgba(79, 239, 183, .23)");
  addColorStop.addColorStop(1, "rgba(79, 239, 183, 0)");
  canvasCtx.fillStyle = addColorStop;
  canvasCtx.fillRect(0, 0, el.width, el.height);
  for (let index = 18; index < el.height - 18; index += 10) {
    for (let count = 18; count < el.width - 18; count += 10) {
      const hypot = Math.hypot(count - halfScreenWidth, index - halfScreenWidth) / halfScreenWidth;
      const maxValue = Math.max(0, 1 - hypot) * 0.32;
      if (!(maxValue <= 0.01)) {
        canvasCtx.fillStyle = "rgba(116, 255, 202, " + maxValue + ")";
        canvasCtx.beginPath();
        canvasCtx.arc(count, index, 1.45, 0, Math.PI * 2);
        canvasCtx.fill();
      }
    }
  }
  const mapVar = new THREE.CanvasTexture(el);
  mapVar.colorSpace = THREE.SRGBColorSpace;
  mapVar.needsUpdate = true;
  const light = new THREE.Mesh(new THREE.PlaneGeometry(argTertiary * 1.72, argN * 1.42), new THREE.MeshBasicMaterial({
    mapVar,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -3
  }));
  light.rotation.x = -Math.PI / 2;
  light.position.y = 0.014;
  light.renderOrder = 2;
  light.castShadow = false;
  light.receiveShadow = false;
  group.add(light);
  const lineTo = new THREE.Shape();
  lineTo.moveTo(0.08, 0.5);
  lineTo.lineTo(-0.22, 0.04);
  lineTo.lineTo(-0.03, 0.04);
  lineTo.lineTo(-0.13, -0.5);
  lineTo.lineTo(0.25, -0.02);
  lineTo.lineTo(0.05, -0.02);
  lineTo.closePath();
  const mesh = new THREE.Mesh(new THREE.ShapeGeometry(lineTo), new THREE.MeshBasicMaterial({
    color: 8257488,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  const maxValue = Math.max(Math.min(argTertiary, argN) * 0.22, 0.18);
  mesh.scale.setScalar(maxValue);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, argNCurrent + 0.04, 0);
  mesh.renderOrder = 9;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
}
function buildStudioItemMeshGroup(type, optionalValue = null) {
  const rotation = new THREE.Group();
  rotation.userData.squareEdges = SOFT_TEXTURE_UNIT_RESERVE.has(type.type);
  if ($g.has(type.type)) {
    rotation.userData.optimizationBatch = "v1-next-ten";
  }
  const itemWidth = type.width;
  const itemDepth = type.depth;
  const itemHeight = type.height;
  const glass = resolvedThemeColors();
  const furnitureItems = glass.furniture;
  const computedValue = glass.appliance ?? furnitureItems;
  const color = glass.furnitureSoft;
  const furnitureLight = glass.furnitureLight;
  const furnitureDark = glass.furnitureDark;
  if (set.has(type.type)) {
    buildWallCornerCaps(rotation, type, optionalValue);
    applySelectionHighlight(rotation, type);
  } else if (type.type === "planlabel") {
    rotation.add(markAsLightSourcePreview(type));
  } else if (type.offlineModelExport !== true && ALL_ITEM_MODELS[type.type] && type.type !== "smallcar" && type.type !== "sofa") {
    if (!attachExternalItemModel(rotation, type)) {
      addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, RESERVED_TEXTURE_UNITS.has(type.type) ? computedValue : furnitureItems, {
        rounded: false,
        roughness: 0.6,
        metalness: 0.1
      });
    }
  } else if (type.type === "smallcar") {
    if (!attachExternalItemModel(rotation, type)) {
      addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.38, itemDepth * 0.9, 0, itemHeight * 0.28, 0, furnitureItems, {
        roughness: 0.46,
        metalness: 0.18
      });
      addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.42, itemDepth * 0.48, 0, itemHeight * 0.62, -itemDepth * 0.03, color, {
        roughness: 0.38,
        metalness: 0.12
      });
      for (const localValue of [-0.48, 0.48]) {
        for (const localValue of [-0.3, 0.3]) {
          addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.22, itemDepth * 0.17, localValue * itemWidth, itemHeight * 0.17, localValue * itemDepth, furnitureDark, {
            rounded: false,
            roughness: 0.82
          });
        }
      }
    }
    addSmallCarMeshes(rotation, type, itemWidth, itemDepth, itemHeight);
  } else if (type.type === "curtain") {
    const conditionalValue = ["left", "right", "split"].includes(type.curtainPosition) ? type.curtainPosition : "split";
    const lengthValue = rotation.children.length;
    if (isStageEmbed) {
      rotation.userData.curtainRigRoot = true;
      rotation.userData.curtainRigBasis = [itemWidth, itemHeight, itemDepth];
    }
    const localValue = Math.min(Math.max(itemDepth * 0.09, 0.012), 0.028);
    const computedValue = itemHeight - localValue * 1.8;
    const value = computedValue - localValue * 1.8;
    const max = Math.max(itemHeight * 0.025, 0.025);
    const localValueCurrent = Math.max(value - max, itemHeight * 0.72);
    addSoftBoxMesh(rotation, localValue, localValue, itemWidth * 1.06, 0, computedValue, 0, furnitureDark, {
      segments: 18,
      rotationZ: Math.PI / 2,
      metalness: 0.68,
      roughness: 0.22
    });
    for (const localValueCurrent of [-itemWidth * 0.52, itemWidth * 0.52]) {
      addSoftBoxMesh(rotation, localValue * 1.45, localValue * 1.45, localValue * 0.9, localValueCurrent, computedValue, 0, furnitureLight, {
        segments: 18,
        rotationZ: Math.PI / 2,
        metalness: 0.52,
        roughness: 0.26
      });
    }
    const helperFn = (argPrimary, argSecondary) => {
      const foldWidth = argSecondary / 7;
      for (let zeroValue = 0; zeroValue < 7; zeroValue += 1) {
        const foldCenterX = argPrimary + foldWidth * (zeroValue + 0.5);
        const foldOffsetZ = zeroValue % 2 === 0 ? itemDepth * 0.1 : -itemDepth * 0.1;
        addBoxMesh(rotation, foldWidth * 1.24, localValueCurrent, itemDepth * 0.62, foldCenterX, max + localValueCurrent * 0.5, foldOffsetZ, furnitureLight, {
          radius: Math.min(foldWidth * 0.34, 0.035),
          roughness: 0.94,
          metalness: 0
        });
      }
      addBoxMesh(rotation, argSecondary * 1.03, Math.max(itemHeight * 0.018, 0.025), itemDepth * 0.74, argPrimary + argSecondary * 0.5, max + itemHeight * 0.015, 0, furnitureDark, {
        radius: 0.01,
        roughness: 0.72,
        metalness: 0.02
      });
      addBoxMesh(rotation, argSecondary * 1.06, Math.max(itemHeight * 0.025, 0.035), itemDepth * 0.82, argPrimary + argSecondary * 0.5, max + localValueCurrent * 0.52, 0, furnitureLight, {
        radius: 0.012,
        roughness: 0.48,
        metalness: 0.08
      });
    };
    if (conditionalValue === "left") {
      helperFn(-itemWidth * 0.5, itemWidth * 0.24);
    } else if (conditionalValue === "right") {
      helperFn(itemWidth * 0.26, itemWidth * 0.24);
    } else {
      helperFn(-itemWidth * 0.5, itemWidth * 0.16);
      helperFn(itemWidth * 0.34, itemWidth * 0.16);
    }
    if (isStageEmbed) {
      rotation.children.slice(lengthValue).forEach((userData, argSecondary) => {
        userData.userData.curtainPart = argSecondary === 0 ? "rod" : argSecondary < 3 ? "cap" : (argSecondary - 3) % 9 < 7 ? "cloth" : "band";
      });
    }
  } else if (Vl.has(type.type)) {
    const depthStep = itemDepth / 10;
    for (let zeroValue = 0; zeroValue < 10; zeroValue += 1) {
      const layerHeight = itemHeight * (zeroValue + 1) / 10;
      const layerZ = -itemDepth * 0.5 + depthStep * (zeroValue + 0.5);
      addBoxMesh(rotation, itemWidth, layerHeight, depthStep * 1.015, 0, layerHeight * 0.5, layerZ, zeroValue % 2 ? furnitureItems : color, {
        rounded: false,
        roughness: 0.82
      });
      addBoxMesh(rotation, itemWidth * 1.01, 0.018, depthStep * 0.94, 0, layerHeight + 0.009, layerZ, furnitureLight, {
        rounded: false,
        castShadow: false,
        roughness: 0.72
      });
    }
  } else if (type.type === "sofa") {
    const computedValue = itemHeight * 0.14;
    const helperFn = argPrimary => argPrimary - computedValue + -0.008;
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.28, itemDepth * 0.72, 0, helperFn(itemHeight * 0.28), itemDepth * 0.06, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.55, itemDepth * 0.18, 0, helperFn(itemHeight * 0.56), -itemDepth * 0.35, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, -itemWidth * 0.46, helperFn(itemHeight * 0.39), itemDepth * 0.03, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, itemWidth * 0.46, helperFn(itemHeight * 0.39), itemDepth * 0.03, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, -itemWidth * 0.22, helperFn(itemHeight * 0.47), itemDepth * 0.07, color);
    addBoxMesh(rotation, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, itemWidth * 0.22, helperFn(itemHeight * 0.47), itemDepth * 0.07, color);
  } else if (type.type === "bed") {
    addBoxMesh(rotation, itemWidth * 0.996, itemHeight * 0.3, itemDepth * 0.996, 0, itemHeight * 0.15, 0, furnitureDark);
    addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.32, itemDepth * 0.92, 0, itemHeight * 0.43, itemDepth * 0.03, color);
    addBoxMesh(rotation, itemWidth, itemHeight * 0.95, itemDepth * 0.09, 0, itemHeight * 0.48, -itemDepth * 0.455, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, -itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, furnitureLight);
    addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, furnitureLight);
  } else if (type.type === "nightstand") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.78, itemDepth, 0, itemHeight * 0.49, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 1.04, itemHeight * 0.07, itemDepth * 1.05, 0, itemHeight * 0.91, 0, color, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.63, itemDepth * 0.01, furnitureDark, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.38, itemDepth * 0.01, furnitureDark, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.22, 0.022, 0.032, 0, itemHeight * 0.5, itemDepth * 0.52, furnitureLight, {
      metalness: 0.5
    });
    for (const localValue of [-0.38, 0.38]) {
      for (const localValue of [-0.35, 0.35]) {
        addBoxMesh(rotation, 0.035, itemHeight * 0.2, 0.035, itemWidth * localValue, itemHeight * 0.1, itemDepth * localValue, furnitureDark, {
          metalness: 0.18
        });
      }
    }
  } else if (type.type === "table") {
    const computedValue = itemWidth * 0.64;
    const value = itemDepth * 0.48;
    addBoxMesh(rotation, computedValue, itemHeight * 0.1, value, 0, itemHeight * 0.93, 0, furnitureItems);
    for (const localValue of [-0.43, 0.43]) {
      for (const localValue of [-0.38, 0.38]) {
        addBoxMesh(rotation, 0.07, itemHeight * 0.9, 0.07, computedValue * localValue, itemHeight * 0.45, value * localValue, furnitureDark);
      }
    }
    const localValue = Math.min(itemWidth * 0.2, 0.5);
    const min = Math.min(itemDepth * 0.27, 0.5);
    const computedValueCurrent = itemHeight * 1.18;
    buildTelevisionMesh(rotation, localValue, min, computedValueCurrent, -itemWidth * 0.37, 0, Math.PI / 2, color, furnitureDark);
    buildTelevisionMesh(rotation, localValue, min, computedValueCurrent, itemWidth * 0.37, 0, -Math.PI / 2, color, furnitureDark);
    buildTelevisionMesh(rotation, localValue, min, computedValueCurrent, 0, -itemDepth * 0.35, 0, color, furnitureDark);
    buildTelevisionMesh(rotation, localValue, min, computedValueCurrent, 0, itemDepth * 0.35, Math.PI, color, furnitureDark);
  } else if (roundTableTypes.has(type.type)) {
    const computedValue = Math.min(itemWidth, itemDepth) * 0.32;
    const localValue = Math.max(itemHeight * 0.07, 0.045);
    const value = itemHeight * 0.92;
    addSoftBoxMesh(rotation, computedValue, computedValue, localValue, 0, value, 0, furnitureLight, {
      segments: 48,
      roughness: 0.5,
      metalness: 0.08
    });
    addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.22, Math.min(itemWidth, itemDepth) * 0.3, itemHeight * 0.68, 0, itemHeight * 0.43, 0, furnitureItems, {
      segments: 36,
      roughness: 0.55,
      metalness: 0.06
    });
    addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.34, Math.min(itemWidth, itemDepth) * 0.34, itemHeight * 0.07, 0, itemHeight * 0.045, 0, furnitureDark, {
      segments: 40,
      roughness: 0.42,
      metalness: 0.12
    });
    if (hasRoundTableTurntable(type)) {
      addSoftBoxMesh(rotation, computedValue * 0.58, computedValue * 0.58, Math.max(itemHeight * 0.035, 0.025), 0, value + localValue * 0.58, 0, color, {
        segments: 48,
        roughness: 0.48,
        metalness: 0.08
      });
      addSoftBoxMesh(rotation, computedValue * 0.44, computedValue * 0.44, 0.018, 0, value + localValue * 0.58 + 0.036, 0, furnitureDark, {
        segments: 48,
        roughness: 0.32,
        metalness: 0.12
      });
    }
    const min = Math.min(itemWidth * 0.17, 0.42);
    const localValueCurrent = Math.min(itemDepth * 0.19, 0.44);
    const computedValueCurrent = itemHeight * 1.15;
    buildTelevisionMesh(rotation, min, localValueCurrent, computedValueCurrent, -itemWidth * 0.38, 0, Math.PI / 2, color, furnitureDark);
    buildTelevisionMesh(rotation, min, localValueCurrent, computedValueCurrent, itemWidth * 0.38, 0, -Math.PI / 2, color, furnitureDark);
    buildTelevisionMesh(rotation, min, localValueCurrent, computedValueCurrent, 0, -itemDepth * 0.38, 0, color, furnitureDark);
    buildTelevisionMesh(rotation, min, localValueCurrent, computedValueCurrent, 0, itemDepth * 0.38, Math.PI, color, furnitureDark);
  } else if (type.type === "bar") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.12, itemDepth, 0, itemHeight * 0.94, 0, color, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.78, itemDepth * 0.46, 0, itemHeight * 0.45, -itemDepth * 0.18, furnitureItems, {
      roughness: 0.65
    });
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.48, 0.035, 0, itemHeight * 0.42, itemDepth * 0.28, furnitureDark, {
      rounded: false,
      roughness: 0.48
    });
    for (const localValue of [-0.3, 0, 0.3]) {
      addSoftBoxMesh(rotation, itemDepth * 0.14, itemDepth * 0.14, 0.045, itemWidth * localValue, itemHeight * 0.66, itemDepth * 0.52, color, {
        segments: 28,
        roughness: 0.52
      });
      addSoftBoxMesh(rotation, 0.025, 0.025, itemHeight * 0.62, itemWidth * localValue, itemHeight * 0.34, itemDepth * 0.52, furnitureDark, {
        segments: 18,
        metalness: 0.38,
        roughness: 0.28
      });
      addSoftBoxMesh(rotation, itemDepth * 0.1, itemDepth * 0.12, 0.035, itemWidth * localValue, 0.018, itemDepth * 0.52, furnitureDark, {
        segments: 24,
        metalness: 0.3,
        roughness: 0.34
      });
    }
  } else if (type.type === "aquarium") {
    const localValue = Math.max(itemHeight * 0.52, 0.45);
    const localValueCurrent = localValue;
    const max = Math.max(itemHeight - localValue, 0.2);
    const min = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.025, 0.012), 0.028);
    const objectValue = {
      rounded: false,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.06,
      metalness: 0.02,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 6
    };
    addBoxMesh(rotation, itemWidth, localValue, itemDepth, 0, localValue * 0.5, 0, furnitureItems, {
      rounded: false,
      roughness: 0.56
    });
    addBoxMesh(rotation, itemWidth, 0.035, itemDepth, 0, localValue, 0, glass.frame, {
      rounded: false,
      metalness: 0.34,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth - min * 2, max, min, 0, localValueCurrent + max * 0.5, -itemDepth * 0.5 + min * 0.5, glass.glass, objectValue);
    addBoxMesh(rotation, itemWidth - min * 2, max, min, 0, localValueCurrent + max * 0.5, itemDepth * 0.5 - min * 0.5, glass.glass, objectValue);
    addBoxMesh(rotation, min, max, itemDepth - min * 2, -itemWidth * 0.5 + min * 0.5, localValueCurrent + max * 0.5, 0, glass.glass, objectValue);
    addBoxMesh(rotation, min, max, itemDepth - min * 2, itemWidth * 0.5 - min * 0.5, localValueCurrent + max * 0.5, 0, glass.glass, objectValue);
  } else if (type.type === "coffeetable") {
    const localValue = Math.min(itemWidth * 0.34, itemDepth * 0.42);
    const min = Math.min(itemWidth * 0.23, itemDepth * 0.29);
    const computedValue = -itemWidth * 0.16;
    const value = itemDepth * 0.08;
    const computedValueCurrent = itemWidth * 0.24;
    const computedValueNext = -itemDepth * 0.2;
    const computedValuePrevious = itemHeight * 0.58;
    const computedValueLocal = itemHeight * 0.76;
    const computedValueItem = itemHeight * 0.68;
    const computedValueEntry = itemHeight * 0.9;
    addSoftBoxMesh(rotation, localValue * 0.3, localValue * 0.5, computedValuePrevious, computedValue, computedValuePrevious * 0.5, value, furnitureItems, {
      segments: 40,
      roughness: 0.82
    });
    const computedValueList = itemHeight * 0.07;
    const computedValueText = itemHeight * 0.055;
    const computedValueValue = computedValuePrevious + computedValueList * 0.5 + 0.001;
    const computedValueSource = computedValueValue + (computedValueList + computedValueText) * 0.5 + 0.001;
    addSoftBoxMesh(rotation, localValue * 1.02, localValue * 1.02, computedValueList, computedValue, computedValueValue, value, furnitureDark, {
      segments: 48,
      roughness: 0.72
    });
    addSoftBoxMesh(rotation, localValue, localValue, computedValueText, computedValue, computedValueSource, value, furnitureLight, {
      segments: 48,
      roughness: 0.9
    });
    addSoftBoxMesh(rotation, min * 0.32, min * 0.52, computedValueLocal, computedValueCurrent, computedValueLocal * 0.5, computedValueNext, color, {
      segments: 40,
      roughness: 0.82
    });
    const computedValueTarget = itemHeight * 0.07;
    const computedValueDefault = itemHeight * 0.055;
    const computedValueFallback = computedValueLocal + computedValueTarget * 0.5 + 0.001;
    const computedValuePending = computedValueFallback + (computedValueTarget + computedValueDefault) * 0.5 + 0.001;
    addSoftBoxMesh(rotation, min * 1.02, min * 1.02, computedValueTarget, computedValueCurrent, computedValueFallback, computedValueNext, furnitureDark, {
      segments: 48,
      roughness: 0.72
    });
    addSoftBoxMesh(rotation, min, min, computedValueDefault, computedValueCurrent, computedValuePending, computedValueNext, furnitureLight, {
      segments: 48,
      roughness: 0.9
    });
  } else if (type.type === "squarecoffeetable") {
    const localValue = Math.max(itemHeight * 0.22, 0.085);
    const max = Math.max(itemHeight * 0.16, 0.065);
    const computedValue = localValue + 0.012;
    const localValueCurrent = Math.max(itemHeight - computedValue - max, 0.16);
    const localValueNext = Math.max(itemWidth * 0.075, 0.045);
    const localValuePrevious = Math.max(itemDepth * 0.035, 0.018);
    const value = localValueCurrent * 0.72;
    const computedValueCurrent = computedValue + localValueCurrent * 0.48;
    const computedValueNext = itemWidth * 0.27;
    const computedValuePrevious = itemWidth * 0.34;
    const localValueLocal = furnitureItems;
    const localValueItem = color;
    addBoxMesh(rotation, itemWidth * 0.98, max, itemDepth * 1.03, 0, computedValue + localValueCurrent + max * 0.5, 0, localValueItem, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.5,
      metalness: 0.02
    });
    addBoxMesh(rotation, localValueNext, localValueCurrent, itemDepth * 0.92, -itemWidth * 0.5 + localValueNext * 0.5, computedValue + localValueCurrent * 0.5, 0, localValueLocal, {
      rounded: false,
      roughness: 0.6
    });
    addBoxMesh(rotation, localValueNext, localValueCurrent, itemDepth * 0.92, itemWidth * 0.5 - localValueNext * 0.5, computedValue + localValueCurrent * 0.5, 0, localValueLocal, {
      rounded: false,
      roughness: 0.6
    });
    addBoxMesh(rotation, itemWidth * 0.86, localValueCurrent * 0.9, 0.035, 0, computedValue + localValueCurrent * 0.52, -itemDepth * 0.45, localValueLocal, {
      rounded: false,
      roughness: 0.75
    });
    addBoxMesh(rotation, itemWidth * 0.86, localValueCurrent * 0.1, itemDepth * 0.9, 0, computedValue + localValueCurrent * 0.08, 0, localValueLocal, {
      rounded: false,
      roughness: 0.58
    });
    for (const localValue of [-computedValuePrevious, 0, computedValuePrevious]) {
      addBoxMesh(rotation, computedValueNext, value, localValuePrevious, localValue, computedValueCurrent, itemDepth * 0.48, localValueItem, {
        radius: Math.min(itemWidth, itemDepth) * 0.025,
        roughness: 0.52
      });
      const conditionalValue = localValue === 0 ? 0 : localValue + (localValue < 0 ? computedValueNext * 0.3 : -computedValueNext * 0.3);
      addBoxMesh(rotation, 0.022, value * 0.2, 0.025, conditionalValue, computedValueCurrent, itemDepth * 0.505, furnitureDark, {
        radius: 0.009,
        metalness: 0.22,
        roughness: 0.3
      });
    }
    const localValueEntry = Math.max(Math.min(itemWidth, itemDepth) * 0.055, 0.035);
    for (const localValueCurrent of [-itemWidth * 0.4, itemWidth * 0.4]) {
      for (const localValue of [-itemDepth * 0.36, itemDepth * 0.36]) {
        const mesh = addBoxMesh(rotation, localValueEntry, localValue, localValueEntry, localValueCurrent, localValue * 0.5, localValue, furnitureDark, {
          radius: localValueEntry * 0.22,
          roughness: 0.55,
          metalness: 0.02
        });
        mesh.rotation.z = (localValueCurrent < 0 ? -1 : 1) * 0.09;
        mesh.rotation.x = (localValue < 0 ? -1 : 1) * 0.06;
      }
    }
  } else if (type.type === "chair") {
    buildTelevisionMesh(rotation, itemWidth, itemDepth, itemHeight, 0, 0, 0, furnitureItems, furnitureDark);
  } else if (type.type === "sideboard") {
    const localValue = Math.max(itemHeight, 1.8);
    const computedValue = localValue * 0.39;
    const value = localValue * 0.22;
    const computedValueCurrent = computedValue + value;
    const computedValueNext = localValue - computedValueCurrent;
    const localValueCurrent = color;
    const computedValuePrevious = itemWidth * 0.31;
    const computedValueLocal = computedValue * 0.88;
    const computedValueItem = computedValueNext * 0.86;
    addBoxMesh(rotation, itemWidth, computedValue, itemDepth, 0, computedValue * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth, 0.045, itemDepth, 0, computedValue, 0, color, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth, value, 0.045, 0, computedValue + value * 0.5, -itemDepth * 0.46, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, itemWidth, computedValueNext, itemDepth, 0, computedValueCurrent + computedValueNext * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue of [-0.33, 0, 0.33]) {
      addBoxMesh(rotation, computedValuePrevious, computedValueLocal, 0.026, itemWidth * localValue, computedValue * 0.48, itemDepth * 0.515, localValueCurrent, {
        rounded: false,
        roughness: 0.45
      });
      addBoxMesh(rotation, computedValuePrevious, computedValueItem, 0.026, itemWidth * localValue, computedValueCurrent + computedValueNext * 0.5, itemDepth * 0.515, localValueCurrent, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type.type === "shoecabinet") {
    const localValue = Math.max(itemHeight, 1.9);
    const localValueCurrent = color;
    const localValueNext = color;
    const computedValue = itemWidth * 0.5;
    const value = itemWidth * 0.5;
    const computedValueCurrent = -itemWidth * 0.25;
    const computedValueNext = itemWidth * 0.25;
    const computedValuePrevious = localValue * 0.22;
    const computedValueLocal = localValue * 0.43;
    const computedValueItem = localValue * 0.21;
    const computedValueEntry = localValue * 0.37;
    addBoxMesh(rotation, itemWidth * 0.98, localValue * 0.93, 0.045, 0, localValue * 0.48, -itemDepth * 0.47, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, computedValue, computedValuePrevious * 0.56, itemDepth * 0.92, computedValueCurrent, computedValuePrevious * 0.35, 0, furnitureItems, {
      roughness: 0.56
    });
    addBoxMesh(rotation, computedValue * 1.02, 0.055, itemDepth * 1.04, computedValueCurrent, computedValuePrevious * 0.67, 0, localValueNext, {
      roughness: 0.5
    });
    addBoxMesh(rotation, value, computedValueLocal, itemDepth, computedValueNext, computedValueLocal * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue of [-0.245, 0.245]) {
      addBoxMesh(rotation, value * 0.47, computedValueLocal * 0.84, 0.026, computedValueNext + value * localValue, computedValueLocal * 0.48, itemDepth * 0.515, localValueCurrent, {
        rounded: false,
        roughness: 0.45
      });
    }
    const computedValueList = localValue - computedValueItem - 0.045;
    addBoxMesh(rotation, computedValue, computedValueItem, itemDepth, computedValueCurrent, computedValueList + computedValueItem * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue of [-0.245, 0.245]) {
      addBoxMesh(rotation, computedValue * 0.47, computedValueItem * 0.86, 0.026, computedValueCurrent + computedValue * localValue, computedValueList + computedValueItem * 0.5, itemDepth * 0.515, localValueCurrent, {
        rounded: false,
        roughness: 0.45
      });
    }
    const computedValueText = localValue - computedValueEntry - 0.045;
    addBoxMesh(rotation, value, computedValueEntry, itemDepth, computedValueNext, computedValueText + computedValueEntry * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue of [-0.245, 0.245]) {
      addBoxMesh(rotation, value * 0.47, computedValueEntry * 0.9, 0.026, computedValueNext + value * localValue, computedValueText + computedValueEntry * 0.5, itemDepth * 0.515, localValueCurrent, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type.type === "cabinet") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, furnitureItems);
    addBoxMesh(rotation, 0.018, itemHeight * 0.9, itemDepth * 1.01, 0, itemHeight * 0.52, itemDepth * 0.01, furnitureDark);
    addBoxMesh(rotation, 0.025, 0.16, 0.035, -0.08, itemHeight * 0.55, itemDepth * 0.515, furnitureLight, {
      metalness: 0.55
    });
    addBoxMesh(rotation, 0.025, 0.16, 0.035, 0.08, itemHeight * 0.55, itemDepth * 0.515, furnitureLight, {
      metalness: 0.55
    });
  } else if (type.type === "glasscabinet") {
    const localValue = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.1, 0.032), 0.058);
    const min = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
    const localValueCurrent = Math.min(Math.max(itemWidth * 0.014, 0.016), 0.03);
    const max = Math.max(itemWidth - localValue * 2, itemWidth * 0.7);
    const numericValue = 0.13;
    const value = 0.3;
    const count = 4;
    const computedValue = itemHeight * numericValue;
    const computedValueCurrent = itemHeight * value;
    const computedValueNext = itemHeight - localValue - computedValueCurrent;
    const halfValue = computedValueNext / count;
    const length = [0.56, 0.24, 0.2];
    const slicedValue = [0, length[0], length[0] + length[1]];
    const slice = slicedValue.slice(1);
    const localValueNext = Math.max(itemWidth * 0.005, 0.005);
    const computedValuePrevious = itemDepth * 0.5 + 0.012;
    const objectValue = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015
    };
    const options = {
      rounded: false,
      roughness: 0.48,
      metalness: 0.035
    };
    const objectValueCurrent = {
      rounded: false,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.08,
      metalness: 0.08,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 7
    };
    const objectValueNext = {
      rounded: false,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      roughness: 0.12,
      metalness: 0,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 8
    };
    addBoxMesh(rotation, localValue, itemHeight, itemDepth, -itemWidth * 0.5 + localValue * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, localValue, itemHeight, itemDepth, itemWidth * 0.5 - localValue * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, max, itemHeight - localValue * 2, min, 0, itemHeight * 0.5, -itemDepth * 0.5 + min * 0.5, furnitureItems, {
      ...objectValue,
      roughness: 0.76
    });
    addBoxMesh(rotation, itemWidth, localValue, itemDepth, 0, itemHeight - localValue * 0.5, 0, furnitureItems, objectValue);
    for (let zeroValue = 0; zeroValue < count; zeroValue += 1) {
      addBoxMesh(rotation, max, localValue * 0.72, itemDepth * 0.9, 0, computedValueCurrent + halfValue * zeroValue, -itemDepth * 0.025, color, objectValue);
    }
    addBoxMesh(rotation, max, localValue * 0.72, itemDepth * 0.9, 0, computedValue, -itemDepth * 0.025, color, objectValue);
    for (const localValueCurrent of slice) {
      const computedValue = -max * 0.5 + max * localValueCurrent;
      addBoxMesh(rotation, localValue * 0.72, itemHeight - localValue, itemDepth * 0.9, computedValue, (itemHeight - localValue) * 0.5, -itemDepth * 0.025, furnitureItems, objectValue);
    }
    const computedValueLocal = computedValueCurrent - computedValue - localValue * 0.9;
    const list = [max * length[0], max * (1 - length[0])];
    let computedValueItem = -max * 0.5;
    for (let zeroValue = 0; zeroValue < list.length; zeroValue += 1) {
      const computedValue = list[zeroValue] - localValueNext;
      const value = computedValueItem + list[zeroValue] * 0.5;
      addBoxMesh(rotation, computedValue, computedValueLocal, 0.03, value, value + (computedValueCurrent - value) * 0.5, computedValuePrevious, zeroValue ? color : furnitureItems, {
        ...options,
        roughness: 0.56
      });
      computedValueItem += list[zeroValue];
    }
    for (let zeroValue = 0; zeroValue < length.length; zeroValue += 1) {
      const computedValue = -max * 0.5 + max * slicedValue[zeroValue];
      const value = max * length[zeroValue];
      const computedValueCurrent = computedValue + value * 0.5;
      const localValue = Math.max(value - localValueCurrent * 1.65, value * 0.76);
      const localValueNext = Math.max(computedValueNext - localValueCurrent * 1.55, computedValueNext * 0.86);
      addBoxMesh(rotation, localValue, localValueNext, 0.018, computedValueCurrent, computedValueCurrent + computedValueNext * 0.5, computedValuePrevious, glass.glass, objectValueCurrent);
      addBoxMesh(rotation, localValueCurrent, computedValueNext, 0.032, computedValue + localValueCurrent * 0.5, computedValueCurrent + computedValueNext * 0.5, computedValuePrevious + 0.009, furnitureItems, options);
      if (zeroValue === length.length - 1) {
        addBoxMesh(rotation, localValueCurrent, computedValueNext, 0.032, computedValue + value - localValueCurrent * 0.5, computedValueCurrent + computedValueNext * 0.5, computedValuePrevious + 0.009, furnitureItems, options);
      }
      const glassThickness = Math.max(localValue * 0.025, 0.007);
      addBoxMesh(rotation, glassThickness, localValueNext * 0.88, 0.006, computedValueCurrent - localValue * 0.37, computedValueCurrent + computedValueNext * 0.52, computedValuePrevious + 0.014, 14282227, objectValueNext);
      addBoxMesh(rotation, localValue * 0.34, Math.max(glassThickness * 0.11, 0.004), 0.006, computedValueCurrent - localValue * 0.18, computedValueCurrent + computedValueNext * 0.88, computedValuePrevious + 0.014, 15267578, objectValueNext);
    }
    addBoxMesh(rotation, max, localValueCurrent, 0.032, 0, computedValueCurrent + localValueCurrent * 0.5, computedValuePrevious + 0.009, furnitureItems, options);
    addBoxMesh(rotation, max, localValueCurrent, 0.032, 0, itemHeight - localValue - localValueCurrent * 0.5, computedValuePrevious + 0.009, furnitureItems, options);
    const lengthCurrent = [14736852, 13025203, 10327434, 7301474, color, furnitureLight];
    const helperFn = (argPrimary, argSecondary, numericParam = 5, numericParamCurrent = 0) => {
      const computedValue = max * length[argPrimary];
      const value = -max * 0.5 + max * slicedValue[argPrimary];
      const computedValueNext = computedValueCurrent + halfValue * argSecondary + localValue * 0.42;
      const localValueCurrent = Math.max(computedValue * 0.022, 0.004);
      const halfValueCurrent = (computedValue * 0.72 - localValueCurrent * (numericParam - 1)) / numericParam;
      let computedValuePrevious = value + computedValue * 0.13;
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        const computedValue = halfValueCurrent * [0.8, 1.05, 0.9, 0.72, 0.96][(zeroValue + numericParamCurrent) % 5];
        const value = halfValue * [0.48, 0.58, 0.52, 0.64, 0.55][(zeroValue * 2 + numericParamCurrent) % 5];
        addBoxMesh(rotation, computedValue, value, itemDepth * 0.42, computedValuePrevious + computedValue * 0.5, computedValueNext + value * 0.5, itemDepth * 0.12, lengthCurrent[(zeroValue + numericParamCurrent) % lengthCurrent.length], {
          radius: Math.min(computedValue * 0.12, 0.009),
          roughness: 0.78,
          metalness: 0
        });
        computedValuePrevious += computedValue + localValueCurrent;
      }
    };
    const callback = (argPrimary, argSecondary, numericParam = 3, numericParamCurrent = 0) => {
      const computedValue = max * length[argPrimary];
      const value = -max * 0.5 + max * slicedValue[argPrimary] + computedValue * 0.5;
      const computedValueNext = computedValueCurrent + halfValue * argSecondary + localValue * 0.42;
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        addBoxMesh(rotation, computedValue * 0.56, localValue * 0.48, itemDepth * 0.4, value, computedValueNext + localValue * (0.3 + zeroValue * 0.52), itemDepth * 0.12, lengthCurrent[(zeroValue + numericParamCurrent) % lengthCurrent.length], {
          radius: 0.006,
          roughness: 0.78,
          metalness: 0
        });
      }
    };
    helperFn(0, 1, 7, 0);
    helperFn(2, 2, 4, 2);
    callback(0, 0, 3, 2);
    callback(1, 2, 3, 4);
    for (const [bayIndex, shelfIndex, softScale, softColor] of [[1, 1, 0.16, 12169895], [0, 2, 0.075, 9406334], [2, 3, 0.14, 13749184]]) {
      const bayWidth = max * length[bayIndex];
      const bayCenterX = -max * 0.5 + max * slicedValue[bayIndex] + bayWidth * 0.5;
      const softBaseY = computedValueCurrent + halfValue * shelfIndex + localValue * 0.42;
      addSoftBoxMesh(rotation, bayWidth * softScale * 0.72, bayWidth * softScale, halfValue * 0.46, bayCenterX, softBaseY + halfValue * 0.23, itemDepth * 0.12, softColor, {
        segments: 24,
        roughness: 0.68
      });
    }
  } else if (type.type === "bookcase") {
    const clampedCornerRadius = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.11, 0.032), 0.062);
    const localValue = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
    const max = Math.max(itemWidth - clampedCornerRadius * 2, itemWidth * 0.72);
    const numericValue = 0.255;
    const arrayValue = [numericValue, 0.47, 0.59, 0.79];
    const computedValue = itemHeight - clampedCornerRadius * 0.5;
    const value = max * 0.27;
    const computedValueCurrent = itemWidth * 0.5 - clampedCornerRadius * 1.5 - value;
    const computedValueNext = max - value - clampedCornerRadius;
    const computedValuePrevious = -max * 0.5 + computedValueNext * 0.5;
    const computedValueLocal = max * 0.5 - value * 0.5;
    const objectValue = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015
    };
    const computedValueItem = itemDepth * 0.5 + 0.013;
    addBoxMesh(rotation, clampedCornerRadius, itemHeight, itemDepth, -itemWidth * 0.5 + clampedCornerRadius * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, clampedCornerRadius, itemHeight, itemDepth, itemWidth * 0.5 - clampedCornerRadius * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, max, itemHeight * 0.95, localValue, 0, itemHeight * 0.5, -itemDepth * 0.5 + localValue * 0.5, furnitureDark, {
      ...objectValue,
      roughness: 0.76
    });
    addBoxMesh(rotation, max, itemHeight * numericValue - clampedCornerRadius * 0.5, itemDepth * 0.9, 0, itemHeight * numericValue * 0.5, -itemDepth * 0.025, color, {
      ...objectValue,
      roughness: 0.66
    });
    for (const localValue of arrayValue) {
      addBoxMesh(rotation, max, clampedCornerRadius, itemDepth, 0, itemHeight * localValue, 0, color, objectValue);
    }
    addBoxMesh(rotation, itemWidth, clampedCornerRadius, itemDepth, 0, computedValue, 0, furnitureItems, objectValue);
    const computedValueEntry = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
    const computedValueList = itemHeight - clampedCornerRadius;
    addBoxMesh(rotation, clampedCornerRadius, computedValueList - computedValueEntry, itemDepth, computedValueCurrent, (computedValueList + computedValueEntry) * 0.5, 0, furnitureItems, objectValue);
    const count = 3;
    const computedValueText = clampedCornerRadius * 0.72;
    const computedValueValue = itemHeight * numericValue - clampedCornerRadius * 0.5;
    const localValueCurrent = Math.max(computedValueValue - computedValueText, itemHeight * 0.16);
    const localValueNext = Math.max(itemWidth * 0.008, 0.008);
    const computedValueSource = -max * 0.18;
    const computedValueTarget = computedValueSource + max * 0.5 - localValueNext * 0.5;
    const computedValueDefault = max - computedValueTarget - localValueNext;
    const halfValue = (localValueCurrent - localValueNext * (count - 1)) / count;
    for (let zeroValue = 0; zeroValue < count; zeroValue += 1) {
      const computedValue = computedValueText + halfValue * 0.5 + zeroValue * (halfValue + localValueNext);
      addBoxMesh(rotation, computedValueTarget, halfValue, 0.026, -max * 0.5 + computedValueTarget * 0.5, computedValue, computedValueItem, furnitureItems, {
        ...objectValue,
        roughness: 0.55
      });
      addBoxMesh(rotation, computedValueDefault, halfValue, 0.026, computedValueSource + localValueNext * 0.5 + computedValueDefault * 0.5, computedValue, computedValueItem, color, {
        ...objectValue,
        roughness: 0.55
      });
    }
    const computedValueFallback = itemHeight * (arrayValue[2] - arrayValue[1]) - clampedCornerRadius * 1.15;
    addBoxMesh(rotation, computedValueNext * 0.97, computedValueFallback, 0.028, computedValuePrevious, itemHeight * (arrayValue[1] + arrayValue[2]) * 0.5, computedValueItem, furnitureItems, {
      ...objectValue,
      roughness: 0.54
    });
    const length = [14276045, 12499117, 10459536, 7828334, furnitureLight, color];
    const helperFn = ({
      startX: arg,
      maxWidth: argPrimary,
      shelfY: argPrimaryCurrent,
      availableHeight: argPrimaryNext,
      count: argPrimaryPrevious = 6,
      seed: argPrimaryLocal = 0
    }) => {
      const max = Math.max(argPrimary * 0.018, 0.006);
      const localValueCurrent = Math.max((argPrimary - max * (argPrimaryPrevious + 1)) / argPrimaryPrevious, 0.026);
      let computedValue = arg + max;
      for (let zeroValue = 0; zeroValue < argPrimaryPrevious; zeroValue += 1) {
        const localValue = [0.72, 0.9, 0.78, 1.04, 0.82, 0.68][(zeroValue + argPrimaryLocal) % 6];
        const computedValue = localValueCurrent * localValue;
        const localValueNext = [0.72, 0.88, 0.78, 0.94, 0.82, 0.68][(zeroValue * 2 + argPrimaryLocal) % 6];
        const value = argPrimaryNext * localValueNext;
        if (computedValue + computedValue > arg + argPrimary - max) {
          break;
        }
        const mesh = addBoxMesh(rotation, computedValue, value, itemDepth * (0.47 + (zeroValue + argPrimaryLocal) % 3 * 0.045), computedValue + computedValue * 0.5, argPrimaryCurrent + value * 0.5, itemDepth * 0.15, length[(zeroValue + argPrimaryLocal) % length.length], {
          radius: Math.min(computedValue * 0.14, 0.012),
          roughness: 0.78,
          metalness: 0
        });
        if (zeroValue === argPrimaryPrevious - 1 && argPrimaryLocal % 2 === 1) {
          mesh.rotation.z = -0.07;
        }
        computedValue += computedValue + max;
      }
    };
    const callback = (argPrimary, argSecondary, argTertiary, numericParam = 3, numericParamCurrent = 0) => {
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        addBoxMesh(rotation, argTertiary, clampedCornerRadius * 0.54, itemDepth * 0.48, argPrimary, argSecondary + clampedCornerRadius * (0.38 + zeroValue * 0.56), itemDepth * 0.15, length[(zeroValue + numericParamCurrent) % length.length], {
          radius: 0.007,
          roughness: 0.78,
          metalness: 0
        });
      }
    };
    const shelfY = itemHeight * arrayValue[0] + clampedCornerRadius * 0.5;
    helperFn({
      startX: -max * 0.47,
      maxWidth: max * 0.29,
      shelfY,
      availableHeight: itemHeight * 0.15,
      count: 5,
      seed: 2
    });
    helperFn({
      startX: max * 0.04,
      maxWidth: max * 0.38,
      shelfY,
      availableHeight: itemHeight * 0.16,
      count: 7,
      seed: 4
    });
    const shelfYCurrent = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
    helperFn({
      startX: computedValueCurrent + clampedCornerRadius * 0.6,
      maxWidth: value * 0.82,
      shelfY: shelfYCurrent,
      availableHeight: itemHeight * 0.075,
      count: 4,
      seed: 1
    });
    const shelfYNext = itemHeight * arrayValue[2] + clampedCornerRadius * 0.5;
    helperFn({
      startX: -max * 0.47,
      maxWidth: computedValueNext * 0.42,
      shelfY: shelfYNext,
      availableHeight: itemHeight * 0.14,
      count: 6,
      seed: 0
    });
    addBoxMesh(rotation, computedValueNext * 0.17, itemHeight * 0.12, 0.022, computedValuePrevious + computedValueNext * 0.27, shelfYNext + itemHeight * 0.065, itemDepth * 0.22, 11972517, {
      rounded: false,
      roughness: 0.5
    });
    addBoxMesh(rotation, computedValueNext * 0.125, itemHeight * 0.085, 0.026, computedValuePrevious + computedValueNext * 0.27, shelfYNext + itemHeight * 0.065, itemDepth * 0.235, 7762283, {
      rounded: false,
      roughness: 0.42
    });
    callback(computedValueLocal, shelfYNext, value * 0.48, 3, 3);
    const computedValuePending = itemHeight * arrayValue[3] + clampedCornerRadius * 0.5;
    callback(computedValuePrevious - computedValueNext * 0.22, computedValuePending, computedValueNext * 0.24, 2, 1);
    addSoftBoxMesh(rotation, computedValueNext * 0.055, computedValueNext * 0.075, itemHeight * 0.12, computedValuePrevious - computedValueNext * 0.08, computedValuePending + itemHeight * 0.06, itemDepth * 0.12, 5196615, {
      segments: 22,
      roughness: 0.66
    });
    addSoftBoxMesh(rotation, computedValueNext * 0.045, computedValueNext * 0.064, itemHeight * 0.15, computedValuePrevious + computedValueNext * 0.08, computedValuePending + itemHeight * 0.075, itemDepth * 0.12, 6643802, {
      segments: 22,
      roughness: 0.66
    });
    callback(computedValueLocal, computedValuePending, value * 0.5, 2, 4);
  } else if (type.type === "shelf") {
    const localValue = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.07, 0.028), 0.052);
    const min = Math.min(Math.max(itemHeight * 0.022, 0.028), 0.052);
    const max = Math.max(itemDepth - localValue * 1.4, itemDepth * 0.78);
    const objectValue = {
      rounded: false,
      metalness: 0.62,
      roughness: 0.28
    };
    const options = {
      rounded: false,
      metalness: 0.18,
      roughness: 0.48
    };
    for (const localValueCurrent of [-itemWidth * 0.5 + localValue * 0.5, itemWidth * 0.5 - localValue * 0.5]) {
      for (const localValue of [-itemDepth * 0.5 + localValue * 0.5, itemDepth * 0.5 - localValue * 0.5]) {
        addBoxMesh(rotation, localValue, itemHeight, localValue, localValueCurrent, itemHeight * 0.5, localValue, furnitureItems, objectValue);
      }
    }
    for (const localValueCurrent of [0.04, 0.26, 0.49, 0.72, 0.96]) {
      addBoxMesh(rotation, itemWidth, min, max, 0, itemHeight * localValueCurrent, 0, localValueCurrent === 0.96 ? furnitureLight : color, options);
      addBoxMesh(rotation, itemWidth, localValue * 0.65, localValue, 0, itemHeight * localValueCurrent, -itemDepth * 0.5 + localValue * 0.5, furnitureItems, objectValue);
    }
    const localValueCurrent = Math.max(itemWidth - localValue * 2, localValue);
    const computedValue = itemHeight * 0.84;
    const hypot = Math.hypot(localValueCurrent, computedValue);
    for (const localValueNext of [-1, 1]) {
      const mesh = addBoxMesh(rotation, localValue * 0.48, hypot, localValue * 0.42, 0, itemHeight * 0.5, -itemDepth * 0.5 + localValue * 0.18, furnitureItems, {
        ...objectValue,
        castShadow: false
      });
      mesh.rotation.z = localValueNext * Math.atan2(localValueCurrent, computedValue);
    }
  } else if (type.type === "pillar") {
    const localValue = Math.min(glass.wallOpacity * 1.75, 0.55);
    const material = createGlassPhysicalMaterial(glass.wall, localValue, {
      depthWrite: false,
      depthFunc: THREE.LessDepth
    });
    const localValueCurrent = createFloorStandardMaterial(glass.wall, localValue, {
      topColor: glass.wallTop ?? glass.wall
    });
    const position = new THREE.Mesh(new THREE.BoxGeometry(itemWidth, itemHeight, itemDepth), [material, material, localValueCurrent, material, material, material]);
    position.position.y = itemHeight * 0.5;
    setWallGradientHeight(THREE, position.geometry, "y", itemHeight * 0.5, 1, itemHeight);
    position.castShadow = true;
    position.receiveShadow = true;
    position.renderOrder = 4;
    position.userData.reflectionRole = "wall";
    position.layers.set(HELPER_LAYER);
    rotation.add(position);
  } else if (type.type === "wallcabinet") {
    const computedValue = itemHeight * 0.28;
    const value = itemHeight - computedValue;
    const computedValueCurrent = 1.4 + computedValue;
    addBoxMesh(rotation, itemWidth, value, itemDepth, 0, computedValueCurrent + value * 0.5, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth, computedValue, 0.045, 0, 1.4 + computedValue * 0.5, -itemDepth * 0.45, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, 1.4, 0, color, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, computedValueCurrent, 0, color, {
      roughness: 0.5
    });
    addBoxMesh(rotation, 0.045, computedValue, itemDepth, -itemWidth * 0.49, 1.4 + computedValue * 0.5, 0, furnitureItems);
    addBoxMesh(rotation, 0.045, computedValue, itemDepth, itemWidth * 0.49, 1.4 + computedValue * 0.5, 0, furnitureItems);
    const computedValueNext = itemWidth * 0.31;
    for (const localValue of [-0.33, 0, 0.33]) {
      addBoxMesh(rotation, computedValueNext, value * 0.9, 0.026, itemWidth * localValue, computedValueCurrent + value * 0.5, itemDepth * 0.515, color, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (["kitchenbase", "kitchensink", "kitchencooktop"].includes(type.type)) {
    const value = itemHeight * 0.1;
    const computedValue = itemHeight * 0.07;
    const computedValueCurrent = itemHeight - value - computedValue;
    const computedValueNext = value + computedValueCurrent * 0.5;
    addBoxMesh(rotation, itemWidth * 0.96, value, itemDepth * 0.8, 0, value * 0.5, -itemDepth * 0.06, furnitureDark, {
      rounded: false,
      roughness: 0.52
    });
    addBoxMesh(rotation, itemWidth, computedValueCurrent, itemDepth, 0, computedValueNext, 0, furnitureItems, {
      rounded: false,
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth * 1.02, computedValue, itemDepth * 1.04, 0, itemHeight - computedValue * 0.5, 0, furnitureLight, {
      rounded: false,
      roughness: 0.42
    });
    const localValue = Math.max(2, Math.min(6, Math.round(itemWidth / 0.6)));
    const halfValue = itemWidth / localValue;
    for (let zeroValue = 0; zeroValue < localValue; zeroValue += 1) {
      const computedValue = -itemWidth * 0.5 + halfValue * (zeroValue + 0.5);
      addBoxMesh(rotation, halfValue * 0.92, computedValueCurrent * 0.9, 0.025, computedValue, computedValueNext, itemDepth * 0.515, color, {
        rounded: false,
        roughness: 0.46
      });
      addBoxMesh(rotation, halfValue * 0.28, 0.022, 0.03, computedValue, value + computedValueCurrent * 0.83, itemDepth * 0.535, furnitureDark, {
        rounded: false,
        metalness: 0.28,
        roughness: 0.3
      });
    }
    if (type.type === "kitchensink") {
      addBoxMesh(rotation, itemWidth * 0.42, 0.025, itemDepth * 0.52, 0, itemHeight + 0.008, 0, furnitureDark, {
        rounded: false,
        metalness: 0.42,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.34, 0.02, itemDepth * 0.4, 0, itemHeight + 0.022, 0, color, {
        rounded: false,
        metalness: 0.18,
        roughness: 0.34
      });
      addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.22, itemWidth * 0.22, itemHeight + itemHeight * 0.11, -itemDepth * 0.17, furnitureDark, {
        segments: 20,
        metalness: 0.65,
        roughness: 0.2
      });
      addBoxMesh(rotation, itemWidth * 0.16, 0.035, 0.035, itemWidth * 0.14, itemHeight + itemHeight * 0.2, -itemDepth * 0.17, furnitureDark, {
        rounded: false,
        metalness: 0.65,
        roughness: 0.2
      });
    } else if (type.type === "kitchencooktop") {
      addBoxMesh(rotation, itemWidth * 0.48, 0.025, itemDepth * 0.55, 0, itemHeight + 0.008, 0, furnitureDark, {
        rounded: false,
        metalness: 0.32,
        roughness: 0.25
      });
      for (const localValue of [-itemWidth * 0.13, itemWidth * 0.13]) {
        for (const localValue of [-itemDepth * 0.14, itemDepth * 0.14]) {
          addSoftBoxMesh(rotation, itemWidth * 0.06, itemWidth * 0.06, 0.018, localValue, itemHeight + 0.028, localValue, color, {
            segments: 28,
            metalness: 0.42,
            roughness: 0.26
          });
          addSoftBoxMesh(rotation, itemWidth * 0.025, itemWidth * 0.025, 0.025, localValue, itemHeight + 0.045, localValue, furnitureDark, {
            segments: 24,
            metalness: 0.5,
            roughness: 0.22
          });
        }
      }
    }
  } else if (type.type === "fridge") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, furnitureLight, {
      metalness: 0.18,
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.88, 0.018, itemDepth * 1.01, 0, itemHeight * 0.42, itemDepth * 0.01, furnitureDark, {
      metalness: 0.5
    });
    addBoxMesh(rotation, 0.025, itemHeight * 0.27, 0.035, itemWidth * 0.35, itemHeight * 0.65, itemDepth * 0.515, furnitureDark, {
      metalness: 0.7
    });
  } else if (type.type === "storagewaterheater") {
    const localValue = Math.min(itemDepth * 0.43, itemHeight * 0.44);
    const computedValue = itemHeight * 0.52;
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.12, itemDepth * 0.22, 0, itemHeight * 0.1, -itemDepth * 0.36, furnitureDark, {
      rounded: false,
      metalness: 0.55,
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, localValue, localValue, itemWidth * 0.82, 0, computedValue, 0, furnitureLight, {
      segments: 36,
      rotationZ: Math.PI / 2,
      metalness: 0.2,
      roughness: 0.42
    });
    for (const localValueCurrent of [-itemWidth * 0.43, itemWidth * 0.43]) {
      addSoftBoxMesh(rotation, localValue * 1.03, localValue * 1.03, 0.025, localValueCurrent, computedValue, 0, color, {
        segments: 36,
        rotationZ: Math.PI / 2,
        metalness: 0.28,
        roughness: 0.34
      });
    }
    addBoxMesh(rotation, itemWidth * 0.31, itemHeight * 0.23, 0.026, 0, itemHeight * 0.51, itemDepth * 0.44, furnitureDark, {
      rounded: false,
      metalness: 0.18,
      roughness: 0.25
    });
    addBoxMesh(rotation, itemWidth * 0.16, itemHeight * 0.045, 0.018, 0, itemHeight * 0.58, itemDepth * 0.46, 7706534, {
      rounded: false,
      emissive: 7706534,
      emissiveIntensity: 0.18,
      roughness: 0.2
    });
    for (const localValue of [-itemWidth * 0.28, itemWidth * 0.28]) {
      addSoftBoxMesh(rotation, 0.022, 0.022, itemHeight * 0.16, localValue, itemHeight * 0.08, itemDepth * 0.12, localValue < 0 ? 4885698 : 12868184, {
        segments: 18,
        metalness: 0.55,
        roughness: 0.24
      });
      addSoftBoxMesh(rotation, 0.04, 0.04, 0.028, localValue, 0.015, itemDepth * 0.12, furnitureDark, {
        segments: 20,
        metalness: 0.45,
        roughness: 0.28
      });
    }
  } else if (type.type === "gaswaterheater") {
    const computedValue = itemHeight * 0.82;
    addBoxMesh(rotation, itemWidth, computedValue, itemDepth, 0, itemHeight * 0.47, 0, furnitureLight, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.86, computedValue * 0.42, 0.026, 0, itemHeight * 0.55, itemDepth * 0.515, color, {
      rounded: false,
      roughness: 0.36
    });
    addBoxMesh(rotation, itemWidth * 0.44, computedValue * 0.18, 0.018, 0, itemHeight * 0.67, itemDepth * 0.54, furnitureDark, {
      rounded: false,
      metalness: 0.14,
      roughness: 0.22
    });
    for (let zeroValue = 0; zeroValue < 5; zeroValue += 1) {
      addBoxMesh(rotation, itemWidth * 0.62, 0.012, 0.02, 0, itemHeight * (0.24 + zeroValue * 0.07), itemDepth * 0.525, furnitureDark, {
        rounded: false,
        roughness: 0.3
      });
    }
    addSoftBoxMesh(rotation, itemDepth * 0.17, itemDepth * 0.17, itemHeight * 0.18, 0, itemHeight * 0.91, 0, furnitureDark, {
      segments: 24,
      metalness: 0.58,
      roughness: 0.24
    });
    addSoftBoxMesh(rotation, itemDepth * 0.22, itemDepth * 0.22, 0.035, 0, itemHeight * 0.84, 0, color, {
      segments: 24,
      metalness: 0.5,
      roughness: 0.25
    });
    for (const [localValue, localValueCurrent] of [[-itemWidth * 0.28, 4885698], [0, 9410205], [itemWidth * 0.28, 12868184]]) {
      addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.18, localValue, itemHeight * 0.09, itemDepth * 0.12, localValueCurrent, {
        segments: 18,
        metalness: 0.62,
        roughness: 0.22
      });
      addSoftBoxMesh(rotation, 0.034, 0.034, 0.025, localValue, 0.014, itemDepth * 0.12, furnitureDark, {
        segments: 18,
        metalness: 0.5,
        roughness: 0.25
      });
    }
  } else if (type.type === "pipelinewaterpurifier") {
    const computedValue = itemHeight * 0.9;
    addBoxMesh(rotation, itemWidth, computedValue, itemDepth, 0, computedValue * 0.5, 0, furnitureLight, {
      rounded: false,
      metalness: 0.04,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.92, computedValue * 0.27, 0.028, 0, itemHeight * 0.76, itemDepth * 0.515, furnitureDark, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.34, computedValue * 0.045, 0.014, -itemWidth * 0.08, itemHeight * 0.79, itemDepth * 0.54, 10470608, {
      rounded: false,
      emissive: 10470608,
      emissiveIntensity: 0.2,
      roughness: 0.22
    });
    for (const localValue of [-0.26, 0, 0.26]) {
      addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.055, Math.min(itemWidth, itemDepth) * 0.055, 0.018, itemWidth * localValue, itemHeight * 0.66, itemDepth * 0.535, color, {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.22,
        roughness: 0.28
      });
    }
    for (const localValue of [-itemWidth * 0.2, itemWidth * 0.2]) {
      addSoftBoxMesh(rotation, 0.014, 0.014, itemHeight * 0.12, localValue, itemHeight * 0.49, itemDepth * 0.48, furnitureDark, {
        segments: 18,
        metalness: 0.46,
        roughness: 0.22
      });
      addSoftBoxMesh(rotation, 0.024, 0.018, 0.035, localValue, itemHeight * 0.425, itemDepth * 0.52, furnitureDark, {
        segments: 18,
        rotationX: Math.PI / 2,
        metalness: 0.46,
        roughness: 0.22
      });
    }
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.045, itemDepth * 0.52, 0, itemHeight * 0.11, itemDepth * 0.16, furnitureDark, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.42, 0.028, itemDepth * 0.28, 0, itemHeight * 0.16, itemDepth * 0.28, color, {
      rounded: false,
      roughness: 0.34
    });
  } else if (type.type === "tea_bar_machine") {
    const computedValue = itemHeight * 0.67;
    const value = computedValue + itemHeight * 0.045;
    const computedValueCurrent = itemHeight - value;
    addBoxMesh(rotation, itemWidth, computedValue, itemDepth, 0, computedValue * 0.5, 0, furnitureLight, {
      rounded: false,
      roughness: 0.5,
      metalness: 0.04
    });
    addBoxMesh(rotation, itemWidth * 0.94, 0.028, itemDepth * 1.02, 0, computedValue * 0.5, itemDepth * 0.515, furnitureDark, {
      rounded: false,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth * 0.94, 0.032, itemDepth * 1.02, 0, computedValue, 0, color, {
      rounded: false,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.94, itemHeight * 0.04, itemDepth * 1.04, 0, value, 0, furnitureLight, {
      rounded: false,
      roughness: 0.36,
      metalness: 0.1
    });
    addBoxMesh(rotation, itemWidth * 0.92, computedValueCurrent, 0.032, 0, value + computedValueCurrent * 0.5, -itemDepth * 0.46, color, {
      rounded: false,
      roughness: 0.56
    });
    for (const localValue of [-itemWidth * 0.46, itemWidth * 0.46]) {
      addBoxMesh(rotation, itemWidth * 0.075, computedValueCurrent, itemDepth * 0.78, localValue, value + computedValueCurrent * 0.5, 0, furnitureLight, {
        rounded: false,
        roughness: 0.48
      });
    }
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.14, itemDepth * 0.18, 0, itemHeight * 0.9, itemDepth * 0.48, furnitureDark, {
      rounded: false,
      metalness: 0.32,
      roughness: 0.22
    });
    for (const localValue of [-itemWidth * 0.22, itemWidth * 0.22]) {
      addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.035, Math.min(itemWidth, itemDepth) * 0.035, 0.018, localValue, itemHeight * 0.9, itemDepth * 0.585, color, {
        segments: 20,
        rotationX: Math.PI / 2,
        metalness: 0.2,
        roughness: 0.25
      });
      addSoftBoxMesh(rotation, 0.012, 0.012, itemHeight * 0.11, localValue, itemHeight * 0.79, itemDepth * 0.5, furnitureDark, {
        segments: 18,
        metalness: 0.48,
        roughness: 0.22
      });
      const computedValue = Math.min(itemWidth, itemDepth) * 0.16;
      addSoftBoxMesh(rotation, computedValue * 0.9, computedValue, itemHeight * 0.13, localValue, itemHeight * 0.75, itemDepth * 0.12, localValue < 0 ? 8752009 : color, {
        segments: 28,
        metalness: 0.08,
        roughness: 0.34
      });
      addSoftBoxMesh(rotation, computedValue * 0.84, computedValue * 0.84, 0.016, localValue, itemHeight * 0.82, itemDepth * 0.12, furnitureDark, {
        segments: 28,
        metalness: 0.18,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.12, itemHeight * 0.06, 0.016, localValue, itemHeight * 0.77, itemDepth * 0.3, furnitureDark, {
        radius: 0.012,
        metalness: 0.24,
        roughness: 0.24
      });
    }
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.055, itemDepth * 0.82, 0, 0.028, 0, furnitureDark, {
      rounded: false,
      roughness: 0.36
    });
  } else if (type.type === "washer" || type.type === "dryer") {
    const comparisonFlag = type.type === "dryer";
    const computedValue = itemWidth * (comparisonFlag ? 0.32 : 0.29);
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureLight, {
      rounded: false,
      metalness: 0.1,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.18, 0.035, 0, itemHeight * 0.86, itemDepth * 0.505, color, {
      rounded: false,
      roughness: 0.4
    });
    addSoftBoxMesh(rotation, computedValue, computedValue, 0.045, 0, itemHeight * 0.47, itemDepth * 0.515, furnitureDark, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.32,
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, computedValue * 0.74, computedValue * 0.74, 0.03, 0, itemHeight * 0.47, itemDepth * 0.545, comparisonFlag ? 2502715 : 3622485, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.08,
      roughness: 0.22
    });
    addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.035, itemWidth * 0.27, itemHeight * 0.86, itemDepth * 0.535, furnitureDark, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.4,
      roughness: 0.25
    });
    addBoxMesh(rotation, itemWidth * 0.25, itemHeight * 0.035, 0.026, -itemWidth * 0.23, itemHeight * 0.86, itemDepth * 0.535, furnitureDark, {
      rounded: false,
      roughness: 0.3
    });
    if (!comparisonFlag) {
      addBoxMesh(rotation, itemWidth * 0.2, itemHeight * 0.055, 0.025, -itemWidth * 0.3, itemHeight * 0.12, itemDepth * 0.525, color, {
        rounded: false,
        roughness: 0.42
      });
    }
  } else if (type.type === "dishwasher") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureLight, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.74, 0.028, 0, itemHeight * 0.46, itemDepth * 0.515, color, {
      rounded: false,
      metalness: 0.08,
      roughness: 0.44
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.14, 0.032, 0, itemHeight * 0.87, itemDepth * 0.52, furnitureDark, {
      rounded: false,
      metalness: 0.18,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.58, itemHeight * 0.026, 0.034, 0, itemHeight * 0.78, itemDepth * 0.54, furnitureDark, {
      rounded: false,
      metalness: 0.5,
      roughness: 0.22
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.075, itemDepth * 0.78, 0, itemHeight * 0.038, -itemDepth * 0.04, furnitureDark, {
      rounded: false,
      roughness: 0.4
    });
    for (const localValue of [0.22, 0.31, 0.4]) {
      addSoftBoxMesh(rotation, itemWidth * 0.018, itemWidth * 0.018, 0.012, itemWidth * localValue, itemHeight * 0.88, itemDepth * 0.545, color, {
        segments: 18,
        rotationX: Math.PI / 2,
        metalness: 0.26,
        roughness: 0.24
      });
    }
  } else if (type.type === "steamoven") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureLight, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.94, itemHeight * 0.9, 0.026, 0, itemHeight * 0.5, itemDepth * 0.515, furnitureDark, {
      rounded: false,
      metalness: 0.18,
      roughness: 0.25
    });
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.56, 0.018, -itemWidth * 0.03, itemHeight * 0.42, itemDepth * 0.54, 1515819, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.72, itemHeight * 0.035, 0.038, -itemWidth * 0.03, itemHeight * 0.74, itemDepth * 0.56, color, {
      rounded: false,
      metalness: 0.52,
      roughness: 0.22
    });
    addBoxMesh(rotation, itemWidth * 0.24, itemHeight * 0.075, 0.022, 0, itemHeight * 0.86, itemDepth * 0.545, 7706534, {
      rounded: false,
      emissive: 7706534,
      emissiveIntensity: 0.18,
      roughness: 0.2
    });
    for (const localValue of [-0.36, 0.36]) {
      addSoftBoxMesh(rotation, itemWidth * 0.045, itemWidth * 0.045, 0.026, itemWidth * localValue, itemHeight * 0.86, itemDepth * 0.55, color, {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.4,
        roughness: 0.24
      });
    }
  } else if (type.type === "microwave") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureLight, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.44
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.82, 0.025, 0, itemHeight * 0.49, itemDepth * 0.515, furnitureDark, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.24
    });
    addBoxMesh(rotation, itemWidth * 0.62, itemHeight * 0.63, 0.018, -itemWidth * 0.13, itemHeight * 0.48, itemDepth * 0.54, 1515819, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.035, itemHeight * 0.54, 0.03, itemWidth * 0.19, itemHeight * 0.48, itemDepth * 0.55, color, {
      rounded: false,
      metalness: 0.46,
      roughness: 0.22
    });
    addBoxMesh(rotation, itemWidth * 0.17, itemHeight * 0.1, 0.02, itemWidth * 0.36, itemHeight * 0.72, itemDepth * 0.54, 7706534, {
      rounded: false,
      emissive: 7706534,
      emissiveIntensity: 0.16,
      roughness: 0.2
    });
    for (const localValue of [0.48, 0.34, 0.2]) {
      addBoxMesh(rotation, itemWidth * 0.13, itemHeight * 0.055, 0.018, itemWidth * 0.36, itemHeight * localValue, itemDepth * 0.545, color, {
        rounded: false,
        roughness: 0.3
      });
    }
  } else if (type.type === "ricecooker") {
    const computedValue = Math.min(itemWidth, itemDepth) * 0.47;
    addSoftBoxMesh(rotation, computedValue * 0.9, computedValue, itemHeight * 0.68, 0, itemHeight * 0.38, 0, furnitureLight, {
      segments: 36,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, computedValue * 0.94, computedValue * 0.94, itemHeight * 0.12, 0, itemHeight * 0.77, 0, color, {
      segments: 36,
      roughness: 0.38
    });
    addSoftBoxMesh(rotation, computedValue * 0.72, computedValue * 0.74, itemHeight * 0.035, 0, itemHeight * 0.85, 0, furnitureDark, {
      segments: 32,
      metalness: 0.12,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.5, itemHeight * 0.16, 0.026, 0, itemHeight * 0.42, itemDepth * 0.47, furnitureDark, {
      radius: Math.min(itemWidth, itemDepth) * 0.04,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.24, itemHeight * 0.06, 0.018, 0, itemHeight * 0.43, itemDepth * 0.49, 7706534, {
      rounded: false,
      emissive: 7706534,
      emissiveIntensity: 0.16,
      roughness: 0.2
    });
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, -itemWidth * 0.27, itemHeight * 0.86, 0, furnitureDark, {
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, itemWidth * 0.27, itemHeight * 0.86, 0, furnitureDark, {
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.58, itemHeight * 0.055, itemDepth * 0.1, 0, itemHeight * 0.94, 0, furnitureDark, {
      roughness: 0.3
    });
  } else if (type.type === "rangehood") {
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.72, itemDepth * 0.42, 0, itemHeight * 0.6, -itemDepth * 0.18, furnitureItems, {
      rounded: false,
      metalness: 0.22,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth, itemHeight * 0.22, itemDepth, 0, itemHeight * 0.18, 0, furnitureLight, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.07, itemDepth * 0.8, 0, itemHeight * 0.055, itemDepth * 0.02, furnitureDark, {
      rounded: false,
      metalness: 0.35,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.22, itemHeight * 0.035, 0.025, itemWidth * 0.3, itemHeight * 0.2, itemDepth * 0.515, color, {
      rounded: false,
      emissive: color,
      emissiveIntensity: 0.12,
      roughness: 0.3
    });
  } else if (type.type === "wallac") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureLight, {
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.08, itemDepth * 0.18, 0, itemHeight * 0.18, itemDepth * 0.46, furnitureDark, {
      rounded: false,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.12, itemHeight * 0.08, itemDepth * 0.05, itemWidth * 0.34, itemHeight * 0.68, itemDepth * 0.51, color, {
      rounded: false,
      emissive: color,
      emissiveIntensity: 0.18
    });
  } else if (type.type === "floorac") {
    addSoftBoxMesh(rotation, itemWidth * 0.46, itemWidth * 0.48, itemHeight, 0, itemHeight * 0.5, 0, furnitureLight, {
      segments: 32,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.5, itemHeight * 0.42, 0.025, 0, itemHeight * 0.68, itemDepth * 0.48, furnitureDark, {
      rounded: false,
      roughness: 0.3
    });
    for (const localValue of [0.58, 0.68, 0.78]) {
      addBoxMesh(rotation, itemWidth * 0.42, 0.018, 0.03, 0, itemHeight * localValue, itemDepth * 0.5, color, {
        rounded: false,
        roughness: 0.34
      });
    }
  } else if (type.type === "robotvacuum") {
    addBoxMesh(rotation, itemWidth * 0.82, 0.035, itemDepth * 0.92, 0, 0.018, 0, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.05,
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.82, itemDepth * 0.48, 0, itemHeight * 0.47, -itemDepth * 0.23, furnitureLight, {
      radius: Math.min(itemWidth, itemDepth) * 0.12,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.44, itemHeight * 0.16, 0.03, 0, itemHeight * 0.2, itemDepth * 0.02, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.04,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.07, 0.035, 0, itemHeight * 0.14, itemDepth * 0.04, furnitureDark, {
      radius: Math.min(itemWidth, itemDepth) * 0.025,
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, itemWidth * 0.31, itemWidth * 0.32, itemHeight * 0.12, 0, itemHeight * 0.07, itemDepth * 0.2, furnitureLight, {
      segments: 32,
      roughness: 0.42
    });
    addSoftBoxMesh(rotation, itemWidth * 0.085, itemWidth * 0.09, itemHeight * 0.055, -itemWidth * 0.08, itemHeight * 0.16, itemDepth * 0.15, color, {
      segments: 24,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth * 0.36, itemHeight * 0.045, 0.025, 0, itemHeight * 0.08, itemDepth * 0.52, furnitureDark, {
      radius: Math.min(itemWidth, itemDepth) * 0.025,
      roughness: 0.24
    });
  } else if (type.type === "camera" || type.type === "presence") {
    addSecurityModel(THREE, rotation, type, glass);
  } else if (type.type === "nas") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureItems, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.88, 0.025, 0, itemHeight * 0.5, itemDepth * 0.515, furnitureDark, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.32
    });
    for (const localValue of [-itemWidth * 0.23, itemWidth * 0.23]) {
      for (const localValue of [itemHeight * 0.3, itemHeight * 0.7]) {
        addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.34, 0.018, localValue, localValue, itemDepth * 0.535, color, {
          rounded: false,
          roughness: 0.38
        });
        addBoxMesh(rotation, itemWidth * 0.18, 0.018, 0.012, localValue, localValue + itemHeight * 0.1, itemDepth * 0.55, furnitureDark, {
          rounded: false,
          metalness: 0.25,
          roughness: 0.3
        });
      }
    }
    for (const localValue of [0.18, 0.26, 0.34]) {
      addBoxMesh(rotation, 0.012, 0.012, 0.012, itemWidth * 0.42, itemHeight * localValue, itemDepth * 0.55, 9550021, {
        rounded: false,
        emissive: 9550021,
        emissiveIntensity: 0.28,
        roughness: 0.2
      });
    }
  } else if (type.type === "airpurifier") {
    const computedValue = Math.min(itemWidth, itemDepth) * 0.47;
    addSoftBoxMesh(rotation, computedValue * 0.96, computedValue, itemHeight * 0.92, 0, itemHeight * 0.46, 0, furnitureLight, {
      segments: 36,
      roughness: 0.5
    });
    addSoftBoxMesh(rotation, computedValue * 0.92, computedValue * 0.92, itemHeight * 0.055, 0, itemHeight * 0.965, 0, furnitureDark, {
      segments: 36,
      metalness: 0.18,
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, computedValue * 0.55, computedValue * 0.55, itemHeight * 0.018, 0, itemHeight * 1.005, 0, color, {
      segments: 32,
      metalness: 0.08,
      roughness: 0.35
    });
    for (const localValue of [-0.28, -0.14, 0, 0.14, 0.28]) {
      addBoxMesh(rotation, 0.012, itemHeight * 0.45, 0.012, itemWidth * localValue, itemHeight * 0.35, itemDepth * 0.46, color, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type.type === "tv") {
    const {
      bodyHeight: localValue,
      centerY: metrics
    } = tvMountLayoutMetrics(type, itemHeight);
    const value = metrics - localValue * 0.5;
    if (type.tvMountStyle === "mobile") {
      const localValue = Math.max(itemHeight * 0.045, 0.055);
      const computedValue = itemWidth * 0.7;
      const max = Math.max(itemDepth * 0.78, 0.3);
      const localValueCurrent = Math.max(value - localValue * 0.7, itemHeight * 0.22);
      const computedValueCurrent = localValue * 0.7 + localValueCurrent * 0.5;
      addBoxMesh(rotation, computedValue, localValue, max, 0, localValue * 0.72, 0, furnitureDark, {
        radius: Math.min(localValue, max) * 0.22,
        metalness: 0.18,
        roughness: 0.32
      });
      addBoxMesh(rotation, itemWidth * 0.075, localValueCurrent, Math.max(itemDepth * 0.2, 0.06), -itemWidth * 0.035, computedValueCurrent, -itemDepth * 0.03, furnitureDark, {
        rounded: false,
        metalness: 0.2,
        roughness: 0.3
      });
      addBoxMesh(rotation, itemWidth * 0.105, localValueCurrent * 0.86, Math.max(itemDepth * 0.12, 0.04), itemWidth * 0.025, computedValueCurrent + localValueCurrent * 0.02, itemDepth * 0.015, color, {
        rounded: false,
        metalness: 0.35,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.34, Math.max(itemHeight * 0.018, 0.025), Math.max(itemDepth * 0.5, 0.2), 0, value * 0.76, itemDepth * 0.04, furnitureDark, {
        radius: 0.012,
        metalness: 0.22,
        roughness: 0.3
      });
      const localValueNext = Math.max(Math.min(itemWidth, itemDepth) * 0.045, 0.025);
      for (const localValue of [-computedValue * 0.42, computedValue * 0.42]) {
        for (const localValue of [-max * 0.34, max * 0.34]) {
          addSoftBoxMesh(rotation, localValueNext, localValueNext, Math.max(localValueNext * 0.56, 0.018), localValue, localValueNext, localValue, 1448479, {
            segments: 20,
            rotationZ: Math.PI / 2,
            roughness: 0.38,
            metalness: 0.1
          });
        }
      }
    } else if (type.tvMountStyle === "tabletop") {
      const localValue = Math.max(itemHeight * 0.035, 0.028);
      const computedValue = itemWidth * 0.34;
      const max = Math.max(itemDepth * 0.72, 0.16);
      const localValueCurrent = Math.max(value - localValue, itemHeight * 0.12);
      addBoxMesh(rotation, computedValue, localValue, max, 0, localValue * 0.5, 0, furnitureDark, {
        radius: Math.min(localValue, max) * 0.26,
        metalness: 0.2,
        roughness: 0.3
      });
      addBoxMesh(rotation, itemWidth * 0.075, localValueCurrent, Math.max(itemDepth * 0.24, 0.05), 0, localValue + localValueCurrent * 0.5, -itemDepth * 0.03, color, {
        rounded: false,
        metalness: 0.34,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.18, Math.max(itemHeight * 0.025, 0.022), Math.max(itemDepth * 0.34, 0.08), 0, value, 0, furnitureDark, {
        radius: 0.008,
        metalness: 0.22,
        roughness: 0.3
      });
    }
    addBoxMesh(rotation, itemWidth, localValue, Math.max(itemDepth * 0.28, 0.05), 0, metrics, 0, furnitureDark, {
      radius: Math.min(itemWidth, localValue) * 0.012,
      roughness: 0.28
    });
  } else if (type.type === "vanity") {
    const localValue = Math.min(0.76, itemHeight * 0.5);
    addBoxMesh(rotation, itemWidth, 0.075, itemDepth, 0, localValue, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, localValue * 0.82, itemDepth * 0.88, -itemWidth * 0.34, localValue * 0.42, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, localValue * 0.82, itemDepth * 0.88, itemWidth * 0.34, localValue * 0.42, 0, furnitureItems);
    for (const localValueCurrent of [-0.34, 0.34]) {
      for (const localValue of [0.23, 0.48]) {
        addBoxMesh(rotation, itemWidth * 0.22, 0.012, itemDepth * 0.02, itemWidth * localValueCurrent, localValue * localValue, itemDepth * 0.46, furnitureDark, {
          rounded: false
        });
      }
    }
    const max = Math.max(itemHeight - localValue - 0.08, 0.45);
    addBoxMesh(rotation, itemWidth * 0.54, max, 0.025, 0, localValue + max * 0.5, -itemDepth * 0.43, glass.glass, {
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      metalness: 0.22,
      roughness: 0.16
    });
    addBoxMesh(rotation, itemWidth * 0.59, 0.045, 0.05, 0, localValue + max, -itemDepth * 0.43, furnitureLight, {
      metalness: 0.12
    });
    addBoxMesh(rotation, itemWidth * 0.59, 0.045, 0.05, 0, localValue, -itemDepth * 0.43, furnitureLight, {
      metalness: 0.12
    });
    addBoxMesh(rotation, 0.045, max, 0.05, -itemWidth * 0.295, localValue + max * 0.5, -itemDepth * 0.43, furnitureLight, {
      metalness: 0.12
    });
    addBoxMesh(rotation, 0.045, max, 0.05, itemWidth * 0.295, localValue + max * 0.5, -itemDepth * 0.43, furnitureLight, {
      metalness: 0.12
    });
  } else if (type.type === "desk") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.1, itemDepth, 0, itemHeight * 0.93, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, -itemWidth * 0.44, itemHeight * 0.44, 0, furnitureDark);
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, itemWidth * 0.44, itemHeight * 0.44, 0, furnitureDark);
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.18, itemDepth * 0.78, itemWidth * 0.22, itemHeight * 0.74, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, 0.018, itemDepth * 0.04, itemWidth * 0.22, itemHeight * 0.73, itemDepth * 0.41, furnitureLight, {
      metalness: 0.35
    });
  } else if (type.type === "desktop") {
    const computedValue = itemWidth * 0.72;
    const value = itemHeight * 0.58;
    addBoxMesh(rotation, computedValue, value, 0.035, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.25, furnitureDark, {
      rounded: false,
      roughness: 0.24
    });
    addBoxMesh(rotation, computedValue * 0.9, value * 0.84, 0.01, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.19, 659481, {
      rounded: false,
      roughness: 0.18,
      emissive: 1517112,
      emissiveIntensity: 0.35
    });
    addBoxMesh(rotation, 0.035, itemHeight * 0.24, 0.035, -itemWidth * 0.06, itemHeight * 0.25, -itemDepth * 0.25, furnitureDark, {
      metalness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.28, 0.025, itemDepth * 0.3, -itemWidth * 0.06, 0.02, -itemDepth * 0.22, furnitureDark, {
      metalness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.58, 0.022, itemDepth * 0.38, -itemWidth * 0.08, 0.025, itemDepth * 0.24, color, {
      rounded: false,
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.1, 0.035, itemDepth * 0.22, itemWidth * 0.36, 0.028, itemDepth * 0.24, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.46
    });
  } else if (type.type === "laptop") {
    addBoxMesh(rotation, itemWidth, 0.025, itemDepth * 0.72, 0, 0.018, itemDepth * 0.08, furnitureItems, {
      metalness: 0.28,
      roughness: 0.36
    });
    const mesh = addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.78, 0.018, 0, itemHeight * 0.43, -itemDepth * 0.29, furnitureDark, {
      rounded: false,
      metalness: 0.22,
      roughness: 0.25
    });
    mesh.rotation.x = -Math.PI * 0.08;
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.63, 0.01, 0, itemHeight * 0.43, -itemDepth * 0.278, 659740, {
      rounded: false,
      emissive: 1585226,
      emissiveIntensity: 0.38,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.62, 0.009, itemDepth * 0.34, 0, 0.035, itemDepth * 0.12, furnitureDark, {
      rounded: false
    });
  } else if (type.type === "toilet") {
    const castShadow = new THREE.Mesh(createWallTopMaterial(itemWidth, itemDepth, itemHeight), new THREE.MeshStandardMaterial({
      color: furnitureLight,
      roughness: 0.4,
      metalness: 0.02
    }));
    castShadow.castShadow = true;
    castShadow.receiveShadow = true;
    rotation.add(castShadow);
    const bezierCurveTo = new THREE.Shape();
    bezierCurveTo.moveTo(-itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.lineTo(itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.bezierCurveTo(itemWidth * 0.49, -itemDepth * 0.05, itemWidth * 0.49, itemDepth * 0.29, 0, itemDepth * 0.47);
    bezierCurveTo.bezierCurveTo(-itemWidth * 0.49, itemDepth * 0.29, -itemWidth * 0.49, -itemDepth * 0.05, -itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.closePath();
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bezierCurveTo, {
      depth: itemHeight * 0.085,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.012,
      bevelThickness: 0.01,
      steps: 1
    }), new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.34,
      metalness: 0.01
    }));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(0, itemHeight * 0.82, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rotation.add(mesh);
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.095, itemDepth * 0.2, 0, itemHeight * 0.775, -itemDepth * 0.34, furnitureLight, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.36
    });
    addBoxMesh(rotation, 0.016, itemHeight * 0.38, 0.024, -itemWidth * 0.42, itemHeight * 0.38, -itemDepth * 0.18, furnitureDark, {
      rounded: false,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, itemWidth * 0.035, itemWidth * 0.035, 0.018, -itemWidth * 0.46, itemHeight * 0.66, itemDepth * 0.12, color, {
      segments: 24,
      rotationZ: Math.PI / 2,
      metalness: 0.08,
      roughness: 0.3
    });
  } else if (type.type === "squattoilet") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.58, itemDepth, 0, itemHeight * 0.29, 0, furnitureLight, {
      radius: Math.min(itemWidth, itemDepth) * 0.08,
      roughness: 0.38
    });
    addBoxMesh(rotation, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, -itemWidth * 0.34, itemHeight * 0.66, 0, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, itemWidth * 0.34, itemHeight * 0.66, 0, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.4
    });
    const scale = new THREE.Mesh(new THREE.CylinderGeometry(itemWidth * 0.16, itemWidth * 0.2, itemHeight * 0.18, 28), new THREE.MeshStandardMaterial({
      color: furnitureDark,
      roughness: 0.34,
      metalness: 0.02
    }));
    scale.scale.z = 1.75;
    scale.position.y = itemHeight * 0.67;
    rotation.add(scale);
  } else if (type.type === "urinal") {
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.88, itemDepth * 0.72, 0, itemHeight * 0.5, -itemDepth * 0.06, furnitureLight, {
      radius: Math.min(itemWidth, itemDepth) * 0.16,
      roughness: 0.32
    });
    const scale = new THREE.Mesh(new THREE.SphereGeometry(Math.min(itemWidth, itemDepth) * 0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide
    }));
    scale.scale.set(0.9, 1.1, 0.62);
    scale.rotation.x = Math.PI;
    scale.position.set(0, itemHeight * 0.53, itemDepth * 0.17);
    rotation.add(scale);
    addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.22, 0, itemHeight * 0.95, -itemDepth * 0.18, furnitureDark, {
      segments: 16,
      metalness: 0.72,
      roughness: 0.22
    });
  } else if (type.type === "bathtub") {
    const computedValue = itemHeight * 0.84;
    const cornerRadiusBase = Math.min(itemWidth, itemDepth) * 0.11;
    const value = computedValue * 0.8;
    const localValue = Math.max(itemWidth - cornerRadiusBase * 2, itemWidth * 0.48);
    const max = Math.max(itemDepth - cornerRadiusBase * 2, itemDepth * 0.42);
    addBoxMesh(rotation, localValue, computedValue * 0.16, max, 0, computedValue * 0.14, 0, color, {
      radius: Math.min(itemWidth, itemDepth) * 0.16,
      roughness: 0.33
    });
    addBoxMesh(rotation, itemWidth, value, cornerRadiusBase, 0, value * 0.5, -itemDepth * 0.5 + cornerRadiusBase * 0.5, furnitureLight, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth, value, cornerRadiusBase, 0, value * 0.5, itemDepth * 0.5 - cornerRadiusBase * 0.5, furnitureLight, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, cornerRadiusBase, value, max, -itemWidth * 0.5 + cornerRadiusBase * 0.5, value * 0.5, 0, furnitureLight, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, cornerRadiusBase, value, max, itemWidth * 0.5 - cornerRadiusBase * 0.5, value * 0.5, 0, furnitureLight, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    const computedValueCurrent = computedValue * 0.075;
    const computedValueNext = value + computedValueCurrent * 0.5;
    addBoxMesh(rotation, itemWidth, computedValueCurrent, cornerRadiusBase, 0, computedValueNext, -itemDepth * 0.5 + cornerRadiusBase * 0.5, furnitureLight, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, itemWidth, computedValueCurrent, cornerRadiusBase, 0, computedValueNext, itemDepth * 0.5 - cornerRadiusBase * 0.5, furnitureLight, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValueCurrent, max, -itemWidth * 0.5 + cornerRadiusBase * 0.5, computedValueNext, 0, furnitureLight, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValueCurrent, max, itemWidth * 0.5 - cornerRadiusBase * 0.5, computedValueNext, 0, furnitureLight, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    for (const localValueCurrent of [-itemWidth * 0.38, itemWidth * 0.38]) {
      for (const localValue of [-itemDepth * 0.3, itemDepth * 0.3]) {
        addSoftBoxMesh(rotation, 0.026, 0.026, itemHeight * 0.16, localValueCurrent, itemHeight * 0.08, localValue, glass.furnitureDark, {
          segments: 12,
          metalness: 0.42,
          roughness: 0.3
        });
      }
    }
    addSoftBoxMesh(rotation, 0.016, 0.016, itemHeight * 0.25, itemWidth * 0.34, itemHeight * 0.96, -itemDepth * 0.22, furnitureDark, {
      segments: 16,
      metalness: 0.72,
      roughness: 0.2
    });
    addSoftBoxMesh(rotation, 0.016, 0.016, itemDepth * 0.28, itemWidth * 0.34, itemHeight * 1.08, -itemDepth * 0.08, furnitureDark, {
      segments: 16,
      rotationX: Math.PI / 2,
      metalness: 0.72,
      roughness: 0.2
    });
  } else if (type.type === "walllamp") {
    const computedValue = -itemDepth * 0.5 + 0.018;
    const objectValue = {
      rounded: false,
      metalness: 0.64,
      roughness: 0.22
    };
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.5, 0.035, 0, itemHeight * 0.52, computedValue, glass.furniture, {
      radius: 0.02,
      metalness: 0.18,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, itemWidth * 0.11, itemWidth * 0.11, 0.035, 0, itemHeight * 0.57, computedValue - 0.012, glass.furnitureSoft, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.3,
      roughness: 0.34
    });
    addBoxMesh(rotation, 0.04, itemHeight * 0.2, itemDepth * 0.28, 0, itemHeight * 0.57, -itemDepth * 0.3, glass.furniture, {
      ...objectValue,
      metalness: 0.18,
      roughness: 0.46
    });
    const position = new THREE.Mesh(new THREE.CylinderGeometry(itemWidth * 0.3, itemWidth * 0.19, itemHeight * 0.38, 24, 1, true), new THREE.MeshStandardMaterial({
      color: furnitureLight,
      roughness: 0.3,
      metalness: 0.04,
      emissive: 16767386,
      emissiveIntensity: 0.24,
      side: THREE.DoubleSide
    }));
    position.position.set(0, itemHeight * 0.4, -itemDepth * 0.16);
    position.castShadow = true;
    position.receiveShadow = true;
    rotation.add(position);
    addSoftBoxMesh(rotation, itemWidth * 0.15, itemWidth * 0.15, 0.025, 0, itemHeight * 0.19, -itemDepth * 0.16, 16769707, {
      segments: 24,
      emissive: 16760156,
      emissiveIntensity: 0.38,
      roughness: 0.24
    });
  } else if (type.type === "glasspartition") {
    const localValue = Math.min(Math.max(itemWidth * 0.018, 0.018), 0.035);
    const max = Math.max(itemDepth, 0.045);
    const localValueCurrent = Math.max(itemWidth - localValue * 2.4, localValue);
    const localValueNext = Math.max(itemHeight - localValue * 2.4, localValue);
    const objectValue = {
      rounded: false,
      metalness: 0.58,
      roughness: 0.24,
      castShadow: false,
      receiveShadow: false
    };
    addBoxMesh(rotation, localValueCurrent, localValueNext, Math.max(itemDepth * 0.24, 0.012), 0, itemHeight * 0.5, 0, glass.glass, {
      rounded: false,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      side: THREE.DoubleSide,
      metalness: 0.04,
      roughness: 0.08,
      castShadow: false,
      receiveShadow: false,
      renderOrder: 6
    });
    addBoxMesh(rotation, itemWidth, localValue, max, 0, localValue * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, itemWidth, localValue, max, 0, itemHeight - localValue * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, localValue, itemHeight, max, -itemWidth * 0.5 + localValue * 0.5, itemHeight * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, localValue, itemHeight, max, itemWidth * 0.5 - localValue * 0.5, itemHeight * 0.5, 0, glass.frame, objectValue);
    for (const localValueCurrent of [-itemWidth * 0.34, itemWidth * 0.34]) {
      addBoxMesh(rotation, localValue * 1.7, localValue * 2.2, max * 1.18, localValueCurrent, localValue * 1.3, 0, color, objectValue);
    }
  } else if (type.type === "shower") {
    const localValue = furnitureLight;
    const computedValue = -itemDepth * 0.42;
    const value = itemHeight * 0.13;
    const computedValueCurrent = itemHeight * 0.9;
    const computedValueNext = computedValueCurrent - value;
    const objectValue = {
      rounded: false,
      metalness: 0.68,
      roughness: 0.22
    };
    addBoxMesh(rotation, 0.045, computedValueNext, 0.045, 0, (value + computedValueCurrent) * 0.5, computedValue, localValue, objectValue);
    for (const localValueCurrent of [value, itemHeight * 0.47, itemHeight * 0.78, computedValueCurrent]) {
      addBoxMesh(rotation, 0.085, 0.085, 0.065, 0, localValueCurrent, computedValue, localValue, objectValue);
    }
    for (const localValueCurrent of [value, computedValueCurrent]) {
      addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.04, 0, localValueCurrent, -itemDepth * 0.47, localValue, {
        segments: 28,
        rotationX: Math.PI / 2,
        metalness: 0.7,
        roughness: 0.2
      });
    }
    const computedValuePrevious = itemHeight * 0.12;
    addBoxMesh(rotation, itemWidth * 0.36, 0.065, 0.065, 0, computedValuePrevious, computedValue + itemDepth * 0.08, localValue, objectValue);
    for (const localValueCurrent of [-itemWidth * 0.2, itemWidth * 0.2]) {
      addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.045, localValueCurrent, computedValuePrevious, -itemDepth * 0.45, localValue, {
        segments: 28,
        rotationX: Math.PI / 2,
        metalness: 0.7,
        roughness: 0.2
      });
      addBoxMesh(rotation, 0.05, 0.05, itemDepth * 0.13, localValueCurrent, computedValuePrevious, computedValue + itemDepth * 0.01, localValue, objectValue);
    }
    addBoxMesh(rotation, 0.045, itemHeight * 0.12, 0.045, 0, computedValuePrevious - itemHeight * 0.045, computedValue + itemDepth * 0.13, localValue, objectValue);
    const y = new THREE.Vector3(0, computedValueCurrent, computedValue);
    const z = new THREE.Vector3(0, itemHeight * 0.76, itemDepth * 0.08);
    const computedValueLocal = z.y - y.y;
    const computedValueItem = z.z - y.z;
    const hypot = Math.hypot(computedValueLocal, computedValueItem);
    const mesh = addBoxMesh(rotation, 0.055, hypot, 0.055, 0, (y.y + z.y) * 0.5, (y.z + z.z) * 0.5, localValue, objectValue);
    mesh.rotation.x = Math.atan2(computedValueItem, computedValueLocal);
    addBoxMesh(rotation, 0.055, itemHeight * 0.13, 0.055, 0, itemHeight * 0.705, z.z, localValue, objectValue);
    addBoxMesh(rotation, itemWidth * 0.34, 0.035, itemDepth * 0.3, 0, itemHeight * 0.64, z.z + itemDepth * 0.03, localValue, {
      rounded: false,
      metalness: 0.64,
      roughness: 0.24
    });
  } else if (type.type === "basin") {
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.72, itemDepth * 0.9, 0, itemHeight * 0.36, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth, 0.065, itemDepth, 0, itemHeight * 0.75, 0, furnitureLight, {
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, itemWidth * 0.25, itemWidth * 0.21, 0.08, 0, itemHeight * 0.8, itemDepth * 0.02, color, {
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.2, 0, itemHeight * 0.9, -itemDepth * 0.2, furnitureDark, {
      metalness: 0.78,
      roughness: 0.18
    });
    addSoftBoxMesh(rotation, 0.018, 0.018, itemDepth * 0.2, 0, itemHeight * 0.99, -itemDepth * 0.11, furnitureDark, {
      rotationX: Math.PI / 2,
      metalness: 0.78,
      roughness: 0.18
    });
    addBoxMesh(rotation, 0.012, itemHeight * 0.62, itemDepth * 0.02, 0, itemHeight * 0.34, itemDepth * 0.46, furnitureDark, {
      rounded: false
    });
    const computedValue = itemHeight * 1.05;
    const value = itemWidth * 0.72;
    const numericValue = 0.72;
    const computedValueCurrent = -itemDepth * 0.46;
    addBoxMesh(rotation, value, numericValue, 0.018, 0, computedValue + numericValue * 0.5, computedValueCurrent, glass.glass, {
      rounded: false,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      metalness: 0.26,
      roughness: 0.12,
      castShadow: false
    });
    addBoxMesh(rotation, value + 0.055, 0.035, 0.045, 0, computedValue, computedValueCurrent, furnitureDark, {
      metalness: 0.35
    });
    addBoxMesh(rotation, value + 0.055, 0.035, 0.045, 0, computedValue + numericValue, computedValueCurrent, furnitureDark, {
      metalness: 0.35
    });
    addBoxMesh(rotation, 0.035, numericValue, 0.045, -value * 0.5, computedValue + numericValue * 0.5, computedValueCurrent, furnitureDark, {
      metalness: 0.35
    });
    addBoxMesh(rotation, 0.035, numericValue, 0.045, value * 0.5, computedValue + numericValue * 0.5, computedValueCurrent, furnitureDark, {
      metalness: 0.35
    });
  } else if (type.type === "rug") {
    if (!addRugMeshes(rotation, type, furnitureItems, color)) {
      const clampedValue = clamp(itemHeight, 0.004, 0.018);
      addBoxMesh(rotation, itemWidth, clampedValue, itemDepth, 0, clampedValue * 0.5, 0, furnitureItems, {
        radius: Math.min(itemWidth, itemDepth) * 0.018,
        roughness: 1,
        metalness: 0,
        castShadow: false,
        receiveShadow: true
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth * 0.88, itemDepth * 0.84), new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -4
      }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = clampedValue + 0.001;
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      mesh.renderOrder = 1;
      rotation.add(mesh);
    }
  } else if (type.type === "tvstand") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.76, itemDepth, 0, itemHeight * 0.42, 0, furnitureItems);
    const computedValue = itemHeight * 0.08;
    const value = itemHeight * 0.8;
    addBoxMesh(rotation, itemWidth * 0.98, computedValue, itemDepth, 0, value + computedValue * 0.5, 0, color);
    addBoxMesh(rotation, 0.018, itemHeight * 0.58, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, furnitureDark, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.91, 0.015, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, furnitureDark, {
      rounded: false
    });
    for (const localValue of [-0.4, 0.4]) {
      addBoxMesh(rotation, 0.055, itemHeight * 0.2, 0.055, itemWidth * localValue, itemHeight * 0.1, 0, furnitureDark, {
        metalness: 0.32
      });
    }
  } else if (type.type === "floorlamp") {
    const computedValue = -itemWidth * 0.34;
    const value = itemWidth * 0.31;
    const localValue = Math.min(itemWidth * 0.13, itemDepth * 0.34);
    const min = Math.min(itemWidth * 0.18, itemDepth * 0.46);
    const computedValueCurrent = itemHeight * 0.115;
    const computedValueNext = itemHeight * 0.76;
    const computedValuePrevious = computedValueNext + computedValueCurrent;
    addSoftBoxMesh(rotation, localValue * 0.82, localValue, 0.045, computedValue, 0.0225, 0, furnitureDark, {
      segments: 32,
      metalness: 0.38,
      roughness: 0.3
    });
    const constructedCubicBezierCurve = new THREE.CubicBezierCurve3(new THREE.Vector3(computedValue, 0.045, 0), new THREE.Vector3(computedValue, itemHeight * 0.72, 0), new THREE.Vector3(itemWidth * 0.02, itemHeight * 1.01, 0), new THREE.Vector3(value, computedValuePrevious, 0));
    const castShadow = new THREE.Mesh(new THREE.TubeGeometry(constructedCubicBezierCurve, 48, Math.max(0.012, itemWidth * 0.012), 8, false), new THREE.MeshStandardMaterial({
      color: furnitureDark,
      roughness: 0.3,
      metalness: 0.48
    }));
    castShadow.castShadow = true;
    rotation.add(castShadow);
    const scale = new THREE.Mesh(new THREE.SphereGeometry(min, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.62,
      metalness: 0.04
    }));
    scale.scale.set(1, computedValueCurrent / min, 1);
    scale.position.set(value, computedValueNext, 0);
    scale.castShadow = true;
    rotation.add(scale);
    addSoftBoxMesh(rotation, min * 0.94, min * 0.98, 0.025, value, computedValueNext, 0, furnitureDark, {
      segments: 32,
      metalness: 0.12,
      roughness: 0.5
    });
    addSoftBoxMesh(rotation, Math.max(0.018, itemWidth * 0.014), Math.max(0.022, itemWidth * 0.018), 0.045, value, computedValuePrevious + 0.012, 0, furnitureDark, {
      segments: 20,
      metalness: 0.42,
      roughness: 0.28
    });
  } else if (type.type === "plant") {
    addSoftBoxMesh(rotation, itemWidth * 0.25, itemWidth * 0.21, itemHeight * 0.22, 0, itemHeight * 0.11, 0, color, {
      segments: 24,
      roughness: 0.82
    });
    addSoftBoxMesh(rotation, itemWidth * 0.22, itemWidth * 0.22, 0.035, 0, itemHeight * 0.22, 0, furnitureDark, {
      segments: 24,
      roughness: 0.96
    });
    const arrayValue = [[new THREE.Vector3(0, itemHeight * 0.21, 0), new THREE.Vector3(-itemWidth * 0.06, itemHeight * 0.58, 0), new THREE.Vector3(-itemWidth * 0.27, itemHeight * 0.78, 0)], [new THREE.Vector3(itemWidth * 0.03, itemHeight * 0.21, 0), new THREE.Vector3(itemWidth * 0.06, itemHeight * 0.64, 0), new THREE.Vector3(itemWidth * 0.12, itemHeight * 0.94, 0)], [new THREE.Vector3(0, itemHeight * 0.28, 0), new THREE.Vector3(itemWidth * 0.18, itemHeight * 0.62, 0), new THREE.Vector3(itemWidth * 0.31, itemHeight * 0.79, 0)]];
    for (const localValue of arrayValue) {
      const castShadow = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(localValue), 20, 0.014, 7, false), new THREE.MeshStandardMaterial({
        color: furnitureDark,
        roughness: 0.86
      }));
      castShadow.castShadow = true;
      rotation.add(castShadow);
    }
    const list = [[-0.27, 0.78, 0], [-0.1, 0.61, 0.02], [0.12, 0.94, 0], [0.31, 0.79, 0], [0.18, 0.63, -0.02], [0.02, 0.46, 0.03]];
    for (const [localValue, localValueCurrent, localValueNext] of list) {
      for (let zeroValue = 0; zeroValue < 5; zeroValue += 1) {
        const value = zeroValue / 5 * Math.PI * 2;
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 6), new THREE.MeshStandardMaterial({
          color: zeroValue % 2 ? 7835779 : 6257261,
          roughness: 0.9
        }));
        mesh.scale.set(itemWidth * 0.045, itemHeight * 0.085, itemDepth * 0.025);
        mesh.position.set(itemWidth * localValue + Math.cos(value) * itemWidth * 0.08, itemHeight * localValueCurrent + Math.sin(value) * itemHeight * 0.035, itemDepth * localValueNext + Math.sin(value) * itemDepth * 0.06);
        mesh.rotation.z = value - Math.PI / 2;
        mesh.rotation.y = value * 0.6;
        mesh.castShadow = true;
        rotation.add(mesh);
      }
    }
  }
  if ((floorScene.has(type.type) || projectDoc.has(type.type)) && type.offlineModelExport !== true) {
    const forEach = [...rotation.children];
    // Stage curtain motion needs procedural curtainPart tags; keep the built-in rig there.
    if (!(isStageEmbed && type.type === "curtain") && attachExternalItemModel(rotation, type)) {
      forEach.forEach(argPrimary => {
        rotation.remove(argPrimary);
        disposeObject3dResources(argPrimary);
      });
    }
  }
  if (type.type === "tv" && type.offlineModelExport !== true) {
    addTvMountMeshes(rotation, type, itemWidth, itemDepth, itemHeight);
  }
  mergeSimilarItemMeshes(rotation, type.type);
  addStripLightHelpers(rotation, type.type);
  countShadowLights(rotation, isSelected("item", type.id));
  return rotation;
}
function instanceMergeIdenticalItems(object3d, argSecondary) {
  object3d.rotation.y = -THREE.MathUtils.degToRad(finite(argSecondary.rotation, 0));
  if (stairItemTypes.has(argSecondary.type)) {
    object3d.scale.x = argSecondary.stairDirection === "left" ? -1 : 1;
  }
  if (argSecondary.type === "shoecabinet" && argSecondary.shoeCabinetMirrored === true) {
    object3d.scale.x = -1;
  }
  if (argSecondary.type === "camera" || argSecondary.type === "presence") {
    object3d.rotation.order = "YXZ";
    object3d.rotation.x = THREE.MathUtils.degToRad(clamp(finite(argSecondary.verticalRotation, 0), -180, 180));
    return;
  }
  if (set.has(argSecondary.type)) {
    if (argSecondary.type === "striplight") {
      object3d.rotation.order = "YXZ";
      object3d.rotation.x = 0;
      object3d.rotation.z = 0;
    } else {
      const x17 = THREE.MathUtils.degToRad(clamp(finite(argSecondary.verticalRotation, 0), -90, 90));
      object3d.rotation.order = "YXZ";
      object3d.rotation.x = x17;
    }
  }
}
function collectShadowLights(updateMatrixWorld) {
  updateMatrixWorld.updateMatrixWorld(true);
  updateMatrixWorld.updateMatrix();
  if (updateMatrixWorld.matrix.determinant() < 0) {
    return null;
  }
  const list = updateMatrixWorld.matrixWorld.clone().invert();
  const push = [];
  let boolTrue = true;
  updateMatrixWorld.traverse(isMesh => {
    if (!boolTrue || !isMesh.isMesh) {
      return;
    }
    const transparent = isMesh.material;
    if (!isMesh.userData.externalModelSharedGeometry || Array.isArray(transparent) || !transparent || transparent.transparent === true || finite(transparent.opacity, 1) < 0.999 || isMesh.isSkinnedMesh || isMesh.morphTargetInfluences) {
      boolTrue = false;
      return;
    }
    const relativeMatrix = new THREE.Matrix4().multiplyMatrices(list, isMesh.matrixWorld);
    const localValue = collectChildMeshes(isMesh);
    if (!localValue) {
      boolTrue = false;
      return;
    }
    push.push({
      mesh: isMesh,
      relativeMatrix,
      signature: JSON.stringify([isMesh.geometry.uuid, localValue, relativeMatrix.elements.map(argPrimary => Math.round(argPrimary * 1000000) / 1000000), isMesh.castShadow, isMesh.receiveShadow, isMesh.renderOrder])
    });
  });
  if (boolTrue && push.length) {
    return push;
  } else {
    return null;
  }
}
function mergeStaticItemInstanceBatches(object3d, argSecondary) {
  const lookupMap = new Map();
  for (const {
    item,
    group: object3d
  } of argSecondary) {
    if (skipInstanceMergeTypes.has(item.type) || isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(item.type) || isSelected("item", item.id)) {
      continue;
    }
    const map = collectShadowLights(object3d);
    if (!map) {
      continue;
    }
    const cacheKey = JSON.stringify([item.type, map.map(signature => signature.signature)]);
    if (!lookupMap.has(cacheKey)) {
      lookupMap.set(cacheKey, []);
    }
    lookupMap.get(cacheKey).push({
      item,
      group: object3d,
      descriptors: map
    });
  }
  object3d.updateMatrixWorld(true);
  const value = object3d.matrixWorld.clone().invert();
  const reduceVar = [];
  for (const list of lookupMap.values()) {
    if (list.length < 2) {
      continue;
    }
    const item = list[0].descriptors.length;
    for (let zeroValue = 0; zeroValue < item; zeroValue += 1) {
      const userData = list[0].descriptors[zeroValue].mesh;
      const conditionalValue = userData.userData.externalModelSharedMaterial ? userData.material : userData.material.clone();
      const userData19 = new THREE.InstancedMesh(userData.geometry, conditionalValue, list.length);
      userData19.name = "ha-bridge-instance-" + list[0].item.type + "-" + (zeroValue + 1);
      userData19.castShadow = userData.castShadow;
      userData19.receiveShadow = userData.receiveShadow;
      userData19.renderOrder = userData.renderOrder;
      userData19.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      userData19.userData.externalModelSharedGeometry = true;
      userData19.userData.externalModelSharedTextures = true;
      userData19.userData.externalModelSharedMaterial = userData.userData.externalModelSharedMaterial === true;
      userData19.userData.modelLayer = "items";
      userData19.userData.exportRole = "plan";
      userData19.userData.instanceItemType = list[0].item.type;
      userData19.userData.instanceItemIds = list.map(({
        item: id
      }) => id.id);
      list.forEach(({
        descriptors: argPrimary
      }, argSecondary) => {
        const localValue = new THREE.Matrix4().multiplyMatrices(value, argPrimary[zeroValue].mesh.matrixWorld);
        userData19.setMatrixAt(argSecondary, localValue);
      });
      userData19.instanceMatrix.needsUpdate = true;
      userData19.computeBoundingBox();
      userData19.computeBoundingSphere();
      object3d.add(userData19);
    }
    for (const {
      group: localValue
    } of list) {
      object3d.remove(localValue);
      disposeObject3dResources(localValue);
    }
    reduceVar.push({
      type: list[0].item.type,
      instances: list.length,
      before: list.length * item,
      after: item
    });
  }
  object3d.userData.instanceBatchStats = reduceVar;
  if (renderer?.domElement) {
    renderer.domElement.dataset.instanceBatchCount = String(reduceVar.length);
    renderer.domElement.dataset.instanceCount = String(reduceVar.reduce((argPrimary, beforeCount) => argPrimary + beforeCount.instances, 0));
    renderer.domElement.dataset.instanceDrawCallsSaved = String(reduceVar.reduce((argPrimary, beforeCount) => argPrimary + beforeCount.before - beforeCount.after, 0));
  }
  return reduceVar;
}
function buildCanvasPathFromPoints(updateMatrixWorld, item) {
  const staticBatchGeometryMap = new Map();
  const helperFn = material => {
    const filterVar = Object.keys(material.geometry.attributes).filter(argPrimary => argPrimary !== "color" || material.material.vertexColors).sort();
    if (!isStageEmbed || Object.values(material.material).some(isTexture => isTexture?.isTexture)) {
      return filterVar;
    } else {
      return filterVar.filter(argPrimary => argPrimary === "position" || argPrimary === "normal" || argPrimary === "color" && material.material.vertexColors);
    }
  };
  updateMatrixWorld.updateMatrixWorld(true);
  for (const {
    item: type,
    group: parent
  } of item) {
    if (parent.parent === updateMatrixWorld && !skipInstanceMergeTypes.has(type.type) && (!isStageEmbed || !["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type.type)) && !isSelected("item", type.id)) {
      parent.traverse(geometry => {
        if (!geometry.isMesh || geometry.isInstancedMesh || geometry.geometry.drawRange.start !== 0 || geometry.geometry.drawRange.count !== Infinity) {
          return;
        }
        for (let parent = geometry; parent && parent !== updateMatrixWorld; parent = parent.parent) {
          if (!parent.visible) {
            return;
          }
        }
        const computedValue = isStageEmbed && !geometry.material?.vertexColors;
        const localValue = createGlassMaterial(geometry, isStageEmbed, computedValue);
        if (!localValue || geometry.matrixWorld.determinant() < 0) {
          return;
        }
        const pushTarget = helperFn(geometry).map(object3d => [object3d, geometry.geometry.attributes[object3d].itemSize]);
        if (computedValue) {
          pushTarget.push(["color", 3]);
        }
        const conditionalValue = isStageEmbed ? JSON.stringify(pushTarget) : meshMaterialSignature(geometry);
        const value = localValue + ":" + conditionalValue + ":" + computedValue;
        if (!staticBatchGeometryMap.has(value)) {
          staticBatchGeometryMap.set(value, []);
        }
        staticBatchGeometryMap.get(value).push(geometry);
      });
    }
  }
  const inverseWorldMatrix = updateMatrixWorld.matrixWorld.clone().invert();
  const staticBatchStats = [];
  const add = new Set();
  for (const length of staticBatchGeometryMap.values()) {
    if (length.length < 2) {
      continue;
    }
    const forEach = length.map(geometry => {
      const localMatrix = new THREE.Matrix4().multiplyMatrices(inverseWorldMatrix, geometry.matrixWorld);
      const attributes = geometry.geometry.clone();
      if (isStageEmbed) {
        const includesVar = helperFn(geometry);
        for (const attrName of Object.keys(attributes.attributes)) {
          if (!includesVar.includes(attrName)) {
            attributes.deleteAttribute(attrName);
          }
        }
        for (const attrName of includesVar) {
          const itemSize = geometry.geometry.attributes[attrName];
          if (!itemSize.isInterleavedBufferAttribute && !itemSize.normalized && itemSize.array instanceof Float32Array) {
            continue;
          }
          const constructedFloat32Array = new Float32Array(itemSize.count * itemSize.itemSize);
          const arrayValue = ["getX", "getY", "getZ", "getW"];
          for (let vertexIndex = 0; vertexIndex < itemSize.count; vertexIndex++) {
            for (let componentIndex = 0; componentIndex < itemSize.itemSize; componentIndex++) {
              constructedFloat32Array[vertexIndex * itemSize.itemSize + componentIndex] = componentIndex < 4 ? itemSize[arrayValue[componentIndex]](vertexIndex) : itemSize.getComponent(vertexIndex, componentIndex);
            }
          }
          attributes.setAttribute(attrName, new THREE.BufferAttribute(constructedFloat32Array, itemSize.itemSize));
        }
        if (!geometry.material.vertexColors) {
          const vertexCount = attributes.attributes.position.count;
          const constructedFloat32Array = new Float32Array(vertexCount * 3);
          const r = geometry.material.color;
          for (let zeroValue = 0; zeroValue < vertexCount; zeroValue++) {
            constructedFloat32Array[zeroValue * 3] = r.r;
            constructedFloat32Array[zeroValue * 3 + 1] = r.g;
            constructedFloat32Array[zeroValue * 3 + 2] = r.b;
          }
          attributes.setAttribute("color", new THREE.BufferAttribute(constructedFloat32Array, 3));
        }
        if (!attributes.index) {
          const vertexCount = attributes.attributes.position.count;
          const conditionalValue = vertexCount <= 65536 ? new Uint16Array(vertexCount) : new Uint32Array(vertexCount);
          for (let zeroValue = 0; zeroValue < vertexCount; zeroValue++) {
            conditionalValue[zeroValue] = zeroValue;
          }
          attributes.setIndex(new THREE.BufferAttribute(conditionalValue, 1));
        }
      }
      return attributes.applyMatrix4(localMatrix);
    });
    const localValue = mergeGeometries(forEach);
    forEach.forEach(dispose => dispose.dispose());
    if (!localValue) {
      continue;
    }
    const material = length[0];
    const computedValue = isStageEmbed && !material.material.vertexColors;
    const color = computedValue ? material.material.clone() : material.material;
    if (computedValue) {
      color.color.setRGB(1, 1, 1);
      color.vertexColors = true;
    }
    const userData = new THREE.Mesh(localValue, color);
    userData.castShadow = material.castShadow;
    userData.receiveShadow = material.receiveShadow;
    userData.renderOrder = material.renderOrder;
    userData.layers.mask = material.layers.mask;
    userData.userData.externalModelSharedTextures = material.userData.externalModelSharedTextures === true;
    userData.userData.externalModelSharedMaterial = !computedValue && material.userData.externalModelSharedMaterial === true;
    userData.userData.reflectionSimplifiable = isStageEmbed;
    userData.userData.modelLayer = "items";
    userData.userData.exportRole = "plan";
    for (const userData of length) {
      userData.parent?.remove(userData);
      if (!userData.userData.externalModelSharedGeometry) {
        userData.geometry.dispose();
      }
      if (!userData.userData.externalModelSharedMaterial) {
        add.add(userData.material);
      }
    }
    updateMatrixWorld.add(userData);
    staticBatchStats.push({
      before: length.length,
      after: 1
    });
  }
  for (const {
    group: parent
  } of item) {
    if (parent.parent === updateMatrixWorld && collectDescendantMeshes(parent).length === 0) {
      updateMatrixWorld.remove(parent);
    }
  }
  const set = new Set();
  updateMatrixWorld.traverse(material => {
    for (const localValue of Array.isArray(material.material) ? material.material : material.material ? [material.material] : []) {
      set.add(localValue);
    }
  });
  for (const dispose of add) {
    if (!set.has(dispose)) {
      dispose.dispose?.();
    }
  }
  updateMatrixWorld.userData.staticItemBatchStats = staticBatchStats;
  if (renderer?.domElement) {
    renderer.domElement.dataset.staticItemBatchCount = String(staticBatchStats.length);
    renderer.domElement.dataset.staticItemDrawCallsSaved = String(staticBatchStats.reduce((argPrimary, before) => argPrimary + before.before - before.after, 0));
  }
  return staticBatchStats;
}
function collectExternalSharedMeshes() {
  const value = new Set();
  worldGroup?.traverse(object3d => {
    if (!object3d.isMesh || !object3d.userData.externalModelSharedGeometry) {
      return;
    }
    const isArrayResult = Array.isArray(object3d.material) ? object3d.material : object3d.material ? [object3d.material] : [];
    for (const flag of isArrayResult) {
      if (flag && !O.has(flag)) {
        value.add(flag);
      }
    }
  });
  return [...value];
}
function syncExternalModelDomStats() {
  if (!renderer?.domElement) {
    return;
  }
  const materials = manager.modelLoadState();
  renderer.domElement.dataset.externalSharedMaterialCount = String(materials.materials);
  renderer.domElement.dataset.externalMaterialReuseCount = String(materials.materialReuses);
  renderer.domElement.dataset.externalPrecompilePassCount = String(cs);
  renderer.domElement.dataset.lightPrecompilePassCount = String(G);
}
function meshInstanceDescriptors(object3d) {
  let value = 0;
  let list = 0;
  let flag = 0;
  let zeroValue = 0;
  for (const isSpotLight of object3d) {
    if (isSpotLight.isSpotLight) {
      value += 1;
    } else if (isSpotLight.isRectAreaLight) {
      list += 1;
    } else if (isSpotLight.isPointLight) {
      flag += 1;
    } else {
      zeroValue += 1;
    }
  }
  return value + ":" + list + ":" + flag + ":" + zeroValue;
}
function collectWorldExternalMeshes() {
  if (!worldGroup) {
    return [];
  }
  const list = [];
  const lookupMap = new Map();
  worldGroup.traverse(object3d => {
    if (!object3d.isLight || !object3d.userData?.lightItemId || !isStageEmbed && finite(object3d.userData.lightOnIntensity, 0) <= 0) {
      return;
    }
    if (object3d.visible !== false) {
      list.push(object3d);
    }
    const flag = String(object3d.userData.lightGroupId || "");
    if (flag) {
      if (!lookupMap.has(flag)) {
        lookupMap.set(flag, []);
      }
      lookupMap.get(flag).push(object3d);
    }
  });
  const idSet = [...lookupMap.values()].flat();
  const set = new Set();
  const listCurrent = [];
  const localValue = meshInstanceDescriptors(list);
  const computedValue = worldGroup.uuid + ":" + cs;
  if (materialTestTypeQuery !== computedValue) {
    materialTestTypeQuery = computedValue;
    instanceTestTypeQuery.clear();
  }
  const helperFn = (argPrimary, filter, flag = false) => {
    const signature = meshInstanceDescriptors(argPrimary);
    if (!set.has(signature)) {
      set.add(signature);
      if (!instanceTestTypeQuery.has(signature)) {
        if (!!flag || signature === localValue || !(instanceTestTypeQuery.size + listCurrent.length >= qg)) {
          listCurrent.push({
            signature: signature,
            lights: filter.filter(visible => visible.visible).map(light => light.light),
            changes: filter
          });
        }
      }
    }
  };
  helperFn(list, [], true);
  helperFn([], idSet.map(light => ({
    light: light,
    visible: false
  })), true);
  for (const listCurrent of lookupMap.values()) {
    const lights = listCurrent.filter(object3d => object3d.visible === false);
    if (lights.length) {
      helperFn([...list, ...lights], lights.map(light => ({
        light: light,
        visible: true
      })));
    }
    const signature = listCurrent.filter(visible => visible.visible !== false);
    if (signature.length) {
      helperFn(list.filter(argPrimary => !signature.includes(argPrimary)), signature.map(light => ({
        light: light,
        visible: false
      })));
    }
  }
  if (isStageEmbed) {
    helperFn(idSet, idSet.map(light => ({
      light: light,
      visible: true
    })), true);
  }
  return listCurrent;
}
const Xm = 4500;
function countLightPrecompileWork(argPrimary, traverse, argTertiary, argN) {
  const value = argPrimary.getContext();
  if (!argN() || value.isContextLost() || argPrimary.extensions?.has("KHR_parallel_shader_compile") === false) {
    return Promise.resolve(false);
  }
  argPrimary.compile(traverse, argTertiary);
  let count = false;
  traverse.traverse?.(material => {
    if ((Array.isArray(material.material) ? material.material : [material.material]).some(transmission => transmission?.transmission > 0)) {
      count = true;
    }
  });
  if (count) {
    const localValue = argPrimary.getRenderTarget();
    const face = argPrimary.getActiveCubeFace();
    const level = argPrimary.getActiveMipmapLevel();
    const dispose = new THREE.WebGLRenderTarget(1, 1);
    try {
      argPrimary.setRenderTarget(dispose);
      argPrimary.compile(traverse, argTertiary);
    } finally {
      argPrimary.setRenderTarget(localValue, face, level);
      dispose.dispose();
    }
  }
  const list = [...argPrimary.info.programs];
  const countCurrent = performance.now() + Xm;
  return new Promise((argPrimaryCurrent, argSecondary) => {
    const helperFn = () => {
      try {
        if (!argN() || argPrimary.getContext() !== value || value.isContextLost()) {
          argPrimaryCurrent(false);
          return;
        }
        const has = new Set(argPrimary.info.programs);
        const helperFn = program => has.has(program) && program.program && value.isProgram(program.program);
        if (list.some(argPrimary => !helperFn(argPrimary))) {
          argPrimaryCurrent(false);
          return;
        }
        if (list.every(isReady => isReady.isReady())) {
          for (const getUniforms of list) {
            if (!helperFn(getUniforms)) {
              argPrimaryCurrent(false);
              return;
            }
            getUniforms.getUniforms();
            if (!helperFn(getUniforms)) {
              argPrimaryCurrent(false);
              return;
            }
            getUniforms.getAttributes();
          }
          argPrimaryCurrent(true);
        } else if (performance.now() >= countCurrent) {
          argPrimaryCurrent(false);
        } else {
          window.setTimeout(helperFn, 32);
        }
      } catch (localValue) {
        argSecondary(localValue);
      }
    };
    window.setTimeout(helperFn, 0);
  });
}
function activeFloorContentBounds() {
  return endBaseLightPanelDrag || document.hidden || isStageEmbed && (!Vo || cache?.closed);
}
function createInvisibleMaterial() {
  return stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isLightPrecompiling || isStageEmbed && (isStageWarmup || isCapturingFrame) || !isStageEmbed && isPreviewQualityReady();
}
function scheduleOrbitInteractionWarmup(numericParam = 360) {
  if (!yt && !isAutoDiagramEmbedCurrent && !endBaseLightPanelDrag) {
    ORBIT_DOLLY_SPEED_SCALE = true;
    window.clearTimeout(endDetailsPanelResize);
    if (!ORBIT_DOLLY_SPEED_MAX && !activeFloorContentBounds()) {
      endDetailsPanelResize = window.setTimeout(async () => {
        endDetailsPanelResize = null;
        if (activeFloorContentBounds()) {
          return;
        }
        const active = manager.modelLoadState();
        if (!renderer || !previewSceneCurrent || !cameraCurrent || !worldGroup || createInvisibleMaterial() || externalModelQueueActive || deferredModelTimerCurrent || active.active > 0 || active.queued > 0) {
          scheduleOrbitInteractionWarmup(240);
          return;
        }
        const length = collectWorldExternalMeshes();
        const uuid = worldGroup;
        const localValue = previewSceneCurrent;
        const domElement = renderer;
        const text = [uuid.uuid, getPreviewFloorModeCurrent(), activeFloorId, cs, ...length.map(signature => signature.signature).sort()].join("|");
        if (!length.length) {
          ORBIT_DOLLY_SPEED_SCALE = false;
          domElement.domElement.dataset.lightPrecompileState = "ready";
          syncExternalModelDomStats();
          return;
        }
        ORBIT_DOLLY_SPEED_MAX = true;
        ORBIT_DOLLY_SPEED_SCALE = false;
        domElement.domElement.dataset.lightPrecompileState = "working";
        domElement.domElement.dataset.lightPrecompilePlanCount = String(length.length);
        const helperFn = () => worldGroup === uuid && previewSceneCurrent === localValue && renderer === domElement && !ORBIT_DOLLY_SPEED_SCALE && !activeFloorContentBounds() && !createInvisibleMaterial();
        let boolTrue = true;
        try {
          for (const changes of length) {
            await yieldToIdle();
            if (!helperFn()) {
              boolTrue = false;
              ORBIT_DOLLY_SPEED_SCALE = true;
              break;
            }
            const localValue = changes.changes.map(({
              light,
              visible: nextVisible
            }) => ({
              light,
              nextVisible,
              visible: light.visible,
              intensity: light.intensity
            }));
            let localValueCurrent = null;
            try {
              for (const light of localValue) {
                light.light.intensity = 0;
                light.light.visible = light.nextVisible;
              }
              syncSpotShadowCastingLights(uuid, {
                rebuildAtlas: false
              });
              localValueCurrent = countLightPrecompileWork(domElement, localValue, cameraCurrent, helperFn);
            } finally {
              for (const light of localValue) {
                light.light.visible = light.visible;
                light.light.intensity = light.intensity;
              }
              syncSpotShadowCastingLights(uuid, {
                rebuildAtlas: false
              });
            }
            if (!(await localValueCurrent) || !helperFn()) {
              boolTrue = false;
              domElement.domElement.dataset.lightPrecompileDeferred = "true";
              ORBIT_DOLLY_SPEED_SCALE ||= !helperFn();
              break;
            }
            G += 1;
            instanceTestTypeQuery.add(changes.signature);
          }
          if (boolTrue) {
            PRECOMPILE_TIMEOUT_MS = text;
            delete domElement.domElement.dataset.lightPrecompileDeferred;
            domElement.domElement.dataset.lightPrecompileState = "ready";
          } else {
            domElement.domElement.dataset.lightPrecompileState = "deferred";
          }
        } catch (error) {
          domElement.domElement.dataset.lightPrecompileState = "fallback";
          console.debug("3D first-light precompile skipped", error);
        } finally {
          ORBIT_DOLLY_SPEED_MAX = false;
          syncExternalModelDomStats();
          if (ORBIT_DOLLY_SPEED_SCALE) {
            scheduleOrbitInteractionWarmup(240);
          }
        }
      }, numericParam);
    }
  }
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && ORBIT_DOLLY_SPEED_SCALE) {
    scheduleOrbitInteractionWarmup();
  }
});
window.addEventListener("pagehide", () => {
  endBaseLightPanelDrag = true;
  window.clearTimeout(endDetailsPanelResize);
}, {
  once: true
});
function scheduleLightPrecompile(numericParam = 0) {
  if (!yt) {
    lightPrecompileRequested = true;
    window.clearTimeout(lightPrecompileTimer);
    if (!isLightPrecompiling) {
      lightPrecompileTimer = window.setTimeout(async () => {
        lightPrecompileTimer = null;
        if (!renderer || !previewSceneCurrent || !cameraCurrent || !worldGroup || stageSession || document.hidden || previewOrbitLocked || isLeavingStudio || isBakingLightCache) {
          scheduleLightPrecompile(240);
          return;
        }
        const active = collectExternalSharedMeshes();
        if (!active.length) {
          lightPrecompileRequested = false;
          syncExternalModelDomStats();
          scheduleOrbitInteractionWarmup();
          return;
        }
        isLightPrecompiling = true;
        lightPrecompileRequested = false;
        renderer.domElement.dataset.externalPrecompileState = "working";
        try {
          syncSpotShadowCastingLights(worldGroup, {
            rebuildAtlas: false
          });
          renderer.compile(previewSceneCurrent, cameraCurrent);
          active.forEach(argPrimary => O.add(argPrimary));
          cs += 1;
          renderer.domElement.dataset.externalPrecompileState = "ready";
        } catch (error) {
          renderer.domElement.dataset.externalPrecompileState = "fallback";
          console.debug("3D model precompile skipped", error);
        } finally {
          isLightPrecompiling = false;
          syncExternalModelDomStats();
          if (lightPrecompileRequested) {
            scheduleLightPrecompile(120);
          } else {
            scheduleOrbitInteractionWarmup();
          }
        }
      }, numericParam);
    }
  }
}
function rebuildPreviewMeshes(rebuildOptions = {}) {
  const comparisonFlag = rebuildOptions.force === true;
  const conditionalValue = ["items", "lights"].includes(rebuildOptions.scope) ? rebuildOptions.scope : "all";
  if (!isLivePreviewEnabled() && !comparisonFlag) {
    if (rebuildOptions.transient !== true) {
      previewNeedsRefresh = true;
    }
    syncLivePreviewButtons();
    return;
  }
  if (comparisonFlag) {
    planZoomAnchor = true;
    pendingRebuildReasons.add("all");
  } else {
    pendingRebuildReasons.add(conditionalValue);
  }
  if (rebuildOptions.precompile === true) {
    orbitAnimSettleTimer = true;
  }
  if (rebuildOptions.preserveLightCache !== true) {
    Ka = true;
  }
  if (!isSceneRebuildQueued) {
    isSceneRebuildQueued = true;
    requestAnimationFrame(() => {
      isSceneRebuildQueued = false;
      if (isLeavingStudio && !planZoomAnchor) {
        return;
      }
      const computedValue = isLivePreviewEnabled() || planZoomAnchor;
      planZoomAnchor = false;
      if (!computedValue) {
        previewNeedsRefresh = true;
        syncLivePreviewButtons();
        return;
      }
      const has = new Set(pendingRebuildReasons);
      pendingRebuildReasons.clear();
      const preserveLightCache = !Ka;
      Ka = false;
      if (getPreviewFloorModeCurrent() === "all" || has.has("all") || !floorSceneCurrent.walls.length) {
        rebuildWorldPreviewCurrent({
          preserveLightCache
        });
      } else {
        if (has.has("items")) {
          rebuildPreviewLightMeshes({
            preserveLightCache
          });
        }
        if (has.has("lights")) {
          rebuildPreviewLightMeshesCurrent({
            preserveLightCache
          });
        }
      }
      const localValue = orbitAnimSettleTimer;
      orbitAnimSettleTimer = false;
      syncExternalModelDomStats();
      if (localValue || collectExternalSharedMeshes().length) {
        scheduleLightPrecompile();
      }
      previewNeedsRefresh = false;
      syncLivePreviewButtons();
    });
  }
}
function getPreviewFloorMode() {
  if (floorSceneCurrent.walls.length) {
    return modelBounds({
      background: null,
      walls: floorSceneCurrent.walls,
      items: []
    });
  } else if (floorSceneCurrent.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorSceneCurrent.items
    });
  } else {
    return modelBounds(floorSceneCurrent);
  }
}
function extrudeWallSegmentShape(wall, wallCurrent, argTertiary, argN, wallNext = {}) {
  const worldPoint = argN(wall.start);
  const point = argN(wall.end);
  const value = point.x - worldPoint.x;
  const wallSegmentDeltaZ = point.z - worldPoint.z;
  const hypot = Math.hypot(value, wallSegmentDeltaZ);
  if (hypot <= 1e-7) {
    return null;
  }
  const planPoint = {
    x: value / hypot,
    y: wallSegmentDeltaZ / hypot
  };
  const options = {
    x: -planPoint.y,
    y: planPoint.x
  };
  const wallHalfThickness = wall.thickness / 2;
  const maxValue = wallCurrent.start <= 0.000001 ? wallCurrent.start - Math.max(Number(wallNext.start) || 0, 0) : wallCurrent.start;
  const maxValueCurrent = wallCurrent.end >= hypot - 0.000001 ? wallCurrent.end + Math.max(Number(wallNext.end) || 0, 0) : wallCurrent.end;
  const planPointCurrent = {
    x: worldPoint.x + planPoint.x * maxValue,
    y: worldPoint.z + planPoint.y * maxValue
  };
  const planPointNext = {
    x: worldPoint.x + planPoint.x * maxValueCurrent,
    y: worldPoint.z + planPoint.y * maxValueCurrent
  };
  return [{
    x: planPointCurrent.x + options.x * wallHalfThickness,
    y: planPointCurrent.y + options.y * wallHalfThickness
  }, {
    x: planPointCurrent.x - options.x * wallHalfThickness,
    y: planPointCurrent.y - options.y * wallHalfThickness
  }, {
    x: planPointNext.x - options.x * wallHalfThickness,
    y: planPointNext.y - options.y * wallHalfThickness
  }, {
    x: planPointNext.x + options.x * wallHalfThickness,
    y: planPointNext.y + options.y * wallHalfThickness
  }];
}
function polygonCentroid(list, argSecondary) {
  const planPoint = new list();
  argSecondary.forEach((worldPoint, argSecondary) => {
    if (argSecondary === 0) {
      planPoint.moveTo(worldPoint.x, worldPoint.y);
    } else {
      planPoint.lineTo(worldPoint.x, worldPoint.y);
    }
  });
  planPoint.closePath();
  return planPoint;
}
function splitFloorPolygonsByHoles(argPrimary) {
  const flag = [];
  const value = [];
  for (const loop of argPrimary) {
    const area = polygonArea(loop);
    if (area > 0) {
      flag.push({
        loop: loop,
        area: area,
        holes: []
      });
    } else if (area < 0) {
      value.push(loop);
    }
  }
  if (!flag.length) {
    for (const localValue of value.splice(0)) {
      const loop = [...localValue].reverse();
      flag.push({
        loop: loop,
        area: Math.abs(polygonArea(loop)),
        holes: []
      });
    }
  }
  for (const localValue of value) {
    const holes = flag.filter(loop => pointInPolygon(localValue[0], loop.loop, 0.000001)).sort((area, areaRight) => area.area - areaRight.area)[0];
    if (holes) {
      holes.holes.push(localValue);
    }
  }
  return flag.map(loop => {
    const holes = polygonCentroid(THREE.Shape, loop.loop);
    for (const localValue of loop.holes) {
      holes.holes.push(polygonCentroid(THREE.Path, localValue));
    }
    return holes;
  });
}
function createGlassPhysicalMaterial(list, argSecondary, depthWrite = {}) {
  const value = argSecondary >= 0.999;
  const alphaWallBand = yt && !value;
  const material = createWallSideMaterial(THREE, {
    color: list,
    roughness: 0.72,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.82,
    transmission: value || alphaWallBand ? 0 : 0.012,
    thickness: 0.1,
    ior: 1.22,
    transparent: !value,
    opacity: argSecondary,
    depthWrite: depthWrite.depthWrite ?? value,
    depthFunc: depthWrite.depthFunc ?? (value ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: depthWrite.polygonOffset === true,
    polygonOffsetFactor: depthWrite.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: depthWrite.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: depthWrite.emissive ?? list,
    emissiveIntensity: depthWrite.emissiveIntensity ?? 0.025
  }, depthWrite.polygonOffset !== true, yt && typeof window < "u" ? new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile : "");
  material.userData.alphaWallBand = alphaWallBand;
  return material;
}
function createInvisibleBasicMaterial() {
  const value = new THREE.MeshBasicMaterial();
  value.visible = false;
  return value;
}
function createFloorStandardMaterial(argPrimary, grid, topColor = {}) {
  const value = grid >= 0.999;
  const floorColor = new THREE.Color(topColor.topColor ?? argPrimary);
  if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("shader") && topColor.polygonOffset !== true) {
    floorColor.multiplyScalar(1.2);
  }
  return new THREE.MeshStandardMaterial({
    color: floorColor,
    roughness: 0.76,
    metalness: 0,
    transparent: !value,
    opacity: topColor.topOpacity ?? (value ? 1 : Math.min(grid * 1.08, 0.42)),
    depthWrite: topColor.depthWrite ?? value,
    depthFunc: topColor.depthFunc ?? (value ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: topColor.polygonOffset === true,
    polygonOffsetFactor: topColor.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: topColor.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: topColor.emissive ?? topColor.topColor ?? argPrimary,
    emissiveIntensity: topColor.emissiveIntensity ? topColor.emissiveIntensity * 0.3 : 0.08
  });
}
function addWallMeshBatch(list, argSecondary, argTertiary, color, opacity, light = {}) {
  if (!list.length || argTertiary - argSecondary <= 0.000001) {
    return;
  }
  const loops = validatedUnionPolygonLoops(list, 0.000001);
  const flag = loops.length > 0;
  const value = splitFloorPolygonsByHoles(flag ? loops : list);
  const depthWrite = !flag && opacity < 0.999 && light.depthWrite === undefined ? {
    ...light,
    depthWrite: true,
    depthFunc: THREE.LessDepth
  } : light;
  for (const entry of value) {
    const extrudeGeometry = new THREE.ExtrudeGeometry(entry, {
      depth: argTertiary - argSecondary,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1
    });
    setWallGradientHeight(THREE, extrudeGeometry, "z", argTertiary, -1, floorSceneCurrent.settings.wallHeight);
    if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("shader") && light.polygonOffset !== true) {
      const wallPoints = entry.extractPoints(1);
      setWallCornerDistances(THREE, extrudeGeometry, [wallPoints.shape, ...wallPoints.holes]);
    }
    const invisibleMaterial = createInvisibleBasicMaterial();
    const glassMaterial = createGlassPhysicalMaterial(color, opacity, depthWrite);
    const mesh = new THREE.Mesh(extrudeGeometry, [invisibleMaterial, glassMaterial]);
    mesh.userData.hbMergeWallBand = light.polygonOffset !== true && (light.renderOrder ?? 4) === 4;
    mesh.userData.reflectionRole = "wall";
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = argTertiary;
    const isWallMaterialOpaque = opacity >= 0.999;
    mesh.castShadow = light.castShadow === true;
    if (light.lightOccluder) {
      mesh.layers.set(HELPER_LAYER);
    }
    mesh.receiveShadow = isWallMaterialOpaque;
    mesh.renderOrder = light.renderOrder ?? 4;
    worldGroup.add(mesh);
  }
}
function addFloorPolygonMeshes(list, argSecondary, flagCurrent, value, depthWrite = {}) {
  if (!list.length) {
    return;
  }
  const loops = validatedUnionPolygonLoops(list, 0.000001);
  const flag = loops.length > 0;
  const splitFloorPolygonsByHolesResult = splitFloorPolygonsByHoles(flag ? loops : list);
  const topColor = !flag && value < 0.999 && depthWrite.depthWrite === undefined ? {
    ...depthWrite,
    depthWrite: true,
    depthFunc: THREE.LessDepth
  } : depthWrite;
  for (const entry of splitFloorPolygonsByHolesResult) {
    const shapeGeometry = new THREE.ShapeGeometry(entry, 1);
    const $0_ = createFloorStandardMaterial(flagCurrent, value, topColor);
    const light = new THREE.Mesh(shapeGeometry, $0_);
    light.rotation.x = Math.PI / 2;
    light.position.y = argSecondary + 0.0005;
    light.castShadow = false;
    light.receiveShadow = false;
    light.renderOrder = depthWrite.renderOrder ?? 4;
    if (isStageEmbed && $0_.transparent) {
      $0_.forceSinglePass = true;
    }
    worldGroup.add(light);
  }
}
function resolvePlanSnap(argPrimary, anchor, argTertiary) {
  const value = [];
  const settings = [];
  for (let zeroValue = 0; zeroValue < argPrimary.length; zeroValue += 1) {
    const x36 = argPrimary[zeroValue];
    const x37 = argPrimary[(zeroValue + 1) % argPrimary.length];
    const computedValue = x37.x - x36.x;
    const computedValueCurrent = x37.z - x36.z;
    const localValue = Math.hypot(computedValue, computedValueCurrent);
    if (localValue <= 0.001) {
      continue;
    }
    const halfValue = (x36.x + x37.x) / 2;
    const halfValueCurrent = (x36.z + x37.z) / 2;
    const atan = -Math.atan2(computedValueCurrent, computedValue);
    const compose = new THREE.Matrix4().compose(new THREE.Vector3(halfValue, argTertiary + 0.021, halfValueCurrent), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), atan), new THREE.Vector3(1, 1, 1));
    const localValueCurrent = new THREE.Matrix4().compose(new THREE.Vector3(halfValue, argTertiary + 0.026, halfValueCurrent), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), atan), new THREE.Vector3(1, 1, 1));
    value.push(new THREE.BoxGeometry(localValue, 0.042, 0.038).applyMatrix4(compose));
    settings.push(new THREE.BoxGeometry(localValue + 0.025, 0.066, 0.078).applyMatrix4(localValueCurrent));
  }
  const conditionalValue = value.length ? mergeGeometries(value) : null;
  const geometries = settings.length ? mergeGeometries(settings) : null;
  value.forEach(dispose => dispose.dispose());
  settings.forEach(dispose => dispose.dispose());
  if (conditionalValue) {
    const userData = new THREE.Mesh(conditionalValue, new THREE.MeshBasicMaterial({
      color: anchor,
      transparent: true,
      opacity: 0.82,
      toneMapped: false
    }));
    userData.renderOrder = 3;
    userData.userData.exportRole = "outline";
    userData.userData.batchedFloorEdgeCount = argPrimary.length;
    worldGroup.add(userData);
  }
  if (geometries) {
    const userData = new THREE.Mesh(geometries, new THREE.MeshBasicMaterial({
      color: anchor,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    }));
    userData.renderOrder = 2;
    userData.userData.exportRole = "outline";
    userData.userData.batchedFloorEdgeCount = argPrimary.length;
    worldGroup.add(userData);
  }
}
function splitFloorPolygonsByHolesCurrent(argPrimary, argSecondary, argTertiary) {
  if (!Array.isArray(argPrimary) || argPrimary.length < 3) {
    return;
  }
  const list = argPrimary.map(planPoint => ({
    x: planPoint.x,
    y: planPoint.z
  }));
  const localValue = list.map((argPrimary, argSecondary) => distance(argPrimary, list[(argSecondary + 1) % list.length]));
  const push = [0];
  for (const loop of localValue) {
    push.push(push.at(-1) + loop);
  }
  const helperFn = ({
    distance: argPrimary,
    innerAlpha: argPrimaryCurrent,
    outerAlpha: argPrimaryNext,
    columnStrength: localValue,
    y: argPrimaryPrevious,
    renderOrder
  }) => {
    const meshes = addCeilingMeshes(list, argPrimary);
    const pushCurrent = [];
    const pushNext = [];
    const pushPrevious = [];
    const pushLocal = [];
    for (let zeroValue = 0; zeroValue < list.length; zeroValue += 1) {
      const computedValue = (zeroValue + 1) % list.length;
      const x10 = list[zeroValue];
      const x11 = list[computedValue];
      const x12 = meshes[zeroValue];
      const x13 = meshes[computedValue];
      pushCurrent.push(x10.x, argPrimaryPrevious, x10.y, x12.x, argPrimaryPrevious, x12.y, x13.x, argPrimaryPrevious, x13.y, x10.x, argPrimaryPrevious, x10.y, x13.x, argPrimaryPrevious, x13.y, x11.x, argPrimaryPrevious, x11.y);
      pushNext.push(argPrimaryCurrent, argPrimaryNext, argPrimaryNext, argPrimaryCurrent, argPrimaryNext, argPrimaryCurrent);
      pushPrevious.push(0, 1, 1, 0, 1, 0);
      const localValue = push[zeroValue];
      const localValueCurrent = push[zeroValue + 1];
      pushLocal.push(localValue, localValue, localValueCurrent, localValue, localValueCurrent, localValueCurrent);
    }
    const glowLineGeometry = new THREE.BufferGeometry();
    glowLineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pushCurrent, 3));
    glowLineGeometry.setAttribute("glowAlpha", new THREE.Float32BufferAttribute(pushNext, 1));
    glowLineGeometry.setAttribute("glowAcross", new THREE.Float32BufferAttribute(pushPrevious, 1));
    glowLineGeometry.setAttribute("glowAlong", new THREE.Float32BufferAttribute(pushLocal, 1));
    glowLineGeometry.computeVertexNormals();
    const mesh = new THREE.Mesh(glowLineGeometry, new THREE.ShaderMaterial({
      uniforms: {
        glowColor: {
          value: new THREE.Color(argSecondary)
        },
        glowColumnStrength: {
          value: localValue
        }
      },
      vertexShader: "\n          attribute float glowAlpha;\n          attribute float glowAcross;\n          attribute float glowAlong;\n          varying float vGlowAlpha;\n          varying float vGlowAcross;\n          varying float vGlowAlong;\n          void main() {\n            vGlowAlpha = glowAlpha;\n            vGlowAcross = glowAcross;\n            vGlowAlong = glowAlong;\n            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n          }\n        ",
      fragmentShader: "\n          uniform vec3 glowColor;\n          uniform float glowColumnStrength;\n          varying float vGlowAlpha;\n          varying float vGlowAcross;\n          varying float vGlowAlong;\n          void main() {\n            float columnA = 0.5 + 0.5 * sin(vGlowAlong * 4.7 + 0.6);\n            float columnB = 0.5 + 0.5 * sin(vGlowAlong * 9.3 + 2.1);\n            float broadColumns = clamp(0.46 + columnA * 0.34 + columnB * 0.2, 0.0, 1.0);\n            float distanceMix = smoothstep(0.16, 0.88, vGlowAcross);\n            float reflection = mix(1.0, 0.48 + broadColumns * 0.52, glowColumnStrength * distanceMix);\n            gl_FragColor = vec4(glowColor, vGlowAlpha * reflection);\n          }\n        ",
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      side: THREE.DoubleSide
    }));
    mesh.renderOrder = renderOrder;
    worldGroup.add(mesh);
  };
  helperFn({
    distance: 0.24,
    innerAlpha: 0.4,
    outerAlpha: 0.055,
    columnStrength: 0,
    y: argTertiary + 0.008,
    renderOrder: 3
  });
  helperFn({
    distance: 1.25,
    innerAlpha: 0.3,
    outerAlpha: 0.008,
    columnStrength: 0.82,
    y: argTertiary + 0.005,
    renderOrder: 2
  });
}
function addCeilingMeshes(list, argSecondary) {
  const point = list.reduce((item, argSecondary) => ({
    x: item.x + argSecondary.x / list.length,
    y: item.y + argSecondary.y / list.length
  }), {
    x: 0,
    y: 0
  });
  return list.map(item => {
    const computedValue = item.x - point.x;
    const value = item.y - point.y;
    const localValue = Math.max(Math.hypot(computedValue, value), 0.000001);
    return {
      x: item.x + computedValue / localValue * argSecondary,
      y: item.y + value / localValue * argSecondary
    };
  });
}
function addCeilingMeshesFromPolygons(list, argSecondary) {
  if (!list.length) {
    return;
  }
  const mapped = list.map(worldPoint => {
    const localValue = addCeilingMeshes(worldPoint, 0.028);
    const conditionalValue = polygonArea(localValue) >= 0 ? localValue : [...localValue].reverse();
    return polygonCentroid(THREE.Shape, conditionalValue);
  });
  const forEach = mapped.map(argPrimary => {
    const rotateX = new THREE.ShapeGeometry(argPrimary, 1);
    rotateX.rotateX(Math.PI / 2);
    rotateX.translate(0, argSecondary, 0);
    return rotateX;
  });
  const localValue = mergeGeometries(forEach);
  forEach.forEach(spread => spread.dispose());
  if (!localValue) {
    return;
  }
  const renderOrder = new THREE.Mesh(localValue, new THREE.MeshBasicMaterial({
    color: 527122,
    transparent: true,
    opacity: 0.052,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -4,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  renderOrder.renderOrder = 1;
  renderOrder.userData.batchedWallContactShadowCount = mapped.length;
  worldGroup.add(renderOrder);
}
function createGroundGridHelper(argPrimary, grid, argTertiary) {
  const ppm = Math.max(Math.round(argPrimary / 1.25), 12);
  const material = new THREE.GridHelper(argPrimary, ppm, grid.grid, grid.grid);
  const bounds = new THREE.Vector3();
  material.material.transparent = true;
  material.material.opacity = 0.24;
  material.material.depthWrite = false;
  material.material.toneMapped = false;
  material.material.onBeforeCompile = uniforms => {
    uniforms.uniforms.gridFadeNear = {
      value: argPrimary * 0.18
    };
    uniforms.uniforms.gridFadeFar = {
      value: argPrimary * 0.46
    };
    uniforms.uniforms.gridDepthFadeNear = {
      value: argPrimary * 0.18
    };
    uniforms.uniforms.gridDepthFadeFar = {
      value: argPrimary * 0.36
    };
    uniforms.vertexShader = uniforms.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;").replace("#include <project_vertex>", "#include <project_vertex>\nvGridLocalPosition = position.xz;\nvGridViewDepth = max(-mvPosition.z, 0.0);");
    uniforms.fragmentShader = uniforms.fragmentShader.replace("#include <common>", "#include <common>\nuniform float gridFadeNear;\nuniform float gridFadeFar;\nuniform float gridDepthFadeNear;\nuniform float gridDepthFadeFar;\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;").replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse, opacity );\nfloat radialFade = 1.0 - smoothstep(gridFadeNear, gridFadeFar, length(vGridLocalPosition));\nfloat depthFade = 1.0 - smoothstep(gridDepthFadeNear, gridDepthFadeFar, vGridViewDepth);\ndiffuseColor.a *= radialFade * mix(0.28, 1.0, depthFade);");
    material.material.userData.depthFadeShader = uniforms;
  };
  material.onBeforeRender = (argPrimary, argSecondary, position) => {
    const uniforms = material.material.userData.depthFadeShader;
    if (!uniforms) {
      return;
    }
    material.getWorldPosition(bounds);
    const localValue = Math.max(position.position.distanceTo(orbitControls?.target || bounds), 1);
    const conditionalValue = position.isOrthographicCamera ? Math.abs(position.top - position.bottom) / Math.max(position.zoom, 0.001) : localValue * 2 * Math.tan(THREE.MathUtils.degToRad(position.fov * 0.5));
    const max = Math.max(Math.hypot(conditionalValue * Math.max(position.aspect, 0.1), conditionalValue), 2);
    const element = localValue + max * 0.2;
    uniforms.uniforms.gridDepthFadeNear.value = element;
    uniforms.uniforms.gridDepthFadeFar.value = Math.max(element + 1, localValue + max * 0.85);
  };
  material.position.y = argTertiary + 0.012;
  material.renderOrder = 2;
  material.userData.exportRole = "grid";
  worldGroup.add(material);
}
function setPreviewFloorMode(argPrimary, argSecondary, length = []) {
  if (!Array.isArray(argPrimary) || argPrimary.length < 3) {
    return;
  }
  const localValue = argPrimary.map(polygon => ({
    x: polygon.x,
    y: polygon.z
  }));
  [{
    spread: 0.035,
    offsetX: 0.13,
    offsetY: -0.1,
    opacity: 0.12
  }, {
    spread: 0.13,
    offsetX: 0.18,
    offsetY: -0.14,
    opacity: 0.055
  }, {
    spread: 0.3,
    offsetX: 0.24,
    offsetY: -0.19,
    opacity: 0.018
  }].forEach((spread, item) => {
    const mapped = addCeilingMeshes(localValue, spread.spread).map(door => ({
      x: door.x + spread.offsetX,
      y: door.y + spread.offsetY
    }));
    const conditionalValue = length.length ? splitFloorPolygonsByHoles(subtractPolygonLoops([mapped], length)) : polygonCentroid(THREE.Shape, mapped);
    const rotation = new THREE.Mesh(new THREE.ShapeGeometry(conditionalValue, 1), new THREE.MeshBasicMaterial({
      color: 329482,
      transparent: true,
      opacity: spread.opacity,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      forceSinglePass: isStageEmbed
    }));
    rotation.rotation.x = Math.PI / 2;
    rotation.position.y = argSecondary + 0.001 + item * 0.00015;
    rotation.userData.floorPlanGroundShadow = true;
    rotation.renderOrder = 1 + item;
    worldGroup.add(rotation);
  });
}
function rebuildWorldPreview({
  preserveLightCache = false
} = {}) {
  renderCache?.invalidate();
  if (yt && worldGroup) {
    worldGroup.userData.regionFloorId = activeFloorId;
  }
  if (!worldGroup) {
    return;
  }
  applyPreviewEnvironment();
  clearWorldGroupChildren();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache
  });
  const group = pixelsPerMeter();
  if (!group) {
    return;
  }
  const value = resolvedThemeColors();
  const previewFloorWorldBounds = getPreviewFloorMode();
  const previewFloorCenterX = Lo?.x ?? (previewFloorWorldBounds.minX + previewFloorWorldBounds.maxX) / 2;
  const item = Lo?.y ?? (previewFloorWorldBounds.minY + previewFloorWorldBounds.maxY) / 2;
  const toPreviewLocalWallPoint = wall => ({
    x: (wall.x - previewFloorCenterX) / group,
    z: (wall.y - item) / group
  });
  const localValue = Math.max(previewFloorWorldBounds.width / group + 1, 3);
  const max = Math.max(previewFloorWorldBounds.height / group + 1, 3);
  const localValueCurrent = -0.008;
  const depth = 0.16;
  const computedValue = localValueCurrent - depth;
  const computedValueCurrent = computedValue - 0.035;
  const localValueNext = Math.max(Math.max(localValue, max) * 16, 260);
  const backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(localValueNext, localValueNext), new THREE.MeshBasicMaterial({
    color: value.ground,
    toneMapped: false
  }));
  backgroundPlane.rotation.x = -Math.PI / 2;
  backgroundPlane.position.y = computedValueCurrent;
  backgroundPlane.receiveShadow = false;
  backgroundPlane.userData.exportRole = "background";
  worldGroup.add(backgroundPlane);
  createGroundGridHelper(localValueNext, value, computedValueCurrent);
  const dispose = new THREE.MeshStandardMaterial({
    color: value.floor,
    roughness: 0.96,
    metalness: 0,
    emissive: value.floor,
    emissiveIntensity: 0.025
  });
  const length = getFloorPolygons(group);
  const mapped = floorSceneCurrent.items.filter(type => type.type === "flooropening").map(argPrimary => floorOpeningPolygon(argPrimary, group).map(argPrimary => {
    const x14 = toPreviewLocalWallPoint(argPrimary);
    return {
      x: x14.x,
      y: x14.z
    };
  }));
  const helperFn = argPrimary => {
    setPreviewFloorMode(argPrimary, computedValueCurrent);
    if (floorSceneCurrent.settings.floorEdgeVisible !== false) {
      resolvePlanSnap(argPrimary, value.floorEdge, computedValue);
    }
  };
  const callback = (argPrimary, argSecondary, argTertiary) => {
    const userData = new THREE.Mesh(argSecondary, dispose);
    userData.rotation.x = argTertiary ? Math.PI / 2 : 0;
    userData.position.y = argTertiary ? localValueCurrent : localValueCurrent - depth / 2;
    userData.castShadow = false;
    userData.receiveShadow = true;
    userData.userData.exportRole = "plan";
    userData.userData.regionReceiverKind = "floor";
    userData.userData.regionFloorId = activeFloorId;
    worldGroup.add(userData);
    if (!mapped.length) {
      helperFn(argPrimary);
    }
  };
  if (mapped.length) {
    const conditionalValue = length.length ? length.map(footprint => footprint.map(argPrimary => {
      const x2 = toPreviewLocalWallPoint(argPrimary);
      return {
        x: x2.x,
        y: x2.z
      };
    })) : [[{
      x: -localValue / 2,
      y: -max / 2
    }, {
      x: localValue / 2,
      y: -max / 2
    }, {
      x: localValue / 2,
      y: max / 2
    }, {
      x: -localValue / 2,
      y: max / 2
    }]];
    const filter = subtractPolygonLoops(conditionalValue, mapped);
    const holes = splitFloorPolygonsByHoles(filter);
    if (holes.length) {
      callback([], new THREE.ExtrudeGeometry(holes, {
        depth,
        bevelEnabled: false,
        steps: 1
      }), true);
    } else {
      dispose.dispose();
    }
    for (const map of filter.filter(argPrimary => polygonArea(argPrimary) > 0)) {
      const localValue = map.map(footprint => ({
        x: footprint.x,
        z: footprint.y
      }));
      setPreviewFloorMode(localValue, computedValueCurrent, mapped);
      if (floorSceneCurrent.settings.floorEdgeVisible !== false) {
        resolvePlanSnap(localValue, value.floorEdge, computedValue);
      }
    }
  } else if (length.length) {
    const map = length.map(map => map.map(toPreviewLocalWallPoint));
    const localValue = map.map(forEachItem => {
      const moveTo = new THREE.Shape();
      forEachItem.forEach((floor, argSecondary) => {
        if (argSecondary === 0) {
          moveTo.moveTo(floor.x, floor.z);
        } else {
          moveTo.lineTo(floor.x, floor.z);
        }
      });
      moveTo.closePath();
      return moveTo;
    });
    callback(map[0], new THREE.ExtrudeGeometry(localValue, {
      depth,
      bevelEnabled: false,
      steps: 1
    }), true);
    for (const localValue of map.slice(1)) {
      helperFn(localValue);
    }
  } else {
    const arrayValue = [{
      x: -localValue / 2,
      z: -max / 2
    }, {
      x: localValue / 2,
      z: -max / 2
    }, {
      x: localValue / 2,
      z: max / 2
    }, {
      x: -localValue / 2,
      z: max / 2
    }];
    callback(arrayValue, new THREE.BoxGeometry(localValue, depth, max), false);
  }
  const arrayValue = [...floorSceneCurrent.windows, ...floorSceneCurrent.doors.map(argPrimary => ({
    ...argPrimary,
    sill: 0
  })), ...floorSceneCurrent.railings.map(wallId => {
    const height = floorSceneCurrent.walls.find(item => item.id === wallId.wallId);
    return {
      ...wallId,
      sill: 0,
      height: height?.height || floorSceneCurrent.settings.wallHeight
    };
  })];
  const filter = [];
  const has = new Set();
  const extensions = getWallJoinExtensions(group);
  for (const opacity of floorSceneCurrent.walls) {
    const toFixed = opacity.opacity === null || opacity.opacity === undefined ? floorSceneCurrent.settings.wallOpacity : clamp(finite(opacity.opacity, floorSceneCurrent.settings.wallOpacity), 0, 1);
    for (const bottom of wallSolidPieces(opacity, arrayValue, group, opacity.height)) {
      const footprint = extrudeWallSegmentShape(opacity, bottom, group, toPreviewLocalWallPoint, extensions[opacity.id]);
      if (!footprint) {
        continue;
      }
      const localValue = [canonicalPolygonKey(footprint, 4), bottom.bottom.toFixed(5), bottom.top.toFixed(5), toFixed.toFixed(4)].join("|");
      if (!has.has(localValue)) {
        has.add(localValue);
        filter.push({
          wallId: opacity.id,
          footprint: footprint,
          bottom: bottom.bottom,
          top: bottom.top,
          opacity: toFixed
        });
      }
    }
  }
  const sorted = [...new Set(filter.flatMap(bottom => [bottom.bottom, bottom.top]).map(toFixed => toFixed.toFixed(6)))].map(Number).sort((argPrimary, argSecondary) => argPrimary - argSecondary);
  addCeilingMeshesFromPolygons(filter.filter(bottom => bottom.bottom <= 0.000001).map(footprint => footprint.footprint), localValueCurrent + 0.0025);
  for (let zeroValue = 0; zeroValue < sorted.length - 1; zeroValue += 1) {
    const localValue = sorted[zeroValue];
    const localValueCurrent = sorted[zeroValue + 1];
    if (localValueCurrent - localValue <= 0.000001) {
      continue;
    }
    const halfValue = (localValue + localValueCurrent) / 2;
    const list = filter.filter(bottom => halfValue > bottom.bottom - 0.000001 && halfValue < bottom.top + 0.000001);
    const has = new Map();
    for (const opacity of list) {
      const localValue = opacity.opacity.toFixed(4);
      if (!has.has(localValue)) {
        has.set(localValue, {
          opacity: opacity.opacity,
          volumes: []
        });
      }
      has.get(localValue).volumes.push(opacity);
    }
    for (const volumes of has.values()) {
      addWallMeshBatch(volumes.volumes.map(footprint => footprint.footprint), localValue, localValueCurrent, value.wall, volumes.opacity, {
        castShadow: true,
        lightOccluder: true
      });
      const mapped = volumes.volumes.filter(item => Math.abs(item.top - localValueCurrent) <= 0.000001).map(footprint => footprint.footprint);
      addFloorPolygonMeshes(mapped, localValueCurrent, value.wall, volumes.opacity, {
        topColor: value.wall
      });
    }
    const length = list.filter(wallId => isSelected("wall", wallId.wallId)).map(footprint => footprint.footprint);
    if (length.length) {
      addWallMeshBatch(length, localValue, localValueCurrent, value.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value.accent,
        emissiveIntensity: 0.12,
        renderOrder: 5
      });
      const mapped = list.filter(wallId => isSelected("wall", wallId.wallId) && Math.abs(wallId.top - localValueCurrent) <= 0.000001).map(footprint => footprint.footprint);
      addFloorPolygonMeshes(mapped, localValueCurrent, value.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value.accent,
        emissiveIntensity: 0.12,
        topOpacity: 0.12,
        renderOrder: 6
      });
    }
  }
  for (const start of floorSceneCurrent.walls) {
    const computedValue = start.end.x - start.start.x;
    const computedValueCurrent = start.end.y - start.start.y;
    const localValue = Math.hypot(computedValue, computedValueCurrent);
    if (!localValue) {
      continue;
    }
    const objectValue = {
      x: computedValue / localValue,
      y: computedValueCurrent / localValue
    };
    const y3 = -Math.atan2(computedValueCurrent, computedValue);
    for (const sill of floorSceneCurrent.windows.filter(wallId => wallId.wallId === start.id)) {
      const localValue = clampWindowT(start, sill, group);
      const objectValue = {
        x: start.start.x + computedValue * localValue,
        y: start.start.y + computedValueCurrent * localValue
      };
      const x21 = toPreviewLocalWallPoint(objectValue);
      const position = new THREE.Group();
      position.position.set(x21.x, 0, x21.z);
      position.rotation.y = y3;
      const min = Math.min(sill.width, wallLengthMeters(start, group));
      const localValueCurrent = Math.min(sill.height, Math.max(start.height - sill.sill, 0.2));
      const windowParts = windowGeometryParts(min, localValueCurrent, sill.sill, sill.hasDivider !== false);
      if (!windowParts) {
        continue;
      }
      addSharedArchMesh(position, windowParts.glass, value.glass, {
        rounded: false,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        side: THREE.DoubleSide,
        roughness: 0.08,
        metalness: 0.04,
        castShadow: false,
        renderOrder: 6
      });
      const conditionalValue = isSelected("window", sill.id) ? value.accent : value.frame;
      const options = {
        rounded: false,
        metalness: 0.15,
        castShadow: false,
        receiveShadow: false
      };
      addSharedArchMesh(position, windowParts.frames, conditionalValue, options);
      position.userData.optimizationStats = {
        type: windowParts.divided ? "window-divided" : "window-plain",
        before: windowParts.divided ? 6 : 5,
        after: 2
      };
      worldGroup.add(position);
    }
    for (const width of floorSceneCurrent.railings.filter(wallId => wallId.wallId === start.id)) {
      const localValue = clampWindowT(start, width, group);
      const objectValue = {
        x: start.start.x + computedValue * localValue,
        y: start.start.y + computedValueCurrent * localValue
      };
      const x22 = toPreviewLocalWallPoint(objectValue);
      const position = new THREE.Group();
      position.position.set(x22.x, 0, x22.z);
      position.rotation.y = y3;
      const min = Math.min(width.width, wallLengthMeters(start, group));
      const localValueCurrent = Math.min(width.height, start.height);
      const conditionalValue = isSelected("railing", width.id) ? value.accent : value.frame;
      const localValueNext = Math.min(Math.max(min * 0.012, 0.028), 0.05);
      const numericValue = 0.08;
      const max = Math.max(localValueCurrent - numericValue - localValueNext * 1.4, 0.2);
      addSharedArchMesh(position, [[Math.max(min - localValueNext * 2.4, 0.2), max, 0.018, 0, numericValue + max * 0.5, 0]], value.glass, {
        rounded: false,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
        metalness: 0.04,
        roughness: 0.08,
        castShadow: false,
        receiveShadow: false,
        renderOrder: 6
      });
      const options = {
        rounded: false,
        metalness: 0.58,
        roughness: 0.24,
        castShadow: false,
        receiveShadow: false
      };
      const localValuePrevious = Math.max(2, Math.min(16, Math.ceil(min / 1.5) + 1));
      const push = [[min, localValueNext, 0.055, 0, localValueCurrent, 0]];
      const list = [];
      for (let zeroValue = 0; zeroValue < localValuePrevious; zeroValue += 1) {
        const halfValue = -min / 2 + min * zeroValue / (localValuePrevious - 1);
        push.push([localValueNext, localValueCurrent, 0.055, halfValue, localValueCurrent * 0.5, 0]);
        list.push([localValueNext * 2, localValueNext * 0.8, 0.08, halfValue, localValueNext * 0.4, 0]);
      }
      addSharedArchMesh(position, push, conditionalValue, options);
      addSharedArchMesh(position, list, value.furnitureSoft, options);
      position.userData.optimizationStats = {
        type: "glass-railing",
        before: 2 + localValuePrevious * 2,
        after: 3
      };
      worldGroup.add(position);
    }
    for (const swing of floorSceneCurrent.doors.filter(wallId => wallId.wallId === start.id)) {
      const localValue = clampWindowT(start, swing, group);
      const objectValue = {
        x: start.start.x + computedValue * localValue,
        y: start.start.y + computedValueCurrent * localValue
      };
      const x23 = toPreviewLocalWallPoint(objectValue);
      const userData = new THREE.Group();
      userData.position.set(x23.x, 0, x23.z);
      userData.rotation.y = y3;
      const min = Math.min(swing.width, wallLengthMeters(start, group));
      const localValueCurrent = Math.min(swing.height, start.height);
      const selected = isSelected("door", swing.id);
      const doorType = swing.doorType || "solid";
      const conditionalValue = selected ? value.accent : value.frame;
      const numericValue = 0.065;
      const options = {
        rounded: false,
        metalness: 0.08,
        castShadow: false,
        receiveShadow: false
      };
      const push = [[numericValue, localValueCurrent, 0.09, -min / 2, localValueCurrent / 2, 0], [numericValue, localValueCurrent, 0.09, min / 2, localValueCurrent / 2, 0], [min + numericValue, numericValue, 0.09, 0, localValueCurrent, 0]];
      if (doorType === "roller-shutter") {
        const conditionalValue = swing.swing === -1 ? -1 : 1;
        push.push([min + numericValue * 0.6, numericValue * 1.8, 0.13, 0, localValueCurrent - numericValue * 0.35, conditionalValue * 0.04]);
      }
      addSharedArchMesh(userData, push, conditionalValue, options);
      if (doorType === "frame-only") {
        userData.userData.optimizationStats = {
          type: "door-frame-only",
          before: 3,
          after: 1
        };
        worldGroup.add(userData);
        continue;
      }
      if (doorType === "sliding-glass") {
        const height = Math.max(localValueCurrent - numericValue * 0.85, 0.4);
        const width = Math.max(min * 0.54, 0.28);
        const count = swing.hinge === "right" ? 1 : -1;
        const moving = slidingDoorPanelCenters(min, count);
        stairRiserMaterialOptions(userData, [{
          width,
          height: height,
          centerX: moving.fixed,
          centerZ: -0.024
        }, {
          width,
          height: height,
          centerX: moving.moving,
          centerZ: 0.024
        }], conditionalValue, value.glass);
        const scaledWidth = moving.moving - count * width * 0.36;
        addSharedArchMesh(userData, [[0.026, 0.15, 0.055, scaledWidth, localValueCurrent * 0.52, -0.052], [0.026, 0.15, 0.055, scaledWidth, localValueCurrent * 0.52, 0.052]], value.furnitureDark, {
          rounded: false,
          metalness: 0.5,
          castShadow: false,
          receiveShadow: false
        });
        userData.userData.optimizationStats = {
          type: "door-sliding-glass",
          before: 15,
          after: 5
        };
        worldGroup.add(userData);
        continue;
      }
      if (doorType === "roller-shutter") {
        const localValue = Math.max(min - numericValue * 1.3, 0.4);
        const max = Math.max(localValueCurrent - numericValue * 0.85, 0.8);
        const conditionalValue = swing.swing === -1 ? -1 : 1;
        addSharedArchMesh(userData, [[localValue, max, 0.045, 0, max * 0.5, conditionalValue * 0.04]], selected ? value.accent : value.furnitureSoft, {
          rounded: false,
          metalness: 0.36,
          roughness: 0.42,
          castShadow: false,
          receiveShadow: false
        });
        const localValueNext = Math.max(5, Math.min(36, Math.round(max / 0.12)));
        const push = [];
        for (let oneValue = 1; oneValue < localValueNext; oneValue += 1) {
          const computedValue = max * oneValue / localValueNext;
          push.push([localValue * 0.98, 0.012, 0.052, 0, computedValue, conditionalValue * 0.052]);
        }
        addSharedArchMesh(userData, push, value.furnitureDark, {
          rounded: false,
          metalness: 0.42,
          roughness: 0.34,
          castShadow: false,
          receiveShadow: false
        });
        userData.userData.optimizationStats = {
          type: "door-roller-shutter",
          before: 5 + localValueNext,
          after: 3
        };
        worldGroup.add(userData);
        continue;
      }
      if (doorType === "entry") {
        const localValue = Math.max(min - numericValue * 1.5, 0.4);
        const max = Math.max(localValueCurrent - numericValue * 0.85, 0.8);
        const conditionalValue = selected ? value.accent : value.furnitureDark;
        addSharedArchMesh(userData, [[localValue, max, 0.065, 0, max * 0.5, 0]], conditionalValue, {
          rounded: false,
          roughness: 0.58,
          metalness: 0.1,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData, [[localValue * 0.76, 0.022, 0.078, 0, localValueCurrent * 0.68, 0.012], [localValue * 0.76, 0.022, 0.078, 0, localValueCurrent * 0.34, 0.012]], value.furnitureSoft, {
          rounded: false,
          roughness: 0.5,
          castShadow: false,
          receiveShadow: false
        });
        const conditionalValueCurrent = swing.hinge === "right" ? -localValue * 0.34 : localValue * 0.34;
        addSharedArchMesh(userData, [[0.035, 0.18, 0.085, conditionalValueCurrent, localValueCurrent * 0.5, 0.055]], value.furnitureLight, {
          rounded: false,
          metalness: 0.58,
          roughness: 0.24,
          castShadow: false,
          receiveShadow: false
        });
        userData.userData.optimizationStats = {
          type: "door-entry",
          before: 7,
          after: 4
        };
        worldGroup.add(userData);
        continue;
      }
      if (doorType === "double") {
        const width = Math.max((min - numericValue * 1.8) / 2, 0.25);
        const height = Math.max(localValueCurrent - numericValue * 0.8, 0.4);
        const comparisonFlag = (swing.swing === -1 ? 1 : -1) * Math.PI * 0.42;
        const push = [];
        const list = [];
        for (const localValue of [-1, 1]) {
          const halfValue = localValue * (min / 2 - numericValue * 0.5);
          const rotationY = localValue < 0 ? comparisonFlag : -comparisonFlag;
          const conditionalValue = localValue < 0 ? width / 2 : -width / 2;
          const x5 = {
            x: halfValue + conditionalValue * Math.cos(rotationY),
            z: -conditionalValue * Math.sin(rotationY)
          };
          push.push({
            width: width,
            height: height,
            depth: 0.04,
            x: x5.x,
            y: height / 2,
            z: x5.z,
            rotationY
          });
          const value = localValue < 0 ? width * 0.42 : -width * 0.42;
          list.push({
            width: 0.035,
            height: 0.055,
            depth: 0.065,
            x: halfValue + value * Math.cos(rotationY) + Math.sin(rotationY) * 0.04,
            y: localValueCurrent * 0.5,
            z: -value * Math.sin(rotationY) + Math.cos(rotationY) * 0.04,
            rotationY
          });
        }
        addSharedArchMesh(userData, push, selected ? value.accent : value.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData, list, value.furnitureDark, {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false
        });
        userData.userData.optimizationStats = {
          type: "door-double",
          before: 7,
          after: 3
        };
        worldGroup.add(userData);
        continue;
      }
      const hingeSign = swing.hinge === "right";
      const width = Math.max(min - numericValue * 1.4, 0.2);
      const height = Math.max(localValueCurrent - numericValue * 0.8, 0.4);
      const position = new THREE.Group();
      position.position.x = hingeSign ? min / 2 - numericValue * 0.5 : -min / 2 + numericValue * 0.5;
      position.rotation.y = doorLeafRotation(swing, Math.PI * 0.42);
      userData.add(position);
      const centerX = hingeSign ? -width / 2 : width / 2;
      if (doorType === "glass") {
        stairRiserMaterialOptions(position, [{
          width: width,
          height: height,
          centerX,
          centerZ: 0
        }], conditionalValue, value.glass);
      } else {
        addSharedArchMesh(position, [[width, height, 0.04, centerX, height / 2, 0]], selected ? value.accent : value.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false
        });
      }
      const conditionalValueCurrent = hingeSign ? -width * 0.42 : width * 0.42;
      addSharedArchMesh(position, [[0.035, 0.055, 0.065, conditionalValueCurrent, localValueCurrent * 0.5, 0.04]], value.furnitureDark, {
        rounded: false,
        metalness: 0.45,
        castShadow: false,
        receiveShadow: false
      });
      userData.userData.optimizationStats = {
        type: doorType === "glass" ? "door-glass" : "door-solid",
        before: doorType === "glass" ? 9 : 5,
        after: doorType === "glass" ? 4 : 3
      };
      worldGroup.add(userData);
    }
  }
  const localValuePrevious = shadowCastingLightIdSet();
  const push = [];
  for (const type of floorSceneCurrent.items) {
    const x38 = toPreviewLocalWallPoint(type);
    if (type.type === "flooropening") {
      continue;
    }
    const userData = buildStudioItemMeshGroup(type, localValuePrevious);
    if (yt && type.type === "smallcar") {
      userData.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type.type)) {
      userData.userData.environmentModelId = type.id;
      userData.userData.environmentModelType = type.type;
      userData.userData.environmentFloorId = activeFloorId;
    }
    userData.position.set(x38.x, type.elevation || 0, x38.z);
    instanceMergeIdenticalItems(userData, type);
    userData.userData.modelLayer = set.has(type.type) ? "lights" : "items";
    userData.userData.exportRole = type.type === "planlabel" ? "label" : "plan";
    worldGroup.add(userData);
    if (!set.has(type.type)) {
      push.push({
        item: type,
        group: userData
      });
    }
  }
  mergeStaticItemInstanceBatches(worldGroup, push);
  if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("merge")) {
    mergeWallBands(THREE, worldGroup, mergeGeometries);
  }
  if (isStageEmbed && new URLSearchParams(window.location.search).get("furniture-runtime") === "compact") {
    compactRuntimeFurniture(worldGroup, push.filter(({
      item: id
    }) => !isSelected("item", id.id)), {
      THREE,
      mergeGeometries,
      materialKey: createGlassMaterial
    });
  }
  buildCanvasPathFromPoints(worldGroup, push);
  worldGroup.traverse(userData => {
    if (userData !== worldGroup && !userData.userData.exportRole) {
      userData.userData.exportRole = "plan";
    }
  });
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache
  });
  if (isStageEmbed) {
    cacheObjectTransforms(worldGroup, THREE.Object3D);
  }
}
function getPreviewFloorModeCurrent() {
  if (projectDocCurrent?.previewFloorMode === "all" && projectDocCurrent.floors.length > 1) {
    return "all";
  } else {
    return "active";
  }
}
function syncPreviewFloorButtons() {
  const value = getPreviewFloorModeCurrent();
  const view = (projectDocCurrent?.floors.length || 0) > 1;
  for (const entry of r0) {
    const comparisonFlag = entry.dataset.previewFloor === value;
    entry.classList.toggle("active", comparisonFlag);
    entry.setAttribute("aria-pressed", String(comparisonFlag));
    entry.disabled = entry.dataset.previewFloor === "all" && !view;
  }
}
function setPreviewFloorModeCurrent(floorEntry, {
  persist: preserveLightCache = true
} = {}) {
  if (projectDocCurrent) {
    projectDocCurrent.previewFloorMode = floorEntry === "all" && projectDocCurrent.floors.length > 1 ? "all" : "active";
    syncPreviewFloorButtons();
    syncFloorCameraChrome();
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false
    });
    Promise.allSettled(loadVisibleExternalModels());
    rebuildWorldPreviewCurrent();
    applyCameraViewCurrent();
    if (preserveLightCache) {
      scheduleSave();
    }
  }
}
function rebuildWorldPreviewCurrent({
  preserveLightCache: preserveLightCache = false
} = {}) {
  if (!worldGroup) {
    return;
  }
  if (getPreviewFloorModeCurrent() !== "all") {
    rebuildWorldPreview({
      preserveLightCache: preserveLightCache
    });
    flushPlanZoomFrame();
    return;
  }
  const object3d = worldGroup;
  const value = floorSceneCurrent;
  const savedActiveFloorId = activeFloorId;
  const savedOrbitLookAt = Lo;
  applyPreviewEnvironment();
  clearWorldGroupChildren();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache
  });
  const someVar = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation);
  const conditionalValue = stageSession ? finite(projectDocCurrent.exportFloorGap, 3) : finite(projectDocCurrent.previewFloorGap, 3);
  someVar.forEach((wall, argSecondary) => {
    const name4 = new THREE.Group();
    name4.name = "floor-" + wall.id;
    name4.userData.floorId = wall.id;
    worldGroup = name4;
    floorSceneCurrent = wall.scene;
    activeFloorId = wall.id;
    Lo = {
      x: finite(wall.originX, 0),
      y: finite(wall.originY, 0)
    };
    rebuildWorldPreview({
      preserveLightCache: preserveLightCache
    });
    if (argSecondary > 0) {
      for (const userData of [...name4.children]) {
        if (["background", "grid"].includes(userData.userData?.exportRole)) {
          if (isStageEmbed) {
            userData.userData.floorBackgroundHidden = true;
            userData.visible = false;
            continue;
          }
          name4.remove(userData);
          disposeObject3dResources(userData);
        }
      }
    }
    name4.position.set(finite(wall.offsetX, 0), argSecondary * conditionalValue, finite(wall.offsetZ, 0));
    name4.rotation.y = -THREE.MathUtils.degToRad(finite(wall.rotation, 0));
    object3d.add(name4);
  });
  worldGroup = object3d;
  floorSceneCurrent = value;
  activeFloorId = savedActiveFloorId;
  Lo = savedOrbitLookAt;
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache
  });
  flushPlanZoomFrame();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache
  });
}
function removeWorldModelLayer(argPrimary) {
  if (!argPrimary.size || !worldGroup) {
    return;
  }
  if (getPreviewFloorModeCurrent() !== "all") {
    if (argPrimary.has(activeFloorId)) {
      rebuildWorldPreviewCurrent();
    }
    return;
  }
  const childNodes = worldGroup;
  const localValue = floorSceneCurrent;
  const localValueCurrent = activeFloorId;
  const localValueNext = Lo;
  const someFlag = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation);
  if (someFlag.some(kind => !childNodes.children.some(userData => userData.userData?.floorId === kind.id))) {
    rebuildWorldPreviewCurrent();
    return;
  }
  try {
    for (const [localValue, id] of someFlag.entries()) {
      if (argPrimary.has(id.id) && (worldGroup = childNodes.children.find(userData => userData.userData?.floorId === id.id), floorSceneCurrent = id.scene, activeFloorId = id.id, Lo = {
        x: finite(id.originX, 0),
        y: finite(id.originY, 0)
      }, worldGroup.position.set(finite(id.offsetX, 0), localValue * projectDocCurrent.previewFloorGap, finite(id.offsetZ, 0)), worldGroup.rotation.set(0, -THREE.MathUtils.degToRad(finite(id.rotation, 0)), 0), worldGroup.scale.set(1, 1, 1), rebuildWorldPreview(), localValue > 0)) {
        for (const userData of [...worldGroup.children]) {
          if (["background", "grid"].includes(userData.userData?.exportRole)) {
            if (isStageEmbed) {
              userData.userData.floorBackgroundHidden = true;
              userData.visible = false;
              continue;
            }
            worldGroup.remove(userData);
            disposeObject3dResources(userData);
          }
        }
      }
    }
  } finally {
    worldGroup = childNodes;
    floorSceneCurrent = localValue;
    activeFloorId = localValueCurrent;
    Lo = localValueNext;
  }
  syncSpotShadowCastingLights(childNodes);
  flushPlanZoomFrame();
}
function flushPlanPanFrame() {
  const event = pixelsPerMeter();
  if (!event) {
    return null;
  }
  const minX = getPreviewFloorMode();
  const halfValue = (minX.minX + minX.maxX) / 2;
  const value = (minX.minY + minX.maxY) / 2;
  return {
    ppm: event,
    floorSurfaceY: -0.008,
    floorPolygons: getFloorPolygons(event),
    toWorld: el => ({
      x: (el.x - halfValue) / event,
      z: (el.y - value) / event
    })
  };
}
function rebuildPreviewItemMeshes(argPrimary) {
  if (worldGroup) {
    for (const userData of [...worldGroup.children]) {
      if (userData.userData.modelLayer === argPrimary) {
        worldGroup.remove(userData);
        disposeObject3dResources(userData);
      }
    }
  }
}
function rebuildPreviewAfterPlanChange(argPrimary, {
  preserveLightCache: preserveLightCache = false
} = {}) {
  if (!worldGroup) {
    return;
  }
  const toWorld = flushPlanPanFrame();
  if (!toWorld) {
    return;
  }
  rebuildPreviewItemMeshes(argPrimary);
  const comparisonFlag = argPrimary === "lights";
  const conditionalValue = comparisonFlag ? shadowCastingLightIdSet() : null;
  const push = [];
  for (const type of floorSceneCurrent.items) {
    if (set.has(type.type) !== comparisonFlag) {
      continue;
    }
    const x39 = toWorld.toWorld(type);
    if (type.type === "flooropening") {
      continue;
    }
    const userData = buildStudioItemMeshGroup(type, conditionalValue);
    if (yt && type.type === "smallcar") {
      userData.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type.type)) {
      userData.userData.environmentModelId = type.id;
      userData.userData.environmentModelType = type.type;
      userData.userData.environmentFloorId = activeFloorId;
    }
    userData.position.set(x39.x, type.elevation || 0, x39.z);
    instanceMergeIdenticalItems(userData, type);
    userData.userData.modelLayer = argPrimary;
    worldGroup.add(userData);
    if (!comparisonFlag) {
      push.push({
        item: type,
        group: userData
      });
    }
  }
  if (!comparisonFlag) {
    mergeStaticItemInstanceBatches(worldGroup, push);
    if (isStageEmbed && new URLSearchParams(window.location.search).get("furniture-runtime") === "compact") {
      compactRuntimeFurniture(worldGroup, push.filter(({
        item: id
      }) => !isSelected("item", id.id)), {
        THREE,
        mergeGeometries,
        materialKey: createGlassMaterial
      });
    }
    buildCanvasPathFromPoints(worldGroup, push);
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache
  });
  if (isStageEmbed) {
    cacheObjectTransforms(worldGroup, THREE.Object3D);
  }
  if (comparisonFlag) {
    syncOrbitControls();
  }
  requestRender({
    shadows: !comparisonFlag && !preserveLightCache,
    preserveLightCache: preserveLightCache
  });
}
function rebuildPreviewLightMeshes(preserveLightCache = {}) {
  rebuildPreviewAfterPlanChange("items", preserveLightCache);
}
function rebuildPreviewLightMeshesCurrent(options = {}) {
  rebuildPreviewAfterPlanChange("lights", options);
}
function applyCameraView(argPrimary, has) {
  for (let parent = argPrimary; parent && parent !== worldGroup; parent = parent.parent) {
    if (has.has(parent.userData?.modelLayer)) {
      return true;
    }
  }
  return false;
}
function isWallCloseSnap({
  excludeModelLayers: options = null
} = {}) {
  const value = new THREE.Box3();
  worldGroup.updateWorldMatrix(true, true);
  worldGroup.traverse(geometry => {
    if (!!geometry.isMesh && !["background", "grid", "light-source-preview"].includes(geometry.userData?.exportRole) && (!options || !applyCameraView(geometry, options))) {
      if (geometry.isInstancedMesh) {
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          value.union(geometry.boundingBox.clone().applyMatrix4(geometry.matrixWorld));
        }
        return;
      }
      geometry.geometry.computeBoundingBox();
      if (geometry.geometry.boundingBox) {
        value.union(geometry.geometry.boundingBox.clone().applyMatrix4(geometry.matrixWorld));
      }
    }
  });
  return value;
}
function flushPlanZoomFrame() {
  if (!shadowCameraExpanded || !previewSpotLight?.shadow?.camera || !worldGroup) {
    return false;
  }
  const argPrimary = isWallCloseSnap();
  if (argPrimary.isEmpty()) {
    return false;
  }
  worldGroup.updateWorldMatrix(true, true);
  previewSpotLight.updateWorldMatrix(true, false);
  previewSpotLight.target.updateWorldMatrix(true, false);
  const flag = previewSpotLight.shadow.camera;
  const localValue = new THREE.Vector3().setFromMatrixPosition(previewSpotLight.matrixWorld);
  const position = new THREE.Vector3().setFromMatrixPosition(previewSpotLight.target.matrixWorld);
  flag.position.copy(localValue);
  flag.lookAt(position);
  flag.updateMatrixWorld(true);
  const x47 = new THREE.Vector3(Infinity, Infinity, Infinity);
  const x48 = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const localValueCurrent of [argPrimary.min.x, argPrimary.max.x]) {
    for (const localValue of [argPrimary.min.y, argPrimary.max.y]) {
      for (const localValue of [argPrimary.min.z, argPrimary.max.z]) {
        const matrix = new THREE.Vector3(localValueCurrent, localValue, localValue).applyMatrix4(flag.matrixWorldInverse);
        x47.min(matrix);
        x48.max(matrix);
      }
    }
  }
  const max = Math.max(x48.x - x47.x, x48.y - x47.y, 1);
  const localValueCurrent = Math.max(sofaGeometryCache, max * 0.05);
  const z = -x48.z;
  const localValueNext = -x47.z;
  const localValuePrevious = Math.max(sofaGeometryCache, (localValueNext - z) * 0.08);
  flag.left = x47.x - localValueCurrent;
  flag.right = x48.x + localValueCurrent;
  flag.bottom = x47.y - localValueCurrent;
  flag.top = x48.y + localValueCurrent;
  flag.near = Math.max(0.1, z - localValuePrevious);
  flag.far = Math.max(flag.near + 1, localValueNext + localValuePrevious);
  flag.updateProjectionMatrix();
  previewSpotLight.shadow.needsUpdate = true;
  return true;
}
function applyCameraViewCurrent(forceOrthogonalAxis = {}) {
  if (!cameraCurrent || !orbitControls) {
    return;
  }
  const cameraView = forceOrthogonalAxis.view === "top" ? "top" : forceOrthogonalAxis.view === "free" ? "free" : cameraViewMode();
  const currentTopViewRotation = topViewRotation();
  const comparisonFlag = getPreviewFloorModeCurrent() === "all";
  const computedValue = pixelsPerMeter() || 100;
  const width = getPreviewFloorMode();
  const isEmpty = isWallCloseSnap({
    excludeModelLayers: new Set(["items", "lights"])
  });
  const x49 = comparisonFlag && !isEmpty.isEmpty() ? isEmpty.getSize(new THREE.Vector3()) : null;
  const x50 = isEmpty.isEmpty() ? null : isEmpty.getCenter(new THREE.Vector3());
  const conditionalValue = comparisonFlag && x49 ? clamp(Math.max(x49.x, x49.z), 5, 100) : clamp(Math.max(width.width, width.height) / computedValue, 5, 35);
  const y = comparisonFlag && x49 ? x49.y : Math.max(0, ...floorSceneCurrent.walls.map(height => height.height || 0));
  const frameSize = Math.max(conditionalValue * 1.18, conditionalValue + y * 0.32);
  cameraCurrent.userData.frameSize = frameSize;
  cameraCurrent.userData.cameraView = cameraView;
  cameraCurrent.userData.topRotation = currentTopViewRotation;
  const x51 = x50 ? new THREE.Vector3(x50.x, x50.y, x50.z) : new THREE.Vector3(0, Math.min(0.78, conditionalValue * 0.055), 0);
  let localValue;
  if (cameraCurrent.isPerspectiveCamera) {
    cameraCurrent.aspect = cameraCurrent.userData.viewportAspect || 1;
    applyCameraFocalLength();
    const axisLockedPoint = frameSize / (Math.tan(THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV()) / 2) * 2);
    localValue = Math.max(axisLockedPoint * 1.04, conditionalValue * 1.65, 8);
  } else {
    focusCameraOnPoint(frameSize, cameraCurrent.userData.viewportAspect || 1);
    localValue = Math.max(conditionalValue * 3.2, 18);
  }
  if (cameraView === "top") {
    cameraCurrent.up.copy(topViewForwardVector(currentTopViewRotation));
    cameraCurrent.position.set(x51.x, x51.y + localValue, x51.z);
  } else {
    cameraCurrent.up.set(0, 1, 0);
    const normalize = new THREE.Vector3(1.08, 1.7, 1.12).normalize();
    cameraCurrent.position.copy(x51).addScaledVector(normalize, localValue);
  }
  getCameraPose(cameraCurrent, x51);
  cameraCurrent.zoom = 1;
  cameraCurrent.lookAt(x51);
  cameraCurrent.updateProjectionMatrix();
  orbitControls.target.copy(x51);
  syncOrbitControls();
  orbitControls.update();
}
function onPlanPointerMove(event, anchor, forceOrthogonalAxis = false) {
  const computedValue = pixelsPerMeter() || 100;
  if (!isSnapActive()) {
    if (forceOrthogonalAxis && anchor) {
      const point = axisLockedPoint(event, anchor);
      return {
        ...point,
        kind: "axis",
        distance: distance(event, point.point)
      };
    }
    return {
      point: {
        ...event
      },
      kind: null,
      label: "",
      distance: 0
    };
  }
  const snapOrthogonal = floorSceneCurrent.settings;
  return snapPoint(event, floorSceneCurrent.walls, {
    zoom: planView.zoom,
    screenTolerance: clamp(Math.round(finite(snapOrthogonal.snapTolerance, 13)), 6, 24),
    anchor,
    forceOrthogonalAxis,
    preferVerticalAxis: snapOrthogonal.snapOrthogonal !== false,
    angleStepDegrees: 15,
    gridSize: computedValue * 0.1,
    intersections: snapOrthogonal.snapIntersections === false ? [] : getWallIntersections(computedValue),
    snapEndpoints: snapOrthogonal.snapEndpoints !== false,
    snapIntersections: snapOrthogonal.snapIntersections !== false,
    snapSegments: snapOrthogonal.snapSegments !== false,
    snapOrthogonal: snapOrthogonal.snapOrthogonal !== false,
    snapAngles: snapOrthogonal.snapAngles !== false,
    snapGrid: snapOrthogonal.snapGrid !== false
  });
}
function onPlanPointerDown(point = at) {
  if (!railingPlacementPreview || Ar < 2 || !point?.point) {
    return false;
  }
  const visibleScreen = Math.max(1, (pixelsPerMeter() || 100) * 0.01);
  return point.kind === "endpoint" && distance(point.point, railingPlacementPreview) <= visibleScreen;
}
function updatePlanStatusChrome(argPrimary = zr) {
  if (!Fi) {
    return;
  }
  no = {
    ...Fi
  };
  const planPoint = pixelsPerMeter() || 100;
  const text = Or ? "吸附：临时关闭" : "吸附：关闭";
  if (activeTool === "scale" && wallDrawAnchorCurrent && argPrimary) {
    const point = axisLockedPoint(Fi, wallDrawAnchorCurrent);
    no = point.point;
    at = null;
    No.textContent = "吸附：" + point.label;
  } else if (activeTool === "scale") {
    at = null;
    No.textContent = "吸附：自由";
  }
  referencePixels.textContent = "X " + (no.x / planPoint).toFixed(2) + " m · Y " + (no.y / planPoint).toFixed(2) + " m";
  if (activeTool === "wall") {
    at = onPlanPointerMove(Fi, Tt, argPrimary);
    No.textContent = onPlanPointerDown(at) ? "闭合：点击闭合空间" : at.kind ? (!isSnapActive() && argPrimary ? "锁定" : "吸附") + "：" + at.label : isSnapActive() ? "吸附：自由" : text;
  } else if (["window", "door", "railing"].includes(activeTool)) {
    const wall = nearestWall(no, floorSceneCurrent.walls, 16 / planView.zoom);
    if (wall) {
      const width = yo[wallDrawAnchor] || yo.solid;
      const objectValue = {
        width: activeTool === "door" ? width.width : activeTool === "railing" ? 2 : 1.4,
        t: wall.t
      };
      const options = {
        wall: wall.wall,
        t: clampWindowT(wall.wall, objectValue, planPoint)
      };
      Uo = activeTool === "window" ? options : null;
      railingPlacementPreviewCurrent = activeTool === "door" ? options : null;
      Ko = activeTool === "railing" ? options : null;
      No.textContent = activeTool === "door" ? "吸附：墙体门洞" : activeTool === "railing" ? "吸附：墙体栏杆" : "吸附：墙体";
    } else {
      Uo = null;
      railingPlacementPreviewCurrent = null;
      Ko = null;
      No.textContent = "吸附：未找到墙体";
    }
  } else if (activeTool !== "scale") {
    at = null;
    Uo = null;
    railingPlacementPreviewCurrent = null;
    Ko = null;
    No.textContent = isSnapActive() ? "吸附：开启" : text;
    const type = beginItemDrag(no);
    element.style.cursor = type?.type === "rotate-item" ? "grab" : type?.type === "resize-item" ? "nwse-resize" : "";
  }
}
function beginPlanPan(event) {
  zr = event.shiftKey;
  Fi = screenToPlanWithView(pointerEventToCanvasPoint(event));
  updatePlanStatusChrome();
}
function handlePlanPointerDown(pointerId) {
  if (pointerId.button !== 0 && pointerId.button !== 1) {
    return;
  }
  element.focus({
    preventScroll: true
  });
  const visibleScreen = pointerEventToCanvasPoint(pointerId);
  const start = screenToPlanWithView(visibleScreen);
  if (pointerId.button === 1 || saveConflictState) {
    pointerId.preventDefault();
    markLeavingStudio();
    dragState = {
      type: "pan",
      pointerId: pointerId.pointerId,
      screen: screenToPlan(visibleScreen),
      visibleScreen,
      offsetX: planView.offsetX,
      offsetY: planView.offsetY
    };
    element.classList.add("panning");
    ensureMeasureCanvas();
    element.setPointerCapture(pointerId.pointerId);
    return;
  }
  if (alignSession && handleAlignFloorClick(start)) {
    return;
  }
  if (activeTool === "flooropening") {
    if (!requireCalibration()) {
      return;
    }
    pointerId.preventDefault();
    markLeavingStudio();
    dragState = {
      type: "draw-flooropening",
      pointerId: pointerId.pointerId,
      start: start,
      current: start
    };
    element.setPointerCapture(pointerId.pointerId);
    return;
  }
  if (activeTool === "scale") {
    if (!wallDrawAnchorCurrent) {
      wallDrawAnchorCurrent = start;
      drawPlan();
      return;
    }
    const end = pointerId.shiftKey ? axisLockedPoint(start, wallDrawAnchorCurrent).point : start;
    if (distance(wallDrawAnchorCurrent, end) < 12 / planView.zoom) {
      showToast("参考线太短，请重新选择终点。", "error");
      return;
    }
    shiftKeyHeld = {
      start: wallDrawAnchorCurrent,
      end
    };
    wallDrawAnchorCurrent = null;
    applyLightPropertyEls.textContent = Math.round(distance(shiftKeyHeld.start, shiftKeyHeld.end)) + " px";
    toast.value = floorSceneCurrent.calibration?.reference?.meters || 3;
    lightPropertyApplyTitle.showModal();
    requestAnimationFrame(() => toast.select());
    drawPlan();
    return;
  }
  if (activeTool === "wall") {
    if (!requireCalibration()) {
      return;
    }
    const point = onPlanPointerMove(start, Tt, pointerId.shiftKey);
    if (!Tt) {
      Tt = {
        ...point.point
      };
      railingPlacementPreview = {
        ...point.point
      };
      Ar = 0;
      yr.hidden = false;
      drawPlan();
      return;
    }
    if (distance(Tt, point.point) < pixelsPerMeter() * 0.08) {
      showToast("墙段太短，请选择更远的终点。", "error");
      return;
    }
    const options = {
      id: makeId("wall"),
      start: {
        ...Tt
      },
      end: {
        ...point.point
      },
      height: floorSceneCurrent.settings.wallHeight,
      thickness: floorSceneCurrent.settings.wallThickness
    };
    const pixelsPerMeterValue = Math.max(0.75, pixelsPerMeter() * 0.01);
    const length = uncoveredCollinearWallSegments(options, floorSceneCurrent.walls, pixelsPerMeterValue);
    if (!length.length) {
      Tt = {
        ...point.point
      };
      showToast("该位置已有墙体，已跳过重复墙段。");
      drawPlan();
      return;
    }
    const comparisonFlag = length.length !== 1 || distance(length[0].start, options.start) > pixelsPerMeterValue || distance(length[0].end, options.end) > pixelsPerMeterValue;
    pushHistory();
    const max = Math.max(1, pixelsPerMeter() * 0.01);
    const lengthValue = closedWallPolygons(floorSceneCurrent.walls, max).length;
    const localValue = length.map((start, argSecondary) => ({
      ...options,
      id: argSecondary === 0 ? options.id : makeId("wall"),
      start: start.start,
      end: start.end
    }));
    floorSceneCurrent.walls.push(...localValue);
    cachedWallOpenings();
    Ar += 1;
    const element = closedWallPolygons(floorSceneCurrent.walls, max).length > lengthValue;
    if (element) {
      resetWallDrawingCurrent();
    } else {
      Tt = {
        ...point.point
      };
    }
    setSelection("wall", localValue[0].id);
    yr.hidden = element;
    refreshViews();
    scheduleSave();
    if (element) {
      showToast("空间已闭合，地面已生成。可继续绘制下一个空间。", "success");
    } else if (comparisonFlag) {
      showToast("已跳过与现有墙体重合的部分。", "success");
    }
    return;
  }
  if (activeTool === "window") {
    if (!requireCalibration()) {
      return;
    }
    const wall = nearestWall(start, floorSceneCurrent.walls, 18 / planView.zoom);
    if (!wall) {
      showToast("请靠近一段墙体放置窗户。", "error");
      return;
    }
    pushHistory();
    const t3 = {
      id: makeId("window"),
      wallId: wall.wall.id,
      t: wall.t,
      width: 1.4,
      height: 1.35,
      sill: 0.85
    };
    t3.t = clampWindowT(wall.wall, t3, pixelsPerMeter());
    floorSceneCurrent.windows.push(t3);
    setSelection("window", t3.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "door") {
    if (!requireCalibration()) {
      return;
    }
    const wall = nearestWall(start, floorSceneCurrent.walls, 18 / planView.zoom);
    if (!wall) {
      showToast("请靠近一段墙体放置门。", "error");
      return;
    }
    pushHistory();
    const width = yo[wallDrawAnchor] || yo.solid;
    const t4 = {
      id: makeId("door"),
      wallId: wall.wall.id,
      t: wall.t,
      width: width.width,
      height: width.height,
      sill: 0,
      doorType: wallDrawAnchor,
      hinge: "left",
      swing: 1
    };
    t4.t = clampWindowT(wall.wall, t4, pixelsPerMeter());
    floorSceneCurrent.doors.push(t4);
    setSelection("door", t4.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "railing") {
    if (!requireCalibration()) {
      return;
    }
    const wall = nearestWall(start, floorSceneCurrent.walls, 18 / planView.zoom);
    if (!wall) {
      showToast("请靠近一段墙体放置栏杆。", "error");
      return;
    }
    pushHistory();
    const t5 = {
      id: makeId("railing"),
      wallId: wall.wall.id,
      t: wall.t,
      width: 2,
      height: 1.1,
      sill: 0
    };
    t5.t = clampWindowT(wall.wall, t5, pixelsPerMeter());
    floorSceneCurrent.railings.push(t5);
    setSelection("railing", t5.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "label") {
    placeCatalogFurnitureItem("planlabel", start);
    return;
  }
  const corner = beginItemDrag(start);
  if (corner) {
    markLeavingStudio();
    const originalItem = {
      ...corner.item
    };
    dragState = corner.type === "resize-item" ? {
      type: "resize-item",
      pointerId: pointerId.pointerId,
      originalItem,
      handle: {
        x: corner.corner.x,
        y: corner.corner.y
      },
      anchor: {
        ...corner.corner.opposite
      },
      before: cloneFloorScene(),
      moved: false
    } : {
      type: "rotate-item",
      pointerId: pointerId.pointerId,
      originalItem,
      center: {
        x: originalItem.x,
        y: originalItem.y
      },
      startPointer: {
        ...start
      },
      before: cloneFloorScene(),
      moved: false
    };
    element.setPointerCapture(pointerId.pointerId);
    return;
  }
  const localValue = activeSelectionLightGroupFilter();
  const kind = placeCatalogItemAt(start);
  if (!kind) {
    markLeavingStudio();
    if (!pointerId.shiftKey) {
      clearSelection();
    }
    dragState = {
      type: "marquee",
      pointerId: pointerId.pointerId,
      start: start,
      current: start,
      additive: pointerId.shiftKey,
      moved: false
    };
    updateSelectionInspector();
    drawPlan();
    ensureMeasureCanvas();
    if (!pointerId.shiftKey) {
      rebuildPreviewForAssetFilters(localValue);
    }
    element.setPointerCapture(pointerId.pointerId);
    return;
  }
  markLeavingStudio();
  const before = kind.kind === "item" ? cloneFloorScene() : null;
  const comparisonFlag = kind.kind === "item" && multiSelection.length > 0 && isSelected("item", kind.id);
  let map = [];
  let copied = false;
  if (kind.kind === "item") {
    if (comparisonFlag) {
      const has = new Set(multiSelection.filter(kind => kind.kind === "item").map(named => named.id));
      map = floorSceneCurrent.items.filter(item => has.has(item.id));
    } else {
      setSelection("item", kind.id);
      const localValue = floorSceneCurrent.items.find(item => item.id === kind.id);
      if (localValue) {
        map = [localValue];
      }
    }
    if (pointerId.altKey && map.length) {
      const length = map.map(argPrimary => ({
        ...structuredClone(argPrimary),
        id: makeId("item")
      }));
      ensureItemLayerNames(length);
      floorSceneCurrent.items.push(...length);
      map = length;
      if (length.length === 1) {
        setSelection("item", length[0].id);
      } else {
        selection = null;
        multiSelection = length.map(event => ({
          kind: "item",
          id: event.id
        }));
      }
      copied = true;
    }
  } else {
    setSelection(kind.kind, kind.id);
  }
  updateSelectionInspector();
  drawPlan();
  rebuildPreviewForAssetFilters(localValue);
  const category = activeSelectionAssetCategory();
  const previewScope = localValue === category ? category : "all";
  if (kind.kind === "item") {
    dragState = {
      type: "move-items",
      pointerId: pointerId.pointerId,
      start: start,
      originals: map.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y
      })),
      before: before,
      copied,
      previewScope,
      moved: false
    };
  } else if (["window", "door", "railing"].includes(kind.kind)) {
    dragState = {
      type: "move-opening",
      pointerId: pointerId.pointerId,
      start: start,
      before: cloneFloorScene(),
      previewScope: "all",
      moved: false
    };
  }
  if (dragState) {
    element.setPointerCapture(pointerId.pointerId);
  } else {
    scheduleLeaveStudio();
  }
}
function onPlanWheelZoom(event) {
  const x52 = pointerEventToCanvasPoint(event);
  const x53 = screenToPlanWithView(x52);
  if (dragState?.pointerId === event.pointerId) {
    if (dragState.type === "draw-flooropening") {
      dragState.current = event.shiftKey ? (() => {
        const computedValue = x53.x - dragState.start.x;
        const value = x53.y - dragState.start.y;
        const localValue = Math.max(Math.abs(computedValue), Math.abs(value));
        return {
          x: dragState.start.x + Math.sign(computedValue || 1) * localValue,
          y: dragState.start.y + Math.sign(value || 1) * localValue
        };
      })() : x53;
      drawPlan();
      return;
    }
    if (dragState.type === "marquee") {
      dragState.current = x53;
      dragState.moved = distance(dragState.start, x53) * planView.zoom >= 4;
      if (blitMeasureOverlay()) {
        drawMarqueeSelection();
      } else {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "pan") {
      const x25 = screenToPlan(x52);
      planView.offsetX = dragState.offsetX + x25.x - dragState.screen.x;
      planView.offsetY = dragState.offsetY + x25.y - dragState.screen.y;
      const offsetX = x52.x - dragState.visibleScreen.x;
      const offsetY = x52.y - dragState.visibleScreen.y;
      if (!blitMeasureOverlay({
        offsetX,
        offsetY
      })) {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "move-items") {
      if (!dragState.moved && distance(x53, dragState.start) * planView.zoom < 3) {
        return;
      }
      const computedValue = pixelsPerMeter() * 0.05;
      const comparisonFlag = isSnapActive() && floorSceneCurrent.settings.snapGrid !== false;
      let value = x53.x - dragState.start.x;
      let computedValueCurrent = x53.y - dragState.start.y;
      if (event.shiftKey) {
        if (Math.abs(value) >= Math.abs(computedValueCurrent)) {
          computedValueCurrent = 0;
        } else {
          value = 0;
        }
      }
      const items = new Map(floorSceneCurrent.items.map(itemKey => [itemKey.id, itemKey]));
      for (const x16 of dragState.originals) {
        const x15 = items.get(x16.id);
        if (x15) {
          x15.x = comparisonFlag ? Math.round((x16.x + value) / computedValue) * computedValue : x16.x + value;
          x15.y = comparisonFlag ? Math.round((x16.y + computedValueCurrent) / computedValue) * computedValue : x16.y + computedValueCurrent;
        }
      }
      dragState.moved = dragState.originals.some(event => {
        const x6 = items.get(event.id);
        return x6 && (Math.abs(x6.x - event.x) > 0.000001 || Math.abs(x6.y - event.y) > 0.000001);
      });
      drawPlan();
      return;
    }
    if (dragState.type === "resize-item") {
      if (!dragState.moved && distance(x53, dragState.handle) * planView.zoom < 3) {
        return;
      }
      const x26 = selectedEntity();
      if (!x26) {
        return;
      }
      const localValue = Math.max(finite(dragState.originalItem.height, 0.05), 0.001);
      const conditionalValue = event.shiftKey ? {
        minimum: Math.max(0.1 / Math.max(dragState.originalItem.width, 0.1), 0.1 / Math.max(dragState.originalItem.depth, 0.1), itemMinimumHeight(dragState.originalItem.type) / localValue),
        maximum: Math.min(8 / Math.max(dragState.originalItem.width, 0.1), 8 / Math.max(dragState.originalItem.depth, 0.1), 6 / localValue)
      } : undefined;
      const pixelsPerMeterValue = resizeRotatedItemFromCorner(dragState.originalItem, dragState.handle, dragState.anchor, x53, pixelsPerMeter() || 1, event.shiftKey, conditionalValue);
      Object.assign(x26, pixelsPerMeterValue);
      dragState.moved = Math.abs(x26.x - dragState.originalItem.x) > 0.000001 || Math.abs(x26.y - dragState.originalItem.y) > 0.000001 || Math.abs(x26.width - dragState.originalItem.width) > 0.000001 || Math.abs(x26.depth - dragState.originalItem.depth) > 0.000001 || Math.abs(x26.height - dragState.originalItem.height) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "rotate-item") {
      if (!dragState.moved && distance(x53, dragState.startPointer) * planView.zoom < 3) {
        return;
      }
      const rotation = selectedEntity();
      if (!rotation) {
        return;
      }
      rotation.rotation = itemRotationFromPointers(dragState.originalItem.rotation, dragState.center, dragState.startPointer, x53, event.shiftKey ? 15 : 0);
      dragState.moved = Math.abs(rotation.rotation - dragState.originalItem.rotation) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "move-opening") {
      if (!dragState.moved && distance(x53, dragState.start) * planView.zoom < 3) {
        return;
      }
      const t = selectedEntity();
      const start = floorSceneCurrent.walls.find(item => item.id === t?.wallId);
      if (!t || !start) {
        return;
      }
      t.t = clampWindowT(start, {
        ...t,
        t: projectPointToSegment(x53, start.start, start.end).t
      }, pixelsPerMeter());
      const t2 = dragState.before?.[selection?.kind + "s"]?.find?.(item => item.id === t.id);
      dragState.moved = !t2 || Math.abs(t.t - t2.t) > 0.000001;
      drawPlan();
      return;
    }
  }
  beginPlanPan(event);
  if (alignSession || ["scale", "wall", "window", "door", "railing"].includes(activeTool)) {
    drawPlan();
  }
}
function resetWallDrawing() {
  $r = 0;
  const localValue = Gr;
  Gr = null;
  if (localValue) {
    onPlanWheelZoom(localValue);
  }
}
function queuePlanPointerMoveFrame(pointer) {
  Gr = {
    clientX: pointer.clientX,
    clientY: pointer.clientY,
    pointerId: pointer.pointerId,
    shiftKey: pointer.shiftKey
  };
  $r ||= requestAnimationFrame(resetWallDrawing);
}
function onPlanPointerCancel(pointer) {
  if (!!Gr && Gr.pointerId === pointer) {
    if ($r) {
      cancelAnimationFrame($r);
    }
    resetWallDrawing();
  }
}
function cancelWallDrawing() {
  previewScene = 0;
  const localValue = defaultExportHeight;
  const localValueCurrent = exportAspectRatio;
  defaultExportHeight = 1;
  exportAspectRatio = null;
  if (localValueCurrent && Math.abs(localValue - 1) > 1e-8) {
    zoomPlanViewAt(localValue, localValueCurrent);
  }
}
function applyInspectorFields(argPrimary) {
  defaultExportHeight *= Math.exp(-argPrimary.deltaY * 0.0012);
  exportAspectRatio = pointerEventToCanvasPoint(argPrimary);
  markLeavingStudio();
  previewScene ||= requestAnimationFrame(cancelWallDrawing);
  window.clearTimeout(camera);
  camera = window.setTimeout(() => {
    camera = null;
    if (previewScene) {
      cancelAnimationFrame(previewScene);
      cancelWallDrawing();
    }
    scheduleLeaveStudio();
  }, 90);
}
function setHoveredInspectorTarget(pointerEvent) {
  if (!dragState || dragState.pointerId !== pointerEvent.pointerId) {
    return;
  }
  if (dragState.type === "draw-flooropening") {
    const {
      start: x40,
      current: x41
    } = dragState;
    try {
      element.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    scheduleLeaveStudio();
    const computedValue = Math.abs(x41.x - x40.x) / pixelsPerMeter();
    const value = Math.abs(x41.y - x40.y) / pixelsPerMeter();
    if (pointerEvent.type !== "pointercancel" && computedValue >= 0.1 && value >= 0.1) {
      placeCatalogFurnitureItem("flooropening", {
        x: (x40.x + x41.x) / 2,
        y: (x40.y + x41.y) / 2
      }, {
        width: Math.min(20, computedValue),
        depth: Math.min(20, value)
      });
    } else {
      drawPlan();
    }
    return;
  }
  if (dragState.type === "marquee") {
    const localValue = activeSelectionLightGroupFilter();
    const conditionalValue = dragState.additive ? [...(selection ? [selection] : []), ...multiSelection] : [];
    const hits = dragState.moved ? marqueeSelectHits(dragState.start, dragState.current) : [];
    const length = [...new Map([...conditionalValue, ...hits].map(kind => [kind.kind + ":" + kind.id, kind])).values()];
    if (length.length === 1) {
      setSelection(length[0].kind, length[0].id);
    } else {
      selection = null;
      multiSelection = length;
    }
    try {
      element.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(localValue);
    scheduleLeaveStudio();
    return;
  }
  const type = dragState;
  const computedValue = type.moved || type.copied;
  if (computedValue) {
    pushUndoSnapshot(dragState.before);
    scheduleSave();
  }
  if (["move-items", "resize-item", "rotate-item", "move-opening"].includes(type.type)) {
    updateSelectionInspector();
  }
  if (computedValue && type.type === "move-opening") {
    rebuildPreviewMeshes({
      scope: "all"
    });
  } else if (computedValue && ["move-items", "resize-item", "rotate-item"].includes(type.type)) {
    const localValue = selectedEntity();
    rebuildPreviewMeshes({
      scope: type.previewScope || (localValue ? itemPreviewScope(localValue) : activeSelectionAssetCategory())
    });
  }
  if (dragState.type === "pan") {
    element.classList.remove("panning");
  }
  try {
    element.releasePointerCapture(pointerEvent.pointerId);
  } catch {}
  dragState = null;
  if (type.type === "pan") {
    drawPlan();
  }
  scheduleLeaveStudio();
}
function scheduleClearInspectorHover(pointerId) {
  onPlanPointerCancel(pointerId.pointerId);
  setHoveredInspectorTarget(pointerId);
}
function applyInspectorFieldsCurrent(argPrimary) {
  const value = selectedEntity();
  if (!value || selection?.kind !== argPrimary) {
    return;
  }
  const activeSelectionLightGroupFilterResult = argPrimary === "item" ? itemPreviewScope(value) : "all";
  pushHistory();
  if (argPrimary === "wall") {
    value.height = clamp(finite(selectEl("#wall-height").value, value.height), 0.01, 6);
    value.thickness = clamp(finite(selectEl("#wall-thickness").value, value.thickness), 0.01, 3);
    value.opacity = selectEl("#wall-opacity-mode").value === "custom" ? clamp(finite(selectEl("#wall-opacity").value, floorSceneCurrent.settings.wallOpacity * 100), 0, 100) / 100 : null;
    value.allowOpenEnd = selectEl("#wall-open-end-mode").value === "allowed";
    floorSceneCurrent.settings.wallHeight = value.height;
    floorSceneCurrent.settings.wallThickness = value.thickness;
  } else if (argPrimary === "window") {
    value.width = clamp(finite(selectEl("#window-width").value, value.width), 0.3, 20);
    value.height = clamp(finite(selectEl("#window-height").value, value.height), 0.3, 20);
    value.sill = clamp(finite(selectEl("#window-sill").value, value.sill), 0, 20);
    value.hasDivider = selectEl("#window-divider").value !== "without";
    const localValue = floorSceneCurrent.walls.find(item => item.id === value.wallId);
    if (localValue) {
      value.t = clampWindowT(localValue, value, pixelsPerMeter());
    }
  } else if (argPrimary === "door") {
    value.doorType = Object.hasOwn(yo, selectEl("#door-type").value) ? selectEl("#door-type").value : "solid";
    value.width = clamp(finite(selectEl("#door-width").value, value.width), 0.55, 20);
    value.height = clamp(finite(selectEl("#door-height").value, value.height), 1.8, 20);
    const localValue = floorSceneCurrent.walls.find(kind => kind.id === value.wallId);
    if (localValue) {
      value.t = clampWindowT(localValue, value, pixelsPerMeter());
    }
  } else if (argPrimary === "railing") {
    value.width = clamp(finite(selectEl("#railing-width").value, value.width), 0.3, 20);
    value.height = clamp(finite(selectEl("#railing-height").value, value.height), 0.5, 3);
    const localValue = floorSceneCurrent.walls.find(floor => floor.id === value.wallId);
    if (localValue) {
      value.t = clampWindowT(localValue, value, pixelsPerMeter());
    }
  } else {
    const computedValue = pixelsPerMeter() || 1;
    value.x = finite(selectEl("#item-x").value, value.x / computedValue) * computedValue;
    value.y = finite(selectEl("#item-y").value, value.y / computedValue) * computedValue;
    value.width = clamp(finite(selectEl("#item-width").value, value.width), 0.1, 8);
    value.height = clamp(finite(selectEl("#item-height").value, value.height), itemMinimumHeight(value.type), 6);
    value.depth = clamp(finite(selectEl("#item-depth").value, value.depth), 0.1, 8);
    value.elevation = clamp(finite(selectEl("#item-elevation").value, value.elevation || 0), 0, 6);
    value.rotation = value.type === "striplight" ? normalizeFullRotation(selectEl("#item-rotation").value, value.rotation) : finite(selectEl("#item-rotation").value, value.rotation);
    if (value.type === "planlabel") {
      value.title = normalizeLabelText(selectEl("#label-title").value, "家庭总览", 24);
      value.subtitle = normalizeLabelText(selectEl("#label-subtitle").value, "HOME PLAN", 36);
      value.titleSpacing = clamp(finite(selectEl("#label-title-spacing").value, 105) / 100, 0, 1.8);
      value.subtitleSpacing = clamp(finite(selectEl("#label-subtitle-spacing").value, 8) / 100, 0, 0.6);
      value.lineLength = clamp(finite(selectEl("#label-line-length").value, 86) / 100, 0.3, 1);
      value.height = 0.01;
      value.elevation = 0;
    }
    if (value.type === "curtain") {
      value.curtainPosition = ["left", "right", "split"].includes(selectEl("#curtain-position").value) ? selectEl("#curtain-position").value : "split";
    }
    if (roundTableTypes.has(value.type)) {
      value.roundTableTurntable = selectEl("#round-table-turntable").value === "with";
    }
    if (stairItemTypes.has(value.type)) {
      value.stairDirection = ["left", "right"].includes(selectEl("#stair-direction").value) ? selectEl("#stair-direction").value : "right";
    }
    if (value.type === "tv") {
      const conditionalValue = tvMountStyles.has(value.tvMountStyle) ? value.tvMountStyle : "standard";
      const tvMountStyle = tvMountStyles.has(selectEl("#tv-mount-style").value) ? selectEl("#tv-mount-style").value : "standard";
      if (conditionalValue !== tvMountStyle && tvMountStyle === "mobile") {
        value.height = Math.max(value.height, modelLoadStatusTimer.height);
        value.depth = Math.max(value.depth, modelLoadStatusTimer.depth);
        value.elevation = 0;
      } else if (conditionalValue === "mobile" && tvMountStyle !== "mobile" && Math.abs(value.height - modelLoadStatusTimer.height) < 0.001 && Math.abs(value.depth - modelLoadStatusTimer.depth) < 0.001) {
        value.height = furnitureCatalog.tv.height;
        value.depth = furnitureCatalog.tv.depth;
      }
      value.tvMountStyle = tvMountStyle;
    }
    if (set.has(value.type)) {
      const temperature = defaultLightPresets[value.type] || defaultLightPresets.downlight;
      value.verticalRotation = value.type === "striplight" ? normalizeFullRotation(selectEl("#item-vertical-rotation").value, value.verticalRotation || 0) : clamp(finite(selectEl("#item-vertical-rotation").value, value.verticalRotation || 0), -90, 90);
      if (value.type === "striplight") {
        value.stripRollRotation = normalizeFullRotation(itemStripRoll.value, value.stripRollRotation || 0);
        value.lightSourceVisible = zl.checked;
      }
      value.lightGroupId = floorSceneCurrent.lightGroups.some(group => group.id === selectEl("#light-group").value) ? selectEl("#light-group").value : ensureDefaultLightGroup().id;
      value.lightTemperature = clamp(finite(selectEl("#light-temperature").value, temperature.temperature), 2200, 6500);
      value.lightBrightness = clamp(finite(selectEl("#light-brightness").value, temperature.brightness), 0, 100);
      value.lightRange = clamp(finite(selectEl("#light-range").value, temperature.range), 0.5, 10);
      value.lightAngle = clamp(finite(selectEl("#light-angle").value, temperature.angle), 15, defaultItemDepth(value.type));
      value.height = furnitureCatalog[value.type].height;
    } else if (value.type === "camera" || value.type === "presence") {
      value.verticalRotation = clamp(finite(selectEl("#item-vertical-rotation").value, value.verticalRotation || 0), -180, 180);
    }
  }
  refreshViews(activeSelectionLightGroupFilterResult);
  scheduleSave();
}
function resetWallDrawingCurrent() {
  Tt = null;
  railingPlacementPreview = null;
  Ar = 0;
  yr.hidden = true;
}
function schedulePlanRedraw() {
  resetWallDrawingCurrent();
  drawPlan();
}
async function clearInspectorHover() {
  if (!planBackgroundImage) {
    setSaveStateLabel("地址无效", "error");
    return;
  }
  try {
    initPreviewRenderer();
    resizePlanCanvas();
    const get = new URLSearchParams(window.location.search);
    const awaitedValue = await studioFetch(isStageEmbed ? "/modules/interaction3d/scenes/" + encodeURIComponent(get.get("sceneId") || "") + "/current?projectId=" + encodeURIComponent(get.get("projectId") || "") : "/studio3d");
    floorRenameInput.textContent = "户型图绘制";
    document.title = "户型图绘制";
    await loadProjectDocument(awaitedValue);
    if (isStageEmbed) {
      await new Promise(requestAnimationFrame);
      const {
        mountStage: awaitedValue
      } = await import("/api/v1/modules/interaction3d/stage.js?v=20260910-health-fixes-v3-reflection-visible-floor-v1-navigation-scale-v1-presence-pages-v2-module-tabs-v1-20260912-align-v1-20260912-security-floor-models-v1-20260912-overview-tab-v1-20260912-overview-click-lock-v1");
      awaitedValue(bootstrapStudioFromLoadedProject());
      return;
    }
    setSaveStateLabel("已自动保存", "saved");
    if (autoDiagramComponentId) {
      if (isAutoDiagramEmbedCurrent) {
        scheduleOrbitResumeAfterModels();
      } else {
        window.setTimeout(() => scheduleOrbitResumeAfterModels(), 180);
      }
    }
  } catch (message) {
    if (isStageEmbed) {
      window.parent.postMessage({
        channel: "hb-i3d-v1",
        type: "error",
        message: message.message || "无法载入3D户型。"
      }, window.location.origin);
    }
    setSaveStateLabel("载入失败", "error");
    showToast(message.message || "无法载入项目。", "error");
  }
}
Zd.forEach(addEventListener => addEventListener.addEventListener("click", () => setActiveTool(addEventListener.dataset.tool)));
yf.addEventListener("click", () => {
  addNewFloor();
});
alignFloor.addEventListener("click", startAlignFloorSession);
previewFloorGapInput.addEventListener("change", commitPreviewFloorGap);
exportFloorGap.addEventListener("change", commitExportFloorGap);
for (const e of r0) {
  e.addEventListener("click", () => setPreviewFloorModeCurrent(e.dataset.previewFloor));
}
importPlanCurrent.addEventListener("click", () => Ia.click());
Ia.addEventListener("change", async () => {
  await importPlanBackgroundFile(Ia.files?.[0]);
  Ia.value = "";
});
toggleBackground.addEventListener("click", () => {
  if (floorSceneCurrent.background) {
    pushHistory();
    floorSceneCurrent.settings.backgroundVisible = !floorSceneCurrent.settings.backgroundVisible;
    refreshStudioPanels();
    drawPlan();
    scheduleSave();
  }
});
Ud.addEventListener("click", () => {
  if (floorSceneCurrent.background) {
    pushHistory();
    floorSceneCurrent.background = null;
    planBackgroundImageCurrent = null;
    refreshViews();
    fitPlanViewToContent();
    scheduleSave();
    showToast("底图引用已移除，现在可以在编辑器中删除这张图片。", "success");
  }
});
function beginOrSwitchWallSettingsEdit(argPrimary) {
  if (exportPresetEditorOpen && exportPresetEditorOpen !== argPrimary) {
    commitGlobalWallThickness();
  }
  if (!exportPresetEditorOpen) {
    pushHistory();
    exportPresetEditorOpen = argPrimary;
    markLeavingStudio();
  }
}
function commitGlobalWallHeight() {
  exportOverwriteResolver ||= requestAnimationFrame(() => {
    exportOverwriteResolver = 0;
    drawPlan();
  });
}
function commitGlobalWallThickness() {
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = null;
  if (exportPresetEditorOpen) {
    exportPresetEditorOpen = null;
    syncControlValue(globalWallHeight, floorSceneCurrent.settings.wallHeight.toFixed(2));
    syncControlValue(globalWallThickness, floorSceneCurrent.settings.wallThickness.toFixed(2));
    syncControlValue(globalWallOpacity, Math.round(floorSceneCurrent.settings.wallOpacity * 100));
    updateSelectionInspector();
    rebuildPreviewMeshes({
      scope: "all"
    });
    scheduleLeaveStudio();
  }
}
function scheduleClearInspectorHoverCurrent(numericParam = 80) {
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = window.setTimeout(commitGlobalWallThickness, numericParam);
}
function commitGlobalWallHeightCurrent() {
  const value = clamp(finite(globalWallHeight.value, floorSceneCurrent.settings.wallHeight), 0.01, 6);
  if (!(Math.abs(value - floorSceneCurrent.settings.wallHeight) < 1e-8) || !floorSceneCurrent.walls.every(height => Math.abs(height.height - value) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallHeight);
    floorSceneCurrent.settings.wallHeight = value;
    for (const height of floorSceneCurrent.walls) {
      height.height = value;
    }
    scheduleSave();
  }
}
function commitGlobalWallThicknessFromInput() {
  const wallThickness = clamp(finite(globalWallThickness.value, floorSceneCurrent.settings.wallThickness), 0.01, 3);
  if (!(Math.abs(wallThickness - floorSceneCurrent.settings.wallThickness) < 1e-8) || !floorSceneCurrent.walls.every(thickness => Math.abs(thickness.thickness - wallThickness) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallThickness);
    floorSceneCurrent.settings.wallThickness = wallThickness;
    for (const thickness of floorSceneCurrent.walls) {
      thickness.thickness = wallThickness;
    }
    commitGlobalWallHeight();
    scheduleSave();
  }
}
function commitGlobalWallOpacity() {
  const wallOpacity = clamp(finite(globalWallOpacity.value, floorSceneCurrent.settings.wallOpacity * 100), 0, 100) / 100;
  if (!(Math.abs(wallOpacity - floorSceneCurrent.settings.wallOpacity) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallOpacity);
    floorSceneCurrent.settings.wallOpacity = wallOpacity;
    scheduleSave();
  }
}
for (const [e, o] of [[globalWallHeight, commitGlobalWallHeightCurrent], [globalWallThickness, commitGlobalWallThicknessFromInput], [globalWallOpacity, commitGlobalWallOpacity]]) {
  e.addEventListener("input", o);
  e.addEventListener("change", () => {
    o();
    scheduleClearInspectorHoverCurrent();
  });
  e.addEventListener("blur", () => scheduleClearInspectorHoverCurrent(0));
}
toggleFloorEdge.addEventListener("click", () => {
  pushHistory();
  floorSceneCurrent.settings.floorEdgeVisible = floorSceneCurrent.settings.floorEdgeVisible === false;
  refreshViews();
  scheduleSave();
});
function closeLightGroupRenameDialog() {
  for (const hidden of itemCatalog) {
    hidden.hidden = hidden.dataset.assetHeadingCategory !== assetCategory;
  }
  for (const dataset of w0) {
    const localValue = dataset.dataset.itemType;
    const present = set.has(localValue);
    const localValueCurrent = RESERVED_TEXTURE_UNITS.has(localValue);
    const conditionalValue = assetCategory === "light" ? present : assetCategory === "appliance" ? localValueCurrent : !localValueCurrent && !present;
    dataset.hidden = !conditionalValue;
  }
}
function setAssetCategoryFilter(argPrimary) {
  const conditionalValue = ["home", "appliance", "light"].includes(argPrimary) ? argPrimary : "home";
  const localValue = activeSelectionLightGroupFilter();
  hideLightGroupContextMenu();
  assetCategory = conditionalValue;
  for (const dataset of m0) {
    const comparisonFlag = dataset.dataset.assetCategory === conditionalValue;
    dataset.classList.toggle("active", comparisonFlag);
    dataset.setAttribute("aria-pressed", String(comparisonFlag));
  }
  closeLightGroupRenameDialog();
  lightItemTypes.hidden = conditionalValue === "light";
  stairLikeTypes.hidden = conditionalValue !== "light";
  const type = selectedEntity();
  const comparisonFlag = selection?.kind === "item" && type && set.has(type.type);
  if (selection && conditionalValue === "light" != !!comparisonFlag) {
    clearSelection();
  }
  if (multiSelection.length) {
    clearSelection();
  }
  setActiveTool("select");
  renderLightLayerPanel();
  updateSelectionInspector();
  drawPlan();
  if (localValue !== activeSelectionLightGroupFilter()) {
    rebuildPreviewForAssetFilters(localValue);
  }
}
for (const e of m0) {
  e.addEventListener("click", () => setAssetCategoryFilter(e.dataset.assetCategory));
}
setAssetCategoryFilter("home");
Tg.addEventListener("click", () => {
  pushHistory();
  const has = new Set(floorSceneCurrent.lightGroups.map(name2 => name2.name));
  let computedValue = floorSceneCurrent.lightGroups.length + 1;
  while (has.has("灯组 " + computedValue)) {
    computedValue += 1;
  }
  const id = {
    id: makeId("light-group"),
    name: "灯组 " + computedValue,
    enabled: true
  };
  floorSceneCurrent.lightGroups.push(id);
  on = id.id;
  renderLightLayerPanel();
  updateSelectionInspector();
  scheduleSave();
});
fridgeSize.addEventListener("click", () => setAllLightGroupsEnabled(false));
for (const e of lightGroupContextMenu.querySelectorAll("[data-light-group-action]")) {
  e.addEventListener("click", () => {
    const lightGroup = floorSceneCurrent.lightGroups.find(item => item.id === lightGroupContextMenuId);
    const lightGroupAction = e.dataset.lightGroupAction;
    hideLightGroupContextMenu();
    if (lightGroup) {
      if (lightGroupAction === "rename") {
        _a = lightGroup.id;
        lightGroupRenameInput.value = lightGroup.name;
        Il.showModal();
        requestAnimationFrame(() => lightGroupRenameInput.select());
      } else if (lightGroupAction === "duplicate") {
        duplicateLightGroup(lightGroup);
      } else if (lightGroupAction === "delete") {
        deleteLightGroup(lightGroup);
      }
    }
  });
}
for (const e of floorContextMenu.querySelectorAll("[data-floor-action]")) {
  e.addEventListener("click", () => {
    const id = projectDocCurrent.floors.find(item => item.id === contextFloorId);
    const floorAction = e.dataset.floorAction;
    hideFloorContextMenu();
    if (id) {
      if (floorAction === "rename") {
        openFloorRenameDialog(id);
      } else if (floorAction === "delete") {
        confirmDeleteFloor(id);
      }
    }
  });
}
document.addEventListener("pointerdown", target => {
  if (!lightGroupContextMenu.hidden && !lightGroupContextMenu.contains(target.target)) {
    hideLightGroupContextMenu();
  }
  if (!floorContextMenu.hidden && !floorContextMenu.contains(target.target)) {
    hideFloorContextMenu();
  }
  if (!xr.hidden && !target.target.closest(".snap-control")) {
    setSnapSettingsOpen(false);
  }
});
function closeLightPropertyApplyDialog() {
  contextFloorId = "";
  bl.close();
}
selectEl("#floor-rename-close").addEventListener("click", closeLightPropertyApplyDialog);
selectEl("#floor-rename-cancel").addEventListener("click", closeLightPropertyApplyDialog);
bl.addEventListener("cancel", () => {
  contextFloorId = "";
});
toolEls.addEventListener("submit", domEvent => {
  domEvent.preventDefault();
  const name5 = projectDocCurrent.floors.find(floor => floor.id === contextFloorId);
  if (!name5) {
    closeLightPropertyApplyDialog();
    return;
  }
  const name = uniqueFloorName(normalizeLabelText(floorRenameInputCurrent.value, name5.name, 24), name5.id);
  if (name !== name5.name) {
    name5.name = name;
    renderFloorList();
    renderExportFileChecklist();
    scheduleSave();
    showToast("已重命名为“" + name + "”。", "success");
  }
  closeLightPropertyApplyDialog();
});
selectEl("#floor-delete-close").addEventListener("click", closeFloorDeleteDialog);
selectEl("#floor-delete-cancel").addEventListener("click", closeFloorDeleteDialog);
floorDeleteDialog.addEventListener("cancel", preventDefault => {
  preventDefault.preventDefault();
  closeFloorDeleteDialog();
});
activeToolLabel.addEventListener("submit", preventDefault => {
  preventDefault.preventDefault();
  executePendingFloorDelete();
});
function syncLightPropertySelectAll() {
  _a = "";
  Il.close();
}
selectEl("#light-group-rename-close").addEventListener("click", syncLightPropertySelectAll);
selectEl("#light-group-rename-cancel").addEventListener("click", syncLightPropertySelectAll);
Il.addEventListener("cancel", () => {
  _a = "";
});
Tf.addEventListener("submit", camera => {
  camera.preventDefault();
  const isClosest = floorSceneCurrent.lightGroups.find(floor => floor.id === _a);
  if (!isClosest) {
    syncLightPropertySelectAll();
    return;
  }
  const normalizedGroupName = normalizeLabelText(lightGroupRenameInput.value, isClosest.name, 24);
  if (normalizedGroupName !== isClosest.name) {
    pushHistory();
    isClosest.name = normalizedGroupName;
    refreshViews("none");
    scheduleSave();
  }
  syncLightPropertySelectAll();
});
function postAutoDiagramBusy() {
  Dr = null;
  Rl.close();
}
function buildStageReferenceScene(groupNameCandidate = wallFields) {
  return [...groupNameCandidate.querySelectorAll("[data-light-target-item-id]")];
}
function updateStageLightTargetSummary() {
  const length = buildStageReferenceScene();
  const lengthValue = length.filter(checked => checked.checked).length;
  windowFields.textContent = lengthValue + "/" + length.length + " 灯";
  ka.disabled = !length.length;
  ka.textContent = length.length && lengthValue === length.length ? "取消全选" : "全选";
  for (const lightTargetGroupEl of wallFields.querySelectorAll("[data-light-target-group-id]")) {
    const length = buildStageReferenceScene(lightTargetGroupEl);
    const lengthValue = length.filter(checked => checked.checked).length;
    lightTargetGroupEl.querySelector("[data-light-target-group-count]").textContent = lengthValue + "/" + length.length + " 灯";
    lightTargetGroupEl.querySelector("[data-light-target-group-toggle]").textContent = length.length && lengthValue === length.length ? "取消全选" : "全选";
  }
}
function renderLightPropertyTargetList(argPrimary) {
  wallFields.replaceChildren();
  let zeroValue = 0;
  for (const id2 of floorSceneCurrent.lightGroups) {
    const length = floorSceneCurrent.items.filter(type => set.has(type.type) && type.lightGroupId === id2.id);
    if (!length.length) {
      continue;
    }
    zeroValue += length.length;
    const className = document.createElement("section");
    className.className = "light-property-target-group";
    className.dataset.lightTargetGroupId = id2.id;
    const append = document.createElement("header");
    const textContent = document.createElement("strong");
    textContent.textContent = id2.name;
    const dataset = document.createElement("span");
    dataset.dataset.lightTargetGroupCount = "";
    const type = document.createElement("button");
    type.type = "button";
    type.dataset.lightTargetGroupToggle = "";
    type.textContent = "取消全选";
    append.append(textContent, dataset, type);
    const element = document.createElement("div");
    element.className = "light-property-target-grid";
    const get = new Map();
    for (const type of length) {
      get.set(type.type, (get.get(type.type) || 0) + 1);
    }
    const map = new Map();
    for (const type of length) {
      const name3 = furnitureCatalog[type.type] || furnitureCatalog.downlight;
      const computedValue = (map.get(type.type) || 0) + 1;
      map.set(type.type, computedValue);
      const className = document.createElement("label");
      className.className = "light-property-target-item";
      const typeCurrent = document.createElement("input");
      typeCurrent.type = "checkbox";
      typeCurrent.checked = true;
      typeCurrent.dataset.lightTargetItemId = type.id;
      const appendEl = document.createElement("span");
      const itemNameStrongEl = document.createElement("strong");
      itemNameStrongEl.textContent = get.get(type.type) > 1 ? name3.name + " " + computedValue : name3.name;
      const textContent = document.createElement("small");
      const localValue = clampLightPropertyValue(argPrimary, type[argPrimary], type.type);
      textContent.textContent = (type.id === selection?.id ? "当前灯 · " : "") + "当前 " + formatLightPropertyValue(argPrimary, localValue);
      appendEl.append(itemNameStrongEl, textContent);
      className.append(typeCurrent, appendEl);
      element.append(className);
    }
    className.append(append, element);
    wallFields.append(className);
  }
  if (!zeroValue) {
    const className = document.createElement("p");
    className.className = "light-property-target-empty";
    className.textContent = "当前没有可应用的灯具。";
    wallFields.append(className);
  }
  updateStageLightTargetSummary();
}
for (const e of list) {
  e.addEventListener("click", () => {
    const item = selectedEntity();
    const property = e.dataset.applyLightProperty;
    const propMeta = options[property];
    if (!item || selection?.kind !== "item" || !set.has(item.type) || !propMeta) {
      return;
    }
    const value = clampLightPropertyValue(property, selectEl(propMeta.input).value, item.type);
    Dr = {
      property,
      label: propMeta.label,
      value
    };
    Df.textContent = "应用" + propMeta.label;
    Ff.textContent = formatLightPropertyValue(property, value);
    renderLightPropertyTargetList(property);
    Rl.showModal();
    requestAnimationFrame(() => ka.focus());
  });
}
ka.addEventListener("click", () => {
  const length = buildStageReferenceScene();
  const element = !length.length || !length.every(checked => checked.checked);
  for (const checked of length) {
    checked.checked = element;
  }
  updateStageLightTargetSummary();
});
wallFields.addEventListener("click", target => {
  const groupToggleEl = target.target.closest("[data-light-target-group-toggle]");
  if (!groupToggleEl) {
    return;
  }
  const localValue = groupToggleEl.closest("[data-light-target-group-id]");
  const every = buildStageReferenceScene(localValue);
  const element = !every.every(checked => checked.checked);
  for (const checked of every) {
    checked.checked = element;
  }
  updateStageLightTargetSummary();
});
wallFields.addEventListener("change", updateStageLightTargetSummary);
selectEl("#light-property-apply-close").addEventListener("click", postAutoDiagramBusy);
selectEl("#light-property-apply-cancel").addEventListener("click", postAutoDiagramBusy);
Rl.addEventListener("cancel", () => {
  Dr = null;
});
Rf.addEventListener("submit", event => {
  event.preventDefault();
  if (!Dr) {
    postAutoDiagramBusy();
    return;
  }
  const {
    property: localValue,
    label: localValueCurrent,
    value: localValueNext
  } = Dr;
  const has = new Set(buildStageReferenceScene().filter(checked => checked.checked).map(datasetVar => datasetVar.dataset.lightTargetItemId));
  const length = floorSceneCurrent.items.filter(type => set.has(type.type) && has.has(type.id));
  if (!length.length) {
    showToast("请至少选择一盏灯。", "error");
    return;
  }
  const filtered = length.map(item => ({
    item,
    value: clampLightPropertyValue(localValue, localValueNext, item.type)
  })).filter(item => Math.abs(finite(item.item[localValue]) - item.value) > 0.000001);
  if (filtered.length) {
    pushHistory();
    for (const value of filtered) {
      value.item[localValue] = value.value;
    }
    refreshViews("lights");
    scheduleSave();
  }
  postAutoDiagramBusy();
  showToast("已将" + localValueCurrent + "应用到 " + length.length + " 盏灯。", "success");
});
for (const e of w0) {
  e.addEventListener("dragstart", dataTransfer => {
    dataTransfer.dataTransfer.effectAllowed = "copy";
    dataTransfer.dataTransfer.setData("application/x-ha-bridge-3d-item", e.dataset.itemType);
  });
  e.addEventListener("click", () => {
    const planPoint = screenToPlanWithView({
      x: planWidth / 2,
      y: planHeight / 2
    });
    placeCatalogFurnitureItem(e.dataset.itemType, planPoint);
  });
}
planStage.addEventListener("dragenter", relatedTarget => {
  if ([...relatedTarget.dataTransfer.types].includes("application/x-ha-bridge-3d-item")) {
    planStage.classList.add("dragging-item");
  }
});
planStage.addEventListener("dragover", event => {
  if ([...event.dataTransfer.types].includes("application/x-ha-bridge-3d-item")) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    planStage.classList.add("dragging-item");
  }
});
planStage.addEventListener("dragleave", relatedTarget => {
  if (!planStage.contains(relatedTarget.relatedTarget)) {
    planStage.classList.remove("dragging-item");
  }
});
planStage.addEventListener("drop", preventDefault => {
  preventDefault.preventDefault();
  planStage.classList.remove("dragging-item");
  const localValue = preventDefault.dataTransfer.getData("application/x-ha-bridge-3d-item");
  if (localValue) {
    placeCatalogFurnitureItem(localValue, screenToPlanWithView(pointerEventToCanvasPoint(preventDefault)));
  }
});
element.addEventListener("pointerdown", handlePlanPointerDown);
element.addEventListener("pointermove", queuePlanPointerMoveFrame);
element.addEventListener("pointerup", scheduleClearInspectorHover);
element.addEventListener("pointercancel", scheduleClearInspectorHover);
element.addEventListener("contextmenu", preventDefault => preventDefault.preventDefault());
element.addEventListener("wheel", preventDefault => {
  preventDefault.preventDefault();
  applyInspectorFields(preventDefault);
}, {
  passive: false
});
selectEl("#fit-view").addEventListener("click", fitPlanViewToContent);
selectEl("#rotate-plan-view").addEventListener("click", rotatePlanView);
selectEl("#zoom-in").addEventListener("click", () => zoomPlanViewAt(1.18));
selectEl("#zoom-out").addEventListener("click", () => zoomPlanViewAt(1 / 1.18));
selectEl("#reset-camera").addEventListener("click", applyCameraViewCurrent);
lg.addEventListener("click", saveCurrentCameraView);
fixedCameraView.addEventListener("click", restoreFixedCameraView);
ug.addEventListener("click", saveCurrentCameraView);
fixedOverviewView.addEventListener("click", restoreFixedCameraView);
exportSaveView.addEventListener("click", saveCurrentCameraView);
selectEl("#open-export").addEventListener("click", scheduleOrbitResumeAfterModels);
selectEl("#export-close").addEventListener("click", () => {
  if (!orbitSuspended) {
    exportDialog.close();
  }
});
exportDialog.addEventListener("cancel", preventDefault => {
  preventDefault.preventDefault();
  if (!orbitSuspended) {
    exportDialog.close();
  }
});
exportDialog.addEventListener("close", openExportDialog);
selectEl("#export-overwrite-close").addEventListener("click", () => resolveExportOverwrite("cancel"));
selectEl("#export-overwrite-cancel").addEventListener("click", () => resolveExportOverwrite("cancel"));
selectEl("#export-overwrite-rename").addEventListener("click", () => resolveExportOverwrite("rename"));
selectEl("#export-overwrite-confirm").addEventListener("click", () => resolveExportOverwrite("overwrite"));
exportOverwriteDialog.addEventListener("cancel", preventDefault => {
  preventDefault.preventDefault();
  resolveExportOverwrite("cancel");
});
const syncExportPresetEditor = () => {
  if (exportCompleteDialog.open) {
    exportCompleteDialog.close();
  }
};
selectEl("#export-complete-close").addEventListener("click", syncExportPresetEditor);
selectEl("#export-complete-confirm").addEventListener("click", syncExportPresetEditor);
h0.addEventListener("click", target => {
  const dataset = target.target.closest("[data-export-preset-slot]");
  if (dataset) {
    selectExportPresetIndex(Number(dataset.dataset.exportPresetSlot));
  }
});
f0.addEventListener("click", addExportPresetSlot);
g0.addEventListener("click", duplicateActiveExportPreset);
p0.addEventListener("click", removeActiveExportPreset);
selectEl("#export-preset-rename-close").addEventListener("click", closeExportPresetRenameDialog);
selectEl("#export-preset-rename-cancel").addEventListener("click", closeExportPresetRenameDialog);
exportPresetRenameDialog.addEventListener("cancel", preventDefault => {
  preventDefault.preventDefault();
  closeExportPresetRenameDialog();
});
detailsPanelEl.addEventListener("submit", preventDefault => {
  preventDefault.preventDefault();
  const length = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  const localValue = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, length.length);
  const name7 = length[localValue];
  if (!name7) {
    closeExportPresetRenameDialog();
    return;
  }
  const label = defaultExportPresetLabel(name7, localValue);
  const name = uniqueExportPresetLabel(exportPresetRenameInput.value, localValue);
  name7.name = name;
  projectDocCurrent.exportPresets = length;
  closeExportPresetRenameDialog();
  normalizeProjectExportPresets();
  scheduleSave();
  if (name !== label) {
    showToast("已重命名为“" + name + "”。", "success");
  }
});
selectEl("#export-preset-delete-close").addEventListener("click", closeExportPresetDeleteDialog);
selectEl("#export-preset-delete-cancel").addEventListener("click", closeExportPresetDeleteDialog);
exportPresetDeleteDialog.addEventListener("cancel", camera => {
  camera.preventDefault();
  closeExportPresetDeleteDialog();
});
vg.addEventListener("submit", camera => {
  camera.preventDefault();
  confirmExportPresetDelete();
});
exportDialog.addEventListener("input", camera => {
  if (!camera.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("change", target => {
  if (!target.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("click", target => {
  if (target.target?.closest?.("[data-camera-view], [data-camera-mode], [data-camera-rotate-top]")) {
    openExportPresetEditor();
  }
});
exportWidth.addEventListener("input", () => onExportDimensionInput("width"));
exportHeight.addEventListener("input", () => onExportDimensionInput("height"));
exportWidth.addEventListener("change", () => onExportDimensionInput("width", true));
exportHeight.addEventListener("change", () => onExportDimensionInput("height", true));
exportLockRatio.addEventListener("change", () => {
  const {
    width: localValue,
    height: resolution
  } = readExportResolution();
  if (exportLockRatio.checked) {
    Tn = localValue / resolution;
  }
  syncExportResolutionLabel();
});
selectEl("#export-use-fixed").addEventListener("click", applyStageFixedCameraView);
exportFloorSelect.addEventListener("change", () => setExportFloorScope(exportFloorSelect.value));
exportPackage.addEventListener("click", runExportPipeline);
function postAutoDiagramBaseReady(status = "ready") {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window && !!projectDocCurrent) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-base-lighting-state",
      componentId: autoDiagramComponentId,
      status: status,
      lighting: normalizeBaseLighting(baseLighting),
      savedLighting: normalizeBaseLighting(projectDocCurrent.baseLighting),
      defaults: normalizeBaseLighting(DEFAULT_BASE_LIGHTING)
    }, window.location.origin);
  }
}
function postAutoDiagramFloorState() {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window && !!projectDocCurrent) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-floor-state",
      componentId: autoDiagramComponentId,
      floors: projectDocCurrent.floors.map(item => ({
        id: item.id,
        name: item.name
      })),
      floorSelection: getPreviewFloorModeCurrent() === "all" ? "all" : activeFloor()?.id || activeFloorId
    }, window.location.origin);
  }
}
window.addEventListener("message", origin => {
  if (!isAutoDiagramEmbedCurrent || origin.origin !== window.location.origin || origin.source !== window.parent) {
    return;
  }
  const command = origin.data;
  if (!!command && command.componentId === autoDiagramComponentId) {
    if (command.type === "ha-bridge-floorplan-auto-diagram-floor") {
      if (command.command === "set-floor") {
        const id = projectDocCurrent.floors.find(itemKey => itemKey.id === command.value);
        const conditionalValue = command.value === "all" && projectDocCurrent.floors.length > 1 ? "all" : id?.id || activeFloor()?.id || activeFloorId;
        setExportFloorScope(conditionalValue);
        postAutoDiagramFloorState();
      }
      return;
    }
    if (command.type === "ha-bridge-floorplan-auto-diagram-base-lighting") {
      if (command.command === "request-state") {
        baseLightControls.hidden = true;
        applyBaseLighting(projectDocCurrent.baseLighting);
        postAutoDiagramBaseReady("ready");
      } else if (command.command === "preview") {
        baseLightControls.hidden = true;
        applyBaseLighting(command.lighting);
        postAutoDiagramBaseReady("preview");
      } else if (command.command === "reset") {
        baseLightControls.hidden = true;
        applyBaseLighting(DEFAULT_BASE_LIGHTING);
        postAutoDiagramBaseReady("preview");
      } else if (command.command === "save") {
        baseLightControls.hidden = true;
        applyBaseLighting(command.lighting);
        commitBaseLightingFromControls();
        postAutoDiagramBaseReady("saved");
      } else if (command.command === "cancel" || command.command === "close") {
        closeBaseLightControls();
        postAutoDiagramBaseReady("cancelled");
      } else {
        relocateBaseLightControls();
      }
      return;
    }
    if (command.type === "ha-bridge-floorplan-auto-diagram-camera") {
      const cameraView = activeCameraSettings();
      if (command.command === "restore") {
        const snapshot = command.value || {};
        cameraView.cameraMode = snapshot.mode === "perspective" ? "perspective" : "orthographic";
        cameraView.cameraView = snapshot.view === "top" ? "top" : "free";
        cameraView.cameraTopRotation = (Math.round(finite(snapshot.topRotation, 0) / 90) * 90 % 360 + 360) % 360;
        cameraView.cameraFocalLength = clamp(finite(snapshot.focalLength, 50), 18, 120);
        if (snapshot.snapshot) {
          applyStoredCameraPose(snapshot.snapshot, snapshot.snapshot.viewportAspect);
        } else {
          setCameraProjectionMode(cameraView.cameraMode, {
            preserveView: true
          });
          nudgeCamera(cameraView.cameraView, {
            force: true
          });
          applyCameraFocalLength();
        }
      } else if (command.command === "set-view") {
        cameraView.cameraView = command.value === "top" ? "top" : "free";
        nudgeCamera(cameraView.cameraView);
      } else if (command.command === "set-mode") {
        cameraView.cameraMode = command.value === "perspective" ? "perspective" : "orthographic";
        setCameraProjectionMode(cameraView.cameraMode);
      } else if (command.command === "rotate-top") {
        cameraView.cameraView = "top";
        cameraView.cameraTopRotation = (topViewRotation() + 90) % 360;
        nudgeCamera("top", {
          force: true
        });
      } else if (command.command === "set-focal-length") {
        cameraView.cameraFocalLength = clamp(finite(command.value, getCameraFocalLength()), 18, 120);
        applyCameraFocalLength();
      }
      requestRender();
      return;
    }
    if (command.type === "ha-bridge-floorplan-auto-diagram-generate" && !orbitSuspended) {
      for (const checked of exportDialog.querySelectorAll("input[data-export-file]")) {
        checked.checked = true;
      }
      exportFolderName.value = String(command.folderName || "").trim();
      exportWidth.value = String(Math.round(clamp(finite(command.width, exportWidth.value), 320, 4096)));
      exportHeight.value = String(Math.round(clamp(finite(command.height, exportHeight.value), 320, 4096)));
      exportLockRatio.checked = true;
      syncExportResolutionLabel();
      runExportPipeline();
    }
  }
});
for (const e of previewSyncEls) {
  e.addEventListener("click", () => {
    const flag = e.dataset.previewSync !== "manual";
    if (flag !== isLivePreviewEnabled()) {
      pushHistory();
      floorSceneCurrent.settings.livePreviewEnabled = flag;
      scheduleSave();
      syncLivePreviewButtons();
      if (flag) {
        rebuildPreviewMeshes({
          force: true
        });
      } else {
        markPreviewQualityDirty();
      }
    }
  });
}
refreshPreview.addEventListener("click", () => rebuildPreviewMeshes({
  force: true
}));
refreshLightPreview?.addEventListener("click", markPreviewQualityDirty);
detailsResizer.addEventListener("pointerdown", pointerId => {
  if (pointerId.button === 0) {
    detailsResizeDrag = {
      pointerId: pointerId.pointerId,
      startX: pointerId.clientX,
      startY: pointerId.clientY,
      startPreviewRatio: floorSceneCurrent.settings.previewPanelRatio,
      startWidthRatio: floorSceneCurrent.settings.detailsPanelWidthRatio
    };
    detailsPanelElCurrent.classList.add("resizing");
    studioShellEl.classList.add("resizing");
    detailsResizer.dataset.resizeAxis = "pending";
    detailsResizer.setPointerCapture(pointerId.pointerId);
  }
});
detailsResizer.addEventListener("pointermove", pointerId => {
  if (detailsResizeDrag?.pointerId === pointerId.pointerId) {
    if ((pointerId.buttons & 1) === 0) {
      callback(pointerId);
      return;
    }
    onDetailsResizePointerMove(pointerId);
  }
});
const callback = (pointerId, flag = true) => {
  if (!detailsResizeDrag || pointerId?.pointerId !== undefined && detailsResizeDrag.pointerId !== pointerId.pointerId) {
    return;
  }
  const pointerIdCurrent = detailsResizeDrag;
  detailsResizeDrag = null;
  const comparisonFlag = Math.abs(floorSceneCurrent.settings.previewPanelRatio - pointerIdCurrent.startPreviewRatio) > 0.0001 || Math.abs(floorSceneCurrent.settings.detailsPanelWidthRatio - pointerIdCurrent.startWidthRatio) > 0.0001;
  detailsPanelElCurrent.classList.remove("resizing");
  studioShellEl.classList.remove("resizing");
  delete detailsResizer.dataset.resizeAxis;
  if (flag) {
    try {
      if (detailsResizer.hasPointerCapture(pointerIdCurrent.pointerId)) {
        detailsResizer.releasePointerCapture(pointerIdCurrent.pointerId);
      }
    } catch {}
  }
  if (comparisonFlag) {
    scheduleSave();
  }
};
detailsResizer.addEventListener("pointerup", callback);
detailsResizer.addEventListener("pointercancel", callback);
detailsResizer.addEventListener("lostpointercapture", argPrimary => callback(argPrimary, false));
window.addEventListener("pointerup", callback, true);
window.addEventListener("pointercancel", callback, true);
window.addEventListener("blur", () => callback());
detailsResizer.addEventListener("keydown", signal => {
  const conditionalValue = signal.key === "ArrowUp" ? -0.03 : signal.key === "ArrowDown" ? 0.03 : 0;
  const value = signal.key === "ArrowLeft" ? 0.03 : signal.key === "ArrowRight" ? -0.03 : 0;
  if (!conditionalValue && !value) {
    return;
  }
  signal.preventDefault();
  const minimumHeightRatio = studioLayoutMetrics();
  floorSceneCurrent.settings.previewPanelRatio = clamp(floorSceneCurrent.settings.previewPanelRatio + conditionalValue, minimumHeightRatio.minimumHeightRatio, minimumHeightRatio.maximumHeightRatio);
  floorSceneCurrent.settings.detailsPanelWidthRatio = clamp(floorSceneCurrent.settings.detailsPanelWidthRatio + value, minimumHeightRatio.minimumWidthRatio, minimumHeightRatio.maximumWidthRatio);
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
  scheduleSave();
});
for (const e of cameraModeEls) {
  e.addEventListener("click", () => {
    const argPrimary = e.dataset.cameraMode === "perspective" ? "perspective" : "orthographic";
    if (argPrimary !== getCameraProjectionMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraMode = argPrimary;
      setCameraProjectionMode(argPrimary);
      if (stageSession) {
        exportStatus.textContent = argPrimary === "perspective" ? "已切换为透视构图" : "已切换为正交构图";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of cameraViewEls) {
  e.addEventListener("click", () => {
    const argPrimary = e.dataset.cameraView === "top" ? "top" : "free";
    if (argPrimary !== cameraViewMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraView = argPrimary;
      nudgeCamera(argPrimary);
      if (stageSession) {
        exportStatus.textContent = argPrimary === "top" ? "已切换为顶视构图" : "已切换为自由构图";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of cameraRotateTopEls) {
  e.addEventListener("click", () => {
    if (cameraViewMode() === "top") {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraTopRotation = (topViewRotation() + 90) % 360;
      nudgeCamera("top", {
        force: true
      });
      if (stageSession) {
        exportStatus.textContent = "顶视已旋转 " + topViewRotation() + "°";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of cameraFocalLengthEls) {
  e.addEventListener("change", () => {
    const clampCurrent = clamp(finite(e.value, getCameraFocalLength()), 18, 120);
    for (const value of cameraFocalLengthEls) {
      value.value = String(Math.round(clampCurrent));
    }
    if (!(Math.abs(clampCurrent - getCameraFocalLength()) < 1e-8)) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraFocalLength = clampCurrent;
      applyCameraFocalLength();
      if (stageSession) {
        exportStatus.textContent = "焦段已设为 " + Math.round(clampCurrent) + " mm";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of baseLightControlEls) {
  e.addEventListener("input", () => onBaseLightControlInput(e));
  e.addEventListener("change", () => {
    onBaseLightControlInput(e);
    syncBaseLightingControls();
  });
}
for (const e of sg) {
  e.addEventListener("click", relocateBaseLightControls);
}
ag?.addEventListener("click", closeBaseLightControls);
rg?.addEventListener("click", commitBaseLightingFromControls);
ig?.addEventListener("click", () => {
  applyBaseLighting(DEFAULT_BASE_LIGHTING);
});
baseLightControlsHeader?.addEventListener("pointerdown", pointerId => {
  if (pointerId.button !== 0 || pointerId.target.closest("button")) {
    return;
  }
  const left = baseLightControls.getBoundingClientRect();
  lightCacheTileMap = {
    pointerId: pointerId.pointerId,
    startX: pointerId.clientX,
    startY: pointerId.clientY,
    startLeft: left.left,
    startTop: left.top,
    moved: false
  };
  try {
    baseLightControlsHeader.setPointerCapture(pointerId.pointerId);
  } catch {}
});
baseLightControlsHeader?.addEventListener("pointermove", pointerId => {
  if (!lightCacheTileMap || pointerId.pointerId !== lightCacheTileMap.pointerId) {
    return;
  }
  const computedValue = pointerId.clientX - lightCacheTileMap.startX;
  const value = pointerId.clientY - lightCacheTileMap.startY;
  if (!lightCacheTileMap.moved && Math.hypot(computedValue, value) < 4) {
    return;
  }
  lightCacheTileMap.moved = true;
  pointerId.preventDefault();
  const width = baseLightControls.getBoundingClientRect();
  const localValue = Math.max(8, window.innerWidth - width.width - 8);
  const max = Math.max(8, window.innerHeight - width.height - 8);
  baseLightControls.style.right = "auto";
  baseLightControls.style.left = clamp(lightCacheTileMap.startLeft + computedValue, 8, localValue) + "px";
  baseLightControls.style.top = clamp(lightCacheTileMap.startTop + value, 8, max) + "px";
});
const fh = pointerId => {
  if (!!lightCacheTileMap && pointerId.pointerId === lightCacheTileMap.pointerId) {
    lightCacheTileMap = null;
  }
};
baseLightControlsHeader?.addEventListener("pointerup", fh);
baseLightControlsHeader?.addEventListener("pointercancel", fh);
baseLightingChannel?.addEventListener("message", data => {
  if (data.data?.type !== "base-lighting-saved") {
    return;
  }
  const baseLighting = normalizeBaseLighting(data.data.lighting);
  if (projectDocCurrent) {
    projectDocCurrent.baseLighting = baseLighting;
  }
  applyBaseLighting(baseLighting);
});
snapToggle.addEventListener("click", () => {
  pushHistory();
  floorSceneCurrent.settings.snapEnabled = floorSceneCurrent.settings.snapEnabled === false;
  syncSnapUi();
  updatePlanStatusChrome();
  drawPlan();
  scheduleSave();
});
Qd.addEventListener("click", stopPropagationVar => {
  stopPropagationVar.stopPropagation();
  setSnapSettingsOpen(xr.hidden);
});
xr.addEventListener("pointerdown", stopPropagation => stopPropagation.stopPropagation());
for (const e of snapSettingEls) {
  e.addEventListener("change", () => {
    pushHistory();
    floorSceneCurrent.settings[e.dataset.snapSetting] = e.checked;
    updatePlanStatusChrome();
    drawPlan();
    scheduleSave();
  });
}
snapTolerance.addEventListener("input", () => {
  jd.textContent = snapTolerance.value + " px";
});
snapTolerance.addEventListener("change", () => {
  const snapToleranceCurrent = clamp(Math.round(finite(snapTolerance.value, 13)), 6, 24);
  if (snapToleranceCurrent !== floorSceneCurrent.settings.snapTolerance) {
    pushHistory();
    floorSceneCurrent.settings.snapTolerance = snapToleranceCurrent;
    syncSnapUi();
    updatePlanStatusChrome();
    drawPlan();
    scheduleSave();
  }
});
yr.addEventListener("click", () => schedulePlanRedraw());
Kd.addEventListener("click", deleteCurrentSelection);
selectEl("#scale-close").addEventListener("click", () => {
  shiftKeyHeld = null;
  lightPropertyApplyTitle.close();
  drawPlan();
});
selectEl("#scale-cancel").addEventListener("click", () => {
  shiftKeyHeld = null;
  lightPropertyApplyTitle.close();
  setActiveTool("scale");
});
lightPropertyApplyValue.addEventListener("submit", preventDefault => {
  preventDefault.preventDefault();
  if (!shiftKeyHeld) {
    return;
  }
  const meters = finite(toast.value, 0);
  const localValue = distance(shiftKeyHeld.start, shiftKeyHeld.end);
  if (meters <= 0 || localValue <= 0) {
    showToast("请输入有效的真实长度。", "error");
    return;
  }
  pushHistory();
  floorSceneCurrent.calibration = {
    pixelsPerMeter: localValue / meters,
    reference: {
      ...shiftKeyHeld,
      meters
    }
  };
  shiftKeyHeld = null;
  lightPropertyApplyTitle.close();
  setActiveTool("wall");
  refreshViews();
  applyCameraViewCurrent();
  scheduleSave();
  const id = activeFloor();
  if (projectDocCurrent.floors.findIndex(id => id.id === id?.id) > 0 && id?.alignmentPending) {
    requestAnimationFrame(() => startAlignFloorSession());
    showToast("比例已标定，接下来设置上下楼层的参照点。");
  } else {
    showToast("比例已标定，可以沿着底图连续描墙了。");
  }
});
for (const e of [selectEl("#wall-height"), selectEl("#wall-thickness"), selectEl("#wall-opacity-mode"), selectEl("#wall-opacity"), selectEl("#wall-open-end-mode")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("wall"));
}
for (const e of [selectEl("#window-width"), selectEl("#window-height"), selectEl("#window-sill"), selectEl("#window-divider")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("window"));
}
for (const e of [selectEl("#door-type"), selectEl("#door-width"), selectEl("#door-height")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("door"));
}
for (const e of [selectEl("#railing-width"), selectEl("#railing-height")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("railing"));
}
for (const e of [selectEl("#item-x"), selectEl("#item-y"), selectEl("#item-width"), selectEl("#item-height"), selectEl("#item-depth"), selectEl("#item-elevation"), selectEl("#item-rotation"), selectEl("#item-vertical-rotation"), itemStripRoll]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("item"));
}
zl.addEventListener("change", () => applyInspectorFieldsCurrent("item"));
for (const e of [selectEl("#label-title"), selectEl("#label-title-spacing"), selectEl("#label-subtitle"), selectEl("#label-subtitle-spacing"), selectEl("#label-line-length")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("item"));
}
for (const e of [selectEl("#light-group"), selectEl("#light-temperature"), selectEl("#light-brightness"), selectEl("#light-range"), selectEl("#light-angle")]) {
  e.addEventListener("change", () => applyInspectorFieldsCurrent("item"));
}
selectEl("#curtain-position").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#round-table-turntable").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#stair-direction").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#tv-mount-style").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
o0.addEventListener("click", () => {
  const door = selectedEntity();
  if (!!door && selection?.kind === "item" && door.type === "shoecabinet") {
    pushHistory();
    door.shoeCabinetMirrored = door.shoeCabinetMirrored !== true;
    refreshViews(itemPreviewScope(door));
    scheduleSave();
  }
});
selectionInspector.addEventListener("submit", preventDefault => preventDefault.preventDefault());
selectEl("#door-hinge").addEventListener("click", () => {
  const flag = selectedEntity();
  if (!!flag && selection?.kind === "door" && !["double", "entry", "sliding-glass", "roller-shutter"].includes(flag.doorType)) {
    pushHistory();
    flag.hinge = flag.hinge === "right" ? "left" : "right";
    refreshViews();
    scheduleSave();
  }
});
selectEl("#door-swing").addEventListener("click", () => {
  const swing = selectedEntity();
  if (!!swing && selection?.kind === "door" && !["entry", "sliding-glass", "frame-only"].includes(swing.doorType)) {
    pushHistory();
    swing.swing = swing.swing === -1 ? 1 : -1;
    refreshViews();
    scheduleSave();
  }
});
for (const e of document.querySelectorAll("[data-rotate]")) {
  e.addEventListener("click", () => {
    const item = selectedEntity();
    if (!item || selection?.kind !== "item") {
      return;
    }
    pushHistory();
    const value = item.rotation + Number(e.dataset.rotate);
    item.rotation = item.type === "striplight" ? normalizeFullRotation(value) : value % 360;
    refreshViews(itemPreviewScope(item));
    scheduleSave();
  });
}
window.addEventListener("keydown", key => {
  if (isStageEmbed || key.defaultPrevented || exportDialog.open) {
    return;
  }
  if (key.key === "Escape" && !xr.hidden) {
    setSnapSettingsOpen(false);
    return;
  }
  const computedValue = key.target instanceof HTMLInputElement || key.target instanceof HTMLTextAreaElement || lightPropertyApplyTitle.open;
  if (key.code === "Space" && !computedValue) {
    saveConflictState = true;
    key.preventDefault();
  }
  if (key.key.toLowerCase() === "s" && !computedValue) {
    Or = true;
    updatePlanStatusChrome();
    drawPlan();
  }
  if (computedValue) {
    return;
  }
  if (key.key === "Shift" && !dragState && (activeTool === "scale" || activeTool === "wall")) {
    zr = true;
    updatePlanStatusChrome();
    drawPlan();
  }
  const metaKey = key.metaKey || key.ctrlKey;
  if (metaKey && key.key.toLowerCase() === "z") {
    key.preventDefault();
    if (key.shiftKey) {
      redoEdit();
    } else {
      undoEdit();
    }
    return;
  }
  if (metaKey && key.key.toLowerCase() === "d") {
    key.preventDefault();
    selectedItemIds();
    return;
  }
  if (metaKey && key.key.toLowerCase() === "c") {
    key.preventDefault();
    copySelectedItems();
    return;
  }
  if (metaKey && key.key.toLowerCase() === "v") {
    key.preventDefault();
    pasteClipboardItems();
    return;
  }
  if (key.key === "Delete" || key.key === "Backspace") {
    key.preventDefault();
    deleteCurrentSelection();
    return;
  }
  const x42 = {
    ArrowLeft: {
      x: -1,
      y: 0
    },
    ArrowRight: {
      x: 1,
      y: 0
    },
    ArrowUp: {
      x: 0,
      y: -1
    },
    ArrowDown: {
      x: 0,
      y: 1
    }
  }[key.key];
  if (x42 && !metaKey) {
    const length = selection?.kind === "item" ? [selection.id] : multiSelection.filter(kind => kind.kind === "item").map(id => id.id);
    if (length.length) {
      key.preventDefault();
      if (!key.repeat) {
        pushHistory();
      }
      const computedValue = (key.altKey ? 0.01 : key.shiftKey ? 0.25 : 0.05) * (pixelsPerMeter() || 1);
      const has = new Set(length);
      for (const id of floorSceneCurrent.items) {
        if (has.has(id.id)) {
          id.x += x42.x * computedValue;
          id.y += x42.y * computedValue;
        }
      }
      refreshViews(activeSelectionAssetCategory());
      scheduleSave();
      return;
    }
  }
  if (key.key === "Escape") {
    if (activeTool === "flooropening" || dragState?.type === "draw-flooropening") {
      key.preventDefault();
      if (dragState?.type === "draw-flooropening") {
        try {
          element.releasePointerCapture(dragState.pointerId);
        } catch {}
        dragState = null;
        scheduleLeaveStudio();
      }
      setActiveTool("select");
      return;
    }
    if (alignSession) {
      key.preventDefault();
      cancelAlignFloorSession();
      return;
    }
    hideLightGroupContextMenu();
    schedulePlanRedraw();
    const localValue = activeSelectionLightGroupFilter();
    clearSelection();
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(localValue);
  }
});
window.addEventListener("keyup", event => {
  if (event.code === "Space") {
    saveConflictState = false;
  }
  if (event.key.toLowerCase() === "s") {
    Or = false;
    updatePlanStatusChrome();
    drawPlan();
  }
  if (event.key === "Shift") {
    zr = false;
    updatePlanStatusChrome();
    drawPlan();
  }
});
window.addEventListener("blur", () => {
  saveConflictState = false;
  zr = false;
  Or = false;
});
window.addEventListener("beforeunload", preventDefault => {
  if (saveGeneration !== savedGeneration) {
    preventDefault.preventDefault();
    preventDefault.returnValue = "";
  }
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    requestRender();
  }
});
if (new URLSearchParams(window.location.search).has("model-export")) {
  window.__haBridgeExportFurnitureJson = (type, options = {}) => {
    const size = furnitureCatalog[type];
    if (!size) {
      throw new Error("Unknown furniture type: " + type);
    }
    const sizeCurrent = {
      id: "offline-export-" + type,
      type,
      width: size.width,
      height: size.height,
      depth: size.depth,
      elevation: size.elevation || 0,
      rotation: 0,
      curtainPosition: "split",
      roundTableTurntable: false,
      stairDirection: "right",
      shoeCabinetMirrored: false,
      tvMountStyle: "standard",
      screenEnabled: true,
      offlineModelExport: true,
      ...options
    };
    const object3d = buildStudioItemMeshGroup(sizeCurrent);
    object3d.name = "ha-bridge-v1-" + type;
    object3d.updateMatrixWorld(true);
    const value = object3d.toJSON();
    disposeObject3dResources(object3d);
    return value;
  };
  const o = new URLSearchParams(window.location.search).get("model-export");
  if (o && o !== "1") {
    const n = {
      curtain_left: {
        type: "curtain",
        curtainPosition: "left"
      },
      curtain_right: {
        type: "curtain",
        curtainPosition: "right"
      },
      curtain_split: {
        type: "curtain",
        curtainPosition: "split"
      },
      rounddiningtable_turntable: {
        type: "rounddiningtable",
        roundTableTurntable: true
      },
      tv_standard: {
        type: "tv",
        tvMountStyle: "standard"
      },
      tv_tabletop: {
        type: "tv",
        tvMountStyle: "tabletop"
      },
      tv_mobile: {
        type: "tv",
        tvMountStyle: "mobile"
      }
    }[o] || {};
    const i = n.type || o;
    requestAnimationFrame(() => {
      try {
        const id = document.createElement("textarea");
        id.id = "ha-bridge-model-export";
        id.hidden = true;
        const value = JSON.stringify(window.__haBridgeExportFurnitureJson(i, n));
        id.value = value;
        id.textContent = value;
        document.body.append(id);
        document.documentElement.dataset.modelExportReady = o;
      } catch (error) {
        document.documentElement.dataset.modelExportError = error?.message || String(error);
      }
    });
  }
}
const materialTestTypeQueryCurrent = new URLSearchParams(window.location.search).get("material-test");
if (materialTestTypeQueryCurrent) {
  (async () => {
    const object3d = new THREE.Group();
    try {
      document.documentElement.dataset.materialTestStage = "loading";
      const size = furnitureCatalog[materialTestTypeQueryCurrent];
      if (!size || !ALL_ITEM_MODELS[materialTestTypeQueryCurrent]) {
        throw new Error("Unsupported material test type: " + materialTestTypeQueryCurrent);
      }
      if (!(await loadExternalItemModel(materialTestTypeQueryCurrent))) {
        throw new Error("Material test model failed to load: " + materialTestTypeQueryCurrent);
      }
      document.documentElement.dataset.materialTestStage = "renderer";
      for (let value = 0; !renderer && value < 120; value += 1) {
        await yieldToScheduler();
      }
      if (!renderer || !cameraCurrent || !previewSceneCurrent) {
        throw new Error("Material test renderer was not initialized");
      }
      const list = [];
      for (let value = 0; value < 3; value += 1) {
        const group = {
          id: "material-test-" + materialTestTypeQueryCurrent + "-" + (value + 1),
          type: materialTestTypeQueryCurrent,
          width: size.width,
          height: size.height,
          depth: size.depth,
          elevation: 0,
          rotation: 0
        };
        const object3dCurrent = new THREE.Group();
        if (!attachExternalItemModel(object3dCurrent, group)) {
          throw new Error("Material test model was not mounted: " + materialTestTypeQueryCurrent);
        }
        object3dCurrent.traverse(object3d => {
          if (!object3d.isMesh) {
            return;
          }
          const material = Array.isArray(object3d.material) ? object3d.material : [object3d.material];
          list.push(...material.filter(Boolean));
        });
        object3d.add(object3dCurrent);
      }
      document.documentElement.dataset.materialTestStage = "compiling";
      renderer.compile(object3d, cameraCurrent, previewSceneCurrent);
      const unique = new Set(list).size;
      for (let value = 0; value < 600; value += 1) {
        const active = manager.modelLoadState();
        if (active.active === 0 && active.queued === 0) {
          break;
        }
        await yieldToScheduler();
      }
      const materials = manager.modelLoadState();
      const models = {
        models: 3,
        slots: list.length,
        unique,
        shared: list.length - unique,
        cacheMaterials: materials.materials,
        cacheReuses: materials.materialReuses
      };
      document.documentElement.dataset.materialTestStats = JSON.stringify(models);
      const id = document.createElement("output");
      id.id = "ha-bridge-material-test-output";
      id.setAttribute("aria-live", "polite");
      id.textContent = "材质测试 " + materialTestTypeQueryCurrent + "：" + models.models + " 个模型，" + models.slots + " 个材质槽，" + models.unique + " 种唯一材质，" + models.shared + " 个槽复用；当前缓存 " + models.cacheMaterials + " 种，累计复用 " + models.cacheReuses + " 次。";
      document.body.append(id);
      document.documentElement.dataset.materialTestReady = materialTestTypeQueryCurrent;
      document.documentElement.dataset.materialTestStage = "ready";
    } catch (error) {
      document.documentElement.dataset.materialTestError = error?.message || String(error);
      document.documentElement.dataset.materialTestStage = "error";
    } finally {
      disposeObject3dResources(object3d);
    }
  })();
}
const instanceTestTypeQueryCurrent = new URLSearchParams(window.location.search).get("instance-test");
if (instanceTestTypeQueryCurrent) {
  const e = new THREE.Group();
  const o = new THREE.BoxGeometry(0.5, 0.86, 0.5);
  try {
    if (skipInstanceMergeTypes.has(instanceTestTypeQueryCurrent)) {
      throw new Error("Unsupported instance test type: " + instanceTestTypeQueryCurrent);
    }
    const t = [];
    for (let i = 0; i < 3; i += 1) {
      const r = {
        id: "instance-test-" + instanceTestTypeQueryCurrent + "-" + (i + 1),
        type: instanceTestTypeQueryCurrent
      };
      const l = new THREE.Group();
      const a = new THREE.Mesh(o, new THREE.MeshStandardMaterial({
        color: themeColors.furniture,
        roughness: 0.72
      }));
      a.position.y = 0.43;
      a.userData.externalModelSharedGeometry = true;
      l.position.x = i * 0.9;
      l.rotation.y = THREE.MathUtils.degToRad(i * 30);
      l.add(a);
      e.add(l);
      t.push({
        item: r,
        group: l
      });
    }
    const n = mergeStaticItemInstanceBatches(e, t);
    document.documentElement.dataset.instanceTestStats = JSON.stringify(n);
    document.documentElement.dataset.instanceTestReady = instanceTestTypeQueryCurrent;
  } catch (error) {
    document.documentElement.dataset.instanceTestError = error?.message || String(error);
  } finally {
    disposeObject3dResources(e);
    o.dispose();
  }
}
new ResizeObserver(resizePlanCanvas).observe(planStage);
initializeStudioSelects();
initializeNumberInputs();
syncBaseLightingControls();
async function waitUntilPreviewQualityReady() {
  if (!isPreviewQualityReady()) {
    return;
  }
  scheduleAdaptiveQuality(0);
  const computedValue = performance.now() + 1800;
  while (isPreviewQualityReady() && (!lightCacheReady || previewQualityJustBecameReady || previewLightCache.hidden) && performance.now() < computedValue) {
    await new Promise(requestAnimationFrame);
  }
}
function bootstrapStudioFromLoadedProject() {
  if (renderer.debug) {
    renderer.debug.checkShaderErrors = false;
  }
  const combinedFixedCameraView = normalizeProjectDocument(hasProjectLoadedCurrent.referenceScene || hasProjectLoadedCurrent.scene);
  let localValue = null;
  const entryMap = new Map();
  const reusedTransitions = {
    reusedTransitions: 0,
    rebuiltTransitions: 0,
    reusedFloors: 0
  };
  let emptyText = "";
  let cacheEpoch = 0;
  const helperFn = node => {
    releaseRoot?.releaseRoot?.(node.node);
    studioReady?.releaseRoot?.(node.node);
    disposeObject3dResources(node.node);
  };
  const callback = (has = null) => {
    if (!has) {
      cacheEpoch++;
    }
    for (const [localValue, localValueCurrent] of entryMap) {
      if (!has || !!has.has(localValue)) {
        helperFn(localValueCurrent);
        entryMap.delete(localValue);
      }
    }
  };
  function release(node) {
    if (!node.cacheKey || node.cacheEpoch !== cacheEpoch) {
      return false;
    }
    const idValue = node.id;
    const entry = entryMap.get(idValue);
    if (entry && entry.node !== node.node) {
      helperFn(entry);
    }
    node.node.position.set(0, 0, 0);
    node.node.quaternion.identity();
    node.node.scale.set(1, 1, 1);
    node.node.updateMatrixWorld(true);
    entryMap.delete(idValue);
    entryMap.set(idValue, node);
    studioReady?.retainRoot?.(node.node);
    releaseRoot?.retainRoot?.(node.node);
    while (entryMap.size > 8) {
      const inputValue = entryMap.keys().next().value;
      helperFn(entryMap.get(inputValue));
      entryMap.delete(inputValue);
    }
    return true;
  }
  baseLightingChannel?.close();
  baseLightingChannel = null;
  let releaseRoot = null;
  let setRoot = null;
  let localValueCurrent = null;
  let boolFlag = false;
  let localValueNext;
  let localValuePrevious;
  let push = [];
  let list = [];
  let arrayValue = [];
  let arrayValueCurrent = [];
  let boolTrue = true;
  let enabled = false;
  let localValueLocal;
  let localValueItem;
  let pushCurrent = [];
  let localValueEntry;
  let cloneCurrent;
  let localValueList;
  let flag = false;
  let localValueText;
  let localValueValue;
  let localValueSource = null;
  const excludeModelLayers = new Set(["items", "lights"]);
  let stringValue = "free";
  let enablePan = true;
  let enableZoom = true;
  let boolFlagCurrent = false;
  let boolFlagNext = false;
  let zeroValue = 0;
  let text = "";
  let height = null;
  const camera = new THREE.OrthographicCamera();
  const aspectCurrent = new THREE.PerspectiveCamera();
  const motion = {
    matrix: new THREE.Matrix4()
  };
  const x54 = new THREE.Vector2();
  function computeCameraViewHeight(zoom) {
    if (zoom.mode !== "perspective") {
      return Math.max(1, zoom.frameSize || 10) / zoom.zoom / Math.min(1, Math.max(0.1, cameraCurrent.userData.viewportAspect || 1));
    } else {
      aspectCurrent.aspect = cameraCurrent.userData.viewportAspect || 1;
      aspectCurrent.zoom = zoom.zoom;
      aspectCurrent.setFocalLength(zoom.focalLength || 50);
      return new THREE.Vector3().fromArray(zoom.position).distanceTo(new THREE.Vector3().fromArray(zoom.target)) * 2 * Math.tan(THREE.MathUtils.degToRad(aspectCurrent.getEffectiveFOV()) / 2);
    }
  }
  function blendCameraProjectionMatrices() {
    if (!height) {
      return;
    }
    const distance = Math.max(0.000001, cameraCurrent.position.distanceTo(orbitControls.target));
    const max = Math.max(0.000001, height.height);
    const aspect = cameraCurrent.userData.viewportAspect || 1;
    const weight = height.weight;
    const enabled = cameraCurrent.view;
    const rect = camera.view;
    const comparisonFlag = enabled === rect || enabled && rect && enabled.enabled === rect.enabled && enabled.fullWidth === rect.fullWidth && enabled.fullHeight === rect.fullHeight && enabled.offsetX === rect.offsetX && enabled.offsetY === rect.offsetY && enabled.width === rect.width && enabled.height === rect.height;
    if (motion.motion === height && motion.camera === cameraCurrent && motion.distance === distance && motion.height === max && motion.aspect === aspect && motion.weight === weight && motion.near === cameraCurrent.near && motion.far === cameraCurrent.far && comparisonFlag && motion.matrix.equals(cameraCurrent.projectionMatrix)) {
      return;
    }
    Object.assign(camera, {
      left: -max * aspect / 2,
      right: max * aspect / 2,
      top: max / 2,
      bottom: -max / 2,
      near: cameraCurrent.near,
      far: cameraCurrent.far,
      zoom: 1
    });
    Object.assign(aspectCurrent, {
      fov: THREE.MathUtils.radToDeg(Math.atan(max / (distance * 2)) * 2),
      aspect,
      near: cameraCurrent.near,
      far: cameraCurrent.far,
      zoom: 1
    });
    for (const view of [camera, aspectCurrent]) {
      view.view = cameraCurrent.view ? {
        ...cameraCurrent.view
      } : null;
      view.updateProjectionMatrix();
    }
    const localValue = camera.projectionMatrix.elements;
    const elements = aspectCurrent.projectionMatrix.elements;
    for (let zeroValue = 0; zeroValue < 16; zeroValue++) {
      cameraCurrent.projectionMatrix.elements[zeroValue] = localValue[zeroValue] * (1 - weight) + elements[zeroValue] / distance * weight;
    }
    cameraCurrent.projectionMatrixInverse.copy(cameraCurrent.projectionMatrix).invert();
    motion.motion = height;
    motion.camera = cameraCurrent;
    motion.distance = distance;
    motion.height = max;
    motion.aspect = aspect;
    motion.weight = weight;
    motion.near = cameraCurrent.near;
    motion.far = cameraCurrent.far;
    motion.matrix.copy(cameraCurrent.projectionMatrix);
  }
  const size = new Map();
  const sizeCurrent = new Map();
  let count = 0;
  let zeroValueCurrent = 0;
  let localValueTarget = null;
  let boolFlagPrevious = false;
  let boolFlagLocal = false;
  let localValueDefault = null;
  let localValueFallback;
  let localValuePending;
  let boolFlagItem = false;
  let get = new Map();
  let getCurrent = new Map();
  const objectValue = {
    restore: () => tickLightTransitionStates(performance.now(), true)
  };
  function setStageWarmupActive(argPrimary) {
    if (localValueDefault !== null) {
      window.clearTimeout(localValueDefault);
    }
    localValueDefault = null;
    if (argPrimary) {
      if (isStageWarmup) {
        return;
      }
      isStageWarmup = true;
      qualityProbeStartMs = 0;
      setPreviewPixelRatio(true, {
        preserveLightCache: true
      });
    } else if (isStageWarmup) {
      localValueDefault = window.setTimeout(() => {
        localValueDefault = null;
        isStageWarmup = false;
        checkAdaptiveQuality();
        qualityProbeStartMs = 0;
        setPreviewPixelRatio(previewOrbitLocked, {
          preserveLightCache: true
        });
      }, 140);
    }
  }
  function normalizedLightBrightness(type, argSecondary) {
    const computedValue = clamp(finite(argSecondary, 0), 0, 100) / 100;
    if (yt) {
      return computedValue;
    } else if (type.type === "striplight") {
      return Math.pow(computedValue, 0.82);
    } else {
      return spotLightBrightnessResponse(type.type, computedValue);
    }
  }
  function estimateLightRenderIntensity(type) {
    const range = defaultLightPresets[type.type] || defaultLightPresets.downlight;
    const computedValue = deferExternalModels[type.type] || 1.1;
    if (type.type !== "striplight") {
      return (type.type === "ceilinglight" ? 680 : 520) * computedValue;
    }
    const clampedValue = clamp(finite(type.lightRange, range.range), 0.5, 10);
    const localValue = Math.max(finite(type.elevation, 2.7), 0.4);
    return clamp(clampedValue / range.range, 0.45, 1.65) * 48 * clamp(Math.max(1, Math.pow(localValue / 2.7, 2)), 1, 4) * computedValue;
  }
  function applySampledLightState(intensity, intensityCurrent) {
    intensity.intensity = intensityCurrent.intensity;
    intensity.color.fromArray(intensityCurrent.color);
    intensity.visible = intensityCurrent.intensity > 0.000001 || !intensityCurrent.complete;
  }
  function tickLightTransitionStates(argPrimary, flag = false) {
    if (isCapturingFrame === objectValue) {
      if (localValueFallback !== worldGroup || localValuePending !== worldGroup?.children[0]) {
        localValueFallback = worldGroup;
        localValuePending = worldGroup?.children[0];
        get = collectWorldItemKeys();
        getCurrent = new Map(collectVisibleLights().map(itemKey => [itemKey.itemKey, itemKey]));
        boolFlagItem = true;
      }
      if (flag || boolFlagItem) {
        for (const [localValue, localValueCurrent] of get) {
          const entry = getCurrent.get(localValue);
          if (!entry) {
            continue;
          }
          const visible = entry.group?.enabled !== false && entry.item.lightBrightness > 0;
          for (const intensity of localValueCurrent) {
            intensity.intensity = visible ? finite(intensity.userData.lightOnIntensity, 0) : 0;
            intensity.visible = visible;
            intensity.color.setHex(lightEffectColorHex(entry.item.lightTemperature));
          }
        }
      }
      boolFlagItem = false;
    }
    for (const [localValue, localValueCurrent] of size) {
      applySampledLightState(localValue, sampleLightTransition(localValueCurrent, argPrimary));
    }
  }
  function smoothstepLerp(duration, argSecondary) {
    const conditionalValue = duration.duration ? clamp((argSecondary - duration.started) / duration.duration, 0, 1) : 1;
    return duration.from + (duration.to - duration.from) * conditionalValue * conditionalValue * (3 - conditionalValue * 2);
  }
  function stopOverlayFadeLoop() {
    if (count) {
      cancelAnimationFrame(count);
    }
    count = 0;
    sizeCurrent.clear();
    rs = false;
  }
  function tickOverlayFadeFrame(argPrimary) {
    count = 0;
    if (!lightCacheReady || previewQualityJustBecameReady || previewLightCache.hidden || isCapturingFrame) {
      stopOverlayFadeLoop();
      return;
    }
    for (const [localValue, started] of sizeCurrent) {
      pendingModelLoads.set(localValue, smoothstepLerp(started, argPrimary));
      if (argPrimary >= started.started + started.duration) {
        sizeCurrent.delete(localValue);
      }
    }
    rs = sizeCurrent.size > 0;
    blitLightCacheToOverlay();
    if (sizeCurrent.size) {
      count = requestAnimationFrame(tickOverlayFadeFrame);
    }
  }
  function beginOverlayFade(valuesVar, immediate, argTertiary) {
    if (!lightCacheReady || previewQualityJustBecameReady || isBakingLightCache || previewLightCache.hidden || isCapturingFrame || boolFlagCurrent || boolFlagNext) {
      return false;
    }
    const every = [...valuesVar.values()].filter(floorId => getPreviewFloorModeCurrent() === "all" || floorId.floorId === activeFloorId);
    if (!every.every(item => item.previousBrightness === item.item.lightBrightness && item.previousKelvin === item.item.lightTemperature && map.has(previewScopedItemKey(item.floorId, item.item.lightGroupId)))) {
      return false;
    }
    const started = performance.now();
    for (const wasOn of every) {
      const localValue = previewScopedItemKey(wasOn.floorId, wasOn.item.lightGroupId);
      const entry = sizeCurrent.get(localValue);
      const from = entry ? smoothstepLerp(entry, started) : finite(pendingModelLoads.get(localValue), wasOn.wasOn ? 1 : 0);
      sizeCurrent.set(localValue, {
        from: from,
        to: wasOn.isOn ? 1 : 0,
        started: started,
        duration: lightTransitionDurationMs(wasOn.wasOn, wasOn.isOn, wasOn.fadeDuration, {
          ...argTertiary,
          immediate
        })
      });
    }
    if (count) {
      cancelAnimationFrame(count);
    }
    tickOverlayFadeFrame(started);
    return true;
  }
  function captureLightCacheFrame() {
    const map = new Map(sizeCurrent);
    stopOverlayFadeLoop();
    isCapturingFrame = objectValue;
    if (localValueTarget !== null) {
      window.clearTimeout(localValueTarget);
    }
    localValueTarget = null;
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = null;
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
    if (!isBakingLightCache) {
      showPreviewRenderShield();
    }
    setPreviewLightCacheVisible(false);
    const list = collectVisibleLights();
    get = ensureWorldItemsCached(list);
    getCurrent = new Map(list.map(itemKey => [itemKey.itemKey, itemKey]));
    localValueFallback = worldGroup;
    localValuePending = worldGroup?.children[0];
    boolFlagItem = true;
    const timestampMs = performance.now();
    for (const groupKey of list) {
      const to = map.get(groupKey.groupKey);
      if (!to) {
        continue;
      }
      const localValue = smoothstepLerp(to, timestampMs);
      for (const userData of get.get(groupKey.itemKey) || []) {
        const finiteValue = finite(userData.userData.lightOnIntensity, 0);
        const color = userData.color.toArray();
        size.set(userData, createLightTransition({
          intensity: finiteValue * localValue,
          color: color
        }, {
          intensity: finiteValue * to.to,
          color: color
        }, timestampMs, Math.max(0, to.started + to.duration - timestampMs)));
      }
    }
    if (size.size && !zeroValueCurrent) {
      zeroValueCurrent = requestAnimationFrame(tickLightTransitionFrame);
    }
    syncOrbitControls();
    return get;
  }
  function finishLightCacheCapture() {
    localValueTarget = null;
    if (!floorSelectionQuery && !curtainMotionActive && !vacuumMotionActive && !boolFlagCurrent && !boolFlagNext && !size.size && isCapturingFrame === objectValue) {
      if (isBakingLightCache || isStageWarmup) {
        localValueTarget = window.setTimeout(finishLightCacheCapture, 60);
        return;
      }
      isCapturingFrame = null;
      if (isPreviewQualityReady()) {
        previewQualityJustBecameReady = true;
        scheduleAdaptiveQuality(0);
      }
    }
  }
  function tickLightTransitionFrame(argPrimary) {
    zeroValueCurrent = 0;
    tickLightTransitionStates(argPrimary);
    let boolFlag = false;
    for (const [visible, started] of size) {
      if (!(argPrimary - started.started < started.duration)) {
        size.delete(visible);
        if (!visible.visible) {
          boolFlag = true;
        }
      }
    }
    if (boolFlag) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
      scheduleOrbitInteractionWarmup();
    }
    updateLightPreview();
    if (size.size) {
      zeroValueCurrent = requestAnimationFrame(tickLightTransitionFrame);
    } else {
      setStageWarmupActive(false);
      if (isCapturingFrame === objectValue) {
        localValueTarget = window.setTimeout(finishLightCacheCapture, 180);
      }
    }
  }
  function stopAllLightAnimations() {
    stopOverlayFadeLoop();
    if (zeroValueCurrent) {
      cancelAnimationFrame(zeroValueCurrent);
    }
    if (localValueTarget !== null) {
      window.clearTimeout(localValueTarget);
    }
    if (localValueDefault !== null) {
      window.clearTimeout(localValueDefault);
    }
    zeroValueCurrent = 0;
    localValueTarget = null;
    localValueDefault = null;
    isStageWarmup = false;
    for (const [localValue, to] of size) {
      applySampledLightState(localValue, {
        ...to.to,
        complete: true
      });
    }
    size.clear();
    boolFlagNext = false;
    get.clear();
    getCurrent.clear();
    if (isCapturingFrame === objectValue) {
      isCapturingFrame = null;
    }
  }
  const has = new WeakMap();
  const hasCurrent = new Map();
  function setLightStates(filter, editor = {}) {
    if (editor.editor) {
      const get = new Map(filter.filter(on => on.on).map(floorId => [layerScopedKey(floorId.floorId, floorId.groupId), floorId]));
      filter = projectDocCurrent.floors.flatMap(id => (id.scene.lightGroups || []).map(id => {
        if (!hasCurrent.has(id)) {
          hasCurrent.set(id, id.enabled !== false);
        }
        return get.get(layerScopedKey(id.id, id.id)) || {
          floorId: id.id,
          groupId: id.id,
          on: false
        };
      }));
    } else if (hasCurrent.size) {
      const has = new Map(filter.map(floorId => [layerScopedKey(floorId.floorId, floorId.groupId), floorId]));
      filter = [...projectDocCurrent.floors.flatMap(id => (id.scene.lightGroups || []).filter(id => hasCurrent.has(id) && !has.has(layerScopedKey(id.id, id.id))).map(id => ({
        floorId: id.id,
        groupId: id.id,
        on: hasCurrent.get(id),
        brightnessSupported: false,
        temperatureSupported: false
      }))), ...filter];
      hasCurrent.clear();
      editor = {
        ...editor,
        immediate: true
      };
    }
    if (!boolFlagLocal) {
      boolFlagLocal = true;
      window.addEventListener("pagehide", stopAllLightAnimations, {
        once: true
      });
    }
    const immediate = editor.immediate === true || !boolFlagPrevious || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const lookupMap = new Map();
    for (const floorId of filter) {
      const state = mapLightEffectState(floorId);
      const scene = projectDocCurrent.floors.find(id => id.id === floorId.floorId);
      const enabled = scene?.scene.lightGroups.find(id => id.id === floorId.groupId);
      if (!enabled) {
        continue;
      }
      const wasOn = enabled.enabled !== false;
      const isOn = floorId.on === true;
      enabled.enabled = isOn;
      for (const lightBrightness of scene.scene.items) {
        if (lightBrightness.lightGroupId !== enabled.id || !set.has(lightBrightness.type)) {
          continue;
        }
        const brightness = lightBrightness.lightBrightness;
        const kelvin = lightBrightness.lightTemperature;
        if (!has.has(lightBrightness)) {
          has.set(lightBrightness, {
            brightness,
            kelvin
          });
        }
        const entry = has.get(lightBrightness);
        if (Number.isFinite(state.brightness)) {
          lightBrightness.lightBrightness = state.brightness;
        } else if (floorId.brightnessSupported === false) {
          lightBrightness.lightBrightness = entry.brightness;
        }
        if (Number.isFinite(state.kelvin)) {
          lightBrightness.lightTemperature = state.kelvin;
        } else if (floorId.temperatureSupported === false) {
          lightBrightness.lightTemperature = entry.kelvin;
        }
        if (wasOn !== isOn || brightness !== lightBrightness.lightBrightness || kelvin !== lightBrightness.lightTemperature) {
          lookupMap.set(layerScopedKey(scene.id, lightBrightness.id), {
            item: lightBrightness,
            floorId: scene.id,
            wasOn,
            isOn,
            previousBrightness: brightness,
            previousKelvin: kelvin,
            fadeDuration: floorId.fadeDuration
          });
        }
      }
    }
    boolFlagPrevious = true;
    if (!lookupMap.size) {
      return;
    }
    const ready = isPreviewQualityReady();
    if (ready && beginOverlayFade(lookupMap, immediate, editor)) {
      return;
    }
    let map = collectWorldItemKeys();
    const get = map;
    if (ready) {
      map = captureLightCacheFrame();
    } else if ([...lookupMap.keys()].some(argPrimary => !map.has(argPrimary))) {
      map = ensureWorldItemsCached(collectVisibleLights().filter(itemKey => lookupMap.has(itemKey.itemKey)));
    }
    let boolFlag = false;
    const timestampMs = performance.now();
    for (const [localValue, value] of lookupMap) {
      if (getPreviewFloorModeCurrent() !== "all" && value.floorId !== activeFloorId) {
        continue;
      }
      const length = map.get(localValue);
      if (length?.length) {
        for (const userData of length) {
          const localValue = size.get(userData);
          const brightness = normalizedLightBrightness(value.item, value.previousBrightness);
          const conditionalValue = get.get(localValue)?.includes(userData) && brightness > 1e-7 && userData.userData.lightOnIntensity > 0 ? userData.userData.lightOnIntensity / brightness : estimateLightRenderIntensity(value.item);
          const lightOnIntensity = conditionalValue * normalizedLightBrightness(value.item, value.item.lightBrightness);
          const color = {
            intensity: value.isOn ? lightOnIntensity : 0,
            color: new THREE.Color(lightEffectColorHex(value.item.lightTemperature)).toArray()
          };
          const intensity = localValue ? sampleLightTransition(localValue, timestampMs) : null;
          const options = !value.wasOn && value.isOn && (!intensity || intensity.intensity <= 0.000001) ? {
            intensity: 0,
            color: color.color
          } : intensity || {
            intensity: ready ? value.wasOn ? conditionalValue * brightness : 0 : userData.intensity,
            color: ready ? new THREE.Color(lightEffectColorHex(value.previousKelvin)).toArray() : userData.color.toArray()
          };
          userData.userData.lightOnIntensity = lightOnIntensity;
          userData.userData.lightBrightness = value.item.lightBrightness;
          const ms = lightTransitionDurationMs(value.wasOn, value.isOn, value.fadeDuration, {
            ...editor,
            immediate: immediate
          });
          const transition = createLightTransition(options, color, timestampMs, ms);
          const visible = userData.visible;
          applySampledLightState(userData, sampleLightTransition(transition, timestampMs));
          boolFlag ||= visible !== userData.visible;
          if (ms) {
            size.set(userData, transition);
          } else {
            size.delete(userData);
          }
        }
      }
    }
    if (ready) {
      tickLightTransitionStates(timestampMs);
    }
    if (boolFlag || ready) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
    }
    if (boolFlag) {
      scheduleOrbitInteractionWarmup();
    }
    setStageWarmupActive(size.size > 0);
    updateLightPreview();
    if (!zeroValueCurrent) {
      if (size.size) {
        zeroValueCurrent = requestAnimationFrame(tickLightTransitionFrame);
      } else if (ready) {
        localValueTarget = window.setTimeout(finishLightCacheCapture, 100);
      }
    }
  }
  function syncRendererSizeCacheKey() {
    renderer.getSize(x54);
    const localValue = Math.max(x54.x || 1, 1);
    const max = Math.max(x54.y || 1, 1);
    const halfValue = localValue + "/" + max + "/" + zeroValue + "/" + cameraCurrent.uuid;
    if (halfValue === text) {
      blendCameraProjectionMatrices();
      return;
    }
    text = halfValue;
    if (zeroValue) {
      cameraCurrent.setViewOffset(localValue, max, localValue * zeroValue / 2, 0, localValue, max);
    } else {
      cameraCurrent.clearViewOffset();
    }
    blendCameraProjectionMatrices();
  }
  function applyOrbitControlLimits() {
    orbitControls.enablePan = enablePan;
    orbitControls.enableZoom = enableZoom;
    if (stringValue === "horizontal") {
      orbitControls.minPolarAngle = orbitControls.maxPolarAngle = orbitControls.getPolarAngle();
    }
    if (stringValue === "vertical") {
      orbitControls.minAzimuthAngle = orbitControls.maxAzimuthAngle = orbitControls.getAzimuthalAngle();
    }
  }
  function worldPoint(argPrimary, x43, y4, argN = 0.1) {
    const scene = projectDocCurrent.floors.find(id => id.id === argPrimary);
    if (!scene) {
      return null;
    }
    const computedValue = scene.scene.calibration?.pixelsPerMeter || 1;
    if (getPreviewFloorModeCurrent() === "all") {
      const indexOfVar = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation);
      const x27 = planPointToWorldXZ(scene, {
        x: x43,
        y: y4
      });
      return new THREE.Vector3(x27.x, indexOfVar.indexOf(scene) * projectDocCurrent.previewFloorGap + argN, x27.z);
    }
    const localValue = floorSceneCurrent;
    floorSceneCurrent = scene.scene;
    const minX = getPreviewFloorMode();
    floorSceneCurrent = localValue;
    return new THREE.Vector3((x43 - (minX.minX + minX.maxX) / 2) / computedValue, argN, (y4 - (minX.minY + minX.maxY) / 2) / computedValue);
  }
  function findFloorOrbitCenter(argPrimary) {
    if (!projectDocCurrent.floors.some(id => id.id === argPrimary)) {
      return null;
    }
    const comparisonFlag = projectDocCurrent.floors.find(id => id.id === argPrimary)?.scene.calibration?.pixelsPerMeter || 1;
    const localValue = worldPoint(argPrimary, 0, 0, 0);
    return new THREE.Matrix4().makeBasis(worldPoint(argPrimary, comparisonFlag, 0, 0).sub(localValue), new THREE.Vector3(0, 1, 0), worldPoint(argPrimary, 0, comparisonFlag, 0).sub(localValue)).setPosition(localValue);
  }
  function computeMultiFloorBoundsCenter() {
    if (projectDocCurrent.floors.length < 2) {
      return null;
    }
    const expandByPoint = new THREE.Box3();
    let zeroValue = 0;
    for (const scene of projectDocCurrent.floors) {
      for (const start of scene.scene.walls || []) {
        for (const x8 of [start.start, start.end]) {
          if (!x8 || !Number.isFinite(x8.x) || !Number.isFinite(x8.y)) {
            continue;
          }
          const x7 = planPointToWorldXZ(scene, x8);
          expandByPoint.expandByPoint(new THREE.Vector3(x7.x, 0, x7.z));
        }
        zeroValue = Math.max(zeroValue, finite(start.height, scene.scene.settings?.wallHeight || 2.8));
      }
    }
    if (expandByPoint.isEmpty()) {
      return null;
    }
    const y5 = expandByPoint.getCenter(new THREE.Vector3());
    if (getPreviewFloorModeCurrent() === "all") {
      y5.y = (projectDocCurrent.floors.length - 1) * projectDocCurrent.previewFloorGap / 2 + zeroValue / 2;
      return y5;
    }
    const id = projectDocCurrent.floors.find(id => id.id === activeFloorId);
    const x44 = rotatePlanPointByFloor(id, y5);
    return worldPoint(id.id, x44.x, x44.y, zeroValue / 2);
  }
  function resolveOrbitPanTarget(argPrimary) {
    if (localValueText !== worldGroup || localValueValue !== planCanvas) {
      const localValue = computeMultiFloorBoundsCenter();
      const isEmpty = localValue ? null : isWallCloseSnap({
        excludeModelLayers
      });
      localValueText = worldGroup;
      localValueValue = planCanvas;
      localValueSource = localValue || (isEmpty.isEmpty() ? null : isEmpty.getCenter(new THREE.Vector3()));
    }
    return (localValueSource || argPrimary).clone();
  }
  function syncOrbitControlsBinding() {
    cloneCurrent ||= resolveOrbitPanTarget(orbitControls.target);
    if (localValueList === orbitControls) {
      return;
    }
    const addEventListener = orbitControls;
    const quaternion = cameraCurrent;
    const bind = addEventListener.update.bind(addEventListener);
    localValueList = addEventListener;
    const helperFn = () => {
      if (isCapturingFrame === objectValue) {
        if (localValueTarget !== null) {
          window.clearTimeout(localValueTarget);
        }
        localValueTarget = null;
        if (!boolFlagNext) {
          localValueTarget = window.setTimeout(finishLightCacheCapture, 180);
        }
      }
    };
    addEventListener.addEventListener("start", () => {
      if (!boolFlagCurrent) {
        boolFlagNext = true;
      }
    });
    addEventListener.addEventListener("change", () => {
      if (!boolFlagCurrent) {
        if (boolFlagNext && isPreviewQualityReady() && isCapturingFrame !== objectValue) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now());
          syncSpotShadowCastingLights(worldGroup, {
            rebuildAtlas: false
          });
        }
        helperFn();
      }
    });
    addEventListener.addEventListener("end", () => {
      if (!boolFlagCurrent) {
        boolFlagNext = false;
        helperFn();
      }
    });
    let localValue = addEventListener.enabled;
    Object.defineProperty(addEventListener, "enabled", {
      configurable: true,
      get: () => enabled && !boolFlagCurrent && localValue,
      set: argPrimary => {
        localValue = argPrimary === true;
      }
    });
    Object.defineProperty(addEventListener, "enableRotate", {
      configurable: true,
      get: () => true,
      set() {}
    });
    addEventListener.update = argPrimary => {
      if (boolFlagCurrent) {
        return false;
      }
      const angleTo = quaternion.quaternion.clone();
      const localValue = bind(argPrimary);
      if (enabled && angleTo.angleTo(quaternion.quaternion) > 1e-7) {
        const localValue = quaternion.quaternion.clone().multiply(angleTo.invert());
        const clone = cloneCurrent.clone().sub(addEventListener.target);
        const sub = clone.clone().sub(clone.applyQuaternion(localValue));
        quaternion.position.add(sub);
        addEventListener.target.add(sub);
        quaternion.updateMatrixWorld();
        addEventListener.dispatchEvent({
          type: "change"
        });
        return true;
      }
      return localValue;
    };
  }
  function collectShadowCastingLights() {
    if (localValueLocal !== worldGroup || localValueItem !== worldGroup?.children[0]) {
      localValueLocal = worldGroup;
      localValueItem = worldGroup?.children[0];
      pushCurrent = [];
      worldGroup?.traverse(userData => {
        if (["background", "grid"].includes(userData.userData?.exportRole)) {
          pushCurrent.push(userData);
        }
      });
    }
    for (const visible of pushCurrent) {
      visible.visible = boolTrue && !visible.userData.floorBackgroundHidden;
    }
  }
  const detail = new URLSearchParams(globalThis.window?.location?.search || "").get("reflection-detail") === "low" ? createReflectionDetail({
    THREE,
    requestFrame: () => {
      changed.changed();
      updateLightPreview();
    }
  }) : null;
  const comparisonFlag = new URLSearchParams(globalThis.window?.location?.search || "").get("performance-diagnostics") === "1" && new URLSearchParams(window.location.search).get("reflection-work") === "baseline";
  const changed = createGroundReflections({
    detail: detail,
    THREE,
    renderer,
    scene: previewSceneCurrent,
    getRoot: () => worldGroup,
    getSceneRevision: () => planCanvas,
    floorLighting: yt,
    cull: !comparisonFlag,
    blur: false,
    syncLighting: argPrimary => comparisonFlag ? studioReady?.sync(argPrimary, true) : studioReady?.syncCamera(argPrimary),
    requestFrame: () => updateLightPreview(),
    getStateKey: () => [planCanvas, floorSelectionQuery, yt ? "" : lightCacheEpoch, lightCacheReady, renderer.toneMappingExposure].join("|")
  });
  const entry = new URLSearchParams(globalThis.window?.location?.search || "").get("floorEffects");
  let boolFlagEntry = false;
  let boolFlagList = false;
  const motionPresentation = createMotionPresentation({
    reflections(active) {
      boolFlagList = active;
      changed.setSuspended?.(boolFlagEntry || boolFlagList, {
        fade: !boolFlagEntry
      });
    },
    shadows(active) {
      renderCache?.setVisibleFloor?.(getPreviewFloorModeCurrent() === "all" ? null : activeFloorId);
      renderCache?.setMotion?.(active);
    }
  });
  function setEditorEffects(argPrimary, argSecondary) {
    const computedValue = argPrimary && !argSecondary;
    renderer.domElement.dataset.editorEffects = argPrimary ? argSecondary ? "light-preview" : "paused" : "runtime";
    if (boolFlagEntry !== computedValue) {
      boolFlagEntry = computedValue;
      changed.setSuspended?.(boolFlagEntry || boolFlagList);
      updateLightPreview();
    }
  }
  const comparisonFlagCurrent = (yt || entry === "follow") && entry !== "deferred";
    let localValueRaw = null;
  let autoUpdate = true;
  const hasNext = new Map();
  function setShadowMapAutoUpdate(argPrimary) {
    if (floorShadowMotionActive !== !!argPrimary) {
      floorShadowMotionActive = !!argPrimary;
      if (comparisonFlagCurrent) {
        if (argPrimary) {
          autoUpdate = renderer.shadowMap.autoUpdate;
        }
        renderer.shadowMap.autoUpdate = argPrimary ? true : autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        studioReady?.setMotion?.(argPrimary, true);
        return;
      }
      if (argPrimary) {
        localValueRaw = null;
        autoUpdate = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = false;
        shadowAtlas?.setEnabled(false);
        previewSceneCurrent.traverse(shadow => {
          if (!!shadow.isLight && !!shadow.castShadow && !!shadow.shadow) {
            if (!hasNext.has(shadow.shadow)) {
              hasNext.set(shadow.shadow, shadow.shadow.intensity ?? 1);
            }
            shadow.shadow.intensity = 0;
          }
        });
      } else {
        renderer.shadowMap.autoUpdate = autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        localValueRaw = performance.now();
        shadowAtlas?.setEnabled(true);
      }
      studioReady?.setMotion?.(argPrimary);
    }
  }
  function tickShadowIntensityFade() {
    if (floorShadowMotionActive || localValueRaw === null) {
      return;
    }
    const nowMs = Math.min(1, (performance.now() - localValueRaw) / 280);
    for (const [intensity, localValue] of hasNext) {
      intensity.intensity = localValue * nowMs;
    }
    if (nowMs < 1) {
      updateLightPreview();
    } else {
      hasNext.clear();
      localValueRaw = null;
    }
  }
  const profileFrameWork = (argPrimary, argSecondary) => typeof fitCameraToSelectionCurrent == "function" ? fitCameraToSelectionCurrent(argPrimary, argSecondary) : argSecondary();
  const finish = createFloorTransition({
    THREE,
    getRoot: () => worldGroup,
    dispose: disposeObject3dResources,
    release,
    suspendReflections: argPrimary => {
      motionPresentation.floor(argPrimary);
      setShadowMapAutoUpdate(argPrimary);
    },
    invalidate: argPrimary => {
      if (argPrimary) {
        cloneCurrent = null;
        localValueText = null;
        localValueValue = undefined;
        localValueSource = null;
        syncOrbitControlsBinding();
      }
      if (comparisonFlagCurrent && !argPrimary) {
        flushPlanZoomFrame();
      }
      requestRender(argPrimary ? {
        scene: true,
        shadows: true
      } : {
        preserveLightCache: true
      });
    }
  });
  renderCache?.setFrameProvider?.(argPrimary => {
    const node = finish.records.find(id => id.id === argPrimary);
    if (node) {
      node.node.updateWorldMatrix(true, false);
      return node.node.matrixWorld.clone().multiply(node.baseFrame);
    } else {
      return findFloorOrbitCenter(argPrimary);
    }
  });
  studioReady?.setMotionTransformProvider?.(argPrimary => {
    const node = finish.records.find(id => id.id === argPrimary);
    if (node) {
      node.node.updateWorldMatrix(true, false);
      return (node.lightingTransform ||= new THREE.Matrix4()).copy(node.node.matrixWorld).invert().premultiply(worldGroup.matrixWorld);
    } else {
      return null;
    }
  });
  globalThis.window?.addEventListener("pagehide", () => {
    finish.finish();
    callback();
  }, {
    once: true
  });
  globalThis.window?.addEventListener("pagehide", () => changed.dispose(), {
    once: true
  });
  const applyVar = previewSceneCurrent.onBeforeRender;
  const name9 = new THREE.Mesh(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([], 3)), new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    depthTest: false
  }));
  name9.name = "interaction3d-curtain-shadow-refresh";
  name9.frustumCulled = false;
  name9.renderOrder = -1000000000;
  name9.layers.enableAll();
  name9.onBeforeRender = () => {
    if (boolFlag && !floorShadowMotionActive) {
      try {
        boolFlag = shadowAtlas ? !shadowAtlas.refreshGeometry(worldGroup, list) : false;
      } catch (error) {
        console.error(error);
        boolFlag = true;
      }
    }
  };
  previewSceneCurrent.add(name9);
  globalThis.window?.addEventListener("pagehide", () => {
    name9.removeFromParent();
    name9.geometry.dispose();
    name9.material.dispose();
  }, {
    once: true
  });
  previewSceneCurrent.onBeforeRender = function (...argPrimary) {
    if (changed.stats.inCapture) {
      if (comparisonFlag) {
        studioReady?.sync(argPrimary[2], true);
      }
      return;
    }
    tickShadowIntensityFade();
    if (!floorShadowMotionActive) {
      profileFrameWork("curtains", () => localValueCurrent?.());
    }
    if (boolFlag && !floorShadowMotionActive) {
      if (localValueNext !== worldGroup || localValuePrevious !== planCanvas) {
        localValueNext = worldGroup;
        localValuePrevious = planCanvas;
        push = [];
        list = [];
        worldGroup?.updateWorldMatrix(true, true);
        worldGroup?.traverse(userData => {
          if (userData.userData?.environmentModelType === "curtain") {
            list.push(new THREE.Box3().setFromObject(userData));
          }
        });
        previewSceneCurrent.traverse(isLight => {
          if (isLight.isLight && isLight.castShadow && isLight.shadow) {
            push.push(isLight);
          }
        });
      }
      for (const shadow of push) {
        shadow.shadow.needsUpdate = true;
      }
      renderCache?.invalidate(arrayValueCurrent, true);
    }
    profileFrameWork("lighting-and-contact", () => applyVar?.apply(this, argPrimary));
    if (!floorShadowMotionActive) {
      releaseRoot?.setRoot(worldGroup, planCanvas + ":" + importPlan);
      setRoot?.setRoot(worldGroup, planCanvas);
    }
    collectShadowCastingLights();
    syncRendererSizeCacheKey();
    if (!renderer.getRenderTarget()) {
      profileFrameWork("reflections", () => changed.render(argPrimary[2]));
      const reflectionStats = JSON.stringify({
        ...changed.stats,
        detail: detail?.stats
      });
      if (renderer.domElement.dataset.reflectionStats !== reflectionStats) {
        renderer.domElement.dataset.reflectionStats = reflectionStats;
      }
    }
  };
  function recreateOrbitControlsAtTarget(domEvent = orbitControls.target.clone()) {
    const distanceTo = cameraCurrent.position.clone();
    orbitControls.dispose();
    orbitControls = createOrbitControls(cameraCurrent);
    cameraCurrent.position.copy(distanceTo);
    orbitControls.target.copy(domEvent);
    const localValue = Math.max(distanceTo.distanceTo(domEvent), 0.001);
    const to = distanceTo.clone().sub(domEvent).normalize().angleTo(cameraCurrent.up);
    orbitControls.minDistance = Math.min(2, localValue);
    orbitControls.maxDistance = Math.max(100, localValue * 2);
    orbitControls.minZoom = Math.min(0.35, cameraCurrent.zoom);
    orbitControls.maxZoom = Math.max(6, cameraCurrent.zoom);
    orbitControls.maxPolarAngle = Math.max(Math.PI * 0.49, to + 0.00001);
    orbitControls.enableRotate = true;
    orbitControls.enabled = enabled;
    orbitControls.update();
    applyOrbitControlLimits();
    syncOrbitControlsBinding();
  }
  return {
    onCameraChange(argPrimary) {
      const rendererDomElement = renderer.domElement;
      rendererDomElement.addEventListener("hb-i3d-camera-frame", argPrimary);
      return () => rendererDomElement.removeEventListener("hb-i3d-camera-frame", argPrimary);
    },
    createFrameLoop: argPrimary => createDemandFrameLoop(argPrimary),
    setPresentedVisible(argPrimary) {
      renderer.domElement.dispatchEvent?.(new CustomEvent("hb-i3d-parent-visibility", {
        detail: argPrimary === true
      }));
    },
    THREE,
    container: selectEl("#preview-3d"),
    canvas: renderer.domElement,
    get groundReflections() {
      return changed;
    },
    invalidateReflections(argPrimary) {
      changed.changed(argPrimary);
    },
    get modelRoot() {
      return worldGroup;
    },
    get overlayScene() {
      return previewSceneCurrent;
    },
    get sceneRevision() {
      return planCanvas;
    },
    get environmentRevision() {
      return planCanvas + ":" + importPlan;
    },
    setEnvironmentScene(argPrimary) {
      releaseRoot = argPrimary;
    },
    setEnvironmentAirflow(argPrimary) {
      setRoot = argPrimary;
    },
    setCurtainSync(argPrimary) {
      localValueCurrent = argPrimary;
    },
    curtainFrame({
      key: argPrimary,
      structure: argPrimaryCurrent,
      floorIds: argPrimaryNext = [],
      moving: argPrimaryPrevious
    }) {
      const comparisonFlag = argPrimary !== saveState;
      const localValue = curtainMotionActive;
      if (!!comparisonFlag || localValue !== argPrimaryPrevious) {
        if (comparisonFlag) {
          try {
            const helperFn = argPrimary => {
              const lookupMap = new Map();
              for (const localValue of JSON.parse(argPrimary)) {
                const localValueCurrent = localValue[1];
                if (!lookupMap.has(localValueCurrent)) {
                  lookupMap.set(localValueCurrent, []);
                }
                lookupMap.get(localValueCurrent).push(localValue);
              }
              return lookupMap;
            };
            const keysVar = helperFn(saveState);
            const keys = helperFn(argPrimary);
            changed.changed([...new Set([...keysVar.keys(), ...keys.keys()])].filter(argPrimary => JSON.stringify(keysVar.get(argPrimary)) !== JSON.stringify(keys.get(argPrimary))));
          } catch {
            changed.changed(argPrimaryNext);
          }
        }
        if (argPrimaryCurrent !== importPlan) {
          shadowAtlas?.prepareRoot(worldGroup);
          studioReady?.invalidate();
        }
        arrayValueCurrent = [...new Set([...arrayValue, ...argPrimaryNext])];
        arrayValue = argPrimaryNext;
        if (comparisonFlag || argPrimaryPrevious) {
          if (!localValue) {
            captureLightCacheFrame();
            tickLightTransitionStates(performance.now(), true);
          }
          if (comparisonFlag) {
            boolFlag = true;
          }
          lightCacheEpoch += 1;
          previewQualityJustBecameReady = true;
          setPreviewLightCacheVisible(false);
        }
        saveState = argPrimary;
        curtainMotionActive = argPrimaryPrevious;
        importPlan = argPrimaryCurrent;
        if (!argPrimaryPrevious) {
          finishLightCacheCapture();
        }
        updateLightPreview();
      }
    },
    requestRender() {
      requestRender({
        preserveLightCache: true
      });
    },
    setVacuumMoving(argPrimary) {
      const comparisonFlag = argPrimary === true;
      if (comparisonFlag !== vacuumMotionActive) {
        vacuumMotionActive = comparisonFlag;
        canvasEmpty++;
        if (comparisonFlag) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now(), true);
        } else {
          lightCacheEpoch++;
          previewQualityJustBecameReady = true;
          finishLightCacheCapture();
        }
        updateLightPreview();
      }
    },
    environmentModelPose(argPrimary, argSecondary) {
      let userData;
      worldGroup?.traverse(userDataCurrent => {
        if (userDataCurrent.userData?.environmentFloorId === argPrimary && userDataCurrent.userData?.environmentModelId === argSecondary) {
          userData = userDataCurrent;
        }
      });
      if (!userData) {
        return null;
      }
      userData = userData.userData.vacuumMobileRoot || userData;
      userData.updateWorldMatrix(true, true);
      const union = new THREE.Box3();
      const copy = new THREE.Box3();
      userData.traverse(geometry => {
        if (!!geometry.isMesh && !!geometry.geometry) {
          for (let parent = geometry; parent && parent !== userData; parent = parent.parent) {
            if (parent.userData?.environmentEffect) {
              return;
            }
          }
          geometry.geometry.computeBoundingBox();
          if (geometry.geometry.boundingBox) {
            union.union(copy.copy(geometry.geometry.boundingBox).applyMatrix4(geometry.matrixWorld));
          }
        }
      });
      if (union.isEmpty()) {
        return null;
      } else {
        return {
          center: union.getCenter(new THREE.Vector3()).toArray(),
          size: union.getSize(new THREE.Vector3()).toArray(),
          forward: new THREE.Vector3(0, 0, 1).transformDirection(userData.matrixWorld).toArray()
        };
      }
    },
    setEnvironmentActive(argPrimary) {
      const comparisonFlag = argPrimary === true;
      if (comparisonFlag !== floorSelectionQuery) {
        if (comparisonFlag) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now(), true);
        }
        floorSelectionQuery = comparisonFlag;
        if (!comparisonFlag) {
          finishLightCacheCapture();
        }
        requestRender();
      }
    },
    pickEnvironmentModel(argPrimary, argSecondary, length = [], numericParam = 0) {
      if (!worldGroup || !length.length) {
        return null;
      }
      const width = renderer.domElement.getBoundingClientRect();
      if (!width.width || !width.height) {
        return null;
      }
      const has = new Set(length.map(floorId => JSON.stringify([floorId.floorId, floorId.modelId])));
      const get = new Map();
      const push = [];
      const add = new Set();
      worldGroup.updateWorldMatrix(true, true);
      cameraCurrent.updateMatrixWorld();
      worldGroup.traverse(material => {
        if (!material.isMesh) {
          return;
        }
        let floorId = null;
        for (let userData = material; userData; userData = userData.parent) {
          if (!userData.visible || userData.userData?.environmentEffect) {
            return;
          }
          if (!floorId && userData.userData?.environmentModelId) {
            floorId = {
              modelId: userData.userData.environmentModelId,
              floorId: userData.userData.environmentFloorId
            };
          }
        }
        if (!!floorId && !!has.has(JSON.stringify([floorId.floorId, floorId.modelId])) && !!(Array.isArray(material.material) ? material.material : [material.material]).some(visible => visible && visible.visible !== false && visible.opacity !== 0)) {
          get.set(material, floorId);
          push.push(material);
          if (material.userData?.curtainMotionPanel) {
            add.add(JSON.stringify([floorId.floorId, floorId.modelId]));
          }
        }
      });
      const cacheKey = push.filter(userData => {
        const floorId = get.get(userData);
        return !add.has(JSON.stringify([floorId.floorId, floorId.modelId])) || userData.userData?.curtainMotionPanel;
      });
      const setFromCamera = new THREE.Raycaster();
      const localValue = Math.max(0, Math.min(12, numericParam));
      const arrayValue = [[0, 0], ...(localValue ? [[localValue, 0], [-localValue, 0], [0, localValue], [0, -localValue], [localValue * 0.7, localValue * 0.7], [-localValue * 0.7, localValue * 0.7], [localValue * 0.7, -localValue * 0.7], [-localValue * 0.7, -localValue * 0.7]] : [])];
      for (const [localValue, localValueCurrent] of arrayValue) {
        setFromCamera.setFromCamera(new THREE.Vector2((argPrimary + localValue - width.left) / width.width * 2 - 1, 1 - (argSecondary + localValueCurrent - width.top) / width.height * 2), cameraCurrent);
        for (const object of setFromCamera.intersectObjects(cacheKey, false)) {
          const visible = Array.isArray(object.object.material) ? object.object.material[object.face?.materialIndex || 0] : object.object.material;
          if (visible?.visible !== false && visible?.opacity !== 0) {
            return get.get(object.object);
          }
        }
      }
      return null;
    },
    get camera() {
      return cameraCurrent;
    },
    get controls() {
      return orbitControls;
    },
    get document() {
      return projectDocCurrent;
    },
    get defaults() {
      return DEFAULT_BASE_LIGHTING;
    },
    get regionLighting() {
      return studioReady;
    },
    invalidateRegionLighting() {
      studioReady?.sync(cameraCurrent);
      updateLightPreview();
    },
    transformCamera(argPrimary, argSecondary, flag = false) {
      return transformSceneCamera(argPrimary, combinedFixedCameraView, projectDocCurrent, argSecondary, flag);
    },
    async readSceneUpdate(argPrimary) {
      const get = new URLSearchParams(window.location.search);
      const constructedURLSearchParams = new URLSearchParams({
        projectId: get.get("projectId") || "",
        since: hasProjectLoadedCurrent.syncKey || ""
      });
      const scene = await withRequestTimeout(15000, async signal => {
        const status = await fetch("/api/v1/modules/interaction3d/scenes/" + encodeURIComponent(get.get("sceneId") || "") + "/current?" + constructedURLSearchParams, {
          credentials: "same-origin",
          signal
        });
        if (status.status === 204) {
          return null;
        }
        if (!status.ok) {
          throw new Error("户型同步暂时不可用");
        }
        return status.json();
      }, argPrimary);
      if (!scene) {
        return null;
      }
      const full = sceneUpdatePlan(normalizeProjectDocument(hasProjectLoadedCurrent.scene), normalizeProjectDocument(scene.scene));
      if (!full.full && !full.floors.length) {
        const baseLighting = normalizeProjectDocument(scene.scene);
        projectDocCurrent.baseLighting = baseLighting.baseLighting;
        for (const id2 of baseLighting.floors) {
          const name = projectDocCurrent.floors.find(id => id.id === id.id);
          if (name) {
            name.name = id2.name;
          }
        }
        if (full.lighting && !flag) {
          callback();
          applyBaseLighting(baseLighting.baseLighting);
        }
        hasProjectLoadedCurrent = scene;
        return null;
      }
      return scene;
    },
    get savedScene() {
      return hasProjectLoadedCurrent;
    },
    async replaceScene(scene) {
      const document = normalizeProjectDocument(scene.scene);
      const floors = sceneUpdatePlan(normalizeProjectDocument(hasProjectLoadedCurrent.scene), document);
      finish.finish();
      callback(floors.full || floors.lighting ? null : new Set(floors.floors));
      stopAllLightAnimations();
      localValueEntry = null;
      cloneCurrent = null;
      boolFlagPrevious = false;
      localValueLocal = null;
      localValueItem = null;
      if (!floors.full) {
        document.activeFloorId = activeFloorId;
        document.previewFloorMode = projectDocCurrent.previewFloorMode;
        for (const scene of document.floors) {
          scene.scene.settings.livePreviewEnabled = true;
          const found = projectDocCurrent.floors.find(id => id.id === scene.id);
          if (found && !floors.floors.includes(scene.id)) {
            for (const id of scene.scene.lightGroups) {
              const enabled = found.scene.lightGroups.find(id => id.id === id.id);
              if (enabled) {
                id.enabled = enabled.enabled;
              }
            }
            for (const type of scene.scene.items) {
              if (!set.has(type.type)) {
                continue;
              }
              const lightBrightness = found.scene.items.find(id => id.id === type.id);
              if (lightBrightness) {
                type.lightBrightness = lightBrightness.lightBrightness;
                type.lightTemperature = lightBrightness.lightTemperature;
              }
            }
          }
        }
        projectDocCurrent = document;
        hasProjectLoadedCurrent = scene;
        floorSceneCurrent = activeFloor().scene;
        removeWorldModelLayer(new Set(floors.floors));
        Promise.allSettled(loadVisibleExternalModels());
        return;
      }
      await loadProjectDocument(scene);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    },
    coverSceneUpdate() {
      const width = document.createElement("canvas");
      width.width = renderer.domElement.width;
      width.height = renderer.domElement.height;
      renderer.render(previewSceneCurrent, cameraCurrent);
      const drawImage = width.getContext("2d");
      drawImage.drawImage(renderer.domElement, 0, 0);
      if (!previewLightCache.hidden) {
        drawImage.drawImage(previewLightCache, 0, 0, width.width, width.height);
      }
      const visibility = renderer.domElement.style.visibility;
      const visibilityCurrent = previewLightCache.style.visibility;
      renderer.domElement.style.visibility = "hidden";
      previewLightCache.style.visibility = "hidden";
      Object.assign(width.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "6",
        pointerEvents: "auto"
      });
      width.setAttribute("aria-label", "正在同步户型");
      selectEl("#preview-3d").append(width);
      return () => {
        renderer.domElement.style.visibility = visibility;
        previewLightCache.style.visibility = visibilityCurrent;
        width.remove();
      };
    },
    getOrbitCenter() {
      return (computeMultiFloorBoundsCenter() || resolveOrbitPanTarget(orbitControls.target)).toArray();
    },
    setOrbitPivot(argPrimary) {
      cloneCurrent = argPrimary ? new THREE.Vector3().fromArray(argPrimary) : null;
      syncOrbitControlsBinding();
    },
    orbitCameraPose(target, argSecondary) {
      const up = structuredClone(target);
      const computedValue = finite(argSecondary, 0) % (Math.PI * 2);
      if (Math.abs(computedValue) < 1e-12 || Math.abs(Math.abs(computedValue) - Math.PI * 2) < 1e-12) {
        return up;
      }
      cloneCurrent ||= resolveOrbitPanTarget(new THREE.Vector3().fromArray(target.target));
      const angle = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), computedValue);
      for (const localValue of ["position", "target"]) {
        up[localValue] = new THREE.Vector3().fromArray(target[localValue]).sub(cloneCurrent).applyQuaternion(angle).add(cloneCurrent).toArray();
      }
      let clone = new THREE.Vector3().fromArray(target.up || [0, 1, 0]);
      const sub = new THREE.Vector3().fromArray(target.position).sub(new THREE.Vector3().fromArray(target.target));
      if (clone.lengthSq() < 1e-12 || clone.clone().cross(sub).lengthSq() < 1e-12) {
        const localValue = THREE.MathUtils.degToRad(finite(target.topRotation, 0));
        clone = new THREE.Vector3(Math.sin(localValue), 0, -Math.cos(localValue));
        if (clone.clone().cross(sub).lengthSq() < 1e-12) {
          clone.set(1, 0, 0);
        }
      }
      up.up = clone.applyQuaternion(angle).toArray();
      return up;
    },
    setFocusViewport(argPrimary) {
      const clampedValue = clamp(finite(argPrimary, 0), 0, 0.7);
      if (clampedValue !== zeroValue) {
        zeroValue = clampedValue;
        syncRendererSizeCacheKey();
        requestRender({
          preserveLightCache: false
        });
      }
    },
    beginCameraMotion(argPrimary, argSecondary, argTertiary = "focus") {
      motionPresentation.camera(!!argSecondary, {
        live: argTertiary === "focus"
      });
      const mode = this.cameraState();
      const comparisonFlag = argSecondary && (height || mode.mode !== argPrimary);
      const fromHeight = comparisonFlag ? height?.height ?? resetOrbitTarget(cameraCurrent, orbitControls.target) : 0;
      const fromWeight = height?.weight ?? (mode.mode === "perspective" ? 1 : 0);
      height = null;
      boolFlagCurrent = true;
      boolFlagNext = false;
      if (isPreviewQualityReady()) {
        captureLightCacheFrame();
        tickLightTransitionStates(performance.now());
        syncSpotShadowCastingLights(worldGroup, {
          rebuildAtlas: false
        });
        updateLightPreview();
      }
      setCameraProjectionMode(argPrimary, {
        preserveView: true,
        deferControlUpdate: true
      });
      recreateOrbitControlsAtTarget();
      syncOrbitControlsBinding();
      lockPreviewOrbit();
      if (comparisonFlag) {
        height = {
          fromHeight,
          toHeight: computeCameraViewHeight(argSecondary),
          height: fromHeight,
          fromWeight,
          toWeight: argPrimary === "perspective" ? 1 : 0,
          weight: fromWeight
        };
        return mode;
      } else {
        return this.cameraState();
      }
    },
    applyCameraFrame(argPrimary, argSecondary, argTertiary) {
      const clampedValue = clamp(finite(argTertiary, 0), 0, 0.7);
      const comparisonFlag = clampedValue === zeroValue;
      zeroValue = clampedValue;
      this.applyCameraPose(argPrimary, argSecondary, comparisonFlag);
      motionPresentation.advance(argSecondary);
    },
    applyCameraPose(view, numericParam = 1, preserveLightCache = true) {
      if (height) {
        if (numericParam >= 1) {
          height = null;
        } else {
          height.height = height.fromHeight + (height.toHeight - height.fromHeight) * numericParam;
          height.weight = height.fromWeight + (height.toWeight - height.fromWeight) * numericParam;
        }
      }
      softLockPreviewOrbit();
      const cameraView = activeCameraSettings();
      cameraView.cameraView = view.view || "free";
      cameraView.cameraTopRotation = view.topRotation || 0;
      cameraView.cameraFocalLength = view.focalLength || 50;
      cameraCurrent.position.fromArray(view.position);
      orbitControls.target.fromArray(view.target);
      cameraCurrent.up.fromArray(view.up || [0, 1, 0]);
      cameraCurrent.zoom = view.zoom;
      cameraCurrent.userData.frameSize = view.frameSize || 10;
      cameraCurrent.userData.cameraView = cameraView.cameraView;
      cameraCurrent.userData.topRotation = cameraView.cameraTopRotation;
      if (cameraCurrent.isOrthographicCamera) {
        focusCameraOnPoint(cameraCurrent.userData.frameSize, cameraCurrent.userData.viewportAspect || 1);
      } else {
        applyCameraFocalLength();
      }
      cameraCurrent.lookAt(orbitControls.target);
      getCameraPose(cameraCurrent, orbitControls.target);
      cameraCurrent.updateMatrixWorld();
      syncRendererSizeCacheKey();
      requestRender({
        preserveLightCache: preserveLightCache
      });
    },
    endCameraMotion() {
      motionPresentation.camera(false);
      boolFlagCurrent = false;
      recreateOrbitControlsAtTarget();
      unlockPreviewOrbit();
      requestRender();
      if (typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue && !size.size) {
        if (localValueTarget !== null) {
          window.clearTimeout(localValueTarget);
        }
        localValueTarget = window.setTimeout(finishLightCacheCapture, 180);
      }
    },
    setFloorGap(argPrimary) {
      const conditionalValue = Number.isFinite(argPrimary) ? clamp(argPrimary, 0, 20) : null;
      if (conditionalValue !== null || localValue !== null) {
        const previewFloorGap = conditionalValue ?? normalizeProjectDocument(hasProjectLoadedCurrent.scene).previewFloorGap;
        if (Math.abs(projectDocCurrent.previewFloorGap - previewFloorGap) > 0.000001) {
          finish.finish();
          const comparisonFlag = getPreviewFloorModeCurrent() === "all";
          const conditionalValue = comparisonFlag ? finish.take(projectDocCurrent.floors.map(id => id.id), findFloorOrbitCenter, true) : [];
          projectDocCurrent.previewFloorGap = previewFloorGap;
          for (const id of conditionalValue) {
            finish.reuse(id, findFloorOrbitCenter(id.id));
          }
          if (comparisonFlag) {
            cloneCurrent = null;
            localValueText = null;
            flushPlanZoomFrame();
            requestRender({
              scene: true,
              shadows: true
            });
          }
        }
      }
      localValue = conditionalValue;
    },
    appearance(baseLightingCurrent) {
      const cacheKey = JSON.stringify([baseLightingCurrent.baseLighting, baseLightingCurrent.lightingMode, baseLightingCurrent.lightRegionOverrides]);
      if (cacheKey !== emptyText) {
        callback();
        emptyText = cacheKey;
        changed.changed();
      }
      if (changed.configure(baseLightingCurrent.groundReflection)) {
        exportFolderQuery = JSON.stringify(changed.settings);
        requestRender();
      }
      studioReady?.setOverrides(baseLightingCurrent.lightRegionOverrides || {});
      flag = !!baseLightingCurrent.baseLighting;
      const clampedValue = clamp(finite(baseLightingCurrent.renderScale, 1), 0.25, 2);
      const conditionalValue = typeof baseLightingCurrent.motionRenderScale == "number" && Number.isFinite(baseLightingCurrent.motionRenderScale) ? clamp(baseLightingCurrent.motionRenderScale, 0.25, 1) : null;
      if (clampedValue !== ur || conditionalValue !== isAutoDiagramEmbed) {
        ur = clampedValue;
        isAutoDiagramEmbed = conditionalValue;
        renderer.setPixelRatio(computeStudioPixelRatio(previewOrbitLocked));
        onPreviewContainerResize();
        requestRender();
      }
      const comparisonFlag = boolTrue !== (baseLightingCurrent.backgroundVisible !== false);
      boolTrue = baseLightingCurrent.backgroundVisible !== false;
      document.body.classList.toggle("is-background-hidden", !boolTrue);
      collectShadowCastingLights();
      const floorBrightness = normalizeBaseLighting(baseLightingCurrent.baseLighting || projectDocCurrent.baseLighting);
      if (studioReady?.setFloorBrightness(floorBrightness.floorBrightness)) {
        requestRender();
      }
      if (JSON.stringify(floorBrightness) !== JSON.stringify(baseLighting)) {
        applyBaseLighting(floorBrightness);
      }
      if (comparisonFlag) {
        requestRender();
      }
    },
    floorDefaultCamera(argPrimary) {
      const position = argPrimary === "all" ? combinedFixedCameraView?.combinedFixedCameraView : combinedFixedCameraView?.floors.find(id => id.id === argPrimary)?.scene.settings?.fixedCameraView;
      if (!position) {
        return null;
      }
      const objectValue = {
        mode: position.mode,
        view: position.view,
        topRotation: position.topRotation,
        position: [position.position.x, position.position.y, position.position.z],
        target: [position.target.x, position.target.y, position.target.z],
        zoom: 1,
        frameSize: position.visibleHeight,
        focalLength: position.focalLength || 50
      };
      return transformSceneCamera(objectValue, combinedFixedCameraView, projectDocCurrent, argPrimary);
    },
    get floorTransitionActive() {
      return finish.active;
    },
    advanceFloorTransition(argPrimary, argSecondary) {
      const projections = argSecondary ? {
        height: height ? height.fromHeight + (height.toHeight - height.fromHeight) * argPrimary : computeCameraViewHeight(argSecondary),
        weight: height ? height.fromWeight + (height.toWeight - height.fromWeight) * argPrimary : argSecondary.mode === "perspective" ? 1 : 0,
        distance: new THREE.Vector3().fromArray(argSecondary.position).distanceTo(new THREE.Vector3().fromArray(argSecondary.target))
      } : null;
      profileFrameWork("motion-and-settle", () => finish.sample(argPrimary, argSecondary, projections));
    },
    setFloorSlideCameras(argPrimary, argSecondary) {
      const viewDistance = view => new THREE.Vector3().fromArray(view.position).distanceTo(new THREE.Vector3().fromArray(view.target));
      finish.setSlideCameras(argPrimary, argSecondary, {
        from: {
          height: height?.fromHeight ?? computeCameraViewHeight(argPrimary),
          weight: height?.fromWeight ?? (argPrimary.mode === "perspective" ? 1 : 0),
          distance: viewDistance(argPrimary)
        },
        to: {
          height: computeCameraViewHeight(argSecondary),
          weight: argSecondary.mode === "perspective" ? 1 : 0,
          distance: viewDistance(argSecondary)
        }
      });
    },
    finishFloorTransition() {
      finish.finish();
      if (typeof isPerfDiagnosticsEnabled !== "undefined" && isPerfDiagnosticsEnabled && perfStats.floorSwitch) {
        perfStats.floorSwitch.until = performance.now() + 400;
      }
    },
    get floorCacheSize() {
      return entryMap.size;
    },
    profileFrameWork,
    recordFloorFrame(argPrimary, argSecondary) {
      if (typeof setPerfMotionActive == "function") {
        setPerfMotionActive(argPrimary, argSecondary);
      }
    },
    get floorEffectsFollow() {
      return comparisonFlagCurrent;
    },
    transitionFloor(target) {
      if (typeof isPerfDiagnosticsEnabled !== "undefined" && isPerfDiagnosticsEnabled) {
        perfStats.floorSwitch = {
          target: target,
          last: performance.now(),
          until: Infinity,
          frames: 0,
          maxMs: 0,
          longFrames: 0,
          cpuMs: 0
        };
      }
      const localValue = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation).map(id => id.id);
      const helperFn = argPrimary => {
        const scene = projectDocCurrent.floors.find(id => id.id === argPrimary);
        const computedValue = scene.scene.calibration?.pixelsPerMeter || 1;
        const localValue = this.worldPoint(argPrimary, 0, 0, 0);
        return new THREE.Matrix4().makeBasis(this.worldPoint(argPrimary, computedValue, 0, 0).sub(localValue), new THREE.Vector3(0, 1, 0), this.worldPoint(argPrimary, 0, computedValue, 0).sub(localValue)).setPosition(localValue);
      };
      const comparisonFlag = getPreviewFloorModeCurrent() === "all";
      const text = comparisonFlag ? "all" : activeFloorId;
      const findVar = profileFrameWork("detach-source", () => finish.take(comparisonFlag ? localValue : [activeFloorId], helperFn, comparisonFlag));
      for (const cacheKey of findVar) {
        cacheKey.cacheKey ||= text;
        cacheKey.cacheEpoch ??= cacheEpoch;
      }
      const bounds = new THREE.Box3();
      for (const record of findVar) {
        record.node.traverseVisible(mesh => {
          if (!mesh.isMesh || !mesh.geometry || ["background", "grid", "contact-shadow"].includes(mesh.userData?.exportRole)) {
            return;
          }
          mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();
          if (mesh.geometry.boundingBox) {
            bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
          }
        });
      }
      const x32 = bounds.getSize(new THREE.Vector3());
      const comparisonFlagCurrent = !comparisonFlag && target !== "all";
      const conditionalValue = comparisonFlagCurrent ? new THREE.Vector3(0, 1, 0).applyQuaternion(cameraCurrent.quaternion).normalize() : null;
      const value = comparisonFlagCurrent ? resetOrbitTarget(cameraCurrent, orbitControls.target) * 1.2 : Math.max(20, x32.x, x32.z) * 1.5;
      const scrollFrom = findVar.find(record => Number.isFinite(record.scrollPosition))?.scrollPosition ?? localValue.indexOf(text);
      const targetIndex = localValue.indexOf(target);
      const handoffRange = comparisonFlagCurrent ? localValue.slice(Math.min(Math.floor(scrollFrom), targetIndex), Math.max(Math.ceil(scrollFrom), targetIndex) + 1) : [];
      const map = target === "all" ? localValue : [target, ...handoffRange.filter(id => id !== target)];
      const everyVar = map.map(argPrimary => findVar.find(id => id.id === argPrimary && id.cacheEpoch === cacheEpoch) || entryMap.get(argPrimary));
      const reusedCount = everyVar.filter(Boolean).length;
      if (comparisonFlagCurrent) {
        for (let index = 0; index < map.length; index++) {
          if (everyVar[index]) {
            continue;
          }
          this.setFloor(map[index]);
          const captured = finish.capture([map[index]], helperFn, false)[0];
          captured.frame = captured.baseFrame.clone();
          captured.cacheKey = map[index];
          captured.cacheEpoch = cacheEpoch;
          captured.node.removeFromParent();
          everyVar[index] = captured;
        }
      }
      const length = everyVar.every(Boolean) ? everyVar : null;
      if (length && reusedCount === map.length) {
        reusedTransitions.reusedTransitions++;
      } else {
        reusedTransitions.rebuiltTransitions++;
      }
      if (length) {
        reusedTransitions.reusedFloors += reusedCount;
      }
      renderer.domElement.dataset.floorReuseStats = JSON.stringify(reusedTransitions);
      if (length) {
        for (const node of length) {
          releaseRoot?.releaseRoot?.(node.node);
          studioReady?.releaseRoot?.(node.node);
          entryMap.delete(node.id);
        }
      } else {
        callback(new Set(map));
      }
      profileFrameWork("set-destination", () => this.setFloor(target, length, helperFn));
      const center = this.getOrbitCenter();
      const work = profileFrameWork("capture-destination", () => finish.capture(map, helperFn, target === "all" || map.length > 1));
      for (const cacheKey of work) {
        cacheKey.cacheKey = target;
        cacheKey.cacheEpoch = cacheEpoch;
      }
      profileFrameWork("begin-motion", () => finish.begin(findVar, work, localValue, value, comparisonFlagCurrent, conditionalValue, target));
      localValueCurrent?.();
      return center;
    },
    setFloor(floorEntry, optionalValue = null, argTertiary = findFloorOrbitCenter) {
      const id = projectDocCurrent.floors.find(id => id.id === floorEntry) || projectDocCurrent.floors[0];
      const previewFloorMode = floorEntry === "all" && projectDocCurrent.floors.length > 1 ? "all" : "active";
      if (!!optionalValue || activeFloorId !== id.id || getPreviewFloorModeCurrent() !== previewFloorMode) {
        if (size.size || typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue) {
          stopAllLightAnimations();
        }
        boolFlagPrevious = false;
        activeFloorId = id.id;
        projectDocCurrent.activeFloorId = id.id;
        floorSceneCurrent = id.scene;
        if (optionalValue) {
          projectDocCurrent.previewFloorMode = previewFloorMode;
          syncPreviewFloorButtons();
          syncFloorCameraChrome();
          const idValue = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation)[0].id;
          for (const id of optionalValue) {
            finish.reuse(id, argTertiary(id.id)).traverse(userData => {
              if (["background", "grid"].includes(userData.userData?.exportRole)) {
                userData.userData.floorBackgroundHidden = previewFloorMode === "all" && id.id !== idValue;
                userData.visible = boolTrue && !userData.userData.floorBackgroundHidden;
              }
            });
          }
          worldGroup.userData.regionFloorId = id.id;
          if (studioReady) {
            worldGroup.traverse(userData => {
              if (!userData.isLight || !userData.userData.lightItemId) {
                return;
              }
              const localValue = projectDocCurrent.floors.find(id => id.id === userData.userData.lightFloorId)?.scene.items.find(id => id.id === userData.userData.lightItemId);
              if (localValue) {
                studioReady.register(userData, localValue);
              }
            });
          }
          syncSpotShadowCastingLights(worldGroup);
          setCameraProjectionMode(getCameraProjectionMode(), {
            preserveView: false
          });
          requestRender({
            scene: true,
            shadows: true
          });
          flushPlanZoomFrame();
          applyCameraViewCurrent();
        } else {
          setPreviewFloorModeCurrent(floorEntry === "all" ? "all" : "active", {
            persist: false
          });
        }
        cloneCurrent = null;
      }
    },
    worldPoint,
    presentationPoint(floorId, x, y, height = 0.1) {
      const record = finish.records.find(entry => entry.id === floorId);
      if (!record) {
        return worldPoint(floorId, x, y, height);
      }
      const floor = projectDocCurrent.floors.find(item => item.id === floorId);
      if (!floor) {
        return null;
      }
      record.node.updateWorldMatrix(true, false);
      const pixelsPerMeter = floor.scene.calibration?.pixelsPerMeter || 1;
      return new THREE.Vector3(x / pixelsPerMeter, height, y / pixelsPerMeter).applyMatrix4(record.baseFrame).applyMatrix4(record.node.matrixWorld);
    },
    setLightStates,
    setEditorEffects,
    mapLightEffectState: argPrimary => mapLightEffectState(argPrimary),
    lightEffectColorHex: argPrimary => lightEffectColorHex(argPrimary),
    cameraState(flag = false) {
      if (flag) {
        recreateOrbitControlsAtTarget();
      }
      return {
        position: cameraCurrent.position.toArray(),
        target: orbitControls.target.toArray(),
        zoom: cameraCurrent.zoom,
        mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
        up: cameraCurrent.up.toArray(),
        frameSize: cameraCurrent.userData.frameSize || 10,
        view: cameraViewMode(),
        topRotation: topViewRotation(),
        focalLength: getCameraFocalLength()
      };
    },
    setCameraProjection(argPrimary) {
      activeCameraSettings().cameraMode = argPrimary === "perspective" ? "perspective" : "orthographic";
      setCameraProjectionMode(activeCameraSettings().cameraMode, {
        preserveView: true,
        deferControlUpdate: true
      });
      recreateOrbitControlsAtTarget();
    },
    setCameraFocalLength(argPrimary) {
      activeCameraSettings().cameraFocalLength = clamp(finite(argPrimary, 50), 18, 120);
      applyCameraFocalLength();
      requestRender();
    },
    setCameraInteraction(rotationMode = {}) {
      const conditionalValue = ["horizontal", "vertical"].includes(rotationMode.rotationMode) ? rotationMode.rotationMode : "free";
      const value = rotationMode.enabled === true;
      const comparisonFlag = rotationMode.panEnabled !== false;
      const comparisonFlagCurrent = rotationMode.zoomEnabled !== false;
      const comparisonFlagNext = enabled !== value || stringValue !== conditionalValue || enablePan !== comparisonFlag || enableZoom !== comparisonFlagCurrent;
      enabled = value;
      stringValue = conditionalValue;
      enablePan = comparisonFlag;
      enableZoom = comparisonFlagCurrent;
      if (comparisonFlagNext) {
        recreateOrbitControlsAtTarget();
      } else {
        orbitControls.enabled = value;
      }
      syncOrbitControlsBinding();
    },
    whenPresented() {
      localValueEntry ||= (async () => {
        const localValue = loadVisibleExternalModels();
        let localValueCurrent;
        try {
          await Promise.race([Promise.allSettled(localValue), new Promise(argPrimary => {
            localValueCurrent = window.setTimeout(argPrimary, 8000);
          })]);
        } finally {
          window.clearTimeout(localValueCurrent);
        }
        refreshStudioChrome();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        collectShadowCastingLights();
        await waitUntilPreviewQualityReady();
        renderer.render(previewSceneCurrent, cameraCurrent);
        await new Promise(requestAnimationFrame);
      })();
      return localValueEntry;
    },
    setCameraView(argPrimary) {
      activeCameraSettings().cameraView = argPrimary === "top" ? "top" : "free";
      nudgeCamera(activeCameraSettings().cameraView, {
        force: true
      });
    },
    getCameraMotionState() {
      return height ? {
        ...height
      } : null;
    },
    restoreCamera(mode, motionState = null) {
      height = null;
      if (!mode) {
        applyCameraViewCurrent();
        recreateOrbitControlsAtTarget();
        return;
      }
      const cameraView = activeCameraSettings();
      cameraView.cameraMode = mode.mode;
      cameraView.cameraView = mode.view || "free";
      cameraView.cameraTopRotation = mode.topRotation || 0;
      cameraView.cameraFocalLength = mode.focalLength || 50;
      setCameraProjectionMode(mode.mode, {
        preserveView: false
      });
      cameraCurrent.position.fromArray(mode.position);
      if (mode.up) {
        cameraCurrent.up.fromArray(mode.up);
      }
      orbitControls.target.fromArray(mode.target);
      cameraCurrent.zoom = mode.zoom;
      if (mode.frameSize) {
        cameraCurrent.userData.frameSize = mode.frameSize;
      }
      cameraCurrent.userData.cameraView = cameraView.cameraView;
      cameraCurrent.userData.topRotation = cameraView.cameraTopRotation;
      getCameraPose(cameraCurrent, orbitControls.target);
      onPreviewContainerResize();
      recreateOrbitControlsAtTarget(orbitControls.target.clone());
      height = motionState ? {
        ...motionState
      } : null;
      requestRender();
    },
    topView() {
      nudgeCamera("top", {
        force: true
      });
    }
  };
}
clearInspectorHover();
