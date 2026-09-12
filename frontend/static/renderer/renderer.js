import { cameraPopupLayout, cameraPreviewRatio } from "../modules/interaction3d/camera-popup-layout.js?v=20260911-security-camera-popup-v6";
import { coverComponentIsDream, doorWindowPerspectiveCorners, doorWindowPerspectiveMatrix, formatLineChartValue, formatPresenceDuration, iconButtonEffectLightVisualAwaiting, iconButtonEffectLightVisualState, mountCameraMedia, prewarmCameraMedia, presenceHistoryBuckets, presenceMotionEventConfig, presenceSensorPresentation, presenceStateTimestamp, renderAirConditionerAirflowLayer, renderIconButtonEffectLayer, renderLineChartDetails, renderRegisteredComponent, setBuiltinAssetVersions, staticAssetImageSource, vacuumMapImageSource } from "./registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260906-i3d-complete-v6-20260827-runtime-hydration-retry-v1-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
import { randomUuid } from "../utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { popupLayoutMetrics } from "../js/editor/popup-layout.js?v=20260821-electric-bed-combo-v2";
import { bathHeaterModeUsesAirflow, climateControlStructureKey, climateDeviceLabel, climateEffectMode, climateIsPoweredOn, climateIsRunning, climateModeIcon, climateModeLabel, climateOperationModeValues, climateOptionPresentation, climatePowerCommand, climatePresentationMode, climateSwingModeLabel, normalizeClimateCapabilities, reconcileClimateTargetTemperature, resolveClimateDeviceType, waterHeaterStatusLabel } from "./climate.js?v=20260812-presence-phase-v79-20260904-climate-capability-options-v6";
import { applyXiaomiDeviceProfile, resolveXiaomiDeviceProfile } from "./device-profiles.js?v=20260821-electric-bed-sync-v4";
import { relatedEntityLabel, relatedEntityNeedsConfirmation, relatedEntityOptions, relatedEntitySelectService, relatedPopupContext, selectedRelatedEntities, selectedRelatedEntityIds } from "../js/editor/related-entities.js?v=20260825-bath-heater-primary-v1";
import { entityPowerIsOn, entityPowerTarget, entityToggleCommand, optimisticToggleState } from "./entity-power.js?v=20260813-generic-device-power-v2";
import { ICON_VISIBILITY_VIRTUAL_KIND, isVirtualEntityId, parseVirtualEntityId } from "../js/editor/virtual-entities.js?v=20260822-icon-visibility-v1";
import { componentActionIsSupported } from "../js/editor/action-rules.js?v=20260831-action-rules-v1";
import { airflowCanvasOffsetBounds, airflowLayerGeometry, groupedComponentLocalDelta, rotateMultiSelectionTransforms } from "./transform-geometry.js?v=20260901-renderer-transform-geometry-v1";
import { componentHostZIndex, effectCropRectangle, effectCroppedLayerGeometry, effectFadeDuration, effectLayerDimensions, effectReferenceImageTransform, effectSourceDimensions, normalizeIconButtonEffectComponent } from "./effect-geometry.js?v=20260901-renderer-effect-geometry-v2";
import { LIGHT_DETAIL_PRESET_DEFINITIONS, LIGHT_PRESET_MAXIMUM_HOLD_MS, LIGHT_PRESET_MINIMUM_HOLD_MS, LIGHT_PRESET_STABLE_CONFIRMATION_MS, UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT, UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN, hsToRgbColor, lightColorPickerHsFromPoint, lightColorPickerPointFromHs, lightColorServiceData, lightPresetBrightnessServiceData, lightPresetPendingDecision, lightRealtimeCapabilities, lightSupportsColor, lightVisualValueForCapability, relativeLightColorTemperature, rgbToHsColor } from "./light-runtime.js?v=20260901-renderer-light-runtime-v1";
import { entityMetadataIsAvailable } from "./entity-metadata.js?v=20260901-renderer-entity-metadata-v1";
import { relatedVacuumBatteryEntity, vacuumActionService, vacuumBatteryPercent, vacuumSupportedActions } from "./vacuum-runtime.js?v=20260901-renderer-vacuum-runtime-v1";
import { airerDevicePosition, airerPositionCalibration, airerPresentationPosition, airerPresentationPositionForState, airerReportedPosition, airerVisualDrop, coverComponentIsAirer, coverMotorIsReversedForComponent, coverPendingDisplayPosition, coverPositionReachedTarget, coverPresentationState, coverToggleServiceForComponent, dreamCurtainBladeLabel, dreamCurtainIsRetracted, dreamCurtainStatusFromRetraction, dreamCurtainStatusText, dreamCurtainToggleService, learnAirerPositionCalibration, physicalCoverState, relatedAirerCurrentPositionSensor, relatedAirerLightEntity, relatedAirerMotorActionEntities, relatedAirerMotorSpeedSensor, relatedAirerPositionNumberEntity, relatedCoverMotorReverseEntity, relatedDeviceDomainEntity, relatedDeviceEntity, relatedWaterHeaterEntities, runtimeCoverStateIsActive, runtimeEntityStateIsActive, waterHeaterRelatedEntityLabel } from "./cover-runtime.js?v=20260901-renderer-cover-runtime-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
import { playFixedDeviceDropEntrance, playMediaSpeakerEntrance, playStableRuntimeDialogEntrance, runtimeDialogUsesStableMotion } from "./runtime-dialog-motion.js?v=20260901-renderer-dialog-motion-v1";
import { HISTORY_FETCH_TIMEOUT_MS, HistoryRefreshCoordinator, RuntimeEffectImageLoader, RuntimeStaticImageCache, RuntimeVacuumMapImagePreloader, cacheHistorySeries, historyRequestStillRelevant, historySeriesCacheKey } from "./runtime-caches.js?v=20260901-renderer-runtime-caches-v1";
import { collectComponents, collectEntityIds, lineChartRuntimeStateNeedsHydration, syncedLineChartProperties } from "./runtime-document.js?v=20260901-renderer-runtime-document-v1";
export { setBuiltinAssetVersions };
export { airflowCanvasOffsetBounds, airflowLayerGeometry, groupedComponentLocalDelta, rotateMultiSelectionTransforms };
export { componentHostZIndex, effectCroppedLayerGeometry, effectLayerDimensions, effectReferenceImageTransform, normalizeIconButtonEffectComponent };
export { LIGHT_DETAIL_PRESET_DEFINITIONS, LIGHT_PRESET_MAXIMUM_HOLD_MS, LIGHT_PRESET_MINIMUM_HOLD_MS, LIGHT_PRESET_STABLE_CONFIRMATION_MS, UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT, UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN, hsToRgbColor, lightColorPickerHsFromPoint, lightColorPickerPointFromHs, lightColorServiceData, lightPresetBrightnessServiceData, lightPresetPendingDecision, lightRealtimeCapabilities, lightSupportsColor, lightVisualValueForCapability, relativeLightColorTemperature, rgbToHsColor };
export { relatedVacuumBatteryEntity, vacuumActionService, vacuumBatteryPercent, vacuumSupportedActions };
export { airerDevicePosition, airerPositionCalibration, airerPresentationPosition, airerPresentationPositionForState, airerReportedPosition, airerVisualDrop, coverComponentIsAirer, coverMotorIsReversedForComponent, coverPendingDisplayPosition, coverPositionReachedTarget, coverToggleServiceForComponent, dreamCurtainBladeLabel, dreamCurtainIsRetracted, dreamCurtainStatusText, dreamCurtainToggleService, learnAirerPositionCalibration, relatedAirerCurrentPositionSensor, relatedAirerLightEntity, relatedAirerMotorActionEntities, relatedAirerMotorSpeedSensor, relatedAirerPositionNumberEntity, relatedWaterHeaterEntities, waterHeaterRelatedEntityLabel };
export { runtimeDialogUsesStableMotion };
export { HistoryRefreshCoordinator, RuntimeEffectImageLoader, RuntimeStaticImageCache, RuntimeVacuumMapImagePreloader, historyRequestStillRelevant };
export { lineChartRuntimeStateNeedsHydration, syncedLineChartProperties };
const MAX_REALTIME_SUBSCRIBED_ENTITIES = 1000;
const DEFAULT_TARGET_OCCUPANCY = 0.76;
const COMPACT_TARGET_OCCUPANCY = 0.7;
const as = 1.6;
const FILL_AVAILABLE_SCALE = 2;
const FILL_TIGHT_FILL_SCALE = 2.12;
export function runtimeDialogLayout({
  layerWidth,
  layerHeight,
  layoutWidth,
  layoutHeight,
  fillAvailable = false,
  tightFill = false,
  targetOccupancy = DEFAULT_TARGET_OCCUPANCY
}) {
  const count = Math.max(1, Number(layerWidth) || 1);
  const count2 = Math.max(1, Number(layerHeight) || 1);
  const count3 = Math.max(1, Number(layoutWidth) || 1);
  const count4 = Math.max(1, Number(layoutHeight) || 1);
  const safeInset = tightFill ? Math.min(40, Math.max(24, Math.min(count, count2) * 0.03)) : fillAvailable ? Math.min(80, Math.max(32, Math.min(count, count2) * 0.075)) : Math.min(64, Math.max(24, Math.min(count, count2) * 0.05));
  const availableWidth = Math.max(1, count - safeInset * 2);
  const availableHeight = Math.max(1, count2 - safeInset * 2);
  const fitScale = Math.min(availableWidth / count3, availableHeight / count4);
  const count5 = Math.max(0.2, Math.min(1, Number(targetOccupancy) || DEFAULT_TARGET_OCCUPANCY));
  const state = Math.min(count * count5 / count3, count2 * count5 / count4);
  const preferredScale = Math.min(as, state);
  const scale = Math.min(fillAvailable ? tightFill ? FILL_TIGHT_FILL_SCALE : FILL_AVAILABLE_SCALE : preferredScale, fitScale);
  return {
    availableWidth,
    availableHeight,
    fitScale,
    preferredScale,
    safeInset,
    scale: Math.max(0.08, scale)
  };
}
export function runtimeDialogViewport({
  layerLeft = 0,
  layerTop = 0,
  layerWidth,
  layerHeight,
  dashboardLeft,
  dashboardTop,
  dashboardWidth,
  dashboardHeight
}) {
  const asNumber = Number(layerLeft) || 0;
  const asNumber1 = Number(layerTop) || 0;
  const count = Math.max(1, Number(layerWidth) || 1);
  const count2 = Math.max(1, Number(layerHeight) || 1);
  const state = asNumber + count;
  const state1 = asNumber1 + count2;
  const finiteNumber = Number.isFinite(Number(dashboardLeft)) ? Number(dashboardLeft) : asNumber;
  const finiteNumber1 = Number.isFinite(Number(dashboardTop)) ? Number(dashboardTop) : asNumber1;
  const count3 = Math.max(1, Number(dashboardWidth) || count);
  const count4 = Math.max(1, Number(dashboardHeight) || count2);
  const count5 = Math.max(asNumber, finiteNumber);
  const count6 = Math.max(asNumber1, finiteNumber1);
  const size = Math.min(state, finiteNumber + count3);
  const size1 = Math.min(state1, finiteNumber1 + count4);
  const width = Math.max(1, size - count5);
  const height = Math.max(1, size1 - count6);
  return {
    width,
    height,
    centerX: count5 - asNumber + width / 2,
    centerY: count6 - asNumber1 + height / 2
  };
}
function assignComponentIds(component) {
  component.id = "component-" + randomUuid();
  for (const child of component.children || []) {
    assignComponentIds(child);
  }
  return component;
}
function eventHasCommandModifier(event) {
  const platformId = navigator.userAgentData?.platform || navigator.platform || "";
  const isApplePlatform = /mac|iphone|ipad|ipod/i.test(platformId);
  return event.altKey || event.ctrlKey || isApplePlatform && event.metaKey;
}
function isComponentActionSupported(component, action) {
  return componentActionIsSupported(component, action);
}
export function componentDialogTitle(component, fallbackTitle) {
  const properties = component?.properties || {};
  return String(properties.label || "").trim() || fallbackTitle;
}
export function popupModuleDialogTitle(moduleConfig, entityState, fallbackTitle = "") {
  return String(moduleConfig?.title || "").trim() || String(fallbackTitle || "").trim() || String(entityState?.attributes?.friendly_name || "").trim() || String(moduleConfig?.entityId || "").trim();
}
function appendAirerVisual(parentEl) {
  const ownerDocument = parentEl.ownerDocument;
  const airerVisualEl = ownerDocument.createElement("span");
  airerVisualEl.className = "hb-airer-visual";
  const airerVisualGlowEl = ownerDocument.createElement("i");
  airerVisualGlowEl.className = "hb-airer-visual-glow";
  const airerVisualBodyEl = ownerDocument.createElement("span");
  airerVisualBodyEl.className = "hb-airer-visual-body";
  const airerVisualLampEl = ownerDocument.createElement("i");
  airerVisualLampEl.className = "hb-airer-visual-lamp";
  airerVisualBodyEl.append(airerVisualLampEl);
  const airerVisualLiftsEl = ownerDocument.createElement("span");
  airerVisualLiftsEl.className = "hb-airer-visual-lifts";
  airerVisualLiftsEl.append(ownerDocument.createElement("i"), ownerDocument.createElement("i"));
  const airerVisualRackEl = ownerDocument.createElement("span");
  airerVisualRackEl.className = "hb-airer-visual-rack";
  for (let cover = 0; cover < 4; cover += 1) {
    airerVisualRackEl.append(ownerDocument.createElement("i"));
  }
  airerVisualEl.append(airerVisualGlowEl, airerVisualBodyEl, airerVisualLiftsEl, airerVisualRackEl);
  parentEl.append(airerVisualEl);
}
function coverLiftStateLabel(state) {
  return {
    open: "已升起",
    closed: "已下降",
    opening: "正在升起",
    closing: "正在下降"
  }[state] || "";
}
function buildSwitchVisual({
  label = "开关",
  interactive = true,
  onToggle = null,
  compact = false,
  momentary = false
} = {}) {
  const visual = document.createElement("button");
  visual.type = "button";
  visual.className = "hb-switch-visual";
  visual.classList.toggle("is-momentary", momentary);
  visual.inert = !interactive;
  visual.setAttribute("aria-disabled", String(!interactive));
  const switchVisualAuraEl = document.createElement("i");
  switchVisualAuraEl.className = "hb-switch-visual-aura";
  const switchVisualPlateEl = document.createElement("span");
  switchVisualPlateEl.className = "hb-switch-visual-plate";
  const switchVisualIndicatorEl = document.createElement("i");
  switchVisualIndicatorEl.className = "hb-switch-visual-indicator";
  const switchVisualRockerEl = document.createElement("span");
  switchVisualRockerEl.className = "hb-switch-visual-rocker";
  const element = document.createElement("i");
  element.className = "hb-switch-visual-mark off";
  element.textContent = "○";
  const element2 = document.createElement("i");
  element2.className = "hb-switch-visual-mark on";
  element2.textContent = "┃";
  switchVisualRockerEl.append(element, element2);
  switchVisualPlateEl.append(switchVisualIndicatorEl, switchVisualRockerEl);
  visual.append(switchVisualAuraEl, switchVisualPlateEl);
  const switchVisualCopyEl = compact ? document.createElement("span") : null;
  const element3 = compact ? document.createElement("strong") : null;
  const element4 = compact ? document.createElement("output") : null;
  if (compact) {
    switchVisualCopyEl.className = "hb-switch-visual-copy";
    element3.className = "hb-switch-visual-copy-label";
    element4.className = "hb-switch-visual-copy-state";
    element3.textContent = label;
    switchVisualCopyEl.append(element3, element4);
    visual.append(switchVisualCopyEl);
    visual.classList.add("is-compact");
  }
  const sync = (arg, {
    unavailable = false,
    pending = false,
    success = false
  } = {}) => {
    const state = (momentary ? pending : !!arg) && !unavailable;
    visual.classList.toggle("is-on", state);
    visual.classList.toggle("is-unavailable", unavailable);
    visual.classList.toggle("is-pending", pending);
    visual.classList.toggle("is-success", success);
    visual.setAttribute("aria-pressed", String(state));
    visual.setAttribute("aria-busy", String(pending));
    visual.setAttribute("aria-label", unavailable ? label + "当前不可用" : momentary ? "" + label + (success ? "执行成功" : pending ? "正在执行" : "，点击执行") : "" + label + (state ? "已开启，点击关闭" : "已关闭，点击开启"));
    if (element4) {
      element4.textContent = unavailable ? "当前不可用" : momentary ? success ? "执行成功" : pending ? "执行中" : "点击执行" : state ? "运行中" : "已关闭";
    }
  };
  visual.addEventListener("click", () => {
    if (interactive && !visual.classList.contains("is-pending") && !visual.classList.contains("is-unavailable")) {
      onToggle?.();
    }
  });
  return {
    visual,
    sync
  };
}
function lerpHexColor(fromHex, toHex, lerpAmount = 0) {
  const normalizeHexColor = hex => {
    const asString = String(hex || "").trim();
    const mapped = /^#[0-9a-f]{3}$/i.test(asString) ? "#" + asString.slice(1).split("").map(digit => "" + digit + digit).join("") : asString;
    if (/^#[0-9a-f]{6}$/i.test(mapped)) {
      return mapped;
    } else {
      return null;
    }
  };
  const fromNormalized = normalizeHexColor(fromHex);
  const toNormalized = normalizeHexColor(toHex);
  if (!fromNormalized || !toNormalized) {
    return fromHex;
  }
  const amount = Math.max(0, Math.min(1, Number(lerpAmount) || 0));
  const readHexByte = (hex, offset) => Number.parseInt(hex.slice(offset, offset + 2), 16);
  return "#" + [1, 3, 5].map(offset => Math.round(readHexByte(fromNormalized, offset) + (readHexByte(toNormalized, offset) - readHexByte(fromNormalized, offset)) * amount)).map(channel => channel.toString(16).padStart(2, "0")).join("");
}
export class PanelRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      ...options,
      onError: onError => {
        window.HABridgeLog?.error(onError, {
          phase: "runtime-operation"
        });
        options.onError?.(onError);
      }
    };
    this.boundRuntimeButtonSound = event => {
      if (this.options.editable) {
        return;
      }
      const pressedButton = typeof Element !== "undefined" && event.target instanceof Element ? event.target.closest("button, [role=\"button\"]") : null;
      if (!!pressedButton && !!this.container.contains(pressedButton)) {
        this.options.onRuntimeButtonPress?.(pressedButton);
      }
    };
    this.container.addEventListener("click", this.boundRuntimeButtonSound, true);
    this.renderNamespace = "renderer-" + randomUuid().replace(/[^a-z0-9]/gi, "");
    this.document = null;
    this.page = null;
    this.states = options.runtimeStateCache instanceof Map ? options.runtimeStateCache : new Map();
    this.virtualEntityStates = options.virtualEntityStateCache instanceof Map ? options.virtualEntityStateCache : new Map();
    this.entityMetadata = new Map();
    this.deviceMetadata = new Map();
    this.entityCatalogReady = false;
    this.entityTranslations = {};
    this.historySeries = new Map();
    this.historySeriesCache = options.historySeriesCache instanceof Map ? options.historySeriesCache : new Map();
    this.historyFetches = new Set();
    this.historyRefreshCoordinator = new HistoryRefreshCoordinator();
    this.historyRetryTimer = 0;
    this.historyRetryAttempt = 0;
    this.historyDocumentGeneration = 0;
    this.historyPopupGeneration = 0;
    this.historyChartRefreshers = new Set();
    this.runtimeStateHandlers = new Map();
    this.runtimeRenderEntityIds = new Set();
    this.runtimeRenderTimer = 0;
    this.runtimeStaticImageCache = new RuntimeStaticImageCache({
      maxConcurrent: 2,
      maxDecoded: 32,
      idleDelay: 120
    });
    this.runtimeEffectImageLoader = new RuntimeEffectImageLoader({
      maxConcurrent: 4,
      idleDelay: 160
    });
    this.runtimeVacuumMapImagePreloader = new RuntimeVacuumMapImagePreloader({
      maxConcurrent: 1
    });
    this.vacuumMapEntityIds = new Set();
    this.cleanups = [];
    this.componentCleanups = new Map();
    this.cameraCleanups = new Map();
    this.runtimeEntityComponentIndex = new Map();
    this.componentParentIds = new Map();
    this.componentHosts = new Map();
    this.componentRecords = new Map();
    this.componentAirflowLayers = new Map();
    this.componentEffectLayers = new Map();
    this.componentSelectionOverlays = new Map();
    this.componentSelectionLayers = new Map();
    this.componentPreviewStates = new Map();
    this.themeVariableNames = new Set();
    this.detailsStateSync = null;
    this.activePopupId = null;
    this.replacingDocument = false;
    this.pendingEntityDetails = null;
    this.runtimeDialogScaleContext = null;
    this.selectedComponentId = null;
    this.selectedComponentIds = new Set();
    this.activeGroupId = null;
    this.socket = null;
    this.runtimeSubscription = null;
    this.socketGeneration = 0;
    this.reconnectTimer = null;
    this.reconnectAttempt = 0;
    this.runtimeHydrationRetryTimer = null;
    this.runtimeHydrationRetryAttempt = 0;
    this.lastRuntimeResumeAt = 0;
    this.runtimeEntityLimitSignature = "";
    this.removedRuntimeEntityIds = new Set();
    this.pendingOptimisticStates = new Map();
    this.confirmedLightVisualStates = new Map();
    this.destroyed = false;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.boundResize = () => this.resize();
    this.boundReconnect = () => {
      if (!this.destroyed && (!this.socket || this.socket.readyState >= WebSocket.CLOSING)) {
        this.connectRuntime();
      }
    };
    this.boundVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastRuntimeResumeAt = Date.now();
        if (this.document && lastRuntimeResumeAt - this.lastRuntimeResumeAt >= 1500) {
          this.lastRuntimeResumeAt = lastRuntimeResumeAt;
          this.connectRuntime({
            force: true
          });
        }
        this.refreshHistorySeries();
      }
    };
    this.historyPollTimer = window.setInterval(() => this.refreshHistorySeries(), 30000);
    window.visualViewport?.addEventListener("resize", this.boundResize);
    window.addEventListener("orientationchange", this.boundResize);
    window.addEventListener("online", this.boundReconnect);
    document.addEventListener("visibilitychange", this.boundVisibilityChange);
  }
  setDocument(documentModel, pagePath = null) {
    this.destroyed = false;
    const map = this.options.editable ? new Map([...this.componentHosts].filter(([componentId, hostEl]) => this.componentRecords.get(componentId)?.type === "floorplan-auto-diagram" && hostEl.querySelector(".hb-floorplan-auto-diagram-preview") || this.document?.projectId === documentModel.projectId && this.componentRecords.get(componentId)?.type === "interaction3d" && hostEl.parentElement === this.canvas)) : null;
    const replacingDocument = this.replacingDocument;
    this.replacingDocument = true;
    try {
      window.clearTimeout(this.historyRetryTimer);
      this.historyRetryTimer = 0;
      this.historyRetryAttempt = 0;
      window.clearTimeout(this.runtimeHydrationRetryTimer);
      this.runtimeHydrationRetryTimer = null;
      this.runtimeHydrationRetryAttempt = 0;
      this.closeRuntimeDialog();
      if (this.runtimeStaticImageCache.stopped) {
        this.runtimeStaticImageCache.reset();
      }
      if (this.runtimeEffectImageLoader.stopped) {
        this.runtimeEffectImageLoader.reset();
      }
      if (this.runtimeVacuumMapImagePreloader.stopped) {
        this.runtimeVacuumMapImagePreloader.reset();
      }
      this.activePopupId = null;
      this.historySeries.clear();
      this.historyFetches.clear();
      this.historyDocumentGeneration += 1;
      this.historyPopupGeneration += 1;
      this.removedRuntimeEntityIds.clear();
      this.document = this.options.editable ? structuredClone(documentModel) : documentModel;
      this.vacuumMapEntityIds = new Set(collectComponents([...(this.document.sharedComponents || []), ...this.document.pages.flatMap(page => page.components || [])], component => component.type === "vacuum-map").map(component => String(component.bindings?.entity?.entityId || "")).filter(entityId => entityId.startsWith("image.")));
      const page = this.document.pages.find(candidate => candidate.path === pagePath);
      const defaultPage = this.document.pages.find(candidate => candidate.path === this.document.defaultPagePath);
      this.page = page || defaultPage || this.document.pages[0];
      this.render(map);
      this.preloadStaticImages();
      if (!this.options.editable) {
        const flatMapped = collectComponents([...(this.document.sharedComponents || []), ...this.document.pages.flatMap(page => page.components || [])], component => component.type === "camera" && component.properties?.mediaVisible !== false && component.properties?.displayMode !== "snapshot").map(component => String(component.bindings?.entity?.entityId || "")).filter(Boolean);
        prewarmCameraMedia(flatMapped);
      }
      this.connectRuntime();
      this.refreshHistorySeries();
    } finally {
      this.replacingDocument = replacingDocument;
    }
  }
  refreshBuiltinAssets(versions = []) {
    const state = setBuiltinAssetVersions(versions);
    if (state && this.document) {
      this.renderComponents(true);
      this.preloadStaticImages();
    }
    return state;
  }
  preloadStaticImages() {
    if (!this.document || !this.page) {
      return;
    }
    const listImageSources = arg => collectComponents(arg, component => component.type === "image" && component.properties?.assetId).map(component => staticAssetImageSource(component.properties.assetId)).filter(Boolean);
    const index = new Map((this.document.sharedComponents || []).map(arg => [arg.id, arg]));
    const filtered = (this.page.sharedComponentIds || []).map(arg => index.get(arg)).filter(Boolean);
    const state = listImageSources([...(this.page.components || []), ...filtered]);
    const flatMapped = listImageSources([...(this.document.sharedComponents || []), ...this.document.pages.flatMap(arg => arg.components || [])]);
    this.runtimeStaticImageCache.setSources(flatMapped, state);
  }
  setEntityCatalog(catalog = [], entityTranslations = {}, deviceCatalog = []) {
    this.entityMetadata = new Map((catalog || []).map(arg => [String(arg.entityId || ""), arg]).filter(([arg]) => arg));
    this.deviceMetadata = new Map((deviceCatalog || []).map(arg => [String(arg.deviceId || ""), arg]).filter(([arg]) => arg));
    this.entityTranslations = entityTranslations && typeof entityTranslations == "object" ? entityTranslations : {};
    this.entityCatalogReady = true;
    this.tryOpenPendingEntityDetails();
    if (this.document) {
      this.detailsStateSync?.refreshEntityCatalog?.();
      this.renderComponents(true);
      this.connectRuntime();
    }
  }
  deviceProfile(entityId) {
    return resolveXiaomiDeviceProfile(entityId, this.entityMetadata, this.deviceMetadata, this.states);
  }
  runtimeEntityId(component) {
    return String(component || "");
  }
  iconVisibilityPageKey() {
    return String(this.page?.path || this.page?.id || "current-page");
  }
  iconVisibilityState() {
    return this.virtualEntityStates.get(this.iconVisibilityPageKey()) !== false;
  }
  toggleVirtualEntity(entityId) {
    const state = parseVirtualEntityId(entityId);
    if (!state || state.kind !== ICON_VISIBILITY_VIRTUAL_KIND) {
      throw new Error("虚拟实体不存在。");
    }
    if (![...this.componentRecords.values()].some(arg => arg.type === "icon-button-effect")) {
      throw new Error("当前页面没有图标按钮（效果）。");
    }
    const state1 = this.iconVisibilityPageKey();
    const state2 = !this.iconVisibilityState();
    this.virtualEntityStates.set(state1, state2);
    this.states.set(entityId, {
      entityId,
      state: state2 ? "on" : "off",
      attributes: {}
    });
    this.renderComponents(true);
  }
  waterHeaterDetailsReady(entityId) {
    if (!this.entityCatalogReady) {
      return false;
    }
    const state = this.states.get(entityId);
    const numeric1 = (state?.newState || state)?.attributes || {};
    const numeric = Number(numeric1.temperature);
    const numeric2 = Number(numeric1.min_temp);
    const numeric3 = Number(numeric1.max_temp);
    return Number.isFinite(numeric) && Number.isFinite(numeric2) && Number.isFinite(numeric3) && numeric3 > numeric2;
  }
  deferEntityDetailsUntilReady(entityId, preview, reason = "water-heater") {
    window.clearTimeout(this.pendingEntityDetails?.timer);
    window.clearTimeout(this.pendingEntityDetails?.retryTimer);
    const pendingEntityDetails = {
      component: structuredClone(entityId),
      preview,
      reason,
      retryTimer: null,
      timer: null
    };
    const state = reason === "catalog" || reason === "electric-bed-catalog";
    if (state) {
      const state1 = () => {
        if (this.pendingEntityDetails !== pendingEntityDetails) {
          return;
        }
        const state2 = this.runtimeEntityId(pendingEntityDetails.component?.bindings?.entity?.entityId);
        if (!this.entityCatalogReady || reason === "electric-bed-catalog" && this.deviceProfile(state2)?.deviceType !== "electric-bed") {
          pendingEntityDetails.retryTimer = window.setTimeout(state1, 260);
          return;
        }
        window.clearTimeout(pendingEntityDetails.timer);
        this.pendingEntityDetails = null;
        this.showEntityDetails(pendingEntityDetails.component, {
          preview: pendingEntityDetails.preview
        });
      };
      pendingEntityDetails.retryTimer = window.setTimeout(state1, 260);
    }
    pendingEntityDetails.timer = window.setTimeout(() => {
      if (this.pendingEntityDetails === pendingEntityDetails) {
        this.pendingEntityDetails = null;
        if (state && this.detailsDialog?.classList.contains("electric-bed-loading-details")) {
          this.detailsDialog.close();
        }
        if (state) {
          this.options.onError?.(new Error("设备信息正在加载，请稍后重试。"));
        } else {
          this.options.onError?.(new Error("热水器状态正在加载，请稍后重试。"));
        }
      }
    }, state ? 10000 : 3000);
    this.pendingEntityDetails = pendingEntityDetails;
  }
  tryOpenPendingEntityDetails() {
    const pendingEntityDetails = this.pendingEntityDetails;
    if (!pendingEntityDetails) {
      return false;
    }
    const state = this.runtimeEntityId(pendingEntityDetails.component?.bindings?.entity?.entityId);
    if (!this.entityCatalogReady || pendingEntityDetails.reason === "water-heater" && !this.waterHeaterDetailsReady(state) || pendingEntityDetails.reason === "electric-bed-catalog" && this.deviceProfile(state)?.deviceType !== "electric-bed") {
      return false;
    } else {
      window.clearTimeout(pendingEntityDetails.timer);
      this.pendingEntityDetails = null;
      this.showEntityDetails(pendingEntityDetails.component, {
        preview: pendingEntityDetails.preview
      });
      return true;
    }
  }
  profiledComponent(component, component1 = component?.bindings?.entity?.entityId || "") {
    return applyXiaomiDeviceProfile(component, this.deviceProfile(this.runtimeEntityId(component1)) || this.deviceProfile(component1));
  }
  powerEntityId(component, component1 = component?.bindings?.entity?.entityId || "") {
    const state = this.runtimeEntityId(component1);
    const state1 = this.deviceProfile(state) || this.deviceProfile(component1);
    const state2 = entityPowerTarget(state, component, state1);
    if (state2 !== state) {
      return this.runtimeEntityId(state2);
    }
    const state3 = relatedPopupContext(component, this.entityMetadata, this.deviceMetadata, this.states);
    if (component?.type !== "air-conditioner" && state3?.deviceType === "bath-heater") {
      const found = state3.siblings?.find(arg => arg.domain === "light" && entityMetadataIsAvailable(arg));
      if (found?.entityId) {
        return this.runtimeEntityId(found.entityId);
      }
    }
    return state;
  }
  runtimePowerComponent(component, component1 = component?.bindings?.entity?.entityId || "") {
    const component2 = this.profiledComponent(component, component1);
    const state = this.runtimeEntityId(component1);
    const entityId = this.powerEntityId(component2, component1);
    if (!entityId || entityId === state && state === component1) {
      return component2;
    } else {
      return {
        ...component2,
        bindings: {
          ...(component2.bindings || {}),
          entity: {
            entityId
          }
        },
        properties: {
          ...(component2.properties || {}),
          runtimePowerEntityId: entityId
        }
      };
    }
  }
  navigate(pagePath) {
    const page = this.document?.pages.find(arg => arg.path === pagePath);
    if (page) {
      this.page = page;
      window.clearTimeout(this.runtimeHydrationRetryTimer);
      this.runtimeHydrationRetryTimer = null;
      this.runtimeHydrationRetryAttempt = 0;
      this.preloadStaticImages();
      this.renderComponents();
      this.connectRuntime();
      this.refreshHistorySeries();
      this.options.onPageChange?.(page);
    }
  }
  setSelectedComponent(componentId) {
    this.setSelectedComponents(componentId ? [componentId] : [], componentId);
  }
  setSelectedComponents(componentIds, primaryComponentId = null) {
    this.selectedComponentIds = new Set((componentIds || []).filter(arg => this.componentRecords.has(arg)));
    this.selectedComponentId = this.selectedComponentIds.has(primaryComponentId) ? primaryComponentId : this.selectedComponentIds.values().next().value || null;
    this.syncSelection();
  }
  setActiveGroup(groupId = null) {
    this.activeGroupId = groupId && this.componentRecords.get(groupId)?.type === "group" ? groupId : null;
    this.syncActiveGroup();
  }
  syncActiveGroup() {
    if (this.canvas) {
      this.canvas.classList.toggle("hb-editing-group", !!this.activeGroupId);
      for (const [item, element] of this.componentHosts) {
        element.classList.toggle("hb-active-edit-group", item === this.activeGroupId && element.parentElement === this.canvas);
      }
    }
  }
  setComponentSelectionLayer(componentId, layer = "button") {
    if (componentId) {
      if (layer === "airflow") {
        this.componentSelectionLayers.set(componentId, "airflow");
      } else if (layer === "effect") {
        this.componentSelectionLayers.set(componentId, "effect");
      } else if (layer === "perspective") {
        this.componentSelectionLayers.set(componentId, "perspective");
      } else {
        this.componentSelectionLayers.delete(componentId);
      }
      this.syncSelection();
    }
  }
  setComponentPreviewState(componentId, previewState = "auto") {
    if (previewState === "on" || previewState === "off") {
      this.componentPreviewStates.set(componentId, previewState);
    } else {
      this.componentPreviewStates.delete(componentId);
    }
    this.previewComponentProperties(componentId);
  }
  previewComponentTransform(componentId, transform = {}) {
    const numeric = this.componentRecords.get(componentId);
    const position = this.componentHosts.get(componentId);
    if (!!numeric && !!position) {
      numeric.position = {
        ...(numeric.position || {})
      };
      numeric.style = {
        ...(numeric.style || {})
      };
      if (Number.isFinite(transform.x)) {
        numeric.position.x = transform.x;
        position.style.left = transform.x + "px";
      }
      if (Number.isFinite(transform.y)) {
        numeric.position.y = transform.y;
        position.style.top = transform.y + "px";
      }
      if (Number.isFinite(transform.width)) {
        numeric.position.width = transform.width;
        position.style.width = transform.width + "px";
      }
      if (Number.isFinite(transform.height)) {
        numeric.position.height = transform.height;
        position.style.height = transform.height + "px";
      }
      if (Number.isFinite(transform.rotation)) {
        numeric.position.rotation = transform.rotation;
      }
      if (Number.isFinite(transform.scale)) {
        numeric.style.scale = transform.scale;
      }
      if (Number.isFinite(transform.rotation) || Number.isFinite(transform.scale)) {
        position.style.transform = "rotate(" + Number(numeric.position.rotation || 0) + "deg) scale(" + Number(numeric.style.scale || 1) + ")";
      }
      this.syncComponentSelectionOverlay(componentId);
      this.updateTransformHandleScale(position, numeric);
    }
  }
  previewComponentProperties(componentId, fallback = {}) {
    const component = this.componentRecords.get(componentId);
    const component1 = this.componentHosts.get(componentId);
    if (!component || !component1) {
      return;
    }
    component.properties = {
      ...(component.properties || {}),
      ...fallback
    };
    if (component.type === "camera" && Object.hasOwn(fallback, "label") && this.detailsDialog?.dataset?.componentId === componentId) {
      const element = this.detailsDialog.querySelector(".hb-camera-preview-heading strong");
      if (element) {
        element.textContent = componentDialogTitle(component, "摄像头实时预览");
      }
    }
    if (Number.isFinite(fallback.opacity)) {
      const hbImageComponent = component1.querySelector(".hb-image-component");
      if (hbImageComponent) {
        hbImageComponent.style.opacity = String(Math.max(0, Math.min(1, fallback.opacity)));
      }
      const hbVacuumMapComponent = component1.querySelector(".hb-vacuum-map-component");
      if (hbVacuumMapComponent) {
        hbVacuumMapComponent.style.opacity = String(Math.max(0, Math.min(1, fallback.opacity)));
      }
    }
    if (component.type === "light-statistics") {
      this.refreshRuntimeComponent(componentId);
      return;
    }
    const state = ["time", "date", "weather", "panel-frame", "icon-button-effect", "title-button", "icon-button", "device-button", "presence-sensor", "air-conditioner", "camera", "vacuum-map", "floorplan-auto-diagram"];
    if (this.options.editable && state.includes(component.type)) {
      this.refreshEditorComponent(componentId);
      return;
    }
    if (["time", "date", "weather", "line-chart", "panel-frame", "icon-button-effect", "title-button", "icon-button", "device-button", "presence-sensor", "air-conditioner", "camera", "vacuum-map"].includes(component.type)) {
      this.renderComponents();
      return;
    }
    if (component.type === "navigation-button") {
      const found = [...component1.children].find(element => !element.classList.contains("hb-selection-bounds"));
      const state1 = {
        document: this.document,
        page: this.page,
        states: this.states,
        history: this.historySeries,
        entityMetadata: this.entityMetadata,
        deviceMetadata: this.deviceMetadata,
        entityTranslations: this.entityTranslations,
        renderNamespace: this.renderNamespace,
        editable: !!this.options.editable,
        liveMedia: this.options.liveMedia !== false,
        previewState: this.componentPreviewStates.get(componentId) || "auto",
        isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
        navigate: navigate => this.navigate(navigate),
        cleanup: cleanup => this.cleanups.push(cleanup)
      };
      const state2 = renderRegisteredComponent(this.profiledComponent(component), state1);
      const numeric = Number(this.document.canvas.componentScale || 1);
      if (numeric !== 1) {
        state2.style.width = 100 / numeric + "%";
        state2.style.height = 100 / numeric + "%";
        state2.style.transform = "scale(" + numeric + ")";
        state2.style.transformOrigin = "top left";
      }
      if (found) {
        found.replaceWith(state2);
      } else {
        component1.prepend(state2);
      }
    }
  }
  syncSelection() {
    this.canvas?.querySelectorAll(".hb-multi-selection-bounds").forEach(arg => arg.remove());
    this.canvas?.querySelectorAll(".hb-component-selection-overlay").forEach(arg => arg.remove());
    this.componentSelectionOverlays.clear();
    for (const valueEntry of this.componentAirflowLayers.values()) {
      valueEntry.querySelectorAll(":scope > .hb-selection-bounds").forEach(arg => arg.remove());
    }
    for (const [item, element] of this.componentHosts) {
      const state = this.options.editable && this.selectedComponentIds.has(item);
      const component = this.componentRecords.get(item);
      const state1 = component?.type === "floorplan-auto-diagram" && component.properties?.generated !== true;
      element.hidden = state1 ? !state : component?.style?.visible === false;
      element.classList.toggle("selected", state);
      element.classList.toggle("selection-primary", state && item === this.selectedComponentId);
      element.classList.toggle("hb-light-statistics-selection-host", state && this.selectedComponentIds.size === 1 && component?.type === "light-statistics");
      element.querySelectorAll(":scope > .hb-selection-bounds, :scope > .hb-transform-handle").forEach(arg => arg.remove());
      if (!state) {
        continue;
      }
      const state2 = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "air-conditioner" && this.componentSelectionLayers.get(item) === "airflow";
      const state3 = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "icon-button-effect" && this.componentSelectionLayers.get(item) === "effect";
      const state4 = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "presence-sensor" && component?.properties?.sensorKind === "door-window" && this.componentSelectionLayers.get(item) === "perspective";
      if (state2) {
        this.appendAirflowTransformHandles(this.componentAirflowLayers.get(item), component);
      } else if (state3 && this.componentEffectLayers.get(item) && !this.componentEffectLayers.get(item).hidden) {
        this.appendEffectSelectionBounds(this.componentEffectLayers.get(item), component);
      } else if (state4) {
        const state5 = this.createComponentSelectionOverlay(element, component) || element;
        this.appendDoorWindowPerspectiveHandles(element, component, state5);
      } else {
        const state5 = this.selectedComponentIds.size === 1;
        const state6 = state5 ? this.createComponentSelectionOverlay(element, component) : element;
        this.appendTransformHandles(element, component, state5, state6 || element);
      }
    }
    if (this.selectedComponentIds.size > 1) {
      this.appendMultiSelectionBounds();
    }
  }
  selectedScaleRecords() {
    const mapped = [...this.selectedComponentIds].map(arg => ({
      component: this.componentRecords.get(arg),
      host: this.componentHosts.get(arg)
    }));
    const state = mapped[0]?.host?.parentElement || null;
    if (mapped.length < 2 || mapped.some(arg => !arg.component || !arg.host || arg.host.parentElement !== state || arg.component.properties?.layoutMode === "fill")) {
      return [];
    } else {
      return mapped;
    }
  }
  componentParentTransform(componentId) {
    let scale1 = this.componentParentIds?.get(componentId) || null;
    let rotation = 0;
    let scale = 1;
    const allowed = new Set();
    while (scale1 && !allowed.has(scale1)) {
      allowed.add(scale1);
      const numeric = this.componentRecords.get(scale1);
      if (!numeric) {
        break;
      }
      rotation += Number(numeric.position?.rotation || 0);
      scale *= Math.max(0.01, Math.min(5, Number(numeric.style?.scale || 1)));
      scale1 = this.componentParentIds?.get(scale1) || null;
    }
    return {
      rotation,
      scale
    };
  }
  componentTransformChain(componentId) {
    const state = [];
    let state1 = componentId;
    const allowed = new Set();
    while (state1 && !allowed.has(state1)) {
      allowed.add(state1);
      const state2 = this.componentRecords.get(state1);
      if (!state2) {
        break;
      }
      state.push(state2);
      state1 = this.componentParentIds?.get(state1) || null;
    }
    return state;
  }
  componentWorldTransform(componentId) {
    return this.componentTransformChain(componentId).reduce((arg, outTransform) => ({
      rotation: arg.rotation + Number(outTransform.position?.rotation || 0),
      scale: arg.scale * Math.max(0.01, Math.min(5, Number(outTransform.style?.scale || 1)))
    }), {
      rotation: 0,
      scale: 1
    });
  }
  worldPointToComponentLocal(componentId, point, outLocalPoint) {
    let state = {
      x: Number(point || 0),
      y: Number(outLocalPoint || 0)
    };
    const state1 = this.componentTransformChain(componentId).reverse();
    for (const item of state1) {
      const numeric1 = item.position || {};
      const numeric = Number(numeric1.width || 100);
      const numeric2 = Number(numeric1.height || 100);
      const count = Math.max(0.01, Math.min(5, Number(item.style?.scale || 1)));
      const scale = Number(numeric1.rotation || 0) * Math.PI / 180;
      const state2 = Math.cos(scale);
      const state3 = Math.sin(scale);
      const asNumber = Number(numeric1.x || 0) + numeric / 2;
      const asNumber1 = Number(numeric1.y || 0) + numeric2 / 2;
      const state4 = (state.x - asNumber) / count;
      const state5 = (state.y - asNumber1) / count;
      state = {
        x: numeric / 2 + state4 * state2 + state5 * state3,
        y: numeric2 / 2 - state4 * state3 + state5 * state2
      };
    }
    return state;
  }
  componentVisualBounds(componentId, transformOverride = null) {
    const numeric = componentId.position || {};
    const count = Math.max(0.01, Number(numeric.width || 100));
    const count2 = Math.max(0.01, Number(numeric.height || 100));
    let size = count;
    let state = count2;
    let state1 = 0;
    let state2 = 0;
    if (componentId.type === "light-statistics" && transformOverride) {
      const element = transformOverride.querySelector(":scope > .hb-selection-bounds");
      const size2 = element ? [Number.parseFloat(element.style.left), Number.parseFloat(element.style.top), Number.parseFloat(element.style.width), Number.parseFloat(element.style.height)] : [];
      if (size2.every(Number.isFinite) && size2[2] > 0 && size2[3] > 0) {
        [state1, state2, size, state] = size2;
      }
    }
    const count3 = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    const scale = Number(numeric.rotation || 0) * Math.PI / 180;
    const state3 = size * count3;
    const state4 = state * count3;
    const state5 = (Math.abs(Math.cos(scale)) * state3 + Math.abs(Math.sin(scale)) * state4) / 2;
    const state6 = (Math.abs(Math.sin(scale)) * state3 + Math.abs(Math.cos(scale)) * state4) / 2;
    const asNumber = Number(numeric.x || 0) + count / 2;
    const asNumber1 = Number(numeric.y || 0) + count2 / 2;
    const asNumber2 = Number(numeric.x || 0) + state1 + size / 2;
    const asNumber3 = Number(numeric.y || 0) + state2 + state / 2;
    const state7 = (asNumber2 - asNumber) * count3;
    const state8 = (asNumber3 - asNumber1) * count3;
    const state9 = asNumber + state7 * Math.cos(scale) - state8 * Math.sin(scale);
    const size1 = asNumber1 + state7 * Math.sin(scale) + state8 * Math.cos(scale);
    return {
      left: state9 - state5,
      top: size1 - state6,
      right: state9 + state5,
      bottom: size1 + state6
    };
  }
  scaleRecordsBounds(records) {
    const mapped = records.map(arg => this.componentVisualBounds(arg.component, arg.host));
    return {
      left: Math.min(...mapped.map(left => left.left)),
      top: Math.min(...mapped.map(top => top.top)),
      right: Math.max(...mapped.map(right => right.right)),
      bottom: Math.max(...mapped.map(bottom => bottom.bottom))
    };
  }
  refreshMultiSelectionBounds() {
    const matchedEl = this.canvas?.querySelector(".hb-multi-selection-bounds");
    if (!matchedEl || !this.selectedComponentIds || this.selectedComponentIds.size < 2) {
      return;
    }
    const state = this.selectedScaleRecords();
    if (!state.length) {
      matchedEl.remove();
      return;
    }
    const scale = this.scaleRecordsBounds(state);
    Object.assign(matchedEl.style, {
      left: scale.left + "px",
      top: scale.top + "px",
      width: Math.max(1, scale.right - scale.left) + "px",
      height: Math.max(1, scale.bottom - scale.top) + "px"
    });
    this.updateMultiSelectionHandleScale(matchedEl);
  }
  updateMultiSelectionHandleScale(element) {
    if (!element) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const state1 = element.parentElement?.dataset?.componentId || null;
    const scale = state1 ? this.componentWorldTransform(state1).scale : 1;
    const scale1 = 1 / Math.max(0.001, state * scale);
    element.style.setProperty("--hb-ui-scale", String(scale1));
    element.style.setProperty("--hb-handle-outset", scale1 * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  appendMultiSelectionBounds() {
    const selectionBoundsEl = this.selectedScaleRecords();
    if (!selectionBoundsEl.length) {
      return;
    }
    const selectionBoundsEl1 = this.scaleRecordsBounds(selectionBoundsEl);
    const selectionBoundsEl2 = document.createElement("div");
    selectionBoundsEl2.className = "hb-selection-bounds hb-multi-selection-bounds";
    Object.assign(selectionBoundsEl2.style, {
      left: selectionBoundsEl1.left + "px",
      top: selectionBoundsEl1.top + "px",
      width: Math.max(1, selectionBoundsEl1.right - selectionBoundsEl1.left) + "px",
      height: Math.max(1, selectionBoundsEl1.bottom - selectionBoundsEl1.top) + "px"
    });
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl2.append(cornerMarkerEl1);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动整体缩放";
    transformHandleEl.addEventListener("pointerdown", transformHandleEl2 => this.startComponentsScale(transformHandleEl2, selectionBoundsEl, selectionBoundsEl1, selectionBoundsEl2));
    const transformHandleEl1 = document.createElement("button");
    transformHandleEl1.type = "button";
    transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
    transformHandleEl1.title = "拖动整体旋转";
    transformHandleEl1.addEventListener("pointerdown", arg => this.startComponentsRotate(arg, selectionBoundsEl, selectionBoundsEl1, selectionBoundsEl2));
    selectionBoundsEl2.append(transformHandleEl, transformHandleEl1);
    (selectionBoundsEl[0]?.host?.parentElement || this.canvas).append(selectionBoundsEl2);
    this.updateMultiSelectionHandleScale(selectionBoundsEl2);
  }
  previewComponentsTransform(componentIds, transform = this.selectedComponentId) {
    for (const item of componentIds || []) {
      const numeric = this.componentRecords.get(item.componentId);
      const position = this.componentHosts.get(item.componentId);
      if (!!numeric && !!position) {
        numeric.position = {
          ...(numeric.position || {}),
          ...(Number.isFinite(item.x) ? {
            x: item.x
          } : {}),
          ...(Number.isFinite(item.y) ? {
            y: item.y
          } : {})
        };
        if (Number.isFinite(item.scale)) {
          numeric.style = {
            ...(numeric.style || {}),
            scale: item.scale
          };
        }
        if (Number.isFinite(item.rotation)) {
          numeric.position.rotation = item.rotation;
        }
        if (Number.isFinite(item.x)) {
          position.style.left = item.x + "px";
        }
        if (Number.isFinite(item.y)) {
          position.style.top = item.y + "px";
        }
        if (Number.isFinite(item.scale) || Number.isFinite(item.rotation)) {
          position.style.transform = "rotate(" + Number(numeric.position?.rotation || 0) + "deg) scale(" + Number(numeric.style?.scale || 1) + ")";
        }
      }
    }
    this.syncSelection();
    this.options.onComponentsTransformPreview?.(componentIds, transform);
  }
  startComponentsScale(event, handle, pointerEvent, element) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - size1));
    const size2 = (pointerEvent.left + pointerEvent.right) / 2;
    const size3 = (pointerEvent.top + pointerEvent.bottom) / 2;
    const mapped = handle.map(arg => {
      const numeric = arg.component.position || {};
      const width = Number(numeric.width || 100);
      const height = Number(numeric.height || 100);
      return {
        ...arg,
        width,
        height,
        centerX: Number(numeric.x || 0) + width / 2,
        centerY: Number(numeric.y || 0) + height / 2,
        scale: Math.max(0.01, Math.min(5, Number(arg.component.style?.scale || 1)))
      };
    });
    const count2 = Math.max(...mapped.map(arg => 0.01 / arg.scale));
    const mapped1 = Math.min(...mapped.map(arg => 5 / arg.scale));
    let scale = 1;
    let scale1 = [];
    let event1 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event2 = event3 => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      const event4 = Math.hypot(event3.clientX - size, event3.clientY - size1);
      scale = Math.max(count2, Math.min(mapped1, event4 / count));
      scale1 = mapped.map(arg => {
        const state1 = size2 + (arg.centerX - size2) * scale;
        const scale2 = size3 + (arg.centerY - size3) * scale;
        const scale = arg.scale * scale;
        const position = state1 - arg.width / 2;
        const position1 = scale2 - arg.height / 2;
        arg.component.position = {
          ...(arg.component.position || {}),
          x: position,
          y: position1
        };
        arg.component.style = {
          ...(arg.component.style || {}),
          scale
        };
        arg.host.style.left = position + "px";
        arg.host.style.top = position1 + "px";
        arg.host.style.transform = "rotate(" + Number(arg.component.position?.rotation || 0) + "deg) scale(" + scale + ")";
        return {
          componentId: arg.component.id,
          x: position,
          y: position1,
          scale
        };
      });
      Object.assign(element.style, {
        left: size2 + (pointerEvent.left - size2) * scale + "px",
        top: size3 + (pointerEvent.top - size3) * scale + "px",
        width: Math.max(1, (pointerEvent.right - pointerEvent.left) * scale) + "px",
        height: Math.max(1, (pointerEvent.bottom - pointerEvent.top) * scale) + "px"
      });
      this.updateMultiSelectionHandleScale(element);
      this.options.onComponentsTransformPreview?.(scale1, this.selectedComponentId);
    };
    const state = (event3 = null) => {
      if (!event1 && (event3?.pointerId == null || event3.pointerId === pointerId)) {
        event1 = true;
        window.removeEventListener("pointermove", event2, true);
        window.removeEventListener("pointerup", state, true);
        window.removeEventListener("pointercancel", state, true);
        window.removeEventListener("blur", state);
        if (scale !== 1 && scale1.length) {
          this.options.onComponentsTransform?.(scale1, this.selectedComponentId);
        }
      }
    };
    window.addEventListener("pointermove", event2, true);
    window.addEventListener("pointerup", state, true);
    window.addEventListener("pointercancel", state, true);
    window.addEventListener("blur", state);
  }
  startComponentsRotate(event, pointerEvent, handleEl, element) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const event1 = domRect.top + domRect.height / 2;
    const size1 = (handleEl.left + handleEl.right) / 2;
    const size2 = (handleEl.top + handleEl.bottom) / 2;
    const mapped = pointerEvent.map(arg => {
      const numeric = arg.component.position || {};
      const width = Number(numeric.width || 100);
      const height = Number(numeric.height || 100);
      return {
        ...arg,
        componentId: arg.component.id,
        width,
        height,
        centerX: Number(numeric.x || 0) + width / 2,
        centerY: Number(numeric.y || 0) + height / 2,
        rotation: Number(numeric.rotation || 0)
      };
    });
    let state = Math.atan2(event.clientY - event1, event.clientX - size);
    let state1 = 0;
    let state2 = [];
    let event2 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event3 = event4 => {
      if (event4.pointerId !== pointerId) {
        return;
      }
      const state4 = Math.atan2(event4.clientY - event1, event4.clientX - size);
      let amount = state4 - state;
      if (amount > Math.PI) {
        amount -= Math.PI * 2;
      } else if (amount < -Math.PI) {
        amount += Math.PI * 2;
      }
      state1 += amount * 180 / Math.PI;
      state = state4;
      state2 = rotateMultiSelectionTransforms(mapped, size1, size2, state1);
      for (const item of state2) {
        const found = mapped.find(arg => arg.componentId === item.componentId);
        if (found) {
          found.component.position = {
            ...(found.component.position || {}),
            x: item.x,
            y: item.y,
            rotation: item.rotation
          };
          found.host.style.left = item.x + "px";
          found.host.style.top = item.y + "px";
          found.host.style.transform = "rotate(" + item.rotation + "deg) scale(" + Number(found.component.style?.scale || 1) + ")";
        }
      }
      element.style.transform = "rotate(" + state1 + "deg)";
      element.style.transformOrigin = "center center";
      this.options.onComponentsTransformPreview?.(state2, this.selectedComponentId);
    };
    const state3 = (event4 = null) => {
      if (!event2 && (event4?.pointerId == null || event4.pointerId === pointerId)) {
        event2 = true;
        window.removeEventListener("pointermove", event3, true);
        window.removeEventListener("pointerup", state3, true);
        window.removeEventListener("pointercancel", state3, true);
        window.removeEventListener("blur", state3);
        if (state1 !== 0 && state2.length) {
          this.options.onComponentsTransform?.(state2, this.selectedComponentId);
        }
      }
    };
    window.addEventListener("pointermove", event3, true);
    window.addEventListener("pointerup", state3, true);
    window.addEventListener("pointercancel", state3, true);
    window.addEventListener("blur", state3);
  }
  cleanupComponents(component = false, preserveIds = new Set()) {
    if (this.retainedInteraction3d && !preserveIds.has(this.retainedInteraction3d.component.id)) {
      this.releaseRetainedInteraction3d();
    }
    for (const runHelper of this.cleanups.splice(0)) {
      runHelper();
    }
    for (const cleanup of [...this.componentCleanups.keys()]) {
      if (!preserveIds.has(cleanup)) {
        this.cleanupRenderedComponent(cleanup);
      }
    }
    if (!component) {
      for (const cleanup of this.cameraCleanups.values()) {
        for (const runHelper of cleanup.splice(0)) {
          runHelper();
        }
      }
      this.cameraCleanups.clear();
    }
  }
  registerComponentCleanup(componentId, cleanup) {
    if (!!componentId && typeof cleanup == "function") {
      if (!this.componentCleanups.has(componentId)) {
        this.componentCleanups.set(componentId, []);
      }
      this.componentCleanups.get(componentId).push(cleanup);
    }
  }
  releaseRetainedInteraction3d() {
    const retained = this.retainedInteraction3d;
    if (retained) {
      this.retainedInteraction3d = null;
      clearTimeout(retained.timer);
      this.cleanupRenderedComponent(retained.component.id);
      retained.host.remove();
    }
  }
  cleanupRenderedComponent(componentId) {
    const state = this.componentCleanups.get(componentId) || [];
    this.componentCleanups.delete(componentId);
    for (const runHelper of state.splice(0)) {
      runHelper();
    }
  }
  render(preservedHosts = null) {
    const state = !!preservedHosts?.size && !!this.canvas?.isConnected && !!this.viewport?.isConnected && !![...preservedHosts.values()].some(arg => arg.parentElement === this.canvas);
    if (!state) {
      this.cleanupComponents();
      this.container.replaceChildren();
    }
    this.container.dataset.uiPack = this.document?.uiPack?.id || "ui.base";
    this.container.dataset.uiTheme = this.document?.theme?.name || "";
    for (const item of this.themeVariableNames) {
      this.container.style.removeProperty(item);
    }
    this.themeVariableNames.clear();
    for (const [entry, entry1] of Object.entries(this.document?.theme?.variables || {})) {
      const asString = String(entry).startsWith("--") ? String(entry) : "--" + entry;
      if (/^--[a-zA-Z0-9_-]+$/.test(asString)) {
        this.container.style.setProperty(asString, String(entry1));
        this.themeVariableNames.add(asString);
      }
    }
    if (!state) {
      const viewport = document.createElement("div");
      viewport.className = "hb-renderer-viewport" + (this.options.editable ? "" : " hb-runtime-no-select");
      const canvas = document.createElement("div");
      canvas.className = "hb-renderer-canvas";
      viewport.append(canvas);
      this.container.append(viewport);
      this.viewport = viewport;
      this.canvas = canvas;
    }
    this.viewport.className = "hb-renderer-viewport" + (this.options.editable ? "" : " hb-runtime-no-select");
    this.canvas.style.width = this.document.canvas.width + "px";
    this.canvas.style.height = this.document.canvas.height + "px";
    this.canvas.style.background = this.document.canvas.background?.type === "color" ? this.document.canvas.background.color || "#0b1116" : "";
    this.renderComponents(state, preservedHosts);
    this.resize();
  }
  renderComponents(preserveSelection = false, renderOptions = null) {
    if (!this.canvas || !this.page) {
      return;
    }
    const index = new Map((this.document.sharedComponents || []).map(arg => [arg.id, arg]));
    const filtered = (this.page.sharedComponentIds || []).map(arg => index.get(arg)).filter(Boolean);
    const allowed = new Set(collectComponents([...(this.page.components || []), ...filtered], () => true).map(arg => arg.id));
    this.states.set("virtual.icon_visibility.current", {
      entityId: "virtual.icon_visibility.current",
      state: this.iconVisibilityState() ? "on" : "off",
      attributes: {}
    });
    const componentById = new Map([...(preserveSelection ? [...this.componentHosts].filter(([arg]) => ["camera", "vacuum-map", "floorplan-auto-diagram"].includes(this.componentRecords.get(arg)?.type)) : []), ...(renderOptions && typeof renderOptions[Symbol.iterator] == "function" ? renderOptions : [])]);
    const currentById = new Map(collectComponents([...(this.page.components || []), ...filtered], () => true).map(arg => [arg.id, arg]));
    const pageInteraction3d = [...currentById.values()].filter(arg => arg.type === "interaction3d");
    const retainStage = !this.options?.editable && !this.replacingDocument && Array.isArray(this.document.pages);
    const documentInteraction3d = retainStage ? new Map(collectComponents([...(this.document.sharedComponents || []), ...this.document.pages.flatMap(page => page.components || [])], arg => arg.type === "interaction3d").map(arg => [arg.id, arg])) : new Map();
    const sameInteraction3dSettings = (record, nextRecord) => nextRecord?.type === "interaction3d" && record.properties?.sceneId === nextRecord.properties?.sceneId && record.properties?.lightingMode === nextRecord.properties?.lightingMode;
    let retained = this.retainedInteraction3d;
    if (retained && (!retainStage || retained.host.parentElement !== this.canvas || !sameInteraction3dSettings(retained.component, documentInteraction3d.get(retained.component.id)) || pageInteraction3d.some(arg => arg.id !== retained.component.id))) {
      this.releaseRetainedInteraction3d();
      retained = null;
    }
    if (retainStage && !retained && !pageInteraction3d.length) {
      for (const [id, host] of this.componentHosts) {
        const record = this.componentRecords.get(id);
        if (!(record?.type !== "interaction3d" || host.parentElement !== this.canvas || !sameInteraction3dSettings(record, documentInteraction3d.get(id)))) {
          retained = {
            component: structuredClone(record),
            host,
            timer: null
          };
          this.retainedInteraction3d = retained;
          host.hidden = true;
          host.querySelector(".hb-interaction3d-host")?.setInteraction3dPageVisible?.(false);
          retained.timer = setTimeout(() => {
            if (this.retainedInteraction3d === retained) {
              this.releaseRetainedInteraction3d();
            }
          }, 120000);
          break;
        }
      }
    }
    if (retained) {
      componentById.set(retained.component.id, retained.host);
    }
    for (const [item, parentElement] of this.componentHosts) {
      if ((preserveSelection || retainStage) && this.componentRecords.get(item)?.type === "interaction3d" && parentElement.parentElement === this.canvas && allowed.has(item)) {
        componentById.set(item, parentElement);
      }
    }
    const add = new Set();
    for (const [selectionSnapshot] of componentById) {
      if (retained?.component.id === selectionSnapshot) {
        add.add(selectionSnapshot);
        continue;
      }
      if (this.componentRecords.get(selectionSnapshot)?.type === "interaction3d") {
        if (currentById.get(selectionSnapshot)?.type === "interaction3d") {
          add.add(selectionSnapshot);
        } else {
          componentById.delete(selectionSnapshot);
        }
      }
    }
    const componentById1 = new Map([...this.canvas.querySelectorAll(".hb-icon-button-effect-layer[data-effect-for]")].map(arg => [arg.dataset.effectFor, arg]));
    this.cleanupComponents(preserveSelection, add);
    const allowed2 = new Set([...componentById.values()].filter(arg => arg.parentElement === this.canvas && (allowed.has(arg.dataset.componentId) || arg === retained?.host) && (arg.querySelector(".hb-floorplan-auto-diagram-preview") || add.has(arg.dataset.componentId))));
    if (allowed2.size) {
      for (const child of [...this.canvas.children]) {
        if (!allowed2.has(child)) {
          child.remove();
        }
      }
    } else {
      this.canvas.replaceChildren();
    }
    this.componentHosts.clear();
    this.componentRecords.clear();
    this.componentAirflowLayers.clear();
    this.componentEffectLayers.clear();
    this.componentSelectionOverlays.clear();
    this.runtimeEntityComponentIndex.clear();
    this.componentParentIds.clear();
    for (const item of this.page.components || []) {
      this.renderComponent(item, this.canvas, 0, componentById, componentById1);
    }
    for (const preservedSelectionIds of filtered) {
      this.renderComponent(preservedSelectionIds, this.canvas, 100000, componentById, componentById1);
    }
    if (retained && currentById.has(retained.component.id)) {
      clearTimeout(retained.timer);
      this.retainedInteraction3d = null;
      retained.host.querySelector(".hb-interaction3d-host")?.setInteraction3dPageVisible?.(true);
    }
    this.syncActiveGroup();
    this.syncSelection();
    this.runtimeEffectImageLoader.pruneDisconnected();
  }
  registerRuntimeStateHandler(entityIds, handler, ownerToken = null) {
    const text = String(entityIds || "");
    if (!text || typeof handler != "function") {
      return;
    }
    if (!this.runtimeStateHandlers.has(text)) {
      this.runtimeStateHandlers.set(text, new Set());
    }
    this.runtimeStateHandlers.get(text).add(handler);
    const state = () => {
      const state1 = this.runtimeStateHandlers.get(text);
      state1?.delete(handler);
      if (state1?.size === 0) {
        this.runtimeStateHandlers.delete(text);
      }
    };
    if (ownerToken) {
      this.registerComponentCleanup(ownerToken, state);
    } else {
      this.cleanups.push(state);
    }
  }
  registerHistoryChartRefresher(refresher, ownerToken = null) {
    if (typeof refresher != "function") {
      return;
    }
    this.historyChartRefreshers.add(refresher);
    const state = () => this.historyChartRefreshers.delete(refresher);
    if (ownerToken) {
      this.registerComponentCleanup(ownerToken, state);
    } else {
      this.cleanups.push(state);
    }
  }
  applyRuntimeStateHandlers(entityId, state) {
    for (const runHelper of this.runtimeStateHandlers.get(String(entityId || "")) || []) {
      runHelper(state);
    }
  }
  runtimeEntityIdsForComponent(component) {
    const entityIds = collectEntityIds([{
      ...component,
      children: []
    }]);
    const component1 = component?.bindings?.entity?.entityId || "";
    if (component1) {
      entityIds.add(component1);
      const state = this.powerEntityId(component, component1);
      if (state) {
        entityIds.add(state);
      }
      const state1 = this.deviceProfile(component1);
      for (const valueEntry of Object.values(state1?.roles || {})) {
        if (valueEntry) {
          entityIds.add(valueEntry);
        }
      }
    }
    return [...entityIds].map(arg => String(arg || "")).filter(Boolean);
  }
  indexRuntimeComponent(component) {
    for (const entity of this.runtimeEntityIdsForComponent(component)) {
      if (!this.runtimeEntityComponentIndex.has(entity)) {
        this.runtimeEntityComponentIndex.set(entity, new Set());
      }
      this.runtimeEntityComponentIndex.get(entity).add(component.id);
    }
  }
  unindexRuntimeComponent(component) {
    for (const [entity, entity1] of this.runtimeEntityComponentIndex) {
      entity1.delete(component);
      if (!entity1.size) {
        this.runtimeEntityComponentIndex.delete(entity);
      }
    }
  }
  runtimeComponentContent(componentId) {
    return [...(componentId?.children || [])].find(element => !element.classList.contains("hb-component") && !element.classList.contains("hb-runtime-action-hitbox") && !element.classList.contains("hb-selection-bounds") && !element.classList.contains("hb-transform-handle")) || null;
  }
  refreshRuntimeComponent(componentId) {
    const state = this.componentRecords.get(componentId);
    const state1 = this.componentHosts.get(componentId);
    if (!state || !state1 || !state1.isConnected) {
      return;
    }
    if (state.type === "interaction3d") {
      state1.querySelector(".hb-interaction3d-host")?.updateInteraction3d?.(state, this.document);
      return;
    }
    this.cleanupRenderedComponent(componentId);
    const state2 = {
      document: this.document,
      page: this.page,
      states: this.states,
      history: this.historySeries,
      entityMetadata: this.entityMetadata,
      deviceMetadata: this.deviceMetadata,
      entityTranslations: this.entityTranslations,
      renderNamespace: this.renderNamespace,
      editable: !!this.options.editable,
      liveMedia: this.options.liveMedia !== false,
      previewState: this.componentPreviewStates.get(componentId) || "auto",
      isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
      navigate: navigate => this.navigate(navigate),
      callEntityService: (...callEntityService) => this.callEntityService(...callEntityService),
      openCameraPreview: (camera, onClose, options) => this.openInteraction3dCameraPreview(camera, onClose, options),
      openVacuumDetails: (onError, vacuumOptions, extraOptions) => this.openInteraction3dVacuumDetails(onError, vacuumOptions, extraOptions),
      runVacuumRoom: registerRuntimeStateHandler => this.dispatchAction({
        id: state.id + ":room:" + registerRuntimeStateHandler.id,
        type: "device-button",
        properties: {
          label: registerRuntimeStateHandler.label
        },
        bindings: {
          entity: {
            entityId: registerRuntimeStateHandler.entityId
          }
        }
      }, {
        type: "toggle",
        data: {}
      }),
      onError: error => this.options.onError?.(error),
      registerRuntimeStateHandler: (entityIds, cleanup) => this.registerRuntimeStateHandler(entityIds, cleanup, componentId),
      invalidate: () => this.refreshRuntimeComponent(componentId),
      cleanup: cleanupFn => this.registerComponentCleanup(componentId, cleanupFn)
    };
    const state3 = renderRegisteredComponent(this.runtimePowerComponent(state), state2);
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      state3.style.width = 100 / numeric + "%";
      state3.style.height = 100 / numeric + "%";
      state3.style.transform = "scale(" + numeric + ")";
      state3.style.transformOrigin = "top left";
    }
    const size = this.runtimeComponentContent(state1);
    if (size) {
      size.replaceWith(state3);
    } else {
      state1.prepend(state3);
    }
    if (state.type === "title-button" || state.type === "light-statistics") {
      const element = state1.querySelector(":scope > .hb-runtime-action-hitbox");
      if (element) {
        const state4 = state.type === "light-statistics" ? this.updateLightStatisticsSelectionBounds(state1, state, element) : this.updateTitleButtonSelectionBounds(state1, state, element);
        element.hidden = !state4;
      }
    }
    if (state.type === "light-statistics") {
      const matchedEl = this.componentSelectionOverlays.get(componentId)?.querySelector(":scope > .hb-selection-bounds") || state1.querySelector(":scope > .hb-selection-bounds");
      if (matchedEl) {
        if (!this.updateLightStatisticsSelectionBounds(state1, state, matchedEl)) {
          Object.assign(matchedEl.style, {
            left: "0",
            top: "0",
            width: "100%",
            height: "100%"
          });
        }
        this.updateTransformHandleScale(state1, state, matchedEl);
      }
      this.refreshMultiSelectionBounds();
    }
  }
  refreshEditorComponent(component1) {
    if (!this.options.editable) {
      return false;
    }
    const component = this.componentRecords.get(component1);
    const element = this.componentHosts.get(component1);
    if (!component || !element?.isConnected || component.type === "group") {
      return false;
    }
    const hostParentEl = element.parentElement;
    if (!hostParentEl) {
      return false;
    }
    if (component.type === "interaction3d") {
      this.renderComponent(component, hostParentEl, hostParentEl === this.canvas && (this.page.sharedComponentIds || []).includes(component.id) ? 100000 : 0, new Map([[component.id, element]]));
      this.syncSelection();
      return true;
    }
    if (component.type === "floorplan-auto-diagram") {
      const position = component.properties?.previewReady === true && (component.properties?.generated !== true || component.properties?.previewing === true);
      const position1 = element.querySelector(".hb-floorplan-auto-diagram-preview");
      if (!!position1 === position) {
        const componentPosition = component.position || {};
        const isFillLayout = hostParentEl === this.canvas && component.properties?.layoutMode === "fill";
        const zIndex = isFillLayout ? {
          ...componentPosition,
          x: 0,
          y: 0,
          width: Number(this.document.canvas?.width || 2778),
          height: Number(this.document.canvas?.height || 1940),
          rotation: 0
        } : componentPosition;
        const componentScale = Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
        const baseZIndex = Number(zIndex.zIndex || 1);
        const hostZIndex = componentHostZIndex(component, baseZIndex, hostParentEl === this.canvas);
        Object.assign(element.style, {
          left: (zIndex.x || 0) + "px",
          top: (zIndex.y || 0) + "px",
          width: (zIndex.width || 100) + "px",
          height: (zIndex.height || 100) + "px",
          zIndex: String(hostZIndex),
          transform: "rotate(" + (zIndex.rotation || 0) + "deg) scale(" + (isFillLayout ? 1 : componentScale) + ")"
        });
        element.style.setProperty("--hb-component-z", String(hostZIndex));
        element.classList.toggle("layout-fill", isFillLayout);
        const hintEl = element.querySelector(".hb-floorplan-auto-diagram-preview-hint");
        const isViewMode = component.properties?.interactionMode === "view";
        position1?.classList.toggle("is-view-mode", isViewMode);
        position1?.classList.toggle("is-position-mode", !isViewMode);
        if (hintEl) {
          hintEl.textContent = isViewMode ? "拖动旋转 · 右键平移 · 滚轮缩放" : "拖动控件调整位置，右下角调整大小";
        }
        this.syncSelection();
        this.updateTransformHandleScale(element, component);
        return true;
      }
    }
    const nextSibling = element.nextSibling;
    this.cleanupRenderedComponent(component1);
    for (const runHelper of this.cameraCleanups.get(component1)?.splice(0) || []) {
      runHelper();
    }
    this.cameraCleanups.delete(component1);
    this.componentEffectLayers.get(component1)?.remove();
    this.componentEffectLayers.delete(component1);
    this.componentAirflowLayers.get(component1)?.remove();
    this.componentAirflowLayers.delete(component1);
    element.remove();
    this.renderComponent(component, hostParentEl);
    const state = this.componentHosts.get(component1);
    if (state && nextSibling?.parentElement === hostParentEl) {
      hostParentEl.insertBefore(state, nextSibling);
    }
    this.syncSelection();
    return true;
  }
  refreshRuntimeComponents(entityIds) {
    const allowed = new Set();
    for (const item of entityIds || []) {
      for (const entity of this.runtimeEntityComponentIndex.get(String(item || "")) || []) {
        allowed.add(entity);
      }
    }
    if (!allowed.size) {
      return;
    }
    const allowed2 = new Set(["icon-button-effect", "icon-button", "device-button", "navigation-button", "air-conditioner"]);
    const allowed3 = new Set([...allowed].filter(arg => allowed2.has(this.componentRecords.get(arg)?.type)));
    if (allowed3.size) {
      this.updateOptimisticToggleVisuals("", allowed3);
    }
    for (const item of allowed) {
      const state = this.componentRecords.get(item);
      if (!!state && !allowed2.has(state.type) && !["line-chart", "camera", "vacuum-map"].includes(state.type)) {
        this.refreshRuntimeComponent(item);
      }
    }
  }
  applyEditorComponentUpdates(updates, documentModel, removedComponentIds = []) {
    if (!this.options.editable || !this.document || !Array.isArray(removedComponentIds) || !removedComponentIds.length) {
      return false;
    }
    const filtered = removedComponentIds.map(arg => ({
      componentId: String(arg?.componentId || ""),
      component: arg?.component
    })).filter(arg => arg.componentId && arg.component);
    if (!filtered.length || filtered.length !== removedComponentIds.length || filtered.some(({
      componentId,
      component
    }) => {
      const state = this.componentRecords.get(componentId);
      return !state || state.type === "group" || state.type !== component.type;
    })) {
      return false;
    }
    const allowed = new Set();
    for (const {
      componentId
    } of filtered) {
      const state = this.componentRecords.get(componentId);
      for (const entity of this.runtimeEntityIdsForComponent(state)) {
        allowed.add(entity);
      }
    }
    this.document = updates;
    this.page = this.document.pages?.find(documentModel1 => documentModel1.path === documentModel) || this.document.pages?.find(arg => arg.path === this.document.defaultPagePath) || this.document.pages?.[0] || null;
    for (const {
      componentId,
      component
    } of filtered) {
      const state = this.componentRecords.get(componentId);
      this.unindexRuntimeComponent(componentId);
      for (const key of Object.keys(state)) {
        delete state[key];
      }
      Object.assign(state, structuredClone(component));
      this.indexRuntimeComponent(state);
    }
    for (const {
      componentId
    } of filtered) {
      this.refreshEditorComponent(componentId);
    }
    this.syncSelection();
    const allowed2 = new Set();
    for (const {
      componentId
    } of filtered) {
      for (const entity of this.runtimeEntityIdsForComponent(this.componentRecords.get(componentId))) {
        allowed2.add(entity);
      }
    }
    if (allowed.size !== allowed2.size || [...allowed].some(arg => !allowed2.has(arg))) {
      this.connectRuntime();
    }
    return true;
  }
  scheduleRuntimeRender(entityIds, delayMs = 120) {
    if (!this.destroyed && !!this.document && !!entityIds) {
      this.runtimeRenderEntityIds.add(String(entityIds));
      window.clearTimeout(this.runtimeRenderTimer);
      this.runtimeRenderTimer = window.setTimeout(() => {
        this.runtimeRenderTimer = 0;
        const state = [...this.runtimeRenderEntityIds];
        this.runtimeRenderEntityIds.clear();
        if (!this.destroyed) {
          this.refreshRuntimeComponents(state);
        }
      }, Math.max(0, Number(delayMs) || 0));
    }
  }
  setEffectLayerActive(element, active, fadeMs = 0) {
    if (!element) {
      return;
    }
    if (active) {
      this.runtimeEffectImageLoader.promote(element.querySelector(":scope > img[data-effect-source]"));
    }
    const state = element.classList.contains("active") !== active;
    window.clearTimeout(element.hbTransitionTimer);
    element.classList.remove("is-transitioning");
    if (state && fadeMs > 0) {
      element.classList.add("is-transitioning");
      element.offsetWidth;
    }
    element.classList.toggle("active", active);
    if (state && fadeMs > 0) {
      element.hbTransitionTimer = window.setTimeout(() => {
        element.classList.remove("is-transitioning");
        element.hbTransitionTimer = null;
      }, fadeMs * 1000 + 80);
    }
  }
  syncEffectLayerLightVisual(component, element) {
    if (!element || component?.type !== "icon-button-effect") {
      return;
    }
    const numeric1 = component.properties || {};
    const text = String(component?.bindings?.entity?.entityId || "");
    element.classList.toggle("awaiting-light-visual", iconButtonEffectLightVisualAwaiting(component, {
      editable: this.options.editable,
      states: this.states,
      pendingOptimisticState: this.pendingOptimisticStates.get(text)
    }));
    const state = iconButtonEffectLightVisualState(component, {
      states: this.states
    });
    const numeric = Number(numeric1.effectOpacity ?? 1);
    const finiteNumber = Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : 1;
    element.style.setProperty("--hb-effect-image-opacity", String(finiteNumber * state.opacity));
    const element2 = element.querySelector(":scope > img");
    if (element2) {
      element2.style.filter = state.filter;
    }
  }
  cachedLightVisualState(entityId1) {
    const entityId = String(entityId1 || "");
    if (!entityId.startsWith("light.")) {
      return null;
    }
    const state = this.confirmedLightVisualStates.get(entityId);
    if (state) {
      return state;
    }
    try {
      const parsedJson = JSON.parse(window.localStorage?.getItem("ha-bridge:light-visual:" + entityId) || "null");
      if (!parsedJson?.attributes || Date.now() - Number(parsedJson.at || 0) > 2592000000) {
        return null;
      }
      const state1 = {
        entityId,
        state: "on",
        attributes: parsedJson.attributes
      };
      this.confirmedLightVisualStates.set(entityId, state1);
      return state1;
    } catch {
      return null;
    }
  }
  rememberLightVisualState(entityId1, visual) {
    const entityId = String(entityId1 || "");
    const entityId2 = visual?.newState || visual;
    if (!entityId.startsWith("light.") || !entityId2?.attributes) {
      return;
    }
    const attributes = entityId2.attributes;
    const runHelper = arg => attributes[arg] !== null && attributes[arg] !== undefined && attributes[arg] !== "" && Number.isFinite(Number(attributes[arg]));
    if (!runHelper("brightness") && !runHelper("color_temp_kelvin") && !runHelper("color_temp")) {
      return;
    }
    const attributes2 = {
      ...(this.cachedLightVisualState(entityId)?.attributes || {})
    };
    for (const item of ["brightness", "color_temp_kelvin", "color_temp", "color_mode", "supported_color_modes"]) {
      if (attributes[item] !== null && attributes[item] !== undefined && attributes[item] !== "") {
        attributes2[item] = Array.isArray(attributes[item]) ? [...attributes[item]] : attributes[item];
      }
    }
    const state = {
      entityId,
      state: "on",
      attributes: attributes2
    };
    this.confirmedLightVisualStates.set(entityId, state);
    try {
      window.localStorage?.setItem("ha-bridge:light-visual:" + entityId, JSON.stringify({
        at: Date.now(),
        attributes: attributes2
      }));
    } catch {}
  }
  optimisticStateIsConfirmed(entityId, expected) {
    const state = this.pendingOptimisticStates.get(String(entityId || ""));
    if (!state) {
      return true;
    }
    if (Date.now() >= state.expiresAt) {
      this.pendingOptimisticStates.delete(String(entityId || ""));
      return true;
    }
    const found = [...this.componentRecords.values()].find(component => {
      const entityId = component.bindings?.entity?.entityId;
      return entityId && this.powerEntityId(component, entityId) === String(entityId);
    });
    if (entityPowerIsOn(String(entityId || ""), expected?.newState || expected, found || {}) === state.desiredActive) {
      if (state.desiredActive === true && found?.type === "icon-button-effect" && iconButtonEffectLightVisualAwaiting(found, {
        states: new Map([[String(entityId || ""), expected?.newState || expected]])
      })) {
        return false;
      } else {
        this.rememberLightVisualState?.(entityId, expected);
        this.pendingOptimisticStates.delete(String(entityId || ""));
        return true;
      }
    } else {
      return false;
    }
  }
  updateOptimisticToggleVisuals(targetPowerEntityId, componentIdFilter = null) {
    for (const [record, component] of this.componentRecords) {
      const entityId = component.bindings?.entity?.entityId;
      const powerEntityId = entityId ? this.powerEntityId(component, entityId) : "";
      if (!entityId || (componentIdFilter ? !componentIdFilter.has(record) : powerEntityId !== targetPowerEntityId) || !["icon-button-effect", "icon-button", "device-button", "navigation-button", "air-conditioner"].includes(component.type)) {
        continue;
      }
      const entityState = this.states.get(powerEntityId);
      const isCoverEntity = String(powerEntityId || "").startsWith("cover.");
      const isDreamCover = isCoverEntity && coverComponentIsDream(component, powerEntityId, entityState, this.entityMetadata);
      const powerComponent = this.runtimePowerComponent(component, entityId);
      const powerIsOn = isCoverEntity ? isDreamCover ? runtimeEntityStateIsActive(entityState) : runtimeCoverStateIsActive(entityState) : entityPowerIsOn(powerEntityId, entityState, powerComponent);
      const previewState = this.componentPreviewStates.get(record) || "auto";
      const displayedOn = previewState === "on" ? true : previewState === "off" ? false : isCoverEntity && coverMotorIsReversedForComponent(component, this.entityMetadata, this.states, powerEntityId) ? !powerIsOn : powerIsOn;
      const host = this.componentHosts.get(record);
      this.cleanupRenderedComponent(record);
      if (host && component.type === "icon-button-effect") {
        const element = host.querySelector(":scope > .hb-icon-button-effect");
        const renderContext = {
          document: this.document,
          page: this.page,
          states: this.states,
          history: this.historySeries,
          entityMetadata: this.entityMetadata,
          deviceMetadata: this.deviceMetadata,
          entityTranslations: this.entityTranslations,
          renderNamespace: this.renderNamespace,
          editable: !!this.options.editable,
          liveMedia: this.options.liveMedia !== false,
          previewState: this.componentPreviewStates.get(record) || "auto",
          isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
          navigate: navigate => this.navigate(navigate),
          invalidate: () => this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: cleanup => this.registerComponentCleanup(record, cleanup)
        };
        const renderedNode = renderRegisteredComponent(powerComponent, renderContext);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          renderedNode.style.width = 100 / numeric + "%";
          renderedNode.style.height = 100 / numeric + "%";
          renderedNode.style.transform = "scale(" + numeric + ")";
          renderedNode.style.transformOrigin = "top left";
        }
        if (element) {
          element.replaceWith(renderedNode);
        } else {
          host.prepend(renderedNode);
        }
      }
      if (host && ["icon-button", "device-button", "navigation-button"].includes(component.type)) {
        const matchedEl = component.type === "navigation-button" ? host.querySelector(":scope > .hb-navigation-button") : host.querySelector(":scope > .hb-icon-button");
        const renderContext = {
          document: this.document,
          page: this.page,
          states: this.states,
          history: this.historySeries,
          entityMetadata: this.entityMetadata,
          deviceMetadata: this.deviceMetadata,
          entityTranslations: this.entityTranslations,
          renderNamespace: this.renderNamespace,
          editable: !!this.options.editable,
          liveMedia: this.options.liveMedia !== false,
          previewState: this.componentPreviewStates.get(record) || "auto",
          isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
          navigate: navigate => this.navigate(navigate),
          invalidate: () => this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: cleanup => this.registerComponentCleanup(record, cleanup)
        };
        const renderedNode = renderRegisteredComponent(powerComponent, renderContext);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          renderedNode.style.width = 100 / numeric + "%";
          renderedNode.style.height = 100 / numeric + "%";
          renderedNode.style.transform = "scale(" + numeric + ")";
          renderedNode.style.transformOrigin = "top left";
        }
        if (matchedEl) {
          matchedEl.replaceWith(renderedNode);
        } else {
          host.prepend(renderedNode);
        }
        if (component.type === "device-button") {
          const element = host.querySelector(":scope > .hb-runtime-action-hitbox");
          if (element) {
            element.hidden = !this.updateDeviceButtonSelectionBounds(host, component, element);
          }
        }
      }
      if (host && component.type === "air-conditioner") {
        const renderContext = {
          document: this.document,
          page: this.page,
          states: this.states,
          history: this.historySeries,
          entityMetadata: this.entityMetadata,
          deviceMetadata: this.deviceMetadata,
          entityTranslations: this.entityTranslations,
          renderNamespace: this.renderNamespace,
          editable: !!this.options.editable,
          liveMedia: this.options.liveMedia !== false,
          previewState: this.componentPreviewStates.get(record) || "auto",
          isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
          navigate: navigate => this.navigate(navigate),
          invalidate: () => this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: cleanup => this.registerComponentCleanup(record, cleanup)
        };
        const element = host.querySelector(":scope > .hb-air-conditioner");
        const renderedNode = renderRegisteredComponent(powerComponent, renderContext);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          renderedNode.style.width = 100 / numeric + "%";
          renderedNode.style.height = 100 / numeric + "%";
          renderedNode.style.transform = "scale(" + numeric + ")";
          renderedNode.style.transformOrigin = "top left";
        }
        if (element) {
          element.replaceWith(renderedNode);
        } else {
          host.prepend(renderedNode);
        }
        this.componentAirflowLayers.get(record)?.remove();
        this.componentAirflowLayers.delete(record);
        const state10 = renderAirConditionerAirflowLayer(powerComponent, renderContext);
        if (state10) {
          const grouped = host.parentElement !== this.canvas;
          const airflowGeometry = airflowLayerGeometry(component, {
            grouped
          });
          const numeric2 = Number(host.style.getPropertyValue("--hb-component-z") || component.position?.zIndex || 1);
          state10.dataset.airflowFor = record;
          state10.hidden = component.style?.visible === false;
          Object.assign(state10.style, {
            left: airflowGeometry.left + "px",
            top: airflowGeometry.top + "px",
            width: airflowGeometry.width + "px",
            height: airflowGeometry.height + "px",
            zIndex: String(numeric2),
            transform: "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")"
          });
          if (grouped) {
            host.append(state10);
          } else {
            this.canvas.insertBefore(state10, host);
          }
          this.componentAirflowLayers.set(record, state10);
          if (this.options.editable && this.selectedComponentIds.size === 1 && this.selectedComponentId === record && this.componentSelectionLayers.get(record) === "airflow") {
            this.syncSelection();
          }
        }
      }
      if (component.type !== "icon-button-effect") {
        continue;
      }
      const state7 = this.componentEffectLayers.get(record);
      this.syncEffectLayerLightVisual(component, state7);
      this.setEffectLayerActive(state7, displayedOn, effectFadeDuration(component));
    }
  }
  refreshVacuumMapEntity(entityId) {
    if (this.options.liveMedia === false || !String(entityId || "").startsWith("image.")) {
      return;
    }
    const state = this.states.get(entityId);
    const state1 = vacuumMapImageSource(entityId, state);
    let state2 = false;
    for (const [record, component] of this.componentRecords) {
      if (component.type !== "vacuum-map" || component.bindings?.entity?.entityId !== entityId) {
        continue;
      }
      const matchedEl = this.componentHosts.get(record)?.querySelector(".hb-vacuum-map-image");
      if (matchedEl) {
        state2 = true;
        if (matchedEl.dataset.vacuumMapSource !== state1) {
          matchedEl.dataset.vacuumMapSource = state1;
        }
        if (matchedEl.dataset.vacuumMapSuspended !== "true" && matchedEl.getAttribute("src") !== state1) {
          matchedEl.src = state1;
        }
      }
    }
    if (!state2 && this.options.liveMedia !== false && this.vacuumMapEntityIds.has(entityId)) {
      this.runtimeVacuumMapImagePreloader.enqueue(state1);
    }
  }
  applyOptimisticToggle(entityId1, nextState = null) {
    const state = entityId1;
    const entityId = this.powerEntityId(nextState, state);
    const state1 = this.states.get(entityId);
    const state2 = state1?.newState || state1 || {
      entityId,
      attributes: {}
    };
    const asString = String(entityId || "").startsWith("cover.");
    const state3 = asString && coverComponentIsDream(nextState, entityId, state1, this.entityMetadata);
    const state4 = this.runtimePowerComponent(nextState, state);
    const desiredActive = !(asString ? state3 ? runtimeEntityStateIsActive(state1) : runtimeCoverStateIsActive(state1) : entityPowerIsOn(entityId, state1, state4));
    const newState = asString ? {
      ...state2,
      state: desiredActive ? "open" : "closed",
      ...(state3 ? {} : {
        attributes: {
          ...(state2.attributes || {}),
          current_position: desiredActive ? 100 : 0
        }
      })
    } : optimisticToggleState(entityId, state2, state4);
    if (desiredActive && String(entityId || "").startsWith("light.")) {
      const state7 = this.cachedLightVisualState(entityId);
      if (state7?.attributes) {
        newState.attributes = {
          ...(newState.attributes || {}),
          ...state7.attributes
        };
      }
    }
    const state5 = state1?.newState ? {
      ...state1,
      newState
    } : newState;
    const text = String(entityId || "");
    const nowMs = {
      desiredActive,
      expiresAt: Date.now() + 8000
    };
    this.pendingOptimisticStates.set(text, nowMs);
    const state6 = window.setTimeout(() => {
      if (this.pendingOptimisticStates.get(text) === nowMs) {
        this.pendingOptimisticStates.delete(text);
        if (this.states.get(entityId) === state5) {
          if (state1 === undefined) {
            this.states.delete(entityId);
          } else {
            this.states.set(entityId, state1);
          }
          this.updateOptimisticToggleVisuals(entityId);
        }
      }
    }, 8000);
    this.states.set(entityId, state5);
    this.updateOptimisticToggleVisuals(entityId);
    return () => {
      window.clearTimeout(state6);
      if (this.pendingOptimisticStates.get(text) === nowMs) {
        this.pendingOptimisticStates.delete(text);
      }
      if (this.states.get(entityId) === state5) {
        if (state1 === undefined) {
          this.states.delete(entityId);
        } else {
          this.states.set(entityId, state1);
        }
        this.updateOptimisticToggleVisuals(entityId);
      }
    };
  }
  renderComponent(component, parentHost = this.canvas, renderOptions = 0, renderContext = null, parentComponent = null) {
    const iconButtonEffectComponent = normalizeIconButtonEffectComponent(component);
    const component2 = this.runtimePowerComponent(iconButtonEffectComponent);
    const element = ["camera", "vacuum-map", "floorplan-auto-diagram", "interaction3d"].includes(component.type) ? renderContext?.get(component.id) : null;
    if (element) {
      const position2 = component.position || {};
      const position3 = parentHost === this.canvas && ["floorplan-auto-diagram", "interaction3d"].includes(component.type) && component.properties?.layoutMode === "fill";
      const numeric2 = position3 ? {
        ...position2,
        x: 0,
        y: 0,
        width: Number(this.document.canvas?.width || 2778),
        height: Number(this.document.canvas?.height || 1940),
        rotation: 0
      } : position2;
      const count2 = Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
      const scale1 = renderOptions + Number(numeric2.zIndex || 1);
      Object.assign(element.style, {
        left: (numeric2.x || 0) + "px",
        top: (numeric2.y || 0) + "px",
        width: (numeric2.width || 100) + "px",
        height: (numeric2.height || 100) + "px",
        zIndex: String(scale1),
        transform: "rotate(" + (numeric2.rotation || 0) + "deg) scale(" + (position3 ? 1 : count2) + ")"
      });
      element.style.setProperty("--hb-component-z", String(scale1));
      element.hidden = component.style?.visible === false;
      element.classList.toggle("layout-fill", position3);
      if (component.type === "interaction3d") {
        element.querySelector(".hb-interaction3d-host")?.updateInteraction3d?.(component, this.document);
      }
      if (component.type === "floorplan-auto-diagram") {
        const state2 = component.properties?.interactionMode === "view";
        const hbFloorplanAutoDiagramPreview = element.querySelector(".hb-floorplan-auto-diagram-preview");
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(".hb-floorplan-auto-diagram-preview-hint");
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-view-mode", state2);
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-position-mode", !state2);
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = state2 ? "拖动旋转 · 右键平移 · 滚轮缩放" : "拖动控件调整位置，右下角调整大小";
        }
      }
      this.componentHosts.set(component.id, element);
      this.componentRecords.set(component.id, component);
      const componentId2 = parentHost?.dataset?.componentId;
      if (componentId2) {
        this.componentParentIds.set(component.id, componentId2);
      }
      this.indexRuntimeComponent(component);
      if (element.parentElement !== parentHost) {
        parentHost.append(element);
      }
      return;
    }
    const element2 = document.createElement("div");
    element2.className = "hb-component hb-component-" + component.type.replace(/[^a-z0-9_-]/gi, "-");
    element2.dataset.componentId = component.id;
    const position = component.position || {};
    const position1 = parentHost === this.canvas && ["image", "floorplan-auto-diagram", "interaction3d"].includes(component.type) && component.properties?.layoutMode === "fill";
    const numeric1 = position1 ? {
      ...position,
      x: 0,
      y: 0,
      width: Number(this.document.canvas?.width || 2778),
      height: Number(this.document.canvas?.height || 1940),
      rotation: 0
    } : position;
    const count = Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
    const scale = renderOptions + Number(numeric1.zIndex || 1);
    const state = componentHostZIndex(component, scale, parentHost === this.canvas);
    Object.assign(element2.style, {
      left: (numeric1.x || 0) + "px",
      top: (numeric1.y || 0) + "px",
      width: (numeric1.width || 100) + "px",
      height: (numeric1.height || 100) + "px",
      zIndex: String(state),
      transform: "rotate(" + (numeric1.rotation || 0) + "deg) scale(" + (position1 ? 1 : count) + ")"
    });
    element2.style.setProperty("--hb-component-z", String(state));
    element2.hidden = component.style?.visible === false;
    if (component.type === "icon-button-effect" && component.properties?.buttonVisible === false && component.properties?.hiddenContentClickable !== true && !this.options.editable) {
      element2.style.pointerEvents = "none";
    }
    element2.classList.toggle("layout-fill", position1);
    this.componentHosts.set(component.id, element2);
    this.componentRecords.set(component.id, component);
    const componentId = parentHost?.dataset?.componentId;
    if (componentId) {
      this.componentParentIds.set(component.id, componentId);
    }
    this.indexRuntimeComponent(component);
    const state1 = {
      document: this.document,
      page: this.page,
      states: this.states,
      history: this.historySeries,
      entityMetadata: this.entityMetadata,
      deviceMetadata: this.deviceMetadata,
      entityTranslations: this.entityTranslations,
      renderNamespace: this.renderNamespace,
      editable: !!this.options.editable,
      liveMedia: this.options.liveMedia !== false,
      previewState: this.componentPreviewStates.get(component.id) || "auto",
      isIconVisible: isIconVisible => this.iconVisibilityState(isIconVisible),
      navigate: navigate => this.navigate(navigate),
      callEntityService: (...callEntityService) => this.callEntityService(...callEntityService),
      openCameraPreview: (camera, onClose, options) => this.openInteraction3dCameraPreview(camera, onClose, options),
      openVacuumDetails: (onError, vacuumOptions, extraOptions) => this.openInteraction3dVacuumDetails(onError, vacuumOptions, extraOptions),
      runVacuumRoom: registerRuntimeStateHandler => this.dispatchAction({
        id: component.id + ":room:" + registerRuntimeStateHandler.id,
        type: "device-button",
        properties: {
          label: registerRuntimeStateHandler.label
        },
        bindings: {
          entity: {
            entityId: registerRuntimeStateHandler.entityId
          }
        }
      }, {
        type: "toggle",
        data: {}
      }),
      onError: error => this.options.onError?.(error),
      registerRuntimeStateHandler: (cleanup, entityIds) => this.registerRuntimeStateHandler(cleanup, entityIds, component.id),
      invalidate: () => this.renderComponents(true),
      cleanup: cleanupFn => {
        if (["camera", "vacuum-map"].includes(component.type)) {
          if (!this.cameraCleanups.has(component.id)) {
            this.cameraCleanups.set(component.id, []);
          }
          this.cameraCleanups.get(component.id).push(cleanupFn);
        } else {
          this.registerComponentCleanup(component.id, cleanupFn);
        }
      }
    };
    if (component.type === "icon-button-effect") {
      const element4 = renderIconButtonEffectLayer(component2, state1);
      if (element4) {
        const state2 = parentComponent?.get(component.id) || null;
        const element5 = state2 || element4;
        const element6 = element4.querySelector("img");
        const element7 = element5.querySelector("img");
        const active = element4.classList.contains("active");
        if (state2 && element7 && element6) {
          element5.classList.toggle("awaiting-light-visual", element4.classList.contains("awaiting-light-visual"));
          const state5 = element6.dataset.effectSource || "";
          if (state5) {
            element7.dataset.effectSource = state5;
          } else {
            delete element7.dataset.effectSource;
            const state6 = element6.getAttribute("src");
            if (state6) {
              element7.src = state6;
            }
          }
          element7.alt = element6.alt;
          element7.draggable = false;
          element7.decoding = "async";
          element7.style.objectFit = element6.style.objectFit;
          element7.style.mixBlendMode = element6.style.mixBlendMode;
          for (const item of ["effectOriginalWidth", "effectOriginalHeight", "effectCropX", "effectCropY", "effectCropWidth", "effectCropHeight"]) {
            if (element6.dataset[item] !== undefined) {
              element7.dataset[item] = element6.dataset[item];
            } else {
              delete element7.dataset[item];
            }
          }
        }
        const numeric4 = component2.properties || {};
        const numeric2 = Number(this.document.canvas?.width || 2778);
        const numeric3 = Number(this.document.canvas?.height || 1940);
        const size = numeric4.effectLayoutMode === "fill";
        const state3 = parentHost !== this.canvas;
        element5.dataset.effectFor = component.id;
        element5.hidden = component.style?.visible === false;
        const clampNumber = () => {
          const state5 = effectSourceDimensions(numeric4, element7, numeric2, numeric3);
          const angle = effectCropRectangle(element7, state5);
          const state6 = !size && !state5.pendingNaturalSize ? effectReferenceImageTransform(this.page, component, state5.width, state5.height, numeric2, numeric3) : null;
          const count2 = Math.max(0.01, Math.min(5, Number(numeric4.effectScale || 1)));
          const scale = size ? Math.min(numeric2 / state5.width, numeric3 / state5.height) : (state6?.scale || 1) * count2;
          const rotation = size ? 0 : Number(numeric4.effectRotation || 0);
          const asNumber = Number(numeric4.effectLeft ?? 50) / 100;
          const asNumber1 = Number(numeric4.effectTop ?? 50) / 100;
          const centerX = size ? numeric2 / 2 : numeric2 * asNumber;
          const centerY = size ? numeric3 / 2 : numeric3 * asNumber1;
          const state7 = effectCroppedLayerGeometry({
            centerX,
            centerY,
            originalWidth: state5.width,
            originalHeight: state5.height,
            cropX: angle.x,
            cropY: angle.y,
            cropWidth: angle.width,
            cropHeight: angle.height,
            scale,
            rotation
          });
          let size1 = state7;
          if (state3) {
            const size2 = state7.left + state7.width / 2;
            const size3 = state7.top + state7.height / 2;
            const componentId2 = parentHost?.dataset?.componentId;
            const state8 = componentId2 ? this.worldPointToComponentLocal(componentId2, size2, size3) : {
              x: size2,
              y: size3
            };
            const scale1 = componentId2 ? this.componentWorldTransform(componentId2) : {
              scale: 1,
              rotation: 0
            };
            size1 = {
              ...state7,
              left: state8.x - state7.width / 2,
              top: state8.y - state7.height / 2,
              scale: state7.scale / Math.max(0.0001, scale1.scale),
              rotation: state7.rotation - scale1.rotation
            };
          }
          Object.assign(element5.style, {
            left: size1.left + "px",
            top: size1.top + "px",
            width: state7.width + "px",
            height: state7.height + "px",
            visibility: state5.pendingNaturalSize ? "hidden" : "",
            zIndex: String(state3 ? scale - 0.1 : scale),
            transform: "rotate(" + size1.rotation + "deg) scale(" + size1.scale + ")"
          });
          return state5;
        };
        if (clampNumber().pendingNaturalSize && element7) {
          element7.addEventListener("load", () => {
            if (element5.isConnected) {
              clampNumber();
            }
          }, {
            once: true
          });
        }
        (state3 ? parentHost : size ? this.canvas : parentHost).append(element5);
        this.componentEffectLayers.set(component.id, element5);
        const state4 = element7?.dataset.effectSource || "";
        if (state4) {
          this.runtimeEffectImageLoader.enqueue(element7, state4, {
            active
          });
        }
        if (state2) {
          const state5 = element6?.style.filter || "none";
          const state6 = element4.style.getPropertyValue("--hb-effect-image-opacity");
          const state7 = element4.style.getPropertyValue("--hb-effect-fade-duration");
          const state8 = element4.style.getPropertyValue("--hb-effect-visual-transition-duration");
          const opacity = element4.style.opacity;
          const transition = element4.style.transition;
          element7?.offsetWidth;
          if (element7) {
            element7.style.filter = state5;
          }
          element5.style.opacity = opacity;
          element5.style.transition = transition;
          element5.style.setProperty("--hb-effect-image-opacity", state6);
          element5.style.setProperty("--hb-effect-fade-duration", state7);
          element5.style.setProperty("--hb-effect-visual-transition-duration", state8);
          this.setEffectLayerActive(element5, active, effectFadeDuration(component));
        }
      }
    }
    if (component.type === "air-conditioner") {
      const state2 = renderAirConditionerAirflowLayer(component2, state1);
      if (state2) {
        state2.dataset.airflowFor = component.id;
        state2.hidden = component.style?.visible === false;
        const grouped = parentHost !== this.canvas;
        const airflowGeometry = airflowLayerGeometry(component, {
          grouped
        });
        Object.assign(state2.style, {
          left: airflowGeometry.left + "px",
          top: airflowGeometry.top + "px",
          width: airflowGeometry.width + "px",
          height: airflowGeometry.height + "px",
          zIndex: String(scale),
          transform: "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")"
        });
        (grouped ? element2 : parentHost).append(state2);
        this.componentAirflowLayers.set(component.id, state2);
      }
    }
    const groupContainerEl = component.type === "group" ? (() => {
      const groupContainerEl1 = document.createElement("div");
      groupContainerEl1.className = "hb-group-container";
      return groupContainerEl1;
    })() : renderRegisteredComponent(component2, state1);
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      groupContainerEl.style.width = 100 / numeric + "%";
      groupContainerEl.style.height = 100 / numeric + "%";
      groupContainerEl.style.transform = "scale(" + numeric + ")";
      groupContainerEl.style.transformOrigin = "top left";
    }
    element2.append(groupContainerEl);
    if (component.type === "line-chart") {
      let element4 = groupContainerEl;
      const applyElementStyle = () => {
        if (!element4?.isConnected) {
          return;
        }
        const size = renderRegisteredComponent(component2, state1);
        if (numeric !== 1) {
          size.style.width = 100 / numeric + "%";
          size.style.height = 100 / numeric + "%";
          size.style.transform = "scale(" + numeric + ")";
          size.style.transformOrigin = "top left";
        }
        element4.cleanupLineChartHover?.();
        element4.replaceWith(size);
        element4 = size;
      };
      this.registerRuntimeStateHandler(component.bindings?.entity?.entityId, arg => {
        element4.syncLineChartState?.(arg);
        if (element4.classList.contains("history-loading")) {
          applyElementStyle();
        }
      }, component.id);
      this.registerHistoryChartRefresher(applyElementStyle, component.id);
    }
    if (this.options.editable) {
      element2.classList.add("editable");
      element2.addEventListener("pointerdown", arg => this.startComponentMove(arg, component, element2));
    } else {
      const state2 = Object.prototype.hasOwnProperty.call(component.actions || {}, "tap");
      const state3 = component.type === "camera" && component.bindings?.entity?.entityId && !state2 ? {
        ...component,
        actions: {
          tap: {
            type: "more-info",
            data: {
              popupSource: "current"
            }
          },
          ...(component.actions || {})
        }
      } : component;
      if (component.type === "light-statistics") {
        element2.classList.add("hb-runtime-fitted-hit-area");
      }
      if (Object.values(state3.actions || {}).some(arg => isComponentActionSupported(state3, arg))) {
        element2.classList.add("interactive");
        let runtimeActionHitboxEl = element2;
        if (["title-button", "device-button", "light-statistics"].includes(component.type)) {
          runtimeActionHitboxEl = document.createElement("span");
          runtimeActionHitboxEl.className = "hb-runtime-action-hitbox";
          runtimeActionHitboxEl.setAttribute("aria-hidden", "true");
          element2.classList.add("hb-runtime-fitted-hit-area");
          element2.append(runtimeActionHitboxEl);
        }
        this.bindRuntimeActions(runtimeActionHitboxEl, state3);
      }
    }
    parentHost.append(element2);
    const element3 = element2.querySelector(":scope > .hb-runtime-action-hitbox");
    if (element3) {
      const state2 = component.type === "title-button" ? this.updateTitleButtonSelectionBounds(element2, component, element3) : component.type === "light-statistics" ? this.updateLightStatisticsSelectionBounds(element2, component, element3) : this.updateDeviceButtonSelectionBounds(element2, component, element3);
      element3.hidden = !state2;
    }
    for (const child of component.children || []) {
      this.renderComponent(child, element2, 0, renderContext, parentComponent);
    }
  }
  startComponentMove(event, component, pointerEvent, originEvent = pointerEvent) {
    if (!this.options.editable || !this.selectedComponentIds.has(component.id) || component.properties?.layoutMode === "fill" || event.button !== 0 || event.target.closest(".hb-transform-handle")) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const clientX = event.clientX;
    const clientY = event.clientY;
    const filtered = [...this.selectedComponentIds].map(arg => ({
      component: this.componentRecords.get(arg),
      host: this.componentHosts.get(arg)
    })).filter(arg => arg.component && arg.host).map(arg => ({
      ...arg,
      initialX: Number(arg.component.position?.x || 0),
      initialY: Number(arg.component.position?.y || 0),
      width: Number(arg.component.position?.width || 100),
      height: Number(arg.component.position?.height || 100),
      parentId: this.componentParentIds.get(arg.component.id) || null,
      parentTransform: this.componentParentTransform(arg.component.id)
    }));
    if (!filtered.some(arg => arg.component.id === component.id) || filtered.some(arg => arg.component.properties?.layoutMode === "fill")) {
      return;
    }
    let state = eventHasCommandModifier(event);
    let state1 = !state && filtered.length === 1 && component.type === "air-conditioner" && this.componentSelectionLayers.get(component.id) !== "airflow";
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const numeric2 = Number(component.properties?.airflowOffsetY ?? 34);
    let airflowOffsetX = numeric;
    let airflowOffsetY = numeric2;
    const numeric3 = Number(this.document?.canvas?.width || 2778);
    const numeric4 = Number(this.document?.canvas?.height || 1940);
    const runHelper = arg => {
      const numeric1 = arg.parentId ? this.componentRecords.get(arg.parentId) : null;
      const numeric7 = Number(numeric1?.position?.width || numeric3);
      const numeric8 = Number(numeric1?.position?.height || numeric4);
      return {
        minX: -arg.width / 2 - arg.initialX,
        maxX: numeric7 - arg.width / 2 - arg.initialX,
        minY: -arg.height / 2 - arg.initialY,
        maxY: numeric8 - arg.height / 2 - arg.initialY
      };
    };
    const clampNumber = (arg, second, pointerEvent) => {
      const state8 = groupedComponentLocalDelta(second, pointerEvent, arg.parentTransform);
      const state9 = runHelper(arg);
      return {
        x: Math.max(state9.minX, Math.min(state9.maxX, state8.x)),
        y: Math.max(state9.minY, Math.min(state9.maxY, state8.y))
      };
    };
    const numeric5 = Number(component.position?.x || 0);
    const numeric6 = Number(component.position?.y || 0);
    let position = numeric5;
    let state2 = numeric6;
    let state3 = filtered;
    let state4 = [];
    let mapped = filtered.map(arg => ({
      componentId: arg.component.id,
      x: arg.initialX,
      y: arg.initialY
    }));
    let id = component.id;
    let state5 = false;
    let state6 = "";
    let event1 = false;
    const pointerId = event.pointerId;
    originEvent.setPointerCapture(pointerId);
    filtered.forEach(arg => arg.host.classList.add("moving"));
    const event2 = event3 => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      if (!originEvent.hasPointerCapture?.(pointerId) && originEvent.isConnected) {
        try {
          originEvent.setPointerCapture(pointerId);
        } catch {}
      }
      if (!state && eventHasCommandModifier(event3)) {
        state = true;
        state1 = false;
      }
      let event4 = event3.clientX - clientX;
      let amount = event3.clientY - clientY;
      if (state && !state5) {
        if (Math.hypot(event4, amount) < 3) {
          return;
        }
        state4 = filtered.map(arg => {
          const copiedComponent = assignComponentIds(structuredClone(arg.component));
          copiedComponent.position = {
            ...(copiedComponent.position || {}),
            zIndex: Number(copiedComponent.position?.zIndex || 1) + 1
          };
          this.renderComponent(copiedComponent, arg.host.parentElement);
          return {
            sourceComponentId: arg.component.id,
            copiedComponent
          };
        });
        state3 = state4.map((arg, index) => ({
          component: arg.copiedComponent,
          host: this.componentHosts.get(arg.copiedComponent.id),
          initialX: filtered[index].initialX,
          initialY: filtered[index].initialY,
          width: filtered[index].width,
          height: filtered[index].height,
          parentId: filtered[index].parentId,
          parentTransform: filtered[index].parentTransform
        }));
        id = state4.find(arg => arg.sourceComponentId === component.id)?.copiedComponent.id || state4[0]?.copiedComponent.id;
        state5 = true;
        filtered.forEach(arg => arg.host.classList.remove("moving"));
        state3.forEach(arg => arg.host?.classList.add("moving"));
        this.selectedComponentId = id;
        this.selectedComponentIds = new Set(state3.map(arg => arg.component.id));
      }
      if (event3.shiftKey) {
        if (!state6 && Math.hypot(event4, amount) >= 1) {
          state6 = Math.abs(event4) >= Math.abs(amount) ? "horizontal" : "vertical";
        }
        if (state6 === "horizontal") {
          amount = 0;
        }
        if (state6 === "vertical") {
          event4 = 0;
        }
      } else {
        state6 = "";
      }
      const state8 = event4 / (this.appliedScaleX || 1);
      const state9 = amount / (this.appliedScaleY || 1);
      const found = clampNumber(filtered.find(arg => arg.component.id === component.id) || filtered[0], state8, state9);
      position = numeric5 + found.x;
      state2 = numeric6 + found.y;
      if (state1) {
        airflowOffsetX = numeric - found.x / Math.max(1, Number(component.position?.width || 100)) * 100;
        airflowOffsetY = numeric2 - found.y / Math.max(1, Number(component.position?.height || 100)) * 100;
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX,
          airflowOffsetY
        };
        this.options.onComponentPropertiesPreview?.(component.id, {
          airflowOffsetX,
          airflowOffsetY
        });
      }
      const mapped1 = state3.map(arg => {
        const state10 = clampNumber(arg, state8, state9);
        return {
          componentId: arg.component.id,
          x: arg.initialX + state10.x,
          y: arg.initialY + state10.y
        };
      });
      mapped = mapped1;
      for (const item of mapped1) {
        const size = this.componentHosts.get(item.componentId);
        if (size) {
          size.style.left = item.x + "px";
          size.style.top = item.y + "px";
        }
        const state10 = this.componentSelectionOverlays.get(item.componentId);
        if (state10) {
          state10.style.left = item.x + "px";
          state10.style.top = item.y + "px";
        }
      }
      if (!state5) {
        if (mapped1.length > 1) {
          this.options.onComponentsTransformPreview?.(mapped1, component.id);
        } else {
          this.options.onComponentTransformPreview?.(component.id, {
            x: position,
            y: state2
          });
        }
      }
    };
    const state7 = (event3 = null) => {
      if (!event1 && (event3?.pointerId == null || event3.pointerId === pointerId) && (event1 = true, state3.forEach(arg => arg.host?.classList.remove("moving")), filtered.forEach(arg => arg.host.classList.remove("moving")), window.removeEventListener("pointermove", event2, true), window.removeEventListener("pointerup", state7, true), window.removeEventListener("pointercancel", state7, true), window.removeEventListener("blur", state7), position !== numeric5 || state2 !== numeric6)) {
        if (state5) {
          state3.forEach(arg => {
            const found = mapped.find(entry => entry.componentId === arg.component.id);
            arg.component.position = {
              ...(arg.component.position || {}),
              x: found?.x ?? arg.initialX,
              y: found?.y ?? arg.initialY
            };
          });
          this.options.onComponentsDuplicate?.(state4, component.id, id);
        } else if (filtered.length > 1) {
          const found = mapped.map(arg => {
            const found1 = filtered.find(entry => entry.component.id === arg.componentId);
            if (found1) {
              found1.component.position = {
                ...(found1.component.position || {}),
                x: arg.x,
                y: arg.y
              };
            }
            return arg;
          });
          this.options.onComponentsTransform?.(found, component.id);
        } else {
          component.position = {
            ...(component.position || {}),
            x: position,
            y: state2
          };
          this.options.onComponentTransform?.(component.id, {
            x: position,
            y: state2,
            ...(state1 ? {
              airflowOffsetX,
              airflowOffsetY
            } : {})
          });
        }
      }
    };
    window.addEventListener("pointermove", event2, true);
    window.addEventListener("pointerup", state7, true);
    window.addEventListener("pointercancel", state7, true);
    window.addEventListener("blur", state7);
  }
  createComponentSelectionOverlay(host, component) {
    if (!host || !component || !host.parentElement || host.parentElement !== this.canvas && !host.hidden) {
      return null;
    }
    const hostParentEl2 = host.parentElement;
    const element = document.createElement("div");
    element.className = "hb-component-selection-overlay";
    if (component.type === "light-statistics") {
      element.classList.add("hb-light-statistics-selection-overlay");
    }
    if (component.type === "floorplan-auto-diagram" && component.properties?.interactionMode === "view") {
      element.classList.add("hb-floorplan-auto-diagram-view-overlay");
    }
    element.dataset.selectionFor = component.id;
    Object.assign(element.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform
    });
    if (component.type !== "light-statistics") {
      element.addEventListener("pointerdown", arg => this.startComponentMove(arg, component, host, element));
    }
    hostParentEl2.append(element);
    this.componentSelectionOverlays.set(component.id, element);
    return element;
  }
  createAirflowSelectionOverlay(host, component) {
    if (!host || !component || !host.parentElement) {
      return null;
    }
    const componentSelectionOverlayEl = document.createElement("div");
    componentSelectionOverlayEl.className = "hb-component-selection-overlay hb-airflow-selection-overlay";
    componentSelectionOverlayEl.dataset.selectionFor = component.id;
    Object.assign(componentSelectionOverlayEl.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform
    });
    host.parentElement.append(componentSelectionOverlayEl);
    this.componentSelectionOverlays.set(component.id, componentSelectionOverlayEl);
    return componentSelectionOverlayEl;
  }
  syncAirflowLayerGeometry(componentId, airflowEl, geometryOverride = null) {
    if (!componentId || !airflowEl) {
      return;
    }
    const airflowGeometry = airflowLayerGeometry(airflowEl, {
      grouped: componentId.parentElement !== this.canvas
    });
    const size = {
      left: airflowGeometry.left + "px",
      top: airflowGeometry.top + "px",
      width: airflowGeometry.width + "px",
      height: airflowGeometry.height + "px",
      transform: "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")"
    };
    Object.assign(componentId.style, size);
    if (geometryOverride) {
      Object.assign(geometryOverride.style, size);
    }
  }
  appendEffectSelectionBounds(host, component) {
    if (!host || !component || !host.parentElement) {
      return;
    }
    const componentSelectionOverlayEl = document.createElement("div");
    componentSelectionOverlayEl.className = "hb-component-selection-overlay hb-effect-selection-overlay";
    componentSelectionOverlayEl.dataset.selectionFor = component.id;
    Object.assign(componentSelectionOverlayEl.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform,
      pointerEvents: "none"
    });
    const selectionBoundsEl = document.createElement("div");
    selectionBoundsEl.className = "hb-selection-bounds hb-effect-selection-bounds";
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl.append(cornerMarkerEl1);
    }
    componentSelectionOverlayEl.append(selectionBoundsEl);
    host.parentElement.append(componentSelectionOverlayEl);
    this.componentSelectionOverlays.set(component.id, componentSelectionOverlayEl);
    this.updateTransformHandleScale(host, component, selectionBoundsEl);
  }
  syncComponentSelectionOverlay(componentId) {
    const element = this.componentSelectionOverlays.get(componentId);
    const state = this.componentHosts.get(componentId);
    if (!!element && !!state && !element.classList.contains("hb-airflow-selection-overlay") && !element.classList.contains("hb-effect-selection-overlay")) {
      Object.assign(element.style, {
        left: state.style.left,
        top: state.style.top,
        width: state.style.width,
        height: state.style.height,
        transform: state.style.transform
      });
    }
  }
  appendTransformHandles(host, component, selectionBoundsEl = true, element = host) {
    if (!host || !component) {
      return;
    }
    const selectionBoundsEl1 = document.createElement("div");
    selectionBoundsEl1.className = "hb-selection-bounds";
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl1.append(cornerMarkerEl1);
    }
    if (selectionBoundsEl && component.properties?.layoutMode !== "fill") {
      const transformHandleEl = document.createElement("button");
      transformHandleEl.type = "button";
      transformHandleEl.className = "hb-transform-handle hb-resize-handle";
      transformHandleEl.title = "拖动缩放";
      transformHandleEl.addEventListener("pointerdown", transformHandleEl2 => this.startComponentScale(transformHandleEl2, component, host, selectionBoundsEl1));
      const transformHandleEl1 = document.createElement("button");
      transformHandleEl1.type = "button";
      transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
      transformHandleEl1.title = "拖动旋转";
      transformHandleEl1.addEventListener("pointerdown", arg => this.startComponentRotate(arg, component, host, selectionBoundsEl1));
      selectionBoundsEl1.append(transformHandleEl, transformHandleEl1);
    }
    element.append(selectionBoundsEl1);
    if (component.type === "light-statistics" && element.classList?.contains("hb-light-statistics-selection-overlay")) {
      selectionBoundsEl1.addEventListener("pointerdown", arg => this.startComponentMove(arg, component, host, selectionBoundsEl1));
    }
    this.updateImageSelectionBounds(host, component, selectionBoundsEl1);
    this.updateTextSelectionBounds(host, component, selectionBoundsEl1);
    this.updateTitleButtonSelectionBounds(host, component, selectionBoundsEl1);
    this.updateDeviceButtonSelectionBounds(host, component, selectionBoundsEl1);
    const state = this.updateLightStatisticsSelectionBounds(host, component, selectionBoundsEl1);
    if (component.type === "light-statistics" && !state) {
      Object.assign(selectionBoundsEl1.style, {
        left: "0",
        top: "0",
        width: "100%",
        height: "100%"
      });
    }
    this.updateAirConditionerButtonSelectionBounds(host, component, selectionBoundsEl1);
    this.updateTransformHandleScale(host, component, selectionBoundsEl1);
  }
  withSelectionMeasurementHost(host, runHelper) {
    const state = [];
    let state1 = host;
    while (state1 && state1 !== this.canvas) {
      if (state1.hidden) {
        state.push(state1);
        state1.hidden = false;
      }
      state1 = state1.parentElement;
    }
    try {
      return runHelper();
    } finally {
      for (const item of state) {
        item.hidden = true;
      }
    }
  }
  selectionElementIsVisible(element) {
    if (!element || element.hidden) {
      return false;
    }
    const state = window.getComputedStyle?.(element);
    if (state?.display === "none" || state?.visibility === "hidden") {
      return false;
    } else {
      return Number(element.offsetWidth || element.getBoundingClientRect?.().width || 0) > 0 && Number(element.offsetHeight || element.getBoundingClientRect?.().height || 0) > 0;
    }
  }
  selectionElementBox(element, host) {
    let left = 0;
    let top = 0;
    let numeric = element;
    const allowed = new Set();
    while (numeric && numeric !== host && !allowed.has(numeric)) {
      allowed.add(numeric);
      left += Number(numeric.offsetLeft || 0);
      top += Number(numeric.offsetTop || 0);
      numeric = numeric.offsetParent || numeric.parentElement;
    }
    const size = element.getBoundingClientRect?.();
    const width = Number(element.offsetWidth || size?.width || 0);
    const height = Number(element.offsetHeight || size?.height || 0);
    return {
      left,
      top,
      width,
      height
    };
  }
  applyDoorWindowPerspective(element, corners, corners2) {
    const matchedEl = element?.querySelector(".hb-door-window-visual");
    if (!matchedEl || !corners) {
      return;
    }
    const count = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const count2 = Math.max(1, Number(corners.position?.width || 100) / count);
    const count3 = Math.max(1, Number(corners.position?.height || 100) / count);
    matchedEl.style.transform = doorWindowPerspectiveMatrix(count2, count3, corners2);
  }
  updateDoorWindowPerspectiveHandles(componentId, handleHost) {
    if (!componentId) {
      return;
    }
    const state = doorWindowPerspectiveCorners(handleHost);
    componentId.querySelector(".hb-door-window-perspective-guide polygon")?.setAttribute("points", [0, 1, 2, 3].map(arg => state[arg * 2] + "," + state[arg * 2 + 1]).join(" "));
    componentId.querySelectorAll(".hb-door-window-perspective-handle").forEach(arg => {
      const numeric = Number(arg.dataset.perspectiveCornerIndex || 0);
      arg.style.left = state[numeric * 2] * 100 + "%";
      arg.style.top = state[numeric * 2 + 1] * 100 + "%";
    });
  }
  appendDoorWindowPerspectiveHandles(host, component, handleLayer = host) {
    if (!host || !component || component.properties?.sensorKind !== "door-window") {
      return;
    }
    const selectionBoundsEl = doorWindowPerspectiveCorners(component.properties?.perspectiveCorners);
    const selectionBoundsEl1 = document.createElement("div");
    selectionBoundsEl1.className = "hb-selection-bounds hb-door-window-perspective-bounds";
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.classList.add("hb-door-window-perspective-guide");
    element.setAttribute("viewBox", "0 0 1 1");
    element.setAttribute("preserveAspectRatio", "none");
    element.append(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
    selectionBoundsEl1.append(element);
    const doorWindowPerspectiveHandleEl = ["左上角", "右上角", "右下角", "左下角"];
    for (let doorWindowPerspectiveHandleEl1 = 0; doorWindowPerspectiveHandleEl1 < 4; doorWindowPerspectiveHandleEl1 += 1) {
      const doorWindowPerspectiveHandleEl2 = document.createElement("button");
      doorWindowPerspectiveHandleEl2.type = "button";
      doorWindowPerspectiveHandleEl2.className = "hb-door-window-perspective-handle";
      doorWindowPerspectiveHandleEl2.dataset.perspectiveCornerIndex = String(doorWindowPerspectiveHandleEl1);
      doorWindowPerspectiveHandleEl2.title = "拖动" + doorWindowPerspectiveHandleEl[doorWindowPerspectiveHandleEl1] + "调整透视";
      doorWindowPerspectiveHandleEl2.setAttribute("aria-label", doorWindowPerspectiveHandleEl2.title);
      doorWindowPerspectiveHandleEl2.addEventListener("pointerdown", arg => this.startDoorWindowPerspective(arg, component, host, selectionBoundsEl1, doorWindowPerspectiveHandleEl1));
      selectionBoundsEl1.append(doorWindowPerspectiveHandleEl2);
    }
    handleLayer.append(selectionBoundsEl1);
    this.updateDoorWindowPerspectiveHandles(selectionBoundsEl1, selectionBoundsEl);
    this.updateTransformHandleScale(host, component, selectionBoundsEl1);
  }
  startDoorWindowPerspective(event, component, cornerIndex, event1, event2) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const state = doorWindowPerspectiveCorners(component.properties?.perspectiveCorners);
    const state1 = state[event2 * 2];
    const position = state[event2 * 2 + 1];
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const position1 = this.componentWorldTransform(component.id);
    const scale = position1.scale;
    const scale1 = position1.rotation * Math.PI / 180;
    const angle = Math.cos(scale1);
    const state2 = Math.sin(scale1);
    let perspectiveCorners = state;
    let event3 = false;
    const event4 = event5 => {
      if (event5.pointerId !== pointerId) {
        return;
      }
      const event6 = (event5.clientX - clientX) / Math.max(0.001, this.appliedScaleX || 1);
      const state4 = (event5.clientY - clientY) / Math.max(0.001, this.appliedScaleY || 1);
      const scale2 = (angle * event6 + state2 * state4) / scale;
      const scale3 = (-state2 * event6 + angle * state4) / scale;
      const scale4 = state.slice();
      scale4[event2 * 2] = state1 + scale2 / count;
      scale4[event2 * 2 + 1] = position + scale3 / count2;
      perspectiveCorners = doorWindowPerspectiveCorners(scale4);
      component.properties = {
        ...(component.properties || {}),
        perspectiveCorners
      };
      this.applyDoorWindowPerspective(cornerIndex, component, perspectiveCorners);
      this.updateDoorWindowPerspectiveHandles(event1, perspectiveCorners);
      this.options.onComponentPropertiesPreview?.(component.id, {
        perspectiveCorners
      });
    };
    const state3 = (event5 = null) => {
      if (!event3 && (event5?.pointerId == null || event5.pointerId === pointerId)) {
        event3 = true;
        window.removeEventListener("pointermove", event4, true);
        window.removeEventListener("pointerup", state3, true);
        window.removeEventListener("pointercancel", state3, true);
        window.removeEventListener("blur", state3);
        if (JSON.stringify(perspectiveCorners) !== JSON.stringify(state)) {
          this.options.onComponentProperties?.(component.id, {
            perspectiveCorners
          });
        }
      }
    };
    window.addEventListener("pointermove", event4, true);
    window.addEventListener("pointerup", state3, true);
    window.addEventListener("pointercancel", state3, true);
    window.addEventListener("blur", state3);
  }
  appendAirflowTransformHandles(host, component) {
    if (!host || !component) {
      return;
    }
    const selectionBoundsEl = this.createAirflowSelectionOverlay(host, component);
    if (!selectionBoundsEl) {
      return;
    }
    const selectionBoundsEl1 = document.createElement("div");
    selectionBoundsEl1.className = "hb-selection-bounds hb-airflow-selection-bounds";
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl1.append(cornerMarkerEl1);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动缩放出风效果";
    transformHandleEl.addEventListener("pointerdown", transformHandleEl2 => this.startAirflowScale(transformHandleEl2, component, host, selectionBoundsEl1, selectionBoundsEl));
    const transformHandleEl1 = document.createElement("button");
    transformHandleEl1.type = "button";
    transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
    transformHandleEl1.title = "拖动旋转出风效果";
    transformHandleEl1.addEventListener("pointerdown", arg => this.startAirflowRotate(arg, component, host, selectionBoundsEl1, selectionBoundsEl));
    selectionBoundsEl1.append(transformHandleEl, transformHandleEl1);
    selectionBoundsEl1.addEventListener("pointerdown", arg => this.startAirflowMove(arg, component, host, selectionBoundsEl1, selectionBoundsEl));
    selectionBoundsEl.append(selectionBoundsEl1);
    this.updateAirflowHandleScale(component, selectionBoundsEl1);
  }
  startAirflowMove(event, component, event1, event2, event3) {
    if (event.button !== 0 || event.target.closest(".hb-transform-handle")) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const clientX = event.clientX;
    const clientY = event.clientY;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const numeric2 = Number(component.properties?.airflowOffsetY ?? 34);
    const state = airflowCanvasOffsetBounds(component, this.document?.canvas);
    let airflowOffsetX = numeric;
    let airflowOffsetY = numeric2;
    let state1 = "";
    let event4 = false;
    const pointerId = event.pointerId;
    event2.setPointerCapture(pointerId);
    const event5 = event6 => {
      if (event6.pointerId !== pointerId) {
        return;
      }
      if (!event2.hasPointerCapture?.(pointerId) && event2.isConnected) {
        try {
          event2.setPointerCapture(pointerId);
        } catch {}
      }
      let event7 = event6.clientX - clientX;
      let amount = event6.clientY - clientY;
      if (event6.shiftKey) {
        if (!state1 && Math.hypot(event7, amount) >= 1) {
          state1 = Math.abs(event7) >= Math.abs(amount) ? "horizontal" : "vertical";
        }
        if (state1 === "horizontal") {
          amount = 0;
        }
        if (state1 === "vertical") {
          event7 = 0;
        }
      } else {
        state1 = "";
      }
      const state3 = event7 / Math.max(0.001, this.appliedScaleX || 1);
      const state4 = amount / Math.max(0.001, this.appliedScaleY || 1);
      const state5 = groupedComponentLocalDelta(state3, state4, this.componentParentTransform(component.id));
      airflowOffsetX = Math.max(state.minX, Math.min(state.maxX, numeric + state5.x / count * 100));
      airflowOffsetY = Math.max(state.minY, Math.min(state.maxY, numeric2 + state5.y / count2 * 100));
      component.properties = {
        ...(component.properties || {}),
        airflowOffsetX,
        airflowOffsetY
      };
      this.syncAirflowLayerGeometry(event1, component, event3);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowOffsetX,
        airflowOffsetY
      });
    };
    const state2 = (event6 = null) => {
      if (!event4 && (event6?.pointerId == null || event6.pointerId === pointerId)) {
        event4 = true;
        window.removeEventListener("pointermove", event5, true);
        window.removeEventListener("pointerup", state2, true);
        window.removeEventListener("pointercancel", state2, true);
        window.removeEventListener("blur", state2);
        if (airflowOffsetX !== numeric || airflowOffsetY !== numeric2) {
          this.options.onComponentProperties?.(component.id, {
            airflowOffsetX,
            airflowOffsetY
          });
        }
      }
    };
    window.addEventListener("pointermove", event5, true);
    window.addEventListener("pointerup", state2, true);
    window.addEventListener("pointercancel", state2, true);
    window.addEventListener("blur", state2);
  }
  updateAirflowHandleScale(component, element) {
    if (!component || !element) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(component.properties?.airflowScale || 1)));
    const scale = this.componentParentTransform(component.id).scale;
    const scale1 = 1 / Math.max(0.001, state * count * scale);
    element.style.setProperty("--hb-ui-scale", String(scale1));
    element.style.setProperty("--hb-handle-outset", scale1 * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  startAirflowScale(event, component, handle, element, pointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - size1));
    const count2 = Math.max(0.01, Math.min(5, Number(component.properties?.airflowScale || 1)));
    let airflowScale = count2;
    let state = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const runHelper = () => {
      this.syncAirflowLayerGeometry(handle, component, pointerEvent);
      this.updateAirflowHandleScale(component, element);
    };
    const clamped = event1 => {
      const event2 = Math.hypot(event1.clientX - size, event1.clientY - size1);
      airflowScale = Math.max(0.01, Math.min(5, count2 * event2 / count));
      component.properties = {
        ...(component.properties || {}),
        airflowScale
      };
      runHelper();
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowScale
      });
    };
    const state1 = () => {
      if (!state) {
        state = true;
        currentTarget.removeEventListener("pointermove", clamped);
        currentTarget.removeEventListener("pointerup", state1);
        currentTarget.removeEventListener("pointercancel", state1);
        currentTarget.removeEventListener("lostpointercapture", state1);
        if (airflowScale !== count2) {
          this.options.onComponentProperties?.(component.id, {
            airflowScale
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", clamped);
    currentTarget.addEventListener("pointerup", state1);
    currentTarget.addEventListener("pointercancel", state1);
    currentTarget.addEventListener("lostpointercapture", state1);
  }
  startAirflowRotate(event, component, pointerEvent, element, handleEl) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const event1 = domRect.top + domRect.height / 2;
    const size1 = Math.atan2(event.clientY - event1, event.clientX - size);
    const numeric = Number(component.properties?.airflowRotation || 0);
    let airflowRotation = numeric;
    let state = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const state1 = event2 => {
      const state3 = Math.atan2(event2.clientY - event1, event2.clientX - size);
      airflowRotation = numeric + (state3 - size1) * 180 / Math.PI;
      component.properties = {
        ...(component.properties || {}),
        airflowRotation
      };
      this.syncAirflowLayerGeometry(pointerEvent, component, handleEl);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowRotation
      });
    };
    const state2 = () => {
      if (!state) {
        state = true;
        currentTarget.removeEventListener("pointermove", state1);
        currentTarget.removeEventListener("pointerup", state2);
        currentTarget.removeEventListener("pointercancel", state2);
        currentTarget.removeEventListener("lostpointercapture", state2);
        if (airflowRotation !== numeric) {
          this.options.onComponentProperties?.(component.id, {
            airflowRotation
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", state1);
    currentTarget.addEventListener("pointerup", state2);
    currentTarget.addEventListener("pointercancel", state2);
    currentTarget.addEventListener("lostpointercapture", state2);
  }
  updateAirConditionerButtonSelectionBounds(componentId, component, selectionBounds) {
    if (!componentId || component?.type !== "air-conditioner" || !selectionBounds) {
      return;
    }
    const position = component.properties || {};
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const state = [];
    const clampNumber = (arg, second, selectionBounds, fourth) => {
      const numeric = Number(arg);
      return Math.max(second, Math.min(selectionBounds, Number.isFinite(numeric) ? numeric : fourth));
    };
    const runHelper = (arg, second, selectionBounds, fourth) => {
      state.push({
        left: arg - selectionBounds / 2,
        top: second - fourth / 2,
        right: arg + selectionBounds / 2,
        bottom: second + fourth / 2
      });
    };
    const runHelper1 = (arg, second, selectionBounds, element) => {
      const count4 = Math.max(element, Number(arg?.offsetWidth || 0) * count3);
      const count5 = Math.max(element, Number(arg?.offsetHeight || 0) * count3);
      const left = count * clampNumber(second, -100, 200, 0) / 100;
      const size1 = count2 * clampNumber(selectionBounds, -100, 200, 50) / 100;
      state.push({
        left,
        top: size1 - count5 / 2,
        right: left + count4,
        bottom: size1 + count5 / 2
      });
    };
    const state1 = count2 * clampNumber(position.badgeSize, 1, 100, 28) / 100;
    if (position.iconVisible !== false) {
      runHelper(count * clampNumber(position.iconLeft, -100, 200, 20) / 100, count2 * clampNumber(position.iconTop, -100, 200, 50) / 100, state1, state1);
    }
    if (position.mainTextVisible !== false) {
      runHelper1(componentId.querySelector(":scope > .hb-air-conditioner .hb-air-conditioner-text strong"), position.mainTextLeft, position.mainTextTop, count2 * clampNumber(position.mainSize, 6, 120, 21) / 100);
    }
    if (position.secondaryTextVisible !== false) {
      runHelper1(componentId.querySelector(":scope > .hb-air-conditioner .hb-air-conditioner-text small"), position.secondaryTextLeft, position.secondaryTextTop, count2 * clampNumber(position.secondarySize, 5, 80, 12) / 100);
    }
    if (!state.length) {
      Object.assign(selectionBounds.style, {
        left: "0px",
        top: "0px",
        width: count + "px",
        height: count2 + "px"
      });
      return;
    }
    const size = 4;
    const mapped = Math.min(...state.map(arg => arg.left)) - size;
    const mapped1 = Math.min(...state.map(arg => arg.top)) - size;
    const mapped2 = Math.max(...state.map(arg => arg.right)) + size;
    const mapped3 = Math.max(...state.map(arg => arg.bottom)) + size;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px"
    });
  }
  updateDeviceButtonSelectionBounds(componentId, component, selectionBounds) {
    if (!componentId || component?.type !== "device-button" || !selectionBounds) {
      return false;
    }
    const state = component.properties || {};
    const position = state.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const state1 = [];
    const clampNumber = (arg, second, selectionBounds, fourth) => {
      const numeric = Number(arg);
      return Math.max(second, Math.min(selectionBounds, Number.isFinite(numeric) ? numeric : fourth));
    };
    const runHelper = (arg, top, selectionBounds, height) => {
      if (!![arg, top, selectionBounds, height].every(Number.isFinite) && !(selectionBounds <= 0) && !(height <= 0)) {
        state1.push({
          left: arg - selectionBounds / 2,
          top: top - height / 2,
          right: arg + selectionBounds / 2,
          bottom: top + height / 2
        });
      }
    };
    const runHelper1 = (arg, second, selectionBounds, element) => {
      const count4 = Math.max(element, Number(arg?.offsetWidth || 0) * count3);
      const count5 = Math.max(element, Number(arg?.offsetHeight || 0) * count3);
      const left = count * clampNumber(second, -100, 200, 0) / 100;
      const size1 = count2 * clampNumber(selectionBounds, -100, 200, 50) / 100;
      state1.push({
        left,
        top: size1 - count5 / 2,
        right: left + count4,
        bottom: size1 + count5 / 2
      });
    };
    const state2 = count2 * clampNumber(state.badgeSize ?? state.iconSize, 1, 100, 28) / 100;
    if (state.iconVisible !== false || position) {
      runHelper(count * clampNumber(state.iconLeft, -100, 200, 20) / 100, count2 * clampNumber(state.iconTop, -100, 200, 50) / 100, state2, state2);
    }
    if (state.mainTextVisible !== false || position) {
      runHelper1(componentId.querySelector(":scope > .hb-icon-button .hb-icon-button-text strong"), state.mainTextLeft, state.mainTextTop, count2 * clampNumber(state.mainSize, 6, 120, 21) / 100);
    }
    if (state.secondaryTextVisible !== false || position) {
      runHelper1(componentId.querySelector(":scope > .hb-icon-button .hb-icon-button-text small"), state.secondaryTextLeft, state.secondaryTextTop, count2 * clampNumber(state.secondarySize, 5, 80, 12) / 100);
    }
    if (!state1.length) {
      return false;
    }
    const size = 4;
    const mapped = Math.min(...state1.map(arg => arg.left)) - size;
    const mapped1 = Math.min(...state1.map(arg => arg.top)) - size;
    const mapped2 = Math.max(...state1.map(arg => arg.right)) + size;
    const mapped3 = Math.max(...state1.map(arg => arg.bottom)) + size;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px"
    });
    return true;
  }
  updateTitleButtonSelectionBounds(componentId, component, selectionBounds) {
    if (!componentId || component?.type !== "title-button" || !selectionBounds) {
      return false;
    }
    const state = component.properties || {};
    const position = state.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const size = [];
    const runHelper = (left, top, selectionBounds, height) => {
      if (!![left, top, selectionBounds, height].every(Number.isFinite) && !(selectionBounds <= 0) && !(height <= 0)) {
        size.push({
          left,
          top,
          right: left + selectionBounds,
          bottom: top + height
        });
      }
    };
    const clampNumber = (arg, second, selectionBounds, fourth) => {
      const numeric = Number(arg);
      return Math.max(second, Math.min(selectionBounds, Number.isFinite(numeric) ? numeric : fourth));
    };
    if (state.frameVisible !== false || position) {
      const state1 = clampNumber(state.frameSize, 10, 300, 100) / 100;
      const state2 = count2 * 0.45 * state1;
      const state3 = count / 2 + count * clampNumber(state.frameOffsetX, -100, 100, 0) / 100;
      const state4 = count2 / 2 + count2 * clampNumber(state.frameOffsetY, -100, 100, 0) / 100;
      const state5 = count * clampNumber(state.frameSpacing, 0, 300, 100) / 200;
      const state6 = count2 * 0.12;
      const state7 = clampNumber(state.frameWidth, 0, 12, 1.5);
      runHelper(state3 - state5 - state7 / 2, state4 - state2 / 2 - state7 / 2, state6 + state7, state2 + state7);
      runHelper(state3 + state5 - state6 - state7 / 2, state4 - state2 / 2 - state7 / 2, state6 + state7, state2 + state7);
    }
    if (state.mainTextVisible !== false || position) {
      const element = componentId.querySelector(":scope > .hb-title-button .hb-title-button-main");
      const state1 = count2 * clampNumber(state.mainSize, 8, 200, 34) / 100;
      runHelper(count * clampNumber(state.mainTextLeft, -100, 200, 5.5) / 100, count2 * clampNumber(state.mainTextTop, -100, 200, 45) / 100 - state1 / 2, Math.max(state1, Number(element?.offsetWidth || 0) * count3), Math.max(state1, Number(element?.offsetHeight || 0) * count3));
    }
    if (state.secondaryTextVisible !== false || position) {
      const element = componentId.querySelector(":scope > .hb-title-button .hb-title-button-secondary");
      const state1 = count2 * clampNumber(state.secondarySize, 6, 100, 12) / 100;
      const count4 = Math.max(state1, Number(element?.offsetHeight || 0) * count3);
      runHelper(count * clampNumber(state.secondaryTextLeft, -100, 200, 54) / 100, count2 * clampNumber(state.secondaryTextTop, -100, 200, 43) / 100 - count4 / 2, Math.max(state1, Number(element?.offsetWidth || 0) * count3), count4);
    }
    if ((state.iconVisible !== false || position) && state.icon) {
      const state1 = count2 * clampNumber(state.iconSize, 1, 100, 30) / 100;
      runHelper(count * clampNumber(state.iconLeft, -100, 200, 50) / 100 - state1 / 2, count2 * clampNumber(state.iconTop, -100, 200, 45) / 100 - state1 / 2, state1, state1);
    }
    if (state.markerVisible !== false || position) {
      const state1 = count2 * clampNumber(state.markerSize, 2, 60, 10) / 100;
      const state2 = count * clampNumber(state.markerLeft, -100, 200, 1.8) / 100;
      const state3 = count2 * clampNumber(state.markerTop, -100, 200, 84) / 100;
      runHelper(state2 - state1 * 0.58, state3, state1 * 1.16, state1);
    }
    if (!size.length) {
      return false;
    }
    const size1 = 4;
    const mapped = Math.min(...size.map(arg => arg.left)) - size1;
    const mapped1 = Math.min(...size.map(arg => arg.top)) - size1;
    const mapped2 = Math.max(...size.map(arg => arg.right)) + size1;
    const mapped3 = Math.max(...size.map(arg => arg.bottom)) + size1;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px"
    });
    return true;
  }
  updateLightStatisticsSelectionBounds(componentId, hostEl, selectionBounds) {
    if (!componentId || hostEl?.type !== "light-statistics" || !selectionBounds || componentId.hidden) {
      return false;
    }
    const element = componentId.querySelector(":scope > .hb-light-statistics");
    if (!element) {
      return false;
    }
    const filtered = [...element.children].filter(arg => arg.hidden || Number(arg.offsetWidth || 0) <= 0 || Number(arg.offsetHeight || 0) <= 0 ? false : window.getComputedStyle?.(arg).display !== "none");
    if (!filtered.length) {
      return false;
    }
    const count = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const state = 4;
    const mapped = (Math.min(...filtered.map(arg => arg.offsetLeft)) - state) * count;
    const mapped1 = (Math.min(...filtered.map(arg => arg.offsetTop)) - state) * count;
    const mapped2 = (Math.max(...filtered.map(arg => arg.offsetLeft + arg.offsetWidth)) + state) * count;
    const mapped3 = (Math.max(...filtered.map(arg => arg.offsetTop + arg.offsetHeight)) + state) * count;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px"
    });
    return true;
  }
  updateTextSelectionBounds(componentId, hostEl, selectionBounds) {
    if (!componentId || !["time", "date", "weather"].includes(hostEl?.type) || !selectionBounds) {
      return false;
    } else {
      return this.withSelectionMeasurementHost(componentId, () => {
        const element = componentId.querySelector(":scope > .hb-time-component, :scope > .hb-date-component, :scope > .hb-weather-component");
        if (!element) {
          return false;
        }
        const matchedEl = (hostEl.type === "time" ? [...element.querySelectorAll(":scope > .hb-time-value, :scope > .hb-time-period")] : hostEl.type === "date" ? [...element.querySelectorAll(":scope > .hb-date-primary, :scope > .hb-date-lunar")] : [...element.querySelectorAll(":scope > .hb-weather-icon, :scope > .hb-weather-content > strong, :scope > .hb-weather-content > small")]).filter(arg => this.selectionElementIsVisible(arg));
        const count = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
        const count2 = Math.max(1, Number(hostEl.position?.width || 100));
        const count3 = Math.max(1, Number(hostEl.position?.height || 100));
        if (!matchedEl.length) {
          const clamped = Math.min(32, Math.max(20, Math.min(count2, count3) * 0.2));
          Object.assign(selectionBounds.style, {
            left: (count2 - clamped) / 2 + "px",
            top: (count3 - clamped) / 2 + "px",
            width: clamped + "px",
            height: clamped + "px"
          });
          return false;
        }
        const mapped = matchedEl.map(arg => this.selectionElementBox(arg, componentId));
        const size = 3;
        const mapped1 = (Math.min(...mapped.map(arg => arg.left)) - size) * count;
        const mapped2 = (Math.min(...mapped.map(arg => arg.top)) - size) * count;
        const mapped3 = (Math.max(...mapped.map(arg => arg.left + arg.width)) + size) * count;
        const mapped4 = (Math.max(...mapped.map(arg => arg.top + arg.height)) + size) * count;
        Object.assign(selectionBounds.style, {
          left: mapped1 + "px",
          top: mapped2 + "px",
          width: Math.max(1, mapped3 - mapped1) + "px",
          height: Math.max(1, mapped4 - mapped2) + "px"
        });
        return true;
      });
    }
  }
  async updateImageSelectionBounds(componentId, hostEl, selectionBounds) {
    const element = componentId.querySelector(":scope > .hb-image-component");
    if (!element || ((!element.complete || !element.naturalWidth) && (await new Promise(arg => {
      element.addEventListener("load", arg, {
        once: true
      });
      element.addEventListener("error", arg, {
        once: true
      });
    })), !componentId.isConnected || !selectionBounds.isConnected || !element.naturalWidth || !element.naturalHeight)) {
      return;
    }
    const numeric = Number(hostEl.position?.width || 100);
    const numeric2 = Number(hostEl.position?.height || 100);
    const position = element.naturalWidth / element.naturalHeight;
    const state = numeric / numeric2;
    const state1 = position >= state ? numeric : numeric2 * position;
    const state2 = position >= state ? numeric / position : numeric2;
    const size = (numeric - state1) / 2;
    const size1 = (numeric2 - state2) / 2;
    Object.assign(selectionBounds.style, {
      left: size / numeric * 100 + "%",
      top: size1 / numeric2 * 100 + "%",
      width: state1 / numeric * 100 + "%",
      height: state2 / numeric2 * 100 + "%"
    });
  }
  updateTransformHandleScale(componentId, handleRoot, scaleOverride = null) {
    if (!componentId || !handleRoot) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(handleRoot.style?.scale || 1)));
    const scale = this.componentParentTransform(handleRoot.id).scale;
    const scale1 = 1 / Math.max(0.001, state * count * scale);
    const element = scaleOverride || this.componentSelectionOverlays.get(handleRoot.id)?.querySelector(":scope > .hb-selection-bounds") || componentId.querySelector(":scope > .hb-selection-bounds");
    if (!element) {
      return;
    }
    element.style.setProperty("--hb-ui-scale", String(scale1));
    element.style.setProperty("--hb-handle-outset", scale1 * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  startComponentScale(event, componentId, element, element2) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - size1));
    const count2 = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    let scale = count2;
    let event1 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event2 = event3 => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      const event4 = Math.hypot(event3.clientX - size, event3.clientY - size1);
      scale = Math.max(0.01, Math.min(5, count2 * event4 / count));
      componentId.style = {
        ...(componentId.style || {}),
        scale
      };
      element.style.transform = "rotate(" + Number(componentId.position?.rotation || 0) + "deg) scale(" + scale + ")";
      const scale2 = this.componentSelectionOverlays.get(componentId.id);
      if (scale2) {
        scale2.style.transform = element.style.transform;
      }
      this.updateTransformHandleScale(element, componentId, element2);
      this.options.onComponentTransformPreview?.(componentId.id, {
        scale
      });
    };
    const scale1 = (event3 = null) => {
      if (!event1 && (event3?.pointerId == null || event3.pointerId === pointerId)) {
        event1 = true;
        window.removeEventListener("pointermove", event2, true);
        window.removeEventListener("pointerup", scale1, true);
        window.removeEventListener("pointercancel", scale1, true);
        window.removeEventListener("blur", scale1);
        componentId.style = {
          ...(componentId.style || {}),
          scale
        };
        if (scale !== count2) {
          this.options.onComponentTransform?.(componentId.id, {
            scale
          });
        }
      }
    };
    window.addEventListener("pointermove", event2, true);
    window.addEventListener("pointerup", scale1, true);
    window.addEventListener("pointercancel", scale1, true);
    window.addEventListener("blur", scale1);
  }
  startComponentRotate(event, componentId, element, element2) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const event1 = domRect.top + domRect.height / 2;
    const position = Math.atan2(event.clientY - event1, event.clientX - size);
    const numeric = Number(componentId.position?.rotation || 0);
    let rotation = numeric;
    let event2 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event3 = event4 => {
      if (event4.pointerId !== pointerId) {
        return;
      }
      const angle1 = Math.atan2(event4.clientY - event1, event4.clientX - size);
      rotation = numeric + (angle1 - position) * 180 / Math.PI;
      element.style.transform = "rotate(" + rotation + "deg) scale(" + Number(componentId.style?.scale || 1) + ")";
      const scale = this.componentSelectionOverlays.get(componentId.id);
      if (scale) {
        scale.style.transform = element.style.transform;
      }
      this.options.onComponentTransformPreview?.(componentId.id, {
        rotation
      });
    };
    const angle = (event4 = null) => {
      if (!event2 && (event4?.pointerId == null || event4.pointerId === pointerId)) {
        event2 = true;
        window.removeEventListener("pointermove", event3, true);
        window.removeEventListener("pointerup", angle, true);
        window.removeEventListener("pointercancel", angle, true);
        window.removeEventListener("blur", angle);
        componentId.position = {
          ...(componentId.position || {}),
          rotation
        };
        if (rotation !== numeric) {
          this.options.onComponentTransform?.(componentId.id, {
            rotation
          });
        }
      }
    };
    window.addEventListener("pointermove", event3, true);
    window.addEventListener("pointerup", angle, true);
    window.addEventListener("pointercancel", angle, true);
    window.addEventListener("blur", angle);
  }
  bindRuntimeActions(host, component) {
    let state = null;
    let state1 = null;
    let bindRuntimeActionsValue = null;
    let bindRuntimeActionsValue1 = false;
    let event = null;
    let event1 = null;
    let state2 = 0;
    let state3 = null;
    let state4;
    const state5 = isComponentActionSupported(component, component.actions?.tap) ? component.actions.tap : null;
    const state6 = isComponentActionSupported(component, component.actions?.doubleTap) ? component.actions.doubleTap : null;
    const state7 = isComponentActionSupported(component, component.actions?.hold) ? component.actions.hold : null;
    const state8 = !!state5?.type && state5.type !== "none";
    const state9 = !!state6?.type && state6.type !== "none";
    const state10 = !!state7?.type && state7.type !== "none";
    const runHelper = () => {
      this.options.onRuntimeButtonPress?.(host);
    };
    const runHelper1 = () => {
      if (state3 || state5?.type !== "toggle") {
        return;
      }
      const entityId = component.bindings?.entity?.entityId;
      if (entityId && !isVirtualEntityId(entityId)) {
        state4 = this.states.get(this.powerEntityId(component, entityId));
        state3 = this.applyOptimisticToggle(entityId, component);
      }
    };
    const runHelper2 = () => {
      state3?.();
      state3 = null;
      state4 = undefined;
    };
    const runHelper3 = () => {
      const optimisticRollback = state3;
      const optimisticPreviousState = state4;
      state3 = null;
      state4 = undefined;
      if (state8) {
        this.runAction(component, state5, {
          optimisticAlreadyApplied: !!optimisticRollback,
          optimisticRollback,
          optimisticPreviousState
        });
      }
    };
    host.style.touchAction = "manipulation";
    host.addEventListener("contextmenu", event => event.preventDefault());
    host.addEventListener("selectstart", event => event.preventDefault());
    host.addEventListener("dragstart", event => event.preventDefault());
    host.addEventListener("pointerdown", event2 => {
      bindRuntimeActionsValue1 = false;
      event = {
        pointerId: event2.pointerId,
        pointerType: event2.pointerType || "mouse",
        x: event2.clientX,
        y: event2.clientY,
        moved: false
      };
      if (state10) {
        bindRuntimeActionsValue = window.setTimeout(() => {
          bindRuntimeActionsValue1 = true;
          event1 = null;
          window.clearTimeout(state1);
          runHelper();
          this.runAction(component, state7);
        }, 400);
      }
    });
    const scheduleTimeout = () => window.clearTimeout(bindRuntimeActionsValue);
    host.addEventListener("pointermove", event2 => {
      if (!!event && event.pointerId === event2.pointerId && !(Math.hypot(event2.clientX - event.x, event2.clientY - event.y) <= 18)) {
        event.moved = true;
        scheduleTimeout();
      }
    });
    host.addEventListener("pointerup", event => {
      scheduleTimeout();
      const event2 = event?.pointerId === event.pointerId ? event : null;
      event = null;
      if (!event2 || event2.pointerType === "mouse" || event2.moved || bindRuntimeActionsValue1) {
        return;
      }
      event.preventDefault();
      state2 = performance.now() + 700;
      if (state8 || state9) {
        runHelper();
      }
      const time = performance.now();
      if (state9 && event1 && time - event1.time <= 180 && Math.hypot(event.clientX - event1.x, event.clientY - event1.y) <= 34) {
        window.clearTimeout(state1);
        runHelper2();
        event1 = null;
        this.runAction(component, state6);
        return;
      }
      event1 = {
        time,
        x: event.clientX,
        y: event.clientY
      };
      if (state9) {
        runHelper1();
        window.clearTimeout(state1);
        state1 = window.setTimeout(() => {
          runHelper3();
          event1 = null;
        }, 180);
      } else {
        if (state8) {
          this.runAction(component, state5);
        }
        event1 = null;
      }
    });
    host.addEventListener("pointercancel", () => {
      scheduleTimeout();
      event = null;
    });
    host.addEventListener("click", () => {
      if (!(performance.now() < state2) && !bindRuntimeActionsValue1) {
        if (state8 || state9) {
          runHelper();
        }
        if (state9) {
          runHelper1();
          window.clearTimeout(state);
          state = window.setTimeout(() => {
            runHelper3();
          }, 180);
        } else if (state8) {
          this.runAction(component, state5);
        }
      }
    });
    host.addEventListener("dblclick", () => {
      window.clearTimeout(state);
      runHelper2();
      if (state9) {
        this.runAction(component, state6);
      }
    });
    this.cleanups.push(() => {
      window.clearTimeout(state);
      window.clearTimeout(state1);
      window.clearTimeout(bindRuntimeActionsValue);
      runHelper2();
    });
  }
  runAction(component, component1, actionOptions = {}) {
    if (!!component1?.type && component1.type !== "none") {
      this.dispatchAction(component, component1, actionOptions).catch(arg => {
        window.HABridgeLog?.error(arg, {
          componentId: component.id,
          entityId: component.bindings?.entity?.entityId || "",
          phase: "component-action"
        });
        this.options.onError?.(arg);
      });
    }
  }
  previewAction(action, component) {
    if (component?.type === "more-info") {
      this.showActionPopup(action, component, {
        preview: true
      });
    }
  }
  popupComponentForEntity(entityId1, preferredType = "") {
    let entityId = String(entityId1 || "");
    let entityId2 = entityId.split(".")[0];
    const state = this.deviceProfile(entityId);
    if (state?.deviceType === "air-purifier" && state.roles?.fan && entityId2 !== "fan") {
      entityId = state.roles.fan;
      entityId2 = "fan";
    }
    const state1 = state?.roles?.climate || state?.roles?.fan || "";
    if (["air-conditioner", "bath-heater"].includes(state?.deviceType) && state1 && !["climate", "light"].includes(entityId2)) {
      entityId = state1;
      entityId2 = entityId.split(".")[0];
    }
    const state2 = this.entityMetadata.get(entityId);
    if (entityId2 === "sensor" && state2?.deviceId && ["state", "status", "task_status"].includes(state2.translationKey)) {
      const found = [...this.entityMetadata.values()].find(arg => arg.deviceId === state2.deviceId && arg.domain === "vacuum" && entityMetadataIsAvailable(arg));
      if (found?.entityId) {
        entityId = found.entityId;
        entityId2 = "vacuum";
      }
    }
    const type = state?.deviceType === "electric-bed" ? "electric-bed" : state?.deviceType === "air-purifier" && entityId2 === "fan" ? "air-purifier" : ["air-conditioner", "bath-heater"].includes(state?.deviceType) && ["climate", "fan"].includes(entityId2) || entityId2 === "climate" ? "air-conditioner" : entityId2 === "water_heater" ? "water-heater" : entityId2 === "camera" ? "camera" : entityId2 === "media_player" ? "media-player" : ["fan", "select", "number", "input_number"].includes(entityId2) ? "device-button" : ["light", "switch", "input_boolean"].includes(entityId2) ? "icon-button" : entityId2 === "sensor" ? "line-chart" : entityId2 === "vacuum" ? "vacuum-control" : "device-button";
    return {
      id: "popup-" + entityId,
      type,
      bindings: {
        entity: {
          entityId
        }
      },
      properties: {
        label: preferredType || "",
        ...(["air-conditioner", "bath-heater"].includes(state?.deviceType) ? {
          deviceType: state.deviceType
        } : {}),
        ...(state?.deviceType === "air-purifier" ? {
          deviceType: "air-purifier"
        } : {}),
        ...(state?.deviceType === "electric-bed" ? {
          deviceType: "electric-bed"
        } : {}),
        ...(state?.coverKind ? {
          coverKind: state.coverKind
        } : {})
      },
      actions: {}
    };
  }
  showActionPopup(component, component1, {
    preview = false
  } = {}) {
    const state = component1?.data?.popupSource || "current";
    if (state === "custom") {
      const found = (this.document?.customPopups || []).find(arg => arg.id === component1.data?.popupId);
      if (!found) {
        throw new Error("选择的组合弹窗不存在。");
      }
      this.showCustomPopup(found, {
        preview
      });
      return;
    }
    const entityId = component?.bindings?.entity?.entityId;
    const asString = String(entityId || "").split(".", 1)[0] === "cover" || ["camera", "line-chart", "air-conditioner", "icon-button"].includes(component?.type);
    let component2 = state === "entity" ? this.popupComponentForEntity(component1.data?.entityId, componentDialogTitle(component, component1.data?.title || component1.data?.entityId)) : asString ? component : this.popupComponentForEntity(entityId, componentDialogTitle(component, ""));
    if (state !== "entity" && component2 !== component && component?.properties?.relatedEntities) {
      component2 = {
        ...component2,
        properties: {
          ...(component2.properties || {}),
          relatedEntities: structuredClone(component.properties.relatedEntities)
        }
      };
    }
    if (!component2?.bindings?.entity?.entityId) {
      throw new Error("该弹窗没有可用实体。");
    }
    if (component2.type === "camera") {
      this.showCameraPreview(component2, {
        preview
      });
    } else {
      this.showEntityDetails(component2, {
        preview
      });
    }
  }
  async dispatchAction(component, component1, {
    optimisticAlreadyApplied = false,
    optimisticRollback = null,
    optimisticPreviousState
  } = {}) {
    if (component1.type === "toggle") {
      const entityId = component.bindings?.entity?.entityId;
      if (!entityId) {
        throw new Error("该控件没有关联实体。");
      }
      if (isVirtualEntityId(entityId)) {
        this.toggleVirtualEntity(entityId);
        return;
      }
      const state = typeof this.powerEntityId == "function" ? this.powerEntityId(component, entityId) : entityId;
      const state1 = state.split(".", 1)[0];
      if (["button", "script"].includes(state1)) {
        const state3 = entityToggleCommand(state, this.states.get(state), component);
        await this.callEntityService(state3.domain, state3.service, state, state3.data);
        return;
      }
      const state2 = optimisticAlreadyApplied ? optimisticPreviousState : this.states.get(state);
      const runHelper = optimisticAlreadyApplied ? optimisticRollback || (() => {}) : this.applyOptimisticToggle(state, component);
      try {
        if (state1 === "cover") {
          const index = new Map(this.states);
          if (state2 === undefined) {
            index.delete(state);
          } else {
            index.set(state, state2);
          }
          await this.callEntityService("cover", coverToggleServiceForComponent(component, this.entityMetadata, index, state), state);
        } else if (["climate", "fan", "water_heater", "media_player"].includes(state1)) {
          const state3 = typeof this.runtimePowerComponent == "function" ? this.runtimePowerComponent(component, entityId) : component;
          const state4 = entityToggleCommand(state, state2, state3);
          await this.callEntityService(state4.domain, state4.service, state, state4.data);
        } else {
          await this.callEntityService("homeassistant", "toggle", state);
        }
      } catch (error) {
        runHelper();
        throw error;
      }
      return;
    }
    if (component1.type === "more-info") {
      this.showActionPopup(component, component1);
      return;
    }
    if (component1.type === "navigate") {
      if (!component1.target || !this.document?.pages?.some(event => event.path === component1.target)) {
        throw new Error("跳转的页面不存在。");
      }
      this.navigate(component1.target);
    }
  }
  async callEntityService(domain, service, entityId, data = {}) {
    const response = await fetch("/api/v1/ha/services/call", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        domain,
        service,
        entityId,
        data
      }),
      hbLogContext: {
        entityId,
        service: domain + "." + service,
        phase: "device-control"
      }
    });
    if (!response.ok) {
      const state = await response.json().catch(() => ({}));
      const state1 = new Error(typeof state.detail == "string" ? state.detail : state.detail?.message || "实体操作失败。");
      throw window.HABridgeLog?.linkError(state1, response) || state1;
    }
  }
  async browseMedia(entityId, mediaContentId = "media-source://", mediaContentType = "") {
    const response = await fetch("/api/v1/ha/media/browse", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        entityId,
        mediaContentId,
        mediaContentType
      })
    });
    const mediaBrowserEl = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(mediaBrowserEl.detail || "媒体目录读取失败。");
    }
    return mediaBrowserEl.result || {};
  }
  createMediaBrowserControl(entityId, {
    preview = false
  } = {}) {
    const root = document.createElement("section");
    root.className = "hb-media-browser";
    const element = document.createElement("button");
    element.type = "button";
    element.className = "hb-media-browser-trigger";
    element.innerHTML = "<span aria-hidden=\"true\"></span>";
    element.setAttribute("aria-label", "选择本地媒体");
    element.setAttribute("title", "选择本地媒体");
    element.setAttribute("aria-expanded", "false");
    element.disabled = preview;
    const panel = document.createElement("div");
    panel.className = "hb-media-browser-panel";
    panel.hidden = true;
    const mediaBrowserToolbarEl = document.createElement("div");
    mediaBrowserToolbarEl.className = "hb-media-browser-toolbar";
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.className = "hb-media-browser-back";
    element2.textContent = "返回";
    element2.hidden = true;
    const element3 = document.createElement("strong");
    element3.className = "hb-media-browser-location";
    element3.textContent = "媒体库";
    const element4 = document.createElement("span");
    element4.className = "hb-media-browser-status";
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.className = "hb-media-browser-close";
    element5.textContent = "×";
    element5.setAttribute("aria-label", "关闭媒体选择");
    mediaBrowserToolbarEl.append(element2, element3, element4, element5);
    const mediaBrowserListEl = document.createElement("div");
    mediaBrowserListEl.className = "hb-media-browser-list";
    panel.append(mediaBrowserToolbarEl, mediaBrowserListEl);
    root.append(element);
    let id = "media-source://";
    let type = "";
    let state = [];
    let state1 = false;
    let state2 = false;
    const runHelper = (arg = "") => {
      element4.textContent = arg;
    };
    const syncAriaState = () => {
      panel.hidden = true;
      element.setAttribute("aria-expanded", "false");
    };
    const queryChildElement = arg => {
      state1 = !!arg;
      element.disabled = preview || state1 || !state2;
      element2.disabled = state1;
      mediaBrowserListEl.querySelectorAll("button").forEach(buttonEl => {
        buttonEl.disabled = state1;
      });
    };
    const runHelper1 = arg => String(arg?.title || arg?.name || arg?.media_content_id || "未命名媒体");
    const runHelper2 = async (arg, labelText = "", {
      pushHistory = true
    } = {}) => {
      if (!state1 && !preview && !!state2) {
        queryChildElement(true);
        runHelper("读取中…");
        try {
          const state3 = await this.browseMedia(entityId, arg, labelText);
          if (pushHistory && id !== arg) {
            state.push({
              id,
              type,
              title: element3.textContent
            });
          }
          id = arg;
          type = labelText || "";
          element3.textContent = runHelper1(state3) || "媒体库";
          element2.hidden = state.length === 0;
          mediaBrowserListEl.replaceChildren();
          const list = Array.isArray(state3?.children) ? state3.children : [];
          if (!list.length) {
            const element6 = document.createElement("p");
            element6.className = "hb-media-browser-empty";
            element6.textContent = "此处没有可播放的媒体。";
            mediaBrowserListEl.append(element6);
          }
          list.forEach(mediaBrowserItemEl => {
            const mediaBrowserItemEl1 = document.createElement("div");
            mediaBrowserItemEl1.className = "hb-media-browser-item";
            const element6 = document.createElement("span");
            element6.className = "hb-media-browser-item-title";
            element6.textContent = runHelper1(mediaBrowserItemEl);
            const element7 = document.createElement("button");
            element7.type = "button";
            const state4 = !!mediaBrowserItemEl?.can_expand || !!mediaBrowserItemEl?.children;
            const state5 = !!mediaBrowserItemEl?.can_play;
            element7.textContent = state4 ? "打开" : "播放";
            element7.disabled = !state4 && !state5;
            element7.addEventListener("click", async () => {
              if (state4) {
                await runHelper2(mediaBrowserItemEl.media_content_id, mediaBrowserItemEl.media_content_type || "", {
                  pushHistory: true
                });
                return;
              }
              if (!!state5 && !state1) {
                queryChildElement(true);
                runHelper("发送播放…");
                try {
                  await this.callEntityService("media_player", "play_media", entityId, {
                    media_content_id: mediaBrowserItemEl.media_content_id,
                    media_content_type: mediaBrowserItemEl.media_content_type || "music"
                  });
                  runHelper("已发送播放");
                } catch (error) {
                  runHelper(error.message || "播放失败");
                  this.options.onError?.(error);
                } finally {
                  queryChildElement(false);
                }
              }
            });
            mediaBrowserItemEl1.append(element6, element7);
            mediaBrowserListEl.append(mediaBrowserItemEl1);
          });
          panel.hidden = false;
          element.setAttribute("aria-expanded", "true");
          runHelper(list.length ? list.length + " 项" : "");
        } catch (error) {
          const text = String(error?.message || "媒体目录读取失败");
          runHelper(text.includes("Media directory does not exist") ? "此目录暂无媒体" : text);
          mediaBrowserListEl.replaceChildren();
          const element6 = document.createElement("p");
          element6.className = "hb-media-browser-empty";
          element6.textContent = text.includes("Media directory does not exist") ? "此目录暂无可用媒体。" : text;
          mediaBrowserListEl.append(element6);
          panel.hidden = false;
          element.setAttribute("aria-expanded", "true");
        } finally {
          queryChildElement(false);
        }
      }
    };
    element.addEventListener("click", () => {
      if (!panel.hidden) {
        syncAriaState();
        return;
      }
      runHelper2(id, type, {
        pushHistory: false
      });
    });
    element5.addEventListener("click", syncAriaState);
    element2.addEventListener("click", async () => {
      const state3 = state.pop();
      if (state3) {
        await runHelper2(state3.id, state3.type, {
          pushHistory: false
        });
        element3.textContent = state3.title || "媒体库";
        element2.hidden = state.length === 0;
      }
    });
    return {
      root,
      panel,
      sync: sync => {
        state2 = !!(Number(sync?.attributes?.supported_features || 0) & 512);
        root.hidden = !state2;
        if (!state2) {
          syncAriaState();
        }
        element.disabled = preview || state1 || !state2;
      },
      cleanup: () => {
        root.remove();
        panel.remove();
      }
    };
  }
  registerRuntimeDialogScale(dialogLayer, dialog, designWidth, designHeight) {
    const state = runtimeDialogUsesStableMotion();
    dialogLayer.classList.toggle("hb-runtime-stable-motion", state);
    dialogLayer.classList.toggle("hb-runtime-simplified-motion", state && dialog.classList.contains("hb-custom-popup-dialog"));
    const runtimeDialogScaleContext = {
      dialogLayer,
      dialog,
      designWidth: Math.max(1, Number(designWidth) || 1),
      designHeight: Math.max(1, Number(designHeight) || 1),
      fillAvailable: dialog.dataset.runtimeDialogLayout === "fill" || dialog.classList.contains("media-player-details"),
      tightFill: dialog.classList.contains("media-player-details"),
      targetOccupancy: dialog.dataset.runtimeDialogLayout === "compact" ? COMPACT_TARGET_OCCUPANCY : DEFAULT_TARGET_OCCUPANCY,
      measureFrame: 0,
      layoutObserver: null,
      entranceAnimations: []
    };
    this.runtimeDialogScaleContext = runtimeDialogScaleContext;
    dialog.classList.add("hb-runtime-scaled-dialog");
    dialog.style.width = runtimeDialogScaleContext.designWidth + "px";
    dialog.style.minWidth = runtimeDialogScaleContext.designWidth + "px";
    dialog.style.maxWidth = "none";
    dialog.style.height = "auto";
    dialog.style.minHeight = "0";
    dialog.style.maxHeight = "none";
    dialog.style.boxSizing = "border-box";
    dialog.style.setProperty("--hb-runtime-dialog-design-height", runtimeDialogScaleContext.designHeight + "px");
    const element = dialog.querySelector(":scope > .hb-custom-popup-card");
    if (element) {
      element.style.width = runtimeDialogScaleContext.designWidth + "px";
      element.style.minWidth = runtimeDialogScaleContext.designWidth + "px";
      element.style.maxWidth = "none";
    }
    this.updateRuntimeDialogScale();
    runtimeDialogScaleContext.measureFrame = window.requestAnimationFrame(() => {
      runtimeDialogScaleContext.measureFrame = 0;
      if (this.runtimeDialogScaleContext === runtimeDialogScaleContext) {
        this.updateRuntimeDialogScale();
        if (dialog.open) {
          runtimeDialogScaleContext.entranceAnimations = playStableRuntimeDialogEntrance(dialogLayer, dialog);
        }
      }
    });
    runtimeDialogScaleContext.layoutObserver = new ResizeObserver(() => {
      if (this.runtimeDialogScaleContext === runtimeDialogScaleContext && !runtimeDialogScaleContext.measureFrame) {
        runtimeDialogScaleContext.measureFrame = window.requestAnimationFrame(() => {
          runtimeDialogScaleContext.measureFrame = 0;
          if (this.runtimeDialogScaleContext === runtimeDialogScaleContext) {
            this.updateRuntimeDialogScale();
          }
        });
      }
    });
    runtimeDialogScaleContext.layoutObserver.observe(dialog);
    if (element) {
      runtimeDialogScaleContext.layoutObserver.observe(element);
    }
  }
  updateRuntimeDialogScale() {
    const runtimeDialogScaleContext = this.runtimeDialogScaleContext;
    if (!runtimeDialogScaleContext?.dialog?.isConnected || !runtimeDialogScaleContext.dialogLayer?.isConnected) {
      return;
    }
    const domRect = runtimeDialogScaleContext.dialogLayer.getBoundingClientRect();
    const domRect1 = this.viewport?.getBoundingClientRect();
    const dialogViewport = runtimeDialogViewport({
      layerLeft: domRect.left,
      layerTop: domRect.top,
      layerWidth: domRect.width || runtimeDialogScaleContext.dialogLayer.clientWidth || this.container.clientWidth,
      layerHeight: domRect.height || runtimeDialogScaleContext.dialogLayer.clientHeight || this.container.clientHeight,
      dashboardLeft: domRect1?.left,
      dashboardTop: domRect1?.top,
      dashboardWidth: domRect1?.width,
      dashboardHeight: domRect1?.height
    });
    const layerWidth = dialogViewport.width;
    const layerHeight = dialogViewport.height;
    const count = Math.max(Number(runtimeDialogScaleContext.dialog.offsetWidth || 0), Number(runtimeDialogScaleContext.dialog.scrollWidth || 0));
    const count2 = Math.max(Number(runtimeDialogScaleContext.dialog.offsetHeight || 0), Number(runtimeDialogScaleContext.dialog.scrollHeight || 0));
    const layoutWidth = count > 1 ? count : runtimeDialogScaleContext.designWidth;
    const layoutHeight = count2 > 1 ? count2 : runtimeDialogScaleContext.designHeight;
    const dialogLayout = runtimeDialogLayout({
      layerWidth,
      layerHeight,
      layoutWidth,
      layoutHeight,
      fillAvailable: runtimeDialogScaleContext.fillAvailable,
      tightFill: runtimeDialogScaleContext.tightFill,
      targetOccupancy: runtimeDialogScaleContext.targetOccupancy
    });
    const scale = dialogLayout.scale;
    runtimeDialogScaleContext.dialog.style.position = "absolute";
    runtimeDialogScaleContext.dialog.style.inset = "auto";
    runtimeDialogScaleContext.dialog.style.top = dialogViewport.centerY + "px";
    runtimeDialogScaleContext.dialog.style.left = dialogViewport.centerX + "px";
    runtimeDialogScaleContext.dialog.style.margin = "0";
    runtimeDialogScaleContext.dialog.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
    runtimeDialogScaleContext.dialog.style.transformOrigin = "center";
    runtimeDialogScaleContext.dialog.style.setProperty("--hb-runtime-dialog-scale", String(scale));
    runtimeDialogScaleContext.dialogLayer.dataset.dialogScale = scale.toFixed(4);
    runtimeDialogScaleContext.dialogLayer.dataset.dialogLayoutWidth = String(Math.round(layoutWidth));
    runtimeDialogScaleContext.dialogLayer.dataset.dialogLayoutHeight = String(Math.round(layoutHeight));
    runtimeDialogScaleContext.dialogLayer.dataset.dialogSafeInset = dialogLayout.safeInset.toFixed(2);
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportWidth = String(Math.round(dialogViewport.width));
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportHeight = String(Math.round(dialogViewport.height));
  }
  clearRuntimeDialogScale(element) {
    if (this.runtimeDialogScaleContext?.dialog === element) {
      window.cancelAnimationFrame(this.runtimeDialogScaleContext.measureFrame || 0);
      this.runtimeDialogScaleContext.layoutObserver?.disconnect();
      for (const item of this.runtimeDialogScaleContext.entranceAnimations || []) {
        item.cancel();
      }
      element.classList.remove("hb-runtime-scaled-dialog");
      this.runtimeDialogScaleContext = null;
    }
  }
  closeRuntimeDialog(arg = this.detailsDialog) {
    if (arg) {
      if (arg.open) {
        arg.close();
      } else {
        arg.dispatchEvent(new Event("close"));
      }
      if (arg.isConnected) {
        arg.remove();
      }
      if (this.detailsDialog === arg) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === arg) {
        this.detailsStateSync = null;
      }
    }
  }
  bindRuntimeDialogOutsideDismiss(dialog, popupApi, event) {
    const state = performance.now() + 320;
    dialog.addEventListener("click", event => {
      if (!event.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        if (!(performance.now() < state)) {
          popupApi.close();
        }
      }
    });
  }
  openInteraction3dCameraPreview(camera, onClose, interaction3dOptions = {}) {
    this.showCameraPreview({
      id: "camera:" + camera.id,
      type: "camera",
      properties: {
        label: camera.label
      },
      bindings: {
        entity: {
          entityId: camera.entityId
        }
      }
    }, {
      interaction3d: interaction3dOptions
    });
    const detailsDialog = this.detailsDialog;
    detailsDialog?.addEventListener("close", onClose, {
      once: true
    });
    return {
      updateLayout: () => detailsDialog?.resizeInteraction3d?.(),
      close: () => {
        detailsDialog?.removeEventListener("close", onClose);
        detailsDialog?.close();
      },
      contains: target => detailsDialog?.contains(target)
    };
  }
  showCameraPreview(component, {
    preview = false,
    interaction3d = null
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该摄像头控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const detailsDialog = document.createElement("dialog");
    detailsDialog.className = "hb-camera-preview-dialog fit-media-ratio";
    detailsDialog.dataset.componentId = component.id || "";
    const cameraPreviewCardEl = document.createElement("div");
    cameraPreviewCardEl.className = "hb-camera-preview-card";
    const cameraPreviewHeadingEl = document.createElement("div");
    cameraPreviewHeadingEl.className = "hb-camera-preview-heading";
    const cameraPreviewStatusEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, "摄像头实时预览");
    const element2 = document.createElement("span");
    element2.className = "hb-camera-preview-status";
    element2.textContent = interaction3d ? "正在加载画面" : "正在连接";
    element2.classList.add("is-connecting");
    cameraPreviewStatusEl.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.setAttribute("aria-label", "关闭摄像头预览");
    element3.textContent = "×";
    cameraPreviewHeadingEl.append(cameraPreviewStatusEl, element3);
    const element4 = document.createElement("section");
    element4.className = "hb-camera-device-visual";
    element4.setAttribute("aria-hidden", "true");
    const cameraDeviceMountEl = document.createElement("i");
    cameraDeviceMountEl.className = "hb-camera-device-mount";
    const cameraDeviceArmEl = document.createElement("i");
    cameraDeviceArmEl.className = "hb-camera-device-arm";
    const cameraDeviceBodyEl = document.createElement("div");
    cameraDeviceBodyEl.className = "hb-camera-device-body";
    const cameraDeviceLensEl = document.createElement("i");
    cameraDeviceLensEl.className = "hb-camera-device-lens";
    const cameraDeviceLedEl = document.createElement("i");
    cameraDeviceLedEl.className = "hb-camera-device-led";
    cameraDeviceBodyEl.append(cameraDeviceLensEl, cameraDeviceLedEl);
    element4.append(cameraDeviceMountEl, cameraDeviceArmEl, cameraDeviceBodyEl);
    let state = 0;
    let state1 = null;
    let state2 = 0;
    const runHelper = (arg, delayOrNumber = 0) => "translateX(-50%) perspective(260px) rotateY(" + arg + "deg) rotateZ(" + arg * 0.035 + "deg) translateY(" + delayOrNumber + "px)";
    const filtered = () => {
      if (!cameraDeviceBodyEl.isConnected) {
        return;
      }
      const filtered1 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(arg => Math.abs(arg - state2) >= 7);
      const state8 = filtered1[Math.floor(Math.random() * filtered1.length)] ?? 0;
      const state9 = Math.sign(state8 - state2) || 1;
      const state10 = Math.abs(state8 - state2);
      const duration = Math.round(430 + state10 * 18 + Math.random() * 320);
      const state11 = state8 + state9 * (1.4 + Math.random() * 2.2);
      const state12 = Math.random() * 1.4 - 0.7;
      cameraDeviceLensEl.style.setProperty("--hb-camera-lens-shift", state8 / 23 * 2.5 + "px");
      state1?.cancel();
      state1 = cameraDeviceBodyEl.animate([{
        transform: runHelper(state2, 0),
        offset: 0
      }, {
        transform: runHelper(state11, state12),
        offset: 0.78
      }, {
        transform: runHelper(state8, state12 * 0.35),
        offset: 1
      }], {
        duration,
        easing: "cubic-bezier(.2,.72,.22,1)",
        fill: "forwards"
      });
      state1.addEventListener("finish", () => {
        state2 = state8;
        cameraDeviceBodyEl.style.transform = runHelper(state2, state12 * 0.35);
        state1?.cancel();
        state1 = null;
        const state13 = Math.random() < 0.22 ? 180 + Math.random() * 260 : 680 + Math.random() * 1500;
        state = window.setTimeout(filtered, state13);
      }, {
        once: true
      });
    };
    if (!interaction3d && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      state = window.setTimeout(filtered, 620);
    }
    const container = document.createElement("div");
    container.className = "hb-camera-preview-stage";
    container.classList.add("is-connecting");
    const cameraPreviewRevealVeilEl = document.createElement("i");
    cameraPreviewRevealVeilEl.className = "hb-camera-preview-reveal-veil";
    cameraPreviewRevealVeilEl.setAttribute("aria-hidden", "true");
    const cameraPreviewScanLineEl = document.createElement("i");
    cameraPreviewScanLineEl.className = "hb-camera-preview-scan-line";
    cameraPreviewScanLineEl.setAttribute("aria-hidden", "true");
    container.append(cameraPreviewRevealVeilEl, cameraPreviewScanLineEl);
    const state3 = !!interaction3d;
    const state4 = component.properties?.mediaVisible !== false;
    container.classList.toggle("is-16-9", !state3);
    container.classList.toggle("media-hidden", !state4);
    const state5 = [];
    let state6 = false;
    const onReady = () => {
      if (!state6) {
        state6 = true;
        element2.textContent = "实时画面";
        element2.classList.remove("is-connecting", "is-unavailable");
        element2.classList.add("is-live");
        element4.classList.remove("is-unavailable");
        element4.classList.add("is-live");
        container.classList.remove("is-connecting", "is-unavailable", "is-revealing");
        container.classList.add("is-ready");
      }
    };
    const onUnavailable = () => {
      element2.textContent = "画面不可用";
      element2.classList.remove("is-connecting", "is-live");
      element2.classList.add("is-unavailable");
      element4.classList.remove("is-live");
      element4.classList.add("is-unavailable");
      container.classList.remove("is-connecting", "is-revealing");
      container.classList.add("is-unavailable");
    };
    let state7 = interaction3d ? cameraPreviewRatio(entityId) : 16 / 9;
    const applyElementStyle = () => {
      if (interaction3d) {
        container.style.aspectRatio = String(state7);
        detailsDialog.resizeInteraction3d?.();
        return;
      }
      const count = Math.max(280, this.container.clientWidth - 32);
      const count2 = Math.max(180, Math.min(625, this.container.clientHeight - 88));
      const size = Math.min(760, count, count2 * state7);
      const size1 = size / state7;
      detailsDialog.style.width = Math.max(280, size) + "px";
      container.style.aspectRatio = String(state7);
      container.style.borderRadius = "16px";
    };
    if (state4 && !preview) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "正在载入摄像头实时预览";
      container.append(placeholder);
      const state8 = mountCameraMedia({
        container,
        entityId,
        label: element.textContent,
        objectFit: interaction3d ? "contain" : "fill",
        placeholder,
        onReady,
        onUnavailable,
        cleanup: cleanup => state5.push(cleanup)
      });
      const runHelper1 = (width, height) => {
        if (state3 && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
          state7 = width / height;
          cameraPreviewRatio(entityId, state7);
          applyElementStyle();
        }
      };
      const state9 = () => runHelper1(state8.video.videoWidth, state8.video.videoHeight);
      const state10 = () => runHelper1(state8.image.naturalWidth, state8.image.naturalHeight);
      state8.video.addEventListener("loadedmetadata", state9);
      state8.video.addEventListener("resize", state9);
      state8.image.addEventListener("load", state10);
      state5.push(() => state8.video.removeEventListener("loadedmetadata", state9));
      state5.push(() => state8.video.removeEventListener("resize", state9));
      state5.push(() => state8.image.removeEventListener("load", state10));
    } else if (preview) {
      element2.textContent = "预览模式";
      element2.classList.remove("is-connecting");
      container.classList.remove("is-connecting");
      container.classList.add("is-ready");
      const element5 = document.createElement("span");
      element5.textContent = "预览模式不获取摄像头实时画面";
      container.append(element5);
    } else {
      element2.textContent = "画面已隐藏";
      element2.classList.remove("is-connecting");
      container.classList.remove("is-connecting");
      container.classList.add("is-ready");
      const element5 = document.createElement("span");
      element5.textContent = "摄像头画面已隐藏";
      container.append(element5);
    }
    window.addEventListener("resize", applyElementStyle);
    state5.push(() => window.removeEventListener("resize", applyElementStyle));
    applyElementStyle();
    cameraPreviewCardEl.append(cameraPreviewHeadingEl, ...(interaction3d ? [] : [element4]), container);
    detailsDialog.append(cameraPreviewCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(detailsDialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = detailsDialog;
    if (interaction3d) {
      rendererRuntimeDialogLayerEl.classList.add("i3d-vacuum-dialog-layer");
      detailsDialog.classList.add("i3d-vacuum-details", "i3d-camera-details");
      const root = interaction3d.root || this.container;
      root.append(rendererRuntimeDialogLayerEl);
      detailsDialog.style.setProperty("--i3d-panel-opacity", String(Math.max(0, Math.min(100, Number.isFinite(interaction3d.popupOpacity) ? interaction3d.popupOpacity : 74)) / 100));
      const resizeInteraction3d = () => {
        const presentationLayout = interaction3d.getPresentationLayout?.();
        const layoutWidth = presentationLayout?.width > 0 ? presentationLayout.width : root.clientWidth;
        const layoutHeight = presentationLayout?.height > 0 ? presentationLayout.height : root.clientHeight;
        const scaleX = root.clientWidth / Math.max(1, layoutWidth);
        const scaleY = root.clientHeight / Math.max(1, layoutHeight);
        const {
          panelWidth,
          mediaHeight,
          top
        } = cameraPopupLayout(layoutWidth, layoutHeight, state7, cameraPreviewHeadingEl.offsetHeight || 58);
        const scaledTop = top * scaleY;
        detailsDialog.style.width = panelWidth + "px";
        container.style.height = mediaHeight + "px";
        detailsDialog.style.top = scaledTop + "px";
        detailsDialog.style.right = 16 * scaleX + "px";
        detailsDialog.style.transform = "scale(" + 2 * scaleX + "," + 2 * scaleY + ")";
        detailsDialog.style.maxHeight = Math.max(100, (root.clientHeight - scaledTop - 12 * scaleY) / Math.max(0.001, 2 * scaleY)) + "px";
      };
      detailsDialog.resizeInteraction3d = resizeInteraction3d;
      const resizeObserver = new ResizeObserver(resizeInteraction3d);
      resizeObserver.observe(root);
      state5.push(() => resizeObserver.disconnect());
      resizeInteraction3d();
    } else {
      this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, detailsDialog, 760, 680);
    }
    element3.addEventListener("click", () => detailsDialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, detailsDialog, cameraPreviewCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        detailsDialog.close();
      }
    });
    detailsDialog.addEventListener("close", () => {
      window.clearTimeout(state);
      state1?.cancel();
      for (const runHelper1 of state5.splice(0)) {
        runHelper1();
      }
      this.clearRuntimeDialogScale(detailsDialog);
      if (this.detailsDialog === detailsDialog) {
        this.detailsDialog = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    detailsDialog.show();
  }
  createCapabilityDetailsControls(entityId, component, {
    interactive = true,
    variant = "",
    selectLabel = "模式"
  } = {}) {
    const capabilityDetailsControlsEl = document.createElement("section");
    capabilityDetailsControlsEl.className = "hb-capability-details-controls" + (variant ? " hb-capability-details-controls--" + variant : "");
    capabilityDetailsControlsEl.inert = !interactive;
    const asString = String(entityId || "").split(".", 1)[0];
    let entityState = component || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const state = asString === "fan" ? resolveClimateDeviceType({
      properties: {}
    }, entityState, entityId) : "generic";
    const state1 = {
      entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations
    };
    const runHelper = () => entityState?.attributes || {};
    const runHelper1 = () => ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase());
    const state2 = [];
    const state3 = ["fan", "switch", "input_boolean"].includes(asString);
    const lowered = buildSwitchVisual({
      label: "电源",
      interactive,
      compact: variant === "air-purifier",
      onToggle: async () => {
        if (!interactive || runHelper1()) {
          return;
        }
        const onToggle = String(entityState?.state || "").toLowerCase() === "off";
        const onToggle2 = entityState;
        entityState = {
          ...entityState,
          state: onToggle ? "on" : "off"
        };
        runHelper2(entityState);
        try {
          await this.callEntityService(asString === "fan" ? "fan" : "homeassistant", asString === "fan" ? onToggle ? "turn_on" : "turn_off" : "toggle", entityId);
        } catch (error) {
          entityState = onToggle2;
          runHelper2(onToggle2);
          this.options.onError?.(error);
        }
      }
    });
    lowered.visual.classList.add("hb-capability-power");
    if (state3) {
      capabilityDetailsControlsEl.append(lowered.visual);
    }
    const createChildElement = (arg, second, third, service, dataKey, param6 = asString) => {
      const set = [...new Set((second || []).map(item => String(item ?? "").trim()).filter(Boolean))];
      if (!set.length && (!["electric-bed", "electric-bed-memory"].includes(variant) || asString !== "select")) {
        return;
      }
      const capabilityOptionGroupEl = document.createElement("section");
      capabilityOptionGroupEl.className = "hb-capability-option-group";
      const element = document.createElement("strong");
      element.textContent = arg;
      const capabilityOptionsEl = document.createElement("div");
      capabilityOptionsEl.className = "hb-capability-options";
      if (["electric-bed", "electric-bed-memory"].includes(variant) && asString === "select") {
        const electricBedSelectEl = document.createElement("div");
        electricBedSelectEl.className = "hb-electric-bed-select";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "hb-electric-bed-select-trigger";
        trigger.setAttribute("aria-label", arg);
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        const element2 = document.createElement("span");
        const electricBedSelectMenuEl = document.createElement("i");
        electricBedSelectMenuEl.setAttribute("aria-hidden", "true");
        trigger.append(element2, electricBedSelectMenuEl);
        const electricBedSelectMenuEl2 = document.createElement("div");
        electricBedSelectMenuEl2.className = "hb-electric-bed-select-menu";
        electricBedSelectMenuEl2.id = "hb-bed-select-" + String(this.renderNamespace || "runtime").replace(/[^a-z0-9_-]/gi, "-") + "-" + entityId.replace(/[^a-z0-9_-]/gi, "-");
        electricBedSelectMenuEl2.setAttribute("role", "listbox");
        electricBedSelectMenuEl2.setAttribute("popover", "auto");
        electricBedSelectMenuEl2.hidden = true;
        trigger.setAttribute("aria-controls", electricBedSelectMenuEl2.id);
        let state4 = false;
        const computeResult = () => {
          try {
            return electricBedSelectMenuEl2.matches(":popover-open");
          } catch {
            return electricBedSelectMenuEl2.dataset.open === "true";
          }
        };
        const applyElementStyle = () => {
          if (!computeResult() && electricBedSelectMenuEl2.hidden) {
            return;
          }
          const domRect = trigger.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 150), Math.max(150, innerWidth - 20));
          electricBedSelectMenuEl2.style.width = clamped + "px";
          electricBedSelectMenuEl2.style.maxHeight = Math.min(306, Math.max(96, innerHeight - 20)) + "px";
          const size = Math.min(electricBedSelectMenuEl2.scrollHeight || 0, 306);
          const size1 = innerHeight - domRect.bottom - 10;
          const size2 = domRect.top - 10;
          const clamped1 = size1 < Math.min(size, 160) && size2 > size1 ? Math.max(10, domRect.top - size - 5) : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          electricBedSelectMenuEl2.style.left = Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) + "px";
          electricBedSelectMenuEl2.style.top = Math.max(10, clamped1) + "px";
        };
        const closeMenu = () => {
          if (computeResult() && typeof electricBedSelectMenuEl2.hidePopover == "function") {
            electricBedSelectMenuEl2.hidePopover();
          }
          electricBedSelectMenuEl2.hidden = true;
          electricBedSelectMenuEl2.dataset.open = "false";
          trigger.setAttribute("aria-expanded", "false");
        };
        const syncAriaState = (flag = false) => {
          if (!trigger.disabled) {
            electricBedSelectMenuEl2.hidden = false;
            if (typeof electricBedSelectMenuEl2.showPopover == "function") {
              electricBedSelectMenuEl2.showPopover();
            } else {
              electricBedSelectMenuEl2.dataset.open = "true";
            }
            trigger.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (flag) {
              (electricBedSelectMenuEl2.querySelector("[aria-selected=\"true\"]") || electricBedSelectMenuEl2.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async item => {
          if (!interactive || state4 || !item || runHelper1()) {
            return;
          }
          const state5 = entityState;
          state4 = true;
          closeMenu();
          entityState = {
            ...entityState,
            state: service === "select_option" ? item : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: item
            }
          };
          runHelper2(entityState);
          try {
            await this.callEntityService(param6, service, entityId, {
              [dataKey]: item
            });
          } catch (error) {
            entityState = state5;
            runHelper2(state5);
            this.options.onError?.(error);
          } finally {
            state4 = false;
            runHelper2(entityState);
          }
        };
        const renderOptions = (electricBedSelectOptionEl, electricBedSelectOptionEl1) => {
          electricBedSelectMenuEl2.replaceChildren(...electricBedSelectOptionEl.map(electricBedSelectOptionEl2 => {
            const element3 = document.createElement("button");
            element3.type = "button";
            element3.className = "hb-electric-bed-select-option";
            element3.setAttribute("role", "option");
            element3.dataset.value = electricBedSelectOptionEl2;
            element3.textContent = electricBedSelectOptionEl2;
            const state6 = electricBedSelectOptionEl2 === String(electricBedSelectOptionEl1 ?? "");
            element3.classList.toggle("active", state6);
            element3.setAttribute("aria-selected", String(state6));
            element3.addEventListener("click", () => invokeEntityService(electricBedSelectOptionEl2));
            return element3;
          }));
          const state5 = electricBedSelectOptionEl.includes(String(electricBedSelectOptionEl1 ?? "")) ? String(electricBedSelectOptionEl1) : electricBedSelectOptionEl[0] || "读取中…";
          element2.textContent = state5;
          element2.title = state5;
        };
        trigger.addEventListener("click", () => {
          if (computeResult() || electricBedSelectMenuEl2.dataset.open === "true") {
            closeMenu();
          } else {
            syncAriaState();
          }
        });
        trigger.addEventListener("keydown", event => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState(true);
          }
        });
        electricBedSelectMenuEl2.addEventListener("keydown", event => {
          const matchedEl = [...electricBedSelectMenuEl2.querySelectorAll("[role=\"option\"]")];
          const state5 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
            trigger.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state6 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state5 + state6 + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        electricBedSelectMenuEl2.addEventListener("toggle", toggleEvent => {
          const state5 = toggleEvent.newState === "open";
          electricBedSelectMenuEl2.hidden = !state5;
          electricBedSelectMenuEl2.dataset.open = String(state5);
          trigger.setAttribute("aria-expanded", String(state5));
          if (state5) {
            applyElementStyle();
          }
        });
        electricBedSelectEl.append(trigger, electricBedSelectMenuEl2);
        capabilityOptionGroupEl.append(element, electricBedSelectEl);
        capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
        state2.push({
          type: "bed-select",
          service,
          dataKey,
          trigger,
          electricBedSelectMenuEl2,
          renderOptions,
          closeMenu,
          isPending: () => state4
        });
        return;
      }
      const buttons = [];
      for (const item of set) {
        const element2 = document.createElement("button");
        element2.type = "button";
        const state4 = {
          auto: "自动",
          sleep: "睡眠",
          favorite: "喜爱",
          none: "标准",
          manual: "手动",
          silent: "静音"
        };
        element2.textContent = variant === "air-purifier" && arg === "运行模式" ? state4[item.toLowerCase()] || item : asString === "fan" && state === "bath-heater" && arg === "运行模式" ? climateModeLabel(item, "bath-heater", state1) : item;
        element2.dataset.value = item;
        element2.classList.toggle("active", item === String(third ?? ""));
        element2.addEventListener("click", async () => {
          if (!interactive) {
            return;
          }
          buttons.forEach(buttonEl => {
            buttonEl.disabled = true;
          });
          const state5 = entityState;
          entityState = {
            ...entityState,
            state: service === "select_option" ? item : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: item
            }
          };
          runHelper2(entityState);
          try {
            await this.callEntityService(param6, service, entityId, {
              [dataKey]: item
            });
          } catch (error) {
            entityState = state5;
            runHelper2(state5);
            this.options.onError?.(error);
          } finally {
            buttons.forEach(buttonEl => {
              buttonEl.disabled = false;
            });
          }
        });
        buttons.push(element2);
        capabilityOptionsEl.append(element2);
      }
      capabilityOptionGroupEl.append(element, capabilityOptionsEl);
      capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
      state2.push({
        type: "options",
        service,
        dataKey,
        buttons
      });
    };
    const numeric = Number(runHelper().percentage);
    if (asString === "fan" && Number.isFinite(numeric)) {
      if (variant === "air-purifier") {
        const capabilityOptionGroupEl = document.createElement("section");
        capabilityOptionGroupEl.className = "hb-capability-option-group hb-air-purifier-speed-group";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const capabilityOptionsEl = document.createElement("div");
        capabilityOptionsEl.className = "hb-capability-options hb-air-purifier-speed-options";
        const buttons = [{
          label: "低",
          value: 33
        }, {
          label: "中",
          value: 66
        }, {
          label: "高",
          value: 100
        }].map(element2 => {
          const element3 = document.createElement("button");
          element3.type = "button";
          element3.textContent = element2.label;
          element3.dataset.percentage = String(element2.value);
          element3.addEventListener("click", async () => {
            if (!interactive || runHelper1()) {
              return;
            }
            buttons.forEach(arg => {
              arg.disabled = true;
            });
            const state4 = entityState;
            entityState = {
              ...entityState,
              attributes: {
                ...runHelper(),
                percentage: element2.value
              }
            };
            runHelper2(entityState);
            try {
              await this.callEntityService("fan", "set_percentage", entityId, {
                percentage: element2.value
              });
            } catch (error) {
              entityState = state4;
              runHelper2(state4);
              this.options.onError?.(error);
            } finally {
              buttons.forEach(arg => {
                arg.disabled = false;
              });
            }
          });
          capabilityOptionsEl.append(element3);
          return element3;
        });
        capabilityOptionGroupEl.append(element, capabilityOptionsEl);
        capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
        state2.push({
          type: "percentage-options",
          buttons
        });
      } else {
        const capabilityRangeGroupEl = document.createElement("section");
        capabilityRangeGroupEl.className = "hb-capability-range-group";
        const capabilityRangeHeadingEl = document.createElement("div");
        capabilityRangeHeadingEl.className = "hb-capability-range-heading";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const controlOutputEl = document.createElement("output");
        capabilityRangeHeadingEl.append(element, controlOutputEl);
        const controlInputEl = document.createElement("input");
        controlInputEl.type = "range";
        controlInputEl.min = "0";
        controlInputEl.max = "100";
        controlInputEl.step = "1";
        controlInputEl.value = String(numeric);
        controlInputEl.addEventListener("change", async () => {
          if (!interactive || runHelper1()) {
            return;
          }
          controlInputEl.disabled = true;
          const state4 = entityState;
          const percentage = Number(controlInputEl.value);
          entityState = {
            ...entityState,
            attributes: {
              ...runHelper(),
              percentage
            }
          };
          runHelper2(entityState);
          try {
            await this.callEntityService("fan", "set_percentage", entityId, {
              percentage
            });
          } catch (error) {
            entityState = state4;
            runHelper2(state4);
            this.options.onError?.(error);
          } finally {
            controlInputEl.disabled = false;
          }
        });
        capabilityRangeGroupEl.append(capabilityRangeHeadingEl, controlInputEl);
        capabilityDetailsControlsEl.append(capabilityRangeGroupEl);
        state2.push({
          type: "range",
          controlInputEl,
          controlOutputEl,
          dataKey: "percentage"
        });
      }
    }
    if (asString === "fan") {
      createChildElement("运行模式", runHelper().preset_modes, runHelper().preset_mode, "set_preset_mode", "preset_mode");
    }
    if (asString === "select") {
      createChildElement(selectLabel, runHelper().options, entityState?.state, "select_option", "option", "select");
    }
    if (["number", "input_number"].includes(asString)) {
      const finiteNumber = Number.isFinite(Number(runHelper().min)) ? Number(runHelper().min) : 0;
      const capabilityRangeGroupEl = Number.isFinite(Number(runHelper().max)) ? Number(runHelper().max) : 100;
      const capabilityRangeGroupEl1 = Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0 ? Number(runHelper().step) : 1;
      const capabilityRangeGroupEl2 = document.createElement("section");
      capabilityRangeGroupEl2.className = "hb-capability-range-group";
      const capabilityRangeHeadingEl = document.createElement("div");
      capabilityRangeHeadingEl.className = "hb-capability-range-heading";
      const element = document.createElement("strong");
      element.textContent = runHelper().unit_of_measurement ? "数值（" + runHelper().unit_of_measurement + "）" : "数值";
      const controlOutputEl2 = document.createElement("output");
      capabilityRangeHeadingEl.append(element, controlOutputEl2);
      const controlInputEl2 = document.createElement("input");
      controlInputEl2.type = "range";
      controlInputEl2.min = String(finiteNumber);
      controlInputEl2.max = String(capabilityRangeGroupEl);
      controlInputEl2.step = String(capabilityRangeGroupEl1);
      controlInputEl2.value = String(Number(entityState?.state) || finiteNumber);
      controlInputEl2.addEventListener("change", async () => {
        if (!interactive || runHelper1()) {
          return;
        }
        controlInputEl2.disabled = true;
        const state4 = entityState;
        const asNumber = Number(controlInputEl2.value);
        entityState = {
          ...entityState,
          state: String(asNumber)
        };
        runHelper2(entityState);
        try {
          await this.callEntityService(asString, "set_value", entityId, {
            value: asNumber
          });
        } catch (error) {
          entityState = state4;
          runHelper2(state4);
          this.options.onError?.(error);
        } finally {
          controlInputEl2.disabled = false;
        }
      });
      capabilityRangeGroupEl2.append(capabilityRangeHeadingEl, controlInputEl2);
      capabilityDetailsControlsEl.append(capabilityRangeGroupEl2);
      state2.push({
        type: "range",
        controlInputEl2,
        controlOutputEl2,
        dataKey: "state"
      });
    }
    function runHelper2(arg) {
      entityState = arg || entityState;
      const asString1 = String(entityState?.state || "").toLowerCase();
      const state4 = asString === "fan" ? !["off", "unknown", "unavailable"].includes(asString1) : asString1 === "on";
      const state5 = variant !== "air-purifier" || state4;
      if (state3) {
        lowered.sync(state4, {
          unavailable: runHelper1()
        });
      }
      for (const item of state2) {
        if (item.type === "options") {
          const state6 = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          item.buttons.forEach(element => element.classList.toggle("active", state5 && element.dataset.value === String(state6 ?? "")));
        } else if (item.type === "bed-select") {
          const set = [...new Set((runHelper().options || []).map(item2 => String(item2 ?? "").trim()).filter(Boolean))];
          const state6 = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          item.renderOptions(set, state6);
          item.trigger.disabled = !interactive || item.isPending() || !set.length || runHelper1();
          if (item.trigger.disabled) {
            item.closeMenu();
          }
        } else if (item.type === "select") {
          const set = [...new Set((runHelper().options || []).map(item2 => String(item2 ?? "").trim()).filter(Boolean))];
          if (set.length) {
            const mapped = [...item.input.options].map(element => element.value);
            if (mapped.length !== set.length || mapped.some((item2, second) => item2 !== set[second])) {
              item.input.replaceChildren(...set.map(item2 => {
                const element = document.createElement("option");
                element.value = item2;
                element.textContent = item2;
                return element;
              }));
            }
          }
          const state6 = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          if (state6 != null && [...item.input.options].some(element => element.value === String(state6))) {
            item.input.value = String(state6);
          }
          item.input.disabled = !interactive || !set.length || runHelper1();
        } else if (item.type === "percentage-options") {
          const numeric2 = Number(runHelper().percentage);
          const finiteNumber = numeric2 <= 0 || !Number.isFinite(numeric2) ? 0 : numeric2 <= 49 ? 33 : numeric2 <= 82 ? 66 : 100;
          item.buttons.forEach(element => element.classList.toggle("active", state5 && Number(element.dataset.percentage) === finiteNumber));
        } else {
          if (["number", "input_number"].includes(asString)) {
            const finiteNumber = Number.isFinite(Number(runHelper().min)) ? Number(runHelper().min) : 0;
            const finiteNumber1 = Number.isFinite(Number(runHelper().max)) ? Number(runHelper().max) : 100;
            const finiteNumber2 = Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0 ? Number(runHelper().step) : 1;
            item.input.min = String(finiteNumber);
            item.input.max = String(finiteNumber1);
            item.input.step = String(finiteNumber2);
          }
          const state6 = item.dataKey === "state" ? Number(entityState?.state) : Number(runHelper()[item.dataKey]);
          if (Number.isFinite(state6)) {
            item.input.value = String(state6);
          }
          item.output.textContent = Number.isFinite(state6) ? "" + state6 + (runHelper().unit_of_measurement || "%") : "--";
        }
      }
    }
    capabilityDetailsControlsEl.syncCapabilityState = runHelper2;
    capabilityDetailsControlsEl.cleanupCapabilityDetails = () => {
      for (const item of state2) {
        item.closeMenu?.();
      }
    };
    runHelper2(entityState);
    return capabilityDetailsControlsEl;
  }
  showCapabilityDetails(component, {
    preview = false,
    title = ""
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const entityState = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogEl = this.deviceProfile(entityId);
    const entityDetailsDialogEl1 = entityDetailsDialogEl?.deviceType === "air-purifier";
    const entityDetailsDialogEl2 = document.createElement("dialog");
    entityDetailsDialogEl2.className = "hb-entity-details-dialog capability-details" + (entityDetailsDialogEl1 ? " air-purifier-details" : "");
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = title || component.properties?.label || entityState.attributes?.friendly_name || entityId;
    const element2 = document.createElement("span");
    element2.textContent = entityState.state === "unavailable" ? "当前不可用" : "设备控制";
    divEl.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭弹窗");
    entityDetailsHeadingEl.append(divEl, element3);
    const capabilityDetailsBodyEl = document.createElement("div");
    capabilityDetailsBodyEl.className = "hb-capability-details-body";
    const state = this.createCapabilityDetailsControls(entityId, entityState, {
      interactive: !preview,
      variant: entityDetailsDialogEl1 ? "air-purifier" : ""
    });
    capabilityDetailsBodyEl.append(state);
    entityDetailsCardEl.append(entityDetailsHeadingEl, capabilityDetailsBodyEl);
    entityDetailsDialogEl2.append(entityDetailsCardEl);
    const temperature = {
      pm25: "PM2.5",
      airQuality: "空气质量",
      temperature: "温度",
      humidity: "湿度",
      filterLife: "滤芯寿命"
    };
    const filtered = entityDetailsDialogEl1 ? ["pm25", "airQuality", "temperature", "humidity", "filterLife"].map(role => ({
      role,
      id: entityDetailsDialogEl.roles?.[role]
    })).filter(({
      id
    }) => id).map(({
      role,
      id
    }) => ({
      role,
      item: this.entityMetadata.get(id)
    })).filter(({
      item
    }) => ["sensor", "binary_sensor"].includes(item?.domain) && entityMetadataIsAvailable(item)).slice(0, 5) : [];
    const index = new Map();
    if (filtered.length) {
      const capabilityMetricsEl = document.createElement("div");
      capabilityMetricsEl.className = "hb-capability-metrics";
      for (const {
        role,
        item
      } of filtered) {
        const capabilityMetricEl = document.createElement("div");
        capabilityMetricEl.className = "hb-capability-metric hb-capability-metric--" + role;
        const element4 = document.createElement("small");
        element4.textContent = temperature[role] || item.name || item.originalName || item.entityId;
        const rendererRuntimeDialogLayerEl1 = document.createElement("strong");
        capabilityMetricEl.append(element4, rendererRuntimeDialogLayerEl1);
        capabilityMetricsEl.append(capabilityMetricEl);
        index.set(item.entityId, rendererRuntimeDialogLayerEl1);
      }
      capabilityDetailsBodyEl.prepend(capabilityMetricsEl);
    }
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl2);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl2;
    const lowered = entityState1 => {
      state.syncCapabilityState?.(entityState1);
      element2.textContent = ["unknown", "unavailable"].includes(String(entityState1?.state || "").toLowerCase()) ? "当前不可用" : "设备控制";
    };
    const handlers = new Map([[entityId, [lowered]]]);
    for (const {
      item
    } of filtered) {
      const runHelper = entityState1 => {
        const element4 = index.get(item.entityId);
        if (element4) {
          element4.textContent = entityState1?.state === "unknown" || entityState1?.state === "unavailable" ? "--" : ((entityState1?.state ?? "--") + " " + (entityState1?.attributes?.unit_of_measurement || "")).trim();
        }
      };
      runHelper(this.states.get(item.entityId)?.newState || this.states.get(item.entityId));
      handlers.set(item.entityId, [runHelper]);
    }
    this.detailsStateSync = {
      entityDetailsDialogEl2,
      handlers
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl2, entityDetailsDialogEl1 ? 620 : 560, entityDetailsDialogEl1 ? 560 : 500);
    element3.addEventListener("click", () => entityDetailsDialogEl2.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl2, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogEl2.close();
      }
    });
    entityDetailsDialogEl2.addEventListener("close", () => {
      state.cleanupCapabilityDetails?.();
      this.clearRuntimeDialogScale(entityDetailsDialogEl2);
      if (this.detailsDialog === entityDetailsDialogEl2) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl2) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl2.show();
  }
  showAirPurifierDetails(component, {
    preview = false,
    title = ""
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const state = this.deviceProfile(entityId);
    const state1 = selectedRelatedEntityIds(component);
    let entityDetailsDialogEl = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogEl3 = document.createElement("dialog");
    entityDetailsDialogEl3.className = "hb-entity-details-dialog air-purifier-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = title || componentDialogTitle(component, entityDetailsDialogEl.attributes?.friendly_name || "空气净化器");
    const element2 = document.createElement("span");
    divEl.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.className = "hb-air-purifier-visual";
    element3.inert = preview;
    element3.setAttribute("aria-label", "切换空气净化器电源");
    const airPurifierVisualAuraEl = document.createElement("i");
    airPurifierVisualAuraEl.className = "hb-air-purifier-visual-aura";
    const airPurifierVisualAirflowEl = document.createElement("span");
    airPurifierVisualAirflowEl.className = "hb-air-purifier-visual-airflow";
    for (let airPurifierVisualBodyEl1 = 0; airPurifierVisualBodyEl1 < 4; airPurifierVisualBodyEl1 += 1) {
      airPurifierVisualAirflowEl.append(document.createElement("i"));
    }
    const airPurifierVisualBodyEl = document.createElement("span");
    airPurifierVisualBodyEl.className = "hb-air-purifier-visual-body";
    const airPurifierVisualTopEl = document.createElement("i");
    airPurifierVisualTopEl.className = "hb-air-purifier-visual-top";
    const airPurifierVisualVentEl = document.createElement("i");
    airPurifierVisualVentEl.className = "hb-air-purifier-visual-vent";
    const airPurifierVisualDisplayEl = document.createElement("span");
    airPurifierVisualDisplayEl.className = "hb-air-purifier-visual-display";
    const element4 = document.createElement("strong");
    airPurifierVisualDisplayEl.append(element4);
    airPurifierVisualBodyEl.append(airPurifierVisualTopEl, airPurifierVisualVentEl, airPurifierVisualDisplayEl);
    element3.append(airPurifierVisualAuraEl, airPurifierVisualAirflowEl, airPurifierVisualBodyEl);
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.textContent = "×";
    element5.setAttribute("aria-label", "关闭弹窗");
    entityDetailsHeadingEl.append(divEl, element3, element5);
    const airPurifierLayoutEl = document.createElement("div");
    airPurifierLayoutEl.className = "hb-air-purifier-layout";
    const airPurifierSummaryEl = document.createElement("section");
    airPurifierSummaryEl.className = "hb-air-purifier-summary";
    const airPurifierGaugeWrapEl = document.createElement("div");
    airPurifierGaugeWrapEl.className = "hb-air-purifier-gauge-wrap";
    const element6 = document.createElement("div");
    element6.className = "hb-air-purifier-gauge is-quality";
    const element7 = document.createElement("i");
    element7.className = "hb-air-purifier-gauge-orbit";
    const airPurifierArcCapEl = document.createElement("i");
    airPurifierArcCapEl.className = "hb-air-purifier-arc-cap start";
    const airPurifierArcCapEl1 = document.createElement("i");
    airPurifierArcCapEl1.className = "hb-air-purifier-arc-cap end";
    const airPurifierGaugeContentEl = document.createElement("div");
    airPurifierGaugeContentEl.className = "hb-air-purifier-gauge-content";
    const element8 = document.createElement("small");
    element8.textContent = "室内空气质量";
    const strongEl = document.createElement("strong");
    const element9 = document.createElement("span");
    const element10 = document.createElement("small");
    element10.textContent = "";
    const element11 = document.createElement("span");
    element11.textContent = "设备状态 --";
    strongEl.append(element9, element10);
    airPurifierGaugeContentEl.append(element8, strongEl, element11);
    element6.append(airPurifierArcCapEl, airPurifierArcCapEl1, airPurifierGaugeContentEl);
    airPurifierGaugeWrapEl.append(element7, element6);
    const airPurifierSecondaryMetricsEl = document.createElement("div");
    airPurifierSecondaryMetricsEl.className = "hb-air-purifier-secondary-metrics";
    airPurifierSummaryEl.append(airPurifierGaugeWrapEl, airPurifierSecondaryMetricsEl);
    const airPurifierControlsPaneEl = this.createCapabilityDetailsControls(entityId, entityDetailsDialogEl, {
      interactive: !preview,
      variant: "air-purifier"
    });
    const airPurifierControlsPaneEl1 = document.createElement("section");
    airPurifierControlsPaneEl1.className = "hb-air-purifier-controls-pane";
    airPurifierControlsPaneEl1.append(airPurifierControlsPaneEl);
    airPurifierLayoutEl.append(airPurifierSummaryEl, airPurifierControlsPaneEl1);
    entityDetailsCardEl.append(entityDetailsHeadingEl, airPurifierLayoutEl);
    entityDetailsDialogEl3.append(entityDetailsCardEl);
    const state2 = [{
      key: "pm25",
      label: "PM2.5",
      roles: ["pm25"]
    }, {
      key: "pm10",
      label: "PM10",
      roles: ["pm10"]
    }, {
      key: "hcho",
      label: "甲醛",
      roles: ["hcho"]
    }, {
      key: "filter",
      label: "滤芯寿命",
      roles: ["filterLife", "filterLeftTime"]
    }, {
      key: "temperature",
      label: "温度",
      roles: ["temperature"]
    }, {
      key: "humidity",
      label: "湿度",
      roles: ["humidity"]
    }].map(arg => ({
      ...arg,
      candidates: arg.roles.map(role => ({
        role,
        id: state?.roles?.[role]
      })).filter(({
        id
      }, candidate, candidate2) => id && candidate2.findIndex(candidate => candidate.id === id) === candidate).map(candidates => ({
        ...candidates,
        item: this.entityMetadata.get(candidates.id)
      })).filter(({
        item: candidates
      }) => candidates?.domain === "sensor" && entityMetadataIsAvailable(candidates))
    })).filter(({
      candidates
    }) => candidates.length);
    const runHelper = arg => {
      const numeric = Number(arg?.state);
      if (["unknown", "unavailable"].includes(String(arg?.state || "").toLowerCase()) || !Number.isFinite(numeric)) {
        return null;
      } else {
        return numeric;
      }
    };
    const runHelper1 = entityId1 => this.states.get(entityId1?.id)?.newState || this.states.get(entityId1?.id) || null;
    const runHelper2 = airPurifierSecondaryMetricEl1 => airPurifierSecondaryMetricEl1.candidates.find(airPurifierSecondaryMetricEl2 => runHelper(runHelper1(airPurifierSecondaryMetricEl2)) != null) || airPurifierSecondaryMetricEl1.candidates[0] || null;
    const airPurifierSecondaryMetricEl = Array.from({
      length: 3
    }, () => {
      const item = document.createElement("div");
      item.className = "hb-air-purifier-secondary-metric";
      const airPurifierDetailsSmallEl = document.createElement("small");
      const strongEl1 = document.createElement("strong");
      item.append(airPurifierDetailsSmallEl, strongEl1);
      airPurifierSecondaryMetricsEl.append(item);
      return {
        item,
        airPurifierDetailsSmallEl,
        value: strongEl1
      };
    });
    airPurifierSecondaryMetricsEl.hidden = true;
    const state3 = {
      pm25: "μg/m³",
      pm10: "μg/m³",
      hcho: "mg/m³",
      filterLife: "%",
      filterLeftTime: "h",
      temperature: "°C",
      humidity: "%"
    };
    const runHelper3 = (entityState, second) => {
      if (["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase())) {
        return "--";
      }
      const state9 = {
        hours: "小时",
        hour: "小时",
        days: "天",
        day: "天"
      };
      const entityState1 = entityState?.attributes?.unit_of_measurement || state3[second] || "";
      const lowered = state9[String(entityState1).toLowerCase()] || entityState1;
      return "" + (entityState?.state ?? "--") + (lowered ? " " + lowered : "");
    };
    const handlers = new Map();
    const runHelper4 = (arg, handler) => {
      if (arg) {
        if (!handlers.has(arg)) {
          handlers.set(arg, []);
        }
        handlers.get(arg).push(handler);
      }
    };
    const mapped = state2.flatMap(arg => arg.candidates.map(candidate => candidate.id));
    const state4 = state?.roles?.airQuality || "";
    const state5 = state1 !== null ? this.createWaterHeaterExtensionControls(entityId, {
      component,
      interactive: !preview,
      excludedEntityIds: [...mapped, ...(state4 ? [state4] : [])]
    }) : null;
    if (state5) {
      entityDetailsCardEl.append(state5);
      entityDetailsDialogEl3.classList.add("has-related-extensions");
      for (const [item, item1] of state5.stateHandlers || []) {
        handlers.set(item, item1);
      }
    }
    const state6 = {
      excellent: "空气优",
      good: "空气良",
      moderate: "一般",
      fair: "一般",
      poor: "较差",
      unhealthy: "较差",
      very_poor: "很差"
    };
    let state7 = state4 ? this.states.get(state4)?.newState || this.states.get(state4) : null;
    let state8 = false;
    const found = state2.find(arg => arg.key === "pm25");
    const runHelper5 = () => {
      const state9 = found ? runHelper2(found) : null;
      const state10 = runHelper(runHelper1(state9));
      if (state10 == null) {
        return {
          text: "--",
          level: "unknown"
        };
      } else if (state10 <= 35) {
        return {
          text: "空气优",
          level: "excellent"
        };
      } else if (state10 <= 75) {
        return {
          text: "空气良",
          level: "good"
        };
      } else if (state10 <= 115) {
        return {
          text: "轻度污染",
          level: "warning"
        };
      } else {
        return {
          text: "空气较差",
          level: "poor"
        };
      }
    };
    const applyElementStyle = () => {
      const asString = String(state7?.state || "").trim();
      const lowered = asString.toLowerCase();
      let localValue = ["unknown", "unavailable", ""].includes(lowered) ? "" : state6[lowered] || asString;
      let localValue1 = "good";
      if (localValue) {
        if (/very.?poor|severe|很差|重度|严重/.test(lowered) || /poor|unhealthy|较差|中度/.test(lowered)) {
          localValue1 = "poor";
        } else if (/moderate|fair|一般|轻度|污染/.test(lowered)) {
          localValue1 = "warning";
        } else if (/excellent|优/.test(lowered)) {
          localValue1 = "excellent";
        }
      } else {
        ({
          text: localValue,
          level: localValue1
        } = runHelper5());
      }
      element9.textContent = localValue || "--";
      element10.textContent = "";
      element6.style.setProperty("--hb-air-purifier-progress", {
        excellent: 72,
        good: 58,
        warning: 42,
        poor: 26,
        unknown: 0
      }[localValue1] + "%");
      element6.classList.toggle("is-warning", localValue1 === "warning");
      element6.classList.toggle("is-poor", localValue1 === "poor");
      const state9 = {
        excellent: "#76cfa1",
        good: "#76cfa1",
        warning: "#e4b15f",
        poor: "#db7770",
        unknown: "#7d8990"
      }[localValue1] || "#76cfa1";
      const color = {
        excellent: "rgba(118,207,161,.13)",
        good: "rgba(118,207,161,.13)",
        warning: "rgba(228,177,95,.15)",
        poor: "rgba(219,119,112,.15)",
        unknown: "rgba(125,137,144,.13)"
      }[localValue1] || "rgba(118,207,161,.13)";
      entityDetailsDialogEl3.style.setProperty("--hb-air-purifier-accent", state9);
      entityDetailsDialogEl3.style.setProperty("--hb-air-purifier-accent-soft", color);
    };
    const runHelper6 = entityId2 => {
      state7 = entityId2;
      applyElementStyle();
    };
    const syncVisualState = arg => {
      entityDetailsDialogEl = arg || entityDetailsDialogEl;
      const asString = String(entityDetailsDialogEl?.state || "").toLowerCase();
      const state9 = ["unknown", "unavailable"].includes(asString);
      const state10 = !state9 && asString !== "off";
      state8 = state10;
      element4.textContent = state10 ? "ON" : "OFF";
      element2.textContent = state9 ? "当前不可用" : state10 ? "已开启" : "已关闭";
      element11.textContent = state9 ? "设备不可用" : state10 ? "净化中" : "已关闭";
      element2.classList.toggle("is-on", state10);
      element3.classList.toggle("is-on", state10);
      element3.classList.toggle("is-unavailable", state9);
      element6.classList.toggle("is-running", state10);
      element7.classList.toggle("is-running", state10);
      element3.setAttribute("aria-pressed", String(state10));
      airPurifierControlsPaneEl.syncCapabilityState?.(entityDetailsDialogEl);
    };
    const runHelper7 = () => {
      const filtered = state2.map(metric => ({
        metric,
        selected: runHelper2(metric)
      })).filter(({
        selected
      }) => runHelper(runHelper1(selected)) != null).slice(0, airPurifierSecondaryMetricEl.length);
      airPurifierSecondaryMetricEl.forEach((element12, index) => {
        const state9 = filtered[index];
        element12.item.hidden = !state9;
        element12.item.className = "hb-air-purifier-secondary-metric" + (state9 ? " hb-air-purifier-secondary-metric--" + state9.metric.key : "");
        if (!state9) {
          element12.label.textContent = "";
          element12.value.textContent = "";
          return;
        }
        const state10 = state9.selected?.role || state9.metric.key;
        element12.label.textContent = state9.metric.key === "filter" && state10 === "filterLeftTime" ? "滤芯剩余时间" : state9.metric.label;
        element12.value.textContent = runHelper3(runHelper1(state9.selected), state10);
      });
      airPurifierSecondaryMetricsEl.hidden = filtered.length === 0;
    };
    syncVisualState(entityDetailsDialogEl);
    runHelper4(entityId, syncVisualState);
    for (const item of state2) {
      const runHelper8 = () => {
        runHelper7();
        if (item.key === "pm25") {
          applyElementStyle();
        }
      };
      runHelper8();
      for (const rendererRuntimeDialogLayerEl1 of item.candidates) {
        runHelper4(rendererRuntimeDialogLayerEl1.id, runHelper8);
      }
    }
    runHelper6(state7);
    runHelper4(state4, runHelper6);
    element3.addEventListener("click", () => airPurifierControlsPaneEl.querySelector(".hb-capability-power")?.click());
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl3);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl3;
    this.detailsStateSync = {
      entityDetailsDialogEl3,
      handlers
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl3, 920, state5 ? 620 : 540);
    element5.addEventListener("click", () => entityDetailsDialogEl3.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl3, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogEl3.close();
      }
    });
    entityDetailsDialogEl3.addEventListener("close", () => {
      airPurifierControlsPaneEl.cleanupCapabilityDetails?.();
      this.clearRuntimeDialogScale(entityDetailsDialogEl3);
      if (this.detailsDialog === entityDetailsDialogEl3) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl3) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl3.show();
  }
  showMediaPlayerDetails(component, {
    preview = false
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    let entityDetailsDialogEl = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogEl4 = document.createElement("dialog");
    entityDetailsDialogEl4.className = "hb-entity-details-dialog media-player-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, entityDetailsDialogEl.attributes?.friendly_name || "媒体");
    const element2 = document.createElement("span");
    divEl.append(element, element2);
    const element3 = document.createElement("div");
    element3.className = "hb-media-speaker-visual";
    element3.setAttribute("aria-hidden", "true");
    const mediaSpeakerBodyEl = document.createElement("i");
    mediaSpeakerBodyEl.className = "hb-media-speaker-body";
    const mediaSpeakerArtworkEl = document.createElement("img");
    mediaSpeakerArtworkEl.className = "hb-media-speaker-artwork";
    mediaSpeakerArtworkEl.alt = "";
    mediaSpeakerArtworkEl.hidden = true;
    const mediaSpeakerLightEl = document.createElement("i");
    mediaSpeakerLightEl.className = "hb-media-speaker-light";
    element3.append(mediaSpeakerBodyEl, mediaSpeakerArtworkEl, mediaSpeakerLightEl);
    entityDetailsHeadingEl.append(divEl, element3);
    const mediaPlayerDetailsBodyEl = document.createElement("div");
    mediaPlayerDetailsBodyEl.className = "hb-media-player-details-body";
    const element4 = document.createElement("section");
    element4.className = "hb-media-player-now-playing";
    const mediaPlayerArtworkEl = document.createElement("img");
    mediaPlayerArtworkEl.className = "hb-media-player-artwork";
    mediaPlayerArtworkEl.alt = "";
    mediaPlayerArtworkEl.hidden = true;
    const mediaPlayerCopyEl = document.createElement("div");
    mediaPlayerCopyEl.className = "hb-media-player-copy";
    const element5 = document.createElement("strong");
    const element6 = document.createElement("span");
    const mediaPlayerProgressEl = document.createElement("div");
    mediaPlayerProgressEl.className = "hb-media-player-progress";
    mediaPlayerProgressEl.hidden = true;
    const element7 = document.createElement("progress");
    element7.max = 1;
    element7.value = 0;
    const spanEl = document.createElement("span");
    const element8 = document.createElement("time");
    const element9 = document.createElement("time");
    spanEl.append(element8, element9);
    mediaPlayerProgressEl.append(element7, spanEl);
    mediaPlayerCopyEl.append(element5, element6, mediaPlayerProgressEl);
    element4.append(mediaPlayerArtworkEl, mediaPlayerCopyEl);
    const mediaPlayerActionsEl = document.createElement("div");
    mediaPlayerActionsEl.className = "hb-media-player-actions";
    const buildElementTree = (arg, serviceName, options = {}) => {
      const element14 = document.createElement("button");
      element14.type = "button";
      element14.textContent = arg;
      element14.addEventListener("click", async () => {
        if (!preview) {
          element14.disabled = true;
          try {
            await this.callEntityService("media_player", serviceName, entityId, options);
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element14.disabled = false;
          }
        }
      });
      mediaPlayerActionsEl.append(element14);
      return element14;
    };
    const capabilityRangeGroupEl = buildElementTree("上一曲", "media_previous_track");
    const element10 = buildElementTree("播放", "media_play_pause");
    const capabilityRangeGroupEl1 = buildElementTree("下一曲", "media_next_track");
    const capabilityRangeGroupEl2 = this.createMediaBrowserControl(entityId, {
      preview
    });
    const capabilityRangeGroupEl3 = document.createElement("section");
    capabilityRangeGroupEl3.className = "hb-capability-range-group";
    const capabilityRangeHeadingEl = document.createElement("div");
    capabilityRangeHeadingEl.className = "hb-capability-range-heading";
    const element11 = document.createElement("strong");
    element11.textContent = "音量";
    const element12 = document.createElement("output");
    capabilityRangeHeadingEl.append(element11, element12);
    const element13 = document.createElement("input");
    element13.type = "range";
    element13.min = "0";
    element13.max = "1";
    element13.step = ".01";
    element13.disabled = preview;
    capabilityRangeGroupEl3.append(capabilityRangeHeadingEl, element13);
    element4.append(capabilityRangeGroupEl2.root);
    mediaPlayerDetailsBodyEl.append(element4, mediaPlayerActionsEl, capabilityRangeGroupEl3);
    let showMediaPlayerDetailsValue = "";
    let showMediaPlayerDetailsValue1 = null;
    let showMediaPlayerDetailsValue2 = null;
    let showMediaPlayerDetailsValue3 = null;
    let showMediaPlayerDetailsValue4 = null;
    let showMediaPlayerDetailsValue5 = false;
    let showMediaPlayerDetailsValue6 = null;
    let state = null;
    let state1 = null;
    let state2 = 0;
    let state3 = null;
    let state4 = false;
    const runHelper = arg => {
      const count = Math.max(0, Math.floor(Number(arg) || 0));
      const state7 = Math.floor(count / 60);
      const asString = String(count % 60).padStart(2, "0");
      return state7 + ":" + asString;
    };
    const clampNumber = () => {
      if (!Number.isFinite(state1) || state1 <= 0) {
        mediaPlayerProgressEl.hidden = true;
        return;
      }
      let finiteNumber = Number.isFinite(state2) ? state2 : 0;
      if (state4 && Number.isFinite(state3)) {
        finiteNumber += Math.max(0, (Date.now() - state3) / 1000);
      }
      finiteNumber = Math.max(0, Math.min(state1, finiteNumber));
      mediaPlayerProgressEl.hidden = false;
      element7.max = state1;
      element7.value = finiteNumber;
      element8.textContent = runHelper(finiteNumber);
      element9.textContent = runHelper(state1);
    };
    const state5 = window.setInterval(clampNumber, 1000);
    const runHelper1 = (arg, right) => Number.isFinite(arg) && Number.isFinite(right) && Math.abs(arg - right) <= 0.005;
    const clampNumber1 = arg => {
      showMediaPlayerDetailsValue1 = Math.max(0, Math.min(1, Number(arg) || 0));
      element13.value = String(showMediaPlayerDetailsValue1);
      element12.textContent = Math.round(showMediaPlayerDetailsValue1 * 100) + "%";
    };
    const state6 = async () => {
      window.clearTimeout(showMediaPlayerDetailsValue6);
      showMediaPlayerDetailsValue6 = null;
      if (showMediaPlayerDetailsValue5 || showMediaPlayerDetailsValue4 === null) {
        return;
      }
      const volume_level = showMediaPlayerDetailsValue4;
      showMediaPlayerDetailsValue4 = null;
      showMediaPlayerDetailsValue5 = true;
      try {
        await this.callEntityService("media_player", "volume_set", entityId, {
          volume_level
        });
      } catch (error) {
        showMediaPlayerDetailsValue4 = null;
        showMediaPlayerDetailsValue3 = null;
        window.clearTimeout(state);
        if (showMediaPlayerDetailsValue2 !== null) {
          clampNumber1(showMediaPlayerDetailsValue2);
        }
        this.options.onError?.(error);
      } finally {
        showMediaPlayerDetailsValue5 = false;
        if (showMediaPlayerDetailsValue4 !== null && !runHelper1(showMediaPlayerDetailsValue4, volume_level)) {
          showMediaPlayerDetailsValue6 = window.setTimeout(state6, 140);
        }
      }
    };
    const clamped = () => {
      const count = Math.max(0, Math.min(1, Number(element13.value) || 0));
      showMediaPlayerDetailsValue3 = count;
      showMediaPlayerDetailsValue4 = count;
      window.clearTimeout(state);
      if (!showMediaPlayerDetailsValue5) {
        window.clearTimeout(showMediaPlayerDetailsValue6);
        showMediaPlayerDetailsValue6 = window.setTimeout(state6, 120);
      }
    };
    mediaPlayerArtworkEl.addEventListener("error", () => {
      mediaPlayerArtworkEl.hidden = true;
      element4.classList.remove("has-artwork");
    });
    mediaPlayerArtworkEl.addEventListener("load", () => {
      mediaPlayerArtworkEl.hidden = false;
      element4.classList.add("has-artwork");
    });
    mediaSpeakerArtworkEl.addEventListener("error", () => {
      mediaSpeakerArtworkEl.hidden = true;
      element3.classList.remove("has-artwork");
    });
    mediaSpeakerArtworkEl.addEventListener("load", () => {
      mediaSpeakerArtworkEl.hidden = false;
      element3.classList.add("has-artwork");
    });
    element13.addEventListener("input", () => clampNumber1(element13.value));
    element13.addEventListener("change", clamped);
    const syncVisualState = arg => {
      entityDetailsDialogEl = arg || entityDetailsDialogEl;
      const numeric1 = entityDetailsDialogEl.attributes || {};
      const state7 = {
        off: "已关闭",
        on: "已开启",
        idle: "空闲",
        playing: "播放中",
        paused: "已暂停",
        buffering: "缓冲中",
        standby: "待机",
        unavailable: "不可用",
        unknown: "未知状态"
      };
      const asString = String(entityDetailsDialogEl.state || "unknown").toLowerCase();
      const numeric = Number(numeric1.supported_features || 0);
      capabilityRangeGroupEl2.sync(entityDetailsDialogEl);
      element2.textContent = state7[asString] || entityDetailsDialogEl.state || "未知状态";
      element3.classList.toggle("is-playing", asString === "playing");
      element3.classList.toggle("is-paused", asString === "paused");
      element3.classList.toggle("is-off", ["off", "unavailable", "unknown"].includes(asString));
      element5.textContent = numeric1.media_title || numeric1.media_series_title || numeric1.app_name || numeric1.source || "暂无播放内容";
      element6.textContent = [numeric1.media_artist, numeric1.media_album_name].filter(Boolean).join(" · ") || numeric1.media_content_type || "媒体播放器";
      element10.textContent = asString === "playing" ? "暂停" : "播放";
      element10.disabled = preview || ["off", "unavailable", "unknown"].includes(asString);
      capabilityRangeGroupEl.disabled = preview || !(numeric & 16);
      capabilityRangeGroupEl1.disabled = preview || !(numeric & 32);
      state1 = Number.isFinite(Number(numeric1.media_duration)) ? Number(numeric1.media_duration) : null;
      state2 = Number.isFinite(Number(numeric1.media_position)) ? Number(numeric1.media_position) : 0;
      const position = Date.parse(String(numeric1.media_position_updated_at || ""));
      state3 = Number.isFinite(position) ? position : null;
      state4 = asString === "playing";
      clampNumber();
      const numeric2 = Number(numeric1.volume_level);
      capabilityRangeGroupEl3.hidden = !Number.isFinite(numeric2);
      if (Number.isFinite(numeric2)) {
        if (showMediaPlayerDetailsValue3 === null) {
          showMediaPlayerDetailsValue2 = numeric2;
          clampNumber1(numeric2);
        } else if (runHelper1(numeric2, showMediaPlayerDetailsValue3)) {
          showMediaPlayerDetailsValue2 = numeric2;
          clampNumber1(showMediaPlayerDetailsValue3);
          window.clearTimeout(state);
          state = window.setTimeout(() => {
            showMediaPlayerDetailsValue3 = null;
          }, 1800);
        } else {
          window.clearTimeout(state);
        }
      }
      const trimmed = [numeric1.entity_picture_local, numeric1.entity_picture, numeric1.media_image_url].map(item => String(item || "").trim()).find(urlCandidate => urlCandidate.startsWith("/api/media_player_proxy/") || urlCandidate.startsWith("/api/image_proxy/")) || "";
      if (trimmed !== showMediaPlayerDetailsValue) {
        showMediaPlayerDetailsValue = trimmed;
        mediaPlayerArtworkEl.hidden = !showMediaPlayerDetailsValue;
        element4.classList.toggle("has-artwork", !!showMediaPlayerDetailsValue);
        mediaSpeakerArtworkEl.hidden = !showMediaPlayerDetailsValue;
        element3.classList.toggle("has-artwork", !!showMediaPlayerDetailsValue);
        if (showMediaPlayerDetailsValue) {
          mediaPlayerArtworkEl.src = showMediaPlayerDetailsValue;
          mediaSpeakerArtworkEl.src = showMediaPlayerDetailsValue;
        } else {
          mediaPlayerArtworkEl.removeAttribute("src");
          mediaSpeakerArtworkEl.removeAttribute("src");
        }
      }
    };
    syncVisualState(entityDetailsDialogEl);
    entityDetailsCardEl.append(entityDetailsHeadingEl, mediaPlayerDetailsBodyEl, capabilityRangeGroupEl2.panel);
    entityDetailsDialogEl4.append(entityDetailsCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl4);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl4;
    this.detailsStateSync = {
      entityDetailsDialogEl4,
      handlers: new Map([[entityId, [syncVisualState]]])
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl4, 540, 368);
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl4, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogEl4.close();
      }
    });
    let pendingRef = null;
    entityDetailsDialogEl4.addEventListener("close", () => {
      pendingRef?.cancel();
      capabilityRangeGroupEl2.cleanup?.();
      window.clearInterval(state5);
      window.clearTimeout(showMediaPlayerDetailsValue6);
      window.clearTimeout(state);
      this.clearRuntimeDialogScale(entityDetailsDialogEl4);
      if (this.detailsDialog === entityDetailsDialogEl4) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl4) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl4.show();
    pendingRef = playMediaSpeakerEntrance(element3);
  }
  showCustomPopup(popupId, {
    preview = false
  } = {}) {
    this.closeRuntimeDialog();
    this.historyPopupGeneration += 1;
    this.activePopupId = String(popupId?.id || "");
    this.connectRuntime();
    const customPopupDialogEl = document.createElement("dialog");
    customPopupDialogEl.className = "hb-custom-popup-dialog";
    const customPopupCardEl = document.createElement("div");
    customPopupCardEl.className = "hb-custom-popup-card";
    const state = popupId.modules || [];
    const popupMetrics = popupLayoutMetrics(state, popupId.layout);
    const popupWidth = popupMetrics.popupWidth;
    const popupHeight = popupMetrics.popupHeight;
    customPopupDialogEl.dataset.runtimeDialogLayout = popupMetrics.rows === 1 && popupMetrics.columns === 2 ? "compact" : "fill";
    customPopupCardEl.style.width = popupWidth + "px";
    customPopupCardEl.style.height = popupHeight + "px";
    customPopupCardEl.style.maxHeight = "none";
    const customPopupHeadingEl = document.createElement("div");
    customPopupHeadingEl.className = "hb-custom-popup-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = popupId.name || "组合弹窗";
    divEl.append(element);
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.textContent = "×";
    element2.setAttribute("aria-label", "关闭组合弹窗");
    customPopupHeadingEl.append(divEl, element2);
    const customPopupGridEl = document.createElement("div");
    customPopupGridEl.className = "hb-custom-popup-grid";
    customPopupGridEl.style.gridTemplateColumns = "repeat(" + popupMetrics.columns + ", minmax(0, 1fr))";
    customPopupGridEl.style.gridTemplateRows = "repeat(" + popupMetrics.rows + ", minmax(0, 1fr))";
    const state1 = [];
    const state2 = [];
    const state3 = [];
    const state4 = [];
    const state5 = [];
    const handlers = new Map();
    const runHelper = (arg, handler) => {
      if (!handlers.has(arg)) {
        handlers.set(arg, []);
      }
      handlers.get(arg).push(handler);
    };
    for (const [entry, entry1] of state.entries()) {
      const component = entry1.type === "capability-device" ? {
        ...entry1,
        type: "generic"
      } : entry1;
      const text = String(component.entityId || "");
      const state7 = this.deviceProfile(text);
      const component2 = applyXiaomiDeviceProfile({
        bindings: {
          entity: {
            entityId: component.entityId
          }
        },
        properties: {
          ...(component.properties || {}),
          deviceType: component.deviceType || component.properties?.deviceType || "auto"
        }
      }, state7);
      const component3 = state7 ? {
        ...component,
        properties: component2.properties,
        deviceType: component2.properties?.deviceType || component.deviceType
      } : component;
      const size = popupMetrics.placements[entry] || {
        x: 0,
        y: entry,
        width: 1,
        height: 1
      };
      const size1 = ["climate", "air-purifier", "water-heater", "media-player", "camera", "line-chart"].includes(component3.type) ? 2 : size.width;
      const entityId = text || component3.entityId;
      const customPopupModuleEl = this.states.get(entityId);
      const customPopupModuleEl1 = customPopupModuleEl?.newState || customPopupModuleEl;
      const element3 = document.createElement("section");
      element3.className = "hb-custom-popup-module hb-custom-popup-module--" + (component3.type || "generic");
      element3.style.gridColumn = size.x + 1 + " / span " + size1;
      element3.style.gridRow = size.y + 1 + " / span " + size.height;
      const element4 = document.createElement("div");
      element4.className = "hb-custom-popup-module-heading";
      const element5 = document.createElement("strong");
      element5.textContent = popupModuleDialogTitle(component3, customPopupModuleEl1);
      const element6 = document.createElement("span");
      element6.className = "hb-custom-popup-module-status type-" + (component3.type || "generic");
      const state8 = {
        light: "灯光",
        climate: "空调 / 浴霸",
        "air-purifier": "空气净化器",
        "water-heater": "热水器",
        "media-player": "媒体",
        "electric-bed": "电动床",
        switch: "开关",
        cover: "窗帘",
        camera: "摄像头",
        "line-chart": "实时数据",
        generic: "设备"
      };
      element6.textContent = state8[component3.type] || state8.generic;
      element4.append(element5, element6);
      element3.append(element4);
      if (component3.type === "electric-bed" && state7?.deviceType !== "electric-bed") {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const customElectricBedLoadingEl = document.createElement("section");
        customElectricBedLoadingEl.className = "hb-custom-electric-bed-loading hb-climate-details-loading is-loading";
        const iconEl = document.createElement("i");
        iconEl.setAttribute("aria-hidden", "true");
        const element7 = document.createElement("strong");
        element7.textContent = "正在加载设备状态…";
        customElectricBedLoadingEl.append(iconEl, element7);
        element3.append(customElectricBedLoadingEl);
      } else if (component3.type === "electric-bed") {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const state9 = (state7 || this.deviceProfile(entityId))?.roles || {};
        const resolveEntityId = entityId2 => {
          const state10 = this.states.get(entityId2);
          return state10?.newState || state10 || {
            entityId: entityId2,
            state: "unknown",
            attributes: {}
          };
        };
        const customElectricBedBodyEl = document.createElement("div");
        customElectricBedBodyEl.className = "hb-custom-electric-bed-body";
        const electricBedVisualEl = document.createElement("section");
        electricBedVisualEl.className = "hb-electric-bed-visual";
        const electricBedModelEl = document.createElement("div");
        electricBedModelEl.className = "hb-electric-bed-model";
        for (const electricBedEl of ["mattress", "back", "waist", "legs", "base"]) {
          const electricBedEl1 = document.createElement("i");
          electricBedEl1.className = "hb-electric-bed-" + electricBedEl;
          electricBedModelEl.append(electricBedEl1);
        }
        const buildElementTree = (electricBedAngleReadoutEl, electricBedAngleReadoutEl1) => {
          const item = document.createElement("span");
          item.className = "hb-electric-bed-angle-readout " + electricBedAngleReadoutEl;
          const strongEl = document.createElement("strong");
          const element11 = document.createElement("small");
          element11.textContent = electricBedAngleReadoutEl1;
          item.append(strongEl, element11);
          return {
            item,
            value: strongEl
          };
        };
        const element7 = buildElementTree("back", "靠背");
        const element8 = buildElementTree("waist", "腰部");
        const element9 = buildElementTree("legs", "腿部");
        electricBedVisualEl.append(electricBedModelEl, element7.item, element8.item, element9.item);
        const electricBedControlEl = document.createElement("section");
        electricBedControlEl.className = "hb-electric-bed-control hb-electric-bed-mode";
        const electricBedMemoryEl = document.createElement("section");
        electricBedMemoryEl.className = "hb-electric-bed-memory";
        const electricBedAngleControlsEl = document.createElement("section");
        electricBedAngleControlsEl.className = "hb-electric-bed-angle-controls";
        const text2 = String(state9.mode || "");
        const filtered = [state9.memory1, state9.memory2].filter(Boolean).slice(0, 2);
        const mapped = [["backrest", "靠背角度", "back"], ["leg", "腿部角度", "legs"], ["waist", "腰部角度", "waist"]].map(([role, label, visualClass]) => ({
          role,
          label,
          visualClass,
          entityId: String(state9[role] || "")
        })).filter(electricBedControlEl1 => electricBedControlEl1.entityId);
        const syncVisualState = (electricBedControlEl1, electricBedControlEl2, electricBedControlEl3, variant = "") => {
          const electricBedControlEl4 = document.createElement("section");
          electricBedControlEl4.className = "hb-electric-bed-control";
          const element11 = document.createElement("strong");
          element11.textContent = electricBedControlEl2;
          const element12 = this.createCapabilityDetailsControls(electricBedControlEl3, resolveEntityId(electricBedControlEl3), {
            interactive: !preview,
            variant
          });
          element12.classList.add("hb-electric-bed-capability");
          electricBedControlEl4.append(element11, element12);
          electricBedControlEl1.append(electricBedControlEl4);
          state1.push(() => element12.cleanupCapabilityDetails?.());
          runHelper(electricBedControlEl3, arg => element12.syncCapabilityState?.(arg));
        };
        if (text2) {
          syncVisualState(electricBedControlEl, "模式", text2, "electric-bed");
        } else {
          const element11 = document.createElement("strong");
          element11.textContent = "模式";
          const capabilitySelectEl = document.createElement("select");
          capabilitySelectEl.className = "hb-capability-select";
          capabilitySelectEl.disabled = true;
          capabilitySelectEl.append(new Option("未识别到模式实体"));
          electricBedControlEl.append(element11, capabilitySelectEl);
        }
        const element10 = document.createElement("strong");
        element10.textContent = "记忆姿势";
        const electricBedMemoryListEl = document.createElement("div");
        electricBedMemoryListEl.className = "hb-electric-bed-memory-list";
        for (let state10 = 0; state10 < 2; state10 += 1) {
          const text3 = String(filtered[state10] || "");
          const state11 = text3 ? this.entityMetadata.get(text3) : null;
          if (text3.split(".", 1)[0] === "select") {
            syncVisualState(electricBedMemoryListEl, "记忆姿势 " + (state10 + 1), text3, "electric-bed-memory");
            continue;
          }
          const element11 = document.createElement("button");
          element11.type = "button";
          element11.className = "hb-electric-bed-memory-button";
          element11.textContent = state11?.name || state11?.originalName || "记忆姿势 " + (state10 + 1);
          element11.disabled = preview || !text3;
          element11.addEventListener("click", async () => {
            if (!preview && !!text3 && !element11.disabled) {
              element11.disabled = true;
              try {
                await this.callEntityService("button", "press", text3);
                element11.classList.add("is-success");
                window.setTimeout(() => element11.classList.remove("is-success"), 900);
              } catch (error) {
                this.options.onError?.(error);
              } finally {
                element11.disabled = preview || !text3;
              }
            }
          });
          electricBedMemoryListEl.append(element11);
        }
        electricBedMemoryEl.append(element10, electricBedMemoryListEl);
        for (const item of mapped) {
          syncVisualState(electricBedAngleControlsEl, item.label, item.entityId);
        }
        const applyElementStyle = () => {
          const state10 = {
            backrest: resolveEntityId(state9.backrest),
            leg: resolveEntityId(state9.leg),
            waist: resolveEntityId(state9.waist)
          };
          const runHelper2 = arg => {
            const numeric = Number(arg?.state);
            if (Number.isFinite(numeric)) {
              return numeric;
            } else {
              return null;
            }
          };
          const applyElementStyle1 = (arg, second, element11) => {
            const state11 = runHelper2(state10[arg]);
            element11.textContent = state11 === null ? "--" : Math.round(state11) + "°";
            if (state11 !== null) {
              electricBedModelEl.style.setProperty("--hb-bed-" + (arg === "backrest" ? "backrest" : arg) + "-angle", state11 + "deg");
            }
          };
          applyElementStyle1("backrest", electricBedModelEl, element7.value);
          applyElementStyle1("waist", electricBedModelEl, element8.value);
          applyElementStyle1("leg", electricBedModelEl, element9.value);
          element6.textContent = "已连接";
        };
        for (const item of [state9.backrest, state9.leg, state9.waist].filter(Boolean)) {
          runHelper(item, applyElementStyle);
        }
        applyElementStyle();
        customElectricBedBodyEl.append(electricBedControlEl, electricBedVisualEl, electricBedMemoryEl, electricBedAngleControlsEl);
        element3.append(customElectricBedBodyEl);
      } else if (component3.type === "camera") {
        const element7 = document.createElement("section");
        element7.className = "hb-camera-device-visual hb-custom-camera-device-visual";
        element7.setAttribute("aria-hidden", "true");
        const cameraDeviceMountEl = document.createElement("i");
        cameraDeviceMountEl.className = "hb-camera-device-mount";
        const cameraDeviceArmEl = document.createElement("i");
        cameraDeviceArmEl.className = "hb-camera-device-arm";
        const cameraDeviceBodyEl = document.createElement("div");
        cameraDeviceBodyEl.className = "hb-camera-device-body";
        const cameraDeviceLensEl = document.createElement("i");
        cameraDeviceLensEl.className = "hb-camera-device-lens";
        const cameraDeviceLedEl = document.createElement("i");
        cameraDeviceLedEl.className = "hb-camera-device-led";
        cameraDeviceBodyEl.append(cameraDeviceLensEl, cameraDeviceLedEl);
        element7.append(cameraDeviceMountEl, cameraDeviceArmEl, cameraDeviceBodyEl);
        element4.append(element7);
        let state9 = 0;
        let state10 = null;
        let state11 = 0;
        const runHelper2 = (arg, delayOrNumber = 0) => "translateX(-50%) perspective(260px) rotateY(" + arg + "deg) rotateZ(" + arg * 0.035 + "deg) translateY(" + delayOrNumber + "px)";
        const filtered = () => {
          if (!cameraDeviceBodyEl.isConnected) {
            return;
          }
          const filtered1 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(arg => Math.abs(arg - state11) >= 7);
          const state12 = filtered1[Math.floor(Math.random() * filtered1.length)] ?? 0;
          const state13 = Math.sign(state12 - state11) || 1;
          const state14 = Math.abs(state12 - state11);
          const duration = Math.round(430 + state14 * 18 + Math.random() * 320);
          const state15 = state12 + state13 * (1.4 + Math.random() * 2.2);
          const state16 = Math.random() * 1.4 - 0.7;
          cameraDeviceLensEl.style.setProperty("--hb-camera-lens-shift", state12 / 23 * 2.5 + "px");
          state10?.cancel();
          state10 = cameraDeviceBodyEl.animate([{
            transform: runHelper2(state11, 0),
            offset: 0
          }, {
            transform: runHelper2(state15, state16),
            offset: 0.78
          }, {
            transform: runHelper2(state12, state16 * 0.35),
            offset: 1
          }], {
            duration,
            easing: "cubic-bezier(.2,.72,.22,1)",
            fill: "forwards"
          });
          state10.addEventListener("finish", () => {
            state11 = state12;
            cameraDeviceBodyEl.style.transform = runHelper2(state11, state16 * 0.35);
            state10?.cancel();
            state10 = null;
            const state17 = Math.random() < 0.22 ? 180 + Math.random() * 260 : 680 + Math.random() * 1500;
            state9 = window.setTimeout(filtered, state17);
          }, {
            once: true
          });
        };
        if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
          state9 = window.setTimeout(filtered, 620);
        }
        state1.push(() => {
          window.clearTimeout(state9);
          state10?.cancel();
        });
        const container = document.createElement("div");
        container.className = "hb-custom-popup-camera-stage is-connecting";
        element6.textContent = preview ? "预览模式" : "正在连接";
        element6.classList.add("is-connecting");
        const cameraPreviewRevealVeilEl = document.createElement("i");
        cameraPreviewRevealVeilEl.className = "hb-camera-preview-reveal-veil";
        const cameraPreviewScanLineEl = document.createElement("i");
        cameraPreviewScanLineEl.className = "hb-camera-preview-scan-line";
        container.append(cameraPreviewRevealVeilEl, cameraPreviewScanLineEl);
        const placeholder = document.createElement("span");
        placeholder.textContent = preview ? "预览模式不获取实时画面" : "正在载入摄像头实时预览";
        container.append(placeholder);
        if (preview) {
          element6.classList.remove("is-connecting");
          container.classList.remove("is-connecting");
          container.classList.add("is-ready");
        } else {
          mountCameraMedia({
            container,
            entityId,
            label: element5.textContent,
            objectFit: "fill",
            placeholder,
            onReady: () => {
              element6.textContent = "实时画面";
              element6.classList.remove("is-connecting", "is-unavailable");
              element6.classList.add("is-live");
              element7.classList.remove("is-unavailable");
              element7.classList.add("is-live");
              container.classList.remove("is-connecting", "is-unavailable", "is-revealing");
              container.classList.add("is-ready");
            },
            onUnavailable: () => {
              element6.textContent = "画面不可用";
              element6.classList.remove("is-connecting", "is-live");
              element6.classList.add("is-unavailable");
              element7.classList.remove("is-live");
              element7.classList.add("is-unavailable");
              container.classList.remove("is-connecting", "is-revealing");
              container.classList.add("is-unavailable");
            },
            cleanup: cleanup => state1.push(cleanup)
          });
        }
        element3.append(container);
      } else if (component3.type === "line-chart") {
        const component4 = {
          type: "line-chart",
          bindings: {
            entity: {
              entityId
            }
          },
          properties: {
            ...syncedLineChartProperties(this.document, this.page, entityId, component3.properties),
            compactDetailsHorizontal: true
          }
        };
        const customLineChartCurrentEl = document.createElement("output");
        customLineChartCurrentEl.className = "hb-custom-line-chart-current";
        const element7 = document.createElement("strong");
        const element8 = document.createElement("small");
        const text2 = String(component4.properties?.valueColor || "#dce1e5");
        element7.style.color = text2;
        element8.style.color = text2;
        customLineChartCurrentEl.append(element7, element8);
        element4.append(customLineChartCurrentEl);
        const syncAriaState = entityState => {
          const state13 = Number.parseFloat(entityState?.state);
          element7.textContent = Number.isFinite(state13) ? formatLineChartValue(state13, component4.properties?.statePrecision) : entityState?.state || "--";
          element8.textContent = String(entityState?.attributes?.unit_of_measurement || "");
          customLineChartCurrentEl.setAttribute("aria-label", "当前数值 " + element7.textContent + element8.textContent);
        };
        const state9 = {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace + "-" + component3.id,
          interactive: true,
          animate: false
        };
        let state10 = renderLineChartDetails(component4, state9);
        let state11 = 0;
        const state12 = () => {
          state11 = 0;
          if (!state10?.isConnected || this.detailsStateSync?.dialog !== customPopupDialogEl) {
            return;
          }
          const state13 = renderLineChartDetails(component4, state9);
          state10.cleanupLineChartHover?.();
          state10.replaceWith(state13);
          state10 = state13;
          applyElementStyle();
        };
        const scheduleTimeout = (arg = 700) => {
          state11 ||= window.setTimeout(state12, Math.max(0, Number(arg) || 0));
        };
        state5.push(() => scheduleTimeout(0));
        const applyElementStyle = () => {
          customLineChartCurrentEl.style.setProperty("--hb-custom-chart-accent", state10.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
        };
        syncAriaState(customPopupModuleEl1);
        applyElementStyle();
        runHelper(entityId, arg => {
          syncAriaState(arg);
          state10.syncLineChartState?.(arg);
          applyElementStyle();
        });
        state1.push(() => {
          window.clearTimeout(state11);
          state10.cleanupLineChartHover?.();
        });
        element3.append(state10);
      } else if (component3.type === "switch") {
        let state9 = customPopupModuleEl1;
        let state10 = false;
        let state11 = "idle";
        let state12 = null;
        const momentary = entityId.split(".")[0] === "button";
        const switchVisual = buildSwitchVisual({
          label: element5.textContent,
          interactive: !preview,
          momentary,
          onToggle: () => state12?.()
        });
        switchVisual.visual.classList.add("hb-custom-switch-visual");
        const syncVisualState = arg => {
          state9 = arg;
          const unavailable = !arg?.state || ["unknown", "unavailable"].includes(arg.state);
          const state13 = !momentary && arg?.state === "on";
          switchVisual.sync(state13, {
            unavailable,
            pending: state10 && state11 !== "success",
            success: state11 === "success"
          });
          element6.textContent = unavailable ? "当前不可用" : momentary ? state11 === "success" ? "执行成功" : state10 ? "正在执行" : "按下执行" : state13 ? "已开启" : "已关闭";
          element6.classList.toggle("is-live", (momentary ? state10 || state11 === "success" : state13) && !unavailable);
        };
        state12 = async () => {
          if (preview || state10 || ["unknown", "unavailable"].includes(state9?.state)) {
            return;
          }
          const state13 = state9;
          state10 = true;
          state11 = "idle";
          syncVisualState(momentary ? state13 : {
            ...state13,
            state: state13?.state === "on" ? "off" : "on"
          });
          try {
            if (momentary) {
              await this.callEntityService("button", "press", entityId);
              state11 = "success";
              syncVisualState(state9);
              await new Promise(arg => window.setTimeout(arg, 900));
            } else {
              await this.callEntityService("homeassistant", "toggle", entityId);
            }
          } catch (error) {
            state11 = "idle";
            syncVisualState(state13);
            this.options.onError?.(error);
          } finally {
            state10 = false;
            state11 = "idle";
            syncVisualState(state9);
          }
        };
        syncVisualState(customPopupModuleEl1);
        runHelper(entityId, syncVisualState);
        element3.append(switchVisual.visual);
      } else if (component3.type === "light") {
        let lightVisualEl = null;
        element4.classList.add("has-light-visual");
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className = "hb-light-visual hb-custom-light-visual";
        element7.style.animationDelay = 0.08 + entry * 0.07 + "s";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const lightVisualAuraEl = document.createElement("div");
        lightVisualAuraEl.className = "hb-light-visual-aura";
        const lightVisualLampEl = document.createElement("div");
        lightVisualLampEl.className = "hb-light-visual-lamp";
        for (const lightVisualEl1 of ["cord", "shade", "bulb", "filament"]) {
          const lightVisualEl2 = document.createElement("i");
          lightVisualEl2.className = "hb-light-visual-" + lightVisualEl1;
          lightVisualLampEl.append(lightVisualEl2);
        }
        element7.append(lightVisualAuraEl, lightVisualLampEl);
        element4.append(element7);
        const numeric = customPopupModuleEl1?.attributes || {};
        const temperature = lightSupportsColor(numeric);
        const finiteNumber = Number(numeric.min_color_temp_kelvin) || (Number.isFinite(Number(numeric.max_mireds)) ? 1000000 / Number(numeric.max_mireds) : 2000);
        const finiteNumber1 = Number(numeric.max_color_temp_kelvin) || (Number.isFinite(Number(numeric.min_mireds)) ? 1000000 / Number(numeric.min_mireds) : 6500);
        const finiteNumber2 = Number(numeric.color_temp_kelvin) || (Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : NaN);
        const finiteNumber3 = {
          isOn: customPopupModuleEl1?.state === "on",
          brightnessPercent: Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : 100,
          colorTemperatureKelvin: Number.isFinite(finiteNumber2) ? finiteNumber2 : (finiteNumber + finiteNumber1) / 2,
          colorRgb: temperature && Array.isArray(numeric.rgb_color) ? numeric.rgb_color.slice(0, 3).map(colorRgb => Number(colorRgb) || 0) : temperature && Array.isArray(numeric.hs_color) ? hsToRgbColor(numeric.hs_color) : null
        };
        const onVisualChange = (entityState = {}) => {
          const numeric1 = entityState.attributes || {};
          if (typeof entityState.isOn == "boolean") {
            finiteNumber3.isOn = entityState.isOn;
          } else if (typeof entityState.state == "string") {
            finiteNumber3.isOn = entityState.state === "on";
          }
          if (Number.isFinite(Number(entityState.brightnessPercent))) {
            finiteNumber3.brightnessPercent = Number(entityState.brightnessPercent);
          } else if (Number.isFinite(Number(numeric1.brightness))) {
            finiteNumber3.brightnessPercent = Number(numeric1.brightness) / 255 * 100;
          }
          if (Number.isFinite(Number(entityState.colorTemperatureKelvin))) {
            finiteNumber3.colorTemperatureKelvin = Number(entityState.colorTemperatureKelvin);
          } else if (Number.isFinite(Number(numeric1.color_temp_kelvin))) {
            finiteNumber3.colorTemperatureKelvin = Number(numeric1.color_temp_kelvin);
          } else if (Number.isFinite(Number(numeric1.color_temp))) {
            finiteNumber3.colorTemperatureKelvin = 1000000 / Number(numeric1.color_temp);
          }
          if (temperature && Array.isArray(entityState.colorRgb)) {
            finiteNumber3.colorRgb = entityState.colorRgb.slice(0, 3).map(arg => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric1.rgb_color)) {
            finiteNumber3.colorRgb = numeric1.rgb_color.slice(0, 3).map(arg => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric1.hs_color)) {
            finiteNumber3.colorRgb = hsToRgbColor(numeric1.hs_color);
          }
          const count = Math.max(1, Math.min(100, Number(finiteNumber3.brightnessPercent) || 1));
          const clamped = (Math.max(2000, Math.min(6500, Number(finiteNumber3.colorTemperatureKelvin) || 4250)) - 2000) / 4500;
          const color = [255, 132, 42];
          const color1 = [172, 225, 255];
          const mapped = finiteNumber3.colorRgb || color.map((arg, second) => Math.round(arg + (color1[second] - arg) * clamped));
          element7.classList.toggle("is-on", finiteNumber3.isOn);
          element7.style.setProperty("--hb-light-visual-color", "rgb(" + mapped.join(",") + ")");
          element7.style.setProperty("--hb-light-visual-opacity", finiteNumber3.isOn ? String(0.08 + count / 100 * 0.92) : "0");
          element7.style.setProperty("--hb-light-visual-blur", Math.round(15 + count * 1.14) + "px");
          element7.style.setProperty("--hb-light-visual-scale", String(0.62 + count / 100 * 1.05));
          element7.setAttribute("aria-pressed", String(finiteNumber3.isOn));
          element7.setAttribute("aria-label", "" + element5.textContent + (finiteNumber3.isOn ? "已开启，点击关闭" : "已关闭，点击开启"));
          element6.textContent = finiteNumber3.isOn ? "已开启" : "已关闭";
          element6.classList.toggle("is-live", finiteNumber3.isOn);
        };
        onVisualChange();
        let state9 = false;
        element7.addEventListener("click", async () => {
          if (preview || state9) {
            return;
          }
          state9 = true;
          element7.setAttribute("aria-busy", "true");
          const isOn = finiteNumber3.isOn;
          onVisualChange({
            isOn: !isOn
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            onVisualChange({
              isOn
            });
            this.options.onError?.(error);
          } finally {
            state9 = false;
            element7.removeAttribute("aria-busy");
          }
        });
        lightVisualEl = this.createLightDetailsControls(entityId, customPopupModuleEl1, {
          interactive: !preview,
          onTurnOn: () => {
            onVisualChange({
              isOn: true
            });
          },
          onVisualChange
        });
        state1.push(() => lightVisualEl?.cleanupLightDetails?.());
        runHelper(entityId, arg => {
          onVisualChange(arg);
          lightVisualEl?.syncLightState?.(arg);
        });
        element3.append(lightVisualEl);
      } else if (component3.type === "climate" || component3.type === "water-heater") {
        element3.classList.add("hb-custom-popup-module--climate");
        const deviceType = component3.type === "water-heater" ? "water-heater" : resolveClimateDeviceType({
          properties: {
            deviceType: component3.deviceType || component3.properties?.deviceType || "auto",
            label: component3.title || ""
          }
        }, customPopupModuleEl1, entityId);
        let climateVisualEl = customPopupModuleEl1;
        const climateVisualEl1 = {
          entityId,
          entityMetadata: this.entityMetadata,
          entityTranslations: this.entityTranslations
        };
        const visual = document.createElement("button");
        visual.type = "button";
        visual.className = "hb-climate-visual hb-custom-climate-visual";
        visual.classList.toggle("is-bath-heater", deviceType === "bath-heater");
        visual.classList.toggle("is-water-heater", deviceType === "water-heater");
        if (deviceType === "water-heater") {
          state4.push({
            visual,
            distance: 168,
            delay: 100 + entry * 45
          });
        }
        visual.inert = preview;
        visual.setAttribute("aria-disabled", String(preview));
        const climateVisualUnitEl = document.createElement("div");
        climateVisualUnitEl.className = "hb-climate-visual-unit";
        const element7 = document.createElement("span");
        element7.className = "hb-climate-visual-brand";
        element7.textContent = deviceType === "bath-heater" ? "BATH HEATER" : deviceType === "water-heater" ? "SMART WATER" : "SMART AIR";
        const element8 = document.createElement("strong");
        element8.className = "hb-climate-visual-display";
        const climateVisualVentEl = document.createElement("div");
        climateVisualVentEl.className = "hb-climate-visual-vent";
        for (let climateVisualAirflowEl1 = 0; climateVisualAirflowEl1 < 5; climateVisualAirflowEl1 += 1) {
          climateVisualVentEl.append(document.createElement("i"));
        }
        climateVisualUnitEl.append(element7, element8, climateVisualVentEl);
        const climateVisualAirflowEl = document.createElement("div");
        climateVisualAirflowEl.className = "hb-climate-visual-airflow";
        for (let showCustomPopupValue1 = 0; showCustomPopupValue1 < 3; showCustomPopupValue1 += 1) {
          climateVisualAirflowEl.append(document.createElement("i"));
        }
        visual.append(climateVisualUnitEl, climateVisualAirflowEl);
        const syncVisualState = ({
          mode = "off",
          visualMode = "off",
          running = false,
          accentColor = "#65717a",
          targetTemperature
        } = {}) => {
          const state14 = visualMode !== "off";
          visual.classList.toggle("is-on", state14);
          visual.classList.toggle("is-running", running);
          visual.classList.toggle("is-airflow-mode", deviceType === "bath-heater" && state14 && bathHeaterModeUsesAirflow(mode));
          visual.dataset.visualMode = visualMode;
          visual.style.setProperty("--hb-climate-visual-accent", accentColor);
          const finiteNumber = targetTemperature != null && targetTemperature !== "" && Number.isFinite(Number(targetTemperature));
          element8.textContent = state14 ? finiteNumber ? Number(targetTemperature) + "°" : climateModeLabel(mode, deviceType, climateVisualEl1) : "OFF";
          if (deviceType === "bath-heater") {
            visual.setAttribute("aria-label", element5.textContent + "，点击切换浴霸灯");
          } else {
            visual.setAttribute("aria-pressed", String(state14));
            visual.setAttribute("aria-label", "" + element5.textContent + (state14 ? "已开启，点击关闭" : "已关闭，点击开启"));
          }
        };
        const element9 = this.createClimateDetailsControls(entityId, customPopupModuleEl1, {
          interactive: !preview,
          deviceType,
          onVisualChange: ({
            mode: onVisualChange,
            visualMode: onVisualChange2,
            running: onVisualChange3,
            accentColor: onVisualChange4,
            accentSoft: onVisualChange5,
            targetTemperature: onVisualChange6
          }) => {
            element6.textContent = climateModeLabel(onVisualChange, deviceType, climateVisualEl1);
            element6.classList.toggle("is-live", onVisualChange2 !== "off");
            element6.classList.toggle("is-running", onVisualChange3);
            element6.style.setProperty("--hb-climate-accent", onVisualChange4);
            element6.style.setProperty("--hb-climate-accent-soft", onVisualChange5);
            syncVisualState({
              mode: onVisualChange,
              visualMode: onVisualChange2,
              running: onVisualChange3,
              accentColor: onVisualChange4,
              targetTemperature: onVisualChange6
            });
          }
        });
        state1.push(() => element9.cleanupClimateDetails?.());
        const state9 = deviceType === "bath-heater" ? state7?.roles?.light : "";
        const state10 = state9 ? this.entityMetadata.get(state9) : deviceType === "bath-heater" ? relatedDeviceDomainEntity(this.entityMetadata, entityId, "light") : null;
        let state11 = null;
        if (state10?.entityId) {
          const state14 = this.states.get(state10.entityId);
          const state15 = state14?.newState || state14 || {
            state: "unknown",
            attributes: {}
          };
          state11 = this.createBathHeaterLightControl(state10.entityId, state15, {
            interactive: !preview,
            onStateChange: ({
              isOn: onStateChange,
              unavailable: onStateChange2
            }) => {
              visual.classList.toggle("is-light-on", onStateChange && !onStateChange2);
              visual.setAttribute("aria-pressed", String(onStateChange && !onStateChange2));
            }
          });
          element9.append(state11);
          runHelper(state10.entityId, arg => state11.syncBathLightState?.(arg));
        }
        const state12 = Array.from(element9.children);
        const customClimateLeftEl = state12.find(element10 => element10.classList.contains("hb-climate-thermostat"));
        const customClimateLeftEl1 = state12.find(element10 => element10.classList.contains("hb-climate-fan-slider"));
        const customClimateLeftEl2 = document.createElement("div");
        customClimateLeftEl2.className = "hb-custom-climate-left";
        const customClimateRightEl = document.createElement("div");
        customClimateRightEl.className = "hb-custom-climate-right";
        if (customClimateLeftEl) {
          customClimateLeftEl2.append(customClimateLeftEl);
        }
        if (customClimateLeftEl1) {
          customClimateLeftEl2.append(customClimateLeftEl1);
        }
        customClimateRightEl.append(visual, ...state12.filter(arg => arg !== customClimateLeftEl && arg !== customClimateLeftEl1));
        const state13 = !!customClimateLeftEl || !!customClimateLeftEl1;
        element9.classList.toggle("without-primary-controls", !state13);
        element9.replaceChildren(...(state13 ? [customClimateLeftEl2, customClimateRightEl] : [customClimateRightEl]));
        let showCustomPopupValue = false;
        visual.addEventListener("click", async () => {
          if (deviceType === "bath-heater") {
            if (state11?.toggleBathLight) {
              await state11.toggleBathLight();
            } else {
              this.options.onError?.(new Error("未找到与浴霸同设备的灯光实体。"));
            }
            return;
          }
          if (preview || showCustomPopupValue) {
            return;
          }
          showCustomPopupValue = true;
          visual.setAttribute("aria-busy", "true");
          const entityState = climateVisualEl;
          const state14 = climateIsPoweredOn(entityState, deviceType);
          const state15 = element9.dataset.lastClimateMode || (state14 ? entityState.state : "auto");
          const state16 = {
            state: state14 ? "off" : state15,
            attributes: {
              ...(entityState?.attributes || {}),
              hvac_action: state14 ? "off" : state15
            }
          };
          climateVisualEl = state16;
          element9.syncClimateState?.(state16);
          try {
            const state17 = climatePowerCommand(entityId, entityState, !state14, deviceType, element9.dataset.lastClimateMode || "");
            await this.callEntityService(state17.domain, state17.service, entityId, state17.data);
          } catch (error) {
            climateVisualEl = entityState;
            element9.syncClimateState?.(entityState);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            visual.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, arg => {
          climateVisualEl = arg;
          element9.syncClimateState?.(arg);
        });
        element3.append(element9);
      } else if (component3.type === "cover") {
        let state9 = customPopupModuleEl1;
        const entityState = customPopupModuleEl1?.attributes || {};
        const airer = coverComponentIsAirer(component3, entityId, customPopupModuleEl1, this.entityMetadata, this.deviceMetadata);
        const numeric = Number(entityState.supported_features || 0);
        const state10 = entityId + " " + (entityState.friendly_name || "") + " " + (component3.title || "");
        const finiteNumber = Number.isFinite(Number(entityState.current_tilt_position)) || !!(numeric & 240);
        const state11 = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(state10);
        const state12 = ["standard", "dream", "airer"].includes(component3.properties?.coverKind) ? component3.properties.coverKind : "auto";
        const dream = !airer && (state12 === "dream" || state12 === "auto" && (finiteNumber || state11));
        const state13 = (airer ? relatedAirerLightEntity(this.entityMetadata, entityId) : null)?.entityId || "";
        const state14 = state13 ? this.states.get(state13) : null;
        let position = state14?.newState || state14 || null;
        const positionCommandEntityId = (airer ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId) : null)?.entityId || "";
        const position1 = this.states.get(positionCommandEntityId);
        const positionCommandState = position1?.newState || position1 || null;
        const state15 = (airer ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId) : null)?.entityId || "";
        const state16 = (airer ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId) : null)?.entityId || "";
        const state17 = this.states.get(state16);
        const motorState = state17?.newState || state17 || null;
        const state18 = airer ? relatedAirerMotorActionEntities(this.entityMetadata, entityId) : {};
        const airerActionEntityIds = Object.fromEntries(Object.entries(state18).map(([arg, item]) => [arg, item?.entityId || ""]));
        const position2 = this.states.get(state15 || positionCommandEntityId);
        const positionState = position2?.newState || position2 || null;
        const tilt = dream && finiteNumber;
        const motorReversed = coverMotorIsReversedForComponent(component3, this.entityMetadata, this.states, entityId);
        const state19 = motorReversed ? "open_cover" : "close_cover";
        const customCoverLayoutEl = motorReversed ? "close_cover" : "open_cover";
        const customCoverLayoutEl1 = ["left", "right"].includes(component3.properties?.coverDirection) ? component3.properties.coverDirection : "split";
        const customCoverLayoutEl2 = document.createElement("div");
        customCoverLayoutEl2.className = "hb-custom-cover-layout";
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className = "hb-cover-visual hb-custom-cover-visual";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const coverVisualRailEl = document.createElement("i");
        coverVisualRailEl.className = "hb-cover-visual-rail";
        const coverVisualPanelEl = document.createElement("i");
        coverVisualPanelEl.className = "hb-cover-visual-panel left";
        const coverVisualPanelEl1 = document.createElement("i");
        coverVisualPanelEl1.className = "hb-cover-visual-panel right";
        const coverVisualSlatsEl = document.createElement("span");
        coverVisualSlatsEl.className = "hb-cover-visual-slats";
        const coverVisualSlatEl = 13;
        for (let coverVisualSlatEl1 = 0; coverVisualSlatEl1 < coverVisualSlatEl; coverVisualSlatEl1 += 1) {
          const coverVisualSlatEl2 = document.createElement("span");
          coverVisualSlatEl2.className = "hb-cover-visual-slat";
          const iconEl = document.createElement("i");
          coverVisualSlatEl2.style.setProperty("--hb-cover-slat-index", String(coverVisualSlatEl1));
          const size2 = customCoverLayoutEl1 === "right" ? coverVisualSlatEl - 1 - coverVisualSlatEl1 : customCoverLayoutEl1 === "split" ? Math.abs((coverVisualSlatEl - 1) / 2 - coverVisualSlatEl1) : coverVisualSlatEl1;
          coverVisualSlatEl2.style.setProperty("--hb-cover-slat-delay-index", String(size2));
          const size3 = customCoverLayoutEl1 === "left" ? -coverVisualSlatEl1 * 14.5 : customCoverLayoutEl1 === "right" ? (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5 : coverVisualSlatEl1 <= (coverVisualSlatEl - 1) / 2 ? -coverVisualSlatEl1 * 14.5 : (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5;
          coverVisualSlatEl2.style.setProperty("--hb-cover-retracted-shift", size3 + "px");
          coverVisualSlatEl2.append(iconEl);
          coverVisualSlatsEl.append(coverVisualSlatEl2);
        }
        const coverVisualWindowEl = document.createElement("i");
        coverVisualWindowEl.className = "hb-cover-visual-window";
        element7.classList.toggle("is-dream", dream);
        element7.classList.toggle("is-airer", airer);
        element7.classList.add("direction-" + customCoverLayoutEl1);
        element7.append(coverVisualWindowEl, coverVisualRailEl, coverVisualPanelEl, coverVisualPanelEl1, coverVisualSlatsEl);
        if (airer) {
          appendAirerVisual(element7);
        }
        const syncVisualState = (arg = position) => {
          if (!airer) {
            return;
          }
          position = arg || position;
          const state21 = !state13 || ["unknown", "unavailable"].includes(String(position?.state || "unknown"));
          const state22 = position?.state === "on";
          element7.classList.toggle("is-light-on", state22 && !state21);
          element7.classList.toggle("is-light-unavailable", state21);
          element7.disabled = preview || state21;
          element7.setAttribute("aria-pressed", String(state22 && !state21));
          element7.setAttribute("aria-label", state21 ? "晾衣机灯光实体不可用" : "晾衣机灯光" + (state22 ? "已开启，点击关闭" : "已关闭，点击开启"));
        };
        syncVisualState();
        let position3 = 0;
        const positionCalibration = airerPositionCalibration(this.entityMetadata, this.deviceMetadata, entityId);
        const onVisualChange = ({
          position: position4 = 0,
          state = ""
        } = {}) => {
          const current_position = Math.max(0, Math.min(100, Number(position4) || 0));
          const coverState = coverPresentationState({
            state,
            attributes: {
              current_position
            }
          }, motorReversed);
          const physicalState = physicalCoverState(state || state9?.state, motorReversed);
          const position5 = physicalState === "open" || physicalState === "opening";
          position3 = current_position;
          element7.style.setProperty("--hb-cover-open-position", current_position + "%");
          element7.style.setProperty("--hb-airer-drop", airerVisualDrop(current_position) + "px");
          element7.style.setProperty("--hb-cover-panel-width", 45.9 - current_position * 0.331 + "%");
          element7.style.setProperty("--hb-cover-single-panel-width", 91.8 - current_position * 0.79 + "%");
          element7.style.setProperty("--hb-cover-slat-angle", current_position * 1.8 + "deg");
          element7.classList.toggle("is-tilt-reversed", current_position > 50);
          element7.classList.toggle("is-tilt-center", Math.abs(current_position - 50) <= 2);
          element7.classList.toggle("is-open", dream ? position5 : coverState === "open" || coverState === "opening");
          element7.classList.toggle("is-moving", state === "opening" || state === "closing");
          element7.setAttribute("aria-pressed", String(dream ? position5 : coverState === "open" || coverState === "opening"));
          if (airer) {
            element6.textContent = coverLiftStateLabel(coverState) || Math.round(current_position) + "%";
          } else if (dream) {
            element6.textContent = dreamCurtainStatusText(state || state9?.state, current_position, motorReversed);
          } else {
            element6.textContent = {
              open: "已打开",
              closed: "已关闭",
              opening: "正在打开",
              closing: "正在关闭"
            }[coverState] || Math.round(current_position) + "%";
          }
          element6.classList.toggle("is-live", dream ? position5 : coverState === "open" || coverState === "opening");
          if (!airer) {
            element7.setAttribute("aria-label", dream ? "" + element5.textContent + dreamCurtainStatusText(state || state9?.state, current_position, motorReversed) : "" + element5.textContent + (coverState === "open" || coverState === "opening" ? "已打开，点击关闭" : "已关闭，点击打开"));
          }
        };
        const state20 = this.createCoverDetailsControls(entityId, customPopupModuleEl1, {
          interactive: !preview,
          dream,
          airer,
          tilt,
          motorReversed,
          positionState,
          positionCommandEntityId,
          positionCommandState,
          motorState,
          airerActionEntityIds,
          positionCalibration,
          onVisualChange,
          onCurtainPositionChange: ({
            retracted: onCurtainPositionChange,
            moving: onCurtainPositionChange2
          }) => {
            element7.classList.toggle("is-curtain-retracted", onCurtainPositionChange);
            element7.classList.toggle("is-curtain-moving", onCurtainPositionChange2);
            element7.dataset.curtainRetracted = String(onCurtainPositionChange);
            if (dream) {
              element6.textContent = dreamCurtainStatusFromRetraction(onCurtainPositionChange, onCurtainPositionChange2, position3);
              element6.classList.toggle("is-live", onCurtainPositionChange);
            }
          }
        });
        let showCustomPopupValue = false;
        element7.addEventListener("click", async () => {
          if (preview || showCustomPopupValue) {
            return;
          }
          showCustomPopupValue = true;
          element7.setAttribute("aria-busy", "true");
          if (airer) {
            const state24 = position;
            syncVisualState({
              ...(position || {}),
              state: position?.state === "on" ? "off" : "on"
            });
            try {
              await this.callEntityService("homeassistant", "toggle", state13);
            } catch (error) {
              syncVisualState(state24);
              this.options.onError?.(error);
            } finally {
              showCustomPopupValue = false;
              element7.removeAttribute("aria-busy");
            }
            return;
          }
          const state21 = position3;
          const state22 = state20.isDreamCurtainRetracted?.() ?? element7.dataset.curtainRetracted === "true";
          const state23 = state21 > COVER_CLOSED_POSITION_EPSILON;
          if (dream) {
            state20.beginDreamCurtainMotion?.(!state22);
          } else {
            state20.beginCoverMotion?.(state23 ? 0 : 100, state23 ? "closing" : "opening");
          }
          try {
            await this.callEntityService("cover", dream ? dreamCurtainToggleService(state22, customCoverLayoutEl, state19) : state23 ? state19 : customCoverLayoutEl, entityId);
          } catch (error) {
            if (dream) {
              state20.cancelDreamCurtainMotion?.();
              state20.setDreamCurtainRetracted?.(state22, false);
            } else {
              state20.cancelCoverMotion?.();
            }
            state20.syncCoverState?.(state9);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            element7.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, arg => {
          state9 = arg;
          state20.syncCoverState?.(arg);
        });
        if (state13) {
          runHelper(state13, syncVisualState);
        }
        if (state15) {
          runHelper(state15, arg => state20.syncCoverPositionState?.(arg));
        }
        if (positionCommandEntityId) {
          runHelper(positionCommandEntityId, entityId1 => {
            state20.syncCoverPositionCommandState?.(entityId1);
            if (!state15) {
              state20.syncCoverPositionState?.(entityId1);
            }
          });
        }
        if (state16) {
          runHelper(state16, arg => state20.syncAirerMotorState?.(arg));
        }
        state1.push(() => state20.cleanupCoverDetails?.());
        customCoverLayoutEl2.append(element7, state20);
        element3.append(customCoverLayoutEl2);
      } else if (component3.type === "air-purifier") {
        let airPurifierVisualEl = customPopupModuleEl1 || {
          entityId,
          state: "unknown",
          attributes: {}
        };
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className = "hb-air-purifier-visual hb-custom-air-purifier-visual";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const airPurifierVisualAuraEl = document.createElement("i");
        airPurifierVisualAuraEl.className = "hb-air-purifier-visual-aura";
        const airPurifierVisualAirflowEl = document.createElement("span");
        airPurifierVisualAirflowEl.className = "hb-air-purifier-visual-airflow";
        for (let airPurifierVisualBodyEl1 = 0; airPurifierVisualBodyEl1 < 4; airPurifierVisualBodyEl1 += 1) {
          airPurifierVisualAirflowEl.append(document.createElement("i"));
        }
        const airPurifierVisualBodyEl = document.createElement("span");
        airPurifierVisualBodyEl.className = "hb-air-purifier-visual-body";
        const airPurifierVisualTopEl = document.createElement("i");
        airPurifierVisualTopEl.className = "hb-air-purifier-visual-top";
        const airPurifierVisualVentEl = document.createElement("i");
        airPurifierVisualVentEl.className = "hb-air-purifier-visual-vent";
        const airPurifierVisualDisplayEl = document.createElement("span");
        airPurifierVisualDisplayEl.className = "hb-air-purifier-visual-display";
        const element8 = document.createElement("strong");
        airPurifierVisualDisplayEl.append(element8);
        airPurifierVisualBodyEl.append(airPurifierVisualTopEl, airPurifierVisualVentEl, airPurifierVisualDisplayEl);
        element7.append(airPurifierVisualAuraEl, airPurifierVisualAirflowEl, airPurifierVisualBodyEl);
        const airPurifierLayoutEl = this.createCapabilityDetailsControls(entityId, airPurifierVisualEl, {
          interactive: !preview,
          variant: "air-purifier"
        });
        const airPurifierLayoutEl1 = document.createElement("div");
        airPurifierLayoutEl1.className = "hb-air-purifier-layout hb-custom-air-purifier-layout";
        const airPurifierSummaryEl = document.createElement("section");
        airPurifierSummaryEl.className = "hb-air-purifier-summary";
        const airPurifierGaugeWrapEl = document.createElement("div");
        airPurifierGaugeWrapEl.className = "hb-air-purifier-gauge-wrap";
        const element9 = document.createElement("div");
        element9.className = "hb-air-purifier-gauge is-quality";
        const element10 = document.createElement("i");
        element10.className = "hb-air-purifier-gauge-orbit";
        const airPurifierArcCapEl = document.createElement("i");
        airPurifierArcCapEl.className = "hb-air-purifier-arc-cap start";
        const airPurifierArcCapEl1 = document.createElement("i");
        airPurifierArcCapEl1.className = "hb-air-purifier-arc-cap end";
        const airPurifierGaugeContentEl = document.createElement("div");
        airPurifierGaugeContentEl.className = "hb-air-purifier-gauge-content";
        const element11 = document.createElement("small");
        element11.textContent = "室内空气质量";
        const strongEl = document.createElement("strong");
        const element12 = document.createElement("span");
        const element13 = document.createElement("span");
        element13.textContent = "设备状态 --";
        strongEl.append(element12);
        airPurifierGaugeContentEl.append(element11, strongEl, element13);
        element9.append(airPurifierArcCapEl, airPurifierArcCapEl1, airPurifierGaugeContentEl);
        airPurifierGaugeWrapEl.append(element10, element9);
        const airPurifierControlsPaneEl = document.createElement("section");
        airPurifierControlsPaneEl.className = "hb-air-purifier-controls-pane";
        airPurifierControlsPaneEl.append(airPurifierLayoutEl);
        const state9 = {
          pm25: "PM2.5",
          pm10: "PM10",
          filterLife: "滤芯寿命",
          filterLeftTime: "滤芯剩余时间",
          hcho: "甲醛",
          temperature: "温度",
          humidity: "湿度"
        };
        const state10 = [{
          role: "pm25",
          ids: [state7?.roles?.pm25]
        }, {
          role: "pm10",
          ids: [state7?.roles?.pm10]
        }, {
          role: "filterLife",
          ids: [state7?.roles?.filterLife, state7?.roles?.filterLeftTime]
        }, {
          role: "hcho",
          ids: [state7?.roles?.hcho]
        }, {
          role: "temperature",
          ids: [state7?.roles?.temperature]
        }, {
          role: "humidity",
          ids: [state7?.roles?.humidity]
        }].map(arg => ({
          ...arg,
          ids: arg.ids.filter(Boolean)
        }));
        const computeResult = entityId1 => {
          const state11 = this.states.get(entityId1);
          return state11?.newState || state11 || null;
        };
        const runHelper2 = arg => {
          const numeric = computeResult(arg);
          return numeric && !["unknown", "unavailable"].includes(String(numeric.state || "").toLowerCase()) && Number.isFinite(Number(numeric.state));
        };
        const found = state10.map(arg => ({
          ...arg,
          id: arg.ids.find(id => runHelper2(id)) || arg.ids.find(id => this.entityMetadata.has(id))
        })).filter(airPurifierSecondaryMetricsEl1 => airPurifierSecondaryMetricsEl1.id).slice(0, 3);
        const airPurifierSecondaryMetricsEl = document.createElement("div");
        airPurifierSecondaryMetricsEl.className = "hb-air-purifier-secondary-metrics hb-custom-air-purifier-metrics";
        for (const airPurifierSecondaryMetricEl of found) {
          const airPurifierSecondaryMetricEl1 = this.entityMetadata.get(airPurifierSecondaryMetricEl.id);
          const airPurifierSecondaryMetricEl2 = document.createElement("div");
          airPurifierSecondaryMetricEl2.className = "hb-air-purifier-secondary-metric hb-air-purifier-secondary-metric--" + airPurifierSecondaryMetricEl.role;
          const element14 = document.createElement("small");
          element14.textContent = state9[airPurifierSecondaryMetricEl.role] || airPurifierSecondaryMetricEl.role;
          const element15 = document.createElement("strong");
          airPurifierSecondaryMetricEl2.append(element14, element15);
          airPurifierSecondaryMetricsEl.append(airPurifierSecondaryMetricEl2);
          const runHelper4 = entityState => {
            element15.textContent = ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase()) ? "--" : ((entityState?.state ?? "--") + " " + (entityState?.attributes?.unit_of_measurement || airPurifierSecondaryMetricEl1?.unitOfMeasurement || "")).trim();
          };
          runHelper4(computeResult(airPurifierSecondaryMetricEl.id));
          runHelper(airPurifierSecondaryMetricEl.id, runHelper4);
        }
        const airQuality = state7?.roles?.airQuality;
        const pm25 = state7?.roles?.pm25;
        const runHelper3 = () => {
          const state11 = computeResult(airQuality);
          const numeric1 = computeResult(pm25);
          const trimmed = ["unknown", "unavailable"].includes(String(state11?.state || "").toLowerCase()) ? "" : String(state11?.state || "").trim();
          const numeric = Number(numeric1?.state);
          const lowered = trimmed.toLowerCase();
          let localValue = trimmed;
          let localValue1 = "unknown";
          if (/excellent|优/.test(lowered)) {
            localValue1 = "excellent";
          } else if (/good|良/.test(lowered)) {
            localValue1 = "good";
          } else if (/moderate|fair|一般|轻度|污染/.test(lowered)) {
            localValue1 = "warning";
          } else if (/poor|unhealthy|较差|中度|重度|严重/.test(lowered)) {
            localValue1 = "poor";
          } else if (Number.isFinite(numeric)) {
            localValue1 = numeric <= 15 ? "excellent" : numeric <= 35 ? "good" : numeric <= 75 ? "warning" : "poor";
            localValue = {
              excellent: "空气优",
              good: "空气良",
              warning: "轻度污染",
              poor: "空气较差"
            }[localValue1];
          }
          element12.textContent = localValue || "--";
          element9.style.setProperty("--hb-air-purifier-progress", {
            excellent: 72,
            good: 58,
            warning: 42,
            poor: 26,
            unknown: 0
          }[localValue1] + "%");
          element9.classList.toggle("is-warning", localValue1 === "warning");
          element9.classList.toggle("is-poor", localValue1 === "poor");
          const state12 = {
            excellent: "#76cfa1",
            good: "#76cfa1",
            warning: "#e4b15f",
            poor: "#db7770",
            unknown: "#7d8990"
          }[localValue1];
          const color = {
            excellent: "rgba(118,207,161,.13)",
            good: "rgba(118,207,161,.13)",
            warning: "rgba(228,177,95,.15)",
            poor: "rgba(219,119,112,.15)",
            unknown: "rgba(125,137,144,.13)"
          }[localValue1];
          element3.style.setProperty("--hb-air-purifier-accent", state12);
          element3.style.setProperty("--hb-air-purifier-accent-soft", color);
        };
        if (airQuality) {
          runHelper(airQuality, runHelper3);
        }
        if (pm25 && pm25 !== airQuality) {
          runHelper(pm25, runHelper3);
        }
        runHelper3();
        const syncVisualState = (arg = airPurifierVisualEl) => {
          airPurifierVisualEl = arg || airPurifierVisualEl;
          const asString = String(airPurifierVisualEl?.state || "").toLowerCase();
          const state11 = ["unknown", "unavailable"].includes(asString);
          const state12 = !state11 && asString !== "off";
          element8.textContent = state12 ? "ON" : "OFF";
          element7.classList.toggle("is-on", state12);
          element7.classList.toggle("is-unavailable", state11);
          element7.setAttribute("aria-pressed", String(state12));
          element7.setAttribute("aria-label", "" + element5.textContent + (state12 ? "已开启，点击关闭" : "已关闭，点击开启"));
          element6.textContent = state11 ? "当前不可用" : state12 ? "已开启" : "已关闭";
          element6.classList.toggle("is-live", state12);
          element13.textContent = state11 ? "设备不可用" : state12 ? "净化中" : "已关闭";
          element9.classList.toggle("is-running", state12);
          element10.classList.toggle("is-running", state12);
          airPurifierLayoutEl.syncCapabilityState?.(airPurifierVisualEl);
        };
        syncVisualState();
        let showCustomPopupValue = false;
        element7.addEventListener("click", async () => {
          if (preview || showCustomPopupValue || ["unknown", "unavailable"].includes(String(airPurifierVisualEl?.state || "").toLowerCase())) {
            return;
          }
          showCustomPopupValue = true;
          element7.setAttribute("aria-busy", "true");
          const state11 = airPurifierVisualEl;
          const asString = String(state11?.state || "").toLowerCase() === "off";
          syncVisualState({
            ...state11,
            state: asString ? "on" : "off"
          });
          try {
            await this.callEntityService("fan", asString ? "turn_on" : "turn_off", entityId);
          } catch (error) {
            syncVisualState(state11);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            element7.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, syncVisualState);
        element4.append(element7);
        airPurifierSummaryEl.append(airPurifierGaugeWrapEl, airPurifierSecondaryMetricsEl);
        airPurifierLayoutEl1.append(airPurifierSummaryEl, airPurifierControlsPaneEl);
        element3.append(airPurifierLayoutEl1);
      } else if (component3.type === "media-player") {
        element5.textContent = popupModuleDialogTitle(component3, customPopupModuleEl1, "媒体");
        element3.classList.add("hb-media-player-details");
        const element7 = document.createElement("div");
        element7.className = "hb-media-speaker-visual";
        element7.setAttribute("aria-hidden", "true");
        state2.push(element7);
        const mediaSpeakerBodyEl = document.createElement("i");
        mediaSpeakerBodyEl.className = "hb-media-speaker-body";
        const mediaSpeakerArtworkEl = document.createElement("img");
        mediaSpeakerArtworkEl.className = "hb-media-speaker-artwork";
        mediaSpeakerArtworkEl.alt = "";
        mediaSpeakerArtworkEl.hidden = true;
        const mediaSpeakerLightEl = document.createElement("i");
        mediaSpeakerLightEl.className = "hb-media-speaker-light";
        element7.append(mediaSpeakerBodyEl, mediaSpeakerArtworkEl, mediaSpeakerLightEl);
        element4.append(element7);
        const mediaPlayerDetailsBodyEl = document.createElement("div");
        mediaPlayerDetailsBodyEl.className = "hb-media-player-details-body hb-custom-media-player-body";
        const element8 = document.createElement("section");
        element8.className = "hb-media-player-now-playing";
        const mediaPlayerArtworkEl = document.createElement("img");
        mediaPlayerArtworkEl.className = "hb-media-player-artwork";
        mediaPlayerArtworkEl.alt = "";
        mediaPlayerArtworkEl.hidden = true;
        const mediaPlayerCopyEl = document.createElement("div");
        mediaPlayerCopyEl.className = "hb-media-player-copy";
        const element9 = document.createElement("strong");
        const element10 = document.createElement("span");
        const mediaPlayerProgressEl = document.createElement("div");
        mediaPlayerProgressEl.className = "hb-media-player-progress";
        mediaPlayerProgressEl.hidden = true;
        const element11 = document.createElement("progress");
        element11.max = 1;
        element11.value = 0;
        const spanEl = document.createElement("span");
        const element12 = document.createElement("time");
        const element13 = document.createElement("time");
        spanEl.append(element12, element13);
        mediaPlayerProgressEl.append(element11, spanEl);
        mediaPlayerCopyEl.append(element9, element10, mediaPlayerProgressEl);
        element8.append(mediaPlayerArtworkEl, mediaPlayerCopyEl);
        const mediaPlayerActionsEl = document.createElement("div");
        mediaPlayerActionsEl.className = "hb-media-player-actions";
        const buildElementTree = (arg, serviceName) => {
          const element18 = document.createElement("button");
          element18.type = "button";
          element18.textContent = arg;
          element18.addEventListener("click", async () => {
            if (!preview) {
              element18.disabled = true;
              try {
                await this.callEntityService("media_player", serviceName, entityId);
              } catch (error) {
                this.options.onError?.(error);
              } finally {
                element18.disabled = false;
              }
            }
          });
          mediaPlayerActionsEl.append(element18);
          return element18;
        };
        const state9 = buildElementTree("上一曲", "media_previous_track");
        const element14 = buildElementTree("播放", "media_play_pause");
        const capabilityRangeGroupEl = buildElementTree("下一曲", "media_next_track");
        const capabilityRangeGroupEl1 = this.createMediaBrowserControl(entityId, {
          preview
        });
        state1.push(() => capabilityRangeGroupEl1.cleanup?.());
        const capabilityRangeGroupEl2 = document.createElement("section");
        capabilityRangeGroupEl2.className = "hb-capability-range-group";
        const capabilityRangeHeadingEl = document.createElement("div");
        capabilityRangeHeadingEl.className = "hb-capability-range-heading";
        const element15 = document.createElement("strong");
        element15.textContent = "音量";
        const element16 = document.createElement("output");
        capabilityRangeHeadingEl.append(element15, element16);
        const element17 = document.createElement("input");
        element17.type = "range";
        element17.min = "0";
        element17.max = "1";
        element17.step = ".01";
        element17.disabled = preview;
        capabilityRangeGroupEl2.append(capabilityRangeHeadingEl, element17);
        let showCustomPopupValue = "";
        let showCustomPopupValue1 = null;
        let showCustomPopupValue2 = 0;
        let showCustomPopupValue3 = null;
        let showCustomPopupValue4 = false;
        let showCustomPopupValue5 = null;
        let showCustomPopupValue6 = null;
        let showCustomPopupValue7 = null;
        let state10 = null;
        let state11 = false;
        let state12 = null;
        let state13 = null;
        const runHelper2 = arg => {
          const count = Math.max(0, Math.floor(Number(arg) || 0));
          return Math.floor(count / 60) + ":" + String(count % 60).padStart(2, "0");
        };
        const clampNumber = () => {
          if (!Number.isFinite(showCustomPopupValue1) || showCustomPopupValue1 <= 0) {
            mediaPlayerProgressEl.hidden = true;
            return;
          }
          let finiteNumber = Number.isFinite(showCustomPopupValue2) ? showCustomPopupValue2 : 0;
          if (showCustomPopupValue4 && Number.isFinite(showCustomPopupValue3)) {
            finiteNumber += Math.max(0, (Date.now() - showCustomPopupValue3) / 1000);
          }
          finiteNumber = Math.max(0, Math.min(showCustomPopupValue1, finiteNumber));
          mediaPlayerProgressEl.hidden = false;
          element11.max = showCustomPopupValue1;
          element11.value = finiteNumber;
          element12.textContent = runHelper2(finiteNumber);
          element13.textContent = runHelper2(showCustomPopupValue1);
        };
        const state14 = window.setInterval(clampNumber, 1000);
        state1.push(() => {
          window.clearInterval(state14);
          window.clearTimeout(state12);
          window.clearTimeout(state13);
        });
        mediaPlayerArtworkEl.addEventListener("error", () => {
          mediaPlayerArtworkEl.hidden = true;
          element8.classList.remove("has-artwork");
        });
        mediaPlayerArtworkEl.addEventListener("load", () => {
          mediaPlayerArtworkEl.hidden = false;
          element8.classList.add("has-artwork");
        });
        mediaSpeakerArtworkEl.addEventListener("error", () => {
          mediaSpeakerArtworkEl.hidden = true;
          element7.classList.remove("has-artwork");
        });
        mediaSpeakerArtworkEl.addEventListener("load", () => {
          mediaSpeakerArtworkEl.hidden = false;
          element7.classList.add("has-artwork");
        });
        const runHelper3 = (arg, right) => Number.isFinite(arg) && Number.isFinite(right) && Math.abs(arg - right) <= 0.005;
        const clampNumber1 = arg => {
          showCustomPopupValue5 = Math.max(0, Math.min(1, Number(arg) || 0));
          element17.value = String(showCustomPopupValue5);
          element16.textContent = Math.round(showCustomPopupValue5 * 100) + "%";
        };
        const state15 = async () => {
          window.clearTimeout(state12);
          state12 = null;
          if (state11 || state10 === null) {
            return;
          }
          const volume_level = state10;
          state10 = null;
          state11 = true;
          try {
            await this.callEntityService("media_player", "volume_set", entityId, {
              volume_level
            });
          } catch (error) {
            state10 = null;
            showCustomPopupValue7 = null;
            window.clearTimeout(state13);
            if (showCustomPopupValue6 !== null) {
              clampNumber1(showCustomPopupValue6);
            }
            this.options.onError?.(error);
          } finally {
            state11 = false;
            if (state10 !== null && !runHelper3(state10, volume_level)) {
              state12 = window.setTimeout(state15, 140);
            }
          }
        };
        const clamped = () => {
          const count = Math.max(0, Math.min(1, Number(element17.value) || 0));
          showCustomPopupValue7 = count;
          state10 = count;
          window.clearTimeout(state13);
          if (!state11) {
            window.clearTimeout(state12);
            state12 = window.setTimeout(state15, 120);
          }
        };
        element17.addEventListener("input", () => clampNumber1(element17.value));
        element17.addEventListener("change", clamped);
        const syncVisualState = entityState => {
          const numeric1 = entityState?.attributes || {};
          const asString = String(entityState?.state || "unknown").toLowerCase();
          const numeric = Number(numeric1.supported_features || 0);
          capabilityRangeGroupEl1.sync(entityState);
          const state16 = {
            off: "已关闭",
            on: "已开启",
            idle: "空闲",
            playing: "播放中",
            paused: "已暂停",
            buffering: "缓冲中",
            standby: "待机",
            unavailable: "不可用",
            unknown: "未知状态"
          };
          element6.textContent = state16[asString] || entityState?.state || "未知状态";
          element6.classList.toggle("is-live", ["playing", "paused"].includes(asString));
          element9.textContent = numeric1.media_title || numeric1.media_series_title || numeric1.app_name || numeric1.source || "暂无播放内容";
          element10.textContent = [numeric1.media_artist, numeric1.media_album_name].filter(Boolean).join(" · ") || numeric1.media_content_type || "媒体播放器";
          element14.textContent = asString === "playing" ? "暂停" : "播放";
          element14.disabled = preview || ["off", "unavailable", "unknown"].includes(asString);
          state9.disabled = preview || !(numeric & 16);
          capabilityRangeGroupEl.disabled = preview || !(numeric & 32);
          element7.classList.toggle("is-playing", asString === "playing");
          element7.classList.toggle("is-paused", asString === "paused");
          element7.classList.toggle("is-off", ["off", "unavailable", "unknown"].includes(asString));
          showCustomPopupValue1 = Number.isFinite(Number(numeric1.media_duration)) ? Number(numeric1.media_duration) : null;
          showCustomPopupValue2 = Number.isFinite(Number(numeric1.media_position)) ? Number(numeric1.media_position) : 0;
          const position = Date.parse(String(numeric1.media_position_updated_at || ""));
          showCustomPopupValue3 = Number.isFinite(position) ? position : null;
          showCustomPopupValue4 = asString === "playing";
          clampNumber();
          const numeric2 = Number(numeric1.volume_level);
          capabilityRangeGroupEl2.hidden = !Number.isFinite(numeric2);
          if (Number.isFinite(numeric2)) {
            if (showCustomPopupValue7 === null) {
              showCustomPopupValue6 = numeric2;
              clampNumber1(numeric2);
            } else if (runHelper3(numeric2, showCustomPopupValue7)) {
              showCustomPopupValue6 = numeric2;
              clampNumber1(showCustomPopupValue7);
              window.clearTimeout(state13);
              state13 = window.setTimeout(() => {
                showCustomPopupValue7 = null;
              }, 1800);
            } else {
              window.clearTimeout(state13);
            }
          }
          const trimmed = [numeric1.entity_picture_local, numeric1.entity_picture, numeric1.media_image_url].map(arg => String(arg || "").trim()).find(climateFanAutoEl => climateFanAutoEl.startsWith("/api/media_player_proxy/") || climateFanAutoEl.startsWith("/api/image_proxy/")) || "";
          if (trimmed !== showCustomPopupValue) {
            showCustomPopupValue = trimmed;
            mediaPlayerArtworkEl.hidden = !showCustomPopupValue;
            mediaSpeakerArtworkEl.hidden = !showCustomPopupValue;
            element8.classList.toggle("has-artwork", !!showCustomPopupValue);
            element7.classList.toggle("has-artwork", !!showCustomPopupValue);
            if (showCustomPopupValue) {
              mediaPlayerArtworkEl.src = showCustomPopupValue;
              mediaSpeakerArtworkEl.src = showCustomPopupValue;
            } else {
              mediaPlayerArtworkEl.removeAttribute("src");
              mediaSpeakerArtworkEl.removeAttribute("src");
            }
          }
        };
        element8.append(capabilityRangeGroupEl1.root);
        syncVisualState(customPopupModuleEl1);
        runHelper(entityId, syncVisualState);
        mediaPlayerDetailsBodyEl.append(element8, mediaPlayerActionsEl, capabilityRangeGroupEl2);
        state3.push(capabilityRangeGroupEl1.panel);
        element3.append(mediaPlayerDetailsBodyEl);
      } else {
        const element7 = document.createElement("p");
        element7.className = "hb-custom-popup-generic";
        const runHelper2 = arg => {
          element7.textContent = "当前状态：" + (arg?.state ?? "暂无状态");
        };
        runHelper2(customPopupModuleEl1);
        runHelper(entityId, runHelper2);
        element3.append(element7);
      }
      customPopupGridEl.append(element3);
    }
    if (!(popupId.modules || []).length) {
      const element3 = document.createElement("p");
      element3.className = "hb-custom-popup-generic";
      element3.textContent = "这个组合弹窗还没有添加模块。";
      customPopupGridEl.append(element3);
    }
    customPopupCardEl.append(customPopupHeadingEl, customPopupGridEl, ...state3);
    customPopupDialogEl.append(customPopupCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(customPopupDialogEl);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = customPopupDialogEl;
    const runHelper1 = arg => arg.map(candidate => {
      const state7 = candidate.type === "electric-bed" ? this.deviceProfile(this.runtimeEntityId(candidate.entityId)) : null;
      const state8 = state7?.deviceType === "electric-bed" ? state7.roles || {} : {};
      return [candidate.id, state7?.deviceType || candidate.type || "generic", "backrest", "leg", "waist", "mode", "memory1", "memory2"].map(candidate => String(candidate === candidate.id ? candidate.id : state8[candidate] || "")).join(":");
    }).join("|");
    const state6 = runHelper1(state);
    this.detailsStateSync = {
      customPopupDialogEl,
      handlers,
      refreshHistory: () => state5.forEach(refreshHistory => refreshHistory()),
      refreshEntityCatalog: () => {
        if (this.detailsDialog === customPopupDialogEl && !!customPopupDialogEl.open) {
          if (runHelper1(state) !== state6) {
            this.showCustomPopup(popupId, {
              preview
            });
          }
        }
      }
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, customPopupDialogEl, popupWidth, popupHeight);
    element2.addEventListener("click", () => customPopupDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, customPopupDialogEl, customPopupCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        customPopupDialogEl.close();
      }
    });
    customPopupDialogEl.addEventListener("close", () => {
      for (const runHelper2 of state1.splice(0)) {
        runHelper2();
      }
      this.clearRuntimeDialogScale(customPopupDialogEl);
      if (this.detailsDialog === customPopupDialogEl) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === customPopupDialogEl) {
        this.detailsStateSync = null;
      }
      if (!this.replacingDocument && this.activePopupId === String(popupId?.id || "")) {
        this.activePopupId = null;
        this.historyPopupGeneration += 1;
        this.connectRuntime();
        this.refreshHistorySeries();
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    customPopupDialogEl.show();
    this.refreshHistorySeries();
    for (const item of state2) {
      const state7 = playMediaSpeakerEntrance(item);
      if (state7) {
        state1.push(() => state7.cancel());
      }
    }
    for (const item of state4) {
      const state7 = playFixedDeviceDropEntrance(item.visual, item);
      if (state7) {
        state1.push(() => state7.cancel());
      }
    }
  }
  createLightDetailsControls(entityId, component, {
    interactive = true,
    onTurnOn = null,
    onVisualChange = null
  } = {}) {
    const numeric = component?.attributes || {};
    const brightness = entityId.startsWith("light.");
    const lightDetailsControlsEl = brightness && lightSupportsColor(numeric);
    const {
      brightness: supported,
      colorTemperature: supported2
    } = lightRealtimeCapabilities(entityId, component);
    const lightDetailsControlsEl1 = supported2 && !lightDetailsControlsEl;
    const element = document.createElement("section");
    element.className = "hb-light-details-controls";
    element.classList.toggle("has-color-picker", lightDetailsControlsEl);
    element.inert = !interactive;
    const index = new Map();
    const syncVisualState = ({
      label,
      value,
      minimum,
      maximum,
      step,
      suffix,
      dataKey,
      className = "",
      icon,
      minimumLabel,
      maximumLabel,
      supported: supported3 = true
    }) => {
      const element3 = document.createElement("label");
      element3.className = ("hb-light-details-slider " + className).trim();
      element3.classList.toggle("is-unavailable", !supported3);
      const lightDetailsSliderHeadingEl = document.createElement("span");
      lightDetailsSliderHeadingEl.className = "hb-light-details-slider-heading";
      const element4 = document.createElement("i");
      element4.className = "hb-light-details-slider-icon";
      element4.setAttribute("aria-hidden", "true");
      element4.textContent = icon;
      const element5 = document.createElement("strong");
      element5.textContent = label;
      const element6 = document.createElement("output");
      const count = Math.max(minimum, Math.min(maximum, value));
      element6.textContent = "" + Math.round(count) + suffix;
      lightDetailsSliderHeadingEl.append(element4, element5, element6);
      const controlInputEl3 = document.createElement("input");
      controlInputEl3.type = "range";
      controlInputEl3.min = String(minimum);
      controlInputEl3.max = String(maximum);
      controlInputEl3.step = String(step);
      controlInputEl3.value = String(count);
      controlInputEl3.disabled = !supported3;
      const updateSliderValue = ({
        notify = false
      } = {}) => {
        const brightnessPercent = Number(controlInputEl3.value);
        const brightness1 = (brightnessPercent - minimum) / Math.max(1, maximum - minimum) * 100;
        element6.textContent = supported3 ? "" + Math.round(brightnessPercent) + suffix : "不支持";
        controlInputEl3.style.setProperty("--hb-light-slider-progress", Math.max(0, Math.min(100, brightness1)) + "%");
        if (notify && supported3) {
          onVisualChange?.(dataKey === "brightness_pct" ? {
            brightnessPercent
          } : {
            colorTemperatureKelvin: brightnessPercent
          });
        }
      };
      updateSliderValue();
      controlInputEl3.addEventListener("input", () => {
        scheduleTimeout();
        updateSliderValue({
          notify: true
        });
      });
      controlInputEl3.addEventListener("change", async () => {
        if (!!interactive && !!supported3) {
          try {
            await this.callEntityService("light", "turn_on", entityId, {
              [dataKey]: Number(controlInputEl3.value)
            });
            onTurnOn?.();
          } catch (error) {
            this.options.onError?.(error);
            element6.textContent = "设置失败";
          }
        }
      });
      const lightDetailsSliderLegendEl = document.createElement("span");
      lightDetailsSliderLegendEl.className = "hb-light-details-slider-legend";
      const element7 = document.createElement("small");
      element7.textContent = minimumLabel;
      const element8 = document.createElement("small");
      element8.textContent = maximumLabel;
      lightDetailsSliderLegendEl.append(element7, element8);
      element3.append(lightDetailsSliderHeadingEl, controlInputEl3, lightDetailsSliderLegendEl);
      element.append(element3);
      index.set(dataKey, {
        controlInputEl3,
        updateSliderValue,
        supported: supported3
      });
    };
    let element2 = null;
    let color = null;
    let color1 = false;
    if (lightDetailsControlsEl) {
      const list = Array.isArray(numeric.hs_color) ? numeric.hs_color : rgbToHsColor(numeric.rgb_color) || [0, 100];
      color = {
        hue: Number(list[0]) || 0,
        saturation: Number(list[1]) || 0
      };
      element2 = document.createElement("div");
      element2.className = "hb-light-color-picker";
      element2.setAttribute("role", "slider");
      element2.setAttribute("tabindex", interactive ? "0" : "-1");
      element2.setAttribute("aria-label", "选择灯光颜色");
      const lightColorPickerGlowEl = document.createElement("i");
      lightColorPickerGlowEl.className = "hb-light-color-picker-glow";
      const lightColorPickerHandleEl = document.createElement("i");
      lightColorPickerHandleEl.className = "hb-light-color-picker-handle";
      element2.append(lightColorPickerGlowEl, lightColorPickerHandleEl);
      const runHelper1 = () => lightColorPickerPointFromHs([color.hue, color.saturation]);
      const syncAriaState = ({
        hue = color.hue,
        saturation = color.saturation
      } = {}) => {
        color.hue = ((Number(hue) || 0) % 360 + 360) % 360;
        color.saturation = Math.max(0, Math.min(100, Number(saturation) || 0));
        const color2 = runHelper1();
        const colorRgb = hsToRgbColor([color.hue, color.saturation]);
        const color3 = "rgb(" + colorRgb.join(",") + ")";
        element2.style.setProperty("--hb-light-color-picker-x", color2.x * 100 + "%");
        element2.style.setProperty("--hb-light-color-picker-y", color2.y * 100 + "%");
        element2.style.setProperty("--hb-light-color-picker-color", color3);
        element2.setAttribute("aria-valuetext", "色相 " + Math.round(color.hue) + " 度，饱和度 " + Math.round(color.saturation) + "%");
        onVisualChange?.({
          colorHs: [color.hue, color.saturation],
          colorRgb
        });
      };
      const measureElementBox = event1 => {
        const domRect = element2.getBoundingClientRect();
        if (!domRect.width || !domRect.height) {
          return;
        }
        const count = Math.max(0, Math.min(1, (event1.clientX - domRect.left) / domRect.width));
        const count2 = Math.max(0, Math.min(1, (event1.clientY - domRect.top) / domRect.height));
        const [hue, saturation] = lightColorPickerHsFromPoint(count, count2);
        syncAriaState({
          hue,
          saturation
        });
      };
      const syncAriaState1 = async () => {
        if (!!interactive && !color1) {
          color1 = true;
          element2.setAttribute("aria-busy", "true");
          try {
            await this.callEntityService("light", "turn_on", entityId, lightColorServiceData(numeric, [color.hue, color.saturation]));
            onTurnOn?.();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            color1 = false;
            element2.removeAttribute("aria-busy");
          }
        }
      };
      element2.addEventListener("pointerdown", event => {
        if (interactive) {
          element2.setPointerCapture?.(event.pointerId);
          element2.dataset.dragging = "true";
          measureElementBox(event);
          event.preventDefault();
        }
      });
      element2.addEventListener("pointermove", arg => {
        if (element2.dataset.dragging === "true") {
          measureElementBox(arg);
        }
      });
      const state3 = async event1 => {
        if (element2.dataset.dragging === "true") {
          element2.dataset.dragging = "false";
          element2.releasePointerCapture?.(event1.pointerId);
          await syncAriaState1();
        }
      };
      element2.addEventListener("pointerup", state3);
      element2.addEventListener("pointercancel", state3);
      element2.addEventListener("keydown", async event => {
        if (!interactive) {
          return;
        }
        const event1 = event.shiftKey ? 10 : 3;
        let {
          hue,
          saturation
        } = color;
        if (event.key === "ArrowLeft") {
          hue -= event1;
        } else if (event.key === "ArrowRight") {
          hue += event1;
        } else if (event.key === "ArrowUp") {
          saturation -= event1;
        } else if (event.key === "ArrowDown") {
          saturation += event1;
        } else if (event.key === "Enter" || event.key === " ") {
          await syncAriaState1();
          event.preventDefault();
          return;
        } else {
          return;
        }
        syncAriaState({
          hue,
          saturation
        });
        event.preventDefault();
      });
      element2.syncColorPicker = syncAriaState;
      element2.cleanupColorPicker = () => {
        element2.dataset.dragging = "false";
      };
      syncAriaState();
      element.append(element2);
    }
    const finiteNumber = Number.isFinite(Number(numeric.max_mireds)) ? 1000000 / Number(numeric.max_mireds) : 2000;
    const finiteNumber1 = Number.isFinite(Number(numeric.min_mireds)) ? 1000000 / Number(numeric.min_mireds) : 6500;
    const asNumber = Number(numeric.min_color_temp_kelvin) || finiteNumber;
    const asNumber1 = Number(numeric.max_color_temp_kelvin) || finiteNumber1;
    const finiteNumber2 = Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : asNumber;
    const asNumber2 = Number(numeric.color_temp_kelvin) || finiteNumber2;
    if (!lightDetailsControlsEl) {
      syncVisualState({
        label: "色温",
        value: asNumber2,
        minimum: Math.round(asNumber),
        maximum: Math.round(asNumber1),
        step: 50,
        suffix: "K",
        dataKey: "color_temp_kelvin",
        className: "hb-light-details-temperature",
        icon: "♨",
        minimumLabel: "暖色",
        maximumLabel: "冷色",
        supported: supported2
      });
    }
    const finiteNumber3 = Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : 100;
    syncVisualState({
      label: "亮度",
      value: finiteNumber3,
      minimum: 1,
      maximum: 100,
      step: 1,
      suffix: "%",
      dataKey: "brightness_pct",
      className: "hb-light-details-brightness",
      icon: "☀",
      minimumLabel: "暗",
      maximumLabel: "亮",
      supported
    });
    let state = null;
    let state1 = 0;
    let state2 = component;
    const scheduleTimeout = ({
      resync = false
    } = {}) => {
      window.clearTimeout(state1);
      state1 = 0;
      state = null;
      if (resync) {
        element.syncLightState?.(state2);
      }
    };
    const scheduleTimeout1 = () => {
      window.clearTimeout(state1);
      state1 = 0;
      if (!state) {
        return;
      }
      const nowMs = Date.now();
      const state3 = lightPresetPendingDecision(state, nowMs);
      if (state3 === "confirmed" || state3 === "timeout") {
        scheduleTimeout({
          resync: true
        });
        return;
      }
      const clamped = state.latestMatches ? Math.min(state.expiresAt, Math.max(state.minimumHoldUntil, state.matchStartedAt + LIGHT_PRESET_STABLE_CONFIRMATION_MS)) : state.expiresAt;
      state1 = window.setTimeout(scheduleTimeout1, Math.max(50, clamped - nowMs));
    };
    const lightDetailsPresetsEl = LIGHT_DETAIL_PRESET_DEFINITIONS;
    const runHelper = lightDetailsPresetsEl2 => relativeLightColorTemperature(asNumber, asNumber1, lightDetailsPresetsEl2.colorTemperaturePercent);
    const lightDetailsPresetsEl1 = document.createElement("div");
    lightDetailsPresetsEl1.className = "hb-light-details-presets";
    lightDetailsPresetsEl1.hidden = lightDetailsControlsEl || !supported && !lightDetailsControlsEl1;
    const event = lightDetailsPresetsEl.map(arg => {
      const actionButtonEl = document.createElement("button");
      actionButtonEl.type = "button";
      actionButtonEl.disabled = !brightness;
      const element3 = document.createElement("strong");
      element3.textContent = arg.label;
      const element4 = document.createElement("small");
      element4.textContent = supported ? arg.detail : "开启";
      actionButtonEl.append(element3, element4);
      actionButtonEl.addEventListener("click", async () => {
        if (!interactive || !brightness) {
          return;
        }
        const colorTemperatureKelvin = runHelper(arg);
        const size = {};
        if (supported) {
          Object.assign(size, lightPresetBrightnessServiceData(arg.brightnessPercent));
        }
        if (lightDetailsControlsEl1) {
          size.color_temp_kelvin = Math.round(colorTemperatureKelvin);
        }
        window.clearTimeout(state1);
        const nowMs = Date.now();
        state = {
          brightnessPercent: arg.brightnessPercent,
          colorTemperatureKelvin,
          minimumHoldUntil: nowMs + LIGHT_PRESET_MINIMUM_HOLD_MS,
          expiresAt: nowMs + LIGHT_PRESET_MAXIMUM_HOLD_MS,
          latestMatches: false,
          matchStartedAt: null
        };
        scheduleTimeout1();
        const brightness1 = index.get("brightness_pct");
        if (brightness1?.supported) {
          brightness1.input.value = String(arg.brightnessPercent);
          brightness1.updateSliderValue({
            notify: true
          });
        }
        const temperature = index.get("color_temp_kelvin");
        if (temperature?.supported) {
          temperature.input.value = String(colorTemperatureKelvin);
          temperature.updateSliderValue({
            notify: true
          });
        }
        for (const event1 of event) {
          event1.button.classList.toggle("is-active", event1.button === actionButtonEl);
        }
        onVisualChange?.({
          isOn: true,
          ...(supported ? {
            brightnessPercent: arg.brightnessPercent
          } : {}),
          ...(lightDetailsControlsEl1 ? {
            colorTemperatureKelvin
          } : {})
        });
        onTurnOn?.();
        try {
          await this.callEntityService("light", "turn_on", entityId, size);
        } catch (error) {
          scheduleTimeout({
            resync: true
          });
          actionButtonEl.classList.remove("is-active");
          this.options.onError?.(error);
        }
      });
      lightDetailsPresetsEl1.append(actionButtonEl);
      return {
        actionButtonEl,
        ...arg
      };
    });
    element.append(lightDetailsPresetsEl1);
    const syncLightControl = entityState => {
      const numeric1 = entityState?.attributes || {};
      const brightness1 = entityState?.state === "on";
      const finiteNumber4 = Number.isFinite(Number(numeric1.brightness)) ? Number(numeric1.brightness) / 255 * 100 : NaN;
      const finiteNumber5 = Number.isFinite(Number(numeric1.color_temp)) ? 1000000 / Number(numeric1.color_temp) : NaN;
      const event1 = Number(numeric1.color_temp_kelvin) || finiteNumber5;
      for (const event2 of event) {
        const event3 = runHelper(event2);
        const count = Math.max(50, (asNumber1 - asNumber) * 0.06);
        const finiteNumber6 = !supported || Number.isFinite(finiteNumber4) && Math.abs(finiteNumber4 - event2.brightnessPercent) <= 4;
        const finiteNumber7 = !lightDetailsControlsEl1 || Number.isFinite(event1) && Math.abs(event1 - event3) <= count;
        event2.button.classList.toggle("is-active", brightness1 && finiteNumber6 && finiteNumber7);
      }
    };
    syncLightControl(component);
    element.syncLightState = entityState => {
      if (!entityState) {
        return;
      }
      state2 = entityState;
      const numeric1 = entityState.attributes || {};
      const temperature = index.get("color_temp_kelvin");
      const finiteNumber4 = Number.isFinite(Number(numeric1.color_temp)) ? 1000000 / Number(numeric1.color_temp) : NaN;
      const asNumber3 = Number(numeric1.color_temp_kelvin) || finiteNumber4;
      const brightness1 = index.get("brightness_pct");
      const finiteNumber5 = Number.isFinite(Number(numeric1.brightness)) ? Number(numeric1.brightness) / 255 * 100 : NaN;
      if (state) {
        const finiteNumber6 = !supported || Number.isFinite(finiteNumber5) && Math.abs(finiteNumber5 - state.brightnessPercent) <= 4;
        const finiteNumber7 = !lightDetailsControlsEl1 || Number.isFinite(asNumber3) && Math.abs(asNumber3 - state.colorTemperatureKelvin) <= 220;
        const state3 = finiteNumber6 && finiteNumber7;
        if (state3 && !state.latestMatches) {
          state.matchStartedAt = Date.now();
        }
        if (!state3) {
          state.matchStartedAt = null;
        }
        state.latestMatches = state3;
        scheduleTimeout1();
      }
      const brightness2 = state?.colorTemperatureKelvin ?? asNumber3;
      const brightness3 = state?.brightnessPercent ?? finiteNumber5;
      if (temperature?.supported && Number.isFinite(brightness2)) {
        temperature.input.value = String(brightness2);
        temperature.updateSliderValue();
      }
      if (brightness1?.supported && Number.isFinite(brightness3)) {
        brightness1.input.value = String(brightness3);
        brightness1.updateSliderValue();
      }
      if (element2) {
        const list = Array.isArray(numeric1.hs_color) ? numeric1.hs_color : rgbToHsColor(numeric1.rgb_color);
        if (list) {
          element2.syncColorPicker({
            hue: list[0],
            saturation: list[1]
          });
        }
      }
      syncLightControl(state ? {
        state: "on",
        attributes: {
          ...numeric1,
          ...(supported ? {
            brightness: state.brightnessPercent / 100 * 255
          } : {}),
          ...(lightDetailsControlsEl1 ? {
            color_temp_kelvin: state.colorTemperatureKelvin
          } : {})
        }
      } : entityState);
      const colorTemperatureKelvin = lightVisualValueForCapability(lightDetailsControlsEl1, brightness2, UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN);
      const brightnessPercent = lightVisualValueForCapability(supported, brightness3, UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT);
      onVisualChange?.({
        isOn: entityState.state === "on",
        colorTemperatureKelvin,
        brightnessPercent
      });
    };
    element.syncLightState(component);
    element.cleanupLightDetails = () => {
      scheduleTimeout();
      element2?.cleanupColorPicker?.();
    };
    return element;
  }
  createCoverDetailsControls(entityId, component, {
    interactive = true,
    dream = false,
    airer = false,
    tilt = false,
    motorReversed = false,
    positionState = null,
    positionCommandEntityId = "",
    positionCommandState = null,
    motorState = null,
    airerActionEntityIds = {},
    positionCalibration = {},
    onVisualChange = null,
    onCurtainPositionChange = null
  } = {}) {
    const coverDetailsControlsEl = document.createElement("section");
    coverDetailsControlsEl.className = "hb-cover-details-controls";
    coverDetailsControlsEl.inert = !interactive;
    const coverDetailsPositionEl = document.createElement("label");
    coverDetailsPositionEl.className = "hb-cover-details-position";
    const coverDetailsPositionHeadingEl = document.createElement("span");
    coverDetailsPositionHeadingEl.className = "hb-cover-details-position-heading";
    const element = document.createElement("strong");
    element.textContent = dream ? "叶片角度" : airer ? "晾杆高度" : "开合位置";
    const element2 = document.createElement("output");
    coverDetailsPositionHeadingEl.append(element, element2);
    const element3 = document.createElement("input");
    element3.type = "range";
    element3.min = "0";
    element3.max = "100";
    element3.step = "1";
    const coverDetailsPositionLegendEl = document.createElement("span");
    coverDetailsPositionLegendEl.className = "hb-cover-details-position-legend";
    if (dream) {
      coverDetailsPositionLegendEl.append(Object.assign(document.createElement("small"), {
        textContent: "0 · 一侧闭合"
      }), Object.assign(document.createElement("small"), {
        textContent: "50 · 90°打开"
      }), Object.assign(document.createElement("small"), {
        textContent: "100 · 反向闭合"
      }));
    } else if (airer) {
      coverDetailsPositionLegendEl.append(Object.assign(document.createElement("small"), {
        textContent: "下降"
      }), Object.assign(document.createElement("small"), {
        textContent: "升起"
      }));
    } else {
      coverDetailsPositionLegendEl.append(Object.assign(document.createElement("small"), {
        textContent: "关闭"
      }), Object.assign(document.createElement("small"), {
        textContent: "打开"
      }));
    }
    coverDetailsPositionEl.append(coverDetailsPositionHeadingEl, element3, coverDetailsPositionLegendEl);
    const coverDetailsActionsEl = document.createElement("div");
    coverDetailsActionsEl.className = "hb-cover-details-actions";
    const size = "open_cover";
    const service = "stop_cover";
    const size1 = "close_cover";
    const service2 = motorReversed ? size : size1;
    const service3 = motorReversed ? size1 : size;
    let retracted = dreamCurtainIsRetracted(component?.state, motorReversed);
    const state = (dream ? [{
      label: "关闭",
      icon: "←",
      service: service2,
      curtainRetracted: false
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service
    }, {
      label: "开启",
      icon: "→",
      service: service3,
      curtainRetracted: true
    }] : airer ? [{
      label: "下降",
      icon: "↓",
      service: service2,
      action: "down"
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service,
      action: "pause"
    }, {
      label: "升起",
      icon: "↑",
      service: service3,
      action: "up"
    }] : [{
      label: "关闭",
      icon: "←",
      service: service2
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service
    }, {
      label: "打开",
      icon: "→",
      service: service3
    }]).map(arg => {
      const element4 = document.createElement("button");
      element4.type = "button";
      element4.dataset.coverAction = arg.service;
      const element5 = document.createElement("i");
      element5.textContent = arg.icon;
      element5.setAttribute("aria-hidden", "true");
      const element6 = document.createElement("strong");
      element6.textContent = arg.label;
      element4.append(element5, element6);
      element4.addEventListener("click", async () => {
        if (interactive) {
          if (dream && typeof arg.curtainRetracted == "boolean") {
            coverDetailsControlsEl.beginDreamCurtainMotion?.(arg.curtainRetracted);
          }
          if (!dream && arg.service === service3) {
            coverDetailsControlsEl.beginCoverMotion?.(100, "opening");
          } else if (!dream && arg.service === service2) {
            coverDetailsControlsEl.beginCoverMotion?.(0, "closing");
          } else {
            coverDetailsControlsEl.stopCoverMotion?.();
          }
          element4.classList.add("is-pending");
          try {
            const state7 = airer && arg.action ? airerActionEntityIds[arg.action] : "";
            if (airer && positionCommandEntityId && ["up", "down"].includes(arg.action)) {
              const state8 = arg.action === "up" ? 100 : 0;
              const state9 = airerDevicePosition(state8, positionCalibration);
              await this.callEntityService("number", "set_value", positionCommandEntityId, {
                value: state9
              });
            } else if (airer && arg.action === "pause") {
              await this.callEntityService("cover", service, entityId);
            } else if (state7) {
              await this.callEntityService("button", "press", state7);
            } else {
              await this.callEntityService("cover", arg.service, entityId);
            }
          } catch (error) {
            coverDetailsControlsEl.cancelDreamCurtainMotion?.();
            coverDetailsControlsEl.cancelCoverMotion?.();
            coverDetailsControlsEl.syncCoverState?.(component);
            this.options.onError?.(error);
          } finally {
            element4.classList.remove("is-pending");
          }
        }
      });
      coverDetailsActionsEl.append(element4);
      return element4;
    });
    let state1 = positionState;
    let state2 = positionCommandState;
    let numeric = motorState;
    const runHelper = () => {
      if (airer) {
        learnAirerPositionCalibration(positionCalibration, state1?.state, state2?.state, numeric?.state);
      }
    };
    runHelper();
    let text = String(component?.state || "");
    const resolveCoverPosition = entityState => {
      const state7 = airer ? airerReportedPosition(state1, entityState, positionCalibration) : Number(entityState?.attributes?.[tilt ? "current_tilt_position" : "current_position"]);
      if (Number.isFinite(state7)) {
        const count = Math.max(0, Math.min(100, state7));
        if (airer) {
          return airerPresentationPositionForState(count, text || entityState?.state, positionCalibration, motorReversed);
        } else {
          return count;
        }
      }
      if (entityState?.state === "open") {
        return 100;
      } else {
        return 0;
      }
    };
    let position1 = component;
    let position2 = resolveCoverPosition(component);
    let position = position2;
    let position3 = false;
    let state3 = 0;
    let state4 = null;
    let state5 = null;
    let state6 = 0;
    let event = null;
    const runHelper1 = () => {
      window.cancelAnimationFrame(state3);
      state3 = 0;
    };
    const syncVisualState = (arg, state = "") => {
      position = Math.max(0, Math.min(100, Number(arg) || 0));
      element3.value = String(position);
      element3.style.setProperty("--hb-cover-position-progress", position + "%");
      element2.textContent = Math.round(position) + "%";
      for (const element4 of state) {
        element4.classList.toggle("is-active", element4.dataset.coverAction === (state === "opening" ? size : state === "closing" ? size1 : ""));
      }
      onVisualChange?.({
        position,
        state
      });
    };
    coverDetailsControlsEl.setDreamCurtainRetracted = (arg, flag = false) => {
      if (dream) {
        retracted = !!arg;
        element3.disabled = !interactive;
        onCurtainPositionChange?.({
          retracted,
          moving: !!flag
        });
      }
    };
    coverDetailsControlsEl.isDreamCurtainRetracted = () => retracted;
    coverDetailsControlsEl.beginDreamCurtainMotion = arg => {
      if (dream) {
        event = {
          target: !!arg,
          expiresAt: Date.now() + 10000
        };
        coverDetailsControlsEl.setDreamCurtainRetracted?.(event.target, true);
      }
    };
    coverDetailsControlsEl.cancelDreamCurtainMotion = () => {
      event = null;
    };
    coverDetailsControlsEl.beginCoverMotion = (arg, state) => {
      runHelper1();
      state5 = null;
      state6 = 0;
      const initialPosition = position;
      const target = Math.max(0, Math.min(100, Number(arg) || 0));
      state4 = {
        direction: target >= initialPosition ? 1 : -1,
        target,
        state,
        initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (airer ? 120000 : 10000)
      };
      const state7 = performance.now();
      const count = Math.max(900, Math.abs(target - initialPosition) * 28);
      const state8 = item => {
        const state9 = Math.min(1, (item - state7) / count);
        const state10 = 1 - (1 - state9) ** 3;
        syncVisualState(initialPosition + (target - initialPosition) * state10, state);
        if (state9 < 1) {
          state3 = window.requestAnimationFrame(state8);
        } else {
          state3 = 0;
        }
      };
      syncVisualState(initialPosition, state);
      state3 = window.requestAnimationFrame(state8);
    };
    coverDetailsControlsEl.stopCoverMotion = () => {
      runHelper1();
      state4 = null;
      syncVisualState(position, "");
    };
    coverDetailsControlsEl.cancelCoverMotion = () => {
      runHelper1();
      state4 = null;
    };
    coverDetailsControlsEl.holdCoverPosition = arg => {
      runHelper1();
      state5 = null;
      state6 = 0;
      const target = Math.max(0, Math.min(100, Number(arg) || 0));
      const initialPosition = position2;
      const direction = target >= initialPosition ? 1 : -1;
      const state = dream || Math.abs(target - initialPosition) < 0.5 ? "" : direction > 0 ? "opening" : "closing";
      state4 = {
        direction,
        target,
        state,
        initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (airer ? 120000 : 10000)
      };
      syncVisualState(target, state);
    };
    const runHelper2 = (arg, {
      primary = false
    } = {}) => {
      if (primary) {
        position1 = arg || position1;
        text = String(arg?.state || text);
      }
      if (state5 !== null && Date.now() >= state6) {
        state5 = null;
        state6 = 0;
      }
      const state7 = airer && state5 !== null ? state5 : resolveCoverPosition(arg);
      position2 = state7;
      const text2 = String(arg?.state || "");
      if (dream) {
        const physicalState = physicalCoverState(text2, motorReversed);
        const event1 = dreamCurtainIsRetracted(text2, motorReversed);
        if (event && event1 === event.target) {
          const target = event.target;
          event = null;
          coverDetailsControlsEl.setDreamCurtainRetracted?.(target, false);
        } else if (event && Date.now() < event.expiresAt) {
          coverDetailsControlsEl.setDreamCurtainRetracted?.(event.target, true);
        } else {
          event = null;
          coverDetailsControlsEl.setDreamCurtainRetracted?.(event1, physicalState === "opening" || physicalState === "closing");
        }
      }
      if (!position3) {
        if (state4) {
          const nowMs = Date.now();
          const {
            direction,
            target,
            state: state8
          } = state4;
          const state9 = coverPositionReachedTarget(state7, target, direction);
          const state10 = target <= 0.5 && text2 === "closed" || target >= 99.5 && text2 === "open";
          const numeric = Number(numeric?.state);
          const finiteNumber = airer && state4.sawMotorRunning && Number.isFinite(numeric) && Math.abs(numeric) < 0.5;
          if (airer ? state10 || finiteNumber && state9 : state9 || state10 || target >= 99.5 && state7 >= 99.5) {
            runHelper1();
            if (airer) {
              state5 = target;
              state6 = Date.now() + 120000;
            }
            state4 = null;
            syncVisualState(target, text2 || (direction < 0 ? "closed" : "open"));
            return;
          }
          if (direction < 0 ? state7 < state4.lastServerPosition - 0.5 || text2 === "closing" : state7 > state4.lastServerPosition + 0.5 || text2 === "opening") {
            state4.lastServerPosition = direction < 0 ? Math.min(state4.lastServerPosition, state7) : Math.max(state4.lastServerPosition, state7);
            const position4 = coverPendingDisplayPosition(position, state7, direction);
            syncVisualState(position4, state8);
            return;
          }
          if (nowMs < state4.ignoreStaleUntil || airer && nowMs < state4.expiresAt || nowMs < state4.expiresAt && Math.abs(state7 - state4.initialPosition) < 0.5) {
            return;
          }
          runHelper1();
          state4 = null;
        } else {
          runHelper1();
        }
        syncVisualState(state7, text2);
      }
    };
    element3.addEventListener("pointerdown", () => {
      position3 = true;
      runHelper1();
      state4 = null;
    });
    element3.addEventListener("input", () => {
      position3 = true;
      runHelper1();
      state4 = null;
      const numeric = Number(element3.value);
      syncVisualState(numeric, dream ? "" : numeric > 0 ? "open" : "closed");
    });
    element3.addEventListener("change", async () => {
      position3 = false;
      if (!interactive) {
        return;
      }
      const numeric = Number(element3.value);
      const state7 = airerDevicePosition(numeric, positionCalibration);
      coverDetailsControlsEl.holdCoverPosition(numeric);
      try {
        if (airer && positionCommandEntityId) {
          await this.callEntityService("number", "set_value", positionCommandEntityId, {
            value: state7
          });
        } else {
          await this.callEntityService("cover", tilt ? "set_cover_tilt_position" : "set_cover_position", entityId, {
            [tilt ? "tilt_position" : "position"]: numeric
          });
        }
      } catch (error) {
        coverDetailsControlsEl.cancelCoverMotion();
        runHelper2(position1);
        this.options.onError?.(error);
      }
    });
    element3.addEventListener("pointercancel", () => {
      position3 = false;
      runHelper2(position1);
    });
    coverDetailsControlsEl.append(coverDetailsPositionEl, coverDetailsActionsEl);
    coverDetailsControlsEl.syncCoverState = arg => runHelper2(arg, {
      primary: true
    });
    coverDetailsControlsEl.syncCoverPositionState = arg => {
      state1 = arg || state1;
      runHelper();
      runHelper2(position1);
    };
    coverDetailsControlsEl.syncCoverPositionCommandState = arg => {
      state2 = arg || state2;
      runHelper();
      runHelper2(position1);
    };
    coverDetailsControlsEl.syncAirerMotorState = arg => {
      numeric = arg || numeric;
      const motorState = Number(numeric?.state);
      if (state4 && Number.isFinite(motorState) && Math.abs(motorState) >= 0.5) {
        state4.sawMotorRunning = true;
      }
      runHelper();
      runHelper2(position1);
    };
    coverDetailsControlsEl.cleanupCoverDetails = () => {
      runHelper1();
      state4 = null;
      event = null;
      position3 = false;
    };
    runHelper2(component, {
      primary: true
    });
    return coverDetailsControlsEl;
  }
  createClimateDetailsControls(entityId, component, {
    interactive = true,
    onPowerChange = null,
    onVisualChange = null,
    modeColors = {},
    deviceType = "air-conditioner"
  } = {}) {
    const climateCapabilities = normalizeClimateCapabilities(component);
    const attributes = climateCapabilities.attributes;
    const climateDetailsControlsEl = String(entityId || "").split(".", 1)[0];
    const climateDetailsControlsEl1 = {
      entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations
    };
    const element = document.createElement("section");
    element.className = "hb-climate-details-controls";
    element.dataset.climateDeviceType = deviceType;
    element.dataset.climateStructureKey = climateControlStructureKey(entityId, component, deviceType);
    element.inert = !interactive;
    const currentTemperature = climateCapabilities.currentTemperature;
    const targetTemperature = climateCapabilities.targetTemperature;
    const minimumTemperature = climateCapabilities.minimumTemperature;
    const maximumTemperature = climateCapabilities.maximumTemperature;
    const temperatureStep = climateCapabilities.temperatureStep;
    const temperature = ["climate", "water_heater"].includes(climateDetailsControlsEl) && climateCapabilities.supportsTargetTemperature;
    const temperature1 = climateDetailsControlsEl === "water_heater";
    element.classList.toggle("without-temperature", !temperature);
    let previous = temperature ? targetTemperature : minimumTemperature;
    let state = null;
    let state1 = null;
    let state2 = null;
    const scheduleTimeout = () => {
      state = null;
      window.clearTimeout(state1);
      window.clearTimeout(state2);
      state1 = null;
      state2 = null;
    };
    const scheduleTimeout1 = arg => {
      state = arg;
      window.clearTimeout(state1);
      window.clearTimeout(state2);
      state2 = null;
      state1 = window.setTimeout(() => {
        state = null;
        state1 = null;
      }, 8000);
    };
    const scheduleTimeout2 = () => {
      window.clearTimeout(state2);
      state2 = window.setTimeout(scheduleTimeout, 2500);
    };
    const climateThermostatEl = document.createElement("section");
    climateThermostatEl.className = "hb-climate-thermostat";
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.className = "hb-climate-temperature-step";
    element2.textContent = "−";
    element2.setAttribute("aria-label", "降低设定温度");
    const element3 = document.createElement("div");
    element3.className = "hb-climate-temperature-dial";
    const climateArcCapEl = document.createElement("i");
    climateArcCapEl.className = "hb-climate-arc-cap start";
    climateArcCapEl.setAttribute("aria-hidden", "true");
    const climateArcCapEl1 = document.createElement("i");
    climateArcCapEl1.className = "hb-climate-arc-cap end";
    climateArcCapEl1.setAttribute("aria-hidden", "true");
    const climateTemperatureThumbEl = document.createElement("button");
    climateTemperatureThumbEl.type = "button";
    climateTemperatureThumbEl.className = "hb-climate-temperature-thumb";
    climateTemperatureThumbEl.setAttribute("aria-label", "拖动调节设定温度");
    const climateTemperatureContentEl = document.createElement("div");
    climateTemperatureContentEl.className = "hb-climate-temperature-content";
    const element4 = document.createElement("small");
    element4.textContent = "设定温度";
    const element5 = document.createElement("strong");
    const element6 = document.createElement("span");
    element6.textContent = Number.isFinite(currentTemperature) ? "当前温度 " + currentTemperature + "°C" : "当前温度 --";
    climateTemperatureContentEl.append(element4, element5, element6);
    element3.append(climateArcCapEl, climateArcCapEl1, climateTemperatureThumbEl, climateTemperatureContentEl);
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.className = "hb-climate-temperature-step";
    element7.textContent = "+";
    element7.setAttribute("aria-label", "提高设定温度");
    let entityState = component;
    const syncClimateControl = arg => climateEffectMode(arg, deviceType);
    const syncClimateControl1 = (arg = entityState) => {
      entityState = arg || entityState;
      const visualMode = syncClimateControl(entityState);
      const count = Math.max(0, Math.min(1, (previous - minimumTemperature) / Math.max(temperatureStep, maximumTemperature - minimumTemperature)));
      const state12 = visualMode === "cool" ? modeColors.cool || "#73c8ff" : visualMode === "heat" ? modeColors.heat || "#ff8a65" : modeColors.other || "#dce2e6";
      const accentColor = visualMode === "off" ? "#65717a" : visualMode === "cool" ? lerpHexColor(state12, "#ffffff", count * 0.32) : visualMode === "heat" ? lerpHexColor(state12, "#ffffff", (1 - count) * 0.3) : state12;
      element.dataset.climateVisualMode = visualMode;
      if (visualMode !== "off") {
        element.dataset.lastClimateMode = String(entityState?.state || "auto");
      }
      const accentSoft = lerpHexColor(accentColor, "#11171c", 0.72);
      element.style.setProperty("--hb-climate-accent", accentColor);
      element.style.setProperty("--hb-climate-accent-soft", accentSoft);
      const running = climateIsRunning(entityState, deviceType);
      element.classList.toggle("is-running", running);
      onVisualChange?.({
        mode: climatePresentationMode(entityState, deviceType),
        visualMode,
        running,
        accentColor,
        accentSoft,
        targetTemperature: temperature ? previous : null
      });
      const currentTemperature2 = normalizeClimateCapabilities(entityState).currentTemperature;
      element6.textContent = currentTemperature2 !== null ? "当前温度 " + currentTemperature2 + "°C" : "当前温度 --";
      const syncClimateControl3 = climateService => climateService === "set_hvac_mode" ? entityState?.state : climateService === "set_fan_mode" ? entityState?.attributes?.fan_mode : climateService === "set_swing_mode" ? entityState?.attributes?.swing_mode : climateService === "set_swing_horizontal_mode" ? entityState?.attributes?.swing_horizontal_mode : climateService === "set_preset_mode" ? entityState?.attributes?.preset_mode : climateService === "set_operation_mode" ? entityState?.attributes?.operation_mode : null;
      for (const element8 of element.querySelectorAll("button[data-climate-service]")) {
        const climateService = element8.dataset.climateService;
        const state13 = syncClimateControl3(climateService);
        element8.classList.toggle("active", element8.dataset.climateValue === String(state13 ?? ""));
      }
      for (const item of element.querySelectorAll(".hb-climate-select[data-climate-service]")) {
        const text = String(syncClimateControl3(item.dataset.climateService) ?? "");
        item.dataset.currentValue = text;
        const element8 = Array.from(item.querySelectorAll("[role=\"option\"]")).find(optionEl => optionEl.dataset.value === text);
        const element9 = item.querySelector(".hb-climate-select-trigger > span");
        if (element9) {
          element9.textContent = element8?.textContent || text || "请选择";
          element9.title = element9.textContent;
        }
        item.querySelectorAll("[role=\"option\"]").forEach(element10 => {
          const state13 = element10.dataset.value === text;
          element10.classList.toggle("active", state13);
          element10.setAttribute("aria-selected", String(state13));
        });
      }
    };
    const syncAriaState = (arg = false) => {
      element5.innerHTML = temperature ? previous + "<small>°C</small>" : "--";
      const temperature2 = (previous - minimumTemperature) / Math.max(temperatureStep, maximumTemperature - minimumTemperature) * 75;
      const count = Math.max(0, Math.min(75, temperature2));
      element3.style.setProperty("--hb-climate-temperature-progress", count + "%");
      element3.style.setProperty("--hb-climate-thumb-angle", 225 + count / 75 * 270 + "deg");
      climateTemperatureThumbEl.setAttribute("aria-valuemin", String(minimumTemperature));
      climateTemperatureThumbEl.setAttribute("aria-valuemax", String(maximumTemperature));
      climateTemperatureThumbEl.setAttribute("aria-valuenow", String(previous));
      climateTemperatureThumbEl.setAttribute("aria-valuetext", previous + "°C");
      const count2 = Math.max(0.001, temperatureStep / 2);
      element2.disabled = !temperature || previous <= minimumTemperature + count2;
      element7.disabled = !temperature || previous >= maximumTemperature - count2;
      element2.title = "最低 " + minimumTemperature + "°C";
      element7.title = "最高 " + maximumTemperature + "°C";
      syncClimateControl1();
      if (arg) {
        element5.classList.remove("is-changing");
        window.requestAnimationFrame(() => element5.classList.add("is-changing"));
      }
    };
    let state3 = previous;
    const state4 = [];
    let state5 = null;
    let state6 = previous;
    let state7 = false;
    let state8 = null;
    const runHelper = (arg, second) => arg !== null && second !== null && Math.abs(arg - second) < 1e-8;
    const runHelper1 = () => state4.at(-1) ?? state5;
    const runHelper2 = () => {
      const state12 = runHelper1();
      if (state12 !== null) {
        scheduleTimeout1(state12);
      }
    };
    const state9 = async () => {
      window.clearTimeout(state8);
      state8 = null;
      if (state7 || !state4.length) {
        return;
      }
      const temperature = state4.shift();
      state5 = temperature;
      if (runHelper(temperature, state3)) {
        state5 = null;
        runHelper2();
        if (state4.length) {
          state8 = window.setTimeout(state9, 220);
        }
        return;
      }
      state7 = true;
      try {
        await this.callEntityService(climateDetailsControlsEl === "climate" ? "climate" : climateDetailsControlsEl, "set_temperature", entityId, {
          temperature
        });
        state3 = temperature;
        if (climateDetailsControlsEl !== "water_heater") {
          onPowerChange?.(true);
        }
      } catch (error) {
        state4.length = 0;
        scheduleTimeout();
        state6 = state3;
        previous = state3;
        syncAriaState(true);
        this.options.onError?.(error);
      } finally {
        state7 = false;
        state5 = null;
        runHelper2();
        if (state4.length) {
          state8 = window.setTimeout(state9, 220);
        }
      }
    };
    const scheduleTimeout3 = ({
      preserveIntermediateSteps = true
    } = {}) => {
      const state12 = previous;
      state6 = state12;
      const state13 = state4.at(-1) ?? state5 ?? state3;
      if (runHelper(state12, state13)) {
        runHelper2();
        return;
      }
      if (preserveIntermediateSteps && temperature1) {
        const state14 = state4.at(-2) ?? state5 ?? state3;
        if (state4.length && runHelper(state12, state14)) {
          state4.pop();
        } else {
          state4.push(state12);
        }
      } else {
        state4.length = 0;
        state4.push(state12);
      }
      runHelper2();
      if (!state7) {
        window.clearTimeout(state8);
        state8 = window.setTimeout(state9, 160);
      }
    };
    const syncClimateControl2 = arg => {
      if (!interactive || !temperature) {
        return;
      }
      const temperature2 = previous;
      const asString = String(temperatureStep).split(".")[1]?.length || 0;
      previous = Number(Math.max(minimumTemperature, Math.min(maximumTemperature, previous + arg * temperatureStep)).toFixed(asString));
      if (previous !== temperature2) {
        syncAriaState(true);
        scheduleTimeout3();
      }
    };
    const measureElementBox = event1 => {
      const domRect = element3.getBoundingClientRect();
      const size = domRect.left + domRect.width / 2;
      const size1 = domRect.top + domRect.height / 2;
      const event2 = event1.clientX - size;
      const state12 = event1.clientY - size1;
      const state13 = (Math.atan2(event2, -state12) * 180 / Math.PI + 360) % 360;
      let amount;
      if (state13 >= 225) {
        amount = state13;
      } else if (state13 <= 135) {
        amount = state13 + 360;
      } else {
        amount = state13 <= 180 ? 495 : 225;
      }
      const count = Math.max(0, Math.min(1, (amount - 225) / 270));
      const asString = String(temperatureStep).split(".")[1]?.length || 0;
      return Number((minimumTemperature + Math.round((maximumTemperature - minimumTemperature) * count / temperatureStep) * temperatureStep).toFixed(asString));
    };
    let event = null;
    element3.addEventListener("pointerdown", event => {
      if (!interactive || !temperature) {
        return;
      }
      const event1 = element3.getBoundingClientRect();
      const size = Math.min(event1.width, event1.height) / 2;
      const event2 = Math.hypot(event.clientX - (event1.left + event1.width / 2), event.clientY - (event1.top + event1.height / 2));
      if (event.target === climateTemperatureThumbEl || !(Math.abs(event2 - size) > 34)) {
        event.preventDefault();
        event = {
          pointerId: event.pointerId,
          previous
        };
        element3.setPointerCapture(event.pointerId);
        element3.classList.add("is-dragging");
        previous = measureElementBox(event);
        syncAriaState();
      }
    });
    element3.addEventListener("pointermove", event1 => {
      if (!!event && event1.pointerId === event.pointerId) {
        previous = measureElementBox(event1);
        syncAriaState();
      }
    });
    const state10 = event1 => {
      if (!event || event1.pointerId !== event.pointerId) {
        return;
      }
      const previous2 = event.previous;
      event = null;
      element3.classList.remove("is-dragging");
      if (element3.hasPointerCapture(event1.pointerId)) {
        element3.releasePointerCapture(event1.pointerId);
      }
      syncAriaState(true);
      if (previous !== previous2) {
        scheduleTimeout3({
          preserveIntermediateSteps: false
        });
      }
    };
    element3.addEventListener("pointerup", state10);
    element3.addEventListener("pointercancel", state10);
    climateTemperatureThumbEl.disabled = !temperature;
    element2.addEventListener("click", () => syncClimateControl2(-1));
    element7.addEventListener("click", () => syncClimateControl2(1));
    syncAriaState();
    climateThermostatEl.append(element2, element3, element7);
    if (temperature) {
      element.append(climateThermostatEl);
    }
    const waterHeaterControlPanelEl = deviceType === "water-heater" ? document.createElement("section") : null;
    if (waterHeaterControlPanelEl) {
      waterHeaterControlPanelEl.className = "hb-water-heater-control-panel";
      waterHeaterControlPanelEl.dataset.controlSource = "primary-entity";
      element.append(waterHeaterControlPanelEl);
      element.waterHeaterControlPanel = waterHeaterControlPanelEl;
    }
    const createChildElement = ({
      label,
      values: values1,
      current,
      service,
      dataKey,
      labels: labels1 = {},
      icons: icons1 = {},
      className = "",
      domain = "climate",
      presentation = "auto"
    }) => {
      const set = [...new Set((Array.isArray(values1) ? values1 : []).map(arg => String(arg ?? "").trim()).filter(Boolean))];
      if (!set.length) {
        return;
      }
      const state12 = presentation === "auto" ? climateOptionPresentation(set, labels1) : presentation;
      const element8 = document.createElement("div");
      element8.className = ("hb-climate-details-group " + className).trim();
      if (waterHeaterControlPanelEl) {
        element8.dataset.controlSource = "primary-entity";
      }
      const element9 = document.createElement("strong");
      element9.textContent = label;
      if (state12 === "select") {
        element8.classList.add("select-options");
        const climateSelectEl = document.createElement("div");
        climateSelectEl.className = "hb-climate-select";
        climateSelectEl.dataset.climateService = service;
        climateSelectEl.dataset.currentValue = String(current ?? "");
        const element10 = document.createElement("button");
        element10.type = "button";
        element10.className = "hb-climate-select-trigger";
        element10.setAttribute("aria-label", label);
        element10.setAttribute("aria-haspopup", "listbox");
        element10.setAttribute("aria-expanded", "false");
        element10.disabled = !interactive;
        const element11 = document.createElement("span");
        const climateSelectMenuEl = document.createElement("i");
        climateSelectMenuEl.setAttribute("aria-hidden", "true");
        element10.append(element11, climateSelectMenuEl);
        const climateSelectMenuEl1 = document.createElement("div");
        climateSelectMenuEl1.className = "hb-climate-select-menu";
        climateSelectMenuEl1.id = "hb-climate-select-" + randomUuid();
        climateSelectMenuEl1.setAttribute("role", "listbox");
        climateSelectMenuEl1.setAttribute("aria-label", label);
        climateSelectMenuEl1.setAttribute("popover", "auto");
        climateSelectMenuEl1.hidden = true;
        element10.setAttribute("aria-controls", climateSelectMenuEl1.id);
        let state13 = false;
        const computeResult = () => {
          try {
            return climateSelectMenuEl1.matches(":popover-open");
          } catch {
            return climateSelectMenuEl1.dataset.open === "true";
          }
        };
        const syncVisualState = arg => {
          const text = String(arg ?? "");
          climateSelectEl.dataset.currentValue = text;
          const element12 = Array.from(climateSelectMenuEl1.querySelectorAll("[role=\"option\"]")).find(optionEl => optionEl.dataset.value === text);
          element11.textContent = element12?.textContent || text || "请选择";
          element11.title = element11.textContent;
          climateSelectMenuEl1.querySelectorAll("[role=\"option\"]").forEach(element13 => {
            const state14 = element13.dataset.value === text;
            element13.classList.toggle("active", state14);
            element13.setAttribute("aria-selected", String(state14));
          });
        };
        const applyElementStyle = () => {
          if (!computeResult() && climateSelectMenuEl1.hidden) {
            return;
          }
          const domRect = element10.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 190), Math.max(190, innerWidth - 20));
          climateSelectMenuEl1.style.width = clamped + "px";
          climateSelectMenuEl1.style.maxHeight = Math.min(360, Math.max(120, innerHeight - 20)) + "px";
          const size = Math.min(climateSelectMenuEl1.scrollHeight || 0, 360);
          const size1 = innerHeight - domRect.bottom - 10;
          const size2 = domRect.top - 10;
          const clamped1 = size1 < Math.min(size, 180) && size2 > size1 ? Math.max(10, domRect.top - size - 5) : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          climateSelectMenuEl1.style.left = Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) + "px";
          climateSelectMenuEl1.style.top = Math.max(10, clamped1) + "px";
        };
        const syncAriaState1 = () => {
          if (computeResult() && typeof climateSelectMenuEl1.hidePopover == "function") {
            climateSelectMenuEl1.hidePopover();
          }
          climateSelectMenuEl1.hidden = true;
          climateSelectMenuEl1.dataset.open = "false";
          element10.setAttribute("aria-expanded", "false");
        };
        const syncAriaState2 = (arg = false) => {
          if (!element10.disabled && !state13) {
            climateSelectMenuEl1.hidden = false;
            if (typeof climateSelectMenuEl1.showPopover == "function") {
              climateSelectMenuEl1.showPopover();
            } else {
              climateSelectMenuEl1.dataset.open = "true";
            }
            element10.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (arg) {
              (climateSelectMenuEl1.querySelector("[aria-selected=\"true\"]") || climateSelectMenuEl1.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async state => {
          if (!interactive || state13) {
            return;
          }
          const currentValue = climateSelectEl.dataset.currentValue;
          state13 = true;
          element10.disabled = true;
          syncAriaState1();
          syncVisualState(state);
          try {
            await this.callEntityService(domain, service, entityId, {
              [dataKey]: state
            });
            const attributes2 = {
              ...(entityState?.attributes || {}),
              [dataKey]: state
            };
            if (service === "set_hvac_mode") {
              entityState = {
                ...(entityState || {}),
                state,
                attributes: {
                  ...attributes2,
                  hvac_action: state === "cool" ? "cooling" : state === "heat" ? "heating" : state === "off" ? "off" : state
                }
              };
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const trimmed = deviceType === "bath-heater" && ["idle", "standby", "待机", "关闭"].includes(String(state).trim().toLowerCase());
              const found = element.dataset.lastClimateMode || climateCapabilities.hvacModes.find(arg => arg !== "off") || (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const state14 = {
                ...(entityState || {}),
                state: trimmed ? "off" : climateIsPoweredOn(entityState, deviceType) ? entityState?.state : found,
                attributes: {
                  ...attributes2,
                  preset_mode: state
                }
              };
              const state15 = climateEffectMode(state14, deviceType);
              state14.attributes.hvac_action = trimmed ? "idle" : state15 === "cool" ? "cooling" : state15 === "heat" ? "heating" : "fan";
              entityState = state14;
              onPowerChange?.(!trimmed);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...attributes2,
                  operation_mode: state
                }
              };
              onPowerChange?.(state !== "off");
            } else {
              entityState = {
                ...(entityState || {}),
                attributes: attributes2
              };
            }
            syncClimateControl1();
          } catch (error) {
            syncVisualState(currentValue);
            this.options.onError?.(error);
          } finally {
            state13 = false;
            element10.disabled = !interactive;
          }
        };
        for (const climateSelectOptionEl of set) {
          const element12 = document.createElement("button");
          element12.type = "button";
          element12.className = "hb-climate-select-option";
          element12.setAttribute("role", "option");
          element12.dataset.value = climateSelectOptionEl;
          element12.textContent = labels1[climateSelectOptionEl] || climateSelectOptionEl;
          element12.title = element12.textContent;
          element12.addEventListener("click", () => invokeEntityService(climateSelectOptionEl));
          climateSelectMenuEl1.append(element12);
        }
        syncVisualState(String(current ?? ""));
        element10.addEventListener("click", () => {
          if (computeResult() || climateSelectMenuEl1.dataset.open === "true") {
            syncAriaState1();
          } else {
            syncAriaState2();
          }
        });
        element10.addEventListener("keydown", event => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState2(true);
          }
        });
        climateSelectMenuEl1.addEventListener("keydown", event => {
          const matchedEl = [...climateSelectMenuEl1.querySelectorAll("[role=\"option\"]")];
          const state14 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState1();
            element10.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state15 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state14 + state15 + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        climateSelectMenuEl1.addEventListener("toggle", arg => {
          const state14 = arg.newState === "open";
          climateSelectMenuEl1.hidden = !state14;
          climateSelectMenuEl1.dataset.open = String(state14);
          element10.setAttribute("aria-expanded", String(state14));
          if (state14) {
            applyElementStyle();
          }
        });
        climateSelectEl.append(element10, climateSelectMenuEl1);
        element8.append(element9, climateSelectEl);
        (waterHeaterControlPanelEl || element).append(element8);
        return;
      }
      const climateDetailsOptionsEl = document.createElement("div");
      climateDetailsOptionsEl.className = "hb-climate-details-options";
      for (const state of set) {
        const element10 = document.createElement("button");
        element10.type = "button";
        element10.dataset.climateService = service;
        element10.dataset.climateValue = state;
        const element11 = document.createElement("i");
        element11.setAttribute("aria-hidden", "true");
        element11.textContent = icons1[state] || "";
        const element12 = document.createElement("span");
        element12.textContent = labels1[state] || state;
        element10.append(element11, element12);
        element10.classList.toggle("active", state === current);
        element10.addEventListener("click", async () => {
          if (!interactive) {
            return;
          }
          const trimmed = deviceType === "bath-heater" && service === "set_preset_mode" && ["idle", "standby", "待机", "关闭"].includes(String(state).trim().toLowerCase());
          climateDetailsOptionsEl.querySelectorAll("button").forEach(arg => {
            arg.disabled = true;
          });
          try {
            await this.callEntityService(domain, service, entityId, {
              [dataKey]: state
            });
            if (trimmed) {
              const state13 = climatePowerCommand(entityId, entityState, false, "bath-heater");
              await this.callEntityService(state13.domain, state13.service, entityId, state13.data);
            }
            climateDetailsOptionsEl.querySelectorAll("button").forEach(element13 => element13.classList.toggle("active", element13 === element10));
            if (service === "set_hvac_mode") {
              const hvac_action = state === "cool" ? "cooling" : state === "heat" ? "heating" : state === "off" ? "off" : state;
              entityState = {
                ...(entityState || {}),
                state,
                attributes: {
                  ...(entityState?.attributes || {}),
                  hvac_action
                }
              };
              syncClimateControl1();
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const state13 = trimmed;
              const found = element.dataset.lastClimateMode || climateCapabilities.hvacModes.find(arg => arg !== "off") || (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const state14 = {
                ...(entityState || {}),
                state: state13 ? "off" : climateIsPoweredOn(entityState, deviceType) ? entityState?.state : found,
                attributes: {
                  ...(entityState?.attributes || {}),
                  preset_mode: state
                }
              };
              const state15 = climateEffectMode(state14, deviceType);
              state14.attributes.hvac_action = state13 ? "idle" : state15 === "cool" ? "cooling" : state15 === "heat" ? "heating" : "fan";
              entityState = state14;
              syncClimateControl1();
              onPowerChange?.(!state13);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...(entityState?.attributes || {}),
                  operation_mode: state
                }
              };
              syncClimateControl1();
              onPowerChange?.(state !== "off");
            }
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            climateDetailsOptionsEl.querySelectorAll("button").forEach(arg => {
              arg.disabled = false;
            });
          }
        });
        climateDetailsOptionsEl.append(element10);
      }
      element8.append(element9, climateDetailsOptionsEl);
      (waterHeaterControlPanelEl || element).append(element8);
    };
    const values = climateOperationModeValues(component, deviceType);
    const labels = Object.fromEntries(values.map(arg => [arg, climateModeLabel(arg, deviceType, climateDetailsControlsEl1)]));
    const icons = Object.fromEntries(values.map(arg => [arg, climateModeIcon(arg, deviceType)]));
    createChildElement({
      label: "运行模式",
      values,
      current: String(deviceType === "water-heater" ? attributes.operation_mode || "" : component?.state || ""),
      service: deviceType === "water-heater" ? "set_operation_mode" : "set_hvac_mode",
      dataKey: deviceType === "water-heater" ? "operation_mode" : "hvac_mode",
      labels,
      icons,
      className: "mode-options",
      domain: deviceType === "water-heater" ? "water_heater" : "climate",
      presentation: climateOptionPresentation(values, labels)
    });
    const state11 = climateDetailsControlsEl === "climate" ? climateCapabilities.fanModes : [];
    if (state11.length) {
      const state12 = {
        silent: "静音",
        low: "低",
        medium: "中",
        high: "高",
        full: "强劲",
        auto: "自动",
        1: "一档",
        2: "二档",
        3: "三档",
        4: "四档",
        5: "五档",
        6: "六档",
        7: "七档",
        max: "Max档"
      };
      const fan_mode = state11.find(climateFanSliderEl3 => ["auto", "自动"].includes(String(climateFanSliderEl3).toLowerCase()));
      const climateFanSliderEl1 = state11.filter(climateFanSliderEl3 => climateFanSliderEl3 !== fan_mode);
      const climateFanSliderEl2 = document.createElement("section");
      climateFanSliderEl2.className = "hb-climate-fan-slider";
      const climateFanSliderHeadingEl = document.createElement("span");
      climateFanSliderHeadingEl.className = "hb-climate-fan-slider-heading";
      const element8 = document.createElement("i");
      element8.setAttribute("aria-hidden", "true");
      element8.textContent = "✾";
      const element9 = document.createElement("strong");
      element9.textContent = "风速";
      const element10 = document.createElement("output");
      const count = Math.max(0, climateFanSliderEl1.indexOf(attributes.fan_mode));
      let amount = count;
      let state13 = !!fan_mode && attributes.fan_mode === fan_mode;
      let fan_mode2 = attributes.fan_mode;
      const element11 = document.createElement("input");
      element11.type = "range";
      element11.min = "0";
      element11.max = String(Math.max(0, climateFanSliderEl1.length - 1));
      element11.step = "1";
      element11.value = String(count);
      element11.disabled = climateFanSliderEl1.length === 0;
      const runHelper4 = climateFanAutoEl => state12[String(climateFanSliderEl1[climateFanAutoEl]).toLowerCase()] || climateFanSliderEl1[climateFanAutoEl] || "--";
      const element12 = document.createElement("button");
      element12.type = "button";
      element12.className = "hb-climate-fan-auto";
      element12.textContent = "自动";
      element12.hidden = !fan_mode;
      element12.classList.toggle("active", state13);
      const applyElementStyle = () => {
        const numeric = Number(element11.value);
        const state14 = climateFanSliderEl1.length > 1 ? numeric / (climateFanSliderEl1.length - 1) * 100 : 100;
        element10.textContent = state13 ? "自动" : runHelper4(numeric);
        element11.style.setProperty("--hb-climate-fan-progress", state14 + "%");
      };
      climateFanSliderHeadingEl.append(element8, element9, element10, element12);
      element11.addEventListener("input", () => {
        state13 = false;
        element12.classList.remove("active");
        applyElementStyle();
      });
      element11.addEventListener("change", async () => {
        if (!interactive || !climateFanSliderEl1.length) {
          return;
        }
        const numeric = Number(element11.value);
        const fan_mode3 = climateFanSliderEl1[numeric];
        element11.disabled = true;
        element12.disabled = true;
        try {
          await this.callEntityService("climate", "set_fan_mode", entityId, {
            fan_mode: fan_mode3
          });
          amount = numeric;
          fan_mode2 = fan_mode3;
          state13 = false;
        } catch (error) {
          state13 = !!fan_mode && fan_mode2 === fan_mode;
          if (!state13) {
            element11.value = String(amount);
          }
          element12.classList.toggle("active", state13);
          applyElementStyle();
          this.options.onError?.(error);
        } finally {
          element11.disabled = false;
          element12.disabled = false;
        }
      });
      element12.addEventListener("click", async () => {
        if (!!interactive && !!fan_mode && !element12.disabled) {
          element11.disabled = true;
          element12.disabled = true;
          try {
            await this.callEntityService("climate", "set_fan_mode", entityId, {
              fan_mode
            });
            state13 = true;
            fan_mode2 = fan_mode;
            element12.classList.add("active");
            applyElementStyle();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element11.disabled = climateFanSliderEl1.length === 0;
            element12.disabled = false;
          }
        }
      });
      const climateFanSliderLegendEl = document.createElement("span");
      climateFanSliderLegendEl.className = "hb-climate-fan-slider-legend";
      const element13 = document.createElement("small");
      element13.textContent = runHelper4(0);
      const element14 = document.createElement("small");
      element14.textContent = runHelper4(climateFanSliderEl1.length - 1);
      climateFanSliderLegendEl.append(element13, element14);
      applyElementStyle();
      climateFanSliderEl2.append(climateFanSliderHeadingEl, element11, climateFanSliderLegendEl);
      element.append(climateFanSliderEl2);
    }
    let climateFanSliderEl = null;
    if (climateDetailsControlsEl === "fan" && climateCapabilities.supportsFanPercentage) {
      const climateFanSliderEl1 = document.createElement("section");
      climateFanSliderEl1.className = "hb-climate-fan-slider";
      const climateFanSliderHeadingEl = document.createElement("span");
      climateFanSliderHeadingEl.className = "hb-climate-fan-slider-heading";
      const element8 = document.createElement("i");
      element8.setAttribute("aria-hidden", "true");
      element8.textContent = "✾";
      const element9 = document.createElement("strong");
      element9.textContent = "风速";
      const element10 = document.createElement("output");
      let count = Math.max(0, Math.min(100, climateCapabilities.fanPercentage));
      const element11 = document.createElement("input");
      element11.type = "range";
      element11.min = "0";
      element11.max = "100";
      element11.step = String(climateCapabilities.fanPercentageStep);
      element11.value = String(count);
      const applyElementStyle = () => {
        const count2 = Math.max(0, Math.min(100, Number(element11.value) || 0));
        element10.textContent = Math.round(count2) + "%";
        element11.style.setProperty("--hb-climate-fan-progress", count2 + "%");
      };
      climateFanSliderEl = entityId => {
        const fanPercentage = normalizeClimateCapabilities(entityId).fanPercentage;
        if (fanPercentage !== null) {
          count = Math.max(0, Math.min(100, fanPercentage));
          element11.value = String(count);
          applyElementStyle();
        }
      };
      element11.addEventListener("input", applyElementStyle);
      element11.addEventListener("change", async () => {
        if (!interactive || element11.disabled) {
          return;
        }
        const percentage = Math.max(0, Math.min(100, Number(element11.value) || 0));
        element11.disabled = true;
        try {
          await this.callEntityService("fan", "set_percentage", entityId, {
            percentage
          });
          count = percentage;
          entityState = {
            ...(entityState || {}),
            state: percentage > 0 ? "on" : "off",
            attributes: {
              ...(entityState?.attributes || {}),
              percentage
            }
          };
          syncClimateControl1();
          onPowerChange?.(percentage > 0);
        } catch (error) {
          element11.value = String(count);
          applyElementStyle();
          this.options.onError?.(error);
        } finally {
          element11.disabled = false;
        }
      });
      const climateFanSliderLegendEl = document.createElement("span");
      climateFanSliderLegendEl.className = "hb-climate-fan-slider-legend";
      const element12 = document.createElement("small");
      element12.textContent = "关闭";
      const element13 = document.createElement("small");
      element13.textContent = "最大";
      climateFanSliderLegendEl.append(element12, element13);
      climateFanSliderHeadingEl.append(element8, element9, element10);
      applyElementStyle();
      climateFanSliderEl1.append(climateFanSliderHeadingEl, element11, climateFanSliderLegendEl);
      element.append(climateFanSliderEl1);
    }
    const labels2 = Object.fromEntries(climateCapabilities.swingModes.map(arg => [arg, climateSwingModeLabel(arg, "vertical", climateDetailsControlsEl1)]));
    createChildElement({
      label: climateCapabilities.horizontalSwingModes.length ? "纵向摆风" : "摆风",
      values: climateCapabilities.swingModes,
      current: attributes.swing_mode,
      service: "set_swing_mode",
      dataKey: "swing_mode",
      labels: labels2,
      icons: {
        off: "—",
        vertical: "↕",
        horizontal: "↔",
        both: "✣"
      },
      className: "compact-options",
      presentation: climateOptionPresentation(climateCapabilities.swingModes, labels2, {
        inlineIcon: true
      })
    });
    const labels3 = Object.fromEntries(climateCapabilities.horizontalSwingModes.map(arg => [arg, climateSwingModeLabel(arg, "horizontal", climateDetailsControlsEl1)]));
    createChildElement({
      label: "水平摆风",
      values: climateCapabilities.horizontalSwingModes,
      current: attributes.swing_horizontal_mode,
      service: "set_swing_horizontal_mode",
      dataKey: "swing_horizontal_mode",
      labels: labels3,
      className: "compact-options",
      presentation: climateOptionPresentation(climateCapabilities.horizontalSwingModes, labels3, {
        inlineIcon: true
      })
    });
    const labels4 = Object.fromEntries(climateCapabilities.presetModes.map(arg => [arg, climateModeLabel(arg, deviceType, climateDetailsControlsEl1)]));
    const icons2 = Object.fromEntries(climateCapabilities.presetModes.map(arg => [arg, climateModeIcon(arg, deviceType)]));
    createChildElement({
      label: "预设模式",
      values: climateCapabilities.presetModes,
      current: attributes.preset_mode,
      service: "set_preset_mode",
      dataKey: "preset_mode",
      labels: labels4,
      icons: icons2,
      className: "compact-options",
      domain: climateDetailsControlsEl === "fan" ? "fan" : "climate",
      presentation: climateOptionPresentation(climateCapabilities.presetModes, labels4, {
        inlineIcon: true
      })
    });
    let runHelper3 = null;
    if (!element.childElementCount) {
      const element8 = document.createElement("section");
      element8.className = "hb-climate-details-loading";
      const iconEl = document.createElement("i");
      iconEl.setAttribute("aria-hidden", "true");
      const element9 = document.createElement("strong");
      const element10 = document.createElement("span");
      runHelper3 = arg => {
        const asString = String(arg?.state || "").trim().toLowerCase();
        const state12 = !arg || !asString || asString === "unknown";
        const state13 = asString === "unavailable";
        element8.classList.toggle("is-loading", state12);
        element8.classList.toggle("is-unavailable", state13);
        element9.textContent = state12 ? "正在加载设备状态…" : state13 ? "设备当前不可用" : "暂无可用控制数据";
        element10.textContent = state12 ? "状态到达后会自动显示，无需重新打开弹窗" : state13 ? "连接恢复后会自动更新" : "请检查该实体在 Home Assistant 中提供的控制能力";
      };
      runHelper3(component);
      element8.append(iconEl, element9, element10);
      element.append(element8);
    }
    element.syncClimateGrid = () => {
      const state12 = Array.from(element.children);
      const found = state12.find(element8 => element8.classList.contains("hb-climate-thermostat"));
      if (!found) {
        return;
      }
      const found1 = state12.find(element8 => element8.classList.contains("is-water-heater"));
      const length = state12.filter(metadata => metadata !== found && metadata !== found1).length;
      found.style.gridRow = "1 / span " + Math.max(1, length);
      if (found1) {
        found1.style.gridRow = "1 / span " + Math.max(1, length);
      }
    };
    element.syncClimateGrid();
    element.syncClimateState = arg => {
      if (!arg) {
        return;
      }
      entityState = arg;
      runHelper3?.(arg);
      climateFanSliderEl?.(arg);
      const targetTemperature2 = normalizeClimateCapabilities(arg).targetTemperature;
      const temperature2 = reconcileClimateTargetTemperature(state6, targetTemperature2, state, temperatureStep);
      if (state === null || temperature2.confirmed) {
        state6 = temperature2.temperature;
      }
      previous = state6;
      if (targetTemperature2 !== null && (state === null || temperature2.confirmed)) {
        state3 = targetTemperature2;
      }
      if (state !== null && temperature2.confirmed) {
        if (temperature1) {
          scheduleTimeout2();
        } else {
          scheduleTimeout();
        }
      }
      syncAriaState();
    };
    element.cleanupClimateDetails = () => {
      window.clearTimeout(state8);
      state8 = null;
      state4.length = 0;
      state5 = null;
      scheduleTimeout();
    };
    syncClimateControl1();
    return element;
  }
  createWaterHeaterExtensionControls(entityId1, {
    component = null,
    interactive = true,
    excludedEntityIds = []
  } = {}) {
    const state = component ? relatedPopupContext(component, this.entityMetadata, this.deviceMetadata, this.states) : null;
    const state1 = component ? selectedRelatedEntities(component, this.entityMetadata, this.deviceMetadata, this.states) : null;
    const allowed = new Set(excludedEntityIds);
    const filtered = (state1 === null ? relatedWaterHeaterEntities(this.entityMetadata, entityId1) : state1).filter(relatedEntityExtensionsEl2 => !allowed.has(relatedEntityExtensionsEl2.entityId));
    const relatedEntityExtensionsEl = state?.primary || this.entityMetadata.get(entityId1);
    if (!filtered.length) {
      return null;
    }
    const relatedEntityExtensionsEl1 = document.createElement("section");
    relatedEntityExtensionsEl1.className = "hb-related-entity-extensions hb-water-heater-extensions" + (state?.deviceType ? " is-" + state.deviceType : "");
    relatedEntityExtensionsEl1.dataset.controlSource = state1 === null ? "automatic-device" : "user-selected";
    const index = new Map();
    const resolveEntityId = entityId => {
      const state2 = this.states.get(entityId);
      return state2?.newState || state2 || {
        entityId,
        state: "unknown",
        attributes: {}
      };
    };
    const runHelper = (waterHeaterExtensionGridEl1, waterHeaterExtensionGridEl2) => {
      if (!index.has(waterHeaterExtensionGridEl1)) {
        index.set(waterHeaterExtensionGridEl1, []);
      }
      index.get(waterHeaterExtensionGridEl1).push(waterHeaterExtensionGridEl2);
    };
    const waterHeaterExtensionGridEl = document.createElement("div");
    waterHeaterExtensionGridEl.className = "hb-water-heater-extension-grid";
    for (const metadata of filtered) {
      const entityId = metadata.entityId;
      const text = String(metadata.domain || "");
      const waterHeaterExtensionToggleEl = state ? relatedEntityLabel(state, metadata) : waterHeaterRelatedEntityLabel(relatedEntityExtensionsEl, metadata);
      if (["light", "switch", "input_boolean", "fan"].includes(text)) {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "hb-water-heater-extension-toggle";
        const iconEl = document.createElement("i");
        iconEl.setAttribute("aria-hidden", "true");
        const spanEl = document.createElement("span");
        const element2 = document.createElement("strong");
        element2.textContent = waterHeaterExtensionToggleEl;
        const element3 = document.createElement("small");
        spanEl.append(element2, element3);
        element.append(iconEl, spanEl);
        let state2 = resolveEntityId(entityId);
        let state3 = false;
        const syncVisualState = (arg = state2) => {
          state2 = arg || state2;
          const asString = String(state2?.state || "").toLowerCase();
          const state4 = ["unknown", "unavailable"].includes(asString);
          const state5 = asString === "on";
          element.classList.toggle("is-on", state5 && !state4);
          element.classList.toggle("is-unavailable", state4);
          element.disabled = !interactive || state3 || state4;
          element.setAttribute("aria-pressed", String(state5));
          element.setAttribute("aria-busy", String(state3));
          element3.textContent = state4 ? "不可用" : state5 ? "已开启" : "已关闭";
        };
        element.addEventListener("click", async () => {
          if (!interactive || state3 || element.classList.contains("is-unavailable")) {
            return;
          }
          const state4 = state2;
          const asString = String(state2?.state || "").toLowerCase() !== "on";
          state3 = true;
          syncVisualState({
            ...(state2 || {}),
            state: asString ? "on" : "off"
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            syncVisualState(state4);
            this.options.onError?.(error);
          } finally {
            state3 = false;
            syncVisualState(state2);
          }
        });
        syncVisualState(state2);
        runHelper(entityId, syncVisualState);
        waterHeaterExtensionGridEl.append(element);
      } else if (["select", "input_select"].includes(text)) {
        const waterHeaterExtensionSelectEl = document.createElement("div");
        waterHeaterExtensionSelectEl.className = "hb-water-heater-extension-select";
        const element = document.createElement("span");
        element.textContent = waterHeaterExtensionToggleEl;
        element.title = waterHeaterExtensionToggleEl;
        const element2 = document.createElement("button");
        element2.type = "button";
        element2.className = "hb-related-select-trigger";
        element2.setAttribute("aria-label", waterHeaterExtensionToggleEl);
        element2.setAttribute("aria-haspopup", "listbox");
        element2.setAttribute("aria-expanded", "false");
        const element3 = document.createElement("span");
        const relatedSelectMenuEl = document.createElement("i");
        relatedSelectMenuEl.setAttribute("aria-hidden", "true");
        element2.append(element3, relatedSelectMenuEl);
        const relatedSelectMenuEl1 = document.createElement("div");
        relatedSelectMenuEl1.className = "hb-related-select-menu";
        relatedSelectMenuEl1.id = "hb-related-select-" + String(this.renderNamespace || "runtime").replace(/[^a-z0-9_-]/gi, "-") + "-" + entityId.replace(/[^a-z0-9_-]/gi, "-");
        relatedSelectMenuEl1.setAttribute("role", "listbox");
        relatedSelectMenuEl1.setAttribute("popover", "auto");
        relatedSelectMenuEl1.hidden = true;
        element2.setAttribute("aria-controls", relatedSelectMenuEl1.id);
        let entityState = resolveEntityId(entityId);
        let text2 = String(entityState?.state || "");
        let state2 = false;
        let state3 = "";
        let options = [];
        const state4 = {
          entityId,
          entityMetadata: this.entityMetadata,
          entityTranslations: this.entityTranslations,
          attributes: ["options", "option"]
        };
        const syncClimateControl = arg => state?.deviceType === "bath-heater" ? climateModeLabel(arg, "bath-heater", state4) : String(arg || "");
        const computeResult = () => {
          try {
            return relatedSelectMenuEl1.matches(":popover-open");
          } catch {
            return relatedSelectMenuEl1.dataset.open === "true";
          }
        };
        const applyElementStyle = () => {
          if (!computeResult() && relatedSelectMenuEl1.hidden) {
            return;
          }
          const domRect = element2.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 132), Math.max(132, innerWidth - 16));
          relatedSelectMenuEl1.style.width = clamped + "px";
          relatedSelectMenuEl1.style.maxHeight = Math.min(216, Math.max(88, innerHeight - 16)) + "px";
          const size = Math.min(relatedSelectMenuEl1.scrollHeight || 0, 216);
          const size1 = innerHeight - domRect.bottom - 8;
          const size2 = domRect.top - 8;
          const clamped1 = size1 < Math.min(size, 140) && size2 > size1 ? Math.max(8, domRect.top - size - 4) : Math.min(innerHeight - size - 8, domRect.bottom + 4);
          relatedSelectMenuEl1.style.left = Math.max(8, Math.min(domRect.left, innerWidth - clamped - 8)) + "px";
          relatedSelectMenuEl1.style.top = Math.max(8, clamped1) + "px";
        };
        const syncAriaState = () => {
          if (computeResult() && typeof relatedSelectMenuEl1.hidePopover == "function") {
            relatedSelectMenuEl1.hidePopover();
          }
          relatedSelectMenuEl1.hidden = true;
          relatedSelectMenuEl1.dataset.open = "false";
          element2.setAttribute("aria-expanded", "false");
        };
        const syncAriaState1 = (arg = false) => {
          if (!element2.disabled) {
            relatedSelectMenuEl1.hidden = false;
            if (typeof relatedSelectMenuEl1.showPopover == "function") {
              relatedSelectMenuEl1.showPopover();
            } else {
              relatedSelectMenuEl1.dataset.open = "true";
            }
            element2.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (arg) {
              (relatedSelectMenuEl1.querySelector("[aria-selected=\"true\"]") || relatedSelectMenuEl1.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async state => {
          if (!interactive || state2 || !state) {
            return;
          }
          const state5 = entityState;
          state2 = true;
          syncAriaState();
          syncVisualState1({
            ...(entityState || {}),
            state,
            attributes: {
              ...(entityState?.attributes || {}),
              options
            }
          });
          try {
            const state6 = relatedEntitySelectService(text);
            if (!state6) {
              throw new Error("实体 " + entityId + " 不支持选项服务。");
            }
            await this.callEntityService(state6.domain, state6.service, entityId, {
              option: state
            });
            text2 = state;
          } catch (error) {
            syncVisualState1(state5);
            this.options.onError?.(error);
          } finally {
            state2 = false;
            syncVisualState1(entityState);
          }
        };
        const syncVisualState = (relatedSelectOptionEl, relatedSelectOptionEl1) => {
          relatedSelectMenuEl1.replaceChildren(...relatedSelectOptionEl.map(relatedSelectOptionEl2 => {
            const element4 = document.createElement("button");
            element4.type = "button";
            element4.className = "hb-related-select-option";
            element4.setAttribute("role", "option");
            element4.dataset.value = relatedSelectOptionEl2;
            element4.textContent = syncClimateControl(relatedSelectOptionEl2);
            element4.title = element4.textContent;
            const state5 = relatedSelectOptionEl2 === relatedSelectOptionEl1;
            element4.classList.toggle("active", state5);
            element4.setAttribute("aria-selected", String(state5));
            element4.addEventListener("click", () => invokeEntityService(relatedSelectOptionEl2));
            return element4;
          }));
        };
        const syncVisualState1 = (arg = entityState) => {
          entityState = arg || entityState;
          const text3 = String(entityState?.state || "");
          const state5 = relatedEntityOptions(metadata, entityState);
          options = state5;
          const jsonText = JSON.stringify(state5);
          if (jsonText !== state3) {
            state3 = jsonText;
            syncVisualState(state5, text3);
          } else {
            for (const element4 of relatedSelectMenuEl1.querySelectorAll("[role=\"option\"]")) {
              const state6 = element4.dataset.value === text3;
              element4.classList.toggle("active", state6);
              element4.setAttribute("aria-selected", String(state6));
            }
          }
          if (text3 && !["unknown", "unavailable"].includes(text3.toLowerCase())) {
            text2 = text3;
          }
          element3.textContent = text2 ? syncClimateControl(text2) : state5.length ? syncClimateControl(state5[0]) : "无选项";
          element3.title = element3.textContent;
          element2.disabled = !interactive || state2 || !state5.length || text3.toLowerCase() === "unavailable";
        };
        element2.addEventListener("click", () => {
          if (computeResult() || relatedSelectMenuEl1.dataset.open === "true") {
            syncAriaState();
          } else {
            syncAriaState1();
          }
        });
        element2.addEventListener("keydown", event => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState1(true);
          }
        });
        relatedSelectMenuEl1.addEventListener("keydown", event => {
          const matchedEl = [...relatedSelectMenuEl1.querySelectorAll("[role=\"option\"]")];
          const state5 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState();
            element2.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state6 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state5 + state6 + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        relatedSelectMenuEl1.addEventListener("toggle", arg => {
          const state5 = arg.newState === "open";
          relatedSelectMenuEl1.hidden = !state5;
          relatedSelectMenuEl1.dataset.open = String(state5);
          element2.setAttribute("aria-expanded", String(state5));
          if (state5) {
            applyElementStyle();
          }
        });
        waterHeaterExtensionSelectEl.append(element, element2, relatedSelectMenuEl1);
        syncVisualState1(entityState);
        runHelper(entityId, syncVisualState1);
        waterHeaterExtensionGridEl.append(waterHeaterExtensionSelectEl);
      } else if (["number", "input_number"].includes(text)) {
        const waterHeaterExtensionNumberEl = document.createElement("div");
        waterHeaterExtensionNumberEl.className = "hb-water-heater-extension-number";
        const element = document.createElement("span");
        element.textContent = waterHeaterExtensionToggleEl;
        const spanEl = document.createElement("span");
        const element2 = document.createElement("button");
        element2.type = "button";
        element2.textContent = "−";
        const element3 = document.createElement("output");
        const element4 = document.createElement("button");
        element4.type = "button";
        element4.textContent = "+";
        spanEl.append(element2, element3, element4);
        waterHeaterExtensionNumberEl.append(element, spanEl);
        let entityState = resolveEntityId(entityId);
        let numeric = Number(entityState?.state);
        let state2 = false;
        const runHelper1 = () => {
          const numeric1 = entityState?.attributes || {};
          const numeric2 = Number(numeric1.min);
          const numeric3 = Number(numeric1.max);
          const step = Math.max(0.001, Number(numeric1.step) || 1);
          return {
            minimum: Number.isFinite(numeric2) ? numeric2 : 0,
            maximum: Number.isFinite(numeric3) ? numeric3 : 100,
            step
          };
        };
        const runHelper2 = (arg = entityState) => {
          entityState = arg || entityState;
          const numeric2 = Number(entityState?.state);
          const finiteNumber = !Number.isFinite(numeric2) || ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase());
          if (!finiteNumber) {
            numeric = numeric2;
          }
          const text2 = String(entityState?.attributes?.unit_of_measurement || "");
          element3.textContent = finiteNumber ? "--" : "" + numeric2 + text2;
          element2.disabled = !interactive || state2 || finiteNumber;
          element4.disabled = !interactive || state2 || finiteNumber;
        };
        const invokeEntityService = async arg => {
          if (!interactive || state2 || !Number.isFinite(numeric)) {
            return;
          }
          const {
            minimum,
            maximum,
            step
          } = runHelper1();
          const asString = String(step).split(".")[1]?.length || 0;
          const asNumber = Number(Math.max(minimum, Math.min(maximum, numeric + arg * step)).toFixed(asString));
          if (asNumber === numeric) {
            return;
          }
          const state3 = entityState;
          state2 = true;
          runHelper2({
            ...(entityState || {}),
            state: String(asNumber)
          });
          try {
            await this.callEntityService(text, "set_value", entityId, {
              value: asNumber
            });
            numeric = asNumber;
          } catch (error) {
            runHelper2(state3);
            this.options.onError?.(error);
          } finally {
            state2 = false;
            runHelper2(entityState);
          }
        };
        element2.addEventListener("click", () => invokeEntityService(-1));
        element4.addEventListener("click", () => invokeEntityService(1));
        runHelper2(entityState);
        runHelper(entityId, runHelper2);
        waterHeaterExtensionGridEl.append(waterHeaterExtensionNumberEl);
      } else if (text === "button") {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "hb-water-heater-extension-action";
        element.textContent = waterHeaterExtensionToggleEl;
        let state2 = false;
        const runHelper1 = entityId2 => {
          const asString = String(entityId2?.state || "").toLowerCase() === "unavailable";
          element.disabled = !interactive || state2 || asString;
        };
        element.addEventListener("click", async () => {
          if (!!interactive && !state2 && !element.disabled && (!relatedEntityNeedsConfirmation(metadata) || !!window.confirm("确认执行“" + waterHeaterExtensionToggleEl + "”吗？"))) {
            state2 = true;
            runHelper1(resolveEntityId(entityId));
            try {
              await this.callEntityService("button", "press", entityId);
            } catch (error) {
              this.options.onError?.(error);
            } finally {
              state2 = false;
              runHelper1(resolveEntityId(entityId));
            }
          }
        });
        runHelper1(resolveEntityId(entityId));
        runHelper(entityId, runHelper1);
        waterHeaterExtensionGridEl.append(element);
      } else if (["sensor", "binary_sensor"].includes(text)) {
        const element = document.createElement("div");
        element.className = "hb-water-heater-extension-readonly";
        const element2 = document.createElement("strong");
        element2.textContent = waterHeaterExtensionToggleEl;
        const element3 = document.createElement("small");
        const syncVisualState = entityState => {
          const text2 = String(entityState?.state || "unknown");
          const lowered = ["unknown", "unavailable"].includes(text2.toLowerCase());
          const text3 = String(entityState?.attributes?.unit_of_measurement || "");
          if (lowered) {
            element3.textContent = "不可用";
          } else if (text === "binary_sensor") {
            element3.textContent = text2 === "on" ? "已触发" : "正常";
          } else {
            element3.textContent = "" + text2 + (text3 ? " " + text3 : "");
          }
          element.classList.toggle("is-unavailable", lowered);
        };
        element.append(element2, element3);
        syncVisualState(resolveEntityId(entityId));
        runHelper(entityId, syncVisualState);
        waterHeaterExtensionGridEl.append(element);
      }
    }
    if (waterHeaterExtensionGridEl.childElementCount) {
      const element = document.createElement("strong");
      element.className = "hb-water-heater-extension-title";
      element.textContent = "扩展功能";
      relatedEntityExtensionsEl1.dataset.controlCount = String(waterHeaterExtensionGridEl.childElementCount);
      waterHeaterExtensionGridEl.dataset.controlCount = String(waterHeaterExtensionGridEl.childElementCount);
      relatedEntityExtensionsEl1.append(element, waterHeaterExtensionGridEl);
    }
    relatedEntityExtensionsEl1.stateHandlers = index;
    relatedEntityExtensionsEl1.relatedEntityIds = filtered.map(bathHeaterLightControlEl => bathHeaterLightControlEl.entityId);
    return relatedEntityExtensionsEl1;
  }
  createBathHeaterLightControl(entityId, component, {
    interactive = true,
    onStateChange = null
  } = {}) {
    const element = document.createElement("section");
    element.className = "hb-bath-heater-light-control";
    const spanEl = document.createElement("span");
    const element2 = document.createElement("i");
    element2.setAttribute("aria-hidden", "true");
    element2.textContent = "☀";
    const element3 = document.createElement("strong");
    element3.textContent = String(component?.attributes?.friendly_name || "浴霸灯");
    const element4 = document.createElement("output");
    spanEl.append(element2, element3, element4);
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.disabled = !interactive;
    let state = component;
    let state1 = false;
    const syncVisualState = (arg = state) => {
      state = arg || state;
      const unavailable = ["unknown", "unavailable"].includes(String(state?.state || ""));
      const isOn = state?.state === "on";
      element.classList.toggle("is-on", isOn && !unavailable);
      element.classList.toggle("is-unavailable", unavailable);
      element4.textContent = unavailable ? "不可用" : isOn ? "已开启" : "已关闭";
      element5.textContent = isOn ? "关闭灯光" : "开启灯光";
      element5.disabled = !interactive || state1 || unavailable;
      element5.setAttribute("aria-pressed", String(isOn));
      onStateChange?.({
        isOn,
        unavailable
      });
    };
    const state2 = async () => {
      if (!interactive || state1) {
        return;
      }
      state1 = true;
      const state3 = state;
      syncVisualState({
        ...(state || {}),
        state: state?.state === "on" ? "off" : "on"
      });
      try {
        await this.callEntityService("homeassistant", "toggle", entityId);
      } catch (error) {
        syncVisualState(state3);
        this.options.onError?.(error);
      } finally {
        state1 = false;
        syncVisualState(state);
      }
    };
    element5.addEventListener("click", state2);
    element.append(spanEl, element5);
    element.syncBathLightState = syncVisualState;
    element.toggleBathLight = state2;
    syncVisualState(component);
    return element;
  }
  showElectricBedLoadingDetails(component, {
    preview: preview = false
  } = {}) {
    if (!component.bindings?.entity?.entityId) {
      return;
    }
    this.closeRuntimeDialog();
    const detailsDialog = document.createElement("dialog");
    detailsDialog.className = "hb-entity-details-dialog electric-bed-details electric-bed-loading-details";
    detailsDialog.tabIndex = -1;
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, "电动床");
    entityDetailsHeadingEl.append(element);
    const electricBedLoadingBodyEl = document.createElement("section");
    electricBedLoadingBodyEl.className = "hb-electric-bed-loading-body";
    const climateDetailsLoadingEl = document.createElement("section");
    climateDetailsLoadingEl.className = "hb-climate-details-loading is-loading";
    const iconEl = document.createElement("i");
    iconEl.setAttribute("aria-hidden", "true");
    const element2 = document.createElement("strong");
    element2.textContent = "正在加载设备状态…";
    const element3 = document.createElement("span");
    element3.textContent = "状态到达后会自动显示，无需重新打开弹窗";
    climateDetailsLoadingEl.append(iconEl, element2, element3);
    electricBedLoadingBodyEl.append(climateDetailsLoadingEl);
    entityDetailsCardEl.append(entityDetailsHeadingEl, electricBedLoadingBodyEl);
    detailsDialog.append(entityDetailsCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(detailsDialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = detailsDialog;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, detailsDialog, 760, 420);
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, detailsDialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        detailsDialog.close();
      }
    });
    detailsDialog.addEventListener("close", () => {
      this.clearRuntimeDialogScale(detailsDialog);
      if (this.detailsDialog === detailsDialog) {
        this.detailsDialog = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    detailsDialog.show();
    detailsDialog.focus({
      preventScroll: true
    });
  }
  showElectricBedDetails(component, {
    preview = false
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该电动床控件没有关联实体。");
    }
    const state = this.deviceProfile(entityId);
    const state1 = state?.roles || {};
    const filtered = [["backrest", "靠背角度"], ["leg", "腿部角度"], ["waist", "腰部角度"]].map(([role, label]) => ({
      role,
      label,
      entityId: String(state1[role] || "")
    })).filter(arg => arg.entityId);
    const text = String(state1.mode || "");
    const entityId1 = this.entityMetadata.get(entityId);
    const filtered1 = entityId1?.deviceId ? [...this.entityMetadata.values()].filter(metadata => metadata.deviceId === entityId1.deviceId && ["button", "select"].includes(String(metadata.domain || metadata.entityId || "").split(".", 1)[0]) && metadata.entityId !== state1.mode && entityMetadataIsAvailable(metadata)).sort((arg, second) => String(arg.entityId || "").localeCompare(String(second.entityId || ""))).map(arg => arg.entityId) : [];
    const entityDetailsDialogEl = [...new Set([String(state1.memory1 || ""), String(state1.memory2 || ""), ...filtered1].filter(Boolean))].slice(0, 2);
    this.closeRuntimeDialog();
    const entityDetailsDialogEl5 = document.createElement("dialog");
    entityDetailsDialogEl5.className = "hb-entity-details-dialog electric-bed-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, state?.deviceName || "电动床");
    const element2 = document.createElement("span");
    divEl.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭电动床详情");
    entityDetailsHeadingEl.append(divEl, element3);
    const electricBedDetailsBodyEl = document.createElement("div");
    electricBedDetailsBodyEl.className = "hb-electric-bed-details-body";
    const electricBedVisualEl = document.createElement("section");
    electricBedVisualEl.className = "hb-electric-bed-visual";
    const electricBedModelEl = document.createElement("div");
    electricBedModelEl.className = "hb-electric-bed-model";
    const electricBedMattressEl = document.createElement("i");
    electricBedMattressEl.className = "hb-electric-bed-mattress";
    const electricBedBackEl = document.createElement("i");
    electricBedBackEl.className = "hb-electric-bed-back";
    const electricBedWaistEl = document.createElement("i");
    electricBedWaistEl.className = "hb-electric-bed-waist";
    const electricBedLegsEl = document.createElement("i");
    electricBedLegsEl.className = "hb-electric-bed-legs";
    const electricBedBaseEl = document.createElement("i");
    electricBedBaseEl.className = "hb-electric-bed-base";
    electricBedModelEl.append(electricBedMattressEl, electricBedBackEl, electricBedWaistEl, electricBedLegsEl, electricBedBaseEl);
    const buildElementTree = (electricBedAngleReadoutEl, electricBedAngleReadoutEl1) => {
      const readout = document.createElement("span");
      readout.className = "hb-electric-bed-angle-readout " + electricBedAngleReadoutEl;
      const strongEl = document.createElement("strong");
      const element10 = document.createElement("small");
      element10.textContent = electricBedAngleReadoutEl1;
      readout.append(strongEl, element10);
      return {
        readout,
        value: strongEl
      };
    };
    const element4 = buildElementTree("back", "靠背");
    const element5 = buildElementTree("waist", "腰部");
    const element6 = buildElementTree("legs", "腿部");
    const element7 = document.createElement("strong");
    const element8 = document.createElement("small");
    electricBedVisualEl.append(electricBedModelEl, element4.readout, element5.readout, element6.readout, element7, element8);
    const electricBedUtilitiesEl = document.createElement("section");
    electricBedUtilitiesEl.className = "hb-electric-bed-utilities";
    const electricBedMainEl = document.createElement("section");
    electricBedMainEl.className = "hb-electric-bed-main";
    const electricBedAngleControlsEl = document.createElement("section");
    electricBedAngleControlsEl.className = "hb-electric-bed-angle-controls";
    const handlers = new Map();
    const state2 = [];
    const resolveEntityId = entityId2 => {
      const state3 = this.states.get(entityId2);
      return state3?.newState || state3 || {
        entityId: entityId2,
        state: "unknown",
        attributes: {}
      };
    };
    const syncVisualState = (role, entityId2, variant = "", electricBedControlEl = electricBedAngleControlsEl) => {
      const electricBedControlEl1 = resolveEntityId(entityId2);
      const element10 = document.createElement("section");
      element10.className = "hb-electric-bed-control";
      if (role === "模式") {
        element10.classList.add("hb-electric-bed-mode");
      }
      const element11 = document.createElement("strong");
      element11.textContent = role;
      const element12 = this.createCapabilityDetailsControls(entityId2, electricBedControlEl1, {
        interactive: !preview,
        variant
      });
      element12.classList.add("hb-electric-bed-capability");
      element10.append(element11, element12);
      electricBedControlEl.append(element10);
      const sync = arg => element12.syncCapabilityState?.(arg);
      handlers.set(entityId2, [sync]);
      state2.push({
        role,
        entityId: entityId2,
        sync,
        cleanup: () => element12.cleanupCapabilityDetails?.()
      });
    };
    for (const electricBedControlEl of filtered) {
      syncVisualState(electricBedControlEl.label, electricBedControlEl.entityId);
    }
    if (text) {
      syncVisualState("模式", text, "electric-bed", electricBedUtilitiesEl);
    } else {
      const electricBedControlEl = document.createElement("section");
      electricBedControlEl.className = "hb-electric-bed-control hb-electric-bed-mode is-unavailable";
      const element10 = document.createElement("strong");
      element10.textContent = "模式";
      const capabilitySelectEl = document.createElement("select");
      capabilitySelectEl.className = "hb-capability-select";
      capabilitySelectEl.disabled = true;
      capabilitySelectEl.setAttribute("aria-label", "模式");
      const element11 = document.createElement("option");
      element11.textContent = "未识别到模式实体";
      capabilitySelectEl.append(element11);
      electricBedControlEl.append(element10, capabilitySelectEl);
      electricBedUtilitiesEl.append(electricBedControlEl);
    }
    const electricBedMemoryEl = document.createElement("section");
    electricBedMemoryEl.className = "hb-electric-bed-memory";
    const element9 = document.createElement("strong");
    element9.textContent = "记忆姿势";
    const electricBedMemoryListEl = document.createElement("div");
    electricBedMemoryListEl.className = "hb-electric-bed-memory-list";
    for (let state3 = 0; state3 < 2; state3 += 1) {
      const entityId2 = entityDetailsDialogEl[state3] || "";
      const electricBedMemoryControlEl = entityId2 ? this.entityMetadata.get(entityId2) : null;
      if (String(entityId2).split(".", 1)[0] === "select") {
        const electricBedMemoryControlEl1 = document.createElement("section");
        electricBedMemoryControlEl1.className = "hb-electric-bed-memory-control hb-electric-bed-control";
        const element11 = document.createElement("strong");
        element11.textContent = "记忆姿势 " + (state3 + 1);
        const element12 = this.createCapabilityDetailsControls(entityId2, resolveEntityId(entityId2), {
          interactive: !preview,
          variant: "electric-bed-memory",
          selectLabel: "姿势"
        });
        element12.classList.add("hb-electric-bed-capability");
        electricBedMemoryControlEl1.append(element11, element12);
        electricBedMemoryListEl.append(electricBedMemoryControlEl1);
        const sync = arg => element12.syncCapabilityState?.(arg);
        handlers.set(entityId2, [sync]);
        state2.push({
          role: "memory" + (state3 + 1),
          entityId: entityId2,
          sync,
          cleanup: () => element12.cleanupCapabilityDetails?.()
        });
        continue;
      }
      const element10 = document.createElement("button");
      element10.type = "button";
      element10.className = "hb-electric-bed-memory-button";
      element10.textContent = electricBedMemoryControlEl?.name || electricBedMemoryControlEl?.originalName || "记忆姿势 " + (state3 + 1);
      element10.disabled = preview || !entityId2;
      element10.classList.toggle("is-unavailable", !entityId2);
      element10.addEventListener("click", async () => {
        if (!preview && !!entityId2 && !element10.disabled) {
          element10.disabled = true;
          element10.classList.add("is-pending");
          try {
            await this.callEntityService("button", "press", entityId2);
            element10.classList.add("is-success");
            window.setTimeout(() => element10.classList.remove("is-success"), 900);
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element10.classList.remove("is-pending");
            element10.disabled = preview || !entityId2;
          }
        }
      });
      electricBedMemoryListEl.append(element10);
    }
    electricBedMemoryEl.append(element9, electricBedMemoryListEl);
    electricBedUtilitiesEl.append(electricBedMemoryEl);
    if (!filtered.length) {
      const element10 = document.createElement("p");
      element10.className = "hb-electric-bed-empty";
      element10.textContent = "暂未识别到角度实体";
      electricBedAngleControlsEl.append(element10);
    }
    electricBedMainEl.append(electricBedVisualEl, electricBedAngleControlsEl);
    electricBedDetailsBodyEl.append(electricBedUtilitiesEl, electricBedMainEl);
    entityDetailsCardEl.append(entityDetailsHeadingEl, electricBedDetailsBodyEl);
    entityDetailsDialogEl5.append(entityDetailsCardEl);
    const clampNumber = (detailsEntityId, fallback) => {
      const numeric = Number(fallback?.state);
      const numeric2 = Number(fallback?.attributes?.min);
      const numeric3 = Number(fallback?.attributes?.max);
      if (Number.isFinite(numeric)) {
        if (!Number.isFinite(numeric2) || !Number.isFinite(numeric3) || numeric3 <= numeric2) {
          return Math.max(0, Math.min(100, numeric));
        } else {
          return Math.max(0, Math.min(100, (numeric - numeric2) / (numeric3 - numeric2) * 100));
        }
      } else {
        return 0;
      }
    };
    const applyElementStyle = () => {
      const state3 = resolveEntityId(state1.backrest);
      const state4 = resolveEntityId(state1.leg);
      const state5 = resolveEntityId(state1.waist);
      const runHelper = entityState => {
        const numeric = Number(entityState?.state);
        if (!Number.isFinite(numeric)) {
          return "--";
        }
        const text2 = String(entityState?.attributes?.unit_of_measurement || "°");
        return "" + numeric + text2;
      };
      element4.value.textContent = runHelper(state3);
      element5.value.textContent = runHelper(state5);
      element6.value.textContent = runHelper(state4);
      electricBedVisualEl.style.setProperty("--hb-bed-backrest-angle", clampNumber(state1.backrest, state3) * -0.42 + "deg");
      electricBedVisualEl.style.setProperty("--hb-bed-leg-angle", clampNumber(state1.leg, state4) * -0.28 + "deg");
      electricBedVisualEl.style.setProperty("--hb-bed-waist-angle", clampNumber(state1.waist, state5) * -0.1 + "deg");
      const lowered = [state3, state4, state5].map(arg => String(arg?.state || "").toLowerCase());
      const state6 = lowered.some(arg => arg === "unavailable");
      const state7 = !state6 && lowered.some(arg => arg === "unknown" || !arg);
      element7.textContent = state6 ? "部分实体不可用" : state7 ? "正在读取实体" : "设备在线";
      element8.textContent = filtered.length === 3 ? "三个角度独立控制" : "正在读取电动床实体";
      element2.textContent = state6 ? "部分功能不可用" : "";
    };
    applyElementStyle();
    for (const item of filtered) {
      handlers.get(item.entityId)?.push(() => {
        applyElementStyle();
      });
    }
    if (text) {
      handlers.get(text)?.push(() => applyElementStyle());
    }
    this.detailsStateSync = {
      entityDetailsDialogEl5,
      handlers
    };
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl5);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl5;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl5, 760, 560);
    element3.addEventListener("click", () => entityDetailsDialogEl5.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl5, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogEl5.close();
      }
    });
    entityDetailsDialogEl5.addEventListener("close", () => {
      for (const item of state2) {
        item.cleanup?.();
      }
      this.clearRuntimeDialogScale(entityDetailsDialogEl5);
      if (this.detailsDialog === entityDetailsDialogEl5) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl5) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl5.show();
  }
  openInteraction3dVacuumDetails(component, detailsOptions, {
    states: states = {},
    root,
    frame,
    popupOpacity = 74,
    getPresentationLayout
  } = {}) {
    const entityId = new Set([component.entityId, ...(component.relatedEntityIds || [])]);
    let state = null;
    let entityDetailsDialogEl = "";
    const entityDetailsDialogEl1 = () => JSON.stringify([...entityId].filter(toggleEvent => /^(vacuum|select)\./.test(toggleEvent)).map(toggleEvent => {
      const newState5 = this.states.get(toggleEvent);
      const fan_speed_list = (newState5?.newState || newState5)?.attributes || {};
      return [toggleEvent, fan_speed_list.fan_speed_list, fan_speed_list.suction_level_list, fan_speed_list.cleaning_mode_list, fan_speed_list.options];
    }));
    const buildEntityStateMap = statesByEntityId => {
      for (const entityId6 of entityId) {
        const entityStateEntry = statesByEntityId[entityId6] || {
          entityId: entityId6,
          state: "unavailable",
          attributes: {}
        };
        this.states.set(entityId6, entityStateEntry);
        if (this.detailsStateSync?.dialog === state) {
          for (const childStates of this.detailsStateSync.handlers.get(entityId6) || []) {
            childStates(entityStateEntry);
          }
        }
      }
      if (state && entityDetailsDialogEl1() !== entityDetailsDialogEl) {
        vacuumDetailsSubtitleEl();
      }
    };
    buildEntityStateMap(states);
    const element = componentNode => {
      for (const type6 of componentNode || []) {
        if (type6.type === "vacuum-control" && type6.bindings?.entity?.entityId === component.entityId) {
          return type6;
        }
        const childStateMap = element(type6.children);
        if (childStateMap) {
          return childStateMap;
        }
      }
      return null;
    };
    const entityDetailsHeadingEl = (this.document?.pages || []).map(components => element(components.components)).find(Boolean);
    const divEl = entityDetailsHeadingEl?.properties?.relatedEntities?.mode === "selected" ? (entityDetailsHeadingEl.properties.relatedEntities.entityIds || []).filter(item => entityId.has(item)) : [];
    const element2 = {
      id: "vacuum:" + component.id,
      type: "vacuum-control",
      properties: {
        label: component.label,
        relatedEntities: {
          mode: "selected",
          entityIds: divEl
        }
      },
      bindings: {
        entity: {
          entityId: component.entityId
        }
      }
    };
    const vacuumDetailsSubtitleEl = () => {
      state?.removeEventListener("close", detailsOptions);
      this.showVacuumDetails(element2, {
        preview: !!this.options.editable,
        interaction3d: {
          root,
          frame,
          popupOpacity,
          getPresentationLayout
        }
      });
      state = this.detailsDialog;
      entityDetailsDialogEl = entityDetailsDialogEl1();
      state?.addEventListener("close", detailsOptions, {
        once: true
      });
    };
    vacuumDetailsSubtitleEl();
    return {
      updateStates: buildEntityStateMap,
      updateLayout: () => state?.resizeInteraction3d?.(),
      close: () => {
        state?.removeEventListener("close", detailsOptions);
        state?.close();
      },
      contains: relatedEntityId => state?.contains(relatedEntityId)
    };
  }
  showVacuumDetails(component, {
    preview: element12 = false,
    interaction3d: root2 = null
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该扫地机器人控件没有关联实体。");
    }
    const state = selectedRelatedEntityIds(component);
    this.closeRuntimeDialog();
    const state1 = this.states.get(entityId);
    let entityState = state1?.newState || state1 || {
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogEl = document.createElement("dialog");
    entityDetailsDialogEl.className = "hb-entity-details-dialog vacuum-details";
    if (root2) {
      entityDetailsDialogEl.classList.add("i3d-vacuum-details");
    }
    const append5 = document.createElement("div");
    append5.className = "hb-entity-details-card";
    append5.classList.add("hb-vacuum-details-card");
    const append6 = document.createElement("div");
    append6.className = "hb-entity-details-heading";
    const state4 = document.createElement("div");
    const vacuumDetailsStrongEl = document.createElement("strong");
    const vacuumFriendlyTitle = String(entityState.attributes?.friendly_name || "扫地机器人").replace(/^\d+/, "") || "扫地机器人";
    vacuumDetailsStrongEl.textContent = componentDialogTitle(component, vacuumFriendlyTitle);
    const vacuumDetailsSubtitleEl = document.createElement("span");
    vacuumDetailsSubtitleEl.className = "hb-vacuum-details-subtitle";
    const vacuumDetailsButtonEl = document.createElement("button");
    vacuumDetailsButtonEl.type = "button";
    vacuumDetailsButtonEl.setAttribute("aria-label", "关闭扫地机器人详情");
    vacuumDetailsButtonEl.textContent = "×";
    state4.append(vacuumDetailsStrongEl, vacuumDetailsSubtitleEl);
    append6.append(state4, vacuumDetailsButtonEl);
    const divEl = document.createElement("div");
    divEl.className = "hb-vacuum-details-layout";
    const append7 = document.createElement("section");
    append7.className = "hb-vacuum-details-overview";
    const vacuumVisualEl = document.createElement("div");
    vacuumVisualEl.className = "hb-vacuum-visual";
    const vacuumBatteryRingEl = document.createElement("div");
    vacuumBatteryRingEl.className = "hb-vacuum-battery-ring";
    const vacuumRobotEl = document.createElement("div");
    vacuumRobotEl.className = "hb-vacuum-robot";
    const vacuumRobotLidarEl = document.createElement("i");
    vacuumRobotLidarEl.className = "hb-vacuum-robot-lidar";
    const vacuumRobotSensorEl = document.createElement("i");
    vacuumRobotSensorEl.className = "hb-vacuum-robot-sensor";
    const vacuumRobotBumperEl = document.createElement("i");
    vacuumRobotBumperEl.className = "hb-vacuum-robot-bumper";
    const element6 = document.createElement("i");
    element6.className = "hb-vacuum-robot-brush";
    const vacuumRobotMopEl = document.createElement("i");
    vacuumRobotMopEl.className = "hb-vacuum-robot-mop left";
    const buildElementTree = document.createElement("i");
    buildElementTree.className = "hb-vacuum-robot-mop right";
    vacuumRobotEl.append(vacuumRobotLidarEl, vacuumRobotSensorEl, vacuumRobotBumperEl, element6, vacuumRobotMopEl, buildElementTree);
    const element7 = document.createElement("div");
    element7.className = "hb-vacuum-battery";
    const vacuumDetailsStrongEl2 = document.createElement("strong");
    const element9 = document.createElement("small");
    element9.textContent = "电量";
    element7.append(vacuumDetailsStrongEl2, element9);
    vacuumBatteryRingEl.append(vacuumRobotEl);
    append6.append(element7);
    const presenceDetailsTimelineEl = document.createElement("span");
    presenceDetailsTimelineEl.className = "hb-vacuum-visual-status";
    vacuumVisualEl.append(vacuumBatteryRingEl, presenceDetailsTimelineEl);
    const divEl1 = document.createElement("div");
    divEl1.className = "hb-vacuum-details-stats";
    const element10 = (element, element2) => {
      const append = document.createElement("div");
      const vacuumDetailsStatValueEl = document.createElement("span");
      vacuumDetailsStatValueEl.className = "hb-vacuum-details-stat-value";
      const vacuumDetailsIEl = document.createElement("i");
      vacuumDetailsIEl.textContent = element2;
      vacuumDetailsIEl.setAttribute("aria-hidden", "true");
      const statusEmphasisEl = document.createElement("strong");
      const vacuumDetailsSmallEl = document.createElement("small");
      vacuumDetailsSmallEl.textContent = element;
      vacuumDetailsStatValueEl.append(vacuumDetailsIEl, statusEmphasisEl);
      append.append(vacuumDetailsStatValueEl, vacuumDetailsSmallEl);
      divEl1.append(append);
      return statusEmphasisEl;
    };
    const element11 = element10("本次面积", "◇");
    const divEl2 = element10("清扫时长", "◷");
    if (!root2) {
      append7.append(vacuumVisualEl);
    }
    append7.append(divEl1);
    const append8 = document.createElement("section");
    append8.className = "hb-vacuum-details-controls";
    const vacuumDetailsActionsEl = document.createElement("div");
    vacuumDetailsActionsEl.className = "hb-vacuum-details-actions";
    const createChildElement = (element3, element4, element5, service) => {
      const nowMs = document.createElement("button");
      nowMs.type = "button";
      nowMs.dataset.service = service;
      nowMs.disabled = element12;
      const length = document.createElement("i");
      length.textContent = element5;
      length.setAttribute("aria-hidden", "true");
      const rounded = document.createElement("span");
      const vacuumDetailsStrongEl3 = document.createElement("strong");
      vacuumDetailsStrongEl3.textContent = element3;
      const vacuumDetailsSmallEl2 = document.createElement("small");
      vacuumDetailsSmallEl2.textContent = element4;
      rounded.append(vacuumDetailsStrongEl3, vacuumDetailsSmallEl2);
      nowMs.append(length, rounded);
      vacuumDetailsActionsEl.append(nowMs);
      return {
        button: nowMs,
        name: vacuumDetailsStrongEl3,
        description: vacuumDetailsSmallEl2
      };
    };
    const runHelper2 = [["start", "开始清扫", "启动全屋任务", "▶"], ["pause", "暂停", "保留当前进度", "Ⅱ"], ["stop", "停止", "结束当前任务", "■"], ["return_to_base", "回充", "返回充电座", "⌂"], ["locate", "定位", "让设备发出声音", "◎"], ["clean_spot", "局部清扫", "清扫当前位置", "⌖"]];
    const items = new Map(runHelper2.map(([item, item2, item3, item4]) => [item, createChildElement(item2, item3, item4, item)]));
    const state5 = items.get("start");
    const handlers = items.get("pause");
    const rendererRuntimeDialogLayerEl = items.get("stop");
    const rendererRuntimeDialogLayerEl1 = items.get("return_to_base");
    const actionEntry = items.get("locate");
    const actionEntry2 = items.get("clean_spot");
    append8.append(vacuumDetailsActionsEl);
    const normalizeModeKey = modeValue => String(modeValue || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const labels = {
      sweeping: "扫地",
      mopping: "拖地",
      sweeping_and_mopping: "扫拖同步",
      mopping_after_sweeping: "先扫后拖"
    };
    const labels2 = {
      silent: "静音",
      quiet: "静音",
      standard: "标准",
      strong: "强力",
      turbo: "超强"
    };
    const push3 = [];
    const buildOptionControl = ({
      label: element62,
      detail: element63,
      options: length,
      current: currentValue,
      labels: optionLabels,
      onSelect: onSelect,
      enabled: enabled2 = true
    }) => {
      if (!length.length) {
        return null;
      }
      const group = document.createElement("section");
      group.className = "hb-vacuum-details-option-group";
      const append2 = document.createElement("div");
      const vacuumDetailsStrongEl4 = document.createElement("strong");
      vacuumDetailsStrongEl4.textContent = element62;
      const vacuumDetailsSmallEl3 = document.createElement("small");
      vacuumDetailsSmallEl3.textContent = element63;
      append2.append(vacuumDetailsStrongEl4, vacuumDetailsSmallEl3);
      const vacuumDetailsOptionsEl = document.createElement("div");
      vacuumDetailsOptionsEl.className = "hb-vacuum-details-options";
      const entries = length.map(optionValue => {
        const key = normalizeModeKey(optionValue);
        const vacuumDetailsButtonEl2 = document.createElement("button");
        vacuumDetailsButtonEl2.type = "button";
        vacuumDetailsButtonEl2.textContent = optionLabels[key] || String(optionValue);
        vacuumDetailsButtonEl2.disabled = element12 || !enabled2;
        vacuumDetailsButtonEl2.addEventListener("click", () => onSelect(optionValue, vacuumDetailsButtonEl2));
        vacuumDetailsOptionsEl.append(vacuumDetailsButtonEl2);
        return {
          button: vacuumDetailsButtonEl2,
          key
        };
      });
      const sync = selectedValue => {
        const normalizedOption = normalizeModeKey(selectedValue);
        for (const button of entries) {
          button.button.classList.toggle("active", button.key === normalizedOption);
        }
      };
      sync(currentValue);
      push3.push({
        group,
        sync
      });
      group.append(append2, vacuumDetailsOptionsEl);
      append8.append(group);
      return {
        group,
        sync,
        entries
      };
    };
    const fan_speed_list2 = entityState.attributes || {};
    const cleaningModeEntityId = "select." + entityId.slice(entityId.indexOf(".") + 1) + "_cleaning_mode";
    const entityId22 = relatedDeviceEntity(this.entityMetadata, entityId, "select", "cleaning_mode", cleaningModeEntityId);
    const cleaningModeSelectEntityId = String(entityId22?.entityId || "");
    const newState7 = cleaningModeSelectEntityId ? this.states.get(cleaningModeSelectEntityId) : null;
    let attributes5 = newState7?.newState || newState7 || null;
    const entityId23 = relatedVacuumBatteryEntity(this.entityMetadata, this.states, entityId);
    const fanSpeedSelectEntityId = String(entityId23?.entityId || "");
    const newState8 = fanSpeedSelectEntityId ? this.states.get(fanSpeedSelectEntityId) : null;
    let batteryEntityState = newState8?.newState || newState8 || null;
    let sync2 = null;
    const syncCleaningModeFromState = state6 => {
      if (state6) {
        attributes5 = state6;
        sync2?.sync(state6.state);
      }
    };
    let vacuumServicePending = false;
    const setVacuumServicePending = pending => {
      vacuumServicePending = pending;
      append8.classList.toggle("is-pending", pending);
      for (const disabled of append8.querySelectorAll(":scope > .hb-vacuum-details-actions button, :scope > .hb-vacuum-details-option-group button")) {
        disabled.disabled = element12 || pending || disabled.dataset.unsupported === "true";
      }
    };
    const invokeVacuumService = async (domain, service, targetEntityId, serviceData, optimisticState = null, onSuccess = syncVacuumDetailsState, baseState = entityState) => {
      if (element12 || vacuumServicePending) {
        return false;
      }
      if (optimisticState) {
        onSuccess(optimisticState);
      }
      setVacuumServicePending(true);
      try {
        await this.callEntityService(domain, service, targetEntityId, serviceData);
        return true;
      } catch (optionEntry) {
        onSuccess(baseState);
        this.options.onError?.(optionEntry);
        return false;
      } finally {
        setVacuumServicePending(false);
      }
    };
    const options = Array.isArray(attributes5?.attributes?.options) ? attributes5.attributes.options : Array.isArray(fan_speed_list2.cleaning_mode_list) ? fan_speed_list2.cleaning_mode_list : [];
    const enabled = !!cleaningModeSelectEntityId;
    sync2 = buildOptionControl({
      label: "清洁模式",
      detail: enabled ? "选择本次任务方式" : "当前设备未提供模式切换实体",
      options,
      current: attributes5?.state || fan_speed_list2.cleaning_mode,
      labels,
      enabled,
      onSelect: async state3 => {
        const attributes = attributes5 || {
          state: fan_speed_list2.cleaning_mode || "unknown",
          attributes: {
            options
          }
        };
        const optimisticCleaningModeState = {
          ...attributes,
          state: state3,
          attributes: {
            ...(attributes.attributes || {}),
            options
          }
        };
        await invokeVacuumService("select", "select_option", cleaningModeSelectEntityId, {
          option: state3
        }, optimisticCleaningModeState, syncCleaningModeFromState, attributes);
      }
    });
    if (sync2 && !enabled) {
      for (const actionEntry3 of sync2.entries) {
        actionEntry3.button.dataset.unsupported = "true";
      }
    }
    const options2 = Array.isArray(fan_speed_list2.fan_speed_list) && fan_speed_list2.fan_speed_list.length ? fan_speed_list2.fan_speed_list : Array.isArray(fan_speed_list2.suction_level_list) ? fan_speed_list2.suction_level_list : [];
    const sync3 = buildOptionControl({
      label: "吸力",
      detail: "按地面情况调节",
      options: options2,
      current: fan_speed_list2.fan_speed || fan_speed_list2.suction_level,
      labels: labels2,
      onSelect: async fan_speed => {
        const attributes2 = entityState;
        const optimisticFanSpeedState = {
          ...attributes2,
          attributes: {
            ...(attributes2.attributes || {}),
            fan_speed,
            suction_level: fan_speed
          }
        };
        await invokeVacuumService("vacuum", "set_fan_speed", entityId, {
          fan_speed
        }, optimisticFanSpeedState);
      }
    });
    const stateHandlers = state !== null ? this.createWaterHeaterExtensionControls(entityId, {
      component,
      interactive: !element12,
      excludedEntityIds: [cleaningModeSelectEntityId, fanSpeedSelectEntityId].filter(Boolean)
    }) : null;
    const vacuumDetailsWarningEl = document.createElement("p");
    vacuumDetailsWarningEl.className = "hb-vacuum-details-warning";
    append8.append(vacuumDetailsWarningEl);
    divEl.append(append7, append8);
    append5.append(append6, divEl);
    if (stateHandlers) {
      append5.append(stateHandlers);
      entityDetailsDialogEl.classList.add("has-related-extensions");
    }
    entityDetailsDialogEl.append(append5);
    const vacuumStatusLabel = state7 => {
      const washing = state7?.attributes || {};
      if (washing.washing) {
        if (washing.washing_paused) {
          return "拖布清洗已暂停";
        } else {
          return "正在清洗拖布";
        }
      }
      if (washing.drying) {
        return "正在烘干拖布";
      }
      if (washing.draining) {
        return "正在排水";
      }
      if (washing.returning) {
        return "正在返回充电座";
      }
      if (washing.mapping) {
        return "正在绘制地图";
      }
      const vacuumStateKey = String(washing.vacuum_state || state7?.state || "").toLowerCase();
      return {
        cleaning: "正在清扫",
        sweeping: "正在扫地",
        mopping: "正在拖地",
        paused: "任务已暂停",
        returning: "正在返回充电座",
        docked: "已在充电座",
        charging: "正在充电",
        charging_completed: "充电完成",
        idle: "待机",
        error: "设备异常",
        unavailable: "设备不可用",
        unknown: "状态未知",
        washing: "正在清洗拖布",
        drying: "正在烘干拖布",
        mapping: "正在绘制地图"
      }[vacuumStateKey] || String(state7?.state || "状态未知");
    };
    const finiteOrFallback = (rawNumber, fallback = "--") => Number.isFinite(Number(rawNumber)) ? Number(rawNumber) : fallback;
    const isVacuumWorking = attributes3 => {
      const running2 = attributes3?.attributes || {};
      return !!running2.running || !!running2.returning || !!running2.washing || !!running2.drying || !!running2.mapping || ["cleaning", "returning"].includes(String(attributes3?.state || "").toLowerCase());
    };
    const refreshBatteryDisplay = () => {
      const batteryPercent = vacuumBatteryPercent(entityState, batteryEntityState);
      vacuumDetailsStrongEl2.textContent = batteryPercent === null ? "--" : Math.round(batteryPercent) + "%";
    };
    const updateBatteryEntityState = nextBatteryState => {
      batteryEntityState = nextBatteryState || batteryEntityState;
      refreshBatteryDisplay();
    };
    function syncVacuumDetailsState(state9) {
      if (!state9) {
        return;
      }
      entityState = state9;
      const cleaning_mode = state9.attributes || {};
      const element8 = vacuumStatusLabel(state9);
      const isWorking = isVacuumWorking(state9);
      const isPaused = !!cleaning_mode.paused || !!cleaning_mode.washing_paused || state9.state === "paused";
      const isReturning = !!cleaning_mode.returning || state9.state === "returning";
      const normalizedCleaningMode = normalizeModeKey(cleaning_mode.cleaning_mode);
      const isSweeping = ["sweeping", "sweeping_and_mopping", "mopping_after_sweeping"].includes(normalizedCleaningMode);
      const isMopping = ["mopping", "sweeping_and_mopping", "mopping_after_sweeping"].includes(normalizedCleaningMode);
      const has3 = new Set(vacuumSupportedActions(state9));
      for (const [actionKey, actionEntry4] of items) {
        actionEntry4.button.hidden = !has3.has(actionKey) || !!root2 && actionKey === "clean_spot";
      }
      const length3 = [...items.values()].filter(button2 => !button2.button.hidden);
      const visibleActionCount = length3.length;
      vacuumDetailsActionsEl.hidden = visibleActionCount === 0;
      vacuumDetailsActionsEl.classList.toggle("has-many-actions", visibleActionCount > 3);
      for (const actionEntry5 of items.values()) {
        actionEntry5.button.classList.remove("is-last-row-pair", "is-last-row-single");
      }
      const lastRowCount = visibleActionCount % 3 || Math.min(visibleActionCount, 3);
      if (lastRowCount === 2) {
        for (const actionEntry6 of length3.slice(-2)) {
          actionEntry6.button.classList.add("is-last-row-pair");
        }
      } else if (lastRowCount === 1) {
        length3.at(-1)?.button.classList.add("is-last-row-single");
      }
      vacuumDetailsSubtitleEl.textContent = element8;
      vacuumDetailsSubtitleEl.classList.toggle("is-active", isWorking && !isPaused);
      presenceDetailsTimelineEl.textContent = element8;
      refreshBatteryDisplay();
      vacuumVisualEl.classList.toggle("is-working", isWorking && !isPaused);
      vacuumVisualEl.classList.toggle("is-paused", isPaused);
      vacuumVisualEl.classList.toggle("is-returning", isReturning);
      vacuumVisualEl.classList.toggle("is-sweeping", isSweeping);
      vacuumVisualEl.classList.toggle("is-mopping", isMopping);
      element11.textContent = finiteOrFallback(cleaning_mode.cleaned_area) + " m²";
      divEl2.textContent = finiteOrFallback(cleaning_mode.cleaning_time) + " min";
      state5.button.classList.toggle("active", isWorking && !isPaused && !isReturning);
      handlers.button.classList.toggle("active", isPaused);
      rendererRuntimeDialogLayerEl.button.classList.toggle("active", false);
      rendererRuntimeDialogLayerEl1.button.classList.toggle("active", isReturning);
      actionEntry.button.classList.toggle("active", false);
      actionEntry2.button.classList.toggle("active", isWorking && !isPaused && !isReturning && state9.state === "cleaning");
      state5.name.textContent = isPaused ? "继续清扫" : "开始清扫";
      if (!cleaningModeSelectEntityId) {
        sync2?.sync(cleaning_mode.cleaning_mode);
      }
      sync3?.sync(cleaning_mode.fan_speed || cleaning_mode.suction_level);
      const errorText = String(cleaning_mode.error || "").trim();
      const lowWaterWarningText = String(cleaning_mode.low_water_warning || "").trim();
      const push2 = [];
      if (errorText && !/^no error$/i.test(errorText)) {
        push2.push(errorText);
      }
      if (lowWaterWarningText && !/^no warning$/i.test(lowWaterWarningText)) {
        push2.push(lowWaterWarningText);
      }
      vacuumDetailsWarningEl.textContent = push2.length ? "注意：" + push2.join(" · ") : "";
      vacuumDetailsWarningEl.hidden = !push2.length;
    }
    state5.button.addEventListener("click", () => invokeVacuumService("vacuum", vacuumActionService(entityState, "start"), entityId, {}, {
      ...entityState,
      state: "cleaning",
      attributes: {
        ...(entityState.attributes || {}),
        running: true,
        paused: false,
        returning: false
      }
    }));
    handlers.button.addEventListener("click", () => invokeVacuumService("vacuum", "pause", entityId, {}, {
      ...entityState,
      state: "paused",
      attributes: {
        ...(entityState.attributes || {}),
        running: false,
        paused: true
      }
    }));
    rendererRuntimeDialogLayerEl1.button.addEventListener("click", () => invokeVacuumService("vacuum", "return_to_base", entityId, {}, {
      ...entityState,
      state: "returning",
      attributes: {
        ...(entityState.attributes || {}),
        running: false,
        paused: false,
        returning: true
      }
    }));
    rendererRuntimeDialogLayerEl.button.addEventListener("click", () => invokeVacuumService("vacuum", vacuumActionService(entityState, "stop"), entityId, {}, {
      ...entityState,
      state: "idle",
      attributes: {
        ...(entityState.attributes || {}),
        running: false,
        paused: false,
        returning: false
      }
    }));
    actionEntry.button.addEventListener("click", () => invokeVacuumService("vacuum", "locate", entityId, {}));
    actionEntry2.button.addEventListener("click", () => invokeVacuumService("vacuum", "clean_spot", entityId, {}, {
      ...entityState,
      state: "cleaning",
      attributes: {
        ...(entityState.attributes || {}),
        running: true,
        paused: false,
        returning: false
      }
    }));
    syncVacuumDetailsState(entityState);
    const rendererRuntimeDialogLayerEl3 = document.createElement("div");
    rendererRuntimeDialogLayerEl3.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl3.tabIndex = -1;
    rendererRuntimeDialogLayerEl3.append(entityDetailsDialogEl);
    this.container.append(rendererRuntimeDialogLayerEl3);
    this.detailsDialog = entityDetailsDialogEl;
    const handlers2 = new Map([[entityId, [syncVacuumDetailsState]]]);
    if (cleaningModeSelectEntityId) {
      handlers2.set(cleaningModeSelectEntityId, [syncCleaningModeFromState]);
    }
    if (fanSpeedSelectEntityId) {
      handlers2.set(fanSpeedSelectEntityId, [updateBatteryEntityState]);
    }
    for (const [rendererRuntimeDialogLayerEl2, presenceTimelineItem] of stateHandlers?.stateHandlers || []) {
      handlers2.set(rendererRuntimeDialogLayerEl2, presenceTimelineItem);
    }
    this.detailsStateSync = {
      dialog: entityDetailsDialogEl,
      handlers: handlers2
    };
    let observe = null;
    if (root2) {
      rendererRuntimeDialogLayerEl3.classList.add("i3d-vacuum-dialog-layer");
      (root2.root || this.container).append(rendererRuntimeDialogLayerEl3);
      entityDetailsDialogEl.style.setProperty("--i3d-panel-opacity", String(Math.max(0, Math.min(100, Number.isFinite(root2.popupOpacity) ? root2.popupOpacity : 74)) / 100));
      const resizeInteraction3d = () => {
        const viewportRootEl = root2.root || this.container;
        const viewportWidth = viewportRootEl.clientWidth;
        const viewportHeight = viewportRootEl.clientHeight;
        const width = root2.getPresentationLayout?.();
        const contentWidth = width?.width > 0 ? width.width : viewportWidth;
        const contentHeight = width?.height > 0 ? width.height : viewportHeight;
        const scaleX = viewportWidth / Math.max(1, contentWidth);
        const scaleY = viewportHeight / Math.max(1, contentHeight);
        const scaleX2x = scaleX * 2;
        const scaleY2x = scaleY * 2;
        const panelOffsetY = Math.max(12, Math.min(contentHeight * 0.56 - 400, contentHeight - 812)) * scaleY;
        entityDetailsDialogEl.style.top = panelOffsetY + "px";
        entityDetailsDialogEl.style.right = scaleX * 16 + "px";
        entityDetailsDialogEl.style.transform = "scale(" + scaleX2x + "," + scaleY2x + ")";
        entityDetailsDialogEl.style.maxHeight = Math.max(100, (viewportHeight - panelOffsetY - scaleY * 12) / scaleY2x) + "px";
      };
      entityDetailsDialogEl.resizeInteraction3d = resizeInteraction3d;
      observe = new ResizeObserver(resizeInteraction3d);
      observe.observe(root2.root || this.container);
      if (root2.frame) {
        observe.observe(root2.frame);
      }
      resizeInteraction3d();
    } else {
      this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl3, entityDetailsDialogEl, 840, stateHandlers ? 560 : 458);
    }
    vacuumDetailsButtonEl.addEventListener("click", () => entityDetailsDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl3, entityDetailsDialogEl, append5);
    rendererRuntimeDialogLayerEl3.addEventListener("keydown", key2 => {
      if (key2.key === "Escape") {
        entityDetailsDialogEl.close();
      }
    });
    entityDetailsDialogEl.addEventListener("close", () => {
      observe?.disconnect();
      this.clearRuntimeDialogScale(entityDetailsDialogEl);
      if (this.detailsDialog === entityDetailsDialogEl) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl3.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl.show();
  }
  showPresenceDetails(component, {
    preview = false
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const entityId2 = ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(component.properties?.sensorKind) ? component.properties.sensorKind : "presence";
    const entityId1 = {
      presence: {
        title: "人在检测",
        occupied: "有人",
        clear: "无人",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "空间内检测到人",
        hintClear: "当前空间无人"
      },
      "door-window": {
        title: "门窗状态",
        occupied: "打开",
        clear: "关闭",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "门窗当前已打开",
        hintClear: "门窗当前已关闭"
      },
      "water-leak": {
        title: "水浸检测",
        occupied: "检测到水浸",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到水浸",
        hintClear: "当前未检测到水浸"
      },
      smoke: {
        title: "烟雾检测",
        occupied: "检测到烟雾",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到烟雾",
        hintClear: "当前未检测到烟雾"
      },
      "natural-gas": {
        title: "天然气检测",
        occupied: "检测到天然气",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到天然气",
        hintClear: "当前未检测到天然气"
      }
    }[entityId2];
    let component1 = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const state = Math.max(1, Math.min(168, Number(component.properties?.historyHours || 24)));
    const set = this.historySeries.get(entityId)?.points || [];
    const state1 = component.properties?.iconOnColor || component.properties?.occupiedColor || "#ffffff";
    const entityState = component.properties?.iconColor || component.properties?.clearColor || "#758189";
    const entityState1 = (presenceEntityId, now = Date.now()) => presenceSensorPresentation(presenceEntityId, "auto", {
      ...presenceMotionEventConfig(entityId, presenceEntityId, this.entityMetadata, this.states, component.properties),
      now
    });
    const entityDetailsDialogEl6 = document.createElement("dialog");
    entityDetailsDialogEl6.className = "hb-entity-details-dialog presence-details";
    entityDetailsDialogEl6.dataset.sensorKind = entityId2;
    entityDetailsDialogEl6.style.setProperty("--hb-presence-occupied", state1);
    entityDetailsDialogEl6.style.setProperty("--hb-presence-clear", entityState);
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const state4 = document.createElement("div");
    state4.className = "hb-entity-details-heading";
    const airer = document.createElement("div");
    const presenceDetailsStrongEl = document.createElement("strong");
    presenceDetailsStrongEl.textContent = componentDialogTitle(component, component1.attributes?.friendly_name || entityId1.title);
    const state5 = document.createElement("span");
    airer.append(presenceDetailsStrongEl, state5);
    const finiteNumber = document.createElement("button");
    finiteNumber.type = "button";
    finiteNumber.textContent = "×";
    finiteNumber.setAttribute("aria-label", "关闭弹窗");
    state4.append(airer, finiteNumber);
    const presenceDetailsBodyEl = document.createElement("div");
    presenceDetailsBodyEl.className = "hb-presence-details-body";
    const append9 = document.createElement("section");
    append9.className = "hb-presence-details-visual";
    let tilt = null;
    if (entityId2 === "presence") {
      const presenceSensorSpaceEl = document.createElement("span");
      presenceSensorSpaceEl.className = "hb-presence-sensor-space";
      for (let bucketIndex = 0; bucketIndex < 3; bucketIndex += 1) {
        presenceSensorSpaceEl.append(document.createElement("i"));
      }
      const presenceSensorFloorEl = document.createElement("span");
      presenceSensorFloorEl.className = "hb-presence-sensor-floor";
      const presenceSensorPersonEl = document.createElement("span");
      presenceSensorPersonEl.className = "hb-presence-sensor-person";
      const timelineIconEl = document.createElement("i");
      const timelineBoldEl = document.createElement("b");
      const presenceDetailsSpanEl = document.createElement("span");
      presenceDetailsSpanEl.className = "arm left";
      const presenceDetailsSpanEl2 = document.createElement("span");
      presenceDetailsSpanEl2.className = "arm right";
      const presenceDetailsSpanEl3 = document.createElement("span");
      presenceDetailsSpanEl3.className = "leg left";
      const presenceDetailsSpanEl4 = document.createElement("span");
      presenceDetailsSpanEl4.className = "leg right";
      presenceSensorPersonEl.append(timelineIconEl, timelineBoldEl, presenceDetailsSpanEl, presenceDetailsSpanEl2, presenceDetailsSpanEl3, presenceDetailsSpanEl4);
      append9.append(presenceSensorSpaceEl, presenceSensorFloorEl, presenceSensorPersonEl);
    } else {
      tilt = renderRegisteredComponent({
        ...component,
        position: {
          ...(component.position || {}),
          width: 100,
          height: 100
        }
      }, {
        states: new Map([[entityId, component1]]),
        entityMetadata: this.entityMetadata,
        editable: false,
        previewState: "auto",
        document: this.document
      });
      tilt.classList.add("hb-presence-details-sensor");
      append9.append(tilt);
    }
    const presenceDetailsStrongEl2 = document.createElement("strong");
    const position = document.createElement("small");
    append9.append(presenceDetailsStrongEl2, position);
    const presenceDetailsMetricsEl = document.createElement("section");
    presenceDetailsMetricsEl.className = "hb-presence-details-metrics";
    const positionCommandEntityId = element6 => {
      const append3 = document.createElement("div");
      const presenceDetailsSmallEl = document.createElement("small");
      presenceDetailsSmallEl.textContent = element6;
      const sensorNameEmphasisEl = document.createElement("strong");
      append3.append(presenceDetailsSmallEl, sensorNameEmphasisEl);
      presenceDetailsMetricsEl.append(append3);
      return sensorNameEmphasisEl;
    };
    const position2 = positionCommandEntityId("当前状态持续");
    const positionCommandState = positionCommandEntityId("最近检测到人");
    const state8 = positionCommandEntityId(state + " 小时有人时长");
    const presenceDetailsTimelineEl = document.createElement("section");
    presenceDetailsTimelineEl.className = "hb-presence-details-timeline";
    const state10 = document.createElement("div");
    const presenceDetailsStrongEl3 = document.createElement("strong");
    presenceDetailsStrongEl3.textContent = state + " 小时在家时间轴";
    const state11 = document.createElement("span");
    state11.textContent = "亮色为有人";
    state10.append(presenceDetailsStrongEl3, state11);
    const airerActionEntityIds = document.createElement("div");
    const position3 = document.createElement("div");
    position3.innerHTML = "<span>" + state + " 小时前</span><span>现在</span>";
    presenceDetailsTimelineEl.append(state10, airerActionEntityIds, position3);
    presenceDetailsBodyEl.append(append9, presenceDetailsMetricsEl, presenceDetailsTimelineEl);
    entityDetailsCardEl.append(state4, presenceDetailsBodyEl);
    entityDetailsDialogEl6.append(entityDetailsCardEl);
    const positionState = presenceState => {
      if (!Number.isFinite(presenceState)) {
        return "--";
      }
      const getFullYear = new Date(presenceState);
      const getFullYear2 = new Date();
      const isSameDay = getFullYear.getFullYear() === getFullYear2.getFullYear() && getFullYear.getMonth() === getFullYear2.getMonth() && getFullYear.getDate() === getFullYear2.getDate();
      const formatClockTime = new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(getFullYear);
      if (isSameDay) {
        return "今天 " + formatClockTime;
      } else {
        return new Intl.DateTimeFormat("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(getFullYear).replace(/\//g, "-");
      }
    };
    const motorReversed = () => {
      const length2 = presenceHistoryBuckets(set, component1, Date.now(), state, 48, presenceMotionEventConfig(entityId, component1, this.entityMetadata, this.states, component.properties));
      airerActionEntityIds.replaceChildren(...length2.map((presenceKey, bucketOffset) => {
        const presenceBucketMarkEl = document.createElement("i");
        presenceBucketMarkEl.className = "is-" + presenceKey;
        const minutesAgo = Math.round(state * 60 * (length2.length - bucketOffset - 1) / length2.length);
        presenceBucketMarkEl.title = (minutesAgo ? minutesAgo + " 分钟前" : "现在") + "：" + {
          occupied: "有人",
          clear: "无人",
          unavailable: "离线",
          unknown: "未知"
        }[presenceKey];
        return presenceBucketMarkEl;
      }));
      const occupiedBucketCount = length2.filter(bucketState => bucketState === "occupied").length;
      const occupiedMinutes = Math.round(state * 60 * occupiedBucketCount / Math.max(1, length2.length));
      state8.textContent = occupiedMinutes >= 60 ? Math.floor(occupiedMinutes / 60) + " 小时 " + occupiedMinutes % 60 + " 分钟" : occupiedMinutes + " 分钟";
    };
    const state12 = () => {
      const motionEventConfig = presenceMotionEventConfig(entityId, component1, this.entityMetadata, this.states, component.properties);
      const push = set.map(timestamp2 => ({
        timestamp: Date.parse(timestamp2?.timestamp),
        state: {
          state: timestamp2?.value
        }
      })).filter(timestamp3 => Number.isFinite(timestamp3.timestamp) && presenceSensorPresentation({
        state: timestamp3?.state?.state,
        lastChanged: new Date(timestamp3.timestamp).toISOString()
      }, "auto", {
        ...motionEventConfig,
        now: timestamp3.timestamp,
        noMotionSeconds: null,
        noMotionStateTimestamp: null
      }).key === "occupied");
      const timestamp4 = presenceStateTimestamp(component1);
      if (entityState1(component1).key === "occupied" && Number.isFinite(timestamp4)) {
        push.push({
          timestamp: timestamp4
        });
      }
      if (push.length) {
        return Math.max(...push.map(timestamp => timestamp.timestamp));
      } else {
        return null;
      }
    };
    const size = sensorConfig => {
      component1 = sensorConfig || component1;
      const key3 = entityState1(component1);
      const stateTimestamp = presenceStateTimestamp(component1);
      entityDetailsDialogEl6.dataset.presenceState = key3.key;
      append9.className = "hb-presence-details-visual is-" + key3.key;
      const element7 = entityId1[key3.key] || entityId1.unknown;
      state5.textContent = element7;
      state5.classList.toggle("is-on", key3.key === "occupied");
      presenceDetailsStrongEl2.textContent = element7;
      position.textContent = key3.key === "occupied" ? entityId1.hintOccupied : key3.key === "clear" ? entityId1.hintClear : key3.key === "unavailable" ? "设备当前不可用" : "正在等待状态";
      if (tilt) {
        const presenceSensorClassMap = {
          "door-window": "hb-door-window-sensor is-" + (key3.key === "occupied" ? "open" : key3.key),
          "water-leak": "hb-water-leak-sensor is-" + (key3.key === "occupied" ? "wet" : key3.key),
          smoke: "hb-smoke-sensor is-" + (key3.key === "occupied" ? "alert" : key3.key),
          "natural-gas": "hb-natural-gas-sensor is-" + (key3.key === "occupied" ? "alert" : key3.key)
        }[entityId2];
        tilt.className = presenceSensorClassMap + " hb-presence-details-sensor";
        tilt.dataset.sensorState = key3.key;
        tilt.setAttribute("aria-label", entityId1.title + "：" + element7);
      }
      position2.textContent = ["unknown", "unavailable"].includes(key3.key) ? "--" : formatPresenceDuration(stateTimestamp);
      positionCommandState.textContent = positionState(state12());
      motorReversed();
    };
    size(component1);
    const size1 = presenceMotionEventConfig(entityId, component1, this.entityMetadata, this.states, component.properties);
    const momentary = new Map([[entityId, [size]]]);
    for (const presenceDetailsApi of size1.companionEntityIds) {
      momentary.set(presenceDetailsApi, [() => size(component1)]);
    }
    const state13 = size1.motionEvent ? window.setInterval(() => size(component1), 1000) : null;
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl6);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl6;
    this.detailsStateSync = {
      dialog: entityDetailsDialogEl6,
      handlers: momentary
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl6, 760, 560);
    finiteNumber.addEventListener("click", () => entityDetailsDialogEl6.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl6, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", key4 => {
      if (key4.key === "Escape") {
        entityDetailsDialogEl6.close();
      }
    });
    entityDetailsDialogEl6.addEventListener("close", () => {
      if (state13) {
        window.clearInterval(state13);
      }
      this.clearRuntimeDialogScale(entityDetailsDialogEl6);
      if (this.detailsDialog === entityDetailsDialogEl6) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl6) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl6.show();
  }
  showEntityDetails(type8, {
    preview = false
  } = {}) {
    const detailsBoundEntityId = type8.bindings?.entity?.entityId;
    if (!detailsBoundEntityId) {
      throw new Error("该控件没有关联实体。");
    }
    const detailsBoundEntityIdText = String(detailsBoundEntityId);
    const size = this.deviceProfile(detailsBoundEntityIdText);
    type8 = applyXiaomiDeviceProfile(type8, size);
    const scale = detailsBoundEntityIdText.split(".", 1)[0];
    const scale1 = type8.properties?.deviceType === "electric-bed" || size?.deviceType === "electric-bed";
    if (!this.entityCatalogReady) {
      this.deferEntityDetailsUntilReady({
        ...type8,
        properties: {
          ...(type8.properties || {}),
          __catalogRetry: true
        }
      }, preview, scale1 ? "electric-bed-catalog" : "catalog");
      if (scale1) {
        this.showElectricBedLoadingDetails(type8, {
          preview
        });
      }
      return;
    }
    if (!size && scale === "number" && !type8.properties?.__catalogRetry) {
      this.deferEntityDetailsUntilReady({
        ...type8,
        properties: {
          ...(type8.properties || {}),
          __catalogRetry: true
        }
      }, preview, scale1 ? "electric-bed-catalog" : "catalog");
      if (scale1) {
        this.showElectricBedLoadingDetails(type8, {
          preview
        });
      }
      return;
    }
    if (scale === "water_heater" && !this.waterHeaterDetailsReady(detailsBoundEntityIdText)) {
      this.deferEntityDetailsUntilReady(type8, preview);
      return;
    }
    window.clearTimeout(this.pendingEntityDetails?.timer);
    this.pendingEntityDetails = null;
    if (type8.type === "presence-sensor") {
      this.showPresenceDetails(type8, {
        preview
      });
      return;
    }
    if (size?.deviceType === "electric-bed") {
      this.showElectricBedDetails(type8, {
        preview
      });
      return;
    }
    if (size?.deviceType === "air-purifier" && scale === "fan" && ["icon-button", "device-button", "icon-button-effect"].includes(type8.type)) {
      type8 = {
        ...type8,
        type: "air-purifier",
        properties: {
          ...(type8.properties || {}),
          deviceType: "air-purifier"
        }
      };
    }
    const clamped = new Set(["line-chart", "media-player", "air-purifier", "air-conditioner", "water-heater", "vacuum-control", "electric-bed"]).has(type8.type);
    if (type8.type === "media-player" || !clamped && scale === "media_player") {
      this.showMediaPlayerDetails(type8, {
        preview
      });
      return;
    }
    if (type8.type === "air-purifier") {
      this.showAirPurifierDetails(type8, {
        preview
      });
      return;
    }
    if (["air-conditioner", "bath-heater"].includes(size?.deviceType) && ["climate", "fan"].includes(scale) && !clamped && type8.type !== "air-conditioner") {
      type8 = {
        ...type8,
        type: "air-conditioner"
      };
    }
    if (type8.type === "vacuum-control" || !clamped && detailsBoundEntityIdText.startsWith("vacuum.")) {
      this.showVacuumDetails(type8, {
        preview
      });
      return;
    }
    const appliedScaleX = this.states.get(detailsBoundEntityIdText);
    const appliedScaleY = appliedScaleX?.newState || appliedScaleX;
    const friendly_name = appliedScaleY?.attributes || {};
    const isLineChart = type8.type === "line-chart";
    const isCoverEntity = !isLineChart && scale === "cover";
    const coverKind = ["standard", "dream", "airer"].includes(type8.properties?.coverKind) ? type8.properties.coverKind : "auto";
    const airer = isCoverEntity && coverComponentIsAirer(type8, detailsBoundEntityIdText, appliedScaleY, this.entityMetadata, this.deviceMetadata);
    const supportedFeatures = Number(friendly_name.supported_features || 0);
    const coverIdentityText = detailsBoundEntityIdText + " " + (friendly_name.friendly_name || "") + " " + (type8.properties?.label || "");
    const supportsTilt = Number.isFinite(Number(friendly_name.current_tilt_position)) || !!(supportedFeatures & 240);
    const looksLikeDreamCurtain = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(coverIdentityText);
    const dream = isCoverEntity && !airer && (coverKind === "dream" || coverKind === "auto" && (supportsTilt || looksLikeDreamCurtain));
    const tilt = dream && supportsTilt;
    const airerLightEntityId = (airer ? relatedAirerLightEntity(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const newState9 = airerLightEntityId ? this.states.get(airerLightEntityId) : null;
    let state10 = newState9?.newState || newState9 || null;
    const positionCommandEntityId = (airer ? relatedAirerPositionNumberEntity(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const newState10 = this.states.get(positionCommandEntityId);
    const positionCommandState = newState10?.newState || newState10 || null;
    const airerPositionSensorId = (airer ? relatedAirerCurrentPositionSensor(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const airerMotorSpeedSensorId = (airer ? relatedAirerMotorSpeedSensor(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const newState11 = this.states.get(airerMotorSpeedSensorId);
    const motorState = newState11?.newState || newState11 || null;
    const airerMotorActions = airer ? relatedAirerMotorActionEntities(this.entityMetadata, detailsBoundEntityIdText) : {};
    const airerActionEntityIds = Object.fromEntries(Object.entries(airerMotorActions).map(([item, entityId7]) => [item, entityId7?.entityId || ""]));
    const newState12 = this.states.get(airerPositionSensorId || positionCommandEntityId);
    const positionState = newState12?.newState || newState12 || null;
    const motorReversed = isCoverEntity && coverMotorIsReversedForComponent(type8, this.entityMetadata, this.states, detailsBoundEntityIdText);
    const openCoverService = motorReversed ? "open_cover" : "close_cover";
    const closeCoverService = motorReversed ? "close_cover" : "open_cover";
    const coverDirection = ["left", "right"].includes(type8.properties?.coverDirection) ? type8.properties.coverDirection : "split";
    const momentary = !isLineChart && scale === "button";
    const isSwitchEntity = !isLineChart && (momentary || ["switch", "input_boolean"].includes(scale));
    const isLightControl = type8.type === "icon-button" && scale === "light";
    const isClimateEntity = !isLineChart && (type8.type === "air-conditioner" || type8.type === "water-heater" || ["climate", "water_heater"].includes(scale));
    const deviceType = isClimateEntity ? scale === "water_heater" || type8.type === "water-heater" ? "water-heater" : resolveClimateDeviceType(type8, appliedScaleY, detailsBoundEntityIdText) : "air-conditioner";
    const climateDeviceLabelText = climateDeviceLabel(deviceType);
    const detailsDialogTitle = componentDialogTitle(type8, String(friendly_name.friendly_name || "").trim() || climateDeviceLabelText).replace(/(浴霸)(?:\s+浴霸)+$/i, "$1");
    const label = componentDialogTitle(type8, String(friendly_name.friendly_name || "").trim() || (momentary ? "按钮" : "开关"));
    const usesRichDetailsChrome = isLightControl || isClimateEntity || isSwitchEntity;
    this.closeRuntimeDialog();
    const entityIsActive = (state8, attributes4 = friendly_name) => momentary ? false : isLightControl || isSwitchEntity ? state8 === "on" : climateIsPoweredOn({
      state: state8,
      attributes: attributes4
    }, deviceType);
    const entityDetailsDialogEl7 = document.createElement("dialog");
    entityDetailsDialogEl7.className = "hb-entity-details-dialog";
    entityDetailsDialogEl7.tabIndex = -1;
    entityDetailsDialogEl7.classList.toggle("line-chart-details", isLineChart);
    entityDetailsDialogEl7.classList.toggle("light-details", isLightControl);
    entityDetailsDialogEl7.classList.toggle("cover-details", isCoverEntity);
    entityDetailsDialogEl7.classList.toggle("dream-cover-details", dream);
    entityDetailsDialogEl7.classList.toggle("airer-cover-details", airer);
    entityDetailsDialogEl7.classList.toggle("climate-details", isClimateEntity);
    entityDetailsDialogEl7.classList.toggle("bath-heater-details", deviceType === "bath-heater");
    entityDetailsDialogEl7.classList.toggle("water-heater-details", deviceType === "water-heater");
    entityDetailsDialogEl7.classList.toggle("switch-details", isSwitchEntity);
    entityDetailsDialogEl7.classList.toggle("momentary-button-details", momentary);
    const append10 = document.createElement("div");
    append10.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const append11 = document.createElement("div");
    const entityDetailsStrongEl = document.createElement("strong");
    entityDetailsStrongEl.textContent = isLightControl ? componentDialogTitle(type8, "灯光") : isCoverEntity ? componentDialogTitle(type8, airer ? "晾衣机" : "窗帘") : isClimateEntity ? detailsDialogTitle : isSwitchEntity ? label : componentDialogTitle(type8, "设备详情");
    append11.append(entityDetailsStrongEl);
    let pendingRef2 = null;
    let pendingRef3 = null;
    let rawEntityState = String(appliedScaleY?.state || "");
    let pendingRef4 = null;
    let pendingRef5 = null;
    let pendingRef6 = null;
    if (isLightControl) {
      const entityDetailsSpanEl = document.createElement("span");
      entityDetailsSpanEl.textContent = appliedScaleY?.state === "on" ? "已开启" : "已关闭";
      entityDetailsSpanEl.classList.toggle("is-on", appliedScaleY?.state === "on");
      pendingRef2 = entityDetailsSpanEl;
      append11.append(entityDetailsSpanEl);
    } else if (isCoverEntity) {
      const entityDetailsSpanEl2 = document.createElement("span");
      const physicalCoverStateValue = physicalCoverState(appliedScaleY?.state, motorReversed);
      const currentCoverPosition = Number(friendly_name[tilt ? "current_tilt_position" : "current_position"]);
      const coverStateLabels = {
        open: "已打开",
        closed: "已关闭",
        opening: "正在打开",
        closing: "正在关闭"
      };
      entityDetailsSpanEl2.textContent = airer ? coverLiftStateLabel(physicalCoverStateValue) || physicalCoverStateValue || "状态未知" : dream ? dreamCurtainStatusText(appliedScaleY?.state, currentCoverPosition, motorReversed) : coverStateLabels[physicalCoverStateValue] || physicalCoverStateValue || "状态未知";
      entityDetailsSpanEl2.classList.toggle("is-on", physicalCoverStateValue === "open" || physicalCoverStateValue === "opening");
      pendingRef3 = entityDetailsSpanEl2;
      append11.append(entityDetailsSpanEl2);
    } else if (isClimateEntity || isSwitchEntity) {
      const entityDetailsSpanEl3 = document.createElement("span");
      const isEntityActive = entityIsActive(appliedScaleY?.state);
      entityDetailsSpanEl3.textContent = momentary ? ["unknown", "unavailable"].includes(appliedScaleY?.state) ? "当前不可用" : "按下执行" : deviceType === "water-heater" ? waterHeaterStatusLabel(appliedScaleY) : ["unknown", "unavailable"].includes(appliedScaleY?.state) ? "当前不可用" : isEntityActive ? "已开启" : "已关闭";
      entityDetailsSpanEl3.classList.toggle("is-on", isEntityActive);
      if (isClimateEntity) {
        pendingRef4 = entityDetailsSpanEl3;
      } else {
        pendingRef5 = entityDetailsSpanEl3;
      }
      append11.append(entityDetailsSpanEl3);
    } else if (type8.type === "line-chart") {
      const statusTextEl = document.createElement("span");
      statusTextEl.textContent = appliedScaleY?.state == null || ["unknown", "unavailable"].includes(appliedScaleY.state) ? "暂无数据" : "实时数据";
      pendingRef6 = statusTextEl;
      append11.append(statusTextEl);
    }
    const entityDetailsButtonEl = document.createElement("button");
    entityDetailsButtonEl.type = "button";
    entityDetailsButtonEl.setAttribute("aria-label", "关闭实体详情");
    entityDetailsButtonEl.textContent = "×";
    entityDetailsHeadingEl.append(append11, entityDetailsButtonEl);
    let attributes6 = appliedScaleY;
    let syncClimateState = null;
    let coverDetailsControls = null;
    let setAttribute2 = null;
    let lightDetailsControls = null;
    let pendingRef7 = null;
    let climateDetailsControls = null;
    let switchDetailsControls = null;
    let detailsSyncToken = 0;
    const positionCalibration = airerPositionCalibration(this.entityMetadata, this.deviceMetadata, detailsBoundEntityIdText);
    let detailsDisposed = false;
    let pendingRef8 = null;
    let pendingCoverPosition = null;
    let pendingCoverState = null;
    let pendingLightBrightness = null;
    let pendingLightColorTemp = null;
    let lightInteractionActive = false;
    let climateTargetTemperature = null;
    let coverInteractionPhase = "idle";
    let statusMessageText = "";
    let toggleBathLight = null;
    let stateHandlers2 = null;
    let subscribedEntityIds = new Set();
    const relatedEntityIds2 = selectedRelatedEntityIds(type8);
    const relatedEntityIdSet = new Set(relatedEntityIds2 || []);
    if (isLightControl) {
      setAttribute2 = document.createElement("button");
      setAttribute2.type = "button";
      setAttribute2.className = "hb-light-visual";
      setAttribute2.inert = preview;
      setAttribute2.setAttribute("aria-disabled", String(preview));
      const lightVisualAuraEl = document.createElement("div");
      lightVisualAuraEl.className = "hb-light-visual-aura";
      const lightVisualLampEl = document.createElement("div");
      lightVisualLampEl.className = "hb-light-visual-lamp";
      for (const localValue of ["cord", "shade", "bulb", "filament"]) {
        const lightVisualEl = document.createElement("i");
        lightVisualEl.className = "hb-light-visual-" + localValue;
        lightVisualEl.setAttribute("aria-hidden", "true");
        lightVisualLampEl.append(lightVisualEl);
      }
      const lightVisualStatusEl = document.createElement("span");
      lightVisualStatusEl.className = "hb-light-visual-status";
      setAttribute2.append(lightVisualAuraEl, lightVisualLampEl, lightVisualStatusEl);
      const minColorTempKelvin = Number(friendly_name.min_color_temp_kelvin) || (Number.isFinite(Number(friendly_name.max_mireds)) ? 1000000 / Number(friendly_name.max_mireds) : 2000);
      const maxColorTempKelvin = Number(friendly_name.max_color_temp_kelvin) || (Number.isFinite(Number(friendly_name.min_mireds)) ? 1000000 / Number(friendly_name.min_mireds) : 6500);
      const colorTempKelvin = Number(friendly_name.color_temp_kelvin) || (Number.isFinite(Number(friendly_name.color_temp)) ? 1000000 / Number(friendly_name.color_temp) : NaN);
      const colorTemperatureKelvin = Number.isFinite(colorTempKelvin) ? colorTempKelvin : (minColorTempKelvin + maxColorTempKelvin) / 2;
      const supportsColor = lightSupportsColor(friendly_name);
      const isOn3 = {
        isOn: appliedScaleY?.state === "on",
        brightnessPercent: Number.isFinite(Number(friendly_name.brightness)) ? Number(friendly_name.brightness) / 255 * 100 : 100,
        colorTemperatureKelvin,
        colorRgb: supportsColor && Array.isArray(friendly_name.rgb_color) ? friendly_name.rgb_color.slice(0, 3).map(item => Number(item) || 0) : supportsColor && Array.isArray(friendly_name.hs_color) ? hsToRgbColor(friendly_name.hs_color) : null
      };
      const applyLightVisual = () => {
        const brightnessPercent = Math.max(1, Math.min(100, Number(isOn3.brightnessPercent) || 1));
        const visualColorTempKelvin = Math.max(2000, Math.min(6500, Number(isOn3.colorTemperatureKelvin) || 3000));
        const colorTempT = (visualColorTempKelvin - 2000) / 4500;
        const map2 = [255, 132, 42];
        const coolRgb = [172, 225, 255];
        const mixedRgbCss = "rgb(" + (isOn3.colorRgb || map2.map((item, second) => Math.round(item + (coolRgb[second] - item) * colorTempT))).join(",") + ")";
        setAttribute2.classList.toggle("is-on", isOn3.isOn);
        setAttribute2.style.setProperty("--hb-light-visual-color", mixedRgbCss);
        setAttribute2.style.setProperty("--hb-light-visual-opacity", isOn3.isOn ? String(0.08 + brightnessPercent / 100 * 0.92) : "0");
        setAttribute2.style.setProperty("--hb-light-visual-blur", Math.round(15 + brightnessPercent * 1.14) + "px");
        setAttribute2.style.setProperty("--hb-light-visual-scale", String(0.62 + brightnessPercent / 100 * 1.05));
        lightVisualStatusEl.textContent = isOn3.isOn ? Math.round(brightnessPercent) + "%  ·  " + Math.round(visualColorTempKelvin) + "K" : "灯光已关闭";
        setAttribute2.setAttribute("aria-label", lightVisualStatusEl.textContent);
      };
      lightDetailsControls = (isOn = {}) => {
        const brightness = isOn.attributes || {};
        if (typeof isOn.isOn == "boolean") {
          isOn3.isOn = isOn.isOn;
        } else if (typeof isOn.state == "string") {
          isOn3.isOn = isOn.state === "on";
        }
        if (Number.isFinite(Number(isOn.brightnessPercent))) {
          isOn3.brightnessPercent = Number(isOn.brightnessPercent);
        } else if (Number.isFinite(Number(brightness.brightness))) {
          isOn3.brightnessPercent = Number(brightness.brightness) / 255 * 100;
        }
        if (Number.isFinite(Number(isOn.colorTemperatureKelvin))) {
          isOn3.colorTemperatureKelvin = Number(isOn.colorTemperatureKelvin);
        } else if (Number.isFinite(Number(brightness.color_temp_kelvin))) {
          isOn3.colorTemperatureKelvin = Number(brightness.color_temp_kelvin);
        } else if (Number.isFinite(Number(brightness.color_temp))) {
          isOn3.colorTemperatureKelvin = 1000000 / Number(brightness.color_temp);
        }
        if (supportsColor && Array.isArray(isOn.colorRgb)) {
          isOn3.colorRgb = isOn.colorRgb.slice(0, 3).map(item => Number(item) || 0);
        } else if (supportsColor && Array.isArray(brightness.rgb_color)) {
          isOn3.colorRgb = brightness.rgb_color.slice(0, 3).map(item => Number(item) || 0);
        } else if (supportsColor && Array.isArray(brightness.hs_color)) {
          isOn3.colorRgb = hsToRgbColor(brightness.hs_color);
        }
        applyLightVisual();
      };
      applyLightVisual();
    }
    if (isCoverEntity) {
      pendingRef7 = document.createElement("button");
      pendingRef7.type = "button";
      pendingRef7.className = "hb-cover-visual";
      pendingRef7.inert = preview;
      pendingRef7.setAttribute("aria-disabled", String(preview));
      const coverVisualRailEl = document.createElement("i");
      coverVisualRailEl.className = "hb-cover-visual-rail";
      const coverVisualPanelEl = document.createElement("i");
      coverVisualPanelEl.className = "hb-cover-visual-panel left";
      const coverVisualPanelEl2 = document.createElement("i");
      coverVisualPanelEl2.className = "hb-cover-visual-panel right";
      const coverVisualSlatsEl = document.createElement("span");
      coverVisualSlatsEl.className = "hb-cover-visual-slats";
      const bladeCount = 13;
      for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex += 1) {
        const coverVisualSlatEl = document.createElement("span");
        coverVisualSlatEl.className = "hb-cover-visual-slat";
        const bladeEl = document.createElement("i");
        coverVisualSlatEl.style.setProperty("--hb-cover-slat-index", String(bladeIndex));
        const bladeDepth = coverDirection === "right" ? bladeCount - 1 - bladeIndex : coverDirection === "split" ? Math.abs((bladeCount - 1) / 2 - bladeIndex) : bladeIndex;
        coverVisualSlatEl.style.setProperty("--hb-cover-slat-delay-index", String(bladeDepth));
        const bladeOffsetX = coverDirection === "left" ? -bladeIndex * 14.5 : coverDirection === "right" ? (bladeCount - 1 - bladeIndex) * 14.5 : bladeIndex <= (bladeCount - 1) / 2 ? -bladeIndex * 14.5 : (bladeCount - 1 - bladeIndex) * 14.5;
        coverVisualSlatEl.style.setProperty("--hb-cover-retracted-shift", bladeOffsetX + "px");
        coverVisualSlatEl.append(bladeEl);
        coverVisualSlatsEl.append(coverVisualSlatEl);
      }
      const coverVisualWindowEl = document.createElement("i");
      coverVisualWindowEl.className = "hb-cover-visual-window";
      pendingRef7.classList.toggle("is-dream", dream);
      pendingRef7.classList.toggle("is-airer", airer);
      pendingRef7.classList.add("direction-" + coverDirection);
      pendingRef7.append(coverVisualWindowEl, coverVisualRailEl, coverVisualPanelEl, coverVisualPanelEl2, coverVisualSlatsEl);
      if (airer) {
        appendAirerVisual(pendingRef7);
      }
      switchDetailsControls = (lightState = state10) => {
        if (!airer) {
          return;
        }
        state10 = lightState || state10;
        const isAirerLightUnavailable = !airerLightEntityId || ["unknown", "unavailable"].includes(String(state10?.state || "unknown"));
        const isAirerLightOn = state10?.state === "on";
        pendingRef7.classList.toggle("is-light-on", isAirerLightOn && !isAirerLightUnavailable);
        pendingRef7.classList.toggle("is-light-unavailable", isAirerLightUnavailable);
        pendingRef7.disabled = preview || isAirerLightUnavailable;
        pendingRef7.setAttribute("aria-pressed", String(isAirerLightOn && !isAirerLightUnavailable));
        pendingRef7.setAttribute("aria-label", isAirerLightUnavailable ? "晾衣机灯光实体不可用" : "晾衣机灯光" + (isAirerLightOn ? "已开启，点击关闭" : "已关闭，点击开启"));
      };
      switchDetailsControls();
      climateDetailsControls = ({
        position: options = 0,
        state: state5 = ""
      } = {}) => {
        const current_position = Math.max(0, Math.min(100, Number(options) || 0));
        const coverPresentation = coverPresentationState({
          state: state5,
          attributes: {
            current_position
          }
        }, motorReversed);
        const resolvedPhysicalCoverState = physicalCoverState(state5 || rawEntityState, motorReversed);
        const isCoverOpenOrOpening = resolvedPhysicalCoverState === "open" || resolvedPhysicalCoverState === "opening";
        detailsSyncToken = current_position;
        pendingRef7.style.setProperty("--hb-cover-open-position", current_position + "%");
        pendingRef7.style.setProperty("--hb-airer-drop", airerVisualDrop(current_position) + "px");
        pendingRef7.style.setProperty("--hb-cover-panel-width", 45.9 - current_position * 0.331 + "%");
        pendingRef7.style.setProperty("--hb-cover-single-panel-width", 91.8 - current_position * 0.79 + "%");
        pendingRef7.style.setProperty("--hb-cover-slat-angle", current_position * 1.8 + "deg");
        pendingRef7.classList.toggle("is-tilt-reversed", current_position > 50);
        pendingRef7.classList.toggle("is-tilt-center", Math.abs(current_position - 50) <= 2);
        pendingRef7.classList.toggle("is-open", dream ? isCoverOpenOrOpening : coverPresentation === "open" || coverPresentation === "opening");
        pendingRef7.classList.toggle("is-moving", state5 === "opening" || state5 === "closing");
        pendingRef7.setAttribute("aria-pressed", String(dream ? isCoverOpenOrOpening : coverPresentation === "open" || coverPresentation === "opening"));
        if (!airer) {
          pendingRef7.setAttribute("aria-label", dream ? "" + componentDialogTitle(type8, "梦幻帘") + dreamCurtainStatusText(state5 || rawEntityState, current_position, motorReversed) : "" + componentDialogTitle(type8, "窗帘") + (coverPresentation === "open" || coverPresentation === "opening" ? "已打开，点击关闭" : "已关闭，点击打开"));
        }
      };
      climateDetailsControls({
        position: Number.isFinite(Number(friendly_name[tilt ? "current_tilt_position" : "current_position"])) ? Number(friendly_name[tilt ? "current_tilt_position" : "current_position"]) : appliedScaleY?.state === "open" ? 100 : 0,
        state: appliedScaleY?.state
      });
      pendingRef7.addEventListener("click", async () => {
        if (preview || detailsDisposed) {
          return;
        }
        detailsDisposed = true;
        pendingRef7.setAttribute("aria-busy", "true");
        if (airer) {
          const airerLightState = state10;
          switchDetailsControls({
            ...(state10 || {}),
            state: state10?.state === "on" ? "off" : "on"
          });
          try {
            await this.callEntityService("homeassistant", "toggle", airerLightEntityId);
          } catch (socketPayload) {
            switchDetailsControls(airerLightState);
            this.options.onError?.(socketPayload);
          } finally {
            detailsDisposed = false;
            pendingRef7.removeAttribute("aria-busy");
          }
          return;
        }
        const position2 = detailsSyncToken;
        const isDreamRetracted = syncClimateState?.isDreamCurtainRetracted?.() ?? pendingRef7.dataset.curtainRetracted === "true";
        const isCoverOpenPosition = position2 > COVER_CLOSED_POSITION_EPSILON;
        if (dream) {
          syncClimateState?.beginDreamCurtainMotion?.(!isDreamRetracted);
        }
        if (!dream) {
          syncClimateState?.beginCoverMotion?.(isCoverOpenPosition ? 0 : 100, isCoverOpenPosition ? "closing" : "opening");
        }
        try {
          await this.callEntityService("cover", dream ? dreamCurtainToggleService(isDreamRetracted, closeCoverService, openCoverService) : isCoverOpenPosition ? openCoverService : closeCoverService, detailsBoundEntityIdText);
        } catch (presenceBucket) {
          if (dream) {
            syncClimateState?.cancelDreamCurtainMotion?.();
            syncClimateState?.setDreamCurtainRetracted?.(isDreamRetracted, false);
          } else {
            syncClimateState?.cancelCoverMotion?.();
          }
          syncClimateState?.syncCoverState?.(appliedScaleY);
          climateDetailsControls({
            position: position2,
            state: appliedScaleY?.state
          });
          this.options.onError?.(presenceBucket);
        } finally {
          detailsDisposed = false;
          pendingRef7.removeAttribute("aria-busy");
        }
      });
    }
    if (isClimateEntity) {
      const relatedPopupOptions = {
        entityId: detailsBoundEntityIdText,
        entityMetadata: this.entityMetadata,
        entityTranslations: this.entityTranslations
      };
      pendingRef8 = document.createElement("button");
      pendingRef8.type = "button";
      pendingRef8.className = "hb-climate-visual";
      pendingRef8.classList.toggle("is-bath-heater", deviceType === "bath-heater");
      pendingRef8.classList.toggle("is-water-heater", deviceType === "water-heater");
      pendingRef8.inert = preview;
      pendingRef8.setAttribute("aria-disabled", String(preview));
      const climateVisualUnitEl = document.createElement("div");
      climateVisualUnitEl.className = "hb-climate-visual-unit";
      const climateVisualBrandEl = document.createElement("span");
      climateVisualBrandEl.className = "hb-climate-visual-brand";
      climateVisualBrandEl.textContent = deviceType === "bath-heater" ? "BATH HEATER" : deviceType === "water-heater" ? "SMART WATER" : "SMART AIR";
      const climateVisualDisplayEl = document.createElement("strong");
      climateVisualDisplayEl.className = "hb-climate-visual-display";
      const climateVisualVentEl = document.createElement("div");
      climateVisualVentEl.className = "hb-climate-visual-vent";
      for (let dragStartX = 0; dragStartX < 5; dragStartX += 1) {
        climateVisualVentEl.append(document.createElement("i"));
      }
      climateVisualUnitEl.append(climateVisualBrandEl, climateVisualDisplayEl, climateVisualVentEl);
      const climateVisualAirflowEl = document.createElement("div");
      climateVisualAirflowEl.className = "hb-climate-visual-airflow";
      for (let dragStartY = 0; dragStartY < 3; dragStartY += 1) {
        climateVisualAirflowEl.append(document.createElement("i"));
      }
      pendingRef8.append(climateVisualUnitEl, climateVisualAirflowEl);
      pendingCoverPosition = ({
        mode: options = "off",
        visualMode: visualMode2 = "off",
        running: options2 = false,
        accentColor: options3 = "#65717a",
        targetTemperature: temperature
      } = {}) => {
        const isClimateModeOn = visualMode2 !== "off";
        pendingRef8.classList.toggle("is-on", isClimateModeOn);
        pendingRef8.classList.toggle("is-running", options2);
        pendingRef8.classList.toggle("is-airflow-mode", deviceType === "bath-heater" && isClimateModeOn && bathHeaterModeUsesAirflow(options));
        pendingRef8.dataset.visualMode = visualMode2;
        pendingRef8.style.setProperty("--hb-climate-visual-accent", options3);
        const hasFiniteTemperature = temperature != null && temperature !== "" && Number.isFinite(Number(temperature));
        climateVisualDisplayEl.textContent = isClimateModeOn ? hasFiniteTemperature ? Number(temperature) + "°" : climateModeLabel(options, deviceType, relatedPopupOptions) : "OFF";
      };
    }
    if (isSwitchEntity) {
      const visual = buildSwitchVisual({
        label,
        interactive: !preview,
        momentary,
        onToggle: () => pendingLightColorTemp?.()
      });
      pendingCoverState = visual.visual;
      pendingLightBrightness = visual.sync;
      pendingLightBrightness(entityIsActive(appliedScaleY?.state), {
        unavailable: ["unknown", "unavailable"].includes(appliedScaleY?.state)
      });
    }
    const entityDetailsStateEl = document.createElement(usesRichDetailsChrome ? "button" : "div");
    entityDetailsStateEl.className = "hb-entity-details-state";
    if (usesRichDetailsChrome) {
      entityDetailsStateEl.type = "button";
    }
    const entityDetailsSpanEl4 = document.createElement("span");
    entityDetailsSpanEl4.textContent = usesRichDetailsChrome ? "⏻" : "当前状态";
    const entityDetailsStrongEl2 = document.createElement("strong");
    const hvacModeLabels = {
      off: "关闭",
      auto: "自动",
      cool: "制冷",
      dry: "除湿",
      heat: "制热",
      fan_only: "送风",
      heat_cool: "冷暖自动"
    };
    entityDetailsStrongEl2.textContent = usesRichDetailsChrome ? appliedScaleY?.state ? entityIsActive(appliedScaleY.state) ? "已开启" : "已关闭" : "状态未知" : scale === "climate" ? hvacModeLabels[appliedScaleY?.state] || appliedScaleY?.state || "暂无状态" : appliedScaleY?.state ?? "暂无状态";
    entityDetailsStateEl.classList.toggle("hb-light-details-power", isLightControl);
    entityDetailsStateEl.classList.toggle("hb-climate-details-power", isClimateEntity);
    entityDetailsStateEl.classList.toggle("hb-switch-details-power", isSwitchEntity);
    entityDetailsStateEl.classList.toggle("is-on", usesRichDetailsChrome && entityIsActive(appliedScaleY?.state));
    entityDetailsStateEl.append(entityDetailsSpanEl4, entityDetailsStrongEl2);
    if (usesRichDetailsChrome) {
      entityDetailsStateEl.inert = preview;
      entityDetailsStateEl.setAttribute("aria-disabled", String(preview));
      coverDetailsControls = (isOn2, {
        unavailable = false,
        syncClimate: options = true
      } = {}) => {
        entityDetailsStateEl.classList.toggle("is-on", isOn2);
        entityDetailsStateEl.classList.toggle("is-unavailable", unavailable);
        entityDetailsStateEl.setAttribute("aria-pressed", String(isOn2));
        entityDetailsStateEl.disabled = unavailable || preview;
        entityDetailsStrongEl2.textContent = unavailable ? "当前不可用" : momentary ? coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "执行中" : "等待执行" : isOn2 ? "已开启" : "已关闭";
        entityDetailsStateEl.setAttribute("aria-label", unavailable ? (isLightControl ? componentDialogTitle(type8, "灯光") : isClimateEntity ? detailsDialogTitle : label) + "当前不可用" : momentary ? "" + label + (coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "正在执行" : "，点击执行") : "" + componentDialogTitle(type8, isLightControl ? "灯光" : isClimateEntity ? climateDeviceLabelText : "开关") + (isOn2 ? "已开启，点击关闭" : "已关闭，点击开启"));
        if (isLightControl) {
          lightDetailsControls?.({
            isOn: isOn2
          });
          pendingRef2.textContent = isOn2 ? "已开启" : "已关闭";
          pendingRef2.classList.toggle("is-on", isOn2);
          setAttribute2.setAttribute("aria-pressed", String(isOn2));
          setAttribute2.setAttribute("aria-label", "" + componentDialogTitle(type8, "灯光") + (isOn2 ? "已开启，点击关闭" : "已关闭，点击开启"));
        }
        if (isClimateEntity && syncClimateState?.syncClimateState && options) {
          const operationModes = normalizeClimateCapabilities(attributes6 || appliedScaleY);
          const preferredOperationMode = deviceType === "water-heater" ? operationModes.operationModes.find(item => !["off", "空"].includes(String(item).trim().toLowerCase())) || "普通" : operationModes.hvacModes.find(item => item !== "off") || (deviceType === "bath-heater" ? "heat" : "auto");
          const lastClimateMode = syncClimateState.dataset.lastClimateMode || (appliedScaleY?.state && appliedScaleY.state !== "off" ? appliedScaleY.state : preferredOperationMode);
          syncClimateState.syncClimateState({
            state: isOn2 ? deviceType === "water-heater" ? "on" : lastClimateMode : "off",
            attributes: {
              ...(attributes6?.attributes || appliedScaleY?.attributes || {}),
              operation_mode: deviceType === "water-heater" ? isOn2 ? attributes6?.attributes?.operation_mode || preferredOperationMode : "off" : undefined,
              hvac_action: deviceType === "water-heater" ? undefined : isOn2 ? appliedScaleY?.attributes?.hvac_action || lastClimateMode : "off"
            }
          });
        }
        if (isClimateEntity) {
          pendingRef4.textContent = deviceType === "water-heater" ? waterHeaterStatusLabel({
            ...(attributes6 || appliedScaleY || {}),
            state: isOn2 ? "on" : "off"
          }) : isOn2 ? "已开启" : "已关闭";
          pendingRef4.classList.toggle("is-on", isOn2);
          if (deviceType === "bath-heater") {
            if (!toggleBathLight) {
              pendingRef8.setAttribute("aria-pressed", "false");
            }
            pendingRef8.setAttribute("aria-label", detailsDialogTitle + "，点击切换浴霸灯");
          } else {
            pendingRef8.setAttribute("aria-pressed", String(isOn2));
            pendingRef8.setAttribute("aria-label", "" + detailsDialogTitle + (isOn2 ? "已开启，点击关闭" : "已关闭，点击开启"));
          }
        }
        if (isSwitchEntity) {
          pendingLightBrightness?.(isOn2, {
            pending: lightInteractionActive && coverInteractionPhase !== "success",
            success: coverInteractionPhase === "success",
            unavailable
          });
          pendingRef5.textContent = unavailable ? "当前不可用" : momentary ? coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "正在执行" : "按下执行" : isOn2 ? "已开启" : "已关闭";
          pendingRef5.classList.toggle("is-on", (momentary ? lightInteractionActive || coverInteractionPhase === "success" : isOn2) && !unavailable);
        }
      };
      if (appliedScaleY?.state) {
        coverDetailsControls(entityIsActive(appliedScaleY.state), {
          unavailable: ["unknown", "unavailable"].includes(appliedScaleY.state)
        });
      }
      pendingLightColorTemp = async () => {
        if (preview || lightInteractionActive || !attributes6?.state) {
          return;
        }
        lightInteractionActive = true;
        const setAttribute = isLightControl ? setAttribute2 : isClimateEntity ? pendingRef8 : pendingCoverState;
        setAttribute?.setAttribute("aria-busy", "true");
        const isSwitchOn = entityDetailsStateEl.classList.contains("is-on");
        const nextSwitchPowerOn = momentary || !isSwitchOn;
        coverDetailsControls(nextSwitchPowerOn);
        try {
          if (momentary) {
            await this.callEntityService("button", "press", detailsBoundEntityIdText);
            coverInteractionPhase = "success";
            coverDetailsControls(false);
            await new Promise(item => window.setTimeout(item, 900));
          } else if (isClimateEntity) {
            if (!nextSwitchPowerOn && deviceType === "bath-heater") {
              const preset_mode = normalizeClimateCapabilities(attributes6).presetModes.find(onPowerChange => ["idle", "standby", "待机", "关闭"].includes(String(onPowerChange).trim().toLowerCase()));
              if (preset_mode) {
                await this.callEntityService(scale === "fan" ? "fan" : "climate", "set_preset_mode", detailsBoundEntityIdText, {
                  preset_mode
                });
              }
            }
            const domain = climatePowerCommand(detailsBoundEntityIdText, attributes6, nextSwitchPowerOn, deviceType, syncClimateState?.dataset.lastClimateMode || "");
            await this.callEntityService(domain.domain, domain.service, detailsBoundEntityIdText, domain.data);
          } else {
            await this.callEntityService("homeassistant", "toggle", detailsBoundEntityIdText);
          }
        } catch (climateModeOption) {
          coverInteractionPhase = "idle";
          coverDetailsControls(isSwitchOn);
          this.options.onError?.(climateModeOption);
        } finally {
          lightInteractionActive = false;
          if (momentary) {
            coverInteractionPhase = "idle";
            coverDetailsControls(false);
          } else if (isSwitchEntity) {
            pendingLightBrightness?.(entityDetailsStateEl.classList.contains("is-on"));
          }
          setAttribute?.removeAttribute("aria-busy");
        }
      };
      entityDetailsStateEl.addEventListener("click", pendingLightColorTemp);
      if (isLightControl) {
        setAttribute2.addEventListener("click", pendingLightColorTemp);
      }
      if (isClimateEntity) {
        pendingRef8.addEventListener("click", () => {
          if (deviceType === "bath-heater") {
            if (toggleBathLight?.toggleBathLight) {
              toggleBathLight.toggleBathLight();
            } else {
              this.options.onError?.(new Error("未找到与浴霸同设备的灯光实体。"));
            }
            return;
          }
          pendingLightColorTemp();
        });
      }
    }
    const buildClimateControls = isClimateEntity ? climateState => this.createClimateDetailsControls(detailsBoundEntityIdText, climateState, {
      interactive: !preview,
      deviceType,
      onPowerChange: item => coverDetailsControls?.(item, {
        syncClimate: false
      }),
      onVisualChange: ({
        mode,
        visualMode,
        running,
        accentColor,
        accentSoft: item,
        targetTemperature
      }) => {
        entityDetailsStateEl.classList.toggle("is-running", running);
        entityDetailsStateEl.style.setProperty("--hb-climate-accent", accentColor);
        entityDetailsStateEl.style.setProperty("--hb-climate-accent-soft", item);
        pendingRef4.style.setProperty("--hb-climate-accent", accentColor);
        if (deviceType === "water-heater") {
          pendingRef4.textContent = visualMode === "off" ? "已关闭" : running ? "正在加热" : "保温中";
        }
        pendingCoverPosition?.({
          mode,
          visualMode,
          running,
          accentColor,
          targetTemperature
        });
      },
      modeColors: {
        cool: type8.properties?.airflowCoolColor || "#73c8ff",
        heat: type8.properties?.airflowHeatColor || "#ff8a65",
        other: type8.properties?.airflowOtherColor || "#dce2e6"
      }
    }) : null;
    syncClimateState = isLightControl ? this.createLightDetailsControls(detailsBoundEntityIdText, appliedScaleY, {
      interactive: !preview,
      onTurnOn: () => coverDetailsControls?.(true),
      onVisualChange: coverPosition => lightDetailsControls?.(coverPosition)
    }) : isClimateEntity ? buildClimateControls(appliedScaleY) : isCoverEntity ? this.createCoverDetailsControls(detailsBoundEntityIdText, appliedScaleY, {
      interactive: !preview,
      dream,
      airer,
      tilt,
      motorReversed,
      positionState,
      positionCommandEntityId,
      positionCommandState,
      motorState,
      airerActionEntityIds,
      positionCalibration,
      onVisualChange: ({
        position,
        state
      }) => {
        if (state) {
          rawEntityState = state;
        }
        climateDetailsControls?.({
          position,
          state
        });
        const updatedCoverPresentation = coverPresentationState({
          state,
          attributes: {
            current_position: position
          }
        }, motorReversed);
        const coverStatusLabels = {
          open: "已打开",
          closed: "已关闭",
          opening: "正在打开",
          closing: "正在关闭"
        };
        const baselinePhysicalCoverState = physicalCoverState(rawEntityState, motorReversed);
        pendingRef3.textContent = airer ? coverLiftStateLabel(updatedCoverPresentation) || Math.round(position) + "%" : dream ? dreamCurtainStatusText(rawEntityState, position, motorReversed) : coverStatusLabels[updatedCoverPresentation] || Math.round(position) + "%";
        pendingRef3.classList.toggle("is-on", dream ? baselinePhysicalCoverState === "open" || baselinePhysicalCoverState === "opening" : updatedCoverPresentation === "open" || updatedCoverPresentation === "opening");
      },
      onCurtainPositionChange: ({
        retracted: item,
        moving: item2
      }) => {
        pendingRef7.classList.toggle("is-curtain-retracted", item);
        pendingRef7.classList.toggle("is-curtain-moving", item2);
        pendingRef7.dataset.curtainRetracted = String(item);
        if (dream) {
          pendingRef3.textContent = dreamCurtainStatusFromRetraction(item, item2, detailsSyncToken);
          pendingRef3.classList.toggle("is-on", item);
        }
      }
    }) : null;
    if (isLightControl && syncClimateState?.classList.contains("has-color-picker")) {
      entityDetailsDialogEl7.classList.add("color-picker-details");
    }
    if (isClimateEntity && deviceType === "water-heater" && syncClimateState && pendingRef8) {
      syncClimateState.prepend(pendingRef8);
      syncClimateState.syncClimateGrid?.();
    }
    const bathHeaterLightEntityId = isClimateEntity && deviceType === "bath-heater" && size?.roles?.light || "";
    statusMessageText = (bathHeaterLightEntityId ? this.entityMetadata.get(bathHeaterLightEntityId) : isClimateEntity && deviceType === "bath-heater" ? relatedDeviceDomainEntity(this.entityMetadata, detailsBoundEntityIdText, "light") : null)?.entityId || "";
    if (statusMessageText && syncClimateState) {
      const newState6 = this.states.get(statusMessageText);
      const relatedEntityState = newState6?.newState || newState6 || {
        state: "unknown",
        attributes: {}
      };
      toggleBathLight = this.createBathHeaterLightControl(statusMessageText, relatedEntityState, {
        interactive: !preview,
        onStateChange: ({
          isOn: item,
          unavailable: item2
        }) => {
          pendingRef8?.classList.toggle("is-light-on", item && !item2);
          pendingRef8?.setAttribute("aria-pressed", String(item && !item2));
        }
      });
      syncClimateState.append(toggleBathLight);
      syncClimateState.syncClimateGrid?.();
    }
    const refreshEntityCatalog = isClimateEntity && (deviceType === "water-heater" || relatedEntityIds2 !== null) ? () => {
      const activeEntityIdSet = subscribedEntityIds;
      const relatedEntityIds = this.createWaterHeaterExtensionControls(detailsBoundEntityIdText, {
        component: type8,
        interactive: !preview,
        excludedEntityIds: statusMessageText ? [statusMessageText] : []
      });
      stateHandlers2?.remove();
      stateHandlers2 = relatedEntityIds;
      subscribedEntityIds = new Set(relatedEntityIds?.relatedEntityIds || []);
      syncClimateState?.classList.toggle("has-multiline-water-heater-extensions", deviceType === "water-heater" && Number(relatedEntityIds?.dataset?.controlCount || 0) > 2);
      if (deviceType !== "water-heater" && append10.isConnected) {
        entityDetailsDialogEl7.classList.toggle("has-related-extensions", !!relatedEntityIds);
      }
      if (relatedEntityIds && syncClimateState) {
        if (deviceType === "water-heater") {
          (syncClimateState.waterHeaterControlPanel || syncClimateState).append(relatedEntityIds);
          syncClimateState.syncClimateGrid?.();
        } else if (append10.isConnected) {
          append10.append(relatedEntityIds);
          entityDetailsDialogEl7.classList.add("has-related-extensions");
        }
      }
      const entryMap = this.detailsStateSync?.handlers;
      if (entryMap) {
        for (const detailsStateSyncApi of activeEntityIdSet) {
          entryMap.delete(detailsStateSyncApi);
        }
        for (const [relatedEntityRef, entityIdCandidate] of relatedEntityIds?.stateHandlers || []) {
          entryMap.set(relatedEntityRef, entityIdCandidate);
          const newState2 = this.states.get(relatedEntityRef);
          if (newState2) {
            for (const detailsCleanup of entityIdCandidate) {
              detailsCleanup(newState2.newState || newState2);
            }
          }
        }
      }
    } : null;
    refreshEntityCatalog?.();
    let lineChartDetailsView = type8.type === "line-chart" ? renderLineChartDetails(type8, {
      states: this.states,
      history: this.historySeries,
      renderNamespace: this.renderNamespace
    }) : null;
    let lineChartDetailsView2 = null;
    let pendingRef9 = null;
    let pendingRef10 = null;
    const entityDetailsAttributesEl = document.createElement("dl");
    entityDetailsAttributesEl.className = "hb-entity-details-attributes";
    for (const [item, item1] of Object.entries(friendly_name).filter(([item]) => item !== "friendly_name")) {
      const append4 = document.createElement("div");
      const entityDetailsDtEl = document.createElement("dt");
      entityDetailsDtEl.textContent = item;
      const entityDetailsDdEl = document.createElement("dd");
      entityDetailsDdEl.textContent = typeof item1 == "string" ? item1 : JSON.stringify(item1);
      append4.append(entityDetailsDtEl, entityDetailsDdEl);
      entityDetailsAttributesEl.append(append4);
    }
    if (lineChartDetailsView) {
      lineChartDetailsView2 = document.createElement("section");
      lineChartDetailsView2.className = "hb-line-chart-current-visual";
      lineChartDetailsView2.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      pendingRef9 = document.createElement("strong");
      const numericSensorValue = Number.parseFloat(appliedScaleY?.state);
      pendingRef9.textContent = Number.isFinite(numericSensorValue) ? formatLineChartValue(numericSensorValue, type8.properties?.statePrecision) : appliedScaleY?.state || "--";
      pendingRef10 = document.createElement("small");
      pendingRef10.textContent = String(friendly_name.unit_of_measurement || "实时数值");
      lineChartDetailsView2.append(pendingRef9, pendingRef10);
      entityDetailsStateEl.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      entityDetailsSpanEl4.textContent = "●";
      entityDetailsStrongEl2.textContent = "实时数据";
      append10.append(entityDetailsHeadingEl, lineChartDetailsView2, lineChartDetailsView);
    } else if (isClimateEntity) {
      append10.append(entityDetailsHeadingEl, ...(deviceType === "water-heater" ? [syncClimateState] : [pendingRef8, syncClimateState]), ...(deviceType !== "water-heater" && stateHandlers2 ? [stateHandlers2] : []));
      entityDetailsDialogEl7.classList.toggle("has-related-extensions", deviceType !== "water-heater" && !!stateHandlers2);
    } else if (isLightControl) {
      const lightDetailsLayoutEl = document.createElement("div");
      lightDetailsLayoutEl.className = "hb-light-details-layout";
      const lightDetailsPanelEl = document.createElement("section");
      lightDetailsPanelEl.className = "hb-light-details-panel";
      lightDetailsPanelEl.append(...(syncClimateState ? [syncClimateState] : []));
      lightDetailsLayoutEl.append(lightDetailsPanelEl, setAttribute2);
      append10.append(entityDetailsHeadingEl, lightDetailsLayoutEl);
    } else if (isSwitchEntity) {
      const switchDetailsLayoutEl = document.createElement("div");
      switchDetailsLayoutEl.className = "hb-switch-details-layout";
      switchDetailsLayoutEl.append(pendingCoverState);
      append10.append(entityDetailsHeadingEl, switchDetailsLayoutEl);
    } else if (isCoverEntity) {
      const coverDetailsLayoutEl = document.createElement("div");
      coverDetailsLayoutEl.className = "hb-cover-details-layout";
      const coverDetailsPanelEl = document.createElement("section");
      coverDetailsPanelEl.className = "hb-cover-details-panel";
      coverDetailsPanelEl.append(...(syncClimateState ? [syncClimateState] : []));
      coverDetailsLayoutEl.append(coverDetailsPanelEl, pendingRef7);
      append10.append(entityDetailsHeadingEl, coverDetailsLayoutEl);
    } else if (entityDetailsAttributesEl.childElementCount) {
      append10.append(entityDetailsHeadingEl, entityDetailsStateEl, ...(syncClimateState ? [syncClimateState] : []), entityDetailsAttributesEl);
    } else {
      const entityDetailsEmptyEl = document.createElement("p");
      entityDetailsEmptyEl.className = "hb-entity-details-empty";
      entityDetailsEmptyEl.textContent = "该实体暂无附加属性。";
      entityDetailsAttributesEl.replaceWith(entityDetailsEmptyEl);
      append10.append(entityDetailsHeadingEl, entityDetailsStateEl, ...(syncClimateState ? [syncClimateState] : []), entityDetailsEmptyEl);
    }
    entityDetailsDialogEl7.append(append10);
    const rendererRuntimeDialogLayerEl2 = document.createElement("div");
    rendererRuntimeDialogLayerEl2.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl2.tabIndex = -1;
    rendererRuntimeDialogLayerEl2.append(entityDetailsDialogEl7);
    this.container.append(rendererRuntimeDialogLayerEl2);
    this.detailsDialog = entityDetailsDialogEl7;
    const detailsDialogWidth = isClimateEntity ? 840 : type8.type === "line-chart" ? 780 : isLightControl || isCoverEntity ? 760 : isSwitchEntity ? 620 : 460;
    const detailsDialogHeight = isClimateEntity ? deviceType !== "water-heater" && stateHandlers2 ? 620 : 540 : isLightControl || isCoverEntity ? 620 : isSwitchEntity ? 500 : 680;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl2, entityDetailsDialogEl7, detailsDialogWidth, detailsDialogHeight);
    let detailsSyncTimer = 0;
    if (type8.type === "line-chart" && lineChartDetailsView) {
      const runDetailsStateSync = () => {
        detailsSyncTimer = 0;
        if (!lineChartDetailsView?.isConnected || this.detailsStateSync?.dialog !== entityDetailsDialogEl7) {
          return;
        }
        const lineChartDetailsHandle = renderLineChartDetails(type8, {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace
        });
        lineChartDetailsView.cleanupLineChartHover?.();
        lineChartDetailsView.replaceWith(lineChartDetailsHandle);
        lineChartDetailsView = lineChartDetailsHandle;
        lineChartDetailsView2.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      };
      const scheduleDetailsStateSync = (delayMs = 700) => {
        detailsSyncTimer ||= window.setTimeout(runDetailsStateSync, Math.max(0, Number(delayMs) || 0));
      };
      this.detailsStateSync = {
        dialog: entityDetailsDialogEl7,
        entityId: detailsBoundEntityIdText,
        refreshHistory: () => scheduleDetailsStateSync(0),
        apply: state2 => {
          const parsedSensorNumber = Number.parseFloat(state2?.state);
          pendingRef9.textContent = Number.isFinite(parsedSensorNumber) ? formatLineChartValue(parsedSensorNumber, type8.properties?.statePrecision) : state2?.state || "--";
          pendingRef10.textContent = String(state2?.attributes?.unit_of_measurement || "实时数值");
          pendingRef6.textContent = state2?.state == null || ["unknown", "unavailable"].includes(state2.state) ? "暂无数据" : "实时数据";
          lineChartDetailsView.syncLineChartState?.(state2);
          lineChartDetailsView2.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
        }
      };
    } else if (usesRichDetailsChrome && coverDetailsControls) {
      const applyEntityDetailsState = state4 => {
        attributes6 = state4;
        if (isClimateEntity && buildClimateControls && syncClimateState) {
          const climateStructureKey = climateControlStructureKey(detailsBoundEntityIdText, state4, deviceType);
          if (syncClimateState.dataset.climateStructureKey !== climateStructureKey) {
            const climateControlsRoot = buildClimateControls(state4);
            climateControlsRoot.classList.toggle("has-multiline-water-heater-extensions", syncClimateState.classList.contains("has-multiline-water-heater-extensions"));
            climateControlsRoot.classList.add("is-runtime-hydrated");
            if (deviceType === "water-heater" && pendingRef8) {
              climateControlsRoot.prepend(pendingRef8);
            }
            if (toggleBathLight) {
              climateControlsRoot.append(toggleBathLight);
              climateControlsRoot.syncClimateGrid?.();
            }
            if (stateHandlers2 && deviceType === "water-heater") {
              (climateControlsRoot.waterHeaterControlPanel || climateControlsRoot).append(stateHandlers2);
              climateControlsRoot.syncClimateGrid?.();
            }
            syncClimateState.replaceWith(climateControlsRoot);
            syncClimateState = climateControlsRoot;
          }
        }
        if (state4?.state) {
          coverDetailsControls(entityIsActive(state4.state, state4.attributes), {
            unavailable: ["unknown", "unavailable"].includes(state4.state)
          });
        }
        syncClimateState?.syncLightState?.(state4);
        syncClimateState?.syncClimateState?.(state4);
      };
      const set2 = new Map([[detailsBoundEntityIdText, [applyEntityDetailsState]]]);
      if (statusMessageText && toggleBathLight) {
        set2.set(statusMessageText, [stateHandler => toggleBathLight.syncBathLightState?.(stateHandler)]);
      }
      if (stateHandlers2?.stateHandlers) {
        for (const [runtimeHandlerRef, runtimeCleanupRef] of stateHandlers2.stateHandlers) {
          set2.set(runtimeHandlerRef, runtimeCleanupRef);
        }
      }
      this.detailsStateSync = {
        dialog: entityDetailsDialogEl7,
        handlers: set2,
        refreshEntityCatalog
      };
      if (isClimateEntity && syncClimateState?.querySelector(".hb-climate-details-loading")) {
        const openedAtMs = Date.now();
        climateTargetTemperature = window.setInterval(() => {
          const newState3 = this.states.get(detailsBoundEntityIdText);
          const incomingEntityState = newState3?.newState || newState3;
          if (incomingEntityState) {
            applyEntityDetailsState(incomingEntityState);
          }
          if (!syncClimateState?.querySelector(".hb-climate-details-loading") || Date.now() - openedAtMs >= 30000) {
            window.clearInterval(climateTargetTemperature);
            climateTargetTemperature = null;
          }
        }, 120);
      }
    } else if (isCoverEntity) {
      const map = new Map([[detailsBoundEntityIdText, [item => syncClimateState?.syncCoverState?.(item)]]]);
      if (airerLightEntityId) {
        map.set(airerLightEntityId, [switchDetailsControls]);
      }
      if (airerPositionSensorId) {
        map.set(airerPositionSensorId, [item => syncClimateState?.syncCoverPositionState?.(item)]);
      }
      if (positionCommandEntityId) {
        map.set(positionCommandEntityId, [item => {
          syncClimateState?.syncCoverPositionCommandState?.(item);
          if (!airerPositionSensorId) {
            syncClimateState?.syncCoverPositionState?.(item);
          }
        }]);
      }
      if (airerMotorSpeedSensorId) {
        map.set(airerMotorSpeedSensorId, [item => syncClimateState?.syncAirerMotorState?.(item)]);
      }
      this.detailsStateSync = {
        dialog: entityDetailsDialogEl7,
        handlers: map
      };
    }
    entityDetailsButtonEl.addEventListener("click", () => entityDetailsDialogEl7.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl2, entityDetailsDialogEl7, append10);
    rendererRuntimeDialogLayerEl2.addEventListener("keydown", key5 => {
      if (key5.key === "Escape") {
        entityDetailsDialogEl7.close();
      }
    });
    entityDetailsDialogEl7.addEventListener("close", () => {
      window.clearTimeout(detailsSyncTimer);
      window.clearInterval(climateTargetTemperature);
      climateTargetTemperature = null;
      syncClimateState?.cleanupLightDetails?.();
      syncClimateState?.cleanupClimateDetails?.();
      syncClimateState?.cleanupCoverDetails?.();
      lineChartDetailsView?.cleanupLineChartHover?.();
      this.clearRuntimeDialogScale(entityDetailsDialogEl7);
      if (this.detailsDialog === entityDetailsDialogEl7) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl7) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl2.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl7.show();
    entityDetailsDialogEl7.focus({
      preventScroll: true
    });
  }
  resize() {
    if (!this.viewport || !this.document) {
      return;
    }
    const socketGeneration = this.container.clientWidth;
    const documentModel = this.container.clientHeight;
    if (!socketGeneration || !documentModel) {
      return;
    }
    const index = socketGeneration / this.document.canvas.width;
    const filtered = documentModel / this.document.canvas.height;
    const entityIds1 = this.options.scaleMode || this.document.canvas.scaleMode || "contain";
    const found = entityIds1 === "cover" ? Math.max(index, filtered) : Math.min(index, filtered);
    const entityIds = entityIds1 === "stretch" ? index : found;
    const state = entityIds1 === "stretch" ? filtered : found;
    this.appliedScaleX = entityIds;
    this.appliedScaleY = state;
    this.canvas.style.transform = "scale(" + entityIds + ", " + state + ")";
    this.viewport.style.width = this.document.canvas.width * entityIds + "px";
    this.viewport.style.height = this.document.canvas.height * state + "px";
    this.container.dataset.viewportAspect = (socketGeneration / documentModel).toFixed(3);
    this.container.dataset.renderScale = Math.min(entityIds, state).toFixed(4);
    for (const [presenceSensorRow, presenceHistoryPoint] of this.componentHosts) {
      this.updateTransformHandleScale(presenceHistoryPoint, this.componentRecords.get(presenceSensorRow));
    }
    this.updateMultiSelectionHandleScale(this.canvas.querySelector(":scope > .hb-multi-selection-bounds"));
    this.updateRuntimeDialogScale();
  }
  disconnectRuntime() {
    this.socketGeneration += 1;
    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    window.clearTimeout(this.runtimeHydrationRetryTimer);
    this.runtimeHydrationRetryTimer = null;
    const readyState = this.socket;
    this.socket = null;
    this.runtimeSubscription = null;
    if (!readyState || readyState.readyState >= WebSocket.CLOSING) {
      return;
    }
    if (readyState.readyState !== WebSocket.CONNECTING) {
      readyState.close();
      return;
    }
    let socketCloseTimer;
    const cleanupSocketWait = () => {
      window.clearTimeout(socketCloseTimer);
      readyState.removeEventListener("open", forceCloseSocket);
      readyState.removeEventListener("close", cleanupSocketWait);
    };
    const forceCloseSocket = () => {
      cleanupSocketWait();
      if (readyState.readyState < WebSocket.CLOSING) {
        readyState.close();
      }
    };
    readyState.addEventListener("open", forceCloseSocket, {
      once: true
    });
    readyState.addEventListener("close", cleanupSocketWait, {
      once: true
    });
    socketCloseTimer = window.setTimeout(forceCloseSocket, 12000);
  }
  connectRuntime({
    force: entityId5 = false
  } = {}) {
    if (!this.document || this.destroyed) {
      this.disconnectRuntime();
      return;
    }
    const historyRetryAttempt = this.page || this.document.pages?.[0];
    const state = new Map((this.document.sharedComponents || []).map(id => [id.id, id]));
    const runtimeComponents = [...(historyRetryAttempt?.sharedComponentIds || []).map(socketEvent => state.get(socketEvent)).filter(Boolean), ...(historyRetryAttempt?.components || [])];
    const add2 = collectEntityIds(runtimeComponents);
    const modules = this.activePopupId ? (this.document.customPopups || []).find(id2 => String(id2.id || "") === this.activePopupId) : null;
    for (const entityId20 of modules?.modules || []) {
      if (entityId20.entityId && !isVirtualEntityId(entityId20.entityId)) {
        add2.add(entityId20.entityId);
      }
    }
    for (const subscribedEntityList of [...add2]) {
      if (this.entityMetadata.get(subscribedEntityList)?.domain !== "event") {
        continue;
      }
      const properties2 = collectComponents(runtimeComponents, type5 => type5.type === "presence-sensor" && type5.bindings?.entity?.entityId === subscribedEntityList)[0];
      if (!properties2) {
        continue;
      }
      const companionEntityIds = presenceMotionEventConfig(subscribedEntityList, this.states.get(subscribedEntityList), this.entityMetadata, this.states, properties2.properties);
      for (const runtimeEntityIds of companionEntityIds.companionEntityIds) {
        add2.add(runtimeEntityIds);
      }
    }
    for (const pageEntityIds of [...add2]) {
      const deviceId2 = this.entityMetadata.get(pageEntityIds);
      if (deviceId2?.domain !== "sensor" || !deviceId2.deviceId || !["state", "status", "task_status"].includes(deviceId2.translationKey)) {
        continue;
      }
      const entityId11 = [...this.entityMetadata.values()].find(deviceId => deviceId.deviceId === deviceId2.deviceId && deviceId.domain === "vacuum" && entityMetadataIsAvailable(deviceId));
      if (entityId11?.entityId) {
        add2.add(entityId11.entityId);
      }
    }
    for (const slice of [...add2]) {
      if (this.entityMetadata.get(slice)?.domain !== "vacuum") {
        continue;
      }
      const entityLocalId = slice.slice(slice.indexOf(".") + 1);
      const entityId12 = relatedDeviceEntity(this.entityMetadata, slice, "select", "cleaning_mode", "select." + entityLocalId + "_cleaning_mode");
      if (entityId12?.entityId) {
        add2.add(entityId12.entityId);
      }
      const entityId13 = relatedVacuumBatteryEntity(this.entityMetadata, this.states, slice);
      if (entityId13?.entityId) {
        add2.add(entityId13.entityId);
      }
    }
    for (const coverEntityId of [...add2]) {
      if ((this.entityMetadata.get(coverEntityId)?.domain || String(coverEntityId || "").split(".", 1)[0]) !== "cover") {
        continue;
      }
      const entityId14 = relatedCoverMotorReverseEntity(this.entityMetadata, coverEntityId);
      if (entityId14?.entityId) {
        add2.add(entityId14.entityId);
      }
      const entityId15 = relatedAirerLightEntity(this.entityMetadata, coverEntityId);
      if (entityId15?.entityId) {
        add2.add(entityId15.entityId);
      }
      const entityId16 = relatedAirerPositionNumberEntity(this.entityMetadata, coverEntityId);
      if (entityId16?.entityId) {
        add2.add(entityId16.entityId);
      }
      const entityId17 = relatedAirerCurrentPositionSensor(this.entityMetadata, coverEntityId);
      if (entityId17?.entityId) {
        add2.add(entityId17.entityId);
      }
      const entityId18 = relatedAirerMotorSpeedSensor(this.entityMetadata, coverEntityId);
      if (entityId18?.entityId) {
        add2.add(entityId18.entityId);
      }
      const coverMotorActions = relatedAirerMotorActionEntities(this.entityMetadata, coverEntityId);
      for (const entityId9 of Object.values(coverMotorActions)) {
        if (entityId9?.entityId) {
          add2.add(entityId9.entityId);
        }
      }
    }
    for (const popupEntityIds of [...add2]) {
      const domain2 = this.entityMetadata.get(popupEntityIds);
      if (!["climate", "fan"].includes(String(domain2?.domain || ""))) {
        continue;
      }
      const entityId19 = relatedDeviceDomainEntity(this.entityMetadata, popupEntityIds, "light");
      if (entityId19?.entityId) {
        add2.add(entityId19.entityId);
      }
    }
    for (const effectEntityIds of [...add2]) {
      if (this.entityMetadata.get(effectEntityIds)?.domain === "water_heater") {
        for (const entityId8 of relatedWaterHeaterEntities(this.entityMetadata, effectEntityIds)) {
          add2.add(entityId8.entityId);
        }
      }
    }
    for (const allRuntimeEntityIds of [...add2]) {
      const roles = this.deviceProfile(allRuntimeEntityIds);
      if (roles) {
        for (const roleKey of ["climate", "cover", "fan", "light", "power", "mode", "temperature", "humidity", "pm25", "hcho", "pm10", "filterLife", "filterLeftTime", "airQuality", "backrest", "leg", "waist", "memory1", "memory2"]) {
          const roleBoundEntityId = roles.roles?.[roleKey];
          if (roleBoundEntityId) {
            add2.add(roleBoundEntityId);
          }
        }
      }
    }
    const length4 = [...add2];
    if (!length4.length) {
      this.disconnectRuntime();
      this.runtimeHydrationRetryAttempt = 0;
      return;
    }
    if (length4.length > MAX_REALTIME_SUBSCRIBED_ENTITIES) {
      this.disconnectRuntime();
      const runtimeEntityLimitSignature = String(length4.length);
      if (this.runtimeEntityLimitSignature !== runtimeEntityLimitSignature) {
        this.runtimeEntityLimitSignature = runtimeEntityLimitSignature;
        this.options.onError?.(new Error("当前项目需要实时订阅 " + length4.length + " 个实体，已超过 " + MAX_REALTIME_SUBSCRIBED_ENTITIES + " 个上限。请减少统计或控件中绑定的实体。"));
      }
      return;
    }
    this.runtimeEntityLimitSignature = "";
    const signature = JSON.stringify([...length4].sort());
    const signature2 = this.runtimeSubscription;
    const isSocketConnecting = this.socket?.readyState === WebSocket.CONNECTING;
    const isSocketOpen = this.socket?.readyState === WebSocket.OPEN;
    if (!entityId5 && signature2 && (isSocketConnecting || isSocketOpen && signature2.signature === signature)) {
      signature2.entityIds = length4;
      signature2.runtimeComponents = runtimeComponents;
      signature2.signature = signature;
      if (isSocketOpen) {
        this.scheduleRuntimeHydrationRetry(signature2, this.socketGeneration);
      }
      return;
    }
    if (signature2?.signature !== signature) {
      this.runtimeHydrationRetryAttempt = 0;
    }
    this.disconnectRuntime();
    const socketGeneration = this.socketGeneration;
    const entityIds = {
      entityIds: length4,
      runtimeComponents,
      signature
    };
    this.runtimeSubscription = entityIds;
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const addEventListener = new WebSocket(wsProtocol + "://" + window.location.host + "/api/v1/ws/runtime");
    this.socket = addEventListener;
    addEventListener.addEventListener("open", () => {
      if (socketGeneration === this.socketGeneration) {
        if (this.reconnectAttempt > 0) {
          window.HABridgeLog?.report("success", "实时连接", "实时状态连接已恢复", {
            phase: "websocket-reconnected",
            path: "/api/v1/ws/runtime"
          });
        }
        this.reconnectAttempt = 0;
        addEventListener.send(JSON.stringify({
          type: "subscribe",
          entityIds: entityIds.entityIds
        }));
      }
    });
    addEventListener.addEventListener("message", data => {
      if (socketGeneration !== this.socketGeneration) {
        return;
      }
      const {
        entityIds: wsUrl
      } = entityIds;
      let entityId10;
      try {
        entityId10 = JSON.parse(data.data);
      } catch (reconnectTimerRef) {
        window.HABridgeLog?.error(reconnectTimerRef, {
          phase: "websocket-message",
          path: "/api/v1/ws/runtime"
        }, "实时状态消息格式异常");
        return;
      }
      if (entityId10.type === "snapshot") {
        const map = entityId10.states || [];
        const has = new Set(map.map(entityId => String(entityId?.entityId || "")).filter(Boolean));
        for (const socketMessageHandler of wsUrl) {
          if (!has.has(socketMessageHandler)) {
            if (this.states.has(socketMessageHandler)) {
              this.removedRuntimeEntityIds.add(socketMessageHandler);
            }
            this.states.delete(socketMessageHandler);
          }
        }
        for (const entityId2 of map) {
          if (this.optimisticStateIsConfirmed(entityId2.entityId, entityId2)) {
            this.rememberLightVisualState(entityId2.entityId, entityId2);
            this.removedRuntimeEntityIds.delete(entityId2.entityId);
            this.states.set(entityId2.entityId, entityId2);
            this.applyRuntimeStateHandlers(entityId2.entityId, entityId2.newState || entityId2);
          }
        }
        this.options.onRuntimeStateChange?.(map);
        this.tryOpenPendingEntityDetails();
        for (const entityId3 of map) {
          this.refreshVacuumMapEntity(entityId3.entityId);
        }
        if (this.detailsStateSync?.handlers) {
          for (const [historyEntityRef, historyHoursRef] of this.detailsStateSync.handlers) {
            const newState = this.states.get(historyEntityRef);
            if (newState) {
              for (const value of historyHoursRef) {
                value(newState.newState || newState);
              }
            }
          }
        } else {
          const newState4 = this.detailsStateSync ? this.states.get(this.detailsStateSync.entityId) : null;
          if (this.detailsStateSync && newState4) {
            this.detailsStateSync.apply(newState4.newState || newState4);
          }
        }
        this.refreshRuntimeComponents([...has, ...this.removedRuntimeEntityIds]);
        this.scheduleRuntimeHydrationRetry(entityIds, socketGeneration);
      } else if (entityId10.type === "state_removed") {
        const entityId4 = String(entityId10.entityId || "");
        if (!entityId4) {
          return;
        }
        const unavailableStateEvent = {
          type: "state_changed",
          entityId: entityId4,
          domain: entityId4.split(".", 1)[0],
          state: "unavailable",
          attributes: {},
          available: false
        };
        this.removedRuntimeEntityIds.add(entityId4);
        this.states.delete(entityId4);
        this.options.onRuntimeStateChange?.([]);
        this.tryOpenPendingEntityDetails();
        if (this.detailsStateSync?.handlers?.has(entityId4)) {
          for (const parsedSocketMessage of this.detailsStateSync.handlers.get(entityId4)) {
            parsedSocketMessage(unavailableStateEvent);
          }
        } else if (this.detailsStateSync?.entityId === entityId4) {
          this.detailsStateSync.apply(unavailableStateEvent);
        }
        this.applyRuntimeStateHandlers(entityId4, unavailableStateEvent);
        this.refreshRuntimeComponents([entityId4]);
        for (const stateChangedPayload of this.runtimeEntityComponentIndex.get(entityId4) || []) {
          const type2 = this.componentRecords.get(stateChangedPayload);
          if (["line-chart", "camera", "vacuum-map"].includes(type2?.type)) {
            this.refreshRuntimeComponent(stateChangedPayload);
          }
        }
        this.refreshVacuumMapEntity(entityId4);
      } else if (entityId10.type === "resync_required") {
        if (socketGeneration === this.socketGeneration && !this.destroyed) {
          this.connectRuntime({
            force: true
          });
        }
      } else if (entityId10.type === "state_changed") {
        if (!this.optimisticStateIsConfirmed(entityId10.entityId, entityId10)) {
          return;
        }
        this.rememberLightVisualState(entityId10.entityId, entityId10);
        this.removedRuntimeEntityIds.delete(entityId10.entityId);
        this.states.set(entityId10.entityId, entityId10);
        this.options.onRuntimeStateChange?.([entityId10]);
        this.tryOpenPendingEntityDetails();
        this.refreshVacuumMapEntity(entityId10.entityId);
        if (this.detailsStateSync?.handlers?.has(entityId10.entityId)) {
          for (const entityStateUpdate of this.detailsStateSync.handlers.get(entityId10.entityId)) {
            entityStateUpdate(entityId10.newState || entityId10);
          }
        } else if (this.detailsStateSync?.entityId === entityId10.entityId) {
          this.detailsStateSync.apply(entityId10.newState || entityId10);
        }
        this.applyRuntimeStateHandlers(entityId10.entityId, entityId10.newState || entityId10);
        this.scheduleRuntimeRender(entityId10.entityId);
      }
    });
    addEventListener.addEventListener("close", code => {
      if (socketGeneration !== this.socketGeneration || this.destroyed) {
        return;
      }
      this.socket = null;
      this.runtimeSubscription = null;
      window.clearTimeout(this.runtimeHydrationRetryTimer);
      this.runtimeHydrationRetryTimer = null;
      window.HABridgeLog?.report("warning", "实时连接", "实时状态连接已断开（" + code.code + "）" + ([4400, 4401, 4403].includes(code.code) ? "" : "，正在重连"), {
        code: code.code,
        phase: "websocket-disconnected",
        path: "/api/v1/ws/runtime"
      });
      if (code.code === 4401) {
        const isDisplayPath = window.location.pathname.startsWith("/display/") || window.location.pathname.startsWith("/habridge/");
        window.location.assign(isDisplayPath ? "/pair?next=" + encodeURIComponent("" + window.location.pathname + window.location.search) : "/login");
        return;
      }
      if (code.code === 4403) {
        window.location.replace("/license");
        return;
      }
      if (code.code === 4400) {
        const disconnectReason = code.reason === "too many entities" ? "当前项目的实时订阅实体超过 " + MAX_REALTIME_SUBSCRIBED_ENTITIES + " 个，已停止重连。请减少统计或控件中绑定的实体。" : "实时状态订阅请求无效，已停止自动重连。";
        this.options.onError?.(new Error(disconnectReason));
        return;
      }
      const reconnectDelayMs = Math.min(2 ** this.reconnectAttempt * 1000, 15000);
      this.reconnectAttempt += 1;
      this.reconnectTimer = window.setTimeout(() => this.connectRuntime(), reconnectDelayMs);
    });
    addEventListener.addEventListener("error", () => {
      if (addEventListener.readyState === WebSocket.OPEN) {
        addEventListener.close();
      }
    });
  }
  scheduleRuntimeHydrationRetry(closeEvent, messageEvent) {
    const documentGeneration = () => {
      const {
        entityIds: filter,
        runtimeComponents: historyTarget
      } = closeEvent;
      const has2 = new Set(collectComponents(historyTarget, type => type.type === "line-chart").map(bindings => String(bindings.bindings?.entity?.entityId || "")).filter(Boolean));
      return filter.filter(item => has2.has(item) && lineChartRuntimeStateNeedsHydration(this.states.get(item))).length > 0;
    };
    if (!documentGeneration()) {
      window.clearTimeout(this.runtimeHydrationRetryTimer);
      this.runtimeHydrationRetryTimer = null;
      this.runtimeHydrationRetryAttempt = 0;
      return;
    }
    if (this.runtimeHydrationRetryTimer || !(this.runtimeHydrationRetryAttempt < 5)) {
      return;
    }
    this.runtimeHydrationRetryAttempt += 1;
    const popupGeneration = Math.min(10000, 2 ** (this.runtimeHydrationRetryAttempt - 1) * 500);
    this.runtimeHydrationRetryTimer = window.setTimeout(() => {
      this.runtimeHydrationRetryTimer = null;
      if (messageEvent === this.socketGeneration && !this.destroyed) {
        if (documentGeneration()) {
          this.connectRuntime({
            force: true
          });
        } else {
          this.runtimeHydrationRetryAttempt = 0;
        }
      }
    }, popupGeneration);
  }
  refreshHistorySeries() {
    if (!this.document || this.destroyed || document.visibilityState === "hidden") {
      return;
    }
    const historyRefreshKey = [this.historyDocumentGeneration, this.page?.path || "", this.activePopupId || "", this.historyPopupGeneration].join(":");
    return this.historyRefreshCoordinator.request(historyRefreshKey, () => this.refreshHistorySeriesPass());
  }
  scheduleHistoryRetry() {
    if (this.destroyed || document.visibilityState === "hidden" || this.historyRetryTimer || this.historyRetryAttempt >= 4) {
      return;
    }
    const retryAttempt = this.historyRetryAttempt;
    const retryDelayMs = Math.min(8000, 2 ** retryAttempt * 1000);
    this.historyRetryAttempt += 1;
    this.historyRetryTimer = window.setTimeout(() => {
      this.historyRetryTimer = 0;
      this.refreshHistorySeries();
    }, retryDelayMs);
  }
  async refreshHistorySeriesPass() {
    if (!this.document || this.destroyed || document.visibilityState === "hidden") {
      return;
    }
    const documentGeneration = this.historyDocumentGeneration;
    const popupGeneration = this.historyPopupGeneration;
    const pagePath = this.page?.path || "";
    const get2 = new Map();
    const collectHistoryTargets = (documentModel, shared) => {
      const historyCapableComponents = collectComponents(documentModel, type4 => type4.type === "line-chart" || type4.type === "presence-sensor");
      for (const properties of historyCapableComponents) {
        const boundEntityId = properties.bindings?.entity?.entityId;
        if (!boundEntityId) {
          continue;
        }
        const isPresenceSensor = properties.type === "presence-sensor";
        const updateIntervalSec = Math.max(30, Math.min(86400, Number(isPresenceSensor ? 300 : properties.properties?.updateInterval || 600)));
        const historyHours = Math.max(1, Math.min(168, Number(isPresenceSensor ? properties.properties?.historyHours || 24 : properties.properties?.hours || 24)));
        const interval = get2.get(boundEntityId);
        get2.set(boundEntityId, {
          interval: Math.min(interval?.interval ?? updateIntervalSec, updateIntervalSec),
          hours: Math.max(interval?.hours ?? historyHours, historyHours),
          documentGeneration,
          shared: !!interval?.shared || !!shared.shared,
          pagePath: interval?.pagePath ?? shared.pagePath ?? null,
          popupId: interval?.popupId ?? shared.popupId ?? null,
          popupGeneration
        });
      }
    };
    collectHistoryTargets(this.document.sharedComponents || [], {
      shared: true
    });
    collectHistoryTargets(this.page?.components || [], {
      pagePath
    });
    const modules2 = this.activePopupId ? (this.document.customPopups || []).find(id3 => String(id3.id || "") === this.activePopupId) : null;
    const push4 = [];
    for (const entityId21 of modules2?.modules || []) {
      if (entityId21.type === "line-chart" && entityId21.entityId) {
        push4.push({
          type: "line-chart",
          bindings: {
            entity: {
              entityId: entityId21.entityId
            }
          },
          properties: syncedLineChartProperties(this.document, this.page, entityId21.entityId, entityId21.properties)
        });
      }
    }
    collectHistoryTargets(push4, {
      popupId: this.activePopupId || null
    });
    const passStartedAtMs = Date.now();
    let historyFetchFailed = false;
    let historyFetchAborted = false;
    const length5 = [...get2];
    const historyRequestContext = () => ({
      documentGeneration: this.historyDocumentGeneration,
      pagePath: this.page?.path || "",
      popupId: this.activePopupId || null,
      popupGeneration: this.historyPopupGeneration
    });
    const fetchNextHistorySeries = async () => {
      while (length5.length) {
        const [entityId5, hours] = length5.shift();
        if (this.destroyed || !historyRequestStillRelevant(hours, historyRequestContext())) {
          continue;
        }
        const existingSeries = this.historySeries.get(entityId5);
        const seriesCacheEntry = this.historySeriesCache.get(historySeriesCacheKey(entityId5, hours.hours));
        const fetchedAt3 = [existingSeries, seriesCacheEntry].filter(points => points && points.hours === hours.hours && Array.isArray(points.points) && points.points.length > 0).sort((fetchedAt, fetchedAt2) => fetchedAt2.fetchedAt - fetchedAt.fetchedAt)[0];
        if (fetchedAt3 && passStartedAtMs - fetchedAt3.fetchedAt < hours.interval * 1000) {
          if (existingSeries !== fetchedAt3) {
            this.historySeries.set(entityId5, fetchedAt3);
            historyFetchFailed = true;
          }
          continue;
        }
        if (this.historyFetches.has(entityId5)) {
          continue;
        }
        this.historyFetches.add(entityId5);
        const abort = typeof AbortController == "function" ? new AbortController() : null;
        const historyFetchTimeoutId = window.setTimeout(() => abort?.abort(), HISTORY_FETCH_TIMEOUT_MS);
        try {
          const ok = await fetch("/api/v1/ha/history?entityId=" + encodeURIComponent(entityId5) + "&hours=" + hours.hours, {
            credentials: "same-origin",
            headers: {
              Accept: "application/json"
            },
            ...(abort ? {
              signal: abort.signal
            } : {})
          });
          if (!ok.ok) {
            historyFetchAborted = true;
            continue;
          }
          const points2 = await ok.json();
          if (!historyRequestStillRelevant(hours, historyRequestContext())) {
            continue;
          }
          const points3 = {
            points: Array.isArray(points2.points) ? points2.points : [],
            hours: hours.hours,
            fetchedAt: Date.now()
          };
          this.historySeries.set(entityId5, points3);
          cacheHistorySeries(this.historySeriesCache, entityId5, points3);
          historyFetchFailed = true;
          if (!points3.points.length) {
            historyFetchAborted = true;
          }
        } catch (name) {
          if (name?.name === "AbortError") {
            window.HABridgeLog?.report("warning", "网络请求", "历史曲线请求超时", {
              entityId: entityId5,
              phase: "history-timeout",
              path: "/api/v1/ha/history",
              durationMs: HISTORY_FETCH_TIMEOUT_MS
            });
          }
          historyFetchAborted = true;
        } finally {
          window.clearTimeout(historyFetchTimeoutId);
          this.historyFetches.delete(entityId5);
        }
      }
    };
    await Promise.all(Array.from({
      length: Math.min(2, length5.length)
    }, () => fetchNextHistorySeries()));
    if (historyFetchAborted && !this.destroyed) {
      this.scheduleHistoryRetry();
    } else {
      this.historyRetryAttempt = 0;
    }
    if (historyFetchFailed && !this.destroyed) {
      this.detailsStateSync?.refreshHistory?.();
      for (const historyPassResult of this.historyChartRefreshers) {
        historyPassResult();
      }
    }
  }
  destroy() {
    this.destroyed = true;
    this.activePopupId = null;
    this.historyDocumentGeneration += 1;
    this.historyPopupGeneration += 1;
    this.disconnectRuntime();
    window.clearTimeout(this.reconnectTimer);
    window.clearTimeout(this.runtimeRenderTimer);
    window.clearTimeout(this.historyRetryTimer);
    window.clearTimeout(this.runtimeHydrationRetryTimer);
    window.clearTimeout(this.pendingEntityDetails?.timer);
    window.clearInterval(this.historyPollTimer);
    this.runtimeStaticImageCache.stop();
    this.runtimeEffectImageLoader.stop();
    this.runtimeVacuumMapImagePreloader.stop();
    this.reconnectTimer = null;
    this.historyRetryTimer = 0;
    this.runtimeHydrationRetryTimer = null;
    this.runtimeHydrationRetryAttempt = 0;
    this.cleanupComponents();
    this.closeRuntimeDialog();
    this.pendingEntityDetails = null;
    this.runtimeDialogScaleContext = null;
    this.resizeObserver.disconnect();
    window.visualViewport?.removeEventListener("resize", this.boundResize);
    window.removeEventListener("orientationchange", this.boundResize);
    window.removeEventListener("online", this.boundReconnect);
    document.removeEventListener("visibilitychange", this.boundVisibilityChange);
    this.container.removeEventListener("click", this.boundRuntimeButtonSound, true);
    this.container.replaceChildren();
  }
}
