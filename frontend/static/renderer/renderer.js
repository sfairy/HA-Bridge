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
const COVER_CLOSED_POSITION_EPSILON = 1;
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
  const max = Math.max(1, Number(layerHeight) || 1);
  const countCurrent = Math.max(1, Number(layoutWidth) || 1);
  const countNext = Math.max(1, Number(layoutHeight) || 1);
  const safeInset = tightFill ? Math.min(40, Math.max(24, Math.min(count, max) * 0.03)) : fillAvailable ? Math.min(80, Math.max(32, Math.min(count, max) * 0.075)) : Math.min(64, Math.max(24, Math.min(count, max) * 0.05));
  const availableWidth = Math.max(1, count - safeInset * 2);
  const availableHeight = Math.max(1, max - safeInset * 2);
  const fitScale = Math.min(availableWidth / countCurrent, availableHeight / countNext);
  const countPrevious = Math.max(0.2, Math.min(1, Number(targetOccupancy) || DEFAULT_TARGET_OCCUPANCY));
  const state = Math.min(count * countPrevious / countCurrent, max * countPrevious / countNext);
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
  const number = Number(layerTop) || 0;
  const count = Math.max(1, Number(layerWidth) || 1);
  const max = Math.max(1, Number(layerHeight) || 1);
  const state = asNumber + count;
  const value = number + max;
  const finiteNumber = Number.isFinite(Number(dashboardLeft)) ? Number(dashboardLeft) : asNumber;
  const finiteNumberCurrent = Number.isFinite(Number(dashboardTop)) ? Number(dashboardTop) : number;
  const countCurrent = Math.max(1, Number(dashboardWidth) || count);
  const countNext = Math.max(1, Number(dashboardHeight) || max);
  const countPrevious = Math.max(asNumber, finiteNumber);
  const countLocal = Math.max(number, finiteNumberCurrent);
  const size = Math.min(state, finiteNumber + countCurrent);
  const min = Math.min(value, finiteNumberCurrent + countNext);
  const width = Math.max(1, size - countPrevious);
  const height = Math.max(1, min - countLocal);
  return {
    width,
    height,
    centerX: countPrevious - asNumber + width / 2,
    centerY: countLocal - number + height / 2
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
  const elementCurrent = document.createElement("i");
  elementCurrent.className = "hb-switch-visual-mark on";
  elementCurrent.textContent = "┃";
  switchVisualRockerEl.append(element, elementCurrent);
  switchVisualPlateEl.append(switchVisualIndicatorEl, switchVisualRockerEl);
  visual.append(switchVisualAuraEl, switchVisualPlateEl);
  const switchVisualCopyEl = compact ? document.createElement("span") : null;
  const elementNext = compact ? document.createElement("strong") : null;
  const elementPrevious = compact ? document.createElement("output") : null;
  if (compact) {
    switchVisualCopyEl.className = "hb-switch-visual-copy";
    elementNext.className = "hb-switch-visual-copy-label";
    elementPrevious.className = "hb-switch-visual-copy-state";
    elementNext.textContent = label;
    switchVisualCopyEl.append(elementNext, elementPrevious);
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
    if (elementPrevious) {
      elementPrevious.textContent = unavailable ? "当前不可用" : momentary ? success ? "执行成功" : pending ? "执行中" : "点击执行" : state ? "运行中" : "已关闭";
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
    const key = this.iconVisibilityPageKey();
    const stateCurrent = !this.iconVisibilityState();
    this.virtualEntityStates.set(key, stateCurrent);
    this.states.set(entityId, {
      entityId,
      state: stateCurrent ? "on" : "off",
      attributes: {}
    });
    this.renderComponents(true);
  }
  waterHeaterDetailsReady(entityId) {
    if (!this.entityCatalogReady) {
      return false;
    }
    const state = this.states.get(entityId);
    const options = (state?.newState || state)?.attributes || {};
    const numeric = Number(options.temperature);
    const number = Number(options.min_temp);
    const numericCurrent = Number(options.max_temp);
    return Number.isFinite(numeric) && Number.isFinite(number) && Number.isFinite(numericCurrent) && numericCurrent > number;
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
      const state = () => {
        if (this.pendingEntityDetails !== pendingEntityDetails) {
          return;
        }
        const id = this.runtimeEntityId(pendingEntityDetails.component?.bindings?.entity?.entityId);
        if (!this.entityCatalogReady || reason === "electric-bed-catalog" && this.deviceProfile(id)?.deviceType !== "electric-bed") {
          pendingEntityDetails.retryTimer = window.setTimeout(state, 260);
          return;
        }
        window.clearTimeout(pendingEntityDetails.timer);
        this.pendingEntityDetails = null;
        this.showEntityDetails(pendingEntityDetails.component, {
          preview: pendingEntityDetails.preview
        });
      };
      pendingEntityDetails.retryTimer = window.setTimeout(state, 260);
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
  profiledComponent(component, componentCurrent = component?.bindings?.entity?.entityId || "") {
    return applyXiaomiDeviceProfile(component, this.deviceProfile(this.runtimeEntityId(componentCurrent)) || this.deviceProfile(componentCurrent));
  }
  powerEntityId(component, componentCurrent = component?.bindings?.entity?.entityId || "") {
    const state = this.runtimeEntityId(componentCurrent);
    const profile = this.deviceProfile(state) || this.deviceProfile(componentCurrent);
    const target = entityPowerTarget(state, component, profile);
    if (target !== state) {
      return this.runtimeEntityId(target);
    }
    const context = relatedPopupContext(component, this.entityMetadata, this.deviceMetadata, this.states);
    if (component?.type !== "air-conditioner" && context?.deviceType === "bath-heater") {
      const found = context.siblings?.find(arg => arg.domain === "light" && entityMetadataIsAvailable(arg));
      if (found?.entityId) {
        return this.runtimeEntityId(found.entityId);
      }
    }
    return state;
  }
  runtimePowerComponent(component, componentCurrent = component?.bindings?.entity?.entityId || "") {
    const componentNext = this.profiledComponent(component, componentCurrent);
    const state = this.runtimeEntityId(componentCurrent);
    const entityId = this.powerEntityId(componentNext, componentCurrent);
    if (!entityId || entityId === state && state === componentCurrent) {
      return componentNext;
    } else {
      return {
        ...componentNext,
        bindings: {
          ...(componentNext.bindings || {}),
          entity: {
            entityId
          }
        },
        properties: {
          ...(componentNext.properties || {}),
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
    const entry = this.componentHosts.get(componentId);
    if (!component || !entry) {
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
      const hbImageComponent = entry.querySelector(".hb-image-component");
      if (hbImageComponent) {
        hbImageComponent.style.opacity = String(Math.max(0, Math.min(1, fallback.opacity)));
      }
      const hbVacuumMapComponent = entry.querySelector(".hb-vacuum-map-component");
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
      const found = [...entry.children].find(element => !element.classList.contains("hb-selection-bounds"));
      const state = {
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
      const stateCurrent = renderRegisteredComponent(this.profiledComponent(component), state);
      const numeric = Number(this.document.canvas.componentScale || 1);
      if (numeric !== 1) {
        stateCurrent.style.width = 100 / numeric + "%";
        stateCurrent.style.height = 100 / numeric + "%";
        stateCurrent.style.transform = "scale(" + numeric + ")";
        stateCurrent.style.transformOrigin = "top left";
      }
      if (found) {
        found.replaceWith(stateCurrent);
      } else {
        entry.prepend(stateCurrent);
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
      const value = component?.type === "floorplan-auto-diagram" && component.properties?.generated !== true;
      element.hidden = value ? !state : component?.style?.visible === false;
      element.classList.toggle("selected", state);
      element.classList.toggle("selection-primary", state && item === this.selectedComponentId);
      element.classList.toggle("hb-light-statistics-selection-host", state && this.selectedComponentIds.size === 1 && component?.type === "light-statistics");
      element.querySelectorAll(":scope > .hb-selection-bounds, :scope > .hb-transform-handle").forEach(arg => arg.remove());
      if (!state) {
        continue;
      }
      const stateCurrent = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "air-conditioner" && this.componentSelectionLayers.get(item) === "airflow";
      const stateNext = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "icon-button-effect" && this.componentSelectionLayers.get(item) === "effect";
      const statePrevious = this.selectedComponentIds.size === 1 && item === this.selectedComponentId && component?.type === "presence-sensor" && component?.properties?.sensorKind === "door-window" && this.componentSelectionLayers.get(item) === "perspective";
      if (stateCurrent) {
        this.appendAirflowTransformHandles(this.componentAirflowLayers.get(item), component);
      } else if (stateNext && this.componentEffectLayers.get(item) && !this.componentEffectLayers.get(item).hidden) {
        this.appendEffectSelectionBounds(this.componentEffectLayers.get(item), component);
      } else if (statePrevious) {
        const state = this.createComponentSelectionOverlay(element, component) || element;
        this.appendDoorWindowPerspectiveHandles(element, component, state);
      } else {
        const state = this.selectedComponentIds.size === 1;
        const overlay = state ? this.createComponentSelectionOverlay(element, component) : element;
        this.appendTransformHandles(element, component, state, overlay || element);
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
    let scaleCurrent = this.componentParentIds?.get(componentId) || null;
    let rotation = 0;
    let scale = 1;
    const allowed = new Set();
    while (scaleCurrent && !allowed.has(scaleCurrent)) {
      allowed.add(scaleCurrent);
      const numeric = this.componentRecords.get(scaleCurrent);
      if (!numeric) {
        break;
      }
      rotation += Number(numeric.position?.rotation || 0);
      scale *= Math.max(0.01, Math.min(5, Number(numeric.style?.scale || 1)));
      scaleCurrent = this.componentParentIds?.get(scaleCurrent) || null;
    }
    return {
      rotation,
      scale
    };
  }
  componentTransformChain(componentId) {
    const state = [];
    let stateCurrent = componentId;
    const allowed = new Set();
    while (stateCurrent && !allowed.has(stateCurrent)) {
      allowed.add(stateCurrent);
      const entry = this.componentRecords.get(stateCurrent);
      if (!entry) {
        break;
      }
      state.push(entry);
      stateCurrent = this.componentParentIds?.get(stateCurrent) || null;
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
    const reversed = this.componentTransformChain(componentId).reverse();
    for (const item of reversed) {
      const rect = item.position || {};
      const numeric = Number(rect.width || 100);
      const number = Number(rect.height || 100);
      const count = Math.max(0.01, Math.min(5, Number(item.style?.scale || 1)));
      const scale = Number(rect.rotation || 0) * Math.PI / 180;
      const cos = Math.cos(scale);
      const sin = Math.sin(scale);
      const asNumber = Number(rect.x || 0) + numeric / 2;
      const value = Number(rect.y || 0) + number / 2;
      const stateCurrent = (state.x - asNumber) / count;
      const stateNext = (state.y - value) / count;
      state = {
        x: numeric / 2 + stateCurrent * cos + stateNext * sin,
        y: number / 2 - stateCurrent * sin + stateNext * cos
      };
    }
    return state;
  }
  componentVisualBounds(componentId, transformOverride = null) {
    const numeric = componentId.position || {};
    const count = Math.max(0.01, Number(numeric.width || 100));
    const max = Math.max(0.01, Number(numeric.height || 100));
    let size = count;
    let state = max;
    let stateCurrent = 0;
    let stateNext = 0;
    if (componentId.type === "light-statistics" && transformOverride) {
      const element = transformOverride.querySelector(":scope > .hb-selection-bounds");
      const list = element ? [Number.parseFloat(element.style.left), Number.parseFloat(element.style.top), Number.parseFloat(element.style.width), Number.parseFloat(element.style.height)] : [];
      if (list.every(Number.isFinite) && list[2] > 0 && list[3] > 0) {
        [stateCurrent, stateNext, size, state] = list;
      }
    }
    const countCurrent = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    const scale = Number(numeric.rotation || 0) * Math.PI / 180;
    const value = size * countCurrent;
    const statePrevious = state * countCurrent;
    const stateLocal = (Math.abs(Math.cos(scale)) * value + Math.abs(Math.sin(scale)) * statePrevious) / 2;
    const stateItem = (Math.abs(Math.sin(scale)) * value + Math.abs(Math.cos(scale)) * statePrevious) / 2;
    const asNumber = Number(numeric.x || 0) + count / 2;
    const asNumberCurrent = Number(numeric.y || 0) + max / 2;
    const asNumberNext = Number(numeric.x || 0) + stateCurrent + size / 2;
    const asNumberPrevious = Number(numeric.y || 0) + stateNext + state / 2;
    const stateEntry = (asNumberNext - asNumber) * countCurrent;
    const stateList = (asNumberPrevious - asNumberCurrent) * countCurrent;
    const stateText = asNumber + stateEntry * Math.cos(scale) - stateList * Math.sin(scale);
    const sizeCurrent = asNumberCurrent + stateEntry * Math.sin(scale) + stateList * Math.cos(scale);
    return {
      left: stateText - stateLocal,
      top: sizeCurrent - stateItem,
      right: stateText + stateLocal,
      bottom: sizeCurrent + stateItem
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
    const stateCurrent = element.parentElement?.dataset?.componentId || null;
    const scale = stateCurrent ? this.componentWorldTransform(stateCurrent).scale : 1;
    const value = 1 / Math.max(0.001, state * scale);
    element.style.setProperty("--hb-ui-scale", String(value));
    element.style.setProperty("--hb-handle-outset", value * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  appendMultiSelectionBounds() {
    const selectionBoundsEl = this.selectedScaleRecords();
    if (!selectionBoundsEl.length) {
      return;
    }
    const rect = this.scaleRecordsBounds(selectionBoundsEl);
    const element = document.createElement("div");
    element.className = "hb-selection-bounds hb-multi-selection-bounds";
    Object.assign(element.style, {
      left: rect.left + "px",
      top: rect.top + "px",
      width: Math.max(1, rect.right - rect.left) + "px",
      height: Math.max(1, rect.bottom - rect.top) + "px"
    });
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerElCurrent = document.createElement("i");
      cornerMarkerElCurrent.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerElCurrent.setAttribute("aria-hidden", "true");
      element.append(cornerMarkerElCurrent);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动整体缩放";
    transformHandleEl.addEventListener("pointerdown", transformHandleEl => this.startComponentsScale(transformHandleEl, selectionBoundsEl, rect, element));
    const transformHandleElCurrent = document.createElement("button");
    transformHandleElCurrent.type = "button";
    transformHandleElCurrent.className = "hb-transform-handle hb-rotate-handle";
    transformHandleElCurrent.title = "拖动整体旋转";
    transformHandleElCurrent.addEventListener("pointerdown", arg => this.startComponentsRotate(arg, selectionBoundsEl, rect, element));
    element.append(transformHandleEl, transformHandleElCurrent);
    (selectionBoundsEl[0]?.host?.parentElement || this.canvas).append(element);
    this.updateMultiSelectionHandleScale(element);
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
    const value = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - value));
    const sizeCurrent = (pointerEvent.left + pointerEvent.right) / 2;
    const sizeNext = (pointerEvent.top + pointerEvent.bottom) / 2;
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
    const max = Math.max(...mapped.map(arg => 0.01 / arg.scale));
    const min = Math.min(...mapped.map(arg => 5 / arg.scale));
    let scale = 1;
    let list = [];
    let flag = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      const hypot = Math.hypot(event.clientX - size, event.clientY - value);
      scale = Math.max(max, Math.min(min, hypot / count));
      list = mapped.map(arg => {
        const state = sizeCurrent + (arg.centerX - sizeCurrent) * scale;
        const value = sizeNext + (arg.centerY - sizeNext) * scale;
        const nextScale = arg.scale * scale;
        const position = state - arg.width / 2;
        const positionCurrent = value - arg.height / 2;
        arg.component.position = {
          ...(arg.component.position || {}),
          x: position,
          y: positionCurrent
        };
        arg.component.style = {
          ...(arg.component.style || {}),
          scale: nextScale
        };
        arg.host.style.left = position + "px";
        arg.host.style.top = positionCurrent + "px";
        arg.host.style.transform = "rotate(" + Number(arg.component.position?.rotation || 0) + "deg) scale(" + nextScale + ")";
        return {
          componentId: arg.component.id,
          x: position,
          y: positionCurrent,
          scale: nextScale
        };
      });
      Object.assign(element.style, {
        left: sizeCurrent + (pointerEvent.left - sizeCurrent) * scale + "px",
        top: sizeNext + (pointerEvent.top - sizeNext) * scale + "px",
        width: Math.max(1, (pointerEvent.right - pointerEvent.left) * scale) + "px",
        height: Math.max(1, (pointerEvent.bottom - pointerEvent.top) * scale) + "px"
      });
      this.updateMultiSelectionHandleScale(element);
      this.options.onComponentsTransformPreview?.(list, this.selectedComponentId);
    };
    const state = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
        window.removeEventListener("pointerup", state, true);
        window.removeEventListener("pointercancel", state, true);
        window.removeEventListener("blur", state);
        if (scale !== 1 && list.length) {
          this.options.onComponentsTransform?.(list, this.selectedComponentId);
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", state, true);
    window.addEventListener("pointercancel", state, true);
    window.addEventListener("blur", state);
  }
  startComponentsRotate(event, pointerEvent, handleEl, element) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const value = domRect.top + domRect.height / 2;
    const sizeCurrent = (handleEl.left + handleEl.right) / 2;
    const sizeNext = (handleEl.top + handleEl.bottom) / 2;
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
    let state = Math.atan2(event.clientY - value, event.clientX - size);
    let count = 0;
    let list = [];
    let flag = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      const atan = Math.atan2(event.clientY - value, event.clientX - size);
      let amount = atan - state;
      if (amount > Math.PI) {
        amount -= Math.PI * 2;
      } else if (amount < -Math.PI) {
        amount += Math.PI * 2;
      }
      count += amount * 180 / Math.PI;
      state = atan;
      list = rotateMultiSelectionTransforms(mapped, sizeCurrent, sizeNext, count);
      for (const item of list) {
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
      element.style.transform = "rotate(" + count + "deg)";
      element.style.transformOrigin = "center center";
      this.options.onComponentsTransformPreview?.(list, this.selectedComponentId);
    };
    const stateCurrent = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
        window.removeEventListener("pointerup", stateCurrent, true);
        window.removeEventListener("pointercancel", stateCurrent, true);
        window.removeEventListener("blur", stateCurrent);
        if (count !== 0 && list.length) {
          this.options.onComponentsTransform?.(list, this.selectedComponentId);
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", stateCurrent, true);
    window.addEventListener("pointercancel", stateCurrent, true);
    window.addEventListener("blur", stateCurrent);
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
    for (const [entry, entryCurrent] of Object.entries(this.document?.theme?.variables || {})) {
      const asString = String(entry).startsWith("--") ? String(entry) : "--" + entry;
      if (/^--[a-zA-Z0-9_-]+$/.test(asString)) {
        this.container.style.setProperty(asString, String(entryCurrent));
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
    const map = new Map([...this.canvas.querySelectorAll(".hb-icon-button-effect-layer[data-effect-for]")].map(arg => [arg.dataset.effectFor, arg]));
    this.cleanupComponents(preserveSelection, add);
    const set = new Set([...componentById.values()].filter(arg => arg.parentElement === this.canvas && (allowed.has(arg.dataset.componentId) || arg === retained?.host) && (arg.querySelector(".hb-floorplan-auto-diagram-preview") || add.has(arg.dataset.componentId))));
    if (set.size) {
      for (const child of [...this.canvas.children]) {
        if (!set.has(child)) {
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
      this.renderComponent(item, this.canvas, 0, componentById, map);
    }
    for (const preservedSelectionIds of filtered) {
      this.renderComponent(preservedSelectionIds, this.canvas, 100000, componentById, map);
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
      const state = this.runtimeStateHandlers.get(text);
      state?.delete(handler);
      if (state?.size === 0) {
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
    const text = component?.bindings?.entity?.entityId || "";
    if (text) {
      entityIds.add(text);
      const state = this.powerEntityId(component, text);
      if (state) {
        entityIds.add(state);
      }
      const profile = this.deviceProfile(text);
      for (const valueEntry of Object.values(profile?.roles || {})) {
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
    for (const [entity, entityCurrent] of this.runtimeEntityComponentIndex) {
      entityCurrent.delete(component);
      if (!entityCurrent.size) {
        this.runtimeEntityComponentIndex.delete(entity);
      }
    }
  }
  runtimeComponentContent(componentId) {
    return [...(componentId?.children || [])].find(element => !element.classList.contains("hb-component") && !element.classList.contains("hb-runtime-action-hitbox") && !element.classList.contains("hb-selection-bounds") && !element.classList.contains("hb-transform-handle")) || null;
  }
  refreshRuntimeComponent(componentId) {
    const state = this.componentRecords.get(componentId);
    const entry = this.componentHosts.get(componentId);
    if (!state || !entry || !entry.isConnected) {
      return;
    }
    if (state.type === "interaction3d") {
      entry.querySelector(".hb-interaction3d-host")?.updateInteraction3d?.(state, this.document);
      return;
    }
    this.cleanupRenderedComponent(componentId);
    const options = {
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
    const component = renderRegisteredComponent(this.runtimePowerComponent(state), options);
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      component.style.width = 100 / numeric + "%";
      component.style.height = 100 / numeric + "%";
      component.style.transform = "scale(" + numeric + ")";
      component.style.transformOrigin = "top left";
    }
    const size = this.runtimeComponentContent(entry);
    if (size) {
      size.replaceWith(component);
    } else {
      entry.prepend(component);
    }
    if (state.type === "title-button" || state.type === "light-statistics") {
      const element = entry.querySelector(":scope > .hb-runtime-action-hitbox");
      if (element) {
        const bounds = state.type === "light-statistics" ? this.updateLightStatisticsSelectionBounds(entry, state, element) : this.updateTitleButtonSelectionBounds(entry, state, element);
        element.hidden = !bounds;
      }
    }
    if (state.type === "light-statistics") {
      const matchedEl = this.componentSelectionOverlays.get(componentId)?.querySelector(":scope > .hb-selection-bounds") || entry.querySelector(":scope > .hb-selection-bounds");
      if (matchedEl) {
        if (!this.updateLightStatisticsSelectionBounds(entry, state, matchedEl)) {
          Object.assign(matchedEl.style, {
            left: "0",
            top: "0",
            width: "100%",
            height: "100%"
          });
        }
        this.updateTransformHandleScale(entry, state, matchedEl);
      }
      this.refreshMultiSelectionBounds();
    }
  }
  refreshEditorComponent(componentCurrent) {
    if (!this.options.editable) {
      return false;
    }
    const component = this.componentRecords.get(componentCurrent);
    const element = this.componentHosts.get(componentCurrent);
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
      const selector = element.querySelector(".hb-floorplan-auto-diagram-preview");
      if (!!selector === position) {
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
        selector?.classList.toggle("is-view-mode", isViewMode);
        selector?.classList.toggle("is-position-mode", !isViewMode);
        if (hintEl) {
          hintEl.textContent = isViewMode ? "拖动旋转 · 右键平移 · 滚轮缩放" : "拖动控件调整位置，右下角调整大小";
        }
        this.syncSelection();
        this.updateTransformHandleScale(element, component);
        return true;
      }
    }
    const nextSibling = element.nextSibling;
    this.cleanupRenderedComponent(componentCurrent);
    for (const runHelper of this.cameraCleanups.get(componentCurrent)?.splice(0) || []) {
      runHelper();
    }
    this.cameraCleanups.delete(componentCurrent);
    this.componentEffectLayers.get(componentCurrent)?.remove();
    this.componentEffectLayers.delete(componentCurrent);
    this.componentAirflowLayers.get(componentCurrent)?.remove();
    this.componentAirflowLayers.delete(componentCurrent);
    element.remove();
    this.renderComponent(component, hostParentEl);
    const state = this.componentHosts.get(componentCurrent);
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
    const set = new Set(["icon-button-effect", "icon-button", "device-button", "navigation-button", "air-conditioner"]);
    const allowedCurrent = new Set([...allowed].filter(arg => set.has(this.componentRecords.get(arg)?.type)));
    if (allowedCurrent.size) {
      this.updateOptimisticToggleVisuals("", allowedCurrent);
    }
    for (const item of allowed) {
      const state = this.componentRecords.get(item);
      if (!!state && !set.has(state.type) && !["line-chart", "camera", "vacuum-map"].includes(state.type)) {
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
    this.page = this.document.pages?.find(item => item.path === documentModel) || this.document.pages?.find(arg => arg.path === this.document.defaultPagePath) || this.document.pages?.[0] || null;
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
    const set = new Set();
    for (const {
      componentId
    } of filtered) {
      for (const entity of this.runtimeEntityIdsForComponent(this.componentRecords.get(componentId))) {
        set.add(entity);
      }
    }
    if (allowed.size !== set.size || [...allowed].some(arg => !set.has(arg))) {
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
    const properties = component.properties || {};
    const text = String(component?.bindings?.entity?.entityId || "");
    element.classList.toggle("awaiting-light-visual", iconButtonEffectLightVisualAwaiting(component, {
      editable: this.options.editable,
      states: this.states,
      pendingOptimisticState: this.pendingOptimisticStates.get(text)
    }));
    const state = iconButtonEffectLightVisualState(component, {
      states: this.states
    });
    const numeric = Number(properties.effectOpacity ?? 1);
    const finiteNumber = Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : 1;
    element.style.setProperty("--hb-effect-image-opacity", String(finiteNumber * state.opacity));
    const selector = element.querySelector(":scope > img");
    if (selector) {
      selector.style.filter = state.filter;
    }
  }
  cachedLightVisualState(entityIdCurrent) {
    const entityId = String(entityIdCurrent || "");
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
      const state = {
        entityId,
        state: "on",
        attributes: parsedJson.attributes
      };
      this.confirmedLightVisualStates.set(entityId, state);
      return state;
    } catch {
      return null;
    }
  }
  rememberLightVisualState(entityIdCurrent, visual) {
    const entityId = String(entityIdCurrent || "");
    const entityIdNext = visual?.newState || visual;
    if (!entityId.startsWith("light.") || !entityIdNext?.attributes) {
      return;
    }
    const attributes = entityIdNext.attributes;
    const runHelper = arg => attributes[arg] !== null && attributes[arg] !== undefined && attributes[arg] !== "" && Number.isFinite(Number(attributes[arg]));
    if (!runHelper("brightness") && !runHelper("color_temp_kelvin") && !runHelper("color_temp")) {
      return;
    }
    const options = {
      ...(this.cachedLightVisualState(entityId)?.attributes || {})
    };
    for (const item of ["brightness", "color_temp_kelvin", "color_temp", "color_mode", "supported_color_modes"]) {
      if (attributes[item] !== null && attributes[item] !== undefined && attributes[item] !== "") {
        options[item] = Array.isArray(attributes[item]) ? [...attributes[item]] : attributes[item];
      }
    }
    const state = {
      entityId,
      state: "on",
      attributes: options
    };
    this.confirmedLightVisualStates.set(entityId, state);
    try {
      window.localStorage?.setItem("ha-bridge:light-visual:" + entityId, JSON.stringify({
        at: Date.now(),
        attributes: options
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
        const state = renderAirConditionerAirflowLayer(powerComponent, renderContext);
        if (state) {
          const grouped = host.parentElement !== this.canvas;
          const airflowGeometry = airflowLayerGeometry(component, {
            grouped
          });
          const numeric = Number(host.style.getPropertyValue("--hb-component-z") || component.position?.zIndex || 1);
          state.dataset.airflowFor = record;
          state.hidden = component.style?.visible === false;
          Object.assign(state.style, {
            left: airflowGeometry.left + "px",
            top: airflowGeometry.top + "px",
            width: airflowGeometry.width + "px",
            height: airflowGeometry.height + "px",
            zIndex: String(numeric),
            transform: "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")"
          });
          if (grouped) {
            host.append(state);
          } else {
            this.canvas.insertBefore(state, host);
          }
          this.componentAirflowLayers.set(record, state);
          if (this.options.editable && this.selectedComponentIds.size === 1 && this.selectedComponentId === record && this.componentSelectionLayers.get(record) === "airflow") {
            this.syncSelection();
          }
        }
      }
      if (component.type !== "icon-button-effect") {
        continue;
      }
      const state = this.componentEffectLayers.get(record);
      this.syncEffectLayerLightVisual(component, state);
      this.setEffectLayerActive(state, displayedOn, effectFadeDuration(component));
    }
  }
  refreshVacuumMapEntity(entityId) {
    if (this.options.liveMedia === false || !String(entityId || "").startsWith("image.")) {
      return;
    }
    const state = this.states.get(entityId);
    const source = vacuumMapImageSource(entityId, state);
    let flag = false;
    for (const [record, component] of this.componentRecords) {
      if (component.type !== "vacuum-map" || component.bindings?.entity?.entityId !== entityId) {
        continue;
      }
      const matchedEl = this.componentHosts.get(record)?.querySelector(".hb-vacuum-map-image");
      if (matchedEl) {
        flag = true;
        if (matchedEl.dataset.vacuumMapSource !== source) {
          matchedEl.dataset.vacuumMapSource = source;
        }
        if (matchedEl.dataset.vacuumMapSuspended !== "true" && matchedEl.getAttribute("src") !== source) {
          matchedEl.src = source;
        }
      }
    }
    if (!flag && this.options.liveMedia !== false && this.vacuumMapEntityIds.has(entityId)) {
      this.runtimeVacuumMapImagePreloader.enqueue(source);
    }
  }
  applyOptimisticToggle(entityIdCurrent, nextState = null) {
    const state = entityIdCurrent;
    const entityId = this.powerEntityId(nextState, state);
    const entry = this.states.get(entityId);
    const stateCurrent = entry?.newState || entry || {
      entityId,
      attributes: {}
    };
    const asString = String(entityId || "").startsWith("cover.");
    const stateNext = asString && coverComponentIsDream(nextState, entityId, entry, this.entityMetadata);
    const component = this.runtimePowerComponent(nextState, state);
    const desiredActive = !(asString ? stateNext ? runtimeEntityStateIsActive(entry) : runtimeCoverStateIsActive(entry) : entityPowerIsOn(entityId, entry, component));
    const newState = asString ? {
      ...stateCurrent,
      state: desiredActive ? "open" : "closed",
      ...(stateNext ? {} : {
        attributes: {
          ...(stateCurrent.attributes || {}),
          current_position: desiredActive ? 100 : 0
        }
      })
    } : optimisticToggleState(entityId, stateCurrent, component);
    if (desiredActive && String(entityId || "").startsWith("light.")) {
      const state = this.cachedLightVisualState(entityId);
      if (state?.attributes) {
        newState.attributes = {
          ...(newState.attributes || {}),
          ...state.attributes
        };
      }
    }
    const options = entry?.newState ? {
      ...entry,
      newState
    } : newState;
    const text = String(entityId || "");
    const nowMs = {
      desiredActive,
      expiresAt: Date.now() + 8000
    };
    this.pendingOptimisticStates.set(text, nowMs);
    const timeout = window.setTimeout(() => {
      if (this.pendingOptimisticStates.get(text) === nowMs) {
        this.pendingOptimisticStates.delete(text);
        if (this.states.get(entityId) === options) {
          if (entry === undefined) {
            this.states.delete(entityId);
          } else {
            this.states.set(entityId, entry);
          }
          this.updateOptimisticToggleVisuals(entityId);
        }
      }
    }, 8000);
    this.states.set(entityId, options);
    this.updateOptimisticToggleVisuals(entityId);
    return () => {
      window.clearTimeout(timeout);
      if (this.pendingOptimisticStates.get(text) === nowMs) {
        this.pendingOptimisticStates.delete(text);
      }
      if (this.states.get(entityId) === options) {
        if (entry === undefined) {
          this.states.delete(entityId);
        } else {
          this.states.set(entityId, entry);
        }
        this.updateOptimisticToggleVisuals(entityId);
      }
    };
  }
  renderComponent(component, parentHost = this.canvas, renderOptions = 0, renderContext = null, parentComponent = null) {
    const iconButtonEffectComponent = normalizeIconButtonEffectComponent(component);
    const componentCurrent = this.runtimePowerComponent(iconButtonEffectComponent);
    const element = ["camera", "vacuum-map", "floorplan-auto-diagram", "interaction3d"].includes(component.type) ? renderContext?.get(component.id) : null;
    if (element) {
      const position = component.position || {};
      const value = parentHost === this.canvas && ["floorplan-auto-diagram", "interaction3d"].includes(component.type) && component.properties?.layoutMode === "fill";
      const numeric = value ? {
        ...position,
        x: 0,
        y: 0,
        width: Number(this.document.canvas?.width || 2778),
        height: Number(this.document.canvas?.height || 1940),
        rotation: 0
      } : position;
      const count = Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
      const scale = renderOptions + Number(numeric.zIndex || 1);
      Object.assign(element.style, {
        left: (numeric.x || 0) + "px",
        top: (numeric.y || 0) + "px",
        width: (numeric.width || 100) + "px",
        height: (numeric.height || 100) + "px",
        zIndex: String(scale),
        transform: "rotate(" + (numeric.rotation || 0) + "deg) scale(" + (value ? 1 : count) + ")"
      });
      element.style.setProperty("--hb-component-z", String(scale));
      element.hidden = component.style?.visible === false;
      element.classList.toggle("layout-fill", value);
      if (component.type === "interaction3d") {
        element.querySelector(".hb-interaction3d-host")?.updateInteraction3d?.(component, this.document);
      }
      if (component.type === "floorplan-auto-diagram") {
        const state = component.properties?.interactionMode === "view";
        const hbFloorplanAutoDiagramPreview = element.querySelector(".hb-floorplan-auto-diagram-preview");
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(".hb-floorplan-auto-diagram-preview-hint");
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-view-mode", state);
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-position-mode", !state);
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = state ? "拖动旋转 · 右键平移 · 滚轮缩放" : "拖动控件调整位置，右下角调整大小";
        }
      }
      this.componentHosts.set(component.id, element);
      this.componentRecords.set(component.id, component);
      const componentId = parentHost?.dataset?.componentId;
      if (componentId) {
        this.componentParentIds.set(component.id, componentId);
      }
      this.indexRuntimeComponent(component);
      if (element.parentElement !== parentHost) {
        parentHost.append(element);
      }
      return;
    }
    const elementCurrent = document.createElement("div");
    elementCurrent.className = "hb-component hb-component-" + component.type.replace(/[^a-z0-9_-]/gi, "-");
    elementCurrent.dataset.componentId = component.id;
    const position = component.position || {};
    const value = parentHost === this.canvas && ["image", "floorplan-auto-diagram", "interaction3d"].includes(component.type) && component.properties?.layoutMode === "fill";
    const rect = value ? {
      ...position,
      x: 0,
      y: 0,
      width: Number(this.document.canvas?.width || 2778),
      height: Number(this.document.canvas?.height || 1940),
      rotation: 0
    } : position;
    const count = Math.max(0.01, Math.min(5, Number(component.style?.scale || 1)));
    const scale = renderOptions + Number(rect.zIndex || 1);
    const state = componentHostZIndex(component, scale, parentHost === this.canvas);
    Object.assign(elementCurrent.style, {
      left: (rect.x || 0) + "px",
      top: (rect.y || 0) + "px",
      width: (rect.width || 100) + "px",
      height: (rect.height || 100) + "px",
      zIndex: String(state),
      transform: "rotate(" + (rect.rotation || 0) + "deg) scale(" + (value ? 1 : count) + ")"
    });
    elementCurrent.style.setProperty("--hb-component-z", String(state));
    elementCurrent.hidden = component.style?.visible === false;
    if (component.type === "icon-button-effect" && component.properties?.buttonVisible === false && component.properties?.hiddenContentClickable !== true && !this.options.editable) {
      elementCurrent.style.pointerEvents = "none";
    }
    elementCurrent.classList.toggle("layout-fill", value);
    this.componentHosts.set(component.id, elementCurrent);
    this.componentRecords.set(component.id, component);
    const componentId = parentHost?.dataset?.componentId;
    if (componentId) {
      this.componentParentIds.set(component.id, componentId);
    }
    this.indexRuntimeComponent(component);
    const options = {
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
      const element = renderIconButtonEffectLayer(componentCurrent, options);
      if (element) {
        const state = parentComponent?.get(component.id) || null;
        const elementCurrent = state || element;
        const selector = element.querySelector("img");
        const elementNext = elementCurrent.querySelector("img");
        const active = element.classList.contains("active");
        if (state && elementNext && selector) {
          elementCurrent.classList.toggle("awaiting-light-visual", element.classList.contains("awaiting-light-visual"));
          const state = selector.dataset.effectSource || "";
          if (state) {
            elementNext.dataset.effectSource = state;
          } else {
            delete elementNext.dataset.effectSource;
            const state = selector.getAttribute("src");
            if (state) {
              elementNext.src = state;
            }
          }
          elementNext.alt = selector.alt;
          elementNext.draggable = false;
          elementNext.decoding = "async";
          elementNext.style.objectFit = selector.style.objectFit;
          elementNext.style.mixBlendMode = selector.style.mixBlendMode;
          for (const item of ["effectOriginalWidth", "effectOriginalHeight", "effectCropX", "effectCropY", "effectCropWidth", "effectCropHeight"]) {
            if (selector.dataset[item] !== undefined) {
              elementNext.dataset[item] = selector.dataset[item];
            } else {
              delete elementNext.dataset[item];
            }
          }
        }
        const numeric = componentCurrent.properties || {};
        const number = Number(this.document.canvas?.width || 2778);
        const numericCurrent = Number(this.document.canvas?.height || 1940);
        const size = numeric.effectLayoutMode === "fill";
        const value = parentHost !== this.canvas;
        elementCurrent.dataset.effectFor = component.id;
        elementCurrent.hidden = component.style?.visible === false;
        const clampNumber = () => {
          const state = effectSourceDimensions(numeric, elementNext, number, numericCurrent);
          const angle = effectCropRectangle(elementNext, state);
          const transform = !size && !state.pendingNaturalSize ? effectReferenceImageTransform(this.page, component, state.width, state.height, number, numericCurrent) : null;
          const count = Math.max(0.01, Math.min(5, Number(numeric.effectScale || 1)));
          const scale = size ? Math.min(number / state.width, numericCurrent / state.height) : (transform?.scale || 1) * count;
          const rotation = size ? 0 : Number(numeric.effectRotation || 0);
          const asNumber = Number(numeric.effectLeft ?? 50) / 100;
          const asNumberCurrent = Number(numeric.effectTop ?? 50) / 100;
          const centerX = size ? number / 2 : number * asNumber;
          const centerY = size ? numericCurrent / 2 : numericCurrent * asNumberCurrent;
          const rect = effectCroppedLayerGeometry({
            centerX,
            centerY,
            originalWidth: state.width,
            originalHeight: state.height,
            cropX: angle.x,
            cropY: angle.y,
            cropWidth: angle.width,
            cropHeight: angle.height,
            scale,
            rotation
          });
          let sizeCurrent = rect;
          if (value) {
            const size = rect.left + rect.width / 2;
            const value = rect.top + rect.height / 2;
            const componentId = parentHost?.dataset?.componentId;
            const state = componentId ? this.worldPointToComponentLocal(componentId, size, value) : {
              x: size,
              y: value
            };
            const scale = componentId ? this.componentWorldTransform(componentId) : {
              scale: 1,
              rotation: 0
            };
            sizeCurrent = {
              ...rect,
              left: state.x - rect.width / 2,
              top: state.y - rect.height / 2,
              scale: rect.scale / Math.max(0.0001, scale.scale),
              rotation: rect.rotation - scale.rotation
            };
          }
          Object.assign(elementCurrent.style, {
            left: sizeCurrent.left + "px",
            top: sizeCurrent.top + "px",
            width: rect.width + "px",
            height: rect.height + "px",
            visibility: state.pendingNaturalSize ? "hidden" : "",
            zIndex: String(value ? scale - 0.1 : scale),
            transform: "rotate(" + sizeCurrent.rotation + "deg) scale(" + sizeCurrent.scale + ")"
          });
          return state;
        };
        if (clampNumber().pendingNaturalSize && elementNext) {
          elementNext.addEventListener("load", () => {
            if (elementCurrent.isConnected) {
              clampNumber();
            }
          }, {
            once: true
          });
        }
        (value ? parentHost : size ? this.canvas : parentHost).append(elementCurrent);
        this.componentEffectLayers.set(component.id, elementCurrent);
        const text = elementNext?.dataset.effectSource || "";
        if (text) {
          this.runtimeEffectImageLoader.enqueue(elementNext, text, {
            active
          });
        }
        if (state) {
          const state = selector?.style.filter || "none";
          const value = element.style.getPropertyValue("--hb-effect-image-opacity");
          const stateCurrent = element.style.getPropertyValue("--hb-effect-fade-duration");
          const stateNext = element.style.getPropertyValue("--hb-effect-visual-transition-duration");
          const opacity = element.style.opacity;
          const transition = element.style.transition;
          elementNext?.offsetWidth;
          if (elementNext) {
            elementNext.style.filter = state;
          }
          elementCurrent.style.opacity = opacity;
          elementCurrent.style.transition = transition;
          elementCurrent.style.setProperty("--hb-effect-image-opacity", value);
          elementCurrent.style.setProperty("--hb-effect-fade-duration", stateCurrent);
          elementCurrent.style.setProperty("--hb-effect-visual-transition-duration", stateNext);
          this.setEffectLayerActive(elementCurrent, active, effectFadeDuration(component));
        }
      }
    }
    if (component.type === "air-conditioner") {
      const state = renderAirConditionerAirflowLayer(componentCurrent, options);
      if (state) {
        state.dataset.airflowFor = component.id;
        state.hidden = component.style?.visible === false;
        const grouped = parentHost !== this.canvas;
        const airflowGeometry = airflowLayerGeometry(component, {
          grouped
        });
        Object.assign(state.style, {
          left: airflowGeometry.left + "px",
          top: airflowGeometry.top + "px",
          width: airflowGeometry.width + "px",
          height: airflowGeometry.height + "px",
          zIndex: String(scale),
          transform: "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")"
        });
        (grouped ? elementCurrent : parentHost).append(state);
        this.componentAirflowLayers.set(component.id, state);
      }
    }
    const groupContainerEl = component.type === "group" ? (() => {
      const groupContainerEl = document.createElement("div");
      groupContainerEl.className = "hb-group-container";
      return groupContainerEl;
    })() : renderRegisteredComponent(componentCurrent, options);
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      groupContainerEl.style.width = 100 / numeric + "%";
      groupContainerEl.style.height = 100 / numeric + "%";
      groupContainerEl.style.transform = "scale(" + numeric + ")";
      groupContainerEl.style.transformOrigin = "top left";
    }
    elementCurrent.append(groupContainerEl);
    if (component.type === "line-chart") {
      let element = groupContainerEl;
      const applyElementStyle = () => {
        if (!element?.isConnected) {
          return;
        }
        const size = renderRegisteredComponent(componentCurrent, options);
        if (numeric !== 1) {
          size.style.width = 100 / numeric + "%";
          size.style.height = 100 / numeric + "%";
          size.style.transform = "scale(" + numeric + ")";
          size.style.transformOrigin = "top left";
        }
        element.cleanupLineChartHover?.();
        element.replaceWith(size);
        element = size;
      };
      this.registerRuntimeStateHandler(component.bindings?.entity?.entityId, arg => {
        element.syncLineChartState?.(arg);
        if (element.classList.contains("history-loading")) {
          applyElementStyle();
        }
      }, component.id);
      this.registerHistoryChartRefresher(applyElementStyle, component.id);
    }
    if (this.options.editable) {
      elementCurrent.classList.add("editable");
      elementCurrent.addEventListener("pointerdown", arg => this.startComponentMove(arg, component, elementCurrent));
    } else {
      const state = Object.prototype.hasOwnProperty.call(component.actions || {}, "tap");
      const options = component.type === "camera" && component.bindings?.entity?.entityId && !state ? {
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
        elementCurrent.classList.add("hb-runtime-fitted-hit-area");
      }
      if (Object.values(options.actions || {}).some(arg => isComponentActionSupported(options, arg))) {
        elementCurrent.classList.add("interactive");
        let runtimeActionHitboxEl = elementCurrent;
        if (["title-button", "device-button", "light-statistics"].includes(component.type)) {
          runtimeActionHitboxEl = document.createElement("span");
          runtimeActionHitboxEl.className = "hb-runtime-action-hitbox";
          runtimeActionHitboxEl.setAttribute("aria-hidden", "true");
          elementCurrent.classList.add("hb-runtime-fitted-hit-area");
          elementCurrent.append(runtimeActionHitboxEl);
        }
        this.bindRuntimeActions(runtimeActionHitboxEl, options);
      }
    }
    parentHost.append(elementCurrent);
    const selector = elementCurrent.querySelector(":scope > .hb-runtime-action-hitbox");
    if (selector) {
      const state = component.type === "title-button" ? this.updateTitleButtonSelectionBounds(elementCurrent, component, selector) : component.type === "light-statistics" ? this.updateLightStatisticsSelectionBounds(elementCurrent, component, selector) : this.updateDeviceButtonSelectionBounds(elementCurrent, component, selector);
      selector.hidden = !state;
    }
    for (const child of component.children || []) {
      this.renderComponent(child, elementCurrent, 0, renderContext, parentComponent);
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
    let stateCurrent = !state && filtered.length === 1 && component.type === "air-conditioner" && this.componentSelectionLayers.get(component.id) !== "airflow";
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const number = Number(component.properties?.airflowOffsetY ?? 34);
    let airflowOffsetX = numeric;
    let airflowOffsetY = number;
    const numericCurrent = Number(this.document?.canvas?.width || 2778);
    const numericNext = Number(this.document?.canvas?.height || 1940);
    const runHelper = arg => {
      const numeric = arg.parentId ? this.componentRecords.get(arg.parentId) : null;
      const number = Number(numeric?.position?.width || numericCurrent);
      const numericPrevious = Number(numeric?.position?.height || numericNext);
      return {
        minX: -arg.width / 2 - arg.initialX,
        maxX: number - arg.width / 2 - arg.initialX,
        minY: -arg.height / 2 - arg.initialY,
        maxY: numericPrevious - arg.height / 2 - arg.initialY
      };
    };
    const clampNumber = (arg, second, pointerEvent) => {
      const state = groupedComponentLocalDelta(second, pointerEvent, arg.parentTransform);
      const helper = runHelper(arg);
      return {
        x: Math.max(helper.minX, Math.min(helper.maxX, state.x)),
        y: Math.max(helper.minY, Math.min(helper.maxY, state.y))
      };
    };
    const numericPrevious = Number(component.position?.x || 0);
    const numericLocal = Number(component.position?.y || 0);
    let position = numericPrevious;
    let stateNext = numericLocal;
    let list = filtered;
    let statePrevious = [];
    let mapped = filtered.map(arg => ({
      componentId: arg.component.id,
      x: arg.initialX,
      y: arg.initialY
    }));
    let id = component.id;
    let flag = false;
    let text = "";
    let eventCurrent = false;
    const pointerId = event.pointerId;
    originEvent.setPointerCapture(pointerId);
    filtered.forEach(arg => arg.host.classList.add("moving"));
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      if (!originEvent.hasPointerCapture?.(pointerId) && originEvent.isConnected) {
        try {
          originEvent.setPointerCapture(pointerId);
        } catch {}
      }
      if (!state && eventHasCommandModifier(event)) {
        state = true;
        stateCurrent = false;
      }
      let value = event.clientX - clientX;
      let amount = event.clientY - clientY;
      if (state && !flag) {
        if (Math.hypot(value, amount) < 3) {
          return;
        }
        statePrevious = filtered.map(arg => {
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
        list = statePrevious.map((arg, index) => ({
          component: arg.copiedComponent,
          host: this.componentHosts.get(arg.copiedComponent.id),
          initialX: filtered[index].initialX,
          initialY: filtered[index].initialY,
          width: filtered[index].width,
          height: filtered[index].height,
          parentId: filtered[index].parentId,
          parentTransform: filtered[index].parentTransform
        }));
        id = statePrevious.find(arg => arg.sourceComponentId === component.id)?.copiedComponent.id || statePrevious[0]?.copiedComponent.id;
        flag = true;
        filtered.forEach(arg => arg.host.classList.remove("moving"));
        list.forEach(arg => arg.host?.classList.add("moving"));
        this.selectedComponentId = id;
        this.selectedComponentIds = new Set(list.map(arg => arg.component.id));
      }
      if (event.shiftKey) {
        if (!text && Math.hypot(value, amount) >= 1) {
          text = Math.abs(value) >= Math.abs(amount) ? "horizontal" : "vertical";
        }
        if (text === "horizontal") {
          amount = 0;
        }
        if (text === "vertical") {
          value = 0;
        }
      } else {
        text = "";
      }
      const stateLocal = value / (this.appliedScaleX || 1);
      const stateItem = amount / (this.appliedScaleY || 1);
      const found = clampNumber(filtered.find(arg => arg.component.id === component.id) || filtered[0], stateLocal, stateItem);
      position = numericPrevious + found.x;
      stateNext = numericLocal + found.y;
      if (stateCurrent) {
        airflowOffsetX = numeric - found.x / Math.max(1, Number(component.position?.width || 100)) * 100;
        airflowOffsetY = number - found.y / Math.max(1, Number(component.position?.height || 100)) * 100;
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
      const mappedCurrent = list.map(arg => {
        const state = clampNumber(arg, stateLocal, stateItem);
        return {
          componentId: arg.component.id,
          x: arg.initialX + state.x,
          y: arg.initialY + state.y
        };
      });
      mapped = mappedCurrent;
      for (const item of mappedCurrent) {
        const size = this.componentHosts.get(item.componentId);
        if (size) {
          size.style.left = item.x + "px";
          size.style.top = item.y + "px";
        }
        const state = this.componentSelectionOverlays.get(item.componentId);
        if (state) {
          state.style.left = item.x + "px";
          state.style.top = item.y + "px";
        }
      }
      if (!flag) {
        if (mappedCurrent.length > 1) {
          this.options.onComponentsTransformPreview?.(mappedCurrent, component.id);
        } else {
          this.options.onComponentTransformPreview?.(component.id, {
            x: position,
            y: stateNext
          });
        }
      }
    };
    const stateLocal = (event = null) => {
      if (!eventCurrent && (event?.pointerId == null || event.pointerId === pointerId) && (eventCurrent = true, list.forEach(arg => arg.host?.classList.remove("moving")), filtered.forEach(arg => arg.host.classList.remove("moving")), window.removeEventListener("pointermove", callback, true), window.removeEventListener("pointerup", stateLocal, true), window.removeEventListener("pointercancel", stateLocal, true), window.removeEventListener("blur", stateLocal), position !== numericPrevious || stateNext !== numericLocal)) {
        if (flag) {
          list.forEach(arg => {
            const found = mapped.find(entry => entry.componentId === arg.component.id);
            arg.component.position = {
              ...(arg.component.position || {}),
              x: found?.x ?? arg.initialX,
              y: found?.y ?? arg.initialY
            };
          });
          this.options.onComponentsDuplicate?.(statePrevious, component.id, id);
        } else if (filtered.length > 1) {
          const found = mapped.map(arg => {
            const found = filtered.find(entry => entry.component.id === arg.componentId);
            if (found) {
              found.component.position = {
                ...(found.component.position || {}),
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
            y: stateNext
          };
          this.options.onComponentTransform?.(component.id, {
            x: position,
            y: stateNext,
            ...(stateCurrent ? {
              airflowOffsetX,
              airflowOffsetY
            } : {})
          });
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", stateLocal, true);
    window.addEventListener("pointercancel", stateLocal, true);
    window.addEventListener("blur", stateLocal);
  }
  createComponentSelectionOverlay(host, component) {
    if (!host || !component || !host.parentElement || host.parentElement !== this.canvas && !host.hidden) {
      return null;
    }
    const hostParentEl = host.parentElement;
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
    hostParentEl.append(element);
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
      const element = document.createElement("i");
      element.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      element.setAttribute("aria-hidden", "true");
      selectionBoundsEl.append(element);
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
    const selectionBoundsElCurrent = document.createElement("div");
    selectionBoundsElCurrent.className = "hb-selection-bounds";
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const element = document.createElement("i");
      element.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      element.setAttribute("aria-hidden", "true");
      selectionBoundsElCurrent.append(element);
    }
    if (selectionBoundsEl && component.properties?.layoutMode !== "fill") {
      const transformHandleEl = document.createElement("button");
      transformHandleEl.type = "button";
      transformHandleEl.className = "hb-transform-handle hb-resize-handle";
      transformHandleEl.title = "拖动缩放";
      transformHandleEl.addEventListener("pointerdown", transformHandleEl => this.startComponentScale(transformHandleEl, component, host, selectionBoundsElCurrent));
      const element = document.createElement("button");
      element.type = "button";
      element.className = "hb-transform-handle hb-rotate-handle";
      element.title = "拖动旋转";
      element.addEventListener("pointerdown", arg => this.startComponentRotate(arg, component, host, selectionBoundsElCurrent));
      selectionBoundsElCurrent.append(transformHandleEl, element);
    }
    element.append(selectionBoundsElCurrent);
    if (component.type === "light-statistics" && element.classList?.contains("hb-light-statistics-selection-overlay")) {
      selectionBoundsElCurrent.addEventListener("pointerdown", arg => this.startComponentMove(arg, component, host, selectionBoundsElCurrent));
    }
    this.updateImageSelectionBounds(host, component, selectionBoundsElCurrent);
    this.updateTextSelectionBounds(host, component, selectionBoundsElCurrent);
    this.updateTitleButtonSelectionBounds(host, component, selectionBoundsElCurrent);
    this.updateDeviceButtonSelectionBounds(host, component, selectionBoundsElCurrent);
    const state = this.updateLightStatisticsSelectionBounds(host, component, selectionBoundsElCurrent);
    if (component.type === "light-statistics" && !state) {
      Object.assign(selectionBoundsElCurrent.style, {
        left: "0",
        top: "0",
        width: "100%",
        height: "100%"
      });
    }
    this.updateAirConditionerButtonSelectionBounds(host, component, selectionBoundsElCurrent);
    this.updateTransformHandleScale(host, component, selectionBoundsElCurrent);
  }
  withSelectionMeasurementHost(host, runHelper) {
    const state = [];
    let stateCurrent = host;
    while (stateCurrent && stateCurrent !== this.canvas) {
      if (stateCurrent.hidden) {
        state.push(stateCurrent);
        stateCurrent.hidden = false;
      }
      stateCurrent = stateCurrent.parentElement;
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
  applyDoorWindowPerspective(element, corners, cornersCurrent) {
    const matchedEl = element?.querySelector(".hb-door-window-visual");
    if (!matchedEl || !corners) {
      return;
    }
    const count = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const max = Math.max(1, Number(corners.position?.width || 100) / count);
    const countCurrent = Math.max(1, Number(corners.position?.height || 100) / count);
    matchedEl.style.transform = doorWindowPerspectiveMatrix(max, countCurrent, cornersCurrent);
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
    const selectionBoundsElCurrent = document.createElement("div");
    selectionBoundsElCurrent.className = "hb-selection-bounds hb-door-window-perspective-bounds";
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.classList.add("hb-door-window-perspective-guide");
    element.setAttribute("viewBox", "0 0 1 1");
    element.setAttribute("preserveAspectRatio", "none");
    element.append(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
    selectionBoundsElCurrent.append(element);
    const doorWindowPerspectiveHandleEl = ["左上角", "右上角", "右下角", "左下角"];
    for (let count = 0; count < 4; count += 1) {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "hb-door-window-perspective-handle";
      element.dataset.perspectiveCornerIndex = String(count);
      element.title = "拖动" + doorWindowPerspectiveHandleEl[count] + "调整透视";
      element.setAttribute("aria-label", element.title);
      element.addEventListener("pointerdown", arg => this.startDoorWindowPerspective(arg, component, host, selectionBoundsElCurrent, count));
      selectionBoundsElCurrent.append(element);
    }
    handleLayer.append(selectionBoundsElCurrent);
    this.updateDoorWindowPerspectiveHandles(selectionBoundsElCurrent, selectionBoundsEl);
    this.updateTransformHandleScale(host, component, selectionBoundsElCurrent);
  }
  startDoorWindowPerspective(event, component, cornerIndex, eventCurrent, eventNext) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const state = doorWindowPerspectiveCorners(component.properties?.perspectiveCorners);
    const stateCurrent = state[eventNext * 2];
    const position = state[eventNext * 2 + 1];
    const count = Math.max(1, Number(component.position?.width || 100));
    const max = Math.max(1, Number(component.position?.height || 100));
    const transform = this.componentWorldTransform(component.id);
    const scale = transform.scale;
    const value = transform.rotation * Math.PI / 180;
    const angle = Math.cos(value);
    const sin = Math.sin(value);
    let perspectiveCorners = state;
    let flag = false;
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      const value = (event.clientX - clientX) / Math.max(0.001, this.appliedScaleX || 1);
      const stateNext = (event.clientY - clientY) / Math.max(0.001, this.appliedScaleY || 1);
      const scaleCurrent = (angle * value + sin * stateNext) / scale;
      const scaleNext = (-sin * value + angle * stateNext) / scale;
      const slice = state.slice();
      slice[eventNext * 2] = stateCurrent + scaleCurrent / count;
      slice[eventNext * 2 + 1] = position + scaleNext / max;
      perspectiveCorners = doorWindowPerspectiveCorners(slice);
      component.properties = {
        ...(component.properties || {}),
        perspectiveCorners
      };
      this.applyDoorWindowPerspective(cornerIndex, component, perspectiveCorners);
      this.updateDoorWindowPerspectiveHandles(eventCurrent, perspectiveCorners);
      this.options.onComponentPropertiesPreview?.(component.id, {
        perspectiveCorners
      });
    };
    const stateNext = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
        window.removeEventListener("pointerup", stateNext, true);
        window.removeEventListener("pointercancel", stateNext, true);
        window.removeEventListener("blur", stateNext);
        if (JSON.stringify(perspectiveCorners) !== JSON.stringify(state)) {
          this.options.onComponentProperties?.(component.id, {
            perspectiveCorners
          });
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", stateNext, true);
    window.addEventListener("pointercancel", stateNext, true);
    window.addEventListener("blur", stateNext);
  }
  appendAirflowTransformHandles(host, component) {
    if (!host || !component) {
      return;
    }
    const selectionBoundsEl = this.createAirflowSelectionOverlay(host, component);
    if (!selectionBoundsEl) {
      return;
    }
    const element = document.createElement("div");
    element.className = "hb-selection-bounds hb-airflow-selection-bounds";
    for (const cornerMarkerEl of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
      const cornerMarkerElCurrent = document.createElement("i");
      cornerMarkerElCurrent.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerElCurrent.setAttribute("aria-hidden", "true");
      element.append(cornerMarkerElCurrent);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动缩放出风效果";
    transformHandleEl.addEventListener("pointerdown", transformHandleEl => this.startAirflowScale(transformHandleEl, component, host, element, selectionBoundsEl));
    const transformHandleElCurrent = document.createElement("button");
    transformHandleElCurrent.type = "button";
    transformHandleElCurrent.className = "hb-transform-handle hb-rotate-handle";
    transformHandleElCurrent.title = "拖动旋转出风效果";
    transformHandleElCurrent.addEventListener("pointerdown", arg => this.startAirflowRotate(arg, component, host, element, selectionBoundsEl));
    element.append(transformHandleEl, transformHandleElCurrent);
    element.addEventListener("pointerdown", arg => this.startAirflowMove(arg, component, host, element, selectionBoundsEl));
    selectionBoundsEl.append(element);
    this.updateAirflowHandleScale(component, element);
  }
  startAirflowMove(event, component, eventCurrent, eventNext, eventPrevious) {
    if (event.button !== 0 || event.target.closest(".hb-transform-handle")) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const clientX = event.clientX;
    const clientY = event.clientY;
    const count = Math.max(1, Number(component.position?.width || 100));
    const max = Math.max(1, Number(component.position?.height || 100));
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const number = Number(component.properties?.airflowOffsetY ?? 34);
    const state = airflowCanvasOffsetBounds(component, this.document?.canvas);
    let airflowOffsetX = numeric;
    let airflowOffsetY = number;
    let text = "";
    let flag = false;
    const pointerId = event.pointerId;
    eventNext.setPointerCapture(pointerId);
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      if (!eventNext.hasPointerCapture?.(pointerId) && eventNext.isConnected) {
        try {
          eventNext.setPointerCapture(pointerId);
        } catch {}
      }
      let value = event.clientX - clientX;
      let amount = event.clientY - clientY;
      if (event.shiftKey) {
        if (!text && Math.hypot(value, amount) >= 1) {
          text = Math.abs(value) >= Math.abs(amount) ? "horizontal" : "vertical";
        }
        if (text === "horizontal") {
          amount = 0;
        }
        if (text === "vertical") {
          value = 0;
        }
      } else {
        text = "";
      }
      const stateCurrent = value / Math.max(0.001, this.appliedScaleX || 1);
      const stateNext = amount / Math.max(0.001, this.appliedScaleY || 1);
      const point = groupedComponentLocalDelta(stateCurrent, stateNext, this.componentParentTransform(component.id));
      airflowOffsetX = Math.max(state.minX, Math.min(state.maxX, numeric + point.x / count * 100));
      airflowOffsetY = Math.max(state.minY, Math.min(state.maxY, number + point.y / max * 100));
      component.properties = {
        ...(component.properties || {}),
        airflowOffsetX,
        airflowOffsetY
      };
      this.syncAirflowLayerGeometry(eventCurrent, component, eventPrevious);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowOffsetX,
        airflowOffsetY
      });
    };
    const stateCurrent = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
        window.removeEventListener("pointerup", stateCurrent, true);
        window.removeEventListener("pointercancel", stateCurrent, true);
        window.removeEventListener("blur", stateCurrent);
        if (airflowOffsetX !== numeric || airflowOffsetY !== number) {
          this.options.onComponentProperties?.(component.id, {
            airflowOffsetX,
            airflowOffsetY
          });
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", stateCurrent, true);
    window.addEventListener("pointercancel", stateCurrent, true);
    window.addEventListener("blur", stateCurrent);
  }
  updateAirflowHandleScale(component, element) {
    if (!component || !element) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(component.properties?.airflowScale || 1)));
    const scale = this.componentParentTransform(component.id).scale;
    const value = 1 / Math.max(0.001, state * count * scale);
    element.style.setProperty("--hb-ui-scale", String(value));
    element.style.setProperty("--hb-handle-outset", value * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  startAirflowScale(event, component, handle, element, pointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const value = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - value));
    const max = Math.max(0.01, Math.min(5, Number(component.properties?.airflowScale || 1)));
    let airflowScale = max;
    let state = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const runHelper = () => {
      this.syncAirflowLayerGeometry(handle, component, pointerEvent);
      this.updateAirflowHandleScale(component, element);
    };
    const clamped = event => {
      const hypot = Math.hypot(event.clientX - size, event.clientY - value);
      airflowScale = Math.max(0.01, Math.min(5, max * hypot / count));
      component.properties = {
        ...(component.properties || {}),
        airflowScale
      };
      runHelper();
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowScale
      });
    };
    const callback = () => {
      if (!state) {
        state = true;
        currentTarget.removeEventListener("pointermove", clamped);
        currentTarget.removeEventListener("pointerup", callback);
        currentTarget.removeEventListener("pointercancel", callback);
        currentTarget.removeEventListener("lostpointercapture", callback);
        if (airflowScale !== max) {
          this.options.onComponentProperties?.(component.id, {
            airflowScale
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", clamped);
    currentTarget.addEventListener("pointerup", callback);
    currentTarget.addEventListener("pointercancel", callback);
    currentTarget.addEventListener("lostpointercapture", callback);
  }
  startAirflowRotate(event, component, pointerEvent, element, handleEl) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const value = domRect.top + domRect.height / 2;
    const atan = Math.atan2(event.clientY - value, event.clientX - size);
    const numeric = Number(component.properties?.airflowRotation || 0);
    let airflowRotation = numeric;
    let state = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const callback = event => {
      const state = Math.atan2(event.clientY - value, event.clientX - size);
      airflowRotation = numeric + (state - atan) * 180 / Math.PI;
      component.properties = {
        ...(component.properties || {}),
        airflowRotation
      };
      this.syncAirflowLayerGeometry(pointerEvent, component, handleEl);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowRotation
      });
    };
    const stateCurrent = () => {
      if (!state) {
        state = true;
        currentTarget.removeEventListener("pointermove", callback);
        currentTarget.removeEventListener("pointerup", stateCurrent);
        currentTarget.removeEventListener("pointercancel", stateCurrent);
        currentTarget.removeEventListener("lostpointercapture", stateCurrent);
        if (airflowRotation !== numeric) {
          this.options.onComponentProperties?.(component.id, {
            airflowRotation
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", callback);
    currentTarget.addEventListener("pointerup", stateCurrent);
    currentTarget.addEventListener("pointercancel", stateCurrent);
    currentTarget.addEventListener("lostpointercapture", stateCurrent);
  }
  updateAirConditionerButtonSelectionBounds(componentId, component, selectionBounds) {
    if (!componentId || component?.type !== "air-conditioner" || !selectionBounds) {
      return;
    }
    const position = component.properties || {};
    const count = Math.max(1, Number(component.position?.width || 100));
    const max = Math.max(1, Number(component.position?.height || 100));
    const countCurrent = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
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
    const callback = (arg, second, selectionBounds, element) => {
      const countNext = Math.max(element, Number(arg?.offsetWidth || 0) * countCurrent);
      const countPrevious = Math.max(element, Number(arg?.offsetHeight || 0) * countCurrent);
      const left = count * clampNumber(second, -100, 200, 0) / 100;
      const size = max * clampNumber(selectionBounds, -100, 200, 50) / 100;
      state.push({
        left,
        top: size - countPrevious / 2,
        right: left + countNext,
        bottom: size + countPrevious / 2
      });
    };
    const value = max * clampNumber(position.badgeSize, 1, 100, 28) / 100;
    if (position.iconVisible !== false) {
      runHelper(count * clampNumber(position.iconLeft, -100, 200, 20) / 100, max * clampNumber(position.iconTop, -100, 200, 50) / 100, value, value);
    }
    if (position.mainTextVisible !== false) {
      callback(componentId.querySelector(":scope > .hb-air-conditioner .hb-air-conditioner-text strong"), position.mainTextLeft, position.mainTextTop, max * clampNumber(position.mainSize, 6, 120, 21) / 100);
    }
    if (position.secondaryTextVisible !== false) {
      callback(componentId.querySelector(":scope > .hb-air-conditioner .hb-air-conditioner-text small"), position.secondaryTextLeft, position.secondaryTextTop, max * clampNumber(position.secondarySize, 5, 80, 12) / 100);
    }
    if (!state.length) {
      Object.assign(selectionBounds.style, {
        left: "0px",
        top: "0px",
        width: count + "px",
        height: max + "px"
      });
      return;
    }
    const size = 4;
    const mapped = Math.min(...state.map(arg => arg.left)) - size;
    const mappedCurrent = Math.min(...state.map(arg => arg.top)) - size;
    const mappedNext = Math.max(...state.map(arg => arg.right)) + size;
    const mappedPrevious = Math.max(...state.map(arg => arg.bottom)) + size;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mappedCurrent + "px",
      width: Math.max(1, mappedNext - mapped) + "px",
      height: Math.max(1, mappedPrevious - mappedCurrent) + "px"
    });
  }
  updateDeviceButtonSelectionBounds(componentId, component, selectionBounds) {
    if (!componentId || component?.type !== "device-button" || !selectionBounds) {
      return false;
    }
    const state = component.properties || {};
    const position = state.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const max = Math.max(1, Number(component.position?.height || 100));
    const countCurrent = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
    const list = [];
    const clampNumber = (arg, second, selectionBounds, fourth) => {
      const numeric = Number(arg);
      return Math.max(second, Math.min(selectionBounds, Number.isFinite(numeric) ? numeric : fourth));
    };
    const runHelper = (arg, top, selectionBounds, height) => {
      if (!![arg, top, selectionBounds, height].every(Number.isFinite) && !(selectionBounds <= 0) && !(height <= 0)) {
        list.push({
          left: arg - selectionBounds / 2,
          top: top - height / 2,
          right: arg + selectionBounds / 2,
          bottom: top + height / 2
        });
      }
    };
    const callback = (arg, second, selectionBounds, element) => {
      const countNext = Math.max(element, Number(arg?.offsetWidth || 0) * countCurrent);
      const countPrevious = Math.max(element, Number(arg?.offsetHeight || 0) * countCurrent);
      const left = count * clampNumber(second, -100, 200, 0) / 100;
      const size = max * clampNumber(selectionBounds, -100, 200, 50) / 100;
      list.push({
        left,
        top: size - countPrevious / 2,
        right: left + countNext,
        bottom: size + countPrevious / 2
      });
    };
    const value = max * clampNumber(state.badgeSize ?? state.iconSize, 1, 100, 28) / 100;
    if (state.iconVisible !== false || position) {
      runHelper(count * clampNumber(state.iconLeft, -100, 200, 20) / 100, max * clampNumber(state.iconTop, -100, 200, 50) / 100, value, value);
    }
    if (state.mainTextVisible !== false || position) {
      callback(componentId.querySelector(":scope > .hb-icon-button .hb-icon-button-text strong"), state.mainTextLeft, state.mainTextTop, max * clampNumber(state.mainSize, 6, 120, 21) / 100);
    }
    if (state.secondaryTextVisible !== false || position) {
      callback(componentId.querySelector(":scope > .hb-icon-button .hb-icon-button-text small"), state.secondaryTextLeft, state.secondaryTextTop, max * clampNumber(state.secondarySize, 5, 80, 12) / 100);
    }
    if (!list.length) {
      return false;
    }
    const size = 4;
    const mapped = Math.min(...list.map(arg => arg.left)) - size;
    const mappedCurrent = Math.min(...list.map(arg => arg.top)) - size;
    const mappedNext = Math.max(...list.map(arg => arg.right)) + size;
    const mappedPrevious = Math.max(...list.map(arg => arg.bottom)) + size;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: mappedCurrent + "px",
      width: Math.max(1, mappedNext - mapped) + "px",
      height: Math.max(1, mappedPrevious - mappedCurrent) + "px"
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
    const max = Math.max(1, Number(component.position?.height || 100));
    const countCurrent = Math.max(0.01, Number(this.document?.canvas?.componentScale || 1));
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
      const value = clampNumber(state.frameSize, 10, 300, 100) / 100;
      const stateCurrent = max * 0.45 * value;
      const stateNext = count / 2 + count * clampNumber(state.frameOffsetX, -100, 100, 0) / 100;
      const statePrevious = max / 2 + max * clampNumber(state.frameOffsetY, -100, 100, 0) / 100;
      const stateLocal = count * clampNumber(state.frameSpacing, 0, 300, 100) / 200;
      const stateItem = max * 0.12;
      const number = clampNumber(state.frameWidth, 0, 12, 1.5);
      runHelper(stateNext - stateLocal - number / 2, statePrevious - stateCurrent / 2 - number / 2, stateItem + number, stateCurrent + number);
      runHelper(stateNext + stateLocal - stateItem - number / 2, statePrevious - stateCurrent / 2 - number / 2, stateItem + number, stateCurrent + number);
    }
    if (state.mainTextVisible !== false || position) {
      const element = componentId.querySelector(":scope > .hb-title-button .hb-title-button-main");
      const value = max * clampNumber(state.mainSize, 8, 200, 34) / 100;
      runHelper(count * clampNumber(state.mainTextLeft, -100, 200, 5.5) / 100, max * clampNumber(state.mainTextTop, -100, 200, 45) / 100 - value / 2, Math.max(value, Number(element?.offsetWidth || 0) * countCurrent), Math.max(value, Number(element?.offsetHeight || 0) * countCurrent));
    }
    if (state.secondaryTextVisible !== false || position) {
      const element = componentId.querySelector(":scope > .hb-title-button .hb-title-button-secondary");
      const value = max * clampNumber(state.secondarySize, 6, 100, 12) / 100;
      const countNext = Math.max(value, Number(element?.offsetHeight || 0) * countCurrent);
      runHelper(count * clampNumber(state.secondaryTextLeft, -100, 200, 54) / 100, max * clampNumber(state.secondaryTextTop, -100, 200, 43) / 100 - countNext / 2, Math.max(value, Number(element?.offsetWidth || 0) * countCurrent), countNext);
    }
    if ((state.iconVisible !== false || position) && state.icon) {
      const value = max * clampNumber(state.iconSize, 1, 100, 30) / 100;
      runHelper(count * clampNumber(state.iconLeft, -100, 200, 50) / 100 - value / 2, max * clampNumber(state.iconTop, -100, 200, 45) / 100 - value / 2, value, value);
    }
    if (state.markerVisible !== false || position) {
      const value = max * clampNumber(state.markerSize, 2, 60, 10) / 100;
      const stateCurrent = count * clampNumber(state.markerLeft, -100, 200, 1.8) / 100;
      const stateNext = max * clampNumber(state.markerTop, -100, 200, 84) / 100;
      runHelper(stateCurrent - value * 0.58, stateNext, value * 1.16, value);
    }
    if (!size.length) {
      return false;
    }
    const sizeCurrent = 4;
    const mapped = Math.min(...size.map(arg => arg.left)) - sizeCurrent;
    const value = Math.min(...size.map(arg => arg.top)) - sizeCurrent;
    const mappedCurrent = Math.max(...size.map(arg => arg.right)) + sizeCurrent;
    const mappedNext = Math.max(...size.map(arg => arg.bottom)) + sizeCurrent;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: value + "px",
      width: Math.max(1, mappedCurrent - mapped) + "px",
      height: Math.max(1, mappedNext - value) + "px"
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
    const value = (Math.min(...filtered.map(arg => arg.offsetTop)) - state) * count;
    const mappedCurrent = (Math.max(...filtered.map(arg => arg.offsetLeft + arg.offsetWidth)) + state) * count;
    const mappedNext = (Math.max(...filtered.map(arg => arg.offsetTop + arg.offsetHeight)) + state) * count;
    Object.assign(selectionBounds.style, {
      left: mapped + "px",
      top: value + "px",
      width: Math.max(1, mappedCurrent - mapped) + "px",
      height: Math.max(1, mappedNext - value) + "px"
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
        const max = Math.max(1, Number(hostEl.position?.width || 100));
        const countCurrent = Math.max(1, Number(hostEl.position?.height || 100));
        if (!matchedEl.length) {
          const clamped = Math.min(32, Math.max(20, Math.min(max, countCurrent) * 0.2));
          Object.assign(selectionBounds.style, {
            left: (max - clamped) / 2 + "px",
            top: (countCurrent - clamped) / 2 + "px",
            width: clamped + "px",
            height: clamped + "px"
          });
          return false;
        }
        const mapped = matchedEl.map(arg => this.selectionElementBox(arg, componentId));
        const size = 3;
        const value = (Math.min(...mapped.map(arg => arg.left)) - size) * count;
        const mappedCurrent = (Math.min(...mapped.map(arg => arg.top)) - size) * count;
        const mappedNext = (Math.max(...mapped.map(arg => arg.left + arg.width)) + size) * count;
        const mappedPrevious = (Math.max(...mapped.map(arg => arg.top + arg.height)) + size) * count;
        Object.assign(selectionBounds.style, {
          left: value + "px",
          top: mappedCurrent + "px",
          width: Math.max(1, mappedNext - value) + "px",
          height: Math.max(1, mappedPrevious - mappedCurrent) + "px"
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
    const number = Number(hostEl.position?.height || 100);
    const position = element.naturalWidth / element.naturalHeight;
    const state = numeric / number;
    const stateCurrent = position >= state ? numeric : number * position;
    const value = position >= state ? numeric / position : number;
    const size = (numeric - stateCurrent) / 2;
    const sizeCurrent = (number - value) / 2;
    Object.assign(selectionBounds.style, {
      left: size / numeric * 100 + "%",
      top: sizeCurrent / number * 100 + "%",
      width: stateCurrent / numeric * 100 + "%",
      height: value / number * 100 + "%"
    });
  }
  updateTransformHandleScale(componentId, handleRoot, scaleOverride = null) {
    if (!componentId || !handleRoot) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(handleRoot.style?.scale || 1)));
    const scale = this.componentParentTransform(handleRoot.id).scale;
    const value = 1 / Math.max(0.001, state * count * scale);
    const element = scaleOverride || this.componentSelectionOverlays.get(handleRoot.id)?.querySelector(":scope > .hb-selection-bounds") || componentId.querySelector(":scope > .hb-selection-bounds");
    if (!element) {
      return;
    }
    element.style.setProperty("--hb-ui-scale", String(value));
    element.style.setProperty("--hb-handle-outset", value * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle("handles-outside", domRect.width < 132 || domRect.height < 112);
  }
  startComponentScale(event, componentId, element, elementCurrent) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = elementCurrent?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const value = domRect.top + domRect.height / 2;
    const count = Math.max(1, Math.hypot(event.clientX - size, event.clientY - value));
    const max = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    let scale = max;
    let flag = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      const hypot = Math.hypot(event.clientX - size, event.clientY - value);
      scale = Math.max(0.01, Math.min(5, max * hypot / count));
      componentId.style = {
        ...(componentId.style || {}),
        scale
      };
      element.style.transform = "rotate(" + Number(componentId.position?.rotation || 0) + "deg) scale(" + scale + ")";
      const entry = this.componentSelectionOverlays.get(componentId.id);
      if (entry) {
        entry.style.transform = element.style.transform;
      }
      this.updateTransformHandleScale(element, componentId, elementCurrent);
      this.options.onComponentTransformPreview?.(componentId.id, {
        scale
      });
    };
    const scaleCurrent = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
        window.removeEventListener("pointerup", scaleCurrent, true);
        window.removeEventListener("pointercancel", scaleCurrent, true);
        window.removeEventListener("blur", scaleCurrent);
        componentId.style = {
          ...(componentId.style || {}),
          scale
        };
        if (scale !== max) {
          this.options.onComponentTransform?.(componentId.id, {
            scale
          });
        }
      }
    };
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", scaleCurrent, true);
    window.addEventListener("pointercancel", scaleCurrent, true);
    window.addEventListener("blur", scaleCurrent);
  }
  startComponentRotate(event, componentId, element, elementCurrent) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = elementCurrent?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const value = domRect.top + domRect.height / 2;
    const position = Math.atan2(event.clientY - value, event.clientX - size);
    const numeric = Number(componentId.position?.rotation || 0);
    let rotation = numeric;
    let flag = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const callback = event => {
      if (event.pointerId !== pointerId) {
        return;
      }
      const angle = Math.atan2(event.clientY - value, event.clientX - size);
      rotation = numeric + (angle - position) * 180 / Math.PI;
      element.style.transform = "rotate(" + rotation + "deg) scale(" + Number(componentId.style?.scale || 1) + ")";
      const scale = this.componentSelectionOverlays.get(componentId.id);
      if (scale) {
        scale.style.transform = element.style.transform;
      }
      this.options.onComponentTransformPreview?.(componentId.id, {
        rotation
      });
    };
    const angle = (event = null) => {
      if (!flag && (event?.pointerId == null || event.pointerId === pointerId)) {
        flag = true;
        window.removeEventListener("pointermove", callback, true);
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
    window.addEventListener("pointermove", callback, true);
    window.addEventListener("pointerup", angle, true);
    window.addEventListener("pointercancel", angle, true);
    window.addEventListener("blur", angle);
  }
  bindRuntimeActions(host, component) {
    let state = null;
    let stateCurrent = null;
    let bindRuntimeActionsValue = null;
    let flag = false;
    let event = null;
    let point = null;
    let count = 0;
    let stateNext = null;
    let statePrevious;
    const tap = isComponentActionSupported(component, component.actions?.tap) ? component.actions.tap : null;
    const doubleTap = isComponentActionSupported(component, component.actions?.doubleTap) ? component.actions.doubleTap : null;
    const hold = isComponentActionSupported(component, component.actions?.hold) ? component.actions.hold : null;
    const value = !!tap?.type && tap.type !== "none";
    const stateLocal = !!doubleTap?.type && doubleTap.type !== "none";
    const stateItem = !!hold?.type && hold.type !== "none";
    const runHelper = () => {
      this.options.onRuntimeButtonPress?.(host);
    };
    const callback = () => {
      if (stateNext || tap?.type !== "toggle") {
        return;
      }
      const entityId = component.bindings?.entity?.entityId;
      if (entityId && !isVirtualEntityId(entityId)) {
        statePrevious = this.states.get(this.powerEntityId(component, entityId));
        stateNext = this.applyOptimisticToggle(entityId, component);
      }
    };
    const runHelperCurrent = () => {
      stateNext?.();
      stateNext = null;
      statePrevious = undefined;
    };
    const runHelperNext = () => {
      const optimisticRollback = stateNext;
      const optimisticPreviousState = statePrevious;
      stateNext = null;
      statePrevious = undefined;
      if (value) {
        this.runAction(component, tap, {
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
    host.addEventListener("pointerdown", eventCurrent => {
      flag = false;
      event = {
        pointerId: eventCurrent.pointerId,
        pointerType: eventCurrent.pointerType || "mouse",
        x: eventCurrent.clientX,
        y: eventCurrent.clientY,
        moved: false
      };
      if (stateItem) {
        bindRuntimeActionsValue = window.setTimeout(() => {
          flag = true;
          point = null;
          window.clearTimeout(stateCurrent);
          runHelper();
          this.runAction(component, hold);
        }, 400);
      }
    });
    const scheduleTimeout = () => window.clearTimeout(bindRuntimeActionsValue);
    host.addEventListener("pointermove", eventCurrent => {
      if (!!event && event.pointerId === eventCurrent.pointerId && !(Math.hypot(eventCurrent.clientX - event.x, eventCurrent.clientY - event.y) <= 18)) {
        event.moved = true;
        scheduleTimeout();
      }
    });
    host.addEventListener("pointerup", event => {
      scheduleTimeout();
      const eventCurrent = event?.pointerId === event.pointerId ? event : null;
      event = null;
      if (!eventCurrent || eventCurrent.pointerType === "mouse" || eventCurrent.moved || flag) {
        return;
      }
      event.preventDefault();
      count = performance.now() + 700;
      if (value || stateLocal) {
        runHelper();
      }
      const time = performance.now();
      if (stateLocal && point && time - point.time <= 180 && Math.hypot(event.clientX - point.x, event.clientY - point.y) <= 34) {
        window.clearTimeout(stateCurrent);
        runHelperCurrent();
        point = null;
        this.runAction(component, doubleTap);
        return;
      }
      point = {
        time,
        x: event.clientX,
        y: event.clientY
      };
      if (stateLocal) {
        callback();
        window.clearTimeout(stateCurrent);
        stateCurrent = window.setTimeout(() => {
          runHelperNext();
          point = null;
        }, 180);
      } else {
        if (value) {
          this.runAction(component, tap);
        }
        point = null;
      }
    });
    host.addEventListener("pointercancel", () => {
      scheduleTimeout();
      event = null;
    });
    host.addEventListener("click", () => {
      if (!(performance.now() < count) && !flag) {
        if (value || stateLocal) {
          runHelper();
        }
        if (stateLocal) {
          callback();
          window.clearTimeout(state);
          state = window.setTimeout(() => {
            runHelperNext();
          }, 180);
        } else if (value) {
          this.runAction(component, tap);
        }
      }
    });
    host.addEventListener("dblclick", () => {
      window.clearTimeout(state);
      runHelperCurrent();
      if (stateLocal) {
        this.runAction(component, doubleTap);
      }
    });
    this.cleanups.push(() => {
      window.clearTimeout(state);
      window.clearTimeout(stateCurrent);
      window.clearTimeout(bindRuntimeActionsValue);
      runHelperCurrent();
    });
  }
  runAction(component, componentCurrent, actionOptions = {}) {
    if (!!componentCurrent?.type && componentCurrent.type !== "none") {
      this.dispatchAction(component, componentCurrent, actionOptions).catch(arg => {
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
  popupComponentForEntity(entityIdCurrent, preferredType = "") {
    let entityId = String(entityIdCurrent || "");
    let entityIdNext = entityId.split(".")[0];
    const state = this.deviceProfile(entityId);
    if (state?.deviceType === "air-purifier" && state.roles?.fan && entityIdNext !== "fan") {
      entityId = state.roles.fan;
      entityIdNext = "fan";
    }
    const text = state?.roles?.climate || state?.roles?.fan || "";
    if (["air-conditioner", "bath-heater"].includes(state?.deviceType) && text && !["climate", "light"].includes(entityIdNext)) {
      entityId = text;
      entityIdNext = entityId.split(".")[0];
    }
    const entry = this.entityMetadata.get(entityId);
    if (entityIdNext === "sensor" && entry?.deviceId && ["state", "status", "task_status"].includes(entry.translationKey)) {
      const found = [...this.entityMetadata.values()].find(arg => arg.deviceId === entry.deviceId && arg.domain === "vacuum" && entityMetadataIsAvailable(arg));
      if (found?.entityId) {
        entityId = found.entityId;
        entityIdNext = "vacuum";
      }
    }
    const type = state?.deviceType === "electric-bed" ? "electric-bed" : state?.deviceType === "air-purifier" && entityIdNext === "fan" ? "air-purifier" : ["air-conditioner", "bath-heater"].includes(state?.deviceType) && ["climate", "fan"].includes(entityIdNext) || entityIdNext === "climate" ? "air-conditioner" : entityIdNext === "water_heater" ? "water-heater" : entityIdNext === "camera" ? "camera" : entityIdNext === "media_player" ? "media-player" : ["fan", "select", "number", "input_number"].includes(entityIdNext) ? "device-button" : ["light", "switch", "input_boolean"].includes(entityIdNext) ? "icon-button" : entityIdNext === "sensor" ? "line-chart" : entityIdNext === "vacuum" ? "vacuum-control" : "device-button";
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
  showActionPopup(component, componentCurrent, {
    preview = false
  } = {}) {
    const state = componentCurrent?.data?.popupSource || "current";
    if (state === "custom") {
      const found = (this.document?.customPopups || []).find(arg => arg.id === componentCurrent.data?.popupId);
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
    let entity = state === "entity" ? this.popupComponentForEntity(componentCurrent.data?.entityId, componentDialogTitle(component, componentCurrent.data?.title || componentCurrent.data?.entityId)) : asString ? component : this.popupComponentForEntity(entityId, componentDialogTitle(component, ""));
    if (state !== "entity" && entity !== component && component?.properties?.relatedEntities) {
      entity = {
        ...entity,
        properties: {
          ...(entity.properties || {}),
          relatedEntities: structuredClone(component.properties.relatedEntities)
        }
      };
    }
    if (!entity?.bindings?.entity?.entityId) {
      throw new Error("该弹窗没有可用实体。");
    }
    if (entity.type === "camera") {
      this.showCameraPreview(entity, {
        preview
      });
    } else {
      this.showEntityDetails(entity, {
        preview
      });
    }
  }
  async dispatchAction(component, componentCurrent, {
    optimisticAlreadyApplied = false,
    optimisticRollback = null,
    optimisticPreviousState
  } = {}) {
    if (componentCurrent.type === "toggle") {
      const entityId = component.bindings?.entity?.entityId;
      if (!entityId) {
        throw new Error("该控件没有关联实体。");
      }
      if (isVirtualEntityId(entityId)) {
        this.toggleVirtualEntity(entityId);
        return;
      }
      const state = typeof this.powerEntityId == "function" ? this.powerEntityId(component, entityId) : entityId;
      const stateCurrent = state.split(".", 1)[0];
      if (["button", "script"].includes(stateCurrent)) {
        const command = entityToggleCommand(state, this.states.get(state), component);
        await this.callEntityService(command.domain, command.service, state, command.data);
        return;
      }
      const stateNext = optimisticAlreadyApplied ? optimisticPreviousState : this.states.get(state);
      const runHelper = optimisticAlreadyApplied ? optimisticRollback || (() => {}) : this.applyOptimisticToggle(state, component);
      try {
        if (stateCurrent === "cover") {
          const index = new Map(this.states);
          if (stateNext === undefined) {
            index.delete(state);
          } else {
            index.set(state, stateNext);
          }
          await this.callEntityService("cover", coverToggleServiceForComponent(component, this.entityMetadata, index, state), state);
        } else if (["climate", "fan", "water_heater", "media_player"].includes(stateCurrent)) {
          const stateCurrent = typeof this.runtimePowerComponent == "function" ? this.runtimePowerComponent(component, entityId) : component;
          const command = entityToggleCommand(state, stateNext, stateCurrent);
          await this.callEntityService(command.domain, command.service, state, command.data);
        } else {
          await this.callEntityService("homeassistant", "toggle", state);
        }
      } catch (error) {
        runHelper();
        throw error;
      }
      return;
    }
    if (componentCurrent.type === "more-info") {
      this.showActionPopup(component, componentCurrent);
      return;
    }
    if (componentCurrent.type === "navigate") {
      if (!componentCurrent.target || !this.document?.pages?.some(event => event.path === componentCurrent.target)) {
        throw new Error("跳转的页面不存在。");
      }
      this.navigate(componentCurrent.target);
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
      const error = new Error(typeof state.detail == "string" ? state.detail : state.detail?.message || "实体操作失败。");
      throw window.HABridgeLog?.linkError(error, response) || error;
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
    const elementCurrent = document.createElement("button");
    elementCurrent.type = "button";
    elementCurrent.className = "hb-media-browser-back";
    elementCurrent.textContent = "返回";
    elementCurrent.hidden = true;
    const elementNext = document.createElement("strong");
    elementNext.className = "hb-media-browser-location";
    elementNext.textContent = "媒体库";
    const elementPrevious = document.createElement("span");
    elementPrevious.className = "hb-media-browser-status";
    const elementLocal = document.createElement("button");
    elementLocal.type = "button";
    elementLocal.className = "hb-media-browser-close";
    elementLocal.textContent = "×";
    elementLocal.setAttribute("aria-label", "关闭媒体选择");
    mediaBrowserToolbarEl.append(elementCurrent, elementNext, elementPrevious, elementLocal);
    const mediaBrowserListEl = document.createElement("div");
    mediaBrowserListEl.className = "hb-media-browser-list";
    panel.append(mediaBrowserToolbarEl, mediaBrowserListEl);
    root.append(element);
    let id = "media-source://";
    let type = "";
    let state = [];
    let flag = false;
    let stateCurrent = false;
    const runHelper = (arg = "") => {
      elementPrevious.textContent = arg;
    };
    const syncAriaState = () => {
      panel.hidden = true;
      element.setAttribute("aria-expanded", "false");
    };
    const queryChildElement = arg => {
      flag = !!arg;
      element.disabled = preview || flag || !stateCurrent;
      elementCurrent.disabled = flag;
      mediaBrowserListEl.querySelectorAll("button").forEach(buttonEl => {
        buttonEl.disabled = flag;
      });
    };
    const callback = arg => String(arg?.title || arg?.name || arg?.media_content_id || "未命名媒体");
    const runHelperCurrent = async (arg, labelText = "", {
      pushHistory = true
    } = {}) => {
      if (!flag && !preview && !!stateCurrent) {
        queryChildElement(true);
        runHelper("读取中…");
        try {
          const media = await this.browseMedia(entityId, arg, labelText);
          if (pushHistory && id !== arg) {
            state.push({
              id,
              type,
              title: elementNext.textContent
            });
          }
          id = arg;
          type = labelText || "";
          elementNext.textContent = callback(media) || "媒体库";
          elementCurrent.hidden = state.length === 0;
          mediaBrowserListEl.replaceChildren();
          const list = Array.isArray(media?.children) ? media.children : [];
          if (!list.length) {
            const element = document.createElement("p");
            element.className = "hb-media-browser-empty";
            element.textContent = "此处没有可播放的媒体。";
            mediaBrowserListEl.append(element);
          }
          list.forEach(mediaBrowserItemEl => {
            const element = document.createElement("div");
            element.className = "hb-media-browser-item";
            const elementCurrent = document.createElement("span");
            elementCurrent.className = "hb-media-browser-item-title";
            elementCurrent.textContent = callback(mediaBrowserItemEl);
            const elementNext = document.createElement("button");
            elementNext.type = "button";
            const state = !!mediaBrowserItemEl?.can_expand || !!mediaBrowserItemEl?.children;
            const stateCurrent = !!mediaBrowserItemEl?.can_play;
            elementNext.textContent = state ? "打开" : "播放";
            elementNext.disabled = !state && !stateCurrent;
            elementNext.addEventListener("click", async () => {
              if (state) {
                await runHelperCurrent(mediaBrowserItemEl.media_content_id, mediaBrowserItemEl.media_content_type || "", {
                  pushHistory: true
                });
                return;
              }
              if (!!stateCurrent && !flag) {
                queryChildElement(true);
                runHelper("发送播放…");
                try {
                  await this.callEntityService("media_player", "play_media", entityId, {
                    media_content_id: mediaBrowserItemEl.media_content_id,
                    media_content_type: mediaBrowserItemEl.media_content_type || "music"
                  });
                  runHelper("");
                } catch (error) {
                  runHelper(error.message || "播放失败");
                  this.options.onError?.(error);
                } finally {
                  queryChildElement(false);
                }
              }
            });
            element.append(elementCurrent, elementNext);
            mediaBrowserListEl.append(element);
          });
          panel.hidden = false;
          element.setAttribute("aria-expanded", "true");
          runHelper(list.length ? list.length + " 项" : "");
        } catch (error) {
          const text = String(error?.message || "媒体目录读取失败");
          runHelper(text.includes("Media directory does not exist") ? "此目录暂无媒体" : text);
          mediaBrowserListEl.replaceChildren();
          const elementCurrent = document.createElement("p");
          elementCurrent.className = "hb-media-browser-empty";
          elementCurrent.textContent = text.includes("Media directory does not exist") ? "此目录暂无可用媒体。" : text;
          mediaBrowserListEl.append(elementCurrent);
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
      runHelperCurrent(id, type, {
        pushHistory: false
      });
    });
    elementLocal.addEventListener("click", syncAriaState);
    elementCurrent.addEventListener("click", async () => {
      const last = state.pop();
      if (last) {
        await runHelperCurrent(last.id, last.type, {
          pushHistory: false
        });
        elementNext.textContent = last.title || "媒体库";
        elementCurrent.hidden = state.length === 0;
      }
    });
    return {
      root,
      panel,
      sync: sync => {
        stateCurrent = !!(Number(sync?.attributes?.supported_features || 0) & 512);
        root.hidden = !stateCurrent;
        if (!stateCurrent) {
          syncAriaState();
        }
        element.disabled = preview || flag || !stateCurrent;
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
    const rect = this.viewport?.getBoundingClientRect();
    const dialogViewport = runtimeDialogViewport({
      layerLeft: domRect.left,
      layerTop: domRect.top,
      layerWidth: domRect.width || runtimeDialogScaleContext.dialogLayer.clientWidth || this.container.clientWidth,
      layerHeight: domRect.height || runtimeDialogScaleContext.dialogLayer.clientHeight || this.container.clientHeight,
      dashboardLeft: rect?.left,
      dashboardTop: rect?.top,
      dashboardWidth: rect?.width,
      dashboardHeight: rect?.height
    });
    const layerWidth = dialogViewport.width;
    const layerHeight = dialogViewport.height;
    const count = Math.max(Number(runtimeDialogScaleContext.dialog.offsetWidth || 0), Number(runtimeDialogScaleContext.dialog.scrollWidth || 0));
    const max = Math.max(Number(runtimeDialogScaleContext.dialog.offsetHeight || 0), Number(runtimeDialogScaleContext.dialog.scrollHeight || 0));
    const layoutWidth = count > 1 ? count : runtimeDialogScaleContext.designWidth;
    const layoutHeight = max > 1 ? max : runtimeDialogScaleContext.designHeight;
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
    const elementCurrent = document.createElement("span");
    elementCurrent.className = "hb-camera-preview-status";
    elementCurrent.textContent = interaction3d ? "正在加载画面" : "正在连接";
    elementCurrent.classList.add("is-connecting");
    cameraPreviewStatusEl.append(element, elementCurrent);
    const elementNext = document.createElement("button");
    elementNext.type = "button";
    elementNext.setAttribute("aria-label", "关闭摄像头预览");
    elementNext.textContent = "×";
    cameraPreviewHeadingEl.append(cameraPreviewStatusEl, elementNext);
    const elementPrevious = document.createElement("section");
    elementPrevious.className = "hb-camera-device-visual";
    elementPrevious.setAttribute("aria-hidden", "true");
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
    elementPrevious.append(cameraDeviceMountEl, cameraDeviceArmEl, cameraDeviceBodyEl);
    let state = 0;
    let stateCurrent = null;
    let count = 0;
    const runHelper = (arg, delayOrNumber = 0) => "translateX(-50%) perspective(260px) rotateY(" + arg + "deg) rotateZ(" + arg * 0.035 + "deg) translateY(" + delayOrNumber + "px)";
    const filtered = () => {
      if (!cameraDeviceBodyEl.isConnected) {
        return;
      }
      const filteredCurrent = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(arg => Math.abs(arg - count) >= 7);
      const stateNext = filteredCurrent[Math.floor(Math.random() * filteredCurrent.length)] ?? 0;
      const sign = Math.sign(stateNext - count) || 1;
      const abs = Math.abs(stateNext - count);
      const duration = Math.round(430 + abs * 18 + Math.random() * 320);
      const value = stateNext + sign * (1.4 + Math.random() * 2.2);
      const statePrevious = Math.random() * 1.4 - 0.7;
      cameraDeviceLensEl.style.setProperty("--hb-camera-lens-shift", stateNext / 23 * 2.5 + "px");
      stateCurrent?.cancel();
      stateCurrent = cameraDeviceBodyEl.animate([{
        transform: runHelper(count, 0),
        offset: 0
      }, {
        transform: runHelper(value, statePrevious),
        offset: 0.78
      }, {
        transform: runHelper(stateNext, statePrevious * 0.35),
        offset: 1
      }], {
        duration,
        easing: "cubic-bezier(.2,.72,.22,1)",
        fill: "forwards"
      });
      stateCurrent.addEventListener("finish", () => {
        count = stateNext;
        cameraDeviceBodyEl.style.transform = runHelper(count, statePrevious * 0.35);
        stateCurrent?.cancel();
        stateCurrent = null;
        const value = Math.random() < 0.22 ? 180 + Math.random() * 260 : 680 + Math.random() * 1500;
        state = window.setTimeout(filtered, value);
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
    const stateNext = !!interaction3d;
    const value = component.properties?.mediaVisible !== false;
    container.classList.toggle("is-16-9", !stateNext);
    container.classList.toggle("media-hidden", !value);
    const list = [];
    let flag = false;
    const onReady = () => {
      if (!flag) {
        flag = true;
        elementCurrent.textContent = "实时画面";
        elementCurrent.classList.remove("is-connecting", "is-unavailable");
        elementCurrent.classList.add("is-live");
        elementPrevious.classList.remove("is-unavailable");
        elementPrevious.classList.add("is-live");
        container.classList.remove("is-connecting", "is-unavailable", "is-revealing");
        container.classList.add("is-ready");
      }
    };
    const onUnavailable = () => {
      elementCurrent.textContent = "画面不可用";
      elementCurrent.classList.remove("is-connecting", "is-live");
      elementCurrent.classList.add("is-unavailable");
      elementPrevious.classList.remove("is-live");
      elementPrevious.classList.add("is-unavailable");
      container.classList.remove("is-connecting", "is-revealing");
      container.classList.add("is-unavailable");
    };
    let ratio = interaction3d ? cameraPreviewRatio(entityId) : 16 / 9;
    const applyElementStyle = () => {
      if (interaction3d) {
        container.style.aspectRatio = String(ratio);
        detailsDialog.resizeInteraction3d?.();
        return;
      }
      const count = Math.max(280, this.container.clientWidth - 32);
      const max = Math.max(180, Math.min(625, this.container.clientHeight - 88));
      const size = Math.min(760, count, max * ratio);
      const value = size / ratio;
      detailsDialog.style.width = Math.max(280, size) + "px";
      container.style.aspectRatio = String(ratio);
      container.style.borderRadius = "16px";
    };
    if (value && !preview) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "正在载入摄像头实时预览";
      container.append(placeholder);
      const state = mountCameraMedia({
        container,
        entityId,
        label: element.textContent,
        objectFit: interaction3d ? "contain" : "fill",
        placeholder,
        onReady,
        onUnavailable,
        cleanup: cleanup => list.push(cleanup)
      });
      const runHelper = (width, height) => {
        if (stateNext && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
          ratio = width / height;
          cameraPreviewRatio(entityId, ratio);
          applyElementStyle();
        }
      };
      const callback = () => runHelper(state.video.videoWidth, state.video.videoHeight);
      const stateCurrent = () => runHelper(state.image.naturalWidth, state.image.naturalHeight);
      state.video.addEventListener("loadedmetadata", callback);
      state.video.addEventListener("resize", callback);
      state.image.addEventListener("load", stateCurrent);
      list.push(() => state.video.removeEventListener("loadedmetadata", callback));
      list.push(() => state.video.removeEventListener("resize", callback));
      list.push(() => state.image.removeEventListener("load", stateCurrent));
    } else if (preview) {
      elementCurrent.textContent = "预览模式";
      elementCurrent.classList.remove("is-connecting");
      container.classList.remove("is-connecting");
      container.classList.add("is-ready");
      const element = document.createElement("span");
      element.textContent = "预览模式不获取摄像头实时画面";
      container.append(element);
    } else {
      elementCurrent.textContent = "画面已隐藏";
      elementCurrent.classList.remove("is-connecting");
      container.classList.remove("is-connecting");
      container.classList.add("is-ready");
      const element = document.createElement("span");
      element.textContent = "摄像头画面已隐藏";
      container.append(element);
    }
    window.addEventListener("resize", applyElementStyle);
    list.push(() => window.removeEventListener("resize", applyElementStyle));
    applyElementStyle();
    cameraPreviewCardEl.append(cameraPreviewHeadingEl, ...(interaction3d ? [] : [elementPrevious]), container);
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
        } = cameraPopupLayout(layoutWidth, layoutHeight, ratio, cameraPreviewHeadingEl.offsetHeight || 58);
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
      list.push(() => resizeObserver.disconnect());
      resizeInteraction3d();
    } else {
      this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, detailsDialog, 760, 680);
    }
    elementNext.addEventListener("click", () => detailsDialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, detailsDialog, cameraPreviewCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        detailsDialog.close();
      }
    });
    detailsDialog.addEventListener("close", () => {
      window.clearTimeout(state);
      stateCurrent?.cancel();
      for (const runHelper of list.splice(0)) {
        runHelper();
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
    const options = {
      entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations
    };
    const runHelper = () => entityState?.attributes || {};
    const callback = () => ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase());
    const list = [];
    const present = ["fan", "switch", "input_boolean"].includes(asString);
    const lowered = buildSwitchVisual({
      label: "电源",
      interactive,
      compact: variant === "air-purifier",
      onToggle: async () => {
        if (!interactive || callback()) {
          return;
        }
        const onToggle = String(entityState?.state || "").toLowerCase() === "off";
        const onToggleCurrent = entityState;
        entityState = {
          ...entityState,
          state: onToggle ? "on" : "off"
        };
        runHelperCurrent(entityState);
        try {
          await this.callEntityService(asString === "fan" ? "fan" : "homeassistant", asString === "fan" ? onToggle ? "turn_on" : "turn_off" : "toggle", entityId);
        } catch (error) {
          entityState = onToggleCurrent;
          runHelperCurrent(onToggleCurrent);
          this.options.onError?.(error);
        }
      }
    });
    lowered.visual.classList.add("hb-capability-power");
    if (present) {
      capabilityDetailsControlsEl.append(lowered.visual);
    }
    const createChildElement = (arg, second, third, service, dataKey, value = asString) => {
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
        const elementCurrent = document.createElement("span");
        const electricBedSelectMenuEl = document.createElement("i");
        electricBedSelectMenuEl.setAttribute("aria-hidden", "true");
        trigger.append(elementCurrent, electricBedSelectMenuEl);
        const electricBedSelectMenuElCurrent = document.createElement("div");
        electricBedSelectMenuElCurrent.className = "hb-electric-bed-select-menu";
        electricBedSelectMenuElCurrent.id = "hb-bed-select-" + String(this.renderNamespace || "runtime").replace(/[^a-z0-9_-]/gi, "-") + "-" + entityId.replace(/[^a-z0-9_-]/gi, "-");
        electricBedSelectMenuElCurrent.setAttribute("role", "listbox");
        electricBedSelectMenuElCurrent.setAttribute("popover", "auto");
        electricBedSelectMenuElCurrent.hidden = true;
        trigger.setAttribute("aria-controls", electricBedSelectMenuElCurrent.id);
        let state = false;
        const computeResult = () => {
          try {
            return electricBedSelectMenuElCurrent.matches(":popover-open");
          } catch {
            return electricBedSelectMenuElCurrent.dataset.open === "true";
          }
        };
        const applyElementStyle = () => {
          if (!computeResult() && electricBedSelectMenuElCurrent.hidden) {
            return;
          }
          const domRect = trigger.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 150), Math.max(150, innerWidth - 20));
          electricBedSelectMenuElCurrent.style.width = clamped + "px";
          electricBedSelectMenuElCurrent.style.maxHeight = Math.min(306, Math.max(96, innerHeight - 20)) + "px";
          const size = Math.min(electricBedSelectMenuElCurrent.scrollHeight || 0, 306);
          const value = innerHeight - domRect.bottom - 10;
          const sizeCurrent = domRect.top - 10;
          const max = value < Math.min(size, 160) && sizeCurrent > value ? Math.max(10, domRect.top - size - 5) : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          electricBedSelectMenuElCurrent.style.left = Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) + "px";
          electricBedSelectMenuElCurrent.style.top = Math.max(10, max) + "px";
        };
        const closeMenu = () => {
          if (computeResult() && typeof electricBedSelectMenuElCurrent.hidePopover == "function") {
            electricBedSelectMenuElCurrent.hidePopover();
          }
          electricBedSelectMenuElCurrent.hidden = true;
          electricBedSelectMenuElCurrent.dataset.open = "false";
          trigger.setAttribute("aria-expanded", "false");
        };
        const syncAriaState = (flag = false) => {
          if (!trigger.disabled) {
            electricBedSelectMenuElCurrent.hidden = false;
            if (typeof electricBedSelectMenuElCurrent.showPopover == "function") {
              electricBedSelectMenuElCurrent.showPopover();
            } else {
              electricBedSelectMenuElCurrent.dataset.open = "true";
            }
            trigger.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (flag) {
              (electricBedSelectMenuElCurrent.querySelector("[aria-selected=\"true\"]") || electricBedSelectMenuElCurrent.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async item => {
          if (!interactive || state || !item || callback()) {
            return;
          }
          const stateCurrent = entityState;
          state = true;
          closeMenu();
          entityState = {
            ...entityState,
            state: service === "select_option" ? item : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: item
            }
          };
          runHelperCurrent(entityState);
          try {
            await this.callEntityService(value, service, entityId, {
              [dataKey]: item
            });
          } catch (error) {
            entityState = stateCurrent;
            runHelperCurrent(stateCurrent);
            this.options.onError?.(error);
          } finally {
            state = false;
            runHelperCurrent(entityState);
          }
        };
        const renderOptions = (electricBedSelectOptionEl, electricBedSelectOptionElCurrent) => {
          electricBedSelectMenuElCurrent.replaceChildren(...electricBedSelectOptionEl.map(electricBedSelectOptionEl => {
            const element = document.createElement("button");
            element.type = "button";
            element.className = "hb-electric-bed-select-option";
            element.setAttribute("role", "option");
            element.dataset.value = electricBedSelectOptionEl;
            element.textContent = electricBedSelectOptionEl;
            const state = electricBedSelectOptionEl === String(electricBedSelectOptionElCurrent ?? "");
            element.classList.toggle("active", state);
            element.setAttribute("aria-selected", String(state));
            element.addEventListener("click", () => invokeEntityService(electricBedSelectOptionEl));
            return element;
          }));
          const state = electricBedSelectOptionEl.includes(String(electricBedSelectOptionElCurrent ?? "")) ? String(electricBedSelectOptionElCurrent) : electricBedSelectOptionEl[0] || "读取中…";
          elementCurrent.textContent = state;
          elementCurrent.title = state;
        };
        trigger.addEventListener("click", () => {
          if (computeResult() || electricBedSelectMenuElCurrent.dataset.open === "true") {
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
        electricBedSelectMenuElCurrent.addEventListener("keydown", event => {
          const matchedEl = [...electricBedSelectMenuElCurrent.querySelectorAll("[role=\"option\"]")];
          const state = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
            trigger.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const count = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state + count + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        electricBedSelectMenuElCurrent.addEventListener("toggle", toggleEvent => {
          const state = toggleEvent.newState === "open";
          electricBedSelectMenuElCurrent.hidden = !state;
          electricBedSelectMenuElCurrent.dataset.open = String(state);
          trigger.setAttribute("aria-expanded", String(state));
          if (state) {
            applyElementStyle();
          }
        });
        electricBedSelectEl.append(trigger, electricBedSelectMenuElCurrent);
        capabilityOptionGroupEl.append(element, electricBedSelectEl);
        capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
        list.push({
          type: "bed-select",
          service,
          dataKey,
          trigger,
          electricBedSelectMenuElCurrent,
          renderOptions,
          closeMenu,
          isPending: () => state
        });
        return;
      }
      const buttons = [];
      for (const item of set) {
        const element = document.createElement("button");
        element.type = "button";
        const stateCurrent = {
          auto: "自动",
          sleep: "睡眠",
          favorite: "喜爱",
          none: "标准",
          manual: "手动",
          silent: "静音"
        };
        element.textContent = variant === "air-purifier" && arg === "运行模式" ? stateCurrent[item.toLowerCase()] || item : asString === "fan" && state === "bath-heater" && arg === "运行模式" ? climateModeLabel(item, "bath-heater", options) : item;
        element.dataset.value = item;
        element.classList.toggle("active", item === String(third ?? ""));
        element.addEventListener("click", async () => {
          if (!interactive) {
            return;
          }
          buttons.forEach(buttonEl => {
            buttonEl.disabled = true;
          });
          const state = entityState;
          entityState = {
            ...entityState,
            state: service === "select_option" ? item : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: item
            }
          };
          runHelperCurrent(entityState);
          try {
            await this.callEntityService(value, service, entityId, {
              [dataKey]: item
            });
          } catch (error) {
            entityState = state;
            runHelperCurrent(state);
            this.options.onError?.(error);
          } finally {
            buttons.forEach(buttonEl => {
              buttonEl.disabled = false;
            });
          }
        });
        buttons.push(element);
        capabilityOptionsEl.append(element);
      }
      capabilityOptionGroupEl.append(element, capabilityOptionsEl);
      capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
      list.push({
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
        }].map(element => {
          const elementCurrent = document.createElement("button");
          elementCurrent.type = "button";
          elementCurrent.textContent = element.label;
          elementCurrent.dataset.percentage = String(element.value);
          elementCurrent.addEventListener("click", async () => {
            if (!interactive || callback()) {
              return;
            }
            buttons.forEach(arg => {
              arg.disabled = true;
            });
            const state = entityState;
            entityState = {
              ...entityState,
              attributes: {
                ...runHelper(),
                percentage: element.value
              }
            };
            runHelperCurrent(entityState);
            try {
              await this.callEntityService("fan", "set_percentage", entityId, {
                percentage: element.value
              });
            } catch (error) {
              entityState = state;
              runHelperCurrent(state);
              this.options.onError?.(error);
            } finally {
              buttons.forEach(arg => {
                arg.disabled = false;
              });
            }
          });
          capabilityOptionsEl.append(elementCurrent);
          return elementCurrent;
        });
        capabilityOptionGroupEl.append(element, capabilityOptionsEl);
        capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
        list.push({
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
          if (!interactive || callback()) {
            return;
          }
          controlInputEl.disabled = true;
          const state = entityState;
          const percentage = Number(controlInputEl.value);
          entityState = {
            ...entityState,
            attributes: {
              ...runHelper(),
              percentage
            }
          };
          runHelperCurrent(entityState);
          try {
            await this.callEntityService("fan", "set_percentage", entityId, {
              percentage
            });
          } catch (error) {
            entityState = state;
            runHelperCurrent(state);
            this.options.onError?.(error);
          } finally {
            controlInputEl.disabled = false;
          }
        });
        capabilityRangeGroupEl.append(capabilityRangeHeadingEl, controlInputEl);
        capabilityDetailsControlsEl.append(capabilityRangeGroupEl);
        list.push({
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
      const number = Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0 ? Number(runHelper().step) : 1;
      const capabilityRangeGroupElCurrent = document.createElement("section");
      capabilityRangeGroupElCurrent.className = "hb-capability-range-group";
      const capabilityRangeHeadingEl = document.createElement("div");
      capabilityRangeHeadingEl.className = "hb-capability-range-heading";
      const element = document.createElement("strong");
      element.textContent = runHelper().unit_of_measurement ? "数值（" + runHelper().unit_of_measurement + "）" : "数值";
      const controlOutputEl = document.createElement("output");
      capabilityRangeHeadingEl.append(element, controlOutputEl);
      const controlInputEl = document.createElement("input");
      controlInputEl.type = "range";
      controlInputEl.min = String(finiteNumber);
      controlInputEl.max = String(capabilityRangeGroupEl);
      controlInputEl.step = String(number);
      controlInputEl.value = String(Number(entityState?.state) || finiteNumber);
      controlInputEl.addEventListener("change", async () => {
        if (!interactive || callback()) {
          return;
        }
        controlInputEl.disabled = true;
        const state = entityState;
        const asNumber = Number(controlInputEl.value);
        entityState = {
          ...entityState,
          state: String(asNumber)
        };
        runHelperCurrent(entityState);
        try {
          await this.callEntityService(asString, "set_value", entityId, {
            value: asNumber
          });
        } catch (error) {
          entityState = state;
          runHelperCurrent(state);
          this.options.onError?.(error);
        } finally {
          controlInputEl.disabled = false;
        }
      });
      capabilityRangeGroupElCurrent.append(capabilityRangeHeadingEl, controlInputEl);
      capabilityDetailsControlsEl.append(capabilityRangeGroupElCurrent);
      list.push({
        type: "range",
        controlInputEl,
        controlOutputEl,
        dataKey: "state"
      });
    }
    function runHelperCurrent(arg) {
      entityState = arg || entityState;
      const asStringCurrent = String(entityState?.state || "").toLowerCase();
      const state = asString === "fan" ? !["off", "unknown", "unavailable"].includes(asStringCurrent) : asStringCurrent === "on";
      const value = variant !== "air-purifier" || state;
      if (present) {
        lowered.sync(state, {
          unavailable: callback()
        });
      }
      for (const item of list) {
        if (item.type === "options") {
          const state = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          item.buttons.forEach(element => element.classList.toggle("active", value && element.dataset.value === String(state ?? "")));
        } else if (item.type === "bed-select") {
          const set = [...new Set((runHelper().options || []).map(item => String(item ?? "").trim()).filter(Boolean))];
          const state = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          item.renderOptions(set, state);
          item.trigger.disabled = !interactive || item.isPending() || !set.length || callback();
          if (item.trigger.disabled) {
            item.closeMenu();
          }
        } else if (item.type === "select") {
          const set = [...new Set((runHelper().options || []).map(item => String(item ?? "").trim()).filter(Boolean))];
          if (set.length) {
            const mapped = [...item.input.options].map(element => element.value);
            if (mapped.length !== set.length || mapped.some((item, second) => item !== set[second])) {
              item.input.replaceChildren(...set.map(item => {
                const element = document.createElement("option");
                element.value = item;
                element.textContent = item;
                return element;
              }));
            }
          }
          const state = item.service === "select_option" ? entityState?.state : runHelper()[item.dataKey];
          if (state != null && [...item.input.options].some(element => element.value === String(state))) {
            item.input.value = String(state);
          }
          item.input.disabled = !interactive || !set.length || callback();
        } else if (item.type === "percentage-options") {
          const numeric = Number(runHelper().percentage);
          const finiteNumber = numeric <= 0 || !Number.isFinite(numeric) ? 0 : numeric <= 49 ? 33 : numeric <= 82 ? 66 : 100;
          item.buttons.forEach(element => element.classList.toggle("active", value && Number(element.dataset.percentage) === finiteNumber));
        } else {
          if (["number", "input_number"].includes(asString)) {
            const finiteNumber = Number.isFinite(Number(runHelper().min)) ? Number(runHelper().min) : 0;
            const number = Number.isFinite(Number(runHelper().max)) ? Number(runHelper().max) : 100;
            const finiteNumberCurrent = Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0 ? Number(runHelper().step) : 1;
            item.input.min = String(finiteNumber);
            item.input.max = String(number);
            item.input.step = String(finiteNumberCurrent);
          }
          const state = item.dataKey === "state" ? Number(entityState?.state) : Number(runHelper()[item.dataKey]);
          if (Number.isFinite(state)) {
            item.input.value = String(state);
          }
          item.output.textContent = Number.isFinite(state) ? "" + state + (runHelper().unit_of_measurement || "%") : "--";
        }
      }
    }
    capabilityDetailsControlsEl.syncCapabilityState = runHelperCurrent;
    capabilityDetailsControlsEl.cleanupCapabilityDetails = () => {
      for (const item of list) {
        item.closeMenu?.();
      }
    };
    runHelperCurrent(entityState);
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
    const value = entityDetailsDialogEl?.deviceType === "air-purifier";
    const entityDetailsDialogElCurrent = document.createElement("dialog");
    entityDetailsDialogElCurrent.className = "hb-entity-details-dialog capability-details" + (value ? " air-purifier-details" : "");
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = title || component.properties?.label || entityState.attributes?.friendly_name || entityId;
    const elementCurrent = document.createElement("span");
    elementCurrent.textContent = entityState.state === "unavailable" ? "当前不可用" : "设备控制";
    divEl.append(element, elementCurrent);
    const elementNext = document.createElement("button");
    elementNext.type = "button";
    elementNext.textContent = "×";
    elementNext.setAttribute("aria-label", "关闭弹窗");
    entityDetailsHeadingEl.append(divEl, elementNext);
    const capabilityDetailsBodyEl = document.createElement("div");
    capabilityDetailsBodyEl.className = "hb-capability-details-body";
    const state = this.createCapabilityDetailsControls(entityId, entityState, {
      interactive: !preview,
      variant: value ? "air-purifier" : ""
    });
    capabilityDetailsBodyEl.append(state);
    entityDetailsCardEl.append(entityDetailsHeadingEl, capabilityDetailsBodyEl);
    entityDetailsDialogElCurrent.append(entityDetailsCardEl);
    const temperature = {
      pm25: "PM2.5",
      airQuality: "空气质量",
      temperature: "温度",
      humidity: "湿度",
      filterLife: "滤芯寿命"
    };
    const filtered = value ? ["pm25", "airQuality", "temperature", "humidity", "filterLife"].map(role => ({
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
        const element = document.createElement("small");
        element.textContent = temperature[role] || item.name || item.originalName || item.entityId;
        const rendererRuntimeDialogLayerEl = document.createElement("strong");
        capabilityMetricEl.append(element, rendererRuntimeDialogLayerEl);
        capabilityMetricsEl.append(capabilityMetricEl);
        index.set(item.entityId, rendererRuntimeDialogLayerEl);
      }
      capabilityDetailsBodyEl.prepend(capabilityMetricsEl);
    }
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogElCurrent);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogElCurrent;
    const lowered = entityState => {
      state.syncCapabilityState?.(entityState);
      elementCurrent.textContent = ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase()) ? "当前不可用" : "设备控制";
    };
    const handlers = new Map([[entityId, [lowered]]]);
    for (const {
      item
    } of filtered) {
      const runHelper = entityState => {
        const element = index.get(item.entityId);
        if (element) {
          element.textContent = entityState?.state === "unknown" || entityState?.state === "unavailable" ? "--" : ((entityState?.state ?? "--") + " " + (entityState?.attributes?.unit_of_measurement || "")).trim();
        }
      };
      runHelper(this.states.get(item.entityId)?.newState || this.states.get(item.entityId));
      handlers.set(item.entityId, [runHelper]);
    }
    this.detailsStateSync = {
      entityDetailsDialogElCurrent,
      handlers
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, value ? 620 : 560, value ? 560 : 500);
    elementNext.addEventListener("click", () => entityDetailsDialogElCurrent.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogElCurrent.close();
      }
    });
    entityDetailsDialogElCurrent.addEventListener("close", () => {
      state.cleanupCapabilityDetails?.();
      this.clearRuntimeDialogScale(entityDetailsDialogElCurrent);
      if (this.detailsDialog === entityDetailsDialogElCurrent) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogElCurrent) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogElCurrent.show();
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
    const ids = selectedRelatedEntityIds(component);
    let entityDetailsDialogEl = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogElCurrent = document.createElement("dialog");
    entityDetailsDialogElCurrent.className = "hb-entity-details-dialog air-purifier-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = title || componentDialogTitle(component, entityDetailsDialogEl.attributes?.friendly_name || "空气净化器");
    const elementCurrent = document.createElement("span");
    divEl.append(element, elementCurrent);
    const elementNext = document.createElement("button");
    elementNext.type = "button";
    elementNext.className = "hb-air-purifier-visual";
    elementNext.inert = preview;
    elementNext.setAttribute("aria-label", "切换空气净化器电源");
    const airPurifierVisualAuraEl = document.createElement("i");
    airPurifierVisualAuraEl.className = "hb-air-purifier-visual-aura";
    const airPurifierVisualAirflowEl = document.createElement("span");
    airPurifierVisualAirflowEl.className = "hb-air-purifier-visual-airflow";
    for (let airPurifierVisualBodyEl = 0; airPurifierVisualBodyEl < 4; airPurifierVisualBodyEl += 1) {
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
    const elementPrevious = document.createElement("strong");
    airPurifierVisualDisplayEl.append(elementPrevious);
    airPurifierVisualBodyEl.append(airPurifierVisualTopEl, airPurifierVisualVentEl, airPurifierVisualDisplayEl);
    elementNext.append(airPurifierVisualAuraEl, airPurifierVisualAirflowEl, airPurifierVisualBodyEl);
    const elementLocal = document.createElement("button");
    elementLocal.type = "button";
    elementLocal.textContent = "×";
    elementLocal.setAttribute("aria-label", "关闭弹窗");
    entityDetailsHeadingEl.append(divEl, elementNext, elementLocal);
    const airPurifierLayoutEl = document.createElement("div");
    airPurifierLayoutEl.className = "hb-air-purifier-layout";
    const airPurifierSummaryEl = document.createElement("section");
    airPurifierSummaryEl.className = "hb-air-purifier-summary";
    const airPurifierGaugeWrapEl = document.createElement("div");
    airPurifierGaugeWrapEl.className = "hb-air-purifier-gauge-wrap";
    const elementItem = document.createElement("div");
    elementItem.className = "hb-air-purifier-gauge is-quality";
    const elementEntry = document.createElement("i");
    elementEntry.className = "hb-air-purifier-gauge-orbit";
    const airPurifierArcCapEl = document.createElement("i");
    airPurifierArcCapEl.className = "hb-air-purifier-arc-cap start";
    const airPurifierArcCapElCurrent = document.createElement("i");
    airPurifierArcCapElCurrent.className = "hb-air-purifier-arc-cap end";
    const airPurifierGaugeContentEl = document.createElement("div");
    airPurifierGaugeContentEl.className = "hb-air-purifier-gauge-content";
    const elementList = document.createElement("small");
    elementList.textContent = "室内空气质量";
    const strongEl = document.createElement("strong");
    const elementText = document.createElement("span");
    const elementValue = document.createElement("small");
    elementValue.textContent = "";
    const elementSource = document.createElement("span");
    elementSource.textContent = "设备状态 --";
    strongEl.append(elementText, elementValue);
    airPurifierGaugeContentEl.append(elementList, strongEl, elementSource);
    elementItem.append(airPurifierArcCapEl, airPurifierArcCapElCurrent, airPurifierGaugeContentEl);
    airPurifierGaugeWrapEl.append(elementEntry, elementItem);
    const airPurifierSecondaryMetricsEl = document.createElement("div");
    airPurifierSecondaryMetricsEl.className = "hb-air-purifier-secondary-metrics";
    airPurifierSummaryEl.append(airPurifierGaugeWrapEl, airPurifierSecondaryMetricsEl);
    const airPurifierControlsPaneEl = this.createCapabilityDetailsControls(entityId, entityDetailsDialogEl, {
      interactive: !preview,
      variant: "air-purifier"
    });
    const airPurifierControlsPaneElCurrent = document.createElement("section");
    airPurifierControlsPaneElCurrent.className = "hb-air-purifier-controls-pane";
    airPurifierControlsPaneElCurrent.append(airPurifierControlsPaneEl);
    airPurifierLayoutEl.append(airPurifierSummaryEl, airPurifierControlsPaneElCurrent);
    entityDetailsCardEl.append(entityDetailsHeadingEl, airPurifierLayoutEl);
    entityDetailsDialogElCurrent.append(entityDetailsCardEl);
    const list = [{
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
      }, candidate, item) => id && item.findIndex(candidate => candidate.id === id) === candidate).map(candidates => ({
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
    const callback = entityId => this.states.get(entityId?.id)?.newState || this.states.get(entityId?.id) || null;
    const runHelperCurrent = airPurifierSecondaryMetricEl => airPurifierSecondaryMetricEl.candidates.find(airPurifierSecondaryMetricEl => runHelper(callback(airPurifierSecondaryMetricEl)) != null) || airPurifierSecondaryMetricEl.candidates[0] || null;
    const airPurifierSecondaryMetricEl = Array.from({
      length: 3
    }, () => {
      const item = document.createElement("div");
      item.className = "hb-air-purifier-secondary-metric";
      const airPurifierDetailsSmallEl = document.createElement("small");
      const strongEl = document.createElement("strong");
      item.append(airPurifierDetailsSmallEl, strongEl);
      airPurifierSecondaryMetricsEl.append(item);
      return {
        item,
        airPurifierDetailsSmallEl,
        value: strongEl
      };
    });
    airPurifierSecondaryMetricsEl.hidden = true;
    const options = {
      pm25: "μg/m³",
      pm10: "μg/m³",
      hcho: "mg/m³",
      filterLife: "%",
      filterLeftTime: "h",
      temperature: "°C",
      humidity: "%"
    };
    const runHelperNext = (entityState, second) => {
      if (["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase())) {
        return "--";
      }
      const state = {
        hours: "小时",
        hour: "小时",
        days: "天",
        day: "天"
      };
      const text = entityState?.attributes?.unit_of_measurement || options[second] || "";
      const lowered = state[String(text).toLowerCase()] || text;
      return "" + (entityState?.state ?? "--") + (lowered ? " " + lowered : "");
    };
    const handlers = new Map();
    const runHelperPrevious = (arg, handler) => {
      if (arg) {
        if (!handlers.has(arg)) {
          handlers.set(arg, []);
        }
        handlers.get(arg).push(handler);
      }
    };
    const mapped = list.flatMap(arg => arg.candidates.map(candidate => candidate.id));
    const text = state?.roles?.airQuality || "";
    const controls = ids !== null ? this.createWaterHeaterExtensionControls(entityId, {
      component,
      interactive: !preview,
      excludedEntityIds: [...mapped, ...(text ? [text] : [])]
    }) : null;
    if (controls) {
      entityDetailsCardEl.append(controls);
      entityDetailsDialogElCurrent.classList.add("has-related-extensions");
      for (const [item, value] of controls.stateHandlers || []) {
        handlers.set(item, value);
      }
    }
    const stateCurrent = {
      excellent: "空气优",
      good: "空气良",
      moderate: "一般",
      fair: "一般",
      poor: "较差",
      unhealthy: "较差",
      very_poor: "很差"
    };
    let entry = text ? this.states.get(text)?.newState || this.states.get(text) : null;
    let flag = false;
    const found = list.find(arg => arg.key === "pm25");
    const runHelperLocal = () => {
      const state = found ? runHelperCurrent(found) : null;
      const helper = runHelper(callback(state));
      if (helper == null) {
        return {
          text: "--",
          level: "unknown"
        };
      } else if (helper <= 35) {
        return {
          text: "空气优",
          level: "excellent"
        };
      } else if (helper <= 75) {
        return {
          text: "空气良",
          level: "good"
        };
      } else if (helper <= 115) {
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
      const asString = String(entry?.state || "").trim();
      const lowered = asString.toLowerCase();
      let localValue = ["unknown", "unavailable", ""].includes(lowered) ? "" : stateCurrent[lowered] || asString;
      let text = "good";
      if (localValue) {
        if (/very.?poor|severe|很差|重度|严重/.test(lowered) || /poor|unhealthy|较差|中度/.test(lowered)) {
          text = "poor";
        } else if (/moderate|fair|一般|轻度|污染/.test(lowered)) {
          text = "warning";
        } else if (/excellent|优/.test(lowered)) {
          text = "excellent";
        }
      } else {
        ({
          text: localValue,
          level: text
        } = runHelperLocal());
      }
      elementText.textContent = localValue || "--";
      elementValue.textContent = "";
      elementItem.style.setProperty("--hb-air-purifier-progress", {
        excellent: 72,
        good: 58,
        warning: 42,
        poor: 26,
        unknown: 0
      }[text] + "%");
      elementItem.classList.toggle("is-warning", text === "warning");
      elementItem.classList.toggle("is-poor", text === "poor");
      const state = {
        excellent: "#76cfa1",
        good: "#76cfa1",
        warning: "#e4b15f",
        poor: "#db7770",
        unknown: "#7d8990"
      }[text] || "#76cfa1";
      const color = {
        excellent: "rgba(118,207,161,.13)",
        good: "rgba(118,207,161,.13)",
        warning: "rgba(228,177,95,.15)",
        poor: "rgba(219,119,112,.15)",
        unknown: "rgba(125,137,144,.13)"
      }[text] || "rgba(118,207,161,.13)";
      entityDetailsDialogElCurrent.style.setProperty("--hb-air-purifier-accent", state);
      entityDetailsDialogElCurrent.style.setProperty("--hb-air-purifier-accent-soft", color);
    };
    const runHelperItem = entityId => {
      entry = entityId;
      applyElementStyle();
    };
    const syncVisualState = arg => {
      entityDetailsDialogEl = arg || entityDetailsDialogEl;
      const asString = String(entityDetailsDialogEl?.state || "").toLowerCase();
      const state = ["unknown", "unavailable"].includes(asString);
      const stateCurrent = !state && asString !== "off";
      flag = stateCurrent;
      elementPrevious.textContent = stateCurrent ? "ON" : "OFF";
      elementCurrent.textContent = state ? "当前不可用" : stateCurrent ? "已开启" : "已关闭";
      elementSource.textContent = state ? "设备不可用" : stateCurrent ? "净化中" : "已关闭";
      elementCurrent.classList.toggle("is-on", stateCurrent);
      elementNext.classList.toggle("is-on", stateCurrent);
      elementNext.classList.toggle("is-unavailable", state);
      elementItem.classList.toggle("is-running", stateCurrent);
      elementEntry.classList.toggle("is-running", stateCurrent);
      elementNext.setAttribute("aria-pressed", String(stateCurrent));
      airPurifierControlsPaneEl.syncCapabilityState?.(entityDetailsDialogEl);
    };
    const runHelperEntry = () => {
      const filtered = list.map(metric => ({
        metric,
        selected: runHelperCurrent(metric)
      })).filter(({
        selected
      }) => runHelper(callback(selected)) != null).slice(0, airPurifierSecondaryMetricEl.length);
      airPurifierSecondaryMetricEl.forEach((element, index) => {
        const state = filtered[index];
        element.item.hidden = !state;
        element.item.className = "hb-air-purifier-secondary-metric" + (state ? " hb-air-purifier-secondary-metric--" + state.metric.key : "");
        if (!state) {
          element.label.textContent = "";
          element.value.textContent = "";
          return;
        }
        const key = state.selected?.role || state.metric.key;
        element.label.textContent = state.metric.key === "filter" && key === "filterLeftTime" ? "滤芯剩余时间" : state.metric.label;
        element.value.textContent = runHelperNext(callback(state.selected), key);
      });
      airPurifierSecondaryMetricsEl.hidden = filtered.length === 0;
    };
    syncVisualState(entityDetailsDialogEl);
    runHelperPrevious(entityId, syncVisualState);
    for (const item of list) {
      const runHelper = () => {
        runHelperEntry();
        if (item.key === "pm25") {
          applyElementStyle();
        }
      };
      runHelper();
      for (const rendererRuntimeDialogLayerEl of item.candidates) {
        runHelperPrevious(rendererRuntimeDialogLayerEl.id, runHelper);
      }
    }
    runHelperItem(entry);
    runHelperPrevious(text, runHelperItem);
    elementNext.addEventListener("click", () => airPurifierControlsPaneEl.querySelector(".hb-capability-power")?.click());
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogElCurrent);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogElCurrent;
    this.detailsStateSync = {
      entityDetailsDialogElCurrent,
      handlers
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, 920, controls ? 620 : 540);
    elementLocal.addEventListener("click", () => entityDetailsDialogElCurrent.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogElCurrent.close();
      }
    });
    entityDetailsDialogElCurrent.addEventListener("close", () => {
      airPurifierControlsPaneEl.cleanupCapabilityDetails?.();
      this.clearRuntimeDialogScale(entityDetailsDialogElCurrent);
      if (this.detailsDialog === entityDetailsDialogElCurrent) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogElCurrent) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogElCurrent.show();
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
    const entityDetailsDialogElCurrent = document.createElement("dialog");
    entityDetailsDialogElCurrent.className = "hb-entity-details-dialog media-player-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, entityDetailsDialogEl.attributes?.friendly_name || "媒体");
    const elementCurrent = document.createElement("span");
    divEl.append(element, elementCurrent);
    const elementNext = document.createElement("div");
    elementNext.className = "hb-media-speaker-visual";
    elementNext.setAttribute("aria-hidden", "true");
    const mediaSpeakerBodyEl = document.createElement("i");
    mediaSpeakerBodyEl.className = "hb-media-speaker-body";
    const mediaSpeakerArtworkEl = document.createElement("img");
    mediaSpeakerArtworkEl.className = "hb-media-speaker-artwork";
    mediaSpeakerArtworkEl.alt = "";
    mediaSpeakerArtworkEl.hidden = true;
    const mediaSpeakerLightEl = document.createElement("i");
    mediaSpeakerLightEl.className = "hb-media-speaker-light";
    elementNext.append(mediaSpeakerBodyEl, mediaSpeakerArtworkEl, mediaSpeakerLightEl);
    entityDetailsHeadingEl.append(divEl, elementNext);
    const mediaPlayerDetailsBodyEl = document.createElement("div");
    mediaPlayerDetailsBodyEl.className = "hb-media-player-details-body";
    const elementPrevious = document.createElement("section");
    elementPrevious.className = "hb-media-player-now-playing";
    const mediaPlayerArtworkEl = document.createElement("img");
    mediaPlayerArtworkEl.className = "hb-media-player-artwork";
    mediaPlayerArtworkEl.alt = "";
    mediaPlayerArtworkEl.hidden = true;
    const mediaPlayerCopyEl = document.createElement("div");
    mediaPlayerCopyEl.className = "hb-media-player-copy";
    const elementLocal = document.createElement("strong");
    const elementItem = document.createElement("span");
    const mediaPlayerProgressEl = document.createElement("div");
    mediaPlayerProgressEl.className = "hb-media-player-progress";
    mediaPlayerProgressEl.hidden = true;
    const elementEntry = document.createElement("progress");
    elementEntry.max = 1;
    elementEntry.value = 0;
    const spanEl = document.createElement("span");
    const elementList = document.createElement("time");
    const elementText = document.createElement("time");
    spanEl.append(elementList, elementText);
    mediaPlayerProgressEl.append(elementEntry, spanEl);
    mediaPlayerCopyEl.append(elementLocal, elementItem, mediaPlayerProgressEl);
    elementPrevious.append(mediaPlayerArtworkEl, mediaPlayerCopyEl);
    const mediaPlayerActionsEl = document.createElement("div");
    mediaPlayerActionsEl.className = "hb-media-player-actions";
    const buildElementTree = (arg, serviceName, options = {}) => {
      const element = document.createElement("button");
      element.type = "button";
      element.textContent = arg;
      element.addEventListener("click", async () => {
        if (!preview) {
          element.disabled = true;
          try {
            await this.callEntityService("media_player", serviceName, entityId, options);
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element.disabled = false;
          }
        }
      });
      mediaPlayerActionsEl.append(element);
      return element;
    };
    const capabilityRangeGroupEl = buildElementTree("上一曲", "media_previous_track");
    const tree = buildElementTree("播放", "media_play_pause");
    const capabilityRangeGroupElCurrent = buildElementTree("下一曲", "media_next_track");
    const control = this.createMediaBrowserControl(entityId, {
      preview
    });
    const capabilityRangeGroupElNext = document.createElement("section");
    capabilityRangeGroupElNext.className = "hb-capability-range-group";
    const capabilityRangeHeadingEl = document.createElement("div");
    capabilityRangeHeadingEl.className = "hb-capability-range-heading";
    const elementValue = document.createElement("strong");
    elementValue.textContent = "音量";
    const elementSource = document.createElement("output");
    capabilityRangeHeadingEl.append(elementValue, elementSource);
    const elementTarget = document.createElement("input");
    elementTarget.type = "range";
    elementTarget.min = "0";
    elementTarget.max = "1";
    elementTarget.step = ".01";
    elementTarget.disabled = preview;
    capabilityRangeGroupElNext.append(capabilityRangeHeadingEl, elementTarget);
    elementPrevious.append(control.root);
    mediaPlayerDetailsBodyEl.append(elementPrevious, mediaPlayerActionsEl, capabilityRangeGroupElNext);
    let showMediaPlayerDetailsValue = "";
    let showMediaPlayerDetailsValueCurrent = null;
    let showMediaPlayerDetailsValueNext = null;
    let showMediaPlayerDetailsValuePrevious = null;
    let showMediaPlayerDetailsValueLocal = null;
    let flag = false;
    let showMediaPlayerDetailsValueItem = null;
    let state = null;
    let stateCurrent = null;
    let count = 0;
    let stateNext = null;
    let statePrevious = false;
    const runHelper = arg => {
      const count = Math.max(0, Math.floor(Number(arg) || 0));
      const state = Math.floor(count / 60);
      const asString = String(count % 60).padStart(2, "0");
      return state + ":" + asString;
    };
    const clampNumber = () => {
      if (!Number.isFinite(stateCurrent) || stateCurrent <= 0) {
        mediaPlayerProgressEl.hidden = true;
        return;
      }
      let finiteNumber = Number.isFinite(count) ? count : 0;
      if (statePrevious && Number.isFinite(stateNext)) {
        finiteNumber += Math.max(0, (Date.now() - stateNext) / 1000);
      }
      finiteNumber = Math.max(0, Math.min(stateCurrent, finiteNumber));
      mediaPlayerProgressEl.hidden = false;
      elementEntry.max = stateCurrent;
      elementEntry.value = finiteNumber;
      elementList.textContent = runHelper(finiteNumber);
      elementText.textContent = runHelper(stateCurrent);
    };
    const interval = window.setInterval(clampNumber, 1000);
    const callback = (arg, right) => Number.isFinite(arg) && Number.isFinite(right) && Math.abs(arg - right) <= 0.005;
    const clampNumberCurrent = arg => {
      showMediaPlayerDetailsValueCurrent = Math.max(0, Math.min(1, Number(arg) || 0));
      elementTarget.value = String(showMediaPlayerDetailsValueCurrent);
      elementSource.textContent = Math.round(showMediaPlayerDetailsValueCurrent * 100) + "%";
    };
    const stateLocal = async () => {
      window.clearTimeout(showMediaPlayerDetailsValueItem);
      showMediaPlayerDetailsValueItem = null;
      if (flag || showMediaPlayerDetailsValueLocal === null) {
        return;
      }
      const volume_level = showMediaPlayerDetailsValueLocal;
      showMediaPlayerDetailsValueLocal = null;
      flag = true;
      try {
        await this.callEntityService("media_player", "volume_set", entityId, {
          volume_level
        });
      } catch (error) {
        showMediaPlayerDetailsValueLocal = null;
        showMediaPlayerDetailsValuePrevious = null;
        window.clearTimeout(state);
        if (showMediaPlayerDetailsValueNext !== null) {
          clampNumberCurrent(showMediaPlayerDetailsValueNext);
        }
        this.options.onError?.(error);
      } finally {
        flag = false;
        if (showMediaPlayerDetailsValueLocal !== null && !callback(showMediaPlayerDetailsValueLocal, volume_level)) {
          showMediaPlayerDetailsValueItem = window.setTimeout(stateLocal, 140);
        }
      }
    };
    const clamped = () => {
      const count = Math.max(0, Math.min(1, Number(elementTarget.value) || 0));
      showMediaPlayerDetailsValuePrevious = count;
      showMediaPlayerDetailsValueLocal = count;
      window.clearTimeout(state);
      if (!flag) {
        window.clearTimeout(showMediaPlayerDetailsValueItem);
        showMediaPlayerDetailsValueItem = window.setTimeout(stateLocal, 120);
      }
    };
    mediaPlayerArtworkEl.addEventListener("error", () => {
      mediaPlayerArtworkEl.hidden = true;
      elementPrevious.classList.remove("has-artwork");
    });
    mediaPlayerArtworkEl.addEventListener("load", () => {
      mediaPlayerArtworkEl.hidden = false;
      elementPrevious.classList.add("has-artwork");
    });
    mediaSpeakerArtworkEl.addEventListener("error", () => {
      mediaSpeakerArtworkEl.hidden = true;
      elementNext.classList.remove("has-artwork");
    });
    mediaSpeakerArtworkEl.addEventListener("load", () => {
      mediaSpeakerArtworkEl.hidden = false;
      elementNext.classList.add("has-artwork");
    });
    elementTarget.addEventListener("input", () => clampNumberCurrent(elementTarget.value));
    elementTarget.addEventListener("change", clamped);
    const syncVisualState = arg => {
      entityDetailsDialogEl = arg || entityDetailsDialogEl;
      const attributes = entityDetailsDialogEl.attributes || {};
      const options = {
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
      const numeric = Number(attributes.supported_features || 0);
      control.sync(entityDetailsDialogEl);
      elementCurrent.textContent = options[asString] || entityDetailsDialogEl.state || "未知状态";
      elementNext.classList.toggle("is-playing", asString === "playing");
      elementNext.classList.toggle("is-paused", asString === "paused");
      elementNext.classList.toggle("is-off", ["off", "unavailable", "unknown"].includes(asString));
      elementLocal.textContent = attributes.media_title || attributes.media_series_title || attributes.app_name || attributes.source || "暂无播放内容";
      elementItem.textContent = [attributes.media_artist, attributes.media_album_name].filter(Boolean).join(" · ") || attributes.media_content_type || "媒体播放器";
      tree.textContent = asString === "playing" ? "暂停" : "播放";
      tree.disabled = preview || ["off", "unavailable", "unknown"].includes(asString);
      capabilityRangeGroupEl.disabled = preview || !(numeric & 16);
      capabilityRangeGroupElCurrent.disabled = preview || !(numeric & 32);
      stateCurrent = Number.isFinite(Number(attributes.media_duration)) ? Number(attributes.media_duration) : null;
      count = Number.isFinite(Number(attributes.media_position)) ? Number(attributes.media_position) : 0;
      const position = Date.parse(String(attributes.media_position_updated_at || ""));
      stateNext = Number.isFinite(position) ? position : null;
      statePrevious = asString === "playing";
      clampNumber();
      const number = Number(attributes.volume_level);
      capabilityRangeGroupElNext.hidden = !Number.isFinite(number);
      if (Number.isFinite(number)) {
        if (showMediaPlayerDetailsValuePrevious === null) {
          showMediaPlayerDetailsValueNext = number;
          clampNumberCurrent(number);
        } else if (callback(number, showMediaPlayerDetailsValuePrevious)) {
          showMediaPlayerDetailsValueNext = number;
          clampNumberCurrent(showMediaPlayerDetailsValuePrevious);
          window.clearTimeout(state);
          state = window.setTimeout(() => {
            showMediaPlayerDetailsValuePrevious = null;
          }, 1800);
        } else {
          window.clearTimeout(state);
        }
      }
      const trimmed = [attributes.entity_picture_local, attributes.entity_picture, attributes.media_image_url].map(item => String(item || "").trim()).find(urlCandidate => urlCandidate.startsWith("/api/media_player_proxy/") || urlCandidate.startsWith("/api/image_proxy/")) || "";
      if (trimmed !== showMediaPlayerDetailsValue) {
        showMediaPlayerDetailsValue = trimmed;
        mediaPlayerArtworkEl.hidden = !showMediaPlayerDetailsValue;
        elementPrevious.classList.toggle("has-artwork", !!showMediaPlayerDetailsValue);
        mediaSpeakerArtworkEl.hidden = !showMediaPlayerDetailsValue;
        elementNext.classList.toggle("has-artwork", !!showMediaPlayerDetailsValue);
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
    entityDetailsCardEl.append(entityDetailsHeadingEl, mediaPlayerDetailsBodyEl, control.panel);
    entityDetailsDialogElCurrent.append(entityDetailsCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogElCurrent);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogElCurrent;
    this.detailsStateSync = {
      entityDetailsDialogElCurrent,
      handlers: new Map([[entityId, [syncVisualState]]])
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, 540, 368);
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogElCurrent.close();
      }
    });
    let pendingRef = null;
    entityDetailsDialogElCurrent.addEventListener("close", () => {
      pendingRef?.cancel();
      control.cleanup?.();
      window.clearInterval(interval);
      window.clearTimeout(showMediaPlayerDetailsValueItem);
      window.clearTimeout(state);
      this.clearRuntimeDialogScale(entityDetailsDialogElCurrent);
      if (this.detailsDialog === entityDetailsDialogElCurrent) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogElCurrent) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogElCurrent.show();
    pendingRef = playMediaSpeakerEntrance(elementNext);
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
    const elementCurrent = document.createElement("button");
    elementCurrent.type = "button";
    elementCurrent.textContent = "×";
    elementCurrent.setAttribute("aria-label", "关闭组合弹窗");
    customPopupHeadingEl.append(divEl, elementCurrent);
    const customPopupGridEl = document.createElement("div");
    customPopupGridEl.className = "hb-custom-popup-grid";
    customPopupGridEl.style.gridTemplateColumns = "repeat(" + popupMetrics.columns + ", minmax(0, 1fr))";
    customPopupGridEl.style.gridTemplateRows = "repeat(" + popupMetrics.rows + ", minmax(0, 1fr))";
    const list = [];
    const stateCurrent = [];
    const stateNext = [];
    const statePrevious = [];
    const stateLocal = [];
    const handlers = new Map();
    const runHelper = (arg, handler) => {
      if (!handlers.has(arg)) {
        handlers.set(arg, []);
      }
      handlers.get(arg).push(handler);
    };
    for (const [entry, entryCurrent] of state.entries()) {
      const component = entryCurrent.type === "capability-device" ? {
        ...entryCurrent,
        type: "generic"
      } : entryCurrent;
      const text = String(component.entityId || "");
      const state = this.deviceProfile(text);
      const profile = applyXiaomiDeviceProfile({
        bindings: {
          entity: {
            entityId: component.entityId
          }
        },
        properties: {
          ...(component.properties || {}),
          deviceType: component.deviceType || component.properties?.deviceType || "auto"
        }
      }, state);
      const options = state ? {
        ...component,
        properties: profile.properties,
        deviceType: profile.properties?.deviceType || component.deviceType
      } : component;
      const size = popupMetrics.placements[entry] || {
        x: 0,
        y: entry,
        width: 1,
        height: 1
      };
      const count = ["climate", "air-purifier", "water-heater", "media-player", "camera", "line-chart"].includes(options.type) ? 2 : size.width;
      const entityId = text || options.entityId;
      const customPopupModuleEl = this.states.get(entityId);
      const stateEntry = customPopupModuleEl?.newState || customPopupModuleEl;
      const element = document.createElement("section");
      element.className = "hb-custom-popup-module hb-custom-popup-module--" + (options.type || "generic");
      element.style.gridColumn = size.x + 1 + " / span " + count;
      element.style.gridRow = size.y + 1 + " / span " + size.height;
      const elementCurrent = document.createElement("div");
      elementCurrent.className = "hb-custom-popup-module-heading";
      const elementNext = document.createElement("strong");
      elementNext.textContent = popupModuleDialogTitle(options, stateEntry);
      const elementPrevious = document.createElement("span");
      elementPrevious.className = "hb-custom-popup-module-status type-" + (options.type || "generic");
      const stateItem = {
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
      elementPrevious.textContent = stateItem[options.type] || stateItem.generic;
      elementCurrent.append(elementNext, elementPrevious);
      element.append(elementCurrent);
      if (options.type === "electric-bed" && state?.deviceType !== "electric-bed") {
        element.classList.add("hb-custom-popup-module--electric-bed");
        const customElectricBedLoadingEl = document.createElement("section");
        customElectricBedLoadingEl.className = "hb-custom-electric-bed-loading hb-climate-details-loading is-loading";
        const iconEl = document.createElement("i");
        iconEl.setAttribute("aria-hidden", "true");
        const elementCurrent = document.createElement("strong");
        elementCurrent.textContent = "正在加载设备状态…";
        customElectricBedLoadingEl.append(iconEl, elementCurrent);
        element.append(customElectricBedLoadingEl);
      } else if (options.type === "electric-bed") {
        element.classList.add("hb-custom-popup-module--electric-bed");
        const options = (state || this.deviceProfile(entityId))?.roles || {};
        const resolveEntityId = entityId => {
          const state = this.states.get(entityId);
          return state?.newState || state || {
            entityId: entityId,
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
          const element = document.createElement("i");
          element.className = "hb-electric-bed-" + electricBedEl;
          electricBedModelEl.append(element);
        }
        const buildElementTree = (electricBedAngleReadoutEl, electricBedAngleReadoutElCurrent) => {
          const item = document.createElement("span");
          item.className = "hb-electric-bed-angle-readout " + electricBedAngleReadoutEl;
          const strongEl = document.createElement("strong");
          const element = document.createElement("small");
          element.textContent = electricBedAngleReadoutElCurrent;
          item.append(strongEl, element);
          return {
            item,
            value: strongEl
          };
        };
        const tree = buildElementTree("back", "靠背");
        const elementCurrent = buildElementTree("waist", "腰部");
        const elementNext = buildElementTree("legs", "腿部");
        electricBedVisualEl.append(electricBedModelEl, tree.item, elementCurrent.item, elementNext.item);
        const electricBedControlEl = document.createElement("section");
        electricBedControlEl.className = "hb-electric-bed-control hb-electric-bed-mode";
        const electricBedMemoryEl = document.createElement("section");
        electricBedMemoryEl.className = "hb-electric-bed-memory";
        const electricBedAngleControlsEl = document.createElement("section");
        electricBedAngleControlsEl.className = "hb-electric-bed-angle-controls";
        const text = String(options.mode || "");
        const filtered = [options.memory1, options.memory2].filter(Boolean).slice(0, 2);
        const mapped = [["backrest", "靠背角度", "back"], ["leg", "腿部角度", "legs"], ["waist", "腰部角度", "waist"]].map(([role, label, visualClass]) => ({
          role,
          label,
          visualClass,
          entityId: String(options[role] || "")
        })).filter(electricBedControlEl => electricBedControlEl.entityId);
        const syncVisualState = (electricBedControlEl, electricBedControlElCurrent, electricBedControlElNext, variant = "") => {
          const element = document.createElement("section");
          element.className = "hb-electric-bed-control";
          const elementCurrent = document.createElement("strong");
          elementCurrent.textContent = electricBedControlElCurrent;
          const controls = this.createCapabilityDetailsControls(electricBedControlElNext, resolveEntityId(electricBedControlElNext), {
            interactive: !preview,
            variant
          });
          controls.classList.add("hb-electric-bed-capability");
          element.append(elementCurrent, controls);
          electricBedControlEl.append(element);
          list.push(() => controls.cleanupCapabilityDetails?.());
          runHelper(electricBedControlElNext, arg => controls.syncCapabilityState?.(arg));
        };
        if (text) {
          syncVisualState(electricBedControlEl, "模式", text, "electric-bed");
        } else {
          const element = document.createElement("strong");
          element.textContent = "模式";
          const capabilitySelectEl = document.createElement("select");
          capabilitySelectEl.className = "hb-capability-select";
          capabilitySelectEl.disabled = true;
          capabilitySelectEl.append(new Option("未识别到模式实体"));
          electricBedControlEl.append(element, capabilitySelectEl);
        }
        const elementLocal = document.createElement("strong");
        elementLocal.textContent = "记忆姿势";
        const electricBedMemoryListEl = document.createElement("div");
        electricBedMemoryListEl.className = "hb-electric-bed-memory-list";
        for (let state = 0; state < 2; state += 1) {
          const text = String(filtered[state] || "");
          const state11 = text ? this.entityMetadata.get(text) : null;
          if (text.split(".", 1)[0] === "select") {
            syncVisualState(electricBedMemoryListEl, "记忆姿势 " + (state + 1), text, "electric-bed-memory");
            continue;
          }
          const element = document.createElement("button");
          element.type = "button";
          element.className = "hb-electric-bed-memory-button";
          element.textContent = state11?.name || state11?.originalName || "记忆姿势 " + (state + 1);
          element.disabled = preview || !text;
          element.addEventListener("click", async () => {
            if (!preview && !!text && !element.disabled) {
              element.disabled = true;
              try {
                await this.callEntityService("button", "press", text);
                element.classList.add("is-success");
                window.setTimeout(() => element.classList.remove("is-success"), 900);
              } catch (error) {
                this.options.onError?.(error);
              } finally {
                element.disabled = preview || !text;
              }
            }
          });
          electricBedMemoryListEl.append(element);
        }
        electricBedMemoryEl.append(elementLocal, electricBedMemoryListEl);
        for (const item of mapped) {
          syncVisualState(electricBedAngleControlsEl, item.label, item.entityId);
        }
        const applyElementStyle = () => {
          const state = {
            backrest: resolveEntityId(options.backrest),
            leg: resolveEntityId(options.leg),
            waist: resolveEntityId(options.waist)
          };
          const runHelper = arg => {
            const numeric = Number(arg?.state);
            if (Number.isFinite(numeric)) {
              return numeric;
            } else {
              return null;
            }
          };
          const applyElementStyle = (arg, second, element) => {
            const helper = runHelper(state[arg]);
            element.textContent = helper === null ? "--" : Math.round(helper) + "°";
            if (helper !== null) {
              electricBedModelEl.style.setProperty("--hb-bed-" + (arg === "backrest" ? "backrest" : arg) + "-angle", helper + "deg");
            }
          };
          applyElementStyle("backrest", electricBedModelEl, tree.value);
          applyElementStyle("waist", electricBedModelEl, elementCurrent.value);
          applyElementStyle("leg", electricBedModelEl, elementNext.value);
          elementPrevious.textContent = "已连接";
        };
        for (const item of [options.backrest, options.leg, options.waist].filter(Boolean)) {
          runHelper(item, applyElementStyle);
        }
        applyElementStyle();
        customElectricBedBodyEl.append(electricBedControlEl, electricBedVisualEl, electricBedMemoryEl, electricBedAngleControlsEl);
        element.append(customElectricBedBodyEl);
      } else if (options.type === "camera") {
        const elementLocal = document.createElement("section");
        elementLocal.className = "hb-camera-device-visual hb-custom-camera-device-visual";
        elementLocal.setAttribute("aria-hidden", "true");
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
        elementLocal.append(cameraDeviceMountEl, cameraDeviceArmEl, cameraDeviceBodyEl);
        elementCurrent.append(elementLocal);
        let state = 0;
        let stateCurrent = null;
        let count = 0;
        const runHelper = (arg, delayOrNumber = 0) => "translateX(-50%) perspective(260px) rotateY(" + arg + "deg) rotateZ(" + arg * 0.035 + "deg) translateY(" + delayOrNumber + "px)";
        const filtered = () => {
          if (!cameraDeviceBodyEl.isConnected) {
            return;
          }
          const filteredCurrent = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(arg => Math.abs(arg - count) >= 7);
          const stateNext = filteredCurrent[Math.floor(Math.random() * filteredCurrent.length)] ?? 0;
          const sign = Math.sign(stateNext - count) || 1;
          const abs = Math.abs(stateNext - count);
          const duration = Math.round(430 + abs * 18 + Math.random() * 320);
          const value = stateNext + sign * (1.4 + Math.random() * 2.2);
          const statePrevious = Math.random() * 1.4 - 0.7;
          cameraDeviceLensEl.style.setProperty("--hb-camera-lens-shift", stateNext / 23 * 2.5 + "px");
          stateCurrent?.cancel();
          stateCurrent = cameraDeviceBodyEl.animate([{
            transform: runHelper(count, 0),
            offset: 0
          }, {
            transform: runHelper(value, statePrevious),
            offset: 0.78
          }, {
            transform: runHelper(stateNext, statePrevious * 0.35),
            offset: 1
          }], {
            duration,
            easing: "cubic-bezier(.2,.72,.22,1)",
            fill: "forwards"
          });
          stateCurrent.addEventListener("finish", () => {
            count = stateNext;
            cameraDeviceBodyEl.style.transform = runHelper(count, statePrevious * 0.35);
            stateCurrent?.cancel();
            stateCurrent = null;
            const value = Math.random() < 0.22 ? 180 + Math.random() * 260 : 680 + Math.random() * 1500;
            state = window.setTimeout(filtered, value);
          }, {
            once: true
          });
        };
        if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
          state = window.setTimeout(filtered, 620);
        }
        list.push(() => {
          window.clearTimeout(state);
          stateCurrent?.cancel();
        });
        const container = document.createElement("div");
        container.className = "hb-custom-popup-camera-stage is-connecting";
        elementPrevious.textContent = preview ? "预览模式" : "正在连接";
        elementPrevious.classList.add("is-connecting");
        const cameraPreviewRevealVeilEl = document.createElement("i");
        cameraPreviewRevealVeilEl.className = "hb-camera-preview-reveal-veil";
        const cameraPreviewScanLineEl = document.createElement("i");
        cameraPreviewScanLineEl.className = "hb-camera-preview-scan-line";
        container.append(cameraPreviewRevealVeilEl, cameraPreviewScanLineEl);
        const placeholder = document.createElement("span");
        placeholder.textContent = preview ? "预览模式不获取实时画面" : "正在载入摄像头实时预览";
        container.append(placeholder);
        if (preview) {
          elementPrevious.classList.remove("is-connecting");
          container.classList.remove("is-connecting");
          container.classList.add("is-ready");
        } else {
          mountCameraMedia({
            container,
            entityId,
            label: elementNext.textContent,
            objectFit: "fill",
            placeholder,
            onReady: () => {
              elementPrevious.textContent = "实时画面";
              elementPrevious.classList.remove("is-connecting", "is-unavailable");
              elementPrevious.classList.add("is-live");
              elementLocal.classList.remove("is-unavailable");
              elementLocal.classList.add("is-live");
              container.classList.remove("is-connecting", "is-unavailable", "is-revealing");
              container.classList.add("is-ready");
            },
            onUnavailable: () => {
              elementPrevious.textContent = "画面不可用";
              elementPrevious.classList.remove("is-connecting", "is-live");
              elementPrevious.classList.add("is-unavailable");
              elementLocal.classList.remove("is-live");
              elementLocal.classList.add("is-unavailable");
              container.classList.remove("is-connecting", "is-revealing");
              container.classList.add("is-unavailable");
            },
            cleanup: cleanup => list.push(cleanup)
          });
        }
        element.append(container);
      } else if (options.type === "line-chart") {
        const component = {
          type: "line-chart",
          bindings: {
            entity: {
              entityId
            }
          },
          properties: {
            ...syncedLineChartProperties(this.document, this.page, entityId, options.properties),
            compactDetailsHorizontal: true
          }
        };
        const customLineChartCurrentEl = document.createElement("output");
        customLineChartCurrentEl.className = "hb-custom-line-chart-current";
        const elementNext = document.createElement("strong");
        const elementPrevious = document.createElement("small");
        const text = String(component.properties?.valueColor || "#dce1e5");
        elementNext.style.color = text;
        elementPrevious.style.color = text;
        customLineChartCurrentEl.append(elementNext, elementPrevious);
        elementCurrent.append(customLineChartCurrentEl);
        const syncAriaState = entityState => {
          const state = Number.parseFloat(entityState?.state);
          elementNext.textContent = Number.isFinite(state) ? formatLineChartValue(state, component.properties?.statePrecision) : entityState?.state || "--";
          elementPrevious.textContent = String(entityState?.attributes?.unit_of_measurement || "");
          customLineChartCurrentEl.setAttribute("aria-label", "当前数值 " + elementNext.textContent + elementPrevious.textContent);
        };
        const state = {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace + "-" + options.id,
          interactive: true,
          animate: false
        };
        let details = renderLineChartDetails(component, state);
        let count = 0;
        const callback = () => {
          count = 0;
          if (!details?.isConnected || this.detailsStateSync?.dialog !== customPopupDialogEl) {
            return;
          }
          const stateCurrent = renderLineChartDetails(component, state);
          details.cleanupLineChartHover?.();
          details.replaceWith(stateCurrent);
          details = stateCurrent;
          applyElementStyle();
        };
        const scheduleTimeout = (arg = 700) => {
          count ||= window.setTimeout(callback, Math.max(0, Number(arg) || 0));
        };
        stateLocal.push(() => scheduleTimeout(0));
        const applyElementStyle = () => {
          customLineChartCurrentEl.style.setProperty("--hb-custom-chart-accent", details.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
        };
        syncAriaState(stateEntry);
        applyElementStyle();
        runHelper(entityId, arg => {
          syncAriaState(arg);
          details.syncLineChartState?.(arg);
          applyElementStyle();
        });
        list.push(() => {
          window.clearTimeout(count);
          details.cleanupLineChartHover?.();
        });
        element.append(details);
      } else if (options.type === "switch") {
        let state = stateEntry;
        let flag = false;
        let text = "idle";
        let stateCurrent = null;
        const momentary = entityId.split(".")[0] === "button";
        const switchVisual = buildSwitchVisual({
          label: elementNext.textContent,
          interactive: !preview,
          momentary,
          onToggle: () => stateCurrent?.()
        });
        switchVisual.visual.classList.add("hb-custom-switch-visual");
        const syncVisualState = arg => {
          state = arg;
          const unavailable = !arg?.state || ["unknown", "unavailable"].includes(arg.state);
          const stateCurrent = !momentary && arg?.state === "on";
          switchVisual.sync(stateCurrent, {
            unavailable,
            pending: flag && text !== "success",
            success: text === "success"
          });
          elementPrevious.textContent = unavailable ? "当前不可用" : momentary ? text === "success" ? "执行成功" : flag ? "正在执行" : "按下执行" : stateCurrent ? "已开启" : "已关闭";
          elementPrevious.classList.toggle("is-live", (momentary ? flag || text === "success" : stateCurrent) && !unavailable);
        };
        stateCurrent = async () => {
          if (preview || flag || ["unknown", "unavailable"].includes(state?.state)) {
            return;
          }
          const stateCurrent = state;
          flag = true;
          text = "idle";
          syncVisualState(momentary ? stateCurrent : {
            ...stateCurrent,
            state: stateCurrent?.state === "on" ? "off" : "on"
          });
          try {
            if (momentary) {
              await this.callEntityService("button", "press", entityId);
              text = "success";
              syncVisualState(state);
              await new Promise(arg => window.setTimeout(arg, 900));
            } else {
              await this.callEntityService("homeassistant", "toggle", entityId);
            }
          } catch (error) {
            text = "idle";
            syncVisualState(stateCurrent);
            this.options.onError?.(error);
          } finally {
            flag = false;
            text = "idle";
            syncVisualState(state);
          }
        };
        syncVisualState(stateEntry);
        runHelper(entityId, syncVisualState);
        element.append(switchVisual.visual);
      } else if (options.type === "light") {
        let lightVisualEl = null;
        elementCurrent.classList.add("has-light-visual");
        const elementLocal = document.createElement("button");
        elementLocal.type = "button";
        elementLocal.className = "hb-light-visual hb-custom-light-visual";
        elementLocal.style.animationDelay = 0.08 + entry * 0.07 + "s";
        elementLocal.inert = preview;
        elementLocal.setAttribute("aria-disabled", String(preview));
        const lightVisualAuraEl = document.createElement("div");
        lightVisualAuraEl.className = "hb-light-visual-aura";
        const lightVisualLampEl = document.createElement("div");
        lightVisualLampEl.className = "hb-light-visual-lamp";
        for (const lightVisualEl of ["cord", "shade", "bulb", "filament"]) {
          const element = document.createElement("i");
          element.className = "hb-light-visual-" + lightVisualEl;
          lightVisualLampEl.append(element);
        }
        elementLocal.append(lightVisualAuraEl, lightVisualLampEl);
        elementCurrent.append(elementLocal);
        const numeric = stateEntry?.attributes || {};
        const temperature = lightSupportsColor(numeric);
        const finiteNumber = Number(numeric.min_color_temp_kelvin) || (Number.isFinite(Number(numeric.max_mireds)) ? 1000000 / Number(numeric.max_mireds) : 2000);
        const number = Number(numeric.max_color_temp_kelvin) || (Number.isFinite(Number(numeric.min_mireds)) ? 1000000 / Number(numeric.min_mireds) : 6500);
        const finiteNumberCurrent = Number(numeric.color_temp_kelvin) || (Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : NaN);
        const options = {
          isOn: stateEntry?.state === "on",
          brightnessPercent: Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : 100,
          colorTemperatureKelvin: Number.isFinite(finiteNumberCurrent) ? finiteNumberCurrent : (finiteNumber + number) / 2,
          colorRgb: temperature && Array.isArray(numeric.rgb_color) ? numeric.rgb_color.slice(0, 3).map(colorRgb => Number(colorRgb) || 0) : temperature && Array.isArray(numeric.hs_color) ? hsToRgbColor(numeric.hs_color) : null
        };
        const onVisualChange = (entityState = {}) => {
          const numeric = entityState.attributes || {};
          if (typeof entityState.isOn == "boolean") {
            options.isOn = entityState.isOn;
          } else if (typeof entityState.state == "string") {
            options.isOn = entityState.state === "on";
          }
          if (Number.isFinite(Number(entityState.brightnessPercent))) {
            options.brightnessPercent = Number(entityState.brightnessPercent);
          } else if (Number.isFinite(Number(numeric.brightness))) {
            options.brightnessPercent = Number(numeric.brightness) / 255 * 100;
          }
          if (Number.isFinite(Number(entityState.colorTemperatureKelvin))) {
            options.colorTemperatureKelvin = Number(entityState.colorTemperatureKelvin);
          } else if (Number.isFinite(Number(numeric.color_temp_kelvin))) {
            options.colorTemperatureKelvin = Number(numeric.color_temp_kelvin);
          } else if (Number.isFinite(Number(numeric.color_temp))) {
            options.colorTemperatureKelvin = 1000000 / Number(numeric.color_temp);
          }
          if (temperature && Array.isArray(entityState.colorRgb)) {
            options.colorRgb = entityState.colorRgb.slice(0, 3).map(arg => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric.rgb_color)) {
            options.colorRgb = numeric.rgb_color.slice(0, 3).map(arg => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric.hs_color)) {
            options.colorRgb = hsToRgbColor(numeric.hs_color);
          }
          const count = Math.max(1, Math.min(100, Number(options.brightnessPercent) || 1));
          const clamped = (Math.max(2000, Math.min(6500, Number(options.colorTemperatureKelvin) || 4250)) - 2000) / 4500;
          const color = [255, 132, 42];
          const list = [172, 225, 255];
          const mapped = options.colorRgb || color.map((arg, second) => Math.round(arg + (list[second] - arg) * clamped));
          elementLocal.classList.toggle("is-on", options.isOn);
          elementLocal.style.setProperty("--hb-light-visual-color", "rgb(" + mapped.join(",") + ")");
          elementLocal.style.setProperty("--hb-light-visual-opacity", options.isOn ? String(0.08 + count / 100 * 0.92) : "0");
          elementLocal.style.setProperty("--hb-light-visual-blur", Math.round(15 + count * 1.14) + "px");
          elementLocal.style.setProperty("--hb-light-visual-scale", String(0.62 + count / 100 * 1.05));
          elementLocal.setAttribute("aria-pressed", String(options.isOn));
          elementLocal.setAttribute("aria-label", "" + elementNext.textContent + (options.isOn ? "已开启，点击关闭" : "已关闭，点击开启"));
          elementPrevious.textContent = options.isOn ? "已开启" : "已关闭";
          elementPrevious.classList.toggle("is-live", options.isOn);
        };
        onVisualChange();
        let state = false;
        elementLocal.addEventListener("click", async () => {
          if (preview || state) {
            return;
          }
          state = true;
          elementLocal.setAttribute("aria-busy", "true");
          const isOn = options.isOn;
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
            state = false;
            elementLocal.removeAttribute("aria-busy");
          }
        });
        lightVisualEl = this.createLightDetailsControls(entityId, stateEntry, {
          interactive: !preview,
          onTurnOn: () => {
            onVisualChange({
              isOn: true
            });
          },
          onVisualChange
        });
        list.push(() => lightVisualEl?.cleanupLightDetails?.());
        runHelper(entityId, arg => {
          onVisualChange(arg);
          lightVisualEl?.syncLightState?.(arg);
        });
        element.append(lightVisualEl);
      } else if (options.type === "climate" || options.type === "water-heater") {
        element.classList.add("hb-custom-popup-module--climate");
        const deviceType = options.type === "water-heater" ? "water-heater" : resolveClimateDeviceType({
          properties: {
            deviceType: options.deviceType || options.properties?.deviceType || "auto",
            label: options.title || ""
          }
        }, stateEntry, entityId);
        let climateVisualEl = stateEntry;
        const climateVisualElCurrent = {
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
          statePrevious.push({
            visual,
            distance: 168,
            delay: 100 + entry * 45
          });
        }
        visual.inert = preview;
        visual.setAttribute("aria-disabled", String(preview));
        const climateVisualUnitEl = document.createElement("div");
        climateVisualUnitEl.className = "hb-climate-visual-unit";
        const elementCurrent = document.createElement("span");
        elementCurrent.className = "hb-climate-visual-brand";
        elementCurrent.textContent = deviceType === "bath-heater" ? "BATH HEATER" : deviceType === "water-heater" ? "SMART WATER" : "SMART AIR";
        const elementLocal = document.createElement("strong");
        elementLocal.className = "hb-climate-visual-display";
        const climateVisualVentEl = document.createElement("div");
        climateVisualVentEl.className = "hb-climate-visual-vent";
        for (let climateVisualAirflowEl = 0; climateVisualAirflowEl < 5; climateVisualAirflowEl += 1) {
          climateVisualVentEl.append(document.createElement("i"));
        }
        climateVisualUnitEl.append(elementCurrent, elementLocal, climateVisualVentEl);
        const climateVisualAirflowEl = document.createElement("div");
        climateVisualAirflowEl.className = "hb-climate-visual-airflow";
        for (let showCustomPopupValue = 0; showCustomPopupValue < 3; showCustomPopupValue += 1) {
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
          const state = visualMode !== "off";
          visual.classList.toggle("is-on", state);
          visual.classList.toggle("is-running", running);
          visual.classList.toggle("is-airflow-mode", deviceType === "bath-heater" && state && bathHeaterModeUsesAirflow(mode));
          visual.dataset.visualMode = visualMode;
          visual.style.setProperty("--hb-climate-visual-accent", accentColor);
          const finiteNumber = targetTemperature != null && targetTemperature !== "" && Number.isFinite(Number(targetTemperature));
          elementLocal.textContent = state ? finiteNumber ? Number(targetTemperature) + "°" : climateModeLabel(mode, deviceType, climateVisualElCurrent) : "OFF";
          if (deviceType === "bath-heater") {
            visual.setAttribute("aria-label", elementNext.textContent + "，点击切换浴霸灯");
          } else {
            visual.setAttribute("aria-pressed", String(state));
            visual.setAttribute("aria-label", "" + elementNext.textContent + (state ? "已开启，点击关闭" : "已关闭，点击开启"));
          }
        };
        const controls = this.createClimateDetailsControls(entityId, stateEntry, {
          interactive: !preview,
          deviceType,
          onVisualChange: ({
            mode: onVisualChange,
            visualMode: onVisualChangeCurrent,
            running: onVisualChangeNext,
            accentColor: onVisualChangePrevious,
            accentSoft: onVisualChangeLocal,
            targetTemperature: onVisualChangeItem
          }) => {
            elementPrevious.textContent = climateModeLabel(onVisualChange, deviceType, climateVisualElCurrent);
            elementPrevious.classList.toggle("is-live", onVisualChangeCurrent !== "off");
            elementPrevious.classList.toggle("is-running", onVisualChangeNext);
            elementPrevious.style.setProperty("--hb-climate-accent", onVisualChangePrevious);
            elementPrevious.style.setProperty("--hb-climate-accent-soft", onVisualChangeLocal);
            syncVisualState({
              mode: onVisualChange,
              visualMode: onVisualChangeCurrent,
              running: onVisualChangeNext,
              accentColor: onVisualChangePrevious,
              targetTemperature: onVisualChangeItem
            });
          }
        });
        list.push(() => controls.cleanupClimateDetails?.());
        const text = deviceType === "bath-heater" ? state?.roles?.light : "";
        const stateCurrent = text ? this.entityMetadata.get(text) : deviceType === "bath-heater" ? relatedDeviceDomainEntity(this.entityMetadata, entityId, "light") : null;
        let stateNext = null;
        if (stateCurrent?.entityId) {
          const state = this.states.get(stateCurrent.entityId);
          const statePrevious = state?.newState || state || {
            state: "unknown",
            attributes: {}
          };
          stateNext = this.createBathHeaterLightControl(stateCurrent.entityId, statePrevious, {
            interactive: !preview,
            onStateChange: ({
              isOn: onStateChange,
              unavailable: onStateChangeCurrent
            }) => {
              visual.classList.toggle("is-light-on", onStateChange && !onStateChangeCurrent);
              visual.setAttribute("aria-pressed", String(onStateChange && !onStateChangeCurrent));
            }
          });
          controls.append(stateNext);
          runHelper(stateCurrent.entityId, arg => stateNext.syncBathLightState?.(arg));
        }
        const stateLocal = Array.from(controls.children);
        const customClimateLeftEl = stateLocal.find(element => element.classList.contains("hb-climate-thermostat"));
        const found = stateLocal.find(element => element.classList.contains("hb-climate-fan-slider"));
        const customClimateLeftElCurrent = document.createElement("div");
        customClimateLeftElCurrent.className = "hb-custom-climate-left";
        const customClimateRightEl = document.createElement("div");
        customClimateRightEl.className = "hb-custom-climate-right";
        if (customClimateLeftEl) {
          customClimateLeftElCurrent.append(customClimateLeftEl);
        }
        if (found) {
          customClimateLeftElCurrent.append(found);
        }
        customClimateRightEl.append(visual, ...stateLocal.filter(arg => arg !== customClimateLeftEl && arg !== found));
        const stateItem = !!customClimateLeftEl || !!found;
        controls.classList.toggle("without-primary-controls", !stateItem);
        controls.replaceChildren(...(stateItem ? [customClimateLeftElCurrent, customClimateRightEl] : [customClimateRightEl]));
        let showCustomPopupValue = false;
        visual.addEventListener("click", async () => {
          if (deviceType === "bath-heater") {
            if (stateNext?.toggleBathLight) {
              await stateNext.toggleBathLight();
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
          const state = climateIsPoweredOn(entityState, deviceType);
          const lastClimateMode = controls.dataset.lastClimateMode || (state ? entityState.state : "auto");
          const options = {
            state: state ? "off" : lastClimateMode,
            attributes: {
              ...(entityState?.attributes || {}),
              hvac_action: state ? "off" : lastClimateMode
            }
          };
          climateVisualEl = options;
          controls.syncClimateState?.(options);
          try {
            const command = climatePowerCommand(entityId, entityState, !state, deviceType, controls.dataset.lastClimateMode || "");
            await this.callEntityService(command.domain, command.service, entityId, command.data);
          } catch (error) {
            climateVisualEl = entityState;
            controls.syncClimateState?.(entityState);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            visual.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, arg => {
          climateVisualEl = arg;
          controls.syncClimateState?.(arg);
        });
        element.append(controls);
      } else if (options.type === "cover") {
        let stateCurrent = stateEntry;
        const entityState = stateEntry?.attributes || {};
        const airer = coverComponentIsAirer(options, entityId, stateEntry, this.entityMetadata, this.deviceMetadata);
        const numeric = Number(entityState.supported_features || 0);
        const state = entityId + " " + (entityState.friendly_name || "") + " " + (options.title || "");
        const finiteNumber = Number.isFinite(Number(entityState.current_tilt_position)) || !!(numeric & 240);
        const test = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(state);
        const coverKind = ["standard", "dream", "airer"].includes(options.properties?.coverKind) ? options.properties.coverKind : "auto";
        const dream = !airer && (coverKind === "dream" || coverKind === "auto" && (finiteNumber || test));
        const text = (airer ? relatedAirerLightEntity(this.entityMetadata, entityId) : null)?.entityId || "";
        const entry = text ? this.states.get(text) : null;
        let position = entry?.newState || entry || null;
        const positionCommandEntityId = (airer ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId) : null)?.entityId || "";
        const positionCurrent = this.states.get(positionCommandEntityId);
        const positionCommandState = positionCurrent?.newState || positionCurrent || null;
        const stateNext = (airer ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId) : null)?.entityId || "";
        const statePrevious = (airer ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId) : null)?.entityId || "";
        const stateLocal = this.states.get(statePrevious);
        const motorState = stateLocal?.newState || stateLocal || null;
        const entities = airer ? relatedAirerMotorActionEntities(this.entityMetadata, entityId) : {};
        const airerActionEntityIds = Object.fromEntries(Object.entries(entities).map(([arg, item]) => [arg, item?.entityId || ""]));
        const positionNext = this.states.get(stateNext || positionCommandEntityId);
        const positionState = positionNext?.newState || positionNext || null;
        const tilt = dream && finiteNumber;
        const motorReversed = coverMotorIsReversedForComponent(options, this.entityMetadata, this.states, entityId);
        const stateItem = motorReversed ? "open_cover" : "close_cover";
        const customCoverLayoutEl = motorReversed ? "close_cover" : "open_cover";
        const coverDirection = ["left", "right"].includes(options.properties?.coverDirection) ? options.properties.coverDirection : "split";
        const customCoverLayoutElCurrent = document.createElement("div");
        customCoverLayoutElCurrent.className = "hb-custom-cover-layout";
        const elementCurrent = document.createElement("button");
        elementCurrent.type = "button";
        elementCurrent.className = "hb-cover-visual hb-custom-cover-visual";
        elementCurrent.inert = preview;
        elementCurrent.setAttribute("aria-disabled", String(preview));
        const coverVisualRailEl = document.createElement("i");
        coverVisualRailEl.className = "hb-cover-visual-rail";
        const coverVisualPanelEl = document.createElement("i");
        coverVisualPanelEl.className = "hb-cover-visual-panel left";
        const coverVisualPanelElCurrent = document.createElement("i");
        coverVisualPanelElCurrent.className = "hb-cover-visual-panel right";
        const coverVisualSlatsEl = document.createElement("span");
        coverVisualSlatsEl.className = "hb-cover-visual-slats";
        const coverVisualSlatEl = 13;
        for (let count = 0; count < coverVisualSlatEl; count += 1) {
          const element = document.createElement("span");
          element.className = "hb-cover-visual-slat";
          const iconEl = document.createElement("i");
          element.style.setProperty("--hb-cover-slat-index", String(count));
          const size = coverDirection === "right" ? coverVisualSlatEl - 1 - count : coverDirection === "split" ? Math.abs((coverVisualSlatEl - 1) / 2 - count) : count;
          element.style.setProperty("--hb-cover-slat-delay-index", String(size));
          const value = coverDirection === "left" ? -count * 14.5 : coverDirection === "right" ? (coverVisualSlatEl - 1 - count) * 14.5 : count <= (coverVisualSlatEl - 1) / 2 ? -count * 14.5 : (coverVisualSlatEl - 1 - count) * 14.5;
          element.style.setProperty("--hb-cover-retracted-shift", value + "px");
          element.append(iconEl);
          coverVisualSlatsEl.append(element);
        }
        const coverVisualWindowEl = document.createElement("i");
        coverVisualWindowEl.className = "hb-cover-visual-window";
        elementCurrent.classList.toggle("is-dream", dream);
        elementCurrent.classList.toggle("is-airer", airer);
        elementCurrent.classList.add("direction-" + coverDirection);
        elementCurrent.append(coverVisualWindowEl, coverVisualRailEl, coverVisualPanelEl, coverVisualPanelElCurrent, coverVisualSlatsEl);
        if (airer) {
          appendAirerVisual(elementCurrent);
        }
        const syncVisualState = (arg = position) => {
          if (!airer) {
            return;
          }
          position = arg || position;
          const state = !text || ["unknown", "unavailable"].includes(String(position?.state || "unknown"));
          const value = position?.state === "on";
          elementCurrent.classList.toggle("is-light-on", value && !state);
          elementCurrent.classList.toggle("is-light-unavailable", state);
          elementCurrent.disabled = preview || state;
          elementCurrent.setAttribute("aria-pressed", String(value && !state));
          elementCurrent.setAttribute("aria-label", state ? "晾衣机灯光实体不可用" : "晾衣机灯光" + (value ? "已开启，点击关闭" : "已关闭，点击开启"));
        };
        syncVisualState();
        let count = 0;
        const positionCalibration = airerPositionCalibration(this.entityMetadata, this.deviceMetadata, entityId);
        const onVisualChange = ({
          position: position = 0,
          state = ""
        } = {}) => {
          const current_position = Math.max(0, Math.min(100, Number(position) || 0));
          const coverState = coverPresentationState({
            state,
            attributes: {
              current_position
            }
          }, motorReversed);
          const physicalState = physicalCoverState(state || stateCurrent?.state, motorReversed);
          const value = physicalState === "open" || physicalState === "opening";
          count = current_position;
          elementCurrent.style.setProperty("--hb-cover-open-position", current_position + "%");
          elementCurrent.style.setProperty("--hb-airer-drop", airerVisualDrop(current_position) + "px");
          elementCurrent.style.setProperty("--hb-cover-panel-width", 45.9 - current_position * 0.331 + "%");
          elementCurrent.style.setProperty("--hb-cover-single-panel-width", 91.8 - current_position * 0.79 + "%");
          elementCurrent.style.setProperty("--hb-cover-slat-angle", current_position * 1.8 + "deg");
          elementCurrent.classList.toggle("is-tilt-reversed", current_position > 50);
          elementCurrent.classList.toggle("is-tilt-center", Math.abs(current_position - 50) <= 2);
          elementCurrent.classList.toggle("is-open", dream ? value : coverState === "open" || coverState === "opening");
          elementCurrent.classList.toggle("is-moving", state === "opening" || state === "closing");
          elementCurrent.setAttribute("aria-pressed", String(dream ? value : coverState === "open" || coverState === "opening"));
          if (airer) {
            elementPrevious.textContent = coverLiftStateLabel(coverState) || Math.round(current_position) + "%";
          } else if (dream) {
            elementPrevious.textContent = dreamCurtainStatusText(state || stateCurrent?.state, current_position, motorReversed);
          } else {
            elementPrevious.textContent = {
              open: "已打开",
              closed: "已关闭",
              opening: "正在打开",
              closing: "正在关闭"
            }[coverState] || Math.round(current_position) + "%";
          }
          elementPrevious.classList.toggle("is-live", dream ? value : coverState === "open" || coverState === "opening");
          if (!airer) {
            elementCurrent.setAttribute("aria-label", dream ? "" + elementNext.textContent + dreamCurtainStatusText(state || stateCurrent?.state, current_position, motorReversed) : "" + elementNext.textContent + (coverState === "open" || coverState === "opening" ? "已打开，点击关闭" : "已关闭，点击打开"));
          }
        };
        const controls = this.createCoverDetailsControls(entityId, stateEntry, {
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
            moving: onCurtainPositionChangeCurrent
          }) => {
            elementCurrent.classList.toggle("is-curtain-retracted", onCurtainPositionChange);
            elementCurrent.classList.toggle("is-curtain-moving", onCurtainPositionChangeCurrent);
            elementCurrent.dataset.curtainRetracted = String(onCurtainPositionChange);
            if (dream) {
              elementPrevious.textContent = dreamCurtainStatusFromRetraction(onCurtainPositionChange, onCurtainPositionChangeCurrent, count);
              elementPrevious.classList.toggle("is-live", onCurtainPositionChange);
            }
          }
        });
        let showCustomPopupValue = false;
        elementCurrent.addEventListener("click", async () => {
          if (preview || showCustomPopupValue) {
            return;
          }
          showCustomPopupValue = true;
          elementCurrent.setAttribute("aria-busy", "true");
          if (airer) {
            const state = position;
            syncVisualState({
              ...(position || {}),
              state: position?.state === "on" ? "off" : "on"
            });
            try {
              await this.callEntityService("homeassistant", "toggle", text);
            } catch (error) {
              syncVisualState(state);
              this.options.onError?.(error);
            } finally {
              showCustomPopupValue = false;
              elementCurrent.removeAttribute("aria-busy");
            }
            return;
          }
          const state = count;
          const value = controls.isDreamCurtainRetracted?.() ?? elementCurrent.dataset.curtainRetracted === "true";
          const stateNext = state > COVER_CLOSED_POSITION_EPSILON;
          if (dream) {
            controls.beginDreamCurtainMotion?.(!value);
          } else {
            controls.beginCoverMotion?.(stateNext ? 0 : 100, stateNext ? "closing" : "opening");
          }
          try {
            await this.callEntityService("cover", dream ? dreamCurtainToggleService(value, customCoverLayoutEl, stateItem) : stateNext ? stateItem : customCoverLayoutEl, entityId);
          } catch (error) {
            if (dream) {
              controls.cancelDreamCurtainMotion?.();
              controls.setDreamCurtainRetracted?.(value, false);
            } else {
              controls.cancelCoverMotion?.();
            }
            controls.syncCoverState?.(stateCurrent);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            elementCurrent.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, arg => {
          stateCurrent = arg;
          controls.syncCoverState?.(arg);
        });
        if (text) {
          runHelper(text, syncVisualState);
        }
        if (stateNext) {
          runHelper(stateNext, arg => controls.syncCoverPositionState?.(arg));
        }
        if (positionCommandEntityId) {
          runHelper(positionCommandEntityId, entityId => {
            controls.syncCoverPositionCommandState?.(entityId);
            if (!stateNext) {
              controls.syncCoverPositionState?.(entityId);
            }
          });
        }
        if (statePrevious) {
          runHelper(statePrevious, arg => controls.syncAirerMotorState?.(arg));
        }
        list.push(() => controls.cleanupCoverDetails?.());
        customCoverLayoutElCurrent.append(elementCurrent, controls);
        element.append(customCoverLayoutElCurrent);
      } else if (options.type === "air-purifier") {
        let airPurifierVisualEl = stateEntry || {
          entityId,
          state: "unknown",
          attributes: {}
        };
        const elementLocal = document.createElement("button");
        elementLocal.type = "button";
        elementLocal.className = "hb-air-purifier-visual hb-custom-air-purifier-visual";
        elementLocal.inert = preview;
        elementLocal.setAttribute("aria-disabled", String(preview));
        const airPurifierVisualAuraEl = document.createElement("i");
        airPurifierVisualAuraEl.className = "hb-air-purifier-visual-aura";
        const airPurifierVisualAirflowEl = document.createElement("span");
        airPurifierVisualAirflowEl.className = "hb-air-purifier-visual-airflow";
        for (let airPurifierVisualBodyEl = 0; airPurifierVisualBodyEl < 4; airPurifierVisualBodyEl += 1) {
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
        const elementItem = document.createElement("strong");
        airPurifierVisualDisplayEl.append(elementItem);
        airPurifierVisualBodyEl.append(airPurifierVisualTopEl, airPurifierVisualVentEl, airPurifierVisualDisplayEl);
        elementLocal.append(airPurifierVisualAuraEl, airPurifierVisualAirflowEl, airPurifierVisualBodyEl);
        const airPurifierLayoutEl = this.createCapabilityDetailsControls(entityId, airPurifierVisualEl, {
          interactive: !preview,
          variant: "air-purifier"
        });
        const airPurifierLayoutElCurrent = document.createElement("div");
        airPurifierLayoutElCurrent.className = "hb-air-purifier-layout hb-custom-air-purifier-layout";
        const airPurifierSummaryEl = document.createElement("section");
        airPurifierSummaryEl.className = "hb-air-purifier-summary";
        const airPurifierGaugeWrapEl = document.createElement("div");
        airPurifierGaugeWrapEl.className = "hb-air-purifier-gauge-wrap";
        const elementEntry = document.createElement("div");
        elementEntry.className = "hb-air-purifier-gauge is-quality";
        const elementList = document.createElement("i");
        elementList.className = "hb-air-purifier-gauge-orbit";
        const airPurifierArcCapEl = document.createElement("i");
        airPurifierArcCapEl.className = "hb-air-purifier-arc-cap start";
        const airPurifierArcCapElCurrent = document.createElement("i");
        airPurifierArcCapElCurrent.className = "hb-air-purifier-arc-cap end";
        const airPurifierGaugeContentEl = document.createElement("div");
        airPurifierGaugeContentEl.className = "hb-air-purifier-gauge-content";
        const elementText = document.createElement("small");
        elementText.textContent = "室内空气质量";
        const strongEl = document.createElement("strong");
        const elementValue = document.createElement("span");
        const elementSource = document.createElement("span");
        elementSource.textContent = "设备状态 --";
        strongEl.append(elementValue);
        airPurifierGaugeContentEl.append(elementText, strongEl, elementSource);
        elementEntry.append(airPurifierArcCapEl, airPurifierArcCapElCurrent, airPurifierGaugeContentEl);
        airPurifierGaugeWrapEl.append(elementList, elementEntry);
        const airPurifierControlsPaneEl = document.createElement("section");
        airPurifierControlsPaneEl.className = "hb-air-purifier-controls-pane";
        airPurifierControlsPaneEl.append(airPurifierLayoutEl);
        const options = {
          pm25: "PM2.5",
          pm10: "PM10",
          filterLife: "滤芯寿命",
          filterLeftTime: "滤芯剩余时间",
          hcho: "甲醛",
          temperature: "温度",
          humidity: "湿度"
        };
        const list = [{
          role: "pm25",
          ids: [state?.roles?.pm25]
        }, {
          role: "pm10",
          ids: [state?.roles?.pm10]
        }, {
          role: "filterLife",
          ids: [state?.roles?.filterLife, state?.roles?.filterLeftTime]
        }, {
          role: "hcho",
          ids: [state?.roles?.hcho]
        }, {
          role: "temperature",
          ids: [state?.roles?.temperature]
        }, {
          role: "humidity",
          ids: [state?.roles?.humidity]
        }].map(arg => ({
          ...arg,
          ids: arg.ids.filter(Boolean)
        }));
        const computeResult = entityId => {
          const state = this.states.get(entityId);
          return state?.newState || state || null;
        };
        const callback = arg => {
          const numeric = computeResult(arg);
          return numeric && !["unknown", "unavailable"].includes(String(numeric.state || "").toLowerCase()) && Number.isFinite(Number(numeric.state));
        };
        const found = list.map(arg => ({
          ...arg,
          id: arg.ids.find(id => callback(id)) || arg.ids.find(id => this.entityMetadata.has(id))
        })).filter(airPurifierSecondaryMetricsEl => airPurifierSecondaryMetricsEl.id).slice(0, 3);
        const airPurifierSecondaryMetricsEl = document.createElement("div");
        airPurifierSecondaryMetricsEl.className = "hb-air-purifier-secondary-metrics hb-custom-air-purifier-metrics";
        for (const airPurifierSecondaryMetricEl of found) {
          const entry = this.entityMetadata.get(airPurifierSecondaryMetricEl.id);
          const element = document.createElement("div");
          element.className = "hb-air-purifier-secondary-metric hb-air-purifier-secondary-metric--" + airPurifierSecondaryMetricEl.role;
          const elementCurrent = document.createElement("small");
          elementCurrent.textContent = options[airPurifierSecondaryMetricEl.role] || airPurifierSecondaryMetricEl.role;
          const elementNext = document.createElement("strong");
          element.append(elementCurrent, elementNext);
          airPurifierSecondaryMetricsEl.append(element);
          const callback = entityState => {
            elementNext.textContent = ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase()) ? "--" : ((entityState?.state ?? "--") + " " + (entityState?.attributes?.unit_of_measurement || entry?.unitOfMeasurement || "")).trim();
          };
          callback(computeResult(airPurifierSecondaryMetricEl.id));
          runHelper(airPurifierSecondaryMetricEl.id, callback);
        }
        const airQuality = state?.roles?.airQuality;
        const pm = state?.roles?.pm25;
        const runHelperCurrent = () => {
          const state = computeResult(airQuality);
          const result = computeResult(pm);
          const trimmed = ["unknown", "unavailable"].includes(String(state?.state || "").toLowerCase()) ? "" : String(state?.state || "").trim();
          const numeric = Number(result?.state);
          const lowered = trimmed.toLowerCase();
          let localValue = trimmed;
          let text = "unknown";
          if (/excellent|优/.test(lowered)) {
            text = "excellent";
          } else if (/good|良/.test(lowered)) {
            text = "good";
          } else if (/moderate|fair|一般|轻度|污染/.test(lowered)) {
            text = "warning";
          } else if (/poor|unhealthy|较差|中度|重度|严重/.test(lowered)) {
            text = "poor";
          } else if (Number.isFinite(numeric)) {
            text = numeric <= 15 ? "excellent" : numeric <= 35 ? "good" : numeric <= 75 ? "warning" : "poor";
            localValue = {
              excellent: "空气优",
              good: "空气良",
              warning: "轻度污染",
              poor: "空气较差"
            }[text];
          }
          elementValue.textContent = localValue || "--";
          elementEntry.style.setProperty("--hb-air-purifier-progress", {
            excellent: 72,
            good: 58,
            warning: 42,
            poor: 26,
            unknown: 0
          }[text] + "%");
          elementEntry.classList.toggle("is-warning", text === "warning");
          elementEntry.classList.toggle("is-poor", text === "poor");
          const stateCurrent = {
            excellent: "#76cfa1",
            good: "#76cfa1",
            warning: "#e4b15f",
            poor: "#db7770",
            unknown: "#7d8990"
          }[text];
          const color = {
            excellent: "rgba(118,207,161,.13)",
            good: "rgba(118,207,161,.13)",
            warning: "rgba(228,177,95,.15)",
            poor: "rgba(219,119,112,.15)",
            unknown: "rgba(125,137,144,.13)"
          }[text];
          element.style.setProperty("--hb-air-purifier-accent", stateCurrent);
          element.style.setProperty("--hb-air-purifier-accent-soft", color);
        };
        if (airQuality) {
          runHelper(airQuality, runHelperCurrent);
        }
        if (pm && pm !== airQuality) {
          runHelper(pm, runHelperCurrent);
        }
        runHelperCurrent();
        const syncVisualState = (arg = airPurifierVisualEl) => {
          airPurifierVisualEl = arg || airPurifierVisualEl;
          const asString = String(airPurifierVisualEl?.state || "").toLowerCase();
          const state = ["unknown", "unavailable"].includes(asString);
          const stateCurrent = !state && asString !== "off";
          elementItem.textContent = stateCurrent ? "ON" : "OFF";
          elementLocal.classList.toggle("is-on", stateCurrent);
          elementLocal.classList.toggle("is-unavailable", state);
          elementLocal.setAttribute("aria-pressed", String(stateCurrent));
          elementLocal.setAttribute("aria-label", "" + elementNext.textContent + (stateCurrent ? "已开启，点击关闭" : "已关闭，点击开启"));
          elementPrevious.textContent = state ? "当前不可用" : stateCurrent ? "已开启" : "已关闭";
          elementPrevious.classList.toggle("is-live", stateCurrent);
          elementSource.textContent = state ? "设备不可用" : stateCurrent ? "净化中" : "已关闭";
          elementEntry.classList.toggle("is-running", stateCurrent);
          elementList.classList.toggle("is-running", stateCurrent);
          airPurifierLayoutEl.syncCapabilityState?.(airPurifierVisualEl);
        };
        syncVisualState();
        let showCustomPopupValue = false;
        elementLocal.addEventListener("click", async () => {
          if (preview || showCustomPopupValue || ["unknown", "unavailable"].includes(String(airPurifierVisualEl?.state || "").toLowerCase())) {
            return;
          }
          showCustomPopupValue = true;
          elementLocal.setAttribute("aria-busy", "true");
          const state = airPurifierVisualEl;
          const asString = String(state?.state || "").toLowerCase() === "off";
          syncVisualState({
            ...state,
            state: asString ? "on" : "off"
          });
          try {
            await this.callEntityService("fan", asString ? "turn_on" : "turn_off", entityId);
          } catch (error) {
            syncVisualState(state);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            elementLocal.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, syncVisualState);
        elementCurrent.append(elementLocal);
        airPurifierSummaryEl.append(airPurifierGaugeWrapEl, airPurifierSecondaryMetricsEl);
        airPurifierLayoutElCurrent.append(airPurifierSummaryEl, airPurifierControlsPaneEl);
        element.append(airPurifierLayoutElCurrent);
      } else if (options.type === "media-player") {
        elementNext.textContent = popupModuleDialogTitle(options, stateEntry, "媒体");
        element.classList.add("hb-media-player-details");
        const elementLocal = document.createElement("div");
        elementLocal.className = "hb-media-speaker-visual";
        elementLocal.setAttribute("aria-hidden", "true");
        stateCurrent.push(elementLocal);
        const mediaSpeakerBodyEl = document.createElement("i");
        mediaSpeakerBodyEl.className = "hb-media-speaker-body";
        const mediaSpeakerArtworkEl = document.createElement("img");
        mediaSpeakerArtworkEl.className = "hb-media-speaker-artwork";
        mediaSpeakerArtworkEl.alt = "";
        mediaSpeakerArtworkEl.hidden = true;
        const mediaSpeakerLightEl = document.createElement("i");
        mediaSpeakerLightEl.className = "hb-media-speaker-light";
        elementLocal.append(mediaSpeakerBodyEl, mediaSpeakerArtworkEl, mediaSpeakerLightEl);
        elementCurrent.append(elementLocal);
        const mediaPlayerDetailsBodyEl = document.createElement("div");
        mediaPlayerDetailsBodyEl.className = "hb-media-player-details-body hb-custom-media-player-body";
        const elementItem = document.createElement("section");
        elementItem.className = "hb-media-player-now-playing";
        const mediaPlayerArtworkEl = document.createElement("img");
        mediaPlayerArtworkEl.className = "hb-media-player-artwork";
        mediaPlayerArtworkEl.alt = "";
        mediaPlayerArtworkEl.hidden = true;
        const mediaPlayerCopyEl = document.createElement("div");
        mediaPlayerCopyEl.className = "hb-media-player-copy";
        const elementEntry = document.createElement("strong");
        const elementList = document.createElement("span");
        const mediaPlayerProgressEl = document.createElement("div");
        mediaPlayerProgressEl.className = "hb-media-player-progress";
        mediaPlayerProgressEl.hidden = true;
        const elementText = document.createElement("progress");
        elementText.max = 1;
        elementText.value = 0;
        const spanEl = document.createElement("span");
        const elementValue = document.createElement("time");
        const elementSource = document.createElement("time");
        spanEl.append(elementValue, elementSource);
        mediaPlayerProgressEl.append(elementText, spanEl);
        mediaPlayerCopyEl.append(elementEntry, elementList, mediaPlayerProgressEl);
        elementItem.append(mediaPlayerArtworkEl, mediaPlayerCopyEl);
        const mediaPlayerActionsEl = document.createElement("div");
        mediaPlayerActionsEl.className = "hb-media-player-actions";
        const buildElementTree = (arg, serviceName) => {
          const element = document.createElement("button");
          element.type = "button";
          element.textContent = arg;
          element.addEventListener("click", async () => {
            if (!preview) {
              element.disabled = true;
              try {
                await this.callEntityService("media_player", serviceName, entityId);
              } catch (error) {
                this.options.onError?.(error);
              } finally {
                element.disabled = false;
              }
            }
          });
          mediaPlayerActionsEl.append(element);
          return element;
        };
        const state = buildElementTree("上一曲", "media_previous_track");
        const tree = buildElementTree("播放", "media_play_pause");
        const capabilityRangeGroupEl = buildElementTree("下一曲", "media_next_track");
        const control = this.createMediaBrowserControl(entityId, {
          preview
        });
        list.push(() => control.cleanup?.());
        const capabilityRangeGroupElCurrent = document.createElement("section");
        capabilityRangeGroupElCurrent.className = "hb-capability-range-group";
        const capabilityRangeHeadingEl = document.createElement("div");
        capabilityRangeHeadingEl.className = "hb-capability-range-heading";
        const elementTarget = document.createElement("strong");
        elementTarget.textContent = "音量";
        const elementDefault = document.createElement("output");
        capabilityRangeHeadingEl.append(elementTarget, elementDefault);
        const elementFallback = document.createElement("input");
        elementFallback.type = "range";
        elementFallback.min = "0";
        elementFallback.max = "1";
        elementFallback.step = ".01";
        elementFallback.disabled = preview;
        capabilityRangeGroupElCurrent.append(capabilityRangeHeadingEl, elementFallback);
        let showCustomPopupValue = "";
        let showCustomPopupValueCurrent = null;
        let count = 0;
        let showCustomPopupValueNext = null;
        let flag = false;
        let showCustomPopupValuePrevious = null;
        let showCustomPopupValueLocal = null;
        let showCustomPopupValueItem = null;
        let statePrevious = null;
        let stateLocal = false;
        let stateItem = null;
        let stateList = null;
        const callback = arg => {
          const count = Math.max(0, Math.floor(Number(arg) || 0));
          return Math.floor(count / 60) + ":" + String(count % 60).padStart(2, "0");
        };
        const clampNumber = () => {
          if (!Number.isFinite(showCustomPopupValueCurrent) || showCustomPopupValueCurrent <= 0) {
            mediaPlayerProgressEl.hidden = true;
            return;
          }
          let finiteNumber = Number.isFinite(count) ? count : 0;
          if (flag && Number.isFinite(showCustomPopupValueNext)) {
            finiteNumber += Math.max(0, (Date.now() - showCustomPopupValueNext) / 1000);
          }
          finiteNumber = Math.max(0, Math.min(showCustomPopupValueCurrent, finiteNumber));
          mediaPlayerProgressEl.hidden = false;
          elementText.max = showCustomPopupValueCurrent;
          elementText.value = finiteNumber;
          elementValue.textContent = callback(finiteNumber);
          elementSource.textContent = callback(showCustomPopupValueCurrent);
        };
        const interval = window.setInterval(clampNumber, 1000);
        list.push(() => {
          window.clearInterval(interval);
          window.clearTimeout(stateItem);
          window.clearTimeout(stateList);
        });
        mediaPlayerArtworkEl.addEventListener("error", () => {
          mediaPlayerArtworkEl.hidden = true;
          elementItem.classList.remove("has-artwork");
        });
        mediaPlayerArtworkEl.addEventListener("load", () => {
          mediaPlayerArtworkEl.hidden = false;
          elementItem.classList.add("has-artwork");
        });
        mediaSpeakerArtworkEl.addEventListener("error", () => {
          mediaSpeakerArtworkEl.hidden = true;
          elementLocal.classList.remove("has-artwork");
        });
        mediaSpeakerArtworkEl.addEventListener("load", () => {
          mediaSpeakerArtworkEl.hidden = false;
          elementLocal.classList.add("has-artwork");
        });
        const runHelperCurrent = (arg, right) => Number.isFinite(arg) && Number.isFinite(right) && Math.abs(arg - right) <= 0.005;
        const clampNumberCurrent = arg => {
          showCustomPopupValuePrevious = Math.max(0, Math.min(1, Number(arg) || 0));
          elementFallback.value = String(showCustomPopupValuePrevious);
          elementDefault.textContent = Math.round(showCustomPopupValuePrevious * 100) + "%";
        };
        const stateText = async () => {
          window.clearTimeout(stateItem);
          stateItem = null;
          if (stateLocal || statePrevious === null) {
            return;
          }
          const volume_level = statePrevious;
          statePrevious = null;
          stateLocal = true;
          try {
            await this.callEntityService("media_player", "volume_set", entityId, {
              volume_level
            });
          } catch (error) {
            statePrevious = null;
            showCustomPopupValueItem = null;
            window.clearTimeout(stateList);
            if (showCustomPopupValueLocal !== null) {
              clampNumberCurrent(showCustomPopupValueLocal);
            }
            this.options.onError?.(error);
          } finally {
            stateLocal = false;
            if (statePrevious !== null && !runHelperCurrent(statePrevious, volume_level)) {
              stateItem = window.setTimeout(stateText, 140);
            }
          }
        };
        const clamped = () => {
          const count = Math.max(0, Math.min(1, Number(elementFallback.value) || 0));
          showCustomPopupValueItem = count;
          statePrevious = count;
          window.clearTimeout(stateList);
          if (!stateLocal) {
            window.clearTimeout(stateItem);
            stateItem = window.setTimeout(stateText, 120);
          }
        };
        elementFallback.addEventListener("input", () => clampNumberCurrent(elementFallback.value));
        elementFallback.addEventListener("change", clamped);
        const syncVisualState = entityState => {
          const options = entityState?.attributes || {};
          const asString = String(entityState?.state || "unknown").toLowerCase();
          const numeric = Number(options.supported_features || 0);
          control.sync(entityState);
          const stateCurrent = {
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
          elementPrevious.textContent = stateCurrent[asString] || entityState?.state || "未知状态";
          elementPrevious.classList.toggle("is-live", ["playing", "paused"].includes(asString));
          elementEntry.textContent = options.media_title || options.media_series_title || options.app_name || options.source || "暂无播放内容";
          elementList.textContent = [options.media_artist, options.media_album_name].filter(Boolean).join(" · ") || options.media_content_type || "媒体播放器";
          tree.textContent = asString === "playing" ? "暂停" : "播放";
          tree.disabled = preview || ["off", "unavailable", "unknown"].includes(asString);
          state.disabled = preview || !(numeric & 16);
          capabilityRangeGroupEl.disabled = preview || !(numeric & 32);
          elementLocal.classList.toggle("is-playing", asString === "playing");
          elementLocal.classList.toggle("is-paused", asString === "paused");
          elementLocal.classList.toggle("is-off", ["off", "unavailable", "unknown"].includes(asString));
          showCustomPopupValueCurrent = Number.isFinite(Number(options.media_duration)) ? Number(options.media_duration) : null;
          count = Number.isFinite(Number(options.media_position)) ? Number(options.media_position) : 0;
          const position = Date.parse(String(options.media_position_updated_at || ""));
          showCustomPopupValueNext = Number.isFinite(position) ? position : null;
          flag = asString === "playing";
          clampNumber();
          const number = Number(options.volume_level);
          capabilityRangeGroupElCurrent.hidden = !Number.isFinite(number);
          if (Number.isFinite(number)) {
            if (showCustomPopupValueItem === null) {
              showCustomPopupValueLocal = number;
              clampNumberCurrent(number);
            } else if (runHelperCurrent(number, showCustomPopupValueItem)) {
              showCustomPopupValueLocal = number;
              clampNumberCurrent(showCustomPopupValueItem);
              window.clearTimeout(stateList);
              stateList = window.setTimeout(() => {
                showCustomPopupValueItem = null;
              }, 1800);
            } else {
              window.clearTimeout(stateList);
            }
          }
          const trimmed = [options.entity_picture_local, options.entity_picture, options.media_image_url].map(arg => String(arg || "").trim()).find(climateFanAutoEl => climateFanAutoEl.startsWith("/api/media_player_proxy/") || climateFanAutoEl.startsWith("/api/image_proxy/")) || "";
          if (trimmed !== showCustomPopupValue) {
            showCustomPopupValue = trimmed;
            mediaPlayerArtworkEl.hidden = !showCustomPopupValue;
            mediaSpeakerArtworkEl.hidden = !showCustomPopupValue;
            elementItem.classList.toggle("has-artwork", !!showCustomPopupValue);
            elementLocal.classList.toggle("has-artwork", !!showCustomPopupValue);
            if (showCustomPopupValue) {
              mediaPlayerArtworkEl.src = showCustomPopupValue;
              mediaSpeakerArtworkEl.src = showCustomPopupValue;
            } else {
              mediaPlayerArtworkEl.removeAttribute("src");
              mediaSpeakerArtworkEl.removeAttribute("src");
            }
          }
        };
        elementItem.append(control.root);
        syncVisualState(stateEntry);
        runHelper(entityId, syncVisualState);
        mediaPlayerDetailsBodyEl.append(elementItem, mediaPlayerActionsEl, capabilityRangeGroupElCurrent);
        stateNext.push(control.panel);
        element.append(mediaPlayerDetailsBodyEl);
      } else {
        const elementCurrent = document.createElement("p");
        elementCurrent.className = "hb-custom-popup-generic";
        const callback = arg => {
          elementCurrent.textContent = "当前状态：" + (arg?.state ?? "暂无状态");
        };
        callback(stateEntry);
        runHelper(entityId, callback);
        element.append(elementCurrent);
      }
      customPopupGridEl.append(element);
    }
    if (!(popupId.modules || []).length) {
      const element = document.createElement("p");
      element.className = "hb-custom-popup-generic";
      element.textContent = "这个组合弹窗还没有添加模块。";
      customPopupGridEl.append(element);
    }
    customPopupCardEl.append(customPopupHeadingEl, customPopupGridEl, ...stateNext);
    customPopupDialogEl.append(customPopupCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(customPopupDialogEl);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = customPopupDialogEl;
    const callback = arg => arg.map(candidate => {
      const state = candidate.type === "electric-bed" ? this.deviceProfile(this.runtimeEntityId(candidate.entityId)) : null;
      const roles = state?.deviceType === "electric-bed" ? state.roles || {} : {};
      return [candidate.id, state?.deviceType || candidate.type || "generic", "backrest", "leg", "waist", "mode", "memory1", "memory2"].map(candidate => String(candidate === candidate.id ? candidate.id : roles[candidate] || "")).join(":");
    }).join("|");
    const helper = callback(state);
    this.detailsStateSync = {
      customPopupDialogEl,
      handlers,
      refreshHistory: () => stateLocal.forEach(refreshHistory => refreshHistory()),
      refreshEntityCatalog: () => {
        if (this.detailsDialog === customPopupDialogEl && !!customPopupDialogEl.open) {
          if (callback(state) !== helper) {
            this.showCustomPopup(popupId, {
              preview
            });
          }
        }
      }
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, customPopupDialogEl, popupWidth, popupHeight);
    elementCurrent.addEventListener("click", () => customPopupDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, customPopupDialogEl, customPopupCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        customPopupDialogEl.close();
      }
    });
    customPopupDialogEl.addEventListener("close", () => {
      for (const runHelper of list.splice(0)) {
        runHelper();
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
    for (const item of stateCurrent) {
      const state = playMediaSpeakerEntrance(item);
      if (state) {
        list.push(() => state.cancel());
      }
    }
    for (const item of statePrevious) {
      const state = playFixedDeviceDropEntrance(item.visual, item);
      if (state) {
        list.push(() => state.cancel());
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
      colorTemperature: capabilities
    } = lightRealtimeCapabilities(entityId, component);
    const lightDetailsControlsElCurrent = capabilities && !lightDetailsControlsEl;
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
      supported: supported = true
    }) => {
      const elementCurrent = document.createElement("label");
      elementCurrent.className = ("hb-light-details-slider " + className).trim();
      elementCurrent.classList.toggle("is-unavailable", !supported);
      const lightDetailsSliderHeadingEl = document.createElement("span");
      lightDetailsSliderHeadingEl.className = "hb-light-details-slider-heading";
      const elementNext = document.createElement("i");
      elementNext.className = "hb-light-details-slider-icon";
      elementNext.setAttribute("aria-hidden", "true");
      elementNext.textContent = icon;
      const elementPrevious = document.createElement("strong");
      elementPrevious.textContent = label;
      const elementLocal = document.createElement("output");
      const count = Math.max(minimum, Math.min(maximum, value));
      elementLocal.textContent = "" + Math.round(count) + suffix;
      lightDetailsSliderHeadingEl.append(elementNext, elementPrevious, elementLocal);
      const controlInputEl = document.createElement("input");
      controlInputEl.type = "range";
      controlInputEl.min = String(minimum);
      controlInputEl.max = String(maximum);
      controlInputEl.step = String(step);
      controlInputEl.value = String(count);
      controlInputEl.disabled = !supported;
      const updateSliderValue = ({
        notify = false
      } = {}) => {
        const brightnessPercent = Number(controlInputEl.value);
        const brightness = (brightnessPercent - minimum) / Math.max(1, maximum - minimum) * 100;
        elementLocal.textContent = supported ? "" + Math.round(brightnessPercent) + suffix : "不支持";
        controlInputEl.style.setProperty("--hb-light-slider-progress", Math.max(0, Math.min(100, brightness)) + "%");
        if (notify && supported) {
          onVisualChange?.(dataKey === "brightness_pct" ? {
            brightnessPercent
          } : {
            colorTemperatureKelvin: brightnessPercent
          });
        }
      };
      updateSliderValue();
      controlInputEl.addEventListener("input", () => {
        scheduleTimeout();
        updateSliderValue({
          notify: true
        });
      });
      controlInputEl.addEventListener("change", async () => {
        if (!!interactive && !!supported) {
          try {
            await this.callEntityService("light", "turn_on", entityId, {
              [dataKey]: Number(controlInputEl.value)
            });
            onTurnOn?.();
          } catch (error) {
            this.options.onError?.(error);
            elementLocal.textContent = "设置失败";
          }
        }
      });
      const lightDetailsSliderLegendEl = document.createElement("span");
      lightDetailsSliderLegendEl.className = "hb-light-details-slider-legend";
      const elementItem = document.createElement("small");
      elementItem.textContent = minimumLabel;
      const elementEntry = document.createElement("small");
      elementEntry.textContent = maximumLabel;
      lightDetailsSliderLegendEl.append(elementItem, elementEntry);
      elementCurrent.append(lightDetailsSliderHeadingEl, controlInputEl, lightDetailsSliderLegendEl);
      element.append(elementCurrent);
      index.set(dataKey, {
        controlInputEl,
        updateSliderValue,
        supported: supported
      });
    };
    let elementCurrent = null;
    let color = null;
    let flag = false;
    if (lightDetailsControlsEl) {
      const list = Array.isArray(numeric.hs_color) ? numeric.hs_color : rgbToHsColor(numeric.rgb_color) || [0, 100];
      color = {
        hue: Number(list[0]) || 0,
        saturation: Number(list[1]) || 0
      };
      elementCurrent = document.createElement("div");
      elementCurrent.className = "hb-light-color-picker";
      elementCurrent.setAttribute("role", "slider");
      elementCurrent.setAttribute("tabindex", interactive ? "0" : "-1");
      elementCurrent.setAttribute("aria-label", "选择灯光颜色");
      const lightColorPickerGlowEl = document.createElement("i");
      lightColorPickerGlowEl.className = "hb-light-color-picker-glow";
      const lightColorPickerHandleEl = document.createElement("i");
      lightColorPickerHandleEl.className = "hb-light-color-picker-handle";
      elementCurrent.append(lightColorPickerGlowEl, lightColorPickerHandleEl);
      const runHelper = () => lightColorPickerPointFromHs([color.hue, color.saturation]);
      const syncAriaState = ({
        hue = color.hue,
        saturation = color.saturation
      } = {}) => {
        color.hue = ((Number(hue) || 0) % 360 + 360) % 360;
        color.saturation = Math.max(0, Math.min(100, Number(saturation) || 0));
        const point = runHelper();
        const colorRgb = hsToRgbColor([color.hue, color.saturation]);
        const value = "rgb(" + colorRgb.join(",") + ")";
        elementCurrent.style.setProperty("--hb-light-color-picker-x", point.x * 100 + "%");
        elementCurrent.style.setProperty("--hb-light-color-picker-y", point.y * 100 + "%");
        elementCurrent.style.setProperty("--hb-light-color-picker-color", value);
        elementCurrent.setAttribute("aria-valuetext", "色相 " + Math.round(color.hue) + " 度，饱和度 " + Math.round(color.saturation) + "%");
        onVisualChange?.({
          colorHs: [color.hue, color.saturation],
          colorRgb
        });
      };
      const measureElementBox = event => {
        const domRect = elementCurrent.getBoundingClientRect();
        if (!domRect.width || !domRect.height) {
          return;
        }
        const count = Math.max(0, Math.min(1, (event.clientX - domRect.left) / domRect.width));
        const max = Math.max(0, Math.min(1, (event.clientY - domRect.top) / domRect.height));
        const [hue, saturation] = lightColorPickerHsFromPoint(count, max);
        syncAriaState({
          hue,
          saturation
        });
      };
      const callback = async () => {
        if (!!interactive && !flag) {
          flag = true;
          elementCurrent.setAttribute("aria-busy", "true");
          try {
            await this.callEntityService("light", "turn_on", entityId, lightColorServiceData(numeric, [color.hue, color.saturation]));
            onTurnOn?.();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            flag = false;
            elementCurrent.removeAttribute("aria-busy");
          }
        }
      };
      elementCurrent.addEventListener("pointerdown", event => {
        if (interactive) {
          elementCurrent.setPointerCapture?.(event.pointerId);
          elementCurrent.dataset.dragging = "true";
          measureElementBox(event);
          event.preventDefault();
        }
      });
      elementCurrent.addEventListener("pointermove", arg => {
        if (elementCurrent.dataset.dragging === "true") {
          measureElementBox(arg);
        }
      });
      const state = async event => {
        if (elementCurrent.dataset.dragging === "true") {
          elementCurrent.dataset.dragging = "false";
          elementCurrent.releasePointerCapture?.(event.pointerId);
          await callback();
        }
      };
      elementCurrent.addEventListener("pointerup", state);
      elementCurrent.addEventListener("pointercancel", state);
      elementCurrent.addEventListener("keydown", async event => {
        if (!interactive) {
          return;
        }
        const count = event.shiftKey ? 10 : 3;
        let {
          hue,
          saturation
        } = color;
        if (event.key === "ArrowLeft") {
          hue -= count;
        } else if (event.key === "ArrowRight") {
          hue += count;
        } else if (event.key === "ArrowUp") {
          saturation -= count;
        } else if (event.key === "ArrowDown") {
          saturation += count;
        } else if (event.key === "Enter" || event.key === " ") {
          await callback();
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
      elementCurrent.syncColorPicker = syncAriaState;
      elementCurrent.cleanupColorPicker = () => {
        elementCurrent.dataset.dragging = "false";
      };
      syncAriaState();
      element.append(elementCurrent);
    }
    const finiteNumber = Number.isFinite(Number(numeric.max_mireds)) ? 1000000 / Number(numeric.max_mireds) : 2000;
    const value = Number.isFinite(Number(numeric.min_mireds)) ? 1000000 / Number(numeric.min_mireds) : 6500;
    const asNumber = Number(numeric.min_color_temp_kelvin) || finiteNumber;
    const number = Number(numeric.max_color_temp_kelvin) || value;
    const finiteNumberCurrent = Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : asNumber;
    const asNumberCurrent = Number(numeric.color_temp_kelvin) || finiteNumberCurrent;
    if (!lightDetailsControlsEl) {
      syncVisualState({
        label: "色温",
        value: asNumberCurrent,
        minimum: Math.round(asNumber),
        maximum: Math.round(number),
        step: 50,
        suffix: "K",
        dataKey: "color_temp_kelvin",
        className: "hb-light-details-temperature",
        icon: "♨",
        minimumLabel: "暖色",
        maximumLabel: "冷色",
        supported: capabilities
      });
    }
    const finiteNumberNext = Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : 100;
    syncVisualState({
      label: "亮度",
      value: finiteNumberNext,
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
    let count = 0;
    let stateCurrent = component;
    const scheduleTimeout = ({
      resync = false
    } = {}) => {
      window.clearTimeout(count);
      count = 0;
      state = null;
      if (resync) {
        element.syncLightState?.(stateCurrent);
      }
    };
    const callback = () => {
      window.clearTimeout(count);
      count = 0;
      if (!state) {
        return;
      }
      const nowMs = Date.now();
      const decision = lightPresetPendingDecision(state, nowMs);
      if (decision === "confirmed" || decision === "timeout") {
        scheduleTimeout({
          resync: true
        });
        return;
      }
      const clamped = state.latestMatches ? Math.min(state.expiresAt, Math.max(state.minimumHoldUntil, state.matchStartedAt + LIGHT_PRESET_STABLE_CONFIRMATION_MS)) : state.expiresAt;
      count = window.setTimeout(callback, Math.max(50, clamped - nowMs));
    };
    const lightDetailsPresetsEl = LIGHT_DETAIL_PRESET_DEFINITIONS;
    const runHelper = lightDetailsPresetsEl => relativeLightColorTemperature(asNumber, number, lightDetailsPresetsEl.colorTemperaturePercent);
    const lightDetailsPresetsElCurrent = document.createElement("div");
    lightDetailsPresetsElCurrent.className = "hb-light-details-presets";
    lightDetailsPresetsElCurrent.hidden = lightDetailsControlsEl || !supported && !lightDetailsControlsElCurrent;
    const event = lightDetailsPresetsEl.map(arg => {
      const actionButtonEl = document.createElement("button");
      actionButtonEl.type = "button";
      actionButtonEl.disabled = !brightness;
      const element = document.createElement("strong");
      element.textContent = arg.label;
      const elementCurrent = document.createElement("small");
      elementCurrent.textContent = supported ? arg.detail : "开启";
      actionButtonEl.append(element, elementCurrent);
      actionButtonEl.addEventListener("click", async () => {
        if (!interactive || !brightness) {
          return;
        }
        const colorTemperatureKelvin = runHelper(arg);
        const size = {};
        if (supported) {
          Object.assign(size, lightPresetBrightnessServiceData(arg.brightnessPercent));
        }
        if (lightDetailsControlsElCurrent) {
          size.color_temp_kelvin = Math.round(colorTemperatureKelvin);
        }
        window.clearTimeout(count);
        const nowMs = Date.now();
        state = {
          brightnessPercent: arg.brightnessPercent,
          colorTemperatureKelvin,
          minimumHoldUntil: nowMs + LIGHT_PRESET_MINIMUM_HOLD_MS,
          expiresAt: nowMs + LIGHT_PRESET_MAXIMUM_HOLD_MS,
          latestMatches: false,
          matchStartedAt: null
        };
        callback();
        const entry = index.get("brightness_pct");
        if (entry?.supported) {
          entry.input.value = String(arg.brightnessPercent);
          entry.updateSliderValue({
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
        for (const eventCurrent of event) {
          eventCurrent.button.classList.toggle("is-active", eventCurrent.button === actionButtonEl);
        }
        onVisualChange?.({
          isOn: true,
          ...(supported ? {
            brightnessPercent: arg.brightnessPercent
          } : {}),
          ...(lightDetailsControlsElCurrent ? {
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
      lightDetailsPresetsElCurrent.append(actionButtonEl);
      return {
        actionButtonEl,
        ...arg
      };
    });
    element.append(lightDetailsPresetsElCurrent);
    const syncLightControl = entityState => {
      const numeric = entityState?.attributes || {};
      const brightness = entityState?.state === "on";
      const finiteNumber = Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : NaN;
      const value = Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : NaN;
      const eventCurrent = Number(numeric.color_temp_kelvin) || value;
      for (const eventNext of event) {
        const event = runHelper(eventNext);
        const count = Math.max(50, (number - asNumber) * 0.06);
        const finiteNumberCurrent = !supported || Number.isFinite(finiteNumber) && Math.abs(finiteNumber - eventNext.brightnessPercent) <= 4;
        const finiteNumberNext = !lightDetailsControlsElCurrent || Number.isFinite(eventCurrent) && Math.abs(eventCurrent - event) <= count;
        eventNext.button.classList.toggle("is-active", brightness && finiteNumberCurrent && finiteNumberNext);
      }
    };
    syncLightControl(component);
    element.syncLightState = entityState => {
      if (!entityState) {
        return;
      }
      stateCurrent = entityState;
      const numeric = entityState.attributes || {};
      const temperature = index.get("color_temp_kelvin");
      const finiteNumber = Number.isFinite(Number(numeric.color_temp)) ? 1000000 / Number(numeric.color_temp) : NaN;
      const asNumber = Number(numeric.color_temp_kelvin) || finiteNumber;
      const brightness = index.get("brightness_pct");
      const value = Number.isFinite(Number(numeric.brightness)) ? Number(numeric.brightness) / 255 * 100 : NaN;
      if (state) {
        const finiteNumber = !supported || Number.isFinite(value) && Math.abs(value - state.brightnessPercent) <= 4;
        const finiteNumberCurrent = !lightDetailsControlsElCurrent || Number.isFinite(asNumber) && Math.abs(asNumber - state.colorTemperatureKelvin) <= 220;
        const stateCurrent = finiteNumber && finiteNumberCurrent;
        if (stateCurrent && !state.latestMatches) {
          state.matchStartedAt = Date.now();
        }
        if (!stateCurrent) {
          state.matchStartedAt = null;
        }
        state.latestMatches = stateCurrent;
        callback();
      }
      const brightnessCurrent = state?.colorTemperatureKelvin ?? asNumber;
      const brightnessNext = state?.brightnessPercent ?? value;
      if (temperature?.supported && Number.isFinite(brightnessCurrent)) {
        temperature.input.value = String(brightnessCurrent);
        temperature.updateSliderValue();
      }
      if (brightness?.supported && Number.isFinite(brightnessNext)) {
        brightness.input.value = String(brightnessNext);
        brightness.updateSliderValue();
      }
      if (elementCurrent) {
        const list = Array.isArray(numeric.hs_color) ? numeric.hs_color : rgbToHsColor(numeric.rgb_color);
        if (list) {
          elementCurrent.syncColorPicker({
            hue: list[0],
            saturation: list[1]
          });
        }
      }
      syncLightControl(state ? {
        state: "on",
        attributes: {
          ...numeric,
          ...(supported ? {
            brightness: state.brightnessPercent / 100 * 255
          } : {}),
          ...(lightDetailsControlsElCurrent ? {
            color_temp_kelvin: state.colorTemperatureKelvin
          } : {})
        }
      } : entityState);
      const colorTemperatureKelvin = lightVisualValueForCapability(lightDetailsControlsElCurrent, brightnessCurrent, UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN);
      const brightnessPercent = lightVisualValueForCapability(supported, brightnessNext, UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT);
      onVisualChange?.({
        isOn: entityState.state === "on",
        colorTemperatureKelvin,
        brightnessPercent
      });
    };
    element.syncLightState(component);
    element.cleanupLightDetails = () => {
      scheduleTimeout();
      elementCurrent?.cleanupColorPicker?.();
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
    const elementCurrent = document.createElement("output");
    coverDetailsPositionHeadingEl.append(element, elementCurrent);
    const elementNext = document.createElement("input");
    elementNext.type = "range";
    elementNext.min = "0";
    elementNext.max = "100";
    elementNext.step = "1";
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
    coverDetailsPositionEl.append(coverDetailsPositionHeadingEl, elementNext, coverDetailsPositionLegendEl);
    const coverDetailsActionsEl = document.createElement("div");
    coverDetailsActionsEl.className = "hb-cover-details-actions";
    const size = "open_cover";
    const service = "stop_cover";
    const sizeCurrent = "close_cover";
    const serviceCurrent = motorReversed ? size : sizeCurrent;
    const serviceNext = motorReversed ? sizeCurrent : size;
    let retracted = dreamCurtainIsRetracted(component?.state, motorReversed);
    const state = (dream ? [{
      label: "关闭",
      icon: "←",
      service: serviceCurrent,
      curtainRetracted: false
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service
    }, {
      label: "开启",
      icon: "→",
      service: serviceNext,
      curtainRetracted: true
    }] : airer ? [{
      label: "下降",
      icon: "↓",
      service: serviceCurrent,
      action: "down"
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service,
      action: "pause"
    }, {
      label: "升起",
      icon: "↑",
      service: serviceNext,
      action: "up"
    }] : [{
      label: "关闭",
      icon: "←",
      service: serviceCurrent
    }, {
      label: "暂停",
      icon: "Ⅱ",
      service
    }, {
      label: "打开",
      icon: "→",
      service: serviceNext
    }]).map(arg => {
      const element = document.createElement("button");
      element.type = "button";
      element.dataset.coverAction = arg.service;
      const elementCurrent = document.createElement("i");
      elementCurrent.textContent = arg.icon;
      elementCurrent.setAttribute("aria-hidden", "true");
      const elementNext = document.createElement("strong");
      elementNext.textContent = arg.label;
      element.append(elementCurrent, elementNext);
      element.addEventListener("click", async () => {
        if (interactive) {
          if (dream && typeof arg.curtainRetracted == "boolean") {
            coverDetailsControlsEl.beginDreamCurtainMotion?.(arg.curtainRetracted);
          }
          if (!dream && arg.service === serviceNext) {
            coverDetailsControlsEl.beginCoverMotion?.(100, "opening");
          } else if (!dream && arg.service === serviceCurrent) {
            coverDetailsControlsEl.beginCoverMotion?.(0, "closing");
          } else {
            coverDetailsControlsEl.stopCoverMotion?.();
          }
          element.classList.add("is-pending");
          try {
            const state = airer && arg.action ? airerActionEntityIds[arg.action] : "";
            if (airer && positionCommandEntityId && ["up", "down"].includes(arg.action)) {
              const state = arg.action === "up" ? 100 : 0;
              const position = airerDevicePosition(state, positionCalibration);
              await this.callEntityService("number", "set_value", positionCommandEntityId, {
                value: position
              });
            } else if (airer && arg.action === "pause") {
              await this.callEntityService("cover", service, entityId);
            } else if (state) {
              await this.callEntityService("button", "press", state);
            } else {
              await this.callEntityService("cover", arg.service, entityId);
            }
          } catch (error) {
            coverDetailsControlsEl.cancelDreamCurtainMotion?.();
            coverDetailsControlsEl.cancelCoverMotion?.();
            coverDetailsControlsEl.syncCoverState?.(component);
            this.options.onError?.(error);
          } finally {
            element.classList.remove("is-pending");
          }
        }
      });
      coverDetailsActionsEl.append(element);
      return element;
    });
    let stateCurrent = positionState;
    let stateNext = positionCommandState;
    let numeric = motorState;
    const runHelper = () => {
      if (airer) {
        learnAirerPositionCalibration(positionCalibration, stateCurrent?.state, stateNext?.state, numeric?.state);
      }
    };
    runHelper();
    let text = String(component?.state || "");
    const resolveCoverPosition = entityState => {
      const state = airer ? airerReportedPosition(stateCurrent, entityState, positionCalibration) : Number(entityState?.attributes?.[tilt ? "current_tilt_position" : "current_position"]);
      if (Number.isFinite(state)) {
        const count = Math.max(0, Math.min(100, state));
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
    let positionCurrent = component;
    let positionNext = resolveCoverPosition(component);
    let position = positionNext;
    let flag = false;
    let statePrevious = 0;
    let stateLocal = null;
    let stateItem = null;
    let stateEntry = 0;
    let event = null;
    const callback = () => {
      window.cancelAnimationFrame(statePrevious);
      statePrevious = 0;
    };
    const syncVisualState = (arg, state = "") => {
      position = Math.max(0, Math.min(100, Number(arg) || 0));
      elementNext.value = String(position);
      elementNext.style.setProperty("--hb-cover-position-progress", position + "%");
      elementCurrent.textContent = Math.round(position) + "%";
      for (const element of state) {
        element.classList.toggle("is-active", element.dataset.coverAction === (state === "opening" ? size : state === "closing" ? sizeCurrent : ""));
      }
      onVisualChange?.({
        position,
        state
      });
    };
    coverDetailsControlsEl.setDreamCurtainRetracted = (arg, flag = false) => {
      if (dream) {
        retracted = !!arg;
        elementNext.disabled = !interactive;
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
      callback();
      stateItem = null;
      stateEntry = 0;
      const initialPosition = position;
      const target = Math.max(0, Math.min(100, Number(arg) || 0));
      stateLocal = {
        direction: target >= initialPosition ? 1 : -1,
        target,
        state,
        initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (airer ? 120000 : 10000)
      };
      const now = performance.now();
      const count = Math.max(900, Math.abs(target - initialPosition) * 28);
      const stateCurrent = item => {
        const min = Math.min(1, (item - now) / count);
        const value = 1 - (1 - min) ** 3;
        syncVisualState(initialPosition + (target - initialPosition) * value, state);
        if (min < 1) {
          statePrevious = window.requestAnimationFrame(stateCurrent);
        } else {
          statePrevious = 0;
        }
      };
      syncVisualState(initialPosition, state);
      statePrevious = window.requestAnimationFrame(stateCurrent);
    };
    coverDetailsControlsEl.stopCoverMotion = () => {
      callback();
      stateLocal = null;
      syncVisualState(position, "");
    };
    coverDetailsControlsEl.cancelCoverMotion = () => {
      callback();
      stateLocal = null;
    };
    coverDetailsControlsEl.holdCoverPosition = arg => {
      callback();
      stateItem = null;
      stateEntry = 0;
      const target = Math.max(0, Math.min(100, Number(arg) || 0));
      const initialPosition = positionNext;
      const direction = target >= initialPosition ? 1 : -1;
      const state = dream || Math.abs(target - initialPosition) < 0.5 ? "" : direction > 0 ? "opening" : "closing";
      stateLocal = {
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
    const runHelperCurrent = (arg, {
      primary = false
    } = {}) => {
      if (primary) {
        positionCurrent = arg || positionCurrent;
        text = String(arg?.state || text);
      }
      if (stateItem !== null && Date.now() >= stateEntry) {
        stateItem = null;
        stateEntry = 0;
      }
      const state = airer && stateItem !== null ? stateItem : resolveCoverPosition(arg);
      positionNext = state;
      const string = String(arg?.state || "");
      if (dream) {
        const physicalState = physicalCoverState(string, motorReversed);
        const retracted = dreamCurtainIsRetracted(string, motorReversed);
        if (event && retracted === event.target) {
          const target = event.target;
          event = null;
          coverDetailsControlsEl.setDreamCurtainRetracted?.(target, false);
        } else if (event && Date.now() < event.expiresAt) {
          coverDetailsControlsEl.setDreamCurtainRetracted?.(event.target, true);
        } else {
          event = null;
          coverDetailsControlsEl.setDreamCurtainRetracted?.(retracted, physicalState === "opening" || physicalState === "closing");
        }
      }
      if (!flag) {
        if (stateLocal) {
          const nowMs = Date.now();
          const {
            direction,
            target,
            state: stateCurrent
          } = stateLocal;
          const stateNext = coverPositionReachedTarget(state, target, direction);
          const value = target <= 0.5 && string === "closed" || target >= 99.5 && string === "open";
          const numericState = Number(numeric?.state);
          const finiteNumber = airer && stateLocal.sawMotorRunning && Number.isFinite(numericState) && Math.abs(numericState) < 0.5;
          if (airer ? value || finiteNumber && stateNext : stateNext || value || target >= 99.5 && state >= 99.5) {
            callback();
            if (airer) {
              stateItem = target;
              stateEntry = Date.now() + 120000;
            }
            stateLocal = null;
            syncVisualState(target, string || (direction < 0 ? "closed" : "open"));
            return;
          }
          if (direction < 0 ? state < stateLocal.lastServerPosition - 0.5 || string === "closing" : state > stateLocal.lastServerPosition + 0.5 || string === "opening") {
            stateLocal.lastServerPosition = direction < 0 ? Math.min(stateLocal.lastServerPosition, state) : Math.max(stateLocal.lastServerPosition, state);
            const positionCurrent = coverPendingDisplayPosition(position, state, direction);
            syncVisualState(positionCurrent, stateCurrent);
            return;
          }
          if (nowMs < stateLocal.ignoreStaleUntil || airer && nowMs < stateLocal.expiresAt || nowMs < stateLocal.expiresAt && Math.abs(state - stateLocal.initialPosition) < 0.5) {
            return;
          }
          callback();
          stateLocal = null;
        } else {
          callback();
        }
        syncVisualState(state, string);
      }
    };
    elementNext.addEventListener("pointerdown", () => {
      flag = true;
      callback();
      stateLocal = null;
    });
    elementNext.addEventListener("input", () => {
      flag = true;
      callback();
      stateLocal = null;
      const numeric = Number(elementNext.value);
      syncVisualState(numeric, dream ? "" : numeric > 0 ? "open" : "closed");
    });
    elementNext.addEventListener("change", async () => {
      flag = false;
      if (!interactive) {
        return;
      }
      const numeric = Number(elementNext.value);
      const state = airerDevicePosition(numeric, positionCalibration);
      coverDetailsControlsEl.holdCoverPosition(numeric);
      try {
        if (airer && positionCommandEntityId) {
          await this.callEntityService("number", "set_value", positionCommandEntityId, {
            value: state
          });
        } else {
          await this.callEntityService("cover", tilt ? "set_cover_tilt_position" : "set_cover_position", entityId, {
            [tilt ? "tilt_position" : "position"]: numeric
          });
        }
      } catch (error) {
        coverDetailsControlsEl.cancelCoverMotion();
        runHelperCurrent(positionCurrent);
        this.options.onError?.(error);
      }
    });
    elementNext.addEventListener("pointercancel", () => {
      flag = false;
      runHelperCurrent(positionCurrent);
    });
    coverDetailsControlsEl.append(coverDetailsPositionEl, coverDetailsActionsEl);
    coverDetailsControlsEl.syncCoverState = arg => runHelperCurrent(arg, {
      primary: true
    });
    coverDetailsControlsEl.syncCoverPositionState = arg => {
      stateCurrent = arg || stateCurrent;
      runHelper();
      runHelperCurrent(positionCurrent);
    };
    coverDetailsControlsEl.syncCoverPositionCommandState = arg => {
      stateNext = arg || stateNext;
      runHelper();
      runHelperCurrent(positionCurrent);
    };
    coverDetailsControlsEl.syncAirerMotorState = arg => {
      numeric = arg || numeric;
      const motorState = Number(numeric?.state);
      if (stateLocal && Number.isFinite(motorState) && Math.abs(motorState) >= 0.5) {
        stateLocal.sawMotorRunning = true;
      }
      runHelper();
      runHelperCurrent(positionCurrent);
    };
    coverDetailsControlsEl.cleanupCoverDetails = () => {
      callback();
      stateLocal = null;
      event = null;
      flag = false;
    };
    runHelperCurrent(component, {
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
    const options = {
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
    const value = climateDetailsControlsEl === "water_heater";
    element.classList.toggle("without-temperature", !temperature);
    let previous = temperature ? targetTemperature : minimumTemperature;
    let state = null;
    let stateCurrent = null;
    let stateNext = null;
    const scheduleTimeout = () => {
      state = null;
      window.clearTimeout(stateCurrent);
      window.clearTimeout(stateNext);
      stateCurrent = null;
      stateNext = null;
    };
    const callback = arg => {
      state = arg;
      window.clearTimeout(stateCurrent);
      window.clearTimeout(stateNext);
      stateNext = null;
      stateCurrent = window.setTimeout(() => {
        state = null;
        stateCurrent = null;
      }, 8000);
    };
    const scheduleTimeoutCurrent = () => {
      window.clearTimeout(stateNext);
      stateNext = window.setTimeout(scheduleTimeout, 2500);
    };
    const climateThermostatEl = document.createElement("section");
    climateThermostatEl.className = "hb-climate-thermostat";
    const elementCurrent = document.createElement("button");
    elementCurrent.type = "button";
    elementCurrent.className = "hb-climate-temperature-step";
    elementCurrent.textContent = "−";
    elementCurrent.setAttribute("aria-label", "降低设定温度");
    const elementNext = document.createElement("div");
    elementNext.className = "hb-climate-temperature-dial";
    const climateArcCapEl = document.createElement("i");
    climateArcCapEl.className = "hb-climate-arc-cap start";
    climateArcCapEl.setAttribute("aria-hidden", "true");
    const climateArcCapElCurrent = document.createElement("i");
    climateArcCapElCurrent.className = "hb-climate-arc-cap end";
    climateArcCapElCurrent.setAttribute("aria-hidden", "true");
    const climateTemperatureThumbEl = document.createElement("button");
    climateTemperatureThumbEl.type = "button";
    climateTemperatureThumbEl.className = "hb-climate-temperature-thumb";
    climateTemperatureThumbEl.setAttribute("aria-label", "拖动调节设定温度");
    const climateTemperatureContentEl = document.createElement("div");
    climateTemperatureContentEl.className = "hb-climate-temperature-content";
    const elementPrevious = document.createElement("small");
    elementPrevious.textContent = "设定温度";
    const elementLocal = document.createElement("strong");
    const elementItem = document.createElement("span");
    elementItem.textContent = Number.isFinite(currentTemperature) ? "当前温度 " + currentTemperature + "°C" : "当前温度 --";
    climateTemperatureContentEl.append(elementPrevious, elementLocal, elementItem);
    elementNext.append(climateArcCapEl, climateArcCapElCurrent, climateTemperatureThumbEl, climateTemperatureContentEl);
    const elementEntry = document.createElement("button");
    elementEntry.type = "button";
    elementEntry.className = "hb-climate-temperature-step";
    elementEntry.textContent = "+";
    elementEntry.setAttribute("aria-label", "提高设定温度");
    let entityState = component;
    const syncClimateControl = arg => climateEffectMode(arg, deviceType);
    const syncClimateControlCurrent = (arg = entityState) => {
      entityState = arg || entityState;
      const visualMode = syncClimateControl(entityState);
      const count = Math.max(0, Math.min(1, (previous - minimumTemperature) / Math.max(temperatureStep, maximumTemperature - minimumTemperature)));
      const state = visualMode === "cool" ? modeColors.cool || "#73c8ff" : visualMode === "heat" ? modeColors.heat || "#ff8a65" : modeColors.other || "#dce2e6";
      const accentColor = visualMode === "off" ? "#65717a" : visualMode === "cool" ? lerpHexColor(state, "#ffffff", count * 0.32) : visualMode === "heat" ? lerpHexColor(state, "#ffffff", (1 - count) * 0.3) : state;
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
      const currentTemperature = normalizeClimateCapabilities(entityState).currentTemperature;
      elementItem.textContent = currentTemperature !== null ? "当前温度 " + currentTemperature + "°C" : "当前温度 --";
      const callback = climateService => climateService === "set_hvac_mode" ? entityState?.state : climateService === "set_fan_mode" ? entityState?.attributes?.fan_mode : climateService === "set_swing_mode" ? entityState?.attributes?.swing_mode : climateService === "set_swing_horizontal_mode" ? entityState?.attributes?.swing_horizontal_mode : climateService === "set_preset_mode" ? entityState?.attributes?.preset_mode : climateService === "set_operation_mode" ? entityState?.attributes?.operation_mode : null;
      for (const elementCurrent of element.querySelectorAll("button[data-climate-service]")) {
        const climateService = elementCurrent.dataset.climateService;
        const state = callback(climateService);
        elementCurrent.classList.toggle("active", elementCurrent.dataset.climateValue === String(state ?? ""));
      }
      for (const item of element.querySelectorAll(".hb-climate-select[data-climate-service]")) {
        const text = String(callback(item.dataset.climateService) ?? "");
        item.dataset.currentValue = text;
        const element = Array.from(item.querySelectorAll("[role=\"option\"]")).find(optionEl => optionEl.dataset.value === text);
        const selector = item.querySelector(".hb-climate-select-trigger > span");
        if (selector) {
          selector.textContent = element?.textContent || text || "请选择";
          selector.title = selector.textContent;
        }
        item.querySelectorAll("[role=\"option\"]").forEach(element => {
          const state = element.dataset.value === text;
          element.classList.toggle("active", state);
          element.setAttribute("aria-selected", String(state));
        });
      }
    };
    const syncAriaState = (arg = false) => {
      elementLocal.innerHTML = temperature ? previous + "<small>°C</small>" : "--";
      const value = (previous - minimumTemperature) / Math.max(temperatureStep, maximumTemperature - minimumTemperature) * 75;
      const count = Math.max(0, Math.min(75, value));
      elementNext.style.setProperty("--hb-climate-temperature-progress", count + "%");
      elementNext.style.setProperty("--hb-climate-thumb-angle", 225 + count / 75 * 270 + "deg");
      climateTemperatureThumbEl.setAttribute("aria-valuemin", String(minimumTemperature));
      climateTemperatureThumbEl.setAttribute("aria-valuemax", String(maximumTemperature));
      climateTemperatureThumbEl.setAttribute("aria-valuenow", String(previous));
      climateTemperatureThumbEl.setAttribute("aria-valuetext", previous + "°C");
      const max = Math.max(0.001, temperatureStep / 2);
      elementCurrent.disabled = !temperature || previous <= minimumTemperature + max;
      elementEntry.disabled = !temperature || previous >= maximumTemperature - max;
      elementCurrent.title = "最低 " + minimumTemperature + "°C";
      elementEntry.title = "最高 " + maximumTemperature + "°C";
      syncClimateControlCurrent();
      if (arg) {
        elementLocal.classList.remove("is-changing");
        window.requestAnimationFrame(() => elementLocal.classList.add("is-changing"));
      }
    };
    let statePrevious = previous;
    const list = [];
    let stateLocal = null;
    let stateItem = previous;
    let flag = false;
    let stateEntry = null;
    const runHelper = (arg, second) => arg !== null && second !== null && Math.abs(arg - second) < 1e-8;
    const runHelperCurrent = () => list.at(-1) ?? stateLocal;
    const runHelperNext = () => {
      const state = runHelperCurrent();
      if (state !== null) {
        callback(state);
      }
    };
    const stateList = async () => {
      window.clearTimeout(stateEntry);
      stateEntry = null;
      if (flag || !list.length) {
        return;
      }
      const temperature = list.shift();
      stateLocal = temperature;
      if (runHelper(temperature, statePrevious)) {
        stateLocal = null;
        runHelperNext();
        if (list.length) {
          stateEntry = window.setTimeout(stateList, 220);
        }
        return;
      }
      flag = true;
      try {
        await this.callEntityService(climateDetailsControlsEl === "climate" ? "climate" : climateDetailsControlsEl, "set_temperature", entityId, {
          temperature
        });
        statePrevious = temperature;
        if (climateDetailsControlsEl !== "water_heater") {
          onPowerChange?.(true);
        }
      } catch (error) {
        list.length = 0;
        scheduleTimeout();
        stateItem = statePrevious;
        previous = statePrevious;
        syncAriaState(true);
        this.options.onError?.(error);
      } finally {
        flag = false;
        stateLocal = null;
        runHelperNext();
        if (list.length) {
          stateEntry = window.setTimeout(stateList, 220);
        }
      }
    };
    const scheduleTimeoutNext = ({
      preserveIntermediateSteps = true
    } = {}) => {
      const state = previous;
      stateItem = state;
      const entry = list.at(-1) ?? stateLocal ?? statePrevious;
      if (runHelper(state, entry)) {
        runHelperNext();
        return;
      }
      if (preserveIntermediateSteps && value) {
        const entry = list.at(-2) ?? stateLocal ?? statePrevious;
        if (list.length && runHelper(state, entry)) {
          list.pop();
        } else {
          list.push(state);
        }
      } else {
        list.length = 0;
        list.push(state);
      }
      runHelperNext();
      if (!flag) {
        window.clearTimeout(stateEntry);
        stateEntry = window.setTimeout(stateList, 160);
      }
    };
    const syncClimateControlNext = arg => {
      if (!interactive || !temperature) {
        return;
      }
      const temperatureCurrent = previous;
      const asString = String(temperatureStep).split(".")[1]?.length || 0;
      previous = Number(Math.max(minimumTemperature, Math.min(maximumTemperature, previous + arg * temperatureStep)).toFixed(asString));
      if (previous !== temperatureCurrent) {
        syncAriaState(true);
        scheduleTimeoutNext();
      }
    };
    const measureElementBox = event => {
      const domRect = elementNext.getBoundingClientRect();
      const size = domRect.left + domRect.width / 2;
      const value = domRect.top + domRect.height / 2;
      const eventCurrent = event.clientX - size;
      const state = event.clientY - value;
      const stateCurrent = (Math.atan2(eventCurrent, -state) * 180 / Math.PI + 360) % 360;
      let amount;
      if (stateCurrent >= 225) {
        amount = stateCurrent;
      } else if (stateCurrent <= 135) {
        amount = stateCurrent + 360;
      } else {
        amount = stateCurrent <= 180 ? 495 : 225;
      }
      const count = Math.max(0, Math.min(1, (amount - 225) / 270));
      const asString = String(temperatureStep).split(".")[1]?.length || 0;
      return Number((minimumTemperature + Math.round((maximumTemperature - minimumTemperature) * count / temperatureStep) * temperatureStep).toFixed(asString));
    };
    let event = null;
    elementNext.addEventListener("pointerdown", event => {
      if (!interactive || !temperature) {
        return;
      }
      const rect = elementNext.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) / 2;
      const hypot = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      if (event.target === climateTemperatureThumbEl || !(Math.abs(hypot - size) > 34)) {
        event.preventDefault();
        event = {
          pointerId: event.pointerId,
          previous
        };
        elementNext.setPointerCapture(event.pointerId);
        elementNext.classList.add("is-dragging");
        previous = measureElementBox(event);
        syncAriaState();
      }
    });
    elementNext.addEventListener("pointermove", eventCurrent => {
      if (!!event && eventCurrent.pointerId === event.pointerId) {
        previous = measureElementBox(eventCurrent);
        syncAriaState();
      }
    });
    const stateText = eventCurrent => {
      if (!event || eventCurrent.pointerId !== event.pointerId) {
        return;
      }
      const previousCurrent = event.previous;
      event = null;
      elementNext.classList.remove("is-dragging");
      if (elementNext.hasPointerCapture(eventCurrent.pointerId)) {
        elementNext.releasePointerCapture(eventCurrent.pointerId);
      }
      syncAriaState(true);
      if (previous !== previousCurrent) {
        scheduleTimeoutNext({
          preserveIntermediateSteps: false
        });
      }
    };
    elementNext.addEventListener("pointerup", stateText);
    elementNext.addEventListener("pointercancel", stateText);
    climateTemperatureThumbEl.disabled = !temperature;
    elementCurrent.addEventListener("click", () => syncClimateControlNext(-1));
    elementEntry.addEventListener("click", () => syncClimateControlNext(1));
    syncAriaState();
    climateThermostatEl.append(elementCurrent, elementNext, elementEntry);
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
      values: values,
      current,
      service,
      dataKey,
      labels: labels = {},
      icons: icons = {},
      className = "",
      domain = "climate",
      presentation = "auto"
    }) => {
      const set = [...new Set((Array.isArray(values) ? values : []).map(arg => String(arg ?? "").trim()).filter(Boolean))];
      if (!set.length) {
        return;
      }
      const state = presentation === "auto" ? climateOptionPresentation(set, labels) : presentation;
      const elementCurrent = document.createElement("div");
      elementCurrent.className = ("hb-climate-details-group " + className).trim();
      if (waterHeaterControlPanelEl) {
        elementCurrent.dataset.controlSource = "primary-entity";
      }
      const elementNext = document.createElement("strong");
      elementNext.textContent = label;
      if (state === "select") {
        elementCurrent.classList.add("select-options");
        const climateSelectEl = document.createElement("div");
        climateSelectEl.className = "hb-climate-select";
        climateSelectEl.dataset.climateService = service;
        climateSelectEl.dataset.currentValue = String(current ?? "");
        const elementPrevious = document.createElement("button");
        elementPrevious.type = "button";
        elementPrevious.className = "hb-climate-select-trigger";
        elementPrevious.setAttribute("aria-label", label);
        elementPrevious.setAttribute("aria-haspopup", "listbox");
        elementPrevious.setAttribute("aria-expanded", "false");
        elementPrevious.disabled = !interactive;
        const elementLocal = document.createElement("span");
        const climateSelectMenuEl = document.createElement("i");
        climateSelectMenuEl.setAttribute("aria-hidden", "true");
        elementPrevious.append(elementLocal, climateSelectMenuEl);
        const climateSelectMenuElCurrent = document.createElement("div");
        climateSelectMenuElCurrent.className = "hb-climate-select-menu";
        climateSelectMenuElCurrent.id = "hb-climate-select-" + randomUuid();
        climateSelectMenuElCurrent.setAttribute("role", "listbox");
        climateSelectMenuElCurrent.setAttribute("aria-label", label);
        climateSelectMenuElCurrent.setAttribute("popover", "auto");
        climateSelectMenuElCurrent.hidden = true;
        elementPrevious.setAttribute("aria-controls", climateSelectMenuElCurrent.id);
        let flag = false;
        const computeResult = () => {
          try {
            return climateSelectMenuElCurrent.matches(":popover-open");
          } catch {
            return climateSelectMenuElCurrent.dataset.open === "true";
          }
        };
        const syncVisualState = arg => {
          const text = String(arg ?? "");
          climateSelectEl.dataset.currentValue = text;
          const element = Array.from(climateSelectMenuElCurrent.querySelectorAll("[role=\"option\"]")).find(optionEl => optionEl.dataset.value === text);
          elementLocal.textContent = element?.textContent || text || "请选择";
          elementLocal.title = elementLocal.textContent;
          climateSelectMenuElCurrent.querySelectorAll("[role=\"option\"]").forEach(element => {
            const state = element.dataset.value === text;
            element.classList.toggle("active", state);
            element.setAttribute("aria-selected", String(state));
          });
        };
        const applyElementStyle = () => {
          if (!computeResult() && climateSelectMenuElCurrent.hidden) {
            return;
          }
          const domRect = elementPrevious.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 190), Math.max(190, innerWidth - 20));
          climateSelectMenuElCurrent.style.width = clamped + "px";
          climateSelectMenuElCurrent.style.maxHeight = Math.min(360, Math.max(120, innerHeight - 20)) + "px";
          const size = Math.min(climateSelectMenuElCurrent.scrollHeight || 0, 360);
          const value = innerHeight - domRect.bottom - 10;
          const sizeCurrent = domRect.top - 10;
          const max = value < Math.min(size, 180) && sizeCurrent > value ? Math.max(10, domRect.top - size - 5) : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          climateSelectMenuElCurrent.style.left = Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) + "px";
          climateSelectMenuElCurrent.style.top = Math.max(10, max) + "px";
        };
        const syncAriaState = () => {
          if (computeResult() && typeof climateSelectMenuElCurrent.hidePopover == "function") {
            climateSelectMenuElCurrent.hidePopover();
          }
          climateSelectMenuElCurrent.hidden = true;
          climateSelectMenuElCurrent.dataset.open = "false";
          elementPrevious.setAttribute("aria-expanded", "false");
        };
        const callback = (arg = false) => {
          if (!elementPrevious.disabled && !flag) {
            climateSelectMenuElCurrent.hidden = false;
            if (typeof climateSelectMenuElCurrent.showPopover == "function") {
              climateSelectMenuElCurrent.showPopover();
            } else {
              climateSelectMenuElCurrent.dataset.open = "true";
            }
            elementPrevious.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (arg) {
              (climateSelectMenuElCurrent.querySelector("[aria-selected=\"true\"]") || climateSelectMenuElCurrent.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async state => {
          if (!interactive || flag) {
            return;
          }
          const currentValue = climateSelectEl.dataset.currentValue;
          flag = true;
          elementPrevious.disabled = true;
          syncAriaState();
          syncVisualState(state);
          try {
            await this.callEntityService(domain, service, entityId, {
              [dataKey]: state
            });
            const attributes = {
              ...(entityState?.attributes || {}),
              [dataKey]: state
            };
            if (service === "set_hvac_mode") {
              entityState = {
                ...(entityState || {}),
                state,
                attributes: {
                  ...attributes,
                  hvac_action: state === "cool" ? "cooling" : state === "heat" ? "heating" : state === "off" ? "off" : state
                }
              };
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const trimmed = deviceType === "bath-heater" && ["idle", "standby", "待机", "关闭"].includes(String(state).trim().toLowerCase());
              const found = element.dataset.lastClimateMode || climateCapabilities.hvacModes.find(arg => arg !== "off") || (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const options = {
                ...(entityState || {}),
                state: trimmed ? "off" : climateIsPoweredOn(entityState, deviceType) ? entityState?.state : found,
                attributes: {
                  ...attributes,
                  preset_mode: state
                }
              };
              const mode = climateEffectMode(options, deviceType);
              options.attributes.hvac_action = trimmed ? "idle" : mode === "cool" ? "cooling" : mode === "heat" ? "heating" : "fan";
              entityState = options;
              onPowerChange?.(!trimmed);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...attributes,
                  operation_mode: state
                }
              };
              onPowerChange?.(state !== "off");
            } else {
              entityState = {
                ...(entityState || {}),
                attributes: attributes
              };
            }
            syncClimateControlCurrent();
          } catch (error) {
            syncVisualState(currentValue);
            this.options.onError?.(error);
          } finally {
            flag = false;
            elementPrevious.disabled = !interactive;
          }
        };
        for (const climateSelectOptionEl of set) {
          const element = document.createElement("button");
          element.type = "button";
          element.className = "hb-climate-select-option";
          element.setAttribute("role", "option");
          element.dataset.value = climateSelectOptionEl;
          element.textContent = labels[climateSelectOptionEl] || climateSelectOptionEl;
          element.title = element.textContent;
          element.addEventListener("click", () => invokeEntityService(climateSelectOptionEl));
          climateSelectMenuElCurrent.append(element);
        }
        syncVisualState(String(current ?? ""));
        elementPrevious.addEventListener("click", () => {
          if (computeResult() || climateSelectMenuElCurrent.dataset.open === "true") {
            syncAriaState();
          } else {
            callback();
          }
        });
        elementPrevious.addEventListener("keydown", event => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            callback(true);
          }
        });
        climateSelectMenuElCurrent.addEventListener("keydown", event => {
          const matchedEl = [...climateSelectMenuElCurrent.querySelectorAll("[role=\"option\"]")];
          const state = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState();
            elementPrevious.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const count = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state + count + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        climateSelectMenuElCurrent.addEventListener("toggle", arg => {
          const state = arg.newState === "open";
          climateSelectMenuElCurrent.hidden = !state;
          climateSelectMenuElCurrent.dataset.open = String(state);
          elementPrevious.setAttribute("aria-expanded", String(state));
          if (state) {
            applyElementStyle();
          }
        });
        climateSelectEl.append(elementPrevious, climateSelectMenuElCurrent);
        elementCurrent.append(elementNext, climateSelectEl);
        (waterHeaterControlPanelEl || element).append(elementCurrent);
        return;
      }
      const climateDetailsOptionsEl = document.createElement("div");
      climateDetailsOptionsEl.className = "hb-climate-details-options";
      for (const state of set) {
        const elementCurrent = document.createElement("button");
        elementCurrent.type = "button";
        elementCurrent.dataset.climateService = service;
        elementCurrent.dataset.climateValue = state;
        const elementNext = document.createElement("i");
        elementNext.setAttribute("aria-hidden", "true");
        elementNext.textContent = icons[state] || "";
        const elementPrevious = document.createElement("span");
        elementPrevious.textContent = labels[state] || state;
        elementCurrent.append(elementNext, elementPrevious);
        elementCurrent.classList.toggle("active", state === current);
        elementCurrent.addEventListener("click", async () => {
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
              const state = climatePowerCommand(entityId, entityState, false, "bath-heater");
              await this.callEntityService(state.domain, state.service, entityId, state.data);
            }
            climateDetailsOptionsEl.querySelectorAll("button").forEach(element => element.classList.toggle("active", element === elementCurrent));
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
              syncClimateControlCurrent();
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const stateCurrent = trimmed;
              const found = element.dataset.lastClimateMode || climateCapabilities.hvacModes.find(arg => arg !== "off") || (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const options = {
                ...(entityState || {}),
                state: stateCurrent ? "off" : climateIsPoweredOn(entityState, deviceType) ? entityState?.state : found,
                attributes: {
                  ...(entityState?.attributes || {}),
                  preset_mode: state
                }
              };
              const mode = climateEffectMode(options, deviceType);
              options.attributes.hvac_action = stateCurrent ? "idle" : mode === "cool" ? "cooling" : mode === "heat" ? "heating" : "fan";
              entityState = options;
              syncClimateControlCurrent();
              onPowerChange?.(!stateCurrent);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...(entityState?.attributes || {}),
                  operation_mode: state
                }
              };
              syncClimateControlCurrent();
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
        climateDetailsOptionsEl.append(elementCurrent);
      }
      elementCurrent.append(elementNext, climateDetailsOptionsEl);
      (waterHeaterControlPanelEl || element).append(elementCurrent);
    };
    const values = climateOperationModeValues(component, deviceType);
    const labels = Object.fromEntries(values.map(arg => [arg, climateModeLabel(arg, deviceType, options)]));
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
    const fanModes = climateDetailsControlsEl === "climate" ? climateCapabilities.fanModes : [];
    if (fanModes.length) {
      const state = {
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
      const fan_mode = fanModes.find(climateFanSliderEl => ["auto", "自动"].includes(String(climateFanSliderEl).toLowerCase()));
      const climateFanSliderEl = fanModes.filter(climateFanSliderEl => climateFanSliderEl !== fan_mode);
      const climateFanSliderElCurrent = document.createElement("section");
      climateFanSliderElCurrent.className = "hb-climate-fan-slider";
      const climateFanSliderHeadingEl = document.createElement("span");
      climateFanSliderHeadingEl.className = "hb-climate-fan-slider-heading";
      const elementCurrent = document.createElement("i");
      elementCurrent.setAttribute("aria-hidden", "true");
      elementCurrent.textContent = "✾";
      const elementNext = document.createElement("strong");
      elementNext.textContent = "风速";
      const elementPrevious = document.createElement("output");
      const count = Math.max(0, climateFanSliderEl.indexOf(attributes.fan_mode));
      let amount = count;
      let stateCurrent = !!fan_mode && attributes.fan_mode === fan_mode;
      let fan_modeCurrent = attributes.fan_mode;
      const elementLocal = document.createElement("input");
      elementLocal.type = "range";
      elementLocal.min = "0";
      elementLocal.max = String(Math.max(0, climateFanSliderEl.length - 1));
      elementLocal.step = "1";
      elementLocal.value = String(count);
      elementLocal.disabled = climateFanSliderEl.length === 0;
      const runHelper = climateFanAutoEl => state[String(climateFanSliderEl[climateFanAutoEl]).toLowerCase()] || climateFanSliderEl[climateFanAutoEl] || "--";
      const elementItem = document.createElement("button");
      elementItem.type = "button";
      elementItem.className = "hb-climate-fan-auto";
      elementItem.textContent = "自动";
      elementItem.hidden = !fan_mode;
      elementItem.classList.toggle("active", stateCurrent);
      const applyElementStyle = () => {
        const numeric = Number(elementLocal.value);
        const state = climateFanSliderEl.length > 1 ? numeric / (climateFanSliderEl.length - 1) * 100 : 100;
        elementPrevious.textContent = stateCurrent ? "自动" : runHelper(numeric);
        elementLocal.style.setProperty("--hb-climate-fan-progress", state + "%");
      };
      climateFanSliderHeadingEl.append(elementCurrent, elementNext, elementPrevious, elementItem);
      elementLocal.addEventListener("input", () => {
        stateCurrent = false;
        elementItem.classList.remove("active");
        applyElementStyle();
      });
      elementLocal.addEventListener("change", async () => {
        if (!interactive || !climateFanSliderEl.length) {
          return;
        }
        const numeric = Number(elementLocal.value);
        const fan_modeNext = climateFanSliderEl[numeric];
        elementLocal.disabled = true;
        elementItem.disabled = true;
        try {
          await this.callEntityService("climate", "set_fan_mode", entityId, {
            fan_mode: fan_modeNext
          });
          amount = numeric;
          fan_modeCurrent = fan_modeNext;
          stateCurrent = false;
        } catch (error) {
          stateCurrent = !!fan_mode && fan_modeCurrent === fan_mode;
          if (!stateCurrent) {
            elementLocal.value = String(amount);
          }
          elementItem.classList.toggle("active", stateCurrent);
          applyElementStyle();
          this.options.onError?.(error);
        } finally {
          elementLocal.disabled = false;
          elementItem.disabled = false;
        }
      });
      elementItem.addEventListener("click", async () => {
        if (!!interactive && !!fan_mode && !elementItem.disabled) {
          elementLocal.disabled = true;
          elementItem.disabled = true;
          try {
            await this.callEntityService("climate", "set_fan_mode", entityId, {
              fan_mode
            });
            stateCurrent = true;
            fan_modeCurrent = fan_mode;
            elementItem.classList.add("active");
            applyElementStyle();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            elementLocal.disabled = climateFanSliderEl.length === 0;
            elementItem.disabled = false;
          }
        }
      });
      const climateFanSliderLegendEl = document.createElement("span");
      climateFanSliderLegendEl.className = "hb-climate-fan-slider-legend";
      const elementEntry = document.createElement("small");
      elementEntry.textContent = runHelper(0);
      const elementList = document.createElement("small");
      elementList.textContent = runHelper(climateFanSliderEl.length - 1);
      climateFanSliderLegendEl.append(elementEntry, elementList);
      applyElementStyle();
      climateFanSliderElCurrent.append(climateFanSliderHeadingEl, elementLocal, climateFanSliderLegendEl);
      element.append(climateFanSliderElCurrent);
    }
    let climateFanSliderEl = null;
    if (climateDetailsControlsEl === "fan" && climateCapabilities.supportsFanPercentage) {
      const climateFanSliderElCurrent = document.createElement("section");
      climateFanSliderElCurrent.className = "hb-climate-fan-slider";
      const climateFanSliderHeadingEl = document.createElement("span");
      climateFanSliderHeadingEl.className = "hb-climate-fan-slider-heading";
      const elementCurrent = document.createElement("i");
      elementCurrent.setAttribute("aria-hidden", "true");
      elementCurrent.textContent = "✾";
      const elementNext = document.createElement("strong");
      elementNext.textContent = "风速";
      const elementPrevious = document.createElement("output");
      let count = Math.max(0, Math.min(100, climateCapabilities.fanPercentage));
      const elementLocal = document.createElement("input");
      elementLocal.type = "range";
      elementLocal.min = "0";
      elementLocal.max = "100";
      elementLocal.step = String(climateCapabilities.fanPercentageStep);
      elementLocal.value = String(count);
      const applyElementStyle = () => {
        const count = Math.max(0, Math.min(100, Number(elementLocal.value) || 0));
        elementPrevious.textContent = Math.round(count) + "%";
        elementLocal.style.setProperty("--hb-climate-fan-progress", count + "%");
      };
      climateFanSliderEl = entityId => {
        const fanPercentage = normalizeClimateCapabilities(entityId).fanPercentage;
        if (fanPercentage !== null) {
          count = Math.max(0, Math.min(100, fanPercentage));
          elementLocal.value = String(count);
          applyElementStyle();
        }
      };
      elementLocal.addEventListener("input", applyElementStyle);
      elementLocal.addEventListener("change", async () => {
        if (!interactive || elementLocal.disabled) {
          return;
        }
        const percentage = Math.max(0, Math.min(100, Number(elementLocal.value) || 0));
        elementLocal.disabled = true;
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
          syncClimateControlCurrent();
          onPowerChange?.(percentage > 0);
        } catch (error) {
          elementLocal.value = String(count);
          applyElementStyle();
          this.options.onError?.(error);
        } finally {
          elementLocal.disabled = false;
        }
      });
      const climateFanSliderLegendEl = document.createElement("span");
      climateFanSliderLegendEl.className = "hb-climate-fan-slider-legend";
      const elementItem = document.createElement("small");
      elementItem.textContent = "关闭";
      const elementEntry = document.createElement("small");
      elementEntry.textContent = "最大";
      climateFanSliderLegendEl.append(elementItem, elementEntry);
      climateFanSliderHeadingEl.append(elementCurrent, elementNext, elementPrevious);
      applyElementStyle();
      climateFanSliderElCurrent.append(climateFanSliderHeadingEl, elementLocal, climateFanSliderLegendEl);
      element.append(climateFanSliderElCurrent);
    }
    const entries = Object.fromEntries(climateCapabilities.swingModes.map(arg => [arg, climateSwingModeLabel(arg, "vertical", options)]));
    createChildElement({
      label: climateCapabilities.horizontalSwingModes.length ? "纵向摆风" : "摆风",
      values: climateCapabilities.swingModes,
      current: attributes.swing_mode,
      service: "set_swing_mode",
      dataKey: "swing_mode",
      labels: entries,
      icons: {
        off: "—",
        vertical: "↕",
        horizontal: "↔",
        both: "✣"
      },
      className: "compact-options",
      presentation: climateOptionPresentation(climateCapabilities.swingModes, entries, {
        inlineIcon: true
      })
    });
    const labelsCurrent = Object.fromEntries(climateCapabilities.horizontalSwingModes.map(arg => [arg, climateSwingModeLabel(arg, "horizontal", options)]));
    createChildElement({
      label: "水平摆风",
      values: climateCapabilities.horizontalSwingModes,
      current: attributes.swing_horizontal_mode,
      service: "set_swing_horizontal_mode",
      dataKey: "swing_horizontal_mode",
      labels: labelsCurrent,
      className: "compact-options",
      presentation: climateOptionPresentation(climateCapabilities.horizontalSwingModes, labelsCurrent, {
        inlineIcon: true
      })
    });
    const labelsNext = Object.fromEntries(climateCapabilities.presetModes.map(arg => [arg, climateModeLabel(arg, deviceType, options)]));
    const iconsCurrent = Object.fromEntries(climateCapabilities.presetModes.map(arg => [arg, climateModeIcon(arg, deviceType)]));
    createChildElement({
      label: "预设模式",
      values: climateCapabilities.presetModes,
      current: attributes.preset_mode,
      service: "set_preset_mode",
      dataKey: "preset_mode",
      labels: labelsNext,
      icons: iconsCurrent,
      className: "compact-options",
      domain: climateDetailsControlsEl === "fan" ? "fan" : "climate",
      presentation: climateOptionPresentation(climateCapabilities.presetModes, labelsNext, {
        inlineIcon: true
      })
    });
    let runHelperPrevious = null;
    if (!element.childElementCount) {
      const elementCurrent = document.createElement("section");
      elementCurrent.className = "hb-climate-details-loading";
      const iconEl = document.createElement("i");
      iconEl.setAttribute("aria-hidden", "true");
      const elementNext = document.createElement("strong");
      const elementPrevious = document.createElement("span");
      runHelperPrevious = arg => {
        const asString = String(arg?.state || "").trim().toLowerCase();
        const state = !arg || !asString || asString === "unknown";
        const value = asString === "unavailable";
        elementCurrent.classList.toggle("is-loading", state);
        elementCurrent.classList.toggle("is-unavailable", value);
        elementNext.textContent = state ? "正在加载设备状态…" : value ? "设备当前不可用" : "暂无可用控制数据";
        elementPrevious.textContent = state ? "状态到达后会自动显示，无需重新打开弹窗" : value ? "连接恢复后会自动更新" : "请检查该实体在 Home Assistant 中提供的控制能力";
      };
      runHelperPrevious(component);
      elementCurrent.append(iconEl, elementNext, elementPrevious);
      element.append(elementCurrent);
    }
    element.syncClimateGrid = () => {
      const state = Array.from(element.children);
      const found = state.find(element => element.classList.contains("hb-climate-thermostat"));
      if (!found) {
        return;
      }
      const foundCurrent = state.find(element => element.classList.contains("is-water-heater"));
      const length = state.filter(metadata => metadata !== found && metadata !== foundCurrent).length;
      found.style.gridRow = "1 / span " + Math.max(1, length);
      if (foundCurrent) {
        foundCurrent.style.gridRow = "1 / span " + Math.max(1, length);
      }
    };
    element.syncClimateGrid();
    element.syncClimateState = arg => {
      if (!arg) {
        return;
      }
      entityState = arg;
      runHelperPrevious?.(arg);
      climateFanSliderEl?.(arg);
      const targetTemperature = normalizeClimateCapabilities(arg).targetTemperature;
      const temperature = reconcileClimateTargetTemperature(stateItem, targetTemperature, state, temperatureStep);
      if (state === null || temperature.confirmed) {
        stateItem = temperature.temperature;
      }
      previous = stateItem;
      if (targetTemperature !== null && (state === null || temperature.confirmed)) {
        statePrevious = targetTemperature;
      }
      if (state !== null && temperature.confirmed) {
        if (value) {
          scheduleTimeoutCurrent();
        } else {
          scheduleTimeout();
        }
      }
      syncAriaState();
    };
    element.cleanupClimateDetails = () => {
      window.clearTimeout(stateEntry);
      stateEntry = null;
      list.length = 0;
      stateLocal = null;
      scheduleTimeout();
    };
    syncClimateControlCurrent();
    return element;
  }
  createWaterHeaterExtensionControls(entityId, {
    component = null,
    interactive = true,
    excludedEntityIds = []
  } = {}) {
    const state = component ? relatedPopupContext(component, this.entityMetadata, this.deviceMetadata, this.states) : null;
    const entities = component ? selectedRelatedEntities(component, this.entityMetadata, this.deviceMetadata, this.states) : null;
    const allowed = new Set(excludedEntityIds);
    const filtered = (entities === null ? relatedWaterHeaterEntities(this.entityMetadata, entityId) : entities).filter(relatedEntityExtensionsEl => !allowed.has(relatedEntityExtensionsEl.entityId));
    const relatedEntityExtensionsEl = state?.primary || this.entityMetadata.get(entityId);
    if (!filtered.length) {
      return null;
    }
    const relatedEntityExtensionsElCurrent = document.createElement("section");
    relatedEntityExtensionsElCurrent.className = "hb-related-entity-extensions hb-water-heater-extensions" + (state?.deviceType ? " is-" + state.deviceType : "");
    relatedEntityExtensionsElCurrent.dataset.controlSource = entities === null ? "automatic-device" : "user-selected";
    const index = new Map();
    const resolveEntityId = entityId => {
      const state = this.states.get(entityId);
      return state?.newState || state || {
        entityId,
        state: "unknown",
        attributes: {}
      };
    };
    const runHelper = (waterHeaterExtensionGridEl, waterHeaterExtensionGridElCurrent) => {
      if (!index.has(waterHeaterExtensionGridEl)) {
        index.set(waterHeaterExtensionGridEl, []);
      }
      index.get(waterHeaterExtensionGridEl).push(waterHeaterExtensionGridElCurrent);
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
        const elementCurrent = document.createElement("strong");
        elementCurrent.textContent = waterHeaterExtensionToggleEl;
        const elementNext = document.createElement("small");
        spanEl.append(elementCurrent, elementNext);
        element.append(iconEl, spanEl);
        let state = resolveEntityId(entityId);
        let flag = false;
        const syncVisualState = (arg = state) => {
          state = arg || state;
          const asString = String(state?.state || "").toLowerCase();
          const present = ["unknown", "unavailable"].includes(asString);
          const value = asString === "on";
          element.classList.toggle("is-on", value && !present);
          element.classList.toggle("is-unavailable", present);
          element.disabled = !interactive || flag || present;
          element.setAttribute("aria-pressed", String(value));
          element.setAttribute("aria-busy", String(flag));
          elementNext.textContent = present ? "不可用" : value ? "已开启" : "已关闭";
        };
        element.addEventListener("click", async () => {
          if (!interactive || flag || element.classList.contains("is-unavailable")) {
            return;
          }
          const stateCurrent = state;
          const asString = String(state?.state || "").toLowerCase() !== "on";
          flag = true;
          syncVisualState({
            ...(state || {}),
            state: asString ? "on" : "off"
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            syncVisualState(stateCurrent);
            this.options.onError?.(error);
          } finally {
            flag = false;
            syncVisualState(state);
          }
        });
        syncVisualState(state);
        runHelper(entityId, syncVisualState);
        waterHeaterExtensionGridEl.append(element);
      } else if (["select", "input_select"].includes(text)) {
        const waterHeaterExtensionSelectEl = document.createElement("div");
        waterHeaterExtensionSelectEl.className = "hb-water-heater-extension-select";
        const element = document.createElement("span");
        element.textContent = waterHeaterExtensionToggleEl;
        element.title = waterHeaterExtensionToggleEl;
        const elementCurrent = document.createElement("button");
        elementCurrent.type = "button";
        elementCurrent.className = "hb-related-select-trigger";
        elementCurrent.setAttribute("aria-label", waterHeaterExtensionToggleEl);
        elementCurrent.setAttribute("aria-haspopup", "listbox");
        elementCurrent.setAttribute("aria-expanded", "false");
        const elementNext = document.createElement("span");
        const relatedSelectMenuEl = document.createElement("i");
        relatedSelectMenuEl.setAttribute("aria-hidden", "true");
        elementCurrent.append(elementNext, relatedSelectMenuEl);
        const relatedSelectMenuElCurrent = document.createElement("div");
        relatedSelectMenuElCurrent.className = "hb-related-select-menu";
        relatedSelectMenuElCurrent.id = "hb-related-select-" + String(this.renderNamespace || "runtime").replace(/[^a-z0-9_-]/gi, "-") + "-" + entityId.replace(/[^a-z0-9_-]/gi, "-");
        relatedSelectMenuElCurrent.setAttribute("role", "listbox");
        relatedSelectMenuElCurrent.setAttribute("popover", "auto");
        relatedSelectMenuElCurrent.hidden = true;
        elementCurrent.setAttribute("aria-controls", relatedSelectMenuElCurrent.id);
        let entityState = resolveEntityId(entityId);
        let string = String(entityState?.state || "");
        let flag = false;
        let stateCurrent = "";
        let options = [];
        const stateNext = {
          entityId,
          entityMetadata: this.entityMetadata,
          entityTranslations: this.entityTranslations,
          attributes: ["options", "option"]
        };
        const syncClimateControl = arg => state?.deviceType === "bath-heater" ? climateModeLabel(arg, "bath-heater", stateNext) : String(arg || "");
        const computeResult = () => {
          try {
            return relatedSelectMenuElCurrent.matches(":popover-open");
          } catch {
            return relatedSelectMenuElCurrent.dataset.open === "true";
          }
        };
        const applyElementStyle = () => {
          if (!computeResult() && relatedSelectMenuElCurrent.hidden) {
            return;
          }
          const domRect = elementCurrent.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(Math.max(domRect.width, 132), Math.max(132, innerWidth - 16));
          relatedSelectMenuElCurrent.style.width = clamped + "px";
          relatedSelectMenuElCurrent.style.maxHeight = Math.min(216, Math.max(88, innerHeight - 16)) + "px";
          const size = Math.min(relatedSelectMenuElCurrent.scrollHeight || 0, 216);
          const value = innerHeight - domRect.bottom - 8;
          const sizeCurrent = domRect.top - 8;
          const max = value < Math.min(size, 140) && sizeCurrent > value ? Math.max(8, domRect.top - size - 4) : Math.min(innerHeight - size - 8, domRect.bottom + 4);
          relatedSelectMenuElCurrent.style.left = Math.max(8, Math.min(domRect.left, innerWidth - clamped - 8)) + "px";
          relatedSelectMenuElCurrent.style.top = Math.max(8, max) + "px";
        };
        const syncAriaState = () => {
          if (computeResult() && typeof relatedSelectMenuElCurrent.hidePopover == "function") {
            relatedSelectMenuElCurrent.hidePopover();
          }
          relatedSelectMenuElCurrent.hidden = true;
          relatedSelectMenuElCurrent.dataset.open = "false";
          elementCurrent.setAttribute("aria-expanded", "false");
        };
        const callback = (arg = false) => {
          if (!elementCurrent.disabled) {
            relatedSelectMenuElCurrent.hidden = false;
            if (typeof relatedSelectMenuElCurrent.showPopover == "function") {
              relatedSelectMenuElCurrent.showPopover();
            } else {
              relatedSelectMenuElCurrent.dataset.open = "true";
            }
            elementCurrent.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (arg) {
              (relatedSelectMenuElCurrent.querySelector("[aria-selected=\"true\"]") || relatedSelectMenuElCurrent.querySelector("[role=\"option\"]"))?.focus();
            }
          }
        };
        const invokeEntityService = async state => {
          if (!interactive || flag || !state) {
            return;
          }
          const stateCurrent = entityState;
          flag = true;
          syncAriaState();
          syncVisualStateCurrent({
            ...(entityState || {}),
            state,
            attributes: {
              ...(entityState?.attributes || {}),
              options
            }
          });
          try {
            const service = relatedEntitySelectService(text);
            if (!service) {
              throw new Error("实体 " + entityId + " 不支持选项服务。");
            }
            await this.callEntityService(service.domain, service.service, entityId, {
              option: state
            });
            string = state;
          } catch (error) {
            syncVisualStateCurrent(stateCurrent);
            this.options.onError?.(error);
          } finally {
            flag = false;
            syncVisualStateCurrent(entityState);
          }
        };
        const syncVisualState = (relatedSelectOptionEl, relatedSelectOptionElCurrent) => {
          relatedSelectMenuElCurrent.replaceChildren(...relatedSelectOptionEl.map(relatedSelectOptionEl => {
            const element = document.createElement("button");
            element.type = "button";
            element.className = "hb-related-select-option";
            element.setAttribute("role", "option");
            element.dataset.value = relatedSelectOptionEl;
            element.textContent = syncClimateControl(relatedSelectOptionEl);
            element.title = element.textContent;
            const state = relatedSelectOptionEl === relatedSelectOptionElCurrent;
            element.classList.toggle("active", state);
            element.setAttribute("aria-selected", String(state));
            element.addEventListener("click", () => invokeEntityService(relatedSelectOptionEl));
            return element;
          }));
        };
        const syncVisualStateCurrent = (arg = entityState) => {
          entityState = arg || entityState;
          const text = String(entityState?.state || "");
          const state = relatedEntityOptions(metadata, entityState);
          options = state;
          const jsonText = JSON.stringify(state);
          if (jsonText !== stateCurrent) {
            stateCurrent = jsonText;
            syncVisualState(state, text);
          } else {
            for (const element of relatedSelectMenuElCurrent.querySelectorAll("[role=\"option\"]")) {
              const state = element.dataset.value === text;
              element.classList.toggle("active", state);
              element.setAttribute("aria-selected", String(state));
            }
          }
          if (text && !["unknown", "unavailable"].includes(text.toLowerCase())) {
            string = text;
          }
          elementNext.textContent = string ? syncClimateControl(string) : state.length ? syncClimateControl(state[0]) : "无选项";
          elementNext.title = elementNext.textContent;
          elementCurrent.disabled = !interactive || flag || !state.length || text.toLowerCase() === "unavailable";
        };
        elementCurrent.addEventListener("click", () => {
          if (computeResult() || relatedSelectMenuElCurrent.dataset.open === "true") {
            syncAriaState();
          } else {
            callback();
          }
        });
        elementCurrent.addEventListener("keydown", event => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            callback(true);
          }
        });
        relatedSelectMenuElCurrent.addEventListener("keydown", event => {
          const matchedEl = [...relatedSelectMenuElCurrent.querySelectorAll("[role=\"option\"]")];
          const state = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState();
            elementCurrent.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const count = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[(state + count + matchedEl.length) % matchedEl.length]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        relatedSelectMenuElCurrent.addEventListener("toggle", arg => {
          const state = arg.newState === "open";
          relatedSelectMenuElCurrent.hidden = !state;
          relatedSelectMenuElCurrent.dataset.open = String(state);
          elementCurrent.setAttribute("aria-expanded", String(state));
          if (state) {
            applyElementStyle();
          }
        });
        waterHeaterExtensionSelectEl.append(element, elementCurrent, relatedSelectMenuElCurrent);
        syncVisualStateCurrent(entityState);
        runHelper(entityId, syncVisualStateCurrent);
        waterHeaterExtensionGridEl.append(waterHeaterExtensionSelectEl);
      } else if (["number", "input_number"].includes(text)) {
        const waterHeaterExtensionNumberEl = document.createElement("div");
        waterHeaterExtensionNumberEl.className = "hb-water-heater-extension-number";
        const element = document.createElement("span");
        element.textContent = waterHeaterExtensionToggleEl;
        const spanEl = document.createElement("span");
        const elementCurrent = document.createElement("button");
        elementCurrent.type = "button";
        elementCurrent.textContent = "−";
        const elementNext = document.createElement("output");
        const elementPrevious = document.createElement("button");
        elementPrevious.type = "button";
        elementPrevious.textContent = "+";
        spanEl.append(elementCurrent, elementNext, elementPrevious);
        waterHeaterExtensionNumberEl.append(element, spanEl);
        let entityState = resolveEntityId(entityId);
        let numeric = Number(entityState?.state);
        let state = false;
        const callback = () => {
          const numeric = entityState?.attributes || {};
          const number = Number(numeric.min);
          const numericCurrent = Number(numeric.max);
          const step = Math.max(0.001, Number(numeric.step) || 1);
          return {
            minimum: Number.isFinite(number) ? number : 0,
            maximum: Number.isFinite(numericCurrent) ? numericCurrent : 100,
            step
          };
        };
        const runHelperCurrent = (arg = entityState) => {
          entityState = arg || entityState;
          const number = Number(entityState?.state);
          const finiteNumber = !Number.isFinite(number) || ["unknown", "unavailable"].includes(String(entityState?.state || "").toLowerCase());
          if (!finiteNumber) {
            numeric = number;
          }
          const text = String(entityState?.attributes?.unit_of_measurement || "");
          elementNext.textContent = finiteNumber ? "--" : "" + number + text;
          elementCurrent.disabled = !interactive || state || finiteNumber;
          elementPrevious.disabled = !interactive || state || finiteNumber;
        };
        const invokeEntityService = async arg => {
          if (!interactive || state || !Number.isFinite(numeric)) {
            return;
          }
          const {
            minimum,
            maximum,
            step
          } = callback();
          const asString = String(step).split(".")[1]?.length || 0;
          const asNumber = Number(Math.max(minimum, Math.min(maximum, numeric + arg * step)).toFixed(asString));
          if (asNumber === numeric) {
            return;
          }
          const stateCurrent = entityState;
          state = true;
          runHelperCurrent({
            ...(entityState || {}),
            state: String(asNumber)
          });
          try {
            await this.callEntityService(text, "set_value", entityId, {
              value: asNumber
            });
            numeric = asNumber;
          } catch (error) {
            runHelperCurrent(stateCurrent);
            this.options.onError?.(error);
          } finally {
            state = false;
            runHelperCurrent(entityState);
          }
        };
        elementCurrent.addEventListener("click", () => invokeEntityService(-1));
        elementPrevious.addEventListener("click", () => invokeEntityService(1));
        runHelperCurrent(entityState);
        runHelper(entityId, runHelperCurrent);
        waterHeaterExtensionGridEl.append(waterHeaterExtensionNumberEl);
      } else if (text === "button") {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "hb-water-heater-extension-action";
        element.textContent = waterHeaterExtensionToggleEl;
        let state = false;
        const callback = entityId => {
          const asString = String(entityId?.state || "").toLowerCase() === "unavailable";
          element.disabled = !interactive || state || asString;
        };
        element.addEventListener("click", async () => {
          if (!!interactive && !state && !element.disabled && (!relatedEntityNeedsConfirmation(metadata) || !!window.confirm("确认执行“" + waterHeaterExtensionToggleEl + "”吗？"))) {
            state = true;
            callback(resolveEntityId(entityId));
            try {
              await this.callEntityService("button", "press", entityId);
            } catch (error) {
              this.options.onError?.(error);
            } finally {
              state = false;
              callback(resolveEntityId(entityId));
            }
          }
        });
        callback(resolveEntityId(entityId));
        runHelper(entityId, callback);
        waterHeaterExtensionGridEl.append(element);
      } else if (["sensor", "binary_sensor"].includes(text)) {
        const element = document.createElement("div");
        element.className = "hb-water-heater-extension-readonly";
        const elementCurrent = document.createElement("strong");
        elementCurrent.textContent = waterHeaterExtensionToggleEl;
        const elementNext = document.createElement("small");
        const syncVisualState = entityState => {
          const string = String(entityState?.state || "unknown");
          const lowered = ["unknown", "unavailable"].includes(string.toLowerCase());
          const textCurrent = String(entityState?.attributes?.unit_of_measurement || "");
          if (lowered) {
            elementNext.textContent = "不可用";
          } else if (text === "binary_sensor") {
            elementNext.textContent = string === "on" ? "已触发" : "正常";
          } else {
            elementNext.textContent = "" + string + (textCurrent ? " " + textCurrent : "");
          }
          element.classList.toggle("is-unavailable", lowered);
        };
        element.append(elementCurrent, elementNext);
        syncVisualState(resolveEntityId(entityId));
        runHelper(entityId, syncVisualState);
        waterHeaterExtensionGridEl.append(element);
      }
    }
    if (waterHeaterExtensionGridEl.childElementCount) {
      const element = document.createElement("strong");
      element.className = "hb-water-heater-extension-title";
      element.textContent = "扩展功能";
      relatedEntityExtensionsElCurrent.dataset.controlCount = String(waterHeaterExtensionGridEl.childElementCount);
      waterHeaterExtensionGridEl.dataset.controlCount = String(waterHeaterExtensionGridEl.childElementCount);
      relatedEntityExtensionsElCurrent.append(element, waterHeaterExtensionGridEl);
    }
    relatedEntityExtensionsElCurrent.stateHandlers = index;
    relatedEntityExtensionsElCurrent.relatedEntityIds = filtered.map(bathHeaterLightControlEl => bathHeaterLightControlEl.entityId);
    return relatedEntityExtensionsElCurrent;
  }
  createBathHeaterLightControl(entityId, component, {
    interactive = true,
    onStateChange = null
  } = {}) {
    const element = document.createElement("section");
    element.className = "hb-bath-heater-light-control";
    const spanEl = document.createElement("span");
    const elementCurrent = document.createElement("i");
    elementCurrent.setAttribute("aria-hidden", "true");
    elementCurrent.textContent = "☀";
    const elementNext = document.createElement("strong");
    elementNext.textContent = String(component?.attributes?.friendly_name || "浴霸灯");
    const elementPrevious = document.createElement("output");
    spanEl.append(elementCurrent, elementNext, elementPrevious);
    const elementLocal = document.createElement("button");
    elementLocal.type = "button";
    elementLocal.disabled = !interactive;
    let state = component;
    let flag = false;
    const syncVisualState = (arg = state) => {
      state = arg || state;
      const unavailable = ["unknown", "unavailable"].includes(String(state?.state || ""));
      const isOn = state?.state === "on";
      element.classList.toggle("is-on", isOn && !unavailable);
      element.classList.toggle("is-unavailable", unavailable);
      elementPrevious.textContent = unavailable ? "不可用" : isOn ? "已开启" : "已关闭";
      elementLocal.textContent = isOn ? "关闭灯光" : "开启灯光";
      elementLocal.disabled = !interactive || flag || unavailable;
      elementLocal.setAttribute("aria-pressed", String(isOn));
      onStateChange?.({
        isOn,
        unavailable
      });
    };
    const callback = async () => {
      if (!interactive || flag) {
        return;
      }
      flag = true;
      const stateCurrent = state;
      syncVisualState({
        ...(state || {}),
        state: state?.state === "on" ? "off" : "on"
      });
      try {
        await this.callEntityService("homeassistant", "toggle", entityId);
      } catch (error) {
        syncVisualState(stateCurrent);
        this.options.onError?.(error);
      } finally {
        flag = false;
        syncVisualState(state);
      }
    };
    elementLocal.addEventListener("click", callback);
    element.append(spanEl, elementLocal);
    element.syncBathLightState = syncVisualState;
    element.toggleBathLight = callback;
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
    const elementCurrent = document.createElement("strong");
    elementCurrent.textContent = "正在加载设备状态…";
    const elementNext = document.createElement("span");
    elementNext.textContent = "状态到达后会自动显示，无需重新打开弹窗";
    climateDetailsLoadingEl.append(iconEl, elementCurrent, elementNext);
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
    const options = state?.roles || {};
    const filtered = [["backrest", "靠背角度"], ["leg", "腿部角度"], ["waist", "腰部角度"]].map(([role, label]) => ({
      role,
      label,
      entityId: String(options[role] || "")
    })).filter(arg => arg.entityId);
    const text = String(options.mode || "");
    const entry = this.entityMetadata.get(entityId);
    const mapped = entry?.deviceId ? [...this.entityMetadata.values()].filter(metadata => metadata.deviceId === entry.deviceId && ["button", "select"].includes(String(metadata.domain || metadata.entityId || "").split(".", 1)[0]) && metadata.entityId !== options.mode && entityMetadataIsAvailable(metadata)).sort((arg, second) => String(arg.entityId || "").localeCompare(String(second.entityId || ""))).map(arg => arg.entityId) : [];
    const entityDetailsDialogEl = [...new Set([String(options.memory1 || ""), String(options.memory2 || ""), ...mapped].filter(Boolean))].slice(0, 2);
    this.closeRuntimeDialog();
    const entityDetailsDialogElCurrent = document.createElement("dialog");
    entityDetailsDialogElCurrent.className = "hb-entity-details-dialog electric-bed-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, state?.deviceName || "电动床");
    const elementCurrent = document.createElement("span");
    divEl.append(element, elementCurrent);
    const elementNext = document.createElement("button");
    elementNext.type = "button";
    elementNext.textContent = "×";
    elementNext.setAttribute("aria-label", "关闭电动床详情");
    entityDetailsHeadingEl.append(divEl, elementNext);
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
    const buildElementTree = (electricBedAngleReadoutEl, electricBedAngleReadoutElCurrent) => {
      const readout = document.createElement("span");
      readout.className = "hb-electric-bed-angle-readout " + electricBedAngleReadoutEl;
      const strongEl = document.createElement("strong");
      const element = document.createElement("small");
      element.textContent = electricBedAngleReadoutElCurrent;
      readout.append(strongEl, element);
      return {
        readout,
        value: strongEl
      };
    };
    const tree = buildElementTree("back", "靠背");
    const elementPrevious = buildElementTree("waist", "腰部");
    const elementLocal = buildElementTree("legs", "腿部");
    const elementItem = document.createElement("strong");
    const elementEntry = document.createElement("small");
    electricBedVisualEl.append(electricBedModelEl, tree.readout, elementPrevious.readout, elementLocal.readout, elementItem, elementEntry);
    const electricBedUtilitiesEl = document.createElement("section");
    electricBedUtilitiesEl.className = "hb-electric-bed-utilities";
    const electricBedMainEl = document.createElement("section");
    electricBedMainEl.className = "hb-electric-bed-main";
    const electricBedAngleControlsEl = document.createElement("section");
    electricBedAngleControlsEl.className = "hb-electric-bed-angle-controls";
    const handlers = new Map();
    const list = [];
    const resolveEntityId = entityId => {
      const state = this.states.get(entityId);
      return state?.newState || state || {
        entityId: entityId,
        state: "unknown",
        attributes: {}
      };
    };
    const syncVisualState = (role, entityId, variant = "", electricBedControlEl = electricBedAngleControlsEl) => {
      const id = resolveEntityId(entityId);
      const element = document.createElement("section");
      element.className = "hb-electric-bed-control";
      if (role === "模式") {
        element.classList.add("hb-electric-bed-mode");
      }
      const elementCurrent = document.createElement("strong");
      elementCurrent.textContent = role;
      const controls = this.createCapabilityDetailsControls(entityId, id, {
        interactive: !preview,
        variant
      });
      controls.classList.add("hb-electric-bed-capability");
      element.append(elementCurrent, controls);
      electricBedControlEl.append(element);
      const sync = arg => controls.syncCapabilityState?.(arg);
      handlers.set(entityId, [sync]);
      list.push({
        role,
        entityId: entityId,
        sync,
        cleanup: () => controls.cleanupCapabilityDetails?.()
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
      const element = document.createElement("strong");
      element.textContent = "模式";
      const capabilitySelectEl = document.createElement("select");
      capabilitySelectEl.className = "hb-capability-select";
      capabilitySelectEl.disabled = true;
      capabilitySelectEl.setAttribute("aria-label", "模式");
      const elementCurrent = document.createElement("option");
      elementCurrent.textContent = "未识别到模式实体";
      capabilitySelectEl.append(elementCurrent);
      electricBedControlEl.append(element, capabilitySelectEl);
      electricBedUtilitiesEl.append(electricBedControlEl);
    }
    const electricBedMemoryEl = document.createElement("section");
    electricBedMemoryEl.className = "hb-electric-bed-memory";
    const elementList = document.createElement("strong");
    elementList.textContent = "记忆姿势";
    const electricBedMemoryListEl = document.createElement("div");
    electricBedMemoryListEl.className = "hb-electric-bed-memory-list";
    for (let state = 0; state < 2; state += 1) {
      const entityId = entityDetailsDialogEl[state] || "";
      const electricBedMemoryControlEl = entityId ? this.entityMetadata.get(entityId) : null;
      if (String(entityId).split(".", 1)[0] === "select") {
        const electricBedMemoryControlEl = document.createElement("section");
        electricBedMemoryControlEl.className = "hb-electric-bed-memory-control hb-electric-bed-control";
        const element = document.createElement("strong");
        element.textContent = "记忆姿势 " + (state + 1);
        const controls = this.createCapabilityDetailsControls(entityId, resolveEntityId(entityId), {
          interactive: !preview,
          variant: "electric-bed-memory",
          selectLabel: "姿势"
        });
        controls.classList.add("hb-electric-bed-capability");
        electricBedMemoryControlEl.append(element, controls);
        electricBedMemoryListEl.append(electricBedMemoryControlEl);
        const sync = arg => controls.syncCapabilityState?.(arg);
        handlers.set(entityId, [sync]);
        list.push({
          role: "memory" + (state + 1),
          entityId: entityId,
          sync,
          cleanup: () => controls.cleanupCapabilityDetails?.()
        });
        continue;
      }
      const element = document.createElement("button");
      element.type = "button";
      element.className = "hb-electric-bed-memory-button";
      element.textContent = electricBedMemoryControlEl?.name || electricBedMemoryControlEl?.originalName || "记忆姿势 " + (state + 1);
      element.disabled = preview || !entityId;
      element.classList.toggle("is-unavailable", !entityId);
      element.addEventListener("click", async () => {
        if (!preview && !!entityId && !element.disabled) {
          element.disabled = true;
          element.classList.add("is-pending");
          try {
            await this.callEntityService("button", "press", entityId);
            element.classList.add("is-success");
            window.setTimeout(() => element.classList.remove("is-success"), 900);
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element.classList.remove("is-pending");
            element.disabled = preview || !entityId;
          }
        }
      });
      electricBedMemoryListEl.append(element);
    }
    electricBedMemoryEl.append(elementList, electricBedMemoryListEl);
    electricBedUtilitiesEl.append(electricBedMemoryEl);
    if (!filtered.length) {
      const element = document.createElement("p");
      element.className = "hb-electric-bed-empty";
      element.textContent = "暂未识别到角度实体";
      electricBedAngleControlsEl.append(element);
    }
    electricBedMainEl.append(electricBedVisualEl, electricBedAngleControlsEl);
    electricBedDetailsBodyEl.append(electricBedUtilitiesEl, electricBedMainEl);
    entityDetailsCardEl.append(entityDetailsHeadingEl, electricBedDetailsBodyEl);
    entityDetailsDialogElCurrent.append(entityDetailsCardEl);
    const clampNumber = (detailsEntityId, fallback) => {
      const numeric = Number(fallback?.state);
      const number = Number(fallback?.attributes?.min);
      const numericCurrent = Number(fallback?.attributes?.max);
      if (Number.isFinite(numeric)) {
        if (!Number.isFinite(number) || !Number.isFinite(numericCurrent) || numericCurrent <= number) {
          return Math.max(0, Math.min(100, numeric));
        } else {
          return Math.max(0, Math.min(100, (numeric - number) / (numericCurrent - number) * 100));
        }
      } else {
        return 0;
      }
    };
    const applyElementStyle = () => {
      const state = resolveEntityId(options.backrest);
      const id = resolveEntityId(options.leg);
      const stateCurrent = resolveEntityId(options.waist);
      const runHelper = entityState => {
        const numeric = Number(entityState?.state);
        if (!Number.isFinite(numeric)) {
          return "--";
        }
        const text = String(entityState?.attributes?.unit_of_measurement || "°");
        return "" + numeric + text;
      };
      tree.value.textContent = runHelper(state);
      elementPrevious.value.textContent = runHelper(stateCurrent);
      elementLocal.value.textContent = runHelper(id);
      electricBedVisualEl.style.setProperty("--hb-bed-backrest-angle", clampNumber(options.backrest, state) * -0.42 + "deg");
      electricBedVisualEl.style.setProperty("--hb-bed-leg-angle", clampNumber(options.leg, id) * -0.28 + "deg");
      electricBedVisualEl.style.setProperty("--hb-bed-waist-angle", clampNumber(options.waist, stateCurrent) * -0.1 + "deg");
      const lowered = [state, id, stateCurrent].map(arg => String(arg?.state || "").toLowerCase());
      const matched = lowered.some(arg => arg === "unavailable");
      const stateNext = !matched && lowered.some(arg => arg === "unknown" || !arg);
      elementItem.textContent = matched ? "部分实体不可用" : stateNext ? "正在读取实体" : "设备在线";
      elementEntry.textContent = filtered.length === 3 ? "三个角度独立控制" : "正在读取电动床实体";
      elementCurrent.textContent = matched ? "部分功能不可用" : "";
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
      entityDetailsDialogElCurrent,
      handlers
    };
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogElCurrent);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogElCurrent;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, 760, 560);
    elementNext.addEventListener("click", () => entityDetailsDialogElCurrent.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogElCurrent, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", arg => {
      if (arg.key === "Escape") {
        entityDetailsDialogElCurrent.close();
      }
    });
    entityDetailsDialogElCurrent.addEventListener("close", () => {
      for (const item of list) {
        item.cleanup?.();
      }
      this.clearRuntimeDialogScale(entityDetailsDialogElCurrent);
      if (this.detailsDialog === entityDetailsDialogElCurrent) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogElCurrent) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogElCurrent.show();
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
    const callback = () => JSON.stringify([...entityId].filter(toggleEvent => /^(vacuum|select)\./.test(toggleEvent)).map(toggleEvent => {
      const newState = this.states.get(toggleEvent);
      const fan_speed_list = (newState?.newState || newState)?.attributes || {};
      return [toggleEvent, fan_speed_list.fan_speed_list, fan_speed_list.suction_level_list, fan_speed_list.cleaning_mode_list, fan_speed_list.options];
    }));
    const buildEntityStateMap = statesByEntityId => {
      for (const entityIdCurrent of entityId) {
        const entityStateEntry = statesByEntityId[entityIdCurrent] || {
          entityId: entityIdCurrent,
          state: "unavailable",
          attributes: {}
        };
        this.states.set(entityIdCurrent, entityStateEntry);
        if (this.detailsStateSync?.dialog === state) {
          for (const childStates of this.detailsStateSync.handlers.get(entityIdCurrent) || []) {
            childStates(entityStateEntry);
          }
        }
      }
      if (state && callback() !== entityDetailsDialogEl) {
        vacuumDetailsSubtitleEl();
      }
    };
    buildEntityStateMap(states);
    const element = componentNode => {
      for (const type of componentNode || []) {
        if (type.type === "vacuum-control" && type.bindings?.entity?.entityId === component.entityId) {
          return type;
        }
        const childStateMap = element(type.children);
        if (childStateMap) {
          return childStateMap;
        }
      }
      return null;
    };
    const entityDetailsHeadingEl = (this.document?.pages || []).map(components => element(components.components)).find(Boolean);
    const divEl = entityDetailsHeadingEl?.properties?.relatedEntities?.mode === "selected" ? (entityDetailsHeadingEl.properties.relatedEntities.entityIds || []).filter(item => entityId.has(item)) : [];
    const options = {
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
      this.showVacuumDetails(options, {
        preview: !!this.options.editable,
        interaction3d: {
          root,
          frame,
          popupOpacity,
          getPresentationLayout
        }
      });
      state = this.detailsDialog;
      entityDetailsDialogEl = callback();
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
    preview: element = false,
    interaction3d: root = null
  } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该扫地机器人控件没有关联实体。");
    }
    const state = selectedRelatedEntityIds(component);
    this.closeRuntimeDialog();
    const entry = this.states.get(entityId);
    let entityState = entry?.newState || entry || {
      state: "unknown",
      attributes: {}
    };
    const entityDetailsDialogEl = document.createElement("dialog");
    entityDetailsDialogEl.className = "hb-entity-details-dialog vacuum-details";
    if (root) {
      entityDetailsDialogEl.classList.add("i3d-vacuum-details");
    }
    const append = document.createElement("div");
    append.className = "hb-entity-details-card";
    append.classList.add("hb-vacuum-details-card");
    const appendCurrent = document.createElement("div");
    appendCurrent.className = "hb-entity-details-heading";
    const stateCurrent = document.createElement("div");
    const vacuumDetailsStrongEl = document.createElement("strong");
    const vacuumFriendlyTitle = String(entityState.attributes?.friendly_name || "扫地机器人").replace(/^\d+/, "") || "扫地机器人";
    vacuumDetailsStrongEl.textContent = componentDialogTitle(component, vacuumFriendlyTitle);
    const vacuumDetailsSubtitleEl = document.createElement("span");
    vacuumDetailsSubtitleEl.className = "hb-vacuum-details-subtitle";
    const vacuumDetailsButtonEl = document.createElement("button");
    vacuumDetailsButtonEl.type = "button";
    vacuumDetailsButtonEl.setAttribute("aria-label", "关闭扫地机器人详情");
    vacuumDetailsButtonEl.textContent = "×";
    stateCurrent.append(vacuumDetailsStrongEl, vacuumDetailsSubtitleEl);
    appendCurrent.append(stateCurrent, vacuumDetailsButtonEl);
    const divEl = document.createElement("div");
    divEl.className = "hb-vacuum-details-layout";
    const appendNext = document.createElement("section");
    appendNext.className = "hb-vacuum-details-overview";
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
    const elementCurrent = document.createElement("i");
    elementCurrent.className = "hb-vacuum-robot-brush";
    const vacuumRobotMopEl = document.createElement("i");
    vacuumRobotMopEl.className = "hb-vacuum-robot-mop left";
    const buildElementTree = document.createElement("i");
    buildElementTree.className = "hb-vacuum-robot-mop right";
    vacuumRobotEl.append(vacuumRobotLidarEl, vacuumRobotSensorEl, vacuumRobotBumperEl, elementCurrent, vacuumRobotMopEl, buildElementTree);
    const elementNext = document.createElement("div");
    elementNext.className = "hb-vacuum-battery";
    const vacuumDetailsStrongElCurrent = document.createElement("strong");
    const elementPrevious = document.createElement("small");
    elementPrevious.textContent = "电量";
    elementNext.append(vacuumDetailsStrongElCurrent, elementPrevious);
    vacuumBatteryRingEl.append(vacuumRobotEl);
    appendCurrent.append(elementNext);
    const presenceDetailsTimelineEl = document.createElement("span");
    presenceDetailsTimelineEl.className = "hb-vacuum-visual-status";
    vacuumVisualEl.append(vacuumBatteryRingEl, presenceDetailsTimelineEl);
    const divElCurrent = document.createElement("div");
    divElCurrent.className = "hb-vacuum-details-stats";
    const callback = (element, elementCurrent) => {
      const append = document.createElement("div");
      const vacuumDetailsStatValueEl = document.createElement("span");
      vacuumDetailsStatValueEl.className = "hb-vacuum-details-stat-value";
      const vacuumDetailsIEl = document.createElement("i");
      vacuumDetailsIEl.textContent = elementCurrent;
      vacuumDetailsIEl.setAttribute("aria-hidden", "true");
      const statusEmphasisEl = document.createElement("strong");
      const vacuumDetailsSmallEl = document.createElement("small");
      vacuumDetailsSmallEl.textContent = element;
      vacuumDetailsStatValueEl.append(vacuumDetailsIEl, statusEmphasisEl);
      append.append(vacuumDetailsStatValueEl, vacuumDetailsSmallEl);
      divElCurrent.append(append);
      return statusEmphasisEl;
    };
    const elementLocal = callback("本次面积", "◇");
    const divElNext = callback("清扫时长", "◷");
    if (!root) {
      appendNext.append(vacuumVisualEl);
    }
    appendNext.append(divElCurrent);
    const appendPrevious = document.createElement("section");
    appendPrevious.className = "hb-vacuum-details-controls";
    const vacuumDetailsActionsEl = document.createElement("div");
    vacuumDetailsActionsEl.className = "hb-vacuum-details-actions";
    const createChildElement = (elementCurrent, elementNext, elementPrevious, service) => {
      const nowMs = document.createElement("button");
      nowMs.type = "button";
      nowMs.dataset.service = service;
      nowMs.disabled = element;
      const length = document.createElement("i");
      length.textContent = elementPrevious;
      length.setAttribute("aria-hidden", "true");
      const rounded = document.createElement("span");
      const vacuumDetailsStrongEl = document.createElement("strong");
      vacuumDetailsStrongEl.textContent = elementCurrent;
      const vacuumDetailsSmallEl = document.createElement("small");
      vacuumDetailsSmallEl.textContent = elementNext;
      rounded.append(vacuumDetailsStrongEl, vacuumDetailsSmallEl);
      nowMs.append(length, rounded);
      vacuumDetailsActionsEl.append(nowMs);
      return {
        button: nowMs,
        name: vacuumDetailsStrongEl,
        description: vacuumDetailsSmallEl
      };
    };
    const runHelper = [["start", "开始清扫", "启动全屋任务", "▶"], ["pause", "暂停", "保留当前进度", "Ⅱ"], ["stop", "停止", "结束当前任务", "■"], ["return_to_base", "回充", "返回充电座", "⌂"], ["locate", "定位", "让设备发出声音", "◎"], ["clean_spot", "局部清扫", "清扫当前位置", "⌖"]];
    const items = new Map(runHelper.map(([item, value, entry, current]) => [item, createChildElement(value, entry, current, item)]));
    const state5 = items.get("start");
    const handlers = items.get("pause");
    const rendererRuntimeDialogLayerEl = items.get("stop");
    const rendererRuntimeDialogLayerElCurrent = items.get("return_to_base");
    const actionEntry = items.get("locate");
    const actionEntryCurrent = items.get("clean_spot");
    appendPrevious.append(vacuumDetailsActionsEl);
    const normalizeModeKey = modeValue => String(modeValue || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const labels = {
      sweeping: "扫地",
      mopping: "拖地",
      sweeping_and_mopping: "扫拖同步",
      mopping_after_sweeping: "先扫后拖"
    };
    const labelsCurrent = {
      silent: "静音",
      quiet: "静音",
      standard: "标准",
      strong: "强力",
      turbo: "超强"
    };
    const push = [];
    const buildOptionControl = ({
      label: elementCurrent,
      detail: elementNext,
      options: length,
      current: currentValue,
      labels: optionLabels,
      onSelect: onSelect,
      enabled: enabled = true
    }) => {
      if (!length.length) {
        return null;
      }
      const group = document.createElement("section");
      group.className = "hb-vacuum-details-option-group";
      const append = document.createElement("div");
      const vacuumDetailsStrongEl = document.createElement("strong");
      vacuumDetailsStrongEl.textContent = elementCurrent;
      const vacuumDetailsSmallEl = document.createElement("small");
      vacuumDetailsSmallEl.textContent = elementNext;
      append.append(vacuumDetailsStrongEl, vacuumDetailsSmallEl);
      const vacuumDetailsOptionsEl = document.createElement("div");
      vacuumDetailsOptionsEl.className = "hb-vacuum-details-options";
      const entries = length.map(optionValue => {
        const key = normalizeModeKey(optionValue);
        const vacuumDetailsButtonEl = document.createElement("button");
        vacuumDetailsButtonEl.type = "button";
        vacuumDetailsButtonEl.textContent = optionLabels[key] || String(optionValue);
        vacuumDetailsButtonEl.disabled = element || !enabled;
        vacuumDetailsButtonEl.addEventListener("click", () => onSelect(optionValue, vacuumDetailsButtonEl));
        vacuumDetailsOptionsEl.append(vacuumDetailsButtonEl);
        return {
          button: vacuumDetailsButtonEl,
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
      push.push({
        group,
        sync
      });
      group.append(append, vacuumDetailsOptionsEl);
      appendPrevious.append(group);
      return {
        group,
        sync,
        entries
      };
    };
    const fan_speed_list = entityState.attributes || {};
    const cleaningModeEntityId = "select." + entityId.slice(entityId.indexOf(".") + 1) + "_cleaning_mode";
    const entity = relatedDeviceEntity(this.entityMetadata, entityId, "select", "cleaning_mode", cleaningModeEntityId);
    const cleaningModeSelectEntityId = String(entity?.entityId || "");
    const newState = cleaningModeSelectEntityId ? this.states.get(cleaningModeSelectEntityId) : null;
    let stateEntry = newState?.newState || newState || null;
    const entityIdCurrent = relatedVacuumBatteryEntity(this.entityMetadata, this.states, entityId);
    const fanSpeedSelectEntityId = String(entityIdCurrent?.entityId || "");
    const newStateCurrent = fanSpeedSelectEntityId ? this.states.get(fanSpeedSelectEntityId) : null;
    let batteryEntityState = newStateCurrent?.newState || newStateCurrent || null;
    let sync = null;
    const syncCleaningModeFromState = state => {
      if (state) {
        stateEntry = state;
        sync?.sync(state.state);
      }
    };
    let vacuumServicePending = false;
    const setVacuumServicePending = pending => {
      vacuumServicePending = pending;
      appendPrevious.classList.toggle("is-pending", pending);
      for (const disabled of appendPrevious.querySelectorAll(":scope > .hb-vacuum-details-actions button, :scope > .hb-vacuum-details-option-group button")) {
        disabled.disabled = element || pending || disabled.dataset.unsupported === "true";
      }
    };
    const invokeVacuumService = async (domain, service, targetEntityId, serviceData, optimisticState = null, onSuccess = syncVacuumDetailsState, baseState = entityState) => {
      if (element || vacuumServicePending) {
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
    const options = Array.isArray(stateEntry?.attributes?.options) ? stateEntry.attributes.options : Array.isArray(fan_speed_list.cleaning_mode_list) ? fan_speed_list.cleaning_mode_list : [];
    const enabled = !!cleaningModeSelectEntityId;
    sync = buildOptionControl({
      label: "清洁模式",
      detail: enabled ? "选择本次任务方式" : "当前设备未提供模式切换实体",
      options,
      current: stateEntry?.state || fan_speed_list.cleaning_mode,
      labels,
      enabled,
      onSelect: async state => {
        const attributes = stateEntry || {
          state: fan_speed_list.cleaning_mode || "unknown",
          attributes: {
            options
          }
        };
        const optimisticCleaningModeState = {
          ...attributes,
          state: state,
          attributes: {
            ...(attributes.attributes || {}),
            options
          }
        };
        await invokeVacuumService("select", "select_option", cleaningModeSelectEntityId, {
          option: state
        }, optimisticCleaningModeState, syncCleaningModeFromState, attributes);
      }
    });
    if (sync && !enabled) {
      for (const actionEntry of sync.entries) {
        actionEntry.button.dataset.unsupported = "true";
      }
    }
    const optionsCurrent = Array.isArray(fan_speed_list.fan_speed_list) && fan_speed_list.fan_speed_list.length ? fan_speed_list.fan_speed_list : Array.isArray(fan_speed_list.suction_level_list) ? fan_speed_list.suction_level_list : [];
    const control = buildOptionControl({
      label: "吸力",
      detail: "按地面情况调节",
      options: optionsCurrent,
      current: fan_speed_list.fan_speed || fan_speed_list.suction_level,
      labels: labelsCurrent,
      onSelect: async fan_speed => {
        const attributes = entityState;
        const optimisticFanSpeedState = {
          ...attributes,
          attributes: {
            ...(attributes.attributes || {}),
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
      interactive: !element,
      excludedEntityIds: [cleaningModeSelectEntityId, fanSpeedSelectEntityId].filter(Boolean)
    }) : null;
    const vacuumDetailsWarningEl = document.createElement("p");
    vacuumDetailsWarningEl.className = "hb-vacuum-details-warning";
    appendPrevious.append(vacuumDetailsWarningEl);
    divEl.append(appendNext, appendPrevious);
    append.append(appendCurrent, divEl);
    if (stateHandlers) {
      append.append(stateHandlers);
      entityDetailsDialogEl.classList.add("has-related-extensions");
    }
    entityDetailsDialogEl.append(append);
    const vacuumStatusLabel = state => {
      const washing = state?.attributes || {};
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
      const vacuumStateKey = String(washing.vacuum_state || state?.state || "").toLowerCase();
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
      }[vacuumStateKey] || String(state?.state || "状态未知");
    };
    const finiteOrFallback = (rawNumber, fallback = "--") => Number.isFinite(Number(rawNumber)) ? Number(rawNumber) : fallback;
    const isVacuumWorking = attributes => {
      const running = attributes?.attributes || {};
      return !!running.running || !!running.returning || !!running.washing || !!running.drying || !!running.mapping || ["cleaning", "returning"].includes(String(attributes?.state || "").toLowerCase());
    };
    const refreshBatteryDisplay = () => {
      const batteryPercent = vacuumBatteryPercent(entityState, batteryEntityState);
      vacuumDetailsStrongElCurrent.textContent = batteryPercent === null ? "--" : Math.round(batteryPercent) + "%";
    };
    const updateBatteryEntityState = nextBatteryState => {
      batteryEntityState = nextBatteryState || batteryEntityState;
      refreshBatteryDisplay();
    };
    function syncVacuumDetailsState(state) {
      if (!state) {
        return;
      }
      entityState = state;
      const cleaning_mode = state.attributes || {};
      const element = vacuumStatusLabel(state);
      const isWorking = isVacuumWorking(state);
      const isPaused = !!cleaning_mode.paused || !!cleaning_mode.washing_paused || state.state === "paused";
      const isReturning = !!cleaning_mode.returning || state.state === "returning";
      const normalizedCleaningMode = normalizeModeKey(cleaning_mode.cleaning_mode);
      const isSweeping = ["sweeping", "sweeping_and_mopping", "mopping_after_sweeping"].includes(normalizedCleaningMode);
      const isMopping = ["mopping", "sweeping_and_mopping", "mopping_after_sweeping"].includes(normalizedCleaningMode);
      const has = new Set(vacuumSupportedActions(state));
      for (const [actionKey, actionEntry] of items) {
        actionEntry.button.hidden = !has.has(actionKey) || !!root && actionKey === "clean_spot";
      }
      const length = [...items.values()].filter(button => !button.button.hidden);
      const visibleActionCount = length.length;
      vacuumDetailsActionsEl.hidden = visibleActionCount === 0;
      vacuumDetailsActionsEl.classList.toggle("has-many-actions", visibleActionCount > 3);
      for (const actionEntry of items.values()) {
        actionEntry.button.classList.remove("is-last-row-pair", "is-last-row-single");
      }
      const lastRowCount = visibleActionCount % 3 || Math.min(visibleActionCount, 3);
      if (lastRowCount === 2) {
        for (const actionEntry of length.slice(-2)) {
          actionEntry.button.classList.add("is-last-row-pair");
        }
      } else if (lastRowCount === 1) {
        length.at(-1)?.button.classList.add("is-last-row-single");
      }
      vacuumDetailsSubtitleEl.textContent = element;
      vacuumDetailsSubtitleEl.classList.toggle("is-active", isWorking && !isPaused);
      presenceDetailsTimelineEl.textContent = element;
      refreshBatteryDisplay();
      vacuumVisualEl.classList.toggle("is-working", isWorking && !isPaused);
      vacuumVisualEl.classList.toggle("is-paused", isPaused);
      vacuumVisualEl.classList.toggle("is-returning", isReturning);
      vacuumVisualEl.classList.toggle("is-sweeping", isSweeping);
      vacuumVisualEl.classList.toggle("is-mopping", isMopping);
      elementLocal.textContent = finiteOrFallback(cleaning_mode.cleaned_area) + " m²";
      divElNext.textContent = finiteOrFallback(cleaning_mode.cleaning_time) + " min";
      state5.button.classList.toggle("active", isWorking && !isPaused && !isReturning);
      handlers.button.classList.toggle("active", isPaused);
      rendererRuntimeDialogLayerEl.button.classList.toggle("active", false);
      rendererRuntimeDialogLayerElCurrent.button.classList.toggle("active", isReturning);
      actionEntry.button.classList.toggle("active", false);
      actionEntryCurrent.button.classList.toggle("active", isWorking && !isPaused && !isReturning && state.state === "cleaning");
      state5.name.textContent = isPaused ? "继续清扫" : "开始清扫";
      if (!cleaningModeSelectEntityId) {
        sync?.sync(cleaning_mode.cleaning_mode);
      }
      control?.sync(cleaning_mode.fan_speed || cleaning_mode.suction_level);
      const errorText = String(cleaning_mode.error || "").trim();
      const lowWaterWarningText = String(cleaning_mode.low_water_warning || "").trim();
      const push = [];
      if (errorText && !/^no error$/i.test(errorText)) {
        push.push(errorText);
      }
      if (lowWaterWarningText && !/^no warning$/i.test(lowWaterWarningText)) {
        push.push(lowWaterWarningText);
      }
      vacuumDetailsWarningEl.textContent = push.length ? "注意：" + push.join(" · ") : "";
      vacuumDetailsWarningEl.hidden = !push.length;
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
    rendererRuntimeDialogLayerElCurrent.button.addEventListener("click", () => invokeVacuumService("vacuum", "return_to_base", entityId, {}, {
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
    actionEntryCurrent.button.addEventListener("click", () => invokeVacuumService("vacuum", "clean_spot", entityId, {}, {
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
    const rendererRuntimeDialogLayerElNext = document.createElement("div");
    rendererRuntimeDialogLayerElNext.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerElNext.tabIndex = -1;
    rendererRuntimeDialogLayerElNext.append(entityDetailsDialogEl);
    this.container.append(rendererRuntimeDialogLayerElNext);
    this.detailsDialog = entityDetailsDialogEl;
    const map = new Map([[entityId, [syncVacuumDetailsState]]]);
    if (cleaningModeSelectEntityId) {
      map.set(cleaningModeSelectEntityId, [syncCleaningModeFromState]);
    }
    if (fanSpeedSelectEntityId) {
      map.set(fanSpeedSelectEntityId, [updateBatteryEntityState]);
    }
    for (const [rendererRuntimeDialogLayerEl, presenceTimelineItem] of stateHandlers?.stateHandlers || []) {
      map.set(rendererRuntimeDialogLayerEl, presenceTimelineItem);
    }
    this.detailsStateSync = {
      dialog: entityDetailsDialogEl,
      handlers: map
    };
    let observe = null;
    if (root) {
      rendererRuntimeDialogLayerElNext.classList.add("i3d-vacuum-dialog-layer");
      (root.root || this.container).append(rendererRuntimeDialogLayerElNext);
      entityDetailsDialogEl.style.setProperty("--i3d-panel-opacity", String(Math.max(0, Math.min(100, Number.isFinite(root.popupOpacity) ? root.popupOpacity : 74)) / 100));
      const resizeInteraction3d = () => {
        const viewportRootEl = root.root || this.container;
        const viewportWidth = viewportRootEl.clientWidth;
        const viewportHeight = viewportRootEl.clientHeight;
        const width = root.getPresentationLayout?.();
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
      observe.observe(root.root || this.container);
      if (root.frame) {
        observe.observe(root.frame);
      }
      resizeInteraction3d();
    } else {
      this.registerRuntimeDialogScale(rendererRuntimeDialogLayerElNext, entityDetailsDialogEl, 840, stateHandlers ? 560 : 458);
    }
    vacuumDetailsButtonEl.addEventListener("click", () => entityDetailsDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerElNext, entityDetailsDialogEl, append);
    rendererRuntimeDialogLayerElNext.addEventListener("keydown", key => {
      if (key.key === "Escape") {
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
      rendererRuntimeDialogLayerElNext.remove();
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
    const sensorKind = ["presence", "door-window", "water-leak", "smoke", "natural-gas"].includes(component.properties?.sensorKind) ? component.properties.sensorKind : "presence";
    const entityIdCurrent = {
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
    }[sensorKind];
    let entry = this.states.get(entityId)?.newState || this.states.get(entityId) || {
      entityId,
      state: "unknown",
      attributes: {}
    };
    const state = Math.max(1, Math.min(168, Number(component.properties?.historyHours || 24)));
    const set = this.historySeries.get(entityId)?.points || [];
    const text = component.properties?.iconOnColor || component.properties?.occupiedColor || "#ffffff";
    const entityState = component.properties?.iconColor || component.properties?.clearColor || "#758189";
    const callback = (presenceEntityId, now = Date.now()) => presenceSensorPresentation(presenceEntityId, "auto", {
      ...presenceMotionEventConfig(entityId, presenceEntityId, this.entityMetadata, this.states, component.properties),
      now
    });
    const entityDetailsDialogEl = document.createElement("dialog");
    entityDetailsDialogEl.className = "hb-entity-details-dialog presence-details";
    entityDetailsDialogEl.dataset.sensorKind = sensorKind;
    entityDetailsDialogEl.style.setProperty("--hb-presence-occupied", text);
    entityDetailsDialogEl.style.setProperty("--hb-presence-clear", entityState);
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const element = document.createElement("div");
    element.className = "hb-entity-details-heading";
    const airer = document.createElement("div");
    const presenceDetailsStrongEl = document.createElement("strong");
    presenceDetailsStrongEl.textContent = componentDialogTitle(component, entry.attributes?.friendly_name || entityIdCurrent.title);
    const stateCurrent = document.createElement("span");
    airer.append(presenceDetailsStrongEl, stateCurrent);
    const finiteNumber = document.createElement("button");
    finiteNumber.type = "button";
    finiteNumber.textContent = "×";
    finiteNumber.setAttribute("aria-label", "关闭弹窗");
    element.append(airer, finiteNumber);
    const presenceDetailsBodyEl = document.createElement("div");
    presenceDetailsBodyEl.className = "hb-presence-details-body";
    const append = document.createElement("section");
    append.className = "hb-presence-details-visual";
    let tilt = null;
    if (sensorKind === "presence") {
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
      const element = document.createElement("span");
      element.className = "arm right";
      const presenceDetailsSpanElCurrent = document.createElement("span");
      presenceDetailsSpanElCurrent.className = "leg left";
      const presenceDetailsSpanElNext = document.createElement("span");
      presenceDetailsSpanElNext.className = "leg right";
      presenceSensorPersonEl.append(timelineIconEl, timelineBoldEl, presenceDetailsSpanEl, element, presenceDetailsSpanElCurrent, presenceDetailsSpanElNext);
      append.append(presenceSensorSpaceEl, presenceSensorFloorEl, presenceSensorPersonEl);
    } else {
      tilt = renderRegisteredComponent({
        ...component,
        position: {
          ...(component.position || {}),
          width: 100,
          height: 100
        }
      }, {
        states: new Map([[entityId, entry]]),
        entityMetadata: this.entityMetadata,
        editable: false,
        previewState: "auto",
        document: this.document
      });
      tilt.classList.add("hb-presence-details-sensor");
      append.append(tilt);
    }
    const presenceDetailsStrongElCurrent = document.createElement("strong");
    const position = document.createElement("small");
    append.append(presenceDetailsStrongElCurrent, position);
    const presenceDetailsMetricsEl = document.createElement("section");
    presenceDetailsMetricsEl.className = "hb-presence-details-metrics";
    const positionCommandEntityId = element => {
      const append = document.createElement("div");
      const presenceDetailsSmallEl = document.createElement("small");
      presenceDetailsSmallEl.textContent = element;
      const sensorNameEmphasisEl = document.createElement("strong");
      append.append(presenceDetailsSmallEl, sensorNameEmphasisEl);
      presenceDetailsMetricsEl.append(append);
      return sensorNameEmphasisEl;
    };
    const id = positionCommandEntityId("当前状态持续");
    const positionCommandState = positionCommandEntityId("最近检测到人");
    const stateNext = positionCommandEntityId(state + " 小时有人时长");
    const presenceDetailsTimelineEl = document.createElement("section");
    presenceDetailsTimelineEl.className = "hb-presence-details-timeline";
    const statePrevious = document.createElement("div");
    const presenceDetailsStrongElNext = document.createElement("strong");
    presenceDetailsStrongElNext.textContent = state + " 小时在家时间轴";
    const stateLocal = document.createElement("span");
    stateLocal.textContent = "亮色为有人";
    statePrevious.append(presenceDetailsStrongElNext, stateLocal);
    const airerActionEntityIds = document.createElement("div");
    const positionCurrent = document.createElement("div");
    positionCurrent.innerHTML = "<span>" + state + " 小时前</span><span>现在</span>";
    presenceDetailsTimelineEl.append(statePrevious, airerActionEntityIds, positionCurrent);
    presenceDetailsBodyEl.append(append, presenceDetailsMetricsEl, presenceDetailsTimelineEl);
    entityDetailsCardEl.append(element, presenceDetailsBodyEl);
    entityDetailsDialogEl.append(entityDetailsCardEl);
    const positionState = presenceState => {
      if (!Number.isFinite(presenceState)) {
        return "--";
      }
      const getFullYear = new Date(presenceState);
      const date = new Date();
      const isSameDay = getFullYear.getFullYear() === date.getFullYear() && getFullYear.getMonth() === date.getMonth() && getFullYear.getDate() === date.getDate();
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
      const length = presenceHistoryBuckets(set, entry, Date.now(), state, 48, presenceMotionEventConfig(entityId, entry, this.entityMetadata, this.states, component.properties));
      airerActionEntityIds.replaceChildren(...length.map((presenceKey, bucketOffset) => {
        const presenceBucketMarkEl = document.createElement("i");
        presenceBucketMarkEl.className = "is-" + presenceKey;
        const minutesAgo = Math.round(state * 60 * (length.length - bucketOffset - 1) / length.length);
        presenceBucketMarkEl.title = (minutesAgo ? minutesAgo + " 分钟前" : "现在") + "：" + {
          occupied: "有人",
          clear: "无人",
          unavailable: "离线",
          unknown: "未知"
        }[presenceKey];
        return presenceBucketMarkEl;
      }));
      const occupiedBucketCount = length.filter(bucketState => bucketState === "occupied").length;
      const occupiedMinutes = Math.round(state * 60 * occupiedBucketCount / Math.max(1, length.length));
      stateNext.textContent = occupiedMinutes >= 60 ? Math.floor(occupiedMinutes / 60) + " 小时 " + occupiedMinutes % 60 + " 分钟" : occupiedMinutes + " 分钟";
    };
    const stateItem = () => {
      const motionEventConfig = presenceMotionEventConfig(entityId, entry, this.entityMetadata, this.states, component.properties);
      const push = set.map(timestamp => ({
        timestamp: Date.parse(timestamp?.timestamp),
        state: {
          state: timestamp?.value
        }
      })).filter(timestamp => Number.isFinite(timestamp.timestamp) && presenceSensorPresentation({
        state: timestamp?.state?.state,
        lastChanged: new Date(timestamp.timestamp).toISOString()
      }, "auto", {
        ...motionEventConfig,
        now: timestamp.timestamp,
        noMotionSeconds: null,
        noMotionStateTimestamp: null
      }).key === "occupied");
      const timestamp = presenceStateTimestamp(entry);
      if (callback(entry).key === "occupied" && Number.isFinite(timestamp)) {
        push.push({
          timestamp: timestamp
        });
      }
      if (push.length) {
        return Math.max(...push.map(timestamp => timestamp.timestamp));
      } else {
        return null;
      }
    };
    const size = sensorConfig => {
      entry = sensorConfig || entry;
      const key = callback(entry);
      const stateTimestamp = presenceStateTimestamp(entry);
      entityDetailsDialogEl.dataset.presenceState = key.key;
      append.className = "hb-presence-details-visual is-" + key.key;
      const element = entityIdCurrent[key.key] || entityIdCurrent.unknown;
      stateCurrent.textContent = element;
      stateCurrent.classList.toggle("is-on", key.key === "occupied");
      presenceDetailsStrongElCurrent.textContent = element;
      position.textContent = key.key === "occupied" ? entityIdCurrent.hintOccupied : key.key === "clear" ? entityIdCurrent.hintClear : key.key === "unavailable" ? "设备当前不可用" : "正在等待状态";
      if (tilt) {
        const presenceSensorClassMap = {
          "door-window": "hb-door-window-sensor is-" + (key.key === "occupied" ? "open" : key.key),
          "water-leak": "hb-water-leak-sensor is-" + (key.key === "occupied" ? "wet" : key.key),
          smoke: "hb-smoke-sensor is-" + (key.key === "occupied" ? "alert" : key.key),
          "natural-gas": "hb-natural-gas-sensor is-" + (key.key === "occupied" ? "alert" : key.key)
        }[sensorKind];
        tilt.className = presenceSensorClassMap + " hb-presence-details-sensor";
        tilt.dataset.sensorState = key.key;
        tilt.setAttribute("aria-label", entityIdCurrent.title + "：" + element);
      }
      id.textContent = ["unknown", "unavailable"].includes(key.key) ? "--" : formatPresenceDuration(stateTimestamp);
      positionCommandState.textContent = positionState(stateItem());
      motorReversed();
    };
    size(entry);
    const config = presenceMotionEventConfig(entityId, entry, this.entityMetadata, this.states, component.properties);
    const momentary = new Map([[entityId, [size]]]);
    for (const presenceDetailsApi of config.companionEntityIds) {
      momentary.set(presenceDetailsApi, [() => size(entry)]);
    }
    const interval = config.motionEvent ? window.setInterval(() => size(entry), 1000) : null;
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl;
    this.detailsStateSync = {
      dialog: entityDetailsDialogEl,
      handlers: momentary
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl, 760, 560);
    finiteNumber.addEventListener("click", () => entityDetailsDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", key => {
      if (key.key === "Escape") {
        entityDetailsDialogEl.close();
      }
    });
    entityDetailsDialogEl.addEventListener("close", () => {
      if (interval) {
        window.clearInterval(interval);
      }
      this.clearRuntimeDialogScale(entityDetailsDialogEl);
      if (this.detailsDialog === entityDetailsDialogEl) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl.show();
  }
  showEntityDetails(type, {
    preview = false
  } = {}) {
    const detailsBoundEntityId = type.bindings?.entity?.entityId;
    if (!detailsBoundEntityId) {
      throw new Error("该控件没有关联实体。");
    }
    const detailsBoundEntityIdText = String(detailsBoundEntityId);
    const size = this.deviceProfile(detailsBoundEntityIdText);
    type = applyXiaomiDeviceProfile(type, size);
    const scale = detailsBoundEntityIdText.split(".", 1)[0];
    const value = type.properties?.deviceType === "electric-bed" || size?.deviceType === "electric-bed";
    if (!this.entityCatalogReady) {
      this.deferEntityDetailsUntilReady({
        ...type,
        properties: {
          ...(type.properties || {}),
          __catalogRetry: true
        }
      }, preview, value ? "electric-bed-catalog" : "catalog");
      if (value) {
        this.showElectricBedLoadingDetails(type, {
          preview
        });
      }
      return;
    }
    if (!size && scale === "number" && !type.properties?.__catalogRetry) {
      this.deferEntityDetailsUntilReady({
        ...type,
        properties: {
          ...(type.properties || {}),
          __catalogRetry: true
        }
      }, preview, value ? "electric-bed-catalog" : "catalog");
      if (value) {
        this.showElectricBedLoadingDetails(type, {
          preview
        });
      }
      return;
    }
    if (scale === "water_heater" && !this.waterHeaterDetailsReady(detailsBoundEntityIdText)) {
      this.deferEntityDetailsUntilReady(type, preview);
      return;
    }
    window.clearTimeout(this.pendingEntityDetails?.timer);
    this.pendingEntityDetails = null;
    if (type.type === "presence-sensor") {
      this.showPresenceDetails(type, {
        preview
      });
      return;
    }
    if (size?.deviceType === "electric-bed") {
      this.showElectricBedDetails(type, {
        preview
      });
      return;
    }
    if (size?.deviceType === "air-purifier" && scale === "fan" && ["icon-button", "device-button", "icon-button-effect"].includes(type.type)) {
      type = {
        ...type,
        type: "air-purifier",
        properties: {
          ...(type.properties || {}),
          deviceType: "air-purifier"
        }
      };
    }
    const clamped = new Set(["line-chart", "media-player", "air-purifier", "air-conditioner", "water-heater", "vacuum-control", "electric-bed"]).has(type.type);
    if (type.type === "media-player" || !clamped && scale === "media_player") {
      this.showMediaPlayerDetails(type, {
        preview
      });
      return;
    }
    if (type.type === "air-purifier") {
      this.showAirPurifierDetails(type, {
        preview
      });
      return;
    }
    if (["air-conditioner", "bath-heater"].includes(size?.deviceType) && ["climate", "fan"].includes(scale) && !clamped && type.type !== "air-conditioner") {
      type = {
        ...type,
        type: "air-conditioner"
      };
    }
    if (type.type === "vacuum-control" || !clamped && detailsBoundEntityIdText.startsWith("vacuum.")) {
      this.showVacuumDetails(type, {
        preview
      });
      return;
    }
    const appliedScaleX = this.states.get(detailsBoundEntityIdText);
    const appliedScaleY = appliedScaleX?.newState || appliedScaleX;
    const friendly_name = appliedScaleY?.attributes || {};
    const isLineChart = type.type === "line-chart";
    const isCoverEntity = !isLineChart && scale === "cover";
    const coverKind = ["standard", "dream", "airer"].includes(type.properties?.coverKind) ? type.properties.coverKind : "auto";
    const airer = isCoverEntity && coverComponentIsAirer(type, detailsBoundEntityIdText, appliedScaleY, this.entityMetadata, this.deviceMetadata);
    const supportedFeatures = Number(friendly_name.supported_features || 0);
    const coverIdentityText = detailsBoundEntityIdText + " " + (friendly_name.friendly_name || "") + " " + (type.properties?.label || "");
    const supportsTilt = Number.isFinite(Number(friendly_name.current_tilt_position)) || !!(supportedFeatures & 240);
    const looksLikeDreamCurtain = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(coverIdentityText);
    const dream = isCoverEntity && !airer && (coverKind === "dream" || coverKind === "auto" && (supportsTilt || looksLikeDreamCurtain));
    const tilt = dream && supportsTilt;
    const airerLightEntityId = (airer ? relatedAirerLightEntity(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const newState = airerLightEntityId ? this.states.get(airerLightEntityId) : null;
    let state = newState?.newState || newState || null;
    const positionCommandEntityId = (airer ? relatedAirerPositionNumberEntity(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const entry = this.states.get(positionCommandEntityId);
    const positionCommandState = entry?.newState || entry || null;
    const airerPositionSensorId = (airer ? relatedAirerCurrentPositionSensor(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const airerMotorSpeedSensorId = (airer ? relatedAirerMotorSpeedSensor(this.entityMetadata, detailsBoundEntityIdText) : null)?.entityId || "";
    const newStateCurrent = this.states.get(airerMotorSpeedSensorId);
    const motorState = newStateCurrent?.newState || newStateCurrent || null;
    const airerMotorActions = airer ? relatedAirerMotorActionEntities(this.entityMetadata, detailsBoundEntityIdText) : {};
    const airerActionEntityIds = Object.fromEntries(Object.entries(airerMotorActions).map(([item, entityId]) => [item, entityId?.entityId || ""]));
    const newStateNext = this.states.get(airerPositionSensorId || positionCommandEntityId);
    const positionState = newStateNext?.newState || newStateNext || null;
    const motorReversed = isCoverEntity && coverMotorIsReversedForComponent(type, this.entityMetadata, this.states, detailsBoundEntityIdText);
    const openCoverService = motorReversed ? "open_cover" : "close_cover";
    const closeCoverService = motorReversed ? "close_cover" : "open_cover";
    const coverDirection = ["left", "right"].includes(type.properties?.coverDirection) ? type.properties.coverDirection : "split";
    const momentary = !isLineChart && scale === "button";
    const isSwitchEntity = !isLineChart && (momentary || ["switch", "input_boolean"].includes(scale));
    const isLightControl = type.type === "icon-button" && scale === "light";
    const isClimateEntity = !isLineChart && (type.type === "air-conditioner" || type.type === "water-heater" || ["climate", "water_heater"].includes(scale));
    const deviceType = isClimateEntity ? scale === "water_heater" || type.type === "water-heater" ? "water-heater" : resolveClimateDeviceType(type, appliedScaleY, detailsBoundEntityIdText) : "air-conditioner";
    const climateDeviceLabelText = climateDeviceLabel(deviceType);
    const detailsDialogTitle = componentDialogTitle(type, String(friendly_name.friendly_name || "").trim() || climateDeviceLabelText).replace(/(浴霸)(?:\s+浴霸)+$/i, "$1");
    const label = componentDialogTitle(type, String(friendly_name.friendly_name || "").trim() || (momentary ? "按钮" : "开关"));
    const usesRichDetailsChrome = isLightControl || isClimateEntity || isSwitchEntity;
    this.closeRuntimeDialog();
    const entityIsActive = (state, attributes = friendly_name) => momentary ? false : isLightControl || isSwitchEntity ? state === "on" : climateIsPoweredOn({
      state: state,
      attributes: attributes
    }, deviceType);
    const entityDetailsDialogEl = document.createElement("dialog");
    entityDetailsDialogEl.className = "hb-entity-details-dialog";
    entityDetailsDialogEl.tabIndex = -1;
    entityDetailsDialogEl.classList.toggle("line-chart-details", isLineChart);
    entityDetailsDialogEl.classList.toggle("light-details", isLightControl);
    entityDetailsDialogEl.classList.toggle("cover-details", isCoverEntity);
    entityDetailsDialogEl.classList.toggle("dream-cover-details", dream);
    entityDetailsDialogEl.classList.toggle("airer-cover-details", airer);
    entityDetailsDialogEl.classList.toggle("climate-details", isClimateEntity);
    entityDetailsDialogEl.classList.toggle("bath-heater-details", deviceType === "bath-heater");
    entityDetailsDialogEl.classList.toggle("water-heater-details", deviceType === "water-heater");
    entityDetailsDialogEl.classList.toggle("switch-details", isSwitchEntity);
    entityDetailsDialogEl.classList.toggle("momentary-button-details", momentary);
    const append = document.createElement("div");
    append.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const element = document.createElement("div");
    const entityDetailsStrongEl = document.createElement("strong");
    entityDetailsStrongEl.textContent = isLightControl ? componentDialogTitle(type, "灯光") : isCoverEntity ? componentDialogTitle(type, airer ? "晾衣机" : "窗帘") : isClimateEntity ? detailsDialogTitle : isSwitchEntity ? label : componentDialogTitle(type, "设备详情");
    element.append(entityDetailsStrongEl);
    let pendingRef = null;
    let pendingRefCurrent = null;
    let rawEntityState = String(appliedScaleY?.state || "");
    let pendingRefNext = null;
    let pendingRefPrevious = null;
    let pendingRefLocal = null;
    if (isLightControl) {
      const entityDetailsSpanEl = document.createElement("span");
      entityDetailsSpanEl.textContent = appliedScaleY?.state === "on" ? "已开启" : "已关闭";
      entityDetailsSpanEl.classList.toggle("is-on", appliedScaleY?.state === "on");
      pendingRef = entityDetailsSpanEl;
      element.append(entityDetailsSpanEl);
    } else if (isCoverEntity) {
      const entityDetailsSpanEl = document.createElement("span");
      const physicalCoverStateValue = physicalCoverState(appliedScaleY?.state, motorReversed);
      const currentCoverPosition = Number(friendly_name[tilt ? "current_tilt_position" : "current_position"]);
      const coverStateLabels = {
        open: "已打开",
        closed: "已关闭",
        opening: "正在打开",
        closing: "正在关闭"
      };
      entityDetailsSpanEl.textContent = airer ? coverLiftStateLabel(physicalCoverStateValue) || physicalCoverStateValue || "状态未知" : dream ? dreamCurtainStatusText(appliedScaleY?.state, currentCoverPosition, motorReversed) : coverStateLabels[physicalCoverStateValue] || physicalCoverStateValue || "状态未知";
      entityDetailsSpanEl.classList.toggle("is-on", physicalCoverStateValue === "open" || physicalCoverStateValue === "opening");
      pendingRefCurrent = entityDetailsSpanEl;
      element.append(entityDetailsSpanEl);
    } else if (isClimateEntity || isSwitchEntity) {
      const entityDetailsSpanEl = document.createElement("span");
      const isEntityActive = entityIsActive(appliedScaleY?.state);
      entityDetailsSpanEl.textContent = momentary ? ["unknown", "unavailable"].includes(appliedScaleY?.state) ? "当前不可用" : "按下执行" : deviceType === "water-heater" ? waterHeaterStatusLabel(appliedScaleY) : ["unknown", "unavailable"].includes(appliedScaleY?.state) ? "当前不可用" : isEntityActive ? "已开启" : "已关闭";
      entityDetailsSpanEl.classList.toggle("is-on", isEntityActive);
      if (isClimateEntity) {
        pendingRefNext = entityDetailsSpanEl;
      } else {
        pendingRefPrevious = entityDetailsSpanEl;
      }
      element.append(entityDetailsSpanEl);
    } else if (type.type === "line-chart") {
      const statusTextEl = document.createElement("span");
      statusTextEl.textContent = appliedScaleY?.state == null || ["unknown", "unavailable"].includes(appliedScaleY.state) ? "暂无数据" : "实时数据";
      pendingRefLocal = statusTextEl;
      element.append(statusTextEl);
    }
    const entityDetailsButtonEl = document.createElement("button");
    entityDetailsButtonEl.type = "button";
    entityDetailsButtonEl.setAttribute("aria-label", "关闭实体详情");
    entityDetailsButtonEl.textContent = "×";
    entityDetailsHeadingEl.append(element, entityDetailsButtonEl);
    let attributes = appliedScaleY;
    let syncClimateState = null;
    let coverDetailsControls = null;
    let setAttributeCurrent = null;
    let lightDetailsControls = null;
    let pendingRefItem = null;
    let climateDetailsControls = null;
    let switchDetailsControls = null;
    let detailsSyncToken = 0;
    const positionCalibration = airerPositionCalibration(this.entityMetadata, this.deviceMetadata, detailsBoundEntityIdText);
    let detailsDisposed = false;
    let pendingRefEntry = null;
    let pendingCoverPosition = null;
    let pendingCoverState = null;
    let pendingLightBrightness = null;
    let pendingLightColorTemp = null;
    let lightInteractionActive = false;
    let climateTargetTemperature = null;
    let coverInteractionPhase = "idle";
    let statusMessageText = "";
    let toggleBathLight = null;
    let stateHandlers = null;
    let subscribedEntityIds = new Set();
    const relatedEntityIds = selectedRelatedEntityIds(type);
    const relatedEntityIdSet = new Set(relatedEntityIds || []);
    if (isLightControl) {
      setAttributeCurrent = document.createElement("button");
      setAttributeCurrent.type = "button";
      setAttributeCurrent.className = "hb-light-visual";
      setAttributeCurrent.inert = preview;
      setAttributeCurrent.setAttribute("aria-disabled", String(preview));
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
      setAttributeCurrent.append(lightVisualAuraEl, lightVisualLampEl, lightVisualStatusEl);
      const minColorTempKelvin = Number(friendly_name.min_color_temp_kelvin) || (Number.isFinite(Number(friendly_name.max_mireds)) ? 1000000 / Number(friendly_name.max_mireds) : 2000);
      const maxColorTempKelvin = Number(friendly_name.max_color_temp_kelvin) || (Number.isFinite(Number(friendly_name.min_mireds)) ? 1000000 / Number(friendly_name.min_mireds) : 6500);
      const colorTempKelvin = Number(friendly_name.color_temp_kelvin) || (Number.isFinite(Number(friendly_name.color_temp)) ? 1000000 / Number(friendly_name.color_temp) : NaN);
      const colorTemperatureKelvin = Number.isFinite(colorTempKelvin) ? colorTempKelvin : (minColorTempKelvin + maxColorTempKelvin) / 2;
      const supportsColor = lightSupportsColor(friendly_name);
      const options = {
        isOn: appliedScaleY?.state === "on",
        brightnessPercent: Number.isFinite(Number(friendly_name.brightness)) ? Number(friendly_name.brightness) / 255 * 100 : 100,
        colorTemperatureKelvin,
        colorRgb: supportsColor && Array.isArray(friendly_name.rgb_color) ? friendly_name.rgb_color.slice(0, 3).map(item => Number(item) || 0) : supportsColor && Array.isArray(friendly_name.hs_color) ? hsToRgbColor(friendly_name.hs_color) : null
      };
      const applyLightVisual = () => {
        const brightnessPercent = Math.max(1, Math.min(100, Number(options.brightnessPercent) || 1));
        const visualColorTempKelvin = Math.max(2000, Math.min(6500, Number(options.colorTemperatureKelvin) || 3000));
        const colorTempT = (visualColorTempKelvin - 2000) / 4500;
        const map = [255, 132, 42];
        const coolRgb = [172, 225, 255];
        const mixedRgbCss = "rgb(" + (options.colorRgb || map.map((item, second) => Math.round(item + (coolRgb[second] - item) * colorTempT))).join(",") + ")";
        setAttributeCurrent.classList.toggle("is-on", options.isOn);
        setAttributeCurrent.style.setProperty("--hb-light-visual-color", mixedRgbCss);
        setAttributeCurrent.style.setProperty("--hb-light-visual-opacity", options.isOn ? String(0.08 + brightnessPercent / 100 * 0.92) : "0");
        setAttributeCurrent.style.setProperty("--hb-light-visual-blur", Math.round(15 + brightnessPercent * 1.14) + "px");
        setAttributeCurrent.style.setProperty("--hb-light-visual-scale", String(0.62 + brightnessPercent / 100 * 1.05));
        lightVisualStatusEl.textContent = options.isOn ? Math.round(brightnessPercent) + "%  ·  " + Math.round(visualColorTempKelvin) + "K" : "灯光已关闭";
        setAttributeCurrent.setAttribute("aria-label", lightVisualStatusEl.textContent);
      };
      lightDetailsControls = (isOn = {}) => {
        const brightness = isOn.attributes || {};
        if (typeof isOn.isOn == "boolean") {
          options.isOn = isOn.isOn;
        } else if (typeof isOn.state == "string") {
          options.isOn = isOn.state === "on";
        }
        if (Number.isFinite(Number(isOn.brightnessPercent))) {
          options.brightnessPercent = Number(isOn.brightnessPercent);
        } else if (Number.isFinite(Number(brightness.brightness))) {
          options.brightnessPercent = Number(brightness.brightness) / 255 * 100;
        }
        if (Number.isFinite(Number(isOn.colorTemperatureKelvin))) {
          options.colorTemperatureKelvin = Number(isOn.colorTemperatureKelvin);
        } else if (Number.isFinite(Number(brightness.color_temp_kelvin))) {
          options.colorTemperatureKelvin = Number(brightness.color_temp_kelvin);
        } else if (Number.isFinite(Number(brightness.color_temp))) {
          options.colorTemperatureKelvin = 1000000 / Number(brightness.color_temp);
        }
        if (supportsColor && Array.isArray(isOn.colorRgb)) {
          options.colorRgb = isOn.colorRgb.slice(0, 3).map(item => Number(item) || 0);
        } else if (supportsColor && Array.isArray(brightness.rgb_color)) {
          options.colorRgb = brightness.rgb_color.slice(0, 3).map(item => Number(item) || 0);
        } else if (supportsColor && Array.isArray(brightness.hs_color)) {
          options.colorRgb = hsToRgbColor(brightness.hs_color);
        }
        applyLightVisual();
      };
      applyLightVisual();
    }
    if (isCoverEntity) {
      pendingRefItem = document.createElement("button");
      pendingRefItem.type = "button";
      pendingRefItem.className = "hb-cover-visual";
      pendingRefItem.inert = preview;
      pendingRefItem.setAttribute("aria-disabled", String(preview));
      const coverVisualRailEl = document.createElement("i");
      coverVisualRailEl.className = "hb-cover-visual-rail";
      const coverVisualPanelEl = document.createElement("i");
      coverVisualPanelEl.className = "hb-cover-visual-panel left";
      const element = document.createElement("i");
      element.className = "hb-cover-visual-panel right";
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
      pendingRefItem.classList.toggle("is-dream", dream);
      pendingRefItem.classList.toggle("is-airer", airer);
      pendingRefItem.classList.add("direction-" + coverDirection);
      pendingRefItem.append(coverVisualWindowEl, coverVisualRailEl, coverVisualPanelEl, element, coverVisualSlatsEl);
      if (airer) {
        appendAirerVisual(pendingRefItem);
      }
      switchDetailsControls = (lightState = state) => {
        if (!airer) {
          return;
        }
        state = lightState || state;
        const isAirerLightUnavailable = !airerLightEntityId || ["unknown", "unavailable"].includes(String(state?.state || "unknown"));
        const isAirerLightOn = state?.state === "on";
        pendingRefItem.classList.toggle("is-light-on", isAirerLightOn && !isAirerLightUnavailable);
        pendingRefItem.classList.toggle("is-light-unavailable", isAirerLightUnavailable);
        pendingRefItem.disabled = preview || isAirerLightUnavailable;
        pendingRefItem.setAttribute("aria-pressed", String(isAirerLightOn && !isAirerLightUnavailable));
        pendingRefItem.setAttribute("aria-label", isAirerLightUnavailable ? "晾衣机灯光实体不可用" : "晾衣机灯光" + (isAirerLightOn ? "已开启，点击关闭" : "已关闭，点击开启"));
      };
      switchDetailsControls();
      climateDetailsControls = ({
        position: options = 0,
        state: state = ""
      } = {}) => {
        const current_position = Math.max(0, Math.min(100, Number(options) || 0));
        const coverPresentation = coverPresentationState({
          state: state,
          attributes: {
            current_position
          }
        }, motorReversed);
        const resolvedPhysicalCoverState = physicalCoverState(state || rawEntityState, motorReversed);
        const isCoverOpenOrOpening = resolvedPhysicalCoverState === "open" || resolvedPhysicalCoverState === "opening";
        detailsSyncToken = current_position;
        pendingRefItem.style.setProperty("--hb-cover-open-position", current_position + "%");
        pendingRefItem.style.setProperty("--hb-airer-drop", airerVisualDrop(current_position) + "px");
        pendingRefItem.style.setProperty("--hb-cover-panel-width", 45.9 - current_position * 0.331 + "%");
        pendingRefItem.style.setProperty("--hb-cover-single-panel-width", 91.8 - current_position * 0.79 + "%");
        pendingRefItem.style.setProperty("--hb-cover-slat-angle", current_position * 1.8 + "deg");
        pendingRefItem.classList.toggle("is-tilt-reversed", current_position > 50);
        pendingRefItem.classList.toggle("is-tilt-center", Math.abs(current_position - 50) <= 2);
        pendingRefItem.classList.toggle("is-open", dream ? isCoverOpenOrOpening : coverPresentation === "open" || coverPresentation === "opening");
        pendingRefItem.classList.toggle("is-moving", state === "opening" || state === "closing");
        pendingRefItem.setAttribute("aria-pressed", String(dream ? isCoverOpenOrOpening : coverPresentation === "open" || coverPresentation === "opening"));
        if (!airer) {
          pendingRefItem.setAttribute("aria-label", dream ? "" + componentDialogTitle(type, "梦幻帘") + dreamCurtainStatusText(state || rawEntityState, current_position, motorReversed) : "" + componentDialogTitle(type, "窗帘") + (coverPresentation === "open" || coverPresentation === "opening" ? "已打开，点击关闭" : "已关闭，点击打开"));
        }
      };
      climateDetailsControls({
        position: Number.isFinite(Number(friendly_name[tilt ? "current_tilt_position" : "current_position"])) ? Number(friendly_name[tilt ? "current_tilt_position" : "current_position"]) : appliedScaleY?.state === "open" ? 100 : 0,
        state: appliedScaleY?.state
      });
      pendingRefItem.addEventListener("click", async () => {
        if (preview || detailsDisposed) {
          return;
        }
        detailsDisposed = true;
        pendingRefItem.setAttribute("aria-busy", "true");
        if (airer) {
          const airerLightState = state;
          switchDetailsControls({
            ...(state || {}),
            state: state?.state === "on" ? "off" : "on"
          });
          try {
            await this.callEntityService("homeassistant", "toggle", airerLightEntityId);
          } catch (socketPayload) {
            switchDetailsControls(airerLightState);
            this.options.onError?.(socketPayload);
          } finally {
            detailsDisposed = false;
            pendingRefItem.removeAttribute("aria-busy");
          }
          return;
        }
        const position = detailsSyncToken;
        const isDreamRetracted = syncClimateState?.isDreamCurtainRetracted?.() ?? pendingRefItem.dataset.curtainRetracted === "true";
        const isCoverOpenPosition = position > COVER_CLOSED_POSITION_EPSILON;
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
            position: position,
            state: appliedScaleY?.state
          });
          this.options.onError?.(presenceBucket);
        } finally {
          detailsDisposed = false;
          pendingRefItem.removeAttribute("aria-busy");
        }
      });
    }
    if (isClimateEntity) {
      const relatedPopupOptions = {
        entityId: detailsBoundEntityIdText,
        entityMetadata: this.entityMetadata,
        entityTranslations: this.entityTranslations
      };
      pendingRefEntry = document.createElement("button");
      pendingRefEntry.type = "button";
      pendingRefEntry.className = "hb-climate-visual";
      pendingRefEntry.classList.toggle("is-bath-heater", deviceType === "bath-heater");
      pendingRefEntry.classList.toggle("is-water-heater", deviceType === "water-heater");
      pendingRefEntry.inert = preview;
      pendingRefEntry.setAttribute("aria-disabled", String(preview));
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
      pendingRefEntry.append(climateVisualUnitEl, climateVisualAirflowEl);
      pendingCoverPosition = ({
        mode: options = "off",
        visualMode: visualMode = "off",
        running: optionsCurrent = false,
        accentColor: optionsNext = "#65717a",
        targetTemperature: temperature
      } = {}) => {
        const isClimateModeOn = visualMode !== "off";
        pendingRefEntry.classList.toggle("is-on", isClimateModeOn);
        pendingRefEntry.classList.toggle("is-running", optionsCurrent);
        pendingRefEntry.classList.toggle("is-airflow-mode", deviceType === "bath-heater" && isClimateModeOn && bathHeaterModeUsesAirflow(options));
        pendingRefEntry.dataset.visualMode = visualMode;
        pendingRefEntry.style.setProperty("--hb-climate-visual-accent", optionsNext);
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
    const entityDetailsSpanEl = document.createElement("span");
    entityDetailsSpanEl.textContent = usesRichDetailsChrome ? "⏻" : "当前状态";
    const entityDetailsStrongElCurrent = document.createElement("strong");
    const hvacModeLabels = {
      off: "关闭",
      auto: "自动",
      cool: "制冷",
      dry: "除湿",
      heat: "制热",
      fan_only: "送风",
      heat_cool: "冷暖自动"
    };
    entityDetailsStrongElCurrent.textContent = usesRichDetailsChrome ? appliedScaleY?.state ? entityIsActive(appliedScaleY.state) ? "已开启" : "已关闭" : "状态未知" : scale === "climate" ? hvacModeLabels[appliedScaleY?.state] || appliedScaleY?.state || "暂无状态" : appliedScaleY?.state ?? "暂无状态";
    entityDetailsStateEl.classList.toggle("hb-light-details-power", isLightControl);
    entityDetailsStateEl.classList.toggle("hb-climate-details-power", isClimateEntity);
    entityDetailsStateEl.classList.toggle("hb-switch-details-power", isSwitchEntity);
    entityDetailsStateEl.classList.toggle("is-on", usesRichDetailsChrome && entityIsActive(appliedScaleY?.state));
    entityDetailsStateEl.append(entityDetailsSpanEl, entityDetailsStrongElCurrent);
    if (usesRichDetailsChrome) {
      entityDetailsStateEl.inert = preview;
      entityDetailsStateEl.setAttribute("aria-disabled", String(preview));
      coverDetailsControls = (isOn, {
        unavailable = false,
        syncClimate: options = true
      } = {}) => {
        entityDetailsStateEl.classList.toggle("is-on", isOn);
        entityDetailsStateEl.classList.toggle("is-unavailable", unavailable);
        entityDetailsStateEl.setAttribute("aria-pressed", String(isOn));
        entityDetailsStateEl.disabled = unavailable || preview;
        entityDetailsStrongElCurrent.textContent = unavailable ? "当前不可用" : momentary ? coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "执行中" : "等待执行" : isOn ? "已开启" : "已关闭";
        entityDetailsStateEl.setAttribute("aria-label", unavailable ? (isLightControl ? componentDialogTitle(type, "灯光") : isClimateEntity ? detailsDialogTitle : label) + "当前不可用" : momentary ? "" + label + (coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "正在执行" : "，点击执行") : "" + componentDialogTitle(type, isLightControl ? "灯光" : isClimateEntity ? climateDeviceLabelText : "开关") + (isOn ? "已开启，点击关闭" : "已关闭，点击开启"));
        if (isLightControl) {
          lightDetailsControls?.({
            isOn: isOn
          });
          pendingRef.textContent = isOn ? "已开启" : "已关闭";
          pendingRef.classList.toggle("is-on", isOn);
          setAttributeCurrent.setAttribute("aria-pressed", String(isOn));
          setAttributeCurrent.setAttribute("aria-label", "" + componentDialogTitle(type, "灯光") + (isOn ? "已开启，点击关闭" : "已关闭，点击开启"));
        }
        if (isClimateEntity && syncClimateState?.syncClimateState && options) {
          const operationModes = normalizeClimateCapabilities(attributes || appliedScaleY);
          const preferredOperationMode = deviceType === "water-heater" ? operationModes.operationModes.find(item => !["off", "空"].includes(String(item).trim().toLowerCase())) || "普通" : operationModes.hvacModes.find(item => item !== "off") || (deviceType === "bath-heater" ? "heat" : "auto");
          const lastClimateMode = syncClimateState.dataset.lastClimateMode || (appliedScaleY?.state && appliedScaleY.state !== "off" ? appliedScaleY.state : preferredOperationMode);
          syncClimateState.syncClimateState({
            state: isOn ? deviceType === "water-heater" ? "on" : lastClimateMode : "off",
            attributes: {
              ...(attributes?.attributes || appliedScaleY?.attributes || {}),
              operation_mode: deviceType === "water-heater" ? isOn ? attributes?.attributes?.operation_mode || preferredOperationMode : "off" : undefined,
              hvac_action: deviceType === "water-heater" ? undefined : isOn ? appliedScaleY?.attributes?.hvac_action || lastClimateMode : "off"
            }
          });
        }
        if (isClimateEntity) {
          pendingRefNext.textContent = deviceType === "water-heater" ? waterHeaterStatusLabel({
            ...(attributes || appliedScaleY || {}),
            state: isOn ? "on" : "off"
          }) : isOn ? "已开启" : "已关闭";
          pendingRefNext.classList.toggle("is-on", isOn);
          if (deviceType === "bath-heater") {
            if (!toggleBathLight) {
              pendingRefEntry.setAttribute("aria-pressed", "false");
            }
            pendingRefEntry.setAttribute("aria-label", detailsDialogTitle + "，点击切换浴霸灯");
          } else {
            pendingRefEntry.setAttribute("aria-pressed", String(isOn));
            pendingRefEntry.setAttribute("aria-label", "" + detailsDialogTitle + (isOn ? "已开启，点击关闭" : "已关闭，点击开启"));
          }
        }
        if (isSwitchEntity) {
          pendingLightBrightness?.(isOn, {
            pending: lightInteractionActive && coverInteractionPhase !== "success",
            success: coverInteractionPhase === "success",
            unavailable
          });
          pendingRefPrevious.textContent = unavailable ? "当前不可用" : momentary ? coverInteractionPhase === "success" ? "执行成功" : lightInteractionActive ? "正在执行" : "按下执行" : isOn ? "已开启" : "已关闭";
          pendingRefPrevious.classList.toggle("is-on", (momentary ? lightInteractionActive || coverInteractionPhase === "success" : isOn) && !unavailable);
        }
      };
      if (appliedScaleY?.state) {
        coverDetailsControls(entityIsActive(appliedScaleY.state), {
          unavailable: ["unknown", "unavailable"].includes(appliedScaleY.state)
        });
      }
      pendingLightColorTemp = async () => {
        if (preview || lightInteractionActive || !attributes?.state) {
          return;
        }
        lightInteractionActive = true;
        const setAttribute = isLightControl ? setAttributeCurrent : isClimateEntity ? pendingRefEntry : pendingCoverState;
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
              const preset_mode = normalizeClimateCapabilities(attributes).presetModes.find(onPowerChange => ["idle", "standby", "待机", "关闭"].includes(String(onPowerChange).trim().toLowerCase()));
              if (preset_mode) {
                await this.callEntityService(scale === "fan" ? "fan" : "climate", "set_preset_mode", detailsBoundEntityIdText, {
                  preset_mode
                });
              }
            }
            const domain = climatePowerCommand(detailsBoundEntityIdText, attributes, nextSwitchPowerOn, deviceType, syncClimateState?.dataset.lastClimateMode || "");
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
        setAttributeCurrent.addEventListener("click", pendingLightColorTemp);
      }
      if (isClimateEntity) {
        pendingRefEntry.addEventListener("click", () => {
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
        pendingRefNext.style.setProperty("--hb-climate-accent", accentColor);
        if (deviceType === "water-heater") {
          pendingRefNext.textContent = visualMode === "off" ? "已关闭" : running ? "正在加热" : "保温中";
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
        cool: type.properties?.airflowCoolColor || "#73c8ff",
        heat: type.properties?.airflowHeatColor || "#ff8a65",
        other: type.properties?.airflowOtherColor || "#dce2e6"
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
        pendingRefCurrent.textContent = airer ? coverLiftStateLabel(updatedCoverPresentation) || Math.round(position) + "%" : dream ? dreamCurtainStatusText(rawEntityState, position, motorReversed) : coverStatusLabels[updatedCoverPresentation] || Math.round(position) + "%";
        pendingRefCurrent.classList.toggle("is-on", dream ? baselinePhysicalCoverState === "open" || baselinePhysicalCoverState === "opening" : updatedCoverPresentation === "open" || updatedCoverPresentation === "opening");
      },
      onCurtainPositionChange: ({
        retracted: item,
        moving: value
      }) => {
        pendingRefItem.classList.toggle("is-curtain-retracted", item);
        pendingRefItem.classList.toggle("is-curtain-moving", value);
        pendingRefItem.dataset.curtainRetracted = String(item);
        if (dream) {
          pendingRefCurrent.textContent = dreamCurtainStatusFromRetraction(item, value, detailsSyncToken);
          pendingRefCurrent.classList.toggle("is-on", item);
        }
      }
    }) : null;
    if (isLightControl && syncClimateState?.classList.contains("has-color-picker")) {
      entityDetailsDialogEl.classList.add("color-picker-details");
    }
    if (isClimateEntity && deviceType === "water-heater" && syncClimateState && pendingRefEntry) {
      syncClimateState.prepend(pendingRefEntry);
      syncClimateState.syncClimateGrid?.();
    }
    const bathHeaterLightEntityId = isClimateEntity && deviceType === "bath-heater" && size?.roles?.light || "";
    statusMessageText = (bathHeaterLightEntityId ? this.entityMetadata.get(bathHeaterLightEntityId) : isClimateEntity && deviceType === "bath-heater" ? relatedDeviceDomainEntity(this.entityMetadata, detailsBoundEntityIdText, "light") : null)?.entityId || "";
    if (statusMessageText && syncClimateState) {
      const newState = this.states.get(statusMessageText);
      const relatedEntityState = newState?.newState || newState || {
        state: "unknown",
        attributes: {}
      };
      toggleBathLight = this.createBathHeaterLightControl(statusMessageText, relatedEntityState, {
        interactive: !preview,
        onStateChange: ({
          isOn: item,
          unavailable: value
        }) => {
          pendingRefEntry?.classList.toggle("is-light-on", item && !value);
          pendingRefEntry?.setAttribute("aria-pressed", String(item && !value));
        }
      });
      syncClimateState.append(toggleBathLight);
      syncClimateState.syncClimateGrid?.();
    }
    const refreshEntityCatalog = isClimateEntity && (deviceType === "water-heater" || relatedEntityIds !== null) ? () => {
      const activeEntityIdSet = subscribedEntityIds;
      const relatedEntityIds = this.createWaterHeaterExtensionControls(detailsBoundEntityIdText, {
        component: type,
        interactive: !preview,
        excludedEntityIds: statusMessageText ? [statusMessageText] : []
      });
      stateHandlers?.remove();
      stateHandlers = relatedEntityIds;
      subscribedEntityIds = new Set(relatedEntityIds?.relatedEntityIds || []);
      syncClimateState?.classList.toggle("has-multiline-water-heater-extensions", deviceType === "water-heater" && Number(relatedEntityIds?.dataset?.controlCount || 0) > 2);
      if (deviceType !== "water-heater" && append.isConnected) {
        entityDetailsDialogEl.classList.toggle("has-related-extensions", !!relatedEntityIds);
      }
      if (relatedEntityIds && syncClimateState) {
        if (deviceType === "water-heater") {
          (syncClimateState.waterHeaterControlPanel || syncClimateState).append(relatedEntityIds);
          syncClimateState.syncClimateGrid?.();
        } else if (append.isConnected) {
          append.append(relatedEntityIds);
          entityDetailsDialogEl.classList.add("has-related-extensions");
        }
      }
      const entryMap = this.detailsStateSync?.handlers;
      if (entryMap) {
        for (const detailsStateSyncApi of activeEntityIdSet) {
          entryMap.delete(detailsStateSyncApi);
        }
        for (const [relatedEntityRef, entityIdCandidate] of relatedEntityIds?.stateHandlers || []) {
          entryMap.set(relatedEntityRef, entityIdCandidate);
          const newState = this.states.get(relatedEntityRef);
          if (newState) {
            for (const detailsCleanup of entityIdCandidate) {
              detailsCleanup(newState.newState || newState);
            }
          }
        }
      }
    } : null;
    refreshEntityCatalog?.();
    let lineChartDetailsView = type.type === "line-chart" ? renderLineChartDetails(type, {
      states: this.states,
      history: this.historySeries,
      renderNamespace: this.renderNamespace
    }) : null;
    let lineChartDetailsViewCurrent = null;
    let pendingRefList = null;
    let pendingRefText = null;
    const entityDetailsAttributesEl = document.createElement("dl");
    entityDetailsAttributesEl.className = "hb-entity-details-attributes";
    for (const [item, value] of Object.entries(friendly_name).filter(([item]) => item !== "friendly_name")) {
      const append = document.createElement("div");
      const entityDetailsDtEl = document.createElement("dt");
      entityDetailsDtEl.textContent = item;
      const entityDetailsDdEl = document.createElement("dd");
      entityDetailsDdEl.textContent = typeof value == "string" ? value : JSON.stringify(value);
      append.append(entityDetailsDtEl, entityDetailsDdEl);
      entityDetailsAttributesEl.append(append);
    }
    if (lineChartDetailsView) {
      lineChartDetailsViewCurrent = document.createElement("section");
      lineChartDetailsViewCurrent.className = "hb-line-chart-current-visual";
      lineChartDetailsViewCurrent.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      pendingRefList = document.createElement("strong");
      const numericSensorValue = Number.parseFloat(appliedScaleY?.state);
      pendingRefList.textContent = Number.isFinite(numericSensorValue) ? formatLineChartValue(numericSensorValue, type.properties?.statePrecision) : appliedScaleY?.state || "--";
      pendingRefText = document.createElement("small");
      pendingRefText.textContent = String(friendly_name.unit_of_measurement || "实时数值");
      lineChartDetailsViewCurrent.append(pendingRefList, pendingRefText);
      entityDetailsStateEl.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      entityDetailsSpanEl.textContent = "●";
      entityDetailsStrongElCurrent.textContent = "实时数据";
      append.append(entityDetailsHeadingEl, lineChartDetailsViewCurrent, lineChartDetailsView);
    } else if (isClimateEntity) {
      append.append(entityDetailsHeadingEl, ...(deviceType === "water-heater" ? [syncClimateState] : [pendingRefEntry, syncClimateState]), ...(deviceType !== "water-heater" && stateHandlers ? [stateHandlers] : []));
      entityDetailsDialogEl.classList.toggle("has-related-extensions", deviceType !== "water-heater" && !!stateHandlers);
    } else if (isLightControl) {
      const lightDetailsLayoutEl = document.createElement("div");
      lightDetailsLayoutEl.className = "hb-light-details-layout";
      const lightDetailsPanelEl = document.createElement("section");
      lightDetailsPanelEl.className = "hb-light-details-panel";
      lightDetailsPanelEl.append(...(syncClimateState ? [syncClimateState] : []));
      lightDetailsLayoutEl.append(lightDetailsPanelEl, setAttributeCurrent);
      append.append(entityDetailsHeadingEl, lightDetailsLayoutEl);
    } else if (isSwitchEntity) {
      const switchDetailsLayoutEl = document.createElement("div");
      switchDetailsLayoutEl.className = "hb-switch-details-layout";
      switchDetailsLayoutEl.append(pendingCoverState);
      append.append(entityDetailsHeadingEl, switchDetailsLayoutEl);
    } else if (isCoverEntity) {
      const coverDetailsLayoutEl = document.createElement("div");
      coverDetailsLayoutEl.className = "hb-cover-details-layout";
      const coverDetailsPanelEl = document.createElement("section");
      coverDetailsPanelEl.className = "hb-cover-details-panel";
      coverDetailsPanelEl.append(...(syncClimateState ? [syncClimateState] : []));
      coverDetailsLayoutEl.append(coverDetailsPanelEl, pendingRefItem);
      append.append(entityDetailsHeadingEl, coverDetailsLayoutEl);
    } else if (entityDetailsAttributesEl.childElementCount) {
      append.append(entityDetailsHeadingEl, entityDetailsStateEl, ...(syncClimateState ? [syncClimateState] : []), entityDetailsAttributesEl);
    } else {
      const entityDetailsEmptyEl = document.createElement("p");
      entityDetailsEmptyEl.className = "hb-entity-details-empty";
      entityDetailsEmptyEl.textContent = "该实体暂无附加属性。";
      entityDetailsAttributesEl.replaceWith(entityDetailsEmptyEl);
      append.append(entityDetailsHeadingEl, entityDetailsStateEl, ...(syncClimateState ? [syncClimateState] : []), entityDetailsEmptyEl);
    }
    entityDetailsDialogEl.append(append);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className = "hb-renderer-runtime-dialog-layer" + (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(entityDetailsDialogEl);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = entityDetailsDialogEl;
    const detailsDialogWidth = isClimateEntity ? 840 : type.type === "line-chart" ? 780 : isLightControl || isCoverEntity ? 760 : isSwitchEntity ? 620 : 460;
    const detailsDialogHeight = isClimateEntity ? deviceType !== "water-heater" && stateHandlers ? 620 : 540 : isLightControl || isCoverEntity ? 620 : isSwitchEntity ? 500 : 680;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, entityDetailsDialogEl, detailsDialogWidth, detailsDialogHeight);
    let detailsSyncTimer = 0;
    if (type.type === "line-chart" && lineChartDetailsView) {
      const runDetailsStateSync = () => {
        detailsSyncTimer = 0;
        if (!lineChartDetailsView?.isConnected || this.detailsStateSync?.dialog !== entityDetailsDialogEl) {
          return;
        }
        const lineChartDetailsHandle = renderLineChartDetails(type, {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace
        });
        lineChartDetailsView.cleanupLineChartHover?.();
        lineChartDetailsView.replaceWith(lineChartDetailsHandle);
        lineChartDetailsView = lineChartDetailsHandle;
        lineChartDetailsViewCurrent.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
      };
      const scheduleDetailsStateSync = (delayMs = 700) => {
        detailsSyncTimer ||= window.setTimeout(runDetailsStateSync, Math.max(0, Number(delayMs) || 0));
      };
      this.detailsStateSync = {
        dialog: entityDetailsDialogEl,
        entityId: detailsBoundEntityIdText,
        refreshHistory: () => scheduleDetailsStateSync(0),
        apply: state => {
          const parsedSensorNumber = Number.parseFloat(state?.state);
          pendingRefList.textContent = Number.isFinite(parsedSensorNumber) ? formatLineChartValue(parsedSensorNumber, type.properties?.statePrecision) : state?.state || "--";
          pendingRefText.textContent = String(state?.attributes?.unit_of_measurement || "实时数值");
          pendingRefLocal.textContent = state?.state == null || ["unknown", "unavailable"].includes(state.state) ? "暂无数据" : "实时数据";
          lineChartDetailsView.syncLineChartState?.(state);
          lineChartDetailsViewCurrent.style.setProperty("--hb-chart-current-color", lineChartDetailsView.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e");
        }
      };
    } else if (usesRichDetailsChrome && coverDetailsControls) {
      const applyEntityDetailsState = state => {
        attributes = state;
        if (isClimateEntity && buildClimateControls && syncClimateState) {
          const climateStructureKey = climateControlStructureKey(detailsBoundEntityIdText, state, deviceType);
          if (syncClimateState.dataset.climateStructureKey !== climateStructureKey) {
            const climateControlsRoot = buildClimateControls(state);
            climateControlsRoot.classList.toggle("has-multiline-water-heater-extensions", syncClimateState.classList.contains("has-multiline-water-heater-extensions"));
            climateControlsRoot.classList.add("is-runtime-hydrated");
            if (deviceType === "water-heater" && pendingRefEntry) {
              climateControlsRoot.prepend(pendingRefEntry);
            }
            if (toggleBathLight) {
              climateControlsRoot.append(toggleBathLight);
              climateControlsRoot.syncClimateGrid?.();
            }
            if (stateHandlers && deviceType === "water-heater") {
              (climateControlsRoot.waterHeaterControlPanel || climateControlsRoot).append(stateHandlers);
              climateControlsRoot.syncClimateGrid?.();
            }
            syncClimateState.replaceWith(climateControlsRoot);
            syncClimateState = climateControlsRoot;
          }
        }
        if (state?.state) {
          coverDetailsControls(entityIsActive(state.state, state.attributes), {
            unavailable: ["unknown", "unavailable"].includes(state.state)
          });
        }
        syncClimateState?.syncLightState?.(state);
        syncClimateState?.syncClimateState?.(state);
      };
      const set = new Map([[detailsBoundEntityIdText, [applyEntityDetailsState]]]);
      if (statusMessageText && toggleBathLight) {
        set.set(statusMessageText, [stateHandler => toggleBathLight.syncBathLightState?.(stateHandler)]);
      }
      if (stateHandlers?.stateHandlers) {
        for (const [runtimeHandlerRef, runtimeCleanupRef] of stateHandlers.stateHandlers) {
          set.set(runtimeHandlerRef, runtimeCleanupRef);
        }
      }
      this.detailsStateSync = {
        dialog: entityDetailsDialogEl,
        handlers: set,
        refreshEntityCatalog
      };
      if (isClimateEntity && syncClimateState?.querySelector(".hb-climate-details-loading")) {
        const openedAtMs = Date.now();
        climateTargetTemperature = window.setInterval(() => {
          const newState = this.states.get(detailsBoundEntityIdText);
          const incomingEntityState = newState?.newState || newState;
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
        dialog: entityDetailsDialogEl,
        handlers: map
      };
    }
    entityDetailsButtonEl.addEventListener("click", () => entityDetailsDialogEl.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, entityDetailsDialogEl, append);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", key => {
      if (key.key === "Escape") {
        entityDetailsDialogEl.close();
      }
    });
    entityDetailsDialogEl.addEventListener("close", () => {
      window.clearTimeout(detailsSyncTimer);
      window.clearInterval(climateTargetTemperature);
      climateTargetTemperature = null;
      syncClimateState?.cleanupLightDetails?.();
      syncClimateState?.cleanupClimateDetails?.();
      syncClimateState?.cleanupCoverDetails?.();
      lineChartDetailsView?.cleanupLineChartHover?.();
      this.clearRuntimeDialogScale(entityDetailsDialogEl);
      if (this.detailsDialog === entityDetailsDialogEl) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === entityDetailsDialogEl) {
        this.detailsStateSync = null;
      }
      rendererRuntimeDialogLayerEl.remove();
    }, {
      once: true
    });
    entityDetailsDialogEl.show();
    entityDetailsDialogEl.focus({
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
    const scaleMode = this.options.scaleMode || this.document.canvas.scaleMode || "contain";
    const found = scaleMode === "cover" ? Math.max(index, filtered) : Math.min(index, filtered);
    const entityIds = scaleMode === "stretch" ? index : found;
    const state = scaleMode === "stretch" ? filtered : found;
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
    force: entityId = false
  } = {}) {
    if (!this.document || this.destroyed) {
      this.disconnectRuntime();
      return;
    }
    const historyRetryAttempt = this.page || this.document.pages?.[0];
    const state = new Map((this.document.sharedComponents || []).map(id => [id.id, id]));
    const runtimeComponents = [...(historyRetryAttempt?.sharedComponentIds || []).map(socketEvent => state.get(socketEvent)).filter(Boolean), ...(historyRetryAttempt?.components || [])];
    const add = collectEntityIds(runtimeComponents);
    const modules = this.activePopupId ? (this.document.customPopups || []).find(id => String(id.id || "") === this.activePopupId) : null;
    for (const entityId of modules?.modules || []) {
      if (entityId.entityId && !isVirtualEntityId(entityId.entityId)) {
        add.add(entityId.entityId);
      }
    }
    for (const subscribedEntityList of [...add]) {
      if (this.entityMetadata.get(subscribedEntityList)?.domain !== "event") {
        continue;
      }
      const properties = collectComponents(runtimeComponents, type => type.type === "presence-sensor" && type.bindings?.entity?.entityId === subscribedEntityList)[0];
      if (!properties) {
        continue;
      }
      const companionEntityIds = presenceMotionEventConfig(subscribedEntityList, this.states.get(subscribedEntityList), this.entityMetadata, this.states, properties.properties);
      for (const runtimeEntityIds of companionEntityIds.companionEntityIds) {
        add.add(runtimeEntityIds);
      }
    }
    for (const pageEntityIds of [...add]) {
      const entry = this.entityMetadata.get(pageEntityIds);
      if (entry?.domain !== "sensor" || !entry.deviceId || !["state", "status", "task_status"].includes(entry.translationKey)) {
        continue;
      }
      const entityId = [...this.entityMetadata.values()].find(deviceId => deviceId.deviceId === entry.deviceId && deviceId.domain === "vacuum" && entityMetadataIsAvailable(deviceId));
      if (entityId?.entityId) {
        add.add(entityId.entityId);
      }
    }
    for (const slice of [...add]) {
      if (this.entityMetadata.get(slice)?.domain !== "vacuum") {
        continue;
      }
      const entityLocalId = slice.slice(slice.indexOf(".") + 1);
      const entityId = relatedDeviceEntity(this.entityMetadata, slice, "select", "cleaning_mode", "select." + entityLocalId + "_cleaning_mode");
      if (entityId?.entityId) {
        add.add(entityId.entityId);
      }
      const entity = relatedVacuumBatteryEntity(this.entityMetadata, this.states, slice);
      if (entity?.entityId) {
        add.add(entity.entityId);
      }
    }
    for (const coverEntityId of [...add]) {
      if ((this.entityMetadata.get(coverEntityId)?.domain || String(coverEntityId || "").split(".", 1)[0]) !== "cover") {
        continue;
      }
      const entityId = relatedCoverMotorReverseEntity(this.entityMetadata, coverEntityId);
      if (entityId?.entityId) {
        add.add(entityId.entityId);
      }
      const entity = relatedAirerLightEntity(this.entityMetadata, coverEntityId);
      if (entity?.entityId) {
        add.add(entity.entityId);
      }
      const entityIdCurrent = relatedAirerPositionNumberEntity(this.entityMetadata, coverEntityId);
      if (entityIdCurrent?.entityId) {
        add.add(entityIdCurrent.entityId);
      }
      const sensor = relatedAirerCurrentPositionSensor(this.entityMetadata, coverEntityId);
      if (sensor?.entityId) {
        add.add(sensor.entityId);
      }
      const entityIdNext = relatedAirerMotorSpeedSensor(this.entityMetadata, coverEntityId);
      if (entityIdNext?.entityId) {
        add.add(entityIdNext.entityId);
      }
      const coverMotorActions = relatedAirerMotorActionEntities(this.entityMetadata, coverEntityId);
      for (const entityId of Object.values(coverMotorActions)) {
        if (entityId?.entityId) {
          add.add(entityId.entityId);
        }
      }
    }
    for (const popupEntityIds of [...add]) {
      const domain = this.entityMetadata.get(popupEntityIds);
      if (!["climate", "fan"].includes(String(domain?.domain || ""))) {
        continue;
      }
      const entityId = relatedDeviceDomainEntity(this.entityMetadata, popupEntityIds, "light");
      if (entityId?.entityId) {
        add.add(entityId.entityId);
      }
    }
    for (const effectEntityIds of [...add]) {
      if (this.entityMetadata.get(effectEntityIds)?.domain === "water_heater") {
        for (const entityId of relatedWaterHeaterEntities(this.entityMetadata, effectEntityIds)) {
          add.add(entityId.entityId);
        }
      }
    }
    for (const allRuntimeEntityIds of [...add]) {
      const roles = this.deviceProfile(allRuntimeEntityIds);
      if (roles) {
        for (const roleKey of ["climate", "cover", "fan", "light", "power", "mode", "temperature", "humidity", "pm25", "hcho", "pm10", "filterLife", "filterLeftTime", "airQuality", "backrest", "leg", "waist", "memory1", "memory2"]) {
          const roleBoundEntityId = roles.roles?.[roleKey];
          if (roleBoundEntityId) {
            add.add(roleBoundEntityId);
          }
        }
      }
    }
    const length = [...add];
    if (!length.length) {
      this.disconnectRuntime();
      this.runtimeHydrationRetryAttempt = 0;
      return;
    }
    if (length.length > MAX_REALTIME_SUBSCRIBED_ENTITIES) {
      this.disconnectRuntime();
      const runtimeEntityLimitSignature = String(length.length);
      if (this.runtimeEntityLimitSignature !== runtimeEntityLimitSignature) {
        this.runtimeEntityLimitSignature = runtimeEntityLimitSignature;
        this.options.onError?.(new Error("当前项目需要实时订阅 " + length.length + " 个实体，已超过 " + MAX_REALTIME_SUBSCRIBED_ENTITIES + " 个上限。请减少统计或控件中绑定的实体。"));
      }
      return;
    }
    this.runtimeEntityLimitSignature = "";
    const signature = JSON.stringify([...length].sort());
    const runtimeSubscription = this.runtimeSubscription;
    const isSocketConnecting = this.socket?.readyState === WebSocket.CONNECTING;
    const isSocketOpen = this.socket?.readyState === WebSocket.OPEN;
    if (!entityId && runtimeSubscription && (isSocketConnecting || isSocketOpen && runtimeSubscription.signature === signature)) {
      runtimeSubscription.entityIds = length;
      runtimeSubscription.runtimeComponents = runtimeComponents;
      runtimeSubscription.signature = signature;
      if (isSocketOpen) {
        this.scheduleRuntimeHydrationRetry(runtimeSubscription, this.socketGeneration);
      }
      return;
    }
    if (runtimeSubscription?.signature !== signature) {
      this.runtimeHydrationRetryAttempt = 0;
    }
    this.disconnectRuntime();
    const socketGeneration = this.socketGeneration;
    const entityIds = {
      entityIds: length,
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
      let entityId;
      try {
        entityId = JSON.parse(data.data);
      } catch (reconnectTimerRef) {
        window.HABridgeLog?.error(reconnectTimerRef, {
          phase: "websocket-message",
          path: "/api/v1/ws/runtime"
        }, "实时状态消息格式异常");
        return;
      }
      if (entityId.type === "snapshot") {
        const map = entityId.states || [];
        const has = new Set(map.map(entityId => String(entityId?.entityId || "")).filter(Boolean));
        for (const socketMessageHandler of wsUrl) {
          if (!has.has(socketMessageHandler)) {
            if (this.states.has(socketMessageHandler)) {
              this.removedRuntimeEntityIds.add(socketMessageHandler);
            }
            this.states.delete(socketMessageHandler);
          }
        }
        for (const entityId of map) {
          if (this.optimisticStateIsConfirmed(entityId.entityId, entityId)) {
            this.rememberLightVisualState(entityId.entityId, entityId);
            this.removedRuntimeEntityIds.delete(entityId.entityId);
            this.states.set(entityId.entityId, entityId);
            this.applyRuntimeStateHandlers(entityId.entityId, entityId.newState || entityId);
          }
        }
        this.options.onRuntimeStateChange?.(map);
        this.tryOpenPendingEntityDetails();
        for (const entityId of map) {
          this.refreshVacuumMapEntity(entityId.entityId);
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
          const newState = this.detailsStateSync ? this.states.get(this.detailsStateSync.entityId) : null;
          if (this.detailsStateSync && newState) {
            this.detailsStateSync.apply(newState.newState || newState);
          }
        }
        this.refreshRuntimeComponents([...has, ...this.removedRuntimeEntityIds]);
        this.scheduleRuntimeHydrationRetry(entityIds, socketGeneration);
      } else if (entityId.type === "state_removed") {
        const string = String(entityId.entityId || "");
        if (!string) {
          return;
        }
        const unavailableStateEvent = {
          type: "state_changed",
          entityId: string,
          domain: string.split(".", 1)[0],
          state: "unavailable",
          attributes: {},
          available: false
        };
        this.removedRuntimeEntityIds.add(string);
        this.states.delete(string);
        this.options.onRuntimeStateChange?.([]);
        this.tryOpenPendingEntityDetails();
        if (this.detailsStateSync?.handlers?.has(string)) {
          for (const parsedSocketMessage of this.detailsStateSync.handlers.get(string)) {
            parsedSocketMessage(unavailableStateEvent);
          }
        } else if (this.detailsStateSync?.entityId === string) {
          this.detailsStateSync.apply(unavailableStateEvent);
        }
        this.applyRuntimeStateHandlers(string, unavailableStateEvent);
        this.refreshRuntimeComponents([string]);
        for (const stateChangedPayload of this.runtimeEntityComponentIndex.get(string) || []) {
          const type = this.componentRecords.get(stateChangedPayload);
          if (["line-chart", "camera", "vacuum-map"].includes(type?.type)) {
            this.refreshRuntimeComponent(stateChangedPayload);
          }
        }
        this.refreshVacuumMapEntity(string);
      } else if (entityId.type === "resync_required") {
        if (socketGeneration === this.socketGeneration && !this.destroyed) {
          this.connectRuntime({
            force: true
          });
        }
      } else if (entityId.type === "state_changed") {
        if (!this.optimisticStateIsConfirmed(entityId.entityId, entityId)) {
          return;
        }
        this.rememberLightVisualState(entityId.entityId, entityId);
        this.removedRuntimeEntityIds.delete(entityId.entityId);
        this.states.set(entityId.entityId, entityId);
        this.options.onRuntimeStateChange?.([entityId]);
        this.tryOpenPendingEntityDetails();
        this.refreshVacuumMapEntity(entityId.entityId);
        if (this.detailsStateSync?.handlers?.has(entityId.entityId)) {
          for (const entityStateUpdate of this.detailsStateSync.handlers.get(entityId.entityId)) {
            entityStateUpdate(entityId.newState || entityId);
          }
        } else if (this.detailsStateSync?.entityId === entityId.entityId) {
          this.detailsStateSync.apply(entityId.newState || entityId);
        }
        this.applyRuntimeStateHandlers(entityId.entityId, entityId.newState || entityId);
        this.scheduleRuntimeRender(entityId.entityId);
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
      const has = new Set(collectComponents(historyTarget, type => type.type === "line-chart").map(bindings => String(bindings.bindings?.entity?.entityId || "")).filter(Boolean));
      return filter.filter(item => has.has(item) && lineChartRuntimeStateNeedsHydration(this.states.get(item))).length > 0;
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
    const get = new Map();
    const collectHistoryTargets = (documentModel, shared) => {
      const historyCapableComponents = collectComponents(documentModel, type => type.type === "line-chart" || type.type === "presence-sensor");
      for (const properties of historyCapableComponents) {
        const boundEntityId = properties.bindings?.entity?.entityId;
        if (!boundEntityId) {
          continue;
        }
        const isPresenceSensor = properties.type === "presence-sensor";
        const updateIntervalSec = Math.max(30, Math.min(86400, Number(isPresenceSensor ? 300 : properties.properties?.updateInterval || 600)));
        const historyHours = Math.max(1, Math.min(168, Number(isPresenceSensor ? properties.properties?.historyHours || 24 : properties.properties?.hours || 24)));
        const interval = get.get(boundEntityId);
        get.set(boundEntityId, {
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
    const modules = this.activePopupId ? (this.document.customPopups || []).find(id => String(id.id || "") === this.activePopupId) : null;
    const push = [];
    for (const entityId of modules?.modules || []) {
      if (entityId.type === "line-chart" && entityId.entityId) {
        push.push({
          type: "line-chart",
          bindings: {
            entity: {
              entityId: entityId.entityId
            }
          },
          properties: syncedLineChartProperties(this.document, this.page, entityId.entityId, entityId.properties)
        });
      }
    }
    collectHistoryTargets(push, {
      popupId: this.activePopupId || null
    });
    const passStartedAtMs = Date.now();
    let historyFetchFailed = false;
    let historyFetchAborted = false;
    const length = [...get];
    const historyRequestContext = () => ({
      documentGeneration: this.historyDocumentGeneration,
      pagePath: this.page?.path || "",
      popupId: this.activePopupId || null,
      popupGeneration: this.historyPopupGeneration
    });
    const fetchNextHistorySeries = async () => {
      while (length.length) {
        const [entityId, hours] = length.shift();
        if (this.destroyed || !historyRequestStillRelevant(hours, historyRequestContext())) {
          continue;
        }
        const existingSeries = this.historySeries.get(entityId);
        const seriesCacheEntry = this.historySeriesCache.get(historySeriesCacheKey(entityId, hours.hours));
        const fetchedAt = [existingSeries, seriesCacheEntry].filter(points => points && points.hours === hours.hours && Array.isArray(points.points) && points.points.length > 0).sort((fetchedAt, fetchedAtRight) => fetchedAtRight.fetchedAt - fetchedAt.fetchedAt)[0];
        if (fetchedAt && passStartedAtMs - fetchedAt.fetchedAt < hours.interval * 1000) {
          if (existingSeries !== fetchedAt) {
            this.historySeries.set(entityId, fetchedAt);
            historyFetchFailed = true;
          }
          continue;
        }
        if (this.historyFetches.has(entityId)) {
          continue;
        }
        this.historyFetches.add(entityId);
        const abort = typeof AbortController == "function" ? new AbortController() : null;
        const historyFetchTimeoutId = window.setTimeout(() => abort?.abort(), HISTORY_FETCH_TIMEOUT_MS);
        try {
          const ok = await fetch("/api/v1/ha/history?entityId=" + encodeURIComponent(entityId) + "&hours=" + hours.hours, {
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
          const points = await ok.json();
          if (!historyRequestStillRelevant(hours, historyRequestContext())) {
            continue;
          }
          const options = {
            points: Array.isArray(points.points) ? points.points : [],
            hours: hours.hours,
            fetchedAt: Date.now()
          };
          this.historySeries.set(entityId, options);
          cacheHistorySeries(this.historySeriesCache, entityId, options);
          historyFetchFailed = true;
          if (!options.points.length) {
            historyFetchAborted = true;
          }
        } catch (name) {
          if (name?.name === "AbortError") {
            window.HABridgeLog?.report("warning", "网络请求", "历史曲线请求超时", {
              entityId: entityId,
              phase: "history-timeout",
              path: "/api/v1/ha/history",
              durationMs: HISTORY_FETCH_TIMEOUT_MS
            });
          }
          historyFetchAborted = true;
        } finally {
          window.clearTimeout(historyFetchTimeoutId);
          this.historyFetches.delete(entityId);
        }
      }
    };
    await Promise.all(Array.from({
      length: Math.min(2, length.length)
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
