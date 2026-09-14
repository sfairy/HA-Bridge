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
import { createExternalModelManager, ALL_ITEM_MODELS } from "./studio-external-models.js?v=20260904-studio-external-models-v48-load-state-20260905-client-log-v1-20260907-cache-representation-v1-20260908-curtains-v1-20260908-bed-base-v1-20260910-glasscabinet-back-v1-20260912-bed-geometry-revision-v1-20260913-pillar-shapes-v2";
import { createPlanDrawingTools, drawTrackedText } from "./studio-plan-drawing.js?v=20260901-studio-plan-drawing-v2";
import { createSpotShadowAtlasController } from "./studio-shadow-atlas.js?v=20260912-shadow-atlas-skip-unbakeable-v2";
import { createRegionLightController } from "./studio-plan2-region-lights.js?v=20260909-reflection-scope-v1-20260913-region-lights-map-shadow-v1";
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
  report: lightCacheStats => {
    document.documentElement.dataset.lightRenderCache = JSON.stringify(lightCacheStats);
  }
}) : null;
window.addEventListener("pagehide", () => cache?.close(), {
  once: true
});
function computeLightRenderCacheKey(width, height) {
  const floors = getPreviewFloorModeCurrent() === "all" ? projectDocCurrent.floors : [activeFloor()];
  cameraCurrent.updateMatrixWorld();
  const roundMatrix = matrixElements => matrixElements.map(component => Math.round(component * 100000000) / 100000000);
  const layerVisibility = [];
  worldGroup.traverse(node => {
    if (["background", "grid"].includes(node.userData?.exportRole)) {
      layerVisibility.push([node.userData.exportRole, node.visible]);
    }
  });
  return sha256(stableCacheJSON({
    version: RENDER_CACHE_VERSION,
    scene: cacheSceneDescriptor(floors),
    mode: getPreviewFloorModeCurrent(),
    gap: projectDocCurrent.previewFloorGap,
    lighting: baseLighting,
    style: themeColors,
    visibility: layerVisibility,
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
const wallApplyPropertyEls = [...document.querySelectorAll("[data-apply-wall-property]")];
const wallPropertyApplyDialog = selectEl("#wall-property-apply-dialog");
const wallPropertyApplyForm = selectEl("#wall-property-apply-form");
const wallPropertyTargetList = selectEl("#wall-property-target-list");
const wallPropertySelectionCount = selectEl("#wall-property-selection-count");
const wallPropertyToggleAll = selectEl("#wall-property-toggle-all");
const wallPropertyApplyTitle = selectEl("#wall-property-apply-title");
const wallPropertyApplyValue = selectEl("#wall-property-apply-value");
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
const muralStyleField = selectEl("#mural-style-field");
const featureWallStyleField = selectEl("#feature-wall-style-field");
const pillarShapeField = selectEl("#pillar-shape-field");
const pillarAxisField = selectEl("#pillar-axis-field");
const stripAxisField = selectEl("#strip-axis-field");
const itemHeightLabel = selectEl("#item-height-label");
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
const lightLayerActions = selectEl("#light-layer-actions");
const Tg = selectEl("#add-light-group");
const fridgeSize = selectEl("#light-groups-off");
const lightGroupContextMenu = selectEl("#light-group-context-menu");
const areaContextMenu = selectEl("#area-context-menu");
const addAreaButton = selectEl("#add-area");
const areaRenameDialog = selectEl("#area-rename-dialog");
const areaRenameForm = selectEl("#area-rename-form");
const areaRenameTitle = selectEl("#area-rename-title");
const areaRenameInput = selectEl("#area-rename-input");
const lightGroupAreaDialog = selectEl("#light-group-area-dialog");
const lightGroupAreaForm = selectEl("#light-group-area-form");
const lightGroupAreaName = selectEl("#light-group-area-name");
const lightGroupAreaSelect = selectEl("#light-group-area-select");
const lightGroupAreaNewName = selectEl("#light-group-area-new-name");
const lightGroupAreaCreate = selectEl("#light-group-area-create");
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
  mural: {
    name: "壁画",
    glyph: "❐",
    width: 1.2,
    depth: 0.1,
    height: 0.8,
    elevation: 0.9,
    color: "#8d7b62",
    muralStyle: "bauhaus"
  },
  featurewall: {
    name: "背景墙",
    glyph: "❏",
    width: 3,
    depth: 0.1,
    height: 2.4,
    elevation: 0,
    color: "#c4bcae",
    wallStyle: "marble"
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
    color: "#9099aa",
    pillarShape: "square",
    pillarAxis: "vertical"
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
    color: "#d4dbe2",
    stripAxis: "horizontal"
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
const meshMergeAllowlist = new Set();
// NOTE: meshMergeAllowlist is intentionally empty, so mergeSimilarItemMeshes() currently returns
// immediately at every call site: the mesh-dedup pass is disabled, not merely a no-op for some
// types. Re-enable it by listing the item types whose meshes are known to be safe to share
// (skipInstanceMergeTypes lists the ones that are explicitly not), or delete the function.
const stripLightHelperTypes = new Set(["coffeetable", "squarecoffeetable", "tvstand", "plant", "bed", "nightstand", "curtain", "vanity", "desk", "bookcase", "piano", "table", "rounddiningtable", "rounddiningtableturntable", "bar", "sideboard", "shoecabinet", "chair", "cabinet", "glasscabinet", "shelf", "wallcabinet", "kitchenbase", "kitchensink", "kitchencooktop", "fridge", "washer", "dryer", "dishwasher", "steamoven", "microwave", "ricecooker", "rangehood", "wallac", "floorac", "nas", "airpurifier", "tv", "desktop", "laptop", "toilet", "squattoilet", "urinal", "bathtub", "shower", "basin"]);
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
  pan: ["平移画布", "按住左键拖动即可平移画布；滚轮缩放；中键或按住空格拖动同样可平移"],
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
let currentStudioDocument = null;
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
let areaContextMenuId = "";
let areaRenameMode = "create";
let areaRenameId = "";
let areaAssignGroupId = "";
const expandedAreaIds = new Set();
let _a = "";
let draggingLightGroupId = "";
let draggingFloorId = "";
let Dr = null;
let wallApplyState = null;
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
    areas: [],
    lightGroups: [{
      id: "light-group-default",
      name: "默认灯组",
      enabled: true,
      areaId: null
    }],
    items: []
  };
}
function defaultFloorChineseName(floorIndex) {
  return ["一层", "二层", "三层", "四层", "五层", "六层", "七层", "八层", "九层", "十层"][floorIndex] || floorIndex + 1 + "层";
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
  const rawFloors = Array.isArray(projectDoc?.floors) ? projectDoc.floors : null;
  const floors = rawFloors?.length ? rawFloors.map((floor, floorIndex) => {
    const scene = normalizeFloorScene(floor?.scene);
    const originInitialized = floor?.originInitialized === true;
    const rawFloorName = normalizeLabelText(floor?.name, defaultFloorChineseName(floorIndex), 24);
    const name = rawFloorName === floorIndex + 1 + "层" ? defaultFloorChineseName(floorIndex) : rawFloorName;
    return {
      id: String(floor?.id || makeId("floor")),
      name,
      elevation: clamp(finite(floor?.elevation, floorIndex * 3), -30, 120),
      offsetX: clamp(finite(floor?.offsetX, 0), -100, 100),
      offsetZ: clamp(finite(floor?.offsetZ, 0), -100, 100),
      rotation: clamp(finite(floor?.rotation, 0), -180, 180),
      originX: originInitialized ? finite(floor?.originX, 0) : scene.background?.width ? scene.background.width / 2 : 0,
      originY: originInitialized ? finite(floor?.originY, 0) : scene.background?.height ? scene.background.height / 2 : 0,
      originInitialized: originInitialized || !!scene.background,
      aligned: floorIndex === 0 || floor?.aligned === true || Math.abs(finite(floor?.offsetX, 0)) > 0.000001 || Math.abs(finite(floor?.offsetZ, 0)) > 0.000001,
      alignmentPending: floor?.alignmentPending === true,
      scene
    };
  }) : [createFloorEntry(0, projectDoc)];
  const requestedActiveFloorId = String(projectDoc?.activeFloorId || "");
  const activeFloorEntry = floors.find(item => item.id === requestedActiveFloorId) || floors[0];
  const baselineHeight = clamp(finite(projectDoc?.defaultFloorHeight, 3), 0, 20);
  const hasFloorGapSchema = finite(projectDoc?.schemaVersion, 0) >= 6;
  const exportPresets = normalizeExportPresetSlots(projectDoc?.exportPresets);
  return {
    schemaVersion: 7,
    activeFloorId: activeFloorEntry.id,
    defaultFloorHeight: clamp(finite(projectDoc?.defaultFloorHeight, 3), 1.8, 8),
    previewFloorGap: clamp(hasFloorGapSchema ? finite(projectDoc?.previewFloorGap, 3) : baselineHeight + finite(projectDoc?.previewFloorGap, 0), 0, 20),
    exportFloorGap: clamp(hasFloorGapSchema ? finite(projectDoc?.exportFloorGap, 3) : baselineHeight + finite(projectDoc?.exportFloorGap, 0), 0, 20),
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
  const doomedFloor = projectDocCurrent.floors.find(id => id.id === pendingDeleteFloorId);
  closeFloorDeleteDialog();
  if (!doomedFloor || projectDocCurrent.floors.length <= 1) {
    return;
  }
  const removedIndex = projectDocCurrent.floors.findIndex(id => id.id === doomedFloor.id);
  projectDocCurrent.floors.splice(removedIndex, 1);
  projectDocCurrent.floors.forEach((elevation, floorIndex) => {
    elevation.elevation = floorIndex * projectDocCurrent.defaultFloorHeight;
  });
  const nextActiveFloor = projectDocCurrent.floors[Math.max(0, removedIndex - 1)] || projectDocCurrent.floors[0];
  await switchActiveFloor(nextActiveFloor.id, {
    persist: false
  });
  syncPreviewFloorButtons();
  scheduleSave();
  showToast("已删除“" + doomedFloor.name + "”。", "success");
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
  const areas = [];
  const areaIds = new Set();
  if (Array.isArray(scene.areas)) {
    for (const area of scene.areas) {
      const areaId = String(area?.id || makeId("area"));
      if (!areaIds.has(areaId)) {
        areaIds.add(areaId);
        areas.push({
          id: areaId,
          name: normalizeLabelText(area?.name, "区域 " + (areas.length + 1), 16)
        });
      }
    }
  }
  const lightGroups = [];
  const lightGroupIds = new Set();
  if (Array.isArray(scene.lightGroups)) {
    for (const lightGroup of scene.lightGroups) {
      const groupId = String(lightGroup?.id || makeId("light-group"));
      if (!lightGroupIds.has(groupId)) {
        lightGroupIds.add(groupId);
        const areaId = String(lightGroup?.areaId || "");
        lightGroups.push({
          id: groupId,
          name: normalizeLabelText(lightGroup?.name, "灯组 " + (lightGroups.length + 1), 24),
          enabled: lightGroup?.enabled !== false,
          areaId: areaIds.has(areaId) ? areaId : null
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
      enabled: true,
      areaId: null
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
      ...(item?.type === "mural" ? {
        muralStyle: normalizeMuralArtStyle(item?.muralStyle)
      } : {}),
      ...(item?.type === "featurewall" ? {
        wallStyle: normalizeFeatureWallStyle(item?.wallStyle)
      } : {}),
      ...(item?.type === "pillar" ? {
        pillarShape: normalizePillarShape(item?.pillarShape),
        pillarAxis: normalizePillarAxis(item?.pillarAxis)
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
          stripAxis: normalizeStripAxis(item?.stripAxis),
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
    areas,
    lightGroups,
    items
  };
}
function makeId(prefix) {
  const randomSuffix = globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  return prefix + "-" + randomSuffix;
}
function cloneFloorScene(scene = floorSceneCurrent) {
  return structuredClone(scene);
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
function floorScopedKey(floorId, keySuffix) {
  return floorId + ":" + keySuffix;
}
function layerScopedKey(layerId, keySuffix) {
  return (layerId || "floor") + ":" + keySuffix;
}
function previewScopedItemKey(floorId, itemKey) {
  if (getPreviewFloorModeCurrent() === "all") {
    return floorScopedKey(floorId, itemKey);
  } else {
    return itemKey;
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
function ensureTvScreenLayerNames(items) {
  const idSet = new Set(tvItemsOnFloor().map(screenLayerName => screenLayerName.screenLayerName));
  let layerNumber = 1;
  for (const screenLayerName of items) {
    if (screenLayerName.type === "tv") {
      while (idSet.has("电视画面 " + layerNumber)) {
        layerNumber += 1;
      }
      screenLayerName.screenLayerName = "电视画面 " + layerNumber;
      screenLayerName.screenEnabled = screenLayerName.screenEnabled !== false;
      idSet.add(screenLayerName.screenLayerName);
      layerNumber += 1;
    }
  }
}
function ensureSmallCarChargingLayerNames(items) {
  const idSet = new Set(smallCarItemsOnFloor().map(chargingLayerName => chargingLayerName.chargingLayerName));
  let layerNumber = 1;
  for (const chargingLayerName of items) {
    if (chargingLayerName.type === "smallcar") {
      while (idSet.has("汽车充电 " + layerNumber)) {
        layerNumber += 1;
      }
      chargingLayerName.chargingLayerName = "汽车充电 " + layerNumber;
      chargingLayerName.chargingEnabled = chargingLayerName.chargingEnabled === true;
      idSet.add(chargingLayerName.chargingLayerName);
      layerNumber += 1;
    }
  }
}
function ensureItemLayerNames(scene) {
  ensureTvScreenLayerNames(scene);
  ensureSmallCarChargingLayerNames(scene);
}
function ensureDefaultLightGroup() {
  const list = floorSceneCurrent.lightGroups ||= [];
  if (!list.length) {
    list.push({
      id: makeId("light-group"),
      name: "默认灯组",
      enabled: true,
      areaId: null
    });
  }
  if (!list.some(item => item.id === on)) {
    on = list[0].id;
  }
  return list.find(item => item.id === on) || list[0];
}
function syncLightGroupSelect(lightGroup) {
  const groupSelect = selectEl("#light-group");
  groupSelect.replaceChildren();
  for (const group of floorSceneCurrent.lightGroups || []) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    groupSelect.append(option);
  }
  groupSelect.value = resolveLightGroup(lightGroup)?.id || ensureDefaultLightGroup().id;
  syncStudioSelect(groupSelect);
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
  lightGroupContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 148) + "px";
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
function uniqueLightGroupName(candidate) {
  const existingNames = new Set(floorSceneCurrent.lightGroups.map(entry => entry.name));
  if (!existingNames.has(candidate)) {
    return candidate;
  }
  let suffix = 2;
  while (existingNames.has(candidate + " " + suffix)) {
    suffix += 1;
  }
  return candidate + " " + suffix;
}
function duplicateLightGroup(lightGroup) {
  if (!lightGroup) {
    return;
  }
  pushHistory();
  const duplicateGroup = {
    ...structuredClone(lightGroup),
    id: makeId("light-group"),
    name: uniqueLightGroupName(lightGroup.name + " 副本")
  };
  const sourceIndex = floorSceneCurrent.lightGroups.findIndex(item => item.id === lightGroup.id);
  floorSceneCurrent.lightGroups.splice(sourceIndex + 1, 0, duplicateGroup);
  const duplicatedItems = floorSceneCurrent.items.filter(item => set.has(item.type) && item.lightGroupId === lightGroup.id).map(sourceItem => ({
    ...structuredClone(sourceItem),
    id: makeId("item"),
    lightGroupId: duplicateGroup.id
  }));
  floorSceneCurrent.items.push(...duplicatedItems);
  on = duplicateGroup.id;
  selection = duplicatedItems.length === 1 ? {
    kind: "item",
    id: duplicatedItems[0].id
  } : null;
  multiSelection = duplicatedItems.length > 1 ? duplicatedItems.map(entry => ({
    kind: "item",
    id: entry.id
  })) : [];
  renderLightLayerPanel();
  refreshViews("lights");
  scheduleSave();
  showToast("已复制“" + lightGroup.name + "”及组内 " + duplicatedItems.length + " 盏灯。", "success");
}
function clearLightGroupDropIndicators() {
  for (const element of lightGroupList.querySelectorAll(".light-group-row")) {
    element.classList.remove("drop-before", "drop-after");
    delete element.dataset.dropPosition;
  }
  for (const element of lightGroupList.querySelectorAll(".light-area-row")) {
    element.classList.remove("drop-into");
  }
}
function moveLightGroupToArea(sourceId, targetAreaId, targetGroupId = null, placeAfter = false) {
  const list = floorSceneCurrent.lightGroups || [];
  const moved = list.find(item => item.id === sourceId);
  if (!moved) {
    return;
  }
  const nextAreaId = targetAreaId || null;
  const areaChanged = (moved.areaId || null) !== nextAreaId;
  let nextOrder = list;
  if (targetGroupId) {
    const without = list.filter(item => item.id !== sourceId);
    const anchorIndex = without.findIndex(item => item.id === targetGroupId);
    if (anchorIndex >= 0) {
      nextOrder = [...without];
      nextOrder.splice(anchorIndex + (placeAfter ? 1 : 0), 0, moved);
    }
  }
  const orderChanged = nextOrder.some((id, index) => id.id !== list[index]?.id);
  if (!areaChanged && !orderChanged) {
    return;
  }
  pushHistory();
  moved.areaId = nextAreaId;
  if (orderChanged) {
    floorSceneCurrent.lightGroups = nextOrder;
  }
  if (nextAreaId) {
    expandedAreaIds.add(nextAreaId);
  }
  renderLightLayerPanel();
  updateSelectionInspector();
  scheduleSave();
}
function createLightGroupRow(lightGroup) {
  const row = document.createElement("div");
  row.className = "light-group-row" + (lightGroup.id === on ? " active" : "");
  row.dataset.lightGroupId = lightGroup.id;
  row.dataset.lightGroupAreaId = lightGroup.areaId || "";
  row.draggable = true;
      row.setAttribute("aria-label", lightGroup.name + "，拖动可排序或移入区域，右键可设置区域、重命名、复制或删除");
      row.addEventListener("dragstart", event => {
        draggingLightGroupId = lightGroup.id;
        row.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-ha-bridge-light-group", lightGroup.id);
      });
      row.addEventListener("dragend", () => {
        draggingLightGroupId = "";
        row.classList.remove("dragging");
        clearLightGroupDropIndicators();
      });
      row.addEventListener("click", () => {
        on = lightGroup.id;
        renderLightLayerPanel();
      });
      row.addEventListener("contextmenu", event => {
        event.preventDefault();
        showLightGroupContextMenu(lightGroup, event);
      });
      row.addEventListener("dragover", event => {
        if (!draggingLightGroupId || draggingLightGroupId === lightGroup.id) {
          return;
        }
        event.preventDefault();
        clearLightGroupDropIndicators();
        const dropAfter = event.clientY >= row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
        row.dataset.dropPosition = dropAfter ? "after" : "before";
        row.classList.add(dropAfter ? "drop-after" : "drop-before");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = "move";
        }
      });
      row.addEventListener("drop", event => {
        if (!draggingLightGroupId || draggingLightGroupId === lightGroup.id) {
          return;
        }
        event.preventDefault();
        const sourceGroupId = draggingLightGroupId;
        const placeAfter = row.dataset.dropPosition === "after";
        draggingLightGroupId = "";
        clearLightGroupDropIndicators();
        moveLightGroupToArea(sourceGroupId, lightGroup.areaId || null, lightGroup.id, placeAfter);
      });
      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = lightGroup.enabled ? "on" : "";
      toggleButton.textContent = lightGroup.enabled ? "◉" : "○";
      toggleButton.title = lightGroup.enabled ? "关闭这个灯组" : "开启这个灯组";
      toggleButton.addEventListener("click", event => {
        event.stopPropagation();
        pushHistory();
        lightGroup.enabled = !lightGroup.enabled;
        requestLightGroupCacheRefresh([lightGroup.id]);
        scheduleSave();
      });
      const nameLabel = document.createElement("span");
      nameLabel.className = "light-group-name";
      nameLabel.textContent = lightGroup.name;
      nameLabel.title = "拖动可排序或移入区域，右键可设置区域、重命名、复制或删除";
      const itemCount = document.createElement("small");
      itemCount.textContent = String(floorSceneCurrent.items.filter(item => set.has(item.type) && item.lightGroupId === lightGroup.id).length);
      row.append(toggleButton, nameLabel, itemCount);
  return row;
}
function createAreaSection(area, members) {
  const expanded = expandedAreaIds.has(area.id);
  const section = document.createElement("div");
  section.className = "light-area-section";
  section.dataset.areaId = area.id;
  const header = document.createElement("div");
  header.className = "light-area-row" + (expanded ? " expanded" : "");
  header.setAttribute("aria-label", area.name + "，单击展开或收起，右键可重命名或删除");
  const caret = document.createElement("button");
  caret.type = "button";
  caret.className = "light-area-caret";
  caret.textContent = expanded ? "▾" : "▸";
  caret.title = expanded ? "收起区域" : "展开区域";
  caret.addEventListener("click", event => {
    event.stopPropagation();
    toggleAreaExpanded(area.id);
  });
  header.addEventListener("dragover", event => {
    if (!draggingLightGroupId) {
      return;
    }
    const dragged = (floorSceneCurrent.lightGroups || []).find(item => item.id === draggingLightGroupId);
    if (!dragged) {
      return;
    }
    event.preventDefault();
    clearLightGroupDropIndicators();
    if ((dragged.areaId || null) !== area.id) {
      header.classList.add("drop-into");
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  });
  header.addEventListener("dragleave", event => {
    if (!header.contains(event.relatedTarget)) {
      header.classList.remove("drop-into");
    }
  });
  header.addEventListener("drop", event => {
    if (!draggingLightGroupId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const sourceId = draggingLightGroupId;
    draggingLightGroupId = "";
    clearLightGroupDropIndicators();
    moveLightGroupToArea(sourceId, area.id);
  });
  const name = document.createElement("span");
  name.className = "light-area-name";
  name.textContent = area.name;
  const count = document.createElement("small");
  count.textContent = String(members.length);
  header.append(caret, name, count);
  header.addEventListener("click", () => toggleAreaExpanded(area.id));
  header.addEventListener("contextmenu", event => {
    event.preventDefault();
    showAreaContextMenu(area, event);
  });
  section.append(header);
  if (expanded) {
    if (!members.length) {
      const empty = document.createElement("div");
      empty.className = "light-area-empty";
      empty.textContent = "暂无灯组";
      section.append(empty);
    } else {
      const container = document.createElement("div");
      container.className = "light-area-groups";
      for (const member of members) {
        container.append(createLightGroupRow(member));
      }
      section.append(container);
    }
  }
  return section;
}
function toggleAreaExpanded(areaId) {
  if (expandedAreaIds.has(areaId)) {
    expandedAreaIds.delete(areaId);
  } else {
    expandedAreaIds.add(areaId);
  }
  renderLightLayerPanel();
}
function createTvScreenLayerRow(value, screenEnabled) {
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
  return el;
}
function createCarChargingLayerRow(value, chargingEnabled) {
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
  return el;
}
function renderLightLayerPanel() {
  const tvScreens = tvItemsOnFloor();
  const smallCars = smallCarItemsOnFloor();
  const isLightCategory = assetCategory === "light";
  const isApplianceCategory = assetCategory === "appliance";
  const isHomeCategory = assetCategory === "home";
  const showLightGroups = isLightCategory;
  const showScreens = isApplianceCategory && tvScreens.length > 0;
  const showCharging = isHomeCategory && smallCars.length > 0;
  lightLayerPanel.hidden = !(showLightGroups || showScreens || showCharging);
  if (lightLayerPanel.hidden) {
    return;
  }
  fridgeSize.textContent = showLightGroups ? "全关" : showScreens ? "全关画面" : "全关充电";
  addAreaButton.hidden = !showLightGroups;
  Tg.hidden = !showLightGroups;
  lightLayerActions.classList.toggle("single", !showLightGroups);
  lightGroupList.replaceChildren();
  if (showLightGroups) {
    ensureDefaultLightGroup();
    const areas = floorSceneCurrent.areas || [];
    const areaIdSet = new Set(areas.map(areaRef => areaRef.id));
    const grouped = new Map();
    const unassigned = [];
    for (const lightGroup of floorSceneCurrent.lightGroups) {
      const areaId = areaIdSet.has(lightGroup.areaId) ? lightGroup.areaId : null;
      if (areaId) {
        if (!grouped.has(areaId)) {
          grouped.set(areaId, []);
        }
        grouped.get(areaId).push(lightGroup);
      } else {
        unassigned.push(lightGroup);
      }
    }
    for (const areaEntry of areas) {
      lightGroupList.append(createAreaSection(areaEntry, grouped.get(areaEntry.id) || []));
    }
    for (const unassignedGroup of unassigned) {
      lightGroupList.append(createLightGroupRow(unassignedGroup));
    }
  }
  if (showScreens) {
    for (const [screenIndex, screenEnabled] of tvScreens.entries()) {
      lightGroupList.append(createTvScreenLayerRow(screenIndex, screenEnabled));
    }
  }
  if (showCharging) {
    for (const [carIndex, chargingEnabled] of smallCars.entries()) {
      lightGroupList.append(createCarChargingLayerRow(carIndex, chargingEnabled));
    }
  }
}
function hideAreaContextMenu() {
  areaContextMenu.hidden = true;
  areaContextMenuId = "";
}
function showAreaContextMenu(area, event) {
  areaContextMenuId = area.id;
  areaContextMenu.hidden = false;
  areaContextMenu.style.left = Math.min(event.clientX, window.innerWidth - 128) + "px";
  areaContextMenu.style.top = Math.min(event.clientY, window.innerHeight - 84) + "px";
}
function normalizeAreaName(value) {
  return normalizeLabelText(value, "", 16);
}
function areaNameTaken(name, excludeId) {
  return (floorSceneCurrent.areas || []).some(area => area.id !== excludeId && area.name === name);
}
function openAreaCreateDialog() {
  areaRenameMode = "create";
  areaRenameId = "";
  areaRenameTitle.textContent = "新建区域";
  areaRenameInput.value = "";
  areaRenameDialog.showModal();
  requestAnimationFrame(() => areaRenameInput.focus());
}
function openAreaRenameDialog(area) {
  if (!area) {
    return;
  }
  areaRenameMode = "rename";
  areaRenameId = area.id;
  areaRenameTitle.textContent = "重命名区域";
  areaRenameInput.value = area.name;
  areaRenameDialog.showModal();
  requestAnimationFrame(() => areaRenameInput.select());
}
function closeAreaRenameDialog() {
  areaRenameMode = "create";
  areaRenameId = "";
  areaRenameDialog.close();
}
function deleteArea(area) {
  if (!area) {
    return;
  }
  pushHistory();
  for (const lightGroup of floorSceneCurrent.lightGroups || []) {
    if (lightGroup.areaId === area.id) {
      lightGroup.areaId = null;
    }
  }
  floorSceneCurrent.areas = (floorSceneCurrent.areas || []).filter(item => item.id !== area.id);
  expandedAreaIds.delete(area.id);
  renderLightLayerPanel();
  scheduleSave();
  showToast("已删除区域“" + area.name + "”，组内灯组已移到未分类。", "success");
}
function syncAreaAssignOptions(selectedAreaId) {
  const options = [{
    value: "",
    label: "未分类"
  }];
  for (const area of floorSceneCurrent.areas || []) {
    options.push({
      value: area.id,
      label: area.name
    });
  }
  lightGroupAreaSelect.replaceChildren(...options.map(option => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    return element;
  }));
  lightGroupAreaSelect.value = options.some(option => option.value === selectedAreaId) ? selectedAreaId : "";
  syncStudioSelect(lightGroupAreaSelect);
}
function openLightGroupAreaDialog(lightGroup) {
  if (!lightGroup) {
    return;
  }
  areaAssignGroupId = lightGroup.id;
  lightGroupAreaName.textContent = lightGroup.name;
  lightGroupAreaNewName.value = "";
  syncAreaAssignOptions(lightGroup.areaId || "");
  lightGroupAreaDialog.showModal();
}
function closeLightGroupAreaDialog() {
  areaAssignGroupId = "";
  lightGroupAreaDialog.close();
}
function createAreaFromAssignDialog() {
  const name = normalizeAreaName(lightGroupAreaNewName.value);
  if (!name) {
    showToast("请输入新区域名称。", "error");
    return;
  }
  if (areaNameTaken(name)) {
    showToast("已存在同名区域。", "error");
    return;
  }
  pushHistory();
  const area = {
    id: makeId("area"),
    name
  };
  floorSceneCurrent.areas.push(area);
  expandedAreaIds.add(area.id);
  syncAreaAssignOptions(area.id);
  lightGroupAreaNewName.value = "";
  renderLightLayerPanel();
  scheduleSave();
  showToast("已新建区域“" + name + "”并选中。", "success");
}
function setLightGroupsEnabled(mutateFlag) {
  const groups = floorSceneCurrent.lightGroups || [];
  if (groups.every(enabled => enabled.enabled === mutateFlag)) {
    return;
  }
  pushHistory();
  for (const enabled of groups) {
    enabled.enabled = mutateFlag;
  }
  requestLightGroupCacheRefresh(groups.map(item => item.id));
  scheduleSave();
}
function setTvScreensEnabled(mutateFlag) {
  const list = tvItemsOnFloor();
  if (list.every(screenEnabled => (screenEnabled.screenEnabled !== false) === mutateFlag)) {
    return;
  }
  pushHistory();
  for (const screenEnabled of list) {
    screenEnabled.screenEnabled = mutateFlag;
  }
  rebuildPreviewMeshes({
    scope: "items",
    preserveLightCache: true
  });
  scheduleSave();
}
function setSmallCarChargingEnabled(mutateFlag) {
  const list = smallCarItemsOnFloor();
  if (list.every(chargingEnabled => (chargingEnabled.chargingEnabled === true) === mutateFlag)) {
    return;
  }
  pushHistory();
  for (const chargingEnabled of list) {
    chargingEnabled.chargingEnabled = mutateFlag;
  }
  rebuildPreviewMeshes({
    scope: "items",
    preserveLightCache: true
  });
  scheduleSave();
}
function setCategoryLayersEnabled(mutateFlag) {
  if (assetCategory === "appliance") {
    setTvScreensEnabled(mutateFlag);
  } else if (assetCategory === "home") {
    setSmallCarChargingEnabled(mutateFlag);
  } else {
    setLightGroupsEnabled(mutateFlag);
  }
  renderLightLayerPanel();
}
function isSelected(selectedKind, selectedId) {
  return selection?.kind === selectedKind && selection.id === selectedId || multiSelection.some(kind => kind.kind === selectedKind && kind.id === selectedId);
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
function rebuildPreviewForAssetFilters(assetScope) {
  const selectedLightGroup = activeSelectionLightGroupFilter();
  const scopeSet = new Set([assetScope, selectedLightGroup].filter(Boolean));
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
  constructor(message, statusCode, payload) {
    super(message);
    this.status = statusCode;
    this.payload = payload;
  }
}
async function studioFetch(path, requestOptions = {}) {
  if (isStageEmbed && requestOptions.method && requestOptions.method !== "GET") {
    throw new Error("交互户型为只读视图。");
  }
  const response = await fetch("/api/v1" + path, {
    cache: "no-store",
    ...requestOptions,
    headers: requestOptions.body ? {
      "Content-Type": "application/json",
      ...(requestOptions.headers || {})
    } : requestOptions.headers
  });
  const responseText = response.status === 204 ? "" : await response.text();
  let payload = null;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = null;
    }
  }
  if (response.status === 401) {
    window.location.assign("/login?next=" + encodeURIComponent(window.location.pathname));
    const authError = new StudioHttpError("登录状态已失效。", response.status, payload);
    throw window.HABridgeLog?.linkError(authError, response) || authError;
  }
  if (response.status === 403 && payload?.detail?.code === "LICENSE_RESTRICTED") {
    window.location.assign("/license");
    const licenseError = new StudioHttpError("当前授权无法使用户型图绘制。", response.status, payload);
    throw window.HABridgeLog?.linkError(licenseError, response) || licenseError;
  }
  if (!response.ok) {
    const errorMessage = payload?.detail;
    const requestError = new StudioHttpError(typeof errorMessage == "string" ? errorMessage : errorMessage?.message || "请求失败（HTTP " + response.status + "）", response.status, payload);
    throw window.HABridgeLog?.linkError(requestError, response) || requestError;
  }
  return payload;
}
function showToast(message, variant = "") {
  window.clearTimeout(toastTimer);
  toastCurrent.textContent = message;
  toastCurrent.className = ("toast visible " + variant).trim();
  toastTimer = window.setTimeout(() => {
    toastCurrent.className = "toast";
  }, variant === "warning" ? 4400 : 2600);
}
function setSaveStateLabel(labelHtml, variant = "") {
  el.className = ("save-state " + variant).trim();
  el.innerHTML = "<i></i>" + labelHtml;
}
function pushHistory() {
  undoStack.push(cloneFloorScene());
  if (undoStack.length > 40) {
    undoStack.shift();
  }
  redoStack = [];
}
function pushUndoSnapshot(snapshot) {
  undoStack.push(snapshot);
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
async function loadProjectDocument(studioDocument) {
  const loadGeneration = ++projectLoadGeneration;
  window.clearTimeout(deferredModelTimerCurrent);
  deferredModelTimerCurrent = null;
  deferredModelTasks = [];
  externalModelQueueActive = false;
  window.externalModelLoadsDeferred = false;
  currentStudioDocument = studioDocument;
  projectDocCurrent = normalizeProjectDocument(studioDocument.scene);
  if (isStageEmbed) {
    for (const floorEntry of projectDocCurrent.floors) {
      floorEntry.scene.settings.livePreviewEnabled = true;
    }
  }
  applyBaseLighting(projectDocCurrent.baseLighting);
  activeFloorId = projectDocCurrent.activeFloorId;
  if (isAutoDiagramEmbedCurrent && floorSelectionQueryCurrent !== null) {
    const matchedFloor = projectDocCurrent.floors.find(selectedFloor => selectedFloor.id === floorSelectionQueryCurrent);
    if (floorSelectionQueryCurrent === "all" && projectDocCurrent.floors.length > 1) {
      projectDocCurrent.previewFloorMode = "all";
    } else if (matchedFloor) {
      projectDocCurrent.previewFloorMode = "active";
      projectDocCurrent.activeFloorId = matchedFloor.id;
      activeFloorId = matchedFloor.id;
    }
  }
  floorSceneCurrent = activeFloor().scene;
  on = "";
  clearSelection();
  resetWallDrawingCurrent();
  undoStack = [];
  redoStack = [];
  const modelKeys = visibleExternalModelKeys();
  const isEmbed = isAutoDiagramEmbedCurrent;
  if (isEmbed) {
    deferExternalModelsCurrent = true;
  }
  let modelPromises = [];
  if (isEmbed) {
    modelPromises = modelKeys.map(modelKey => loadExternalItemModel(modelKey));
  }
  externalModelQueueActive = !isEmbed;
  window.externalModelLoadsDeferred = externalModelQueueActive;
  deferredModelTasks = isEmbed ? [] : modelKeys;
  if (!isEmbed) {
    scheduleDeferredModelLoad();
  }
  updateModelLoadStatus();
  syncPreviewFloorButtons();
  updateAlignFloorButton();
  planView.rotation = floorSceneCurrent.settings.planViewRotation;
  await reloadPlanBackground();
  refreshViews(isEmbed ? "none" : "all");
  if (!isEmbed) {
    scheduleOrbitInteractionWarmup(1200);
  }
  if (isEmbed) {
    try {
      const settledResults = Promise.allSettled(modelPromises);
      await Promise.race([settledResults, new Promise(resolve => window.setTimeout(resolve, 3500))]);
      Promise.allSettled(modelPromises).then(() => {
        if (loadGeneration === projectLoadGeneration) {
          refreshStudioChrome();
        }
      });
    } finally {
      if (loadGeneration === projectLoadGeneration) {
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
      if (loadGeneration === projectLoadGeneration) {
        refreshStudioChrome();
      }
    });
  }
  resizePlanCanvas();
  fitPlanViewToContent();
  if (!isEmbed) {
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
  if (isStageEmbed || !currentStudioDocument || isFlushingSave || saveConflictStateCurrent || saveGeneration === savedGeneration) {
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
      currentStudioDocument = await putStudioDocument(currentStudioDocument);
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
    currentStudioDocument = isLocalScene.latest;
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
function zoomPlanViewAt(scaleFactor, screenAnchor = {
  x: planWidth / 2,
  y: planHeight / 2
}) {
  const anchorInPlan = screenToPlanWithView(screenAnchor);
  const anchorInScene = screenToPlan(screenAnchor);
  planView.zoom = clamp(planView.zoom * scaleFactor, 0.03, 12);
  planView.offsetX = anchorInScene.x - anchorInPlan.x * planView.zoom;
  planView.offsetY = anchorInScene.y - anchorInPlan.y * planView.zoom;
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
function getWallAnalysis(thicknessMeters) {
  const tolerance = Math.max(1, thicknessMeters * 0.01);
  const sceneSignature = floorSceneCurrent.walls.map(wall => wall.id + "," + wall.start.x + "," + wall.start.y + "," + wall.end.x + "," + wall.end.y + "," + wall.thickness + "," + (wall.allowOpenEnd === true ? 1 : 0)).join(";");
  if (wallAnalysisCache.scene !== floorSceneCurrent || wallAnalysisCache.signature !== tolerance + "|" + sceneSignature) {
    wallAnalysisCache = {
      scene: floorSceneCurrent,
      signature: tolerance + "|" + sceneSignature,
      tolerance,
      floorPolygons: null,
      intersections: null,
      joinExtensions: null,
      unclosedEndpoints: null
    };
  }
  return wallAnalysisCache;
}
function getFloorPolygons(scene) {
  const analysis = getWallAnalysis(scene);
  analysis.floorPolygons ||= closedWallFloorPolygons(floorSceneCurrent.walls, analysis.tolerance);
  return analysis.floorPolygons;
}
function getWallIntersections(scene) {
  const analysis = getWallAnalysis(scene);
  analysis.intersections ||= wallIntersections(floorSceneCurrent.walls);
  return analysis.intersections;
}
function getWallJoinExtensions(scene) {
  const analysis = getWallAnalysis(scene);
  analysis.joinExtensions ||= wallJoinExtensions(floorSceneCurrent.walls);
  return analysis.joinExtensions;
}
function getUnclosedWallEndpoints(scene) {
  const analysis = getWallAnalysis(scene);
  analysis.unclosedEndpoints ||= unclosedWallEndpoints(floorSceneCurrent.walls, analysis.tolerance, getFloorPolygons(scene));
  return analysis.unclosedEndpoints;
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
    const doorFlipSign = size.swing === -1 ? -1 : 1;
    const centers = slidingDoorPanelCenters(distanceCurrent, doorHingeSign);
    const doorPanelInset = distanceCurrent * 0.27;
    for (const [panelOffset, hingeSign] of [[centers.fixed, -doorFlipSign], [centers.moving, doorFlipSign]]) {
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
    const maxValue = Math.max(2 / planView.zoom, isWall.wall.thickness * (pixelsPerMeter() || 100) * 0.08) * (size.swing === -1 ? -1 : 1);
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
  const planFootprint = itemPlanFootprint(item);
  const planItemWidthPx = planFootprint.width * pixelsPerMeter() * planView.zoom;
  const planItemDepthPx = planFootprint.depth * pixelsPerMeter() * planView.zoom;
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
    const iconRadius = Math.max(Math.min(planItemWidthPx, planItemDepthPx) * 0.44, item.type === "downlight" ? 10 : 8);
    const lightColorHex = "#" + kelvinToRgbHex(item.lightTemperature).toString(16).padStart(6, "0");
    const lightVisible = isLightGroupVisible(item);
    planCtx.fillStyle = lightVisible ? lightColorHex : "#68737d";
    planCtx.strokeStyle = lightVisible ? "rgba(255, 221, 163, .88)" : "rgba(196, 207, 216, .48)";
    planCtx.lineWidth = 1.2;
    if (item.type === "striplight" && stripIsStanding(item)) {
      // Stood up, so the only thing the plan can show is the footprint the strip occupies
      // (thickness x 发光宽度); the emitting length now runs up the room and is invisible from above.
      // Double-outline treatment, same as a laid-down pillar, the other posture that breaks width x depth.
      planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
      planCtx.lineWidth = 1;
      const standingInset = Math.min(planItemWidthPx, planItemDepthPx) * 0.3;
      planCtx.beginPath();
      planCtx.rect(-planItemWidthPx / 2 + standingInset, -planItemDepthPx / 2 + standingInset, Math.max(planItemWidthPx - standingInset * 2, 0.6), Math.max(planItemDepthPx - standingInset * 2, 0.6));
      planCtx.stroke();
    } else if (item.type === "striplight") {
      planCtx.beginPath();
      const stripCornerRadius = Math.min(7, planItemDepthPx * 0.42);
      planCtx.roundRect(-planItemWidthPx / 2, -planItemDepthPx * 0.34, planItemWidthPx, planItemDepthPx * 0.68, stripCornerRadius);
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = lightVisible ? "rgba(255, 238, 195, .95)" : "rgba(196, 207, 216, .42)";
      planCtx.lineWidth = Math.max(2, planItemDepthPx * 0.12);
      planCtx.beginPath();
      planCtx.moveTo(-planItemWidthPx * 0.42, 0);
      planCtx.lineTo(planItemWidthPx * 0.42, 0);
      planCtx.stroke();
    } else if (item.type === "ceilinglight") {
      const ceilingLightSize = Math.max(Math.min(planItemWidthPx, planItemDepthPx) * 0.82, 16);
      planCtx.beginPath();
      planCtx.rect(-ceilingLightSize / 2, -ceilingLightSize / 2, ceilingLightSize, ceilingLightSize);
      planCtx.fill();
      planCtx.stroke();
      const ceilingLightInnerSize = ceilingLightSize * 0.58;
      planCtx.strokeRect(-ceilingLightInnerSize / 2, -ceilingLightInnerSize / 2, ceilingLightInnerSize, ceilingLightInnerSize);
    } else {
      planCtx.beginPath();
      planCtx.arc(0, 0, iconRadius, 0, Math.PI * 2);
      planCtx.fill();
      planCtx.stroke();
      planCtx.beginPath();
      planCtx.arc(0, 0, iconRadius * 0.5, 0, Math.PI * 2);
      planCtx.stroke();
      for (let spokeIndex = 0; spokeIndex < 4; spokeIndex += 1) {
        const spokeAngle = spokeIndex * Math.PI / 2;
        planCtx.beginPath();
        planCtx.moveTo(Math.cos(spokeAngle) * iconRadius * 0.68, Math.sin(spokeAngle) * iconRadius * 0.68);
        planCtx.lineTo(Math.cos(spokeAngle) * iconRadius * 1.12, Math.sin(spokeAngle) * iconRadius * 1.12);
        planCtx.stroke();
      }
    }
  } else if (item.type === "planlabel") {
    const labelMetrics = planLabelProjectionMetrics(planItemWidthPx, planItemDepthPx, item.lineLength);
    planCtx.fillStyle = "#929baa";
    const titleFontPx = labelMetrics.titleFontSize;
    planCtx.font = "700 " + titleFontPx + "px sans-serif";
    drawTrackedText(planCtx, item.title || "家庭总览", labelMetrics.titleStartX, labelMetrics.titleY, titleFontPx * clamp(finite(item.titleSpacing, 1.05), 0, 1.8), labelMetrics.titleMaxWidth);
    const iconX = labelMetrics.iconX;
    const iconY = labelMetrics.iconY;
    const iconSize = labelMetrics.iconSize;
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
    const subtitleFontSize = labelMetrics.subtitleFontSize;
    planCtx.font = "400 " + subtitleFontSize + "px \"Arial Narrow\", Arial, sans-serif";
    drawTrackedText(planCtx, item.subtitle || "HOME PLAN", labelMetrics.subtitleStartX, labelMetrics.subtitleY, subtitleFontSize * clamp(finite(item.subtitleSpacing, 0.08), 0, 0.6), labelMetrics.subtitleMaxWidth);
    planCtx.strokeStyle = "rgba(146, 155, 170, .72)";
    planCtx.lineWidth = labelMetrics.baselineLineWidth;
    const baselineY = labelMetrics.baselineY;
    const baselineStartX = labelMetrics.baselineStartX;
    const baselineEndX = baselineStartX + labelMetrics.baselineLength;
    planCtx.beginPath();
    planCtx.moveTo(baselineStartX, baselineY);
    planCtx.lineTo(baselineEndX, baselineY);
    planCtx.moveTo(baselineStartX, baselineY - labelMetrics.baselineCapHalfHeight);
    planCtx.lineTo(baselineStartX, baselineY + labelMetrics.baselineCapHalfHeight);
    planCtx.moveTo(baselineEndX, baselineY - labelMetrics.baselineCapHalfHeight);
    planCtx.lineTo(baselineEndX, baselineY + labelMetrics.baselineCapHalfHeight);
    planCtx.stroke();
  } else if (item.type === "smallcar") {
    const cardCornerRadius = Math.min(planItemWidthPx * 0.22, planItemDepthPx * 0.08);
    if (item.chargingEnabled === true) {
      planCtx.save();
      planCtx.scale(planItemWidthPx * 0.76, planItemDepthPx * 0.62);
      const chargingGlow = planCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
      chargingGlow.addColorStop(0, "rgba(79, 239, 183, .32)");
      chargingGlow.addColorStop(0.48, "rgba(79, 239, 183, .17)");
      chargingGlow.addColorStop(1, "rgba(79, 239, 183, 0)");
      planCtx.fillStyle = chargingGlow;
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
    planCtx.roundRect(-planItemWidthPx * 0.48, -planItemDepthPx * 0.49, planItemWidthPx * 0.96, planItemDepthPx * 0.98, cardCornerRadius);
    planCtx.fill();
    planCtx.stroke();
    planCtx.fillStyle = "rgba(38, 48, 57, .72)";
    planCtx.beginPath();
    planCtx.roundRect(-planItemWidthPx * 0.38, -planItemDepthPx * 0.2, planItemWidthPx * 0.76, planItemDepthPx * 0.42, cardCornerRadius * 0.7);
    planCtx.fill();
    for (const offsetX of [-0.5, 0.5]) {
      for (const offsetY of [-0.3, 0.3]) {
        planCtx.fillRect(offsetY * planItemWidthPx - planItemWidthPx * 0.045, offsetY * planItemDepthPx - planItemDepthPx * 0.085, planItemWidthPx * 0.09, planItemDepthPx * 0.17);
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
    const drawCurtainSlatRun = (startX, runWidth) => {
      planCtx.beginPath();
      planCtx.roundRect(startX, -planItemDepthPx * 0.46, runWidth, planItemDepthPx * 0.92, Math.min(planItemDepthPx * 0.32, runWidth * 0.18));
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = "rgba(25, 34, 43, .48)";
      planCtx.lineWidth = 1;
      for (let slatIndex = 1; slatIndex < 5; slatIndex += 1) {
        const slatX = startX + runWidth * slatIndex / 5;
        planCtx.beginPath();
        planCtx.moveTo(slatX, -planItemDepthPx * 0.34);
        planCtx.lineTo(slatX, planItemDepthPx * 0.34);
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
      drawCurtainSlatRun(-planItemWidthPx * 0.5, planItemWidthPx * 0.24);
    } else if (conditionalValue === "right") {
      drawCurtainSlatRun(planItemWidthPx * 0.26, planItemWidthPx * 0.24);
    } else {
      drawCurtainSlatRun(-planItemWidthPx * 0.5, planItemWidthPx * 0.16);
      drawCurtainSlatRun(planItemWidthPx * 0.34, planItemWidthPx * 0.16);
    }
  } else if (item.type === "pillar") {
    if (pillarIsLying(item)) {
      // Laid down: the plan shows the floor area the column occupies (width x length) rather than a
      // cross-section. The inner outline keeps the same double-line treatment as the other shapes.
      planCtx.rect(-planItemWidthPx / 2, -planItemDepthPx / 2, planItemWidthPx, planItemDepthPx);
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
      planCtx.lineWidth = 1;
      const lyingInset = Math.min(planItemWidthPx, planItemDepthPx) * 0.18;
      planCtx.beginPath();
      planCtx.rect(-planItemWidthPx / 2 + lyingInset, -planItemDepthPx / 2 + lyingInset, planItemWidthPx - lyingInset * 2, planItemDepthPx - lyingInset * 2);
      planCtx.stroke();
    } else {
      const pillarShape = normalizePillarShape(item.pillarShape);
      tracePillarPlanPath(planCtx, pillarShape, planItemWidthPx, planItemDepthPx);
      planCtx.fill();
      planCtx.stroke();
      planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
      planCtx.lineWidth = 1;
      tracePillarPlanPath(planCtx, pillarShape, planItemWidthPx * 0.72, planItemDepthPx * 0.72);
      planCtx.stroke();
    }
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
    for (const offsetX of [-0.25, 0.18]) {
      planCtx.beginPath();
      planCtx.arc(planItemWidthPx * offsetX, planItemDepthPx * (offsetX > 0 ? 0.08 : -0.06), Math.max(2, planItemDepthPx * 0.08), 0, Math.PI * 2);
      planCtx.stroke();
    }
  } else if (item.type === "coffeetable") {
    const glowRadius = Math.min(planItemWidthPx, planItemDepthPx) * 0.32;
    const innerRadius = glowRadius * 0.7;
    planCtx.beginPath();
    planCtx.arc(-planItemWidthPx * 0.16, planItemDepthPx * 0.08, glowRadius, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(planItemWidthPx * 0.24, -planItemDepthPx * 0.2, innerRadius, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
  } else if (roundTableTypes.has(item.type)) {
    planCtx.beginPath();
    planCtx.ellipse(0, 0, planItemWidthPx * 0.32, planItemDepthPx * 0.32, 0, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    for (const [offsetX, offsetY] of [[-0.38, 0], [0.38, 0], [0, -0.38], [0, 0.38]]) {
      planCtx.beginPath();
      planCtx.roundRect(planItemWidthPx * offsetX - planItemWidthPx * 0.085, planItemDepthPx * offsetY - planItemDepthPx * 0.095, planItemWidthPx * 0.17, planItemDepthPx * 0.19, Math.min(planItemWidthPx, planItemDepthPx) * 0.035);
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
    for (const offsetX of [-0.39, 0.39]) {
      for (const offsetY of [-0.34, 0.34]) {
        planCtx.beginPath();
        planCtx.arc(planItemWidthPx * offsetY, planItemDepthPx * offsetY, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.045), 0, Math.PI * 2);
        planCtx.fill();
      }
    }
  } else if (item.type === "floorlamp") {
    const lampX = -planItemWidthPx * 0.34;
    const lampRadius = planItemWidthPx * 0.31;
    const dotRadius = Math.min(planItemDepthPx * 0.34, planItemWidthPx * 0.13);
    const min = Math.min(planItemDepthPx * 0.46, planItemWidthPx * 0.14);
    planCtx.lineCap = "round";
    planCtx.lineWidth = selected ? 2.4 : 1.5;
    planCtx.beginPath();
    planCtx.moveTo(lampX, 0);
    planCtx.lineTo(lampRadius, 0);
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(lampX, 0, dotRadius, 0, Math.PI * 2);
    planCtx.fill();
    planCtx.stroke();
    planCtx.beginPath();
    planCtx.arc(lampRadius, 0, min, 0, Math.PI * 2);
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
    for (const side of [-1, 1]) {
      planCtx.strokeRect(side * planItemWidthPx * 0.38 - planItemWidthPx * 0.07, -planItemDepthPx * 0.25, planItemWidthPx * 0.14, planItemDepthPx * 0.5);
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
    for (const offsetX of [-0.2, 0.2]) {
      planCtx.beginPath();
      planCtx.arc(planItemWidthPx * offsetX, planItemDepthPx * 0.18, Math.max(1.5, Math.min(planItemWidthPx, planItemDepthPx) * 0.055), 0, Math.PI * 2);
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
  } else if (item.type === "mural") {
    const muralThickness = Math.max(planItemDepthPx, 3);
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -muralThickness / 2, planItemWidthPx, muralThickness);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
    planCtx.lineWidth = 1;
    planCtx.beginPath();
    planCtx.moveTo(-planItemWidthPx * 0.42, -muralThickness * 0.16);
    planCtx.lineTo(-planItemWidthPx * 0.08, muralThickness * 0.16);
    planCtx.moveTo(planItemWidthPx * 0.04, -muralThickness * 0.16);
    planCtx.lineTo(planItemWidthPx * 0.4, muralThickness * 0.16);
    planCtx.stroke();
  } else if (item.type === "featurewall") {
    const featureThickness = Math.max(planItemDepthPx, 3);
    planCtx.beginPath();
    planCtx.rect(-planItemWidthPx / 2, -featureThickness / 2, planItemWidthPx, featureThickness);
    planCtx.fill();
    planCtx.stroke();
    planCtx.strokeStyle = selected ? "rgba(255, 193, 116, .95)" : "rgba(25, 34, 43, .5)";
    planCtx.lineWidth = 1;
    for (let tick = 0; tick < 6; tick += 1) {
      const tickX = -planItemWidthPx * 0.4 + planItemWidthPx * 0.8 * tick / 5;
      planCtx.beginPath();
      planCtx.moveTo(tickX, -featureThickness * 0.24);
      planCtx.lineTo(tickX, featureThickness * 0.24);
      planCtx.stroke();
    }
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
    for (let slatIndex = 1; slatIndex < 10; slatIndex += 1) {
      const slatY = -planItemDepthPx / 2 + planItemDepthPx * slatIndex / 10;
      planCtx.beginPath();
      planCtx.moveTo(-planItemWidthPx / 2, slatY);
      planCtx.lineTo(planItemWidthPx / 2, slatY);
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
function rotatedItemCorner(item, offsetX, offsetY) {
  const angleRad = (Number(item.rotation) || 0) * Math.PI / 180;
  return {
    x: item.x + offsetX * Math.cos(angleRad) - offsetY * Math.sin(angleRad),
    y: item.y + offsetX * Math.sin(angleRad) + offsetY * Math.cos(angleRad)
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
function beginItemDrag(pointerPoint) {
  if (activeTool !== "select" || selection?.kind !== "item" || multiSelection.length) {
    return null;
  }
  const item = selectedEntity();
  if (!item) {
    return null;
  }
  const itemControls = itemPlanBounds(itemWithPlanFootprint(item));
  const handleHitRadius = 9 / Math.max(planView.zoom, 0.01);
  if (distance(pointerPoint, itemControls.rotationHandle) <= handleHitRadius) {
    return {
      type: "rotate-item",
      item,
      controls: itemControls
    };
  }
  const corner = itemControls.corners.find(point => distance(pointerPoint, point.point) <= handleHitRadius);
  if (corner) {
    return {
      type: "resize-item",
      item,
      controls: itemControls,
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
function marqueeSelectHits(dragStartPoint, dragEndPoint) {
  const bounds = axisAlignedBounds(dragStartPoint, dragEndPoint);
  const scalePixels = pixelsPerMeter() || 100;
  const hits = [];
  const isLightCategory = assetCategory === "light";
  if (!isLightCategory) {
    for (const wall of floorSceneCurrent.walls) {
      if (segmentHitsBounds(wall.start, wall.end, bounds)) {
        hits.push({
          kind: "wall",
          id: wall.id
        });
      }
    }
    for (const windowFixture of floorSceneCurrent.windows) {
      const windowSpan = wallAttachmentWorldPoint(windowFixture);
      if (windowSpan && segmentHitsBounds(windowSpan.start, windowSpan.end, bounds)) {
        hits.push({
          kind: "window",
          id: windowFixture.id
        });
      }
    }
    for (const doorFixture of floorSceneCurrent.doors) {
      const doorSpan = wallAttachmentWorldPoint(doorFixture);
      if (doorSpan && segmentHitsBounds(doorSpan.start, doorSpan.end, bounds)) {
        hits.push({
          kind: "door",
          id: doorFixture.id
        });
      }
    }
    for (const railingFixture of floorSceneCurrent.railings) {
      const railingSpan = wallAttachmentWorldPoint(railingFixture);
      if (railingSpan && segmentHitsBounds(railingSpan.start, railingSpan.end, bounds)) {
        hits.push({
          kind: "railing",
          id: railingFixture.id
        });
      }
    }
  }
  const boundsCorners = [{
    x: bounds.minX,
    y: bounds.minY
  }, {
    x: bounds.maxX,
    y: bounds.minY
  }, {
    x: bounds.maxX,
    y: bounds.maxY
  }, {
    x: bounds.minX,
    y: bounds.maxY
  }];
  for (const sceneItem of floorSceneCurrent.items) {
    if (set.has(sceneItem.type) !== isLightCategory) {
      continue;
    }
    const rotationRad = sceneItem.rotation * Math.PI / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);
    const itemFootprint = itemPlanFootprint(sceneItem);
    const halfMeshWidth = itemFootprint.width * scalePixels / 2;
    const halfMeshDepth = itemFootprint.depth * scalePixels / 2;
    const rotatedCorners = [[-halfMeshWidth, -halfMeshDepth], [halfMeshWidth, -halfMeshDepth], [halfMeshWidth, halfMeshDepth], [-halfMeshWidth, halfMeshDepth]].map(([localX, localY]) => ({
      x: sceneItem.x + localX * cos - localY * sin,
      y: sceneItem.y + localX * sin + localY * cos
    }));
    if (pointInBounds(sceneItem, bounds) || rotatedCorners.some(cornerPoint => pointInBounds(cornerPoint, bounds)) || boundsCorners.some(corner => pointInRotatedRectangle(corner, itemWithPlanFootprint(sceneItem), scalePixels))) {
      hits.push({
        kind: "item",
        id: sceneItem.id
      });
    }
  }
  return hits;
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
      start: dragStart,
      current: dragEnd
    } = dragState;
    drawItemOnPlan({
      ...furnitureCatalog.flooropening,
      type: "flooropening",
      id: "opening-preview",
      rotation: 0,
      x: (dragStart.x + dragEnd.x) / 2,
      y: (dragStart.y + dragEnd.y) / 2,
      width: Math.abs(dragEnd.x - dragStart.x) / value,
      depth: Math.abs(dragEnd.y - dragStart.y) / value
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
    const wouldClose = onPlanPointerDown(at);
    drawPlanLine(Tt, at.point, {
      color: "#ff9d2e",
      width: 2,
      dash: [7, 5]
    });
    drawPlanPoint(Tt, "#ff9d2e");
    drawPlanPoint(at.point, wouldClose ? "#76cfa1" : at.kind ? "#43d2e6" : "#ff9d2e", wouldClose ? 5 : 3.5);
    const isStart = distance(Tt, at.point) / value;
    drawFloatingLabel({
      x: (Tt.x + at.point.x) / 2,
      y: (Tt.y + at.point.y) / 2
    }, isStart.toFixed(2) + " m", "#ffb04a");
    if (wouldClose) {
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
function placeCatalogItemAt(planPoint) {
  const scalePixels = pixelsPerMeter() || 100;
  const isLightCategory = assetCategory === "light";
  for (const item of [...floorSceneCurrent.items].reverse()) {
    if (set.has(item.type) === isLightCategory && pointInRotatedRectangle(planPoint, itemWithPlanFootprint(item), scalePixels)) {
      return {
        kind: "item",
        id: item.id
      };
    }
  }
  if (isLightCategory) {
    return null;
  }
  for (const windowFixture of [...floorSceneCurrent.windows].reverse()) {
    const windowAttachment = wallAttachmentWorldPoint(windowFixture);
    if (windowAttachment && projectPointToSegment(planPoint, windowAttachment.start, windowAttachment.end).distance <= 10 / planView.zoom) {
      return {
        kind: "window",
        id: windowFixture.id
      };
    }
  }
  for (const doorFixture of [...floorSceneCurrent.doors].reverse()) {
    const doorAttachment = wallAttachmentWorldPoint(doorFixture);
    if (doorAttachment && projectPointToSegment(planPoint, doorAttachment.start, doorAttachment.end).distance <= 12 / planView.zoom) {
      return {
        kind: "door",
        id: doorFixture.id
      };
    }
  }
  for (const railingFixture of [...floorSceneCurrent.railings].reverse()) {
    const railingAttachment = wallAttachmentWorldPoint(railingFixture);
    if (railingAttachment && projectPointToSegment(planPoint, railingAttachment.start, railingAttachment.end).distance <= 12 / planView.zoom) {
      return {
        kind: "railing",
        id: railingFixture.id
      };
    }
  }
  for (const wall of [...floorSceneCurrent.walls].reverse()) {
    const wallHitSlop = Math.max(wall.thickness * scalePixels / 2, 8 / planView.zoom);
    if (projectPointToSegment(planPoint, wall.start, wall.end).distance <= wallHitSlop) {
      return {
        kind: "wall",
        id: wall.id
      };
    }
  }
  return null;
}
function updateProgressChecklist() {
  const stepState = {
    background: !!floorSceneCurrent.background,
    scale: !!floorSceneCurrent.calibration,
    walls: floorSceneCurrent.walls.length > 0,
    items: floorSceneCurrent.items.some(item => !set.has(item.type)),
    lights: floorSceneCurrent.items.some(item => set.has(item.type)),
    export: isExporting
  };
  const nextStepKey = ["background", "scale", "walls", "items", "lights", "export"].find(step => !stepState[step]) || "export";
  for (const element of document.querySelectorAll("[data-step]")) {
    element.classList.toggle("complete", stepState[element.dataset.step]);
    element.classList.toggle("active", element.dataset.step === nextStepKey);
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
      selectEl(".door-actions").hidden = lightGroup.doorType === "frame-only";
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
      muralStyleField.hidden = lightGroup.type !== "mural";
      featureWallStyleField.hidden = lightGroup.type !== "featurewall";
      pillarShapeField.hidden = lightGroup.type !== "pillar";
      pillarAxisField.hidden = lightGroup.type !== "pillar";
      stripAxisField.hidden = lightGroup.type !== "striplight";
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
      if (lightGroup.type === "mural") {
        selectEl("#mural-style").value = normalizeMuralArtStyle(lightGroup.muralStyle);
        syncStudioSelect(selectEl("#mural-style"));
      }
      if (lightGroup.type === "featurewall") {
        selectEl("#feature-wall-style").value = normalizeFeatureWallStyle(lightGroup.wallStyle);
        syncStudioSelect(selectEl("#feature-wall-style"));
      }
      if (lightGroup.type === "pillar") {
        selectEl("#pillar-shape").value = normalizePillarShape(lightGroup.pillarShape);
        syncStudioSelect(selectEl("#pillar-shape"));
        selectEl("#pillar-axis").value = normalizePillarAxis(lightGroup.pillarAxis);
        syncStudioSelect(selectEl("#pillar-axis"));
      }
      if (lightGroup.type === "striplight") {
        selectEl("#strip-axis").value = normalizeStripAxis(lightGroup.stripAxis);
        syncStudioSelect(selectEl("#strip-axis"));
      }
      syncControlValue(selectEl("#item-x"), (lightGroup.x / (pixelsPerMeter() || 1)).toFixed(2));
      syncControlValue(selectEl("#item-y"), (lightGroup.y / (pixelsPerMeter() || 1)).toFixed(2));
      syncControlValue(selectEl("#item-width"), lightGroup.width.toFixed(2));
      // A lying pillar uses height as its length along the plan, so label the field accordingly.
      if (itemHeightLabel) {
        itemHeightLabel.textContent = pillarIsLying(lightGroup) ? "长（m）" : "高（m）";
      }
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
function setActiveTool(toolName) {
  if (!toolHelpText[toolName]) {
    return;
  }
  if (assetCategory === "light" && toolName !== "select") {
    showToast("灯光编辑中户型已锁定，请先切回家居或电器。");
    return;
  }
  const needsUnclosedWallWarning = activeTool === "wall" && toolName !== "wall" && Ar > 0;
  activeTool = toolName;
  element.dataset.tool = toolName;
  element.style.cursor = "";
  for (const element of Zd) {
    element.classList.toggle("active", element.dataset.tool === toolName);
  }
  [activeToolLabelCurrent.textContent, toolHelp.textContent] = assetCategory === "light" ? ["灯光编辑", "户型已锁定；框选多盏灯后可整体拖动，Shift 锁轴，Option/Alt 复制"] : toolHelpText[toolName];
  yr.hidden = toolName !== "wall" || !Tt;
  if (toolName !== "wall") {
    resetWallDrawingCurrent();
  }
  if (toolName !== "scale") {
    wallDrawAnchorCurrent = null;
  }
  at = null;
  Uo = null;
  railingPlacementPreviewCurrent = null;
  Ko = null;
  drawPlan();
  if (needsUnclosedWallWarning) {
    showToast("当前墙线未闭合，不会生成地面；如果绘制的是隔墙，可以忽略此提醒。", "warning");
  }
}
function requireCalibration(toolName = "scale") {
  if (pixelsPerMeter()) {
    return true;
  } else {
    showToast("请先画一条参考线并填写真实长度。", "error");
    setActiveTool(toolName);
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
function placeCatalogFurnitureItem(itemType, position, sizes = {}) {
  const catalogEntry = furnitureCatalog[itemType];
  if (!catalogEntry || !requireCalibration()) {
    return;
  }
  const lightPreset = defaultLightPresets[itemType] || defaultLightPresets.downlight;
  const lightGroup = set.has(itemType) ? ensureDefaultLightGroup() : null;
  pushHistory();
  const item = {
    id: makeId("item"),
    type: itemType,
    x: position.x,
    y: position.y,
    rotation: 0,
    width: sizes.width ?? catalogEntry.width,
    depth: sizes.depth ?? catalogEntry.depth,
    height: catalogEntry.height,
    elevation: catalogEntry.elevation || 0,
    color: catalogEntry.color,
    ...(itemType === "planlabel" ? {
      title: "家庭总览",
      subtitle: "HOME PLAN",
      titleSpacing: 1.05,
      subtitleSpacing: 0.08,
      lineLength: 0.86
    } : {}),
    ...(itemType === "camera" || itemType === "presence" ? {
      verticalRotation: 0
    } : {}),
    ...(itemType === "tv" ? {
      screenEnabled: true,
      screenLayerName: "电视画面 " + (tvItemsOnFloor().length + 1),
      tvMountStyle: "standard"
    } : {}),
    ...(itemType === "smallcar" ? {
      chargingEnabled: false,
      chargingLayerName: "汽车充电 " + (smallCarItemsOnFloor().length + 1)
    } : {}),
    ...(itemType === "curtain" ? {
      curtainPosition: "split"
    } : {}),
    ...(itemType === "mural" ? {
      muralStyle: normalizeMuralArtStyle(catalogEntry.muralStyle)
    } : {}),
    ...(itemType === "featurewall" ? {
      wallStyle: normalizeFeatureWallStyle(catalogEntry.wallStyle)
    } : {}),
    ...(itemType === "pillar" ? {
      pillarShape: normalizePillarShape(catalogEntry.pillarShape),
      pillarAxis: normalizePillarAxis(catalogEntry.pillarAxis)
    } : {}),
    ...(stairItemTypes.has(itemType) ? {
      stairDirection: "right"
    } : {}),
    ...(itemType === "shoecabinet" ? {
      shoeCabinetMirrored: false
    } : {}),
    ...(roundTableTypes.has(itemType) ? {
      roundTableTurntable: false
    } : {}),
    ...(set.has(itemType) ? {
      lightGroupId: lightGroup.id,
      verticalRotation: 0,
      ...(itemType === "striplight" ? {
        stripAxis: "horizontal",
        stripRollRotation: 0,
        lightSourceVisible: true
      } : {}),
      lightTemperature: lightPreset.temperature,
      lightBrightness: lightPreset.brightness,
      lightRange: lightPreset.range,
      lightAngle: lightPreset.angle
    } : {})
  };
  ensureItemLayerNames([item]);
  floorSceneCurrent.items.push(item);
  setSelection("item", item.id);
  setActiveTool("select");
  refreshViews(itemPreviewScope(item));
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
  const copiedItems = cloneSelectedItems();
  if (!copiedItems.length) {
    showToast("请先选择要复制的灯具、家具或电器。");
    return;
  }
  clipboardItems = copiedItems.map(selectedItem => structuredClone(selectedItem));
  const floorEntry = activeFloor();
  Fr = {
    id: floorEntry.id,
    originX: floorEntry.originX,
    originY: floorEntry.originY,
    offsetX: floorEntry.offsetX,
    offsetZ: floorEntry.offsetZ,
    rotation: floorEntry.rotation,
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
  const revision = ++planBackgroundRevision;
  planBackgroundImageCurrent = null;
  if (!floorSceneCurrent.background?.url) {
    return;
  }
  const bgUrl = floorSceneCurrent.background.url;
  await new Promise(resolve => {
    let settled = false;
    const settle = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    const imageEl = new Image();
    const timeoutId = window.setTimeout(settle, 2000);
    imageEl.addEventListener("load", () => {
      if (revision !== planBackgroundRevision || floorSceneCurrent.background?.url !== bgUrl) {
        settle();
        return;
      }
      planBackgroundImageCurrent = imageEl;
      window.clearTimeout(timeoutId);
      if (settled) {
        drawPlan();
      } else {
        settle();
      }
    }, {
      once: true
    });
    imageEl.addEventListener("error", () => {
      window.clearTimeout(timeoutId);
      if (revision === planBackgroundRevision) {
        showToast("底图加载失败，请重新导入。", "error");
      }
      settle();
    }, {
      once: true
    });
    imageEl.src = bgUrl;
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
function setShadowCameraExpanded(shouldExpand) {
  const isExpanded = shouldExpand === true;
  if (isExpanded !== shadowCameraExpanded) {
    if (isExpanded && previewSpotLight?.shadow?.camera) {
      const expandedCamera = previewSpotLight.shadow.camera;
      savedSpotShadowCamera = {
        left: expandedCamera.left,
        right: expandedCamera.right,
        top: expandedCamera.top,
        bottom: expandedCamera.bottom,
        near: expandedCamera.near,
        far: expandedCamera.far
      };
    }
    shadowCameraExpanded = isExpanded;
    applyPreviewEnvironment();
    if (!isExpanded && savedSpotShadowCamera && previewSpotLight?.shadow?.camera) {
      const currentCamera = previewSpotLight.shadow.camera;
      Object.assign(currentCamera, savedSpotShadowCamera);
      currentCamera.updateProjectionMatrix();
      savedSpotShadowCamera = null;
    }
    if (previewSpotLight?.shadow) {
      previewSpotLight.shadow.needsUpdate = true;
    }
    if (renderer?.domElement) {
      renderer.domElement.dataset.exportShadowQuality = isExpanded ? "high" : "realtime";
    }
  }
}
function scaledShadowMapSize(requestedSize) {
  if (!shadowCameraExpanded) {
    return requestedSize;
  }
  const maxTextureSize = Math.max(1, Math.floor(finite(renderer?.capabilities?.maxTextureSize, DEFAULT_MAX_TEXTURE_SIZE)));
  return Math.min(maxTextureSize, Math.max(requestedSize, DEFAULT_MAX_TEXTURE_SIZE));
}
function syncBaseLightingControls() {
  for (const el of baseLightControlEls) {
    const toFixed = baseLighting[el.dataset.baseLightControl];
    const flag = el.step === "5";
    syncControlValue(el, flag ? Math.round(toFixed) : Number(toFixed.toFixed(2)));
  }
}
function applyBaseLighting(values) {
  const previous = baseLighting;
  baseLighting = normalizeBaseLighting(values);
  syncBaseLightingControls();
  applyPreviewEnvironment();
  requestRender({
    shadows: Object.keys(DEFAULT_BASE_LIGHTING).some(key => previous[key] !== baseLighting[key])
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
function topViewForwardVector(rotationDeg = topViewRotation()) {
  const rotationRad = THREE.MathUtils.degToRad(rotationDeg);
  return new THREE.Vector3(Math.sin(rotationRad), 0, -Math.cos(rotationRad));
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
function tickQualityProbe(nowMs = performance.now()) {
  if (!previewOrbitLocked && (!isStageEmbed || !isStageWarmup) || stageSession || previewQualityReady || !enabledVisibleLights().length) {
    qualityProbeStartMs = 0;
    return;
  }
  if (qualityProbeStartMs > 0) {
    const frameIntervalMs = nowMs - qualityProbeStartMs;
    if (frameIntervalMs >= 8 && (frameIntervalMs <= 120 || isStageEmbed && frameIntervalMs <= 2000)) {
      recentFrameMsSamplesCurrent.push(Math.min(frameIntervalMs, 120));
    }
  }
  qualityProbeStartMs = nowMs;
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
function syncCameraModeButtons(mode = getCameraProjectionMode()) {
  for (const button of cameraModeEls) {
    button.classList.toggle("active", button.dataset.cameraMode === mode);
  }
  syncCameraFocalControls(mode);
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
function syncCameraFocalControls(mode = getCameraProjectionMode()) {
  for (const inputEl of cameraFocalLengthEls) {
    syncControlValue(inputEl, Math.round(getCameraFocalLength()));
    inputEl.disabled = mode !== "perspective";
    inputEl.closest(".camera-focal-control")?.classList.toggle("is-disabled", inputEl.disabled);
  }
}
function applyCameraFocalLength(camera = cameraCurrent, focalLength = getCameraFocalLength()) {
  if (camera?.isPerspectiveCamera) {
    camera.setFocalLength(clamp(finite(focalLength, 50), 18, 120));
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
function computeStudioPixelRatio(isEmbedCapture = false) {
  if (isStageEmbed && isEmbedCapture && isAutoDiagramEmbed !== null && (!isStageWarmup || previewOrbitLocked)) {
    return Math.min(window.devicePixelRatio || 1, 1.6) * ur * isAutoDiagramEmbed;
  }
  if (yt) {
    const baseRatio = Math.min(window.devicePixelRatio || 1, 1.6) * ur;
    if (isEmbedCapture) {
      return Math.min(baseRatio, 1);
    } else {
      return baseRatio;
    }
  }
  const isWarmupEmbed = isStageEmbed && isStageWarmup;
  let ratio = Math.min(window.devicePixelRatio || 1, isEmbedCapture ? 1 : 1.6) * (isStageEmbed ? ur : 1);
  if (isStageEmbed && (isEmbedCapture || isWarmupEmbed)) {
    const {
      cost: estimatedCost,
      budget: costBudget
    } = estimateLightRenderCost();
    if (estimatedCost > costBudget) {
      ratio = Math.min(ratio, clamp(Math.sqrt(costBudget / estimatedCost) * 0.85, 0.5, 0.85));
    }
  }
  return ratio;
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
function averagePerfSample(samples) {
  if (samples.length) {
    return samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
  } else {
    return null;
  }
}
function percentileOfSorted(list, percentile) {
  if (!list.length) {
    return null;
  }
  const sorted = [...list].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * percentile) - 1));
  return sorted[index];
}
function fitCameraToSelection(maybeNumber, digits = 1) {
  if (Number.isFinite(maybeNumber)) {
    return Number(maybeNumber.toFixed(digits));
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
function setPerfMotionActive(lastTick, isActive = true) {
  const floorSwitch = isPerfDiagnosticsEnabled && perfStats.floorSwitch;
  if (!!floorSwitch && !(performance.now() > floorSwitch.until)) {
    if (!isActive) {
      floorSwitch.lastTick = null;
      return;
    }
    if (floorSwitch.lastTick != null) {
      const tickMs = lastTick - floorSwitch.lastTick;
      floorSwitch.maxTickMs = Math.max(floorSwitch.maxTickMs || 0, tickMs);
      if (tickMs > 50) {
        floorSwitch.tickLongFrames = (floorSwitch.tickLongFrames || 0) + 1;
      }
    }
    floorSwitch.lastTick = lastTick;
    floorSwitch.checksSinceRender = (floorSwitch.checksSinceRender || 0) + 1;
  }
}
function recordPerfFloorSwitchSample(nowMs, cpuRenderMs, isMotionFrame) {
  if (!isPerfDiagnosticsEnabled) {
    return;
  }
  const stats = perfStats;
  const switchStats = stats.floorSwitch;
  const sampledAt = performance.now();
  if (switchStats && sampledAt <= switchStats.until) {
    const renderGapMs = sampledAt - switchStats.last;
    switchStats.last = sampledAt;
    switchStats.frames++;
    if (renderGapMs > switchStats.maxMs) {
      switchStats.worstFrame = {
        renderGapMs,
        cpuRenderMs: cpuRenderMs,
        checksSinceRender: switchStats.checksSinceRender,
        phases: {
          ...switchStats.pendingPhases
        },
        programs: renderer.info.programs?.length,
        geometries: renderer.info.memory.geometries,
        contact: renderCache ? {
          ...renderCache.stats
        } : null
      };
    }
    switchStats.pendingPhases = {};
    switchStats.checksSinceRender = 0;
    switchStats.maxMs = Math.max(switchStats.maxMs, renderGapMs);
    if (renderGapMs > 50) {
      switchStats.longFrames++;
    }
    switchStats.cpuMs += cpuRenderMs;
    switchStats.maxRenderCpuMs = Math.max(switchStats.maxRenderCpuMs || 0, cpuRenderMs);
    if (cpuRenderMs > 50) {
      switchStats.slowRenderCount = (switchStats.slowRenderCount || 0) + 1;
    }
  }
  if (isMotionFrame) {
    pushBoundedTimingSample(stats.cpuRenderTimes, cpuRenderMs);
    if (stats.lastMotionRenderAt > 0) {
      const frameInterval = nowMs - stats.lastMotionRenderAt;
      if (frameInterval >= 2 && frameInterval <= 250) {
        pushBoundedTimingSample(stats.frameIntervals, frameInterval);
      }
    }
    stats.lastMotionRenderAt = nowMs;
  } else {
    stats.lastMotionRenderAt = 0;
  }
}
function collectSceneMeshStats() {
  const materialSet = new Set();
  const meshes = {
    before: 0,
    after: 0,
    triangles: 0
  };
  let meshCount = 0;
  let lightCount = 0;
  let visibleLightCount = 0;
  let activeShadowCount = 0;
  previewSceneCurrent?.traverse(node => {
    if (node.isMesh) {
      meshCount += 1;
      if (node.userData.runtimeFurnitureStats) {
        for (const statKey of Object.keys(meshes)) {
          meshes[statKey] += node.userData.runtimeFurnitureStats[statKey];
        }
      }
      const materialList = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materialList) {
        if (material) {
          materialSet.add(material);
        }
      }
    }
    if (node.isLight) {
      lightCount += 1;
      if (node.visible !== false && finite(node.intensity, 0) > 0) {
        visibleLightCount += 1;
      }
      if (node.isSpotLight && node.castShadow && node.visible !== false) {
        activeShadowCount += 1;
      }
    }
  });
  if (renderer?.domElement?.dataset.spotShadowMode === "atlas") {
    activeShadowCount = Math.max(activeShadowCount, Math.floor(finite(renderer.domElement.dataset.activeSpotShadows, 0)));
  }
  const activeUserFixtures = collectVisibleLights().filter(({
    item: lightBrightness,
    group: enabled
  }) => enabled?.enabled !== false && finite(lightBrightness.lightBrightness, 0) > 0).length;
  return {
    meshes: meshCount,
    materials: materialSet.size,
    lights: lightCount,
    visibleLights: visibleLightCount,
    activeUserFixtures,
    activeSpotShadows: activeShadowCount,
    runtimeFurniture: meshes
  };
}
function publishPerfHud(nowMs = performance.now()) {
  if (!isPerfDiagnosticsEnabled || !renderer || !perfStats.hud) {
    return;
  }
  const stats = perfStats;
  if (nowMs - stats.lastPublishAt < PERF_HUD_PUBLISH_MS) {
    return;
  }
  stats.lastPublishAt = nowMs;
  const canvasEl = renderer.domElement;
  const avgFrameMs = averagePerfSample(stats.frameIntervals);
  const medianFrameMs = percentileOfSorted(stats.frameIntervals, 0.5);
  const sceneStats = collectSceneMeshStats();
  const programCount = renderer.info.programs?.length;
  const hudPayload = {
    enabled: true,
    floorSwitch: stats.floorSwitch ? {
      target: stats.floorSwitch.target,
      frames: stats.floorSwitch.frames,
      maxFrameMs: fitCameraToSelection(stats.floorSwitch.maxTickMs || 0, 2),
      longFrames: stats.floorSwitch.tickLongFrames || 0,
      maxRenderGapMs: fitCameraToSelection(stats.floorSwitch.maxMs, 2),
      maxRenderCpuMs: fitCameraToSelection(stats.floorSwitch.maxRenderCpuMs || 0, 2),
      slowRenderCount: stats.floorSwitch.slowRenderCount || 0,
      phases: stats.floorSwitch.phases,
      worstFrame: stats.floorSwitch.worstFrame,
      averageCpuMs: fitCameraToSelection(stats.floorSwitch.cpuMs / Math.max(1, stats.floorSwitch.frames), 2)
    } : null,
    motionActive: stats.motionActive,
    frame: {
      samples: stats.frameIntervals.length,
      averageFps: fitCameraToSelection(avgFrameMs ? 1000 / avgFrameMs : null),
      medianFps: fitCameraToSelection(medianFrameMs ? 1000 / medianFrameMs : null),
      p95Ms: fitCameraToSelection(percentileOfSorted(stats.frameIntervals, 0.95), 2)
    },
    cpuRenderMs: {
      samples: stats.cpuRenderTimes.length,
      average: fitCameraToSelection(averagePerfSample(stats.cpuRenderTimes), 2),
      p95: fitCameraToSelection(percentileOfSorted(stats.cpuRenderTimes, 0.95), 2)
    },
    gpuRenderMs: {
      supported: !!stats.gpuExtension,
      status: stats.gpuStatus,
      samples: stats.gpuRenderTimes.length,
      average: fitCameraToSelection(averagePerfSample(stats.gpuRenderTimes), 2),
      p95: fitCameraToSelection(percentileOfSorted(stats.gpuRenderTimes, 0.95), 2)
    },
    render: {
      calls: Number(canvasEl.dataset.renderCalls || 0),
      triangles: Number(canvasEl.dataset.renderTriangles || 0),
      lines: Number(canvasEl.dataset.renderLines || 0)
    },
    memory: {
      geometries: Number(renderer.info.memory.geometries || 0),
      textures: Number(renderer.info.memory.textures || 0),
      programs: Number.isFinite(programCount) ? programCount : null
    },
    scene: sceneStats,
    viewport: {
      devicePixelRatio: fitCameraToSelection(renderer.getPixelRatio(), 2),
      canvasWidth: canvasEl.width,
      canvasHeight: canvasEl.height,
      cssWidth: Math.round(canvasEl.clientWidth),
      cssHeight: Math.round(canvasEl.clientHeight)
    },
    lighting: {
      adaptiveCacheEnabled: previewQualityReady,
      residentCacheMode,
      cacheReady: lightCacheReady
    }
  };
  const fpsText = hudPayload.frame.samples ? hudPayload.frame.averageFps + " / " + hudPayload.frame.medianFps + " FPS · P95 " + hudPayload.frame.p95Ms + " ms" : "移动镜头后采样";
  const gpuText = hudPayload.gpuRenderMs.samples ? hudPayload.gpuRenderMs.average + " ms · P95 " + hudPayload.gpuRenderMs.p95 + " ms" : hudPayload.gpuRenderMs.status;
  stats.hud.innerHTML = ["<strong>3D 性能诊断</strong><span>" + (stats.motionActive ? "交互 / 阻尼中" : "空闲") + "</span>", "<span>帧率</span><b>" + fpsText + "</b>", "<span>CPU 提交</span><b>" + (hudPayload.cpuRenderMs.average ?? "—") + " ms · P95 " + (hudPayload.cpuRenderMs.p95 ?? "—") + " ms</b>", "<span>GPU 渲染</span><b>" + gpuText + "</b>", "<span>绘制</span><b>" + hudPayload.render.calls + " calls · " + hudPayload.render.triangles.toLocaleString() + " tris</b>", "<span>场景</span><b>" + sceneStats.meshes + " mesh · " + sceneStats.materials + " 材质实例</b>", "<span>资源</span><b>" + hudPayload.memory.geometries + " 几何 · " + hudPayload.memory.textures + " 纹理 · " + (hudPayload.memory.programs ?? "—") + " 程序</b>", "<span>灯光</span><b>" + sceneStats.visibleLights + "/" + sceneStats.lights + " 可见 · " + sceneStats.activeUserFixtures + " 用户灯 · " + sceneStats.activeSpotShadows + " 阴影</b>", "<span>画布</span><b>" + hudPayload.viewport.canvasWidth + "×" + hudPayload.viewport.canvasHeight + " · DPR " + hudPayload.viewport.devicePixelRatio + "</b>", "<span>光照缓存</span><b>" + (hudPayload.lighting.adaptiveCacheEnabled ? "自适应" : hudPayload.lighting.residentCacheMode ? "驻留" : "实时") + "</b>"].join("");
  document.documentElement.dataset.performanceDiagnostics = JSON.stringify(hudPayload);
}
function updatePerfMotionState(framesPerSecond, motionActive) {
  if (isPerfDiagnosticsEnabled) {
    perfStats.motionActive = motionActive;
    if (!motionActive) {
      perfStats.lastMotionRenderAt = 0;
    }
    collectGpuTimingResults();
    publishPerfHud(framesPerSecond);
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
function capturePreviewCanvas(cacheKey, bitmapCanvas, shouldCapture) {
  Ds?.cancel();
  const controls = orbitControls;
  const captureJob = {
    cancelled: false,
    frame: null,
    timer: null,
    idle: null,
    cancel: null
  };
  const isStillActive = () => !captureJob.cancelled && shouldCapture();
  const cancelCapture = () => {
    captureJob.cancelled = true;
    if (captureJob.frame !== null) {
      window.cancelAnimationFrame(captureJob.frame);
    }
    if (captureJob.timer !== null) {
      window.clearTimeout(captureJob.timer);
    }
    if (captureJob.idle !== null) {
      window.cancelIdleCallback?.(captureJob.idle);
    }
    captureJob.frame = captureJob.timer = captureJob.idle = null;
    window.removeEventListener("pagehide", cancelCapture);
    window.removeEventListener("pointerdown", cancelCapture, true);
    window.removeEventListener("wheel", cancelCapture, true);
    controls?.removeEventListener("start", cancelCapture);
    controls?.removeEventListener("change", cancelCapture);
    if (bitmapCanvas) {
      bitmapCanvas.width = bitmapCanvas.height = 0;
      bitmapCanvas = null;
    }
    if (Ds === captureJob) {
      Ds = null;
    }
  };
  captureJob.cancel = cancelCapture;
  Ds = captureJob;
  const logCacheWriteError = loggedError => window.HABridgeLog?.error(loggedError, {
    phase: "interaction3d-cache-write"
  });
  const writeCacheWhenIdle = () => {
    captureJob.idle = null;
    Promise.resolve().then(() => {
      if (isStillActive()) {
        return cache?.write(cacheKey, bitmapCanvas, isStillActive);
      }
    }).catch(logCacheWriteError).finally(cancelCapture);
  };
  try {
    window.addEventListener("pagehide", cancelCapture, {
      once: true
    });
    window.addEventListener("pointerdown", cancelCapture, {
      capture: true,
      passive: true
    });
    window.addEventListener("wheel", cancelCapture, {
      capture: true,
      passive: true
    });
    controls?.addEventListener("start", cancelCapture);
    controls?.addEventListener("change", cancelCapture);
    captureJob.frame = window.requestAnimationFrame(() => {
      captureJob.frame = null;
      if (!isStillActive()) {
        cancelCapture();
        return;
      }
      captureJob.timer = window.setTimeout(() => {
        captureJob.timer = null;
        if (!isStillActive()) {
          cancelCapture();
          return;
        }
        try {
          if (typeof window.requestIdleCallback == "function") {
            captureJob.idle = window.requestIdleCallback(writeCacheWhenIdle);
          } else {
            writeCacheWhenIdle();
          }
        } catch (writeError) {
          cancelCapture();
          logCacheWriteError(writeError);
        }
      }, 180);
    });
  } catch (setupError) {
    cancelCapture();
    logCacheWriteError(setupError);
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
      const snapshotContext = rect.getContext("2d");
      if (!snapshotContext) {
        throw new Error("当前浏览器无法创建静止画面缓存。");
      }
      snapshotContext.drawImage(domElement, 0, 0);
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
  const previewContext = previewLightCache.getContext("2d");
  if (previewContext) {
    previewContext.clearRect(0, 0, previewLightCache.width, previewLightCache.height);
    for (const [value, tileCanvas] of map) {
      const clampCurrent = clamp(finite(pendingModelLoads.get(value), 0), 0, 1);
      if (!(clampCurrent <= 0.001)) {
        previewContext.save();
        previewContext.globalAlpha = clampCurrent;
        previewContext.drawImage(tileCanvas, 0, 0);
        previewContext.restore();
      }
    }
  }
}
function scheduleLightCacheForGroups(requestedGroupIds, cacheDurationMs = LIGHT_CACHE_TILE_MS) {
  const groupIds = [...new Set(requestedGroupIds)].filter(Boolean);
  if (!groupIds.length) {
    return;
  }
  const groupFades = groupIds.map(rawGroupId => ({
    groupId: previewScopedItemKey(activeFloorId, rawGroupId),
    from: clamp(finite(pendingModelLoads.get(previewScopedItemKey(activeFloorId, rawGroupId)), findLightGroupById(rawGroupId)?.enabled === false ? 0 : 1), 0, 1),
    to: findLightGroupById(rawGroupId)?.enabled === false ? 0 : 1
  }));
  cancelAnimationFrame(recentFrameMsSamples);
  if (!lightCacheReady) {
    for (const groupId of groupFades) {
      pendingModelLoads.set(groupId.groupId, groupId.to);
    }
    if (!isBakingLightCache) {
      scheduleAdaptiveQuality(0);
    }
    return;
  }
  const startedAt = performance.now();
  const nowResult = nowMs => {
    const progress = clamp((nowMs - startedAt) / cacheDurationMs, 0, 1);
    const eased = progress * progress * (3 - progress * 2);
    for (const fade of groupFades) {
      pendingModelLoads.set(fade.groupId, fade.from + (fade.to - fade.from) * eased);
    }
    blitLightCacheToOverlay();
    if (progress < 1) {
      recentFrameMsSamples = requestAnimationFrame(nowResult);
    } else {
      recentFrameMsSamples = 0;
    }
  };
  recentFrameMsSamples = requestAnimationFrame(nowResult);
}
function findLightGroupById(lightGroupId) {
  return floorSceneCurrent.lightGroups?.find(lightGroup => lightGroup.id === lightGroupId) || null;
}
function warmLightCacheMeshesForGroups(lightGroupIds, cacheDurationMs = LIGHT_CACHE_TILE_MS) {
  if (!worldGroup) {
    return false;
  }
  const groupIds = new Set(lightGroupIds);
  const canWarmLightCache = isPreviewQualityReady() && !stageSession;
  const warmCacheMeshList = [];
  worldGroup.traverse(object => {
    if (!object.isLight || !groupIds.has(object.userData?.lightGroupId)) {
      return;
    }
    const targetIntensity = findLightGroupById(object.userData.lightGroupId)?.enabled !== false && !canWarmLightCache ? finite(object.userData.lightOnIntensity, 0) : 0;
    if (targetIntensity > 0) {
      object.visible = true;
    }
    warmCacheMeshList.push({
      object: object,
      from: finite(object.intensity, 0),
      to: targetIntensity
    });
  });
  if (!warmCacheMeshList.length) {
    return false;
  }
  if (warmCacheMeshList.some(({
    to: groupIntensity
  }) => groupIntensity > 0)) {
    syncSpotShadowCastingLights(worldGroup, {
      rebuildAtlas: false
    });
  }
  cancelAnimationFrame(is);
  const startedAt = performance.now();
  const advanceFade = nowMs => {
    const progress = clamp((nowMs - startedAt) / cacheDurationMs, 0, 1);
    const eased = progress * progress * (3 - progress * 2);
    for (const mesh of warmCacheMeshList) {
      mesh.object.intensity = mesh.from + (mesh.to - mesh.from) * eased;
    }
    updateLightPreview();
    if (progress < 1) {
      is = requestAnimationFrame(advanceFade);
    } else {
      is = 0;
      let needsSync = false;
      for (const entry of warmCacheMeshList) {
        if (!(entry.to > 0)) {
          entry.object.visible = false;
          needsSync = true;
        }
      }
      if (needsSync) {
        syncSpotShadowCastingLights(worldGroup, {
          rebuildAtlas: false
        });
      }
    }
  };
  is = requestAnimationFrame(advanceFade);
  return true;
}
function requestLightGroupCacheRefresh(groupKeys) {
  const filtered = [...new Set(groupKeys)].filter(Boolean);
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
    const lightItemId = object3d.userData?.lightItemId;
    if (!object3d.isLight || !lightItemId) {
      return;
    }
    const layerKey = layerScopedKey(object3d.userData?.lightFloorId, lightItemId);
    if (!lookupMap.has(layerKey)) {
      lookupMap.set(layerKey, []);
    }
    lookupMap.get(layerKey).push(object3d);
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
function runWithResidentFloorCache(entries, lightCache) {
  const savedScene = floorSceneCurrent;
  const savedFloorId = activeFloorId;
  const savedCacheMode = residentCacheMode;
  const isAllFloors = getPreviewFloorModeCurrent() === "all";
  try {
    residentCacheMode = true;
    for (const {
      floor: floorRecord,
      item: item,
      itemKey: itemKey
    } of entries) {
      if (lightCache.has(itemKey) || !isAllFloors && floorRecord.id !== savedFloorId) {
        continue;
      }
      const addedObject = isAllFloors ? worldGroup?.children.find(existingLayer => existingLayer.userData?.floorId === floorRecord.id) : worldGroup;
      if (!addedObject) {
        continue;
      }
      floorSceneCurrent = floorRecord.scene;
      activeFloorId = floorRecord.id;
      const pixelsPerMeterValue = pixelsPerMeter();
      if (!pixelsPerMeterValue) {
        continue;
      }
      const planBounds = getPreviewFloorMode();
      const originX = isAllFloors ? finite(floorRecord.originX, 0) : (planBounds.minX + planBounds.maxX) / 2;
      const originY = isAllFloors ? finite(floorRecord.originY, 0) : (planBounds.minY + planBounds.maxY) / 2;
      const layerGroup = new THREE.Group();
      buildWallCornerCaps(layerGroup, item, shadowCastingLightIdSet());
      layerGroup.position.set((item.x - originX) / pixelsPerMeterValue, item.elevation || 0, (item.y - originY) / pixelsPerMeterValue);
      instanceMergeIdenticalItems(layerGroup, item);
      layerGroup.userData.modelLayer = "lights";
      layerGroup.userData.exportRole = "plan";
      addedObject.add(layerGroup);
      if (isStageEmbed) {
        cacheObjectTransforms(layerGroup, THREE.Object3D);
      }
      const lights = [];
      layerGroup.traverse(isLight => {
        if (isLight.isLight) {
          lights.push(isLight);
        }
      });
      if (lights.length) {
        lightCache.set(itemKey, lights);
      }
    }
  } finally {
    floorSceneCurrent = savedScene;
    activeFloorId = savedFloorId;
    residentCacheMode = savedCacheMode;
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: false
  });
  return lightCache;
}
function setGroupVisibilityByKey(lightGroups, activeKey = "") {
  for (const [key, lights] of lightGroups) {
    const visible = key === activeKey;
    for (const light of lights) {
      light.visible = visible;
      light.intensity = visible ? finite(light.userData?.lightOnIntensity, 0) : 0;
      if (light.isSpotLight) {
        light.castShadow = visible;
        if (visible && light.shadow && !light.shadow.map) {
          light.shadow.needsUpdate = true;
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
function syncLightGroupVisibility(lightsByGroup) {
  const enabledGroupKeys = enabledVisibleLightKeys();
  for (const [groupKey, lights] of lightsByGroup) {
    const isGroupEnabled = enabledGroupKeys.has(groupKey);
    for (const light of lights) {
      light.visible = isGroupEnabled;
      light.intensity = isGroupEnabled ? finite(light.userData?.lightOnIntensity, 0) : 0;
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
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
function createOffscreenCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });
  if (!ctx) {
    throw new Error("当前浏览器无法创建多灯缓存画布。");
  }
  ctx.drawImage(renderer.domElement, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}
function warmPreviewRenderer() {
  for (let frame = 0; frame < 3; frame += 1) {
    renderer.render(previewSceneCurrent, cameraCurrent);
  }
}
function yieldToScheduler() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }
}
function yieldToIdle() {
  if (globalThis.scheduler?.yield) {
    return globalThis.scheduler.yield();
  } else if (globalThis.requestIdleCallback) {
    return new Promise(resolveIdle => requestIdleCallback(() => resolveIdle(), {
      timeout: 80
    }));
  } else {
    return new Promise(resolveFrame => requestAnimationFrame(() => resolveFrame()));
  }
}
function scheduleAdaptiveQuality(delayMs = 420) {
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
    }, delayMs);
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
    const previewContext = previewLightCache.getContext("2d");
    if (!previewContext) {
      throw new Error("当前浏览器无法显示多灯缓存。");
    }
    if (previewLightCache.hidden || !lightCacheReady || previewLightCache.width !== width || previewLightCache.height !== height) {
      previewLightCache.width = width;
      previewLightCache.height = height;
      previewContext.clearRect(0, 0, width, height);
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
function setPreviewPixelRatio(pixelRatio, {
  preserveLightCache: preserveLightCache = false
} = {}) {
  if (!renderer || stageSession && !isAutoDiagramEmbedCurrent) {
    return;
  }
  const targetRatio = stageSession ? stageEmbedPixelRatio(pixelRatio) : computeStudioPixelRatio(pixelRatio);
  if (Math.abs(renderer.getPixelRatio() - targetRatio) > 0.000001) {
    renderer.setPixelRatio(targetRatio);
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
function setActiveFixedCameraView(cameraView) {
  if (getPreviewFloorModeCurrent() === "all") {
    projectDocCurrent.combinedFixedCameraView = cameraView;
  } else {
    floorSceneCurrent.settings.fixedCameraView = cameraView;
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
function getCameraPose(camera = cameraCurrent, target = orbitControls?.target) {
  if (!camera || !target) {
    return false;
  }
  const distance = Math.max(camera.position.distanceTo(target), 1);
  const near = camera.isPerspectiveCamera ? clamp(distance * lm, am, sm) : 0.02;
  const far = Math.max(distance * (camera.isPerspectiveCamera ? 8 : 5), 100);
  if (Math.abs(camera.near - near) < 0.000001 && Math.abs(camera.far - far) < 0.0001) {
    return false;
  } else {
    camera.near = near;
    camera.far = far;
    camera.updateProjectionMatrix();
    return true;
  }
}
function resetOrbitTarget(camera, target) {
  if (camera?.isOrthographicCamera) {
    return Math.abs(camera.top - camera.bottom) / Math.max(camera.zoom || 1, 0.000001);
  }
  if (camera?.isPerspectiveCamera) {
    const distance = Math.max(camera.position.distanceTo(target), 0.0001);
    const rad = THREE.MathUtils.degToRad(camera.getEffectiveFOV());
    return distance * 2 * Math.tan(rad / 2);
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
function nudgeCamera(cameraView, options = {}) {
  const viewMode = cameraView === "top" ? "top" : "free";
  const topRotation = topViewRotation();
  syncCameraViewButtons(viewMode);
  if (!cameraCurrent || !orbitControls) {
    return;
  }
  if (cameraCurrent.userData.cameraView === viewMode && (viewMode !== "top" || cameraCurrent.userData.topRotation === topRotation) && options.force !== true) {
    syncOrbitControls();
    return;
  }
  if (viewMode === "free") {
    applyCameraViewCurrent({
      view: "free"
    });
    return;
  }
  const orbitTarget = orbitControls.target.clone();
  const orbitRadius = resetOrbitTarget(cameraCurrent, orbitTarget);
  const topDistance = Math.max(cameraCurrent.position.distanceTo(orbitTarget), 8);
  cameraCurrent.up.copy(topViewForwardVector(topRotation));
  if (cameraCurrent.isPerspectiveCamera) {
    applyCameraFocalLength();
    const halfFov = THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV());
    const heightOffset = Math.max(orbitRadius / (Math.tan(halfFov / 2) * 2), 8);
    cameraCurrent.position.set(orbitTarget.x, orbitTarget.y + heightOffset, orbitTarget.z);
  } else {
    focusCameraOnPoint(orbitRadius, cameraCurrent.userData.viewportAspect || 1, cameraCurrent);
    cameraCurrent.position.set(orbitTarget.x, orbitTarget.y + topDistance, orbitTarget.z);
  }
  cameraCurrent.userData.frameSize = orbitRadius;
  cameraCurrent.userData.cameraView = "top";
  cameraCurrent.userData.topRotation = topRotation;
  getCameraPose(cameraCurrent, orbitTarget);
  cameraCurrent.lookAt(orbitTarget);
  cameraCurrent.updateProjectionMatrix();
  orbitControls.target.copy(orbitTarget);
  syncOrbitControls();
  orbitControls.update();
}
function setCameraProjectionMode(view, viewportAspect = {}) {
  const viewMode = view === "perspective" ? "perspective" : "orthographic";
  syncCameraModeButtons(viewMode);
  if (!renderer) {
    return;
  }
  if (viewMode === "perspective" == !!cameraCurrent?.isPerspectiveCamera) {
    applyCameraFocalLength();
    syncOrbitControls();
    return;
  }
  const preserveView = viewportAspect.preserveView !== false;
  const previousCamera = cameraCurrent;
  const orbitTarget = orbitControls?.target.clone() || new THREE.Vector3(0, 0.6, 0);
  const cameraOffset = previousCamera ? previousCamera.position.clone().sub(orbitTarget) : new THREE.Vector3(1.12, 1.42, 1.2);
  const currentDistance = Math.max(cameraOffset.length(), 2);
  const normalize = cameraOffset.lengthSq() > 1e-8 ? cameraOffset.normalize() : new THREE.Vector3(1.12, 1.42, 1.2).normalize();
  const aspect = previousCamera?.userData.viewportAspect || Math.max(selectEl("#preview-3d").clientWidth / Math.max(selectEl("#preview-3d").clientHeight, 1), 0.1);
  const frameSize = preserveView && previousCamera ? resetOrbitTarget(previousCamera, orbitTarget) : previousCamera?.userData.frameSize || 10;
  orbitControls?.dispose();
  if (viewMode === "perspective") {
    cameraCurrent = new THREE.PerspectiveCamera(36, aspect, 0.02, 200);
    applyCameraFocalLength(cameraCurrent);
    const halfFrameHeight = frameSize / (Math.tan(THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV()) / 2) * 2);
    const cameraDistance = preserveView ? halfFrameHeight : currentDistance;
    cameraCurrent.position.copy(orbitTarget).addScaledVector(normalize, Math.max(cameraDistance, 2));
  } else {
    cameraCurrent = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.02, 200);
    cameraCurrent.position.copy(orbitTarget).addScaledVector(normalize, currentDistance);
    focusCameraOnPoint(frameSize, aspect, cameraCurrent);
  }
  cameraCurrent.layers.enable(HELPER_LAYER);
  cameraCurrent.userData.viewportAspect = aspect;
  cameraCurrent.userData.frameSize = frameSize;
  cameraCurrent.userData.cameraView = previousCamera?.userData.cameraView || "free";
  cameraCurrent.userData.topRotation = previousCamera?.userData.topRotation || 0;
  cameraCurrent.up.copy(previousCamera?.up || new THREE.Vector3(0, 1, 0));
  getCameraPose(cameraCurrent, orbitTarget);
  cameraCurrent.lookAt(orbitTarget);
  cameraCurrent.updateProjectionMatrix();
  orbitControls = createOrbitControls(cameraCurrent);
  orbitControls.target.copy(orbitTarget);
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
        step(event) {
          const handlerResult = handler(event);
          renderer.domElement.dataset.renderFrameChecks = String(demandFrameLoop.stats.frames);
          return handlerResult;
        }
      });
      const wakeFrameLoop = () => demandFrameLoop.wake();
      const callback = () => {
        nowResult = performance.now();
        const loopAvailable = !document.hidden && Vo;
        demandFrameLoop.setAvailable(loopAvailable);
        if (loopAvailable) {
          updateLightPreview();
          if (previewQualityJustBecameReady) {
            scheduleAdaptiveQuality();
          }
        } else {
          window.clearTimeout(stageSessionEndTimer);
          stageSessionEndTimer = null;
        }
      };
      const handleParentVisibilityChange = detail => {
        Vo = detail.detail === true;
        callback();
        if (Vo && ORBIT_DOLLY_SPEED_SCALE) {
          scheduleOrbitInteractionWarmup();
        }
      };
      renderer.domElement.addEventListener("hb-i3d-parent-visibility", handleParentVisibilityChange);
      for (const eventType of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
        renderer.domElement.addEventListener(eventType, wakeFrameLoop, {
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
        renderer.domElement.removeEventListener("hb-i3d-parent-visibility", handleParentVisibilityChange);
        for (const removedEventType of ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"]) {
          renderer.domElement.removeEventListener(removedEventType, wakeFrameLoop);
        }
      }, {
        once: true
      });
      callback();
      wakeFrameLoop();
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
function focusCameraOnPoint(frameHeight, aspect, left = cameraCurrent) {
  if (!left?.isOrthographicCamera) {
    return;
  }
  const halfHeight = Math.max(frameHeight, 1) / 2;
  if (aspect >= 1) {
    left.left = -halfHeight * aspect;
    left.right = halfHeight * aspect;
    left.top = halfHeight;
    left.bottom = -halfHeight;
  } else {
    left.left = -halfHeight;
    left.right = halfHeight;
    left.top = halfHeight / Math.max(aspect, 0.1);
    left.bottom = -halfHeight / Math.max(aspect, 0.1);
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
function onExportDimensionInput(dimension, silent = false) {
  const typedValue = Number((dimension === "width" ? exportWidth : exportHeight).value);
  if (!Number.isFinite(typedValue) || typedValue <= 0) {
    return;
  }
  let widthPx = dimension === "width" ? typedValue : Number(exportWidth.value);
  let heightPx = dimension === "height" ? typedValue : Number(exportHeight.value);
  widthPx = Number.isFinite(widthPx) && widthPx > 0 ? widthPx : hc;
  heightPx = Number.isFinite(heightPx) && heightPx > 0 ? heightPx : fc;
  if (exportLockRatio.checked) {
    if (dimension === "width") {
      if (silent) {
        widthPx = clamp(widthPx, 320, 4096);
        heightPx = Math.round(widthPx / Tn);
        if (heightPx < 320) {
          heightPx = 320;
          widthPx = Math.round(heightPx * Tn);
        }
        if (heightPx > 4096) {
          heightPx = 4096;
          widthPx = Math.round(heightPx * Tn);
        }
      } else {
        heightPx = Math.round(clamp(widthPx / Tn, 320, 4096));
      }
    } else if (silent) {
      heightPx = clamp(heightPx, 320, 4096);
      widthPx = Math.round(heightPx * Tn);
      if (widthPx < 320) {
        widthPx = 320;
        heightPx = Math.round(widthPx / Tn);
      }
      if (widthPx > 4096) {
        widthPx = 4096;
        heightPx = Math.round(widthPx / Tn);
      }
    } else {
      widthPx = Math.round(clamp(heightPx * Tn, 320, 4096));
    }
  }
  if (silent) {
    widthPx = Math.round(clamp(widthPx, 320, 4096));
    heightPx = Math.round(clamp(heightPx, 320, 4096));
    exportWidth.value = String(widthPx);
    exportHeight.value = String(heightPx);
  } else if (exportLockRatio.checked) {
    if (dimension === "width") {
      exportHeight.value = String(heightPx);
    } else {
      exportWidth.value = String(widthPx);
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
  const presets = normalizeExportPresetSlots(projectDocCurrent?.exportPresets);
  const slot = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, presets.length);
  projectDocCurrent.exportPresets = presets;
  projectDocCurrent.activeExportPresetSlot = slot;
  const lookupMap = new Map((projectDocCurrent?.floors || []).map(floorRef => [floorRef.id, floorRef.name]));
  h0.replaceChildren(...presets.map((preset, presetIndex) => {
    const element = document.createElement("button");
    element.type = "button";
    element.dataset.exportPresetSlot = String(presetIndex);
    element.setAttribute("role", "tab");
    const titleEl = document.createElement("strong");
    const statusEl = document.createElement("small");
    titleEl.textContent = preset?.name || lookupMap.get(preset?.floorId) || "未命名存档";
    statusEl.textContent = preset ? "已设置" : "未设置";
    const isActive = presetIndex === slot;
    element.classList.toggle("active", isActive);
    element.classList.toggle("has-value", !!preset);
    element.setAttribute("aria-selected", String(isActive));
    element.title = preset ? titleEl.textContent + "：已设置" : titleEl.textContent + "：未设置";
    element.append(titleEl, statusEl);
    return element;
  }));
  const activePreset = presets[slot];
  f0.disabled = presets.length >= MAX_EXPORT_PRESET_COUNT;
  g0.disabled = !activePreset;
  p0.disabled = presets.length <= 1;
  const presetIsEmpty = exportPresetIsEmpty(activePreset, exportPresetEditorOpenCurrent);
  gg.hidden = !presetIsEmpty;
  pg.textContent = activePreset ? defaultExportPresetLabel(activePreset, slot) + "已设置" : "当前存档尚未设置";
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
  const televisionOn = has.has("televisionOn");
  const present = has.has("vehicleCharging");
  for (const dataset of exportDialog.querySelectorAll("input[data-export-file]")) {
    const prefixText = dataset.dataset.exportFile;
    dataset.checked = has.has(prefixText) || televisionOn && prefixText.startsWith("screen:") || present && prefixText.startsWith("vehicle:");
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
function selectExportPresetIndex(slotIndex) {
  const slotCount = projectDocCurrent?.exportPresets?.length || 0;
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= slotCount || orbitSuspended) {
    return;
  }
  flushExportUiDebounce();
  projectDocCurrent.activeExportPresetSlot = slotIndex;
  const activated = activateExportPresetSlot(slotIndex);
  exportPresetEditorOpenCurrent = false;
  normalizeProjectExportPresets();
  scheduleSave();
  if (!activated) {
    exportStatus.textContent = "存档 " + String(slotIndex + 1).padStart(2, "0") + " 没有设置";
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
function defaultExportPresetLabel(preset, index) {
  if (!preset) {
    return "存档 " + String(index + 1).padStart(2, "0");
  }
  const floorName = (projectDocCurrent?.floors || []).find(item => item.id === preset.floorId)?.name;
  return preset.name || floorName || "存档 " + String(index + 1).padStart(2, "0");
}
function uniqueExportPresetLabel(label, presetIndex = -1) {
  const text = normalizeLabelText(label, "导出视角", 24);
  const usedLabels = new Set((projectDocCurrent?.exportPresets || []).map((preset, index) => index === presetIndex ? "" : defaultExportPresetLabel(preset, index)).filter(Boolean));
  if (!usedLabels.has(text)) {
    return text;
  }
  let suffix = 2;
  while (usedLabels.has(text + " " + suffix)) {
    suffix += 1;
  }
  return (text + " " + suffix).slice(0, 24);
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
function postAutoDiagramMessage(attempt = 0) {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window) {
    requestAnimationFrame(() => {
      if (!stageSession || !renderer || !previewSceneCurrent || !cameraCurrent || !orbitControls) {
        return;
      }
      resizeStageEmbedViewport();
      if (!worldGroup?.children?.length) {
        rebuildWorldPreviewCurrent();
      }
      const hasViewport = exportPreviewStage.clientWidth > 1 && exportPreviewStage.clientHeight > 1;
      const hasWorldModel = !!worldGroup?.children?.length;
      let didRender = false;
      if (hasViewport && hasWorldModel) {
        requestRender({
          shadows: true
        });
        orbitControls.update();
        for (let renderPass = 0; renderPass < 2; renderPass += 1) {
          renderer.render(previewSceneCurrent, cameraCurrent);
        }
        const renderStats = renderer.info.render;
        didRender = renderStats.calls > 0 && renderStats.triangles > 0;
        renderer.domElement.dataset.renderCalls = String(renderStats.calls);
        renderer.domElement.dataset.renderTriangles = String(renderStats.triangles);
        renderer.domElement.dataset.renderLines = String(renderStats.lines);
        needsRenderFrame = false;
        renderIdle = didRender;
        initRenderStatsHud();
      }
      if (!didRender && attempt < 7) {
        postAutoDiagramMessage(attempt + 1);
        return;
      }
      if (!didRender) {
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
        floors: projectDocCurrent.floors.map(floor => ({
          id: floor.id,
          name: floor.name
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
    selectedMany: multiSelection.map(selectionEntry => ({
      ...selectionEntry
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
  const handler = (exportFileName, labelText, detailText) => {
    const listItem = document.createElement("li");
    const labelEl = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.exportFile = exportFileName;
    const nameSpan = document.createElement("span");
    nameSpan.textContent = labelText;
    const detailSpan = document.createElement("small");
    detailSpan.textContent = detailText;
    labelEl.append(checkbox, nameSpan);
    listItem.append(labelEl, detailSpan);
    listCurrent.push(listItem);
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
  return new Promise((resolve, reject) => {
    blob.toBlob(resultBlob => {
      if (resultBlob) {
        resolve(resultBlob);
      } else {
        reject(new Error("无法生成导出图像。"));
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
async function composeExportCanvas(previousLightCache, currentLightCache) {
  const outCanvas = document.createElement("canvas");
  outCanvas.width = previousLightCache.width;
  outCanvas.height = previousLightCache.height;
  const outContext = outCanvas.getContext("2d");
  if (!outContext) {
    throw new Error("当前浏览器无法创建透明灯光层。");
  }
  const deltaPixels = buildLightDeltaPixels(previousLightCache.data, currentLightCache.data);
  outContext.putImageData(new ImageData(deltaPixels, previousLightCache.width, previousLightCache.height), 0, 0);
  return canvasToBlob(outCanvas);
}
async function drawExportAnnotations(data, lights, canvasWidth, canvasHeight, lightGroupIndex, lightGroupTotal) {
  const compositeCanvas = document.createElement("canvas");
  compositeCanvas.width = canvasWidth;
  compositeCanvas.height = canvasHeight;
  const compositeContext = compositeCanvas.getContext("2d");
  const scratchCanvas = document.createElement("canvas");
  scratchCanvas.width = canvasWidth;
  scratchCanvas.height = canvasHeight;
  const scratchContext = scratchCanvas.getContext("2d");
  if (!compositeContext || !scratchContext) {
    throw new Error("当前浏览器无法合成逐灯阴影。");
  }
  const visibleLightGroups = lights.lights.filter(lightBrightness => finite(lightBrightness.lightBrightness, 0) > 0);
  try {
    for (let groupCursor = 0; groupCursor < visibleLightGroups.length; groupCursor += 1) {
      const lightGroup = visibleLightGroups[groupCursor];
      exportStatus.textContent = "正在渲染灯组 " + (lightGroupIndex + 1) + "/" + lightGroupTotal + "：" + lights.name + "（" + (groupCursor + 1) + "/" + visibleLightGroups.length + "）";
      forcedVisibleLightGroupIds = new Set([lightGroup.id]);
      if (getPreviewFloorModeCurrent() === "all") {
        rebuildWorldPreviewCurrent({
          preserveLightCache: true
        });
      } else {
        rebuildPreviewLightMeshesCurrent({
          preserveLightCache: true
        });
      }
      const captureResult = await capturePreviewCanvasCurrent(canvasWidth, canvasHeight, {
        pixels: true
      });
      const pixels = buildLightDeltaPixels(data.data, captureResult.imageData.data);
      scratchContext.clearRect(0, 0, canvasWidth, canvasHeight);
      scratchContext.putImageData(new ImageData(pixels, canvasWidth, canvasHeight), 0, 0);
      compositeContext.drawImage(scratchCanvas, 0, 0);
      await yieldToScheduler();
    }
  } finally {
    forcedVisibleLightGroupIds = null;
  }
  return canvasToBlob(compositeCanvas);
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
function sanitizeExportFileName(rawName, fallbackName) {
  return String(rawName || "").normalize("NFKC").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || fallbackName;
}
function uniqueExportFileName(baseName, lightGroupIndex, usedNames, extension = EXPORT_IMAGE_EXTENSION) {
  const sanitizedName = sanitizeExportFileName(baseName, "灯组-" + (lightGroupIndex + 1));
  const extensionSuffix = String(extension).replace(/^\./, "");
  let attempt = 1;
  let candidate = sanitizedName + "." + extensionSuffix;
  while (usedNames.has(candidate.toLocaleLowerCase())) {
    attempt += 1;
    candidate = sanitizedName + "-" + attempt + "." + extensionSuffix;
  }
  usedNames.add(candidate.toLocaleLowerCase());
  return candidate;
}
function captureCameraPoseSnapshot(viewportWidth, viewportHeight) {
  const orbitTarget = orbitControls.target;
  return {
    mode: cameraCurrent.isPerspectiveCamera ? "perspective" : "orthographic",
    position: {
      x: cameraCurrent.position.x,
      y: cameraCurrent.position.y,
      z: cameraCurrent.position.z
    },
    target: {
      x: orbitTarget.x,
      y: orbitTarget.y,
      z: orbitTarget.z
    },
    aspect: viewportWidth / viewportHeight,
    visibleHeight: resetOrbitTarget(cameraCurrent, orbitTarget),
    fov: cameraCurrent.isPerspectiveCamera ? cameraCurrent.fov : null
  };
}
function serializeFloorLightItem(light, scene = activeFloor()) {
  const pixelsPerMeter = scene?.scene?.calibration?.pixelsPerMeter || 1;
  return {
    id: light.id,
    floorId: scene?.id || null,
    type: light.type,
    position: {
      x: light.x / pixelsPerMeter,
      z: light.y / pixelsPerMeter,
      elevation: floorStackOffsetY(scene) + (light.elevation || 0)
    },
    rotation: light.rotation || 0,
    verticalRotation: light.verticalRotation || 0,
    stripRollRotation: light.type === "striplight" && light.stripRollRotation || 0,
    size: {
      width: light.width,
      depth: light.depth
    },
    temperature: light.lightTemperature,
    brightness: light.lightBrightness,
    range: light.lightRange,
    angle: light.lightAngle
  };
}
function projectItemToScreenNorm(item, scene, floorEntries = previewFloorEntries()) {
  if (!item || !scene || !cameraCurrent) {
    return null;
  }
  const pixelsPerMeter = scene.scene?.calibration?.pixelsPerMeter || 1;
  let screenX = 0;
  let screenY = Math.max(0, finite(item.elevation, 0)) + Math.max(0.02, finite(item.height, 0.1)) / 2;
  let screenZ = 0;
  if (getPreviewFloorModeCurrent() === "all") {
    const localX = (finite(item.x, 0) - finite(scene.originX, 0)) / pixelsPerMeter;
    const localY = (finite(item.y, 0) - finite(scene.originY, 0)) / pixelsPerMeter;
    const sceneRotation = -THREE.MathUtils.degToRad(finite(scene.rotation, 0));
    screenX = localX * Math.cos(sceneRotation) + localY * Math.sin(sceneRotation) + finite(scene.offsetX, 0);
    screenZ = -localX * Math.sin(sceneRotation) + localY * Math.cos(sceneRotation) + finite(scene.offsetZ, 0);
    const sortedFloors = [...floorEntries].sort((floorA, floorB) => floorA.elevation - floorB.elevation);
    const floorIndex = Math.max(0, sortedFloors.findIndex(floor => floor.id === scene.id));
    screenY += floorIndex * finite(projectDocCurrent.exportFloorGap, 3);
  } else {
    const sceneData = scene.scene;
    const bounds = sceneData.walls?.length ? modelBounds({
      background: null,
      walls: sceneData.walls,
      items: []
    }) : sceneData.items?.length ? modelBounds({
      background: null,
      walls: [],
      items: sceneData.items
    }) : modelBounds(sceneData);
    screenX = (finite(item.x, 0) - (bounds.minX + bounds.maxX) / 2) / pixelsPerMeter;
    screenZ = (finite(item.y, 0) - (bounds.minY + bounds.maxY) / 2) / pixelsPerMeter;
  }
  cameraCurrent.updateMatrixWorld(true);
  const projected = new THREE.Vector3(screenX, screenY, screenZ).project(cameraCurrent);
  if (![projected.x, projected.y, projected.z].every(Number.isFinite) || projected.z < -1 || projected.z > 1) {
    return null;
  } else {
    return {
      x: clamp((projected.x + 1) / 2, 0, 1),
      y: clamp((1 - projected.y) / 2, 0, 1)
    };
  }
}
function projectItemsToScreenAnchors(items, floorId, floorEntries = previewFloorEntries()) {
  for (const item of items || []) {
    const screenNorm = projectItemToScreenNorm(item, floorId, floorEntries);
    if (screenNorm) {
      return screenNorm;
    }
  }
  return null;
}
async function readFileAsUint8Array(arrayBuffer) {
  return new Uint8Array(await arrayBuffer.arrayBuffer());
}
function applyCrossFloorLayerEnableMasks(floorLightGroupKey = "", tvKey = "", chargerKey = "") {
  for (const {
    key: groupKey,
    group: lightGroup
  } of collectLightGroupsAcrossFloors()) {
    lightGroup.enabled = floorLightGroupKey === "*" || groupKey === floorLightGroupKey;
  }
  for (const {
    key: screenKey,
    item: tv
  } of collectTvsAcrossFloors()) {
    tv.screenEnabled = tvKey === "*" || screenKey === tvKey;
  }
  for (const {
    key: carKey,
    item: car
  } of collectSmallCarsAcrossFloors()) {
    car.chargingEnabled = chargerKey === "*" || carKey === chargerKey;
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
function resolveExportOverwrite(choice = "cancel") {
  const resolver = exportOverwriteResolverCurrent;
  exportOverwriteResolverCurrent = null;
  if (exportOverwriteDialog.open) {
    exportOverwriteDialog.close();
  }
  notifyAutoDiagramInteraction(false);
  resolver?.(choice);
}
function promptExportOverwrite(message) {
  if (exportOverwriteResolverCurrent) {
    resolveExportOverwrite("cancel");
  }
  Mg.textContent = message;
  notifyAutoDiagramInteraction(true);
  exportOverwriteDialog.showModal();
  return new Promise(resolve => {
    exportOverwriteResolverCurrent = resolve;
  });
}
function notifyAutoDiagramExport(reason, message) {
  if (!!isAutoDiagramEmbedCurrent && !!autoDiagramComponentId && window.parent !== window) {
    window.parent.postMessage({
      type: "ha-bridge-floorplan-auto-diagram-stopped",
      componentId: autoDiagramComponentId,
      reason: reason,
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
  const checkedKeys = checkedExportFileKeys();
  if (!checkedKeys.size) {
    exportStatus.textContent = "请至少勾选一项图片";
    return;
  }
  const sourceResolution = readExportResolution();
  const {
    width,
    height
  } = scaledExportResolution(sourceResolution.width, sourceResolution.height, EXPORT_RENDER_SCALE);
  const cameraPose = serializeCameraState();
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
  })).filter(id => checkedKeys.has("group:" + id.id));
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
  const listNext = mapped.filter(key => checkedKeys.has("screen:" + key.key));
  const listPrevious = listCurrent.filter(key => checkedKeys.has("vehicle:" + key.key));
  const hasAnyLayer = checkedKeys.has("backgroundWithPlan") || checkedKeys.has("floorPlan") || listNext.length > 0 || listPrevious.length > 0 || filtered.length > 0;
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
    applyStoredCameraPose(cameraPose, width / height);
    setShadowCameraExpanded(true);
    exportStatus.textContent = "正在生成精细阴影导出图层…";
    applyCrossFloorLayerEnableMasks();
    let isImageData = null;
    let imageData = null;
    if (checkedKeys.has("background")) {
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
    if (hasAnyLayer) {
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
    if (checkedKeys.has("backgroundWithPlan")) {
      const arrayBuffer = await buildExportImageCanvas(width, height, imageData.imageData);
      listLocal.push({
        name: background.backgroundWithPlan,
        data: await readFileAsUint8Array(arrayBuffer)
      });
    }
    if (checkedKeys.has("floorPlan")) {
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
      backgroundImage: checkedKeys.has("background") ? background.background : null,
      baseImage: checkedKeys.has("backgroundWithPlan") ? background.backgroundWithPlan : null,
      floorPlanImage: checkedKeys.has("floorPlan") ? background.floorPlan : null,
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
        ...screenRest
      }) => ({
        ...screenRest,
        anchor: projectItemToScreenNorm(item, floor, list),
        file: checkedKeys.has("screen:" + key) ? screenRest.file : null
      })),
      vehicles: listCurrent.map(({
        key,
        floor,
        item,
        ...vehicleRest
      }) => ({
        ...vehicleRest,
        anchor: projectItemToScreenNorm(item, floor, list),
        file: checkedKeys.has("vehicle:" + key) ? vehicleRest.file : null
      }))
    };
    if (checkedKeys.has("dataLights")) {
      listLocal.push({
        name: "lights.json",
        data: new TextEncoder().encode(JSON.stringify(manifest, null, 2) + "\n")
      });
    }
    if (checkedKeys.has("dataScene")) {
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
    const putStudioDocument = (includeDocument = false) => studioFetch("/studio3d/exports", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/zip",
        "X-Export-Folder": encodeURIComponent(exportName),
        ...(includeDocument ? {
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
    applyStoredCameraPose(cameraPose, width / height);
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
function addBoxMesh(group, width, height, depth, offsetX, offsetY, offsetZ, color, options = {}) {
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
  mesh.position.set(offsetX, offsetY, offsetZ);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  mesh.renderOrder = options.renderOrder ?? 0;
  group.add(mesh);
  return mesh;
}
function normalizeBoxPartSpec(spec) {
  if (Array.isArray(spec)) {
    const [width, height, depth, offsetX = 0, offsetY = 0, offsetZ = 0, rotationY = 0] = spec;
    return {
      width,
      height,
      depth,
      x: offsetX,
      y: offsetY,
      z: offsetZ,
      rotationY
    };
  }
  return {
    width: spec.width,
    height: spec.height,
    depth: spec.depth,
    x: spec.x || 0,
    y: spec.y || 0,
    z: spec.z || 0,
    rotationY: spec.rotationY || 0
  };
}
function buildMergedBoxGeometry(parts) {
  const validParts = parts.map(normalizeBoxPartSpec).filter(part => [part.width, part.height, part.depth].every(dimension => Number.isFinite(dimension) && dimension > 0.0001));
  if (!validParts.length) {
    return null;
  }
  const cacheKey = JSON.stringify(validParts.map(partTuple => [partTuple.width, partTuple.height, partTuple.depth, partTuple.x, partTuple.y, partTuple.z, partTuple.rotationY]));
  if (!mergedBoxGeometryCache.has(cacheKey)) {
    const geometries = validParts.map(partSpec => {
      const boxGeometry = new THREE.BoxGeometry(partSpec.width, partSpec.height, partSpec.depth);
      const transform = new THREE.Matrix4().compose(new THREE.Vector3(partSpec.x, partSpec.y, partSpec.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, partSpec.rotationY, 0)), new THREE.Vector3(1, 1, 1));
      return boxGeometry.applyMatrix4(transform);
    });
    const merged = mergeGeometries(geometries);
    geometries.forEach(geometry => geometry.dispose());
    if (!merged) {
      return null;
    }
    mergedBoxGeometryCache.set(cacheKey, merged);
  }
  return mergedBoxGeometryCache.get(cacheKey);
}
function getCachedMeshStandardMaterial(color, options = {}) {
  const hex = new THREE.Color(color).getHex();
  const cacheKey = JSON.stringify([hex, options.roughness ?? 0.8, options.metalness ?? 0.01, !!options.transparent, options.opacity ?? 1, options.depthWrite ?? true, options.depthFunc ?? THREE.LessEqualDepth, options.side ?? THREE.FrontSide, options.emissive ?? 0, options.emissiveIntensity ?? 0]);
  if (!rugMaterialCache.has(cacheKey)) {
    rugMaterialCache.set(cacheKey, new THREE.MeshStandardMaterial({
      color: hex,
      roughness: options.roughness ?? 0.8,
      metalness: options.metalness ?? 0.01,
      transparent: !!options.transparent,
      opacity: options.opacity ?? 1,
      depthWrite: options.depthWrite ?? true,
      depthFunc: options.depthFunc ?? THREE.LessEqualDepth,
      side: options.side ?? THREE.FrontSide,
      emissive: options.emissive ?? 0,
      emissiveIntensity: options.emissiveIntensity ?? 0
    }));
  }
  return rugMaterialCache.get(cacheKey);
}
function addSharedArchMesh(group, boxSpecs, color, options = {}) {
  const mergedGeometry = buildMergedBoxGeometry(boxSpecs);
  if (!mergedGeometry) {
    return null;
  }
  const mesh = new THREE.Mesh(mergedGeometry, getCachedMeshStandardMaterial(color, options));
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
  mesh.renderOrder = options.renderOrder ?? 0;
  mesh.userData.architectureSharedGeometry = true;
  mesh.userData.architectureSharedMaterial = true;
  group.add(mesh);
  return mesh;
}
function createBoxPartMesh(width, height, depth, offsetX, offsetY, offsetZ) {
  const minSide = Math.max(Math.min(width, height, depth), 0.001);
  const cornerRadius = Math.min(minSide * 0.14, minSide * 0.45, 0.08);
  const boxGeometry = new RoundedBoxGeometry(width, height, depth, 2, cornerRadius);
  boxGeometry.translate(offsetX, offsetY, offsetZ);
  return boxGeometry;
}
function mergeBoxPartGeometries(parts) {
  const geometries = parts.map(partSpec => createBoxPartMesh(...partSpec));
  const merged = mergeGeometries(geometries);
  geometries.forEach(part => part.dispose());
  return merged;
}
function getCachedSofaSeatGeometry(width, height, depth) {
  const cacheKey = width + ":" + height + ":" + depth;
  if (lightPropertyMeta.has(cacheKey)) {
    return lightPropertyMeta.get(cacheKey);
  }
  const frameGeometry = mergeBoxPartGeometries([[width * 0.92, height * 0.28, depth * 0.72, 0, height * 0.28, depth * 0.06], [width * 0.92, height * 0.55, depth * 0.18, 0, height * 0.56, -depth * 0.35], [width * 0.1, height * 0.48, depth * 0.75, -width * 0.46, height * 0.39, depth * 0.03], [width * 0.1, height * 0.48, depth * 0.75, width * 0.46, height * 0.39, depth * 0.03]]);
  const cushionGeometry = mergeBoxPartGeometries([[width * 0.42, height * 0.12, depth * 0.55, -width * 0.22, height * 0.47, depth * 0.07], [width * 0.42, height * 0.12, depth * 0.55, width * 0.22, height * 0.47, depth * 0.07]]);
  const seatGeometry = frameGeometry && cushionGeometry ? {
    frame: frameGeometry,
    cushions: cushionGeometry
  } : null;
  if (seatGeometry) {
    lightPropertyMeta.set(cacheKey, seatGeometry);
  } else {
    frameGeometry?.dispose();
    cushionGeometry?.dispose();
  }
  return seatGeometry;
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
function getCachedRoundedBoxGeometry(width, height, depth) {
  const rugThickness = clamp(height, 0.004, 0.018);
  const cacheKey = width + ":" + rugThickness + ":" + depth;
  if (!isStudioRoute.has(cacheKey)) {
    const minDimension = Math.max(Math.min(width, rugThickness, depth), 0.001);
    const cornerRadius = Math.min(Math.min(width, depth) * 0.018, minDimension * 0.45, 0.08);
    const baseGeometry = new RoundedBoxGeometry(width, rugThickness, depth, 2, cornerRadius);
    const insetGeometry = new THREE.PlaneGeometry(width * 0.88, depth * 0.84);
    isStudioRoute.set(cacheKey, {
      base: baseGeometry,
      inset: insetGeometry,
      rugThickness: rugThickness
    });
  }
  return isStudioRoute.get(cacheKey);
}
function getCachedRugMaterial(colorHex, inset = false) {
  const materialKey = (inset ? "inset" : "base") + ":" + colorHex;
  if (!Zl.has(materialKey)) {
    Zl.set(materialKey, new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 1,
      metalness: 0,
      ...(inset ? {
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -4
      } : {})
    }));
  }
  return Zl.get(materialKey);
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
function createGlassMaterial(mesh, skipTextureCheck = false, forceWhiteColor = false) {
  const material = mesh.material;
  if (!mesh.isMesh || mesh.isSkinnedMesh || mesh.isBatchedMesh || mesh.morphTargetInfluences || Array.isArray(material) || !material?.isMeshStandardMaterial || material.transparent || material.opacity < 1 || material.transmission > 0 || material.alphaHash || material.displacementMap || material.onBeforeCompile !== THREE.Material.prototype.onBeforeCompile || material.customProgramCacheKey !== THREE.Material.prototype.customProgramCacheKey || mesh.onBeforeRender !== THREE.Object3D.prototype.onBeforeRender || material.clippingPlanes?.length || !skipTextureCheck && Object.values(material).some(propertyValue => propertyValue?.isTexture)) {
    return "";
  }
  const signatureParts = [];
  for (const propertyName of Object.keys(material).sort()) {
    if (["id", "uuid", "name", "userData", "version", "_listeners"].includes(propertyName)) {
      continue;
    }
    const entry = material[propertyName];
    if (propertyName === "color" && forceWhiteColor) {
      signatureParts.push([propertyName, [1, 1, 1]]);
      continue;
    }
    if (entry == null || ["number", "boolean", "string"].includes(typeof entry)) {
      signatureParts.push([propertyName, entry]);
    } else if (entry.isTexture) {
      signatureParts.push([propertyName, entry.uuid]);
    } else if (entry.isColor || entry.isVector2 || entry.isVector3 || entry.isVector4 || entry.isMatrix3 || entry.isMatrix4 || entry.isEuler) {
      signatureParts.push([propertyName, entry.toArray()]);
    } else if (Array.isArray(entry) && entry.every(entryItem => ["number", "boolean", "string"].includes(typeof entryItem))) {
      signatureParts.push([propertyName, entry]);
    } else if (propertyName === "defines") {
      signatureParts.push([propertyName, Object.entries(entry).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))]);
    } else {
      return "";
    }
  }
  return JSON.stringify([signatureParts, mesh.castShadow, mesh.receiveShadow, mesh.renderOrder, mesh.layers.mask]);
}
function meshMaterialSignature(mesh) {
  const attributes = Object.entries(mesh.geometry?.attributes || {}).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([attributeName, attribute]) => [attributeName, attribute.itemSize, attribute.normalized, attribute.array?.constructor?.name]);
  return JSON.stringify([!!mesh.geometry?.index, attributes, Object.keys(mesh.geometry?.morphAttributes || {}).sort()]);
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
function mergeSimilarItemMeshes(root, itemType) {
  if (!meshMergeAllowlist.has(itemType)) {
    // Disabled: see the meshMergeAllowlist declaration comment.
    return;
  }
  const meshes = collectDescendantMeshes(root);
  const beforeCount = new Map();
  const lookupMap = new Map();
  for (const mesh of meshes) {
    const geometryParameters = mesh.geometry?.parameters;
    const sharedGeometryKey = geometryParameters ? mesh.geometry.type + ":" + JSON.stringify(geometryParameters) : "";
    if (sharedGeometryKey && beforeCount.has(sharedGeometryKey)) {
      mesh.geometry.dispose();
      mesh.geometry = beforeCount.get(sharedGeometryKey);
    } else if (sharedGeometryKey) {
      beforeCount.set(sharedGeometryKey, mesh.geometry);
    }
    const materialKey = collectChildMeshes(mesh);
    if (materialKey && lookupMap.has(materialKey)) {
      mesh.material.dispose();
      mesh.material = lookupMap.get(materialKey);
    } else if (materialKey) {
      lookupMap.set(materialKey, mesh.material);
    }
  }
  root.userData.optimizationStats = {
    type: itemType,
    before: meshes.length,
    after: meshes.length,
    uniqueGeometries: new Set(meshes.map(geometry => geometry.geometry)).size,
    uniqueMaterials: new Set(meshes.map(material => material.material)).size
  };
}
function addStripLightHelpers(root, itemType) {
  if (!stripLightHelperTypes.has(itemType) || itemType === "curtain") {
    return;
  }
  const meshes = collectDescendantMeshes(root);
  const meshCount = meshes.length;
  const materialGroups = new Map();
  for (const mesh of meshes) {
    if (mesh.userData.televisionScreen || mesh.userData.televisionGlow || mesh.userData.curtainPart) {
      continue;
    }
    const materialKey = createGlassMaterial(mesh);
    if (!materialKey) {
      continue;
    }
    const groupKey = materialKey + ":" + meshMaterialSignature(mesh);
    if (!materialGroups.has(groupKey)) {
      materialGroups.set(groupKey, []);
    }
    materialGroups.get(groupKey).push(mesh);
  }
  root.updateMatrixWorld(true);
  const worldInverse = root.matrixWorld.clone().invert();
  for (const meshGroup of materialGroups.values()) {
    if (meshGroup.length < 2) {
      continue;
    }
    const transformedGeometries = meshGroup.map(sourceMesh => {
      const localMatrix = new THREE.Matrix4().multiplyMatrices(worldInverse, sourceMesh.matrixWorld);
      return sourceMesh.geometry.clone().applyMatrix4(localMatrix);
    });
    const mergedGeometry = mergeGeometries(transformedGeometries);
    transformedGeometries.forEach(dispose => dispose.dispose());
    if (!mergedGeometry) {
      continue;
    }
    const firstMesh = meshGroup[0];
    const mergedMesh = new THREE.Mesh(mergedGeometry, firstMesh.material);
    mergedMesh.castShadow = firstMesh.castShadow;
    mergedMesh.receiveShadow = firstMesh.receiveShadow;
    mergedMesh.renderOrder = firstMesh.renderOrder;
    mergedMesh.userData = {};
    meshGroup.forEach((meshToRemove, index) => {
      meshToRemove.parent?.remove(meshToRemove);
      if (!meshToRemove.userData.externalModelSharedGeometry) {
        meshToRemove.geometry.dispose();
      }
      if (index > 0) {
        meshToRemove.material.dispose();
      }
    });
    root.add(mergedMesh);
  }
  root.userData.optimizationStats = {
    type: itemType,
    before: meshCount,
    after: collectDescendantMeshes(root).length
  };
}
function addSoftBoxMesh(group, radiusTop, radiusBottom, height, offsetX, offsetY, offsetZ, color, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.62,
    metalness: options.metalness ?? 0.03,
    transparent: !!options.transparent,
    opacity: options.opacity ?? 1,
    depthWrite: options.depthWrite ?? true
  });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, options.segments ?? 24), material);
  mesh.position.set(offsetX, offsetY, offsetZ);
  if (options.rotationX) {
    mesh.rotation.x = options.rotationX;
  }
  if (options.rotationZ) {
    mesh.rotation.z = options.rotationZ;
  }
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = options.receiveShadow !== false;
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
function applySelectionHighlight(item, light) {
  if (light.type !== "striplight") {
    return;
  }
  const previewGroup = new THREE.Group();
  previewGroup.userData.exportRole = "light-source-preview";
  previewGroup.userData.lightSourcePreview = true;
  previewGroup.visible = light.lightSourceVisible !== false && !stageSession && isSelected("item", light.id);
  const previewColor = kelvinToRgbHex(light.lightTemperature) || 16762219;
  const depth = clamp(finite(light.depth, 0.28), 0.1, 8);
  const width = clamp(finite(light.width, 1), 0.1, 8);
  const boxDepth = depth;
  const rollGroup = new THREE.Group();
  rollGroup.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(light.verticalRotation));
  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(light.stripRollRotation));
  const coneOffset = clamp(finite(light.lightRange, 3.5) * 0.16, 0.28, 0.72);
  materialFingerprint(addBoxMesh(tiltGroup, width, 0.014, boxDepth, 0, -coneOffset, 0, previewColor, {
    rounded: false,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
    emissive: previewColor,
    emissiveIntensity: 0.68,
    castShadow: false,
    receiveShadow: false
  }));
  materialFingerprint(addSoftBoxMesh(tiltGroup, 0.012, 0.012, coneOffset, 0, -coneOffset * 0.5, 0, previewColor, {
    segments: 10,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    roughness: 0.3,
    emissive: previewColor,
    emissiveIntensity: 0.8
  }));
  const coneMesh = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 10), new THREE.MeshBasicMaterial({
    color: previewColor,
    transparent: true,
    opacity: 0.82,
    depthWrite: false
  }));
  coneMesh.rotation.x = Math.PI;
  coneMesh.position.set(0, -coneOffset, 0);
  materialFingerprint(coneMesh);
  tiltGroup.add(coneMesh);
  rollGroup.add(tiltGroup);
  previewGroup.add(rollGroup);
  item.add(previewGroup);
}
function createWallTopMaterial(width, height, depth) {
  const profileRings = [{
    y: 0,
    halfWidth: width * 0.31,
    backZ: -height * 0.16,
    sideZ: height * 0.08,
    frontZ: height * 0.46
  }, {
    y: depth * 0.42,
    halfWidth: width * 0.43,
    backZ: -height * 0.34,
    sideZ: height * 0.08,
    frontZ: height * 0.47
  }, {
    y: depth * 0.72,
    halfWidth: width * 0.49,
    backZ: -height * 0.47,
    sideZ: height * 0.08,
    frontZ: height * 0.47
  }];
  const buildRingPath = ring => {
    const ringPoints = [new THREE.Vector3(-ring.halfWidth, ring.y, ring.backZ), new THREE.Vector3(ring.halfWidth, ring.y, ring.backZ), new THREE.Vector3(ring.halfWidth, ring.y, ring.sideZ)];
    for (let step = 1; step <= 18; step += 1) {
      const angle = step / 18 * Math.PI;
      ringPoints.push(new THREE.Vector3(Math.cos(angle) * ring.halfWidth, ring.y, ring.sideZ + Math.sin(angle) * (ring.frontZ - ring.sideZ)));
    }
    return ringPoints;
  };
  const ringPaths = profileRings.map(buildRingPath);
  const ringPointCount = ringPaths[0].length;
  const flattened = ringPaths.flatMap(ringPath => ringPath.flatMap(pathPoint => [pathPoint.x, pathPoint.y, pathPoint.z]));
  const indices = [];
  for (let ringIndex = 0; ringIndex < ringPaths.length - 1; ringIndex += 1) {
    const ringStart = ringIndex * ringPointCount;
    const nextRingStart = (ringIndex + 1) * ringPointCount;
    for (let i = 0; i < ringPointCount; i += 1) {
      const nextPoint = (i + 1) % ringPointCount;
      const indexA = ringStart + i;
      const indexB = ringStart + nextPoint;
      const indexC = nextRingStart + i;
      const indexD = nextRingStart + nextPoint;
      indices.push(indexA, indexD, indexB, indexA, indexC, indexD);
    }
  }
  const topCenterIndex = flattened.length / 3;
  flattened.push(0, profileRings[0].y, height * 0.08);
  const bottomCenterIndex = flattened.length / 3;
  flattened.push(0, profileRings.at(-1).y, height * 0.08);
  const lastRingStart = (ringPaths.length - 1) * ringPointCount;
  for (let i = 0; i < ringPointCount; i += 1) {
    const wrappedNextPoint = (i + 1) % ringPointCount;
    indices.push(topCenterIndex, i, wrappedNextPoint);
    indices.push(bottomCenterIndex, lastRingStart + wrappedNextPoint, lastRingStart + i);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(flattened, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
function buildTelevisionMesh(parentGroup, width, depth, height, offsetX, offsetZ, rotationY, frameColor, accentColor) {
  const tvGroup = new THREE.Group();
  const topBezelY = height * 0.49;
  const bezelHeight = height * 0.12;
  const bottomBezelZ = -depth * 0.39;
  addBoxMesh(tvGroup, width * 0.9, bezelHeight, depth * 0.82, 0, topBezelY, depth * 0.02, frameColor, {
    radius: Math.min(width, depth) * 0.06,
    roughness: 0.72
  });
  addBoxMesh(tvGroup, width * 0.78, height * 0.34, depth * 0.09, 0, height * 0.78, bottomBezelZ, frameColor, {
    radius: Math.min(width, depth) * 0.045,
    roughness: 0.72
  });
  for (const sideOffset of [-0.38, 0.38]) {
    addBoxMesh(tvGroup, 0.05, height * 0.47, 0.05, width * sideOffset, height * 0.235, depth * 0.34, accentColor, {
      rounded: false
    });
    addBoxMesh(tvGroup, 0.05, height * 0.94, 0.05, width * sideOffset, height * 0.47, bottomBezelZ, accentColor, {
      rounded: false
    });
  }
  tvGroup.position.set(offsetX, 0, offsetZ);
  tvGroup.rotation.y = rotationY;
  parentGroup.add(tvGroup);
}
function stairRiserMaterialOptions(group, risers, archColor, archOptions) {
  const threadOptions = {
    rounded: false,
    metalness: 0.18,
    roughness: 0.36,
    castShadow: false,
    receiveShadow: false
  };
  const treadParts = [];
  const sideParts = [];
  for (const riser of risers) {
    const capThickness = Math.min(0.045, riser.width * 0.08, riser.height * 0.04);
    const treadWidth = Math.max(riser.width - capThickness * 2, 0.04);
    const treadDepth = Math.max(riser.height - capThickness * 2, 0.08);
    treadParts.push([treadWidth, treadDepth, 0.018, riser.centerX, riser.height / 2, riser.centerZ]);
    sideParts.push([riser.width, capThickness, 0.045, riser.centerX, capThickness / 2, riser.centerZ], [riser.width, capThickness, 0.045, riser.centerX, riser.height - capThickness / 2, riser.centerZ], [capThickness, riser.height, 0.045, riser.centerX - riser.width / 2 + capThickness / 2, riser.height / 2, riser.centerZ], [capThickness, riser.height, 0.045, riser.centerX + riser.width / 2 - capThickness / 2, riser.height / 2, riser.centerZ]);
  }
  for (const part of treadParts) {
    addSharedArchMesh(group, [part], archOptions, {
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
  addSharedArchMesh(group, sideParts, archColor, threadOptions);
}
function countShadowLights(root, enabled) {
  if (!enabled) {
    return;
  }
  const themeColors = resolvedThemeColors();
  root.traverse(mesh => {
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const entry of materials) {
      if (entry?.isMeshStandardMaterial) {
        entry.emissive = new THREE.Color(themeColors.accent);
        entry.emissiveIntensity = 0.32;
      }
    }
  });
}
function markAsLightSourcePreview(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#929baa";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const title = normalizeLabelText(label.title, "家庭总览", 24);
  const subtitle = normalizeLabelText(label.subtitle, "HOME PLAN", 36);
  const titleY = 115;
  const titleFontPx = 184;
  ctx.font = "700 " + titleFontPx + "px sans-serif";
  drawTrackedText(ctx, title, titleY, 130, titleFontPx * clamp(finite(label.titleSpacing, 1.05), 0, 1.8), 1340);
  const arrowX = 1580;
  const arrowY = 130;
  const arrowSize = 170;
  ctx.fillStyle = "#929baa";
  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY - arrowSize * 0.58);
  ctx.lineTo(arrowX + arrowSize * 0.56, arrowY - arrowSize * 0.02);
  ctx.lineTo(arrowX + arrowSize * 0.38, arrowY - arrowSize * 0.02);
  ctx.lineTo(arrowX + arrowSize * 0.38, arrowY + arrowSize * 0.5);
  ctx.lineTo(arrowX - arrowSize * 0.38, arrowY + arrowSize * 0.5);
  ctx.lineTo(arrowX - arrowSize * 0.38, arrowY - arrowSize * 0.02);
  ctx.lineTo(arrowX - arrowSize * 0.56, arrowY - arrowSize * 0.02);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(arrowX - arrowSize * 0.09, arrowY + arrowSize * 0.2, arrowSize * 0.18, arrowSize * 0.3);
  ctx.restore();
  ctx.fillStyle = "#929baa";
  ctx.textAlign = "left";
  const subtitleFontPx = 310;
  ctx.font = "400 " + subtitleFontPx + "px \"Arial Narrow\", Arial, sans-serif";
  drawTrackedText(ctx, subtitle, 72, 410, subtitleFontPx * clamp(finite(label.subtitleSpacing, 0.08), 0, 0.6), 1880);
  const lineStartX = 74;
  const lineEndX = lineStartX + clamp(finite(label.lineLength, 0.86), 0.3, 1) * 1880;
  ctx.strokeStyle = "rgba(146, 155, 170, 0.72)";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(lineStartX, 590);
  ctx.lineTo(lineEndX, 590);
  ctx.moveTo(lineStartX, 566);
  ctx.lineTo(lineStartX, 614);
  ctx.moveTo(lineEndX, 566);
  ctx.lineTo(lineEndX, 614);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  texture.needsUpdate = true;
  const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(label.width, label.depth), new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    forceSinglePass: isStageEmbed
  }));
  planeMesh.rotation.x = -Math.PI / 2;
  planeMesh.position.y = 0.008;
  planeMesh.castShadow = false;
  planeMesh.receiveShadow = false;
  planeMesh.renderOrder = 8;
  return planeMesh;
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
function countMaterialTextures(root = worldGroup) {
  let textureCount = 0;
  root?.traverse(node => {
    if (!node.isMesh) {
      return;
    }
    const materials = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
    for (const materialEntry of materials) {
      textureCount = Math.max(textureCount, createPlanLabelSprite(materialEntry));
    }
  });
  if (previewSceneCurrent?.environment?.isTexture) {
    textureCount += 1;
  }
  return textureCount;
}
function maxTextureUnits() {
  const getParameter = renderer?.getContext?.();
  const value = getParameter?.getParameter?.(getParameter.MAX_TEXTURE_IMAGE_UNITS);
  return Math.max(1, Math.floor(finite(value, renderer?.capabilities?.maxTextures || 16)));
}
function countSceneMeshes(root = worldGroup) {
  const shadowCasters = [];
  root?.traverse(node => {
    if (!node.isSpotLight || node.userData?.shadowCandidate !== true) {
      return;
    }
    const floorId = String(node.userData?.lightFloorId || "");
    const itemId = String(node.userData?.lightItemId || "");
    if (itemId) {
      shadowCasters.push({
        id: floorId + ":" + itemId,
        groupId: floorId + ":" + String(node.userData?.lightGroupId || ""),
        type: String(node.userData?.lightType || "downlight"),
        brightness: finite(node.userData?.lightBrightness, 0),
        enabled: node.visible !== false
      });
    }
  });
  return shadowCasters;
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
  let hasRectAreaLight = false;
  traverse.traverse(visible => {
    if (visible.visible !== false && visible.isRectAreaLight) {
      hasRectAreaLight = true;
    }
  });
  const rectAreaLightTextureUnits = hasRectAreaLight ? deferredModelTimer : 0;
  const remainingUnits = flag - textures - nonSpotShadowTextureUnits - rectAreaLightTextureUnits - externalModels;
  if (!stageSession && shadowAtlas && remainingUnits >= 1 && renderer.domElement.dataset.spotShadowMode !== "fallback") {
    const shadowBudget = options ? shadowAtlas.schedule(traverse) : countSceneMeshes(traverse).length;
    const activeSpotShadows = shadowAtlas.sync(traverse);
    const dataset = renderer.domElement;
    dataset.dataset.fragmentTextureUnits = String(flag);
    dataset.dataset.materialTextureUnits = String(textures);
    dataset.dataset.spotShadowLimit = String(shadowBudget);
    dataset.dataset.activeSpotShadows = String(activeSpotShadows);
    let visibleUserLightCount = 0;
    traverse.traverse(isLight => {
      if (isLight.isLight && isLight.userData?.lightItemId && isLight.visible !== false) {
        visibleUserLightCount += 1;
      }
    });
    dataset.dataset.activeUserLights = String(visibleUserLightCount);
    return activeSpotShadows;
  }
  const shadowUnitLimit = spotShadowTextureUnitLimit({
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
  const shadowCastIds = new Set(selectShadowCastingLightIds(countSceneMeshes(traverse), shadowUnitLimit));
  let shadowCasterCount = 0;
  traverse.traverse(userData => {
    if (!userData.isSpotLight || !userData.userData?.lightItemId) {
      return;
    }
    const lightKey = String(userData.userData?.lightFloorId || "") + ":" + String(userData.userData.lightItemId);
    const castShadow = shadowCastIds.has(lightKey);
    userData.castShadow = castShadow;
    if (castShadow) {
      shadowCasterCount += 1;
      if (userData.shadow && !userData.shadow.map) {
        userData.shadow.needsUpdate = true;
      }
    }
  });
  const dataset = renderer.domElement;
  dataset.dataset.spotShadowMode = "individual";
  dataset.dataset.fragmentTextureUnits = String(flag);
  dataset.dataset.materialTextureUnits = String(textures);
  dataset.dataset.spotShadowLimit = String(shadowUnitLimit);
  dataset.dataset.activeSpotShadows = String(shadowCasterCount);
  let userLightCount = 0;
  traverse.traverse(isLight => {
    if (isLight.isLight && isLight.userData?.lightItemId && isLight.visible !== false) {
      userLightCount += 1;
    }
  });
  dataset.dataset.activeUserLights = String(userLightCount);
  return shadowCasterCount;
}
function buildWallCornerCaps(list, color, shadowDirtyIds) {
  const hex = isStageEmbed ? lightEffectColorHex(color.lightTemperature) : kelvinToRgbHex(color.lightTemperature);
  const visible = isLightGroupVisible(color) && finite(color.lightBrightness, 0) > 0;
  const flag = !stageSession && forcedVisibleLightGroupIds === null && (isStageEmbed || !isPreviewQualityReady());
  const flagCurrent = !stageSession && residentCacheMode;
  if (!visible && !flag && !flagCurrent) {
    return;
  }
  const range = defaultLightPresets[color.type] || defaultLightPresets.downlight;
  const halfValue = clamp(finite(color.lightBrightness, range.brightness), 0, 100) / 100;
  const lightIntensityScale = deferExternalModels[color.type] || 1.1;
  const value = color.type === "striplight";
  const id = resolveLightGroup(color);
  if (value) {
    const object3d = clamp(finite(color.width, 2), 0.1, 8);
    const clampedValue = clamp(finite(color.depth, 0.28), 0.1, 8);
    const clampedValueCurrent = clamp(finite(color.lightRange, range.range), 0.5, 10);
    const clampedValueNext = clamp(clampedValueCurrent / range.range, 0.45, 1.65);
    const stripElevation = Math.max(finite(color.elevation, 2.7), 0.4);
    const clampedValuePrevious = clamp(Math.max(1, Math.pow(stripElevation / 2.7, 2)), 1, 4);
    const rotation = new THREE.Group();
    rotation.rotation.z = THREE.MathUtils.degToRad(normalizeFullRotation(color.verticalRotation));
    const group = new THREE.Group();
    group.rotation.x = THREE.MathUtils.degToRad(normalizeFullRotation(color.stripRollRotation));
    const lightOnIntensity = (yt ? halfValue : Math.pow(halfValue, 0.82)) * 48 * clampedValueNext * clampedValuePrevious * lightIntensityScale;
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
      userData.userData.regionFullIntensity = clampedValueNext * 48 * clampedValuePrevious * lightIntensityScale;
      studioReady?.register(userData, color);
    }
    group.add(userData);
    rotation.add(group);
    list.add(rotation);
    return;
  }
  const needsUpdate = shadowDirtyIds?.has(color.id) === true;
  const needsShadowUpdate = needsUpdate || flagCurrent || flag;
  const far = clamp(finite(color.lightRange, range.range), 0.5, 10);
  const clampedValue = clamp(finite(color.lightAngle, range.angle), 15, defaultItemDepth(color.type));
  const spotLightCount = 1;
  const spotIntensity = (color.type === "ceilinglight" ? 680 : 520) * (yt ? halfValue : spotLightBrightnessResponse(color.type, halfValue)) * lightIntensityScale;
  for (let spotIndex = 0; spotIndex < spotLightCount; spotIndex += 1) {
    const spotOffsetX = spotLightCount === 1 ? 0 : -color.width * 0.47 + color.width * 0.94 * spotIndex / (spotLightCount - 1);
    const spotLight = new THREE.SpotLight(hex, visible ? spotIntensity / spotLightCount : 0, far, THREE.MathUtils.degToRad(clampedValue / 2), 0.86, 2);
    spotLight.visible = visible;
    spotLight.position.set(spotOffsetX, -0.025, 0);
    spotLight.castShadow = false;
    spotLight.layers.enable(HELPER_LAYER);
    if (needsShadowUpdate) {
      const blurSamples = localSpotShadowSettings(color.type, far, clampedValue);
      const shadowMapSize = scaledShadowMapSize(blurSamples.mapSize);
      spotLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
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
    spotLight.userData.lightOnIntensity = spotIntensity / spotLightCount;
    if (yt) {
      spotLight.userData.regionFullIntensity = (color.type === "ceilinglight" ? 680 : 520) * lightIntensityScale;
      studioReady?.register(spotLight, color);
    }
    const shadowCameraHelperTarget = new THREE.Object3D();
    shadowCameraHelperTarget.position.set(spotOffsetX, -Math.max(finite(color.elevation, 2.68), 0.8), 0);
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
  }].forEach((badgeColor, badgeIndex) => {
    const contactShadowTint = 54 + badgeIndex * 142;
    canvasCtx.fillStyle = "#172d40";
    canvasCtx.beginPath();
    canvasCtx.roundRect(contactShadowTint, 398, 126, 54, 8);
    canvasCtx.fill();
    canvasCtx.fillStyle = badgeColor.color;
    canvasCtx.fillRect(contactShadowTint + 14, 414, 8, 22);
    canvasCtx.fillStyle = "#dbe5ed";
    canvasCtx.font = "700 13px Arial, sans-serif";
    canvasCtx.fillText(badgeColor.label, contactShadowTint + 32, 432);
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
  const statusBadges = [{
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
  for (const badge of statusBadges) {
    canvasCtx.fillStyle = "#15283a";
    canvasCtx.beginPath();
    canvasCtx.roundRect(badge.x, badge.y, 176, 108, 10);
    canvasCtx.fill();
    canvasCtx.fillStyle = badge.color;
    canvasCtx.fillRect(badge.x + 18, badge.y + 18, 30, 5);
    canvasCtx.fillStyle = "#f4f8fb";
    canvasCtx.font = "700 29px Arial, sans-serif";
    canvasCtx.fillText(badge.value, badge.x + 18, badge.y + 66);
    canvasCtx.fillStyle = "#8295a6";
    canvasCtx.font = "600 12px Arial, sans-serif";
    canvasCtx.fillText(badge.label, badge.x + 18, badge.y + 89);
  }
  const texture = new THREE.CanvasTexture(el);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  texture.needsUpdate = true;
  return texture;
}
const MURAL_ART_STYLES = Object.freeze(["bauhaus", "colorfield", "linework", "blocks", "ink", "terrazzo"]);
const muralArtStyleSet = new Set(MURAL_ART_STYLES);
const muralArtTextures = new Map();
function normalizeMuralArtStyle(value) {
  return muralArtStyleSet.has(value) ? value : MURAL_ART_STYLES[0];
}
/** Deterministic pseudo-random source so a style always renders to the exact same artwork. */
function muralRandomSource(seed) {
  let muralSeed = seed >>> 0;
  return () => {
    muralSeed = muralSeed * 1664525 + 1013904223 >>> 0;
    return muralSeed / 4294967296;
  };
}
function paintMuralBauhaus(canvasCtx, width, height) {
  const muralBase = canvasCtx.createLinearGradient(0, 0, width, height);
  muralBase.addColorStop(0, "#f5f0e6");
  muralBase.addColorStop(0.55, "#ead9c6");
  muralBase.addColorStop(1, "#d8ccba");
  canvasCtx.fillStyle = muralBase;
  canvasCtx.fillRect(0, 0, width, height);
  canvasCtx.fillStyle = "rgba(47, 90, 102, .9)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.28, height * 0.42, height * 0.3, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.fillStyle = "rgba(216, 161, 63, .9)";
  canvasCtx.fillRect(width * 0.61, height * 0.14, width * 0.25, height * 0.27);
  canvasCtx.fillStyle = "rgba(201, 111, 74, .88)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.53, height * 0.64, height * 0.27, Math.PI * 1.05, Math.PI * 1.95);
  canvasCtx.closePath();
  canvasCtx.fill();
  canvasCtx.fillStyle = "rgba(217, 163, 160, .85)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.73, height * 0.75, height * 0.115, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.save();
  canvasCtx.translate(width * 0.43, height * 0.28);
  canvasCtx.rotate(Math.PI / 5);
  canvasCtx.fillStyle = "rgba(43, 47, 56, .9)";
  canvasCtx.fillRect(-height * 0.055, -height * 0.055, height * 0.11, height * 0.11);
  canvasCtx.restore();
  canvasCtx.lineCap = "round";
  canvasCtx.strokeStyle = "rgba(43, 47, 56, .92)";
  canvasCtx.lineWidth = height * 0.022;
  canvasCtx.beginPath();
  canvasCtx.moveTo(width * 0.09, height * 0.83);
  canvasCtx.bezierCurveTo(width * 0.34, height * 0.61, width * 0.56, height * 0.99, width * 0.91, height * 0.71);
  canvasCtx.stroke();
  canvasCtx.strokeStyle = "rgba(43, 47, 56, .36)";
  canvasCtx.lineWidth = 2;
  canvasCtx.beginPath();
  canvasCtx.moveTo(width * 0.5, height * 0.07);
  canvasCtx.lineTo(width * 0.5, height * 0.93);
  canvasCtx.stroke();
  for (let stripe = 0; stripe < 7; stripe += 1) {
    const stripeY = height * (0.13 + stripe * 0.055);
    canvasCtx.beginPath();
    canvasCtx.moveTo(width * 0.84, stripeY);
    canvasCtx.lineTo(width * 0.94, stripeY);
    canvasCtx.stroke();
  }
}
function paintMuralColorField(canvasCtx, width, height) {
  const muralRandom = muralRandomSource(74123);
  const muralBase = canvasCtx.createLinearGradient(0, 0, 0, height);
  muralBase.addColorStop(0, "#f7f3ec");
  muralBase.addColorStop(1, "#e7ded0");
  canvasCtx.fillStyle = muralBase;
  canvasCtx.fillRect(0, 0, width, height);
  const muralFields = [{
    x: 0.12,
    y: 0.26,
    w: 0.46,
    h: 0.54,
    color: "rgba(72, 122, 148, .5)"
  }, {
    x: 0.44,
    y: 0.14,
    w: 0.4,
    h: 0.46,
    color: "rgba(213, 156, 88, .5)"
  }, {
    x: 0.56,
    y: 0.47,
    w: 0.36,
    h: 0.44,
    color: "rgba(184, 101, 94, .44)"
  }, {
    x: 0.24,
    y: 0.58,
    w: 0.36,
    h: 0.3,
    color: "rgba(120, 133, 97, .4)"
  }];
  for (const muralField of muralFields) {
    const muralRadius = Math.min(width, height) * (0.05 + muralRandom() * 0.09);
    canvasCtx.fillStyle = muralField.color;
    canvasCtx.beginPath();
    canvasCtx.roundRect(width * muralField.x, height * muralField.y, width * muralField.w, height * muralField.h, muralRadius);
    canvasCtx.fill();
  }
  canvasCtx.fillStyle = "rgba(255, 253, 248, .3)";
  for (let muralBand = 0; muralBand < 5; muralBand += 1) {
    canvasCtx.fillRect(width * (0.06 + muralBand * 0.19), 0, width * 0.045, height);
  }
  canvasCtx.strokeStyle = "rgba(53, 62, 70, .5)";
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeRect(width * 0.07, height * 0.09, width * 0.86, height * 0.82);
}
function paintMuralLinework(canvasCtx, width, height) {
  const muralRandom = muralRandomSource(90211);
  canvasCtx.fillStyle = "#f6f3ec";
  canvasCtx.fillRect(0, 0, width, height);
  canvasCtx.lineCap = "round";
  for (let muralLine = 0; muralLine < 46; muralLine += 1) {
    const muralOffset = muralRandom();
    const muralLength = height * (0.24 + muralRandom() * 0.55);
    const muralStartX = width * (-0.08 + muralOffset * 1.16);
    const muralStartY = height * (muralRandom() * 0.5);
    canvasCtx.strokeStyle = "rgba(48, 55, 63, " + (0.1 + muralRandom() * 0.36).toFixed(2) + ")";
    canvasCtx.lineWidth = 1 + muralRandom() * 2.4;
    canvasCtx.beginPath();
    canvasCtx.moveTo(muralStartX, muralStartY);
    canvasCtx.lineTo(muralStartX + muralLength * 0.34, muralStartY + muralLength);
    canvasCtx.stroke();
  }
  canvasCtx.strokeStyle = "rgba(43, 92, 112, .82)";
  canvasCtx.lineWidth = height * 0.032;
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.62, height * 0.68, height * 0.34, Math.PI * 1.06, Math.PI * 1.72);
  canvasCtx.stroke();
  canvasCtx.fillStyle = "rgba(201, 96, 68, .92)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.26, height * 0.34, height * 0.045, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.strokeStyle = "rgba(48, 55, 63, .55)";
  canvasCtx.lineWidth = 1.6;
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, height * 0.5);
  canvasCtx.lineTo(width, height * 0.5);
  canvasCtx.stroke();
}
function paintMuralBlocks(canvasCtx, width, height) {
  const muralRandom = muralRandomSource(31577);
  canvasCtx.fillStyle = "#f2ece1";
  canvasCtx.fillRect(0, 0, width, height);
  const muralColumns = [0.06, 0.3, 0.52, 0.72];
  const muralPalette = ["#2f5a66", "#c98f45", "#b8604c", "#8f9c74", "#3d4550", "#d9a3a0", "#5d7f92"];
  for (let muralColumn = 0; muralColumn < muralColumns.length; muralColumn += 1) {
    let muralCursor = 0.07;
    const muralColumnWidth = muralColumn === muralColumns.length - 1 ? 0.22 : 0.18 + muralRandom() * 0.06;
    while (muralCursor < 0.92) {
      const muralBlockHeight = 0.12 + muralRandom() * 0.3;
      const muralColor = muralPalette[Math.floor(muralRandom() * muralPalette.length)];
      canvasCtx.fillStyle = muralColor;
      canvasCtx.fillRect(width * muralColumns[muralColumn], height * muralCursor, width * muralColumnWidth, height * Math.min(muralBlockHeight, 0.93 - muralCursor));
      muralCursor += muralBlockHeight + 0.015;
    }
  }
  canvasCtx.fillStyle = "rgba(255, 252, 246, .9)";
  for (let muralGap = 0; muralGap < muralColumns.length - 1; muralGap += 1) {
    canvasCtx.fillRect(width * (muralColumns[muralGap] + 0.19), 0, width * 0.012, height);
  }
  canvasCtx.fillStyle = "rgba(255, 252, 246, .9)";
  canvasCtx.fillRect(width * 0.52, height * 0.44, width * 0.06, height * 0.14);
}
function paintMuralInk(canvasCtx, width, height) {
  const muralRandom = muralRandomSource(60413);
  canvasCtx.fillStyle = "#f7f2e8";
  canvasCtx.fillRect(0, 0, width, height);
  for (let muralWash = 0; muralWash < 14; muralWash += 1) {
    const muralCenterX = width * (0.08 + muralRandom() * 0.84);
    const muralCenterY = height * (0.12 + muralRandom() * 0.76);
    const muralRadius = height * (0.08 + muralRandom() * 0.24);
    const muralWashGradient = canvasCtx.createRadialGradient(muralCenterX, muralCenterY, 0, muralCenterX, muralCenterY, muralRadius);
    const muralTone = Math.floor(40 + muralRandom() * 60);
    muralWashGradient.addColorStop(0, "rgba(" + muralTone + ", " + (muralTone + 6) + ", " + (muralTone + 14) + ", " + (0.1 + muralRandom() * 0.2).toFixed(2) + ")");
    muralWashGradient.addColorStop(1, "rgba(" + muralTone + ", " + (muralTone + 6) + ", " + (muralTone + 14) + ", 0)");
    canvasCtx.fillStyle = muralWashGradient;
    canvasCtx.beginPath();
    canvasCtx.arc(muralCenterX, muralCenterY, muralRadius, 0, Math.PI * 2);
    canvasCtx.fill();
  }
  canvasCtx.strokeStyle = "rgba(38, 44, 51, .82)";
  canvasCtx.lineCap = "round";
  canvasCtx.lineWidth = height * 0.018;
  canvasCtx.beginPath();
  canvasCtx.moveTo(width * 0.1, height * 0.68);
  canvasCtx.bezierCurveTo(width * 0.32, height * 0.42, width * 0.52, height * 0.78, width * 0.78, height * 0.44);
  canvasCtx.stroke();
  canvasCtx.strokeStyle = "rgba(178, 64, 46, .92)";
  canvasCtx.lineWidth = height * 0.03;
  canvasCtx.beginPath();
  canvasCtx.moveTo(width * 0.58, height * 0.26);
  canvasCtx.lineTo(width * 0.88, height * 0.3);
  canvasCtx.stroke();
  canvasCtx.fillStyle = "rgba(178, 64, 46, .9)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.5, height * 0.3, height * 0.035, 0, Math.PI * 2);
  canvasCtx.fill();
}
function paintMuralTerrazzo(canvasCtx, width, height) {
  const muralRandom = muralRandomSource(52019);
  canvasCtx.fillStyle = "#f3eee4";
  canvasCtx.fillRect(0, 0, width, height);
  const muralChips = ["#2f5a66", "#c98f45", "#b8604c", "#8f9c74", "#3d4550", "#d9a3a0", "#5d7f92", "#b9a88f"];
  for (let muralChip = 0; muralChip < 340; muralChip += 1) {
    const muralCenterX = muralRandom() * width;
    const muralCenterY = muralRandom() * height;
    const muralSize = 3 + muralRandom() * 12;
    canvasCtx.save();
    canvasCtx.translate(muralCenterX, muralCenterY);
    canvasCtx.rotate(muralRandom() * Math.PI);
    canvasCtx.fillStyle = muralChips[Math.floor(muralRandom() * muralChips.length)];
    canvasCtx.beginPath();
    canvasCtx.moveTo(-muralSize, -muralSize * 0.5);
    canvasCtx.lineTo(muralSize * 0.8, -muralSize);
    canvasCtx.lineTo(muralSize, muralSize * 0.7);
    canvasCtx.lineTo(-muralSize * 0.6, muralSize);
    canvasCtx.closePath();
    canvasCtx.fill();
    canvasCtx.restore();
  }
  canvasCtx.fillStyle = "rgba(243, 238, 228, .72)";
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.3, height * 0.42, height * 0.28, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.strokeStyle = "rgba(47, 90, 102, .8)";
  canvasCtx.lineWidth = height * 0.026;
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.3, height * 0.42, height * 0.28, Math.PI * 0.9, Math.PI * 1.9);
  canvasCtx.stroke();
  canvasCtx.strokeStyle = "rgba(184, 96, 76, .82)";
  canvasCtx.lineWidth = height * 0.02;
  canvasCtx.beginPath();
  canvasCtx.arc(width * 0.72, height * 0.62, height * 0.19, Math.PI * 1.7, Math.PI * 0.7);
  canvasCtx.stroke();
}
/** Procedural artwork used by the framed wall mural so the model needs no external texture. */
function createMuralArtTexture(styleValue) {
  const style = normalizeMuralArtStyle(styleValue);
  if (muralArtTextures.has(style)) {
    return muralArtTextures.get(style);
  }
  const el = document.createElement("canvas");
  el.width = 768;
  el.height = 512;
  const canvasCtx = el.getContext("2d");
  if (!canvasCtx) {
    return null;
  }
  const muralPainters = {
    bauhaus: paintMuralBauhaus,
    colorfield: paintMuralColorField,
    linework: paintMuralLinework,
    blocks: paintMuralBlocks,
    ink: paintMuralInk,
    terrazzo: paintMuralTerrazzo
  };
  muralPainters[style](canvasCtx, el.width, el.height);
  const texture = new THREE.CanvasTexture(el);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  texture.needsUpdate = true;
  muralArtTextures.set(style, texture);
  return texture;
}
const FEATURE_WALL_STYLES = Object.freeze(["marble", "wood", "slat", "stone", "concrete", "fabric", "metal"]);
const featureWallStyleSet = new Set(FEATURE_WALL_STYLES);
const featureWallTextures = new Map();
function normalizeFeatureWallStyle(value) {
  return featureWallStyleSet.has(value) ? value : FEATURE_WALL_STYLES[0];
}
/** Per-surface look so each background-wall cladding reads differently in 3D, not just by texture. */
const FEATURE_WALL_STYLE_MATERIAL = Object.freeze({
  marble: {
    color: 0xf7f7f5,
    roughness: 0.34,
    metalness: 0.03
  },
  wood: {
    color: 0x9a6f42,
    roughness: 0.72,
    metalness: 0.02
  },
  slat: {
    color: 0x6f523a,
    roughness: 0.74,
    metalness: 0.02
  },
  stone: {
    color: 0xcec8bd,
    roughness: 0.46,
    metalness: 0.02
  },
  concrete: {
    color: 0xb4b1ab,
    roughness: 0.94,
    metalness: 0
  },
  fabric: {
    color: 0xc9c0b2,
    roughness: 0.98,
    metalness: 0
  },
  metal: {
    color: 0x9ba0a6,
    roughness: 0.38,
    metalness: 0.28
  }
});
function featureWallShade(hex, factor) {
  const red = Math.min(255, Math.max(0, Math.round((hex >> 16 & 255) * factor)));
  const green = Math.min(255, Math.max(0, Math.round((hex >> 8 & 255) * factor)));
  const blue = Math.min(255, Math.max(0, Math.round((hex & 255) * factor)));
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}
/** Quadratic smoothing between sampled points so procedural veins and grain stay organic. */
function strokeSmoothPath(canvasCtx, points) {
  if (points.length < 2) {
    return;
  }
  canvasCtx.beginPath();
  canvasCtx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length - 1; index += 1) {
    const midX = (points[index].x + points[index + 1].x) / 2;
    const midY = (points[index].y + points[index + 1].y) / 2;
    canvasCtx.quadraticCurveTo(points[index].x, points[index].y, midX, midY);
  }
  const last = points[points.length - 1];
  canvasCtx.lineTo(last.x, last.y);
  canvasCtx.stroke();
}
function paintFeatureWallMarble(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(88117);
  const surfaceBase = canvasCtx.createLinearGradient(0, 0, width, height);
  surfaceBase.addColorStop(0, "#ffffff");
  surfaceBase.addColorStop(0.5, "#fbfbfa");
  surfaceBase.addColorStop(1, "#f2f2f0");
  canvasCtx.fillStyle = surfaceBase;
  canvasCtx.fillRect(0, 0, width, height);
  for (let cloud = 0; cloud < 24; cloud += 1) {
    const cloudX = featureRandom() * width;
    const cloudY = featureRandom() * height;
    const cloudRadius = Math.min(width, height) * (0.08 + featureRandom() * 0.32);
    const cloudLighter = featureRandom() > 0.35;
    const cloudTone = cloudLighter ? "255, 255, 255" : "214, 216, 220";
    const cloudAlpha = cloudLighter ? 0.08 + featureRandom() * 0.18 : 0.03 + featureRandom() * 0.08;
    const cloudGradient = canvasCtx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudRadius);
    cloudGradient.addColorStop(0, "rgba(" + cloudTone + ", " + cloudAlpha.toFixed(2) + ")");
    cloudGradient.addColorStop(1, "rgba(" + cloudTone + ", 0)");
    canvasCtx.fillStyle = cloudGradient;
    canvasCtx.fillRect(cloudX - cloudRadius, cloudY - cloudRadius, cloudRadius * 2, cloudRadius * 2);
  }
  canvasCtx.lineCap = "round";
  // Bold black stripe veins give the classic white-marble contrast.
  for (let vein = 0; vein < 9; vein += 1) {
    const points = [];
    let veinX = width * (-0.04 + featureRandom() * 1.08);
    let veinY = -height * 0.12;
    points.push({
      x: veinX,
      y: veinY
    });
    while (veinY < height * 1.1) {
      veinX += (featureRandom() - 0.5) * width * 0.23;
      veinY += height * (0.07 + featureRandom() * 0.13);
      points.push({
        x: veinX,
        y: veinY
      });
    }
    canvasCtx.strokeStyle = "rgba(16, 17, 20, " + (0.34 + featureRandom() * 0.42).toFixed(2) + ")";
    canvasCtx.lineWidth = 1.6 + featureRandom() * 5.2;
    strokeSmoothPath(canvasCtx, points);
  }
  // Thin secondary branches in softer black keep the stone from reading as printed stripes.
  for (let fine = 0; fine < 46; fine += 1) {
    const points = [];
    let fineX = featureRandom() * width;
    let fineY = -height * 0.06;
    points.push({
      x: fineX,
      y: fineY
    });
    const fineSteps = 3 + Math.floor(featureRandom() * 5);
    for (let step = 0; step < fineSteps; step += 1) {
      fineX += (featureRandom() - 0.5) * width * 0.16;
      fineY += height * (0.05 + featureRandom() * 0.1);
      points.push({
        x: fineX,
        y: fineY
      });
    }
    canvasCtx.strokeStyle = "rgba(38, 40, 45, " + (0.14 + featureRandom() * 0.3).toFixed(2) + ")";
    canvasCtx.lineWidth = 0.7 + featureRandom() * 1.9;
    strokeSmoothPath(canvasCtx, points);
  }
  canvasCtx.fillStyle = "rgba(255, 255, 255, .5)";
  for (let speck = 0; speck < 700; speck += 1) {
    canvasCtx.fillRect(featureRandom() * width, featureRandom() * height, 1.2, 1.2);
  }
  canvasCtx.fillStyle = "rgba(24, 25, 28, .3)";
  for (let speck = 0; speck < 260; speck += 1) {
    canvasCtx.fillRect(featureRandom() * width, featureRandom() * height, 1.3, 1.3);
  }
}
function paintFeatureWallWood(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(45119);
  const grainPalette = [0xa4713f, 0x8c5c31, 0xb98a54];
  const plankCount = 4;
  const plankWidth = width / plankCount;
  for (let plank = 0; plank < plankCount; plank += 1) {
    const plankX = plank * plankWidth;
    const plankTone = 0.86 + featureRandom() * 0.3;
    const plankGradient = canvasCtx.createLinearGradient(plankX, 0, plankX + plankWidth, 0);
    plankGradient.addColorStop(0, featureWallShade(grainPalette[plank % grainPalette.length], plankTone * 0.92));
    plankGradient.addColorStop(0.45, featureWallShade(grainPalette[plank % grainPalette.length], plankTone * 1.08));
    plankGradient.addColorStop(1, featureWallShade(grainPalette[plank % grainPalette.length], plankTone * 0.88));
    canvasCtx.fillStyle = plankGradient;
    canvasCtx.fillRect(plankX, 0, plankWidth, height);
    canvasCtx.lineCap = "round";
    for (let grain = 0; grain < 120; grain += 1) {
      const points = [];
      let grainX = plankX + featureRandom() * plankWidth;
      let grainY = -height * 0.06;
      const grainDrift = (featureRandom() - 0.5) * plankWidth * 0.09;
      points.push({
        x: grainX,
        y: grainY
      });
      while (grainY < height * 1.06) {
        grainX += grainDrift + (featureRandom() - 0.5) * plankWidth * 0.045;
        grainY += height * (0.1 + featureRandom() * 0.2);
        points.push({
          x: grainX,
          y: grainY
        });
      }
      const grainDark = featureRandom() > 0.35;
      canvasCtx.strokeStyle = grainDark ? "rgba(62, 38, 18, " + (0.05 + featureRandom() * 0.2).toFixed(2) + ")" : "rgba(246, 214, 172, " + (0.04 + featureRandom() * 0.14).toFixed(2) + ")";
      canvasCtx.lineWidth = 0.6 + featureRandom() * 3;
      strokeSmoothPath(canvasCtx, points);
    }
    const knotCount = featureRandom() > 0.5 ? 2 : 1;
    for (let knot = 0; knot < knotCount; knot += 1) {
      const knotX = plankX + plankWidth * (0.2 + featureRandom() * 0.6);
      const knotY = height * (0.12 + featureRandom() * 0.76);
      const knotRadius = Math.min(plankWidth, height) * (0.04 + featureRandom() * 0.05);
      for (let ring = 4; ring >= 1; ring -= 1) {
        canvasCtx.strokeStyle = "rgba(58, 34, 15, " + (0.1 + ring * 0.05).toFixed(2) + ")";
        canvasCtx.lineWidth = 1.1;
        canvasCtx.beginPath();
        canvasCtx.ellipse(knotX, knotY, knotRadius * ring * 0.5, knotRadius * ring * 0.82, 0, 0, Math.PI * 2);
        canvasCtx.stroke();
      }
    }
    canvasCtx.fillStyle = "rgba(46, 28, 12, .5)";
    canvasCtx.fillRect(plankX, 0, 2.4, height);
  }
  canvasCtx.fillStyle = "rgba(46, 28, 12, .5)";
  canvasCtx.fillRect(width - 2.4, 0, 2.4, height);
}
function paintFeatureWallSlat(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(70841);
  const slatCount = Math.max(12, Math.round(width / 34));
  const slatPitch = width / slatCount;
  const recessGradient = canvasCtx.createLinearGradient(0, 0, 0, height);
  recessGradient.addColorStop(0, "#241b14");
  recessGradient.addColorStop(0.5, "#180f0a");
  recessGradient.addColorStop(1, "#241b14");
  canvasCtx.fillStyle = recessGradient;
  canvasCtx.fillRect(0, 0, width, height);
  for (let slat = 0; slat < slatCount; slat += 1) {
    const slatX = slatPitch * slat;
    const slatGradient = canvasCtx.createLinearGradient(slatX, 0, slatX + slatPitch, 0);
    slatGradient.addColorStop(0, "rgba(20, 12, 7, .94)");
    slatGradient.addColorStop(0.5, "rgba(46, 32, 21, .5)");
    slatGradient.addColorStop(1, "rgba(20, 12, 7, .94)");
    canvasCtx.fillStyle = slatGradient;
    canvasCtx.fillRect(slatX, 0, slatPitch * 0.96, height);
    canvasCtx.strokeStyle = "rgba(148, 112, 76, " + (0.06 + featureRandom() * 0.1).toFixed(2) + ")";
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    canvasCtx.moveTo(slatX + slatPitch * 0.5, 0);
    canvasCtx.lineTo(slatX + slatPitch * 0.5, height);
    canvasCtx.stroke();
  }
  const castShadow = canvasCtx.createLinearGradient(0, 0, 0, height);
  castShadow.addColorStop(0, "rgba(0, 0, 0, .4)");
  castShadow.addColorStop(0.16, "rgba(0, 0, 0, 0)");
  castShadow.addColorStop(0.84, "rgba(0, 0, 0, 0)");
  castShadow.addColorStop(1, "rgba(0, 0, 0, .4)");
  canvasCtx.fillStyle = castShadow;
  canvasCtx.fillRect(0, 0, width, height);
}
function paintFeatureWallStone(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(25309);
  const slabColumns = 3;
  const slabRows = 2;
  canvasCtx.fillStyle = "#6f6b64";
  canvasCtx.fillRect(0, 0, width, height);
  const slabWidth = width / slabColumns;
  const slabHeight = height / slabRows;
  for (let row = 0; row < slabRows; row += 1) {
    for (let column = 0; column < slabColumns; column += 1) {
      const slabX = column * slabWidth;
      const slabY = row * slabHeight;
      const slabTone = 0.9 + featureRandom() * 0.24;
      const slabBase = [214, 208, 197, 201, 197, 186, 224, 218, 208][row * slabColumns + column];
      canvasCtx.fillStyle = featureWallShade(slabBase, slabTone);
      canvasCtx.fillRect(slabX + 1.6, slabY + 1.6, slabWidth - 3.2, slabHeight - 3.2);
      for (let mot = 0; mot < 20; mot += 1) {
        const motX = slabX + featureRandom() * slabWidth;
        const motY = slabY + featureRandom() * slabHeight;
        const motRadius = Math.min(slabWidth, slabHeight) * (0.1 + featureRandom() * 0.4);
        const motDark = featureRandom() > 0.5;
        const motTone = motDark ? "150, 144, 133" : "246, 243, 236";
        const motGradient = canvasCtx.createRadialGradient(motX, motY, 0, motX, motY, motRadius);
        motGradient.addColorStop(0, "rgba(" + motTone + ", " + (0.08 + featureRandom() * 0.2).toFixed(2) + ")");
        motGradient.addColorStop(1, "rgba(" + motTone + ", 0)");
        canvasCtx.fillStyle = motGradient;
        canvasCtx.fillRect(motX - motRadius, motY - motRadius, motRadius * 2, motRadius * 2);
      }
      canvasCtx.lineCap = "round";
      for (let vein = 0; vein < 3; vein += 1) {
        const points = [];
        let veinX = slabX + featureRandom() * slabWidth;
        let veinY = slabY + featureRandom() * slabHeight;
        points.push({
          x: veinX,
          y: veinY
        });
        for (let step = 0; step < 4; step += 1) {
          veinX += (featureRandom() - 0.5) * slabWidth * 0.4;
          veinY += (featureRandom() - 0.4) * slabHeight * 0.4;
          points.push({
            x: veinX,
            y: veinY
          });
        }
        canvasCtx.strokeStyle = "rgba(126, 120, 110, " + (0.1 + featureRandom() * 0.22).toFixed(2) + ")";
        canvasCtx.lineWidth = 0.8 + featureRandom() * 2.2;
        strokeSmoothPath(canvasCtx, points);
      }
    }
  }
  canvasCtx.fillStyle = "rgba(255, 255, 255, .34)";
  for (let speck = 0; speck < 900; speck += 1) {
    canvasCtx.fillRect(featureRandom() * width, featureRandom() * height, 1.3, 1.3);
  }
}
function paintFeatureWallConcrete(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(13627);
  const surfaceBase = canvasCtx.createLinearGradient(0, 0, width, height);
  surfaceBase.addColorStop(0, "#bcb9b3");
  surfaceBase.addColorStop(0.5, "#b2afa9");
  surfaceBase.addColorStop(1, "#a8a5a0");
  canvasCtx.fillStyle = surfaceBase;
  canvasCtx.fillRect(0, 0, width, height);
  for (let cloud = 0; cloud < 34; cloud += 1) {
    const cloudX = featureRandom() * width;
    const cloudY = featureRandom() * height;
    const cloudRadius = Math.min(width, height) * (0.1 + featureRandom() * 0.4);
    const cloudLighter = featureRandom() > 0.5;
    const cloudTone = cloudLighter ? "226, 224, 219" : "138, 136, 131";
    const cloudGradient = canvasCtx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudRadius);
    cloudGradient.addColorStop(0, "rgba(" + cloudTone + ", " + (0.1 + featureRandom() * 0.22).toFixed(2) + ")");
    cloudGradient.addColorStop(1, "rgba(" + cloudTone + ", 0)");
    canvasCtx.fillStyle = cloudGradient;
    canvasCtx.fillRect(cloudX - cloudRadius, cloudY - cloudRadius, cloudRadius * 2, cloudRadius * 2);
  }
  for (let trowel = 0; trowel < 16; trowel += 1) {
    const trowelX = featureRandom() * width;
    const trowelY = featureRandom() * height;
    const trowelRadius = Math.min(width, height) * (0.18 + featureRandom() * 0.34);
    canvasCtx.strokeStyle = "rgba(240, 238, 233, " + (0.05 + featureRandom() * 0.12).toFixed(2) + ")";
    canvasCtx.lineWidth = 6 + featureRandom() * 22;
    canvasCtx.beginPath();
    canvasCtx.arc(trowelX, trowelY, trowelRadius, Math.PI * (0.7 + featureRandom() * 0.6), Math.PI * (1.3 + featureRandom() * 0.7));
    canvasCtx.stroke();
  }
  canvasCtx.fillStyle = "rgba(255, 255, 255, .3)";
  for (let speck = 0; speck < 1100; speck += 1) {
    canvasCtx.fillRect(featureRandom() * width, featureRandom() * height, 1.3, 1.3);
  }
  canvasCtx.fillStyle = "rgba(64, 62, 59, .12)";
  for (let speck = 0; speck < 900; speck += 1) {
    canvasCtx.fillRect(featureRandom() * width, featureRandom() * height, 1.6, 1.6);
  }
}
function paintFeatureWallFabric(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(38971);
  canvasCtx.fillStyle = featureWallShade(0xc9c0b2, 1);
  canvasCtx.fillRect(0, 0, width, height);
  for (let blotch = 0; blotch < 22; blotch += 1) {
    const blotchX = featureRandom() * width;
    const blotchY = featureRandom() * height;
    const blotchRadius = Math.min(width, height) * (0.12 + featureRandom() * 0.38);
    const blotchLighter = featureRandom() > 0.5;
    const blotchGradient = canvasCtx.createRadialGradient(blotchX, blotchY, 0, blotchX, blotchY, blotchRadius);
    blotchGradient.addColorStop(0, blotchLighter ? "rgba(238, 232, 220, .22)" : "rgba(150, 140, 124, .18)");
    blotchGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    canvasCtx.fillStyle = blotchGradient;
    canvasCtx.fillRect(blotchX - blotchRadius, blotchY - blotchRadius, blotchRadius * 2, blotchRadius * 2);
  }
  const weavePitch = 3;
  for (let column = 0; column < width; column += weavePitch) {
    canvasCtx.fillStyle = (column / weavePitch) % 2 === 0 ? "rgba(96, 86, 72, .12)" : "rgba(252, 248, 240, .14)";
    canvasCtx.fillRect(column, 0, 1.2, height);
  }
  for (let row = 0; row < height; row += weavePitch) {
    canvasCtx.fillStyle = (row / weavePitch) % 2 === 0 ? "rgba(96, 86, 72, .1)" : "rgba(252, 248, 240, .12)";
    canvasCtx.fillRect(0, row, width, 1.2);
  }
  for (let slub = 0; slub < 90; slub += 1) {
    const slubY = featureRandom() * height;
    const slubLength = width * (0.04 + featureRandom() * 0.16);
    const slubX = featureRandom() * (width - slubLength);
    canvasCtx.fillStyle = "rgba(255, 252, 246, " + (0.08 + featureRandom() * 0.2).toFixed(2) + ")";
    canvasCtx.fillRect(slubX, slubY, slubLength, 1.6 + featureRandom() * 1.6);
  }
}
function paintFeatureWallMetal(canvasCtx, width, height) {
  const featureRandom = muralRandomSource(19237);
  const surfaceBase = canvasCtx.createLinearGradient(0, 0, 0, height);
  surfaceBase.addColorStop(0, "#8f959c");
  surfaceBase.addColorStop(0.24, "#b3b8be");
  surfaceBase.addColorStop(0.52, "#9aa0a7");
  surfaceBase.addColorStop(0.78, "#b8bdc3");
  surfaceBase.addColorStop(1, "#8b9198");
  canvasCtx.fillStyle = surfaceBase;
  canvasCtx.fillRect(0, 0, width, height);
  for (let brush = 0; brush < 900; brush += 1) {
    const brushY = featureRandom() * height;
    const brushLength = width * (0.2 + featureRandom() * 0.8);
    const brushX = featureRandom() * (width - brushLength);
    const brushLighter = featureRandom() > 0.5;
    canvasCtx.fillStyle = brushLighter ? "rgba(255, 255, 255, " + (0.03 + featureRandom() * 0.12).toFixed(2) + ")" : "rgba(56, 60, 66, " + (0.03 + featureRandom() * 0.11).toFixed(2) + ")";
    canvasCtx.fillRect(brushX, brushY, brushLength, 0.6 + featureRandom() * 1.4);
  }
  for (let streak = 0; streak < 12; streak += 1) {
    const streakY = featureRandom() * height;
    const streakGradient = canvasCtx.createLinearGradient(0, streakY - height * 0.05, 0, streakY + height * 0.05);
    streakGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    streakGradient.addColorStop(0.5, "rgba(255, 255, 255, " + (0.06 + featureRandom() * 0.12).toFixed(2) + ")");
    streakGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    canvasCtx.fillStyle = streakGradient;
    canvasCtx.fillRect(0, streakY - height * 0.05, width, height * 0.1);
  }
}
/** Procedural cladding for the background wall so no external texture file is required. */
function createFeatureWallTexture(styleValue) {
  const style = normalizeFeatureWallStyle(styleValue);
  if (featureWallTextures.has(style)) {
    return featureWallTextures.get(style);
  }
  const el = document.createElement("canvas");
  el.width = 1024;
  el.height = 768;
  const canvasCtx = el.getContext("2d");
  if (!canvasCtx) {
    return null;
  }
  const surfacePainters = {
    marble: paintFeatureWallMarble,
    wood: paintFeatureWallWood,
    slat: paintFeatureWallSlat,
    stone: paintFeatureWallStone,
    concrete: paintFeatureWallConcrete,
    fabric: paintFeatureWallFabric,
    metal: paintFeatureWallMetal
  };
  surfacePainters[style](canvasCtx, el.width, el.height);
  const texture = new THREE.CanvasTexture(el);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer?.capabilities?.getMaxAnisotropy?.() || 1, 8);
  texture.needsUpdate = true;
  featureWallTextures.set(style, texture);
  return texture;
}
function tvMountLayoutMetrics(item, screenHeight) {
  const group = item.tvMountStyle === "mobile";
  const width = item.tvMountStyle === "tabletop";
  return {
    bodyHeight: screenHeight * (group ? 0.43 : width ? 0.56 : 0.62),
    centerY: screenHeight * (group ? 0.76 : width ? 0.67 : 0.62)
  };
}
function addTvMountMeshes(group, tvMountStyle, itemWidth, itemDepth, itemHeight) {
  const {
    bodyHeight,
    centerY
  } = tvMountLayoutMetrics(tvMountStyle, itemHeight);
  const width = itemWidth * 0.965;
  const height = bodyHeight * 0.94;
  const depth = 0.012;
  const screenOffset = Math.max(itemDepth * 0.28, 0.05) * 0.5 + 0.006;
  const scaledDepth = screenOffset - depth * 0.5;
  if (tvMountStyle.screenEnabled === false) {
    const frameMesh = addBoxMesh(group, width, height, depth, 0, centerY, scaledDepth, 527122, {
      roughness: 0.18
    });
    frameMesh.userData.televisionScreen = true;
    if (isStageEmbed) {
      frameMesh.userData.environmentEffect = true;
    }
    return;
  }
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.035, height * 1.08), new THREE.MeshBasicMaterial({
    color: 7253215,
    transparent: true,
    opacity: 0.09,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  glowMesh.userData.televisionGlow = true;
  if (isStageEmbed) {
    glowMesh.userData.environmentEffect = true;
  }
  glowMesh.position.set(0, centerY, screenOffset - 0.014);
  glowMesh.renderOrder = 6;
  glowMesh.castShadow = false;
  glowMesh.receiveShadow = false;
  group.add(glowMesh);
  const screenTexture = createTvScreenTexture();
  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 527122,
    toneMapped: false
  });
  const screenMaterial = new THREE.MeshBasicMaterial({
    color: screenTexture ? 16777215 : 1519946,
    mapVar: screenTexture,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const panelMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [frameMaterial, frameMaterial, frameMaterial, frameMaterial, screenMaterial, frameMaterial]);
  panelMesh.userData.televisionScreen = true;
  if (isStageEmbed) {
    panelMesh.userData.environmentEffect = true;
  }
  panelMesh.position.set(0, centerY, scaledDepth);
  panelMesh.renderOrder = 7;
  panelMesh.castShadow = false;
  panelMesh.receiveShadow = false;
  group.add(panelMesh);
}
function addSmallCarMeshes(group, chargingEnabled, itemWidth, itemDepth, itemHeight) {
  if (chargingEnabled.chargingEnabled !== true) {
    return;
  }
  const glowColor = 5238711;
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = 256;
  glowCanvas.height = 256;
  const canvasCtx = glowCanvas.getContext("2d");
  const canvasRadius = glowCanvas.width / 2;
  const glowGradient = canvasCtx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
  glowGradient.addColorStop(0, "rgba(79, 239, 183, .48)");
  glowGradient.addColorStop(0.46, "rgba(79, 239, 183, .23)");
  glowGradient.addColorStop(1, "rgba(79, 239, 183, 0)");
  canvasCtx.fillStyle = glowGradient;
  canvasCtx.fillRect(0, 0, glowCanvas.width, glowCanvas.height);
  for (let pixelY = 18; pixelY < glowCanvas.height - 18; pixelY += 10) {
    for (let pixelX = 18; pixelX < glowCanvas.width - 18; pixelX += 10) {
      const radialDistance = Math.hypot(pixelX - canvasRadius, pixelY - canvasRadius) / canvasRadius;
      const alpha = Math.max(0, 1 - radialDistance) * 0.32;
      if (!(alpha <= 0.01)) {
        canvasCtx.fillStyle = "rgba(116, 255, 202, " + alpha + ")";
        canvasCtx.beginPath();
        canvasCtx.arc(pixelX, pixelY, 1.45, 0, Math.PI * 2);
        canvasCtx.fill();
      }
    }
  }
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  glowTexture.needsUpdate = true;
  const glowMesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth * 1.72, itemDepth * 1.42), new THREE.MeshBasicMaterial({
    mapVar: glowTexture,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -3
  }));
  glowMesh.rotation.x = -Math.PI / 2;
  glowMesh.position.y = 0.014;
  glowMesh.renderOrder = 2;
  glowMesh.castShadow = false;
  glowMesh.receiveShadow = false;
  group.add(glowMesh);
  const boltShape = new THREE.Shape();
  boltShape.moveTo(0.08, 0.5);
  boltShape.lineTo(-0.22, 0.04);
  boltShape.lineTo(-0.03, 0.04);
  boltShape.lineTo(-0.13, -0.5);
  boltShape.lineTo(0.25, -0.02);
  boltShape.lineTo(0.05, -0.02);
  boltShape.closePath();
  const boltMesh = new THREE.Mesh(new THREE.ShapeGeometry(boltShape), new THREE.MeshBasicMaterial({
    color: 8257488,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide
  }));
  const boltScale = Math.max(Math.min(itemWidth, itemDepth) * 0.22, 0.18);
  boltMesh.scale.setScalar(boltScale);
  boltMesh.rotation.x = -Math.PI / 2;
  boltMesh.position.set(0, itemHeight + 0.04, 0);
  boltMesh.renderOrder = 9;
  boltMesh.castShadow = false;
  boltMesh.receiveShadow = false;
  group.add(boltMesh);
}
const PILLAR_SHAPES = Object.freeze(["square", "round", "semicircle", "quarter", "quarterinner"]);
const pillarShapeSet = new Set(PILLAR_SHAPES);
function normalizePillarShape(value) {
  return pillarShapeSet.has(value) ? value : PILLAR_SHAPES[0];
}
/**
 * Whether an item's body stands up or lies along the plan. The axis is the item's length: "vertical"
 * points that length into the room, "horizontal" runs it along the plan. It is not a plan rotation:
 * use 平面旋转 for that, including in either posture.
 *
 * A pillar and a light strip ship in opposite postures but share the axis vocabulary, so every helper
 * below keys off the item type rather than off the axis value alone.
 */
const ITEM_AXES = Object.freeze(["vertical", "horizontal"]);
const itemAxisSet = new Set(ITEM_AXES);
/** Pillars ship standing, so a missing axis means "vertical". */
function normalizePillarAxis(value) {
  return itemAxisSet.has(value) ? value : "vertical";
}
/** Light strips ship lying flat, so a missing axis means "horizontal". */
function normalizeStripAxis(value) {
  return itemAxisSet.has(value) ? value : "horizontal";
}
/** True when the pillar is laid down rather than standing. */
function pillarIsLying(item) {
  return item?.type === "pillar" && normalizePillarAxis(item.pillarAxis) === "horizontal";
}
/** True when the light strip is stood up rather than lying flat. */
function stripIsStanding(item) {
  return item?.type === "striplight" && normalizeStripAxis(item.stripAxis) === "vertical";
}
/** True when the item's plan footprint is not simply width x depth and has to be derived. */
function itemFootprintSwapped(item) {
  return pillarIsLying(item) || stripIsStanding(item);
}
/**
 * Plan footprint in metres. A posture trades the item's length axis with the room, so the footprint
 * cannot always be read straight off width/depth:
 * - standing pillar: width x depth (the cross-section);
 * - lying pillar: width x length, because the length now runs along the plan;
 * - lying strip: width x depth (the emitting face);
 * - standing strip: depth x thickness, because the emitting length now runs up the room.
 * Canonical item fields are never mutated, so width/depth/height keep their length and cross-section
 * meaning everywhere else.
 */
function itemPlanFootprint(item) {
  if (pillarIsLying(item)) {
    return { width: finite(item?.width, 0), depth: finite(item?.height, 0) };
  }
  if (stripIsStanding(item)) {
    return { width: finite(item?.height, 0), depth: finite(item?.depth, 0) };
  }
  return { width: finite(item?.width, 0), depth: finite(item?.depth, 0) };
}
/** The same item with its plan footprint written onto width/depth, for whole-item helpers. */
function itemWithPlanFootprint(item) {
  if (!itemFootprintSwapped(item)) {
    return item;
  }
  const footprint = itemPlanFootprint(item);
  return {
    ...item,
    width: footprint.width,
    depth: footprint.depth
  };
}
/** Maps footprint-resize output back onto the item's canonical fields for the current posture. */
function itemFromPlanFootprintResize(item, resized) {
  if (pillarIsLying(item)) {
    // resized.depth is the new length; resized.height still holds the old length and must be dropped.
    const { height: ignoredHeight, ...rest } = resized;
    return {
      ...rest,
      height: finite(resized?.depth, finite(item?.height, 0)),
      depth: finite(item?.depth, finite(resized?.depth, 0.1))
    };
  }
  if (stripIsStanding(item)) {
    // The footprint is thickness x 发光宽度, so the only real size on the plan is the 发光宽度
    // (depth); the thickness is a physical constant and the emitting length is vertical, not on the
    // plan, so both canonical fields are restored rather than taken from the drag.
    return {
      ...resized,
      width: finite(item?.width, 0),
      height: finite(item?.height, 0)
    };
  }
  return resized;
}
/**
 * Applies an item's posture to the mesh group it built, by wrapping the content in a pivot. Wrapping
 * (rather than moving each child) keeps the offset right whatever the asset's origin convention is,
 * and the pivot's local frame is already yawed by the item group, so 平面旋转 still reads as "the
 * direction the item points" and composes with the posture instead of fighting it.
 *
 * Must run LAST, after the external-model swap: that swap disposes everything built before it and
 * attaches a fresh upright clone, so posing any earlier is thrown away.
 *
 * - A lying pillar pitches down about X, so its length runs along the plan and its cross-section rests
 *   on the item's floor plane.
 * - A standing strip pitches up about Z, so its emitting length runs up the room; it hangs from the
 *   mounting height (离地) rather than rising past it, which keeps a ceiling-mounted strip indoors.
 */
function applyItemPosture(group, item) {
  const lyingPillar = pillarIsLying(item);
  const standingStrip = stripIsStanding(item);
  if ((!lyingPillar && !standingStrip) || !group.children.length) {
    return;
  }
  const pivot = new THREE.Group();
  for (const child of [...group.children]) {
    pivot.add(child);
  }
  pivot.rotation[lyingPillar ? "x" : "z"] = lyingPillar ? -Math.PI / 2 : Math.PI / 2;
  pivot.updateMatrixWorld(true);
  // Measured before the pivot joins the group, so this box is already in the group's local frame.
  const content = new THREE.Box3().setFromObject(pivot);
  const centreOf = (min, max) => Number.isFinite(min) && Number.isFinite(max) ? -(min + max) / 2 : 0;
  if (lyingPillar) {
    pivot.position.set(0, Number.isFinite(content.min.y) ? -content.min.y : 0, centreOf(content.min.z, content.max.z));
  } else {
    pivot.position.set(centreOf(content.min.x, content.max.x), Number.isFinite(content.max.y) ? -content.max.y : 0, centreOf(content.min.z, content.max.z));
  }
  group.add(pivot);
}
/** Traces an arc for a pillar outline. The caller has already placed the pen on the arc start. */
function appendPillarOutlineArc(path, centerX, centerY, radiusX, radiusY, startAngle, endAngle, segments) {
  for (let step = 1; step <= segments; step += 1) {
    const angle = startAngle + (endAngle - startAngle) * step / segments;
    path.lineTo(centerX + Math.cos(angle) * radiusX, centerY + Math.sin(angle) * radiusY);
  }
}
/**
 * Pillar footprint in the XY plane: X is the item width and +Y is the item's back edge, so once the
 * extrusion is stood upright every flat face ends up on -Z (the wall side). Every shape fills the
 * item's full width x depth footprint, which keeps the plan symbol and hit-testing unchanged.
 */
function buildPillarOutline(shape, width, depth) {
  const path = new THREE.Shape();
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  if (shape === "round") {
    path.moveTo(halfWidth, 0);
    appendPillarOutlineArc(path, 0, 0, halfWidth, halfDepth, 0, Math.PI * 2, 64);
    return path;
  }
  if (shape === "semicircle") {
    path.moveTo(-halfWidth, halfDepth);
    path.lineTo(halfWidth, halfDepth);
    appendPillarOutlineArc(path, 0, halfDepth, halfWidth, depth, 0, -Math.PI, 32);
    return path;
  }
  if (shape === "quarter") {
    path.moveTo(-halfWidth, halfDepth);
    path.lineTo(halfWidth, halfDepth);
    appendPillarOutlineArc(path, -halfWidth, halfDepth, width, depth, 0, -Math.PI / 2, 32);
    return path;
  }
  if (shape === "quarterinner") {
    // Complement of "quarter" within the same footprint: the concave arc cuts in from the far corner,
    // so stacking a quarter and a quarterinner pillar in place tiles the full width x depth square.
    path.moveTo(halfWidth, halfDepth);
    path.lineTo(halfWidth, -halfDepth);
    path.lineTo(-halfWidth, -halfDepth);
    appendPillarOutlineArc(path, -halfWidth, halfDepth, width, depth, -Math.PI / 2, 0, 32);
    return path;
  }
  path.moveTo(-halfWidth, -halfDepth);
  path.lineTo(halfWidth, -halfDepth);
  path.lineTo(halfWidth, halfDepth);
  path.lineTo(-halfWidth, halfDepth);
  return path;
}
/**
 * Watertight pillar solid for the non-square shapes. The result shares the box convention: centred on
 * the origin and spanning the exact width x depth x height footprint, with ExtrudeGeometry's material
 * groups ordered as [lid caps, side walls] instead of the box's [px, nx, py, ny, pz, nz].
 */
function buildPillarSolidGeometry(shape, width, depth, height) {
  const geometry = new THREE.ExtrudeGeometry(buildPillarOutline(shape, width, depth), {
    depth: height,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2, 0);
  geometry.computeVertexNormals();
  return geometry;
}
/** Mirrors buildPillarOutline on the plan canvas: plan +y is world +z, so the flat faces stay on the back. */
function tracePillarPlanPath(planCtx, shape, widthPx, depthPx) {
  const halfWidth = widthPx / 2;
  const halfDepth = depthPx / 2;
  planCtx.beginPath();
  if (shape === "round") {
    planCtx.ellipse(0, 0, halfWidth, halfDepth, 0, 0, Math.PI * 2);
    return;
  }
  if (shape === "semicircle") {
    // The flat edge sits on the back (-y) and the arc starts exactly where the line ends.
    planCtx.moveTo(-halfWidth, -halfDepth);
    planCtx.lineTo(halfWidth, -halfDepth);
    planCtx.ellipse(0, -halfDepth, halfWidth, depthPx, 0, 0, Math.PI, false);
    return;
  }
  if (shape === "quarter") {
    planCtx.moveTo(-halfWidth, -halfDepth);
    planCtx.lineTo(halfWidth, -halfDepth);
    planCtx.ellipse(-halfWidth, -halfDepth, widthPx, depthPx, 0, 0, Math.PI / 2, false);
    planCtx.closePath();
    return;
  }
  if (shape === "quarterinner") {
    // Mirror of the quarter: same corners, but the arc sweeps back so the symbol is the complement.
    planCtx.moveTo(halfWidth, -halfDepth);
    planCtx.lineTo(halfWidth, halfDepth);
    planCtx.lineTo(-halfWidth, halfDepth);
    planCtx.ellipse(-halfWidth, -halfDepth, widthPx, depthPx, 0, Math.PI / 2, 0, true);
    return;
  }
  planCtx.rect(-halfWidth, -halfDepth, widthPx, depthPx);
}
function buildSmallCarItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, body, bodyColor, wheelColor) {
  if (!attachExternalItemModel(group, item)) {
    addBoxMesh(group, itemWidth * 0.96, itemHeight * 0.38, itemDepth * 0.9, 0, itemHeight * 0.28, 0, body, {
      roughness: 0.46,
      metalness: 0.18
    });
    addBoxMesh(group, itemWidth * 0.78, itemHeight * 0.42, itemDepth * 0.48, 0, itemHeight * 0.62, -itemDepth * 0.03, bodyColor, {
      roughness: 0.38,
      metalness: 0.12
    });
    for (const offsetX of [-0.48, 0.48]) {
      for (const offsetZ of [-0.3, 0.3]) {
        addBoxMesh(group, itemWidth * 0.1, itemHeight * 0.22, itemDepth * 0.17, offsetX * itemWidth, itemHeight * 0.17, offsetZ * itemDepth, wheelColor, {
          rounded: false,
          roughness: 0.82
        });
      }
    }
  }
  addSmallCarMeshes(group, item, itemWidth, itemDepth, itemHeight);
}
function buildCurtainItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, lightColor, darkColor) {
  const curtainPosition = ["left", "right", "split"].includes(item.curtainPosition) ? item.curtainPosition : "split";
  // Children added from here on are the curtain's own parts, tagged below for the rig.
  const firstChildIndex = group.children.length;
  if (isStageEmbed) {
    group.userData.curtainRigRoot = true;
    group.userData.curtainRigBasis = [itemWidth, itemHeight, itemDepth];
  }
  const railGap = Math.min(Math.max(itemDepth * 0.09, 0.012), 0.028);
  const railY = itemHeight - railGap * 1.8;
  const clothTopY = railY - railGap * 1.8;
  const hemY = Math.max(itemHeight * 0.025, 0.025);
  const foldHeight = Math.max(clothTopY - hemY, itemHeight * 0.72);
  addSoftBoxMesh(group, railGap, railGap, itemWidth * 1.06, 0, railY, 0, darkColor, {
    segments: 18,
    rotationZ: Math.PI / 2,
    metalness: 0.68,
    roughness: 0.22
  });
  for (const capX of [-itemWidth * 0.52, itemWidth * 0.52]) {
    addSoftBoxMesh(group, railGap * 1.45, railGap * 1.45, railGap * 0.9, capX, railY, 0, lightColor, {
      segments: 18,
      rotationZ: Math.PI / 2,
      metalness: 0.52,
      roughness: 0.26
    });
  }
  const addCurtainPanel = (startX, panelWidth) => {
    const foldWidth = panelWidth / 7;
    for (let foldIndex = 0; foldIndex < 7; foldIndex += 1) {
      const foldCenterX = startX + foldWidth * (foldIndex + 0.5);
      const foldOffsetZ = foldIndex % 2 === 0 ? itemDepth * 0.1 : -itemDepth * 0.1;
      addBoxMesh(group, foldWidth * 1.24, foldHeight, itemDepth * 0.62, foldCenterX, hemY + foldHeight * 0.5, foldOffsetZ, lightColor, {
        radius: Math.min(foldWidth * 0.34, 0.035),
        roughness: 0.94,
        metalness: 0
      });
    }
    addBoxMesh(group, panelWidth * 1.03, Math.max(itemHeight * 0.018, 0.025), itemDepth * 0.74, startX + panelWidth * 0.5, hemY + itemHeight * 0.015, 0, darkColor, {
      radius: 0.01,
      roughness: 0.72,
      metalness: 0.02
    });
    addBoxMesh(group, panelWidth * 1.06, Math.max(itemHeight * 0.025, 0.035), itemDepth * 0.82, startX + panelWidth * 0.5, hemY + foldHeight * 0.52, 0, lightColor, {
      radius: 0.012,
      roughness: 0.48,
      metalness: 0.08
    });
  };
  if (curtainPosition === "left") {
    addCurtainPanel(-itemWidth * 0.5, itemWidth * 0.24);
  } else if (curtainPosition === "right") {
    addCurtainPanel(itemWidth * 0.26, itemWidth * 0.24);
  } else {
    addCurtainPanel(-itemWidth * 0.5, itemWidth * 0.16);
    addCurtainPanel(itemWidth * 0.34, itemWidth * 0.16);
  }
  if (isStageEmbed) {
    const curtainParts = group.children.slice(firstChildIndex);
    curtainParts.forEach((part, index) => {
      part.userData.curtainPart = index === 0 ? "rod" : index < 3 ? "cap" : (index - 3) % 9 < 7 ? "cloth" : "band";
    });
  }
}
function buildStairItemMeshGroup(group, itemWidth, itemDepth, itemHeight, furnitureColor, accentColor, softColor) {
  const depthStep = itemDepth / 10;
  for (let stepIndex = 0; stepIndex < 10; stepIndex += 1) {
    const layerHeight = itemHeight * (stepIndex + 1) / 10;
    const layerZ = -itemDepth * 0.5 + depthStep * (stepIndex + 0.5);
    addBoxMesh(group, itemWidth, layerHeight, depthStep * 1.015, 0, layerHeight * 0.5, layerZ, stepIndex % 2 ? furnitureColor : accentColor, {
      rounded: false,
      roughness: 0.82
    });
    addBoxMesh(group, itemWidth * 1.01, 0.018, depthStep * 0.94, 0, layerHeight + 0.009, layerZ, softColor, {
      rounded: false,
      castShadow: false,
      roughness: 0.72
    });
  }
}
function buildSofaItemMeshGroup(group, itemWidth, itemDepth, itemHeight, furnitureColor, accentColor) {
  // Seat parts sit slightly below their nominal height so cushions visually rest on the frame.
  const seatDrop = itemHeight * 0.14;
  const seatY = nominalY => nominalY - seatDrop - 0.008;
  addBoxMesh(group, itemWidth * 0.92, itemHeight * 0.28, itemDepth * 0.72, 0, seatY(itemHeight * 0.28), itemDepth * 0.06, furnitureColor);
  addBoxMesh(group, itemWidth * 0.92, itemHeight * 0.55, itemDepth * 0.18, 0, seatY(itemHeight * 0.56), -itemDepth * 0.35, furnitureColor);
  addBoxMesh(group, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, -itemWidth * 0.46, seatY(itemHeight * 0.39), itemDepth * 0.03, furnitureColor);
  addBoxMesh(group, itemWidth * 0.1, itemHeight * 0.48, itemDepth * 0.75, itemWidth * 0.46, seatY(itemHeight * 0.39), itemDepth * 0.03, furnitureColor);
  addBoxMesh(group, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, -itemWidth * 0.22, seatY(itemHeight * 0.47), itemDepth * 0.07, accentColor);
  addBoxMesh(group, itemWidth * 0.42, itemHeight * 0.12, itemDepth * 0.55, itemWidth * 0.22, seatY(itemHeight * 0.47), itemDepth * 0.07, accentColor);
}
function buildBedItemMeshGroup(group, itemWidth, itemDepth, itemHeight, frameColor, quiltColor, headboardColor, pillowColor) {
  addBoxMesh(group, itemWidth * 0.996, itemHeight * 0.3, itemDepth * 0.996, 0, itemHeight * 0.15, 0, frameColor);
  addBoxMesh(group, itemWidth * 0.96, itemHeight * 0.32, itemDepth * 0.92, 0, itemHeight * 0.43, itemDepth * 0.03, quiltColor);
  addBoxMesh(group, itemWidth, itemHeight * 0.95, itemDepth * 0.09, 0, itemHeight * 0.48, -itemDepth * 0.455, headboardColor);
  addBoxMesh(group, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, -itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, pillowColor);
  addBoxMesh(group, itemWidth * 0.38, itemHeight * 0.14, itemDepth * 0.22, itemWidth * 0.23, itemHeight * 0.66, -itemDepth * 0.29, pillowColor);
}
function buildCabinetItemMeshGroup(group, itemWidth, itemDepth, itemHeight, furnitureColor, darkColor, softColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, furnitureColor);
  addBoxMesh(group, 0.018, itemHeight * 0.9, itemDepth * 1.01, 0, itemHeight * 0.52, itemDepth * 0.01, darkColor);
  addBoxMesh(group, 0.025, 0.16, 0.035, -0.08, itemHeight * 0.55, itemDepth * 0.515, softColor, {
    metalness: 0.55
  });
  addBoxMesh(group, 0.025, 0.16, 0.035, 0.08, itemHeight * 0.55, itemDepth * 0.515, softColor, {
    metalness: 0.55
  });
}
function buildDeskItemMeshGroup(group, itemWidth, itemDepth, itemHeight, topColor, legColor, drawerColor, handleColor) {
  addBoxMesh(group, itemWidth, itemHeight * 0.1, itemDepth, 0, itemHeight * 0.93, 0, topColor);
  addBoxMesh(group, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, -itemWidth * 0.44, itemHeight * 0.44, 0, legColor);
  addBoxMesh(group, itemWidth * 0.05, itemHeight * 0.88, itemDepth * 0.82, itemWidth * 0.44, itemHeight * 0.44, 0, legColor);
  addBoxMesh(group, itemWidth * 0.34, itemHeight * 0.18, itemDepth * 0.78, itemWidth * 0.22, itemHeight * 0.74, 0, drawerColor);
  addBoxMesh(group, itemWidth * 0.27, 0.018, itemDepth * 0.04, itemWidth * 0.22, itemHeight * 0.73, itemDepth * 0.41, handleColor, {
    metalness: 0.35
  });
}
function buildNightstandItemMeshGroup(group, itemWidth, itemDepth, itemHeight, furnitureColor, accentColor, darkColor, softColor) {
  addBoxMesh(group, itemWidth, itemHeight * 0.78, itemDepth, 0, itemHeight * 0.49, 0, furnitureColor);
  addBoxMesh(group, itemWidth * 1.04, itemHeight * 0.07, itemDepth * 1.05, 0, itemHeight * 0.91, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.63, itemDepth * 0.01, darkColor, {
    rounded: false
  });
  addBoxMesh(group, itemWidth * 0.9, 0.014, itemDepth * 1.01, 0, itemHeight * 0.38, itemDepth * 0.01, darkColor, {
    rounded: false
  });
  addBoxMesh(group, itemWidth * 0.22, 0.022, 0.032, 0, itemHeight * 0.5, itemDepth * 0.52, softColor, {
    metalness: 0.5
  });
  for (const legOffsetX of [-0.38, 0.38]) {
    for (const legOffsetZ of [-0.35, 0.35]) {
      addBoxMesh(group, 0.035, itemHeight * 0.2, 0.035, itemWidth * legOffsetX, itemHeight * 0.1, itemDepth * legOffsetZ, darkColor, {
        metalness: 0.18
      });
    }
  }
}
function buildTableItemMeshGroup(group, itemWidth, itemDepth, itemHeight, topColor, legColor, accentColor) {
  const topWidth = itemWidth * 0.64;
  const topDepth = itemDepth * 0.48;
  addBoxMesh(group, topWidth, itemHeight * 0.1, topDepth, 0, itemHeight * 0.93, 0, topColor);
  for (const legOffsetX of [-0.43, 0.43]) {
    for (const legOffsetZ of [-0.38, 0.38]) {
      addBoxMesh(group, 0.07, itemHeight * 0.9, 0.07, topWidth * legOffsetX, itemHeight * 0.45, topDepth * legOffsetZ, legColor);
    }
  }
  // Four upright panels double as the table's display bezels.
  const panelWidth = Math.min(itemWidth * 0.2, 0.5);
  const panelDepth = Math.min(itemDepth * 0.27, 0.5);
  const panelHeight = itemHeight * 1.18;
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, -itemWidth * 0.37, 0, Math.PI / 2, accentColor, legColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, itemWidth * 0.37, 0, -Math.PI / 2, accentColor, legColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, 0, -itemDepth * 0.35, 0, accentColor, legColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, 0, itemDepth * 0.35, Math.PI, accentColor, legColor);
}
function buildRoundTableItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, lightColor, bodyColor, darkColor, accentColor) {
  const tabletopSize = Math.min(itemWidth, itemDepth) * 0.32;
  const tabletopThickness = Math.max(itemHeight * 0.07, 0.045);
  const tabletopY = itemHeight * 0.92;
  const narrowSide = Math.min(itemWidth, itemDepth);
  addSoftBoxMesh(group, tabletopSize, tabletopSize, tabletopThickness, 0, tabletopY, 0, lightColor, {
    segments: 48,
    roughness: 0.5,
    metalness: 0.08
  });
  addSoftBoxMesh(group, narrowSide * 0.22, narrowSide * 0.3, itemHeight * 0.68, 0, itemHeight * 0.43, 0, bodyColor, {
    segments: 36,
    roughness: 0.55,
    metalness: 0.06
  });
  addSoftBoxMesh(group, narrowSide * 0.34, narrowSide * 0.34, itemHeight * 0.07, 0, itemHeight * 0.045, 0, darkColor, {
    segments: 40,
    roughness: 0.42,
    metalness: 0.12
  });
  if (hasRoundTableTurntable(item)) {
    const turntableY = tabletopY + tabletopThickness * 0.58;
    addSoftBoxMesh(group, tabletopSize * 0.58, tabletopSize * 0.58, Math.max(itemHeight * 0.035, 0.025), 0, turntableY, 0, accentColor, {
      segments: 48,
      roughness: 0.48,
      metalness: 0.08
    });
    addSoftBoxMesh(group, tabletopSize * 0.44, tabletopSize * 0.44, 0.018, 0, turntableY + 0.036, 0, darkColor, {
      segments: 48,
      roughness: 0.32,
      metalness: 0.12
    });
  }
  const panelWidth = Math.min(itemWidth * 0.17, 0.42);
  const panelDepth = Math.min(itemDepth * 0.19, 0.44);
  const panelHeight = itemHeight * 1.15;
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, -itemWidth * 0.38, 0, Math.PI / 2, accentColor, darkColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, itemWidth * 0.38, 0, -Math.PI / 2, accentColor, darkColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, 0, -itemDepth * 0.38, 0, accentColor, darkColor);
  buildTelevisionMesh(group, panelWidth, panelDepth, panelHeight, 0, itemDepth * 0.38, Math.PI, accentColor, darkColor);
}
function buildBarItemMeshGroup(group, itemWidth, itemDepth, itemHeight, accentColor, furnitureColor, darkColor) {
  addBoxMesh(group, itemWidth, itemHeight * 0.12, itemDepth, 0, itemHeight * 0.94, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth * 0.92, itemHeight * 0.78, itemDepth * 0.46, 0, itemHeight * 0.45, -itemDepth * 0.18, furnitureColor, {
    roughness: 0.65
  });
  addBoxMesh(group, itemWidth * 0.86, itemHeight * 0.48, 0.035, 0, itemHeight * 0.42, itemDepth * 0.28, darkColor, {
    rounded: false,
    roughness: 0.48
  });
  for (const stoolOffset of [-0.3, 0, 0.3]) {
    addSoftBoxMesh(group, itemDepth * 0.14, itemDepth * 0.14, 0.045, itemWidth * stoolOffset, itemHeight * 0.66, itemDepth * 0.52, accentColor, {
      segments: 28,
      roughness: 0.52
    });
    addSoftBoxMesh(group, 0.025, 0.025, itemHeight * 0.62, itemWidth * stoolOffset, itemHeight * 0.34, itemDepth * 0.52, darkColor, {
      segments: 18,
      metalness: 0.38,
      roughness: 0.28
    });
    addSoftBoxMesh(group, itemDepth * 0.1, itemDepth * 0.12, 0.035, itemWidth * stoolOffset, 0.018, itemDepth * 0.52, darkColor, {
      segments: 24,
      metalness: 0.3,
      roughness: 0.34
    });
  }
}
function buildFridgeItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, handleColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight / 2, 0, bodyColor, {
    metalness: 0.18,
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth * 0.88, 0.018, itemDepth * 1.01, 0, itemHeight * 0.42, itemDepth * 0.01, handleColor, {
    metalness: 0.5
  });
  addBoxMesh(group, 0.025, itemHeight * 0.27, 0.035, itemWidth * 0.35, itemHeight * 0.65, itemDepth * 0.515, handleColor, {
    metalness: 0.7
  });
}
function buildWallAcItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, bodyColor, {
    roughness: 0.46
  });
  addBoxMesh(group, itemWidth * 0.9, itemHeight * 0.08, itemDepth * 0.18, 0, itemHeight * 0.18, itemDepth * 0.46, darkColor, {
    rounded: false,
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth * 0.12, itemHeight * 0.08, itemDepth * 0.05, itemWidth * 0.34, itemHeight * 0.68, itemDepth * 0.51, accentColor, {
    rounded: false,
    emissive: accentColor,
    emissiveIntensity: 0.18
  });
}
function buildAquariumItemMeshGroup(group, itemWidth, itemDepth, itemHeight, glassColors, bodyColor) {
  const tankHeight = Math.max(itemHeight * 0.52, 0.45);
  const upperHeight = Math.max(itemHeight - tankHeight, 0.2);
  const glassThickness = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.025, 0.012), 0.028);
  const glassProfile = {
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
  addBoxMesh(group, itemWidth, tankHeight, itemDepth, 0, tankHeight * 0.5, 0, bodyColor, {
    rounded: false,
    roughness: 0.56
  });
  addBoxMesh(group, itemWidth, 0.035, itemDepth, 0, tankHeight, 0, glassColors.frame, {
    rounded: false,
    metalness: 0.34,
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth - glassThickness * 2, upperHeight, glassThickness, 0, tankHeight + upperHeight * 0.5, -itemDepth * 0.5 + glassThickness * 0.5, glassColors.glass, glassProfile);
  addBoxMesh(group, itemWidth - glassThickness * 2, upperHeight, glassThickness, 0, tankHeight + upperHeight * 0.5, itemDepth * 0.5 - glassThickness * 0.5, glassColors.glass, glassProfile);
  addBoxMesh(group, glassThickness, upperHeight, itemDepth - glassThickness * 2, -itemWidth * 0.5 + glassThickness * 0.5, tankHeight + upperHeight * 0.5, 0, glassColors.glass, glassProfile);
  addBoxMesh(group, glassThickness, upperHeight, itemDepth - glassThickness * 2, itemWidth * 0.5 - glassThickness * 0.5, tankHeight + upperHeight * 0.5, 0, glassColors.glass, glassProfile);
}
function buildMuralItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, frameColor, artColor) {
  const frameDepth = Math.max(itemDepth, 0.04);
  const frameBand = Math.min(itemWidth, itemHeight) * 0.058;
  const artWidth = Math.max(itemWidth - frameBand * 1.9, itemWidth * 0.36);
  const artHeight = Math.max(itemHeight - frameBand * 1.9, itemHeight * 0.36);
  const wallZ = -frameDepth * 0.5;
  addBoxMesh(group, itemWidth, itemHeight, frameDepth * 0.66, 0, itemHeight * 0.5, wallZ + frameDepth * 0.33, frameColor, {
    rounded: false,
    roughness: 0.62,
    metalness: 0.04
  });
  addBoxMesh(group, artWidth, artHeight, frameDepth * 0.34, 0, itemHeight * 0.5, wallZ + frameDepth * 0.5, artColor, {
    rounded: false,
    roughness: 0.94,
    metalness: 0
  });
  const muralTexture = createMuralArtTexture(item.muralStyle);
  if (muralTexture) {
    const artwork = new THREE.Mesh(new THREE.PlaneGeometry(artWidth, artHeight), new THREE.MeshStandardMaterial({
      map: muralTexture,
      roughness: 0.82,
      metalness: 0
    }));
    artwork.position.set(0, itemHeight * 0.5, wallZ + frameDepth * 0.72);
    artwork.castShadow = false;
    artwork.receiveShadow = true;
    group.add(artwork);
  }
  const frameProfile = {
    rounded: false,
    roughness: 0.4,
    metalness: 0.16
  };
  addBoxMesh(group, itemWidth, frameBand, frameDepth, 0, frameBand * 0.5, 0, frameColor, frameProfile);
  addBoxMesh(group, itemWidth, frameBand, frameDepth, 0, itemHeight - frameBand * 0.5, 0, frameColor, frameProfile);
  addBoxMesh(group, frameBand, itemHeight - frameBand * 2, frameDepth, -itemWidth * 0.5 + frameBand * 0.5, itemHeight * 0.5, 0, frameColor, frameProfile);
  addBoxMesh(group, frameBand, itemHeight - frameBand * 2, frameDepth, itemWidth * 0.5 - frameBand * 0.5, itemHeight * 0.5, 0, frameColor, frameProfile);
}
function buildFeatureWallItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight) {
  const wallStyle = normalizeFeatureWallStyle(item.wallStyle);
  const wallMaterial = FEATURE_WALL_STYLE_MATERIAL[wallStyle];
  const panelDepth = Math.max(itemDepth, 0.04);
  addBoxMesh(group, itemWidth, itemHeight, panelDepth, 0, itemHeight * 0.5, -panelDepth * 0.5, wallMaterial.color, {
    rounded: false,
    roughness: wallMaterial.roughness,
    metalness: wallMaterial.metalness
  });
  const panelTexture = createFeatureWallTexture(wallStyle);
  if (panelTexture) {
    const cladding = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth, itemHeight), new THREE.MeshStandardMaterial({
      map: panelTexture,
      roughness: wallMaterial.roughness,
      metalness: wallMaterial.metalness
    }));
    cladding.position.set(0, itemHeight * 0.5, 0.0015);
    cladding.castShadow = false;
    cladding.receiveShadow = true;
    group.add(cladding);
  }
  if (wallStyle === "slat") {
    const slatCount = Math.min(48, Math.max(4, Math.round(itemWidth / 0.1)));
    const slatPitch = itemWidth / slatCount;
    const slatWidth = slatPitch * 0.62;
    const slatDepth = Math.min(Math.max(panelDepth * 0.62, 0.02), 0.05);
    for (let slat = 0; slat < slatCount; slat += 1) {
      addBoxMesh(group, slatWidth, itemHeight, slatDepth, -itemWidth * 0.5 + slatPitch * (slat + 0.5), itemHeight * 0.5, slatDepth * 0.5 + 0.002, wallMaterial.color, {
        rounded: false,
        roughness: 0.7,
        metalness: 0.03
      });
    }
  }
}
function buildCoffeeTableItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, lightColor, accentColor) {
  const tabletopRadius = Math.min(itemWidth * 0.34, itemDepth * 0.42);
  const lowerTopRadius = Math.min(itemWidth * 0.23, itemDepth * 0.29);
  const leftX = -itemWidth * 0.16;
  const frontZ = itemDepth * 0.08;
  const rightX = itemWidth * 0.24;
  const backZ = -itemDepth * 0.2;
  // The two supports are boxes whose depth happens to be derived from itemHeight.
  const nearSupportDepth = itemHeight * 0.58;
  const farSupportDepth = itemHeight * 0.76;
  addSoftBoxMesh(group, tabletopRadius * 0.3, tabletopRadius * 0.5, nearSupportDepth, leftX, nearSupportDepth * 0.5, frontZ, bodyColor, {
    segments: 40,
    roughness: 0.82
  });
  const slabThickness = itemHeight * 0.07;
  const inlayThickness = itemHeight * 0.055;
  const slabY = nearSupportDepth + slabThickness * 0.5 + 0.001;
  const inlayY = slabY + (slabThickness + inlayThickness) * 0.5 + 0.001;
  addSoftBoxMesh(group, tabletopRadius * 1.02, tabletopRadius * 1.02, slabThickness, leftX, slabY, frontZ, darkColor, {
    segments: 48,
    roughness: 0.72
  });
  addSoftBoxMesh(group, tabletopRadius, tabletopRadius, inlayThickness, leftX, inlayY, frontZ, lightColor, {
    segments: 48,
    roughness: 0.9
  });
  addSoftBoxMesh(group, lowerTopRadius * 0.32, lowerTopRadius * 0.52, farSupportDepth, rightX, farSupportDepth * 0.5, backZ, accentColor, {
    segments: 40,
    roughness: 0.82
  });
  const lowerSlabThickness = itemHeight * 0.07;
  const lowerInlayThickness = itemHeight * 0.055;
  const lowerSlabY = farSupportDepth + lowerSlabThickness * 0.5 + 0.001;
  const lowerInlayY = lowerSlabY + (lowerSlabThickness + lowerInlayThickness) * 0.5 + 0.001;
  addSoftBoxMesh(group, lowerTopRadius * 1.02, lowerTopRadius * 1.02, lowerSlabThickness, rightX, lowerSlabY, backZ, darkColor, {
    segments: 48,
    roughness: 0.72
  });
  addSoftBoxMesh(group, lowerTopRadius, lowerTopRadius, lowerInlayThickness, rightX, lowerInlayY, backZ, lightColor, {
    segments: 48,
    roughness: 0.9
  });
}
function buildSquareCoffeeTableItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, topColor, darkColor) {
  const baseThickness = Math.max(itemHeight * 0.22, 0.085);
  const topThickness = Math.max(itemHeight * 0.16, 0.065);
  const baseY = baseThickness + 0.012;
  const bodyHeight = Math.max(itemHeight - baseY - topThickness, 0.16);
  const sideThickness = Math.max(itemWidth * 0.075, 0.045);
  const drawerDepth = Math.max(itemDepth * 0.035, 0.018);
  const drawerHeight = bodyHeight * 0.72;
  const drawerY = baseY + bodyHeight * 0.48;
  const drawerWidth = itemWidth * 0.27;
  const drawerOffsetX = itemWidth * 0.34;
  addBoxMesh(group, itemWidth * 0.98, topThickness, itemDepth * 1.03, 0, baseY + bodyHeight + topThickness * 0.5, 0, topColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.035,
    roughness: 0.5,
    metalness: 0.02
  });
  addBoxMesh(group, sideThickness, bodyHeight, itemDepth * 0.92, -itemWidth * 0.5 + sideThickness * 0.5, baseY + bodyHeight * 0.5, 0, bodyColor, {
    rounded: false,
    roughness: 0.6
  });
  addBoxMesh(group, sideThickness, bodyHeight, itemDepth * 0.92, itemWidth * 0.5 - sideThickness * 0.5, baseY + bodyHeight * 0.5, 0, bodyColor, {
    rounded: false,
    roughness: 0.6
  });
  addBoxMesh(group, itemWidth * 0.86, bodyHeight * 0.9, 0.035, 0, baseY + bodyHeight * 0.52, -itemDepth * 0.45, bodyColor, {
    rounded: false,
    roughness: 0.75
  });
  addBoxMesh(group, itemWidth * 0.86, bodyHeight * 0.1, itemDepth * 0.9, 0, baseY + bodyHeight * 0.08, 0, bodyColor, {
    rounded: false,
    roughness: 0.58
  });
  for (const drawerX of [-drawerOffsetX, 0, drawerOffsetX]) {
    addBoxMesh(group, drawerWidth, drawerHeight, drawerDepth, drawerX, drawerY, itemDepth * 0.48, topColor, {
      radius: Math.min(itemWidth, itemDepth) * 0.025,
      roughness: 0.52
    });
    const handleX = drawerX === 0 ? 0 : drawerX + (drawerX < 0 ? drawerWidth * 0.3 : -drawerWidth * 0.3);
    addBoxMesh(group, 0.022, drawerHeight * 0.2, 0.025, handleX, drawerY, itemDepth * 0.505, darkColor, {
      radius: 0.009,
      metalness: 0.22,
      roughness: 0.3
    });
  }
  const legSize = Math.max(Math.min(itemWidth, itemDepth) * 0.055, 0.035);
  for (const legX of [-itemWidth * 0.4, itemWidth * 0.4]) {
    for (const legZ of [-itemDepth * 0.36, itemDepth * 0.36]) {
      const mesh = addBoxMesh(group, legSize, legZ, legSize, legX, legZ * 0.5, legZ, darkColor, {
        radius: legSize * 0.22,
        roughness: 0.55,
        metalness: 0.02
      });
      mesh.rotation.z = (legX < 0 ? -1 : 1) * 0.09;
      mesh.rotation.x = (legZ < 0 ? -1 : 1) * 0.06;
    }
  }
}
function buildSideboardItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, handleColor) {
  // Heights are floored so a very short sideboard still keeps readable proportions.
  const cabinetHeight = Math.max(itemHeight, 1.8);
  const lowerBodyHeight = cabinetHeight * 0.39;
  const topBandHeight = cabinetHeight * 0.22;
  const upperBodyStartY = lowerBodyHeight + topBandHeight;
  const upperBodyHeight = cabinetHeight - upperBodyStartY;
  const handleWidth = itemWidth * 0.31;
  const lowerHandleHeight = lowerBodyHeight * 0.88;
  const upperHandleHeight = upperBodyHeight * 0.86;
  addBoxMesh(group, itemWidth, lowerBodyHeight, itemDepth, 0, lowerBodyHeight * 0.5, 0, bodyColor, {
    roughness: 0.58
  });
  addBoxMesh(group, itemWidth, 0.045, itemDepth, 0, lowerBodyHeight, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth, topBandHeight, 0.045, 0, lowerBodyHeight + topBandHeight * 0.5, -itemDepth * 0.46, bodyColor, {
    rounded: false,
    roughness: 0.62
  });
  addBoxMesh(group, itemWidth, upperBodyHeight, itemDepth, 0, upperBodyStartY + upperBodyHeight * 0.5, 0, bodyColor, {
    roughness: 0.58
  });
  for (const handleOffset of [-0.33, 0, 0.33]) {
    addBoxMesh(group, handleWidth, lowerHandleHeight, 0.026, itemWidth * handleOffset, lowerBodyHeight * 0.48, itemDepth * 0.515, handleColor, {
      rounded: false,
      roughness: 0.45
    });
    addBoxMesh(group, handleWidth, upperHandleHeight, 0.026, itemWidth * handleOffset, upperBodyStartY + upperBodyHeight * 0.5, itemDepth * 0.515, handleColor, {
      rounded: false,
      roughness: 0.45
    });
  }
}
function buildShoeCabinetItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, handleColor) {
  // Stored height never drops below 1.9 so the stacked compartments stay separable.
  const cabinetHeight = Math.max(itemHeight, 1.9);
  const leftWidth = itemWidth * 0.5;
  const rightWidth = itemWidth * 0.5;
  const leftCenterX = -itemWidth * 0.25;
  const rightCenterX = itemWidth * 0.25;
  const lowerSectionHeight = cabinetHeight * 0.22;
  const middleSectionHeight = cabinetHeight * 0.43;
  const middleDrawerHeight = cabinetHeight * 0.21;
  const upperDrawerHeight = cabinetHeight * 0.37;
  addBoxMesh(group, itemWidth * 0.98, cabinetHeight * 0.93, 0.045, 0, cabinetHeight * 0.48, -itemDepth * 0.47, bodyColor, {
    rounded: false,
    roughness: 0.62
  });
  addBoxMesh(group, leftWidth, lowerSectionHeight * 0.56, itemDepth * 0.92, leftCenterX, lowerSectionHeight * 0.35, 0, bodyColor, {
    roughness: 0.56
  });
  addBoxMesh(group, leftWidth * 1.02, 0.055, itemDepth * 1.04, leftCenterX, lowerSectionHeight * 0.67, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, rightWidth, middleSectionHeight, itemDepth, rightCenterX, middleSectionHeight * 0.5, 0, bodyColor, {
    roughness: 0.58
  });
  for (const handleOffset of [-0.245, 0.245]) {
    addBoxMesh(group, rightWidth * 0.47, middleSectionHeight * 0.84, 0.026, rightCenterX + rightWidth * handleOffset, middleSectionHeight * 0.48, itemDepth * 0.515, handleColor, {
      rounded: false,
      roughness: 0.45
    });
  }
  const middleDrawerY = cabinetHeight - middleDrawerHeight - 0.045;
  addBoxMesh(group, leftWidth, middleDrawerHeight, itemDepth, leftCenterX, middleDrawerY + middleDrawerHeight * 0.5, 0, bodyColor, {
    roughness: 0.58
  });
  for (const handleOffset of [-0.245, 0.245]) {
    addBoxMesh(group, leftWidth * 0.47, middleDrawerHeight * 0.86, 0.026, leftCenterX + leftWidth * handleOffset, middleDrawerY + middleDrawerHeight * 0.5, itemDepth * 0.515, handleColor, {
      rounded: false,
      roughness: 0.45
    });
  }
  const upperDrawerY = cabinetHeight - upperDrawerHeight - 0.045;
  addBoxMesh(group, rightWidth, upperDrawerHeight, itemDepth, rightCenterX, upperDrawerY + upperDrawerHeight * 0.5, 0, bodyColor, {
    roughness: 0.58
  });
  for (const handleOffset of [-0.245, 0.245]) {
    addBoxMesh(group, rightWidth * 0.47, upperDrawerHeight * 0.9, 0.026, rightCenterX + rightWidth * handleOffset, upperDrawerY + upperDrawerHeight * 0.5, itemDepth * 0.515, handleColor, {
      rounded: false,
      roughness: 0.45
    });
  }
}
function buildShelfItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, softColor) {
  const postSize = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.07, 0.028), 0.052);
  const boardThickness = Math.min(Math.max(itemHeight * 0.022, 0.028), 0.052);
  const boardDepth = Math.max(itemDepth - postSize * 1.4, itemDepth * 0.78);
  const postProfile = {
    rounded: false,
    metalness: 0.62,
    roughness: 0.28
  };
  const boardProfile = {
    rounded: false,
    metalness: 0.18,
    roughness: 0.48
  };
  for (const postOffsetX of [-itemWidth * 0.5 + postSize * 0.5, itemWidth * 0.5 - postSize * 0.5]) {
    for (const postOffsetZ of [-itemDepth * 0.5 + postSize * 0.5, itemDepth * 0.5 - postSize * 0.5]) {
      // NOTE: width and depth intentionally reuse the z offset, because in the original code the
      // inner loop variable shadowed postSize. That makes the posts as thick as they are far from
      // the centre, which looks wrong, but it is preserved verbatim so this extraction stays
      // behaviour-neutral. Fixing it is a separate, visible change.
      addBoxMesh(group, postOffsetZ, itemHeight, postOffsetZ, postOffsetX, itemHeight * 0.5, postOffsetZ, bodyColor, postProfile);
    }
  }
  for (const boardRatio of [0.04, 0.26, 0.49, 0.72, 0.96]) {
    addBoxMesh(group, itemWidth, boardThickness, boardDepth, 0, itemHeight * boardRatio, 0, boardRatio === 0.96 ? softColor : accentColor, boardProfile);
    addBoxMesh(group, itemWidth, postSize * 0.65, postSize, 0, itemHeight * boardRatio, -itemDepth * 0.5 + postSize * 0.5, bodyColor, postProfile);
  }
  const braceSpan = Math.max(itemWidth - postSize * 2, postSize);
  const braceHeight = itemHeight * 0.84;
  const braceLength = Math.hypot(braceSpan, braceHeight);
  for (const braceSide of [-1, 1]) {
    const mesh = addBoxMesh(group, postSize * 0.48, braceLength, postSize * 0.42, 0, itemHeight * 0.5, -itemDepth * 0.5 + postSize * 0.18, bodyColor, {
      ...postProfile,
      castShadow: false
    });
    mesh.rotation.z = braceSide * Math.atan2(braceSpan, braceHeight);
  }
}
function buildPillarItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, glassColors) {
  const wallOpacity = Math.min(glassColors.wallOpacity * 1.75, 0.55);
  // The baked pillar asset is a plain box carrying one uniform material on every face, so all four
  // shapes use a single material too and the shaped solids stay visually identical to the square
  // one. setWallGradientHeight below is kept because wall-trial shader mode reads that attribute.
  const material = createGlassPhysicalMaterial(glassColors.wall, wallOpacity, {
    depthWrite: false,
    depthFunc: THREE.LessDepth
  });
  const pillarShape = normalizePillarShape(item.pillarShape);
  const pillarMesh = pillarShape === "square"
    ? new THREE.Mesh(new THREE.BoxGeometry(itemWidth, itemHeight, itemDepth), material)
    : new THREE.Mesh(buildPillarSolidGeometry(pillarShape, itemWidth, itemDepth, itemHeight), material);
  pillarMesh.position.y = itemHeight * 0.5;
  setWallGradientHeight(THREE, pillarMesh.geometry, "y", itemHeight * 0.5, 1, itemHeight);
  pillarMesh.castShadow = true;
  pillarMesh.receiveShadow = true;
  pillarMesh.renderOrder = 4;
  pillarMesh.userData.reflectionRole = "wall";
  pillarMesh.layers.set(HELPER_LAYER);
  group.add(pillarMesh);
}
function buildWallCabinetItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor) {
  // Sits 1.4 units above the floor, so every y is measured from that mount height.
  const mountY = 1.4;
  const cabinetHeight = itemHeight * 0.28;
  const doorHeight = itemHeight - cabinetHeight;
  const upperY = mountY + cabinetHeight;
  addBoxMesh(group, itemWidth, doorHeight, itemDepth, 0, upperY + doorHeight * 0.5, 0, bodyColor);
  addBoxMesh(group, itemWidth, cabinetHeight, 0.045, 0, mountY + cabinetHeight * 0.5, -itemDepth * 0.45, bodyColor, {
    rounded: false,
    roughness: 0.62
  });
  addBoxMesh(group, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, mountY, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth * 1.02, 0.045, itemDepth * 1.05, 0, upperY, 0, accentColor, {
    roughness: 0.5
  });
  addBoxMesh(group, 0.045, cabinetHeight, itemDepth, -itemWidth * 0.49, mountY + cabinetHeight * 0.5, 0, bodyColor);
  addBoxMesh(group, 0.045, cabinetHeight, itemDepth, itemWidth * 0.49, mountY + cabinetHeight * 0.5, 0, bodyColor);
  const handleWidth = itemWidth * 0.31;
  for (const handleOffset of [-0.33, 0, 0.33]) {
    addBoxMesh(group, handleWidth, doorHeight * 0.9, 0.026, itemWidth * handleOffset, upperY + doorHeight * 0.5, itemDepth * 0.515, accentColor, {
      rounded: false,
      roughness: 0.45
    });
  }
}
function buildGlassCabinetItemMeshGroup(group, itemWidth, itemDepth, itemHeight, glassColors, bodyColor, accentColor, lightColor) {
  const panelThickness = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.1, 0.032), 0.058);
  const min = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
  const railWidth = Math.min(Math.max(itemWidth * 0.014, 0.016), 0.03);
  const max = Math.max(itemWidth - panelThickness * 2, itemWidth * 0.7);
  const numericValue = 0.13;
  const value = 0.3;
  const count = 4;
  const topBandHeight = itemHeight * numericValue;
  const baseHeight = itemHeight * value;
  const midHeight = itemHeight - panelThickness - baseHeight;
  const halfValue = midHeight / count;
  const length = [0.56, 0.24, 0.2];
  const slicedValue = [0, length[0], length[0] + length[1]];
  const slice = slicedValue.slice(1);
  const shelfThickness = Math.max(itemWidth * 0.005, 0.005);
  const frontPanelZ = itemDepth * 0.5 + 0.012;
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
  addBoxMesh(group, panelThickness, itemHeight, itemDepth, -itemWidth * 0.5 + panelThickness * 0.5, itemHeight * 0.5, 0, bodyColor, objectValue);
  addBoxMesh(group, panelThickness, itemHeight, itemDepth, itemWidth * 0.5 - panelThickness * 0.5, itemHeight * 0.5, 0, bodyColor, objectValue);
  addBoxMesh(group, max, itemHeight - panelThickness * 2, min, 0, itemHeight * 0.5, -itemDepth * 0.5 + min * 0.5, bodyColor, {
    ...objectValue,
    roughness: 0.76
  });
  addBoxMesh(group, itemWidth, panelThickness, itemDepth, 0, itemHeight - panelThickness * 0.5, 0, bodyColor, objectValue);
  for (let shelfRowIndex = 0; shelfRowIndex < count; shelfRowIndex += 1) {
    addBoxMesh(group, max, panelThickness * 0.72, itemDepth * 0.9, 0, baseHeight + halfValue * shelfRowIndex, -itemDepth * 0.025, accentColor, objectValue);
  }
  addBoxMesh(group, max, panelThickness * 0.72, itemDepth * 0.9, 0, topBandHeight, -itemDepth * 0.025, accentColor, objectValue);
  for (const bayRatio of slice) {
    const bayOffsetX = -max * 0.5 + max * bayRatio;
    addBoxMesh(group, panelThickness * 0.72, itemHeight - panelThickness, itemDepth * 0.9, bayOffsetX, (itemHeight - panelThickness) * 0.5, -itemDepth * 0.025, bodyColor, objectValue);
  }
  const doorHeight = baseHeight - topBandHeight - panelThickness * 0.9;
  const list = [max * length[0], max * (1 - length[0])];
  let dividerCursorX = -max * 0.5;
  for (let dividerIndex = 0; dividerIndex < list.length; dividerIndex += 1) {
    const dividerWidth = list[dividerIndex] - shelfThickness;
    const value = dividerCursorX + list[dividerIndex] * 0.5;
    addBoxMesh(group, dividerWidth, doorHeight, 0.03, value, value + (baseHeight - value) * 0.5, frontPanelZ, dividerIndex ? accentColor : bodyColor, {
      ...options,
      roughness: 0.56
    });
    dividerCursorX += list[dividerIndex];
  }
  for (let baySlotIndex = 0; baySlotIndex < length.length; baySlotIndex += 1) {
    const bayLeftX = -max * 0.5 + max * slicedValue[baySlotIndex];
    const value = max * length[baySlotIndex];
    const bayMidX = bayLeftX + value * 0.5;
    const doorWidth = Math.max(value - railWidth * 1.65, value * 0.76);
    const doorGlassHeight = Math.max(midHeight - railWidth * 1.55, midHeight * 0.86);
    addBoxMesh(group, doorWidth, doorGlassHeight, 0.018, bayMidX, bayMidX + midHeight * 0.5, frontPanelZ, glassColors.glass, objectValueCurrent);
    addBoxMesh(group, railWidth, midHeight, 0.032, bayLeftX + railWidth * 0.5, bayMidX + midHeight * 0.5, frontPanelZ + 0.009, bodyColor, options);
    if (baySlotIndex === length.length - 1) {
      addBoxMesh(group, railWidth, midHeight, 0.032, bayLeftX + value - railWidth * 0.5, bayMidX + midHeight * 0.5, frontPanelZ + 0.009, bodyColor, options);
    }
    const glassThickness = Math.max(doorWidth * 0.025, 0.007);
    addBoxMesh(group, glassThickness, doorGlassHeight * 0.88, 0.006, bayMidX - doorWidth * 0.37, bayMidX + midHeight * 0.52, frontPanelZ + 0.014, 14282227, objectValueNext);
    addBoxMesh(group, doorWidth * 0.34, Math.max(glassThickness * 0.11, 0.004), 0.006, bayMidX - doorWidth * 0.18, bayMidX + midHeight * 0.88, frontPanelZ + 0.014, 15267578, objectValueNext);
  }
  addBoxMesh(group, max, railWidth, 0.032, 0, baseHeight + railWidth * 0.5, frontPanelZ + 0.009, bodyColor, options);
  addBoxMesh(group, max, railWidth, 0.032, 0, itemHeight - panelThickness - railWidth * 0.5, frontPanelZ + 0.009, bodyColor, options);
  const lengthCurrent = [14736852, 13025203, 10327434, 7301474, accentColor, lightColor];
  const addShelfStack = (baySlot, bayRowOffset, itemCount = 5, itemSeed = 0) => {
    const bayFillWidth = max * length[baySlot];
    const value = -max * 0.5 + max * slicedValue[baySlot];
    const shelfBaseY = baseHeight + halfValue * bayRowOffset + panelThickness * 0.42;
    const shelfGap = Math.max(bayFillWidth * 0.022, 0.004);
    const halfValueCurrent = (bayFillWidth * 0.72 - shelfGap * (itemCount - 1)) / itemCount;
    let bookCursorX = value + bayFillWidth * 0.13;
    for (let bookIndex = 0; bookIndex < itemCount; bookIndex += 1) {
      const bookWidth = halfValueCurrent * [0.8, 1.05, 0.9, 0.72, 0.96][(bookIndex + itemSeed) % 5];
      const value = halfValue * [0.48, 0.58, 0.52, 0.64, 0.55][(bookIndex * 2 + itemSeed) % 5];
      addBoxMesh(group, bookWidth, value, itemDepth * 0.42, bookCursorX + bookWidth * 0.5, shelfBaseY + value * 0.5, itemDepth * 0.12, lengthCurrent[(bookIndex + itemSeed) % lengthCurrent.length], {
        radius: Math.min(bookWidth * 0.12, 0.009),
        roughness: 0.78,
        metalness: 0
      });
      bookCursorX += bookWidth + shelfGap;
    }
  };
  const callback = (nicheSlot, nicheRowOffset, ornamentCount = 3, ornamentSeed = 0) => {
    const nicheWidth = max * length[nicheSlot];
    const value = -max * 0.5 + max * slicedValue[nicheSlot] + nicheWidth * 0.5;
    const nicheBaseY = baseHeight + halfValue * nicheRowOffset + panelThickness * 0.42;
    for (let nicheIndex = 0; nicheIndex < ornamentCount; nicheIndex += 1) {
      addBoxMesh(group, nicheWidth * 0.56, panelThickness * 0.48, itemDepth * 0.4, value, nicheBaseY + panelThickness * (0.3 + nicheIndex * 0.52), itemDepth * 0.12, lengthCurrent[(nicheIndex + ornamentSeed) % lengthCurrent.length], {
        radius: 0.006,
        roughness: 0.78,
        metalness: 0
      });
    }
  };
  addShelfStack(0, 1, 7, 0);
  addShelfStack(2, 2, 4, 2);
  callback(0, 0, 3, 2);
  callback(1, 2, 3, 4);
  for (const [bayIndex, shelfIndex, softScale, softColor] of [[1, 1, 0.16, 12169895], [0, 2, 0.075, 9406334], [2, 3, 0.14, 13749184]]) {
    const bayWidth = max * length[bayIndex];
    const bayCenterX = -max * 0.5 + max * slicedValue[bayIndex] + bayWidth * 0.5;
    const softBaseY = baseHeight + halfValue * shelfIndex + panelThickness * 0.42;
    addSoftBoxMesh(group, bayWidth * softScale * 0.72, bayWidth * softScale, halfValue * 0.46, bayCenterX, softBaseY + halfValue * 0.23, itemDepth * 0.12, softColor, {
      segments: 24,
      roughness: 0.68
    });
  }
}
function buildFloorAcItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  addSoftBoxMesh(group, itemWidth * 0.46, itemWidth * 0.48, itemHeight, 0, itemHeight * 0.5, 0, bodyColor, {
    segments: 32,
    roughness: 0.48
  });
  addBoxMesh(group, itemWidth * 0.5, itemHeight * 0.42, 0.025, 0, itemHeight * 0.68, itemDepth * 0.48, darkColor, {
    rounded: false,
    roughness: 0.3
  });
  for (const heightRatio of [0.58, 0.68, 0.78]) {
    addBoxMesh(group, itemWidth * 0.42, 0.018, 0.03, 0, itemHeight * heightRatio, itemDepth * 0.5, accentColor, {
      rounded: false,
      roughness: 0.34
    });
  }
}

function buildRangeHoodItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, lightColor, darkColor, accentColor) {
  addBoxMesh(group, itemWidth * 0.34, itemHeight * 0.72, itemDepth * 0.42, 0, itemHeight * 0.6, -itemDepth * 0.18, bodyColor, {
    rounded: false,
    metalness: 0.22,
    roughness: 0.42
  });
  addBoxMesh(group, itemWidth, itemHeight * 0.22, itemDepth, 0, itemHeight * 0.18, 0, lightColor, {
    rounded: false,
    metalness: 0.2,
    roughness: 0.4
  });
  addBoxMesh(group, itemWidth * 0.9, itemHeight * 0.07, itemDepth * 0.8, 0, itemHeight * 0.055, itemDepth * 0.02, darkColor, {
    rounded: false,
    metalness: 0.35,
    roughness: 0.28
  });
  addBoxMesh(group, itemWidth * 0.22, itemHeight * 0.035, 0.025, itemWidth * 0.3, itemHeight * 0.2, itemDepth * 0.515, accentColor, {
    rounded: false,
    emissive: accentColor,
    emissiveIntensity: 0.12,
    roughness: 0.3
  });
}

function buildAirPurifierItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  const bodyRadius = Math.min(itemWidth, itemDepth) * 0.47;
  addSoftBoxMesh(group, bodyRadius * 0.96, bodyRadius, itemHeight * 0.92, 0, itemHeight * 0.46, 0, bodyColor, {
    segments: 36,
    roughness: 0.5
  });
  addSoftBoxMesh(group, bodyRadius * 0.92, bodyRadius * 0.92, itemHeight * 0.055, 0, itemHeight * 0.965, 0, darkColor, {
    segments: 36,
    metalness: 0.18,
    roughness: 0.3
  });
  addSoftBoxMesh(group, bodyRadius * 0.55, bodyRadius * 0.55, itemHeight * 0.018, 0, itemHeight * 1.005, 0, accentColor, {
    segments: 32,
    metalness: 0.08,
    roughness: 0.35
  });
  for (const grilleOffset of [-0.28, -0.14, 0, 0.14, 0.28]) {
    addBoxMesh(group, 0.012, itemHeight * 0.45, 0.012, itemWidth * grilleOffset, itemHeight * 0.35, itemDepth * 0.46, accentColor, {
      rounded: false,
      roughness: 0.45
    });
  }
}

function buildLaptopItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor) {
  addBoxMesh(group, itemWidth, 0.025, itemDepth * 0.72, 0, 0.018, itemDepth * 0.08, bodyColor, {
    metalness: 0.28,
    roughness: 0.36
  });
  const mesh = addBoxMesh(group, itemWidth * 0.96, itemHeight * 0.78, 0.018, 0, itemHeight * 0.43, -itemDepth * 0.29, darkColor, {
    rounded: false,
    metalness: 0.22,
    roughness: 0.25
  });
  mesh.rotation.x = -Math.PI * 0.08;
  addBoxMesh(group, itemWidth * 0.86, itemHeight * 0.63, 0.01, 0, itemHeight * 0.43, -itemDepth * 0.278, 659740, {
    rounded: false,
    emissive: 1585226,
    emissiveIntensity: 0.38,
    roughness: 0.18
  });
  addBoxMesh(group, itemWidth * 0.62, 0.009, itemDepth * 0.34, 0, 0.035, itemDepth * 0.12, darkColor, {
    rounded: false
  });
}

function buildSquatToiletItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  addBoxMesh(group, itemWidth, itemHeight * 0.58, itemDepth, 0, itemHeight * 0.29, 0, bodyColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.08,
    roughness: 0.38
  });
  addBoxMesh(group, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, -itemWidth * 0.34, itemHeight * 0.66, 0, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.035,
    roughness: 0.4
  });
  addBoxMesh(group, itemWidth * 0.28, itemHeight * 0.12, itemDepth * 0.58, itemWidth * 0.34, itemHeight * 0.66, 0, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.035,
    roughness: 0.4
  });
  const scale = new THREE.Mesh(new THREE.CylinderGeometry(itemWidth * 0.16, itemWidth * 0.2, itemHeight * 0.18, 28), new THREE.MeshStandardMaterial({
    color: darkColor,
    roughness: 0.34,
    metalness: 0.02
  }));
  scale.scale.z = 1.75;
  scale.position.y = itemHeight * 0.67;
  group.add(scale);
}

function buildUrinalItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  addBoxMesh(group, itemWidth * 0.78, itemHeight * 0.88, itemDepth * 0.72, 0, itemHeight * 0.5, -itemDepth * 0.06, bodyColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.16,
    roughness: 0.32
  });
  const scale = new THREE.Mesh(new THREE.SphereGeometry(Math.min(itemWidth, itemDepth) * 0.3, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.28,
    metalness: 0.02,
    side: THREE.DoubleSide
  }));
  scale.scale.set(0.9, 1.1, 0.62);
  scale.rotation.x = Math.PI;
  scale.position.set(0, itemHeight * 0.53, itemDepth * 0.17);
  group.add(scale);
  addSoftBoxMesh(group, 0.018, 0.018, itemHeight * 0.22, 0, itemHeight * 0.95, -itemDepth * 0.18, darkColor, {
    segments: 16,
    metalness: 0.72,
    roughness: 0.22
  });
}

function buildTvStandItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  addBoxMesh(group, itemWidth, itemHeight * 0.76, itemDepth, 0, itemHeight * 0.42, 0, bodyColor);
  const plinthHeight = itemHeight * 0.08;
  const plinthTopY = itemHeight * 0.8;
  addBoxMesh(group, itemWidth * 0.98, plinthHeight, itemDepth, 0, plinthTopY + plinthHeight * 0.5, 0, accentColor);
  addBoxMesh(group, 0.018, itemHeight * 0.58, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, darkColor, {
    rounded: false
  });
  addBoxMesh(group, itemWidth * 0.91, 0.015, itemDepth * 1.01, 0, itemHeight * 0.43, itemDepth * 0.01, darkColor, {
    rounded: false
  });
  for (const footOffset of [-0.4, 0.4]) {
    addBoxMesh(group, 0.055, itemHeight * 0.2, 0.055, itemWidth * footOffset, itemHeight * 0.1, 0, darkColor, {
      metalness: 0.32
    });
  }
}

function buildRugItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, bodyColor, accentColor) {
  if (!addRugMeshes(group, item, bodyColor, accentColor)) {
    const clampedValue = clamp(itemHeight, 0.004, 0.018);
    addBoxMesh(group, itemWidth, clampedValue, itemDepth, 0, clampedValue * 0.5, 0, bodyColor, {
      radius: Math.min(itemWidth, itemDepth) * 0.018,
      roughness: 1,
      metalness: 0,
      castShadow: false,
      receiveShadow: true
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(itemWidth * 0.88, itemDepth * 0.84), new THREE.MeshStandardMaterial({
      color: accentColor,
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
    group.add(mesh);
  }
}

function buildDesktopItemMeshGroup(group, itemWidth, itemDepth, itemHeight, darkColor, accentColor) {
  const screenWidth = itemWidth * 0.72;
  const screenHeight = itemHeight * 0.58;
  addBoxMesh(group, screenWidth, screenHeight, 0.035, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.25, darkColor, {
    rounded: false,
    roughness: 0.24
  });
  addBoxMesh(group, screenWidth * 0.9, screenHeight * 0.84, 0.01, -itemWidth * 0.06, itemHeight * 0.66, -itemDepth * 0.19, 659481, {
    rounded: false,
    roughness: 0.18,
    emissive: 1517112,
    emissiveIntensity: 0.35
  });
  addBoxMesh(group, 0.035, itemHeight * 0.24, 0.035, -itemWidth * 0.06, itemHeight * 0.25, -itemDepth * 0.25, darkColor, {
    metalness: 0.5
  });
  addBoxMesh(group, itemWidth * 0.28, 0.025, itemDepth * 0.3, -itemWidth * 0.06, 0.02, -itemDepth * 0.22, darkColor, {
    metalness: 0.42
  });
  addBoxMesh(group, itemWidth * 0.58, 0.022, itemDepth * 0.38, -itemWidth * 0.08, 0.025, itemDepth * 0.24, accentColor, {
    rounded: false,
    roughness: 0.5
  });
  addBoxMesh(group, itemWidth * 0.1, 0.035, itemDepth * 0.22, itemWidth * 0.36, 0.028, itemDepth * 0.24, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.035,
    roughness: 0.46
  });
}

function buildRobotVacuumItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  addBoxMesh(group, itemWidth * 0.82, 0.035, itemDepth * 0.92, 0, 0.018, 0, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.05,
    roughness: 0.58
  });
  addBoxMesh(group, itemWidth * 0.68, itemHeight * 0.82, itemDepth * 0.48, 0, itemHeight * 0.47, -itemDepth * 0.23, bodyColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.12,
    roughness: 0.48
  });
  addBoxMesh(group, itemWidth * 0.44, itemHeight * 0.16, 0.03, 0, itemHeight * 0.2, itemDepth * 0.02, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.04,
    roughness: 0.42
  });
  addBoxMesh(group, itemWidth * 0.34, itemHeight * 0.07, 0.035, 0, itemHeight * 0.14, itemDepth * 0.04, darkColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.025,
    roughness: 0.28
  });
  addSoftBoxMesh(group, itemWidth * 0.31, itemWidth * 0.32, itemHeight * 0.12, 0, itemHeight * 0.07, itemDepth * 0.2, bodyColor, {
    segments: 32,
    roughness: 0.42
  });
  addSoftBoxMesh(group, itemWidth * 0.085, itemWidth * 0.09, itemHeight * 0.055, -itemWidth * 0.08, itemHeight * 0.16, itemDepth * 0.15, accentColor, {
    segments: 24,
    roughness: 0.34
  });
  addBoxMesh(group, itemWidth * 0.36, itemHeight * 0.045, 0.025, 0, itemHeight * 0.08, itemDepth * 0.52, darkColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.025,
    roughness: 0.24
  });
}

function buildGlassPartitionItemMeshGroup(group, itemWidth, itemDepth, itemHeight, accentColor, glass) {
  const frameThickness = Math.min(Math.max(itemWidth * 0.018, 0.018), 0.035);
  const panelDepth = Math.max(itemDepth, 0.045);
  const panelWidth = Math.max(itemWidth - frameThickness * 2.4, frameThickness);
  const panelHeight = Math.max(itemHeight - frameThickness * 2.4, frameThickness);
  const frameMaterial = {
    rounded: false,
    metalness: 0.58,
    roughness: 0.24,
    castShadow: false,
    receiveShadow: false
  };
  addBoxMesh(group, panelWidth, panelHeight, Math.max(itemDepth * 0.24, 0.012), 0, itemHeight * 0.5, 0, glass.glass, {
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
  addBoxMesh(group, itemWidth, frameThickness, panelDepth, 0, frameThickness * 0.5, 0, glass.frame, frameMaterial);
  addBoxMesh(group, itemWidth, frameThickness, panelDepth, 0, itemHeight - frameThickness * 0.5, 0, glass.frame, frameMaterial);
  addBoxMesh(group, frameThickness, itemHeight, panelDepth, -itemWidth * 0.5 + frameThickness * 0.5, itemHeight * 0.5, 0, glass.frame, frameMaterial);
  addBoxMesh(group, frameThickness, itemHeight, panelDepth, itemWidth * 0.5 - frameThickness * 0.5, itemHeight * 0.5, 0, glass.frame, frameMaterial);
  for (const handleOffsetX of [-itemWidth * 0.34, itemWidth * 0.34]) {
    addBoxMesh(group, frameThickness * 1.7, frameThickness * 2.2, panelDepth * 1.18, handleOffsetX, frameThickness * 1.3, 0, accentColor, frameMaterial);
  }
}

function buildNasItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, bodyColor, {
    rounded: false,
    metalness: 0.16,
    roughness: 0.46
  });
  addBoxMesh(group, itemWidth * 0.9, itemHeight * 0.88, 0.025, 0, itemHeight * 0.5, itemDepth * 0.515, darkColor, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.32
  });
  for (const bayOffsetX of [-itemWidth * 0.23, itemWidth * 0.23]) {
    for (const bayOffsetY of [itemHeight * 0.3, itemHeight * 0.7]) {
      addBoxMesh(group, itemWidth * 0.38, itemHeight * 0.34, 0.018, bayOffsetY, bayOffsetY, itemDepth * 0.535, accentColor, {
        rounded: false,
        roughness: 0.38
      });
      addBoxMesh(group, itemWidth * 0.18, 0.018, 0.012, bayOffsetY, bayOffsetY + itemHeight * 0.1, itemDepth * 0.55, darkColor, {
        rounded: false,
        metalness: 0.25,
        roughness: 0.3
      });
    }
  }
  for (const ledY of [0.18, 0.26, 0.34]) {
    addBoxMesh(group, 0.012, 0.012, 0.012, itemWidth * 0.42, itemHeight * ledY, itemDepth * 0.55, 9550021, {
      rounded: false,
      emissive: 9550021,
      emissiveIntensity: 0.28,
      roughness: 0.2
    });
  }
}

function buildVanityItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, lightColor, glass) {
  const counterHeight = Math.min(0.76, itemHeight * 0.5);
  addBoxMesh(group, itemWidth, 0.075, itemDepth, 0, counterHeight, 0, bodyColor);
  addBoxMesh(group, itemWidth * 0.27, counterHeight * 0.82, itemDepth * 0.88, -itemWidth * 0.34, counterHeight * 0.42, 0, bodyColor);
  addBoxMesh(group, itemWidth * 0.27, counterHeight * 0.82, itemDepth * 0.88, itemWidth * 0.34, counterHeight * 0.42, 0, bodyColor);
  for (const drawerSideX of [-0.34, 0.34]) {
    for (const drawerY of [0.23, 0.48]) {
      addBoxMesh(group, itemWidth * 0.22, 0.012, itemDepth * 0.02, itemWidth * drawerSideX, drawerY * drawerY, itemDepth * 0.46, darkColor, {
        rounded: false
      });
    }
  }
  const max = Math.max(itemHeight - counterHeight - 0.08, 0.45);
  addBoxMesh(group, itemWidth * 0.54, max, 0.025, 0, counterHeight + max * 0.5, -itemDepth * 0.43, glass.glass, {
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    metalness: 0.22,
    roughness: 0.16
  });
  addBoxMesh(group, itemWidth * 0.59, 0.045, 0.05, 0, counterHeight + max, -itemDepth * 0.43, lightColor, {
    metalness: 0.12
  });
  addBoxMesh(group, itemWidth * 0.59, 0.045, 0.05, 0, counterHeight, -itemDepth * 0.43, lightColor, {
    metalness: 0.12
  });
  addBoxMesh(group, 0.045, max, 0.05, -itemWidth * 0.295, counterHeight + max * 0.5, -itemDepth * 0.43, lightColor, {
    metalness: 0.12
  });
  addBoxMesh(group, 0.045, max, 0.05, itemWidth * 0.295, counterHeight + max * 0.5, -itemDepth * 0.43, lightColor, {
    metalness: 0.12
  });
}

function buildDishwasherItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, bodyColor, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.48
  });
  addBoxMesh(group, itemWidth * 0.93, itemHeight * 0.74, 0.028, 0, itemHeight * 0.46, itemDepth * 0.515, accentColor, {
    rounded: false,
    metalness: 0.08,
    roughness: 0.44
  });
  addBoxMesh(group, itemWidth * 0.93, itemHeight * 0.14, 0.032, 0, itemHeight * 0.87, itemDepth * 0.52, darkColor, {
    rounded: false,
    metalness: 0.18,
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth * 0.58, itemHeight * 0.026, 0.034, 0, itemHeight * 0.78, itemDepth * 0.54, darkColor, {
    rounded: false,
    metalness: 0.5,
    roughness: 0.22
  });
  addBoxMesh(group, itemWidth * 0.9, itemHeight * 0.075, itemDepth * 0.78, 0, itemHeight * 0.038, -itemDepth * 0.04, darkColor, {
    rounded: false,
    roughness: 0.4
  });
  for (const handleOffset of [0.22, 0.31, 0.4]) {
    addSoftBoxMesh(group, itemWidth * 0.018, itemWidth * 0.018, 0.012, itemWidth * handleOffset, itemHeight * 0.88, itemDepth * 0.545, accentColor, {
      segments: 18,
      rotationX: Math.PI / 2,
      metalness: 0.26,
      roughness: 0.24
    });
  }
}

function buildMicrowaveItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, bodyColor, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.44
  });
  addBoxMesh(group, itemWidth * 0.93, itemHeight * 0.82, 0.025, 0, itemHeight * 0.49, itemDepth * 0.515, darkColor, {
    rounded: false,
    metalness: 0.16,
    roughness: 0.24
  });
  addBoxMesh(group, itemWidth * 0.62, itemHeight * 0.63, 0.018, -itemWidth * 0.13, itemHeight * 0.48, itemDepth * 0.54, 1515819, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.18
  });
  addBoxMesh(group, itemWidth * 0.035, itemHeight * 0.54, 0.03, itemWidth * 0.19, itemHeight * 0.48, itemDepth * 0.55, accentColor, {
    rounded: false,
    metalness: 0.46,
    roughness: 0.22
  });
  addBoxMesh(group, itemWidth * 0.17, itemHeight * 0.1, 0.02, itemWidth * 0.36, itemHeight * 0.72, itemDepth * 0.54, 7706534, {
    rounded: false,
    emissive: 7706534,
    emissiveIntensity: 0.16,
    roughness: 0.2
  });
  for (const buttonY of [0.48, 0.34, 0.2]) {
    addBoxMesh(group, itemWidth * 0.13, itemHeight * 0.055, 0.018, itemWidth * 0.36, itemHeight * buttonY, itemDepth * 0.545, accentColor, {
      rounded: false,
      roughness: 0.3
    });
  }
}

function buildPlantItemMeshGroup(group, itemWidth, itemDepth, itemHeight, accentColor, darkColor) {
  addSoftBoxMesh(group, itemWidth * 0.25, itemWidth * 0.21, itemHeight * 0.22, 0, itemHeight * 0.11, 0, accentColor, {
    segments: 24,
    roughness: 0.82
  });
  addSoftBoxMesh(group, itemWidth * 0.22, itemWidth * 0.22, 0.035, 0, itemHeight * 0.22, 0, darkColor, {
    segments: 24,
    roughness: 0.96
  });
  const arrayValue = [[new THREE.Vector3(0, itemHeight * 0.21, 0), new THREE.Vector3(-itemWidth * 0.06, itemHeight * 0.58, 0), new THREE.Vector3(-itemWidth * 0.27, itemHeight * 0.78, 0)], [new THREE.Vector3(itemWidth * 0.03, itemHeight * 0.21, 0), new THREE.Vector3(itemWidth * 0.06, itemHeight * 0.64, 0), new THREE.Vector3(itemWidth * 0.12, itemHeight * 0.94, 0)], [new THREE.Vector3(0, itemHeight * 0.28, 0), new THREE.Vector3(itemWidth * 0.18, itemHeight * 0.62, 0), new THREE.Vector3(itemWidth * 0.31, itemHeight * 0.79, 0)]];
  for (const leafPoints of arrayValue) {
    const castShadow = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(leafPoints), 20, 0.014, 7, false), new THREE.MeshStandardMaterial({
      color: darkColor,
      roughness: 0.86
    }));
    castShadow.castShadow = true;
    group.add(castShadow);
  }
  const list = [[-0.27, 0.78, 0], [-0.1, 0.61, 0.02], [0.12, 0.94, 0], [0.31, 0.79, 0], [0.18, 0.63, -0.02], [0.02, 0.46, 0.03]];
  for (const [leafX, leafY, leafZ] of list) {
    for (let bladeIndex = 0; bladeIndex < 5; bladeIndex += 1) {
      const value = bladeIndex / 5 * Math.PI * 2;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 6), new THREE.MeshStandardMaterial({
        color: bladeIndex % 2 ? 7835779 : 6257261,
        roughness: 0.9
      }));
      mesh.scale.set(itemWidth * 0.045, itemHeight * 0.085, itemDepth * 0.025);
      mesh.position.set(itemWidth * leafX + Math.cos(value) * itemWidth * 0.08, itemHeight * leafY + Math.sin(value) * itemHeight * 0.035, itemDepth * leafZ + Math.sin(value) * itemDepth * 0.06);
      mesh.rotation.z = value - Math.PI / 2;
      mesh.rotation.y = value * 0.6;
      mesh.castShadow = true;
      group.add(mesh);
    }
  }
}

function buildRiceCookerItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  const bodyRadius = Math.min(itemWidth, itemDepth) * 0.47;
  addSoftBoxMesh(group, bodyRadius * 0.9, bodyRadius, itemHeight * 0.68, 0, itemHeight * 0.38, 0, bodyColor, {
    segments: 36,
    roughness: 0.46
  });
  addSoftBoxMesh(group, bodyRadius * 0.94, bodyRadius * 0.94, itemHeight * 0.12, 0, itemHeight * 0.77, 0, accentColor, {
    segments: 36,
    roughness: 0.38
  });
  addSoftBoxMesh(group, bodyRadius * 0.72, bodyRadius * 0.74, itemHeight * 0.035, 0, itemHeight * 0.85, 0, darkColor, {
    segments: 32,
    metalness: 0.12,
    roughness: 0.28
  });
  addBoxMesh(group, itemWidth * 0.5, itemHeight * 0.16, 0.026, 0, itemHeight * 0.42, itemDepth * 0.47, darkColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.04,
    roughness: 0.28
  });
  addBoxMesh(group, itemWidth * 0.24, itemHeight * 0.06, 0.018, 0, itemHeight * 0.43, itemDepth * 0.49, 7706534, {
    rounded: false,
    emissive: 7706534,
    emissiveIntensity: 0.16,
    roughness: 0.2
  });
  addBoxMesh(group, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, -itemWidth * 0.27, itemHeight * 0.86, 0, darkColor, {
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth * 0.05, itemHeight * 0.16, itemDepth * 0.1, itemWidth * 0.27, itemHeight * 0.86, 0, darkColor, {
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth * 0.58, itemHeight * 0.055, itemDepth * 0.1, 0, itemHeight * 0.94, 0, darkColor, {
    roughness: 0.3
  });
}

function buildSteamOvenItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  addBoxMesh(group, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, bodyColor, {
    rounded: false,
    metalness: 0.16,
    roughness: 0.42
  });
  addBoxMesh(group, itemWidth * 0.94, itemHeight * 0.9, 0.026, 0, itemHeight * 0.5, itemDepth * 0.515, darkColor, {
    rounded: false,
    metalness: 0.18,
    roughness: 0.25
  });
  addBoxMesh(group, itemWidth * 0.78, itemHeight * 0.56, 0.018, -itemWidth * 0.03, itemHeight * 0.42, itemDepth * 0.54, 1515819, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.18
  });
  addBoxMesh(group, itemWidth * 0.72, itemHeight * 0.035, 0.038, -itemWidth * 0.03, itemHeight * 0.74, itemDepth * 0.56, accentColor, {
    rounded: false,
    metalness: 0.52,
    roughness: 0.22
  });
  addBoxMesh(group, itemWidth * 0.24, itemHeight * 0.075, 0.022, 0, itemHeight * 0.86, itemDepth * 0.545, 7706534, {
    rounded: false,
    emissive: 7706534,
    emissiveIntensity: 0.18,
    roughness: 0.2
  });
  for (const knobOffset of [-0.36, 0.36]) {
    addSoftBoxMesh(group, itemWidth * 0.045, itemWidth * 0.045, 0.026, itemWidth * knobOffset, itemHeight * 0.86, itemDepth * 0.55, accentColor, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.4,
      roughness: 0.24
    });
  }
}

function buildFloorLampItemMeshGroup(group, itemWidth, itemDepth, itemHeight, darkColor, accentColor) {
  const lampOffsetX = -itemWidth * 0.34;
  const value = itemWidth * 0.31;
  const baseRadius = Math.min(itemWidth * 0.13, itemDepth * 0.34);
  const min = Math.min(itemWidth * 0.18, itemDepth * 0.46);
  const shadeBaseY = itemHeight * 0.115;
  const shadeTopY = itemHeight * 0.76;
  const shadeTipY = shadeTopY + shadeBaseY;
  addSoftBoxMesh(group, baseRadius * 0.82, baseRadius, 0.045, lampOffsetX, 0.0225, 0, darkColor, {
    segments: 32,
    metalness: 0.38,
    roughness: 0.3
  });
  const constructedCubicBezierCurve = new THREE.CubicBezierCurve3(new THREE.Vector3(lampOffsetX, 0.045, 0), new THREE.Vector3(lampOffsetX, itemHeight * 0.72, 0), new THREE.Vector3(itemWidth * 0.02, itemHeight * 1.01, 0), new THREE.Vector3(value, shadeTipY, 0));
  const castShadow = new THREE.Mesh(new THREE.TubeGeometry(constructedCubicBezierCurve, 48, Math.max(0.012, itemWidth * 0.012), 8, false), new THREE.MeshStandardMaterial({
    color: darkColor,
    roughness: 0.3,
    metalness: 0.48
  }));
  castShadow.castShadow = true;
  group.add(castShadow);
  const scale = new THREE.Mesh(new THREE.SphereGeometry(min, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.62,
    metalness: 0.04
  }));
  scale.scale.set(1, shadeBaseY / min, 1);
  scale.position.set(value, shadeTopY, 0);
  scale.castShadow = true;
  group.add(scale);
  addSoftBoxMesh(group, min * 0.94, min * 0.98, 0.025, value, shadeTopY, 0, darkColor, {
    segments: 32,
    metalness: 0.12,
    roughness: 0.5
  });
  addSoftBoxMesh(group, Math.max(0.018, itemWidth * 0.014), Math.max(0.022, itemWidth * 0.018), 0.045, value, shadeTipY + 0.012, 0, darkColor, {
    segments: 20,
    metalness: 0.42,
    roughness: 0.28
  });
}

function buildWallLampItemMeshGroup(group, itemWidth, itemDepth, itemHeight, lightColor, glass) {
  const shadeZ = -itemDepth * 0.5 + 0.018;
  const metalFinish = {
    rounded: false,
    metalness: 0.64,
    roughness: 0.22
  };
  addBoxMesh(group, itemWidth * 0.68, itemHeight * 0.5, 0.035, 0, itemHeight * 0.52, shadeZ, glass.furniture, {
    radius: 0.02,
    metalness: 0.18,
    roughness: 0.46
  });
  addSoftBoxMesh(group, itemWidth * 0.11, itemWidth * 0.11, 0.035, 0, itemHeight * 0.57, shadeZ - 0.012, glass.furnitureSoft, {
    segments: 24,
    rotationX: Math.PI / 2,
    metalness: 0.3,
    roughness: 0.34
  });
  addBoxMesh(group, 0.04, itemHeight * 0.2, itemDepth * 0.28, 0, itemHeight * 0.57, -itemDepth * 0.3, glass.furniture, {
    ...metalFinish,
    metalness: 0.18,
    roughness: 0.46
  });
  const shadeMesh = new THREE.Mesh(new THREE.CylinderGeometry(itemWidth * 0.3, itemWidth * 0.19, itemHeight * 0.38, 24, 1, true), new THREE.MeshStandardMaterial({
    color: lightColor,
    roughness: 0.3,
    metalness: 0.04,
    emissive: 16767386,
    emissiveIntensity: 0.24,
    side: THREE.DoubleSide
  }));
  shadeMesh.position.set(0, itemHeight * 0.4, -itemDepth * 0.16);
  shadeMesh.castShadow = true;
  shadeMesh.receiveShadow = true;
  group.add(shadeMesh);
  addSoftBoxMesh(group, itemWidth * 0.15, itemWidth * 0.15, 0.025, 0, itemHeight * 0.19, -itemDepth * 0.16, 16769707, {
    segments: 24,
    emissive: 16760156,
    emissiveIntensity: 0.38,
    roughness: 0.24
  });
}

function buildGasWaterHeaterItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  const tankHeight = itemHeight * 0.82;
  addBoxMesh(group, itemWidth, tankHeight, itemDepth, 0, itemHeight * 0.47, 0, bodyColor, {
    rounded: false,
    metalness: 0.12,
    roughness: 0.46
  });
  addBoxMesh(group, itemWidth * 0.86, tankHeight * 0.42, 0.026, 0, itemHeight * 0.55, itemDepth * 0.515, accentColor, {
    rounded: false,
    roughness: 0.36
  });
  addBoxMesh(group, itemWidth * 0.44, tankHeight * 0.18, 0.018, 0, itemHeight * 0.67, itemDepth * 0.54, darkColor, {
    rounded: false,
    metalness: 0.14,
    roughness: 0.22
  });
  for (let ventSlotIndex = 0; ventSlotIndex < 5; ventSlotIndex += 1) {
    addBoxMesh(group, itemWidth * 0.62, 0.012, 0.02, 0, itemHeight * (0.24 + ventSlotIndex * 0.07), itemDepth * 0.525, darkColor, {
      rounded: false,
      roughness: 0.3
    });
  }
  addSoftBoxMesh(group, itemDepth * 0.17, itemDepth * 0.17, itemHeight * 0.18, 0, itemHeight * 0.91, 0, darkColor, {
    segments: 24,
    metalness: 0.58,
    roughness: 0.24
  });
  addSoftBoxMesh(group, itemDepth * 0.22, itemDepth * 0.22, 0.035, 0, itemHeight * 0.84, 0, accentColor, {
    segments: 24,
    metalness: 0.5,
    roughness: 0.25
  });
  for (const [footX, footColor] of [[-itemWidth * 0.28, 4885698], [0, 9410205], [itemWidth * 0.28, 12868184]]) {
    addSoftBoxMesh(group, 0.018, 0.018, itemHeight * 0.18, footX, itemHeight * 0.09, itemDepth * 0.12, footColor, {
      segments: 18,
      metalness: 0.62,
      roughness: 0.22
    });
    addSoftBoxMesh(group, 0.034, 0.034, 0.025, footX, 0.014, itemDepth * 0.12, darkColor, {
      segments: 18,
      metalness: 0.5,
      roughness: 0.25
    });
  }
}

function buildBasinItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, lightColor, accentColor, darkColor, glass) {
  addBoxMesh(group, itemWidth * 0.92, itemHeight * 0.72, itemDepth * 0.9, 0, itemHeight * 0.36, 0, bodyColor);
  addBoxMesh(group, itemWidth, 0.065, itemDepth, 0, itemHeight * 0.75, 0, lightColor, {
    roughness: 0.3
  });
  addSoftBoxMesh(group, itemWidth * 0.25, itemWidth * 0.21, 0.08, 0, itemHeight * 0.8, itemDepth * 0.02, accentColor, {
    roughness: 0.28
  });
  addSoftBoxMesh(group, 0.018, 0.018, itemHeight * 0.2, 0, itemHeight * 0.9, -itemDepth * 0.2, darkColor, {
    metalness: 0.78,
    roughness: 0.18
  });
  addSoftBoxMesh(group, 0.018, 0.018, itemDepth * 0.2, 0, itemHeight * 0.99, -itemDepth * 0.11, darkColor, {
    rotationX: Math.PI / 2,
    metalness: 0.78,
    roughness: 0.18
  });
  addBoxMesh(group, 0.012, itemHeight * 0.62, itemDepth * 0.02, 0, itemHeight * 0.34, itemDepth * 0.46, darkColor, {
    rounded: false
  });
  const mirrorY = itemHeight * 1.05;
  const value = itemWidth * 0.72;
  const numericValue = 0.72;
  const mirrorZ = -itemDepth * 0.46;
  addBoxMesh(group, value, numericValue, 0.018, 0, mirrorY + numericValue * 0.5, mirrorZ, glass.glass, {
    rounded: false,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
    metalness: 0.26,
    roughness: 0.12,
    castShadow: false
  });
  addBoxMesh(group, value + 0.055, 0.035, 0.045, 0, mirrorY, mirrorZ, darkColor, {
    metalness: 0.35
  });
  addBoxMesh(group, value + 0.055, 0.035, 0.045, 0, mirrorY + numericValue, mirrorZ, darkColor, {
    metalness: 0.35
  });
  addBoxMesh(group, 0.035, numericValue, 0.045, -value * 0.5, mirrorY + numericValue * 0.5, mirrorZ, darkColor, {
    metalness: 0.35
  });
  addBoxMesh(group, 0.035, numericValue, 0.045, value * 0.5, mirrorY + numericValue * 0.5, mirrorZ, darkColor, {
    metalness: 0.35
  });
}

function buildStorageWaterHeaterItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  const tankRadius = Math.min(itemDepth * 0.43, itemHeight * 0.44);
  const tankY = itemHeight * 0.52;
  addBoxMesh(group, itemWidth * 0.78, itemHeight * 0.12, itemDepth * 0.22, 0, itemHeight * 0.1, -itemDepth * 0.36, darkColor, {
    rounded: false,
    metalness: 0.55,
    roughness: 0.3
  });
  addSoftBoxMesh(group, tankRadius, tankRadius, itemWidth * 0.82, 0, tankY, 0, bodyColor, {
    segments: 36,
    rotationZ: Math.PI / 2,
    metalness: 0.2,
    roughness: 0.42
  });
  for (const capX of [-itemWidth * 0.43, itemWidth * 0.43]) {
    addSoftBoxMesh(group, tankRadius * 1.03, tankRadius * 1.03, 0.025, capX, tankY, 0, accentColor, {
      segments: 36,
      rotationZ: Math.PI / 2,
      metalness: 0.28,
      roughness: 0.34
    });
  }
  addBoxMesh(group, itemWidth * 0.31, itemHeight * 0.23, 0.026, 0, itemHeight * 0.51, itemDepth * 0.44, darkColor, {
    rounded: false,
    metalness: 0.18,
    roughness: 0.25
  });
  addBoxMesh(group, itemWidth * 0.16, itemHeight * 0.045, 0.018, 0, itemHeight * 0.58, itemDepth * 0.46, 7706534, {
    rounded: false,
    emissive: 7706534,
    emissiveIntensity: 0.18,
    roughness: 0.2
  });
  for (const footX of [-itemWidth * 0.28, itemWidth * 0.28]) {
    addSoftBoxMesh(group, 0.022, 0.022, itemHeight * 0.16, footX, itemHeight * 0.08, itemDepth * 0.12, footX < 0 ? 4885698 : 12868184, {
      segments: 18,
      metalness: 0.55,
      roughness: 0.24
    });
    addSoftBoxMesh(group, 0.04, 0.04, 0.028, footX, 0.015, itemDepth * 0.12, darkColor, {
      segments: 20,
      metalness: 0.45,
      roughness: 0.28
    });
  }
}

function buildToiletItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, accentColor, darkColor) {
  const castShadow = new THREE.Mesh(createWallTopMaterial(itemWidth, itemDepth, itemHeight), new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.4,
    metalness: 0.02
  }));
  castShadow.castShadow = true;
  castShadow.receiveShadow = true;
  group.add(castShadow);
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
    color: accentColor,
    roughness: 0.34,
    metalness: 0.01
  }));
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(0, itemHeight * 0.82, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  addBoxMesh(group, itemWidth * 0.9, itemHeight * 0.095, itemDepth * 0.2, 0, itemHeight * 0.775, -itemDepth * 0.34, bodyColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.035,
    roughness: 0.36
  });
  addBoxMesh(group, 0.016, itemHeight * 0.38, 0.024, -itemWidth * 0.42, itemHeight * 0.38, -itemDepth * 0.18, darkColor, {
    rounded: false,
    roughness: 0.46
  });
  addSoftBoxMesh(group, itemWidth * 0.035, itemWidth * 0.035, 0.018, -itemWidth * 0.46, itemHeight * 0.66, itemDepth * 0.12, accentColor, {
    segments: 24,
    rotationZ: Math.PI / 2,
    metalness: 0.08,
    roughness: 0.3
  });
}

function buildPipelineWaterPurifierItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  const bodyHeight = itemHeight * 0.9;
  addBoxMesh(group, itemWidth, bodyHeight, itemDepth, 0, bodyHeight * 0.5, 0, bodyColor, {
    rounded: false,
    metalness: 0.04,
    roughness: 0.4
  });
  addBoxMesh(group, itemWidth * 0.92, bodyHeight * 0.27, 0.028, 0, itemHeight * 0.76, itemDepth * 0.515, darkColor, {
    rounded: false,
    metalness: 0.16,
    roughness: 0.18
  });
  addBoxMesh(group, itemWidth * 0.34, bodyHeight * 0.045, 0.014, -itemWidth * 0.08, itemHeight * 0.79, itemDepth * 0.54, 10470608, {
    rounded: false,
    emissive: 10470608,
    emissiveIntensity: 0.2,
    roughness: 0.22
  });
  for (const filterOffsetX of [-0.26, 0, 0.26]) {
    addSoftBoxMesh(group, Math.min(itemWidth, itemDepth) * 0.055, Math.min(itemWidth, itemDepth) * 0.055, 0.018, itemWidth * filterOffsetX, itemHeight * 0.66, itemDepth * 0.535, accentColor, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.22,
      roughness: 0.28
    });
  }
  for (const pipeOffsetX of [-itemWidth * 0.2, itemWidth * 0.2]) {
    addSoftBoxMesh(group, 0.014, 0.014, itemHeight * 0.12, pipeOffsetX, itemHeight * 0.49, itemDepth * 0.48, darkColor, {
      segments: 18,
      metalness: 0.46,
      roughness: 0.22
    });
    addSoftBoxMesh(group, 0.024, 0.018, 0.035, pipeOffsetX, itemHeight * 0.425, itemDepth * 0.52, darkColor, {
      segments: 18,
      rotationX: Math.PI / 2,
      metalness: 0.46,
      roughness: 0.22
    });
  }
  addBoxMesh(group, itemWidth * 0.68, itemHeight * 0.045, itemDepth * 0.52, 0, itemHeight * 0.11, itemDepth * 0.16, darkColor, {
    rounded: false,
    metalness: 0.2,
    roughness: 0.3
  });
  addBoxMesh(group, itemWidth * 0.42, 0.028, itemDepth * 0.28, 0, itemHeight * 0.16, itemDepth * 0.28, accentColor, {
    rounded: false,
    roughness: 0.34
  });
}

function buildShowerItemMeshGroup(group, itemWidth, itemDepth, itemHeight, lightColor) {
  const fixtureColor = lightColor;
  const columnDepth = -itemDepth * 0.42;
  const headLift = itemHeight * 0.13;
  const columnTopY = itemHeight * 0.9;
  const columnLength = columnTopY - headLift;
  const metalMaterial = {
    rounded: false,
    metalness: 0.68,
    roughness: 0.22
  };
  addBoxMesh(group, 0.045, columnLength, 0.045, 0, (headLift + columnTopY) * 0.5, columnDepth, fixtureColor, metalMaterial);
  for (const headY of [headLift, itemHeight * 0.47, itemHeight * 0.78, columnTopY]) {
    addBoxMesh(group, 0.085, 0.085, 0.065, 0, headY, columnDepth, fixtureColor, metalMaterial);
  }
  for (const nozzleY of [headLift, columnTopY]) {
    addSoftBoxMesh(group, itemWidth * 0.055, itemWidth * 0.055, 0.04, 0, nozzleY, -itemDepth * 0.47, fixtureColor, {
      segments: 28,
      rotationX: Math.PI / 2,
      metalness: 0.7,
      roughness: 0.2
    });
  }
  const armY = itemHeight * 0.12;
  addBoxMesh(group, itemWidth * 0.36, 0.065, 0.065, 0, armY, columnDepth + itemDepth * 0.08, fixtureColor, metalMaterial);
  for (const handleX of [-itemWidth * 0.2, itemWidth * 0.2]) {
    addSoftBoxMesh(group, itemWidth * 0.055, itemWidth * 0.055, 0.045, handleX, armY, -itemDepth * 0.45, fixtureColor, {
      segments: 28,
      rotationX: Math.PI / 2,
      metalness: 0.7,
      roughness: 0.2
    });
    addBoxMesh(group, 0.05, 0.05, itemDepth * 0.13, handleX, armY, columnDepth + itemDepth * 0.01, fixtureColor, metalMaterial);
  }
  addBoxMesh(group, 0.045, itemHeight * 0.12, 0.045, 0, armY - itemHeight * 0.045, columnDepth + itemDepth * 0.13, fixtureColor, metalMaterial);
  const columnBase = new THREE.Vector3(0, columnTopY, columnDepth);
  const columnTop = new THREE.Vector3(0, itemHeight * 0.76, itemDepth * 0.08);
  const riserRise = columnTop.y - columnBase.y;
  const riserRun = columnTop.z - columnBase.z;
  const riserLength = Math.hypot(riserRise, riserRun);
  const mesh = addBoxMesh(group, 0.055, riserLength, 0.055, 0, (columnBase.y + columnTop.y) * 0.5, (columnBase.z + columnTop.z) * 0.5, fixtureColor, metalMaterial);
  mesh.rotation.x = Math.atan2(riserRun, riserRise);
  addBoxMesh(group, 0.055, itemHeight * 0.13, 0.055, 0, itemHeight * 0.705, columnTop.z, fixtureColor, metalMaterial);
  addBoxMesh(group, itemWidth * 0.34, 0.035, itemDepth * 0.3, 0, itemHeight * 0.64, columnTop.z + itemDepth * 0.03, fixtureColor, {
    rounded: false,
    metalness: 0.64,
    roughness: 0.24
  });
}

function buildBathtubItemMeshGroup(group, itemWidth, itemDepth, itemHeight, accentColor, lightColor, darkColor, glass) {
  const tubTopY = itemHeight * 0.84;
  const cornerRadius = Math.min(itemWidth, itemDepth) * 0.11;
  const rimY = tubTopY * 0.8;
  const innerWidth = Math.max(itemWidth - cornerRadius * 2, itemWidth * 0.48);
  const innerDepth = Math.max(itemDepth - cornerRadius * 2, itemDepth * 0.42);
  addBoxMesh(group, innerWidth, tubTopY * 0.16, innerDepth, 0, tubTopY * 0.14, 0, accentColor, {
    radius: Math.min(itemWidth, itemDepth) * 0.16,
    roughness: 0.33
  });
  addBoxMesh(group, itemWidth, rimY, cornerRadius, 0, rimY * 0.5, -itemDepth * 0.5 + cornerRadius * 0.5, lightColor, {
    radius: cornerRadius * 0.5,
    roughness: 0.34
  });
  addBoxMesh(group, itemWidth, rimY, cornerRadius, 0, rimY * 0.5, itemDepth * 0.5 - cornerRadius * 0.5, lightColor, {
    radius: cornerRadius * 0.5,
    roughness: 0.34
  });
  addBoxMesh(group, cornerRadius, rimY, innerDepth, -itemWidth * 0.5 + cornerRadius * 0.5, rimY * 0.5, 0, lightColor, {
    radius: cornerRadius * 0.5,
    roughness: 0.34
  });
  addBoxMesh(group, cornerRadius, rimY, innerDepth, itemWidth * 0.5 - cornerRadius * 0.5, rimY * 0.5, 0, lightColor, {
    radius: cornerRadius * 0.5,
    roughness: 0.34
  });
  const rimBandHeight = tubTopY * 0.075;
  const rimBandY = rimY + rimBandHeight * 0.5;
  addBoxMesh(group, itemWidth, rimBandHeight, cornerRadius, 0, rimBandY, -itemDepth * 0.5 + cornerRadius * 0.5, lightColor, {
    radius: cornerRadius * 0.45,
    roughness: 0.29
  });
  addBoxMesh(group, itemWidth, rimBandHeight, cornerRadius, 0, rimBandY, itemDepth * 0.5 - cornerRadius * 0.5, lightColor, {
    radius: cornerRadius * 0.45,
    roughness: 0.29
  });
  addBoxMesh(group, cornerRadius, rimBandHeight, innerDepth, -itemWidth * 0.5 + cornerRadius * 0.5, rimBandY, 0, lightColor, {
    radius: cornerRadius * 0.45,
    roughness: 0.29
  });
  addBoxMesh(group, cornerRadius, rimBandHeight, innerDepth, itemWidth * 0.5 - cornerRadius * 0.5, rimBandY, 0, lightColor, {
    radius: cornerRadius * 0.45,
    roughness: 0.29
  });
  for (const jetX of [-itemWidth * 0.38, itemWidth * 0.38]) {
    for (const jetZ of [-itemDepth * 0.3, itemDepth * 0.3]) {
      addSoftBoxMesh(group, 0.026, 0.026, itemHeight * 0.16, jetX, itemHeight * 0.08, jetZ, glass.furnitureDark, {
        segments: 12,
        metalness: 0.42,
        roughness: 0.3
      });
    }
  }
  addSoftBoxMesh(group, 0.016, 0.016, itemHeight * 0.25, itemWidth * 0.34, itemHeight * 0.96, -itemDepth * 0.22, darkColor, {
    segments: 16,
    metalness: 0.72,
    roughness: 0.2
  });
  addSoftBoxMesh(group, 0.016, 0.016, itemDepth * 0.28, itemWidth * 0.34, itemHeight * 1.08, -itemDepth * 0.08, darkColor, {
    segments: 16,
    rotationX: Math.PI / 2,
    metalness: 0.72,
    roughness: 0.2
  });
}

function buildTvItemMeshGroup(group, item, itemWidth, itemDepth, itemHeight, darkColor, accentColor) {
  const {
    bodyHeight: bodyHeight,
    centerY: mountCenterY
  } = tvMountLayoutMetrics(item, itemHeight);
  const screenBottom = mountCenterY - bodyHeight * 0.5;
  if (item.tvMountStyle === "mobile") {
    const mountThickness = Math.max(itemHeight * 0.045, 0.055);
    const backingWidth = itemWidth * 0.7;
    const backingDepth = Math.max(itemDepth * 0.78, 0.3);
    const mountDrop = Math.max(screenBottom - mountThickness * 0.7, itemHeight * 0.22);
    const mountBracketY = mountThickness * 0.7 + mountDrop * 0.5;
    addBoxMesh(group, backingWidth, mountThickness, backingDepth, 0, mountThickness * 0.72, 0, darkColor, {
      radius: Math.min(mountThickness, backingDepth) * 0.22,
      metalness: 0.18,
      roughness: 0.32
    });
    addBoxMesh(group, itemWidth * 0.075, mountDrop, Math.max(itemDepth * 0.2, 0.06), -itemWidth * 0.035, mountBracketY, -itemDepth * 0.03, darkColor, {
      rounded: false,
      metalness: 0.2,
      roughness: 0.3
    });
    addBoxMesh(group, itemWidth * 0.105, mountDrop * 0.86, Math.max(itemDepth * 0.12, 0.04), itemWidth * 0.025, mountBracketY + mountDrop * 0.02, itemDepth * 0.015, accentColor, {
      rounded: false,
      metalness: 0.35,
      roughness: 0.28
    });
    addBoxMesh(group, itemWidth * 0.34, Math.max(itemHeight * 0.018, 0.025), Math.max(itemDepth * 0.5, 0.2), 0, screenBottom * 0.76, itemDepth * 0.04, darkColor, {
      radius: 0.012,
      metalness: 0.22,
      roughness: 0.3
    });
    const screwRadius = Math.max(Math.min(itemWidth, itemDepth) * 0.045, 0.025);
    for (const screwX of [-backingWidth * 0.42, backingWidth * 0.42]) {
      for (const screwZ of [-backingDepth * 0.34, backingDepth * 0.34]) {
        addSoftBoxMesh(group, screwRadius, screwRadius, Math.max(screwRadius * 0.56, 0.018), screwZ, screwRadius, screwZ, 1448479, {
          segments: 20,
          rotationZ: Math.PI / 2,
          roughness: 0.38,
          metalness: 0.1
        });
      }
    }
  } else if (item.tvMountStyle === "tabletop") {
    const baseThickness = Math.max(itemHeight * 0.035, 0.028);
    const baseWidth = itemWidth * 0.34;
    const baseDepth = Math.max(itemDepth * 0.72, 0.16);
    const neckHeight = Math.max(screenBottom - baseThickness, itemHeight * 0.12);
    addBoxMesh(group, baseWidth, baseThickness, baseDepth, 0, baseThickness * 0.5, 0, darkColor, {
      radius: Math.min(baseThickness, baseDepth) * 0.26,
      metalness: 0.2,
      roughness: 0.3
    });
    addBoxMesh(group, itemWidth * 0.075, neckHeight, Math.max(itemDepth * 0.24, 0.05), 0, baseThickness + neckHeight * 0.5, -itemDepth * 0.03, accentColor, {
      rounded: false,
      metalness: 0.34,
      roughness: 0.28
    });
    addBoxMesh(group, itemWidth * 0.18, Math.max(itemHeight * 0.025, 0.022), Math.max(itemDepth * 0.34, 0.08), 0, screenBottom, 0, darkColor, {
      radius: 0.008,
      metalness: 0.22,
      roughness: 0.3
    });
  }
  addBoxMesh(group, itemWidth, bodyHeight, Math.max(itemDepth * 0.28, 0.05), 0, mountCenterY, 0, darkColor, {
    radius: Math.min(itemWidth, bodyHeight) * 0.012,
    roughness: 0.28
  });
}

function buildTeaBarMachineItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor) {
  const cabinetHeight = itemHeight * 0.67;
  const counterY = cabinetHeight + itemHeight * 0.045;
  const upperHeight = itemHeight - counterY;
  addBoxMesh(group, itemWidth, cabinetHeight, itemDepth, 0, cabinetHeight * 0.5, 0, bodyColor, {
    rounded: false,
    roughness: 0.5,
    metalness: 0.04
  });
  addBoxMesh(group, itemWidth * 0.94, 0.028, itemDepth * 1.02, 0, cabinetHeight * 0.5, itemDepth * 0.515, darkColor, {
    rounded: false,
    roughness: 0.34
  });
  addBoxMesh(group, itemWidth * 0.94, 0.032, itemDepth * 1.02, 0, cabinetHeight, 0, accentColor, {
    rounded: false,
    roughness: 0.42
  });
  addBoxMesh(group, itemWidth * 0.94, itemHeight * 0.04, itemDepth * 1.04, 0, counterY, 0, bodyColor, {
    rounded: false,
    roughness: 0.36,
    metalness: 0.1
  });
  addBoxMesh(group, itemWidth * 0.92, upperHeight, 0.032, 0, counterY + upperHeight * 0.5, -itemDepth * 0.46, accentColor, {
    rounded: false,
    roughness: 0.56
  });
  for (const sidePanelX of [-itemWidth * 0.46, itemWidth * 0.46]) {
    addBoxMesh(group, itemWidth * 0.075, upperHeight, itemDepth * 0.78, sidePanelX, counterY + upperHeight * 0.5, 0, bodyColor, {
      rounded: false,
      roughness: 0.48
    });
  }
  addBoxMesh(group, itemWidth * 0.86, itemHeight * 0.14, itemDepth * 0.18, 0, itemHeight * 0.9, itemDepth * 0.48, darkColor, {
    rounded: false,
    metalness: 0.32,
    roughness: 0.22
  });
  for (const cupX of [-itemWidth * 0.22, itemWidth * 0.22]) {
    addSoftBoxMesh(group, Math.min(itemWidth, itemDepth) * 0.035, Math.min(itemWidth, itemDepth) * 0.035, 0.018, cupX, itemHeight * 0.9, itemDepth * 0.585, accentColor, {
      segments: 20,
      rotationX: Math.PI / 2,
      metalness: 0.2,
      roughness: 0.25
    });
    addSoftBoxMesh(group, 0.012, 0.012, itemHeight * 0.11, cupX, itemHeight * 0.79, itemDepth * 0.5, darkColor, {
      segments: 18,
      metalness: 0.48,
      roughness: 0.22
    });
    const cupRadius = Math.min(itemWidth, itemDepth) * 0.16;
    addSoftBoxMesh(group, cupRadius * 0.9, cupRadius, itemHeight * 0.13, cupX, itemHeight * 0.75, itemDepth * 0.12, cupX < 0 ? 8752009 : accentColor, {
      segments: 28,
      metalness: 0.08,
      roughness: 0.34
    });
    addSoftBoxMesh(group, cupRadius * 0.84, cupRadius * 0.84, 0.016, cupX, itemHeight * 0.82, itemDepth * 0.12, darkColor, {
      segments: 28,
      metalness: 0.18,
      roughness: 0.28
    });
    addBoxMesh(group, itemWidth * 0.12, itemHeight * 0.06, 0.016, cupX, itemHeight * 0.77, itemDepth * 0.3, darkColor, {
      radius: 0.012,
      metalness: 0.24,
      roughness: 0.24
    });
  }
  addBoxMesh(group, itemWidth * 0.92, itemHeight * 0.055, itemDepth * 0.82, 0, 0.028, 0, darkColor, {
    rounded: false,
    roughness: 0.36
  });
}

function buildBookcaseItemMeshGroup(group, itemWidth, itemDepth, itemHeight, bodyColor, darkColor, accentColor, lightColor) {
  const clampedCornerRadius = Math.min(Math.max(Math.min(itemWidth, itemDepth) * 0.11, 0.032), 0.062);
  const bottomRailHeight = Math.min(Math.max(itemDepth * 0.075, 0.018), 0.032);
  const max = Math.max(itemWidth - clampedCornerRadius * 2, itemWidth * 0.72);
  const numericValue = 0.255;
  const arrayValue = [numericValue, 0.47, 0.59, 0.79];
  const sideHeight = itemHeight - clampedCornerRadius * 0.5;
  const value = max * 0.27;
  const leftShelfX = itemWidth * 0.5 - clampedCornerRadius * 1.5 - value;
  const rightShelfWidth = max - value - clampedCornerRadius;
  const rightShelfX = -max * 0.5 + rightShelfWidth * 0.5;
  const rightShelfCenterX = max * 0.5 - value * 0.5;
  const objectValue = {
    rounded: false,
    roughness: 0.62,
    metalness: 0.015
  };
  const backPanelZ = itemDepth * 0.5 + 0.013;
  addBoxMesh(group, clampedCornerRadius, itemHeight, itemDepth, -itemWidth * 0.5 + clampedCornerRadius * 0.5, itemHeight * 0.5, 0, bodyColor, objectValue);
  addBoxMesh(group, clampedCornerRadius, itemHeight, itemDepth, itemWidth * 0.5 - clampedCornerRadius * 0.5, itemHeight * 0.5, 0, bodyColor, objectValue);
  addBoxMesh(group, max, itemHeight * 0.95, bottomRailHeight, 0, itemHeight * 0.5, -itemDepth * 0.5 + bottomRailHeight * 0.5, darkColor, {
    ...objectValue,
    roughness: 0.76
  });
  addBoxMesh(group, max, itemHeight * numericValue - clampedCornerRadius * 0.5, itemDepth * 0.9, 0, itemHeight * numericValue * 0.5, -itemDepth * 0.025, accentColor, {
    ...objectValue,
    roughness: 0.66
  });
  for (const shelfRatio of arrayValue) {
    addBoxMesh(group, max, clampedCornerRadius, itemDepth, 0, itemHeight * shelfRatio, 0, accentColor, objectValue);
  }
  addBoxMesh(group, itemWidth, clampedCornerRadius, itemDepth, 0, sideHeight, 0, bodyColor, objectValue);
  const midShelfY = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
  const topShelfY = itemHeight - clampedCornerRadius;
  addBoxMesh(group, clampedCornerRadius, topShelfY - midShelfY, itemDepth, leftShelfX, (topShelfY + midShelfY) * 0.5, 0, bodyColor, objectValue);
  const count = 3;
  const bookRowStartY = clampedCornerRadius * 0.72;
  const counterY = itemHeight * numericValue - clampedCornerRadius * 0.5;
  const bookAreaHeight = Math.max(counterY - bookRowStartY, itemHeight * 0.16);
  const bookGap = Math.max(itemWidth * 0.008, 0.008);
  const leftBookStartX = -max * 0.18;
  const rightBookWidth = leftBookStartX + max * 0.5 - bookGap * 0.5;
  const leftBookWidth = max - rightBookWidth - bookGap;
  const halfValue = (bookAreaHeight - bookGap * (count - 1)) / count;
  for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
    const rowY = bookRowStartY + halfValue * 0.5 + rowIndex * (halfValue + bookGap);
    addBoxMesh(group, rightBookWidth, halfValue, 0.026, -max * 0.5 + rightBookWidth * 0.5, rowY, backPanelZ, bodyColor, {
      ...objectValue,
      roughness: 0.55
    });
    addBoxMesh(group, leftBookWidth, halfValue, 0.026, leftBookStartX + bookGap * 0.5 + leftBookWidth * 0.5, rowY, backPanelZ, accentColor, {
      ...objectValue,
      roughness: 0.55
    });
  }
  const backPanelHeight = itemHeight * (arrayValue[2] - arrayValue[1]) - clampedCornerRadius * 1.15;
  addBoxMesh(group, rightShelfWidth * 0.97, backPanelHeight, 0.028, rightShelfX, itemHeight * (arrayValue[1] + arrayValue[2]) * 0.5, backPanelZ, bodyColor, {
    ...objectValue,
    roughness: 0.54
  });
  const length = [14276045, 12499117, 10459536, 7828334, lightColor, accentColor];
  const addBookRow = ({
    startX: arg,
    maxWidth: rowWidth,
    shelfY: argPrimaryCurrent,
    availableHeight: argPrimaryNext,
    count: argPrimaryPrevious = 6,
    seed: argPrimaryLocal = 0
  }) => {
    const max = Math.max(rowWidth * 0.018, 0.006);
    const bookSlotHeight = Math.max((rowWidth - max * (argPrimaryPrevious + 1)) / argPrimaryPrevious, 0.026);
    // `computedValue` is the running x cursor along the shelf; `bookWidth` is the width of the
    // single book being placed. Upstream obfuscation had collapsed both values onto the name
    // `computedValue` and declared the per-book width as a loop-local `const`, which shadowed
    // the cursor and made the accumulation below throw "Assignment to constant variable", so the
    // whole bookshelf branch failed. Separating the two values is the only reading under which
    // every use inside this loop is self-consistent.
    let bookCursorX = arg + max;
    for (let bookIndex = 0; bookIndex < argPrimaryPrevious; bookIndex += 1) {
      const bookDepthRatio = [0.72, 0.9, 0.78, 1.04, 0.82, 0.68][(bookIndex + argPrimaryLocal) % 6];
      const bookWidth = bookSlotHeight * bookDepthRatio;
      const bookHeightRatio = [0.72, 0.88, 0.78, 0.94, 0.82, 0.68][(bookIndex * 2 + argPrimaryLocal) % 6];
      const value = argPrimaryNext * bookHeightRatio;
      if (bookCursorX + bookWidth > arg + rowWidth - max) {
        break;
      }
      const mesh = addBoxMesh(group, bookWidth, value, itemDepth * (0.47 + (bookIndex + argPrimaryLocal) % 3 * 0.045), bookCursorX + bookWidth * 0.5, argPrimaryCurrent + value * 0.5, itemDepth * 0.15, length[(bookIndex + argPrimaryLocal) % length.length], {
        radius: Math.min(bookWidth * 0.14, 0.012),
        roughness: 0.78,
        metalness: 0
      });
      if (bookIndex === argPrimaryPrevious - 1 && argPrimaryLocal % 2 === 1) {
        mesh.rotation.z = -0.07;
      }
      bookCursorX += bookWidth + max;
    }
  };
  const callback = (centerX, baseY, material, ornamentCount = 3, ornamentOffset = 0) => {
    for (let ornamentIndex = 0; ornamentIndex < ornamentCount; ornamentIndex += 1) {
      addBoxMesh(group, material, clampedCornerRadius * 0.54, itemDepth * 0.48, centerX, baseY + clampedCornerRadius * (0.38 + ornamentIndex * 0.56), itemDepth * 0.15, length[(ornamentIndex + ornamentOffset) % length.length], {
        radius: 0.007,
        roughness: 0.78,
        metalness: 0
      });
    }
  };
  const shelfY = itemHeight * arrayValue[0] + clampedCornerRadius * 0.5;
  addBookRow({
    startX: -max * 0.47,
    maxWidth: max * 0.29,
    shelfY,
    availableHeight: itemHeight * 0.15,
    count: 5,
    seed: 2
  });
  addBookRow({
    startX: max * 0.04,
    maxWidth: max * 0.38,
    shelfY,
    availableHeight: itemHeight * 0.16,
    count: 7,
    seed: 4
  });
  const shelfYCurrent = itemHeight * arrayValue[1] + clampedCornerRadius * 0.5;
  addBookRow({
    startX: leftShelfX + clampedCornerRadius * 0.6,
    maxWidth: value * 0.82,
    shelfY: shelfYCurrent,
    availableHeight: itemHeight * 0.075,
    count: 4,
    seed: 1
  });
  const shelfYNext = itemHeight * arrayValue[2] + clampedCornerRadius * 0.5;
  addBookRow({
    startX: -max * 0.47,
    maxWidth: rightShelfWidth * 0.42,
    shelfY: shelfYNext,
    availableHeight: itemHeight * 0.14,
    count: 6,
    seed: 0
  });
  addBoxMesh(group, rightShelfWidth * 0.17, itemHeight * 0.12, 0.022, rightShelfX + rightShelfWidth * 0.27, shelfYNext + itemHeight * 0.065, itemDepth * 0.22, 11972517, {
    rounded: false,
    roughness: 0.5
  });
  addBoxMesh(group, rightShelfWidth * 0.125, itemHeight * 0.085, 0.026, rightShelfX + rightShelfWidth * 0.27, shelfYNext + itemHeight * 0.065, itemDepth * 0.235, 7762283, {
    rounded: false,
    roughness: 0.42
  });
  callback(rightShelfCenterX, shelfYNext, value * 0.48, 3, 3);
  const lowShelfY = itemHeight * arrayValue[3] + clampedCornerRadius * 0.5;
  callback(rightShelfX - rightShelfWidth * 0.22, lowShelfY, rightShelfWidth * 0.24, 2, 1);
  addSoftBoxMesh(group, rightShelfWidth * 0.055, rightShelfWidth * 0.075, itemHeight * 0.12, rightShelfX - rightShelfWidth * 0.08, lowShelfY + itemHeight * 0.06, itemDepth * 0.12, 5196615, {
    segments: 22,
    roughness: 0.66
  });
  addSoftBoxMesh(group, rightShelfWidth * 0.045, rightShelfWidth * 0.064, itemHeight * 0.15, rightShelfX + rightShelfWidth * 0.08, lowShelfY + itemHeight * 0.075, itemDepth * 0.12, 6643802, {
    segments: 22,
    roughness: 0.66
  });
  callback(rightShelfCenterX, lowShelfY, value * 0.5, 2, 4);
}

function buildStudioItemMeshGroup(type, optionalValue = null) {
  const meshGroup = new THREE.Group();
  meshGroup.userData.squareEdges = SOFT_TEXTURE_UNIT_RESERVE.has(type.type);
  if ($g.has(type.type)) {
    meshGroup.userData.optimizationBatch = "v1-next-ten";
  }
  const itemWidth = type.width;
  const itemDepth = type.depth;
  const itemHeight = type.height;
  const themeColors = resolvedThemeColors();
  const woodColor = themeColors.furniture;
  const applianceColor = themeColors.appliance ?? woodColor;
  const accentColor = themeColors.furnitureSoft;
  const lightColor = themeColors.furnitureLight;
  const darkColor = themeColors.furnitureDark;
  if (set.has(type.type)) {
    buildWallCornerCaps(meshGroup, type, optionalValue);
    applySelectionHighlight(meshGroup, type);
  } else if (type.type === "planlabel") {
    meshGroup.add(markAsLightSourcePreview(type));
  } else if (type.offlineModelExport !== true && ALL_ITEM_MODELS[type.type] && type.type !== "smallcar" && type.type !== "sofa") {
    if (!attachExternalItemModel(meshGroup, type)) {
      addBoxMesh(meshGroup, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, RESERVED_TEXTURE_UNITS.has(type.type) ? applianceColor : woodColor, {
        rounded: false,
        roughness: 0.6,
        metalness: 0.1
      });
    }
  } else if (type.type === "smallcar") {
    buildSmallCarItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, woodColor, accentColor, darkColor);
  } else if (type.type === "curtain") {
    buildCurtainItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, lightColor, darkColor);
  } else if (Vl.has(type.type)) {
    buildStairItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, lightColor);
  } else if (type.type === "sofa") {
    buildSofaItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor);
  } else if (type.type === "bed") {
    buildBedItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, darkColor, accentColor, woodColor, lightColor);
  } else if (type.type === "nightstand") {
    buildNightstandItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, darkColor, lightColor);
  } else if (type.type === "table") {
    buildTableItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, accentColor);
  } else if (roundTableTypes.has(type.type)) {
    buildRoundTableItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, lightColor, woodColor, darkColor, accentColor);
  } else if (type.type === "bar") {
    buildBarItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, accentColor, woodColor, darkColor);
  } else if (type.type === "aquarium") {
    buildAquariumItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, themeColors, woodColor);
  } else if (type.type === "mural") {
    buildMuralItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, darkColor, lightColor);
  } else if (type.type === "featurewall") {
    buildFeatureWallItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight);
  } else if (type.type === "coffeetable") {
    buildCoffeeTableItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, lightColor, accentColor);
  } else if (type.type === "squarecoffeetable") {
    buildSquareCoffeeTableItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, darkColor);
  } else if (type.type === "chair") {
    buildTelevisionMesh(meshGroup, itemWidth, itemDepth, itemHeight, 0, 0, 0, woodColor, darkColor);
  } else if (type.type === "sideboard") {
    buildSideboardItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, accentColor);
  } else if (type.type === "shoecabinet") {
    buildShoeCabinetItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, accentColor);
  } else if (type.type === "cabinet") {
    buildCabinetItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, lightColor);
  } else if (type.type === "glasscabinet") {
    buildGlassCabinetItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, themeColors, woodColor, accentColor, lightColor);
  } else if (type.type === "bookcase") {
    buildBookcaseItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, accentColor, lightColor);
  } else if (type.type === "shelf") {
    buildShelfItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, lightColor);
  } else if (type.type === "pillar") {
    buildPillarItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, themeColors);
  } else if (type.type === "wallcabinet") {
    buildWallCabinetItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor);
  } else if (["kitchenbase", "kitchensink", "kitchencooktop"].includes(type.type)) {
    const toeKickHeight = itemHeight * 0.1;
    const counterTopGap = itemHeight * 0.07;
    const cabinetBodyHeight = itemHeight - toeKickHeight - counterTopGap;
    const cabinetBodyCenter = toeKickHeight + cabinetBodyHeight * 0.5;
    addBoxMesh(meshGroup, itemWidth * 0.96, toeKickHeight, itemDepth * 0.8, 0, toeKickHeight * 0.5, -itemDepth * 0.06, darkColor, {
      rounded: false,
      roughness: 0.52
    });
    addBoxMesh(meshGroup, itemWidth, cabinetBodyHeight, itemDepth, 0, cabinetBodyCenter, 0, woodColor, {
      rounded: false,
      roughness: 0.58
    });
    addBoxMesh(meshGroup, itemWidth * 1.02, counterTopGap, itemDepth * 1.04, 0, itemHeight - counterTopGap * 0.5, 0, lightColor, {
      rounded: false,
      roughness: 0.42
    });
    const drawerCount = Math.max(2, Math.min(6, Math.round(itemWidth / 0.6)));
    const drawerWidth = itemWidth / drawerCount;
    for (let drawerIndex = 0; drawerIndex < drawerCount; drawerIndex += 1) {
      const drawerCenterX = -itemWidth * 0.5 + drawerWidth * (drawerIndex + 0.5);
      addBoxMesh(meshGroup, drawerWidth * 0.92, cabinetBodyHeight * 0.9, 0.025, drawerCenterX, cabinetBodyCenter, itemDepth * 0.515, accentColor, {
        rounded: false,
        roughness: 0.46
      });
      addBoxMesh(meshGroup, drawerWidth * 0.28, 0.022, 0.03, drawerCenterX, toeKickHeight + cabinetBodyHeight * 0.83, itemDepth * 0.535, darkColor, {
        rounded: false,
        metalness: 0.28,
        roughness: 0.3
      });
    }
    if (type.type === "kitchensink") {
      addBoxMesh(meshGroup, itemWidth * 0.42, 0.025, itemDepth * 0.52, 0, itemHeight + 0.008, 0, darkColor, {
        rounded: false,
        metalness: 0.42,
        roughness: 0.28
      });
      addBoxMesh(meshGroup, itemWidth * 0.34, 0.02, itemDepth * 0.4, 0, itemHeight + 0.022, 0, accentColor, {
        rounded: false,
        metalness: 0.18,
        roughness: 0.34
      });
      addSoftBoxMesh(meshGroup, 0.018, 0.018, itemHeight * 0.22, itemWidth * 0.22, itemHeight + itemHeight * 0.11, -itemDepth * 0.17, darkColor, {
        segments: 20,
        metalness: 0.65,
        roughness: 0.2
      });
      addBoxMesh(meshGroup, itemWidth * 0.16, 0.035, 0.035, itemWidth * 0.14, itemHeight + itemHeight * 0.2, -itemDepth * 0.17, darkColor, {
        rounded: false,
        metalness: 0.65,
        roughness: 0.2
      });
    } else if (type.type === "kitchencooktop") {
      addBoxMesh(meshGroup, itemWidth * 0.48, 0.025, itemDepth * 0.55, 0, itemHeight + 0.008, 0, darkColor, {
        rounded: false,
        metalness: 0.32,
        roughness: 0.25
      });
      for (const burnerOffsetX of [-itemWidth * 0.13, itemWidth * 0.13]) {
        for (const burnerOffsetZ of [-itemDepth * 0.14, itemDepth * 0.14]) {
          addSoftBoxMesh(meshGroup, itemWidth * 0.06, itemWidth * 0.06, 0.018, burnerOffsetZ, itemHeight + 0.028, burnerOffsetZ, accentColor, {
            segments: 28,
            metalness: 0.42,
            roughness: 0.26
          });
          addSoftBoxMesh(meshGroup, itemWidth * 0.025, itemWidth * 0.025, 0.025, burnerOffsetZ, itemHeight + 0.045, burnerOffsetZ, darkColor, {
            segments: 24,
            metalness: 0.5,
            roughness: 0.22
          });
        }
      }
    }
  } else if (type.type === "fridge") {
    buildFridgeItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor);
  } else if (type.type === "storagewaterheater") {
    buildStorageWaterHeaterItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "gaswaterheater") {
    buildGasWaterHeaterItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "pipelinewaterpurifier") {
    buildPipelineWaterPurifierItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "tea_bar_machine") {
    buildTeaBarMachineItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "washer" || type.type === "dryer") {
    const isDryer = type.type === "dryer";
    const doorRadius = itemWidth * (isDryer ? 0.32 : 0.29);
    addBoxMesh(meshGroup, itemWidth, itemHeight, itemDepth, 0, itemHeight * 0.5, 0, lightColor, {
      rounded: false,
      metalness: 0.1,
      roughness: 0.48
    });
    addBoxMesh(meshGroup, itemWidth * 0.92, itemHeight * 0.18, 0.035, 0, itemHeight * 0.86, itemDepth * 0.505, accentColor, {
      rounded: false,
      roughness: 0.4
    });
    addSoftBoxMesh(meshGroup, doorRadius, doorRadius, 0.045, 0, itemHeight * 0.47, itemDepth * 0.515, darkColor, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.32,
      roughness: 0.28
    });
    addSoftBoxMesh(meshGroup, doorRadius * 0.74, doorRadius * 0.74, 0.03, 0, itemHeight * 0.47, itemDepth * 0.545, isDryer ? 2502715 : 3622485, {
      segments: 40,
      rotationX: Math.PI / 2,
      metalness: 0.08,
      roughness: 0.22
    });
    addSoftBoxMesh(meshGroup, itemWidth * 0.055, itemWidth * 0.055, 0.035, itemWidth * 0.27, itemHeight * 0.86, itemDepth * 0.535, darkColor, {
      segments: 24,
      rotationX: Math.PI / 2,
      metalness: 0.4,
      roughness: 0.25
    });
    addBoxMesh(meshGroup, itemWidth * 0.25, itemHeight * 0.035, 0.026, -itemWidth * 0.23, itemHeight * 0.86, itemDepth * 0.535, darkColor, {
      rounded: false,
      roughness: 0.3
    });
    if (!isDryer) {
      addBoxMesh(meshGroup, itemWidth * 0.2, itemHeight * 0.055, 0.025, -itemWidth * 0.3, itemHeight * 0.12, itemDepth * 0.525, accentColor, {
        rounded: false,
        roughness: 0.42
      });
    }
  } else if (type.type === "dishwasher") {
    buildDishwasherItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "steamoven") {
    buildSteamOvenItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "microwave") {
    buildMicrowaveItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "ricecooker") {
    buildRiceCookerItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "rangehood") {
    buildRangeHoodItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, lightColor, darkColor, accentColor);
  } else if (type.type === "wallac") {
    buildWallAcItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "floorac") {
    buildFloorAcItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "robotvacuum") {
    buildRobotVacuumItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "camera" || type.type === "presence") {
    addSecurityModel(THREE, meshGroup, type, themeColors);
  } else if (type.type === "nas") {
    buildNasItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, accentColor);
  } else if (type.type === "airpurifier") {
    buildAirPurifierItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, darkColor, accentColor);
  } else if (type.type === "tv") {
    buildTvItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, darkColor, accentColor);
  } else if (type.type === "vanity") {
    buildVanityItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, lightColor, themeColors);
  } else if (type.type === "desk") {
    buildDeskItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor, woodColor, lightColor);
  } else if (type.type === "desktop") {
    buildDesktopItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, darkColor, accentColor);
  } else if (type.type === "laptop") {
    buildLaptopItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, darkColor);
  } else if (type.type === "toilet") {
    buildToiletItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "squattoilet") {
    buildSquatToiletItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "urinal") {
    buildUrinalItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, accentColor, darkColor);
  } else if (type.type === "bathtub") {
    buildBathtubItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, accentColor, lightColor, darkColor, themeColors);
  } else if (type.type === "walllamp") {
    buildWallLampItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor, themeColors);
  } else if (type.type === "glasspartition") {
    buildGlassPartitionItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, accentColor, themeColors);
  } else if (type.type === "shower") {
    buildShowerItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, lightColor);
  } else if (type.type === "basin") {
    buildBasinItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, lightColor, accentColor, darkColor, themeColors);
  } else if (type.type === "rug") {
    buildRugItemMeshGroup(meshGroup, type, itemWidth, itemDepth, itemHeight, woodColor, accentColor);
  } else if (type.type === "tvstand") {
    buildTvStandItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, woodColor, accentColor, darkColor);
  } else if (type.type === "floorlamp") {
    buildFloorLampItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, darkColor, accentColor);
  } else if (type.type === "plant") {
    buildPlantItemMeshGroup(meshGroup, itemWidth, itemDepth, itemHeight, accentColor, darkColor);
  }
  if ((floorScene.has(type.type) || projectDoc.has(type.type)) && type.offlineModelExport !== true) {
    const builtChildren = [...meshGroup.children];
    // Stage curtain motion needs procedural curtainPart tags; keep the built-in rig there.
    if (!(isStageEmbed && type.type === "curtain") && attachExternalItemModel(meshGroup, type)) {
      builtChildren.forEach(child => {
        meshGroup.remove(child);
        disposeObject3dResources(child);
      });
    }
  }
  if (type.type === "tv" && type.offlineModelExport !== true) {
    addTvMountMeshes(meshGroup, type, itemWidth, itemDepth, itemHeight);
  }
  mergeSimilarItemMeshes(meshGroup, type.type);
  addStripLightHelpers(meshGroup, type.type);
  countShadowLights(meshGroup, isSelected("item", type.id));
  // Last step on purpose: the external-model swap above may have replaced everything built so far, so
  // the posture has to pose whatever survived that swap.
  applyItemPosture(meshGroup, type);
  return meshGroup;
}
function instanceMergeIdenticalItems(object3d, item) {
  object3d.rotation.y = -THREE.MathUtils.degToRad(finite(item.rotation, 0));
  if (stairItemTypes.has(item.type)) {
    object3d.scale.x = item.stairDirection === "left" ? -1 : 1;
  }
  if (item.type === "shoecabinet" && item.shoeCabinetMirrored === true) {
    object3d.scale.x = -1;
  }
  if (item.type === "camera" || item.type === "presence") {
    object3d.rotation.order = "YXZ";
    object3d.rotation.x = THREE.MathUtils.degToRad(clamp(finite(item.verticalRotation, 0), -180, 180));
    return;
  }
  if (set.has(item.type)) {
    if (item.type === "striplight") {
      object3d.rotation.order = "YXZ";
      object3d.rotation.x = 0;
      object3d.rotation.z = 0;
    } else {
      const verticalRad = THREE.MathUtils.degToRad(clamp(finite(item.verticalRotation, 0), -90, 90));
      object3d.rotation.order = "YXZ";
      object3d.rotation.x = verticalRad;
    }
  }
}
function collectShadowLights(sourceObject) {
  sourceObject.updateMatrixWorld(true);
  sourceObject.updateMatrix();
  if (sourceObject.matrix.determinant() < 0) {
    return null;
  }
  const worldToLocal = sourceObject.matrixWorld.clone().invert();
  const descriptors = [];
  let isMergeable = true;
  sourceObject.traverse(isMesh => {
    if (!isMergeable || !isMesh.isMesh) {
      return;
    }
    const material = isMesh.material;
    if (!isMesh.userData.externalModelSharedGeometry || Array.isArray(material) || !material || material.transparent === true || finite(material.opacity, 1) < 0.999 || isMesh.isSkinnedMesh || isMesh.morphTargetInfluences) {
      isMergeable = false;
      return;
    }
    const relativeMatrix = new THREE.Matrix4().multiplyMatrices(worldToLocal, isMesh.matrixWorld);
    const childSignature = collectChildMeshes(isMesh);
    if (!childSignature) {
      isMergeable = false;
      return;
    }
    descriptors.push({
      mesh: isMesh,
      relativeMatrix,
      signature: JSON.stringify([isMesh.geometry.uuid, childSignature, relativeMatrix.elements.map(component => Math.round(component * 1000000) / 1000000), isMesh.castShadow, isMesh.receiveShadow, isMesh.renderOrder])
    });
  });
  if (isMergeable && descriptors.length) {
    return descriptors;
  } else {
    return null;
  }
}
function mergeStaticItemInstanceBatches(rootGroup, batches) {
  const lookupMap = new Map();
  for (const {
    item: batchItem,
    group: entryGroup
  } of batches) {
    if (skipInstanceMergeTypes.has(batchItem.type) || isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(batchItem.type) || isSelected("item", batchItem.id)) {
      continue;
    }
    const map = collectShadowLights(entryGroup);
    if (!map) {
      continue;
    }
    const cacheKey = JSON.stringify([batchItem.type, map.map(signature => signature.signature)]);
    if (!lookupMap.has(cacheKey)) {
      lookupMap.set(cacheKey, []);
    }
    lookupMap.get(cacheKey).push({
      item: batchItem,
      group: entryGroup,
      descriptors: map
    });
  }
  rootGroup.updateMatrixWorld(true);
  const worldToLocal = rootGroup.matrixWorld.clone().invert();
  const batchStats = [];
  for (const batchEntries of lookupMap.values()) {
    if (batchEntries.length < 2) {
      continue;
    }
    const descriptorCount = batchEntries[0].descriptors.length;
    for (let descriptorIndex = 0; descriptorIndex < descriptorCount; descriptorIndex += 1) {
      const sourceMesh = batchEntries[0].descriptors[descriptorIndex].mesh;
      const instanceMaterial = sourceMesh.userData.externalModelSharedMaterial ? sourceMesh.material : sourceMesh.material.clone();
      const instancedMesh = new THREE.InstancedMesh(sourceMesh.geometry, instanceMaterial, batchEntries.length);
      instancedMesh.name = "ha-bridge-instance-" + batchEntries[0].item.type + "-" + (descriptorIndex + 1);
      instancedMesh.castShadow = sourceMesh.castShadow;
      instancedMesh.receiveShadow = sourceMesh.receiveShadow;
      instancedMesh.renderOrder = sourceMesh.renderOrder;
      instancedMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      instancedMesh.userData.externalModelSharedGeometry = true;
      instancedMesh.userData.externalModelSharedTextures = true;
      instancedMesh.userData.externalModelSharedMaterial = sourceMesh.userData.externalModelSharedMaterial === true;
      instancedMesh.userData.modelLayer = "items";
      instancedMesh.userData.exportRole = "plan";
      instancedMesh.userData.instanceItemType = batchEntries[0].item.type;
      instancedMesh.userData.instanceItemIds = batchEntries.map(({
        item: id
      }) => id.id);
      batchEntries.forEach(({
        descriptors: descriptorList
      }, instanceIndex) => {
        const instanceMatrix = new THREE.Matrix4().multiplyMatrices(worldToLocal, descriptorList[descriptorIndex].mesh.matrixWorld);
        instancedMesh.setMatrixAt(instanceIndex, instanceMatrix);
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.computeBoundingBox();
      instancedMesh.computeBoundingSphere();
      rootGroup.add(instancedMesh);
    }
    for (const {
      group: removedGroup
    } of batchEntries) {
      rootGroup.remove(removedGroup);
      disposeObject3dResources(removedGroup);
    }
    batchStats.push({
      type: batchEntries[0].item.type,
      instances: batchEntries.length,
      before: batchEntries.length * descriptorCount,
      after: descriptorCount
    });
  }
  rootGroup.userData.instanceBatchStats = batchStats;
  if (renderer?.domElement) {
    renderer.domElement.dataset.instanceBatchCount = String(batchStats.length);
    renderer.domElement.dataset.instanceCount = String(batchStats.reduce((totalSoFar, beforeCount) => totalSoFar + beforeCount.instances, 0));
    renderer.domElement.dataset.instanceDrawCallsSaved = String(batchStats.reduce((savedSoFar, beforeCount) => savedSoFar + beforeCount.before - beforeCount.after, 0));
  }
  return batchStats;
}
function buildCanvasPathFromPoints(rootGroup, batches) {
  const staticBatchGeometryMap = new Map();
  const compatibleAttributes = mesh => {
    const attributeNames = Object.keys(mesh.geometry.attributes).filter(keyName => keyName !== "color" || mesh.material.vertexColors).sort();
    if (!isStageEmbed || Object.values(mesh.material).some(isTexture => isTexture?.isTexture)) {
      return attributeNames;
    } else {
      return attributeNames.filter(name => name === "position" || name === "normal" || name === "color" && mesh.material.vertexColors);
    }
  };
  rootGroup.updateMatrixWorld(true);
  for (const {
    item: batchItem,
    group: batchGroup
  } of batches) {
    if (batchGroup.parent === rootGroup && !skipInstanceMergeTypes.has(batchItem.type) && (!isStageEmbed || !["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(batchItem.type)) && !isSelected("item", batchItem.id)) {
      batchGroup.traverse(candidateMesh => {
        if (!candidateMesh.isMesh || candidateMesh.isInstancedMesh || candidateMesh.geometry.drawRange.start !== 0 || candidateMesh.geometry.drawRange.count !== Infinity) {
          return;
        }
        for (let ancestor = candidateMesh; ancestor && ancestor !== rootGroup; ancestor = ancestor.parent) {
          if (!ancestor.visible) {
            return;
          }
        }
        const needsVertexColor = isStageEmbed && !candidateMesh.material?.vertexColors;
        const glassMaterial = createGlassMaterial(candidateMesh, isStageEmbed, needsVertexColor);
        if (!glassMaterial || candidateMesh.matrixWorld.determinant() < 0) {
          return;
        }
        const attributeSpecs = compatibleAttributes(candidateMesh).map(attributeName => [attributeName, candidateMesh.geometry.attributes[attributeName].itemSize]);
        if (needsVertexColor) {
          attributeSpecs.push(["color", 3]);
        }
        const materialKey = isStageEmbed ? JSON.stringify(attributeSpecs) : meshMaterialSignature(candidateMesh);
        const batchKey = glassMaterial + ":" + materialKey + ":" + needsVertexColor;
        if (!staticBatchGeometryMap.has(batchKey)) {
          staticBatchGeometryMap.set(batchKey, []);
        }
        staticBatchGeometryMap.get(batchKey).push(candidateMesh);
      });
    }
  }
  const inverseWorldMatrix = rootGroup.matrixWorld.clone().invert();
  const staticBatchStats = [];
  const disposedMaterials = new Set();
  for (const meshGroup of staticBatchGeometryMap.values()) {
    if (meshGroup.length < 2) {
      continue;
    }
    const preparedGeometries = meshGroup.map(sourceGeometry => {
      const localMatrix = new THREE.Matrix4().multiplyMatrices(inverseWorldMatrix, sourceGeometry.matrixWorld);
      const clonedGeometry = sourceGeometry.geometry.clone();
      if (isStageEmbed) {
        const keptAttributes = compatibleAttributes(sourceGeometry);
        for (const attributeKey of Object.keys(clonedGeometry.attributes)) {
          if (!keptAttributes.includes(attributeKey)) {
            clonedGeometry.deleteAttribute(attributeKey);
          }
        }
        for (const keptAttribute of keptAttributes) {
          const sourceAttribute = sourceGeometry.geometry.attributes[keptAttribute];
          if (!sourceAttribute.isInterleavedBufferAttribute && !sourceAttribute.normalized && sourceAttribute.array instanceof Float32Array) {
            continue;
          }
          const attributeValues = new Float32Array(sourceAttribute.count * sourceAttribute.itemSize);
          const getters = ["getX", "getY", "getZ", "getW"];
          for (let vertexIndex = 0; vertexIndex < sourceAttribute.count; vertexIndex++) {
            for (let componentIndex = 0; componentIndex < sourceAttribute.itemSize; componentIndex++) {
              attributeValues[vertexIndex * sourceAttribute.itemSize + componentIndex] = componentIndex < 4 ? sourceAttribute[getters[componentIndex]](vertexIndex) : sourceAttribute.getComponent(vertexIndex, componentIndex);
            }
          }
          clonedGeometry.setAttribute(keptAttribute, new THREE.BufferAttribute(attributeValues, sourceAttribute.itemSize));
        }
        if (!sourceGeometry.material.vertexColors) {
          const vertexTotal = clonedGeometry.attributes.position.count;
          const vertexColorsArray = new Float32Array(vertexTotal * 3);
          const baseColor = sourceGeometry.material.color;
          for (let vertexCursor = 0; vertexCursor < vertexTotal; vertexCursor++) {
            vertexColorsArray[vertexCursor * 3] = baseColor.r;
            vertexColorsArray[vertexCursor * 3 + 1] = baseColor.g;
            vertexColorsArray[vertexCursor * 3 + 2] = baseColor.b;
          }
          clonedGeometry.setAttribute("color", new THREE.BufferAttribute(vertexColorsArray, 3));
        }
        if (!clonedGeometry.index) {
          const indexedVertexCount = clonedGeometry.attributes.position.count;
          const indexArray = indexedVertexCount <= 65536 ? new Uint16Array(indexedVertexCount) : new Uint32Array(indexedVertexCount);
          for (let indexValue = 0; indexValue < indexedVertexCount; indexValue++) {
            indexArray[indexValue] = indexValue;
          }
          clonedGeometry.setIndex(new THREE.BufferAttribute(indexArray, 1));
        }
      }
      return clonedGeometry.applyMatrix4(localMatrix);
    });
    const mergedGeometry = mergeGeometries(preparedGeometries);
    preparedGeometries.forEach(preparedGeometry => preparedGeometry.dispose());
    if (!mergedGeometry) {
      continue;
    }
    const sourceMesh = meshGroup[0];
    const recolorVertexColors = isStageEmbed && !sourceMesh.material.vertexColors;
    const batchedMaterial = recolorVertexColors ? sourceMesh.material.clone() : sourceMesh.material;
    if (recolorVertexColors) {
      batchedMaterial.color.setRGB(1, 1, 1);
      batchedMaterial.vertexColors = true;
    }
    const batchedMesh = new THREE.Mesh(mergedGeometry, batchedMaterial);
    batchedMesh.castShadow = sourceMesh.castShadow;
    batchedMesh.receiveShadow = sourceMesh.receiveShadow;
    batchedMesh.renderOrder = sourceMesh.renderOrder;
    batchedMesh.layers.mask = sourceMesh.layers.mask;
    batchedMesh.userData.externalModelSharedTextures = sourceMesh.userData.externalModelSharedTextures === true;
    batchedMesh.userData.externalModelSharedMaterial = !recolorVertexColors && sourceMesh.userData.externalModelSharedMaterial === true;
    batchedMesh.userData.reflectionSimplifiable = isStageEmbed;
    batchedMesh.userData.modelLayer = "items";
    batchedMesh.userData.exportRole = "plan";
    for (const sourceItem of meshGroup) {
      sourceItem.parent?.remove(sourceItem);
      if (!sourceItem.userData.externalModelSharedGeometry) {
        sourceItem.geometry.dispose();
      }
      if (!sourceItem.userData.externalModelSharedMaterial) {
        disposedMaterials.add(sourceItem.material);
      }
    }
    rootGroup.add(batchedMesh);
    staticBatchStats.push({
      before: meshGroup.length,
      after: 1
    });
  }
  for (const {
    group: orphanGroup
  } of batches) {
    if (orphanGroup.parent === rootGroup && collectDescendantMeshes(orphanGroup).length === 0) {
      rootGroup.remove(orphanGroup);
    }
  }
  const liveMaterials = new Set();
  rootGroup.traverse(node => {
    for (const materialEntry of Array.isArray(node.material) ? node.material : node.material ? [node.material] : []) {
      liveMaterials.add(materialEntry);
    }
  });
  for (const candidateMaterial of disposedMaterials) {
    if (!liveMaterials.has(candidateMaterial)) {
      candidateMaterial.dispose?.();
    }
  }
  rootGroup.userData.staticItemBatchStats = staticBatchStats;
  if (renderer?.domElement) {
    renderer.domElement.dataset.staticItemBatchCount = String(staticBatchStats.length);
    renderer.domElement.dataset.staticItemDrawCallsSaved = String(staticBatchStats.reduce((saved, before) => saved + before.before - before.after, 0));
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
function meshInstanceDescriptors(lights) {
  let spotCount = 0;
  let rectAreaCount = 0;
  let pointCount = 0;
  let otherCount = 0;
  for (const light of lights) {
    if (light.isSpotLight) {
      spotCount += 1;
    } else if (light.isRectAreaLight) {
      rectAreaCount += 1;
    } else if (light.isPointLight) {
      pointCount += 1;
    } else {
      otherCount += 1;
    }
  }
  return spotCount + ":" + rectAreaCount + ":" + pointCount + ":" + otherCount;
}
function collectWorldExternalMeshes() {
  if (!worldGroup) {
    return [];
  }
  const visibleLights = [];
  const byGroup = new Map();
  worldGroup.traverse(node => {
    if (!node.isLight || !node.userData?.lightItemId || !isStageEmbed && finite(node.userData.lightOnIntensity, 0) <= 0) {
      return;
    }
    if (node.visible !== false) {
      visibleLights.push(node);
    }
    const groupId = String(node.userData.lightGroupId || "");
    if (groupId) {
      if (!byGroup.has(groupId)) {
        byGroup.set(groupId, []);
      }
      byGroup.get(groupId).push(node);
    }
  });
  const groupedLights = [...byGroup.values()].flat();
  const seenSignatures = new Set();
  const descriptors = [];
  const baseSignature = meshInstanceDescriptors(visibleLights);
  const meshSetKey = worldGroup.uuid + ":" + cs;
  if (materialTestTypeQuery !== meshSetKey) {
    materialTestTypeQuery = meshSetKey;
    instanceTestTypeQuery.clear();
  }
  const recordDescriptor = (descriptor, lights, forceRecord = false) => {
    const signature = meshInstanceDescriptors(descriptor);
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      if (!instanceTestTypeQuery.has(signature)) {
        if (!!forceRecord || signature === baseSignature || !(instanceTestTypeQuery.size + descriptors.length >= qg)) {
          descriptors.push({
            signature: signature,
            lights: lights.filter(lightCandidate => lightCandidate.visible).map(lightRef => lightRef.light),
            changes: lights
          });
        }
      }
    }
  };
  recordDescriptor(visibleLights, [], true);
  recordDescriptor([], groupedLights.map(hiddenEntry => ({
    light: hiddenEntry,
    visible: false
  })), true);
  for (const groupLights of byGroup.values()) {
    const lights = groupLights.filter(groupNode => groupNode.visible === false);
    if (lights.length) {
      recordDescriptor([...visibleLights, ...lights], lights.map(shownEntry => ({
        light: shownEntry,
        visible: true
      })));
    }
    const signature = groupLights.filter(visibleCandidate => visibleCandidate.visible !== false);
    if (signature.length) {
      recordDescriptor(visibleLights.filter(visibleNode => !signature.includes(visibleNode)), signature.map(inactiveEntry => ({
        light: inactiveEntry,
        visible: false
      })));
    }
  }
  if (isStageEmbed) {
    recordDescriptor(groupedLights, groupedLights.map(embedEntry => ({
      light: embedEntry,
      visible: true
    })), true);
  }
  return descriptors;
}
const Xm = 4500;
function countLightPrecompileWork(renderer, sceneRoot, camera, isStillActive) {
  const glContext = renderer.getContext();
  if (!isStillActive() || glContext.isContextLost() || renderer.extensions?.has("KHR_parallel_shader_compile") === false) {
    return Promise.resolve(false);
  }
  renderer.compile(sceneRoot, camera);
  let hasTransmission = false;
  sceneRoot.traverse?.(material => {
    if ((Array.isArray(material.material) ? material.material : [material.material]).some(transmission => transmission?.transmission > 0)) {
      hasTransmission = true;
    }
  });
  if (hasTransmission) {
    const savedRenderTarget = renderer.getRenderTarget();
    const savedCubeFace = renderer.getActiveCubeFace();
    const savedMipmapLevel = renderer.getActiveMipmapLevel();
    const probeTarget = new THREE.WebGLRenderTarget(1, 1);
    try {
      renderer.setRenderTarget(probeTarget);
      renderer.compile(sceneRoot, camera);
    } finally {
      renderer.setRenderTarget(savedRenderTarget, savedCubeFace, savedMipmapLevel);
      probeTarget.dispose();
    }
  }
  const programs = [...renderer.info.programs];
  const retryDeadline = performance.now() + Xm;
  return new Promise((resolve, reject) => {
    const pollUntilReady = () => {
      try {
        if (!isStillActive() || renderer.getContext() !== glContext || glContext.isContextLost()) {
          resolve(false);
          return;
        }
        const knownPrograms = new Set(renderer.info.programs);
        const isTrackedProgram = trackedProgram => knownPrograms.has(trackedProgram) && trackedProgram.program && glContext.isProgram(trackedProgram.program);
        if (programs.some(candidateProgram => !isTrackedProgram(candidateProgram))) {
          resolve(false);
          return;
        }
        if (programs.every(readyProgram => readyProgram.isReady())) {
          for (const programEntry of programs) {
            if (!isTrackedProgram(programEntry)) {
              resolve(false);
              return;
            }
            programEntry.getUniforms();
            if (!isTrackedProgram(programEntry)) {
              resolve(false);
              return;
            }
            programEntry.getAttributes();
          }
          resolve(true);
        } else if (performance.now() >= retryDeadline) {
          resolve(false);
        } else {
          window.setTimeout(pollUntilReady, 32);
        }
      } catch (error) {
        reject(error);
      }
    };
    window.setTimeout(pollUntilReady, 0);
  });
}
function activeFloorContentBounds() {
  return endBaseLightPanelDrag || document.hidden || isStageEmbed && (!Vo || cache?.closed);
}
function createInvisibleMaterial() {
  return stageSession || previewOrbitLocked || isLeavingStudio || isBakingLightCache || isLightPrecompiling || isStageEmbed && (isStageWarmup || isCapturingFrame) || !isStageEmbed && isPreviewQualityReady();
}
function scheduleOrbitInteractionWarmup(delayMs = 360) {
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
        const externalMeshes = collectWorldExternalMeshes();
        const worldRoot = worldGroup;
        const previewScene = previewSceneCurrent;
        const rendererRef = renderer;
        const cacheSignature = [worldRoot.uuid, getPreviewFloorModeCurrent(), activeFloorId, cs, ...externalMeshes.map(signature => signature.signature).sort()].join("|");
        if (!externalMeshes.length) {
          ORBIT_DOLLY_SPEED_SCALE = false;
          rendererRef.domElement.dataset.lightPrecompileState = "ready";
          syncExternalModelDomStats();
          return;
        }
        ORBIT_DOLLY_SPEED_MAX = true;
        ORBIT_DOLLY_SPEED_SCALE = false;
        rendererRef.domElement.dataset.lightPrecompileState = "working";
        rendererRef.domElement.dataset.lightPrecompilePlanCount = String(externalMeshes.length);
        const isPrecompileTargetValid = () => worldGroup === worldRoot && previewSceneCurrent === previewScene && renderer === rendererRef && !ORBIT_DOLLY_SPEED_SCALE && !activeFloorContentBounds() && !createInvisibleMaterial();
        let completed = true;
        try {
          for (const meshBatch of externalMeshes) {
            await yieldToIdle();
            if (!isPrecompileTargetValid()) {
              completed = false;
              ORBIT_DOLLY_SPEED_SCALE = true;
              break;
            }
            const restoreStates = meshBatch.changes.map(({
              light: lightRef,
              visible: nextVisible
            }) => ({
              light: lightRef,
              nextVisible,
              visible: lightRef.visible,
              intensity: lightRef.intensity
            }));
            let precompileResult = null;
            try {
              for (const lightState of restoreStates) {
                lightState.light.intensity = 0;
                lightState.light.visible = lightState.nextVisible;
              }
              syncSpotShadowCastingLights(worldRoot, {
                rebuildAtlas: false
              });
              precompileResult = countLightPrecompileWork(rendererRef, restoreStates, cameraCurrent, isPrecompileTargetValid);
            } finally {
              for (const restoreState of restoreStates) {
                restoreState.light.visible = restoreState.visible;
                restoreState.light.intensity = restoreState.intensity;
              }
              syncSpotShadowCastingLights(worldRoot, {
                rebuildAtlas: false
              });
            }
            if (!(await precompileResult) || !isPrecompileTargetValid()) {
              completed = false;
              rendererRef.domElement.dataset.lightPrecompileDeferred = "true";
              ORBIT_DOLLY_SPEED_SCALE ||= !isPrecompileTargetValid();
              break;
            }
            G += 1;
            instanceTestTypeQuery.add(meshBatch.signature);
          }
          if (completed) {
            PRECOMPILE_TIMEOUT_MS = cacheSignature;
            delete rendererRef.domElement.dataset.lightPrecompileDeferred;
            rendererRef.domElement.dataset.lightPrecompileState = "ready";
          } else {
            rendererRef.domElement.dataset.lightPrecompileState = "deferred";
          }
        } catch (error) {
          rendererRef.domElement.dataset.lightPrecompileState = "fallback";
          console.debug("3D first-light precompile skipped", error);
        } finally {
          ORBIT_DOLLY_SPEED_MAX = false;
          syncExternalModelDomStats();
          if (ORBIT_DOLLY_SPEED_SCALE) {
            scheduleOrbitInteractionWarmup(240);
          }
        }
      }, delayMs);
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
function scheduleLightPrecompile(delayMs = 0) {
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
        const sharedMeshes = collectExternalSharedMeshes();
        if (!sharedMeshes.length) {
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
          sharedMeshes.forEach(mesh => O.add(mesh));
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
      }, delayMs);
    }
  }
}
function rebuildPreviewMeshes(rebuildOptions = {}) {
  const forceRebuild = rebuildOptions.force === true;
  const rebuildScope = ["items", "lights"].includes(rebuildOptions.scope) ? rebuildOptions.scope : "all";
  if (!isLivePreviewEnabled() && !forceRebuild) {
    if (rebuildOptions.transient !== true) {
      previewNeedsRefresh = true;
    }
    syncLivePreviewButtons();
    return;
  }
  if (forceRebuild) {
    planZoomAnchor = true;
    pendingRebuildReasons.add("all");
  } else {
    pendingRebuildReasons.add(rebuildScope);
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
      const previewActive = isLivePreviewEnabled() || planZoomAnchor;
      planZoomAnchor = false;
      if (!previewActive) {
        previewNeedsRefresh = true;
        syncLivePreviewButtons();
        return;
      }
      const rebuildReasons = new Set(pendingRebuildReasons);
      pendingRebuildReasons.clear();
      const preserveLightCache = !Ka;
      Ka = false;
      if (getPreviewFloorModeCurrent() === "all" || rebuildReasons.has("all") || !floorSceneCurrent.walls.length) {
        rebuildWorldPreviewCurrent({
          preserveLightCache
        });
      } else {
        if (rebuildReasons.has("items")) {
          rebuildPreviewLightMeshes({
            preserveLightCache
          });
        }
        if (rebuildReasons.has("lights")) {
          rebuildPreviewLightMeshesCurrent({
            preserveLightCache
          });
        }
      }
      const settlePrecompile = orbitAnimSettleTimer;
      orbitAnimSettleTimer = false;
      syncExternalModelDomStats();
      if (settlePrecompile || collectExternalSharedMeshes().length) {
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
function extrudeWallSegmentShape(wall, wallCurrent, unusedThirdArg, toWorldCoord, wallNext = {}) {
  const startWorld = toWorldCoord(wall.start);
  const endWorld = toWorldCoord(wall.end);
  const deltaX = endWorld.x - startWorld.x;
  const deltaZ = endWorld.z - startWorld.z;
  const segmentLength = Math.hypot(deltaX, deltaZ);
  if (segmentLength <= 1e-7) {
    return null;
  }
  const unitDirection = {
    x: deltaX / segmentLength,
    y: deltaZ / segmentLength
  };
  const normal = {
    x: -unitDirection.y,
    y: unitDirection.x
  };
  const halfThickness = wall.thickness / 2;
  const startExtension = wallCurrent.start <= 0.000001 ? wallCurrent.start - Math.max(Number(wallNext.start) || 0, 0) : wallCurrent.start;
  const endExtension = wallCurrent.end >= segmentLength - 0.000001 ? wallCurrent.end + Math.max(Number(wallNext.end) || 0, 0) : wallCurrent.end;
  const startInPlan = {
    x: startWorld.x + unitDirection.x * startExtension,
    y: startWorld.z + unitDirection.y * startExtension
  };
  const endInPlan = {
    x: startWorld.x + unitDirection.x * endExtension,
    y: startWorld.z + unitDirection.y * endExtension
  };
  return [{
    x: startInPlan.x + normal.x * halfThickness,
    y: startInPlan.y + normal.y * halfThickness
  }, {
    x: startInPlan.x - normal.x * halfThickness,
    y: startInPlan.y - normal.y * halfThickness
  }, {
    x: endInPlan.x - normal.x * halfThickness,
    y: endInPlan.y - normal.y * halfThickness
  }, {
    x: endInPlan.x + normal.x * halfThickness,
    y: endInPlan.y + normal.y * halfThickness
  }];
}
function polygonCentroid(PathClass, points) {
  const planPoint = new PathClass();
  points.forEach((worldPoint, pointIndex) => {
    if (pointIndex === 0) {
      planPoint.moveTo(worldPoint.x, worldPoint.y);
    } else {
      planPoint.lineTo(worldPoint.x, worldPoint.y);
    }
  });
  planPoint.closePath();
  return planPoint;
}
function splitFloorPolygonsByHoles(loops) {
  const outerWalls = [];
  const holeLoops = [];
  for (const polygonLoop of loops) {
    const signedArea = polygonArea(polygonLoop);
    if (signedArea > 0) {
      outerWalls.push({
        loop: polygonLoop,
        area: signedArea,
        holes: []
      });
    } else if (signedArea < 0) {
      holeLoops.push(polygonLoop);
    }
  }
  if (!outerWalls.length) {
    for (const removedLoop of holeLoops.splice(0)) {
      const reversedLoop = [...removedLoop].reverse();
      outerWalls.push({
        loop: reversedLoop,
        area: Math.abs(polygonArea(reversedLoop)),
        holes: []
      });
    }
  }
  for (const holeLoop of holeLoops) {
    const targetRegion = outerWalls.filter(candidateRegion => pointInPolygon(holeLoop[0], candidateRegion.loop, 0.000001)).sort((regionLeft, regionRight) => regionLeft.area - regionRight.area)[0];
    if (targetRegion) {
      targetRegion.holes.push(holeLoop);
    }
  }
  return outerWalls.map(region => {
    const regionPath = polygonCentroid(THREE.Shape, region.loop);
    for (const hole of region.holes) {
      regionPath.holes.push(polygonCentroid(THREE.Path, hole));
    }
    return regionPath;
  });
}
function createGlassPhysicalMaterial(baseColor, opacity, styleOptions = {}) {
  const isOpaque = opacity >= 0.999;
  const alphaWallBand = yt && !isOpaque;
  const material = createWallSideMaterial(THREE, {
    color: baseColor,
    roughness: 0.72,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.82,
    transmission: isOpaque || alphaWallBand ? 0 : 0.012,
    thickness: 0.1,
    ior: 1.22,
    transparent: !isOpaque,
    opacity: opacity,
    depthWrite: styleOptions.depthWrite ?? isOpaque,
    depthFunc: styleOptions.depthFunc ?? (isOpaque ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: styleOptions.polygonOffset === true,
    polygonOffsetFactor: styleOptions.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: styleOptions.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: styleOptions.emissive ?? baseColor,
    emissiveIntensity: styleOptions.emissiveIntensity ?? 0.025
  }, styleOptions.polygonOffset !== true, yt && typeof window < "u" ? new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile : "");
  material.userData.alphaWallBand = alphaWallBand;
  return material;
}
function createInvisibleBasicMaterial() {
  const value = new THREE.MeshBasicMaterial();
  value.visible = false;
  return value;
}
function createFloorStandardMaterial(baseColor, isWallBand, styleOptions = {}) {
  const isOpaque = isWallBand >= 0.999;
  const floorColor = new THREE.Color(styleOptions.topColor ?? baseColor);
  if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("shader") && styleOptions.polygonOffset !== true) {
    floorColor.multiplyScalar(1.2);
  }
  return new THREE.MeshStandardMaterial({
    color: floorColor,
    roughness: 0.76,
    metalness: 0,
    transparent: !isOpaque,
    opacity: styleOptions.topOpacity ?? (isOpaque ? 1 : Math.min(isWallBand * 1.08, 0.42)),
    depthWrite: styleOptions.depthWrite ?? isOpaque,
    depthFunc: styleOptions.depthFunc ?? (isOpaque ? THREE.LessEqualDepth : THREE.LessDepth),
    polygonOffset: styleOptions.polygonOffset === true,
    polygonOffsetFactor: styleOptions.polygonOffsetFactor ?? -2,
    polygonOffsetUnits: styleOptions.polygonOffsetUnits ?? -4,
    side: THREE.DoubleSide,
    emissive: styleOptions.emissive ?? styleOptions.topColor ?? baseColor,
    emissiveIntensity: styleOptions.emissiveIntensity ? styleOptions.emissiveIntensity * 0.3 : 0.08
  });
}
function addWallMeshBatch(shapes, bottomY, topY, color, opacity, light = {}) {
  if (!shapes.length || topY - bottomY <= 0.000001) {
    return;
  }
  const loops = validatedUnionPolygonLoops(shapes, 0.000001);
  const hasLoops = loops.length > 0;
  const splitPolygons = splitFloorPolygonsByHoles(hasLoops ? loops : shapes);
  const materialOptions = !hasLoops && opacity < 0.999 && light.depthWrite === undefined ? {
    ...light,
    depthWrite: true,
    depthFunc: THREE.LessDepth
  } : light;
  for (const polygon of splitPolygons) {
    const geometry = new THREE.ExtrudeGeometry(polygon, {
      depth: topY - bottomY,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1
    });
    setWallGradientHeight(THREE, geometry, "z", topY, -1, floorSceneCurrent.settings.wallHeight);
    if (yt && (new URLSearchParams(window.location.search).get("wall-trial") ?? wallRuntimeProfile).split(",").includes("shader") && light.polygonOffset !== true) {
      const extractedPoints = polygon.extractPoints(1);
      setWallCornerDistances(THREE, geometry, [extractedPoints.shape, ...extractedPoints.holes]);
    }
    const invisibleMaterial = createInvisibleBasicMaterial();
    const glassMaterial = createGlassPhysicalMaterial(color, opacity, materialOptions);
    const wallMesh = new THREE.Mesh(geometry, [invisibleMaterial, glassMaterial]);
    wallMesh.userData.hbMergeWallBand = light.polygonOffset !== true && (light.renderOrder ?? 4) === 4;
    wallMesh.userData.reflectionRole = "wall";
    wallMesh.rotation.x = Math.PI / 2;
    wallMesh.position.y = topY;
    const isOpaque = opacity >= 0.999;
    wallMesh.castShadow = light.castShadow === true;
    if (light.lightOccluder) {
      wallMesh.layers.set(HELPER_LAYER);
    }
    wallMesh.receiveShadow = isOpaque;
    wallMesh.renderOrder = light.renderOrder ?? 4;
    worldGroup.add(wallMesh);
  }
}
function addFloorPolygonMeshes(polygons, baseY, isWallBand, opacity, styleOptions = {}) {
  if (!polygons.length) {
    return;
  }
  const loops = validatedUnionPolygonLoops(polygons, 0.000001);
  const hasLoops = loops.length > 0;
  const splitPolygons = splitFloorPolygonsByHoles(hasLoops ? loops : polygons);
  const materialOptions = !hasLoops && opacity < 0.999 && styleOptions.depthWrite === undefined ? {
    ...styleOptions,
    depthWrite: true,
    depthFunc: THREE.LessDepth
  } : styleOptions;
  for (const polygon of splitPolygons) {
    const geometry = new THREE.ShapeGeometry(polygon, 1);
    const material = createFloorStandardMaterial(isWallBand, opacity, materialOptions);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = baseY + 0.0005;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = styleOptions.renderOrder ?? 4;
    if (isStageEmbed && material.transparent) {
      material.forceSinglePass = true;
    }
    worldGroup.add(mesh);
  }
}
function resolvePlanSnap(polygon, outlineColor, baseHeight) {
  const edgeGeometries = [];
  const glowGeometries = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const pointA = polygon[index];
    const pointB = polygon[(index + 1) % polygon.length];
    const dx = pointB.x - pointA.x;
    const dz = pointB.z - pointA.z;
    const edgeLength = Math.hypot(dx, dz);
    if (edgeLength <= 0.001) {
      continue;
    }
    const midX = (pointA.x + pointB.x) / 2;
    const midZ = (pointA.z + pointB.z) / 2;
    const angle = -Math.atan2(dz, dx);
    const edgeMatrix = new THREE.Matrix4().compose(new THREE.Vector3(midX, baseHeight + 0.021, midZ), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle), new THREE.Vector3(1, 1, 1));
    const glowMatrix = new THREE.Matrix4().compose(new THREE.Vector3(midX, baseHeight + 0.026, midZ), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle), new THREE.Vector3(1, 1, 1));
    edgeGeometries.push(new THREE.BoxGeometry(edgeLength, 0.042, 0.038).applyMatrix4(edgeMatrix));
    glowGeometries.push(new THREE.BoxGeometry(edgeLength + 0.025, 0.066, 0.078).applyMatrix4(glowMatrix));
  }
  const mergedEdges = edgeGeometries.length ? mergeGeometries(edgeGeometries) : null;
  const mergedGlow = glowGeometries.length ? mergeGeometries(glowGeometries) : null;
  edgeGeometries.forEach(edgeGeometry => edgeGeometry.dispose());
  glowGeometries.forEach(glowGeometry => glowGeometry.dispose());
  if (mergedEdges) {
    const edgeMesh = new THREE.Mesh(mergedEdges, new THREE.MeshBasicMaterial({
      color: outlineColor,
      transparent: true,
      opacity: 0.82,
      toneMapped: false
    }));
    edgeMesh.renderOrder = 3;
    edgeMesh.userData.exportRole = "outline";
    edgeMesh.userData.batchedFloorEdgeCount = polygon.length;
    worldGroup.add(edgeMesh);
  }
  if (mergedGlow) {
    const glowMesh = new THREE.Mesh(mergedGlow, new THREE.MeshBasicMaterial({
      color: outlineColor,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    }));
    glowMesh.renderOrder = 2;
    glowMesh.userData.exportRole = "outline";
    glowMesh.userData.batchedFloorEdgeCount = polygon.length;
    worldGroup.add(glowMesh);
  }
}
function splitFloorPolygonsByHolesCurrent(polygon, glowColor, baseY) {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    return;
  }
  const planPoints = polygon.map(planPoint => ({
    x: planPoint.x,
    y: planPoint.z
  }));
  const edgeLengths = planPoints.map((samplePoint, pointIndex) => distance(samplePoint, planPoints[(pointIndex + 1) % planPoints.length]));
  const cumulativeLengths = [0];
  for (const edgeLength of edgeLengths) {
    cumulativeLengths.push(cumulativeLengths.at(-1) + edgeLength);
  }
  const addGlowLayer = ({
    distance: cornerRadius,
    innerAlpha: innerAlpha,
    outerAlpha: outerAlpha,
    columnStrength: columnStrength,
    y: planeY,
    renderOrder
  }) => {
    const insetPoints = addCeilingMeshes(planPoints, cornerRadius);
    const positions = [];
    const glowAlpha = [];
    const glowAcross = [];
    const glowAlong = [];
    for (let vertexIndex = 0; vertexIndex < planPoints.length; vertexIndex += 1) {
      const nextPointIndex = (vertexIndex + 1) % planPoints.length;
      const edgeStartPoint = planPoints[vertexIndex];
      const edgeEndPoint = planPoints[nextPointIndex];
      const insetStartPoint = insetPoints[vertexIndex];
      const insetEndPoint = insetPoints[nextPointIndex];
      positions.push(edgeStartPoint.x, planeY, edgeStartPoint.y, insetStartPoint.x, planeY, insetStartPoint.y, insetEndPoint.x, planeY, insetEndPoint.y, edgeStartPoint.x, planeY, edgeStartPoint.y, insetEndPoint.x, planeY, insetEndPoint.y, edgeEndPoint.x, planeY, edgeEndPoint.y);
      glowAlpha.push(innerAlpha, outerAlpha, outerAlpha, innerAlpha, outerAlpha, innerAlpha);
      glowAcross.push(0, 1, 1, 0, 1, 0);
      const edgeStartLength = cumulativeLengths[vertexIndex];
      const edgeEndLength = cumulativeLengths[vertexIndex + 1];
      glowAlong.push(edgeStartLength, edgeStartLength, edgeEndLength, edgeStartLength, edgeEndLength, edgeEndLength);
    }
    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    glowGeometry.setAttribute("glowAlpha", new THREE.Float32BufferAttribute(glowAlpha, 1));
    glowGeometry.setAttribute("glowAcross", new THREE.Float32BufferAttribute(glowAcross, 1));
    glowGeometry.setAttribute("glowAlong", new THREE.Float32BufferAttribute(glowAlong, 1));
    glowGeometry.computeVertexNormals();
    const glowMesh = new THREE.Mesh(glowGeometry, new THREE.ShaderMaterial({
      uniforms: {
        glowColor: {
          value: new THREE.Color(glowColor)
        },
        glowColumnStrength: {
          value: columnStrength
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
    glowMesh.renderOrder = renderOrder;
    worldGroup.add(glowMesh);
  };
  addGlowLayer({
    distance: 0.24,
    innerAlpha: 0.4,
    outerAlpha: 0.055,
    columnStrength: 0,
    y: baseY + 0.008,
    renderOrder: 3
  });
  addGlowLayer({
    distance: 1.25,
    innerAlpha: 0.3,
    outerAlpha: 0.008,
    columnStrength: 0.82,
    y: baseY + 0.005,
    renderOrder: 2
  });
}
function addCeilingMeshes(points, offset) {
  const center = points.reduce((item, listPoint) => ({
    x: item.x + listPoint.x / points.length,
    y: item.y + listPoint.y / points.length
  }), {
    x: 0,
    y: 0
  });
  return points.map(item => {
    const dx = item.x - center.x;
    const dy = item.y - center.y;
    const distance = Math.max(Math.hypot(dx, dy), 0.000001);
    return {
      x: item.x + dx / distance * offset,
      y: item.y + dy / distance * offset
    };
  });
}
function addCeilingMeshesFromPolygons(polygons, heightOffset) {
  if (!polygons.length) {
    return;
  }
  const centroids = polygons.map(worldPoint => {
    const insetPoints = addCeilingMeshes(worldPoint, 0.028);
    const orientedPoints = polygonArea(insetPoints) >= 0 ? insetPoints : [...insetPoints].reverse();
    return polygonCentroid(THREE.Shape, orientedPoints);
  });
  const shapeGeometries = centroids.map(shapeOutline => {
    const shapeGeometry = new THREE.ShapeGeometry(shapeOutline, 1);
    shapeGeometry.rotateX(Math.PI / 2);
    shapeGeometry.translate(0, heightOffset, 0);
    return shapeGeometry;
  });
  const ceilingGeometry = mergeGeometries(shapeGeometries);
  shapeGeometries.forEach(shape => shape.dispose());
  if (!ceilingGeometry) {
    return;
  }
  const renderOrder = new THREE.Mesh(ceilingGeometry, new THREE.MeshBasicMaterial({
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
  renderOrder.userData.batchedWallContactShadowCount = centroids.length;
  worldGroup.add(renderOrder);
}
function createGroundGridHelper(worldSize, theme, floorY) {
  const ppm = Math.max(Math.round(worldSize / 1.25), 12);
  const gridHelper = new THREE.GridHelper(worldSize, ppm, theme.grid, theme.grid);
  const lookTarget = new THREE.Vector3();
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.24;
  gridHelper.material.depthWrite = false;
  gridHelper.material.toneMapped = false;
  gridHelper.material.onBeforeCompile = shader => {
    shader.uniforms.gridFadeNear = {
      value: worldSize * 0.18
    };
    shader.uniforms.gridFadeFar = {
      value: worldSize * 0.46
    };
    shader.uniforms.gridDepthFadeNear = {
      value: worldSize * 0.18
    };
    shader.uniforms.gridDepthFadeFar = {
      value: worldSize * 0.36
    };
    shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;").replace("#include <project_vertex>", "#include <project_vertex>\nvGridLocalPosition = position.xz;\nvGridViewDepth = max(-mvPosition.z, 0.0);");
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform float gridFadeNear;\nuniform float gridFadeFar;\nuniform float gridDepthFadeNear;\nuniform float gridDepthFadeFar;\nvarying vec2 vGridLocalPosition;\nvarying float vGridViewDepth;").replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse, opacity );\nfloat radialFade = 1.0 - smoothstep(gridFadeNear, gridFadeFar, length(vGridLocalPosition));\nfloat depthFade = 1.0 - smoothstep(gridDepthFadeNear, gridDepthFadeFar, vGridViewDepth);\ndiffuseColor.a *= radialFade * mix(0.28, 1.0, depthFade);");
    gridHelper.material.userData.depthFadeShader = shader;
  };
  gridHelper.onBeforeRender = (renderer, scene, camera) => {
    const depthFadeShader = gridHelper.material.userData.depthFadeShader;
    if (!depthFadeShader) {
      return;
    }
    gridHelper.getWorldPosition(lookTarget);
    const cameraDistance = Math.max(camera.position.distanceTo(orbitControls?.target || lookTarget), 1);
    const viewHeight = camera.isOrthographicCamera ? Math.abs(camera.top - camera.bottom) / Math.max(camera.zoom, 0.001) : cameraDistance * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const fadeExtent = Math.max(Math.hypot(viewHeight * Math.max(camera.aspect, 0.1), viewHeight), 2);
    const depthFadeNear = cameraDistance + fadeExtent * 0.2;
    depthFadeShader.uniforms.gridDepthFadeNear.value = depthFadeNear;
    depthFadeShader.uniforms.gridDepthFadeFar.value = Math.max(depthFadeNear + 1, cameraDistance + fadeExtent * 0.85);
  };
  gridHelper.position.y = floorY + 0.012;
  gridHelper.renderOrder = 2;
  gridHelper.userData.exportRole = "grid";
  worldGroup.add(gridHelper);
}
function setPreviewFloorMode(polygonPoints, baseY, holeLoops = []) {
  if (!Array.isArray(polygonPoints) || polygonPoints.length < 3) {
    return;
  }
  const footprint = polygonPoints.map(polygon => ({
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
  }].forEach((layer, layerIndex) => {
    const glowPoints = addCeilingMeshes(footprint, layer.spread).map(door => ({
      x: door.x + layer.offsetX,
      y: door.y + layer.offsetY
    }));
    const shapeInput = holeLoops.length ? splitFloorPolygonsByHoles(subtractPolygonLoops([glowPoints], holeLoops)) : polygonCentroid(THREE.Shape, glowPoints);
    const shadowMesh = new THREE.Mesh(new THREE.ShapeGeometry(shapeInput, 1), new THREE.MeshBasicMaterial({
      color: 329482,
      transparent: true,
      opacity: layer.opacity,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      forceSinglePass: isStageEmbed
    }));
    shadowMesh.rotation.x = Math.PI / 2;
    shadowMesh.position.y = baseY + 0.001 + layerIndex * 0.00015;
    shadowMesh.userData.floorPlanGroundShadow = true;
    shadowMesh.renderOrder = 1 + layerIndex;
    worldGroup.add(shadowMesh);
  });
}
// Build the world-point -> preview-local (x,z) projector for one floor.
function makePreviewLocalWallPoint(centerX, centerZ, scale) {
  const resolvePreviewLocalPoint = wall => ({
    x: (wall.x - centerX) / scale,
    z: (wall.y - centerZ) / scale
  });
  return resolvePreviewLocalPoint;
}
// Preview-local (x,z) loops of every floor-opening polygon of the active floor.
function collectPreviewFloorOpeningLoops(scale, toLocal) {
  const openingLoops = floorSceneCurrent.items.filter(type => type.type === "flooropening").map(openingPoint => floorOpeningPolygon(openingPoint, scale).map(openingPoint => {
    const localPoint = toLocal(openingPoint);
    return {
      x: localPoint.x,
      y: localPoint.z
    };
  }));
  return openingLoops;
}
// Outline pass for one preview floor polygon: mode plane plus optional edge snap.
function makePreviewFloorOutlinePainter(baseY, themeColors, baseHeight) {
  const paintFloorOutline = floorPolygon => {
    setPreviewFloorMode(floorPolygon, baseY);
    if (floorSceneCurrent.settings.floorEdgeVisible !== false) {
      resolvePlanSnap(floorPolygon, themeColors.floorEdge, baseHeight);
    }
  };
  return paintFloorOutline;
}
// Add one preview floor surface (extruded plan polygon) to the world group.
function makePreviewFloorAppender(material, topY, thickness, openingLoops, drawOutline) {
  const appendFloorSurface = (floorId, geometry, isVertical) => {
    const floorMesh = new THREE.Mesh(geometry, material);
    floorMesh.rotation.x = isVertical ? Math.PI / 2 : 0;
    floorMesh.position.y = isVertical ? topY : topY - thickness / 2;
    floorMesh.castShadow = false;
    floorMesh.receiveShadow = true;
    floorMesh.userData.exportRole = "plan";
    floorMesh.userData.regionReceiverKind = "floor";
    floorMesh.userData.regionFloorId = activeFloorId;
    worldGroup.add(floorMesh);
    if (!openingLoops.length) {
      drawOutline(floorId);
    }
  };
  return appendFloorSurface;
}
// Windows, door leafs and railings of the active floor, with their sill heights.
function collectPreviewWallOpenings() {
  const wallOpenings = [...floorSceneCurrent.windows, ...floorSceneCurrent.doors.map(opening => ({
    ...opening,
    sill: 0
  })), ...floorSceneCurrent.railings.map(railing => {
    const height = floorSceneCurrent.walls.find(sourceWall => sourceWall.id === railing.wallId);
    return {
      ...railing,
      sill: 0,
      height: height?.height || floorSceneCurrent.settings.wallHeight
    };
  })];
  return wallOpenings;
}
// Wall solid segments (shape plus height band) of the active floor, de-duplicated.
function collectPreviewWallSegments(scale, openings, toLocal) {
  const segments = [];
  const seenKeys = new Set();
  const extensions = getWallJoinExtensions(scale);
  for (const opacity of floorSceneCurrent.walls) {
    const wallOpacity = opacity.opacity === null || opacity.opacity === undefined ? floorSceneCurrent.settings.wallOpacity : clamp(finite(opacity.opacity, floorSceneCurrent.settings.wallOpacity), 0, 1);
    for (const bottom of wallSolidPieces(opacity, openings, scale, opacity.height)) {
      const footprint = extrudeWallSegmentShape(opacity, bottom, scale, toLocal, extensions[opacity.id]);
      if (!footprint) {
        continue;
      }
      const segmentKey = [canonicalPolygonKey(footprint, 4), bottom.bottom.toFixed(5), bottom.top.toFixed(5), wallOpacity.toFixed(4)].join("|");
      if (!seenKeys.has(segmentKey)) {
        seenKeys.add(segmentKey);
        segments.push({
          wallId: opacity.id,
          footprint: footprint,
          bottom: bottom.bottom,
          top: bottom.top,
          opacity: wallOpacity
        });
      }
    }
  }
  return segments;
}
// Windows, railings and doors of every wall of the active floor, each anchored on its wall.
function addPreviewWallMeshes(group, toPreviewLocalWallPoint, value, addSharedArchMesh, stairRiserMaterialOptions) {
  for (const start of floorSceneCurrent.walls) {
    const wallDx = start.end.x - start.start.x;
    const wallDy = start.end.y - start.start.y;
    const wallLength = Math.hypot(wallDx, wallDy);
    if (!wallLength) {
      continue;
    }
    const objectValue = {
      x: wallDx / wallLength,
      y: wallDy / wallLength
    };
    const y3 = -Math.atan2(wallDy, wallDx);
    for (const sill of floorSceneCurrent.windows.filter(wallId => wallId.wallId === start.id)) {
      const windowT = clampWindowT(start, sill, group);
      const objectValue = {
        x: start.start.x + wallDx * windowT,
        y: start.start.y + wallDy * windowT
      };
      const windowAnchor = toPreviewLocalWallPoint(objectValue);
      const position = new THREE.Group();
      position.position.set(windowAnchor.x, 0, windowAnchor.z);
      position.rotation.y = y3;
      const min = Math.min(sill.width, wallLengthMeters(start, group));
      const windowHeight = Math.min(sill.height, Math.max(start.height - sill.sill, 0.2));
      const windowParts = windowGeometryParts(min, windowHeight, sill.sill, sill.hasDivider !== false);
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
      const railingT = clampWindowT(start, width, group);
      const objectValue = {
        x: start.start.x + wallDx * railingT,
        y: start.start.y + wallDy * railingT
      };
      const railingAnchor = toPreviewLocalWallPoint(objectValue);
      const position = new THREE.Group();
      position.position.set(railingAnchor.x, 0, railingAnchor.z);
      position.rotation.y = y3;
      const min = Math.min(width.width, wallLengthMeters(start, group));
      const railingHeight = Math.min(width.height, start.height);
      const conditionalValue = isSelected("railing", width.id) ? value.accent : value.frame;
      const barThickness = Math.min(Math.max(min * 0.012, 0.028), 0.05);
      const numericValue = 0.08;
      const max = Math.max(railingHeight - numericValue - barThickness * 1.4, 0.2);
      addSharedArchMesh(position, [[Math.max(min - barThickness * 2.4, 0.2), max, 0.018, 0, numericValue + max * 0.5, 0]], value.glass, {
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
      const barCount = Math.max(2, Math.min(16, Math.ceil(min / 1.5) + 1));
      const push = [[min, barThickness, 0.055, 0, railingHeight, 0]];
      const list = [];
      for (let barIndex = 0; barIndex < barCount; barIndex += 1) {
        const halfValue = -min / 2 + min * barIndex / (barCount - 1);
        push.push([barThickness, railingHeight, 0.055, halfValue, railingHeight * 0.5, 0]);
        list.push([barThickness * 2, barThickness * 0.8, 0.08, halfValue, barThickness * 0.4, 0]);
      }
      addSharedArchMesh(position, push, conditionalValue, options);
      addSharedArchMesh(position, list, value.furnitureSoft, options);
      position.userData.optimizationStats = {
        type: "glass-railing",
        before: 2 + barCount * 2,
        after: 3
      };
      worldGroup.add(position);
    }
    for (const swing of floorSceneCurrent.doors.filter(wallId => wallId.wallId === start.id)) {
      const doorT = clampWindowT(start, swing, group);
      const objectValue = {
        x: start.start.x + wallDx * doorT,
        y: start.start.y + wallDy * doorT
      };
      const doorAnchor = toPreviewLocalWallPoint(objectValue);
      const userData = new THREE.Group();
      userData.position.set(doorAnchor.x, 0, doorAnchor.z);
      userData.rotation.y = y3;
      const min = Math.min(swing.width, wallLengthMeters(start, group));
      const doorHeight = Math.min(swing.height, start.height);
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
      const push = [[numericValue, doorHeight, 0.09, -min / 2, doorHeight / 2, 0], [numericValue, doorHeight, 0.09, min / 2, doorHeight / 2, 0], [min + numericValue, numericValue, 0.09, 0, doorHeight, 0]];
      if (doorType === "roller-shutter") {
        const conditionalValue = swing.swing === -1 ? -1 : 1;
        push.push([min + numericValue * 0.6, numericValue * 1.8, 0.13, 0, doorHeight - numericValue * 0.35, conditionalValue * 0.04]);
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
        const height = Math.max(doorHeight - numericValue * 0.85, 0.4);
        const width = Math.max(min * 0.54, 0.28);
        const count = swing.hinge === "right" ? 1 : -1;
        const doorFlipSign = swing.swing === -1 ? -1 : 1;
        const moving = slidingDoorPanelCenters(min, count);
        stairRiserMaterialOptions(userData, [{
          width,
          height: height,
          centerX: moving.fixed,
          centerZ: -0.024 * doorFlipSign
        }, {
          width,
          height: height,
          centerX: moving.moving,
          centerZ: 0.024 * doorFlipSign
        }], conditionalValue, value.glass);
        const scaledWidth = moving.moving - count * width * 0.36;
        addSharedArchMesh(userData, [[0.026, 0.15, 0.055, scaledWidth, doorHeight * 0.52, -0.052], [0.026, 0.15, 0.055, scaledWidth, doorHeight * 0.52, 0.052]], value.furnitureDark, {
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
        const panelWidth = Math.max(min - numericValue * 1.3, 0.4);
        const max = Math.max(doorHeight - numericValue * 0.85, 0.8);
        const conditionalValue = swing.swing === -1 ? -1 : 1;
        addSharedArchMesh(userData, [[panelWidth, max, 0.045, 0, max * 0.5, conditionalValue * 0.04]], selected ? value.accent : value.furnitureSoft, {
          rounded: false,
          metalness: 0.36,
          roughness: 0.42,
          castShadow: false,
          receiveShadow: false
        });
        const slatCount = Math.max(5, Math.min(36, Math.round(max / 0.12)));
        const push = [];
        for (let slatIndex = 1; slatIndex < slatCount; slatIndex += 1) {
          const slatOffset = max * slatIndex / slatCount;
          push.push([panelWidth * 0.98, 0.012, 0.052, 0, slatOffset, conditionalValue * 0.052]);
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
          before: 5 + slatCount,
          after: 3
        };
        worldGroup.add(userData);
        continue;
      }
      if (doorType === "entry") {
        const leafWidth = Math.max(min - numericValue * 1.5, 0.4);
        const max = Math.max(doorHeight - numericValue * 0.85, 0.8);
        const doorFlipSign = swing.swing === -1 ? -1 : 1;
        const conditionalValue = selected ? value.accent : value.furnitureDark;
        addSharedArchMesh(userData, [[leafWidth, max, 0.065, 0, max * 0.5, 0]], conditionalValue, {
          rounded: false,
          roughness: 0.58,
          metalness: 0.1,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData, [[leafWidth * 0.76, 0.022, 0.078, 0, doorHeight * 0.68, 0.012 * doorFlipSign], [leafWidth * 0.76, 0.022, 0.078, 0, doorHeight * 0.34, 0.012 * doorFlipSign]], value.furnitureSoft, {
          rounded: false,
          roughness: 0.5,
          castShadow: false,
          receiveShadow: false
        });
        const conditionalValueCurrent = swing.hinge === "right" ? -leafWidth * 0.34 : leafWidth * 0.34;
        addSharedArchMesh(userData, [[0.035, 0.18, 0.085, conditionalValueCurrent, doorHeight * 0.5, 0.055 * doorFlipSign]], value.furnitureLight, {
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
        const height = Math.max(doorHeight - numericValue * 0.8, 0.4);
        const leafAngle = (swing.swing === -1 ? 1 : -1) * Math.PI * 0.42;
        const leafSlabs = [];
        const handleBars = [];
        for (const side of [-1, 1]) {
          const offsetX = side * (min / 2 - numericValue * 0.5);
          const leafRotation = side < 0 ? leafAngle : -leafAngle;
          const hingeOffset = side < 0 ? width / 2 : -width / 2;
          const leafPos = {
            x: offsetX + hingeOffset * Math.cos(leafRotation),
            z: -hingeOffset * Math.sin(leafRotation)
          };
          leafSlabs.push({
            width: width,
            height: height,
            depth: 0.04,
            x: leafPos.x,
            y: height / 2,
            z: leafPos.z,
            leafRotation
          });
          const handleOffset = side < 0 ? width * 0.42 : -width * 0.42;
          handleBars.push({
            width: 0.035,
            height: 0.055,
            depth: 0.065,
            x: offsetX + handleOffset * Math.cos(leafRotation) + Math.sin(leafRotation) * 0.04,
            y: doorHeight * 0.5,
            z: -value * Math.sin(leafRotation) + Math.cos(leafRotation) * 0.04,
            leafRotation
          });
        }
        addSharedArchMesh(userData, leafSlabs, selected ? value.accent : value.doorLeaf, {
          rounded: false,
          roughness: 0.66,
          castShadow: false,
          receiveShadow: false
        });
        addSharedArchMesh(userData, handleBars, value.furnitureDark, {
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
      const height = Math.max(doorHeight - numericValue * 0.8, 0.4);
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
      addSharedArchMesh(position, [[0.035, 0.055, 0.065, conditionalValueCurrent, doorHeight * 0.5, 0.04]], value.furnitureDark, {
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
}
// Furniture of the active floor: mesh group, environment tagging and static-instance collection.
function addPreviewItemMeshes(toPreviewLocalWallPoint, shadowLightIdSet, staticItems) {
  for (const type of floorSceneCurrent.items) {
    const anchorPoint = toPreviewLocalWallPoint(type);
    if (type.type === "flooropening") {
      continue;
    }
    const userData = buildStudioItemMeshGroup(type, shadowLightIdSet);
    if (yt && type.type === "smallcar") {
      userData.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(type.type)) {
      userData.userData.environmentModelId = type.id;
      userData.userData.environmentModelType = type.type;
      userData.userData.environmentFloorId = activeFloorId;
    }
    userData.position.set(anchorPoint.x, type.elevation || 0, anchorPoint.z);
    instanceMergeIdenticalItems(userData, type);
    userData.userData.modelLayer = set.has(type.type) ? "lights" : "items";
    userData.userData.exportRole = type.type === "planlabel" ? "label" : "plan";
    worldGroup.add(userData);
    if (!set.has(type.type)) {
      staticItems.push({
        item: type,
        group: userData
      });
    }
  }
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
  const toPreviewLocalWallPoint = makePreviewLocalWallPoint(previewFloorCenterX, item, group);
  const planWidth = Math.max(previewFloorWorldBounds.width / group + 1, 3);
  const max = Math.max(previewFloorWorldBounds.height / group + 1, 3);
  const groundY = -0.008;
  const depth = 0.16;
  const floorSurfaceY = groundY - depth;
  const backgroundY = floorSurfaceY - 0.035;
  const groundPlaneSize = Math.max(Math.max(planWidth, max) * 16, 260);
  const backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(groundPlaneSize, groundPlaneSize), new THREE.MeshBasicMaterial({
    color: value.ground,
    toneMapped: false
  }));
  backgroundPlane.rotation.x = -Math.PI / 2;
  backgroundPlane.position.y = backgroundY;
  backgroundPlane.receiveShadow = false;
  backgroundPlane.userData.exportRole = "background";
  worldGroup.add(backgroundPlane);
  createGroundGridHelper(groundPlaneSize, value, backgroundY);
  const dispose = new THREE.MeshStandardMaterial({
    color: value.floor,
    roughness: 0.96,
    metalness: 0,
    emissive: value.floor,
    emissiveIntensity: 0.025
  });
  const length = getFloorPolygons(group);
  const mapped = collectPreviewFloorOpeningLoops(group, toPreviewLocalWallPoint);
  const paintFloorOutline = makePreviewFloorOutlinePainter(backgroundY, value, floorSurfaceY);
  const callback = makePreviewFloorAppender(dispose, groundY, depth, mapped, paintFloorOutline);
  if (mapped.length) {
    const conditionalValue = length.length ? length.map(footprint => footprint.map(outlinePoint => {
      const localPoint = toPreviewLocalWallPoint(outlinePoint);
      return {
        x: localPoint.x,
        y: localPoint.z
      };
    })) : [[{
      x: -planWidth / 2,
      y: -max / 2
    }, {
      x: planWidth / 2,
      y: -max / 2
    }, {
      x: planWidth / 2,
      y: max / 2
    }, {
      x: -planWidth / 2,
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
    for (const map of filter.filter(polygon => polygonArea(polygon) > 0)) {
      const outlinePoints = map.map(footprint => ({
        x: footprint.x,
        z: footprint.y
      }));
      setPreviewFloorMode(outlinePoints, backgroundY, mapped);
      if (floorSceneCurrent.settings.floorEdgeVisible !== false) {
        resolvePlanSnap(outlinePoints, value.floorEdge, floorSurfaceY);
      }
    }
  } else if (length.length) {
    const map = length.map(map => map.map(toPreviewLocalWallPoint));
    const floorShapes = map.map(forEachItem => {
      const moveTo = new THREE.Shape();
      forEachItem.forEach((floor, pointIndex) => {
        if (pointIndex === 0) {
          moveTo.moveTo(floor.x, floor.z);
        } else {
          moveTo.lineTo(floor.x, floor.z);
        }
      });
      moveTo.closePath();
      return moveTo;
    });
    callback(map[0], new THREE.ExtrudeGeometry(floorShapes, {
      depth,
      bevelEnabled: false,
      steps: 1
    }), true);
    for (const floorShape of map.slice(1)) {
      paintFloorOutline(floorShape);
    }
  } else {
    const arrayValue = [{
      x: -planWidth / 2,
      z: -max / 2
    }, {
      x: planWidth / 2,
      z: -max / 2
    }, {
      x: planWidth / 2,
      z: max / 2
    }, {
      x: -planWidth / 2,
      z: max / 2
    }];
    callback(arrayValue, new THREE.BoxGeometry(planWidth, depth, max), false);
  }
  const arrayValue = collectPreviewWallOpenings();
  const filter = collectPreviewWallSegments(group, arrayValue, toPreviewLocalWallPoint);
  const sorted = [...new Set(filter.flatMap(bottom => [bottom.bottom, bottom.top]).map(toFixed => toFixed.toFixed(6)))].map(Number).sort((leftHeight, rightHeight) => leftHeight - rightHeight);
  addCeilingMeshesFromPolygons(filter.filter(bottom => bottom.bottom <= 0.000001).map(footprint => footprint.footprint), groundY + 0.0025);
  for (let bandIndex = 0; bandIndex < sorted.length - 1; bandIndex += 1) {
    const bottomHeight = sorted[bandIndex];
    const topHeight = sorted[bandIndex + 1];
    if (topHeight - bottomHeight <= 0.000001) {
      continue;
    }
    const midHeight = (bottomHeight + topHeight) / 2;
    const coveringSegments = filter.filter(wallSegment => midHeight > wallSegment.bottom - 0.000001 && midHeight < wallSegment.top + 0.000001);
    const byOpacity = new Map();
    for (const opacityEntry of coveringSegments) {
      const opacityKey = opacityEntry.opacity.toFixed(4);
      if (!byOpacity.has(opacityKey)) {
        byOpacity.set(opacityKey, {
          opacity: opacityEntry.opacity,
          volumes: []
        });
      }
      byOpacity.get(opacityKey).volumes.push(opacityEntry);
    }
    for (const opacityGroup of byOpacity.values()) {
      addWallMeshBatch(opacityGroup.volumes.map(footprint => footprint.footprint), bottomHeight, topHeight, value.wall, opacityGroup.opacity, {
        castShadow: true,
        lightOccluder: true
      });
      const mapped = opacityGroup.volumes.filter(item => Math.abs(item.top - topHeight) <= 0.000001).map(footprint => footprint.footprint);
      addFloorPolygonMeshes(mapped, topHeight, value.wall, opacityGroup.opacity, {
        topColor: value.wall
      });
    }
    const length = coveringSegments.filter(wallId => isSelected("wall", wallId.wallId)).map(footprint => footprint.footprint);
    if (length.length) {
      addWallMeshBatch(length, bottomHeight, topHeight, value.accent, 0.28, {
        depthWrite: false,
        depthFunc: THREE.LessEqualDepth,
        polygonOffset: true,
        emissive: value.accent,
        emissiveIntensity: 0.12,
        renderOrder: 5
      });
      const mapped = coveringSegments.filter(wallId => isSelected("wall", wallId.wallId) && Math.abs(wallId.top - topHeight) <= 0.000001).map(footprint => footprint.footprint);
      addFloorPolygonMeshes(mapped, topHeight, value.accent, 0.28, {
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
  addPreviewWallMeshes(group, toPreviewLocalWallPoint, value, addSharedArchMesh, stairRiserMaterialOptions);
  const shadowCasterIds = shadowCastingLightIdSet();
  const push = [];
  addPreviewItemMeshes(toPreviewLocalWallPoint, shadowCasterIds, push);
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
  window.__rwpProbe = (() => {
    const fingerprint = source => {
      let seed = 2166136261;
      for (let index = 0; index < source.length; index += 1) {
        seed ^= source.charCodeAt(index);
        seed = Math.imul(seed, 16777619);
      }
      return (seed >>> 0).toString(16);
    };
    const parts = [];
    let nan = 0;
    worldGroup.traverse(object => {
      if (!object.isMesh) {
        return;
      }
      const position = object.geometry?.attributes?.position;
      parts.push(object.userData.exportRole || "", object.userData.regionReceiverKind || "", String(position ? position.count : -1));
      if (position) {
        const array = position.array;
        let total = 0;
        for (let index = 0; index < array.length; index += 1) {
          if (!Number.isFinite(array[index])) {
            nan += 1;
          }
        }
        for (let index = 0; index < array.length; index += 7) {
          total += array[index];
        }
        parts.push(total.toFixed(3));
      }
      parts.push(object.position.x.toFixed(4), object.position.y.toFixed(4), object.position.z.toFixed(4));
      parts.push(object.rotation.x.toFixed(4), object.rotation.y.toFixed(4), object.rotation.z.toFixed(4));
      parts.push(object.scale.x.toFixed(4), object.scale.y.toFixed(4), object.scale.z.toFixed(4));
    });
    return {
      n: ((window.__rwpProbe && window.__rwpProbe.n) || 0) + 1,
      loops: length.length,
      openings: mapped.length,
      worldChildren: worldGroup.children.length,
      parts: parts.length,
      nan,
      hash: fingerprint(parts.join("|"))
    };
  })();
}
function getPreviewFloorModeCurrent() {
  if (projectDocCurrent?.previewFloorMode === "all" && projectDocCurrent.floors.length > 1) {
    return "all";
  } else {
    return "active";
  }
}
function syncPreviewFloorButtons() {
  const previewFloorMode = getPreviewFloorModeCurrent();
  const showFloorToggle = (projectDocCurrent?.floors.length || 0) > 1;
  for (const button of r0) {
    const isActive = button.dataset.previewFloor === previewFloorMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.disabled = button.dataset.previewFloor === "all" && !showFloorToggle;
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
  someVar.forEach((wall, wallIndex) => {
    const wallGroup = new THREE.Group();
    wallGroup.name = "floor-" + wall.id;
    wallGroup.userData.floorId = wall.id;
    worldGroup = wallGroup;
    floorSceneCurrent = wall.scene;
    activeFloorId = wall.id;
    Lo = {
      x: finite(wall.originX, 0),
      y: finite(wall.originY, 0)
    };
    rebuildWorldPreview({
      preserveLightCache: preserveLightCache
    });
    if (wallIndex > 0) {
      for (const userData of [...wallGroup.children]) {
        if (["background", "grid"].includes(userData.userData?.exportRole)) {
          if (isStageEmbed) {
            userData.userData.floorBackgroundHidden = true;
            userData.visible = false;
            continue;
          }
          wallGroup.remove(userData);
          disposeObject3dResources(userData);
        }
      }
    }
    wallGroup.position.set(finite(wall.offsetX, 0), wallIndex * conditionalValue, finite(wall.offsetZ, 0));
    wallGroup.rotation.y = -THREE.MathUtils.degToRad(finite(wall.rotation, 0));
    object3d.add(wallGroup);
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
function removeWorldModelLayer(removedFloorIds) {
  if (!removedFloorIds.size || !worldGroup) {
    return;
  }
  if (getPreviewFloorModeCurrent() !== "all") {
    if (removedFloorIds.has(activeFloorId)) {
      rebuildWorldPreviewCurrent();
    }
    return;
  }
  const rootGroup = worldGroup;
  const savedScene = floorSceneCurrent;
  const savedFloorId = activeFloorId;
  const savedPlanOrigin = Lo;
  const floorsByElevation = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation);
  if (floorsByElevation.some(kind => !rootGroup.children.some(layer => layer.userData?.floorId === kind.id))) {
    rebuildWorldPreviewCurrent();
    return;
  }
  try {
    for (const [floorIndex, floorRecord] of floorsByElevation.entries()) {
      if (removedFloorIds.has(floorRecord.id) && (worldGroup = rootGroup.children.find(foundLayer => foundLayer.userData?.floorId === floorRecord.id), floorSceneCurrent = floorRecord.scene, activeFloorId = floorRecord.id, Lo = {
        x: finite(floorRecord.originX, 0),
        y: finite(floorRecord.originY, 0)
      }, worldGroup.position.set(finite(floorRecord.offsetX, 0), floorIndex * projectDocCurrent.previewFloorGap, finite(floorRecord.offsetZ, 0)), worldGroup.rotation.set(0, -THREE.MathUtils.degToRad(finite(floorRecord.rotation, 0)), 0), worldGroup.scale.set(1, 1, 1), rebuildWorldPreview(), floorIndex > 0)) {
        for (const child of [...worldGroup.children]) {
          if (["background", "grid"].includes(child.userData?.exportRole)) {
            if (isStageEmbed) {
              child.userData.floorBackgroundHidden = true;
              child.visible = false;
              continue;
            }
            worldGroup.remove(child);
            disposeObject3dResources(child);
          }
        }
      }
    }
  } finally {
    worldGroup = rootGroup;
    floorSceneCurrent = savedScene;
    activeFloorId = savedFloorId;
    Lo = savedPlanOrigin;
  }
  syncSpotShadowCastingLights(rootGroup);
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
function rebuildPreviewItemMeshes(modelLayer) {
  if (worldGroup) {
    for (const child of [...worldGroup.children]) {
      if (child.userData.modelLayer === modelLayer) {
        worldGroup.remove(child);
        disposeObject3dResources(child);
      }
    }
  }
}
function rebuildPreviewAfterPlanChange(scope, {
  preserveLightCache: preserveLightCache = false
} = {}) {
  if (!worldGroup) {
    return;
  }
  const planToWorld = flushPlanPanFrame();
  if (!planToWorld) {
    return;
  }
  rebuildPreviewItemMeshes(scope);
  const lightsOnly = scope === "lights";
  const shadowLightIds = lightsOnly ? shadowCastingLightIdSet() : null;
  const staticBatches = [];
  for (const item of floorSceneCurrent.items) {
    if (set.has(item.type) !== lightsOnly) {
      continue;
    }
    const worldPosition = planToWorld.toWorld(item);
    if (item.type === "flooropening") {
      continue;
    }
    const meshGroup = buildStudioItemMeshGroup(item, shadowLightIds);
    if (yt && item.type === "smallcar") {
      meshGroup.userData.preserveDetailedSurface = true;
    }
    if (isStageEmbed && ["wallac", "floorac", "airoutlet", "curtain", "nas", "camera", "presence", "tv", "robotvacuum"].includes(item.type)) {
      meshGroup.userData.environmentModelId = item.id;
      meshGroup.userData.environmentModelType = item.type;
      meshGroup.userData.environmentFloorId = activeFloorId;
    }
    meshGroup.position.set(worldPosition.x, item.elevation || 0, worldPosition.z);
    instanceMergeIdenticalItems(meshGroup, item);
    meshGroup.userData.modelLayer = scope;
    worldGroup.add(meshGroup);
    if (!lightsOnly) {
      staticBatches.push({
        item: item,
        group: meshGroup
      });
    }
  }
  if (!lightsOnly) {
    mergeStaticItemInstanceBatches(worldGroup, staticBatches);
    if (isStageEmbed && new URLSearchParams(window.location.search).get("furniture-runtime") === "compact") {
      compactRuntimeFurniture(worldGroup, staticBatches.filter(({
        item: selectedItem
      }) => !isSelected("item", selectedItem.id)), {
        THREE,
        mergeGeometries,
        materialKey: createGlassMaterial
      });
    }
    buildCanvasPathFromPoints(worldGroup, staticBatches);
  }
  syncSpotShadowCastingLights(worldGroup, {
    rebuildAtlas: !preserveLightCache
  });
  if (isStageEmbed) {
    cacheObjectTransforms(worldGroup, THREE.Object3D);
  }
  if (lightsOnly) {
    syncOrbitControls();
  }
  requestRender({
    shadows: !lightsOnly && !preserveLightCache,
    preserveLightCache: preserveLightCache
  });
}
function rebuildPreviewLightMeshes(preserveLightCache = {}) {
  rebuildPreviewAfterPlanChange("items", preserveLightCache);
}
function rebuildPreviewLightMeshesCurrent(options = {}) {
  rebuildPreviewAfterPlanChange("lights", options);
}
function applyCameraView(startNode, modelLayers) {
  for (let parent = startNode; parent && parent !== worldGroup; parent = parent.parent) {
    if (modelLayers.has(parent.userData?.modelLayer)) {
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
  const wallSnapBounds = isWallCloseSnap();
  if (wallSnapBounds.isEmpty()) {
    return false;
  }
  worldGroup.updateWorldMatrix(true, true);
  previewSpotLight.updateWorldMatrix(true, false);
  previewSpotLight.target.updateWorldMatrix(true, false);
  const shadowCamera = previewSpotLight.shadow.camera;
  const lightWorldPos = new THREE.Vector3().setFromMatrixPosition(previewSpotLight.matrixWorld);
  const position = new THREE.Vector3().setFromMatrixPosition(previewSpotLight.target.matrixWorld);
  shadowCamera.position.copy(lightWorldPos);
  shadowCamera.lookAt(position);
  shadowCamera.updateMatrixWorld(true);
  const boundsMin = new THREE.Vector3(Infinity, Infinity, Infinity);
  const boundsMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const cornerX of [wallSnapBounds.min.x, wallSnapBounds.max.x]) {
    for (const cornerY of [wallSnapBounds.min.y, wallSnapBounds.max.y]) {
      for (const cornerZ of [wallSnapBounds.min.z, wallSnapBounds.max.z]) {
        const matrix = new THREE.Vector3(cornerX, cornerZ, cornerZ).applyMatrix4(shadowCamera.matrixWorldInverse);
        boundsMin.min(matrix);
        boundsMax.max(matrix);
      }
    }
  }
  const max = Math.max(boundsMax.x - boundsMin.x, boundsMax.y - boundsMin.y, 1);
  const padding = Math.max(sofaGeometryCache, max * 0.05);
  const z = -boundsMax.z;
  const nearZ = -boundsMin.z;
  const depthPadding = Math.max(sofaGeometryCache, (nearZ - z) * 0.08);
  shadowCamera.left = boundsMin.x - padding;
  shadowCamera.right = boundsMax.x + padding;
  shadowCamera.bottom = boundsMin.y - padding;
  shadowCamera.top = boundsMax.y + padding;
  shadowCamera.near = Math.max(0.1, z - depthPadding);
  shadowCamera.far = Math.max(shadowCamera.near + 1, nearZ + depthPadding);
  shadowCamera.updateProjectionMatrix();
  previewSpotLight.shadow.needsUpdate = true;
  return true;
}
function applyCameraViewCurrent(forceOrthogonalAxis = {}) {
  if (!cameraCurrent || !orbitControls) {
    return;
  }
  const cameraView = forceOrthogonalAxis.view === "top" ? "top" : forceOrthogonalAxis.view === "free" ? "free" : cameraViewMode();
  const currentTopViewRotation = topViewRotation();
  const showsAllFloors = getPreviewFloorModeCurrent() === "all";
  const pixelsPerMeterValue = pixelsPerMeter() || 100;
  const width = getPreviewFloorMode();
  const wallSnap = isWallCloseSnap({
    excludeModelLayers: new Set(["items", "lights"])
  });
  const allFloorsSize = showsAllFloors && !wallSnap.isEmpty() ? wallSnap.getSize(new THREE.Vector3()) : null;
  const allFloorsCenter = wallSnap.isEmpty() ? null : wallSnap.getCenter(new THREE.Vector3());
  const frameExtent = showsAllFloors && allFloorsSize ? clamp(Math.max(allFloorsSize.x, allFloorsSize.z), 5, 100) : clamp(Math.max(width.width, width.height) / pixelsPerMeterValue, 5, 35);
  const wallTopHeight = showsAllFloors && allFloorsSize ? allFloorsSize.y : Math.max(0, ...floorSceneCurrent.walls.map(height => height.height || 0));
  const frameSize = Math.max(frameExtent * 1.18, frameExtent + wallTopHeight * 0.32);
  cameraCurrent.userData.frameSize = frameSize;
  cameraCurrent.userData.cameraView = cameraView;
  cameraCurrent.userData.topRotation = currentTopViewRotation;
  const focusPoint = allFloorsCenter ? new THREE.Vector3(allFloorsCenter.x, allFloorsCenter.y, allFloorsCenter.z) : new THREE.Vector3(0, Math.min(0.78, frameExtent * 0.055), 0);
  let cameraDistance;
  if (cameraCurrent.isPerspectiveCamera) {
    cameraCurrent.aspect = cameraCurrent.userData.viewportAspect || 1;
    applyCameraFocalLength();
    const axisLockedPoint = frameSize / (Math.tan(THREE.MathUtils.degToRad(cameraCurrent.getEffectiveFOV()) / 2) * 2);
    cameraDistance = Math.max(axisLockedPoint * 1.04, frameExtent * 1.65, 8);
  } else {
    focusCameraOnPoint(frameSize, cameraCurrent.userData.viewportAspect || 1);
    cameraDistance = Math.max(frameExtent * 3.2, 18);
  }
  if (cameraView === "top") {
    cameraCurrent.up.copy(topViewForwardVector(currentTopViewRotation));
    cameraCurrent.position.set(focusPoint.x, focusPoint.y + cameraDistance, focusPoint.z);
  } else {
    cameraCurrent.up.set(0, 1, 0);
    const normalize = new THREE.Vector3(1.08, 1.7, 1.12).normalize();
    cameraCurrent.position.copy(focusPoint).addScaledVector(normalize, cameraDistance);
  }
  getCameraPose(cameraCurrent, focusPoint);
  cameraCurrent.zoom = 1;
  cameraCurrent.lookAt(focusPoint);
  cameraCurrent.updateProjectionMatrix();
  orbitControls.target.copy(focusPoint);
  syncOrbitControls();
  orbitControls.update();
}
function onPlanPointerMove(event, anchor, forceOrthogonalAxis = false) {
  const scalePixels = pixelsPerMeter() || 100;
  if (!isSnapActive()) {
    if (forceOrthogonalAxis && anchor) {
      const axisPoint = axisLockedPoint(event, anchor);
      return {
        ...axisPoint,
        kind: "axis",
        distance: distance(event, axisPoint.point)
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
  const snapSettings = floorSceneCurrent.settings;
  return snapPoint(event, floorSceneCurrent.walls, {
    zoom: planView.zoom,
    screenTolerance: clamp(Math.round(finite(snapSettings.snapTolerance, 13)), 6, 24),
    anchor,
    forceOrthogonalAxis,
    preferVerticalAxis: snapSettings.snapOrthogonal !== false,
    angleStepDegrees: 15,
    gridSize: scalePixels * 0.1,
    intersections: snapSettings.snapIntersections === false ? [] : getWallIntersections(scalePixels),
    snapEndpoints: snapSettings.snapEndpoints !== false,
    snapIntersections: snapSettings.snapIntersections !== false,
    snapSegments: snapSettings.snapSegments !== false,
    snapOrthogonal: snapSettings.snapOrthogonal !== false,
    snapAngles: snapSettings.snapAngles !== false,
    snapGrid: snapSettings.snapGrid !== false
  });
}
function onPlanPointerDown(point = at) {
  if (!railingPlacementPreview || Ar < 2 || !point?.point) {
    return false;
  }
  const visibleScreen = Math.max(1, (pixelsPerMeter() || 100) * 0.01);
  return point.kind === "endpoint" && distance(point.point, railingPlacementPreview) <= visibleScreen;
}
function updatePlanStatusChrome(allowSnap = zr) {
  if (!Fi) {
    return;
  }
  no = {
    ...Fi
  };
  const scalePixels = pixelsPerMeter() || 100;
  const snapOffLabel = Or ? "吸附：临时关闭" : "吸附：关闭";
  if (activeTool === "scale" && wallDrawAnchorCurrent && allowSnap) {
    const axisPoint = axisLockedPoint(Fi, wallDrawAnchorCurrent);
    no = axisPoint.point;
    at = null;
    No.textContent = "吸附：" + axisPoint.label;
  } else if (activeTool === "scale") {
    at = null;
    No.textContent = "吸附：自由";
  }
  referencePixels.textContent = "X " + (no.x / scalePixels).toFixed(2) + " m · Y " + (no.y / scalePixels).toFixed(2) + " m";
  if (activeTool === "wall") {
    at = onPlanPointerMove(Fi, Tt, allowSnap);
    No.textContent = onPlanPointerDown(at) ? "闭合：点击闭合空间" : at.kind ? (!isSnapActive() && allowSnap ? "锁定" : "吸附") + "：" + at.label : isSnapActive() ? "吸附：自由" : snapOffLabel;
  } else if (["window", "door", "railing"].includes(activeTool)) {
    const hitWall = nearestWall(no, floorSceneCurrent.walls, 16 / planView.zoom);
    if (hitWall) {
      const openingWidth = yo[wallDrawAnchor] || yo.solid;
      const openingSpec = {
        width: activeTool === "door" ? openingWidth.width : activeTool === "railing" ? 2 : 1.4,
        t: hitWall.t
      };
      const placementPreview = {
        wall: hitWall.wall,
        t: clampWindowT(hitWall.wall, openingSpec, scalePixels)
      };
      Uo = activeTool === "window" ? placementPreview : null;
      railingPlacementPreviewCurrent = activeTool === "door" ? placementPreview : null;
      Ko = activeTool === "railing" ? placementPreview : null;
      No.textContent = activeTool === "door" ? "吸附：墙体门洞" : activeTool === "railing" ? "吸附：墙体栏杆" : "吸附：墙体";
    } else {
      Uo = null;
      railingPlacementPreviewCurrent = null;
      Ko = null;
      No.textContent = "吸附：未找到墙体";
    }
  } else if (activeTool === "pan") {
    at = null;
    Uo = null;
    railingPlacementPreviewCurrent = null;
    Ko = null;
    No.textContent = isSnapActive() ? "吸附：开启" : snapOffLabel;
    element.style.cursor = "";
  } else if (activeTool !== "scale") {
    at = null;
    Uo = null;
    railingPlacementPreviewCurrent = null;
    Ko = null;
    No.textContent = isSnapActive() ? "吸附：开启" : snapOffLabel;
    const dragTarget = beginItemDrag(no);
    element.style.cursor = dragTarget?.type === "rotate-item" ? "grab" : dragTarget?.type === "resize-item" ? "nwse-resize" : "";
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
  if (pointerId.button === 1 || saveConflictState || activeTool === "pan") {
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
    const wallsChanged = length.length !== 1 || distance(length[0].start, options.start) > pixelsPerMeterValue || distance(length[0].end, options.end) > pixelsPerMeterValue;
    pushHistory();
    const max = Math.max(1, pixelsPerMeter() * 0.01);
    const lengthValue = closedWallPolygons(floorSceneCurrent.walls, max).length;
    const newWalls = length.map((start, wallIndex) => ({
      ...options,
      id: wallIndex === 0 ? options.id : makeId("wall"),
      start: start.start,
      end: start.end
    }));
    floorSceneCurrent.walls.push(...newWalls);
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
    setSelection("wall", newWalls[0].id);
    yr.hidden = element;
    refreshViews();
    scheduleSave();
    if (element) {
      showToast("空间已闭合，地面已生成。可继续绘制下一个空间。", "success");
    } else if (wallsChanged) {
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
  const lightGroupFilter = activeSelectionLightGroupFilter();
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
      rebuildPreviewForAssetFilters(lightGroupFilter);
    }
    element.setPointerCapture(pointerId.pointerId);
    return;
  }
  markLeavingStudio();
  const before = kind.kind === "item" ? cloneFloorScene() : null;
  const isSelectedSceneItem = kind.kind === "item" && multiSelection.length > 0 && isSelected("item", kind.id);
  let map = [];
  let copied = false;
  if (kind.kind === "item") {
    if (isSelectedSceneItem) {
      const has = new Set(multiSelection.filter(kind => kind.kind === "item").map(named => named.id));
      map = floorSceneCurrent.items.filter(item => has.has(item.id));
    } else {
      setSelection("item", kind.id);
      const matchedItem = floorSceneCurrent.items.find(item => item.id === kind.id);
      if (matchedItem) {
        map = [matchedItem];
      }
    }
    if (pointerId.altKey && map.length) {
      const clonedItems = map.map(sceneItem => ({
        ...structuredClone(sceneItem),
        id: makeId("item")
      }));
      ensureItemLayerNames(clonedItems);
      floorSceneCurrent.items.push(...clonedItems);
      map = clonedItems;
      if (clonedItems.length === 1) {
        setSelection("item", clonedItems[0].id);
      } else {
        selection = null;
        multiSelection = clonedItems.map(event => ({
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
  rebuildPreviewForAssetFilters(lightGroupFilter);
  const category = activeSelectionAssetCategory();
  const previewScope = lightGroupFilter === category ? category : "all";
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
  const canvasPoint = pointerEventToCanvasPoint(event);
  const planPoint = screenToPlanWithView(canvasPoint);
  if (dragState?.pointerId === event.pointerId) {
    if (dragState.type === "draw-flooropening") {
      dragState.current = event.shiftKey ? (() => {
        const deltaX = planPoint.x - dragState.start.x;
        const value = planPoint.y - dragState.start.y;
        const dragExtent = Math.max(Math.abs(deltaX), Math.abs(value));
        return {
          x: dragState.start.x + Math.sign(deltaX || 1) * dragExtent,
          y: dragState.start.y + Math.sign(value || 1) * dragExtent
        };
      })() : planPoint;
      drawPlan();
      return;
    }
    if (dragState.type === "marquee") {
      dragState.current = planPoint;
      dragState.moved = distance(dragState.start, planPoint) * planView.zoom >= 4;
      if (blitMeasureOverlay()) {
        drawMarqueeSelection();
      } else {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "pan") {
      const panPoint = screenToPlan(canvasPoint);
      planView.offsetX = dragState.offsetX + panPoint.x - dragState.screen.x;
      planView.offsetY = dragState.offsetY + panPoint.y - dragState.screen.y;
      const offsetX = canvasPoint.x - dragState.visibleScreen.x;
      const offsetY = canvasPoint.y - dragState.visibleScreen.y;
      if (!blitMeasureOverlay({
        offsetX,
        offsetY
      })) {
        drawPlan();
      }
      return;
    }
    if (dragState.type === "move-items") {
      if (!dragState.moved && distance(planPoint, dragState.start) * planView.zoom < 3) {
        return;
      }
      const snapStep = pixelsPerMeter() * 0.05;
      const snapToGrid = isSnapActive() && floorSceneCurrent.settings.snapGrid !== false;
      let value = planPoint.x - dragState.start.x;
      let dragDeltaY = planPoint.y - dragState.start.y;
      if (event.shiftKey) {
        if (Math.abs(value) >= Math.abs(dragDeltaY)) {
          dragDeltaY = 0;
        } else {
          value = 0;
        }
      }
      const items = new Map(floorSceneCurrent.items.map(itemKey => [itemKey.id, itemKey]));
      for (const originalSnapshot of dragState.originals) {
        const targetCandidate = items.get(originalSnapshot.id);
        if (targetCandidate) {
          targetCandidate.x = snapToGrid ? Math.round((originalSnapshot.x + value) / snapStep) * snapStep : originalSnapshot.x + value;
          targetCandidate.y = snapToGrid ? Math.round((originalSnapshot.y + dragDeltaY) / snapStep) * snapStep : originalSnapshot.y + dragDeltaY;
        }
      }
      dragState.moved = dragState.originals.some(event => {
        const candidate = items.get(event.id);
        return candidate && (Math.abs(candidate.x - event.x) > 0.000001 || Math.abs(candidate.y - event.y) > 0.000001);
      });
      drawPlan();
      return;
    }
    if (dragState.type === "resize-item") {
      if (!dragState.moved && distance(planPoint, dragState.handle) * planView.zoom < 3) {
        return;
      }
      const resizeTarget = selectedEntity();
      if (!resizeTarget) {
        return;
      }
      // A lying pillar resizes against its plan footprint (width x length), so run the resize against
      // that footprint and fold the length back onto item.height.
      const resizeSource = itemWithPlanFootprint(dragState.originalItem);
      const baseHeight = Math.max(finite(resizeSource.height, 0.05), 0.001);
      const conditionalValue = event.shiftKey ? {
        minimum: Math.max(0.1 / Math.max(resizeSource.width, 0.1), 0.1 / Math.max(resizeSource.depth, 0.1), itemMinimumHeight(resizeSource.type) / baseHeight),
        maximum: Math.min(8 / Math.max(resizeSource.width, 0.1), 8 / Math.max(resizeSource.depth, 0.1), 6 / baseHeight)
      } : undefined;
      const pixelsPerMeterValue = resizeRotatedItemFromCorner(resizeSource, dragState.handle, dragState.anchor, planPoint, pixelsPerMeter() || 1, event.shiftKey, conditionalValue);
      Object.assign(resizeTarget, itemFromPlanFootprintResize(dragState.originalItem, pixelsPerMeterValue));
      dragState.moved = Math.abs(resizeTarget.x - dragState.originalItem.x) > 0.000001 || Math.abs(resizeTarget.y - dragState.originalItem.y) > 0.000001 || Math.abs(resizeTarget.width - dragState.originalItem.width) > 0.000001 || Math.abs(resizeTarget.depth - dragState.originalItem.depth) > 0.000001 || Math.abs(resizeTarget.height - dragState.originalItem.height) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "rotate-item") {
      if (!dragState.moved && distance(planPoint, dragState.startPointer) * planView.zoom < 3) {
        return;
      }
      const rotation = selectedEntity();
      if (!rotation) {
        return;
      }
      rotation.rotation = itemRotationFromPointers(dragState.originalItem.rotation, dragState.center, dragState.startPointer, planPoint, event.shiftKey ? 15 : 0);
      dragState.moved = Math.abs(rotation.rotation - dragState.originalItem.rotation) > 0.000001;
      drawPlan();
      return;
    }
    if (dragState.type === "move-opening") {
      if (!dragState.moved && distance(planPoint, dragState.start) * planView.zoom < 3) {
        return;
      }
      const t = selectedEntity();
      const start = floorSceneCurrent.walls.find(item => item.id === t?.wallId);
      if (!t || !start) {
        return;
      }
      t.t = clampWindowT(start, {
        ...t,
        t: projectPointToSegment(planPoint, start.start, start.end).t
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
  const pendingZoom = Gr;
  Gr = null;
  if (pendingZoom) {
    onPlanWheelZoom(pendingZoom);
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
  const previousExportHeight = defaultExportHeight;
  const previousAspect = exportAspectRatio;
  defaultExportHeight = 1;
  exportAspectRatio = null;
  if (previousAspect && Math.abs(previousExportHeight - 1) > 1e-8) {
    zoomPlanViewAt(previousExportHeight, previousAspect);
  }
}
function applyInspectorFields(wheelEvent) {
  defaultExportHeight *= Math.exp(-wheelEvent.deltaY * 0.0012);
  exportAspectRatio = pointerEventToCanvasPoint(wheelEvent);
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
      start: startPoint,
      current: currentPoint
    } = dragState;
    try {
      element.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    scheduleLeaveStudio();
    const widthMeters = Math.abs(currentPoint.x - startPoint.x) / pixelsPerMeter();
    const depthMeters = Math.abs(currentPoint.y - startPoint.y) / pixelsPerMeter();
    if (pointerEvent.type !== "pointercancel" && widthMeters >= 0.1 && depthMeters >= 0.1) {
      placeCatalogFurnitureItem("flooropening", {
        x: (startPoint.x + currentPoint.x) / 2,
        y: (startPoint.y + currentPoint.y) / 2
      }, {
        width: Math.min(20, widthMeters),
        depth: Math.min(20, depthMeters)
      });
    } else {
      drawPlan();
    }
    return;
  }
  if (dragState.type === "marquee") {
    const previousLightGroupFilter = activeSelectionLightGroupFilter();
    const preselected = dragState.additive ? [...(selection ? [selection] : []), ...multiSelection] : [];
    const hits = dragState.moved ? marqueeSelectHits(dragState.start, dragState.current) : [];
    const selectedTargets = [...new Map([...preselected, ...hits].map(target => [target.kind + ":" + target.id, target])).values()];
    if (selectedTargets.length === 1) {
      setSelection(selectedTargets[0].kind, selectedTargets[0].id);
    } else {
      selection = null;
      multiSelection = selectedTargets;
    }
    try {
      element.releasePointerCapture(pointerEvent.pointerId);
    } catch {}
    dragState = null;
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(previousLightGroupFilter);
    scheduleLeaveStudio();
    return;
  }
  const gesture = dragState;
  const didMove = gesture.moved || gesture.copied;
  if (didMove) {
    pushUndoSnapshot(dragState.before);
    scheduleSave();
  }
  if (["move-items", "resize-item", "rotate-item", "move-opening"].includes(gesture.type)) {
    updateSelectionInspector();
  }
  if (didMove && gesture.type === "move-opening") {
    rebuildPreviewMeshes({
      scope: "all"
    });
  } else if (didMove && ["move-items", "resize-item", "rotate-item"].includes(gesture.type)) {
    const entity = selectedEntity();
    rebuildPreviewMeshes({
      scope: gesture.previewScope || (entity ? itemPreviewScope(entity) : activeSelectionAssetCategory())
    });
  }
  if (dragState.type === "pan") {
    element.classList.remove("panning");
  }
  try {
    element.releasePointerCapture(pointerEvent.pointerId);
  } catch {}
  dragState = null;
  if (gesture.type === "pan") {
    drawPlan();
  }
  scheduleLeaveStudio();
}
function scheduleClearInspectorHover(pointerId) {
  onPlanPointerCancel(pointerId.pointerId);
  setHoveredInspectorTarget(pointerId);
}
function applyInspectorFieldsCurrent(selectionKind) {
  const entity = selectedEntity();
  if (!entity || selection?.kind !== selectionKind) {
    return;
  }
  const previewScope = selectionKind === "item" ? itemPreviewScope(entity) : "all";
  pushHistory();
  if (selectionKind === "wall") {
    entity.height = clamp(finite(selectEl("#wall-height").value, entity.height), 0.01, 6);
    entity.thickness = clamp(finite(selectEl("#wall-thickness").value, entity.thickness), 0.01, 3);
    entity.opacity = selectEl("#wall-opacity-mode").value === "custom" ? clamp(finite(selectEl("#wall-opacity").value, floorSceneCurrent.settings.wallOpacity * 100), 0, 100) / 100 : null;
    entity.allowOpenEnd = selectEl("#wall-open-end-mode").value === "allowed";
    floorSceneCurrent.settings.wallHeight = entity.height;
    floorSceneCurrent.settings.wallThickness = entity.thickness;
  } else if (selectionKind === "window") {
    entity.width = clamp(finite(selectEl("#window-width").value, entity.width), 0.3, 20);
    entity.height = clamp(finite(selectEl("#window-height").value, entity.height), 0.3, 20);
    entity.sill = clamp(finite(selectEl("#window-sill").value, entity.sill), 0, 20);
    entity.hasDivider = selectEl("#window-divider").value !== "without";
    const windowWall = floorSceneCurrent.walls.find(wall => wall.id === entity.wallId);
    if (windowWall) {
      entity.t = clampWindowT(windowWall, entity, pixelsPerMeter());
    }
  } else if (selectionKind === "door") {
    entity.doorType = Object.hasOwn(yo, selectEl("#door-type").value) ? selectEl("#door-type").value : "solid";
    entity.width = clamp(finite(selectEl("#door-width").value, entity.width), 0.55, 20);
    entity.height = clamp(finite(selectEl("#door-height").value, entity.height), 1.8, 20);
    const doorWall = floorSceneCurrent.walls.find(candidateWall => candidateWall.id === entity.wallId);
    if (doorWall) {
      entity.t = clampWindowT(doorWall, entity, pixelsPerMeter());
    }
  } else if (selectionKind === "railing") {
    entity.width = clamp(finite(selectEl("#railing-width").value, entity.width), 0.3, 20);
    entity.height = clamp(finite(selectEl("#railing-height").value, entity.height), 0.5, 3);
    const railingWall = floorSceneCurrent.walls.find(railingWallRef => railingWallRef.id === entity.wallId);
    if (railingWall) {
      entity.t = clampWindowT(railingWall, entity, pixelsPerMeter());
    }
  } else {
    const scalePixels = pixelsPerMeter() || 1;
    entity.x = finite(selectEl("#item-x").value, entity.x / scalePixels) * scalePixels;
    entity.y = finite(selectEl("#item-y").value, entity.y / scalePixels) * scalePixels;
    entity.width = clamp(finite(selectEl("#item-width").value, entity.width), 0.1, 8);
    entity.height = clamp(finite(selectEl("#item-height").value, entity.height), itemMinimumHeight(entity.type), 6);
    entity.depth = clamp(finite(selectEl("#item-depth").value, entity.depth), 0.1, 8);
    entity.elevation = clamp(finite(selectEl("#item-elevation").value, entity.elevation || 0), 0, 6);
    entity.rotation = entity.type === "striplight" ? normalizeFullRotation(selectEl("#item-rotation").value, entity.rotation) : finite(selectEl("#item-rotation").value, entity.rotation);
    if (entity.type === "planlabel") {
      entity.title = normalizeLabelText(selectEl("#label-title").value, "家庭总览", 24);
      entity.subtitle = normalizeLabelText(selectEl("#label-subtitle").value, "HOME PLAN", 36);
      entity.titleSpacing = clamp(finite(selectEl("#label-title-spacing").value, 105) / 100, 0, 1.8);
      entity.subtitleSpacing = clamp(finite(selectEl("#label-subtitle-spacing").value, 8) / 100, 0, 0.6);
      entity.lineLength = clamp(finite(selectEl("#label-line-length").value, 86) / 100, 0.3, 1);
      entity.height = 0.01;
      entity.elevation = 0;
    }
    if (entity.type === "curtain") {
      entity.curtainPosition = ["left", "right", "split"].includes(selectEl("#curtain-position").value) ? selectEl("#curtain-position").value : "split";
    }
    if (entity.type === "mural") {
      entity.muralStyle = normalizeMuralArtStyle(selectEl("#mural-style").value);
    }
    if (entity.type === "featurewall") {
      entity.wallStyle = normalizeFeatureWallStyle(selectEl("#feature-wall-style").value);
    }
    if (entity.type === "pillar") {
      entity.pillarShape = normalizePillarShape(selectEl("#pillar-shape").value);
      entity.pillarAxis = normalizePillarAxis(selectEl("#pillar-axis").value);
    }
    if (entity.type === "striplight") {
      entity.stripAxis = normalizeStripAxis(selectEl("#strip-axis").value);
    }
    if (roundTableTypes.has(entity.type)) {
      entity.roundTableTurntable = selectEl("#round-table-turntable").value === "with";
    }
    if (stairItemTypes.has(entity.type)) {
      entity.stairDirection = ["left", "right"].includes(selectEl("#stair-direction").value) ? selectEl("#stair-direction").value : "right";
    }
    if (entity.type === "tv") {
      const previousTvMountStyle = tvMountStyles.has(entity.tvMountStyle) ? entity.tvMountStyle : "standard";
      const tvMountStyle = tvMountStyles.has(selectEl("#tv-mount-style").value) ? selectEl("#tv-mount-style").value : "standard";
      if (previousTvMountStyle !== tvMountStyle && tvMountStyle === "mobile") {
        entity.height = Math.max(entity.height, modelLoadStatusTimer.height);
        entity.depth = Math.max(entity.depth, modelLoadStatusTimer.depth);
        entity.elevation = 0;
      } else if (previousTvMountStyle === "mobile" && tvMountStyle !== "mobile" && Math.abs(entity.height - modelLoadStatusTimer.height) < 0.001 && Math.abs(entity.depth - modelLoadStatusTimer.depth) < 0.001) {
        entity.height = furnitureCatalog.tv.height;
        entity.depth = furnitureCatalog.tv.depth;
      }
      entity.tvMountStyle = tvMountStyle;
    }
    if (set.has(entity.type)) {
      const lightPreset = defaultLightPresets[entity.type] || defaultLightPresets.downlight;
      entity.verticalRotation = entity.type === "striplight" ? normalizeFullRotation(selectEl("#item-vertical-rotation").value, entity.verticalRotation || 0) : clamp(finite(selectEl("#item-vertical-rotation").value, entity.verticalRotation || 0), -90, 90);
      if (entity.type === "striplight") {
        entity.stripRollRotation = normalizeFullRotation(itemStripRoll.value, entity.stripRollRotation || 0);
        entity.lightSourceVisible = zl.checked;
      }
      entity.lightGroupId = floorSceneCurrent.lightGroups.some(group => group.id === selectEl("#light-group").value) ? selectEl("#light-group").value : ensureDefaultLightGroup().id;
      entity.lightTemperature = clamp(finite(selectEl("#light-temperature").value, lightPreset.temperature), 2200, 6500);
      entity.lightBrightness = clamp(finite(selectEl("#light-brightness").value, lightPreset.brightness), 0, 100);
      entity.lightRange = clamp(finite(selectEl("#light-range").value, lightPreset.range), 0.5, 10);
      entity.lightAngle = clamp(finite(selectEl("#light-angle").value, lightPreset.angle), 15, defaultItemDepth(entity.type));
      entity.height = furnitureCatalog[entity.type].height;
    } else if (entity.type === "camera" || entity.type === "presence") {
      entity.verticalRotation = clamp(finite(selectEl("#item-vertical-rotation").value, entity.verticalRotation || 0), -180, 180);
    }
  }
  refreshViews(previewScope);
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
function beginOrSwitchWallSettingsEdit(wallSettingsKey) {
  if (exportPresetEditorOpen && exportPresetEditorOpen !== wallSettingsKey) {
    commitGlobalWallThickness();
  }
  if (!exportPresetEditorOpen) {
    pushHistory();
    exportPresetEditorOpen = wallSettingsKey;
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
function scheduleClearInspectorHoverCurrent(delayMs = 80) {
  window.clearTimeout(exportUiDebounceTimer);
  exportUiDebounceTimer = window.setTimeout(commitGlobalWallThickness, delayMs);
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
  for (const entry of itemCatalog) {
    entry.hidden = entry.dataset.assetHeadingCategory !== assetCategory;
  }
  for (const optionEl of w0) {
    const itemType = optionEl.dataset.itemType;
    const present = set.has(itemType);
    const isReservedUnit = RESERVED_TEXTURE_UNITS.has(itemType);
    const visible = assetCategory === "light" ? present : assetCategory === "appliance" ? isReservedUnit : !isReservedUnit && !present;
    optionEl.hidden = !visible;
  }
}
function setAssetCategoryFilter(requested) {
  const category = ["home", "appliance", "light"].includes(requested) ? requested : "home";
  const previousLightGroupFilter = activeSelectionLightGroupFilter();
  hideLightGroupContextMenu();
  assetCategory = category;
  for (const tabButton of m0) {
    const isActiveCategory = tabButton.dataset.assetCategory === category;
    tabButton.classList.toggle("active", isActiveCategory);
    tabButton.setAttribute("aria-pressed", String(isActiveCategory));
  }
  closeLightGroupRenameDialog();
  lightItemTypes.hidden = category === "light";
  stairLikeTypes.hidden = category !== "light";
  const entity = selectedEntity();
  const hasLightSelection = selection?.kind === "item" && entity && set.has(entity.type);
  if (selection && category === "light" != !!hasLightSelection) {
    clearSelection();
  }
  if (multiSelection.length) {
    clearSelection();
  }
  setActiveTool("select");
  renderLightLayerPanel();
  updateSelectionInspector();
  drawPlan();
  if (previousLightGroupFilter !== activeSelectionLightGroupFilter()) {
    rebuildPreviewForAssetFilters(previousLightGroupFilter);
  }
}
for (const e of m0) {
  e.addEventListener("click", () => setAssetCategoryFilter(e.dataset.assetCategory));
}
setAssetCategoryFilter("home");
Tg.addEventListener("click", () => {
  pushHistory();
  const has = new Set(floorSceneCurrent.lightGroups.map(lightGroup => lightGroup.name));
  let nextGroupNumber = floorSceneCurrent.lightGroups.length + 1;
  while (has.has("灯组 " + nextGroupNumber)) {
    nextGroupNumber += 1;
  }
  const id = {
    id: makeId("light-group"),
    name: "灯组 " + nextGroupNumber,
    enabled: true,
    areaId: null
  };
  floorSceneCurrent.lightGroups.push(id);
  on = id.id;
  renderLightLayerPanel();
  updateSelectionInspector();
  scheduleSave();
});
fridgeSize.addEventListener("click", () => setCategoryLayersEnabled(false));
for (const e of lightGroupContextMenu.querySelectorAll("[data-light-group-action]")) {
  e.addEventListener("click", () => {
    const lightGroup = floorSceneCurrent.lightGroups.find(item => item.id === lightGroupContextMenuId);
    const lightGroupAction = e.dataset.lightGroupAction;
    hideLightGroupContextMenu();
    if (lightGroup) {
      if (lightGroupAction === "area") {
        openLightGroupAreaDialog(lightGroup);
      } else if (lightGroupAction === "rename") {
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
addAreaButton.addEventListener("click", () => openAreaCreateDialog());
areaRenameForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = normalizeAreaName(areaRenameInput.value);
  if (!name) {
    showToast("请输入区域名称。", "error");
    return;
  }
  if (areaRenameMode === "rename") {
    const area = (floorSceneCurrent.areas || []).find(item => item.id === areaRenameId);
    if (!area) {
      closeAreaRenameDialog();
      return;
    }
    if (area.name === name) {
      closeAreaRenameDialog();
      return;
    }
    if (areaNameTaken(name, area.id)) {
      showToast("已存在同名区域。", "error");
      return;
    }
    pushHistory();
    area.name = name;
    renderLightLayerPanel();
    scheduleSave();
  } else {
    if (areaNameTaken(name)) {
      showToast("已存在同名区域。", "error");
      return;
    }
    pushHistory();
    const area = {
      id: makeId("area"),
      name
    };
    floorSceneCurrent.areas.push(area);
    expandedAreaIds.add(area.id);
    renderLightLayerPanel();
    scheduleSave();
  }
  closeAreaRenameDialog();
});
selectEl("#area-rename-close").addEventListener("click", closeAreaRenameDialog);
selectEl("#area-rename-cancel").addEventListener("click", closeAreaRenameDialog);
areaRenameDialog.addEventListener("cancel", () => {
  areaRenameMode = "create";
  areaRenameId = "";
});
for (const e of areaContextMenu.querySelectorAll("[data-area-action]")) {
  e.addEventListener("click", () => {
    const area = (floorSceneCurrent.areas || []).find(item => item.id === areaContextMenuId);
    const areaAction = e.dataset.areaAction;
    hideAreaContextMenu();
    if (area) {
      if (areaAction === "rename") {
        openAreaRenameDialog(area);
      } else if (areaAction === "delete") {
        deleteArea(area);
      }
    }
  });
}
lightGroupAreaForm.addEventListener("submit", event => {
  event.preventDefault();
  const lightGroup = (floorSceneCurrent.lightGroups || []).find(item => item.id === areaAssignGroupId);
  if (lightGroup) {
    const next = lightGroupAreaSelect.value || null;
    if (next === null || (floorSceneCurrent.areas || []).some(area => area.id === next)) {
      if ((lightGroup.areaId || null) !== next) {
        pushHistory();
        lightGroup.areaId = next;
        if (next) {
          expandedAreaIds.add(next);
        }
        renderLightLayerPanel();
        scheduleSave();
      }
    }
  }
  closeLightGroupAreaDialog();
});
selectEl("#light-group-area-close").addEventListener("click", closeLightGroupAreaDialog);
selectEl("#light-group-area-cancel").addEventListener("click", closeLightGroupAreaDialog);
lightGroupAreaDialog.addEventListener("cancel", () => {
  areaAssignGroupId = "";
});
lightGroupAreaCreate.addEventListener("click", createAreaFromAssignDialog);
lightGroupAreaNewName.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    createAreaFromAssignDialog();
  }
});
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
  if (!areaContextMenu.hidden && !areaContextMenu.contains(target.target)) {
    hideAreaContextMenu();
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
  const renamedFloor = projectDocCurrent.floors.find(floor => floor.id === contextFloorId);
  if (!renamedFloor) {
    closeLightPropertyApplyDialog();
    return;
  }
  const name = uniqueFloorName(normalizeLabelText(floorRenameInputCurrent.value, renamedFloor.name, 24), renamedFloor.id);
  if (name !== renamedFloor.name) {
    renamedFloor.name = name;
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
function renderLightPropertyTargetList(propertyKey) {
  wallFields.replaceChildren();
  let targetCount = 0;
  for (const lightGroup of floorSceneCurrent.lightGroups) {
    const groupItems = floorSceneCurrent.items.filter(groupItem => set.has(groupItem.type) && groupItem.lightGroupId === lightGroup.id);
    if (!groupItems.length) {
      continue;
    }
    targetCount += groupItems.length;
    const sectionEl = document.createElement("section");
    sectionEl.className = "light-property-target-group";
    sectionEl.dataset.lightTargetGroupId = lightGroup.id;
    const headerEl = document.createElement("header");
    const groupNameEl = document.createElement("strong");
    groupNameEl.textContent = lightGroup.name;
    const countEl = document.createElement("span");
    countEl.dataset.lightTargetGroupCount = "";
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.dataset.lightTargetGroupToggle = "";
    toggleButton.textContent = "取消全选";
    headerEl.append(groupNameEl, countEl, toggleButton);
    const gridEl = document.createElement("div");
    gridEl.className = "light-property-target-grid";
    const typeCounts = new Map();
    for (const item of groupItems) {
      typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1);
    }
    const typeOrdinals = new Map();
    for (const itemEntry of groupItems) {
      const catalogEntry = furnitureCatalog[itemEntry.type] || furnitureCatalog.downlight;
      const typeIndex = (typeOrdinals.get(itemEntry.type) || 0) + 1;
      typeOrdinals.set(itemEntry.type, typeIndex);
      const rowEl = document.createElement("label");
      rowEl.className = "light-property-target-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.lightTargetItemId = itemEntry.id;
      const textWrap = document.createElement("span");
      const nameEl = document.createElement("strong");
      nameEl.textContent = typeCounts.get(itemEntry.type) > 1 ? catalogEntry.name + " " + typeIndex : catalogEntry.name;
      const stateEl = document.createElement("small");
      const propertyValue = clampLightPropertyValue(propertyKey, itemEntry[propertyKey], itemEntry.type);
      stateEl.textContent = (itemEntry.id === selection?.id ? "当前灯 · " : "") + "当前 " + formatLightPropertyValue(propertyKey, propertyValue);
      textWrap.append(nameEl, stateEl);
      rowEl.append(checkbox, textWrap);
      gridEl.append(rowEl);
    }
    sectionEl.append(headerEl, gridEl);
    wallFields.append(sectionEl);
  }
  if (!targetCount) {
    const emptyHint = document.createElement("p");
    emptyHint.className = "light-property-target-empty";
    emptyHint.textContent = "当前没有可应用的灯具。";
    wallFields.append(emptyHint);
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
  const targetGroupEl = groupToggleEl.closest("[data-light-target-group-id]");
  const every = buildStageReferenceScene(targetGroupEl);
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
    property: propertyName,
    label: propertyLabel,
    value: propertyValue
  } = Dr;
  const has = new Set(buildStageReferenceScene().filter(checked => checked.checked).map(datasetVar => datasetVar.dataset.lightTargetItemId));
  const length = floorSceneCurrent.items.filter(type => set.has(type.type) && has.has(type.id));
  if (!length.length) {
    showToast("请至少选择一盏灯。", "error");
    return;
  }
  const filtered = length.map(item => ({
    item,
    value: clampLightPropertyValue(propertyName, propertyValue, item.type)
  })).filter(item => Math.abs(finite(item.item[propertyName]) - item.value) > 0.000001);
  if (filtered.length) {
    pushHistory();
    for (const value of filtered) {
      value.item[propertyName] = value.value;
    }
    refreshViews("lights");
    scheduleSave();
  }
  postAutoDiagramBusy();
  showToast("已将" + propertyLabel + "应用到 " + length.length + " 盏灯。", "success");
});
function wallTargetCheckboxes(scopeEl = wallPropertyTargetList) {
  return [...scopeEl.querySelectorAll("[data-wall-target-item-id]")];
}
function wallOpacityPercent(wall) {
  const globalOpacity = floorSceneCurrent.settings.wallOpacity;
  const custom = wall.opacity === null || wall.opacity === undefined ? null : clamp(finite(wall.opacity, globalOpacity), 0, 1);
  return Math.round((custom === null ? globalOpacity : custom) * 100);
}
function wallPropertyCurrentText(wall, property) {
  if (property === "height") {
    return wall.height.toFixed(2) + " m";
  }
  if (property === "thickness") {
    return wall.thickness.toFixed(2) + " m";
  }
  const custom = wall.opacity === null || wall.opacity === undefined ? null : clamp(finite(wall.opacity, floorSceneCurrent.settings.wallOpacity), 0, 1);
  if (property === "opacityMode") {
    return custom === null ? "跟随通用" : "单独设置 " + wallOpacityPercent(wall) + "%";
  }
  return (custom === null ? "跟随通用 " : "") + wallOpacityPercent(wall) + "%";
}
function updateWallPropertyTargetSummary() {
  const boxes = wallTargetCheckboxes();
  const checked = boxes.filter(box => box.checked).length;
  wallPropertySelectionCount.textContent = checked + "/" + boxes.length + " 面墙";
  wallPropertyToggleAll.disabled = !boxes.length;
  wallPropertyToggleAll.textContent = boxes.length && checked === boxes.length ? "取消全选" : "全选";
}
function computeMultiFloorBoundsCenter(toWorldPoint) {
  if (projectDocCurrent.floors.length < 2) {
    return null;
  }
  const expandByPoint = new THREE.Box3();
  let maxWallHeight = 0;
  for (const scene of projectDocCurrent.floors) {
    for (const start of scene.scene.walls || []) {
      for (const endpoint of [start.start, start.end]) {
        if (!endpoint || !Number.isFinite(endpoint.x) || !Number.isFinite(endpoint.y)) {
          continue;
        }
        const worldP = planPointToWorldXZ(scene, endpoint);
        expandByPoint.expandByPoint(new THREE.Vector3(worldP.x, 0, worldP.z));
      }
      maxWallHeight = Math.max(maxWallHeight, finite(start.height, scene.scene.settings?.wallHeight || 2.8));
    }
  }
  if (expandByPoint.isEmpty()) {
    return null;
  }
  const boundsCenter = expandByPoint.getCenter(new THREE.Vector3());
  if (getPreviewFloorModeCurrent() === "all") {
    boundsCenter.y = (projectDocCurrent.floors.length - 1) * projectDocCurrent.previewFloorGap / 2 + maxWallHeight / 2;
    return boundsCenter;
  }
  const floorRecord = projectDocCurrent.floors.find(matchedFloor => matchedFloor.id === activeFloorId);
  const planPoint = rotatePlanPointByFloor(floorRecord, boundsCenter);
  return toWorldPoint(floorRecord.id, planPoint.x, planPoint.y, maxWallHeight / 2);
}

function renderWallPropertyTargetList(property) {
  wallPropertyTargetList.replaceChildren();
  const walls = floorSceneCurrent.walls || [];
  if (!walls.length) {
    const empty = document.createElement("p");
    empty.className = "light-property-target-empty";
    empty.textContent = "当前楼层没有可应用的墙体。";
    wallPropertyTargetList.append(empty);
    updateWallPropertyTargetSummary();
    return;
  }
  const section = document.createElement("section");
  section.className = "light-property-target-group";
  const grid = document.createElement("div");
  grid.className = "light-property-target-grid";
  walls.forEach((wall, index) => {
    const label = document.createElement("label");
    label.className = "light-property-target-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.wallTargetItemId = wall.id;
    const column = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = "墙体 " + (index + 1);
    const note = document.createElement("small");
    note.textContent = (selection?.kind === "wall" && selection.id === wall.id ? "当前墙 · " : "") + "当前 " + wallPropertyCurrentText(wall, property);
    column.append(title, note);
    label.append(checkbox, column);
    grid.append(label);
  });
  section.append(grid);
  wallPropertyTargetList.append(section);
  updateWallPropertyTargetSummary();
}
function closeWallPropertyApply() {
  wallApplyState = null;
  wallPropertyApplyDialog.close();
}
for (const e of wallApplyPropertyEls) {
  e.addEventListener("click", () => {
    if (selection?.kind !== "wall" || !selectedEntity()) {
      return;
    }
    const property = e.dataset.applyWallProperty;
    const mode = selectEl("#wall-opacity-mode").value === "custom" ? "custom" : "global";
    const opacityPercent = clamp(finite(selectEl("#wall-opacity").value, floorSceneCurrent.settings.wallOpacity * 100), 0, 100);
    if (property === "opacityMode") {
      wallApplyState = {
        property: "opacityMode",
        mode,
        opacity: clamp(opacityPercent / 100, 0, 1),
        label: "透明度设置",
        valueText: mode === "global" ? "跟随通用" : "单独设置（" + Math.round(opacityPercent) + "%）"
      };
    } else if (property === "opacity") {
      wallApplyState = {
        property: "opacity",
        mode: "custom",
        opacity: clamp(opacityPercent / 100, 0, 1),
        label: "透明度",
        valueText: Math.round(opacityPercent) + "%"
      };
    } else if (property === "height") {
      const value = clamp(finite(selectEl("#wall-height").value, floorSceneCurrent.settings.wallHeight), 0.01, 6);
      wallApplyState = {
        property: "height",
        value,
        label: "墙高",
        valueText: value.toFixed(2) + " m"
      };
    } else if (property === "thickness") {
      const value = clamp(finite(selectEl("#wall-thickness").value, floorSceneCurrent.settings.wallThickness), 0.01, 3);
      wallApplyState = {
        property: "thickness",
        value,
        label: "厚度",
        valueText: value.toFixed(2) + " m"
      };
    } else {
      return;
    }
    wallPropertyApplyTitle.textContent = "应用" + wallApplyState.label;
    wallPropertyApplyValue.textContent = wallApplyState.valueText;
    renderWallPropertyTargetList(property);
    wallPropertyApplyDialog.showModal();
    requestAnimationFrame(() => wallPropertyToggleAll.focus());
  });
}
wallPropertyToggleAll.addEventListener("click", () => {
  const boxes = wallTargetCheckboxes();
  const next = !boxes.length || !boxes.every(box => box.checked);
  for (const box of boxes) {
    box.checked = next;
  }
  updateWallPropertyTargetSummary();
});
wallPropertyTargetList.addEventListener("change", updateWallPropertyTargetSummary);
selectEl("#wall-property-apply-close").addEventListener("click", closeWallPropertyApply);
selectEl("#wall-property-apply-cancel").addEventListener("click", closeWallPropertyApply);
wallPropertyApplyDialog.addEventListener("cancel", () => {
  wallApplyState = null;
});
wallPropertyApplyForm.addEventListener("submit", event => {
  event.preventDefault();
  const state = wallApplyState;
  if (!state) {
    closeWallPropertyApply();
    return;
  }
  const boxes = wallTargetCheckboxes().filter(box => box.checked);
  if (!boxes.length) {
    showToast("请至少选择一面墙体。", "error");
    return;
  }
  const ids = new Set(boxes.map(box => box.dataset.wallTargetItemId));
  const targets = [];
  for (const wall of floorSceneCurrent.walls) {
    if (!ids.has(wall.id)) {
      continue;
    }
    if (state.property === "height") {
      if (Math.abs(wall.height - state.value) < 1e-8) {
        continue;
      }
      targets.push([wall, "height", state.value]);
      continue;
    }
    if (state.property === "thickness") {
      if (Math.abs(wall.thickness - state.value) < 1e-8) {
        continue;
      }
      targets.push([wall, "thickness", state.value]);
      continue;
    }
    const custom = wall.opacity === null || wall.opacity === undefined ? null : clamp(finite(wall.opacity, floorSceneCurrent.settings.wallOpacity), 0, 1);
    const next = state.property === "opacityMode" && state.mode === "global" ? null : state.opacity;
    if (next === null) {
      if (custom === null) {
        continue;
      }
    } else if (custom !== null && Math.abs(custom - next) < 1e-8) {
      continue;
    }
    targets.push([wall, "opacity", next]);
  }
  if (targets.length) {
    pushHistory();
    for (const [wall, key, next] of targets) {
      wall[key] = next;
    }
    if (state.property === "height") {
      floorSceneCurrent.settings.wallHeight = state.value;
    } else if (state.property === "thickness") {
      floorSceneCurrent.settings.wallThickness = state.value;
    }
    refreshViews();
    scheduleSave();
  }
  const count = boxes.length;
  closeWallPropertyApply();
  showToast("已将" + state.label + "应用到 " + count + " 面墙体。", "success");
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
  const itemId = preventDefault.dataTransfer.getData("application/x-ha-bridge-3d-item");
  if (itemId) {
    placeCatalogFurnitureItem(itemId, screenToPlanWithView(pointerEventToCanvasPoint(preventDefault)));
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
  const presetIndex = normalizeActiveExportPresetSlot(projectDocCurrent?.activeExportPresetSlot, length.length);
  const preset = length[presetIndex];
  if (!preset) {
    closeExportPresetRenameDialog();
    return;
  }
  const label = defaultExportPresetLabel(preset, presetIndex);
  const name = uniqueExportPresetLabel(exportPresetRenameInput.value, presetIndex);
  preset.name = name;
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
    width: widthPx,
    height: resolution
  } = readExportResolution();
  if (exportLockRatio.checked) {
    Tn = widthPx / resolution;
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
const callback = (downEvent, releaseCapture = true) => {
  if (!detailsResizeDrag || downEvent?.pointerId !== undefined && detailsResizeDrag.pointerId !== downEvent.pointerId) {
    return;
  }
  const dragSnapshot = detailsResizeDrag;
  detailsResizeDrag = null;
  const layoutChanged = Math.abs(floorSceneCurrent.settings.previewPanelRatio - dragSnapshot.startPreviewRatio) > 0.0001 || Math.abs(floorSceneCurrent.settings.detailsPanelWidthRatio - dragSnapshot.startWidthRatio) > 0.0001;
  detailsPanelElCurrent.classList.remove("resizing");
  studioShellEl.classList.remove("resizing");
  delete detailsResizer.dataset.resizeAxis;
  if (releaseCapture) {
    try {
      if (detailsResizer.hasPointerCapture(dragSnapshot.pointerId)) {
        detailsResizer.releasePointerCapture(dragSnapshot.pointerId);
      }
    } catch {}
  }
  if (layoutChanged) {
    scheduleSave();
  }
};
detailsResizer.addEventListener("pointerup", callback);
detailsResizer.addEventListener("pointercancel", callback);
detailsResizer.addEventListener("lostpointercapture", pointerUpEvent => callback(pointerUpEvent, false));
window.addEventListener("pointerup", callback, true);
window.addEventListener("pointercancel", callback, true);
window.addEventListener("blur", () => callback());
detailsResizer.addEventListener("keydown", signal => {
  const verticalDelta = signal.key === "ArrowUp" ? -0.03 : signal.key === "ArrowDown" ? 0.03 : 0;
  const value = signal.key === "ArrowLeft" ? 0.03 : signal.key === "ArrowRight" ? -0.03 : 0;
  if (!verticalDelta && !value) {
    return;
  }
  signal.preventDefault();
  const minimumHeightRatio = studioLayoutMetrics();
  floorSceneCurrent.settings.previewPanelRatio = clamp(floorSceneCurrent.settings.previewPanelRatio + verticalDelta, minimumHeightRatio.minimumHeightRatio, minimumHeightRatio.maximumHeightRatio);
  floorSceneCurrent.settings.detailsPanelWidthRatio = clamp(floorSceneCurrent.settings.detailsPanelWidthRatio + value, minimumHeightRatio.minimumWidthRatio, minimumHeightRatio.maximumWidthRatio);
  applyPreviewPaneWidth();
  applyDetailsPaneWidth();
  scheduleSave();
});
for (const e of cameraModeEls) {
  e.addEventListener("click", () => {
    const projectionMode = e.dataset.cameraMode === "perspective" ? "perspective" : "orthographic";
    if (projectionMode !== getCameraProjectionMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraMode = projectionMode;
      setCameraProjectionMode(projectionMode);
      if (stageSession) {
        exportStatus.textContent = projectionMode === "perspective" ? "已切换为透视构图" : "已切换为正交构图";
      } else {
        scheduleSave();
      }
    }
  });
}
for (const e of cameraViewEls) {
  e.addEventListener("click", () => {
    const viewMode = e.dataset.cameraView === "top" ? "top" : "free";
    if (viewMode !== cameraViewMode()) {
      if (!stageSession) {
        pushHistory();
      }
      activeCameraSettings().cameraView = viewMode;
      nudgeCamera(viewMode);
      if (stageSession) {
        exportStatus.textContent = viewMode === "top" ? "已切换为顶视构图" : "已切换为自由构图";
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
  const deltaX = pointerId.clientX - lightCacheTileMap.startX;
  const value = pointerId.clientY - lightCacheTileMap.startY;
  if (!lightCacheTileMap.moved && Math.hypot(deltaX, value) < 4) {
    return;
  }
  lightCacheTileMap.moved = true;
  pointerId.preventDefault();
  const width = baseLightControls.getBoundingClientRect();
  const maxLeft = Math.max(8, window.innerWidth - width.width - 8);
  const max = Math.max(8, window.innerHeight - width.height - 8);
  baseLightControls.style.right = "auto";
  baseLightControls.style.left = clamp(lightCacheTileMap.startLeft + deltaX, 8, maxLeft) + "px";
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
  const pixelLength = distance(shiftKeyHeld.start, shiftKeyHeld.end);
  if (meters <= 0 || pixelLength <= 0) {
    showToast("请输入有效的真实长度。", "error");
    return;
  }
  pushHistory();
  floorSceneCurrent.calibration = {
    pixelsPerMeter: pixelLength / meters,
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
selectEl("#mural-style").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#feature-wall-style").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#pillar-shape").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#pillar-axis").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
selectEl("#strip-axis").addEventListener("change", () => applyInspectorFieldsCurrent("item"));
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
  if (!!flag && selection?.kind === "door" && !["double", "roller-shutter"].includes(flag.doorType)) {
    pushHistory();
    flag.hinge = flag.hinge === "right" ? "left" : "right";
    refreshViews();
    scheduleSave();
  }
});
selectEl("#door-swing").addEventListener("click", () => {
  const swing = selectedEntity();
  if (!!swing && selection?.kind === "door" && swing.doorType !== "frame-only") {
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
  const editingTextField = key.target instanceof HTMLInputElement || key.target instanceof HTMLTextAreaElement || lightPropertyApplyTitle.open;
  if (key.code === "Space" && !editingTextField) {
    saveConflictState = true;
    key.preventDefault();
  }
  if (key.key.toLowerCase() === "s" && !editingTextField) {
    Or = true;
    updatePlanStatusChrome();
    drawPlan();
  }
  if (editingTextField) {
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
  const arrowDelta = {
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
  if (arrowDelta && !metaKey) {
    const selectedIds = selection?.kind === "item" ? [selection.id] : multiSelection.filter(kind => kind.kind === "item").map(entry => entry.id);
    if (selectedIds.length) {
      key.preventDefault();
      if (!key.repeat) {
        pushHistory();
      }
      const stepPixels = (key.altKey ? 0.01 : key.shiftKey ? 0.25 : 0.05) * (pixelsPerMeter() || 1);
      const selectedIdSet = new Set(selectedIds);
      for (const sceneItem of floorSceneCurrent.items) {
        if (selectedIdSet.has(sceneItem.id)) {
          sceneItem.x += arrowDelta.x * stepPixels;
          sceneItem.y += arrowDelta.y * stepPixels;
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
    const previousLightFilter = activeSelectionLightGroupFilter();
    clearSelection();
    updateSelectionInspector();
    drawPlan();
    rebuildPreviewForAssetFilters(previousLightFilter);
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
  const deadlineMs = performance.now() + 1800;
  while (isPreviewQualityReady() && (!lightCacheReady || previewQualityJustBecameReady || previewLightCache.hidden) && performance.now() < deadlineMs) {
    await new Promise(requestAnimationFrame);
  }
}
function bootstrapStudioFromLoadedProject() {
  if (renderer.debug) {
    renderer.debug.checkShaderErrors = false;
  }
  const combinedFixedCameraView = normalizeProjectDocument(currentStudioDocument.referenceScene || currentStudioDocument.scene);
  let floorGapOverride = null;
  const entryMap = new Map();
  const reusedTransitions = {
    reusedTransitions: 0,
    rebuiltTransitions: 0,
    reusedFloors: 0
  };
  let emptyText = "";
  let cacheEpoch = 0;
  const releaseCachedNode = node => {
    releaseRoot?.releaseRoot?.(node.node);
    studioReady?.releaseRoot?.(node.node);
    disposeObject3dResources(node.node);
  };
  const callback = (keyFilter = null) => {
    if (!keyFilter) {
      cacheEpoch++;
    }
    for (const [cacheKey, cachedNodes] of entryMap) {
      if (!keyFilter || !!keyFilter.has(cacheKey)) {
        releaseCachedNode(cachedNodes);
        entryMap.delete(cacheKey);
      }
    }
  };
  function release(node) {
    if (!node.cacheKey || node.cacheEpoch !== cacheEpoch) {
      return false;
    }
    const nodeKey = node.id;
    const entry = entryMap.get(nodeKey);
    if (entry && entry.node !== node.node) {
      releaseCachedNode(entry);
    }
    node.node.position.set(0, 0, 0);
    node.node.quaternion.identity();
    node.node.scale.set(1, 1, 1);
    node.node.updateMatrixWorld(true);
    entryMap.delete(nodeKey);
    entryMap.set(nodeKey, node);
    studioReady?.retainRoot?.(node.node);
    releaseRoot?.retainRoot?.(node.node);
    while (entryMap.size > 8) {
      const oldestKey = entryMap.keys().next().value;
      releaseCachedNode(entryMap.get(oldestKey));
      entryMap.delete(oldestKey);
    }
    return true;
  }
  baseLightingChannel?.close();
  baseLightingChannel = null;
  let releaseRoot = null;
  let setRoot = null;
  let curtainFrameWorkCallback = null;
  let shadowVisibilityChanged = false;
  let curtainScopeGroup;
  let curtainScopeCanvas;
  let shadowLights = [];
  let shadowBounds = [];
  let trackedLightKeys = [];
  let previousLightKeys = [];
  let floorBackgroundVisible = true;
  let enabled = false;
  let shadowScopeGroup;
  let shadowScopeChild;
  let visibleMeshes = [];
  let firstPresentPromise;
  let orbitPivot;
  let boundOrbitControls;
  let flag = false;
  let orbitBoundsSourceGroup;
  let orbitBoundsSourceCanvas;
  let orbitBoundsCenter = null;
  const excludeModelLayers = new Set(["items", "lights"]);
  let orbitPanMode = "free";
  let enablePan = true;
  let enableZoom = true;
  let isLightCacheCaptureActive = false;
  let orbitInteractionStarted = false;
  let viewOffsetFraction = 0;
  let lastRenderSizeKey = "";
  let height = null;
  const camera = new THREE.OrthographicCamera();
  const aspectCurrent = new THREE.PerspectiveCamera();
  const motion = {
    matrix: new THREE.Matrix4()
  };
  const rendererSizeVector = new THREE.Vector2();
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
    const cameraDistance = Math.max(0.000001, cameraCurrent.position.distanceTo(orbitControls.target));
    const maxViewSize = Math.max(0.000001, height.height);
    const viewportAspect = cameraCurrent.userData.viewportAspect || 1;
    const blendWeight = height.weight;
    const orthoView = cameraCurrent.view;
    const perspectiveView = camera.view;
    const viewsMatch = orthoView === perspectiveView || orthoView && perspectiveView && orthoView.enabled === perspectiveView.enabled && orthoView.fullWidth === perspectiveView.fullWidth && orthoView.fullHeight === perspectiveView.fullHeight && orthoView.offsetX === perspectiveView.offsetX && orthoView.offsetY === perspectiveView.offsetY && orthoView.width === perspectiveView.width && orthoView.height === perspectiveView.height;
    if (motion.motion === height && motion.camera === cameraCurrent && motion.distance === cameraDistance && motion.height === maxViewSize && motion.aspect === viewportAspect && motion.weight === blendWeight && motion.near === cameraCurrent.near && motion.far === cameraCurrent.far && viewsMatch && motion.matrix.equals(cameraCurrent.projectionMatrix)) {
      return;
    }
    Object.assign(camera, {
      left: -maxViewSize * viewportAspect / 2,
      right: maxViewSize * viewportAspect / 2,
      top: maxViewSize / 2,
      bottom: -maxViewSize / 2,
      near: cameraCurrent.near,
      far: cameraCurrent.far,
      zoom: 1
    });
    Object.assign(aspectCurrent, {
      fov: THREE.MathUtils.radToDeg(Math.atan(maxViewSize / (cameraDistance * 2)) * 2),
      aspect: viewportAspect,
      near: cameraCurrent.near,
      far: cameraCurrent.far,
      zoom: 1
    });
    for (const targetView of [camera, aspectCurrent]) {
      targetView.view = cameraCurrent.view ? {
        ...cameraCurrent.view
      } : null;
      targetView.updateProjectionMatrix();
    }
    const orthoElements = camera.projectionMatrix.elements;
    const perspectiveElements = aspectCurrent.projectionMatrix.elements;
    for (let elementIndex = 0; elementIndex < 16; elementIndex++) {
      cameraCurrent.projectionMatrix.elements[elementIndex] = orthoElements[elementIndex] * (1 - blendWeight) + perspectiveElements[elementIndex] / cameraDistance * blendWeight;
    }
    cameraCurrent.projectionMatrixInverse.copy(cameraCurrent.projectionMatrix).invert();
    motion.motion = height;
    motion.camera = cameraCurrent;
    motion.distance = cameraDistance;
    motion.height = maxViewSize;
    motion.aspect = viewportAspect;
    motion.weight = blendWeight;
    motion.near = cameraCurrent.near;
    motion.far = cameraCurrent.far;
    motion.matrix.copy(cameraCurrent.projectionMatrix);
  }
  const size = new Map();
  const lightFadeCache = new Map();
  let overlayFadeFrameHandle = 0;
  let transitionFrameHandle = 0;
  let captureFinishTimer = null;
  let hasRunTransitionBefore = false;
  let pagehideListenerBound = false;
  let stageWarmupEndTimer = null;
  let transitionScopeGroup;
  let transitionScopeChild;
  let lightKeysRebuilt = false;
  let get = new Map();
  let lightRecordCache = new Map();
  const objectValue = {
    restore: () => tickLightTransitionStates(performance.now(), true)
  };
  function setStageWarmupActive(active) {
    if (stageWarmupEndTimer !== null) {
      window.clearTimeout(stageWarmupEndTimer);
    }
    stageWarmupEndTimer = null;
    if (active) {
      if (isStageWarmup) {
        return;
      }
      isStageWarmup = true;
      qualityProbeStartMs = 0;
      setPreviewPixelRatio(true, {
        preserveLightCache: true
      });
    } else if (isStageWarmup) {
      stageWarmupEndTimer = window.setTimeout(() => {
        stageWarmupEndTimer = null;
        isStageWarmup = false;
        checkAdaptiveQuality();
        qualityProbeStartMs = 0;
        setPreviewPixelRatio(previewOrbitLocked, {
          preserveLightCache: true
        });
      }, 140);
    }
  }
  function normalizedLightBrightness(type, rawBrightness) {
    const normalized = clamp(finite(rawBrightness, 0), 0, 100) / 100;
    if (yt) {
      return normalized;
    } else if (type.type === "striplight") {
      return Math.pow(normalized, 0.82);
    } else {
      return spotLightBrightnessResponse(type.type, normalized);
    }
  }
  function estimateLightRenderIntensity(type) {
    const preset = defaultLightPresets[type.type] || defaultLightPresets.downlight;
    const typeMultiplier = deferExternalModels[type.type] || 1.1;
    if (type.type !== "striplight") {
      return (type.type === "ceilinglight" ? 680 : 520) * typeMultiplier;
    }
    const lightRange = clamp(finite(type.lightRange, preset.range), 0.5, 10);
    const elevation = Math.max(finite(type.elevation, 2.7), 0.4);
    return clamp(lightRange / preset.range, 0.45, 1.65) * 48 * clamp(Math.max(1, Math.pow(elevation / 2.7, 2)), 1, 4) * typeMultiplier;
  }
  function applySampledLightState(intensity, intensityCurrent) {
    intensity.intensity = intensityCurrent.intensity;
    intensity.color.fromArray(intensityCurrent.color);
    intensity.visible = intensityCurrent.intensity > 0.000001 || !intensityCurrent.complete;
  }
  function tickLightTransitionStates(nowMs, forceRefresh = false) {
    if (isCapturingFrame === objectValue) {
      if (transitionScopeGroup !== worldGroup || transitionScopeChild !== worldGroup?.children[0]) {
        transitionScopeGroup = worldGroup;
        transitionScopeChild = worldGroup?.children[0];
        get = collectWorldItemKeys();
        lightRecordCache = new Map(collectVisibleLights().map(itemKey => [itemKey.itemKey, itemKey]));
        lightKeysRebuilt = true;
      }
      if (forceRefresh || lightKeysRebuilt) {
        for (const [lightKey, lightList] of get) {
          const entry = lightRecordCache.get(lightKey);
          if (!entry) {
            continue;
          }
          const visible = entry.group?.enabled !== false && entry.item.lightBrightness > 0;
          for (const intensity of lightList) {
            intensity.intensity = visible ? finite(intensity.userData.lightOnIntensity, 0) : 0;
            intensity.visible = visible;
            intensity.color.setHex(lightEffectColorHex(entry.item.lightTemperature));
          }
        }
      }
      lightKeysRebuilt = false;
    }
    for (const [transitionKey, transitionList] of size) {
      applySampledLightState(transitionKey, sampleLightTransition(transitionList, nowMs));
    }
  }
  function smoothstepLerp(transition, nowMs) {
    const progress = transition.duration ? clamp((nowMs - transition.started) / transition.duration, 0, 1) : 1;
    return transition.from + (transition.to - transition.from) * progress * progress * (3 - progress * 2);
  }
  function stopOverlayFadeLoop() {
    if (overlayFadeFrameHandle) {
      cancelAnimationFrame(overlayFadeFrameHandle);
    }
    overlayFadeFrameHandle = 0;
    lightFadeCache.clear();
    rs = false;
  }
  function tickOverlayFadeFrame(nowMs) {
    overlayFadeFrameHandle = 0;
    if (!lightCacheReady || previewQualityJustBecameReady || previewLightCache.hidden || isCapturingFrame) {
      stopOverlayFadeLoop();
      return;
    }
    for (const [fadeKey, started] of lightFadeCache) {
      pendingModelLoads.set(fadeKey, smoothstepLerp(started, nowMs));
      if (nowMs >= started.started + started.duration) {
        lightFadeCache.delete(fadeKey);
      }
    }
    rs = lightFadeCache.size > 0;
    blitLightCacheToOverlay();
    if (lightFadeCache.size) {
      overlayFadeFrameHandle = requestAnimationFrame(tickOverlayFadeFrame);
    }
  }
  function beginOverlayFade(outgoingFloorEntries, immediate, fadeOptions) {
    if (!lightCacheReady || previewQualityJustBecameReady || isBakingLightCache || previewLightCache.hidden || isCapturingFrame || isLightCacheCaptureActive || orbitInteractionStarted) {
      return false;
    }
    const fadeTargets = [...outgoingFloorEntries.values()].filter(modeTarget => getPreviewFloorModeCurrent() === "all" || modeTarget.floorId === activeFloorId);
    if (!fadeTargets.every(targetItem => targetItem.previousBrightness === targetItem.item.lightBrightness && targetItem.previousKelvin === targetItem.item.lightTemperature && map.has(previewScopedItemKey(targetItem.floorId, targetItem.item.lightGroupId)))) {
      return false;
    }
    const startedAt = performance.now();
    for (const fadeTarget of fadeTargets) {
      const cacheKey = previewScopedItemKey(fadeTarget.floorId, fadeTarget.item.lightGroupId);
      const cachedEntry = lightFadeCache.get(cacheKey);
      const startValue = cachedEntry ? smoothstepLerp(cachedEntry, startedAt) : finite(pendingModelLoads.get(cacheKey), fadeTarget.wasOn ? 1 : 0);
      lightFadeCache.set(cacheKey, {
        from: startValue,
        to: fadeTarget.isOn ? 1 : 0,
        started: startedAt,
        duration: lightTransitionDurationMs(fadeTarget.wasOn, fadeTarget.isOn, fadeTarget.fadeDuration, {
          ...fadeOptions,
          immediate
        })
      });
    }
    if (overlayFadeFrameHandle) {
      cancelAnimationFrame(overlayFadeFrameHandle);
    }
    tickOverlayFadeFrame(startedAt);
    return true;
  }
  function captureLightCacheFrame() {
    const previousFadeState = new Map(lightFadeCache);
    stopOverlayFadeLoop();
    isCapturingFrame = objectValue;
    if (captureFinishTimer !== null) {
      window.clearTimeout(captureFinishTimer);
    }
    captureFinishTimer = null;
    window.clearTimeout(stageSessionEndTimer);
    stageSessionEndTimer = null;
    lightCacheEpoch += 1;
    previewQualityJustBecameReady = true;
    if (!isBakingLightCache) {
      showPreviewRenderShield();
    }
    setPreviewLightCacheVisible(false);
    const visibleLights = collectVisibleLights();
    get = ensureWorldItemsCached(visibleLights);
    lightRecordCache = new Map(visibleLights.map(lightRecord => [lightRecord.itemKey, lightRecord]));
    transitionScopeGroup = worldGroup;
    transitionScopeChild = worldGroup?.children[0];
    lightKeysRebuilt = true;
    const capturedAt = performance.now();
    for (const lightFilter of visibleLights) {
      const fadeState = previousFadeState.get(lightFilter.groupKey);
      if (!fadeState) {
        continue;
      }
      const fadeFactor = smoothstepLerp(fadeState, capturedAt);
      for (const lightTarget of get.get(lightFilter.itemKey) || []) {
        const baseIntensity = finite(lightTarget.userData.lightOnIntensity, 0);
        const lightColor = lightTarget.color.toArray();
        size.set(lightTarget, createLightTransition({
          intensity: baseIntensity * fadeFactor,
          color: lightColor
        }, {
          intensity: baseIntensity * fadeState.to,
          color: lightColor
        }, capturedAt, Math.max(0, fadeState.started + fadeState.duration - capturedAt)));
      }
    }
    if (size.size && !transitionFrameHandle) {
      transitionFrameHandle = requestAnimationFrame(tickLightTransitionFrame);
    }
    syncOrbitControls();
    return get;
  }
  function finishLightCacheCapture() {
    captureFinishTimer = null;
    if (!floorSelectionQuery && !curtainMotionActive && !vacuumMotionActive && !isLightCacheCaptureActive && !orbitInteractionStarted && !size.size && isCapturingFrame === objectValue) {
      if (isBakingLightCache || isStageWarmup) {
        captureFinishTimer = window.setTimeout(finishLightCacheCapture, 60);
        return;
      }
      isCapturingFrame = null;
      if (isPreviewQualityReady()) {
        previewQualityJustBecameReady = true;
        scheduleAdaptiveQuality(0);
      }
    }
  }
  function tickLightTransitionFrame(timestampMs) {
    transitionFrameHandle = 0;
    tickLightTransitionStates(timestampMs);
    let needsShadowRefresh = false;
    for (const [transition, transitionState] of size) {
      if (!(timestampMs - transitionState.started < transitionState.duration)) {
        size.delete(transition);
        if (!transition.visible) {
          needsShadowRefresh = true;
        }
      }
    }
    if (needsShadowRefresh) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
      scheduleOrbitInteractionWarmup();
    }
    updateLightPreview();
    if (size.size) {
      transitionFrameHandle = requestAnimationFrame(tickLightTransitionFrame);
    } else {
      setStageWarmupActive(false);
      if (isCapturingFrame === objectValue) {
        captureFinishTimer = window.setTimeout(finishLightCacheCapture, 180);
      }
    }
  }
  function stopAllLightAnimations() {
    stopOverlayFadeLoop();
    if (transitionFrameHandle) {
      cancelAnimationFrame(transitionFrameHandle);
    }
    if (captureFinishTimer !== null) {
      window.clearTimeout(captureFinishTimer);
    }
    if (stageWarmupEndTimer !== null) {
      window.clearTimeout(stageWarmupEndTimer);
    }
    transitionFrameHandle = 0;
    captureFinishTimer = null;
    stageWarmupEndTimer = null;
    isStageWarmup = false;
    for (const [transitionKey, transitionEntry] of size) {
      applySampledLightState(transitionKey, {
        ...transitionEntry.to,
        complete: true
      });
    }
    size.clear();
    orbitInteractionStarted = false;
    get.clear();
    lightRecordCache.clear();
    if (isCapturingFrame === objectValue) {
      isCapturingFrame = null;
    }
  }
  const has = new WeakMap();
  const lightGroupEnabledMap = new Map();
  function setLightStates(filter, editor = {}) {
    if (editor.editor) {
      const get = new Map(filter.filter(on => on.on).map(floorId => [layerScopedKey(floorId.floorId, floorId.groupId), floorId]));
      filter = projectDocCurrent.floors.flatMap(id => (id.scene.lightGroups || []).map(id => {
        if (!lightGroupEnabledMap.has(id)) {
          lightGroupEnabledMap.set(id, id.enabled !== false);
        }
        return get.get(layerScopedKey(id.id, id.id)) || {
          floorId: id.id,
          groupId: id.id,
          on: false
        };
      }));
    } else if (lightGroupEnabledMap.size) {
      const has = new Map(filter.map(floorId => [layerScopedKey(floorId.floorId, floorId.groupId), floorId]));
      filter = [...projectDocCurrent.floors.flatMap(id => (id.scene.lightGroups || []).filter(id => lightGroupEnabledMap.has(id) && !has.has(layerScopedKey(id.id, id.id))).map(id => ({
        floorId: id.id,
        groupId: id.id,
        on: lightGroupEnabledMap.get(id),
        brightnessSupported: false,
        temperatureSupported: false
      }))), ...filter];
      lightGroupEnabledMap.clear();
      editor = {
        ...editor,
        immediate: true
      };
    }
    if (!pagehideListenerBound) {
      pagehideListenerBound = true;
      window.addEventListener("pagehide", stopAllLightAnimations, {
        once: true
      });
    }
    const immediate = editor.immediate === true || !hasRunTransitionBefore || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
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
    hasRunTransitionBefore = true;
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
    } else if ([...lookupMap.keys()].some(lookupKey => !map.has(lookupKey))) {
      map = ensureWorldItemsCached(collectVisibleLights().filter(itemKey => lookupMap.has(itemKey.itemKey)));
    }
    let visibilityChanged = false;
    const timestampMs = performance.now();
    for (const [lightRecordKey, value] of lookupMap) {
      if (getPreviewFloorModeCurrent() !== "all" && value.floorId !== activeFloorId) {
        continue;
      }
      const length = map.get(lightRecordKey);
      if (length?.length) {
        for (const userData of length) {
          const existingTransition = size.get(userData);
          const brightness = normalizedLightBrightness(value.item, value.previousBrightness);
          const conditionalValue = get.get(existingTransition)?.includes(userData) && brightness > 1e-7 && userData.userData.lightOnIntensity > 0 ? userData.userData.lightOnIntensity / brightness : estimateLightRenderIntensity(value.item);
          const lightOnIntensity = conditionalValue * normalizedLightBrightness(value.item, value.item.lightBrightness);
          const color = {
            intensity: value.isOn ? lightOnIntensity : 0,
            color: new THREE.Color(lightEffectColorHex(value.item.lightTemperature)).toArray()
          };
          const intensity = existingTransition ? sampleLightTransition(existingTransition, timestampMs) : null;
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
          visibilityChanged ||= visible !== userData.visible;
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
    if (visibilityChanged || ready) {
      syncSpotShadowCastingLights(worldGroup, {
        rebuildAtlas: false
      });
    }
    if (visibilityChanged) {
      scheduleOrbitInteractionWarmup();
    }
    setStageWarmupActive(size.size > 0);
    updateLightPreview();
    if (!transitionFrameHandle) {
      if (size.size) {
        transitionFrameHandle = requestAnimationFrame(tickLightTransitionFrame);
      } else if (ready) {
        captureFinishTimer = window.setTimeout(finishLightCacheCapture, 100);
      }
    }
  }
  function syncRendererSizeCacheKey() {
    renderer.getSize(rendererSizeVector);
    const viewportWidth = Math.max(rendererSizeVector.x || 1, 1);
    const viewportHeight = Math.max(rendererSizeVector.y || 1, 1);
    const renderSizeKey = viewportWidth + "/" + viewportHeight + "/" + viewOffsetFraction + "/" + cameraCurrent.uuid;
    if (renderSizeKey === lastRenderSizeKey) {
      blendCameraProjectionMatrices();
      return;
    }
    lastRenderSizeKey = renderSizeKey;
    if (viewOffsetFraction) {
      cameraCurrent.setViewOffset(viewportWidth, viewportHeight, viewportWidth * viewOffsetFraction / 2, 0, viewportWidth, viewportHeight);
    } else {
      cameraCurrent.clearViewOffset();
    }
    blendCameraProjectionMatrices();
  }
  function applyOrbitControlLimits() {
    orbitControls.enablePan = enablePan;
    orbitControls.enableZoom = enableZoom;
    if (orbitPanMode === "horizontal") {
      orbitControls.minPolarAngle = orbitControls.maxPolarAngle = orbitControls.getPolarAngle();
    }
    if (orbitPanMode === "vertical") {
      orbitControls.minAzimuthAngle = orbitControls.maxAzimuthAngle = orbitControls.getAzimuthalAngle();
    }
  }
  function worldPoint(floorId, planeX, planeY, heightOffset = 0.1) {
    const floor = projectDocCurrent.floors.find(id => id.id === floorId);
    if (!floor) {
      return null;
    }
    const planScale = floor.scene.calibration?.pixelsPerMeter || 1;
    if (getPreviewFloorModeCurrent() === "all") {
      const sortedFloors = [...projectDocCurrent.floors].sort((floorA, floorB) => floorA.elevation - floorB.elevation);
      const projectedPoint = planPointToWorldXZ(floor, {
        x: planeX,
        y: planeY
      });
      return new THREE.Vector3(projectedPoint.x, sortedFloors.indexOf(floor) * projectDocCurrent.previewFloorGap + heightOffset, projectedPoint.z);
    }
    const previousFloorScene = floorSceneCurrent;
    floorSceneCurrent = floor.scene;
    const previewBounds = getPreviewFloorMode();
    floorSceneCurrent = previousFloorScene;
    return new THREE.Vector3((planeX - (previewBounds.minX + previewBounds.maxX) / 2) / planScale, heightOffset, (planeY - (previewBounds.minY + previewBounds.maxY) / 2) / planScale);
  }
  function findFloorOrbitCenter(floorId) {
    if (!projectDocCurrent.floors.some(floor => floor.id === floorId)) {
      return null;
    }
    const planScale = projectDocCurrent.floors.find(floor => floor.id === floorId)?.scene.calibration?.pixelsPerMeter || 1;
    const orbitCenter = worldPoint(floorId, 0, 0, 0);
    return new THREE.Matrix4().makeBasis(worldPoint(floorId, planScale, 0, 0).sub(orbitCenter), new THREE.Vector3(0, 1, 0), worldPoint(floorId, 0, planScale, 0).sub(orbitCenter)).setPosition(orbitCenter);
  }
  function resolveOrbitPanTarget(fallbackTarget) {
    if (orbitBoundsSourceGroup !== worldGroup || orbitBoundsSourceCanvas !== planCanvas) {
      const boundsCenter = computeMultiFloorBoundsCenter(worldPoint);
      const wallCloseSnap = boundsCenter ? null : isWallCloseSnap({
        excludeModelLayers
      });
      orbitBoundsSourceGroup = worldGroup;
      orbitBoundsSourceCanvas = planCanvas;
      orbitBoundsCenter = boundsCenter || (wallCloseSnap.isEmpty() ? null : wallCloseSnap.getCenter(new THREE.Vector3()));
    }
    return (orbitBoundsCenter || fallbackTarget).clone();
  }
  function syncOrbitControlsBinding() {
    orbitPivot ||= resolveOrbitPanTarget(orbitControls.target);
    if (boundOrbitControls === orbitControls) {
      return;
    }
    const controls = orbitControls;
    const camera = cameraCurrent;
    const baseUpdate = controls.update.bind(controls);
    boundOrbitControls = controls;
    const maybeFinishCapture = () => {
      if (isCapturingFrame === objectValue) {
        if (captureFinishTimer !== null) {
          window.clearTimeout(captureFinishTimer);
        }
        captureFinishTimer = null;
        if (!orbitInteractionStarted) {
          captureFinishTimer = window.setTimeout(finishLightCacheCapture, 180);
        }
      }
    };
    controls.addEventListener("start", () => {
      if (!isLightCacheCaptureActive) {
        orbitInteractionStarted = true;
      }
    });
    controls.addEventListener("change", () => {
      if (!isLightCacheCaptureActive) {
        if (orbitInteractionStarted && isPreviewQualityReady() && isCapturingFrame !== objectValue) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now());
          syncSpotShadowCastingLights(worldGroup, {
            rebuildAtlas: false
          });
        }
        maybeFinishCapture();
      }
    });
    controls.addEventListener("end", () => {
      if (!isLightCacheCaptureActive) {
        orbitInteractionStarted = false;
        maybeFinishCapture();
      }
    });
    let enabledFlag = controls.enabled;
    Object.defineProperty(controls, "enabled", {
      configurable: true,
      get: () => enabled && !isLightCacheCaptureActive && enabledFlag,
      set: nextEnabled => {
        enabledFlag = nextEnabled === true;
      }
    });
    Object.defineProperty(controls, "enableRotate", {
      configurable: true,
      get: () => true,
      set() {}
    });
    controls.update = updateDelta => {
      if (isLightCacheCaptureActive) {
        return false;
      }
      const startQuaternion = camera.quaternion.clone();
      const updateResult = baseUpdate(updateDelta);
      if (enabled && startQuaternion.angleTo(camera.quaternion) > 1e-7) {
        const rotationDelta = camera.quaternion.clone().multiply(startQuaternion.invert());
        const offsetVector = orbitPivot.clone().sub(controls.target);
        const rotatedOffset = offsetVector.clone().sub(offsetVector.applyQuaternion(rotationDelta));
        camera.position.add(rotatedOffset);
        controls.target.add(rotatedOffset);
        camera.updateMatrixWorld();
        controls.dispatchEvent({
          type: "change"
        });
        return true;
      }
      return updateResult;
    };
  }
  function collectShadowCastingLights() {
    if (shadowScopeGroup !== worldGroup || shadowScopeChild !== worldGroup?.children[0]) {
      shadowScopeGroup = worldGroup;
      shadowScopeChild = worldGroup?.children[0];
      visibleMeshes = [];
      worldGroup?.traverse(userData => {
        if (["background", "grid"].includes(userData.userData?.exportRole)) {
          visibleMeshes.push(userData);
        }
      });
    }
    for (const visible of visibleMeshes) {
      visible.visible = floorBackgroundVisible && !visible.userData.floorBackgroundHidden;
    }
  }
  const detail = new URLSearchParams(globalThis.window?.location?.search || "").get("reflection-detail") === "low" ? createReflectionDetail({
    THREE,
    requestFrame: () => {
      changed.changed();
      updateLightPreview();
    }
  }) : null;
  const reflectionBaseline = new URLSearchParams(globalThis.window?.location?.search || "").get("performance-diagnostics") === "1" && new URLSearchParams(window.location.search).get("reflection-work") === "baseline";
  const changed = createGroundReflections({
    detail: detail,
    THREE,
    renderer,
    scene: previewSceneCurrent,
    getRoot: () => worldGroup,
    getSceneRevision: () => planCanvas,
    floorLighting: yt,
    cull: !reflectionBaseline,
    blur: false,
    syncLighting: sceneState => reflectionBaseline ? studioReady?.sync(sceneState, true) : studioReady?.syncCamera(sceneState),
    requestFrame: () => updateLightPreview(),
    getStateKey: () => [planCanvas, floorSelectionQuery, yt ? "" : lightCacheEpoch, lightCacheReady, renderer.toneMappingExposure].join("|")
  });
  const entry = new URLSearchParams(globalThis.window?.location?.search || "").get("floorEffects");
  let suspendedState = false;
  let reflectionsActive = false;
  const motionPresentation = createMotionPresentation({
    reflections(active) {
      reflectionsActive = active;
      changed.setSuspended?.(suspendedState || reflectionsActive, {
        fade: !suspendedState
      });
    },
    shadows(active) {
      renderCache?.setVisibleFloor?.(getPreviewFloorModeCurrent() === "all" ? null : activeFloorId);
      renderCache?.setMotion?.(active);
    }
  });
  function setEditorEffects(effectsEnabled, lightPreview) {
    const suspended = effectsEnabled && !lightPreview;
    renderer.domElement.dataset.editorEffects = effectsEnabled ? lightPreview ? "light-preview" : "paused" : "runtime";
    if (suspendedState !== suspended) {
      suspendedState = suspended;
      changed.setSuspended?.(suspendedState || reflectionsActive);
      updateLightPreview();
    }
  }
  const followLiveEntry = (yt || entry === "follow") && entry !== "deferred";
    let shadowMotionStartedAt = null;
  let autoUpdate = true;
  const hasNext = new Map();
  function setShadowMapAutoUpdate(active) {
    if (floorShadowMotionActive !== !!active) {
      floorShadowMotionActive = !!active;
      if (followLiveEntry) {
        if (active) {
          autoUpdate = renderer.shadowMap.autoUpdate;
        }
        renderer.shadowMap.autoUpdate = active ? true : autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        studioReady?.setMotion?.(active, true);
        return;
      }
      if (active) {
        shadowMotionStartedAt = null;
        autoUpdate = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = false;
        shadowAtlas?.setEnabled(false);
        previewSceneCurrent.traverse(light => {
          if (!!light.isLight && !!light.castShadow && !!light.shadow) {
            if (!hasNext.has(light.shadow)) {
              hasNext.set(light.shadow, light.shadow.intensity ?? 1);
            }
            light.shadow.intensity = 0;
          }
        });
      } else {
        renderer.shadowMap.autoUpdate = autoUpdate;
        renderer.shadowMap.needsUpdate = true;
        shadowMotionStartedAt = performance.now();
        shadowAtlas?.setEnabled(true);
      }
      studioReady?.setMotion?.(active);
    }
  }
  function tickShadowIntensityFade() {
    if (floorShadowMotionActive || shadowMotionStartedAt === null) {
      return;
    }
    const nowMs = Math.min(1, (performance.now() - shadowMotionStartedAt) / 280);
    for (const [shadowRef, targetIntensity] of hasNext) {
      shadowRef.intensity = targetIntensity * nowMs;
    }
    if (nowMs < 1) {
      updateLightPreview();
    } else {
      hasNext.clear();
      shadowMotionStartedAt = null;
    }
  }
  const profileFrameWork = (frameRequest, work) => typeof fitCameraToSelectionCurrent == "function" ? fitCameraToSelectionCurrent(frameRequest, work) : work();
  const finish = createFloorTransition({
    THREE,
    getRoot: () => worldGroup,
    dispose: disposeObject3dResources,
    release,
    suspendReflections: suspended => {
      motionPresentation.floor(suspended);
      setShadowMapAutoUpdate(suspended);
    },
    invalidate: forceFull => {
      if (forceFull) {
        orbitPivot = null;
        orbitBoundsSourceGroup = null;
        orbitBoundsSourceCanvas = undefined;
        orbitBoundsCenter = null;
        syncOrbitControlsBinding();
      }
      if (followLiveEntry && !forceFull) {
        flushPlanZoomFrame();
      }
      requestRender(forceFull ? {
        scene: true,
        shadows: true
      } : {
        preserveLightCache: true
      });
    }
  });
  renderCache?.setFrameProvider?.(frameIndex => {
    const node = finish.records.find(id => id.id === frameIndex);
    if (node) {
      node.node.updateWorldMatrix(true, false);
      return node.node.matrixWorld.clone().multiply(node.baseFrame);
    } else {
      return findFloorOrbitCenter(frameIndex);
    }
  });
  studioReady?.setMotionTransformProvider?.(motionFrameIndex => {
    const node = finish.records.find(id => id.id === motionFrameIndex);
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
  const curtainShadowRefreshMesh = new THREE.Mesh(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([], 3)), new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    depthTest: false
  }));
  curtainShadowRefreshMesh.name = "interaction3d-curtain-shadow-refresh";
  curtainShadowRefreshMesh.frustumCulled = false;
  curtainShadowRefreshMesh.renderOrder = -1000000000;
  curtainShadowRefreshMesh.layers.enableAll();
  curtainShadowRefreshMesh.onBeforeRender = () => {
    if (shadowVisibilityChanged && !floorShadowMotionActive) {
      try {
        shadowVisibilityChanged = shadowAtlas ? !shadowAtlas.refreshGeometry(worldGroup, shadowBounds) : false;
      } catch (error) {
        console.error(error);
        shadowVisibilityChanged = true;
      }
    }
  };
  previewSceneCurrent.add(curtainShadowRefreshMesh);
  globalThis.window?.addEventListener("pagehide", () => {
    curtainShadowRefreshMesh.removeFromParent();
    curtainShadowRefreshMesh.geometry.dispose();
    curtainShadowRefreshMesh.material.dispose();
  }, {
    once: true
  });
  previewSceneCurrent.onBeforeRender = function (...renderArgs) {
    if (changed.stats.inCapture) {
      if (reflectionBaseline) {
        studioReady?.sync(renderArgs[2], true);
      }
      return;
    }
    tickShadowIntensityFade();
    if (!floorShadowMotionActive) {
      profileFrameWork("curtains", () => curtainFrameWorkCallback?.());
    }
    if (shadowVisibilityChanged && !floorShadowMotionActive) {
      if (curtainScopeGroup !== worldGroup || curtainScopeCanvas !== planCanvas) {
        curtainScopeGroup = worldGroup;
        curtainScopeCanvas = planCanvas;
        shadowLights = [];
        shadowBounds = [];
        worldGroup?.updateWorldMatrix(true, true);
        worldGroup?.traverse(userData => {
          if (userData.userData?.environmentModelType === "curtain") {
            shadowBounds.push(new THREE.Box3().setFromObject(userData));
          }
        });
        previewSceneCurrent.traverse(isLight => {
          if (isLight.isLight && isLight.castShadow && isLight.shadow) {
            shadowLights.push(isLight);
          }
        });
      }
      for (const shadow of shadowLights) {
        shadow.shadow.needsUpdate = true;
      }
      renderCache?.invalidate(previousLightKeys, true);
    }
    profileFrameWork("lighting-and-contact", () => applyVar?.apply(this, renderArgs));
    if (!floorShadowMotionActive) {
      releaseRoot?.setRoot(worldGroup, planCanvas + ":" + importPlan);
      setRoot?.setRoot(worldGroup, planCanvas);
    }
    collectShadowCastingLights();
    syncRendererSizeCacheKey();
    if (!renderer.getRenderTarget()) {
      profileFrameWork("reflections", () => changed.render(renderArgs[2]));
      const reflectionStats = JSON.stringify({
        ...changed.stats,
        detail: detail?.stats
      });
      if (renderer.domElement.dataset.reflectionStats !== reflectionStats) {
        renderer.domElement.dataset.reflectionStats = reflectionStats;
      }
    }
  };
  function recreateOrbitControlsAtTarget(targetPoint = orbitControls.target.clone()) {
    const cameraPosition = cameraCurrent.position.clone();
    orbitControls.dispose();
    orbitControls = createOrbitControls(cameraCurrent);
    cameraCurrent.position.copy(cameraPosition);
    orbitControls.target.copy(targetPoint);
    const camDistance = Math.max(cameraPosition.distanceTo(targetPoint), 0.001);
    const polarAngle = cameraPosition.clone().sub(targetPoint).normalize().angleTo(cameraCurrent.up);
    orbitControls.minDistance = Math.min(2, camDistance);
    orbitControls.maxDistance = Math.max(100, camDistance * 2);
    orbitControls.minZoom = Math.min(0.35, cameraCurrent.zoom);
    orbitControls.maxZoom = Math.max(6, cameraCurrent.zoom);
    orbitControls.maxPolarAngle = Math.max(Math.PI * 0.49, polarAngle + 0.00001);
    orbitControls.enableRotate = true;
    orbitControls.enabled = enabled;
    orbitControls.update();
    applyOrbitControlLimits();
    syncOrbitControlsBinding();
  }
  return {
    onCameraChange(cameraFrameListener) {
      const rendererDomElement = renderer.domElement;
      rendererDomElement.addEventListener("hb-i3d-camera-frame", cameraFrameListener);
      return () => rendererDomElement.removeEventListener("hb-i3d-camera-frame", cameraFrameListener);
    },
    createFrameLoop: loop => createDemandFrameLoop(loop),
    setPresentedVisible(presentedVisible) {
      renderer.domElement.dispatchEvent?.(new CustomEvent("hb-i3d-parent-visibility", {
        detail: presentedVisible === true
      }));
    },
    THREE,
    container: selectEl("#preview-3d"),
    canvas: renderer.domElement,
    get groundReflections() {
      return changed;
    },
    invalidateReflections(invalidateReason) {
      changed.changed(invalidateReason);
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
    setEnvironmentScene(sceneDisposer) {
      releaseRoot = sceneDisposer;
    },
    setEnvironmentAirflow(airflowDisposer) {
      setRoot = airflowDisposer;
    },
    setCurtainSync(frameWorkCallback) {
      curtainFrameWorkCallback = frameWorkCallback;
    },
    curtainFrame({
      key: frameKey,
      structure: structureKey,
      floorIds: floorIds = [],
      moving: moving
    }) {
      const frameChanged = frameKey !== saveState;
      const wasActive = curtainMotionActive;
      if (!!frameChanged || wasActive !== moving) {
        if (frameChanged) {
          try {
            const parseFrameGroups = framesJson => {
              const lookupMap = new Map();
              for (const framePair of JSON.parse(framesJson)) {
                const pairKey = framePair[1];
                if (!lookupMap.has(pairKey)) {
                  lookupMap.set(pairKey, []);
                }
                lookupMap.get(pairKey).push(framePair);
              }
              return lookupMap;
            };
            const keysVar = parseFrameGroups(saveState);
            const keys = parseFrameGroups(frameKey);
            changed.changed([...new Set([...keysVar.keys(), ...keys.keys()])].filter(groupKey => JSON.stringify(keysVar.get(groupKey)) !== JSON.stringify(keys.get(groupKey))));
          } catch {
            changed.changed(floorIds);
          }
        }
        if (structureKey !== importPlan) {
          shadowAtlas?.prepareRoot(worldGroup);
          studioReady?.invalidate();
        }
        previousLightKeys = [...new Set([...trackedLightKeys, ...floorIds])];
        trackedLightKeys = floorIds;
        if (frameChanged || moving) {
          if (!wasActive) {
            captureLightCacheFrame();
            tickLightTransitionStates(performance.now(), true);
          }
          if (frameChanged) {
            shadowVisibilityChanged = true;
          }
          lightCacheEpoch += 1;
          previewQualityJustBecameReady = true;
          setPreviewLightCacheVisible(false);
        }
        saveState = frameKey;
        curtainMotionActive = moving;
        importPlan = structureKey;
        if (!moving) {
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
    setVacuumMoving(vacuumMoving) {
      const movingChanged = vacuumMoving === true;
      if (movingChanged !== vacuumMotionActive) {
        vacuumMotionActive = movingChanged;
        canvasEmpty++;
        if (movingChanged) {
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
    environmentModelPose(floorId, modelId) {
      let userData;
      worldGroup?.traverse(userDataCurrent => {
        if (userDataCurrent.userData?.environmentFloorId === floorId && userDataCurrent.userData?.environmentModelId === modelId) {
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
    setEnvironmentActive(environmentActive) {
      const shouldBeActive = environmentActive === true;
      if (shouldBeActive !== floorSelectionQuery) {
        if (shouldBeActive) {
          captureLightCacheFrame();
          tickLightTransitionStates(performance.now(), true);
        }
        floorSelectionQuery = shouldBeActive;
        if (!shouldBeActive) {
          finishLightCacheCapture();
        }
        requestRender();
      }
    },
    pickEnvironmentModel(screenX, screenY, models = [], sampleRadius = 0) {
      if (!worldGroup || !models.length) {
        return null;
      }
      const width = renderer.domElement.getBoundingClientRect();
      if (!width.width || !width.height) {
        return null;
      }
      const wantedModelKeys = new Set(models.map(floorId => JSON.stringify([floorId.floorId, floorId.modelId])));
      const modelByMesh = new Map();
      const materialList = [];
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
        if (!!floorId && !!wantedModelKeys.has(JSON.stringify([floorId.floorId, floorId.modelId])) && !!(Array.isArray(material.material) ? material.material : [material.material]).some(visible => visible && visible.visible !== false && visible.opacity !== 0)) {
          modelByMesh.set(material, floorId);
          materialList.push(material);
          if (material.userData?.curtainMotionPanel) {
            add.add(JSON.stringify([floorId.floorId, floorId.modelId]));
          }
        }
      });
      const cacheKey = materialList.filter(userData => {
        const floorId = modelByMesh.get(userData);
        return !add.has(JSON.stringify([floorId.floorId, floorId.modelId])) || userData.userData?.curtainMotionPanel;
      });
      const setFromCamera = new THREE.Raycaster();
      const radiusLimit = Math.max(0, Math.min(12, sampleRadius));
      const sampleOffsets = [[0, 0], ...(radiusLimit ? [[radiusLimit, 0], [-radiusLimit, 0], [0, radiusLimit], [0, -radiusLimit], [radiusLimit * 0.7, radiusLimit * 0.7], [-radiusLimit * 0.7, radiusLimit * 0.7], [radiusLimit * 0.7, -radiusLimit * 0.7], [-radiusLimit * 0.7, -radiusLimit * 0.7]] : [])];
      for (const [offsetX, sampleOffsetY] of sampleOffsets) {
        setFromCamera.setFromCamera(new THREE.Vector2((screenX + offsetX - width.left) / width.width * 2 - 1, 1 - (screenY + sampleOffsetY - width.top) / width.height * 2), cameraCurrent);
        for (const object of setFromCamera.intersectObjects(cacheKey, false)) {
          const visible = Array.isArray(object.object.material) ? object.object.material[object.face?.materialIndex || 0] : object.object.material;
          if (visible?.visible !== false && visible?.opacity !== 0) {
            return modelByMesh.get(object.object);
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
    transformCamera(requestedPose, requestedFloorId, animate = false) {
      return transformSceneCamera(requestedPose, combinedFixedCameraView, projectDocCurrent, requestedFloorId, animate);
    },
    async readSceneUpdate(abortSignal) {
      const queryParams = new URLSearchParams(window.location.search);
      const constructedURLSearchParams = new URLSearchParams({
        projectId: queryParams.get("projectId") || "",
        since: currentStudioDocument.syncKey || ""
      });
      const scene = await withRequestTimeout(15000, async signal => {
        const response = await fetch("/api/v1/modules/interaction3d/scenes/" + encodeURIComponent(queryParams.get("sceneId") || "") + "/current?" + constructedURLSearchParams, {
          credentials: "same-origin",
          signal
        });
        if (response.status === 204) {
          return null;
        }
        if (!response.ok) {
          throw new Error("户型同步暂时不可用");
        }
        return response.json();
      }, abortSignal);
      if (!scene) {
        return null;
      }
      const full = sceneUpdatePlan(normalizeProjectDocument(currentStudioDocument.scene), normalizeProjectDocument(scene.scene));
      if (!full.full && !full.floors.length) {
        const baseLighting = normalizeProjectDocument(scene.scene);
        projectDocCurrent.baseLighting = baseLighting.baseLighting;
        for (const incomingFloor of baseLighting.floors) {
          const name = projectDocCurrent.floors.find(candidateFloor => candidateFloor.id === incomingFloor.id);
          if (name) {
            name.name = incomingFloor.name;
          }
        }
        if (full.lighting && !flag) {
          callback();
          applyBaseLighting(baseLighting.baseLighting);
        }
        currentStudioDocument = scene;
        return null;
      }
      return scene;
    },
    get savedScene() {
      return currentStudioDocument;
    },
    async replaceScene(scene) {
      const document = normalizeProjectDocument(scene.scene);
      const floors = sceneUpdatePlan(normalizeProjectDocument(currentStudioDocument.scene), document);
      finish.finish();
      callback(floors.full || floors.lighting ? null : new Set(floors.floors));
      stopAllLightAnimations();
      firstPresentPromise = null;
      orbitPivot = null;
      hasRunTransitionBefore = false;
      shadowScopeGroup = null;
      shadowScopeChild = null;
      if (!floors.full) {
        document.activeFloorId = activeFloorId;
        document.previewFloorMode = projectDocCurrent.previewFloorMode;
        for (const scene of document.floors) {
          scene.scene.settings.livePreviewEnabled = true;
          const found = projectDocCurrent.floors.find(id => id.id === scene.id);
          if (found && !floors.floors.includes(scene.id)) {
            for (const id of scene.scene.lightGroups) {
              const enabled = found.scene.lightGroups.find(candidateGroup => candidateGroup.id === id.id);
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
        currentStudioDocument = scene;
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
      return (computeMultiFloorBoundsCenter(worldPoint) || resolveOrbitPanTarget(orbitControls.target)).toArray();
    },
    setOrbitPivot(pivotArray) {
      orbitPivot = pivotArray ? new THREE.Vector3().fromArray(pivotArray) : null;
      syncOrbitControlsBinding();
    },
    orbitCameraPose(target, yawAngle) {
      const up = structuredClone(target);
      const yawDelta = finite(yawAngle, 0) % (Math.PI * 2);
      if (Math.abs(yawDelta) < 1e-12 || Math.abs(Math.abs(yawDelta) - Math.PI * 2) < 1e-12) {
        return up;
      }
      orbitPivot ||= resolveOrbitPanTarget(new THREE.Vector3().fromArray(target.target));
      const angle = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);
      for (const poseKey of ["position", "target"]) {
        up[poseKey] = new THREE.Vector3().fromArray(target[poseKey]).sub(orbitPivot).applyQuaternion(angle).add(orbitPivot).toArray();
      }
      let clone = new THREE.Vector3().fromArray(target.up || [0, 1, 0]);
      const sub = new THREE.Vector3().fromArray(target.position).sub(new THREE.Vector3().fromArray(target.target));
      if (clone.lengthSq() < 1e-12 || clone.clone().cross(sub).lengthSq() < 1e-12) {
        const topRotationRad = THREE.MathUtils.degToRad(finite(target.topRotation, 0));
        clone = new THREE.Vector3(Math.sin(topRotationRad), 0, -Math.cos(topRotationRad));
        if (clone.clone().cross(sub).lengthSq() < 1e-12) {
          clone.set(1, 0, 0);
        }
      }
      up.up = clone.applyQuaternion(angle).toArray();
      return up;
    },
    setFocusViewport(viewportFraction) {
      const clampedValue = clamp(finite(viewportFraction, 0), 0, 0.7);
      if (clampedValue !== viewOffsetFraction) {
        viewOffsetFraction = clampedValue;
        syncRendererSizeCacheKey();
        requestRender({
          preserveLightCache: false
        });
      }
    },
    beginCameraMotion(targetMode, targetHeight, presentation = "focus") {
      motionPresentation.camera(!!targetHeight, {
        live: presentation === "focus"
      });
      const mode = this.cameraState();
      const needsHeightTransition = targetHeight && (height || mode.mode !== targetMode);
      const fromHeight = needsHeightTransition ? height?.height ?? resetOrbitTarget(cameraCurrent, orbitControls.target) : 0;
      const fromWeight = height?.weight ?? (mode.mode === "perspective" ? 1 : 0);
      height = null;
      isLightCacheCaptureActive = true;
      orbitInteractionStarted = false;
      if (isPreviewQualityReady()) {
        captureLightCacheFrame();
        tickLightTransitionStates(performance.now());
        syncSpotShadowCastingLights(worldGroup, {
          rebuildAtlas: false
        });
        updateLightPreview();
      }
      setCameraProjectionMode(targetMode, {
        preserveView: true,
        deferControlUpdate: true
      });
      recreateOrbitControlsAtTarget();
      syncOrbitControlsBinding();
      lockPreviewOrbit();
      if (needsHeightTransition) {
        height = {
          fromHeight,
          toHeight: computeCameraViewHeight(targetHeight),
          height: fromHeight,
          fromWeight,
          toWeight: targetMode === "perspective" ? 1 : 0,
          weight: fromWeight
        };
        return mode;
      } else {
        return this.cameraState();
      }
    },
    applyCameraFrame(cameraPose, frameProgress, frameViewportFraction) {
      const clampedValue = clamp(finite(frameViewportFraction, 0), 0, 0.7);
      const offsetUnchanged = clampedValue === viewOffsetFraction;
      viewOffsetFraction = clampedValue;
      this.applyCameraPose(cameraPose, frameProgress, offsetUnchanged);
      motionPresentation.advance(frameProgress);
    },
    applyCameraPose(view, heightBlend = 1, preserveLightCache = true) {
      if (height) {
        if (heightBlend >= 1) {
          height = null;
        } else {
          height.height = height.fromHeight + (height.toHeight - height.fromHeight) * heightBlend;
          height.weight = height.fromWeight + (height.toWeight - height.fromWeight) * heightBlend;
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
      isLightCacheCaptureActive = false;
      recreateOrbitControlsAtTarget();
      unlockPreviewOrbit();
      requestRender();
      if (typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue && !size.size) {
        if (captureFinishTimer !== null) {
          window.clearTimeout(captureFinishTimer);
        }
        captureFinishTimer = window.setTimeout(finishLightCacheCapture, 180);
      }
    },
    setFloorGap(gapValue) {
      const normalizedGap = Number.isFinite(gapValue) ? clamp(gapValue, 0, 20) : null;
      if (normalizedGap !== null || floorGapOverride !== null) {
        const previewFloorGap = normalizedGap ?? normalizeProjectDocument(currentStudioDocument.scene).previewFloorGap;
        if (Math.abs(projectDocCurrent.previewFloorGap - previewFloorGap) > 0.000001) {
          finish.finish();
          const allFloorsPreview = getPreviewFloorModeCurrent() === "all";
          const reusePlan = allFloorsPreview ? finish.take(projectDocCurrent.floors.map(id => id.id), findFloorOrbitCenter, true) : [];
          projectDocCurrent.previewFloorGap = previewFloorGap;
          for (const id of reusePlan) {
            finish.reuse(id, findFloorOrbitCenter(id.id));
          }
          if (allFloorsPreview) {
            orbitPivot = null;
            orbitBoundsSourceGroup = null;
            flushPlanZoomFrame();
            requestRender({
              scene: true,
              shadows: true
            });
          }
        }
      }
      floorGapOverride = normalizedGap;
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
      const backgroundVisibilityChanged = floorBackgroundVisible !== (baseLightingCurrent.backgroundVisible !== false);
      floorBackgroundVisible = baseLightingCurrent.backgroundVisible !== false;
      document.body.classList.toggle("is-background-hidden", !floorBackgroundVisible);
      collectShadowCastingLights();
      const floorBrightness = normalizeBaseLighting(baseLightingCurrent.baseLighting || projectDocCurrent.baseLighting);
      if (studioReady?.setFloorBrightness(floorBrightness.floorBrightness)) {
        requestRender();
      }
      if (JSON.stringify(floorBrightness) !== JSON.stringify(baseLighting)) {
        applyBaseLighting(floorBrightness);
      }
      if (backgroundVisibilityChanged) {
        requestRender();
      }
    },
    floorDefaultCamera(floorId) {
      const fixedView = floorId === "all" ? combinedFixedCameraView?.combinedFixedCameraView : combinedFixedCameraView?.floors.find(floor => floor.id === floorId)?.scene.settings?.fixedCameraView;
      if (!fixedView) {
        return null;
      }
      const objectValue = {
        mode: fixedView.mode,
        view: fixedView.view,
        topRotation: fixedView.topRotation,
        position: [fixedView.position.x, fixedView.position.y, fixedView.position.z],
        target: [fixedView.target.x, fixedView.target.y, fixedView.target.z],
        zoom: 1,
        frameSize: fixedView.visibleHeight,
        focalLength: fixedView.focalLength || 50
      };
      return transformSceneCamera(objectValue, combinedFixedCameraView, projectDocCurrent, floorId);
    },
    get floorTransitionActive() {
      return finish.active;
    },
    advanceFloorTransition(transitionProgress, cameraSpec) {
      const projections = cameraSpec ? {
        height: height ? height.fromHeight + (height.toHeight - height.fromHeight) * transitionProgress : computeCameraViewHeight(cameraSpec),
        weight: height ? height.fromWeight + (height.toWeight - height.fromWeight) * transitionProgress : cameraSpec.mode === "perspective" ? 1 : 0,
        distance: new THREE.Vector3().fromArray(cameraSpec.position).distanceTo(new THREE.Vector3().fromArray(cameraSpec.target))
      } : null;
      profileFrameWork("motion-and-settle", () => finish.sample(transitionProgress, cameraSpec, projections));
    },
    setFloorSlideCameras(fromSpec, toSpec) {
      const viewDistance = cameraSpec => new THREE.Vector3().fromArray(cameraSpec.position).distanceTo(new THREE.Vector3().fromArray(cameraSpec.target));
      finish.setSlideCameras(fromSpec, toSpec, {
        from: {
          height: height?.fromHeight ?? computeCameraViewHeight(fromSpec),
          weight: height?.fromWeight ?? (fromSpec.mode === "perspective" ? 1 : 0),
          distance: viewDistance(fromSpec)
        },
        to: {
          height: computeCameraViewHeight(toSpec),
          weight: toSpec.mode === "perspective" ? 1 : 0,
          distance: viewDistance(toSpec)
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
    recordFloorFrame(active, details) {
      if (typeof setPerfMotionActive == "function") {
        setPerfMotionActive(active, details);
      }
    },
    get floorEffectsFollow() {
      return followLiveEntry;
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
      const floorsByElevation = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation).map(id => id.id);
      const buildFloorBasis = floorId => {
        const scene = projectDocCurrent.floors.find(id => id.id === floorId);
        const pixelsPerMeter = scene.scene.calibration?.pixelsPerMeter || 1;
        const originPoint = this.worldPoint(floorId, 0, 0, 0);
        return new THREE.Matrix4().makeBasis(this.worldPoint(floorId, pixelsPerMeter, 0, 0).sub(originPoint), new THREE.Vector3(0, 1, 0), this.worldPoint(floorId, 0, pixelsPerMeter, 0).sub(originPoint)).setPosition(originPoint);
      };
      const previewingAllFloors = getPreviewFloorModeCurrent() === "all";
      const scrollTargetFloorId = previewingAllFloors ? "all" : activeFloorId;
      const findVar = profileFrameWork("detach-source", () => finish.take(previewingAllFloors ? floorsByElevation : [activeFloorId], releaseCachedNode, previewingAllFloors));
      for (const cacheKey of findVar) {
        cacheKey.cacheKey ||= scrollTargetFloorId;
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
      const floorBoundsSize = bounds.getSize(new THREE.Vector3());
      const handoffNeeded = !previewingAllFloors && target !== "all";
      const conditionalValue = handoffNeeded ? new THREE.Vector3(0, 1, 0).applyQuaternion(cameraCurrent.quaternion).normalize() : null;
      const value = handoffNeeded ? resetOrbitTarget(cameraCurrent, orbitControls.target) * 1.2 : Math.max(20, floorBoundsSize.x, floorBoundsSize.z) * 1.5;
      const scrollFrom = findVar.find(record => Number.isFinite(record.scrollPosition))?.scrollPosition ?? floorsByElevation.indexOf(scrollTargetFloorId);
      const targetIndex = floorsByElevation.indexOf(target);
      const handoffRange = handoffNeeded ? floorsByElevation.slice(Math.min(Math.floor(scrollFrom), targetIndex), Math.max(Math.ceil(scrollFrom), targetIndex) + 1) : [];
      const map = target === "all" ? floorsByElevation : [target, ...handoffRange.filter(id => id !== target)];
      const everyVar = map.map(floorId => findVar.find(id => id.id === floorId && id.cacheEpoch === cacheEpoch) || entryMap.get(floorId));
      const reusedCount = everyVar.filter(Boolean).length;
      if (handoffNeeded) {
        for (let index = 0; index < map.length; index++) {
          if (everyVar[index]) {
            continue;
          }
          this.setFloor(map[index]);
          const captured = finish.capture([map[index]], releaseCachedNode, false)[0];
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
      profileFrameWork("set-destination", () => this.setFloor(target, length, releaseCachedNode));
      const center = this.getOrbitCenter();
      const work = profileFrameWork("capture-destination", () => finish.capture(map, releaseCachedNode, target === "all" || map.length > 1));
      for (const cacheKey of work) {
        cacheKey.cacheKey = target;
        cacheKey.cacheEpoch = cacheEpoch;
      }
      profileFrameWork("begin-motion", () => finish.begin(findVar, work, floorsByElevation, value, handoffNeeded, conditionalValue, target));
      curtainFrameWorkCallback?.();
      return center;
    },
    setFloor(floorEntry, optionalValue = null, orbitCenterResolver = findFloorOrbitCenter) {
      const id = projectDocCurrent.floors.find(id => id.id === floorEntry) || projectDocCurrent.floors[0];
      const previewFloorMode = floorEntry === "all" && projectDocCurrent.floors.length > 1 ? "all" : "active";
      if (!!optionalValue || activeFloorId !== id.id || getPreviewFloorModeCurrent() !== previewFloorMode) {
        if (size.size || typeof isCapturingFrame !== "undefined" && isCapturingFrame === objectValue) {
          stopAllLightAnimations();
        }
        hasRunTransitionBefore = false;
        activeFloorId = id.id;
        projectDocCurrent.activeFloorId = id.id;
        floorSceneCurrent = id.scene;
        if (optionalValue) {
          projectDocCurrent.previewFloorMode = previewFloorMode;
          syncPreviewFloorButtons();
          syncFloorCameraChrome();
          const idValue = [...projectDocCurrent.floors].sort((elevation, elevationRight) => elevation.elevation - elevationRight.elevation)[0].id;
          for (const id of optionalValue) {
            finish.reuse(id, orbitCenterResolver(id.id)).traverse(userData => {
              if (["background", "grid"].includes(userData.userData?.exportRole)) {
                userData.userData.floorBackgroundHidden = previewFloorMode === "all" && id.id !== idValue;
                userData.visible = floorBackgroundVisible && !userData.userData.floorBackgroundHidden;
              }
            });
          }
          worldGroup.userData.regionFloorId = id.id;
          if (studioReady) {
            worldGroup.traverse(userData => {
              if (!userData.isLight || !userData.userData.lightItemId) {
                return;
              }
              const lightFloor = projectDocCurrent.floors.find(id => id.id === userData.userData.lightFloorId)?.scene.items.find(id => id.id === userData.userData.lightItemId);
              if (lightFloor) {
                studioReady.register(userData, lightFloor);
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
        orbitPivot = null;
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
    mapLightEffectState: lightEffectState => mapLightEffectState(lightEffectState),
    lightEffectColorHex: lightEffectHex => lightEffectColorHex(lightEffectHex),
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
    setCameraProjection(cameraMode) {
      activeCameraSettings().cameraMode = cameraMode === "perspective" ? "perspective" : "orthographic";
      setCameraProjectionMode(activeCameraSettings().cameraMode, {
        preserveView: true,
        deferControlUpdate: true
      });
      recreateOrbitControlsAtTarget();
    },
    setCameraFocalLength(requestedFocalLength) {
      activeCameraSettings().cameraFocalLength = clamp(finite(requestedFocalLength, 50), 18, 120);
      applyCameraFocalLength();
      requestRender();
    },
    setCameraInteraction(rotationMode = {}) {
      const conditionalValue = ["horizontal", "vertical"].includes(rotationMode.rotationMode) ? rotationMode.rotationMode : "free";
      const value = rotationMode.enabled === true;
      const panInteractionEnabled = rotationMode.panEnabled !== false;
      const zoomInteractionEnabled = rotationMode.zoomEnabled !== false;
      const orbitSettingsChanged = enabled !== value || orbitPanMode !== conditionalValue || enablePan !== panInteractionEnabled || enableZoom !== zoomInteractionEnabled;
      enabled = value;
      orbitPanMode = conditionalValue;
      enablePan = panInteractionEnabled;
      enableZoom = zoomInteractionEnabled;
      if (orbitSettingsChanged) {
        recreateOrbitControlsAtTarget();
      } else {
        orbitControls.enabled = value;
      }
      syncOrbitControlsBinding();
    },
    whenPresented() {
      firstPresentPromise ||= (async () => {
        const externalModelLoads = loadVisibleExternalModels();
        let fadeTimeoutHandle;
        try {
          await Promise.race([Promise.allSettled(externalModelLoads), new Promise(resolve => {
            fadeTimeoutHandle = window.setTimeout(resolve, 8000);
          })]);
        } finally {
          window.clearTimeout(fadeTimeoutHandle);
        }
        refreshStudioChrome();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        collectShadowCastingLights();
        await waitUntilPreviewQualityReady();
        renderer.render(previewSceneCurrent, cameraCurrent);
        await new Promise(requestAnimationFrame);
      })();
      return firstPresentPromise;
    },
    setCameraView(cameraView) {
      activeCameraSettings().cameraView = cameraView === "top" ? "top" : "free";
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
