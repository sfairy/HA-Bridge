import {
  RENDER_CACHE_VERSION,
  createRenderCache,
  cacheSceneDescriptor,
  sha256,
  stableCacheJSON,
} from "../modules/interaction3d/render-cache.js?v=20260907-demand-v1";
import { transformSceneCamera } from "../modules/interaction3d/scene-frame.js?v=20260907-scene-sync-v1";
import { sceneUpdatePlan } from "../modules/interaction3d/scene-update.js?v=20260907-update-v1";
import { createDemandFrameLoop } from "../modules/interaction3d/frame-loop.js?v=20260907-demand-v1";
import { cacheObjectTransforms } from "../modules/interaction3d/scene-matrices.js?v=20260907-demand-v2";
import { withRequestTimeout } from "../utils/request-timeout.js?v=20260907-browser-compat-v1";
import * as THREE from "/bridge-static/vendor/three/0.182.0/three.module.min.js";
import { OrbitControls } from "/bridge-static/vendor/three/0.182.0/OrbitControls.js?v=20260903-camera-target-smoothing-v1";
import { RoundedBoxGeometry } from "/bridge-static/vendor/three/0.182.0/RoundedBoxGeometry.js";
import { mergeGeometries } from "/bridge-static/vendor/three/0.182.0/BufferGeometryUtils.js";
import { GLTFLoader } from "/bridge-static/vendor/three/0.182.0/GLTFLoader.js?v=20260811-three-0182-glb2";
import { SameOriginDRACOLoader } from "./draco-loader.js?v=20260904-csp-static-worker-v1";
import {
  createLightTransition,
  sampleLightTransition,
  lightTransitionDurationMs,
  mapLightEffectState,
  lightEffectColorHex,
} from "../modules/interaction3d/light-motion.js?v=20260907-light-defaults-v1";
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
} from "./geometry.js?v=20260903-wall-overlap-guard-v1-20260904-local-shadow-bands-v1-20260905-bounded-wall-faces-v1";
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
} from "./studio-external-models.js?v=20260904-studio-external-models-v48-load-state-20260905-client-log-v1-20260907-cache-representation-v1";
import {
  createPlanDrawingTools,
  drawTrackedText,
} from "./studio-plan-drawing.js?v=20260901-studio-plan-drawing-v2";
import { createSpotShadowAtlasController } from "./studio-shadow-atlas.js?v=20260908-frag-shadow-coord-v8";
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
const selectEl = (selector) => document.querySelector(selector);
const isStageEmbed =
  window.location.pathname === "/api/v1/modules/interaction3d/stage.html";
let studioPixelRatio = 1;
let studioReady = true;
const renderCache = isStageEmbed
  ? createRenderCache({
      sceneId: new URLSearchParams(window.location.search).get("sceneId"),
      projectId: new URLSearchParams(window.location.search).get("projectId"),
      report: (cacheReport) => {
        document.documentElement.dataset.lightRenderCache =
          JSON.stringify(cacheReport);
      },
    })
  : null;
window.addEventListener("pagehide", () => renderCache?.close(), {
  once: true,
});
function computeLightRenderCacheKey(width, height) {
  const floors =
    getPreviewFloorMode() === "all" ? projectDoc.floors : [activeFloor()];
  camera.updateMatrixWorld();
  const roundMatrix = (elements) =>
    elements.map((n) => Math.round(n * 100000000) / 100000000);
  const visibility = [];
  worldGroup.traverse((object3d) => {
    if (["background", "grid"].includes(object3d.userData?.exportRole)) {
      visibility.push([
        object3d.userData.exportRole,
        object3d.visible,
      ]);
    }
  });
  return sha256(
    stableCacheJSON({
      version: RENDER_CACHE_VERSION,
      scene: cacheSceneDescriptor(floors),
      mode: getPreviewFloorMode(),
      gap: projectDoc.previewFloorGap,
      lighting: baseLighting,
      style: themeColors,
      visibility: visibility,
      models: externalModels.cacheRepresentation(
        floors.flatMap((floor) => floor.scene.items),
      ),
      camera: {
        world: roundMatrix(camera.matrixWorld.elements),
        projection: roundMatrix(camera.projectionMatrix.elements),
      },
      width: width,
      height: height,
      toneMapping: renderer.toneMapping,
      exposure: renderer.toneMappingExposure,
      colorSpace: renderer.outputColorSpace,
      shadows: renderer.shadowMap.type,
    }),
  );
}
const autoDiagramComponentId =
  new URLSearchParams(window.location.search).get("auto-diagram-component") ||
  "";
const isAutoDiagramEmbed =
  new URLSearchParams(window.location.search).get("auto-diagram-embed") === "1";
const exportFolderQuery =
  new URLSearchParams(window.location.search).get("export-folder") || "";
const floorSelectionQuery = new URLSearchParams(window.location.search).has(
  "floor-selection",
)
  ? new URLSearchParams(window.location.search).get("floor-selection")
  : null;
if (isAutoDiagramEmbed) {
  document.body.classList.add("auto-diagram-embedded");
}
const planCanvas = selectEl("#plan-canvas");
const planStage = selectEl("#plan-stage");
const canvasEmpty = selectEl("#canvas-empty");
const projectName = selectEl("#project-name");
const saveState = selectEl("#save-state");
const importPlan = selectEl("#import-plan");
const planFile = selectEl("#plan-file");
const toggleBackground = selectEl("#toggle-background");
const removePlan = selectEl("#remove-plan");
const addFloor = selectEl("#add-floor");
const floorList = selectEl("#floor-list");
const alignFloor = selectEl("#align-floor");
const floorContextMenu = selectEl("#floor-context-menu");
const floorRenameDialog = selectEl("#floor-rename-dialog");
const floorRenameForm = selectEl("#floor-rename-form");
const floorRenameInput = selectEl("#floor-rename-input");
const floorDeleteDialog = selectEl("#floor-delete-dialog");
const floorDeleteForm = selectEl("#floor-delete-form");
const floorDeleteName = selectEl("#floor-delete-name");
const saveConflictDialog = selectEl("#save-conflict-dialog");
const saveConflictLoad = selectEl("#save-conflict-load");
const saveConflictOverwrite = selectEl("#save-conflict-overwrite");
const globalWallHeight = selectEl("#global-wall-height");
const globalWallThickness = selectEl("#global-wall-thickness");
const globalWallOpacity = selectEl("#global-wall-opacity");
const toggleFloorEdge = selectEl("#toggle-floor-edge");
const toolEls = [...document.querySelectorAll("[data-tool]")];
const finishWall = selectEl("#finish-wall");
const deleteSelection = selectEl("#delete-selection");
const activeToolLabel = selectEl("#active-tool-label");
const toolHelp = selectEl("#tool-help");
const cursorPosition = selectEl("#cursor-position");
const snapIndicator = selectEl("#snap-indicator");
const snapToggle = selectEl("#snap-toggle");
const snapToggleState = selectEl("#snap-toggle-state");
const snapSettingsToggle = selectEl("#snap-settings-toggle");
const snapSettingsPanel = selectEl("#snap-settings-panel");
const snapSettingEls = [...document.querySelectorAll("[data-snap-setting]")];
const snapTolerance = selectEl("#snap-tolerance");
const snapToleranceValue = selectEl("#snap-tolerance-value");
const zoomValue = selectEl("#zoom-value");
const scaleDialog = selectEl("#scale-dialog");
const scaleForm = selectEl("#scale-form");
const referencePixels = selectEl("#reference-pixels");
const referenceMeters = selectEl("#reference-meters");
const lightGroupRenameDialog = selectEl("#light-group-rename-dialog");
const lightGroupRenameForm = selectEl("#light-group-rename-form");
const lightGroupRenameInput = selectEl("#light-group-rename-input");
const lightPropertyApplyDialog = selectEl("#light-property-apply-dialog");
const lightPropertyApplyForm = selectEl("#light-property-apply-form");
const lightPropertyTargetList = selectEl("#light-property-target-list");
const lightPropertySelectionCount = selectEl("#light-property-selection-count");
const lightPropertyToggleAll = selectEl("#light-property-toggle-all");
const lightPropertyApplyTitle = selectEl("#light-property-apply-title");
const lightPropertyApplyValue = selectEl("#light-property-apply-value");
const applyLightPropertyEls = [
  ...document.querySelectorAll("[data-apply-light-property]"),
];
const toast = selectEl("#toast");
const inspectorEmpty = selectEl("#inspector-empty");
const selectionInspector = selectEl("#selection-inspector");
const selectionHeadingEl = selectEl(".selection-heading");
const selectionId = selectEl("#selection-id");
const lightPreviewNote = selectEl("#light-preview-note");
const wallFields = selectEl("#wall-fields");
const windowFields = selectEl("#window-fields");
const doorFields = selectEl("#door-fields");
const railingFields = selectEl("#railing-fields");
const itemFields = selectEl("#item-fields");
const labelTextFields = selectEl("#label-text-fields");
const lightFields = selectEl("#light-fields");
const itemHeightField = selectEl("#item-height-field");
const itemElevationField = selectEl("#item-elevation-field");
const itemRotationField = selectEl("#item-rotation-field");
const itemRotationActions = selectEl("#item-rotation-actions");
const itemVerticalRotationField = selectEl("#item-vertical-rotation-field");
const itemVerticalRotationLabel = selectEl("#item-vertical-rotation-label");
const itemStripOrientationHeading = selectEl("#item-strip-orientation-heading");
const itemStripRollField = selectEl("#item-strip-roll-field");
const itemStripRoll = selectEl("#item-strip-roll");
const itemLightSourceVisibilityField = selectEl(
  "#item-light-source-visibility-field",
);
const itemLightSourceVisible = selectEl("#item-light-source-visible");
const curtainPositionField = selectEl("#curtain-position-field");
const roundTableTurntableField = selectEl("#round-table-turntable-field");
const stairDirectionField = selectEl("#stair-direction-field");
const tvMountStyleField = selectEl("#tv-mount-style-field");
const shoeCabinetActions = selectEl("#shoe-cabinet-actions");
const shoeCabinetMirror = selectEl("#shoe-cabinet-mirror");
const itemWidthLabel = selectEl("#item-width-label");
const itemDepthLabel = selectEl("#item-depth-label");
const sceneCounts = selectEl("#scene-counts");
const previewSyncEls = [...document.querySelectorAll("[data-preview-sync]")];
const previewFloorEls = [...document.querySelectorAll("[data-preview-floor]")];
const refreshPreview = selectEl("#refresh-preview");
const refreshLightPreview = selectEl("#refresh-light-preview");
const previewQualityStatus = selectEl("#preview-quality-status");
const modelLoadingStatus = selectEl("#model-loading-status");
let orbitResumeAfterModels = false;
const previewLightCache = selectEl("#preview-light-cache");
const previewRenderShield = selectEl("#preview-render-shield");
let cameraViewDebounceTimer = null;
const cameraViewEls = [...document.querySelectorAll("[data-camera-view]")];
const cameraRotateTopEls = [
  ...document.querySelectorAll("[data-camera-rotate-top]"),
];
const cameraModeEls = [...document.querySelectorAll("[data-camera-mode]")];
const cameraFocalLengthEls = [
  ...document.querySelectorAll("[data-camera-focal-length]"),
];
const baseLightControlEls = [
  ...document.querySelectorAll("[data-base-light-control]"),
];
const baseLightControls = selectEl("#base-light-controls");
const baseLightControlsHeader = baseLightControls?.querySelector(
  ".base-light-controls-header",
);
const resetBaseLighting = selectEl("#reset-base-lighting");
const saveBaseLighting = selectEl("#save-base-lighting");
const closeBaseLighting = selectEl("#close-base-lighting");
const openBaseLightingButtons = [
  selectEl("#open-base-lighting"),
  selectEl("#export-open-base-lighting"),
].filter(Boolean);
if (baseLightControls && baseLightControls.parentElement !== document.body) {
  document.body.append(baseLightControls);
}
const saveCameraView = selectEl("#save-camera-view");
const fixedCameraView = selectEl("#fixed-camera-view");
const floorCameraActions = selectEl("#floor-camera-actions");
const overviewCameraActions = selectEl("#overview-camera-actions");
const saveOverviewView = selectEl("#save-overview-view");
const fixedOverviewView = selectEl("#fixed-overview-view");
const previewFloorGapControl = selectEl("#preview-floor-gap-control");
const previewFloorGapInput = selectEl("#preview-floor-gap");
const exportDialog = selectEl("#export-dialog");
const exportPreviewFrame = selectEl("#export-preview-frame");
const exportPreviewStage = selectEl("#export-preview-stage");
const exportPresetEmptyState = selectEl("#export-preset-empty-state");
const exportPresetEmptyTitle = selectEl("#export-preset-empty-title");
const exportWidth = selectEl("#export-width");
const exportHeight = selectEl("#export-height");
const exportLockRatio = selectEl("#export-lock-ratio");
const exportAspectLabel = selectEl("#export-aspect-label");
const exportResolutionLabel = selectEl("#export-resolution-label");
const exportStatus = selectEl("#export-status");
const exportPackage = selectEl("#export-package");
const exportFolderName = selectEl("#export-folder-name");
const exportSaveView = selectEl("#export-save-view");
const exportGroupFiles = selectEl("#export-group-files");
const exportFloorSelect = selectEl("#export-floor-select");
const exportFloorGapControl = selectEl("#export-floor-gap-control");
const exportFloorGap2 = selectEl("#export-floor-gap");
const exportPresetSlots = selectEl("#export-preset-slots");
const exportPresetAdd = selectEl("#export-preset-add");
const exportPresetRename = selectEl("#export-preset-rename");
const exportPresetDelete = selectEl("#export-preset-delete");
const exportPresetRenameDialog = selectEl("#export-preset-rename-dialog");
const exportPresetRenameForm = selectEl("#export-preset-rename-form");
const exportPresetRenameInput = selectEl("#export-preset-rename-input");
const exportPresetDeleteDialog = selectEl("#export-preset-delete-dialog");
const exportPresetDeleteForm = selectEl("#export-preset-delete-form");
const exportPresetDeleteName = selectEl("#export-preset-delete-name");
const exportOverwriteDialog = selectEl("#export-overwrite-dialog");
const exportOverwriteName = selectEl("#export-overwrite-name");
const exportCompleteDialog = selectEl("#export-complete-dialog");
const exportCompleteTitle = selectEl("#export-complete-title");
const exportCompleteMessage = selectEl("#export-complete-message");
const exportCompletePath = selectEl("#export-complete-path");
const studioShellEl = selectEl(".studio-shell");
const detailsPanelEl = selectEl(".details-panel");
const detailsResizer = selectEl("#details-resizer");
const assetCategoryEls = [
  ...document.querySelectorAll("[data-asset-category]"),
];
const assetHeadingCategoryEls = [
  ...document.querySelectorAll("[data-asset-heading-category]"),
];
const itemTypeButtons = [...document.querySelectorAll("[data-item-type]")];
const assetGrid = selectEl("#asset-grid");
const lightAssetRow = selectEl("#light-asset-row");
const lightLayerPanel = selectEl("#light-layer-panel");
const lightGroupList = selectEl("#light-group-list");
const addLightGroup = selectEl("#add-light-group");
const lightGroupsOff = selectEl("#light-groups-off");
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
  exposure: 1.05,
};
const furnitureCatalog = {
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
const itemCatalog = new Set([
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
const applianceColorTypes = new Set([
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
const lightItemTypes = new Set(["downlight", "ceilinglight", "striplight"]);
const stairLikeTypes = new Set(["stairs", "steelstairs", "glassstairs"]);
const stairItemTypes = new Set(["steelstairs", "glassstairs"]);
const roundTableTypes = new Set([
  "rounddiningtable",
  "rounddiningtableturntable",
]);
const tvMountStyles = new Set(["standard", "tabletop", "mobile"]);
const fridgeSize = Object.freeze({
  depth: 0.55,
  height: 1.55,
});
function hasRoundTableTurntable(item) {
  return (
    item?.type === "rounddiningtableturntable" ||
    item?.roundTableTurntable === true
  );
}
const defaultLightPresets = {
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
const lightHeightScaleByType = Object.freeze({
  downlight: 1.1,
  ceilinglight: 0.792,
  striplight: 1.3,
});
const defaultLightDepthCm = {
  downlight: 120,
  ceilinglight: 150,
  striplight: 120,
};
const MAX_DEFERRED_MODEL_LOADS = 8;
const SOFT_TEXTURE_UNIT_RESERVE = 2;
const RESERVED_TEXTURE_UNITS = 1;
const DEFAULT_MAX_TEXTURE_SIZE = 1024;
const MIN_PLAN_SNAP_METERS = 0.8;
const doorSizePresets = {
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
function defaultItemDepth(itemType) {
  return defaultLightDepthCm[itemType] || 120;
}
function projectHasItemModel(startsWith) {
  return !!projectDoc?.floors?.some((floor) =>
    floor.scene?.items?.some((tvMountStyle) => {
      if (startsWith.startsWith("tv_")) {
        const value = tvMountStyles.has(tvMountStyle.tvMountStyle)
          ? tvMountStyle.tvMountStyle
          : "standard";
        return (
          tvMountStyle.type === "tv" &&
          startsWith === "tv_" + value
        );
      }
      return tvMountStyle.type === startsWith;
    }),
  );
}
function collectExternalModelKeysFromFloors(floors = []) {
  return [
    ...new Set(
      floors.flatMap((floor) =>
        (floor?.scene?.items || [])
          .map((item) => modelTypeForItem(item))
          .filter((modelType) => ALL_ITEM_MODELS[modelType]),
      ),
    ),
  ];
}
function visibleExternalModelKeys() {
  const floors =
    getPreviewFloorMode() === "all"
      ? projectDoc?.floors || []
      : [activeFloor()].filter(Boolean);
  return collectExternalModelKeysFromFloors(floors);
}
const dracoLoader = new SameOriginDRACOLoader(
  "/bridge-static/3d-studio/draco-decoder-worker.js?v=20260904-csp-static-worker-v1",
);
dracoLoader.setDecoderPath("/bridge-static/vendor/three/0.182.0/draco/");
dracoLoader.setDecoderConfig({
  type: "wasm",
});
dracoLoader.setWorkerLimit(2);
dracoLoader.preload();
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let modelLoadStatusTimer = null;
let modelsLoading = false;
let deferExternalModels = false;
let externalModelQueueActive = false;
let deferredModelTasks = [];
let deferredModelTimer = null;
window.externalModelLoadsDeferred = false;
window.__haBridgeDeferExternalModel = (flag) => {
  if (flag) {
    if (!deferredModelTasks.includes(flag)) {
      deferredModelTasks.push(flag);
    }
    scheduleDeferredModelLoad();
  }
};
function scheduleDeferredModelLoad(delayMs = 900) {
  window.clearTimeout(deferredModelTimer);
  deferredModelTimer = window.setTimeout(
    () => {
      deferredModelTimer = null;
      if (
        !externalModelQueueActive ||
        document.hidden ||
        isLeavingStudio ||
        previewOrbitLocked
      ) {
        if (externalModelQueueActive) {
          scheduleDeferredModelLoad(300);
        }
        return;
      }
      const keys = [...new Set(deferredModelTasks)];
      deferredModelTasks = [];
      Promise.allSettled(flushDeferredModelLoads(keys));
    },
    Math.max(0, delayMs),
  );
}
function flushDeferredModelLoads(keys = []) {
  window.clearTimeout(deferredModelTimer);
  deferredModelTimer = null;
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  const modelKeys = [...new Set(keys)].filter(
    (key) => ALL_ITEM_MODELS[key],
  );
  if (!modelKeys.length) {
    return [];
  }
  window.__haBridgeReleasingDeferredModels = true;
  const loads = modelKeys.map((key) =>
    loadExternalItemModel(key),
  );
  window.__haBridgeReleasingDeferredModels = false;
  return loads;
}
function loadVisibleExternalModels() {
  return flushDeferredModelLoads(visibleExternalModelKeys());
}
function requestModelRender() {
  updateModelLoadStatus();
  if (!isAutoDiagramEmbed && !deferExternalModels) {
    if (isLeavingStudio || previewOrbitLocked) {
      modelsLoading = true;
      return;
    }
    window.clearTimeout(modelLoadStatusTimer);
    modelLoadStatusTimer = window.setTimeout(() => {
      modelLoadStatusTimer = null;
      rebuildPreviewMeshes({
        force: true,
        precompile: true,
      });
    }, 80);
  }
}
function refreshStudioChrome() {
  updateModelLoadStatus();
  modelsLoading = false;
  window.clearTimeout(modelLoadStatusTimer);
  modelLoadStatusTimer = null;
  rebuildPreviewMeshes({
    force: true,
    precompile: true,
  });
}
const externalModels = createExternalModelManager({
  THREE: THREE,
  loader: gltfLoader,
  stairItemTypes: stairLikeTypes,
  isModelInUse: projectHasItemModel,
  requestRender: requestModelRender,
  onLoadStateChange: updateModelLoadStatus,
  maxConcurrentLoads: 2,
});
const { loadExternalItemModel, modelTypeForItem } = externalModels;
function updateModelLoadStatus(active = externalModels.modelLoadState()) {
  if (!modelLoadingStatus) {
    return;
  }
  const flag = active.active > 0 || active.queued > 0;
  if (!flag && modelsLoading) {
    modelsLoading = false;
    window.clearTimeout(modelLoadStatusTimer);
    modelLoadStatusTimer = null;
    orbitResumeAfterModels = true;
    if (orbitControls && !orbitSuspended) {
      orbitControls.enabled = false;
    }
    modelLoadingStatus.hidden = false;
    modelLoadingStatus
      .querySelector("span:last-child")
      ?.replaceChildren(document.createTextNode("正在完成模型…"));
    rebuildPreviewMeshes({
      force: true,
      precompile: true,
    });
    window.requestAnimationFrame(() => updateModelLoadStatus());
    return;
  }
  orbitResumeAfterModels = flag;
  if (orbitControls && !orbitSuspended) {
    orbitControls.enabled = !flag;
  }
  modelLoadingStatus.hidden = !flag;
  modelLoadingStatus
    .querySelector("span:last-child")
    ?.replaceChildren(
      document.createTextNode(
        flag
          ? "正在加载模型… " + (active.active + active.queued)
          : "",
      ),
    );
}
const sofaGeometryCache = new Map();
const colorMaterialCache = new Map();
const rugGeometryCache = new Map();
const rugMaterialCache = new Map();
const mergedBoxGeometryCache = new Map();
const standardMaterialCache = new Map();
const skipInstanceMergeTypes = new Set([
  "tv",
  "smallcar",
  "planlabel",
  "downlight",
  "ceilinglight",
  "striplight",
]);
const meshMergeItemTypes = new Set([
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
const geometryOptimizeTypes = new Set();
const nextBatchOptimizeTypes = new Set([
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
const floorFurnitureExternalTypes = new Set([
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
const applianceExternalTypes = new Set([
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
function attachExternalItemModel(
  item,
  group,
  theme = resolvedThemeColors(),
) {
  const value = externalModels.addExternalItemModel(
    item,
    group,
    theme,
    {
      selected: isSelected("item", group.id),
    },
  );
  updateModelLoadStatus();
  return value;
}
const lightPropertyMeta = {
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
function clampLightPropertyValue(prop, value, itemType) {
  if (prop === "lightTemperature") {
    return Math.round(clamp(finite(value, 3000), 2200, 6500));
  } else if (prop === "lightBrightness") {
    return Math.round(clamp(finite(value, 50), 0, 100));
  } else if (prop === "lightRange") {
    return Math.round(clamp(finite(value, 3.5), 0.5, 10) * 10) / 10;
  } else if (prop === "lightAngle") {
    return Math.round(
      clamp(finite(value, 90), 15, defaultItemDepth(itemType)),
    );
  } else if (prop === "elevation") {
    return Math.round(clamp(finite(value, 2.7), 0, 6) * 100) / 100;
  } else {
    return finite(value);
  }
}
function formatLightPropertyValue(prop, value) {
  const propMeta = lightPropertyMeta[prop];
  if (!propMeta) {
    return String(value);
  }
  const displayValue = ["lightRange", "elevation"].includes(prop)
    ? Number(value).toFixed(prop === "elevation" ? 2 : 1)
    : Math.round(value);
  if (["%", "°"].includes(propMeta.unit)) {
    return "" + displayValue + propMeta.unit;
  } else {
    return displayValue + " " + propMeta.unit;
  }
}
const toolHelpText = {
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
const isStudioRoute =
  isStageEmbed || /^\/3d-studio\/?$/.test(window.location.pathname);
const planCtx = planCanvas.getContext("2d");
const measureCanvas = document.createElement("canvas");
const measureCtx = measureCanvas.getContext("2d");
const {
  drawMetricGrid: drawMetricGrid,
  drawLine: drawPlanLine,
  drawPoint: drawPlanPoint,
  drawOpenEndpointWarning: drawOpenEndpointWarning,
  drawFloatingLabel: drawFloatingLabel,
} = createPlanDrawingTools({
  context: planCtx,
  planToScreen: planToScreen,
  screenToPlan: screenToPlanWithView,
  pixelsPerMeter: pixelsPerMeter,
  getCanvasSize: () => ({
    width: planWidth,
    height: planHeight,
  }),
  getViewZoom: () => planView.zoom,
});
let hasProjectLoaded = null;
let projectLoadGeneration = 0;
let planBackgroundRevision = 0;
let floorScene = createEmptyFloorScene();
let projectDoc = null;
let activeFloorId = "";
let forcedVisibleLightGroupIds = null;
let planBackgroundImage = null;
let activeTool = "select";
const DEFAULT_DOOR_TYPE = "solid";
let assetCategory = "home";
let activeLightGroupId = "";
let lightGroupContextMenuId = "";
let renamingLightGroupId = "";
let draggingLightGroupId = "";
let draggingFloorId = "";
let pendingLightPropertyEdit = null;
let clipboardItems = [];
let clipboardPasteCount = 0;
let selection = null;
let multiSelection = [];
let wallDrawAnchor = null;
let measureOrWallLastPoint = null;
let wallDrawPointCount = 0;
let scaleToolStart = null;
let pendingCalibration = null;
let alignSession = null;
let floorSwitchGeneration = 0;
let contextFloorId = "";
let pendingDeleteFloorId = "";
let planPointerPoint = null;
let rawPlanPointer = null;
let snapHint = null;
let windowPlacementPreview = null;
let doorPlacementPreview = null;
let railingPlacementPreview = null;
let dragState = null;
let isMiddleMousePanning = false;
let shiftKeyHeld = false;
let snapTemporarilyDisabled = false;
let planWidth = 1;
let planHeight = 1;
let planNeedsRedraw = false;
let planView = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};
let undoStack = [];
let redoStack = [];
let saveGeneration = 0;
let savedGeneration = 0;
let saveTimer = null;
let isFlushingSave = false;
let saveConflictState = null;
let toastTimer = null;
let isSceneRebuildQueued = false;
let forceLivePreviewOnce = false;
let invalidateLightCacheNextRebuild = false;
let forceFullSceneRebuild = false;
const pendingRebuildReasons = new Set();
let previewNeedsRefresh = false;
let detailsResizeDrag = null;
let hoveredInspectorTarget = null;
let inspectorHoverTimer = null;
let planRedrawRaf = 0;
let wallAnalysisCache = {
  scene: null,
  signature: "",
  floorPolygons: null,
  intersections: null,
  joinExtensions: null,
  unclosedEndpoints: null,
};
let planPanState = null;
let planZoomRaf = 0;
let planZoomFactor = 1;
let planZoomAnchor = null;
let orbitAnimRaf = 0;
let orbitAnimSettleTimer = null;
let stageSession = null;
let orbitSuspended = false;
let isExporting = false;
let exportPresetEditorOpen = false;
let exportUiDebounceTimer = null;
let exportOverwriteResolver = null;
let shadowCameraExpanded = false;
let savedSpotShadowCamera = null;
const defaultExportWidth = 1852;
const defaultExportHeight = 1293;
let exportAspectRatio = defaultExportWidth / defaultExportHeight;
let previewScene = null;
let camera = null;
let renderer = null;
let orbitControls = null;
let worldGroup = null;
let architecturePlanOrigin = null;
let detailsPanelResizeObserver = null;
let hemisphereLight = null;
let ambientLight = null;
let previewSpotLight = null;
let fillLight = null;
let topLight = null;
let shadowAtlas = null;
let baseLighting = normalizeBaseLighting(DEFAULT_BASE_LIGHTING);
let baseLightDrag = null;
let baseLightingChannel = null;
try {
  if (typeof BroadcastChannel == "function") {
    baseLightingChannel = new BroadcastChannel(
      "ha-bridge-studio3d-base-lighting-v1",
    );
  }
} catch {}
let needsRenderFrame = true;
let renderIdle = false;
let demandFrameLoop = null;
let orbitResumeTimer = null;
let stageSessionEndTimer = null;
let isBakingLightCache = false;
let isRebuildingWorld = false;
let residentCacheMode = false;
let lightCacheEpoch = 0;
let lightCacheReady = false;
let previewQualityJustBecameReady = false;
let lightCacheTileMap = new Map();
let pendingModelLoads = new Map();
let lightBakeRaf = 0;
let shadowAtlasRaf = 0;
let isCapturingFrame = null;
let isStageWarmup = false;
let hasPendingShadowTiles = false;
let previewOrbitLocked = false;
let orbitSoftSuspend = false;
let isLeavingStudio = false;
let leaveStudioTimer = null;
let previewQualityReady = false;
let adaptiveQualityArmed = false;
let previewQualityPath = "";
let baselineLightRenderCost = 0;
let recentFrameMsSamples = [];
let qualityProbeStartMs = 0;
let slowFrameStreak = 0;
let adaptiveFpsEstimate = null;
const precompiledExternalMeshes = new WeakSet();
let isExternalPrecompiling = false;
let externalPrecompileRequested = false;
let externalPrecompilePassCount = 0;
let externalPrecompileTimer = null;
let isLightPrecompiling = false;
let lightPrecompileRequested = false;
let lightPrecompileSignature = "";
let lightPrecompilePassCount = 0;
let lightPrecompileTimer = null;
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
function defaultFloorChineseName(arg0) {
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
    ][arg0] || arg0 + 1 + "层"
  );
}
function createFloorEntry(elevation = 0, scene = createEmptyFloorScene()) {
  const scene2 = normalizeFloorScene(scene);
  const clamp2 = clamp(finite(projectDoc?.defaultFloorHeight, 3), 1.8, 8);
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
    scene: scene2,
  };
}
function normalizeProjectDocument(projectDoc2) {
  const list = Array.isArray(projectDoc2?.floors)
    ? projectDoc2.floors
    : null;
  const floors = list?.length
    ? list.map((floor, arg1) => {
        const scene = normalizeFloorScene(floor?.scene);
        const flag2 = floor?.originInitialized === true;
        const normalizeLabelText2 = normalizeLabelText(
          floor?.name,
          defaultFloorChineseName(arg1),
          24,
        );
        const name =
          normalizeLabelText2 === arg1 + 1 + "层"
            ? defaultFloorChineseName(arg1)
            : normalizeLabelText2;
        return {
          id: String(floor?.id || makeId("floor")),
          name: name,
          elevation: clamp(
            finite(floor?.elevation, arg1 * 3),
            -30,
            120,
          ),
          offsetX: clamp(finite(floor?.offsetX, 0), -100, 100),
          offsetZ: clamp(finite(floor?.offsetZ, 0), -100, 100),
          rotation: clamp(finite(floor?.rotation, 0), -180, 180),
          originX: flag2
            ? finite(floor?.originX, 0)
            : scene.background?.width
              ? scene.background.width / 2
              : 0,
          originY: flag2
            ? finite(floor?.originY, 0)
            : scene.background?.height
              ? scene.background.height / 2
              : 0,
          originInitialized: flag2 || !!scene.background,
          aligned:
            arg1 === 0 ||
            floor?.aligned === true ||
            Math.abs(finite(floor?.offsetX, 0)) > 0.000001 ||
            Math.abs(finite(floor?.offsetZ, 0)) > 0.000001,
          alignmentPending: floor?.alignmentPending === true,
          scene: scene,
        };
      })
    : [createFloorEntry(0, projectDoc2)];
  const id = String(projectDoc2?.activeFloorId || "");
  const id2 =
    floors.find((id3) => id3.id === id) || floors[0];
  const clamp2 = clamp(finite(projectDoc2?.defaultFloorHeight, 3), 0, 20);
  const flag = finite(projectDoc2?.schemaVersion, 0) >= 6;
  const exportPresets = normalizeExportPresetSlots(
    projectDoc2?.exportPresets,
  );
  return {
    schemaVersion: 7,
    activeFloorId: id2.id,
    defaultFloorHeight: clamp(
      finite(projectDoc2?.defaultFloorHeight, 3),
      1.8,
      8,
    ),
    previewFloorGap: clamp(
      flag
        ? finite(projectDoc2?.previewFloorGap, 3)
        : clamp2 + finite(projectDoc2?.previewFloorGap, 0),
      0,
      20,
    ),
    exportFloorGap: clamp(
      flag
        ? finite(projectDoc2?.exportFloorGap, 3)
        : clamp2 + finite(projectDoc2?.exportFloorGap, 0),
      0,
      20,
    ),
    previewFloorMode:
      projectDoc2?.previewFloorMode === "all" ? "all" : "active",
    combinedCameraSettings: normalizeCameraSettings(
      projectDoc2?.combinedCameraSettings,
    ),
    combinedFixedCameraView: normalizeFixedCameraView(
      projectDoc2?.combinedFixedCameraView,
    ),
    baseLighting: normalizeBaseLighting(projectDoc2?.baseLighting),
    exportPresets: exportPresets,
    activeExportPresetSlot: normalizeActiveExportPresetSlot(
      projectDoc2?.activeExportPresetSlot,
      exportPresets.length,
    ),
    floors: floors,
  };
}
function activeFloor() {
  const value = stageSession?.selectedFloorId || activeFloorId;
  return (
    projectDoc?.floors.find((item) => item.id === value) ||
    projectDoc?.floors[0] ||
    null
  );
}
function cloneProjectDoc() {
  return structuredClone(projectDoc || normalizeProjectDocument(floorScene));
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
    ...stageSession.combinedCameraSettings,
  };
  return projectDoc2;
}
function uniqueFloorName(name, exceptId = "") {
  const usedNames = new Set(
    (projectDoc?.floors || [])
      .filter((floor) => floor.id !== exceptId)
      .map((floor) => floor.name),
  );
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
  const disabled = floorContextMenu.querySelector(
    '[data-floor-action="delete"]',
  );
  disabled.disabled = projectDoc.floors.length <= 1;
  floorContextMenu.hidden = false;
  floorContextMenu.style.left =
    Math.min(event.clientX, window.innerWidth - 116) + "px";
  floorContextMenu.style.top =
    Math.min(event.clientY, window.innerHeight - 82) + "px";
}
function confirmDeleteFloor(id) {
  if (!!id && !(projectDoc.floors.length <= 1)) {
    pendingDeleteFloorId = id.id;
    floorDeleteName.textContent = id.name;
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
  const id = projectDoc.floors.find(
    (id3) => id3.id === pendingDeleteFloorId,
  );
  closeFloorDeleteDialog();
  if (!id || projectDoc.floors.length <= 1) {
    return;
  }
  const value = projectDoc.floors.findIndex(
    (id3) => id3.id === id.id,
  );
  projectDoc.floors.splice(value, 1);
  projectDoc.floors.forEach((elevation, arg1) => {
    elevation.elevation = arg1 * projectDoc.defaultFloorHeight;
  });
  const id2 =
    projectDoc.floors[Math.max(0, value - 1)] || projectDoc.floors[0];
  await switchActiveFloor(id2.id, {
    persist: false,
  });
  syncPreviewFloorButtons();
  scheduleSave();
  showToast("已删除“" + id.name + "”。", "success");
}
function openFloorRenameDialog(id) {
  if (id) {
    contextFloorId = id.id;
    floorRenameInput.value = id.name;
    floorRenameDialog.showModal();
    requestAnimationFrame(() => floorRenameInput.select());
  }
}
function renderFloorList() {
  if (projectDoc) {
    floorList.replaceChildren();
    for (const floor of projectDoc.floors) {
      const el = document.createElement("div");
      el.className =
        "floor-row" +
        (floor.id === activeFloorId ? " active" : "") +
        (floor.aligned ? "" : " unaligned");
      el.dataset.floorId = floor.id;
      el.draggable = true;
      el.setAttribute(
        "aria-label",
        floor.name +
          "，" +
          (floor.id === activeFloorId ? "当前楼层，" : "") +
          "长按拖动排序，右键可重命名或删除",
      );
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
      el.addEventListener("pointerdown", (event) => {
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
      el.addEventListener("dragstart", (event) => {
        if (!dragReady) {
          event.preventDefault();
          clearDragReady();
          return;
        }
        draggingFloorId = floor.id;
        el.classList.remove("drag-ready");
        el.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
          "application/x-ha-bridge-floor",
          floor.id,
        );
      });
      el.addEventListener("dragend", () => {
        draggingFloorId = "";
        el.classList.remove("dragging");
        clearDragReady();
        clearFloorDropIndicators();
      });
      el.addEventListener("dragover", (event) => {
        if (!draggingFloorId || draggingFloorId === floor.id) {
          return;
        }
        event.preventDefault();
        clearFloorDropIndicators();
        const placeAfter =
          event.clientY >=
          el.getBoundingClientRect().top +
            el.getBoundingClientRect().height / 2;
        el.dataset.dropPosition = placeAfter ? "after" : "before";
        el.classList.add(placeAfter ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el.addEventListener("drop", (event) => {
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
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        switchActiveFloor(floor.id, {
          persist: true,
        });
      });
      const nameEl = document.createElement("span");
      nameEl.textContent = floor.name;
      nameEl.title =
        "长按后拖动可调整楼层顺序，右键可重命名或删除楼层";
      const statusEl = document.createElement("small");
      const floorIndex = projectDoc.floors.findIndex(
        (entry) => entry.id === floor.id,
      );
      statusEl.textContent =
        floorIndex === 0
          ? "基准"
          : floor.aligned
            ? "已对齐"
            : "待对齐";
      el.addEventListener("click", () => {
        switchActiveFloor(floor.id, {
          persist: true,
        });
      });
      el.addEventListener("contextmenu", (event) => {
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
  const reorderFloors2 = reorderFloors(
    projectDoc.floors,
    sourceId,
    targetId,
    placeAfter,
    projectDoc.defaultFloorHeight,
  );
  if (reorderFloors2 === projectDoc.floors) {
    return;
  }
  const floor = projectDoc.floors.find(
    (item) => item.id === sourceId,
  );
  projectDoc.floors = reorderFloors2;
  renderFloorList();
  syncPreviewFloorButtons();
  updateAlignFloorButton();
  rebuildPreviewMeshes({
    force: true,
  });
  scheduleSave();
  if (floor) {
    showToast("已调整“" + floor.name + "”的楼层顺序。", "success");
  }
}
function updateAlignFloorButton() {
  const floor = activeFloor();
  const value = floor
    ? projectDoc.floors.findIndex((item) => item.id === floor.id)
    : -1;
  const flag = projectDoc.floors.length > 1 && value > 0;
  alignFloor.hidden = !flag;
  alignFloor.disabled = !flag || !floor?.scene?.calibration;
  alignFloor.textContent = floor?.aligned ? "重新对齐" : "对齐楼层";
  if (alignSession?.stage === "reference") {
    activeToolLabel.textContent = "楼层对齐 · 参照层";
    toolHelp.textContent =
      "点击" +
      alignSession.referenceFloor.name +
      "上的楼梯角、墙角或柱点；Esc 取消";
  } else if (alignSession?.stage === "current") {
    activeToolLabel.textContent = "楼层对齐 · 当前层";
    toolHelp.textContent =
      "点击" + floor.name + "上的相同位置；系统会自动重合上下楼层";
  }
}
async function switchActiveFloor(
  floorId,
  { persist: flag = false } = {},
) {
  const id = projectDoc?.floors.find(
    (item) => item.id === floorId,
  );
  if (!id) {
    return;
  }
  const value = ++floorSwitchGeneration;
  const view =
    getPreviewFloorMode() === "all" ? serializeCameraState() : null;
  if (alignSession?.floorId !== id.id) {
    alignSession = null;
  }
  activeFloorId = id.id;
  projectDoc.activeFloorId = id.id;
  floorScene = id.scene;
  activeLightGroupId = "";
  clearSelection();
  resetWallDrawing();
  scaleToolStart = null;
  undoStack = [];
  redoStack = [];
  planView.rotation = floorScene.settings.planViewRotation;
  Promise.allSettled(loadVisibleExternalModels());
  await reloadPlanBackground();
  if (value === floorSwitchGeneration && activeFloorId === id.id) {
    refreshViews();
    updateAlignFloorButton();
    fitPlanViewToContent();
    requestAnimationFrame(() => {
      if (
        value === floorSwitchGeneration &&
        activeFloorId === id.id
      ) {
        if (getPreviewFloorMode() === "all") {
          if (view) {
            setExportPresetFromUi(
              view,
              view.viewportAspect,
            );
          }
          syncCameraModeButtons(getCameraProjectionMode());
          syncCameraViewButtons(cameraViewMode());
          return;
        }
        if (floorScene.settings.fixedCameraView) {
          restoreFixedCameraView({
            recordChange: false,
            silent: true,
          });
          return;
        }
        setCameraProjectionMode(getCameraProjectionMode(), {
          preserveView: false,
        });
        applyCameraView();
      }
    });
    if (flag) {
      scheduleSave();
    }
  }
}
async function addNewFloor() {
  const value = createFloorEntry(projectDoc.floors.length);
  value.name = uniqueFloorName(value.name);
  projectDoc.floors.push(value);
  syncPreviewFloorButtons();
  await switchActiveFloor(value.id, {
    persist: false,
  });
  scheduleSave();
  showToast(
    "已新增“" + value.name + "”，导入并校准后会设置上下层参照点。",
    "success",
  );
  setActiveTool("select");
}
function planPointToWorldXZ(floor, planPoint) {
  const pixelsPerMeter = floor?.scene?.calibration?.pixelsPerMeter || 1;
  const localX =
    (planPoint.x - finite(floor?.originX, 0)) / pixelsPerMeter;
  const localY =
    (planPoint.y - finite(floor?.originY, 0)) / pixelsPerMeter;
  const rotationRad = -THREE.MathUtils.degToRad(
    finite(floor?.rotation, 0),
  );
  return {
    x:
      finite(floor?.offsetX, 0) +
      Math.cos(rotationRad) * localX +
      Math.sin(rotationRad) * localY,
    z:
      finite(floor?.offsetZ, 0) -
      Math.sin(rotationRad) * localX +
      Math.cos(rotationRad) * localY,
  };
}
function rotatePlanPointByFloor(floor, worldPoint) {
  const pixelsPerMeter = floor?.scene?.calibration?.pixelsPerMeter || 1;
  const rotationRad = -THREE.MathUtils.degToRad(
    finite(floor?.rotation, 0),
  );
  const dx = worldPoint.x - finite(floor?.offsetX, 0);
  const dz = worldPoint.z - finite(floor?.offsetZ, 0);
  return {
    x:
      finite(floor?.originX, 0) +
      (Math.cos(rotationRad) * dx - Math.sin(rotationRad) * dz) *
        pixelsPerMeter,
    y:
      finite(floor?.originY, 0) +
      (Math.sin(rotationRad) * dx + Math.cos(rotationRad) * dz) *
        pixelsPerMeter,
  };
}
function floorLocalToWorldPoint(planPoint, sourceFloor, targetFloor) {
  return rotatePlanPointByFloor(
    targetFloor,
    planPointToWorldXZ(sourceFloor, planPoint),
  );
}
function alignReferenceWalls() {
  if (!alignSession) {
    return [];
  }
  const targetFloor = activeFloor();
  return alignSession.referenceFloor.scene.walls.map((wall) => ({
    ...wall,
    start: floorLocalToWorldPoint(
      wall.start,
      alignSession.referenceFloor,
      targetFloor,
    ),
    end: floorLocalToWorldPoint(
      wall.end,
      alignSession.referenceFloor,
      targetFloor,
    ),
  }));
}
function beginAlignFloorSession() {
  const floor = activeFloor();
  const floorIndex =
    projectDoc?.floors.findIndex((entry) => entry.id === floor?.id) ??
    -1;
  const referenceFloor =
    floorIndex > 0 ? projectDoc.floors[floorIndex - 1] : null;
  if (!!floor && !!referenceFloor) {
    if (!floor.scene.calibration || !referenceFloor.scene.calibration) {
      showToast("当前层和参照层都需要先完成比例校准。", "error");
      return;
    }
    alignSession = {
      floorId: floor.id,
      referenceFloor: referenceFloor,
      stage: "reference",
      referencePoint: null,
    };
    clearSelection();
    setActiveTool("select");
    planCanvas.style.cursor = "crosshair";
    updateAlignFloorButton();
    drawPlan();
    showToast("先在半透明的" + referenceFloor.name + "上点击一个参照点。");
  }
}
function cancelAlignFloorSession() {
  if (alignSession) {
    alignSession = null;
    planCanvas.style.cursor = "";
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
    const snappedPoint =
      nearestWall(clickPoint, referenceWalls, 18 / planView.zoom)?.point ||
      clickPoint;
    alignSession.referencePoint = floorLocalToWorldPoint(
      snappedPoint,
      floor,
      alignSession.referenceFloor,
    );
    alignSession.stage = "current";
    updateAlignFloorButton();
    drawPlan();
    showToast("现在点击" + floor.name + "上的同一个位置。");
    return true;
  }
  const planPoint =
    nearestWall(clickPoint, floor.scene.walls, 18 / planView.zoom)?.point ||
    clickPoint;
  const worldPoint = planPointToWorldXZ(
    alignSession.referenceFloor,
    alignSession.referencePoint,
  );
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
      ...alignSession.referencePoint,
    },
    currentPoint: {
      ...planPoint,
    },
  };
  alignSession = null;
  planCanvas.style.cursor = "";
  setActiveTool("select");
  renderFloorList();
  drawPlan();
  rebuildPreviewMeshes({
    force: true,
  });
  scheduleSave();
  showToast(floor.name + "已与下层参照点对齐。", "success");
  return true;
}
function commitPreviewFloorGap() {
  const gap = clamp(
    finite(previewFloorGapInput.value, projectDoc?.previewFloorGap || 3),
    0,
    20,
  );
  if (
    !(Math.abs(gap - finite(projectDoc?.previewFloorGap, 3)) < 0.000001)
  ) {
    projectDoc.previewFloorGap = gap;
    previewFloorGapInput.value = gap.toFixed(1);
    rebuildWorldPreview();
    scheduleSave();
  }
}
function commitExportFloorGap() {
  const gap = clamp(
    finite(exportFloorGap2.value, projectDoc?.exportFloorGap || 3),
    0,
    20,
  );
  if (
    !(Math.abs(gap - finite(projectDoc?.exportFloorGap, 3)) < 0.000001)
  ) {
    projectDoc.exportFloorGap = gap;
    exportFloorGap2.value = gap.toFixed(1);
    rebuildWorldPreview();
    exportStatus.textContent =
      "全楼层间距已设为 " + gap.toFixed(1) + " m";
    scheduleSave();
  }
}
function buildWallOpeningsIndex(
  wallsInput,
  windowsInput,
  doorsInput,
  openingWidthScale,
  railingsInput = [],
) {
  const splitPieces = splitWallSegments(wallsInput);
  const piecesBySourceWall = new Map();
  const walls = [];
  for (const piece of splitPieces) {
    const wall = {
      ...piece.sourceWall,
      id:
        piece.pieceIndex === 0
          ? piece.sourceWall.id
          : makeId("wall"),
      start: piece.start,
      end: piece.end,
    };
    const pieceWithWall = {
      ...piece,
      wall: wall,
    };
    if (!piecesBySourceWall.has(piece.sourceWall.id)) {
      piecesBySourceWall.set(piece.sourceWall.id, []);
    }
    piecesBySourceWall.get(piece.sourceWall.id).push(pieceWithWall);
    walls.push(wall);
  }
  const remapAttachment = (attachment) => {
    const pieces = piecesBySourceWall.get(attachment.wallId);
    if (!pieces?.length) {
      return attachment;
    }
    const t = clamp(finite(attachment.t, 0.5), 0, 1);
    const piece =
      pieces.find(
        (entry) =>
          t >= entry.startT - 1e-7 &&
          t <= entry.endT + 1e-7,
      ) || pieces.at(-1);
    const span = Math.max(piece.endT - piece.startT, 1e-7);
    const remapped = {
      ...attachment,
      wallId: piece.wall.id,
      t: clamp((t - piece.startT) / span, 0, 1),
    };
    remapped.t = clampWindowT(
      piece.wall,
      remapped,
      openingWidthScale || 1,
    );
    return remapped;
  };
  return {
    walls: walls,
    windows: windowsInput.map(remapAttachment),
    doors: doorsInput.map(remapAttachment),
    railings: railingsInput.map(remapAttachment),
  };
}
function normalizeFloorScene(scene) {
  const value = createEmptyFloorScene();
  if (!scene || typeof scene != "object") {
    return value;
  }
  const finite2 = finite(scene.schemaVersion, 0);
  const pixelsPerMeter2 = clamp(
    finite(scene.calibration?.pixelsPerMeter, 0),
    0,
    100000,
  );
  const calibration =
    pixelsPerMeter2 > 0
      ? {
          pixelsPerMeter: pixelsPerMeter2,
          reference: scene.calibration?.reference
            ? {
                start: normalizePoint(scene.calibration.reference.start),
                end: normalizePoint(scene.calibration.reference.end),
                meters: clamp(
                  finite(scene.calibration.reference.meters, 1),
                  0.01,
                  1000,
                ),
              }
            : null,
        }
      : null;
  const list = Array.isArray(scene.walls)
    ? scene.walls
        .map((size) => ({
          id: String(size?.id || makeId("wall")),
          start: normalizePoint(size?.start),
          end: normalizePoint(size?.end),
          height: clamp(
            finite(size?.height, scene.settings?.wallHeight || 2.8),
            0.01,
            6,
          ),
          thickness: clamp(
            finite(
              size?.thickness,
              scene.settings?.wallThickness || 0.12,
            ),
            0.01,
            3,
          ),
          opacity:
            size?.opacity === null ||
            size?.opacity === undefined ||
            size?.opacity === ""
              ? null
              : clamp(
                  finite(
                    size.opacity,
                    scene.settings?.wallOpacity ?? themeColors.wallOpacity,
                  ),
                  0,
                  1,
                ),
          allowOpenEnd: size?.allowOpenEnd === true,
        }))
        .filter(
          (wall) =>
            distance(wall.start, wall.end) > 0.1,
        )
    : [];
  const wallIdSet = new Set(list.map((item) => item.id));
  const entries = Array.isArray(scene.windows)
    ? scene.windows
        .map((attachment) => ({
          id: String(attachment?.id || makeId("window")),
          wallId: String(attachment?.wallId || ""),
          t: clamp(finite(attachment?.t, 0.5), 0, 1),
          width: clamp(finite(attachment?.width, 1.4), 0.3, 20),
          height: clamp(finite(attachment?.height, 1.35), 0.3, 20),
          sill: clamp(finite(attachment?.sill, 0.85), 0, 20),
          hasDivider: attachment?.hasDivider !== false,
        }))
        .filter((wall) => wallIdSet.has(wall.wallId))
    : [];
  const entries2 = Array.isArray(scene.doors)
    ? scene.doors
        .map((attachment) => ({
          id: String(attachment?.id || makeId("door")),
          wallId: String(attachment?.wallId || ""),
          t: clamp(finite(attachment?.t, 0.5), 0, 1),
          width: clamp(finite(attachment?.width, 0.9), 0.55, 20),
          height: clamp(finite(attachment?.height, 2.1), 1.8, 20),
          sill: 0,
          doorType: Object.hasOwn(doorSizePresets, attachment?.doorType)
            ? attachment.doorType
            : "solid",
          hinge: attachment?.hinge === "right" ? "right" : "left",
          swing: attachment?.swing === -1 ? -1 : 1,
        }))
        .filter((wall) => wallIdSet.has(wall.wallId))
    : [];
  const entries3 = Array.isArray(scene.railings)
    ? scene.railings
        .map((attachment) => ({
          id: String(attachment?.id || makeId("railing")),
          wallId: String(attachment?.wallId || ""),
          t: clamp(finite(attachment?.t, 0.5), 0, 1),
          width: clamp(finite(attachment?.width, 2), 0.3, 20),
          height: clamp(finite(attachment?.height, 1.1), 0.5, 3),
          sill: 0,
        }))
        .filter((wall) => wallIdSet.has(wall.wallId))
    : [];
  const lightGroups = [];
  const lightGroupIds = new Set();
  if (Array.isArray(scene.lightGroups)) {
    for (const lightGroup of scene.lightGroups) {
      const groupId = String(lightGroup?.id || makeId("light-group"));
      if (!lightGroupIds.has(groupId)) {
        lightGroupIds.add(groupId);
        lightGroups.push({
          id: groupId,
          name: normalizeLabelText(
            lightGroup?.name,
            "灯组 " + (lightGroups.length + 1),
            24,
          ),
          enabled: lightGroup?.enabled !== false,
        });
      }
    }
  }
  const ensureLightGroup = (label = "默认灯组") => {
    const name = normalizeLabelText(
      label,
      "默认灯组",
      24,
    );
    const existing = lightGroups.find(
      (group) => group.name === name,
    );
    if (existing) {
      return existing;
    }
    const created = {
      id: makeId("light-group"),
      name: name,
      enabled: true,
    };
    lightGroups.push(created);
    lightGroupIds.add(created.id);
    return created;
  };
  if (!lightGroups.length) {
    lightGroups.push({
      id: "light-group-default",
      name: "默认灯组",
      enabled: true,
    });
    lightGroupIds.add("light-group-default");
  }
  let tvCount = 0;
  let smallCarCount = 0;
  const items = Array.isArray(scene.items)
    ? scene.items
        .filter(
          (item) =>
            !["smallseat", "entrydoor", "car"].includes(item?.type),
        )
        .map((item) => {
          const size =
            furnitureCatalog[item?.type] || furnitureCatalog.table;
          const clamp2 = clamp(
            finite(item?.width, size.width),
            0.1,
            8,
          );
          const clamp3 = clamp(
            finite(item?.depth, size.depth),
            0.1,
            8,
          );
          const flag =
            finite2 < 2 &&
            item?.type === "striplight" &&
            clamp3 > clamp2;
          const normalizeFullRotation2 = normalizeFullRotation(
            finite(item?.rotation) + (flag ? 90 : 0),
          );
          const clamp4 = clamp(
            finite(item?.height, size.height),
            itemMinimumHeight(item?.type),
            6,
          );
          const flag2 =
            item?.type === "desktop" &&
            Math.abs(clamp2 - 1.2) < 0.01 &&
            Math.abs(clamp3 - 0.65) < 0.01;
          const flag3 =
            item?.type === "plant" &&
            Math.abs(clamp2 - 0.6) < 0.01 &&
            Math.abs(clamp3 - 0.6) < 0.01 &&
            Math.abs(clamp4 - 1.15) < 0.01;
          const flag4 =
            item?.type === "toilet" &&
            Math.abs(clamp2 - 0.7) < 0.01 &&
            Math.abs(clamp3 - 0.42) < 0.01;
          const flag5 =
            item?.type === "floorlamp" &&
            Math.abs(clamp2 - 0.9) < 0.01 &&
            Math.abs(clamp3 - 0.45) < 0.01 &&
            Math.abs(clamp4 - 1.8) < 0.01;
          const flag6 = item?.type === "rug" && clamp4 >= 0.045;
          const flag7 =
            item?.type === "downlight" &&
            clamp2 < 0.3 &&
            clamp3 < 0.3;
          const flag8 = item?.type === "piano" && clamp3 < 1;
          const temperature =
            defaultLightPresets[item?.type] ||
            defaultLightPresets.downlight;
          const lightGroupId = lightItemTypes.has(item?.type)
            ? lightGroupIds.has(String(item?.lightGroupId || ""))
              ? String(item.lightGroupId)
              : ensureLightGroup(item?.lightGroup || "默认灯组").id
            : "";
          const tvLayerIndex = item?.type === "tv" ? ++tvCount : 0;
          const smallCarLayerIndex =
            item?.type === "smallcar" ? ++smallCarCount : 0;
          return {
            id: String(item?.id || makeId("item")),
            type:
              item?.type === "rounddiningtableturntable"
                ? "rounddiningtable"
                : furnitureCatalog[item?.type]
                  ? item.type
                  : "table",
            x: finite(item?.x),
            y: finite(item?.y),
            rotation:
              item?.type === "striplight"
                ? normalizeFullRotation2
                : finite(item?.rotation),
            width:
              item?.type === "striplight"
                ? Math.max(clamp2, clamp3)
                : flag2 ||
                    flag3 ||
                    flag5 ||
                    flag4 ||
                    flag7 ||
                    flag8
                  ? size.width
                  : clamp2,
            depth:
              item?.type === "striplight"
                ? Math.min(clamp2, clamp3)
                : flag2 ||
                    flag3 ||
                    flag5 ||
                    flag4 ||
                    flag7 ||
                    flag8
                  ? size.depth
                  : clamp3,
            height:
              (item?.type === "sideboard" && clamp4 < 1.4) ||
              flag2 ||
              flag3 ||
              flag4 ||
              flag6 ||
              flag8
                ? size.height
                : clamp4,
            elevation: clamp(
              finite(item?.elevation, size.elevation || 0),
              0,
              6,
            ),
            color:
              item?.type === "pillar"
                ? size.color
                : /^#[0-9a-f]{6}$/i.test(item?.color || "")
                  ? item.color
                  : size.color,
            ...(item?.type === "planlabel"
              ? {
                  title: normalizeLabelText(item?.title, "家庭总览", 24),
                  subtitle: normalizeLabelText(
                    item?.subtitle,
                    "HOME PLAN",
                    36,
                  ),
                  titleSpacing: clamp(
                    finite(item?.titleSpacing, 1.05),
                    0,
                    1.8,
                  ),
                  subtitleSpacing: clamp(
                    finite(item?.subtitleSpacing, 0.08),
                    0,
                    0.6,
                  ),
                  lineLength: clamp(
                    finite(item?.lineLength, 0.86),
                    0.3,
                    1,
                  ),
                }
              : {}),
            ...(item?.type === "tv"
              ? {
                  screenEnabled: item?.screenEnabled !== false,
                  screenLayerName: normalizeLabelText(
                    item?.screenLayerName,
                    "电视画面 " + tvLayerIndex,
                    24,
                  ),
                  tvMountStyle: tvMountStyles.has(item?.tvMountStyle)
                    ? item.tvMountStyle
                    : "standard",
                }
              : {}),
            ...(item?.type === "smallcar"
              ? {
                  chargingEnabled: item?.chargingEnabled === true,
                  chargingLayerName: normalizeLabelText(
                    item?.chargingLayerName,
                    "汽车充电 " + smallCarLayerIndex,
                    24,
                  ),
                }
              : {}),
            ...(item?.type === "curtain"
              ? {
                  curtainPosition: ["left", "right", "split"].includes(
                    item?.curtainPosition,
                  )
                    ? item.curtainPosition
                    : "split",
                }
              : {}),
            ...(stairItemTypes.has(item?.type)
              ? {
                  stairDirection: ["left", "right"].includes(
                    item?.stairDirection,
                  )
                    ? item.stairDirection
                    : "right",
                }
              : {}),
            ...(item?.type === "shoecabinet"
              ? {
                  shoeCabinetMirrored: item?.shoeCabinetMirrored === true,
                }
              : {}),
            ...(roundTableTypes.has(item?.type)
              ? {
                  roundTableTurntable:
                    item?.type === "rounddiningtableturntable" ||
                    item?.roundTableTurntable === true,
                }
              : {}),
            ...(lightItemTypes.has(item?.type)
              ? {
                  lightGroupId: lightGroupId,
                  verticalRotation:
                    item?.type === "striplight"
                      ? normalizeFullRotation(item?.verticalRotation)
                      : clamp(finite(item?.verticalRotation, 0), -90, 90),
                  ...(item?.type === "striplight"
                    ? {
                        stripRollRotation: normalizeFullRotation(
                          item?.stripRollRotation,
                        ),
                        lightSourceVisible:
                          item?.lightSourceVisible !== false,
                      }
                    : {}),
                  lightTemperature: clamp(
                    finite(
                      item?.lightTemperature,
                      temperature.temperature,
                    ),
                    2200,
                    6500,
                  ),
                  lightBrightness: clamp(
                    finite(
                      item?.lightBrightness,
                      temperature.brightness,
                    ),
                    0,
                    100,
                  ),
                  lightRange: clamp(
                    finite(item?.lightRange, temperature.range),
                    0.5,
                    10,
                  ),
                  lightAngle: clamp(
                    finite(item?.lightAngle, temperature.angle),
                    15,
                    defaultItemDepth(item?.type),
                  ),
                }
              : {}),
          };
        })
    : [];
  const background =
    scene.background?.assetId && scene.background?.url
      ? {
          assetId: String(scene.background.assetId),
          url: String(scene.background.url),
          name: String(scene.background.name || "户型底图"),
          width: clamp(finite(scene.background.width, 1), 1, 8192),
          height: clamp(finite(scene.background.height, 1), 1, 8192),
        }
      : null;
  const wallOpenings = buildWallOpeningsIndex(
    list,
    entries,
    entries2,
    pixelsPerMeter2,
    entries3,
  );
  return {
    schemaVersion: 2,
    background: background,
    calibration: calibration,
    settings: {
      wallHeight: clamp(finite(scene.settings?.wallHeight, 2.8), 0.01, 6),
      wallThickness: clamp(
        finite(scene.settings?.wallThickness, 0.12),
        0.01,
        3,
      ),
      wallOpacity: clamp(
        finite(scene.settings?.wallOpacity, themeColors.wallOpacity),
        0,
        1,
      ),
      floorEdgeVisible: scene.settings?.floorEdgeVisible !== false,
      planViewRotation:
        (((Math.round(finite(scene.settings?.planViewRotation, 0) / 90) *
          90) %
          360) +
          360) %
        360,
      cameraView: scene.settings?.cameraView === "top" ? "top" : "free",
      cameraTopRotation:
        (((Math.round(finite(scene.settings?.cameraTopRotation, 0) / 90) *
          90) %
          360) +
          360) %
        360,
      cameraMode:
        scene.settings?.cameraMode === "orthographic"
          ? "orthographic"
          : "perspective",
      cameraFocalLength: clamp(
        finite(scene.settings?.cameraFocalLength, 50),
        18,
        120,
      ),
      fixedCameraView: normalizeFixedCameraView(
        scene.settings?.fixedCameraView,
      ),
      livePreviewEnabled: scene.settings?.livePreviewEnabled !== false,
      backgroundVisible: scene.settings?.backgroundVisible !== false,
      snapEnabled: scene.settings?.snapEnabled !== false,
      snapEndpoints: scene.settings?.snapEndpoints !== false,
      snapIntersections: scene.settings?.snapIntersections !== false,
      snapSegments: scene.settings?.snapSegments !== false,
      snapOrthogonal: scene.settings?.snapOrthogonal !== false,
      snapAngles: scene.settings?.snapAngles !== false,
      snapGrid: scene.settings?.snapGrid !== false,
      snapTolerance: clamp(
        Math.round(finite(scene.settings?.snapTolerance, 13)),
        6,
        24,
      ),
      previewPanelRatio: clamp(
        finite(scene.settings?.previewPanelRatio, 0.52),
        0.06,
        0.94,
      ),
      detailsPanelWidthRatio: clamp(
        finite(scene.settings?.detailsPanelWidthRatio, 0.29),
        0.08,
        0.86,
      ),
    },
    walls: wallOpenings.walls,
    windows: wallOpenings.windows,
    doors: wallOpenings.doors,
    railings: wallOpenings.railings,
    lightGroups: lightGroups,
    items: items,
  };
}
function makeId(arg0) {
  const value =
    globalThis.crypto?.randomUUID?.() ||
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return arg0 + "-" + value;
}
function cloneFloorScene(arg0 = floorScene) {
  return structuredClone(arg0);
}
function resolveLightGroup(lightGroup) {
  return (
    floorScene.lightGroups?.find(
      (item) => item.id === lightGroup?.lightGroupId,
    ) ||
    floorScene.lightGroups?.[0] ||
    null
  );
}
function findLightGroup(lightGroup, lightGroups = floorScene) {
  return (
    lightGroups?.lightGroups?.find(
      (item) => item.id === lightGroup?.lightGroupId,
    ) ||
    lightGroups?.lightGroups?.[0] ||
    null
  );
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
  return floorScene.items.filter((item) => item.type === "tv");
}
function smallCarItemsOnFloor() {
  return floorScene.items.filter(
    (item) => item.type === "smallcar",
  );
}
function previewFloorEntries() {
  if (getPreviewFloorMode() === "all") {
    return projectDoc.floors;
  } else {
    return [activeFloor()].filter(Boolean);
  }
}
function floorStackOffsetY(id) {
  if (getPreviewFloorMode() !== "all") {
    return 0;
  }
  const value = projectDoc.floors.findIndex(
    (item) => item.id === id?.id,
  );
  return Math.max(value, 0) * finite(projectDoc.exportFloorGap, 3);
}
function floorScopedKey(arg0, arg1) {
  return arg0 + ":" + arg1;
}
function layerScopedKey(flag, arg1) {
  return (flag || "floor") + ":" + arg1;
}
function previewScopedItemKey(arg0, value) {
  if (getPreviewFloorMode() === "all") {
    return floorScopedKey(arg0, value);
  } else {
    return value;
  }
}
function collectVisibleLights() {
  return (
    getPreviewFloorMode() === "all"
      ? projectDoc?.floors || []
      : [activeFloor()].filter(Boolean)
  ).flatMap((floor) =>
    floor.scene.items
      .filter((item) => lightItemTypes.has(item.type))
      .map((item) => {
        const group = findLightGroup(item, floor.scene);
        return {
          floor: floor,
          item: item,
          group: group,
          itemKey: layerScopedKey(floor.id, item.id),
          groupKey: previewScopedItemKey(
            floor.id,
            group?.id || "__ungrouped",
          ),
        };
      }),
  );
}
function collectLightGroupsAcrossFloors(
  list = projectDoc?.floors || [],
) {
  return list.flatMap((floor) =>
    floor.scene.lightGroups.map((group, index) => ({
      floor: floor,
      group: group,
      index: index,
      key: floorScopedKey(floor.id, group.id),
      lights: floor.scene.items.filter(
        (item) =>
          lightItemTypes.has(item.type) &&
          item.lightGroupId === group.id,
      ),
    })),
  );
}
function collectTvsAcrossFloors(list = projectDoc?.floors || []) {
  return list.flatMap((floor) =>
    floor.scene.items
      .filter((item) => item.type === "tv")
      .map((item, index) => ({
        floor: floor,
        item: item,
        index: index,
        key: floor.id + ":" + item.id,
      })),
  );
}
function collectSmallCarsAcrossFloors(
  list = projectDoc?.floors || [],
) {
  return list.flatMap((floor) =>
    floor.scene.items
      .filter((item) => item.type === "smallcar")
      .map((item, index) => ({
        floor: floor,
        item: item,
        index: index,
        key: floor.id + ":" + item.id,
      })),
  );
}
function ensureTvScreenLayerNames(arg0) {
  const idSet = new Set(
    tvItemsOnFloor().map(
      (screenLayerName) => screenLayerName.screenLayerName,
    ),
  );
  let value = 1;
  for (const screenLayerName of arg0) {
    if (screenLayerName.type === "tv") {
      while (idSet.has("电视画面 " + value)) {
        value += 1;
      }
      screenLayerName.screenLayerName = "电视画面 " + value;
      screenLayerName.screenEnabled =
        screenLayerName.screenEnabled !== false;
      idSet.add(screenLayerName.screenLayerName);
      value += 1;
    }
  }
}
function ensureSmallCarChargingLayerNames(arg0) {
  const idSet = new Set(
    smallCarItemsOnFloor().map(
      (chargingLayerName) => chargingLayerName.chargingLayerName,
    ),
  );
  let value = 1;
  for (const chargingLayerName of arg0) {
    if (chargingLayerName.type === "smallcar") {
      while (idSet.has("汽车充电 " + value)) {
        value += 1;
      }
      chargingLayerName.chargingLayerName = "汽车充电 " + value;
      chargingLayerName.chargingEnabled =
        chargingLayerName.chargingEnabled === true;
      idSet.add(chargingLayerName.chargingLayerName);
      value += 1;
    }
  }
}
function ensureItemLayerNames(arg0) {
  ensureTvScreenLayerNames(arg0);
  ensureSmallCarChargingLayerNames(arg0);
}
function ensureDefaultLightGroup() {
  const list = (floorScene.lightGroups ||= []);
  if (!list.length) {
    list.push({
      id: makeId("light-group"),
      name: "默认灯组",
      enabled: true,
    });
  }
  if (!list.some((item) => item.id === activeLightGroupId)) {
    activeLightGroupId = list[0].id;
  }
  return (
    list.find((item) => item.id === activeLightGroupId) ||
    list[0]
  );
}
function syncLightGroupSelect(lightGroup) {
  const value = selectEl("#light-group");
  value.replaceChildren();
  for (const id of floorScene.lightGroups || []) {
    const el = document.createElement("option");
    el.value = id.id;
    el.textContent = id.name;
    value.append(el);
  }
  value.value =
    resolveLightGroup(lightGroup)?.id || ensureDefaultLightGroup().id;
  syncStudioSelect(value);
}
function hideLightGroupContextMenu() {
  lightGroupContextMenu.hidden = true;
  lightGroupContextMenuId = "";
}
function showLightGroupContextMenu(id, event) {
  lightGroupContextMenuId = id.id;
  activeLightGroupId = id.id;
  renderLightLayerPanel();
  const disabled = lightGroupContextMenu.querySelector(
    '[data-light-group-action="delete"]',
  );
  disabled.disabled = floorScene.lightGroups.length <= 1;
  lightGroupContextMenu.hidden = false;
  lightGroupContextMenu.style.left =
    Math.min(event.clientX, window.innerWidth - 116) + "px";
  lightGroupContextMenu.style.top =
    Math.min(event.clientY, window.innerHeight - 108) + "px";
}
function deleteLightGroup(id) {
  if (!id || floorScene.lightGroups.length <= 1) {
    return;
  }
  pushHistory();
  const id2 = floorScene.lightGroups.find(
    (id3) => id3.id !== id.id,
  );
  const value = new Set(
    floorScene.items
      .filter(
        (item) =>
          lightItemTypes.has(item.type) &&
          item.lightGroupId === id.id,
      )
      .map((id3) => id3.id),
  );
  floorScene.items = floorScene.items.filter(
    (id3) => !value.has(id3.id),
  );
  floorScene.lightGroups = floorScene.lightGroups.filter(
    (id3) => id3.id !== id.id,
  );
  if (selection?.kind === "item" && value.has(selection.id)) {
    selection = null;
  }
  multiSelection = multiSelection.filter(
    (kind) =>
      kind.kind !== "item" || !value.has(kind.id),
  );
  if (activeLightGroupId === id.id) {
    activeLightGroupId = id2.id;
  }
  refreshViews("lights");
  scheduleSave();
  showToast(
    "已删除“" + id.name + "”及组内 " + value.size + " 盏灯。",
    "success",
  );
}
function uniqueLightGroupName(arg0) {
  const value = new Set(
    floorScene.lightGroups.map((named) => named.name),
  );
  if (!value.has(arg0)) {
    return arg0;
  }
  let nameSuffix = 2;
  while (value.has(arg0 + " " + nameSuffix)) {
    nameSuffix += 1;
  }
  return arg0 + " " + nameSuffix;
}
function duplicateLightGroup(lightGroup) {
  if (!lightGroup) {
    return;
  }
  pushHistory();
  const id = {
    ...structuredClone(lightGroup),
    id: makeId("light-group"),
    name: uniqueLightGroupName(lightGroup.name + " 副本"),
  };
  const value = floorScene.lightGroups.findIndex(
    (item) => item.id === lightGroup.id,
  );
  floorScene.lightGroups.splice(value + 1, 0, id);
  const list = floorScene.items
    .filter(
      (item) =>
        lightItemTypes.has(item.type) &&
        item.lightGroupId === lightGroup.id,
    )
    .map((arg0) => ({
      ...structuredClone(arg0),
      id: makeId("item"),
      lightGroupId: id.id,
    }));
  floorScene.items.push(...list);
  activeLightGroupId = id.id;
  selection =
    list.length === 1
      ? {
          kind: "item",
          id: list[0].id,
        }
      : null;
  multiSelection =
    list.length > 1
      ? list.map((id2) => ({
          kind: "item",
          id: id2.id,
        }))
      : [];
  renderLightLayerPanel();
  refreshViews("lights");
  scheduleSave();
  showToast(
    "已复制“" +
      lightGroup.name +
      "”及组内 " +
      list.length +
      " 盏灯。",
    "success",
  );
}
function clearLightGroupDropIndicators() {
  for (const element of lightGroupList.querySelectorAll(
    ".light-group-row",
  )) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
}
function reorderLightGroups(arg0, arg1, flag) {
  const value = floorScene.lightGroups.findIndex(
    (item) => item.id === arg0,
  );
  const fromIndex = floorScene.lightGroups.findIndex(
    (item) => item.id === arg1,
  );
  if (value < 0 || fromIndex < 0 || value === fromIndex) {
    return;
  }
  const list = [...floorScene.lightGroups];
  const [movedGroup] = list.splice(value, 1);
  const targetIndex = list.findIndex(
    (item) => item.id === arg1,
  );
  list.splice(targetIndex + (flag ? 1 : 0), 0, movedGroup);
  if (
    !list.every(
      (id, arg12) =>
        id.id === floorScene.lightGroups[arg12]?.id,
    )
  ) {
    pushHistory();
    floorScene.lightGroups = list;
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
    for (const id of floorScene.lightGroups) {
      const el = document.createElement("div");
      el.className =
        "light-group-row" +
        (id.id === activeLightGroupId ? " active" : "");
      el.dataset.lightGroupId = id.id;
      el.draggable = true;
      el.setAttribute(
        "aria-label",
        id.name + "，长按拖动排序，右键可重命名、复制或删除",
      );
      let flag = false;
      let flag2 = null;
      const onPointerUp = () => {
        if (flag2) {
          clearTimeout(flag2);
        }
        flag2 = null;
        flag = false;
        el.classList.remove("drag-ready");
      };
      el.addEventListener("pointerdown", (event) => {
        if (event.button === 0 && !event.target.closest("button")) {
          onPointerUp();
          flag2 = setTimeout(() => {
            flag2 = null;
            flag = true;
            el.classList.add("drag-ready");
          }, 280);
        }
      });
      el.addEventListener("pointerup", onPointerUp);
      el.addEventListener("pointercancel", onPointerUp);
      el.addEventListener("dragstart", (event) => {
        if (!flag) {
          event.preventDefault();
          onPointerUp();
          return;
        }
        draggingLightGroupId = id.id;
        el.classList.remove("drag-ready");
        el.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData(
          "application/x-ha-bridge-light-group",
          id.id,
        );
      });
      el.addEventListener("dragend", () => {
        draggingLightGroupId = "";
        el.classList.remove("dragging");
        onPointerUp();
        clearLightGroupDropIndicators();
      });
      el.addEventListener("click", () => {
        activeLightGroupId = id.id;
        renderLightLayerPanel();
      });
      el.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        showLightGroupContextMenu(id, event);
      });
      el.addEventListener("dragover", (event) => {
        if (!draggingLightGroupId || draggingLightGroupId === id.id) {
          return;
        }
        event.preventDefault();
        clearLightGroupDropIndicators();
        const flag3 =
          event.clientY >=
          el.getBoundingClientRect().top +
            el.getBoundingClientRect().height / 2;
        el.dataset.dropPosition = flag3 ? "after" : "before";
        el.classList.add(flag3 ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      el.addEventListener("drop", (event) => {
        if (!draggingLightGroupId || draggingLightGroupId === id.id) {
          return;
        }
        event.preventDefault();
        const arg0 = draggingLightGroupId;
        const value = el.dataset.dropPosition === "after";
        draggingLightGroupId = "";
        clearLightGroupDropIndicators();
        reorderLightGroups(arg0, id.id, value);
      });
      const button = document.createElement("button");
      button.type = "button";
      button.className = id.enabled ? "on" : "";
      button.textContent = id.enabled ? "◉" : "○";
      button.title = id.enabled ? "关闭这个灯组" : "开启这个灯组";
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        pushHistory();
        id.enabled = !id.enabled;
        requestLightGroupCacheRefresh([id.id]);
        scheduleSave();
      });
      const el2 = document.createElement("span");
      el2.className = "light-group-name";
      el2.textContent = id.name;
      el2.title = "长按灯组后拖动排序，右键可重命名、复制或删除";
      const el3 = document.createElement("small");
      el3.textContent = String(
        floorScene.items.filter(
          (item) =>
            lightItemTypes.has(item.type) &&
            item.lightGroupId === id.id,
        ).length,
      );
      el.append(button, el2, el3);
      lightGroupList.append(el);
    }
    for (const [
      value,
      screenEnabled,
    ] of tvItemsOnFloor().entries()) {
      const el = document.createElement("div");
      el.className = "light-group-row tv-screen-layer-row";
      el.setAttribute(
        "aria-label",
        (screenEnabled.screenLayerName ||
          "电视画面 " + (value + 1)) + "，可独立开启或关闭",
      );
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        screenEnabled.screenEnabled !== false ? "on" : "";
      button.textContent =
        screenEnabled.screenEnabled !== false ? "◉" : "○";
      button.title =
        screenEnabled.screenEnabled !== false
          ? "关闭电视画面"
          : "开启电视画面";
      button.addEventListener("click", () => {
        pushHistory();
        screenEnabled.screenEnabled =
          screenEnabled.screenEnabled === false;
        refreshViews("items");
        scheduleSave();
      });
      const el2 = document.createElement("span");
      el2.className = "light-group-name";
      el2.textContent =
        screenEnabled.screenLayerName || "电视画面 " + (value + 1);
      el2.title = "电视开启画面";
      const el3 = document.createElement("small");
      el3.textContent = "1";
      el.append(
        button,
        el2,
        el3,
      );
      lightGroupList.append(el);
    }
    for (const [
      value,
      chargingEnabled,
    ] of smallCarItemsOnFloor().entries()) {
      const el = document.createElement("div");
      el.className = "light-group-row car-charging-layer-row";
      el.setAttribute(
        "aria-label",
        (chargingEnabled.chargingLayerName ||
          "汽车充电 " + (value + 1)) + "，可独立开启或关闭",
      );
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        chargingEnabled.chargingEnabled === true ? "on" : "";
      button.textContent =
        chargingEnabled.chargingEnabled === true ? "◉" : "○";
      button.title =
        chargingEnabled.chargingEnabled === true
          ? "关闭汽车充电状态"
          : "开启汽车充电状态";
      button.addEventListener("click", () => {
        pushHistory();
        chargingEnabled.chargingEnabled =
          chargingEnabled.chargingEnabled !== true;
        refreshViews("items");
        scheduleSave();
      });
      const el2 = document.createElement("span");
      el2.className = "light-group-name";
      el2.textContent =
        chargingEnabled.chargingLayerName ||
        "汽车充电 " + (value + 1);
      el2.title = "汽车充电中状态图层";
      const el3 = document.createElement("small");
      el3.textContent = "1";
      el.append(
        button,
        el2,
        el3,
      );
      lightGroupList.append(el);
    }
  }
}
function setAllLightGroupsEnabled(arg0) {
  const list = tvItemsOnFloor();
  const list2 = smallCarItemsOnFloor();
  if (
    !(floorScene.lightGroups || []).every(
      (enabled) => enabled.enabled === arg0,
    ) ||
    !list.every(
      (screenEnabled) =>
        (screenEnabled.screenEnabled !== false) === arg0,
    ) ||
    !list2.every(
      (chargingEnabled) =>
        (chargingEnabled.chargingEnabled === true) === arg0,
    )
  ) {
    pushHistory();
    for (const enabled of floorScene.lightGroups) {
      enabled.enabled = arg0;
    }
    for (const screenEnabled of list) {
      screenEnabled.screenEnabled = arg0;
    }
    for (const chargingEnabled of list2) {
      chargingEnabled.chargingEnabled = arg0;
    }
    requestLightGroupCacheRefresh(
      floorScene.lightGroups.map((item) => item.id),
    );
    if (list.length || list2.length) {
      rebuildPreviewMeshes({
        scope: "items",
        preserveLightCache: true,
      });
    }
    scheduleSave();
  }
}
function isSelected(arg0, arg1) {
  return (
    (selection?.kind === arg0 && selection.id === arg1) ||
    multiSelection.some(
      (kind) =>
        kind.kind === arg0 && kind.id === arg1,
    )
  );
}
function clearSelection() {
  selection = null;
  multiSelection = [];
}
function setSelection(kind, id) {
  selection =
    kind && id
      ? {
          kind: kind,
          id: id,
        }
      : null;
  multiSelection = [];
}
function itemPreviewScope(item) {
  if (lightItemTypes.has(item?.type)) {
    return "lights";
  } else {
    return "items";
  }
}
function selectionAssetCategory(list) {
  if (
    !list.length ||
    list.some((kind) => kind.kind !== "item")
  ) {
    return "all";
  }
  const value = new Set(list.map((item) => item.id));
  const list2 = floorScene.items.filter((id) =>
    value.has(id.id),
  );
  if (!list2.length) {
    return "all";
  }
  const length = list2.filter((item) =>
    lightItemTypes.has(item.type),
  ).length;
  if (length === list2.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function activeSelectionAssetCategory() {
  return selectionAssetCategory(
    multiSelection.length ? multiSelection : selection ? [selection] : [],
  );
}
function selectionLightGroupFilter(list) {
  if (!list.length) {
    return null;
  }
  if (list.some((kind) => kind.kind !== "item")) {
    return "all";
  }
  const value = new Set(list.map((item) => item.id));
  const list2 = floorScene.items.filter((id) =>
    value.has(id.id),
  );
  if (!list2.length) {
    return null;
  }
  const list3 = list2.filter(
    (item) =>
      !lightItemTypes.has(item.type) ||
      item.type === "striplight",
  );
  if (!list3.length) {
    return null;
  }
  const length = list3.filter((item) =>
    lightItemTypes.has(item.type),
  ).length;
  if (length === list3.length) {
    return "lights";
  } else if (length === 0) {
    return "items";
  } else {
    return "all";
  }
}
function activeSelectionLightGroupFilter() {
  return selectionLightGroupFilter(
    multiSelection.length ? multiSelection : selection ? [selection] : [],
  );
}
function rebuildPreviewForAssetFilters(arg0) {
  const value = activeSelectionLightGroupFilter();
  const scopeSet = new Set([arg0, value].filter(Boolean));
  if (scopeSet.size) {
    if (scopeSet.has("all")) {
      rebuildPreviewMeshes({
        scope: "all",
        preserveLightCache: true,
      });
      return;
    }
    for (const scope of scopeSet) {
      rebuildPreviewMeshes({
        scope: scope,
        preserveLightCache: true,
      });
    }
  }
}
function cachedWallOpenings() {
  const value = buildWallOpeningsIndex(
    floorScene.walls,
    floorScene.windows,
    floorScene.doors,
    pixelsPerMeter() || 1,
    floorScene.railings,
  );
  floorScene.walls = value.walls;
  floorScene.windows = value.windows;
  floorScene.doors = value.doors;
  floorScene.railings = value.railings;
}
function wallIdMap() {
  const map = new Map(
    floorScene.walls.map((id) => [id.id, id]),
  );
  const mergeCollinearWallSegments2 = mergeCollinearWallSegments(
    floorScene.walls,
    0.000001,
  );
  if (mergeCollinearWallSegments2.walls.length === floorScene.walls.length) {
    return 0;
  }
  const map2 = new Map(
    mergeCollinearWallSegments2.walls.map((id) => [
      id.id,
      id,
    ]),
  );
  const remapOpeningWall = (wall) => {
    const flag = mergeCollinearWallSegments2.wallIdMap.get(
      wall.wallId,
    );
    const flag2 = map.get(wall.wallId);
    const flag3 = map2.get(flag);
    if (!flag || !flag2 || !flag3) {
      return wall;
    }
    const remapWallAttachment2 = remapWallAttachment(
      wall,
      flag2,
      flag3,
    );
    remapWallAttachment2.t = clampWindowT(
      flag3,
      remapWallAttachment2,
      pixelsPerMeter() || 1,
    );
    return remapWallAttachment2;
  };
  const value =
    floorScene.walls.length - mergeCollinearWallSegments2.walls.length;
  floorScene.walls = mergeCollinearWallSegments2.walls;
  floorScene.windows = floorScene.windows.map(remapOpeningWall);
  floorScene.doors = floorScene.doors.map(remapOpeningWall);
  floorScene.railings = floorScene.railings.map(remapOpeningWall);
  return value;
}
function pixelsPerMeter() {
  return floorScene.calibration?.pixelsPerMeter || 0;
}
class StudioHttpError extends Error {
  constructor(arg0, arg1, arg2) {
    super(arg0);
    this.status = arg1;
    this.payload = arg2;
  }
}
async function studioFetch(arg0, method = {}) {
  if (isStageEmbed && method.method && method.method !== "GET") {
    throw new Error("交互户型为只读视图。");
  }
  const status = await fetch("/api/v1" + arg0, {
    cache: "no-store",
    ...method,
    headers: method.body
      ? {
          "Content-Type": "application/json",
          ...(method.headers || {}),
        }
      : method.headers,
  });
  const flag =
    status.status === 204 ? "" : await status.text();
  let detail = null;
  if (flag) {
    try {
      detail = JSON.parse(flag);
    } catch {
      detail = null;
    }
  }
  if (status.status === 401) {
    window.location.assign(
      "/login?next=" + encodeURIComponent(window.location.pathname),
    );
    const flag2 = new StudioHttpError(
      "登录状态已失效。",
      status.status,
      detail,
    );
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  if (
    status.status === 403 &&
    detail?.detail?.code === "LICENSE_RESTRICTED"
  ) {
    window.location.assign("/license");
    const flag2 = new StudioHttpError(
      "当前授权无法使用户型图绘制。",
      status.status,
      detail,
    );
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  if (!status.ok) {
    const message = detail?.detail;
    const flag2 = new StudioHttpError(
      typeof message == "string"
        ? message
        : message?.message ||
          "请求失败（HTTP " + status.status + "）",
      status.status,
      detail,
    );
    throw window.HABridgeLog?.linkError(flag2, status) || flag2;
  }
  return detail;
}
function showToast(arg0, arg1 = "") {
  window.clearTimeout(toastTimer);
  toast.textContent = arg0;
  toast.className = ("toast visible " + arg1).trim();
  toastTimer = window.setTimeout(
    () => {
      toast.className = "toast";
    },
    arg1 === "warning" ? 4400 : 2600,
  );
}
function setSaveStateLabel(arg0, arg1 = "") {
  saveState.className = ("save-state " + arg1).trim();
  saveState.innerHTML = "<i></i>" + arg0;
}
function pushHistory() {
  undoStack.push(cloneFloorScene());
  if (undoStack.length > 40) {
    undoStack.shift();
  }
  redoStack = [];
}
function pushUndoSnapshot(arg0) {
  undoStack.push(arg0);
  if (undoStack.length > 40) {
    undoStack.shift();
  }
  redoStack = [];
}
async function restoreFloorScene(scene) {
  floorScene = normalizeFloorScene(scene);
  const floor = activeFloor();
  if (floor) {
    floor.scene = floorScene;
  }
  planView.rotation = floorScene.settings.planViewRotation;
  clearSelection();
  resetWallDrawing();
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
  window.clearTimeout(deferredModelTimer);
  deferredModelTimer = null;
  deferredModelTasks = [];
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  hasProjectLoaded = floor;
  projectDoc = normalizeProjectDocument(floor.scene);
  if (isStageEmbed) {
    for (const floor2 of projectDoc.floors) {
      floor2.scene.settings.livePreviewEnabled = true;
    }
  }
  applyBaseLighting(projectDoc.baseLighting);
  activeFloorId = projectDoc.activeFloorId;
  if (isAutoDiagramEmbed && floorSelectionQuery !== null) {
    const id = projectDoc.floors.find(
      (item) => item.id === floorSelectionQuery,
    );
    if (floorSelectionQuery === "all" && projectDoc.floors.length > 1) {
      projectDoc.previewFloorMode = "all";
    } else if (id) {
      projectDoc.previewFloorMode = "active";
      projectDoc.activeFloorId = id.id;
      activeFloorId = id.id;
    }
  }
  floorScene = activeFloor().scene;
  activeLightGroupId = "";
  clearSelection();
  resetWallDrawing();
  undoStack = [];
  redoStack = [];
  const list = visibleExternalModelKeys();
  const flag = isAutoDiagramEmbed;
  if (flag) {
    deferExternalModels = true;
  }
  let modelPromises = [];
  if (flag) {
    modelPromises = list.map((arg0) => loadExternalItemModel(arg0));
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
  planView.rotation = floorScene.settings.planViewRotation;
  await reloadPlanBackground();
  refreshViews(flag ? "none" : "all");
  if (!flag) {
    scheduleLightPrecompile(1200);
  }
  if (flag) {
    try {
      const settledResults = Promise.allSettled(modelPromises);
      await Promise.race([
        settledResults,
        new Promise((arg0) => window.setTimeout(arg0, 3500)),
      ]);
      Promise.allSettled(modelPromises).then(() => {
        if (value === projectLoadGeneration) {
          refreshStudioChrome();
        }
      });
    } finally {
      if (value === projectLoadGeneration) {
        window.clearTimeout(modelLoadStatusTimer);
        modelLoadStatusTimer = null;
        deferExternalModels = false;
        updateModelLoadStatus();
      }
    }
  } else {
    rebuildPreviewMeshes({
      force: true,
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
          silent: true,
        });
      } else {
        setCameraProjectionMode(getCameraProjectionMode(), {
          preserveView: false,
        });
        applyCameraView();
      }
    });
  }
}
function showSaveConflict(latest, localScene, targetVersion) {
  saveConflictState = {
    latest: latest,
    localScene: localScene,
    targetVersion: targetVersion,
  };
  setSaveStateLabel("等待处理保存冲突", "error");
  if (!saveConflictDialog.open) {
    saveConflictDialog.showModal();
  }
}
async function flushSave() {
  if (
    isStageEmbed ||
    !hasProjectLoaded ||
    isFlushingSave ||
    saveConflictState ||
    saveGeneration === savedGeneration
  ) {
    return;
  }
  isFlushingSave = true;
  const targetVersion = saveGeneration;
  setSaveStateLabel("正在保存…", "saving");
  const putStudioDocument = async (revision) =>
    studioFetch("/studio3d", {
      method: "PUT",
      hbLogContext: {
        phase: "studio-save",
      },
      body: JSON.stringify({
        revision: revision.revision,
        scene: cloneProjectForStage(),
      }),
    });
  try {
    try {
      hasProjectLoaded = await putStudioDocument(hasProjectLoaded);
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
      phase: "studio-save",
    });
    setSaveStateLabel("保存失败", "error");
    showToast(error.message || "3D 草稿保存失败。", "error");
  } finally {
    isFlushingSave = false;
    if (!saveConflictState && saveGeneration !== savedGeneration) {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(flushSave, 500);
    }
  }
}
saveConflictDialog.addEventListener("cancel", (event) =>
  event.preventDefault(),
);
saveConflictLoad.addEventListener("click", async () => {
  const isLatest = saveConflictState;
  if (isLatest) {
    saveConflictState = null;
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
saveConflictOverwrite.addEventListener("click", () => {
  const isLocalScene = saveConflictState;
  if (isLocalScene) {
    projectDoc = normalizeProjectDocument(isLocalScene.localScene);
    activeFloorId = projectDoc.activeFloorId;
    floorScene = activeFloor().scene;
    hasProjectLoaded = isLocalScene.latest;
    saveConflictState = null;
    saveConflictDialog.close();
    setSaveStateLabel("正在确认覆盖…", "saving");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(flushSave, 0);
  }
});
function planToScreen(planPoint) {
  return {
    x: planPoint.x * planView.zoom + planView.offsetX,
    y: planPoint.y * planView.zoom + planView.offsetY,
  };
}
function screenToPlan(planPoint) {
  const value = planWidth / 2;
  const halfPlanHeight = planHeight / 2;
  const rotationRad = (-planView.rotation * Math.PI) / 180;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  const localX = planPoint.x - value;
  const localY = planPoint.y - halfPlanHeight;
  return {
    x: value + localX * cos - localY * sin,
    y: halfPlanHeight + localX * sin + localY * cos,
  };
}
function screenToPlanWithView(planPoint2) {
  const planPoint = screenToPlan(planPoint2);
  return {
    x: (planPoint.x - planView.offsetX) / planView.zoom,
    y: (planPoint.y - planView.offsetY) / planView.zoom,
  };
}
function pointerEventToCanvasPoint(event) {
  const left = planCanvas.getBoundingClientRect();
  return {
    x: event.clientX - left.left,
    y: event.clientY - left.top,
  };
}
function planContentBounds() {
  if (floorScene.walls.length) {
    return modelBounds({
      background: null,
      walls: floorScene.walls,
      items: [],
    });
  } else if (floorScene.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorScene.items,
    });
  } else {
    return modelBounds(floorScene);
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
  planView.zoom = clamp(
    Math.min(fitWidth / fitContentHeight, fitHeight / fitContentWidth),
    0.03,
    8,
  );
  planView.offsetX =
    planWidth / 2 - (value.minX + value.width / 2) * planView.zoom;
  planView.offsetY =
    planHeight / 2 - (value.minY + value.height / 2) * planView.zoom;
  planNeedsRedraw = true;
  drawPlan();
}
function zoomPlanViewAt(
  arg0,
  planPoint3 = {
    x: planWidth / 2,
    y: planHeight / 2,
  },
) {
  const planPoint = screenToPlanWithView(planPoint3);
  const planPoint2 = screenToPlan(planPoint3);
  planView.zoom = clamp(planView.zoom * arg0, 0.03, 12);
  planView.offsetX = planPoint2.x - planPoint.x * planView.zoom;
  planView.offsetY = planPoint2.y - planPoint.y * planView.zoom;
  drawPlan();
}
function rotatePlanView90() {
  planView.rotation = (planView.rotation + 90) % 360;
  floorScene.settings.planViewRotation = planView.rotation;
  fitPlanViewToContent();
  scheduleSave();
}
function resizePlanCanvas() {
  const size = planStage.getBoundingClientRect();
  planWidth = Math.max(Math.round(size.width), 1);
  planHeight = Math.max(Math.round(size.height), 1);
  const value = Math.min(window.devicePixelRatio || 1, 2);
  planCanvas.width = Math.round(planWidth * value);
  planCanvas.height = Math.round(planHeight * value);
  planCtx.setTransform(value, 0, 0, value, 0, 0);
  if (planNeedsRedraw) {
    drawPlan();
  } else {
    fitPlanViewToContent();
  }
}
function getWallAnalysis(arg0) {
  const tolerance = Math.max(1, arg0 * 0.01);
  const value = floorScene.walls
    .map(
      (wall) =>
        wall.id +
        "," +
        wall.start.x +
        "," +
        wall.start.y +
        "," +
        wall.end.x +
        "," +
        wall.end.y +
        "," +
        wall.thickness +
        "," +
        (wall.allowOpenEnd === true ? 1 : 0),
    )
    .join(";");
  if (
    wallAnalysisCache.scene !== floorScene ||
    wallAnalysisCache.signature !== tolerance + "|" + value
  ) {
    wallAnalysisCache = {
      scene: floorScene,
      signature: tolerance + "|" + value,
      tolerance: tolerance,
      floorPolygons: null,
      intersections: null,
      joinExtensions: null,
      unclosedEndpoints: null,
    };
  }
  return wallAnalysisCache;
}
function getFloorPolygons(arg0) {
  const value = getWallAnalysis(arg0);
  value.floorPolygons ||= closedWallFloorPolygons(
    floorScene.walls,
    value.tolerance,
  );
  return value.floorPolygons;
}
function getWallIntersections(arg0) {
  const value = getWallAnalysis(arg0);
  value.intersections ||= wallIntersections(floorScene.walls);
  return value.intersections;
}
function getWallJoinExtensions(arg0) {
  const value = getWallAnalysis(arg0);
  value.joinExtensions ||= wallJoinExtensions(floorScene.walls);
  return value.joinExtensions;
}
function getUnclosedWallEndpoints(arg0) {
  const value = getWallAnalysis(arg0);
  value.unclosedEndpoints ||= unclosedWallEndpoints(
    floorScene.walls,
    value.tolerance,
    getFloorPolygons(arg0),
  );
  return value.unclosedEndpoints;
}
function wallAttachmentWorldPoint(size) {
  const wall = floorScene.walls.find(
    (item) => item.id === size.wallId,
  );
  if (!wall) {
    return null;
  }
  const value = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const flag = Math.hypot(value, dy);
  if (!flag) {
    return null;
  }
  const clampWindowT2 = clampWindowT(
    wall,
    size,
    pixelsPerMeter() || 1,
  );
  const center = {
    x: wall.start.x + value * clampWindowT2,
    y: wall.start.y + dy * clampWindowT2,
  };
  const minValue = Math.min(
    (size.width * (pixelsPerMeter() || 1)) / 2,
    flag / 2,
  );
  const unit = {
    x: value / flag,
    y: dy / flag,
  };
  return {
    wall: wall,
    center: center,
    start: {
      x: center.x - unit.x * minValue,
      y: center.y - unit.y * minValue,
    },
    end: {
      x: center.x + unit.x * minValue,
      y: center.y + unit.y * minValue,
    },
    unit: unit,
  };
}
function drawWindowPreview(size, preview = {}) {
  const isWall = wallAttachmentWorldPoint(size);
  if (!isWall) {
    return;
  }
  const flag = isSelected("railing", size.id);
  const color = preview.preview
    ? "rgba(123, 220, 240, .72)"
    : flag
      ? "#ffaf46"
      : "#8bd7e8";
  const width = Math.max(
    10,
    isWall.wall.thickness * (pixelsPerMeter() || 100) * planView.zoom + 5,
  );
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(7, 16, 21, .94)",
    width: width,
    cap: "butt",
  });
  drawPlanLine(isWall.start, isWall.end, {
    color: color,
    width: flag ? 5 : 3,
    cap: "butt",
  });
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(224, 250, 255, .72)",
    width: 1,
    cap: "butt",
  });
  drawPlanPoint(isWall.start, color, flag ? 3 : 2);
  drawPlanPoint(isWall.end, color, flag ? 3 : 2);
  if (flag && !preview.preview) {
    drawFloatingLabel(
      isWall.center,
      "玻璃栏杆 · " + size.width.toFixed(2) + " m",
      "#8bd7e8",
    );
  }
}
function drawDoorPreview(size, preview = {}) {
  const isWall = wallAttachmentWorldPoint(size);
  if (!isWall) {
    return;
  }
  const flag = isSelected("door", size.id);
  const value = size.doorType || "solid";
  const color = preview.preview
    ? "rgba(255, 189, 110, .76)"
    : flag
      ? "#ffaf46"
      : ["solid", "double", "entry", "roller-shutter", "frame-only"].includes(
            value,
          )
        ? "#edf2f7"
        : "#bfe9ff";
  const width = Math.max(
    10,
    isWall.wall.thickness * (pixelsPerMeter() || 100) * planView.zoom + 5,
  );
  drawPlanLine(isWall.start, isWall.end, {
    color: "rgba(7, 16, 21, .94)",
    width: width,
    cap: "butt",
  });
  if (value === "frame-only") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x,
    };
    const maxValue = Math.max(
      5 / planView.zoom,
      isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.55,
    );
    for (const planPoint7 of [isWall.start, isWall.end]) {
      drawPlanLine(
        {
          x: planPoint7.x - planPoint6.x * maxValue,
          y: planPoint7.y - planPoint6.y * maxValue,
        },
        {
          x: planPoint7.x + planPoint6.x * maxValue,
          y: planPoint7.y + planPoint6.y * maxValue,
        },
        {
          color: color,
          width: flag ? 4 : 3,
          cap: "butt",
        },
      );
    }
    if (flag) {
      drawFloatingLabel(
        isWall.center,
        "仅门框 · " + size.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value === "sliding-glass") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x,
    };
    const maxValue = Math.max(
      2.5 / planView.zoom,
      isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.16,
    );
    const distance2 = distance(isWall.start, isWall.end);
    const ddpV7 = size.hinge === "right" ? 1 : -1;
    const slidingDoorPanelCenters2 = slidingDoorPanelCenters(
      distance2,
      ddpV7,
    );
    const ddpV8 = distance2 * 0.27;
    for (const [panelOffset, hingeSign] of [
      [slidingDoorPanelCenters2.fixed, -1],
      [slidingDoorPanelCenters2.moving, 1],
    ]) {
      const planPoint7 = {
        x: isWall.center.x + isWall.unit.x * panelOffset,
        y: isWall.center.y + isWall.unit.y * panelOffset,
      };
      const planPoint8 = {
        x: planPoint6.x * maxValue * hingeSign,
        y: planPoint6.y * maxValue * hingeSign,
      };
      const ddpV11 = {
        x: planPoint7.x - isWall.unit.x * ddpV8 + planPoint8.x,
        y: planPoint7.y - isWall.unit.y * ddpV8 + planPoint8.y,
      };
      const ddpV12 = {
        x: planPoint7.x + isWall.unit.x * ddpV8 + planPoint8.x,
        y: planPoint7.y + isWall.unit.y * ddpV8 + planPoint8.y,
      };
      drawPlanLine(ddpV11, ddpV12, {
        color: color,
        width: flag ? 4 : 3,
        cap: "butt",
      });
      drawPlanPoint(hingeSign < 0 ? ddpV12 : ddpV11, color, 2);
    }
    if (flag) {
      drawFloatingLabel(
        isWall.center,
        "玻璃推拉门 · " + size.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value === "roller-shutter") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x,
    };
    const maxValue =
      Math.max(
        2 / planView.zoom,
        isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08,
      ) * (size.swing === -1 ? -1 : 1);
    drawPlanLine(
      {
        x: isWall.start.x + planPoint6.x * maxValue,
        y: isWall.start.y + planPoint6.y * maxValue,
      },
      {
        x: isWall.end.x + planPoint6.x * maxValue,
        y: isWall.end.y + planPoint6.y * maxValue,
      },
      {
        color: color,
        width: flag ? 5 : 4,
        cap: "butt",
      },
    );
    const distance2 = distance(isWall.start, isWall.end);
    const maxValue2 = Math.max(
      3,
      Math.min(18, Math.round(size.width / 0.35)),
    );
    for (let step = 1; step < maxValue2; step += 1) {
      const ddpV9 = distance2 * (step / maxValue2 - 0.5);
      const planPoint7 = {
        x:
          isWall.center.x + isWall.unit.x * ddpV9 + planPoint6.x * maxValue,
        y:
          isWall.center.y + isWall.unit.y * ddpV9 + planPoint6.y * maxValue,
      };
      drawPlanLine(
        {
          x: planPoint7.x - (planPoint6.x * 3) / planView.zoom,
          y: planPoint7.y - (planPoint6.y * 3) / planView.zoom,
        },
        {
          x: planPoint7.x + (planPoint6.x * 3) / planView.zoom,
          y: planPoint7.y + (planPoint6.y * 3) / planView.zoom,
        },
        {
          color: "rgba(167, 178, 188, .72)",
          width: 1,
          cap: "butt",
        },
      );
    }
    if (flag) {
      drawFloatingLabel(
        isWall.center,
        "卷帘门 · " + size.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value === "entry") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x,
    };
    const maxValue = Math.max(
      2 / planView.zoom,
      isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08,
    );
    drawPlanLine(
      {
        x: isWall.start.x + planPoint6.x * maxValue,
        y: isWall.start.y + planPoint6.y * maxValue,
      },
      {
        x: isWall.end.x + planPoint6.x * maxValue,
        y: isWall.end.y + planPoint6.y * maxValue,
      },
      {
        color: color,
        width: preview.preview ? 3 : flag ? 5 : 4,
        cap: "butt",
      },
    );
    drawPlanLine(
      {
        x: isWall.start.x - planPoint6.x * maxValue,
        y: isWall.start.y - planPoint6.y * maxValue,
      },
      {
        x: isWall.end.x - planPoint6.x * maxValue,
        y: isWall.end.y - planPoint6.y * maxValue,
      },
      {
        color: "rgba(167, 178, 188, .72)",
        width: 1,
        cap: "butt",
      },
    );
    const local7 = size.hinge === "right" ? -1 : 1;
    drawPlanPoint(
      {
        x: isWall.center.x + isWall.unit.x * size.width * local7 * 0.34,
        y: isWall.center.y + isWall.unit.y * size.width * local7 * 0.34,
      },
      color,
      flag ? 3 : 2,
    );
    if (flag) {
      drawFloatingLabel(
        isWall.center,
        "入户门（常闭）· " + size.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  if (value === "double") {
    const planPoint6 = {
      x: -isWall.unit.y,
      y: isWall.unit.x,
    };
    const local6 = size.swing === -1 ? -1 : 1;
    const local7 = (distance(isWall.start, isWall.end) / 2) * local6;
    const local8 = {
      x: isWall.start.x + planPoint6.x * local7,
      y: isWall.start.y + planPoint6.y * local7,
    };
    const local9 = {
      x: isWall.end.x + planPoint6.x * local7,
      y: isWall.end.y + planPoint6.y * local7,
    };
    drawPlanLine(isWall.start, local8, {
      color: color,
      width: preview.preview ? 2 : flag ? 4 : 3,
      cap: "butt",
    });
    drawPlanLine(isWall.end, local9, {
      color: color,
      width: preview.preview ? 2 : flag ? 4 : 3,
      cap: "butt",
    });
    drawPlanPoint(isWall.start, color, flag ? 3.5 : 2.5);
    drawPlanPoint(isWall.end, color, flag ? 3.5 : 2.5);
    if (flag) {
      drawFloatingLabel(
        isWall.center,
        "双开门 · " + size.width.toFixed(2) + " m",
        "#ffaf46",
      );
    }
    return;
  }
  const flag2 = size.hinge === "right";
  const planPoint = flag2 ? isWall.end : isWall.start;
  const planPoint2 = flag2 ? isWall.start : isWall.end;
  const planPoint3 = {
    x: planPoint2.x - planPoint.x,
    y: planPoint2.y - planPoint.y,
  };
  const local2 = size.swing === -1 ? -1 : 1;
  const planPoint4 = {
    x: planPoint.x - planPoint3.y * local2,
    y: planPoint.y + planPoint3.x * local2,
  };
  drawPlanLine(planPoint, planPoint4, {
    color: color,
    width: preview.preview ? 2 : flag ? 4 : 3,
    cap: "butt",
    dash: preview.preview ? [5, 4] : null,
  });
  if (value === "glass") {
    const planPoint6 = {
      x: (isWall.unit.x * 3) / planView.zoom,
      y: (isWall.unit.y * 3) / planView.zoom,
    };
    drawPlanLine(
      {
        x: planPoint.x + planPoint6.x,
        y: planPoint.y + planPoint6.y,
      },
      {
        x: planPoint4.x + planPoint6.x,
        y: planPoint4.y + planPoint6.y,
      },
      {
        color: "rgba(183, 229, 247, .58)",
        width: 1,
        cap: "butt",
      },
    );
  }
  const planPoint5 = planToScreen(planPoint);
  const dist = distance(planPoint, planPoint2) * planView.zoom;
  const angle = Math.atan2(planPoint3.y, planPoint3.x);
  const local5 = angle + (local2 * Math.PI) / 2;
  planCtx.save();
  planCtx.strokeStyle = color;
  planCtx.lineWidth = preview.preview ? 1 : flag ? 2 : 1.25;
  if (preview.preview) {
    planCtx.setLineDash([5, 4]);
  }
  planCtx.beginPath();
  planCtx.arc(
    planPoint5.x,
    planPoint5.y,
    dist,
    angle,
    local5,
    local2 < 0,
  );
  planCtx.stroke();
  planCtx.restore();
  drawPlanPoint(planPoint, color, flag ? 3.5 : 2.5);
  if (flag) {
    drawFloatingLabel(
      isWall.center,
      "" +
        (value === "glass" ? "玻璃门 · " : "") +
        size.width.toFixed(2) +
        " m",
      "#ffaf46",
    );
  }
}
function drawItemOnPlan(item) {
  const planPoint = planToScreen(item);
  const screenWidth = item.width * pixelsPerMeter() * planView.zoom;
  const screenDepth = item.depth * pixelsPerMeter() * planView.zoom;
  const selected = isSelected("item", item.id);
  planCtx.save();
  planCtx.translate(planPoint.x, planPoint.y);
  planCtx.rotate((item.rotation * Math.PI) / 180);
  planCtx.fillStyle = item.color + "c7";
  planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
  planCtx.lineWidth = selected ? 2 : 1;
  if (lightItemTypes.has(item.type)) {
    const radius = Math.max(
      Math.min(screenWidth, screenDepth) * 0.44,
      item.type === "downlight" ? 10 : 8,
    );
    const kelvinColor =
      "#" +
      kelvinToRgbHex(item.lightTemperature).toString(16).padStart(6, "0");
    const groupVisible = isLightGroupVisible(item);
    planCtx.fillStyle = groupVisible ? kelvinColor : "#68737d";
    planCtx.strokeStyle = groupVisible
      ? "rgba(255, 221, 163, .88)"
      : "rgba(196, 207, 216, .48)";
    planCtx.lineWidth = 1.2;
    if (item.type === "striplight") {
      planCtx.beginPath();
      const cornerRadius = Math.min(7, screenDepth * 0.42);
      planCtx.roundRect(
        -screenWidth / 2,
        -screenDepth * 0.34,
        screenWidth,
        screenDepth * 0.68,
        cornerRadius,
      );
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = groupVisible
        ? "rgba(255, 238, 195, .95)"
        : "rgba(196, 207, 216, .42)";
      planCtx.lineWidth = Math.max(2, screenDepth * 0.12);
      planCtx.beginPath();
      planCtx.moveTo(-screenWidth * 0.42, 0);
      planCtx.lineTo(screenWidth * 0.42, 0);
      planCtx.stroke();
    } else if (item.type === "ceilinglight") {
      const radius2 = Math.max(Math.min(screenWidth, screenDepth) * 0.82, 16);
      planCtx.beginPath();
      planCtx.rect(-radius2 / 2, -radius2 / 2, radius2, radius2);
      planCtx.fill();
      planCtx.stroke();
      const innerSize = radius2 * 0.58;
      planCtx.strokeRect(-innerSize / 2, -innerSize / 2, innerSize, innerSize);
    } else {
      planCtx.beginPath();
      planCtx.arc(0, 0, radius, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.stroke();
      planCtx.beginPath();
      planCtx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
      planCtx.stroke();
      for (let n = 0; n < 4; n += 1) {
        const angle = (n * Math.PI) / 2;
        planCtx.beginPath();
        planCtx.moveTo(
          Math.cos(angle) * radius * 0.68,
          Math.sin(angle) * radius * 0.68,
        );
        planCtx.lineTo(
          Math.cos(angle) * radius * 1.12,
          Math.sin(angle) * radius * 1.12,
        );
        planCtx.stroke();
      }
    }
  } else if (item.type === "planlabel") {
    const planLabelProjectionMetrics2 = planLabelProjectionMetrics(
      screenWidth,
      screenDepth,
      item.lineLength,
    );
    planCtx.fillStyle = "#929baa";
    const titleFontSize = planLabelProjectionMetrics2.titleFontSize;
    planCtx.font = "700 " + titleFontSize + "px sans-serif";
    drawTrackedText(
      planCtx,
      item.title || "家庭总览",
      planLabelProjectionMetrics2.titleStartX,
      planLabelProjectionMetrics2.titleY,
      titleFontSize * clamp(finite(item.titleSpacing, 1.05), 0, 1.8),
      planLabelProjectionMetrics2.titleMaxWidth,
    );
    const iconX = planLabelProjectionMetrics2.iconX;
    const iconY = planLabelProjectionMetrics2.iconY;
    const iconSize = planLabelProjectionMetrics2.iconSize;
    planCtx.fillStyle = "#929baa";
    planCtx.beginPath();
    planCtx.moveTo(iconX, iconY - iconSize * 0.58);
    planCtx.lineTo(
      iconX + iconSize * 0.56,
      iconY - iconSize * 0.02,
    );
    planCtx.lineTo(
      iconX + iconSize * 0.38,
      iconY - iconSize * 0.02,
    );
    planCtx.lineTo(
      iconX + iconSize * 0.38,
      iconY + iconSize * 0.5,
    );
    planCtx.lineTo(
      iconX - iconSize * 0.38,
      iconY + iconSize * 0.5,
    );
    planCtx.lineTo(
      iconX - iconSize * 0.38,
      iconY - iconSize * 0.02,
    );
    planCtx.lineTo(
      iconX - iconSize * 0.56,
      iconY - iconSize * 0.02,
    );
    planCtx.lineTo(iconX, iconY - iconSize * 0.52);
    planCtx.closePath();
    planCtx.fill();
    planCtx.fillStyle = "#929baa";
    planCtx.textAlign = "left";
    const subtitleFontSize =
      planLabelProjectionMetrics2.subtitleFontSize;
    planCtx.font =
      "400 " + subtitleFontSize + 'px "Arial Narrow", Arial, sans-serif';
    drawTrackedText(
      planCtx,
      item.subtitle || "HOME PLAN",
      planLabelProjectionMetrics2.subtitleStartX,
      planLabelProjectionMetrics2.subtitleY,
      subtitleFontSize *
        clamp(finite(item.subtitleSpacing, 0.08), 0, 0.6),
      planLabelProjectionMetrics2.subtitleMaxWidth,
    );
    planCtx.strokeStyle = "rgba(146, 155, 170, .72)";
    planCtx.lineWidth = planLabelProjectionMetrics2.baselineLineWidth;
    const baselineY = planLabelProjectionMetrics2.baselineY;
    const baselineStartX = planLabelProjectionMetrics2.baselineStartX;
    const baselineEndX =
      baselineStartX + planLabelProjectionMetrics2.baselineLength;
    planCtx.beginPath();
    planCtx.moveTo(baselineStartX, baselineY);
    planCtx.lineTo(baselineEndX, baselineY);
    planCtx.moveTo(
      baselineStartX,
      baselineY - planLabelProjectionMetrics2.baselineCapHalfHeight,
    );
    planCtx.lineTo(
      baselineStartX,
      baselineY + planLabelProjectionMetrics2.baselineCapHalfHeight,
    );
    planCtx.moveTo(
      baselineEndX,
      baselineY - planLabelProjectionMetrics2.baselineCapHalfHeight,
    );
    planCtx.lineTo(
      baselineEndX,
      baselineY + planLabelProjectionMetrics2.baselineCapHalfHeight,
    );
    planCtx.stroke();
  } else if (item.type === "smallcar") {
    const cornerRadius = Math.min(screenWidth * 0.22, screenDepth * 0.08);
    if (item.chargingEnabled === true) {
      planCtx.save();
      planCtx.scale(screenWidth * 0.76, screenDepth * 0.62);
      const addColorStop = planCtx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        1,
      );
      addColorStop.addColorStop(0, "rgba(79, 239, 183, .32)");
      addColorStop.addColorStop(0.48, "rgba(79, 239, 183, .17)");
      addColorStop.addColorStop(1, "rgba(79, 239, 183, 0)");
      planCtx.fillStyle = addColorStop;
      planCtx.beginPath();
      planCtx.arc(0, 0, 1, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.restore();
      planCtx.fillStyle = "rgba(79, 239, 183, .24)";
      const gridStep = Math.max(9, Math.min(screenWidth, screenDepth) * 0.07);
      for (
        let gx = -screenWidth * 0.62;
        gx <= screenWidth * 0.62;
        gx += gridStep
      ) {
        for (
          let gy = -screenDepth * 0.54;
          gy <= screenDepth * 0.54;
          gy += gridStep
        ) {
          const dist = Math.hypot(
            gx / (screenWidth * 0.62),
            gy / (screenDepth * 0.54),
          );
          if (!(dist >= 1)) {
            planCtx.globalAlpha = (1 - dist) * 0.72;
            planCtx.beginPath();
            planCtx.arc(
              gx,
              gy,
              Math.max(0.7, gridStep * 0.1),
              0,
              Math.PI * 2,
            );
            planCtx.fill();
          }
        }
      }
      planCtx.globalAlpha = 1;
      planCtx.fillStyle = item.color + "c7";
    }
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.48,
      -screenDepth * 0.49,
      screenWidth * 0.96,
      screenDepth * 0.98,
      cornerRadius,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(38, 48, 57, .72)";
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.38,
      -screenDepth * 0.2,
      screenWidth * 0.76,
      screenDepth * 0.42,
      cornerRadius * 0.7,
    );
    planCtx.fill();
    for (const factor of [-0.5, 0.5]) {
      for (const factor2 of [-0.3, 0.3]) {
        planCtx.fillRect(
          factor * screenWidth - screenWidth * 0.045,
          factor2 * screenDepth - screenDepth * 0.085,
          screenWidth * 0.09,
          screenDepth * 0.17,
        );
      }
    }
    if (item.chargingEnabled === true) {
      planCtx.fillStyle = "#7dffd0";
      planCtx.beginPath();
      planCtx.moveTo(screenWidth * 0.028, -screenDepth * 0.095);
      planCtx.lineTo(-screenWidth * 0.058, screenDepth * 0.008);
      planCtx.lineTo(screenWidth * 0.006, screenDepth * 0.008);
      planCtx.lineTo(-screenWidth * 0.028, screenDepth * 0.095);
      planCtx.lineTo(screenWidth * 0.07, -screenDepth * 0.02);
      planCtx.lineTo(screenWidth * 0.008, -screenDepth * 0.02);
      planCtx.closePath();
      planCtx.fill();
    }
  } else if (item.type === "curtain") {
    const curtainPosition = ["left", "right", "split"].includes(
      item.curtainPosition,
    )
      ? item.curtainPosition
      : "split";
    const drawPanel = (x, w) => {
      planCtx.beginPath();
      planCtx.roundRect(
        x,
        -screenDepth * 0.46,
        w,
        screenDepth * 0.92,
        Math.min(screenDepth * 0.32, w * 0.18),
      );
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = "rgba(25, 34, 43, .48)";
      planCtx.lineWidth = 1;
      for (let n = 1; n < 5; n += 1) {
        const foldX = x + (w * n) / 5;
        planCtx.beginPath();
        planCtx.moveTo(foldX, -screenDepth * 0.34);
        planCtx.lineTo(foldX, screenDepth * 0.34);
        planCtx.stroke();
      }
    };
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(234, 240, 244, .72)";
    planCtx.lineWidth = selected ? 2 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.5, 0);
    planCtx.lineTo(screenWidth * 0.5, 0);
    planCtx.stroke();
    if (curtainPosition === "left") {
      drawPanel(-screenWidth * 0.5, screenWidth * 0.24);
    } else if (curtainPosition === "right") {
      drawPanel(screenWidth * 0.26, screenWidth * 0.24);
    } else {
      drawPanel(-screenWidth * 0.5, screenWidth * 0.16);
      drawPanel(screenWidth * 0.34, screenWidth * 0.16);
    }
  } else if (item.type === "pillar") {
    planCtx.beginPath();
    planCtx.rect(-screenWidth / 2, -screenDepth / 2, screenWidth, screenDepth);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeStyle = selected
      ? "rgba(255, 193, 116, .95)"
      : "rgba(25, 34, 43, .5)";
    planCtx.lineWidth = 1;
    planCtx.strokeRect(
      -screenWidth * 0.36,
      -screenDepth * 0.36,
      screenWidth * 0.72,
      screenDepth * 0.72,
    );
  } else if (item.type === "bar") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth / 2,
      -screenDepth / 2,
      screenWidth,
      screenDepth,
      Math.min(5, screenDepth * 0.16),
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.44, -screenDepth * 0.18);
    planCtx.lineTo(screenWidth * 0.44, -screenDepth * 0.18);
    planCtx.stroke();
    for (const factor of [-0.28, 0, 0.28]) {
      planCtx.beginPath();
      planCtx.arc(
        screenWidth * factor,
        screenDepth * 0.38,
        Math.max(2, screenDepth * 0.12),
        0,
        Math.PI * 2,
      );
      planCtx.stroke();
    }
  } else if (item.type === "aquarium") {
    planCtx.fillStyle = "rgba(92, 174, 202, .25)";
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(178, 225, 238, .9)";
    planCtx.beginPath();
    planCtx.rect(-screenWidth / 2, -screenDepth / 2, screenWidth, screenDepth);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeRect(
      -screenWidth * 0.43,
      -screenDepth * 0.34,
      screenWidth * 0.86,
      screenDepth * 0.68,
    );
    for (const factor of [-0.25, 0.18]) {
      planCtx.beginPath();
      planCtx.arc(
        screenWidth * factor,
        screenDepth * (factor > 0 ? 0.08 : -0.06),
        Math.max(2, screenDepth * 0.08),
        0,
        Math.PI * 2,
      );
      planCtx.stroke();
    }
  } else if (item.type === "coffeetable") {
    const radius = Math.min(screenWidth, screenDepth) * 0.32;
    const radius2 = radius * 0.7;
    planCtx.beginPath();
    planCtx.arc(-screenWidth * 0.16, screenDepth * 0.08, radius, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(screenWidth * 0.24, -screenDepth * 0.2, radius2, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (roundTableTypes.has(item.type)) {
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      0,
      screenWidth * 0.32,
      screenDepth * 0.32,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.fill();
    planCtx.stroke();
    for (const [fx, fy] of [
      [-0.38, 0],
      [0.38, 0],
      [0, -0.38],
      [0, 0.38],
    ]) {
      planCtx.beginPath();
      planCtx.roundRect(
        screenWidth * fx - screenWidth * 0.085,
        screenDepth * fy - screenDepth * 0.095,
        screenWidth * 0.17,
        screenDepth * 0.19,
        Math.min(screenWidth, screenDepth) * 0.035,
      );
      planCtx.fill();
      planCtx.stroke();
    }
    if (hasRoundTableTurntable(item)) {
      planCtx.beginPath();
      planCtx.ellipse(
        0,
        0,
        screenWidth * 0.27,
        screenDepth * 0.27,
        0,
        0,
        Math.PI * 2,
      );
      planCtx.fill();
      planCtx.stroke();
    }
  } else if (item.type === "squarecoffeetable") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.47,
      -screenDepth * 0.47,
      screenWidth * 0.94,
      screenDepth * 0.94,
      Math.min(screenWidth, screenDepth) * 0.08,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeRect(
      -screenWidth * 0.33,
      -screenDepth * 0.38,
      screenWidth * 0.66,
      screenDepth * 0.76,
    );
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.08, -screenDepth * 0.38);
    planCtx.lineTo(-screenWidth * 0.08, screenDepth * 0.38);
    planCtx.moveTo(screenWidth * 0.08, -screenDepth * 0.38);
    planCtx.lineTo(screenWidth * 0.08, screenDepth * 0.38);
    planCtx.stroke();
    planCtx.fillStyle = "rgba(25, 34, 43, .58)";
    for (const factor of [-0.39, 0.39]) {
      for (const factor2 of [-0.34, 0.34]) {
        planCtx.beginPath();
        planCtx.arc(
          screenWidth * factor,
          screenDepth * factor2,
          Math.max(1.5, Math.min(screenWidth, screenDepth) * 0.045),
          0,
          Math.PI * 2,
        );
        planCtx.fill();
      }
    }
  } else if (item.type === "floorlamp") {
    const baseX = -screenWidth * 0.34;
    const tipX = screenWidth * 0.31;
    const radius = Math.min(screenDepth * 0.34, screenWidth * 0.13);
    const radius2 = Math.min(screenDepth * 0.46, screenWidth * 0.14);
    planCtx.lineCap = "round";
    planCtx.lineWidth = selected ? 2.4 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(baseX, 0);
    planCtx.lineTo(tipX, 0);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(baseX, 0, radius, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(tipX, 0, radius2, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "toilet") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.42, -screenDepth * 0.42);
    planCtx.lineTo(screenWidth * 0.42, -screenDepth * 0.42);
    planCtx.bezierCurveTo(
      screenWidth * 0.48,
      -screenDepth * 0.08,
      screenWidth * 0.48,
      screenDepth * 0.28,
      0,
      screenDepth * 0.48,
    );
    planCtx.bezierCurveTo(
      -screenWidth * 0.48,
      screenDepth * 0.28,
      -screenWidth * 0.48,
      -screenDepth * 0.08,
      -screenWidth * 0.42,
      -screenDepth * 0.42,
    );
    planCtx.closePath();
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "squattoilet") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth / 2,
      -screenDepth / 2,
      screenWidth,
      screenDepth,
      Math.min(screenWidth, screenDepth) * 0.12,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      screenDepth * 0.04,
      screenWidth * 0.18,
      screenDepth * 0.31,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
    for (const factor of [-1, 1]) {
      planCtx.strokeRect(
        factor * screenWidth * 0.38 - screenWidth * 0.07,
        -screenDepth * 0.25,
        screenWidth * 0.14,
        screenDepth * 0.5,
      );
    }
  } else if (item.type === "urinal") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.38,
      -screenDepth * 0.42,
      screenWidth * 0.76,
      screenDepth * 0.84,
      Math.min(screenWidth, screenDepth) * 0.28,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      screenDepth * 0.04,
      screenWidth * 0.2,
      screenDepth * 0.28,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
  } else if (item.type === "bathtub") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.48,
      -screenDepth * 0.45,
      screenWidth * 0.96,
      screenDepth * 0.9,
      Math.min(screenWidth, screenDepth) * 0.36,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      0,
      screenWidth * 0.34,
      screenDepth * 0.29,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
  } else if (item.type === "walllamp") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(screenWidth, screenDepth) * 0.36, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.42, screenDepth * 0.38);
    planCtx.lineTo(screenWidth * 0.42, screenDepth * 0.38);
    planCtx.stroke();
  } else if (item.type === "glasspartition") {
    planCtx.fillStyle = "rgba(169, 197, 211, .2)";
    planCtx.strokeStyle = selected ? "#ff9d2e" : "rgba(183, 218, 231, .82)";
    planCtx.beginPath();
    planCtx.rect(-screenWidth / 2, -screenDepth / 2, screenWidth, screenDepth);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "storagewaterheater") {
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      0,
      screenWidth * 0.46,
      screenDepth * 0.44,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .82)";
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.2,
      -screenDepth * 0.28,
      screenWidth * 0.4,
      screenDepth * 0.22,
      Math.min(screenWidth, screenDepth) * 0.08,
    );
    planCtx.fill();
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.3, screenDepth * 0.36);
    planCtx.lineTo(-screenWidth * 0.3, screenDepth * 0.52);
    planCtx.moveTo(screenWidth * 0.3, screenDepth * 0.36);
    planCtx.lineTo(screenWidth * 0.3, screenDepth * 0.52);
    planCtx.stroke();
  } else if (item.type === "gaswaterheater") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.46,
      -screenDepth * 0.46,
      screenWidth * 0.92,
      screenDepth * 0.92,
      Math.min(screenWidth, screenDepth) * 0.1,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .82)";
    planCtx.fillRect(
      -screenWidth * 0.22,
      -screenDepth * 0.26,
      screenWidth * 0.44,
      screenDepth * 0.17,
    );
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.24, screenDepth * 0.44);
    planCtx.lineTo(-screenWidth * 0.24, screenDepth * 0.58);
    planCtx.moveTo(0, screenDepth * 0.44);
    planCtx.lineTo(0, screenDepth * 0.58);
    planCtx.moveTo(screenWidth * 0.24, screenDepth * 0.44);
    planCtx.lineTo(screenWidth * 0.24, screenDepth * 0.58);
    planCtx.stroke();
  } else if (item.type === "pipelinewaterpurifier") {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.46,
      -screenDepth * 0.46,
      screenWidth * 0.92,
      screenDepth * 0.92,
      Math.min(screenWidth, screenDepth) * 0.08,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(31, 39, 45, .9)";
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth * 0.4,
      -screenDepth * 0.35,
      screenWidth * 0.8,
      screenDepth * 0.28,
      Math.min(screenWidth, screenDepth) * 0.05,
    );
    planCtx.fill();
    planCtx.strokeStyle = "rgba(231, 235, 236, .74)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.12, -screenDepth * 0.18);
    planCtx.lineTo(screenWidth * 0.12, -screenDepth * 0.18);
    planCtx.stroke();
    planCtx.fillStyle = "rgba(47, 58, 69, .7)";
    for (const factor of [-0.2, 0.2]) {
      planCtx.beginPath();
      planCtx.arc(
        screenWidth * factor,
        screenDepth * 0.18,
        Math.max(1.5, Math.min(screenWidth, screenDepth) * 0.055),
        0,
        Math.PI * 2,
      );
      planCtx.fill();
    }
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.26, screenDepth * 0.36);
    planCtx.lineTo(-screenWidth * 0.26, screenDepth * 0.5);
    planCtx.moveTo(screenWidth * 0.26, screenDepth * 0.36);
    planCtx.lineTo(screenWidth * 0.26, screenDepth * 0.5);
    planCtx.stroke();
  } else if (item.type === "tea_bar_machine") {
    planCtx.beginPath();
    planCtx.rect(
      -screenWidth * 0.46,
      -screenDepth * 0.46,
      screenWidth * 0.92,
      screenDepth * 0.92,
    );
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(38, 44, 47, .86)";
    planCtx.fillRect(
      -screenWidth * 0.38,
      -screenDepth * 0.36,
      screenWidth * 0.76,
      screenDepth * 0.2,
    );
    planCtx.strokeStyle = "rgba(25, 34, 43, .5)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.46, screenDepth * 0.08);
    planCtx.lineTo(screenWidth * 0.46, screenDepth * 0.08);
    planCtx.moveTo(-screenWidth * 0.46, screenDepth * 0.3);
    planCtx.lineTo(screenWidth * 0.46, screenDepth * 0.3);
    planCtx.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(item.type)) {
    planCtx.beginPath();
    planCtx.rect(-screenWidth / 2, -screenDepth / 2, screenWidth, screenDepth);
    planCtx.fill();
    planCtx.stroke();
  } else if (item.type === "ricecooker") {
    planCtx.beginPath();
    planCtx.ellipse(
      0,
      0,
      screenWidth * 0.46,
      screenDepth * 0.46,
      0,
      0,
      Math.PI * 2,
    );
    planCtx.fill();
    planCtx.stroke();
  } else {
    planCtx.beginPath();
    planCtx.roundRect(
      -screenWidth / 2,
      -screenDepth / 2,
      screenWidth,
      screenDepth,
      Math.min(6, screenWidth / 5, screenDepth / 5),
    );
    planCtx.fill();
    planCtx.stroke();
  }
  planCtx.strokeStyle = "rgba(17, 24, 31, .5)";
  planCtx.lineWidth = 1;
  if (item.type === "coffeetable") {
    const radius = Math.min(screenWidth, screenDepth) * 0.32;
    planCtx.beginPath();
    planCtx.arc(
      -screenWidth * 0.16,
      screenDepth * 0.08,
      radius * 0.32,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(
      screenWidth * 0.24,
      -screenDepth * 0.2,
      radius * 0.23,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
  } else if (item.type === "squarecoffeetable") {
    planCtx.strokeRect(
      -screenWidth * 0.35,
      -screenDepth * 0.35,
      screenWidth * 0.7,
      screenDepth * 0.7,
    );
  } else if (item.type === "bed") {
    planCtx.strokeRect(
      -screenWidth * 0.4,
      -screenDepth * 0.4,
      screenWidth * 0.8,
      screenDepth * 0.23,
    );
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth / 2, -screenDepth * 0.12);
    planCtx.lineTo(screenWidth / 2, -screenDepth * 0.12);
    planCtx.stroke();
  } else if (item.type === "sofa") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth / 2, -screenDepth * 0.27);
    planCtx.lineTo(screenWidth / 2, -screenDepth * 0.27);
    planCtx.stroke();
    planCtx.strokeRect(
      -screenWidth * 0.42,
      -screenDepth * 0.12,
      screenWidth * 0.84,
      screenDepth * 0.43,
    );
  } else if (item.type === "table") {
    for (const factor of [-0.38, 0.38]) {
      for (const factor2 of [-0.32, 0.32]) {
        planCtx.beginPath();
        planCtx.arc(
          screenWidth * factor,
          screenDepth * factor2,
          Math.max(1.5, Math.min(screenWidth, screenDepth) * 0.045),
          0,
          Math.PI * 2,
        );
        planCtx.stroke();
      }
    }
  } else if (
    roundTableTypes.has(item.type) &&
    hasRoundTableTurntable(item)
  ) {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(screenWidth, screenDepth) * 0.17, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (item.type === "fridge") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth / 2, -screenDepth * 0.12);
    planCtx.lineTo(screenWidth / 2, -screenDepth * 0.12);
    planCtx.stroke();
  } else if (item.type === "storagewaterheater") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(screenWidth, screenDepth) * 0.26, 0, Math.PI * 2);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.29, screenDepth * 0.36);
    planCtx.lineTo(screenWidth * 0.29, screenDepth * 0.36);
    planCtx.stroke();
  } else if (item.type === "gaswaterheater") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.36, -screenDepth * 0.08);
    planCtx.lineTo(screenWidth * 0.36, -screenDepth * 0.08);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.3, screenDepth * 0.36);
    planCtx.lineTo(screenWidth * 0.3, screenDepth * 0.36);
    planCtx.stroke();
  } else if (item.type === "pipelinewaterpurifier") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.3, screenDepth * 0.34);
    planCtx.lineTo(screenWidth * 0.3, screenDepth * 0.34);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(
      screenWidth * 0.02,
      screenDepth * 0.16,
      Math.min(screenWidth, screenDepth) * 0.08,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
  } else if (item.type === "tea_bar_machine") {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.38, -screenDepth * 0.02);
    planCtx.lineTo(screenWidth * 0.38, -screenDepth * 0.02);
    planCtx.moveTo(-screenWidth * 0.42, screenDepth * 0.2);
    planCtx.lineTo(screenWidth * 0.42, screenDepth * 0.2);
    planCtx.stroke();
  } else if (["dishwasher", "steamoven", "microwave"].includes(item.type)) {
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.42, screenDepth * 0.3);
    planCtx.lineTo(screenWidth * 0.42, screenDepth * 0.3);
    planCtx.stroke();
  } else if (item.type === "glasspartition") {
    planCtx.strokeStyle = "rgba(183, 218, 231, .72)";
    planCtx.beginPath();
    planCtx.moveTo(-screenWidth * 0.46, 0);
    planCtx.lineTo(screenWidth * 0.46, 0);
    planCtx.stroke();
  } else if (item.type === "ricecooker") {
    planCtx.beginPath();
    planCtx.arc(
      0,
      -screenDepth * 0.04,
      Math.min(screenWidth, screenDepth) * 0.28,
      0,
      Math.PI * 2,
    );
    planCtx.stroke();
  } else if (item.type === "tv") {
    if (item.tvMountStyle === "mobile") {
      planCtx.fillStyle = "rgba(46, 53, 61, .88)";
      planCtx.fillRect(
        -screenWidth * 0.36,
        -screenDepth * 0.4,
        screenWidth * 0.72,
        screenDepth * 0.8,
      );
      planCtx.strokeRect(
        -screenWidth * 0.08,
        -screenDepth * 0.42,
        screenWidth * 0.16,
        screenDepth * 0.84,
      );
    } else if (item.tvMountStyle === "tabletop") {
      planCtx.strokeRect(
        -screenWidth * 0.3,
        -screenDepth * 0.34,
        screenWidth * 0.6,
        screenDepth * 0.68,
      );
    }
    planCtx.fillStyle =
      item.screenEnabled === false
        ? "rgba(8, 12, 15, .8)"
        : "rgba(48, 113, 153, .86)";
    planCtx.fillRect(
      -screenWidth * 0.44,
      -screenDepth * 0.28,
      screenWidth * 0.88,
      screenDepth * 0.56,
    );
    if (item.screenEnabled !== false) {
      planCtx.fillStyle = "rgba(255, 159, 54, .92)";
      planCtx.fillRect(
        -screenWidth * 0.37,
        -screenDepth * 0.18,
        screenWidth * 0.05,
        screenDepth * 0.36,
      );
    }
  } else if (item.type === "plant") {
    planCtx.beginPath();
    planCtx.arc(0, 0, Math.min(screenWidth, screenDepth) * 0.31, 0, Math.PI * 2);
    planCtx.stroke();
  } else if (stairLikeTypes.has(item.type)) {
    for (let n = 1; n < 10; n += 1) {
      const y = -screenDepth / 2 + (screenDepth * n) / 10;
      planCtx.beginPath();
      planCtx.moveTo(-screenWidth / 2, y);
      planCtx.lineTo(screenWidth / 2, y);
      planCtx.stroke();
    }
    planCtx.beginPath();
    planCtx.moveTo(0, screenDepth * 0.34);
    planCtx.lineTo(0, -screenDepth * 0.3);
    planCtx.lineTo(-Math.min(screenWidth, screenDepth) * 0.08, -screenDepth * 0.2);
    planCtx.moveTo(0, -screenDepth * 0.3);
    planCtx.lineTo(Math.min(screenWidth, screenDepth) * 0.08, -screenDepth * 0.2);
    planCtx.stroke();
  }
  if (selected) {
    planCtx.strokeStyle = "rgba(255, 157, 46, .9)";
    planCtx.lineWidth = 1;
    planCtx.setLineDash([5, 3]);
    planCtx.strokeRect(-screenWidth / 2, -screenDepth / 2, screenWidth, screenDepth);
    planCtx.setLineDash([]);
    const n = 7;
    planCtx.fillStyle = "#111820";
    for (const [fx, fy] of [
      [-screenWidth / 2, -screenDepth / 2],
      [screenWidth / 2, -screenDepth / 2],
      [screenWidth / 2, screenDepth / 2],
      [-screenWidth / 2, screenDepth / 2],
    ]) {
      planCtx.fillRect(
        fx - n / 2,
        fy - n / 2,
        n,
        n,
      );
      planCtx.strokeRect(
        fx - n / 2,
        fy - n / 2,
        n,
        n,
      );
    }
    const y = -screenDepth / 2 - 17;
    planCtx.strokeStyle = "#ff9d2e";
    planCtx.beginPath();
    planCtx.moveTo(0, -screenDepth / 2);
    planCtx.lineTo(0, y + 4);
    planCtx.stroke();
    planCtx.fillStyle = "#111820";
    planCtx.beginPath();
    planCtx.arc(0, y, 4, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  }
  planCtx.restore();
}
function rotatedItemCorner(planPoint, arg1, arg2) {
  const value = ((Number(planPoint.rotation) || 0) * Math.PI) / 180;
  return {
    x:
      planPoint.x +
      arg1 * Math.cos(value) -
      arg2 * Math.sin(value),
    y:
      planPoint.y +
      arg1 * Math.sin(value) +
      arg2 * Math.cos(value),
  };
}
function itemPlanBounds(size) {
  const value = pixelsPerMeter() || 100;
  const ipbV2 = (size.width * value) / 2;
  const ipbV3 = (size.depth * value) / 2;
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
    ].map((planPoint) => ({
      ...planPoint,
      point: rotatedItemCorner(
        size,
        planPoint.x * ipbV2,
        planPoint.y * ipbV3,
      ),
      opposite: rotatedItemCorner(
        size,
        -planPoint.x * ipbV2,
        -planPoint.y * ipbV3,
      ),
    })),
    rotationStem: rotatedItemCorner(size, 0, -ipbV3),
    rotationHandle: rotatedItemCorner(
      size,
      0,
      -ipbV3 - 17 / Math.max(planView.zoom, 0.01),
    ),
  };
}
function beginItemDrag(arg0) {
  if (
    activeTool !== "select" ||
    selection?.kind !== "item" ||
    multiSelection.length
  ) {
    return null;
  }
  const item = selectedEntity();
  if (!item) {
    return null;
  }
  const controls = itemPlanBounds(item);
  const value = 9 / Math.max(planView.zoom, 0.01);
  if (distance(arg0, controls.rotationHandle) <= value) {
    return {
      type: "rotate-item",
      item: item,
      controls: controls,
    };
  }
  const corner = controls.corners.find(
    (point) => distance(arg0, point.point) <= value,
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
function axisAlignedBounds(planPoint, planPoint2) {
  return {
    minX: Math.min(planPoint.x, planPoint2.x),
    minY: Math.min(planPoint.y, planPoint2.y),
    maxX: Math.max(planPoint.x, planPoint2.x),
    maxY: Math.max(planPoint.y, planPoint2.y),
  };
}
function pointInBounds(planPoint, minX) {
  return (
    planPoint.x >= minX.minX &&
    planPoint.x <= minX.maxX &&
    planPoint.y >= minX.minY &&
    planPoint.y <= minX.maxY
  );
}
function segmentHitsBounds(planPoint, point2, minX) {
  if (
    pointInBounds(planPoint, minX) ||
    pointInBounds(point2, minX)
  ) {
    return true;
  }
  const list = [
    {
      x: minX.minX,
      y: minX.minY,
    },
    {
      x: minX.maxX,
      y: minX.minY,
    },
    {
      x: minX.maxX,
      y: minX.maxY,
    },
    {
      x: minX.minX,
      y: minX.maxY,
    },
  ];
  for (let value = 0; value < list.length; value += 1) {
    if (
      segmentIntersection(
        planPoint,
        point2,
        list[value],
        list[(value + 1) % list.length],
      )
    ) {
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
    for (const wall of floorScene.walls) {
      if (segmentHitsBounds(wall.start, wall.end, minX)) {
        list.push({
          kind: "wall",
          id: wall.id,
        });
      }
    }
    for (const size of floorScene.windows) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "window",
          id: size.id,
        });
      }
    }
    for (const size of floorScene.doors) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "door",
          id: size.id,
        });
      }
    }
    for (const size of floorScene.railings) {
      const isStart = wallAttachmentWorldPoint(size);
      if (isStart && segmentHitsBounds(isStart.start, isStart.end, minX)) {
        list.push({
          kind: "railing",
          id: size.id,
        });
      }
    }
  }
  const some = [
    {
      x: minX.minX,
      y: minX.minY,
    },
    {
      x: minX.maxX,
      y: minX.minY,
    },
    {
      x: minX.maxX,
      y: minX.maxY,
    },
    {
      x: minX.minX,
      y: minX.maxY,
    },
  ];
  for (const item of floorScene.items) {
    if (lightItemTypes.has(item.type) !== flag) {
      continue;
    }
    const rotationRad = (item.rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);
    const mshV5 = (item.width * value) / 2;
    const mshV6 = (item.depth * value) / 2;
    const some2 = [
      [-mshV5, -mshV6],
      [mshV5, -mshV6],
      [mshV5, mshV6],
      [-mshV5, mshV6],
    ].map(([arg0, arg02]) => ({
      x: item.x + arg0 * cos - arg02 * sin,
      y: item.y + arg0 * sin + arg02 * cos,
    }));
    if (
      pointInBounds(item, minX) ||
      some2.some((point3) => pointInBounds(point3, minX)) ||
      some.some((arg0) =>
        pointInRotatedRectangle(arg0, item, value),
      )
    ) {
      list.push({
        kind: "item",
        id: item.id,
      });
    }
  }
  return list;
}
function ensureMeasureCanvas() {
  if (!planCanvas.width || !planCanvas.height || !measureCtx) {
    return false;
  } else {
    if (measureCanvas.width !== planCanvas.width) {
      measureCanvas.width = planCanvas.width;
    }
    if (measureCanvas.height !== planCanvas.height) {
      measureCanvas.height = planCanvas.height;
    }
    measureCtx.setTransform(1, 0, 0, 1, 0, 0);
    measureCtx.clearRect(0, 0, measureCanvas.width, measureCanvas.height);
    measureCtx.drawImage(planCanvas, 0, 0);
    return true;
  }
}
function blitMeasureOverlay({
  offsetX: arg0 = 0,
  offsetY: arg02 = 0,
} = {}) {
  if (
    !measureCanvas.width ||
    !measureCanvas.height ||
    measureCanvas.width !== planCanvas.width ||
    measureCanvas.height !== planCanvas.height
  ) {
    return false;
  }
  const value = planCanvas.width / Math.max(planWidth, 1);
  const fitHeight = planCanvas.height / Math.max(planHeight, 1);
  planCtx.save();
  planCtx.setTransform(1, 0, 0, 1, 0, 0);
  planCtx.fillStyle = "#0d1319";
  planCtx.fillRect(0, 0, planCanvas.width, planCanvas.height);
  planCtx.drawImage(
    measureCanvas,
    Math.round(arg0 * value),
    Math.round(arg02 * fitHeight),
  );
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
  planCtx.rotate((planView.rotation * Math.PI) / 180);
  planCtx.translate(-planWidth / 2, -planHeight / 2);
  planCtx.fillStyle = "rgba(255, 157, 46, .10)";
  planCtx.strokeStyle = "rgba(255, 176, 74, .92)";
  planCtx.lineWidth = 1;
  planCtx.setLineDash([6, 4]);
  planCtx.fillRect(value, minValue, absResult, absResult2);
  planCtx.strokeRect(
    value + 0.5,
    minValue + 0.5,
    Math.max(absResult - 1, 0),
    Math.max(absResult2 - 1, 0),
  );
  planCtx.restore();
}
function drawPlan() {
  const flag = assetCategory === "light";
  planCtx.clearRect(0, 0, planWidth, planHeight);
  planCtx.fillStyle = "#0d1319";
  planCtx.fillRect(0, 0, planWidth, planHeight);
  planCtx.save();
  planCtx.translate(planWidth / 2, planHeight / 2);
  planCtx.rotate((planView.rotation * Math.PI) / 180);
  planCtx.translate(-planWidth / 2, -planHeight / 2);
  if (
    planBackgroundImage &&
    floorScene.background &&
    floorScene.settings.backgroundVisible
  ) {
    const planPoint = planToScreen({
      x: 0,
      y: 0,
    });
    planCtx.save();
    planCtx.globalAlpha = flag ? 0.3 : 0.54;
    planCtx.drawImage(
      planBackgroundImage,
      planPoint.x,
      planPoint.y,
      floorScene.background.width * planView.zoom,
      floorScene.background.height * planView.zoom,
    );
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
        cap: "square",
      });
    }
    planCtx.restore();
    if (alignSession.referencePoint) {
      const worldPoint = floorLocalToWorldPoint(
        alignSession.referencePoint,
        alignSession.referenceFloor,
        activeFloor(),
      );
      drawPlanPoint(worldPoint, "#ffb14f", 4.5);
      drawFloatingLabel(worldPoint, "参照点", "#ffb14f");
    }
  }
  planCtx.save();
  if (flag) {
    planCtx.globalAlpha = 0.48;
  }
  for (const wall of floorScene.walls) {
    const flag2 = isSelected("wall", wall.id);
    const width = Math.max(
      wall.thickness * value * planView.zoom,
      4,
    );
    if (flag2) {
      drawPlanLine(wall.start, wall.end, {
        color: "rgba(255, 157, 46, .38)",
        width: width + 7,
        cap: "square",
      });
    }
    drawPlanLine(wall.start, wall.end, {
      color: flag2 ? "#f1d7b9" : "#c7d0d7",
      width: width,
      cap: "square",
    });
    drawPlanLine(wall.start, wall.end, {
      color: "rgba(39, 51, 61, .82)",
      width: 1,
    });
    if (activeTool === "wall" || flag2) {
      drawPlanPoint(wall.start, flag2 ? "#ff9d2e" : "#6c7c88", 3.5);
      drawPlanPoint(wall.end, flag2 ? "#ff9d2e" : "#6c7c88", 3.5);
    }
    if (flag2 && multiSelection.length <= 1) {
      drawFloatingLabel(
        {
          x: (wall.start.x + wall.end.x) / 2,
          y: (wall.start.y + wall.end.y) / 2,
        },
        wallLengthMeters(wall, value).toFixed(2) + " m",
        "#ffb14f",
      );
    }
  }
  for (const size of floorScene.windows) {
    const isStart2 = wallAttachmentWorldPoint(size);
    if (!isStart2) {
      continue;
    }
    const flag2 = isSelected("window", size.id);
    drawPlanLine(isStart2.start, isStart2.end, {
      color: "rgba(7, 16, 21, .9)",
      width: Math.max(
        10,
        isStart2.wall.thickness * value * planView.zoom + 5,
      ),
      cap: "butt",
    });
    drawPlanLine(isStart2.start, isStart2.end, {
      color: flag2 ? "#ffaf46" : "#43d2e6",
      width: flag2 ? 5 : 3,
      cap: "butt",
    });
    drawPlanLine(isStart2.start, isStart2.end, {
      color: "rgba(224, 250, 255, .9)",
      width: 1,
      cap: "butt",
    });
    if (size.hasDivider !== false && size.width > 1.2) {
      const planPoint = {
        x: -isStart2.unit.y,
        y: isStart2.unit.x,
      };
      const maxValue = Math.max(
        isStart2.wall.thickness * value * planView.zoom * 0.72,
        5 / planView.zoom,
      );
      drawPlanLine(
        {
          x: isStart2.center.x - planPoint.x * maxValue,
          y: isStart2.center.y - planPoint.y * maxValue,
        },
        {
          x: isStart2.center.x + planPoint.x * maxValue,
          y: isStart2.center.y + planPoint.y * maxValue,
        },
        {
          color: flag2 ? "#ffaf46" : "rgba(224, 250, 255, .9)",
          width: 1.5,
          cap: "butt",
        },
      );
    }
    if (flag2 && multiSelection.length <= 1) {
      drawFloatingLabel(
        isStart2.center,
        size.width.toFixed(2) + " m",
        "#43d2e6",
      );
    }
  }
  for (const size of floorScene.doors) {
    drawDoorPreview(size);
  }
  for (const size of floorScene.railings) {
    drawWindowPreview(size);
  }
  for (const size of floorScene.items) {
    if (!lightItemTypes.has(size.type)) {
      drawItemOnPlan(size);
    }
  }
  if (!alignSession) {
    const list = getUnclosedWallEndpoints(value);
    for (const entry of list) {
      drawOpenEndpointWarning(entry);
      if (list.length <= 3) {
        drawFloatingLabel(entry, "未闭合", "#ff766e");
      }
    }
  }
  planCtx.restore();
  if (flag) {
    for (const size of floorScene.items) {
      if (lightItemTypes.has(size.type)) {
        drawItemOnPlan(size);
      }
    }
  }
  const reference = floorScene.calibration?.reference;
  if (reference && activeTool === "scale") {
    drawPlanLine(reference.start, reference.end, {
      color: "rgba(255, 157, 46, .72)",
      width: 2,
      dash: [7, 5],
    });
    drawPlanPoint(reference.start, "#ff9d2e", 3.5);
    drawPlanPoint(reference.end, "#ff9d2e", 3.5);
    drawFloatingLabel(
      {
        x: (reference.start.x + reference.end.x) / 2,
        y: (reference.start.y + reference.end.y) / 2,
      },
      reference.meters.toFixed(2) + " m 参考",
      "#ffad45",
    );
  }
  if (scaleToolStart && planPointerPoint) {
    drawPlanLine(scaleToolStart, planPointerPoint, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5],
    });
    drawPlanPoint(scaleToolStart, "#ff9d2e");
    drawPlanPoint(planPointerPoint, "#ff9d2e");
  }
  if (wallDrawAnchor && snapHint) {
    const flag2 = isWallCloseSnap(snapHint);
    drawPlanLine(wallDrawAnchor, snapHint.point, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5],
    });
    drawPlanPoint(wallDrawAnchor, "#ff9d2e");
    drawPlanPoint(
      snapHint.point,
      flag2 ? "#76cfa1" : snapHint.kind ? "#43d2e6" : "#ff9d2e",
      flag2 ? 5 : 3.5,
    );
    const toFixed = distance(wallDrawAnchor, snapHint.point) / value;
    drawFloatingLabel(
      {
        x: (wallDrawAnchor.x + snapHint.point.x) / 2,
        y: (wallDrawAnchor.y + snapHint.point.y) / 2,
      },
      toFixed.toFixed(2) + " m",
      "#ffb04a",
    );
    if (flag2) {
      drawFloatingLabel(snapHint.point, "点击闭合空间", "#76cfa1");
    }
  } else if (snapHint?.kind && ["wall", "scale"].includes(activeTool)) {
    drawPlanPoint(snapHint.point, "#43d2e6");
    drawFloatingLabel(snapHint.point, snapHint.label, "#43d2e6");
  }
  if (activeTool === "window" && windowPlacementPreview) {
    const size = {
      wallId: windowPlacementPreview.wall.id,
      t: windowPlacementPreview.t,
      width: 1.4,
    };
    const isStart2 = wallAttachmentWorldPoint(size);
    if (isStart2) {
      drawPlanLine(isStart2.start, isStart2.end, {
        color: "rgba(67, 210, 230, .75)",
        width: 5,
        dash: [5, 4],
        cap: "butt",
      });
    }
  }
  if (activeTool === "door" && doorPlacementPreview) {
    const size =
      doorSizePresets[DEFAULT_DOOR_TYPE] || doorSizePresets.solid;
    drawDoorPreview(
      {
        wallId: doorPlacementPreview.wall.id,
        t: doorPlacementPreview.t,
        width: size.width,
        height: size.height,
        doorType: DEFAULT_DOOR_TYPE,
        hinge: "left",
        swing: 1,
      },
      {
        preview: true,
      },
    );
  }
  if (activeTool === "railing" && railingPlacementPreview) {
    drawWindowPreview(
      {
        wallId: railingPlacementPreview.wall.id,
        t: railingPlacementPreview.t,
        width: 2,
        height: 1.1,
      },
      {
        preview: true,
      },
    );
  }
  planCtx.restore();
  drawMarqueeSelection();
  zoomValue.textContent = Math.round(planView.zoom * 100) + "%";
}
function selectedEntity() {
  if (!selection) {
    return null;
  }
  const flag = (
    {
      wall: floorScene.walls,
      window: floorScene.windows,
      door: floorScene.doors,
      railing: floorScene.railings,
      item: floorScene.items,
    }[selection.kind] || []
  ).find((item) => item.id === selection.id);
  if (!flag) {
    selection = null;
  }
  return flag || null;
}
function placeCatalogItemAt(arg0) {
  const value = pixelsPerMeter() || 100;
  const flag = assetCategory === "light";
  for (const item of [...floorScene.items].reverse()) {
    if (
      lightItemTypes.has(item.type) === flag &&
      pointInRotatedRectangle(arg0, item, value)
    ) {
      return {
        kind: "item",
        id: item.id,
      };
    }
  }
  if (flag) {
    return null;
  }
  for (const size of [...floorScene.windows].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (
      isStart &&
      projectPointToSegment(arg0, isStart.start, isStart.end).distance <=
        10 / planView.zoom
    ) {
      return {
        kind: "window",
        id: size.id,
      };
    }
  }
  for (const size of [...floorScene.doors].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (
      isStart &&
      projectPointToSegment(arg0, isStart.start, isStart.end).distance <=
        12 / planView.zoom
    ) {
      return {
        kind: "door",
        id: size.id,
      };
    }
  }
  for (const size of [...floorScene.railings].reverse()) {
    const isStart = wallAttachmentWorldPoint(size);
    if (
      isStart &&
      projectPointToSegment(arg0, isStart.start, isStart.end).distance <=
        12 / planView.zoom
    ) {
      return {
        kind: "railing",
        id: size.id,
      };
    }
  }
  for (const wall of [...floorScene.walls].reverse()) {
    const maxValue = Math.max(
      (wall.thickness * value) / 2,
      8 / planView.zoom,
    );
    if (
      projectPointToSegment(
        arg0,
        wall.start,
        wall.end,
      ).distance <= maxValue
    ) {
      return {
        kind: "wall",
        id: wall.id,
      };
    }
  }
  return null;
}
function updateProgressChecklist() {
  const value = {
    background: !!floorScene.background,
    scale: !!floorScene.calibration,
    walls: floorScene.walls.length > 0,
    items: floorScene.items.some(
      (item) => !lightItemTypes.has(item.type),
    ),
    lights: floorScene.items.some((item) =>
      lightItemTypes.has(item.type),
    ),
    export: isExporting,
  };
  const layerKeys =
    ["background", "scale", "walls", "items", "lights", "export"].find(
      (arg0) => !value[arg0],
    ) || "export";
  for (const element of document.querySelectorAll("[data-step]")) {
    element.classList.toggle(
      "complete",
      value[element.dataset.step],
    );
    element.classList.toggle(
      "active",
      element.dataset.step === layerKeys,
    );
  }
}
function studioLayoutMetrics() {
  const size = detailsPanelEl.getBoundingClientRect();
  const size2 = studioShellEl.getBoundingClientRect();
  const value = size.height || Math.max(window.innerHeight - 90, 340);
  const maxValue = size2.width || Math.max(window.innerWidth - 20, 860);
  const slmV3 =
    detailsResizer.parentElement?.getBoundingClientRect().height || 14;
  const querySelectorResult =
    studioShellEl.querySelector(".library-panel")?.getBoundingClientRect()
      .width || 168;
  return {
    minimumHeightRatio: clamp(320 / value, 0.08, 0.5),
    maximumHeightRatio: clamp(
      (value - slmV3 - 170) / value,
      0.5,
      0.94,
    ),
    minimumWidthRatio: clamp(360 / maxValue, 0.08, 0.45),
    maximumWidthRatio: clamp(
      (maxValue - querySelectorResult - 20 - 320) / maxValue,
      0.45,
      0.86,
    ),
  };
}
function applyPreviewPaneWidth() {
  const value = studioLayoutMetrics();
  const clamp2 = clamp(
    finite(floorScene.settings?.previewPanelRatio, 0.52),
    value.minimumHeightRatio,
    value.maximumHeightRatio,
  );
  floorScene.settings.previewPanelRatio = clamp2;
  detailsPanelEl.style.setProperty(
    "--preview-panel-height",
    (clamp2 * 100).toFixed(2) + "%",
  );
  detailsResizer.setAttribute(
    "aria-valuemin",
    String(Math.round(value.minimumHeightRatio * 100)),
  );
  detailsResizer.setAttribute(
    "aria-valuemax",
    String(Math.round(value.maximumHeightRatio * 100)),
  );
  detailsResizer.setAttribute(
    "aria-valuenow",
    String(Math.round(clamp2 * 100)),
  );
}
function applyDetailsPaneWidth() {
  const value = studioLayoutMetrics();
  const clamp2 = clamp(
    finite(floorScene.settings?.detailsPanelWidthRatio, 0.29),
    value.minimumWidthRatio,
    value.maximumWidthRatio,
  );
  floorScene.settings.detailsPanelWidthRatio = clamp2;
  studioShellEl.style.setProperty(
    "--details-panel-width",
    (clamp2 * 100).toFixed(2) + "%",
  );
}
function isSnapActive() {
  return floorScene.settings.snapEnabled !== false && !snapTemporarilyDisabled;
}
function setSnapSettingsOpen(flag) {
  snapSettingsPanel.hidden = !flag;
  snapSettingsToggle.setAttribute("aria-expanded", String(flag));
}
function syncSnapUi() {
  const flag = floorScene.settings.snapEnabled !== false;
  snapToggle.classList.toggle("active", flag);
  snapToggle.setAttribute("aria-pressed", String(flag));
  snapToggleState.textContent = flag ? "开" : "关";
  for (const el of snapSettingEls) {
    el.checked =
      floorScene.settings[el.dataset.snapSetting] !== false;
  }
  syncControlValue(
    snapTolerance,
    clamp(Math.round(finite(floorScene.settings.snapTolerance, 13)), 6, 24),
  );
  snapToleranceValue.textContent = snapTolerance.value + " px";
  if (!rawPlanPointer) {
    snapIndicator.textContent = flag ? "吸附：开启" : "吸附：关闭";
  }
}
function onDetailsResizePointerMove(event) {
  if (!detailsResizeDrag) {
    return;
  }
  const size = detailsPanelEl.getBoundingClientRect();
  const size2 = studioShellEl.getBoundingClientRect();
  if (size.height <= 0 || size2.width <= 0) {
    return;
  }
  const value = studioLayoutMetrics();
  const odrpV2 = event.clientX - detailsResizeDrag.startX;
  const odrpV3 = event.clientY - detailsResizeDrag.startY;
  if (Math.hypot(odrpV2, odrpV3) < 2) {
    return;
  }
  detailsResizer.dataset.resizeAxis = "both";
  const odrpV4 = odrpV3 / size.height;
  const odrpV5 = odrpV2 / size2.width;
  floorScene.settings.previewPanelRatio = clamp(
    detailsResizeDrag.startPreviewRatio + odrpV4,
    value.minimumHeightRatio,
    value.maximumHeightRatio,
  );
  floorScene.settings.detailsPanelWidthRatio = clamp(
    detailsResizeDrag.startWidthRatio - odrpV5,
    value.minimumWidthRatio,
    value.maximumWidthRatio,
  );
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
}
function refreshStudioPanels() {
  syncSnapUi();
  renderFloorList();
  toggleBackground.disabled = !floorScene.background;
  toggleBackground.textContent = floorScene.settings.backgroundVisible
    ? "隐藏"
    : "显示";
  removePlan.disabled = !floorScene.background;
  syncControlValue(globalWallHeight, floorScene.settings.wallHeight.toFixed(2));
  syncControlValue(
    globalWallThickness,
    floorScene.settings.wallThickness.toFixed(2),
  );
  syncControlValue(
    globalWallOpacity,
    Math.round(floorScene.settings.wallOpacity * 100),
  );
  toggleFloorEdge.textContent =
    floorScene.settings.floorEdgeVisible === false ? "隐藏" : "显示";
  toggleFloorEdge.setAttribute(
    "aria-pressed",
    String(floorScene.settings.floorEdgeVisible !== false),
  );
  canvasEmpty.hidden =
    !!floorScene.background ||
    !!floorScene.walls.length ||
    !!floorScene.items.length;
  sceneCounts.textContent =
    floorScene.walls.length +
    " 墙 · " +
    floorScene.windows.length +
    " 窗 · " +
    floorScene.doors.length +
    " 门 · " +
    floorScene.railings.length +
    " 栏杆 · " +
    floorScene.items.length +
    " 物件";
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
  deleteSelection.disabled = !lightGroup && !flag;
  if (flag) {
    inspectorEmpty.hidden = false;
    selectionInspector.hidden = true;
    inspectorEmpty.querySelector("strong").textContent =
      "已框选 " + flag + " 个对象";
    inspectorEmpty.querySelector("p").textContent =
      "可以直接批量删除；单击一个对象可继续精确编辑属性。";
    return;
  }
  inspectorEmpty.querySelector("strong").textContent = "选择画布中的对象";
  inspectorEmpty.querySelector("p").textContent =
    "选中墙体、窗户、门或家具后，可在这里精确调整。";
  if (!!lightGroup && !!selection) {
    lightPreviewNote.hidden = true;
    selectionHeadingEl.classList.remove("light-selected");
    wallFields.hidden = selection.kind !== "wall";
    windowFields.hidden = selection.kind !== "window";
    doorFields.hidden = selection.kind !== "door";
    railingFields.hidden = selection.kind !== "railing";
    itemFields.hidden = selection.kind !== "item";
    selectionId.hidden = selection.kind === "item";
    selectionId.textContent = selectionId.hidden ? "" : lightGroup.id;
    if (selection.kind === "wall") {
      selectEl("#selection-title").textContent = "墙体";
      syncControlValue(
        selectEl("#wall-length"),
        wallLengthMeters(lightGroup, pixelsPerMeter() || 1).toFixed(2) + " m",
      );
      syncControlValue(selectEl("#wall-height"), lightGroup.height.toFixed(2));
      syncControlValue(
        selectEl("#wall-thickness"),
        lightGroup.thickness.toFixed(2),
      );
      const flag2 =
        lightGroup.opacity === null || lightGroup.opacity === undefined
          ? null
          : clamp(
              finite(lightGroup.opacity, floorScene.settings.wallOpacity),
              0,
              1,
            );
      selectEl("#wall-opacity-mode").value =
        flag2 === null ? "global" : "custom";
      syncControlValue(
        selectEl("#wall-opacity"),
        Math.round((flag2 ?? floorScene.settings.wallOpacity) * 100),
      );
      selectEl("#wall-opacity").disabled = flag2 === null;
      syncStudioSelect(selectEl("#wall-opacity-mode"));
      selectEl("#wall-open-end-mode").value =
        lightGroup.allowOpenEnd === true ? "allowed" : "auto";
      syncStudioSelect(selectEl("#wall-open-end-mode"));
    } else if (selection.kind === "window") {
      selectEl("#selection-title").textContent = "窗户";
      syncControlValue(selectEl("#window-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#window-height"), lightGroup.height.toFixed(2));
      syncControlValue(selectEl("#window-sill"), lightGroup.sill.toFixed(2));
      selectEl("#window-divider").value =
        lightGroup.hasDivider === false ? "without" : "with";
      syncStudioSelect(selectEl("#window-divider"));
      syncControlValue(
        selectEl("#window-position"),
        Math.round(lightGroup.t * 100) + "%",
      );
    } else if (selection.kind === "door") {
      selectEl("#selection-title").textContent =
        {
          solid: "普通平开门",
          double: "双开门",
          entry: "入户门（常闭）",
          glass: "玻璃平开门",
          "sliding-glass": "玻璃推拉门",
          "roller-shutter": "卷帘门",
          "frame-only": "仅门框",
        }[lightGroup.doorType] || "普通平开门";
      selectEl("#door-type").value = lightGroup.doorType || "solid";
      syncStudioSelect(selectEl("#door-type"));
      syncControlValue(selectEl("#door-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#door-height"), lightGroup.height.toFixed(2));
      syncControlValue(
        selectEl("#door-position"),
        Math.round(lightGroup.t * 100) + "%",
      );
      selectEl(".door-actions").hidden = [
        "entry",
        "sliding-glass",
        "frame-only",
      ].includes(lightGroup.doorType);
      selectEl("#door-hinge").hidden = ["double", "roller-shutter"].includes(
        lightGroup.doorType,
      );
      selectEl("#door-swing").hidden = false;
    } else if (selection.kind === "railing") {
      selectEl("#selection-title").textContent = "玻璃栏杆";
      syncControlValue(selectEl("#railing-width"), lightGroup.width.toFixed(2));
      syncControlValue(selectEl("#railing-height"), lightGroup.height.toFixed(2));
      syncControlValue(
        selectEl("#railing-position"),
        Math.round(lightGroup.t * 100) + "%",
      );
    } else {
      const named = furnitureCatalog[lightGroup.type];
      const flag2 = lightGroup.type === "planlabel";
      const flag3 = lightItemTypes.has(lightGroup.type);
      selectEl("#selection-title").textContent = named?.name || "物件";
      lightPreviewNote.hidden = !flag3;
      selectionHeadingEl.classList.toggle("light-selected", flag3);
      labelTextFields.hidden = !flag2;
      lightFields.hidden = !flag3;
      curtainPositionField.hidden = lightGroup.type !== "curtain";
      itemHeightField.hidden = flag2 || flag3;
      itemElevationField.hidden = flag2;
      itemRotationField.hidden = lightGroup.type === "ceilinglight";
      itemRotationActions.hidden = lightGroup.type === "ceilinglight";
      itemVerticalRotationField.hidden = !flag3;
      itemStripRollField.hidden = lightGroup.type !== "striplight";
      itemStripOrientationHeading.hidden = lightGroup.type !== "striplight";
      itemLightSourceVisibilityField.hidden = lightGroup.type !== "striplight";
      roundTableTurntableField.hidden = !roundTableTypes.has(lightGroup.type);
      stairDirectionField.hidden = !stairItemTypes.has(lightGroup.type);
      tvMountStyleField.hidden = lightGroup.type !== "tv";
      shoeCabinetActions.hidden = lightGroup.type !== "shoecabinet";
      shoeCabinetMirror.setAttribute(
        "aria-pressed",
        lightGroup.shoeCabinetMirrored === true ? "true" : "false",
      );
      selectEl("#item-rotation-label").textContent =
        lightGroup.type === "striplight"
          ? "平面旋转（°）"
          : flag3
            ? "平面方向（°）"
            : "旋转角度（°）";
      selectEl("#item-rotation").min =
        lightGroup.type === "striplight" ? "0" : "-360";
      selectEl("#item-rotation").max = "360";
      itemVerticalRotationLabel.textContent =
        lightGroup.type === "striplight" ? "安装倾斜（°）" : "出光角度（°）";
      selectEl("#item-vertical-rotation").min =
        lightGroup.type === "striplight" ? "0" : "-90";
      selectEl("#item-vertical-rotation").max =
        lightGroup.type === "striplight" ? "360" : "90";
      for (const hidden of applyLightPropertyEls) {
        hidden.hidden = !flag3;
      }
      itemWidthLabel.textContent =
        lightGroup.type === "striplight"
          ? "发光长度（m）"
          : lightGroup.type === "pillar"
            ? "长（m）"
            : "宽（m）";
      itemDepthLabel.textContent =
        lightGroup.type === "striplight"
          ? "发光宽度（m）"
          : flag2
            ? "铭牌高（m）"
            : lightGroup.type === "pillar"
              ? "宽（m）"
              : "深（m）";
      if (flag2) {
        syncControlValue(selectEl("#label-title"), lightGroup.title || "家庭总览");
        syncControlValue(
          selectEl("#label-title-spacing"),
          Math.round(clamp(finite(lightGroup.titleSpacing, 1.05), 0, 1.8) * 100),
        );
        syncControlValue(
          selectEl("#label-subtitle"),
          lightGroup.subtitle || "HOME PLAN",
        );
        syncControlValue(
          selectEl("#label-subtitle-spacing"),
          Math.round(clamp(finite(lightGroup.subtitleSpacing, 0.08), 0, 0.6) * 100),
        );
        syncControlValue(
          selectEl("#label-line-length"),
          Math.round(clamp(finite(lightGroup.lineLength, 0.86), 0.3, 1) * 100),
        );
      }
      if (flag3) {
        const temperature =
          defaultLightPresets[lightGroup.type] || defaultLightPresets.downlight;
        activeLightGroupId =
          resolveLightGroup(lightGroup)?.id || ensureDefaultLightGroup().id;
        renderLightLayerPanel();
        syncLightGroupSelect(lightGroup);
        syncControlValue(
          selectEl("#light-temperature"),
          Math.round(
            clamp(
              finite(lightGroup.lightTemperature, temperature.temperature),
              2200,
              6500,
            ),
          ),
        );
        syncControlValue(
          selectEl("#light-brightness"),
          Math.round(
            clamp(
              finite(lightGroup.lightBrightness, temperature.brightness),
              0,
              100,
            ),
          ),
        );
        syncControlValue(
          selectEl("#light-range"),
          clamp(
            finite(lightGroup.lightRange, temperature.range),
            0.5,
            10,
          ).toFixed(1),
        );
        selectEl("#light-angle").max = String(defaultItemDepth(lightGroup.type));
        syncControlValue(
          selectEl("#light-angle"),
          Math.round(
            clamp(
              finite(lightGroup.lightAngle, temperature.angle),
              15,
              defaultItemDepth(lightGroup.type),
            ),
          ),
        );
        const value =
          lightGroup.type === "striplight"
            ? normalizeFullRotation(lightGroup.verticalRotation)
            : clamp(finite(lightGroup.verticalRotation, 0), -90, 90);
        syncControlValue(
          selectEl("#item-vertical-rotation"),
          Math.round(value * 100) / 100,
        );
        syncControlValue(
          itemStripRoll,
          Math.round(clamp(finite(lightGroup.stripRollRotation, 0), 0, 360) * 100) /
            100,
        );
        itemLightSourceVisible.checked = lightGroup.lightSourceVisible !== false;
      }
      if (lightGroup.type === "curtain") {
        selectEl("#curtain-position").value = [
          "left",
          "right",
          "split",
        ].includes(lightGroup.curtainPosition)
          ? lightGroup.curtainPosition
          : "split";
        syncStudioSelect(selectEl("#curtain-position"));
      }
      if (roundTableTypes.has(lightGroup.type)) {
        selectEl("#round-table-turntable").value = hasRoundTableTurntable(
          lightGroup,
        )
          ? "with"
          : "without";
        syncStudioSelect(selectEl("#round-table-turntable"));
      }
      if (stairItemTypes.has(lightGroup.type)) {
        selectEl("#stair-direction").value = ["left", "right"].includes(
          lightGroup.stairDirection,
        )
          ? lightGroup.stairDirection
          : "right";
        syncStudioSelect(selectEl("#stair-direction"));
      }
      if (lightGroup.type === "tv") {
        selectEl("#tv-mount-style").value = tvMountStyles.has(
          lightGroup.tvMountStyle,
        )
          ? lightGroup.tvMountStyle
          : "standard";
        syncStudioSelect(selectEl("#tv-mount-style"));
      }
      syncControlValue(
        selectEl("#item-x"),
        (lightGroup.x / (pixelsPerMeter() || 1)).toFixed(2),
      );
      syncControlValue(
        selectEl("#item-y"),
        (lightGroup.y / (pixelsPerMeter() || 1)).toFixed(2),
      );
      syncControlValue(selectEl("#item-width"), lightGroup.width.toFixed(2));
      selectEl("#item-height").min = String(itemMinimumHeight(lightGroup.type));
      selectEl("#item-height").step = lightGroup.type === "rug" ? "0.002" : "0.05";
      syncControlValue(
        selectEl("#item-height"),
        lightGroup.type === "rug"
          ? lightGroup.height.toFixed(3)
          : lightGroup.height.toFixed(2),
      );
      syncControlValue(selectEl("#item-depth"), lightGroup.depth.toFixed(2));
      syncControlValue(
        selectEl("#item-elevation"),
        (lightGroup.elevation || 0).toFixed(2),
      );
      syncControlValue(
        selectEl("#item-rotation"),
        Math.round(lightGroup.rotation * 100) / 100,
      );
    }
  }
}
function refreshViews(scope = "all") {
  refreshStudioPanels();
  updateSelectionInspector();
  drawPlan();
  if (scope !== "none") {
    rebuildPreviewMeshes({
      scope: scope,
    });
  }
}
function setActiveTool(arg0) {
  if (!toolHelpText[arg0]) {
    return;
  }
  if (assetCategory === "light" && arg0 !== "select") {
    showToast("灯光编辑中户型已锁定，请先切回家居或电器。");
    return;
  }
  const flag =
    activeTool === "wall" && arg0 !== "wall" && wallDrawPointCount > 0;
  activeTool = arg0;
  planCanvas.dataset.tool = arg0;
  planCanvas.style.cursor = "";
  for (const element of toolEls) {
    element.classList.toggle(
      "active",
      element.dataset.tool === arg0,
    );
  }
  [activeToolLabel.textContent, toolHelp.textContent] =
    assetCategory === "light"
      ? [
          "灯光编辑",
          "户型已锁定；框选多盏灯后可整体拖动，Shift 锁轴，Option/Alt 复制",
        ]
      : toolHelpText[arg0];
  finishWall.hidden = arg0 !== "wall" || !wallDrawAnchor;
  if (arg0 !== "wall") {
    resetWallDrawing();
  }
  if (arg0 !== "scale") {
    scaleToolStart = null;
  }
  snapHint = null;
  windowPlacementPreview = null;
  doorPlacementPreview = null;
  railingPlacementPreview = null;
  drawPlan();
  if (flag) {
    showToast(
      "当前墙线未闭合，不会生成地面；如果绘制的是隔墙，可以忽略此提醒。",
      "warning",
    );
  }
}
function requireCalibration(arg0 = "scale") {
  if (pixelsPerMeter()) {
    return true;
  } else {
    showToast("请先画一条参考线并填写真实长度。", "error");
    setActiveTool(arg0);
    return false;
  }
}
function deleteCurrentSelection() {
  if (multiSelection.length) {
    const scope2 = activeSelectionAssetCategory();
    pushHistory();
    const value = new Set(
      multiSelection
        .filter((kind) => kind.kind === "wall")
        .map((item) => item.id),
    );
    const idSet = new Set(
      multiSelection
        .filter((kind) => kind.kind === "window")
        .map((item) => item.id),
    );
    const wallIdSet = new Set(
      multiSelection
        .filter((kind) => kind.kind === "door")
        .map((item) => item.id),
    );
    const wallIdSet2 = new Set(
      multiSelection
        .filter((kind) => kind.kind === "railing")
        .map((item) => item.id),
    );
    const wallIdSet3 = new Set(
      multiSelection
        .filter((kind) => kind.kind === "item")
        .map((item) => item.id),
    );
    floorScene.walls = floorScene.walls.filter(
      (id) => !value.has(id.id),
    );
    floorScene.windows = floorScene.windows.filter(
      (id) =>
        !idSet.has(id.id) && !value.has(id.wallId),
    );
    floorScene.doors = floorScene.doors.filter(
      (id) =>
        !wallIdSet.has(id.id) && !value.has(id.wallId),
    );
    floorScene.railings = floorScene.railings.filter(
      (id) =>
        !wallIdSet2.has(id.id) && !value.has(id.wallId),
    );
    floorScene.items = floorScene.items.filter(
      (id) => !wallIdSet3.has(id.id),
    );
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
    floorScene.walls = floorScene.walls.filter(
      (item) => item.id !== floor.id,
    );
    floorScene.windows = floorScene.windows.filter(
      (wall) => wall.wallId !== floor.id,
    );
    floorScene.doors = floorScene.doors.filter(
      (wall) => wall.wallId !== floor.id,
    );
    floorScene.railings = floorScene.railings.filter(
      (wall) => wall.wallId !== floor.id,
    );
    wallIdMap();
  } else if (selection.kind === "window") {
    floorScene.windows = floorScene.windows.filter(
      (item) => item.id !== floor.id,
    );
  } else if (selection.kind === "door") {
    floorScene.doors = floorScene.doors.filter(
      (item) => item.id !== floor.id,
    );
  } else if (selection.kind === "railing") {
    floorScene.railings = floorScene.railings.filter(
      (item) => item.id !== floor.id,
    );
  } else {
    floorScene.items = floorScene.items.filter(
      (item) => item.id !== floor.id,
    );
  }
  clearSelection();
  refreshViews(scope);
  scheduleSave();
}
function addFurnitureAtPoint(type, planPoint) {
  const size = furnitureCatalog[type];
  if (!size || !requireCalibration()) {
    return;
  }
  const temperature =
    defaultLightPresets[type] || defaultLightPresets.downlight;
  const id = lightItemTypes.has(type)
    ? ensureDefaultLightGroup()
    : null;
  pushHistory();
  const item = {
    id: makeId("item"),
    type: type,
    x: planPoint.x,
    y: planPoint.y,
    rotation: 0,
    width: size.width,
    depth: size.depth,
    height: size.height,
    elevation: size.elevation || 0,
    color: size.color,
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
          screenLayerName: "电视画面 " + (tvItemsOnFloor().length + 1),
          tvMountStyle: "standard",
        }
      : {}),
    ...(type === "smallcar"
      ? {
          chargingEnabled: false,
          chargingLayerName: "汽车充电 " + (smallCarItemsOnFloor().length + 1),
        }
      : {}),
    ...(type === "curtain"
      ? {
          curtainPosition: "split",
        }
      : {}),
    ...(stairItemTypes.has(type)
      ? {
          stairDirection: "right",
        }
      : {}),
    ...(type === "shoecabinet"
      ? {
          shoeCabinetMirrored: false,
        }
      : {}),
    ...(roundTableTypes.has(type)
      ? {
          roundTableTurntable: false,
        }
      : {}),
    ...(lightItemTypes.has(type)
      ? {
          lightGroupId: id.id,
          verticalRotation: 0,
          ...(type === "striplight"
            ? {
                stripRollRotation: 0,
                lightSourceVisible: true,
              }
            : {}),
          lightTemperature: temperature.temperature,
          lightBrightness: temperature.brightness,
          lightRange: temperature.range,
          lightAngle: temperature.angle,
        }
      : {}),
  };
  ensureItemLayerNames([item]);
  floorScene.items.push(item);
  setSelection("item", item.id);
  setActiveTool("select");
  refreshViews(itemPreviewScope(item));
  scheduleSave();
}
function selectedItemIds() {
  const value = new Set([
    ...(selection?.kind === "item" ? [selection.id] : []),
    ...multiSelection
      .filter((kind) => kind.kind === "item")
      .map((item) => item.id),
  ]);
  const flag = assetCategory === "light";
  const list = floorScene.items.filter(
    (id) =>
      value.has(id.id) &&
      lightItemTypes.has(id.type) === flag,
  );
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  pushHistory();
  const siiV2 = (pixelsPerMeter() || 100) * 0.12;
  const list2 = list.map((planPoint) => ({
    ...structuredClone(planPoint),
    id: makeId("item"),
    x: planPoint.x + siiV2,
    y: planPoint.y + siiV2,
  }));
  ensureItemLayerNames(list2);
  floorScene.items.push(...list2);
  if (list2.length === 1) {
    setSelection("item", list2[0].id);
  } else {
    selection = null;
    multiSelection = list2.map((id) => ({
      kind: "item",
      id: id.id,
    }));
  }
  refreshViews(flag ? "lights" : "items");
  scheduleSave();
  showToast("已复制 " + list2.length + " 个物件。");
}
function cloneSelectedItems() {
  const value = new Set([
    ...(selection?.kind === "item" ? [selection.id] : []),
    ...multiSelection
      .filter((kind) => kind.kind === "item")
      .map((item) => item.id),
  ]);
  const csiV2 = assetCategory === "light";
  return floorScene.items.filter(
    (id) =>
      value.has(id.id) &&
      lightItemTypes.has(id.type) === csiV2,
  );
}
function copySelectedItems() {
  const list = cloneSelectedItems();
  if (!list.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  clipboardItems = list.map((arg0) => structuredClone(arg0));
  clipboardPasteCount = 0;
  showToast("已复制 " + clipboardItems.length + " 个物件，按 ⌘/Ctrl+V 粘贴。");
}
function pasteClipboardItems() {
  if (!clipboardItems.length) {
    showToast("暂无可粘贴的物件。");
    return;
  }
  const flag = clipboardItems.every((item) =>
    lightItemTypes.has(item.type),
  );
  if (flag && assetCategory !== "light") {
    setAssetCategory("light");
  } else if (!flag && assetCategory === "light") {
    setAssetCategory("home");
  }
  pushHistory();
  clipboardPasteCount += 1;
  const value = (pixelsPerMeter() || 100) * 0.12 * clipboardPasteCount;
  const list = clipboardItems.map((planPoint) => ({
    ...structuredClone(planPoint),
    id: makeId("item"),
    x: planPoint.x + value,
    y: planPoint.y + value,
    ...(lightItemTypes.has(planPoint.type) &&
    !floorScene.lightGroups.some(
      (item) => item.id === planPoint.lightGroupId,
    )
      ? {
          lightGroupId: ensureDefaultLightGroup().id,
        }
      : {}),
  }));
  ensureItemLayerNames(list);
  floorScene.items.push(...list);
  if (list.length === 1) {
    setSelection("item", list[0].id);
  } else {
    selection = null;
    multiSelection = list.map((id) => ({
      kind: "item",
      id: id.id,
    }));
  }
  refreshViews(flag ? "lights" : "items");
  scheduleSave();
  showToast("已粘贴 " + list.length + " 个物件。");
}
async function reloadPlanBackground() {
  const value = ++planBackgroundRevision;
  planBackgroundImage = null;
  if (!floorScene.background?.url) {
    return;
  }
  const bgUrl = floorScene.background.url;
  await new Promise((arg0) => {
    let flag = false;
    const onComplete = () => {
      if (!flag) {
        flag = true;
        arg0();
      }
    };
    const el = new Image();
    const setTimeoutResult = window.setTimeout(onComplete, 2000);
    el.addEventListener(
      "load",
      () => {
        if (
          value !== planBackgroundRevision ||
          floorScene.background?.url !== bgUrl
        ) {
          onComplete();
          return;
        }
        planBackgroundImage = el;
        window.clearTimeout(setTimeoutResult);
        if (flag) {
          drawPlan();
        } else {
          onComplete();
        }
      },
      {
        once: true,
      },
    );
    el.addEventListener(
      "error",
      () => {
        window.clearTimeout(setTimeoutResult);
        if (value === planBackgroundRevision) {
          showToast("底图加载失败，请重新导入。", "error");
        }
        onComplete();
      },
      {
        once: true,
      },
    );
    el.src = bgUrl;
  });
}
async function importPlanBackgroundFile(body) {
  if (body) {
    if (!/\.(png|jpe?g|webp|svg)$/i.test(body.name)) {
      showToast("仅支持 PNG、JPG、JPEG、WebP 和 SVG 图片。", "error");
      return;
    }
    importPlan.disabled = true;
    importPlan.textContent = "上传中…";
    try {
      const size = await studioFetch("/assets/user", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": body.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(body.name),
        },
      });
      pushHistory();
      floorScene.background = {
        assetId: size.assetId,
        url: size.url,
        name: size.name,
        width: size.width,
        height: size.height,
      };
      const floor = activeFloor();
      if (floor && !floor.originInitialized) {
        floor.originX = size.width / 2;
        floor.originY = size.height / 2;
        floor.originInitialized = true;
      }
      floorScene.settings.backgroundVisible = true;
      await reloadPlanBackground();
      fitPlanViewToContent();
      refreshViews();
      scheduleSave();
      setActiveTool("scale");
      showToast("底图已导入，请在图上画一条已知长度的参考线。");
    } catch (error) {
      showToast(error.message || "底图上传失败。", "error");
    } finally {
      importPlan.disabled = false;
      importPlan.textContent = "导入";
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
  light.position.set(
    Math.cos(azimuthRad) * horizontal,
    Math.sin(elevationRad) * distanceMeters,
    Math.sin(azimuthRad) * horizontal,
  );
}
function applyPreviewEnvironment() {
  const value = resolvedThemeColors();
  const exposure = baseLighting;
  if (!!previewScene && !!renderer) {
    previewScene.background = null;
    renderer.setClearColor(value.background, 0);
    previewScene.fog = null;
    renderer.toneMappingExposure = exposure.exposure;
    if (hemisphereLight) {
      hemisphereLight.color.setHex(14278376);
      hemisphereLight.groundColor.setHex(1909296);
      hemisphereLight.intensity = exposure.hemisphereIntensity;
    }
    if (ambientLight) {
      ambientLight.color.setHex(9673384);
      ambientLight.intensity = exposure.ambientIntensity;
    }
    if (previewSpotLight) {
      previewSpotLight.color.setHex(15922426);
      previewSpotLight.intensity = exposure.mainIntensity;
      positionDirectionalLight(
        previewSpotLight,
        exposure.mainAzimuth,
        exposure.mainElevation,
        18.4,
      );
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
      fillLight.intensity = exposure.fillIntensity;
      positionDirectionalLight(
        fillLight,
        exposure.fillAzimuth,
        exposure.fillElevation,
        15.2,
      );
    }
    if (topLight) {
      topLight.color.setHex(16185338);
      topLight.intensity = exposure.topIntensity;
      positionDirectionalLight(
        topLight,
        exposure.topAzimuth,
        exposure.topElevation,
        16.1,
      );
    }
  }
}
function setShadowCameraExpanded(arg0) {
  const flag = arg0 === true;
  if (flag !== shadowCameraExpanded) {
    if (flag && previewSpotLight?.shadow?.camera) {
      const camera2 = previewSpotLight.shadow.camera;
      savedSpotShadowCamera = {
        left: camera2.left,
        right: camera2.right,
        top: camera2.top,
        bottom: camera2.bottom,
        near: camera2.near,
        far: camera2.far,
      };
    }
    shadowCameraExpanded = flag;
    applyPreviewEnvironment();
    if (
      !flag &&
      savedSpotShadowCamera &&
      previewSpotLight?.shadow?.camera
    ) {
      const camera2 = previewSpotLight.shadow.camera;
      Object.assign(camera2, savedSpotShadowCamera);
      camera2.updateProjectionMatrix();
      savedSpotShadowCamera = null;
    }
    if (previewSpotLight?.shadow) {
      previewSpotLight.shadow.needsUpdate = true;
    }
    if (renderer?.domElement) {
      renderer.domElement.dataset.exportShadowQuality = flag
        ? "high"
        : "realtime";
    }
  }
}
function scaledShadowMapSize(arg0) {
  if (!shadowCameraExpanded) {
    return arg0;
  }
  const value = Math.max(
    1,
    Math.floor(
      finite(renderer?.capabilities?.maxTextureSize, DEFAULT_MAX_TEXTURE_SIZE),
    ),
  );
  return Math.min(value, Math.max(arg0, DEFAULT_MAX_TEXTURE_SIZE));
}
function syncBaseLightingControls() {
  for (const el of baseLightControlEls) {
    const toFixed =
      baseLighting[el.dataset.baseLightControl];
    const flag = el.step === "5";
    syncControlValue(
      el,
      flag
        ? Math.round(toFixed)
        : Number(toFixed.toFixed(2)),
    );
  }
}
function applyBaseLighting(arg0) {
  baseLighting = normalizeBaseLighting(arg0);
  syncBaseLightingControls();
  applyPreviewEnvironment();
  requestRender({
    shadows: true,
  });
}
function relocateBaseLightControls() {
  if (!projectDoc || !baseLightControls) {
    return;
  }
  const append = exportDialog?.open ? exportDialog : document.body;
  if (baseLightControls.parentElement !== append) {
    append.append(baseLightControls);
  }
  if (baseLightControls.hidden) {
    applyBaseLighting(projectDoc.baseLighting);
  }
  baseLightControls.hidden = false;
  const size = baseLightControls.getBoundingClientRect();
  if (
    size.right > window.innerWidth - 8 ||
    size.bottom > window.innerHeight - 8 ||
    size.left < 8 ||
    size.top < 8
  ) {
    baseLightControls.style.right = "auto";
    baseLightControls.style.left =
      clamp(
        size.left,
        8,
        Math.max(8, window.innerWidth - size.width - 8),
      ) + "px";
    baseLightControls.style.top =
      clamp(
        size.top,
        8,
        Math.max(8, window.innerHeight - size.height - 8),
      ) + "px";
  }
}
function closeBaseLightControls() {
  if (baseLightControls) {
    if (projectDoc) {
      applyBaseLighting(projectDoc.baseLighting);
    }
    baseLightControls.hidden = true;
  }
}
function commitBaseLightingFromControls() {
  if (!projectDoc) {
    return;
  }
  const lighting = normalizeBaseLighting(baseLighting);
  projectDoc.baseLighting = lighting;
  applyBaseLighting(lighting);
  scheduleSave();
  baseLightingChannel?.postMessage({
    type: "base-lighting-saved",
    lighting: lighting,
  });
  flushSave();
  showToast("基础光设置已保存，导图和自动化控件已同步。", "success");
}
function onBaseLightControlInput(el) {
  const baseLightControl = el.dataset.baseLightControl;
  if (baseLightControl in baseLighting) {
    baseLighting = normalizeBaseLighting({
      ...baseLighting,
      [baseLightControl]: finite(
        el.value,
        baseLighting[baseLightControl],
      ),
    });
    applyPreviewEnvironment();
    requestRender({
      shadows: true,
    });
  }
}
function activeCameraSettings() {
  if (getPreviewFloorMode() === "all") {
    return projectDoc.combinedCameraSettings;
  } else {
    return floorScene.settings;
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
  return (
    (((Math.round(finite(activeCameraSettings()?.cameraTopRotation, 0) / 90) *
      90) %
      360) +
      360) %
    360
  );
}
function topViewForwardVector(arg0 = topViewRotation()) {
  const value = THREE.MathUtils.degToRad(arg0);
  return new THREE.Vector3(Math.sin(value), 0, -Math.cos(value));
}
function getCameraFocalLength() {
  return clamp(finite(activeCameraSettings()?.cameraFocalLength, 50), 18, 120);
}
function enabledVisibleLights() {
  return collectVisibleLights()
    .filter(
      ({ item: item, group: group }) =>
        group?.enabled !== false && finite(item.lightBrightness, 0) > 0,
    )
    .map(({ item: item }) => item);
}
function estimateLightRenderCost() {
  const list = enabledVisibleLights();
  const size = renderer?.domElement;
  const previewPixels =
    size?.width && size?.height
      ? size.width * size.height
      : Math.max(window.innerWidth * window.innerHeight * 0.32, 120000);
  return {
    count: list.length,
    cost: adaptiveLightRenderCost(
      list.map((item) => ({
        type: item.type,
        angle: item.lightAngle,
        brightness: item.lightBrightness,
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
function evaluatePreviewLightBudget() {
  if (isStageEmbed) {
    previewQualityReady = true;
    adaptiveQualityArmed = true;
    previewQualityPath = "cache-first";
    return {
      count: 0,
      cost: 0,
      budget: 0,
    };
  }
  const value = estimateLightRenderCost();
  const flag = previewQualityReady;
  if (adaptiveQualityArmed) {
    if (
      previewQualityReady &&
      value.cost <
        Math.min(
          value.budget * 0.68,
          Math.max(baselineLightRenderCost * 0.55, 1),
        )
    ) {
      previewQualityReady = false;
      previewQualityPath = "";
      baselineLightRenderCost = 0;
      slowFrameStreak = 0;
    }
  } else {
    adaptiveQualityArmed = true;
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
  evaluatePreviewLightBudget();
  return previewQualityReady;
}
function markPreviewQualityReady(sufficient) {
  if (!previewQualityReady && !!sufficient?.sufficient) {
    previewQualityReady = true;
    adaptiveQualityArmed = true;
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
  const sufficient =
    assessAdaptiveRenderFrames(recentFrameMsSamples);
  if (!sufficient.sufficient) {
    return;
  }
  const value = estimateLightRenderCost();
  const maxValue = value.cost / Math.max(value.budget, 1);
  const caqV3 = maxValue >= 1.8 ? 3 : maxValue >= 1 ? 4 : 5;
  adaptiveFpsEstimate = sufficient.fps;
  if (sufficient.severe) {
    slowFrameStreak = caqV3;
  } else if (sufficient.slow) {
    slowFrameStreak += 1;
  } else if (sufficient.smooth) {
    slowFrameStreak = 0;
  }
  if (slowFrameStreak >= caqV3) {
    markPreviewQualityReady(sufficient);
  }
}
function tickQualityProbe(arg0 = performance.now()) {
  if (
    (!previewOrbitLocked && (!isStageEmbed || !isStageWarmup)) ||
    stageSession ||
    previewQualityReady ||
    !enabledVisibleLights().length
  ) {
    qualityProbeStartMs = 0;
    return;
  }
  if (qualityProbeStartMs > 0) {
    const value = arg0 - qualityProbeStartMs;
    if (
      value >= 8 &&
      (value <= 120 || (isStageEmbed && value <= 2000))
    ) {
      recentFrameMsSamples.push(Math.min(value, 120));
    }
  }
  qualityProbeStartMs = arg0;
  if (!(recentFrameMsSamples.length < 24)) {
    checkAdaptiveQuality();
    recentFrameMsSamples.splice(0, 12);
  }
}
function isLivePreviewEnabled() {
  return floorScene.settings?.livePreviewEnabled !== false;
}
function syncLivePreviewButtons() {
  const livePreviewEnabled = isLivePreviewEnabled();
  for (const element of previewSyncEls) {
    const value =
      element.dataset.previewSync === (livePreviewEnabled ? "live" : "manual");
    element.classList.toggle("active", value);
    element.setAttribute("aria-pressed", String(value));
  }
  refreshPreview.hidden = livePreviewEnabled;
  refreshPreview.disabled = !previewNeedsRefresh;
  refreshPreview.classList.toggle("is-dirty", previewNeedsRefresh);
  refreshPreview.textContent = previewNeedsRefresh ? "待更新 · 更新" : "已更新";
}
function syncCameraModeButtons(arg0 = getCameraProjectionMode()) {
  for (const element of cameraModeEls) {
    element.classList.toggle(
      "active",
      element.dataset.cameraMode === arg0,
    );
  }
  syncCameraFocalControls(arg0);
}
function syncCameraViewButtons(arg0 = cameraViewMode()) {
  for (const element of cameraViewEls) {
    const value = element.dataset.cameraView === arg0;
    element.classList.toggle("active", value);
    element.setAttribute("aria-pressed", String(value));
  }
  for (const disabled of cameraRotateTopEls) {
    disabled.disabled = arg0 !== "top";
  }
}
function syncCameraFocalControls(arg0 = getCameraProjectionMode()) {
  for (const disabled of cameraFocalLengthEls) {
    syncControlValue(disabled, Math.round(getCameraFocalLength()));
    disabled.disabled = arg0 !== "perspective";
    disabled
      .closest(".camera-focal-control")
      ?.classList.toggle("is-disabled", disabled.disabled);
  }
}
function applyCameraFocalLength(
  isPerspectiveCamera = camera,
  arg1 = getCameraFocalLength(),
) {
  if (isPerspectiveCamera?.isPerspectiveCamera) {
    isPerspectiveCamera.setFocalLength(
      clamp(finite(arg1, 50), 18, 120),
    );
    isPerspectiveCamera.updateProjectionMatrix();
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
  const flag2 = isStageEmbed && isStageWarmup;
  let value =
    Math.min(window.devicePixelRatio || 1, flag ? 1 : 1.6) *
    (isStageEmbed ? studioPixelRatio : 1);
  if (isStageEmbed && (flag || flag2)) {
    const { cost: cost, budget: budget } = estimateLightRenderCost();
    if (cost > budget) {
      value = Math.min(
        value,
        clamp(Math.sqrt(budget / cost) * 0.85, 0.5, 0.85),
      );
    }
  }
  return value;
}
const isRenderStatsTest = new URLSearchParams(window.location.search).has(
  "render-stats-test",
);
const isPerfDiagnosticsEnabled =
  new URLSearchParams(window.location.search).get("performance-diagnostics") ===
  "1";
const PERF_SAMPLE_WINDOW = 240;
const PERF_HUD_PUBLISH_MS = 750;
const MAX_GPU_QUERIES_PENDING = 4;
const perfStats = {
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
    staticItemSaved: Number(
      domElement.dataset.staticItemDrawCallsSaved || 0,
    ),
  };
  let id = document.querySelector("#ha-bridge-render-stats-test-output");
  if (!id) {
    id = document.createElement("output");
    id.id = "ha-bridge-render-stats-test-output";
    document.body.append(id);
  }
  id.textContent =
    "渲染统计：" +
    calls.calls +
    " 次调用，" +
    calls.triangles +
    " 个三角面；重复实例节省 " +
    calls.instanceSaved +
    " 次，跨模型材质合批节省 " +
    calls.staticItemSaved +
    " 次。";
  document.documentElement.dataset.renderStatsTest =
    JSON.stringify(calls);
}
function pushPerfSample(list, arg1) {
  if (Number.isFinite(arg1)) {
    list.push(arg1);
    if (list.length > PERF_SAMPLE_WINDOW) {
      list.splice(0, list.length - PERF_SAMPLE_WINDOW);
    }
  }
}
function averagePerfSample(list) {
  if (list.length) {
    return (
      list.reduce((arg0, arg1) => arg0 + arg1, 0) /
      list.length
    );
  } else {
    return null;
  }
}
function percentilePerfSample(list, arg1) {
  if (!list.length) {
    return null;
  }
  const list2 = [...list].sort(
    (arg0, arg12) => arg0 - arg12,
  );
  const value = Math.min(
    list2.length - 1,
    Math.max(0, Math.ceil(list2.length * arg1) - 1),
  );
  return list2[value];
}
function fitCameraToSelection(toFixed, arg1 = 1) {
  if (Number.isFinite(toFixed)) {
    return Number(toFixed.toFixed(arg1));
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
  perfStats.gpuExtension =
    perfStats.gpuContext?.getExtension?.("EXT_disjoint_timer_query_webgl2") ||
    null;
  perfStats.gpuStatus = perfStats.gpuExtension ? "等待样本" : "不可用";
}
function beginGpuTimingQuery(flag) {
  if (!isPerfDiagnosticsEnabled || !flag) {
    return false;
  }
  const gpuQueryActive = perfStats;
  const isCreateQuery = gpuQueryActive.gpuContext;
  const isTIME_ELAPSED_EXT = gpuQueryActive.gpuExtension;
  if (
    !isCreateQuery ||
    !isTIME_ELAPSED_EXT ||
    gpuQueryActive.gpuQueryActive ||
    gpuQueryActive.gpuQueriesPending.length >= MAX_GPU_QUERIES_PENDING
  ) {
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
  if (
    !isGetParameter ||
    !isGPU_DISJOINT_EXT ||
    !gpuQueriesPending.gpuQueriesPending.length
  ) {
    return;
  }
  if (isGetParameter.getParameter(isGPU_DISJOINT_EXT.GPU_DISJOINT_EXT)) {
    for (const value of gpuQueriesPending.gpuQueriesPending.splice(
      0,
    )) {
      isGetParameter.deleteQuery(value);
    }
    gpuQueriesPending.gpuRenderTimes.length = 0;
    gpuQueriesPending.gpuStatus = "采样失效";
    return;
  }
  const list = [];
  for (const value of gpuQueriesPending.gpuQueriesPending) {
    if (
      !isGetParameter.getQueryParameter(
        value,
        isGetParameter.QUERY_RESULT_AVAILABLE,
      )
    ) {
      list.push(value);
      continue;
    }
    const queryParameter = isGetParameter.getQueryParameter(
      value,
      isGetParameter.QUERY_RESULT,
    );
    pushPerfSample(
      gpuQueriesPending.gpuRenderTimes,
      queryParameter / 1000000,
    );
    isGetParameter.deleteQuery(value);
    gpuQueriesPending.gpuStatus = "可用";
  }
  gpuQueriesPending.gpuQueriesPending = list;
}
function recordCpuFrameTiming(arg0, arg1, flag) {
  if (!isPerfDiagnosticsEnabled) {
    return;
  }
  const lastMotionRenderAt = perfStats;
  if (flag) {
    pushPerfSample(lastMotionRenderAt.cpuRenderTimes, arg1);
    if (lastMotionRenderAt.lastMotionRenderAt > 0) {
      const value =
        arg0 - lastMotionRenderAt.lastMotionRenderAt;
      if (value >= 2 && value <= 250) {
        pushPerfSample(lastMotionRenderAt.frameIntervals, value);
      }
    }
    lastMotionRenderAt.lastMotionRenderAt = arg0;
  } else {
    lastMotionRenderAt.lastMotionRenderAt = 0;
  }
}
function collectSceneMeshStats() {
  const value = new Set();
  let meshes = 0;
  let lights = 0;
  let visibleLights = 0;
  let activeSpotShadows = 0;
  previewScene?.traverse((light) => {
    if (light.isMesh) {
      meshes += 1;
      const isArrayResult = Array.isArray(light.material)
        ? light.material
        : [light.material];
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
      if (
        light.isSpotLight &&
        light.castShadow &&
        light.visible !== false
      ) {
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
  const activeUserFixtures = collectVisibleLights().filter(
    ({ item: item, group: group }) =>
      group?.enabled !== false && finite(item.lightBrightness, 0) > 0,
  ).length;
  return {
    meshes: meshes,
    materials: value.size,
    lights: lights,
    visibleLights: visibleLights,
    activeUserFixtures: activeUserFixtures,
    activeSpotShadows: activeSpotShadows,
  };
}
function publishPerfHud(arg0 = performance.now()) {
  if (!isPerfDiagnosticsEnabled || !renderer || !perfStats.hud) {
    return;
  }
  const frameIntervals = perfStats;
  if (arg0 - frameIntervals.lastPublishAt < PERF_HUD_PUBLISH_MS) {
    return;
  }
  frameIntervals.lastPublishAt = arg0;
  const domElement = renderer.domElement;
  const flag = averagePerfSample(frameIntervals.frameIntervals);
  const flag2 = percentilePerfSample(
    frameIntervals.frameIntervals,
    0.5,
  );
  const scene = collectSceneMeshStats();
  const value = renderer.info.programs?.length;
  const frame = {
    enabled: true,
    motionActive: frameIntervals.motionActive,
    frame: {
      samples: frameIntervals.frameIntervals.length,
      averageFps: fitCameraToSelection(flag ? 1000 / flag : null),
      medianFps: fitCameraToSelection(flag2 ? 1000 / flag2 : null),
      p95Ms: fitCameraToSelection(
        percentilePerfSample(frameIntervals.frameIntervals, 0.95),
        2,
      ),
    },
    cpuRenderMs: {
      samples: frameIntervals.cpuRenderTimes.length,
      average: fitCameraToSelection(
        averagePerfSample(frameIntervals.cpuRenderTimes),
        2,
      ),
      p95: fitCameraToSelection(
        percentilePerfSample(frameIntervals.cpuRenderTimes, 0.95),
        2,
      ),
    },
    gpuRenderMs: {
      supported: !!frameIntervals.gpuExtension,
      status: frameIntervals.gpuStatus,
      samples: frameIntervals.gpuRenderTimes.length,
      average: fitCameraToSelection(
        averagePerfSample(frameIntervals.gpuRenderTimes),
        2,
      ),
      p95: fitCameraToSelection(
        percentilePerfSample(frameIntervals.gpuRenderTimes, 0.95),
        2,
      ),
    },
    render: {
      calls: Number(domElement.dataset.renderCalls || 0),
      triangles: Number(domElement.dataset.renderTriangles || 0),
      lines: Number(domElement.dataset.renderLines || 0),
    },
    memory: {
      geometries: Number(renderer.info.memory.geometries || 0),
      textures: Number(renderer.info.memory.textures || 0),
      programs: Number.isFinite(value) ? value : null,
    },
    scene: scene,
    viewport: {
      devicePixelRatio: fitCameraToSelection(renderer.getPixelRatio(), 2),
      canvasWidth: domElement.width,
      canvasHeight: domElement.height,
      cssWidth: Math.round(domElement.clientWidth),
      cssHeight: Math.round(domElement.clientHeight),
    },
    lighting: {
      adaptiveCacheEnabled: previewQualityReady,
      residentCacheMode: residentCacheMode,
      cacheReady: lightCacheReady,
    },
  };
  const pphV2 = frame.frame.samples
    ? frame.frame.averageFps +
      " / " +
      frame.frame.medianFps +
      " FPS · P95 " +
      frame.frame.p95Ms +
      " ms"
    : "移动镜头后采样";
  const pphV3 = frame.gpuRenderMs.samples
    ? frame.gpuRenderMs.average +
      " ms · P95 " +
      frame.gpuRenderMs.p95 +
      " ms"
    : frame.gpuRenderMs.status;
  frameIntervals.hud.innerHTML = [
    "<strong>3D 性能诊断</strong><span>" +
      (frameIntervals.motionActive ? "交互 / 阻尼中" : "空闲") +
      "</span>",
    "<span>帧率</span><b>" + pphV2 + "</b>",
    "<span>CPU 提交</span><b>" +
      (frame.cpuRenderMs.average ?? "—") +
      " ms · P95 " +
      (frame.cpuRenderMs.p95 ?? "—") +
      " ms</b>",
    "<span>GPU 渲染</span><b>" + pphV3 + "</b>",
    "<span>绘制</span><b>" +
      frame.render.calls +
      " calls · " +
      frame.render.triangles.toLocaleString() +
      " tris</b>",
    "<span>场景</span><b>" +
      scene.meshes +
      " mesh · " +
      scene.materials +
      " 材质实例</b>",
    "<span>资源</span><b>" +
      frame.memory.geometries +
      " 几何 · " +
      frame.memory.textures +
      " 纹理 · " +
      (frame.memory.programs ?? "—") +
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
      frame.viewport.canvasWidth +
      "×" +
      frame.viewport.canvasHeight +
      " · DPR " +
      frame.viewport.devicePixelRatio +
      "</b>",
    "<span>光照缓存</span><b>" +
      (frame.lighting.adaptiveCacheEnabled
        ? "自适应"
        : frame.lighting.residentCacheMode
          ? "驻留"
          : "实时") +
      "</b>",
  ].join("");
  document.documentElement.dataset.performanceDiagnostics =
    JSON.stringify(frame);
}
function setPerfMotionActive(arg0, flag) {
  if (isPerfDiagnosticsEnabled) {
    perfStats.motionActive = flag;
    if (!flag) {
      perfStats.lastMotionRenderAt = 0;
    }
    collectGpuTimingResults();
    publishPerfHud(arg0);
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
  const active = externalModels.modelLoadState();
  return (
    active.active > 0 ||
    active.queued > 0 ||
    modelsLoading ||
    modelLoadStatusTimer !== null ||
    isSceneRebuildQueued
  );
}
async function finishStageSessionWarmup() {
  stageSessionEndTimer = null;
  if (
    !studioReady ||
    renderCache?.closed ||
    !renderer ||
    stageSession ||
    previewOrbitLocked ||
    isLeavingStudio ||
    isBakingLightCache ||
    isCapturingFrame ||
    isStageWarmup ||
    hasPendingShadowTiles
  ) {
    return;
  }
  if (
    hasPendingModelLoads() ||
    shadowAtlas?.isBuilding() ||
    shadowAtlas?.isPending()
  ) {
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
  const onComplete = () =>
    studioReady &&
    !renderCache?.closed &&
    !hasPendingModelLoads() &&
    value === lightCacheEpoch &&
    !stageSession &&
    !previewOrbitLocked &&
    !isLeavingStudio &&
    !isCapturingFrame &&
    !isStageWarmup;
  isBakingLightCache = true;
  let el;
  let flag = false;
  try {
    const entry = collectVisibleLights();
    const sha2562 = sha256(
      stableCacheJSON({
        kind: "settled-rgba-v1",
        base: computeLightRenderCacheKey(width, height),
        lights: entry.map(
          ({ item: item, itemKey: key, group: group }) => ({
            key: key,
            enabled: group?.enabled !== false,
            brightness: item.lightBrightness,
            temperature: item.lightTemperature,
          }),
        ),
      }),
    );
    el = await renderCache?.acquire(
      sha2562,
      width,
      height,
      onComplete,
    );
    if (!onComplete()) {
      return;
    }
    if (!el) {
      const worldItemsCached = ensureWorldItemsCached(entry);
      syncLightGroupVisibility(worldItemsCached);
      syncOrbitControls();
      renderer.render(previewScene, camera);
      el = document.createElement("canvas");
      el.width = width;
      el.height = height;
      const isDrawImage = el.getContext("2d");
      if (!isDrawImage) {
        throw new Error("当前浏览器无法创建静止画面缓存。");
      }
      isDrawImage.drawImage(domElement, 0, 0);
      const size = el;
      Promise.resolve(renderCache?.write(sha2562, size, onComplete))
        .catch((arg0) => {
          window.HABridgeLog?.error(arg0, {
            phase: "interaction3d-cache-write",
          });
        })
        .finally(() => {
          size.width = size.height = 0;
        });
    }
    if (!onComplete()) {
      return;
    }
    const isClearRect = previewLightCache.getContext("2d");
    if (!isClearRect) {
      throw new Error("当前浏览器无法创建静止画面缓存。");
    }
    previewLightCache.width = width;
    previewLightCache.height = height;
    isClearRect.clearRect(0, 0, width, height);
    isClearRect.drawImage(el.image || el, 0, 0);
    lightCacheTileMap.clear();
    pendingModelLoads.clear();
    lightCacheReady = true;
    previewQualityJustBecameReady = false;
    domElement.dataset.lightCachePixels = String(width * height);
    domElement.dataset.lightCacheRetainedGroups = "complete-frame";
    setPreviewLightCacheVisible(true);
  } catch (error) {
    flag = true;
    setPreviewLightCacheVisible(false);
    window.HABridgeLog?.error(error, {
      phase: "interaction3d-settled-cache",
    });
  } finally {
    try {
      el?.close?.();
    } finally {
      isBakingLightCache = false;
    }
    if (
      previewQualityJustBecameReady &&
      (!flag || value !== lightCacheEpoch)
    ) {
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
    isClearRect.clearRect(
      0,
      0,
      previewLightCache.width,
      previewLightCache.height,
    );
    for (const [value, tileCanvas] of lightCacheTileMap) {
      const clamp2 = clamp(
        finite(pendingModelLoads.get(value), 0),
        0,
        1,
      );
      if (!(clamp2 <= 0.001)) {
        isClearRect.save();
        isClearRect.globalAlpha = clamp2;
        isClearRect.drawImage(tileCanvas, 0, 0);
        isClearRect.restore();
      }
    }
  }
}
function invalidateLightCacheTiles(arg0, arg1 = LIGHT_CACHE_TILE_MS) {
  const list = [...new Set(arg0)].filter(Boolean);
  if (!list.length) {
    return;
  }
  const value = list.map((param) => ({
    groupId: previewScopedItemKey(activeFloorId, param),
    from: clamp(
      finite(
        pendingModelLoads.get(previewScopedItemKey(activeFloorId, param)),
        findLightGroupById(param)?.enabled === false ? 0 : 1,
      ),
      0,
      1,
    ),
    to: findLightGroupById(param)?.enabled === false ? 0 : 1,
  }));
  cancelAnimationFrame(lightBakeRaf);
  if (!lightCacheReady) {
    for (const group of value) {
      pendingModelLoads.set(group.groupId, group.to);
    }
    if (!isBakingLightCache) {
      scheduleAdaptiveQuality(0);
    }
    return;
  }
  const nowResult = performance.now();
  const handler = (arg02) => {
    const clamp2 = clamp((arg02 - nowResult) / arg1, 0, 1);
    const ilctV3 = clamp2 * clamp2 * (3 - clamp2 * 2);
    for (const entry of value) {
      pendingModelLoads.set(
        entry.groupId,
        entry.from + (entry.to - entry.from) * ilctV3,
      );
    }
    blitLightCacheToOverlay();
    if (clamp2 < 1) {
      lightBakeRaf = requestAnimationFrame(handler);
    } else {
      lightBakeRaf = 0;
    }
  };
  lightBakeRaf = requestAnimationFrame(handler);
}
function findLightGroupById(arg0) {
  return (
    floorScene.lightGroups?.find((item) => item.id === arg0) ||
    null
  );
}
function markLightGroupsDirty(arg0, arg1 = LIGHT_CACHE_TILE_MS) {
  if (!worldGroup) {
    return false;
  }
  const value = new Set(arg0);
  const flag = isPreviewQualityReady() && !stageSession;
  const list = [];
  worldGroup.traverse((object) => {
    if (
      !object.isLight ||
      !value.has(object.userData?.lightGroupId)
    ) {
      return;
    }
    const to =
      findLightGroupById(object.userData.lightGroupId)?.enabled !==
        false && !flag
        ? finite(object.userData.lightOnIntensity, 0)
        : 0;
    if (to > 0) {
      object.visible = true;
    }
    list.push({
      object: object,
      from: finite(object.intensity, 0),
      to: to,
    });
  });
  if (!list.length) {
    return false;
  }
  if (list.some(({ to: toCount }) => toCount > 0)) {
    countShadowLights(worldGroup, {
      rebuildAtlas: false,
    });
  }
  cancelAnimationFrame(shadowAtlasRaf);
  const nowResult = performance.now();
  const handler = (arg02) => {
    const clamp2 = clamp((arg02 - nowResult) / arg1, 0, 1);
    const mlgdV3 = clamp2 * clamp2 * (3 - clamp2 * 2);
    for (const entry of list) {
      entry.object.intensity =
        entry.from + (entry.to - entry.from) * mlgdV3;
    }
    updateLightPreview();
    if (clamp2 < 1) {
      shadowAtlasRaf = requestAnimationFrame(handler);
    } else {
      shadowAtlasRaf = 0;
      let flag2 = false;
      for (const to of list) {
        if (!(to.to > 0)) {
          to.object.visible = false;
          flag2 = true;
        }
      }
      if (flag2) {
        countShadowLights(worldGroup, {
          rebuildAtlas: false,
        });
      }
    }
  };
  shadowAtlasRaf = requestAnimationFrame(handler);
  return true;
}
function requestLightGroupCacheRefresh(arg0) {
  const arg02 = [...new Set(arg0)].filter(Boolean);
  if (isPreviewQualityReady() && !stageSession) {
    invalidateLightCacheTiles(arg02);
  } else if (!markLightGroupsDirty(arg02)) {
    rebuildPreviewMeshes({
      scope: "lights",
      preserveLightCache: true,
    });
  }
  renderLightLayerPanel();
  updateSelectionInspector();
  drawPlan();
  syncOrbitControls();
}
function requestRender(floor = {}) {
  needsRenderFrame = true;
  renderIdle = false;
  demandFrameLoop?.wake();
  if (
    isStageEmbed &&
    (floor.scene === true || floor.shadows === true)
  ) {
    cacheObjectTransforms(previewScene, THREE.Object3D);
  }
  if (floor.shadows === true) {
    previewScene?.traverse((light) => {
      if (light.isLight && light.castShadow && light.shadow) {
        light.shadow.needsUpdate = true;
      }
    });
  }
  if (!isRebuildingWorld) {
    if (
      floor.preserveLightCache === true &&
      isPreviewQualityReady() &&
      !stageSession
    ) {
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
    if (getPreviewFloorMode() === "all") {
      rebuildWorldPreview({
        preserveLightCache: true,
      });
    } else {
      rebuildPreviewLightMeshes({
        preserveLightCache: true,
      });
    }
  } finally {
    isRebuildingWorld = false;
  }
}
function collectWorldItemKeys() {
  const map = new Map();
  worldGroup?.traverse((object3d) => {
    const arg1 = object3d.userData?.lightItemId;
    if (!object3d.isLight || !arg1) {
      return;
    }
    const value = layerScopedKey(
      object3d.userData?.lightFloorId,
      arg1,
    );
    if (!map.has(value)) {
      map.set(value, []);
    }
    map.get(value).push(object3d);
  });
  return map;
}
function ensureWorldItemsCached(entry) {
  let has = collectWorldItemKeys();
  if (
    entry.every((itemKey) =>
      has.has(itemKey.itemKey),
    )
  ) {
    return has;
  }
  if (isStageEmbed) {
    return withResidentCacheMode(entry, has);
  }
  residentCacheMode = true;
  forcedVisibleLightGroupIds = new Set();
  try {
    rebuildWorldPreserveLights();
  } finally {
    forcedVisibleLightGroupIds = null;
    residentCacheMode = false;
  }
  has = collectWorldItemKeys();
  return has;
}
function withResidentCacheMode(arg0, has) {
  const value = floorScene;
  const wrcmV2 = activeFloorId;
  const wrcmV3 = residentCacheMode;
  const flag = getPreviewFloorMode() === "all";
  try {
    residentCacheMode = true;
    for (const {
      floor: floor,
      item: size,
      itemKey: itemKey,
    } of arg0) {
      if (
        has.has(itemKey) ||
        (!flag && floor.id !== wrcmV2)
      ) {
        continue;
      }
      const group = flag
        ? worldGroup?.children.find(
            (object3d2) =>
              object3d2.userData?.floorId === floor.id,
          )
        : worldGroup;
      if (!group) {
        continue;
      }
      floorScene = floor.scene;
      activeFloorId = floor.id;
      const flag2 = pixelsPerMeter();
      if (!flag2) {
        continue;
      }
      const activeFloorContentBoundsResult = activeFloorContentBounds();
      const wrcmV5 = flag
        ? finite(floor.originX, 0)
        : (activeFloorContentBoundsResult.minX + activeFloorContentBoundsResult.maxX) / 2;
      const wrcmV6 = flag
        ? finite(floor.originY, 0)
        : (activeFloorContentBoundsResult.minY + activeFloorContentBoundsResult.maxY) / 2;
      const object3d = new THREE.Group();
      buildLightFixtureMeshes(
        object3d,
        size,
        shadowCastingLightIdSet(),
      );
      object3d.position.set(
        (size.x - wrcmV5) / flag2,
        size.elevation || 0,
        (size.y - wrcmV6) / flag2,
      );
      applyItemYawRotation(object3d, size);
      object3d.userData.modelLayer = "lights";
      object3d.userData.exportRole = "plan";
      group.add(object3d);
      const list = [];
      object3d.traverse((object3d2) => {
        if (object3d2.isLight) {
          list.push(object3d2);
        }
      });
      if (list.length) {
        has.set(itemKey, list);
      }
    }
  } finally {
    floorScene = value;
    activeFloorId = wrcmV2;
    residentCacheMode = wrcmV3;
  }
  countShadowLights(worldGroup, {
    rebuildAtlas: false,
  });
  return has;
}
function setGroupVisibilityByKey(arg0, arg1 = "") {
  for (const [value, lights] of arg0) {
    const flag = value === arg1;
    for (const light of lights) {
      light.visible = flag;
      light.intensity = flag
        ? finite(light.userData?.lightOnIntensity, 0)
        : 0;
      if (light.isSpotLight) {
        light.castShadow = flag;
        if (flag && light.shadow && !light.shadow.map) {
          light.shadow.needsUpdate = true;
        }
      }
    }
  }
  updateLightPreview();
}
function enabledVisibleLightKeys() {
  return new Set(
    collectVisibleLights()
      .filter(
        ({ item: item, group: group }) =>
          group?.enabled !== false &&
          finite(item.lightBrightness, 0) > 0,
      )
      .map(({ itemKey: itemKey }) => itemKey),
  );
}
function syncLightGroupVisibility(arg0) {
  const value = enabledVisibleLightKeys();
  for (const [groupKey, lights] of arg0) {
    const flag = value.has(groupKey);
    for (const light of lights) {
      light.visible = flag;
      light.intensity = flag
        ? finite(light.userData?.lightOnIntensity, 0)
        : 0;
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
    canvasCtx.fillStyle =
      "#" + resolvedThemeColors().background.toString(16).padStart(6, "0");
    canvasCtx.fillRect(
      0,
      0,
      previewRenderShield.width,
      previewRenderShield.height,
    );
    if (isStageEmbed) {
      renderer.render(previewScene, camera);
    }
    canvasCtx.drawImage(domElement, 0, 0);
    if (!previewLightCache.hidden) {
      if (isStageEmbed) {
        canvasCtx.drawImage(
          previewLightCache,
          0,
          0,
          previewRenderShield.width,
          previewRenderShield.height,
        );
      } else {
        canvasCtx.drawImage(previewLightCache, 0, 0);
      }
    }
    previewRenderShield.hidden = false;
  }
}
function showPreviewRenderShield({ smooth: flag = false } = {}) {
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
  return new Promise((arg0) =>
    requestAnimationFrame(() => requestAnimationFrame(arg0)),
  );
}
function createOffscreenCanvas(arg0, arg1) {
  const el = document.createElement("canvas");
  el.width = arg0;
  el.height = arg1;
  const isDrawImage = el.getContext("2d", {
    willReadFrequently: true,
  });
  if (!isDrawImage) {
    throw new Error("当前浏览器无法创建多灯缓存画布。");
  }
  isDrawImage.drawImage(
    renderer.domElement,
    0,
    0,
    arg0,
    arg1,
  );
  return isDrawImage.getImageData(0, 0, arg0, arg1);
}
function warmPreviewRenderer() {
  for (let value = 0; value < 3; value += 1) {
    renderer.render(previewScene, camera);
  }
}
function yieldToScheduler() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else {
    return new Promise((arg0) =>
      requestAnimationFrame(() => arg0()),
    );
  }
}
function yieldToIdle() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else if (globalThis.requestIdleCallback) {
    return new Promise((arg0) =>
      requestIdleCallback(() => arg0(), {
        timeout: 80,
      }),
    );
  } else {
    return new Promise((arg0) =>
      requestAnimationFrame(() => arg0()),
    );
  }
}
function scheduleAdaptiveQuality(arg0 = 420) {
  if (
    (!isStageEmbed || !!studioReady) &&
    (!isStageEmbed || !renderCache?.closed) &&
    !!renderer &&
    !!worldGroup &&
    !stageSession &&
    !previewOrbitLocked &&
    !isLeavingStudio &&
    !isBakingLightCache &&
    !isCapturingFrame &&
    !isStageWarmup &&
    !!isPreviewQualityReady()
  ) {
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = window.setTimeout(() => {
      const active = externalModels.modelLoadState();
      if (active.active > 0 || active.queued > 0) {
        stageSessionEndTimer = null;
        scheduleAdaptiveQuality(240);
        return;
      }
      endStageSession();
    }, arg0);
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
  if (
    !renderer ||
    stageSession ||
    previewOrbitLocked ||
    isLeavingStudio ||
    isBakingLightCache ||
    isCapturingFrame ||
    isStageWarmup ||
    !isPreviewQualityReady()
  ) {
    return;
  }
  const value = lightCacheEpoch;
  const entry = collectVisibleLights().filter(
    ({ item: item, group: group }) =>
      finite(item.lightBrightness, 0) > 0,
  );
  const domElement = renderer.domElement;
  let width = domElement.width;
  let height = domElement.height;
  if (!width || !height || !entry.length) {
    return;
  }
  isBakingLightCache = true;
  previewQualityJustBecameReady = true;
  const enabled = orbitControls.enabled;
  const map = new Map();
  let flag = false;
  syncOrbitControls();
  try {
    const isClearRect = previewLightCache.getContext("2d");
    if (!isClearRect) {
      throw new Error("当前浏览器无法显示多灯缓存。");
    }
    if (
      previewLightCache.hidden ||
      !lightCacheReady ||
      previewLightCache.width !== width ||
      previewLightCache.height !== height
    ) {
      previewLightCache.width = width;
      previewLightCache.height = height;
      isClearRect.clearRect(0, 0, width, height);
    }
    const el = document.createElement("canvas");
    el.width = width;
    el.height = height;
    const isClearRect2 = el.getContext("2d");
    const el2 = document.createElement("canvas");
    el2.width = width;
    el2.height = height;
    const isClearRect3 = el2.getContext("2d");
    if (!isClearRect2 || !isClearRect3) {
      throw new Error("当前浏览器无法合成多灯缓存。");
    }
    const map2 = new Map();
    const worldItemsCached = ensureWorldItemsCached(entry);
    await waitTwoAnimationFrames();
    if (
      value !== lightCacheEpoch ||
      stageSession ||
      previewOrbitLocked ||
      isLeavingStudio ||
      !isPreviewQualityReady()
    ) {
      return;
    }
    setGroupVisibilityByKey(worldItemsCached);
    isClearRect2.clearRect(0, 0, width, height);
    worldGroup.traverse((object3d) => {
      if (object3d.userData?.exportRole === "grid") {
        map.set(object3d, object3d.visible);
        object3d.visible = false;
      }
    });
    let isData;
    for (const entry2 of entry) {
      await yieldToIdle();
      if (
        value !== lightCacheEpoch ||
        stageSession ||
        previewOrbitLocked ||
        isLeavingStudio ||
        !isPreviewQualityReady()
      ) {
        break;
      }
      const {
        item: item,
        group: group,
        itemKey: itemKey,
        groupKey: groupKey,
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
        const buildLightDeltaPixels2 = buildLightDeltaPixels(
          isData.data,
          offscreenCanvas.data,
        );
        isClearRect3.putImageData(
          new ImageData(buildLightDeltaPixels2, width, height),
          0,
          0,
        );
      }
      isClearRect2.drawImage(el2, 0, 0);
      let object3d = map2.get(groupKey);
      if (!object3d) {
        object3d = document.createElement("canvas");
        object3d.width = width;
        object3d.height = height;
        object3d.userData = {
          enabled: group?.enabled !== false,
        };
        map2.set(groupKey, object3d);
      }
      object3d.getContext("2d")?.drawImage(el2, 0, 0);
      await yieldToScheduler();
      if (
        value !== lightCacheEpoch ||
        stageSession ||
        previewOrbitLocked ||
        isLeavingStudio ||
        !isPreviewQualityReady()
      ) {
        break;
      }
    }
    if (
      value === lightCacheEpoch &&
      !stageSession &&
      isPreviewQualityReady()
    ) {
      lightCacheTileMap = map2;
      for (const [tileKey, object3d] of map2) {
        pendingModelLoads.set(
          tileKey,
          object3d.userData?.enabled === false ? 0 : 1,
        );
      }
      lightCacheReady = true;
      previewQualityJustBecameReady = false;
      setPreviewLightCacheVisible(true);
      blitLightCacheToOverlay();
      flag = true;
    }
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-light-cache",
    });
    console.error(error);
    lightCacheReady = !previewLightCache.hidden;
  } finally {
    for (const [object3d, wasVisible] of map) {
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
    if (
      previewQualityJustBecameReady &&
      isPreviewQualityReady() &&
      !stageSession
    ) {
      scheduleAdaptiveQuality();
    }
  }
}
function beginLeaveStudio() {
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
      const scope =
        list.includes("all") || list.length > 1
          ? "all"
          : list[0];
      rebuildPreviewMeshes({
        scope: scope,
        preserveLightCache: !invalidateLightCacheNextRebuild,
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
function setPreviewPixelRatio(
  flag,
  { preserveLightCache: preserveLightCache = false } = {},
) {
  if (!renderer || (stageSession && !isAutoDiagramEmbed)) {
    return;
  }
  const value = stageSession
    ? stageEmbedPixelRatio(flag)
    : computeStudioPixelRatio(flag);
  if (Math.abs(renderer.getPixelRatio() - value) > 0.000001) {
    renderer.setPixelRatio(value);
  }
  requestRender({
    preserveLightCache: preserveLightCache,
  });
}
function lockPreviewOrbit() {
  window.clearTimeout(orbitResumeTimer);
  orbitResumeTimer = null;
  previewOrbitLocked = true;
  orbitSoftSuspend = false;
  recentFrameMsSamples = [];
  qualityProbeStartMs = 0;
  syncOrbitControls();
}
function softLockPreviewOrbit() {
  if (!orbitSoftSuspend) {
    orbitSoftSuspend = true;
    syncOrbitControls();
    setPreviewPixelRatio(true, {
      preserveLightCache: true,
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
  window.clearTimeout(orbitResumeTimer);
  if (!flag) {
    if (stageSession && !orbitSuspended) {
      openExportPresetEditor();
    }
    return;
  }
  orbitResumeTimer = window.setTimeout(() => {
    orbitResumeTimer = null;
    setPreviewPixelRatio(false, {
      preserveLightCache: true,
    });
  }, 140);
  if (stageSession && !orbitSuspended) {
    openExportPresetEditor();
  }
}
function syncFloorCameraChrome() {
  const flag = (projectDoc?.floors.length || 0) > 1;
  const flag2 = getPreviewFloorMode() === "all";
  floorCameraActions.hidden = flag2;
  overviewCameraActions.hidden = !flag || !flag2;
  previewFloorGapControl.hidden = !flag || !flag2;
  syncControlValue(
    previewFloorGapInput,
    finite(projectDoc?.previewFloorGap, 3).toFixed(1),
  );
  const flag3 = !!floorScene.settings?.fixedCameraView;
  const flag4 = !!projectDoc?.combinedFixedCameraView;
  fixedCameraView.disabled = !flag3;
  fixedCameraView.classList.toggle("has-saved-view", flag3);
  fixedOverviewView.disabled = !flag4;
  fixedOverviewView.classList.toggle("has-saved-view", flag4);
  const flag5 = flag2 ? flag4 : flag3;
  exportSaveView.textContent = flag2 ? "保存总览" : "保存视角";
  exportSaveView.title = flag2
    ? "记录当前导图的全楼角度和投影方式"
    : "记录当前导图的角度、缩放和投影方式";
  selectEl("#export-use-fixed").textContent = flag2
    ? "恢复总览"
    : "恢复视角";
  selectEl("#export-use-fixed").title = flag2
    ? "恢复已保存的全楼总览视角"
    : "恢复当前楼层已保存的视角";
  selectEl("#export-use-fixed").disabled = !!orbitSuspended || !flag5;
  selectEl("#export-use-fixed").classList.toggle("has-saved-view", flag5);
}
function activeFixedCameraView() {
  if (getPreviewFloorMode() === "all") {
    return projectDoc?.combinedFixedCameraView;
  } else {
    return floorScene.settings?.fixedCameraView;
  }
}
function setActiveFixedCameraView(arg0) {
  if (getPreviewFloorMode() === "all") {
    projectDoc.combinedFixedCameraView = arg0;
  } else {
    floorScene.settings.fixedCameraView = arg0;
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
        preserveLightCache: true,
      });
    } else {
      requestRender();
    }
  });
  el.addEventListener("change", () => {
    if (!stageSession || orbitSuspended) {
      return;
    }
    const normalizeActiveExportPresetSlot2 =
      normalizeActiveExportPresetSlot(
        projectDoc?.activeExportPresetSlot,
        projectDoc?.exportPresets?.length,
      );
    if (
      !exportPresetEditorOpen &&
      !projectDoc?.exportPresets?.[normalizeActiveExportPresetSlot2]
    ) {
      exportPresetEditorOpen = true;
      normalizeProjectExportPresets();
    }
  });
  el.addEventListener("end", unlockPreviewOrbit);
  return el;
}
const ORBIT_DOLLY_SPEED_MIN = 0.02;
const ORBIT_DOLLY_SPEED_MAX = 0.32;
const ORBIT_DOLLY_SPEED_SCALE = 0.006;
function getCameraPose(
  view = camera,
  flag = orbitControls?.target,
) {
  if (!view || !flag) {
    return false;
  }
  const value = Math.max(view.position.distanceTo(flag), 1);
  const gcpV2 = view.isPerspectiveCamera
    ? clamp(
        value * ORBIT_DOLLY_SPEED_SCALE,
        ORBIT_DOLLY_SPEED_MIN,
        ORBIT_DOLLY_SPEED_MAX,
      )
    : 0.02;
  const maxValue = Math.max(
    value * (view.isPerspectiveCamera ? 8 : 5),
    100,
  );
  if (
    Math.abs(view.near - gcpV2) < 0.000001 &&
    Math.abs(view.far - maxValue) < 0.0001
  ) {
    return false;
  } else {
    view.near = gcpV2;
    view.far = maxValue;
    view.updateProjectionMatrix();
    return true;
  }
}
function resetOrbitTarget(camera2, arg1) {
  if (camera2?.isOrthographicCamera) {
    return (
      Math.abs(camera2.top - camera2.bottom) /
      Math.max(camera2.zoom || 1, 0.000001)
    );
  }
  if (camera2?.isPerspectiveCamera) {
    const value = Math.max(
      camera2.position.distanceTo(arg1),
      0.0001,
    );
    const degToRadResult = THREE.MathUtils.degToRad(camera2.getEffectiveFOV());
    return value * 2 * Math.tan(degToRadResult / 2);
  }
  return 10;
}
async function saveCurrentCameraView() {
  if (!camera || !orbitControls) {
    return;
  }
  const value =
    getPreviewFloorMode() === "all" ? "总览视角" : "当前层视角";
  if (!stageSession) {
    pushHistory();
  }
  const point3 = orbitControls.target;
  setActiveFixedCameraView({
    mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
    view: cameraViewMode(),
    topRotation: topViewRotation(),
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: point3.x,
      y: point3.y,
      z: point3.z,
    },
    visibleHeight: resetOrbitTarget(camera, point3),
    fov: camera.isPerspectiveCamera ? camera.fov : 36,
    focalLength: camera.isPerspectiveCamera ? getCameraFocalLength() : null,
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
  showToast(
    saveGeneration === savedGeneration
      ? value + "已保存。"
      : value + "已记录，正在保存…",
  );
}
function restoreFixedCameraView(recordChange = {}) {
  const isMode = activeFixedCameraView();
  if (!isMode || !camera || !orbitControls) {
    return;
  }
  const flag = isMode.mode !== getCameraProjectionMode();
  const flag2 = isMode.view !== cameraViewMode();
  const flag3 = isMode.topRotation !== topViewRotation();
  const flag4 =
    isMode.focalLength !== null &&
    Math.abs(isMode.focalLength - getCameraFocalLength()) > 1e-8;
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
    preserveView: false,
  });
  const vector3 = new THREE.Vector3(
    isMode.target.x,
    isMode.target.y,
    isMode.target.z,
  );
  camera.position.set(
    isMode.position.x,
    isMode.position.y,
    isMode.position.z,
  );
  camera.up.copy(
    isMode.view === "top"
      ? topViewForwardVector(isMode.topRotation)
      : new THREE.Vector3(0, 1, 0),
  );
  camera.userData.frameSize = isMode.visibleHeight;
  camera.userData.cameraView = isMode.view;
  camera.userData.topRotation = isMode.topRotation;
  camera.userData.viewportAspect ||= Math.max(
    selectEl("#preview-3d").clientWidth /
      Math.max(selectEl("#preview-3d").clientHeight, 1),
    0.1,
  );
  camera.zoom = 1;
  if (camera.isPerspectiveCamera) {
    camera.aspect = camera.userData.viewportAspect;
    if (isMode.focalLength !== null) {
      applyCameraFocalLength(camera, isMode.focalLength);
    } else {
      camera.fov = isMode.fov;
      camera.updateProjectionMatrix();
      value.cameraFocalLength = clamp(camera.getFocalLength(), 18, 120);
    }
  } else {
    focusCameraOnPoint(
      isMode.visibleHeight,
      camera.userData.viewportAspect,
      camera,
    );
  }
  getCameraPose(camera, vector3);
  camera.lookAt(vector3);
  camera.updateProjectionMatrix();
  orbitControls.target.copy(vector3);
  syncOrbitControls();
  orbitControls.update();
  syncCameraModeButtons(isMode.mode);
  syncCameraViewButtons(isMode.view);
  if ((flag || flag2 || flag3 || flag4) && flag5) {
    scheduleSave();
  }
  if (!recordChange.silent) {
    const previewFloorMode =
      getPreviewFloorMode() === "all" ? "总览视角" : "当前层视角";
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function nudgeCamera(arg0, force = {}) {
  const arg02 = arg0 === "top" ? "top" : "free";
  const value = topViewRotation();
  syncCameraViewButtons(arg02);
  if (!camera || !orbitControls) {
    return;
  }
  if (
    camera.userData.cameraView === arg02 &&
    (arg02 !== "top" || camera.userData.topRotation === value) &&
    force.force !== true
  ) {
    syncOrbitControls();
    return;
  }
  if (arg02 === "free") {
    applyCameraView({
      view: "free",
    });
    return;
  }
  const point3 = orbitControls.target.clone();
  const resetOrbitTargetResult = resetOrbitTarget(camera, point3);
  const maxValue = Math.max(camera.position.distanceTo(point3), 8);
  camera.up.copy(topViewForwardVector(value));
  if (camera.isPerspectiveCamera) {
    applyCameraFocalLength();
    const degToRadResult = THREE.MathUtils.degToRad(camera.getEffectiveFOV());
    const maxValue2 = Math.max(resetOrbitTargetResult / (Math.tan(degToRadResult / 2) * 2), 8);
    camera.position.set(point3.x, point3.y + maxValue2, point3.z);
  } else {
    focusCameraOnPoint(resetOrbitTargetResult, camera.userData.viewportAspect || 1, camera);
    camera.position.set(point3.x, point3.y + maxValue, point3.z);
  }
  camera.userData.frameSize = resetOrbitTargetResult;
  camera.userData.cameraView = "top";
  camera.userData.topRotation = value;
  getCameraPose(camera, point3);
  camera.lookAt(point3);
  camera.updateProjectionMatrix();
  orbitControls.target.copy(point3);
  syncOrbitControls();
  orbitControls.update();
}
function setCameraProjectionMode(arg0, preserveView = {}) {
  const value =
    arg0 === "perspective" ? "perspective" : "orthographic";
  syncCameraModeButtons(value);
  if (!renderer) {
    return;
  }
  if ((value === "perspective") == !!camera?.isPerspectiveCamera) {
    applyCameraFocalLength();
    syncOrbitControls();
    return;
  }
  const flag = preserveView.preserveView !== false;
  const object3d = camera;
  const vector3 =
    orbitControls?.target.clone() || new THREE.Vector3(0, 0.6, 0);
  const list = object3d
    ? object3d.position.clone().sub(vector3)
    : new THREE.Vector3(1.12, 1.42, 1.2);
  const maxValue = Math.max(list.length(), 2);
  const vector32 =
    list.lengthSq() > 1e-8
      ? list.normalize()
      : new THREE.Vector3(1.12, 1.42, 1.2).normalize();
  const maxValue2 =
    object3d?.userData.viewportAspect ||
    Math.max(
      selectEl("#preview-3d").clientWidth /
        Math.max(selectEl("#preview-3d").clientHeight, 1),
      0.1,
    );
  const scpmV6 =
    flag && object3d
      ? resetOrbitTarget(object3d, vector3)
      : object3d?.userData.frameSize || 10;
  orbitControls?.dispose();
  if (value === "perspective") {
    camera = new THREE.PerspectiveCamera(36, maxValue2, 0.02, 200);
    applyCameraFocalLength(camera);
    const scpmV7 =
      scpmV6 /
      (Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV()) / 2) * 2);
    const scpmV8 = flag ? scpmV7 : maxValue;
    camera.position
      .copy(vector3)
      .addScaledVector(vector32, Math.max(scpmV8, 2));
  } else {
    camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.02, 200);
    camera.position.copy(vector3).addScaledVector(vector32, maxValue);
    focusCameraOnPoint(scpmV6, maxValue2, camera);
  }
  camera.layers.enable(HELPER_LAYER);
  camera.userData.viewportAspect = maxValue2;
  camera.userData.frameSize = scpmV6;
  camera.userData.cameraView = object3d?.userData.cameraView || "free";
  camera.userData.topRotation = object3d?.userData.topRotation || 0;
  camera.up.copy(object3d?.up || new THREE.Vector3(0, 1, 0));
  getCameraPose(camera, vector3);
  camera.lookAt(vector3);
  camera.updateProjectionMatrix();
  orbitControls = createOrbitControls(camera);
  orbitControls.target.copy(vector3);
  syncOrbitControls();
  if (!isStageEmbed || preserveView.deferControlUpdate !== true) {
    orbitControls.update();
  }
}
function initPreviewRenderer() {
  const value = selectEl("#preview-3d");
  try {
    previewScene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.05, 200);
    camera.layers.enable(HELPER_LAYER);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(computeStudioPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.04;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    value.append(renderer.domElement);
    ensurePerfHud();
    orbitControls = createOrbitControls(camera);
    updateModelLoadStatus();
    syncCameraModeButtons("orthographic");
    syncCameraViewButtons();
    hemisphereLight = new THREE.HemisphereLight(12504556, 1515053, 1.12);
    hemisphereLight.layers.enable(HELPER_LAYER);
    previewScene.add(hemisphereLight);
    ambientLight = new THREE.AmbientLight(7175581, 0.42);
    ambientLight.layers.enable(HELPER_LAYER);
    previewScene.add(ambientLight);
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
    previewScene.add(previewSpotLight);
    fillLight = new THREE.DirectionalLight(8886724, 0.72);
    fillLight.position.set(9, 7, -10);
    fillLight.layers.enable(HELPER_LAYER);
    previewScene.add(fillLight);
    topLight = new THREE.DirectionalLight(15791103, 0.68);
    topLight.position.set(0, 16, 1);
    topLight.layers.enable(HELPER_LAYER);
    previewScene.add(topLight);
    worldGroup = new THREE.Group();
    previewScene.add(worldGroup);
    shadowAtlas = createSpotShadowAtlasController({
      THREE: THREE,
      renderer: renderer,
      scene: previewScene,
      camera: camera,
      syncBeforeRender: isStageEmbed,
      requestFrame: updateLightPreview,
      canBuild: () =>
        !document.hidden &&
        !stageSession &&
        !previewOrbitLocked &&
        !isStageWarmup &&
        !isLeavingStudio &&
        !isBakingLightCache &&
        externalModels.modelLoadState().active === 0 &&
        externalModels.modelLoadState().queued === 0,
    });
    applyPreviewEnvironment();
    detailsPanelResizeObserver = new ResizeObserver(onPreviewContainerResize);
    detailsPanelResizeObserver.observe(value);
    applyCameraView();
    let nowResult = performance.now();
    let iprV3 = -Infinity;
    const handler = (param = performance.now()) => {
      if (!renderer) {
        return;
      }
      if (!isStageEmbed) {
        requestAnimationFrame(handler);
      }
      const maxValue = Math.min(
        Math.max((param - nowResult) / 1000, 0),
        0.05,
      );
      nowResult = param;
      if (document.hidden) {
        return Infinity;
      }
      const flag = orbitControls.update(maxValue);
      if (flag) {
        iprV3 = param;
      }
      const iprV6 = param - iprV3 < 600 ? 0 : Infinity;
      if (flag) {
        needsRenderFrame = true;
      }
      const iprV7 = previewOrbitLocked || flag || isStageWarmup;
      setPerfMotionActive(param, iprV7);
      if (!needsRenderFrame && renderIdle) {
        return iprV6;
      }
      needsRenderFrame = false;
      const beginGpuTimingQueryResult = beginGpuTimingQuery(iprV7);
      const iprV9 = isPerfDiagnosticsEnabled ? performance.now() : 0;
      renderer.render(previewScene, camera);
      const iprV10 = isPerfDiagnosticsEnabled
        ? performance.now() - iprV9
        : 0;
      endGpuTimingQuery(beginGpuTimingQueryResult);
      recordCpuFrameTiming(param, iprV10, iprV7);
      const render = renderer.info.render;
      renderer.domElement.dataset.renderCalls = String(render.calls);
      renderer.domElement.dataset.renderTriangles = String(
        render.triangles,
      );
      renderer.domElement.dataset.renderLines = String(render.lines);
      initRenderStatsHud();
      tickQualityProbe();
      renderIdle = true;
      if (isStageEmbed) {
        renderer.domElement.dispatchEvent(new Event("hb-i3d-camera-frame"));
      }
      return iprV6;
    };
    if (isStageEmbed) {
      demandFrameLoop = createDemandFrameLoop({
        onWake() {
          nowResult = performance.now();
        },
        step(param) {
          const fnResult = handler(param);
          renderer.domElement.dataset.renderFrameChecks = String(
            demandFrameLoop.stats.frames,
          );
          return fnResult;
        },
      });
      const onComplete = () => demandFrameLoop.wake();
      const onVisibilitychange = () => {
        nowResult = performance.now();
        const flag = !document.hidden && studioReady;
        demandFrameLoop.setAvailable(flag);
        if (flag) {
          updateLightPreview();
          if (previewQualityJustBecameReady) {
            scheduleAdaptiveQuality();
          }
        } else {
          window.clearTimeout(stageSessionEndTimer);
          stageSessionEndTimer = null;
        }
      };
      const onPointerRelease = (detail) => {
        studioReady = detail.detail === true;
        onVisibilitychange();
      };
      renderer.domElement.addEventListener(
        "hb-i3d-parent-visibility",
        onPointerRelease,
      );
      for (const entry of [
        "pointerdown",
        "pointermove",
        "pointerup",
        "pointercancel",
        "wheel",
        "keydown",
        "keyup",
      ]) {
        renderer.domElement.addEventListener(entry, onComplete, {
          passive: true,
        });
      }
      document.addEventListener("visibilitychange", onVisibilitychange);
      window.addEventListener(
        "pagehide",
        () => {
          demandFrameLoop.dispose();
          document.removeEventListener("visibilitychange", onVisibilitychange);
          shadowAtlas?.releaseRenderIndex();
          renderer.domElement.removeEventListener(
            "hb-i3d-parent-visibility",
            onPointerRelease,
          );
          for (const entry of [
            "pointerdown",
            "pointermove",
            "pointerup",
            "pointercancel",
            "wheel",
            "keydown",
            "keyup",
          ]) {
            renderer.domElement.removeEventListener(entry, onComplete);
          }
        },
        {
          once: true,
        },
      );
      onVisibilitychange();
      onComplete();
    } else {
      handler();
    }
  } catch (error) {
    selectEl("#webgl-message").hidden = false;
    window.HABridgeLog?.error(error, {
      phase: "studio-webgl-init",
    });
    console.error(error);
  }
}
function focusCameraOnPoint(arg0, arg1, left = camera) {
  if (!left?.isOrthographicCamera) {
    return;
  }
  const value = Math.max(arg0, 1) / 2;
  if (arg1 >= 1) {
    left.left = -value * arg1;
    left.right = value * arg1;
    left.top = value;
    left.bottom = -value;
  } else {
    left.left = -value;
    left.right = value;
    left.top = value / Math.max(arg1, 0.1);
    left.bottom = -value / Math.max(arg1, 0.1);
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
  const maxValue2 = Math.max(value.clientHeight, 1);
  const planPoint = isStageEmbed
    ? renderer.getSize(new THREE.Vector2())
    : null;
  const flag =
    planPoint?.x === maxValue && planPoint?.y === maxValue2;
  const opcrV4 = isStageEmbed
    ? camera.projectionMatrix.elements.join(",")
    : "";
  if (!flag) {
    renderer.setSize(maxValue, maxValue2, false);
  }
  camera.userData.viewportAspect = maxValue / maxValue2;
  if (camera.isOrthographicCamera) {
    focusCameraOnPoint(
      camera.userData.frameSize || 10,
      camera.userData.viewportAspect,
    );
  } else {
    camera.aspect = camera.userData.viewportAspect;
    applyCameraFocalLength();
  }
  if (
    !flag ||
    opcrV4 !== camera.projectionMatrix.elements.join(",")
  ) {
    requestRender();
  }
}
function serializeCameraState() {
  if (!camera || !orbitControls) {
    return null;
  } else {
    return {
      mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
      cameraView: camera.userData.cameraView || cameraViewMode(),
      topRotation: camera.userData.topRotation || 0,
      position: camera.position.clone(),
      target: orbitControls.target.clone(),
      up: camera.up.clone(),
      zoom: camera.zoom,
      visibleHeight: resetOrbitTarget(camera, orbitControls.target),
      frameSize:
        camera.userData.frameSize ||
        resetOrbitTarget(camera, orbitControls.target),
      viewportAspect: camera.userData.viewportAspect || 1,
      fov: camera.isPerspectiveCamera ? camera.fov : 36,
      near: camera.near,
      far: camera.far,
    };
  }
}
function setExportPresetFromUi(
  view,
  viewportAspect = view?.viewportAspect || 1,
) {
  if (!!view && !!renderer) {
    setCameraProjectionMode(view.mode, {
      preserveView: false,
    });
    camera.position.copy(view.position);
    camera.up.copy(view.up);
    camera.zoom = view.zoom || 1;
    camera.near = view.near;
    camera.far = view.far;
    camera.userData.frameSize = view.frameSize;
    camera.userData.viewportAspect = viewportAspect;
    camera.userData.cameraView = view.cameraView || cameraViewMode();
    camera.userData.topRotation = view.topRotation || 0;
    if (camera.isPerspectiveCamera) {
      camera.fov = view.fov;
      camera.aspect = viewportAspect;
    } else {
      focusCameraOnPoint(view.frameSize, viewportAspect, camera);
    }
    camera.lookAt(view.target);
    camera.updateProjectionMatrix();
    orbitControls.target.copy(view.target);
    syncOrbitControls();
    orbitControls.update();
  }
}
function readExportResolution() {
  return {
    width: Math.round(
      clamp(finite(exportWidth.value, defaultExportWidth), 320, 4096),
    ),
    height: Math.round(
      clamp(finite(exportHeight.value, defaultExportHeight), 320, 4096),
    ),
  };
}
function syncExportResolutionLabel() {
  const { width: width, height: height } = readExportResolution();
  exportResolutionLabel.textContent = width + " × " + height + " px";
  const value = ((arg0, arg1) => {
    while (arg1) {
      [arg0, arg1] = [arg1, arg0 % arg1];
    }
    return arg0;
  })(width, height);
  const serlV2 = width / value;
  const serlV3 = height / value;
  exportAspectLabel.textContent =
    serlV2 <= 32 && serlV3 <= 32
      ? serlV2 + " : " + serlV3
      : (width / height).toFixed(2) + " : 1";
  exportPreviewFrame.style.setProperty(
    "--export-aspect",
    String(width / height),
  );
}
function stageEmbedPixelRatio(flag = false) {
  const value = window.devicePixelRatio || 1;
  if (!isAutoDiagramEmbed || !exportPreviewStage) {
    return value;
  }
  const { width: width, height: height } = readExportResolution();
  const maxValue = Math.max(exportPreviewStage.clientWidth, 1);
  const maxValue2 = Math.max(exportPreviewStage.clientHeight, 1);
  const maxValue3 = Math.max(
    value,
    width / maxValue,
    height / maxValue2,
    1.5,
  );
  return Math.min(maxValue3, flag ? 2 : 4);
}
function resizeStageEmbedViewport() {
  if (!stageSession || orbitSuspended || !renderer || !camera) {
    return;
  }
  const { width: width, height: height } = readExportResolution();
  const arg1 = width / height;
  const value = Math.max(exportPreviewStage.clientWidth, 1);
  const maxValue = Math.max(exportPreviewStage.clientHeight, 1);
  const minValue = isAutoDiagramEmbed
    ? stageEmbedPixelRatio(false)
    : Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(minValue);
  renderer.setSize(value, maxValue, false);
  camera.userData.viewportAspect = arg1;
  if (camera.isOrthographicCamera) {
    focusCameraOnPoint(camera.userData.frameSize || 10, arg1, camera);
  } else {
    camera.aspect = arg1;
    applyCameraFocalLength();
  }
  orbitControls.update();
  requestRender();
}
function scheduleStageEmbedResize() {
  syncExportResolutionLabel();
  requestAnimationFrame(() => requestAnimationFrame(resizeStageEmbedViewport));
}
function onExportDimensionInput(arg0, flag = false) {
  const value = Number(
    (arg0 === "width" ? exportWidth : exportHeight).value,
  );
  if (!Number.isFinite(value) || value <= 0) {
    return;
  }
  let oediV2 =
    arg0 === "width" ? value : Number(exportWidth.value);
  let oediV3 =
    arg0 === "height" ? value : Number(exportHeight.value);
  oediV2 =
    Number.isFinite(oediV2) && oediV2 > 0
      ? oediV2
      : defaultExportWidth;
  oediV3 =
    Number.isFinite(oediV3) && oediV3 > 0
      ? oediV3
      : defaultExportHeight;
  if (exportLockRatio.checked) {
    if (arg0 === "width") {
      if (flag) {
        oediV2 = clamp(oediV2, 320, 4096);
        oediV3 = Math.round(oediV2 / exportAspectRatio);
        if (oediV3 < 320) {
          oediV3 = 320;
          oediV2 = Math.round(oediV3 * exportAspectRatio);
        }
        if (oediV3 > 4096) {
          oediV3 = 4096;
          oediV2 = Math.round(oediV3 * exportAspectRatio);
        }
      } else {
        oediV3 = Math.round(
          clamp(oediV2 / exportAspectRatio, 320, 4096),
        );
      }
    } else if (flag) {
      oediV3 = clamp(oediV3, 320, 4096);
      oediV2 = Math.round(oediV3 * exportAspectRatio);
      if (oediV2 < 320) {
        oediV2 = 320;
        oediV3 = Math.round(oediV2 / exportAspectRatio);
      }
      if (oediV2 > 4096) {
        oediV2 = 4096;
        oediV3 = Math.round(oediV2 / exportAspectRatio);
      }
    } else {
      oediV2 = Math.round(clamp(oediV3 * exportAspectRatio, 320, 4096));
    }
  }
  if (flag) {
    oediV2 = Math.round(clamp(oediV2, 320, 4096));
    oediV3 = Math.round(clamp(oediV3, 320, 4096));
    exportWidth.value = String(oediV2);
    exportHeight.value = String(oediV3);
  } else if (exportLockRatio.checked) {
    if (arg0 === "width") {
      exportHeight.value = String(oediV3);
    } else {
      exportWidth.value = String(oediV2);
    }
  }
  scheduleStageEmbedResize();
}
function applyStageFixedCameraView(silent = {}) {
  const isMode = activeFixedCameraView();
  if (!isMode || !stageSession) {
    return;
  }
  const viewportAspect =
    readExportResolution().width / readExportResolution().height;
  const value = activeCameraSettings();
  value.cameraMode = isMode.mode;
  value.cameraView = isMode.view;
  value.cameraTopRotation = isMode.topRotation;
  if (isMode.focalLength !== null) {
    value.cameraFocalLength = isMode.focalLength;
  }
  setExportPresetFromUi(
    {
      mode: isMode.mode,
      cameraView: isMode.view,
      topRotation: isMode.topRotation,
      position: new THREE.Vector3(
        isMode.position.x,
        isMode.position.y,
        isMode.position.z,
      ),
      target: new THREE.Vector3(
        isMode.target.x,
        isMode.target.y,
        isMode.target.z,
      ),
      up:
        isMode.view === "top"
          ? topViewForwardVector(isMode.topRotation)
          : new THREE.Vector3(0, 1, 0),
      zoom: 1,
      visibleHeight: isMode.visibleHeight,
      frameSize: isMode.visibleHeight,
      viewportAspect: viewportAspect,
      fov: isMode.fov,
      near: 0.02,
      far: Math.max(
        new THREE.Vector3(
          isMode.position.x,
          isMode.position.y,
          isMode.position.z,
        ).distanceTo(
          new THREE.Vector3(
            isMode.target.x,
            isMode.target.y,
            isMode.target.z,
          ),
        ) * (isMode.mode === "perspective" ? 8 : 5),
        100,
      ),
    },
    viewportAspect,
  );
  syncCameraModeButtons(isMode.mode);
  syncCameraViewButtons(isMode.view);
  if (!silent.silent) {
    const previewFloorMode =
      getPreviewFloorMode() === "all" ? "总览视角" : "当前层视角";
    exportStatus.textContent = "已恢复上次保存的" + previewFloorMode;
    showToast("已恢复上次保存的" + previewFloorMode + "。");
  }
}
function normalizeProjectExportPresets() {
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(
    projectDoc?.exportPresets,
  );
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    normalizeExportPresetSlots2.length,
  );
  projectDoc.exportPresets = normalizeExportPresetSlots2;
  projectDoc.activeExportPresetSlot = normalizeActiveExportPresetSlot2;
  const map = new Map(
    (projectDoc?.floors || []).map((floor) => [
      floor.id,
      floor.name,
    ]),
  );
  exportPresetSlots.replaceChildren(
    ...normalizeExportPresetSlots2.map((preset, arg1) => {
      const element = document.createElement("button");
      element.type = "button";
      element.dataset.exportPresetSlot = String(arg1);
      element.setAttribute("role", "tab");
      const el = document.createElement("strong");
      const el2 = document.createElement("small");
      el.textContent =
        preset?.name ||
        map.get(preset?.floorId) ||
        "未命名存档";
      el2.textContent = preset ? "已设置" : "未设置";
      const value = arg1 === normalizeActiveExportPresetSlot2;
      element.classList.toggle("active", value);
      element.classList.toggle("has-value", !!preset);
      element.setAttribute("aria-selected", String(value));
      element.title = preset
        ? el.textContent + "：已设置"
        : el.textContent + "：未设置";
      element.append(el, el2);
      return element;
    }),
  );
  const floor =
    normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2];
  exportPresetAdd.disabled =
    normalizeExportPresetSlots2.length >= MAX_EXPORT_PRESET_COUNT;
  exportPresetRename.disabled = !floor;
  exportPresetDelete.disabled = normalizeExportPresetSlots2.length <= 1;
  const flag = exportPresetIsEmpty(
    floor,
    exportPresetEditorOpen,
  );
  exportPresetEmptyState.hidden = !flag;
  exportPresetEmptyTitle.textContent = floor
    ? defaultExportPresetLabel(
        floor,
        normalizeActiveExportPresetSlot2,
      ) + "已设置"
    : "当前存档尚未设置";
}
function syncExportCameraFocalUi({ name: name = "" } = {}) {
  if (camera.isPerspectiveCamera) {
    const value = selectEl("#camera-focal-length");
    const clamp2 = clamp(
      finite(value?.value, getCameraFocalLength()),
      18,
      120,
    );
    activeCameraSettings().cameraFocalLength = clamp2;
    for (const entry of cameraFocalLengthEls) {
      entry.value = String(Math.round(clamp2));
    }
    applyCameraFocalLength(camera, clamp2);
  }
  const { width: width, height: height } = readExportResolution();
  const point3 = orbitControls.target;
  return normalizeExportPreset({
    name: name,
    width: width,
    height: height,
    lockRatio: exportLockRatio.checked,
    floorMode: getPreviewFloorMode() === "all" ? "all" : "floor",
    floorId: activeFloor()?.id || activeFloorId,
    floorGap: finite(projectDoc.exportFloorGap, 3),
    camera: {
      mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
      view: cameraViewMode(),
      topRotation: topViewRotation(),
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: {
        x: point3.x,
        y: point3.y,
        z: point3.z,
      },
      visibleHeight: resetOrbitTarget(camera, point3),
      fov: camera.isPerspectiveCamera ? camera.fov : 36,
      focalLength: camera.isPerspectiveCamera ? getCameraFocalLength() : null,
    },
    folderName: exportFolderName.value,
    selectedFiles: [...checkedExportFileKeys()],
  });
}
function fitExportCameraAspect(camera2) {
  const viewportAspect =
    readExportResolution().width / readExportResolution().height;
  const value = activeCameraSettings();
  value.cameraMode = camera2.mode;
  value.cameraView = camera2.view;
  value.cameraTopRotation = camera2.topRotation;
  if (camera2.focalLength !== null) {
    value.cameraFocalLength = camera2.focalLength;
  }
  const position = new THREE.Vector3(
    camera2.position.x,
    camera2.position.y,
    camera2.position.z,
  );
  const target = new THREE.Vector3(
    camera2.target.x,
    camera2.target.y,
    camera2.target.z,
  );
  setExportPresetFromUi(
    {
      mode: camera2.mode,
      cameraView: camera2.view,
      topRotation: camera2.topRotation,
      position: position,
      target: target,
      up:
        camera2.view === "top"
          ? topViewForwardVector(camera2.topRotation)
          : new THREE.Vector3(0, 1, 0),
      zoom: 1,
      visibleHeight: camera2.visibleHeight,
      frameSize: camera2.visibleHeight,
      viewportAspect: viewportAspect,
      fov: camera2.fov,
      near: 0.02,
      far: Math.max(
        position.distanceTo(target) *
          (camera2.mode === "perspective" ? 8 : 5),
        100,
      ),
    },
    viewportAspect,
  );
  syncCameraModeButtons(camera2.mode);
  syncCameraViewButtons(camera2.view);
}
function activateExportPresetSlot(arg0, silent = {}) {
  const isWidth = normalizeExportPreset(
    projectDoc?.exportPresets?.[arg0],
  );
  if (!isWidth || !stageSession) {
    return false;
  }
  exportWidth.value = String(isWidth.width);
  exportHeight.value = String(isWidth.height);
  exportLockRatio.checked = isWidth.lockRatio;
  exportAspectRatio =
    isWidth.width / isWidth.height;
  projectDoc.exportFloorGap = isWidth.floorGap;
  const id = projectDoc.floors.find(
    (item) => item.id === isWidth.floorId,
  );
  const arg02 =
    isWidth.floorMode === "all" &&
    projectDoc.floors.length > 1
      ? "all"
      : id?.id || activeFloor()?.id || activeFloorId;
  setExportFloorScope(arg02);
  exportFloorGap2.value = isWidth.floorGap.toFixed(1);
  exportFolderName.value = isWidth.folderName;
  const value = new Set(isWidth.selectedFiles);
  const flag = value.has("televisionOn");
  const flag2 = value.has("vehicleCharging");
  for (const el of exportDialog.querySelectorAll(
    "input[data-export-file]",
  )) {
    const exportFile = el.dataset.exportFile;
    el.checked =
      value.has(exportFile) ||
      (flag && exportFile.startsWith("screen:")) ||
      (flag2 && exportFile.startsWith("vehicle:"));
  }
  fitExportCameraAspect(isWidth.camera);
  syncExportResolutionLabel();
  syncFloorCameraChrome();
  if (!silent.silent) {
    exportStatus.textContent =
      "已切换到档位 " + String(arg0 + 1).padStart(2, "0");
    showToast(
      "已应用导出档位 " + String(arg0 + 1).padStart(2, "0") + "。",
      "success",
    );
  }
  scheduleStageEmbedResize();
  return true;
}
function selectExportPresetIndex(arg0) {
  const value = projectDoc?.exportPresets?.length || 0;
  if (
    !Number.isInteger(arg0) ||
    arg0 < 0 ||
    arg0 >= value ||
    orbitSuspended
  ) {
    return;
  }
  flushExportUiDebounce();
  projectDoc.activeExportPresetSlot = arg0;
  const flag = activateExportPresetSlot(arg0);
  exportPresetEditorOpen = false;
  normalizeProjectExportPresets();
  scheduleSave();
  if (!flag) {
    exportStatus.textContent =
      "存档 " + String(arg0 + 1).padStart(2, "0") + " 没有设置";
  }
}
function flushExportUiDebounce() {
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = null;
  if (!exportPresetEditorOpen) {
    return false;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    projectDoc?.exportPresets?.length,
  );
  if (!stageSession || orbitSuspended) {
    return false;
  }
  projectDoc.exportPresets = normalizeExportPresetSlots(
    projectDoc.exportPresets,
  );
  const name =
    projectDoc.exportPresets[normalizeActiveExportPresetSlot2]?.name || "";
  projectDoc.exportPresets[normalizeActiveExportPresetSlot2] =
    syncExportCameraFocalUi({
      name: name,
    });
  exportPresetEditorOpen = false;
  normalizeProjectExportPresets();
  scheduleSave();
  return true;
}
function openExportPresetEditor() {
  if (!!stageSession && !orbitSuspended) {
    exportPresetEditorOpen = true;
    normalizeProjectExportPresets();
    window.clearTimeout(exportUiDebounceTimer);
    exportUiDebounceTimer = window.setTimeout(flushExportUiDebounce, 360);
  }
}
function defaultExportPresetLabel(floor, arg1) {
  if (!floor) {
    return "存档 " + String(arg1 + 1).padStart(2, "0");
  }
  const flag = (projectDoc?.floors || []).find(
    (item) => item.id === floor.floorId,
  )?.name;
  return (
    floor.name ||
    flag ||
    "存档 " + String(arg1 + 1).padStart(2, "0")
  );
}
function renameExportPresetSlot(arg0, arg1 = -1) {
  const normalizeLabelText2 = normalizeLabelText(
    arg0,
    "导出视角",
    24,
  );
  const value = new Set(
    (projectDoc?.exportPresets || [])
      .map((floor, param) =>
        param === arg1
          ? ""
          : defaultExportPresetLabel(floor, param),
      )
      .filter(Boolean),
  );
  if (!value.has(normalizeLabelText2)) {
    return normalizeLabelText2;
  }
  let nameSuffix = 2;
  while (value.has(normalizeLabelText2 + " " + nameSuffix)) {
    nameSuffix += 1;
  }
  return (normalizeLabelText2 + " " + nameSuffix).slice(0, 24);
}
function syncExportPresetEditor() {
  if (!stageSession || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDoc.exportPresets = normalizeExportPresetSlots(
    projectDoc.exportPresets,
  );
  if (projectDoc.exportPresets.length >= MAX_EXPORT_PRESET_COUNT) {
    showToast("最多可以保存 8 个导出存档。");
    return;
  }
  const length = projectDoc.exportPresets.length;
  const value =
    getPreviewFloorMode() === "all"
      ? "全楼"
      : activeFloor()?.name || "存档 " + (length + 1);
  const name = renameExportPresetSlot(value + "视角");
  const size = projectDoc.exportPresets
    .slice(0, length)
    .reverse()
    .find(Boolean);
  const syncExportCameraFocalUiResult = syncExportCameraFocalUi({
    name: name,
  });
  if (size) {
    syncExportCameraFocalUiResult.width = size.width;
    syncExportCameraFocalUiResult.height = size.height;
    syncExportCameraFocalUiResult.lockRatio = size.lockRatio;
  }
  projectDoc.exportPresets.push(syncExportCameraFocalUiResult);
  projectDoc.activeExportPresetSlot = length;
  exportPresetEditorOpen = false;
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
function beginExportPresetRename() {
  if (orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(
    projectDoc?.exportPresets,
  );
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    normalizeExportPresetSlots2.length,
  );
  if (normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2]) {
    exportPresetRenameInput.value = defaultExportPresetLabel(
      normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2],
      normalizeActiveExportPresetSlot2,
    );
    exportPresetRenameDialog.showModal();
    requestAnimationFrame(() => exportPresetRenameInput.select());
  }
}
function closeExportPresetDeleteDialog() {
  if (exportPresetDeleteDialog.open) {
    exportPresetDeleteDialog.close();
  }
}
function beginExportPresetDelete() {
  if (orbitSuspended) {
    return;
  }
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(
    projectDoc?.exportPresets,
  );
  if (normalizeExportPresetSlots2.length <= 1) {
    return;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    normalizeExportPresetSlots2.length,
  );
  exportPresetDeleteName.textContent = defaultExportPresetLabel(
    normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2],
    normalizeActiveExportPresetSlot2,
  );
  exportPresetDeleteDialog.showModal();
}
function confirmExportPresetDelete() {
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(
    projectDoc?.exportPresets,
  );
  if (normalizeExportPresetSlots2.length <= 1) {
    return;
  }
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    normalizeExportPresetSlots2.length,
  );
  const value = defaultExportPresetLabel(
    normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2],
    normalizeActiveExportPresetSlot2,
  );
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = null;
  exportPresetEditorOpen = false;
  normalizeExportPresetSlots2.splice(
    normalizeActiveExportPresetSlot2,
    1,
  );
  projectDoc.exportPresets = normalizeExportPresetSlots2;
  projectDoc.activeExportPresetSlot = Math.min(
    normalizeActiveExportPresetSlot2,
    normalizeExportPresetSlots2.length - 1,
  );
  closeExportPresetDeleteDialog();
  const flag = activateExportPresetSlot(projectDoc.activeExportPresetSlot, {
    silent: true,
  });
  normalizeProjectExportPresets();
  scheduleSave();
  exportStatus.textContent = flag ? "已切换到相邻存档" : "当前存档尚未设置";
  showToast("已删除“" + value + "”，楼层和户型未受影响。", "success");
}
function postAutoDiagramMessage(arg0 = 0) {
  if (
    !!isAutoDiagramEmbed &&
    !!autoDiagramComponentId &&
    window.parent !== window
  ) {
    requestAnimationFrame(() => {
      if (
        !stageSession ||
        !renderer ||
        !previewScene ||
        !camera ||
        !orbitControls
      ) {
        return;
      }
      resizeStageEmbedViewport();
      if (!worldGroup?.children?.length) {
        rebuildWorldPreview();
      }
      const flag =
        exportPreviewStage.clientWidth > 1 &&
        exportPreviewStage.clientHeight > 1;
      const flag2 = !!worldGroup?.children?.length;
      let flag3 = false;
      if (flag && flag2) {
        requestRender({
          shadows: true,
        });
        orbitControls.update();
        for (let value = 0; value < 2; value += 1) {
          renderer.render(previewScene, camera);
        }
        const render = renderer.info.render;
        flag3 = render.calls > 0 && render.triangles > 0;
        renderer.domElement.dataset.renderCalls = String(render.calls);
        renderer.domElement.dataset.renderTriangles = String(
          render.triangles,
        );
        renderer.domElement.dataset.renderLines = String(render.lines);
        needsRenderFrame = false;
        renderIdle = flag3;
        initRenderStatsHud();
      }
      if (!flag3 && arg0 < 7) {
        postAutoDiagramMessage(arg0 + 1);
        return;
      }
      if (!flag3) {
        window.parent.postMessage(
          {
            type: "ha-bridge-floorplan-auto-diagram-error",
            componentId: autoDiagramComponentId,
            message: "3D户型首帧渲染失败，请刷新后重试。",
          },
          window.location.origin,
        );
        return;
      }
      window.parent.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-ready",
          componentId: autoDiagramComponentId,
          floors: projectDoc.floors.map((id) => ({
            id: id.id,
            name: id.name,
          })),
          floorSelection:
            getPreviewFloorMode() === "all"
              ? "all"
              : activeFloor()?.id || activeFloorId,
        },
        window.location.origin,
      );
    });
  }
}
function scheduleOrbitResumeAfterModels() {
  if (stageSession || !renderer || !camera || !orbitControls) {
    return;
  }
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = null;
  exportPresetEditorOpen = false;
  const list = collectLightGroupsAcrossFloors();
  const list2 = collectTvsAcrossFloors();
  const list3 = collectSmallCarsAcrossFloors();
  stageSession = {
    canvasParent: renderer.domElement.parentElement,
    camera: serializeCameraState(),
    selected: selection
      ? {
          ...selection,
        }
      : null,
    selectedMany: multiSelection.map((arg0) => ({
      ...arg0,
    })),
    floorMode: getPreviewFloorMode(),
    selectedFloorId: activeFloorId,
    floorCameraSettings: new Map(
      projectDoc.floors.map((floor) => [
        floor.id,
        {
          mode: floor.scene.settings.cameraMode,
          view: floor.scene.settings.cameraView,
          topRotation: floor.scene.settings.cameraTopRotation,
          focalLength: floor.scene.settings.cameraFocalLength,
        },
      ]),
    ),
    combinedCameraSettings: {
      ...projectDoc.combinedCameraSettings,
    },
    groupStates: new Map(
      list.map(({ key: key, group: group }) => [
        key,
        group.enabled,
      ]),
    ),
    tvStates: new Map(
      list2.map(({ key: key, item: item }) => [
        key,
        item.screenEnabled !== false,
      ]),
    ),
    carChargingStates: new Map(
      list3.map(({ key: key, item: item }) => [
        key,
        item.chargingEnabled === true,
      ]),
    ),
    cameraSettings: {
      mode: getCameraProjectionMode(),
      view: cameraViewMode(),
      topRotation: topViewRotation(),
      focalLength: getCameraFocalLength(),
    },
    pixelRatio: renderer.getPixelRatio(),
  };
  shadowAtlas?.setEnabled(false);
  for (const { group: group } of list) {
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
  if (isAutoDiagramEmbed) {
    document.body.classList.add("auto-diagram-embedded");
    const value = new URLSearchParams(window.location.search);
    const clamp2 = clamp(
      finite(
        value.get("dashboard-width"),
        finite(value.get("component-width"), exportWidth.value),
      ),
      320,
      4096,
    );
    const clamp3 = clamp(
      finite(
        value.get("dashboard-height"),
        finite(
          value.get("component-height"),
          exportHeight.value,
        ),
      ),
      320,
      4096,
    );
    exportWidth.value = String(Math.round(clamp2));
    exportHeight.value = String(Math.round(clamp3));
    exportLockRatio.checked = true;
    if (exportFolderQuery) {
      exportFolderName.value = exportFolderQuery;
    }
    syncExportResolutionLabel();
  }
  exportDialog.showModal();
  exportPreviewStage.append(renderer.domElement);
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc.activeExportPresetSlot,
    projectDoc.exportPresets.length,
  );
  const flag =
    normalizeActiveExportPresetSlot2 !== null &&
    activateExportPresetSlot(normalizeActiveExportPresetSlot2, {
      silent: true,
    });
  if (isAutoDiagramEmbed && floorSelectionQuery !== null) {
    const id = projectDoc.floors.find(
      (item) => item.id === floorSelectionQuery,
    );
    const value =
      floorSelectionQuery === "all" && projectDoc.floors.length > 1
        ? "all"
        : id?.id || activeFloor()?.id || activeFloorId;
    setExportFloorScope(value);
  }
  if (!flag) {
    rebuildWorldPreview();
    if (activeFixedCameraView()) {
      applyStageFixedCameraView({
        silent: true,
      });
    } else if (isAutoDiagramEmbed) {
      setCameraProjectionMode(getCameraProjectionMode(), {
        preserveView: false,
      });
      applyCameraView();
    }
  }
  exportAspectRatio =
    readExportResolution().width / readExportResolution().height;
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
  const handler = (arg0, arg1, arg2) => {
    const append = document.createElement("li");
    const append2 = document.createElement("label");
    const button = document.createElement("input");
    button.type = "checkbox";
    button.checked = true;
    button.dataset.exportFile = arg0;
    const el = document.createElement("span");
    el.textContent = arg1;
    const el2 = document.createElement("small");
    el2.textContent = arg2;
    append2.append(button, el);
    append.append(append2, el2);
    list2.push(append);
  };
  collectTvsAcrossFloors(list).forEach(
    ({
      floor: floor,
      item: item,
      index: index,
      key: key,
    }) => {
      const flag =
        "" +
        (list.length > 1 ? floor.name + "-" : "") +
        (item.screenLayerName || "电视画面 " + (index + 1));
      handler(
        "screen:" + key,
        sanitizeExportFileName(flag, "电视画面-" + (index + 1)) +
          "." +
          EXPORT_IMAGE_EXTENSION,
        "该电视的独立开启透明层",
      );
    },
  );
  collectSmallCarsAcrossFloors(list).forEach(
    ({
      floor: floor,
      item: item,
      index: index,
      key: key,
    }) => {
      const flag =
        "" +
        (list.length > 1 ? floor.name + "-" : "") +
        (item.chargingLayerName || "汽车充电 " + (index + 1));
      handler(
        "vehicle:" + key,
        sanitizeExportFileName(flag, "汽车充电-" + (index + 1)) +
          "." +
          EXPORT_IMAGE_EXTENSION,
        "该汽车的独立充电光效层",
      );
    },
  );
  collectLightGroupsAcrossFloors(list).forEach(
    ({
      floor: floor,
      group: group,
      index: index,
      key: key,
    }) => {
      const flag =
        "" +
        (list.length > 1 ? floor.name + "-" : "") +
        (group.name || "灯组-" + (index + 1));
      handler(
        "group:" + key,
        sanitizeExportFileName(flag, "灯组-" + (index + 1)) +
          "." +
          EXPORT_IMAGE_EXTENSION,
        "该灯组的透明光效层",
      );
    },
  );
  exportGroupFiles.replaceChildren(...list2);
}
function currentExportFloorScope() {
  const flag = getPreviewFloorMode() === "all";
  const value = flag ? "all" : activeFloor()?.id || activeFloorId;
  exportFloorSelect.replaceChildren(
    ...projectDoc.floors.map((id) => {
      const el = document.createElement("option");
      el.value = id.id;
      el.textContent = id.name;
      return el;
    }),
    ...(projectDoc.floors.length > 1
      ? [
          Object.assign(document.createElement("option"), {
            value: "all",
            textContent: "全楼合并",
          }),
        ]
      : []),
  );
  exportFloorSelect.value = value;
  syncStudioSelect(exportFloorSelect);
  exportFloorGapControl.hidden = !flag || projectDoc.floors.length <= 1;
  syncControlValue(
    exportFloorGap2,
    finite(projectDoc.exportFloorGap, 3).toFixed(1),
  );
  syncFloorCameraChrome();
}
function setExportFloorScope(arg0) {
  if (!stageSession || orbitSuspended) {
    return;
  }
  const flag = arg0 === "all" && projectDoc.floors.length > 1;
  if (!flag) {
    const id = projectDoc.floors.find(
      (item) => item.id === arg0,
    );
    if (!id) {
      return;
    }
    stageSession.selectedFloorId = id.id;
    floorScene = id.scene;
  }
  projectDoc.previewFloorMode = flag ? "all" : "active";
  currentExportFloorScope();
  syncPreviewFloorButtons();
  syncFloorCameraChrome();
  rebuildWorldPreview();
  if (activeFixedCameraView()) {
    applyStageFixedCameraView({
      silent: true,
    });
  } else {
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false,
    });
    applyCameraView();
  }
  renderExportFileChecklist();
  exportStatus.textContent =
    getPreviewFloorMode() === "all"
      ? "正在构图：全楼合并"
      : "正在构图：" + (activeFloor()?.name || "当前层");
  scheduleStageEmbedResize();
}
function checkedExportFileKeys() {
  return new Set(
    [...exportDialog.querySelectorAll("input[data-export-file]:checked")].map(
      (el) => el.dataset.exportFile,
    ),
  );
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
  for (const floor of projectDoc.floors) {
    const floorCameraSetting = cameraSettings.floorCameraSettings.get(
      floor.id,
    );
    if (floorCameraSetting) {
      floor.scene.settings.cameraMode = floorCameraSetting.mode;
      floor.scene.settings.cameraView = floorCameraSetting.view;
      floor.scene.settings.cameraTopRotation = floorCameraSetting.topRotation;
      floor.scene.settings.cameraFocalLength = floorCameraSetting.focalLength;
    }
  }
  projectDoc.combinedCameraSettings = {
    ...cameraSettings.combinedCameraSettings,
  };
  stageSession = null;
  projectDoc.previewFloorMode = cameraSettings.floorMode;
  floorScene =
    projectDoc.floors.find((item) => item.id === activeFloorId)
      ?.scene || projectDoc.floors[0].scene;
  cameraSettings.canvasParent?.append(renderer.domElement);
  const value = activeCameraSettings();
  value.cameraMode = cameraSettings.cameraSettings.mode;
  value.cameraView = cameraSettings.cameraSettings.view;
  value.cameraTopRotation = cameraSettings.cameraSettings.topRotation;
  value.cameraFocalLength = cameraSettings.cameraSettings.focalLength;
  setExportPresetFromUi(
    cameraSettings.camera,
    cameraSettings.camera.viewportAspect,
  );
  syncCameraModeButtons(cameraSettings.cameraSettings.mode);
  syncCameraViewButtons(cameraSettings.cameraSettings.view);
  selection = cameraSettings.selected;
  multiSelection = cameraSettings.selectedMany;
  for (const {
    key: key,
    group: group,
  } of collectLightGroupsAcrossFloors()) {
    if (cameraSettings.groupStates.has(key)) {
      group.enabled = cameraSettings.groupStates.get(key);
    }
  }
  for (const { key: key, item: item } of collectTvsAcrossFloors()) {
    if (cameraSettings.tvStates.has(key)) {
      item.screenEnabled = cameraSettings.tvStates.get(key);
    }
  }
  for (const {
    key: key,
    item: item,
  } of collectSmallCarsAcrossFloors()) {
    if (cameraSettings.carChargingStates.has(key)) {
      item.chargingEnabled =
        cameraSettings.carChargingStates.get(key);
    }
  }
  renderer.setPixelRatio(cameraSettings.pixelRatio);
  rebuildWorldPreview();
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
    if (
      id.id !== "export-close" &&
      id.id !== "export-package"
    ) {
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
    renderer.render(previewScene, camera);
  }
}
function canvasToBlob(blob) {
  return new Promise((arg0, arg1) => {
    blob.toBlob(
      (flag) => {
        if (flag) {
          arg0(flag);
        } else {
          arg1(new Error("无法生成导出图像。"));
        }
      },
      EXPORT_IMAGE_MIME_TYPE,
      EXPORT_IMAGE_QUALITY,
    );
  });
}
async function capturePreviewCanvas(
  arg0,
  arg1,
  pixels = {},
) {
  forceTripleRender();
  const blob = document.createElement("canvas");
  blob.width = arg0;
  blob.height = arg1;
  const isDrawImage = blob.getContext("2d", {
    willReadFrequently: pixels.pixels === true,
  });
  if (!isDrawImage) {
    throw new Error("当前浏览器无法创建导出画布。");
  }
  isDrawImage.drawImage(
    renderer.domElement,
    0,
    0,
    arg0,
    arg1,
  );
  const imageData = {};
  if (pixels.pixels) {
    imageData.imageData = isDrawImage.getImageData(
      0,
      0,
      arg0,
      arg1,
    );
  }
  if (pixels.blob) {
    imageData.blob = await canvasToBlob(blob);
  }
  return imageData;
}
async function composeExportCanvas(size, data) {
  const blob = document.createElement("canvas");
  blob.width = size.width;
  blob.height = size.height;
  const isPutImageData = blob.getContext("2d");
  if (!isPutImageData) {
    throw new Error("当前浏览器无法创建透明灯光层。");
  }
  const buildLightDeltaPixels2 = buildLightDeltaPixels(
    size.data,
    data.data,
  );
  isPutImageData.putImageData(
    new ImageData(
      buildLightDeltaPixels2,
      size.width,
      size.height,
    ),
    0,
    0,
  );
  return canvasToBlob(blob);
}
async function drawExportAnnotations(
  data,
  lights,
  arg2,
  value,
  arg4,
  arg5,
) {
  const blob = document.createElement("canvas");
  blob.width = arg2;
  blob.height = value;
  const isDrawImage = blob.getContext("2d");
  const el = document.createElement("canvas");
  el.width = arg2;
  el.height = value;
  const isClearRect = el.getContext("2d");
  if (!isDrawImage || !isClearRect) {
    throw new Error("当前浏览器无法合成逐灯阴影。");
  }
  const list = lights.lights.filter(
    (lightBrightness) =>
      finite(lightBrightness.lightBrightness, 0) > 0,
  );
  try {
    for (
      let count = 0;
      count < list.length;
      count += 1
    ) {
      const id = list[count];
      exportStatus.textContent =
        "正在渲染灯组 " +
        (arg4 + 1) +
        "/" +
        arg5 +
        "：" +
        lights.name +
        "（" +
        (count + 1) +
        "/" +
        list.length +
        "）";
      forcedVisibleLightGroupIds = new Set([id.id]);
      if (getPreviewFloorMode() === "all") {
        rebuildWorldPreview({
          preserveLightCache: true,
        });
      } else {
        rebuildPreviewLightMeshes({
          preserveLightCache: true,
        });
      }
      const imageData = await capturePreviewCanvas(
        arg2,
        value,
        {
          pixels: true,
        },
      );
      const buildLightDeltaPixels2 = buildLightDeltaPixels(
        data.data,
        imageData.imageData.data,
      );
      isClearRect.clearRect(0, 0, arg2, value);
      isClearRect.putImageData(
        new ImageData(buildLightDeltaPixels2, arg2, value),
        0,
        0,
      );
      isDrawImage.drawImage(el, 0, 0);
      await yieldToScheduler();
    }
  } finally {
    forcedVisibleLightGroupIds = null;
  }
  return canvasToBlob(blob);
}
async function buildExportImageCanvas(
  arg0,
  arg1,
  flag = null,
) {
  const blob = document.createElement("canvas");
  blob.width = arg0;
  blob.height = arg1;
  const canvasCtx = blob.getContext("2d");
  if (!canvasCtx) {
    throw new Error("当前浏览器无法创建导出底图。");
  }
  canvasCtx.fillStyle =
    "#" + resolvedThemeColors().background.toString(16).padStart(6, "0");
  canvasCtx.fillRect(0, 0, arg0, arg1);
  if (flag) {
    const el = document.createElement("canvas");
    el.width = arg0;
    el.height = arg1;
    const isPutImageData = el.getContext("2d");
    if (!isPutImageData) {
      throw new Error("当前浏览器无法合成户型底图。");
    }
    isPutImageData.putImageData(flag, 0, 0);
    canvasCtx.drawImage(el, 0, 0);
  }
  return canvasToBlob(blob);
}
function sanitizeExportFileName(flag, flag2) {
  return (
    String(flag || "")
      .normalize("NFKC")
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || flag2
  );
}
function uniqueExportFileName(
  flag,
  arg1,
  idSet,
  arg3 = EXPORT_IMAGE_EXTENSION,
) {
  const value = sanitizeExportFileName(
    flag,
    "灯组-" + (arg1 + 1),
  );
  const string = String(arg3).replace(/^\./, "");
  let uefnV3 = 1;
  let toLocaleLowerCase = value + "." + string;
  while (idSet.has(toLocaleLowerCase.toLocaleLowerCase())) {
    uefnV3 += 1;
    toLocaleLowerCase = value + "-" + uefnV3 + "." + string;
  }
  idSet.add(toLocaleLowerCase.toLocaleLowerCase());
  return toLocaleLowerCase;
}
function captureCameraPoseForExport(arg0, arg1) {
  const point3 = orbitControls.target;
  return {
    mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: point3.x,
      y: point3.y,
      z: point3.z,
    },
    aspect: arg0 / arg1,
    visibleHeight: resetOrbitTarget(camera, point3),
    fov: camera.isPerspectiveCamera ? camera.fov : null,
  };
}
function serializeLightForStage(item, id = activeFloor()) {
  const value = id?.scene?.calibration?.pixelsPerMeter || 1;
  return {
    id: item.id,
    floorId: id?.id || null,
    type: item.type,
    position: {
      x: item.x / value,
      z: item.y / value,
      elevation: floorStackOffsetY(id) + (item.elevation || 0),
    },
    rotation: item.rotation || 0,
    verticalRotation: item.verticalRotation || 0,
    stripRollRotation:
      (item.type === "striplight" && item.stripRollRotation) || 0,
    size: {
      width: item.width,
      depth: item.depth,
    },
    temperature: item.lightTemperature,
    brightness: item.lightBrightness,
    range: item.lightRange,
    angle: item.lightAngle,
  };
}
function projectItemToScreenNorm(
  planPoint,
  floor,
  arg2 = previewFloorEntries(),
) {
  if (!planPoint || !floor || !camera) {
    return null;
  }
  const value = floor.scene?.calibration?.pixelsPerMeter || 1;
  let count = 0;
  let maxValue =
    Math.max(0, finite(planPoint.elevation, 0)) +
    Math.max(0.02, finite(planPoint.height, 0.1)) / 2;
  let count2 = 0;
  if (getPreviewFloorMode() === "all") {
    const pitsV5 =
      (finite(planPoint.x, 0) - finite(floor.originX, 0)) / value;
    const pitsV6 =
      (finite(planPoint.y, 0) - finite(floor.originY, 0)) / value;
    const pitsV7 = -THREE.MathUtils.degToRad(
      finite(floor.rotation, 0),
    );
    count =
      pitsV5 * Math.cos(pitsV7) +
      pitsV6 * Math.sin(pitsV7) +
      finite(floor.offsetX, 0);
    count2 =
      -pitsV5 * Math.sin(pitsV7) +
      pitsV6 * Math.cos(pitsV7) +
      finite(floor.offsetZ, 0);
    const findIndex = [...arg2].sort(
      (elevation, elevation2) =>
        elevation.elevation - elevation2.elevation,
    );
    const targetIndex = Math.max(
      0,
      findIndex.findIndex(
        (item) => item.id === floor.id,
      ),
    );
    maxValue += targetIndex * finite(projectDoc.exportFloorGap, 3);
  } else {
    const scene = floor.scene;
    const minX = scene.walls?.length
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
    count =
      (finite(planPoint.x, 0) - (minX.minX + minX.maxX) / 2) /
      value;
    count2 =
      (finite(planPoint.y, 0) - (minX.minY + minX.maxY) / 2) /
      value;
  }
  camera.updateMatrixWorld(true);
  const point3 = new THREE.Vector3(
    count,
    maxValue,
    count2,
  ).project(camera);
  if (
    ![point3.x, point3.y, point3.z].every(Number.isFinite) ||
    point3.z < -1 ||
    point3.z > 1
  ) {
    return null;
  } else {
    return {
      x: clamp((point3.x + 1) / 2, 0, 1),
      y: clamp((1 - point3.y) / 2, 0, 1),
    };
  }
}
function firstProjectedItemScreenPos(
  flag,
  floor,
  arg2 = previewFloorEntries(),
) {
  for (const planPoint of flag || []) {
    const flag2 = projectItemToScreenNorm(planPoint, floor, arg2);
    if (flag2) {
      return flag2;
    }
  }
  return null;
}
async function readFileAsUint8Array(arrayBuffer) {
  return new Uint8Array(await arrayBuffer.arrayBuffer());
}
function buildExportLightLayerIndex(
  arg0 = "",
  arg1 = "",
  arg2 = "",
) {
  for (const {
    key: key,
    group: group,
  } of collectLightGroupsAcrossFloors()) {
    group.enabled = arg0 === "*" || key === arg0;
  }
  for (const { key: key, item: item } of collectTvsAcrossFloors()) {
    item.screenEnabled = arg1 === "*" || key === arg1;
  }
  for (const {
    key: key,
    item: item,
  } of collectSmallCarsAcrossFloors()) {
    item.chargingEnabled = arg2 === "*" || key === arg2;
  }
  rebuildWorldPreview();
}
function setExportRoleVisibility(arg0, arg1) {
  if (worldGroup) {
    worldGroup.traverse((object3d) => {
      if (object3d.userData?.exportRole === arg0) {
        object3d.visible = arg1;
      }
    });
    requestRender({
      shadows: arg0 === "plan",
    });
  }
}
function resolveExportOverwrite(arg0 = "cancel") {
  const value = exportOverwriteResolver;
  exportOverwriteResolver = null;
  if (exportOverwriteDialog.open) {
    exportOverwriteDialog.close();
  }
  value?.(arg0);
}
function promptExportOverwrite(arg0) {
  if (exportOverwriteResolver) {
    resolveExportOverwrite("cancel");
  }
  exportOverwriteName.textContent = arg0;
  exportOverwriteDialog.showModal();
  return new Promise((arg02) => {
    exportOverwriteResolver = arg02;
  });
}
function notifyAutoDiagramExport(reason, message) {
  if (
    !!isAutoDiagramEmbed &&
    !!autoDiagramComponentId &&
    window.parent !== window
  ) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-stopped",
        componentId: autoDiagramComponentId,
        reason: reason,
        message: message,
      },
      window.location.origin,
    );
  }
}
function showExportCompleteDialog(overwritten) {
  const flag = overwritten?.overwritten === true;
  exportCompleteTitle.textContent = flag
    ? "导图覆盖完成"
    : "导图保存完成";
  exportCompleteMessage.textContent = flag
    ? "新导图已经安全替换原文件夹，已有仪表盘中的同名图片会自动更新。"
    : "导出的图片和数据已经保存到 NAS，可以在编辑器素材中继续使用。";
  exportCompletePath.textContent =
    "data/" + (overwritten?.relativePath || "exports");
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
  if (
    !exportName ||
    /[<>:\"/\\|?*\x00-\x1f\x7f]/.test(exportName) ||
    exportName.startsWith(".") ||
    /[. ]$/.test(exportName)
  ) {
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
  const { width: width, height: height } = scaledExportResolution(
    sourceResolution.width,
    sourceResolution.height,
    EXPORT_RENDER_SCALE,
  );
  const view = serializeCameraState();
  const background = {
    background: "00底图." + EXPORT_IMAGE_EXTENSION,
    backgroundWithPlan: "00底图带户型." + EXPORT_IMAGE_EXTENSION,
    floorPlan: "00户型图." + EXPORT_IMAGE_EXTENSION,
  };
  const has = new Set(
    Object.values(background).map((toLocaleLowerCase) =>
      toLocaleLowerCase.toLocaleLowerCase(),
    ),
  );
  const list = previewFloorEntries();
  const list2 = collectLightGroupsAcrossFloors(list)
    .map(
      ({
        floor: floor,
        group: group,
        index: index,
        key: id,
      }) => ({
        id: id,
        groupId: group.id,
        floor: floor,
        name:
          list.length > 1
            ? floor.name + "-" + group.name
            : group.name,
        enabledInEditor: stageSession.groupStates.get(id) !== false,
        file: uniqueExportFileName(
          list.length > 1
            ? floor.name + "-" + group.name
            : group.name,
          index,
          has,
        ),
        lights: floor.scene.items.filter(
          (item) =>
            lightItemTypes.has(item.type) &&
            item.lightGroupId === group.id,
        ),
      }),
    )
    .filter((id) => value.has("group:" + id.id));
  const list3 = collectTvsAcrossFloors(list).map(
    ({
      floor: floor,
      item: item,
      index: index,
      key: key,
    }) => ({
      id: "screen-" + key,
      key: key,
      floorId: floor.id,
      itemId: item.id,
      name:
        "" +
        (list.length > 1 ? floor.name + "-" : "") +
        (item.screenLayerName || "电视画面 " + (index + 1)),
      enabledInEditor: stageSession.tvStates.get(key) !== false,
      floor: floor,
      item: item,
      file: null,
    }),
  );
  const list4 = collectSmallCarsAcrossFloors(list).map(
    ({
      floor: floor,
      item: item,
      index: index,
      key: key,
    }) => ({
      id: "vehicle-" + key,
      key: key,
      floorId: floor.id,
      itemId: item.id,
      name:
        "" +
        (list.length > 1 ? floor.name + "-" : "") +
        (item.chargingLayerName || "汽车充电 " + (index + 1)),
      chargingInEditor: stageSession.carChargingStates.get(key) === true,
      floor: floor,
      item: item,
      file: null,
    }),
  );
  for (
    let count = 0;
    count < list3.length;
    count += 1
  ) {
    const file = list3[count];
    file.file = uniqueExportFileName(
      file.name,
      count,
      has,
    );
  }
  for (
    let count = 0;
    count < list4.length;
    count += 1
  ) {
    const file = list4[count];
    file.file = uniqueExportFileName(
      file.name,
      count,
      has,
    );
  }
  const list5 = list3.filter((key) =>
    value.has("screen:" + key.key),
  );
  const list6 = list4.filter((key) =>
    value.has("vehicle:" + key.key),
  );
  const flag =
    value.has("backgroundWithPlan") ||
    value.has("floorPlan") ||
    list5.length > 0 ||
    list6.length > 0 ||
    list2.length > 0;
  let flag2 = false;
  setOrbitSuspended(true);
  try {
    exportStatus.textContent = "正在检查文件夹名…";
    if (
      (
        await studioFetch("/studio3d/exports/check", {
          headers: {
            "X-Export-Folder": encodeURIComponent(exportName),
          },
        })
      )?.exists
    ) {
      exportStatus.textContent = "同名导图“" + exportName + "”已经存在";
      const local2 = await promptExportOverwrite(exportName);
      if (local2 === "rename") {
        exportStatus.textContent = "请修改文件夹名后重新保存";
        window.setTimeout(() => {
          exportFolderName.focus();
          exportFolderName.select();
        }, 0);
        notifyAutoDiagramExport(
          "rename",
          "请在属性中修改文件夹名称后重新生成。",
        );
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
    setExportPresetFromUi(view, width / height);
    setShadowCameraExpanded(true);
    exportStatus.textContent = "正在生成精细阴影导出图层…";
    buildExportLightLayerIndex();
    let isImageData = null;
    let imageData = null;
    if (value.has("background")) {
      setExportRoleVisibility("plan", false);
      setExportRoleVisibility("label", false);
      setExportRoleVisibility("outline", false);
      isImageData = await capturePreviewCanvas(width, height, {
        pixels: true,
      });
      setExportRoleVisibility("plan", true);
      setExportRoleVisibility("label", true);
      setExportRoleVisibility("outline", true);
    }
    if (flag) {
      imageData = await capturePreviewCanvas(width, height, {
        pixels: true,
      });
    }
    const list7 = [];
    if (isImageData) {
      const arrayBuffer = await buildExportImageCanvas(
        width,
        height,
        isImageData.imageData,
      );
      list7.push({
        name: background.background,
        data: await readFileAsUint8Array(arrayBuffer),
      });
    }
    if (value.has("backgroundWithPlan")) {
      const arrayBuffer = await buildExportImageCanvas(
        width,
        height,
        imageData.imageData,
      );
      list7.push({
        name: background.backgroundWithPlan,
        data: await readFileAsUint8Array(arrayBuffer),
      });
    }
    if (value.has("floorPlan")) {
      setExportRoleVisibility("background", false);
      setExportRoleVisibility("grid", false);
      const blob = await capturePreviewCanvas(width, height, {
        blob: true,
      });
      setExportRoleVisibility("background", true);
      setExportRoleVisibility("grid", true);
      list7.push({
        name: background.floorPlan,
        data: await readFileAsUint8Array(blob.blob),
      });
    }
    for (
      let count = 0;
      count < list2.length;
      count += 1
    ) {
      const lights = list2[count];
      const arrayBuffer = await drawExportAnnotations(
        imageData.imageData,
        lights,
        width,
        height,
        count,
        list2.length,
      );
      list7.push({
        name: lights.file,
        data: await readFileAsUint8Array(arrayBuffer),
      });
    }
    for (
      let count = 0;
      count < list5.length;
      count += 1
    ) {
      const named = list5[count];
      exportStatus.textContent =
        "正在生成电视图层 " +
        (count + 1) +
        "/" +
        list5.length +
        "：" +
        named.name;
      buildExportLightLayerIndex("", named.key);
      const imageData2 = await capturePreviewCanvas(
        width,
        height,
        {
          pixels: true,
        },
      );
      const arrayBuffer = await composeExportCanvas(
        imageData.imageData,
        imageData2.imageData,
      );
      list7.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer),
      });
    }
    for (
      let count = 0;
      count < list6.length;
      count += 1
    ) {
      const named = list6[count];
      exportStatus.textContent =
        "正在生成汽车图层 " +
        (count + 1) +
        "/" +
        list6.length +
        "：" +
        named.name;
      buildExportLightLayerIndex("", "", named.key);
      const imageData2 = await capturePreviewCanvas(
        width,
        height,
        {
          pixels: true,
        },
      );
      const arrayBuffer = await composeExportCanvas(
        imageData.imageData,
        imageData2.imageData,
      );
      list7.push({
        name: named.file,
        data: await readFileAsUint8Array(arrayBuffer),
      });
    }
    const manifest = {
      schemaVersion: 3,
      exportName: exportName,
      floorMode: getPreviewFloorMode(),
      floorPresentationGap:
        getPreviewFloorMode() === "all"
          ? finite(projectDoc.exportFloorGap, 3)
          : 0,
      floors: list.map((id) => ({
        id: id.id,
        name: id.name,
        elevation: floorStackOffsetY(id),
        offsetX: id.offsetX,
        offsetZ: id.offsetZ,
        rotation: id.rotation,
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
      camera: captureCameraPoseForExport(width, height),
      backgroundImage: value.has("background")
        ? background.background
        : null,
      baseImage: value.has("backgroundWithPlan")
        ? background.backgroundWithPlan
        : null,
      floorPlanImage: value.has("floorPlan")
        ? background.floorPlan
        : null,
      televisionOnImage:
        list5.length === 1 ? list5[0].file : null,
      televisionOnImages: list5.map(
        (file) => file.file,
      ),
      vehicleChargingImage:
        list6.length === 1 ? list6[0].file : null,
      vehicleChargingImages: list6.map(
        (file) => file.file,
      ),
      exportedFiles: list7.map((named) => named.name),
      groups: list2.map((floor) => ({
        id: floor.id,
        groupId: floor.groupId,
        floorId: floor.floor.id,
        name: floor.name,
        file: floor.file,
        anchor: firstProjectedItemScreenPos(
          floor.lights,
          floor.floor,
          list,
        ),
        enabledInEditor: floor.enabledInEditor,
        lights: floor.lights.map((item) =>
          serializeLightForStage(item, floor.floor),
        ),
      })),
      screens: list3.map(
        ({
          key: key,
          floor: floor,
          item: item,
          ...arg0
        }) => ({
          ...arg0,
          anchor: projectItemToScreenNorm(item, floor, list),
          file: value.has("screen:" + key) ? arg0.file : null,
        }),
      ),
      vehicles: list4.map(
        ({
          key: key,
          floor: floor,
          item: item,
          ...arg0
        }) => ({
          ...arg0,
          anchor: projectItemToScreenNorm(item, floor, list),
          file: value.has("vehicle:" + key) ? arg0.file : null,
        }),
      ),
    };
    if (value.has("dataLights")) {
      list7.push({
        name: "lights.json",
        data: new TextEncoder().encode(
          JSON.stringify(manifest, null, 2) + "\n",
        ),
      });
    }
    if (value.has("dataScene")) {
      const previewFloorMode =
        getPreviewFloorMode() === "all" ? cloneProjectDoc() : cloneFloorScene();
      list7.push({
        name: "scene.json",
        data: new TextEncoder().encode(
          JSON.stringify(previewFloorMode, null, 2) + "\n",
        ),
      });
    }
    exportStatus.textContent = "正在打包 ZIP…";
    const buildStoredZip2 = buildStoredZip(list7);
    exportStatus.textContent = "正在保存到 NAS data…";
    const body = new Blob([buildStoredZip2], {
      type: "application/zip",
    });
    const putStudioDocument = (flag3 = false) =>
      studioFetch("/studio3d/exports", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/zip",
          "X-Export-Folder": encodeURIComponent(exportName),
          ...(flag3
            ? {
                "X-Export-Overwrite": "true",
              }
            : {}),
        },
      });
    let overwritten;
    try {
      overwritten = await putStudioDocument(flag2);
    } catch (error) {
      if (
        error?.status !== 409 ||
        error?.payload?.detail?.code !== "STUDIO3D_EXPORT_EXISTS"
      ) {
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
        notifyAutoDiagramExport(
          "rename",
          "请在属性中修改文件夹名称后重新生成。",
        );
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
    exportStatus.textContent =
      "已保存到 data/" + overwritten.relativePath;
    showToast(
      "导图已保存到 data/" + overwritten.relativePath,
      "success",
    );
    const isClosed = isAutoDiagramEmbed ? window.parent : window.opener;
    if (
      autoDiagramComponentId &&
      isClosed &&
      (isAutoDiagramEmbed || !isClosed.closed)
    ) {
      isClosed.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-export",
          componentId: autoDiagramComponentId,
          folderName: exportName,
          manifest: manifest,
        },
        window.location.origin,
      );
    }
    isExporting = true;
    updateProgressChecklist();
    showExportCompleteDialog(overwritten);
  } catch (error) {
    window.HABridgeLog?.error(error, {
      phase: "studio-export",
      componentId: autoDiagramComponentId || "",
    });
    console.error(error);
    exportStatus.textContent = error?.message || "导出失败，请重试。";
    showToast(error?.message || "导图失败。", "error");
    if (
      isAutoDiagramEmbed &&
      autoDiagramComponentId &&
      window.parent !== window
    ) {
      window.parent.postMessage(
        {
          type: "ha-bridge-floorplan-auto-diagram-error",
          componentId: autoDiagramComponentId,
          message: error?.message || "后台生成失败，请重试。",
        },
        window.location.origin,
      );
    }
  } finally {
    setShadowCameraExpanded(false);
    for (const {
      key: key,
      group: group,
    } of collectLightGroupsAcrossFloors()) {
      if (stageSession?.groupStates.has(key)) {
        group.enabled = stageSession.groupStates.get(key);
      }
    }
    for (const { key: key, item: item } of collectTvsAcrossFloors()) {
      if (stageSession?.tvStates.has(key)) {
        item.screenEnabled = stageSession.tvStates.get(key);
      }
    }
    for (const {
      key: key,
      item: item,
    } of collectSmallCarsAcrossFloors()) {
      if (stageSession?.carChargingStates.has(key)) {
        item.chargingEnabled =
          stageSession.carChargingStates.get(key);
      }
    }
    rebuildWorldPreview();
    setExportPresetFromUi(view, width / height);
    setOrbitSuspended(false);
    scheduleStageEmbedResize();
  }
}
function disposeObject3dResources(object3d) {
  const idSet = new Set();
  const idSet2 = new Set();
  object3d.traverse((object3d2) => {
    object3d2.shadow?.dispose?.();
    if (
      object3d2.geometry &&
      !idSet.has(object3d2.geometry) &&
      !object3d2.userData.externalModelSharedGeometry &&
      !object3d2.userData.sofaSharedGeometry &&
      !object3d2.userData.rugSharedGeometry &&
      !object3d2.userData.architectureSharedGeometry
    ) {
      idSet.add(object3d2.geometry);
      object3d2.geometry.dispose?.();
    }
    const value = Array.isArray(object3d2.material)
      ? object3d2.material
      : object3d2.material
        ? [object3d2.material]
        : [];
    for (const entries of value) {
      if (!idSet2.has(entries)) {
        idSet2.add(entries);
        if (!object3d2.userData.externalModelSharedTextures) {
          entries.map?.dispose?.();
        }
        if (
          !object3d2.userData.sofaSharedMaterial &&
          !object3d2.userData.rugSharedMaterial &&
          !object3d2.userData.architectureSharedMaterial &&
          !object3d2.userData.externalModelSharedMaterial
        ) {
          entries.dispose?.();
        }
      }
    }
  });
}
function clearWorldGroup() {
  if (worldGroup) {
    for (const object3d of [...worldGroup.children]) {
      worldGroup.remove(object3d);
      disposeObject3dResources(object3d);
    }
  }
}
function addBoxMesh(
  group,
  width,
  height,
  depth,
  x,
  y,
  z,
  color,
  options = {},
) {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: options.roughness ?? 0.8,
    metalness: options.metalness ?? 0.01,
    transparent: !!options.transparent,
    opacity: options.opacity ?? 1,
    depthWrite: options.depthWrite ?? true,
    depthFunc: options.depthFunc ?? THREE.LessEqualDepth,
    side: options.side ?? THREE.FrontSide,
    emissive: options.emissive ?? 0,
    emissiveIntensity: options.emissiveIntensity ?? 0,
  });
  const minDim = Math.max(
    Math.min(width, height, depth),
    0.001,
  );
  const radius = Math.min(
    options.radius ?? minDim * 0.14,
    minDim * 0.45,
    0.08,
  );
  const geometry =
    options.rounded === false || group.userData.squareEdges
      ? new THREE.BoxGeometry(width, height, depth)
      : new RoundedBoxGeometry(
          width,
          height,
          depth,
          options.segments ?? 2,
          radius,
        );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  mesh.renderOrder = options.renderOrder ?? 0;
  group.add(mesh);
  return mesh;
}
function normalizeBoxPartSpec(point3) {
  if (Array.isArray(point3)) {
    const [
      width,
      height,
      depth,
      x = 0,
      y = 0,
      z = 0,
      rotationY = 0,
    ] = point3;
    return {
      width: width,
      height: height,
      depth: depth,
      x: x,
      y: y,
      z: z,
      rotationY: rotationY,
    };
  }
  return {
    width: point3.width,
    height: point3.height,
    depth: point3.depth,
    x: point3.x || 0,
    y: point3.y || 0,
    z: point3.z || 0,
    rotationY: point3.rotationY || 0,
  };
}
function buildMergedBoxGeometry(list) {
  const list2 = list
    .map(normalizeBoxPartSpec)
    .filter((size) =>
      [size.width, size.height, size.depth].every(
        (arg0) => Number.isFinite(arg0) && arg0 > 0.0001,
      ),
    );
  if (!list2.length) {
    return null;
  }
  const value = JSON.stringify(
    list2.map((point3) => [
      point3.width,
      point3.height,
      point3.depth,
      point3.x,
      point3.y,
      point3.z,
      point3.rotationY,
    ]),
  );
  if (!mergedBoxGeometryCache.has(value)) {
    const item = list2.map((point3) => {
      const applyMatrix4 = new THREE.BoxGeometry(
        point3.width,
        point3.height,
        point3.depth,
      );
      const vector3 = new THREE.Matrix4().compose(
        new THREE.Vector3(point3.x, point3.y, point3.z),
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, point3.rotationY, 0),
        ),
        new THREE.Vector3(1, 1, 1),
      );
      return applyMatrix4.applyMatrix4(vector3);
    });
    const flag = mergeGeometries(item);
    item.forEach((dispose) => dispose.dispose());
    if (!flag) {
      return null;
    }
    mergedBoxGeometryCache.set(value, flag);
  }
  return mergedBoxGeometryCache.get(value);
}
function getCachedStandardMaterial(arg0, roughness = {}) {
  const color = new THREE.Color(arg0).getHex();
  const value = JSON.stringify([
    color,
    roughness.roughness ?? 0.8,
    roughness.metalness ?? 0.01,
    !!roughness.transparent,
    roughness.opacity ?? 1,
    roughness.depthWrite ?? true,
    roughness.depthFunc ?? THREE.LessEqualDepth,
    roughness.side ?? THREE.FrontSide,
    roughness.emissive ?? 0,
    roughness.emissiveIntensity ?? 0,
  ]);
  if (!standardMaterialCache.has(value)) {
    standardMaterialCache.set(
      value,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness.roughness ?? 0.8,
        metalness: roughness.metalness ?? 0.01,
        transparent: !!roughness.transparent,
        opacity: roughness.opacity ?? 1,
        depthWrite: roughness.depthWrite ?? true,
        depthFunc: roughness.depthFunc ?? THREE.LessEqualDepth,
        side: roughness.side ?? THREE.FrontSide,
        emissive: roughness.emissive ?? 0,
        emissiveIntensity: roughness.emissiveIntensity ?? 0,
      }),
    );
  }
  return standardMaterialCache.get(value);
}
function addSharedArchMesh(
  group,
  entries,
  arg2,
  roughness = {},
) {
  const flag = buildMergedBoxGeometry(entries);
  if (!flag) {
    return null;
  }
  const light = new THREE.Mesh(
    flag,
    getCachedStandardMaterial(arg2, roughness),
  );
  light.castShadow = roughness.castShadow !== false;
  light.receiveShadow = roughness.receiveShadow !== false;
  light.renderOrder = roughness.renderOrder ?? 0;
  light.userData.architectureSharedGeometry = true;
  light.userData.architectureSharedMaterial = true;
  group.add(light);
  return light;
}
function createBoxPartMesh(
  arg0,
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
) {
  const value = Math.max(
    Math.min(arg0, arg1, arg2),
    0.001,
  );
  const minValue = Math.min(value * 0.14, value * 0.45, 0.08);
  const boxGeometry = new RoundedBoxGeometry(
    arg0,
    arg1,
    arg2,
    2,
    minValue,
  );
  boxGeometry.translate(arg3, arg4, arg5);
  return boxGeometry;
}
function mergeBoxPartGeometries(list) {
  const item = list.map((arg0) =>
    createBoxPartMesh(...arg0),
  );
  const mergeGeometries2 = mergeGeometries(item);
  item.forEach((dispose) => dispose.dispose());
  return mergeGeometries2;
}
function getCachedSofaGeometry(arg0, arg1, arg2) {
  const value = arg0 + ":" + arg1 + ":" + arg2;
  if (sofaGeometryCache.has(value)) {
    return sofaGeometryCache.get(value);
  }
  const frame = mergeBoxPartGeometries([
    [
      arg0 * 0.92,
      arg1 * 0.28,
      arg2 * 0.72,
      0,
      arg1 * 0.28,
      arg2 * 0.06,
    ],
    [
      arg0 * 0.92,
      arg1 * 0.55,
      arg2 * 0.18,
      0,
      arg1 * 0.56,
      -arg2 * 0.35,
    ],
    [
      arg0 * 0.1,
      arg1 * 0.48,
      arg2 * 0.75,
      -arg0 * 0.46,
      arg1 * 0.39,
      arg2 * 0.03,
    ],
    [
      arg0 * 0.1,
      arg1 * 0.48,
      arg2 * 0.75,
      arg0 * 0.46,
      arg1 * 0.39,
      arg2 * 0.03,
    ],
  ]);
  const cushions = mergeBoxPartGeometries([
    [
      arg0 * 0.42,
      arg1 * 0.12,
      arg2 * 0.55,
      -arg0 * 0.22,
      arg1 * 0.47,
      arg2 * 0.07,
    ],
    [
      arg0 * 0.42,
      arg1 * 0.12,
      arg2 * 0.55,
      arg0 * 0.22,
      arg1 * 0.47,
      arg2 * 0.07,
    ],
  ]);
  const flag =
    frame && cushions
      ? {
          frame: frame,
          cushions: cushions,
        }
      : null;
  if (flag) {
    sofaGeometryCache.set(value, flag);
  } else {
    frame?.dispose();
    cushions?.dispose();
  }
  return flag;
}
function getCachedColorMaterial(color) {
  const id = String(color);
  if (!colorMaterialCache.has(id)) {
    colorMaterialCache.set(
      id,
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
  return colorMaterialCache.get(id);
}
function addSofaMeshes(group, size, color, cushionColor) {
  const sofaGeometry = getCachedSofaGeometry(
    size.width,
    size.height,
    size.depth,
  );
  if (!sofaGeometry) {
    return false;
  }
  const selected = isSelected("item", size.id);
  for (const [geometry, meshColor] of [
    [sofaGeometry.frame, color],
    [sofaGeometry.cushions, cushionColor],
  ]) {
    const material = selected
      ? getCachedColorMaterial(meshColor).clone()
      : getCachedColorMaterial(meshColor);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.sofaSharedGeometry = true;
    mesh.userData.sofaSharedMaterial = !selected;
    group.add(mesh);
  }
  return true;
}
function getCachedRugGeometry(arg0, arg1, arg2) {
  const rugThickness = clamp(arg1, 0.004, 0.018);
  const value = arg0 + ":" + rugThickness + ":" + arg2;
  if (!rugGeometryCache.has(value)) {
    const maxValue = Math.max(
      Math.min(arg0, rugThickness, arg2),
      0.001,
    );
    const minValue = Math.min(
      Math.min(arg0, arg2) * 0.018,
      maxValue * 0.45,
      0.08,
    );
    const base = new RoundedBoxGeometry(
      arg0,
      rugThickness,
      arg2,
      2,
      minValue,
    );
    const inset = new THREE.PlaneGeometry(
      arg0 * 0.88,
      arg2 * 0.84,
    );
    rugGeometryCache.set(value, {
      base: base,
      inset: inset,
      rugThickness: rugThickness,
    });
  }
  return rugGeometryCache.get(value);
}
function getCachedRugMaterial(color, flag = false) {
  const value = (flag ? "inset" : "base") + ":" + color;
  if (!rugMaterialCache.has(value)) {
    rugMaterialCache.set(
      value,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 1,
        metalness: 0,
        ...(flag
          ? {
              polygonOffset: true,
              polygonOffsetFactor: -2,
              polygonOffsetUnits: -4,
            }
          : {}),
      }),
    );
  }
  return rugMaterialCache.get(value);
}
function addRugMeshes(group, size, color, color2) {
  const base = getCachedRugGeometry(
    size.width,
    size.height,
    size.depth,
  );
  if (!base) {
    return false;
  }
  const flag = isSelected("item", size.id);
  const value = flag
    ? getCachedRugMaterial(color).clone()
    : getCachedRugMaterial(color);
  const light = new THREE.Mesh(base.base, value);
  light.position.y = base.rugThickness * 0.5;
  light.castShadow = false;
  light.receiveShadow = true;
  light.userData.rugSharedGeometry = true;
  light.userData.rugSharedMaterial = !flag;
  group.add(light);
  const armV2 = flag
    ? getCachedRugMaterial(color2, true).clone()
    : getCachedRugMaterial(color2, true);
  const object3d = new THREE.Mesh(base.inset, armV2);
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
    sharedResources: true,
  };
  return true;
}
function meshMaterialSignature(light) {
  const material = light.material;
  if (
    !light.isMesh ||
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
      light.castShadow,
      light.receiveShadow,
      light.renderOrder,
    ]);
  }
}
function geometryAttributeSignature(geometry) {
  const value = Object.entries(geometry.geometry?.attributes || {})
    .sort(([localeCompare], [arg1]) =>
      localeCompare.localeCompare(arg1),
    )
    .map(([arg0, itemSize]) => [
      arg0,
      itemSize.itemSize,
      itemSize.normalized,
      itemSize.array?.constructor?.name,
    ]);
  return JSON.stringify([
    !!geometry.geometry?.index,
    value,
    Object.keys(geometry.geometry?.morphAttributes || {}).sort(),
  ]);
}
function collectChildMeshes(object3d) {
  const list = [];
  object3d.traverse((object3d2) => {
    if (object3d2 !== object3d && object3d2.isMesh) {
      list.push(object3d2);
    }
  });
  return list;
}
function materialFingerprint(material2) {
  const material = material2.material;
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
function optimizeItemGeometries(object3d, type) {
  if (!geometryOptimizeTypes.has(type)) {
    return;
  }
  const list = collectChildMeshes(object3d);
  const map = new Map();
  const map2 = new Map();
  for (const material of list) {
    const flag = material.geometry?.parameters;
    const flag2 = flag
      ? material.geometry.type + ":" + JSON.stringify(flag)
      : "";
    if (flag2 && map.has(flag2)) {
      material.geometry.dispose();
      material.geometry = map.get(flag2);
    } else if (flag2) {
      map.set(flag2, material.geometry);
    }
    const flag3 = materialFingerprint(material);
    if (flag3 && map2.has(flag3)) {
      material.material.dispose();
      material.material = map2.get(flag3);
    } else if (flag3) {
      map2.set(flag3, material.material);
    }
  }
  object3d.userData.optimizationStats = {
    type: type,
    before: list.length,
    after: list.length,
    uniqueGeometries: new Set(
      list.map((geometry) => geometry.geometry),
    ).size,
    uniqueMaterials: new Set(
      list.map((material) => material.material),
    ).size,
  };
}
function mergeSimilarItemMeshes(object3d, type) {
  if (!meshMergeItemTypes.has(type)) {
    return;
  }
  const list = collectChildMeshes(object3d);
  const before = list.length;
  const map = new Map();
  for (const light of list) {
    const flag = meshMaterialSignature(light);
    if (!flag) {
      continue;
    }
    const msimV2 = flag + ":" + geometryAttributeSignature(light);
    if (!map.has(msimV2)) {
      map.set(msimV2, []);
    }
    map.get(msimV2).push(light);
  }
  object3d.updateMatrixWorld(true);
  const value = object3d.matrixWorld.clone().invert();
  for (const list2 of map.values()) {
    if (list2.length < 2) {
      continue;
    }
    const item = list2.map((object3d2) => {
      const matrix4 = new THREE.Matrix4().multiplyMatrices(
        value,
        object3d2.matrixWorld,
      );
      return object3d2.geometry.clone().applyMatrix4(matrix4);
    });
    const flag = mergeGeometries(item);
    item.forEach((dispose) => dispose.dispose());
    if (!flag) {
      continue;
    }
    const light = list2[0];
    const object3d3 = new THREE.Mesh(
      flag,
      light.material,
    );
    object3d3.castShadow = light.castShadow;
    object3d3.receiveShadow = light.receiveShadow;
    object3d3.renderOrder = light.renderOrder;
    object3d3.userData = {};
    list2.forEach((object3d2, arg1) => {
      object3d2.parent?.remove(object3d2);
      if (!object3d2.userData.externalModelSharedGeometry) {
        object3d2.geometry.dispose();
      }
      if (arg1 > 0) {
        object3d2.material.dispose();
      }
    });
    object3d.add(object3d3);
  }
  object3d.userData.optimizationStats = {
    type: type,
    before: before,
    after: collectChildMeshes(object3d).length,
  };
}
function addSoftBoxMesh(
  group,
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6,
  color,
  light = {},
) {
  const value = new THREE.MeshStandardMaterial({
    color: color,
    roughness: light.roughness ?? 0.62,
    metalness: light.metalness ?? 0.03,
    transparent: !!light.transparent,
    opacity: light.opacity ?? 1,
    depthWrite: light.depthWrite ?? true,
  });
  const light2 = new THREE.Mesh(
    new THREE.CylinderGeometry(
      arg1,
      arg2,
      arg3,
      light.segments ?? 24,
    ),
    value,
  );
  light2.position.set(arg4, arg5, arg6);
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
function markAsLightSourcePreview(light) {
  light.userData.exportRole = "light-source-preview";
  light.castShadow = false;
  light.receiveShadow = false;
  light.renderOrder = 20;
  return light;
}
function addStripLightHelpers(group, item) {
  if (item.type !== "striplight") {
    return;
  }
  const group2 = new THREE.Group();
  group2.userData.exportRole = "light-source-preview";
  group2.userData.lightSourcePreview = true;
  group2.visible =
    item.lightSourceVisible !== false &&
    !stageSession &&
    isSelected("item", item.id);
  const emissive = kelvinToRgbHex(item.lightTemperature) || 16762219;
  const clamp2 = clamp(finite(item.depth, 0.28), 0.1, 8);
  const clamp3 = clamp(finite(item.width, 1), 0.1, 8);
  const depth = clamp2;
  const rotation = new THREE.Group();
  rotation.rotation.z = THREE.MathUtils.degToRad(
    normalizeFullRotation(item.verticalRotation),
  );
  const group3 = new THREE.Group();
  group3.rotation.x = THREE.MathUtils.degToRad(
    normalizeFullRotation(item.stripRollRotation),
  );
  const clamp4 = clamp(
    finite(item.lightRange, 3.5) * 0.16,
    0.28,
    0.72,
  );
  markAsLightSourcePreview(
    addBoxMesh(
      group3,
      clamp3,
      0.014,
      depth,
      0,
      -clamp4,
      0,
      emissive,
      {
        rounded: false,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        emissive: emissive,
        emissiveIntensity: 0.68,
        castShadow: false,
        receiveShadow: false,
      },
    ),
  );
  markAsLightSourcePreview(
    addSoftBoxMesh(
      group3,
      0.012,
      0.012,
      clamp4,
      0,
      -clamp4 * 0.5,
      0,
      emissive,
      {
        segments: 10,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        roughness: 0.3,
        emissive: emissive,
        emissiveIntensity: 0.8,
      },
    ),
  );
  const light = new THREE.Mesh(
    new THREE.ConeGeometry(0.045, 0.12, 10),
    new THREE.MeshBasicMaterial({
      color: emissive,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    }),
  );
  light.rotation.x = Math.PI;
  light.position.set(0, -clamp4, 0);
  markAsLightSourcePreview(light);
  group3.add(light);
  rotation.add(group3);
  group2.add(rotation);
  group.add(group2);
}
function stairStepProfiles(arg0, arg1, arg2) {
  const list = [
    {
      y: 0,
      halfWidth: arg0 * 0.31,
      backZ: -arg1 * 0.16,
      sideZ: arg1 * 0.08,
      frontZ: arg1 * 0.46,
    },
    {
      y: arg2 * 0.42,
      halfWidth: arg0 * 0.43,
      backZ: -arg1 * 0.34,
      sideZ: arg1 * 0.08,
      frontZ: arg1 * 0.47,
    },
    {
      y: arg2 * 0.72,
      halfWidth: arg0 * 0.49,
      backZ: -arg1 * 0.47,
      sideZ: arg1 * 0.08,
      frontZ: arg1 * 0.47,
    },
  ];
  const handler = (point) => {
    const list5 = [
      new THREE.Vector3(-point.halfWidth, point.y, point.backZ),
      new THREE.Vector3(point.halfWidth, point.y, point.backZ),
      new THREE.Vector3(point.halfWidth, point.y, point.sideZ),
    ];
    for (let step = 1; step <= 18; step += 1) {
      const sspV5 = (step / 18) * Math.PI;
      list5.push(
        new THREE.Vector3(
          Math.cos(sspV5) * point.halfWidth,
          point.y,
          point.sideZ +
            Math.sin(sspV5) * (point.frontZ - point.sideZ),
        ),
      );
    }
    return list5;
  };
  const list2 = list.map(handler);
  const length = list2[0].length;
  const list3 = list2.flatMap((list5) =>
    list5.flatMap((point3) => [
      point3.x,
      point3.y,
      point3.z,
    ]),
  );
  const list4 = [];
  for (
    let count = 0;
    count < list2.length - 1;
    count += 1
  ) {
    const sspV5 = count * length;
    const sspV6 = (count + 1) * length;
    for (let count2 = 0; count2 < length; count2 += 1) {
      const sspV8 = (count2 + 1) % length;
      const sspV9 = sspV5 + count2;
      const sspV10 = sspV5 + sspV8;
      const sspV11 = sspV6 + count2;
      const sspV12 = sspV6 + sspV8;
      list4.push(
        sspV9,
        sspV12,
        sspV10,
        sspV9,
        sspV11,
        sspV12,
      );
    }
  }
  const value = list3.length / 3;
  list3.push(0, list[0].y, arg1 * 0.08);
  const sspV2 = list3.length / 3;
  list3.push(0, list.at(-1).y, arg1 * 0.08);
  const sspV3 = (list2.length - 1) * length;
  for (let count = 0; count < length; count += 1) {
    const sspV5 = (count + 1) % length;
    list4.push(value, count, sspV5);
    list4.push(
      sspV2,
      sspV3 + sspV5,
      sspV3 + count,
    );
  }
  const el = new THREE.BufferGeometry();
  el.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(list3, 3),
  );
  el.setIndex(list4);
  el.computeVertexNormals();
  el.computeBoundingSphere();
  return el;
}
function buildTelevisionMesh(
  group,
  arg1,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6,
  color,
  color2,
) {
  const group2 = new THREE.Group();
  const y = arg3 * 0.49;
  const height = arg3 * 0.12;
  const z = -arg2 * 0.39;
  addBoxMesh(
    group2,
    arg1 * 0.9,
    height,
    arg2 * 0.82,
    0,
    y,
    arg2 * 0.02,
    color,
    {
      radius: Math.min(arg1, arg2) * 0.06,
      roughness: 0.72,
    },
  );
  addBoxMesh(
    group2,
    arg1 * 0.78,
    arg3 * 0.34,
    arg2 * 0.09,
    0,
    arg3 * 0.78,
    z,
    color,
    {
      radius: Math.min(arg1, arg2) * 0.045,
      roughness: 0.72,
    },
  );
  for (const value of [-0.38, 0.38]) {
    addBoxMesh(
      group2,
      0.05,
      arg3 * 0.47,
      0.05,
      arg1 * value,
      arg3 * 0.235,
      arg2 * 0.34,
      color2,
      {
        rounded: false,
      },
    );
    addBoxMesh(
      group2,
      0.05,
      arg3 * 0.94,
      0.05,
      arg1 * value,
      arg3 * 0.47,
      z,
      color2,
      {
        rounded: false,
      },
    );
  }
  group2.position.set(arg4, 0, arg5);
  group2.rotation.y = arg6;
  group.add(group2);
}
function stairRiserMaterialOptions(
  group,
  arg1,
  value,
  param,
) {
  const light = {
    rounded: false,
    metalness: 0.18,
    roughness: 0.36,
    castShadow: false,
    receiveShadow: false,
  };
  const list = [];
  const entries = [];
  for (const size of arg1) {
    const minValue = Math.min(
      0.045,
      size.width * 0.08,
      size.height * 0.04,
    );
    const maxValue = Math.max(size.width - minValue * 2, 0.04);
    const maxValue2 = Math.max(size.height - minValue * 2, 0.08);
    list.push([
      maxValue,
      maxValue2,
      0.018,
      size.centerX,
      size.height / 2,
      size.centerZ,
    ]);
    entries.push(
      [
        size.width,
        minValue,
        0.045,
        size.centerX,
        minValue / 2,
        size.centerZ,
      ],
      [
        size.width,
        minValue,
        0.045,
        size.centerX,
        size.height - minValue / 2,
        size.centerZ,
      ],
      [
        minValue,
        size.height,
        0.045,
        size.centerX - size.width / 2 + minValue / 2,
        size.height / 2,
        size.centerZ,
      ],
      [
        minValue,
        size.height,
        0.045,
        size.centerX + size.width / 2 - minValue / 2,
        size.height / 2,
        size.centerZ,
      ],
    );
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
      renderOrder: 7,
    });
  }
  addSharedArchMesh(group, entries, value, light);
}
function applySelectionHighlight(object3d, flag) {
  if (!flag) {
    return;
  }
  const value = resolvedThemeColors();
  object3d.traverse((material) => {
    const isArrayResult = Array.isArray(material.material)
      ? material.material
      : material.material
        ? [material.material]
        : [];
    for (const isMeshStandardMaterial of isArrayResult) {
      if (isMeshStandardMaterial?.isMeshStandardMaterial) {
        isMeshStandardMaterial.emissive = new THREE.Color(
          value.accent,
        );
        isMeshStandardMaterial.emissiveIntensity = 0.32;
      }
    }
  });
}
function createPlanLabelSprite(size) {
  const el = document.createElement("canvas");
  el.width = 2048;
  el.height = 640;
  const canvasCtx = el.getContext("2d");
  canvasCtx.clearRect(0, 0, el.width, el.height);
  canvasCtx.fillStyle = "#929baa";
  canvasCtx.textAlign = "left";
  canvasCtx.textBaseline = "middle";
  const normalizeLabelText2 = normalizeLabelText(
    size.title,
    "家庭总览",
    24,
  );
  const normalizeLabelText3 = normalizeLabelText(
    size.subtitle,
    "HOME PLAN",
    36,
  );
  const value = 115;
  const cplsV2 = 184;
  canvasCtx.font = "700 " + cplsV2 + "px sans-serif";
  drawTrackedText(
    canvasCtx,
    normalizeLabelText2,
    value,
    130,
    cplsV2 * clamp(finite(size.titleSpacing, 1.05), 0, 1.8),
    1340,
  );
  const cplsV3 = 1580;
  const cplsV4 = 130;
  const cplsV5 = 170;
  canvasCtx.fillStyle = "#929baa";
  canvasCtx.beginPath();
  canvasCtx.moveTo(cplsV3, cplsV4 - cplsV5 * 0.58);
  canvasCtx.lineTo(
    cplsV3 + cplsV5 * 0.56,
    cplsV4 - cplsV5 * 0.02,
  );
  canvasCtx.lineTo(
    cplsV3 + cplsV5 * 0.38,
    cplsV4 - cplsV5 * 0.02,
  );
  canvasCtx.lineTo(
    cplsV3 + cplsV5 * 0.38,
    cplsV4 + cplsV5 * 0.5,
  );
  canvasCtx.lineTo(
    cplsV3 - cplsV5 * 0.38,
    cplsV4 + cplsV5 * 0.5,
  );
  canvasCtx.lineTo(
    cplsV3 - cplsV5 * 0.38,
    cplsV4 - cplsV5 * 0.02,
  );
  canvasCtx.lineTo(
    cplsV3 - cplsV5 * 0.56,
    cplsV4 - cplsV5 * 0.02,
  );
  canvasCtx.closePath();
  canvasCtx.fill();
  canvasCtx.save();
  canvasCtx.globalCompositeOperation = "destination-out";
  canvasCtx.fillRect(
    cplsV3 - cplsV5 * 0.09,
    cplsV4 + cplsV5 * 0.2,
    cplsV5 * 0.18,
    cplsV5 * 0.3,
  );
  canvasCtx.restore();
  canvasCtx.fillStyle = "#929baa";
  canvasCtx.textAlign = "left";
  const cplsV6 = 310;
  canvasCtx.font =
    "400 " + cplsV6 + 'px "Arial Narrow", Arial, sans-serif';
  drawTrackedText(
    canvasCtx,
    normalizeLabelText3,
    72,
    410,
    cplsV6 * clamp(finite(size.subtitleSpacing, 0.08), 0, 0.6),
    1880,
  );
  const cplsV7 = 74;
  const cplsV8 =
    cplsV7 + clamp(finite(size.lineLength, 0.86), 0.3, 1) * 1880;
  canvasCtx.strokeStyle = "rgba(146, 155, 170, 0.72)";
  canvasCtx.lineWidth = 16;
  canvasCtx.beginPath();
  canvasCtx.moveTo(cplsV7, 590);
  canvasCtx.lineTo(cplsV8, 590);
  canvasCtx.moveTo(cplsV7, 566);
  canvasCtx.lineTo(cplsV7, 614);
  canvasCtx.moveTo(cplsV8, 566);
  canvasCtx.lineTo(cplsV8, 614);
  canvasCtx.stroke();
  const map = new THREE.CanvasTexture(el);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = Math.min(
    renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    8,
  );
  map.needsUpdate = true;
  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(size.width, size.depth),
    new THREE.MeshBasicMaterial({
      map: map,
      transparent: true,
      alphaTest: 0.02,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  light.rotation.x = -Math.PI / 2;
  light.position.y = 0.008;
  light.castShadow = false;
  light.receiveShadow = false;
  light.renderOrder = 8;
  return light;
}
function shadowCastingLightIdSet() {
  return new Set(
    selectShadowCastingLightIds(
      floorScene.items.map((id) => ({
        id: id.id,
        groupId: id.lightGroupId,
        type: id.type,
        brightness: finite(
          id.lightBrightness,
          defaultLightPresets[id.type]?.brightness || 0,
        ),
        enabled:
          lightItemTypes.has(id.type) &&
          isLightGroupVisible(id),
      })),
      MAX_DEFERRED_MODEL_LOADS,
    ),
  );
}
function countMaterialTextures(material) {
  if (
    !material ||
    material.isMeshBasicMaterial ||
    material.isShadowMaterial
  ) {
    return 0;
  }
  let length = Object.values(material).filter(
    (isTexture) => isTexture?.isTexture === true,
  ).length;
  if (
    material.isMeshPhysicalMaterial &&
    finite(material.transmission, 0) > 0
  ) {
    length += 1;
  }
  return length;
}
function countSceneMeshes(object3d = worldGroup) {
  let value = 0;
  object3d?.traverse((object3d2) => {
    if (!object3d2.isMesh) {
      return;
    }
    const isArrayResult = Array.isArray(object3d2.material)
      ? object3d2.material
      : object3d2.material
        ? [object3d2.material]
        : [];
    for (const material of isArrayResult) {
      value = Math.max(value, countMaterialTextures(material));
    }
  });
  if (previewScene?.environment?.isTexture) {
    value += 1;
  }
  return value;
}
function maxTextureUnits() {
  const getParameter = renderer?.getContext?.();
  const value = getParameter?.getParameter?.(
    getParameter.MAX_TEXTURE_IMAGE_UNITS,
  );
  return Math.max(
    1,
    Math.floor(finite(value, renderer?.capabilities?.maxTextures || 16)),
  );
}
function collectShadowLights(object3d = worldGroup) {
  const list = [];
  object3d?.traverse((light) => {
    if (
      !light.isSpotLight ||
      light.userData?.shadowCandidate !== true
    ) {
      return;
    }
    const id = String(light.userData?.lightFloorId || "");
    const flag = String(light.userData?.lightItemId || "");
    if (flag) {
      list.push({
        id: id + ":" + flag,
        groupId:
          id + ":" + String(light.userData?.lightGroupId || ""),
        type: String(light.userData?.lightType || "downlight"),
        brightness: finite(light.userData?.lightBrightness, 0),
        enabled: light.visible !== false,
      });
    }
  });
  return list;
}
function countShadowLights(
  object3d = worldGroup,
  { rebuildAtlas: flag = true } = {},
) {
  if (!object3d || !renderer) {
    return 0;
  }
  const maxTextureUnits2 = maxTextureUnits();
  const materialTextureUnits = countSceneMeshes(object3d);
  let nonSpotShadowTextureUnits = 0;
  previewScene?.traverse((light) => {
    if (
      light.visible !== false &&
      light.isLight &&
      !light.isSpotLight &&
      light.castShadow
    ) {
      nonSpotShadowTextureUnits += 1;
    }
  });
  let flag2 = false;
  object3d.traverse((object3d2) => {
    if (object3d2.visible !== false && object3d2.isRectAreaLight) {
      flag2 = true;
    }
  });
  const rectAreaLightTextureUnits = flag2 ? SOFT_TEXTURE_UNIT_RESERVE : 0;
  const value =
    maxTextureUnits2 - materialTextureUnits - nonSpotShadowTextureUnits - rectAreaLightTextureUnits - RESERVED_TEXTURE_UNITS;
  if (!stageSession && shadowAtlas && value >= 1) {
    const cslV5 = flag
      ? shadowAtlas.schedule(object3d)
      : collectShadowLights(object3d).length;
    const syncResult = shadowAtlas.sync(object3d);
    const domElement2 = renderer.domElement;
    domElement2.dataset.fragmentTextureUnits = String(maxTextureUnits2);
    domElement2.dataset.materialTextureUnits = String(materialTextureUnits);
    domElement2.dataset.spotShadowLimit = String(cslV5);
    domElement2.dataset.activeSpotShadows = String(syncResult);
    let count = 0;
    object3d.traverse((object3d2) => {
      if (
        object3d2.isLight &&
        object3d2.userData?.lightItemId &&
        object3d2.visible !== false
      ) {
        count += 1;
      }
    });
    domElement2.dataset.activeUserLights = String(count);
    return syncResult;
  }
  const spotShadowTextureUnitLimit2 = spotShadowTextureUnitLimit({
    maxTextureUnits: maxTextureUnits2,
    materialTextureUnits: materialTextureUnits,
    nonSpotShadowTextureUnits: nonSpotShadowTextureUnits,
    rectAreaLightTextureUnits: rectAreaLightTextureUnits,
    reservedTextureUnits: RESERVED_TEXTURE_UNITS,
    hardLimit: MAX_DEFERRED_MODEL_LOADS,
  });
  if (stageSession && shadowAtlas) {
    shadowAtlas.setEnabled(false);
    shadowAtlas.sync(object3d);
  }
  const uniqueSet = new Set(
    selectShadowCastingLightIds(
      collectShadowLights(object3d),
      spotShadowTextureUnitLimit2,
    ),
  );
  let count = 0;
  object3d.traverse((light) => {
    if (!light.isSpotLight || !light.userData?.lightItemId) {
      return;
    }
    const string =
      String(light.userData?.lightFloorId || "") +
      ":" +
      String(light.userData.lightItemId);
    const flag3 = uniqueSet.has(string);
    light.castShadow = flag3;
    if (flag3) {
      count += 1;
      if (light.shadow && !light.shadow.map) {
        light.shadow.needsUpdate = true;
      }
    }
  });
  const domElement = renderer.domElement;
  domElement.dataset.spotShadowMode = "individual";
  domElement.dataset.fragmentTextureUnits = String(maxTextureUnits2);
  domElement.dataset.materialTextureUnits = String(materialTextureUnits);
  domElement.dataset.spotShadowLimit = String(
    spotShadowTextureUnitLimit2,
  );
  domElement.dataset.activeSpotShadows = String(count);
  let count2 = 0;
  object3d.traverse((object3d2) => {
    if (
      object3d2.isLight &&
      object3d2.userData?.lightItemId &&
      object3d2.visible !== false
    ) {
      count2 += 1;
    }
  });
  domElement.dataset.activeUserLights = String(count2);
  return count;
}
function buildLightFixtureMeshes(group, id, has) {
  const value = isStageEmbed
    ? lightEffectColorHex(id.lightTemperature)
    : kelvinToRgbHex(id.lightTemperature);
  const flag =
    isLightGroupVisible(id) && finite(id.lightBrightness, 0) > 0;
  const flag2 =
    !stageSession &&
    forcedVisibleLightGroupIds === null &&
    (isStageEmbed || !isPreviewQualityReady());
  const flag3 = !stageSession && residentCacheMode;
  if (!flag && !flag2 && !flag3) {
    return;
  }
  const range =
    defaultLightPresets[id.type] || defaultLightPresets.downlight;
  const clampResult =
    clamp(finite(id.lightBrightness, range.brightness), 0, 100) /
    100;
  const blfmV3 = lightHeightScaleByType[id.type] || 1.1;
  const flag4 = id.type === "striplight";
  const lightGroup = resolveLightGroup(id);
  if (flag4) {
    const clamp4 = clamp(finite(id.width, 2), 0.1, 8);
    const clamp5 = clamp(finite(id.depth, 0.28), 0.1, 8);
    const clamp6 = clamp(
      finite(id.lightRange, range.range),
      0.5,
      10,
    );
    const clamp7 = clamp(clamp6 / range.range, 0.45, 1.65);
    const maxValue = Math.max(finite(id.elevation, 2.7), 0.4);
    const clamp8 = clamp(Math.max(1, Math.pow(maxValue / 2.7, 2)), 1, 4);
    const rotation = new THREE.Group();
    rotation.rotation.z = THREE.MathUtils.degToRad(
      normalizeFullRotation(id.verticalRotation),
    );
    const rotation2 = new THREE.Group();
    rotation2.rotation.x = THREE.MathUtils.degToRad(
      normalizeFullRotation(id.stripRollRotation),
    );
    const powResult =
      Math.pow(clampResult, 0.82) * 48 * clamp7 * clamp8 * blfmV3;
    const object3d = new THREE.RectAreaLight(
      value,
      flag ? powResult : 0,
      clamp4 * 0.94,
      clamp5 * 0.94,
    );
    object3d.visible = flag;
    object3d.position.y = -0.04;
    object3d.rotation.x = -Math.PI / 2;
    object3d.userData.lightItemId = id.id;
    object3d.userData.lightGroupId = lightGroup?.id || "";
    object3d.userData.lightFloorId = activeFloorId;
    object3d.userData.lightSourceType = "continuous-area-strip";
    object3d.userData.lightOnIntensity = powResult;
    rotation2.add(object3d);
    rotation.add(rotation2);
    group.add(rotation);
    return;
  }
  const flag5 = has?.has(id.id) === true;
  const flag6 = flag5 || flag3 || flag2;
  const clamp2 = clamp(
    finite(id.lightRange, range.range),
    0.5,
    10,
  );
  const clamp3 = clamp(
    finite(id.lightAngle, range.angle),
    15,
    defaultItemDepth(id.type),
  );
  const blfmV5 = 1;
  const blfmV6 =
    (id.type === "ceilinglight" ? 680 : 520) *
    spotLightBrightnessResponse(id.type, clampResult) *
    blfmV3;
  for (let count = 0; count < blfmV5; count += 1) {
    const blfmV8 =
      blfmV5 === 1
        ? 0
        : -id.width * 0.47 +
          (id.width * 0.94 * count) / (blfmV5 - 1);
    const light = new THREE.SpotLight(
      value,
      flag ? blfmV6 / blfmV5 : 0,
      clamp2,
      THREE.MathUtils.degToRad(clamp3 / 2),
      0.86,
      2,
    );
    light.visible = flag;
    light.position.set(blfmV8, -0.025, 0);
    light.castShadow = false;
    light.layers.enable(HELPER_LAYER);
    if (flag6) {
      const localSpotShadowSettings2 = localSpotShadowSettings(
        id.type,
        clamp2,
        clamp3,
      );
      const scaledShadowMapSizeResult = scaledShadowMapSize(localSpotShadowSettings2.mapSize);
      light.shadow.mapSize.set(scaledShadowMapSizeResult, scaledShadowMapSizeResult);
      light.shadow.camera.near = clamp(clamp2 * 0.05, 0.12, 0.24);
      light.shadow.camera.far = clamp2;
      light.shadow.camera.layers.set(HELPER_LAYER);
      light.shadow.bias = -0.00005;
      light.shadow.normalBias = localSpotShadowSettings2.normalBias;
      light.shadow.radius = localSpotShadowSettings2.radius;
      light.shadow.blurSamples = shadowCameraExpanded
        ? Math.max(8, localSpotShadowSettings2.blurSamples)
        : localSpotShadowSettings2.blurSamples;
      light.shadow.autoUpdate = false;
      light.shadow.needsUpdate = flag5;
    }
    light.userData.lightItemId = id.id;
    light.userData.lightGroupId = lightGroup?.id || "";
    light.userData.lightFloorId = activeFloorId;
    light.userData.lightType = id.type;
    light.userData.lightBrightness = finite(
      id.lightBrightness,
      range.brightness,
    );
    light.userData.shadowCandidate = true;
    light.userData.prewarmShadow = isStageEmbed;
    light.userData.lightOnIntensity = blfmV6 / blfmV5;
    const camera2 = new THREE.Object3D();
    camera2.position.set(
      blfmV8,
      -Math.max(finite(id.elevation, 2.68), 0.8),
      0,
    );
    group.add(camera2);
    light.target = camera2;
    group.add(light);
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
  ].forEach((color, arg1) => {
    const ctstV2 = 54 + arg1 * 142;
    canvasCtx.fillStyle = "#172d40";
    canvasCtx.beginPath();
    canvasCtx.roundRect(ctstV2, 398, 126, 54, 8);
    canvasCtx.fill();
    canvasCtx.fillStyle = color.color;
    canvasCtx.fillRect(ctstV2 + 14, 414, 8, 22);
    canvasCtx.fillStyle = "#dbe5ed";
    canvasCtx.font = "700 13px Arial, sans-serif";
    canvasCtx.fillText(color.label, ctstV2 + 32, 432);
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
  const value = [
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
  for (const planPoint of value) {
    canvasCtx.fillStyle = "#15283a";
    canvasCtx.beginPath();
    canvasCtx.roundRect(planPoint.x, planPoint.y, 176, 108, 10);
    canvasCtx.fill();
    canvasCtx.fillStyle = planPoint.color;
    canvasCtx.fillRect(planPoint.x + 18, planPoint.y + 18, 30, 5);
    canvasCtx.fillStyle = "#f4f8fb";
    canvasCtx.font = "700 29px Arial, sans-serif";
    canvasCtx.fillText(
      planPoint.value,
      planPoint.x + 18,
      planPoint.y + 66,
    );
    canvasCtx.fillStyle = "#8295a6";
    canvasCtx.font = "600 12px Arial, sans-serif";
    canvasCtx.fillText(
      planPoint.label,
      planPoint.x + 18,
      planPoint.y + 89,
    );
  }
  const colorSpace = new THREE.CanvasTexture(el);
  colorSpace.colorSpace = THREE.SRGBColorSpace;
  colorSpace.anisotropy = Math.min(
    renderer?.capabilities?.getMaxAnisotropy?.() || 1,
    8,
  );
  colorSpace.needsUpdate = true;
  return colorSpace;
}
function isMobileTvMount(tvMountStyle, arg1) {
  const flag = tvMountStyle.tvMountStyle === "mobile";
  const flag2 = tvMountStyle.tvMountStyle === "tabletop";
  return {
    bodyHeight: arg1 * (flag ? 0.43 : flag2 ? 0.56 : 0.62),
    centerY: arg1 * (flag ? 0.76 : flag2 ? 0.67 : 0.62),
  };
}
function addTvMountMeshes(
  group,
  tvMountStyle,
  arg2,
  arg3,
  arg4,
) {
  const { bodyHeight: bodyHeight, centerY: centerY } =
    isMobileTvMount(tvMountStyle, arg4);
  const width = arg2 * 0.965;
  const height = bodyHeight * 0.94;
  const depth = 0.012;
  const value = Math.max(arg3 * 0.28, 0.05) * 0.5 + 0.006;
  const z = value - depth * 0.5;
  if (tvMountStyle.screenEnabled === false) {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      centerY,
      z,
      527122,
      {
        roughness: 0.18,
      },
    );
    return;
  }
  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 1.035, height * 1.08),
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
  light.position.set(0, centerY, value - 0.014);
  light.renderOrder = 6;
  light.castShadow = false;
  light.receiveShadow = false;
  group.add(light);
  const map = createTvScreenTexture();
  const meshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 527122,
    toneMapped: false,
  });
  const meshBasicMaterial2 = new THREE.MeshBasicMaterial({
    color: map ? 16777215 : 1519946,
    map: map,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const light2 = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    [meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, meshBasicMaterial, meshBasicMaterial2, meshBasicMaterial],
  );
  light2.position.set(0, centerY, z);
  light2.renderOrder = 7;
  light2.castShadow = false;
  light2.receiveShadow = false;
  group.add(light2);
}
function addSmallCarMeshes(
  group,
  chargingEnabled,
  arg2,
  arg3,
  arg4,
) {
  if (chargingEnabled.chargingEnabled !== true) {
    return;
  }
  const value = 5238711;
  const el = document.createElement("canvas");
  el.width = 256;
  el.height = 256;
  const canvasCtx = el.getContext("2d");
  const ascmV2 = el.width / 2;
  const addColorStop = canvasCtx.createRadialGradient(
    ascmV2,
    ascmV2,
    0,
    ascmV2,
    ascmV2,
    ascmV2,
  );
  addColorStop.addColorStop(0, "rgba(79, 239, 183, .48)");
  addColorStop.addColorStop(0.46, "rgba(79, 239, 183, .23)");
  addColorStop.addColorStop(1, "rgba(79, 239, 183, 0)");
  canvasCtx.fillStyle = addColorStop;
  canvasCtx.fillRect(0, 0, el.width, el.height);
  for (
    let index = 18;
    index < el.height - 18;
    index += 10
  ) {
    for (
      let index2 = 18;
      index2 < el.width - 18;
      index2 += 10
    ) {
      const hypot =
        Math.hypot(index2 - ascmV2, index - ascmV2) /
        ascmV2;
      const maxValue = Math.max(0, 1 - hypot) * 0.32;
      if (!(maxValue <= 0.01)) {
        canvasCtx.fillStyle = "rgba(116, 255, 202, " + maxValue + ")";
        canvasCtx.beginPath();
        canvasCtx.arc(index2, index, 1.45, 0, Math.PI * 2);
        canvasCtx.fill();
      }
    }
  }
  const map = new THREE.CanvasTexture(el);
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;
  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(arg2 * 1.72, arg3 * 1.42),
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
  const light2 = new THREE.Mesh(
    new THREE.ShapeGeometry(lineTo),
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
  const maxValue = Math.max(Math.min(arg2, arg3) * 0.22, 0.18);
  light2.scale.setScalar(maxValue);
  light2.rotation.x = -Math.PI / 2;
  light2.position.set(0, arg4 + 0.04, 0);
  light2.renderOrder = 9;
  light2.castShadow = false;
  light2.receiveShadow = false;
  group.add(light2);
}
function buildItemPreviewGroup(item, lights = null) {
  const group = new THREE.Group();
  group.userData.squareEdges = itemCatalog.has(item.type);
  if (nextBatchOptimizeTypes.has(item.type)) {
    group.userData.optimizationBatch = "v1-next-ten";
  }
  const width = item.width;
  const depth = item.depth;
  const height = item.height;
  const theme = resolvedThemeColors();
  const furniture = theme.furniture;
  const appliance = theme.appliance ?? furniture;
  const emissive = theme.furnitureSoft;
  const color = theme.furnitureLight;
  const color2 = theme.furnitureDark;
  if (lightItemTypes.has(item.type)) {
    buildLightFixtureMeshes(group, item, lights);
    addStripLightHelpers(group, item);
  } else if (item.type === "planlabel") {
    group.add(createPlanLabelSprite(item));
  } else if (
    item.offlineModelExport !== true &&
    ALL_ITEM_MODELS[item.type] &&
    item.type !== "smallcar" &&
    item.type !== "sofa"
  ) {
    if (!attachExternalItemModel(group, item)) {
      addBoxMesh(
        group,
        width,
        height,
        depth,
        0,
        height * 0.5,
        0,
        applianceColorTypes.has(item.type) ? appliance : furniture,
        {
          rounded: false,
          roughness: 0.6,
          metalness: 0.1,
        },
      );
    }
  } else if (item.type === "smallcar") {
    if (!attachExternalItemModel(group, item)) {
      addBoxMesh(
        group,
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
      addBoxMesh(
        group,
        width * 0.78,
        height * 0.42,
        depth * 0.48,
        0,
        height * 0.62,
        -depth * 0.03,
        emissive,
        {
          roughness: 0.38,
          metalness: 0.12,
        },
      );
      for (const factor of [-0.48, 0.48]) {
        for (const factor2 of [-0.3, 0.3]) {
          addBoxMesh(
            group,
            width * 0.1,
            height * 0.22,
            depth * 0.17,
            factor * width,
            height * 0.17,
            factor2 * depth,
            color2,
            {
              rounded: false,
              roughness: 0.82,
            },
          );
        }
      }
    }
    addSmallCarMeshes(
      group,
      item,
      width,
      depth,
      height,
    );
  } else if (item.type === "curtain") {
    const curtainPosition = ["left", "right", "split"].includes(
      item.curtainPosition,
    )
      ? item.curtainPosition
      : "split";
    const d = Math.min(Math.max(depth * 0.09, 0.012), 0.028);
    const h2 = height - d * 1.8;
    const value = h2 - d * 1.8;
    const h = Math.max(height * 0.025, 0.025);
    const height2 = Math.max(value - h, height * 0.72);
    addSoftBoxMesh(
      group,
      d,
      d,
      width * 1.06,
      0,
      h2,
      0,
      color2,
      {
        segments: 18,
        rotationZ: Math.PI / 2,
        metalness: 0.68,
        roughness: 0.22,
      },
    );
    for (const entry of [-width * 0.52, width * 0.52]) {
      addSoftBoxMesh(
        group,
        d * 1.45,
        d * 1.45,
        d * 0.9,
        entry,
        h2,
        0,
        color,
        {
          segments: 18,
          rotationZ: Math.PI / 2,
          metalness: 0.52,
          roughness: 0.26,
        },
      );
    }
    const drawPanel = (arg, arg2) => {
      const bipgV2 = arg2 / 7;
      for (let n = 0; n < 7; n += 1) {
        const x = arg + bipgV2 * (n + 0.5);
        const z =
          n % 2 === 0 ? depth * 0.1 : -depth * 0.1;
        addBoxMesh(
          group,
          bipgV2 * 1.24,
          height2,
          depth * 0.62,
          x,
          h + height2 * 0.5,
          z,
          color,
          {
            radius: Math.min(bipgV2 * 0.34, 0.035),
            roughness: 0.94,
            metalness: 0,
          },
        );
      }
      addBoxMesh(
        group,
        arg2 * 1.03,
        Math.max(height * 0.018, 0.025),
        depth * 0.74,
        arg + arg2 * 0.5,
        h + height * 0.015,
        0,
        color2,
        {
          radius: 0.01,
          roughness: 0.72,
          metalness: 0.02,
        },
      );
      addBoxMesh(
        group,
        arg2 * 1.06,
        Math.max(height * 0.025, 0.035),
        depth * 0.82,
        arg + arg2 * 0.5,
        h + height2 * 0.52,
        0,
        color,
        {
          radius: 0.012,
          roughness: 0.48,
          metalness: 0.08,
        },
      );
    };
    if (curtainPosition === "left") {
      drawPanel(-width * 0.5, width * 0.24);
    } else if (curtainPosition === "right") {
      drawPanel(width * 0.26, width * 0.24);
    } else {
      drawPanel(-width * 0.5, width * 0.16);
      drawPanel(width * 0.34, width * 0.16);
    }
  } else if (stairLikeTypes.has(item.type)) {
    const d = depth / 10;
    for (let n = 0; n < 10; n += 1) {
      const height2 = (height * (n + 1)) / 10;
      const z = -depth * 0.5 + d * (n + 0.5);
      addBoxMesh(
        group,
        width,
        height2,
        d * 1.015,
        0,
        height2 * 0.5,
        z,
        n % 2 ? furniture : emissive,
        {
          rounded: false,
          roughness: 0.82,
        },
      );
      addBoxMesh(
        group,
        width * 1.01,
        0.018,
        d * 0.94,
        0,
        height2 + 0.009,
        z,
        color,
        {
          rounded: false,
          castShadow: false,
          roughness: 0.72,
        },
      );
    }
  } else if (item.type === "sofa") {
    const h = height * 0.14;
    const drawPanel = (arg) => arg - h + -0.008;
    addBoxMesh(
      group,
      width * 0.92,
      height * 0.28,
      depth * 0.72,
      0,
      drawPanel(height * 0.28),
      depth * 0.06,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.92,
      height * 0.55,
      depth * 0.18,
      0,
      drawPanel(height * 0.56),
      -depth * 0.35,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.1,
      height * 0.48,
      depth * 0.75,
      -width * 0.46,
      drawPanel(height * 0.39),
      depth * 0.03,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.1,
      height * 0.48,
      depth * 0.75,
      width * 0.46,
      drawPanel(height * 0.39),
      depth * 0.03,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.42,
      height * 0.12,
      depth * 0.55,
      -width * 0.22,
      drawPanel(height * 0.47),
      depth * 0.07,
      emissive,
    );
    addBoxMesh(
      group,
      width * 0.42,
      height * 0.12,
      depth * 0.55,
      width * 0.22,
      drawPanel(height * 0.47),
      depth * 0.07,
      emissive,
    );
  } else if (item.type === "bed") {
    addBoxMesh(
      group,
      width,
      height * 0.3,
      depth,
      0,
      height * 0.15,
      0,
      color2,
    );
    addBoxMesh(
      group,
      width * 0.96,
      height * 0.32,
      depth * 0.92,
      0,
      height * 0.43,
      depth * 0.03,
      emissive,
    );
    addBoxMesh(
      group,
      width,
      height * 0.95,
      depth * 0.09,
      0,
      height * 0.48,
      -depth * 0.455,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.38,
      height * 0.14,
      depth * 0.22,
      -width * 0.23,
      height * 0.66,
      -depth * 0.29,
      color,
    );
    addBoxMesh(
      group,
      width * 0.38,
      height * 0.14,
      depth * 0.22,
      width * 0.23,
      height * 0.66,
      -depth * 0.29,
      color,
    );
  } else if (item.type === "nightstand") {
    addBoxMesh(
      group,
      width,
      height * 0.78,
      depth,
      0,
      height * 0.49,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width * 1.04,
      height * 0.07,
      depth * 1.05,
      0,
      height * 0.91,
      0,
      emissive,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      0.014,
      depth * 1.01,
      0,
      height * 0.63,
      depth * 0.01,
      color2,
      {
        rounded: false,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      0.014,
      depth * 1.01,
      0,
      height * 0.38,
      depth * 0.01,
      color2,
      {
        rounded: false,
      },
    );
    addBoxMesh(
      group,
      width * 0.22,
      0.022,
      0.032,
      0,
      height * 0.5,
      depth * 0.52,
      color,
      {
        metalness: 0.5,
      },
    );
    for (const factor of [-0.38, 0.38]) {
      for (const factor2 of [-0.35, 0.35]) {
        addBoxMesh(
          group,
          0.035,
          height * 0.2,
          0.035,
          width * factor,
          height * 0.1,
          depth * factor2,
          color2,
          {
            metalness: 0.18,
          },
        );
      }
    }
  } else if (item.type === "table") {
    const width2 = width * 0.64;
    const depth2 = depth * 0.48;
    addBoxMesh(
      group,
      width2,
      height * 0.1,
      depth2,
      0,
      height * 0.93,
      0,
      furniture,
    );
    for (const factor of [-0.43, 0.43]) {
      for (const factor2 of [-0.38, 0.38]) {
        addBoxMesh(
          group,
          0.07,
          height * 0.9,
          0.07,
          width2 * factor,
          height * 0.45,
          depth2 * factor2,
          color2,
        );
      }
    }
    const w = Math.min(width * 0.2, 0.5);
    const d = Math.min(depth * 0.27, 0.5);
    const h = height * 1.18;
    buildTelevisionMesh(
      group,
      w,
      d,
      h,
      -width * 0.37,
      0,
      Math.PI / 2,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h,
      width * 0.37,
      0,
      -Math.PI / 2,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h,
      0,
      -depth * 0.35,
      0,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h,
      0,
      depth * 0.35,
      Math.PI,
      emissive,
      color2,
    );
  } else if (roundTableTypes.has(item.type)) {
    const radius = Math.min(width, depth) * 0.32;
    const legH = Math.max(height * 0.07, 0.045);
    const h = height * 0.92;
    addSoftBoxMesh(
      group,
      radius,
      radius,
      legH,
      0,
      h,
      0,
      color,
      {
        segments: 48,
        roughness: 0.5,
        metalness: 0.08,
      },
    );
    addSoftBoxMesh(
      group,
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
    addSoftBoxMesh(
      group,
      Math.min(width, depth) * 0.34,
      Math.min(width, depth) * 0.34,
      height * 0.07,
      0,
      height * 0.045,
      0,
      color2,
      {
        segments: 40,
        roughness: 0.42,
        metalness: 0.12,
      },
    );
    if (hasRoundTableTurntable(item)) {
      addSoftBoxMesh(
        group,
        radius * 0.58,
        radius * 0.58,
        Math.max(height * 0.035, 0.025),
        0,
        h + legH * 0.58,
        0,
        emissive,
        {
          segments: 48,
          roughness: 0.48,
          metalness: 0.08,
        },
      );
      addSoftBoxMesh(
        group,
        radius * 0.44,
        radius * 0.44,
        0.018,
        0,
        h + legH * 0.58 + 0.036,
        0,
        color2,
        {
          segments: 48,
          roughness: 0.32,
          metalness: 0.12,
        },
      );
    }
    const w = Math.min(width * 0.17, 0.42);
    const d = Math.min(depth * 0.19, 0.44);
    const h2 = height * 1.15;
    buildTelevisionMesh(
      group,
      w,
      d,
      h2,
      -width * 0.38,
      0,
      Math.PI / 2,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h2,
      width * 0.38,
      0,
      -Math.PI / 2,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h2,
      0,
      -depth * 0.38,
      0,
      emissive,
      color2,
    );
    buildTelevisionMesh(
      group,
      w,
      d,
      h2,
      0,
      depth * 0.38,
      Math.PI,
      emissive,
      color2,
    );
  } else if (item.type === "bar") {
    addBoxMesh(
      group,
      width,
      height * 0.12,
      depth,
      0,
      height * 0.94,
      0,
      emissive,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width * 0.86,
      height * 0.48,
      0.035,
      0,
      height * 0.42,
      depth * 0.28,
      color2,
      {
        rounded: false,
        roughness: 0.48,
      },
    );
    for (const factor of [-0.3, 0, 0.3]) {
      addSoftBoxMesh(
        group,
        depth * 0.14,
        depth * 0.14,
        0.045,
        width * factor,
        height * 0.66,
        depth * 0.52,
        emissive,
        {
          segments: 28,
          roughness: 0.52,
        },
      );
      addSoftBoxMesh(
        group,
        0.025,
        0.025,
        height * 0.62,
        width * factor,
        height * 0.34,
        depth * 0.52,
        color2,
        {
          segments: 18,
          metalness: 0.38,
          roughness: 0.28,
        },
      );
      addSoftBoxMesh(
        group,
        depth * 0.1,
        depth * 0.12,
        0.035,
        width * factor,
        0.018,
        depth * 0.52,
        color2,
        {
          segments: 24,
          metalness: 0.3,
          roughness: 0.34,
        },
      );
    }
  } else if (item.type === "aquarium") {
    const height2 = Math.max(height * 0.52, 0.45);
    const h = height2;
    const height3 = Math.max(height - height2, 0.2);
    const depth2 = Math.min(
      Math.max(Math.min(width, depth) * 0.025, 0.012),
      0.028,
    );
    const mesh = {
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
    addBoxMesh(
      group,
      width,
      height2,
      depth,
      0,
      height2 * 0.5,
      0,
      furniture,
      {
        rounded: false,
        roughness: 0.56,
      },
    );
    addBoxMesh(
      group,
      width,
      0.035,
      depth,
      0,
      height2,
      0,
      theme.frame,
      {
        rounded: false,
        metalness: 0.34,
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width - depth2 * 2,
      height3,
      depth2,
      0,
      h + height3 * 0.5,
      -depth * 0.5 + depth2 * 0.5,
      theme.glass,
      mesh,
    );
    addBoxMesh(
      group,
      width - depth2 * 2,
      height3,
      depth2,
      0,
      h + height3 * 0.5,
      depth * 0.5 - depth2 * 0.5,
      theme.glass,
      mesh,
    );
    addBoxMesh(
      group,
      depth2,
      height3,
      depth - depth2 * 2,
      -width * 0.5 + depth2 * 0.5,
      h + height3 * 0.5,
      0,
      theme.glass,
      mesh,
    );
    addBoxMesh(
      group,
      depth2,
      height3,
      depth - depth2 * 2,
      width * 0.5 - depth2 * 0.5,
      h + height3 * 0.5,
      0,
      theme.glass,
      mesh,
    );
  } else if (item.type === "coffeetable") {
    const size = Math.min(width * 0.34, depth * 0.42);
    const size2 = Math.min(width * 0.23, depth * 0.29);
    const w = -width * 0.16;
    const d = depth * 0.08;
    const w2 = width * 0.24;
    const d2 = -depth * 0.2;
    const innerSize = height * 0.58;
    const h = height * 0.76;
    const h2 = height * 0.68;
    const h3 = height * 0.9;
    addSoftBoxMesh(
      group,
      size * 0.3,
      size * 0.5,
      innerSize,
      w,
      innerSize * 0.5,
      d,
      furniture,
      {
        segments: 40,
        roughness: 0.82,
      },
    );
    const legH = height * 0.07;
    const legH2 = height * 0.055;
    const y = innerSize + legH * 0.5 + 0.001;
    const y2 = y + (legH + legH2) * 0.5 + 0.001;
    addSoftBoxMesh(
      group,
      size * 1.02,
      size * 1.02,
      legH,
      w,
      y,
      d,
      color2,
      {
        segments: 48,
        roughness: 0.72,
      },
    );
    addSoftBoxMesh(
      group,
      size,
      size,
      legH2,
      w,
      y2,
      d,
      color,
      {
        segments: 48,
        roughness: 0.9,
      },
    );
    addSoftBoxMesh(
      group,
      size2 * 0.32,
      size2 * 0.52,
      h,
      w2,
      h * 0.5,
      d2,
      emissive,
      {
        segments: 40,
        roughness: 0.82,
      },
    );
    const legH3 = height * 0.07;
    const legH4 = height * 0.055;
    const y3 = h + legH3 * 0.5 + 0.001;
    const y4 = y3 + (legH3 + legH4) * 0.5 + 0.001;
    addSoftBoxMesh(
      group,
      size2 * 1.02,
      size2 * 1.02,
      legH3,
      w2,
      y3,
      d2,
      color2,
      {
        segments: 48,
        roughness: 0.72,
      },
    );
    addSoftBoxMesh(
      group,
      size2,
      size2,
      legH4,
      w2,
      y4,
      d2,
      color,
      {
        segments: 48,
        roughness: 0.9,
      },
    );
  } else if (item.type === "squarecoffeetable") {
    const height2 = Math.max(height * 0.22, 0.085);
    const height3 = Math.max(height * 0.16, 0.065);
    const h = height2 + 0.012;
    const height4 = Math.max(height - h - height3, 0.16);
    const width2 = Math.max(width * 0.075, 0.045);
    const depth2 = Math.max(depth * 0.035, 0.018);
    const height5 = height4 * 0.72;
    const y = h + height4 * 0.48;
    const width3 = width * 0.27;
    const w = width * 0.34;
    const color3 = furniture;
    const color4 = emissive;
    addBoxMesh(
      group,
      width * 0.98,
      height3,
      depth * 1.03,
      0,
      h + height4 + height3 * 0.5,
      0,
      color4,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.5,
        metalness: 0.02,
      },
    );
    addBoxMesh(
      group,
      width2,
      height4,
      depth * 0.92,
      -width * 0.5 + width2 * 0.5,
      h + height4 * 0.5,
      0,
      color3,
      {
        rounded: false,
        roughness: 0.6,
      },
    );
    addBoxMesh(
      group,
      width2,
      height4,
      depth * 0.92,
      width * 0.5 - width2 * 0.5,
      h + height4 * 0.5,
      0,
      color3,
      {
        rounded: false,
        roughness: 0.6,
      },
    );
    addBoxMesh(
      group,
      width * 0.86,
      height4 * 0.9,
      0.035,
      0,
      h + height4 * 0.52,
      -depth * 0.45,
      color3,
      {
        rounded: false,
        roughness: 0.75,
      },
    );
    addBoxMesh(
      group,
      width * 0.86,
      height4 * 0.1,
      depth * 0.9,
      0,
      h + height4 * 0.08,
      0,
      color3,
      {
        rounded: false,
        roughness: 0.58,
      },
    );
    for (const x of [-w, 0, w]) {
      addBoxMesh(
        group,
        width3,
        height5,
        depth2,
        x,
        y,
        depth * 0.48,
        color4,
        {
          radius: Math.min(width, depth) * 0.025,
          roughness: 0.52,
        },
      );
      const x2 =
        x === 0
          ? 0
          : x +
            (x < 0 ? width3 * 0.3 : -width3 * 0.3);
      addBoxMesh(
        group,
        0.022,
        height5 * 0.2,
        0.025,
        x2,
        y,
        depth * 0.505,
        color2,
        {
          radius: 0.009,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
    }
    const width4 = Math.max(
      Math.min(width, depth) * 0.055,
      0.035,
    );
    for (const x of [-width * 0.4, width * 0.4]) {
      for (const z of [-depth * 0.36, depth * 0.36]) {
        const mesh = addBoxMesh(
          group,
          width4,
          height2,
          width4,
          x,
          height2 * 0.5,
          z,
          color2,
          {
            radius: width4 * 0.22,
            roughness: 0.55,
            metalness: 0.02,
          },
        );
        mesh.rotation.z = (x < 0 ? -1 : 1) * 0.09;
        mesh.rotation.x = (z < 0 ? -1 : 1) * 0.06;
      }
    }
  } else if (item.type === "chair") {
    buildTelevisionMesh(
      group,
      width,
      depth,
      height,
      0,
      0,
      0,
      furniture,
      color2,
    );
  } else if (item.type === "sideboard") {
    const h = Math.max(height, 1.8);
    const height2 = h * 0.39;
    const height3 = h * 0.22;
    const h2 = height2 + height3;
    const height4 = h - h2;
    const color3 = emissive;
    const width2 = width * 0.31;
    const height5 = height2 * 0.88;
    const height6 = height4 * 0.86;
    addBoxMesh(
      group,
      width,
      height2,
      depth,
      0,
      height2 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    addBoxMesh(
      group,
      width,
      0.045,
      depth,
      0,
      height2,
      0,
      emissive,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width,
      height3,
      0.045,
      0,
      height2 + height3 * 0.5,
      -depth * 0.46,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    addBoxMesh(
      group,
      width,
      height4,
      depth,
      0,
      h2 + height4 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const factor of [-0.33, 0, 0.33]) {
      addBoxMesh(
        group,
        width2,
        height5,
        0.026,
        width * factor,
        height2 * 0.48,
        depth * 0.515,
        color3,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
      addBoxMesh(
        group,
        width2,
        height6,
        0.026,
        width * factor,
        h2 + height4 * 0.5,
        depth * 0.515,
        color3,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (item.type === "shoecabinet") {
    const h = Math.max(height, 1.9);
    const color3 = emissive;
    const color4 = emissive;
    const width2 = width * 0.5;
    const width3 = width * 0.5;
    const x = -width * 0.25;
    const x2 = width * 0.25;
    const value = h * 0.22;
    const height2 = h * 0.43;
    const height3 = h * 0.21;
    const height4 = h * 0.37;
    addBoxMesh(
      group,
      width * 0.98,
      h * 0.93,
      0.045,
      0,
      h * 0.48,
      -depth * 0.47,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    addBoxMesh(
      group,
      width2,
      value * 0.56,
      depth * 0.92,
      x,
      value * 0.35,
      0,
      furniture,
      {
        roughness: 0.56,
      },
    );
    addBoxMesh(
      group,
      width2 * 1.02,
      0.055,
      depth * 1.04,
      x,
      value * 0.67,
      0,
      color4,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width3,
      height2,
      depth,
      x2,
      height2 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const factor of [-0.245, 0.245]) {
      addBoxMesh(
        group,
        width3 * 0.47,
        height2 * 0.84,
        0.026,
        x2 + width3 * factor,
        height2 * 0.48,
        depth * 0.515,
        color3,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
    const h2 = h - height3 - 0.045;
    addBoxMesh(
      group,
      width2,
      height3,
      depth,
      x,
      h2 + height3 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const factor of [-0.245, 0.245]) {
      addBoxMesh(
        group,
        width2 * 0.47,
        height3 * 0.86,
        0.026,
        x + width2 * factor,
        h2 + height3 * 0.5,
        depth * 0.515,
        color3,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
    const h3 = h - height4 - 0.045;
    addBoxMesh(
      group,
      width3,
      height4,
      depth,
      x2,
      h3 + height4 * 0.5,
      0,
      furniture,
      {
        roughness: 0.58,
      },
    );
    for (const factor of [-0.245, 0.245]) {
      addBoxMesh(
        group,
        width3 * 0.47,
        height4 * 0.9,
        0.026,
        x2 + width3 * factor,
        h3 + height4 * 0.5,
        depth * 0.515,
        color3,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (item.type === "cabinet") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height / 2,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      0.018,
      height * 0.9,
      depth * 1.01,
      0,
      height * 0.52,
      depth * 0.01,
      color2,
    );
    addBoxMesh(
      group,
      0.025,
      0.16,
      0.035,
      -0.08,
      height * 0.55,
      depth * 0.515,
      color,
      {
        metalness: 0.55,
      },
    );
    addBoxMesh(
      group,
      0.025,
      0.16,
      0.035,
      0.08,
      height * 0.55,
      depth * 0.515,
      color,
      {
        metalness: 0.55,
      },
    );
  } else if (item.type === "glasscabinet") {
    const width2 = Math.min(
      Math.max(Math.min(width, depth) * 0.1, 0.032),
      0.058,
    );
    const depth2 = Math.min(Math.max(depth * 0.075, 0.018), 0.032);
    const width3 = Math.min(Math.max(width * 0.014, 0.016), 0.03);
    const width4 = Math.max(width - width2 * 2, width * 0.7);
    const n = 0.13;
    const n2 = 0.3;
    const n3 = 4;
    const y = height * n;
    const h = height * n2;
    const height2 = height - width2 - h;
    const h2 = height2 / n3;
    const ratios = [0.56, 0.24, 0.2];
    const slice = [
      0,
      ratios[0],
      ratios[0] + ratios[1],
    ];
    const value = slice.slice(1);
    const w = Math.max(width * 0.005, 0.005);
    const z = depth * 0.5 + 0.012;
    const mesh = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015,
    };
    const mesh2 = {
      rounded: false,
      roughness: 0.48,
      metalness: 0.035,
    };
    const mesh3 = {
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
    const mesh4 = {
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
    addBoxMesh(
      group,
      width2,
      height,
      depth,
      -width * 0.5 + width2 * 0.5,
      height * 0.5,
      0,
      furniture,
      mesh,
    );
    addBoxMesh(
      group,
      width2,
      height,
      depth,
      width * 0.5 - width2 * 0.5,
      height * 0.5,
      0,
      furniture,
      mesh,
    );
    addBoxMesh(
      group,
      width4,
      height - width2 * 2,
      depth2,
      0,
      height * 0.5,
      -depth * 0.5 + depth2 * 0.5,
      9073497,
      {
        ...mesh,
        roughness: 0.76,
      },
    );
    addBoxMesh(
      group,
      width,
      width2,
      depth,
      0,
      height - width2 * 0.5,
      0,
      furniture,
      mesh,
    );
    for (let n4 = 0; n4 < n3; n4 += 1) {
      addBoxMesh(
        group,
        width4,
        width2 * 0.72,
        depth * 0.9,
        0,
        h + h2 * n4,
        -depth * 0.025,
        emissive,
        mesh,
      );
    }
    addBoxMesh(
      group,
      width4,
      width2 * 0.72,
      depth * 0.9,
      0,
      y,
      -depth * 0.025,
      emissive,
      mesh,
    );
    for (const entry of value) {
      const x = -width4 * 0.5 + width4 * entry;
      addBoxMesh(
        group,
        width2 * 0.72,
        height - width2,
        depth * 0.9,
        x,
        (height - width2) * 0.5,
        -depth * 0.025,
        furniture,
        mesh,
      );
    }
    const height3 = h - y - width2 * 0.9;
    const list = [
      width4 * ratios[0],
      width4 * (1 - ratios[0]),
    ];
    let xCursor = -width4 * 0.5;
    for (
      let n4 = 0;
      n4 < list.length;
      n4 += 1
    ) {
      const width5 = list[n4] - w;
      const x = xCursor + list[n4] * 0.5;
      addBoxMesh(
        group,
        width5,
        height3,
        0.03,
        x,
        y + (h - y) * 0.5,
        z,
        n4 ? emissive : furniture,
        {
          ...mesh2,
          roughness: 0.56,
        },
      );
      xCursor += list[n4];
    }
    for (
      let n4 = 0;
      n4 < ratios.length;
      n4 += 1
    ) {
      const w2 =
        -width4 * 0.5 + width4 * slice[n4];
      const w3 = width4 * ratios[n4];
      const x = w2 + w3 * 0.5;
      const width5 = Math.max(
        w3 - width3 * 1.65,
        w3 * 0.76,
      );
      const height4 = Math.max(
        height2 - width3 * 1.55,
        height2 * 0.86,
      );
      addBoxMesh(
        group,
        width5,
        height4,
        0.018,
        x,
        h + height2 * 0.5,
        z,
        theme.glass,
        mesh3,
      );
      addBoxMesh(
        group,
        width3,
        height2,
        0.032,
        w2 + width3 * 0.5,
        h + height2 * 0.5,
        z + 0.009,
        furniture,
        mesh2,
      );
      if (n4 === ratios.length - 1) {
        addBoxMesh(
          group,
          width3,
          height2,
          0.032,
          w2 + w3 - width3 * 0.5,
          h + height2 * 0.5,
          z + 0.009,
          furniture,
          mesh2,
        );
      }
      const width6 = Math.max(width5 * 0.025, 0.007);
      addBoxMesh(
        group,
        width6,
        height4 * 0.88,
        0.006,
        x - width5 * 0.37,
        h + height2 * 0.52,
        z + 0.014,
        14282227,
        mesh4,
      );
      addBoxMesh(
        group,
        width5 * 0.34,
        Math.max(width3 * 0.11, 0.004),
        0.006,
        x - width5 * 0.18,
        h + height2 * 0.88,
        z + 0.014,
        15267578,
        mesh4,
      );
    }
    addBoxMesh(
      group,
      width4,
      width3,
      0.032,
      0,
      h + width3 * 0.5,
      z + 0.009,
      furniture,
      mesh2,
    );
    addBoxMesh(
      group,
      width4,
      width3,
      0.032,
      0,
      height - width2 - width3 * 0.5,
      z + 0.009,
      furniture,
      mesh2,
    );
    const list2 = [
      14736852,
      13025203,
      10327434,
      7301474,
      emissive,
      color,
    ];
    const drawPanel = (
      arg,
      arg4,
      arg2 = 5,
      arg3 = 0,
    ) => {
      const w2 = width4 * ratios[arg];
      const w3 =
        -width4 * 0.5 + width4 * slice[arg];
      const w4 =
        h + h2 * arg4 + width2 * 0.42;
      const maxValue = Math.max(w2 * 0.022, 0.004);
      const local3 =
        (w2 * 0.72 - maxValue * (arg2 - 1)) / arg2;
      let local4 = w3 + w2 * 0.13;
      for (let n4 = 0; n4 < arg2; n4 += 1) {
        const width5 =
          local3 *
          [0.8, 1.05, 0.9, 0.72, 0.96][(n4 + arg3) % 5];
        const height4 =
          h2 *
          [0.48, 0.58, 0.52, 0.64, 0.55][(n4 * 2 + arg3) % 5];
        addBoxMesh(
          group,
          width5,
          height4,
          depth * 0.42,
          local4 + width5 * 0.5,
          w4 + height4 * 0.5,
          depth * 0.12,
          list2[(n4 + arg3) % list2.length],
          {
            radius: Math.min(width5 * 0.12, 0.009),
            roughness: 0.78,
            metalness: 0,
          },
        );
        local4 += width5 + maxValue;
      }
    };
    const drawPanel2 = (
      arg,
      arg4,
      arg2 = 3,
      arg3 = 0,
    ) => {
      const w2 = width4 * ratios[arg];
      const x =
        -width4 * 0.5 +
        width4 * slice[arg] +
        w2 * 0.5;
      const w3 =
        h + h2 * arg4 + width2 * 0.42;
      for (let n4 = 0; n4 < arg2; n4 += 1) {
        addBoxMesh(
          group,
          w2 * 0.56,
          width2 * 0.48,
          depth * 0.4,
          x,
          w3 + width2 * (0.3 + n4 * 0.52),
          depth * 0.12,
          list2[(n4 + arg3) % list2.length],
          {
            radius: 0.006,
            roughness: 0.78,
            metalness: 0,
          },
        );
      }
    };
    drawPanel(0, 1, 7, 0);
    drawPanel(2, 2, 4, 2);
    drawPanel2(0, 0, 3, 2);
    drawPanel2(1, 2, 3, 4);
    for (const [fx, fy, inset, color3] of [
      [1, 1, 0.16, 12169895],
      [0, 2, 0.075, 9406334],
      [2, 3, 0.14, 13749184],
    ]) {
      const w2 = width4 * ratios[fx];
      const w3 =
        -width4 * 0.5 +
        width4 * slice[fx] +
        w2 * 0.5;
      const w4 =
        h + h2 * fy + width2 * 0.42;
      addSoftBoxMesh(
        group,
        w2 * inset * 0.72,
        w2 * inset,
        h2 * 0.46,
        w3,
        w4 + h2 * 0.23,
        depth * 0.12,
        color3,
        {
          segments: 24,
          roughness: 0.68,
        },
      );
    }
  } else if (item.type === "bookcase") {
    const width2 = Math.min(
      Math.max(Math.min(width, depth) * 0.11, 0.032),
      0.062,
    );
    const depth2 = Math.min(Math.max(depth * 0.075, 0.018), 0.032);
    const width3 = Math.max(width - width2 * 2, width * 0.72);
    const n = 0.255;
    const list2 = [n, 0.47, 0.59, 0.79];
    const y = height - width2 * 0.5;
    const w2 = width3 * 0.27;
    const x = width * 0.5 - width2 * 1.5 - w2;
    const w3 = width3 - w2 - width2;
    const x2 = -width3 * 0.5 + w3 * 0.5;
    const w4 = width3 * 0.5 - w2 * 0.5;
    const mesh = {
      rounded: false,
      roughness: 0.62,
      metalness: 0.015,
    };
    const z = depth * 0.5 + 0.013;
    addBoxMesh(
      group,
      width2,
      height,
      depth,
      -width * 0.5 + width2 * 0.5,
      height * 0.5,
      0,
      furniture,
      mesh,
    );
    addBoxMesh(
      group,
      width2,
      height,
      depth,
      width * 0.5 - width2 * 0.5,
      height * 0.5,
      0,
      furniture,
      mesh,
    );
    addBoxMesh(
      group,
      width3,
      height * 0.95,
      depth2,
      0,
      height * 0.5,
      -depth * 0.5 + depth2 * 0.5,
      color2,
      {
        ...mesh,
        roughness: 0.76,
      },
    );
    addBoxMesh(
      group,
      width3,
      height * n - width2 * 0.5,
      depth * 0.9,
      0,
      height * n * 0.5,
      -depth * 0.025,
      emissive,
      {
        ...mesh,
        roughness: 0.66,
      },
    );
    for (const item2 of list2) {
      addBoxMesh(
        group,
        width3,
        width2,
        depth,
        0,
        height * item2,
        0,
        emissive,
        mesh,
      );
    }
    addBoxMesh(
      group,
      width,
      width2,
      depth,
      0,
      y,
      0,
      furniture,
      mesh,
    );
    const value = height * list2[1] + width2 * 0.5;
    const local2 = height - width2;
    addBoxMesh(
      group,
      width2,
      local2 - value,
      depth,
      x,
      (local2 + value) * 0.5,
      0,
      furniture,
      mesh,
    );
    const n2 = 3;
    const w5 = width2 * 0.72;
    const local3 = height * n - width2 * 0.5;
    const h = Math.max(local3 - w5, height * 0.16);
    const w = Math.max(width * 0.008, 0.008);
    const w6 = -width3 * 0.18;
    const width4 = w6 + width3 * 0.5 - w * 0.5;
    const width5 = width3 - width4 - w;
    const height2 =
      (h - w * (n2 - 1)) / n2;
    for (let n3 = 0; n3 < n2; n3 += 1) {
      const y2 =
        w5 + height2 * 0.5 + n3 * (height2 + w);
      addBoxMesh(
        group,
        width4,
        height2,
        0.026,
        -width3 * 0.5 + width4 * 0.5,
        y2,
        z,
        furniture,
        {
          ...mesh,
          roughness: 0.55,
        },
      );
      addBoxMesh(
        group,
        width5,
        height2,
        0.026,
        w6 + w * 0.5 + width5 * 0.5,
        y2,
        z,
        emissive,
        {
          ...mesh,
          roughness: 0.55,
        },
      );
    }
    const height3 =
      height * (list2[2] - list2[1]) - width2 * 1.15;
    addBoxMesh(
      group,
      w3 * 0.97,
      height3,
      0.028,
      x2,
      height * (list2[1] + list2[2]) * 0.5,
      z,
      furniture,
      {
        ...mesh,
        roughness: 0.54,
      },
    );
    const list = [
      14276045,
      12499117,
      10459536,
      7828334,
      color,
      emissive,
    ];
    const legH = ({
      startX: startX,
      maxWidth: maxWidth,
      shelfY: shelfY4,
      availableHeight: availableHeight,
      count: count = 6,
      seed: seed = 0,
    }) => {
      const maxValue = Math.max(maxWidth * 0.018, 0.006);
      const maxValue2 = Math.max(
        (maxWidth - maxValue * (count + 1)) / count,
        0.026,
      );
      let local7 = startX + maxValue;
      for (let n3 = 0; n3 < count; n3 += 1) {
        const local8 = [0.72, 0.9, 0.78, 1.04, 0.82, 0.68][
          (n3 + seed) % 6
        ];
        const width6 = maxValue2 * local8;
        const local9 = [0.72, 0.88, 0.78, 0.94, 0.82, 0.68][
          (n3 * 2 + seed) % 6
        ];
        const height4 = availableHeight * local9;
        if (
          local7 + width6 >
          startX + maxWidth - maxValue
        ) {
          break;
        }
        const mesh2 = addBoxMesh(
          group,
          width6,
          height4,
          depth * (0.47 + ((n3 + seed) % 3) * 0.045),
          local7 + width6 * 0.5,
          shelfY4 + height4 * 0.5,
          depth * 0.15,
          list[(n3 + seed) % list.length],
          {
            radius: Math.min(width6 * 0.14, 0.012),
            roughness: 0.78,
            metalness: 0,
          },
        );
        if (n3 === count - 1 && seed % 2 === 1) {
          mesh2.rotation.z = -0.07;
        }
        local7 += width6 + maxValue;
      }
    };
    const drawPanel = (
      x3,
      arg,
      width6,
      arg2 = 3,
      arg3 = 0,
    ) => {
      for (let n3 = 0; n3 < arg2; n3 += 1) {
        addBoxMesh(
          group,
          width6,
          width2 * 0.54,
          depth * 0.48,
          x3,
          arg + width2 * (0.38 + n3 * 0.56),
          depth * 0.15,
          list[(n3 + arg3) % list.length],
          {
            radius: 0.007,
            roughness: 0.78,
            metalness: 0,
          },
        );
      }
    };
    const shelfY = height * list2[0] + width2 * 0.5;
    legH({
      startX: -width3 * 0.47,
      maxWidth: width3 * 0.29,
      shelfY: shelfY,
      availableHeight: height * 0.15,
      count: 5,
      seed: 2,
    });
    legH({
      startX: width3 * 0.04,
      maxWidth: width3 * 0.38,
      shelfY: shelfY,
      availableHeight: height * 0.16,
      count: 7,
      seed: 4,
    });
    const shelfY2 = height * list2[1] + width2 * 0.5;
    legH({
      startX: x + width2 * 0.6,
      maxWidth: w2 * 0.82,
      shelfY: shelfY2,
      availableHeight: height * 0.075,
      count: 4,
      seed: 1,
    });
    const shelfY3 = height * list2[2] + width2 * 0.5;
    legH({
      startX: -width3 * 0.47,
      maxWidth: w3 * 0.42,
      shelfY: shelfY3,
      availableHeight: height * 0.14,
      count: 6,
      seed: 0,
    });
    addBoxMesh(
      group,
      w3 * 0.17,
      height * 0.12,
      0.022,
      x2 + w3 * 0.27,
      shelfY3 + height * 0.065,
      depth * 0.22,
      11972517,
      {
        rounded: false,
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      w3 * 0.125,
      height * 0.085,
      0.026,
      x2 + w3 * 0.27,
      shelfY3 + height * 0.065,
      depth * 0.235,
      7762283,
      {
        rounded: false,
        roughness: 0.42,
      },
    );
    drawPanel(w4, shelfY3, w2 * 0.48, 3, 3);
    const local4 = height * list2[3] + width2 * 0.5;
    drawPanel(
      x2 - w3 * 0.22,
      local4,
      w3 * 0.24,
      2,
      1,
    );
    addSoftBoxMesh(
      group,
      w3 * 0.055,
      w3 * 0.075,
      height * 0.12,
      x2 - w3 * 0.08,
      local4 + height * 0.06,
      depth * 0.12,
      5196615,
      {
        segments: 22,
        roughness: 0.66,
      },
    );
    addSoftBoxMesh(
      group,
      w3 * 0.045,
      w3 * 0.064,
      height * 0.15,
      x2 + w3 * 0.08,
      local4 + height * 0.075,
      depth * 0.12,
      6643802,
      {
        segments: 22,
        roughness: 0.66,
      },
    );
    drawPanel(w4, local4, w2 * 0.5, 2, 4);
  } else if (item.type === "shelf") {
    const width2 = Math.min(
      Math.max(Math.min(width, depth) * 0.07, 0.028),
      0.052,
    );
    const height2 = Math.min(Math.max(height * 0.022, 0.028), 0.052);
    const depth2 = Math.max(
      depth - width2 * 1.4,
      depth * 0.78,
    );
    const mesh = {
      rounded: false,
      metalness: 0.62,
      roughness: 0.28,
    };
    const mesh2 = {
      rounded: false,
      metalness: 0.18,
      roughness: 0.48,
    };
    for (const x of [
      -width * 0.5 + width2 * 0.5,
      width * 0.5 - width2 * 0.5,
    ]) {
      for (const z of [
        -depth * 0.5 + width2 * 0.5,
        depth * 0.5 - width2 * 0.5,
      ]) {
        addBoxMesh(
          group,
          width2,
          height,
          width2,
          x,
          height * 0.5,
          z,
          furniture,
          mesh,
        );
      }
    }
    for (const factor of [0.04, 0.26, 0.49, 0.72, 0.96]) {
      addBoxMesh(
        group,
        width,
        height2,
        depth2,
        0,
        height * factor,
        0,
        factor === 0.96 ? color : emissive,
        mesh2,
      );
      addBoxMesh(
        group,
        width,
        width2 * 0.65,
        width2,
        0,
        height * factor,
        -depth * 0.5 + width2 * 0.5,
        furniture,
        mesh,
      );
    }
    const w = Math.max(width - width2 * 2, width2);
    const h = height * 0.84;
    const height3 = Math.hypot(w, h);
    for (const factor of [-1, 1]) {
      const mesh3 = addBoxMesh(
        group,
        width2 * 0.48,
        height3,
        width2 * 0.42,
        0,
        height * 0.5,
        -depth * 0.5 + width2 * 0.18,
        furniture,
        {
          ...mesh,
          castShadow: false,
        },
      );
      mesh3.rotation.z = factor * Math.atan2(w, h);
    }
  } else if (item.type === "pillar") {
    const opacity = Math.min(theme.wallOpacity * 1.75, 0.55);
    const material = createGlassMaterial(theme.wall, opacity, {
      depthWrite: false,
      depthFunc: THREE.LessDepth,
    });
    const $0_2161 = createWallTopMaterial(theme.wall, opacity, {
      topColor: theme.wallTop ?? theme.wall,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      [material, material, $0_2161, material, material, material],
    );
    mesh.position.y = height * 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.renderOrder = 4;
    mesh.layers.set(HELPER_LAYER);
    group.add(mesh);
  } else if (item.type === "wallcabinet") {
    const height2 = height * 0.28;
    const height3 = height - height2;
    const y = 1.4 + height2;
    addBoxMesh(
      group,
      width,
      height3,
      depth,
      0,
      y + height3 * 0.5,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width,
      height2,
      0.045,
      0,
      1.4 + height2 * 0.5,
      -depth * 0.45,
      furniture,
      {
        rounded: false,
        roughness: 0.62,
      },
    );
    addBoxMesh(
      group,
      width * 1.02,
      0.045,
      depth * 1.05,
      0,
      1.4,
      0,
      emissive,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width * 1.02,
      0.045,
      depth * 1.05,
      0,
      y,
      0,
      emissive,
      {
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      0.045,
      height2,
      depth,
      -width * 0.49,
      1.4 + height2 * 0.5,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      0.045,
      height2,
      depth,
      width * 0.49,
      1.4 + height2 * 0.5,
      0,
      furniture,
    );
    const width2 = width * 0.31;
    for (const factor of [-0.33, 0, 0.33]) {
      addBoxMesh(
        group,
        width2,
        height3 * 0.9,
        0.026,
        width * factor,
        y + height3 * 0.5,
        depth * 0.515,
        emissive,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (
    ["kitchenbase", "kitchensink", "kitchencooktop"].includes(item.type)
  ) {
    const height2 = height * 0.1;
    const height3 = height * 0.07;
    const height4 = height - height2 - height3;
    const y = height2 + height4 * 0.5;
    addBoxMesh(
      group,
      width * 0.96,
      height2,
      depth * 0.8,
      0,
      height2 * 0.5,
      -depth * 0.06,
      color2,
      {
        rounded: false,
        roughness: 0.52,
      },
    );
    addBoxMesh(
      group,
      width,
      height4,
      depth,
      0,
      y,
      0,
      furniture,
      {
        rounded: false,
        roughness: 0.58,
      },
    );
    addBoxMesh(
      group,
      width * 1.02,
      height3,
      depth * 1.04,
      0,
      height - height3 * 0.5,
      0,
      color,
      {
        rounded: false,
        roughness: 0.42,
      },
    );
    const w = Math.max(2, Math.min(6, Math.round(width / 0.6)));
    const w2 = width / w;
    for (let n = 0; n < w; n += 1) {
      const x = -width * 0.5 + w2 * (n + 0.5);
      addBoxMesh(
        group,
        w2 * 0.92,
        height4 * 0.9,
        0.025,
        x,
        y,
        depth * 0.515,
        emissive,
        {
          rounded: false,
          roughness: 0.46,
        },
      );
      addBoxMesh(
        group,
        w2 * 0.28,
        0.022,
        0.03,
        x,
        height2 + height4 * 0.83,
        depth * 0.535,
        color2,
        {
          rounded: false,
          metalness: 0.28,
          roughness: 0.3,
        },
      );
    }
    if (item.type === "kitchensink") {
      addBoxMesh(
        group,
        width * 0.42,
        0.025,
        depth * 0.52,
        0,
        height + 0.008,
        0,
        color2,
        {
          rounded: false,
          metalness: 0.42,
          roughness: 0.28,
        },
      );
      addBoxMesh(
        group,
        width * 0.34,
        0.02,
        depth * 0.4,
        0,
        height + 0.022,
        0,
        emissive,
        {
          rounded: false,
          metalness: 0.18,
          roughness: 0.34,
        },
      );
      addSoftBoxMesh(
        group,
        0.018,
        0.018,
        height * 0.22,
        width * 0.22,
        height + height * 0.11,
        -depth * 0.17,
        color2,
        {
          segments: 20,
          metalness: 0.65,
          roughness: 0.2,
        },
      );
      addBoxMesh(
        group,
        width * 0.16,
        0.035,
        0.035,
        width * 0.14,
        height + height * 0.2,
        -depth * 0.17,
        color2,
        {
          rounded: false,
          metalness: 0.65,
          roughness: 0.2,
        },
      );
    } else if (item.type === "kitchencooktop") {
      addBoxMesh(
        group,
        width * 0.48,
        0.025,
        depth * 0.55,
        0,
        height + 0.008,
        0,
        color2,
        {
          rounded: false,
          metalness: 0.32,
          roughness: 0.25,
        },
      );
      for (const value of [-width * 0.13, width * 0.13]) {
        for (const entry of [-depth * 0.14, depth * 0.14]) {
          addSoftBoxMesh(
            group,
            width * 0.06,
            width * 0.06,
            0.018,
            value,
            height + 0.028,
            entry,
            emissive,
            {
              segments: 28,
              metalness: 0.42,
              roughness: 0.26,
            },
          );
          addSoftBoxMesh(
            group,
            width * 0.025,
            width * 0.025,
            0.025,
            value,
            height + 0.045,
            entry,
            color2,
            {
              segments: 24,
              metalness: 0.5,
              roughness: 0.22,
            },
          );
        }
      }
    }
  } else if (item.type === "fridge") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height / 2,
      0,
      color,
      {
        metalness: 0.18,
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width * 0.88,
      0.018,
      depth * 1.01,
      0,
      height * 0.42,
      depth * 0.01,
      color2,
      {
        metalness: 0.5,
      },
    );
    addBoxMesh(
      group,
      0.025,
      height * 0.27,
      0.035,
      width * 0.35,
      height * 0.65,
      depth * 0.515,
      color2,
      {
        metalness: 0.7,
      },
    );
  } else if (item.type === "storagewaterheater") {
    const value = Math.min(depth * 0.43, height * 0.44);
    const h = height * 0.52;
    addBoxMesh(
      group,
      width * 0.78,
      height * 0.12,
      depth * 0.22,
      0,
      height * 0.1,
      -depth * 0.36,
      color2,
      {
        rounded: false,
        metalness: 0.55,
        roughness: 0.3,
      },
    );
    addSoftBoxMesh(
      group,
      value,
      value,
      width * 0.82,
      0,
      h,
      0,
      color,
      {
        segments: 36,
        rotationZ: Math.PI / 2,
        metalness: 0.2,
        roughness: 0.42,
      },
    );
    for (const entry of [-width * 0.43, width * 0.43]) {
      addSoftBoxMesh(
        group,
        value * 1.03,
        value * 1.03,
        0.025,
        entry,
        h,
        0,
        emissive,
        {
          segments: 36,
          rotationZ: Math.PI / 2,
          metalness: 0.28,
          roughness: 0.34,
        },
      );
    }
    addBoxMesh(
      group,
      width * 0.31,
      height * 0.23,
      0.026,
      0,
      height * 0.51,
      depth * 0.44,
      color2,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.25,
      },
    );
    addBoxMesh(
      group,
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
    for (const entry of [-width * 0.28, width * 0.28]) {
      addSoftBoxMesh(
        group,
        0.022,
        0.022,
        height * 0.16,
        entry,
        height * 0.08,
        depth * 0.12,
        entry < 0 ? 4885698 : 12868184,
        {
          segments: 18,
          metalness: 0.55,
          roughness: 0.24,
        },
      );
      addSoftBoxMesh(
        group,
        0.04,
        0.04,
        0.028,
        entry,
        0.015,
        depth * 0.12,
        color2,
        {
          segments: 20,
          metalness: 0.45,
          roughness: 0.28,
        },
      );
    }
  } else if (item.type === "gaswaterheater") {
    const height2 = height * 0.82;
    addBoxMesh(
      group,
      width,
      height2,
      depth,
      0,
      height * 0.47,
      0,
      color,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.46,
      },
    );
    addBoxMesh(
      group,
      width * 0.86,
      height2 * 0.42,
      0.026,
      0,
      height * 0.55,
      depth * 0.515,
      emissive,
      {
        rounded: false,
        roughness: 0.36,
      },
    );
    addBoxMesh(
      group,
      width * 0.44,
      height2 * 0.18,
      0.018,
      0,
      height * 0.67,
      depth * 0.54,
      color2,
      {
        rounded: false,
        metalness: 0.14,
        roughness: 0.22,
      },
    );
    for (let n = 0; n < 5; n += 1) {
      addBoxMesh(
        group,
        width * 0.62,
        0.012,
        0.02,
        0,
        height * (0.24 + n * 0.07),
        depth * 0.525,
        color2,
        {
          rounded: false,
          roughness: 0.3,
        },
      );
    }
    addSoftBoxMesh(
      group,
      depth * 0.17,
      depth * 0.17,
      height * 0.18,
      0,
      height * 0.91,
      0,
      color2,
      {
        segments: 24,
        metalness: 0.58,
        roughness: 0.24,
      },
    );
    addSoftBoxMesh(
      group,
      depth * 0.22,
      depth * 0.22,
      0.035,
      0,
      height * 0.84,
      0,
      emissive,
      {
        segments: 24,
        metalness: 0.5,
        roughness: 0.25,
      },
    );
    for (const [fx, color3] of [
      [-width * 0.28, 4885698],
      [0, 9410205],
      [width * 0.28, 12868184],
    ]) {
      addSoftBoxMesh(
        group,
        0.018,
        0.018,
        height * 0.18,
        fx,
        height * 0.09,
        depth * 0.12,
        color3,
        {
          segments: 18,
          metalness: 0.62,
          roughness: 0.22,
        },
      );
      addSoftBoxMesh(
        group,
        0.034,
        0.034,
        0.025,
        fx,
        0.014,
        depth * 0.12,
        color2,
        {
          segments: 18,
          metalness: 0.5,
          roughness: 0.25,
        },
      );
    }
  } else if (item.type === "pipelinewaterpurifier") {
    const height2 = height * 0.9;
    addBoxMesh(
      group,
      width,
      height2,
      depth,
      0,
      height2 * 0.5,
      0,
      color,
      {
        rounded: false,
        metalness: 0.04,
        roughness: 0.4,
      },
    );
    addBoxMesh(
      group,
      width * 0.92,
      height2 * 0.27,
      0.028,
      0,
      height * 0.76,
      depth * 0.515,
      color2,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.18,
      },
    );
    addBoxMesh(
      group,
      width * 0.34,
      height2 * 0.045,
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
    for (const factor of [-0.26, 0, 0.26]) {
      addSoftBoxMesh(
        group,
        Math.min(width, depth) * 0.055,
        Math.min(width, depth) * 0.055,
        0.018,
        width * factor,
        height * 0.66,
        depth * 0.535,
        emissive,
        {
          segments: 24,
          rotationX: Math.PI / 2,
          metalness: 0.22,
          roughness: 0.28,
        },
      );
    }
    for (const value of [-width * 0.2, width * 0.2]) {
      addSoftBoxMesh(
        group,
        0.014,
        0.014,
        height * 0.12,
        value,
        height * 0.49,
        depth * 0.48,
        color2,
        {
          segments: 18,
          metalness: 0.46,
          roughness: 0.22,
        },
      );
      addSoftBoxMesh(
        group,
        0.024,
        0.018,
        0.035,
        value,
        height * 0.425,
        depth * 0.52,
        color2,
        {
          segments: 18,
          rotationX: Math.PI / 2,
          metalness: 0.46,
          roughness: 0.22,
        },
      );
    }
    addBoxMesh(
      group,
      width * 0.68,
      height * 0.045,
      depth * 0.52,
      0,
      height * 0.11,
      depth * 0.16,
      color2,
      {
        rounded: false,
        metalness: 0.2,
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width * 0.42,
      0.028,
      depth * 0.28,
      0,
      height * 0.16,
      depth * 0.28,
      emissive,
      {
        rounded: false,
        roughness: 0.34,
      },
    );
  } else if (item.type === "tea_bar_machine") {
    const height2 = height * 0.67;
    const y = height2 + height * 0.045;
    const height3 = height - y;
    addBoxMesh(
      group,
      width,
      height2,
      depth,
      0,
      height2 * 0.5,
      0,
      color,
      {
        rounded: false,
        roughness: 0.5,
        metalness: 0.04,
      },
    );
    addBoxMesh(
      group,
      width * 0.94,
      0.028,
      depth * 1.02,
      0,
      height2 * 0.5,
      depth * 0.515,
      color2,
      {
        rounded: false,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      width * 0.94,
      0.032,
      depth * 1.02,
      0,
      height2,
      0,
      emissive,
      {
        rounded: false,
        roughness: 0.42,
      },
    );
    addBoxMesh(
      group,
      width * 0.94,
      height * 0.04,
      depth * 1.04,
      0,
      y,
      0,
      color,
      {
        rounded: false,
        roughness: 0.36,
        metalness: 0.1,
      },
    );
    addBoxMesh(
      group,
      width * 0.92,
      height3,
      0.032,
      0,
      y + height3 * 0.5,
      -depth * 0.46,
      emissive,
      {
        rounded: false,
        roughness: 0.56,
      },
    );
    for (const x of [-width * 0.46, width * 0.46]) {
      addBoxMesh(
        group,
        width * 0.075,
        height3,
        depth * 0.78,
        x,
        y + height3 * 0.5,
        0,
        color,
        {
          rounded: false,
          roughness: 0.48,
        },
      );
    }
    addBoxMesh(
      group,
      width * 0.86,
      height * 0.14,
      depth * 0.18,
      0,
      height * 0.9,
      depth * 0.48,
      color2,
      {
        rounded: false,
        metalness: 0.32,
        roughness: 0.22,
      },
    );
    for (const x of [-width * 0.22, width * 0.22]) {
      addSoftBoxMesh(
        group,
        Math.min(width, depth) * 0.035,
        Math.min(width, depth) * 0.035,
        0.018,
        x,
        height * 0.9,
        depth * 0.585,
        emissive,
        {
          segments: 20,
          rotationX: Math.PI / 2,
          metalness: 0.2,
          roughness: 0.25,
        },
      );
      addSoftBoxMesh(
        group,
        0.012,
        0.012,
        height * 0.11,
        x,
        height * 0.79,
        depth * 0.5,
        color2,
        {
          segments: 18,
          metalness: 0.48,
          roughness: 0.22,
        },
      );
      const radius = Math.min(width, depth) * 0.16;
      addSoftBoxMesh(
        group,
        radius * 0.9,
        radius,
        height * 0.13,
        x,
        height * 0.75,
        depth * 0.12,
        x < 0 ? 8752009 : emissive,
        {
          segments: 28,
          metalness: 0.08,
          roughness: 0.34,
        },
      );
      addSoftBoxMesh(
        group,
        radius * 0.84,
        radius * 0.84,
        0.016,
        x,
        height * 0.82,
        depth * 0.12,
        color2,
        {
          segments: 28,
          metalness: 0.18,
          roughness: 0.28,
        },
      );
      addBoxMesh(
        group,
        width * 0.12,
        height * 0.06,
        0.016,
        x,
        height * 0.77,
        depth * 0.3,
        color2,
        {
          radius: 0.012,
          metalness: 0.24,
          roughness: 0.24,
        },
      );
    }
    addBoxMesh(
      group,
      width * 0.92,
      height * 0.055,
      depth * 0.82,
      0,
      0.028,
      0,
      color2,
      {
        rounded: false,
        roughness: 0.36,
      },
    );
  } else if (item.type === "washer" || item.type === "dryer") {
    const isDryer = item.type === "dryer";
    const w = width * (isDryer ? 0.32 : 0.29);
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      color,
      {
        rounded: false,
        metalness: 0.1,
        roughness: 0.48,
      },
    );
    addBoxMesh(
      group,
      width * 0.92,
      height * 0.18,
      0.035,
      0,
      height * 0.86,
      depth * 0.505,
      emissive,
      {
        rounded: false,
        roughness: 0.4,
      },
    );
    addSoftBoxMesh(
      group,
      w,
      w,
      0.045,
      0,
      height * 0.47,
      depth * 0.515,
      color2,
      {
        segments: 40,
        rotationX: Math.PI / 2,
        metalness: 0.32,
        roughness: 0.28,
      },
    );
    addSoftBoxMesh(
      group,
      w * 0.74,
      w * 0.74,
      0.03,
      0,
      height * 0.47,
      depth * 0.545,
      isDryer ? 2502715 : 3622485,
      {
        segments: 40,
        rotationX: Math.PI / 2,
        metalness: 0.08,
        roughness: 0.22,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.055,
      width * 0.055,
      0.035,
      width * 0.27,
      height * 0.86,
      depth * 0.535,
      color2,
      {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.4,
        roughness: 0.25,
      },
    );
    addBoxMesh(
      group,
      width * 0.25,
      height * 0.035,
      0.026,
      -width * 0.23,
      height * 0.86,
      depth * 0.535,
      color2,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    if (!isDryer) {
      addBoxMesh(
        group,
        width * 0.2,
        height * 0.055,
        0.025,
        -width * 0.3,
        height * 0.12,
        depth * 0.525,
        emissive,
        {
          rounded: false,
          roughness: 0.42,
        },
      );
    }
  } else if (item.type === "dishwasher") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      color,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.48,
      },
    );
    addBoxMesh(
      group,
      width * 0.93,
      height * 0.74,
      0.028,
      0,
      height * 0.46,
      depth * 0.515,
      emissive,
      {
        rounded: false,
        metalness: 0.08,
        roughness: 0.44,
      },
    );
    addBoxMesh(
      group,
      width * 0.93,
      height * 0.14,
      0.032,
      0,
      height * 0.87,
      depth * 0.52,
      color2,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width * 0.58,
      height * 0.026,
      0.034,
      0,
      height * 0.78,
      depth * 0.54,
      color2,
      {
        rounded: false,
        metalness: 0.5,
        roughness: 0.22,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      height * 0.075,
      depth * 0.78,
      0,
      height * 0.038,
      -depth * 0.04,
      color2,
      {
        rounded: false,
        roughness: 0.4,
      },
    );
    for (const factor of [0.22, 0.31, 0.4]) {
      addSoftBoxMesh(
        group,
        width * 0.018,
        width * 0.018,
        0.012,
        width * factor,
        height * 0.88,
        depth * 0.545,
        emissive,
        {
          segments: 18,
          rotationX: Math.PI / 2,
          metalness: 0.26,
          roughness: 0.24,
        },
      );
    }
  } else if (item.type === "steamoven") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      color,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.42,
      },
    );
    addBoxMesh(
      group,
      width * 0.94,
      height * 0.9,
      0.026,
      0,
      height * 0.5,
      depth * 0.515,
      color2,
      {
        rounded: false,
        metalness: 0.18,
        roughness: 0.25,
      },
    );
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width * 0.72,
      height * 0.035,
      0.038,
      -width * 0.03,
      height * 0.74,
      depth * 0.56,
      emissive,
      {
        rounded: false,
        metalness: 0.52,
        roughness: 0.22,
      },
    );
    addBoxMesh(
      group,
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
    for (const factor of [-0.36, 0.36]) {
      addSoftBoxMesh(
        group,
        width * 0.045,
        width * 0.045,
        0.026,
        width * factor,
        height * 0.86,
        depth * 0.55,
        emissive,
        {
          segments: 24,
          rotationX: Math.PI / 2,
          metalness: 0.4,
          roughness: 0.24,
        },
      );
    }
  } else if (item.type === "microwave") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      color,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.44,
      },
    );
    addBoxMesh(
      group,
      width * 0.93,
      height * 0.82,
      0.025,
      0,
      height * 0.49,
      depth * 0.515,
      color2,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.24,
      },
    );
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width * 0.035,
      height * 0.54,
      0.03,
      width * 0.19,
      height * 0.48,
      depth * 0.55,
      emissive,
      {
        rounded: false,
        metalness: 0.46,
        roughness: 0.22,
      },
    );
    addBoxMesh(
      group,
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
    for (const factor of [0.48, 0.34, 0.2]) {
      addBoxMesh(
        group,
        width * 0.13,
        height * 0.055,
        0.018,
        width * 0.36,
        height * factor,
        depth * 0.545,
        emissive,
        {
          rounded: false,
          roughness: 0.3,
        },
      );
    }
  } else if (item.type === "ricecooker") {
    const radius = Math.min(width, depth) * 0.47;
    addSoftBoxMesh(
      group,
      radius * 0.9,
      radius,
      height * 0.68,
      0,
      height * 0.38,
      0,
      color,
      {
        segments: 36,
        roughness: 0.46,
      },
    );
    addSoftBoxMesh(
      group,
      radius * 0.94,
      radius * 0.94,
      height * 0.12,
      0,
      height * 0.77,
      0,
      emissive,
      {
        segments: 36,
        roughness: 0.38,
      },
    );
    addSoftBoxMesh(
      group,
      radius * 0.72,
      radius * 0.74,
      height * 0.035,
      0,
      height * 0.85,
      0,
      color2,
      {
        segments: 32,
        metalness: 0.12,
        roughness: 0.28,
      },
    );
    addBoxMesh(
      group,
      width * 0.5,
      height * 0.16,
      0.026,
      0,
      height * 0.42,
      depth * 0.47,
      color2,
      {
        radius: Math.min(width, depth) * 0.04,
        roughness: 0.28,
      },
    );
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width * 0.05,
      height * 0.16,
      depth * 0.1,
      -width * 0.27,
      height * 0.86,
      0,
      color2,
      {
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width * 0.05,
      height * 0.16,
      depth * 0.1,
      width * 0.27,
      height * 0.86,
      0,
      color2,
      {
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width * 0.58,
      height * 0.055,
      depth * 0.1,
      0,
      height * 0.94,
      0,
      color2,
      {
        roughness: 0.3,
      },
    );
  } else if (item.type === "rangehood") {
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width,
      height * 0.22,
      depth,
      0,
      height * 0.18,
      0,
      color,
      {
        rounded: false,
        metalness: 0.2,
        roughness: 0.4,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      height * 0.07,
      depth * 0.8,
      0,
      height * 0.055,
      depth * 0.02,
      color2,
      {
        rounded: false,
        metalness: 0.35,
        roughness: 0.28,
      },
    );
    addBoxMesh(
      group,
      width * 0.22,
      height * 0.035,
      0.025,
      width * 0.3,
      height * 0.2,
      depth * 0.515,
      emissive,
      {
        rounded: false,
        emissive: emissive,
        emissiveIntensity: 0.12,
        roughness: 0.3,
      },
    );
  } else if (item.type === "wallac") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      color,
      {
        roughness: 0.46,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      height * 0.08,
      depth * 0.18,
      0,
      height * 0.18,
      depth * 0.46,
      color2,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    addBoxMesh(
      group,
      width * 0.12,
      height * 0.08,
      depth * 0.05,
      width * 0.34,
      height * 0.68,
      depth * 0.51,
      emissive,
      {
        rounded: false,
        emissive: emissive,
        emissiveIntensity: 0.18,
      },
    );
  } else if (item.type === "floorac") {
    addSoftBoxMesh(
      group,
      width * 0.46,
      width * 0.48,
      height,
      0,
      height * 0.5,
      0,
      color,
      {
        segments: 32,
        roughness: 0.48,
      },
    );
    addBoxMesh(
      group,
      width * 0.5,
      height * 0.42,
      0.025,
      0,
      height * 0.68,
      depth * 0.48,
      color2,
      {
        rounded: false,
        roughness: 0.3,
      },
    );
    for (const factor of [0.58, 0.68, 0.78]) {
      addBoxMesh(
        group,
        width * 0.42,
        0.018,
        0.03,
        0,
        height * factor,
        depth * 0.5,
        emissive,
        {
          rounded: false,
          roughness: 0.34,
        },
      );
    }
  } else if (item.type === "robotvacuum") {
    addBoxMesh(
      group,
      width * 0.82,
      0.035,
      depth * 0.92,
      0,
      0.018,
      0,
      emissive,
      {
        radius: Math.min(width, depth) * 0.05,
        roughness: 0.58,
      },
    );
    addBoxMesh(
      group,
      width * 0.68,
      height * 0.82,
      depth * 0.48,
      0,
      height * 0.47,
      -depth * 0.23,
      color,
      {
        radius: Math.min(width, depth) * 0.12,
        roughness: 0.48,
      },
    );
    addBoxMesh(
      group,
      width * 0.44,
      height * 0.16,
      0.03,
      0,
      height * 0.2,
      depth * 0.02,
      emissive,
      {
        radius: Math.min(width, depth) * 0.04,
        roughness: 0.42,
      },
    );
    addBoxMesh(
      group,
      width * 0.34,
      height * 0.07,
      0.035,
      0,
      height * 0.14,
      depth * 0.04,
      color2,
      {
        radius: Math.min(width, depth) * 0.025,
        roughness: 0.28,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.31,
      width * 0.32,
      height * 0.12,
      0,
      height * 0.07,
      depth * 0.2,
      color,
      {
        segments: 32,
        roughness: 0.42,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.085,
      width * 0.09,
      height * 0.055,
      -width * 0.08,
      height * 0.16,
      depth * 0.15,
      emissive,
      {
        segments: 24,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      width * 0.36,
      height * 0.045,
      0.025,
      0,
      height * 0.08,
      depth * 0.52,
      color2,
      {
        radius: Math.min(width, depth) * 0.025,
        roughness: 0.24,
      },
    );
  } else if (item.type === "nas") {
    addBoxMesh(
      group,
      width,
      height,
      depth,
      0,
      height * 0.5,
      0,
      furniture,
      {
        rounded: false,
        metalness: 0.16,
        roughness: 0.46,
      },
    );
    addBoxMesh(
      group,
      width * 0.9,
      height * 0.88,
      0.025,
      0,
      height * 0.5,
      depth * 0.515,
      color2,
      {
        rounded: false,
        metalness: 0.12,
        roughness: 0.32,
      },
    );
    for (const x of [-width * 0.23, width * 0.23]) {
      for (const y of [height * 0.3, height * 0.7]) {
        addBoxMesh(
          group,
          width * 0.38,
          height * 0.34,
          0.018,
          x,
          y,
          depth * 0.535,
          emissive,
          {
            rounded: false,
            roughness: 0.38,
          },
        );
        addBoxMesh(
          group,
          width * 0.18,
          0.018,
          0.012,
          x,
          y + height * 0.1,
          depth * 0.55,
          color2,
          {
            rounded: false,
            metalness: 0.25,
            roughness: 0.3,
          },
        );
      }
    }
    for (const factor of [0.18, 0.26, 0.34]) {
      addBoxMesh(
        group,
        0.012,
        0.012,
        0.012,
        width * 0.42,
        height * factor,
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
  } else if (item.type === "airpurifier") {
    const radius = Math.min(width, depth) * 0.47;
    addSoftBoxMesh(
      group,
      radius * 0.96,
      radius,
      height * 0.92,
      0,
      height * 0.46,
      0,
      color,
      {
        segments: 36,
        roughness: 0.5,
      },
    );
    addSoftBoxMesh(
      group,
      radius * 0.92,
      radius * 0.92,
      height * 0.055,
      0,
      height * 0.965,
      0,
      color2,
      {
        segments: 36,
        metalness: 0.18,
        roughness: 0.3,
      },
    );
    addSoftBoxMesh(
      group,
      radius * 0.55,
      radius * 0.55,
      height * 0.018,
      0,
      height * 1.005,
      0,
      emissive,
      {
        segments: 32,
        metalness: 0.08,
        roughness: 0.35,
      },
    );
    for (const factor of [-0.28, -0.14, 0, 0.14, 0.28]) {
      addBoxMesh(
        group,
        0.012,
        height * 0.45,
        0.012,
        width * factor,
        height * 0.35,
        depth * 0.46,
        emissive,
        {
          rounded: false,
          roughness: 0.45,
        },
      );
    }
  } else if (item.type === "tv") {
    const { bodyHeight: bodyHeight, centerY: centerY } =
      isMobileTvMount(item, height);
    const y = centerY - bodyHeight * 0.5;
    if (item.tvMountStyle === "mobile") {
      const height2 = Math.max(height * 0.045, 0.055);
      const width2 = width * 0.7;
      const depth2 = Math.max(depth * 0.78, 0.3);
      const height3 = Math.max(
        y - height2 * 0.7,
        height * 0.22,
      );
      const y2 = height2 * 0.7 + height3 * 0.5;
      addBoxMesh(
        group,
        width2,
        height2,
        depth2,
        0,
        height2 * 0.72,
        0,
        color2,
        {
          radius: Math.min(height2, depth2) * 0.22,
          metalness: 0.18,
          roughness: 0.32,
        },
      );
      addBoxMesh(
        group,
        width * 0.075,
        height3,
        Math.max(depth * 0.2, 0.06),
        -width * 0.035,
        y2,
        -depth * 0.03,
        color2,
        {
          rounded: false,
          metalness: 0.2,
          roughness: 0.3,
        },
      );
      addBoxMesh(
        group,
        width * 0.105,
        height3 * 0.86,
        Math.max(depth * 0.12, 0.04),
        width * 0.025,
        y2 + height3 * 0.02,
        depth * 0.015,
        emissive,
        {
          rounded: false,
          metalness: 0.35,
          roughness: 0.28,
        },
      );
      addBoxMesh(
        group,
        width * 0.34,
        Math.max(height * 0.018, 0.025),
        Math.max(depth * 0.5, 0.2),
        0,
        y * 0.76,
        depth * 0.04,
        color2,
        {
          radius: 0.012,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
      const radius = Math.max(
        Math.min(width, depth) * 0.045,
        0.025,
      );
      for (const value of [-width2 * 0.42, width2 * 0.42]) {
        for (const entry of [-depth2 * 0.34, depth2 * 0.34]) {
          addSoftBoxMesh(
            group,
            radius,
            radius,
            Math.max(radius * 0.56, 0.018),
            value,
            radius,
            entry,
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
    } else if (item.tvMountStyle === "tabletop") {
      const height2 = Math.max(height * 0.035, 0.028);
      const width2 = width * 0.34;
      const depth2 = Math.max(depth * 0.72, 0.16);
      const height3 = Math.max(y - height2, height * 0.12);
      addBoxMesh(
        group,
        width2,
        height2,
        depth2,
        0,
        height2 * 0.5,
        0,
        color2,
        {
          radius: Math.min(height2, depth2) * 0.26,
          metalness: 0.2,
          roughness: 0.3,
        },
      );
      addBoxMesh(
        group,
        width * 0.075,
        height3,
        Math.max(depth * 0.24, 0.05),
        0,
        height2 + height3 * 0.5,
        -depth * 0.03,
        emissive,
        {
          rounded: false,
          metalness: 0.34,
          roughness: 0.28,
        },
      );
      addBoxMesh(
        group,
        width * 0.18,
        Math.max(height * 0.025, 0.022),
        Math.max(depth * 0.34, 0.08),
        0,
        y,
        0,
        color2,
        {
          radius: 0.008,
          metalness: 0.22,
          roughness: 0.3,
        },
      );
    }
    addBoxMesh(
      group,
      width,
      bodyHeight,
      Math.max(depth * 0.28, 0.05),
      0,
      centerY,
      0,
      color2,
      {
        radius: Math.min(width, bodyHeight) * 0.012,
        roughness: 0.28,
      },
    );
  } else if (item.type === "vanity") {
    const y = Math.min(0.76, height * 0.5);
    addBoxMesh(
      group,
      width,
      0.075,
      depth,
      0,
      y,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.27,
      y * 0.82,
      depth * 0.88,
      -width * 0.34,
      y * 0.42,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.27,
      y * 0.82,
      depth * 0.88,
      width * 0.34,
      y * 0.42,
      0,
      furniture,
    );
    for (const factor of [-0.34, 0.34]) {
      for (const factor2 of [0.23, 0.48]) {
        addBoxMesh(
          group,
          width * 0.22,
          0.012,
          depth * 0.02,
          width * factor,
          y * factor2,
          depth * 0.46,
          color2,
          {
            rounded: false,
          },
        );
      }
    }
    const height2 = Math.max(height - y - 0.08, 0.45);
    addBoxMesh(
      group,
      width * 0.54,
      height2,
      0.025,
      0,
      y + height2 * 0.5,
      -depth * 0.43,
      theme.glass,
      {
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        metalness: 0.22,
        roughness: 0.16,
      },
    );
    addBoxMesh(
      group,
      width * 0.59,
      0.045,
      0.05,
      0,
      y + height2,
      -depth * 0.43,
      color,
      {
        metalness: 0.12,
      },
    );
    addBoxMesh(
      group,
      width * 0.59,
      0.045,
      0.05,
      0,
      y,
      -depth * 0.43,
      color,
      {
        metalness: 0.12,
      },
    );
    addBoxMesh(
      group,
      0.045,
      height2,
      0.05,
      -width * 0.295,
      y + height2 * 0.5,
      -depth * 0.43,
      color,
      {
        metalness: 0.12,
      },
    );
    addBoxMesh(
      group,
      0.045,
      height2,
      0.05,
      width * 0.295,
      y + height2 * 0.5,
      -depth * 0.43,
      color,
      {
        metalness: 0.12,
      },
    );
  } else if (item.type === "desk") {
    addBoxMesh(
      group,
      width,
      height * 0.1,
      depth,
      0,
      height * 0.93,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.05,
      height * 0.88,
      depth * 0.82,
      -width * 0.44,
      height * 0.44,
      0,
      color2,
    );
    addBoxMesh(
      group,
      width * 0.05,
      height * 0.88,
      depth * 0.82,
      width * 0.44,
      height * 0.44,
      0,
      color2,
    );
    addBoxMesh(
      group,
      width * 0.34,
      height * 0.18,
      depth * 0.78,
      width * 0.22,
      height * 0.74,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width * 0.27,
      0.018,
      depth * 0.04,
      width * 0.22,
      height * 0.73,
      depth * 0.41,
      color,
      {
        metalness: 0.35,
      },
    );
  } else if (item.type === "desktop") {
    const width2 = width * 0.72;
    const height2 = height * 0.58;
    addBoxMesh(
      group,
      width2,
      height2,
      0.035,
      -width * 0.06,
      height * 0.66,
      -depth * 0.25,
      color2,
      {
        rounded: false,
        roughness: 0.24,
      },
    );
    addBoxMesh(
      group,
      width2 * 0.9,
      height2 * 0.84,
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
    addBoxMesh(
      group,
      0.035,
      height * 0.24,
      0.035,
      -width * 0.06,
      height * 0.25,
      -depth * 0.25,
      color2,
      {
        metalness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width * 0.28,
      0.025,
      depth * 0.3,
      -width * 0.06,
      0.02,
      -depth * 0.22,
      color2,
      {
        metalness: 0.42,
      },
    );
    addBoxMesh(
      group,
      width * 0.58,
      0.022,
      depth * 0.38,
      -width * 0.08,
      0.025,
      depth * 0.24,
      emissive,
      {
        rounded: false,
        roughness: 0.5,
      },
    );
    addBoxMesh(
      group,
      width * 0.1,
      0.035,
      depth * 0.22,
      width * 0.36,
      0.028,
      depth * 0.24,
      emissive,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.46,
      },
    );
  } else if (item.type === "laptop") {
    addBoxMesh(
      group,
      width,
      0.025,
      depth * 0.72,
      0,
      0.018,
      depth * 0.08,
      furniture,
      {
        metalness: 0.28,
        roughness: 0.36,
      },
    );
    const mesh = addBoxMesh(
      group,
      width * 0.96,
      height * 0.78,
      0.018,
      0,
      height * 0.43,
      -depth * 0.29,
      color2,
      {
        rounded: false,
        metalness: 0.22,
        roughness: 0.25,
      },
    );
    mesh.rotation.x = -Math.PI * 0.08;
    addBoxMesh(
      group,
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
    addBoxMesh(
      group,
      width * 0.62,
      0.009,
      depth * 0.34,
      0,
      0.035,
      depth * 0.12,
      color2,
      {
        rounded: false,
      },
    );
  } else if (item.type === "toilet") {
    const mesh = new THREE.Mesh(
      stairStepProfiles(width, depth, height),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.4,
        metalness: 0.02,
      }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    const bezierCurveTo = new THREE.Shape();
    bezierCurveTo.moveTo(-width * 0.46, -depth * 0.44);
    bezierCurveTo.lineTo(width * 0.46, -depth * 0.44);
    bezierCurveTo.bezierCurveTo(
      width * 0.49,
      -depth * 0.05,
      width * 0.49,
      depth * 0.29,
      0,
      depth * 0.47,
    );
    bezierCurveTo.bezierCurveTo(
      -width * 0.49,
      depth * 0.29,
      -width * 0.49,
      -depth * 0.05,
      -width * 0.46,
      -depth * 0.44,
    );
    bezierCurveTo.closePath();
    const mesh2 = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bezierCurveTo, {
        depth: height * 0.085,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.012,
        bevelThickness: 0.01,
        steps: 1,
      }),
      new THREE.MeshStandardMaterial({
        color: emissive,
        roughness: 0.34,
        metalness: 0.01,
      }),
    );
    mesh2.rotation.x = Math.PI / 2;
    mesh2.position.set(0, height * 0.82, 0);
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    group.add(mesh2);
    addBoxMesh(
      group,
      width * 0.9,
      height * 0.095,
      depth * 0.2,
      0,
      height * 0.775,
      -depth * 0.34,
      color,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.36,
      },
    );
    addBoxMesh(
      group,
      0.016,
      height * 0.38,
      0.024,
      -width * 0.42,
      height * 0.38,
      -depth * 0.18,
      color2,
      {
        rounded: false,
        roughness: 0.46,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.035,
      width * 0.035,
      0.018,
      -width * 0.46,
      height * 0.66,
      depth * 0.12,
      emissive,
      {
        segments: 24,
        rotationZ: Math.PI / 2,
        metalness: 0.08,
        roughness: 0.3,
      },
    );
  } else if (item.type === "squattoilet") {
    addBoxMesh(
      group,
      width,
      height * 0.58,
      depth,
      0,
      height * 0.29,
      0,
      color,
      {
        radius: Math.min(width, depth) * 0.08,
        roughness: 0.38,
      },
    );
    addBoxMesh(
      group,
      width * 0.28,
      height * 0.12,
      depth * 0.58,
      -width * 0.34,
      height * 0.66,
      0,
      emissive,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.4,
      },
    );
    addBoxMesh(
      group,
      width * 0.28,
      height * 0.12,
      depth * 0.58,
      width * 0.34,
      height * 0.66,
      0,
      emissive,
      {
        radius: Math.min(width, depth) * 0.035,
        roughness: 0.4,
      },
    );
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        width * 0.16,
        width * 0.2,
        height * 0.18,
        28,
      ),
      new THREE.MeshStandardMaterial({
        color: color2,
        roughness: 0.34,
        metalness: 0.02,
      }),
    );
    mesh.scale.z = 1.75;
    mesh.position.y = height * 0.67;
    group.add(mesh);
  } else if (item.type === "urinal") {
    addBoxMesh(
      group,
      width * 0.78,
      height * 0.88,
      depth * 0.72,
      0,
      height * 0.5,
      -depth * 0.06,
      color,
      {
        radius: Math.min(width, depth) * 0.16,
        roughness: 0.32,
      },
    );
    const angle = new THREE.Mesh(
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
        color: emissive,
        roughness: 0.28,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    );
    angle.scale.set(0.9, 1.1, 0.62);
    angle.rotation.x = Math.PI;
    angle.position.set(0, height * 0.53, depth * 0.17);
    group.add(angle);
    addSoftBoxMesh(
      group,
      0.018,
      0.018,
      height * 0.22,
      0,
      height * 0.95,
      -depth * 0.18,
      color2,
      {
        segments: 16,
        metalness: 0.72,
        roughness: 0.22,
      },
    );
  } else if (item.type === "bathtub") {
    const h = height * 0.84;
    const depth2 = Math.min(width, depth) * 0.11;
    const height2 = h * 0.8;
    const width2 = Math.max(width - depth2 * 2, width * 0.48);
    const depth3 = Math.max(depth - depth2 * 2, depth * 0.42);
    addBoxMesh(
      group,
      width2,
      h * 0.16,
      depth3,
      0,
      h * 0.14,
      0,
      emissive,
      {
        radius: Math.min(width, depth) * 0.16,
        roughness: 0.33,
      },
    );
    addBoxMesh(
      group,
      width,
      height2,
      depth2,
      0,
      height2 * 0.5,
      -depth * 0.5 + depth2 * 0.5,
      color,
      {
        radius: depth2 * 0.5,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      width,
      height2,
      depth2,
      0,
      height2 * 0.5,
      depth * 0.5 - depth2 * 0.5,
      color,
      {
        radius: depth2 * 0.5,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      depth2,
      height2,
      depth3,
      -width * 0.5 + depth2 * 0.5,
      height2 * 0.5,
      0,
      color,
      {
        radius: depth2 * 0.5,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      depth2,
      height2,
      depth3,
      width * 0.5 - depth2 * 0.5,
      height2 * 0.5,
      0,
      color,
      {
        radius: depth2 * 0.5,
        roughness: 0.34,
      },
    );
    const height3 = h * 0.075;
    const y = height2 + height3 * 0.5;
    addBoxMesh(
      group,
      width,
      height3,
      depth2,
      0,
      y,
      -depth * 0.5 + depth2 * 0.5,
      color,
      {
        radius: depth2 * 0.45,
        roughness: 0.29,
      },
    );
    addBoxMesh(
      group,
      width,
      height3,
      depth2,
      0,
      y,
      depth * 0.5 - depth2 * 0.5,
      color,
      {
        radius: depth2 * 0.45,
        roughness: 0.29,
      },
    );
    addBoxMesh(
      group,
      depth2,
      height3,
      depth3,
      -width * 0.5 + depth2 * 0.5,
      y,
      0,
      color,
      {
        radius: depth2 * 0.45,
        roughness: 0.29,
      },
    );
    addBoxMesh(
      group,
      depth2,
      height3,
      depth3,
      width * 0.5 - depth2 * 0.5,
      y,
      0,
      color,
      {
        radius: depth2 * 0.45,
        roughness: 0.29,
      },
    );
    for (const value of [-width * 0.38, width * 0.38]) {
      for (const entry of [-depth * 0.3, depth * 0.3]) {
        addSoftBoxMesh(
          group,
          0.026,
          0.026,
          height * 0.16,
          value,
          height * 0.08,
          entry,
          theme.furnitureDark,
          {
            segments: 12,
            metalness: 0.42,
            roughness: 0.3,
          },
        );
      }
    }
    addSoftBoxMesh(
      group,
      0.016,
      0.016,
      height * 0.25,
      width * 0.34,
      height * 0.96,
      -depth * 0.22,
      color2,
      {
        segments: 16,
        metalness: 0.72,
        roughness: 0.2,
      },
    );
    addSoftBoxMesh(
      group,
      0.016,
      0.016,
      depth * 0.28,
      width * 0.34,
      height * 1.08,
      -depth * 0.08,
      color2,
      {
        segments: 16,
        rotationX: Math.PI / 2,
        metalness: 0.72,
        roughness: 0.2,
      },
    );
  } else if (item.type === "walllamp") {
    const z = -depth * 0.5 + 0.018;
    const opts = {
      rounded: false,
      metalness: 0.64,
      roughness: 0.22,
    };
    addBoxMesh(
      group,
      width * 0.68,
      height * 0.5,
      0.035,
      0,
      height * 0.52,
      z,
      theme.furniture,
      {
        radius: 0.02,
        metalness: 0.18,
        roughness: 0.46,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.11,
      width * 0.11,
      0.035,
      0,
      height * 0.57,
      z - 0.012,
      theme.furnitureSoft,
      {
        segments: 24,
        rotationX: Math.PI / 2,
        metalness: 0.3,
        roughness: 0.34,
      },
    );
    addBoxMesh(
      group,
      0.04,
      height * 0.2,
      depth * 0.28,
      0,
      height * 0.57,
      -depth * 0.3,
      theme.furniture,
      {
        ...opts,
        metalness: 0.18,
        roughness: 0.46,
      },
    );
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        width * 0.3,
        width * 0.19,
        height * 0.38,
        24,
        1,
        true,
      ),
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.04,
        emissive: 16767386,
        emissiveIntensity: 0.24,
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(0, height * 0.4, -depth * 0.16);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    addSoftBoxMesh(
      group,
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
  } else if (item.type === "glasspartition") {
    const height2 = Math.min(Math.max(width * 0.018, 0.018), 0.035);
    const depth2 = Math.max(depth, 0.045);
    const width2 = Math.max(width - height2 * 2.4, height2);
    const height3 = Math.max(height - height2 * 2.4, height2);
    const mesh = {
      rounded: false,
      metalness: 0.58,
      roughness: 0.24,
      castShadow: false,
      receiveShadow: false,
    };
    addBoxMesh(
      group,
      width2,
      height3,
      Math.max(depth * 0.24, 0.012),
      0,
      height * 0.5,
      0,
      theme.glass,
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
    addBoxMesh(
      group,
      width,
      height2,
      depth2,
      0,
      height2 * 0.5,
      0,
      theme.frame,
      mesh,
    );
    addBoxMesh(
      group,
      width,
      height2,
      depth2,
      0,
      height - height2 * 0.5,
      0,
      theme.frame,
      mesh,
    );
    addBoxMesh(
      group,
      height2,
      height,
      depth2,
      -width * 0.5 + height2 * 0.5,
      height * 0.5,
      0,
      theme.frame,
      mesh,
    );
    addBoxMesh(
      group,
      height2,
      height,
      depth2,
      width * 0.5 - height2 * 0.5,
      height * 0.5,
      0,
      theme.frame,
      mesh,
    );
    for (const x of [-width * 0.34, width * 0.34]) {
      addBoxMesh(
        group,
        height2 * 1.7,
        height2 * 2.2,
        depth2 * 1.18,
        x,
        height2 * 1.3,
        0,
        emissive,
        mesh,
      );
    }
  } else if (item.type === "shower") {
    const color3 = color;
    const z = -depth * 0.42;
    const h = height * 0.13;
    const h2 = height * 0.9;
    const height2 = h2 - h;
    const mesh = {
      rounded: false,
      metalness: 0.68,
      roughness: 0.22,
    };
    addBoxMesh(
      group,
      0.045,
      height2,
      0.045,
      0,
      (h + h2) * 0.5,
      z,
      color3,
      mesh,
    );
    for (const y2 of [
      h,
      height * 0.47,
      height * 0.78,
      h2,
    ]) {
      addBoxMesh(
        group,
        0.085,
        0.085,
        0.065,
        0,
        y2,
        z,
        color3,
        mesh,
      );
    }
    for (const value of [h, h2]) {
      addSoftBoxMesh(
        group,
        width * 0.055,
        width * 0.055,
        0.04,
        0,
        value,
        -depth * 0.47,
        color3,
        {
          segments: 28,
          rotationX: Math.PI / 2,
          metalness: 0.7,
          roughness: 0.2,
        },
      );
    }
    const y = height * 0.12;
    addBoxMesh(
      group,
      width * 0.36,
      0.065,
      0.065,
      0,
      y,
      z + depth * 0.08,
      color3,
      mesh,
    );
    for (const x of [-width * 0.2, width * 0.2]) {
      addSoftBoxMesh(
        group,
        width * 0.055,
        width * 0.055,
        0.045,
        x,
        y,
        -depth * 0.45,
        color3,
        {
          segments: 28,
          rotationX: Math.PI / 2,
          metalness: 0.7,
          roughness: 0.2,
        },
      );
      addBoxMesh(
        group,
        0.05,
        0.05,
        depth * 0.13,
        x,
        y,
        z + depth * 0.01,
        color3,
        mesh,
      );
    }
    addBoxMesh(
      group,
      0.045,
      height * 0.12,
      0.045,
      0,
      y - height * 0.045,
      z + depth * 0.13,
      color3,
      mesh,
    );
    const point = new THREE.Vector3(0, h2, z);
    const point2 = new THREE.Vector3(
      0,
      height * 0.76,
      depth * 0.08,
    );
    const dy = point2.y - point.y;
    const dz = point2.z - point.z;
    const height3 = Math.hypot(dy, dz);
    const mesh2 = addBoxMesh(
      group,
      0.055,
      height3,
      0.055,
      0,
      (point.y + point2.y) * 0.5,
      (point.z + point2.z) * 0.5,
      color3,
      mesh,
    );
    mesh2.rotation.x = Math.atan2(dz, dy);
    addBoxMesh(
      group,
      0.055,
      height * 0.13,
      0.055,
      0,
      height * 0.705,
      point2.z,
      color3,
      mesh,
    );
    addBoxMesh(
      group,
      width * 0.34,
      0.035,
      depth * 0.3,
      0,
      height * 0.64,
      point2.z + depth * 0.03,
      color3,
      {
        rounded: false,
        metalness: 0.64,
        roughness: 0.24,
      },
    );
  } else if (item.type === "basin") {
    addBoxMesh(
      group,
      width * 0.92,
      height * 0.72,
      depth * 0.9,
      0,
      height * 0.36,
      0,
      furniture,
    );
    addBoxMesh(
      group,
      width,
      0.065,
      depth,
      0,
      height * 0.75,
      0,
      color,
      {
        roughness: 0.3,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.25,
      width * 0.21,
      0.08,
      0,
      height * 0.8,
      depth * 0.02,
      emissive,
      {
        roughness: 0.28,
      },
    );
    addSoftBoxMesh(
      group,
      0.018,
      0.018,
      height * 0.2,
      0,
      height * 0.9,
      -depth * 0.2,
      color2,
      {
        metalness: 0.78,
        roughness: 0.18,
      },
    );
    addSoftBoxMesh(
      group,
      0.018,
      0.018,
      depth * 0.2,
      0,
      height * 0.99,
      -depth * 0.11,
      color2,
      {
        rotationX: Math.PI / 2,
        metalness: 0.78,
        roughness: 0.18,
      },
    );
    addBoxMesh(
      group,
      0.012,
      height * 0.62,
      depth * 0.02,
      0,
      height * 0.34,
      depth * 0.46,
      color2,
      {
        rounded: false,
      },
    );
    const y = height * 1.05;
    const width2 = width * 0.72;
    const height2 = 0.72;
    const z = -depth * 0.46;
    addBoxMesh(
      group,
      width2,
      height2,
      0.018,
      0,
      y + height2 * 0.5,
      z,
      theme.glass,
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
    addBoxMesh(
      group,
      width2 + 0.055,
      0.035,
      0.045,
      0,
      y,
      z,
      color2,
      {
        metalness: 0.35,
      },
    );
    addBoxMesh(
      group,
      width2 + 0.055,
      0.035,
      0.045,
      0,
      y + height2,
      z,
      color2,
      {
        metalness: 0.35,
      },
    );
    addBoxMesh(
      group,
      0.035,
      height2,
      0.045,
      -width2 * 0.5,
      y + height2 * 0.5,
      z,
      color2,
      {
        metalness: 0.35,
      },
    );
    addBoxMesh(
      group,
      0.035,
      height2,
      0.045,
      width2 * 0.5,
      y + height2 * 0.5,
      z,
      color2,
      {
        metalness: 0.35,
      },
    );
  } else if (item.type === "rug") {
    if (
      !addRugMeshes(group, item, furniture, emissive)
    ) {
      const n = clamp(height, 0.004, 0.018);
      addBoxMesh(
        group,
        width,
        n,
        depth,
        0,
        n * 0.5,
        0,
        furniture,
        {
          radius: Math.min(width, depth) * 0.018,
          roughness: 1,
          metalness: 0,
          castShadow: false,
          receiveShadow: true,
        },
      );
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(width * 0.88, depth * 0.84),
        new THREE.MeshStandardMaterial({
          color: emissive,
          roughness: 1,
          metalness: 0,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -4,
        }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = n + 0.001;
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      mesh.renderOrder = 1;
      group.add(mesh);
    }
  } else if (item.type === "tvstand") {
    addBoxMesh(
      group,
      width,
      height * 0.76,
      depth,
      0,
      height * 0.42,
      0,
      furniture,
    );
    const height2 = height * 0.08;
    const h = height * 0.8;
    addBoxMesh(
      group,
      width * 0.98,
      height2,
      depth,
      0,
      h + height2 * 0.5,
      0,
      emissive,
    );
    addBoxMesh(
      group,
      0.018,
      height * 0.58,
      depth * 1.01,
      0,
      height * 0.43,
      depth * 0.01,
      color2,
      {
        rounded: false,
      },
    );
    addBoxMesh(
      group,
      width * 0.91,
      0.015,
      depth * 1.01,
      0,
      height * 0.43,
      depth * 0.01,
      color2,
      {
        rounded: false,
      },
    );
    for (const factor of [-0.4, 0.4]) {
      addBoxMesh(
        group,
        0.055,
        height * 0.2,
        0.055,
        width * factor,
        height * 0.1,
        0,
        color2,
        {
          metalness: 0.32,
        },
      );
    }
  } else if (item.type === "floorlamp") {
    const w = -width * 0.34;
    const w2 = width * 0.31;
    const size = Math.min(width * 0.13, depth * 0.34);
    const size2 = Math.min(width * 0.18, depth * 0.46);
    const h = height * 0.115;
    const h2 = height * 0.76;
    const value = h2 + h;
    addSoftBoxMesh(
      group,
      size * 0.82,
      size,
      0.045,
      w,
      0.0225,
      0,
      color2,
      {
        segments: 32,
        metalness: 0.38,
        roughness: 0.3,
      },
    );
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(w, 0.045, 0),
      new THREE.Vector3(w, height * 0.72, 0),
      new THREE.Vector3(width * 0.02, height * 1.01, 0),
      new THREE.Vector3(w2, value, 0),
    );
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(
        curve,
        48,
        Math.max(0.012, width * 0.012),
        8,
        false,
      ),
      new THREE.MeshStandardMaterial({
        color: color2,
        roughness: 0.3,
        metalness: 0.48,
      }),
    );
    mesh.castShadow = true;
    group.add(mesh);
    const angle = new THREE.Mesh(
      new THREE.SphereGeometry(
        size2,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2,
      ),
      new THREE.MeshStandardMaterial({
        color: emissive,
        roughness: 0.62,
        metalness: 0.04,
      }),
    );
    angle.scale.set(1, h / size2, 1);
    angle.position.set(w2, h2, 0);
    angle.castShadow = true;
    group.add(angle);
    addSoftBoxMesh(
      group,
      size2 * 0.94,
      size2 * 0.98,
      0.025,
      w2,
      h2,
      0,
      color2,
      {
        segments: 32,
        metalness: 0.12,
        roughness: 0.5,
      },
    );
    addSoftBoxMesh(
      group,
      Math.max(0.018, width * 0.014),
      Math.max(0.022, width * 0.018),
      0.045,
      w2,
      value + 0.012,
      0,
      color2,
      {
        segments: 20,
        metalness: 0.42,
        roughness: 0.28,
      },
    );
  } else if (item.type === "plant") {
    addSoftBoxMesh(
      group,
      width * 0.25,
      width * 0.21,
      height * 0.22,
      0,
      height * 0.11,
      0,
      emissive,
      {
        segments: 24,
        roughness: 0.82,
      },
    );
    addSoftBoxMesh(
      group,
      width * 0.22,
      width * 0.22,
      0.035,
      0,
      height * 0.22,
      0,
      color2,
      {
        segments: 24,
        roughness: 0.96,
      },
    );
    const innerSize = [
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
    for (const value of innerSize) {
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(value),
          20,
          0.014,
          7,
          false,
        ),
        new THREE.MeshStandardMaterial({
          color: color2,
          roughness: 0.86,
        }),
      );
      mesh.castShadow = true;
      group.add(mesh);
    }
    const centers = [
      [-0.27, 0.78, 0],
      [-0.1, 0.61, 0.02],
      [0.12, 0.94, 0],
      [0.31, 0.79, 0],
      [0.18, 0.63, -0.02],
      [0.02, 0.46, 0.03],
    ];
    for (const [fx, fy, fz] of centers) {
      for (let n = 0; n < 5; n += 1) {
        const angle = (n / 5) * Math.PI * 2;
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 10, 6),
          new THREE.MeshStandardMaterial({
            color: n % 2 ? 7835779 : 6257261,
            roughness: 0.9,
          }),
        );
        mesh.scale.set(
          width * 0.045,
          height * 0.085,
          depth * 0.025,
        );
        mesh.position.set(
          width * fx + Math.cos(angle) * width * 0.08,
          height * fy + Math.sin(angle) * height * 0.035,
          depth * fz + Math.sin(angle) * depth * 0.06,
        );
        mesh.rotation.z = angle - Math.PI / 2;
        mesh.rotation.y = angle * 0.6;
        mesh.castShadow = true;
        group.add(mesh);
      }
    }
  }
  if (
    (floorFurnitureExternalTypes.has(item.type) ||
      applianceExternalTypes.has(item.type)) &&
    item.offlineModelExport !== true
  ) {
    const childMeshes = [...group.children];
    if (attachExternalItemModel(group, item)) {
      childMeshes.forEach((object3d) => {
        group.remove(object3d);
        disposeObject3dResources(object3d);
      });
    }
  }
  if (item.type === "tv" && item.offlineModelExport !== true) {
    addTvMountMeshes(
      group,
      item,
      width,
      depth,
      height,
    );
  }
  optimizeItemGeometries(group, item.type);
  mergeSimilarItemMeshes(group, item.type);
  applySelectionHighlight(group, isSelected("item", item.id));
  return group;
}
function applyItemYawRotation(rotation, item) {
  rotation.rotation.y = -THREE.MathUtils.degToRad(
    finite(item.rotation, 0),
  );
  if (stairItemTypes.has(item.type)) {
    rotation.scale.x = item.stairDirection === "left" ? -1 : 1;
  }
  if (
    item.type === "shoecabinet" &&
    item.shoeCabinetMirrored === true
  ) {
    rotation.scale.x = -1;
  }
  if (lightItemTypes.has(item.type)) {
    if (item.type === "striplight") {
      rotation.rotation.order = "YXZ";
      rotation.rotation.x = 0;
      rotation.rotation.z = 0;
    } else {
      const value = THREE.MathUtils.degToRad(
        clamp(finite(item.verticalRotation, 0), -90, 90),
      );
      rotation.rotation.order = "YXZ";
      rotation.rotation.x = value;
    }
  }
}
function meshInstanceDescriptors(object3d) {
  object3d.updateMatrixWorld(true);
  object3d.updateMatrix();
  if (object3d.matrix.determinant() < 0) {
    return null;
  }
  const value = object3d.matrixWorld.clone().invert();
  const list = [];
  let flag = true;
  object3d.traverse((mesh) => {
    if (!flag || !mesh.isMesh) {
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
      flag = false;
      return;
    }
    const relativeMatrix = new THREE.Matrix4().multiplyMatrices(
      value,
      mesh.matrixWorld,
    );
    const flag2 = materialFingerprint(mesh);
    if (!flag2) {
      flag = false;
      return;
    }
    list.push({
      mesh: mesh,
      relativeMatrix: relativeMatrix,
      signature: JSON.stringify([
        mesh.geometry.uuid,
        flag2,
        relativeMatrix.elements.map(
          (arg0) => Math.round(arg0 * 1000000) / 1000000,
        ),
        mesh.castShadow,
        mesh.receiveShadow,
        mesh.renderOrder,
      ]),
    });
  });
  if (flag && list.length) {
    return list;
  } else {
    return null;
  }
}
function instanceMergeIdenticalItems(object3d, arg1) {
  const map = new Map();
  for (const { item: item, group: group } of arg1) {
    if (
      skipInstanceMergeTypes.has(item.type) ||
      isSelected("item", item.id)
    ) {
      continue;
    }
    const descriptors = meshInstanceDescriptors(group);
    if (!descriptors) {
      continue;
    }
    const stringifyResult = JSON.stringify([
      item.type,
      descriptors.map((signature) => signature.signature),
    ]);
    if (!map.has(stringifyResult)) {
      map.set(stringifyResult, []);
    }
    map.get(stringifyResult).push({
      item: item,
      group: group,
      descriptors: descriptors,
    });
  }
  object3d.updateMatrixWorld(true);
  const value = object3d.matrixWorld.clone().invert();
  const list = [];
  for (const list2 of map.values()) {
    if (list2.length < 2) {
      continue;
    }
    const after = list2[0].descriptors.length;
    for (let count = 0; count < after; count += 1) {
      const mesh = list2[0].descriptors[count].mesh;
      const imiiV3 = mesh.userData.externalModelSharedMaterial
        ? mesh.material
        : mesh.material.clone();
      const light = new THREE.InstancedMesh(
        mesh.geometry,
        imiiV3,
        list2.length,
      );
      light.name =
        "ha-bridge-instance-" +
        list2[0].item.type +
        "-" +
        (count + 1);
      light.castShadow = mesh.castShadow;
      light.receiveShadow = mesh.receiveShadow;
      light.renderOrder = mesh.renderOrder;
      light.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      light.userData.externalModelSharedGeometry = true;
      light.userData.externalModelSharedTextures = true;
      light.userData.externalModelSharedMaterial =
        mesh.userData.externalModelSharedMaterial === true;
      light.userData.modelLayer = "items";
      light.userData.exportRole = "plan";
      light.userData.instanceItemType = list2[0].item.type;
      light.userData.instanceItemIds = list2.map(
        ({ item: item }) => item.id,
      );
      list2.forEach(
        ({ descriptors: descriptors }, arg12) => {
          const matrix4 = new THREE.Matrix4().multiplyMatrices(
            value,
            descriptors[count].mesh.matrixWorld,
          );
          light.setMatrixAt(arg12, matrix4);
        },
      );
      light.instanceMatrix.needsUpdate = true;
      light.computeBoundingBox();
      light.computeBoundingSphere();
      object3d.add(light);
    }
    for (const { group: object3d2 } of list2) {
      object3d.remove(object3d2);
      disposeObject3dResources(object3d2);
    }
    list.push({
      type: list2[0].item.type,
      instances: list2.length,
      before: list2.length * after,
      after: after,
    });
  }
  object3d.userData.instanceBatchStats = list;
  if (renderer?.domElement) {
    renderer.domElement.dataset.instanceBatchCount = String(
      list.length,
    );
    renderer.domElement.dataset.instanceCount = String(
      list.reduce(
        (arg0, instances) =>
          arg0 + instances.instances,
        0,
      ),
    );
    renderer.domElement.dataset.instanceDrawCallsSaved = String(
      list.reduce(
        (arg0, before) =>
          arg0 + before.before - before.after,
        0,
      ),
    );
  }
  return list;
}
function prepareInstanceMergeBatches(object3d, arg1) {
  const map = new Map();
  object3d.updateMatrixWorld(true);
  for (const { item: item, group: object3d2 } of arg1) {
    if (
      object3d2.parent === object3d &&
      !skipInstanceMergeTypes.has(item.type) &&
      !isSelected("item", item.id)
    ) {
      object3d2.traverse((light) => {
        if (!light.isMesh || light.isInstancedMesh) {
          return;
        }
        const flag = meshMaterialSignature(light);
        if (!flag || light.matrixWorld.determinant() < 0) {
          return;
        }
        const pimbV2 =
          flag + ":" + geometryAttributeSignature(light);
        if (!map.has(pimbV2)) {
          map.set(pimbV2, []);
        }
        map.get(pimbV2).push(light);
      });
    }
  }
  const value = object3d.matrixWorld.clone().invert();
  const list = [];
  for (const list2 of map.values()) {
    if (list2.length < 2) {
      continue;
    }
    const item = list2.map((object3d2) => {
      const matrix4 = new THREE.Matrix4().multiplyMatrices(
        value,
        object3d2.matrixWorld,
      );
      return object3d2.geometry.clone().applyMatrix4(matrix4);
    });
    const flag = mergeGeometries(item);
    item.forEach((dispose) => dispose.dispose());
    if (!flag) {
      continue;
    }
    const light = list2[0];
    const object3d3 = new THREE.Mesh(
      flag,
      light.material,
    );
    object3d3.castShadow = light.castShadow;
    object3d3.receiveShadow = light.receiveShadow;
    object3d3.renderOrder = light.renderOrder;
    object3d3.userData.externalModelSharedMaterial =
      light.userData.externalModelSharedMaterial === true;
    object3d3.userData.modelLayer = "items";
    object3d3.userData.exportRole = "plan";
    for (const object3d2 of list2) {
      object3d2.parent?.remove(object3d2);
      if (!object3d2.userData.externalModelSharedGeometry) {
        object3d2.geometry.dispose();
      }
      if (
        object3d2 !== light &&
        object3d2.material !== light.material &&
        !object3d2.userData.externalModelSharedMaterial
      ) {
        object3d2.material.dispose?.();
      }
    }
    object3d.add(object3d3);
    list.push({
      before: list2.length,
      after: 1,
    });
  }
  for (const { group: object3d2 } of arg1) {
    if (
      object3d2.parent === object3d &&
      collectChildMeshes(object3d2).length === 0
    ) {
      object3d.remove(object3d2);
    }
  }
  object3d.userData.staticItemBatchStats = list;
  if (renderer?.domElement) {
    renderer.domElement.dataset.staticItemBatchCount = String(
      list.length,
    );
    renderer.domElement.dataset.staticItemDrawCallsSaved = String(
      list.reduce(
        (arg0, before) =>
          arg0 + before.before - before.after,
        0,
      ),
    );
  }
  return list;
}
function collectExternalSharedMeshes() {
  const value = new Set();
  worldGroup?.traverse((object3d) => {
    if (
      !object3d.isMesh ||
      !object3d.userData.externalModelSharedGeometry
    ) {
      return;
    }
    const isArrayResult = Array.isArray(object3d.material)
      ? object3d.material
      : object3d.material
        ? [object3d.material]
        : [];
    for (const flag of isArrayResult) {
      if (flag && !precompiledExternalMeshes.has(flag)) {
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
  const materials = externalModels.modelLoadState();
  renderer.domElement.dataset.externalSharedMaterialCount = String(
    materials.materials,
  );
  renderer.domElement.dataset.externalMaterialReuseCount = String(
    materials.materialReuses,
  );
  renderer.domElement.dataset.externalPrecompilePassCount = String(
    externalPrecompilePassCount,
  );
  renderer.domElement.dataset.lightPrecompilePassCount = String(
    lightPrecompilePassCount,
  );
}
function countLightPrecompileWork(arg0) {
  let value = 0;
  let count = 0;
  let count2 = 0;
  let count3 = 0;
  for (const light of arg0) {
    if (light.isSpotLight) {
      value += 1;
    } else if (light.isRectAreaLight) {
      count += 1;
    } else if (light.isPointLight) {
      count2 += 1;
    } else {
      count3 += 1;
    }
  }
  return value + ":" + count + ":" + count2 + ":" + count3;
}
function collectWorldExternalMeshes() {
  if (!worldGroup) {
    return [];
  }
  const list = [];
  const map = new Map();
  worldGroup.traverse((object3d) => {
    if (
      !object3d.isLight ||
      !object3d.userData?.lightItemId ||
      finite(object3d.userData.lightOnIntensity, 0) <= 0
    ) {
      return;
    }
    if (object3d.visible !== false) {
      list.push(object3d);
    }
    const flag = String(object3d.userData.lightGroupId || "");
    if (flag) {
      if (!map.has(flag)) {
        map.set(flag, []);
      }
      map.get(flag).push(object3d);
    }
  });
  const idSet = new Set();
  const list2 = [];
  for (const [groupId, list3] of map) {
    const lights = list3.filter(
      (object3d) => object3d.visible === false,
    );
    if (!lights.length) {
      continue;
    }
    const signature = countLightPrecompileWork([...list, ...lights]);
    if (!idSet.has(signature)) {
      idSet.add(signature);
      list2.push({
        groupId: groupId,
        lights: lights,
        signature: signature,
      });
    }
  }
  return list2;
}
const PRECOMPILE_TIMEOUT_MS = 4500;
function withTimeoutTrue(arg0) {
  let value = null;
  return Promise.race([
    Promise.resolve(arg0).then(() => true),
    new Promise((arg02) => {
      value = window.setTimeout(() => arg02(false), PRECOMPILE_TIMEOUT_MS);
    }),
  ]).finally(() => window.clearTimeout(value));
}
function scheduleLightPrecompile(arg0 = 360) {
  if (!isAutoDiagramEmbed) {
    lightPrecompileRequested = true;
    window.clearTimeout(lightPrecompileTimer);
    if (!isLightPrecompiling) {
      lightPrecompileTimer = window.setTimeout(async () => {
        lightPrecompileTimer = null;
        const active = externalModels.modelLoadState();
        if (
          !renderer ||
          !previewScene ||
          !camera ||
          !worldGroup ||
          stageSession ||
          document.hidden ||
          previewOrbitLocked ||
          isLeavingStudio ||
          isBakingLightCache ||
          isExternalPrecompiling ||
          externalModelQueueActive ||
          deferredModelTimer ||
          active.active > 0 ||
          active.queued > 0 ||
          isPreviewQualityReady()
        ) {
          scheduleLightPrecompile(240);
          return;
        }
        const list = collectWorldExternalMeshes();
        const value = [
          getPreviewFloorMode(),
          activeFloorId,
          externalPrecompilePassCount,
          ...list
            .map((signature) => signature.signature)
            .sort(),
        ].join("|");
        if (!list.length || value === lightPrecompileSignature) {
          lightPrecompileRequested = false;
          renderer.domElement.dataset.lightPrecompileState = "ready";
          syncExternalModelDomStats();
          return;
        }
        isLightPrecompiling = true;
        lightPrecompileRequested = false;
        renderer.domElement.dataset.lightPrecompileState = "working";
        renderer.domElement.dataset.lightPrecompilePlanCount = String(
          list.length,
        );
        let flag = true;
        try {
          for (const lights of list) {
            await yieldToIdle();
            if (
              stageSession ||
              document.hidden ||
              previewOrbitLocked ||
              isLeavingStudio ||
              isBakingLightCache ||
              isPreviewQualityReady()
            ) {
              flag = false;
              lightPrecompileRequested = true;
              break;
            }
            const mapResult = lights.lights.map((light) => ({
              light: light,
              visible: light.visible,
              intensity: light.intensity,
            }));
            let slpV3 = null;
            try {
              for (const light of mapResult) {
                light.light.intensity = 0;
                light.light.visible = true;
              }
              countShadowLights(worldGroup, {
                rebuildAtlas: false,
              });
              slpV3 =
                !isStageEmbed && typeof renderer.compileAsync == "function"
                  ? renderer.compileAsync(worldGroup, camera, previewScene)
                  : Promise.resolve(
                      renderer.compile(worldGroup, camera, previewScene),
                    );
            } finally {
              for (const object3d of mapResult) {
                object3d.light.visible = object3d.visible;
                object3d.light.intensity = object3d.intensity;
              }
              countShadowLights(worldGroup, {
                rebuildAtlas: false,
              });
            }
            if (!(await withTimeoutTrue(slpV3))) {
              renderer.domElement.dataset.lightPrecompileDeferred = "true";
              break;
            }
            lightPrecompilePassCount += 1;
          }
          if (flag) {
            lightPrecompileSignature = value;
            renderer.domElement.dataset.lightPrecompileState = "ready";
          }
        } catch (error) {
          flag = false;
          renderer.domElement.dataset.lightPrecompileState = "fallback";
          console.debug("3D first-light precompile skipped", error);
        } finally {
          isLightPrecompiling = false;
          syncExternalModelDomStats();
          if (lightPrecompileRequested) {
            scheduleLightPrecompile(240);
          }
        }
      }, arg0);
    }
  }
}
function scheduleExternalPrecompile(arg0 = 0) {
  externalPrecompileRequested = true;
  window.clearTimeout(externalPrecompileTimer);
  if (!isExternalPrecompiling) {
    externalPrecompileTimer = window.setTimeout(async () => {
      externalPrecompileTimer = null;
      if (
        !renderer ||
        !previewScene ||
        !camera ||
        !worldGroup ||
        stageSession ||
        document.hidden ||
        previewOrbitLocked ||
        isLeavingStudio ||
        isBakingLightCache
      ) {
        scheduleExternalPrecompile(240);
        return;
      }
      const list = collectExternalSharedMeshes();
      if (!list.length) {
        externalPrecompileRequested = false;
        syncExternalModelDomStats();
        scheduleLightPrecompile();
        return;
      }
      isExternalPrecompiling = true;
      externalPrecompileRequested = false;
      renderer.domElement.dataset.externalPrecompileState = "working";
      try {
        countShadowLights(worldGroup, {
          rebuildAtlas: false,
        });
        renderer.compile(worldGroup, camera, previewScene);
        list.forEach((arg02) =>
          precompiledExternalMeshes.add(arg02),
        );
        externalPrecompilePassCount += 1;
        renderer.domElement.dataset.externalPrecompileState = "ready";
      } catch (error) {
        renderer.domElement.dataset.externalPrecompileState = "fallback";
        console.debug("3D model precompile skipped", error);
      } finally {
        isExternalPrecompiling = false;
        syncExternalModelDomStats();
        if (externalPrecompileRequested) {
          scheduleExternalPrecompile(120);
        } else {
          scheduleLightPrecompile();
        }
      }
    }, arg0);
  }
}
function rebuildPreviewMeshes(scope = {}) {
  const flag = scope.force === true;
  const value = ["items", "lights"].includes(scope.scope)
    ? scope.scope
    : "all";
  if (!isLivePreviewEnabled() && !flag) {
    if (scope.transient !== true) {
      previewNeedsRefresh = true;
    }
    syncLivePreviewButtons();
    return;
  }
  if (flag) {
    forceLivePreviewOnce = true;
    pendingRebuildReasons.add("all");
  } else {
    pendingRebuildReasons.add(value);
  }
  if (scope.precompile === true) {
    forceFullSceneRebuild = true;
  }
  if (scope.preserveLightCache !== true) {
    invalidateLightCacheNextRebuild = true;
  }
  if (!isSceneRebuildQueued) {
    isSceneRebuildQueued = true;
    requestAnimationFrame(() => {
      isSceneRebuildQueued = false;
      if (isLeavingStudio && !forceLivePreviewOnce) {
        return;
      }
      const flag2 = isLivePreviewEnabled() || forceLivePreviewOnce;
      forceLivePreviewOnce = false;
      if (!flag2) {
        previewNeedsRefresh = true;
        syncLivePreviewButtons();
        return;
      }
      const uniqueSet = new Set(pendingRebuildReasons);
      pendingRebuildReasons.clear();
      const preserveLightCache = !invalidateLightCacheNextRebuild;
      invalidateLightCacheNextRebuild = false;
      if (
        getPreviewFloorMode() === "all" ||
        uniqueSet.has("all") ||
        !floorScene.walls.length
      ) {
        rebuildWorldPreview({
          preserveLightCache: preserveLightCache,
        });
      } else {
        if (uniqueSet.has("items")) {
          rebuildPreviewItemMeshes({
            preserveLightCache: preserveLightCache,
          });
        }
        if (uniqueSet.has("lights")) {
          rebuildPreviewLightMeshes({
            preserveLightCache: preserveLightCache,
          });
        }
      }
      const flag3 = forceFullSceneRebuild;
      forceFullSceneRebuild = false;
      syncExternalModelDomStats();
      if (flag3 || collectExternalSharedMeshes().length) {
        scheduleExternalPrecompile();
      }
      previewNeedsRefresh = false;
      syncLivePreviewButtons();
    });
  }
}
function activeFloorContentBounds() {
  if (floorScene.walls.length) {
    return modelBounds({
      background: null,
      walls: floorScene.walls,
      items: [],
    });
  } else if (floorScene.items.length) {
    return modelBounds({
      background: null,
      walls: [],
      items: floorScene.items,
    });
  } else {
    return modelBounds(floorScene);
  }
}
function extrudeWallSegmentShape(
  wall,
  wall2,
  arg2,
  arg3,
  wall3 = {},
) {
  const worldPoint = arg3(wall.start);
  const worldPoint2 = arg3(wall.end);
  const value = worldPoint2.x - worldPoint.x;
  const ewssV2 = worldPoint2.z - worldPoint.z;
  const hypot = Math.hypot(value, ewssV2);
  if (hypot <= 1e-7) {
    return null;
  }
  const planPoint = {
    x: value / hypot,
    y: ewssV2 / hypot,
  };
  const planPoint2 = {
    x: -planPoint.y,
    y: planPoint.x,
  };
  const ewssV4 = wall.thickness / 2;
  const maxValue =
    wall2.start <= 0.000001
      ? wall2.start - Math.max(Number(wall3.start) || 0, 0)
      : wall2.start;
  const maxValue2 =
    wall2.end >= hypot - 0.000001
      ? wall2.end + Math.max(Number(wall3.end) || 0, 0)
      : wall2.end;
  const planPoint3 = {
    x: worldPoint.x + planPoint.x * maxValue,
    y: worldPoint.z + planPoint.y * maxValue,
  };
  const planPoint4 = {
    x: worldPoint.x + planPoint.x * maxValue2,
    y: worldPoint.z + planPoint.y * maxValue2,
  };
  return [
    {
      x: planPoint3.x + planPoint2.x * ewssV4,
      y: planPoint3.y + planPoint2.y * ewssV4,
    },
    {
      x: planPoint3.x - planPoint2.x * ewssV4,
      y: planPoint3.y - planPoint2.y * ewssV4,
    },
    {
      x: planPoint4.x - planPoint2.x * ewssV4,
      y: planPoint4.y - planPoint2.y * ewssV4,
    },
    {
      x: planPoint4.x + planPoint2.x * ewssV4,
      y: planPoint4.y + planPoint2.y * ewssV4,
    },
  ];
}
function buildCanvasPathFromPoints(arg0, item) {
  const t2424 = new arg0();
  item.forEach((planPoint, arg1) => {
    if (arg1 === 0) {
      t2424.moveTo(planPoint.x, planPoint.y);
    } else {
      t2424.lineTo(planPoint.x, planPoint.y);
    }
  });
  t2424.closePath();
  return t2424;
}
function splitFloorPolygonsByHoles(arg0) {
  const list = [];
  const list2 = [];
  for (const loop of arg0) {
    const area = polygonArea(loop);
    if (area > 0) {
      list.push({
        loop: loop,
        area: area,
        holes: [],
      });
    } else if (area < 0) {
      list2.push(loop);
    }
  }
  if (!list.length) {
    for (const value of list2.splice(0)) {
      const loop = [...value].reverse();
      list.push({
        loop: loop,
        area: Math.abs(polygonArea(loop)),
        holes: [],
      });
    }
  }
  for (const value of list2) {
    const isHoles = list
      .filter((loop) =>
        pointInPolygon(value[0], loop.loop, 0.000001),
      )
      .sort(
        (area, area2) => area.area - area2.area,
      )[0];
    if (isHoles) {
      isHoles.holes.push(value);
    }
  }
  return list.map((loop) => {
    const value = buildCanvasPathFromPoints(THREE.Shape, loop.loop);
    for (const item of loop.holes) {
      value.holes.push(buildCanvasPathFromPoints(THREE.Path, item));
    }
    return value;
  });
}
function createGlassMaterial(color, opacity, depthWrite = {}) {
  const flag = opacity >= 0.999;
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.72,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.82,
    transmission: flag ? 0 : 0.012,
    thickness: 0.1,
    ior: 1.22,
    transparent: !flag,
    opacity: opacity,
    depthWrite: depthWrite.depthWrite ?? flag,
    depthFunc:
      depthWrite.depthFunc ??
      (flag ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: depthWrite.polygonOffset === true,
    polygonOffsetFactor: depthWrite.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: depthWrite.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: depthWrite.emissive ?? color,
    emissiveIntensity: depthWrite.emissiveIntensity ?? 0.025,
  });
}
function createInvisibleMaterial() {
  const object3d = new THREE.MeshBasicMaterial();
  object3d.visible = false;
  return object3d;
}
function createWallTopMaterial(flag, arg1, topColor = {}) {
  const flag2 = arg1 >= 0.999;
  return new THREE.MeshStandardMaterial({
    color: topColor.topColor ?? flag,
    roughness: 0.76,
    metalness: 0,
    transparent: !flag2,
    opacity:
      topColor.topOpacity ??
      (flag2 ? 1 : Math.min(arg1 * 1.08, 0.42)),
    depthWrite: topColor.depthWrite ?? flag2,
    depthFunc:
      topColor.depthFunc ??
      (flag2 ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: topColor.polygonOffset === true,
    polygonOffsetFactor: topColor.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: topColor.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive:
      topColor.emissive ?? topColor.topColor ?? flag,
    emissiveIntensity: topColor.emissiveIntensity
      ? topColor.emissiveIntensity * 0.3
      : 0.08,
  });
}
function addWallMeshBatch(
  list,
  arg1,
  arg2,
  color,
  opacity,
  light = {},
) {
  if (!list.length || arg2 - arg1 <= 0.000001) {
    return;
  }
  const validatedUnionPolygonLoops2 = validatedUnionPolygonLoops(
    list,
    0.000001,
  );
  const flag = validatedUnionPolygonLoops2.length > 0;
  const value = splitFloorPolygonsByHoles(
    flag ? validatedUnionPolygonLoops2 : list,
  );
  const depthWrite =
    !flag && opacity < 0.999 && light.depthWrite === undefined
      ? {
          ...light,
          depthWrite: true,
          depthFunc: THREE.LessDepth,
        }
      : light;
  for (const entry of value) {
    const extrudeGeometry = new THREE.ExtrudeGeometry(entry, {
      depth: arg2 - arg1,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1,
    });
    const invisibleMaterial = createInvisibleMaterial();
    const glassMaterial = createGlassMaterial(color, opacity, depthWrite);
    const light2 = new THREE.Mesh(extrudeGeometry, [invisibleMaterial, glassMaterial]);
    light2.rotation.x = Math.PI / 2;
    light2.position.y = arg2;
    const awmbV6 = opacity >= 0.999;
    light2.castShadow = light.castShadow === true;
    if (light.lightOccluder) {
      light2.layers.set(HELPER_LAYER);
    }
    light2.receiveShadow = awmbV6;
    light2.renderOrder = light.renderOrder ?? 4;
    worldGroup.add(light2);
  }
}
function addFloorPolygonMeshes(
  list,
  arg1,
  flag2,
  value,
  depthWrite = {},
) {
  if (!list.length) {
    return;
  }
  const validatedUnionPolygonLoops2 = validatedUnionPolygonLoops(
    list,
    0.000001,
  );
  const flag = validatedUnionPolygonLoops2.length > 0;
  const splitFloorPolygonsByHolesResult = splitFloorPolygonsByHoles(
    flag ? validatedUnionPolygonLoops2 : list,
  );
  const topColor =
    !flag &&
    value < 0.999 &&
    depthWrite.depthWrite === undefined
      ? {
          ...depthWrite,
          depthWrite: true,
          depthFunc: THREE.LessDepth,
        }
      : depthWrite;
  for (const entry of splitFloorPolygonsByHolesResult) {
    const shapeGeometry = new THREE.ShapeGeometry(entry, 1);
    const $0_2480 = createWallTopMaterial(flag2, value, topColor);
    const light = new THREE.Mesh(shapeGeometry, $0_2480);
    light.rotation.x = Math.PI / 2;
    light.position.y = arg1 + 0.0005;
    light.castShadow = false;
    light.receiveShadow = false;
    light.renderOrder = depthWrite.renderOrder ?? 4;
    worldGroup.add(light);
  }
}
function buildWallCornerCaps(list, color, arg2) {
  const list2 = [];
  const list3 = [];
  for (
    let value = 0;
    value < list.length;
    value += 1
  ) {
    const worldPoint = list[value];
    const worldPoint2 = list[(value + 1) % list.length];
    const bwccV2 = worldPoint2.x - worldPoint.x;
    const bwccV3 = worldPoint2.z - worldPoint.z;
    const hypot = Math.hypot(bwccV2, bwccV3);
    if (hypot <= 0.001) {
      continue;
    }
    const bwccV5 = (worldPoint.x + worldPoint2.x) / 2;
    const bwccV6 = (worldPoint.z + worldPoint2.z) / 2;
    const angle = -Math.atan2(bwccV3, bwccV2);
    const vector3 = new THREE.Matrix4().compose(
      new THREE.Vector3(bwccV5, arg2 + 0.021, bwccV6),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle,
      ),
      new THREE.Vector3(1, 1, 1),
    );
    const vector32 = new THREE.Matrix4().compose(
      new THREE.Vector3(bwccV5, arg2 + 0.026, bwccV6),
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle,
      ),
      new THREE.Vector3(1, 1, 1),
    );
    list2.push(
      new THREE.BoxGeometry(hypot, 0.042, 0.038).applyMatrix4(vector3),
    );
    list3.push(
      new THREE.BoxGeometry(hypot + 0.025, 0.066, 0.078).applyMatrix4(
        vector32,
      ),
    );
  }
  const flag = list2.length ? mergeGeometries(list2) : null;
  const flag2 = list3.length ? mergeGeometries(list3) : null;
  list2.forEach((dispose) => dispose.dispose());
  list3.forEach((dispose) => dispose.dispose());
  if (flag) {
    const object3d = new THREE.Mesh(
      flag,
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.82,
        toneMapped: false,
      }),
    );
    object3d.renderOrder = 3;
    object3d.userData.exportRole = "outline";
    object3d.userData.batchedFloorEdgeCount = list.length;
    worldGroup.add(object3d);
  }
  if (flag2) {
    const object3d = new THREE.Mesh(
      flag2,
      new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    );
    object3d.renderOrder = 2;
    object3d.userData.exportRole = "outline";
    object3d.userData.batchedFloorEdgeCount = list.length;
    worldGroup.add(object3d);
  }
}
function addFloorFillMeshes(list, arg1, arg2) {
  if (!Array.isArray(list) || list.length < 3) {
    return;
  }
  const list2 = list.map((worldPoint) => ({
    x: worldPoint.x,
    y: worldPoint.z,
  }));
  const value = list2.map((arg0, arg12) =>
    distance(
      arg0,
      list2[(arg12 + 1) % list2.length],
    ),
  );
  const list3 = [0];
  for (const entry of value) {
    list3.push(list3.at(-1) + entry);
  }
  const handler = ({
    distance: distance2,
    innerAlpha: innerAlpha,
    outerAlpha: outerAlpha,
    columnStrength: param,
    y: param2,
    renderOrder: renderOrder,
  }) => {
    const polygonCentroidResult = polygonCentroid(list2, distance2);
    const list4 = [];
    const list5 = [];
    const list6 = [];
    const list7 = [];
    for (
      let count = 0;
      count < list2.length;
      count += 1
    ) {
      const affmV6 = (count + 1) % list2.length;
      const planPoint = list2[count];
      const planPoint2 = list2[affmV6];
      const planPoint3 = polygonCentroidResult[count];
      const planPoint4 = polygonCentroidResult[affmV6];
      list4.push(
        planPoint.x,
        param2,
        planPoint.y,
        planPoint3.x,
        param2,
        planPoint3.y,
        planPoint4.x,
        param2,
        planPoint4.y,
        planPoint.x,
        param2,
        planPoint.y,
        planPoint4.x,
        param2,
        planPoint4.y,
        planPoint2.x,
        param2,
        planPoint2.y,
      );
      list5.push(
        innerAlpha,
        outerAlpha,
        outerAlpha,
        innerAlpha,
        outerAlpha,
        innerAlpha,
      );
      list6.push(0, 1, 1, 0, 1, 0);
      const affmV7 = list3[count];
      const affmV8 = list3[count + 1];
      list7.push(
        affmV7,
        affmV7,
        affmV8,
        affmV7,
        affmV8,
        affmV8,
      );
    }
    const el = new THREE.BufferGeometry();
    el.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(list4, 3),
    );
    el.setAttribute(
      "glowAlpha",
      new THREE.Float32BufferAttribute(list5, 1),
    );
    el.setAttribute(
      "glowAcross",
      new THREE.Float32BufferAttribute(list6, 1),
    );
    el.setAttribute(
      "glowAlong",
      new THREE.Float32BufferAttribute(list7, 1),
    );
    el.computeVertexNormals();
    const renderOrder2 = new THREE.Mesh(
      el,
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: {
            value: new THREE.Color(arg1),
          },
          glowColumnStrength: {
            value: param,
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
    renderOrder2.renderOrder = renderOrder;
    worldGroup.add(renderOrder2);
  };
  handler({
    distance: 0.24,
    innerAlpha: 0.4,
    outerAlpha: 0.055,
    columnStrength: 0,
    y: arg2 + 0.008,
    renderOrder: 3,
  });
  handler({
    distance: 1.25,
    innerAlpha: 0.3,
    outerAlpha: 0.008,
    columnStrength: 0.82,
    y: arg2 + 0.005,
    renderOrder: 2,
  });
}
function polygonCentroid(list, arg1) {
  const planPoint = list.reduce(
    (planPoint2, planPoint3) => ({
      x: planPoint2.x + planPoint3.x / list.length,
      y: planPoint2.y + planPoint3.y / list.length,
    }),
    {
      x: 0,
      y: 0,
    },
  );
  return list.map((planPoint2) => {
    const value = planPoint2.x - planPoint.x;
    const pcV2 = planPoint2.y - planPoint.y;
    const hypot = Math.max(Math.hypot(value, pcV2), 0.000001);
    return {
      x: planPoint2.x + (value / hypot) * arg1,
      y: planPoint2.y + (pcV2 / hypot) * arg1,
    };
  });
}
function addCeilingMeshes(list, arg1) {
  if (!list.length) {
    return;
  }
  const list2 = list.map((list3) => {
    const value = polygonCentroid(list3, 0.028);
    const item2 =
      polygonArea(value) >= 0 ? value : [...value].reverse();
    return buildCanvasPathFromPoints(THREE.Shape, item2);
  });
  const item = list2.map((arg0) => {
    const rotateX = new THREE.ShapeGeometry(arg0, 1);
    rotateX.rotateX(Math.PI / 2);
    rotateX.translate(0, arg1, 0);
    return rotateX;
  });
  const flag = mergeGeometries(item);
  item.forEach((dispose) => dispose.dispose());
  if (!flag) {
    return;
  }
  const object3d = new THREE.Mesh(
    flag,
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
  object3d.renderOrder = 1;
  object3d.userData.batchedWallContactShadowCount =
    list2.length;
  worldGroup.add(object3d);
}
function addGroundGridHelper(arg0, grid, arg2) {
  const value = Math.max(Math.round(arg0 / 1.25), 12);
  const object3d = new THREE.GridHelper(
    arg0,
    value,
    grid.grid,
    grid.grid,
  );
  const flag = new THREE.Vector3();
  object3d.material.transparent = true;
  object3d.material.opacity = 0.24;
  object3d.material.depthWrite = false;
  object3d.material.toneMapped = false;
  object3d.material.onBeforeCompile = (uniforms) => {
    uniforms.uniforms.gridFadeNear = {
      value: arg0 * 0.18,
    };
    uniforms.uniforms.gridFadeFar = {
      value: arg0 * 0.46,
    };
    uniforms.uniforms.gridDepthFadeNear = {
      value: arg0 * 0.18,
    };
    uniforms.uniforms.gridDepthFadeFar = {
      value: arg0 * 0.36,
    };
    uniforms.vertexShader = uniforms.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;",
      )
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvGridLocalPosition = position.xz;\nvGridViewDepth = max(-mvPosition.z, 0.0);",
      );
    uniforms.fragmentShader = uniforms.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float gridFadeNear;\nuniform float gridFadeFar;\nuniform float gridDepthFadeNear;\nuniform float gridDepthFadeFar;\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;",
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "vec4 diffuseColor = vec4( diffuse, opacity );\nfloat radialFade = 1.0 - smoothstep(gridFadeNear, gridFadeFar, length(vGridLocalPosition));\nfloat depthFade = 1.0 - smoothstep(gridDepthFadeNear, gridDepthFadeFar, vGridViewDepth);\ndiffuseColor.a *= radialFade * mix(0.28, 1.0, depthFade);",
      );
    object3d.material.userData.depthFadeShader = uniforms;
  };
  object3d.onBeforeRender = (arg02, arg1, camera2) => {
    const isUniforms = object3d.material.userData.depthFadeShader;
    if (!isUniforms) {
      return;
    }
    object3d.getWorldPosition(flag);
    const maxValue = Math.max(
      camera2.position.distanceTo(orbitControls?.target || flag),
      1,
    );
    const maxValue2 = camera2.isOrthographicCamera
      ? Math.abs(camera2.top - camera2.bottom) /
        Math.max(camera2.zoom, 0.001)
      : maxValue *
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera2.fov * 0.5));
    const hypot = Math.max(
      Math.hypot(maxValue2 * Math.max(camera2.aspect, 0.1), maxValue2),
      2,
    );
    const agghV5 = maxValue + hypot * 0.2;
    isUniforms.uniforms.gridDepthFadeNear.value = agghV5;
    isUniforms.uniforms.gridDepthFadeFar.value = Math.max(
      agghV5 + 1,
      maxValue + hypot * 0.85,
    );
  };
  object3d.position.y = arg2 + 0.012;
  object3d.renderOrder = 2;
  object3d.userData.exportRole = "grid";
  worldGroup.add(object3d);
}
function addFloorEdgeLines(list, arg1) {
  if (!Array.isArray(list) || list.length < 3) {
    return;
  }
  const list2 = list.map((worldPoint) => ({
    x: worldPoint.x,
    y: worldPoint.z,
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
  ].forEach((spread, arg12) => {
    const item = polygonCentroid(list2, spread.spread).map(
      (planPoint) => ({
        x: planPoint.x + spread.offsetX,
        y: planPoint.y + spread.offsetY,
      }),
    );
    const value = buildCanvasPathFromPoints(THREE.Shape, item);
    const camera2 = new THREE.Mesh(
      new THREE.ShapeGeometry(value, 1),
      new THREE.MeshBasicMaterial({
        color: 329482,
        transparent: true,
        opacity: spread.opacity,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    camera2.rotation.x = Math.PI / 2;
    camera2.position.y = arg1 + 0.001 + arg12 * 0.00015;
    camera2.renderOrder = 1 + arg12;
    worldGroup.add(camera2);
  });
}
function rebuildActiveFloorPreview({
  preserveLightCache: preserveLightCache = false,
} = {}) {
  if (!worldGroup) {
    return;
  }
  applyPreviewEnvironment();
  clearWorldGroup();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
  const ppm = pixelsPerMeter();
  if (!ppm) {
    return;
  }
  const grid = resolvedThemeColors();
  const bounds = activeFloorContentBounds();
  const originX =
    architecturePlanOrigin?.x ?? (bounds.minX + bounds.maxX) / 2;
  const originY =
    architecturePlanOrigin?.y ?? (bounds.minY + bounds.maxY) / 2;
  const planToWorld = (planPoint) => ({
    x: (planPoint.x - originX) / ppm,
    z: (planPoint.y - originY) / ppm,
  });
  const worldW = Math.max(bounds.width / ppm + 1, 3);
  const worldH = Math.max(bounds.height / ppm + 1, 3);
  const floorY = -0.008;
  const depth = 0.16;
  const slabY = floorY - depth;
  const edgeY = slabY - 0.035;
  const groundSize = Math.max(Math.max(worldW, worldH) * 16, 260);
  const object3d = new THREE.Mesh(
    new THREE.PlaneGeometry(groundSize, groundSize),
    new THREE.MeshBasicMaterial({
      color: grid.ground,
      toneMapped: false,
    }),
  );
  object3d.rotation.x = -Math.PI / 2;
  object3d.position.y = edgeY;
  object3d.receiveShadow = false;
  object3d.userData.exportRole = "background";
  worldGroup.add(object3d);
  addGroundGridHelper(groundSize, grid, edgeY);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: grid.floor,
    roughness: 0.96,
    metalness: 0,
    emissive: grid.floor,
    emissiveIntensity: 0.025,
  });
  const polygons = getFloorPolygons(ppm);
  const addFloorPolygon = (list) => {
    addFloorEdgeLines(list, edgeY);
    if (floorScene.settings.floorEdgeVisible !== false) {
      buildWallCornerCaps(list, grid.floorEdge, slabY);
    }
  };
  const makeWallMesh = (value, arg, flag) => {
    const mesh = new THREE.Mesh(arg, floorMaterial);
    mesh.rotation.x = flag ? Math.PI / 2 : 0;
    mesh.position.y = flag
      ? floorY
      : floorY - depth / 2;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.userData.exportRole = "plan";
    worldGroup.add(mesh);
    addFloorPolygon(value);
  };
  if (polygons.length) {
    const list = polygons.map((polygon) =>
      polygon.map(planToWorld),
    );
    const value = list.map((item) => {
      const moveTo = new THREE.Shape();
      item.forEach((worldPoint, arg) => {
        if (arg === 0) {
          moveTo.moveTo(worldPoint.x, worldPoint.z);
        } else {
          moveTo.lineTo(worldPoint.x, worldPoint.z);
        }
      });
      moveTo.closePath();
      return moveTo;
    });
    makeWallMesh(
      list[0],
      new THREE.ExtrudeGeometry(value, {
        depth: depth,
        bevelEnabled: false,
        steps: 1,
      }),
      true,
    );
    for (const entry of list.slice(1)) {
      addFloorPolygon(entry);
    }
  } else {
    const list = [
      {
        x: -worldW / 2,
        z: -worldH / 2,
      },
      {
        x: worldW / 2,
        z: -worldH / 2,
      },
      {
        x: worldW / 2,
        z: worldH / 2,
      },
      {
        x: -worldW / 2,
        z: worldH / 2,
      },
    ];
    makeWallMesh(
      list,
      new THREE.BoxGeometry(worldW, depth, worldH),
      false,
    );
  }
  const openings = [
    ...floorScene.windows,
    ...floorScene.doors.map((door) => ({
      ...door,
      sill: 0,
    })),
    ...floorScene.railings.map((wall) => {
      const item = floorScene.walls.find(
        (wall2) => wall2.id === wall.wallId,
      );
      return {
        ...wall,
        sill: 0,
        height: item?.height || floorScene.settings.wallHeight,
      };
    }),
  ];
  const wallSegments = [];
  const idSet = new Set();
  const joinExtensions = getWallJoinExtensions(ppm);
  for (const wall of floorScene.walls) {
    const opacity =
      wall.opacity === null || wall.opacity === undefined
        ? floorScene.settings.wallOpacity
        : clamp(
            finite(wall.opacity, floorScene.settings.wallOpacity),
            0,
            1,
          );
    for (const wall2 of wallSolidPieces(
      wall,
      openings,
      ppm,
      wall.height,
    )) {
      const footprint = extrudeWallSegmentShape(
        wall,
        wall2,
        ppm,
        planToWorld,
        joinExtensions[wall.id],
      );
      if (!footprint) {
        continue;
      }
      const value = [
        canonicalPolygonKey(footprint, 4),
        wall2.bottom.toFixed(5),
        wall2.top.toFixed(5),
        opacity.toFixed(4),
      ].join("|");
      if (!idSet.has(value)) {
        idSet.add(value);
        wallSegments.push({
          wallId: wall.id,
          footprint: footprint,
          bottom: wall2.bottom,
          top: wall2.top,
          opacity: opacity,
        });
      }
    }
  }
  const wallHeights = [
    ...new Set(
      wallSegments
        .flatMap((bottom) => [
          bottom.bottom,
          bottom.top,
        ])
        .map((toFixed) => toFixed.toFixed(6)),
    ),
  ]
    .map(Number)
    .sort((arg, arg2) => arg - arg2);
  addCeilingMeshes(
    wallSegments
      .filter((bottom) => bottom.bottom <= 0.000001)
      .map((footprint) => footprint.footprint),
    floorY + 0.0025,
  );
  for (
    let n = 0;
    n < wallHeights.length - 1;
    n += 1
  ) {
    const value = wallHeights[n];
    const local2 = wallHeights[n + 1];
    if (local2 - value <= 0.000001) {
      continue;
    }
    const local3 = (value + local2) / 2;
    const list = wallSegments.filter(
      (bottom) =>
        local3 > bottom.bottom - 0.000001 &&
        local3 < bottom.top + 0.000001,
    );
    const byKey = new Map();
    for (const opacity of list) {
      const toFixedResult = opacity.opacity.toFixed(4);
      if (!byKey.has(toFixedResult)) {
        byKey.set(toFixedResult, {
          opacity: opacity.opacity,
          volumes: [],
        });
      }
      byKey.get(toFixedResult).volumes.push(opacity);
    }
    for (const volumes of byKey.values()) {
      addWallMeshBatch(
        volumes.volumes.map(
          (footprint) => footprint.footprint,
        ),
        value,
        local2,
        grid.wall,
        volumes.opacity,
        {
          castShadow: true,
          lightOccluder: true,
        },
      );
      const list3 = volumes.volumes
        .filter(
          (top) => Math.abs(top.top - local2) <= 0.000001,
        )
        .map((footprint) => footprint.footprint);
      addFloorPolygonMeshes(list3, local2, grid.wall, volumes.opacity, {
        topColor: grid.wall,
      });
    }
    const list2 = list
      .filter((wall) => isSelected("wall", wall.wallId))
      .map((footprint) => footprint.footprint);
    if (list2.length) {
      addWallMeshBatch(list2, value, local2, grid.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: grid.accent,
        emissiveIntensity: 0.12,
        renderOrder: 5,
      });
      const list3 = list
        .filter(
          (wall) =>
            isSelected("wall", wall.wallId) &&
            Math.abs(wall.top - local2) <= 0.000001,
        )
        .map((footprint) => footprint.footprint);
      addFloorPolygonMeshes(list3, local2, grid.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: grid.accent,
        emissiveIntensity: 0.12,
        topOpacity: 0.12,
        renderOrder: 6,
      });
    }
  }
  for (const wall2 of floorScene.walls) {
    const dx = wall2.end.x - wall2.start.x;
    const dy = wall2.end.y - wall2.start.y;
    const dist = Math.hypot(dx, dy);
    if (!dist) {
      continue;
    }
    const opts = {
      x: dx / dist,
      y: dy / dist,
    };
    const value = -Math.atan2(dy, dx);
    for (const item of floorScene.windows.filter(
      (wall) => wall.wallId === wall2.id,
    )) {
      const clampWindowT2 = clampWindowT(wall2, item, ppm);
      const planPoint = {
        x: wall2.start.x + dx * clampWindowT2,
        y: wall2.start.y + dy * clampWindowT2,
      };
      const worldPoint = planToWorld(planPoint);
      const group = new THREE.Group();
      group.position.set(worldPoint.x, 0, worldPoint.z);
      group.rotation.y = value;
      const w = Math.min(
        item.width,
        wallLengthMeters(wall2, ppm),
      );
      const h = Math.min(
        item.height,
        Math.max(wall2.height - item.sill, 0.2),
      );
      addSharedArchMesh(
        group,
        [
          [
            w * 0.94,
            h * 0.92,
            0.025,
            0,
            item.sill + h / 2,
            0,
          ],
        ],
        grid.glass,
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
      const accent = isSelected("window", item.id)
        ? grid.accent
        : grid.frame;
      const n = 0.045;
      const opts2 = {
        rounded: false,
        metalness: 0.15,
        castShadow: false,
        receiveShadow: false,
      };
      const entries = [
        [w, n, 0.06, 0, item.sill, 0],
        [w, n, 0.06, 0, item.sill + h, 0],
        [
          n,
          h,
          0.06,
          -w / 2,
          item.sill + h / 2,
          0,
        ],
        [
          n,
          h,
          0.06,
          w / 2,
          item.sill + h / 2,
          0,
        ],
      ];
      const flag = item.hasDivider !== false && w > 1.2;
      if (flag) {
        entries.push([
          n * 0.7,
          h,
          0.055,
          0,
          item.sill + h / 2,
          0,
        ]);
      }
      addSharedArchMesh(group, entries, accent, opts2);
      group.userData.optimizationStats = {
        type: flag ? "window-divided" : "window-plain",
        before: flag ? 6 : 5,
        after: 2,
      };
      worldGroup.add(group);
    }
    for (const item of floorScene.railings.filter(
      (wall) => wall.wallId === wall2.id,
    )) {
      const clampWindowT2 = clampWindowT(wall2, item, ppm);
      const planPoint = {
        x: wall2.start.x + dx * clampWindowT2,
        y: wall2.start.y + dy * clampWindowT2,
      };
      const worldPoint = planToWorld(planPoint);
      const group = new THREE.Group();
      group.position.set(worldPoint.x, 0, worldPoint.z);
      group.rotation.y = value;
      const w = Math.min(
        item.width,
        wallLengthMeters(wall2, ppm),
      );
      const h = Math.min(item.height, wall2.height);
      const accent = isSelected("railing", item.id)
        ? grid.accent
        : grid.frame;
      const maxValue = Math.min(Math.max(w * 0.012, 0.028), 0.05);
      const n = 0.08;
      const maxValue2 = Math.max(
        h - n - maxValue * 1.4,
        0.2,
      );
      addSharedArchMesh(
        group,
        [
          [
            Math.max(w - maxValue * 2.4, 0.2),
            maxValue2,
            0.018,
            0,
            n + maxValue2 * 0.5,
            0,
          ],
        ],
        grid.glass,
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
      const opts2 = {
        rounded: false,
        metalness: 0.58,
        roughness: 0.24,
        castShadow: false,
        receiveShadow: false,
      };
      const maxValue3 = Math.max(
        2,
        Math.min(16, Math.ceil(w / 1.5) + 1),
      );
      const entries = [[w, maxValue, 0.055, 0, h, 0]];
      const entries2 = [];
      for (let n2 = 0; n2 < maxValue3; n2 += 1) {
        const local5 =
          -w / 2 + (w * n2) / (maxValue3 - 1);
        entries.push([
          maxValue,
          h,
          0.055,
          local5,
          h * 0.5,
          0,
        ]);
        entries2.push([
          maxValue * 2,
          maxValue * 0.8,
          0.08,
          local5,
          maxValue * 0.4,
          0,
        ]);
      }
      addSharedArchMesh(group, entries, accent, opts2);
      addSharedArchMesh(
        group,
        entries2,
        grid.furnitureSoft,
        opts2,
      );
      group.userData.optimizationStats = {
        type: "glass-railing",
        before: 2 + maxValue3 * 2,
        after: 3,
      };
      worldGroup.add(group);
    }
    for (const item of floorScene.doors.filter(
      (wall) => wall.wallId === wall2.id,
    )) {
      const clampWindowT2 = clampWindowT(wall2, item, ppm);
      const planPoint = {
        x: wall2.start.x + dx * clampWindowT2,
        y: wall2.start.y + dy * clampWindowT2,
      };
      const worldPoint = planToWorld(planPoint);
      const group = new THREE.Group();
      group.position.set(worldPoint.x, 0, worldPoint.z);
      group.rotation.y = value;
      const w = Math.min(
        item.width,
        wallLengthMeters(wall2, ppm),
      );
      const h = Math.min(item.height, wall2.height);
      const selected = isSelected("door", item.id);
      const doorType = item.doorType || "solid";
      const accent = selected ? grid.accent : grid.frame;
      const n = 0.065;
      const opts2 = {
        rounded: false,
        metalness: 0.08,
        castShadow: false,
        receiveShadow: false,
      };
      const entries = [
        [n, h, 0.09, -w / 2, h / 2, 0],
        [n, h, 0.09, w / 2, h / 2, 0],
        [w + n, n, 0.09, 0, h, 0],
      ];
      if (doorType === "roller-shutter") {
        const local2 = item.swing === -1 ? -1 : 1;
        entries.push([
          w + n * 0.6,
          n * 1.8,
          0.13,
          0,
          h - n * 0.35,
          local2 * 0.04,
        ]);
      }
      addSharedArchMesh(group, entries, accent, opts2);
      if (doorType === "frame-only") {
        group.userData.optimizationStats = {
          type: "door-frame-only",
          before: 3,
          after: 1,
        };
        worldGroup.add(group);
        continue;
      }
      if (doorType === "sliding-glass") {
        const height2 = Math.max(h - n * 0.85, 0.4);
        const width2 = Math.max(w * 0.54, 0.28);
        const local2 = item.hinge === "right" ? 1 : -1;
        const slidingDoorPanelCenters2 = slidingDoorPanelCenters(
          w,
          local2,
        );
        stairRiserMaterialOptions(
          group,
          [
            {
              width: width2,
              height: height2,
              centerX: slidingDoorPanelCenters2.fixed,
              centerZ: -0.024,
            },
            {
              width: width2,
              height: height2,
              centerX: slidingDoorPanelCenters2.moving,
              centerZ: 0.024,
            },
          ],
          accent,
          grid.glass,
        );
        const w3 =
          slidingDoorPanelCenters2.moving - local2 * width2 * 0.36;
        addSharedArchMesh(
          group,
          [
            [0.026, 0.15, 0.055, w3, h * 0.52, -0.052],
            [0.026, 0.15, 0.055, w3, h * 0.52, 0.052],
          ],
          grid.furnitureDark,
          {
            rounded: false,
            metalness: 0.5,
            castShadow: false,
            receiveShadow: false,
          },
        );
        group.userData.optimizationStats = {
          type: "door-sliding-glass",
          before: 15,
          after: 5,
        };
        worldGroup.add(group);
        continue;
      }
      if (doorType === "roller-shutter") {
        const maxValue = Math.max(w - n * 1.3, 0.4);
        const maxValue2 = Math.max(h - n * 0.85, 0.8);
        const local4 = item.swing === -1 ? -1 : 1;
        addSharedArchMesh(
          group,
          [
            [
              maxValue,
              maxValue2,
              0.045,
              0,
              maxValue2 * 0.5,
              local4 * 0.04,
            ],
          ],
          selected ? grid.accent : grid.furnitureSoft,
          {
            rounded: false,
            metalness: 0.36,
            roughness: 0.42,
            castShadow: false,
            receiveShadow: false,
          },
        );
        const maxValue3 = Math.max(
          5,
          Math.min(36, Math.round(maxValue2 / 0.12)),
        );
        const entries2 = [];
        for (let n2 = 1; n2 < maxValue3; n2 += 1) {
          const local6 = (maxValue2 * n2) / maxValue3;
          entries2.push([
            maxValue * 0.98,
            0.012,
            0.052,
            0,
            local6,
            local4 * 0.052,
          ]);
        }
        addSharedArchMesh(group, entries2, grid.furnitureDark, {
          rounded: false,
          metalness: 0.42,
          roughness: 0.34,
          castShadow: false,
          receiveShadow: false,
        });
        group.userData.optimizationStats = {
          type: "door-roller-shutter",
          before: 5 + maxValue3,
          after: 3,
        };
        worldGroup.add(group);
        continue;
      }
      if (doorType === "entry") {
        const maxValue = Math.max(w - n * 1.5, 0.4);
        const maxValue2 = Math.max(h - n * 0.85, 0.8);
        const accent2 = selected ? grid.accent : grid.furnitureDark;
        addSharedArchMesh(
          group,
          [[maxValue, maxValue2, 0.065, 0, maxValue2 * 0.5, 0]],
          accent2,
          {
            rounded: false,
            roughness: 0.58,
            metalness: 0.1,
            castShadow: false,
            receiveShadow: false,
          },
        );
        addSharedArchMesh(
          group,
          [
            [maxValue * 0.76, 0.022, 0.078, 0, h * 0.68, 0.012],
            [maxValue * 0.76, 0.022, 0.078, 0, h * 0.34, 0.012],
          ],
          grid.furnitureSoft,
          {
            rounded: false,
            roughness: 0.5,
            castShadow: false,
            receiveShadow: false,
          },
        );
        const local4 =
          item.hinge === "right" ? -maxValue * 0.34 : maxValue * 0.34;
        addSharedArchMesh(
          group,
          [[0.035, 0.18, 0.085, local4, h * 0.5, 0.055]],
          grid.furnitureLight,
          {
            rounded: false,
            metalness: 0.58,
            roughness: 0.24,
            castShadow: false,
            receiveShadow: false,
          },
        );
        group.userData.optimizationStats = {
          type: "door-entry",
          before: 7,
          after: 4,
        };
        worldGroup.add(group);
        continue;
      }
      if (doorType === "double") {
        const width2 = Math.max((w - n * 1.8) / 2, 0.25);
        const height2 = Math.max(h - n * 0.8, 0.4);
        const angle = (item.swing === -1 ? 1 : -1) * Math.PI * 0.42;
        const entries2 = [];
        const entries3 = [];
        for (const factor of [-1, 1]) {
          const local2 = factor * (w / 2 - n * 0.5);
          const rotationY = factor < 0 ? angle : -angle;
          const w3 = factor < 0 ? width2 / 2 : -width2 / 2;
          const worldPoint2 = {
            x: local2 + w3 * Math.cos(rotationY),
            z: -w3 * Math.sin(rotationY),
          };
          entries2.push({
            width: width2,
            height: height2,
            depth: 0.04,
            x: worldPoint2.x,
            y: height2 / 2,
            z: worldPoint2.z,
            rotationY: rotationY,
          });
          const w4 =
            factor < 0 ? width2 * 0.42 : -width2 * 0.42;
          entries3.push({
            width: 0.035,
            height: 0.055,
            depth: 0.065,
            x:
              local2 +
              w4 * Math.cos(rotationY) +
              Math.sin(rotationY) * 0.04,
            y: h * 0.5,
            z: -w4 * Math.sin(rotationY) + Math.cos(rotationY) * 0.04,
            rotationY: rotationY,
          });
        }
        addSharedArchMesh(
          group,
          entries2,
          selected ? grid.accent : grid.doorLeaf,
          {
            rounded: false,
            roughness: 0.66,
            castShadow: false,
            receiveShadow: false,
          },
        );
        addSharedArchMesh(group, entries3, grid.furnitureDark, {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false,
        });
        group.userData.optimizationStats = {
          type: "door-double",
          before: 7,
          after: 3,
        };
        worldGroup.add(group);
        continue;
      }
      const isRight = item.hinge === "right";
      const width = Math.max(w - n * 1.4, 0.2);
      const height = Math.max(h - n * 0.8, 0.4);
      const group2 = new THREE.Group();
      group2.position.x = isRight
        ? w / 2 - n * 0.5
        : -w / 2 + n * 0.5;
      group2.rotation.y = doorLeafRotation(item, Math.PI * 0.42);
      group.add(group2);
      const centerX = isRight ? -width / 2 : width / 2;
      if (doorType === "glass") {
        stairRiserMaterialOptions(
          group2,
          [
            {
              width: width,
              height: height,
              centerX: centerX,
              centerZ: 0,
            },
          ],
          accent,
          grid.glass,
        );
      } else {
        addSharedArchMesh(
          group2,
          [[width, height, 0.04, centerX, height / 2, 0]],
          selected ? grid.accent : grid.doorLeaf,
          {
            rounded: false,
            roughness: 0.66,
            castShadow: false,
            receiveShadow: false,
          },
        );
      }
      const w2 = isRight ? -width * 0.42 : width * 0.42;
      addSharedArchMesh(
        group2,
        [[0.035, 0.055, 0.065, w2, h * 0.5, 0.04]],
        grid.furnitureDark,
        {
          rounded: false,
          metalness: 0.45,
          castShadow: false,
          receiveShadow: false,
        },
      );
      group.userData.optimizationStats = {
        type: doorType === "glass" ? "door-glass" : "door-solid",
        before: doorType === "glass" ? 9 : 5,
        after: doorType === "glass" ? 4 : 3,
      };
      worldGroup.add(group);
    }
  }
  const has = shadowCastingLightIdSet();
  const wallMeshes = [];
  for (const item of floorScene.items) {
    const worldPoint = planToWorld(item);
    const group = buildItemPreviewGroup(item, has);
    group.position.set(
      worldPoint.x,
      item.elevation || 0,
      worldPoint.z,
    );
    applyItemYawRotation(group, item);
    group.userData.modelLayer = lightItemTypes.has(item.type)
      ? "lights"
      : "items";
    group.userData.exportRole =
      item.type === "planlabel" ? "label" : "plan";
    worldGroup.add(group);
    if (!lightItemTypes.has(item.type)) {
      wallMeshes.push({
        item: item,
        group: group,
      });
    }
  }
  instanceMergeIdenticalItems(worldGroup, wallMeshes);
  prepareInstanceMergeBatches(worldGroup, wallMeshes);
  worldGroup.traverse((object3d2) => {
    if (
      object3d2 !== worldGroup &&
      !object3d2.userData.exportRole
    ) {
      object3d2.userData.exportRole = "plan";
    }
  });
  countShadowLights(worldGroup, {
    rebuildAtlas: !preserveLightCache,
  });
}
function getPreviewFloorMode() {
  if (projectDoc?.previewFloorMode === "all" && projectDoc.floors.length > 1) {
    return "all";
  } else {
    return "active";
  }
}
function syncPreviewFloorButtons() {
  const value = getPreviewFloorMode();
  const flag = (projectDoc?.floors.length || 0) > 1;
  for (const element of previewFloorEls) {
    const spfbV2 = element.dataset.previewFloor === value;
    element.classList.toggle("active", spfbV2);
    element.setAttribute("aria-pressed", String(spfbV2));
    element.disabled =
      element.dataset.previewFloor === "all" && !flag;
  }
}
function setPreviewFloorMode(arg0, { persist: flag = true } = {}) {
  if (projectDoc) {
    projectDoc.previewFloorMode =
      arg0 === "all" && projectDoc.floors.length > 1 ? "all" : "active";
    syncPreviewFloorButtons();
    syncFloorCameraChrome();
    setCameraProjectionMode(getCameraProjectionMode(), {
      preserveView: false,
    });
    Promise.allSettled(loadVisibleExternalModels());
    rebuildWorldPreview();
    applyCameraView();
    if (flag) {
      scheduleSave();
    }
  }
}
function rebuildWorldPreview({ preserveLightCache: preserveLightCache = false } = {}) {
  if (!worldGroup) {
    return;
  }
  if (getPreviewFloorMode() !== "all") {
    rebuildActiveFloorPreview({
      preserveLightCache: preserveLightCache,
    });
    fitSpotLightToScene();
    return;
  }
  const group = worldGroup;
  const value = floorScene;
  const rwpV2 = activeFloorId;
  const rwpV3 = architecturePlanOrigin;
  applyPreviewEnvironment();
  clearWorldGroup();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
  const item = [...projectDoc.floors].sort(
    (elevation, elevation2) =>
      elevation.elevation - elevation2.elevation,
  );
  const rwpV4 = stageSession
    ? finite(projectDoc.exportFloorGap, 3)
    : finite(projectDoc.previewFloorGap, 3);
  item.forEach((floor, arg1) => {
    const object3d2 = new THREE.Group();
    object3d2.name = "floor-" + floor.id;
    object3d2.userData.floorId = floor.id;
    worldGroup = object3d2;
    floorScene = floor.scene;
    activeFloorId = floor.id;
    architecturePlanOrigin = {
      x: finite(floor.originX, 0),
      y: finite(floor.originY, 0),
    };
    rebuildActiveFloorPreview({
      preserveLightCache: preserveLightCache,
    });
    if (arg1 > 0) {
      for (const object3d of [...object3d2.children]) {
        if (
          ["background", "grid"].includes(object3d.userData?.exportRole)
        ) {
          object3d2.remove(object3d);
          disposeObject3dResources(object3d);
        }
      }
    }
    object3d2.position.set(
      finite(floor.offsetX, 0),
      arg1 * rwpV4,
      finite(floor.offsetZ, 0),
    );
    object3d2.rotation.y = -THREE.MathUtils.degToRad(
      finite(floor.rotation, 0),
    );
    group.add(object3d2);
  });
  worldGroup = group;
  floorScene = value;
  activeFloorId = rwpV2;
  architecturePlanOrigin = rwpV3;
  countShadowLights(worldGroup, {
    rebuildAtlas: !preserveLightCache,
  });
  fitSpotLightToScene();
  requestRender({
    shadows: true,
    scene: true,
    preserveLightCache: preserveLightCache,
  });
}
function showOnlyFloorsById(has) {
  if (!has.size || !worldGroup) {
    return;
  }
  if (getPreviewFloorMode() !== "all") {
    if (has.has(activeFloorId)) {
      rebuildWorldPreview();
    }
    return;
  }
  const object3d = worldGroup;
  const value = floorScene;
  const sofbV2 = activeFloorId;
  const sofbV3 = architecturePlanOrigin;
  const some = [...projectDoc.floors].sort(
    (elevation, elevation2) =>
      elevation.elevation - elevation2.elevation,
  );
  if (
    some.some(
      (id) =>
        !object3d.children.some(
          (object3d2) =>
            object3d2.userData?.floorId === id.id,
        ),
    )
  ) {
    rebuildWorldPreview();
    return;
  }
  try {
    for (const [pairKey, floor] of some.entries()) {
      if (
        has.has(floor.id) &&
        ((worldGroup = object3d.children.find(
          (object3d2) =>
            object3d2.userData?.floorId === floor.id,
        )),
        (floorScene = floor.scene),
        (activeFloorId = floor.id),
        (architecturePlanOrigin = {
          x: finite(floor.originX, 0),
          y: finite(floor.originY, 0),
        }),
        rebuildActiveFloorPreview(),
        pairKey > 0)
      ) {
        for (const object3d2 of [...worldGroup.children]) {
          if (
            ["background", "grid"].includes(
              object3d2.userData?.exportRole,
            )
          ) {
            worldGroup.remove(object3d2);
            disposeObject3dResources(object3d2);
          }
        }
      }
    }
  } finally {
    worldGroup = object3d;
    floorScene = value;
    activeFloorId = sofbV2;
    architecturePlanOrigin = sofbV3;
  }
  countShadowLights(object3d);
  fitSpotLightToScene();
}
function createPlanToWorldMapper() {
  const ppm = pixelsPerMeter();
  if (!ppm) {
    return null;
  }
  const value = activeFloorContentBounds();
  const cptwV2 = (value.minX + value.maxX) / 2;
  const cptwV3 = (value.minY + value.maxY) / 2;
  return {
    ppm: ppm,
    floorSurfaceY: -0.008,
    floorPolygons: getFloorPolygons(ppm),
    toWorld: (planPoint) => ({
      x: (planPoint.x - cptwV2) / ppm,
      z: (planPoint.y - cptwV3) / ppm,
    }),
  };
}
function removeWorldModelLayer(arg0) {
  if (worldGroup) {
    for (const object3d of [...worldGroup.children]) {
      if (object3d.userData.modelLayer === arg0) {
        worldGroup.remove(object3d);
        disposeObject3dResources(object3d);
      }
    }
  }
}
function rebuildWorldModelLayer(arg0, { preserveLightCache: preserveLightCache = false } = {}) {
  if (!worldGroup) {
    return;
  }
  const isToWorld = createPlanToWorldMapper();
  if (!isToWorld) {
    return;
  }
  removeWorldModelLayer(arg0);
  const flag = arg0 === "lights";
  const has = flag ? shadowCastingLightIdSet() : null;
  const list = [];
  for (const item of floorScene.items) {
    if (lightItemTypes.has(item.type) !== flag) {
      continue;
    }
    const worldPoint = isToWorld.toWorld(item);
    const group = buildItemPreviewGroup(item, has);
    group.position.set(
      worldPoint.x,
      item.elevation || 0,
      worldPoint.z,
    );
    applyItemYawRotation(group, item);
    group.userData.modelLayer = arg0;
    worldGroup.add(group);
    if (!flag) {
      list.push({
        item: item,
        group: group,
      });
    }
  }
  if (!flag) {
    instanceMergeIdenticalItems(worldGroup, list);
    prepareInstanceMergeBatches(worldGroup, list);
  }
  countShadowLights(worldGroup, {
    rebuildAtlas: !preserveLightCache,
  });
  if (flag) {
    syncOrbitControls();
  }
  requestRender({
    shadows: !flag && !preserveLightCache,
    preserveLightCache: preserveLightCache,
  });
}
function rebuildPreviewItemMeshes(preserveLightCache = {}) {
  rebuildWorldModelLayer("items", preserveLightCache);
}
function rebuildPreviewLightMeshes(preserveLightCache = {}) {
  rebuildWorldModelLayer("lights", preserveLightCache);
}
function findAncestorWithUserDataKey(arg0, has) {
  for (
    let isParent = arg0;
    isParent && isParent !== worldGroup;
    isParent = isParent.parent
  ) {
    if (has.has(isParent.userData?.modelLayer)) {
      return true;
    }
  }
  return false;
}
function computeWorldBoundingBox({ excludeModelLayers: has = null } = {}) {
  const union = new THREE.Box3();
  worldGroup.updateWorldMatrix(true, true);
  worldGroup.traverse((object3d) => {
    if (
      !!object3d.isMesh &&
      !["background", "grid", "light-source-preview"].includes(
        object3d.userData?.exportRole,
      ) &&
      (!has || !findAncestorWithUserDataKey(object3d, has))
    ) {
      if (object3d.isInstancedMesh) {
        object3d.computeBoundingBox();
        if (object3d.boundingBox) {
          union.union(
            object3d.boundingBox
              .clone()
              .applyMatrix4(object3d.matrixWorld),
          );
        }
        return;
      }
      object3d.geometry.computeBoundingBox();
      if (object3d.geometry.boundingBox) {
        union.union(
          object3d.geometry.boundingBox
            .clone()
            .applyMatrix4(object3d.matrixWorld),
        );
      }
    }
  });
  return union;
}
function fitSpotLightToScene() {
  if (
    !shadowCameraExpanded ||
    !previewSpotLight?.shadow?.camera ||
    !worldGroup
  ) {
    return false;
  }
  const value = computeWorldBoundingBox();
  if (value.isEmpty()) {
    return false;
  }
  worldGroup.updateWorldMatrix(true, true);
  previewSpotLight.updateWorldMatrix(true, false);
  previewSpotLight.target.updateWorldMatrix(true, false);
  const view = previewSpotLight.shadow.camera;
  const vector3 = new THREE.Vector3().setFromMatrixPosition(
    previewSpotLight.matrixWorld,
  );
  const vector32 = new THREE.Vector3().setFromMatrixPosition(
    previewSpotLight.target.matrixWorld,
  );
  view.position.copy(vector3);
  view.lookAt(vector32);
  view.updateMatrixWorld(true);
  const point3 = new THREE.Vector3(Infinity, Infinity, Infinity);
  const point32 = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const entry of [value.min.x, value.max.x]) {
    for (const entry2 of [value.min.y, value.max.y]) {
      for (const entry3 of [value.min.z, value.max.z]) {
        const vector33 = new THREE.Vector3(
          entry,
          entry2,
          entry3,
        ).applyMatrix4(view.matrixWorldInverse);
        point3.min(vector33);
        point32.max(vector33);
      }
    }
  }
  const maxValue = Math.max(
    point32.x - point3.x,
    point32.y - point3.y,
    1,
  );
  const maxValue2 = Math.max(MIN_PLAN_SNAP_METERS, maxValue * 0.05);
  const fsltV6 = -point32.z;
  const fsltV7 = -point3.z;
  const maxValue3 = Math.max(
    MIN_PLAN_SNAP_METERS,
    (fsltV7 - fsltV6) * 0.08,
  );
  view.left = point3.x - maxValue2;
  view.right = point32.x + maxValue2;
  view.bottom = point3.y - maxValue2;
  view.top = point32.y + maxValue2;
  view.near = Math.max(0.1, fsltV6 - maxValue3);
  view.far = Math.max(view.near + 1, fsltV7 + maxValue3);
  view.updateProjectionMatrix();
  previewSpotLight.shadow.needsUpdate = true;
  return true;
}
function applyCameraView(view = {}) {
  if (!camera || !orbitControls) {
    return;
  }
  const value =
    view.view === "top"
      ? "top"
      : view.view === "free"
        ? "free"
        : cameraViewMode();
  const topViewRotationResult = topViewRotation();
  const flag = getPreviewFloorMode() === "all";
  const pixelsPerMeterResult = pixelsPerMeter() || 100;
  const activeFloorContentBoundsResult = activeFloorContentBounds();
  const uniqueSet = computeWorldBoundingBox({
    excludeModelLayers: new Set(["items", "lights"]),
  });
  const point3 =
    flag && !uniqueSet.isEmpty()
      ? uniqueSet.getSize(new THREE.Vector3())
      : null;
  const point32 = uniqueSet.isEmpty()
    ? null
    : uniqueSet.getCenter(new THREE.Vector3());
  const maxValue =
    flag && point3
      ? clamp(Math.max(point3.x, point3.z), 5, 100)
      : clamp(Math.max(activeFloorContentBoundsResult.width, activeFloorContentBoundsResult.height) / pixelsPerMeterResult, 5, 35);
  const maxValue2 =
    flag && point3
      ? point3.y
      : Math.max(
          0,
          ...floorScene.walls.map((size) => size.height || 0),
        );
  const maxValue3 = Math.max(
    maxValue * 1.18,
    maxValue + maxValue2 * 0.32,
  );
  camera.userData.frameSize = maxValue3;
  camera.userData.cameraView = value;
  camera.userData.topRotation = topViewRotationResult;
  const point33 = point32
    ? new THREE.Vector3(point32.x, point32.y, point32.z)
    : new THREE.Vector3(0, Math.min(0.78, maxValue * 0.055), 0);
  let acvV9;
  if (camera.isPerspectiveCamera) {
    camera.aspect = camera.userData.viewportAspect || 1;
    applyCameraFocalLength();
    const acvV10 =
      maxValue3 /
      (Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV()) / 2) * 2);
    acvV9 = Math.max(acvV10 * 1.04, maxValue * 1.65, 8);
  } else {
    focusCameraOnPoint(maxValue3, camera.userData.viewportAspect || 1);
    acvV9 = Math.max(maxValue * 3.2, 18);
  }
  if (value === "top") {
    camera.up.copy(topViewForwardVector(topViewRotationResult));
    camera.position.set(point33.x, point33.y + acvV9, point33.z);
  } else {
    camera.up.set(0, 1, 0);
    const vector3 = new THREE.Vector3(1.08, 1.7, 1.12).normalize();
    camera.position.copy(point33).addScaledVector(vector3, acvV9);
  }
  getCameraPose(camera, point33);
  camera.zoom = 1;
  camera.lookAt(point33);
  camera.updateProjectionMatrix();
  orbitControls.target.copy(point33);
  syncOrbitControls();
  orbitControls.update();
}
function resolvePlanSnap(arg0, anchor, forceOrthogonalAxis = false) {
  const value = pixelsPerMeter() || 100;
  if (!isSnapActive()) {
    if (forceOrthogonalAxis && anchor) {
      const axisLockedPoint2 = axisLockedPoint(arg0, anchor);
      return {
        ...axisLockedPoint2,
        kind: "axis",
        distance: distance(arg0, axisLockedPoint2.point),
      };
    }
    return {
      point: {
        ...arg0,
      },
      kind: null,
      label: "",
      distance: 0,
    };
  }
  const settings = floorScene.settings;
  return snapPoint(arg0, floorScene.walls, {
    zoom: planView.zoom,
    screenTolerance: clamp(
      Math.round(finite(settings.snapTolerance, 13)),
      6,
      24,
    ),
    anchor: anchor,
    forceOrthogonalAxis: forceOrthogonalAxis,
    preferVerticalAxis: settings.snapOrthogonal !== false,
    angleStepDegrees: 15,
    gridSize: value * 0.1,
    intersections:
      settings.snapIntersections === false
        ? []
        : getWallIntersections(value),
    snapEndpoints: settings.snapEndpoints !== false,
    snapIntersections: settings.snapIntersections !== false,
    snapSegments: settings.snapSegments !== false,
    snapOrthogonal: settings.snapOrthogonal !== false,
    snapAngles: settings.snapAngles !== false,
    snapGrid: settings.snapGrid !== false,
  });
}
function isWallCloseSnap(point = snapHint) {
  if (
    !measureOrWallLastPoint ||
    wallDrawPointCount < 2 ||
    !point?.point
  ) {
    return false;
  }
  const value = Math.max(1, (pixelsPerMeter() || 100) * 0.01);
  return (
    point.kind === "endpoint" &&
    distance(point.point, measureOrWallLastPoint) <= value
  );
}
function updatePlanPointer(forceOrthogonalAxis = shiftKeyHeld) {
  if (!rawPlanPointer) {
    return;
  }
  planPointerPoint = {
    ...rawPlanPointer,
  };
  const value = pixelsPerMeter() || 100;
  const uppV2 = snapTemporarilyDisabled ? "吸附：临时关闭" : "吸附：关闭";
  if (activeTool === "scale" && scaleToolStart && forceOrthogonalAxis) {
    const axisLockedPoint2 = axisLockedPoint(
      rawPlanPointer,
      scaleToolStart,
    );
    planPointerPoint = axisLockedPoint2.point;
    snapHint = null;
    snapIndicator.textContent = "吸附：" + axisLockedPoint2.label;
  } else if (activeTool === "scale") {
    snapHint = null;
    snapIndicator.textContent = "吸附：自由";
  }
  cursorPosition.textContent =
    "X " +
    (planPointerPoint.x / value).toFixed(2) +
    " m · Y " +
    (planPointerPoint.y / value).toFixed(2) +
    " m";
  if (activeTool === "wall") {
    snapHint = resolvePlanSnap(rawPlanPointer, wallDrawAnchor, forceOrthogonalAxis);
    snapIndicator.textContent = isWallCloseSnap(snapHint)
      ? "闭合：点击闭合空间"
      : snapHint.kind
        ? (!isSnapActive() && forceOrthogonalAxis ? "锁定" : "吸附") +
          "：" +
          snapHint.label
        : isSnapActive()
          ? "吸附：自由"
          : uppV2;
  } else if (["window", "door", "railing"].includes(activeTool)) {
    const isT = nearestWall(
      planPointerPoint,
      floorScene.walls,
      16 / planView.zoom,
    );
    if (isT) {
      const size =
        doorSizePresets[DEFAULT_DOOR_TYPE] || doorSizePresets.solid;
      const uppV3 = {
        width:
          activeTool === "door"
            ? size.width
            : activeTool === "railing"
              ? 2
              : 1.4,
        t: isT.t,
      };
      const uppV4 = {
        wall: isT.wall,
        t: clampWindowT(isT.wall, uppV3, value),
      };
      windowPlacementPreview = activeTool === "window" ? uppV4 : null;
      doorPlacementPreview = activeTool === "door" ? uppV4 : null;
      railingPlacementPreview = activeTool === "railing" ? uppV4 : null;
      snapIndicator.textContent =
        activeTool === "door"
          ? "吸附：墙体门洞"
          : activeTool === "railing"
            ? "吸附：墙体栏杆"
            : "吸附：墙体";
    } else {
      windowPlacementPreview = null;
      doorPlacementPreview = null;
      railingPlacementPreview = null;
      snapIndicator.textContent = "吸附：未找到墙体";
    }
  } else if (activeTool !== "scale") {
    snapHint = null;
    windowPlacementPreview = null;
    doorPlacementPreview = null;
    railingPlacementPreview = null;
    snapIndicator.textContent = isSnapActive() ? "吸附：开启" : uppV2;
    const beginItemDragResult = beginItemDrag(planPointerPoint);
    planCanvas.style.cursor =
      beginItemDragResult?.type === "rotate-item"
        ? "grab"
        : beginItemDragResult?.type === "resize-item"
          ? "nwse-resize"
          : "";
  }
}
function onPlanPointerMove(event) {
  shiftKeyHeld = event.shiftKey;
  rawPlanPointer = screenToPlanWithView(
    pointerEventToCanvasPoint(event),
  );
  updatePlanPointer();
}
function onPlanPointerDown(event) {
  if (event.button !== 0 && event.button !== 1) {
    return;
  }
  planCanvas.focus({
    preventScroll: true,
  });
  const visibleScreen = pointerEventToCanvasPoint(event);
  const start = screenToPlanWithView(visibleScreen);
  if (event.button === 1 || isMiddleMousePanning) {
    event.preventDefault();
    beginLeaveStudio();
    dragState = {
      type: "pan",
      pointerId: event.pointerId,
      screen: screenToPlan(visibleScreen),
      visibleScreen: visibleScreen,
      offsetX: planView.offsetX,
      offsetY: planView.offsetY,
    };
    planCanvas.classList.add("panning");
    ensureMeasureCanvas();
    planCanvas.setPointerCapture(event.pointerId);
    return;
  }
  if (alignSession && handleAlignFloorClick(start)) {
    return;
  }
  if (activeTool === "scale") {
    if (!scaleToolStart) {
      scaleToolStart = start;
      drawPlan();
      return;
    }
    const end = event.shiftKey
      ? axisLockedPoint(start, scaleToolStart).point
      : start;
    if (distance(scaleToolStart, end) < 12 / planView.zoom) {
      showToast("参考线太短，请重新选择终点。", "error");
      return;
    }
    pendingCalibration = {
      start: scaleToolStart,
      end: end,
    };
    scaleToolStart = null;
    referencePixels.textContent =
      Math.round(distance(pendingCalibration.start, pendingCalibration.end)) +
      " px";
    referenceMeters.value = floorScene.calibration?.reference?.meters || 3;
    scaleDialog.showModal();
    requestAnimationFrame(() => referenceMeters.select());
    drawPlan();
    return;
  }
  if (activeTool === "wall") {
    if (!requireCalibration()) {
      return;
    }
    const planSnap = resolvePlanSnap(start, wallDrawAnchor, event.shiftKey);
    if (!wallDrawAnchor) {
      wallDrawAnchor = {
        ...planSnap.point,
      };
      measureOrWallLastPoint = {
        ...planSnap.point,
      };
      wallDrawPointCount = 0;
      finishWall.hidden = false;
      drawPlan();
      return;
    }
    if (distance(wallDrawAnchor, planSnap.point) < pixelsPerMeter() * 0.08) {
      showToast("墙段太短，请选择更远的终点。", "error");
      return;
    }
    const wall = {
      id: makeId("wall"),
      start: {
        ...wallDrawAnchor,
      },
      end: {
        ...planSnap.point,
      },
      height: floorScene.settings.wallHeight,
      thickness: floorScene.settings.wallThickness,
    };
    const maxValue = Math.max(0.75, pixelsPerMeter() * 0.01);
    const uncoveredCollinearWallSegments2 = uncoveredCollinearWallSegments(
      wall,
      floorScene.walls,
      maxValue,
    );
    if (!uncoveredCollinearWallSegments2.length) {
      wallDrawAnchor = {
        ...planSnap.point,
      };
      showToast("该位置已有墙体，已跳过重复墙段。");
      drawPlan();
      return;
    }
    const flag2 =
      uncoveredCollinearWallSegments2.length !== 1 ||
      distance(
        uncoveredCollinearWallSegments2[0].start,
        wall.start,
      ) > maxValue ||
      distance(uncoveredCollinearWallSegments2[0].end, wall.end) >
        maxValue;
    pushHistory();
    const maxValue2 = Math.max(1, pixelsPerMeter() * 0.01);
    const length = closedWallPolygons(floorScene.walls, maxValue2).length;
    const mapResult = uncoveredCollinearWallSegments2.map(
      (wall2, arg1) => ({
        ...wall,
        id: arg1 === 0 ? wall.id : makeId("wall"),
        start: wall2.start,
        end: wall2.end,
      }),
    );
    floorScene.walls.push(...mapResult);
    cachedWallOpenings();
    wallDrawPointCount += 1;
    const flag3 =
      closedWallPolygons(floorScene.walls, maxValue2).length > length;
    if (flag3) {
      resetWallDrawing();
    } else {
      wallDrawAnchor = {
        ...planSnap.point,
      };
    }
    setSelection("wall", mapResult[0].id);
    finishWall.hidden = flag3;
    refreshViews();
    scheduleSave();
    if (flag3) {
      showToast("空间已闭合，地面已生成。可继续绘制下一个空间。", "success");
    } else if (flag2) {
      showToast("已跳过与现有墙体重合的部分。", "success");
    }
    return;
  }
  if (activeTool === "window") {
    if (!requireCalibration()) {
      return;
    }
    const isWall = nearestWall(
      start,
      floorScene.walls,
      18 / planView.zoom,
    );
    if (!isWall) {
      showToast("请靠近一段墙体放置窗户。", "error");
      return;
    }
    pushHistory();
    const t = {
      id: makeId("window"),
      wallId: isWall.wall.id,
      t: isWall.t,
      width: 1.4,
      height: 1.35,
      sill: 0.85,
    };
    t.t = clampWindowT(
      isWall.wall,
      t,
      pixelsPerMeter(),
    );
    floorScene.windows.push(t);
    setSelection("window", t.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "door") {
    if (!requireCalibration()) {
      return;
    }
    const isWall = nearestWall(
      start,
      floorScene.walls,
      18 / planView.zoom,
    );
    if (!isWall) {
      showToast("请靠近一段墙体放置门。", "error");
      return;
    }
    pushHistory();
    const size =
      doorSizePresets[DEFAULT_DOOR_TYPE] || doorSizePresets.solid;
    const t = {
      id: makeId("door"),
      wallId: isWall.wall.id,
      t: isWall.t,
      width: size.width,
      height: size.height,
      sill: 0,
      doorType: DEFAULT_DOOR_TYPE,
      hinge: "left",
      swing: 1,
    };
    t.t = clampWindowT(
      isWall.wall,
      t,
      pixelsPerMeter(),
    );
    floorScene.doors.push(t);
    setSelection("door", t.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "railing") {
    if (!requireCalibration()) {
      return;
    }
    const isWall = nearestWall(
      start,
      floorScene.walls,
      18 / planView.zoom,
    );
    if (!isWall) {
      showToast("请靠近一段墙体放置栏杆。", "error");
      return;
    }
    pushHistory();
    const t = {
      id: makeId("railing"),
      wallId: isWall.wall.id,
      t: isWall.t,
      width: 2,
      height: 1.1,
      sill: 0,
    };
    t.t = clampWindowT(
      isWall.wall,
      t,
      pixelsPerMeter(),
    );
    floorScene.railings.push(t);
    setSelection("railing", t.id);
    refreshViews();
    scheduleSave();
    return;
  }
  if (activeTool === "label") {
    addFurnitureAtPoint("planlabel", start);
    return;
  }
  const isItem = beginItemDrag(start);
  if (isItem) {
    beginLeaveStudio();
    const originalItem = {
      ...isItem.item,
    };
    dragState =
      isItem.type === "resize-item"
        ? {
            type: "resize-item",
            pointerId: event.pointerId,
            originalItem: originalItem,
            handle: {
              x: isItem.corner.x,
              y: isItem.corner.y,
            },
            anchor: {
              ...isItem.corner.opposite,
            },
            before: cloneFloorScene(),
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
            before: cloneFloorScene(),
            moved: false,
          };
    planCanvas.setPointerCapture(event.pointerId);
    return;
  }
  const arg02 = activeSelectionLightGroupFilter();
  const isKind = placeCatalogItemAt(start);
  if (!isKind) {
    beginLeaveStudio();
    if (!event.shiftKey) {
      clearSelection();
    }
    dragState = {
      type: "marquee",
      pointerId: event.pointerId,
      start: start,
      current: start,
      additive: event.shiftKey,
      moved: false,
    };
    updateSelectionInspector();
    drawPlan();
    ensureMeasureCanvas();
    if (!event.shiftKey) {
      rebuildPreviewForAssetFilters(arg02);
    }
    planCanvas.setPointerCapture(event.pointerId);
    return;
  }
  beginLeaveStudio();
  const before = isKind.kind === "item" ? cloneFloorScene() : null;
  const flag =
    isKind.kind === "item" &&
    multiSelection.length > 0 &&
    isSelected("item", isKind.id);
  let list = [];
  let copied = false;
  if (isKind.kind === "item") {
    if (flag) {
      const idSet = new Set(
        multiSelection
          .filter((kind) => kind.kind === "item")
          .map((item) => item.id),
      );
      list = floorScene.items.filter((id) =>
        idSet.has(id.id),
      );
    } else {
      setSelection("item", isKind.id);
      const flag2 = floorScene.items.find(
        (item) => item.id === isKind.id,
      );
      if (flag2) {
        list = [flag2];
      }
    }
    if (event.altKey && list.length) {
      const list2 = list.map((arg0) => ({
        ...structuredClone(arg0),
        id: makeId("item"),
      }));
      ensureItemLayerNames(list2);
      floorScene.items.push(...list2);
      list = list2;
      if (list2.length === 1) {
        setSelection("item", list2[0].id);
      } else {
        selection = null;
        multiSelection = list2.map((id) => ({
          kind: "item",
          id: id.id,
        }));
      }
      copied = true;
    }
  } else {
    setSelection(isKind.kind, isKind.id);
  }
  updateSelectionInspector();
  drawPlan();
  rebuildPreviewForAssetFilters(arg02);
  const value = activeSelectionAssetCategory();
  const previewScope = arg02 === value ? value : "all";
  if (isKind.kind === "item") {
    dragState = {
      type: "move-items",
      pointerId: event.pointerId,
      start: start,
      originals: list.map((planPoint) => ({
        id: planPoint.id,
        x: planPoint.x,
        y: planPoint.y,
      })),
      before: before,
      copied: copied,
      previewScope: previewScope,
      moved: false,
    };
  } else if (["window", "door", "railing"].includes(isKind.kind)) {
    dragState = {
      type: "move-opening",
      pointerId: event.pointerId,
      start: start,
      before: cloneFloorScene(),
      previewScope: "all",
      moved: false,
    };
  }
  if (dragState) {
    planCanvas.setPointerCapture(event.pointerId);
  } else {
    scheduleLeaveStudio();
  }
}
function onPlanPointerDrag(event) {
  const planPoint = pointerEventToCanvasPoint(event);
  const planPoint2 = screenToPlanWithView(planPoint);
  if (dragState?.pointerId === event.pointerId) {
    if (dragState.type === "marquee") {
      dragState.current = planPoint2;
      dragState.moved = distance(dragState.start, planPoint2) * planView.zoom >= 4;
      if (blitMeasureOverlay()) {
        drawMarqueeSelection();
      } else {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "pan") {
      const planPoint3 = screenToPlan(planPoint);
      planView.offsetX = dragState.offsetX + planPoint3.x - dragState.screen.x;
      planView.offsetY = dragState.offsetY + planPoint3.y - dragState.screen.y;
      const offsetX = planPoint.x - dragState.visibleScreen.x;
      const offsetY = planPoint.y - dragState.visibleScreen.y;
      if (
        !blitMeasureOverlay({
          offsetX: offsetX,
          offsetY: offsetY,
        })
      ) {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "move-items") {
      if (
        !dragState.moved &&
        distance(planPoint2, dragState.start) * planView.zoom < 3
      ) {
        return;
      }
      const value = pixelsPerMeter() * 0.05;
      const flag =
        isSnapActive() && floorScene.settings.snapGrid !== false;
      let oppdV2 = planPoint2.x - dragState.start.x;
      let oppdV3 = planPoint2.y - dragState.start.y;
      if (event.shiftKey) {
        if (Math.abs(oppdV2) >= Math.abs(oppdV3)) {
          oppdV3 = 0;
        } else {
          oppdV2 = 0;
        }
      }
      const map = new Map(
        floorScene.items.map((id) => [id.id, id]),
      );
      for (const planPoint3 of dragState.originals) {
        const planPoint4 = map.get(planPoint3.id);
        if (planPoint4) {
          planPoint4.x = flag
            ? Math.round((planPoint3.x + oppdV2) / value) * value
            : planPoint3.x + oppdV2;
          planPoint4.y = flag
            ? Math.round((planPoint3.y + oppdV3) / value) * value
            : planPoint3.y + oppdV3;
        }
      }
      dragState.moved = dragState.originals.some((planPoint3) => {
        const planPoint4 = map.get(planPoint3.id);
        return (
          planPoint4 &&
          (Math.abs(planPoint4.x - planPoint3.x) > 0.000001 ||
            Math.abs(planPoint4.y - planPoint3.y) > 0.000001)
        );
      });
      drawPlan();
      return;
    }
    if (dragState.type === "resize-item") {
      if (
        !dragState.moved &&
        distance(planPoint2, dragState.handle) * planView.zoom < 3
      ) {
        return;
      }
      const planPoint3 = selectedEntity();
      if (!planPoint3) {
        return;
      }
      const value = Math.max(
        finite(dragState.originalItem.height, 0.05),
        0.001,
      );
      const maxValue = event.shiftKey
        ? {
            minimum: Math.max(
              0.1 / Math.max(dragState.originalItem.width, 0.1),
              0.1 / Math.max(dragState.originalItem.depth, 0.1),
              itemMinimumHeight(dragState.originalItem.type) / value,
            ),
            maximum: Math.min(
              8 / Math.max(dragState.originalItem.width, 0.1),
              8 / Math.max(dragState.originalItem.depth, 0.1),
              6 / value,
            ),
          }
        : undefined;
      const resizeRotatedItemFromCorner2 = resizeRotatedItemFromCorner(
        dragState.originalItem,
        dragState.handle,
        dragState.anchor,
        planPoint2,
        pixelsPerMeter() || 1,
        event.shiftKey,
        maxValue,
      );
      Object.assign(planPoint3, resizeRotatedItemFromCorner2);
      dragState.moved =
        Math.abs(planPoint3.x - dragState.originalItem.x) > 0.000001 ||
        Math.abs(planPoint3.y - dragState.originalItem.y) > 0.000001 ||
        Math.abs(planPoint3.width - dragState.originalItem.width) > 0.000001 ||
        Math.abs(planPoint3.depth - dragState.originalItem.depth) > 0.000001 ||
        Math.abs(planPoint3.height - dragState.originalItem.height) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "rotate-item") {
      if (
        !dragState.moved &&
        distance(planPoint2, dragState.startPointer) * planView.zoom < 3
      ) {
        return;
      }
      const item = selectedEntity();
      if (!item) {
        return;
      }
      item.rotation = itemRotationFromPointers(
        dragState.originalItem.rotation,
        dragState.center,
        dragState.startPointer,
        planPoint2,
        event.shiftKey ? 15 : 0,
      );
      dragState.moved =
        Math.abs(item.rotation - dragState.originalItem.rotation) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "move-opening") {
      if (
        !dragState.moved &&
        distance(planPoint2, dragState.start) * planView.zoom < 3
      ) {
        return;
      }
      const attachment = selectedEntity();
      const wall = floorScene.walls.find(
        (item) => item.id === attachment?.wallId,
      );
      if (!attachment || !wall) {
        return;
      }
      attachment.t = clampWindowT(
        wall,
        {
          ...attachment,
          t: projectPointToSegment(
            planPoint2,
            wall.start,
            wall.end,
          ).t,
        },
        pixelsPerMeter(),
      );
      const previousAttachment = dragState.before?.[selection?.kind + "s"]?.find?.(
        (item) => item.id === attachment.id,
      );
      dragState.moved =
        !previousAttachment || Math.abs(attachment.t - previousAttachment.t) > 0.000001;
      drawPlan();
      return;
    }
  }
  onPlanPointerMove(event);
  if (
    alignSession ||
    ["scale", "wall", "window", "door", "railing"].includes(activeTool)
  ) {
    drawPlan();
  }
}
function flushPlanPanFrame() {
  planZoomRaf = 0;
  const event = planPanState;
  planPanState = null;
  if (event) {
    onPlanPointerDrag(event);
  }
}
function beginPlanPan(event) {
  planPanState = {
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
    shiftKey: event.shiftKey,
  };
  planZoomRaf ||= requestAnimationFrame(flushPlanPanFrame);
}
function endPlanPan(arg0) {
  if (!!planPanState && planPanState.pointerId === arg0) {
    if (planZoomRaf) {
      cancelAnimationFrame(planZoomRaf);
    }
    flushPlanPanFrame();
  }
}
function flushPlanZoomFrame() {
  orbitAnimRaf = 0;
  const arg0 = planZoomFactor;
  const flag = planZoomAnchor;
  planZoomFactor = 1;
  planZoomAnchor = null;
  if (flag && Math.abs(arg0 - 1) > 1e-8) {
    zoomPlanViewAt(arg0, flag);
  }
}
function onPlanWheelZoom(event) {
  planZoomFactor *= Math.exp(-event.deltaY * 0.0012);
  planZoomAnchor = pointerEventToCanvasPoint(event);
  beginLeaveStudio();
  orbitAnimRaf ||= requestAnimationFrame(flushPlanZoomFrame);
  window.clearTimeout(orbitAnimSettleTimer);
  orbitAnimSettleTimer = window.setTimeout(() => {
    orbitAnimSettleTimer = null;
    if (orbitAnimRaf) {
      cancelAnimationFrame(orbitAnimRaf);
      flushPlanZoomFrame();
    }
    scheduleLeaveStudio();
  }, 90);
}
function onPlanPointerUp(pointer) {
  if (!dragState || dragState.pointerId !== pointer.pointerId) {
    return;
  }
  if (dragState.type === "marquee") {
    const arg0 = activeSelectionLightGroupFilter();
    const additiveSelection = dragState.additive
      ? [...(selection ? [selection] : []), ...multiSelection]
      : [];
    const marqueeHits = dragState.moved
      ? marqueeSelectHits(dragState.start, dragState.current)
      : [];
    const list = [
      ...new Map(
        [...additiveSelection, ...marqueeHits].map((kind) => [
          kind.kind + ":" + kind.id,
          kind,
        ]),
      ).values(),
    ];
    if (list.length === 1) {
      setSelection(list[0].kind, list[0].id);
    } else {
      selection = null;
      multiSelection = list;
    }
    try {
      planCanvas.releasePointerCapture(pointer.pointerId);
    } catch {}
    dragState = null;
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(arg0);
    scheduleLeaveStudio();
    return;
  }
  const item = dragState;
  const flag = item.moved || item.copied;
  if (flag) {
    pushUndoSnapshot(dragState.before);
    scheduleSave();
  }
  if (
    ["move-items", "resize-item", "rotate-item", "move-opening"].includes(
      item.type,
    )
  ) {
    updateSelectionInspector();
  }
  if (flag && item.type === "move-opening") {
    rebuildPreviewMeshes({
      scope: "all",
    });
  } else if (
    flag &&
    ["move-items", "resize-item", "rotate-item"].includes(item.type)
  ) {
    const item2 = selectedEntity();
    rebuildPreviewMeshes({
      scope:
        item.previewScope ||
        (item2 ? itemPreviewScope(item2) : activeSelectionAssetCategory()),
    });
  }
  if (dragState.type === "pan") {
    planCanvas.classList.remove("panning");
  }
  try {
    planCanvas.releasePointerCapture(pointer.pointerId);
  } catch {}
  dragState = null;
  if (item.type === "pan") {
    drawPlan();
  }
  scheduleLeaveStudio();
}
function onPlanPointerCancel(pointer) {
  endPlanPan(pointer.pointerId);
  onPlanPointerUp(pointer);
}
function applyInspectorFields(arg0) {
  const item = selectedEntity();
  if (!item || selection?.kind !== arg0) {
    return;
  }
  const scope = arg0 === "item" ? itemPreviewScope(item) : "all";
  pushHistory();
  if (arg0 === "wall") {
    item.height = clamp(
      finite(selectEl("#wall-height").value, item.height),
      0.01,
      6,
    );
    item.thickness = clamp(
      finite(selectEl("#wall-thickness").value, item.thickness),
      0.01,
      3,
    );
    item.opacity =
      selectEl("#wall-opacity-mode").value === "custom"
        ? clamp(
            finite(
              selectEl("#wall-opacity").value,
              floorScene.settings.wallOpacity * 100,
            ),
            0,
            100,
          ) / 100
        : null;
    item.allowOpenEnd = selectEl("#wall-open-end-mode").value === "allowed";
    floorScene.settings.wallHeight = item.height;
    floorScene.settings.wallThickness = item.thickness;
  } else if (arg0 === "window") {
    item.width = clamp(
      finite(selectEl("#window-width").value, item.width),
      0.3,
      20,
    );
    item.height = clamp(
      finite(selectEl("#window-height").value, item.height),
      0.3,
      20,
    );
    item.sill = clamp(
      finite(selectEl("#window-sill").value, item.sill),
      0,
      20,
    );
    item.hasDivider = selectEl("#window-divider").value !== "without";
    const flag = floorScene.walls.find(
      (item) => item.id === item.wallId,
    );
    if (flag) {
      item.t = clampWindowT(flag, item, pixelsPerMeter());
    }
  } else if (arg0 === "door") {
    item.doorType = Object.hasOwn(
      doorSizePresets,
      selectEl("#door-type").value,
    )
      ? selectEl("#door-type").value
      : "solid";
    item.width = clamp(
      finite(selectEl("#door-width").value, item.width),
      0.55,
      20,
    );
    item.height = clamp(
      finite(selectEl("#door-height").value, item.height),
      1.8,
      20,
    );
    const flag = floorScene.walls.find(
      (item) => item.id === item.wallId,
    );
    if (flag) {
      item.t = clampWindowT(flag, item, pixelsPerMeter());
    }
  } else if (arg0 === "railing") {
    item.width = clamp(
      finite(selectEl("#railing-width").value, item.width),
      0.3,
      20,
    );
    item.height = clamp(
      finite(selectEl("#railing-height").value, item.height),
      0.5,
      3,
    );
    const flag = floorScene.walls.find(
      (item) => item.id === item.wallId,
    );
    if (flag) {
      item.t = clampWindowT(flag, item, pixelsPerMeter());
    }
  } else {
    const value = pixelsPerMeter() || 1;
    item.x =
      finite(selectEl("#item-x").value, item.x / value) * value;
    item.y =
      finite(selectEl("#item-y").value, item.y / value) * value;
    item.width = clamp(
      finite(selectEl("#item-width").value, item.width),
      0.1,
      8,
    );
    item.height = clamp(
      finite(selectEl("#item-height").value, item.height),
      itemMinimumHeight(item.type),
      6,
    );
    item.depth = clamp(
      finite(selectEl("#item-depth").value, item.depth),
      0.1,
      8,
    );
    item.elevation = clamp(
      finite(selectEl("#item-elevation").value, item.elevation || 0),
      0,
      6,
    );
    item.rotation =
      item.type === "striplight"
        ? normalizeFullRotation(
            selectEl("#item-rotation").value,
            item.rotation,
          )
        : finite(selectEl("#item-rotation").value, item.rotation);
    if (item.type === "planlabel") {
      item.title = normalizeLabelText(
        selectEl("#label-title").value,
        "家庭总览",
        24,
      );
      item.subtitle = normalizeLabelText(
        selectEl("#label-subtitle").value,
        "HOME PLAN",
        36,
      );
      item.titleSpacing = clamp(
        finite(selectEl("#label-title-spacing").value, 105) / 100,
        0,
        1.8,
      );
      item.subtitleSpacing = clamp(
        finite(selectEl("#label-subtitle-spacing").value, 8) / 100,
        0,
        0.6,
      );
      item.lineLength = clamp(
        finite(selectEl("#label-line-length").value, 86) / 100,
        0.3,
        1,
      );
      item.height = 0.01;
      item.elevation = 0;
    }
    if (item.type === "curtain") {
      item.curtainPosition = ["left", "right", "split"].includes(
        selectEl("#curtain-position").value,
      )
        ? selectEl("#curtain-position").value
        : "split";
    }
    if (roundTableTypes.has(item.type)) {
      item.roundTableTurntable =
        selectEl("#round-table-turntable").value === "with";
    }
    if (stairItemTypes.has(item.type)) {
      item.stairDirection = ["left", "right"].includes(
        selectEl("#stair-direction").value,
      )
        ? selectEl("#stair-direction").value
        : "right";
    }
    if (item.type === "tv") {
      const hasResult = tvMountStyles.has(item.tvMountStyle)
        ? item.tvMountStyle
        : "standard";
      const hasResult2 = tvMountStyles.has(selectEl("#tv-mount-style").value)
        ? selectEl("#tv-mount-style").value
        : "standard";
      if (hasResult !== hasResult2 && hasResult2 === "mobile") {
        item.height = Math.max(item.height, fridgeSize.height);
        item.depth = Math.max(item.depth, fridgeSize.depth);
        item.elevation = 0;
      } else if (
        hasResult === "mobile" &&
        hasResult2 !== "mobile" &&
        Math.abs(item.height - fridgeSize.height) < 0.001 &&
        Math.abs(item.depth - fridgeSize.depth) < 0.001
      ) {
        item.height = furnitureCatalog.tv.height;
        item.depth = furnitureCatalog.tv.depth;
      }
      item.tvMountStyle = hasResult2;
    }
    if (lightItemTypes.has(item.type)) {
      const temperature =
        defaultLightPresets[item.type] || defaultLightPresets.downlight;
      item.verticalRotation =
        item.type === "striplight"
          ? normalizeFullRotation(
              selectEl("#item-vertical-rotation").value,
              item.verticalRotation || 0,
            )
          : clamp(
              finite(
                selectEl("#item-vertical-rotation").value,
                item.verticalRotation || 0,
              ),
              -90,
              90,
            );
      if (item.type === "striplight") {
        item.stripRollRotation = normalizeFullRotation(
          itemStripRoll.value,
          item.stripRollRotation || 0,
        );
        item.lightSourceVisible = itemLightSourceVisible.checked;
      }
      item.lightGroupId = floorScene.lightGroups.some(
        (item) => item.id === selectEl("#light-group").value,
      )
        ? selectEl("#light-group").value
        : ensureDefaultLightGroup().id;
      item.lightTemperature = clamp(
        finite(
          selectEl("#light-temperature").value,
          temperature.temperature,
        ),
        2200,
        6500,
      );
      item.lightBrightness = clamp(
        finite(
          selectEl("#light-brightness").value,
          temperature.brightness,
        ),
        0,
        100,
      );
      item.lightRange = clamp(
        finite(selectEl("#light-range").value, temperature.range),
        0.5,
        10,
      );
      item.lightAngle = clamp(
        finite(selectEl("#light-angle").value, temperature.angle),
        15,
        defaultItemDepth(item.type),
      );
      item.height = furnitureCatalog[item.type].height;
    }
  }
  refreshViews(scope);
  scheduleSave();
}
function resetWallDrawing() {
  wallDrawAnchor = null;
  measureOrWallLastPoint = null;
  wallDrawPointCount = 0;
  finishWall.hidden = true;
}
function cancelWallDrawing() {
  resetWallDrawing();
  drawPlan();
}
async function bootstrapStudioApp() {
  if (!isStudioRoute) {
    setSaveStateLabel("地址无效", "error");
    return;
  }
  try {
    initPreviewRenderer();
    resizePlanCanvas();
    const value = new URLSearchParams(window.location.search);
    const floor = await studioFetch(
      isStageEmbed
        ? "/modules/interaction3d/scenes/" +
            encodeURIComponent(value.get("sceneId") || "") +
            "/current?projectId=" +
            encodeURIComponent(value.get("projectId") || "")
        : "/studio3d",
    );
    projectName.textContent = "户型图绘制";
    document.title = "户型图绘制";
    await loadProjectDocument(floor);
    if (isStageEmbed) {
      await new Promise(requestAnimationFrame);
      const { mountStage: mountStage } = await import(
        "/api/v1/modules/interaction3d/stage.js?v=20260907-focus-work-v1"
      );
      mountStage(buildStageReferenceScene());
      return;
    }
    setSaveStateLabel("已自动保存", "saved");
    if (autoDiagramComponentId) {
      if (isAutoDiagramEmbed) {
        scheduleOrbitResumeAfterModels();
      } else {
        window.setTimeout(() => scheduleOrbitResumeAfterModels(), 180);
      }
    }
  } catch (error) {
    if (isStageEmbed) {
      window.parent.postMessage(
        {
          channel: "hb-i3d-v1",
          type: "error",
          message: error.message || "无法载入3D户型。",
        },
        window.location.origin,
      );
    }
    setSaveStateLabel("载入失败", "error");
    showToast(error.message || "无法载入项目。", "error");
  }
}
toolEls.forEach((el) =>
  el.addEventListener("click", () =>
    setActiveTool(el.dataset.tool),
  ),
);
addFloor.addEventListener("click", () => {
  addNewFloor();
});
alignFloor.addEventListener("click", beginAlignFloorSession);
previewFloorGapInput.addEventListener("change", commitPreviewFloorGap);
exportFloorGap2.addEventListener("change", commitExportFloorGap);
for (const e of previewFloorEls) {
  e.addEventListener("click", () => setPreviewFloorMode(e.dataset.previewFloor));
}
importPlan.addEventListener("click", () => planFile.click());
planFile.addEventListener("change", async () => {
  await importPlanBackgroundFile(planFile.files?.[0]);
  planFile.value = "";
});
toggleBackground.addEventListener("click", () => {
  if (floorScene.background) {
    pushHistory();
    floorScene.settings.backgroundVisible =
      !floorScene.settings.backgroundVisible;
    refreshStudioPanels();
    drawPlan();
    scheduleSave();
  }
});
removePlan.addEventListener("click", () => {
  if (floorScene.background) {
    pushHistory();
    floorScene.background = null;
    planBackgroundImage = null;
    refreshViews();
    fitPlanViewToContent();
    scheduleSave();
    showToast("底图引用已移除，现在可以在编辑器中删除这张图片。", "success");
  }
});
function setHoveredInspectorTarget(arg0) {
  if (hoveredInspectorTarget && hoveredInspectorTarget !== arg0) {
    clearInspectorHover();
  }
  if (!hoveredInspectorTarget) {
    pushHistory();
    hoveredInspectorTarget = arg0;
    beginLeaveStudio();
  }
}
function schedulePlanRedraw() {
  planRedrawRaf ||= requestAnimationFrame(() => {
    planRedrawRaf = 0;
    drawPlan();
  });
}
function clearInspectorHover() {
  window.clearTimeout(inspectorHoverTimer);
  inspectorHoverTimer = null;
  if (hoveredInspectorTarget) {
    hoveredInspectorTarget = null;
    syncControlValue(
      globalWallHeight,
      floorScene.settings.wallHeight.toFixed(2),
    );
    syncControlValue(
      globalWallThickness,
      floorScene.settings.wallThickness.toFixed(2),
    );
    syncControlValue(
      globalWallOpacity,
      Math.round(floorScene.settings.wallOpacity * 100),
    );
    updateSelectionInspector();
    rebuildPreviewMeshes({
      scope: "all",
    });
    scheduleLeaveStudio();
  }
}
function scheduleClearInspectorHover(arg0 = 80) {
  window.clearTimeout(inspectorHoverTimer);
  inspectorHoverTimer = window.setTimeout(clearInspectorHover, arg0);
}
function commitGlobalWallHeight() {
  const clamp2 = clamp(
    finite(globalWallHeight.value, floorScene.settings.wallHeight),
    0.01,
    6,
  );
  if (
    !(Math.abs(clamp2 - floorScene.settings.wallHeight) < 1e-8) ||
    !floorScene.walls.every(
      (size) => Math.abs(size.height - clamp2) < 1e-8,
    )
  ) {
    setHoveredInspectorTarget(globalWallHeight);
    floorScene.settings.wallHeight = clamp2;
    for (const size of floorScene.walls) {
      size.height = clamp2;
    }
    scheduleSave();
  }
}
function commitGlobalWallThickness() {
  const clamp2 = clamp(
    finite(globalWallThickness.value, floorScene.settings.wallThickness),
    0.01,
    3,
  );
  if (
    !(Math.abs(clamp2 - floorScene.settings.wallThickness) < 1e-8) ||
    !floorScene.walls.every(
      (thickness) =>
        Math.abs(thickness.thickness - clamp2) < 1e-8,
    )
  ) {
    setHoveredInspectorTarget(globalWallThickness);
    floorScene.settings.wallThickness = clamp2;
    for (const thickness of floorScene.walls) {
      thickness.thickness = clamp2;
    }
    schedulePlanRedraw();
    scheduleSave();
  }
}
function commitGlobalWallOpacity() {
  const value =
    clamp(
      finite(globalWallOpacity.value, floorScene.settings.wallOpacity * 100),
      0,
      100,
    ) / 100;
  if (!(Math.abs(value - floorScene.settings.wallOpacity) < 1e-8)) {
    setHoveredInspectorTarget(globalWallOpacity);
    floorScene.settings.wallOpacity = value;
    scheduleSave();
  }
}
for (const [e, n] of [
  [globalWallHeight, commitGlobalWallHeight],
  [globalWallThickness, commitGlobalWallThickness],
  [globalWallOpacity, commitGlobalWallOpacity],
]) {
  e.addEventListener("input", n);
  e.addEventListener("change", () => {
    n();
    scheduleClearInspectorHover();
  });
  e.addEventListener("blur", () => scheduleClearInspectorHover(0));
}
toggleFloorEdge.addEventListener("click", () => {
  pushHistory();
  floorScene.settings.floorEdgeVisible =
    floorScene.settings.floorEdgeVisible === false;
  refreshViews();
  scheduleSave();
});
function syncAssetCategoryHeadings() {
  for (const el of assetHeadingCategoryEls) {
    el.hidden =
      el.dataset.assetHeadingCategory !== assetCategory;
  }
  for (const el of itemTypeButtons) {
    const itemType = el.dataset.itemType;
    const flag = lightItemTypes.has(itemType);
    const flag2 = applianceColorTypes.has(itemType);
    const flag3 =
      assetCategory === "light"
        ? flag
        : assetCategory === "appliance"
          ? flag2
          : !flag2 && !flag;
    el.hidden = !flag3;
  }
}
function setAssetCategory(arg0) {
  const value = ["home", "appliance", "light"].includes(arg0)
    ? arg0
    : "home";
  const activeSelectionLightGroupFilterResult = activeSelectionLightGroupFilter();
  hideLightGroupContextMenu();
  assetCategory = value;
  for (const element of assetCategoryEls) {
    const sacV3 = element.dataset.assetCategory === value;
    element.classList.toggle("active", sacV3);
    element.setAttribute("aria-pressed", String(sacV3));
  }
  syncAssetCategoryHeadings();
  assetGrid.hidden = value === "light";
  lightAssetRow.hidden = value !== "light";
  const selectedItem = selectedEntity();
  const flag =
    selection?.kind === "item" &&
    selectedItem &&
    lightItemTypes.has(selectedItem.type);
  if (selection && (value === "light") != !!flag) {
    clearSelection();
  }
  if (multiSelection.length) {
    clearSelection();
  }
  setActiveTool("select");
  renderLightLayerPanel();
  updateSelectionInspector();
  drawPlan();
  if (activeSelectionLightGroupFilterResult !== activeSelectionLightGroupFilter()) {
    rebuildPreviewForAssetFilters(activeSelectionLightGroupFilterResult);
  }
}
for (const e of assetCategoryEls) {
  e.addEventListener("click", () => setAssetCategory(e.dataset.assetCategory));
}
setAssetCategory("home");
addLightGroup.addEventListener("click", () => {
  pushHistory();
  const value = new Set(
    floorScene.lightGroups.map((named) => named.name),
  );
  let sacV2 = floorScene.lightGroups.length + 1;
  while (value.has("灯组 " + sacV2)) {
    sacV2 += 1;
  }
  const id = {
    id: makeId("light-group"),
    name: "灯组 " + sacV2,
    enabled: true,
  };
  floorScene.lightGroups.push(id);
  activeLightGroupId = id.id;
  renderLightLayerPanel();
  updateSelectionInspector();
  scheduleSave();
});
lightGroupsOff.addEventListener("click", () => setAllLightGroupsEnabled(false));
for (const e of lightGroupContextMenu.querySelectorAll(
  "[data-light-group-action]",
)) {
  e.addEventListener("click", () => {
    const lightGroup = floorScene.lightGroups.find(
      (item) => item.id === lightGroupContextMenuId,
    );
    const lightGroupAction = e.dataset.lightGroupAction;
    hideLightGroupContextMenu();
    if (lightGroup) {
      if (lightGroupAction === "rename") {
        renamingLightGroupId = lightGroup.id;
        lightGroupRenameInput.value = lightGroup.name;
        lightGroupRenameDialog.showModal();
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
    const id = projectDoc.floors.find(
      (item) => item.id === contextFloorId,
    );
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
document.addEventListener("pointerdown", (event) => {
  if (
    !lightGroupContextMenu.hidden &&
    !lightGroupContextMenu.contains(event.target)
  ) {
    hideLightGroupContextMenu();
  }
  if (
    !floorContextMenu.hidden &&
    !floorContextMenu.contains(event.target)
  ) {
    hideFloorContextMenu();
  }
  if (
    !snapSettingsPanel.hidden &&
    !event.target.closest(".snap-control")
  ) {
    setSnapSettingsOpen(false);
  }
});
function closeFloorRenameDialog() {
  contextFloorId = "";
  floorRenameDialog.close();
}
selectEl("#floor-rename-close").addEventListener("click", closeFloorRenameDialog);
selectEl("#floor-rename-cancel").addEventListener("click", closeFloorRenameDialog);
floorRenameDialog.addEventListener("cancel", () => {
  contextFloorId = "";
});
floorRenameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const floor = projectDoc.floors.find(
    (item) => item.id === contextFloorId,
  );
  if (!floor) {
    closeFloorRenameDialog();
    return;
  }
  const value = uniqueFloorName(
    normalizeLabelText(floorRenameInput.value, floor.name, 24),
    floor.id,
  );
  if (value !== floor.name) {
    floor.name = value;
    renderFloorList();
    renderExportFileChecklist();
    scheduleSave();
    showToast("已重命名为“" + value + "”。", "success");
  }
  closeFloorRenameDialog();
});
selectEl("#floor-delete-close").addEventListener(
  "click",
  closeFloorDeleteDialog,
);
selectEl("#floor-delete-cancel").addEventListener(
  "click",
  closeFloorDeleteDialog,
);
floorDeleteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFloorDeleteDialog();
});
floorDeleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  executePendingFloorDelete();
});
function closeLightGroupRenameDialog() {
  renamingLightGroupId = "";
  lightGroupRenameDialog.close();
}
selectEl("#light-group-rename-close").addEventListener("click", closeLightGroupRenameDialog);
selectEl("#light-group-rename-cancel").addEventListener("click", closeLightGroupRenameDialog);
lightGroupRenameDialog.addEventListener("cancel", () => {
  renamingLightGroupId = "";
});
lightGroupRenameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lightGroup = floorScene.lightGroups.find(
    (item) => item.id === renamingLightGroupId,
  );
  if (!lightGroup) {
    closeLightGroupRenameDialog();
    return;
  }
  const normalizeLabelText2 = normalizeLabelText(
    lightGroupRenameInput.value,
    lightGroup.name,
    24,
  );
  if (normalizeLabelText2 !== lightGroup.name) {
    pushHistory();
    lightGroup.name = normalizeLabelText2;
    refreshViews("none");
    scheduleSave();
  }
  closeLightGroupRenameDialog();
});
function closeLightPropertyApplyDialog() {
  pendingLightPropertyEdit = null;
  lightPropertyApplyDialog.close();
}
function lightPropertyTargetItemInputs(querySelectorAll = lightPropertyTargetList) {
  return [
    ...querySelectorAll.querySelectorAll("[data-light-target-item-id]"),
  ];
}
function syncLightPropertySelectAll() {
  const list = lightPropertyTargetItemInputs();
  const length = list.filter(
    (checked) => checked.checked,
  ).length;
  lightPropertySelectionCount.textContent =
    length + "/" + list.length + " 灯";
  lightPropertyToggleAll.disabled = !list.length;
  lightPropertyToggleAll.textContent =
    list.length && length === list.length ? "取消全选" : "全选";
  for (const el of lightPropertyTargetList.querySelectorAll(
    "[data-light-target-group-id]",
  )) {
    const list2 = lightPropertyTargetItemInputs(el);
    const length2 = list2.filter(
      (checked) => checked.checked,
    ).length;
    el.querySelector("[data-light-target-group-count]").textContent =
      length2 + "/" + list2.length + " 灯";
    el.querySelector("[data-light-target-group-toggle]").textContent =
      list2.length && length2 === list2.length ? "取消全选" : "全选";
  }
}
function renderLightPropertyTargetList(prop) {
  lightPropertyTargetList.replaceChildren();
  let length = 0;
  for (const id of floorScene.lightGroups) {
    const list = floorScene.items.filter(
      (item) =>
        lightItemTypes.has(item.type) &&
        item.lightGroupId === id.id,
    );
    if (!list.length) {
      continue;
    }
    length += list.length;
    const el = document.createElement("section");
    el.className = "light-property-target-group";
    el.dataset.lightTargetGroupId = id.id;
    const append = document.createElement("header");
    const el2 = document.createElement("strong");
    el2.textContent = id.name;
    const el3 = document.createElement("span");
    el3.dataset.lightTargetGroupCount = "";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lightTargetGroupToggle = "";
    button.textContent = "取消全选";
    append.append(el2, el3, button);
    const el4 = document.createElement("div");
    el4.className = "light-property-target-grid";
    const map = new Map();
    for (const item of list) {
      map.set(
        item.type,
        (map.get(item.type) || 0) + 1,
      );
    }
    const map2 = new Map();
    for (const item of list) {
      const named =
        furnitureCatalog[item.type] || furnitureCatalog.downlight;
      const value = (map2.get(item.type) || 0) + 1;
      map2.set(item.type, value);
      const el5 = document.createElement("label");
      el5.className = "light-property-target-item";
      const button2 = document.createElement("input");
      button2.type = "checkbox";
      button2.checked = true;
      button2.dataset.lightTargetItemId = item.id;
      const append2 = document.createElement("span");
      const el6 = document.createElement("strong");
      el6.textContent =
        map.get(item.type) > 1
          ? named.name + " " + value
          : named.name;
      const el7 = document.createElement("small");
      const lightPropertyValue = clampLightPropertyValue(
        prop,
        item[prop],
        item.type,
      );
      el7.textContent =
        (item.id === selection?.id ? "当前灯 · " : "") +
        "当前 " +
        formatLightPropertyValue(prop, lightPropertyValue);
      append2.append(el6, el7);
      el5.append(button2, append2);
      el4.append(el5);
    }
    el.append(append, el4);
    lightPropertyTargetList.append(el);
  }
  if (!length) {
    const el = document.createElement("p");
    el.className = "light-property-target-empty";
    el.textContent = "当前没有可应用的灯具。";
    lightPropertyTargetList.append(el);
  }
  syncLightPropertySelectAll();
}
for (const e of applyLightPropertyEls) {
  e.addEventListener("click", () => {
    const item = selectedEntity();
    const property = e.dataset.applyLightProperty;
    const propMeta = lightPropertyMeta[property];
    if (
      !item ||
      selection?.kind !== "item" ||
      !lightItemTypes.has(item.type) ||
      !propMeta
    ) {
      return;
    }
    const value = clampLightPropertyValue(
      property,
      selectEl(propMeta.input).value,
      item.type,
    );
    pendingLightPropertyEdit = {
      property: property,
      label: propMeta.label,
      value: value,
    };
    lightPropertyApplyTitle.textContent = "应用" + propMeta.label;
    lightPropertyApplyValue.textContent = formatLightPropertyValue(
      property,
      value,
    );
    renderLightPropertyTargetList(property);
    lightPropertyApplyDialog.showModal();
    requestAnimationFrame(() => lightPropertyToggleAll.focus());
  });
}
lightPropertyToggleAll.addEventListener("click", () => {
  const list = lightPropertyTargetItemInputs();
  const value =
    !list.length ||
    !list.every((checked) => checked.checked);
  for (const checked of list) {
    checked.checked = value;
  }
  syncLightPropertySelectAll();
});
lightPropertyTargetList.addEventListener("click", (camera2) => {
  const isClosest = camera2.target.closest(
    "[data-light-target-group-toggle]",
  );
  if (!isClosest) {
    return;
  }
  const querySelectorAll = isClosest.closest("[data-light-target-group-id]");
  const value = lightPropertyTargetItemInputs(querySelectorAll);
  const local2 = !value.every(
    (checked) => checked.checked,
  );
  for (const checked of value) {
    checked.checked = local2;
  }
  syncLightPropertySelectAll();
});
lightPropertyTargetList.addEventListener("change", syncLightPropertySelectAll);
selectEl("#light-property-apply-close").addEventListener("click", closeLightPropertyApplyDialog);
selectEl("#light-property-apply-cancel").addEventListener("click", closeLightPropertyApplyDialog);
lightPropertyApplyDialog.addEventListener("cancel", () => {
  pendingLightPropertyEdit = null;
});
lightPropertyApplyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pendingLightPropertyEdit) {
    closeLightPropertyApplyDialog();
    return;
  }
  const {
    property: property,
    label: label,
    value: value,
  } = pendingLightPropertyEdit;
  const uniqueSet = new Set(
    lightPropertyTargetItemInputs()
      .filter((checked) => checked.checked)
      .map((el) => el.dataset.lightTargetItemId),
  );
  const list = floorScene.items.filter(
    (item) =>
      lightItemTypes.has(item.type) && uniqueSet.has(item.id),
  );
  if (!list.length) {
    showToast("请至少选择一盏灯。", "error");
    return;
  }
  const list2 = list
    .map((item) => ({
      item: item,
      value: clampLightPropertyValue(
        property,
        value,
        item.type,
      ),
    }))
    .filter(
      (item) =>
        Math.abs(
          finite(item.item[property]) - item.value,
        ) > 0.000001,
    );
  if (list2.length) {
    pushHistory();
    for (const item of list2) {
      item.item[property] = item.value;
    }
    refreshViews("lights");
    scheduleSave();
  }
  closeLightPropertyApplyDialog();
  showToast(
    "已将" + label + "应用到 " + list.length + " 盏灯。",
    "success",
  );
});
for (const e of itemTypeButtons) {
  e.addEventListener("dragstart", (dataTransfer) => {
    dataTransfer.dataTransfer.effectAllowed = "copy";
    dataTransfer.dataTransfer.setData(
      "application/x-ha-bridge-3d-item",
      e.dataset.itemType,
    );
  });
  e.addEventListener("click", () => {
    const planPoint = screenToPlanWithView({
      x: planWidth / 2,
      y: planHeight / 2,
    });
    addFurnitureAtPoint(e.dataset.itemType, planPoint);
  });
}
planStage.addEventListener("dragenter", (dataTransfer) => {
  if (
    [...dataTransfer.dataTransfer.types].includes(
      "application/x-ha-bridge-3d-item",
    )
  ) {
    planStage.classList.add("dragging-item");
  }
});
planStage.addEventListener("dragover", (event) => {
  if (
    [...event.dataTransfer.types].includes(
      "application/x-ha-bridge-3d-item",
    )
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    planStage.classList.add("dragging-item");
  }
});
planStage.addEventListener("dragleave", (relatedTarget) => {
  if (!planStage.contains(relatedTarget.relatedTarget)) {
    planStage.classList.remove("dragging-item");
  }
});
planStage.addEventListener("drop", (event) => {
  event.preventDefault();
  planStage.classList.remove("dragging-item");
  const type = event.dataTransfer.getData(
    "application/x-ha-bridge-3d-item",
  );
  if (type) {
    addFurnitureAtPoint(
      type,
      screenToPlanWithView(pointerEventToCanvasPoint(event)),
    );
  }
});
planCanvas.addEventListener("pointerdown", onPlanPointerDown);
planCanvas.addEventListener("pointermove", beginPlanPan);
planCanvas.addEventListener("pointerup", onPlanPointerCancel);
planCanvas.addEventListener("pointercancel", onPlanPointerCancel);
planCanvas.addEventListener("contextmenu", (event) =>
  event.preventDefault(),
);
planCanvas.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    onPlanWheelZoom(event);
  },
  {
    passive: false,
  },
);
selectEl("#fit-view").addEventListener("click", fitPlanViewToContent);
selectEl("#rotate-plan-view").addEventListener("click", rotatePlanView90);
selectEl("#zoom-in").addEventListener("click", () => zoomPlanViewAt(1.18));
selectEl("#zoom-out").addEventListener("click", () => zoomPlanViewAt(1 / 1.18));
selectEl("#reset-camera").addEventListener("click", applyCameraView);
saveCameraView.addEventListener("click", saveCurrentCameraView);
fixedCameraView.addEventListener("click", restoreFixedCameraView);
saveOverviewView.addEventListener("click", saveCurrentCameraView);
fixedOverviewView.addEventListener("click", restoreFixedCameraView);
exportSaveView.addEventListener("click", saveCurrentCameraView);
selectEl("#open-export").addEventListener(
  "click",
  scheduleOrbitResumeAfterModels,
);
selectEl("#export-close").addEventListener("click", () => {
  if (!orbitSuspended) {
    exportDialog.close();
  }
});
exportDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  if (!orbitSuspended) {
    exportDialog.close();
  }
});
exportDialog.addEventListener("close", openExportDialog);
selectEl("#export-overwrite-close").addEventListener("click", () =>
  resolveExportOverwrite("cancel"),
);
selectEl("#export-overwrite-cancel").addEventListener("click", () =>
  resolveExportOverwrite("cancel"),
);
selectEl("#export-overwrite-rename").addEventListener("click", () =>
  resolveExportOverwrite("rename"),
);
selectEl("#export-overwrite-confirm").addEventListener("click", () =>
  resolveExportOverwrite("overwrite"),
);
exportOverwriteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  resolveExportOverwrite("cancel");
});
const closeExportCompleteDialog = () => {
  if (exportCompleteDialog.open) {
    exportCompleteDialog.close();
  }
};
selectEl("#export-complete-close").addEventListener("click", closeExportCompleteDialog);
selectEl("#export-complete-confirm").addEventListener("click", closeExportCompleteDialog);
exportPresetSlots.addEventListener("click", (camera2) => {
  const isDataset = camera2.target.closest(
    "[data-export-preset-slot]",
  );
  if (isDataset) {
    selectExportPresetIndex(Number(isDataset.dataset.exportPresetSlot));
  }
});
exportPresetAdd.addEventListener("click", syncExportPresetEditor);
exportPresetRename.addEventListener("click", beginExportPresetRename);
exportPresetDelete.addEventListener("click", beginExportPresetDelete);
selectEl("#export-preset-rename-close").addEventListener(
  "click",
  closeExportPresetRenameDialog,
);
selectEl("#export-preset-rename-cancel").addEventListener(
  "click",
  closeExportPresetRenameDialog,
);
exportPresetRenameDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeExportPresetRenameDialog();
});
exportPresetRenameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const normalizeExportPresetSlots2 = normalizeExportPresetSlots(
    projectDoc?.exportPresets,
  );
  const normalizeActiveExportPresetSlot2 = normalizeActiveExportPresetSlot(
    projectDoc?.activeExportPresetSlot,
    normalizeExportPresetSlots2.length,
  );
  const floor =
    normalizeExportPresetSlots2[normalizeActiveExportPresetSlot2];
  if (!floor) {
    closeExportPresetRenameDialog();
    return;
  }
  const value = defaultExportPresetLabel(
    floor,
    normalizeActiveExportPresetSlot2,
  );
  const renameExportPresetSlotResult = renameExportPresetSlot(
    exportPresetRenameInput.value,
    normalizeActiveExportPresetSlot2,
  );
  floor.name = renameExportPresetSlotResult;
  projectDoc.exportPresets = normalizeExportPresetSlots2;
  closeExportPresetRenameDialog();
  normalizeProjectExportPresets();
  scheduleSave();
  if (renameExportPresetSlotResult !== value) {
    showToast("已重命名为“" + renameExportPresetSlotResult + "”。", "success");
  }
});
selectEl("#export-preset-delete-close").addEventListener(
  "click",
  closeExportPresetDeleteDialog,
);
selectEl("#export-preset-delete-cancel").addEventListener(
  "click",
  closeExportPresetDeleteDialog,
);
exportPresetDeleteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeExportPresetDeleteDialog();
});
exportPresetDeleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmExportPresetDelete();
});
exportDialog.addEventListener("input", (camera2) => {
  if (!camera2.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("change", (camera2) => {
  if (!camera2.target?.closest?.("#export-preset-slots")) {
    openExportPresetEditor();
  }
});
exportDialog.addEventListener("click", (camera2) => {
  if (
    camera2.target?.closest?.(
      "[data-camera-view], [data-camera-mode], [data-camera-rotate-top]",
    )
  ) {
    openExportPresetEditor();
  }
});
exportWidth.addEventListener("input", () => onExportDimensionInput("width"));
exportHeight.addEventListener("input", () => onExportDimensionInput("height"));
exportWidth.addEventListener("change", () =>
  onExportDimensionInput("width", true),
);
exportHeight.addEventListener("change", () =>
  onExportDimensionInput("height", true),
);
exportLockRatio.addEventListener("change", () => {
  const { width: width, height: height } = readExportResolution();
  if (exportLockRatio.checked) {
    exportAspectRatio = width / height;
  }
  syncExportResolutionLabel();
});
selectEl("#export-use-fixed").addEventListener(
  "click",
  applyStageFixedCameraView,
);
exportFloorSelect.addEventListener("change", () =>
  setExportFloorScope(exportFloorSelect.value),
);
exportPackage.addEventListener("click", runExportPipeline);
function postAutoDiagramReady(status = "ready") {
  if (
    !!isAutoDiagramEmbed &&
    !!autoDiagramComponentId &&
    window.parent !== window &&
    !!projectDoc
  ) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-base-lighting-state",
        componentId: autoDiagramComponentId,
        status: status,
        lighting: normalizeBaseLighting(baseLighting),
        savedLighting: normalizeBaseLighting(projectDoc.baseLighting),
        defaults: normalizeBaseLighting(DEFAULT_BASE_LIGHTING),
      },
      window.location.origin,
    );
  }
}
function postAutoDiagramBusy() {
  if (
    !!isAutoDiagramEmbed &&
    !!autoDiagramComponentId &&
    window.parent !== window &&
    !!projectDoc
  ) {
    window.parent.postMessage(
      {
        type: "ha-bridge-floorplan-auto-diagram-floor-state",
        componentId: autoDiagramComponentId,
        floors: projectDoc.floors.map((id) => ({
          id: id.id,
          name: id.name,
        })),
        floorSelection:
          getPreviewFloorMode() === "all"
            ? "all"
            : activeFloor()?.id || activeFloorId,
      },
      window.location.origin,
    );
  }
}
window.addEventListener("message", (origin) => {
  if (
    !isAutoDiagramEmbed ||
    origin.origin !== window.location.origin ||
    origin.source !== window.parent
  ) {
    return;
  }
  const item = origin.data;
  if (!!item && item.componentId === autoDiagramComponentId) {
    if (item.type === "ha-bridge-floorplan-auto-diagram-floor") {
      if (item.command === "set-floor") {
        const id = projectDoc.floors.find(
          (item) => item.id === item.value,
        );
        const arg0 =
          item.value === "all" && projectDoc.floors.length > 1
            ? "all"
            : id?.id || activeFloor()?.id || activeFloorId;
        setExportFloorScope(arg0);
        postAutoDiagramBusy();
      }
      return;
    }
    if (item.type === "ha-bridge-floorplan-auto-diagram-base-lighting") {
      if (item.command === "request-state") {
        baseLightControls.hidden = true;
        applyBaseLighting(projectDoc.baseLighting);
        postAutoDiagramReady("ready");
      } else if (item.command === "preview") {
        baseLightControls.hidden = true;
        applyBaseLighting(item.lighting);
        postAutoDiagramReady("preview");
      } else if (item.command === "reset") {
        baseLightControls.hidden = true;
        applyBaseLighting(DEFAULT_BASE_LIGHTING);
        postAutoDiagramReady("preview");
      } else if (item.command === "save") {
        baseLightControls.hidden = true;
        applyBaseLighting(item.lighting);
        commitBaseLightingFromControls();
        postAutoDiagramReady("saved");
      } else if (
        item.command === "cancel" ||
        item.command === "close"
      ) {
        closeBaseLightControls();
        postAutoDiagramReady("cancelled");
      } else {
        relocateBaseLightControls();
      }
      return;
    }
    if (item.type === "ha-bridge-floorplan-auto-diagram-camera") {
      const value = activeCameraSettings();
      if (item.command === "restore") {
        const snapshot = item.value || {};
        value.cameraMode =
          snapshot.mode === "perspective"
            ? "perspective"
            : "orthographic";
        value.cameraView = snapshot.view === "top" ? "top" : "free";
        value.cameraTopRotation =
          (((Math.round(finite(snapshot.topRotation, 0) / 90) * 90) %
            360) +
            360) %
          360;
        value.cameraFocalLength = clamp(
          finite(snapshot.focalLength, 50),
          18,
          120,
        );
        if (snapshot.snapshot) {
          setExportPresetFromUi(
            snapshot.snapshot,
            snapshot.snapshot.viewportAspect,
          );
        } else {
          setCameraProjectionMode(value.cameraMode, {
            preserveView: true,
          });
          nudgeCamera(value.cameraView, {
            force: true,
          });
          applyCameraFocalLength();
        }
      } else if (item.command === "set-view") {
        value.cameraView = item.value === "top" ? "top" : "free";
        nudgeCamera(value.cameraView);
      } else if (item.command === "set-mode") {
        value.cameraMode =
          item.value === "perspective" ? "perspective" : "orthographic";
        setCameraProjectionMode(value.cameraMode);
      } else if (item.command === "rotate-top") {
        value.cameraView = "top";
        value.cameraTopRotation = (topViewRotation() + 90) % 360;
        nudgeCamera("top", {
          force: true,
        });
      } else if (item.command === "set-focal-length") {
        value.cameraFocalLength = clamp(
          finite(item.value, getCameraFocalLength()),
          18,
          120,
        );
        applyCameraFocalLength();
      }
      requestRender();
      return;
    }
    if (
      item.type === "ha-bridge-floorplan-auto-diagram-generate" &&
      !orbitSuspended
    ) {
      for (const checked of exportDialog.querySelectorAll(
        "input[data-export-file]",
      )) {
        checked.checked = true;
      }
      exportFolderName.value = String(item.folderName || "").trim();
      exportWidth.value = String(
        Math.round(
          clamp(finite(item.width, exportWidth.value), 320, 4096),
        ),
      );
      exportHeight.value = String(
        Math.round(
          clamp(finite(item.height, exportHeight.value), 320, 4096),
        ),
      );
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
      floorScene.settings.livePreviewEnabled = flag;
      scheduleSave();
      syncLivePreviewButtons();
      if (flag) {
        rebuildPreviewMeshes({
          force: true,
        });
      } else {
        markPreviewQualityDirty();
      }
    }
  });
}
refreshPreview.addEventListener("click", () =>
  rebuildPreviewMeshes({
    force: true,
  }),
);
refreshLightPreview?.addEventListener("click", markPreviewQualityDirty);
detailsResizer.addEventListener("pointerdown", (event) => {
  if (event.button === 0) {
    detailsResizeDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPreviewRatio: floorScene.settings.previewPanelRatio,
      startWidthRatio: floorScene.settings.detailsPanelWidthRatio,
    };
    detailsPanelEl.classList.add("resizing");
    studioShellEl.classList.add("resizing");
    detailsResizer.dataset.resizeAxis = "pending";
    detailsResizer.setPointerCapture(event.pointerId);
  }
});
detailsResizer.addEventListener("pointermove", (pointer) => {
  if (detailsResizeDrag?.pointerId === pointer.pointerId) {
    if ((pointer.buttons & 1) === 0) {
      endDetailsPanelResize(pointer);
      return;
    }
    onDetailsResizePointerMove(pointer);
  }
});
const endDetailsPanelResize = (pointer, flag = true) => {
  if (
    !detailsResizeDrag ||
    (pointer?.pointerId !== undefined &&
      detailsResizeDrag.pointerId !== pointer.pointerId)
  ) {
    return;
  }
  const pointer2 = detailsResizeDrag;
  detailsResizeDrag = null;
  const flag2 =
    Math.abs(
      floorScene.settings.previewPanelRatio - pointer2.startPreviewRatio,
    ) > 0.0001 ||
    Math.abs(
      floorScene.settings.detailsPanelWidthRatio - pointer2.startWidthRatio,
    ) > 0.0001;
  detailsPanelEl.classList.remove("resizing");
  studioShellEl.classList.remove("resizing");
  delete detailsResizer.dataset.resizeAxis;
  if (flag) {
    try {
      if (detailsResizer.hasPointerCapture(pointer2.pointerId)) {
        detailsResizer.releasePointerCapture(pointer2.pointerId);
      }
    } catch {}
  }
  if (flag2) {
    scheduleSave();
  }
};
detailsResizer.addEventListener("pointerup", endDetailsPanelResize);
detailsResizer.addEventListener("pointercancel", endDetailsPanelResize);
detailsResizer.addEventListener("lostpointercapture", (pointer) =>
  endDetailsPanelResize(pointer, false),
);
window.addEventListener("pointerup", endDetailsPanelResize, true);
window.addEventListener("pointercancel", endDetailsPanelResize, true);
window.addEventListener("blur", () => endDetailsPanelResize());
detailsResizer.addEventListener("keydown", (event) => {
  const flag =
    event.key === "ArrowUp"
      ? -0.03
      : event.key === "ArrowDown"
        ? 0.03
        : 0;
  const flag2 =
    event.key === "ArrowLeft"
      ? 0.03
      : event.key === "ArrowRight"
        ? -0.03
        : 0;
  if (!flag && !flag2) {
    return;
  }
  event.preventDefault();
  const value = studioLayoutMetrics();
  floorScene.settings.previewPanelRatio = clamp(
    floorScene.settings.previewPanelRatio + flag,
    value.minimumHeightRatio,
    value.maximumHeightRatio,
  );
  floorScene.settings.detailsPanelWidthRatio = clamp(
    floorScene.settings.detailsPanelWidthRatio + flag2,
    value.minimumWidthRatio,
    value.maximumWidthRatio,
  );
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
  scheduleSave();
});
for (const e of cameraModeEls) {
  e.addEventListener("click", () => {
    const arg0 =
      e.dataset.cameraMode === "perspective" ? "perspective" : "orthographic";
    if (arg0 !== getCameraProjectionMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraMode = arg0;
      setCameraProjectionMode(arg0);
      if (stageSession) {
        exportStatus.textContent =
          arg0 === "perspective"
            ? "已切换为透视构图"
            : "已切换为正交构图";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of cameraViewEls) {
  e.addEventListener("click", () => {
    const arg0 = e.dataset.cameraView === "top" ? "top" : "free";
    if (arg0 !== cameraViewMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraView = arg0;
      nudgeCamera(arg0);
      if (stageSession) {
        exportStatus.textContent =
          arg0 === "top" ? "已切换为顶视构图" : "已切换为自由构图";
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
        force: true,
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
        exportStatus.textContent =
          "焦段已设为 " + Math.round(clamp2) + " mm";
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
for (const e of openBaseLightingButtons) {
  e.addEventListener("click", relocateBaseLightControls);
}
closeBaseLighting?.addEventListener("click", closeBaseLightControls);
saveBaseLighting?.addEventListener("click", commitBaseLightingFromControls);
resetBaseLighting?.addEventListener("click", () => {
  applyBaseLighting(DEFAULT_BASE_LIGHTING);
});
baseLightControlsHeader?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || event.target.closest("button")) {
    return;
  }
  const left = baseLightControls.getBoundingClientRect();
  baseLightDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: left.left,
    startTop: left.top,
    moved: false,
  };
  try {
    baseLightControlsHeader.setPointerCapture(event.pointerId);
  } catch {}
});
baseLightControlsHeader?.addEventListener("pointermove", (event) => {
  if (!baseLightDrag || event.pointerId !== baseLightDrag.pointerId) {
    return;
  }
  const value = event.clientX - baseLightDrag.startX;
  const local2 = event.clientY - baseLightDrag.startY;
  if (!baseLightDrag.moved && Math.hypot(value, local2) < 4) {
    return;
  }
  baseLightDrag.moved = true;
  event.preventDefault();
  const size = baseLightControls.getBoundingClientRect();
  const maxValue = Math.max(8, window.innerWidth - size.width - 8);
  const maxValue2 = Math.max(8, window.innerHeight - size.height - 8);
  baseLightControls.style.right = "auto";
  baseLightControls.style.left =
    clamp(baseLightDrag.startLeft + value, 8, maxValue) + "px";
  baseLightControls.style.top =
    clamp(baseLightDrag.startTop + local2, 8, maxValue2) + "px";
});
const endBaseLightPanelDrag = (pointer) => {
  if (!!baseLightDrag && pointer.pointerId === baseLightDrag.pointerId) {
    baseLightDrag = null;
  }
};
baseLightControlsHeader?.addEventListener("pointerup", endBaseLightPanelDrag);
baseLightControlsHeader?.addEventListener("pointercancel", endBaseLightPanelDrag);
baseLightingChannel?.addEventListener("message", (data) => {
  if (data.data?.type !== "base-lighting-saved") {
    return;
  }
  const normalizeBaseLighting2 = normalizeBaseLighting(
    data.data.lighting,
  );
  if (projectDoc) {
    projectDoc.baseLighting = normalizeBaseLighting2;
  }
  applyBaseLighting(normalizeBaseLighting2);
});
snapToggle.addEventListener("click", () => {
  pushHistory();
  floorScene.settings.snapEnabled = floorScene.settings.snapEnabled === false;
  syncSnapUi();
  updatePlanPointer();
  drawPlan();
  scheduleSave();
});
snapSettingsToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setSnapSettingsOpen(snapSettingsPanel.hidden);
});
snapSettingsPanel.addEventListener("pointerdown", (event) =>
  event.stopPropagation(),
);
for (const e of snapSettingEls) {
  e.addEventListener("change", () => {
    pushHistory();
    floorScene.settings[e.dataset.snapSetting] = e.checked;
    updatePlanPointer();
    drawPlan();
    scheduleSave();
  });
}
snapTolerance.addEventListener("input", () => {
  snapToleranceValue.textContent = snapTolerance.value + " px";
});
snapTolerance.addEventListener("change", () => {
  const clamp2 = clamp(Math.round(finite(snapTolerance.value, 13)), 6, 24);
  if (clamp2 !== floorScene.settings.snapTolerance) {
    pushHistory();
    floorScene.settings.snapTolerance = clamp2;
    syncSnapUi();
    updatePlanPointer();
    drawPlan();
    scheduleSave();
  }
});
finishWall.addEventListener("click", () => cancelWallDrawing());
deleteSelection.addEventListener("click", deleteCurrentSelection);
selectEl("#scale-close").addEventListener("click", () => {
  pendingCalibration = null;
  scaleDialog.close();
  drawPlan();
});
selectEl("#scale-cancel").addEventListener("click", () => {
  pendingCalibration = null;
  scaleDialog.close();
  setActiveTool("scale");
});
scaleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pendingCalibration) {
    return;
  }
  const meters = finite(referenceMeters.value, 0);
  const distance2 = distance(
    pendingCalibration.start,
    pendingCalibration.end,
  );
  if (meters <= 0 || distance2 <= 0) {
    showToast("请输入有效的真实长度。", "error");
    return;
  }
  pushHistory();
  floorScene.calibration = {
    pixelsPerMeter: distance2 / meters,
    reference: {
      ...pendingCalibration,
      meters: meters,
    },
  };
  pendingCalibration = null;
  scaleDialog.close();
  setActiveTool("wall");
  refreshViews();
  applyCameraView();
  scheduleSave();
  const value = activeFloor();
  if (
    projectDoc.floors.findIndex((item) => item.id === value?.id) >
      0 &&
    value?.alignmentPending
  ) {
    requestAnimationFrame(() => beginAlignFloorSession());
    showToast("比例已标定，接下来设置上下楼层的参照点。");
  } else {
    showToast("比例已标定，可以沿着底图连续描墙了。");
  }
});
for (const e of [
  selectEl("#wall-height"),
  selectEl("#wall-thickness"),
  selectEl("#wall-opacity-mode"),
  selectEl("#wall-opacity"),
  selectEl("#wall-open-end-mode"),
]) {
  e.addEventListener("change", () => applyInspectorFields("wall"));
}
for (const e of [
  selectEl("#window-width"),
  selectEl("#window-height"),
  selectEl("#window-sill"),
  selectEl("#window-divider"),
]) {
  e.addEventListener("change", () => applyInspectorFields("window"));
}
for (const e of [
  selectEl("#door-type"),
  selectEl("#door-width"),
  selectEl("#door-height"),
]) {
  e.addEventListener("change", () => applyInspectorFields("door"));
}
for (const e of [selectEl("#railing-width"), selectEl("#railing-height")]) {
  e.addEventListener("change", () => applyInspectorFields("railing"));
}
for (const e of [
  selectEl("#item-x"),
  selectEl("#item-y"),
  selectEl("#item-width"),
  selectEl("#item-height"),
  selectEl("#item-depth"),
  selectEl("#item-elevation"),
  selectEl("#item-rotation"),
  selectEl("#item-vertical-rotation"),
  itemStripRoll,
]) {
  e.addEventListener("change", () => applyInspectorFields("item"));
}
itemLightSourceVisible.addEventListener("change", () =>
  applyInspectorFields("item"),
);
for (const e of [
  selectEl("#label-title"),
  selectEl("#label-title-spacing"),
  selectEl("#label-subtitle"),
  selectEl("#label-subtitle-spacing"),
  selectEl("#label-line-length"),
]) {
  e.addEventListener("change", () => applyInspectorFields("item"));
}
for (const e of [
  selectEl("#light-group"),
  selectEl("#light-temperature"),
  selectEl("#light-brightness"),
  selectEl("#light-range"),
  selectEl("#light-angle"),
]) {
  e.addEventListener("change", () => applyInspectorFields("item"));
}
selectEl("#curtain-position").addEventListener("change", () =>
  applyInspectorFields("item"),
);
selectEl("#round-table-turntable").addEventListener("change", () =>
  applyInspectorFields("item"),
);
selectEl("#stair-direction").addEventListener("change", () =>
  applyInspectorFields("item"),
);
selectEl("#tv-mount-style").addEventListener("change", () =>
  applyInspectorFields("item"),
);
shoeCabinetMirror.addEventListener("click", () => {
  const item = selectedEntity();
  if (
    !!item &&
    selection?.kind === "item" &&
    item.type === "shoecabinet"
  ) {
    pushHistory();
    item.shoeCabinetMirrored = item.shoeCabinetMirrored !== true;
    refreshViews(itemPreviewScope(item));
    scheduleSave();
  }
});
selectionInspector.addEventListener("submit", (event) =>
  event.preventDefault(),
);
selectEl("#door-hinge").addEventListener("click", () => {
  const door = selectedEntity();
  if (
    !!door &&
    selection?.kind === "door" &&
    !["double", "entry", "sliding-glass", "roller-shutter"].includes(
      door.doorType,
    )
  ) {
    pushHistory();
    door.hinge = door.hinge === "right" ? "left" : "right";
    refreshViews();
    scheduleSave();
  }
});
selectEl("#door-swing").addEventListener("click", () => {
  const door = selectedEntity();
  if (
    !!door &&
    selection?.kind === "door" &&
    !["entry", "sliding-glass", "frame-only"].includes(door.doorType)
  ) {
    pushHistory();
    door.swing = door.swing === -1 ? 1 : -1;
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
    item.rotation =
      item.type === "striplight"
        ? normalizeFullRotation(value)
        : value % 360;
    refreshViews(itemPreviewScope(item));
    scheduleSave();
  });
}
window.addEventListener("keydown", (event) => {
  if (isStageEmbed || event.defaultPrevented || exportDialog.open) {
    return;
  }
  if (event.key === "Escape" && !snapSettingsPanel.hidden) {
    setSnapSettingsOpen(false);
    return;
  }
  const flag =
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    scaleDialog.open;
  if (event.code === "Space" && !flag) {
    isMiddleMousePanning = true;
    event.preventDefault();
  }
  if (event.key.toLowerCase() === "s" && !flag) {
    snapTemporarilyDisabled = true;
    updatePlanPointer();
    drawPlan();
  }
  if (flag) {
    return;
  }
  if (
    event.key === "Shift" &&
    !dragState &&
    (activeTool === "scale" || activeTool === "wall")
  ) {
    shiftKeyHeld = true;
    updatePlanPointer();
    drawPlan();
  }
  const flag2 = event.metaKey || event.ctrlKey;
  if (flag2 && event.key.toLowerCase() === "z") {
    event.preventDefault();
    if (event.shiftKey) {
      redoEdit();
    } else {
      undoEdit();
    }
    return;
  }
  if (flag2 && event.key.toLowerCase() === "d") {
    event.preventDefault();
    selectedItemIds();
    return;
  }
  if (flag2 && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copySelectedItems();
    return;
  }
  if (flag2 && event.key.toLowerCase() === "v") {
    event.preventDefault();
    pasteClipboardItems();
    return;
  }
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    deleteCurrentSelection();
    return;
  }
  const planPoint = {
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
  if (planPoint && !flag2) {
    const list =
      selection?.kind === "item"
        ? [selection.id]
        : multiSelection
            .filter((kind) => kind.kind === "item")
            .map((item) => item.id);
    if (list.length) {
      event.preventDefault();
      if (!event.repeat) {
        pushHistory();
      }
      const value =
        (event.altKey ? 0.01 : event.shiftKey ? 0.25 : 0.05) *
        (pixelsPerMeter() || 1);
      const uniqueSet = new Set(list);
      for (const planPoint2 of floorScene.items) {
        if (uniqueSet.has(planPoint2.id)) {
          planPoint2.x += planPoint.x * value;
          planPoint2.y += planPoint.y * value;
        }
      }
      refreshViews(activeSelectionAssetCategory());
      scheduleSave();
      return;
    }
  }
  if (event.key === "Escape") {
    if (alignSession) {
      event.preventDefault();
      cancelAlignFloorSession();
      return;
    }
    hideLightGroupContextMenu();
    cancelWallDrawing();
    const arg0 = activeSelectionLightGroupFilter();
    clearSelection();
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(arg0);
  }
});
window.addEventListener("keyup", (key) => {
  if (key.code === "Space") {
    isMiddleMousePanning = false;
  }
  if (key.key.toLowerCase() === "s") {
    snapTemporarilyDisabled = false;
    updatePlanPointer();
    drawPlan();
  }
  if (key.key === "Shift") {
    shiftKeyHeld = false;
    updatePlanPointer();
    drawPlan();
  }
});
window.addEventListener("blur", () => {
  isMiddleMousePanning = false;
  shiftKeyHeld = false;
  snapTemporarilyDisabled = false;
});
window.addEventListener("beforeunload", (event) => {
  if (saveGeneration !== savedGeneration) {
    event.preventDefault();
    event.returnValue = "";
  }
});
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    requestRender();
  }
});
if (new URLSearchParams(window.location.search).has("model-export")) {
  window.__haBridgeExportFurnitureJson = (type, arg1 = {}) => {
    const size = furnitureCatalog[type];
    if (!size) {
      throw new Error("Unknown furniture type: " + type);
    }
    const size2 = {
      id: "offline-export-" + type,
      type: type,
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
      ...arg1,
    };
    const object3d = buildItemPreviewGroup(size2);
    object3d.name = "ha-bridge-v1-" + type;
    object3d.updateMatrixWorld(true);
    const value = object3d.toJSON();
    disposeObject3dResources(object3d);
    return value;
  };
  const n = new URLSearchParams(window.location.search).get("model-export");
  if (n && n !== "1") {
    const o =
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
      }[n] || {};
    const a = o.type || n;
    requestAnimationFrame(() => {
      try {
        const id = document.createElement("textarea");
        id.id = "ha-bridge-model-export";
        id.hidden = true;
        const value = JSON.stringify(
          window.__haBridgeExportFurnitureJson(a, o),
        );
        id.value = value;
        id.textContent = value;
        document.body.append(id);
        document.documentElement.dataset.modelExportReady = n;
      } catch (error) {
        document.documentElement.dataset.modelExportError =
          error?.message || String(error);
      }
    });
  }
}
const materialTestTypeQuery = new URLSearchParams(window.location.search).get("material-test");
if (materialTestTypeQuery) {
  (async () => {
    const object3d = new THREE.Group();
    try {
      document.documentElement.dataset.materialTestStage = "loading";
      const size = furnitureCatalog[materialTestTypeQuery];
      if (!size || !ALL_ITEM_MODELS[materialTestTypeQuery]) {
        throw new Error("Unsupported material test type: " + materialTestTypeQuery);
      }
      if (!(await loadExternalItemModel(materialTestTypeQuery))) {
        throw new Error("Material test model failed to load: " + materialTestTypeQuery);
      }
      document.documentElement.dataset.materialTestStage = "renderer";
      for (let value = 0; !renderer && value < 120; value += 1) {
        await yieldToScheduler();
      }
      if (!renderer || !camera || !previewScene) {
        throw new Error("Material test renderer was not initialized");
      }
      const list = [];
      for (let value = 0; value < 3; value += 1) {
        const group = {
          id: "material-test-" + materialTestTypeQuery + "-" + (value + 1),
          type: materialTestTypeQuery,
          width: size.width,
          height: size.height,
          depth: size.depth,
          elevation: 0,
          rotation: 0,
        };
        const object3d2 = new THREE.Group();
        if (!attachExternalItemModel(object3d2, group)) {
          throw new Error("Material test model was not mounted: " + materialTestTypeQuery);
        }
        object3d2.traverse((object3d3) => {
          if (!object3d3.isMesh) {
            return;
          }
          const list2 = Array.isArray(object3d3.material)
            ? object3d3.material
            : [object3d3.material];
          list.push(...list2.filter(Boolean));
        });
        object3d.add(object3d2);
      }
      document.documentElement.dataset.materialTestStage = "compiling";
      renderer.compile(object3d, camera, previewScene);
      const unique = new Set(list).size;
      for (let value = 0; value < 600; value += 1) {
        const active = externalModels.modelLoadState();
        if (active.active === 0 && active.queued === 0) {
          break;
        }
        await yieldToScheduler();
      }
      const materials = externalModels.modelLoadState();
      const models = {
        models: 3,
        slots: list.length,
        unique: unique,
        shared: list.length - unique,
        cacheMaterials: materials.materials,
        cacheReuses: materials.materialReuses,
      };
      document.documentElement.dataset.materialTestStats =
        JSON.stringify(models);
      const id = document.createElement("output");
      id.id = "ha-bridge-material-test-output";
      id.setAttribute("aria-live", "polite");
      id.textContent =
        "材质测试 " +
        materialTestTypeQuery +
        "：" +
        models.models +
        " 个模型，" +
        models.slots +
        " 个材质槽，" +
        models.unique +
        " 种唯一材质，" +
        models.shared +
        " 个槽复用；当前缓存 " +
        models.cacheMaterials +
        " 种，累计复用 " +
        models.cacheReuses +
        " 次。";
      document.body.append(id);
      document.documentElement.dataset.materialTestReady = materialTestTypeQuery;
      document.documentElement.dataset.materialTestStage = "ready";
    } catch (error) {
      document.documentElement.dataset.materialTestError =
        error?.message || String(error);
      document.documentElement.dataset.materialTestStage = "error";
    } finally {
      disposeObject3dResources(object3d);
    }
  })();
}
const instanceTestTypeQuery = new URLSearchParams(window.location.search).get("instance-test");
if (instanceTestTypeQuery) {
  const e = new THREE.Group();
  const n = new THREE.BoxGeometry(0.5, 0.86, 0.5);
  try {
    if (skipInstanceMergeTypes.has(instanceTestTypeQuery)) {
      throw new Error("Unsupported instance test type: " + instanceTestTypeQuery);
    }
    const t = [];
    for (let a = 0; a < 3; a += 1) {
      const i = {
        id: "instance-test-" + instanceTestTypeQuery + "-" + (a + 1),
        type: instanceTestTypeQuery,
      };
      const l = new THREE.Group();
      const r = new THREE.Mesh(
        n,
        new THREE.MeshStandardMaterial({
          color: themeColors.furniture,
          roughness: 0.72,
        }),
      );
      r.position.y = 0.43;
      r.userData.externalModelSharedGeometry = true;
      l.position.x = a * 0.9;
      l.rotation.y = THREE.MathUtils.degToRad(a * 30);
      l.add(r);
      e.add(l);
      t.push({
        item: i,
        group: l,
      });
    }
    const o = instanceMergeIdenticalItems(e, t);
    document.documentElement.dataset.instanceTestStats = JSON.stringify(o);
    document.documentElement.dataset.instanceTestReady = instanceTestTypeQuery;
  } catch (error) {
    document.documentElement.dataset.instanceTestError =
      error?.message || String(error);
  } finally {
    disposeObject3dResources(e);
    n.dispose();
  }
}
new ResizeObserver(resizePlanCanvas).observe(planStage);
initializeStudioSelects();
initializeNumberInputs();
syncBaseLightingControls();
function buildStageReferenceScene() {
  const projectDoc = normalizeProjectDocument(
    hasProjectLoaded.referenceScene || hasProjectLoaded.scene,
  );
  baseLightingChannel?.close();
  baseLightingChannel = null;
  let backgroundVisible = true;
  let interactionEnabled = false;
  let trackedWorldGroup;
  let trackedFloorChild;
  let backgroundObjects = [];
  let presentedPromise;
  let focusTarget;
  let boundControls;
  let hasBaseLighting = false;
  let rotationMode = "free";
  let panEnabled = true;
  let zoomEnabled = true;
  let suppressOrbitBusy = false;
  let orbitDragging = false;
  let viewOffsetRatio = 0;
  let viewportKey = "";
  let viewBlend = null;
  const orthoCamera = new THREE.OrthographicCamera();
  const perspCamera = new THREE.PerspectiveCamera();
  function visibleHeightForView(view) {
    if (view.mode !== "perspective") {
      return (
        Math.max(1, view.frameSize || 10) /
        view.zoom /
        Math.min(1, Math.max(0.1, camera.userData.viewportAspect || 1))
      );
    } else {
      perspCamera.aspect = camera.userData.viewportAspect || 1;
      perspCamera.zoom = view.zoom;
      perspCamera.setFocalLength(view.focalLength || 50);
      return (
        new THREE.Vector3()
          .fromArray(view.position)
          .distanceTo(new THREE.Vector3().fromArray(view.target)) *
        2 *
        Math.tan(THREE.MathUtils.degToRad(perspCamera.getEffectiveFOV()) / 2)
      );
    }
  }
  function syncProjectionBlend() {
    if (!viewBlend) {
      return;
    }
    const value = Math.max(
      0.000001,
      camera.position.distanceTo(orbitControls.target),
    );
    const h = Math.max(0.000001, viewBlend.height);
    const aspect = camera.userData.viewportAspect || 1;
    Object.assign(orthoCamera, {
      left: (-h * aspect) / 2,
      right: (h * aspect) / 2,
      top: h / 2,
      bottom: -h / 2,
      near: camera.near,
      far: camera.far,
      zoom: 1,
    });
    Object.assign(perspCamera, {
      fov: THREE.MathUtils.radToDeg(
        Math.atan(h / (value * 2)) * 2,
      ),
      aspect: aspect,
      near: camera.near,
      far: camera.far,
      zoom: 1,
    });
    for (const view of [orthoCamera, perspCamera]) {
      view.view = camera.view
        ? {
            ...camera.view,
          }
        : null;
      view.updateProjectionMatrix();
    }
    const elements = orthoCamera.projectionMatrix.elements;
    const elements2 = perspCamera.projectionMatrix.elements;
    const weight = viewBlend.weight;
    for (let n = 0; n < 16; n++) {
      camera.projectionMatrix.elements[n] =
        elements[n] * (1 - weight) +
        (elements2[n] / value) * weight;
    }
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  const lightTransitions = new Map();
  const pendingLightTweens = new Map();
  let blendRafId = 0;
  let lightRafId = 0;
  let idleTimerId = null;
  let lightsConfigured = false;
  let pagehideBound = false;
  let warmupTimerId = null;
  let lightsWorldGroup;
  let lightsFloorChild;
  let lightsNeedSync = false;
  let worldItemKeys = new Map();
  let visibleLightsByKey = new Map();
  const captureToken = {
    restore: () => syncLiveLights(performance.now(), true),
  };
  function setStageWarmup(flag) {
    if (warmupTimerId !== null) {
      window.clearTimeout(warmupTimerId);
    }
    warmupTimerId = null;
    if (flag) {
      if (isStageWarmup) {
        return;
      }
      isStageWarmup = true;
      qualityProbeStartMs = 0;
      setPreviewPixelRatio(true, {
        preserveLightCache: true,
      });
    } else if (isStageWarmup) {
      warmupTimerId = window.setTimeout(() => {
        warmupTimerId = null;
        isStageWarmup = false;
        checkAdaptiveQuality();
        qualityProbeStartMs = 0;
        setPreviewPixelRatio(previewOrbitLocked, {
          preserveLightCache: true,
        });
      }, 140);
    }
  }
  function lightBrightnessCurve(item, arg) {
    const value = clamp(finite(arg, 0), 0, 100) / 100;
    if (item.type === "striplight") {
      return Math.pow(value, 0.82);
    } else {
      return spotLightBrightnessResponse(item.type, value);
    }
  }
  function lightIntensityForItem(item) {
    const range =
      defaultLightPresets[item.type] || defaultLightPresets.downlight;
    const value = lightHeightScaleByType[item.type] || 1.1;
    if (item.type !== "striplight") {
      return (item.type === "ceilinglight" ? 680 : 520) * value;
    }
    const n = clamp(
      finite(item.lightRange, range.range),
      0.5,
      10,
    );
    const maxValue = Math.max(finite(item.elevation, 2.7), 0.4);
    return (
      clamp(n / range.range, 0.45, 1.65) *
      48 *
      clamp(Math.max(1, Math.pow(maxValue / 2.7, 2)), 1, 4) *
      value
    );
  }
  function applyLightObjectState(object3d, intensity) {
    object3d.intensity = intensity.intensity;
    object3d.color.fromArray(intensity.color);
    object3d.visible =
      intensity.intensity > 0.000001 || !intensity.complete;
  }
  function syncLiveLights(arg, flag = false) {
    if (isCapturingFrame === captureToken) {
      if (lightsWorldGroup !== worldGroup || lightsFloorChild !== worldGroup?.children[0]) {
        lightsWorldGroup = worldGroup;
        lightsFloorChild = worldGroup?.children[0];
        worldItemKeys = collectWorldItemKeys();
        visibleLightsByKey = new Map(
          collectVisibleLights().map((itemKey) => [
            itemKey.itemKey,
            itemKey,
          ]),
        );
        lightsNeedSync = true;
      }
      if (flag || lightsNeedSync) {
        for (const [worldItemKey, worldItemKey2] of worldItemKeys) {
          const lightBinding = visibleLightsByKey.get(worldItemKey);
          if (!lightBinding) {
            continue;
          }
          const flag2 =
            lightBinding.group?.enabled !== false &&
            lightBinding.item.lightBrightness > 0;
          for (const object3d of worldItemKey2) {
            object3d.intensity = flag2
              ? finite(object3d.userData.lightOnIntensity, 0)
              : 0;
            object3d.visible = flag2;
            object3d.color.setHex(
              lightEffectColorHex(lightBinding.item.lightTemperature),
            );
          }
        }
      }
      lightsNeedSync = false;
    }
    for (const [intensity, lightTransition] of lightTransitions) {
      applyLightObjectState(intensity, sampleLightTransition(lightTransition, arg));
    }
  }
  function animateViewBlend(duration, arg) {
    const value = duration.duration
      ? clamp(
          (arg - duration.started) / duration.duration,
          0,
          1,
        )
      : 1;
    return (
      duration.from +
      (duration.to - duration.from) *
        value *
        value *
        (3 - value * 2)
    );
  }
  function cancelBlendRaf() {
    if (blendRafId) {
      cancelAnimationFrame(blendRafId);
    }
    blendRafId = 0;
    pendingLightTweens.clear();
    hasPendingShadowTiles = false;
  }
  function onBlendRaf(value) {
    blendRafId = 0;
    if (
      !lightCacheReady ||
      previewQualityJustBecameReady ||
      previewLightCache.hidden ||
      isCapturingFrame
    ) {
      cancelBlendRaf();
      return;
    }
    for (const [pendingLightTween, duration] of pendingLightTweens) {
      pendingModelLoads.set(
        pendingLightTween,
        animateViewBlend(duration, value),
      );
      if (value >= duration.started + duration.duration) {
        pendingLightTweens.delete(pendingLightTween);
      }
    }
    hasPendingShadowTiles = pendingLightTweens.size > 0;
    blitLightCacheToOverlay();
    if (pendingLightTweens.size) {
      blendRafId = requestAnimationFrame(onBlendRaf);
    }
  }
  function tweenLightStates(values, immediate, arg) {
    if (
      !lightCacheReady ||
      previewQualityJustBecameReady ||
      isBakingLightCache ||
      previewLightCache.hidden ||
      isCapturingFrame ||
      suppressOrbitBusy ||
      orbitDragging
    ) {
      return false;
    }
    const entry = [...values.values()].filter(
      (floor) =>
        getPreviewFloorMode() === "all" || floor.floorId === activeFloorId,
    );
    if (
      !entry.every(
        (item) =>
          item.previousBrightness ===
            item.item.lightBrightness &&
          item.previousKelvin === item.item.lightTemperature &&
          lightCacheTileMap.has(
            previewScopedItemKey(
              item.floorId,
              item.item.lightGroupId,
            ),
          ),
      )
    ) {
      return false;
    }
    const started = performance.now();
    for (const wasOn of entry) {
      const itemKey = previewScopedItemKey(
        wasOn.floorId,
        wasOn.item.lightGroupId,
      );
      const duration = pendingLightTweens.get(itemKey);
      const value = duration
        ? animateViewBlend(duration, started)
        : finite(pendingModelLoads.get(itemKey), wasOn.wasOn ? 1 : 0);
      pendingLightTweens.set(itemKey, {
        from: value,
        to: wasOn.isOn ? 1 : 0,
        started: started,
        duration: lightTransitionDurationMs(
          wasOn.wasOn,
          wasOn.isOn,
          wasOn.fadeDuration,
          {
            ...arg,
            immediate: immediate,
          },
        ),
      });
    }
    if (blendRafId) {
      cancelAnimationFrame(blendRafId);
    }
    onBlendRaf(started);
    return true;
  }
  function rebuildLightWorldCache() {
    const byKey6 = new Map(pendingLightTweens);
    cancelBlendRaf();
    isCapturingFrame = captureToken;
    if (idleTimerId !== null) {
      window.clearTimeout(idleTimerId);
    }
    idleTimerId = null;
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = null;
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
    if (!isBakingLightCache) {
      showPreviewRenderShield();
    }
    setPreviewLightCacheVisible(false);
    const entry = collectVisibleLights();
    worldItemKeys = ensureWorldItemsCached(entry);
    visibleLightsByKey = new Map(
      entry.map((itemKey) => [
        itemKey.itemKey,
        itemKey,
      ]),
    );
    lightsWorldGroup = worldGroup;
    lightsFloorChild = worldGroup?.children[0];
    lightsNeedSync = true;
    const now = performance.now();
    for (const groupKey of entry) {
      const blendTarget = byKey6.get(groupKey.groupKey);
      if (!blendTarget) {
        continue;
      }
      const blendAnim = animateViewBlend(blendTarget, now);
      for (const object3d of worldItemKeys.get(groupKey.itemKey) ||
        []) {
        const finite2 = finite(
          object3d.userData.lightOnIntensity,
          0,
        );
        const color = object3d.color.toArray();
        lightTransitions.set(
          object3d,
          createLightTransition(
            {
              intensity: finite2 * blendAnim,
              color: color,
            },
            {
              intensity: finite2 * blendTarget.to,
              color: color,
            },
            now,
            Math.max(0, blendTarget.started + blendTarget.duration - now),
          ),
        );
      }
    }
    if (lightTransitions.size && !lightRafId) {
      lightRafId = requestAnimationFrame(onLightRaf);
    }
    syncOrbitControls();
    return worldItemKeys;
  }
  function onIdleSettle() {
    idleTimerId = null;
    if (
      !suppressOrbitBusy &&
      !orbitDragging &&
      !lightTransitions.size &&
      isCapturingFrame === captureToken
    ) {
      if (isBakingLightCache || isStageWarmup) {
        idleTimerId = window.setTimeout(onIdleSettle, 60);
        return;
      }
      isCapturingFrame = null;
      if (isPreviewQualityReady()) {
        previewQualityJustBecameReady = true;
        scheduleAdaptiveQuality(0);
      }
    }
  }
  function onLightRaf(value) {
    lightRafId = 0;
    syncLiveLights(value);
    let flag = false;
    for (const [object3d, started] of lightTransitions) {
      if (!(value - started.started < started.duration)) {
        lightTransitions.delete(object3d);
        if (!object3d.visible) {
          flag = true;
        }
      }
    }
    if (flag) {
      countShadowLights(worldGroup, {
        rebuildAtlas: false,
      });
    }
    updateLightPreview();
    if (lightTransitions.size) {
      lightRafId = requestAnimationFrame(onLightRaf);
    } else {
      setStageWarmup(false);
      if (isCapturingFrame === captureToken) {
        idleTimerId = window.setTimeout(onIdleSettle, 180);
      }
    }
  }
  function stopLightAnimation() {
    cancelBlendRaf();
    if (lightRafId) {
      cancelAnimationFrame(lightRafId);
    }
    if (idleTimerId !== null) {
      window.clearTimeout(idleTimerId);
    }
    if (warmupTimerId !== null) {
      window.clearTimeout(warmupTimerId);
    }
    lightRafId = 0;
    idleTimerId = null;
    warmupTimerId = null;
    isStageWarmup = false;
    for (const [intensity, to] of lightTransitions) {
      applyLightObjectState(intensity, {
        ...to.to,
        complete: true,
      });
    }
    lightTransitions.clear();
    orbitDragging = false;
    worldItemKeys.clear();
    visibleLightsByKey.clear();
    if (isCapturingFrame === captureToken) {
      isCapturingFrame = null;
    }
  }
  const itemBrightnessCache = new WeakMap();
  function setLightStates(arg, immediate2 = {}) {
    if (!pagehideBound) {
      pagehideBound = true;
      window.addEventListener("pagehide", stopLightAnimation, {
        once: true,
      });
    }
    const immediate =
      immediate2.immediate === true ||
      !lightsConfigured ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const values = new Map();
    for (const floor of arg) {
      const mapLightEffectState2 = mapLightEffectState(floor);
      const floor2 = projectDoc.floors.find(
        (floor3) => floor3.id === floor.floorId,
      );
      const lightGroup = floor2?.scene.lightGroups.find(
        (group) => group.id === floor.groupId,
      );
      if (!lightGroup) {
        continue;
      }
      const wasOn = lightGroup.enabled !== false;
      const isOn = floor.on === true;
      lightGroup.enabled = isOn;
      for (const item of floor2.scene.items) {
        if (
          item.lightGroupId !== lightGroup.id ||
          !lightItemTypes.has(item.type)
        ) {
          continue;
        }
        const brightness = item.lightBrightness;
        const kelvin = item.lightTemperature;
        if (!itemBrightnessCache.has(item)) {
          itemBrightnessCache.set(item, {
            brightness: brightness,
            kelvin: kelvin,
          });
        }
        const brightness2 = itemBrightnessCache.get(item);
        if (Number.isFinite(mapLightEffectState2.brightness)) {
          item.lightBrightness =
            mapLightEffectState2.brightness;
        } else if (floor.brightnessSupported === false) {
          item.lightBrightness =
            brightness2.brightness;
        }
        if (Number.isFinite(mapLightEffectState2.kelvin)) {
          item.lightTemperature =
            mapLightEffectState2.kelvin;
        } else if (floor.temperatureSupported === false) {
          item.lightTemperature = brightness2.kelvin;
        }
        if (
          wasOn !== isOn ||
          brightness !== item.lightBrightness ||
          kelvin !== item.lightTemperature
        ) {
          values.set(
            layerScopedKey(floor2.id, item.id),
            {
              item: item,
              floorId: floor2.id,
              wasOn: wasOn,
              isOn: isOn,
              previousBrightness: brightness,
              previousKelvin: kelvin,
              fadeDuration: floor.fadeDuration,
            },
          );
        }
      }
    }
    lightsConfigured = true;
    if (!values.size) {
      return;
    }
    const qualityReady = isPreviewQualityReady();
    if (qualityReady && tweenLightStates(values, immediate, immediate2)) {
      return;
    }
    let itemKeys = collectWorldItemKeys();
    const value = itemKeys;
    if (qualityReady) {
      itemKeys = rebuildLightWorldCache();
    } else if (
      [...values.keys()].some((arg2) => !itemKeys.has(arg2))
    ) {
      itemKeys = ensureWorldItemsCached(
        collectVisibleLights().filter((itemKey) =>
          values.has(itemKey.itemKey),
        ),
      );
    }
    let flag = false;
    const now = performance.now();
    for (const [pairKey, item] of values) {
      if (
        getPreviewFloorMode() !== "all" &&
        item.floorId !== activeFloorId
      ) {
        continue;
      }
      const list = itemKeys.get(pairKey);
      if (list?.length) {
        for (const object3d of list) {
          const flag2 = lightTransitions.get(object3d);
          const curve = lightBrightnessCurve(
            item.item,
            item.previousBrightness,
          );
          const getResult =
            value.get(pairKey)?.includes(object3d) &&
            curve > 1e-7 &&
            object3d.userData.lightOnIntensity > 0
              ? object3d.userData.lightOnIntensity / curve
              : lightIntensityForItem(item.item);
          const slsV4 =
            getResult *
            lightBrightnessCurve(item.item, item.item.lightBrightness);
          const color = {
            intensity: item.isOn ? slsV4 : 0,
            color: new THREE.Color(
              lightEffectColorHex(item.item.lightTemperature),
            ).toArray(),
          };
          const isIntensity = flag2
            ? sampleLightTransition(flag2, now)
            : null;
          const local5 =
            !item.wasOn &&
            item.isOn &&
            (!isIntensity || isIntensity.intensity <= 0.000001)
              ? {
                  intensity: 0,
                  color: color.color,
                }
              : isIntensity || {
                  intensity: qualityReady
                    ? item.wasOn
                      ? getResult * curve
                      : 0
                    : object3d.intensity,
                  color: qualityReady
                    ? new THREE.Color(
                        lightEffectColorHex(item.previousKelvin),
                      ).toArray()
                    : object3d.color.toArray(),
                };
          object3d.userData.lightOnIntensity = slsV4;
          object3d.userData.lightBrightness =
            item.item.lightBrightness;
          const durationMs = lightTransitionDurationMs(
            item.wasOn,
            item.isOn,
            item.fadeDuration,
            {
              ...immediate2,
              immediate: immediate,
            },
          );
          const lightTransition = createLightTransition(
            local5,
            color,
            now,
            durationMs,
          );
          const visible = object3d.visible;
          applyLightObjectState(
            object3d,
            sampleLightTransition(lightTransition, now),
          );
          flag ||= visible !== object3d.visible;
          if (durationMs) {
            lightTransitions.set(object3d, lightTransition);
          } else {
            lightTransitions.delete(object3d);
          }
        }
      }
    }
    if (qualityReady) {
      syncLiveLights(now);
    }
    if (flag || qualityReady) {
      countShadowLights(worldGroup, {
        rebuildAtlas: false,
      });
    }
    setStageWarmup(lightTransitions.size > 0);
    updateLightPreview();
    if (!lightRafId) {
      if (lightTransitions.size) {
        lightRafId = requestAnimationFrame(onLightRaf);
      } else if (qualityReady) {
        idleTimerId = window.setTimeout(onIdleSettle, 100);
      }
    }
  }
  function syncViewportSize() {
    const el = selectEl("#preview-3d");
    const value = Math.max(el.clientWidth || 1, 1);
    const maxValue = Math.max(el.clientHeight || 1, 1);
    const svsV3 =
      value + "/" + maxValue + "/" + viewOffsetRatio + "/" + camera.uuid;
    if (svsV3 === viewportKey) {
      syncProjectionBlend();
      return;
    }
    viewportKey = svsV3;
    if (viewOffsetRatio) {
      camera.setViewOffset(
        value,
        maxValue,
        (value * viewOffsetRatio) / 2,
        0,
        value,
        maxValue,
      );
    } else {
      camera.clearViewOffset();
    }
    syncProjectionBlend();
  }
  function applyOrbitLimits() {
    orbitControls.enablePan = panEnabled;
    orbitControls.enableZoom = zoomEnabled;
    if (rotationMode === "horizontal") {
      orbitControls.minPolarAngle = orbitControls.maxPolarAngle =
        orbitControls.getPolarAngle();
    }
    if (rotationMode === "vertical") {
      orbitControls.minAzimuthAngle = orbitControls.maxAzimuthAngle =
        orbitControls.getAzimuthalAngle();
    }
  }
  function bindOrbitControls() {
    if (!focusTarget) {
      const bbox = computeWorldBoundingBox({
        excludeModelLayers: new Set(["items", "lights"]),
      });
      focusTarget = bbox.isEmpty()
        ? orbitControls.target.clone()
        : bbox.getCenter(new THREE.Vector3());
    }
    if (boundControls === orbitControls) {
      return;
    }
    const el = orbitControls;
    const view = camera;
    const boundUpdate = el.update.bind(el);
    boundControls = el;
    const drawPanel = () => {
      if (isCapturingFrame === captureToken) {
        if (idleTimerId !== null) {
          window.clearTimeout(idleTimerId);
        }
        idleTimerId = null;
        if (!orbitDragging) {
          idleTimerId = window.setTimeout(onIdleSettle, 180);
        }
      }
    };
    el.addEventListener("start", () => {
      if (!suppressOrbitBusy) {
        orbitDragging = true;
      }
    });
    el.addEventListener("change", () => {
      if (!suppressOrbitBusy) {
        if (
          orbitDragging &&
          isPreviewQualityReady() &&
          isCapturingFrame !== captureToken
        ) {
          rebuildLightWorldCache();
          syncLiveLights(performance.now());
          countShadowLights(worldGroup, {
            rebuildAtlas: false,
          });
        }
        drawPanel();
      }
    });
    el.addEventListener("end", () => {
      if (!suppressOrbitBusy) {
        orbitDragging = false;
        drawPanel();
      }
    });
    let enabled = el.enabled;
    Object.defineProperty(el, "enabled", {
      configurable: true,
      get: () => interactionEnabled && !suppressOrbitBusy && enabled,
      set: (arg) => {
        enabled = arg === true;
      },
    });
    Object.defineProperty(el, "enableRotate", {
      configurable: true,
      get: () => true,
      set() {},
    });
    el.update = (arg) => {
      if (suppressOrbitBusy) {
        return false;
      }
      const angleTo = view.quaternion.clone();
      const value = boundUpdate(arg);
      if (
        interactionEnabled &&
        angleTo.angleTo(view.quaternion) > 1e-7
      ) {
        const bocV2 = view.quaternion
          .clone()
          .multiply(angleTo.invert());
        const clone = focusTarget.clone().sub(el.target);
        const bocV3 = clone
          .clone()
          .sub(clone.applyQuaternion(bocV2));
        view.position.add(bocV3);
        el.target.add(bocV3);
        view.updateMatrixWorld();
        el.dispatchEvent({
          type: "change",
        });
        return true;
      }
      return value;
    };
  }
  function syncBackgroundVisibility() {
    if (trackedWorldGroup !== worldGroup || trackedFloorChild !== worldGroup?.children[0]) {
      trackedWorldGroup = worldGroup;
      trackedFloorChild = worldGroup?.children[0];
      backgroundObjects = [];
      worldGroup?.traverse((object3d) => {
        if (
          ["background", "grid"].includes(object3d.userData?.exportRole)
        ) {
          backgroundObjects.push(object3d);
        }
      });
    }
    for (const object3d of backgroundObjects) {
      object3d.visible = backgroundVisible;
    }
  }
  const onBeforeRender = previewScene.onBeforeRender;
  previewScene.onBeforeRender = function (...arg) {
    onBeforeRender?.apply(this, arg);
    syncBackgroundVisibility();
    syncViewportSize();
  };
  function recreateOrbitControls(arg = orbitControls.target.clone()) {
    const distanceTo = camera.position.clone();
    orbitControls.dispose();
    orbitControls = createOrbitControls(camera);
    camera.position.copy(distanceTo);
    orbitControls.target.copy(arg);
    const value = Math.max(
      distanceTo.distanceTo(arg),
      0.001,
    );
    const rocV2 = distanceTo
      .clone()
      .sub(arg)
      .normalize()
      .angleTo(camera.up);
    orbitControls.minDistance = Math.min(2, value);
    orbitControls.maxDistance = Math.max(100, value * 2);
    orbitControls.minZoom = Math.min(0.35, camera.zoom);
    orbitControls.maxZoom = Math.max(6, camera.zoom);
    orbitControls.maxPolarAngle = Math.max(
      Math.PI * 0.49,
      rocV2 + 0.00001,
    );
    orbitControls.enableRotate = true;
    orbitControls.enabled = interactionEnabled;
    orbitControls.update();
    applyOrbitLimits();
    bindOrbitControls();
  }
  return {
    onCameraChange(arg) {
      const domElement = renderer.domElement;
      domElement.addEventListener("hb-i3d-camera-frame", arg);
      return () =>
        domElement.removeEventListener("hb-i3d-camera-frame", arg);
    },
    createFrameLoop: (arg) => createDemandFrameLoop(arg),
    setPresentedVisible(arg) {
      renderer.domElement.dispatchEvent?.(
        new CustomEvent("hb-i3d-parent-visibility", {
          detail: arg === true,
        }),
      );
    },
    THREE: THREE,
    container: selectEl("#preview-3d"),
    canvas: renderer.domElement,
    get camera() {
      return camera;
    },
    get controls() {
      return orbitControls;
    },
    get document() {
      return projectDoc;
    },
    get defaults() {
      return DEFAULT_BASE_LIGHTING;
    },
    transformCamera(arg, arg3, arg2 = false) {
      return transformSceneCamera(
        arg,
        projectDoc,
        projectDoc,
        arg3,
        arg2,
      );
    },
    async readSceneUpdate(arg) {
      const params = new URLSearchParams(window.location.search);
      const params2 = new URLSearchParams({
        projectId: params.get("projectId") || "",
        since: hasProjectLoaded.syncKey || "",
      });
      const floor = await withRequestTimeout(
        15000,
        async (signal) => {
          const status = await fetch(
            "/api/v1/modules/interaction3d/scenes/" +
              encodeURIComponent(params.get("sceneId") || "") +
              "/current?" +
              params2,
            {
              credentials: "same-origin",
              signal: signal,
            },
          );
          if (status.status === 204) {
            return null;
          }
          if (!status.ok) {
            throw new Error("户型同步暂时不可用");
          }
          return status.json();
        },
        arg,
      );
      if (!floor) {
        return null;
      }
      const projectDoc2 = sceneUpdatePlan(
        normalizeProjectDocument(hasProjectLoaded.scene),
        normalizeProjectDocument(floor.scene),
      );
      if (!projectDoc2.full && !projectDoc2.floors.length) {
        const projectDoc3 = normalizeProjectDocument(floor.scene);
        projectDoc.baseLighting = projectDoc3.baseLighting;
        for (const floor2 of projectDoc3.floors) {
          const floorMatch = projectDoc.floors.find(
            (floor3) => floor3.id === floor2.id,
          );
          if (floorMatch) {
            floorMatch.name = floor2.name;
          }
        }
        if (projectDoc2.lighting && !hasBaseLighting) {
          applyBaseLighting(projectDoc3.baseLighting);
        }
        hasProjectLoaded = floor;
        return null;
      }
      return floor;
    },
    get savedScene() {
      return hasProjectLoaded;
    },
    async replaceScene(floor) {
      const projectDoc2 = normalizeProjectDocument(floor.scene);
      const projectDoc3 = sceneUpdatePlan(
        normalizeProjectDocument(hasProjectLoaded.scene),
        projectDoc2,
      );
      stopLightAnimation();
      presentedPromise = null;
      focusTarget = null;
      lightsConfigured = false;
      trackedWorldGroup = null;
      trackedFloorChild = null;
      if (!projectDoc3.full) {
        projectDoc2.activeFloorId = activeFloorId;
        projectDoc2.previewFloorMode = projectDoc.previewFloorMode;
        for (const floor2 of projectDoc2.floors) {
          floor2.scene.settings.livePreviewEnabled = true;
          const sourceFloor = projectDoc.floors.find(
            (floor3) => floor3.id === floor2.id,
          );
          if (
            sourceFloor &&
            !projectDoc3.floors.includes(floor2.id)
          ) {
            for (const lightGroup of floor2.scene.lightGroups) {
              const sourceGroup = sourceFloor.scene.lightGroups.find(
                (lightGroup2) => lightGroup2.id === lightGroup.id,
              );
              if (sourceGroup) {
                lightGroup.enabled = sourceGroup.enabled;
              }
            }
            for (const item of floor2.scene.items) {
              if (!lightItemTypes.has(item.type)) {
                continue;
              }
              const sourceItem = sourceFloor.scene.items.find(
                (item2) => item2.id === item.id,
              );
              if (sourceItem) {
                item.lightBrightness =
                  sourceItem.lightBrightness;
                item.lightTemperature =
                  sourceItem.lightTemperature;
              }
            }
          }
        }
        projectDoc = projectDoc2;
        hasProjectLoaded = floor;
        floorScene = activeFloor().scene;
        showOnlyFloorsById(new Set(projectDoc3.floors));
        Promise.allSettled(loadVisibleExternalModels());
        return;
      }
      await loadProjectDocument(floor);
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    },
    coverSceneUpdate() {
      const el = document.createElement("canvas");
      el.width = renderer.domElement.width;
      el.height = renderer.domElement.height;
      renderer.render(previewScene, camera);
      const drawImage = el.getContext("2d");
      drawImage.drawImage(renderer.domElement, 0, 0);
      if (!previewLightCache.hidden) {
        drawImage.drawImage(
          previewLightCache,
          0,
          0,
          el.width,
          el.height,
        );
      }
      const visibility = renderer.domElement.style.visibility;
      const visibility2 = previewLightCache.style.visibility;
      renderer.domElement.style.visibility = "hidden";
      previewLightCache.style.visibility = "hidden";
      Object.assign(el.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        zIndex: "6",
        pointerEvents: "auto",
      });
      el.setAttribute("aria-label", "正在同步户型");
      selectEl("#preview-3d").append(el);
      return () => {
        renderer.domElement.style.visibility = visibility;
        previewLightCache.style.visibility = visibility2;
        el.remove();
      };
    },
    setOrbitPivot(flag) {
      focusTarget = flag
        ? new THREE.Vector3().fromArray(flag)
        : null;
      bindOrbitControls();
    },
    orbitCameraPose(view, arg) {
      const nextView = structuredClone(view);
      const angle = finite(arg, 0) % (Math.PI * 2);
      if (
        Math.abs(angle) < 1e-12 ||
        Math.abs(Math.abs(angle) - Math.PI * 2) < 1e-12
      ) {
        return nextView;
      }
      if (!focusTarget) {
        const bbox = computeWorldBoundingBox({
          excludeModelLayers: new Set(["items", "lights"]),
        });
        focusTarget = bbox.isEmpty()
          ? new THREE.Vector3().fromArray(view.target)
          : bbox.getCenter(new THREE.Vector3());
      }
      const value = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle,
      );
      for (const tupleItem of ["position", "target"]) {
        nextView[tupleItem] = new THREE.Vector3()
          .fromArray(view[tupleItem])
          .sub(focusTarget)
          .applyQuaternion(value)
          .add(focusTarget)
          .toArray();
      }
      let vec3 = new THREE.Vector3().fromArray(
        view.up || [0, 1, 0],
      );
      const vector3 = new THREE.Vector3()
        .fromArray(view.position)
        .sub(new THREE.Vector3().fromArray(view.target));
      if (
        vec3.lengthSq() < 1e-12 ||
        vec3.clone().cross(vector3).lengthSq() < 1e-12
      ) {
        const degToRadResult = THREE.MathUtils.degToRad(
          finite(view.topRotation, 0),
        );
        vec3 = new THREE.Vector3(
          Math.sin(degToRadResult),
          0,
          -Math.cos(degToRadResult),
        );
        if (vec3.clone().cross(vector3).lengthSq() < 1e-12) {
          vec3.set(1, 0, 0);
        }
      }
      nextView.up = vec3
        .applyQuaternion(value)
        .toArray();
      return nextView;
    },
    setFocusViewport(arg) {
      const n = clamp(finite(arg, 0), 0, 0.7);
      if (n !== viewOffsetRatio) {
        viewOffsetRatio = n;
        syncViewportSize();
        requestRender({
          preserveLightCache: false,
        });
      }
    },
    beginCameraMotion(value, flag) {
      const mode = this.cameraState();
      const flag2 =
        flag && (viewBlend || mode.mode !== value);
      const fromHeight = flag2
        ? (viewBlend?.height ?? resetOrbitTarget(camera, orbitControls.target))
        : 0;
      const fromWeight =
        viewBlend?.weight ?? (mode.mode === "perspective" ? 1 : 0);
      viewBlend = null;
      suppressOrbitBusy = true;
      orbitDragging = false;
      if (isPreviewQualityReady()) {
        rebuildLightWorldCache();
        syncLiveLights(performance.now());
        countShadowLights(worldGroup, {
          rebuildAtlas: false,
        });
        updateLightPreview();
      }
      setCameraProjectionMode(value, {
        preserveView: true,
        deferControlUpdate: true,
      });
      recreateOrbitControls();
      bindOrbitControls();
      lockPreviewOrbit();
      if (flag2) {
        viewBlend = {
          fromHeight: fromHeight,
          toHeight: visibleHeightForView(flag),
          height: fromHeight,
          fromWeight: fromWeight,
          toWeight: value === "perspective" ? 1 : 0,
          weight: fromWeight,
        };
        return mode;
      } else {
        return this.cameraState();
      }
    },
    applyCameraFrame(arg, arg3, arg2) {
      const n = clamp(finite(arg2, 0), 0, 0.7);
      const value = n === viewOffsetRatio;
      viewOffsetRatio = n;
      this.applyCameraPose(arg, arg3, value);
    },
    applyCameraPose(view, arg = 1, preserveLightCache = true) {
      if (viewBlend) {
        if (arg >= 1) {
          viewBlend = null;
        } else {
          viewBlend.height =
            viewBlend.fromHeight +
            (viewBlend.toHeight - viewBlend.fromHeight) * arg;
          viewBlend.weight =
            viewBlend.fromWeight +
            (viewBlend.toWeight - viewBlend.fromWeight) * arg;
        }
      }
      softLockPreviewOrbit();
      const cameraSettings = activeCameraSettings();
      cameraSettings.cameraView = view.view || "free";
      cameraSettings.cameraTopRotation = view.topRotation || 0;
      cameraSettings.cameraFocalLength = view.focalLength || 50;
      camera.position.fromArray(view.position);
      orbitControls.target.fromArray(view.target);
      camera.up.fromArray(view.up || [0, 1, 0]);
      camera.zoom = view.zoom;
      camera.userData.frameSize = view.frameSize || 10;
      camera.userData.cameraView = cameraSettings.cameraView;
      camera.userData.topRotation = cameraSettings.cameraTopRotation;
      if (camera.isOrthographicCamera) {
        focusCameraOnPoint(
          camera.userData.frameSize,
          camera.userData.viewportAspect || 1,
        );
      } else {
        applyCameraFocalLength();
      }
      camera.lookAt(orbitControls.target);
      getCameraPose(camera, orbitControls.target);
      camera.updateMatrixWorld();
      syncViewportSize();
      requestRender({
        preserveLightCache: preserveLightCache,
      });
    },
    endCameraMotion() {
      suppressOrbitBusy = false;
      recreateOrbitControls();
      unlockPreviewOrbit();
      requestRender();
      if (
        typeof isCapturingFrame !== "undefined" &&
        isCapturingFrame === captureToken &&
        !lightTransitions.size
      ) {
        if (idleTimerId !== null) {
          window.clearTimeout(idleTimerId);
        }
        idleTimerId = window.setTimeout(onIdleSettle, 180);
      }
    },
    appearance(baseLighting2) {
      hasBaseLighting = !!baseLighting2.baseLighting;
      const n = clamp(
        finite(baseLighting2.renderScale, 1),
        0.25,
        2,
      );
      if (n !== studioPixelRatio) {
        studioPixelRatio = n;
        renderer.setPixelRatio(computeStudioPixelRatio());
        onPreviewContainerResize();
        requestRender();
      }
      const flag =
        backgroundVisible !== (baseLighting2.backgroundVisible !== false);
      backgroundVisible = baseLighting2.backgroundVisible !== false;
      document.body.classList.toggle("is-background-hidden", !backgroundVisible);
      syncBackgroundVisibility();
      const normalizeBaseLighting2 = normalizeBaseLighting(
        baseLighting2.baseLighting || projectDoc.baseLighting,
      );
      if (
        JSON.stringify(normalizeBaseLighting2) !==
        JSON.stringify(baseLighting)
      ) {
        applyBaseLighting(normalizeBaseLighting2);
      }
      if (flag) {
        requestRender();
      }
    },
    setFloor(arg) {
      const id =
        projectDoc.floors.find((floor) => floor.id === arg) ||
        projectDoc.floors[0];
      const value =
        arg === "all" && projectDoc.floors.length > 1 ? "all" : "active";
      if (
        activeFloorId !== id.id ||
        getPreviewFloorMode() !== value
      ) {
        if (
          lightTransitions.size ||
          (typeof isCapturingFrame !== "undefined" &&
            isCapturingFrame === captureToken)
        ) {
          stopLightAnimation();
        }
        lightsConfigured = false;
        activeFloorId = id.id;
        projectDoc.activeFloorId = id.id;
        floorScene = id.scene;
        setPreviewFloorMode(arg === "all" ? "all" : "active", {
          persist: false,
        });
        focusTarget = null;
      }
    },
    worldPoint(arg, x, y, arg2 = 0.1) {
      const floor = projectDoc.floors.find(
        (floor2) => floor2.id === arg,
      );
      if (!floor) {
        return null;
      }
      const value = floor.scene.calibration?.pixelsPerMeter || 1;
      if (getPreviewFloorMode() === "all") {
        const indexOf = [...projectDoc.floors].sort(
          (elevation, elevation2) =>
            elevation.elevation - elevation2.elevation,
        );
        const worldPoint = planPointToWorldXZ(floor, {
          x: x,
          y: y,
        });
        return new THREE.Vector3(
          worldPoint.x,
          indexOf.indexOf(floor) * projectDoc.previewFloorGap +
            arg2,
          worldPoint.z,
        );
      }
      const local2 = floorScene;
      floorScene = floor.scene;
      const activeFloorContentBoundsResult = activeFloorContentBounds();
      floorScene = local2;
      return new THREE.Vector3(
        (x - (activeFloorContentBoundsResult.minX + activeFloorContentBoundsResult.maxX) / 2) / value,
        arg2,
        (y - (activeFloorContentBoundsResult.minY + activeFloorContentBoundsResult.maxY) / 2) / value,
      );
    },
    setLightStates: setLightStates,
    mapLightEffectState: (arg) => mapLightEffectState(arg),
    lightEffectColorHex: (arg) => lightEffectColorHex(arg),
    cameraState(flag = false) {
      if (flag) {
        recreateOrbitControls();
      }
      return {
        position: camera.position.toArray(),
        target: orbitControls.target.toArray(),
        zoom: camera.zoom,
        mode: camera.isPerspectiveCamera ? "perspective" : "orthographic",
        up: camera.up.toArray(),
        frameSize: camera.userData.frameSize || 10,
        view: cameraViewMode(),
        topRotation: topViewRotation(),
        focalLength: getCameraFocalLength(),
      };
    },
    setCameraProjection(arg) {
      activeCameraSettings().cameraMode =
        arg === "perspective" ? "perspective" : "orthographic";
      setCameraProjectionMode(activeCameraSettings().cameraMode, {
        preserveView: true,
        deferControlUpdate: true,
      });
      recreateOrbitControls();
    },
    setCameraFocalLength(arg) {
      activeCameraSettings().cameraFocalLength = clamp(
        finite(arg, 50),
        18,
        120,
      );
      applyCameraFocalLength();
      requestRender();
    },
    setCameraInteraction(rotationMode = {}) {
      const rotationMode2 = ["horizontal", "vertical"].includes(
        rotationMode.rotationMode,
      )
        ? rotationMode.rotationMode
        : "free";
      const value = rotationMode.enabled === true;
      const local2 = rotationMode.panEnabled !== false;
      const local3 = rotationMode.zoomEnabled !== false;
      const flag =
        interactionEnabled !== value ||
        rotationMode !== rotationMode2 ||
        panEnabled !== local2 ||
        zoomEnabled !== local3;
      interactionEnabled = value;
      rotationMode = rotationMode2;
      panEnabled = local2;
      zoomEnabled = local3;
      if (flag) {
        recreateOrbitControls();
      } else {
        orbitControls.enabled = value;
      }
      bindOrbitControls();
    },
    whenPresented() {
      presentedPromise ||= (async () => {
        const modelLoads = loadVisibleExternalModels();
        let value;
        try {
          await Promise.race([
            Promise.allSettled(modelLoads),
            new Promise((arg) => {
              value = window.setTimeout(arg, 8000);
            }),
          ]);
        } finally {
          window.clearTimeout(value);
        }
        refreshStudioChrome();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        syncBackgroundVisibility();
        scheduleAdaptiveQuality(0);
        const nowResult = performance.now() + 1800;
        while (
          (!lightCacheReady ||
            previewQualityJustBecameReady ||
            previewLightCache.hidden) &&
          performance.now() < nowResult
        ) {
          await new Promise(requestAnimationFrame);
        }
        renderer.render(previewScene, camera);
        await new Promise(requestAnimationFrame);
      })();
      return presentedPromise;
    },
    setCameraView(arg) {
      activeCameraSettings().cameraView = arg === "top" ? "top" : "free";
      nudgeCamera(activeCameraSettings().cameraView, {
        force: true,
      });
    },
    restoreCamera(isMode) {
      viewBlend = null;
      if (!isMode) {
        applyCameraView();
        recreateOrbitControls();
        return;
      }
      const cameraSettings = activeCameraSettings();
      cameraSettings.cameraMode = isMode.mode;
      cameraSettings.cameraView = isMode.view || "free";
      cameraSettings.cameraTopRotation = isMode.topRotation || 0;
      cameraSettings.cameraFocalLength = isMode.focalLength || 50;
      setCameraProjectionMode(isMode.mode, {
        preserveView: false,
      });
      camera.position.fromArray(isMode.position);
      if (isMode.up) {
        camera.up.fromArray(isMode.up);
      }
      orbitControls.target.fromArray(isMode.target);
      camera.zoom = isMode.zoom;
      if (isMode.frameSize) {
        camera.userData.frameSize = isMode.frameSize;
      }
      camera.userData.cameraView = cameraSettings.cameraView;
      camera.userData.topRotation = cameraSettings.cameraTopRotation;
      getCameraPose(camera, orbitControls.target);
      onPreviewContainerResize();
      recreateOrbitControls(orbitControls.target.clone());
      requestRender();
    },
    topView() {
      nudgeCamera("top", {
        force: true,
      });
    },
  };
}
bootstrapStudioApp();
