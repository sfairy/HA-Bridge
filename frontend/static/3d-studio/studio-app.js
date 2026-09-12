import { windowGeometryParts } from "./studio-window-geometry.js?v=20260911-wide-window-v1";
import { addSecurityModel } from "./studio-security-models.js?v=20260911-reference-palette-v1";
import { compactRuntimeFurniture } from "./studio-runtime-furniture.js?v=20260909-runtime-furniture-v1";
import { createReflectionDetail } from "./studio-reflection-detail.js?v=20260909-reflection-scope-v1";
import { createFloorTransition } from "./studio-floor-transition.js?v=20260909-floor-reuse-v2-20260911-floor-handoff-v1";
import { floorOpeningPolygon } from "./studio-floor-openings.js?v=20260908-floor-openings-v1";
import { createGroundReflections } from "./studio-ground-reflections.js?v=20260909-reflection-scope-v1";
import { createMotionPresentation } from "./studio-motion-presentation.js?v=20260910-effects-settle-v6-focus-live-v1";
import { createWallSideMaterial, setWallGradientHeight, setWallCornerDistances, mergeWallBands } from "./studio-wall-materials.js?v=wall-device-D6-20260910210335-shade-v2";
import { RENDER_CACHE_VERSION, createRenderCache, cacheSceneDescriptor, sha256, stableCacheJSON } from "../modules/interaction3d/render-cache.js?v=20260907-demand-v1-20260908-curtains-v1";
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
import { createExternalModelManager, ALL_ITEM_MODELS } from "./studio-external-models.js?v=20260904-studio-external-models-v48-load-state-20260905-client-log-v1-20260907-cache-representation-v1-20260908-curtains-v1-20260908-bed-base-v1-20260910-glasscabinet-back-v1";
import { createPlanDrawingTools, drawTrackedText } from "./studio-plan-drawing.js?v=20260901-studio-plan-drawing-v2";
import { createSpotShadowAtlasController } from "./studio-shadow-atlas.js?v=20260910-three-0186-sun-lights-v1";
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
const renderCache2 = isStageEmbed ? createRenderCache({
  sceneId: new URLSearchParams(window.location.search).get("sceneId"),
  projectId: new URLSearchParams(window.location.search).get("projectId"),
  report: argPrimary => {
    document.documentElement.dataset.lightRenderCache = JSON.stringify(argPrimary);
  }
}) : null;
window.addEventListener("pagehide", () => renderCache2?.close(), {
  once: true
});
function computeLightRenderCacheKey(width, height) {
  const floors = getPreviewFloorMode2() === "all" ? projectDoc2.floors : [activeFloor()];
  camera2.updateMatrixWorld();
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
    mode: getPreviewFloorMode2(),
    gap: projectDoc2.previewFloorGap,
    lighting: baseLighting,
    style: themeColors,
    visibility,
    reflections: exportFolderQuery,
    curtains: saveState,
    models: externalModels2.cacheRepresentation(floors.flatMap(scene => scene.scene.items)),
    camera: {
      world: roundMatrix(camera2.matrixWorld.elements),
      projection: roundMatrix(camera2.projectionMatrix.elements)
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
const isAutoDiagramEmbed2 = new URLSearchParams(window.location.search).get("auto-diagram-embed") === "1";
const exportFolderQuery2 = new URLSearchParams(window.location.search).get("export-folder") || "";
const floorSelectionQuery2 = new URLSearchParams(window.location.search).has("floor-selection") ? new URLSearchParams(window.location.search).get("floor-selection") : null;
if (isAutoDiagramEmbed2) {
  document.body.classList.add("auto-diagram-embedded");
}
const planCanvas2 = selectEl("#plan-canvas");
const planStage = selectEl("#plan-stage");
const mf = selectEl("#canvas-empty");
const floorRenameInput = selectEl("#project-name");
const saveState2 = selectEl("#save-state");
const importPlan2 = selectEl("#import-plan");
const Ia = selectEl("#plan-file");
const toggleBackground = selectEl("#toggle-background");
const Ud = selectEl("#remove-plan");
const yf = selectEl("#add-floor");
const floorList = selectEl("#floor-list");
const alignFloor = selectEl("#align-floor");
const floorContextMenu = selectEl("#floor-context-menu");
const bl = selectEl("#floor-rename-dialog");
const toolEls = selectEl("#floor-rename-form");
const floorRenameInput2 = selectEl("#floor-rename-input");
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
const activeToolLabel2 = selectEl("#active-tool-label");
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
const applyLightPropertyEls2 = [...document.querySelectorAll("[data-apply-light-property]")];
const toast2 = selectEl("#toast");
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
const exportFloorGap2 = selectEl("#export-floor-gap");
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
const detailsPanelEl2 = selectEl(".details-panel");
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
const lightItemTypes2 = new Set(["downlight", "ceilinglight", "striplight"]);
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
  return !!projectDoc2?.floors?.some(floor => floor.scene?.items?.some(tvMountStyle => {
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
  const floors = getPreviewFloorMode2() === "all" ? projectDoc2?.floors || [] : [activeFloor()].filter(Boolean);
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
const L0 = new GLTFLoader();
L0.setDRACOLoader(dracoLoader);
let modelLoadStatusTimer2 = null;
let modelsLoading = false;
let deferExternalModels2 = false;
let externalModelQueueActive = false;
let deferredModelTasks = [];
let deferredModelTimer2 = null;
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
  window.clearTimeout(deferredModelTimer2);
  deferredModelTimer2 = window.setTimeout(() => {
    deferredModelTimer2 = null;
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
  window.clearTimeout(deferredModelTimer2);
  deferredModelTimer2 = null;
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
  if (!isAutoDiagramEmbed2 && !deferExternalModels2) {
    if (isLeavingStudio || previewOrbitLocked) {
      modelsLoading = true;
      return;
    }
    window.clearTimeout(modelLoadStatusTimer2);
    modelLoadStatusTimer2 = window.setTimeout(() => {
      modelLoadStatusTimer2 = null;
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
  window.clearTimeout(modelLoadStatusTimer2);
  modelLoadStatusTimer2 = null;
  rebuildPreviewMeshes({
    force: true,
    precompile: true
  });
}
const externalModels2 = createExternalModelManager({
  THREE,
  loader: L0,
  stairItemTypes: Vl,
  isModelInUse: projectHasItemModel,
  requestRender: requestModelRender,
  onLoadStateChange: updateModelLoadStatus,
  maxConcurrentLoads: 2
});
const {
  loadExternalItemModel,
  modelTypeForItem
} = externalModels2;
function updateModelLoadStatus(active = externalModels2.modelLoadState()) {
  if (!modelLoadingStatus) {
    return;
  }
  const flag = active.active > 0 || active.queued > 0;
  if (!flag && modelsLoading) {
    modelsLoading = false;
    window.clearTimeout(modelLoadStatusTimer2);
    modelLoadStatusTimer2 = null;
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
  const value = externalModels2.addExternalItemModel(item, group, theme, {
    selected: isSelected("item", group.id)
  });
  updateModelLoadStatus();
  return value;
}
const lightPropertyMeta2 = {
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
  const propMeta = lightPropertyMeta2[prop];
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
const planCtx = planCanvas2.getContext("2d");
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
let hasProjectLoaded2 = null;
let projectLoadGeneration = 0;
let planBackgroundRevision = 0;
let floorScene2 = createEmptyFloorScene();
let projectDoc2 = null;
let activeFloorId = "";
let forcedVisibleLightGroupIds = null;
let planBackgroundImage2 = null;
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
let wallDrawAnchor2 = null;
let shiftKeyHeld = null;
let alignSession = null;
let floorSwitchGeneration = 0;
let contextFloorId = "";
let pendingDeleteFloorId = "";
let no = null;
let Fi = null;
let at = null;
let Uo = null;
let railingPlacementPreview2 = null;
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
let saveConflictState2 = null;
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
let exportPresetEditorOpen2 = false;
let exportUiDebounceTimer2 = null;
let exportOverwriteResolver2 = null;
let shadowCameraExpanded = false;
let savedSpotShadowCamera = null;
const hc = 1852;
const fc = 1293;
let Tn = hc / fc;
let previewScene2 = null;
let camera2 = null;
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
let orbitResumeTimer2 = null;
let stageSessionEndTimer = null;
let isBakingLightCache = false;
let isRebuildingWorld = false;
let residentCacheMode = false;
let lightCacheEpoch = 0;
let lightCacheReady = false;
let previewQualityJustBecameReady = false;
let lightCacheTileMap2 = new Map();
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
let recentFrameMsSamples2 = [];
let qualityProbeStartMs = 0;
let slowFrameStreak = 0;
let adaptiveFpsEstimate = null;
const O0 = new WeakSet();
let isLightPrecompiling = false;
let lightPrecompileRequested = false;
let cs = 0;
let lightPrecompileTimer = null;
let ORBIT_DOLLY_SPEED_MAX = false;
let ORBIT_DOLLY_SPEED_SCALE = false;
let PRECOMPILE_TIMEOUT_MS = "";
let G0 = 0;
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
  const scene2 = normalizeFloorScene(scene);
  const clamp2 = clamp(finite(projectDoc2?.defaultFloorHeight, 3), 1.8, 8);
  return {
    id: makeId("floor"),
    name: defaultFloorChineseName(elevation),
    elevation: elevation * clamp2,
    offsetX: 0,
    offsetZ: 0,
    rotation: 0,
    originX: scene2.background?.width ? scene2.background.width / 2 : 0,
    originY: scene2.background?.height ? scene2.background.height / 2 : 0,
    originInitialized: !!scene2.background,
    aligned: elevation === 0,
    alignmentPending: elevation > 0,
    scene: scene2
  };
}
function normalizeProjectDocument(projectDoc2) {
  const list = Array.isArray(projectDoc2?.floors) ? projectDoc2.floors : null;
  const floors = list?.length ? list.map((floor, argSecondary) => {
    const scene = normalizeFloorScene(floor?.scene);
    const flag2 = floor?.originInitialized === true;
    const normalizeLabelText2 = normalizeLabelText(floor?.name, defaultFloorChineseName(argSecondary), 24);
    const name = normalizeLabelText2 === argSecondary + 1 + "层" ? defaultFloorChineseName(argSecondary) : normalizeLabelText2;
    return {
      id: String(floor?.id || makeId("floor")),
      name,
      elevation: clamp(finite(floor?.elevation, argSecondary * 3), -30, 120),
      offsetX: clamp(finite(floor?.offsetX, 0), -100, 100),
      offsetZ: clamp(finite(floor?.offsetZ, 0), -100, 100),
      rotation: clamp(finite(floor?.rotation, 0), -180, 180),
      originX: flag2 ? finite(floor?.originX, 0) : scene.background?.width ? scene.background.width / 2 : 0,
      originY: flag2 ? finite(floor?.originY, 0) : scene.background?.height ? scene.background.height / 2 : 0,
      originInitialized: flag2 || !!scene.background,
      aligned: argSecondary === 0 || floor?.aligned === true || Math.abs(finite(floor?.offsetX, 0)) > 0.000001 || Math.abs(finite(floor?.offsetZ, 0)) > 0.000001,
      alignmentPending: floor?.alignmentPending === true,
      scene
    };
  }) : [createFloorEntry(0, projectDoc2)];
  const id2 = String(projectDoc2?.activeFloorId || "");
  const id22 = floors.find(id3 => id3.id === id2) || floors[0];
  const clamp2 = clamp(finite(projectDoc2?.defaultFloorHeight, 3), 0, 20);
  const flag = finite(projectDoc2?.schemaVersion, 0) >= 6;
  const exportPresets = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  return {
    schemaVersion: 7,
    activeFloorId: id22.id,
    defaultFloorHeight: clamp(finite(projectDoc2?.defaultFloorHeight, 3), 1.8, 8),
    previewFloorGap: clamp(flag ? finite(projectDoc2?.previewFloorGap, 3) : clamp2 + finite(projectDoc2?.previewFloorGap, 0), 0, 20),
    exportFloorGap: clamp(flag ? finite(projectDoc2?.exportFloorGap, 3) : clamp2 + finite(projectDoc2?.exportFloorGap, 0), 0, 20),
    previewFloorMode: projectDoc2?.previewFloorMode === "all" ? "all" : "active",
    combinedCameraSettings: normalizeCameraSettings(projectDoc2?.combinedCameraSettings),
    combinedFixedCameraView: normalizeFixedCameraView(projectDoc2?.combinedFixedCameraView),
    baseLighting: normalizeBaseLighting(projectDoc2?.baseLighting),
    exportPresets,
    activeExportPresetSlot: normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, exportPresets.length),
    floors
  };
}
function activeFloor() {
  const value = stageSession?.selectedFloorId || activeFloorId;
  return projectDoc2?.floors.find(item => item.id === value) || projectDoc2?.floors[0] || null;
}
function cloneProjectDoc() {
  return structuredClone(projectDoc2 || normalizeProjectDocument(floorScene2));
}
function cloneProjectForStage() {
  const projectDoc2 = cloneProjectDoc();
  if (!stageSession) {
    return projectDoc2;
  }
  projectDoc2.previewFloorMode = stageSession.floorMode;
  for (const floor of projectDoc2.floors || []) {
    const floorCameraSetting = stageSession.floorCameraSettings.get(floor.id);
    if (floorCameraSetting) {
      floor.scene.settings.cameraMode = floorCameraSetting.mode;
      floor.scene.settings.cameraView = floorCameraSetting.view;
      floor.scene.settings.cameraTopRotation = floorCameraSetting.topRotation;
      floor.scene.settings.cameraFocalLength = floorCameraSetting.focalLength;
    }
  }
  projectDoc2.combinedCameraSettings = {
    ...stageSession.combinedCameraSettings
  };
  return projectDoc2;
}
function uniqueFloorName(name, exceptId = "") {
  const usedNames = new Set((projectDoc2?.floors || []).filter(floor => floor.id !== exceptId).map(floor => floor.name));
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
  disabled.disabled = projectDoc2.floors.length <= 1;
  floorContextMenu.hidden = false;
  floorContextMenu.style.left = Math.min(event.clientX, window.innerWidth - 116) + "px";
  floorContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 82) + "px";
}
function confirmDeleteFloor(id) {
  if (!!id && !(projectDoc2.floors.length <= 1)) {
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
  const id2 = projectDoc2.floors.find(id3 => id3.id === pendingDeleteFloorId);
  closeFloorDeleteDialog();
  if (!id2 || projectDoc2.floors.length <= 1) {
    return;
  }
  const value = projectDoc2.floors.findIndex(id3 => id3.id === id2.id);
  projectDoc2.floors.splice(value, 1);
  projectDoc2.floors.forEach((elevation, argSecondary) => {
    elevation.elevation = argSecondary * projectDoc2.defaultFloorHeight;
  });
  const id22 = projectDoc2.floors[Math.max(0, value - 1)] || projectDoc2.floors[0];
  await switchActiveFloor(id22.id, {
    persist: false
  });
  syncPreviewFloorButtons();
  scheduleSave();
  showToast("已删除“" + id2.name + "”。", "success");
}
function openFloorRenameDialog(id) {
  if (id) {
    contextFloorId = id.id;
    floorRenameInput2.value = id.name;
    bl.showModal();
    requestAnimationFrame(() => floorRenameInput2.select());
  }
}
function renderFloorList() {
  if (projectDoc2) {
    floorList.replaceChildren();
    for (const floor of projectDoc2.floors) {
      const el2 = document.createElement("div");
      el2.className = "floor-row" + (floor.id === activeFloorId ? " active" : "") + (floor.aligned ? "" : " unaligned");
      el2.dataset.floorId = floor.id;
      el2.draggable = true;
      el2.setAttribute("aria-label", floor.name + "，" + (floor.id === activeFloorId ? "当前楼层，" : "") + "长按拖动排序，右键可重命名或删除");
      let dragReady = false;
      let dragTimer = null;
      const clearDragReady = () => {
        if (dragTimer) {
          clearTimeout(dragTimer);
        }
        dragTimer = null;
        dragReady = false;
        el2.classList.remove("drag-ready");
      };
      el2.addEventListener("pointerdown", event => {
        if (event.button === 0 && !event.target.closest("button")) {
          clearDragReady();
          dragTimer = setTimeout(() => {
            dragTimer = null;
            dragReady = true;
            el2.classList.add("drag-ready");
          }, 280);
        }
      });
      el2.addEventListener("pointerup", clearDragReady);
      el2.addEventListener("pointercancel", clearDragReady);
      el2.addEventListener("dragstart", event => {
        if (!dragReady) {
          event.preventDefault();
          clearDragReady();
          return;
        }
        draggingFloorId = floor.id;
        el2.classList.remove("drag-ready");
        el2.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-floor", floor.id);
      });
      el2.addEventListener("dragend", () => {
        draggingFloorId = "";
        el2.classList.remove("dragging");
        clearDragReady();
        clearFloorDropIndicators();
      });
      el2.addEventListener("dragover", event => {
        if (!draggingFloorId || draggingFloorId === floor.id) {
          return;
        }
        event.preventDefault();
        clearFloorDropIndicators();
        const placeAfter = event.clientY >= el2.getBoundingClientRect().top + el2.getBoundingClientRect().height / 2;
        el2.dataset.dropPosition = placeAfter ? "after" : "before";
        el2.classList.add(placeAfter ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el2.addEventListener("drop", event => {
        if (!draggingFloorId || draggingFloorId === floor.id) {
          return;
        }
        event.preventDefault();
        const sourceId = draggingFloorId;
        const placeAfter = el2.dataset.dropPosition === "after";
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
      const floorIndex = projectDoc2.floors.findIndex(entry => entry.id === floor.id);
      statusEl.textContent = floorIndex === 0 ? "基准" : floor.aligned ? "已对齐" : "待对齐";
      el2.addEventListener("click", () => {
        switchActiveFloor(floor.id, {
          persist: true
        });
      });
      el2.addEventListener("contextmenu", event => {
        event.preventDefault();
        showFloorContextMenu(floor, event);
      });
      el2.append(button, nameEl, statusEl);
      floorList.append(el2);
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
  const reorderFloors2 = reorderFloors(projectDoc2.floors, sourceId, targetId, placeAfter, projectDoc2.defaultFloorHeight);
  if (reorderFloors2 === projectDoc2.floors) {
    return;
  }
  const floor = projectDoc2.floors.find(item => item.id === sourceId);
  projectDoc2.floors = reorderFloors2;
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
  const value = floor ? projectDoc2.floors.findIndex(item => item.id === floor.id) : -1;
  const flag = projectDoc2.floors.length > 1 && value > 0;
  alignFloor.hidden = !flag;
  alignFloor.disabled = !flag || !floor?.scene?.calibration;
  alignFloor.textContent = floor?.aligned ? "重新对齐" : "对齐楼层";
  if (alignSession?.stage === "reference") {
    activeToolLabel2.textContent = "楼层对齐 · 参照层";
    toolHelp.textContent = "点击" + alignSession.referenceFloor.name + "上的楼梯角、墙角或柱点；Esc 取消";
  } else if (alignSession?.stage === "current") {
    activeToolLabel2.textContent = "楼层对齐 · 当前层";
    toolHelp.textContent = "点击" + floor.name + "上的相同位置；系统会自动重合上下楼层";
  }
}
async function switchActiveFloor(floorId, {
  persist: flag = false
} = {}) {
  const id2 = projectDoc2?.floors.find(item => item.id === floorId);
  if (!id2) {
    return;
  }
  const value = ++floorSwitchGeneration;
  const view = getPreviewFloorMode2() === "all" ? serializeCameraState() : null;
  if (alignSession?.floorId !== id2.id) {
    alignSession = null;
  }
  activeFloorId = id2.id;
  projectDoc2.activeFloorId = id2.id;
  floorScene2 = id2.scene;
  on = "";
  clearSelection();
  resetWallDrawing2();
  wallDrawAnchor2 = null;
  undoStack = [];
  redoStack = [];
  planView.rotation = floorScene2.settings.planViewRotation;
  Promise.allSettled(loadVisibleExternalModels());
  await reloadPlanBackground();
  if (value === floorSwitchGeneration && activeFloorId === id2.id) {
    refreshViews();
    updateAlignFloorButton();
    fitPlanViewToContent();
    requestAnimationFrame(() => {
      if (value === floorSwitchGeneration && activeFloorId === id2.id) {
        if (getPreviewFloorMode2() === "all") {
          if (view) {
            applyStoredCameraPose(view, view.viewportAspect);
          }
          syncCameraModeButtons(getCameraProjectionMode());
          syncCameraViewButtons(cameraViewMode());
          return;
        }
        if (floorScene2.settings.fixedCameraView) {
          restoreFixedCameraView({
            recordChange: false,
            silent: true
          });
          return;
        }
        setCameraProjectionMode(getCameraProjectionMode(), {
          preserveView: false
        });
        applyCameraView2();
      }
    });
    if (flag) {
      scheduleSave();
    }
  }
}
async function addNewFloor() {
  const value = createFloorEntry(projectDoc2.floors.length);
  value.name = uniqueFloorName(value.name);
  projectDoc2.floors.push(value);
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
  const floorIndex = projectDoc2?.floors.findIndex(entry => entry.id === floor?.id) ?? -1;
  const referenceFloor = floorIndex > 0 ? projectDoc2.floors[floorIndex - 1] : null;
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
    planCanvas2.style.cursor = "crosshair";
    updateAlignFloorButton();
    drawPlan();
    showToast("先在半透明的" + referenceFloor.name + "上点击一个参照点。");
  }
}
function cancelAlignFloorSession() {
  if (alignSession) {
    alignSession = null;
    planCanvas2.style.cursor = "";
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
  planCanvas2.style.cursor = "";
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
  const gap = clamp(finite(previewFloorGapInput.value, projectDoc2?.previewFloorGap || 3), 0, 20);
  if (!(Math.abs(gap - finite(projectDoc2?.previewFloorGap, 3)) < 0.000001)) {
    projectDoc2.previewFloorGap = gap;
    previewFloorGapInput.value = gap.toFixed(1);
    rebuildWorldPreview2();
    scheduleSave();
  }
}
function commitExportFloorGap() {
  const gap = clamp(finite(exportFloorGap2.value, projectDoc2?.exportFloorGap || 3), 0, 20);
  if (!(Math.abs(gap - finite(projectDoc2?.exportFloorGap, 3)) < 0.000001)) {
    projectDoc2.exportFloorGap = gap;
    exportFloorGap2.value = gap.toFixed(1);
    rebuildWorldPreview2();
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
  const finite2 = finite(scene.schemaVersion, 0);
  const pixelsPerMeter2 = clamp(finite(scene.calibration?.pixelsPerMeter, 0), 0, 100000);
  const calibration = pixelsPerMeter2 > 0 ? {
    pixelsPerMeter: pixelsPerMeter2,
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
  const entries2 = Array.isArray(scene.doors) ? scene.doors.map(attachment => ({
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
  const entries3 = Array.isArray(scene.railings) ? scene.railings.map(attachment => ({
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
    const clamp2 = clamp(finite(item?.width, size.width), 0.1, 8);
    const clamp3 = clamp(finite(item?.depth, size.depth), 0.1, 8);
    const flag = finite2 < 2 && item?.type === "striplight" && clamp3 > clamp2;
    const normalizeFullRotation2 = normalizeFullRotation(finite(item?.rotation) + (flag ? 90 : 0));
    const clamp4 = clamp(finite(item?.height, size.height), itemMinimumHeight(item?.type), 6);
    const flag2 = item?.type === "desktop" && Math.abs(clamp2 - 1.2) < 0.01 && Math.abs(clamp3 - 0.65) < 0.01;
    const flag3 = item?.type === "plant" && Math.abs(clamp2 - 0.6) < 0.01 && Math.abs(clamp3 - 0.6) < 0.01 && Math.abs(clamp4 - 1.15) < 0.01;
    const flag4 = item?.type === "toilet" && Math.abs(clamp2 - 0.7) < 0.01 && Math.abs(clamp3 - 0.42) < 0.01;
    const flag5 = item?.type === "floorlamp" && Math.abs(clamp2 - 0.9) < 0.01 && Math.abs(clamp3 - 0.45) < 0.01 && Math.abs(clamp4 - 1.8) < 0.01;
    const flag6 = item?.type === "rug" && clamp4 >= 0.045;
    const flag7 = item?.type === "downlight" && clamp2 < 0.3 && clamp3 < 0.3;
    const flag8 = item?.type === "piano" && clamp3 < 1;
    const temperature = defaultLightPresets[item?.type] || defaultLightPresets.downlight;
    const lightGroupId = lightItemTypes2.has(item?.type) ? lightGroupIds.has(String(item?.lightGroupId || "")) ? String(item.lightGroupId) : ensureLightGroup(item?.lightGroup || "默认灯组").id : "";
    const tvLayerIndex = item?.type === "tv" ? ++tvCount : 0;
    const smallCarLayerIndex = item?.type === "smallcar" ? ++smallCarCount : 0;
    return {
      id: String(item?.id || makeId("item")),
      type: item?.type === "rounddiningtableturntable" ? "rounddiningtable" : furnitureCatalog[item?.type] ? item.type : "table",
      x: finite(item?.x),
      y: finite(item?.y),
      rotation: item?.type === "striplight" ? normalizeFullRotation2 : finite(item?.rotation),
      width: item?.type === "striplight" ? Math.max(clamp2, clamp3) : flag2 || flag3 || flag5 || flag4 || flag7 || flag8 ? size.width : clamp2,
      depth: item?.type === "striplight" ? Math.min(clamp2, clamp3) : flag2 || flag3 || flag5 || flag4 || flag7 || flag8 ? size.depth : clamp3,
      height: item?.type === "sideboard" && clamp4 < 1.4 || flag2 || flag3 || flag4 || flag6 || flag8 ? size.height : clamp4,
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
      ...(lightItemTypes2.has(item?.type) ? {
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
  const wallOpenings = buildWallOpeningsIndex(list, entriesVar, entries2, pixelsPerMeter2, entries3);
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
function cloneFloorScene(argPrimary = floorScene2) {
  return structuredClone(argPrimary);
}
function resolveLightGroup(lightGroup) {
  return floorScene2.lightGroups?.find(item => item.id === lightGroup?.lightGroupId) || floorScene2.lightGroups?.[0] || null;
}
function findLightGroup(lightGroup, lightGroups = floorScene2) {
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
  return floorScene2.items.filter(item => item.type === "tv");
}
function smallCarItemsOnFloor() {
  return floorScene2.items.filter(item => item.type === "smallcar");
}
function previewFloorEntries() {
  if (getPreviewFloorMode2() === "all") {
    return projectDoc2.floors;
  } else {
    return [activeFloor()].filter(Boolean);
  }
}
function floorStackOffsetY(id) {
  if (getPreviewFloorMode2() !== "all") {
    return 0;
  }
  const value = projectDoc2.floors.findIndex(item => item.id === id?.id);
  return Math.max(value, 0) * finite(projectDoc2.exportFloorGap, 3);
}
function floorScopedKey(argPrimary, argSecondary) {
  return argPrimary + ":" + argSecondary;
}
function layerScopedKey(flag, argSecondary) {
  return (flag || "floor") + ":" + argSecondary;
}
function previewScopedItemKey(argPrimary, value) {
  if (getPreviewFloorMode2() === "all") {
    return floorScopedKey(argPrimary, value);
  } else {
    return value;
  }
}
function collectVisibleLights() {
  return (getPreviewFloorMode2() === "all" ? projectDoc2?.floors || [] : [activeFloor()].filter(Boolean)).flatMap(floor => floor.scene.items.filter(item => lightItemTypes2.has(item.type)).map(item => {
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
function collectLightGroupsAcrossFloors(list = projectDoc2?.floors || []) {
  return list.flatMap(floor => floor.scene.lightGroups.map((group, index) => ({
    floor,
    group,
    index,
    key: floorScopedKey(floor.id, group.id),
    lights: floor.scene.items.filter(item => lightItemTypes2.has(item.type) && item.lightGroupId === group.id)
  })));
}
function collectTvsAcrossFloors(list = projectDoc2?.floors || []) {
  return list.flatMap(floor => floor.scene.items.filter(item => item.type === "tv").map((item, index) => ({
    floor,
    item,
    index,
    key: floor.id + ":" + item.id
  })));
}
function collectSmallCarsAcrossFloors(list = projectDoc2?.floors || []) {
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
  const list = floorScene2.lightGroups ||= [];
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
  for (const id2 of floorScene2.lightGroups || []) {
    const el2 = document.createElement("option");
    el2.value = id2.id;
    el2.textContent = id2.name;
    value.append(el2);
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
  disabled.disabled = floorScene2.lightGroups.length <= 1;
  lightGroupContextMenu.hidden = false;
  lightGroupContextMenu.style.left = Math.min(event.clientX, window.innerWidth - 116) + "px";
  lightGroupContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 108) + "px";
}
function deleteLightGroup(id) {
  if (!id || floorScene2.lightGroups.length <= 1) {
    return;
  }
  pushHistory();
  const id22 = floorScene2.lightGroups.find(id3 => id3.id !== id.id);
  const value = new Set(floorScene2.items.filter(item => lightItemTypes2.has(item.type) && item.lightGroupId === id.id).map(id3 => id3.id));
  floorScene2.items = floorScene2.items.filter(id3 => !value.has(id3.id));
  floorScene2.lightGroups = floorScene2.lightGroups.filter(id3 => id3.id !== id.id);
  if (selection?.kind === "item" && value.has(selection.id)) {
    selection = null;
  }
  multiSelection = multiSelection.filter(kind => kind.kind !== "item" || !value.has(kind.id));
  if (on === id.id) {
    on = id22.id;
  }
  refreshViews("lights");
  scheduleSave();
  showToast("已删除“" + id.name + "”及组内 " + value.size + " 盏灯。", "success");
}
function uniqueLightGroupName(argPrimary) {
  const value = new Set(floorScene2.lightGroups.map(named => named.name));
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
  const id2 = {
    ...structuredClone(lightGroup),
    id: makeId("light-group"),
    name: uniqueLightGroupName(lightGroup.name + " 副本")
  };
  const value = floorScene2.lightGroups.findIndex(item => item.id === lightGroup.id);
  floorScene2.lightGroups.splice(value + 1, 0, id2);
  const list = floorScene2.items.filter(item => lightItemTypes2.has(item.type) && item.lightGroupId === lightGroup.id).map(argPrimary => ({
    ...structuredClone(argPrimary),
    id: makeId("item"),
    lightGroupId: id2.id
  }));
  floorScene2.items.push(...list);
  on = id2.id;
  selection = list.length === 1 ? {
    kind: "item",
    id: list[0].id
  } : null;
  multiSelection = list.length > 1 ? list.map(id2 => ({
    kind: "item",
    id: id2.id
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
  const value = floorScene2.lightGroups.findIndex(item => item.id === argPrimary);
  const fromIndex = floorScene2.lightGroups.findIndex(item => item.id === argSecondary);
  if (value < 0 || fromIndex < 0 || value === fromIndex) {
    return;
  }
  const list = [...floorScene2.lightGroups];
  const [movedGroup] = list.splice(value, 1);
  const targetIndex = list.findIndex(item => item.id === argSecondary);
  list.splice(targetIndex + (flag ? 1 : 0), 0, movedGroup);
  if (!list.every((id, mutateFlag) => id.id === floorScene2.lightGroups[mutateFlag]?.id)) {
    pushHistory();
    floorScene2.lightGroups = list;
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
    for (const id2 of floorScene2.lightGroups) {
      const el2 = document.createElement("div");
      el2.className = "light-group-row" + (id2.id === on ? " active" : "");
      el2.dataset.lightGroupId = id2.id;
      el2.draggable = true;
      el2.setAttribute("aria-label", id2.name + "，长按拖动排序，右键可重命名、复制或删除");
      let flag = false;
      let flag2 = null;
      const onPointerUp = () => {
        if (flag2) {
          clearTimeout(flag2);
        }
        flag2 = null;
        flag = false;
        el2.classList.remove("drag-ready");
      };
      el2.addEventListener("pointerdown", event => {
        if (event.button === 0 && !event.target.closest("button")) {
          onPointerUp();
          flag2 = setTimeout(() => {
            flag2 = null;
            flag = true;
            el2.classList.add("drag-ready");
          }, 280);
        }
      });
      el2.addEventListener("pointerup", onPointerUp);
      el2.addEventListener("pointercancel", onPointerUp);
      el2.addEventListener("dragstart", event => {
        if (!flag) {
          event.preventDefault();
          onPointerUp();
          return;
        }
        draggingLightGroupId = id2.id;
        el2.classList.remove("drag-ready");
        el2.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-light-group", id2.id);
      });
      el2.addEventListener("dragend", () => {
        draggingLightGroupId = "";
        el2.classList.remove("dragging");
        onPointerUp();
        clearLightGroupDropIndicators();
      });
      el2.addEventListener("click", () => {
        on = id2.id;
        renderLightLayerPanel();
      });
      el2.addEventListener("contextmenu", event => {
        event.preventDefault();
        showLightGroupContextMenu(id2, event);
      });
      el2.addEventListener("dragover", event => {
        if (!draggingLightGroupId || draggingLightGroupId === id2.id) {
          return;
        }
        event.preventDefault();
        clearLightGroupDropIndicators();
        const flag3 = event.clientY >= el2.getBoundingClientRect().top + el2.getBoundingClientRect().height / 2;
        el2.dataset.dropPosition = flag3 ? "after" : "before";
        el2.classList.add(flag3 ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el2.addEventListener("drop", event => {
        if (!draggingLightGroupId || draggingLightGroupId === id2.id) {
          return;
        }
        event.preventDefault();
        const argPrimary = draggingLightGroupId;
        const value = el2.dataset.dropPosition === "after";
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
      const el22 = document.createElement("span");
      el22.className = "light-group-name";
      el22.textContent = id2.name;
      el22.title = "长按灯组后拖动排序，右键可重命名、复制或删除";
      const el3 = document.createElement("small");
      el3.textContent = String(floorScene2.items.filter(item => lightItemTypes2.has(item.type) && item.lightGroupId === id2.id).length);
      el2.append(button, el22, el3);
      lightGroupList.append(el2);
    }
    for (const [value, screenEnabled] of tvItemsOnFloor().entries()) {
      const el2 = document.createElement("div");
      el2.className = "light-group-row tv-screen-layer-row";
      el2.setAttribute("aria-label", (screenEnabled.screenLayerName || "电视画面 " + (value + 1)) + "，可独立开启或关闭");
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
      const el22 = document.createElement("span");
      el22.className = "light-group-name";
      el22.textContent = screenEnabled.screenLayerName || "电视画面 " + (value + 1);
      el22.title = "电视开启画面";
      const el3 = document.createElement("small");
      el3.textContent = "1";
      el2.append(button, el22, el3);
      lightGroupList.append(el2);
    }
    for (const [value, chargingEnabled] of smallCarItemsOnFloor().entries()) {
      const el2 = document.createElement("div");
      el2.className = "light-group-row car-charging-layer-row";
      el2.setAttribute("aria-label", (chargingEnabled.chargingLayerName || "汽车充电 " + (value + 1)) + "，可独立开启或关闭");
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
      const el22 = document.createElement("span");
      el22.className = "light-group-name";
      el22.textContent = chargingEnabled.chargingLayerName || "汽车充电 " + (value + 1);
      el22.title = "汽车充电中状态图层";
      const el3 = document.createElement("small");
      el3.textContent = "1";
      el2.append(button, el22, el3);
      lightGroupList.append(el2);
    }
  }
}
function setAllLightGroupsEnabled(mutateFlag) {
  const list = tvItemsOnFloor();
  const list2 = smallCarItemsOnFloor();
  if (!(floorScene2.lightGroups || []).every(enabled => enabled.enabled === mutateFlag) || !list.every(screenEnabled => screenEnabled.screenEnabled !== false === mutateFlag) || !list2.every(chargingEnabled => chargingEnabled.chargingEnabled === true === mutateFlag)) {
    pushHistory();
    for (const enabled of floorScene2.lightGroups) {
      enabled.enabled = mutateFlag;
    }
    for (const screenEnabled of list) {
      screenEnabled.screenEnabled = mutateFlag;
    }
    for (const chargingEnabled of list2) {
      chargingEnabled.chargingEnabled = mutateFlag;
    }
    requestLightGroupCacheRefresh(floorScene2.lightGroups.map(item => item.id));
    if (list.length || list2.length) {
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
  } else if (lightItemTypes2.has(item?.type)) {
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
  const list2 = floorScene2.items.filter(id => value.has(id.id));
  if (!list2.length || list2.some(type7 => type7.type === "flooropening")) {
    return "all";
  }
  const length = list2.filter(item => lightItemTypes2.has(item.type)).length;
  if (length === list2.length) {
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
  const list2 = floorScene2.items.filter(id => value.has(id.id));
  if (!list2.length) {
    return null;
  }
  const list3 = list2.filter(item => !lightItemTypes2.has(item.type) || item.type === "striplight");
  if (!list3.length) {
    return null;
  }
  const length = list3.filter(item => lightItemTypes2.has(item.type)).length;
  if (length === list3.length) {
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
  const value = buildWallOpeningsIndex(floorScene2.walls, floorScene2.windows, floorScene2.doors, pixelsPerMeter() || 1, floorScene2.railings);
  floorScene2.walls = value.walls;
  floorScene2.windows = value.windows;
  floorScene2.doors = value.doors;
  floorScene2.railings = value.railings;
}
function wallIdMap() {
  const lookupMap = new Map(floorScene2.walls.map(id => [id.id, id]));
  const mergeCollinearWallSegments2 = mergeCollinearWallSegments(floorScene2.walls, 0.000001);
  if (mergeCollinearWallSegments2.walls.length === floorScene2.walls.length) {
    return 0;
  }
  const map2 = new Map(mergeCollinearWallSegments2.walls.map(id => [id.id, id]));
  const remapOpeningWall = wall => {
    const flag = mergeCollinearWallSegments2.wallIdMap.get(wall.wallId);
    const flag2 = lookupMap.get(wall.wallId);
    const flag3 = map2.get(flag);
    if (!flag || !flag2 || !flag3) {
      return wall;
    }
    const remapWallAttachment2 = remapWallAttachment(wall, flag2, flag3);
    remapWallAttachment2.t = clampWindowT(flag3, remapWallAttachment2, pixelsPerMeter() || 1);
    return remapWallAttachment2;
  };
  const value = floorScene2.walls.length - mergeCollinearWallSegments2.walls.length;
  floorScene2.walls = mergeCollinearWallSegments2.walls;
  floorScene2.windows = floorScene2.windows.map(remapOpeningWall);
  floorScene2.doors = floorScene2.doors.map(remapOpeningWall);
  floorScene2.railings = floorScene2.railings.map(remapOpeningWall);
  return value;
}
function pixelsPerMeter() {
  return floorScene2.calibration?.pixelsPerMeter || 0;
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
    const flag2 = new StudioHttpError("登录状态已失效。", status.status, detail);
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  if (status.status === 403 && detail?.detail?.code === "LICENSE_RESTRICTED") {
    window.location.assign("/license");
    const flag2 = new StudioHttpError("当前授权无法使用户型图绘制。", status.status, detail);
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  if (!status.ok) {
    const message = detail?.detail;
    const flag2 = new StudioHttpError(typeof message == "string" ? message : message?.message || "请求失败（HTTP " + status.status + "）", status.status, detail);
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  return detail;
}
function showToast(argPrimary, argSecondary = "") {
  window.clearTimeout(toastTimer);
  toast2.textContent = argPrimary;
  toast2.className = ("toast visible " + argSecondary).trim();
  toastTimer = window.setTimeout(() => {
    toast2.className = "toast";
  }, argSecondary === "warning" ? 4400 : 2600);
}
function setSaveStateLabel(mutateFlag, argSecondary = "") {
  saveState2.className = ("save-state " + argSecondary).trim();
  saveState2.innerHTML = "<i></i>" + mutateFlag;
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
  floorScene2 = normalizeFloorScene(scene);
  const floor = activeFloor();
  if (floor) {
    floor.scene = floorScene2;
  }
  planView.rotation = floorScene2.settings.planViewRotation;
  clearSelection();
  resetWallDrawing2();
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
  window.clearTimeout(deferredModelTimer2);
  deferredModelTimer2 = null;
  deferredModelTasks = [];
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  hasProjectLoaded2 = floor;
  projectDoc2 = normalizeProjectDocument(floor.scene);
  if (isStageEmbed) {
    for (const floor2 of projectDoc2.floors) {
      floor2.scene.settings.livePreviewEnabled = true;
    }
  }
  applyBaseLighting(projectDoc2.baseLighting);
  activeFloorId = projectDoc2.activeFloorId;
  if (isAutoDiagramEmbed2 && floorSelectionQuery2 !== null) {
    const id2 = projectDoc2.floors.find(item => item.id === floorSelectionQuery2);
    if (floorSelectionQuery2 === "all" && projectDoc2.floors.length > 1) {
      projectDoc2.previewFloorMode = "all";
    } else if (id2) {
      projectDoc2.previewFloorMode = "active";
      projectDoc2.activeFloorId = id2.id;
      activeFloorId = id2.id;
    }
  }
  floorScene2 = activeFloor().scene;
  on = "";
  clearSelection();
  resetWallDrawing2();
  undoStack = [];
  redoStack = [];
  const list = visibleExternalModelKeys();
  const flag = isAutoDiagramEmbed2;
  if (flag) {
    deferExternalModels2 = true;
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
  planView.rotation = floorScene2.settings.planViewRotation;
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
        window.clearTimeout(modelLoadStatusTimer2);
        modelLoadStatusTimer2 = null;
        deferExternalModels2 = false;
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
        applyCameraView2();
      }
    });
  }
}
function showSaveConflict(latest, localScene, targetVersion) {
  saveConflictState2 = {
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
  if (isStageEmbed || !hasProjectLoaded2 || isFlushingSave || saveConflictState2 || saveGeneration === savedGeneration) {
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
      hasProjectLoaded2 = await putStudioDocument(hasProjectLoaded2);
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
    if (!saveConflictState2 && saveGeneration !== savedGeneration) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(flushSave, 500);
    }
  }
}
saveConflictDialog.addEventListener("cancel", event => event.preventDefault());
Mf.addEventListener("click", async () => {
  const isLatest = saveConflictState2;
  if (isLatest) {
    saveConflictState2 = null;
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
  const isLocalScene = saveConflictState2;
  if (isLocalScene) {
    projectDoc2 = normalizeProjectDocument(isLocalScene.localScene);
    activeFloorId = projectDoc2.activeFloorId;
    floorScene2 = activeFloor().scene;
    hasProjectLoaded2 = isLocalScene.latest;
    saveConflictState2 = null;
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
function screenToPlanWithView(planPoint2) {
  const planPoint = screenToPlan(planPoint2);
  return {
    x: (planPoint.x - planView.offsetX) / planView.zoom,
    y: (planPoint.y - planView.offsetY) / planView.zoom
  };
}
function pointerEventToCanvasPoint(event) {
  const left = planCanvas2.getBoundingClientRect();
  return {
    x: event.clientX - left.left,
    y: event.clientY - left.top
  };
}
function planContentBounds() {
  if (floorScene2.walls.length) {
    return modelBounds({
      background: null,
      walls: floorScene2.walls,
      items: []
    });
  } else if (floorScene2.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorScene2.items
    });
  } else {
    return modelBounds(floorScene2);
  }
}
function fitPlanViewToContent() {
  const value = planContentBounds();
  const clamp2 = clamp(Math.min(planWidth, planHeight) * 0.045, 18, 34);
  const fitWidth = Math.max(planWidth - clamp2 * 2, 80);
  const fitHeight = Math.max(planHeight - clamp2 * 2, 80);
  const flag = Math.abs(planView.rotation / 90) % 2 === 1;
  const fitContentHeight = flag ? value.height : value.width;
  const fitContentWidth = flag ? value.width : value.height;
  planView.zoom = clamp(Math.min(fitWidth / fitContentHeight, fitHeight / fitContentWidth), 0.03, 8);
  planView.offsetX = planWidth / 2 - (value.minX + value.width / 2) * planView.zoom;
  planView.offsetY = planHeight / 2 - (value.minY + value.height / 2) * planView.zoom;
  planNeedsRedraw = true;
  drawPlan();
}
function zoomPlanViewAt(argPrimary, planPoint3 = {
  x: planWidth / 2,
  y: planHeight / 2
}) {
  const planPoint = screenToPlanWithView(planPoint3);
  const planPoint2 = screenToPlan(planPoint3);
  planView.zoom = clamp(planView.zoom * argPrimary, 0.03, 12);
  planView.offsetX = planPoint2.x - planPoint.x * planView.zoom;
  planView.offsetY = planPoint2.y - planPoint.y * planView.zoom;
  drawPlan();
}
function rotatePlanView90() {
  planView.rotation = (planView.rotation + 90) % 360;
  floorScene2.settings.planViewRotation = planView.rotation;
  fitPlanViewToContent();
  scheduleSave();
}
function resizePlanCanvas() {
  const size = planStage.getBoundingClientRect();
  planWidth = Math.max(Math.round(size.width), 1);
  planHeight = Math.max(Math.round(size.height), 1);
  const value = Math.min(window.devicePixelRatio || 1, 2);
  planCanvas2.width = Math.round(planWidth * value);
  planCanvas2.height = Math.round(planHeight * value);
  planCtx.setTransform(value, 0, 0, value, 0, 0);
  if (planNeedsRedraw) {
    drawPlan();
  } else {
    fitPlanViewToContent();
  }
}
function getWallAnalysis(argPrimary) {
  const tolerance = Math.max(1, argPrimary * 0.01);
  const value = floorScene2.walls.map(wall => wall.id + "," + wall.start.x + "," + wall.start.y + "," + wall.end.x + "," + wall.end.y + "," + wall.thickness + "," + (wall.allowOpenEnd === true ? 1 : 0)).join(";");
  if (wallAnalysisCache.scene !== floorScene2 || wallAnalysisCache.signature !== tolerance + "|" + value) {
    wallAnalysisCache = {
      scene: floorScene2,
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
  value.floorPolygons ||= closedWallFloorPolygons(floorScene2.walls, value.tolerance);
  return value.floorPolygons;
}
function getWallIntersections(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.intersections ||= wallIntersections(floorScene2.walls);
  return value.intersections;
}
function getWallJoinExtensions(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.joinExtensions ||= wallJoinExtensions(floorScene2.walls);
  return value.joinExtensions;
}
function getUnclosedWallEndpoints(argPrimary) {
  const value = getWallAnalysis(argPrimary);
  value.unclosedEndpoints ||= unclosedWallEndpoints(floorScene2.walls, value.tolerance, getFloorPolygons(argPrimary));
  return value.unclosedEndpoints;
}
function wallAttachmentWorldPoint(size) {
  const wall = floorScene2.walls.find(item => item.id === size.wallId);
  if (!wall) {
    return null;
  }
  const value = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const flag = Math.hypot(value, dy);
  if (!flag) {
    return null;
  }
  const clampWindowT2 = clampWindowT(wall, size, pixelsPerMeter() || 1);
  const center = {
    x: wall.start.x + value * clampWindowT2,
    y: wall.start.y + dy * clampWindowT2
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
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(5 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.55);
    for (const planPoint7 of [isWall.start, isWall.end]) {
      drawPlanLine({
        x: planPoint7.x - planPoint6.x * maxValue,
        y: planPoint7.y - planPoint6.y * maxValue
      }, {
        x: planPoint7.x + planPoint6.x * maxValue,
        y: planPoint7.y + planPoint6.y * maxValue
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
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2.5 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.16);
    const distance2 = distance(isWall.start, isWall.end);
    const doorHingeSign = size.hinge === "right" ? 1 : -1;
    const slidingDoorPanelCenters2 = slidingDoorPanelCenters(distance2, doorHingeSign);
    const doorPanelInset = distance2 * 0.27;
    for (const [panelOffset, hingeSign] of [[slidingDoorPanelCenters2.fixed, -1], [slidingDoorPanelCenters2.moving, 1]]) {
      const planPoint7 = {
        x: isWall.center.x + isWall.unit.x * panelOffset,
        y: isWall.center.y + isWall.unit.y * panelOffset
      };
      const planPoint8 = {
        x: planPoint6.x * maxValue * hingeSign,
        y: planPoint6.y * maxValue * hingeSign
      };
      const doorHandlePointA = {
        x: planPoint7.x - isWall.unit.x * doorPanelInset + planPoint8.x,
        y: planPoint7.y - isWall.unit.y * doorPanelInset + planPoint8.y
      };
      const doorHandlePointB = {
        x: planPoint7.x + isWall.unit.x * doorPanelInset + planPoint8.x,
        y: planPoint7.y + isWall.unit.y * doorPanelInset + planPoint8.y
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
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08) * (size.swing === -1 ? -1 : 1);
    drawPlanLine({
      x: isWall.start.x + planPoint6.x * maxValue,
      y: isWall.start.y + planPoint6.y * maxValue
    }, {
      x: isWall.end.x + planPoint6.x * maxValue,
      y: isWall.end.y + planPoint6.y * maxValue
    }, {
      color,
      width: flag ? 5 : 4,
      cap: "butt"
    });
    const distance2 = distance(isWall.start, isWall.end);
    const maxValue2 = Math.max(3, Math.min(18, Math.round(size.width / 0.35)));
    for (let step = 1; step < maxValue2; step += 1) {
      const doorLeafOffset = distance2 * (step / maxValue2 - 0.5);
      const planPoint7 = {
        x: isWall.center.x + isWall.unit.x * doorLeafOffset + planPoint6.x * maxValue,
        y: isWall.center.y + isWall.unit.y * doorLeafOffset + planPoint6.y * maxValue
      };
      drawPlanLine({
        x: planPoint7.x - planPoint6.x * 3 / planView.zoom,
        y: planPoint7.y - planPoint6.y * 3 / planView.zoom
      }, {
        x: planPoint7.x + planPoint6.x * 3 / planView.zoom,
        y: planPoint7.y + planPoint6.y * 3 / planView.zoom
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
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const maxValue = Math.max(2 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08);
    drawPlanLine({
      x: isWall.start.x + planPoint6.x * maxValue,
      y: isWall.start.y + planPoint6.y * maxValue
    }, {
      x: isWall.end.x + planPoint6.x * maxValue,
      y: isWall.end.y + planPoint6.y * maxValue
    }, {
      color,
      width: preview.preview ? 3 : flag ? 5 : 4,
      cap: "butt"
    });
    drawPlanLine({
      x: isWall.start.x - planPoint6.x * maxValue,
      y: isWall.start.y - planPoint6.y * maxValue
    }, {
      x: isWall.end.x - planPoint6.x * maxValue,
      y: isWall.end.y - planPoint6.y * maxValue
    }, {
      color: "rgba(167, 178, 188, .72)",
      width: 1,
      cap: "butt"
    });
    const local7 = size.hinge === "right" ? -1 : 1;
    drawPlanPoint({
      x: isWall.center.x + isWall.unit.x * size.width * local7 * 0.34,
      y: isWall.center.y + isWall.unit.y * size.width * local7 * 0.34
    }, color, flag ? 3 : 2);
    if (flag) {
      drawFloatingLabel(isWall.center, "入户门（常闭）· " + size.width.toFixed(2) + " m", "#ffaf46");
    }
    return;
  }
  if (value === "double") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x
    };
    const local6 = size.swing === -1 ? -1 : 1;
    const local7 = distance(isWall.start, isWall.end) / 2 * local6;
    const local8 = {
      x: isWall.start.x + planPoint6.x * local7,
      y: isWall.start.y + planPoint6.y * local7
    };
    const local9 = {
      x: isWall.end.x + planPoint6.x * local7,
      y: isWall.end.y + planPoint6.y * local7
    };
    drawPlanLine(isWall.start, local8, {
      color,
      width: preview.preview ? 2 : flag ? 4 : 3,
      cap: "butt"
    });
    drawPlanLine(isWall.end, local9, {
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
  const flag2 = size.hinge === "right";
  const planPoint = flag2 ? isWall.end : isWall.start;
  const planPoint2 = flag2 ? isWall.start : isWall.end;
  const planPoint3 = {
    x: planPoint2.x - planPoint.x,
    y: planPoint2.y - planPoint.y
  };
  const local2 = size.swing === -1 ? -1 : 1;
  const planPoint4 = {
    x: planPoint.x - planPoint3.y * local2,
    y: planPoint.y + planPoint3.x * local2
  };
  drawPlanLine(planPoint, planPoint4, {
    color,
    width: preview.preview ? 2 : flag ? 4 : 3,
    cap: "butt",
    dash: preview.preview ? [5, 4] : null
  });
  if (value === "glass") {
    const planPoint6 = {
      x: isWall.unit.x * 3 / planView.zoom,
      y: isWall.unit.y * 3 / planView.zoom
    };
    drawPlanLine({
      x: planPoint.x + planPoint6.x,
      y: planPoint.y + planPoint6.y
    }, {
      x: planPoint4.x + planPoint6.x,
      y: planPoint4.y + planPoint6.y
    }, {
      color: "rgba(183, 229, 247, .58)",
      width: 1,
      cap: "butt"
    });
  }
  const planPoint5 = planToScreen(planPoint);
  const dist = distance(planPoint, planPoint2) * planView.zoom;
  const angle = Math.atan2(planPoint3.y, planPoint3.x);
  const local5 = angle + local2 * Math.PI / 2;
  planCtx.save();
  planCtx.strokeStyle = color;
  planCtx.lineWidth = preview.preview ? 1 : flag ? 2 : 1.25;
  if (preview.preview) {
    planCtx.setLineDash([5, 4]);
  }
  planCtx.beginPath();
  planCtx.arc(planPoint5.x, planPoint5.y, dist, angle, local5, local2 < 0);
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
  } else if (lightItemTypes2.has(item.type)) {
    const planLabelProjectionMetrics2 = Math.max(Math.min(planItemWidthPx, planItemDepthPx) * 0.44, item.type === "downlight" ? 10 : 8);
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
      planCtx.arc(0, 0, planLabelProjectionMetrics2, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.stroke();
      planCtx.beginPath();
      planCtx.arc(0, 0, planLabelProjectionMetrics2 * 0.5, 0, Math.PI * 2);
      planCtx.stroke();
      for (let zeroValue = 0; zeroValue < 4; zeroValue += 1) {
        const halfValue = zeroValue * Math.PI / 2;
        planCtx.beginPath();
        planCtx.moveTo(Math.cos(halfValue) * planLabelProjectionMetrics2 * 0.68, Math.sin(halfValue) * planLabelProjectionMetrics2 * 0.68);
        planCtx.lineTo(Math.cos(halfValue) * planLabelProjectionMetrics2 * 1.12, Math.sin(halfValue) * planLabelProjectionMetrics2 * 1.12);
        planCtx.stroke();
      }
    }
  } else if (item.type === "planlabel") {
    const cornerRadius = planLabelProjectionMetrics(planItemWidthPx, planItemDepthPx, item.lineLength);
    planCtx.fillStyle = "#929baa";
    const localValue = cornerRadius.titleFontSize;
    planCtx.font = "700 " + localValue + "px sans-serif";
    drawTrackedText(planCtx, item.title || "家庭总览", cornerRadius.titleStartX, cornerRadius.titleY, localValue * clamp(finite(item.titleSpacing, 1.05), 0, 1.8), cornerRadius.titleMaxWidth);
    const localValue2 = cornerRadius.iconX;
    const localValue3 = cornerRadius.iconY;
    const localValue4 = cornerRadius.iconSize;
    planCtx.fillStyle = "#929baa";
    planCtx.beginPath();
    planCtx.moveTo(localValue2, localValue3 - localValue4 * 0.58);
    planCtx.lineTo(localValue2 + localValue4 * 0.56, localValue3 - localValue4 * 0.02);
    planCtx.lineTo(localValue2 + localValue4 * 0.38, localValue3 - localValue4 * 0.02);
    planCtx.lineTo(localValue2 + localValue4 * 0.38, localValue3 + localValue4 * 0.5);
    planCtx.lineTo(localValue2 - localValue4 * 0.38, localValue3 + localValue4 * 0.5);
    planCtx.lineTo(localValue2 - localValue4 * 0.38, localValue3 - localValue4 * 0.02);
    planCtx.lineTo(localValue2 - localValue4 * 0.56, localValue3 - localValue4 * 0.02);
    planCtx.lineTo(localValue2, localValue3 - localValue4 * 0.52);
    planCtx.closePath();
    planCtx.fill();
    planCtx.fillStyle = "#929baa";
    planCtx.textAlign = "left";
    const localValue5 = cornerRadius.subtitleFontSize;
    planCtx.font = "400 " + localValue5 + "px \"Arial Narrow\", Arial, sans-serif";
    drawTrackedText(planCtx, item.subtitle || "HOME PLAN", cornerRadius.subtitleStartX, cornerRadius.subtitleY, localValue5 * clamp(finite(item.subtitleSpacing, 0.08), 0, 0.6), cornerRadius.subtitleMaxWidth);
    planCtx.strokeStyle = "rgba(146, 155, 170, .72)";
    planCtx.lineWidth = cornerRadius.baselineLineWidth;
    const localValue6 = cornerRadius.baselineY;
    const localValue7 = cornerRadius.baselineStartX;
    const computedValue = localValue7 + cornerRadius.baselineLength;
    planCtx.beginPath();
    planCtx.moveTo(localValue7, localValue6);
    planCtx.lineTo(computedValue, localValue6);
    planCtx.moveTo(localValue7, localValue6 - cornerRadius.baselineCapHalfHeight);
    planCtx.lineTo(localValue7, localValue6 + cornerRadius.baselineCapHalfHeight);
    planCtx.moveTo(computedValue, localValue6 - cornerRadius.baselineCapHalfHeight);
    planCtx.lineTo(computedValue, localValue6 + cornerRadius.baselineCapHalfHeight);
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
    const computedValue2 = computedValue * 0.7;
    planCtx.beginPath();
    planCtx.arc(-planItemWidthPx * 0.16, planItemDepthPx * 0.08, computedValue, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(planItemWidthPx * 0.24, -planItemDepthPx * 0.2, computedValue2, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (roundTableTypes.has(item.type)) {
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.32, planItemDepthPx * 0.32, 0, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    for (const [localValue, localValue2] of [[-0.38, 0], [0.38, 0], [0, -0.38], [0, 0.38]]) {
      planCtx.beginPath();
      planCtx.roundRect(planItemWidthPx * localValue - planItemWidthPx * 0.085, planItemDepthPx * localValue2 - planItemDepthPx * 0.095, planItemWidthPx * 0.17, planItemDepthPx * 0.19, Math.min(planItemWidthPx, planItemDepthPx) * 0.035);
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
    const computedValue2 = planItemWidthPx * 0.31;
    const localValue = Math.min(planItemDepthPx * 0.34, planItemWidthPx * 0.13);
    const localValue2 = Math.min(planItemDepthPx * 0.46, planItemWidthPx * 0.14);
    planCtx.lineCap = "round";
    planCtx.lineWidth = selected ? 2.4 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(computedValue, 0);
    planCtx.lineTo(computedValue2, 0);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(computedValue, 0, localValue, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(computedValue2, 0, localValue2, 0, Math.PI * 2);
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
      for (const factor2 of [-0.32, 0.32]) {
        planCtx.beginPath();
        planCtx.arc(planItemWidthPx * factor, planItemDepthPx * factor2, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.045), 0, Math.PI * 2);
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
function axisAlignedBounds(planPoint, planPoint2) {
  return {
    minX: Math.min(planPoint.x, planPoint2.x),
    minY: Math.min(planPoint.y, planPoint2.y),
    maxX: Math.max(planPoint.x, planPoint2.x),
    maxY: Math.max(planPoint.y, planPoint2.y)
  };
}
function pointInBounds(planPoint, minX) {
  return planPoint.x >= minX.minX && planPoint.x <= minX.maxX && planPoint.y >= minX.minY && planPoint.y <= minX.maxY;
}
function segmentHitsBounds(planPoint, point2, minX) {
  if (pointInBounds(planPoint, minX) || pointInBounds(point2, minX)) {
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
    if (segmentIntersection(planPoint, point2, list[value], list[(value + 1) % list.length])) {
      return true;
    }
  }
  return false;
}
function marqueeSelectHits(planPoint, point2) {
  const minX = axisAlignedBounds(planPoint, point2);
  const value = pixelsPerMeter() || 100;
  const list = [];
  const flag = assetCategory === "light";
  if (!flag) {
    for (const wall of floorScene2.walls) {
      if (segmentHitsBounds(wall.start, wall.end, minX)) {
        list.push({
          kind: "wall",
          id: wall.id
        });
      }
    }
    for (const size of floorScene2.windows) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "window",
          id: size.id
        });
      }
    }
    for (const size of floorScene2.doors) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "door",
          id: size.id
        });
      }
    }
    for (const size of floorScene2.railings) {
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
  for (const item of floorScene2.items) {
    if (lightItemTypes2.has(item.type) !== flag) {
      continue;
    }
    const rotationRad = item.rotation * Math.PI / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);
    const halfMeshWidth = item.width * value / 2;
    const halfMeshDepth = item.depth * value / 2;
    const some2 = [[-halfMeshWidth, -halfMeshDepth], [halfMeshWidth, -halfMeshDepth], [halfMeshWidth, halfMeshDepth], [-halfMeshWidth, halfMeshDepth]].map(([argPrimary, argPrimary2]) => ({
      x: item.x + argPrimary * cos - argPrimary2 * sin,
      y: item.y + argPrimary * sin + argPrimary2 * cos
    }));
    if (pointInBounds(item, minX) || some2.some(point3 => pointInBounds(point3, minX)) || someFlag.some(argPrimary => pointInRotatedRectangle(argPrimary, item, value))) {
      list.push({
        kind: "item",
        id: item.id
      });
    }
  }
  return list;
}
function ensureMeasureCanvas() {
  if (!planCanvas2.width || !planCanvas2.height || !measureCtx) {
    return false;
  } else {
    if (measureCanvas.width !== planCanvas2.width) {
      measureCanvas.width = planCanvas2.width;
    }
    if (measureCanvas.height !== planCanvas2.height) {
      measureCanvas.height = planCanvas2.height;
    }
    measureCtx.setTransform(1, 0, 0, 1, 0, 0);
    measureCtx.clearRect(0, 0, measureCanvas.width, measureCanvas.height);
    measureCtx.drawImage(planCanvas2, 0, 0);
    return true;
  }
}
function blitMeasureOverlay({
  offsetX: options = 0,
  offsetY: options2 = 0
} = {}) {
  if (!measureCanvas.width || !measureCanvas.height || measureCanvas.width !== planCanvas2.width || measureCanvas.height !== planCanvas2.height) {
    return false;
  }
  const value = planCanvas2.width / Math.max(planWidth, 1);
  const fitHeight = planCanvas2.height / Math.max(planHeight, 1);
  planCtx.save();
  planCtx.setTransform(1, 0, 0, 1, 0, 0);
  planCtx.fillStyle = "#0d1319";
  planCtx.fillRect(0, 0, planCanvas2.width, planCanvas2.height);
  planCtx.drawImage(measureCanvas, Math.round(options * value), Math.round(options2 * fitHeight));
  planCtx.restore();
  return true;
}
function drawMarqueeSelection() {
  if (dragState?.type !== "marquee") {
    return;
  }
  const planPoint = planToScreen(dragState.start);
  const planPoint2 = planToScreen(dragState.current);
  const value = Math.min(planPoint.x, planPoint2.x);
  const minValue = Math.min(planPoint.y, planPoint2.y);
  const absResult = Math.abs(planPoint2.x - planPoint.x);
  const absResult2 = Math.abs(planPoint2.y - planPoint.y);
  planCtx.save();
  planCtx.translate(planWidth / 2, planHeight / 2);
  planCtx.rotate(planView.rotation * Math.PI / 180);
  planCtx.translate(-planWidth / 2, -planHeight / 2);
  planCtx.fillStyle = "rgba(255, 157, 46, .10)";
  planCtx.strokeStyle = "rgba(255, 176, 74, .92)";
  planCtx.lineWidth = 1;
  planCtx.setLineDash([6, 4]);
  planCtx.fillRect(value, minValue, absResult, absResult2);
  planCtx.strokeRect(value + 0.5, minValue + 0.5, Math.max(absResult - 1, 0), Math.max(absResult2 - 1, 0));
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
  if (planBackgroundImage2 && floorScene2.background && floorScene2.settings.backgroundVisible) {
    const planPoint = planToScreen({
      x: 0,
      y: 0
    });
    planCtx.save();
    planCtx.globalAlpha = flag ? 0.3 : 0.54;
    planCtx.drawImage(planBackgroundImage2, planPoint.x, planPoint.y, floorScene2.background.width * planView.zoom, floorScene2.background.height * planView.zoom);
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
  for (const wall of floorScene2.walls) {
    const flag2 = isSelected("wall", wall.id);
    const width = Math.max(wall.thickness * value * planView.zoom, 4);
    if (flag2) {
      drawPlanLine(wall.start, wall.end, {
        color: "rgba(255, 157, 46, .38)",
        width: width + 7,
        cap: "square"
      });
    }
    drawPlanLine(wall.start, wall.end, {
      color: flag2 ? "#f1d7b9" : "#c7d0d7",
      width,
      cap: "square"
    });
    drawPlanLine(wall.start, wall.end, {
      color: "rgba(39, 51, 61, .82)",
      width: 1
    });
    if (activeTool === "wall" || flag2) {
      drawPlanPoint(wall.start, flag2 ? "#ff9d2e" : "#6c7c88", 3.5);
      drawPlanPoint(wall.end, flag2 ? "#ff9d2e" : "#6c7c88", 3.5);
    }
    if (flag2 && multiSelection.length <= 1) {
      drawFloatingLabel({
        x: (wall.start.x + wall.end.x) / 2,
        y: (wall.start.y + wall.end.y) / 2
      }, wallLengthMeters(wall, value).toFixed(2) + " m", "#ffb14f");
    }
  }
  for (const size of floorScene2.windows) {
    const isStart2 = wallAttachmentWorldPoint(size);
    if (!isStart2) {
      continue;
    }
    const flag2 = isSelected("window", size.id);
    drawPlanLine(isStart2.start, isStart2.end, {
      color: "rgba(7, 16, 21, .9)",
      width: Math.max(10, isStart2.wall.thickness * value * planView.zoom + 5),
      cap: "butt"
    });
    drawPlanLine(isStart2.start, isStart2.end, {
      color: flag2 ? "#ffaf46" : "#43d2e6",
      width: flag2 ? 5 : 3,
      cap: "butt"
    });
    drawPlanLine(isStart2.start, isStart2.end, {
      color: "rgba(224, 250, 255, .9)",
      width: 1,
      cap: "butt"
    });
    if (size.hasDivider !== false && size.width > 1.2) {
      const planPoint = {
        x: -isStart2.unit.y,
        y: isStart2.unit.x
      };
      const maxValue = Math.max(isStart2.wall.thickness * value * planView.zoom * 0.72, 5 / planView.zoom);
      drawPlanLine({
        x: isStart2.center.x - planPoint.x * maxValue,
        y: isStart2.center.y - planPoint.y * maxValue
      }, {
        x: isStart2.center.x + planPoint.x * maxValue,
        y: isStart2.center.y + planPoint.y * maxValue
      }, {
        color: flag2 ? "#ffaf46" : "rgba(224, 250, 255, .9)",
        width: 1.5,
        cap: "butt"
      });
    }
    if (flag2 && multiSelection.length <= 1) {
      drawFloatingLabel(isStart2.center, size.width.toFixed(2) + " m", "#43d2e6");
    }
  }
  for (const size of floorScene2.doors) {
    drawDoorPreview(size);
  }
  for (const size of floorScene2.railings) {
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
  for (const size of floorScene2.items) {
    if (!lightItemTypes2.has(size.type)) {
      drawItemOnPlan(size);
    }
  }
  if (!alignSession) {
    const length11 = getUnclosedWallEndpoints(value);
    for (const size of length11) {
      Xg(size);
      if (length11.length <= 3) {
        drawFloatingLabel(size, "未闭合", "#ff766e");
      }
    }
  }
  planCtx.restore();
  if (flag) {
    for (const type11 of floorScene2.items) {
      if (lightItemTypes2.has(type11.type)) {
        drawItemOnPlan(type11);
      }
    }
  }
  const start7 = floorScene2.calibration?.reference;
  if (start7 && activeTool === "scale") {
    drawPlanLine(start7.start, start7.end, {
      color: "rgba(255, 157, 46, .72)",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(start7.start, "#ff9d2e", 3.5);
    drawPlanPoint(start7.end, "#ff9d2e", 3.5);
    drawFloatingLabel({
      x: (start7.start.x + start7.end.x) / 2,
      y: (start7.start.y + start7.end.y) / 2
    }, start7.meters.toFixed(2) + " m 参考", "#ffad45");
  }
  if (wallDrawAnchor2 && no) {
    drawPlanLine(wallDrawAnchor2, no, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(wallDrawAnchor2, "#ff9d2e");
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
    const isStart2 = distance(Tt, at.point) / value;
    drawFloatingLabel({
      x: (Tt.x + at.point.x) / 2,
      y: (Tt.y + at.point.y) / 2
    }, isStart2.toFixed(2) + " m", "#ffb04a");
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
    const start4 = wallAttachmentWorldPoint(size);
    if (start4) {
      drawPlanLine(start4.start, start4.end, {
        color: "rgba(67, 210, 230, .75)",
        width: 5,
        dash: [5, 4],
        cap: "butt"
      });
    }
  }
  if (activeTool === "door" && railingPlacementPreview2) {
    const width8 = yo[wallDrawAnchor] || yo.solid;
    drawDoorPreview({
      wallId: railingPlacementPreview2.wall.id,
      t: railingPlacementPreview2.t,
      width: width8.width,
      height: width8.height,
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
    wall: floorScene2.walls,
    window: floorScene2.windows,
    door: floorScene2.doors,
    railing: floorScene2.railings,
    item: floorScene2.items
  }[selection.kind] || []).find(item => item.id === selection.id);
  if (!flag) {
    selection = null;
  }
  return flag || null;
}
function placeCatalogItemAt(argPrimary) {
  const value = pixelsPerMeter() || 100;
  const flag = assetCategory === "light";
  for (const item of [...floorScene2.items].reverse()) {
    if (lightItemTypes2.has(item.type) === flag && pointInRotatedRectangle(argPrimary, item, value)) {
      return {
        kind: "item",
        id: item.id
      };
    }
  }
  if (flag) {
    return null;
  }
  for (const size of [...floorScene2.windows].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 10 / planView.zoom) {
      return {
        kind: "window",
        id: size.id
      };
    }
  }
  for (const size of [...floorScene2.doors].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 12 / planView.zoom) {
      return {
        kind: "door",
        id: size.id
      };
    }
  }
  for (const size of [...floorScene2.railings].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (isStart && projectPointToSegment(argPrimary, isStart.start, isStart.end).distance <= 12 / planView.zoom) {
      return {
        kind: "railing",
        id: size.id
      };
    }
  }
  for (const wall of [...floorScene2.walls].reverse()) {
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
    background: !!floorScene2.background,
    scale: !!floorScene2.calibration,
    walls: floorScene2.walls.length > 0,
    items: floorScene2.items.some(item => !lightItemTypes2.has(item.type)),
    lights: floorScene2.items.some(item => lightItemTypes2.has(item.type)),
    export: isExporting
  };
  const layerKeys = ["background", "scale", "walls", "items", "lights", "export"].find(argPrimary => !value[argPrimary]) || "export";
  for (const element of document.querySelectorAll("[data-step]")) {
    element.classList.toggle("complete", value[element.dataset.step]);
    element.classList.toggle("active", element.dataset.step === layerKeys);
  }
}
function studioLayoutMetrics() {
  const size = detailsPanelEl2.getBoundingClientRect();
  const size2 = studioShellEl.getBoundingClientRect();
  const value = size.height || Math.max(window.innerHeight - 90, 340);
  const maxValue = size2.width || Math.max(window.innerWidth - 20, 860);
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
  const clamp2 = clamp(finite(floorScene2.settings?.previewPanelRatio, 0.52), value.minimumHeightRatio, value.maximumHeightRatio);
  floorScene2.settings.previewPanelRatio = clamp2;
  detailsPanelEl2.style.setProperty("--preview-panel-height", (clamp2 * 100).toFixed(2) + "%");
  detailsResizer.setAttribute("aria-valuemin", String(Math.round(value.minimumHeightRatio * 100)));
  detailsResizer.setAttribute("aria-valuemax", String(Math.round(value.maximumHeightRatio * 100)));
  detailsResizer.setAttribute("aria-valuenow", String(Math.round(clamp2 * 100)));
}
function applyDetailsPaneWidth() {
  const value = studioLayoutMetrics();
  const clamp2 = clamp(finite(floorScene2.settings?.detailsPanelWidthRatio, 0.29), value.minimumWidthRatio, value.maximumWidthRatio);
  floorScene2.settings.detailsPanelWidthRatio = clamp2;
  studioShellEl.style.setProperty("--details-panel-width", (clamp2 * 100).toFixed(2) + "%");
}
function isSnapActive() {
  return floorScene2.settings.snapEnabled !== false && !Or;
}
function setSnapSettingsOpen(flag) {
  xr.hidden = !flag;
  Qd.setAttribute("aria-expanded", String(flag));
}
function syncSnapUi() {
  const flag = floorScene2.settings.snapEnabled !== false;
  snapToggle.classList.toggle("active", flag);
  snapToggle.setAttribute("aria-pressed", String(flag));
  Ef.textContent = flag ? "开" : "关";
  for (const el2 of snapSettingEls) {
    el2.checked = floorScene2.settings[el2.dataset.snapSetting] !== false;
  }
  syncControlValue(snapTolerance, clamp(Math.round(finite(floorScene2.settings.snapTolerance, 13)), 6, 24));
  jd.textContent = snapTolerance.value + " px";
  if (!Fi) {
    No.textContent = flag ? "吸附：开启" : "吸附：关闭";
  }
}
function onDetailsResizePointerMove(event) {
  if (!detailsResizeDrag) {
    return;
  }
  const size = detailsPanelEl2.getBoundingClientRect();
  const size2 = studioShellEl.getBoundingClientRect();
  if (size.height <= 0 || size2.width <= 0) {
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
  const detailsResizeNormX = detailsResizeDeltaX / size2.width;
  floorScene2.settings.previewPanelRatio = clamp(detailsResizeDrag.startPreviewRatio + detailsResizeNormY, value.minimumHeightRatio, value.maximumHeightRatio);
  floorScene2.settings.detailsPanelWidthRatio = clamp(detailsResizeDrag.startWidthRatio - detailsResizeNormX, value.minimumWidthRatio, value.maximumWidthRatio);
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
}
function refreshStudioPanels() {
  syncSnapUi();
  renderFloorList();
  toggleBackground.disabled = !floorScene2.background;
  toggleBackground.textContent = floorScene2.settings.backgroundVisible ? "隐藏" : "显示";
  Ud.disabled = !floorScene2.background;
  syncControlValue(globalWallHeight, floorScene2.settings.wallHeight.toFixed(2));
  syncControlValue(globalWallThickness, floorScene2.settings.wallThickness.toFixed(2));
  syncControlValue(globalWallOpacity, Math.round(floorScene2.settings.wallOpacity * 100));
  toggleFloorEdge.textContent = floorScene2.settings.floorEdgeVisible === false ? "隐藏" : "显示";
  toggleFloorEdge.setAttribute("aria-pressed", String(floorScene2.settings.floorEdgeVisible !== false));
  mf.hidden = !!floorScene2.background || !!floorScene2.walls.length || !!floorScene2.items.length;
  og.textContent = floorScene2.walls.length + " 墙 · " + floorScene2.windows.length + " 窗 · " + floorScene2.doors.length + " 门 · " + floorScene2.railings.length + " 栏杆 · " + floorScene2.items.length + " 物件";
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
      const flag2 = lightGroup.opacity === null || lightGroup.opacity === undefined ? null : clamp(finite(lightGroup.opacity, floorScene2.settings.wallOpacity), 0, 1);
      selectEl("#wall-opacity-mode").value = flag2 === null ? "global" : "custom";
      syncControlValue(selectEl("#wall-opacity"), Math.round((flag2 ?? floorScene2.settings.wallOpacity) * 100));
      selectEl("#wall-opacity").disabled = flag2 === null;
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
      const flag2 = lightGroup.type === "planlabel";
      const flag3 = lightItemTypes2.has(lightGroup.type);
      const isSecurityDevice = lightGroup.type === "camera" || lightGroup.type === "presence";
      selectEl("#selection-title").textContent = named?.name || "物件";
      lightPreviewNote.hidden = !flag3;
      selectionHeadingEl.classList.toggle("light-selected", flag3);
      $f.hidden = !flag2;
      Wf.hidden = !(flag3 || isSecurityDevice);
      Wf.title = isSecurityDevice ? "0° 正装，±90° 侧装，180° 倒装；离地高度为底座安装点高度" : "";
      Kf.hidden = lightGroup.type !== "curtain";
      Vf.hidden = flag2 || flag3 || lightGroup.type === "flooropening";
      Hf.hidden = flag2 || lightGroup.type === "flooropening";
      Nf.hidden = lightGroup.type === "ceilinglight";
      Xf.hidden = lightGroup.type === "ceilinglight";
      qf.hidden = !flag3;
      Uf.hidden = lightGroup.type !== "striplight";
      Yf.hidden = lightGroup.type !== "striplight";
      Zf.hidden = lightGroup.type !== "striplight";
      Qf.hidden = !roundTableTypes.has(lightGroup.type);
      Jf.hidden = !stairItemTypes.has(lightGroup.type);
      jf.hidden = lightGroup.type !== "tv";
      eg.hidden = lightGroup.type !== "shoecabinet";
      o0.setAttribute("aria-pressed", lightGroup.shoeCabinetMirrored === true ? "true" : "false");
      selectEl("#item-rotation-label").textContent = lightGroup.type === "striplight" ? "平面旋转（°）" : flag3 ? "平面方向（°）" : "旋转角度（°）";
      selectEl("#item-rotation").min = lightGroup.type === "striplight" ? "0" : "-360";
      selectEl("#item-rotation").max = "360";
      _f.textContent = lightGroup.type === "striplight" ? "安装倾斜（°）" : isSecurityDevice ? "安装翻转／侧装（°）" : "出光角度（°）";
      selectEl("#item-vertical-rotation").min = lightGroup.type === "striplight" ? "0" : isSecurityDevice ? "-180" : "-90";
      selectEl("#item-vertical-rotation").max = lightGroup.type === "striplight" ? "360" : isSecurityDevice ? "180" : "90";
      for (const hidden of applyLightPropertyEls2) {
        hidden.hidden = !flag3;
      }
      tg.textContent = lightGroup.type === "flooropening" ? "洞口宽（m）" : lightGroup.type === "striplight" ? "发光长度（m）" : lightGroup.type === "pillar" ? "长（m）" : "宽（m）";
      ng.textContent = lightGroup.type === "flooropening" ? "洞口长（m）" : lightGroup.type === "striplight" ? "发光宽度（m）" : flag2 ? "铭牌高（m）" : lightGroup.type === "pillar" ? "宽（m）" : "深（m）";
      if (flag2) {
        syncControlValue(selectEl("#label-title"), lightGroup.title || "家庭总览");
        syncControlValue(selectEl("#label-title-spacing"), Math.round(clamp(finite(lightGroup.titleSpacing, 1.05), 0, 1.8) * 100));
        syncControlValue(selectEl("#label-subtitle"), lightGroup.subtitle || "HOME PLAN");
        syncControlValue(selectEl("#label-subtitle-spacing"), Math.round(clamp(finite(lightGroup.subtitleSpacing, 0.08), 0, 0.6) * 100));
        syncControlValue(selectEl("#label-line-length"), Math.round(clamp(finite(lightGroup.lineLength, 0.86), 0.3, 1) * 100));
      }
      if (flag3) {
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
  planCanvas2.dataset.tool = argPrimary;
  planCanvas2.style.cursor = "";
  for (const element of Zd) {
    element.classList.toggle("active", element.dataset.tool === argPrimary);
  }
  [activeToolLabel2.textContent, toolHelp.textContent] = assetCategory === "light" ? ["灯光编辑", "户型已锁定；框选多盏灯后可整体拖动，Shift 锁轴，Option/Alt 复制"] : toolHelpText[argPrimary];
  yr.hidden = argPrimary !== "wall" || !Tt;
  if (argPrimary !== "wall") {
    resetWallDrawing2();
  }
  if (argPrimary !== "scale") {
    wallDrawAnchor2 = null;
  }
  at = null;
  Uo = null;
  railingPlacementPreview2 = null;
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
    const scope2 = activeSelectionAssetCategory();
    pushHistory();
    const value = new Set(multiSelection.filter(kind => kind.kind === "wall").map(item => item.id));
    const idSet = new Set(multiSelection.filter(kind => kind.kind === "window").map(item => item.id));
    const wallIdSet = new Set(multiSelection.filter(kind => kind.kind === "door").map(item => item.id));
    const wallIdSet2 = new Set(multiSelection.filter(kind => kind.kind === "railing").map(item => item.id));
    const wallIdSet3 = new Set(multiSelection.filter(kind => kind.kind === "item").map(item => item.id));
    floorScene2.walls = floorScene2.walls.filter(id => !value.has(id.id));
    floorScene2.windows = floorScene2.windows.filter(id => !idSet.has(id.id) && !value.has(id.wallId));
    floorScene2.doors = floorScene2.doors.filter(id => !wallIdSet.has(id.id) && !value.has(id.wallId));
    floorScene2.railings = floorScene2.railings.filter(id => !wallIdSet2.has(id.id) && !value.has(id.wallId));
    floorScene2.items = floorScene2.items.filter(id => !wallIdSet3.has(id.id));
    if (value.size) {
      wallIdMap();
    }
    clearSelection();
    refreshViews(scope2);
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
    floorScene2.walls = floorScene2.walls.filter(item => item.id !== floor.id);
    floorScene2.windows = floorScene2.windows.filter(wall => wall.wallId !== floor.id);
    floorScene2.doors = floorScene2.doors.filter(wall => wall.wallId !== floor.id);
    floorScene2.railings = floorScene2.railings.filter(wall => wall.wallId !== floor.id);
    wallIdMap();
  } else if (selection.kind === "window") {
    floorScene2.windows = floorScene2.windows.filter(item => item.id !== floor.id);
  } else if (selection.kind === "door") {
    floorScene2.doors = floorScene2.doors.filter(item => item.id !== floor.id);
  } else if (selection.kind === "railing") {
    floorScene2.railings = floorScene2.railings.filter(item => item.id !== floor.id);
  } else {
    floorScene2.items = floorScene2.items.filter(item => item.id !== floor.id);
  }
  clearSelection();
  refreshViews(scope);
  scheduleSave();
}
function placeCatalogFurnitureItem(argPrimary, argSecondary, width12 = {}) {
  const lastMotionRenderAt = furnitureCatalog[argPrimary];
  if (!lastMotionRenderAt || !requireCalibration()) {
    return;
  }
  const temperature2 = defaultLightPresets[argPrimary] || defaultLightPresets.downlight;
  const id2 = lightItemTypes2.has(argPrimary) ? ensureDefaultLightGroup() : null;
  pushHistory();
  const id3 = {
    id: makeId("item"),
    type: argPrimary,
    x: argSecondary.x,
    y: argSecondary.y,
    rotation: 0,
    width: width12.width ?? lastMotionRenderAt.width,
    depth: width12.depth ?? lastMotionRenderAt.depth,
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
    ...(lightItemTypes2.has(argPrimary) ? {
      lightGroupId: id2.id,
      verticalRotation: 0,
      ...(argPrimary === "striplight" ? {
        stripRollRotation: 0,
        lightSourceVisible: true
      } : {}),
      lightTemperature: temperature2.temperature,
      lightBrightness: temperature2.brightness,
      lightRange: temperature2.range,
      lightAngle: temperature2.angle
    } : {})
  };
  ensureItemLayerNames([id3]);
  floorScene2.items.push(id3);
  setSelection("item", id3.id);
  setActiveTool("select");
  refreshViews(itemPreviewScope(id3));
  scheduleSave();
}
function selectedItemIds() {
  const value = new Set([...(selection?.kind === "item" ? [selection.id] : []), ...multiSelection.filter(kind => kind.kind === "item").map(item => item.id)]);
  const flag = assetCategory === "light";
  const list = floorScene2.items.filter(id => value.has(id.id) && lightItemTypes2.has(id.type) === flag);
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  pushHistory();
  const snapInsetPixels = (pixelsPerMeter() || 100) * 0.12;
  const list2 = list.map(planPoint => ({
    ...structuredClone(planPoint),
    id: makeId("item"),
    x: planPoint.x + snapInsetPixels,
    y: planPoint.y + snapInsetPixels
  }));
  ensureItemLayerNames(list2);
  floorScene2.items.push(...list2);
  if (list2.length === 1) {
    setSelection("item", list2[0].id);
  } else {
    selection = null;
    multiSelection = list2.map(id => ({
      kind: "item",
      id: id.id
    }));
  }
  refreshViews(list.some(type5 => type5.type === "flooropening") ? "all" : flag ? "lights" : "items");
  scheduleSave();
  showToast("已复制 " + list2.length + " 个物件。");
}
function cloneSelectedItems() {
  const value = new Set([...(selection?.kind === "item" ? [selection.id] : []), ...multiSelection.filter(kind => kind.kind === "item").map(item => item.id)]);
  const isLightAssetCategory = assetCategory === "light";
  return floorScene2.items.filter(id => value.has(id.id) && lightItemTypes2.has(id.type) === isLightAssetCategory);
}
function copySelectedItems() {
  const list = cloneSelectedItems();
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  clipboardItems = list.map(argPrimary => structuredClone(argPrimary));
  const id2 = activeFloor();
  Fr = {
    id: id2.id,
    originX: id2.originX,
    originY: id2.originY,
    offsetX: id2.offsetX,
    offsetZ: id2.offsetZ,
    rotation: id2.rotation,
    scene: {
      calibration: structuredClone(floorScene2.calibration)
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
  if (clipboardItems.some(type8 => type8.type === "flooropening") && !requireCalibration()) {
    return;
  }
  const flag = clipboardItems.every(item => lightItemTypes2.has(item.type));
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
    ...(lightItemTypes2.has(planPoint.type) && !floorScene2.lightGroups.some(object3d2 => object3d2.id === planPoint.lightGroupId) ? {
      lightGroupId: ensureDefaultLightGroup().id
    } : {})
  }));
  ensureItemLayerNames(list);
  floorScene2.items.push(...list);
  if (list.length === 1) {
    setSelection("item", list[0].id);
  } else {
    selection = null;
    multiSelection = list.map(id => ({
      kind: "item",
      id: id.id
    }));
  }
  refreshViews(list.some(type6 => type6.type === "flooropening") ? "all" : flag ? "lights" : "items");
  scheduleSave();
  showToast("已粘贴 " + list.length + " 个物件。");
}
async function reloadPlanBackground() {
  const value = ++planBackgroundRevision;
  planBackgroundImage2 = null;
  if (!floorScene2.background?.url) {
    return;
  }
  const bgUrl = floorScene2.background.url;
  await new Promise(argPrimary => {
    let flag = false;
    const onComplete = () => {
      if (!flag) {
        flag = true;
        argPrimary();
      }
    };
    const el2 = new Image();
    const setTimeoutResult = window.setTimeout(onComplete, 2000);
    el2.addEventListener("load", () => {
      if (value !== planBackgroundRevision || floorScene2.background?.url !== bgUrl) {
        onComplete();
        return;
      }
      planBackgroundImage2 = el2;
      window.clearTimeout(setTimeoutResult);
      if (flag) {
        drawPlan();
      } else {
        onComplete();
      }
    }, {
      once: true
    });
    el2.addEventListener("error", () => {
      window.clearTimeout(setTimeoutResult);
      if (value === planBackgroundRevision) {
        showToast("底图加载失败，请重新导入。", "error");
      }
      onComplete();
    }, {
      once: true
    });
    el2.src = bgUrl;
  });
}
async function importPlanBackgroundFile(body) {
  if (body) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
      showToast("仅支持 PNG、JPG、JPEG、WebP 和 SVG 图片。", "error");
      return;
    }
    importPlan2.disabled = true;
    importPlan2.textContent = "上传中…";
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
      floorScene2.background = {
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
      floorScene2.settings.backgroundVisible = true;
      await reloadPlanBackground();
      fitPlanViewToContent();
      refreshViews();
      scheduleSave();
      setActiveTool("scale");
      showToast("底图已导入，请在图上画一条已知长度的参考线。");
    } catch (error) {
      showToast(error.message || "底图上传失败。", "error");
    } finally {
      importPlan2.disabled = false;
      importPlan2.textContent = "导入";
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
  if (!previewScene2 || !renderer) {
    return;
  }
  previewScene2.background = null;
  renderer.setClearColor(value.background, 0);
  previewScene2.fog = null;
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
      const camera2 = previewSpotLight.shadow.camera;
      savedSpotShadowCamera = {
        left: camera2.left,
        right: camera2.right,
        top: camera2.top,
        bottom: camera2.bottom,
        near: camera2.near,
        far: camera2.far
      };
    }
    shadowCameraExpanded = flag;
    applyPreviewEnvironment();
    if (!flag && savedSpotShadowCamera && previewSpotLight?.shadow?.camera) {
      const camera2 = previewSpotLight.shadow.camera;
      Object.assign(camera2, savedSpotShadowCamera);
      camera2.updateProjectionMatrix();
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
  for (const el2 of baseLightControlEls) {
    const toFixed = baseLighting[el2.dataset.baseLightControl];
    const flag = el2.step === "5";
    syncControlValue(el2, flag ? Math.round(toFixed) : Number(toFixed.toFixed(2)));
  }
}
function applyBaseLighting(argPrimary) {
  const localValue = baseLighting;
  baseLighting = normalizeBaseLighting(argPrimary);
  syncBaseLightingControls();
  applyPreviewEnvironment();
  requestRender({
    shadows: Object.keys(DEFAULT_BASE_LIGHTING).some(argPrimary2 => localValue[argPrimary2] !== baseLighting[argPrimary2])
  });
}
function relocateBaseLightControls() {
  if (!projectDoc2 || !baseLightControls) {
    return;
  }
  const appendVar = exportDialog?.open ? exportDialog : document.body;
  if (baseLightControls.parentElement !== appendVar) {
    appendVar.append(baseLightControls);
  }
  if (baseLightControls.hidden) {
    applyBaseLighting(projectDoc2.baseLighting);
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
    if (projectDoc2) {
      applyBaseLighting(projectDoc2.baseLighting);
    }
    baseLightControls.hidden = true;
  }
}
function commitBaseLightingFromControls() {
  if (!projectDoc2) {
    return;
  }
  const lighting = normalizeBaseLighting(baseLighting);
  projectDoc2.baseLighting = lighting;
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
  if (getPreviewFloorMode2() === "all") {
    return projectDoc2.combinedCameraSettings;
  } else {
    return floorScene2.settings;
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
  const sufficient = assessAdaptiveRenderFrames(recentFrameMsSamples2);
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
      recentFrameMsSamples2.push(Math.min(value, 120));
    }
  }
  qualityProbeStartMs = argPrimary;
  if (!(recentFrameMsSamples2.length < 24)) {
    checkAdaptiveQuality();
    recentFrameMsSamples2.splice(0, 12);
  }
}
function isLivePreviewEnabled() {
  return floorScene2.settings?.livePreviewEnabled !== false;
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
function applyCameraFocalLength(isPerspectiveCamera = camera2, argSecondary = getCameraFocalLength()) {
  if (isPerspectiveCamera?.isPerspectiveCamera) {
    isPerspectiveCamera.setFocalLength(clamp(finite(argSecondary, 50), 18, 120));
  }
}
function syncOrbitControls() {
  if (!orbitControls) {
    return;
  }
  const flag = isPreviewQualityReady();
  const flag2 = isStageEmbed && isCapturingFrame && !isBakingLightCache;
  shadowAtlas?.setEnabled(isStageEmbed || !flag || !!flag2);
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
  const flag2 = isStageEmbed && isStageWarmup;
  let value = Math.min(window.devicePixelRatio || 1, flag ? 1 : 1.6) * (isStageEmbed ? ur : 1);
  if (isStageEmbed && (flag || flag2)) {
    const {
      cost: localValue,
      budget: localValue2
    } = estimateLightRenderCost();
    if (localValue > localValue2) {
      value = Math.min(value, clamp(Math.sqrt(localValue2 / localValue) * 0.85, 0.5, 0.85));
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
  let id2 = document.querySelector("#ha-bridge-render-stats-test-output");
  if (!id2) {
    id2 = document.createElement("output");
    id2.id = "ha-bridge-render-stats-test-output";
    document.body.append(id2);
  }
  id2.textContent = "渲染统计：" + calls.calls + " 次调用，" + calls.triangles + " 个三角面；重复实例节省 " + calls.instanceSaved + " 次，跨模型材质合批节省 " + calls.staticItemSaved + " 次。";
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
  const length24 = [...list].sort((argPrimary, argSecondary2) => argPrimary - argSecondary2);
  const localValue = Math.min(length24.length - 1, Math.max(0, Math.ceil(length24.length * argSecondary) - 1));
  return length24[localValue];
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
  const el2 = document.createElement("output");
  el2.id = "performance-diagnostics";
  el2.className = "performance-diagnostics";
  el2.setAttribute("aria-label", "3D 性能诊断");
  el2.setAttribute("aria-live", "off");
  el2.textContent = "性能诊断初始化中…";
  selectEl("#preview-3d")?.append(el2);
  perfStats.hud = el2;
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
    const flag2 = isCreateQuery.createQuery();
    if (flag2) {
      isCreateQuery.beginQuery(isTIME_ELAPSED_EXT.TIME_ELAPSED_EXT, flag2);
      gpuQueryActive.gpuQueryActive = flag2;
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
  const flag2 = gpuQueryActive.gpuQueryActive;
  gpuQueryActive.gpuQueryActive = null;
  if (!!isEndQuery && !!isTIME_ELAPSED_EXT && !!flag2) {
    try {
      isEndQuery.endQuery(isTIME_ELAPSED_EXT.TIME_ELAPSED_EXT);
      gpuQueryActive.gpuQueriesPending.push(flag2);
    } catch {
      isEndQuery.deleteQuery?.(flag2);
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
function fitCameraToSelection2(toFixed, Number2) {
  const pendingPhases = isPerfDiagnosticsEnabled && perfStats.floorSwitch;
  if (!pendingPhases || performance.now() > pendingPhases.until) {
    return Number2();
  }
  const timestampMs = performance.now();
  try {
    return Number2();
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
  let meshes2 = 0;
  let lights = 0;
  let visibleLights = 0;
  let activeSpotShadows = 0;
  previewScene2?.traverse(light => {
    if (light.isMesh) {
      meshes2 += 1;
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
    item: lightBrightness2,
    group: enabled2
  }) => enabled2?.enabled !== false && finite(lightBrightness2.lightBrightness, 0) > 0).length;
  return {
    meshes: meshes2,
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
  const flag2 = percentileOfSorted(frameIntervals.frameIntervals, 0.5);
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
      medianFps: fitCameraToSelection(flag2 ? 1000 / flag2 : null),
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
  const active = externalModels2.modelLoadState();
  return active.active > 0 || active.queued > 0 || modelsLoading || modelLoadStatusTimer2 !== null || isSceneRebuildQueued;
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
  const argPrimary2 = () => {
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
    window.removeEventListener("pagehide", argPrimary2);
    window.removeEventListener("pointerdown", argPrimary2, true);
    window.removeEventListener("wheel", argPrimary2, true);
    blob?.removeEventListener("start", argPrimary2);
    blob?.removeEventListener("change", argPrimary2);
    if (argSecondary) {
      argSecondary.width = argSecondary.height = 0;
      argSecondary = null;
    }
    if (Ds === frame) {
      Ds = null;
    }
  };
  frame.cancel = argPrimary2;
  Ds = frame;
  const helperFn = argPrimary3 => window.HABridgeLog?.error(argPrimary3, {
    phase: "interaction3d-cache-write"
  });
  const helperFn2 = () => {
    frame.idle = null;
    Promise.resolve().then(() => {
      if (imageData()) {
        return renderCache2?.write(argPrimary, argSecondary, imageData);
      }
    }).catch(helperFn).finally(argPrimary2);
  };
  try {
    window.addEventListener("pagehide", argPrimary2, {
      once: true
    });
    window.addEventListener("pointerdown", argPrimary2, {
      capture: true,
      passive: true
    });
    window.addEventListener("wheel", argPrimary2, {
      capture: true,
      passive: true
    });
    blob?.addEventListener("start", argPrimary2);
    blob?.addEventListener("change", argPrimary2);
    frame.frame = window.requestAnimationFrame(() => {
      frame.frame = null;
      if (!imageData()) {
        argPrimary2();
        return;
      }
      frame.timer = window.setTimeout(() => {
        frame.timer = null;
        if (!imageData()) {
          argPrimary2();
          return;
        }
        try {
          if (typeof window.requestIdleCallback == "function") {
            frame.idle = window.requestIdleCallback(helperFn2);
          } else {
            helperFn2();
          }
        } catch (localValue) {
          argPrimary2();
          helperFn(localValue);
        }
      }, 180);
    });
  } catch (localValue) {
    argPrimary2();
    helperFn(localValue);
  }
}
async function finishStageSessionWarmup() {
  stageSessionEndTimer = null;
  if (!Vo || renderCache2?.closed || !renderer || stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isCapturingFrame || isStageWarmup || curtainMotionActive || vacuumMotionActive || rs) {
    return;
  }
  if (hasPendingModelLoads() || shadowAtlas?.isBuilding() || shadowAtlas?.isPending()) {
    scheduleAdaptiveQuality(120);
    return;
  }
  const domElement = renderer.domElement;
  const width13 = domElement.width;
  const height = domElement.height;
  if (!width13 || !height) {
    return;
  }
  const value = lightCacheEpoch;
  const onComplete = () => Vo && !renderCache2?.closed && !hasPendingModelLoads() && value === lightCacheEpoch && !stageSession && !previewOrbitLocked && !isLeavingStudio && !isCapturingFrame && !isStageWarmup && !curtainMotionActive && !vacuumMotionActive && !rs;
  isBakingLightCache = true;
  let width14;
  let flag = null;
  let el2;
  let flag2 = false;
  try {
    const entry = collectVisibleLights();
    const sha2562 = sha256(stableCacheJSON({
      kind: "settled-rgba-v1",
      base: computeLightRenderCacheKey(width13, height),
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
    el2 = sha2562;
    width14 = await renderCache2?.acquire(sha2562, width13, height, onComplete);
    if (!onComplete()) {
      return;
    }
    if (!width14) {
      const worldItemsCached = ensureWorldItemsCached(entry);
      syncLightGroupVisibility(worldItemsCached);
      syncOrbitControls();
      renderer.render(previewScene2, camera2);
      width14 = document.createElement("canvas");
      flag = width14;
      width14.width = width13;
      width14.height = height;
      const isDrawImage = width14.getContext("2d");
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
    previewLightCache.width = width13;
    previewLightCache.height = height;
    clearRect.clearRect(0, 0, width13, height);
    clearRect.drawImage(width14.image || width14, 0, 0);
    lightCacheTileMap2.clear();
    pendingModelLoads.clear();
    lightCacheReady = true;
    previewQualityJustBecameReady = false;
    domElement.dataset.lightCachePixels = String(width13 * height);
    domElement.dataset.lightCacheRetainedGroups = "complete-frame";
    setPreviewLightCacheVisible(true);
    if (flag) {
      capturePreviewCanvas(el2, flag, onComplete);
      flag = null;
    }
  } catch (error) {
    flag2 = true;
    setPreviewLightCacheVisible(false);
    window.HABridgeLog?.error(error, {
      phase: "interaction3d-settled-cache"
    });
  } finally {
    try {
      width14?.close?.();
      if (flag) {
        flag.width = flag.height = 0;
      }
    } finally {
      isBakingLightCache = false;
    }
    if (previewQualityJustBecameReady && (!flag2 || value !== lightCacheEpoch)) {
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
    for (const [value, tileCanvas] of lightCacheTileMap2) {
      const clamp2 = clamp(finite(pendingModelLoads.get(value), 0), 0, 1);
      if (!(clamp2 <= 0.001)) {
        isClearRect.save();
        isClearRect.globalAlpha = clamp2;
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
  const flag = value.map(argPrimary2 => ({
    groupId: previewScopedItemKey(activeFloorId, argPrimary2),
    from: clamp(finite(pendingModelLoads.get(previewScopedItemKey(activeFloorId, argPrimary2)), findLightGroupById(argPrimary2)?.enabled === false ? 0 : 1), 0, 1),
    to: findLightGroupById(argPrimary2)?.enabled === false ? 0 : 1
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
  const nowResult = argPrimary2 => {
    const clampedValue = clamp((argPrimary2 - list) / cacheDurationMs, 0, 1);
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
  return floorScene2.lightGroups?.find(item => item.id === argPrimary) || null;
}
function warmLightCacheMeshesForGroups(argPrimary, cacheDurationMs = LIGHT_CACHE_TILE_MS) {
  if (!worldGroup) {
    return false;
  }
  const value = new Set(argPrimary);
  const canWarmLightCache = isPreviewQualityReady() && !stageSession;
  const warmCacheMeshList = [];
  worldGroup.traverse(userData21 => {
    if (!userData21.isLight || !value.has(userData21.userData?.lightGroupId)) {
      return;
    }
    const to3 = findLightGroupById(userData21.userData.lightGroupId)?.enabled !== false && !canWarmLightCache ? finite(userData21.userData.lightOnIntensity, 0) : 0;
    if (to3 > 0) {
      userData21.visible = true;
    }
    warmCacheMeshList.push({
      object: userData21,
      from: finite(userData21.intensity, 0),
      to: to3
    });
  });
  if (!warmCacheMeshList.length) {
    return false;
  }
  if (warmCacheMeshList.some(({
    to: argPrimary2
  }) => argPrimary2 > 0)) {
    syncSpotShadowCastingLights(worldGroup, {
      rebuildAtlas: false
    });
  }
  cancelAnimationFrame(is);
  const flag = performance.now();
  const helperFn = argPrimary2 => {
    const clampedValue = clamp((argPrimary2 - flag) / cacheDurationMs, 0, 1);
    const computedValue = clampedValue * clampedValue * (3 - clampedValue * 2);
    for (const from2 of warmCacheMeshList) {
      from2.object.intensity = from2.from + (from2.to - from2.from) * computedValue;
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
  const argPrimary2 = [...new Set(argPrimary)].filter(Boolean);
  if (isPreviewQualityReady() && !stageSession) {
    scheduleLightCacheForGroups(argPrimary2);
  } else if (!warmLightCacheMeshesForGroups(argPrimary2)) {
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
    cacheObjectTransforms(previewScene2, THREE.Object3D);
  }
  if (floor.shadows === true) {
    previewScene2?.traverse(shadow3 => {
      if (shadow3.isLight && shadow3.castShadow && shadow3.shadow) {
        shadow3.shadow.needsUpdate = true;
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
    if (getPreviewFloorMode2() === "all") {
      rebuildWorldPreview2({
        preserveLightCache: true
      });
    } else {
      rebuildPreviewLightMeshes2({
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
function runWithResidentFloorCache(argPrimary, has13) {
  const localValue = floorScene2;
  const localValue2 = activeFloorId;
  const localValue3 = residentCacheMode;
  const comparisonFlag = getPreviewFloorMode2() === "all";
  try {
    residentCacheMode = true;
    for (const {
      floor: id2,
      item: x28,
      itemKey: localValue
    } of argPrimary) {
      if (has13.has(localValue) || !comparisonFlag && id2.id !== localValue2) {
        continue;
      }
      const addedObject = comparisonFlag ? worldGroup?.children.find(userData6 => userData6.userData?.floorId === id2.id) : worldGroup;
      if (!addedObject) {
        continue;
      }
      floorScene2 = id2.scene;
      activeFloorId = id2.id;
      const pixelsPerMeterValue = pixelsPerMeter();
      if (!pixelsPerMeterValue) {
        continue;
      }
      const minX = getPreviewFloorMode();
      const conditionalValue = comparisonFlag ? finite(id2.originX, 0) : (minX.minX + minX.maxX) / 2;
      const conditionalValue2 = comparisonFlag ? finite(id2.originY, 0) : (minX.minY + minX.maxY) / 2;
      const userData17 = new THREE.Group();
      buildWallCornerCaps(userData17, x28, shadowCastingLightIdSet());
      userData17.position.set((x28.x - conditionalValue) / pixelsPerMeterValue, x28.elevation || 0, (x28.y - conditionalValue2) / pixelsPerMeterValue);
      instanceMergeIdenticalItems(userData17, x28);
      userData17.userData.modelLayer = "lights";
      userData17.userData.exportRole = "plan";
      addedObject.add(userData17);
      if (isStageEmbed) {
        cacheObjectTransforms(userData17, THREE.Object3D);
      }
      const push5 = [];
      userData17.traverse(isLight2 => {
        if (isLight2.isLight) {
          push5.push(isLight2);
        }
      });
      if (push5.length) {
        has13.set(localValue, push5);
      }
    }
  } finally {
    floorScene2 = localValue;
    activeFloorId = localValue2;
    residentCacheMode = localValue3;
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: false
  });
  return has13;
}
function setGroupVisibilityByKey(argPrimary, argSecondary = "") {
  for (const [localValue, localValue2] of argPrimary) {
    const visible10 = localValue === argSecondary;
    for (const shadow4 of localValue2) {
      shadow4.visible = visible10;
      shadow4.intensity = visible10 ? finite(shadow4.userData?.lightOnIntensity, 0) : 0;
      if (shadow4.isSpotLight) {
        shadow4.castShadow = visible10;
        if (visible10 && shadow4.shadow && !shadow4.shadow.map) {
          shadow4.shadow.needsUpdate = true;
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
      renderer.render(previewScene2, camera2);
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
function createOffscreenCanvas(flag, height9) {
  const value = document.createElement("canvas");
  value.width = flag;
  value.height = height9;
  const drawImage2 = value.getContext("2d", {
    willReadFrequently: true
  });
  if (!drawImage2) {
    throw new Error("当前浏览器无法创建多灯缓存画布。");
  }
  drawImage2.drawImage(renderer.domElement, 0, 0, flag, height9);
  return drawImage2.getImageData(0, 0, flag, height9);
}
function warmPreviewRenderer() {
  for (let value = 0; value < 3; value += 1) {
    renderer.render(previewScene2, camera2);
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
  if ((!isStageEmbed || !!Vo) && (!isStageEmbed || !renderCache2?.closed) && !!renderer && !!worldGroup && !stageSession && !previewOrbitLocked && !isLeavingStudio && !isBakingLightCache && !isCapturingFrame && !isStageWarmup && !!isPreviewQualityReady()) {
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = window.setTimeout(() => {
      const active = externalModels2.modelLoadState();
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
    const el2 = document.createElement("canvas");
    el2.width = width;
    el2.height = height;
    const isClearRect2 = el2.getContext("2d");
    const el22 = document.createElement("canvas");
    el22.width = width;
    el22.height = height;
    const isClearRect3 = el22.getContext("2d");
    if (!isClearRect2 || !isClearRect3) {
      throw new Error("当前浏览器无法合成多灯缓存。");
    }
    const map2 = new Map();
    const worldItemsCached = ensureWorldItemsCached(entry);
    await waitTwoAnimationFrames();
    if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
      return;
    }
    setGroupVisibilityByKey(worldItemsCached);
    isClearRect2.clearRect(0, 0, width, height);
    worldGroup.traverse(object3d => {
      if (object3d.userData?.exportRole === "grid") {
        lookupMap.set(object3d, object3d.visible);
        object3d.visible = false;
      }
    });
    let isData;
    for (const entry2 of entry) {
      await yieldToIdle();
      if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
        break;
      }
      const {
        item,
        group,
        itemKey,
        groupKey
      } = entry2;
      isClearRect3.clearRect(0, 0, width, height);
      {
        if (!isData) {
          setGroupVisibilityByKey(worldItemsCached);
          warmPreviewRenderer();
          isData = createOffscreenCanvas(width, height);
        }
        setGroupVisibilityByKey(worldItemsCached, itemKey);
        warmPreviewRenderer();
        const offscreenCanvas = createOffscreenCanvas(width, height);
        const buildLightDeltaPixels2 = buildLightDeltaPixels(isData.data, offscreenCanvas.data);
        isClearRect3.putImageData(new ImageData(buildLightDeltaPixels2, width, height), 0, 0);
      }
      isClearRect2.drawImage(el22, 0, 0);
      let object3d = map2.get(groupKey);
      if (!object3d) {
        object3d = document.createElement("canvas");
        object3d.width = width;
        object3d.height = height;
        object3d.userData = {
          enabled: group?.enabled !== false
        };
        map2.set(groupKey, object3d);
      }
      object3d.getContext("2d")?.drawImage(el22, 0, 0);
      await yieldToScheduler();
      if (value !== lightCacheEpoch || stageSession || previewOrbitLocked || isLeavingStudio || !isPreviewQualityReady()) {
        break;
      }
    }
    if (value === lightCacheEpoch && !stageSession && isPreviewQualityReady()) {
      lightCacheTileMap2 = map2;
      for (const [tileKey, object3d] of map2) {
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
  preserveLightCache: preserveLightCache3 = false
} = {}) {
  if (!renderer || stageSession && !isAutoDiagramEmbed2) {
    return;
  }
  const value = stageSession ? stageEmbedPixelRatio(argPrimary) : computeStudioPixelRatio(argPrimary);
  if (Math.abs(renderer.getPixelRatio() - value) > 0.000001) {
    renderer.setPixelRatio(value);
  }
  requestRender({
    preserveLightCache: preserveLightCache3
  });
}
function lockPreviewOrbit() {
  window.clearTimeout(orbitResumeTimer2);
  orbitResumeTimer2 = null;
  previewOrbitLocked = true;
  orbitSoftSuspend = false;
  recentFrameMsSamples2 = [];
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
  window.clearTimeout(orbitResumeTimer2);
  if (!flag) {
    if (stageSession && !orbitSuspended) {
      openExportPresetEditor();
    }
    return;
  }
  orbitResumeTimer2 = window.setTimeout(() => {
    orbitResumeTimer2 = null;
    setPreviewPixelRatio(false, {
      preserveLightCache: true
    });
  }, 140);
  if (stageSession && !orbitSuspended) {
    openExportPresetEditor();
  }
}
function syncFloorCameraChrome() {
  const flag = (projectDoc2?.floors.length || 0) > 1;
  const flag2 = getPreviewFloorMode2() === "all";
  cg.hidden = flag2;
  dg.hidden = !flag || !flag2;
  hg.hidden = !flag || !flag2;
  syncControlValue(previewFloorGapInput, finite(projectDoc2?.previewFloorGap, 3).toFixed(1));
  const flag3 = !!floorScene2.settings?.fixedCameraView;
  const flag4 = !!projectDoc2?.combinedFixedCameraView;
  fixedCameraView.disabled = !flag3;
  fixedCameraView.classList.toggle("has-saved-view", flag3);
  fixedOverviewView.disabled = !flag4;
  fixedOverviewView.classList.toggle("has-saved-view", flag4);
  const flag5 = flag2 ? flag4 : flag3;
  exportSaveView.textContent = flag2 ? "保存总览" : "保存视角";
  exportSaveView.title = flag2 ? "记录当前导图的全楼角度和投影方式" : "记录当前导图的角度、缩放和投影方式";
  selectEl("#export-use-fixed").textContent = flag2 ? "恢复总览" : "恢复视角";
  selectEl("#export-use-fixed").title = flag2 ? "恢复已保存的全楼总览视角" : "恢复当前楼层已保存的视角";
  selectEl("#export-use-fixed").disabled = !!orbitSuspended || !flag5;
  selectEl("#export-use-fixed").classList.toggle("has-saved-view", flag5);
}
function activeFixedCameraView() {
  if (getPreviewFloorMode2() === "all") {
    return projectDoc2?.combinedFixedCameraView;
  } else {
    return floorScene2.settings?.fixedCameraView;
  }
}
function setActiveFixedCameraView(argPrimary) {
  if (getPreviewFloorMode2() === "all") {
    projectDoc2.combinedFixedCameraView = argPrimary;
  } else {
    floorScene2.settings.fixedCameraView = argPrimary;
  }
}
function createOrbitControls(view) {
  const el2 = new OrbitControls(view, renderer.domElement);
  el2.enableDamping = true;
  el2.rotateSmoothing = 8;
  el2.rotateSmoothingThreshold = 0.000001;
  el2.dampingFactor = 0.22;
  el2.minDistance = 2;
  el2.maxDistance = 100;
  el2.minZoom = 0.35;
  el2.maxZoom = 6;
  el2.maxPolarAngle = Math.PI * 0.49;
  el2.target.set(0, 0.6, 0);
  el2.addEventListener("start", lockPreviewOrbit);
  el2.addEventListener("change", () => {
    getCameraPose(view, el2.target);
    if (previewOrbitLocked) {
      softLockPreviewOrbit();
      requestRender({
        preserveLightCache: true
      });
    } else {
      requestRender();
    }
  });
  el2.addEventListener("change", () => {
    if (!stageSession || orbitSuspended) {
      return;
    }
    const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, projectDoc2?.exportPresets?.length);
    if (!exportPresetEditorOpen2 && !projectDoc2?.exportPresets?.[normalizeActiveExportPresetSlot2]) {
      exportPresetEditorOpen2 = true;
      normalizeProjectExportPresets();
    }
  });
  el2.addEventListener("end", unlockPreviewOrbit);
  return el2;
}
const am = 0.02;
const sm = 0.32;
const lm = 0.006;
function getCameraPose(isPerspectiveCamera2 = camera2, argSecondary = orbitControls?.target) {
  if (!isPerspectiveCamera2 || !argSecondary) {
    return false;
  }
  const localValue = Math.max(isPerspectiveCamera2.position.distanceTo(argSecondary), 1);
  const near = isPerspectiveCamera2.isPerspectiveCamera ? clamp(localValue * lm, am, sm) : 0.02;
  const far = Math.max(localValue * (isPerspectiveCamera2.isPerspectiveCamera ? 8 : 5), 100);
  if (Math.abs(isPerspectiveCamera2.near - near) < 0.000001 && Math.abs(isPerspectiveCamera2.far - far) < 0.0001) {
    return false;
  } else {
    isPerspectiveCamera2.near = near;
    isPerspectiveCamera2.far = far;
    isPerspectiveCamera2.updateProjectionMatrix();
    return true;
  }
}
function resetOrbitTarget(argPrimary, argSecondary) {
  if (argPrimary?.isOrthographicCamera) {
    return Math.abs(argPrimary.top - argPrimary.bottom) / Math.max(argPrimary.zoom || 1, 0.000001);
  }
  if (argPrimary?.isPerspectiveCamera) {
    const localValue = Math.max(argPrimary.position.distanceTo(argSecondary), 0.0001);
    const localValue2 = THREE.MathUtils.degToRad(argPrimary.getEffectiveFOV());
    return localValue * 2 * Math.tan(localValue2 / 2);
  }
  return 10;
}
async function saveCurrentCameraView() {
  if (!camera2 || !orbitControls) {
    return;
  }
  const value = getPreviewFloorMode2() === "all" ? "总览视角" : "当前层视角";
  if (!stageSession) {
    pushHistory();
  }
  const point3 = orbitControls.target;
  setActiveFixedCameraView({
    mode: camera2.isPerspectiveCamera ? "perspective" : "orthographic",
    view: cameraViewMode(),
    topRotation: topViewRotation(),
    position: {
      x: camera2.position.x,
      y: camera2.position.y,
      z: camera2.position.z
    },
    target: {
      x: point3.x,
      y: point3.y,
      z: point3.z
    },
    visibleHeight: resetOrbitTarget(camera2, point3),
    fov: camera2.isPerspectiveCamera ? camera2.fov : 36,
    focalLength: camera2.isPerspectiveCamera ? getCameraFocalLength() : null
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
  if (!isMode || !camera2 || !orbitControls) {
    return;
  }
  const flag = isMode.mode !== getCameraProjectionMode();
  const flag2 = isMode.view !== cameraViewMode();
  const flag3 = isMode.topRotation !== topViewRotation();
  const flag4 = isMode.focalLength !== null && Math.abs(isMode.focalLength - getCameraFocalLength()) > 1e-8;
  const flag5 = recordChange.recordChange !== false;
  if ((flag || flag2 || flag3 || flag4) && flag5) {
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
  const vector3 = new THREE.Vector3(isMode.target.x, isMode.target.y, isMode.target.z);
  camera2.position.set(isMode.position.x, isMode.position.y, isMode.position.z);
  camera2.up.copy(isMode.view === "top" ? topViewForwardVector(isMode.topRotation) : new THREE.Vector3(0, 1, 0));
  camera2.userData.frameSize = isMode.visibleHeight;
  camera2.userData.cameraView = isMode.view;
  camera2.userData.topRotation = isMode.topRotation;
  camera2.userData.viewportAspect ||= Math.max(selectEl("#preview-3d").clientWidth / Math.max(selectEl("#preview-3d").clientHeight, 1), 0.1);
  camera2.zoom = 1;
  if (camera2.isPerspectiveCamera) {
    camera2.aspect = camera2.userData.viewportAspect;
    if (isMode.focalLength !== null) {
      applyCameraFocalLength(camera2, isMode.focalLength);
    } else {
      camera2.fov = isMode.fov;
      camera2.updateProjectionMatrix();
      value.cameraFocalLength = clamp(camera2.getFocalLength(), 18, 120);
    }
  } else {
    focusCameraOnPoint(isMode.visibleHeight, camera2.userData.viewportAspect, camera2);
  }
  getCameraPose(camera2, vector3);
  camera2.lookAt(vector3);
  camera2.updateProjectionMatrix();
  orbitControls.target.copy(vector3);
  syncOrbitControls();
  orbitControls.update();
  syncCameraModeButtons(isMode.mode);
  syncCameraViewButtons(isMode.view);
  if ((flag || flag2 || flag3 || flag4) && flag5) {
    scheduleSave();
  }
  if (!recordChange.silent) {
    const previewFloorMode = getPreviewFloorMode2() === "all" ? "总览视角" : "当前层视角";
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function nudgeCamera(argPrimary, preserveView = {}) {
  const value = argPrimary === "top" ? "top" : "free";
  const topRotation = topViewRotation();
  syncCameraViewButtons(value);
  if (!camera2 || !orbitControls) {
    return;
  }
  if (camera2.userData.cameraView === value && (value !== "top" || camera2.userData.topRotation === topRotation) && preserveView.force !== true) {
    syncOrbitControls();
    return;
  }
  if (value === "free") {
    applyCameraView2({
      view: "free"
    });
    return;
  }
  const x45 = orbitControls.target.clone();
  const vector3 = resetOrbitTarget(camera2, x45);
  const list = Math.max(camera2.position.distanceTo(x45), 8);
  camera2.up.copy(topViewForwardVector(topRotation));
  if (camera2.isPerspectiveCamera) {
    applyCameraFocalLength();
    const localValue = THREE.MathUtils.degToRad(camera2.getEffectiveFOV());
    const localValue2 = Math.max(vector3 / (Math.tan(localValue / 2) * 2), 8);
    camera2.position.set(x45.x, x45.y + localValue2, x45.z);
  } else {
    focusCameraOnPoint(vector3, camera2.userData.viewportAspect || 1, camera2);
    camera2.position.set(x45.x, x45.y + list, x45.z);
  }
  camera2.userData.frameSize = vector3;
  camera2.userData.cameraView = "top";
  camera2.userData.topRotation = topRotation;
  getCameraPose(camera2, x45);
  camera2.lookAt(x45);
  camera2.updateProjectionMatrix();
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
  if (conditionalValue === "perspective" == !!camera2?.isPerspectiveCamera) {
    applyCameraFocalLength();
    syncOrbitControls();
    return;
  }
  const comparisonFlag = viewportAspect.preserveView !== false;
  const userData36 = camera2;
  const computedValue = orbitControls?.target.clone() || new THREE.Vector3(0, 0.6, 0);
  const length25 = userData36 ? userData36.position.clone().sub(computedValue) : new THREE.Vector3(1.12, 1.42, 1.2);
  const localValue = Math.max(length25.length(), 2);
  const conditionalValue2 = length25.lengthSq() > 1e-8 ? length25.normalize() : new THREE.Vector3(1.12, 1.42, 1.2).normalize();
  const viewportAspect2 = userData36?.userData.viewportAspect || Math.max(selectEl("#preview-3d").clientWidth / Math.max(selectEl("#preview-3d").clientHeight, 1), 0.1);
  const frameSize = comparisonFlag && userData36 ? resetOrbitTarget(userData36, computedValue) : userData36?.userData.frameSize || 10;
  orbitControls?.dispose();
  if (conditionalValue === "perspective") {
    camera2 = new THREE.PerspectiveCamera(36, viewportAspect2, 0.02, 200);
    applyCameraFocalLength(camera2);
    const halfValue = frameSize / (Math.tan(THREE.MathUtils.degToRad(camera2.getEffectiveFOV()) / 2) * 2);
    const conditionalValue3 = comparisonFlag ? halfValue : localValue;
    camera2.position.copy(computedValue).addScaledVector(conditionalValue2, Math.max(conditionalValue3, 2));
  } else {
    camera2 = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.02, 200);
    camera2.position.copy(computedValue).addScaledVector(conditionalValue2, localValue);
    focusCameraOnPoint(frameSize, viewportAspect2, camera2);
  }
  camera2.layers.enable(HELPER_LAYER);
  camera2.userData.viewportAspect = viewportAspect2;
  camera2.userData.frameSize = frameSize;
  camera2.userData.cameraView = userData36?.userData.cameraView || "free";
  camera2.userData.topRotation = userData36?.userData.topRotation || 0;
  camera2.up.copy(userData36?.up || new THREE.Vector3(0, 1, 0));
  getCameraPose(camera2, computedValue);
  camera2.lookAt(computedValue);
  camera2.updateProjectionMatrix();
  orbitControls = createOrbitControls(camera2);
  orbitControls.target.copy(computedValue);
  syncOrbitControls();
  if (!isStageEmbed || viewportAspect.deferControlUpdate !== true) {
    orbitControls.update();
  }
}
function initPreviewRenderer() {
  const value = selectEl("#preview-3d");
  try {
    previewScene2 = new THREE.Scene();
    camera2 = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.05, 200);
    camera2.layers.enable(HELPER_LAYER);
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
    orbitControls = createOrbitControls(camera2);
    updateModelLoadStatus();
    syncCameraModeButtons("orthographic");
    syncCameraViewButtons();
    hemisphereLight = new THREE.HemisphereLight(12504556, 1515053, 1.12);
    hemisphereLight.layers.enable(HELPER_LAYER);
    previewScene2.add(hemisphereLight);
    ambientLight = new THREE.AmbientLight(7175581, 0.42);
    ambientLight.layers.enable(HELPER_LAYER);
    previewScene2.add(ambientLight);
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
    previewScene2.add(previewSpotLight);
    fillLight = new THREE.DirectionalLight(8886724, 0.72);
    fillLight.position.set(9, 7, -10);
    fillLight.layers.enable(HELPER_LAYER);
    previewScene2.add(fillLight);
    topLight = new THREE.DirectionalLight(15791103, 0.68);
    topLight.position.set(0, 16, 1);
    topLight.layers.enable(HELPER_LAYER);
    previewScene2.add(topLight);
    worldGroup = new THREE.Group();
    previewScene2.add(worldGroup);
    if (yt) {
      renderCache = createContactShadowController({
        THREE,
        renderer,
        getRoot: () => worldGroup,
        requestFrame: updateLightPreview,
        canBuild: () => externalModels2.modelLoadState().active === 0 && externalModels2.modelLoadState().queued === 0
      });
      studioReady = createRegionLightController({
        THREE,
        renderer,
        scene: previewScene2,
        getRoot: () => worldGroup,
        contactShadows: renderCache,
        requestFrame: updateLightPreview
      });
    } else {
      shadowAtlas = createSpotShadowAtlasController({
        THREE,
        renderer,
        scene: previewScene2,
        camera: camera2,
        syncBeforeRender: isStageEmbed,
        requestFrame: updateLightPreview,
        canBuild: () => !document.hidden && !stageSession && !previewOrbitLocked && !isStageWarmup && !curtainMotionActive && !vacuumMotionActive && !isLeavingStudio && !isBakingLightCache && !floorShadowMotionActive && externalModels2.modelLoadState().active === 0 && externalModels2.modelLoadState().queued === 0
      });
    }
    applyPreviewEnvironment();
    orbitResumeTimer = new ResizeObserver(onPreviewContainerResize);
    orbitResumeTimer.observe(value);
    applyCameraView2();
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
      renderer.render(previewScene2, camera2);
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
      const helperFn2 = () => {
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
      const helperFn3 = detail => {
        Vo = detail.detail === true;
        helperFn2();
        if (Vo && ORBIT_DOLLY_SPEED_SCALE) {
          scheduleOrbitInteractionWarmup();
        }
      };
      renderer.domElement.addEventListener("hb-i3d-parent-visibility", helperFn3);
      for (const localValue of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
        renderer.domElement.addEventListener(localValue, helperFn, {
          passive: true
        });
      }
      document.addEventListener("visibilitychange", helperFn2);
      window.addEventListener("pagehide", () => {
        demandFrameLoop.dispose();
        document.removeEventListener("visibilitychange", helperFn2);
        shadowAtlas?.dispose?.();
        studioReady?.dispose();
        renderCache?.dispose();
        renderer.domElement.removeEventListener("hb-i3d-parent-visibility", helperFn3);
        for (const localValue of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
          renderer.domElement.removeEventListener(localValue, helperFn);
        }
      }, {
        once: true
      });
      helperFn2();
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
function focusCameraOnPoint(argPrimary, argSecondary, left2 = camera2) {
  if (!left2?.isOrthographicCamera) {
    return;
  }
  const blob = Math.max(argPrimary, 1) / 2;
  if (argSecondary >= 1) {
    left2.left = -blob * argSecondary;
    left2.right = blob * argSecondary;
    left2.top = blob;
    left2.bottom = -blob;
  } else {
    left2.left = -blob;
    left2.right = blob;
    left2.top = blob / Math.max(argSecondary, 0.1);
    left2.bottom = -blob / Math.max(argSecondary, 0.1);
  }
  left2.updateProjectionMatrix();
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
  const maxValue2 = Math.max(value.clientHeight, 1);
  const planPoint = isStageEmbed ? renderer.getSize(new THREE.Vector2()) : null;
  const flag = planPoint?.x === maxValue && planPoint?.y === maxValue2;
  const projectionMatrixCacheKey = isStageEmbed ? camera2.projectionMatrix.elements.join(",") : "";
  if (!flag) {
    renderer.setSize(maxValue, maxValue2, false);
  }
  camera2.userData.viewportAspect = maxValue / maxValue2;
  if (camera2.isOrthographicCamera) {
    focusCameraOnPoint(camera2.userData.frameSize || 10, camera2.userData.viewportAspect);
  } else {
    camera2.aspect = camera2.userData.viewportAspect;
    applyCameraFocalLength();
  }
  if (!flag || projectionMatrixCacheKey !== camera2.projectionMatrix.elements.join(",")) {
    requestRender();
  }
}
function serializeCameraState() {
  if (!camera2 || !orbitControls) {
    return null;
  } else {
    return {
      mode: camera2.isPerspectiveCamera ? "perspective" : "orthographic",
      cameraView: camera2.userData.cameraView || cameraViewMode(),
      topRotation: camera2.userData.topRotation || 0,
      position: camera2.position.clone(),
      target: orbitControls.target.clone(),
      up: camera2.up.clone(),
      zoom: camera2.zoom,
      visibleHeight: resetOrbitTarget(camera2, orbitControls.target),
      frameSize: camera2.userData.frameSize || resetOrbitTarget(camera2, orbitControls.target),
      viewportAspect: camera2.userData.viewportAspect || 1,
      fov: camera2.isPerspectiveCamera ? camera2.fov : 36,
      near: camera2.near,
      far: camera2.far
    };
  }
}
function applyStoredCameraPose(cameraPose, flag = cameraPose?.viewportAspect || 1) {
  if (!!cameraPose && !!renderer) {
    setCameraProjectionMode(cameraPose.mode, {
      preserveView: false
    });
    camera2.position.copy(cameraPose.position);
    camera2.up.copy(cameraPose.up);
    camera2.zoom = cameraPose.zoom || 1;
    camera2.near = cameraPose.near;
    camera2.far = cameraPose.far;
    camera2.userData.frameSize = cameraPose.frameSize;
    camera2.userData.viewportAspect = flag;
    camera2.userData.cameraView = cameraPose.cameraView || cameraViewMode();
    camera2.userData.topRotation = cameraPose.topRotation || 0;
    if (camera2.isPerspectiveCamera) {
      camera2.fov = cameraPose.fov;
      camera2.aspect = flag;
    } else {
      focusCameraOnPoint(cameraPose.frameSize, flag, camera2);
    }
    camera2.lookAt(cameraPose.target);
    camera2.updateProjectionMatrix();
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
  if (!isAutoDiagramEmbed2 || !exportPreviewStage) {
    return value;
  }
  const {
    width,
    height
  } = readExportResolution();
  const maxValue = Math.max(exportPreviewStage.clientWidth, 1);
  const maxValue2 = Math.max(exportPreviewStage.clientHeight, 1);
  const maxValue3 = Math.max(value, width / maxValue, height / maxValue2, 1.5);
  return Math.min(maxValue3, flag ? 2 : 4);
}
function resizeStageEmbedViewport() {
  if (!stageSession || orbitSuspended || !renderer || !camera2) {
    return;
  }
  const {
    width,
    height
  } = readExportResolution();
  const cameraPose = width / height;
  const value = Math.max(exportPreviewStage.clientWidth, 1);
  const maxValue = Math.max(exportPreviewStage.clientHeight, 1);
  const minValue = isAutoDiagramEmbed2 ? stageEmbedPixelRatio(false) : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(minValue);
  renderer.setSize(value, maxValue, false);
  camera2.userData.viewportAspect = cameraPose;
  if (camera2.isOrthographicCamera) {
    focusCameraOnPoint(camera2.userData.frameSize || 10, cameraPose, camera2);
  } else {
    camera2.aspect = cameraPose;
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
  let id2 = argPrimary === "width" ? isWidth : Number(exportWidth.value);
  let argPrimary2 = argPrimary === "height" ? isWidth : Number(exportHeight.value);
  id2 = Number.isFinite(id2) && id2 > 0 ? id2 : hc;
  argPrimary2 = Number.isFinite(argPrimary2) && argPrimary2 > 0 ? argPrimary2 : fc;
  if (exportLockRatio.checked) {
    if (argPrimary === "width") {
      if (silent) {
        id2 = clamp(id2, 320, 4096);
        argPrimary2 = Math.round(id2 / Tn);
        if (argPrimary2 < 320) {
          argPrimary2 = 320;
          id2 = Math.round(argPrimary2 * Tn);
        }
        if (argPrimary2 > 4096) {
          argPrimary2 = 4096;
          id2 = Math.round(argPrimary2 * Tn);
        }
      } else {
        argPrimary2 = Math.round(clamp(id2 / Tn, 320, 4096));
      }
    } else if (silent) {
      argPrimary2 = clamp(argPrimary2, 320, 4096);
      id2 = Math.round(argPrimary2 * Tn);
      if (id2 < 320) {
        id2 = 320;
        argPrimary2 = Math.round(id2 / Tn);
      }
      if (id2 > 4096) {
        id2 = 4096;
        argPrimary2 = Math.round(id2 / Tn);
      }
    } else {
      id2 = Math.round(clamp(argPrimary2 * Tn, 320, 4096));
    }
  }
  if (silent) {
    id2 = Math.round(clamp(id2, 320, 4096));
    argPrimary2 = Math.round(clamp(argPrimary2, 320, 4096));
    exportWidth.value = String(id2);
    exportHeight.value = String(argPrimary2);
  } else if (exportLockRatio.checked) {
    if (argPrimary === "width") {
      exportHeight.value = String(argPrimary2);
    } else {
      exportWidth.value = String(id2);
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
    const previewFloorMode = getPreviewFloorMode2() === "all" ? "总览视角" : "当前层视角";
    exportStatus.textContent = "已恢复上次保存的" + previewFloorMode;
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function normalizeProjectExportPresets() {
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, normalizeExportPresetSlots2.length);
  projectDoc2.exportPresets = normalizeExportPresetSlots2;
  projectDoc2.activeExportPresetSlot = normalizeActiveExportPresetSlot2;
  const lookupMap = new Map((projectDoc2?.floors || []).map(floor => [floor.id, floor.name]));
  h0.replaceChildren(...normalizeExportPresetSlots2.map((preset, argSecondary) => {
    const element = document.createElement("button");
    element.type = "button";
    element.dataset.exportPresetSlot = String(argSecondary);
    element.setAttribute("role", "tab");
    const el2 = document.createElement("strong");
    const el22 = document.createElement("small");
    el2.textContent = preset?.name || lookupMap.get(preset?.floorId) || "未命名存档";
    el22.textContent = preset ? "已设置" : "未设置";
    const value = argSecondary === normalizeActiveExportPresetSlot2;
    element.classList.toggle("active", value);
    element.classList.toggle("has-value", !!preset);
    element.setAttribute("aria-selected", String(value));
    element.title = preset ? el2.textContent + "：已设置" : el2.textContent + "：未设置";
    element.append(el2, el22);
    return element;
  }));
  const floor = normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2];
  f0.disabled = normalizeExportPresetSlots2.length >= MAX_EXPORT_PRESET_COUNT;
  g0.disabled = !floor;
  p0.disabled = normalizeExportPresetSlots2.length <= 1;
  const flag = exportPresetIsEmpty(floor, exportPresetEditorOpen2);
  gg.hidden = !flag;
  pg.textContent = floor ? defaultExportPresetLabel(floor, normalizeActiveExportPresetSlot2) + "已设置" : "当前存档尚未设置";
}
function syncExportCameraFocalUi({
  name = ""
} = {}) {
  if (camera2.isPerspectiveCamera) {
    const value = selectEl("#camera-focal-length");
    const clamp2 = clamp(finite(value?.value, getCameraFocalLength()), 18, 120);
    activeCameraSettings().cameraFocalLength = clamp2;
    for (const entry of cameraFocalLengthEls) {
      entry.value = String(Math.round(clamp2));
    }
    applyCameraFocalLength(camera2, clamp2);
  }
  const {
    width,
    height
  } = readExportResolution();
  const point3 = orbitControls.target;
  return normalizeExportPreset({
    name,
    width,
    height,
    lockRatio: exportLockRatio.checked,
    floorMode: getPreviewFloorMode2() === "all" ? "all" : "floor",
    floorId: activeFloor()?.id || activeFloorId,
    floorGap: finite(projectDoc2.exportFloorGap, 3),
    camera: {
      mode: camera2.isPerspectiveCamera ? "perspective" : "orthographic",
      view: cameraViewMode(),
      topRotation: topViewRotation(),
      position: {
        x: camera2.position.x,
        y: camera2.position.y,
        z: camera2.position.z
      },
      target: {
        x: point3.x,
        y: point3.y,
        z: point3.z
      },
      visibleHeight: resetOrbitTarget(camera2, point3),
      fov: camera2.isPerspectiveCamera ? camera2.fov : 36,
      focalLength: camera2.isPerspectiveCamera ? getCameraFocalLength() : null
    },
    folderName: exportFolderName.value,
    selectedFiles: [...checkedExportFileKeys()]
  });
}
function fitExportCameraAspect(camera2) {
  const viewportAspect = readExportResolution().width / readExportResolution().height;
  const value = activeCameraSettings();
  value.cameraMode = camera2.mode;
  value.cameraView = camera2.view;
  value.cameraTopRotation = camera2.topRotation;
  if (camera2.focalLength !== null) {
    value.cameraFocalLength = camera2.focalLength;
  }
  const position = new THREE.Vector3(camera2.position.x, camera2.position.y, camera2.position.z);
  const target = new THREE.Vector3(camera2.target.x, camera2.target.y, camera2.target.z);
  applyStoredCameraPose({
    mode: camera2.mode,
    cameraView: camera2.view,
    topRotation: camera2.topRotation,
    position,
    target,
    up: camera2.view === "top" ? topViewForwardVector(camera2.topRotation) : new THREE.Vector3(0, 1, 0),
    zoom: 1,
    visibleHeight: camera2.visibleHeight,
    frameSize: camera2.visibleHeight,
    viewportAspect,
    fov: camera2.fov,
    near: 0.02,
    far: Math.max(position.distanceTo(target) * (camera2.mode === "perspective" ? 8 : 5), 100)
  }, viewportAspect);
  syncCameraModeButtons(camera2.mode);
  syncCameraViewButtons(camera2.view);
}
function activateExportPresetSlot(floor, silent = {}) {
  const flag = normalizeExportPreset(projectDoc2?.exportPresets?.[floor]);
  if (!flag || !stageSession) {
    return false;
  }
  exportWidth.value = String(flag.width);
  exportHeight.value = String(flag.height);
  exportLockRatio.checked = flag.lockRatio;
  Tn = flag.width / flag.height;
  projectDoc2.exportFloorGap = flag.floorGap;
  const id2 = projectDoc2.floors.find(lightBrightness => lightBrightness.id === flag.floorId);
  const conditionalValue = flag.floorMode === "all" && projectDoc2.floors.length > 1 ? "all" : id2?.id || activeFloor()?.id || activeFloorId;
  setExportFloorScope(conditionalValue);
  exportFloorGap2.value = flag.floorGap.toFixed(1);
  exportFolderName.value = flag.folderName;
  const has14 = new Set(flag.selectedFiles);
  const localValue = has14.has("televisionOn");
  const localValue2 = has14.has("vehicleCharging");
  for (const dataset4 of exportDialog.querySelectorAll("input[data-export-file]")) {
    const prefixText = dataset4.dataset.exportFile;
    dataset4.checked = has14.has(prefixText) || localValue && prefixText.startsWith("screen:") || localValue2 && prefixText.startsWith("vehicle:");
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
  const value = projectDoc2?.exportPresets?.length || 0;
  if (!Number.isInteger(argPrimary) || argPrimary < 0 || argPrimary >= value || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDoc2.activeExportPresetSlot = argPrimary;
  const flag = activateExportPresetSlot(argPrimary);
  exportPresetEditorOpen2 = false;
  normalizeProjectExportPresets();
  scheduleSave();
  if (!flag) {
    exportStatus.textContent = "存档 " + String(argPrimary + 1).padStart(2, "0") + " 没有设置";
  }
}
function flushExportUiDebounce() {
  window.clearTimeout(exportUiDebounceTimer2);
  exportUiDebounceTimer2 = null;
  if (!exportPresetEditorOpen2) {
    return false;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, projectDoc2?.exportPresets?.length);
  if (!stageSession || orbitSuspended) {
    return false;
  }
  projectDoc2.exportPresets = normalizeExportPresetSlots(projectDoc2.exportPresets);
  const name = projectDoc2.exportPresets[normalizeActiveExportPresetSlot2]?.name || "";
  projectDoc2.exportPresets[normalizeActiveExportPresetSlot2] = syncExportCameraFocalUi({
    name
  });
  exportPresetEditorOpen2 = false;
  normalizeProjectExportPresets();
  scheduleSave();
  return true;
}
function openExportPresetEditor() {
  if (!!stageSession && !orbitSuspended) {
    exportPresetEditorOpen2 = true;
    normalizeProjectExportPresets();
    window.clearTimeout(exportUiDebounceTimer2);
    exportUiDebounceTimer2 = window.setTimeout(flushExportUiDebounce, 360);
  }
}
function defaultExportPresetLabel(argPrimary, argSecondary) {
  if (!argPrimary) {
    return "存档 " + String(argSecondary + 1).padStart(2, "0");
  }
  const normalizeLabelText2 = (projectDoc2?.floors || []).find(item => item.id === argPrimary.floorId)?.name;
  return argPrimary.name || normalizeLabelText2 || "存档 " + String(argSecondary + 1).padStart(2, "0");
}
function uniqueExportPresetLabel(size, argSecondary = -1) {
  const blob = normalizeLabelText(size, "导出视角", 24);
  const isPutImageData = new Set((projectDoc2?.exportPresets || []).map((argPrimary, argSecondary2) => argSecondary2 === argSecondary ? "" : defaultExportPresetLabel(argPrimary, argSecondary2)).filter(Boolean));
  if (!isPutImageData.has(blob)) {
    return blob;
  }
  let buildLightDeltaPixels2 = 2;
  while (isPutImageData.has(blob + " " + buildLightDeltaPixels2)) {
    buildLightDeltaPixels2 += 1;
  }
  return (blob + " " + buildLightDeltaPixels2).slice(0, 24);
}
function addExportPresetSlot() {
  if (!stageSession || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDoc2.exportPresets = normalizeExportPresetSlots(projectDoc2.exportPresets);
  if (projectDoc2.exportPresets.length >= MAX_EXPORT_PRESET_COUNT) {
    showToast("最多可以保存 8 个导出存档。");
    return;
  }
  const length = projectDoc2.exportPresets.length;
  const value = getPreviewFloorMode2() === "all" ? "全楼" : activeFloor()?.name || "存档 " + (length + 1);
  const name = uniqueExportPresetLabel(value + "视角");
  const size = projectDoc2.exportPresets.slice(0, length).reverse().find(Boolean);
  const syncExportCameraFocalUiResult = syncExportCameraFocalUi({
    name
  });
  if (size) {
    syncExportCameraFocalUiResult.width = size.width;
    syncExportCameraFocalUiResult.height = size.height;
    syncExportCameraFocalUiResult.lockRatio = size.lockRatio;
  }
  projectDoc2.exportPresets.push(syncExportCameraFocalUiResult);
  projectDoc2.activeExportPresetSlot = length;
  exportPresetEditorOpen2 = false;
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
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, normalizeExportPresetSlots2.length);
  if (normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2]) {
    exportPresetRenameInput.value = defaultExportPresetLabel(normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2], normalizeActiveExportPresetSlot2);
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
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  if (normalizeExportPresetSlots2.length <= 1) {
    return;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, normalizeExportPresetSlots2.length);
  bg.textContent = defaultExportPresetLabel(normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2], normalizeActiveExportPresetSlot2);
  exportPresetDeleteDialog.showModal();
}
function confirmExportPresetDelete() {
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  if (normalizeExportPresetSlots2.length <= 1) {
    return;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, normalizeExportPresetSlots2.length);
  const value = defaultExportPresetLabel(normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2], normalizeActiveExportPresetSlot2);
  window.clearTimeout(exportUiDebounceTimer2);
  exportUiDebounceTimer2 = null;
  exportPresetEditorOpen2 = false;
  normalizeExportPresetSlots2.splice(normalizeActiveExportPresetSlot2, 1);
  projectDoc2.exportPresets = normalizeExportPresetSlots2;
  projectDoc2.activeExportPresetSlot = Math.min(normalizeActiveExportPresetSlot2, normalizeExportPresetSlots2.length - 1);
  closeExportPresetDeleteDialog();
  const flag = activateExportPresetSlot(projectDoc2.activeExportPresetSlot, {
    silent: true
  });
  normalizeProjectExportPresets();
  scheduleSave();
  exportStatus.textContent = flag ? "已切换到相邻存档" : "当前存档尚未设置";
  showToast("已删除“" + value + "”，楼层和户型未受影响。", "success");
}
function postAutoDiagramMessage(numericParam = 0) {
  if (!!isAutoDiagramEmbed2 && !!autoDiagramComponentId && window.parent !== window) {
    requestAnimationFrame(() => {
      if (!stageSession || !renderer || !previewScene2 || !camera2 || !orbitControls) {
        return;
      }
      resizeStageEmbedViewport();
      if (!worldGroup?.children?.length) {
        rebuildWorldPreview2();
      }
      const flag = exportPreviewStage.clientWidth > 1 && exportPreviewStage.clientHeight > 1;
      const flag2 = !!worldGroup?.children?.length;
      let flag3 = false;
      if (flag && flag2) {
        requestRender({
          shadows: true
        });
        orbitControls.update();
        for (let value = 0; value < 2; value += 1) {
          renderer.render(previewScene2, camera2);
        }
        const render = renderer.info.render;
        flag3 = render.calls > 0 && render.triangles > 0;
        renderer.domElement.dataset.renderCalls = String(render.calls);
        renderer.domElement.dataset.renderTriangles = String(render.triangles);
        renderer.domElement.dataset.renderLines = String(render.lines);
        needsRenderFrame = false;
        renderIdle = flag3;
        initRenderStatsHud();
      }
      if (!flag3 && numericParam < 7) {
        postAutoDiagramMessage(numericParam + 1);
        return;
      }
      if (!flag3) {
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
        floors: projectDoc2.floors.map(id => ({
          id: id.id,
          name: id.name
        })),
        floorSelection: getPreviewFloorMode2() === "all" ? "all" : activeFloor()?.id || activeFloorId
      }, window.location.origin);
    });
  }
}
function scheduleOrbitResumeAfterModels() {
  if (stageSession || !renderer || !camera2 || !orbitControls) {
    return;
  }
  window.clearTimeout(exportUiDebounceTimer2);
  exportUiDebounceTimer2 = null;
  exportPresetEditorOpen2 = false;
  const list = collectLightGroupsAcrossFloors();
  const list2 = collectTvsAcrossFloors();
  const list3 = collectSmallCarsAcrossFloors();
  stageSession = {
    canvasParent: renderer.domElement.parentElement,
    camera: serializeCameraState(),
    selected: selection ? {
      ...selection
    } : null,
    selectedMany: multiSelection.map(argPrimary => ({
      ...argPrimary
    })),
    floorMode: getPreviewFloorMode2(),
    selectedFloorId: activeFloorId,
    floorCameraSettings: new Map(projectDoc2.floors.map(floor => [floor.id, {
      mode: floor.scene.settings.cameraMode,
      view: floor.scene.settings.cameraView,
      topRotation: floor.scene.settings.cameraTopRotation,
      focalLength: floor.scene.settings.cameraFocalLength
    }])),
    combinedCameraSettings: {
      ...projectDoc2.combinedCameraSettings
    },
    groupStates: new Map(list.map(({
      key,
      group
    }) => [key, group.enabled])),
    tvStates: new Map(list2.map(({
      key,
      item
    }) => [key, item.screenEnabled !== false])),
    carChargingStates: new Map(list3.map(({
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
  if (isAutoDiagramEmbed2) {
    document.body.classList.add("auto-diagram-embedded");
    const value = new URLSearchParams(window.location.search);
    const clamp2 = clamp(finite(value.get("dashboard-width"), finite(value.get("component-width"), exportWidth.value)), 320, 4096);
    const clamp3 = clamp(finite(value.get("dashboard-height"), finite(value.get("component-height"), exportHeight.value)), 320, 4096);
    exportWidth.value = String(Math.round(clamp2));
    exportHeight.value = String(Math.round(clamp3));
    exportLockRatio.checked = true;
    if (exportFolderQuery2) {
      exportFolderName.value = exportFolderQuery2;
    }
    syncExportResolutionLabel();
  }
  exportDialog.showModal();
  exportPreviewStage.append(renderer.domElement);
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(projectDoc2.activeExportPresetSlot, projectDoc2.exportPresets.length);
  const flag = normalizeActiveExportPresetSlot2 !== null && activateExportPresetSlot(normalizeActiveExportPresetSlot2, {
    silent: true
  });
  if (isAutoDiagramEmbed2 && floorSelectionQuery2 !== null) {
    const id2 = projectDoc2.floors.find(item => item.id === floorSelectionQuery2);
    const value = floorSelectionQuery2 === "all" && projectDoc2.floors.length > 1 ? "all" : id2?.id || activeFloor()?.id || activeFloorId;
    setExportFloorScope(value);
  }
  if (!flag) {
    rebuildWorldPreview2();
    if (activeFixedCameraView()) {
      applyStageFixedCameraView({
        silent: true
      });
    } else if (isAutoDiagramEmbed2) {
      setCameraProjectionMode(getCameraProjectionMode(), {
        preserveView: false
      });
      applyCameraView2();
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
  const list2 = [];
  const handler = (argPrimary, argSecondary, argTertiary) => {
    const appendEl = document.createElement("li");
    const append2 = document.createElement("label");
    const button = document.createElement("input");
    button.type = "checkbox";
    button.checked = true;
    button.dataset.exportFile = argPrimary;
    const el2 = document.createElement("span");
    el2.textContent = argSecondary;
    const el22 = document.createElement("small");
    el22.textContent = argTertiary;
    append2.append(button, el2);
    appendEl.append(append2, el22);
    list2.push(appendEl);
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
  exportGroupFiles.replaceChildren(...list2);
}
function currentExportFloorScope() {
  const flag = getPreviewFloorMode2() === "all";
  const value = flag ? "all" : activeFloor()?.id || activeFloorId;
  exportFloorSelect.replaceChildren(...projectDoc2.floors.map(id => {
    const el2 = document.createElement("option");
    el2.value = id.id;
    el2.textContent = id.name;
    return el2;
  }), ...(projectDoc2.floors.length > 1 ? [Object.assign(document.createElement("option"), {
    value: "all",
    textContent: "全楼合并"
  })] : []));
  exportFloorSelect.value = value;
  syncStudioSelect(exportFloorSelect);
  yg.hidden = !flag || projectDoc2.floors.length <= 1;
  syncControlValue(exportFloorGap2, finite(projectDoc2.exportFloorGap, 3).toFixed(1));
  syncFloorCameraChrome();
}
function setExportFloorScope(floorEntry) {
  if (!stageSession || orbitSuspended) {
    return;
  }
  const flag = floorEntry === "all" && projectDoc2.floors.length > 1;
  if (!flag) {
    const id2 = projectDoc2.floors.find(item => item.id === floorEntry);
    if (!id2) {
      return;
    }
    stageSession.selectedFloorId = id2.id;
    floorScene2 = id2.scene;
  }
  projectDoc2.previewFloorMode = flag ? "all" : "active";
  currentExportFloorScope();
  syncPreviewFloorButtons();
  syncFloorCameraChrome();
  rebuildWorldPreview2();
  if (activeFixedCameraView()) {
    applyStageFixedCameraView({
      silent: true
    });
  } else {
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false
    });
    applyCameraView2();
  }
  renderExportFileChecklist();
  exportStatus.textContent = getPreviewFloorMode2() === "all" ? "正在构图：全楼合并" : "正在构图：" + (activeFloor()?.name || "当前层");
  scheduleStageEmbedResize();
}
function checkedExportFileKeys() {
  return new Set([...exportDialog.querySelectorAll("input[data-export-file]:checked")].map(el2 => el2.dataset.exportFile));
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
  for (const floor of projectDoc2.floors) {
    const floorCameraSetting = cameraSettings.floorCameraSettings.get(floor.id);
    if (floorCameraSetting) {
      floor.scene.settings.cameraMode = floorCameraSetting.mode;
      floor.scene.settings.cameraView = floorCameraSetting.view;
      floor.scene.settings.cameraTopRotation = floorCameraSetting.topRotation;
      floor.scene.settings.cameraFocalLength = floorCameraSetting.focalLength;
    }
  }
  projectDoc2.combinedCameraSettings = {
    ...cameraSettings.combinedCameraSettings
  };
  stageSession = null;
  projectDoc2.previewFloorMode = cameraSettings.floorMode;
  floorScene2 = projectDoc2.floors.find(item => item.id === activeFloorId)?.scene || projectDoc2.floors[0].scene;
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
  rebuildWorldPreview2();
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
  for (const id2 of exportDialog.querySelectorAll("input, button")) {
    if (id2.id !== "export-close" && id2.id !== "export-package") {
      id2.disabled = flag;
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
    renderer.render(previewScene2, camera2);
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
async function capturePreviewCanvas2(planPoint, floor, options = {}) {
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
async function composeExportCanvas(flag, flag2) {
  const width15 = document.createElement("canvas");
  width15.width = flag.width;
  width15.height = flag.height;
  const putImageData2 = width15.getContext("2d");
  if (!putImageData2) {
    throw new Error("当前浏览器无法创建透明灯光层。");
  }
  const localValue = buildLightDeltaPixels(flag.data, flag2.data);
  putImageData2.putImageData(new ImageData(localValue, flag.width, flag.height), 0, 0);
  return canvasToBlob(width15);
}
async function drawExportAnnotations(data, lights, argTertiary, value, argN5, argN6) {
  const blob = document.createElement("canvas");
  blob.width = argTertiary;
  blob.height = value;
  const isDrawImage = blob.getContext("2d");
  const el2 = document.createElement("canvas");
  el2.width = argTertiary;
  el2.height = value;
  const isClearRect = el2.getContext("2d");
  if (!isDrawImage || !isClearRect) {
    throw new Error("当前浏览器无法合成逐灯阴影。");
  }
  const list = lights.lights.filter(lightBrightness => finite(lightBrightness.lightBrightness, 0) > 0);
  try {
    for (let count = 0; count < list.length; count += 1) {
      const id2 = list[count];
      exportStatus.textContent = "正在渲染灯组 " + (argN5 + 1) + "/" + argN6 + "：" + lights.name + "（" + (count + 1) + "/" + list.length + "）";
      forcedVisibleLightGroupIds = new Set([id2.id]);
      if (getPreviewFloorMode2() === "all") {
        rebuildWorldPreview2({
          preserveLightCache: true
        });
      } else {
        rebuildPreviewLightMeshes2({
          preserveLightCache: true
        });
      }
      const imageData = await capturePreviewCanvas2(argTertiary, value, {
        pixels: true
      });
      const buildLightDeltaPixels2 = buildLightDeltaPixels(data.data, imageData.imageData.data);
      isClearRect.clearRect(0, 0, argTertiary, value);
      isClearRect.putImageData(new ImageData(buildLightDeltaPixels2, argTertiary, value), 0, 0);
      isDrawImage.drawImage(el2, 0, 0);
      await yieldToScheduler();
    }
  } finally {
    forcedVisibleLightGroupIds = null;
  }
  return canvasToBlob(blob);
}
async function buildExportImageCanvas(flag, floor, optionalValue = null) {
  const width16 = document.createElement("canvas");
  width16.width = flag;
  width16.height = floor;
  const fillStyle = width16.getContext("2d");
  if (!fillStyle) {
    throw new Error("当前浏览器无法创建导出底图。");
  }
  fillStyle.fillStyle = "#" + resolvedThemeColors().background.toString(16).padStart(6, "0");
  fillStyle.fillRect(0, 0, flag, floor);
  if (optionalValue) {
    const width9 = document.createElement("canvas");
    width9.width = flag;
    width9.height = floor;
    const putImageData = width9.getContext("2d");
    if (!putImageData) {
      throw new Error("当前浏览器无法合成户型底图。");
    }
    putImageData.putImageData(optionalValue, 0, 0);
    fillStyle.drawImage(width9, 0, 0);
  }
  return canvasToBlob(width16);
}
function sanitizeExportFileName(argPrimary, argSecondary) {
  return String(argPrimary || "").normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || argSecondary;
}
function uniqueExportFileName(flag, argSecondary, idSet, argN4 = EXPORT_IMAGE_EXTENSION) {
  const value = sanitizeExportFileName(flag, "灯组-" + (argSecondary + 1));
  const string = String(argN4).replace(/^\./, "");
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
    mode: camera2.isPerspectiveCamera ? "perspective" : "orthographic",
    position: {
      x: camera2.position.x,
      y: camera2.position.y,
      z: camera2.position.z
    },
    target: {
      x: value.x,
      y: value.y,
      z: value.z
    },
    aspect: item / argSecondary,
    visibleHeight: resetOrbitTarget(camera2, value),
    fov: camera2.isPerspectiveCamera ? camera2.fov : null
  };
}
function serializeFloorLightItem(argPrimary, scene10 = activeFloor()) {
  const computedValue = scene10?.scene?.calibration?.pixelsPerMeter || 1;
  return {
    id: argPrimary.id,
    floorId: scene10?.id || null,
    type: argPrimary.type,
    position: {
      x: argPrimary.x / computedValue,
      z: argPrimary.y / computedValue,
      elevation: floorStackOffsetY(scene10) + (argPrimary.elevation || 0)
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
function projectItemToScreenNorm(x46, scene11, floorEntries = previewFloorEntries()) {
  if (!x46 || !scene11 || !camera2) {
    return null;
  }
  const computedValue = scene11.scene?.calibration?.pixelsPerMeter || 1;
  let zeroValue = 0;
  let halfValue = Math.max(0, finite(x46.elevation, 0)) + Math.max(0.02, finite(x46.height, 0.1)) / 2;
  let zeroValue2 = 0;
  if (getPreviewFloorMode2() === "all") {
    const computedValue2 = (finite(x46.x, 0) - finite(scene11.originX, 0)) / computedValue;
    const computedValue3 = (finite(x46.y, 0) - finite(scene11.originY, 0)) / computedValue;
    const localValue = -THREE.MathUtils.degToRad(finite(scene11.rotation, 0));
    zeroValue = computedValue2 * Math.cos(localValue) + computedValue3 * Math.sin(localValue) + finite(scene11.offsetX, 0);
    zeroValue2 = -computedValue2 * Math.sin(localValue) + computedValue3 * Math.cos(localValue) + finite(scene11.offsetZ, 0);
    const foundIndex = [...floorEntries].sort((elevation7, elevation8) => elevation7.elevation - elevation8.elevation);
    const localValue2 = Math.max(0, foundIndex.findIndex(wall2 => wall2.id === scene11.id));
    halfValue += localValue2 * finite(projectDoc2.exportFloorGap, 3);
  } else {
    const walls = scene11.scene;
    const minX2 = walls.walls?.length ? modelBounds({
      background: null,
      walls: walls.walls,
      items: []
    }) : walls.items?.length ? modelBounds({
      background: null,
      walls: [],
      items: walls.items
    }) : modelBounds(walls);
    zeroValue = (finite(x46.x, 0) - (minX2.minX + minX2.maxX) / 2) / computedValue;
    zeroValue2 = (finite(x46.y, 0) - (minX2.minY + minX2.maxY) / 2) / computedValue;
  }
  camera2.updateMatrixWorld(true);
  const z3 = new THREE.Vector3(zeroValue, halfValue, zeroValue2).project(camera2);
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
    const localValue2 = projectItemToScreenNorm(localValue, argSecondary, floorEntries);
    if (localValue2) {
      return localValue2;
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
    group: enabled5
  } of collectLightGroupsAcrossFloors()) {
    enabled5.enabled = argPrimary === "*" || localValue === argPrimary;
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
  rebuildWorldPreview2();
}
function setExportRoleVisibility(reason, message) {
  if (worldGroup) {
    worldGroup.traverse(userData15 => {
      if (userData15.userData?.exportRole === reason) {
        userData15.visible = message;
      }
    });
    requestRender({
      shadows: reason === "plan"
    });
  }
}
function resolveExportOverwrite(argPrimary = "cancel") {
  const value = exportOverwriteResolver2;
  exportOverwriteResolver2 = null;
  if (exportOverwriteDialog.open) {
    exportOverwriteDialog.close();
  }
  value?.(argPrimary);
}
function promptExportOverwrite(argPrimary) {
  if (exportOverwriteResolver2) {
    resolveExportOverwrite("cancel");
  }
  Mg.textContent = argPrimary;
  exportOverwriteDialog.showModal();
  return new Promise(argPrimary2 => {
    exportOverwriteResolver2 = argPrimary2;
  });
}
function notifyAutoDiagramExport(argPrimary, message2) {
  if (!!isAutoDiagramEmbed2 && !!autoDiagramComponentId && window.parent !== window) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-stopped",
      componentId: autoDiagramComponentId,
      reason: argPrimary,
      message: message2
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
  const list2 = collectLightGroupsAcrossFloors(list).map(({
    floor,
    group,
    index,
    key: id2
  }) => ({
    id: id2,
    groupId: group.id,
    floor,
    name: list.length > 1 ? floor.name + "-" + group.name : group.name,
    enabledInEditor: stageSession.groupStates.get(id2) !== false,
    file: uniqueExportFileName(list.length > 1 ? floor.name + "-" + group.name : group.name, index, idSet),
    lights: floor.scene.items.filter(item => lightItemTypes2.has(item.type) && item.lightGroupId === group.id)
  })).filter(id => value.has("group:" + id.id));
  const list3 = collectTvsAcrossFloors(list).map(({
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
  const list4 = collectSmallCarsAcrossFloors(list).map(({
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
  for (let count = 0; count < list3.length; count += 1) {
    const file = list3[count];
    file.file = uniqueExportFileName(file.name, count, idSet);
  }
  for (let count = 0; count < list4.length; count += 1) {
    const file = list4[count];
    file.file = uniqueExportFileName(file.name, count, idSet);
  }
  const list5 = list3.filter(key => value.has("screen:" + key.key));
  const list6 = list4.filter(key => value.has("vehicle:" + key.key));
  const flag = value.has("backgroundWithPlan") || value.has("floorPlan") || list5.length > 0 || list6.length > 0 || list2.length > 0;
  let flag2 = false;
  setOrbitSuspended(true);
  try {
    exportStatus.textContent = "正在检查文件夹名…";
    if ((await studioFetch("/studio3d/exports/check", {
      headers: {
        "X-Export-Folder": encodeURIComponent(exportName)
      }
    }))?.exists) {
      exportStatus.textContent = "同名导图“" + exportName + "”已经存在";
      const local2 = await promptExportOverwrite(exportName);
      if (local2 === "rename") {
        exportStatus.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          exportFolderName.focus();
          exportFolderName.select();
        }, 0);
        notifyAutoDiagramExport("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (local2 !== "overwrite") {
        exportStatus.textContent = "已取消覆盖，原导图保持不变";
        notifyAutoDiagramExport("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      flag2 = true;
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
      isImageData = await capturePreviewCanvas2(width, height, {
        pixels: true
      });
      setExportRoleVisibility("plan", true);
      setExportRoleVisibility("label", true);
      setExportRoleVisibility("outline", true);
    }
    if (flag) {
      imageData = await capturePreviewCanvas2(width, height, {
        pixels: true
      });
    }
    const list7 = [];
    if (isImageData) {
      const arrayBuffer = await buildExportImageCanvas(width, height, isImageData.imageData);
      list7.push({
        name: background.background,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    if (value.has("backgroundWithPlan")) {
      const arrayBuffer = await buildExportImageCanvas(width, height, imageData.imageData);
      list7.push({
        name: background.backgroundWithPlan,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    if (value.has("floorPlan")) {
      setExportRoleVisibility("background", false);
      setExportRoleVisibility("grid", false);
      const blob = await capturePreviewCanvas2(width, height, {
        blob: true
      });
      setExportRoleVisibility("background", true);
      setExportRoleVisibility("grid", true);
      list7.push({
        name: background.floorPlan,
        data: await readFileAsUint8Array(blob.blob)
      });
    }
    for (let count = 0; count < list2.length; count += 1) {
      const lights = list2[count];
      const arrayBuffer = await drawExportAnnotations(imageData.imageData, lights, width, height, count, list2.length);
      list7.push({
        name: lights.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    for (let count = 0; count < list5.length; count += 1) {
      const named = list5[count];
      exportStatus.textContent = "正在生成电视图层 " + (count + 1) + "/" + list5.length + "：" + named.name;
      applyCrossFloorLayerEnableMasks("", named.key);
      const imageData2 = await capturePreviewCanvas2(width, height, {
        pixels: true
      });
      const arrayBuffer = await composeExportCanvas(imageData.imageData, imageData2.imageData);
      list7.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    for (let count = 0; count < list6.length; count += 1) {
      const named = list6[count];
      exportStatus.textContent = "正在生成汽车图层 " + (count + 1) + "/" + list6.length + "：" + named.name;
      applyCrossFloorLayerEnableMasks("", "", named.key);
      const imageData2 = await capturePreviewCanvas2(width, height, {
        pixels: true
      });
      const arrayBuffer = await composeExportCanvas(imageData.imageData, imageData2.imageData);
      list7.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    const manifest = {
      schemaVersion: 3,
      exportName,
      floorMode: getPreviewFloorMode2(),
      floorPresentationGap: getPreviewFloorMode2() === "all" ? finite(projectDoc2.exportFloorGap, 3) : 0,
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
      televisionOnImage: list5.length === 1 ? list5[0].file : null,
      televisionOnImages: list5.map(file => file.file),
      vehicleChargingImage: list6.length === 1 ? list6[0].file : null,
      vehicleChargingImages: list6.map(file => file.file),
      exportedFiles: list7.map(named => named.name),
      groups: list2.map(floor => ({
        id: floor.id,
        groupId: floor.groupId,
        floorId: floor.floor.id,
        name: floor.name,
        file: floor.file,
        anchor: projectItemsToScreenAnchors(floor.lights, floor.floor, list),
        enabledInEditor: floor.enabledInEditor,
        lights: floor.lights.map(item => serializeFloorLightItem(item, floor.floor))
      })),
      screens: list3.map(({
        key,
        floor,
        item,
        ...argPrimary
      }) => ({
        ...argPrimary,
        anchor: projectItemToScreenNorm(item, floor, list),
        file: value.has("screen:" + key) ? argPrimary.file : null
      })),
      vehicles: list4.map(({
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
      list7.push({
        name: "lights.json",
        data: new TextEncoder().encode(JSON.stringify(manifest, null, 2) + "\n")
      });
    }
    if (value.has("dataScene")) {
      const previewFloorMode = getPreviewFloorMode2() === "all" ? cloneProjectDoc() : cloneFloorScene();
      list7.push({
        name: "scene.json",
        data: new TextEncoder().encode(JSON.stringify(previewFloorMode, null, 2) + "\n")
      });
    }
    exportStatus.textContent = "正在打包 ZIP…";
    const buildStoredZip2 = buildStoredZip(list7);
    exportStatus.textContent = "正在保存到 NAS data…";
    const body = new Blob([buildStoredZip2], {
      type: "application/zip"
    });
    const putStudioDocument = (flag3 = false) => studioFetch("/studio3d/exports", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/zip",
        "X-Export-Folder": encodeURIComponent(exportName),
        ...(flag3 ? {
          "X-Export-Overwrite": "true"
        } : {})
      }
    });
    let overwritten;
    try {
      overwritten = await putStudioDocument(flag2);
    } catch (error) {
      if (error?.status !== 409 || error?.payload?.detail?.code !== "STUDIO3D_EXPORT_EXISTS") {
        throw error;
      }
      exportStatus.textContent = "同名导图“" + exportName + "”已经存在";
      const local2 = await promptExportOverwrite(exportName);
      if (local2 === "rename") {
        exportStatus.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          exportFolderName.focus();
          exportFolderName.select();
        }, 0);
        notifyAutoDiagramExport("rename", "请在属性中修改文件夹名称后重新生成。");
        return;
      }
      if (local2 !== "overwrite") {
        exportStatus.textContent = "已取消覆盖，原导图保持不变";
        notifyAutoDiagramExport("cancel", "已取消覆盖，原导图保持不变。");
        return;
      }
      exportStatus.textContent = "正在安全覆盖原导图…";
      overwritten = await putStudioDocument(true);
    }
    exportStatus.textContent = "已保存到 data/" + overwritten.relativePath;
    showToast("导图已保存到 data/" + overwritten.relativePath, "success");
    const isClosed = isAutoDiagramEmbed2 ? window.parent : window.opener;
    if (autoDiagramComponentId && isClosed && (isAutoDiagramEmbed2 || !isClosed.closed)) {
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
    if (isAutoDiagramEmbed2 && autoDiagramComponentId && window.parent !== window) {
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
    rebuildWorldPreview2();
    applyStoredCameraPose(view, width / height);
    setOrbitSuspended(false);
    scheduleStageEmbedResize();
  }
}
function disposeObject3dResources(object3d) {
  const idSet = new Set();
  const idSet2 = new Set();
  object3d.traverse(object3d2 => {
    object3d2.shadow?.dispose?.();
    if (object3d2.geometry && !idSet.has(object3d2.geometry) && !object3d2.userData.externalModelSharedGeometry && !object3d2.userData.sofaSharedGeometry && !object3d2.userData.rugSharedGeometry && !object3d2.userData.architectureSharedGeometry) {
      idSet.add(object3d2.geometry);
      object3d2.geometry.dispose?.();
    }
    const value = Array.isArray(object3d2.material) ? object3d2.material : object3d2.material ? [object3d2.material] : [];
    for (const entriesVar of value) {
      if (!idSet2.has(entriesVar)) {
        idSet2.add(entriesVar);
        if (!object3d2.userData.externalModelSharedTextures) {
          entriesVar.map?.dispose?.();
        }
        if (!object3d2.userData.sofaSharedMaterial && !object3d2.userData.rugSharedMaterial && !object3d2.userData.architectureSharedMaterial && !object3d2.userData.externalModelSharedMaterial) {
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
function addBoxMesh(group, width, height, depth, argN5, argN6, argN7, color, options = {}) {
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
  mesh.position.set(argN5, argN6, argN7);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  mesh.renderOrder = options.renderOrder ?? 0;
  group.add(mesh);
  return mesh;
}
function normalizeBoxPartSpec(point3) {
  if (Array.isArray(point3)) {
    const [width, height, depth, x35 = 0, y2 = 0, z2 = 0, rotationY = 0] = point3;
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
    width: point3.width,
    height: point3.height,
    depth: point3.depth,
    x: point3.x || 0,
    y: point3.y || 0,
    z: point3.z || 0,
    rotationY: point3.rotationY || 0
  };
}
function buildMergedBoxGeometry(list) {
  const list2 = list.map(normalizeBoxPartSpec).filter(size => [size.width, size.height, size.depth].every(argPrimary => Number.isFinite(argPrimary) && argPrimary > 0.0001));
  if (!list2.length) {
    return null;
  }
  const value = JSON.stringify(list2.map(point3 => [point3.width, point3.height, point3.depth, point3.x, point3.y, point3.z, point3.rotationY]));
  if (!mergedBoxGeometryCache.has(value)) {
    const item = list2.map(point3 => {
      const applyMatrix4 = new THREE.BoxGeometry(point3.width, point3.height, point3.depth);
      const vector3 = new THREE.Matrix4().compose(new THREE.Vector3(point3.x, point3.y, point3.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, point3.rotationY, 0)), new THREE.Vector3(1, 1, 1));
      return applyMatrix4.applyMatrix4(vector3);
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
  const color4 = new THREE.Color(color).getHex();
  const value = JSON.stringify([color4, flag.roughness ?? 0.8, flag.metalness ?? 0.01, !!flag.transparent, flag.opacity ?? 1, flag.depthWrite ?? true, flag.depthFunc ?? THREE.LessEqualDepth, flag.side ?? THREE.FrontSide, flag.emissive ?? 0, flag.emissiveIntensity ?? 0]);
  if (!rugMaterialCache.has(value)) {
    rugMaterialCache.set(value, new THREE.MeshStandardMaterial({
      color: color4,
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
function createBoxPartMesh(argPrimary, argSecondary, argTertiary, argN4, argN5, argN6) {
  const value = Math.max(Math.min(argPrimary, argSecondary, argTertiary), 0.001);
  const minValue = Math.min(value * 0.14, value * 0.45, 0.08);
  const boxGeometry = new RoundedBoxGeometry(argPrimary, argSecondary, argTertiary, 2, minValue);
  boxGeometry.translate(argN4, argN5, argN6);
  return boxGeometry;
}
function mergeBoxPartGeometries(list) {
  const item = list.map(argPrimary => createBoxPartMesh(...argPrimary));
  const mergeGeometries2 = mergeGeometries(item);
  item.forEach(dispose => dispose.dispose());
  return mergeGeometries2;
}
function getCachedSofaSeatGeometry(argPrimary, argSecondary, argTertiary) {
  const list = argPrimary + ":" + argSecondary + ":" + argTertiary;
  if (lightPropertyMeta.has(list)) {
    return lightPropertyMeta.get(list);
  }
  const handler = mergeBoxPartGeometries([[argPrimary * 0.92, argSecondary * 0.28, argTertiary * 0.72, 0, argSecondary * 0.28, argTertiary * 0.06], [argPrimary * 0.92, argSecondary * 0.55, argTertiary * 0.18, 0, argSecondary * 0.56, -argTertiary * 0.35], [argPrimary * 0.1, argSecondary * 0.48, argTertiary * 0.75, -argPrimary * 0.46, argSecondary * 0.39, argTertiary * 0.03], [argPrimary * 0.1, argSecondary * 0.48, argTertiary * 0.75, argPrimary * 0.46, argSecondary * 0.39, argTertiary * 0.03]]);
  const list2 = mergeBoxPartGeometries([[argPrimary * 0.42, argSecondary * 0.12, argTertiary * 0.55, -argPrimary * 0.22, argSecondary * 0.47, argTertiary * 0.07], [argPrimary * 0.42, argSecondary * 0.12, argTertiary * 0.55, argPrimary * 0.22, argSecondary * 0.47, argTertiary * 0.07]]);
  const conditionalValue = handler && list2 ? {
    frame: handler,
    cushions: list2
  } : null;
  if (conditionalValue) {
    lightPropertyMeta.set(list, conditionalValue);
  } else {
    handler?.dispose();
    list2?.dispose();
  }
  return conditionalValue;
}
function getCachedColorMaterial(color) {
  const id2 = String(color);
  if (!colorMaterialCache.has(id2)) {
    colorMaterialCache.set(id2, new THREE.MeshStandardMaterial({
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
  return colorMaterialCache.get(id2);
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
    const localValue2 = Math.min(Math.min(group, hasFlag) * 0.018, localValue * 0.45, 0.08);
    const base = new RoundedBoxGeometry(group, value, hasFlag, 2, localValue2);
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
function addRugMeshes(group, size, color, color2) {
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
  const rugMaterialInstance = flag ? getCachedRugMaterial(color2, true).clone() : getCachedRugMaterial(color2, true);
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
function createGlassMaterial(color, flag2 = false, depthWrite = false) {
  const flag = color.material;
  if (!color.isMesh || color.isSkinnedMesh || color.isBatchedMesh || color.morphTargetInfluences || Array.isArray(flag) || !flag?.isMeshStandardMaterial || flag.transparent || flag.opacity < 1 || flag.transmission > 0 || flag.alphaHash || flag.displacementMap || flag.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile || flag.customProgramCacheKey !== THREE.Material.prototype.customProgramCacheKey || color.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender || flag.clippingPlanes?.length || !flag2 && Object.values(flag).some(isTexture2 => isTexture2?.isTexture)) {
    return "";
  }
  const push16 = [];
  for (const localValue of Object.keys(flag).sort()) {
    if (["id", "uuid", "name", "userData", "version", "_listeners"].includes(localValue)) {
      continue;
    }
    const isTexture4 = flag[localValue];
    if (localValue === "color" && depthWrite) {
      push16.push([localValue, [1, 1, 1]]);
      continue;
    }
    if (isTexture4 == null || ["number", "boolean", "string"].includes(typeof isTexture4)) {
      push16.push([localValue, isTexture4]);
    } else if (isTexture4.isTexture) {
      push16.push([localValue, isTexture4.uuid]);
    } else if (isTexture4.isColor || isTexture4.isVector2 || isTexture4.isVector3 || isTexture4.isVector4 || isTexture4.isMatrix3 || isTexture4.isMatrix4 || isTexture4.isEuler) {
      push16.push([localValue, isTexture4.toArray()]);
    } else if (Array.isArray(isTexture4) && isTexture4.every(argPrimary => ["number", "boolean", "string"].includes(typeof argPrimary))) {
      push16.push([localValue, isTexture4]);
    } else if (localValue === "defines") {
      push16.push([localValue, Object.entries(isTexture4).sort(([localeCompare], [argSecondary]) => localeCompare.localeCompare(argSecondary))]);
    } else {
      return "";
    }
  }
  return JSON.stringify([push16, color.castShadow, color.receiveShadow, color.renderOrder, color.layers.mask]);
}
function meshMaterialSignature(light) {
  const material = Object.entries(light.geometry?.attributes || {}).sort(([localeCompare2], [argSecondary]) => localeCompare2.localeCompare(argSecondary)).map(([argPrimary, itemSize2]) => [argPrimary, itemSize2.itemSize, itemSize2.normalized, itemSize2.array?.constructor?.name]);
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
  const group2 = collectDescendantMeshes(updateMatrixWorld);
  const emissive = group2.length;
  const clamp2 = new Map();
  for (const userData35 of group2) {
    if (userData35.userData.televisionScreen || userData35.userData.televisionGlow || userData35.userData.curtainPart) {
      continue;
    }
    const localValue = createGlassMaterial(userData35);
    if (!localValue) {
      continue;
    }
    const computedValue = localValue + ":" + meshMaterialSignature(userData35);
    if (!clamp2.has(computedValue)) {
      clamp2.set(computedValue, []);
    }
    clamp2.get(computedValue).push(userData35);
  }
  updateMatrixWorld.updateMatrixWorld(true);
  const clamp3 = updateMatrixWorld.matrixWorld.clone().invert();
  for (const length18 of clamp2.values()) {
    if (length18.length < 2) {
      continue;
    }
    const forEach2 = length18.map(matrixWorld => {
      const localValue = new THREE.Matrix4().multiplyMatrices(clamp3, matrixWorld.matrixWorld);
      return matrixWorld.geometry.clone().applyMatrix4(localValue);
    });
    const localValue2 = mergeGeometries(forEach2);
    forEach2.forEach(dispose => dispose.dispose());
    if (!localValue2) {
      continue;
    }
    const material8 = length18[0];
    const castShadow5 = new THREE.Mesh(localValue2, material8.material);
    castShadow5.castShadow = material8.castShadow;
    castShadow5.receiveShadow = material8.receiveShadow;
    castShadow5.renderOrder = material8.renderOrder;
    castShadow5.userData = {};
    length18.forEach((parent3, argSecondary) => {
      parent3.parent?.remove(parent3);
      if (!parent3.userData.externalModelSharedGeometry) {
        parent3.geometry.dispose();
      }
      if (argSecondary > 0) {
        parent3.material.dispose();
      }
    });
    updateMatrixWorld.add(castShadow5);
  }
  updateMatrixWorld.userData.optimizationStats = {
    type: item,
    before: emissive,
    after: collectDescendantMeshes(updateMatrixWorld).length
  };
}
function addSoftBoxMesh(group, argSecondary, argTertiary, argN4, argN5, argN6, argN7, color, light = {}) {
  const value = new THREE.MeshStandardMaterial({
    color,
    roughness: light.roughness ?? 0.62,
    metalness: light.metalness ?? 0.03,
    transparent: !!light.transparent,
    opacity: light.opacity ?? 1,
    depthWrite: light.depthWrite ?? true
  });
  const light2 = new THREE.Mesh(new THREE.CylinderGeometry(argSecondary, argTertiary, argN4, light.segments ?? 24), value);
  light2.position.set(argN5, argN6, argN7);
  if (light.rotationX) {
    light2.rotation.x = light.rotationX;
  }
  if (light.rotationZ) {
    light2.rotation.z = light.rotationZ;
  }
  light2.castShadow = light.castShadow !== false;
  light2.receiveShadow = light.receiveShadow !== false;
  group.add(light2);
  return light2;
}
function materialFingerprint(material2) {
  material2.userData.exportRole = "light-source-preview";
  material2.castShadow = false;
  material2.receiveShadow = false;
  material2.renderOrder = 20;
  return material2;
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
  const clampedValue2 = clamp(finite(flag.width, 1), 0.1, 8);
  const localValue = clampedValue;
  const rotation5 = new THREE.Group();
  rotation5.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(flag.verticalRotation));
  const rotation6 = new THREE.Group();
  rotation6.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(flag.stripRollRotation));
  const clampedValue3 = clamp(finite(flag.lightRange, 3.5) * 0.16, 0.28, 0.72);
  materialFingerprint(addBoxMesh(rotation6, clampedValue2, 0.014, localValue, 0, -clampedValue3, 0, emissive, {
    rounded: false,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    emissive,
    emissiveIntensity: 0.68,
    castShadow: false,
    receiveShadow: false
  }));
  materialFingerprint(addSoftBoxMesh(rotation6, 0.012, 0.012, clampedValue3, 0, -clampedValue3 * 0.5, 0, emissive, {
    segments: 10,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    roughness: 0.3,
    emissive,
    emissiveIntensity: 0.8
  }));
  const rotation7 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 10), new THREE.MeshBasicMaterial({
    color: emissive,
    transparent: true,
    opacity: 0.82,
    depthWrite: false
  }));
  rotation7.rotation.x = Math.PI;
  rotation7.position.set(0, -clampedValue3, 0);
  materialFingerprint(rotation7);
  rotation6.add(rotation7);
  rotation5.add(rotation6);
  value.add(rotation5);
  object3d.add(value);
}
function createWallTopMaterial(flag, argSecondary, argTertiary) {
  const flag2 = [{
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
    const push10 = [new THREE.Vector3(-halfWidth.halfWidth, halfWidth.y, halfWidth.backZ), new THREE.Vector3(halfWidth.halfWidth, halfWidth.y, halfWidth.backZ), new THREE.Vector3(halfWidth.halfWidth, halfWidth.y, halfWidth.sideZ)];
    for (let oneValue = 1; oneValue <= 18; oneValue += 1) {
      const halfValue = oneValue / 18 * Math.PI;
      push10.push(new THREE.Vector3(Math.cos(halfValue) * halfWidth.halfWidth, halfWidth.y, halfWidth.sideZ + Math.sin(halfValue) * (halfWidth.frontZ - halfWidth.sideZ)));
    }
    return push10;
  };
  const length26 = flag2.map(helperFn);
  const lengthValue = length26[0].length;
  const length27 = length26.flatMap(flatMap => flatMap.flatMap(point3 => [point3.x, point3.y, point3.z]));
  const push17 = [];
  for (let ring = 0; ring < length26.length - 1; ring += 1) {
    const ringBase = ring * lengthValue;
    const nextRingBase = (ring + 1) * lengthValue;
    for (let i = 0; i < lengthValue; i += 1) {
      const next = (i + 1) % lengthValue;
      const a = ringBase + i;
      const b = ringBase + next;
      const c = nextRingBase + i;
      const d = nextRingBase + next;
      push17.push(a, d, b, a, c, d);
    }
  }
  const topCenter = length27.length / 3;
  length27.push(0, flag2[0].y, argSecondary * 0.08);
  const bottomCenter = length27.length / 3;
  length27.push(0, flag2.at(-1).y, argSecondary * 0.08);
  const lastRingBase = (length26.length - 1) * lengthValue;
  for (let i = 0; i < lengthValue; i += 1) {
    const next = (i + 1) % lengthValue;
    push17.push(topCenter, i, next);
    push17.push(bottomCenter, lastRingBase + next, lastRingBase + i);
  }
  const setAttribute2 = new THREE.BufferGeometry();
  setAttribute2.setAttribute("position", new THREE.Float32BufferAttribute(length27, 3));
  setAttribute2.setIndex(push17);
  setAttribute2.computeVertexNormals();
  setAttribute2.computeBoundingSphere();
  return setAttribute2;
}
function buildTelevisionMesh(group, argSecondary, argTertiary, argN4, argN5, argN6, argN7, color, color2) {
  const group2 = new THREE.Group();
  const computedValue = argN4 * 0.49;
  const height = argN4 * 0.12;
  const computedValue2 = -argTertiary * 0.39;
  addBoxMesh(group2, argSecondary * 0.9, height, argTertiary * 0.82, 0, computedValue, argTertiary * 0.02, color, {
    radius: Math.min(argSecondary, argTertiary) * 0.06,
    roughness: 0.72
  });
  addBoxMesh(group2, argSecondary * 0.78, argN4 * 0.34, argTertiary * 0.09, 0, argN4 * 0.78, computedValue2, color, {
    radius: Math.min(argSecondary, argTertiary) * 0.045,
    roughness: 0.72
  });
  for (const value of [-0.38, 0.38]) {
    addBoxMesh(group2, 0.05, argN4 * 0.47, 0.05, argSecondary * value, argN4 * 0.235, argTertiary * 0.34, color2, {
      rounded: false
    });
    addBoxMesh(group2, 0.05, argN4 * 0.94, 0.05, argSecondary * value, argN4 * 0.47, computedValue2, color2, {
      rounded: false
    });
  }
  group2.position.set(argN5, 0, argN6);
  group2.rotation.y = argN7;
  group.add(group2);
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
    const maxValue2 = Math.max(size.height - minValue * 2, 0.08);
    list.push([maxValue, maxValue2, 0.018, size.centerX, size.height / 2, size.centerZ]);
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
  const maxTextureUnits2 = resolvedThemeColors();
  traverse.traverse(material3 => {
    const conditionalValue = Array.isArray(material3.material) ? material3.material : material3.material ? [material3.material] : [];
    for (const isMeshStandardMaterial of conditionalValue) {
      if (isMeshStandardMaterial?.isMeshStandardMaterial) {
        isMeshStandardMaterial.emissive = new THREE.Color(maxTextureUnits2.accent);
        isMeshStandardMaterial.emissiveIntensity = 0.32;
      }
    }
  });
}
function markAsLightSourcePreview(light) {
  const light2 = document.createElement("canvas");
  light2.width = 2048;
  light2.height = 640;
  const light3 = light2.getContext("2d");
  light3.clearRect(0, 0, light2.width, light2.height);
  light3.fillStyle = "#929baa";
  light3.textAlign = "left";
  light3.textBaseline = "middle";
  const normalizedLabel = normalizeLabelText(light.title, "家庭总览", 24);
  const normalizedLabel2 = normalizeLabelText(light.subtitle, "HOME PLAN", 36);
  const numericValue = 115;
  const numericValue2 = 184;
  light3.font = "700 " + numericValue2 + "px sans-serif";
  drawTrackedText(light3, normalizedLabel, numericValue, 130, numericValue2 * clamp(finite(light.titleSpacing, 1.05), 0, 1.8), 1340);
  const numericValue3 = 1580;
  const numericValue4 = 130;
  const numericValue5 = 170;
  light3.fillStyle = "#929baa";
  light3.beginPath();
  light3.moveTo(numericValue3, numericValue4 - numericValue5 * 0.58);
  light3.lineTo(numericValue3 + numericValue5 * 0.56, numericValue4 - numericValue5 * 0.02);
  light3.lineTo(numericValue3 + numericValue5 * 0.38, numericValue4 - numericValue5 * 0.02);
  light3.lineTo(numericValue3 + numericValue5 * 0.38, numericValue4 + numericValue5 * 0.5);
  light3.lineTo(numericValue3 - numericValue5 * 0.38, numericValue4 + numericValue5 * 0.5);
  light3.lineTo(numericValue3 - numericValue5 * 0.38, numericValue4 - numericValue5 * 0.02);
  light3.lineTo(numericValue3 - numericValue5 * 0.56, numericValue4 - numericValue5 * 0.02);
  light3.closePath();
  light3.fill();
  light3.save();
  light3.globalCompositeOperation = "destination-out";
  light3.fillRect(numericValue3 - numericValue5 * 0.09, numericValue4 + numericValue5 * 0.2, numericValue5 * 0.18, numericValue5 * 0.3);
  light3.restore();
  light3.fillStyle = "#929baa";
  light3.textAlign = "left";
  const numericValue6 = 310;
  light3.font = "400 " + numericValue6 + "px \"Arial Narrow\", Arial, sans-serif";
  drawTrackedText(light3, normalizedLabel2, 72, 410, numericValue6 * clamp(finite(light.subtitleSpacing, 0.08), 0, 0.6), 1880);
  const numericValue7 = 74;
  const computedValue = numericValue7 + clamp(finite(light.lineLength, 0.86), 0.3, 1) * 1880;
  light3.strokeStyle = "rgba(146, 155, 170, 0.72)";
  light3.lineWidth = 16;
  light3.beginPath();
  light3.moveTo(numericValue7, 590);
  light3.lineTo(computedValue, 590);
  light3.moveTo(numericValue7, 566);
  light3.lineTo(numericValue7, 614);
  light3.moveTo(computedValue, 566);
  light3.lineTo(computedValue, 614);
  light3.stroke();
  const colorSpace = new THREE.CanvasTexture(light2);
  colorSpace.colorSpace = THREE.SRGBColorSpace;
  colorSpace.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  colorSpace.needsUpdate = true;
  const light4 = new THREE.Mesh(new THREE.PlaneGeometry(light.width, light.depth), new THREE.MeshBasicMaterial({
    map: colorSpace,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    forceSinglePass: isStageEmbed
  }));
  light4.rotation.x = -Math.PI / 2;
  light4.position.y = 0.008;
  light4.castShadow = false;
  light4.receiveShadow = false;
  light4.renderOrder = 8;
  return light4;
}
function shadowCastingLightIdSet() {
  return new Set(selectShadowCastingLightIds(floorScene2.items.map(id => ({
    id: id.id,
    groupId: id.lightGroupId,
    type: id.type,
    brightness: finite(id.lightBrightness, defaultLightPresets[id.type]?.brightness || 0),
    enabled: lightItemTypes2.has(id.type) && isLightGroupVisible(id)
  })), b0));
}
function createPlanLabelSprite(size) {
  if (!size || size.isMeshBasicMaterial || size.isShadowMaterial) {
    return 0;
  }
  let lengthValue = Object.values(size).filter(isTexture3 => isTexture3?.isTexture === true).length;
  if (size.isMeshPhysicalMaterial && finite(size.transmission, 0) > 0) {
    lengthValue += 1;
  }
  return lengthValue;
}
function countMaterialTextures(traverse2 = worldGroup) {
  let length = 0;
  traverse2?.traverse(material4 => {
    if (!material4.isMesh) {
      return;
    }
    const conditionalValue = Array.isArray(material4.material) ? material4.material : material4.material ? [material4.material] : [];
    for (const localValue of conditionalValue) {
      length = Math.max(length, createPlanLabelSprite(localValue));
    }
  });
  if (previewScene2?.environment?.isTexture) {
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
  object3d?.traverse(object3d2 => {
    if (!object3d2.isSpotLight || object3d2.userData?.shadowCandidate !== true) {
      return;
    }
    const isArrayResult = String(object3d2.userData?.lightFloorId || "");
    const localValue = String(object3d2.userData?.lightItemId || "");
    if (localValue) {
      value.push({
        id: isArrayResult + ":" + localValue,
        groupId: isArrayResult + ":" + String(object3d2.userData?.lightGroupId || ""),
        type: String(object3d2.userData?.lightType || "downlight"),
        brightness: finite(object3d2.userData?.lightBrightness, 0),
        enabled: object3d2.visible !== false
      });
    }
  });
  return value;
}
function syncSpotShadowCastingLights(traverse3 = worldGroup, {
  rebuildAtlas: options = true
} = {}) {
  if (yt) {
    traverse3?.traverse(isLight3 => {
      if (isLight3.isLight && isLight3.userData?.lightItemId) {
        isLight3.castShadow = false;
        isLight3.layers.set(30);
      }
    });
    if (renderer) {
      renderer.domElement.dataset.spotShadowMode = "region";
      renderer.domElement.dataset.activeSpotShadows = "0";
    }
    return 0;
  }
  if (!traverse3 || !renderer) {
    return 0;
  }
  const flag = maxTextureUnits();
  const flag2 = countMaterialTextures(traverse3);
  let nonSpotShadowTextureUnits = 0;
  previewScene2?.traverse(visible6 => {
    if (visible6.visible !== false && visible6.isLight && !visible6.isSpotLight && visible6.castShadow) {
      nonSpotShadowTextureUnits += 1;
    }
  });
  let boolFlag = false;
  traverse3.traverse(visible7 => {
    if (visible7.visible !== false && visible7.isRectAreaLight) {
      boolFlag = true;
    }
  });
  const rectAreaLightTextureUnits = boolFlag ? deferredModelTimer : 0;
  const computedValue = flag - flag2 - nonSpotShadowTextureUnits - rectAreaLightTextureUnits - externalModels;
  if (!stageSession && shadowAtlas && computedValue >= 1 && renderer.domElement.dataset.spotShadowMode !== "fallback") {
    const conditionalValue = options ? shadowAtlas.schedule(traverse3) : countSceneMeshes(traverse3).length;
    const localValue = shadowAtlas.sync(traverse3);
    const dataset2 = renderer.domElement;
    dataset2.dataset.fragmentTextureUnits = String(flag);
    dataset2.dataset.materialTextureUnits = String(flag2);
    dataset2.dataset.spotShadowLimit = String(conditionalValue);
    dataset2.dataset.activeSpotShadows = String(localValue);
    let zeroValue = 0;
    traverse3.traverse(isLight4 => {
      if (isLight4.isLight && isLight4.userData?.lightItemId && isLight4.visible !== false) {
        zeroValue += 1;
      }
    });
    dataset2.dataset.activeUserLights = String(zeroValue);
    return localValue;
  }
  const localValue2 = spotShadowTextureUnitLimit({
    maxTextureUnits: flag,
    materialTextureUnits: flag2,
    nonSpotShadowTextureUnits,
    rectAreaLightTextureUnits,
    reservedTextureUnits: externalModels,
    hardLimit: b0
  });
  if (stageSession && shadowAtlas) {
    shadowAtlas.setEnabled(false);
    shadowAtlas.sync(traverse3);
  }
  const has15 = new Set(selectShadowCastingLightIds(countSceneMeshes(traverse3), localValue2));
  let zeroValue2 = 0;
  traverse3.traverse(userData22 => {
    if (!userData22.isSpotLight || !userData22.userData?.lightItemId) {
      return;
    }
    const computedValue2 = String(userData22.userData?.lightFloorId || "") + ":" + String(userData22.userData.lightItemId);
    const castShadow4 = has15.has(computedValue2);
    userData22.castShadow = castShadow4;
    if (castShadow4) {
      zeroValue2 += 1;
      if (userData22.shadow && !userData22.shadow.map) {
        userData22.shadow.needsUpdate = true;
      }
    }
  });
  const dataset8 = renderer.domElement;
  dataset8.dataset.spotShadowMode = "individual";
  dataset8.dataset.fragmentTextureUnits = String(flag);
  dataset8.dataset.materialTextureUnits = String(flag2);
  dataset8.dataset.spotShadowLimit = String(localValue2);
  dataset8.dataset.activeSpotShadows = String(zeroValue2);
  let zeroValue3 = 0;
  traverse3.traverse(isLight5 => {
    if (isLight5.isLight && isLight5.userData?.lightItemId && isLight5.visible !== false) {
      zeroValue3 += 1;
    }
  });
  dataset8.dataset.activeUserLights = String(zeroValue3);
  return zeroValue2;
}
function buildWallCornerCaps(list, color, argTertiary) {
  const list2 = isStageEmbed ? lightEffectColorHex(color.lightTemperature) : kelvinToRgbHex(color.lightTemperature);
  const list3 = isLightGroupVisible(color) && finite(color.lightBrightness, 0) > 0;
  const flag = !stageSession && forcedVisibleLightGroupIds === null && (isStageEmbed || !isPreviewQualityReady());
  const flag2 = !stageSession && residentCacheMode;
  if (!list3 && !flag && !flag2) {
    return;
  }
  const range2 = defaultLightPresets[color.type] || defaultLightPresets.downlight;
  const halfValue = clamp(finite(color.lightBrightness, range2.brightness), 0, 100) / 100;
  const computedValue = deferExternalModels[color.type] || 1.1;
  const flag22 = color.type === "striplight";
  const id2 = resolveLightGroup(color);
  if (flag22) {
    const object3d = clamp(finite(color.width, 2), 0.1, 8);
    const clampedValue = clamp(finite(color.depth, 0.28), 0.1, 8);
    const clampedValue2 = clamp(finite(color.lightRange, range2.range), 0.5, 10);
    const clampedValue3 = clamp(clampedValue2 / range2.range, 0.45, 1.65);
    const localValue = Math.max(finite(color.elevation, 2.7), 0.4);
    const clampedValue4 = clamp(Math.max(1, Math.pow(localValue / 2.7, 2)), 1, 4);
    const rotation4 = new THREE.Group();
    rotation4.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(color.verticalRotation));
    const object3d2 = new THREE.Group();
    object3d2.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(color.stripRollRotation));
    const lightOnIntensity2 = (yt ? halfValue : Math.pow(halfValue, 0.82)) * 48 * clampedValue3 * clampedValue4 * computedValue;
    const userData28 = new THREE.RectAreaLight(list2, list3 ? lightOnIntensity2 : 0, object3d * 0.94, clampedValue * 0.94);
    userData28.visible = list3;
    userData28.position.y = -0.04;
    userData28.rotation.x = -Math.PI / 2;
    userData28.userData.lightItemId = color.id;
    userData28.userData.lightGroupId = id2?.id || "";
    userData28.userData.lightFloorId = activeFloorId;
    userData28.userData.lightSourceType = "continuous-area-strip";
    userData28.userData.lightOnIntensity = lightOnIntensity2;
    if (yt) {
      userData28.userData.regionFullIntensity = clampedValue3 * 48 * clampedValue4 * computedValue;
      studioReady?.register(userData28, color);
    }
    object3d2.add(userData28);
    rotation4.add(object3d2);
    list.add(rotation4);
    return;
  }
  const needsUpdate = argTertiary?.has(color.id) === true;
  const computedValue2 = needsUpdate || flag2 || flag;
  const far2 = clamp(finite(color.lightRange, range2.range), 0.5, 10);
  const clampedValue5 = clamp(finite(color.lightAngle, range2.angle), 15, defaultItemDepth(color.type));
  const oneValue = 1;
  const comparisonFlag = (color.type === "ceilinglight" ? 680 : 520) * (yt ? halfValue : spotLightBrightnessResponse(color.type, halfValue)) * computedValue;
  for (let value = 0; value < oneValue; value += 1) {
    const worldPoint = oneValue === 1 ? 0 : -color.width * 0.47 + color.width * 0.94 * value / (oneValue - 1);
    const worldPoint2 = new THREE.SpotLight(list2, list3 ? comparisonFlag / oneValue : 0, far2, THREE.MathUtils.degToRad(clampedValue5 / 2), 0.86, 2);
    worldPoint2.visible = list3;
    worldPoint2.position.set(worldPoint, -0.025, 0);
    worldPoint2.castShadow = false;
    worldPoint2.layers.enable(HELPER_LAYER);
    if (computedValue2) {
      const blurSamples = localSpotShadowSettings(color.type, far2, clampedValue5);
      const localValue = scaledShadowMapSize(blurSamples.mapSize);
      worldPoint2.shadow.mapSize.set(localValue, localValue);
      worldPoint2.shadow.camera.near = clamp(far2 * 0.05, 0.12, 0.24);
      worldPoint2.shadow.camera.far = far2;
      worldPoint2.shadow.camera.layers.set(HELPER_LAYER);
      worldPoint2.shadow.bias = -0.00005;
      worldPoint2.shadow.normalBias = blurSamples.normalBias;
      worldPoint2.shadow.radius = blurSamples.radius;
      worldPoint2.shadow.blurSamples = shadowCameraExpanded ? Math.max(8, blurSamples.blurSamples) : blurSamples.blurSamples;
      worldPoint2.shadow.autoUpdate = false;
      worldPoint2.shadow.needsUpdate = needsUpdate;
    }
    worldPoint2.userData.lightItemId = color.id;
    worldPoint2.userData.lightGroupId = id2?.id || "";
    worldPoint2.userData.lightFloorId = activeFloorId;
    worldPoint2.userData.lightType = color.type;
    worldPoint2.userData.lightBrightness = finite(color.lightBrightness, range2.brightness);
    worldPoint2.userData.shadowCandidate = true;
    worldPoint2.userData.prewarmShadow = isStageEmbed;
    worldPoint2.userData.lightOnIntensity = comparisonFlag / oneValue;
    if (yt) {
      worldPoint2.userData.regionFullIntensity = (color.type === "ceilinglight" ? 680 : 520) * computedValue;
      studioReady?.register(worldPoint2, color);
    }
    const shadowCameraHelperTarget = new THREE.Object3D();
    shadowCameraHelperTarget.position.set(worldPoint, -Math.max(finite(color.elevation, 2.68), 0.8), 0);
    list.add(shadowCameraHelperTarget);
    worldPoint2.target = shadowCameraHelperTarget;
    list.add(worldPoint2);
  }
}
function createTvScreenTexture() {
  const el2 = document.createElement("canvas");
  el2.width = 960;
  el2.height = 540;
  const canvasCtx = el2.getContext("2d");
  if (!canvasCtx) {
    return null;
  }
  canvasCtx.fillStyle = "#07111d";
  canvasCtx.fillRect(0, 0, el2.width, el2.height);
  canvasCtx.fillStyle = "#0f2031";
  canvasCtx.fillRect(0, 0, 510, el2.height);
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
  const colorSpace = new THREE.CanvasTexture(el2);
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
function addTvMountMeshes(group, tvMountStyle, argTertiary, argN4, argN5) {
  const {
    bodyHeight,
    centerY
  } = tvMountLayoutMetrics(tvMountStyle, argN5);
  const width = argTertiary * 0.965;
  const height = bodyHeight * 0.94;
  const depth = 0.012;
  const value = Math.max(argN4 * 0.28, 0.05) * 0.5 + 0.006;
  const scaledDepth = value - depth * 0.5;
  if (tvMountStyle.screenEnabled === false) {
    const userData29 = addBoxMesh(group, width, height, depth, 0, centerY, scaledDepth, 527122, {
      roughness: 0.18
    });
    userData29.userData.televisionScreen = true;
    if (isStageEmbed) {
      userData29.userData.environmentEffect = true;
    }
    return;
  }
  const userData37 = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.035, height * 1.08), new THREE.MeshBasicMaterial({
    color: 7253215,
    transparent: true,
    opacity: 0.09,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  userData37.userData.televisionGlow = true;
  if (isStageEmbed) {
    userData37.userData.environmentEffect = true;
  }
  userData37.position.set(0, centerY, value - 0.014);
  userData37.renderOrder = 6;
  userData37.castShadow = false;
  userData37.receiveShadow = false;
  group.add(userData37);
  const mapVar = createTvScreenTexture();
  const meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 527122,
    toneMapped: false
  });
  const meshBasicMaterial2 = new THREE.MeshBasicMaterial({
    color: mapVar ? 16777215 : 1519946,
    mapVar,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const light2 = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, meshBasicMaterial2, meshBasicMaterial]);
  light2.userData.televisionScreen = true;
  if (isStageEmbed) {
    light2.userData.environmentEffect = true;
  }
  light2.position.set(0, centerY, scaledDepth);
  light2.renderOrder = 7;
  light2.castShadow = false;
  light2.receiveShadow = false;
  group.add(light2);
}
function addSmallCarMeshes(group, chargingEnabled, argTertiary, argN4, argN5) {
  if (chargingEnabled.chargingEnabled !== true) {
    return;
  }
  const value = 5238711;
  const el2 = document.createElement("canvas");
  el2.width = 256;
  el2.height = 256;
  const canvasCtx = el2.getContext("2d");
  const halfScreenWidth = el2.width / 2;
  const addColorStop = canvasCtx.createRadialGradient(halfScreenWidth, halfScreenWidth, 0, halfScreenWidth, halfScreenWidth, halfScreenWidth);
  addColorStop.addColorStop(0, "rgba(79, 239, 183, .48)");
  addColorStop.addColorStop(0.46, "rgba(79, 239, 183, .23)");
  addColorStop.addColorStop(1, "rgba(79, 239, 183, 0)");
  canvasCtx.fillStyle = addColorStop;
  canvasCtx.fillRect(0, 0, el2.width, el2.height);
  for (let index = 18; index < el2.height - 18; index += 10) {
    for (let index2 = 18; index2 < el2.width - 18; index2 += 10) {
      const hypot = Math.hypot(index2 - halfScreenWidth, index - halfScreenWidth) / halfScreenWidth;
      const maxValue = Math.max(0, 1 - hypot) * 0.32;
      if (!(maxValue <= 0.01)) {
        canvasCtx.fillStyle = "rgba(116, 255, 202, " + maxValue + ")";
        canvasCtx.beginPath();
        canvasCtx.arc(index2, index, 1.45, 0, Math.PI * 2);
        canvasCtx.fill();
      }
    }
  }
  const mapVar = new THREE.CanvasTexture(el2);
  mapVar.colorSpace = THREE.SRGBColorSpace;
  mapVar.needsUpdate = true;
  const light = new THREE.Mesh(new THREE.PlaneGeometry(argTertiary * 1.72, argN4 * 1.42), new THREE.MeshBasicMaterial({
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
  const light2 = new THREE.Mesh(new THREE.ShapeGeometry(lineTo), new THREE.MeshBasicMaterial({
    color: 8257488,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  const maxValue = Math.max(Math.min(argTertiary, argN4) * 0.22, 0.18);
  light2.scale.setScalar(maxValue);
  light2.rotation.x = -Math.PI / 2;
  light2.position.set(0, argN5 + 0.04, 0);
  light2.renderOrder = 9;
  light2.castShadow = false;
  light2.receiveShadow = false;
  group.add(light2);
}
function buildStudioItemMeshGroup(type20, optionalValue = null) {
  const rotation = new THREE.Group();
  rotation.userData.squareEdges = SOFT_TEXTURE_UNIT_RESERVE.has(type20.type);
  if ($g.has(type20.type)) {
    rotation.userData.optimizationBatch = "v1-next-ten";
  }
  const itemWidth = type20.width;
  const itemDepth = type20.depth;
  const itemHeight = type20.height;
  const glass = resolvedThemeColors();
  const furnitureItems = glass.furniture;
  const computedValue = glass.appliance ?? furnitureItems;
  const color5 = glass.furnitureSoft;
  const color6 = glass.furnitureLight;
  const color7 = glass.furnitureDark;
  if (lightItemTypes2.has(type20.type)) {
    buildWallCornerCaps(rotation, type20, optionalValue);
    applySelectionHighlight(rotation, type20);
  } else if (type20.type === "planlabel") {
    rotation.add(markAsLightSourcePreview(type20));
  } else if (type20.offlineModelExport !== true && ALL_ITEM_MODELS[type20.type] && type20.type !== "smallcar" && type20.type !== "sofa") {
    if (!attachExternalItemModel(rotation, type20)) {
      addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, RESERVED_TEXTURE_UNITS.has(type20.type) ? computedValue : furnitureItems, {
        rounded: false,
        roughness: 0.6,
        metalness: 0.1
      });
    }
  } else if (type20.type === "smallcar") {
    if (!attachExternalItemModel(rotation, type20)) {
      addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.38, itemDepth * 0.9, 0, itemHeight * 0.28, 0, furnitureItems, {
        roughness: 0.46,
        metalness: 0.18
      });
      addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.42, itemDepth * 0.48, 0, itemHeight * 0.62, -itemDepth * 0.03, color5, {
        roughness: 0.38,
        metalness: 0.12
      });
      for (const localValue of [-0.48, 0.48]) {
        for (const localValue of [-0.3, 0.3]) {
          addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.22, itemDepth * 0.17, localValue * itemWidth, itemHeight * 0.17, localValue * itemDepth, color7, {
            rounded: false,
            roughness: 0.82
          });
        }
      }
    }
    addSmallCarMeshes(rotation, type20, itemWidth, itemDepth, itemHeight);
  } else if (type20.type === "curtain") {
    const conditionalValue = ["left", "right", "split"].includes(type20.curtainPosition) ? type20.curtainPosition : "split";
    const lengthValue = rotation.children.length;
    if (isStageEmbed) {
      rotation.userData.curtainRigRoot = true;
      rotation.userData.curtainRigBasis = [itemWidth, itemHeight, itemDepth];
    }
    const localValue = Math.min(Math.max(itemDepth * 0.09, 0.012), 0.028);
    const computedValue2 = itemHeight - localValue * 1.8;
    const computedValue3 = computedValue2 - localValue * 1.8;
    const localValue2 = Math.max(itemHeight * 0.025, 0.025);
    const localValue3 = Math.max(computedValue3 - localValue2, itemHeight * 0.72);
    addSoftBoxMesh(rotation, localValue, localValue, itemWidth * 1.06, 0, computedValue2, 0, color7, {
      segments: 18,
      rotationZ: Math.PI / 2,
      metalness: 0.68,
      roughness: 0.22
    });
    for (const localValue4 of [-itemWidth * 0.52, itemWidth * 0.52]) {
      addSoftBoxMesh(rotation, localValue * 1.45, localValue * 1.45, localValue * 0.9, localValue4, computedValue2, 0, color6, {
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
        addBoxMesh(rotation, foldWidth * 1.24, localValue3, itemDepth * 0.62, foldCenterX, localValue2 + localValue3 * 0.5, foldOffsetZ, color6, {
          radius: Math.min(foldWidth * 0.34, 0.035),
          roughness: 0.94,
          metalness: 0
        });
      }
      addBoxMesh(rotation, argSecondary * 1.03, Math.max(itemHeight * 0.018, 0.025), itemDepth * 0.74, argPrimary + argSecondary * 0.5, localValue2 + itemHeight * 0.015, 0, color7, {
        radius: 0.01,
        roughness: 0.72,
        metalness: 0.02
      });
      addBoxMesh(rotation, argSecondary * 1.06, Math.max(itemHeight * 0.025, 0.035), itemDepth * 0.82, argPrimary + argSecondary * 0.5, localValue2 + localValue3 * 0.52, 0, color6, {
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
      rotation.children.slice(lengthValue).forEach((userData3, argSecondary) => {
        userData3.userData.curtainPart = argSecondary === 0 ? "rod" : argSecondary < 3 ? "cap" : (argSecondary - 3) % 9 < 7 ? "cloth" : "band";
      });
    }
  } else if (Vl.has(type20.type)) {
    const depthStep = itemDepth / 10;
    for (let zeroValue = 0; zeroValue < 10; zeroValue += 1) {
      const layerHeight = itemHeight * (zeroValue + 1) / 10;
      const layerZ = -itemDepth * 0.5 + depthStep * (zeroValue + 0.5);
      addBoxMesh(rotation, itemWidth, layerHeight, depthStep * 1.015, 0, layerHeight * 0.5, layerZ, zeroValue % 2 ? furnitureItems : color5, {
        rounded: false,
        roughness: 0.82
      });
      addBoxMesh(rotation, itemWidth * 1.01, 0.018, depthStep * 0.94, 0, layerHeight + 0.009, layerZ, color6, {
        rounded: false,
        castShadow: false,
        roughness: 0.72
      });
    }
  } else if (type20.type === "sofa") {
    const computedValue2 = itemHeight * 0.14;
    const helperFn = argPrimary => argPrimary - computedValue2 + -0.008;
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.28, itemDepth * 0.72, 0, helperFn(itemHeight * 0.28), itemDepth * 0.06, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.55, itemDepth * 0.18, 0, helperFn(itemHeight * 0.56), -itemDepth * 0.35, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, -itemWidth * 0.46, helperFn(itemHeight * 0.39), itemDepth * 0.03, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, itemWidth * 0.46, helperFn(itemHeight * 0.39), itemDepth * 0.03, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, -itemWidth * 0.22, helperFn(itemHeight * 0.47), itemDepth * 0.07, color5);
    addBoxMesh(rotation, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, itemWidth * 0.22, helperFn(itemHeight * 0.47), itemDepth * 0.07, color5);
  } else if (type20.type === "bed") {
    addBoxMesh(rotation, itemWidth * 0.996, itemHeight * 0.3, itemDepth * 0.996, 0, itemHeight * 0.15, 0, color7);
    addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.32, itemDepth * 0.92, 0, itemHeight * 0.43, itemDepth * 0.03, color5);
    addBoxMesh(rotation, itemWidth, itemHeight * 0.95, itemDepth * 0.09, 0, itemHeight * 0.48, -itemDepth * 0.455, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, -itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, color6);
    addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, color6);
  } else if (type20.type === "nightstand") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.78, itemDepth, 0, itemHeight * 0.49, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 1.04, itemHeight * 0.07, itemDepth * 1.05, 0, itemHeight * 0.91, 0, color5, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.63, itemDepth * 0.01, color7, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.38, itemDepth * 0.01, color7, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.22, 0.022, 0.032, 0, itemHeight * 0.5, itemDepth * 0.52, color6, {
      metalness: 0.5
    });
    for (const localValue of [-0.38, 0.38]) {
      for (const localValue of [-0.35, 0.35]) {
        addBoxMesh(rotation, 0.035, itemHeight * 0.2, 0.035, itemWidth * localValue, itemHeight * 0.1, itemDepth * localValue, color7, {
          metalness: 0.18
        });
      }
    }
  } else if (type20.type === "table") {
    const computedValue2 = itemWidth * 0.64;
    const computedValue3 = itemDepth * 0.48;
    addBoxMesh(rotation, computedValue2, itemHeight * 0.1, computedValue3, 0, itemHeight * 0.93, 0, furnitureItems);
    for (const localValue of [-0.43, 0.43]) {
      for (const localValue of [-0.38, 0.38]) {
        addBoxMesh(rotation, 0.07, itemHeight * 0.9, 0.07, computedValue2 * localValue, itemHeight * 0.45, computedValue3 * localValue, color7);
      }
    }
    const localValue2 = Math.min(itemWidth * 0.2, 0.5);
    const localValue3 = Math.min(itemDepth * 0.27, 0.5);
    const computedValue4 = itemHeight * 1.18;
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, -itemWidth * 0.37, 0, Math.PI / 2, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, itemWidth * 0.37, 0, -Math.PI / 2, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, 0, -itemDepth * 0.35, 0, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, 0, itemDepth * 0.35, Math.PI, color5, color7);
  } else if (roundTableTypes.has(type20.type)) {
    const computedValue2 = Math.min(itemWidth, itemDepth) * 0.32;
    const localValue = Math.max(itemHeight * 0.07, 0.045);
    const computedValue3 = itemHeight * 0.92;
    addSoftBoxMesh(rotation, computedValue2, computedValue2, localValue, 0, computedValue3, 0, color6, {
      segments: 48,
      roughness: 0.5,
      metalness: 0.08
    });
    addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.22, Math.min(itemWidth, itemDepth) * 0.3, itemHeight * 0.68, 0, itemHeight * 0.43, 0, furnitureItems, {
      segments: 36,
      roughness: 0.55,
      metalness: 0.06
    });
    addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.34, Math.min(itemWidth, itemDepth) * 0.34, itemHeight * 0.07, 0, itemHeight * 0.045, 0, color7, {
      segments: 40,
      roughness: 0.42,
      metalness: 0.12
    });
    if (hasRoundTableTurntable(type20)) {
      addSoftBoxMesh(rotation, computedValue2 * 0.58, computedValue2 * 0.58, Math.max(itemHeight * 0.035, 0.025), 0, computedValue3 + localValue * 0.58, 0, color5, {
        segments: 48,
        roughness: 0.48,
        metalness: 0.08
      });
      addSoftBoxMesh(rotation, computedValue2 * 0.44, computedValue2 * 0.44, 0.018, 0, computedValue3 + localValue * 0.58 + 0.036, 0, color7, {
        segments: 48,
        roughness: 0.32,
        metalness: 0.12
      });
    }
    const localValue2 = Math.min(itemWidth * 0.17, 0.42);
    const localValue3 = Math.min(itemDepth * 0.19, 0.44);
    const computedValue4 = itemHeight * 1.15;
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, -itemWidth * 0.38, 0, Math.PI / 2, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, itemWidth * 0.38, 0, -Math.PI / 2, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, 0, -itemDepth * 0.38, 0, color5, color7);
    buildTelevisionMesh(rotation, localValue2, localValue3, computedValue4, 0, itemDepth * 0.38, Math.PI, color5, color7);
  } else if (type20.type === "bar") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.12, itemDepth, 0, itemHeight * 0.94, 0, color5, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.78, itemDepth * 0.46, 0, itemHeight * 0.45, -itemDepth * 0.18, furnitureItems, {
      roughness: 0.65
    });
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.48, 0.035, 0, itemHeight * 0.42, itemDepth * 0.28, color7, {
      rounded: false,
      roughness: 0.48
    });
    for (const localValue of [-0.3, 0, 0.3]) {
      addSoftBoxMesh(rotation, itemDepth * 0.14, itemDepth * 0.14, 0.045, itemWidth * localValue, itemHeight * 0.66, itemDepth * 0.52, color5, {
        segments: 28,
        roughness: 0.52
      });
      addSoftBoxMesh(rotation, 0.025, 0.025, itemHeight * 0.62, itemWidth * localValue, itemHeight * 0.34, itemDepth * 0.52, color7, {
        segments: 18,
        metalness: 0.38,
        roughness: 0.28
      });
      addSoftBoxMesh(rotation, itemDepth * 0.1, itemDepth * 0.12, 0.035, itemWidth * localValue, 0.018, itemDepth * 0.52, color7, {
        segments: 24,
        metalness: 0.3,
        roughness: 0.34
      });
    }
  } else if (type20.type === "aquarium") {
    const localValue = Math.max(itemHeight * 0.52, 0.45);
    const localValue2 = localValue;
    const localValue3 = Math.max(itemHeight - localValue, 0.2);
    const localValue4 = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.025, 0.012), 0.028);
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
    addBoxMesh(rotation, itemWidth - localValue4 * 2, localValue3, localValue4, 0, localValue2 + localValue3 * 0.5, -itemDepth * 0.5 + localValue4 * 0.5, glass.glass, objectValue);
    addBoxMesh(rotation, itemWidth - localValue4 * 2, localValue3, localValue4, 0, localValue2 + localValue3 * 0.5, itemDepth * 0.5 - localValue4 * 0.5, glass.glass, objectValue);
    addBoxMesh(rotation, localValue4, localValue3, itemDepth - localValue4 * 2, -itemWidth * 0.5 + localValue4 * 0.5, localValue2 + localValue3 * 0.5, 0, glass.glass, objectValue);
    addBoxMesh(rotation, localValue4, localValue3, itemDepth - localValue4 * 2, itemWidth * 0.5 - localValue4 * 0.5, localValue2 + localValue3 * 0.5, 0, glass.glass, objectValue);
  } else if (type20.type === "coffeetable") {
    const localValue = Math.min(itemWidth * 0.34, itemDepth * 0.42);
    const localValue2 = Math.min(itemWidth * 0.23, itemDepth * 0.29);
    const computedValue2 = -itemWidth * 0.16;
    const computedValue3 = itemDepth * 0.08;
    const computedValue4 = itemWidth * 0.24;
    const computedValue5 = -itemDepth * 0.2;
    const computedValue6 = itemHeight * 0.58;
    const computedValue7 = itemHeight * 0.76;
    const computedValue8 = itemHeight * 0.68;
    const computedValue9 = itemHeight * 0.9;
    addSoftBoxMesh(rotation, localValue * 0.3, localValue * 0.5, computedValue6, computedValue2, computedValue6 * 0.5, computedValue3, furnitureItems, {
      segments: 40,
      roughness: 0.82
    });
    const computedValue10 = itemHeight * 0.07;
    const computedValue11 = itemHeight * 0.055;
    const computedValue12 = computedValue6 + computedValue10 * 0.5 + 0.001;
    const computedValue13 = computedValue12 + (computedValue10 + computedValue11) * 0.5 + 0.001;
    addSoftBoxMesh(rotation, localValue * 1.02, localValue * 1.02, computedValue10, computedValue2, computedValue12, computedValue3, color7, {
      segments: 48,
      roughness: 0.72
    });
    addSoftBoxMesh(rotation, localValue, localValue, computedValue11, computedValue2, computedValue13, computedValue3, color6, {
      segments: 48,
      roughness: 0.9
    });
    addSoftBoxMesh(rotation, localValue2 * 0.32, localValue2 * 0.52, computedValue7, computedValue4, computedValue7 * 0.5, computedValue5, color5, {
      segments: 40,
      roughness: 0.82
    });
    const computedValue14 = itemHeight * 0.07;
    const computedValue15 = itemHeight * 0.055;
    const computedValue16 = computedValue7 + computedValue14 * 0.5 + 0.001;
    const computedValue17 = computedValue16 + (computedValue14 + computedValue15) * 0.5 + 0.001;
    addSoftBoxMesh(rotation, localValue2 * 1.02, localValue2 * 1.02, computedValue14, computedValue4, computedValue16, computedValue5, color7, {
      segments: 48,
      roughness: 0.72
    });
    addSoftBoxMesh(rotation, localValue2, localValue2, computedValue15, computedValue4, computedValue17, computedValue5, color6, {
      segments: 48,
      roughness: 0.9
    });
  } else if (type20.type === "squarecoffeetable") {
    const localValue = Math.max(itemHeight * 0.22, 0.085);
    const localValue2 = Math.max(itemHeight * 0.16, 0.065);
    const computedValue2 = localValue + 0.012;
    const localValue3 = Math.max(itemHeight - computedValue2 - localValue2, 0.16);
    const localValue4 = Math.max(itemWidth * 0.075, 0.045);
    const localValue5 = Math.max(itemDepth * 0.035, 0.018);
    const computedValue3 = localValue3 * 0.72;
    const computedValue4 = computedValue2 + localValue3 * 0.48;
    const computedValue5 = itemWidth * 0.27;
    const computedValue6 = itemWidth * 0.34;
    const localValue6 = furnitureItems;
    const localValue7 = color5;
    addBoxMesh(rotation, itemWidth * 0.98, localValue2, itemDepth * 1.03, 0, computedValue2 + localValue3 + localValue2 * 0.5, 0, localValue7, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.5,
      metalness: 0.02
    });
    addBoxMesh(rotation, localValue4, localValue3, itemDepth * 0.92, -itemWidth * 0.5 + localValue4 * 0.5, computedValue2 + localValue3 * 0.5, 0, localValue6, {
      rounded: false,
      roughness: 0.6
    });
    addBoxMesh(rotation, localValue4, localValue3, itemDepth * 0.92, itemWidth * 0.5 - localValue4 * 0.5, computedValue2 + localValue3 * 0.5, 0, localValue6, {
      rounded: false,
      roughness: 0.6
    });
    addBoxMesh(rotation, itemWidth * 0.86, localValue3 * 0.9, 0.035, 0, computedValue2 + localValue3 * 0.52, -itemDepth * 0.45, localValue6, {
      rounded: false,
      roughness: 0.75
    });
    addBoxMesh(rotation, itemWidth * 0.86, localValue3 * 0.1, itemDepth * 0.9, 0, computedValue2 + localValue3 * 0.08, 0, localValue6, {
      rounded: false,
      roughness: 0.58
    });
    for (const localValue8 of [-computedValue6, 0, computedValue6]) {
      addBoxMesh(rotation, computedValue5, computedValue3, localValue5, localValue8, computedValue4, itemDepth * 0.48, localValue7, {
        radius: Math.min(itemWidth, itemDepth) * 0.025,
        roughness: 0.52
      });
      const conditionalValue = localValue8 === 0 ? 0 : localValue8 + (localValue8 < 0 ? computedValue5 * 0.3 : -computedValue5 * 0.3);
      addBoxMesh(rotation, 0.022, computedValue3 * 0.2, 0.025, conditionalValue, computedValue4, itemDepth * 0.505, color7, {
        radius: 0.009,
        metalness: 0.22,
        roughness: 0.3
      });
    }
    const localValue9 = Math.max(Math.min(itemWidth, itemDepth) * 0.055, 0.035);
    for (const localValue8 of [-itemWidth * 0.4, itemWidth * 0.4]) {
      for (const localValue of [-itemDepth * 0.36, itemDepth * 0.36]) {
        const rotation2 = addBoxMesh(rotation, localValue9, localValue, localValue9, localValue8, localValue * 0.5, localValue, color7, {
          radius: localValue9 * 0.22,
          roughness: 0.55,
          metalness: 0.02
        });
        rotation2.rotation.z = (localValue8 < 0 ? -1 : 1) * 0.09;
        rotation2.rotation.x = (localValue < 0 ? -1 : 1) * 0.06;
      }
    }
  } else if (type20.type === "chair") {
    buildTelevisionMesh(rotation, itemWidth, itemDepth, itemHeight, 0, 0, 0, furnitureItems, color7);
  } else if (type20.type === "sideboard") {
    const localValue = Math.max(itemHeight, 1.8);
    const computedValue2 = localValue * 0.39;
    const computedValue3 = localValue * 0.22;
    const computedValue4 = computedValue2 + computedValue3;
    const computedValue5 = localValue - computedValue4;
    const localValue2 = color5;
    const computedValue6 = itemWidth * 0.31;
    const computedValue7 = computedValue2 * 0.88;
    const computedValue8 = computedValue5 * 0.86;
    addBoxMesh(rotation, itemWidth, computedValue2, itemDepth, 0, computedValue2 * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth, 0.045, itemDepth, 0, computedValue2, 0, color5, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth, computedValue3, 0.045, 0, computedValue2 + computedValue3 * 0.5, -itemDepth * 0.46, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, itemWidth, computedValue5, itemDepth, 0, computedValue4 + computedValue5 * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue3 of [-0.33, 0, 0.33]) {
      addBoxMesh(rotation, computedValue6, computedValue7, 0.026, itemWidth * localValue3, computedValue2 * 0.48, itemDepth * 0.515, localValue2, {
        rounded: false,
        roughness: 0.45
      });
      addBoxMesh(rotation, computedValue6, computedValue8, 0.026, itemWidth * localValue3, computedValue4 + computedValue5 * 0.5, itemDepth * 0.515, localValue2, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type20.type === "shoecabinet") {
    const localValue = Math.max(itemHeight, 1.9);
    const localValue2 = color5;
    const localValue3 = color5;
    const computedValue2 = itemWidth * 0.5;
    const computedValue3 = itemWidth * 0.5;
    const computedValue4 = -itemWidth * 0.25;
    const computedValue5 = itemWidth * 0.25;
    const computedValue6 = localValue * 0.22;
    const computedValue7 = localValue * 0.43;
    const computedValue8 = localValue * 0.21;
    const computedValue9 = localValue * 0.37;
    addBoxMesh(rotation, itemWidth * 0.98, localValue * 0.93, 0.045, 0, localValue * 0.48, -itemDepth * 0.47, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, computedValue2, computedValue6 * 0.56, itemDepth * 0.92, computedValue4, computedValue6 * 0.35, 0, furnitureItems, {
      roughness: 0.56
    });
    addBoxMesh(rotation, computedValue2 * 1.02, 0.055, itemDepth * 1.04, computedValue4, computedValue6 * 0.67, 0, localValue3, {
      roughness: 0.5
    });
    addBoxMesh(rotation, computedValue3, computedValue7, itemDepth, computedValue5, computedValue7 * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue4 of [-0.245, 0.245]) {
      addBoxMesh(rotation, computedValue3 * 0.47, computedValue7 * 0.84, 0.026, computedValue5 + computedValue3 * localValue4, computedValue7 * 0.48, itemDepth * 0.515, localValue2, {
        rounded: false,
        roughness: 0.45
      });
    }
    const computedValue10 = localValue - computedValue8 - 0.045;
    addBoxMesh(rotation, computedValue2, computedValue8, itemDepth, computedValue4, computedValue10 + computedValue8 * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue4 of [-0.245, 0.245]) {
      addBoxMesh(rotation, computedValue2 * 0.47, computedValue8 * 0.86, 0.026, computedValue4 + computedValue2 * localValue4, computedValue10 + computedValue8 * 0.5, itemDepth * 0.515, localValue2, {
        rounded: false,
        roughness: 0.45
      });
    }
    const computedValue11 = localValue - computedValue9 - 0.045;
    addBoxMesh(rotation, computedValue3, computedValue9, itemDepth, computedValue5, computedValue11 + computedValue9 * 0.5, 0, furnitureItems, {
      roughness: 0.58
    });
    for (const localValue4 of [-0.245, 0.245]) {
      addBoxMesh(rotation, computedValue3 * 0.47, computedValue9 * 0.9, 0.026, computedValue5 + computedValue3 * localValue4, computedValue11 + computedValue9 * 0.5, itemDepth * 0.515, localValue2, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type20.type === "cabinet") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, furnitureItems);
    addBoxMesh(rotation, 0.018, itemHeight * 0.9, itemDepth * 1.01, 0, itemHeight * 0.52, itemDepth * 0.01, color7);
    addBoxMesh(rotation, 0.025, 0.16, 0.035, -0.08, itemHeight * 0.55, itemDepth * 0.515, color6, {
      metalness: 0.55
    });
    addBoxMesh(rotation, 0.025, 0.16, 0.035, 0.08, itemHeight * 0.55, itemDepth * 0.515, color6, {
      metalness: 0.55
    });
  } else if (type20.type === "glasscabinet") {
    const localValue = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.1, 0.032), 0.058);
    const localValue2 = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
    const localValue3 = Math.min(Math.max(itemWidth * 0.014, 0.016), 0.03);
    const localValue4 = Math.max(itemWidth - localValue * 2, itemWidth * 0.7);
    const numericValue = 0.13;
    const numericValue2 = 0.3;
    const numericValue3 = 4;
    const computedValue2 = itemHeight * numericValue;
    const computedValue3 = itemHeight * numericValue2;
    const computedValue4 = itemHeight - localValue - computedValue3;
    const halfValue = computedValue4 / numericValue3;
    const length2 = [0.56, 0.24, 0.2];
    const slicedValue = [0, length2[0], length2[0] + length2[1]];
    const localValue5 = slicedValue.slice(1);
    const localValue6 = Math.max(itemWidth * 0.005, 0.005);
    const computedValue5 = itemDepth * 0.5 + 0.012;
    const objectValue = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015
    };
    const objectValue2 = {
      rounded: false,
      roughness: 0.48,
      metalness: 0.035
    };
    const objectValue3 = {
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
    const objectValue4 = {
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
    addBoxMesh(rotation, localValue4, itemHeight - localValue * 2, localValue2, 0, itemHeight * 0.5, -itemDepth * 0.5 + localValue2 * 0.5, furnitureItems, {
      ...objectValue,
      roughness: 0.76
    });
    addBoxMesh(rotation, itemWidth, localValue, itemDepth, 0, itemHeight - localValue * 0.5, 0, furnitureItems, objectValue);
    for (let zeroValue = 0; zeroValue < numericValue3; zeroValue += 1) {
      addBoxMesh(rotation, localValue4, localValue * 0.72, itemDepth * 0.9, 0, computedValue3 + halfValue * zeroValue, -itemDepth * 0.025, color5, objectValue);
    }
    addBoxMesh(rotation, localValue4, localValue * 0.72, itemDepth * 0.9, 0, computedValue2, -itemDepth * 0.025, color5, objectValue);
    for (const localValue7 of localValue5) {
      const computedValue = -localValue4 * 0.5 + localValue4 * localValue7;
      addBoxMesh(rotation, localValue * 0.72, itemHeight - localValue, itemDepth * 0.9, computedValue, (itemHeight - localValue) * 0.5, -itemDepth * 0.025, furnitureItems, objectValue);
    }
    const computedValue6 = computedValue3 - computedValue2 - localValue * 0.9;
    const length3 = [localValue4 * length2[0], localValue4 * (1 - length2[0])];
    let computedValue7 = -localValue4 * 0.5;
    for (let zeroValue = 0; zeroValue < length3.length; zeroValue += 1) {
      const computedValue = length3[zeroValue] - localValue6;
      const computedValue2 = computedValue7 + length3[zeroValue] * 0.5;
      addBoxMesh(rotation, computedValue, computedValue6, 0.03, computedValue2, computedValue2 + (computedValue3 - computedValue2) * 0.5, computedValue5, zeroValue ? color5 : furnitureItems, {
        ...objectValue2,
        roughness: 0.56
      });
      computedValue7 += length3[zeroValue];
    }
    for (let zeroValue = 0; zeroValue < length2.length; zeroValue += 1) {
      const computedValue = -localValue4 * 0.5 + localValue4 * slicedValue[zeroValue];
      const computedValue2 = localValue4 * length2[zeroValue];
      const computedValue3 = computedValue + computedValue2 * 0.5;
      const localValue = Math.max(computedValue2 - localValue3 * 1.65, computedValue2 * 0.76);
      const localValue2 = Math.max(computedValue4 - localValue3 * 1.55, computedValue4 * 0.86);
      addBoxMesh(rotation, localValue, localValue2, 0.018, computedValue3, computedValue3 + computedValue4 * 0.5, computedValue5, glass.glass, objectValue3);
      addBoxMesh(rotation, localValue3, computedValue4, 0.032, computedValue + localValue3 * 0.5, computedValue3 + computedValue4 * 0.5, computedValue5 + 0.009, furnitureItems, objectValue2);
      if (zeroValue === length2.length - 1) {
        addBoxMesh(rotation, localValue3, computedValue4, 0.032, computedValue + computedValue2 - localValue3 * 0.5, computedValue3 + computedValue4 * 0.5, computedValue5 + 0.009, furnitureItems, objectValue2);
      }
      const localValue3 = Math.max(localValue * 0.025, 0.007);
      addBoxMesh(rotation, localValue3, localValue2 * 0.88, 0.006, computedValue3 - localValue * 0.37, computedValue3 + computedValue4 * 0.52, computedValue5 + 0.014, 14282227, objectValue4);
      addBoxMesh(rotation, localValue * 0.34, Math.max(localValue3 * 0.11, 0.004), 0.006, computedValue3 - localValue * 0.18, computedValue3 + computedValue4 * 0.88, computedValue5 + 0.014, 15267578, objectValue4);
    }
    addBoxMesh(rotation, localValue4, localValue3, 0.032, 0, computedValue3 + localValue3 * 0.5, computedValue5 + 0.009, furnitureItems, objectValue2);
    addBoxMesh(rotation, localValue4, localValue3, 0.032, 0, itemHeight - localValue - localValue3 * 0.5, computedValue5 + 0.009, furnitureItems, objectValue2);
    const length4 = [14736852, 13025203, 10327434, 7301474, color5, color6];
    const helperFn = (argPrimary, argSecondary, numericParam = 5, numericParam2 = 0) => {
      const computedValue = localValue4 * length2[argPrimary];
      const computedValue8 = -localValue4 * 0.5 + localValue4 * slicedValue[argPrimary];
      const computedValue9 = computedValue3 + halfValue * argSecondary + localValue * 0.42;
      const localValue7 = Math.max(computedValue * 0.022, 0.004);
      const halfValue2 = (computedValue * 0.72 - localValue7 * (numericParam - 1)) / numericParam;
      let computedValue10 = computedValue8 + computedValue * 0.13;
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        const computedValue = halfValue2 * [0.8, 1.05, 0.9, 0.72, 0.96][(zeroValue + numericParam2) % 5];
        const computedValue2 = halfValue * [0.48, 0.58, 0.52, 0.64, 0.55][(zeroValue * 2 + numericParam2) % 5];
        addBoxMesh(rotation, computedValue, computedValue2, itemDepth * 0.42, computedValue10 + computedValue * 0.5, computedValue9 + computedValue2 * 0.5, itemDepth * 0.12, length4[(zeroValue + numericParam2) % length4.length], {
          radius: Math.min(computedValue * 0.12, 0.009),
          roughness: 0.78,
          metalness: 0
        });
        computedValue10 += computedValue + localValue7;
      }
    };
    const helperFn2 = (argPrimary, argSecondary, numericParam = 3, numericParam2 = 0) => {
      const computedValue = localValue4 * length2[argPrimary];
      const computedValue8 = -localValue4 * 0.5 + localValue4 * slicedValue[argPrimary] + computedValue * 0.5;
      const computedValue9 = computedValue3 + halfValue * argSecondary + localValue * 0.42;
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        addBoxMesh(rotation, computedValue * 0.56, localValue * 0.48, itemDepth * 0.4, computedValue8, computedValue9 + localValue * (0.3 + zeroValue * 0.52), itemDepth * 0.12, length4[(zeroValue + numericParam2) % length4.length], {
          radius: 0.006,
          roughness: 0.78,
          metalness: 0
        });
      }
    };
    helperFn(0, 1, 7, 0);
    helperFn(2, 2, 4, 2);
    helperFn2(0, 0, 3, 2);
    helperFn2(1, 2, 3, 4);
    for (const [bayIndex, shelfIndex, softScale, softColor] of [[1, 1, 0.16, 12169895], [0, 2, 0.075, 9406334], [2, 3, 0.14, 13749184]]) {
      const bayWidth = localValue4 * length2[bayIndex];
      const bayCenterX = -localValue4 * 0.5 + localValue4 * slicedValue[bayIndex] + bayWidth * 0.5;
      const softBaseY = computedValue3 + halfValue * shelfIndex + localValue * 0.42;
      addSoftBoxMesh(rotation, bayWidth * softScale * 0.72, bayWidth * softScale, halfValue * 0.46, bayCenterX, softBaseY + halfValue * 0.23, itemDepth * 0.12, softColor, {
        segments: 24,
        roughness: 0.68
      });
    }
  } else if (type20.type === "bookcase") {
    const clampedCornerRadius = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.11, 0.032), 0.062);
    const localValue = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
    const localValue2 = Math.max(itemWidth - clampedCornerRadius * 2, itemWidth * 0.72);
    const numericValue = 0.255;
    const arrayValue = [numericValue, 0.47, 0.59, 0.79];
    const computedValue2 = itemHeight - clampedCornerRadius * 0.5;
    const computedValue3 = localValue2 * 0.27;
    const computedValue4 = itemWidth * 0.5 - clampedCornerRadius * 1.5 - computedValue3;
    const computedValue5 = localValue2 - computedValue3 - clampedCornerRadius;
    const computedValue6 = -localValue2 * 0.5 + computedValue5 * 0.5;
    const computedValue7 = localValue2 * 0.5 - computedValue3 * 0.5;
    const objectValue = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015
    };
    const computedValue8 = itemDepth * 0.5 + 0.013;
    addBoxMesh(rotation, clampedCornerRadius, itemHeight, itemDepth, -itemWidth * 0.5 + clampedCornerRadius * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, clampedCornerRadius, itemHeight, itemDepth, itemWidth * 0.5 - clampedCornerRadius * 0.5, itemHeight * 0.5, 0, furnitureItems, objectValue);
    addBoxMesh(rotation, localValue2, itemHeight * 0.95, localValue, 0, itemHeight * 0.5, -itemDepth * 0.5 + localValue * 0.5, color7, {
      ...objectValue,
      roughness: 0.76
    });
    addBoxMesh(rotation, localValue2, itemHeight * numericValue - clampedCornerRadius * 0.5, itemDepth * 0.9, 0, itemHeight * numericValue * 0.5, -itemDepth * 0.025, color5, {
      ...objectValue,
      roughness: 0.66
    });
    for (const localValue3 of arrayValue) {
      addBoxMesh(rotation, localValue2, clampedCornerRadius, itemDepth, 0, itemHeight * localValue3, 0, color5, objectValue);
    }
    addBoxMesh(rotation, itemWidth, clampedCornerRadius, itemDepth, 0, computedValue2, 0, furnitureItems, objectValue);
    const computedValue9 = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
    const computedValue10 = itemHeight - clampedCornerRadius;
    addBoxMesh(rotation, clampedCornerRadius, computedValue10 - computedValue9, itemDepth, computedValue4, (computedValue10 + computedValue9) * 0.5, 0, furnitureItems, objectValue);
    const numericValue2 = 3;
    const computedValue11 = clampedCornerRadius * 0.72;
    const computedValue12 = itemHeight * numericValue - clampedCornerRadius * 0.5;
    const localValue4 = Math.max(computedValue12 - computedValue11, itemHeight * 0.16);
    const localValue5 = Math.max(itemWidth * 0.008, 0.008);
    const computedValue13 = -localValue2 * 0.18;
    const computedValue14 = computedValue13 + localValue2 * 0.5 - localValue5 * 0.5;
    const computedValue15 = localValue2 - computedValue14 - localValue5;
    const halfValue = (localValue4 - localValue5 * (numericValue2 - 1)) / numericValue2;
    for (let zeroValue = 0; zeroValue < numericValue2; zeroValue += 1) {
      const computedValue = computedValue11 + halfValue * 0.5 + zeroValue * (halfValue + localValue5);
      addBoxMesh(rotation, computedValue14, halfValue, 0.026, -localValue2 * 0.5 + computedValue14 * 0.5, computedValue, computedValue8, furnitureItems, {
        ...objectValue,
        roughness: 0.55
      });
      addBoxMesh(rotation, computedValue15, halfValue, 0.026, computedValue13 + localValue5 * 0.5 + computedValue15 * 0.5, computedValue, computedValue8, color5, {
        ...objectValue,
        roughness: 0.55
      });
    }
    const computedValue16 = itemHeight * (arrayValue[2] - arrayValue[1]) - clampedCornerRadius * 1.15;
    addBoxMesh(rotation, computedValue5 * 0.97, computedValue16, 0.028, computedValue6, itemHeight * (arrayValue[1] + arrayValue[2]) * 0.5, computedValue8, furnitureItems, {
      ...objectValue,
      roughness: 0.54
    });
    const length = [14276045, 12499117, 10459536, 7828334, color6, color5];
    const helperFn = ({
      startX: arg,
      maxWidth: argPrimary,
      shelfY: argPrimary2,
      availableHeight: argPrimary3,
      count: argPrimary4 = 6,
      seed: argPrimary5 = 0
    }) => {
      const localValue3 = Math.max(argPrimary * 0.018, 0.006);
      const localValue6 = Math.max((argPrimary - localValue3 * (argPrimary4 + 1)) / argPrimary4, 0.026);
      let computedValue = arg + localValue3;
      for (let zeroValue = 0; zeroValue < argPrimary4; zeroValue += 1) {
        const localValue = [0.72, 0.9, 0.78, 1.04, 0.82, 0.68][(zeroValue + argPrimary5) % 6];
        const computedValue = localValue6 * localValue;
        const localValue2 = [0.72, 0.88, 0.78, 0.94, 0.82, 0.68][(zeroValue * 2 + argPrimary5) % 6];
        const computedValue2 = argPrimary3 * localValue2;
        if (computedValue + computedValue > arg + argPrimary - localValue3) {
          break;
        }
        const rotation2 = addBoxMesh(rotation, computedValue, computedValue2, itemDepth * (0.47 + (zeroValue + argPrimary5) % 3 * 0.045), computedValue + computedValue * 0.5, argPrimary2 + computedValue2 * 0.5, itemDepth * 0.15, length[(zeroValue + argPrimary5) % length.length], {
          radius: Math.min(computedValue * 0.14, 0.012),
          roughness: 0.78,
          metalness: 0
        });
        if (zeroValue === argPrimary4 - 1 && argPrimary5 % 2 === 1) {
          rotation2.rotation.z = -0.07;
        }
        computedValue += computedValue + localValue3;
      }
    };
    const helperFn2 = (argPrimary, argSecondary, argTertiary, numericParam = 3, numericParam2 = 0) => {
      for (let zeroValue = 0; zeroValue < numericParam; zeroValue += 1) {
        addBoxMesh(rotation, argTertiary, clampedCornerRadius * 0.54, itemDepth * 0.48, argPrimary, argSecondary + clampedCornerRadius * (0.38 + zeroValue * 0.56), itemDepth * 0.15, length[(zeroValue + numericParam2) % length.length], {
          radius: 0.007,
          roughness: 0.78,
          metalness: 0
        });
      }
    };
    const shelfY = itemHeight * arrayValue[0] + clampedCornerRadius * 0.5;
    helperFn({
      startX: -localValue2 * 0.47,
      maxWidth: localValue2 * 0.29,
      shelfY,
      availableHeight: itemHeight * 0.15,
      count: 5,
      seed: 2
    });
    helperFn({
      startX: localValue2 * 0.04,
      maxWidth: localValue2 * 0.38,
      shelfY,
      availableHeight: itemHeight * 0.16,
      count: 7,
      seed: 4
    });
    const shelfY2 = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
    helperFn({
      startX: computedValue4 + clampedCornerRadius * 0.6,
      maxWidth: computedValue3 * 0.82,
      shelfY: shelfY2,
      availableHeight: itemHeight * 0.075,
      count: 4,
      seed: 1
    });
    const shelfY3 = itemHeight * arrayValue[2] + clampedCornerRadius * 0.5;
    helperFn({
      startX: -localValue2 * 0.47,
      maxWidth: computedValue5 * 0.42,
      shelfY: shelfY3,
      availableHeight: itemHeight * 0.14,
      count: 6,
      seed: 0
    });
    addBoxMesh(rotation, computedValue5 * 0.17, itemHeight * 0.12, 0.022, computedValue6 + computedValue5 * 0.27, shelfY3 + itemHeight * 0.065, itemDepth * 0.22, 11972517, {
      rounded: false,
      roughness: 0.5
    });
    addBoxMesh(rotation, computedValue5 * 0.125, itemHeight * 0.085, 0.026, computedValue6 + computedValue5 * 0.27, shelfY3 + itemHeight * 0.065, itemDepth * 0.235, 7762283, {
      rounded: false,
      roughness: 0.42
    });
    helperFn2(computedValue7, shelfY3, computedValue3 * 0.48, 3, 3);
    const computedValue17 = itemHeight * arrayValue[3] + clampedCornerRadius * 0.5;
    helperFn2(computedValue6 - computedValue5 * 0.22, computedValue17, computedValue5 * 0.24, 2, 1);
    addSoftBoxMesh(rotation, computedValue5 * 0.055, computedValue5 * 0.075, itemHeight * 0.12, computedValue6 - computedValue5 * 0.08, computedValue17 + itemHeight * 0.06, itemDepth * 0.12, 5196615, {
      segments: 22,
      roughness: 0.66
    });
    addSoftBoxMesh(rotation, computedValue5 * 0.045, computedValue5 * 0.064, itemHeight * 0.15, computedValue6 + computedValue5 * 0.08, computedValue17 + itemHeight * 0.075, itemDepth * 0.12, 6643802, {
      segments: 22,
      roughness: 0.66
    });
    helperFn2(computedValue7, computedValue17, computedValue3 * 0.5, 2, 4);
  } else if (type20.type === "shelf") {
    const localValue = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.07, 0.028), 0.052);
    const localValue2 = Math.min(Math.max(itemHeight * 0.022, 0.028), 0.052);
    const localValue3 = Math.max(itemDepth - localValue * 1.4, itemDepth * 0.78);
    const objectValue = {
      rounded: false,
      metalness: 0.62,
      roughness: 0.28
    };
    const objectValue2 = {
      rounded: false,
      metalness: 0.18,
      roughness: 0.48
    };
    for (const localValue4 of [-itemWidth * 0.5 + localValue * 0.5, itemWidth * 0.5 - localValue * 0.5]) {
      for (const localValue of [-itemDepth * 0.5 + localValue * 0.5, itemDepth * 0.5 - localValue * 0.5]) {
        addBoxMesh(rotation, localValue, itemHeight, localValue, localValue4, itemHeight * 0.5, localValue, furnitureItems, objectValue);
      }
    }
    for (const localValue4 of [0.04, 0.26, 0.49, 0.72, 0.96]) {
      addBoxMesh(rotation, itemWidth, localValue2, localValue3, 0, itemHeight * localValue4, 0, localValue4 === 0.96 ? color6 : color5, objectValue2);
      addBoxMesh(rotation, itemWidth, localValue * 0.65, localValue, 0, itemHeight * localValue4, -itemDepth * 0.5 + localValue * 0.5, furnitureItems, objectValue);
    }
    const localValue5 = Math.max(itemWidth - localValue * 2, localValue);
    const computedValue2 = itemHeight * 0.84;
    const localValue6 = Math.hypot(localValue5, computedValue2);
    for (const localValue4 of [-1, 1]) {
      const rotation2 = addBoxMesh(rotation, localValue * 0.48, localValue6, localValue * 0.42, 0, itemHeight * 0.5, -itemDepth * 0.5 + localValue * 0.18, furnitureItems, {
        ...objectValue,
        castShadow: false
      });
      rotation2.rotation.z = localValue4 * Math.atan2(localValue5, computedValue2);
    }
  } else if (type20.type === "pillar") {
    const localValue = Math.min(glass.wallOpacity * 1.75, 0.55);
    const localValue2 = createGlassPhysicalMaterial(glass.wall, localValue, {
      depthWrite: false,
      depthFunc: THREE.LessDepth
    });
    const localValue3 = createFloorStandardMaterial(glass.wall, localValue, {
      topColor: glass.wallTop ?? glass.wall
    });
    const position2 = new THREE.Mesh(new THREE.BoxGeometry(itemWidth, itemHeight, itemDepth), [localValue2, localValue2, localValue3, localValue2, localValue2, localValue2]);
    position2.position.y = itemHeight * 0.5;
    setWallGradientHeight(THREE, position2.geometry, "y", itemHeight * 0.5, 1, itemHeight);
    position2.castShadow = true;
    position2.receiveShadow = true;
    position2.renderOrder = 4;
    position2.userData.reflectionRole = "wall";
    position2.layers.set(HELPER_LAYER);
    rotation.add(position2);
  } else if (type20.type === "wallcabinet") {
    const computedValue2 = itemHeight * 0.28;
    const computedValue3 = itemHeight - computedValue2;
    const computedValue4 = 1.4 + computedValue2;
    addBoxMesh(rotation, itemWidth, computedValue3, itemDepth, 0, computedValue4 + computedValue3 * 0.5, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth, computedValue2, 0.045, 0, 1.4 + computedValue2 * 0.5, -itemDepth * 0.45, furnitureItems, {
      rounded: false,
      roughness: 0.62
    });
    addBoxMesh(rotation, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, 1.4, 0, color5, {
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, computedValue4, 0, color5, {
      roughness: 0.5
    });
    addBoxMesh(rotation, 0.045, computedValue2, itemDepth, -itemWidth * 0.49, 1.4 + computedValue2 * 0.5, 0, furnitureItems);
    addBoxMesh(rotation, 0.045, computedValue2, itemDepth, itemWidth * 0.49, 1.4 + computedValue2 * 0.5, 0, furnitureItems);
    const computedValue5 = itemWidth * 0.31;
    for (const localValue of [-0.33, 0, 0.33]) {
      addBoxMesh(rotation, computedValue5, computedValue3 * 0.9, 0.026, itemWidth * localValue, computedValue4 + computedValue3 * 0.5, itemDepth * 0.515, color5, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (["kitchenbase", "kitchensink", "kitchencooktop"].includes(type20.type)) {
    const computedValue2 = itemHeight * 0.1;
    const computedValue3 = itemHeight * 0.07;
    const computedValue4 = itemHeight - computedValue2 - computedValue3;
    const computedValue5 = computedValue2 + computedValue4 * 0.5;
    addBoxMesh(rotation, itemWidth * 0.96, computedValue2, itemDepth * 0.8, 0, computedValue2 * 0.5, -itemDepth * 0.06, color7, {
      rounded: false,
      roughness: 0.52
    });
    addBoxMesh(rotation, itemWidth, computedValue4, itemDepth, 0, computedValue5, 0, furnitureItems, {
      rounded: false,
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth * 1.02, computedValue3, itemDepth * 1.04, 0, itemHeight - computedValue3 * 0.5, 0, color6, {
      rounded: false,
      roughness: 0.42
    });
    const localValue = Math.max(2, Math.min(6, Math.round(itemWidth / 0.6)));
    const halfValue = itemWidth / localValue;
    for (let zeroValue = 0; zeroValue < localValue; zeroValue += 1) {
      const computedValue = -itemWidth * 0.5 + halfValue * (zeroValue + 0.5);
      addBoxMesh(rotation, halfValue * 0.92, computedValue4 * 0.9, 0.025, computedValue, computedValue5, itemDepth * 0.515, color5, {
        rounded: false,
        roughness: 0.46
      });
      addBoxMesh(rotation, halfValue * 0.28, 0.022, 0.03, computedValue, computedValue2 + computedValue4 * 0.83, itemDepth * 0.535, color7, {
        rounded: false,
        metalness: 0.28,
        roughness: 0.3
      });
    }
    if (type20.type === "kitchensink") {
      addBoxMesh(rotation, itemWidth * 0.42, 0.025, itemDepth * 0.52, 0, itemHeight + 0.008, 0, color7, {
        rounded: false,
        metalness: 0.42,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.34, 0.02, itemDepth * 0.4, 0, itemHeight + 0.022, 0, color5, {
        rounded: false,
        metalness: 0.18,
        roughness: 0.34
      });
      addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.22, itemWidth * 0.22, itemHeight + itemHeight * 0.11, -itemDepth * 0.17, color7, {
        segments: 20,
        metalness: 0.65,
        roughness: 0.2
      });
      addBoxMesh(rotation, itemWidth * 0.16, 0.035, 0.035, itemWidth * 0.14, itemHeight + itemHeight * 0.2, -itemDepth * 0.17, color7, {
        rounded: false,
        metalness: 0.65,
        roughness: 0.2
      });
    } else if (type20.type === "kitchencooktop") {
      addBoxMesh(rotation, itemWidth * 0.48, 0.025, itemDepth * 0.55, 0, itemHeight + 0.008, 0, color7, {
        rounded: false,
        metalness: 0.32,
        roughness: 0.25
      });
      for (const localValue of [-itemWidth * 0.13, itemWidth * 0.13]) {
        for (const localValue of [-itemDepth * 0.14, itemDepth * 0.14]) {
          addSoftBoxMesh(rotation, itemWidth * 0.06, itemWidth * 0.06, 0.018, localValue, itemHeight + 0.028, localValue, color5, {
            segments: 28,
            metalness: 0.42,
            roughness: 0.26
          });
          addSoftBoxMesh(rotation, itemWidth * 0.025, itemWidth * 0.025, 0.025, localValue, itemHeight + 0.045, localValue, color7, {
            segments: 24,
            metalness: 0.5,
            roughness: 0.22
          });
        }
      }
    }
  } else if (type20.type === "fridge") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, color6, {
      metalness: 0.18,
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.88, 0.018, itemDepth * 1.01, 0, itemHeight * 0.42, itemDepth * 0.01, color7, {
      metalness: 0.5
    });
    addBoxMesh(rotation, 0.025, itemHeight * 0.27, 0.035, itemWidth * 0.35, itemHeight * 0.65, itemDepth * 0.515, color7, {
      metalness: 0.7
    });
  } else if (type20.type === "storagewaterheater") {
    const localValue = Math.min(itemDepth * 0.43, itemHeight * 0.44);
    const computedValue2 = itemHeight * 0.52;
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.12, itemDepth * 0.22, 0, itemHeight * 0.1, -itemDepth * 0.36, color7, {
      rounded: false,
      metalness: 0.55,
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, localValue, localValue, itemWidth * 0.82, 0, computedValue2, 0, color6, {
      segments: 36,
      rotationZ: Math.PI / 2,
      metalness: 0.2,
      roughness: 0.42
    });
    for (const localValue2 of [-itemWidth * 0.43, itemWidth * 0.43]) {
      addSoftBoxMesh(rotation, localValue * 1.03, localValue * 1.03, 0.025, localValue2, computedValue2, 0, color5, {
        segments: 36,
        rotationZ: Math.PI / 2,
        metalness: 0.28,
        roughness: 0.34
      });
    }
    addBoxMesh(rotation, itemWidth * 0.31, itemHeight * 0.23, 0.026, 0, itemHeight * 0.51, itemDepth * 0.44, color7, {
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
    for (const localValue2 of [-itemWidth * 0.28, itemWidth * 0.28]) {
      addSoftBoxMesh(rotation, 0.022, 0.022, itemHeight * 0.16, localValue2, itemHeight * 0.08, itemDepth * 0.12, localValue2 < 0 ? 4885698 : 12868184, {
        segments: 18,
        metalness: 0.55,
        roughness: 0.24
      });
      addSoftBoxMesh(rotation, 0.04, 0.04, 0.028, localValue2, 0.015, itemDepth * 0.12, color7, {
        segments: 20,
        metalness: 0.45,
        roughness: 0.28
      });
    }
  } else if (type20.type === "gaswaterheater") {
    const computedValue2 = itemHeight * 0.82;
    addBoxMesh(rotation, itemWidth, computedValue2, itemDepth, 0, itemHeight * 0.47, 0, color6, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.86, computedValue2 * 0.42, 0.026, 0, itemHeight * 0.55, itemDepth * 0.515, color5, {
      rounded: false,
      roughness: 0.36
    });
    addBoxMesh(rotation, itemWidth * 0.44, computedValue2 * 0.18, 0.018, 0, itemHeight * 0.67, itemDepth * 0.54, color7, {
      rounded: false,
      metalness: 0.14,
      roughness: 0.22
    });
    for (let zeroValue = 0; zeroValue < 5; zeroValue += 1) {
      addBoxMesh(rotation, itemWidth * 0.62, 0.012, 0.02, 0, itemHeight * (0.24 + zeroValue * 0.07), itemDepth * 0.525, color7, {
        rounded: false,
        roughness: 0.3
      });
    }
    addSoftBoxMesh(rotation, itemDepth * 0.17, itemDepth * 0.17, itemHeight * 0.18, 0, itemHeight * 0.91, 0, color7, {
      segments: 24,
      metalness: 0.58,
      roughness: 0.24
    });
    addSoftBoxMesh(rotation, itemDepth * 0.22, itemDepth * 0.22, 0.035, 0, itemHeight * 0.84, 0, color5, {
      segments: 24,
      metalness: 0.5,
      roughness: 0.25
    });
    for (const [localValue, localValue2] of [[-itemWidth * 0.28, 4885698], [0, 9410205], [itemWidth * 0.28, 12868184]]) {
      addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.18, localValue, itemHeight * 0.09, itemDepth * 0.12, localValue2, {
        segments: 18,
        metalness: 0.62,
        roughness: 0.22
      });
      addSoftBoxMesh(rotation, 0.034, 0.034, 0.025, localValue, 0.014, itemDepth * 0.12, color7, {
        segments: 18,
        metalness: 0.5,
        roughness: 0.25
      });
    }
  } else if (type20.type === "pipelinewaterpurifier") {
    const computedValue2 = itemHeight * 0.9;
    addBoxMesh(rotation, itemWidth, computedValue2, itemDepth, 0, computedValue2 * 0.5, 0, color6, {
      rounded: false,
      metalness: 0.04,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.92, computedValue2 * 0.27, 0.028, 0, itemHeight * 0.76, itemDepth * 0.515, color7, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.34, computedValue2 * 0.045, 0.014, -itemWidth * 0.08, itemHeight * 0.79, itemDepth * 0.54, 10470608, {
      rounded: false,
      emissive: 10470608,
      emissiveIntensity: 0.2,
      roughness: 0.22
    });
    for (const localValue of [-0.26, 0, 0.26]) {
      addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.055, Math.min(itemWidth, itemDepth) * 0.055, 0.018, itemWidth * localValue, itemHeight * 0.66, itemDepth * 0.535, color5, {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.22,
        roughness: 0.28
      });
    }
    for (const localValue of [-itemWidth * 0.2, itemWidth * 0.2]) {
      addSoftBoxMesh(rotation, 0.014, 0.014, itemHeight * 0.12, localValue, itemHeight * 0.49, itemDepth * 0.48, color7, {
        segments: 18,
        metalness: 0.46,
        roughness: 0.22
      });
      addSoftBoxMesh(rotation, 0.024, 0.018, 0.035, localValue, itemHeight * 0.425, itemDepth * 0.52, color7, {
        segments: 18,
        rotationX: Math.PI / 2,
        metalness: 0.46,
        roughness: 0.22
      });
    }
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.045, itemDepth * 0.52, 0, itemHeight * 0.11, itemDepth * 0.16, color7, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.42, 0.028, itemDepth * 0.28, 0, itemHeight * 0.16, itemDepth * 0.28, color5, {
      rounded: false,
      roughness: 0.34
    });
  } else if (type20.type === "tea_bar_machine") {
    const computedValue2 = itemHeight * 0.67;
    const computedValue3 = computedValue2 + itemHeight * 0.045;
    const computedValue4 = itemHeight - computedValue3;
    addBoxMesh(rotation, itemWidth, computedValue2, itemDepth, 0, computedValue2 * 0.5, 0, color6, {
      rounded: false,
      roughness: 0.5,
      metalness: 0.04
    });
    addBoxMesh(rotation, itemWidth * 0.94, 0.028, itemDepth * 1.02, 0, computedValue2 * 0.5, itemDepth * 0.515, color7, {
      rounded: false,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth * 0.94, 0.032, itemDepth * 1.02, 0, computedValue2, 0, color5, {
      rounded: false,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.94, itemHeight * 0.04, itemDepth * 1.04, 0, computedValue3, 0, color6, {
      rounded: false,
      roughness: 0.36,
      metalness: 0.1
    });
    addBoxMesh(rotation, itemWidth * 0.92, computedValue4, 0.032, 0, computedValue3 + computedValue4 * 0.5, -itemDepth * 0.46, color5, {
      rounded: false,
      roughness: 0.56
    });
    for (const localValue of [-itemWidth * 0.46, itemWidth * 0.46]) {
      addBoxMesh(rotation, itemWidth * 0.075, computedValue4, itemDepth * 0.78, localValue, computedValue3 + computedValue4 * 0.5, 0, color6, {
        rounded: false,
        roughness: 0.48
      });
    }
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.14, itemDepth * 0.18, 0, itemHeight * 0.9, itemDepth * 0.48, color7, {
      rounded: false,
      metalness: 0.32,
      roughness: 0.22
    });
    for (const localValue of [-itemWidth * 0.22, itemWidth * 0.22]) {
      addSoftBoxMesh(rotation, Math.min(itemWidth, itemDepth) * 0.035, Math.min(itemWidth, itemDepth) * 0.035, 0.018, localValue, itemHeight * 0.9, itemDepth * 0.585, color5, {
        segments: 20,
        rotationX: Math.PI / 2,
        metalness: 0.2,
        roughness: 0.25
      });
      addSoftBoxMesh(rotation, 0.012, 0.012, itemHeight * 0.11, localValue, itemHeight * 0.79, itemDepth * 0.5, color7, {
        segments: 18,
        metalness: 0.48,
        roughness: 0.22
      });
      const computedValue = Math.min(itemWidth, itemDepth) * 0.16;
      addSoftBoxMesh(rotation, computedValue * 0.9, computedValue, itemHeight * 0.13, localValue, itemHeight * 0.75, itemDepth * 0.12, localValue < 0 ? 8752009 : color5, {
        segments: 28,
        metalness: 0.08,
        roughness: 0.34
      });
      addSoftBoxMesh(rotation, computedValue * 0.84, computedValue * 0.84, 0.016, localValue, itemHeight * 0.82, itemDepth * 0.12, color7, {
        segments: 28,
        metalness: 0.18,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.12, itemHeight * 0.06, 0.016, localValue, itemHeight * 0.77, itemDepth * 0.3, color7, {
        radius: 0.012,
        metalness: 0.24,
        roughness: 0.24
      });
    }
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.055, itemDepth * 0.82, 0, 0.028, 0, color7, {
      rounded: false,
      roughness: 0.36
    });
  } else if (type20.type === "washer" || type20.type === "dryer") {
    const comparisonFlag = type20.type === "dryer";
    const computedValue2 = itemWidth * (comparisonFlag ? 0.32 : 0.29);
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, color6, {
      rounded: false,
      metalness: 0.1,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.18, 0.035, 0, itemHeight * 0.86, itemDepth * 0.505, color5, {
      rounded: false,
      roughness: 0.4
    });
    addSoftBoxMesh(rotation, computedValue2, computedValue2, 0.045, 0, itemHeight * 0.47, itemDepth * 0.515, color7, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.32,
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, computedValue2 * 0.74, computedValue2 * 0.74, 0.03, 0, itemHeight * 0.47, itemDepth * 0.545, comparisonFlag ? 2502715 : 3622485, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.08,
      roughness: 0.22
    });
    addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.035, itemWidth * 0.27, itemHeight * 0.86, itemDepth * 0.535, color7, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.4,
      roughness: 0.25
    });
    addBoxMesh(rotation, itemWidth * 0.25, itemHeight * 0.035, 0.026, -itemWidth * 0.23, itemHeight * 0.86, itemDepth * 0.535, color7, {
      rounded: false,
      roughness: 0.3
    });
    if (!comparisonFlag) {
      addBoxMesh(rotation, itemWidth * 0.2, itemHeight * 0.055, 0.025, -itemWidth * 0.3, itemHeight * 0.12, itemDepth * 0.525, color5, {
        rounded: false,
        roughness: 0.42
      });
    }
  } else if (type20.type === "dishwasher") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, color6, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.74, 0.028, 0, itemHeight * 0.46, itemDepth * 0.515, color5, {
      rounded: false,
      metalness: 0.08,
      roughness: 0.44
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.14, 0.032, 0, itemHeight * 0.87, itemDepth * 0.52, color7, {
      rounded: false,
      metalness: 0.18,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.58, itemHeight * 0.026, 0.034, 0, itemHeight * 0.78, itemDepth * 0.54, color7, {
      rounded: false,
      metalness: 0.5,
      roughness: 0.22
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.075, itemDepth * 0.78, 0, itemHeight * 0.038, -itemDepth * 0.04, color7, {
      rounded: false,
      roughness: 0.4
    });
    for (const localValue of [0.22, 0.31, 0.4]) {
      addSoftBoxMesh(rotation, itemWidth * 0.018, itemWidth * 0.018, 0.012, itemWidth * localValue, itemHeight * 0.88, itemDepth * 0.545, color5, {
        segments: 18,
        rotationX: Math.PI / 2,
        metalness: 0.26,
        roughness: 0.24
      });
    }
  } else if (type20.type === "steamoven") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, color6, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.94, itemHeight * 0.9, 0.026, 0, itemHeight * 0.5, itemDepth * 0.515, color7, {
      rounded: false,
      metalness: 0.18,
      roughness: 0.25
    });
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.56, 0.018, -itemWidth * 0.03, itemHeight * 0.42, itemDepth * 0.54, 1515819, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.72, itemHeight * 0.035, 0.038, -itemWidth * 0.03, itemHeight * 0.74, itemDepth * 0.56, color5, {
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
      addSoftBoxMesh(rotation, itemWidth * 0.045, itemWidth * 0.045, 0.026, itemWidth * localValue, itemHeight * 0.86, itemDepth * 0.55, color5, {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.4,
        roughness: 0.24
      });
    }
  } else if (type20.type === "microwave") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, color6, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.44
    });
    addBoxMesh(rotation, itemWidth * 0.93, itemHeight * 0.82, 0.025, 0, itemHeight * 0.49, itemDepth * 0.515, color7, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.24
    });
    addBoxMesh(rotation, itemWidth * 0.62, itemHeight * 0.63, 0.018, -itemWidth * 0.13, itemHeight * 0.48, itemDepth * 0.54, 1515819, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.035, itemHeight * 0.54, 0.03, itemWidth * 0.19, itemHeight * 0.48, itemDepth * 0.55, color5, {
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
      addBoxMesh(rotation, itemWidth * 0.13, itemHeight * 0.055, 0.018, itemWidth * 0.36, itemHeight * localValue, itemDepth * 0.545, color5, {
        rounded: false,
        roughness: 0.3
      });
    }
  } else if (type20.type === "ricecooker") {
    const computedValue2 = Math.min(itemWidth, itemDepth) * 0.47;
    addSoftBoxMesh(rotation, computedValue2 * 0.9, computedValue2, itemHeight * 0.68, 0, itemHeight * 0.38, 0, color6, {
      segments: 36,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, computedValue2 * 0.94, computedValue2 * 0.94, itemHeight * 0.12, 0, itemHeight * 0.77, 0, color5, {
      segments: 36,
      roughness: 0.38
    });
    addSoftBoxMesh(rotation, computedValue2 * 0.72, computedValue2 * 0.74, itemHeight * 0.035, 0, itemHeight * 0.85, 0, color7, {
      segments: 32,
      metalness: 0.12,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.5, itemHeight * 0.16, 0.026, 0, itemHeight * 0.42, itemDepth * 0.47, color7, {
      radius: Math.min(itemWidth, itemDepth) * 0.04,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.24, itemHeight * 0.06, 0.018, 0, itemHeight * 0.43, itemDepth * 0.49, 7706534, {
      rounded: false,
      emissive: 7706534,
      emissiveIntensity: 0.16,
      roughness: 0.2
    });
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, -itemWidth * 0.27, itemHeight * 0.86, 0, color7, {
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, itemWidth * 0.27, itemHeight * 0.86, 0, color7, {
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.58, itemHeight * 0.055, itemDepth * 0.1, 0, itemHeight * 0.94, 0, color7, {
      roughness: 0.3
    });
  } else if (type20.type === "rangehood") {
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.72, itemDepth * 0.42, 0, itemHeight * 0.6, -itemDepth * 0.18, furnitureItems, {
      rounded: false,
      metalness: 0.22,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth, itemHeight * 0.22, itemDepth, 0, itemHeight * 0.18, 0, color6, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.07, itemDepth * 0.8, 0, itemHeight * 0.055, itemDepth * 0.02, color7, {
      rounded: false,
      metalness: 0.35,
      roughness: 0.28
    });
    addBoxMesh(rotation, itemWidth * 0.22, itemHeight * 0.035, 0.025, itemWidth * 0.3, itemHeight * 0.2, itemDepth * 0.515, color5, {
      rounded: false,
      emissive: color5,
      emissiveIntensity: 0.12,
      roughness: 0.3
    });
  } else if (type20.type === "wallac") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, color6, {
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.08, itemDepth * 0.18, 0, itemHeight * 0.18, itemDepth * 0.46, color7, {
      rounded: false,
      roughness: 0.3
    });
    addBoxMesh(rotation, itemWidth * 0.12, itemHeight * 0.08, itemDepth * 0.05, itemWidth * 0.34, itemHeight * 0.68, itemDepth * 0.51, color5, {
      rounded: false,
      emissive: color5,
      emissiveIntensity: 0.18
    });
  } else if (type20.type === "floorac") {
    addSoftBoxMesh(rotation, itemWidth * 0.46, itemWidth * 0.48, itemHeight, 0, itemHeight * 0.5, 0, color6, {
      segments: 32,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.5, itemHeight * 0.42, 0.025, 0, itemHeight * 0.68, itemDepth * 0.48, color7, {
      rounded: false,
      roughness: 0.3
    });
    for (const localValue of [0.58, 0.68, 0.78]) {
      addBoxMesh(rotation, itemWidth * 0.42, 0.018, 0.03, 0, itemHeight * localValue, itemDepth * 0.5, color5, {
        rounded: false,
        roughness: 0.34
      });
    }
  } else if (type20.type === "robotvacuum") {
    addBoxMesh(rotation, itemWidth * 0.82, 0.035, itemDepth * 0.92, 0, 0.018, 0, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.05,
      roughness: 0.58
    });
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.82, itemDepth * 0.48, 0, itemHeight * 0.47, -itemDepth * 0.23, color6, {
      radius: Math.min(itemWidth, itemDepth) * 0.12,
      roughness: 0.48
    });
    addBoxMesh(rotation, itemWidth * 0.44, itemHeight * 0.16, 0.03, 0, itemHeight * 0.2, itemDepth * 0.02, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.04,
      roughness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.07, 0.035, 0, itemHeight * 0.14, itemDepth * 0.04, color7, {
      radius: Math.min(itemWidth, itemDepth) * 0.025,
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, itemWidth * 0.31, itemWidth * 0.32, itemHeight * 0.12, 0, itemHeight * 0.07, itemDepth * 0.2, color6, {
      segments: 32,
      roughness: 0.42
    });
    addSoftBoxMesh(rotation, itemWidth * 0.085, itemWidth * 0.09, itemHeight * 0.055, -itemWidth * 0.08, itemHeight * 0.16, itemDepth * 0.15, color5, {
      segments: 24,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth * 0.36, itemHeight * 0.045, 0.025, 0, itemHeight * 0.08, itemDepth * 0.52, color7, {
      radius: Math.min(itemWidth, itemDepth) * 0.025,
      roughness: 0.24
    });
  } else if (type20.type === "camera" || type20.type === "presence") {
    addSecurityModel(THREE, rotation, type20, glass);
  } else if (type20.type === "nas") {
    addBoxMesh(rotation, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, furnitureItems, {
      rounded: false,
      metalness: 0.16,
      roughness: 0.46
    });
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.88, 0.025, 0, itemHeight * 0.5, itemDepth * 0.515, color7, {
      rounded: false,
      metalness: 0.12,
      roughness: 0.32
    });
    for (const localValue of [-itemWidth * 0.23, itemWidth * 0.23]) {
      for (const localValue of [itemHeight * 0.3, itemHeight * 0.7]) {
        addBoxMesh(rotation, itemWidth * 0.38, itemHeight * 0.34, 0.018, localValue, localValue, itemDepth * 0.535, color5, {
          rounded: false,
          roughness: 0.38
        });
        addBoxMesh(rotation, itemWidth * 0.18, 0.018, 0.012, localValue, localValue + itemHeight * 0.1, itemDepth * 0.55, color7, {
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
  } else if (type20.type === "airpurifier") {
    const computedValue2 = Math.min(itemWidth, itemDepth) * 0.47;
    addSoftBoxMesh(rotation, computedValue2 * 0.96, computedValue2, itemHeight * 0.92, 0, itemHeight * 0.46, 0, color6, {
      segments: 36,
      roughness: 0.5
    });
    addSoftBoxMesh(rotation, computedValue2 * 0.92, computedValue2 * 0.92, itemHeight * 0.055, 0, itemHeight * 0.965, 0, color7, {
      segments: 36,
      metalness: 0.18,
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, computedValue2 * 0.55, computedValue2 * 0.55, itemHeight * 0.018, 0, itemHeight * 1.005, 0, color5, {
      segments: 32,
      metalness: 0.08,
      roughness: 0.35
    });
    for (const localValue of [-0.28, -0.14, 0, 0.14, 0.28]) {
      addBoxMesh(rotation, 0.012, itemHeight * 0.45, 0.012, itemWidth * localValue, itemHeight * 0.35, itemDepth * 0.46, color5, {
        rounded: false,
        roughness: 0.45
      });
    }
  } else if (type20.type === "tv") {
    const {
      bodyHeight: localValue,
      centerY: localValue2
    } = tvMountLayoutMetrics(type20, itemHeight);
    const computedValue2 = localValue2 - localValue * 0.5;
    if (type20.tvMountStyle === "mobile") {
      const localValue3 = Math.max(itemHeight * 0.045, 0.055);
      const computedValue = itemWidth * 0.7;
      const localValue4 = Math.max(itemDepth * 0.78, 0.3);
      const localValue5 = Math.max(computedValue2 - localValue3 * 0.7, itemHeight * 0.22);
      const computedValue3 = localValue3 * 0.7 + localValue5 * 0.5;
      addBoxMesh(rotation, computedValue, localValue3, localValue4, 0, localValue3 * 0.72, 0, color7, {
        radius: Math.min(localValue3, localValue4) * 0.22,
        metalness: 0.18,
        roughness: 0.32
      });
      addBoxMesh(rotation, itemWidth * 0.075, localValue5, Math.max(itemDepth * 0.2, 0.06), -itemWidth * 0.035, computedValue3, -itemDepth * 0.03, color7, {
        rounded: false,
        metalness: 0.2,
        roughness: 0.3
      });
      addBoxMesh(rotation, itemWidth * 0.105, localValue5 * 0.86, Math.max(itemDepth * 0.12, 0.04), itemWidth * 0.025, computedValue3 + localValue5 * 0.02, itemDepth * 0.015, color5, {
        rounded: false,
        metalness: 0.35,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.34, Math.max(itemHeight * 0.018, 0.025), Math.max(itemDepth * 0.5, 0.2), 0, computedValue2 * 0.76, itemDepth * 0.04, color7, {
        radius: 0.012,
        metalness: 0.22,
        roughness: 0.3
      });
      const localValue6 = Math.max(Math.min(itemWidth, itemDepth) * 0.045, 0.025);
      for (const localValue of [-computedValue * 0.42, computedValue * 0.42]) {
        for (const localValue of [-localValue4 * 0.34, localValue4 * 0.34]) {
          addSoftBoxMesh(rotation, localValue6, localValue6, Math.max(localValue6 * 0.56, 0.018), localValue, localValue6, localValue, 1448479, {
            segments: 20,
            rotationZ: Math.PI / 2,
            roughness: 0.38,
            metalness: 0.1
          });
        }
      }
    } else if (type20.tvMountStyle === "tabletop") {
      const localValue3 = Math.max(itemHeight * 0.035, 0.028);
      const computedValue = itemWidth * 0.34;
      const localValue4 = Math.max(itemDepth * 0.72, 0.16);
      const localValue5 = Math.max(computedValue2 - localValue3, itemHeight * 0.12);
      addBoxMesh(rotation, computedValue, localValue3, localValue4, 0, localValue3 * 0.5, 0, color7, {
        radius: Math.min(localValue3, localValue4) * 0.26,
        metalness: 0.2,
        roughness: 0.3
      });
      addBoxMesh(rotation, itemWidth * 0.075, localValue5, Math.max(itemDepth * 0.24, 0.05), 0, localValue3 + localValue5 * 0.5, -itemDepth * 0.03, color5, {
        rounded: false,
        metalness: 0.34,
        roughness: 0.28
      });
      addBoxMesh(rotation, itemWidth * 0.18, Math.max(itemHeight * 0.025, 0.022), Math.max(itemDepth * 0.34, 0.08), 0, computedValue2, 0, color7, {
        radius: 0.008,
        metalness: 0.22,
        roughness: 0.3
      });
    }
    addBoxMesh(rotation, itemWidth, localValue, Math.max(itemDepth * 0.28, 0.05), 0, localValue2, 0, color7, {
      radius: Math.min(itemWidth, localValue) * 0.012,
      roughness: 0.28
    });
  } else if (type20.type === "vanity") {
    const localValue = Math.min(0.76, itemHeight * 0.5);
    addBoxMesh(rotation, itemWidth, 0.075, itemDepth, 0, localValue, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, localValue * 0.82, itemDepth * 0.88, -itemWidth * 0.34, localValue * 0.42, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, localValue * 0.82, itemDepth * 0.88, itemWidth * 0.34, localValue * 0.42, 0, furnitureItems);
    for (const localValue2 of [-0.34, 0.34]) {
      for (const localValue of [0.23, 0.48]) {
        addBoxMesh(rotation, itemWidth * 0.22, 0.012, itemDepth * 0.02, itemWidth * localValue2, localValue * localValue, itemDepth * 0.46, color7, {
          rounded: false
        });
      }
    }
    const localValue3 = Math.max(itemHeight - localValue - 0.08, 0.45);
    addBoxMesh(rotation, itemWidth * 0.54, localValue3, 0.025, 0, localValue + localValue3 * 0.5, -itemDepth * 0.43, glass.glass, {
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      metalness: 0.22,
      roughness: 0.16
    });
    addBoxMesh(rotation, itemWidth * 0.59, 0.045, 0.05, 0, localValue + localValue3, -itemDepth * 0.43, color6, {
      metalness: 0.12
    });
    addBoxMesh(rotation, itemWidth * 0.59, 0.045, 0.05, 0, localValue, -itemDepth * 0.43, color6, {
      metalness: 0.12
    });
    addBoxMesh(rotation, 0.045, localValue3, 0.05, -itemWidth * 0.295, localValue + localValue3 * 0.5, -itemDepth * 0.43, color6, {
      metalness: 0.12
    });
    addBoxMesh(rotation, 0.045, localValue3, 0.05, itemWidth * 0.295, localValue + localValue3 * 0.5, -itemDepth * 0.43, color6, {
      metalness: 0.12
    });
  } else if (type20.type === "desk") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.1, itemDepth, 0, itemHeight * 0.93, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, -itemWidth * 0.44, itemHeight * 0.44, 0, color7);
    addBoxMesh(rotation, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, itemWidth * 0.44, itemHeight * 0.44, 0, color7);
    addBoxMesh(rotation, itemWidth * 0.34, itemHeight * 0.18, itemDepth * 0.78, itemWidth * 0.22, itemHeight * 0.74, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth * 0.27, 0.018, itemDepth * 0.04, itemWidth * 0.22, itemHeight * 0.73, itemDepth * 0.41, color6, {
      metalness: 0.35
    });
  } else if (type20.type === "desktop") {
    const computedValue2 = itemWidth * 0.72;
    const computedValue3 = itemHeight * 0.58;
    addBoxMesh(rotation, computedValue2, computedValue3, 0.035, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.25, color7, {
      rounded: false,
      roughness: 0.24
    });
    addBoxMesh(rotation, computedValue2 * 0.9, computedValue3 * 0.84, 0.01, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.19, 659481, {
      rounded: false,
      roughness: 0.18,
      emissive: 1517112,
      emissiveIntensity: 0.35
    });
    addBoxMesh(rotation, 0.035, itemHeight * 0.24, 0.035, -itemWidth * 0.06, itemHeight * 0.25, -itemDepth * 0.25, color7, {
      metalness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.28, 0.025, itemDepth * 0.3, -itemWidth * 0.06, 0.02, -itemDepth * 0.22, color7, {
      metalness: 0.42
    });
    addBoxMesh(rotation, itemWidth * 0.58, 0.022, itemDepth * 0.38, -itemWidth * 0.08, 0.025, itemDepth * 0.24, color5, {
      rounded: false,
      roughness: 0.5
    });
    addBoxMesh(rotation, itemWidth * 0.1, 0.035, itemDepth * 0.22, itemWidth * 0.36, 0.028, itemDepth * 0.24, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.46
    });
  } else if (type20.type === "laptop") {
    addBoxMesh(rotation, itemWidth, 0.025, itemDepth * 0.72, 0, 0.018, itemDepth * 0.08, furnitureItems, {
      metalness: 0.28,
      roughness: 0.36
    });
    const rotation2 = addBoxMesh(rotation, itemWidth * 0.96, itemHeight * 0.78, 0.018, 0, itemHeight * 0.43, -itemDepth * 0.29, color7, {
      rounded: false,
      metalness: 0.22,
      roughness: 0.25
    });
    rotation2.rotation.x = -Math.PI * 0.08;
    addBoxMesh(rotation, itemWidth * 0.86, itemHeight * 0.63, 0.01, 0, itemHeight * 0.43, -itemDepth * 0.278, 659740, {
      rounded: false,
      emissive: 1585226,
      emissiveIntensity: 0.38,
      roughness: 0.18
    });
    addBoxMesh(rotation, itemWidth * 0.62, 0.009, itemDepth * 0.34, 0, 0.035, itemDepth * 0.12, color7, {
      rounded: false
    });
  } else if (type20.type === "toilet") {
    const castShadow3 = new THREE.Mesh(createWallTopMaterial(itemWidth, itemDepth, itemHeight), new THREE.MeshStandardMaterial({
      color: color6,
      roughness: 0.4,
      metalness: 0.02
    }));
    castShadow3.castShadow = true;
    castShadow3.receiveShadow = true;
    rotation.add(castShadow3);
    const bezierCurveTo = new THREE.Shape();
    bezierCurveTo.moveTo(-itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.lineTo(itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.bezierCurveTo(itemWidth * 0.49, -itemDepth * 0.05, itemWidth * 0.49, itemDepth * 0.29, 0, itemDepth * 0.47);
    bezierCurveTo.bezierCurveTo(-itemWidth * 0.49, itemDepth * 0.29, -itemWidth * 0.49, -itemDepth * 0.05, -itemWidth * 0.46, -itemDepth * 0.44);
    bezierCurveTo.closePath();
    const rotation2 = new THREE.Mesh(new THREE.ExtrudeGeometry(bezierCurveTo, {
      depth: itemHeight * 0.085,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.012,
      bevelThickness: 0.01,
      steps: 1
    }), new THREE.MeshStandardMaterial({
      color: color5,
      roughness: 0.34,
      metalness: 0.01
    }));
    rotation2.rotation.x = Math.PI / 2;
    rotation2.position.set(0, itemHeight * 0.82, 0);
    rotation2.castShadow = true;
    rotation2.receiveShadow = true;
    rotation.add(rotation2);
    addBoxMesh(rotation, itemWidth * 0.9, itemHeight * 0.095, itemDepth * 0.2, 0, itemHeight * 0.775, -itemDepth * 0.34, color6, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.36
    });
    addBoxMesh(rotation, 0.016, itemHeight * 0.38, 0.024, -itemWidth * 0.42, itemHeight * 0.38, -itemDepth * 0.18, color7, {
      rounded: false,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, itemWidth * 0.035, itemWidth * 0.035, 0.018, -itemWidth * 0.46, itemHeight * 0.66, itemDepth * 0.12, color5, {
      segments: 24,
      rotationZ: Math.PI / 2,
      metalness: 0.08,
      roughness: 0.3
    });
  } else if (type20.type === "squattoilet") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.58, itemDepth, 0, itemHeight * 0.29, 0, color6, {
      radius: Math.min(itemWidth, itemDepth) * 0.08,
      roughness: 0.38
    });
    addBoxMesh(rotation, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, -itemWidth * 0.34, itemHeight * 0.66, 0, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.4
    });
    addBoxMesh(rotation, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, itemWidth * 0.34, itemHeight * 0.66, 0, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.035,
      roughness: 0.4
    });
    const scale3 = new THREE.Mesh(new THREE.CylinderGeometry(itemWidth * 0.16, itemWidth * 0.2, itemHeight * 0.18, 28), new THREE.MeshStandardMaterial({
      color: color7,
      roughness: 0.34,
      metalness: 0.02
    }));
    scale3.scale.z = 1.75;
    scale3.position.y = itemHeight * 0.67;
    rotation.add(scale3);
  } else if (type20.type === "urinal") {
    addBoxMesh(rotation, itemWidth * 0.78, itemHeight * 0.88, itemDepth * 0.72, 0, itemHeight * 0.5, -itemDepth * 0.06, color6, {
      radius: Math.min(itemWidth, itemDepth) * 0.16,
      roughness: 0.32
    });
    const scale2 = new THREE.Mesh(new THREE.SphereGeometry(Math.min(itemWidth, itemDepth) * 0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({
      color: color5,
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide
    }));
    scale2.scale.set(0.9, 1.1, 0.62);
    scale2.rotation.x = Math.PI;
    scale2.position.set(0, itemHeight * 0.53, itemDepth * 0.17);
    rotation.add(scale2);
    addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.22, 0, itemHeight * 0.95, -itemDepth * 0.18, color7, {
      segments: 16,
      metalness: 0.72,
      roughness: 0.22
    });
  } else if (type20.type === "bathtub") {
    const computedValue2 = itemHeight * 0.84;
    const cornerRadiusBase = Math.min(itemWidth, itemDepth) * 0.11;
    const computedValue3 = computedValue2 * 0.8;
    const localValue = Math.max(itemWidth - cornerRadiusBase * 2, itemWidth * 0.48);
    const localValue2 = Math.max(itemDepth - cornerRadiusBase * 2, itemDepth * 0.42);
    addBoxMesh(rotation, localValue, computedValue2 * 0.16, localValue2, 0, computedValue2 * 0.14, 0, color5, {
      radius: Math.min(itemWidth, itemDepth) * 0.16,
      roughness: 0.33
    });
    addBoxMesh(rotation, itemWidth, computedValue3, cornerRadiusBase, 0, computedValue3 * 0.5, -itemDepth * 0.5 + cornerRadiusBase * 0.5, color6, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, itemWidth, computedValue3, cornerRadiusBase, 0, computedValue3 * 0.5, itemDepth * 0.5 - cornerRadiusBase * 0.5, color6, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValue3, localValue2, -itemWidth * 0.5 + cornerRadiusBase * 0.5, computedValue3 * 0.5, 0, color6, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValue3, localValue2, itemWidth * 0.5 - cornerRadiusBase * 0.5, computedValue3 * 0.5, 0, color6, {
      radius: cornerRadiusBase * 0.5,
      roughness: 0.34
    });
    const computedValue4 = computedValue2 * 0.075;
    const computedValue5 = computedValue3 + computedValue4 * 0.5;
    addBoxMesh(rotation, itemWidth, computedValue4, cornerRadiusBase, 0, computedValue5, -itemDepth * 0.5 + cornerRadiusBase * 0.5, color6, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, itemWidth, computedValue4, cornerRadiusBase, 0, computedValue5, itemDepth * 0.5 - cornerRadiusBase * 0.5, color6, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValue4, localValue2, -itemWidth * 0.5 + cornerRadiusBase * 0.5, computedValue5, 0, color6, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    addBoxMesh(rotation, cornerRadiusBase, computedValue4, localValue2, itemWidth * 0.5 - cornerRadiusBase * 0.5, computedValue5, 0, color6, {
      radius: cornerRadiusBase * 0.45,
      roughness: 0.29
    });
    for (const localValue3 of [-itemWidth * 0.38, itemWidth * 0.38]) {
      for (const localValue of [-itemDepth * 0.3, itemDepth * 0.3]) {
        addSoftBoxMesh(rotation, 0.026, 0.026, itemHeight * 0.16, localValue3, itemHeight * 0.08, localValue, glass.furnitureDark, {
          segments: 12,
          metalness: 0.42,
          roughness: 0.3
        });
      }
    }
    addSoftBoxMesh(rotation, 0.016, 0.016, itemHeight * 0.25, itemWidth * 0.34, itemHeight * 0.96, -itemDepth * 0.22, color7, {
      segments: 16,
      metalness: 0.72,
      roughness: 0.2
    });
    addSoftBoxMesh(rotation, 0.016, 0.016, itemDepth * 0.28, itemWidth * 0.34, itemHeight * 1.08, -itemDepth * 0.08, color7, {
      segments: 16,
      rotationX: Math.PI / 2,
      metalness: 0.72,
      roughness: 0.2
    });
  } else if (type20.type === "walllamp") {
    const computedValue2 = -itemDepth * 0.5 + 0.018;
    const objectValue = {
      rounded: false,
      metalness: 0.64,
      roughness: 0.22
    };
    addBoxMesh(rotation, itemWidth * 0.68, itemHeight * 0.5, 0.035, 0, itemHeight * 0.52, computedValue2, glass.furniture, {
      radius: 0.02,
      metalness: 0.18,
      roughness: 0.46
    });
    addSoftBoxMesh(rotation, itemWidth * 0.11, itemWidth * 0.11, 0.035, 0, itemHeight * 0.57, computedValue2 - 0.012, glass.furnitureSoft, {
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
      color: color6,
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
  } else if (type20.type === "glasspartition") {
    const localValue = Math.min(Math.max(itemWidth * 0.018, 0.018), 0.035);
    const localValue2 = Math.max(itemDepth, 0.045);
    const localValue3 = Math.max(itemWidth - localValue * 2.4, localValue);
    const localValue4 = Math.max(itemHeight - localValue * 2.4, localValue);
    const objectValue = {
      rounded: false,
      metalness: 0.58,
      roughness: 0.24,
      castShadow: false,
      receiveShadow: false
    };
    addBoxMesh(rotation, localValue3, localValue4, Math.max(itemDepth * 0.24, 0.012), 0, itemHeight * 0.5, 0, glass.glass, {
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
    addBoxMesh(rotation, itemWidth, localValue, localValue2, 0, localValue * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, itemWidth, localValue, localValue2, 0, itemHeight - localValue * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, localValue, itemHeight, localValue2, -itemWidth * 0.5 + localValue * 0.5, itemHeight * 0.5, 0, glass.frame, objectValue);
    addBoxMesh(rotation, localValue, itemHeight, localValue2, itemWidth * 0.5 - localValue * 0.5, itemHeight * 0.5, 0, glass.frame, objectValue);
    for (const localValue5 of [-itemWidth * 0.34, itemWidth * 0.34]) {
      addBoxMesh(rotation, localValue * 1.7, localValue * 2.2, localValue2 * 1.18, localValue5, localValue * 1.3, 0, color5, objectValue);
    }
  } else if (type20.type === "shower") {
    const localValue = color6;
    const computedValue2 = -itemDepth * 0.42;
    const computedValue3 = itemHeight * 0.13;
    const computedValue4 = itemHeight * 0.9;
    const computedValue5 = computedValue4 - computedValue3;
    const objectValue = {
      rounded: false,
      metalness: 0.68,
      roughness: 0.22
    };
    addBoxMesh(rotation, 0.045, computedValue5, 0.045, 0, (computedValue3 + computedValue4) * 0.5, computedValue2, localValue, objectValue);
    for (const localValue2 of [computedValue3, itemHeight * 0.47, itemHeight * 0.78, computedValue4]) {
      addBoxMesh(rotation, 0.085, 0.085, 0.065, 0, localValue2, computedValue2, localValue, objectValue);
    }
    for (const localValue2 of [computedValue3, computedValue4]) {
      addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.04, 0, localValue2, -itemDepth * 0.47, localValue, {
        segments: 28,
        rotationX: Math.PI / 2,
        metalness: 0.7,
        roughness: 0.2
      });
    }
    const computedValue6 = itemHeight * 0.12;
    addBoxMesh(rotation, itemWidth * 0.36, 0.065, 0.065, 0, computedValue6, computedValue2 + itemDepth * 0.08, localValue, objectValue);
    for (const localValue2 of [-itemWidth * 0.2, itemWidth * 0.2]) {
      addSoftBoxMesh(rotation, itemWidth * 0.055, itemWidth * 0.055, 0.045, localValue2, computedValue6, -itemDepth * 0.45, localValue, {
        segments: 28,
        rotationX: Math.PI / 2,
        metalness: 0.7,
        roughness: 0.2
      });
      addBoxMesh(rotation, 0.05, 0.05, itemDepth * 0.13, localValue2, computedValue6, computedValue2 + itemDepth * 0.01, localValue, objectValue);
    }
    addBoxMesh(rotation, 0.045, itemHeight * 0.12, 0.045, 0, computedValue6 - itemHeight * 0.045, computedValue2 + itemDepth * 0.13, localValue, objectValue);
    const y = new THREE.Vector3(0, computedValue4, computedValue2);
    const z = new THREE.Vector3(0, itemHeight * 0.76, itemDepth * 0.08);
    const computedValue7 = z.y - y.y;
    const computedValue8 = z.z - y.z;
    const localValue3 = Math.hypot(computedValue7, computedValue8);
    const rotation2 = addBoxMesh(rotation, 0.055, localValue3, 0.055, 0, (y.y + z.y) * 0.5, (y.z + z.z) * 0.5, localValue, objectValue);
    rotation2.rotation.x = Math.atan2(computedValue8, computedValue7);
    addBoxMesh(rotation, 0.055, itemHeight * 0.13, 0.055, 0, itemHeight * 0.705, z.z, localValue, objectValue);
    addBoxMesh(rotation, itemWidth * 0.34, 0.035, itemDepth * 0.3, 0, itemHeight * 0.64, z.z + itemDepth * 0.03, localValue, {
      rounded: false,
      metalness: 0.64,
      roughness: 0.24
    });
  } else if (type20.type === "basin") {
    addBoxMesh(rotation, itemWidth * 0.92, itemHeight * 0.72, itemDepth * 0.9, 0, itemHeight * 0.36, 0, furnitureItems);
    addBoxMesh(rotation, itemWidth, 0.065, itemDepth, 0, itemHeight * 0.75, 0, color6, {
      roughness: 0.3
    });
    addSoftBoxMesh(rotation, itemWidth * 0.25, itemWidth * 0.21, 0.08, 0, itemHeight * 0.8, itemDepth * 0.02, color5, {
      roughness: 0.28
    });
    addSoftBoxMesh(rotation, 0.018, 0.018, itemHeight * 0.2, 0, itemHeight * 0.9, -itemDepth * 0.2, color7, {
      metalness: 0.78,
      roughness: 0.18
    });
    addSoftBoxMesh(rotation, 0.018, 0.018, itemDepth * 0.2, 0, itemHeight * 0.99, -itemDepth * 0.11, color7, {
      rotationX: Math.PI / 2,
      metalness: 0.78,
      roughness: 0.18
    });
    addBoxMesh(rotation, 0.012, itemHeight * 0.62, itemDepth * 0.02, 0, itemHeight * 0.34, itemDepth * 0.46, color7, {
      rounded: false
    });
    const computedValue2 = itemHeight * 1.05;
    const computedValue3 = itemWidth * 0.72;
    const numericValue = 0.72;
    const computedValue4 = -itemDepth * 0.46;
    addBoxMesh(rotation, computedValue3, numericValue, 0.018, 0, computedValue2 + numericValue * 0.5, computedValue4, glass.glass, {
      rounded: false,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      metalness: 0.26,
      roughness: 0.12,
      castShadow: false
    });
    addBoxMesh(rotation, computedValue3 + 0.055, 0.035, 0.045, 0, computedValue2, computedValue4, color7, {
      metalness: 0.35
    });
    addBoxMesh(rotation, computedValue3 + 0.055, 0.035, 0.045, 0, computedValue2 + numericValue, computedValue4, color7, {
      metalness: 0.35
    });
    addBoxMesh(rotation, 0.035, numericValue, 0.045, -computedValue3 * 0.5, computedValue2 + numericValue * 0.5, computedValue4, color7, {
      metalness: 0.35
    });
    addBoxMesh(rotation, 0.035, numericValue, 0.045, computedValue3 * 0.5, computedValue2 + numericValue * 0.5, computedValue4, color7, {
      metalness: 0.35
    });
  } else if (type20.type === "rug") {
    if (!addRugMeshes(rotation, type20, furnitureItems, color5)) {
      const clampedValue = clamp(itemHeight, 0.004, 0.018);
      addBoxMesh(rotation, itemWidth, clampedValue, itemDepth, 0, clampedValue * 0.5, 0, furnitureItems, {
        radius: Math.min(itemWidth, itemDepth) * 0.018,
        roughness: 1,
        metalness: 0,
        castShadow: false,
        receiveShadow: true
      });
      const rotation2 = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth * 0.88, itemDepth * 0.84), new THREE.MeshStandardMaterial({
        color: color5,
        roughness: 1,
        metalness: 0,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -4
      }));
      rotation2.rotation.x = -Math.PI / 2;
      rotation2.position.y = clampedValue + 0.001;
      rotation2.castShadow = false;
      rotation2.receiveShadow = true;
      rotation2.renderOrder = 1;
      rotation.add(rotation2);
    }
  } else if (type20.type === "tvstand") {
    addBoxMesh(rotation, itemWidth, itemHeight * 0.76, itemDepth, 0, itemHeight * 0.42, 0, furnitureItems);
    const computedValue2 = itemHeight * 0.08;
    const computedValue3 = itemHeight * 0.8;
    addBoxMesh(rotation, itemWidth * 0.98, computedValue2, itemDepth, 0, computedValue3 + computedValue2 * 0.5, 0, color5);
    addBoxMesh(rotation, 0.018, itemHeight * 0.58, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, color7, {
      rounded: false
    });
    addBoxMesh(rotation, itemWidth * 0.91, 0.015, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, color7, {
      rounded: false
    });
    for (const localValue of [-0.4, 0.4]) {
      addBoxMesh(rotation, 0.055, itemHeight * 0.2, 0.055, itemWidth * localValue, itemHeight * 0.1, 0, color7, {
        metalness: 0.32
      });
    }
  } else if (type20.type === "floorlamp") {
    const computedValue2 = -itemWidth * 0.34;
    const computedValue3 = itemWidth * 0.31;
    const localValue = Math.min(itemWidth * 0.13, itemDepth * 0.34);
    const localValue2 = Math.min(itemWidth * 0.18, itemDepth * 0.46);
    const computedValue4 = itemHeight * 0.115;
    const computedValue5 = itemHeight * 0.76;
    const computedValue6 = computedValue5 + computedValue4;
    addSoftBoxMesh(rotation, localValue * 0.82, localValue, 0.045, computedValue2, 0.0225, 0, color7, {
      segments: 32,
      metalness: 0.38,
      roughness: 0.3
    });
    const constructedCubicBezierCurve3 = new THREE.CubicBezierCurve3(new THREE.Vector3(computedValue2, 0.045, 0), new THREE.Vector3(computedValue2, itemHeight * 0.72, 0), new THREE.Vector3(itemWidth * 0.02, itemHeight * 1.01, 0), new THREE.Vector3(computedValue3, computedValue6, 0));
    const castShadow2 = new THREE.Mesh(new THREE.TubeGeometry(constructedCubicBezierCurve3, 48, Math.max(0.012, itemWidth * 0.012), 8, false), new THREE.MeshStandardMaterial({
      color: color7,
      roughness: 0.3,
      metalness: 0.48
    }));
    castShadow2.castShadow = true;
    rotation.add(castShadow2);
    const scale = new THREE.Mesh(new THREE.SphereGeometry(localValue2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({
      color: color5,
      roughness: 0.62,
      metalness: 0.04
    }));
    scale.scale.set(1, computedValue4 / localValue2, 1);
    scale.position.set(computedValue3, computedValue5, 0);
    scale.castShadow = true;
    rotation.add(scale);
    addSoftBoxMesh(rotation, localValue2 * 0.94, localValue2 * 0.98, 0.025, computedValue3, computedValue5, 0, color7, {
      segments: 32,
      metalness: 0.12,
      roughness: 0.5
    });
    addSoftBoxMesh(rotation, Math.max(0.018, itemWidth * 0.014), Math.max(0.022, itemWidth * 0.018), 0.045, computedValue3, computedValue6 + 0.012, 0, color7, {
      segments: 20,
      metalness: 0.42,
      roughness: 0.28
    });
  } else if (type20.type === "plant") {
    addSoftBoxMesh(rotation, itemWidth * 0.25, itemWidth * 0.21, itemHeight * 0.22, 0, itemHeight * 0.11, 0, color5, {
      segments: 24,
      roughness: 0.82
    });
    addSoftBoxMesh(rotation, itemWidth * 0.22, itemWidth * 0.22, 0.035, 0, itemHeight * 0.22, 0, color7, {
      segments: 24,
      roughness: 0.96
    });
    const arrayValue = [[new THREE.Vector3(0, itemHeight * 0.21, 0), new THREE.Vector3(-itemWidth * 0.06, itemHeight * 0.58, 0), new THREE.Vector3(-itemWidth * 0.27, itemHeight * 0.78, 0)], [new THREE.Vector3(itemWidth * 0.03, itemHeight * 0.21, 0), new THREE.Vector3(itemWidth * 0.06, itemHeight * 0.64, 0), new THREE.Vector3(itemWidth * 0.12, itemHeight * 0.94, 0)], [new THREE.Vector3(0, itemHeight * 0.28, 0), new THREE.Vector3(itemWidth * 0.18, itemHeight * 0.62, 0), new THREE.Vector3(itemWidth * 0.31, itemHeight * 0.79, 0)]];
    for (const localValue of arrayValue) {
      const castShadow = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(localValue), 20, 0.014, 7, false), new THREE.MeshStandardMaterial({
        color: color7,
        roughness: 0.86
      }));
      castShadow.castShadow = true;
      rotation.add(castShadow);
    }
    const arrayValue2 = [[-0.27, 0.78, 0], [-0.1, 0.61, 0.02], [0.12, 0.94, 0], [0.31, 0.79, 0], [0.18, 0.63, -0.02], [0.02, 0.46, 0.03]];
    for (const [localValue, localValue2, localValue3] of arrayValue2) {
      for (let zeroValue = 0; zeroValue < 5; zeroValue += 1) {
        const value = zeroValue / 5 * Math.PI * 2;
        const rotation2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 6), new THREE.MeshStandardMaterial({
          color: zeroValue % 2 ? 7835779 : 6257261,
          roughness: 0.9
        }));
        rotation2.scale.set(itemWidth * 0.045, itemHeight * 0.085, itemDepth * 0.025);
        rotation2.position.set(itemWidth * localValue + Math.cos(value) * itemWidth * 0.08, itemHeight * localValue2 + Math.sin(value) * itemHeight * 0.035, itemDepth * localValue3 + Math.sin(value) * itemDepth * 0.06);
        rotation2.rotation.z = value - Math.PI / 2;
        rotation2.rotation.y = value * 0.6;
        rotation2.castShadow = true;
        rotation.add(rotation2);
      }
    }
  }
  if ((floorScene.has(type20.type) || projectDoc.has(type20.type)) && type20.offlineModelExport !== true) {
    const forEach3 = [...rotation.children];
    // Stage curtain motion needs procedural curtainPart tags; keep the built-in rig there.
    if (!(isStageEmbed && type20.type === "curtain") && attachExternalItemModel(rotation, type20)) {
      forEach3.forEach(argPrimary => {
        rotation.remove(argPrimary);
        disposeObject3dResources(argPrimary);
      });
    }
  }
  if (type20.type === "tv" && type20.offlineModelExport !== true) {
    addTvMountMeshes(rotation, type20, itemWidth, itemDepth, itemHeight);
  }
  mergeSimilarItemMeshes(rotation, type20.type);
  addStripLightHelpers(rotation, type20.type);
  countShadowLights(rotation, isSelected("item", type20.id));
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
  if (lightItemTypes2.has(argSecondary.type)) {
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
function collectShadowLights(updateMatrixWorld2) {
  updateMatrixWorld2.updateMatrixWorld(true);
  updateMatrixWorld2.updateMatrix();
  if (updateMatrixWorld2.matrix.determinant() < 0) {
    return null;
  }
  const list = updateMatrixWorld2.matrixWorld.clone().invert();
  const push18 = [];
  let boolTrue = true;
  updateMatrixWorld2.traverse(isMesh2 => {
    if (!boolTrue || !isMesh2.isMesh) {
      return;
    }
    const transparent = isMesh2.material;
    if (!isMesh2.userData.externalModelSharedGeometry || Array.isArray(transparent) || !transparent || transparent.transparent === true || finite(transparent.opacity, 1) < 0.999 || isMesh2.isSkinnedMesh || isMesh2.morphTargetInfluences) {
      boolTrue = false;
      return;
    }
    const relativeMatrix = new THREE.Matrix4().multiplyMatrices(list, isMesh2.matrixWorld);
    const localValue = collectChildMeshes(isMesh2);
    if (!localValue) {
      boolTrue = false;
      return;
    }
    push18.push({
      mesh: isMesh2,
      relativeMatrix,
      signature: JSON.stringify([isMesh2.geometry.uuid, localValue, relativeMatrix.elements.map(argPrimary => Math.round(argPrimary * 1000000) / 1000000), isMesh2.castShadow, isMesh2.receiveShadow, isMesh2.renderOrder])
    });
  });
  if (boolTrue && push18.length) {
    return push18;
  } else {
    return null;
  }
}
function mergeStaticItemInstanceBatches(object3d, argSecondary) {
  const lookupMap = new Map();
  for (const {
    item,
    group: object3d2
  } of argSecondary) {
    if (skipInstanceMergeTypes.has(item.type) || isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(item.type) || isSelected("item", item.id)) {
      continue;
    }
    const map6 = collectShadowLights(object3d2);
    if (!map6) {
      continue;
    }
    const cacheKey = JSON.stringify([item.type, map6.map(signature2 => signature2.signature)]);
    if (!lookupMap.has(cacheKey)) {
      lookupMap.set(cacheKey, []);
    }
    lookupMap.get(cacheKey).push({
      item,
      group: object3d2,
      descriptors: map6
    });
  }
  object3d.updateMatrixWorld(true);
  const value = object3d.matrixWorld.clone().invert();
  const reduceVar = [];
  for (const list2 of lookupMap.values()) {
    if (list2.length < 2) {
      continue;
    }
    const item = list2[0].descriptors.length;
    for (let zeroValue = 0; zeroValue < item; zeroValue += 1) {
      const userData18 = list2[0].descriptors[zeroValue].mesh;
      const conditionalValue = userData18.userData.externalModelSharedMaterial ? userData18.material : userData18.material.clone();
      const userData19 = new THREE.InstancedMesh(userData18.geometry, conditionalValue, list2.length);
      userData19.name = "ha-bridge-instance-" + list2[0].item.type + "-" + (zeroValue + 1);
      userData19.castShadow = userData18.castShadow;
      userData19.receiveShadow = userData18.receiveShadow;
      userData19.renderOrder = userData18.renderOrder;
      userData19.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      userData19.userData.externalModelSharedGeometry = true;
      userData19.userData.externalModelSharedTextures = true;
      userData19.userData.externalModelSharedMaterial = userData18.userData.externalModelSharedMaterial === true;
      userData19.userData.modelLayer = "items";
      userData19.userData.exportRole = "plan";
      userData19.userData.instanceItemType = list2[0].item.type;
      userData19.userData.instanceItemIds = list2.map(({
        item: id2
      }) => id2.id);
      list2.forEach(({
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
    } of list2) {
      object3d.remove(localValue);
      disposeObject3dResources(localValue);
    }
    reduceVar.push({
      type: list2[0].item.type,
      instances: list2.length,
      before: list2.length * item,
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
function buildCanvasPathFromPoints(updateMatrixWorld3, item) {
  const staticBatchGeometryMap = new Map();
  const helperFn = material5 => {
    const filterVar = Object.keys(material5.geometry.attributes).filter(argPrimary => argPrimary !== "color" || material5.material.vertexColors).sort();
    if (!isStageEmbed || Object.values(material5.material).some(isTexture => isTexture?.isTexture)) {
      return filterVar;
    } else {
      return filterVar.filter(argPrimary => argPrimary === "position" || argPrimary === "normal" || argPrimary === "color" && material5.material.vertexColors);
    }
  };
  updateMatrixWorld3.updateMatrixWorld(true);
  for (const {
    item: type15,
    group: parent4
  } of item) {
    if (parent4.parent === updateMatrixWorld3 && !skipInstanceMergeTypes.has(type15.type) && (!isStageEmbed || !["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type15.type)) && !isSelected("item", type15.id)) {
      parent4.traverse(geometry2 => {
        if (!geometry2.isMesh || geometry2.isInstancedMesh || geometry2.geometry.drawRange.start !== 0 || geometry2.geometry.drawRange.count !== Infinity) {
          return;
        }
        for (let parent2 = geometry2; parent2 && parent2 !== updateMatrixWorld3; parent2 = parent2.parent) {
          if (!parent2.visible) {
            return;
          }
        }
        const computedValue = isStageEmbed && !geometry2.material?.vertexColors;
        const localValue = createGlassMaterial(geometry2, isStageEmbed, computedValue);
        if (!localValue || geometry2.matrixWorld.determinant() < 0) {
          return;
        }
        const pushTarget = helperFn(geometry2).map(object3d => [object3d, geometry2.geometry.attributes[object3d].itemSize]);
        if (computedValue) {
          pushTarget.push(["color", 3]);
        }
        const conditionalValue = isStageEmbed ? JSON.stringify(pushTarget) : meshMaterialSignature(geometry2);
        const computedValue2 = localValue + ":" + conditionalValue + ":" + computedValue;
        if (!staticBatchGeometryMap.has(computedValue2)) {
          staticBatchGeometryMap.set(computedValue2, []);
        }
        staticBatchGeometryMap.get(computedValue2).push(geometry2);
      });
    }
  }
  const inverseWorldMatrix = updateMatrixWorld3.matrixWorld.clone().invert();
  const staticBatchStats = [];
  const add3 = new Set();
  for (const length19 of staticBatchGeometryMap.values()) {
    if (length19.length < 2) {
      continue;
    }
    const forEach4 = length19.map(geometry4 => {
      const localMatrix = new THREE.Matrix4().multiplyMatrices(inverseWorldMatrix, geometry4.matrixWorld);
      const attributes = geometry4.geometry.clone();
      if (isStageEmbed) {
        const includesVar = helperFn(geometry4);
        for (const attrName of Object.keys(attributes.attributes)) {
          if (!includesVar.includes(attrName)) {
            attributes.deleteAttribute(attrName);
          }
        }
        for (const attrName of includesVar) {
          const itemSize = geometry4.geometry.attributes[attrName];
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
        if (!geometry4.material.vertexColors) {
          const vertexCount = attributes.attributes.position.count;
          const constructedFloat32Array = new Float32Array(vertexCount * 3);
          const r = geometry4.material.color;
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
    const localValue2 = mergeGeometries(forEach4);
    forEach4.forEach(dispose2 => dispose2.dispose());
    if (!localValue2) {
      continue;
    }
    const material9 = length19[0];
    const computedValue = isStageEmbed && !material9.material.vertexColors;
    const color3 = computedValue ? material9.material.clone() : material9.material;
    if (computedValue) {
      color3.color.setRGB(1, 1, 1);
      color3.vertexColors = true;
    }
    const userData30 = new THREE.Mesh(localValue2, color3);
    userData30.castShadow = material9.castShadow;
    userData30.receiveShadow = material9.receiveShadow;
    userData30.renderOrder = material9.renderOrder;
    userData30.layers.mask = material9.layers.mask;
    userData30.userData.externalModelSharedTextures = material9.userData.externalModelSharedTextures === true;
    userData30.userData.externalModelSharedMaterial = !computedValue && material9.userData.externalModelSharedMaterial === true;
    userData30.userData.reflectionSimplifiable = isStageEmbed;
    userData30.userData.modelLayer = "items";
    userData30.userData.exportRole = "plan";
    for (const userData23 of length19) {
      userData23.parent?.remove(userData23);
      if (!userData23.userData.externalModelSharedGeometry) {
        userData23.geometry.dispose();
      }
      if (!userData23.userData.externalModelSharedMaterial) {
        add3.add(userData23.material);
      }
    }
    updateMatrixWorld3.add(userData30);
    staticBatchStats.push({
      before: length19.length,
      after: 1
    });
  }
  for (const {
    group: parent5
  } of item) {
    if (parent5.parent === updateMatrixWorld3 && collectDescendantMeshes(parent5).length === 0) {
      updateMatrixWorld3.remove(parent5);
    }
  }
  const add4 = new Set();
  updateMatrixWorld3.traverse(material6 => {
    for (const localValue of Array.isArray(material6.material) ? material6.material : material6.material ? [material6.material] : []) {
      add4.add(localValue);
    }
  });
  for (const dispose6 of add3) {
    if (!add4.has(dispose6)) {
      dispose6.dispose?.();
    }
  }
  updateMatrixWorld3.userData.staticItemBatchStats = staticBatchStats;
  if (renderer?.domElement) {
    renderer.domElement.dataset.staticItemBatchCount = String(staticBatchStats.length);
    renderer.domElement.dataset.staticItemDrawCallsSaved = String(staticBatchStats.reduce((argPrimary, before2) => argPrimary + before2.before - before2.after, 0));
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
      if (flag && !O0.has(flag)) {
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
  const materials = externalModels2.modelLoadState();
  renderer.domElement.dataset.externalSharedMaterialCount = String(materials.materials);
  renderer.domElement.dataset.externalMaterialReuseCount = String(materials.materialReuses);
  renderer.domElement.dataset.externalPrecompilePassCount = String(cs);
  renderer.domElement.dataset.lightPrecompilePassCount = String(G0);
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
  const list2 = new Set();
  const list22 = [];
  const localValue = meshInstanceDescriptors(list);
  const computedValue = worldGroup.uuid + ":" + cs;
  if (materialTestTypeQuery !== computedValue) {
    materialTestTypeQuery = computedValue;
    instanceTestTypeQuery.clear();
  }
  const helperFn = (argPrimary, filter2, flag = false) => {
    const signature3 = meshInstanceDescriptors(argPrimary);
    if (!list2.has(signature3)) {
      list2.add(signature3);
      if (!instanceTestTypeQuery.has(signature3)) {
        if (!!flag || signature3 === localValue || !(instanceTestTypeQuery.size + list22.length >= qg)) {
          list22.push({
            signature: signature3,
            lights: filter2.filter(visible => visible.visible).map(light2 => light2.light),
            changes: filter2
          });
        }
      }
    }
  };
  helperFn(list, [], true);
  helperFn([], idSet.map(light8 => ({
    light: light8,
    visible: false
  })), true);
  for (const list3 of lookupMap.values()) {
    const lights = list3.filter(object3d => object3d.visible === false);
    if (lights.length) {
      helperFn([...list, ...lights], lights.map(light5 => ({
        light: light5,
        visible: true
      })));
    }
    const signature = list3.filter(visible5 => visible5.visible !== false);
    if (signature.length) {
      helperFn(list.filter(argPrimary => !signature.includes(argPrimary)), signature.map(light6 => ({
        light: light6,
        visible: false
      })));
    }
  }
  if (isStageEmbed) {
    helperFn(idSet, idSet.map(light7 => ({
      light: light7,
      visible: true
    })), true);
  }
  return list22;
}
const Xm = 4500;
function countLightPrecompileWork(argPrimary, traverse4, argTertiary, argN4) {
  const value = argPrimary.getContext();
  if (!argN4() || value.isContextLost() || argPrimary.extensions?.has("KHR_parallel_shader_compile") === false) {
    return Promise.resolve(false);
  }
  argPrimary.compile(traverse4, argTertiary);
  let count = false;
  traverse4.traverse?.(material7 => {
    if ((Array.isArray(material7.material) ? material7.material : [material7.material]).some(transmission => transmission?.transmission > 0)) {
      count = true;
    }
  });
  if (count) {
    const localValue = argPrimary.getRenderTarget();
    const localValue2 = argPrimary.getActiveCubeFace();
    const localValue3 = argPrimary.getActiveMipmapLevel();
    const dispose5 = new THREE.WebGLRenderTarget(1, 1);
    try {
      argPrimary.setRenderTarget(dispose5);
      argPrimary.compile(traverse4, argTertiary);
    } finally {
      argPrimary.setRenderTarget(localValue, localValue2, localValue3);
      dispose5.dispose();
    }
  }
  const count2 = [...argPrimary.info.programs];
  const count3 = performance.now() + Xm;
  return new Promise((argPrimary2, argSecondary) => {
    const helperFn = () => {
      try {
        if (!argN4() || argPrimary.getContext() !== value || value.isContextLost()) {
          argPrimary2(false);
          return;
        }
        const has2 = new Set(argPrimary.info.programs);
        const helperFn = program => has2.has(program) && program.program && value.isProgram(program.program);
        if (count2.some(argPrimary => !helperFn(argPrimary))) {
          argPrimary2(false);
          return;
        }
        if (count2.every(isReady => isReady.isReady())) {
          for (const getUniforms of count2) {
            if (!helperFn(getUniforms)) {
              argPrimary2(false);
              return;
            }
            getUniforms.getUniforms();
            if (!helperFn(getUniforms)) {
              argPrimary2(false);
              return;
            }
            getUniforms.getAttributes();
          }
          argPrimary2(true);
        } else if (performance.now() >= count3) {
          argPrimary2(false);
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
  return endBaseLightPanelDrag || document.hidden || isStageEmbed && (!Vo || renderCache2?.closed);
}
function createInvisibleMaterial() {
  return stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isLightPrecompiling || isStageEmbed && (isStageWarmup || isCapturingFrame) || !isStageEmbed && isPreviewQualityReady();
}
function scheduleOrbitInteractionWarmup(numericParam = 360) {
  if (!yt && !isAutoDiagramEmbed2 && !endBaseLightPanelDrag) {
    ORBIT_DOLLY_SPEED_SCALE = true;
    window.clearTimeout(endDetailsPanelResize);
    if (!ORBIT_DOLLY_SPEED_MAX && !activeFloorContentBounds()) {
      endDetailsPanelResize = window.setTimeout(async () => {
        endDetailsPanelResize = null;
        if (activeFloorContentBounds()) {
          return;
        }
        const active = externalModels2.modelLoadState();
        if (!renderer || !previewScene2 || !camera2 || !worldGroup || createInvisibleMaterial() || externalModelQueueActive || deferredModelTimer2 || active.active > 0 || active.queued > 0) {
          scheduleOrbitInteractionWarmup(240);
          return;
        }
        const length5 = collectWorldExternalMeshes();
        const uuid = worldGroup;
        const localValue = previewScene2;
        const domElement = renderer;
        const localValue2 = [uuid.uuid, getPreviewFloorMode2(), activeFloorId, cs, ...length5.map(signature => signature.signature).sort()].join("|");
        if (!length5.length) {
          ORBIT_DOLLY_SPEED_SCALE = false;
          domElement.domElement.dataset.lightPrecompileState = "ready";
          syncExternalModelDomStats();
          return;
        }
        ORBIT_DOLLY_SPEED_MAX = true;
        ORBIT_DOLLY_SPEED_SCALE = false;
        domElement.domElement.dataset.lightPrecompileState = "working";
        domElement.domElement.dataset.lightPrecompilePlanCount = String(length5.length);
        const helperFn = () => worldGroup === uuid && previewScene2 === localValue && renderer === domElement && !ORBIT_DOLLY_SPEED_SCALE && !activeFloorContentBounds() && !createInvisibleMaterial();
        let boolTrue = true;
        try {
          for (const changes of length5) {
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
            let localValue2 = null;
            try {
              for (const light3 of localValue) {
                light3.light.intensity = 0;
                light3.light.visible = light3.nextVisible;
              }
              syncSpotShadowCastingLights(uuid, {
                rebuildAtlas: false
              });
              localValue2 = countLightPrecompileWork(domElement, localValue, camera2, helperFn);
            } finally {
              for (const light4 of localValue) {
                light4.light.visible = light4.visible;
                light4.light.intensity = light4.intensity;
              }
              syncSpotShadowCastingLights(uuid, {
                rebuildAtlas: false
              });
            }
            if (!(await localValue2) || !helperFn()) {
              boolTrue = false;
              domElement.domElement.dataset.lightPrecompileDeferred = "true";
              ORBIT_DOLLY_SPEED_SCALE ||= !helperFn();
              break;
            }
            G0 += 1;
            instanceTestTypeQuery.add(changes.signature);
          }
          if (boolTrue) {
            PRECOMPILE_TIMEOUT_MS = localValue2;
            delete domElement.domElement.dataset.lightPrecompileDeferred;
            domElement.domElement.dataset.lightPrecompileState = "ready";
          } else {
            domElement.domElement.dataset.lightPrecompileState = "deferred";
          }
        } catch (localValue3) {
          domElement.domElement.dataset.lightPrecompileState = "fallback";
          console.debug("3D first-light precompile skipped", localValue3);
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
        if (!renderer || !previewScene2 || !camera2 || !worldGroup || stageSession || document.hidden || previewOrbitLocked || isLeavingStudio || isBakingLightCache) {
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
          renderer.compile(previewScene2, camera2);
          active.forEach(argPrimary => O0.add(argPrimary));
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
      const has4 = new Set(pendingRebuildReasons);
      pendingRebuildReasons.clear();
      const preserveLightCache = !Ka;
      Ka = false;
      if (getPreviewFloorMode2() === "all" || has4.has("all") || !floorScene2.walls.length) {
        rebuildWorldPreview2({
          preserveLightCache
        });
      } else {
        if (has4.has("items")) {
          rebuildPreviewLightMeshes({
            preserveLightCache
          });
        }
        if (has4.has("lights")) {
          rebuildPreviewLightMeshes2({
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
  if (floorScene2.walls.length) {
    return modelBounds({
      background: null,
      walls: floorScene2.walls,
      items: []
    });
  } else if (floorScene2.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorScene2.items
    });
  } else {
    return modelBounds(floorScene2);
  }
}
function extrudeWallSegmentShape(wall, wall2, argTertiary, argN4, wall3 = {}) {
  const worldPoint = argN4(wall.start);
  const worldPoint2 = argN4(wall.end);
  const value = worldPoint2.x - worldPoint.x;
  const wallSegmentDeltaZ = worldPoint2.z - worldPoint.z;
  const hypot = Math.hypot(value, wallSegmentDeltaZ);
  if (hypot <= 1e-7) {
    return null;
  }
  const planPoint = {
    x: value / hypot,
    y: wallSegmentDeltaZ / hypot
  };
  const planPoint2 = {
    x: -planPoint.y,
    y: planPoint.x
  };
  const wallHalfThickness = wall.thickness / 2;
  const maxValue = wall2.start <= 0.000001 ? wall2.start - Math.max(Number(wall3.start) || 0, 0) : wall2.start;
  const maxValue2 = wall2.end >= hypot - 0.000001 ? wall2.end + Math.max(Number(wall3.end) || 0, 0) : wall2.end;
  const planPoint3 = {
    x: worldPoint.x + planPoint.x * maxValue,
    y: worldPoint.z + planPoint.y * maxValue
  };
  const planPoint4 = {
    x: worldPoint.x + planPoint.x * maxValue2,
    y: worldPoint.z + planPoint.y * maxValue2
  };
  return [{
    x: planPoint3.x + planPoint2.x * wallHalfThickness,
    y: planPoint3.y + planPoint2.y * wallHalfThickness
  }, {
    x: planPoint3.x - planPoint2.x * wallHalfThickness,
    y: planPoint3.y - planPoint2.y * wallHalfThickness
  }, {
    x: planPoint4.x - planPoint2.x * wallHalfThickness,
    y: planPoint4.y - planPoint2.y * wallHalfThickness
  }, {
    x: planPoint4.x + planPoint2.x * wallHalfThickness,
    y: planPoint4.y + planPoint2.y * wallHalfThickness
  }];
}
function polygonCentroid(list, argSecondary) {
  const planPoint = new list();
  argSecondary.forEach((worldPoint, argSecondary2) => {
    if (argSecondary2 === 0) {
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
  for (const loop4 of argPrimary) {
    const area3 = polygonArea(loop4);
    if (area3 > 0) {
      flag.push({
        loop: loop4,
        area: area3,
        holes: []
      });
    } else if (area3 < 0) {
      value.push(loop4);
    }
  }
  if (!flag.length) {
    for (const localValue of value.splice(0)) {
      const loop2 = [...localValue].reverse();
      flag.push({
        loop: loop2,
        area: Math.abs(polygonArea(loop2)),
        holes: []
      });
    }
  }
  for (const localValue of value) {
    const holes2 = flag.filter(loop => pointInPolygon(localValue[0], loop.loop, 0.000001)).sort((area, area2) => area.area - area2.area)[0];
    if (holes2) {
      holes2.holes.push(localValue);
    }
  }
  return flag.map(loop3 => {
    const holes = polygonCentroid(THREE.Shape, loop3.loop);
    for (const localValue of loop3.holes) {
      holes.holes.push(polygonCentroid(THREE.Path, localValue));
    }
    return holes;
  });
}
function createGlassPhysicalMaterial(list, argSecondary, depthWrite = {}) {
  const list2 = argSecondary >= 0.999;
  const alphaWallBand = yt && !list2;
  const material = createWallSideMaterial(THREE, {
    color: list,
    roughness: 0.72,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.82,
    transmission: list2 || alphaWallBand ? 0 : 0.012,
    thickness: 0.1,
    ior: 1.22,
    transparent: !list2,
    opacity: argSecondary,
    depthWrite: depthWrite.depthWrite ?? list2,
    depthFunc: depthWrite.depthFunc ?? (list2 ? THREE.LessEqualDepth : THREE.LessDepth),
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
  return new THREE.MeshStandardMaterial({
    color: topColor.topColor ?? argPrimary,
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
  const validatedUnionPolygonLoops2 = validatedUnionPolygonLoops(list, 0.000001);
  const flag = validatedUnionPolygonLoops2.length > 0;
  const value = splitFloorPolygonsByHoles(flag ? validatedUnionPolygonLoops2 : list);
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
    setWallGradientHeight(THREE, extrudeGeometry, "z", argTertiary, -1, floorScene2.settings.wallHeight);
    if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("shader") && light.polygonOffset !== true) {
      const wallPoints = entry.extractPoints(1);
      setWallCornerDistances(THREE, extrudeGeometry, [wallPoints.shape, ...wallPoints.holes]);
    }
    const invisibleMaterial = createInvisibleBasicMaterial();
    const glassMaterial = createGlassPhysicalMaterial(color, opacity, depthWrite);
    const light2 = new THREE.Mesh(extrudeGeometry, [invisibleMaterial, glassMaterial]);
    light2.userData.hbMergeWallBand = light.polygonOffset !== true && (light.renderOrder ?? 4) === 4;
    light2.userData.reflectionRole = "wall";
    light2.rotation.x = Math.PI / 2;
    light2.position.y = argTertiary;
    const isWallMaterialOpaque = opacity >= 0.999;
    light2.castShadow = light.castShadow === true;
    if (light.lightOccluder) {
      light2.layers.set(HELPER_LAYER);
    }
    light2.receiveShadow = isWallMaterialOpaque;
    light2.renderOrder = light.renderOrder ?? 4;
    worldGroup.add(light2);
  }
}
function addFloorPolygonMeshes(list, argSecondary, flag2, value, depthWrite = {}) {
  if (!list.length) {
    return;
  }
  const validatedUnionPolygonLoops2 = validatedUnionPolygonLoops(list, 0.000001);
  const flag = validatedUnionPolygonLoops2.length > 0;
  const splitFloorPolygonsByHolesResult = splitFloorPolygonsByHoles(flag ? validatedUnionPolygonLoops2 : list);
  const topColor = !flag && value < 0.999 && depthWrite.depthWrite === undefined ? {
    ...depthWrite,
    depthWrite: true,
    depthFunc: THREE.LessDepth
  } : depthWrite;
  for (const entry of splitFloorPolygonsByHolesResult) {
    const shapeGeometry = new THREE.ShapeGeometry(entry, 1);
    const $0_2480 = createFloorStandardMaterial(flag2, value, topColor);
    const light = new THREE.Mesh(shapeGeometry, $0_2480);
    light.rotation.x = Math.PI / 2;
    light.position.y = argSecondary + 0.0005;
    light.castShadow = false;
    light.receiveShadow = false;
    light.renderOrder = depthWrite.renderOrder ?? 4;
    if (isStageEmbed && $0_2480.transparent) {
      $0_2480.forceSinglePass = true;
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
    const computedValue2 = x37.z - x36.z;
    const localValue = Math.hypot(computedValue, computedValue2);
    if (localValue <= 0.001) {
      continue;
    }
    const halfValue = (x36.x + x37.x) / 2;
    const halfValue2 = (x36.z + x37.z) / 2;
    const localValue2 = -Math.atan2(computedValue2, computedValue);
    const localValue3 = new THREE.Matrix4().compose(new THREE.Vector3(halfValue, argTertiary + 0.021, halfValue2), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), localValue2), new THREE.Vector3(1, 1, 1));
    const localValue4 = new THREE.Matrix4().compose(new THREE.Vector3(halfValue, argTertiary + 0.026, halfValue2), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), localValue2), new THREE.Vector3(1, 1, 1));
    value.push(new THREE.BoxGeometry(localValue, 0.042, 0.038).applyMatrix4(localValue3));
    settings.push(new THREE.BoxGeometry(localValue + 0.025, 0.066, 0.078).applyMatrix4(localValue4));
  }
  const conditionalValue = value.length ? mergeGeometries(value) : null;
  const conditionalValue2 = settings.length ? mergeGeometries(settings) : null;
  value.forEach(dispose3 => dispose3.dispose());
  settings.forEach(dispose4 => dispose4.dispose());
  if (conditionalValue) {
    const userData31 = new THREE.Mesh(conditionalValue, new THREE.MeshBasicMaterial({
      color: anchor,
      transparent: true,
      opacity: 0.82,
      toneMapped: false
    }));
    userData31.renderOrder = 3;
    userData31.userData.exportRole = "outline";
    userData31.userData.batchedFloorEdgeCount = argPrimary.length;
    worldGroup.add(userData31);
  }
  if (conditionalValue2) {
    const userData32 = new THREE.Mesh(conditionalValue2, new THREE.MeshBasicMaterial({
      color: anchor,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    }));
    userData32.renderOrder = 2;
    userData32.userData.exportRole = "outline";
    userData32.userData.batchedFloorEdgeCount = argPrimary.length;
    worldGroup.add(userData32);
  }
}
function splitFloorPolygonsByHoles2(argPrimary, argSecondary, argTertiary) {
  if (!Array.isArray(argPrimary) || argPrimary.length < 3) {
    return;
  }
  const list = argPrimary.map(planPoint => ({
    x: planPoint.x,
    y: planPoint.z
  }));
  const localValue = list.map((argPrimary2, argSecondary2) => distance(argPrimary2, list[(argSecondary2 + 1) % list.length]));
  const push19 = [0];
  for (const loop of localValue) {
    push19.push(push19.at(-1) + loop);
  }
  const helperFn = ({
    distance: argPrimary2,
    innerAlpha: argPrimary3,
    outerAlpha: argPrimary4,
    columnStrength: localValue2,
    y: argPrimary5,
    renderOrder
  }) => {
    const localValue3 = addCeilingMeshes(list, argPrimary2);
    const push11 = [];
    const push12 = [];
    const push13 = [];
    const push14 = [];
    for (let zeroValue = 0; zeroValue < list.length; zeroValue += 1) {
      const computedValue = (zeroValue + 1) % list.length;
      const x10 = list[zeroValue];
      const x11 = list[computedValue];
      const x12 = localValue3[zeroValue];
      const x13 = localValue3[computedValue];
      push11.push(x10.x, argPrimary5, x10.y, x12.x, argPrimary5, x12.y, x13.x, argPrimary5, x13.y, x10.x, argPrimary5, x10.y, x13.x, argPrimary5, x13.y, x11.x, argPrimary5, x11.y);
      push12.push(argPrimary3, argPrimary4, argPrimary4, argPrimary3, argPrimary4, argPrimary3);
      push13.push(0, 1, 1, 0, 1, 0);
      const localValue = push19[zeroValue];
      const localValue2 = push19[zeroValue + 1];
      push14.push(localValue, localValue, localValue2, localValue, localValue2, localValue2);
    }
    const glowLineGeometry = new THREE.BufferGeometry();
    glowLineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(push11, 3));
    glowLineGeometry.setAttribute("glowAlpha", new THREE.Float32BufferAttribute(push12, 1));
    glowLineGeometry.setAttribute("glowAcross", new THREE.Float32BufferAttribute(push13, 1));
    glowLineGeometry.setAttribute("glowAlong", new THREE.Float32BufferAttribute(push14, 1));
    glowLineGeometry.computeVertexNormals();
    const renderOrder2 = new THREE.Mesh(glowLineGeometry, new THREE.ShaderMaterial({
      uniforms: {
        glowColor: {
          value: new THREE.Color(argSecondary)
        },
        glowColumnStrength: {
          value: localValue2
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
    renderOrder2.renderOrder = renderOrder;
    worldGroup.add(renderOrder2);
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
  const list2 = list.reduce((list3, argSecondary2) => ({
    x: list3.x + argSecondary2.x / list.length,
    y: list3.y + argSecondary2.y / list.length
  }), {
    x: 0,
    y: 0
  });
  return list.map(item => {
    const computedValue = item.x - list2.x;
    const computedValue2 = item.y - list2.y;
    const localValue = Math.max(Math.hypot(computedValue, computedValue2), 0.000001);
    return {
      x: item.x + computedValue / localValue * argSecondary,
      y: item.y + computedValue2 / localValue * argSecondary
    };
  });
}
function addCeilingMeshesFromPolygons(list, argSecondary) {
  if (!list.length) {
    return;
  }
  const list2 = list.map(worldPoint => {
    const localValue = addCeilingMeshes(worldPoint, 0.028);
    const conditionalValue = polygonArea(localValue) >= 0 ? localValue : [...localValue].reverse();
    return polygonCentroid(THREE.Shape, conditionalValue);
  });
  const forEach5 = list2.map(argPrimary => {
    const rotateX = new THREE.ShapeGeometry(argPrimary, 1);
    rotateX.rotateX(Math.PI / 2);
    rotateX.translate(0, argSecondary, 0);
    return rotateX;
  });
  const localValue2 = mergeGeometries(forEach5);
  forEach5.forEach(spread => spread.dispose());
  if (!localValue2) {
    return;
  }
  const renderOrder3 = new THREE.Mesh(localValue2, new THREE.MeshBasicMaterial({
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
  renderOrder3.renderOrder = 1;
  renderOrder3.userData.batchedWallContactShadowCount = list2.length;
  worldGroup.add(renderOrder3);
}
function createGroundGridHelper(argPrimary, grid, argTertiary) {
  const ppm = Math.max(Math.round(argPrimary / 1.25), 12);
  const material10 = new THREE.GridHelper(argPrimary, ppm, grid.grid, grid.grid);
  const bounds = new THREE.Vector3();
  material10.material.transparent = true;
  material10.material.opacity = 0.24;
  material10.material.depthWrite = false;
  material10.material.toneMapped = false;
  material10.material.onBeforeCompile = uniforms => {
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
    material10.material.userData.depthFadeShader = uniforms;
  };
  material10.onBeforeRender = (argPrimary2, argSecondary, position6) => {
    const uniforms2 = material10.material.userData.depthFadeShader;
    if (!uniforms2) {
      return;
    }
    material10.getWorldPosition(bounds);
    const localValue = Math.max(position6.position.distanceTo(orbitControls?.target || bounds), 1);
    const conditionalValue = position6.isOrthographicCamera ? Math.abs(position6.top - position6.bottom) / Math.max(position6.zoom, 0.001) : localValue * 2 * Math.tan(THREE.MathUtils.degToRad(position6.fov * 0.5));
    const localValue2 = Math.max(Math.hypot(conditionalValue * Math.max(position6.aspect, 0.1), conditionalValue), 2);
    const element = localValue + localValue2 * 0.2;
    uniforms2.uniforms.gridDepthFadeNear.value = element;
    uniforms2.uniforms.gridDepthFadeFar.value = Math.max(element + 1, localValue + localValue2 * 0.85);
  };
  material10.position.y = argTertiary + 0.012;
  material10.renderOrder = 2;
  material10.userData.exportRole = "grid";
  worldGroup.add(material10);
}
function setPreviewFloorMode(argPrimary, argSecondary, length28 = []) {
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
  }].forEach((spread, argSecondary2) => {
    const localValue2 = addCeilingMeshes(localValue, spread.spread).map(door => ({
      x: door.x + spread.offsetX,
      y: door.y + spread.offsetY
    }));
    const conditionalValue = length28.length ? splitFloorPolygonsByHoles(subtractPolygonLoops([localValue2], length28)) : polygonCentroid(THREE.Shape, localValue2);
    const rotation3 = new THREE.Mesh(new THREE.ShapeGeometry(conditionalValue, 1), new THREE.MeshBasicMaterial({
      color: 329482,
      transparent: true,
      opacity: spread.opacity,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      forceSinglePass: isStageEmbed
    }));
    rotation3.rotation.x = Math.PI / 2;
    rotation3.position.y = argSecondary + 0.001 + argSecondary2 * 0.00015;
    rotation3.userData.floorPlanGroundShadow = true;
    rotation3.renderOrder = 1 + argSecondary2;
    worldGroup.add(rotation3);
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
  const localValue2 = Math.max(previewFloorWorldBounds.height / group + 1, 3);
  const localValue3 = -0.008;
  const depth = 0.16;
  const computedValue = localValue3 - depth;
  const computedValue2 = computedValue - 0.035;
  const localValue4 = Math.max(Math.max(localValue, localValue2) * 16, 260);
  const backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(localValue4, localValue4), new THREE.MeshBasicMaterial({
    color: value.ground,
    toneMapped: false
  }));
  backgroundPlane.rotation.x = -Math.PI / 2;
  backgroundPlane.position.y = computedValue2;
  backgroundPlane.receiveShadow = false;
  backgroundPlane.userData.exportRole = "background";
  worldGroup.add(backgroundPlane);
  createGroundGridHelper(localValue4, value, computedValue2);
  const dispose7 = new THREE.MeshStandardMaterial({
    color: value.floor,
    roughness: 0.96,
    metalness: 0,
    emissive: value.floor,
    emissiveIntensity: 0.025
  });
  const length29 = getFloorPolygons(group);
  const length30 = floorScene2.items.filter(type2 => type2.type === "flooropening").map(argPrimary => floorOpeningPolygon(argPrimary, group).map(argPrimary2 => {
    const x14 = toPreviewLocalWallPoint(argPrimary2);
    return {
      x: x14.x,
      y: x14.z
    };
  }));
  const helperFn = argPrimary => {
    setPreviewFloorMode(argPrimary, computedValue2);
    if (floorScene2.settings.floorEdgeVisible !== false) {
      resolvePlanSnap(argPrimary, value.floorEdge, computedValue);
    }
  };
  const helperFn2 = (argPrimary, argSecondary, argTertiary) => {
    const userData24 = new THREE.Mesh(argSecondary, dispose7);
    userData24.rotation.x = argTertiary ? Math.PI / 2 : 0;
    userData24.position.y = argTertiary ? localValue3 : localValue3 - depth / 2;
    userData24.castShadow = false;
    userData24.receiveShadow = true;
    userData24.userData.exportRole = "plan";
    userData24.userData.regionReceiverKind = "floor";
    userData24.userData.regionFloorId = activeFloorId;
    worldGroup.add(userData24);
    if (!length30.length) {
      helperFn(argPrimary);
    }
  };
  if (length30.length) {
    const conditionalValue = length29.length ? length29.map(footprint => footprint.map(argPrimary => {
      const x2 = toPreviewLocalWallPoint(argPrimary);
      return {
        x: x2.x,
        y: x2.z
      };
    })) : [[{
      x: -localValue / 2,
      y: -localValue2 / 2
    }, {
      x: localValue / 2,
      y: -localValue2 / 2
    }, {
      x: localValue / 2,
      y: localValue2 / 2
    }, {
      x: -localValue / 2,
      y: localValue2 / 2
    }]];
    const filter3 = subtractPolygonLoops(conditionalValue, length30);
    const length12 = splitFloorPolygonsByHoles(filter3);
    if (length12.length) {
      helperFn2([], new THREE.ExtrudeGeometry(length12, {
        depth,
        bevelEnabled: false,
        steps: 1
      }), true);
    } else {
      dispose7.dispose();
    }
    for (const map3 of filter3.filter(argPrimary => polygonArea(argPrimary) > 0)) {
      const localValue = map3.map(footprint => ({
        x: footprint.x,
        z: footprint.y
      }));
      setPreviewFloorMode(localValue, computedValue2, length30);
      if (floorScene2.settings.floorEdgeVisible !== false) {
        resolvePlanSnap(localValue, value.floorEdge, computedValue);
      }
    }
  } else if (length29.length) {
    const map4 = length29.map(map2 => map2.map(toPreviewLocalWallPoint));
    const localValue5 = map4.map(forEachItem => {
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
    helperFn2(map4[0], new THREE.ExtrudeGeometry(localValue5, {
      depth,
      bevelEnabled: false,
      steps: 1
    }), true);
    for (const localValue of map4.slice(1)) {
      helperFn(localValue);
    }
  } else {
    const arrayValue = [{
      x: -localValue / 2,
      z: -localValue2 / 2
    }, {
      x: localValue / 2,
      z: -localValue2 / 2
    }, {
      x: localValue / 2,
      z: localValue2 / 2
    }, {
      x: -localValue / 2,
      z: localValue2 / 2
    }];
    helperFn2(arrayValue, new THREE.BoxGeometry(localValue, depth, localValue2), false);
  }
  const arrayValue2 = [...floorScene2.windows, ...floorScene2.doors.map(argPrimary => ({
    ...argPrimary,
    sill: 0
  })), ...floorScene2.railings.map(wallId3 => {
    const height2 = floorScene2.walls.find(item => item.id === wallId3.wallId);
    return {
      ...wallId3,
      sill: 0,
      height: height2?.height || floorScene2.settings.wallHeight
    };
  })];
  const filter6 = [];
  const has16 = new Set();
  const localValue6 = getWallJoinExtensions(group);
  for (const opacity2 of floorScene2.walls) {
    const toFixed2 = opacity2.opacity === null || opacity2.opacity === undefined ? floorScene2.settings.wallOpacity : clamp(finite(opacity2.opacity, floorScene2.settings.wallOpacity), 0, 1);
    for (const bottom4 of wallSolidPieces(opacity2, arrayValue2, group, opacity2.height)) {
      const footprint5 = extrudeWallSegmentShape(opacity2, bottom4, group, toPreviewLocalWallPoint, localValue6[opacity2.id]);
      if (!footprint5) {
        continue;
      }
      const localValue = [canonicalPolygonKey(footprint5, 4), bottom4.bottom.toFixed(5), bottom4.top.toFixed(5), toFixed2.toFixed(4)].join("|");
      if (!has16.has(localValue)) {
        has16.add(localValue);
        filter6.push({
          wallId: opacity2.id,
          footprint: footprint5,
          bottom: bottom4.bottom,
          top: bottom4.top,
          opacity: toFixed2
        });
      }
    }
  }
  const length31 = [...new Set(filter6.flatMap(bottom => [bottom.bottom, bottom.top]).map(toFixed => toFixed.toFixed(6)))].map(Number).sort((argPrimary, argSecondary) => argPrimary - argSecondary);
  addCeilingMeshesFromPolygons(filter6.filter(bottom2 => bottom2.bottom <= 0.000001).map(footprint6 => footprint6.footprint), localValue3 + 0.0025);
  for (let zeroValue = 0; zeroValue < length31.length - 1; zeroValue += 1) {
    const localValue = length31[zeroValue];
    const localValue2 = length31[zeroValue + 1];
    if (localValue2 - localValue <= 0.000001) {
      continue;
    }
    const halfValue = (localValue + localValue2) / 2;
    const filter4 = filter6.filter(bottom3 => halfValue > bottom3.bottom - 0.000001 && halfValue < bottom3.top + 0.000001);
    const has9 = new Map();
    for (const opacity of filter4) {
      const localValue = opacity.opacity.toFixed(4);
      if (!has9.has(localValue)) {
        has9.set(localValue, {
          opacity: opacity.opacity,
          volumes: []
        });
      }
      has9.get(localValue).volumes.push(opacity);
    }
    for (const volumes of has9.values()) {
      addWallMeshBatch(volumes.volumes.map(footprint => footprint.footprint), localValue, localValue2, value.wall, volumes.opacity, {
        castShadow: true,
        lightOccluder: true
      });
      const localValue7 = volumes.volumes.filter(item => Math.abs(item.top - localValue2) <= 0.000001).map(footprint2 => footprint2.footprint);
      addFloorPolygonMeshes(localValue7, localValue2, value.wall, volumes.opacity, {
        topColor: value.wall
      });
    }
    const length13 = filter4.filter(wallId2 => isSelected("wall", wallId2.wallId)).map(footprint4 => footprint4.footprint);
    if (length13.length) {
      addWallMeshBatch(length13, localValue, localValue2, value.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value.accent,
        emissiveIntensity: 0.12,
        renderOrder: 5
      });
      const localValue3 = filter4.filter(wallId => isSelected("wall", wallId.wallId) && Math.abs(wallId.top - localValue2) <= 0.000001).map(footprint3 => footprint3.footprint);
      addFloorPolygonMeshes(localValue3, localValue2, value.accent, 0.28, {
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
  for (const start6 of floorScene2.walls) {
    const computedValue = start6.end.x - start6.start.x;
    const computedValue2 = start6.end.y - start6.start.y;
    const localValue = Math.hypot(computedValue, computedValue2);
    if (!localValue) {
      continue;
    }
    const objectValue = {
      x: computedValue / localValue,
      y: computedValue2 / localValue
    };
    const y3 = -Math.atan2(computedValue2, computedValue);
    for (const sill of floorScene2.windows.filter(wallId4 => wallId4.wallId === start6.id)) {
      const localValue = clampWindowT(start6, sill, group);
      const objectValue = {
        x: start6.start.x + computedValue * localValue,
        y: start6.start.y + computedValue2 * localValue
      };
      const x21 = toPreviewLocalWallPoint(objectValue);
      const position3 = new THREE.Group();
      position3.position.set(x21.x, 0, x21.z);
      position3.rotation.y = y3;
      const localValue2 = Math.min(sill.width, wallLengthMeters(start6, group));
      const localValue3 = Math.min(sill.height, Math.max(start6.height - sill.sill, 0.2));
      const windowParts = windowGeometryParts(localValue2, localValue3, sill.sill, sill.hasDivider !== false);
      if (!windowParts) {
        continue;
      }
      addSharedArchMesh(position3, windowParts.glass, value.glass, {
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
      const objectValue2 = {
        rounded: false,
        metalness: 0.15,
        castShadow: false,
        receiveShadow: false
      };
      addSharedArchMesh(position3, windowParts.frames, conditionalValue, objectValue2);
      position3.userData.optimizationStats = {
        type: windowParts.divided ? "window-divided" : "window-plain",
        before: windowParts.divided ? 6 : 5,
        after: 2
      };
      worldGroup.add(position3);
    }
    for (const width5 of floorScene2.railings.filter(wallId5 => wallId5.wallId === start6.id)) {
      const localValue = clampWindowT(start6, width5, group);
      const objectValue = {
        x: start6.start.x + computedValue * localValue,
        y: start6.start.y + computedValue2 * localValue
      };
      const x22 = toPreviewLocalWallPoint(objectValue);
      const position4 = new THREE.Group();
      position4.position.set(x22.x, 0, x22.z);
      position4.rotation.y = y3;
      const localValue2 = Math.min(width5.width, wallLengthMeters(start6, group));
      const localValue3 = Math.min(width5.height, start6.height);
      const conditionalValue = isSelected("railing", width5.id) ? value.accent : value.frame;
      const localValue4 = Math.min(Math.max(localValue2 * 0.012, 0.028), 0.05);
      const numericValue = 0.08;
      const localValue5 = Math.max(localValue3 - numericValue - localValue4 * 1.4, 0.2);
      addSharedArchMesh(position4, [[Math.max(localValue2 - localValue4 * 2.4, 0.2), localValue5, 0.018, 0, numericValue + localValue5 * 0.5, 0]], value.glass, {
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
      const objectValue2 = {
        rounded: false,
        metalness: 0.58,
        roughness: 0.24,
        castShadow: false,
        receiveShadow: false
      };
      const localValue6 = Math.max(2, Math.min(16, Math.ceil(localValue2 / 1.5) + 1));
      const push7 = [[localValue2, localValue4, 0.055, 0, localValue3, 0]];
      const push8 = [];
      for (let zeroValue = 0; zeroValue < localValue6; zeroValue += 1) {
        const halfValue = -localValue2 / 2 + localValue2 * zeroValue / (localValue6 - 1);
        push7.push([localValue4, localValue3, 0.055, halfValue, localValue3 * 0.5, 0]);
        push8.push([localValue4 * 2, localValue4 * 0.8, 0.08, halfValue, localValue4 * 0.4, 0]);
      }
      addSharedArchMesh(position4, push7, conditionalValue, objectValue2);
      addSharedArchMesh(position4, push8, value.furnitureSoft, objectValue2);
      position4.userData.optimizationStats = {
        type: "glass-railing",
        before: 2 + localValue6 * 2,
        after: 3
      };
      worldGroup.add(position4);
    }
    for (const swing of floorScene2.doors.filter(wallId6 => wallId6.wallId === start6.id)) {
      const localValue = clampWindowT(start6, swing, group);
      const objectValue = {
        x: start6.start.x + computedValue * localValue,
        y: start6.start.y + computedValue2 * localValue
      };
      const x23 = toPreviewLocalWallPoint(objectValue);
      const userData20 = new THREE.Group();
      userData20.position.set(x23.x, 0, x23.z);
      userData20.rotation.y = y3;
      const localValue2 = Math.min(swing.width, wallLengthMeters(start6, group));
      const localValue3 = Math.min(swing.height, start6.height);
      const localValue4 = isSelected("door", swing.id);
      const doorType = swing.doorType || "solid";
      const conditionalValue = localValue4 ? value.accent : value.frame;
      const numericValue = 0.065;
      const objectValue2 = {
        rounded: false,
        metalness: 0.08,
        castShadow: false,
        receiveShadow: false
      };
      const push9 = [[numericValue, localValue3, 0.09, -localValue2 / 2, localValue3 / 2, 0], [numericValue, localValue3, 0.09, localValue2 / 2, localValue3 / 2, 0], [localValue2 + numericValue, numericValue, 0.09, 0, localValue3, 0]];
      if (doorType === "roller-shutter") {
        const conditionalValue2 = swing.swing === -1 ? -1 : 1;
        push9.push([localValue2 + numericValue * 0.6, numericValue * 1.8, 0.13, 0, localValue3 - numericValue * 0.35, conditionalValue2 * 0.04]);
      }
      addSharedArchMesh(userData20, push9, conditionalValue, objectValue2);
      if (doorType === "frame-only") {
        userData20.userData.optimizationStats = {
          type: "door-frame-only",
          before: 3,
          after: 1
        };
        worldGroup.add(userData20);
        continue;
      }
      if (doorType === "sliding-glass") {
        const height3 = Math.max(localValue3 - numericValue * 0.85, 0.4);
        const width = Math.max(localValue2 * 0.54, 0.28);
        const conditionalValue2 = swing.hinge === "right" ? 1 : -1;
        const moving = slidingDoorPanelCenters(localValue2, conditionalValue2);
        stairRiserMaterialOptions(userData20, [{
          width,
          height: height3,
          centerX: moving.fixed,
          centerZ: -0.024
        }, {
          width,
          height: height3,
          centerX: moving.moving,
          centerZ: 0.024
        }], conditionalValue, value.glass);
        const scaledWidth = moving.moving - conditionalValue2 * width * 0.36;
        addSharedArchMesh(userData20, [[0.026, 0.15, 0.055, scaledWidth, localValue3 * 0.52, -0.052], [0.026, 0.15, 0.055, scaledWidth, localValue3 * 0.52, 0.052]], value.furnitureDark, {
          rounded: false,
          metalness: 0.5,
          castShadow: false,
          receiveShadow: false
        });
        userData20.userData.optimizationStats = {
          type: "door-sliding-glass",
          before: 15,
          after: 5
        };
        worldGroup.add(userData20);
        continue;
      }
      if (doorType === "roller-shutter") {
        const localValue5 = Math.max(localValue2 - numericValue * 1.3, 0.4);
        const localValue6 = Math.max(localValue3 - numericValue * 0.85, 0.8);
        const conditionalValue2 = swing.swing === -1 ? -1 : 1;
        addSharedArchMesh(userData20, [[localValue5, localValue6, 0.045, 0, localValue6 * 0.5, conditionalValue2 * 0.04]], localValue4 ? value.accent : value.furnitureSoft, {
          rounded: false,
          metalness: 0.36,
          roughness: 0.42,
          castShadow: false,
          receiveShadow: false
        });
        const localValue7 = Math.max(5, Math.min(36, Math.round(localValue6 / 0.12)));
        const push2 = [];
        for (let oneValue = 1; oneValue < localValue7; oneValue += 1) {
          const computedValue = localValue6 * oneValue / localValue7;
          push2.push([localValue5 * 0.98, 0.012, 0.052, 0, computedValue, conditionalValue2 * 0.052]);
        }
        addSharedArchMesh(userData20, push2, value.furnitureDark, {
          rounded: false,
          metalness: 0.42,
          roughness: 0.34,
          castShadow: false,
          receiveShadow: false
        });
        userData20.userData.optimizationStats = {
          type: "door-roller-shutter",
          before: 5 + localValue7,
          after: 3
        };
        worldGroup.add(userData20);
        continue;
      }
      if (doorType === "entry") {
        const localValue5 = Math.max(localValue2 - numericValue * 1.5, 0.4);
        const localValue6 = Math.max(localValue3 - numericValue * 0.85, 0.8);
        const conditionalValue2 = localValue4 ? value.accent : value.furnitureDark;
        addSharedArchMesh(userData20, [[localValue5, localValue6, 0.065, 0, localValue6 * 0.5, 0]], conditionalValue2, {
          rounded: false,
          roughness: 0.58,
          metalness: 0.1,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData20, [[localValue5 * 0.76, 0.022, 0.078, 0, localValue3 * 0.68, 0.012], [localValue5 * 0.76, 0.022, 0.078, 0, localValue3 * 0.34, 0.012]], value.furnitureSoft, {
          rounded: false,
          roughness: 0.5,
          castShadow: false,
          receiveShadow: false
        });
        const conditionalValue3 = swing.hinge === "right" ? -localValue5 * 0.34 : localValue5 * 0.34;
        addSharedArchMesh(userData20, [[0.035, 0.18, 0.085, conditionalValue3, localValue3 * 0.5, 0.055]], value.furnitureLight, {
          rounded: false,
          metalness: 0.58,
          roughness: 0.24,
          castShadow: false,
          receiveShadow: false
        });
        userData20.userData.optimizationStats = {
          type: "door-entry",
          before: 7,
          after: 4
        };
        worldGroup.add(userData20);
        continue;
      }
      if (doorType === "double") {
        const width2 = Math.max((localValue2 - numericValue * 1.8) / 2, 0.25);
        const height4 = Math.max(localValue3 - numericValue * 0.8, 0.4);
        const comparisonFlag = (swing.swing === -1 ? 1 : -1) * Math.PI * 0.42;
        const push3 = [];
        const push4 = [];
        for (const localValue of [-1, 1]) {
          const halfValue = localValue * (localValue2 / 2 - numericValue * 0.5);
          const rotationY = localValue < 0 ? comparisonFlag : -comparisonFlag;
          const conditionalValue = localValue < 0 ? width2 / 2 : -width2 / 2;
          const x5 = {
            x: halfValue + conditionalValue * Math.cos(rotationY),
            z: -conditionalValue * Math.sin(rotationY)
          };
          push3.push({
            width: width2,
            height: height4,
            depth: 0.04,
            x: x5.x,
            y: height4 / 2,
            z: x5.z,
            rotationY
          });
          const conditionalValue2 = localValue < 0 ? width2 * 0.42 : -width2 * 0.42;
          push4.push({
            width: 0.035,
            height: 0.055,
            depth: 0.065,
            x: halfValue + conditionalValue2 * Math.cos(rotationY) + Math.sin(rotationY) * 0.04,
            y: localValue3 * 0.5,
            z: -conditionalValue2 * Math.sin(rotationY) + Math.cos(rotationY) * 0.04,
            rotationY
          });
        }
        addSharedArchMesh(userData20, push3, localValue4 ? value.accent : value.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData20, push4, value.furnitureDark, {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false
        });
        userData20.userData.optimizationStats = {
          type: "door-double",
          before: 7,
          after: 3
        };
        worldGroup.add(userData20);
        continue;
      }
      const hingeSign = swing.hinge === "right";
      const width4 = Math.max(localValue2 - numericValue * 1.4, 0.2);
      const height6 = Math.max(localValue3 - numericValue * 0.8, 0.4);
      const position5 = new THREE.Group();
      position5.position.x = hingeSign ? localValue2 / 2 - numericValue * 0.5 : -localValue2 / 2 + numericValue * 0.5;
      position5.rotation.y = doorLeafRotation(swing, Math.PI * 0.42);
      userData20.add(position5);
      const centerX = hingeSign ? -width4 / 2 : width4 / 2;
      if (doorType === "glass") {
        stairRiserMaterialOptions(position5, [{
          width: width4,
          height: height6,
          centerX,
          centerZ: 0
        }], conditionalValue, value.glass);
      } else {
        addSharedArchMesh(position5, [[width4, height6, 0.04, centerX, height6 / 2, 0]], localValue4 ? value.accent : value.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false
        });
      }
      const conditionalValue4 = hingeSign ? -width4 * 0.42 : width4 * 0.42;
      addSharedArchMesh(position5, [[0.035, 0.055, 0.065, conditionalValue4, localValue3 * 0.5, 0.04]], value.furnitureDark, {
        rounded: false,
        metalness: 0.45,
        castShadow: false,
        receiveShadow: false
      });
      userData20.userData.optimizationStats = {
        type: doorType === "glass" ? "door-glass" : "door-solid",
        before: doorType === "glass" ? 9 : 5,
        after: doorType === "glass" ? 4 : 3
      };
      worldGroup.add(userData20);
    }
  }
  const localValue7 = shadowCastingLightIdSet();
  const push20 = [];
  for (const type16 of floorScene2.items) {
    const x38 = toPreviewLocalWallPoint(type16);
    if (type16.type === "flooropening") {
      continue;
    }
    const userData33 = buildStudioItemMeshGroup(type16, localValue7);
    if (yt && type16.type === "smallcar") {
      userData33.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type16.type)) {
      userData33.userData.environmentModelId = type16.id;
      userData33.userData.environmentModelType = type16.type;
      userData33.userData.environmentFloorId = activeFloorId;
    }
    userData33.position.set(x38.x, type16.elevation || 0, x38.z);
    instanceMergeIdenticalItems(userData33, type16);
    userData33.userData.modelLayer = lightItemTypes2.has(type16.type) ? "lights" : "items";
    userData33.userData.exportRole = type16.type === "planlabel" ? "label" : "plan";
    worldGroup.add(userData33);
    if (!lightItemTypes2.has(type16.type)) {
      push20.push({
        item: type16,
        group: userData33
      });
    }
  }
  mergeStaticItemInstanceBatches(worldGroup, push20);
  if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("merge")) {
    mergeWallBands(THREE, worldGroup, mergeGeometries);
  }
  if (isStageEmbed && new URLSearchParams(window.location.search).get("furniture-runtime") === "compact") {
    compactRuntimeFurniture(worldGroup, push20.filter(({
      item: id2
    }) => !isSelected("item", id2.id)), {
      THREE,
      mergeGeometries,
      materialKey: createGlassMaterial
    });
  }
  buildCanvasPathFromPoints(worldGroup, push20);
  worldGroup.traverse(userData25 => {
    if (userData25 !== worldGroup && !userData25.userData.exportRole) {
      userData25.userData.exportRole = "plan";
    }
  });
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache
  });
  if (isStageEmbed) {
    cacheObjectTransforms(worldGroup, THREE.Object3D);
  }
}
function getPreviewFloorMode2() {
  if (projectDoc2?.previewFloorMode === "all" && projectDoc2.floors.length > 1) {
    return "all";
  } else {
    return "active";
  }
}
function syncPreviewFloorButtons() {
  const value = getPreviewFloorMode2();
  const view = (projectDoc2?.floors.length || 0) > 1;
  for (const entry of r0) {
    const comparisonFlag = entry.dataset.previewFloor === value;
    entry.classList.toggle("active", comparisonFlag);
    entry.setAttribute("aria-pressed", String(comparisonFlag));
    entry.disabled = entry.dataset.previewFloor === "all" && !view;
  }
}
function setPreviewFloorMode2(floorEntry, {
  persist: preserveLightCache = true
} = {}) {
  if (projectDoc2) {
    projectDoc2.previewFloorMode = floorEntry === "all" && projectDoc2.floors.length > 1 ? "all" : "active";
    syncPreviewFloorButtons();
    syncFloorCameraChrome();
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false
    });
    Promise.allSettled(loadVisibleExternalModels());
    rebuildWorldPreview2();
    applyCameraView2();
    if (preserveLightCache) {
      scheduleSave();
    }
  }
}
function rebuildWorldPreview2({
  preserveLightCache: preserveLightCache4 = false
} = {}) {
  if (!worldGroup) {
    return;
  }
  if (getPreviewFloorMode2() !== "all") {
    rebuildWorldPreview({
      preserveLightCache: preserveLightCache4
    });
    flushPlanZoomFrame();
    return;
  }
  const object3d = worldGroup;
  const value = floorScene2;
  const savedActiveFloorId = activeFloorId;
  const savedOrbitLookAt = Lo;
  applyPreviewEnvironment();
  clearWorldGroupChildren();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache4
  });
  const someVar = [...projectDoc2.floors].sort((elevation, elevation2) => elevation.elevation - elevation2.elevation);
  const conditionalValue = stageSession ? finite(projectDoc2.exportFloorGap, 3) : finite(projectDoc2.previewFloorGap, 3);
  someVar.forEach((wall2, argSecondary) => {
    const name4 = new THREE.Group();
    name4.name = "floor-" + wall2.id;
    name4.userData.floorId = wall2.id;
    worldGroup = name4;
    floorScene2 = wall2.scene;
    activeFloorId = wall2.id;
    Lo = {
      x: finite(wall2.originX, 0),
      y: finite(wall2.originY, 0)
    };
    rebuildWorldPreview({
      preserveLightCache: preserveLightCache4
    });
    if (argSecondary > 0) {
      for (const userData9 of [...name4.children]) {
        if (["background", "grid"].includes(userData9.userData?.exportRole)) {
          if (isStageEmbed) {
            userData9.userData.floorBackgroundHidden = true;
            userData9.visible = false;
            continue;
          }
          name4.remove(userData9);
          disposeObject3dResources(userData9);
        }
      }
    }
    name4.position.set(finite(wall2.offsetX, 0), argSecondary * conditionalValue, finite(wall2.offsetZ, 0));
    name4.rotation.y = -THREE.MathUtils.degToRad(finite(wall2.rotation, 0));
    object3d.add(name4);
  });
  worldGroup = object3d;
  floorScene2 = value;
  activeFloorId = savedActiveFloorId;
  Lo = savedOrbitLookAt;
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache4
  });
  flushPlanZoomFrame();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache4
  });
}
function removeWorldModelLayer(argPrimary) {
  if (!argPrimary.size || !worldGroup) {
    return;
  }
  if (getPreviewFloorMode2() !== "all") {
    if (argPrimary.has(activeFloorId)) {
      rebuildWorldPreview2();
    }
    return;
  }
  const childNodes = worldGroup;
  const localValue = floorScene2;
  const localValue2 = activeFloorId;
  const localValue3 = Lo;
  const someFlag = [...projectDoc2.floors].sort((elevation9, elevation10) => elevation9.elevation - elevation10.elevation);
  if (someFlag.some(kind => !childNodes.children.some(userData14 => userData14.userData?.floorId === kind.id))) {
    rebuildWorldPreview2();
    return;
  }
  try {
    for (const [localValue, id2] of someFlag.entries()) {
      if (argPrimary.has(id2.id) && (worldGroup = childNodes.children.find(userData5 => userData5.userData?.floorId === id2.id), floorScene2 = id2.scene, activeFloorId = id2.id, Lo = {
        x: finite(id2.originX, 0),
        y: finite(id2.originY, 0)
      }, worldGroup.position.set(finite(id2.offsetX, 0), localValue * projectDoc2.previewFloorGap, finite(id2.offsetZ, 0)), worldGroup.rotation.set(0, -THREE.MathUtils.degToRad(finite(id2.rotation, 0)), 0), worldGroup.scale.set(1, 1, 1), rebuildWorldPreview(), localValue > 0)) {
        for (const userData10 of [...worldGroup.children]) {
          if (["background", "grid"].includes(userData10.userData?.exportRole)) {
            if (isStageEmbed) {
              userData10.userData.floorBackgroundHidden = true;
              userData10.visible = false;
              continue;
            }
            worldGroup.remove(userData10);
            disposeObject3dResources(userData10);
          }
        }
      }
    }
  } finally {
    worldGroup = childNodes;
    floorScene2 = localValue;
    activeFloorId = localValue2;
    Lo = localValue3;
  }
  syncSpotShadowCastingLights(childNodes);
  flushPlanZoomFrame();
}
function flushPlanPanFrame() {
  const event = pixelsPerMeter();
  if (!event) {
    return null;
  }
  const minX4 = getPreviewFloorMode();
  const halfValue = (minX4.minX + minX4.maxX) / 2;
  const halfValue2 = (minX4.minY + minX4.maxY) / 2;
  return {
    ppm: event,
    floorSurfaceY: -0.008,
    floorPolygons: getFloorPolygons(event),
    toWorld: el => ({
      x: (el.x - halfValue) / event,
      z: (el.y - halfValue2) / event
    })
  };
}
function rebuildPreviewItemMeshes(argPrimary) {
  if (worldGroup) {
    for (const userData26 of [...worldGroup.children]) {
      if (userData26.userData.modelLayer === argPrimary) {
        worldGroup.remove(userData26);
        disposeObject3dResources(userData26);
      }
    }
  }
}
function rebuildPreviewAfterPlanChange(argPrimary, {
  preserveLightCache: preserveLightCache5 = false
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
  const push21 = [];
  for (const type17 of floorScene2.items) {
    if (lightItemTypes2.has(type17.type) !== comparisonFlag) {
      continue;
    }
    const x39 = toWorld.toWorld(type17);
    if (type17.type === "flooropening") {
      continue;
    }
    const userData34 = buildStudioItemMeshGroup(type17, conditionalValue);
    if (yt && type17.type === "smallcar") {
      userData34.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type17.type)) {
      userData34.userData.environmentModelId = type17.id;
      userData34.userData.environmentModelType = type17.type;
      userData34.userData.environmentFloorId = activeFloorId;
    }
    userData34.position.set(x39.x, type17.elevation || 0, x39.z);
    instanceMergeIdenticalItems(userData34, type17);
    userData34.userData.modelLayer = argPrimary;
    worldGroup.add(userData34);
    if (!comparisonFlag) {
      push21.push({
        item: type17,
        group: userData34
      });
    }
  }
  if (!comparisonFlag) {
    mergeStaticItemInstanceBatches(worldGroup, push21);
    if (isStageEmbed && new URLSearchParams(window.location.search).get("furniture-runtime") === "compact") {
      compactRuntimeFurniture(worldGroup, push21.filter(({
        item: id2
      }) => !isSelected("item", id2.id)), {
        THREE,
        mergeGeometries,
        materialKey: createGlassMaterial
      });
    }
    buildCanvasPathFromPoints(worldGroup, push21);
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache5
  });
  if (isStageEmbed) {
    cacheObjectTransforms(worldGroup, THREE.Object3D);
  }
  if (comparisonFlag) {
    syncOrbitControls();
  }
  requestRender({
    shadows: !comparisonFlag && !preserveLightCache5,
    preserveLightCache: preserveLightCache5
  });
}
function rebuildPreviewLightMeshes(preserveLightCache = {}) {
  rebuildPreviewAfterPlanChange("items", preserveLightCache);
}
function rebuildPreviewLightMeshes2(options = {}) {
  rebuildPreviewAfterPlanChange("lights", options);
}
function applyCameraView(argPrimary, has17) {
  for (let parent6 = argPrimary; parent6 && parent6 !== worldGroup; parent6 = parent6.parent) {
    if (has17.has(parent6.userData?.modelLayer)) {
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
  worldGroup.traverse(geometry5 => {
    if (!!geometry5.isMesh && !["background", "grid", "light-source-preview"].includes(geometry5.userData?.exportRole) && (!options || !applyCameraView(geometry5, options))) {
      if (geometry5.isInstancedMesh) {
        geometry5.computeBoundingBox();
        if (geometry5.boundingBox) {
          value.union(geometry5.boundingBox.clone().applyMatrix4(geometry5.matrixWorld));
        }
        return;
      }
      geometry5.geometry.computeBoundingBox();
      if (geometry5.geometry.boundingBox) {
        value.union(geometry5.geometry.boundingBox.clone().applyMatrix4(geometry5.matrixWorld));
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
  const localValue2 = new THREE.Vector3().setFromMatrixPosition(previewSpotLight.target.matrixWorld);
  flag.position.copy(localValue);
  flag.lookAt(localValue2);
  flag.updateMatrixWorld(true);
  const x47 = new THREE.Vector3(Infinity, Infinity, Infinity);
  const x48 = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const localValue3 of [argPrimary.min.x, argPrimary.max.x]) {
    for (const localValue of [argPrimary.min.y, argPrimary.max.y]) {
      for (const localValue of [argPrimary.min.z, argPrimary.max.z]) {
        const localValue2 = new THREE.Vector3(localValue3, localValue, localValue).applyMatrix4(flag.matrixWorldInverse);
        x47.min(localValue2);
        x48.max(localValue2);
      }
    }
  }
  const localValue4 = Math.max(x48.x - x47.x, x48.y - x47.y, 1);
  const localValue5 = Math.max(sofaGeometryCache, localValue4 * 0.05);
  const localValue6 = -x48.z;
  const localValue7 = -x47.z;
  const localValue8 = Math.max(sofaGeometryCache, (localValue7 - localValue6) * 0.08);
  flag.left = x47.x - localValue5;
  flag.right = x48.x + localValue5;
  flag.bottom = x47.y - localValue5;
  flag.top = x48.y + localValue5;
  flag.near = Math.max(0.1, localValue6 - localValue8);
  flag.far = Math.max(flag.near + 1, localValue7 + localValue8);
  flag.updateProjectionMatrix();
  previewSpotLight.shadow.needsUpdate = true;
  return true;
}
function applyCameraView2(forceOrthogonalAxis = {}) {
  if (!camera2 || !orbitControls) {
    return;
  }
  const cameraView4 = forceOrthogonalAxis.view === "top" ? "top" : forceOrthogonalAxis.view === "free" ? "free" : cameraViewMode();
  const currentTopViewRotation = topViewRotation();
  const comparisonFlag = getPreviewFloorMode2() === "all";
  const computedValue = pixelsPerMeter() || 100;
  const width17 = getPreviewFloorMode();
  const isEmpty2 = isWallCloseSnap({
    excludeModelLayers: new Set(["items", "lights"])
  });
  const x49 = comparisonFlag && !isEmpty2.isEmpty() ? isEmpty2.getSize(new THREE.Vector3()) : null;
  const x50 = isEmpty2.isEmpty() ? null : isEmpty2.getCenter(new THREE.Vector3());
  const conditionalValue = comparisonFlag && x49 ? clamp(Math.max(x49.x, x49.z), 5, 100) : clamp(Math.max(width17.width, width17.height) / computedValue, 5, 35);
  const conditionalValue2 = comparisonFlag && x49 ? x49.y : Math.max(0, ...floorScene2.walls.map(height => height.height || 0));
  const frameSize2 = Math.max(conditionalValue * 1.18, conditionalValue + conditionalValue2 * 0.32);
  camera2.userData.frameSize = frameSize2;
  camera2.userData.cameraView = cameraView4;
  camera2.userData.topRotation = currentTopViewRotation;
  const x51 = x50 ? new THREE.Vector3(x50.x, x50.y, x50.z) : new THREE.Vector3(0, Math.min(0.78, conditionalValue * 0.055), 0);
  let localValue;
  if (camera2.isPerspectiveCamera) {
    camera2.aspect = camera2.userData.viewportAspect || 1;
    applyCameraFocalLength();
    const axisLockedPoint2 = frameSize2 / (Math.tan(THREE.MathUtils.degToRad(camera2.getEffectiveFOV()) / 2) * 2);
    localValue = Math.max(axisLockedPoint2 * 1.04, conditionalValue * 1.65, 8);
  } else {
    focusCameraOnPoint(frameSize2, camera2.userData.viewportAspect || 1);
    localValue = Math.max(conditionalValue * 3.2, 18);
  }
  if (cameraView4 === "top") {
    camera2.up.copy(topViewForwardVector(currentTopViewRotation));
    camera2.position.set(x51.x, x51.y + localValue, x51.z);
  } else {
    camera2.up.set(0, 1, 0);
    const localValue2 = new THREE.Vector3(1.08, 1.7, 1.12).normalize();
    camera2.position.copy(x51).addScaledVector(localValue2, localValue);
  }
  getCameraPose(camera2, x51);
  camera2.zoom = 1;
  camera2.lookAt(x51);
  camera2.updateProjectionMatrix();
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
  const snapOrthogonal = floorScene2.settings;
  return snapPoint(event, floorScene2.walls, {
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
function onPlanPointerDown(point4 = at) {
  if (!railingPlacementPreview || Ar < 2 || !point4?.point) {
    return false;
  }
  const visibleScreen = Math.max(1, (pixelsPerMeter() || 100) * 0.01);
  return point4.kind === "endpoint" && distance(point4.point, railingPlacementPreview) <= visibleScreen;
}
function updatePlanStatusChrome(argPrimary = zr) {
  if (!Fi) {
    return;
  }
  no = {
    ...Fi
  };
  const planPoint = pixelsPerMeter() || 100;
  const planPoint2 = Or ? "吸附：临时关闭" : "吸附：关闭";
  if (activeTool === "scale" && wallDrawAnchor2 && argPrimary) {
    const point2 = axisLockedPoint(Fi, wallDrawAnchor2);
    no = point2.point;
    at = null;
    No.textContent = "吸附：" + point2.label;
  } else if (activeTool === "scale") {
    at = null;
    No.textContent = "吸附：自由";
  }
  referencePixels.textContent = "X " + (no.x / planPoint).toFixed(2) + " m · Y " + (no.y / planPoint).toFixed(2) + " m";
  if (activeTool === "wall") {
    at = onPlanPointerMove(Fi, Tt, argPrimary);
    No.textContent = onPlanPointerDown(at) ? "闭合：点击闭合空间" : at.kind ? (!isSnapActive() && argPrimary ? "锁定" : "吸附") + "：" + at.label : isSnapActive() ? "吸附：自由" : planPoint2;
  } else if (["window", "door", "railing"].includes(activeTool)) {
    const wall = nearestWall(no, floorScene2.walls, 16 / planView.zoom);
    if (wall) {
      const width3 = yo[wallDrawAnchor] || yo.solid;
      const objectValue = {
        width: activeTool === "door" ? width3.width : activeTool === "railing" ? 2 : 1.4,
        t: wall.t
      };
      const objectValue2 = {
        wall: wall.wall,
        t: clampWindowT(wall.wall, objectValue, planPoint)
      };
      Uo = activeTool === "window" ? objectValue2 : null;
      railingPlacementPreview2 = activeTool === "door" ? objectValue2 : null;
      Ko = activeTool === "railing" ? objectValue2 : null;
      No.textContent = activeTool === "door" ? "吸附：墙体门洞" : activeTool === "railing" ? "吸附：墙体栏杆" : "吸附：墙体";
    } else {
      Uo = null;
      railingPlacementPreview2 = null;
      Ko = null;
      No.textContent = "吸附：未找到墙体";
    }
  } else if (activeTool !== "scale") {
    at = null;
    Uo = null;
    railingPlacementPreview2 = null;
    Ko = null;
    No.textContent = isSnapActive() ? "吸附：开启" : planPoint2;
    const type9 = beginItemDrag(no);
    planCanvas2.style.cursor = type9?.type === "rotate-item" ? "grab" : type9?.type === "resize-item" ? "nwse-resize" : "";
  }
}
function beginPlanPan(event) {
  zr = event.shiftKey;
  Fi = screenToPlanWithView(pointerEventToCanvasPoint(event));
  updatePlanStatusChrome();
}
function handlePlanPointerDown(pointerId8) {
  if (pointerId8.button !== 0 && pointerId8.button !== 1) {
    return;
  }
  planCanvas2.focus({
    preventScroll: true
  });
  const visibleScreen = pointerEventToCanvasPoint(pointerId8);
  const start8 = screenToPlanWithView(visibleScreen);
  if (pointerId8.button === 1 || saveConflictState) {
    pointerId8.preventDefault();
    markLeavingStudio();
    dragState = {
      type: "pan",
      pointerId: pointerId8.pointerId,
      screen: screenToPlan(visibleScreen),
      visibleScreen,
      offsetX: planView.offsetX,
      offsetY: planView.offsetY
    };
    planCanvas2.classList.add("panning");
    ensureMeasureCanvas();
    planCanvas2.setPointerCapture(pointerId8.pointerId);
    return;
  }
  if (alignSession && handleAlignFloorClick(start8)) {
    return;
  }
  if (activeTool === "flooropening") {
    if (!requireCalibration()) {
      return;
    }
    pointerId8.preventDefault();
    markLeavingStudio();
    dragState = {
      type: "draw-flooropening",
      pointerId: pointerId8.pointerId,
      start: start8,
      current: start8
    };
    planCanvas2.setPointerCapture(pointerId8.pointerId);
    return;
  }
  if (activeTool === "scale") {
    if (!wallDrawAnchor2) {
      wallDrawAnchor2 = start8;
      drawPlan();
      return;
    }
    const end = pointerId8.shiftKey ? axisLockedPoint(start8, wallDrawAnchor2).point : start8;
    if (distance(wallDrawAnchor2, end) < 12 / planView.zoom) {
      showToast("参考线太短，请重新选择终点。", "error");
      return;
    }
    shiftKeyHeld = {
      start: wallDrawAnchor2,
      end
    };
    wallDrawAnchor2 = null;
    applyLightPropertyEls.textContent = Math.round(distance(shiftKeyHeld.start, shiftKeyHeld.end)) + " px";
    toast.value = floorScene2.calibration?.reference?.meters || 3;
    lightPropertyApplyTitle.showModal();
    requestAnimationFrame(() => toast.select());
    drawPlan();
    return;
  }
  if (activeTool === "wall") {
    if (!requireCalibration()) {
      return;
    }
    const point3 = onPlanPointerMove(start8, Tt, pointerId8.shiftKey);
    if (!Tt) {
      Tt = {
        ...point3.point
      };
      railingPlacementPreview = {
        ...point3.point
      };
      Ar = 0;
      yr.hidden = false;
      drawPlan();
      return;
    }
    if (distance(Tt, point3.point) < pixelsPerMeter() * 0.08) {
      showToast("墙段太短，请选择更远的终点。", "error");
      return;
    }
    const start5 = {
      id: makeId("wall"),
      start: {
        ...Tt
      },
      end: {
        ...point3.point
      },
      height: floorScene2.settings.wallHeight,
      thickness: floorScene2.settings.wallThickness
    };
    const pixelsPerMeterValue = Math.max(0.75, pixelsPerMeter() * 0.01);
    const length14 = uncoveredCollinearWallSegments(start5, floorScene2.walls, pixelsPerMeterValue);
    if (!length14.length) {
      Tt = {
        ...point3.point
      };
      showToast("该位置已有墙体，已跳过重复墙段。");
      drawPlan();
      return;
    }
    const comparisonFlag = length14.length !== 1 || distance(length14[0].start, start5.start) > pixelsPerMeterValue || distance(length14[0].end, start5.end) > pixelsPerMeterValue;
    pushHistory();
    const pixelsPerMeterValue2 = Math.max(1, pixelsPerMeter() * 0.01);
    const lengthValue = closedWallPolygons(floorScene2.walls, pixelsPerMeterValue2).length;
    const localValue = length14.map((start, argSecondary) => ({
      ...start5,
      id: argSecondary === 0 ? start5.id : makeId("wall"),
      start: start.start,
      end: start.end
    }));
    floorScene2.walls.push(...localValue);
    cachedWallOpenings();
    Ar += 1;
    const element2 = closedWallPolygons(floorScene2.walls, pixelsPerMeterValue2).length > lengthValue;
    if (element2) {
      resetWallDrawing2();
    } else {
      Tt = {
        ...point3.point
      };
    }
    setSelection("wall", localValue[0].id);
    yr.hidden = element2;
    refreshViews();
    scheduleSave();
    if (element2) {
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
    const wall2 = nearestWall(start8, floorScene2.walls, 18 / planView.zoom);
    if (!wall2) {
      showToast("请靠近一段墙体放置窗户。", "error");
      return;
    }
    pushHistory();
    const t3 = {
      id: makeId("window"),
      wallId: wall2.wall.id,
      t: wall2.t,
      width: 1.4,
      height: 1.35,
      sill: 0.85
    };
    t3.t = clampWindowT(wall2.wall, t3, pixelsPerMeter());
    floorScene2.windows.push(t3);
    setSelection("window", t3.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "door") {
    if (!requireCalibration()) {
      return;
    }
    const wall3 = nearestWall(start8, floorScene2.walls, 18 / planView.zoom);
    if (!wall3) {
      showToast("请靠近一段墙体放置门。", "error");
      return;
    }
    pushHistory();
    const width10 = yo[wallDrawAnchor] || yo.solid;
    const t4 = {
      id: makeId("door"),
      wallId: wall3.wall.id,
      t: wall3.t,
      width: width10.width,
      height: width10.height,
      sill: 0,
      doorType: wallDrawAnchor,
      hinge: "left",
      swing: 1
    };
    t4.t = clampWindowT(wall3.wall, t4, pixelsPerMeter());
    floorScene2.doors.push(t4);
    setSelection("door", t4.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "railing") {
    if (!requireCalibration()) {
      return;
    }
    const wall4 = nearestWall(start8, floorScene2.walls, 18 / planView.zoom);
    if (!wall4) {
      showToast("请靠近一段墙体放置栏杆。", "error");
      return;
    }
    pushHistory();
    const t5 = {
      id: makeId("railing"),
      wallId: wall4.wall.id,
      t: wall4.t,
      width: 2,
      height: 1.1,
      sill: 0
    };
    t5.t = clampWindowT(wall4.wall, t5, pixelsPerMeter());
    floorScene2.railings.push(t5);
    setSelection("railing", t5.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "label") {
    placeCatalogFurnitureItem("planlabel", start8);
    return;
  }
  const corner = beginItemDrag(start8);
  if (corner) {
    markLeavingStudio();
    const originalItem = {
      ...corner.item
    };
    dragState = corner.type === "resize-item" ? {
      type: "resize-item",
      pointerId: pointerId8.pointerId,
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
      pointerId: pointerId8.pointerId,
      originalItem,
      center: {
        x: originalItem.x,
        y: originalItem.y
      },
      startPointer: {
        ...start8
      },
      before: cloneFloorScene(),
      moved: false
    };
    planCanvas2.setPointerCapture(pointerId8.pointerId);
    return;
  }
  const localValue2 = activeSelectionLightGroupFilter();
  const kind4 = placeCatalogItemAt(start8);
  if (!kind4) {
    markLeavingStudio();
    if (!pointerId8.shiftKey) {
      clearSelection();
    }
    dragState = {
      type: "marquee",
      pointerId: pointerId8.pointerId,
      start: start8,
      current: start8,
      additive: pointerId8.shiftKey,
      moved: false
    };
    updateSelectionInspector();
    drawPlan();
    ensureMeasureCanvas();
    if (!pointerId8.shiftKey) {
      rebuildPreviewForAssetFilters(localValue2);
    }
    planCanvas2.setPointerCapture(pointerId8.pointerId);
    return;
  }
  markLeavingStudio();
  const before3 = kind4.kind === "item" ? cloneFloorScene() : null;
  const comparisonFlag2 = kind4.kind === "item" && multiSelection.length > 0 && isSelected("item", kind4.id);
  let map8 = [];
  let copied = false;
  if (kind4.kind === "item") {
    if (comparisonFlag2) {
      const has6 = new Set(multiSelection.filter(kind => kind.kind === "item").map(named => named.id));
      map8 = floorScene2.items.filter(item => has6.has(item.id));
    } else {
      setSelection("item", kind4.id);
      const localValue = floorScene2.items.find(item => item.id === kind4.id);
      if (localValue) {
        map8 = [localValue];
      }
    }
    if (pointerId8.altKey && map8.length) {
      const length6 = map8.map(argPrimary => ({
        ...structuredClone(argPrimary),
        id: makeId("item")
      }));
      ensureItemLayerNames(length6);
      floorScene2.items.push(...length6);
      map8 = length6;
      if (length6.length === 1) {
        setSelection("item", length6[0].id);
      } else {
        selection = null;
        multiSelection = length6.map(event => ({
          kind: "item",
          id: event.id
        }));
      }
      copied = true;
    }
  } else {
    setSelection(kind4.kind, kind4.id);
  }
  updateSelectionInspector();
  drawPlan();
  rebuildPreviewForAssetFilters(localValue2);
  const localValue3 = activeSelectionAssetCategory();
  const previewScope = localValue2 === localValue3 ? localValue3 : "all";
  if (kind4.kind === "item") {
    dragState = {
      type: "move-items",
      pointerId: pointerId8.pointerId,
      start: start8,
      originals: map8.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y
      })),
      before: before3,
      copied,
      previewScope,
      moved: false
    };
  } else if (["window", "door", "railing"].includes(kind4.kind)) {
    dragState = {
      type: "move-opening",
      pointerId: pointerId8.pointerId,
      start: start8,
      before: cloneFloorScene(),
      previewScope: "all",
      moved: false
    };
  }
  if (dragState) {
    planCanvas2.setPointerCapture(pointerId8.pointerId);
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
        const computedValue2 = x53.y - dragState.start.y;
        const localValue = Math.max(Math.abs(computedValue), Math.abs(computedValue2));
        return {
          x: dragState.start.x + Math.sign(computedValue || 1) * localValue,
          y: dragState.start.y + Math.sign(computedValue2 || 1) * localValue
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
      const comparisonFlag = isSnapActive() && floorScene2.settings.snapGrid !== false;
      let computedValue2 = x53.x - dragState.start.x;
      let computedValue3 = x53.y - dragState.start.y;
      if (event.shiftKey) {
        if (Math.abs(computedValue2) >= Math.abs(computedValue3)) {
          computedValue3 = 0;
        } else {
          computedValue2 = 0;
        }
      }
      const items = new Map(floorScene2.items.map(itemKey => [itemKey.id, itemKey]));
      for (const x16 of dragState.originals) {
        const x15 = items.get(x16.id);
        if (x15) {
          x15.x = comparisonFlag ? Math.round((x16.x + computedValue2) / computedValue) * computedValue : x16.x + computedValue2;
          x15.y = comparisonFlag ? Math.round((x16.y + computedValue3) / computedValue) * computedValue : x16.y + computedValue3;
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
      const start3 = floorScene2.walls.find(item => item.id === t?.wallId);
      if (!t || !start3) {
        return;
      }
      t.t = clampWindowT(start3, {
        ...t,
        t: projectPointToSegment(x53, start3.start, start3.end).t
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
  const localValue2 = exportAspectRatio;
  defaultExportHeight = 1;
  exportAspectRatio = null;
  if (localValue2 && Math.abs(localValue - 1) > 1e-8) {
    zoomPlanViewAt(localValue, localValue2);
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
      planCanvas2.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    scheduleLeaveStudio();
    const computedValue = Math.abs(x41.x - x40.x) / pixelsPerMeter();
    const computedValue2 = Math.abs(x41.y - x40.y) / pixelsPerMeter();
    if (pointerEvent.type !== "pointercancel" && computedValue >= 0.1 && computedValue2 >= 0.1) {
      placeCatalogFurnitureItem("flooropening", {
        x: (x40.x + x41.x) / 2,
        y: (x40.y + x41.y) / 2
      }, {
        width: Math.min(20, computedValue),
        depth: Math.min(20, computedValue2)
      });
    } else {
      drawPlan();
    }
    return;
  }
  if (dragState.type === "marquee") {
    const localValue = activeSelectionLightGroupFilter();
    const conditionalValue = dragState.additive ? [...(selection ? [selection] : []), ...multiSelection] : [];
    const conditionalValue2 = dragState.moved ? marqueeSelectHits(dragState.start, dragState.current) : [];
    const length15 = [...new Map([...conditionalValue, ...conditionalValue2].map(kind2 => [kind2.kind + ":" + kind2.id, kind2])).values()];
    if (length15.length === 1) {
      setSelection(length15[0].kind, length15[0].id);
    } else {
      selection = null;
      multiSelection = length15;
    }
    try {
      planCanvas2.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(localValue);
    scheduleLeaveStudio();
    return;
  }
  const type21 = dragState;
  const computedValue3 = type21.moved || type21.copied;
  if (computedValue3) {
    pushUndoSnapshot(dragState.before);
    scheduleSave();
  }
  if (["move-items", "resize-item", "rotate-item", "move-opening"].includes(type21.type)) {
    updateSelectionInspector();
  }
  if (computedValue3 && type21.type === "move-opening") {
    rebuildPreviewMeshes({
      scope: "all"
    });
  } else if (computedValue3 && ["move-items", "resize-item", "rotate-item"].includes(type21.type)) {
    const localValue = selectedEntity();
    rebuildPreviewMeshes({
      scope: type21.previewScope || (localValue ? itemPreviewScope(localValue) : activeSelectionAssetCategory())
    });
  }
  if (dragState.type === "pan") {
    planCanvas2.classList.remove("panning");
  }
  try {
    planCanvas2.releasePointerCapture(pointerEvent.pointerId);
  } catch {}
  dragState = null;
  if (type21.type === "pan") {
    drawPlan();
  }
  scheduleLeaveStudio();
}
function scheduleClearInspectorHover(pointerId9) {
  onPlanPointerCancel(pointerId9.pointerId);
  setHoveredInspectorTarget(pointerId9);
}
function applyInspectorFields2(argPrimary) {
  const value = selectedEntity();
  if (!value || selection?.kind !== argPrimary) {
    return;
  }
  const activeSelectionLightGroupFilterResult = argPrimary === "item" ? itemPreviewScope(value) : "all";
  pushHistory();
  if (argPrimary === "wall") {
    value.height = clamp(finite(selectEl("#wall-height").value, value.height), 0.01, 6);
    value.thickness = clamp(finite(selectEl("#wall-thickness").value, value.thickness), 0.01, 3);
    value.opacity = selectEl("#wall-opacity-mode").value === "custom" ? clamp(finite(selectEl("#wall-opacity").value, floorScene2.settings.wallOpacity * 100), 0, 100) / 100 : null;
    value.allowOpenEnd = selectEl("#wall-open-end-mode").value === "allowed";
    floorScene2.settings.wallHeight = value.height;
    floorScene2.settings.wallThickness = value.thickness;
  } else if (argPrimary === "window") {
    value.width = clamp(finite(selectEl("#window-width").value, value.width), 0.3, 20);
    value.height = clamp(finite(selectEl("#window-height").value, value.height), 0.3, 20);
    value.sill = clamp(finite(selectEl("#window-sill").value, value.sill), 0, 20);
    value.hasDivider = selectEl("#window-divider").value !== "without";
    const localValue = floorScene2.walls.find(item => item.id === value.wallId);
    if (localValue) {
      value.t = clampWindowT(localValue, value, pixelsPerMeter());
    }
  } else if (argPrimary === "door") {
    value.doorType = Object.hasOwn(yo, selectEl("#door-type").value) ? selectEl("#door-type").value : "solid";
    value.width = clamp(finite(selectEl("#door-width").value, value.width), 0.55, 20);
    value.height = clamp(finite(selectEl("#door-height").value, value.height), 1.8, 20);
    const localValue = floorScene2.walls.find(kind => kind.id === value.wallId);
    if (localValue) {
      value.t = clampWindowT(localValue, value, pixelsPerMeter());
    }
  } else if (argPrimary === "railing") {
    value.width = clamp(finite(selectEl("#railing-width").value, value.width), 0.3, 20);
    value.height = clamp(finite(selectEl("#railing-height").value, value.height), 0.5, 3);
    const localValue = floorScene2.walls.find(floor3 => floor3.id === value.wallId);
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
    if (lightItemTypes2.has(value.type)) {
      const temperature = defaultLightPresets[value.type] || defaultLightPresets.downlight;
      value.verticalRotation = value.type === "striplight" ? normalizeFullRotation(selectEl("#item-vertical-rotation").value, value.verticalRotation || 0) : clamp(finite(selectEl("#item-vertical-rotation").value, value.verticalRotation || 0), -90, 90);
      if (value.type === "striplight") {
        value.stripRollRotation = normalizeFullRotation(itemStripRoll.value, value.stripRollRotation || 0);
        value.lightSourceVisible = zl.checked;
      }
      value.lightGroupId = floorScene2.lightGroups.some(group => group.id === selectEl("#light-group").value) ? selectEl("#light-group").value : ensureDefaultLightGroup().id;
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
function resetWallDrawing2() {
  Tt = null;
  railingPlacementPreview = null;
  Ar = 0;
  yr.hidden = true;
}
function schedulePlanRedraw() {
  resetWallDrawing2();
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
    const get5 = new URLSearchParams(window.location.search);
    const awaitedValue = await studioFetch(isStageEmbed ? "/modules/interaction3d/scenes/" + encodeURIComponent(get5.get("sceneId") || "") + "/current?projectId=" + encodeURIComponent(get5.get("projectId") || "") : "/studio3d");
    floorRenameInput.textContent = "户型图绘制";
    document.title = "户型图绘制";
    await loadProjectDocument(awaitedValue);
    if (isStageEmbed) {
      await new Promise(requestAnimationFrame);
      const {
        mountStage: awaitedValue2
      } = await import("/api/v1/modules/interaction3d/stage.js?v=20260910-health-fixes-v3");
      awaitedValue2(bootstrapStudioFromLoadedProject());
      return;
    }
    setSaveStateLabel("已自动保存", "saved");
    if (autoDiagramComponentId) {
      if (isAutoDiagramEmbed2) {
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
Zd.forEach(addEventListener2 => addEventListener2.addEventListener("click", () => setActiveTool(addEventListener2.dataset.tool)));
yf.addEventListener("click", () => {
  addNewFloor();
});
alignFloor.addEventListener("click", startAlignFloorSession);
previewFloorGapInput.addEventListener("change", commitPreviewFloorGap);
exportFloorGap2.addEventListener("change", commitExportFloorGap);
for (const e of r0) {
  e.addEventListener("click", () => setPreviewFloorMode2(e.dataset.previewFloor));
}
importPlan2.addEventListener("click", () => Ia.click());
Ia.addEventListener("change", async () => {
  await importPlanBackgroundFile(Ia.files?.[0]);
  Ia.value = "";
});
toggleBackground.addEventListener("click", () => {
  if (floorScene2.background) {
    pushHistory();
    floorScene2.settings.backgroundVisible = !floorScene2.settings.backgroundVisible;
    refreshStudioPanels();
    drawPlan();
    scheduleSave();
  }
});
Ud.addEventListener("click", () => {
  if (floorScene2.background) {
    pushHistory();
    floorScene2.background = null;
    planBackgroundImage2 = null;
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
    syncControlValue(globalWallHeight, floorScene2.settings.wallHeight.toFixed(2));
    syncControlValue(globalWallThickness, floorScene2.settings.wallThickness.toFixed(2));
    syncControlValue(globalWallOpacity, Math.round(floorScene2.settings.wallOpacity * 100));
    updateSelectionInspector();
    rebuildPreviewMeshes({
      scope: "all"
    });
    scheduleLeaveStudio();
  }
}
function scheduleClearInspectorHover2(numericParam = 80) {
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = window.setTimeout(commitGlobalWallThickness, numericParam);
}
function commitGlobalWallHeight2() {
  const value = clamp(finite(globalWallHeight.value, floorScene2.settings.wallHeight), 0.01, 6);
  if (!(Math.abs(value - floorScene2.settings.wallHeight) < 1e-8) || !floorScene2.walls.every(height5 => Math.abs(height5.height - value) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallHeight);
    floorScene2.settings.wallHeight = value;
    for (const height7 of floorScene2.walls) {
      height7.height = value;
    }
    scheduleSave();
  }
}
function commitGlobalWallThicknessFromInput() {
  const wallThickness = clamp(finite(globalWallThickness.value, floorScene2.settings.wallThickness), 0.01, 3);
  if (!(Math.abs(wallThickness - floorScene2.settings.wallThickness) < 1e-8) || !floorScene2.walls.every(thickness => Math.abs(thickness.thickness - wallThickness) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallThickness);
    floorScene2.settings.wallThickness = wallThickness;
    for (const thickness2 of floorScene2.walls) {
      thickness2.thickness = wallThickness;
    }
    commitGlobalWallHeight();
    scheduleSave();
  }
}
function commitGlobalWallOpacity() {
  const wallOpacity = clamp(finite(globalWallOpacity.value, floorScene2.settings.wallOpacity * 100), 0, 100) / 100;
  if (!(Math.abs(wallOpacity - floorScene2.settings.wallOpacity) < 1e-8)) {
    beginOrSwitchWallSettingsEdit(globalWallOpacity);
    floorScene2.settings.wallOpacity = wallOpacity;
    scheduleSave();
  }
}
for (const [e, o] of [[globalWallHeight, commitGlobalWallHeight2], [globalWallThickness, commitGlobalWallThicknessFromInput], [globalWallOpacity, commitGlobalWallOpacity]]) {
  e.addEventListener("input", o);
  e.addEventListener("change", () => {
    o();
    scheduleClearInspectorHover2();
  });
  e.addEventListener("blur", () => scheduleClearInspectorHover2(0));
}
toggleFloorEdge.addEventListener("click", () => {
  pushHistory();
  floorScene2.settings.floorEdgeVisible = floorScene2.settings.floorEdgeVisible === false;
  refreshViews();
  scheduleSave();
});
function closeLightGroupRenameDialog() {
  for (const hidden of itemCatalog) {
    hidden.hidden = hidden.dataset.assetHeadingCategory !== assetCategory;
  }
  for (const dataset5 of w0) {
    const localValue = dataset5.dataset.itemType;
    const localValue2 = lightItemTypes2.has(localValue);
    const localValue3 = RESERVED_TEXTURE_UNITS.has(localValue);
    const conditionalValue = assetCategory === "light" ? localValue2 : assetCategory === "appliance" ? localValue3 : !localValue3 && !localValue2;
    dataset5.hidden = !conditionalValue;
  }
}
function setAssetCategoryFilter(argPrimary) {
  const conditionalValue = ["home", "appliance", "light"].includes(argPrimary) ? argPrimary : "home";
  const localValue = activeSelectionLightGroupFilter();
  hideLightGroupContextMenu();
  assetCategory = conditionalValue;
  for (const dataset6 of m0) {
    const comparisonFlag = dataset6.dataset.assetCategory === conditionalValue;
    dataset6.classList.toggle("active", comparisonFlag);
    dataset6.setAttribute("aria-pressed", String(comparisonFlag));
  }
  closeLightGroupRenameDialog();
  lightItemTypes.hidden = conditionalValue === "light";
  stairLikeTypes.hidden = conditionalValue !== "light";
  const type22 = selectedEntity();
  const comparisonFlag = selection?.kind === "item" && type22 && lightItemTypes2.has(type22.type);
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
  const has10 = new Set(floorScene2.lightGroups.map(name2 => name2.name));
  let computedValue = floorScene2.lightGroups.length + 1;
  while (has10.has("灯组 " + computedValue)) {
    computedValue += 1;
  }
  const id2 = {
    id: makeId("light-group"),
    name: "灯组 " + computedValue,
    enabled: true
  };
  floorScene2.lightGroups.push(id2);
  on = id2.id;
  renderLightLayerPanel();
  updateSelectionInspector();
  scheduleSave();
});
fridgeSize.addEventListener("click", () => setAllLightGroupsEnabled(false));
for (const e of lightGroupContextMenu.querySelectorAll("[data-light-group-action]")) {
  e.addEventListener("click", () => {
    const lightGroup = floorScene2.lightGroups.find(item => item.id === lightGroupContextMenuId);
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
    const id2 = projectDoc2.floors.find(item => item.id === contextFloorId);
    const floorAction = e.dataset.floorAction;
    hideFloorContextMenu();
    if (id2) {
      if (floorAction === "rename") {
        openFloorRenameDialog(id2);
      } else if (floorAction === "delete") {
        confirmDeleteFloor(id2);
      }
    }
  });
}
document.addEventListener("pointerdown", target3 => {
  if (!lightGroupContextMenu.hidden && !lightGroupContextMenu.contains(target3.target)) {
    hideLightGroupContextMenu();
  }
  if (!floorContextMenu.hidden && !floorContextMenu.contains(target3.target)) {
    hideFloorContextMenu();
  }
  if (!xr.hidden && !target3.target.closest(".snap-control")) {
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
  const name5 = projectDoc2.floors.find(floor => floor.id === contextFloorId);
  if (!name5) {
    closeLightPropertyApplyDialog();
    return;
  }
  const name6 = uniqueFloorName(normalizeLabelText(floorRenameInput2.value, name5.name, 24), name5.id);
  if (name6 !== name5.name) {
    name5.name = name6;
    renderFloorList();
    renderExportFileChecklist();
    scheduleSave();
    showToast("已重命名为“" + name6 + "”。", "success");
  }
  closeLightPropertyApplyDialog();
});
selectEl("#floor-delete-close").addEventListener("click", closeFloorDeleteDialog);
selectEl("#floor-delete-cancel").addEventListener("click", closeFloorDeleteDialog);
floorDeleteDialog.addEventListener("cancel", preventDefault2 => {
  preventDefault2.preventDefault();
  closeFloorDeleteDialog();
});
activeToolLabel.addEventListener("submit", preventDefault3 => {
  preventDefault3.preventDefault();
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
Tf.addEventListener("submit", camera2 => {
  camera2.preventDefault();
  const isClosest = floorScene2.lightGroups.find(floor2 => floor2.id === _a);
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
  const length32 = buildStageReferenceScene();
  const lengthValue = length32.filter(checked6 => checked6.checked).length;
  windowFields.textContent = lengthValue + "/" + length32.length + " 灯";
  ka.disabled = !length32.length;
  ka.textContent = length32.length && lengthValue === length32.length ? "取消全选" : "全选";
  for (const lightTargetGroupEl of wallFields.querySelectorAll("[data-light-target-group-id]")) {
    const length16 = buildStageReferenceScene(lightTargetGroupEl);
    const lengthValue = length16.filter(checked3 => checked3.checked).length;
    lightTargetGroupEl.querySelector("[data-light-target-group-count]").textContent = lengthValue + "/" + length16.length + " 灯";
    lightTargetGroupEl.querySelector("[data-light-target-group-toggle]").textContent = length16.length && lengthValue === length16.length ? "取消全选" : "全选";
  }
}
function renderLightPropertyTargetList(argPrimary) {
  wallFields.replaceChildren();
  let zeroValue = 0;
  for (const id2 of floorScene2.lightGroups) {
    const length17 = floorScene2.items.filter(type3 => lightItemTypes2.has(type3.type) && type3.lightGroupId === id2.id);
    if (!length17.length) {
      continue;
    }
    zeroValue += length17.length;
    const className2 = document.createElement("section");
    className2.className = "light-property-target-group";
    className2.dataset.lightTargetGroupId = id2.id;
    const append2 = document.createElement("header");
    const textContent3 = document.createElement("strong");
    textContent3.textContent = id2.name;
    const dataset3 = document.createElement("span");
    dataset3.dataset.lightTargetGroupCount = "";
    const type14 = document.createElement("button");
    type14.type = "button";
    type14.dataset.lightTargetGroupToggle = "";
    type14.textContent = "取消全选";
    append2.append(textContent3, dataset3, type14);
    const className3 = document.createElement("div");
    className3.className = "light-property-target-grid";
    const get6 = new Map();
    for (const type12 of length17) {
      get6.set(type12.type, (get6.get(type12.type) || 0) + 1);
    }
    const get7 = new Map();
    for (const type13 of length17) {
      const name3 = furnitureCatalog[type13.type] || furnitureCatalog.downlight;
      const computedValue = (get7.get(type13.type) || 0) + 1;
      get7.set(type13.type, computedValue);
      const className = document.createElement("label");
      className.className = "light-property-target-item";
      const type10 = document.createElement("input");
      type10.type = "checkbox";
      type10.checked = true;
      type10.dataset.lightTargetItemId = type13.id;
      const appendEl = document.createElement("span");
      const itemNameStrongEl = document.createElement("strong");
      itemNameStrongEl.textContent = get6.get(type13.type) > 1 ? name3.name + " " + computedValue : name3.name;
      const textContent2 = document.createElement("small");
      const localValue = clampLightPropertyValue(argPrimary, type13[argPrimary], type13.type);
      textContent2.textContent = (type13.id === selection?.id ? "当前灯 · " : "") + "当前 " + formatLightPropertyValue(argPrimary, localValue);
      appendEl.append(itemNameStrongEl, textContent2);
      className.append(type10, appendEl);
      className3.append(className);
    }
    className2.append(append2, className3);
    wallFields.append(className2);
  }
  if (!zeroValue) {
    const className4 = document.createElement("p");
    className4.className = "light-property-target-empty";
    className4.textContent = "当前没有可应用的灯具。";
    wallFields.append(className4);
  }
  updateStageLightTargetSummary();
}
for (const e of applyLightPropertyEls2) {
  e.addEventListener("click", () => {
    const item = selectedEntity();
    const property = e.dataset.applyLightProperty;
    const propMeta = lightPropertyMeta2[property];
    if (!item || selection?.kind !== "item" || !lightItemTypes2.has(item.type) || !propMeta) {
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
  const length20 = buildStageReferenceScene();
  const element3 = !length20.length || !length20.every(checked2 => checked2.checked);
  for (const checked7 of length20) {
    checked7.checked = element3;
  }
  updateStageLightTargetSummary();
});
wallFields.addEventListener("click", target4 => {
  const groupToggleEl = target4.target.closest("[data-light-target-group-toggle]");
  if (!groupToggleEl) {
    return;
  }
  const localValue = groupToggleEl.closest("[data-light-target-group-id]");
  const every2 = buildStageReferenceScene(localValue);
  const element4 = !every2.every(checked4 => checked4.checked);
  for (const checked8 of every2) {
    checked8.checked = element4;
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
    label: localValue2,
    value: localValue3
  } = Dr;
  const has11 = new Set(buildStageReferenceScene().filter(checked => checked.checked).map(datasetVar => datasetVar.dataset.lightTargetItemId));
  const length21 = floorScene2.items.filter(type4 => lightItemTypes2.has(type4.type) && has11.has(type4.id));
  if (!length21.length) {
    showToast("请至少选择一盏灯。", "error");
    return;
  }
  const length22 = length21.map(item => ({
    item,
    value: clampLightPropertyValue(localValue, localValue3, item.type)
  })).filter(item3 => Math.abs(finite(item3.item[localValue]) - item3.value) > 0.000001);
  if (length22.length) {
    pushHistory();
    for (const item5 of length22) {
      item5.item[localValue] = item5.value;
    }
    refreshViews("lights");
    scheduleSave();
  }
  postAutoDiagramBusy();
  showToast("已将" + localValue2 + "应用到 " + length21.length + " 盏灯。", "success");
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
planStage.addEventListener("drop", preventDefault4 => {
  preventDefault4.preventDefault();
  planStage.classList.remove("dragging-item");
  const localValue = preventDefault4.dataTransfer.getData("application/x-ha-bridge-3d-item");
  if (localValue) {
    placeCatalogFurnitureItem(localValue, screenToPlanWithView(pointerEventToCanvasPoint(preventDefault4)));
  }
});
planCanvas2.addEventListener("pointerdown", handlePlanPointerDown);
planCanvas2.addEventListener("pointermove", queuePlanPointerMoveFrame);
planCanvas2.addEventListener("pointerup", scheduleClearInspectorHover);
planCanvas2.addEventListener("pointercancel", scheduleClearInspectorHover);
planCanvas2.addEventListener("contextmenu", preventDefault5 => preventDefault5.preventDefault());
planCanvas2.addEventListener("wheel", preventDefault6 => {
  preventDefault6.preventDefault();
  applyInspectorFields(preventDefault6);
}, {
  passive: false
});
selectEl("#fit-view").addEventListener("click", fitPlanViewToContent);
selectEl("#rotate-plan-view").addEventListener("click", rotatePlanView90);
selectEl("#zoom-in").addEventListener("click", () => zoomPlanViewAt(1.18));
selectEl("#zoom-out").addEventListener("click", () => zoomPlanViewAt(1 / 1.18));
selectEl("#reset-camera").addEventListener("click", applyCameraView2);
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
exportDialog.addEventListener("cancel", preventDefault7 => {
  preventDefault7.preventDefault();
  if (!orbitSuspended) {
    exportDialog.close();
  }
});
exportDialog.addEventListener("close", openExportDialog);
selectEl("#export-overwrite-close").addEventListener("click", () => resolveExportOverwrite("cancel"));
selectEl("#export-overwrite-cancel").addEventListener("click", () => resolveExportOverwrite("cancel"));
selectEl("#export-overwrite-rename").addEventListener("click", () => resolveExportOverwrite("rename"));
selectEl("#export-overwrite-confirm").addEventListener("click", () => resolveExportOverwrite("overwrite"));
exportOverwriteDialog.addEventListener("cancel", preventDefault8 => {
  preventDefault8.preventDefault();
  resolveExportOverwrite("cancel");
});
const syncExportPresetEditor = () => {
  if (exportCompleteDialog.open) {
    exportCompleteDialog.close();
  }
};
selectEl("#export-complete-close").addEventListener("click", syncExportPresetEditor);
selectEl("#export-complete-confirm").addEventListener("click", syncExportPresetEditor);
h0.addEventListener("click", target5 => {
  const dataset7 = target5.target.closest("[data-export-preset-slot]");
  if (dataset7) {
    selectExportPresetIndex(Number(dataset7.dataset.exportPresetSlot));
  }
});
f0.addEventListener("click", addExportPresetSlot);
g0.addEventListener("click", duplicateActiveExportPreset);
p0.addEventListener("click", removeActiveExportPreset);
selectEl("#export-preset-rename-close").addEventListener("click", closeExportPresetRenameDialog);
selectEl("#export-preset-rename-cancel").addEventListener("click", closeExportPresetRenameDialog);
exportPresetRenameDialog.addEventListener("cancel", preventDefault9 => {
  preventDefault9.preventDefault();
  closeExportPresetRenameDialog();
});
detailsPanelEl.addEventListener("submit", preventDefault10 => {
  preventDefault10.preventDefault();
  const length23 = normalizeExportPresetSlots(projectDoc2?.exportPresets);
  const localValue = normalizeActiveExportPresetSlot(projectDoc2?.activeExportPresetSlot, length23.length);
  const name7 = length23[localValue];
  if (!name7) {
    closeExportPresetRenameDialog();
    return;
  }
  const localValue2 = defaultExportPresetLabel(name7, localValue);
  const name8 = uniqueExportPresetLabel(exportPresetRenameInput.value, localValue);
  name7.name = name8;
  projectDoc2.exportPresets = length23;
  closeExportPresetRenameDialog();
  normalizeProjectExportPresets();
  scheduleSave();
  if (name8 !== localValue2) {
    showToast("已重命名为“" + name8 + "”。", "success");
  }
});
selectEl("#export-preset-delete-close").addEventListener("click", closeExportPresetDeleteDialog);
selectEl("#export-preset-delete-cancel").addEventListener("click", closeExportPresetDeleteDialog);
exportPresetDeleteDialog.addEventListener("cancel", camera2 => {
  camera2.preventDefault();
  closeExportPresetDeleteDialog();
});
vg.addEventListener("submit", camera2 => {
  camera2.preventDefault();
  confirmExportPresetDelete();
});
exportDialog.addEventListener("input", camera2 => {
  if (!camera2.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("change", target6 => {
  if (!target6.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("click", target7 => {
  if (target7.target?.closest?.("[data-camera-view], [data-camera-mode], [data-camera-rotate-top]")) {
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
    height: localValue2
  } = readExportResolution();
  if (exportLockRatio.checked) {
    Tn = localValue / localValue2;
  }
  syncExportResolutionLabel();
});
selectEl("#export-use-fixed").addEventListener("click", applyStageFixedCameraView);
exportFloorSelect.addEventListener("change", () => setExportFloorScope(exportFloorSelect.value));
exportPackage.addEventListener("click", runExportPipeline);
function postAutoDiagramBaseReady(status2 = "ready") {
  if (!!isAutoDiagramEmbed2 && !!autoDiagramComponentId && window.parent !== window && !!projectDoc2) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-base-lighting-state",
      componentId: autoDiagramComponentId,
      status: status2,
      lighting: normalizeBaseLighting(baseLighting),
      savedLighting: normalizeBaseLighting(projectDoc2.baseLighting),
      defaults: normalizeBaseLighting(DEFAULT_BASE_LIGHTING)
    }, window.location.origin);
  }
}
function postAutoDiagramFloorState() {
  if (!!isAutoDiagramEmbed2 && !!autoDiagramComponentId && window.parent !== window && !!projectDoc2) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-floor-state",
      componentId: autoDiagramComponentId,
      floors: projectDoc2.floors.map(item => ({
        id: item.id,
        name: item.name
      })),
      floorSelection: getPreviewFloorMode2() === "all" ? "all" : activeFloor()?.id || activeFloorId
    }, window.location.origin);
  }
}
window.addEventListener("message", origin => {
  if (!isAutoDiagramEmbed2 || origin.origin !== window.location.origin || origin.source !== window.parent) {
    return;
  }
  const command = origin.data;
  if (!!command && command.componentId === autoDiagramComponentId) {
    if (command.type === "ha-bridge-floorplan-auto-diagram-floor") {
      if (command.command === "set-floor") {
        const id2 = projectDoc2.floors.find(itemKey => itemKey.id === command.value);
        const conditionalValue = command.value === "all" && projectDoc2.floors.length > 1 ? "all" : id2?.id || activeFloor()?.id || activeFloorId;
        setExportFloorScope(conditionalValue);
        postAutoDiagramFloorState();
      }
      return;
    }
    if (command.type === "ha-bridge-floorplan-auto-diagram-base-lighting") {
      if (command.command === "request-state") {
        baseLightControls.hidden = true;
        applyBaseLighting(projectDoc2.baseLighting);
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
      for (const checked5 of exportDialog.querySelectorAll("input[data-export-file]")) {
        checked5.checked = true;
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
      floorScene2.settings.livePreviewEnabled = flag;
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
      startPreviewRatio: floorScene2.settings.previewPanelRatio,
      startWidthRatio: floorScene2.settings.detailsPanelWidthRatio
    };
    detailsPanelEl2.classList.add("resizing");
    studioShellEl.classList.add("resizing");
    detailsResizer.dataset.resizeAxis = "pending";
    detailsResizer.setPointerCapture(pointerId.pointerId);
  }
});
detailsResizer.addEventListener("pointermove", pointerId2 => {
  if (detailsResizeDrag?.pointerId === pointerId2.pointerId) {
    if ((pointerId2.buttons & 1) === 0) {
      endDetailsPanelResize2(pointerId2);
      return;
    }
    onDetailsResizePointerMove(pointerId2);
  }
});
const endDetailsPanelResize2 = (pointerId3, flag = true) => {
  if (!detailsResizeDrag || pointerId3?.pointerId !== undefined && detailsResizeDrag.pointerId !== pointerId3.pointerId) {
    return;
  }
  const pointerId4 = detailsResizeDrag;
  detailsResizeDrag = null;
  const comparisonFlag = Math.abs(floorScene2.settings.previewPanelRatio - pointerId4.startPreviewRatio) > 0.0001 || Math.abs(floorScene2.settings.detailsPanelWidthRatio - pointerId4.startWidthRatio) > 0.0001;
  detailsPanelEl2.classList.remove("resizing");
  studioShellEl.classList.remove("resizing");
  delete detailsResizer.dataset.resizeAxis;
  if (flag) {
    try {
      if (detailsResizer.hasPointerCapture(pointerId4.pointerId)) {
        detailsResizer.releasePointerCapture(pointerId4.pointerId);
      }
    } catch {}
  }
  if (comparisonFlag) {
    scheduleSave();
  }
};
detailsResizer.addEventListener("pointerup", endDetailsPanelResize2);
detailsResizer.addEventListener("pointercancel", endDetailsPanelResize2);
detailsResizer.addEventListener("lostpointercapture", argPrimary => endDetailsPanelResize2(argPrimary, false));
window.addEventListener("pointerup", endDetailsPanelResize2, true);
window.addEventListener("pointercancel", endDetailsPanelResize2, true);
window.addEventListener("blur", () => endDetailsPanelResize2());
detailsResizer.addEventListener("keydown", signal => {
  const conditionalValue = signal.key === "ArrowUp" ? -0.03 : signal.key === "ArrowDown" ? 0.03 : 0;
  const conditionalValue2 = signal.key === "ArrowLeft" ? 0.03 : signal.key === "ArrowRight" ? -0.03 : 0;
  if (!conditionalValue && !conditionalValue2) {
    return;
  }
  signal.preventDefault();
  const minimumHeightRatio = studioLayoutMetrics();
  floorScene2.settings.previewPanelRatio = clamp(floorScene2.settings.previewPanelRatio + conditionalValue, minimumHeightRatio.minimumHeightRatio, minimumHeightRatio.maximumHeightRatio);
  floorScene2.settings.detailsPanelWidthRatio = clamp(floorScene2.settings.detailsPanelWidthRatio + conditionalValue2, minimumHeightRatio.minimumWidthRatio, minimumHeightRatio.maximumWidthRatio);
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
    const clamp2 = clamp(finite(e.value, getCameraFocalLength()), 18, 120);
    for (const value of cameraFocalLengthEls) {
      value.value = String(Math.round(clamp2));
    }
    if (!(Math.abs(clamp2 - getCameraFocalLength()) < 1e-8)) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraFocalLength = clamp2;
      applyCameraFocalLength();
      if (stageSession) {
        exportStatus.textContent = "焦段已设为 " + Math.round(clamp2) + " mm";
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
baseLightControlsHeader?.addEventListener("pointerdown", pointerId5 => {
  if (pointerId5.button !== 0 || pointerId5.target.closest("button")) {
    return;
  }
  const left = baseLightControls.getBoundingClientRect();
  lightCacheTileMap = {
    pointerId: pointerId5.pointerId,
    startX: pointerId5.clientX,
    startY: pointerId5.clientY,
    startLeft: left.left,
    startTop: left.top,
    moved: false
  };
  try {
    baseLightControlsHeader.setPointerCapture(pointerId5.pointerId);
  } catch {}
});
baseLightControlsHeader?.addEventListener("pointermove", pointerId6 => {
  if (!lightCacheTileMap || pointerId6.pointerId !== lightCacheTileMap.pointerId) {
    return;
  }
  const computedValue = pointerId6.clientX - lightCacheTileMap.startX;
  const computedValue2 = pointerId6.clientY - lightCacheTileMap.startY;
  if (!lightCacheTileMap.moved && Math.hypot(computedValue, computedValue2) < 4) {
    return;
  }
  lightCacheTileMap.moved = true;
  pointerId6.preventDefault();
  const width11 = baseLightControls.getBoundingClientRect();
  const localValue = Math.max(8, window.innerWidth - width11.width - 8);
  const localValue2 = Math.max(8, window.innerHeight - width11.height - 8);
  baseLightControls.style.right = "auto";
  baseLightControls.style.left = clamp(lightCacheTileMap.startLeft + computedValue, 8, localValue) + "px";
  baseLightControls.style.top = clamp(lightCacheTileMap.startTop + computedValue2, 8, localValue2) + "px";
});
const fh = pointerId7 => {
  if (!!lightCacheTileMap && pointerId7.pointerId === lightCacheTileMap.pointerId) {
    lightCacheTileMap = null;
  }
};
baseLightControlsHeader?.addEventListener("pointerup", fh);
baseLightControlsHeader?.addEventListener("pointercancel", fh);
baseLightingChannel?.addEventListener("message", data => {
  if (data.data?.type !== "base-lighting-saved") {
    return;
  }
  const baseLighting2 = normalizeBaseLighting(data.data.lighting);
  if (projectDoc2) {
    projectDoc2.baseLighting = baseLighting2;
  }
  applyBaseLighting(baseLighting2);
});
snapToggle.addEventListener("click", () => {
  pushHistory();
  floorScene2.settings.snapEnabled = floorScene2.settings.snapEnabled === false;
  syncSnapUi();
  updatePlanStatusChrome();
  drawPlan();
  scheduleSave();
});
Qd.addEventListener("click", stopPropagationVar => {
  stopPropagationVar.stopPropagation();
  setSnapSettingsOpen(xr.hidden);
});
xr.addEventListener("pointerdown", stopPropagation2 => stopPropagation2.stopPropagation());
for (const e of snapSettingEls) {
  e.addEventListener("change", () => {
    pushHistory();
    floorScene2.settings[e.dataset.snapSetting] = e.checked;
    updatePlanStatusChrome();
    drawPlan();
    scheduleSave();
  });
}
snapTolerance.addEventListener("input", () => {
  jd.textContent = snapTolerance.value + " px";
});
snapTolerance.addEventListener("change", () => {
  const snapTolerance2 = clamp(Math.round(finite(snapTolerance.value, 13)), 6, 24);
  if (snapTolerance2 !== floorScene2.settings.snapTolerance) {
    pushHistory();
    floorScene2.settings.snapTolerance = snapTolerance2;
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
lightPropertyApplyValue.addEventListener("submit", preventDefault11 => {
  preventDefault11.preventDefault();
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
  floorScene2.calibration = {
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
  applyCameraView2();
  scheduleSave();
  const id2 = activeFloor();
  if (projectDoc2.floors.findIndex(id2 => id2.id === id2?.id) > 0 && id2?.alignmentPending) {
    requestAnimationFrame(() => startAlignFloorSession());
    showToast("比例已标定，接下来设置上下楼层的参照点。");
  } else {
    showToast("比例已标定，可以沿着底图连续描墙了。");
  }
});
for (const e of [selectEl("#wall-height"), selectEl("#wall-thickness"), selectEl("#wall-opacity-mode"), selectEl("#wall-opacity"), selectEl("#wall-open-end-mode")]) {
  e.addEventListener("change", () => applyInspectorFields2("wall"));
}
for (const e of [selectEl("#window-width"), selectEl("#window-height"), selectEl("#window-sill"), selectEl("#window-divider")]) {
  e.addEventListener("change", () => applyInspectorFields2("window"));
}
for (const e of [selectEl("#door-type"), selectEl("#door-width"), selectEl("#door-height")]) {
  e.addEventListener("change", () => applyInspectorFields2("door"));
}
for (const e of [selectEl("#railing-width"), selectEl("#railing-height")]) {
  e.addEventListener("change", () => applyInspectorFields2("railing"));
}
for (const e of [selectEl("#item-x"), selectEl("#item-y"), selectEl("#item-width"), selectEl("#item-height"), selectEl("#item-depth"), selectEl("#item-elevation"), selectEl("#item-rotation"), selectEl("#item-vertical-rotation"), itemStripRoll]) {
  e.addEventListener("change", () => applyInspectorFields2("item"));
}
zl.addEventListener("change", () => applyInspectorFields2("item"));
for (const e of [selectEl("#label-title"), selectEl("#label-title-spacing"), selectEl("#label-subtitle"), selectEl("#label-subtitle-spacing"), selectEl("#label-line-length")]) {
  e.addEventListener("change", () => applyInspectorFields2("item"));
}
for (const e of [selectEl("#light-group"), selectEl("#light-temperature"), selectEl("#light-brightness"), selectEl("#light-range"), selectEl("#light-angle")]) {
  e.addEventListener("change", () => applyInspectorFields2("item"));
}
selectEl("#curtain-position").addEventListener("change", () => applyInspectorFields2("item"));
selectEl("#round-table-turntable").addEventListener("change", () => applyInspectorFields2("item"));
selectEl("#stair-direction").addEventListener("change", () => applyInspectorFields2("item"));
selectEl("#tv-mount-style").addEventListener("change", () => applyInspectorFields2("item"));
o0.addEventListener("click", () => {
  const door = selectedEntity();
  if (!!door && selection?.kind === "item" && door.type === "shoecabinet") {
    pushHistory();
    door.shoeCabinetMirrored = door.shoeCabinetMirrored !== true;
    refreshViews(itemPreviewScope(door));
    scheduleSave();
  }
});
selectionInspector.addEventListener("submit", preventDefault12 => preventDefault12.preventDefault());
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
  const swing2 = selectedEntity();
  if (!!swing2 && selection?.kind === "door" && !["entry", "sliding-glass", "frame-only"].includes(swing2.doorType)) {
    pushHistory();
    swing2.swing = swing2.swing === -1 ? 1 : -1;
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
window.addEventListener("keydown", key2 => {
  if (isStageEmbed || key2.defaultPrevented || exportDialog.open) {
    return;
  }
  if (key2.key === "Escape" && !xr.hidden) {
    setSnapSettingsOpen(false);
    return;
  }
  const computedValue = key2.target instanceof HTMLInputElement || key2.target instanceof HTMLTextAreaElement || lightPropertyApplyTitle.open;
  if (key2.code === "Space" && !computedValue) {
    saveConflictState = true;
    key2.preventDefault();
  }
  if (key2.key.toLowerCase() === "s" && !computedValue) {
    Or = true;
    updatePlanStatusChrome();
    drawPlan();
  }
  if (computedValue) {
    return;
  }
  if (key2.key === "Shift" && !dragState && (activeTool === "scale" || activeTool === "wall")) {
    zr = true;
    updatePlanStatusChrome();
    drawPlan();
  }
  const computedValue2 = key2.metaKey || key2.ctrlKey;
  if (computedValue2 && key2.key.toLowerCase() === "z") {
    key2.preventDefault();
    if (key2.shiftKey) {
      redoEdit();
    } else {
      undoEdit();
    }
    return;
  }
  if (computedValue2 && key2.key.toLowerCase() === "d") {
    key2.preventDefault();
    selectedItemIds();
    return;
  }
  if (computedValue2 && key2.key.toLowerCase() === "c") {
    key2.preventDefault();
    copySelectedItems();
    return;
  }
  if (computedValue2 && key2.key.toLowerCase() === "v") {
    key2.preventDefault();
    pasteClipboardItems();
    return;
  }
  if (key2.key === "Delete" || key2.key === "Backspace") {
    key2.preventDefault();
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
  }[key2.key];
  if (x42 && !computedValue2) {
    const length7 = selection?.kind === "item" ? [selection.id] : multiSelection.filter(kind3 => kind3.kind === "item").map(id2 => id2.id);
    if (length7.length) {
      key2.preventDefault();
      if (!key2.repeat) {
        pushHistory();
      }
      const computedValue = (key2.altKey ? 0.01 : key2.shiftKey ? 0.25 : 0.05) * (pixelsPerMeter() || 1);
      const has3 = new Set(length7);
      for (const id2 of floorScene2.items) {
        if (has3.has(id2.id)) {
          id2.x += x42.x * computedValue;
          id2.y += x42.y * computedValue;
        }
      }
      refreshViews(activeSelectionAssetCategory());
      scheduleSave();
      return;
    }
  }
  if (key2.key === "Escape") {
    if (activeTool === "flooropening" || dragState?.type === "draw-flooropening") {
      key2.preventDefault();
      if (dragState?.type === "draw-flooropening") {
        try {
          planCanvas2.releasePointerCapture(dragState.pointerId);
        } catch {}
        dragState = null;
        scheduleLeaveStudio();
      }
      setActiveTool("select");
      return;
    }
    if (alignSession) {
      key2.preventDefault();
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
window.addEventListener("beforeunload", preventDefault13 => {
  if (saveGeneration !== savedGeneration) {
    preventDefault13.preventDefault();
    preventDefault13.returnValue = "";
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
    const size2 = {
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
    const object3d = buildStudioItemMeshGroup(size2);
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
        const id2 = document.createElement("textarea");
        id2.id = "ha-bridge-model-export";
        id2.hidden = true;
        const value = JSON.stringify(window.__haBridgeExportFurnitureJson(i, n));
        id2.value = value;
        id2.textContent = value;
        document.body.append(id2);
        document.documentElement.dataset.modelExportReady = o;
      } catch (error) {
        document.documentElement.dataset.modelExportError = error?.message || String(error);
      }
    });
  }
}
const materialTestTypeQuery2 = new URLSearchParams(window.location.search).get("material-test");
if (materialTestTypeQuery2) {
  (async () => {
    const object3d = new THREE.Group();
    try {
      document.documentElement.dataset.materialTestStage = "loading";
      const size = furnitureCatalog[materialTestTypeQuery2];
      if (!size || !ALL_ITEM_MODELS[materialTestTypeQuery2]) {
        throw new Error("Unsupported material test type: " + materialTestTypeQuery2);
      }
      if (!(await loadExternalItemModel(materialTestTypeQuery2))) {
        throw new Error("Material test model failed to load: " + materialTestTypeQuery2);
      }
      document.documentElement.dataset.materialTestStage = "renderer";
      for (let value = 0; !renderer && value < 120; value += 1) {
        await yieldToScheduler();
      }
      if (!renderer || !camera2 || !previewScene2) {
        throw new Error("Material test renderer was not initialized");
      }
      const list = [];
      for (let value = 0; value < 3; value += 1) {
        const group = {
          id: "material-test-" + materialTestTypeQuery2 + "-" + (value + 1),
          type: materialTestTypeQuery2,
          width: size.width,
          height: size.height,
          depth: size.depth,
          elevation: 0,
          rotation: 0
        };
        const object3d2 = new THREE.Group();
        if (!attachExternalItemModel(object3d2, group)) {
          throw new Error("Material test model was not mounted: " + materialTestTypeQuery2);
        }
        object3d2.traverse(object3d3 => {
          if (!object3d3.isMesh) {
            return;
          }
          const list2 = Array.isArray(object3d3.material) ? object3d3.material : [object3d3.material];
          list.push(...list2.filter(Boolean));
        });
        object3d.add(object3d2);
      }
      document.documentElement.dataset.materialTestStage = "compiling";
      renderer.compile(object3d, camera2, previewScene2);
      const unique = new Set(list).size;
      for (let value = 0; value < 600; value += 1) {
        const active = externalModels2.modelLoadState();
        if (active.active === 0 && active.queued === 0) {
          break;
        }
        await yieldToScheduler();
      }
      const materials = externalModels2.modelLoadState();
      const models = {
        models: 3,
        slots: list.length,
        unique,
        shared: list.length - unique,
        cacheMaterials: materials.materials,
        cacheReuses: materials.materialReuses
      };
      document.documentElement.dataset.materialTestStats = JSON.stringify(models);
      const id2 = document.createElement("output");
      id2.id = "ha-bridge-material-test-output";
      id2.setAttribute("aria-live", "polite");
      id2.textContent = "材质测试 " + materialTestTypeQuery2 + "：" + models.models + " 个模型，" + models.slots + " 个材质槽，" + models.unique + " 种唯一材质，" + models.shared + " 个槽复用；当前缓存 " + models.cacheMaterials + " 种，累计复用 " + models.cacheReuses + " 次。";
      document.body.append(id2);
      document.documentElement.dataset.materialTestReady = materialTestTypeQuery2;
      document.documentElement.dataset.materialTestStage = "ready";
    } catch (error) {
      document.documentElement.dataset.materialTestError = error?.message || String(error);
      document.documentElement.dataset.materialTestStage = "error";
    } finally {
      disposeObject3dResources(object3d);
    }
  })();
}
const instanceTestTypeQuery2 = new URLSearchParams(window.location.search).get("instance-test");
if (instanceTestTypeQuery2) {
  const e = new THREE.Group();
  const o = new THREE.BoxGeometry(0.5, 0.86, 0.5);
  try {
    if (skipInstanceMergeTypes.has(instanceTestTypeQuery2)) {
      throw new Error("Unsupported instance test type: " + instanceTestTypeQuery2);
    }
    const t = [];
    for (let i = 0; i < 3; i += 1) {
      const r = {
        id: "instance-test-" + instanceTestTypeQuery2 + "-" + (i + 1),
        type: instanceTestTypeQuery2
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
    document.documentElement.dataset.instanceTestReady = instanceTestTypeQuery2;
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
  const combinedFixedCameraView = normalizeProjectDocument(hasProjectLoaded2.referenceScene || hasProjectLoaded2.scene);
  let localValue = null;
  const entryMap = new Map();
  const reusedTransitions = {
    reusedTransitions: 0,
    rebuiltTransitions: 0,
    reusedFloors: 0
  };
  let emptyText = "";
  let cacheEpoch = 0;
  const helperFn = node3 => {
    releaseRoot?.releaseRoot?.(node3.node);
    studioReady?.releaseRoot?.(node3.node);
    disposeObject3dResources(node3.node);
  };
  const helperFn2 = (has7 = null) => {
    if (!has7) {
      cacheEpoch++;
    }
    for (const [localValue, localValue2] of entryMap) {
      if (!has7 || !!has7.has(localValue)) {
        helperFn(localValue2);
        entryMap.delete(localValue);
      }
    }
  };
  function release(node6) {
    if (!node6.cacheKey || node6.cacheEpoch !== cacheEpoch) {
      return false;
    }
    const idValue = node6.id;
    const node7 = entryMap.get(idValue);
    if (node7 && node7.node !== node6.node) {
      helperFn(node7);
    }
    node6.node.position.set(0, 0, 0);
    node6.node.quaternion.identity();
    node6.node.scale.set(1, 1, 1);
    node6.node.updateMatrixWorld(true);
    entryMap.delete(idValue);
    entryMap.set(idValue, node6);
    studioReady?.retainRoot?.(node6.node);
    releaseRoot?.retainRoot?.(node6.node);
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
  let localValue2 = null;
  let boolFlag = false;
  let localValue3;
  let localValue4;
  let push22 = [];
  let push23 = [];
  let arrayValue = [];
  let arrayValue2 = [];
  let boolTrue = true;
  let enabled8 = false;
  let localValue5;
  let localValue6;
  let push24 = [];
  let localValue7;
  let clone3;
  let localValue8;
  let boolFlag2 = false;
  let localValue9;
  let localValue10;
  let localValue11 = null;
  const excludeModelLayers = new Set(["items", "lights"]);
  let stringValue = "free";
  let enablePan = true;
  let enableZoom = true;
  let boolFlag3 = false;
  let boolFlag4 = false;
  let zeroValue = 0;
  let emptyText2 = "";
  let height10 = null;
  const view3 = new THREE.OrthographicCamera();
  const aspect2 = new THREE.PerspectiveCamera();
  const motion = {
    matrix: new THREE.Matrix4()
  };
  const x54 = new THREE.Vector2();
  function computeCameraViewHeight(zoom) {
    if (zoom.mode !== "perspective") {
      return Math.max(1, zoom.frameSize || 10) / zoom.zoom / Math.min(1, Math.max(0.1, camera2.userData.viewportAspect || 1));
    } else {
      aspect2.aspect = camera2.userData.viewportAspect || 1;
      aspect2.zoom = zoom.zoom;
      aspect2.setFocalLength(zoom.focalLength || 50);
      return new THREE.Vector3().fromArray(zoom.position).distanceTo(new THREE.Vector3().fromArray(zoom.target)) * 2 * Math.tan(THREE.MathUtils.degToRad(aspect2.getEffectiveFOV()) / 2);
    }
  }
  function blendCameraProjectionMatrices() {
    if (!height10) {
      return;
    }
    const distance2 = Math.max(0.000001, camera2.position.distanceTo(orbitControls.target));
    const height8 = Math.max(0.000001, height10.height);
    const aspect = camera2.userData.viewportAspect || 1;
    const weight = height10.weight;
    const enabled6 = camera2.view;
    const enabled7 = view3.view;
    const comparisonFlag = enabled6 === enabled7 || enabled6 && enabled7 && enabled6.enabled === enabled7.enabled && enabled6.fullWidth === enabled7.fullWidth && enabled6.fullHeight === enabled7.fullHeight && enabled6.offsetX === enabled7.offsetX && enabled6.offsetY === enabled7.offsetY && enabled6.width === enabled7.width && enabled6.height === enabled7.height;
    if (motion.motion === height10 && motion.camera === camera2 && motion.distance === distance2 && motion.height === height8 && motion.aspect === aspect && motion.weight === weight && motion.near === camera2.near && motion.far === camera2.far && comparisonFlag && motion.matrix.equals(camera2.projectionMatrix)) {
      return;
    }
    Object.assign(view3, {
      left: -height8 * aspect / 2,
      right: height8 * aspect / 2,
      top: height8 / 2,
      bottom: -height8 / 2,
      near: camera2.near,
      far: camera2.far,
      zoom: 1
    });
    Object.assign(aspect2, {
      fov: THREE.MathUtils.radToDeg(Math.atan(height8 / (distance2 * 2)) * 2),
      aspect,
      near: camera2.near,
      far: camera2.far,
      zoom: 1
    });
    for (const view of [view3, aspect2]) {
      view.view = camera2.view ? {
        ...camera2.view
      } : null;
      view.updateProjectionMatrix();
    }
    const localValue12 = view3.projectionMatrix.elements;
    const localValue13 = aspect2.projectionMatrix.elements;
    for (let zeroValue = 0; zeroValue < 16; zeroValue++) {
      camera2.projectionMatrix.elements[zeroValue] = localValue12[zeroValue] * (1 - weight) + localValue13[zeroValue] / distance2 * weight;
    }
    camera2.projectionMatrixInverse.copy(camera2.projectionMatrix).invert();
    motion.motion = height10;
    motion.camera = camera2;
    motion.distance = distance2;
    motion.height = height8;
    motion.aspect = aspect;
    motion.weight = weight;
    motion.near = camera2.near;
    motion.far = camera2.far;
    motion.matrix.copy(camera2.projectionMatrix);
  }
  const size = new Map();
  const size2 = new Map();
  let zeroValue2 = 0;
  let zeroValue3 = 0;
  let localValue14 = null;
  let boolFlag5 = false;
  let boolFlag6 = false;
  let localValue15 = null;
  let localValue16;
  let localValue17;
  let boolFlag7 = false;
  let get10 = new Map();
  let get11 = new Map();
  const objectValue = {
    restore: () => tickLightTransitionStates(performance.now(), true)
  };
  function setStageWarmupActive(argPrimary) {
    if (localValue15 !== null) {
      window.clearTimeout(localValue15);
    }
    localValue15 = null;
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
      localValue15 = window.setTimeout(() => {
        localValue15 = null;
        isStageWarmup = false;
        checkAdaptiveQuality();
        qualityProbeStartMs = 0;
        setPreviewPixelRatio(previewOrbitLocked, {
          preserveLightCache: true
        });
      }, 140);
    }
  }
  function normalizedLightBrightness(type18, argSecondary) {
    const computedValue = clamp(finite(argSecondary, 0), 0, 100) / 100;
    if (yt) {
      return computedValue;
    } else if (type18.type === "striplight") {
      return Math.pow(computedValue, 0.82);
    } else {
      return spotLightBrightnessResponse(type18.type, computedValue);
    }
  }
  function estimateLightRenderIntensity(type19) {
    const range = defaultLightPresets[type19.type] || defaultLightPresets.downlight;
    const computedValue = deferExternalModels[type19.type] || 1.1;
    if (type19.type !== "striplight") {
      return (type19.type === "ceilinglight" ? 680 : 520) * computedValue;
    }
    const clampedValue = clamp(finite(type19.lightRange, range.range), 0.5, 10);
    const localValue12 = Math.max(finite(type19.elevation, 2.7), 0.4);
    return clamp(clampedValue / range.range, 0.45, 1.65) * 48 * clamp(Math.max(1, Math.pow(localValue12 / 2.7, 2)), 1, 4) * computedValue;
  }
  function applySampledLightState(intensity4, intensity5) {
    intensity4.intensity = intensity5.intensity;
    intensity4.color.fromArray(intensity5.color);
    intensity4.visible = intensity5.intensity > 0.000001 || !intensity5.complete;
  }
  function tickLightTransitionStates(argPrimary, flag = false) {
    if (isCapturingFrame === objectValue) {
      if (localValue16 !== worldGroup || localValue17 !== worldGroup?.children[0]) {
        localValue16 = worldGroup;
        localValue17 = worldGroup?.children[0];
        get10 = collectWorldItemKeys();
        get11 = new Map(collectVisibleLights().map(itemKey => [itemKey.itemKey, itemKey]));
        boolFlag7 = true;
      }
      if (flag || boolFlag7) {
        for (const [localValue, localValue2] of get10) {
          const item2 = get11.get(localValue);
          if (!item2) {
            continue;
          }
          const visible3 = item2.group?.enabled !== false && item2.item.lightBrightness > 0;
          for (const intensity of localValue2) {
            intensity.intensity = visible3 ? finite(intensity.userData.lightOnIntensity, 0) : 0;
            intensity.visible = visible3;
            intensity.color.setHex(lightEffectColorHex(item2.item.lightTemperature));
          }
        }
      }
      boolFlag7 = false;
    }
    for (const [localValue, localValue2] of size) {
      applySampledLightState(localValue, sampleLightTransition(localValue2, argPrimary));
    }
  }
  function smoothstepLerp(duration, argSecondary) {
    const conditionalValue = duration.duration ? clamp((argSecondary - duration.started) / duration.duration, 0, 1) : 1;
    return duration.from + (duration.to - duration.from) * conditionalValue * conditionalValue * (3 - conditionalValue * 2);
  }
  function stopOverlayFadeLoop() {
    if (zeroValue2) {
      cancelAnimationFrame(zeroValue2);
    }
    zeroValue2 = 0;
    size2.clear();
    rs = false;
  }
  function tickOverlayFadeFrame(argPrimary) {
    zeroValue2 = 0;
    if (!lightCacheReady || previewQualityJustBecameReady || previewLightCache.hidden || isCapturingFrame) {
      stopOverlayFadeLoop();
      return;
    }
    for (const [localValue, started] of size2) {
      pendingModelLoads.set(localValue, smoothstepLerp(started, argPrimary));
      if (argPrimary >= started.started + started.duration) {
        size2.delete(localValue);
      }
    }
    rs = size2.size > 0;
    blitLightCacheToOverlay();
    if (size2.size) {
      zeroValue2 = requestAnimationFrame(tickOverlayFadeFrame);
    }
  }
  function beginOverlayFade(valuesVar, immediate, argTertiary) {
    if (!lightCacheReady || previewQualityJustBecameReady || isBakingLightCache || previewLightCache.hidden || isCapturingFrame || boolFlag3 || boolFlag4) {
      return false;
    }
    const every3 = [...valuesVar.values()].filter(floorId6 => getPreviewFloorMode2() === "all" || floorId6.floorId === activeFloorId);
    if (!every3.every(item4 => item4.previousBrightness === item4.item.lightBrightness && item4.previousKelvin === item4.item.lightTemperature && lightCacheTileMap2.has(previewScopedItemKey(item4.floorId, item4.item.lightGroupId)))) {
      return false;
    }
    const started3 = performance.now();
    for (const wasOn2 of every3) {
      const localValue = previewScopedItemKey(wasOn2.floorId, wasOn2.item.lightGroupId);
      const localValue2 = size2.get(localValue);
      const from3 = localValue2 ? smoothstepLerp(localValue2, started3) : finite(pendingModelLoads.get(localValue), wasOn2.wasOn ? 1 : 0);
      size2.set(localValue, {
        from: from3,
        to: wasOn2.isOn ? 1 : 0,
        started: started3,
        duration: lightTransitionDurationMs(wasOn2.wasOn, wasOn2.isOn, wasOn2.fadeDuration, {
          ...argTertiary,
          immediate
        })
      });
    }
    if (zeroValue2) {
      cancelAnimationFrame(zeroValue2);
    }
    tickOverlayFadeFrame(started3);
    return true;
  }
  function captureLightCacheFrame() {
    const get8 = new Map(size2);
    stopOverlayFadeLoop();
    isCapturingFrame = objectValue;
    if (localValue14 !== null) {
      window.clearTimeout(localValue14);
    }
    localValue14 = null;
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = null;
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
    if (!isBakingLightCache) {
      showPreviewRenderShield();
    }
    setPreviewLightCacheVisible(false);
    const map7 = collectVisibleLights();
    get10 = ensureWorldItemsCached(map7);
    get11 = new Map(map7.map(itemKey3 => [itemKey3.itemKey, itemKey3]));
    localValue16 = worldGroup;
    localValue17 = worldGroup?.children[0];
    boolFlag7 = true;
    const timestampMs = performance.now();
    for (const groupKey of map7) {
      const to2 = get8.get(groupKey.groupKey);
      if (!to2) {
        continue;
      }
      const localValue = smoothstepLerp(to2, timestampMs);
      for (const userData16 of get10.get(groupKey.itemKey) || []) {
        const finiteValue = finite(userData16.userData.lightOnIntensity, 0);
        const color2 = userData16.color.toArray();
        size.set(userData16, createLightTransition({
          intensity: finiteValue * localValue,
          color: color2
        }, {
          intensity: finiteValue * to2.to,
          color: color2
        }, timestampMs, Math.max(0, to2.started + to2.duration - timestampMs)));
      }
    }
    if (size.size && !zeroValue3) {
      zeroValue3 = requestAnimationFrame(tickLightTransitionFrame);
    }
    syncOrbitControls();
    return get10;
  }
  function finishLightCacheCapture() {
    localValue14 = null;
    if (!floorSelectionQuery && !curtainMotionActive && !vacuumMotionActive && !boolFlag3 && !boolFlag4 && !size.size && isCapturingFrame === objectValue) {
      if (isBakingLightCache || isStageWarmup) {
        localValue14 = window.setTimeout(finishLightCacheCapture, 60);
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
    zeroValue3 = 0;
    tickLightTransitionStates(argPrimary);
    let boolFlag8 = false;
    for (const [visible8, started2] of size) {
      if (!(argPrimary - started2.started < started2.duration)) {
        size.delete(visible8);
        if (!visible8.visible) {
          boolFlag8 = true;
        }
      }
    }
    if (boolFlag8) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
      scheduleOrbitInteractionWarmup();
    }
    updateLightPreview();
    if (size.size) {
      zeroValue3 = requestAnimationFrame(tickLightTransitionFrame);
    } else {
      setStageWarmupActive(false);
      if (isCapturingFrame === objectValue) {
        localValue14 = window.setTimeout(finishLightCacheCapture, 180);
      }
    }
  }
  function stopAllLightAnimations() {
    stopOverlayFadeLoop();
    if (zeroValue3) {
      cancelAnimationFrame(zeroValue3);
    }
    if (localValue14 !== null) {
      window.clearTimeout(localValue14);
    }
    if (localValue15 !== null) {
      window.clearTimeout(localValue15);
    }
    zeroValue3 = 0;
    localValue14 = null;
    localValue15 = null;
    isStageWarmup = false;
    for (const [localValue, to4] of size) {
      applySampledLightState(localValue, {
        ...to4.to,
        complete: true
      });
    }
    size.clear();
    boolFlag4 = false;
    get10.clear();
    get11.clear();
    if (isCapturingFrame === objectValue) {
      isCapturingFrame = null;
    }
  }
  const has18 = new WeakMap();
  const has19 = new Map();
  function setLightStates(filter5, editor = {}) {
    if (editor.editor) {
      const get2 = new Map(filter5.filter(on2 => on2.on).map(floorId2 => [layerScopedKey(floorId2.floorId, floorId2.groupId), floorId2]));
      filter5 = projectDoc2.floors.flatMap(id2 => (id2.scene.lightGroups || []).map(id2 => {
        if (!has19.has(id2)) {
          has19.set(id2, id2.enabled !== false);
        }
        return get2.get(layerScopedKey(id2.id, id2.id)) || {
          floorId: id2.id,
          groupId: id2.id,
          on: false
        };
      }));
    } else if (has19.size) {
      const has5 = new Map(filter5.map(floorId => [layerScopedKey(floorId.floorId, floorId.groupId), floorId]));
      filter5 = [...projectDoc2.floors.flatMap(id2 => (id2.scene.lightGroups || []).filter(id2 => has19.has(id2) && !has5.has(layerScopedKey(id2.id, id2.id))).map(id2 => ({
        floorId: id2.id,
        groupId: id2.id,
        on: has19.get(id2),
        brightnessSupported: false,
        temperatureSupported: false
      }))), ...filter5];
      has19.clear();
      editor = {
        ...editor,
        immediate: true
      };
    }
    if (!boolFlag6) {
      boolFlag6 = true;
      window.addEventListener("pagehide", stopAllLightAnimations, {
        once: true
      });
    }
    const immediate2 = editor.immediate === true || !boolFlag5 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const lookupMap = new Map();
    for (const floorId7 of filter5) {
      const brightness3 = mapLightEffectState(floorId7);
      const scene5 = projectDoc2.floors.find(id2 => id2.id === floorId7.floorId);
      const enabled3 = scene5?.scene.lightGroups.find(id2 => id2.id === floorId7.groupId);
      if (!enabled3) {
        continue;
      }
      const wasOn = enabled3.enabled !== false;
      const isOn = floorId7.on === true;
      enabled3.enabled = isOn;
      for (const lightBrightness3 of scene5.scene.items) {
        if (lightBrightness3.lightGroupId !== enabled3.id || !lightItemTypes2.has(lightBrightness3.type)) {
          continue;
        }
        const brightness = lightBrightness3.lightBrightness;
        const kelvin = lightBrightness3.lightTemperature;
        if (!has18.has(lightBrightness3)) {
          has18.set(lightBrightness3, {
            brightness,
            kelvin
          });
        }
        const brightness2 = has18.get(lightBrightness3);
        if (Number.isFinite(brightness3.brightness)) {
          lightBrightness3.lightBrightness = brightness3.brightness;
        } else if (floorId7.brightnessSupported === false) {
          lightBrightness3.lightBrightness = brightness2.brightness;
        }
        if (Number.isFinite(brightness3.kelvin)) {
          lightBrightness3.lightTemperature = brightness3.kelvin;
        } else if (floorId7.temperatureSupported === false) {
          lightBrightness3.lightTemperature = brightness2.kelvin;
        }
        if (wasOn !== isOn || brightness !== lightBrightness3.lightBrightness || kelvin !== lightBrightness3.lightTemperature) {
          lookupMap.set(layerScopedKey(scene5.id, lightBrightness3.id), {
            item: lightBrightness3,
            floorId: scene5.id,
            wasOn,
            isOn,
            previousBrightness: brightness,
            previousKelvin: kelvin,
            fadeDuration: floorId7.fadeDuration
          });
        }
      }
    }
    boolFlag5 = true;
    if (!lookupMap.size) {
      return;
    }
    const localValue12 = isPreviewQualityReady();
    if (localValue12 && beginOverlayFade(lookupMap, immediate2, editor)) {
      return;
    }
    let has12 = collectWorldItemKeys();
    const get9 = has12;
    if (localValue12) {
      has12 = captureLightCacheFrame();
    } else if ([...lookupMap.keys()].some(argPrimary => !has12.has(argPrimary))) {
      has12 = ensureWorldItemsCached(collectVisibleLights().filter(itemKey2 => lookupMap.has(itemKey2.itemKey)));
    }
    let boolFlag8 = false;
    const timestampMs = performance.now();
    for (const [localValue, item6] of lookupMap) {
      if (getPreviewFloorMode2() !== "all" && item6.floorId !== activeFloorId) {
        continue;
      }
      const length8 = has12.get(localValue);
      if (length8?.length) {
        for (const userData11 of length8) {
          const localValue = size.get(userData11);
          const localValue2 = normalizedLightBrightness(item6.item, item6.previousBrightness);
          const conditionalValue = get9.get(localValue)?.includes(userData11) && localValue2 > 1e-7 && userData11.userData.lightOnIntensity > 0 ? userData11.userData.lightOnIntensity / localValue2 : estimateLightRenderIntensity(item6.item);
          const lightOnIntensity = conditionalValue * normalizedLightBrightness(item6.item, item6.item.lightBrightness);
          const color = {
            intensity: item6.isOn ? lightOnIntensity : 0,
            color: new THREE.Color(lightEffectColorHex(item6.item.lightTemperature)).toArray()
          };
          const intensity2 = localValue ? sampleLightTransition(localValue, timestampMs) : null;
          const conditionalValue2 = !item6.wasOn && item6.isOn && (!intensity2 || intensity2.intensity <= 0.000001) ? {
            intensity: 0,
            color: color.color
          } : intensity2 || {
            intensity: localValue12 ? item6.wasOn ? conditionalValue * localValue2 : 0 : userData11.intensity,
            color: localValue12 ? new THREE.Color(lightEffectColorHex(item6.previousKelvin)).toArray() : userData11.color.toArray()
          };
          userData11.userData.lightOnIntensity = lightOnIntensity;
          userData11.userData.lightBrightness = item6.item.lightBrightness;
          const localValue3 = lightTransitionDurationMs(item6.wasOn, item6.isOn, item6.fadeDuration, {
            ...editor,
            immediate: immediate2
          });
          const localValue4 = createLightTransition(conditionalValue2, color, timestampMs, localValue3);
          const localValue5 = userData11.visible;
          applySampledLightState(userData11, sampleLightTransition(localValue4, timestampMs));
          boolFlag8 ||= localValue5 !== userData11.visible;
          if (localValue3) {
            size.set(userData11, localValue4);
          } else {
            size.delete(userData11);
          }
        }
      }
    }
    if (localValue12) {
      tickLightTransitionStates(timestampMs);
    }
    if (boolFlag8 || localValue12) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
    }
    if (boolFlag8) {
      scheduleOrbitInteractionWarmup();
    }
    setStageWarmupActive(size.size > 0);
    updateLightPreview();
    if (!zeroValue3) {
      if (size.size) {
        zeroValue3 = requestAnimationFrame(tickLightTransitionFrame);
      } else if (localValue12) {
        localValue14 = window.setTimeout(finishLightCacheCapture, 100);
      }
    }
  }
  function syncRendererSizeCacheKey() {
    renderer.getSize(x54);
    const localValue12 = Math.max(x54.x || 1, 1);
    const localValue13 = Math.max(x54.y || 1, 1);
    const halfValue = localValue12 + "/" + localValue13 + "/" + zeroValue + "/" + camera2.uuid;
    if (halfValue === emptyText2) {
      blendCameraProjectionMatrices();
      return;
    }
    emptyText2 = halfValue;
    if (zeroValue) {
      camera2.setViewOffset(localValue12, localValue13, localValue12 * zeroValue / 2, 0, localValue12, localValue13);
    } else {
      camera2.clearViewOffset();
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
  function worldPoint(argPrimary, x43, y4, argN4 = 0.1) {
    const scene9 = projectDoc2.floors.find(id2 => id2.id === argPrimary);
    if (!scene9) {
      return null;
    }
    const computedValue = scene9.scene.calibration?.pixelsPerMeter || 1;
    if (getPreviewFloorMode2() === "all") {
      const indexOfVar = [...projectDoc2.floors].sort((elevation5, elevation6) => elevation5.elevation - elevation6.elevation);
      const x27 = planPointToWorldXZ(scene9, {
        x: x43,
        y: y4
      });
      return new THREE.Vector3(x27.x, indexOfVar.indexOf(scene9) * projectDoc2.previewFloorGap + argN4, x27.z);
    }
    const localValue12 = floorScene2;
    floorScene2 = scene9.scene;
    const minX3 = getPreviewFloorMode();
    floorScene2 = localValue12;
    return new THREE.Vector3((x43 - (minX3.minX + minX3.maxX) / 2) / computedValue, argN4, (y4 - (minX3.minY + minX3.maxY) / 2) / computedValue);
  }
  function findFloorOrbitCenter(argPrimary) {
    if (!projectDoc2.floors.some(id2 => id2.id === argPrimary)) {
      return null;
    }
    const comparisonFlag = projectDoc2.floors.find(id2 => id2.id === argPrimary)?.scene.calibration?.pixelsPerMeter || 1;
    const localValue12 = worldPoint(argPrimary, 0, 0, 0);
    return new THREE.Matrix4().makeBasis(worldPoint(argPrimary, comparisonFlag, 0, 0).sub(localValue12), new THREE.Vector3(0, 1, 0), worldPoint(argPrimary, 0, comparisonFlag, 0).sub(localValue12)).setPosition(localValue12);
  }
  function computeMultiFloorBoundsCenter() {
    if (projectDoc2.floors.length < 2) {
      return null;
    }
    const expandByPoint = new THREE.Box3();
    let zeroValue4 = 0;
    for (const scene6 of projectDoc2.floors) {
      for (const start2 of scene6.scene.walls || []) {
        for (const x8 of [start2.start, start2.end]) {
          if (!x8 || !Number.isFinite(x8.x) || !Number.isFinite(x8.y)) {
            continue;
          }
          const x7 = planPointToWorldXZ(scene6, x8);
          expandByPoint.expandByPoint(new THREE.Vector3(x7.x, 0, x7.z));
        }
        zeroValue4 = Math.max(zeroValue4, finite(start2.height, scene6.scene.settings?.wallHeight || 2.8));
      }
    }
    if (expandByPoint.isEmpty()) {
      return null;
    }
    const y5 = expandByPoint.getCenter(new THREE.Vector3());
    if (getPreviewFloorMode2() === "all") {
      y5.y = (projectDoc2.floors.length - 1) * projectDoc2.previewFloorGap / 2 + zeroValue4 / 2;
      return y5;
    }
    const id2 = projectDoc2.floors.find(id2 => id2.id === activeFloorId);
    const x44 = rotatePlanPointByFloor(id2, y5);
    return worldPoint(id2.id, x44.x, x44.y, zeroValue4 / 2);
  }
  function resolveOrbitPanTarget(argPrimary) {
    if (localValue9 !== worldGroup || localValue10 !== planCanvas) {
      const localValue = computeMultiFloorBoundsCenter();
      const isEmpty = localValue ? null : isWallCloseSnap({
        excludeModelLayers
      });
      localValue9 = worldGroup;
      localValue10 = planCanvas;
      localValue11 = localValue || (isEmpty.isEmpty() ? null : isEmpty.getCenter(new THREE.Vector3()));
    }
    return (localValue11 || argPrimary).clone();
  }
  function syncOrbitControlsBinding() {
    clone3 ||= resolveOrbitPanTarget(orbitControls.target);
    if (localValue8 === orbitControls) {
      return;
    }
    const addEventListener3 = orbitControls;
    const quaternion = camera2;
    const localValue12 = addEventListener3.update.bind(addEventListener3);
    localValue8 = addEventListener3;
    const helperFn3 = () => {
      if (isCapturingFrame === objectValue) {
        if (localValue14 !== null) {
          window.clearTimeout(localValue14);
        }
        localValue14 = null;
        if (!boolFlag4) {
          localValue14 = window.setTimeout(finishLightCacheCapture, 180);
        }
      }
    };
    addEventListener3.addEventListener("start", () => {
      if (!boolFlag3) {
        boolFlag4 = true;
      }
    });
    addEventListener3.addEventListener("change", () => {
      if (!boolFlag3) {
        if (boolFlag4 && isPreviewQualityReady() && isCapturingFrame !== objectValue) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now());
          syncSpotShadowCastingLights(worldGroup, {
            rebuildAtlas: false
          });
        }
        helperFn3();
      }
    });
    addEventListener3.addEventListener("end", () => {
      if (!boolFlag3) {
        boolFlag4 = false;
        helperFn3();
      }
    });
    let localValue13 = addEventListener3.enabled;
    Object.defineProperty(addEventListener3, "enabled", {
      configurable: true,
      get: () => enabled8 && !boolFlag3 && localValue13,
      set: argPrimary => {
        localValue13 = argPrimary === true;
      }
    });
    Object.defineProperty(addEventListener3, "enableRotate", {
      configurable: true,
      get: () => true,
      set() {}
    });
    addEventListener3.update = argPrimary => {
      if (boolFlag3) {
        return false;
      }
      const angleTo = quaternion.quaternion.clone();
      const localValue = localValue12(argPrimary);
      if (enabled8 && angleTo.angleTo(quaternion.quaternion) > 1e-7) {
        const localValue2 = quaternion.quaternion.clone().multiply(angleTo.invert());
        const clone = clone3.clone().sub(addEventListener3.target);
        const localValue3 = clone.clone().sub(clone.applyQuaternion(localValue2));
        quaternion.position.add(localValue3);
        addEventListener3.target.add(localValue3);
        quaternion.updateMatrixWorld();
        addEventListener3.dispatchEvent({
          type: "change"
        });
        return true;
      }
      return localValue;
    };
  }
  function collectShadowCastingLights() {
    if (localValue5 !== worldGroup || localValue6 !== worldGroup?.children[0]) {
      localValue5 = worldGroup;
      localValue6 = worldGroup?.children[0];
      push24 = [];
      worldGroup?.traverse(userData12 => {
        if (["background", "grid"].includes(userData12.userData?.exportRole)) {
          push24.push(userData12);
        }
      });
    }
    for (const visible9 of push24) {
      visible9.visible = boolTrue && !visible9.userData.floorBackgroundHidden;
    }
  }
  const detail2 = new URLSearchParams(globalThis.window?.location?.search || "").get("reflection-detail") === "low" ? createReflectionDetail({
    THREE,
    requestFrame: () => {
      changed.changed();
      updateLightPreview();
    }
  }) : null;
  const comparisonFlag2 = new URLSearchParams(globalThis.window?.location?.search || "").get("performance-diagnostics") === "1" && new URLSearchParams(window.location.search).get("reflection-work") === "baseline";
  const changed = createGroundReflections({
    detail: detail2,
    THREE,
    renderer,
    scene: previewScene2,
    getRoot: () => worldGroup,
    getSceneRevision: () => planCanvas,
    floorLighting: yt,
    cull: !comparisonFlag2,
    syncLighting: argPrimary => comparisonFlag2 ? studioReady?.sync(argPrimary, true) : studioReady?.syncCamera(argPrimary),
    requestFrame: () => updateLightPreview(),
    getStateKey: () => [planCanvas, floorSelectionQuery, yt ? "" : lightCacheEpoch, lightCacheReady, renderer.toneMappingExposure].join("|")
  });
  const localValue18 = new URLSearchParams(globalThis.window?.location?.search || "").get("floorEffects");
  let boolFlag9 = false;
  let boolFlag10 = false;
  const motionPresentation = createMotionPresentation({
    reflections(active) {
      boolFlag10 = active;
      changed.setSuspended?.(boolFlag9 || boolFlag10, {
        fade: !boolFlag9
      });
    },
    shadows(active) {
      renderCache?.setMotion?.(active);
    }
  });
  function setEditorEffects(argPrimary, argSecondary) {
    const computedValue = argPrimary && !argSecondary;
    renderer.domElement.dataset.editorEffects = argPrimary ? argSecondary ? "light-preview" : "paused" : "runtime";
    if (boolFlag9 !== computedValue) {
      boolFlag9 = computedValue;
      changed.setSuspended?.(boolFlag9 || boolFlag10);
      updateLightPreview();
    }
  }
  const comparisonFlag3 = (yt || localValue18 === "follow") && localValue18 !== "deferred";
    let localValue19 = null;
  let autoUpdate = true;
  const has20 = new Map();
  function setShadowMapAutoUpdate(argPrimary) {
    if (floorShadowMotionActive !== !!argPrimary) {
      floorShadowMotionActive = !!argPrimary;
      if (comparisonFlag3) {
        if (argPrimary) {
          autoUpdate = renderer.shadowMap.autoUpdate;
        }
        renderer.shadowMap.autoUpdate = argPrimary ? true : autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        studioReady?.setMotion?.(argPrimary, true);
        return;
      }
      if (argPrimary) {
        localValue19 = null;
        autoUpdate = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = false;
        shadowAtlas?.setEnabled(false);
        previewScene2.traverse(shadow => {
          if (!!shadow.isLight && !!shadow.castShadow && !!shadow.shadow) {
            if (!has20.has(shadow.shadow)) {
              has20.set(shadow.shadow, shadow.shadow.intensity ?? 1);
            }
            shadow.shadow.intensity = 0;
          }
        });
      } else {
        renderer.shadowMap.autoUpdate = autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        localValue19 = performance.now();
        shadowAtlas?.setEnabled(true);
      }
      studioReady?.setMotion?.(argPrimary);
    }
  }
  function tickShadowIntensityFade() {
    if (floorShadowMotionActive || localValue19 === null) {
      return;
    }
    const nowMs = Math.min(1, (performance.now() - localValue19) / 280);
    for (const [intensity3, localValue] of has20) {
      intensity3.intensity = localValue * nowMs;
    }
    if (nowMs < 1) {
      updateLightPreview();
    } else {
      has20.clear();
      localValue19 = null;
    }
  }
  const profileFrameWork = (argPrimary, argSecondary) => typeof fitCameraToSelection2 == "function" ? fitCameraToSelection2(argPrimary, argSecondary) : argSecondary();
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
        clone3 = null;
        localValue9 = null;
        localValue10 = undefined;
        localValue11 = null;
        syncOrbitControlsBinding();
      }
      if (comparisonFlag3 && !argPrimary) {
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
    const node4 = finish.records.find(id2 => id2.id === argPrimary);
    if (node4) {
      node4.node.updateWorldMatrix(true, false);
      return node4.node.matrixWorld.clone().multiply(node4.baseFrame);
    } else {
      return findFloorOrbitCenter(argPrimary);
    }
  });
  studioReady?.setMotionTransformProvider?.(argPrimary => {
    const node5 = finish.records.find(id2 => id2.id === argPrimary);
    if (node5) {
      node5.node.updateWorldMatrix(true, false);
      return (node5.lightingTransform ||= new THREE.Matrix4()).copy(node5.node.matrixWorld).invert().premultiply(worldGroup.matrixWorld);
    } else {
      return null;
    }
  });
  globalThis.window?.addEventListener("pagehide", () => {
    finish.finish();
    helperFn2();
  }, {
    once: true
  });
  globalThis.window?.addEventListener("pagehide", () => changed.dispose(), {
    once: true
  });
  const applyVar = previewScene2.onBeforeRender;
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
        boolFlag = shadowAtlas ? !shadowAtlas.refreshGeometry(worldGroup, push23) : false;
      } catch (error) {
        console.error(error);
        boolFlag = true;
      }
    }
  };
  previewScene2.add(name9);
  globalThis.window?.addEventListener("pagehide", () => {
    name9.removeFromParent();
    name9.geometry.dispose();
    name9.material.dispose();
  }, {
    once: true
  });
  previewScene2.onBeforeRender = function (...argPrimary) {
    if (changed.stats.inCapture) {
      if (comparisonFlag2) {
        studioReady?.sync(argPrimary[2], true);
      }
      return;
    }
    tickShadowIntensityFade();
    if (!floorShadowMotionActive) {
      profileFrameWork("curtains", () => localValue2?.());
    }
    if (boolFlag && !floorShadowMotionActive) {
      if (localValue3 !== worldGroup || localValue4 !== planCanvas) {
        localValue3 = worldGroup;
        localValue4 = planCanvas;
        push22 = [];
        push23 = [];
        worldGroup?.updateWorldMatrix(true, true);
        worldGroup?.traverse(userData4 => {
          if (userData4.userData?.environmentModelType === "curtain") {
            push23.push(new THREE.Box3().setFromObject(userData4));
          }
        });
        previewScene2.traverse(isLight => {
          if (isLight.isLight && isLight.castShadow && isLight.shadow) {
            push22.push(isLight);
          }
        });
      }
      for (const shadow2 of push22) {
        shadow2.shadow.needsUpdate = true;
      }
      renderCache?.invalidate(arrayValue2, true);
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
        detail: detail2?.stats
      });
      if (renderer.domElement.dataset.reflectionStats !== reflectionStats) {
        renderer.domElement.dataset.reflectionStats = reflectionStats;
      }
    }
  };
  function recreateOrbitControlsAtTarget(domEvent = orbitControls.target.clone()) {
    const distanceTo = camera2.position.clone();
    orbitControls.dispose();
    orbitControls = createOrbitControls(camera2);
    camera2.position.copy(distanceTo);
    orbitControls.target.copy(domEvent);
    const localValue12 = Math.max(distanceTo.distanceTo(domEvent), 0.001);
    const localValue13 = distanceTo.clone().sub(domEvent).normalize().angleTo(camera2.up);
    orbitControls.minDistance = Math.min(2, localValue12);
    orbitControls.maxDistance = Math.max(100, localValue12 * 2);
    orbitControls.minZoom = Math.min(0.35, camera2.zoom);
    orbitControls.maxZoom = Math.max(6, camera2.zoom);
    orbitControls.maxPolarAngle = Math.max(Math.PI * 0.49, localValue13 + 0.00001);
    orbitControls.enableRotate = true;
    orbitControls.enabled = enabled8;
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
      return previewScene2;
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
      localValue2 = argPrimary;
    },
    curtainFrame({
      key: argPrimary,
      structure: argPrimary2,
      floorIds: argPrimary3 = [],
      moving: argPrimary4
    }) {
      const comparisonFlag = argPrimary !== saveState;
      const localValue12 = curtainMotionActive;
      if (!!comparisonFlag || localValue12 !== argPrimary4) {
        if (comparisonFlag) {
          try {
            const helperFn = argPrimary => {
              const lookupMap = new Map();
              for (const localValue of JSON.parse(argPrimary)) {
                const localValue2 = localValue[1];
                if (!lookupMap.has(localValue2)) {
                  lookupMap.set(localValue2, []);
                }
                lookupMap.get(localValue2).push(localValue);
              }
              return lookupMap;
            };
            const keysVar = helperFn(saveState);
            const keys2 = helperFn(argPrimary);
            changed.changed([...new Set([...keysVar.keys(), ...keys2.keys()])].filter(argPrimary => JSON.stringify(keysVar.get(argPrimary)) !== JSON.stringify(keys2.get(argPrimary))));
          } catch {
            changed.changed(argPrimary3);
          }
        }
        if (argPrimary2 !== importPlan) {
          shadowAtlas?.prepareRoot(worldGroup);
          studioReady?.invalidate();
        }
        arrayValue2 = [...new Set([...arrayValue, ...argPrimary3])];
        arrayValue = argPrimary3;
        if (comparisonFlag || argPrimary4) {
          if (!localValue12) {
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
        curtainMotionActive = argPrimary4;
        importPlan = argPrimary2;
        if (!argPrimary4) {
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
      let userData27;
      worldGroup?.traverse(userData13 => {
        if (userData13.userData?.environmentFloorId === argPrimary && userData13.userData?.environmentModelId === argSecondary) {
          userData27 = userData13;
        }
      });
      if (!userData27) {
        return null;
      }
      userData27 = userData27.userData.vacuumMobileRoot || userData27;
      userData27.updateWorldMatrix(true, true);
      const union = new THREE.Box3();
      const copy = new THREE.Box3();
      userData27.traverse(geometry3 => {
        if (!!geometry3.isMesh && !!geometry3.geometry) {
          for (let parent = geometry3; parent && parent !== userData27; parent = parent.parent) {
            if (parent.userData?.environmentEffect) {
              return;
            }
          }
          geometry3.geometry.computeBoundingBox();
          if (geometry3.geometry.boundingBox) {
            union.union(copy.copy(geometry3.geometry.boundingBox).applyMatrix4(geometry3.matrixWorld));
          }
        }
      });
      if (union.isEmpty()) {
        return null;
      } else {
        return {
          center: union.getCenter(new THREE.Vector3()).toArray(),
          size: union.getSize(new THREE.Vector3()).toArray(),
          forward: new THREE.Vector3(0, 0, 1).transformDirection(userData27.matrixWorld).toArray()
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
    pickEnvironmentModel(argPrimary, argSecondary, length9 = [], numericParam = 0) {
      if (!worldGroup || !length9.length) {
        return null;
      }
      const width6 = renderer.domElement.getBoundingClientRect();
      if (!width6.width || !width6.height) {
        return null;
      }
      const has8 = new Set(length9.map(floorId3 => JSON.stringify([floorId3.floorId, floorId3.modelId])));
      const get3 = new Map();
      const push15 = [];
      const add2 = new Set();
      worldGroup.updateWorldMatrix(true, true);
      camera2.updateMatrixWorld();
      worldGroup.traverse(material2 => {
        if (!material2.isMesh) {
          return;
        }
        let floorId5 = null;
        for (let userData7 = material2; userData7; userData7 = userData7.parent) {
          if (!userData7.visible || userData7.userData?.environmentEffect) {
            return;
          }
          if (!floorId5 && userData7.userData?.environmentModelId) {
            floorId5 = {
              modelId: userData7.userData.environmentModelId,
              floorId: userData7.userData.environmentFloorId
            };
          }
        }
        if (!!floorId5 && !!has8.has(JSON.stringify([floorId5.floorId, floorId5.modelId])) && !!(Array.isArray(material2.material) ? material2.material : [material2.material]).some(visible2 => visible2 && visible2.visible !== false && visible2.opacity !== 0)) {
          get3.set(material2, floorId5);
          push15.push(material2);
          if (material2.userData?.curtainMotionPanel) {
            add2.add(JSON.stringify([floorId5.floorId, floorId5.modelId]));
          }
        }
      });
      const cacheKey = push15.filter(userData8 => {
        const floorId4 = get3.get(userData8);
        return !add2.has(JSON.stringify([floorId4.floorId, floorId4.modelId])) || userData8.userData?.curtainMotionPanel;
      });
      const setFromCamera = new THREE.Raycaster();
      const localValue12 = Math.max(0, Math.min(12, numericParam));
      const arrayValue3 = [[0, 0], ...(localValue12 ? [[localValue12, 0], [-localValue12, 0], [0, localValue12], [0, -localValue12], [localValue12 * 0.7, localValue12 * 0.7], [-localValue12 * 0.7, localValue12 * 0.7], [localValue12 * 0.7, -localValue12 * 0.7], [-localValue12 * 0.7, -localValue12 * 0.7]] : [])];
      for (const [localValue, localValue2] of arrayValue3) {
        setFromCamera.setFromCamera(new THREE.Vector2((argPrimary + localValue - width6.left) / width6.width * 2 - 1, 1 - (argSecondary + localValue2 - width6.top) / width6.height * 2), camera2);
        for (const object of setFromCamera.intersectObjects(cacheKey, false)) {
          const visible4 = Array.isArray(object.object.material) ? object.object.material[object.face?.materialIndex || 0] : object.object.material;
          if (visible4?.visible !== false && visible4?.opacity !== 0) {
            return get3.get(object.object);
          }
        }
      }
      return null;
    },
    get camera() {
      return camera2;
    },
    get controls() {
      return orbitControls;
    },
    get document() {
      return projectDoc2;
    },
    get defaults() {
      return DEFAULT_BASE_LIGHTING;
    },
    get regionLighting() {
      return studioReady;
    },
    invalidateRegionLighting() {
      studioReady?.sync(camera2);
      updateLightPreview();
    },
    transformCamera(argPrimary, argSecondary, flag = false) {
      return transformSceneCamera(argPrimary, combinedFixedCameraView, projectDoc2, argSecondary, flag);
    },
    async readSceneUpdate(argPrimary) {
      const get4 = new URLSearchParams(window.location.search);
      const constructedURLSearchParams = new URLSearchParams({
        projectId: get4.get("projectId") || "",
        since: hasProjectLoaded2.syncKey || ""
      });
      const scene7 = await withRequestTimeout(15000, async signal => {
        const status = await fetch("/api/v1/modules/interaction3d/scenes/" + encodeURIComponent(get4.get("sceneId") || "") + "/current?" + constructedURLSearchParams, {
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
      if (!scene7) {
        return null;
      }
      const full = sceneUpdatePlan(normalizeProjectDocument(hasProjectLoaded2.scene), normalizeProjectDocument(scene7.scene));
      if (!full.full && !full.floors.length) {
        const baseLighting2 = normalizeProjectDocument(scene7.scene);
        projectDoc2.baseLighting = baseLighting2.baseLighting;
        for (const id2 of baseLighting2.floors) {
          const name = projectDoc2.floors.find(id2 => id2.id === id2.id);
          if (name) {
            name.name = id2.name;
          }
        }
        if (full.lighting && !boolFlag2) {
          helperFn2();
          applyBaseLighting(baseLighting2.baseLighting);
        }
        hasProjectLoaded2 = scene7;
        return null;
      }
      return scene7;
    },
    get savedScene() {
      return hasProjectLoaded2;
    },
    async replaceScene(scene8) {
      const activeFloorId2 = normalizeProjectDocument(scene8.scene);
      const floors = sceneUpdatePlan(normalizeProjectDocument(hasProjectLoaded2.scene), activeFloorId2);
      finish.finish();
      helperFn2(floors.full || floors.lighting ? null : new Set(floors.floors));
      stopAllLightAnimations();
      localValue7 = null;
      clone3 = null;
      boolFlag5 = false;
      localValue5 = null;
      localValue6 = null;
      if (!floors.full) {
        activeFloorId2.activeFloorId = activeFloorId;
        activeFloorId2.previewFloorMode = projectDoc2.previewFloorMode;
        for (const scene3 of activeFloorId2.floors) {
          scene3.scene.settings.livePreviewEnabled = true;
          const scene2 = projectDoc2.floors.find(id2 => id2.id === scene3.id);
          if (scene2 && !floors.floors.includes(scene3.id)) {
            for (const id2 of scene3.scene.lightGroups) {
              const enabled = scene2.scene.lightGroups.find(id2 => id2.id === id2.id);
              if (enabled) {
                id2.enabled = enabled.enabled;
              }
            }
            for (const type of scene3.scene.items) {
              if (!lightItemTypes2.has(type.type)) {
                continue;
              }
              const lightBrightness = scene2.scene.items.find(id2 => id2.id === type.id);
              if (lightBrightness) {
                type.lightBrightness = lightBrightness.lightBrightness;
                type.lightTemperature = lightBrightness.lightTemperature;
              }
            }
          }
        }
        projectDoc2 = activeFloorId2;
        hasProjectLoaded2 = scene8;
        floorScene2 = activeFloor().scene;
        removeWorldModelLayer(new Set(floors.floors));
        Promise.allSettled(loadVisibleExternalModels());
        return;
      }
      await loadProjectDocument(scene8);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    },
    coverSceneUpdate() {
      const width7 = document.createElement("canvas");
      width7.width = renderer.domElement.width;
      width7.height = renderer.domElement.height;
      renderer.render(previewScene2, camera2);
      const drawImage = width7.getContext("2d");
      drawImage.drawImage(renderer.domElement, 0, 0);
      if (!previewLightCache.hidden) {
        drawImage.drawImage(previewLightCache, 0, 0, width7.width, width7.height);
      }
      const visibility = renderer.domElement.style.visibility;
      const visibility2 = previewLightCache.style.visibility;
      renderer.domElement.style.visibility = "hidden";
      previewLightCache.style.visibility = "hidden";
      Object.assign(width7.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "6",
        pointerEvents: "auto"
      });
      width7.setAttribute("aria-label", "正在同步户型");
      selectEl("#preview-3d").append(width7);
      return () => {
        renderer.domElement.style.visibility = visibility;
        previewLightCache.style.visibility = visibility2;
        width7.remove();
      };
    },
    getOrbitCenter() {
      return (computeMultiFloorBoundsCenter() || resolveOrbitPanTarget(orbitControls.target)).toArray();
    },
    setOrbitPivot(argPrimary) {
      clone3 = argPrimary ? new THREE.Vector3().fromArray(argPrimary) : null;
      syncOrbitControlsBinding();
    },
    orbitCameraPose(target, argSecondary) {
      const up2 = structuredClone(target);
      const computedValue = finite(argSecondary, 0) % (Math.PI * 2);
      if (Math.abs(computedValue) < 1e-12 || Math.abs(Math.abs(computedValue) - Math.PI * 2) < 1e-12) {
        return up2;
      }
      clone3 ||= resolveOrbitPanTarget(new THREE.Vector3().fromArray(target.target));
      const localValue12 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), computedValue);
      for (const localValue of ["position", "target"]) {
        up2[localValue] = new THREE.Vector3().fromArray(target[localValue]).sub(clone3).applyQuaternion(localValue12).add(clone3).toArray();
      }
      let clone2 = new THREE.Vector3().fromArray(target.up || [0, 1, 0]);
      const localValue13 = new THREE.Vector3().fromArray(target.position).sub(new THREE.Vector3().fromArray(target.target));
      if (clone2.lengthSq() < 1e-12 || clone2.clone().cross(localValue13).lengthSq() < 1e-12) {
        const localValue = THREE.MathUtils.degToRad(finite(target.topRotation, 0));
        clone2 = new THREE.Vector3(Math.sin(localValue), 0, -Math.cos(localValue));
        if (clone2.clone().cross(localValue13).lengthSq() < 1e-12) {
          clone2.set(1, 0, 0);
        }
      }
      up2.up = clone2.applyQuaternion(localValue12).toArray();
      return up2;
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
      const comparisonFlag = argSecondary && (height10 || mode.mode !== argPrimary);
      const fromHeight = comparisonFlag ? height10?.height ?? resetOrbitTarget(camera2, orbitControls.target) : 0;
      const fromWeight = height10?.weight ?? (mode.mode === "perspective" ? 1 : 0);
      height10 = null;
      boolFlag3 = true;
      boolFlag4 = false;
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
        height10 = {
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
    applyCameraPose(view2, numericParam = 1, preserveLightCache2 = true) {
      if (height10) {
        if (numericParam >= 1) {
          height10 = null;
        } else {
          height10.height = height10.fromHeight + (height10.toHeight - height10.fromHeight) * numericParam;
          height10.weight = height10.fromWeight + (height10.toWeight - height10.fromWeight) * numericParam;
        }
      }
      softLockPreviewOrbit();
      const cameraView2 = activeCameraSettings();
      cameraView2.cameraView = view2.view || "free";
      cameraView2.cameraTopRotation = view2.topRotation || 0;
      cameraView2.cameraFocalLength = view2.focalLength || 50;
      camera2.position.fromArray(view2.position);
      orbitControls.target.fromArray(view2.target);
      camera2.up.fromArray(view2.up || [0, 1, 0]);
      camera2.zoom = view2.zoom;
      camera2.userData.frameSize = view2.frameSize || 10;
      camera2.userData.cameraView = cameraView2.cameraView;
      camera2.userData.topRotation = cameraView2.cameraTopRotation;
      if (camera2.isOrthographicCamera) {
        focusCameraOnPoint(camera2.userData.frameSize, camera2.userData.viewportAspect || 1);
      } else {
        applyCameraFocalLength();
      }
      camera2.lookAt(orbitControls.target);
      getCameraPose(camera2, orbitControls.target);
      camera2.updateMatrixWorld();
      syncRendererSizeCacheKey();
      requestRender({
        preserveLightCache: preserveLightCache2
      });
    },
    endCameraMotion() {
      motionPresentation.camera(false);
      boolFlag3 = false;
      recreateOrbitControlsAtTarget();
      unlockPreviewOrbit();
      requestRender();
      if (typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue && !size.size) {
        if (localValue14 !== null) {
          window.clearTimeout(localValue14);
        }
        localValue14 = window.setTimeout(finishLightCacheCapture, 180);
      }
    },
    setFloorGap(argPrimary) {
      const conditionalValue = Number.isFinite(argPrimary) ? clamp(argPrimary, 0, 20) : null;
      if (conditionalValue !== null || localValue !== null) {
        const previewFloorGap = conditionalValue ?? normalizeProjectDocument(hasProjectLoaded2.scene).previewFloorGap;
        if (Math.abs(projectDoc2.previewFloorGap - previewFloorGap) > 0.000001) {
          finish.finish();
          const comparisonFlag = getPreviewFloorMode2() === "all";
          const conditionalValue = comparisonFlag ? finish.take(projectDoc2.floors.map(id2 => id2.id), findFloorOrbitCenter, true) : [];
          projectDoc2.previewFloorGap = previewFloorGap;
          for (const id2 of conditionalValue) {
            finish.reuse(id2, findFloorOrbitCenter(id2.id));
          }
          if (comparisonFlag) {
            clone3 = null;
            localValue9 = null;
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
    appearance(baseLighting2) {
      const cacheKey = JSON.stringify([baseLighting2.baseLighting, baseLighting2.lightingMode, baseLighting2.lightRegionOverrides]);
      if (cacheKey !== emptyText) {
        helperFn2();
        emptyText = cacheKey;
        changed.changed();
      }
      if (changed.configure(baseLighting2.groundReflection)) {
        exportFolderQuery = JSON.stringify(changed.settings);
        requestRender();
      }
      studioReady?.setOverrides(baseLighting2.lightRegionOverrides || {});
      boolFlag2 = !!baseLighting2.baseLighting;
      const clampedValue = clamp(finite(baseLighting2.renderScale, 1), 0.25, 2);
      const conditionalValue = typeof baseLighting2.motionRenderScale == "number" && Number.isFinite(baseLighting2.motionRenderScale) ? clamp(baseLighting2.motionRenderScale, 0.25, 1) : null;
      if (clampedValue !== ur || conditionalValue !== isAutoDiagramEmbed) {
        ur = clampedValue;
        isAutoDiagramEmbed = conditionalValue;
        renderer.setPixelRatio(computeStudioPixelRatio(previewOrbitLocked));
        onPreviewContainerResize();
        requestRender();
      }
      const comparisonFlag = boolTrue !== (baseLighting2.backgroundVisible !== false);
      boolTrue = baseLighting2.backgroundVisible !== false;
      document.body.classList.toggle("is-background-hidden", !boolTrue);
      collectShadowCastingLights();
      const floorBrightness = normalizeBaseLighting(baseLighting2.baseLighting || projectDoc2.baseLighting);
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
      const position7 = argPrimary === "all" ? combinedFixedCameraView?.combinedFixedCameraView : combinedFixedCameraView?.floors.find(id2 => id2.id === argPrimary)?.scene.settings?.fixedCameraView;
      if (!position7) {
        return null;
      }
      const objectValue2 = {
        mode: position7.mode,
        view: position7.view,
        topRotation: position7.topRotation,
        position: [position7.position.x, position7.position.y, position7.position.z],
        target: [position7.target.x, position7.target.y, position7.target.z],
        zoom: 1,
        frameSize: position7.visibleHeight,
        focalLength: position7.focalLength || 50
      };
      return transformSceneCamera(objectValue2, combinedFixedCameraView, projectDoc2, argPrimary);
    },
    get floorTransitionActive() {
      return finish.active;
    },
    advanceFloorTransition(argPrimary, argSecondary) {
      const projections = argSecondary ? {
        height: height10 ? height10.fromHeight + (height10.toHeight - height10.fromHeight) * argPrimary : computeCameraViewHeight(argSecondary),
        weight: height10 ? height10.fromWeight + (height10.toWeight - height10.fromWeight) * argPrimary : argSecondary.mode === "perspective" ? 1 : 0,
        distance: new THREE.Vector3().fromArray(argSecondary.position).distanceTo(new THREE.Vector3().fromArray(argSecondary.target))
      } : null;
      profileFrameWork("motion-and-settle", () => finish.sample(argPrimary, argSecondary, projections));
    },
    setFloorSlideCameras(argPrimary, argSecondary) {
      const viewDistance = view => new THREE.Vector3().fromArray(view.position).distanceTo(new THREE.Vector3().fromArray(view.target));
      finish.setSlideCameras(argPrimary, argSecondary, {
        from: {
          height: height10?.fromHeight ?? computeCameraViewHeight(argPrimary),
          weight: height10?.fromWeight ?? (argPrimary.mode === "perspective" ? 1 : 0),
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
      return comparisonFlag3;
    },
    transitionFloor(target2) {
      if (typeof isPerfDiagnosticsEnabled !== "undefined" && isPerfDiagnosticsEnabled) {
        perfStats.floorSwitch = {
          target: target2,
          last: performance.now(),
          until: Infinity,
          frames: 0,
          maxMs: 0,
          longFrames: 0,
          cpuMs: 0
        };
      }
      const localValue12 = [...projectDoc2.floors].sort((elevation3, elevation4) => elevation3.elevation - elevation4.elevation).map(id2 => id2.id);
      const helperFn3 = argPrimary => {
        const scene4 = projectDoc2.floors.find(id2 => id2.id === argPrimary);
        const computedValue = scene4.scene.calibration?.pixelsPerMeter || 1;
        const localValue = this.worldPoint(argPrimary, 0, 0, 0);
        return new THREE.Matrix4().makeBasis(this.worldPoint(argPrimary, computedValue, 0, 0).sub(localValue), new THREE.Vector3(0, 1, 0), this.worldPoint(argPrimary, 0, computedValue, 0).sub(localValue)).setPosition(localValue);
      };
      const comparisonFlag = getPreviewFloorMode2() === "all";
      const cacheKey3 = comparisonFlag ? "all" : activeFloorId;
      const findVar = profileFrameWork("detach-source", () => finish.take(comparisonFlag ? localValue12 : [activeFloorId], helperFn3, comparisonFlag));
      for (const cacheKey of findVar) {
        cacheKey.cacheKey ||= cacheKey3;
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
      const comparisonFlag4 = !comparisonFlag && target2 !== "all";
      const conditionalValue = comparisonFlag4 ? new THREE.Vector3(0, 1, 0).applyQuaternion(camera2.quaternion).normalize() : null;
      const conditionalValue2 = comparisonFlag4 ? resetOrbitTarget(camera2, orbitControls.target) * 1.2 : Math.max(20, x32.x, x32.z) * 1.5;
      const scrollFrom = findVar.find(record => Number.isFinite(record.scrollPosition))?.scrollPosition ?? localValue12.indexOf(cacheKey3);
      const targetIndex = localValue12.indexOf(target2);
      const handoffRange = comparisonFlag4 ? localValue12.slice(Math.min(Math.floor(scrollFrom), targetIndex), Math.max(Math.ceil(scrollFrom), targetIndex) + 1) : [];
      const map5 = target2 === "all" ? localValue12 : [target2, ...handoffRange.filter(id2 => id2 !== target2)];
      const everyVar = map5.map(argPrimary => findVar.find(id2 => id2.id === argPrimary && id2.cacheEpoch === cacheEpoch) || entryMap.get(argPrimary));
      const reusedCount = everyVar.filter(Boolean).length;
      if (comparisonFlag4) {
        for (let index = 0; index < map5.length; index++) {
          if (everyVar[index]) {
            continue;
          }
          this.setFloor(map5[index]);
          const captured = finish.capture([map5[index]], helperFn3, false)[0];
          captured.frame = captured.baseFrame.clone();
          captured.cacheKey = map5[index];
          captured.cacheEpoch = cacheEpoch;
          captured.node.removeFromParent();
          everyVar[index] = captured;
        }
      }
      const length10 = everyVar.every(Boolean) ? everyVar : null;
      if (length10 && reusedCount === map5.length) {
        reusedTransitions.reusedTransitions++;
      } else {
        reusedTransitions.rebuiltTransitions++;
      }
      if (length10) {
        reusedTransitions.reusedFloors += reusedCount;
      }
      renderer.domElement.dataset.floorReuseStats = JSON.stringify(reusedTransitions);
      if (length10) {
        for (const node of length10) {
          releaseRoot?.releaseRoot?.(node.node);
          studioReady?.releaseRoot?.(node.node);
          entryMap.delete(node.id);
        }
      } else {
        helperFn2(new Set(map5));
      }
      profileFrameWork("set-destination", () => this.setFloor(target2, length10, helperFn3));
      const localValue13 = this.getOrbitCenter();
      const localValue20 = profileFrameWork("capture-destination", () => finish.capture(map5, helperFn3, target2 === "all" || map5.length > 1));
      for (const cacheKey2 of localValue20) {
        cacheKey2.cacheKey = target2;
        cacheKey2.cacheEpoch = cacheEpoch;
      }
      profileFrameWork("begin-motion", () => finish.begin(findVar, localValue20, localValue12, conditionalValue2, comparisonFlag4, conditionalValue, target2));
      localValue2?.();
      return localValue13;
    },
    setFloor(floorEntry, optionalValue = null, argTertiary = findFloorOrbitCenter) {
      const id2 = projectDoc2.floors.find(id2 => id2.id === floorEntry) || projectDoc2.floors[0];
      const previewFloorMode = floorEntry === "all" && projectDoc2.floors.length > 1 ? "all" : "active";
      if (!!optionalValue || activeFloorId !== id2.id || getPreviewFloorMode2() !== previewFloorMode) {
        if (size.size || typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue) {
          stopAllLightAnimations();
        }
        boolFlag5 = false;
        activeFloorId = id2.id;
        projectDoc2.activeFloorId = id2.id;
        floorScene2 = id2.scene;
        if (optionalValue) {
          projectDoc2.previewFloorMode = previewFloorMode;
          syncPreviewFloorButtons();
          syncFloorCameraChrome();
          const idValue = [...projectDoc2.floors].sort((elevation, elevation2) => elevation.elevation - elevation2.elevation)[0].id;
          for (const id2 of optionalValue) {
            finish.reuse(id2, argTertiary(id2.id)).traverse(userData => {
              if (["background", "grid"].includes(userData.userData?.exportRole)) {
                userData.userData.floorBackgroundHidden = previewFloorMode === "all" && id2.id !== idValue;
                userData.visible = boolTrue && !userData.userData.floorBackgroundHidden;
              }
            });
          }
          worldGroup.userData.regionFloorId = id2.id;
          if (studioReady) {
            worldGroup.traverse(userData2 => {
              if (!userData2.isLight || !userData2.userData.lightItemId) {
                return;
              }
              const localValue = projectDoc2.floors.find(id2 => id2.id === userData2.userData.lightFloorId)?.scene.items.find(id2 => id2.id === userData2.userData.lightItemId);
              if (localValue) {
                studioReady.register(userData2, localValue);
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
          applyCameraView2();
        } else {
          setPreviewFloorMode2(floorEntry === "all" ? "all" : "active", {
            persist: false
          });
        }
        clone3 = null;
      }
    },
    worldPoint,
    setLightStates,
    setEditorEffects,
    mapLightEffectState: argPrimary => mapLightEffectState(argPrimary),
    lightEffectColorHex: argPrimary => lightEffectColorHex(argPrimary),
    cameraState(flag = false) {
      if (flag) {
        recreateOrbitControlsAtTarget();
      }
      return {
        position: camera2.position.toArray(),
        target: orbitControls.target.toArray(),
        zoom: camera2.zoom,
        mode: camera2.isPerspectiveCamera ? "perspective" : "orthographic",
        up: camera2.up.toArray(),
        frameSize: camera2.userData.frameSize || 10,
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
      const enabled4 = rotationMode.enabled === true;
      const comparisonFlag = rotationMode.panEnabled !== false;
      const comparisonFlag4 = rotationMode.zoomEnabled !== false;
      const comparisonFlag5 = enabled8 !== enabled4 || stringValue !== conditionalValue || enablePan !== comparisonFlag || enableZoom !== comparisonFlag4;
      enabled8 = enabled4;
      stringValue = conditionalValue;
      enablePan = comparisonFlag;
      enableZoom = comparisonFlag4;
      if (comparisonFlag5) {
        recreateOrbitControlsAtTarget();
      } else {
        orbitControls.enabled = enabled4;
      }
      syncOrbitControlsBinding();
    },
    whenPresented() {
      localValue7 ||= (async () => {
        const localValue = loadVisibleExternalModels();
        let localValue2;
        try {
          await Promise.race([Promise.allSettled(localValue), new Promise(argPrimary => {
            localValue2 = window.setTimeout(argPrimary, 8000);
          })]);
        } finally {
          window.clearTimeout(localValue2);
        }
        refreshStudioChrome();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        collectShadowCastingLights();
        await waitUntilPreviewQualityReady();
        renderer.render(previewScene2, camera2);
        await new Promise(requestAnimationFrame);
      })();
      return localValue7;
    },
    setCameraView(argPrimary) {
      activeCameraSettings().cameraView = argPrimary === "top" ? "top" : "free";
      nudgeCamera(activeCameraSettings().cameraView, {
        force: true
      });
    },
    restoreCamera(mode2) {
      height10 = null;
      if (!mode2) {
        applyCameraView2();
        recreateOrbitControlsAtTarget();
        return;
      }
      const cameraView3 = activeCameraSettings();
      cameraView3.cameraMode = mode2.mode;
      cameraView3.cameraView = mode2.view || "free";
      cameraView3.cameraTopRotation = mode2.topRotation || 0;
      cameraView3.cameraFocalLength = mode2.focalLength || 50;
      setCameraProjectionMode(mode2.mode, {
        preserveView: false
      });
      camera2.position.fromArray(mode2.position);
      if (mode2.up) {
        camera2.up.fromArray(mode2.up);
      }
      orbitControls.target.fromArray(mode2.target);
      camera2.zoom = mode2.zoom;
      if (mode2.frameSize) {
        camera2.userData.frameSize = mode2.frameSize;
      }
      camera2.userData.cameraView = cameraView3.cameraView;
      camera2.userData.topRotation = cameraView3.cameraTopRotation;
      getCameraPose(camera2, orbitControls.target);
      onPreviewContainerResize();
      recreateOrbitControlsAtTarget(orbitControls.target.clone());
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
