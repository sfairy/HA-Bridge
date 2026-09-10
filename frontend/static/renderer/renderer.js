import {
  coverComponentIsDream,
  doorWindowPerspectiveCorners,
  doorWindowPerspectiveMatrix,
  formatLineChartValue,
  formatPresenceDuration,
  iconButtonEffectLightVisualAwaiting,
  iconButtonEffectLightVisualState,
  mountCameraMedia,
  prewarmCameraMedia,
  presenceHistoryBuckets,
  presenceMotionEventConfig,
  presenceSensorPresentation,
  presenceStateTimestamp,
  renderAirConditionerAirflowLayer,
  renderIconButtonEffectLayer,
  renderLineChartDetails,
  renderRegisteredComponent,
  setBuiltinAssetVersions,
  staticAssetImageSource,
  vacuumMapImageSource,
} from "./registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1-20260907-interaction3d-v1-20260907-i3d-align-v1";
import { randomUuid } from "../utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { popupLayoutMetrics } from "../js/editor/popup-layout.js?v=20260821-electric-bed-combo-v2";
import {
  bathHeaterModeUsesAirflow,
  climateControlStructureKey,
  climateDeviceLabel,
  climateEffectMode,
  climateIsPoweredOn,
  climateIsRunning,
  climateModeIcon,
  climateModeLabel,
  climateOperationModeValues,
  climateOptionPresentation,
  climatePowerCommand,
  climatePresentationMode,
  climateSwingModeLabel,
  normalizeClimateCapabilities,
  reconcileClimateTargetTemperature,
  resolveClimateDeviceType,
  waterHeaterStatusLabel,
} from "./climate.js?v=20260812-presence-phase-v79-20260904-climate-capability-options-v6";
import {
  applyXiaomiDeviceProfile,
  resolveXiaomiDeviceProfile,
} from "./device-profiles.js?v=20260821-electric-bed-sync-v4";
import {
  relatedEntityLabel,
  relatedEntityNeedsConfirmation,
  relatedEntityOptions,
  relatedEntitySelectService,
  relatedPopupContext,
  selectedRelatedEntities,
  selectedRelatedEntityIds,
} from "../js/editor/related-entities.js?v=20260825-bath-heater-primary-v1";
import {
  entityPowerIsOn,
  entityPowerTarget,
  entityToggleCommand,
  optimisticToggleState,
} from "./entity-power.js?v=20260813-generic-device-power-v2";
import {
  ICON_VISIBILITY_VIRTUAL_KIND,
  isVirtualEntityId,
  parseVirtualEntityId,
} from "../js/editor/virtual-entities.js?v=20260822-icon-visibility-v1";
import { componentActionIsSupported } from "../js/editor/action-rules.js?v=20260831-action-rules-v1";
import {
  airflowCanvasOffsetBounds,
  airflowLayerGeometry,
  groupedComponentLocalDelta,
  rotateMultiSelectionTransforms,
} from "./transform-geometry.js?v=20260901-renderer-transform-geometry-v1";
import {
  componentHostZIndex,
  effectCropRectangle,
  effectCroppedLayerGeometry,
  effectFadeDuration,
  effectLayerDimensions,
  effectReferenceImageTransform,
  effectSourceDimensions,
  normalizeIconButtonEffectComponent,
} from "./effect-geometry.js?v=20260901-renderer-effect-geometry-v2";
import {
  LIGHT_DETAIL_PRESET_DEFINITIONS,
  LIGHT_PRESET_MAXIMUM_HOLD_MS,
  LIGHT_PRESET_MINIMUM_HOLD_MS,
  LIGHT_PRESET_STABLE_CONFIRMATION_MS,
  UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT,
  UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN,
  hsToRgbColor,
  lightColorPickerHsFromPoint,
  lightColorPickerPointFromHs,
  lightColorServiceData,
  lightPresetBrightnessServiceData,
  lightPresetPendingDecision,
  lightRealtimeCapabilities,
  lightSupportsColor,
  lightVisualValueForCapability,
  relativeLightColorTemperature,
  rgbToHsColor,
} from "./light-runtime.js?v=20260901-renderer-light-runtime-v1";
import { entityMetadataIsAvailable } from "./entity-metadata.js?v=20260901-renderer-entity-metadata-v1";
import {
  relatedVacuumBatteryEntity,
  vacuumActionService,
  vacuumBatteryPercent,
  vacuumSupportedActions,
} from "./vacuum-runtime.js?v=20260901-renderer-vacuum-runtime-v1";
import {
  airerDevicePosition,
  airerPositionCalibration,
  airerPresentationPosition,
  airerPresentationPositionForState,
  airerReportedPosition,
  airerVisualDrop,
  coverComponentIsAirer,
  coverMotorIsReversedForComponent,
  coverPendingDisplayPosition,
  coverPositionReachedTarget,
  coverPresentationState,
  coverToggleServiceForComponent,
  dreamCurtainBladeLabel,
  dreamCurtainIsRetracted,
  dreamCurtainStatusFromRetraction,
  dreamCurtainStatusText,
  dreamCurtainToggleService,
  learnAirerPositionCalibration,
  physicalCoverState,
  relatedAirerCurrentPositionSensor,
  relatedAirerLightEntity,
  relatedAirerMotorActionEntities,
  relatedAirerMotorSpeedSensor,
  relatedAirerPositionNumberEntity,
  relatedCoverMotorReverseEntity,
  relatedDeviceDomainEntity,
  relatedDeviceEntity,
  relatedWaterHeaterEntities,
  runtimeCoverStateIsActive,
  runtimeEntityStateIsActive,
  waterHeaterRelatedEntityLabel,
} from "./cover-runtime.js?v=20260901-renderer-cover-runtime-v1";
import {
  playFixedDeviceDropEntrance,
  playMediaSpeakerEntrance,
  playStableRuntimeDialogEntrance,
  runtimeDialogUsesStableMotion,
} from "./runtime-dialog-motion.js?v=20260901-renderer-dialog-motion-v1";
import {
  HISTORY_FETCH_TIMEOUT_MS,
  HistoryRefreshCoordinator,
  RuntimeEffectImageLoader,
  RuntimeStaticImageCache,
  RuntimeVacuumMapImagePreloader,
  cacheHistorySeries,
  historyRequestStillRelevant,
  historySeriesCacheKey,
} from "./runtime-caches.js?v=20260901-renderer-runtime-caches-v1";
import {
  collectComponents,
  collectEntityIds,
  lineChartRuntimeStateNeedsHydration,
  syncedLineChartProperties,
} from "./runtime-document.js?v=20260901-renderer-runtime-document-v1";
export { setBuiltinAssetVersions };
export {
  airflowCanvasOffsetBounds,
  airflowLayerGeometry,
  groupedComponentLocalDelta,
  rotateMultiSelectionTransforms,
};
export {
  componentHostZIndex,
  effectCroppedLayerGeometry,
  effectLayerDimensions,
  effectReferenceImageTransform,
  normalizeIconButtonEffectComponent,
};
export {
  LIGHT_DETAIL_PRESET_DEFINITIONS,
  LIGHT_PRESET_MAXIMUM_HOLD_MS,
  LIGHT_PRESET_MINIMUM_HOLD_MS,
  LIGHT_PRESET_STABLE_CONFIRMATION_MS,
  UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT,
  UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN,
  hsToRgbColor,
  lightColorPickerHsFromPoint,
  lightColorPickerPointFromHs,
  lightColorServiceData,
  lightPresetBrightnessServiceData,
  lightPresetPendingDecision,
  lightRealtimeCapabilities,
  lightSupportsColor,
  lightVisualValueForCapability,
  relativeLightColorTemperature,
  rgbToHsColor,
};
export {
  relatedVacuumBatteryEntity,
  vacuumActionService,
  vacuumBatteryPercent,
  vacuumSupportedActions,
};
export {
  airerDevicePosition,
  airerPositionCalibration,
  airerPresentationPosition,
  airerPresentationPositionForState,
  airerReportedPosition,
  airerVisualDrop,
  coverComponentIsAirer,
  coverMotorIsReversedForComponent,
  coverPendingDisplayPosition,
  coverPositionReachedTarget,
  coverToggleServiceForComponent,
  dreamCurtainBladeLabel,
  dreamCurtainIsRetracted,
  dreamCurtainStatusText,
  dreamCurtainToggleService,
  learnAirerPositionCalibration,
  relatedAirerCurrentPositionSensor,
  relatedAirerLightEntity,
  relatedAirerMotorActionEntities,
  relatedAirerMotorSpeedSensor,
  relatedAirerPositionNumberEntity,
  relatedWaterHeaterEntities,
  waterHeaterRelatedEntityLabel,
};
export { runtimeDialogUsesStableMotion };
export {
  HistoryRefreshCoordinator,
  RuntimeEffectImageLoader,
  RuntimeStaticImageCache,
  RuntimeVacuumMapImagePreloader,
  historyRequestStillRelevant,
};
export { lineChartRuntimeStateNeedsHydration, syncedLineChartProperties };
const MAX_REALTIME_SUBSCRIBED_ENTITIES = 1000;
const DEFAULT_TARGET_OCCUPANCY = 0.76;
const COMPACT_TARGET_OCCUPANCY = 0.7;
const MAX_PREFERRED_SCALE = 1.6;
const FILL_AVAILABLE_SCALE = 2;
const FILL_TIGHT_FILL_SCALE = 2.12;
// Cover position convention in this codebase: 0 = fully closed, 100 = fully open.
// A cover whose reported position exceeds this epsilon is treated as "not closed",
// so a toggle click drives it toward the opposite extreme.
const COVER_CLOSED_POSITION_EPSILON = 1;
export function runtimeDialogLayout({
  layerWidth,
  layerHeight,
  layoutWidth,
  layoutHeight,
  fillAvailable = false,
  tightFill = false,
  targetOccupancy = DEFAULT_TARGET_OCCUPANCY,
}) {
  const count = Math.max(1, Number(layerWidth) || 1);
  const count2 = Math.max(1, Number(layerHeight) || 1);
  const count3 = Math.max(1, Number(layoutWidth) || 1);
  const count4 = Math.max(1, Number(layoutHeight) || 1);
  const safeInset = tightFill
    ? Math.min(40, Math.max(24, Math.min(count, count2) * 0.03))
    : fillAvailable
      ? Math.min(80, Math.max(32, Math.min(count, count2) * 0.075))
      : Math.min(64, Math.max(24, Math.min(count, count2) * 0.05));
  const availableWidth = Math.max(1, count - safeInset * 2);
  const availableHeight = Math.max(1, count2 - safeInset * 2);
  const fitScale = Math.min(availableWidth / count3, availableHeight / count4);
  const count5 = Math.max(0.2, Math.min(1, Number(targetOccupancy) || DEFAULT_TARGET_OCCUPANCY));
  const state = Math.min(
    (count * count5) / count3,
    (count2 * count5) / count4,
  );
  const preferredScale = Math.min(MAX_PREFERRED_SCALE, state);
  const scale = Math.min(
    fillAvailable ? (tightFill ? FILL_TIGHT_FILL_SCALE : FILL_AVAILABLE_SCALE) : preferredScale,
    fitScale,
  );
  return {
    availableWidth,
    availableHeight,
    fitScale,
    preferredScale,
    safeInset,
    scale: Math.max(0.08, scale),
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
  dashboardHeight,
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
    centerY: count6 - asNumber1 + height / 2,
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
  return event.altKey || event.ctrlKey || (isApplePlatform && event.metaKey);
}
function isComponentActionSupported(component, action) {
  return componentActionIsSupported(component, action);
}
export function componentDialogTitle(component, fallbackTitle) {
  const properties = component?.properties || {};
  return String(properties.label || "").trim() || fallbackTitle;
}
export function popupModuleDialogTitle(moduleConfig, entityState, fallbackTitle = "") {
  return (
    String(moduleConfig?.title || "").trim() ||
    String(fallbackTitle || "").trim() ||
    String(entityState?.attributes?.friendly_name || "").trim() ||
    String(moduleConfig?.entityId || "").trim()
  );
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
  airerVisualLiftsEl.append(
    ownerDocument.createElement("i"),
    ownerDocument.createElement("i"),
  );
  const airerVisualRackEl = ownerDocument.createElement("span");
  airerVisualRackEl.className = "hb-airer-visual-rack";
  for (let cover = 0; cover < 4; cover += 1) {
    airerVisualRackEl.append(ownerDocument.createElement("i"));
  }
  airerVisualEl.append(airerVisualGlowEl, airerVisualBodyEl, airerVisualLiftsEl, airerVisualRackEl);
  parentEl.append(airerVisualEl);
}
function coverLiftStateLabel(state) {
  return (
    {
      open: "已升起",
      closed: "已下降",
      opening: "正在升起",
      closing: "正在下降",
    }[state] || ""
  );
}
function buildSwitchVisual({
  label = "开关",
  interactive = true,
  onToggle = null,
  compact = false,
  momentary = false,
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
  const sync = (
    arg,
    {
      unavailable = false,
      pending = false,
      success = false,
    } = {},
  ) => {
    const state = (momentary ? pending : !!arg) && !unavailable;
    visual.classList.toggle("is-on", state);
    visual.classList.toggle("is-unavailable", unavailable);
    visual.classList.toggle("is-pending", pending);
    visual.classList.toggle("is-success", success);
    visual.setAttribute("aria-pressed", String(state));
    visual.setAttribute("aria-busy", String(pending));
    visual.setAttribute(
      "aria-label",
      unavailable
        ? label + "当前不可用"
        : momentary
          ? "" +
            label +
            (success ? "执行成功" : pending ? "正在执行" : "，点击执行")
          : "" + label + (state ? "已开启，点击关闭" : "已关闭，点击开启"),
    );
    if (element4) {
      element4.textContent = unavailable
        ? "当前不可用"
        : momentary
          ? success
            ? "执行成功"
            : pending
              ? "执行中"
              : "点击执行"
          : state
            ? "运行中"
            : "已关闭";
    }
  };
  visual.addEventListener("click", () => {
    if (
      interactive &&
      !visual.classList.contains("is-pending") &&
      !visual.classList.contains("is-unavailable")
    ) {
      onToggle?.();
    }
  });
  return {
    visual,
    sync,
  };
}
function lerpHexColor(fromHex, toHex, t = 0) {
  const normalizeHexColor = (hex) => {
    const asString = String(hex || "").trim();
    const mapped = /^#[0-9a-f]{3}$/i.test(asString)
      ? "#" +
        asString
          .slice(1)
          .split("")
          .map((digit) => "" + digit + digit)
          .join("")
      : asString;
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
  const amount = Math.max(0, Math.min(1, Number(t) || 0));
  const readHexByte = (hex, offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((offset) =>
        Math.round(
          readHexByte(fromNormalized, offset) +
            (readHexByte(toNormalized, offset) -
              readHexByte(fromNormalized, offset)) *
              amount,
        ),
      )
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")
  );
}
export class PanelRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      ...options,
      onError: (onError) => {
        window.HABridgeLog?.error(onError, {
          phase: "runtime-operation",
        });
        options.onError?.(onError);
      },
    };
    this.boundRuntimeButtonSound = (event) => {
      if (this.options.editable) {
        return;
      }
      const pressedButton =
        typeof Element !== "undefined" && event.target instanceof Element
          ? event.target.closest('button, [role="button"]')
          : null;
      if (!!pressedButton && !!this.container.contains(pressedButton)) {
        this.options.onRuntimeButtonPress?.(pressedButton);
      }
    };
    this.container.addEventListener(
      "click",
      this.boundRuntimeButtonSound,
      true,
    );
    this.renderNamespace =
      "renderer-" + randomUuid().replace(/[^a-z0-9]/gi, "");
    this.document = null;
    this.page = null;
    this.states =
      options.runtimeStateCache instanceof Map
        ? options.runtimeStateCache
        : new Map();
    this.virtualEntityStates =
      options.virtualEntityStateCache instanceof Map
        ? options.virtualEntityStateCache
        : new Map();
    this.entityMetadata = new Map();
    this.deviceMetadata = new Map();
    this.entityCatalogReady = false;
    this.entityTranslations = {};
    this.historySeries = new Map();
    this.historySeriesCache =
      options.historySeriesCache instanceof Map
        ? options.historySeriesCache
        : new Map();
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
      idleDelay: 120,
    });
    this.runtimeEffectImageLoader = new RuntimeEffectImageLoader({
      maxConcurrent: 4,
      idleDelay: 160,
    });
    this.runtimeVacuumMapImagePreloader = new RuntimeVacuumMapImagePreloader({
      maxConcurrent: 1,
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
      if (
        !this.destroyed &&
        (!this.socket || this.socket.readyState >= WebSocket.CLOSING)
      ) {
        this.connectRuntime();
      }
    };
    this.boundVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastRuntimeResumeAt = Date.now();
        if (this.document && lastRuntimeResumeAt - this.lastRuntimeResumeAt >= 1500) {
          this.lastRuntimeResumeAt = lastRuntimeResumeAt;
          this.connectRuntime();
        }
        this.refreshHistorySeries();
      }
    };
    this.historyPollTimer = window.setInterval(
      () => this.refreshHistorySeries(),
      30000,
    );
    window.visualViewport?.addEventListener("resize", this.boundResize);
    window.addEventListener("orientationchange", this.boundResize);
    window.addEventListener("online", this.boundReconnect);
    document.addEventListener("visibilitychange", this.boundVisibilityChange);
  }
  setDocument(documentModel, pagePath = null) {
    this.destroyed = false;
    const map = this.options.editable
      ? new Map(
          [...this.componentHosts].filter(
            ([componentId, hostEl]) =>
              this.componentRecords.get(componentId)?.type ===
                "floorplan-auto-diagram" &&
              hostEl.querySelector(".hb-floorplan-auto-diagram-preview"),
          ),
        )
      : null;
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
      this.vacuumMapEntityIds = new Set(
        collectComponents(
          [
            ...(this.document.sharedComponents || []),
            ...this.document.pages.flatMap((page) => page.components || []),
          ],
          (component) => component.type === "vacuum-map",
        )
          .map((component) =>
            String(component.bindings?.entity?.entityId || ""),
          )
          .filter((entityId) => entityId.startsWith("image.")),
      );
      const page = this.document.pages.find(
        (candidate) => candidate.path === pagePath,
      );
      const defaultPage = this.document.pages.find(
        (candidate) => candidate.path === this.document.defaultPagePath,
      );
      this.page = page || defaultPage || this.document.pages[0];
      this.render(map);
      this.preloadStaticImages();
      if (!this.options.editable) {
        const flatMapped = collectComponents(
          [
            ...(this.document.sharedComponents || []),
            ...this.document.pages.flatMap((page) => page.components || []),
          ],
          (component) =>
            component.type === "camera" &&
            component.properties?.mediaVisible !== false &&
            component.properties?.displayMode !== "snapshot",
        )
          .map((component) =>
            String(component.bindings?.entity?.entityId || ""),
          )
          .filter(Boolean);
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
    const listImageSources = (arg) =>
      collectComponents(
        arg,
        (component) =>
          component.type === "image" && component.properties?.assetId,
      )
        .map((component) =>
          staticAssetImageSource(component.properties.assetId),
        )
        .filter(Boolean);
    const index = new Map(
      (this.document.sharedComponents || []).map((arg) => [
        arg.id,
        arg,
      ]),
    );
    const filtered = (this.page.sharedComponentIds || [])
      .map((arg) => index.get(arg))
      .filter(Boolean);
    const state = listImageSources([...(this.page.components || []), ...filtered]);
    const flatMapped = listImageSources([
      ...(this.document.sharedComponents || []),
      ...this.document.pages.flatMap((arg) => arg.components || []),
    ]);
    this.runtimeStaticImageCache.setSources(flatMapped, state);
  }
  setEntityCatalog(catalog = [], entityTranslations = {}, arg3 = []) {
    this.entityMetadata = new Map(
      (catalog || [])
        .map((arg) => [String(arg.entityId || ""), arg])
        .filter(([arg]) => arg),
    );
    this.deviceMetadata = new Map(
      (arg3 || [])
        .map((arg) => [String(arg.deviceId || ""), arg])
        .filter(([arg]) => arg),
    );
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
    return resolveXiaomiDeviceProfile(
      entityId,
      this.entityMetadata,
      this.deviceMetadata,
      this.states,
    );
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
    if (
      ![...this.componentRecords.values()].some(
        (arg) => arg.type === "icon-button-effect",
      )
    ) {
      throw new Error("当前页面没有图标按钮（效果）。");
    }
    const state1 = this.iconVisibilityPageKey();
    const state2 = !this.iconVisibilityState();
    this.virtualEntityStates.set(state1, state2);
    this.states.set(entityId, {
      entityId,
      state: state2 ? "on" : "off",
      attributes: {},
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
    return (
      Number.isFinite(numeric) &&
      Number.isFinite(numeric2) &&
      Number.isFinite(numeric3) &&
      numeric3 > numeric2
    );
  }
  deferEntityDetailsUntilReady(entityId, preview, reason = "water-heater") {
    window.clearTimeout(this.pendingEntityDetails?.timer);
    window.clearTimeout(this.pendingEntityDetails?.retryTimer);
    const pendingEntityDetails = {
      component: structuredClone(entityId),
      preview,
      reason,
      retryTimer: null,
      timer: null,
    };
    const state = reason === "catalog" || reason === "electric-bed-catalog";
    if (state) {
      const state1 = () => {
        if (this.pendingEntityDetails !== pendingEntityDetails) {
          return;
        }
        const state2 = this.runtimeEntityId(
          pendingEntityDetails.component?.bindings?.entity?.entityId,
        );
        if (
          !this.entityCatalogReady ||
          (reason === "electric-bed-catalog" &&
            this.deviceProfile(state2)?.deviceType !== "electric-bed")
        ) {
          pendingEntityDetails.retryTimer = window.setTimeout(state1, 260);
          return;
        }
        window.clearTimeout(pendingEntityDetails.timer);
        this.pendingEntityDetails = null;
        this.showEntityDetails(pendingEntityDetails.component, {
          preview: pendingEntityDetails.preview,
        });
      };
      pendingEntityDetails.retryTimer = window.setTimeout(state1, 260);
    }
    pendingEntityDetails.timer = window.setTimeout(
      () => {
        if (this.pendingEntityDetails === pendingEntityDetails) {
          this.pendingEntityDetails = null;
          if (
            state &&
            this.detailsDialog?.classList.contains(
              "electric-bed-loading-details",
            )
          ) {
            this.detailsDialog.close();
          }
          if (state) {
            this.options.onError?.(new Error("设备信息正在加载，请稍后重试。"));
          } else {
            this.options.onError?.(
              new Error("热水器状态正在加载，请稍后重试。"),
            );
          }
        }
      },
      state ? 10000 : 3000,
    );
    this.pendingEntityDetails = pendingEntityDetails;
  }
  tryOpenPendingEntityDetails() {
    const pendingEntityDetails = this.pendingEntityDetails;
    if (!pendingEntityDetails) {
      return false;
    }
    const state = this.runtimeEntityId(
      pendingEntityDetails.component?.bindings?.entity?.entityId,
    );
    if (
      !this.entityCatalogReady ||
      (pendingEntityDetails.reason === "water-heater" &&
        !this.waterHeaterDetailsReady(state)) ||
      (pendingEntityDetails.reason === "electric-bed-catalog" &&
        this.deviceProfile(state)?.deviceType !== "electric-bed")
    ) {
      return false;
    } else {
      window.clearTimeout(pendingEntityDetails.timer);
      this.pendingEntityDetails = null;
      this.showEntityDetails(pendingEntityDetails.component, {
        preview: pendingEntityDetails.preview,
      });
      return true;
    }
  }
  profiledComponent(
    component,
    component1 = component?.bindings?.entity?.entityId || "",
  ) {
    return applyXiaomiDeviceProfile(
      component,
      this.deviceProfile(this.runtimeEntityId(component1)) ||
        this.deviceProfile(component1),
    );
  }
  powerEntityId(
    component,
    component1 = component?.bindings?.entity?.entityId || "",
  ) {
    const state = this.runtimeEntityId(component1);
    const state1 = this.deviceProfile(state) || this.deviceProfile(component1);
    const state2 = entityPowerTarget(state, component, state1);
    if (state2 !== state) {
      return this.runtimeEntityId(state2);
    }
    const state3 = relatedPopupContext(
      component,
      this.entityMetadata,
      this.deviceMetadata,
      this.states,
    );
    if (
      component?.type !== "air-conditioner" &&
      state3?.deviceType === "bath-heater"
    ) {
      const found = state3.siblings?.find(
        (arg) =>
          arg.domain === "light" && entityMetadataIsAvailable(arg),
      );
      if (found?.entityId) {
        return this.runtimeEntityId(found.entityId);
      }
    }
    return state;
  }
  runtimePowerComponent(
    component,
    component1 = component?.bindings?.entity?.entityId || "",
  ) {
    const component2 = this.profiledComponent(component, component1);
    const state = this.runtimeEntityId(component1);
    const entityId = this.powerEntityId(component2, component1);
    if (!entityId || (entityId === state && state === component1)) {
      return component2;
    } else {
      return {
        ...component2,
        bindings: {
          ...(component2.bindings || {}),
          entity: {
            entityId,
          },
        },
        properties: {
          ...(component2.properties || {}),
          runtimePowerEntityId: entityId,
        },
      };
    }
  }
  navigate(pagePath) {
    const page = this.document?.pages.find((arg) => arg.path === pagePath);
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
  setSelectedComponents(componentIds, arg2 = null) {
    this.selectedComponentIds = new Set(
      (componentIds || []).filter((arg) => this.componentRecords.has(arg)),
    );
    this.selectedComponentId = this.selectedComponentIds.has(arg2)
      ? arg2
      : this.selectedComponentIds.values().next().value || null;
    this.syncSelection();
  }
  setActiveGroup(groupId = null) {
    this.activeGroupId =
      groupId && this.componentRecords.get(groupId)?.type === "group"
        ? groupId
        : null;
    this.syncActiveGroup();
  }
  syncActiveGroup() {
    if (this.canvas) {
      this.canvas.classList.toggle("hb-editing-group", !!this.activeGroupId);
      for (const [item, element] of this.componentHosts) {
        element.classList.toggle(
          "hb-active-edit-group",
          item === this.activeGroupId && element.parentElement === this.canvas,
        );
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
        ...(numeric.position || {}),
      };
      numeric.style = {
        ...(numeric.style || {}),
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
        position.style.transform =
          "rotate(" +
          Number(numeric.position.rotation || 0) +
          "deg) scale(" +
          Number(numeric.style.scale || 1) +
          ")";
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
      ...fallback,
    };
    if (
      component.type === "camera" &&
      Object.hasOwn(fallback, "label") &&
      this.detailsDialog?.dataset?.componentId === componentId
    ) {
      const element = this.detailsDialog.querySelector(
        ".hb-camera-preview-heading strong",
      );
      if (element) {
        element.textContent = componentDialogTitle(component, "摄像头实时预览");
      }
    }
    if (Number.isFinite(fallback.opacity)) {
      const hbImageComponent = component1.querySelector(".hb-image-component");
      if (hbImageComponent) {
        hbImageComponent.style.opacity = String(
          Math.max(0, Math.min(1, fallback.opacity)),
        );
      }
      const hbVacuumMapComponent = component1.querySelector(
        ".hb-vacuum-map-component",
      );
      if (hbVacuumMapComponent) {
        hbVacuumMapComponent.style.opacity = String(
          Math.max(0, Math.min(1, fallback.opacity)),
        );
      }
    }
    if (component.type === "light-statistics") {
      this.refreshRuntimeComponent(componentId);
      return;
    }
    const state = [
      "time",
      "date",
      "weather",
      "panel-frame",
      "icon-button-effect",
      "title-button",
      "icon-button",
      "device-button",
      "presence-sensor",
      "air-conditioner",
      "camera",
      "vacuum-map",
      "floorplan-auto-diagram",
    ];
    if (this.options.editable && state.includes(component.type)) {
      this.refreshEditorComponent(componentId);
      return;
    }
    if (
      [
        "time",
        "date",
        "weather",
        "line-chart",
        "panel-frame",
        "icon-button-effect",
        "title-button",
        "icon-button",
        "device-button",
        "presence-sensor",
        "air-conditioner",
        "camera",
        "vacuum-map",
      ].includes(component.type)
    ) {
      this.renderComponents();
      return;
    }
    if (component.type === "navigation-button") {
      const found = [...component1.children].find(
        (element) => !element.classList.contains("hb-selection-bounds"),
      );
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
        isIconVisible: (isIconVisible) =>
          this.iconVisibilityState(isIconVisible),
        navigate: (navigate) => this.navigate(navigate),
        cleanup: (cleanup) => this.cleanups.push(cleanup),
      };
      const state2 = renderRegisteredComponent(
        this.profiledComponent(component),
        state1,
      );
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
    this.canvas
      ?.querySelectorAll(".hb-multi-selection-bounds")
      .forEach((arg) => arg.remove());
    this.canvas
      ?.querySelectorAll(".hb-component-selection-overlay")
      .forEach((arg) => arg.remove());
    this.componentSelectionOverlays.clear();
    for (const valueEntry of this.componentAirflowLayers.values()) {
      valueEntry
        .querySelectorAll(":scope > .hb-selection-bounds")
        .forEach((arg) => arg.remove());
    }
    for (const [item, element] of this.componentHosts) {
      const state =
        this.options.editable && this.selectedComponentIds.has(item);
      const component = this.componentRecords.get(item);
      const state1 =
        component?.type === "floorplan-auto-diagram" &&
        component.properties?.generated !== true;
      element.hidden = state1 ? !state : component?.style?.visible === false;
      element.classList.toggle("selected", state);
      element.classList.toggle(
        "selection-primary",
        state && item === this.selectedComponentId,
      );
      element.classList.toggle(
        "hb-light-statistics-selection-host",
        state &&
          this.selectedComponentIds.size === 1 &&
          component?.type === "light-statistics",
      );
      element
        .querySelectorAll(
          ":scope > .hb-selection-bounds, :scope > .hb-transform-handle",
        )
        .forEach((arg) => arg.remove());
      if (!state) {
        continue;
      }
      const state2 =
        this.selectedComponentIds.size === 1 &&
        item === this.selectedComponentId &&
        component?.type === "air-conditioner" &&
        this.componentSelectionLayers.get(item) === "airflow";
      const state3 =
        this.selectedComponentIds.size === 1 &&
        item === this.selectedComponentId &&
        component?.type === "icon-button-effect" &&
        this.componentSelectionLayers.get(item) === "effect";
      const state4 =
        this.selectedComponentIds.size === 1 &&
        item === this.selectedComponentId &&
        component?.type === "presence-sensor" &&
        component?.properties?.sensorKind === "door-window" &&
        this.componentSelectionLayers.get(item) === "perspective";
      if (state2) {
        this.appendAirflowTransformHandles(
          this.componentAirflowLayers.get(item),
          component,
        );
      } else if (
        state3 &&
        this.componentEffectLayers.get(item) &&
        !this.componentEffectLayers.get(item).hidden
      ) {
        this.appendEffectSelectionBounds(
          this.componentEffectLayers.get(item),
          component,
        );
      } else if (state4) {
        const state5 =
          this.createComponentSelectionOverlay(element, component) || element;
        this.appendDoorWindowPerspectiveHandles(element, component, state5);
      } else {
        const state5 = this.selectedComponentIds.size === 1;
        const state6 = state5
          ? this.createComponentSelectionOverlay(element, component)
          : element;
        this.appendTransformHandles(
          element,
          component,
          state5,
          state6 || element,
        );
      }
    }
    if (this.selectedComponentIds.size > 1) {
      this.appendMultiSelectionBounds();
    }
  }
  selectedScaleRecords() {
    const mapped = [...this.selectedComponentIds].map((arg) => ({
      component: this.componentRecords.get(arg),
      host: this.componentHosts.get(arg),
    }));
    const state = mapped[0]?.host?.parentElement || null;
    if (
      mapped.length < 2 ||
      mapped.some(
        (arg) =>
          !arg.component ||
          !arg.host ||
          arg.host.parentElement !== state ||
          arg.component.properties?.layoutMode === "fill",
      )
    ) {
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
      scale,
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
    return this.componentTransformChain(componentId).reduce(
      (arg, arg2) => ({
        rotation: arg.rotation + Number(arg2.position?.rotation || 0),
        scale:
          arg.scale *
          Math.max(0.01, Math.min(5, Number(arg2.style?.scale || 1))),
      }),
      {
        rotation: 0,
        scale: 1,
      },
    );
  }
  worldPointToComponentLocal(componentId, point, arg3) {
    let state = {
      x: Number(point || 0),
      y: Number(arg3 || 0),
    };
    const state1 = this.componentTransformChain(componentId).reverse();
    for (const item of state1) {
      const numeric1 = item.position || {};
      const numeric = Number(numeric1.width || 100);
      const numeric2 = Number(numeric1.height || 100);
      const count = Math.max(
        0.01,
        Math.min(5, Number(item.style?.scale || 1)),
      );
      const scale = (Number(numeric1.rotation || 0) * Math.PI) / 180;
      const state2 = Math.cos(scale);
      const state3 = Math.sin(scale);
      const asNumber = Number(numeric1.x || 0) + numeric / 2;
      const asNumber1 = Number(numeric1.y || 0) + numeric2 / 2;
      const state4 = (state.x - asNumber) / count;
      const state5 = (state.y - asNumber1) / count;
      state = {
        x: numeric / 2 + state4 * state2 + state5 * state3,
        y: numeric2 / 2 - state4 * state3 + state5 * state2,
      };
    }
    return state;
  }
  componentVisualBounds(componentId, arg2 = null) {
    const numeric = componentId.position || {};
    const count = Math.max(0.01, Number(numeric.width || 100));
    const count2 = Math.max(0.01, Number(numeric.height || 100));
    let size = count;
    let state = count2;
    let state1 = 0;
    let state2 = 0;
    if (componentId.type === "light-statistics" && arg2) {
      const element = arg2.querySelector(":scope > .hb-selection-bounds");
      const size2 = element
        ? [
            Number.parseFloat(element.style.left),
            Number.parseFloat(element.style.top),
            Number.parseFloat(element.style.width),
            Number.parseFloat(element.style.height),
          ]
        : [];
      if (size2.every(Number.isFinite) && size2[2] > 0 && size2[3] > 0) {
        [state1, state2, size, state] = size2;
      }
    }
    const count3 = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    const scale = (Number(numeric.rotation || 0) * Math.PI) / 180;
    const state3 = size * count3;
    const state4 = state * count3;
    const state5 =
      (Math.abs(Math.cos(scale)) * state3 +
        Math.abs(Math.sin(scale)) * state4) /
      2;
    const state6 =
      (Math.abs(Math.sin(scale)) * state3 +
        Math.abs(Math.cos(scale)) * state4) /
      2;
    const asNumber = Number(numeric.x || 0) + count / 2;
    const asNumber1 = Number(numeric.y || 0) + count2 / 2;
    const asNumber2 = Number(numeric.x || 0) + state1 + size / 2;
    const asNumber3 = Number(numeric.y || 0) + state2 + state / 2;
    const state7 = (asNumber2 - asNumber) * count3;
    const state8 = (asNumber3 - asNumber1) * count3;
    const state9 =
      asNumber + state7 * Math.cos(scale) - state8 * Math.sin(scale);
    const size1 =
      asNumber1 + state7 * Math.sin(scale) + state8 * Math.cos(scale);
    return {
      left: state9 - state5,
      top: size1 - state6,
      right: state9 + state5,
      bottom: size1 + state6,
    };
  }
  scaleRecordsBounds(records) {
    const mapped = records.map((arg) =>
      this.componentVisualBounds(arg.component, arg.host),
    );
    return {
      left: Math.min(...mapped.map((left) => left.left)),
      top: Math.min(...mapped.map((top) => top.top)),
      right: Math.max(...mapped.map((right) => right.right)),
      bottom: Math.max(...mapped.map((bottom) => bottom.bottom)),
    };
  }
  refreshMultiSelectionBounds() {
    const matchedEl = this.canvas?.querySelector(".hb-multi-selection-bounds");
    if (
      !matchedEl ||
      !this.selectedComponentIds ||
      this.selectedComponentIds.size < 2
    ) {
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
      height: Math.max(1, scale.bottom - scale.top) + "px",
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
    element.classList.toggle(
      "handles-outside",
      domRect.width < 132 || domRect.height < 112,
    );
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
      height: Math.max(1, selectionBoundsEl1.bottom - selectionBoundsEl1.top) + "px",
    });
    for (const cornerMarkerEl of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl2.append(cornerMarkerEl1);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动整体缩放";
    transformHandleEl.addEventListener("pointerdown", (transformHandleEl2) =>
      this.startComponentsScale(transformHandleEl2, selectionBoundsEl, selectionBoundsEl1, selectionBoundsEl2),
    );
    const transformHandleEl1 = document.createElement("button");
    transformHandleEl1.type = "button";
    transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
    transformHandleEl1.title = "拖动整体旋转";
    transformHandleEl1.addEventListener("pointerdown", (arg) =>
      this.startComponentsRotate(arg, selectionBoundsEl, selectionBoundsEl1, selectionBoundsEl2),
    );
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
          ...(Number.isFinite(item.x)
            ? {
                x: item.x,
              }
            : {}),
          ...(Number.isFinite(item.y)
            ? {
                y: item.y,
              }
            : {}),
        };
        if (Number.isFinite(item.scale)) {
          numeric.style = {
            ...(numeric.style || {}),
            scale: item.scale,
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
          position.style.transform =
            "rotate(" +
            Number(numeric.position?.rotation || 0) +
            "deg) scale(" +
            Number(numeric.style?.scale || 1) +
            ")";
        }
      }
    }
    this.syncSelection();
    this.options.onComponentsTransformPreview?.(componentIds, transform);
  }
  startComponentsScale(event, handle, arg3, element) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - size, event.clientY - size1),
    );
    const size2 = (arg3.left + arg3.right) / 2;
    const size3 = (arg3.top + arg3.bottom) / 2;
    const mapped = handle.map((arg) => {
      const numeric = arg.component.position || {};
      const width = Number(numeric.width || 100);
      const height = Number(numeric.height || 100);
      return {
        ...arg,
        width,
        height,
        centerX: Number(numeric.x || 0) + width / 2,
        centerY: Number(numeric.y || 0) + height / 2,
        scale: Math.max(
          0.01,
          Math.min(5, Number(arg.component.style?.scale || 1)),
        ),
      };
    });
    const count2 = Math.max(...mapped.map((arg) => 0.01 / arg.scale));
    const mapped1 = Math.min(...mapped.map((arg) => 5 / arg.scale));
    let scale = 1;
    let scale1 = [];
    let event1 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event2 = (event3) => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      const event4 = Math.hypot(
        event3.clientX - size,
        event3.clientY - size1,
      );
      scale = Math.max(count2, Math.min(mapped1, event4 / count));
      scale1 = mapped.map((arg) => {
        const state1 = size2 + (arg.centerX - size2) * scale;
        const scale2 = size3 + (arg.centerY - size3) * scale;
        const scale = arg.scale * scale;
        const position = state1 - arg.width / 2;
        const position1 = scale2 - arg.height / 2;
        arg.component.position = {
          ...(arg.component.position || {}),
          x: position,
          y: position1,
        };
        arg.component.style = {
          ...(arg.component.style || {}),
          scale,
        };
        arg.host.style.left = position + "px";
        arg.host.style.top = position1 + "px";
        arg.host.style.transform =
          "rotate(" +
          Number(arg.component.position?.rotation || 0) +
          "deg) scale(" +
          scale +
          ")";
        return {
          componentId: arg.component.id,
          x: position,
          y: position1,
          scale,
        };
      });
      Object.assign(element.style, {
        left: size2 + (arg3.left - size2) * scale + "px",
        top: size3 + (arg3.top - size3) * scale + "px",
        width: Math.max(1, (arg3.right - arg3.left) * scale) + "px",
        height: Math.max(1, (arg3.bottom - arg3.top) * scale) + "px",
      });
      this.updateMultiSelectionHandleScale(element);
      this.options.onComponentsTransformPreview?.(
        scale1,
        this.selectedComponentId,
      );
    };
    const state = (event3 = null) => {
      if (
        !event1 &&
        (event3?.pointerId == null || event3.pointerId === pointerId)
      ) {
        event1 = true;
        window.removeEventListener("pointermove", event2, true);
        window.removeEventListener("pointerup", state, true);
        window.removeEventListener("pointercancel", state, true);
        window.removeEventListener("blur", state);
        if (scale !== 1 && scale1.length) {
          this.options.onComponentsTransform?.(
            scale1,
            this.selectedComponentId,
          );
        }
      }
    };
    window.addEventListener("pointermove", event2, true);
    window.addEventListener("pointerup", state, true);
    window.addEventListener("pointercancel", state, true);
    window.addEventListener("blur", state);
  }
  startComponentsRotate(event, arg2, arg3, element) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const event1 = domRect.top + domRect.height / 2;
    const size1 = (arg3.left + arg3.right) / 2;
    const size2 = (arg3.top + arg3.bottom) / 2;
    const mapped = arg2.map((arg) => {
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
        rotation: Number(numeric.rotation || 0),
      };
    });
    let state = Math.atan2(event.clientY - event1, event.clientX - size);
    let state1 = 0;
    let state2 = [];
    let event2 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event3 = (event4) => {
      if (event4.pointerId !== pointerId) {
        return;
      }
      const state4 = Math.atan2(
        event4.clientY - event1,
        event4.clientX - size,
      );
      let amount = state4 - state;
      if (amount > Math.PI) {
        amount -= Math.PI * 2;
      } else if (amount < -Math.PI) {
        amount += Math.PI * 2;
      }
      state1 += (amount * 180) / Math.PI;
      state = state4;
      state2 = rotateMultiSelectionTransforms(mapped, size1, size2, state1);
      for (const item of state2) {
        const found = mapped.find(
          (arg) => arg.componentId === item.componentId,
        );
        if (found) {
          found.component.position = {
            ...(found.component.position || {}),
            x: item.x,
            y: item.y,
            rotation: item.rotation,
          };
          found.host.style.left = item.x + "px";
          found.host.style.top = item.y + "px";
          found.host.style.transform =
            "rotate(" +
            item.rotation +
            "deg) scale(" +
            Number(found.component.style?.scale || 1) +
            ")";
        }
      }
      element.style.transform = "rotate(" + state1 + "deg)";
      element.style.transformOrigin = "center center";
      this.options.onComponentsTransformPreview?.(
        state2,
        this.selectedComponentId,
      );
    };
    const state3 = (event4 = null) => {
      if (
        !event2 &&
        (event4?.pointerId == null || event4.pointerId === pointerId)
      ) {
        event2 = true;
        window.removeEventListener("pointermove", event3, true);
        window.removeEventListener("pointerup", state3, true);
        window.removeEventListener("pointercancel", state3, true);
        window.removeEventListener("blur", state3);
        if (state1 !== 0 && state2.length) {
          this.options.onComponentsTransform?.(
            state2,
            this.selectedComponentId,
          );
        }
      }
    };
    window.addEventListener("pointermove", event3, true);
    window.addEventListener("pointerup", state3, true);
    window.addEventListener("pointercancel", state3, true);
    window.addEventListener("blur", state3);
  }
  cleanupComponents(component = false, preserveIds = new Set()) {
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
  cleanupRenderedComponent(componentId) {
    const state = this.componentCleanups.get(componentId) || [];
    this.componentCleanups.delete(componentId);
    for (const runHelper of state.splice(0)) {
      runHelper();
    }
  }
  render(preservedHosts = null) {
    const state =
      !!preservedHosts?.size &&
      !!this.canvas?.isConnected &&
      !!this.viewport?.isConnected &&
      !![...preservedHosts.values()].some(
        (arg) => arg.parentElement === this.canvas,
      );
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
    for (const [entry, entry1] of Object.entries(
      this.document?.theme?.variables || {},
    )) {
      const asString = String(entry).startsWith("--")
        ? String(entry)
        : "--" + entry;
      if (/^--[a-zA-Z0-9_-]+$/.test(asString)) {
        this.container.style.setProperty(asString, String(entry1));
        this.themeVariableNames.add(asString);
      }
    }
    if (!state) {
      const viewport = document.createElement("div");
      viewport.className =
        "hb-renderer-viewport" +
        (this.options.editable ? "" : " hb-runtime-no-select");
      const canvas = document.createElement("div");
      canvas.className = "hb-renderer-canvas";
      viewport.append(canvas);
      this.container.append(viewport);
      this.viewport = viewport;
      this.canvas = canvas;
    }
    this.viewport.className =
      "hb-renderer-viewport" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    this.canvas.style.width = this.document.canvas.width + "px";
    this.canvas.style.height = this.document.canvas.height + "px";
    this.canvas.style.background =
      this.document.canvas.background?.type === "color"
        ? this.document.canvas.background.color || "#0b1116"
        : "";
    this.renderComponents(state, preservedHosts);
    this.resize();
  }
  renderComponents(preserveSelection = false, arg2 = null) {
    if (!this.canvas || !this.page) {
      return;
    }
    const index = new Map(
      (this.document.sharedComponents || []).map((arg) => [
        arg.id,
        arg,
      ]),
    );
    const filtered = (this.page.sharedComponentIds || [])
      .map((arg) => index.get(arg))
      .filter(Boolean);
    const allowed = new Set(
      collectComponents(
        [...(this.page.components || []), ...filtered],
        () => true,
      ).map((arg) => arg.id),
    );
    this.states.set("virtual.icon_visibility.current", {
      entityId: "virtual.icon_visibility.current",
      state: this.iconVisibilityState() ? "on" : "off",
      attributes: {},
    });
    const componentById = new Map([
      ...(preserveSelection
        ? [...this.componentHosts].filter(([arg]) =>
            ["camera", "vacuum-map", "floorplan-auto-diagram", "interaction3d"].includes(
              this.componentRecords.get(arg)?.type,
            ),
          )
        : []),
      ...(arg2 && typeof arg2[Symbol.iterator] == "function" ? arg2 : []),
    ]);
    const preserveInteraction3d = new Set();
    const currentById = new Map(
      collectComponents(
        [...(this.page.components || []), ...filtered],
        () => true,
      ).map((arg) => [arg.id, arg]),
    );
    for (const [item] of componentById) {
      if (this.componentRecords.get(item)?.type === "interaction3d") {
        if (currentById.get(item)?.type === "interaction3d") {
          preserveInteraction3d.add(item);
        } else {
          componentById.delete(item);
        }
      }
    }
    const componentById1 = new Map(
      [
        ...this.canvas.querySelectorAll(
          ".hb-icon-button-effect-layer[data-effect-for]",
        ),
      ].map((arg) => [arg.dataset.effectFor, arg]),
    );
    this.cleanupComponents(preserveSelection, preserveInteraction3d);
    const allowed2 = new Set(
      [...componentById.values()].filter(
        (arg) =>
          arg.parentElement === this.canvas &&
          allowed.has(arg.dataset.componentId) &&
          (arg.querySelector(".hb-floorplan-auto-diagram-preview") ||
            arg.querySelector(".hb-interaction3d-host")),
      ),
    );
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
    for (const component of this.page.components || []) {
      this.renderComponent(component, this.canvas, 0, componentById, componentById1);
    }
    for (const item of filtered) {
      this.renderComponent(item, this.canvas, 100000, componentById, componentById1);
    }
    this.syncActiveGroup();
    this.syncSelection();
    this.runtimeEffectImageLoader.pruneDisconnected();
  }
  registerRuntimeStateHandler(entityIds, handler, arg3 = null) {
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
    if (arg3) {
      this.registerComponentCleanup(arg3, state);
    } else {
      this.cleanups.push(state);
    }
  }
  registerHistoryChartRefresher(refresher, arg2 = null) {
    if (typeof refresher != "function") {
      return;
    }
    this.historyChartRefreshers.add(refresher);
    const state = () => this.historyChartRefreshers.delete(refresher);
    if (arg2) {
      this.registerComponentCleanup(arg2, state);
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
    const entityIds = collectEntityIds([
      {
        ...component,
        children: [],
      },
    ]);
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
    return [...entityIds].map((arg) => String(arg || "")).filter(Boolean);
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
    return (
      [...(componentId?.children || [])].find(
        (element) =>
          !element.classList.contains("hb-component") &&
          !element.classList.contains("hb-runtime-action-hitbox") &&
          !element.classList.contains("hb-selection-bounds") &&
          !element.classList.contains("hb-transform-handle"),
      ) || null
    );
  }
  refreshRuntimeComponent(componentId) {
    const state = this.componentRecords.get(componentId);
    const state1 = this.componentHosts.get(componentId);
    if (!state || !state1 || !state1.isConnected) {
      return;
    }
    if (state.type === "interaction3d") {
      state1
        .querySelector(".hb-interaction3d-host")
        ?.updateInteraction3d?.(state, this.document);
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
      isIconVisible: (isIconVisible) => this.iconVisibilityState(isIconVisible),
      navigate: (navigate) => this.navigate(navigate),
      callEntityService: (...callEntityService) =>
        this.callEntityService(...callEntityService),
      onError: (onError) => this.options.onError?.(onError),
      registerRuntimeStateHandler: (
        registerRuntimeStateHandler,
        registerRuntimeStateHandler2,
      ) =>
        this.registerRuntimeStateHandler(
          registerRuntimeStateHandler,
          registerRuntimeStateHandler2,
          componentId,
        ),
      invalidate: () => this.refreshRuntimeComponent(componentId),
      cleanup: (cleanup) => this.registerComponentCleanup(componentId, cleanup),
    };
    const state3 = renderRegisteredComponent(
      this.runtimePowerComponent(state),
      state2,
    );
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
      const element = state1.querySelector(
        ":scope > .hb-runtime-action-hitbox",
      );
      if (element) {
        const state4 =
          state.type === "light-statistics"
            ? this.updateLightStatisticsSelectionBounds(state1, state, element)
            : this.updateTitleButtonSelectionBounds(state1, state, element);
        element.hidden = !state4;
      }
    }
    if (state.type === "light-statistics") {
      const matchedEl =
        this.componentSelectionOverlays
          .get(componentId)
          ?.querySelector(":scope > .hb-selection-bounds") ||
        state1.querySelector(":scope > .hb-selection-bounds");
      if (matchedEl) {
        if (
          !this.updateLightStatisticsSelectionBounds(state1, state, matchedEl)
        ) {
          Object.assign(matchedEl.style, {
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
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
    const parentElement = element.parentElement;
    if (!parentElement) {
      return false;
    }
    if (component.type === "floorplan-auto-diagram") {
      const state1 =
        component.properties?.previewReady === true &&
        (component.properties?.generated !== true ||
          component.properties?.previewing === true);
      const hbFloorplanAutoDiagramPreview = element.querySelector(
        ".hb-floorplan-auto-diagram-preview",
      );
      if (!!hbFloorplanAutoDiagramPreview === state1) {
        const position = component.position || {};
        const position1 =
          parentElement === this.canvas &&
          component.properties?.layoutMode === "fill";
        const numeric1 = position1
          ? {
              ...position,
              x: 0,
              y: 0,
              width: Number(this.document.canvas?.width || 2778),
              height: Number(this.document.canvas?.height || 1940),
              rotation: 0,
            }
          : position;
        const count = Math.max(
          0.01,
          Math.min(5, Number(component.style?.scale || 1)),
        );
        const numeric = Number(numeric1.zIndex || 1);
        const state2 = componentHostZIndex(
          component,
          numeric,
          parentElement === this.canvas,
        );
        Object.assign(element.style, {
          left: (numeric1.x || 0) + "px",
          top: (numeric1.y || 0) + "px",
          width: (numeric1.width || 100) + "px",
          height: (numeric1.height || 100) + "px",
          zIndex: String(state2),
          transform:
            "rotate(" +
            (numeric1.rotation || 0) +
            "deg) scale(" +
            (position1 ? 1 : count) +
            ")",
        });
        element.style.setProperty("--hb-component-z", String(state2));
        element.classList.toggle("layout-fill", position1);
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(
          ".hb-floorplan-auto-diagram-preview-hint",
        );
        const state3 = component.properties?.interactionMode === "view";
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-view-mode", state3);
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-position-mode",
          !state3,
        );
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = state3
            ? "拖动旋转 · 右键平移 · 滚轮缩放"
            : "拖动控件调整位置，右下角调整大小";
        }
        this.syncSelection();
        this.updateTransformHandleScale(element, component);
        return true;
      }
    }
    if (component.type === "interaction3d") {
      const position = component.position || {};
      const position1 =
        parentElement === this.canvas &&
        component.properties?.layoutMode === "fill";
      const numeric1 = position1
        ? {
            ...position,
            x: 0,
            y: 0,
            width: Number(this.document.canvas?.width || 2778),
            height: Number(this.document.canvas?.height || 1940),
            rotation: 0,
          }
        : position;
      const count = Math.max(
        0.01,
        Math.min(5, Number(component.style?.scale || 1)),
      );
      const numeric = Number(numeric1.zIndex || 1);
      const state1 = componentHostZIndex(
        component,
        numeric,
        parentElement === this.canvas,
      );
      Object.assign(element.style, {
        left: (numeric1.x || 0) + "px",
        top: (numeric1.y || 0) + "px",
        width: (numeric1.width || 100) + "px",
        height: (numeric1.height || 100) + "px",
        zIndex: String(state1),
        transform:
          "rotate(" +
          (numeric1.rotation || 0) +
          "deg) scale(" +
          (position1 ? 1 : count) +
          ")",
      });
      element.style.setProperty("--hb-component-z", String(state1));
      element.classList.toggle("layout-fill", position1);
      element
        .querySelector(".hb-interaction3d-host")
        ?.updateInteraction3d?.(component, this.document);
      this.syncSelection();
      this.updateTransformHandleScale(element, component);
      return true;
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
    this.renderComponent(component, parentElement);
    const state = this.componentHosts.get(component1);
    if (state && nextSibling?.parentElement === parentElement) {
      parentElement.insertBefore(state, nextSibling);
    }
    this.syncSelection();
    return true;
  }
  refreshRuntimeComponents(entityIds) {
    const allowed = new Set();
    for (const item of entityIds || []) {
      for (const entity of this.runtimeEntityComponentIndex.get(
        String(item || ""),
      ) || []) {
        allowed.add(entity);
      }
    }
    if (!allowed.size) {
      return;
    }
    const allowed2 = new Set([
      "icon-button-effect",
      "icon-button",
      "device-button",
      "navigation-button",
      "air-conditioner",
    ]);
    const allowed3 = new Set(
      [...allowed].filter((arg) =>
        allowed2.has(this.componentRecords.get(arg)?.type),
      ),
    );
    if (allowed3.size) {
      this.updateOptimisticToggleVisuals("", allowed3);
    }
    for (const item of allowed) {
      const state = this.componentRecords.get(item);
      if (
        !!state &&
        !allowed2.has(state.type) &&
        !["line-chart", "camera", "vacuum-map"].includes(state.type)
      ) {
        this.refreshRuntimeComponent(item);
      }
    }
  }
  applyEditorComponentUpdates(updates, documentModel, arg3 = []) {
    if (
      !this.options.editable ||
      !this.document ||
      !Array.isArray(arg3) ||
      !arg3.length
    ) {
      return false;
    }
    const filtered = arg3
      .map((arg) => ({
        componentId: String(arg?.componentId || ""),
        component: arg?.component,
      }))
      .filter((arg) => arg.componentId && arg.component);
    if (
      !filtered.length ||
      filtered.length !== arg3.length ||
      filtered.some(({ componentId, component }) => {
        const state = this.componentRecords.get(componentId);
        return (
          !state || state.type === "group" || state.type !== component.type
        );
      })
    ) {
      return false;
    }
    const allowed = new Set();
    for (const { componentId } of filtered) {
      const state = this.componentRecords.get(componentId);
      for (const entity of this.runtimeEntityIdsForComponent(state)) {
        allowed.add(entity);
      }
    }
    this.document = updates;
    this.page =
      this.document.pages?.find((documentModel1) => documentModel1.path === documentModel) ||
      this.document.pages?.find(
        (arg) => arg.path === this.document.defaultPagePath,
      ) ||
      this.document.pages?.[0] ||
      null;
    for (const { componentId, component } of filtered) {
      const state = this.componentRecords.get(componentId);
      this.unindexRuntimeComponent(componentId);
      for (const key of Object.keys(state)) {
        delete state[key];
      }
      Object.assign(state, structuredClone(component));
      this.indexRuntimeComponent(state);
    }
    for (const { componentId } of filtered) {
      this.refreshEditorComponent(componentId);
    }
    this.syncSelection();
    const allowed2 = new Set();
    for (const { componentId } of filtered) {
      for (const entity of this.runtimeEntityIdsForComponent(
        this.componentRecords.get(componentId),
      )) {
        allowed2.add(entity);
      }
    }
    if (
      allowed.size !== allowed2.size ||
      [...allowed].some((arg) => !allowed2.has(arg))
    ) {
      this.connectRuntime();
    }
    return true;
  }
  scheduleRuntimeRender(entityIds, arg2 = 120) {
    if (!this.destroyed && !!this.document && !!entityIds) {
      this.runtimeRenderEntityIds.add(String(entityIds));
      window.clearTimeout(this.runtimeRenderTimer);
      this.runtimeRenderTimer = window.setTimeout(
        () => {
          this.runtimeRenderTimer = 0;
          const state = [...this.runtimeRenderEntityIds];
          this.runtimeRenderEntityIds.clear();
          if (!this.destroyed) {
            this.refreshRuntimeComponents(state);
          }
        },
        Math.max(0, Number(arg2) || 0),
      );
    }
  }
  setEffectLayerActive(element, active, arg3 = 0) {
    if (!element) {
      return;
    }
    if (active) {
      this.runtimeEffectImageLoader.promote(
        element.querySelector(":scope > img[data-effect-source]"),
      );
    }
    const state = element.classList.contains("active") !== active;
    window.clearTimeout(element.hbTransitionTimer);
    element.classList.remove("is-transitioning");
    if (state && arg3 > 0) {
      element.classList.add("is-transitioning");
      element.offsetWidth;
    }
    element.classList.toggle("active", active);
    if (state && arg3 > 0) {
      element.hbTransitionTimer = window.setTimeout(
        () => {
          element.classList.remove("is-transitioning");
          element.hbTransitionTimer = null;
        },
        arg3 * 1000 + 80,
      );
    }
  }
  syncEffectLayerLightVisual(component, element) {
    if (!element || component?.type !== "icon-button-effect") {
      return;
    }
    const numeric1 = component.properties || {};
    const text = String(component?.bindings?.entity?.entityId || "");
    element.classList.toggle(
      "awaiting-light-visual",
      iconButtonEffectLightVisualAwaiting(component, {
        editable: this.options.editable,
        states: this.states,
        pendingOptimisticState: this.pendingOptimisticStates.get(text),
      }),
    );
    const state = iconButtonEffectLightVisualState(component, {
      states: this.states,
    });
    const numeric = Number(numeric1.effectOpacity ?? 1);
    const finiteNumber = Number.isFinite(numeric)
      ? Math.max(0, Math.min(1, numeric))
      : 1;
    element.style.setProperty(
      "--hb-effect-image-opacity",
      String(finiteNumber * state.opacity),
    );
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
      const parsedJson = JSON.parse(
        window.localStorage?.getItem("ha-bridge:light-visual:" + entityId) ||
          "null",
      );
      if (
        !parsedJson?.attributes ||
        Date.now() - Number(parsedJson.at || 0) > 2592000000
      ) {
        return null;
      }
      const state1 = {
        entityId,
        state: "on",
        attributes: parsedJson.attributes,
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
    const runHelper = (arg) =>
      attributes[arg] !== null &&
      attributes[arg] !== undefined &&
      attributes[arg] !== "" &&
      Number.isFinite(Number(attributes[arg]));
    if (!runHelper("brightness") && !runHelper("color_temp_kelvin") && !runHelper("color_temp")) {
      return;
    }
    const attributes2 = {
      ...(this.cachedLightVisualState(entityId)?.attributes || {}),
    };
    for (const item of [
      "brightness",
      "color_temp_kelvin",
      "color_temp",
      "color_mode",
      "supported_color_modes",
    ]) {
      if (
        attributes[item] !== null &&
        attributes[item] !== undefined &&
        attributes[item] !== ""
      ) {
        attributes2[item] = Array.isArray(attributes[item])
          ? [...attributes[item]]
          : attributes[item];
      }
    }
    const state = {
      entityId,
      state: "on",
      attributes: attributes2,
    };
    this.confirmedLightVisualStates.set(entityId, state);
    try {
      window.localStorage?.setItem(
        "ha-bridge:light-visual:" + entityId,
        JSON.stringify({
          at: Date.now(),
          attributes: attributes2,
        }),
      );
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
    const found = [...this.componentRecords.values()].find((component) => {
      const entityId = component.bindings?.entity?.entityId;
      return (
        entityId && this.powerEntityId(component, entityId) === String(entityId)
      );
    });
    if (
      entityPowerIsOn(
        String(entityId || ""),
        expected?.newState || expected,
        found || {},
      ) === state.desiredActive
    ) {
      if (
        state.desiredActive === true &&
        found?.type === "icon-button-effect" &&
        iconButtonEffectLightVisualAwaiting(found, {
          states: new Map([[String(entityId || ""), expected?.newState || expected]]),
        })
      ) {
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
      if (
        !entityId ||
        (componentIdFilter ? !componentIdFilter.has(record) : powerEntityId !== targetPowerEntityId) ||
        ![
          "icon-button-effect",
          "icon-button",
          "device-button",
          "navigation-button",
          "air-conditioner",
        ].includes(component.type)
      ) {
        continue;
      }
      const entityState = this.states.get(powerEntityId);
      const isCoverEntity = String(powerEntityId || "").startsWith("cover.");
      const isDreamCover =
        isCoverEntity &&
        coverComponentIsDream(component, powerEntityId, entityState, this.entityMetadata);
      const powerComponent = this.runtimePowerComponent(component, entityId);
      const powerIsOn = isCoverEntity
        ? isDreamCover
          ? runtimeEntityStateIsActive(entityState)
          : runtimeCoverStateIsActive(entityState)
        : entityPowerIsOn(powerEntityId, entityState, powerComponent);
      const previewState = this.componentPreviewStates.get(record) || "auto";
      const displayedOn =
        previewState === "on"
          ? true
          : previewState === "off"
            ? false
            : isCoverEntity &&
                coverMotorIsReversedForComponent(
                  component,
                  this.entityMetadata,
                  this.states,
                  powerEntityId,
                )
              ? !powerIsOn
              : powerIsOn;
      const host = this.componentHosts.get(record);
      this.cleanupRenderedComponent(record);
      if (host && component.type === "icon-button-effect") {
        const element = host.querySelector(
          ":scope > .hb-icon-button-effect",
        );
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
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: (cleanup) => this.registerComponentCleanup(record, cleanup),
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
      if (
        host &&
        ["icon-button", "device-button", "navigation-button"].includes(
          component.type,
        )
      ) {
        const matchedEl =
          component.type === "navigation-button"
            ? host.querySelector(":scope > .hb-navigation-button")
            : host.querySelector(":scope > .hb-icon-button");
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
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: (cleanup) => this.registerComponentCleanup(record, cleanup),
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
          const element = host.querySelector(
            ":scope > .hb-runtime-action-hitbox",
          );
          if (element) {
            element.hidden = !this.updateDeviceButtonSelectionBounds(
              host,
              component,
              element,
            );
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
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([record])),
          cleanup: (cleanup) => this.registerComponentCleanup(record, cleanup),
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
            grouped,
          });
          const numeric2 = Number(
            host.style.getPropertyValue("--hb-component-z") ||
              component.position?.zIndex ||
              1,
          );
          state10.dataset.airflowFor = record;
          state10.hidden = component.style?.visible === false;
          Object.assign(state10.style, {
            left: airflowGeometry.left + "px",
            top: airflowGeometry.top + "px",
            width: airflowGeometry.width + "px",
            height: airflowGeometry.height + "px",
            zIndex: String(numeric2),
            transform:
              "rotate(" +
              airflowGeometry.rotation +
              "deg) scale(" +
              airflowGeometry.scale +
              ")",
          });
          if (grouped) {
            host.append(state10);
          } else {
            this.canvas.insertBefore(state10, host);
          }
          this.componentAirflowLayers.set(record, state10);
          if (
            this.options.editable &&
            this.selectedComponentIds.size === 1 &&
            this.selectedComponentId === record &&
            this.componentSelectionLayers.get(record) === "airflow"
          ) {
            this.syncSelection();
          }
        }
      }
      if (component.type !== "icon-button-effect") {
        continue;
      }
      const state7 = this.componentEffectLayers.get(record);
      this.syncEffectLayerLightVisual(component, state7);
      this.setEffectLayerActive(
        state7,
        displayedOn,
        effectFadeDuration(component),
      );
    }
  }
  refreshVacuumMapEntity(entityId) {
    if (
      this.options.liveMedia === false ||
      !String(entityId || "").startsWith("image.")
    ) {
      return;
    }
    const state = this.states.get(entityId);
    const state1 = vacuumMapImageSource(entityId, state);
    let state2 = false;
    for (const [record, component] of this.componentRecords) {
      if (
        component.type !== "vacuum-map" ||
        component.bindings?.entity?.entityId !== entityId
      ) {
        continue;
      }
      const matchedEl = this.componentHosts
        .get(record)
        ?.querySelector(".hb-vacuum-map-image");
      if (matchedEl) {
        state2 = true;
        if (matchedEl.dataset.vacuumMapSource !== state1) {
          matchedEl.dataset.vacuumMapSource = state1;
        }
        if (
          matchedEl.dataset.vacuumMapSuspended !== "true" &&
          matchedEl.getAttribute("src") !== state1
        ) {
          matchedEl.src = state1;
        }
      }
    }
    if (
      !state2 &&
      this.options.liveMedia !== false &&
      this.vacuumMapEntityIds.has(entityId)
    ) {
      this.runtimeVacuumMapImagePreloader.enqueue(state1);
    }
  }
  applyOptimisticToggle(entityId1, nextState = null) {
    const state = entityId1;
    const entityId = this.powerEntityId(nextState, state);
    const state1 = this.states.get(entityId);
    const state2 = state1?.newState ||
      state1 || {
        entityId,
        attributes: {},
      };
    const asString = String(entityId || "").startsWith("cover.");
    const state3 =
      asString &&
      coverComponentIsDream(nextState, entityId, state1, this.entityMetadata);
    const state4 = this.runtimePowerComponent(nextState, state);
    const desiredActive = !(asString
      ? state3
        ? runtimeEntityStateIsActive(state1)
        : runtimeCoverStateIsActive(state1)
      : entityPowerIsOn(entityId, state1, state4));
    const newState = asString
      ? {
          ...state2,
          state: desiredActive ? "open" : "closed",
          ...(state3
            ? {}
            : {
                attributes: {
                  ...(state2.attributes || {}),
                  current_position: desiredActive ? 100 : 0,
                },
              }),
        }
      : optimisticToggleState(entityId, state2, state4);
    if (desiredActive && String(entityId || "").startsWith("light.")) {
      const state7 = this.cachedLightVisualState(entityId);
      if (state7?.attributes) {
        newState.attributes = {
          ...(newState.attributes || {}),
          ...state7.attributes,
        };
      }
    }
    const state5 = state1?.newState
      ? {
          ...state1,
          newState,
        }
      : newState;
    const text = String(entityId || "");
    const nowMs = {
      desiredActive,
      expiresAt: Date.now() + 8000,
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
  renderComponent(
    component,
    parentHost = this.canvas,
    renderOptions = 0,
    arg4 = null,
    arg5 = null,
  ) {
    const iconButtonEffectComponent =
      normalizeIconButtonEffectComponent(component);
    const component2 = this.runtimePowerComponent(iconButtonEffectComponent);
    const element = ["camera", "vacuum-map", "floorplan-auto-diagram", "interaction3d"].includes(
      component.type,
    )
      ? arg4?.get(component.id)
      : null;
    if (element) {
      const position2 = component.position || {};
      const position3 =
        parentHost === this.canvas &&
        ["floorplan-auto-diagram", "interaction3d"].includes(component.type) &&
        component.properties?.layoutMode === "fill";
      const numeric2 = position3
        ? {
            ...position2,
            x: 0,
            y: 0,
            width: Number(this.document.canvas?.width || 2778),
            height: Number(this.document.canvas?.height || 1940),
            rotation: 0,
          }
        : position2;
      const count2 = Math.max(
        0.01,
        Math.min(5, Number(component.style?.scale || 1)),
      );
      const scale1 = renderOptions + Number(numeric2.zIndex || 1);
      Object.assign(element.style, {
        left: (numeric2.x || 0) + "px",
        top: (numeric2.y || 0) + "px",
        width: (numeric2.width || 100) + "px",
        height: (numeric2.height || 100) + "px",
        zIndex: String(scale1),
        transform:
          "rotate(" +
          (numeric2.rotation || 0) +
          "deg) scale(" +
          (position3 ? 1 : count2) +
          ")",
      });
      element.style.setProperty("--hb-component-z", String(scale1));
      element.hidden = component.style?.visible === false;
      element.classList.toggle("layout-fill", position3);
      if (component.type === "interaction3d") {
        element
          .querySelector(".hb-interaction3d-host")
          ?.updateInteraction3d?.(component, this.document);
      }
      if (component.type === "floorplan-auto-diagram") {
        const state2 = component.properties?.interactionMode === "view";
        const hbFloorplanAutoDiagramPreview = element.querySelector(
          ".hb-floorplan-auto-diagram-preview",
        );
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(
          ".hb-floorplan-auto-diagram-preview-hint",
        );
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-view-mode",
          state2,
        );
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-position-mode",
          !state2,
        );
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = state2
            ? "拖动旋转 · 右键平移 · 滚轮缩放"
            : "拖动控件调整位置，右下角调整大小";
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
    element2.className =
      "hb-component hb-component-" +
      component.type.replace(/[^a-z0-9_-]/gi, "-");
    element2.dataset.componentId = component.id;
    const position = component.position || {};
    const position1 =
      parentHost === this.canvas &&
      ["image", "floorplan-auto-diagram", "interaction3d"].includes(component.type) &&
      component.properties?.layoutMode === "fill";
    const numeric1 = position1
      ? {
          ...position,
          x: 0,
          y: 0,
          width: Number(this.document.canvas?.width || 2778),
          height: Number(this.document.canvas?.height || 1940),
          rotation: 0,
        }
      : position;
    const count = Math.max(
      0.01,
      Math.min(5, Number(component.style?.scale || 1)),
    );
    const scale = renderOptions + Number(numeric1.zIndex || 1);
    const state = componentHostZIndex(
      component,
      scale,
      parentHost === this.canvas,
    );
    Object.assign(element2.style, {
      left: (numeric1.x || 0) + "px",
      top: (numeric1.y || 0) + "px",
      width: (numeric1.width || 100) + "px",
      height: (numeric1.height || 100) + "px",
      zIndex: String(state),
      transform:
        "rotate(" +
        (numeric1.rotation || 0) +
        "deg) scale(" +
        (position1 ? 1 : count) +
        ")",
    });
    element2.style.setProperty("--hb-component-z", String(state));
    element2.hidden = component.style?.visible === false;
    if (
      component.type === "icon-button-effect" &&
      component.properties?.buttonVisible === false &&
      component.properties?.hiddenContentClickable !== true &&
      !this.options.editable
    ) {
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
      isIconVisible: (isIconVisible) => this.iconVisibilityState(isIconVisible),
      navigate: (navigate) => this.navigate(navigate),
      callEntityService: (...callEntityService) =>
        this.callEntityService(...callEntityService),
      onError: (onError) => this.options.onError?.(onError),
      registerRuntimeStateHandler: (
        registerRuntimeStateHandler,
        registerRuntimeStateHandler2,
      ) =>
        this.registerRuntimeStateHandler(
          registerRuntimeStateHandler,
          registerRuntimeStateHandler2,
          component.id,
        ),
      invalidate: () => this.renderComponents(true),
      cleanup: (cleanup) => {
        if (["camera", "vacuum-map"].includes(component.type)) {
          if (!this.cameraCleanups.has(component.id)) {
            this.cameraCleanups.set(component.id, []);
          }
          this.cameraCleanups.get(component.id).push(cleanup);
        } else {
          this.registerComponentCleanup(component.id, cleanup);
        }
      },
    };
    if (component.type === "icon-button-effect") {
      const element4 = renderIconButtonEffectLayer(component2, state1);
      if (element4) {
        const state2 = arg5?.get(component.id) || null;
        const element5 = state2 || element4;
        const element6 = element4.querySelector("img");
        const element7 = element5.querySelector("img");
        const active = element4.classList.contains("active");
        if (state2 && element7 && element6) {
          element5.classList.toggle(
            "awaiting-light-visual",
            element4.classList.contains("awaiting-light-visual"),
          );
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
          for (const item of [
            "effectOriginalWidth",
            "effectOriginalHeight",
            "effectCropX",
            "effectCropY",
            "effectCropWidth",
            "effectCropHeight",
          ]) {
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
          const state5 = effectSourceDimensions(
            numeric4,
            element7,
            numeric2,
            numeric3,
          );
          const angle = effectCropRectangle(element7, state5);
          const state6 =
            !size && !state5.pendingNaturalSize
              ? effectReferenceImageTransform(
                  this.page,
                  component,
                  state5.width,
                  state5.height,
                  numeric2,
                  numeric3,
                )
              : null;
          const count2 = Math.max(
            0.01,
            Math.min(5, Number(numeric4.effectScale || 1)),
          );
          const scale = size
            ? Math.min(numeric2 / state5.width, numeric3 / state5.height)
            : (state6?.scale || 1) * count2;
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
            rotation,
          });
          let size1 = state7;
          if (state3) {
            const size2 = state7.left + state7.width / 2;
            const size3 = state7.top + state7.height / 2;
            const componentId2 = parentHost?.dataset?.componentId;
            const state8 = componentId2
              ? this.worldPointToComponentLocal(componentId2, size2, size3)
              : {
                  x: size2,
                  y: size3,
                };
            const scale1 = componentId2
              ? this.componentWorldTransform(componentId2)
              : {
                  scale: 1,
                  rotation: 0,
                };
            size1 = {
              ...state7,
              left: state8.x - state7.width / 2,
              top: state8.y - state7.height / 2,
              scale: state7.scale / Math.max(0.0001, scale1.scale),
              rotation: state7.rotation - scale1.rotation,
            };
          }
          Object.assign(element5.style, {
            left: size1.left + "px",
            top: size1.top + "px",
            width: state7.width + "px",
            height: state7.height + "px",
            visibility: state5.pendingNaturalSize ? "hidden" : "",
            zIndex: String(state3 ? scale - 0.1 : scale),
            transform:
              "rotate(" +
              size1.rotation +
              "deg) scale(" +
              size1.scale +
              ")",
          });
          return state5;
        };
        if (clampNumber().pendingNaturalSize && element7) {
          element7.addEventListener(
            "load",
            () => {
              if (element5.isConnected) {
                clampNumber();
              }
            },
            {
              once: true,
            },
          );
        }
        (state3 ? parentHost : size ? this.canvas : parentHost).append(element5);
        this.componentEffectLayers.set(component.id, element5);
        const state4 = element7?.dataset.effectSource || "";
        if (state4) {
          this.runtimeEffectImageLoader.enqueue(element7, state4, {
            active,
          });
        }
        if (state2) {
          const state5 = element6?.style.filter || "none";
          const state6 = element4.style.getPropertyValue(
            "--hb-effect-image-opacity",
          );
          const state7 = element4.style.getPropertyValue(
            "--hb-effect-fade-duration",
          );
          const state8 = element4.style.getPropertyValue(
            "--hb-effect-visual-transition-duration",
          );
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
          element5.style.setProperty(
            "--hb-effect-visual-transition-duration",
            state8,
          );
          this.setEffectLayerActive(
            element5,
            active,
            effectFadeDuration(component),
          );
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
          grouped,
        });
        Object.assign(state2.style, {
          left: airflowGeometry.left + "px",
          top: airflowGeometry.top + "px",
          width: airflowGeometry.width + "px",
          height: airflowGeometry.height + "px",
          zIndex: String(scale),
          transform:
            "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")",
        });
        (grouped ? element2 : parentHost).append(state2);
        this.componentAirflowLayers.set(component.id, state2);
      }
    }
    const groupContainerEl =
      component.type === "group"
        ? (() => {
            const groupContainerEl1 = document.createElement("div");
            groupContainerEl1.className = "hb-group-container";
            return groupContainerEl1;
          })()
        : renderRegisteredComponent(component2, state1);
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
      this.registerRuntimeStateHandler(
        component.bindings?.entity?.entityId,
        (arg) => {
          element4.syncLineChartState?.(arg);
          if (element4.classList.contains("history-loading")) {
            applyElementStyle();
          }
        },
        component.id,
      );
      this.registerHistoryChartRefresher(applyElementStyle, component.id);
    }
    if (this.options.editable) {
      element2.classList.add("editable");
      element2.addEventListener("pointerdown", (arg) =>
        this.startComponentMove(arg, component, element2),
      );
    } else {
      const state2 = Object.prototype.hasOwnProperty.call(
        component.actions || {},
        "tap",
      );
      const state3 =
        component.type === "camera" &&
        component.bindings?.entity?.entityId &&
        !state2
          ? {
              ...component,
              actions: {
                tap: {
                  type: "more-info",
                  data: {
                    popupSource: "current",
                  },
                },
                ...(component.actions || {}),
              },
            }
          : component;
      if (component.type === "light-statistics") {
        element2.classList.add("hb-runtime-fitted-hit-area");
      }
      if (
        Object.values(state3.actions || {}).some((arg) =>
          isComponentActionSupported(state3, arg),
        )
      ) {
        element2.classList.add("interactive");
        let runtimeActionHitboxEl = element2;
        if (
          ["title-button", "device-button", "light-statistics"].includes(
            component.type,
          )
        ) {
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
    const element3 = element2.querySelector(
      ":scope > .hb-runtime-action-hitbox",
    );
    if (element3) {
      const state2 =
        component.type === "title-button"
          ? this.updateTitleButtonSelectionBounds(element2, component, element3)
          : component.type === "light-statistics"
            ? this.updateLightStatisticsSelectionBounds(
                element2,
                component,
                element3,
              )
            : this.updateDeviceButtonSelectionBounds(
                element2,
                component,
                element3,
              );
      element3.hidden = !state2;
    }
    for (const child of component.children || []) {
      this.renderComponent(child, element2, 0, arg4, arg5);
    }
  }
  startComponentMove(event, component, arg3, arg4 = arg3) {
    if (
      !this.options.editable ||
      !this.selectedComponentIds.has(component.id) ||
      component.properties?.layoutMode === "fill" ||
      event.button !== 0 ||
      event.target.closest(".hb-transform-handle")
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const clientX = event.clientX;
    const clientY = event.clientY;
    const filtered = [...this.selectedComponentIds]
      .map((arg) => ({
        component: this.componentRecords.get(arg),
        host: this.componentHosts.get(arg),
      }))
      .filter((arg) => arg.component && arg.host)
      .map((arg) => ({
        ...arg,
        initialX: Number(arg.component.position?.x || 0),
        initialY: Number(arg.component.position?.y || 0),
        width: Number(arg.component.position?.width || 100),
        height: Number(arg.component.position?.height || 100),
        parentId: this.componentParentIds.get(arg.component.id) || null,
        parentTransform: this.componentParentTransform(arg.component.id),
      }));
    if (
      !filtered.some((arg) => arg.component.id === component.id) ||
      filtered.some(
        (arg) => arg.component.properties?.layoutMode === "fill",
      )
    ) {
      return;
    }
    let state = eventHasCommandModifier(event);
    let state1 =
      !state &&
      filtered.length === 1 &&
      component.type === "air-conditioner" &&
      this.componentSelectionLayers.get(component.id) !== "airflow";
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const numeric2 = Number(component.properties?.airflowOffsetY ?? 34);
    let airflowOffsetX = numeric;
    let airflowOffsetY = numeric2;
    const numeric3 = Number(this.document?.canvas?.width || 2778);
    const numeric4 = Number(this.document?.canvas?.height || 1940);
    const runHelper = (arg) => {
      const numeric1 = arg.parentId
        ? this.componentRecords.get(arg.parentId)
        : null;
      const numeric7 = Number(numeric1?.position?.width || numeric3);
      const numeric8 = Number(numeric1?.position?.height || numeric4);
      return {
        minX: -arg.width / 2 - arg.initialX,
        maxX: numeric7 - arg.width / 2 - arg.initialX,
        minY: -arg.height / 2 - arg.initialY,
        maxY: numeric8 - arg.height / 2 - arg.initialY,
      };
    };
    const clampNumber = (arg, arg2, arg31) => {
      const state8 = groupedComponentLocalDelta(
        arg2,
        arg31,
        arg.parentTransform,
      );
      const state9 = runHelper(arg);
      return {
        x: Math.max(state9.minX, Math.min(state9.maxX, state8.x)),
        y: Math.max(state9.minY, Math.min(state9.maxY, state8.y)),
      };
    };
    const numeric5 = Number(component.position?.x || 0);
    const numeric6 = Number(component.position?.y || 0);
    let position = numeric5;
    let state2 = numeric6;
    let state3 = filtered;
    let state4 = [];
    let mapped = filtered.map((arg) => ({
      componentId: arg.component.id,
      x: arg.initialX,
      y: arg.initialY,
    }));
    let id = component.id;
    let state5 = false;
    let state6 = "";
    let event1 = false;
    const pointerId = event.pointerId;
    arg4.setPointerCapture(pointerId);
    filtered.forEach((arg) => arg.host.classList.add("moving"));
    const event2 = (event3) => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      if (!arg4.hasPointerCapture?.(pointerId) && arg4.isConnected) {
        try {
          arg4.setPointerCapture(pointerId);
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
        state4 = filtered.map((arg) => {
          const copiedComponent = assignComponentIds(structuredClone(arg.component));
          copiedComponent.position = {
            ...(copiedComponent.position || {}),
            zIndex: Number(copiedComponent.position?.zIndex || 1) + 1,
          };
          this.renderComponent(copiedComponent, arg.host.parentElement);
          return {
            sourceComponentId: arg.component.id,
            copiedComponent,
          };
        });
        state3 = state4.map((arg, arg2) => ({
          component: arg.copiedComponent,
          host: this.componentHosts.get(arg.copiedComponent.id),
          initialX: filtered[arg2].initialX,
          initialY: filtered[arg2].initialY,
          width: filtered[arg2].width,
          height: filtered[arg2].height,
          parentId: filtered[arg2].parentId,
          parentTransform: filtered[arg2].parentTransform,
        }));
        id =
          state4.find((arg) => arg.sourceComponentId === component.id)
            ?.copiedComponent.id || state4[0]?.copiedComponent.id;
        state5 = true;
        filtered.forEach((arg) => arg.host.classList.remove("moving"));
        state3.forEach((arg) => arg.host?.classList.add("moving"));
        this.selectedComponentId = id;
        this.selectedComponentIds = new Set(
          state3.map((arg) => arg.component.id),
        );
      }
      if (event3.shiftKey) {
        if (!state6 && Math.hypot(event4, amount) >= 1) {
          state6 =
            Math.abs(event4) >= Math.abs(amount) ? "horizontal" : "vertical";
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
      const found = clampNumber(
        filtered.find((arg) => arg.component.id === component.id) ||
          filtered[0],
        state8,
        state9,
      );
      position = numeric5 + found.x;
      state2 = numeric6 + found.y;
      if (state1) {
        airflowOffsetX =
          numeric -
          (found.x / Math.max(1, Number(component.position?.width || 100))) *
            100;
        airflowOffsetY =
          numeric2 -
          (found.y / Math.max(1, Number(component.position?.height || 100))) *
            100;
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX,
          airflowOffsetY,
        };
        this.options.onComponentPropertiesPreview?.(component.id, {
          airflowOffsetX,
          airflowOffsetY,
        });
      }
      const mapped1 = state3.map((arg) => {
        const state10 = clampNumber(arg, state8, state9);
        return {
          componentId: arg.component.id,
          x: arg.initialX + state10.x,
          y: arg.initialY + state10.y,
        };
      });
      mapped = mapped1;
      for (const item of mapped1) {
        const size = this.componentHosts.get(item.componentId);
        if (size) {
          size.style.left = item.x + "px";
          size.style.top = item.y + "px";
        }
        const state10 = this.componentSelectionOverlays.get(
          item.componentId,
        );
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
            y: state2,
          });
        }
      }
    };
    const state7 = (event3 = null) => {
      if (
        !event1 &&
        (event3?.pointerId == null || event3.pointerId === pointerId) &&
        ((event1 = true),
        state3.forEach((arg) => arg.host?.classList.remove("moving")),
        filtered.forEach((arg) => arg.host.classList.remove("moving")),
        window.removeEventListener("pointermove", event2, true),
        window.removeEventListener("pointerup", state7, true),
        window.removeEventListener("pointercancel", state7, true),
        window.removeEventListener("blur", state7),
        position !== numeric5 || state2 !== numeric6)
      ) {
        if (state5) {
          state3.forEach((arg) => {
            const found = mapped.find(
              (arg1) => arg1.componentId === arg.component.id,
            );
            arg.component.position = {
              ...(arg.component.position || {}),
              x: found?.x ?? arg.initialX,
              y: found?.y ?? arg.initialY,
            };
          });
          this.options.onComponentsDuplicate?.(state4, component.id, id);
        } else if (filtered.length > 1) {
          const found = mapped.map((arg) => {
            const found1 = filtered.find(
              (arg1) => arg1.component.id === arg.componentId,
            );
            if (found1) {
              found1.component.position = {
                ...(found1.component.position || {}),
                x: arg.x,
                y: arg.y,
              };
            }
            return arg;
          });
          this.options.onComponentsTransform?.(found, component.id);
        } else {
          component.position = {
            ...(component.position || {}),
            x: position,
            y: state2,
          };
          this.options.onComponentTransform?.(component.id, {
            x: position,
            y: state2,
            ...(state1
              ? {
                  airflowOffsetX,
                  airflowOffsetY,
                }
              : {}),
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
    if (
      !host ||
      !component ||
      !host.parentElement ||
      (host.parentElement !== this.canvas && !host.hidden)
    ) {
      return null;
    }
    const parentElement = host.parentElement;
    const element = document.createElement("div");
    element.className = "hb-component-selection-overlay";
    if (component.type === "light-statistics") {
      element.classList.add("hb-light-statistics-selection-overlay");
    }
    if (
      component.type === "floorplan-auto-diagram" &&
      component.properties?.interactionMode === "view"
    ) {
      element.classList.add("hb-floorplan-auto-diagram-view-overlay");
    }
    element.dataset.selectionFor = component.id;
    Object.assign(element.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform,
    });
    if (component.type !== "light-statistics") {
      element.addEventListener("pointerdown", (arg) =>
        this.startComponentMove(arg, component, host, element),
      );
    }
    parentElement.append(element);
    this.componentSelectionOverlays.set(component.id, element);
    return element;
  }
  createAirflowSelectionOverlay(host, component) {
    if (!host || !component || !host.parentElement) {
      return null;
    }
    const componentSelectionOverlayEl = document.createElement("div");
    componentSelectionOverlayEl.className =
      "hb-component-selection-overlay hb-airflow-selection-overlay";
    componentSelectionOverlayEl.dataset.selectionFor = component.id;
    Object.assign(componentSelectionOverlayEl.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform,
    });
    host.parentElement.append(componentSelectionOverlayEl);
    this.componentSelectionOverlays.set(component.id, componentSelectionOverlayEl);
    return componentSelectionOverlayEl;
  }
  syncAirflowLayerGeometry(componentId, arg2, arg3 = null) {
    if (!componentId || !arg2) {
      return;
    }
    const airflowGeometry = airflowLayerGeometry(arg2, {
      grouped: componentId.parentElement !== this.canvas,
    });
    const size = {
      left: airflowGeometry.left + "px",
      top: airflowGeometry.top + "px",
      width: airflowGeometry.width + "px",
      height: airflowGeometry.height + "px",
      transform:
        "rotate(" + airflowGeometry.rotation + "deg) scale(" + airflowGeometry.scale + ")",
    };
    Object.assign(componentId.style, size);
    if (arg3) {
      Object.assign(arg3.style, size);
    }
  }
  appendEffectSelectionBounds(host, component) {
    if (!host || !component || !host.parentElement) {
      return;
    }
    const componentSelectionOverlayEl = document.createElement("div");
    componentSelectionOverlayEl.className =
      "hb-component-selection-overlay hb-effect-selection-overlay";
    componentSelectionOverlayEl.dataset.selectionFor = component.id;
    Object.assign(componentSelectionOverlayEl.style, {
      left: host.style.left,
      top: host.style.top,
      width: host.style.width,
      height: host.style.height,
      transform: host.style.transform,
      pointerEvents: "none",
    });
    const selectionBoundsEl = document.createElement("div");
    selectionBoundsEl.className = "hb-selection-bounds hb-effect-selection-bounds";
    for (const cornerMarkerEl of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
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
    if (
      !!element &&
      !!state &&
      !element.classList.contains("hb-airflow-selection-overlay") &&
      !element.classList.contains("hb-effect-selection-overlay")
    ) {
      Object.assign(element.style, {
        left: state.style.left,
        top: state.style.top,
        width: state.style.width,
        height: state.style.height,
        transform: state.style.transform,
      });
    }
  }
  appendTransformHandles(host, component, selectionBoundsEl = true, element = host) {
    if (!host || !component) {
      return;
    }
    const selectionBoundsEl1 = document.createElement("div");
    selectionBoundsEl1.className = "hb-selection-bounds";
    for (const cornerMarkerEl of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
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
      transformHandleEl.addEventListener("pointerdown", (transformHandleEl2) =>
        this.startComponentScale(transformHandleEl2, component, host, selectionBoundsEl1),
      );
      const transformHandleEl1 = document.createElement("button");
      transformHandleEl1.type = "button";
      transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
      transformHandleEl1.title = "拖动旋转";
      transformHandleEl1.addEventListener("pointerdown", (arg) =>
        this.startComponentRotate(arg, component, host, selectionBoundsEl1),
      );
      selectionBoundsEl1.append(transformHandleEl, transformHandleEl1);
    }
    element.append(selectionBoundsEl1);
    if (
      component.type === "light-statistics" &&
      element.classList?.contains("hb-light-statistics-selection-overlay")
    ) {
      selectionBoundsEl1.addEventListener("pointerdown", (arg) =>
        this.startComponentMove(arg, component, host, selectionBoundsEl1),
      );
    }
    this.updateImageSelectionBounds(host, component, selectionBoundsEl1);
    this.updateTextSelectionBounds(host, component, selectionBoundsEl1);
    this.updateTitleButtonSelectionBounds(host, component, selectionBoundsEl1);
    this.updateDeviceButtonSelectionBounds(host, component, selectionBoundsEl1);
    const state = this.updateLightStatisticsSelectionBounds(
      host,
      component,
      selectionBoundsEl1,
    );
    if (component.type === "light-statistics" && !state) {
      Object.assign(selectionBoundsEl1.style, {
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
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
      return (
        Number(
          element.offsetWidth || element.getBoundingClientRect?.().width || 0,
        ) > 0 &&
        Number(
          element.offsetHeight || element.getBoundingClientRect?.().height || 0,
        ) > 0
      );
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
      height,
    };
  }
  applyDoorWindowPerspective(element, corners, arg3) {
    const matchedEl = element?.querySelector(".hb-door-window-visual");
    if (!matchedEl || !corners) {
      return;
    }
    const count = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const count2 = Math.max(1, Number(corners.position?.width || 100) / count);
    const count3 = Math.max(1, Number(corners.position?.height || 100) / count);
    matchedEl.style.transform = doorWindowPerspectiveMatrix(
      count2,
      count3,
      arg3,
    );
  }
  updateDoorWindowPerspectiveHandles(componentId, arg2) {
    if (!componentId) {
      return;
    }
    const state = doorWindowPerspectiveCorners(arg2);
    componentId
      .querySelector(".hb-door-window-perspective-guide polygon")
      ?.setAttribute(
        "points",
        [0, 1, 2, 3]
          .map((arg) => state[arg * 2] + "," + state[arg * 2 + 1])
          .join(" "),
      );
    componentId
      .querySelectorAll(".hb-door-window-perspective-handle")
      .forEach((arg) => {
        const numeric = Number(arg.dataset.perspectiveCornerIndex || 0);
        arg.style.left = state[numeric * 2] * 100 + "%";
        arg.style.top = state[numeric * 2 + 1] * 100 + "%";
      });
  }
  appendDoorWindowPerspectiveHandles(host, component, arg3 = host) {
    if (
      !host ||
      !component ||
      component.properties?.sensorKind !== "door-window"
    ) {
      return;
    }
    const selectionBoundsEl = doorWindowPerspectiveCorners(
      component.properties?.perspectiveCorners,
    );
    const selectionBoundsEl1 = document.createElement("div");
    selectionBoundsEl1.className = "hb-selection-bounds hb-door-window-perspective-bounds";
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    element.classList.add("hb-door-window-perspective-guide");
    element.setAttribute("viewBox", "0 0 1 1");
    element.setAttribute("preserveAspectRatio", "none");
    element.append(
      document.createElementNS("http://www.w3.org/2000/svg", "polygon"),
    );
    selectionBoundsEl1.append(element);
    const doorWindowPerspectiveHandleEl = ["左上角", "右上角", "右下角", "左下角"];
    for (let doorWindowPerspectiveHandleEl1 = 0; doorWindowPerspectiveHandleEl1 < 4; doorWindowPerspectiveHandleEl1 += 1) {
      const doorWindowPerspectiveHandleEl2 = document.createElement("button");
      doorWindowPerspectiveHandleEl2.type = "button";
      doorWindowPerspectiveHandleEl2.className = "hb-door-window-perspective-handle";
      doorWindowPerspectiveHandleEl2.dataset.perspectiveCornerIndex = String(doorWindowPerspectiveHandleEl1);
      doorWindowPerspectiveHandleEl2.title = "拖动" + doorWindowPerspectiveHandleEl[doorWindowPerspectiveHandleEl1] + "调整透视";
      doorWindowPerspectiveHandleEl2.setAttribute("aria-label", doorWindowPerspectiveHandleEl2.title);
      doorWindowPerspectiveHandleEl2.addEventListener("pointerdown", (arg) =>
        this.startDoorWindowPerspective(
          arg,
          component,
          host,
          selectionBoundsEl1,
          doorWindowPerspectiveHandleEl1,
        ),
      );
      selectionBoundsEl1.append(doorWindowPerspectiveHandleEl2);
    }
    arg3.append(selectionBoundsEl1);
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
    const state = doorWindowPerspectiveCorners(
      component.properties?.perspectiveCorners,
    );
    const state1 = state[event2 * 2];
    const position = state[event2 * 2 + 1];
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const position1 = this.componentWorldTransform(component.id);
    const scale = position1.scale;
    const scale1 = (position1.rotation * Math.PI) / 180;
    const angle = Math.cos(scale1);
    const state2 = Math.sin(scale1);
    let perspectiveCorners = state;
    let event3 = false;
    const event4 = (event5) => {
      if (event5.pointerId !== pointerId) {
        return;
      }
      const event6 =
        (event5.clientX - clientX) / Math.max(0.001, this.appliedScaleX || 1);
      const state4 =
        (event5.clientY - clientY) / Math.max(0.001, this.appliedScaleY || 1);
      const scale2 = (angle * event6 + state2 * state4) / scale;
      const scale3 = (-state2 * event6 + angle * state4) / scale;
      const scale4 = state.slice();
      scale4[event2 * 2] = state1 + scale2 / count;
      scale4[event2 * 2 + 1] = position + scale3 / count2;
      perspectiveCorners = doorWindowPerspectiveCorners(scale4);
      component.properties = {
        ...(component.properties || {}),
        perspectiveCorners,
      };
      this.applyDoorWindowPerspective(cornerIndex, component, perspectiveCorners);
      this.updateDoorWindowPerspectiveHandles(event1, perspectiveCorners);
      this.options.onComponentPropertiesPreview?.(component.id, {
        perspectiveCorners,
      });
    };
    const state3 = (event5 = null) => {
      if (
        !event3 &&
        (event5?.pointerId == null || event5.pointerId === pointerId)
      ) {
        event3 = true;
        window.removeEventListener("pointermove", event4, true);
        window.removeEventListener("pointerup", state3, true);
        window.removeEventListener("pointercancel", state3, true);
        window.removeEventListener("blur", state3);
        if (JSON.stringify(perspectiveCorners) !== JSON.stringify(state)) {
          this.options.onComponentProperties?.(component.id, {
            perspectiveCorners,
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
    for (const cornerMarkerEl of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const cornerMarkerEl1 = document.createElement("i");
      cornerMarkerEl1.className = "hb-corner-marker hb-corner-" + cornerMarkerEl;
      cornerMarkerEl1.setAttribute("aria-hidden", "true");
      selectionBoundsEl1.append(cornerMarkerEl1);
    }
    const transformHandleEl = document.createElement("button");
    transformHandleEl.type = "button";
    transformHandleEl.className = "hb-transform-handle hb-resize-handle";
    transformHandleEl.title = "拖动缩放出风效果";
    transformHandleEl.addEventListener("pointerdown", (transformHandleEl2) =>
      this.startAirflowScale(transformHandleEl2, component, host, selectionBoundsEl1, selectionBoundsEl),
    );
    const transformHandleEl1 = document.createElement("button");
    transformHandleEl1.type = "button";
    transformHandleEl1.className = "hb-transform-handle hb-rotate-handle";
    transformHandleEl1.title = "拖动旋转出风效果";
    transformHandleEl1.addEventListener("pointerdown", (arg) =>
      this.startAirflowRotate(arg, component, host, selectionBoundsEl1, selectionBoundsEl),
    );
    selectionBoundsEl1.append(transformHandleEl, transformHandleEl1);
    selectionBoundsEl1.addEventListener("pointerdown", (arg) =>
      this.startAirflowMove(arg, component, host, selectionBoundsEl1, selectionBoundsEl),
    );
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
    const event5 = (event6) => {
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
          state1 =
            Math.abs(event7) >= Math.abs(amount) ? "horizontal" : "vertical";
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
      const state5 = groupedComponentLocalDelta(
        state3,
        state4,
        this.componentParentTransform(component.id),
      );
      airflowOffsetX = Math.max(
        state.minX,
        Math.min(state.maxX, numeric + (state5.x / count) * 100),
      );
      airflowOffsetY = Math.max(
        state.minY,
        Math.min(state.maxY, numeric2 + (state5.y / count2) * 100),
      );
      component.properties = {
        ...(component.properties || {}),
        airflowOffsetX,
        airflowOffsetY,
      };
      this.syncAirflowLayerGeometry(event1, component, event3);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowOffsetX,
        airflowOffsetY,
      });
    };
    const state2 = (event6 = null) => {
      if (
        !event4 &&
        (event6?.pointerId == null || event6.pointerId === pointerId)
      ) {
        event4 = true;
        window.removeEventListener("pointermove", event5, true);
        window.removeEventListener("pointerup", state2, true);
        window.removeEventListener("pointercancel", state2, true);
        window.removeEventListener("blur", state2);
        if (airflowOffsetX !== numeric || airflowOffsetY !== numeric2) {
          this.options.onComponentProperties?.(component.id, {
            airflowOffsetX,
            airflowOffsetY,
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
    const count = Math.max(
      0.01,
      Math.min(5, Number(component.properties?.airflowScale || 1)),
    );
    const scale = this.componentParentTransform(component.id).scale;
    const scale1 = 1 / Math.max(0.001, state * count * scale);
    element.style.setProperty("--hb-ui-scale", String(scale1));
    element.style.setProperty("--hb-handle-outset", scale1 * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle(
      "handles-outside",
      domRect.width < 132 || domRect.height < 112,
    );
  }
  startAirflowScale(event, component, handle, element, arg5) {
    event.preventDefault();
    event.stopPropagation();
    const domRect = element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - size, event.clientY - size1),
    );
    const count2 = Math.max(
      0.01,
      Math.min(5, Number(component.properties?.airflowScale || 1)),
    );
    let airflowScale = count2;
    let state = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const runHelper = () => {
      this.syncAirflowLayerGeometry(handle, component, arg5);
      this.updateAirflowHandleScale(component, element);
    };
    const clamped = (event1) => {
      const event2 = Math.hypot(
        event1.clientX - size,
        event1.clientY - size1,
      );
      airflowScale = Math.max(0.01, Math.min(5, (count2 * event2) / count));
      component.properties = {
        ...(component.properties || {}),
        airflowScale,
      };
      runHelper();
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowScale,
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
            airflowScale,
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", clamped);
    currentTarget.addEventListener("pointerup", state1);
    currentTarget.addEventListener("pointercancel", state1);
    currentTarget.addEventListener("lostpointercapture", state1);
  }
  startAirflowRotate(event, component, arg3, element, arg5) {
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
    const state1 = (event2) => {
      const state3 = Math.atan2(
        event2.clientY - event1,
        event2.clientX - size,
      );
      airflowRotation = numeric + ((state3 - size1) * 180) / Math.PI;
      component.properties = {
        ...(component.properties || {}),
        airflowRotation,
      };
      this.syncAirflowLayerGeometry(arg3, component, arg5);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowRotation,
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
            airflowRotation,
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", state1);
    currentTarget.addEventListener("pointerup", state2);
    currentTarget.addEventListener("pointercancel", state2);
    currentTarget.addEventListener("lostpointercapture", state2);
  }
  updateAirConditionerButtonSelectionBounds(componentId, component, arg3) {
    if (!componentId || component?.type !== "air-conditioner" || !arg3) {
      return;
    }
    const position = component.properties || {};
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const state = [];
    const clampNumber = (arg, arg2, arg31, arg4) => {
      const numeric = Number(arg);
      return Math.max(
        arg2,
        Math.min(arg31, Number.isFinite(numeric) ? numeric : arg4),
      );
    };
    const runHelper = (arg, arg2, arg31, arg4) => {
      state.push({
        left: arg - arg31 / 2,
        top: arg2 - arg4 / 2,
        right: arg + arg31 / 2,
        bottom: arg2 + arg4 / 2,
      });
    };
    const runHelper1 = (arg, arg2, arg31, arg4) => {
      const count4 = Math.max(
        arg4,
        Number(arg?.offsetWidth || 0) * count3,
      );
      const count5 = Math.max(
        arg4,
        Number(arg?.offsetHeight || 0) * count3,
      );
      const left = (count * clampNumber(arg2, -100, 200, 0)) / 100;
      const size1 = (count2 * clampNumber(arg31, -100, 200, 50)) / 100;
      state.push({
        left,
        top: size1 - count5 / 2,
        right: left + count4,
        bottom: size1 + count5 / 2,
      });
    };
    const state1 = (count2 * clampNumber(position.badgeSize, 1, 100, 28)) / 100;
    if (position.iconVisible !== false) {
      runHelper(
        (count * clampNumber(position.iconLeft, -100, 200, 20)) / 100,
        (count2 * clampNumber(position.iconTop, -100, 200, 50)) / 100,
        state1,
        state1,
      );
    }
    if (position.mainTextVisible !== false) {
      runHelper1(
        componentId.querySelector(
          ":scope > .hb-air-conditioner .hb-air-conditioner-text strong",
        ),
        position.mainTextLeft,
        position.mainTextTop,
        (count2 * clampNumber(position.mainSize, 6, 120, 21)) / 100,
      );
    }
    if (position.secondaryTextVisible !== false) {
      runHelper1(
        componentId.querySelector(
          ":scope > .hb-air-conditioner .hb-air-conditioner-text small",
        ),
        position.secondaryTextLeft,
        position.secondaryTextTop,
        (count2 * clampNumber(position.secondarySize, 5, 80, 12)) / 100,
      );
    }
    if (!state.length) {
      Object.assign(arg3.style, {
        left: "0px",
        top: "0px",
        width: count + "px",
        height: count2 + "px",
      });
      return;
    }
    const size = 4;
    const mapped = Math.min(...state.map((arg) => arg.left)) - size;
    const mapped1 = Math.min(...state.map((arg) => arg.top)) - size;
    const mapped2 = Math.max(...state.map((arg) => arg.right)) + size;
    const mapped3 =
      Math.max(...state.map((arg) => arg.bottom)) + size;
    Object.assign(arg3.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px",
    });
  }
  updateDeviceButtonSelectionBounds(componentId, component, arg3) {
    if (!componentId || component?.type !== "device-button" || !arg3) {
      return false;
    }
    const state = component.properties || {};
    const position = state.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const state1 = [];
    const clampNumber = (arg, arg2, arg31, arg4) => {
      const numeric = Number(arg);
      return Math.max(
        arg2,
        Math.min(arg31, Number.isFinite(numeric) ? numeric : arg4),
      );
    };
    const runHelper = (arg, arg2, arg31, arg4) => {
      if (
        !![arg, arg2, arg31, arg4].every(Number.isFinite) &&
        !(arg31 <= 0) &&
        !(arg4 <= 0)
      ) {
        state1.push({
          left: arg - arg31 / 2,
          top: arg2 - arg4 / 2,
          right: arg + arg31 / 2,
          bottom: arg2 + arg4 / 2,
        });
      }
    };
    const runHelper1 = (arg, arg2, arg31, arg4) => {
      const count4 = Math.max(
        arg4,
        Number(arg?.offsetWidth || 0) * count3,
      );
      const count5 = Math.max(
        arg4,
        Number(arg?.offsetHeight || 0) * count3,
      );
      const left = (count * clampNumber(arg2, -100, 200, 0)) / 100;
      const size1 = (count2 * clampNumber(arg31, -100, 200, 50)) / 100;
      state1.push({
        left,
        top: size1 - count5 / 2,
        right: left + count4,
        bottom: size1 + count5 / 2,
      });
    };
    const state2 =
      (count2 * clampNumber(state.badgeSize ?? state.iconSize, 1, 100, 28)) / 100;
    if (state.iconVisible !== false || position) {
      runHelper(
        (count * clampNumber(state.iconLeft, -100, 200, 20)) / 100,
        (count2 * clampNumber(state.iconTop, -100, 200, 50)) / 100,
        state2,
        state2,
      );
    }
    if (state.mainTextVisible !== false || position) {
      runHelper1(
        componentId.querySelector(
          ":scope > .hb-icon-button .hb-icon-button-text strong",
        ),
        state.mainTextLeft,
        state.mainTextTop,
        (count2 * clampNumber(state.mainSize, 6, 120, 21)) / 100,
      );
    }
    if (state.secondaryTextVisible !== false || position) {
      runHelper1(
        componentId.querySelector(
          ":scope > .hb-icon-button .hb-icon-button-text small",
        ),
        state.secondaryTextLeft,
        state.secondaryTextTop,
        (count2 * clampNumber(state.secondarySize, 5, 80, 12)) / 100,
      );
    }
    if (!state1.length) {
      return false;
    }
    const size = 4;
    const mapped = Math.min(...state1.map((arg) => arg.left)) - size;
    const mapped1 = Math.min(...state1.map((arg) => arg.top)) - size;
    const mapped2 =
      Math.max(...state1.map((arg) => arg.right)) + size;
    const mapped3 =
      Math.max(...state1.map((arg) => arg.bottom)) + size;
    Object.assign(arg3.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px",
    });
    return true;
  }
  updateTitleButtonSelectionBounds(componentId, component, arg3) {
    if (!componentId || component?.type !== "title-button" || !arg3) {
      return false;
    }
    const state = component.properties || {};
    const position = state.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const size = [];
    const runHelper = (left, top, arg31, arg4) => {
      if (
        !![left, top, arg31, arg4].every(Number.isFinite) &&
        !(arg31 <= 0) &&
        !(arg4 <= 0)
      ) {
        size.push({
          left,
          top,
          right: left + arg31,
          bottom: top + arg4,
        });
      }
    };
    const clampNumber = (arg, arg2, arg31, arg4) => {
      const numeric = Number(arg);
      return Math.max(
        arg2,
        Math.min(arg31, Number.isFinite(numeric) ? numeric : arg4),
      );
    };
    if (state.frameVisible !== false || position) {
      const state1 = clampNumber(state.frameSize, 10, 300, 100) / 100;
      const state2 = count2 * 0.45 * state1;
      const state3 =
        count / 2 + (count * clampNumber(state.frameOffsetX, -100, 100, 0)) / 100;
      const state4 =
        count2 / 2 + (count2 * clampNumber(state.frameOffsetY, -100, 100, 0)) / 100;
      const state5 = (count * clampNumber(state.frameSpacing, 0, 300, 100)) / 200;
      const state6 = count2 * 0.12;
      const state7 = clampNumber(state.frameWidth, 0, 12, 1.5);
      runHelper(
        state3 - state5 - state7 / 2,
        state4 - state2 / 2 - state7 / 2,
        state6 + state7,
        state2 + state7,
      );
      runHelper(
        state3 + state5 - state6 - state7 / 2,
        state4 - state2 / 2 - state7 / 2,
        state6 + state7,
        state2 + state7,
      );
    }
    if (state.mainTextVisible !== false || position) {
      const element = componentId.querySelector(
        ":scope > .hb-title-button .hb-title-button-main",
      );
      const state1 = (count2 * clampNumber(state.mainSize, 8, 200, 34)) / 100;
      runHelper(
        (count * clampNumber(state.mainTextLeft, -100, 200, 5.5)) / 100,
        (count2 * clampNumber(state.mainTextTop, -100, 200, 45)) / 100 - state1 / 2,
        Math.max(state1, Number(element?.offsetWidth || 0) * count3),
        Math.max(state1, Number(element?.offsetHeight || 0) * count3),
      );
    }
    if (state.secondaryTextVisible !== false || position) {
      const element = componentId.querySelector(
        ":scope > .hb-title-button .hb-title-button-secondary",
      );
      const state1 = (count2 * clampNumber(state.secondarySize, 6, 100, 12)) / 100;
      const count4 = Math.max(
        state1,
        Number(element?.offsetHeight || 0) * count3,
      );
      runHelper(
        (count * clampNumber(state.secondaryTextLeft, -100, 200, 54)) / 100,
        (count2 * clampNumber(state.secondaryTextTop, -100, 200, 43)) / 100 -
          count4 / 2,
        Math.max(state1, Number(element?.offsetWidth || 0) * count3),
        count4,
      );
    }
    if ((state.iconVisible !== false || position) && state.icon) {
      const state1 = (count2 * clampNumber(state.iconSize, 1, 100, 30)) / 100;
      runHelper(
        (count * clampNumber(state.iconLeft, -100, 200, 50)) / 100 - state1 / 2,
        (count2 * clampNumber(state.iconTop, -100, 200, 45)) / 100 - state1 / 2,
        state1,
        state1,
      );
    }
    if (state.markerVisible !== false || position) {
      const state1 = (count2 * clampNumber(state.markerSize, 2, 60, 10)) / 100;
      const state2 = (count * clampNumber(state.markerLeft, -100, 200, 1.8)) / 100;
      const state3 = (count2 * clampNumber(state.markerTop, -100, 200, 84)) / 100;
      runHelper(state2 - state1 * 0.58, state3, state1 * 1.16, state1);
    }
    if (!size.length) {
      return false;
    }
    const size1 = 4;
    const mapped = Math.min(...size.map((arg) => arg.left)) - size1;
    const mapped1 = Math.min(...size.map((arg) => arg.top)) - size1;
    const mapped2 = Math.max(...size.map((arg) => arg.right)) + size1;
    const mapped3 =
      Math.max(...size.map((arg) => arg.bottom)) + size1;
    Object.assign(arg3.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px",
    });
    return true;
  }
  updateLightStatisticsSelectionBounds(componentId, arg2, arg3) {
    if (
      !componentId ||
      arg2?.type !== "light-statistics" ||
      !arg3 ||
      componentId.hidden
    ) {
      return false;
    }
    const element = componentId.querySelector(":scope > .hb-light-statistics");
    if (!element) {
      return false;
    }
    const filtered = [...element.children].filter((arg) =>
      arg.hidden ||
      Number(arg.offsetWidth || 0) <= 0 ||
      Number(arg.offsetHeight || 0) <= 0
        ? false
        : window.getComputedStyle?.(arg).display !== "none",
    );
    if (!filtered.length) {
      return false;
    }
    const count = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const state = 4;
    const mapped =
      (Math.min(...filtered.map((arg) => arg.offsetLeft)) - state) *
      count;
    const mapped1 =
      (Math.min(...filtered.map((arg) => arg.offsetTop)) - state) *
      count;
    const mapped2 =
      (Math.max(
        ...filtered.map((arg) => arg.offsetLeft + arg.offsetWidth),
      ) +
        state) *
      count;
    const mapped3 =
      (Math.max(
        ...filtered.map((arg) => arg.offsetTop + arg.offsetHeight),
      ) +
        state) *
      count;
    Object.assign(arg3.style, {
      left: mapped + "px",
      top: mapped1 + "px",
      width: Math.max(1, mapped2 - mapped) + "px",
      height: Math.max(1, mapped3 - mapped1) + "px",
    });
    return true;
  }
  updateTextSelectionBounds(componentId, arg2, arg3) {
    if (
      !componentId ||
      !["time", "date", "weather"].includes(arg2?.type) ||
      !arg3
    ) {
      return false;
    } else {
      return this.withSelectionMeasurementHost(componentId, () => {
        const element = componentId.querySelector(
          ":scope > .hb-time-component, :scope > .hb-date-component, :scope > .hb-weather-component",
        );
        if (!element) {
          return false;
        }
        const matchedEl = (
          arg2.type === "time"
            ? [
                ...element.querySelectorAll(
                  ":scope > .hb-time-value, :scope > .hb-time-period",
                ),
              ]
            : arg2.type === "date"
              ? [
                  ...element.querySelectorAll(
                    ":scope > .hb-date-primary, :scope > .hb-date-lunar",
                  ),
                ]
              : [
                  ...element.querySelectorAll(
                    ":scope > .hb-weather-icon, :scope > .hb-weather-content > strong, :scope > .hb-weather-content > small",
                  ),
                ]
        ).filter((arg) => this.selectionElementIsVisible(arg));
        const count = Math.max(
          0.01,
          Number(this.document?.canvas?.componentScale || 1),
        );
        const count2 = Math.max(1, Number(arg2.position?.width || 100));
        const count3 = Math.max(1, Number(arg2.position?.height || 100));
        if (!matchedEl.length) {
          const clamped = Math.min(
            32,
            Math.max(20, Math.min(count2, count3) * 0.2),
          );
          Object.assign(arg3.style, {
            left: (count2 - clamped) / 2 + "px",
            top: (count3 - clamped) / 2 + "px",
            width: clamped + "px",
            height: clamped + "px",
          });
          return false;
        }
        const mapped = matchedEl.map((arg) =>
          this.selectionElementBox(arg, componentId),
        );
        const size = 3;
        const mapped1 =
          (Math.min(...mapped.map((arg) => arg.left)) - size) * count;
        const mapped2 =
          (Math.min(...mapped.map((arg) => arg.top)) - size) * count;
        const mapped3 =
          (Math.max(...mapped.map((arg) => arg.left + arg.width)) +
            size) *
          count;
        const mapped4 =
          (Math.max(...mapped.map((arg) => arg.top + arg.height)) +
            size) *
          count;
        Object.assign(arg3.style, {
          left: mapped1 + "px",
          top: mapped2 + "px",
          width: Math.max(1, mapped3 - mapped1) + "px",
          height: Math.max(1, mapped4 - mapped2) + "px",
        });
        return true;
      });
    }
  }
  async updateImageSelectionBounds(componentId, arg2, arg3) {
    const element = componentId.querySelector(":scope > .hb-image-component");
    if (
      !element ||
      ((!element.complete || !element.naturalWidth) &&
        (await new Promise((arg) => {
          element.addEventListener("load", arg, {
            once: true,
          });
          element.addEventListener("error", arg, {
            once: true,
          });
        })),
      !componentId.isConnected ||
        !arg3.isConnected ||
        !element.naturalWidth ||
        !element.naturalHeight)
    ) {
      return;
    }
    const numeric = Number(arg2.position?.width || 100);
    const numeric2 = Number(arg2.position?.height || 100);
    const position = element.naturalWidth / element.naturalHeight;
    const state = numeric / numeric2;
    const state1 = position >= state ? numeric : numeric2 * position;
    const state2 = position >= state ? numeric / position : numeric2;
    const size = (numeric - state1) / 2;
    const size1 = (numeric2 - state2) / 2;
    Object.assign(arg3.style, {
      left: (size / numeric) * 100 + "%",
      top: (size1 / numeric2) * 100 + "%",
      width: (state1 / numeric) * 100 + "%",
      height: (state2 / numeric2) * 100 + "%",
    });
  }
  updateTransformHandleScale(componentId, arg2, arg3 = null) {
    if (!componentId || !arg2) {
      return;
    }
    const state = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(arg2.style?.scale || 1)));
    const scale = this.componentParentTransform(arg2.id).scale;
    const scale1 = 1 / Math.max(0.001, state * count * scale);
    const element =
      arg3 ||
      this.componentSelectionOverlays
        .get(arg2.id)
        ?.querySelector(":scope > .hb-selection-bounds") ||
      componentId.querySelector(":scope > .hb-selection-bounds");
    if (!element) {
      return;
    }
    element.style.setProperty("--hb-ui-scale", String(scale1));
    element.style.setProperty("--hb-handle-outset", scale1 * 30 + "px");
    const domRect = element.getBoundingClientRect();
    element.classList.toggle(
      "handles-outside",
      domRect.width < 132 || domRect.height < 112,
    );
  }
  startComponentScale(event, componentId, element, element2) {
    event.preventDefault();
    event.stopPropagation();
    const domRect =
      element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const size1 = domRect.top + domRect.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - size, event.clientY - size1),
    );
    const count2 = Math.max(0.01, Math.min(5, Number(componentId.style?.scale || 1)));
    let scale = count2;
    let event1 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event2 = (event3) => {
      if (event3.pointerId !== pointerId) {
        return;
      }
      const event4 = Math.hypot(
        event3.clientX - size,
        event3.clientY - size1,
      );
      scale = Math.max(0.01, Math.min(5, (count2 * event4) / count));
      componentId.style = {
        ...(componentId.style || {}),
        scale,
      };
      element.style.transform =
        "rotate(" +
        Number(componentId.position?.rotation || 0) +
        "deg) scale(" +
        scale +
        ")";
      const scale2 = this.componentSelectionOverlays.get(componentId.id);
      if (scale2) {
        scale2.style.transform = element.style.transform;
      }
      this.updateTransformHandleScale(element, componentId, element2);
      this.options.onComponentTransformPreview?.(componentId.id, {
        scale,
      });
    };
    const scale1 = (event3 = null) => {
      if (
        !event1 &&
        (event3?.pointerId == null || event3.pointerId === pointerId)
      ) {
        event1 = true;
        window.removeEventListener("pointermove", event2, true);
        window.removeEventListener("pointerup", scale1, true);
        window.removeEventListener("pointercancel", scale1, true);
        window.removeEventListener("blur", scale1);
        componentId.style = {
          ...(componentId.style || {}),
          scale,
        };
        if (scale !== count2) {
          this.options.onComponentTransform?.(componentId.id, {
            scale,
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
    const domRect =
      element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const size = domRect.left + domRect.width / 2;
    const event1 = domRect.top + domRect.height / 2;
    const position = Math.atan2(event.clientY - event1, event.clientX - size);
    const numeric = Number(componentId.position?.rotation || 0);
    let rotation = numeric;
    let event2 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const event3 = (event4) => {
      if (event4.pointerId !== pointerId) {
        return;
      }
      const angle1 = Math.atan2(
        event4.clientY - event1,
        event4.clientX - size,
      );
      rotation = numeric + ((angle1 - position) * 180) / Math.PI;
      element.style.transform =
        "rotate(" +
        rotation +
        "deg) scale(" +
        Number(componentId.style?.scale || 1) +
        ")";
      const scale = this.componentSelectionOverlays.get(componentId.id);
      if (scale) {
        scale.style.transform = element.style.transform;
      }
      this.options.onComponentTransformPreview?.(componentId.id, {
        rotation,
      });
    };
    const angle = (event4 = null) => {
      if (
        !event2 &&
        (event4?.pointerId == null || event4.pointerId === pointerId)
      ) {
        event2 = true;
        window.removeEventListener("pointermove", event3, true);
        window.removeEventListener("pointerup", angle, true);
        window.removeEventListener("pointercancel", angle, true);
        window.removeEventListener("blur", angle);
        componentId.position = {
          ...(componentId.position || {}),
          rotation,
        };
        if (rotation !== numeric) {
          this.options.onComponentTransform?.(componentId.id, {
            rotation,
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
    const state5 = isComponentActionSupported(component, component.actions?.tap)
      ? component.actions.tap
      : null;
    const state6 = isComponentActionSupported(component, component.actions?.doubleTap)
      ? component.actions.doubleTap
      : null;
    const state7 = isComponentActionSupported(component, component.actions?.hold)
      ? component.actions.hold
      : null;
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
          optimisticPreviousState,
        });
      }
    };
    host.style.touchAction = "manipulation";
    host.addEventListener("contextmenu", (event) => event.preventDefault());
    host.addEventListener("selectstart", (event) => event.preventDefault());
    host.addEventListener("dragstart", (event) => event.preventDefault());
    host.addEventListener("pointerdown", (event2) => {
      bindRuntimeActionsValue1 = false;
      event = {
        pointerId: event2.pointerId,
        pointerType: event2.pointerType || "mouse",
        x: event2.clientX,
        y: event2.clientY,
        moved: false,
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
    host.addEventListener("pointermove", (event2) => {
      if (
        !!event &&
        event.pointerId === event2.pointerId &&
        !(
          Math.hypot(event2.clientX - event.x, event2.clientY - event.y) <=
          18
        )
      ) {
        event.moved = true;
        scheduleTimeout();
      }
    });
    host.addEventListener("pointerup", (event) => {
      scheduleTimeout();
      const event2 = event?.pointerId === event.pointerId ? event : null;
      event = null;
      if (
        !event2 ||
        event2.pointerType === "mouse" ||
        event2.moved ||
        bindRuntimeActionsValue1
      ) {
        return;
      }
      event.preventDefault();
      state2 = performance.now() + 700;
      if (state8 || state9) {
        runHelper();
      }
      const time = performance.now();
      if (
        state9 &&
        event1 &&
        time - event1.time <= 180 &&
        Math.hypot(event.clientX - event1.x, event.clientY - event1.y) <= 34
      ) {
        window.clearTimeout(state1);
        runHelper2();
        event1 = null;
        this.runAction(component, state6);
        return;
      }
      event1 = {
        time,
        x: event.clientX,
        y: event.clientY,
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
  runAction(component, component1, arg3 = {}) {
    if (!!component1?.type && component1.type !== "none") {
      this.dispatchAction(component, component1, arg3).catch((arg) => {
        window.HABridgeLog?.error(arg, {
          componentId: component.id,
          entityId: component.bindings?.entity?.entityId || "",
          phase: "component-action",
        });
        this.options.onError?.(arg);
      });
    }
  }
  previewAction(action, component) {
    if (component?.type === "more-info") {
      this.showActionPopup(action, component, {
        preview: true,
      });
    }
  }
  popupComponentForEntity(entityId1, arg2 = "") {
    let entityId = String(entityId1 || "");
    let entityId2 = entityId.split(".")[0];
    const state = this.deviceProfile(entityId);
    if (
      state?.deviceType === "air-purifier" &&
      state.roles?.fan &&
      entityId2 !== "fan"
    ) {
      entityId = state.roles.fan;
      entityId2 = "fan";
    }
    const state1 = state?.roles?.climate || state?.roles?.fan || "";
    if (
      ["air-conditioner", "bath-heater"].includes(state?.deviceType) &&
      state1 &&
      !["climate", "light"].includes(entityId2)
    ) {
      entityId = state1;
      entityId2 = entityId.split(".")[0];
    }
    const state2 = this.entityMetadata.get(entityId);
    if (
      entityId2 === "sensor" &&
      state2?.deviceId &&
      ["state", "status", "task_status"].includes(state2.translationKey)
    ) {
      const found = [...this.entityMetadata.values()].find(
        (arg) =>
          arg.deviceId === state2.deviceId &&
          arg.domain === "vacuum" &&
          entityMetadataIsAvailable(arg),
      );
      if (found?.entityId) {
        entityId = found.entityId;
        entityId2 = "vacuum";
      }
    }
    const type =
      state?.deviceType === "electric-bed"
        ? "electric-bed"
        : state?.deviceType === "air-purifier" && entityId2 === "fan"
          ? "air-purifier"
          : (["air-conditioner", "bath-heater"].includes(state?.deviceType) &&
                ["climate", "fan"].includes(entityId2)) ||
              entityId2 === "climate"
            ? "air-conditioner"
            : entityId2 === "water_heater"
              ? "water-heater"
              : entityId2 === "camera"
                ? "camera"
                : entityId2 === "media_player"
                  ? "media-player"
                  : ["fan", "select", "number", "input_number"].includes(entityId2)
                    ? "device-button"
                    : ["light", "switch", "input_boolean"].includes(entityId2)
                      ? "icon-button"
                      : entityId2 === "sensor"
                        ? "line-chart"
                        : entityId2 === "vacuum"
                          ? "vacuum-control"
                          : "device-button";
    return {
      id: "popup-" + entityId,
      type,
      bindings: {
        entity: {
          entityId,
        },
      },
      properties: {
        label: arg2 || "",
        ...(["air-conditioner", "bath-heater"].includes(state?.deviceType)
          ? {
              deviceType: state.deviceType,
            }
          : {}),
        ...(state?.deviceType === "air-purifier"
          ? {
              deviceType: "air-purifier",
            }
          : {}),
        ...(state?.deviceType === "electric-bed"
          ? {
              deviceType: "electric-bed",
            }
          : {}),
        ...(state?.coverKind
          ? {
              coverKind: state.coverKind,
            }
          : {}),
      },
      actions: {},
    };
  }
  showActionPopup(component, component1, { preview = false } = {}) {
    const state = component1?.data?.popupSource || "current";
    if (state === "custom") {
      const found = (this.document?.customPopups || []).find(
        (arg) => arg.id === component1.data?.popupId,
      );
      if (!found) {
        throw new Error("选择的组合弹窗不存在。");
      }
      this.showCustomPopup(found, {
        preview,
      });
      return;
    }
    const entityId = component?.bindings?.entity?.entityId;
    const asString =
      String(entityId || "").split(".", 1)[0] === "cover" ||
      ["camera", "line-chart", "air-conditioner", "icon-button"].includes(
        component?.type,
      );
    let component2 =
      state === "entity"
        ? this.popupComponentForEntity(
            component1.data?.entityId,
            componentDialogTitle(
              component,
              component1.data?.title || component1.data?.entityId,
            ),
          )
        : asString
          ? component
          : this.popupComponentForEntity(
              entityId,
              componentDialogTitle(component, ""),
            );
    if (
      state !== "entity" &&
      component2 !== component &&
      component?.properties?.relatedEntities
    ) {
      component2 = {
        ...component2,
        properties: {
          ...(component2.properties || {}),
          relatedEntities: structuredClone(
            component.properties.relatedEntities,
          ),
        },
      };
    }
    if (!component2?.bindings?.entity?.entityId) {
      throw new Error("该弹窗没有可用实体。");
    }
    if (component2.type === "camera") {
      this.showCameraPreview(component2, {
        preview,
      });
    } else {
      this.showEntityDetails(component2, {
        preview,
      });
    }
  }
  async dispatchAction(
    component,
    component1,
    {
      optimisticAlreadyApplied = false,
      optimisticRollback = null,
      optimisticPreviousState,
    } = {},
  ) {
    if (component1.type === "toggle") {
      const entityId = component.bindings?.entity?.entityId;
      if (!entityId) {
        throw new Error("该控件没有关联实体。");
      }
      if (isVirtualEntityId(entityId)) {
        this.toggleVirtualEntity(entityId);
        return;
      }
      const state =
        typeof this.powerEntityId == "function"
          ? this.powerEntityId(component, entityId)
          : entityId;
      const state1 = state.split(".", 1)[0];
      if (["button", "script"].includes(state1)) {
        const state3 = entityToggleCommand(
          state,
          this.states.get(state),
          component,
        );
        await this.callEntityService(
          state3.domain,
          state3.service,
          state,
          state3.data,
        );
        return;
      }
      const state2 = optimisticAlreadyApplied ? optimisticPreviousState : this.states.get(state);
      const runHelper = optimisticAlreadyApplied
        ? optimisticRollback || (() => {})
        : this.applyOptimisticToggle(state, component);
      try {
        if (state1 === "cover") {
          const index = new Map(this.states);
          if (state2 === undefined) {
            index.delete(state);
          } else {
            index.set(state, state2);
          }
          await this.callEntityService(
            "cover",
            coverToggleServiceForComponent(
              component,
              this.entityMetadata,
              index,
              state,
            ),
            state,
          );
        } else if (
          ["climate", "fan", "water_heater", "media_player"].includes(state1)
        ) {
          const state3 =
            typeof this.runtimePowerComponent == "function"
              ? this.runtimePowerComponent(component, entityId)
              : component;
          const state4 = entityToggleCommand(state, state2, state3);
          await this.callEntityService(
            state4.domain,
            state4.service,
            state,
            state4.data,
          );
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
      if (
        !component1.target ||
        !this.document?.pages?.some((event) => event.path === component1.target)
      ) {
        throw new Error("跳转的页面不存在。");
      }
      this.navigate(component1.target);
    }
  }
  async callEntityService(domain, service, entityId, data = {}) {
    const response = await fetch("/api/v1/ha/services/call", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        domain,
        service,
        entityId,
        data,
      }),
      hbLogContext: {
        entityId,
        service: domain + "." + service,
        phase: "device-control",
      },
    });
    if (!response.ok) {
      const state = await response.json().catch(() => ({}));
      const state1 = new Error(
        typeof state.detail == "string"
          ? state.detail
          : state.detail?.message || "实体操作失败。",
      );
      throw window.HABridgeLog?.linkError(state1, response) || state1;
    }
  }
  async browseMedia(
    entityId,
    mediaContentId = "media-source://",
    mediaContentType = "",
  ) {
    const response = await fetch("/api/v1/ha/media/browse", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        entityId,
        mediaContentId,
        mediaContentType,
      }),
    });
    const mediaBrowserEl = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(mediaBrowserEl.detail || "媒体目录读取失败。");
    }
    return mediaBrowserEl.result || {};
  }
  createMediaBrowserControl(entityId, { preview = false } = {}) {
    const root = document.createElement("section");
    root.className = "hb-media-browser";
    const element = document.createElement("button");
    element.type = "button";
    element.className = "hb-media-browser-trigger";
    element.innerHTML = '<span aria-hidden="true"></span>';
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
    const queryChildElement = (arg) => {
      state1 = !!arg;
      element.disabled = preview || state1 || !state2;
      element2.disabled = state1;
      mediaBrowserListEl.querySelectorAll("button").forEach((arg1) => {
        arg1.disabled = state1;
      });
    };
    const runHelper1 = (arg) =>
      String(
        arg?.title ||
          arg?.name ||
          arg?.media_content_id ||
          "未命名媒体",
      );
    const runHelper2 = async (
      arg,
      arg2 = "",
      { pushHistory = true } = {},
    ) => {
      if (!state1 && !preview && !!state2) {
        queryChildElement(true);
        runHelper("读取中…");
        try {
          const state3 = await this.browseMedia(entityId, arg, arg2);
          if (pushHistory && id !== arg) {
            state.push({
              id,
              type,
              title: element3.textContent,
            });
          }
          id = arg;
          type = arg2 || "";
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
          list.forEach((mediaBrowserItemEl) => {
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
                await runHelper2(
                  mediaBrowserItemEl.media_content_id,
                  mediaBrowserItemEl.media_content_type || "",
                  {
                    pushHistory: true,
                  },
                );
                return;
              }
              if (!!state5 && !state1) {
                queryChildElement(true);
                runHelper("发送播放…");
                try {
                  await this.callEntityService(
                    "media_player",
                    "play_media",
                    entityId,
                    {
                      media_content_id: mediaBrowserItemEl.media_content_id,
                      media_content_type: mediaBrowserItemEl.media_content_type || "music",
                    },
                  );
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
          runHelper(
            text.includes("Media directory does not exist")
              ? "此目录暂无媒体"
              : text,
          );
          mediaBrowserListEl.replaceChildren();
          const element6 = document.createElement("p");
          element6.className = "hb-media-browser-empty";
          element6.textContent = text.includes("Media directory does not exist")
            ? "此目录暂无可用媒体。"
            : text;
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
        pushHistory: false,
      });
    });
    element5.addEventListener("click", syncAriaState);
    element2.addEventListener("click", async () => {
      const state3 = state.pop();
      if (state3) {
        await runHelper2(state3.id, state3.type, {
          pushHistory: false,
        });
        element3.textContent = state3.title || "媒体库";
        element2.hidden = state.length === 0;
      }
    });
    return {
      root,
      panel,
      sync: (sync) => {
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
      },
    };
  }
  registerRuntimeDialogScale(dialogLayer, dialog, arg3, arg4) {
    const state = runtimeDialogUsesStableMotion();
    dialogLayer.classList.toggle("hb-runtime-stable-motion", state);
    dialogLayer.classList.toggle(
      "hb-runtime-simplified-motion",
      state && dialog.classList.contains("hb-custom-popup-dialog"),
    );
    const runtimeDialogScaleContext = {
      dialogLayer,
      dialog,
      designWidth: Math.max(1, Number(arg3) || 1),
      designHeight: Math.max(1, Number(arg4) || 1),
      fillAvailable:
        dialog.dataset.runtimeDialogLayout === "fill" ||
        dialog.classList.contains("media-player-details"),
      tightFill: dialog.classList.contains("media-player-details"),
      targetOccupancy:
        dialog.dataset.runtimeDialogLayout === "compact" ? COMPACT_TARGET_OCCUPANCY : DEFAULT_TARGET_OCCUPANCY,
      measureFrame: 0,
      layoutObserver: null,
      entranceAnimations: [],
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
    dialog.style.setProperty(
      "--hb-runtime-dialog-design-height",
      runtimeDialogScaleContext.designHeight + "px",
    );
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
          runtimeDialogScaleContext.entranceAnimations = playStableRuntimeDialogEntrance(
            dialogLayer,
            dialog,
          );
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
    if (
      !runtimeDialogScaleContext?.dialog?.isConnected ||
      !runtimeDialogScaleContext.dialogLayer?.isConnected
    ) {
      return;
    }
    const domRect = runtimeDialogScaleContext.dialogLayer.getBoundingClientRect();
    const domRect1 = this.viewport?.getBoundingClientRect();
    const dialogViewport = runtimeDialogViewport({
      layerLeft: domRect.left,
      layerTop: domRect.top,
      layerWidth:
        domRect.width ||
        runtimeDialogScaleContext.dialogLayer.clientWidth ||
        this.container.clientWidth,
      layerHeight:
        domRect.height ||
        runtimeDialogScaleContext.dialogLayer.clientHeight ||
        this.container.clientHeight,
      dashboardLeft: domRect1?.left,
      dashboardTop: domRect1?.top,
      dashboardWidth: domRect1?.width,
      dashboardHeight: domRect1?.height,
    });
    const layerWidth = dialogViewport.width;
    const layerHeight = dialogViewport.height;
    const count = Math.max(
      Number(runtimeDialogScaleContext.dialog.offsetWidth || 0),
      Number(runtimeDialogScaleContext.dialog.scrollWidth || 0),
    );
    const count2 = Math.max(
      Number(runtimeDialogScaleContext.dialog.offsetHeight || 0),
      Number(runtimeDialogScaleContext.dialog.scrollHeight || 0),
    );
    const layoutWidth =
      count > 1 ? count : runtimeDialogScaleContext.designWidth;
    const layoutHeight =
      count2 > 1 ? count2 : runtimeDialogScaleContext.designHeight;
    const dialogLayout = runtimeDialogLayout({
      layerWidth,
      layerHeight,
      layoutWidth,
      layoutHeight,
      fillAvailable: runtimeDialogScaleContext.fillAvailable,
      tightFill: runtimeDialogScaleContext.tightFill,
      targetOccupancy: runtimeDialogScaleContext.targetOccupancy,
    });
    const scale = dialogLayout.scale;
    runtimeDialogScaleContext.dialog.style.position = "absolute";
    runtimeDialogScaleContext.dialog.style.inset = "auto";
    runtimeDialogScaleContext.dialog.style.top = dialogViewport.centerY + "px";
    runtimeDialogScaleContext.dialog.style.left = dialogViewport.centerX + "px";
    runtimeDialogScaleContext.dialog.style.margin = "0";
    runtimeDialogScaleContext.dialog.style.transform =
      "translate(-50%, -50%) scale(" + scale + ")";
    runtimeDialogScaleContext.dialog.style.transformOrigin = "center";
    runtimeDialogScaleContext.dialog.style.setProperty(
      "--hb-runtime-dialog-scale",
      String(scale),
    );
    runtimeDialogScaleContext.dialogLayer.dataset.dialogScale =
      scale.toFixed(4);
    runtimeDialogScaleContext.dialogLayer.dataset.dialogLayoutWidth = String(
      Math.round(layoutWidth),
    );
    runtimeDialogScaleContext.dialogLayer.dataset.dialogLayoutHeight = String(
      Math.round(layoutHeight),
    );
    runtimeDialogScaleContext.dialogLayer.dataset.dialogSafeInset =
      dialogLayout.safeInset.toFixed(2);
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportWidth = String(
      Math.round(dialogViewport.width),
    );
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportHeight = String(
      Math.round(dialogViewport.height),
    );
  }
  clearRuntimeDialogScale(element) {
    if (this.runtimeDialogScaleContext?.dialog === element) {
      window.cancelAnimationFrame(
        this.runtimeDialogScaleContext.measureFrame || 0,
      );
      this.runtimeDialogScaleContext.layoutObserver?.disconnect();
      for (const item of this.runtimeDialogScaleContext.entranceAnimations ||
        []) {
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
  bindRuntimeDialogOutsideDismiss(dialog, arg2, event) {
    const state = performance.now() + 320;
    dialog.addEventListener("click", (event) => {
      if (!event.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        if (!(performance.now() < state)) {
          arg2.close();
        }
      }
    });
  }
  showCameraPreview(component, { preview = false } = {}) {
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
    element2.textContent = "正在连接";
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
    const runHelper = (arg, arg2 = 0) =>
      "translateX(-50%) perspective(260px) rotateY(" +
      arg +
      "deg) rotateZ(" +
      arg * 0.035 +
      "deg) translateY(" +
      arg2 +
      "px)";
    const filtered = () => {
      if (!cameraDeviceBodyEl.isConnected) {
        return;
      }
      const filtered1 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(
        (arg) => Math.abs(arg - state2) >= 7,
      );
      const state8 = filtered1[Math.floor(Math.random() * filtered1.length)] ?? 0;
      const state9 = Math.sign(state8 - state2) || 1;
      const state10 = Math.abs(state8 - state2);
      const duration = Math.round(430 + state10 * 18 + Math.random() * 320);
      const state11 = state8 + state9 * (1.4 + Math.random() * 2.2);
      const state12 = Math.random() * 1.4 - 0.7;
      cameraDeviceLensEl.style.setProperty(
        "--hb-camera-lens-shift",
        (state8 / 23) * 2.5 + "px",
      );
      state1?.cancel();
      state1 = cameraDeviceBodyEl.animate(
        [
          {
            transform: runHelper(state2, 0),
            offset: 0,
          },
          {
            transform: runHelper(state11, state12),
            offset: 0.78,
          },
          {
            transform: runHelper(state8, state12 * 0.35),
            offset: 1,
          },
        ],
        {
          duration,
          easing: "cubic-bezier(.2,.72,.22,1)",
          fill: "forwards",
        },
      );
      state1.addEventListener(
        "finish",
        () => {
          state2 = state8;
          cameraDeviceBodyEl.style.transform = runHelper(state2, state12 * 0.35);
          state1?.cancel();
          state1 = null;
          const state13 =
            Math.random() < 0.22
              ? 180 + Math.random() * 260
              : 680 + Math.random() * 1500;
          state = window.setTimeout(filtered, state13);
        },
        {
          once: true,
        },
      );
    };
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
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
    const state3 = false;
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
        container.classList.remove(
          "is-connecting",
          "is-unavailable",
          "is-revealing",
        );
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
    let state7 = state3 ? 4 / 3 : 16 / 9;
    const applyElementStyle = () => {
      const count = Math.max(280, this.container.clientWidth - 32);
      const count2 = Math.max(
        180,
        Math.min(625, this.container.clientHeight - 88),
      );
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
        objectFit: "fill",
        placeholder,
        onReady,
        onUnavailable,
        cleanup: (cleanup) => state5.push(cleanup),
      });
      const runHelper1 = (arg, arg2) => {
        if (!!state3 && !!arg && !!arg2) {
          state7 = arg / arg2;
          applyElementStyle();
        }
      };
      const state9 = () =>
        runHelper1(state8.video.videoWidth, state8.video.videoHeight);
      const state10 = () =>
        runHelper1(state8.image.naturalWidth, state8.image.naturalHeight);
      state8.video.addEventListener("loadedmetadata", state9);
      state8.image.addEventListener("load", state10);
      state5.push(() =>
        state8.video.removeEventListener("loadedmetadata", state9),
      );
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
    cameraPreviewCardEl.append(cameraPreviewHeadingEl, element4, container);
    detailsDialog.append(cameraPreviewCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(detailsDialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = detailsDialog;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, detailsDialog, 760, 680);
    element3.addEventListener("click", () => detailsDialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, detailsDialog, cameraPreviewCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        detailsDialog.close();
      }
    });
    detailsDialog.addEventListener(
      "close",
      () => {
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
      },
      {
        once: true,
      },
    );
    detailsDialog.show();
  }
  createCapabilityDetailsControls(
    entityId,
    component,
    {
      interactive = true,
      variant = "",
      selectLabel = "模式",
    } = {},
  ) {
    const capabilityDetailsControlsEl = document.createElement("section");
    capabilityDetailsControlsEl.className =
      "hb-capability-details-controls" +
      (variant ? " hb-capability-details-controls--" + variant : "");
    capabilityDetailsControlsEl.inert = !interactive;
    const asString = String(entityId || "").split(".", 1)[0];
    let entityState = component || {
      entityId,
      state: "unknown",
      attributes: {},
    };
    const state =
      asString === "fan"
        ? resolveClimateDeviceType(
            {
              properties: {},
            },
            entityState,
            entityId,
          )
        : "generic";
    const state1 = {
      entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations,
    };
    const runHelper = () => entityState?.attributes || {};
    const runHelper1 = () =>
      ["unknown", "unavailable"].includes(
        String(entityState?.state || "").toLowerCase(),
      );
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
          state: onToggle ? "on" : "off",
        };
        runHelper2(entityState);
        try {
          await this.callEntityService(
            asString === "fan" ? "fan" : "homeassistant",
            asString === "fan" ? (onToggle ? "turn_on" : "turn_off") : "toggle",
            entityId,
          );
        } catch (error) {
          entityState = onToggle2;
          runHelper2(onToggle2);
          this.options.onError?.(error);
        }
      },
    });
    lowered.visual.classList.add("hb-capability-power");
    if (state3) {
      capabilityDetailsControlsEl.append(lowered.visual);
    }
    const createChildElement = (
      arg,
      arg2,
      arg3,
      service,
      dataKey,
      arg6 = asString,
    ) => {
      const set = [
        ...new Set(
          (arg2 || [])
            .map((arg1) => String(arg1 ?? "").trim())
            .filter(Boolean),
        ),
      ];
      if (
        !set.length &&
        (!["electric-bed", "electric-bed-memory"].includes(variant) ||
          asString !== "select")
      ) {
        return;
      }
      const capabilityOptionGroupEl = document.createElement("section");
      capabilityOptionGroupEl.className = "hb-capability-option-group";
      const element = document.createElement("strong");
      element.textContent = arg;
      const capabilityOptionsEl = document.createElement("div");
      capabilityOptionsEl.className = "hb-capability-options";
      if (
        ["electric-bed", "electric-bed-memory"].includes(variant) &&
        asString === "select"
      ) {
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
        const menu = document.createElement("div");
        menu.className = "hb-electric-bed-select-menu";
        menu.id =
          "hb-bed-select-" +
          String(this.renderNamespace || "runtime").replace(
            /[^a-z0-9_-]/gi,
            "-",
          ) +
          "-" +
          entityId.replace(/[^a-z0-9_-]/gi, "-");
        menu.setAttribute("role", "listbox");
        menu.setAttribute("popover", "auto");
        menu.hidden = true;
        trigger.setAttribute("aria-controls", menu.id);
        let state4 = false;
        const computeResult = () => {
          try {
            return menu.matches(":popover-open");
          } catch {
            return menu.dataset.open === "true";
          }
        };
        const applyElementStyle = () => {
          if (!computeResult() && menu.hidden) {
            return;
          }
          const domRect = trigger.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const clamped = Math.min(
            Math.max(domRect.width, 150),
            Math.max(150, innerWidth - 20),
          );
          menu.style.width = clamped + "px";
          menu.style.maxHeight =
            Math.min(306, Math.max(96, innerHeight - 20)) + "px";
          const size = Math.min(menu.scrollHeight || 0, 306);
          const size1 = innerHeight - domRect.bottom - 10;
          const size2 = domRect.top - 10;
          const clamped1 =
            size1 < Math.min(size, 160) && size2 > size1
              ? Math.max(10, domRect.top - size - 5)
              : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          menu.style.left =
            Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) +
            "px";
          menu.style.top = Math.max(10, clamped1) + "px";
        };
        const closeMenu = () => {
          if (computeResult() && typeof menu.hidePopover == "function") {
            menu.hidePopover();
          }
          menu.hidden = true;
          menu.dataset.open = "false";
          trigger.setAttribute("aria-expanded", "false");
        };
        const syncAriaState = (arg1 = false) => {
          if (!trigger.disabled) {
            menu.hidden = false;
            if (typeof menu.showPopover == "function") {
              menu.showPopover();
            } else {
              menu.dataset.open = "true";
            }
            trigger.setAttribute("aria-expanded", "true");
            applyElementStyle();
            if (arg1) {
              (
                menu.querySelector('[aria-selected="true"]') ||
                menu.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const invokeEntityService = async (arg1) => {
          if (!interactive || state4 || !arg1 || runHelper1()) {
            return;
          }
          const state5 = entityState;
          state4 = true;
          closeMenu();
          entityState = {
            ...entityState,
            state: service === "select_option" ? arg1 : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: arg1,
            },
          };
          runHelper2(entityState);
          try {
            await this.callEntityService(arg6, service, entityId, {
              [dataKey]: arg1,
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
          menu.replaceChildren(
            ...electricBedSelectOptionEl.map((electricBedSelectOptionEl2) => {
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
            }),
          );
          const state5 = electricBedSelectOptionEl.includes(String(electricBedSelectOptionEl1 ?? ""))
            ? String(electricBedSelectOptionEl1)
            : electricBedSelectOptionEl[0] || "读取中…";
          element2.textContent = state5;
          element2.title = state5;
        };
        trigger.addEventListener("click", () => {
          if (computeResult() || menu.dataset.open === "true") {
            closeMenu();
          } else {
            syncAriaState();
          }
        });
        trigger.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState(true);
          }
        });
        menu.addEventListener("keydown", (event) => {
          const matchedEl = [...menu.querySelectorAll('[role="option"]')];
          const state5 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
            trigger.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state6 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[
              (state5 + state6 + matchedEl.length) % matchedEl.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        menu.addEventListener("toggle", (arg1) => {
          const state5 = arg1.newState === "open";
          menu.hidden = !state5;
          menu.dataset.open = String(state5);
          trigger.setAttribute("aria-expanded", String(state5));
          if (state5) {
            applyElementStyle();
          }
        });
        electricBedSelectEl.append(trigger, menu);
        capabilityOptionGroupEl.append(element, electricBedSelectEl);
        capabilityDetailsControlsEl.append(capabilityOptionGroupEl);
        state2.push({
          type: "bed-select",
          service,
          dataKey,
          trigger,
          menu,
          renderOptions,
          closeMenu,
          isPending: () => state4,
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
          silent: "静音",
        };
        element2.textContent =
          variant === "air-purifier" && arg === "运行模式"
            ? state4[item.toLowerCase()] || item
            : asString === "fan" &&
                state === "bath-heater" &&
                arg === "运行模式"
              ? climateModeLabel(item, "bath-heater", state1)
              : item;
        element2.dataset.value = item;
        element2.classList.toggle("active", item === String(arg3 ?? ""));
        element2.addEventListener("click", async () => {
          if (!interactive) {
            return;
          }
          buttons.forEach((arg1) => {
            arg1.disabled = true;
          });
          const state5 = entityState;
          entityState = {
            ...entityState,
            state: service === "select_option" ? item : entityState.state,
            attributes: {
              ...runHelper(),
              [dataKey]: item,
            },
          };
          runHelper2(entityState);
          try {
            await this.callEntityService(arg6, service, entityId, {
              [dataKey]: item,
            });
          } catch (error) {
            entityState = state5;
            runHelper2(state5);
            this.options.onError?.(error);
          } finally {
            buttons.forEach((arg1) => {
              arg1.disabled = false;
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
        buttons,
      });
    };
    const numeric = Number(runHelper().percentage);
    if (asString === "fan" && Number.isFinite(numeric)) {
      if (variant === "air-purifier") {
        const capabilityOptionGroupEl = document.createElement("section");
        capabilityOptionGroupEl.className =
          "hb-capability-option-group hb-air-purifier-speed-group";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const capabilityOptionsEl = document.createElement("div");
        capabilityOptionsEl.className =
          "hb-capability-options hb-air-purifier-speed-options";
        const buttons = [
          {
            label: "低",
            value: 33,
          },
          {
            label: "中",
            value: 66,
          },
          {
            label: "高",
            value: 100,
          },
        ].map((element2) => {
          const element3 = document.createElement("button");
          element3.type = "button";
          element3.textContent = element2.label;
          element3.dataset.percentage = String(element2.value);
          element3.addEventListener("click", async () => {
            if (!interactive || runHelper1()) {
              return;
            }
            buttons.forEach((arg) => {
              arg.disabled = true;
            });
            const state4 = entityState;
            entityState = {
              ...entityState,
              attributes: {
                ...runHelper(),
                percentage: element2.value,
              },
            };
            runHelper2(entityState);
            try {
              await this.callEntityService("fan", "set_percentage", entityId, {
                percentage: element2.value,
              });
            } catch (error) {
              entityState = state4;
              runHelper2(state4);
              this.options.onError?.(error);
            } finally {
              buttons.forEach((arg) => {
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
          buttons,
        });
      } else {
        const capabilityRangeGroupEl = document.createElement("section");
        capabilityRangeGroupEl.className = "hb-capability-range-group";
        const capabilityRangeHeadingEl = document.createElement("div");
        capabilityRangeHeadingEl.className = "hb-capability-range-heading";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const output = document.createElement("output");
        capabilityRangeHeadingEl.append(element, output);
        const input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = "100";
        input.step = "1";
        input.value = String(numeric);
        input.addEventListener("change", async () => {
          if (!interactive || runHelper1()) {
            return;
          }
          input.disabled = true;
          const state4 = entityState;
          const percentage = Number(input.value);
          entityState = {
            ...entityState,
            attributes: {
              ...runHelper(),
              percentage,
            },
          };
          runHelper2(entityState);
          try {
            await this.callEntityService("fan", "set_percentage", entityId, {
              percentage,
            });
          } catch (error) {
            entityState = state4;
            runHelper2(state4);
            this.options.onError?.(error);
          } finally {
            input.disabled = false;
          }
        });
        capabilityRangeGroupEl.append(capabilityRangeHeadingEl, input);
        capabilityDetailsControlsEl.append(capabilityRangeGroupEl);
        state2.push({
          type: "range",
          input,
          output,
          dataKey: "percentage",
        });
      }
    }
    if (asString === "fan") {
      createChildElement(
        "运行模式",
        runHelper().preset_modes,
        runHelper().preset_mode,
        "set_preset_mode",
        "preset_mode",
      );
    }
    if (asString === "select") {
      createChildElement(
        selectLabel,
        runHelper().options,
        entityState?.state,
        "select_option",
        "option",
        "select",
      );
    }
    if (["number", "input_number"].includes(asString)) {
      const finiteNumber = Number.isFinite(Number(runHelper().min)) ? Number(runHelper().min) : 0;
      const capabilityRangeGroupEl = Number.isFinite(Number(runHelper().max))
        ? Number(runHelper().max)
        : 100;
      const capabilityRangeGroupEl1 =
        Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0
          ? Number(runHelper().step)
          : 1;
      const capabilityRangeGroupEl2 = document.createElement("section");
      capabilityRangeGroupEl2.className = "hb-capability-range-group";
      const capabilityRangeHeadingEl = document.createElement("div");
      capabilityRangeHeadingEl.className = "hb-capability-range-heading";
      const element = document.createElement("strong");
      element.textContent = runHelper().unit_of_measurement
        ? "数值（" + runHelper().unit_of_measurement + "）"
        : "数值";
      const output = document.createElement("output");
      capabilityRangeHeadingEl.append(element, output);
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(finiteNumber);
      input.max = String(capabilityRangeGroupEl);
      input.step = String(capabilityRangeGroupEl1);
      input.value = String(Number(entityState?.state) || finiteNumber);
      input.addEventListener("change", async () => {
        if (!interactive || runHelper1()) {
          return;
        }
        input.disabled = true;
        const state4 = entityState;
        const asNumber = Number(input.value);
        entityState = {
          ...entityState,
          state: String(asNumber),
        };
        runHelper2(entityState);
        try {
          await this.callEntityService(asString, "set_value", entityId, {
            value: asNumber,
          });
        } catch (error) {
          entityState = state4;
          runHelper2(state4);
          this.options.onError?.(error);
        } finally {
          input.disabled = false;
        }
      });
      capabilityRangeGroupEl2.append(capabilityRangeHeadingEl, input);
      capabilityDetailsControlsEl.append(capabilityRangeGroupEl2);
      state2.push({
        type: "range",
        input,
        output,
        dataKey: "state",
      });
    }
    function runHelper2(arg) {
      entityState = arg || entityState;
      const asString1 = String(entityState?.state || "").toLowerCase();
      const state4 =
        asString === "fan"
          ? !["off", "unknown", "unavailable"].includes(asString1)
          : asString1 === "on";
      const state5 = variant !== "air-purifier" || state4;
      if (state3) {
        lowered.sync(state4, {
          unavailable: runHelper1(),
        });
      }
      for (const item of state2) {
        if (item.type === "options") {
          const state6 =
            item.service === "select_option"
              ? entityState?.state
              : runHelper()[item.dataKey];
          item.buttons.forEach((element) =>
            element.classList.toggle(
              "active",
              state5 && element.dataset.value === String(state6 ?? ""),
            ),
          );
        } else if (item.type === "bed-select") {
          const set = [
            ...new Set(
              (runHelper().options || [])
                .map((arg1) => String(arg1 ?? "").trim())
                .filter(Boolean),
            ),
          ];
          const state6 =
            item.service === "select_option"
              ? entityState?.state
              : runHelper()[item.dataKey];
          item.renderOptions(set, state6);
          item.trigger.disabled =
            !interactive || item.isPending() || !set.length || runHelper1();
          if (item.trigger.disabled) {
            item.closeMenu();
          }
        } else if (item.type === "select") {
          const set = [
            ...new Set(
              (runHelper().options || [])
                .map((arg1) => String(arg1 ?? "").trim())
                .filter(Boolean),
            ),
          ];
          if (set.length) {
            const mapped = [...item.input.options].map(
              (element) => element.value,
            );
            if (
              mapped.length !== set.length ||
              mapped.some((arg1, arg2) => arg1 !== set[arg2])
            ) {
              item.input.replaceChildren(
                ...set.map((arg1) => {
                  const element = document.createElement("option");
                  element.value = arg1;
                  element.textContent = arg1;
                  return element;
                }),
              );
            }
          }
          const state6 =
            item.service === "select_option"
              ? entityState?.state
              : runHelper()[item.dataKey];
          if (
            state6 != null &&
            [...item.input.options].some(
              (element) => element.value === String(state6),
            )
          ) {
            item.input.value = String(state6);
          }
          item.input.disabled = !interactive || !set.length || runHelper1();
        } else if (item.type === "percentage-options") {
          const numeric2 = Number(runHelper().percentage);
          const finiteNumber =
            numeric2 <= 0 || !Number.isFinite(numeric2)
              ? 0
              : numeric2 <= 49
                ? 33
                : numeric2 <= 82
                  ? 66
                  : 100;
          item.buttons.forEach((element) =>
            element.classList.toggle(
              "active",
              state5 && Number(element.dataset.percentage) === finiteNumber,
            ),
          );
        } else {
          if (["number", "input_number"].includes(asString)) {
            const finiteNumber = Number.isFinite(Number(runHelper().min))
              ? Number(runHelper().min)
              : 0;
            const finiteNumber1 = Number.isFinite(Number(runHelper().max))
              ? Number(runHelper().max)
              : 100;
            const finiteNumber2 =
              Number.isFinite(Number(runHelper().step)) && Number(runHelper().step) > 0
                ? Number(runHelper().step)
                : 1;
            item.input.min = String(finiteNumber);
            item.input.max = String(finiteNumber1);
            item.input.step = String(finiteNumber2);
          }
          const state6 =
            item.dataKey === "state"
              ? Number(entityState?.state)
              : Number(runHelper()[item.dataKey]);
          if (Number.isFinite(state6)) {
            item.input.value = String(state6);
          }
          item.output.textContent = Number.isFinite(state6)
            ? "" + state6 + (runHelper().unit_of_measurement || "%")
            : "--";
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
  showCapabilityDetails(
    component,
    { preview = false, title = "" } = {},
  ) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const entityState = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId,
        state: "unknown",
        attributes: {},
      };
    const entityDetailsDialogEl = this.deviceProfile(entityId);
    const entityDetailsDialogEl1 = entityDetailsDialogEl?.deviceType === "air-purifier";
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog capability-details" +
      (entityDetailsDialogEl1 ? " air-purifier-details" : "");
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent =
      title ||
      component.properties?.label ||
      entityState.attributes?.friendly_name ||
      entityId;
    const element2 = document.createElement("span");
    element2.textContent =
      entityState.state === "unavailable" ? "当前不可用" : "设备控制";
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
      variant: entityDetailsDialogEl1 ? "air-purifier" : "",
    });
    capabilityDetailsBodyEl.append(state);
    entityDetailsCardEl.append(entityDetailsHeadingEl, capabilityDetailsBodyEl);
    dialog.append(entityDetailsCardEl);
    const temperature = {
      pm25: "PM2.5",
      airQuality: "空气质量",
      temperature: "温度",
      humidity: "湿度",
      filterLife: "滤芯寿命",
    };
    const filtered = entityDetailsDialogEl1
      ? ["pm25", "airQuality", "temperature", "humidity", "filterLife"]
          .map((role) => ({
            role,
            id: entityDetailsDialogEl.roles?.[role],
          }))
          .filter(({ id }) => id)
          .map(({ role, id }) => ({
            role,
            item: this.entityMetadata.get(id),
          }))
          .filter(
            ({ item }) =>
              ["sensor", "binary_sensor"].includes(item?.domain) &&
              entityMetadataIsAvailable(item),
          )
          .slice(0, 5)
      : [];
    const index = new Map();
    if (filtered.length) {
      const capabilityMetricsEl = document.createElement("div");
      capabilityMetricsEl.className = "hb-capability-metrics";
      for (const { role, item } of filtered) {
        const capabilityMetricEl = document.createElement("div");
        capabilityMetricEl.className =
          "hb-capability-metric hb-capability-metric--" + role;
        const element4 = document.createElement("small");
        element4.textContent =
          temperature[role] ||
          item.name ||
          item.originalName ||
          item.entityId;
        const rendererRuntimeDialogLayerEl1 = document.createElement("strong");
        capabilityMetricEl.append(element4, rendererRuntimeDialogLayerEl1);
        capabilityMetricsEl.append(capabilityMetricEl);
        index.set(item.entityId, rendererRuntimeDialogLayerEl1);
      }
      capabilityDetailsBodyEl.prepend(capabilityMetricsEl);
    }
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    const lowered = (arg) => {
      state.syncCapabilityState?.(arg);
      element2.textContent = ["unknown", "unavailable"].includes(
        String(arg?.state || "").toLowerCase(),
      )
        ? "当前不可用"
        : "设备控制";
    };
    const handlers = new Map([[entityId, [lowered]]]);
    for (const { item } of filtered) {
      const runHelper = (entityState1) => {
        const element4 = index.get(item.entityId);
        if (element4) {
          element4.textContent =
            entityState1?.state === "unknown" || entityState1?.state === "unavailable"
              ? "--"
              : (
                  (entityState1?.state ?? "--") +
                  " " +
                  (entityState1?.attributes?.unit_of_measurement || "")
                ).trim();
        }
      };
      runHelper(
        this.states.get(item.entityId)?.newState ||
          this.states.get(item.entityId),
      );
      handlers.set(item.entityId, [runHelper]);
    }
    this.detailsStateSync = {
      dialog,
      handlers,
    };
    this.registerRuntimeDialogScale(
      rendererRuntimeDialogLayerEl,
      dialog,
      entityDetailsDialogEl1 ? 620 : 560,
      entityDetailsDialogEl1 ? 560 : 500,
    );
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        state.cleanupCapabilityDetails?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showAirPurifierDetails(
    component,
    { preview = false, title = "" } = {},
  ) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const state = this.deviceProfile(entityId);
    const state1 = selectedRelatedEntityIds(component);
    let entityDetailsDialogEl = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId,
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog air-purifier-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent =
      title ||
      componentDialogTitle(
        component,
        entityDetailsDialogEl.attributes?.friendly_name || "空气净化器",
      );
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
      variant: "air-purifier",
    });
    const airPurifierControlsPaneEl1 = document.createElement("section");
    airPurifierControlsPaneEl1.className = "hb-air-purifier-controls-pane";
    airPurifierControlsPaneEl1.append(airPurifierControlsPaneEl);
    airPurifierLayoutEl.append(airPurifierSummaryEl, airPurifierControlsPaneEl1);
    entityDetailsCardEl.append(entityDetailsHeadingEl, airPurifierLayoutEl);
    dialog.append(entityDetailsCardEl);
    const state2 = [
      {
        key: "pm25",
        label: "PM2.5",
        roles: ["pm25"],
      },
      {
        key: "pm10",
        label: "PM10",
        roles: ["pm10"],
      },
      {
        key: "hcho",
        label: "甲醛",
        roles: ["hcho"],
      },
      {
        key: "filter",
        label: "滤芯寿命",
        roles: ["filterLife", "filterLeftTime"],
      },
      {
        key: "temperature",
        label: "温度",
        roles: ["temperature"],
      },
      {
        key: "humidity",
        label: "湿度",
        roles: ["humidity"],
      },
    ]
      .map((arg) => ({
        ...arg,
        candidates: arg.roles
          .map((role) => ({
            role,
            id: state?.roles?.[role],
          }))
          .filter(
            ({ id }, arg2, arg3) =>
              id &&
              arg3.findIndex((arg1) => arg1.id === id) ===
                arg2,
          )
          .map((candidates) => ({
            ...candidates,
            item: this.entityMetadata.get(candidates.id),
          }))
          .filter(
            ({ item: candidates }) =>
              candidates?.domain === "sensor" &&
              entityMetadataIsAvailable(candidates),
          ),
      }))
      .filter(({ candidates }) => candidates.length);
    const runHelper = (arg) => {
      const numeric = Number(arg?.state);
      if (
        ["unknown", "unavailable"].includes(
          String(arg?.state || "").toLowerCase(),
        ) ||
        !Number.isFinite(numeric)
      ) {
        return null;
      } else {
        return numeric;
      }
    };
    const runHelper1 = (entityId1) =>
      this.states.get(entityId1?.id)?.newState ||
      this.states.get(entityId1?.id) ||
      null;
    const runHelper2 = (airPurifierSecondaryMetricEl1) =>
      airPurifierSecondaryMetricEl1.candidates.find((airPurifierSecondaryMetricEl2) => runHelper(runHelper1(airPurifierSecondaryMetricEl2)) != null) ||
      airPurifierSecondaryMetricEl1.candidates[0] ||
      null;
    const airPurifierSecondaryMetricEl = Array.from(
      {
        length: 3,
      },
      () => {
        const item = document.createElement("div");
        item.className = "hb-air-purifier-secondary-metric";
        const label = document.createElement("small");
        const strongEl1 = document.createElement("strong");
        item.append(label, strongEl1);
        airPurifierSecondaryMetricsEl.append(item);
        return {
          item,
          label,
          value: strongEl1,
        };
      },
    );
    airPurifierSecondaryMetricsEl.hidden = true;
    const state3 = {
      pm25: "μg/m³",
      pm10: "μg/m³",
      hcho: "mg/m³",
      filterLife: "%",
      filterLeftTime: "h",
      temperature: "°C",
      humidity: "%",
    };
    const runHelper3 = (entityState, arg2) => {
      if (
        ["unknown", "unavailable"].includes(
          String(entityState?.state || "").toLowerCase(),
        )
      ) {
        return "--";
      }
      const state9 = {
        hours: "小时",
        hour: "小时",
        days: "天",
        day: "天",
      };
      const entityState1 =
        entityState?.attributes?.unit_of_measurement || state3[arg2] || "";
      const lowered = state9[String(entityState1).toLowerCase()] || entityState1;
      return "" + (entityState?.state ?? "--") + (lowered ? " " + lowered : "");
    };
    const handlers = new Map();
    const runHelper4 = (arg, arg2) => {
      if (arg) {
        if (!handlers.has(arg)) {
          handlers.set(arg, []);
        }
        handlers.get(arg).push(arg2);
      }
    };
    const mapped = state2.flatMap((arg) =>
      arg.candidates.map((arg1) => arg1.id),
    );
    const state4 = state?.roles?.airQuality || "";
    const state5 =
      state1 !== null
        ? this.createWaterHeaterExtensionControls(entityId, {
            component,
            interactive: !preview,
            excludedEntityIds: [...mapped, ...(state4 ? [state4] : [])],
          })
        : null;
    if (state5) {
      entityDetailsCardEl.append(state5);
      dialog.classList.add("has-related-extensions");
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
      very_poor: "很差",
    };
    let state7 = state4
      ? this.states.get(state4)?.newState || this.states.get(state4)
      : null;
    let state8 = false;
    const found = state2.find((arg) => arg.key === "pm25");
    const runHelper5 = () => {
      const state9 = found ? runHelper2(found) : null;
      const state10 = runHelper(runHelper1(state9));
      if (state10 == null) {
        return {
          text: "--",
          level: "unknown",
        };
      } else if (state10 <= 35) {
        return {
          text: "空气优",
          level: "excellent",
        };
      } else if (state10 <= 75) {
        return {
          text: "空气良",
          level: "good",
        };
      } else if (state10 <= 115) {
        return {
          text: "轻度污染",
          level: "warning",
        };
      } else {
        return {
          text: "空气较差",
          level: "poor",
        };
      }
    };
    const applyElementStyle = () => {
      const asString = String(state7?.state || "").trim();
      const lowered = asString.toLowerCase();
      let localValue = ["unknown", "unavailable", ""].includes(lowered)
        ? ""
        : state6[lowered] || asString;
      let localValue1 = "good";
      if (localValue) {
        if (
          /very.?poor|severe|很差|重度|严重/.test(lowered) ||
          /poor|unhealthy|较差|中度/.test(lowered)
        ) {
          localValue1 = "poor";
        } else if (/moderate|fair|一般|轻度|污染/.test(lowered)) {
          localValue1 = "warning";
        } else if (/excellent|优/.test(lowered)) {
          localValue1 = "excellent";
        }
      } else {
        ({ text: localValue, level: localValue1 } = runHelper5());
      }
      element9.textContent = localValue || "--";
      element10.textContent = "";
      element6.style.setProperty(
        "--hb-air-purifier-progress",
        {
          excellent: 72,
          good: 58,
          warning: 42,
          poor: 26,
          unknown: 0,
        }[localValue1] + "%",
      );
      element6.classList.toggle("is-warning", localValue1 === "warning");
      element6.classList.toggle("is-poor", localValue1 === "poor");
      const state9 =
        {
          excellent: "#76cfa1",
          good: "#76cfa1",
          warning: "#e4b15f",
          poor: "#db7770",
          unknown: "#7d8990",
        }[localValue1] || "#76cfa1";
      const color =
        {
          excellent: "rgba(118,207,161,.13)",
          good: "rgba(118,207,161,.13)",
          warning: "rgba(228,177,95,.15)",
          poor: "rgba(219,119,112,.15)",
          unknown: "rgba(125,137,144,.13)",
        }[localValue1] || "rgba(118,207,161,.13)";
      dialog.style.setProperty("--hb-air-purifier-accent", state9);
      dialog.style.setProperty("--hb-air-purifier-accent-soft", color);
    };
    const runHelper6 = (arg) => {
      state7 = arg;
      applyElementStyle();
    };
    const syncVisualState = (arg) => {
      entityDetailsDialogEl = arg || entityDetailsDialogEl;
      const asString = String(entityDetailsDialogEl?.state || "").toLowerCase();
      const state9 = ["unknown", "unavailable"].includes(asString);
      const state10 = !state9 && asString !== "off";
      state8 = state10;
      element4.textContent = state10 ? "ON" : "OFF";
      element2.textContent = state9
        ? "当前不可用"
        : state10
          ? "已开启"
          : "已关闭";
      element11.textContent = state9
        ? "设备不可用"
        : state10
          ? "净化中"
          : "已关闭";
      element2.classList.toggle("is-on", state10);
      element3.classList.toggle("is-on", state10);
      element3.classList.toggle("is-unavailable", state9);
      element6.classList.toggle("is-running", state10);
      element7.classList.toggle("is-running", state10);
      element3.setAttribute("aria-pressed", String(state10));
      airPurifierControlsPaneEl.syncCapabilityState?.(entityDetailsDialogEl);
    };
    const runHelper7 = () => {
      const filtered = state2
        .map((metric) => ({
          metric,
          selected: runHelper2(metric),
        }))
        .filter(({ selected }) => runHelper(runHelper1(selected)) != null)
        .slice(0, airPurifierSecondaryMetricEl.length);
      airPurifierSecondaryMetricEl.forEach((element12, arg2) => {
        const state9 = filtered[arg2];
        element12.item.hidden = !state9;
        element12.item.className =
          "hb-air-purifier-secondary-metric" +
          (state9
            ? " hb-air-purifier-secondary-metric--" + state9.metric.key
            : "");
        if (!state9) {
          element12.label.textContent = "";
          element12.value.textContent = "";
          return;
        }
        const state10 = state9.selected?.role || state9.metric.key;
        element12.label.textContent =
          state9.metric.key === "filter" && state10 === "filterLeftTime"
            ? "滤芯剩余时间"
            : state9.metric.label;
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
    element3.addEventListener("click", () =>
      airPurifierControlsPaneEl.querySelector(".hb-capability-power")?.click(),
    );
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog,
      handlers,
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, 920, state5 ? 620 : 540);
    element5.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        airPurifierControlsPaneEl.cleanupCapabilityDetails?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showMediaPlayerDetails(component, { preview = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    let entityDetailsDialogEl = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId,
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog media-player-details capability-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      entityDetailsDialogEl.attributes?.friendly_name || "媒体",
    );
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
    const buildElementTree = (arg, arg2, arg3 = {}) => {
      const element14 = document.createElement("button");
      element14.type = "button";
      element14.textContent = arg;
      element14.addEventListener("click", async () => {
        if (!preview) {
          element14.disabled = true;
          try {
            await this.callEntityService(
              "media_player",
              arg2,
              entityId,
              arg3,
            );
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
      preview,
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
    const runHelper = (arg) => {
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
    const runHelper1 = (arg, arg2) =>
      Number.isFinite(arg) &&
      Number.isFinite(arg2) &&
      Math.abs(arg - arg2) <= 0.005;
    const clampNumber1 = (arg) => {
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
          volume_level,
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
    const syncVisualState = (arg) => {
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
        unknown: "未知状态",
      };
      const asString = String(entityDetailsDialogEl.state || "unknown").toLowerCase();
      const numeric = Number(numeric1.supported_features || 0);
      capabilityRangeGroupEl2.sync(entityDetailsDialogEl);
      element2.textContent = state7[asString] || entityDetailsDialogEl.state || "未知状态";
      element3.classList.toggle("is-playing", asString === "playing");
      element3.classList.toggle("is-paused", asString === "paused");
      element3.classList.toggle(
        "is-off",
        ["off", "unavailable", "unknown"].includes(asString),
      );
      element5.textContent =
        numeric1.media_title ||
        numeric1.media_series_title ||
        numeric1.app_name ||
        numeric1.source ||
        "暂无播放内容";
      element6.textContent =
        [numeric1.media_artist, numeric1.media_album_name]
          .filter(Boolean)
          .join(" · ") ||
        numeric1.media_content_type ||
        "媒体播放器";
      element10.textContent = asString === "playing" ? "暂停" : "播放";
      element10.disabled =
        preview || ["off", "unavailable", "unknown"].includes(asString);
      capabilityRangeGroupEl.disabled = preview || !(numeric & 16);
      capabilityRangeGroupEl1.disabled = preview || !(numeric & 32);
      state1 = Number.isFinite(Number(numeric1.media_duration))
        ? Number(numeric1.media_duration)
        : null;
      state2 = Number.isFinite(Number(numeric1.media_position))
        ? Number(numeric1.media_position)
        : 0;
      const position = Date.parse(
        String(numeric1.media_position_updated_at || ""),
      );
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
      const trimmed =
        [
          numeric1.entity_picture_local,
          numeric1.entity_picture,
          numeric1.media_image_url,
        ]
          .map((arg1) => String(arg1 || "").trim())
          .find(
            (arg1) =>
              arg1.startsWith("/api/media_player_proxy/") ||
              arg1.startsWith("/api/image_proxy/"),
          ) || "";
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
    dialog.append(entityDetailsCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog,
      handlers: new Map([[entityId, [syncVisualState]]]),
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, 540, 368);
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    let dialog1 = null;
    dialog.addEventListener(
      "close",
      () => {
        dialog1?.cancel();
        capabilityRangeGroupEl2.cleanup?.();
        window.clearInterval(state5);
        window.clearTimeout(showMediaPlayerDetailsValue6);
        window.clearTimeout(state);
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
    dialog1 = playMediaSpeakerEntrance(element3);
  }
  showCustomPopup(popupId, { preview = false } = {}) {
    this.closeRuntimeDialog();
    this.historyPopupGeneration += 1;
    this.activePopupId = String(popupId?.id || "");
    this.connectRuntime();
    const dialog = document.createElement("dialog");
    dialog.className = "hb-custom-popup-dialog";
    const customPopupCardEl = document.createElement("div");
    customPopupCardEl.className = "hb-custom-popup-card";
    const state = popupId.modules || [];
    const popupMetrics = popupLayoutMetrics(state, popupId.layout);
    const popupWidth = popupMetrics.popupWidth;
    const popupHeight = popupMetrics.popupHeight;
    dialog.dataset.runtimeDialogLayout =
      popupMetrics.rows === 1 && popupMetrics.columns === 2 ? "compact" : "fill";
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
    customPopupGridEl.style.gridTemplateColumns =
      "repeat(" + popupMetrics.columns + ", minmax(0, 1fr))";
    customPopupGridEl.style.gridTemplateRows =
      "repeat(" + popupMetrics.rows + ", minmax(0, 1fr))";
    const state1 = [];
    const state2 = [];
    const state3 = [];
    const state4 = [];
    const state5 = [];
    const handlers = new Map();
    const runHelper = (arg, arg2) => {
      if (!handlers.has(arg)) {
        handlers.set(arg, []);
      }
      handlers.get(arg).push(arg2);
    };
    for (const [entry, entry1] of state.entries()) {
      const component =
        entry1.type === "capability-device"
          ? {
              ...entry1,
              type: "generic",
            }
          : entry1;
      const text = String(component.entityId || "");
      const state7 = this.deviceProfile(text);
      const component2 = applyXiaomiDeviceProfile(
        {
          bindings: {
            entity: {
              entityId: component.entityId,
            },
          },
          properties: {
            ...(component.properties || {}),
            deviceType:
              component.deviceType ||
              component.properties?.deviceType ||
              "auto",
          },
        },
        state7,
      );
      const component3 = state7
        ? {
            ...component,
            properties: component2.properties,
            deviceType:
              component2.properties?.deviceType || component.deviceType,
          }
        : component;
      const size = popupMetrics.placements[entry] || {
        x: 0,
        y: entry,
        width: 1,
        height: 1,
      };
      const size1 = [
        "climate",
        "air-purifier",
        "water-heater",
        "media-player",
        "camera",
        "line-chart",
      ].includes(component3.type)
        ? 2
        : size.width;
      const entityId = text || component3.entityId;
      const customPopupModuleEl = this.states.get(entityId);
      const customPopupModuleEl1 = customPopupModuleEl?.newState || customPopupModuleEl;
      const element3 = document.createElement("section");
      element3.className =
        "hb-custom-popup-module hb-custom-popup-module--" +
        (component3.type || "generic");
      element3.style.gridColumn = size.x + 1 + " / span " + size1;
      element3.style.gridRow = size.y + 1 + " / span " + size.height;
      const element4 = document.createElement("div");
      element4.className = "hb-custom-popup-module-heading";
      const element5 = document.createElement("strong");
      element5.textContent = popupModuleDialogTitle(component3, customPopupModuleEl1);
      const element6 = document.createElement("span");
      element6.className =
        "hb-custom-popup-module-status type-" + (component3.type || "generic");
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
        generic: "设备",
      };
      element6.textContent = state8[component3.type] || state8.generic;
      element4.append(element5, element6);
      element3.append(element4);
      if (
        component3.type === "electric-bed" &&
        state7?.deviceType !== "electric-bed"
      ) {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const customElectricBedLoadingEl = document.createElement("section");
        customElectricBedLoadingEl.className =
          "hb-custom-electric-bed-loading hb-climate-details-loading is-loading";
        const iconEl = document.createElement("i");
        iconEl.setAttribute("aria-hidden", "true");
        const element7 = document.createElement("strong");
        element7.textContent = "正在加载设备状态…";
        customElectricBedLoadingEl.append(iconEl, element7);
        element3.append(customElectricBedLoadingEl);
      } else if (component3.type === "electric-bed") {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const state9 = (state7 || this.deviceProfile(entityId))?.roles || {};
        const resolveEntityId = (entityId2) => {
          const state10 = this.states.get(entityId2);
          return (
            state10?.newState ||
            state10 || {
              entityId: entityId2,
              state: "unknown",
              attributes: {},
            }
          );
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
            value: strongEl,
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
        const filtered = [state9.memory1, state9.memory2]
          .filter(Boolean)
          .slice(0, 2);
        const mapped = [
          ["backrest", "靠背角度", "back"],
          ["leg", "腿部角度", "legs"],
          ["waist", "腰部角度", "waist"],
        ]
          .map(([role, label, visualClass]) => ({
            role,
            label,
            visualClass,
            entityId: String(state9[role] || ""),
          }))
          .filter((electricBedControlEl1) => electricBedControlEl1.entityId);
        const syncVisualState = (electricBedControlEl1, electricBedControlEl2, electricBedControlEl3, variant = "") => {
          const electricBedControlEl4 = document.createElement("section");
          electricBedControlEl4.className = "hb-electric-bed-control";
          const element11 = document.createElement("strong");
          element11.textContent = electricBedControlEl2;
          const element12 = this.createCapabilityDetailsControls(
            electricBedControlEl3,
            resolveEntityId(electricBedControlEl3),
            {
              interactive: !preview,
              variant,
            },
          );
          element12.classList.add("hb-electric-bed-capability");
          electricBedControlEl4.append(element11, element12);
          electricBedControlEl1.append(electricBedControlEl4);
          state1.push(() => element12.cleanupCapabilityDetails?.());
          runHelper(electricBedControlEl3, (arg) => element12.syncCapabilityState?.(arg));
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
            syncVisualState(
              electricBedMemoryListEl,
              "记忆姿势 " + (state10 + 1),
              text3,
              "electric-bed-memory",
            );
            continue;
          }
          const element11 = document.createElement("button");
          element11.type = "button";
          element11.className = "hb-electric-bed-memory-button";
          element11.textContent =
            state11?.name ||
            state11?.originalName ||
            "记忆姿势 " + (state10 + 1);
          element11.disabled = preview || !text3;
          element11.addEventListener("click", async () => {
            if (!preview && !!text3 && !element11.disabled) {
              element11.disabled = true;
              try {
                await this.callEntityService("button", "press", text3);
                element11.classList.add("is-success");
                window.setTimeout(
                  () => element11.classList.remove("is-success"),
                  900,
                );
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
            waist: resolveEntityId(state9.waist),
          };
          const runHelper2 = (arg) => {
            const numeric = Number(arg?.state);
            if (Number.isFinite(numeric)) {
              return numeric;
            } else {
              return null;
            }
          };
          const applyElementStyle1 = (arg, _, element11) => {
            const state11 = runHelper2(state10[arg]);
            element11.textContent =
              state11 === null ? "--" : Math.round(state11) + "°";
            if (state11 !== null) {
              electricBedModelEl.style.setProperty(
                "--hb-bed-" +
                  (arg === "backrest" ? "backrest" : arg) +
                  "-angle",
                state11 + "deg",
              );
            }
          };
          applyElementStyle1("backrest", electricBedModelEl, element7.value);
          applyElementStyle1("waist", electricBedModelEl, element8.value);
          applyElementStyle1("leg", electricBedModelEl, element9.value);
          element6.textContent = "已连接";
        };
        for (const item of [
          state9.backrest,
          state9.leg,
          state9.waist,
        ].filter(Boolean)) {
          runHelper(item, applyElementStyle);
        }
        applyElementStyle();
        customElectricBedBodyEl.append(electricBedControlEl, electricBedVisualEl, electricBedMemoryEl, electricBedAngleControlsEl);
        element3.append(customElectricBedBodyEl);
      } else if (component3.type === "camera") {
        const element7 = document.createElement("section");
        element7.className =
          "hb-camera-device-visual hb-custom-camera-device-visual";
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
        const runHelper2 = (arg, arg2 = 0) =>
          "translateX(-50%) perspective(260px) rotateY(" +
          arg +
          "deg) rotateZ(" +
          arg * 0.035 +
          "deg) translateY(" +
          arg2 +
          "px)";
        const filtered = () => {
          if (!cameraDeviceBodyEl.isConnected) {
            return;
          }
          const filtered1 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(
            (arg) => Math.abs(arg - state11) >= 7,
          );
          const state12 =
            filtered1[Math.floor(Math.random() * filtered1.length)] ?? 0;
          const state13 = Math.sign(state12 - state11) || 1;
          const state14 = Math.abs(state12 - state11);
          const duration = Math.round(430 + state14 * 18 + Math.random() * 320);
          const state15 = state12 + state13 * (1.4 + Math.random() * 2.2);
          const state16 = Math.random() * 1.4 - 0.7;
          cameraDeviceLensEl.style.setProperty(
            "--hb-camera-lens-shift",
            (state12 / 23) * 2.5 + "px",
          );
          state10?.cancel();
          state10 = cameraDeviceBodyEl.animate(
            [
              {
                transform: runHelper2(state11, 0),
                offset: 0,
              },
              {
                transform: runHelper2(state15, state16),
                offset: 0.78,
              },
              {
                transform: runHelper2(state12, state16 * 0.35),
                offset: 1,
              },
            ],
            {
              duration,
              easing: "cubic-bezier(.2,.72,.22,1)",
              fill: "forwards",
            },
          );
          state10.addEventListener(
            "finish",
            () => {
              state11 = state12;
              cameraDeviceBodyEl.style.transform = runHelper2(state11, state16 * 0.35);
              state10?.cancel();
              state10 = null;
              const state17 =
                Math.random() < 0.22
                  ? 180 + Math.random() * 260
                  : 680 + Math.random() * 1500;
              state9 = window.setTimeout(filtered, state17);
            },
            {
              once: true,
            },
          );
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
        placeholder.textContent = preview
          ? "预览模式不获取实时画面"
          : "正在载入摄像头实时预览";
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
              container.classList.remove(
                "is-connecting",
                "is-unavailable",
                "is-revealing",
              );
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
            cleanup: (cleanup) => state1.push(cleanup),
          });
        }
        element3.append(container);
      } else if (component3.type === "line-chart") {
        const component4 = {
          type: "line-chart",
          bindings: {
            entity: {
              entityId,
            },
          },
          properties: {
            ...syncedLineChartProperties(
              this.document,
              this.page,
              entityId,
              component3.properties,
            ),
            compactDetailsHorizontal: true,
          },
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
        const syncAriaState = (entityState) => {
          const state13 = Number.parseFloat(entityState?.state);
          element7.textContent = Number.isFinite(state13)
            ? formatLineChartValue(
                state13,
                component4.properties?.statePrecision,
              )
            : entityState?.state || "--";
          element8.textContent = String(
            entityState?.attributes?.unit_of_measurement || "",
          );
          customLineChartCurrentEl.setAttribute(
            "aria-label",
            "当前数值 " + element7.textContent + element8.textContent,
          );
        };
        const state9 = {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace + "-" + component3.id,
          interactive: true,
          animate: false,
        };
        let state10 = renderLineChartDetails(component4, state9);
        let state11 = 0;
        const state12 = () => {
          state11 = 0;
          if (
            !state10?.isConnected ||
            this.detailsStateSync?.dialog !== dialog
          ) {
            return;
          }
          const state13 = renderLineChartDetails(component4, state9);
          state10.cleanupLineChartHover?.();
          state10.replaceWith(state13);
          state10 = state13;
          applyElementStyle();
        };
        const scheduleTimeout = (arg = 700) => {
          state11 ||= window.setTimeout(
            state12,
            Math.max(0, Number(arg) || 0),
          );
        };
        state5.push(() => scheduleTimeout(0));
        const applyElementStyle = () => {
          customLineChartCurrentEl.style.setProperty(
            "--hb-custom-chart-accent",
            state10.style.getPropertyValue("--hb-chart-current-color") ||
              "#68cc3e",
          );
        };
        syncAriaState(customPopupModuleEl1);
        applyElementStyle();
        runHelper(entityId, (arg) => {
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
          onToggle: () => state12?.(),
        });
        switchVisual.visual.classList.add("hb-custom-switch-visual");
        const syncVisualState = (arg) => {
          state9 = arg;
          const unavailable =
            !arg?.state ||
            ["unknown", "unavailable"].includes(arg.state);
          const state13 = !momentary && arg?.state === "on";
          switchVisual.sync(state13, {
            unavailable,
            pending: state10 && state11 !== "success",
            success: state11 === "success",
          });
          element6.textContent = unavailable
            ? "当前不可用"
            : momentary
              ? state11 === "success"
                ? "执行成功"
                : state10
                  ? "正在执行"
                  : "按下执行"
              : state13
                ? "已开启"
                : "已关闭";
          element6.classList.toggle(
            "is-live",
            (momentary ? state10 || state11 === "success" : state13) &&
              !unavailable,
          );
        };
        state12 = async () => {
          if (
            preview ||
            state10 ||
            ["unknown", "unavailable"].includes(state9?.state)
          ) {
            return;
          }
          const state13 = state9;
          state10 = true;
          state11 = "idle";
          syncVisualState(
            momentary
              ? state13
              : {
                  ...state13,
                  state: state13?.state === "on" ? "off" : "on",
                },
          );
          try {
            if (momentary) {
              await this.callEntityService("button", "press", entityId);
              state11 = "success";
              syncVisualState(state9);
              await new Promise((arg) => window.setTimeout(arg, 900));
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
        const finiteNumber =
          Number(numeric.min_color_temp_kelvin) ||
          (Number.isFinite(Number(numeric.max_mireds))
            ? 1000000 / Number(numeric.max_mireds)
            : 2000);
        const finiteNumber1 =
          Number(numeric.max_color_temp_kelvin) ||
          (Number.isFinite(Number(numeric.min_mireds))
            ? 1000000 / Number(numeric.min_mireds)
            : 6500);
        const finiteNumber2 =
          Number(numeric.color_temp_kelvin) ||
          (Number.isFinite(Number(numeric.color_temp))
            ? 1000000 / Number(numeric.color_temp)
            : NaN);
        const finiteNumber3 = {
          isOn: customPopupModuleEl1?.state === "on",
          brightnessPercent: Number.isFinite(Number(numeric.brightness))
            ? (Number(numeric.brightness) / 255) * 100
            : 100,
          colorTemperatureKelvin: Number.isFinite(finiteNumber2)
            ? finiteNumber2
            : (finiteNumber + finiteNumber1) / 2,
          colorRgb:
            temperature && Array.isArray(numeric.rgb_color)
              ? numeric.rgb_color
                  .slice(0, 3)
                  .map((colorRgb) => Number(colorRgb) || 0)
              : temperature && Array.isArray(numeric.hs_color)
                ? hsToRgbColor(numeric.hs_color)
                : null,
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
            finiteNumber3.brightnessPercent =
              (Number(numeric1.brightness) / 255) * 100;
          }
          if (Number.isFinite(Number(entityState.colorTemperatureKelvin))) {
            finiteNumber3.colorTemperatureKelvin = Number(
              entityState.colorTemperatureKelvin,
            );
          } else if (Number.isFinite(Number(numeric1.color_temp_kelvin))) {
            finiteNumber3.colorTemperatureKelvin = Number(numeric1.color_temp_kelvin);
          } else if (Number.isFinite(Number(numeric1.color_temp))) {
            finiteNumber3.colorTemperatureKelvin =
              1000000 / Number(numeric1.color_temp);
          }
          if (temperature && Array.isArray(entityState.colorRgb)) {
            finiteNumber3.colorRgb = entityState.colorRgb
              .slice(0, 3)
              .map((arg) => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric1.rgb_color)) {
            finiteNumber3.colorRgb = numeric1.rgb_color
              .slice(0, 3)
              .map((arg) => Number(arg) || 0);
          } else if (temperature && Array.isArray(numeric1.hs_color)) {
            finiteNumber3.colorRgb = hsToRgbColor(numeric1.hs_color);
          }
          const count = Math.max(
            1,
            Math.min(100, Number(finiteNumber3.brightnessPercent) || 1),
          );
          const clamped =
            (Math.max(
              2000,
              Math.min(6500, Number(finiteNumber3.colorTemperatureKelvin) || 4250),
            ) -
              2000) /
            4500;
          const color = [255, 132, 42];
          const color1 = [172, 225, 255];
          const mapped =
            finiteNumber3.colorRgb ||
            color.map((arg, arg2) =>
              Math.round(arg + (color1[arg2] - arg) * clamped),
            );
          element7.classList.toggle("is-on", finiteNumber3.isOn);
          element7.style.setProperty(
            "--hb-light-visual-color",
            "rgb(" + mapped.join(",") + ")",
          );
          element7.style.setProperty(
            "--hb-light-visual-opacity",
            finiteNumber3.isOn ? String(0.08 + (count / 100) * 0.92) : "0",
          );
          element7.style.setProperty(
            "--hb-light-visual-blur",
            Math.round(15 + count * 1.14) + "px",
          );
          element7.style.setProperty(
            "--hb-light-visual-scale",
            String(0.62 + (count / 100) * 1.05),
          );
          element7.setAttribute("aria-pressed", String(finiteNumber3.isOn));
          element7.setAttribute(
            "aria-label",
            "" +
              element5.textContent +
              (finiteNumber3.isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
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
            isOn: !isOn,
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            onVisualChange({
              isOn,
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
              isOn: true,
            });
          },
          onVisualChange,
        });
        state1.push(() => lightVisualEl?.cleanupLightDetails?.());
        runHelper(entityId, (arg) => {
          onVisualChange(arg);
          lightVisualEl?.syncLightState?.(arg);
        });
        element3.append(lightVisualEl);
      } else if (
        component3.type === "climate" ||
        component3.type === "water-heater"
      ) {
        element3.classList.add("hb-custom-popup-module--climate");
        const deviceType =
          component3.type === "water-heater"
            ? "water-heater"
            : resolveClimateDeviceType(
                {
                  properties: {
                    deviceType:
                      component3.deviceType ||
                      component3.properties?.deviceType ||
                      "auto",
                    label: component3.title || "",
                  },
                },
                customPopupModuleEl1,
                entityId,
              );
        let climateVisualEl = customPopupModuleEl1;
        const climateVisualEl1 = {
          entityId,
          entityMetadata: this.entityMetadata,
          entityTranslations: this.entityTranslations,
        };
        const visual = document.createElement("button");
        visual.type = "button";
        visual.className = "hb-climate-visual hb-custom-climate-visual";
        visual.classList.toggle("is-bath-heater", deviceType === "bath-heater");
        visual.classList.toggle(
          "is-water-heater",
          deviceType === "water-heater",
        );
        if (deviceType === "water-heater") {
          state4.push({
            visual,
            distance: 168,
            delay: 100 + entry * 45,
          });
        }
        visual.inert = preview;
        visual.setAttribute("aria-disabled", String(preview));
        const climateVisualUnitEl = document.createElement("div");
        climateVisualUnitEl.className = "hb-climate-visual-unit";
        const element7 = document.createElement("span");
        element7.className = "hb-climate-visual-brand";
        element7.textContent =
          deviceType === "bath-heater"
            ? "BATH HEATER"
            : deviceType === "water-heater"
              ? "SMART WATER"
              : "SMART AIR";
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
          targetTemperature,
        } = {}) => {
          const state14 = visualMode !== "off";
          visual.classList.toggle("is-on", state14);
          visual.classList.toggle("is-running", running);
          visual.classList.toggle(
            "is-airflow-mode",
            deviceType === "bath-heater" &&
              state14 &&
              bathHeaterModeUsesAirflow(mode),
          );
          visual.dataset.visualMode = visualMode;
          visual.style.setProperty("--hb-climate-visual-accent", accentColor);
          const finiteNumber =
            targetTemperature != null &&
            targetTemperature !== "" &&
            Number.isFinite(Number(targetTemperature));
          element8.textContent = state14
            ? finiteNumber
              ? Number(targetTemperature) + "°"
              : climateModeLabel(mode, deviceType, climateVisualEl1)
            : "OFF";
          if (deviceType === "bath-heater") {
            visual.setAttribute(
              "aria-label",
              element5.textContent + "，点击切换浴霸灯",
            );
          } else {
            visual.setAttribute("aria-pressed", String(state14));
            visual.setAttribute(
              "aria-label",
              "" +
                element5.textContent +
                (state14 ? "已开启，点击关闭" : "已关闭，点击开启"),
            );
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
            targetTemperature: onVisualChange6,
          }) => {
            element6.textContent = climateModeLabel(
              onVisualChange,
              deviceType,
              climateVisualEl1,
            );
            element6.classList.toggle("is-live", onVisualChange2 !== "off");
            element6.classList.toggle("is-running", onVisualChange3);
            element6.style.setProperty("--hb-climate-accent", onVisualChange4);
            element6.style.setProperty(
              "--hb-climate-accent-soft",
              onVisualChange5,
            );
            syncVisualState({
              mode: onVisualChange,
              visualMode: onVisualChange2,
              running: onVisualChange3,
              accentColor: onVisualChange4,
              targetTemperature: onVisualChange6,
            });
          },
        });
        state1.push(() => element9.cleanupClimateDetails?.());
        const state9 =
          deviceType === "bath-heater" ? state7?.roles?.light : "";
        const state10 = state9
          ? this.entityMetadata.get(state9)
          : deviceType === "bath-heater"
            ? relatedDeviceDomainEntity(this.entityMetadata, entityId, "light")
            : null;
        let state11 = null;
        if (state10?.entityId) {
          const state14 = this.states.get(state10.entityId);
          const state15 = state14?.newState ||
            state14 || {
              state: "unknown",
              attributes: {},
            };
          state11 = this.createBathHeaterLightControl(
            state10.entityId,
            state15,
            {
              interactive: !preview,
              onStateChange: ({
                isOn: onStateChange,
                unavailable: onStateChange2,
              }) => {
                visual.classList.toggle(
                  "is-light-on",
                  onStateChange && !onStateChange2,
                );
                visual.setAttribute(
                  "aria-pressed",
                  String(onStateChange && !onStateChange2),
                );
              },
            },
          );
          element9.append(state11);
          runHelper(state10.entityId, (arg) =>
            state11.syncBathLightState?.(arg),
          );
        }
        const state12 = Array.from(element9.children);
        const customClimateLeftEl = state12.find((element10) =>
          element10.classList.contains("hb-climate-thermostat"),
        );
        const customClimateLeftEl1 = state12.find((element10) =>
          element10.classList.contains("hb-climate-fan-slider"),
        );
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
        customClimateRightEl.append(
          visual,
          ...state12.filter(
            (arg) => arg !== customClimateLeftEl && arg !== customClimateLeftEl1,
          ),
        );
        const state13 = !!customClimateLeftEl || !!customClimateLeftEl1;
        element9.classList.toggle("without-primary-controls", !state13);
        element9.replaceChildren(...(state13 ? [customClimateLeftEl2, customClimateRightEl] : [customClimateRightEl]));
        let showCustomPopupValue = false;
        visual.addEventListener("click", async () => {
          if (deviceType === "bath-heater") {
            if (state11?.toggleBathLight) {
              await state11.toggleBathLight();
            } else {
              this.options.onError?.(
                new Error("未找到与浴霸同设备的灯光实体。"),
              );
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
          const state15 =
            element9.dataset.lastClimateMode ||
            (state14 ? entityState.state : "auto");
          const state16 = {
            state: state14 ? "off" : state15,
            attributes: {
              ...(entityState?.attributes || {}),
              hvac_action: state14 ? "off" : state15,
            },
          };
          climateVisualEl = state16;
          element9.syncClimateState?.(state16);
          try {
            const state17 = climatePowerCommand(
              entityId,
              entityState,
              !state14,
              deviceType,
              element9.dataset.lastClimateMode || "",
            );
            await this.callEntityService(
              state17.domain,
              state17.service,
              entityId,
              state17.data,
            );
          } catch (error) {
            climateVisualEl = entityState;
            element9.syncClimateState?.(entityState);
            this.options.onError?.(error);
          } finally {
            showCustomPopupValue = false;
            visual.removeAttribute("aria-busy");
          }
        });
        runHelper(entityId, (arg) => {
          climateVisualEl = arg;
          element9.syncClimateState?.(arg);
        });
        element3.append(element9);
      } else if (component3.type === "cover") {
        let state9 = customPopupModuleEl1;
        const entityState = customPopupModuleEl1?.attributes || {};
        const airer = coverComponentIsAirer(
          component3,
          entityId,
          customPopupModuleEl1,
          this.entityMetadata,
          this.deviceMetadata,
        );
        const numeric = Number(entityState.supported_features || 0);
        const state10 =
          entityId +
          " " +
          (entityState.friendly_name || "") +
          " " +
          (component3.title || "");
        const finiteNumber =
          Number.isFinite(Number(entityState.current_tilt_position)) ||
          !!(numeric & 240);
        const state11 = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(
          state10,
        );
        const state12 = ["standard", "dream", "airer"].includes(
          component3.properties?.coverKind,
        )
          ? component3.properties.coverKind
          : "auto";
        const dream =
          !airer &&
          (state12 === "dream" || (state12 === "auto" && (finiteNumber || state11)));
        const state13 =
          (airer
            ? relatedAirerLightEntity(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const state14 = state13 ? this.states.get(state13) : null;
        let position = state14?.newState || state14 || null;
        const positionCommandEntityId =
          (airer
            ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const position1 = this.states.get(positionCommandEntityId);
        const positionCommandState = position1?.newState || position1 || null;
        const state15 =
          (airer
            ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const state16 =
          (airer
            ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const state17 = this.states.get(state16);
        const motorState = state17?.newState || state17 || null;
        const state18 = airer
          ? relatedAirerMotorActionEntities(this.entityMetadata, entityId)
          : {};
        const airerActionEntityIds = Object.fromEntries(
          Object.entries(state18).map(([arg, arg2]) => [
            arg,
            arg2?.entityId || "",
          ]),
        );
        const position2 = this.states.get(state15 || positionCommandEntityId);
        const positionState = position2?.newState || position2 || null;
        const tilt = dream && finiteNumber;
        const motorReversed = coverMotorIsReversedForComponent(
          component3,
          this.entityMetadata,
          this.states,
          entityId,
        );
        const state19 = motorReversed ? "open_cover" : "close_cover";
        const customCoverLayoutEl = motorReversed ? "close_cover" : "open_cover";
        const customCoverLayoutEl1 = ["left", "right"].includes(
          component3.properties?.coverDirection,
        )
          ? component3.properties.coverDirection
          : "split";
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
          const size2 =
            customCoverLayoutEl1 === "right"
              ? coverVisualSlatEl - 1 - coverVisualSlatEl1
              : customCoverLayoutEl1 === "split"
                ? Math.abs((coverVisualSlatEl - 1) / 2 - coverVisualSlatEl1)
                : coverVisualSlatEl1;
          coverVisualSlatEl2.style.setProperty(
            "--hb-cover-slat-delay-index",
            String(size2),
          );
          const size3 =
            customCoverLayoutEl1 === "left"
              ? -coverVisualSlatEl1 * 14.5
              : customCoverLayoutEl1 === "right"
                ? (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5
                : coverVisualSlatEl1 <= (coverVisualSlatEl - 1) / 2
                  ? -coverVisualSlatEl1 * 14.5
                  : (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5;
          coverVisualSlatEl2.style.setProperty(
            "--hb-cover-retracted-shift",
            size3 + "px",
          );
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
          const state21 =
            !state13 ||
            ["unknown", "unavailable"].includes(
              String(position?.state || "unknown"),
            );
          const state22 = position?.state === "on";
          element7.classList.toggle("is-light-on", state22 && !state21);
          element7.classList.toggle("is-light-unavailable", state21);
          element7.disabled = preview || state21;
          element7.setAttribute("aria-pressed", String(state22 && !state21));
          element7.setAttribute(
            "aria-label",
            state21
              ? "晾衣机灯光实体不可用"
              : "晾衣机灯光" +
                  (state22 ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
        };
        syncVisualState();
        let position3 = 0;
        const positionCalibration = airerPositionCalibration(
          this.entityMetadata,
          this.deviceMetadata,
          entityId,
        );
        const onVisualChange = ({ position: position4 = 0, state = "" } = {}) => {
          const current_position = Math.max(
            0,
            Math.min(100, Number(position4) || 0),
          );
          const coverState = coverPresentationState(
            {
              state,
              attributes: {
                current_position,
              },
            },
            motorReversed,
          );
          const physicalState = physicalCoverState(
            state || state9?.state,
            motorReversed,
          );
          const position5 = physicalState === "open" || physicalState === "opening";
          position3 = current_position;
          element7.style.setProperty(
            "--hb-cover-open-position",
            current_position + "%",
          );
          element7.style.setProperty(
            "--hb-airer-drop",
            airerVisualDrop(current_position) + "px",
          );
          element7.style.setProperty(
            "--hb-cover-panel-width",
            45.9 - current_position * 0.331 + "%",
          );
          element7.style.setProperty(
            "--hb-cover-single-panel-width",
            91.8 - current_position * 0.79 + "%",
          );
          element7.style.setProperty(
            "--hb-cover-slat-angle",
            current_position * 1.8 + "deg",
          );
          element7.classList.toggle("is-tilt-reversed", current_position > 50);
          element7.classList.toggle(
            "is-tilt-center",
            Math.abs(current_position - 50) <= 2,
          );
          element7.classList.toggle(
            "is-open",
            dream ? position5 : coverState === "open" || coverState === "opening",
          );
          element7.classList.toggle(
            "is-moving",
            state === "opening" || state === "closing",
          );
          element7.setAttribute(
            "aria-pressed",
            String(
              dream ? position5 : coverState === "open" || coverState === "opening",
            ),
          );
          if (airer) {
            element6.textContent =
              coverLiftStateLabel(coverState) || Math.round(current_position) + "%";
          } else if (dream) {
            element6.textContent = dreamCurtainStatusText(
              state || state9?.state,
              current_position,
              motorReversed,
            );
          } else {
            element6.textContent =
              {
                open: "已打开",
                closed: "已关闭",
                opening: "正在打开",
                closing: "正在关闭",
              }[coverState] || Math.round(current_position) + "%";
          }
          element6.classList.toggle(
            "is-live",
            dream ? position5 : coverState === "open" || coverState === "opening",
          );
          if (!airer) {
            element7.setAttribute(
              "aria-label",
              dream
                ? "" +
                    element5.textContent +
                    dreamCurtainStatusText(
                      state || state9?.state,
                      current_position,
                      motorReversed,
                    )
                : "" +
                    element5.textContent +
                    (coverState === "open" || coverState === "opening"
                      ? "已打开，点击关闭"
                      : "已关闭，点击打开"),
            );
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
            moving: onCurtainPositionChange2,
          }) => {
            element7.classList.toggle(
              "is-curtain-retracted",
              onCurtainPositionChange,
            );
            element7.classList.toggle(
              "is-curtain-moving",
              onCurtainPositionChange2,
            );
            element7.dataset.curtainRetracted = String(onCurtainPositionChange);
            if (dream) {
              element6.textContent = dreamCurtainStatusFromRetraction(
                onCurtainPositionChange,
                onCurtainPositionChange2,
                position3,
              );
              element6.classList.toggle("is-live", onCurtainPositionChange);
            }
          },
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
              state: position?.state === "on" ? "off" : "on",
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
          const state22 =
            state20.isDreamCurtainRetracted?.() ??
            element7.dataset.curtainRetracted === "true";
          const state23 = state21 > COVER_CLOSED_POSITION_EPSILON;
          if (dream) {
            state20.beginDreamCurtainMotion?.(!state22);
          } else {
            state20.beginCoverMotion?.(
              state23 ? 0 : 100,
              state23 ? "closing" : "opening",
            );
          }
          try {
            await this.callEntityService(
              "cover",
              dream
                ? dreamCurtainToggleService(state22, customCoverLayoutEl, state19)
                : state23
                  ? state19
                  : customCoverLayoutEl,
              entityId,
            );
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
        runHelper(entityId, (arg) => {
          state9 = arg;
          state20.syncCoverState?.(arg);
        });
        if (state13) {
          runHelper(state13, syncVisualState);
        }
        if (state15) {
          runHelper(state15, (arg) => state20.syncCoverPositionState?.(arg));
        }
        if (positionCommandEntityId) {
          runHelper(positionCommandEntityId, (arg) => {
            state20.syncCoverPositionCommandState?.(arg);
            if (!state15) {
              state20.syncCoverPositionState?.(arg);
            }
          });
        }
        if (state16) {
          runHelper(state16, (arg) => state20.syncAirerMotorState?.(arg));
        }
        state1.push(() => state20.cleanupCoverDetails?.());
        customCoverLayoutEl2.append(element7, state20);
        element3.append(customCoverLayoutEl2);
      } else if (component3.type === "air-purifier") {
        let airPurifierVisualEl = customPopupModuleEl1 || {
          entityId,
          state: "unknown",
          attributes: {},
        };
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className =
          "hb-air-purifier-visual hb-custom-air-purifier-visual";
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
        const airPurifierLayoutEl = this.createCapabilityDetailsControls(
          entityId,
          airPurifierVisualEl,
          {
            interactive: !preview,
            variant: "air-purifier",
          },
        );
        const airPurifierLayoutEl1 = document.createElement("div");
        airPurifierLayoutEl1.className =
          "hb-air-purifier-layout hb-custom-air-purifier-layout";
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
          humidity: "湿度",
        };
        const state10 = [
          {
            role: "pm25",
            ids: [state7?.roles?.pm25],
          },
          {
            role: "pm10",
            ids: [state7?.roles?.pm10],
          },
          {
            role: "filterLife",
            ids: [state7?.roles?.filterLife, state7?.roles?.filterLeftTime],
          },
          {
            role: "hcho",
            ids: [state7?.roles?.hcho],
          },
          {
            role: "temperature",
            ids: [state7?.roles?.temperature],
          },
          {
            role: "humidity",
            ids: [state7?.roles?.humidity],
          },
        ].map((arg) => ({
          ...arg,
          ids: arg.ids.filter(Boolean),
        }));
        const computeResult = (entityId1) => {
          const state11 = this.states.get(entityId1);
          return state11?.newState || state11 || null;
        };
        const runHelper2 = (arg) => {
          const numeric = computeResult(arg);
          return (
            numeric &&
            !["unknown", "unavailable"].includes(
              String(numeric.state || "").toLowerCase(),
            ) &&
            Number.isFinite(Number(numeric.state))
          );
        };
        const found = state10
          .map((arg) => ({
            ...arg,
            id:
              arg.ids.find((id) => runHelper2(id)) ||
              arg.ids.find((id) => this.entityMetadata.has(id)),
          }))
          .filter((airPurifierSecondaryMetricsEl1) => airPurifierSecondaryMetricsEl1.id)
          .slice(0, 3);
        const airPurifierSecondaryMetricsEl = document.createElement("div");
        airPurifierSecondaryMetricsEl.className =
          "hb-air-purifier-secondary-metrics hb-custom-air-purifier-metrics";
        for (const airPurifierSecondaryMetricEl of found) {
          const airPurifierSecondaryMetricEl1 = this.entityMetadata.get(airPurifierSecondaryMetricEl.id);
          const airPurifierSecondaryMetricEl2 = document.createElement("div");
          airPurifierSecondaryMetricEl2.className =
            "hb-air-purifier-secondary-metric hb-air-purifier-secondary-metric--" +
            airPurifierSecondaryMetricEl.role;
          const element14 = document.createElement("small");
          element14.textContent = state9[airPurifierSecondaryMetricEl.role] || airPurifierSecondaryMetricEl.role;
          const element15 = document.createElement("strong");
          airPurifierSecondaryMetricEl2.append(element14, element15);
          airPurifierSecondaryMetricsEl.append(airPurifierSecondaryMetricEl2);
          const runHelper4 = (entityState) => {
            element15.textContent = ["unknown", "unavailable"].includes(
              String(entityState?.state || "").toLowerCase(),
            )
              ? "--"
              : (
                  (entityState?.state ?? "--") +
                  " " +
                  (entityState?.attributes?.unit_of_measurement ||
                    airPurifierSecondaryMetricEl1?.unitOfMeasurement ||
                    "")
                ).trim();
          };
          runHelper4(computeResult(airPurifierSecondaryMetricEl.id));
          runHelper(airPurifierSecondaryMetricEl.id, runHelper4);
        }
        const airQuality = state7?.roles?.airQuality;
        const pm25 = state7?.roles?.pm25;
        const runHelper3 = () => {
          const state11 = computeResult(airQuality);
          const numeric1 = computeResult(pm25);
          const trimmed = ["unknown", "unavailable"].includes(
            String(state11?.state || "").toLowerCase(),
          )
            ? ""
            : String(state11?.state || "").trim();
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
            localValue1 =
              numeric <= 15
                ? "excellent"
                : numeric <= 35
                  ? "good"
                  : numeric <= 75
                    ? "warning"
                    : "poor";
            localValue = {
              excellent: "空气优",
              good: "空气良",
              warning: "轻度污染",
              poor: "空气较差",
            }[localValue1];
          }
          element12.textContent = localValue || "--";
          element9.style.setProperty(
            "--hb-air-purifier-progress",
            {
              excellent: 72,
              good: 58,
              warning: 42,
              poor: 26,
              unknown: 0,
            }[localValue1] + "%",
          );
          element9.classList.toggle("is-warning", localValue1 === "warning");
          element9.classList.toggle("is-poor", localValue1 === "poor");
          const state12 = {
            excellent: "#76cfa1",
            good: "#76cfa1",
            warning: "#e4b15f",
            poor: "#db7770",
            unknown: "#7d8990",
          }[localValue1];
          const color = {
            excellent: "rgba(118,207,161,.13)",
            good: "rgba(118,207,161,.13)",
            warning: "rgba(228,177,95,.15)",
            poor: "rgba(219,119,112,.15)",
            unknown: "rgba(125,137,144,.13)",
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
          element7.setAttribute(
            "aria-label",
            "" +
              element5.textContent +
              (state12 ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
          element6.textContent = state11
            ? "当前不可用"
            : state12
              ? "已开启"
              : "已关闭";
          element6.classList.toggle("is-live", state12);
          element13.textContent = state11
            ? "设备不可用"
            : state12
              ? "净化中"
              : "已关闭";
          element9.classList.toggle("is-running", state12);
          element10.classList.toggle("is-running", state12);
          airPurifierLayoutEl.syncCapabilityState?.(airPurifierVisualEl);
        };
        syncVisualState();
        let showCustomPopupValue = false;
        element7.addEventListener("click", async () => {
          if (
            preview ||
            showCustomPopupValue ||
            ["unknown", "unavailable"].includes(
              String(airPurifierVisualEl?.state || "").toLowerCase(),
            )
          ) {
            return;
          }
          showCustomPopupValue = true;
          element7.setAttribute("aria-busy", "true");
          const state11 = airPurifierVisualEl;
          const asString = String(state11?.state || "").toLowerCase() === "off";
          syncVisualState({
            ...state11,
            state: asString ? "on" : "off",
          });
          try {
            await this.callEntityService(
              "fan",
              asString ? "turn_on" : "turn_off",
              entityId,
            );
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
        element5.textContent = popupModuleDialogTitle(
          component3,
          customPopupModuleEl1,
          "媒体",
        );
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
        mediaPlayerDetailsBodyEl.className =
          "hb-media-player-details-body hb-custom-media-player-body";
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
        const buildElementTree = (arg, arg2) => {
          const element18 = document.createElement("button");
          element18.type = "button";
          element18.textContent = arg;
          element18.addEventListener("click", async () => {
            if (!preview) {
              element18.disabled = true;
              try {
                await this.callEntityService("media_player", arg2, entityId);
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
          preview,
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
        const runHelper2 = (arg) => {
          const count = Math.max(0, Math.floor(Number(arg) || 0));
          return (
            Math.floor(count / 60) + ":" + String(count % 60).padStart(2, "0")
          );
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
        const runHelper3 = (arg, arg2) =>
          Number.isFinite(arg) &&
          Number.isFinite(arg2) &&
          Math.abs(arg - arg2) <= 0.005;
        const clampNumber1 = (arg) => {
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
            await this.callEntityService(
              "media_player",
              "volume_set",
              entityId,
              {
                volume_level,
              },
            );
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
        const syncVisualState = (entityState) => {
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
            unknown: "未知状态",
          };
          element6.textContent =
            state16[asString] || entityState?.state || "未知状态";
          element6.classList.toggle(
            "is-live",
            ["playing", "paused"].includes(asString),
          );
          element9.textContent =
            numeric1.media_title ||
            numeric1.media_series_title ||
            numeric1.app_name ||
            numeric1.source ||
            "暂无播放内容";
          element10.textContent =
            [numeric1.media_artist, numeric1.media_album_name]
              .filter(Boolean)
              .join(" · ") ||
            numeric1.media_content_type ||
            "媒体播放器";
          element14.textContent = asString === "playing" ? "暂停" : "播放";
          element14.disabled =
            preview || ["off", "unavailable", "unknown"].includes(asString);
          state9.disabled = preview || !(numeric & 16);
          capabilityRangeGroupEl.disabled = preview || !(numeric & 32);
          element7.classList.toggle("is-playing", asString === "playing");
          element7.classList.toggle("is-paused", asString === "paused");
          element7.classList.toggle(
            "is-off",
            ["off", "unavailable", "unknown"].includes(asString),
          );
          showCustomPopupValue1 = Number.isFinite(Number(numeric1.media_duration))
            ? Number(numeric1.media_duration)
            : null;
          showCustomPopupValue2 = Number.isFinite(Number(numeric1.media_position))
            ? Number(numeric1.media_position)
            : 0;
          const position = Date.parse(
            String(numeric1.media_position_updated_at || ""),
          );
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
          const trimmed =
            [
              numeric1.entity_picture_local,
              numeric1.entity_picture,
              numeric1.media_image_url,
            ]
              .map((arg) => String(arg || "").trim())
              .find(
                (arg) =>
                  arg.startsWith("/api/media_player_proxy/") ||
                  arg.startsWith("/api/image_proxy/"),
              ) || "";
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
        const runHelper2 = (arg) => {
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
    dialog.append(customPopupCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    const runHelper1 = (arg) =>
      arg
        .map((arg1) => {
          const state7 =
            arg1.type === "electric-bed"
              ? this.deviceProfile(this.runtimeEntityId(arg1.entityId))
              : null;
          const state8 =
            state7?.deviceType === "electric-bed" ? state7.roles || {} : {};
          return [
            arg1.id,
            state7?.deviceType || arg1.type || "generic",
            "backrest",
            "leg",
            "waist",
            "mode",
            "memory1",
            "memory2",
          ]
            .map((arg2) =>
              String(
                arg2 === arg1.id ? arg1.id : state8[arg2] || "",
              ),
            )
            .join(":");
        })
        .join("|");
    const state6 = runHelper1(state);
    this.detailsStateSync = {
      dialog,
      handlers,
      refreshHistory: () =>
        state5.forEach((refreshHistory) => refreshHistory()),
      refreshEntityCatalog: () => {
        if (this.detailsDialog === dialog && !!dialog.open) {
          if (runHelper1(state) !== state6) {
            this.showCustomPopup(popupId, {
              preview,
            });
          }
        }
      },
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, popupWidth, popupHeight);
    element2.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, customPopupCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        for (const runHelper2 of state1.splice(0)) {
          runHelper2();
        }
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        if (
          !this.replacingDocument &&
          this.activePopupId === String(popupId?.id || "")
        ) {
          this.activePopupId = null;
          this.historyPopupGeneration += 1;
          this.connectRuntime();
          this.refreshHistorySeries();
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
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
  createLightDetailsControls(
    entityId,
    component,
    {
      interactive = true,
      onTurnOn = null,
      onVisualChange = null,
    } = {},
  ) {
    const numeric = component?.attributes || {};
    const brightness = entityId.startsWith("light.");
    const lightDetailsControlsEl = brightness && lightSupportsColor(numeric);
    const { brightness: supported, colorTemperature: supported2 } =
      lightRealtimeCapabilities(entityId, component);
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
      supported: supported3 = true,
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
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(minimum);
      input.max = String(maximum);
      input.step = String(step);
      input.value = String(count);
      input.disabled = !supported3;
      const updateSliderValue = ({ notify = false } = {}) => {
        const brightnessPercent = Number(input.value);
        const brightness1 =
          ((brightnessPercent - minimum) / Math.max(1, maximum - minimum)) *
          100;
        element6.textContent = supported3
          ? "" + Math.round(brightnessPercent) + suffix
          : "不支持";
        input.style.setProperty(
          "--hb-light-slider-progress",
          Math.max(0, Math.min(100, brightness1)) + "%",
        );
        if (notify && supported3) {
          onVisualChange?.(
            dataKey === "brightness_pct"
              ? {
                  brightnessPercent,
                }
              : {
                  colorTemperatureKelvin: brightnessPercent,
                },
          );
        }
      };
      updateSliderValue();
      input.addEventListener("input", () => {
        scheduleTimeout();
        updateSliderValue({
          notify: true,
        });
      });
      input.addEventListener("change", async () => {
        if (!!interactive && !!supported3) {
          try {
            await this.callEntityService("light", "turn_on", entityId, {
              [dataKey]: Number(input.value),
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
      element3.append(lightDetailsSliderHeadingEl, input, lightDetailsSliderLegendEl);
      element.append(element3);
      index.set(dataKey, {
        input,
        updateSliderValue,
        supported: supported3,
      });
    };
    let element2 = null;
    let color = null;
    let color1 = false;
    if (lightDetailsControlsEl) {
      const list = Array.isArray(numeric.hs_color)
        ? numeric.hs_color
        : rgbToHsColor(numeric.rgb_color) || [0, 100];
      color = {
        hue: Number(list[0]) || 0,
        saturation: Number(list[1]) || 0,
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
      const runHelper1 = () =>
        lightColorPickerPointFromHs([color.hue, color.saturation]);
      const syncAriaState = ({
        hue = color.hue,
        saturation = color.saturation,
      } = {}) => {
        color.hue = (((Number(hue) || 0) % 360) + 360) % 360;
        color.saturation = Math.max(0, Math.min(100, Number(saturation) || 0));
        const color2 = runHelper1();
        const colorRgb = hsToRgbColor([color.hue, color.saturation]);
        const color3 = "rgb(" + colorRgb.join(",") + ")";
        element2.style.setProperty(
          "--hb-light-color-picker-x",
          color2.x * 100 + "%",
        );
        element2.style.setProperty(
          "--hb-light-color-picker-y",
          color2.y * 100 + "%",
        );
        element2.style.setProperty("--hb-light-color-picker-color", color3);
        element2.setAttribute(
          "aria-valuetext",
          "色相 " +
            Math.round(color.hue) +
            " 度，饱和度 " +
            Math.round(color.saturation) +
            "%",
        );
        onVisualChange?.({
          colorHs: [color.hue, color.saturation],
          colorRgb,
        });
      };
      const measureElementBox = (event1) => {
        const domRect = element2.getBoundingClientRect();
        if (!domRect.width || !domRect.height) {
          return;
        }
        const count = Math.max(
          0,
          Math.min(1, (event1.clientX - domRect.left) / domRect.width),
        );
        const count2 = Math.max(
          0,
          Math.min(1, (event1.clientY - domRect.top) / domRect.height),
        );
        const [hue, saturation] = lightColorPickerHsFromPoint(count, count2);
        syncAriaState({
          hue,
          saturation,
        });
      };
      const syncAriaState1 = async () => {
        if (!!interactive && !color1) {
          color1 = true;
          element2.setAttribute("aria-busy", "true");
          try {
            await this.callEntityService(
              "light",
              "turn_on",
              entityId,
              lightColorServiceData(numeric, [color.hue, color.saturation]),
            );
            onTurnOn?.();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            color1 = false;
            element2.removeAttribute("aria-busy");
          }
        }
      };
      element2.addEventListener("pointerdown", (event) => {
        if (interactive) {
          element2.setPointerCapture?.(event.pointerId);
          element2.dataset.dragging = "true";
          measureElementBox(event);
          event.preventDefault();
        }
      });
      element2.addEventListener("pointermove", (arg) => {
        if (element2.dataset.dragging === "true") {
          measureElementBox(arg);
        }
      });
      const state3 = async (event1) => {
        if (element2.dataset.dragging === "true") {
          element2.dataset.dragging = "false";
          element2.releasePointerCapture?.(event1.pointerId);
          await syncAriaState1();
        }
      };
      element2.addEventListener("pointerup", state3);
      element2.addEventListener("pointercancel", state3);
      element2.addEventListener("keydown", async (event) => {
        if (!interactive) {
          return;
        }
        const event1 = event.shiftKey ? 10 : 3;
        let { hue, saturation } = color;
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
          saturation,
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
    const finiteNumber = Number.isFinite(Number(numeric.max_mireds))
      ? 1000000 / Number(numeric.max_mireds)
      : 2000;
    const finiteNumber1 = Number.isFinite(Number(numeric.min_mireds))
      ? 1000000 / Number(numeric.min_mireds)
      : 6500;
    const asNumber = Number(numeric.min_color_temp_kelvin) || finiteNumber;
    const asNumber1 = Number(numeric.max_color_temp_kelvin) || finiteNumber1;
    const finiteNumber2 = Number.isFinite(Number(numeric.color_temp))
      ? 1000000 / Number(numeric.color_temp)
      : asNumber;
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
        supported: supported2,
      });
    }
    const finiteNumber3 = Number.isFinite(Number(numeric.brightness))
      ? (Number(numeric.brightness) / 255) * 100
      : 100;
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
      supported,
    });
    let state = null;
    let state1 = 0;
    let state2 = component;
    const scheduleTimeout = ({ resync = false } = {}) => {
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
          resync: true,
        });
        return;
      }
      const clamped = state.latestMatches
        ? Math.min(
            state.expiresAt,
            Math.max(
              state.minimumHoldUntil,
              state.matchStartedAt + LIGHT_PRESET_STABLE_CONFIRMATION_MS,
            ),
          )
        : state.expiresAt;
      state1 = window.setTimeout(scheduleTimeout1, Math.max(50, clamped - nowMs));
    };
    const lightDetailsPresetsEl = LIGHT_DETAIL_PRESET_DEFINITIONS;
    const runHelper = (lightDetailsPresetsEl2) =>
      relativeLightColorTemperature(
        asNumber,
        asNumber1,
        lightDetailsPresetsEl2.colorTemperaturePercent,
      );
    const lightDetailsPresetsEl1 = document.createElement("div");
    lightDetailsPresetsEl1.className = "hb-light-details-presets";
    lightDetailsPresetsEl1.hidden = lightDetailsControlsEl || (!supported && !lightDetailsControlsEl1);
    const event = lightDetailsPresetsEl.map((arg) => {
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = !brightness;
      const element3 = document.createElement("strong");
      element3.textContent = arg.label;
      const element4 = document.createElement("small");
      element4.textContent = supported ? arg.detail : "开启";
      button.append(element3, element4);
      button.addEventListener("click", async () => {
        if (!interactive || !brightness) {
          return;
        }
        const colorTemperatureKelvin = runHelper(arg);
        const size = {};
        if (supported) {
          Object.assign(
            size,
            lightPresetBrightnessServiceData(arg.brightnessPercent),
          );
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
          matchStartedAt: null,
        };
        scheduleTimeout1();
        const brightness1 = index.get("brightness_pct");
        if (brightness1?.supported) {
          brightness1.input.value = String(arg.brightnessPercent);
          brightness1.updateSliderValue({
            notify: true,
          });
        }
        const temperature = index.get("color_temp_kelvin");
        if (temperature?.supported) {
          temperature.input.value = String(colorTemperatureKelvin);
          temperature.updateSliderValue({
            notify: true,
          });
        }
        for (const event1 of event) {
          event1.button.classList.toggle(
            "is-active",
            event1.button === button,
          );
        }
        onVisualChange?.({
          isOn: true,
          ...(supported
            ? {
                brightnessPercent: arg.brightnessPercent,
              }
            : {}),
          ...(lightDetailsControlsEl1
            ? {
                colorTemperatureKelvin,
              }
            : {}),
        });
        onTurnOn?.();
        try {
          await this.callEntityService("light", "turn_on", entityId, size);
        } catch (error) {
          scheduleTimeout({
            resync: true,
          });
          button.classList.remove("is-active");
          this.options.onError?.(error);
        }
      });
      lightDetailsPresetsEl1.append(button);
      return {
        button,
        ...arg,
      };
    });
    element.append(lightDetailsPresetsEl1);
    const syncLightControl = (entityState) => {
      const numeric1 = entityState?.attributes || {};
      const brightness1 = entityState?.state === "on";
      const finiteNumber4 = Number.isFinite(Number(numeric1.brightness))
        ? (Number(numeric1.brightness) / 255) * 100
        : NaN;
      const finiteNumber5 = Number.isFinite(Number(numeric1.color_temp))
        ? 1000000 / Number(numeric1.color_temp)
        : NaN;
      const event1 = Number(numeric1.color_temp_kelvin) || finiteNumber5;
      for (const event2 of event) {
        const event3 = runHelper(event2);
        const count = Math.max(50, (asNumber1 - asNumber) * 0.06);
        const finiteNumber6 =
          !supported ||
          (Number.isFinite(finiteNumber4) &&
            Math.abs(finiteNumber4 - event2.brightnessPercent) <= 4);
        const finiteNumber7 =
          !lightDetailsControlsEl1 ||
          (Number.isFinite(event1) && Math.abs(event1 - event3) <= count);
        event2.button.classList.toggle(
          "is-active",
          brightness1 && finiteNumber6 && finiteNumber7,
        );
      }
    };
    syncLightControl(component);
    element.syncLightState = (entityState) => {
      if (!entityState) {
        return;
      }
      state2 = entityState;
      const numeric1 = entityState.attributes || {};
      const temperature = index.get("color_temp_kelvin");
      const finiteNumber4 = Number.isFinite(Number(numeric1.color_temp))
        ? 1000000 / Number(numeric1.color_temp)
        : NaN;
      const asNumber3 = Number(numeric1.color_temp_kelvin) || finiteNumber4;
      const brightness1 = index.get("brightness_pct");
      const finiteNumber5 = Number.isFinite(Number(numeric1.brightness))
        ? (Number(numeric1.brightness) / 255) * 100
        : NaN;
      if (state) {
        const finiteNumber6 =
          !supported ||
          (Number.isFinite(finiteNumber5) &&
            Math.abs(finiteNumber5 - state.brightnessPercent) <= 4);
        const finiteNumber7 =
          !lightDetailsControlsEl1 ||
          (Number.isFinite(asNumber3) &&
            Math.abs(asNumber3 - state.colorTemperatureKelvin) <= 220);
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
        const list = Array.isArray(numeric1.hs_color)
          ? numeric1.hs_color
          : rgbToHsColor(numeric1.rgb_color);
        if (list) {
          element2.syncColorPicker({
            hue: list[0],
            saturation: list[1],
          });
        }
      }
      syncLightControl(
        state
          ? {
              state: "on",
              attributes: {
                ...numeric1,
                ...(supported
                  ? {
                      brightness: (state.brightnessPercent / 100) * 255,
                    }
                  : {}),
                ...(lightDetailsControlsEl1
                  ? {
                      color_temp_kelvin: state.colorTemperatureKelvin,
                    }
                  : {}),
              },
            }
          : entityState,
      );
      const colorTemperatureKelvin = lightVisualValueForCapability(
        lightDetailsControlsEl1,
        brightness2,
        UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN,
      );
      const brightnessPercent = lightVisualValueForCapability(
        supported,
        brightness3,
        UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT,
      );
      onVisualChange?.({
        isOn: entityState.state === "on",
        colorTemperatureKelvin,
        brightnessPercent,
      });
    };
    element.syncLightState(component);
    element.cleanupLightDetails = () => {
      scheduleTimeout();
      element2?.cleanupColorPicker?.();
    };
    return element;
  }
  createCoverDetailsControls(
    entityId,
    component,
    {
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
      onCurtainPositionChange = null,
    } = {},
  ) {
    const coverDetailsControlsEl = document.createElement("section");
    coverDetailsControlsEl.className = "hb-cover-details-controls";
    coverDetailsControlsEl.inert = !interactive;
    const coverDetailsPositionEl = document.createElement("label");
    coverDetailsPositionEl.className = "hb-cover-details-position";
    const coverDetailsPositionHeadingEl = document.createElement("span");
    coverDetailsPositionHeadingEl.className = "hb-cover-details-position-heading";
    const element = document.createElement("strong");
    element.textContent = dream
      ? "叶片角度"
      : airer
        ? "晾杆高度"
        : "开合位置";
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
      coverDetailsPositionLegendEl.append(
        Object.assign(document.createElement("small"), {
          textContent: "0 · 一侧闭合",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "50 · 90°打开",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "100 · 反向闭合",
        }),
      );
    } else if (airer) {
      coverDetailsPositionLegendEl.append(
        Object.assign(document.createElement("small"), {
          textContent: "下降",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "升起",
        }),
      );
    } else {
      coverDetailsPositionLegendEl.append(
        Object.assign(document.createElement("small"), {
          textContent: "关闭",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "打开",
        }),
      );
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
    const state = (
      dream
        ? [
            {
              label: "关闭",
              icon: "←",
              service: service2,
              curtainRetracted: false,
            },
            {
              label: "暂停",
              icon: "Ⅱ",
              service,
            },
            {
              label: "开启",
              icon: "→",
              service: service3,
              curtainRetracted: true,
            },
          ]
        : airer
          ? [
              {
                label: "下降",
                icon: "↓",
                service: service2,
                action: "down",
              },
              {
                label: "暂停",
                icon: "Ⅱ",
                service,
                action: "pause",
              },
              {
                label: "升起",
                icon: "↑",
                service: service3,
                action: "up",
              },
            ]
          : [
              {
                label: "关闭",
                icon: "←",
                service: service2,
              },
              {
                label: "暂停",
                icon: "Ⅱ",
                service,
              },
              {
                label: "打开",
                icon: "→",
                service: service3,
              },
            ]
    ).map((arg) => {
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
            const state7 =
              airer && arg.action ? airerActionEntityIds[arg.action] : "";
            if (airer && positionCommandEntityId && ["up", "down"].includes(arg.action)) {
              const state8 = arg.action === "up" ? 100 : 0;
              const state9 = airerDevicePosition(state8, positionCalibration);
              await this.callEntityService("number", "set_value", positionCommandEntityId, {
                value: state9,
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
        learnAirerPositionCalibration(
          positionCalibration,
          state1?.state,
          state2?.state,
          numeric?.state,
        );
      }
    };
    runHelper();
    let text = String(component?.state || "");
    const resolveCoverPosition = (entityState) => {
      const state7 = airer
        ? airerReportedPosition(state1, entityState, positionCalibration)
        : Number(
            entityState?.attributes?.[
              tilt ? "current_tilt_position" : "current_position"
            ],
          );
      if (Number.isFinite(state7)) {
        const count = Math.max(0, Math.min(100, state7));
        if (airer) {
          return airerPresentationPositionForState(
            count,
            text || entityState?.state,
            positionCalibration,
            motorReversed,
          );
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
      element3.style.setProperty(
        "--hb-cover-position-progress",
        position + "%",
      );
      element2.textContent = Math.round(position) + "%";
      for (const element4 of state) {
        element4.classList.toggle(
          "is-active",
          element4.dataset.coverAction ===
            (state === "opening"
              ? size
              : state === "closing"
                ? size1
                : ""),
        );
      }
      onVisualChange?.({
        position,
        state,
      });
    };
    coverDetailsControlsEl.setDreamCurtainRetracted = (arg, arg2 = false) => {
      if (dream) {
        retracted = !!arg;
        element3.disabled = !interactive;
        onCurtainPositionChange?.({
          retracted,
          moving: !!arg2,
        });
      }
    };
    coverDetailsControlsEl.isDreamCurtainRetracted = () => retracted;
    coverDetailsControlsEl.beginDreamCurtainMotion = (arg) => {
      if (dream) {
        event = {
          target: !!arg,
          expiresAt: Date.now() + 10000,
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
        expiresAt: Date.now() + (airer ? 120000 : 10000),
      };
      const state7 = performance.now();
      const count = Math.max(900, Math.abs(target - initialPosition) * 28);
      const state8 = (arg1) => {
        const state9 = Math.min(1, (arg1 - state7) / count);
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
    coverDetailsControlsEl.holdCoverPosition = (arg) => {
      runHelper1();
      state5 = null;
      state6 = 0;
      const target = Math.max(0, Math.min(100, Number(arg) || 0));
      const initialPosition = position2;
      const direction = target >= initialPosition ? 1 : -1;
      const state =
        dream || Math.abs(target - initialPosition) < 0.5
          ? ""
          : direction > 0
            ? "opening"
            : "closing";
      state4 = {
        direction,
        target,
        state,
        initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (airer ? 120000 : 10000),
      };
      syncVisualState(target, state);
    };
    const runHelper2 = (arg, { primary = false } = {}) => {
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
          coverDetailsControlsEl.setDreamCurtainRetracted?.(
            event1,
            physicalState === "opening" || physicalState === "closing",
          );
        }
      }
      if (!position3) {
        if (state4) {
          const nowMs = Date.now();
          const {
            direction,
            target,
            state: state8,
          } = state4;
          const state9 = coverPositionReachedTarget(state7, target, direction);
          const state10 =
            (target <= 0.5 && text2 === "closed") ||
            (target >= 99.5 && text2 === "open");
          const numeric = Number(numeric?.state);
          const finiteNumber =
            airer &&
            state4.sawMotorRunning &&
            Number.isFinite(numeric) &&
            Math.abs(numeric) < 0.5;
          if (
            airer
              ? state10 || (finiteNumber && state9)
              : state9 || state10 || (target >= 99.5 && state7 >= 99.5)
          ) {
            runHelper1();
            if (airer) {
              state5 = target;
              state6 = Date.now() + 120000;
            }
            state4 = null;
            syncVisualState(target, text2 || (direction < 0 ? "closed" : "open"));
            return;
          }
          if (
            direction < 0
              ? state7 < state4.lastServerPosition - 0.5 ||
                text2 === "closing"
              : state7 > state4.lastServerPosition + 0.5 ||
                text2 === "opening"
          ) {
            state4.lastServerPosition =
              direction < 0
                ? Math.min(state4.lastServerPosition, state7)
                : Math.max(state4.lastServerPosition, state7);
            const position4 = coverPendingDisplayPosition(
              position,
              state7,
              direction,
            );
            syncVisualState(position4, state8);
            return;
          }
          if (
            nowMs < state4.ignoreStaleUntil ||
            (airer && nowMs < state4.expiresAt) ||
            (nowMs < state4.expiresAt &&
              Math.abs(state7 - state4.initialPosition) < 0.5)
          ) {
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
            value: state7,
          });
        } else {
          await this.callEntityService(
            "cover",
            tilt ? "set_cover_tilt_position" : "set_cover_position",
            entityId,
            {
              [tilt ? "tilt_position" : "position"]: numeric,
            },
          );
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
    coverDetailsControlsEl.syncCoverState = (arg) =>
      runHelper2(arg, {
        primary: true,
      });
    coverDetailsControlsEl.syncCoverPositionState = (arg) => {
      state1 = arg || state1;
      runHelper();
      runHelper2(position1);
    };
    coverDetailsControlsEl.syncCoverPositionCommandState = (arg) => {
      state2 = arg || state2;
      runHelper();
      runHelper2(position1);
    };
    coverDetailsControlsEl.syncAirerMotorState = (arg) => {
      numeric = arg || numeric;
      const numeric = Number(numeric?.state);
      if (state4 && Number.isFinite(numeric) && Math.abs(numeric) >= 0.5) {
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
      primary: true,
    });
    return coverDetailsControlsEl;
  }
  createClimateDetailsControls(
    entityId,
    component,
    {
      interactive = true,
      onPowerChange = null,
      onVisualChange = null,
      modeColors = {},
      deviceType = "air-conditioner",
    } = {},
  ) {
    const climateCapabilities = normalizeClimateCapabilities(component);
    const attributes = climateCapabilities.attributes;
    const climateDetailsControlsEl = String(entityId || "").split(".", 1)[0];
    const climateDetailsControlsEl1 = {
      entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations,
    };
    const element = document.createElement("section");
    element.className = "hb-climate-details-controls";
    element.dataset.climateDeviceType = deviceType;
    element.dataset.climateStructureKey = climateControlStructureKey(
      entityId,
      component,
      deviceType,
    );
    element.inert = !interactive;
    const currentTemperature = climateCapabilities.currentTemperature;
    const targetTemperature = climateCapabilities.targetTemperature;
    const minimumTemperature = climateCapabilities.minimumTemperature;
    const maximumTemperature = climateCapabilities.maximumTemperature;
    const temperatureStep = climateCapabilities.temperatureStep;
    const temperature =
      ["climate", "water_heater"].includes(climateDetailsControlsEl) &&
      climateCapabilities.supportsTargetTemperature;
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
    const scheduleTimeout1 = (arg) => {
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
    element6.textContent = Number.isFinite(currentTemperature)
      ? "当前温度 " + currentTemperature + "°C"
      : "当前温度 --";
    climateTemperatureContentEl.append(element4, element5, element6);
    element3.append(climateArcCapEl, climateArcCapEl1, climateTemperatureThumbEl, climateTemperatureContentEl);
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.className = "hb-climate-temperature-step";
    element7.textContent = "+";
    element7.setAttribute("aria-label", "提高设定温度");
    let entityState = component;
    const syncClimateControl = (arg) => climateEffectMode(arg, deviceType);
    const syncClimateControl1 = (arg = entityState) => {
      entityState = arg || entityState;
      const visualMode = syncClimateControl(entityState);
      const count = Math.max(
        0,
        Math.min(
          1,
          (previous - minimumTemperature) /
            Math.max(temperatureStep, maximumTemperature - minimumTemperature),
        ),
      );
      const state12 =
        visualMode === "cool"
          ? modeColors.cool || "#73c8ff"
          : visualMode === "heat"
            ? modeColors.heat || "#ff8a65"
            : modeColors.other || "#dce2e6";
      const accentColor =
        visualMode === "off"
          ? "#65717a"
          : visualMode === "cool"
            ? lerpHexColor(state12, "#ffffff", count * 0.32)
            : visualMode === "heat"
              ? lerpHexColor(state12, "#ffffff", (1 - count) * 0.3)
              : state12;
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
        targetTemperature: temperature ? previous : null,
      });
      const currentTemperature2 =
        normalizeClimateCapabilities(entityState).currentTemperature;
      element6.textContent =
        currentTemperature2 !== null
          ? "当前温度 " + currentTemperature2 + "°C"
          : "当前温度 --";
      const syncClimateControl3 = (arg1) =>
        arg1 === "set_hvac_mode"
          ? entityState?.state
          : arg1 === "set_fan_mode"
            ? entityState?.attributes?.fan_mode
            : arg1 === "set_swing_mode"
              ? entityState?.attributes?.swing_mode
              : arg1 === "set_swing_horizontal_mode"
                ? entityState?.attributes?.swing_horizontal_mode
                : arg1 === "set_preset_mode"
                  ? entityState?.attributes?.preset_mode
                  : arg1 === "set_operation_mode"
                    ? entityState?.attributes?.operation_mode
                    : null;
      for (const element8 of element.querySelectorAll(
        "button[data-climate-service]",
      )) {
        const climateService = element8.dataset.climateService;
        const state13 = syncClimateControl3(climateService);
        element8.classList.toggle(
          "active",
          element8.dataset.climateValue === String(state13 ?? ""),
        );
      }
      for (const item of element.querySelectorAll(
        ".hb-climate-select[data-climate-service]",
      )) {
        const text = String(syncClimateControl3(item.dataset.climateService) ?? "");
        item.dataset.currentValue = text;
        const element8 = Array.from(
          item.querySelectorAll('[role="option"]'),
        ).find((arg1) => arg1.dataset.value === text);
        const element9 = item.querySelector(
          ".hb-climate-select-trigger > span",
        );
        if (element9) {
          element9.textContent = element8?.textContent || text || "请选择";
          element9.title = element9.textContent;
        }
        item.querySelectorAll('[role="option"]').forEach((element10) => {
          const state13 = element10.dataset.value === text;
          element10.classList.toggle("active", state13);
          element10.setAttribute("aria-selected", String(state13));
        });
      }
    };
    const syncAriaState = (arg = false) => {
      element5.innerHTML = temperature ? previous + "<small>°C</small>" : "--";
      const temperature2 =
        ((previous - minimumTemperature) /
          Math.max(temperatureStep, maximumTemperature - minimumTemperature)) *
        75;
      const count = Math.max(0, Math.min(75, temperature2));
      element3.style.setProperty(
        "--hb-climate-temperature-progress",
        count + "%",
      );
      element3.style.setProperty(
        "--hb-climate-thumb-angle",
        225 + (count / 75) * 270 + "deg",
      );
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
        window.requestAnimationFrame(() =>
          element5.classList.add("is-changing"),
        );
      }
    };
    let state3 = previous;
    const state4 = [];
    let state5 = null;
    let state6 = previous;
    let state7 = false;
    let state8 = null;
    const runHelper = (arg, arg2) =>
      arg !== null &&
      arg2 !== null &&
      Math.abs(arg - arg2) < 1e-8;
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
        await this.callEntityService(
          climateDetailsControlsEl === "climate" ? "climate" : climateDetailsControlsEl,
          "set_temperature",
          entityId,
          {
            temperature,
          },
        );
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
    const scheduleTimeout3 = ({ preserveIntermediateSteps = true } = {}) => {
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
    const syncClimateControl2 = (arg) => {
      if (!interactive || !temperature) {
        return;
      }
      const temperature2 = previous;
      const asString = String(temperatureStep).split(".")[1]?.length || 0;
      previous = Number(
        Math.max(
          minimumTemperature,
          Math.min(maximumTemperature, previous + arg * temperatureStep),
        ).toFixed(asString),
      );
      if (previous !== temperature2) {
        syncAriaState(true);
        scheduleTimeout3();
      }
    };
    const measureElementBox = (event1) => {
      const domRect = element3.getBoundingClientRect();
      const size = domRect.left + domRect.width / 2;
      const size1 = domRect.top + domRect.height / 2;
      const event2 = event1.clientX - size;
      const state12 = event1.clientY - size1;
      const state13 =
        ((Math.atan2(event2, -state12) * 180) / Math.PI + 360) % 360;
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
      return Number(
        (
          minimumTemperature +
          Math.round(
            ((maximumTemperature - minimumTemperature) * count) /
              temperatureStep,
          ) *
            temperatureStep
        ).toFixed(asString),
      );
    };
    let event = null;
    element3.addEventListener("pointerdown", (event) => {
      if (!interactive || !temperature) {
        return;
      }
      const event1 = element3.getBoundingClientRect();
      const size = Math.min(event1.width, event1.height) / 2;
      const event2 = Math.hypot(
        event.clientX - (event1.left + event1.width / 2),
        event.clientY - (event1.top + event1.height / 2),
      );
      if (event.target === climateTemperatureThumbEl || !(Math.abs(event2 - size) > 34)) {
        event.preventDefault();
        event = {
          pointerId: event.pointerId,
          previous,
        };
        element3.setPointerCapture(event.pointerId);
        element3.classList.add("is-dragging");
        previous = measureElementBox(event);
        syncAriaState();
      }
    });
    element3.addEventListener("pointermove", (event1) => {
      if (!!event && event1.pointerId === event.pointerId) {
        previous = measureElementBox(event1);
        syncAriaState();
      }
    });
    const state10 = (event1) => {
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
          preserveIntermediateSteps: false,
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
    const waterHeaterControlPanelEl =
      deviceType === "water-heater" ? document.createElement("section") : null;
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
      presentation = "auto",
    }) => {
      const set = [
        ...new Set(
          (Array.isArray(values1) ? values1 : [])
            .map((arg) => String(arg ?? "").trim())
            .filter(Boolean),
        ),
      ];
      if (!set.length) {
        return;
      }
      const state12 =
        presentation === "auto"
          ? climateOptionPresentation(set, labels1)
          : presentation;
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
        const syncVisualState = (arg) => {
          const text = String(arg ?? "");
          climateSelectEl.dataset.currentValue = text;
          const element12 = Array.from(
            climateSelectMenuEl1.querySelectorAll('[role="option"]'),
          ).find((arg1) => arg1.dataset.value === text);
          element11.textContent = element12?.textContent || text || "请选择";
          element11.title = element11.textContent;
          climateSelectMenuEl1.querySelectorAll('[role="option"]').forEach((element13) => {
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
          const clamped = Math.min(
            Math.max(domRect.width, 190),
            Math.max(190, innerWidth - 20),
          );
          climateSelectMenuEl1.style.width = clamped + "px";
          climateSelectMenuEl1.style.maxHeight =
            Math.min(360, Math.max(120, innerHeight - 20)) + "px";
          const size = Math.min(climateSelectMenuEl1.scrollHeight || 0, 360);
          const size1 = innerHeight - domRect.bottom - 10;
          const size2 = domRect.top - 10;
          const clamped1 =
            size1 < Math.min(size, 180) && size2 > size1
              ? Math.max(10, domRect.top - size - 5)
              : Math.min(innerHeight - size - 10, domRect.bottom + 5);
          climateSelectMenuEl1.style.left =
            Math.max(10, Math.min(domRect.left, innerWidth - clamped - 10)) +
            "px";
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
              (
                climateSelectMenuEl1.querySelector('[aria-selected="true"]') ||
                climateSelectMenuEl1.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const invokeEntityService = async (state) => {
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
              [dataKey]: state,
            });
            const attributes2 = {
              ...(entityState?.attributes || {}),
              [dataKey]: state,
            };
            if (service === "set_hvac_mode") {
              entityState = {
                ...(entityState || {}),
                state,
                attributes: {
                  ...attributes2,
                  hvac_action:
                    state === "cool"
                      ? "cooling"
                      : state === "heat"
                        ? "heating"
                        : state === "off"
                          ? "off"
                          : state,
                },
              };
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const trimmed =
                deviceType === "bath-heater" &&
                ["idle", "standby", "待机", "关闭"].includes(
                  String(state).trim().toLowerCase(),
                );
              const found =
                element.dataset.lastClimateMode ||
                climateCapabilities.hvacModes.find(
                  (arg) => arg !== "off",
                ) ||
                (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const state14 = {
                ...(entityState || {}),
                state: trimmed
                  ? "off"
                  : climateIsPoweredOn(entityState, deviceType)
                    ? entityState?.state
                    : found,
                attributes: {
                  ...attributes2,
                  preset_mode: state,
                },
              };
              const state15 = climateEffectMode(state14, deviceType);
              state14.attributes.hvac_action = trimmed
                ? "idle"
                : state15 === "cool"
                  ? "cooling"
                  : state15 === "heat"
                    ? "heating"
                    : "fan";
              entityState = state14;
              onPowerChange?.(!trimmed);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...attributes2,
                  operation_mode: state,
                },
              };
              onPowerChange?.(state !== "off");
            } else {
              entityState = {
                ...(entityState || {}),
                attributes: attributes2,
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
        element10.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState2(true);
          }
        });
        climateSelectMenuEl1.addEventListener("keydown", (event) => {
          const matchedEl = [...climateSelectMenuEl1.querySelectorAll('[role="option"]')];
          const state14 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState1();
            element10.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state15 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[
              (state14 + state15 + matchedEl.length) % matchedEl.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        climateSelectMenuEl1.addEventListener("toggle", (arg) => {
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
          const trimmed =
            deviceType === "bath-heater" &&
            service === "set_preset_mode" &&
            ["idle", "standby", "待机", "关闭"].includes(
              String(state).trim().toLowerCase(),
            );
          climateDetailsOptionsEl.querySelectorAll("button").forEach((arg) => {
            arg.disabled = true;
          });
          try {
            await this.callEntityService(domain, service, entityId, {
              [dataKey]: state,
            });
            if (trimmed) {
              const state13 = climatePowerCommand(
                entityId,
                entityState,
                false,
                "bath-heater",
              );
              await this.callEntityService(
                state13.domain,
                state13.service,
                entityId,
                state13.data,
              );
            }
            climateDetailsOptionsEl
              .querySelectorAll("button")
              .forEach((element13) =>
                element13.classList.toggle("active", element13 === element10),
              );
            if (service === "set_hvac_mode") {
              const hvac_action =
                state === "cool"
                  ? "cooling"
                  : state === "heat"
                    ? "heating"
                    : state === "off"
                      ? "off"
                      : state;
              entityState = {
                ...(entityState || {}),
                state,
                attributes: {
                  ...(entityState?.attributes || {}),
                  hvac_action,
                },
              };
              syncClimateControl1();
              onPowerChange?.(state !== "off");
            } else if (service === "set_preset_mode") {
              const state13 = trimmed;
              const found =
                element.dataset.lastClimateMode ||
                climateCapabilities.hvacModes.find(
                  (arg) => arg !== "off",
                ) ||
                (climateDetailsControlsEl === "fan" ? "on" : "auto");
              const state14 = {
                ...(entityState || {}),
                state: state13
                  ? "off"
                  : climateIsPoweredOn(entityState, deviceType)
                    ? entityState?.state
                    : found,
                attributes: {
                  ...(entityState?.attributes || {}),
                  preset_mode: state,
                },
              };
              const state15 = climateEffectMode(state14, deviceType);
              state14.attributes.hvac_action = state13
                ? "idle"
                : state15 === "cool"
                  ? "cooling"
                  : state15 === "heat"
                    ? "heating"
                    : "fan";
              entityState = state14;
              syncClimateControl1();
              onPowerChange?.(!state13);
            } else if (service === "set_operation_mode") {
              entityState = {
                ...(entityState || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...(entityState?.attributes || {}),
                  operation_mode: state,
                },
              };
              syncClimateControl1();
              onPowerChange?.(state !== "off");
            }
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            climateDetailsOptionsEl.querySelectorAll("button").forEach((arg) => {
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
    const labels = Object.fromEntries(
      values.map((arg) => [
        arg,
        climateModeLabel(arg, deviceType, climateDetailsControlsEl1),
      ]),
    );
    const icons = Object.fromEntries(
      values.map((arg) => [arg, climateModeIcon(arg, deviceType)]),
    );
    createChildElement({
      label: "运行模式",
      values,
      current: String(
        deviceType === "water-heater"
          ? attributes.operation_mode || ""
          : component?.state || "",
      ),
      service:
        deviceType === "water-heater" ? "set_operation_mode" : "set_hvac_mode",
      dataKey: deviceType === "water-heater" ? "operation_mode" : "hvac_mode",
      labels,
      icons,
      className: "mode-options",
      domain: deviceType === "water-heater" ? "water_heater" : "climate",
      presentation: climateOptionPresentation(values, labels),
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
        max: "Max档",
      };
      const fan_mode = state11.find((climateFanSliderEl3) =>
        ["auto", "自动"].includes(String(climateFanSliderEl3).toLowerCase()),
      );
      const climateFanSliderEl1 = state11.filter((climateFanSliderEl3) => climateFanSliderEl3 !== fan_mode);
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
      const runHelper4 = (climateFanAutoEl) =>
        state12[String(climateFanSliderEl1[climateFanAutoEl]).toLowerCase()] ||
        climateFanSliderEl1[climateFanAutoEl] ||
        "--";
      const element12 = document.createElement("button");
      element12.type = "button";
      element12.className = "hb-climate-fan-auto";
      element12.textContent = "自动";
      element12.hidden = !fan_mode;
      element12.classList.toggle("active", state13);
      const applyElementStyle = () => {
        const numeric = Number(element11.value);
        const state14 =
          climateFanSliderEl1.length > 1 ? (numeric / (climateFanSliderEl1.length - 1)) * 100 : 100;
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
            fan_mode: fan_mode3,
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
              fan_mode,
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
      climateFanSliderEl = (arg) => {
        const fanPercentage =
          normalizeClimateCapabilities(arg).fanPercentage;
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
        const percentage = Math.max(
          0,
          Math.min(100, Number(element11.value) || 0),
        );
        element11.disabled = true;
        try {
          await this.callEntityService("fan", "set_percentage", entityId, {
            percentage,
          });
          count = percentage;
          entityState = {
            ...(entityState || {}),
            state: percentage > 0 ? "on" : "off",
            attributes: {
              ...(entityState?.attributes || {}),
              percentage,
            },
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
    const labels2 = Object.fromEntries(
      climateCapabilities.swingModes.map((arg) => [
        arg,
        climateSwingModeLabel(arg, "vertical", climateDetailsControlsEl1),
      ]),
    );
    createChildElement({
      label: climateCapabilities.horizontalSwingModes.length
        ? "纵向摆风"
        : "摆风",
      values: climateCapabilities.swingModes,
      current: attributes.swing_mode,
      service: "set_swing_mode",
      dataKey: "swing_mode",
      labels: labels2,
      icons: {
        off: "—",
        vertical: "↕",
        horizontal: "↔",
        both: "✣",
      },
      className: "compact-options",
      presentation: climateOptionPresentation(
        climateCapabilities.swingModes,
        labels2,
        {
          inlineIcon: true,
        },
      ),
    });
    const labels3 = Object.fromEntries(
      climateCapabilities.horizontalSwingModes.map((arg) => [
        arg,
        climateSwingModeLabel(arg, "horizontal", climateDetailsControlsEl1),
      ]),
    );
    createChildElement({
      label: "水平摆风",
      values: climateCapabilities.horizontalSwingModes,
      current: attributes.swing_horizontal_mode,
      service: "set_swing_horizontal_mode",
      dataKey: "swing_horizontal_mode",
      labels: labels3,
      className: "compact-options",
      presentation: climateOptionPresentation(
        climateCapabilities.horizontalSwingModes,
        labels3,
        {
          inlineIcon: true,
        },
      ),
    });
    const labels4 = Object.fromEntries(
      climateCapabilities.presetModes.map((arg) => [
        arg,
        climateModeLabel(arg, deviceType, climateDetailsControlsEl1),
      ]),
    );
    const icons2 = Object.fromEntries(
      climateCapabilities.presetModes.map((arg) => [
        arg,
        climateModeIcon(arg, deviceType),
      ]),
    );
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
      presentation: climateOptionPresentation(
        climateCapabilities.presetModes,
        labels4,
        {
          inlineIcon: true,
        },
      ),
    });
    let runHelper3 = null;
    if (!element.childElementCount) {
      const element8 = document.createElement("section");
      element8.className = "hb-climate-details-loading";
      const iconEl = document.createElement("i");
      iconEl.setAttribute("aria-hidden", "true");
      const element9 = document.createElement("strong");
      const element10 = document.createElement("span");
      runHelper3 = (arg) => {
        const asString = String(arg?.state || "")
          .trim()
          .toLowerCase();
        const state12 = !arg || !asString || asString === "unknown";
        const state13 = asString === "unavailable";
        element8.classList.toggle("is-loading", state12);
        element8.classList.toggle("is-unavailable", state13);
        element9.textContent = state12
          ? "正在加载设备状态…"
          : state13
            ? "设备当前不可用"
            : "暂无可用控制数据";
        element10.textContent = state12
          ? "状态到达后会自动显示，无需重新打开弹窗"
          : state13
            ? "连接恢复后会自动更新"
            : "请检查该实体在 Home Assistant 中提供的控制能力";
      };
      runHelper3(component);
      element8.append(iconEl, element9, element10);
      element.append(element8);
    }
    element.syncClimateGrid = () => {
      const state12 = Array.from(element.children);
      const found = state12.find((element8) =>
        element8.classList.contains("hb-climate-thermostat"),
      );
      if (!found) {
        return;
      }
      const found1 = state12.find((element8) =>
        element8.classList.contains("is-water-heater"),
      );
      const length = state12.filter(
        (arg) => arg !== found && arg !== found1,
      ).length;
      found.style.gridRow = "1 / span " + Math.max(1, length);
      if (found1) {
        found1.style.gridRow = "1 / span " + Math.max(1, length);
      }
    };
    element.syncClimateGrid();
    element.syncClimateState = (arg) => {
      if (!arg) {
        return;
      }
      entityState = arg;
      runHelper3?.(arg);
      climateFanSliderEl?.(arg);
      const targetTemperature2 =
        normalizeClimateCapabilities(arg).targetTemperature;
      const temperature2 = reconcileClimateTargetTemperature(
        state6,
        targetTemperature2,
        state,
        temperatureStep,
      );
      if (state === null || temperature2.confirmed) {
        state6 = temperature2.temperature;
      }
      previous = state6;
      if (
        targetTemperature2 !== null &&
        (state === null || temperature2.confirmed)
      ) {
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
  createWaterHeaterExtensionControls(
    entityId1,
    {
      component = null,
      interactive = true,
      excludedEntityIds = [],
    } = {},
  ) {
    const state = component
      ? relatedPopupContext(
          component,
          this.entityMetadata,
          this.deviceMetadata,
          this.states,
        )
      : null;
    const state1 = component
      ? selectedRelatedEntities(
          component,
          this.entityMetadata,
          this.deviceMetadata,
          this.states,
        )
      : null;
    const allowed = new Set(excludedEntityIds);
    const filtered = (
      state1 === null
        ? relatedWaterHeaterEntities(this.entityMetadata, entityId1)
        : state1
    ).filter((relatedEntityExtensionsEl2) => !allowed.has(relatedEntityExtensionsEl2.entityId));
    const relatedEntityExtensionsEl = state?.primary || this.entityMetadata.get(entityId1);
    if (!filtered.length) {
      return null;
    }
    const relatedEntityExtensionsEl1 = document.createElement("section");
    relatedEntityExtensionsEl1.className =
      "hb-related-entity-extensions hb-water-heater-extensions" +
      (state?.deviceType ? " is-" + state.deviceType : "");
    relatedEntityExtensionsEl1.dataset.controlSource =
      state1 === null ? "automatic-device" : "user-selected";
    const index = new Map();
    const resolveEntityId = (entityId) => {
      const state2 = this.states.get(entityId);
      return (
        state2?.newState ||
        state2 || {
          entityId,
          state: "unknown",
          attributes: {},
        }
      );
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
      const waterHeaterExtensionToggleEl = state
        ? relatedEntityLabel(state, metadata)
        : waterHeaterRelatedEntityLabel(relatedEntityExtensionsEl, metadata);
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
          element3.textContent = state4
            ? "不可用"
            : state5
              ? "已开启"
              : "已关闭";
        };
        element.addEventListener("click", async () => {
          if (
            !interactive ||
            state3 ||
            element.classList.contains("is-unavailable")
          ) {
            return;
          }
          const state4 = state2;
          const asString = String(state2?.state || "").toLowerCase() !== "on";
          state3 = true;
          syncVisualState({
            ...(state2 || {}),
            state: asString ? "on" : "off",
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
        relatedSelectMenuEl1.id =
          "hb-related-select-" +
          String(this.renderNamespace || "runtime").replace(
            /[^a-z0-9_-]/gi,
            "-",
          ) +
          "-" +
          entityId.replace(/[^a-z0-9_-]/gi, "-");
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
          attributes: ["options", "option"],
        };
        const syncClimateControl = (arg) =>
          state?.deviceType === "bath-heater"
            ? climateModeLabel(arg, "bath-heater", state4)
            : String(arg || "");
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
          const clamped = Math.min(
            Math.max(domRect.width, 132),
            Math.max(132, innerWidth - 16),
          );
          relatedSelectMenuEl1.style.width = clamped + "px";
          relatedSelectMenuEl1.style.maxHeight =
            Math.min(216, Math.max(88, innerHeight - 16)) + "px";
          const size = Math.min(relatedSelectMenuEl1.scrollHeight || 0, 216);
          const size1 = innerHeight - domRect.bottom - 8;
          const size2 = domRect.top - 8;
          const clamped1 =
            size1 < Math.min(size, 140) && size2 > size1
              ? Math.max(8, domRect.top - size - 4)
              : Math.min(innerHeight - size - 8, domRect.bottom + 4);
          relatedSelectMenuEl1.style.left =
            Math.max(8, Math.min(domRect.left, innerWidth - clamped - 8)) +
            "px";
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
              (
                relatedSelectMenuEl1.querySelector('[aria-selected="true"]') ||
                relatedSelectMenuEl1.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const invokeEntityService = async (state) => {
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
              options,
            },
          });
          try {
            const state6 = relatedEntitySelectService(text);
            if (!state6) {
              throw new Error("实体 " + entityId + " 不支持选项服务。");
            }
            await this.callEntityService(
              state6.domain,
              state6.service,
              entityId,
              {
                option: state,
              },
            );
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
          relatedSelectMenuEl1.replaceChildren(
            ...relatedSelectOptionEl.map((relatedSelectOptionEl2) => {
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
            }),
          );
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
            for (const element4 of relatedSelectMenuEl1.querySelectorAll(
              '[role="option"]',
            )) {
              const state6 = element4.dataset.value === text3;
              element4.classList.toggle("active", state6);
              element4.setAttribute("aria-selected", String(state6));
            }
          }
          if (
            text3 &&
            !["unknown", "unavailable"].includes(text3.toLowerCase())
          ) {
            text2 = text3;
          }
          element3.textContent = text2
            ? syncClimateControl(text2)
            : state5.length
              ? syncClimateControl(state5[0])
              : "无选项";
          element3.title = element3.textContent;
          element2.disabled =
            !interactive ||
            state2 ||
            !state5.length ||
            text3.toLowerCase() === "unavailable";
        };
        element2.addEventListener("click", () => {
          if (computeResult() || relatedSelectMenuEl1.dataset.open === "true") {
            syncAriaState();
          } else {
            syncAriaState1();
          }
        });
        element2.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            syncAriaState1(true);
          }
        });
        relatedSelectMenuEl1.addEventListener("keydown", (event) => {
          const matchedEl = [...relatedSelectMenuEl1.querySelectorAll('[role="option"]')];
          const state5 = matchedEl.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            syncAriaState();
            element2.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const state6 = event.key === "ArrowDown" ? 1 : -1;
            matchedEl[
              (state5 + state6 + matchedEl.length) % matchedEl.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        relatedSelectMenuEl1.addEventListener("toggle", (arg) => {
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
            step,
          };
        };
        const runHelper2 = (arg = entityState) => {
          entityState = arg || entityState;
          const numeric2 = Number(entityState?.state);
          const finiteNumber =
            !Number.isFinite(numeric2) ||
            ["unknown", "unavailable"].includes(
              String(entityState?.state || "").toLowerCase(),
            );
          if (!finiteNumber) {
            numeric = numeric2;
          }
          const text2 = String(entityState?.attributes?.unit_of_measurement || "");
          element3.textContent = finiteNumber ? "--" : "" + numeric2 + text2;
          element2.disabled = !interactive || state2 || finiteNumber;
          element4.disabled = !interactive || state2 || finiteNumber;
        };
        const invokeEntityService = async (arg) => {
          if (!interactive || state2 || !Number.isFinite(numeric)) {
            return;
          }
          const { minimum, maximum, step } = runHelper1();
          const asString = String(step).split(".")[1]?.length || 0;
          const asNumber = Number(
            Math.max(
              minimum,
              Math.min(maximum, numeric + arg * step),
            ).toFixed(asString),
          );
          if (asNumber === numeric) {
            return;
          }
          const state3 = entityState;
          state2 = true;
          runHelper2({
            ...(entityState || {}),
            state: String(asNumber),
          });
          try {
            await this.callEntityService(text, "set_value", entityId, {
              value: asNumber,
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
        const runHelper1 = (arg) => {
          const asString =
            String(arg?.state || "").toLowerCase() === "unavailable";
          element.disabled = !interactive || state2 || asString;
        };
        element.addEventListener("click", async () => {
          if (
            !!interactive &&
            !state2 &&
            !element.disabled &&
            (!relatedEntityNeedsConfirmation(metadata) ||
              !!window.confirm("确认执行“" + waterHeaterExtensionToggleEl + "”吗？"))
          ) {
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
        const syncVisualState = (entityState) => {
          const text2 = String(entityState?.state || "unknown");
          const lowered = ["unknown", "unavailable"].includes(
            text2.toLowerCase(),
          );
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
    relatedEntityExtensionsEl1.relatedEntityIds = filtered.map((bathHeaterLightControlEl) => bathHeaterLightControlEl.entityId);
    return relatedEntityExtensionsEl1;
  }
  createBathHeaterLightControl(
    entityId,
    component,
    { interactive = true, onStateChange = null } = {},
  ) {
    const element = document.createElement("section");
    element.className = "hb-bath-heater-light-control";
    const spanEl = document.createElement("span");
    const element2 = document.createElement("i");
    element2.setAttribute("aria-hidden", "true");
    element2.textContent = "☀";
    const element3 = document.createElement("strong");
    element3.textContent = String(
      component?.attributes?.friendly_name || "浴霸灯",
    );
    const element4 = document.createElement("output");
    spanEl.append(element2, element3, element4);
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.disabled = !interactive;
    let state = component;
    let state1 = false;
    const syncVisualState = (arg = state) => {
      state = arg || state;
      const unavailable = ["unknown", "unavailable"].includes(
        String(state?.state || ""),
      );
      const isOn = state?.state === "on";
      element.classList.toggle("is-on", isOn && !unavailable);
      element.classList.toggle("is-unavailable", unavailable);
      element4.textContent = unavailable
        ? "不可用"
        : isOn
          ? "已开启"
          : "已关闭";
      element5.textContent = isOn ? "关闭灯光" : "开启灯光";
      element5.disabled = !interactive || state1 || unavailable;
      element5.setAttribute("aria-pressed", String(isOn));
      onStateChange?.({
        isOn,
        unavailable,
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
        state: state?.state === "on" ? "off" : "on",
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
  showElectricBedLoadingDetails(component, { preview: _ = false } = {}) {
    if (!component.bindings?.entity?.entityId) {
      return;
    }
    this.closeRuntimeDialog();
    const detailsDialog = document.createElement("dialog");
    detailsDialog.className =
      "hb-entity-details-dialog electric-bed-details electric-bed-loading-details";
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
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(detailsDialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = detailsDialog;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, detailsDialog, 760, 420);
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, detailsDialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        detailsDialog.close();
      }
    });
    detailsDialog.addEventListener(
      "close",
      () => {
        this.clearRuntimeDialogScale(detailsDialog);
        if (this.detailsDialog === detailsDialog) {
          this.detailsDialog = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    detailsDialog.show();
    detailsDialog.focus({
      preventScroll: true,
    });
  }
  showElectricBedDetails(component, { preview = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该电动床控件没有关联实体。");
    }
    const state = this.deviceProfile(entityId);
    const state1 = state?.roles || {};
    const filtered = [
      ["backrest", "靠背角度"],
      ["leg", "腿部角度"],
      ["waist", "腰部角度"],
    ]
      .map(([role, label]) => ({
        role,
        label,
        entityId: String(state1[role] || ""),
      }))
      .filter((arg) => arg.entityId);
    const text = String(state1.mode || "");
    const entityId1 = this.entityMetadata.get(entityId);
    const filtered1 = entityId1?.deviceId
      ? [...this.entityMetadata.values()]
          .filter(
            (metadata) =>
              metadata.deviceId === entityId1.deviceId &&
              ["button", "select"].includes(
                String(metadata.domain || metadata.entityId || "").split(
                  ".",
                  1,
                )[0],
              ) &&
              metadata.entityId !== state1.mode &&
              entityMetadataIsAvailable(metadata),
          )
          .sort((arg, arg2) =>
            String(arg.entityId || "").localeCompare(
              String(arg2.entityId || ""),
            ),
          )
          .map((arg) => arg.entityId)
      : [];
    const entityDetailsDialogEl = [
      ...new Set(
        [
          String(state1.memory1 || ""),
          String(state1.memory2 || ""),
          ...filtered1,
        ].filter(Boolean),
      ),
    ].slice(0, 2);
    this.closeRuntimeDialog();
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog electric-bed-details";
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      state?.deviceName || "电动床",
    );
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
        value: strongEl,
      };
    };
    const element4 = buildElementTree("back", "靠背");
    const element5 = buildElementTree("waist", "腰部");
    const element6 = buildElementTree("legs", "腿部");
    const element7 = document.createElement("strong");
    const element8 = document.createElement("small");
    electricBedVisualEl.append(
      electricBedModelEl,
      element4.readout,
      element5.readout,
      element6.readout,
      element7,
      element8,
    );
    const electricBedUtilitiesEl = document.createElement("section");
    electricBedUtilitiesEl.className = "hb-electric-bed-utilities";
    const electricBedMainEl = document.createElement("section");
    electricBedMainEl.className = "hb-electric-bed-main";
    const electricBedAngleControlsEl = document.createElement("section");
    electricBedAngleControlsEl.className = "hb-electric-bed-angle-controls";
    const handlers = new Map();
    const state2 = [];
    const resolveEntityId = (entityId2) => {
      const state3 = this.states.get(entityId2);
      return (
        state3?.newState ||
        state3 || {
          entityId: entityId2,
          state: "unknown",
          attributes: {},
        }
      );
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
      const element12 = this.createCapabilityDetailsControls(
        entityId2,
        electricBedControlEl1,
        {
          interactive: !preview,
          variant,
        },
      );
      element12.classList.add("hb-electric-bed-capability");
      element10.append(element11, element12);
      electricBedControlEl.append(element10);
      const sync = (arg) => element12.syncCapabilityState?.(arg);
      handlers.set(entityId2, [sync]);
      state2.push({
        role,
        entityId: entityId2,
        sync,
        cleanup: () => element12.cleanupCapabilityDetails?.(),
      });
    };
    for (const electricBedControlEl of filtered) {
      syncVisualState(electricBedControlEl.label, electricBedControlEl.entityId);
    }
    if (text) {
      syncVisualState("模式", text, "electric-bed", electricBedUtilitiesEl);
    } else {
      const electricBedControlEl = document.createElement("section");
      electricBedControlEl.className =
        "hb-electric-bed-control hb-electric-bed-mode is-unavailable";
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
        electricBedMemoryControlEl1.className =
          "hb-electric-bed-memory-control hb-electric-bed-control";
        const element11 = document.createElement("strong");
        element11.textContent = "记忆姿势 " + (state3 + 1);
        const element12 = this.createCapabilityDetailsControls(
          entityId2,
          resolveEntityId(entityId2),
          {
            interactive: !preview,
            variant: "electric-bed-memory",
            selectLabel: "姿势",
          },
        );
        element12.classList.add("hb-electric-bed-capability");
        electricBedMemoryControlEl1.append(element11, element12);
        electricBedMemoryListEl.append(electricBedMemoryControlEl1);
        const sync = (arg) => element12.syncCapabilityState?.(arg);
        handlers.set(entityId2, [sync]);
        state2.push({
          role: "memory" + (state3 + 1),
          entityId: entityId2,
          sync,
          cleanup: () => element12.cleanupCapabilityDetails?.(),
        });
        continue;
      }
      const element10 = document.createElement("button");
      element10.type = "button";
      element10.className = "hb-electric-bed-memory-button";
      element10.textContent =
        electricBedMemoryControlEl?.name || electricBedMemoryControlEl?.originalName || "记忆姿势 " + (state3 + 1);
      element10.disabled = preview || !entityId2;
      element10.classList.toggle("is-unavailable", !entityId2);
      element10.addEventListener("click", async () => {
        if (!preview && !!entityId2 && !element10.disabled) {
          element10.disabled = true;
          element10.classList.add("is-pending");
          try {
            await this.callEntityService("button", "press", entityId2);
            element10.classList.add("is-success");
            window.setTimeout(
              () => element10.classList.remove("is-success"),
              900,
            );
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
    dialog.append(entityDetailsCardEl);
    const clampNumber = (_, fallback) => {
      const numeric = Number(fallback?.state);
      const numeric2 = Number(fallback?.attributes?.min);
      const numeric3 = Number(fallback?.attributes?.max);
      if (Number.isFinite(numeric)) {
        if (
          !Number.isFinite(numeric2) ||
          !Number.isFinite(numeric3) ||
          numeric3 <= numeric2
        ) {
          return Math.max(0, Math.min(100, numeric));
        } else {
          return Math.max(
            0,
            Math.min(100, ((numeric - numeric2) / (numeric3 - numeric2)) * 100),
          );
        }
      } else {
        return 0;
      }
    };
    const applyElementStyle = () => {
      const state3 = resolveEntityId(state1.backrest);
      const state4 = resolveEntityId(state1.leg);
      const state5 = resolveEntityId(state1.waist);
      const runHelper = (entityState) => {
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
      electricBedVisualEl.style.setProperty(
        "--hb-bed-backrest-angle",
        clampNumber(state1.backrest, state3) * -0.42 + "deg",
      );
      electricBedVisualEl.style.setProperty(
        "--hb-bed-leg-angle",
        clampNumber(state1.leg, state4) * -0.28 + "deg",
      );
      electricBedVisualEl.style.setProperty(
        "--hb-bed-waist-angle",
        clampNumber(state1.waist, state5) * -0.1 + "deg",
      );
      const lowered = [state3, state4, state5].map((arg) =>
        String(arg?.state || "").toLowerCase(),
      );
      const state6 = lowered.some((arg) => arg === "unavailable");
      const state7 =
        !state6 &&
        lowered.some((arg) => arg === "unknown" || !arg);
      element7.textContent = state6
        ? "部分实体不可用"
        : state7
          ? "正在读取实体"
          : "设备在线";
      element8.textContent =
        filtered.length === 3 ? "三个角度独立控制" : "正在读取电动床实体";
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
      dialog,
      handlers,
    };
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, 760, 560);
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        for (const item of state2) {
          item.cleanup?.();
        }
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showVacuumDetails(component, { preview = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该扫地机器人控件没有关联实体。");
    }
    const state = selectedRelatedEntityIds(component);
    this.closeRuntimeDialog();
    const entityDetailsDialogEl = this.states.get(entityId);
    let entityDetailsDialogEl1 = entityDetailsDialogEl?.newState ||
      entityDetailsDialogEl || {
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog vacuum-details";
    const element = document.createElement("div");
    element.className = "hb-entity-details-card";
    element.classList.add("hb-vacuum-details-card");
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element2 = document.createElement("strong");
    const vacuumDetailsSubtitleEl =
      String(entityDetailsDialogEl1.attributes?.friendly_name || "扫地机器人").replace(
        /^\d+/,
        "",
      ) || "扫地机器人";
    element2.textContent = componentDialogTitle(component, vacuumDetailsSubtitleEl);
    const element3 = document.createElement("span");
    element3.className = "hb-vacuum-details-subtitle";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.setAttribute("aria-label", "关闭扫地机器人详情");
    element4.textContent = "×";
    divEl.append(element2, element3);
    entityDetailsHeadingEl.append(divEl, element4);
    const vacuumDetailsLayoutEl = document.createElement("div");
    vacuumDetailsLayoutEl.className = "hb-vacuum-details-layout";
    const vacuumDetailsOverviewEl = document.createElement("section");
    vacuumDetailsOverviewEl.className = "hb-vacuum-details-overview";
    const element5 = document.createElement("div");
    element5.className = "hb-vacuum-visual";
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
    const vacuumRobotBrushEl = document.createElement("i");
    vacuumRobotBrushEl.className = "hb-vacuum-robot-brush";
    const vacuumRobotMopEl = document.createElement("i");
    vacuumRobotMopEl.className = "hb-vacuum-robot-mop left";
    const vacuumRobotMopEl1 = document.createElement("i");
    vacuumRobotMopEl1.className = "hb-vacuum-robot-mop right";
    vacuumRobotEl.append(vacuumRobotLidarEl, vacuumRobotSensorEl, vacuumRobotBumperEl, vacuumRobotBrushEl, vacuumRobotMopEl, vacuumRobotMopEl1);
    const vacuumBatteryEl = document.createElement("div");
    vacuumBatteryEl.className = "hb-vacuum-battery";
    const element6 = document.createElement("strong");
    const element7 = document.createElement("small");
    element7.textContent = "电量";
    vacuumBatteryEl.append(element6, element7);
    vacuumBatteryRingEl.append(vacuumRobotEl);
    entityDetailsHeadingEl.append(vacuumBatteryEl);
    const element8 = document.createElement("span");
    element8.className = "hb-vacuum-visual-status";
    element5.append(vacuumBatteryRingEl, element8);
    const vacuumDetailsStatsEl = document.createElement("div");
    vacuumDetailsStatsEl.className = "hb-vacuum-details-stats";
    const syncAriaState = (vacuumDetailsStatValueEl, vacuumDetailsStatValueEl1) => {
      const vacuumDetailsStatValueEl2 = document.createElement("div");
      const vacuumDetailsStatValueEl3 = document.createElement("span");
      vacuumDetailsStatValueEl3.className = "hb-vacuum-details-stat-value";
      const element14 = document.createElement("i");
      element14.textContent = vacuumDetailsStatValueEl1;
      element14.setAttribute("aria-hidden", "true");
      const strongEl = document.createElement("strong");
      const element15 = document.createElement("small");
      element15.textContent = vacuumDetailsStatValueEl;
      vacuumDetailsStatValueEl3.append(element14, strongEl);
      vacuumDetailsStatValueEl2.append(vacuumDetailsStatValueEl3, element15);
      vacuumDetailsStatsEl.append(vacuumDetailsStatValueEl2);
      return strongEl;
    };
    const element9 = syncAriaState("本次面积", "◇");
    const element10 = syncAriaState("清扫时长", "◷");
    vacuumDetailsOverviewEl.append(element5, vacuumDetailsStatsEl);
    const element11 = document.createElement("section");
    element11.className = "hb-vacuum-details-controls";
    const element12 = document.createElement("div");
    element12.className = "hb-vacuum-details-actions";
    const syncAriaState1 = (arg, arg2, arg3, arg4) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.service = arg4;
      button.disabled = preview;
      const element14 = document.createElement("i");
      element14.textContent = arg3;
      element14.setAttribute("aria-hidden", "true");
      const spanEl = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = arg;
      const description = document.createElement("small");
      description.textContent = arg2;
      spanEl.append(name, description);
      button.append(element14, spanEl);
      element12.append(button);
      return {
        button,
        name,
        description,
      };
    };
    const size = [
      ["start", "开始清扫", "启动全屋任务", "▶"],
      ["pause", "暂停", "保留当前进度", "Ⅱ"],
      ["stop", "停止", "结束当前任务", "■"],
      ["return_to_base", "回充", "返回充电座", "⌂"],
      ["locate", "定位", "让设备发出声音", "◎"],
      ["clean_spot", "局部清扫", "清扫当前位置", "⌖"],
    ];
    const index = new Map(
      size.map(([arg, arg2, arg3, arg4]) => [
        arg,
        syncAriaState1(arg2, arg3, arg4, arg),
      ]),
    );
    const event = index.get("start");
    const event1 = index.get("pause");
    const event2 = index.get("stop");
    const event3 = index.get("return_to_base");
    const event4 = index.get("locate");
    const event5 = index.get("clean_spot");
    element11.append(element12);
    const runHelper = (arg) =>
      String(arg || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
    const labels = {
      sweeping: "扫地",
      mopping: "拖地",
      sweeping_and_mopping: "扫拖同步",
      mopping_after_sweeping: "先扫后拖",
    };
    const labels2 = {
      silent: "静音",
      quiet: "静音",
      standard: "标准",
      strong: "强力",
      turbo: "超强",
    };
    const state1 = [];
    const buildElementTree = ({
      label,
      detail,
      options: options1,
      current,
      labels: labels1,
      onSelect,
      enabled: enabled1 = true,
    }) => {
      if (!options1.length) {
        return null;
      }
      const group = document.createElement("section");
      group.className = "hb-vacuum-details-option-group";
      const divEl1 = document.createElement("div");
      const element14 = document.createElement("strong");
      element14.textContent = label;
      const element15 = document.createElement("small");
      element15.textContent = detail;
      divEl1.append(element14, element15);
      const vacuumDetailsOptionsEl = document.createElement("div");
      vacuumDetailsOptionsEl.className = "hb-vacuum-details-options";
      const entries = options1.map((arg) => {
        const key = runHelper(arg);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = labels1[key] || String(arg);
        button.disabled = preview || !enabled1;
        button.addEventListener("click", () => onSelect(arg, button));
        vacuumDetailsOptionsEl.append(button);
        return {
          button,
          key,
        };
      });
      const sync = (arg) => {
        const state13 = runHelper(arg);
        for (const event7 of entries) {
          event7.button.classList.toggle("active", event7.key === state13);
        }
      };
      sync(current);
      state1.push({
        group,
        sync,
      });
      group.append(divEl1, vacuumDetailsOptionsEl);
      element11.append(group);
      return {
        group,
        sync,
        entries,
      };
    };
    const state2 = entityDetailsDialogEl1.attributes || {};
    const state3 =
      "select." + entityId.slice(entityId.indexOf(".") + 1) + "_cleaning_mode";
    const state4 = relatedDeviceEntity(
      this.entityMetadata,
      entityId,
      "select",
      "cleaning_mode",
      state3,
    );
    const text = String(state4?.entityId || "");
    const state5 = text ? this.states.get(text) : null;
    let entityState = state5?.newState || state5 || null;
    const state6 = relatedVacuumBatteryEntity(
      this.entityMetadata,
      this.states,
      entityId,
    );
    const text2 = String(state6?.entityId || "");
    const state7 = text2 ? this.states.get(text2) : null;
    let state8 = state7?.newState || state7 || null;
    let event6 = null;
    const state9 = (arg) => {
      if (arg) {
        entityState = arg;
        event6?.sync(arg.state);
      }
    };
    let state10 = false;
    const syncVisualState = (arg) => {
      state10 = arg;
      element11.classList.toggle("is-pending", arg);
      for (const item of element11.querySelectorAll(
        ":scope > .hb-vacuum-details-actions button, :scope > .hb-vacuum-details-option-group button",
      )) {
        item.disabled =
          preview || arg || item.dataset.unsupported === "true";
      }
    };
    const invokeEntityService = async (
      arg,
      arg2,
      arg3,
      arg4,
      arg5 = null,
      runHelper6 = runHelper5,
      arg7 = entityDetailsDialogEl1,
    ) => {
      if (preview || state10) {
        return false;
      }
      if (arg5) {
        runHelper6(arg5);
      }
      syncVisualState(true);
      try {
        await this.callEntityService(arg, arg2, arg3, arg4);
        return true;
      } catch (error) {
        runHelper6(arg7);
        this.options.onError?.(error);
        return false;
      } finally {
        syncVisualState(false);
      }
    };
    const options = Array.isArray(entityState?.attributes?.options)
      ? entityState.attributes.options
      : Array.isArray(state2.cleaning_mode_list)
        ? state2.cleaning_mode_list
        : [];
    const enabled = !!text;
    event6 = buildElementTree({
      label: "清洁模式",
      detail: enabled ? "选择本次任务方式" : "当前设备未提供模式切换实体",
      options,
      current: entityState?.state || state2.cleaning_mode,
      labels,
      enabled,
      onSelect: async (onSelect) => {
        const onSelect2 = entityState || {
          state: state2.cleaning_mode || "unknown",
          attributes: {
            options,
          },
        };
        const onSelect3 = {
          ...onSelect2,
          state: onSelect,
          attributes: {
            ...(onSelect2.attributes || {}),
            options,
          },
        };
        await invokeEntityService(
          "select",
          "select_option",
          text,
          {
            option: onSelect,
          },
          onSelect3,
          state9,
          onSelect2,
        );
      },
    });
    if (event6 && !enabled) {
      for (const event7 of event6.entries) {
        event7.button.dataset.unsupported = "true";
      }
    }
    const options2 =
      Array.isArray(state2.fan_speed_list) && state2.fan_speed_list.length
        ? state2.fan_speed_list
        : Array.isArray(state2.suction_level_list)
          ? state2.suction_level_list
          : [];
    const state11 = buildElementTree({
      label: "吸力",
      detail: "按地面情况调节",
      options: options2,
      current: state2.fan_speed || state2.suction_level,
      labels: labels2,
      onSelect: async (fan_speed) => {
        const onSelect = entityDetailsDialogEl1;
        const onSelect2 = {
          ...onSelect,
          attributes: {
            ...(onSelect.attributes || {}),
            fan_speed,
            suction_level: fan_speed,
          },
        };
        await invokeEntityService(
          "vacuum",
          "set_fan_speed",
          entityId,
          {
            fan_speed,
          },
          onSelect2,
        );
      },
    });
    const filtered =
      state !== null
        ? this.createWaterHeaterExtensionControls(entityId, {
            component,
            interactive: !preview,
            excludedEntityIds: [text, text2].filter(Boolean),
          })
        : null;
    const element13 = document.createElement("p");
    element13.className = "hb-vacuum-details-warning";
    element11.append(element13);
    vacuumDetailsLayoutEl.append(vacuumDetailsOverviewEl, element11);
    element.append(entityDetailsHeadingEl, vacuumDetailsLayoutEl);
    if (filtered) {
      element.append(filtered);
      dialog.classList.add("has-related-extensions");
    }
    dialog.append(element);
    const runHelper1 = (entityState1) => {
      const entityState2 = entityState1?.attributes || {};
      if (entityState2.washing) {
        if (entityState2.washing_paused) {
          return "拖布清洗已暂停";
        } else {
          return "正在清洗拖布";
        }
      }
      if (entityState2.drying) {
        return "正在烘干拖布";
      }
      if (entityState2.draining) {
        return "正在排水";
      }
      if (entityState2.returning) {
        return "正在返回充电座";
      }
      if (entityState2.mapping) {
        return "正在绘制地图";
      }
      const asString = String(
        entityState2.vacuum_state || entityState1?.state || "",
      ).toLowerCase();
      return (
        {
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
          mapping: "正在绘制地图",
        }[asString] || String(entityState1?.state || "状态未知")
      );
    };
    const runHelper2 = (arg, arg2 = "--") =>
      Number.isFinite(Number(arg)) ? Number(arg) : arg2;
    const runHelper3 = (entityState1) => {
      const state13 = entityState1?.attributes || {};
      return (
        !!state13.running ||
        !!state13.returning ||
        !!state13.washing ||
        !!state13.drying ||
        !!state13.mapping ||
        ["cleaning", "returning"].includes(
          String(entityState1?.state || "").toLowerCase(),
        )
      );
    };
    const runHelper4 = () => {
      const state13 = vacuumBatteryPercent(entityDetailsDialogEl1, state8);
      element6.textContent =
        state13 === null ? "--" : Math.round(state13) + "%";
    };
    const state12 = (arg) => {
      state8 = arg || state8;
      runHelper4();
    };
    function runHelper5(entityState1) {
      if (!entityState1) {
        return;
      }
      entityDetailsDialogEl1 = entityState1;
      const event7 = entityState1.attributes || {};
      const state13 = runHelper1(entityState1);
      const state14 = runHelper3(entityState1);
      const event8 =
        !!event7.paused ||
        !!event7.washing_paused ||
        entityState1.state === "paused";
      const event9 = !!event7.returning || entityState1.state === "returning";
      const state15 = runHelper(event7.cleaning_mode);
      const state16 = [
        "sweeping",
        "sweeping_and_mopping",
        "mopping_after_sweeping",
      ].includes(state15);
      const state17 = [
        "mopping",
        "sweeping_and_mopping",
        "mopping_after_sweeping",
      ].includes(state15);
      const allowed = new Set(vacuumSupportedActions(entityState1));
      for (const [event13, event14] of index) {
        event14.button.hidden = !allowed.has(event13);
      }
      const event10 = [...index.values()].filter(
        (event13) => !event13.button.hidden,
      );
      const length = event10.length;
      element12.hidden = length === 0;
      element12.classList.toggle("has-many-actions", length > 3);
      for (const event13 of index.values()) {
        event13.button.classList.remove(
          "is-last-row-pair",
          "is-last-row-single",
        );
      }
      const event11 = length % 3 || Math.min(length, 3);
      if (event11 === 2) {
        for (const event13 of event10.slice(-2)) {
          event13.button.classList.add("is-last-row-pair");
        }
      } else if (event11 === 1) {
        event10.at(-1)?.button.classList.add("is-last-row-single");
      }
      element3.textContent = state13;
      element3.classList.toggle("is-active", state14 && !event8);
      element8.textContent = state13;
      runHelper4();
      element5.classList.toggle("is-working", state14 && !event8);
      element5.classList.toggle("is-paused", event8);
      element5.classList.toggle("is-returning", event9);
      element5.classList.toggle("is-sweeping", state16);
      element5.classList.toggle("is-mopping", state17);
      element9.textContent = runHelper2(event7.cleaned_area) + " m²";
      element10.textContent = runHelper2(event7.cleaning_time) + " min";
      event.button.classList.toggle(
        "active",
        state14 && !event8 && !event9,
      );
      event1.button.classList.toggle("active", event8);
      event2.button.classList.toggle("active", false);
      event3.button.classList.toggle("active", event9);
      event4.button.classList.toggle("active", false);
      event5.button.classList.toggle(
        "active",
        state14 && !event8 && !event9 && entityState1.state === "cleaning",
      );
      event.name.textContent = event8 ? "继续清扫" : "开始清扫";
      if (!text) {
        event6?.sync(event7.cleaning_mode);
      }
      state11?.sync(event7.fan_speed || event7.suction_level);
      const asString = String(event7.error || "").trim();
      const asString1 = String(event7.low_water_warning || "").trim();
      const event12 = [];
      if (asString && !/^no error$/i.test(asString)) {
        event12.push(asString);
      }
      if (asString1 && !/^no warning$/i.test(asString1)) {
        event12.push(asString1);
      }
      element13.textContent = event12.length
        ? "注意：" + event12.join(" · ")
        : "";
      element13.hidden = !event12.length;
    }
    event.button.addEventListener("click", () =>
      invokeEntityService(
        "vacuum",
        vacuumActionService(entityDetailsDialogEl1, "start"),
        entityId,
        {},
        {
          ...entityDetailsDialogEl1,
          state: "cleaning",
          attributes: {
            ...(entityDetailsDialogEl1.attributes || {}),
            running: true,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    event1.button.addEventListener("click", () =>
      invokeEntityService(
        "vacuum",
        "pause",
        entityId,
        {},
        {
          ...entityDetailsDialogEl1,
          state: "paused",
          attributes: {
            ...(entityDetailsDialogEl1.attributes || {}),
            running: false,
            paused: true,
          },
        },
      ),
    );
    event3.button.addEventListener("click", () =>
      invokeEntityService(
        "vacuum",
        "return_to_base",
        entityId,
        {},
        {
          ...entityDetailsDialogEl1,
          state: "returning",
          attributes: {
            ...(entityDetailsDialogEl1.attributes || {}),
            running: false,
            paused: false,
            returning: true,
          },
        },
      ),
    );
    event2.button.addEventListener("click", () =>
      invokeEntityService(
        "vacuum",
        vacuumActionService(entityDetailsDialogEl1, "stop"),
        entityId,
        {},
        {
          ...entityDetailsDialogEl1,
          state: "idle",
          attributes: {
            ...(entityDetailsDialogEl1.attributes || {}),
            running: false,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    event4.button.addEventListener("click", () =>
      invokeEntityService("vacuum", "locate", entityId, {}),
    );
    event5.button.addEventListener("click", () =>
      invokeEntityService(
        "vacuum",
        "clean_spot",
        entityId,
        {},
        {
          ...entityDetailsDialogEl1,
          state: "cleaning",
          attributes: {
            ...(entityDetailsDialogEl1.attributes || {}),
            running: true,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    runHelper5(entityDetailsDialogEl1);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    const handlers = new Map([[entityId, [runHelper5]]]);
    if (text) {
      handlers.set(text, [state9]);
    }
    if (text2) {
      handlers.set(text2, [state12]);
    }
    for (const [item, item1] of filtered?.stateHandlers || []) {
      handlers.set(item, item1);
    }
    this.detailsStateSync = {
      dialog,
      handlers,
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, 840, filtered ? 560 : 458);
    element4.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, element);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showPresenceDetails(component, { preview: _ = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const state = [
      "presence",
      "door-window",
      "water-leak",
      "smoke",
      "natural-gas",
    ].includes(component.properties?.sensorKind)
      ? component.properties.sensorKind
      : "presence";
    const state1 = {
      presence: {
        title: "人在检测",
        occupied: "有人",
        clear: "无人",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "空间内检测到人",
        hintClear: "当前空间无人",
      },
      "door-window": {
        title: "门窗状态",
        occupied: "打开",
        clear: "关闭",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "门窗当前已打开",
        hintClear: "门窗当前已关闭",
      },
      "water-leak": {
        title: "水浸检测",
        occupied: "检测到水浸",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到水浸",
        hintClear: "当前未检测到水浸",
      },
      smoke: {
        title: "烟雾检测",
        occupied: "检测到烟雾",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到烟雾",
        hintClear: "当前未检测到烟雾",
      },
      "natural-gas": {
        title: "天然气检测",
        occupied: "检测到天然气",
        clear: "正常",
        unavailable: "传感器离线",
        unknown: "等待状态",
        hintOccupied: "传感器检测到天然气",
        hintClear: "当前未检测到天然气",
      },
    }[state];
    let entityState = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId,
        state: "unknown",
        attributes: {},
      };
    const count = Math.max(
      1,
      Math.min(168, Number(component.properties?.historyHours || 24)),
    );
    const state2 = this.historySeries.get(entityId)?.points || [];
    const state3 =
      component.properties?.iconOnColor ||
      component.properties?.occupiedColor ||
      "#ffffff";
    const state4 =
      component.properties?.iconColor ||
      component.properties?.clearColor ||
      "#758189";
    const runHelper = (arg, now = Date.now()) =>
      presenceSensorPresentation(arg, "auto", {
        ...presenceMotionEventConfig(
          entityId,
          arg,
          this.entityMetadata,
          this.states,
          component.properties,
        ),
        now,
      });
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog presence-details";
    dialog.dataset.sensorKind = state;
    dialog.style.setProperty("--hb-presence-occupied", state3);
    dialog.style.setProperty("--hb-presence-clear", state4);
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      entityState.attributes?.friendly_name || state1.title,
    );
    const element2 = document.createElement("span");
    divEl.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭弹窗");
    entityDetailsHeadingEl.append(divEl, element3);
    const presenceDetailsBodyEl = document.createElement("div");
    presenceDetailsBodyEl.className = "hb-presence-details-body";
    const presenceDetailsVisualEl = document.createElement("section");
    presenceDetailsVisualEl.className = "hb-presence-details-visual";
    let element4 = null;
    if (state === "presence") {
      const presenceSensorSpaceEl = document.createElement("span");
      presenceSensorSpaceEl.className = "hb-presence-sensor-space";
      for (let presenceSensorFloorEl1 = 0; presenceSensorFloorEl1 < 3; presenceSensorFloorEl1 += 1) {
        presenceSensorSpaceEl.append(document.createElement("i"));
      }
      const presenceSensorFloorEl = document.createElement("span");
      presenceSensorFloorEl.className = "hb-presence-sensor-floor";
      const presenceSensorPersonEl = document.createElement("span");
      presenceSensorPersonEl.className = "hb-presence-sensor-person";
      const armEl = document.createElement("i");
      const armEl1 = document.createElement("b");
      const armEl2 = document.createElement("span");
      armEl2.className = "arm left";
      const armEl3 = document.createElement("span");
      armEl3.className = "arm right";
      const legEl = document.createElement("span");
      legEl.className = "leg left";
      const legEl1 = document.createElement("span");
      legEl1.className = "leg right";
      presenceSensorPersonEl.append(armEl, armEl1, armEl2, armEl3, legEl, legEl1);
      presenceDetailsVisualEl.append(presenceSensorSpaceEl, presenceSensorFloorEl, presenceSensorPersonEl);
    } else {
      element4 = renderRegisteredComponent(
        {
          ...component,
          position: {
            ...(component.position || {}),
            width: 100,
            height: 100,
          },
        },
        {
          states: new Map([[entityId, entityState]]),
          entityMetadata: this.entityMetadata,
          editable: false,
          previewState: "auto",
          document: this.document,
        },
      );
      element4.classList.add("hb-presence-details-sensor");
      presenceDetailsVisualEl.append(element4);
    }
    const element5 = document.createElement("strong");
    const element6 = document.createElement("small");
    presenceDetailsVisualEl.append(element5, element6);
    const presenceDetailsMetricsEl = document.createElement("section");
    presenceDetailsMetricsEl.className = "hb-presence-details-metrics";
    const buildElementTree = (arg) => {
      const divEl3 = document.createElement("div");
      const element13 = document.createElement("small");
      element13.textContent = arg;
      const strongEl = document.createElement("strong");
      divEl3.append(element13, strongEl);
      presenceDetailsMetricsEl.append(divEl3);
      return strongEl;
    };
    const element7 = buildElementTree("当前状态持续");
    const element8 = buildElementTree("最近检测到人");
    const element9 = buildElementTree(count + " 小时有人时长");
    const presenceDetailsTimelineEl = document.createElement("section");
    presenceDetailsTimelineEl.className = "hb-presence-details-timeline";
    const divEl1 = document.createElement("div");
    const element10 = document.createElement("strong");
    element10.textContent = count + " 小时在家时间轴";
    const element11 = document.createElement("span");
    element11.textContent = "亮色为有人";
    divEl1.append(element10, element11);
    const divEl2 = document.createElement("div");
    const element12 = document.createElement("div");
    element12.innerHTML = "<span>" + count + " 小时前</span><span>现在</span>";
    presenceDetailsTimelineEl.append(divEl1, divEl2, element12);
    presenceDetailsBodyEl.append(presenceDetailsVisualEl, presenceDetailsMetricsEl, presenceDetailsTimelineEl);
    entityDetailsCardEl.append(entityDetailsHeadingEl, presenceDetailsBodyEl);
    dialog.append(entityDetailsCardEl);
    const runHelper1 = (arg) => {
      if (!Number.isFinite(arg)) {
        return "--";
      }
      const state6 = new Date(arg);
      const state7 = new Date();
      const state8 =
        state6.getFullYear() === state7.getFullYear() &&
        state6.getMonth() === state7.getMonth() &&
        state6.getDate() === state7.getDate();
      const state9 = new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(state6);
      if (state8) {
        return "今天 " + state9;
      } else {
        return new Intl.DateTimeFormat("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
          .format(state6)
          .replace(/\//g, "-");
      }
    };
    const createChildElement = () => {
      const nowMs = presenceHistoryBuckets(
        state2,
        entityState,
        Date.now(),
        count,
        48,
        presenceMotionEventConfig(
          entityId,
          entityState,
          this.entityMetadata,
          this.states,
          component.properties,
        ),
      );
      divEl2.replaceChildren(
        ...nowMs.map((isEl, isEl1) => {
          const isEl2 = document.createElement("i");
          isEl2.className = "is-" + isEl;
          const rounded2 = Math.round(
            (count * 60 * (nowMs.length - isEl1 - 1)) / nowMs.length,
          );
          isEl2.title =
            (rounded2 ? rounded2 + " 分钟前" : "现在") +
            "：" +
            {
              occupied: "有人",
              clear: "无人",
              unavailable: "离线",
              unknown: "未知",
            }[isEl];
          return isEl2;
        }),
      );
      const length = nowMs.filter((arg) => arg === "occupied").length;
      const rounded = Math.round(
        (count * 60 * length) / Math.max(1, nowMs.length),
      );
      element9.textContent =
        rounded >= 60
          ? Math.floor(rounded / 60) + " 小时 " + (rounded % 60) + " 分钟"
          : rounded + " 分钟";
    };
    const runHelper2 = () => {
      const state6 = presenceMotionEventConfig(
        entityId,
        entityState,
        this.entityMetadata,
        this.states,
        component.properties,
      );
      const finiteNumber = state2
        .map((element13) => ({
          timestamp: Date.parse(element13?.timestamp),
          state: {
            state: element13?.value,
          },
        }))
        .filter(
          (arg) =>
            Number.isFinite(arg.timestamp) &&
            presenceSensorPresentation(
              {
                state: arg?.state?.state,
                lastChanged: new Date(arg.timestamp).toISOString(),
              },
              "auto",
              {
                ...state6,
                now: arg.timestamp,
                noMotionSeconds: null,
                noMotionStateTimestamp: null,
              },
            ).key === "occupied",
        );
      const timestamp = presenceStateTimestamp(entityState);
      if (runHelper(entityState).key === "occupied" && Number.isFinite(timestamp)) {
        finiteNumber.push({
          timestamp,
        });
      }
      if (finiteNumber.length) {
        return Math.max(...finiteNumber.map((arg) => arg.timestamp));
      } else {
        return null;
      }
    };
    const syncVisualState = (arg) => {
      entityState = arg || entityState;
      const state6 = runHelper(entityState);
      const state7 = presenceStateTimestamp(entityState);
      dialog.dataset.presenceState = state6.key;
      presenceDetailsVisualEl.className = "hb-presence-details-visual is-" + state6.key;
      const state8 = state1[state6.key] || state1.unknown;
      element2.textContent = state8;
      element2.classList.toggle("is-on", state6.key === "occupied");
      element5.textContent = state8;
      element6.textContent =
        state6.key === "occupied"
          ? state1.hintOccupied
          : state6.key === "clear"
            ? state1.hintClear
            : state6.key === "unavailable"
              ? "设备当前不可用"
              : "正在等待状态";
      if (element4) {
        const state9 = {
          "door-window":
            "hb-door-window-sensor is-" +
            (state6.key === "occupied" ? "open" : state6.key),
          "water-leak":
            "hb-water-leak-sensor is-" +
            (state6.key === "occupied" ? "wet" : state6.key),
          smoke:
            "hb-smoke-sensor is-" +
            (state6.key === "occupied" ? "alert" : state6.key),
          "natural-gas":
            "hb-natural-gas-sensor is-" +
            (state6.key === "occupied" ? "alert" : state6.key),
        }[state];
        element4.className = state9 + " hb-presence-details-sensor";
        element4.dataset.sensorState = state6.key;
        element4.setAttribute("aria-label", state1.title + "：" + state8);
      }
      element7.textContent = ["unknown", "unavailable"].includes(state6.key)
        ? "--"
        : formatPresenceDuration(state7);
      element8.textContent = runHelper1(runHelper2());
      createChildElement();
    };
    syncVisualState(entityState);
    const state5 = presenceMotionEventConfig(
      entityId,
      entityState,
      this.entityMetadata,
      this.states,
      component.properties,
    );
    const handlers = new Map([[entityId, [syncVisualState]]]);
    for (const rendererRuntimeDialogLayerEl2 of state5.companionEntityIds) {
      handlers.set(rendererRuntimeDialogLayerEl2, [() => syncVisualState(entityState)]);
    }
    const rendererRuntimeDialogLayerEl = state5.motionEvent
      ? window.setInterval(() => syncVisualState(entityState), 1000)
      : null;
    const rendererRuntimeDialogLayerEl1 = document.createElement("div");
    rendererRuntimeDialogLayerEl1.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl1.tabIndex = -1;
    rendererRuntimeDialogLayerEl1.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl1);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog,
      handlers,
    };
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl1, dialog, 760, 560);
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl1, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl1.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        if (rendererRuntimeDialogLayerEl) {
          window.clearInterval(rendererRuntimeDialogLayerEl);
        }
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl1.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showEntityDetails(component, { preview = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    const entityId2 = String(entityId);
    const entityId1 = this.deviceProfile(entityId2);
    component = applyXiaomiDeviceProfile(component, entityId1);
    const component1 = entityId2.split(".", 1)[0];
    const state =
      component.properties?.deviceType === "electric-bed" ||
      entityId1?.deviceType === "electric-bed";
    if (!this.entityCatalogReady) {
      this.deferEntityDetailsUntilReady(
        {
          ...component,
          properties: {
            ...(component.properties || {}),
            __catalogRetry: true,
          },
        },
        preview,
        state ? "electric-bed-catalog" : "catalog",
      );
      if (state) {
        this.showElectricBedLoadingDetails(component, {
          preview,
        });
      }
      return;
    }
    if (
      !entityId1 &&
      component1 === "number" &&
      !component.properties?.__catalogRetry
    ) {
      this.deferEntityDetailsUntilReady(
        {
          ...component,
          properties: {
            ...(component.properties || {}),
            __catalogRetry: true,
          },
        },
        preview,
        state ? "electric-bed-catalog" : "catalog",
      );
      if (state) {
        this.showElectricBedLoadingDetails(component, {
          preview,
        });
      }
      return;
    }
    if (component1 === "water_heater" && !this.waterHeaterDetailsReady(entityId2)) {
      this.deferEntityDetailsUntilReady(component, preview);
      return;
    }
    window.clearTimeout(this.pendingEntityDetails?.timer);
    this.pendingEntityDetails = null;
    if (component.type === "presence-sensor") {
      this.showPresenceDetails(component, {
        preview,
      });
      return;
    }
    if (entityId1?.deviceType === "electric-bed") {
      this.showElectricBedDetails(component, {
        preview,
      });
      return;
    }
    if (
      entityId1?.deviceType === "air-purifier" &&
      component1 === "fan" &&
      ["icon-button", "device-button", "icon-button-effect"].includes(
        component.type,
      )
    ) {
      component = {
        ...component,
        type: "air-purifier",
        properties: {
          ...(component.properties || {}),
          deviceType: "air-purifier",
        },
      };
    }
    const set = new Set([
      "line-chart",
      "media-player",
      "air-purifier",
      "air-conditioner",
      "water-heater",
      "vacuum-control",
      "electric-bed",
    ]).has(component.type);
    if (
      component.type === "media-player" ||
      (!set && component1 === "media_player")
    ) {
      this.showMediaPlayerDetails(component, {
        preview,
      });
      return;
    }
    if (component.type === "air-purifier") {
      this.showAirPurifierDetails(component, {
        preview,
      });
      return;
    }
    if (
      ["air-conditioner", "bath-heater"].includes(entityId1?.deviceType) &&
      ["climate", "fan"].includes(component1) &&
      !set &&
      component.type !== "air-conditioner"
    ) {
      component = {
        ...component,
        type: "air-conditioner",
      };
    }
    if (
      component.type === "vacuum-control" ||
      (!set && entityId2.startsWith("vacuum."))
    ) {
      this.showVacuumDetails(component, {
        preview,
      });
      return;
    }
    const state1 = this.states.get(entityId2);
    const entityState = state1?.newState || state1;
    const entityState1 = entityState?.attributes || {};
    const state2 = component.type === "line-chart";
    const state3 = !state2 && component1 === "cover";
    const state4 = ["standard", "dream", "airer"].includes(
      component.properties?.coverKind,
    )
      ? component.properties.coverKind
      : "auto";
    const airer =
      state3 &&
      coverComponentIsAirer(
        component,
        entityId2,
        entityState,
        this.entityMetadata,
        this.deviceMetadata,
      );
    const numeric = Number(entityState1.supported_features || 0);
    const state5 =
      entityId2 +
      " " +
      (entityState1.friendly_name || "") +
      " " +
      (component.properties?.label || "");
    const finiteNumber =
      Number.isFinite(Number(entityState1.current_tilt_position)) ||
      !!(numeric & 240);
    const state6 = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(
      state5,
    );
    const dream =
      state3 &&
      !airer &&
      (state4 === "dream" || (state4 === "auto" && (finiteNumber || state6)));
    const tilt = dream && finiteNumber;
    const state7 =
      (airer ? relatedAirerLightEntity(this.entityMetadata, entityId2) : null)
        ?.entityId || "";
    const position = state7 ? this.states.get(state7) : null;
    let position1 = position?.newState || position || null;
    const positionCommandEntityId =
      (airer
        ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const position2 = this.states.get(positionCommandEntityId);
    const positionCommandState = position2?.newState || position2 || null;
    const state8 =
      (airer
        ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const state9 =
      (airer
        ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const state10 = this.states.get(state9);
    const motorState = state10?.newState || state10 || null;
    const state11 = airer
      ? relatedAirerMotorActionEntities(this.entityMetadata, entityId2)
      : {};
    const airerActionEntityIds = Object.fromEntries(
      Object.entries(state11).map(([arg, arg2]) => [
        arg,
        arg2?.entityId || "",
      ]),
    );
    const position3 = this.states.get(state8 || positionCommandEntityId);
    const positionState = position3?.newState || position3 || null;
    const motorReversed =
      state3 &&
      coverMotorIsReversedForComponent(
        component,
        this.entityMetadata,
        this.states,
        entityId2,
      );
    const state12 = motorReversed ? "open_cover" : "close_cover";
    const size = motorReversed ? "close_cover" : "open_cover";
    const size1 = ["left", "right"].includes(
      component.properties?.coverDirection,
    )
      ? component.properties.coverDirection
      : "split";
    const momentary = !state2 && component1 === "button";
    const state13 =
      !state2 && (momentary || ["switch", "input_boolean"].includes(component1));
    const state14 = component.type === "icon-button" && component1 === "light";
    const state15 =
      !state2 &&
      (component.type === "air-conditioner" ||
        component.type === "water-heater" ||
        ["climate", "water_heater"].includes(component1));
    const deviceType = state15
      ? component1 === "water_heater" || component.type === "water-heater"
        ? "water-heater"
        : resolveClimateDeviceType(component, entityState, entityId2)
      : "air-conditioner";
    const state16 = climateDeviceLabel(deviceType);
    const trimmed = componentDialogTitle(
      component,
      String(entityState1.friendly_name || "").trim() || state16,
    ).replace(/(浴霸)(?:\s+浴霸)+$/i, "$1");
    const label = componentDialogTitle(
      component,
      String(entityState1.friendly_name || "").trim() ||
        (momentary ? "按钮" : "开关"),
    );
    const state17 = state14 || state15 || state13;
    this.closeRuntimeDialog();
    const syncClimateControl = (state, attributes = entityState1) =>
      momentary
        ? false
        : state14 || state13
          ? state === "on"
          : climateIsPoweredOn(
              {
                state,
                attributes,
              },
              deviceType,
            );
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog";
    dialog.tabIndex = -1;
    dialog.classList.toggle("line-chart-details", state2);
    dialog.classList.toggle("light-details", state14);
    dialog.classList.toggle("cover-details", state3);
    dialog.classList.toggle("dream-cover-details", dream);
    dialog.classList.toggle("airer-cover-details", airer);
    dialog.classList.toggle("climate-details", state15);
    dialog.classList.toggle(
      "bath-heater-details",
      deviceType === "bath-heater",
    );
    dialog.classList.toggle(
      "water-heater-details",
      deviceType === "water-heater",
    );
    dialog.classList.toggle("switch-details", state13);
    dialog.classList.toggle("momentary-button-details", momentary);
    const entityDetailsCardEl = document.createElement("div");
    entityDetailsCardEl.className = "hb-entity-details-card";
    const entityDetailsHeadingEl = document.createElement("div");
    entityDetailsHeadingEl.className = "hb-entity-details-heading";
    const divEl = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = state14
      ? componentDialogTitle(component, "灯光")
      : state3
        ? componentDialogTitle(component, airer ? "晾衣机" : "窗帘")
        : state15
          ? trimmed
          : state13
            ? label
            : componentDialogTitle(component, "设备详情");
    divEl.append(element);
    let element2 = null;
    let element3 = null;
    let text = String(entityState?.state || "");
    let element4 = null;
    let element5 = null;
    let element6 = null;
    if (state14) {
      const element17 = document.createElement("span");
      element17.textContent = entityState?.state === "on" ? "已开启" : "已关闭";
      element17.classList.toggle("is-on", entityState?.state === "on");
      element2 = element17;
      divEl.append(element17);
    } else if (state3) {
      const element17 = document.createElement("span");
      const physicalState = physicalCoverState(entityState?.state, motorReversed);
      const numeric2 = Number(
        entityState1[tilt ? "current_tilt_position" : "current_position"],
      );
      const position6 = {
        open: "已打开",
        closed: "已关闭",
        opening: "正在打开",
        closing: "正在关闭",
      };
      element17.textContent = airer
        ? coverLiftStateLabel(physicalState) || physicalState || "状态未知"
        : dream
          ? dreamCurtainStatusText(entityState?.state, numeric2, motorReversed)
          : position6[physicalState] || physicalState || "状态未知";
      element17.classList.toggle(
        "is-on",
        physicalState === "open" || physicalState === "opening",
      );
      element3 = element17;
      divEl.append(element17);
    } else if (state15 || state13) {
      const element17 = document.createElement("span");
      const state25 = syncClimateControl(entityState?.state);
      element17.textContent = momentary
        ? ["unknown", "unavailable"].includes(entityState?.state)
          ? "当前不可用"
          : "按下执行"
        : deviceType === "water-heater"
          ? waterHeaterStatusLabel(entityState)
          : ["unknown", "unavailable"].includes(entityState?.state)
            ? "当前不可用"
            : state25
              ? "已开启"
              : "已关闭";
      element17.classList.toggle("is-on", state25);
      if (state15) {
        element4 = element17;
      } else {
        element5 = element17;
      }
      divEl.append(element17);
    } else if (component.type === "line-chart") {
      const element17 = document.createElement("span");
      element17.textContent =
        entityState?.state == null ||
        ["unknown", "unavailable"].includes(entityState.state)
          ? "暂无数据"
          : "实时数据";
      element6 = element17;
      divEl.append(element17);
    }
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.setAttribute("aria-label", "关闭实体详情");
    element7.textContent = "×";
    entityDetailsHeadingEl.append(divEl, element7);
    let entityState2 = entityState;
    let element8 = null;
    let runHelper = null;
    let element9 = null;
    let position4 = null;
    let element10 = null;
    let runHelper1 = null;
    let runHelper2 = null;
    let position5 = 0;
    const positionCalibration = airerPositionCalibration(
      this.entityMetadata,
      this.deviceMetadata,
      entityId2,
    );
    let showEntityDetailsValue = false;
    let element11 = null;
    let showEntityDetailsValue1 = null;
    let showEntityDetailsValue2 = null;
    let runHelper3 = null;
    let runHelper4 = null;
    let showEntityDetailsValue3 = false;
    let showEntityDetailsValue4 = null;
    let state18 = "idle";
    let lightVisualEl = "";
    let lightVisualEl1 = null;
    let lightVisualEl2 = null;
    let allowed = new Set();
    const lightVisualEl3 = selectedRelatedEntityIds(component);
    const allowed2 = new Set(lightVisualEl3 || []);
    if (state14) {
      element9 = document.createElement("button");
      element9.type = "button";
      element9.className = "hb-light-visual";
      element9.inert = preview;
      element9.setAttribute("aria-disabled", String(preview));
      const lightVisualAuraEl = document.createElement("div");
      lightVisualAuraEl.className = "hb-light-visual-aura";
      const lightVisualLampEl = document.createElement("div");
      lightVisualLampEl.className = "hb-light-visual-lamp";
      for (const lightVisualEl4 of ["cord", "shade", "bulb", "filament"]) {
        const lightVisualEl5 = document.createElement("i");
        lightVisualEl5.className = "hb-light-visual-" + lightVisualEl4;
        lightVisualEl5.setAttribute("aria-hidden", "true");
        lightVisualLampEl.append(lightVisualEl5);
      }
      const element17 = document.createElement("span");
      element17.className = "hb-light-visual-status";
      element9.append(lightVisualAuraEl, lightVisualLampEl, element17);
      const finiteNumber1 =
        Number(entityState1.min_color_temp_kelvin) ||
        (Number.isFinite(Number(entityState1.max_mireds))
          ? 1000000 / Number(entityState1.max_mireds)
          : 2000);
      const finiteNumber2 =
        Number(entityState1.max_color_temp_kelvin) ||
        (Number.isFinite(Number(entityState1.min_mireds))
          ? 1000000 / Number(entityState1.min_mireds)
          : 6500);
      const finiteNumber3 =
        Number(entityState1.color_temp_kelvin) ||
        (Number.isFinite(Number(entityState1.color_temp))
          ? 1000000 / Number(entityState1.color_temp)
          : NaN);
      const colorTemperatureKelvin = Number.isFinite(finiteNumber3)
        ? finiteNumber3
        : (finiteNumber1 + finiteNumber2) / 2;
      const brightness = lightSupportsColor(entityState1);
      const finiteNumber4 = {
        isOn: entityState?.state === "on",
        brightnessPercent: Number.isFinite(Number(entityState1.brightness))
          ? (Number(entityState1.brightness) / 255) * 100
          : 100,
        colorTemperatureKelvin,
        colorRgb:
          brightness && Array.isArray(entityState1.rgb_color)
            ? entityState1.rgb_color
                .slice(0, 3)
                .map((colorRgb) => Number(colorRgb) || 0)
            : brightness && Array.isArray(entityState1.hs_color)
              ? hsToRgbColor(entityState1.hs_color)
              : null,
      };
      const syncVisualState = () => {
        const count = Math.max(
          1,
          Math.min(100, Number(finiteNumber4.brightnessPercent) || 1),
        );
        const count2 = Math.max(
          2000,
          Math.min(6500, Number(finiteNumber4.colorTemperatureKelvin) || 3000),
        );
        const state25 = (count2 - 2000) / 4500;
        const color = [255, 132, 42];
        const color1 = [172, 225, 255];
        const mapped =
          "rgb(" +
          (
            finiteNumber4.colorRgb ||
            color.map((arg, arg2) =>
              Math.round(arg + (color1[arg2] - arg) * state25),
            )
          ).join(",") +
          ")";
        element9.classList.toggle("is-on", finiteNumber4.isOn);
        element9.style.setProperty("--hb-light-visual-color", mapped);
        element9.style.setProperty(
          "--hb-light-visual-opacity",
          finiteNumber4.isOn ? String(0.08 + (count / 100) * 0.92) : "0",
        );
        element9.style.setProperty(
          "--hb-light-visual-blur",
          Math.round(15 + count * 1.14) + "px",
        );
        element9.style.setProperty(
          "--hb-light-visual-scale",
          String(0.62 + (count / 100) * 1.05),
        );
        element17.textContent = finiteNumber4.isOn
          ? Math.round(count) + "%  ·  " + Math.round(count2) + "K"
          : "灯光已关闭";
        element9.setAttribute("aria-label", element17.textContent);
      };
      position4 = (entityState3 = {}) => {
        const numeric1 = entityState3.attributes || {};
        if (typeof entityState3.isOn == "boolean") {
          finiteNumber4.isOn = entityState3.isOn;
        } else if (typeof entityState3.state == "string") {
          finiteNumber4.isOn = entityState3.state === "on";
        }
        if (Number.isFinite(Number(entityState3.brightnessPercent))) {
          finiteNumber4.brightnessPercent = Number(entityState3.brightnessPercent);
        } else if (Number.isFinite(Number(numeric1.brightness))) {
          finiteNumber4.brightnessPercent = (Number(numeric1.brightness) / 255) * 100;
        }
        if (Number.isFinite(Number(entityState3.colorTemperatureKelvin))) {
          finiteNumber4.colorTemperatureKelvin = Number(
            entityState3.colorTemperatureKelvin,
          );
        } else if (Number.isFinite(Number(numeric1.color_temp_kelvin))) {
          finiteNumber4.colorTemperatureKelvin = Number(numeric1.color_temp_kelvin);
        } else if (Number.isFinite(Number(numeric1.color_temp))) {
          finiteNumber4.colorTemperatureKelvin = 1000000 / Number(numeric1.color_temp);
        }
        if (brightness && Array.isArray(entityState3.colorRgb)) {
          finiteNumber4.colorRgb = entityState3.colorRgb
            .slice(0, 3)
            .map((arg) => Number(arg) || 0);
        } else if (brightness && Array.isArray(numeric1.rgb_color)) {
          finiteNumber4.colorRgb = numeric1.rgb_color
            .slice(0, 3)
            .map((arg) => Number(arg) || 0);
        } else if (brightness && Array.isArray(numeric1.hs_color)) {
          finiteNumber4.colorRgb = hsToRgbColor(numeric1.hs_color);
        }
        syncVisualState();
      };
      syncVisualState();
    }
    if (state3) {
      element10 = document.createElement("button");
      element10.type = "button";
      element10.className = "hb-cover-visual";
      element10.inert = preview;
      element10.setAttribute("aria-disabled", String(preview));
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
        const size2 =
          size1 === "right"
            ? coverVisualSlatEl - 1 - coverVisualSlatEl1
            : size1 === "split"
              ? Math.abs((coverVisualSlatEl - 1) / 2 - coverVisualSlatEl1)
              : coverVisualSlatEl1;
        coverVisualSlatEl2.style.setProperty(
          "--hb-cover-slat-delay-index",
          String(size2),
        );
        const size3 =
          size1 === "left"
            ? -coverVisualSlatEl1 * 14.5
            : size1 === "right"
              ? (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5
              : coverVisualSlatEl1 <= (coverVisualSlatEl - 1) / 2
                ? -coverVisualSlatEl1 * 14.5
                : (coverVisualSlatEl - 1 - coverVisualSlatEl1) * 14.5;
        coverVisualSlatEl2.style.setProperty("--hb-cover-retracted-shift", size3 + "px");
        coverVisualSlatEl2.append(iconEl);
        coverVisualSlatsEl.append(coverVisualSlatEl2);
      }
      const coverVisualWindowEl = document.createElement("i");
      coverVisualWindowEl.className = "hb-cover-visual-window";
      element10.classList.toggle("is-dream", dream);
      element10.classList.toggle("is-airer", airer);
      element10.classList.add("direction-" + size1);
      element10.append(coverVisualWindowEl, coverVisualRailEl, coverVisualPanelEl, coverVisualPanelEl1, coverVisualSlatsEl);
      if (airer) {
        appendAirerVisual(element10);
      }
      runHelper2 = (arg = position1) => {
        if (!airer) {
          return;
        }
        position1 = arg || position1;
        const state25 =
          !state7 ||
          ["unknown", "unavailable"].includes(
            String(position1?.state || "unknown"),
          );
        const state26 = position1?.state === "on";
        element10.classList.toggle("is-light-on", state26 && !state25);
        element10.classList.toggle("is-light-unavailable", state25);
        element10.disabled = preview || state25;
        element10.setAttribute("aria-pressed", String(state26 && !state25));
        element10.setAttribute(
          "aria-label",
          state25
            ? "晾衣机灯光实体不可用"
            : "晾衣机灯光" +
                (state26 ? "已开启，点击关闭" : "已关闭，点击开启"),
        );
      };
      runHelper2();
      runHelper1 = ({ position: position6 = 0, state = "" } = {}) => {
        const current_position = Math.max(
          0,
          Math.min(100, Number(position6) || 0),
        );
        const coverState = coverPresentationState(
          {
            state,
            attributes: {
              current_position,
            },
          },
          motorReversed,
        );
        const physicalState = physicalCoverState(state || text, motorReversed);
        const position7 = physicalState === "open" || physicalState === "opening";
        position5 = current_position;
        element10.style.setProperty(
          "--hb-cover-open-position",
          current_position + "%",
        );
        element10.style.setProperty(
          "--hb-airer-drop",
          airerVisualDrop(current_position) + "px",
        );
        element10.style.setProperty(
          "--hb-cover-panel-width",
          45.9 - current_position * 0.331 + "%",
        );
        element10.style.setProperty(
          "--hb-cover-single-panel-width",
          91.8 - current_position * 0.79 + "%",
        );
        element10.style.setProperty(
          "--hb-cover-slat-angle",
          current_position * 1.8 + "deg",
        );
        element10.classList.toggle("is-tilt-reversed", current_position > 50);
        element10.classList.toggle(
          "is-tilt-center",
          Math.abs(current_position - 50) <= 2,
        );
        element10.classList.toggle(
          "is-open",
          dream ? position7 : coverState === "open" || coverState === "opening",
        );
        element10.classList.toggle(
          "is-moving",
          state === "opening" || state === "closing",
        );
        element10.setAttribute(
          "aria-pressed",
          String(dream ? position7 : coverState === "open" || coverState === "opening"),
        );
        if (!airer) {
          element10.setAttribute(
            "aria-label",
            dream
              ? "" +
                  componentDialogTitle(component, "梦幻帘") +
                  dreamCurtainStatusText(
                    state || text,
                    current_position,
                    motorReversed,
                  )
              : "" +
                  componentDialogTitle(component, "窗帘") +
                  (coverState === "open" || coverState === "opening"
                    ? "已打开，点击关闭"
                    : "已关闭，点击打开"),
          );
        }
      };
      runHelper1({
        position: Number.isFinite(
          Number(entityState1[tilt ? "current_tilt_position" : "current_position"]),
        )
          ? Number(entityState1[tilt ? "current_tilt_position" : "current_position"])
          : entityState?.state === "open"
            ? 100
            : 0,
        state: entityState?.state,
      });
      element10.addEventListener("click", async () => {
        if (preview || showEntityDetailsValue) {
          return;
        }
        showEntityDetailsValue = true;
        element10.setAttribute("aria-busy", "true");
        if (airer) {
          const state25 = position1;
          runHelper2({
            ...(position1 || {}),
            state: position1?.state === "on" ? "off" : "on",
          });
          try {
            await this.callEntityService("homeassistant", "toggle", state7);
          } catch (error) {
            runHelper2(state25);
            this.options.onError?.(error);
          } finally {
            showEntityDetailsValue = false;
            element10.removeAttribute("aria-busy");
          }
          return;
        }
        const position = position5;
        const position6 =
          element8?.isDreamCurtainRetracted?.() ??
          element10.dataset.curtainRetracted === "true";
        const position7 = position > COVER_CLOSED_POSITION_EPSILON;
        if (dream) {
          element8?.beginDreamCurtainMotion?.(!position6);
        }
        if (!dream) {
          element8?.beginCoverMotion?.(
            position7 ? 0 : 100,
            position7 ? "closing" : "opening",
          );
        }
        try {
          await this.callEntityService(
            "cover",
            dream
              ? dreamCurtainToggleService(position6, size, state12)
              : position7
                ? state12
                : size,
            entityId2,
          );
        } catch (error) {
          if (dream) {
            element8?.cancelDreamCurtainMotion?.();
            element8?.setDreamCurtainRetracted?.(position6, false);
          } else {
            element8?.cancelCoverMotion?.();
          }
          element8?.syncCoverState?.(entityState);
          runHelper1({
            position,
            state: entityState?.state,
          });
          this.options.onError?.(error);
        } finally {
          showEntityDetailsValue = false;
          element10.removeAttribute("aria-busy");
        }
      });
    }
    if (state15) {
      const climateVisualEl = {
        entityId: entityId2,
        entityMetadata: this.entityMetadata,
        entityTranslations: this.entityTranslations,
      };
      element11 = document.createElement("button");
      element11.type = "button";
      element11.className = "hb-climate-visual";
      element11.classList.toggle(
        "is-bath-heater",
        deviceType === "bath-heater",
      );
      element11.classList.toggle(
        "is-water-heater",
        deviceType === "water-heater",
      );
      element11.inert = preview;
      element11.setAttribute("aria-disabled", String(preview));
      const climateVisualUnitEl = document.createElement("div");
      climateVisualUnitEl.className = "hb-climate-visual-unit";
      const element17 = document.createElement("span");
      element17.className = "hb-climate-visual-brand";
      element17.textContent =
        deviceType === "bath-heater"
          ? "BATH HEATER"
          : deviceType === "water-heater"
            ? "SMART WATER"
            : "SMART AIR";
      const element18 = document.createElement("strong");
      element18.className = "hb-climate-visual-display";
      const climateVisualVentEl = document.createElement("div");
      climateVisualVentEl.className = "hb-climate-visual-vent";
      for (let climateVisualAirflowEl1 = 0; climateVisualAirflowEl1 < 5; climateVisualAirflowEl1 += 1) {
        climateVisualVentEl.append(document.createElement("i"));
      }
      climateVisualUnitEl.append(element17, element18, climateVisualVentEl);
      const climateVisualAirflowEl = document.createElement("div");
      climateVisualAirflowEl.className = "hb-climate-visual-airflow";
      for (let climate = 0; climate < 3; climate += 1) {
        climateVisualAirflowEl.append(document.createElement("i"));
      }
      element11.append(climateVisualUnitEl, climateVisualAirflowEl);
      showEntityDetailsValue1 = ({
        mode = "off",
        visualMode = "off",
        running = false,
        accentColor = "#65717a",
        targetTemperature,
      } = {}) => {
        const state25 = visualMode !== "off";
        element11.classList.toggle("is-on", state25);
        element11.classList.toggle("is-running", running);
        element11.classList.toggle(
          "is-airflow-mode",
          deviceType === "bath-heater" &&
            state25 &&
            bathHeaterModeUsesAirflow(mode),
        );
        element11.dataset.visualMode = visualMode;
        element11.style.setProperty("--hb-climate-visual-accent", accentColor);
        const finiteNumber1 =
          targetTemperature != null && targetTemperature !== "" && Number.isFinite(Number(targetTemperature));
        element18.textContent = state25
          ? finiteNumber1
            ? Number(targetTemperature) + "°"
            : climateModeLabel(mode, deviceType, climateVisualEl)
          : "OFF";
      };
    }
    if (state13) {
      const switchVisual = buildSwitchVisual({
        label,
        interactive: !preview,
        momentary,
        onToggle: () => runHelper4?.(),
      });
      showEntityDetailsValue2 = switchVisual.visual;
      runHelper3 = switchVisual.sync;
      runHelper3(syncClimateControl(entityState?.state), {
        unavailable: ["unknown", "unavailable"].includes(entityState?.state),
      });
    }
    const element12 = document.createElement(state17 ? "button" : "div");
    element12.className = "hb-entity-details-state";
    if (state17) {
      element12.type = "button";
    }
    const element13 = document.createElement("span");
    element13.textContent = state17 ? "⏻" : "当前状态";
    const element14 = document.createElement("strong");
    const state19 = {
      off: "关闭",
      auto: "自动",
      cool: "制冷",
      dry: "除湿",
      heat: "制热",
      fan_only: "送风",
      heat_cool: "冷暖自动",
    };
    element14.textContent = state17
      ? entityState?.state
        ? syncClimateControl(entityState.state)
          ? "已开启"
          : "已关闭"
        : "状态未知"
      : component1 === "climate"
        ? state19[entityState?.state] || entityState?.state || "暂无状态"
        : (entityState?.state ?? "暂无状态");
    element12.classList.toggle("hb-light-details-power", state14);
    element12.classList.toggle("hb-climate-details-power", state15);
    element12.classList.toggle("hb-switch-details-power", state13);
    element12.classList.toggle("is-on", state17 && syncClimateControl(entityState?.state));
    element12.append(element13, element14);
    if (state17) {
      element12.inert = preview;
      element12.setAttribute("aria-disabled", String(preview));
      runHelper = (
        isOn,
        { unavailable = false, syncClimate = true } = {},
      ) => {
        element12.classList.toggle("is-on", isOn);
        element12.classList.toggle("is-unavailable", unavailable);
        element12.setAttribute("aria-pressed", String(isOn));
        element12.disabled = unavailable || preview;
        element14.textContent = unavailable
          ? "当前不可用"
          : momentary
            ? state18 === "success"
              ? "执行成功"
              : showEntityDetailsValue3
                ? "执行中"
                : "等待执行"
            : isOn
              ? "已开启"
              : "已关闭";
        element12.setAttribute(
          "aria-label",
          unavailable
            ? (state14
                ? componentDialogTitle(component, "灯光")
                : state15
                  ? trimmed
                  : label) + "当前不可用"
            : momentary
              ? "" +
                label +
                (state18 === "success"
                  ? "执行成功"
                  : showEntityDetailsValue3
                    ? "正在执行"
                    : "，点击执行")
              : "" +
                componentDialogTitle(
                  component,
                  state14 ? "灯光" : state15 ? state16 : "开关",
                ) +
                (isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
        );
        if (state14) {
          position4?.({
            isOn,
          });
          element2.textContent = isOn ? "已开启" : "已关闭";
          element2.classList.toggle("is-on", isOn);
          element9.setAttribute("aria-pressed", String(isOn));
          element9.setAttribute(
            "aria-label",
            "" +
              componentDialogTitle(component, "灯光") +
              (isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
        }
        if (state15 && element8?.syncClimateState && syncClimate) {
          const climateCapabilities = normalizeClimateCapabilities(
            entityState2 || entityState,
          );
          const trimmed1 =
            deviceType === "water-heater"
              ? climateCapabilities.operationModes.find(
                  (arg) =>
                    !["off", "空"].includes(
                      String(arg).trim().toLowerCase(),
                    ),
                ) || "普通"
              : climateCapabilities.hvacModes.find(
                  (arg) => arg !== "off",
                ) || (deviceType === "bath-heater" ? "heat" : "auto");
          const state25 =
            element8.dataset.lastClimateMode ||
            (entityState?.state && entityState.state !== "off" ? entityState.state : trimmed1);
          element8.syncClimateState({
            state: isOn
              ? deviceType === "water-heater"
                ? "on"
                : state25
              : "off",
            attributes: {
              ...(entityState2?.attributes || entityState?.attributes || {}),
              operation_mode:
                deviceType === "water-heater"
                  ? isOn
                    ? entityState2?.attributes?.operation_mode || trimmed1
                    : "off"
                  : undefined,
              hvac_action:
                deviceType === "water-heater"
                  ? undefined
                  : isOn
                    ? entityState?.attributes?.hvac_action || state25
                    : "off",
            },
          });
        }
        if (state15) {
          element4.textContent =
            deviceType === "water-heater"
              ? waterHeaterStatusLabel({
                  ...(entityState2 || entityState || {}),
                  state: isOn ? "on" : "off",
                })
              : isOn
                ? "已开启"
                : "已关闭";
          element4.classList.toggle("is-on", isOn);
          if (deviceType === "bath-heater") {
            if (!lightVisualEl1) {
              element11.setAttribute("aria-pressed", "false");
            }
            element11.setAttribute("aria-label", trimmed + "，点击切换浴霸灯");
          } else {
            element11.setAttribute("aria-pressed", String(isOn));
            element11.setAttribute(
              "aria-label",
              "" + trimmed + (isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
            );
          }
        }
        if (state13) {
          runHelper3?.(isOn, {
            pending: showEntityDetailsValue3 && state18 !== "success",
            success: state18 === "success",
            unavailable,
          });
          element5.textContent = unavailable
            ? "当前不可用"
            : momentary
              ? state18 === "success"
                ? "执行成功"
                : showEntityDetailsValue3
                  ? "正在执行"
                  : "按下执行"
              : isOn
                ? "已开启"
                : "已关闭";
          element5.classList.toggle(
            "is-on",
            (momentary ? showEntityDetailsValue3 || state18 === "success" : isOn) &&
              !unavailable,
          );
        }
      };
      if (entityState?.state) {
        runHelper(syncClimateControl(entityState.state), {
          unavailable: ["unknown", "unavailable"].includes(entityState.state),
        });
      }
      runHelper4 = async () => {
        if (preview || showEntityDetailsValue3 || !entityState2?.state) {
          return;
        }
        showEntityDetailsValue3 = true;
        const state25 = state14 ? element9 : state15 ? element11 : showEntityDetailsValue2;
        state25?.setAttribute("aria-busy", "true");
        const state26 = element12.classList.contains("is-on");
        const state27 = momentary || !state26;
        runHelper(state27);
        try {
          if (momentary) {
            await this.callEntityService("button", "press", entityId2);
            state18 = "success";
            runHelper(false);
            await new Promise((arg) => window.setTimeout(arg, 900));
          } else if (state15) {
            if (!state27 && deviceType === "bath-heater") {
              const preset_mode = normalizeClimateCapabilities(
                entityState2,
              ).presetModes.find((arg) =>
                ["idle", "standby", "待机", "关闭"].includes(
                  String(arg).trim().toLowerCase(),
                ),
              );
              if (preset_mode) {
                await this.callEntityService(
                  component1 === "fan" ? "fan" : "climate",
                  "set_preset_mode",
                  entityId2,
                  {
                    preset_mode,
                  },
                );
              }
            }
            const state28 = climatePowerCommand(
              entityId2,
              entityState2,
              state27,
              deviceType,
              element8?.dataset.lastClimateMode || "",
            );
            await this.callEntityService(
              state28.domain,
              state28.service,
              entityId2,
              state28.data,
            );
          } else {
            await this.callEntityService("homeassistant", "toggle", entityId2);
          }
        } catch (error) {
          state18 = "idle";
          runHelper(state26);
          this.options.onError?.(error);
        } finally {
          showEntityDetailsValue3 = false;
          if (momentary) {
            state18 = "idle";
            runHelper(false);
          } else if (state13) {
            runHelper3?.(element12.classList.contains("is-on"));
          }
          state25?.removeAttribute("aria-busy");
        }
      };
      element12.addEventListener("click", runHelper4);
      if (state14) {
        element9.addEventListener("click", runHelper4);
      }
      if (state15) {
        element11.addEventListener("click", () => {
          if (deviceType === "bath-heater") {
            if (lightVisualEl1?.toggleBathLight) {
              lightVisualEl1.toggleBathLight();
            } else {
              this.options.onError?.(
                new Error("未找到与浴霸同设备的灯光实体。"),
              );
            }
            return;
          }
          runHelper4();
        });
      }
    }
    const runHelper5 = state15
      ? (arg) =>
          this.createClimateDetailsControls(entityId2, arg, {
            interactive: !preview,
            deviceType,
            onPowerChange: (onPowerChange) =>
              runHelper?.(onPowerChange, {
                syncClimate: false,
              }),
            onVisualChange: ({
              mode: onVisualChange,
              visualMode: onVisualChange2,
              running: onVisualChange3,
              accentColor: onVisualChange4,
              accentSoft: onVisualChange5,
              targetTemperature: onVisualChange6,
            }) => {
              element12.classList.toggle("is-running", onVisualChange3);
              element12.style.setProperty(
                "--hb-climate-accent",
                onVisualChange4,
              );
              element12.style.setProperty(
                "--hb-climate-accent-soft",
                onVisualChange5,
              );
              element4.style.setProperty(
                "--hb-climate-accent",
                onVisualChange4,
              );
              if (deviceType === "water-heater") {
                element4.textContent =
                  onVisualChange2 === "off"
                    ? "已关闭"
                    : onVisualChange3
                      ? "正在加热"
                      : "保温中";
              }
              showEntityDetailsValue1?.({
                mode: onVisualChange,
                visualMode: onVisualChange2,
                running: onVisualChange3,
                accentColor: onVisualChange4,
                targetTemperature: onVisualChange6,
              });
            },
            modeColors: {
              cool: component.properties?.airflowCoolColor || "#73c8ff",
              heat: component.properties?.airflowHeatColor || "#ff8a65",
              other: component.properties?.airflowOtherColor || "#dce2e6",
            },
          })
      : null;
    element8 = state14
      ? this.createLightDetailsControls(entityId2, entityState, {
          interactive: !preview,
          onTurnOn: () => runHelper?.(true),
          onVisualChange: (onVisualChange) => position4?.(onVisualChange),
        })
      : state15
        ? runHelper5(entityState)
        : state3
          ? this.createCoverDetailsControls(entityId2, entityState, {
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
              onVisualChange: ({ position: onVisualChange, state }) => {
                if (state) {
                  text = state;
                }
                runHelper1?.({
                  position: onVisualChange,
                  state,
                });
                const onVisualChange2 = coverPresentationState(
                  {
                    state,
                    attributes: {
                      current_position: onVisualChange,
                    },
                  },
                  motorReversed,
                );
                const onVisualChange3 = {
                  open: "已打开",
                  closed: "已关闭",
                  opening: "正在打开",
                  closing: "正在关闭",
                };
                const onVisualChange4 = physicalCoverState(text, motorReversed);
                element3.textContent = airer
                  ? coverLiftStateLabel(onVisualChange2) || Math.round(onVisualChange) + "%"
                  : dream
                    ? dreamCurtainStatusText(
                        text,
                        onVisualChange,
                        motorReversed,
                      )
                    : onVisualChange3[onVisualChange2] ||
                      Math.round(onVisualChange) + "%";
                element3.classList.toggle(
                  "is-on",
                  dream
                    ? onVisualChange4 === "open" ||
                        onVisualChange4 === "opening"
                    : onVisualChange2 === "open" ||
                        onVisualChange2 === "opening",
                );
              },
              onCurtainPositionChange: ({
                retracted: onCurtainPositionChange,
                moving: onCurtainPositionChange2,
              }) => {
                element10.classList.toggle(
                  "is-curtain-retracted",
                  onCurtainPositionChange,
                );
                element10.classList.toggle(
                  "is-curtain-moving",
                  onCurtainPositionChange2,
                );
                element10.dataset.curtainRetracted = String(
                  onCurtainPositionChange,
                );
                if (dream) {
                  element3.textContent = dreamCurtainStatusFromRetraction(
                    onCurtainPositionChange,
                    onCurtainPositionChange2,
                    position5,
                  );
                  element3.classList.toggle("is-on", onCurtainPositionChange);
                }
              },
            })
          : null;
    if (state14 && element8?.classList.contains("has-color-picker")) {
      dialog.classList.add("color-picker-details");
    }
    if (state15 && deviceType === "water-heater" && element8 && element11) {
      element8.prepend(element11);
      element8.syncClimateGrid?.();
    }
    const state20 =
      (state15 && deviceType === "bath-heater" && entityId1?.roles?.light) || "";
    lightVisualEl =
      (state20
        ? this.entityMetadata.get(state20)
        : state15 && deviceType === "bath-heater"
          ? relatedDeviceDomainEntity(this.entityMetadata, entityId2, "light")
          : null
      )?.entityId || "";
    if (lightVisualEl && element8) {
      const state25 = this.states.get(lightVisualEl);
      const state26 = state25?.newState ||
        state25 || {
          state: "unknown",
          attributes: {},
        };
      lightVisualEl1 = this.createBathHeaterLightControl(lightVisualEl, state26, {
        interactive: !preview,
        onStateChange: ({
          isOn: onStateChange,
          unavailable: onStateChange2,
        }) => {
          element11?.classList.toggle(
            "is-light-on",
            onStateChange && !onStateChange2,
          );
          element11?.setAttribute(
            "aria-pressed",
            String(onStateChange && !onStateChange2),
          );
        },
      });
      element8.append(lightVisualEl1);
      element8.syncClimateGrid?.();
    }
    const refreshEntityCatalog =
      state15 && (deviceType === "water-heater" || lightVisualEl3 !== null)
        ? () => {
            const state25 = allowed;
            const numeric1 = this.createWaterHeaterExtensionControls(entityId2, {
              component,
              interactive: !preview,
              excludedEntityIds: lightVisualEl ? [lightVisualEl] : [],
            });
            lightVisualEl2?.remove();
            lightVisualEl2 = numeric1;
            allowed = new Set(numeric1?.relatedEntityIds || []);
            element8?.classList.toggle(
              "has-multiline-water-heater-extensions",
              deviceType === "water-heater" &&
                Number(numeric1?.dataset?.controlCount || 0) > 2,
            );
            if (deviceType !== "water-heater" && entityDetailsCardEl.isConnected) {
              dialog.classList.toggle("has-related-extensions", !!numeric1);
            }
            if (numeric1 && element8) {
              if (deviceType === "water-heater") {
                (element8.waterHeaterControlPanel || element8).append(numeric1);
                element8.syncClimateGrid?.();
              } else if (entityDetailsCardEl.isConnected) {
                entityDetailsCardEl.append(numeric1);
                dialog.classList.add("has-related-extensions");
              }
            }
            const handlers = this.detailsStateSync?.handlers;
            if (handlers) {
              for (const item of state25) {
                handlers.delete(item);
              }
              for (const [item, item1] of numeric1?.stateHandlers || []) {
                handlers.set(item, item1);
                const state26 = this.states.get(item);
                if (state26) {
                  for (const runHelper6 of item1) {
                    runHelper6(state26.newState || state26);
                  }
                }
              }
            }
          }
        : null;
    refreshEntityCatalog?.();
    let state21 =
      component.type === "line-chart"
        ? renderLineChartDetails(component, {
            states: this.states,
            history: this.historySeries,
            renderNamespace: this.renderNamespace,
          })
        : null;
    let lineChartCurrentVisualEl = null;
    let element15 = null;
    let element16 = null;
    const entityDetailsAttributesEl = document.createElement("dl");
    entityDetailsAttributesEl.className = "hb-entity-details-attributes";
    for (const [entry, entry1] of Object.entries(entityState1).filter(
      ([arg]) => arg !== "friendly_name",
    )) {
      const divEl1 = document.createElement("div");
      const element17 = document.createElement("dt");
      element17.textContent = entry;
      const element18 = document.createElement("dd");
      element18.textContent =
        typeof entry1 == "string" ? entry1 : JSON.stringify(entry1);
      divEl1.append(element17, element18);
      entityDetailsAttributesEl.append(divEl1);
    }
    if (state21) {
      lineChartCurrentVisualEl = document.createElement("section");
      lineChartCurrentVisualEl.className = "hb-line-chart-current-visual";
      lineChartCurrentVisualEl.style.setProperty(
        "--hb-chart-current-color",
        state21.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e",
      );
      element15 = document.createElement("strong");
      const state25 = Number.parseFloat(entityState?.state);
      element15.textContent = Number.isFinite(state25)
        ? formatLineChartValue(state25, component.properties?.statePrecision)
        : entityState?.state || "--";
      element16 = document.createElement("small");
      element16.textContent = String(entityState1.unit_of_measurement || "实时数值");
      lineChartCurrentVisualEl.append(element15, element16);
      element12.style.setProperty(
        "--hb-chart-current-color",
        state21.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e",
      );
      element13.textContent = "●";
      element14.textContent = "实时数据";
      entityDetailsCardEl.append(entityDetailsHeadingEl, lineChartCurrentVisualEl, state21);
    } else if (state15) {
      entityDetailsCardEl.append(
        entityDetailsHeadingEl,
        ...(deviceType === "water-heater" ? [element8] : [element11, element8]),
        ...(deviceType !== "water-heater" && lightVisualEl2 ? [lightVisualEl2] : []),
      );
      dialog.classList.toggle(
        "has-related-extensions",
        deviceType !== "water-heater" && !!lightVisualEl2,
      );
    } else if (state14) {
      const lightDetailsLayoutEl = document.createElement("div");
      lightDetailsLayoutEl.className = "hb-light-details-layout";
      const lightDetailsPanelEl = document.createElement("section");
      lightDetailsPanelEl.className = "hb-light-details-panel";
      lightDetailsPanelEl.append(...(element8 ? [element8] : []));
      lightDetailsLayoutEl.append(lightDetailsPanelEl, element9);
      entityDetailsCardEl.append(entityDetailsHeadingEl, lightDetailsLayoutEl);
    } else if (state13) {
      const switchDetailsLayoutEl = document.createElement("div");
      switchDetailsLayoutEl.className = "hb-switch-details-layout";
      switchDetailsLayoutEl.append(showEntityDetailsValue2);
      entityDetailsCardEl.append(entityDetailsHeadingEl, switchDetailsLayoutEl);
    } else if (state3) {
      const coverDetailsLayoutEl = document.createElement("div");
      coverDetailsLayoutEl.className = "hb-cover-details-layout";
      const coverDetailsPanelEl = document.createElement("section");
      coverDetailsPanelEl.className = "hb-cover-details-panel";
      coverDetailsPanelEl.append(...(element8 ? [element8] : []));
      coverDetailsLayoutEl.append(coverDetailsPanelEl, element10);
      entityDetailsCardEl.append(entityDetailsHeadingEl, coverDetailsLayoutEl);
    } else if (entityDetailsAttributesEl.childElementCount) {
      entityDetailsCardEl.append(
        entityDetailsHeadingEl,
        element12,
        ...(element8 ? [element8] : []),
        entityDetailsAttributesEl,
      );
    } else {
      const element17 = document.createElement("p");
      element17.className = "hb-entity-details-empty";
      element17.textContent = "该实体暂无附加属性。";
      entityDetailsAttributesEl.replaceWith(element17);
      entityDetailsCardEl.append(
        entityDetailsHeadingEl,
        element12,
        ...(element8 ? [element8] : []),
        element17,
      );
    }
    dialog.append(entityDetailsCardEl);
    const rendererRuntimeDialogLayerEl = document.createElement("div");
    rendererRuntimeDialogLayerEl.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    rendererRuntimeDialogLayerEl.tabIndex = -1;
    rendererRuntimeDialogLayerEl.append(dialog);
    this.container.append(rendererRuntimeDialogLayerEl);
    this.detailsDialog = dialog;
    const state22 = state15
      ? 840
      : component.type === "line-chart"
        ? 780
        : state14 || state3
          ? 760
          : state13
            ? 620
            : 460;
    const state23 = state15
      ? deviceType !== "water-heater" && lightVisualEl2
        ? 620
        : 540
      : state14 || state3
        ? 620
        : state13
          ? 500
          : 680;
    this.registerRuntimeDialogScale(rendererRuntimeDialogLayerEl, dialog, state22, state23);
    let state24 = 0;
    if (component.type === "line-chart" && state21) {
      const state25 = () => {
        state24 = 0;
        if (!state21?.isConnected || this.detailsStateSync?.dialog !== dialog) {
          return;
        }
        const state26 = renderLineChartDetails(component, {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace,
        });
        state21.cleanupLineChartHover?.();
        state21.replaceWith(state26);
        state21 = state26;
        lineChartCurrentVisualEl.style.setProperty(
          "--hb-chart-current-color",
          state21.style.getPropertyValue("--hb-chart-current-color") ||
            "#68cc3e",
        );
      };
      const scheduleTimeout = (arg = 700) => {
        state24 ||= window.setTimeout(
          state25,
          Math.max(0, Number(arg) || 0),
        );
      };
      this.detailsStateSync = {
        dialog,
        entityId: entityId2,
        refreshHistory: () => scheduleTimeout(0),
        apply: (apply) => {
          const apply2 = Number.parseFloat(apply?.state);
          element15.textContent = Number.isFinite(apply2)
            ? formatLineChartValue(apply2, component.properties?.statePrecision)
            : apply?.state || "--";
          element16.textContent = String(
            apply?.attributes?.unit_of_measurement || "实时数值",
          );
          element6.textContent =
            apply?.state == null ||
            ["unknown", "unavailable"].includes(apply.state)
              ? "暂无数据"
              : "实时数据";
          state21.syncLineChartState?.(apply);
          lineChartCurrentVisualEl.style.setProperty(
            "--hb-chart-current-color",
            state21.style.getPropertyValue("--hb-chart-current-color") ||
              "#68cc3e",
          );
        },
      };
    } else if (state17 && runHelper) {
      const syncVisualState = (entityState3) => {
        entityState2 = entityState3;
        if (state15 && runHelper5 && element8) {
          const state25 = climateControlStructureKey(
            entityId2,
            entityState3,
            deviceType,
          );
          if (element8.dataset.climateStructureKey !== state25) {
            const element17 = runHelper5(entityState3);
            element17.classList.toggle(
              "has-multiline-water-heater-extensions",
              element8.classList.contains(
                "has-multiline-water-heater-extensions",
              ),
            );
            element17.classList.add("is-runtime-hydrated");
            if (deviceType === "water-heater" && element11) {
              element17.prepend(element11);
            }
            if (lightVisualEl1) {
              element17.append(lightVisualEl1);
              element17.syncClimateGrid?.();
            }
            if (lightVisualEl2 && deviceType === "water-heater") {
              (element17.waterHeaterControlPanel || element17).append(lightVisualEl2);
              element17.syncClimateGrid?.();
            }
            element8.replaceWith(element17);
            element8 = element17;
          }
        }
        if (entityState3?.state) {
          runHelper(syncClimateControl(entityState3.state, entityState3.attributes), {
            unavailable: ["unknown", "unavailable"].includes(entityState3.state),
          });
        }
        element8?.syncLightState?.(entityState3);
        element8?.syncClimateState?.(entityState3);
      };
      const handlers = new Map([[entityId2, [syncVisualState]]]);
      if (lightVisualEl && lightVisualEl1) {
        handlers.set(lightVisualEl, [
          (arg) => lightVisualEl1.syncBathLightState?.(arg),
        ]);
      }
      if (lightVisualEl2?.stateHandlers) {
        for (const [item, item1] of lightVisualEl2.stateHandlers) {
          handlers.set(item, item1);
        }
      }
      this.detailsStateSync = {
        dialog,
        handlers,
        refreshEntityCatalog,
      };
      if (state15 && element8?.querySelector(".hb-climate-details-loading")) {
        const nowMs = Date.now();
        showEntityDetailsValue4 = window.setInterval(() => {
          const state25 = this.states.get(entityId2);
          const state26 = state25?.newState || state25;
          if (state26) {
            syncVisualState(state26);
          }
          if (
            !element8?.querySelector(".hb-climate-details-loading") ||
            Date.now() - nowMs >= 30000
          ) {
            window.clearInterval(showEntityDetailsValue4);
            showEntityDetailsValue4 = null;
          }
        }, 120);
      }
    } else if (state3) {
      const handlers = new Map([
        [entityId2, [(arg) => element8?.syncCoverState?.(arg)]],
      ]);
      if (state7) {
        handlers.set(state7, [runHelper2]);
      }
      if (state8) {
        handlers.set(state8, [
          (arg) => element8?.syncCoverPositionState?.(arg),
        ]);
      }
      if (positionCommandEntityId) {
        handlers.set(positionCommandEntityId, [
          (arg) => {
            element8?.syncCoverPositionCommandState?.(arg);
            if (!state8) {
              element8?.syncCoverPositionState?.(arg);
            }
          },
        ]);
      }
      if (state9) {
        handlers.set(state9, [
          (arg) => element8?.syncAirerMotorState?.(arg),
        ]);
      }
      this.detailsStateSync = {
        dialog,
        handlers,
      };
    }
    element7.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(rendererRuntimeDialogLayerEl, dialog, entityDetailsCardEl);
    rendererRuntimeDialogLayerEl.addEventListener("keydown", (arg) => {
      if (arg.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        window.clearTimeout(state24);
        window.clearInterval(showEntityDetailsValue4);
        showEntityDetailsValue4 = null;
        element8?.cleanupLightDetails?.();
        element8?.cleanupClimateDetails?.();
        element8?.cleanupCoverDetails?.();
        state21?.cleanupLineChartHover?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        rendererRuntimeDialogLayerEl.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
    dialog.focus({
      preventScroll: true,
    });
  }
  resize() {
    if (!this.viewport || !this.document) {
      return;
    }
    const clientWidth = this.container.clientWidth;
    const clientHeight = this.container.clientHeight;
    if (!clientWidth || !clientHeight) {
      return;
    }
    const size = clientWidth / this.document.canvas.width;
    const scale = clientHeight / this.document.canvas.height;
    const scale1 =
      this.options.scaleMode || this.document.canvas.scaleMode || "contain";
    const clamped =
      scale1 === "cover" ? Math.max(size, scale) : Math.min(size, scale);
    const appliedScaleX = scale1 === "stretch" ? size : clamped;
    const appliedScaleY = scale1 === "stretch" ? scale : clamped;
    this.appliedScaleX = appliedScaleX;
    this.appliedScaleY = appliedScaleY;
    this.canvas.style.transform = "scale(" + appliedScaleX + ", " + appliedScaleY + ")";
    this.viewport.style.width = this.document.canvas.width * appliedScaleX + "px";
    this.viewport.style.height = this.document.canvas.height * appliedScaleY + "px";
    this.container.dataset.viewportAspect = (
      clientWidth / clientHeight
    ).toFixed(3);
    this.container.dataset.renderScale = Math.min(appliedScaleX, appliedScaleY).toFixed(4);
    for (const [item, item1] of this.componentHosts) {
      this.updateTransformHandleScale(
        item1,
        this.componentRecords.get(item),
      );
    }
    this.updateMultiSelectionHandleScale(
      this.canvas.querySelector(":scope > .hb-multi-selection-bounds"),
    );
    this.updateRuntimeDialogScale();
  }
  connectRuntime() {
    this.socketGeneration += 1;
    const socketGeneration = this.socketGeneration;
    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    const documentModel = this.page || this.document.pages?.[0];
    const index = new Map(
      (this.document.sharedComponents || []).map((arg) => [
        arg.id,
        arg,
      ]),
    );
    const filtered = [
      ...(documentModel?.sharedComponentIds || [])
        .map((arg) => index.get(arg))
        .filter(Boolean),
      ...(documentModel?.components || []),
    ];
    const entityIds1 = collectEntityIds(filtered);
    const found = this.activePopupId
      ? (this.document.customPopups || []).find(
          (arg) => String(arg.id || "") === this.activePopupId,
        )
      : null;
    for (const item of found?.modules || []) {
      if (item.entityId && !isVirtualEntityId(item.entityId)) {
        entityIds1.add(item.entityId);
      }
    }
    for (const item of [...entityIds1]) {
      if (this.entityMetadata.get(item)?.domain !== "event") {
        continue;
      }
      const component = collectComponents(
        filtered,
        (component2) =>
          component2.type === "presence-sensor" &&
          component2.bindings?.entity?.entityId === item,
      )[0];
      if (!component) {
        continue;
      }
      const state1 = presenceMotionEventConfig(
        item,
        this.states.get(item),
        this.entityMetadata,
        this.states,
        component.properties,
      );
      for (const entity of state1.companionEntityIds) {
        entityIds1.add(entity);
      }
    }
    for (const item of [...entityIds1]) {
      const state1 = this.entityMetadata.get(item);
      if (
        state1?.domain !== "sensor" ||
        !state1.deviceId ||
        !["state", "status", "task_status"].includes(state1.translationKey)
      ) {
        continue;
      }
      const found1 = [...this.entityMetadata.values()].find(
        (arg) =>
          arg.deviceId === state1.deviceId &&
          arg.domain === "vacuum" &&
          entityMetadataIsAvailable(arg),
      );
      if (found1?.entityId) {
        entityIds1.add(found1.entityId);
      }
    }
    for (const item of [...entityIds1]) {
      if (this.entityMetadata.get(item)?.domain !== "vacuum") {
        continue;
      }
      const state1 = item.slice(item.indexOf(".") + 1);
      const state2 = relatedDeviceEntity(
        this.entityMetadata,
        item,
        "select",
        "cleaning_mode",
        "select." + state1 + "_cleaning_mode",
      );
      if (state2?.entityId) {
        entityIds1.add(state2.entityId);
      }
      const state3 = relatedVacuumBatteryEntity(
        this.entityMetadata,
        this.states,
        item,
      );
      if (state3?.entityId) {
        entityIds1.add(state3.entityId);
      }
    }
    for (const item of [...entityIds1]) {
      if (
        (this.entityMetadata.get(item)?.domain ||
          String(item || "").split(".", 1)[0]) !== "cover"
      ) {
        continue;
      }
      const state1 = relatedCoverMotorReverseEntity(
        this.entityMetadata,
        item,
      );
      if (state1?.entityId) {
        entityIds1.add(state1.entityId);
      }
      const state2 = relatedAirerLightEntity(this.entityMetadata, item);
      if (state2?.entityId) {
        entityIds1.add(state2.entityId);
      }
      const state3 = relatedAirerPositionNumberEntity(
        this.entityMetadata,
        item,
      );
      if (state3?.entityId) {
        entityIds1.add(state3.entityId);
      }
      const state4 = relatedAirerCurrentPositionSensor(
        this.entityMetadata,
        item,
      );
      if (state4?.entityId) {
        entityIds1.add(state4.entityId);
      }
      const state5 = relatedAirerMotorSpeedSensor(this.entityMetadata, item);
      if (state5?.entityId) {
        entityIds1.add(state5.entityId);
      }
      const state6 = relatedAirerMotorActionEntities(
        this.entityMetadata,
        item,
      );
      for (const valueEntry of Object.values(state6)) {
        if (valueEntry?.entityId) {
          entityIds1.add(valueEntry.entityId);
        }
      }
    }
    for (const item of [...entityIds1]) {
      const state1 = this.entityMetadata.get(item);
      if (!["climate", "fan"].includes(String(state1?.domain || ""))) {
        continue;
      }
      const state2 = relatedDeviceDomainEntity(
        this.entityMetadata,
        item,
        "light",
      );
      if (state2?.entityId) {
        entityIds1.add(state2.entityId);
      }
    }
    for (const item of [...entityIds1]) {
      if (this.entityMetadata.get(item)?.domain === "water_heater") {
        for (const entity of relatedWaterHeaterEntities(
          this.entityMetadata,
          item,
        )) {
          entityIds1.add(entity.entityId);
        }
      }
    }
    for (const item of [...entityIds1]) {
      const state1 = this.deviceProfile(item);
      if (state1) {
        for (const item1 of [
          "climate",
          "cover",
          "fan",
          "light",
          "power",
          "mode",
          "temperature",
          "humidity",
          "pm25",
          "hcho",
          "pm10",
          "filterLife",
          "filterLeftTime",
          "airQuality",
          "backrest",
          "leg",
          "waist",
          "memory1",
          "memory2",
        ]) {
          const state2 = state1.roles?.[item1];
          if (state2) {
            entityIds1.add(state2);
          }
        }
      }
    }
    const entityIds = [...entityIds1];
    if (!entityIds.length || this.destroyed) {
      return;
    }
    if (entityIds.length > MAX_REALTIME_SUBSCRIBED_ENTITIES) {
      const text = String(entityIds.length);
      if (this.runtimeEntityLimitSignature !== text) {
        this.runtimeEntityLimitSignature = text;
        this.options.onError?.(
          new Error(
            "当前项目需要实时订阅 " +
              entityIds.length +
              " 个实体，已超过 " +
              MAX_REALTIME_SUBSCRIBED_ENTITIES +
              " 个上限。请减少统计或控件中绑定的实体。",
          ),
        );
      }
      return;
    }
    this.runtimeEntityLimitSignature = "";
    const state = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      state + "://" + window.location.host + "/api/v1/ws/runtime",
    );
    this.socket = socket;
    socket.addEventListener("open", () => {
      if (socketGeneration === this.socketGeneration) {
        if (this.reconnectAttempt > 0) {
          window.HABridgeLog?.report(
            "success",
            "实时连接",
            "实时状态连接已恢复",
            {
              phase: "websocket-reconnected",
              path: "/api/v1/ws/runtime",
            },
          );
        }
        this.reconnectAttempt = 0;
        socket.send(
          JSON.stringify({
            type: "subscribe",
            entityIds,
          }),
        );
      }
    });
    socket.addEventListener("message", (arg) => {
      if (socketGeneration !== this.socketGeneration) {
        return;
      }
      let state1;
      try {
        state1 = JSON.parse(arg.data);
      } catch (error) {
        window.HABridgeLog?.error(
          error,
          {
            phase: "websocket-message",
            path: "/api/v1/ws/runtime",
          },
          "实时状态消息格式异常",
        );
        return;
      }
      if (state1.type === "snapshot") {
        const state2 = state1.states || [];
        const allowed = new Set(
          state2
            .map((arg1) => String(arg1?.entityId || ""))
            .filter(Boolean),
        );
        for (const entity of entityIds) {
          if (!allowed.has(entity)) {
            if (this.states.has(entity)) {
              this.removedRuntimeEntityIds.add(entity);
            }
            this.states.delete(entity);
          }
        }
        for (const item of state2) {
          if (this.optimisticStateIsConfirmed(item.entityId, item)) {
            this.rememberLightVisualState(item.entityId, item);
            this.removedRuntimeEntityIds.delete(item.entityId);
            this.states.set(item.entityId, item);
            this.applyRuntimeStateHandlers(
              item.entityId,
              item.newState || item,
            );
          }
        }
        this.options.onRuntimeStateChange?.(state2);
        this.tryOpenPendingEntityDetails();
        for (const item of state2) {
          this.refreshVacuumMapEntity(item.entityId);
        }
        if (this.detailsStateSync?.handlers) {
          for (const [stateEntry, stateEntry1] of this.detailsStateSync.handlers) {
            const state3 = this.states.get(stateEntry);
            if (state3) {
              for (const runHelper of stateEntry1) {
                runHelper(state3.newState || state3);
              }
            }
          }
        } else {
          const state3 = this.detailsStateSync
            ? this.states.get(this.detailsStateSync.entityId)
            : null;
          if (this.detailsStateSync && state3) {
            this.detailsStateSync.apply(state3.newState || state3);
          }
        }
        this.refreshRuntimeComponents([
          ...allowed,
          ...this.removedRuntimeEntityIds,
        ]);
        const allowed2 = new Set(
          collectComponents(filtered, (arg1) => arg1.type === "line-chart")
            .map((component) =>
              String(component.bindings?.entity?.entityId || ""),
            )
            .filter(Boolean),
        );
        const filtered1 = entityIds.filter(
          (entityId) =>
            allowed2.has(entityId) &&
            lineChartRuntimeStateNeedsHydration(this.states.get(entityId)),
        );
        if (filtered1.length && this.runtimeHydrationRetryAttempt < 5) {
          this.runtimeHydrationRetryAttempt += 1;
          window.clearTimeout(this.runtimeHydrationRetryTimer);
          const state3 = Math.min(
            10000,
            2 ** (this.runtimeHydrationRetryAttempt - 1) * 500,
          );
          this.runtimeHydrationRetryTimer = window.setTimeout(() => {
            this.runtimeHydrationRetryTimer = null;
            if (socketGeneration === this.socketGeneration && !this.destroyed) {
              this.connectRuntime();
            }
          }, state3);
        } else if (!filtered1.length) {
          this.runtimeHydrationRetryAttempt = 0;
        }
      } else if (state1.type === "state_removed") {
        const entityId = String(state1.entityId || "");
        if (!entityId) {
          return;
        }
        const state2 = {
          type: "state_changed",
          entityId,
          domain: entityId.split(".", 1)[0],
          state: "unavailable",
          attributes: {},
          available: false,
        };
        this.removedRuntimeEntityIds.add(entityId);
        this.states.delete(entityId);
        this.options.onRuntimeStateChange?.([]);
        this.tryOpenPendingEntityDetails();
        if (this.detailsStateSync?.handlers?.has(entityId)) {
          for (const runHelper of this.detailsStateSync.handlers.get(entityId)) {
            runHelper(state2);
          }
        } else if (this.detailsStateSync?.entityId === entityId) {
          this.detailsStateSync.apply(state2);
        }
        this.applyRuntimeStateHandlers(entityId, state2);
        this.refreshRuntimeComponents([entityId]);
        for (const entity of this.runtimeEntityComponentIndex.get(entityId) ||
          []) {
          const state3 = this.componentRecords.get(entity);
          if (["line-chart", "camera", "vacuum-map"].includes(state3?.type)) {
            this.refreshRuntimeComponent(entity);
          }
        }
        this.refreshVacuumMapEntity(entityId);
      } else if (state1.type === "resync_required") {
        if (socketGeneration === this.socketGeneration && !this.destroyed) {
          this.connectRuntime();
        }
      } else if (state1.type === "state_changed") {
        if (!this.optimisticStateIsConfirmed(state1.entityId, state1)) {
          return;
        }
        this.rememberLightVisualState(state1.entityId, state1);
        this.removedRuntimeEntityIds.delete(state1.entityId);
        this.states.set(state1.entityId, state1);
        this.options.onRuntimeStateChange?.([state1]);
        this.tryOpenPendingEntityDetails();
        this.refreshVacuumMapEntity(state1.entityId);
        if (this.detailsStateSync?.handlers?.has(state1.entityId)) {
          for (const runHelper of this.detailsStateSync.handlers.get(
            state1.entityId,
          )) {
            runHelper(state1.newState || state1);
          }
        } else if (this.detailsStateSync?.entityId === state1.entityId) {
          this.detailsStateSync.apply(state1.newState || state1);
        }
        this.applyRuntimeStateHandlers(
          state1.entityId,
          state1.newState || state1,
        );
        this.scheduleRuntimeRender(state1.entityId);
      }
    });
    socket.addEventListener("close", (arg) => {
      if (socketGeneration !== this.socketGeneration || this.destroyed) {
        return;
      }
      this.socket = null;
      window.HABridgeLog?.report(
        "warning",
        "实时连接",
        "实时状态连接已断开（" +
          arg.code +
          "）" +
          ([4400, 4401, 4403].includes(arg.code) ? "" : "，正在重连"),
        {
          code: arg.code,
          phase: "websocket-disconnected",
          path: "/api/v1/ws/runtime",
        },
      );
      if (arg.code === 4401) {
        const state2 =
          window.location.pathname.startsWith("/display/") ||
          window.location.pathname.startsWith("/habridge/");
        window.location.assign(
          state2
            ? "/pair?next=" +
                encodeURIComponent(
                  "" + window.location.pathname + window.location.search,
                )
            : "/login",
        );
        return;
      }
      if (arg.code === 4403) {
        window.location.replace("/license");
        return;
      }
      if (arg.code === 4400) {
        const state2 =
          arg.reason === "too many entities"
            ? "当前项目的实时订阅实体超过 " +
              MAX_REALTIME_SUBSCRIBED_ENTITIES +
              " 个，已停止重连。请减少统计或控件中绑定的实体。"
            : "实时状态订阅请求无效，已停止自动重连。";
        this.options.onError?.(new Error(state2));
        return;
      }
      const state1 = Math.min(2 ** this.reconnectAttempt * 1000, 15000);
      this.reconnectAttempt += 1;
      this.reconnectTimer = window.setTimeout(
        () => this.connectRuntime(),
        state1,
      );
    });
    socket.addEventListener("error", () => socket.close());
  }
  refreshHistorySeries() {
    if (
      !this.document ||
      this.destroyed ||
      document.visibilityState === "hidden"
    ) {
      return;
    }
    const state = [
      this.historyDocumentGeneration,
      this.page?.path || "",
      this.activePopupId || "",
      this.historyPopupGeneration,
    ].join(":");
    return this.historyRefreshCoordinator.request(state, () =>
      this.refreshHistorySeriesPass(),
    );
  }
  scheduleHistoryRetry() {
    if (
      this.destroyed ||
      document.visibilityState === "hidden" ||
      this.historyRetryTimer ||
      this.historyRetryAttempt >= 4
    ) {
      return;
    }
    const historyRetryAttempt = this.historyRetryAttempt;
    const state = Math.min(8000, 2 ** historyRetryAttempt * 1000);
    this.historyRetryAttempt += 1;
    this.historyRetryTimer = window.setTimeout(() => {
      this.historyRetryTimer = 0;
      this.refreshHistorySeries();
    }, state);
  }
  async refreshHistorySeriesPass() {
    if (
      !this.document ||
      this.destroyed ||
      document.visibilityState === "hidden"
    ) {
      return;
    }
    const documentGeneration = this.historyDocumentGeneration;
    const popupGeneration = this.historyPopupGeneration;
    const pagePath = this.page?.path || "";
    const index = new Map();
    const listComponents = (arg, arg2) => {
      const chartComponents = collectComponents(
        arg,
        (arg1) =>
          arg1.type === "line-chart" || arg1.type === "presence-sensor",
      );
      for (const component of chartComponents) {
        const entityId = component.bindings?.entity?.entityId;
        if (!entityId) {
          continue;
        }
        const isPresenceSensor = component.type === "presence-sensor";
        const count = Math.max(
          30,
          Math.min(
            86400,
            Number(
              isPresenceSensor
                ? 300
                : component.properties?.updateInterval || 600,
            ),
          ),
        );
        const count2 = Math.max(
          1,
          Math.min(
            168,
            Number(
              isPresenceSensor
                ? component.properties?.historyHours || 24
                : component.properties?.hours || 24,
            ),
          ),
        );
        const state4 = index.get(entityId);
        index.set(entityId, {
          interval: Math.min(state4?.interval ?? count, count),
          hours: Math.max(state4?.hours ?? count2, count2),
          documentGeneration,
          shared: !!state4?.shared || !!arg2.shared,
          pagePath: state4?.pagePath ?? arg2.pagePath ?? null,
          popupId: state4?.popupId ?? arg2.popupId ?? null,
          popupGeneration,
        });
      }
    };
    listComponents(this.document.sharedComponents || [], {
      shared: true,
    });
    listComponents(this.page?.components || [], {
      pagePath,
    });
    const found = this.activePopupId
      ? (this.document.customPopups || []).find(
          (arg) => String(arg.id || "") === this.activePopupId,
        )
      : null;
    const state = [];
    for (const component of found?.modules || []) {
      if (component.type === "line-chart" && component.entityId) {
        state.push({
          type: "line-chart",
          bindings: {
            entity: {
              entityId: component.entityId,
            },
          },
          properties: syncedLineChartProperties(
            this.document,
            this.page,
            component.entityId,
            component.properties,
          ),
        });
      }
    }
    listComponents(state, {
      popupId: this.activePopupId || null,
    });
    const nowMs = Date.now();
    let state1 = false;
    let state2 = false;
    const state3 = [...index];
    const refreshChartSeries = () => ({
      documentGeneration: this.historyDocumentGeneration,
      pagePath: this.page?.path || "",
      popupId: this.activePopupId || null,
      popupGeneration: this.historyPopupGeneration,
    });
    const refreshChartSeries1 = async () => {
      while (state3.length) {
        const [entityId, state4] = state3.shift();
        if (this.destroyed || !historyRequestStillRelevant(state4, refreshChartSeries())) {
          continue;
        }
        const state5 = this.historySeries.get(entityId);
        const state6 = this.historySeriesCache.get(
          historySeriesCacheKey(entityId, state4.hours),
        );
        const filtered = [state5, state6]
          .filter(
            (arg) =>
              arg &&
              arg.hours === state4.hours &&
              Array.isArray(arg.points) &&
              arg.points.length > 0,
          )
          .sort((arg, arg2) => arg2.fetchedAt - arg.fetchedAt)[0];
        if (filtered && nowMs - filtered.fetchedAt < state4.interval * 1000) {
          if (state5 !== filtered) {
            this.historySeries.set(entityId, filtered);
            state1 = true;
          }
          continue;
        }
        if (this.historyFetches.has(entityId)) {
          continue;
        }
        this.historyFetches.add(entityId);
        const state7 =
          typeof AbortController == "function" ? new AbortController() : null;
        const state8 = window.setTimeout(
          () => state7?.abort(),
          HISTORY_FETCH_TIMEOUT_MS,
        );
        try {
          const response = await fetch(
            "/api/v1/ha/history?entityId=" +
              encodeURIComponent(entityId) +
              "&hours=" +
              state4.hours,
            {
              credentials: "same-origin",
              headers: {
                Accept: "application/json",
              },
              ...(state7
                ? {
                    signal: state7.signal,
                  }
                : {}),
            },
          );
          if (!response.ok) {
            state2 = true;
            continue;
          }
          const state9 = await response.json();
          if (!historyRequestStillRelevant(state4, refreshChartSeries())) {
            continue;
          }
          const nowMs1 = {
            points: Array.isArray(state9.points) ? state9.points : [],
            hours: state4.hours,
            fetchedAt: Date.now(),
          };
          this.historySeries.set(entityId, nowMs1);
          cacheHistorySeries(this.historySeriesCache, entityId, nowMs1);
          state1 = true;
          if (!nowMs1.points.length) {
            state2 = true;
          }
        } catch (error) {
          if (error?.name === "AbortError") {
            window.HABridgeLog?.report(
              "warning",
              "网络请求",
              "历史曲线请求超时",
              {
                entityId,
                phase: "history-timeout",
                path: "/api/v1/ha/history",
                durationMs: HISTORY_FETCH_TIMEOUT_MS,
              },
            );
          }
          state2 = true;
        } finally {
          window.clearTimeout(state8);
          this.historyFetches.delete(entityId);
        }
      }
    };
    await Promise.all(
      Array.from(
        {
          length: Math.min(2, state3.length),
        },
        () => refreshChartSeries1(),
      ),
    );
    if (state2 && !this.destroyed) {
      this.scheduleHistoryRetry();
    } else {
      this.historyRetryAttempt = 0;
    }
    if (state1 && !this.destroyed) {
      this.detailsStateSync?.refreshHistory?.();
      for (const runHelper of this.historyChartRefreshers) {
        runHelper();
      }
    }
  }
  destroy() {
    this.destroyed = true;
    this.activePopupId = null;
    this.historyDocumentGeneration += 1;
    this.historyPopupGeneration += 1;
    this.socketGeneration += 1;
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
    this.socket?.close();
    this.resizeObserver.disconnect();
    window.visualViewport?.removeEventListener("resize", this.boundResize);
    window.removeEventListener("orientationchange", this.boundResize);
    window.removeEventListener("online", this.boundReconnect);
    document.removeEventListener(
      "visibilitychange",
      this.boundVisibilityChange,
    );
    this.container.removeEventListener(
      "click",
      this.boundRuntimeButtonSound,
      true,
    );
    this.container.replaceChildren();
  }
}
