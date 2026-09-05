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
} from "./registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-presence-runtime-v1-20260901-renderer-light-statistics-runtime-v1-20260901-renderer-line-chart-runtime-v1-20260901-renderer-door-window-runtime-v1-20260901-renderer-weather-chart-v2-20260901-renderer-date-time-runtime-v1-20260901-camera-prewarm-v1-20260901-vacuum-map-retry-v1-20260901-light-effect-first-frame-v1-20260901-light-effect-toggle-confirm-v1-20260901-light-effect-layering-v2-20260901-light-effect-color-cache-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260905-client-log-v1";
import { randomUuid } from "../js/utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
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
const rn = 1000;
const cn = 0.76;
const ss = 0.7;
const as = 1.6;
const os = 2;
const rs = 2.12;
export function runtimeDialogLayout({
  layerWidth: value,
  layerHeight: value2,
  layoutWidth: value3,
  layoutHeight: value4,
  fillAvailable: value5 = false,
  tightFill: value6 = false,
  targetOccupancy: value7 = cn,
}) {
  const count = Math.max(1, Number(value) || 1);
  const count2 = Math.max(1, Number(value2) || 1);
  const count3 = Math.max(1, Number(value3) || 1);
  const count4 = Math.max(1, Number(value4) || 1);
  const safeInset = value6
    ? Math.min(40, Math.max(24, Math.min(count, count2) * 0.03))
    : value5
      ? Math.min(80, Math.max(32, Math.min(count, count2) * 0.075))
      : Math.min(64, Math.max(24, Math.min(count, count2) * 0.05));
  const availableWidth = Math.max(1, count - safeInset * 2);
  const availableHeight = Math.max(1, count2 - safeInset * 2);
  const fitScale = Math.min(availableWidth / count3, availableHeight / count4);
  const count5 = Math.max(0.2, Math.min(1, Number(value7) || cn));
  const value8 = Math.min(
    (count * count5) / count3,
    (count2 * count5) / count4,
  );
  const preferredScale = Math.min(as, value8);
  const value9 = Math.min(
    value5 ? (value6 ? rs : os) : preferredScale,
    fitScale,
  );
  return {
    availableWidth: availableWidth,
    availableHeight: availableHeight,
    fitScale: fitScale,
    preferredScale: preferredScale,
    safeInset: safeInset,
    scale: Math.max(0.08, value9),
  };
}
export function runtimeDialogViewport({
  layerLeft: value7 = 0,
  layerTop: value8 = 0,
  layerWidth: value,
  layerHeight: value2,
  dashboardLeft: value3,
  dashboardTop: value4,
  dashboardWidth: value5,
  dashboardHeight: value6,
}) {
  const value9 = Number(value7) || 0;
  const value10 = Number(value8) || 0;
  const count = Math.max(1, Number(value) || 1);
  const count2 = Math.max(1, Number(value2) || 1);
  const value11 = value9 + count;
  const value12 = value10 + count2;
  const value13 = Number.isFinite(Number(value3)) ? Number(value3) : value9;
  const value14 = Number.isFinite(Number(value4)) ? Number(value4) : value10;
  const count3 = Math.max(1, Number(value5) || count);
  const count4 = Math.max(1, Number(value6) || count2);
  const count5 = Math.max(value9, value13);
  const count6 = Math.max(value10, value14);
  const value15 = Math.min(value11, value13 + count3);
  const value16 = Math.min(value12, value14 + count4);
  const width = Math.max(1, value15 - count5);
  const height = Math.max(1, value16 - count6);
  return {
    width: width,
    height: height,
    centerX: count5 - value9 + width / 2,
    centerY: count6 - value10 + height / 2,
  };
}
function hi(value) {
  value.id = "component-" + randomUuid();
  for (const value2 of value.children || []) {
    hi(value2);
  }
  return value;
}
function gi(value) {
  const value2 = navigator.userAgentData?.platform || navigator.platform || "";
  const value3 = /mac|iphone|ipad|ipod/i.test(value2);
  return value.altKey || value.ctrlKey || (value3 && value.metaKey);
}
function De(value, value2) {
  return componentActionIsSupported(value, value2);
}
export function componentDialogTitle(component, value) {
  const value2 = component?.properties || {};
  return String(value2.label || "").trim() || value;
}
export function popupModuleDialogTitle(value, value2, value3 = "") {
  return (
    String(value?.title || "").trim() ||
    String(value3 || "").trim() ||
    String(value2?.attributes?.friendly_name || "").trim() ||
    String(value?.entityId || "").trim()
  );
}
function fi(value) {
  const ownerDocument = value.ownerDocument;
  const value2 = ownerDocument.createElement("span");
  value2.className = "hb-airer-visual";
  const value3 = ownerDocument.createElement("i");
  value3.className = "hb-airer-visual-glow";
  const value4 = ownerDocument.createElement("span");
  value4.className = "hb-airer-visual-body";
  const value5 = ownerDocument.createElement("i");
  value5.className = "hb-airer-visual-lamp";
  value4.append(value5);
  const value6 = ownerDocument.createElement("span");
  value6.className = "hb-airer-visual-lifts";
  value6.append(
    ownerDocument.createElement("i"),
    ownerDocument.createElement("i"),
  );
  const value7 = ownerDocument.createElement("span");
  value7.className = "hb-airer-visual-rack";
  for (let value8 = 0; value8 < 4; value8 += 1) {
    value7.append(ownerDocument.createElement("i"));
  }
  value2.append(value3, value4, value6, value7);
  value.append(value2);
}
function ln(value) {
  return (
    {
      open: "已升起",
      closed: "已下降",
      opening: "正在升起",
      closing: "正在下降",
    }[value] || ""
  );
}
function dn({
  label: value = "开关",
  interactive: value2 = true,
  onToggle: value3 = null,
  compact: value4 = false,
  momentary: value5 = false,
} = {}) {
  const visual = document.createElement("button");
  visual.type = "button";
  visual.className = "hb-switch-visual";
  visual.classList.toggle("is-momentary", value5);
  visual.inert = !value2;
  visual.setAttribute("aria-disabled", String(!value2));
  const value6 = document.createElement("i");
  value6.className = "hb-switch-visual-aura";
  const value7 = document.createElement("span");
  value7.className = "hb-switch-visual-plate";
  const value8 = document.createElement("i");
  value8.className = "hb-switch-visual-indicator";
  const value9 = document.createElement("span");
  value9.className = "hb-switch-visual-rocker";
  const element = document.createElement("i");
  element.className = "hb-switch-visual-mark off";
  element.textContent = "○";
  const element2 = document.createElement("i");
  element2.className = "hb-switch-visual-mark on";
  element2.textContent = "┃";
  value9.append(element, element2);
  value7.append(value8, value9);
  visual.append(value6, value7);
  const value10 = value4 ? document.createElement("span") : null;
  const element3 = value4 ? document.createElement("strong") : null;
  const element4 = value4 ? document.createElement("output") : null;
  if (value4) {
    value10.className = "hb-switch-visual-copy";
    element3.className = "hb-switch-visual-copy-label";
    element4.className = "hb-switch-visual-copy-state";
    element3.textContent = value;
    value10.append(element3, element4);
    visual.append(value10);
    visual.classList.add("is-compact");
  }
  const sync = (
    value11,
    {
      unavailable: value12 = false,
      pending: value13 = false,
      success: value14 = false,
    } = {},
  ) => {
    const value15 = (value5 ? value13 : !!value11) && !value12;
    visual.classList.toggle("is-on", value15);
    visual.classList.toggle("is-unavailable", value12);
    visual.classList.toggle("is-pending", value13);
    visual.classList.toggle("is-success", value14);
    visual.setAttribute("aria-pressed", String(value15));
    visual.setAttribute("aria-busy", String(value13));
    visual.setAttribute(
      "aria-label",
      value12
        ? value + "当前不可用"
        : value5
          ? "" +
            value +
            (value14 ? "执行成功" : value13 ? "正在执行" : "，点击执行")
          : "" + value + (value15 ? "已开启，点击关闭" : "已关闭，点击开启"),
    );
    if (element4) {
      element4.textContent = value12
        ? "当前不可用"
        : value5
          ? value14
            ? "执行成功"
            : value13
              ? "执行中"
              : "点击执行"
          : value15
            ? "运行中"
            : "已关闭";
    }
  };
  visual.addEventListener("click", () => {
    if (
      value2 &&
      !visual.classList.contains("is-pending") &&
      !visual.classList.contains("is-unavailable")
    ) {
      value3?.();
    }
  });
  return {
    visual: visual,
    sync: sync,
  };
}
function un(value, value2, value3 = 0) {
  const fn = (value6) => {
    const value7 = String(value6 || "").trim();
    const value8 = /^#[0-9a-f]{3}$/i.test(value7)
      ? "#" +
        value7
          .slice(1)
          .split("")
          .map((value9) => "" + value9 + value9)
          .join("")
      : value7;
    if (/^#[0-9a-f]{6}$/i.test(value8)) {
      return value8;
    } else {
      return null;
    }
  };
  const value4 = fn(value);
  const value5 = fn(value2);
  if (!value4 || !value5) {
    return value;
  }
  const count = Math.max(0, Math.min(1, Number(value3) || 0));
  const fn2 = (value6, value7) =>
    Number.parseInt(value6.slice(value7, value7 + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((value6) =>
        Math.round(
          fn2(value4, value6) +
            (fn2(value5, value6) - fn2(value4, value6)) * count,
        ),
      )
      .map((value6) => value6.toString(16).padStart(2, "0"))
      .join("")
  );
}
export class PanelRenderer {
  constructor(value, value2 = {}) {
    this.container = value;
    this.options = {
      ...value2,
      onError: (onError) => {
        window.HABridgeLog?.error(onError, {
          phase: "runtime-operation",
        });
        value2.onError?.(onError);
      },
    };
    this.boundRuntimeButtonSound = (value3) => {
      if (this.options.editable) {
        return;
      }
      const value4 =
        typeof Element !== "undefined" && value3.target instanceof Element
          ? value3.target.closest('button, [role="button"]')
          : null;
      if (!!value4 && !!this.container.contains(value4)) {
        this.options.onRuntimeButtonPress?.(value4);
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
      value2.runtimeStateCache instanceof Map
        ? value2.runtimeStateCache
        : new Map();
    this.virtualEntityStates =
      value2.virtualEntityStateCache instanceof Map
        ? value2.virtualEntityStateCache
        : new Map();
    this.entityMetadata = new Map();
    this.deviceMetadata = new Map();
    this.entityCatalogReady = false;
    this.entityTranslations = {};
    this.historySeries = new Map();
    this.historySeriesCache =
      value2.historySeriesCache instanceof Map
        ? value2.historySeriesCache
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
    this.resizeObserver.observe(value);
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
        const value3 = Date.now();
        if (this.document && value3 - this.lastRuntimeResumeAt >= 1500) {
          this.lastRuntimeResumeAt = value3;
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
  setDocument(value, value2 = null) {
    this.destroyed = false;
    const value3 = this.options.editable
      ? new Map(
          [...this.componentHosts].filter(
            ([value4, value5]) =>
              this.componentRecords.get(value4)?.type ===
                "floorplan-auto-diagram" &&
              value5.querySelector(".hb-floorplan-auto-diagram-preview"),
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
      this.document = this.options.editable ? structuredClone(value) : value;
      this.vacuumMapEntityIds = new Set(
        collectComponents(
          [
            ...(this.document.sharedComponents || []),
            ...this.document.pages.flatMap((value6) => value6.components || []),
          ],
          (value6) => value6.type === "vacuum-map",
        )
          .map((component) =>
            String(component.bindings?.entity?.entityId || ""),
          )
          .filter((value6) => value6.startsWith("image.")),
      );
      const value4 = this.document.pages.find(
        (value6) => value6.path === value2,
      );
      const value5 = this.document.pages.find(
        (value6) => value6.path === this.document.defaultPagePath,
      );
      this.page = value4 || value5 || this.document.pages[0];
      this.render(value3);
      this.preloadStaticImages();
      if (!this.options.editable) {
        const value6 = collectComponents(
          [
            ...(this.document.sharedComponents || []),
            ...this.document.pages.flatMap((value7) => value7.components || []),
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
        prewarmCameraMedia(value6);
      }
      this.connectRuntime();
      this.refreshHistorySeries();
    } finally {
      this.replacingDocument = replacingDocument;
    }
  }
  refreshBuiltinAssets(value = []) {
    const value2 = setBuiltinAssetVersions(value);
    if (value2 && this.document) {
      this.renderComponents(true);
      this.preloadStaticImages();
    }
    return value2;
  }
  preloadStaticImages() {
    if (!this.document || !this.page) {
      return;
    }
    const fn = (value5) =>
      collectComponents(
        value5,
        (component) =>
          component.type === "image" && component.properties?.assetId,
      )
        .map((component) =>
          staticAssetImageSource(component.properties.assetId),
        )
        .filter(Boolean);
    const index = new Map(
      (this.document.sharedComponents || []).map((value5) => [
        value5.id,
        value5,
      ]),
    );
    const value2 = (this.page.sharedComponentIds || [])
      .map((value5) => index.get(value5))
      .filter(Boolean);
    const value3 = fn([...(this.page.components || []), ...value2]);
    const value4 = fn([
      ...(this.document.sharedComponents || []),
      ...this.document.pages.flatMap((value5) => value5.components || []),
    ]);
    this.runtimeStaticImageCache.setSources(value4, value3);
  }
  setEntityCatalog(value = [], value2 = {}, value3 = []) {
    this.entityMetadata = new Map(
      (value || [])
        .map((value4) => [String(value4.entityId || ""), value4])
        .filter(([value4]) => value4),
    );
    this.deviceMetadata = new Map(
      (value3 || [])
        .map((value4) => [String(value4.deviceId || ""), value4])
        .filter(([value4]) => value4),
    );
    this.entityTranslations = value2 && typeof value2 == "object" ? value2 : {};
    this.entityCatalogReady = true;
    this.tryOpenPendingEntityDetails();
    if (this.document) {
      this.detailsStateSync?.refreshEntityCatalog?.();
      this.renderComponents(true);
      this.connectRuntime();
    }
  }
  deviceProfile(value) {
    return resolveXiaomiDeviceProfile(
      value,
      this.entityMetadata,
      this.deviceMetadata,
      this.states,
    );
  }
  runtimeEntityId(value) {
    return String(value || "");
  }
  iconVisibilityPageKey() {
    return String(this.page?.path || this.page?.id || "current-page");
  }
  iconVisibilityState() {
    return this.virtualEntityStates.get(this.iconVisibilityPageKey()) !== false;
  }
  toggleVirtualEntity(entityId) {
    const value = parseVirtualEntityId(entityId);
    if (!value || value.kind !== ICON_VISIBILITY_VIRTUAL_KIND) {
      throw new Error("虚拟实体不存在。");
    }
    if (
      ![...this.componentRecords.values()].some(
        (value4) => value4.type === "icon-button-effect",
      )
    ) {
      throw new Error("当前页面没有图标按钮（效果）。");
    }
    const value2 = this.iconVisibilityPageKey();
    const value3 = !this.iconVisibilityState();
    this.virtualEntityStates.set(value2, value3);
    this.states.set(entityId, {
      entityId: entityId,
      state: value3 ? "on" : "off",
      attributes: {},
    });
    this.renderComponents(true);
  }
  waterHeaterDetailsReady(value) {
    if (!this.entityCatalogReady) {
      return false;
    }
    const value2 = this.states.get(value);
    const value3 = (value2?.newState || value2)?.attributes || {};
    const numeric = Number(value3.temperature);
    const numeric2 = Number(value3.min_temp);
    const numeric3 = Number(value3.max_temp);
    return (
      Number.isFinite(numeric) &&
      Number.isFinite(numeric2) &&
      Number.isFinite(numeric3) &&
      numeric3 > numeric2
    );
  }
  deferEntityDetailsUntilReady(value, preview, reason = "water-heater") {
    window.clearTimeout(this.pendingEntityDetails?.timer);
    window.clearTimeout(this.pendingEntityDetails?.retryTimer);
    const value2 = {
      component: structuredClone(value),
      preview: preview,
      reason: reason,
      retryTimer: null,
      timer: null,
    };
    const value3 = reason === "catalog" || reason === "electric-bed-catalog";
    if (value3) {
      const value4 = () => {
        if (this.pendingEntityDetails !== value2) {
          return;
        }
        const value5 = this.runtimeEntityId(
          value2.component?.bindings?.entity?.entityId,
        );
        if (
          !this.entityCatalogReady ||
          (reason === "electric-bed-catalog" &&
            this.deviceProfile(value5)?.deviceType !== "electric-bed")
        ) {
          value2.retryTimer = window.setTimeout(value4, 260);
          return;
        }
        window.clearTimeout(value2.timer);
        this.pendingEntityDetails = null;
        this.showEntityDetails(value2.component, {
          preview: value2.preview,
        });
      };
      value2.retryTimer = window.setTimeout(value4, 260);
    }
    value2.timer = window.setTimeout(
      () => {
        if (this.pendingEntityDetails === value2) {
          this.pendingEntityDetails = null;
          if (
            value3 &&
            this.detailsDialog?.classList.contains(
              "electric-bed-loading-details",
            )
          ) {
            this.detailsDialog.close();
          }
          if (value3) {
            this.options.onError?.(new Error("设备信息正在加载，请稍后重试。"));
          } else {
            this.options.onError?.(
              new Error("热水器状态正在加载，请稍后重试。"),
            );
          }
        }
      },
      value3 ? 10000 : 3000,
    );
    this.pendingEntityDetails = value2;
  }
  tryOpenPendingEntityDetails() {
    const pendingEntityDetails = this.pendingEntityDetails;
    if (!pendingEntityDetails) {
      return false;
    }
    const value = this.runtimeEntityId(
      pendingEntityDetails.component?.bindings?.entity?.entityId,
    );
    if (
      !this.entityCatalogReady ||
      (pendingEntityDetails.reason === "water-heater" &&
        !this.waterHeaterDetailsReady(value)) ||
      (pendingEntityDetails.reason === "electric-bed-catalog" &&
        this.deviceProfile(value)?.deviceType !== "electric-bed")
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
    value = component?.bindings?.entity?.entityId || "",
  ) {
    return applyXiaomiDeviceProfile(
      component,
      this.deviceProfile(this.runtimeEntityId(value)) ||
        this.deviceProfile(value),
    );
  }
  powerEntityId(
    component,
    value = component?.bindings?.entity?.entityId || "",
  ) {
    const value2 = this.runtimeEntityId(value);
    const value3 = this.deviceProfile(value2) || this.deviceProfile(value);
    const value4 = entityPowerTarget(value2, component, value3);
    if (value4 !== value2) {
      return this.runtimeEntityId(value4);
    }
    const value5 = relatedPopupContext(
      component,
      this.entityMetadata,
      this.deviceMetadata,
      this.states,
    );
    if (
      component?.type !== "air-conditioner" &&
      value5?.deviceType === "bath-heater"
    ) {
      const value6 = value5.siblings?.find(
        (value7) =>
          value7.domain === "light" && entityMetadataIsAvailable(value7),
      );
      if (value6?.entityId) {
        return this.runtimeEntityId(value6.entityId);
      }
    }
    return value2;
  }
  runtimePowerComponent(
    component,
    value = component?.bindings?.entity?.entityId || "",
  ) {
    const component2 = this.profiledComponent(component, value);
    const value2 = this.runtimeEntityId(value);
    const entityId = this.powerEntityId(component2, value);
    if (!entityId || (entityId === value2 && value2 === value)) {
      return component2;
    } else {
      return {
        ...component2,
        bindings: {
          ...(component2.bindings || {}),
          entity: {
            entityId: entityId,
          },
        },
        properties: {
          ...(component2.properties || {}),
          runtimePowerEntityId: entityId,
        },
      };
    }
  }
  navigate(value) {
    const value2 = this.document?.pages.find((value3) => value3.path === value);
    if (value2) {
      this.page = value2;
      window.clearTimeout(this.runtimeHydrationRetryTimer);
      this.runtimeHydrationRetryTimer = null;
      this.runtimeHydrationRetryAttempt = 0;
      this.preloadStaticImages();
      this.renderComponents();
      this.connectRuntime();
      this.refreshHistorySeries();
      this.options.onPageChange?.(value2);
    }
  }
  setSelectedComponent(value) {
    this.setSelectedComponents(value ? [value] : [], value);
  }
  setSelectedComponents(value, value2 = null) {
    this.selectedComponentIds = new Set(
      (value || []).filter((value3) => this.componentRecords.has(value3)),
    );
    this.selectedComponentId = this.selectedComponentIds.has(value2)
      ? value2
      : this.selectedComponentIds.values().next().value || null;
    this.syncSelection();
  }
  setActiveGroup(value = null) {
    this.activeGroupId =
      value && this.componentRecords.get(value)?.type === "group"
        ? value
        : null;
    this.syncActiveGroup();
  }
  syncActiveGroup() {
    if (this.canvas) {
      this.canvas.classList.toggle("hb-editing-group", !!this.activeGroupId);
      for (const [value, element] of this.componentHosts) {
        element.classList.toggle(
          "hb-active-edit-group",
          value === this.activeGroupId && element.parentElement === this.canvas,
        );
      }
    }
  }
  setComponentSelectionLayer(value, value2 = "button") {
    if (value) {
      if (value2 === "airflow") {
        this.componentSelectionLayers.set(value, "airflow");
      } else if (value2 === "effect") {
        this.componentSelectionLayers.set(value, "effect");
      } else if (value2 === "perspective") {
        this.componentSelectionLayers.set(value, "perspective");
      } else {
        this.componentSelectionLayers.delete(value);
      }
      this.syncSelection();
    }
  }
  setComponentPreviewState(value, value2 = "auto") {
    if (value2 === "on" || value2 === "off") {
      this.componentPreviewStates.set(value, value2);
    } else {
      this.componentPreviewStates.delete(value);
    }
    this.previewComponentProperties(value);
  }
  previewComponentTransform(value, value2 = {}) {
    const value3 = this.componentRecords.get(value);
    const value4 = this.componentHosts.get(value);
    if (!!value3 && !!value4) {
      value3.position = {
        ...(value3.position || {}),
      };
      value3.style = {
        ...(value3.style || {}),
      };
      if (Number.isFinite(value2.x)) {
        value3.position.x = value2.x;
        value4.style.left = value2.x + "px";
      }
      if (Number.isFinite(value2.y)) {
        value3.position.y = value2.y;
        value4.style.top = value2.y + "px";
      }
      if (Number.isFinite(value2.width)) {
        value3.position.width = value2.width;
        value4.style.width = value2.width + "px";
      }
      if (Number.isFinite(value2.height)) {
        value3.position.height = value2.height;
        value4.style.height = value2.height + "px";
      }
      if (Number.isFinite(value2.rotation)) {
        value3.position.rotation = value2.rotation;
      }
      if (Number.isFinite(value2.scale)) {
        value3.style.scale = value2.scale;
      }
      if (Number.isFinite(value2.rotation) || Number.isFinite(value2.scale)) {
        value4.style.transform =
          "rotate(" +
          Number(value3.position.rotation || 0) +
          "deg) scale(" +
          Number(value3.style.scale || 1) +
          ")";
      }
      this.syncComponentSelectionOverlay(value);
      this.updateTransformHandleScale(value4, value3);
    }
  }
  previewComponentProperties(value, fallback = {}) {
    const component = this.componentRecords.get(value);
    const value2 = this.componentHosts.get(value);
    if (!component || !value2) {
      return;
    }
    component.properties = {
      ...(component.properties || {}),
      ...fallback,
    };
    if (
      component.type === "camera" &&
      Object.hasOwn(fallback, "label") &&
      this.detailsDialog?.dataset?.componentId === value
    ) {
      const element = this.detailsDialog.querySelector(
        ".hb-camera-preview-heading strong",
      );
      if (element) {
        element.textContent = componentDialogTitle(component, "摄像头实时预览");
      }
    }
    if (Number.isFinite(fallback.opacity)) {
      const hbImageComponent = value2.querySelector(".hb-image-component");
      if (hbImageComponent) {
        hbImageComponent.style.opacity = String(
          Math.max(0, Math.min(1, fallback.opacity)),
        );
      }
      const hbVacuumMapComponent = value2.querySelector(
        ".hb-vacuum-map-component",
      );
      if (hbVacuumMapComponent) {
        hbVacuumMapComponent.style.opacity = String(
          Math.max(0, Math.min(1, fallback.opacity)),
        );
      }
    }
    if (component.type === "light-statistics") {
      this.refreshRuntimeComponent(value);
      return;
    }
    const value3 = [
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
    if (this.options.editable && value3.includes(component.type)) {
      this.refreshEditorComponent(value);
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
      const value4 = [...value2.children].find(
        (element) => !element.classList.contains("hb-selection-bounds"),
      );
      const value5 = {
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
        previewState: this.componentPreviewStates.get(value) || "auto",
        isIconVisible: (isIconVisible) =>
          this.iconVisibilityState(isIconVisible),
        navigate: (navigate) => this.navigate(navigate),
        cleanup: (cleanup) => this.cleanups.push(cleanup),
      };
      const value6 = renderRegisteredComponent(
        this.profiledComponent(component),
        value5,
      );
      const numeric = Number(this.document.canvas.componentScale || 1);
      if (numeric !== 1) {
        value6.style.width = 100 / numeric + "%";
        value6.style.height = 100 / numeric + "%";
        value6.style.transform = "scale(" + numeric + ")";
        value6.style.transformOrigin = "top left";
      }
      if (value4) {
        value4.replaceWith(value6);
      } else {
        value2.prepend(value6);
      }
    }
  }
  syncSelection() {
    this.canvas
      ?.querySelectorAll(".hb-multi-selection-bounds")
      .forEach((value) => value.remove());
    this.canvas
      ?.querySelectorAll(".hb-component-selection-overlay")
      .forEach((value) => value.remove());
    this.componentSelectionOverlays.clear();
    for (const value of this.componentAirflowLayers.values()) {
      value
        .querySelectorAll(":scope > .hb-selection-bounds")
        .forEach((value2) => value2.remove());
    }
    for (const [value, element] of this.componentHosts) {
      const value2 =
        this.options.editable && this.selectedComponentIds.has(value);
      const component = this.componentRecords.get(value);
      const value3 =
        component?.type === "floorplan-auto-diagram" &&
        component.properties?.generated !== true;
      element.hidden = value3 ? !value2 : component?.style?.visible === false;
      element.classList.toggle("selected", value2);
      element.classList.toggle(
        "selection-primary",
        value2 && value === this.selectedComponentId,
      );
      element.classList.toggle(
        "hb-light-statistics-selection-host",
        value2 &&
          this.selectedComponentIds.size === 1 &&
          component?.type === "light-statistics",
      );
      element
        .querySelectorAll(
          ":scope > .hb-selection-bounds, :scope > .hb-transform-handle",
        )
        .forEach((value7) => value7.remove());
      if (!value2) {
        continue;
      }
      const value4 =
        this.selectedComponentIds.size === 1 &&
        value === this.selectedComponentId &&
        component?.type === "air-conditioner" &&
        this.componentSelectionLayers.get(value) === "airflow";
      const value5 =
        this.selectedComponentIds.size === 1 &&
        value === this.selectedComponentId &&
        component?.type === "icon-button-effect" &&
        this.componentSelectionLayers.get(value) === "effect";
      const value6 =
        this.selectedComponentIds.size === 1 &&
        value === this.selectedComponentId &&
        component?.type === "presence-sensor" &&
        component?.properties?.sensorKind === "door-window" &&
        this.componentSelectionLayers.get(value) === "perspective";
      if (value4) {
        this.appendAirflowTransformHandles(
          this.componentAirflowLayers.get(value),
          component,
        );
      } else if (
        value5 &&
        this.componentEffectLayers.get(value) &&
        !this.componentEffectLayers.get(value).hidden
      ) {
        this.appendEffectSelectionBounds(
          this.componentEffectLayers.get(value),
          component,
        );
      } else if (value6) {
        const value7 =
          this.createComponentSelectionOverlay(element, component) || element;
        this.appendDoorWindowPerspectiveHandles(element, component, value7);
      } else {
        const value7 = this.selectedComponentIds.size === 1;
        const value8 = value7
          ? this.createComponentSelectionOverlay(element, component)
          : element;
        this.appendTransformHandles(
          element,
          component,
          value7,
          value8 || element,
        );
      }
    }
    if (this.selectedComponentIds.size > 1) {
      this.appendMultiSelectionBounds();
    }
  }
  selectedScaleRecords() {
    const value = [...this.selectedComponentIds].map((value3) => ({
      component: this.componentRecords.get(value3),
      host: this.componentHosts.get(value3),
    }));
    const value2 = value[0]?.host?.parentElement || null;
    if (
      value.length < 2 ||
      value.some(
        (value3) =>
          !value3.component ||
          !value3.host ||
          value3.host.parentElement !== value2 ||
          value3.component.properties?.layoutMode === "fill",
      )
    ) {
      return [];
    } else {
      return value;
    }
  }
  componentParentTransform(value) {
    let value2 = this.componentParentIds?.get(value) || null;
    let rotation = 0;
    let scale = 1;
    const allowed = new Set();
    while (value2 && !allowed.has(value2)) {
      allowed.add(value2);
      const value3 = this.componentRecords.get(value2);
      if (!value3) {
        break;
      }
      rotation += Number(value3.position?.rotation || 0);
      scale *= Math.max(0.01, Math.min(5, Number(value3.style?.scale || 1)));
      value2 = this.componentParentIds?.get(value2) || null;
    }
    return {
      rotation: rotation,
      scale: scale,
    };
  }
  componentTransformChain(value) {
    const value2 = [];
    let value3 = value;
    const allowed = new Set();
    while (value3 && !allowed.has(value3)) {
      allowed.add(value3);
      const value4 = this.componentRecords.get(value3);
      if (!value4) {
        break;
      }
      value2.push(value4);
      value3 = this.componentParentIds?.get(value3) || null;
    }
    return value2;
  }
  componentWorldTransform(value) {
    return this.componentTransformChain(value).reduce(
      (value2, value3) => ({
        rotation: value2.rotation + Number(value3.position?.rotation || 0),
        scale:
          value2.scale *
          Math.max(0.01, Math.min(5, Number(value3.style?.scale || 1))),
      }),
      {
        rotation: 0,
        scale: 1,
      },
    );
  }
  worldPointToComponentLocal(value, value2, value3) {
    let value4 = {
      x: Number(value2 || 0),
      y: Number(value3 || 0),
    };
    const value5 = this.componentTransformChain(value).reverse();
    for (const value6 of value5) {
      const value7 = value6.position || {};
      const numeric = Number(value7.width || 100);
      const numeric2 = Number(value7.height || 100);
      const count = Math.max(
        0.01,
        Math.min(5, Number(value6.style?.scale || 1)),
      );
      const value8 = (Number(value7.rotation || 0) * Math.PI) / 180;
      const value9 = Math.cos(value8);
      const value10 = Math.sin(value8);
      const value11 = Number(value7.x || 0) + numeric / 2;
      const value12 = Number(value7.y || 0) + numeric2 / 2;
      const value13 = (value4.x - value11) / count;
      const value14 = (value4.y - value12) / count;
      value4 = {
        x: numeric / 2 + value13 * value9 + value14 * value10,
        y: numeric2 / 2 - value13 * value10 + value14 * value9,
      };
    }
    return value4;
  }
  componentVisualBounds(value, value2 = null) {
    const value3 = value.position || {};
    const count = Math.max(0.01, Number(value3.width || 100));
    const count2 = Math.max(0.01, Number(value3.height || 100));
    let value4 = count;
    let value5 = count2;
    let value6 = 0;
    let value7 = 0;
    if (value.type === "light-statistics" && value2) {
      const element = value2.querySelector(":scope > .hb-selection-bounds");
      const value21 = element
        ? [
            Number.parseFloat(element.style.left),
            Number.parseFloat(element.style.top),
            Number.parseFloat(element.style.width),
            Number.parseFloat(element.style.height),
          ]
        : [];
      if (value21.every(Number.isFinite) && value21[2] > 0 && value21[3] > 0) {
        [value6, value7, value4, value5] = value21;
      }
    }
    const count3 = Math.max(0.01, Math.min(5, Number(value.style?.scale || 1)));
    const value8 = (Number(value3.rotation || 0) * Math.PI) / 180;
    const value9 = value4 * count3;
    const value10 = value5 * count3;
    const value11 =
      (Math.abs(Math.cos(value8)) * value9 +
        Math.abs(Math.sin(value8)) * value10) /
      2;
    const value12 =
      (Math.abs(Math.sin(value8)) * value9 +
        Math.abs(Math.cos(value8)) * value10) /
      2;
    const value13 = Number(value3.x || 0) + count / 2;
    const value14 = Number(value3.y || 0) + count2 / 2;
    const value15 = Number(value3.x || 0) + value6 + value4 / 2;
    const value16 = Number(value3.y || 0) + value7 + value5 / 2;
    const value17 = (value15 - value13) * count3;
    const value18 = (value16 - value14) * count3;
    const value19 =
      value13 + value17 * Math.cos(value8) - value18 * Math.sin(value8);
    const value20 =
      value14 + value17 * Math.sin(value8) + value18 * Math.cos(value8);
    return {
      left: value19 - value11,
      top: value20 - value12,
      right: value19 + value11,
      bottom: value20 + value12,
    };
  }
  scaleRecordsBounds(value) {
    const value2 = value.map((value3) =>
      this.componentVisualBounds(value3.component, value3.host),
    );
    return {
      left: Math.min(...value2.map((left) => left.left)),
      top: Math.min(...value2.map((top) => top.top)),
      right: Math.max(...value2.map((right) => right.right)),
      bottom: Math.max(...value2.map((bottom) => bottom.bottom)),
    };
  }
  refreshMultiSelectionBounds() {
    const value = this.canvas?.querySelector(".hb-multi-selection-bounds");
    if (
      !value ||
      !this.selectedComponentIds ||
      this.selectedComponentIds.size < 2
    ) {
      return;
    }
    const value2 = this.selectedScaleRecords();
    if (!value2.length) {
      value.remove();
      return;
    }
    const value3 = this.scaleRecordsBounds(value2);
    Object.assign(value.style, {
      left: value3.left + "px",
      top: value3.top + "px",
      width: Math.max(1, value3.right - value3.left) + "px",
      height: Math.max(1, value3.bottom - value3.top) + "px",
    });
    this.updateMultiSelectionHandleScale(value);
  }
  updateMultiSelectionHandleScale(element) {
    if (!element) {
      return;
    }
    const value = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const value2 = element.parentElement?.dataset?.componentId || null;
    const value3 = value2 ? this.componentWorldTransform(value2).scale : 1;
    const value4 = 1 / Math.max(0.001, value * value3);
    element.style.setProperty("--hb-ui-scale", String(value4));
    element.style.setProperty("--hb-handle-outset", value4 * 30 + "px");
    const value5 = element.getBoundingClientRect();
    element.classList.toggle(
      "handles-outside",
      value5.width < 132 || value5.height < 112,
    );
  }
  appendMultiSelectionBounds() {
    const value = this.selectedScaleRecords();
    if (!value.length) {
      return;
    }
    const value2 = this.scaleRecordsBounds(value);
    const value3 = document.createElement("div");
    value3.className = "hb-selection-bounds hb-multi-selection-bounds";
    Object.assign(value3.style, {
      left: value2.left + "px",
      top: value2.top + "px",
      width: Math.max(1, value2.right - value2.left) + "px",
      height: Math.max(1, value2.bottom - value2.top) + "px",
    });
    for (const value6 of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const value7 = document.createElement("i");
      value7.className = "hb-corner-marker hb-corner-" + value6;
      value7.setAttribute("aria-hidden", "true");
      value3.append(value7);
    }
    const value4 = document.createElement("button");
    value4.type = "button";
    value4.className = "hb-transform-handle hb-resize-handle";
    value4.title = "拖动整体缩放";
    value4.addEventListener("pointerdown", (value6) =>
      this.startComponentsScale(value6, value, value2, value3),
    );
    const value5 = document.createElement("button");
    value5.type = "button";
    value5.className = "hb-transform-handle hb-rotate-handle";
    value5.title = "拖动整体旋转";
    value5.addEventListener("pointerdown", (value6) =>
      this.startComponentsRotate(value6, value, value2, value3),
    );
    value3.append(value4, value5);
    (value[0]?.host?.parentElement || this.canvas).append(value3);
    this.updateMultiSelectionHandleScale(value3);
  }
  previewComponentsTransform(value, value2 = this.selectedComponentId) {
    for (const value3 of value || []) {
      const value4 = this.componentRecords.get(value3.componentId);
      const value5 = this.componentHosts.get(value3.componentId);
      if (!!value4 && !!value5) {
        value4.position = {
          ...(value4.position || {}),
          ...(Number.isFinite(value3.x)
            ? {
                x: value3.x,
              }
            : {}),
          ...(Number.isFinite(value3.y)
            ? {
                y: value3.y,
              }
            : {}),
        };
        if (Number.isFinite(value3.scale)) {
          value4.style = {
            ...(value4.style || {}),
            scale: value3.scale,
          };
        }
        if (Number.isFinite(value3.rotation)) {
          value4.position.rotation = value3.rotation;
        }
        if (Number.isFinite(value3.x)) {
          value5.style.left = value3.x + "px";
        }
        if (Number.isFinite(value3.y)) {
          value5.style.top = value3.y + "px";
        }
        if (Number.isFinite(value3.scale) || Number.isFinite(value3.rotation)) {
          value5.style.transform =
            "rotate(" +
            Number(value4.position?.rotation || 0) +
            "deg) scale(" +
            Number(value4.style?.scale || 1) +
            ")";
        }
      }
    }
    this.syncSelection();
    this.options.onComponentsTransformPreview?.(value, value2);
  }
  startComponentsScale(event, value, value2, element) {
    event.preventDefault();
    event.stopPropagation();
    const value3 = element.getBoundingClientRect();
    const value4 = value3.left + value3.width / 2;
    const value5 = value3.top + value3.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - value4, event.clientY - value5),
    );
    const value6 = (value2.left + value2.right) / 2;
    const value7 = (value2.top + value2.bottom) / 2;
    const value8 = value.map((value15) => {
      const value16 = value15.component.position || {};
      const width = Number(value16.width || 100);
      const height = Number(value16.height || 100);
      return {
        ...value15,
        width: width,
        height: height,
        centerX: Number(value16.x || 0) + width / 2,
        centerY: Number(value16.y || 0) + height / 2,
        scale: Math.max(
          0.01,
          Math.min(5, Number(value15.component.style?.scale || 1)),
        ),
      };
    });
    const count2 = Math.max(...value8.map((value15) => 0.01 / value15.scale));
    const value9 = Math.min(...value8.map((value15) => 5 / value15.scale));
    let value10 = 1;
    let value11 = [];
    let value12 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const value13 = (value15) => {
      if (value15.pointerId !== pointerId) {
        return;
      }
      const value16 = Math.hypot(
        value15.clientX - value4,
        value15.clientY - value5,
      );
      value10 = Math.max(count2, Math.min(value9, value16 / count));
      value11 = value8.map((value17) => {
        const value18 = value6 + (value17.centerX - value6) * value10;
        const value19 = value7 + (value17.centerY - value7) * value10;
        const scale = value17.scale * value10;
        const value20 = value18 - value17.width / 2;
        const value21 = value19 - value17.height / 2;
        value17.component.position = {
          ...(value17.component.position || {}),
          x: value20,
          y: value21,
        };
        value17.component.style = {
          ...(value17.component.style || {}),
          scale: scale,
        };
        value17.host.style.left = value20 + "px";
        value17.host.style.top = value21 + "px";
        value17.host.style.transform =
          "rotate(" +
          Number(value17.component.position?.rotation || 0) +
          "deg) scale(" +
          scale +
          ")";
        return {
          componentId: value17.component.id,
          x: value20,
          y: value21,
          scale: scale,
        };
      });
      Object.assign(element.style, {
        left: value6 + (value2.left - value6) * value10 + "px",
        top: value7 + (value2.top - value7) * value10 + "px",
        width: Math.max(1, (value2.right - value2.left) * value10) + "px",
        height: Math.max(1, (value2.bottom - value2.top) * value10) + "px",
      });
      this.updateMultiSelectionHandleScale(element);
      this.options.onComponentsTransformPreview?.(
        value11,
        this.selectedComponentId,
      );
    };
    const value14 = (value15 = null) => {
      if (
        !value12 &&
        (value15?.pointerId == null || value15.pointerId === pointerId)
      ) {
        value12 = true;
        window.removeEventListener("pointermove", value13, true);
        window.removeEventListener("pointerup", value14, true);
        window.removeEventListener("pointercancel", value14, true);
        window.removeEventListener("blur", value14);
        if (value10 !== 1 && value11.length) {
          this.options.onComponentsTransform?.(
            value11,
            this.selectedComponentId,
          );
        }
      }
    };
    window.addEventListener("pointermove", value13, true);
    window.addEventListener("pointerup", value14, true);
    window.addEventListener("pointercancel", value14, true);
    window.addEventListener("blur", value14);
  }
  startComponentsRotate(event, value, value2, element) {
    event.preventDefault();
    event.stopPropagation();
    const value3 = element.getBoundingClientRect();
    const value4 = value3.left + value3.width / 2;
    const value5 = value3.top + value3.height / 2;
    const value6 = (value2.left + value2.right) / 2;
    const value7 = (value2.top + value2.bottom) / 2;
    const value8 = value.map((value15) => {
      const value16 = value15.component.position || {};
      const width = Number(value16.width || 100);
      const height = Number(value16.height || 100);
      return {
        ...value15,
        componentId: value15.component.id,
        width: width,
        height: height,
        centerX: Number(value16.x || 0) + width / 2,
        centerY: Number(value16.y || 0) + height / 2,
        rotation: Number(value16.rotation || 0),
      };
    });
    let value9 = Math.atan2(event.clientY - value5, event.clientX - value4);
    let value10 = 0;
    let value11 = [];
    let value12 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const value13 = (value15) => {
      if (value15.pointerId !== pointerId) {
        return;
      }
      const value16 = Math.atan2(
        value15.clientY - value5,
        value15.clientX - value4,
      );
      let value17 = value16 - value9;
      if (value17 > Math.PI) {
        value17 -= Math.PI * 2;
      } else if (value17 < -Math.PI) {
        value17 += Math.PI * 2;
      }
      value10 += (value17 * 180) / Math.PI;
      value9 = value16;
      value11 = rotateMultiSelectionTransforms(value8, value6, value7, value10);
      for (const value18 of value11) {
        const value19 = value8.find(
          (value20) => value20.componentId === value18.componentId,
        );
        if (value19) {
          value19.component.position = {
            ...(value19.component.position || {}),
            x: value18.x,
            y: value18.y,
            rotation: value18.rotation,
          };
          value19.host.style.left = value18.x + "px";
          value19.host.style.top = value18.y + "px";
          value19.host.style.transform =
            "rotate(" +
            value18.rotation +
            "deg) scale(" +
            Number(value19.component.style?.scale || 1) +
            ")";
        }
      }
      element.style.transform = "rotate(" + value10 + "deg)";
      element.style.transformOrigin = "center center";
      this.options.onComponentsTransformPreview?.(
        value11,
        this.selectedComponentId,
      );
    };
    const value14 = (value15 = null) => {
      if (
        !value12 &&
        (value15?.pointerId == null || value15.pointerId === pointerId)
      ) {
        value12 = true;
        window.removeEventListener("pointermove", value13, true);
        window.removeEventListener("pointerup", value14, true);
        window.removeEventListener("pointercancel", value14, true);
        window.removeEventListener("blur", value14);
        if (value10 !== 0 && value11.length) {
          this.options.onComponentsTransform?.(
            value11,
            this.selectedComponentId,
          );
        }
      }
    };
    window.addEventListener("pointermove", value13, true);
    window.addEventListener("pointerup", value14, true);
    window.addEventListener("pointercancel", value14, true);
    window.addEventListener("blur", value14);
  }
  cleanupComponents(value = false) {
    for (const fn of this.cleanups.splice(0)) {
      fn();
    }
    for (const value2 of [...this.componentCleanups.keys()]) {
      this.cleanupRenderedComponent(value2);
    }
    if (!value) {
      for (const value2 of this.cameraCleanups.values()) {
        for (const fn of value2.splice(0)) {
          fn();
        }
      }
      this.cameraCleanups.clear();
    }
  }
  registerComponentCleanup(value, value2) {
    if (!!value && typeof value2 == "function") {
      if (!this.componentCleanups.has(value)) {
        this.componentCleanups.set(value, []);
      }
      this.componentCleanups.get(value).push(value2);
    }
  }
  cleanupRenderedComponent(value) {
    const value2 = this.componentCleanups.get(value) || [];
    this.componentCleanups.delete(value);
    for (const fn of value2.splice(0)) {
      fn();
    }
  }
  render(value = null) {
    const value2 =
      !!value?.size &&
      !!this.canvas?.isConnected &&
      !!this.viewport?.isConnected &&
      !![...value.values()].some(
        (value3) => value3.parentElement === this.canvas,
      );
    if (!value2) {
      this.cleanupComponents();
      this.container.replaceChildren();
    }
    this.container.dataset.uiPack = this.document?.uiPack?.id || "ui.base";
    this.container.dataset.uiTheme = this.document?.theme?.name || "";
    for (const value3 of this.themeVariableNames) {
      this.container.style.removeProperty(value3);
    }
    this.themeVariableNames.clear();
    for (const [value3, value4] of Object.entries(
      this.document?.theme?.variables || {},
    )) {
      const value5 = String(value3).startsWith("--")
        ? String(value3)
        : "--" + value3;
      if (/^--[a-zA-Z0-9_-]+$/.test(value5)) {
        this.container.style.setProperty(value5, String(value4));
        this.themeVariableNames.add(value5);
      }
    }
    if (!value2) {
      const value3 = document.createElement("div");
      value3.className =
        "hb-renderer-viewport" +
        (this.options.editable ? "" : " hb-runtime-no-select");
      const value4 = document.createElement("div");
      value4.className = "hb-renderer-canvas";
      value3.append(value4);
      this.container.append(value3);
      this.viewport = value3;
      this.canvas = value4;
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
    this.renderComponents(value2, value);
    this.resize();
  }
  renderComponents(value = false, value2 = null) {
    if (!this.canvas || !this.page) {
      return;
    }
    const index = new Map(
      (this.document.sharedComponents || []).map((value7) => [
        value7.id,
        value7,
      ]),
    );
    const value4 = (this.page.sharedComponentIds || [])
      .map((value7) => index.get(value7))
      .filter(Boolean);
    const allowed = new Set(
      collectComponents(
        [...(this.page.components || []), ...value4],
        () => true,
      ).map((value7) => value7.id),
    );
    this.states.set("virtual.icon_visibility.current", {
      entityId: "virtual.icon_visibility.current",
      state: this.iconVisibilityState() ? "on" : "off",
      attributes: {},
    });
    const index2 = new Map([
      ...(value
        ? [...this.componentHosts].filter(([value7]) =>
            ["camera", "vacuum-map", "floorplan-auto-diagram"].includes(
              this.componentRecords.get(value7)?.type,
            ),
          )
        : []),
      ...(value2 && typeof value2[Symbol.iterator] == "function" ? value2 : []),
    ]);
    const index3 = new Map(
      [
        ...this.canvas.querySelectorAll(
          ".hb-icon-button-effect-layer[data-effect-for]",
        ),
      ].map((value7) => [value7.dataset.effectFor, value7]),
    );
    this.cleanupComponents(value);
    const allowed2 = new Set(
      [...index2.values()].filter(
        (value7) =>
          value7.parentElement === this.canvas &&
          allowed.has(value7.dataset.componentId) &&
          value7.querySelector(".hb-floorplan-auto-diagram-preview"),
      ),
    );
    if (allowed2.size) {
      for (const value7 of [...this.canvas.children]) {
        if (!allowed2.has(value7)) {
          value7.remove();
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
    for (const value7 of this.page.components || []) {
      this.renderComponent(value7, this.canvas, 0, index2, index3);
    }
    for (const value7 of value4) {
      this.renderComponent(value7, this.canvas, 100000, index2, index3);
    }
    this.syncActiveGroup();
    this.syncSelection();
    this.runtimeEffectImageLoader.pruneDisconnected();
  }
  registerRuntimeStateHandler(value, value2, value3 = null) {
    const text = String(value || "");
    if (!text || typeof value2 != "function") {
      return;
    }
    if (!this.runtimeStateHandlers.has(text)) {
      this.runtimeStateHandlers.set(text, new Set());
    }
    this.runtimeStateHandlers.get(text).add(value2);
    const value4 = () => {
      const value5 = this.runtimeStateHandlers.get(text);
      value5?.delete(value2);
      if (value5?.size === 0) {
        this.runtimeStateHandlers.delete(text);
      }
    };
    if (value3) {
      this.registerComponentCleanup(value3, value4);
    } else {
      this.cleanups.push(value4);
    }
  }
  registerHistoryChartRefresher(value, value2 = null) {
    if (typeof value != "function") {
      return;
    }
    this.historyChartRefreshers.add(value);
    const value3 = () => this.historyChartRefreshers.delete(value);
    if (value2) {
      this.registerComponentCleanup(value2, value3);
    } else {
      this.cleanups.push(value3);
    }
  }
  applyRuntimeStateHandlers(value, value2) {
    for (const fn of this.runtimeStateHandlers.get(String(value || "")) || []) {
      fn(value2);
    }
  }
  runtimeEntityIdsForComponent(component) {
    const value = collectEntityIds([
      {
        ...component,
        children: [],
      },
    ]);
    const value2 = component?.bindings?.entity?.entityId || "";
    if (value2) {
      value.add(value2);
      const value3 = this.powerEntityId(component, value2);
      if (value3) {
        value.add(value3);
      }
      const value4 = this.deviceProfile(value2);
      for (const value5 of Object.values(value4?.roles || {})) {
        if (value5) {
          value.add(value5);
        }
      }
    }
    return [...value].map((value3) => String(value3 || "")).filter(Boolean);
  }
  indexRuntimeComponent(value) {
    for (const value2 of this.runtimeEntityIdsForComponent(value)) {
      if (!this.runtimeEntityComponentIndex.has(value2)) {
        this.runtimeEntityComponentIndex.set(value2, new Set());
      }
      this.runtimeEntityComponentIndex.get(value2).add(value.id);
    }
  }
  unindexRuntimeComponent(value) {
    for (const [value2, value3] of this.runtimeEntityComponentIndex) {
      value3.delete(value);
      if (!value3.size) {
        this.runtimeEntityComponentIndex.delete(value2);
      }
    }
  }
  runtimeComponentContent(value) {
    return (
      [...(value?.children || [])].find(
        (element) =>
          !element.classList.contains("hb-component") &&
          !element.classList.contains("hb-runtime-action-hitbox") &&
          !element.classList.contains("hb-selection-bounds") &&
          !element.classList.contains("hb-transform-handle"),
      ) || null
    );
  }
  refreshRuntimeComponent(value) {
    const value2 = this.componentRecords.get(value);
    const value3 = this.componentHosts.get(value);
    if (!value2 || !value3 || !value3.isConnected) {
      return;
    }
    this.cleanupRenderedComponent(value);
    const value4 = {
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
      previewState: this.componentPreviewStates.get(value) || "auto",
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
          value,
        ),
      invalidate: () => this.refreshRuntimeComponent(value),
      cleanup: (cleanup) => this.registerComponentCleanup(value, cleanup),
    };
    const value5 = renderRegisteredComponent(
      this.runtimePowerComponent(value2),
      value4,
    );
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      value5.style.width = 100 / numeric + "%";
      value5.style.height = 100 / numeric + "%";
      value5.style.transform = "scale(" + numeric + ")";
      value5.style.transformOrigin = "top left";
    }
    const value6 = this.runtimeComponentContent(value3);
    if (value6) {
      value6.replaceWith(value5);
    } else {
      value3.prepend(value5);
    }
    if (value2.type === "title-button" || value2.type === "light-statistics") {
      const element = value3.querySelector(
        ":scope > .hb-runtime-action-hitbox",
      );
      if (element) {
        const value7 =
          value2.type === "light-statistics"
            ? this.updateLightStatisticsSelectionBounds(value3, value2, element)
            : this.updateTitleButtonSelectionBounds(value3, value2, element);
        element.hidden = !value7;
      }
    }
    if (value2.type === "light-statistics") {
      const value7 =
        this.componentSelectionOverlays
          .get(value)
          ?.querySelector(":scope > .hb-selection-bounds") ||
        value3.querySelector(":scope > .hb-selection-bounds");
      if (value7) {
        if (
          !this.updateLightStatisticsSelectionBounds(value3, value2, value7)
        ) {
          Object.assign(value7.style, {
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
          });
        }
        this.updateTransformHandleScale(value3, value2, value7);
      }
      this.refreshMultiSelectionBounds();
    }
  }
  refreshEditorComponent(value) {
    if (!this.options.editable) {
      return false;
    }
    const component = this.componentRecords.get(value);
    const element = this.componentHosts.get(value);
    if (!component || !element?.isConnected || component.type === "group") {
      return false;
    }
    const parentElement = element.parentElement;
    if (!parentElement) {
      return false;
    }
    if (component.type === "floorplan-auto-diagram") {
      const value3 =
        component.properties?.previewReady === true &&
        (component.properties?.generated !== true ||
          component.properties?.previewing === true);
      const hbFloorplanAutoDiagramPreview = element.querySelector(
        ".hb-floorplan-auto-diagram-preview",
      );
      if (!!hbFloorplanAutoDiagramPreview === value3) {
        const value4 = component.position || {};
        const value5 =
          parentElement === this.canvas &&
          component.properties?.layoutMode === "fill";
        const value6 = value5
          ? {
              ...value4,
              x: 0,
              y: 0,
              width: Number(this.document.canvas?.width || 2778),
              height: Number(this.document.canvas?.height || 1940),
              rotation: 0,
            }
          : value4;
        const count = Math.max(
          0.01,
          Math.min(5, Number(component.style?.scale || 1)),
        );
        const numeric = Number(value6.zIndex || 1);
        const value7 = componentHostZIndex(
          component,
          numeric,
          parentElement === this.canvas,
        );
        Object.assign(element.style, {
          left: (value6.x || 0) + "px",
          top: (value6.y || 0) + "px",
          width: (value6.width || 100) + "px",
          height: (value6.height || 100) + "px",
          zIndex: String(value7),
          transform:
            "rotate(" +
            (value6.rotation || 0) +
            "deg) scale(" +
            (value5 ? 1 : count) +
            ")",
        });
        element.style.setProperty("--hb-component-z", String(value7));
        element.classList.toggle("layout-fill", value5);
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(
          ".hb-floorplan-auto-diagram-preview-hint",
        );
        const value8 = component.properties?.interactionMode === "view";
        hbFloorplanAutoDiagramPreview?.classList.toggle("is-view-mode", value8);
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-position-mode",
          !value8,
        );
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = value8
            ? "拖动旋转 · 右键平移 · 滚轮缩放"
            : "拖动控件调整位置，右下角调整大小";
        }
        this.syncSelection();
        this.updateTransformHandleScale(element, component);
        return true;
      }
    }
    const nextSibling = element.nextSibling;
    this.cleanupRenderedComponent(value);
    for (const fn of this.cameraCleanups.get(value)?.splice(0) || []) {
      fn();
    }
    this.cameraCleanups.delete(value);
    this.componentEffectLayers.get(value)?.remove();
    this.componentEffectLayers.delete(value);
    this.componentAirflowLayers.get(value)?.remove();
    this.componentAirflowLayers.delete(value);
    element.remove();
    this.renderComponent(component, parentElement);
    const value2 = this.componentHosts.get(value);
    if (value2 && nextSibling?.parentElement === parentElement) {
      parentElement.insertBefore(value2, nextSibling);
    }
    this.syncSelection();
    return true;
  }
  refreshRuntimeComponents(value) {
    const allowed = new Set();
    for (const value2 of value || []) {
      for (const value3 of this.runtimeEntityComponentIndex.get(
        String(value2 || ""),
      ) || []) {
        allowed.add(value3);
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
      [...allowed].filter((value2) =>
        allowed2.has(this.componentRecords.get(value2)?.type),
      ),
    );
    if (allowed3.size) {
      this.updateOptimisticToggleVisuals("", allowed3);
    }
    for (const value2 of allowed) {
      const value3 = this.componentRecords.get(value2);
      if (
        !!value3 &&
        !allowed2.has(value3.type) &&
        !["line-chart", "camera", "vacuum-map"].includes(value3.type)
      ) {
        this.refreshRuntimeComponent(value2);
      }
    }
  }
  applyEditorComponentUpdates(value, value2, value3 = []) {
    if (
      !this.options.editable ||
      !this.document ||
      !Array.isArray(value3) ||
      !value3.length
    ) {
      return false;
    }
    const value4 = value3
      .map((value5) => ({
        componentId: String(value5?.componentId || ""),
        component: value5?.component,
      }))
      .filter((value5) => value5.componentId && value5.component);
    if (
      !value4.length ||
      value4.length !== value3.length ||
      value4.some(({ componentId: value5, component: value6 }) => {
        const value7 = this.componentRecords.get(value5);
        return (
          !value7 || value7.type === "group" || value7.type !== value6.type
        );
      })
    ) {
      return false;
    }
    const allowed = new Set();
    for (const { componentId: value5 } of value4) {
      const value6 = this.componentRecords.get(value5);
      for (const value7 of this.runtimeEntityIdsForComponent(value6)) {
        allowed.add(value7);
      }
    }
    this.document = value;
    this.page =
      this.document.pages?.find((value5) => value5.path === value2) ||
      this.document.pages?.find(
        (value5) => value5.path === this.document.defaultPagePath,
      ) ||
      this.document.pages?.[0] ||
      null;
    for (const { componentId: value5, component: value6 } of value4) {
      const value7 = this.componentRecords.get(value5);
      this.unindexRuntimeComponent(value5);
      for (const value8 of Object.keys(value7)) {
        delete value7[value8];
      }
      Object.assign(value7, structuredClone(value6));
      this.indexRuntimeComponent(value7);
    }
    for (const { componentId: value5 } of value4) {
      this.refreshEditorComponent(value5);
    }
    this.syncSelection();
    const allowed2 = new Set();
    for (const { componentId: value5 } of value4) {
      for (const value6 of this.runtimeEntityIdsForComponent(
        this.componentRecords.get(value5),
      )) {
        allowed2.add(value6);
      }
    }
    if (
      allowed.size !== allowed2.size ||
      [...allowed].some((value5) => !allowed2.has(value5))
    ) {
      this.connectRuntime();
    }
    return true;
  }
  scheduleRuntimeRender(value, value2 = 120) {
    if (!this.destroyed && !!this.document && !!value) {
      this.runtimeRenderEntityIds.add(String(value));
      window.clearTimeout(this.runtimeRenderTimer);
      this.runtimeRenderTimer = window.setTimeout(
        () => {
          this.runtimeRenderTimer = 0;
          const value3 = [...this.runtimeRenderEntityIds];
          this.runtimeRenderEntityIds.clear();
          if (!this.destroyed) {
            this.refreshRuntimeComponents(value3);
          }
        },
        Math.max(0, Number(value2) || 0),
      );
    }
  }
  setEffectLayerActive(element, value, value2 = 0) {
    if (!element) {
      return;
    }
    if (value) {
      this.runtimeEffectImageLoader.promote(
        element.querySelector(":scope > img[data-effect-source]"),
      );
    }
    const value3 = element.classList.contains("active") !== value;
    window.clearTimeout(element.hbTransitionTimer);
    element.classList.remove("is-transitioning");
    if (value3 && value2 > 0) {
      element.classList.add("is-transitioning");
      element.offsetWidth;
    }
    element.classList.toggle("active", value);
    if (value3 && value2 > 0) {
      element.hbTransitionTimer = window.setTimeout(
        () => {
          element.classList.remove("is-transitioning");
          element.hbTransitionTimer = null;
        },
        value2 * 1000 + 80,
      );
    }
  }
  syncEffectLayerLightVisual(component, element) {
    if (!element || component?.type !== "icon-button-effect") {
      return;
    }
    const value = component.properties || {};
    const text = String(component?.bindings?.entity?.entityId || "");
    element.classList.toggle(
      "awaiting-light-visual",
      iconButtonEffectLightVisualAwaiting(component, {
        editable: this.options.editable,
        states: this.states,
        pendingOptimisticState: this.pendingOptimisticStates.get(text),
      }),
    );
    const value2 = iconButtonEffectLightVisualState(component, {
      states: this.states,
    });
    const numeric = Number(value.effectOpacity ?? 1);
    const value3 = Number.isFinite(numeric)
      ? Math.max(0, Math.min(1, numeric))
      : 1;
    element.style.setProperty(
      "--hb-effect-image-opacity",
      String(value3 * value2.opacity),
    );
    const element2 = element.querySelector(":scope > img");
    if (element2) {
      element2.style.filter = value2.filter;
    }
  }
  cachedLightVisualState(value) {
    const entityId = String(value || "");
    if (!entityId.startsWith("light.")) {
      return null;
    }
    const value2 = this.confirmedLightVisualStates.get(entityId);
    if (value2) {
      return value2;
    }
    try {
      const value3 = JSON.parse(
        window.localStorage?.getItem("ha-bridge:light-visual:" + entityId) ||
          "null",
      );
      if (
        !value3?.attributes ||
        Date.now() - Number(value3.at || 0) > 2592000000
      ) {
        return null;
      }
      const value4 = {
        entityId: entityId,
        state: "on",
        attributes: value3.attributes,
      };
      this.confirmedLightVisualStates.set(entityId, value4);
      return value4;
    } catch {
      return null;
    }
  }
  rememberLightVisualState(value, value2) {
    const entityId = String(value || "");
    const value3 = value2?.newState || value2;
    if (!entityId.startsWith("light.") || !value3?.attributes) {
      return;
    }
    const attributes = value3.attributes;
    const fn = (value5) =>
      attributes[value5] !== null &&
      attributes[value5] !== undefined &&
      attributes[value5] !== "" &&
      Number.isFinite(Number(attributes[value5]));
    if (!fn("brightness") && !fn("color_temp_kelvin") && !fn("color_temp")) {
      return;
    }
    const attributes2 = {
      ...(this.cachedLightVisualState(entityId)?.attributes || {}),
    };
    for (const value5 of [
      "brightness",
      "color_temp_kelvin",
      "color_temp",
      "color_mode",
      "supported_color_modes",
    ]) {
      if (
        attributes[value5] !== null &&
        attributes[value5] !== undefined &&
        attributes[value5] !== ""
      ) {
        attributes2[value5] = Array.isArray(attributes[value5])
          ? [...attributes[value5]]
          : attributes[value5];
      }
    }
    const value4 = {
      entityId: entityId,
      state: "on",
      attributes: attributes2,
    };
    this.confirmedLightVisualStates.set(entityId, value4);
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
  optimisticStateIsConfirmed(value, value2) {
    const value3 = this.pendingOptimisticStates.get(String(value || ""));
    if (!value3) {
      return true;
    }
    if (Date.now() >= value3.expiresAt) {
      this.pendingOptimisticStates.delete(String(value || ""));
      return true;
    }
    const value4 = [...this.componentRecords.values()].find((component) => {
      const entityId = component.bindings?.entity?.entityId;
      return (
        entityId && this.powerEntityId(component, entityId) === String(value)
      );
    });
    if (
      entityPowerIsOn(
        String(value || ""),
        value2?.newState || value2,
        value4 || {},
      ) === value3.desiredActive
    ) {
      if (
        value3.desiredActive === true &&
        value4?.type === "icon-button-effect" &&
        iconButtonEffectLightVisualAwaiting(value4, {
          states: new Map([[String(value || ""), value2?.newState || value2]]),
        })
      ) {
        return false;
      } else {
        this.rememberLightVisualState?.(value, value2);
        this.pendingOptimisticStates.delete(String(value || ""));
        return true;
      }
    } else {
      return false;
    }
  }
  updateOptimisticToggleVisuals(value, value2 = null) {
    for (const [value3, component] of this.componentRecords) {
      const entityId = component.bindings?.entity?.entityId;
      const value4 = entityId ? this.powerEntityId(component, entityId) : "";
      if (
        !entityId ||
        (value2 ? !value2.has(value3) : value4 !== value) ||
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
      const value5 = this.states.get(value4);
      const value6 = String(value4 || "").startsWith("cover.");
      const value7 =
        value6 &&
        coverComponentIsDream(component, value4, value5, this.entityMetadata);
      const value8 = this.runtimePowerComponent(component, entityId);
      const value9 = value6
        ? value7
          ? runtimeEntityStateIsActive(value5)
          : runtimeCoverStateIsActive(value5)
        : entityPowerIsOn(value4, value5, value8);
      const value10 = this.componentPreviewStates.get(value3) || "auto";
      const value11 =
        value10 === "on"
          ? true
          : value10 === "off"
            ? false
            : value6 &&
                coverMotorIsReversedForComponent(
                  component,
                  this.entityMetadata,
                  this.states,
                  value4,
                )
              ? !value9
              : value9;
      const value12 = this.componentHosts.get(value3);
      this.cleanupRenderedComponent(value3);
      if (value12 && component.type === "icon-button-effect") {
        const element = value12.querySelector(
          ":scope > .hb-icon-button-effect",
        );
        const value14 = {
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
          previewState: this.componentPreviewStates.get(value3) || "auto",
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([value3])),
          cleanup: (cleanup) => this.registerComponentCleanup(value3, cleanup),
        };
        const value15 = renderRegisteredComponent(value8, value14);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          value15.style.width = 100 / numeric + "%";
          value15.style.height = 100 / numeric + "%";
          value15.style.transform = "scale(" + numeric + ")";
          value15.style.transformOrigin = "top left";
        }
        if (element) {
          element.replaceWith(value15);
        } else {
          value12.prepend(value15);
        }
      }
      if (
        value12 &&
        ["icon-button", "device-button", "navigation-button"].includes(
          component.type,
        )
      ) {
        const value14 =
          component.type === "navigation-button"
            ? value12.querySelector(":scope > .hb-navigation-button")
            : value12.querySelector(":scope > .hb-icon-button");
        const value15 = {
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
          previewState: this.componentPreviewStates.get(value3) || "auto",
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([value3])),
          cleanup: (cleanup) => this.registerComponentCleanup(value3, cleanup),
        };
        const value16 = renderRegisteredComponent(value8, value15);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          value16.style.width = 100 / numeric + "%";
          value16.style.height = 100 / numeric + "%";
          value16.style.transform = "scale(" + numeric + ")";
          value16.style.transformOrigin = "top left";
        }
        if (value14) {
          value14.replaceWith(value16);
        } else {
          value12.prepend(value16);
        }
        if (component.type === "device-button") {
          const element = value12.querySelector(
            ":scope > .hb-runtime-action-hitbox",
          );
          if (element) {
            element.hidden = !this.updateDeviceButtonSelectionBounds(
              value12,
              component,
              element,
            );
          }
        }
      }
      if (value12 && component.type === "air-conditioner") {
        const value14 = {
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
          previewState: this.componentPreviewStates.get(value3) || "auto",
          isIconVisible: (isIconVisible) =>
            this.iconVisibilityState(isIconVisible),
          navigate: (navigate) => this.navigate(navigate),
          invalidate: () =>
            this.updateOptimisticToggleVisuals("", new Set([value3])),
          cleanup: (cleanup) => this.registerComponentCleanup(value3, cleanup),
        };
        const element = value12.querySelector(":scope > .hb-air-conditioner");
        const value15 = renderRegisteredComponent(value8, value14);
        const numeric = Number(this.document.canvas.componentScale || 1);
        if (numeric !== 1) {
          value15.style.width = 100 / numeric + "%";
          value15.style.height = 100 / numeric + "%";
          value15.style.transform = "scale(" + numeric + ")";
          value15.style.transformOrigin = "top left";
        }
        if (element) {
          element.replaceWith(value15);
        } else {
          value12.prepend(value15);
        }
        this.componentAirflowLayers.get(value3)?.remove();
        this.componentAirflowLayers.delete(value3);
        const value16 = renderAirConditionerAirflowLayer(value8, value14);
        if (value16) {
          const grouped = value12.parentElement !== this.canvas;
          const value17 = airflowLayerGeometry(component, {
            grouped: grouped,
          });
          const numeric2 = Number(
            value12.style.getPropertyValue("--hb-component-z") ||
              component.position?.zIndex ||
              1,
          );
          value16.dataset.airflowFor = value3;
          value16.hidden = component.style?.visible === false;
          Object.assign(value16.style, {
            left: value17.left + "px",
            top: value17.top + "px",
            width: value17.width + "px",
            height: value17.height + "px",
            zIndex: String(numeric2),
            transform:
              "rotate(" +
              value17.rotation +
              "deg) scale(" +
              value17.scale +
              ")",
          });
          if (grouped) {
            value12.append(value16);
          } else {
            this.canvas.insertBefore(value16, value12);
          }
          this.componentAirflowLayers.set(value3, value16);
          if (
            this.options.editable &&
            this.selectedComponentIds.size === 1 &&
            this.selectedComponentId === value3 &&
            this.componentSelectionLayers.get(value3) === "airflow"
          ) {
            this.syncSelection();
          }
        }
      }
      if (component.type !== "icon-button-effect") {
        continue;
      }
      const value13 = this.componentEffectLayers.get(value3);
      this.syncEffectLayerLightVisual(component, value13);
      this.setEffectLayerActive(
        value13,
        value11,
        effectFadeDuration(component),
      );
    }
  }
  refreshVacuumMapEntity(value) {
    if (
      this.options.liveMedia === false ||
      !String(value || "").startsWith("image.")
    ) {
      return;
    }
    const value2 = this.states.get(value);
    const value3 = vacuumMapImageSource(value, value2);
    let value4 = false;
    for (const [value5, component] of this.componentRecords) {
      if (
        component.type !== "vacuum-map" ||
        component.bindings?.entity?.entityId !== value
      ) {
        continue;
      }
      const value6 = this.componentHosts
        .get(value5)
        ?.querySelector(".hb-vacuum-map-image");
      if (value6) {
        value4 = true;
        if (value6.dataset.vacuumMapSource !== value3) {
          value6.dataset.vacuumMapSource = value3;
        }
        if (
          value6.dataset.vacuumMapSuspended !== "true" &&
          value6.getAttribute("src") !== value3
        ) {
          value6.src = value3;
        }
      }
    }
    if (
      !value4 &&
      this.options.liveMedia !== false &&
      this.vacuumMapEntityIds.has(value)
    ) {
      this.runtimeVacuumMapImagePreloader.enqueue(value3);
    }
  }
  applyOptimisticToggle(value, value2 = null) {
    const value3 = value;
    const entityId = this.powerEntityId(value2, value3);
    const value4 = this.states.get(entityId);
    const value5 = value4?.newState ||
      value4 || {
        entityId: entityId,
        attributes: {},
      };
    const value6 = String(entityId || "").startsWith("cover.");
    const value7 =
      value6 &&
      coverComponentIsDream(value2, entityId, value4, this.entityMetadata);
    const value8 = this.runtimePowerComponent(value2, value3);
    const desiredActive = !(value6
      ? value7
        ? runtimeEntityStateIsActive(value4)
        : runtimeCoverStateIsActive(value4)
      : entityPowerIsOn(entityId, value4, value8));
    const newState = value6
      ? {
          ...value5,
          state: desiredActive ? "open" : "closed",
          ...(value7
            ? {}
            : {
                attributes: {
                  ...(value5.attributes || {}),
                  current_position: desiredActive ? 100 : 0,
                },
              }),
        }
      : optimisticToggleState(entityId, value5, value8);
    if (desiredActive && String(entityId || "").startsWith("light.")) {
      const value12 = this.cachedLightVisualState(entityId);
      if (value12?.attributes) {
        newState.attributes = {
          ...(newState.attributes || {}),
          ...value12.attributes,
        };
      }
    }
    const value9 = value4?.newState
      ? {
          ...value4,
          newState: newState,
        }
      : newState;
    const text = String(entityId || "");
    const value10 = {
      desiredActive: desiredActive,
      expiresAt: Date.now() + 8000,
    };
    this.pendingOptimisticStates.set(text, value10);
    const value11 = window.setTimeout(() => {
      if (this.pendingOptimisticStates.get(text) === value10) {
        this.pendingOptimisticStates.delete(text);
        if (this.states.get(entityId) === value9) {
          if (value4 === undefined) {
            this.states.delete(entityId);
          } else {
            this.states.set(entityId, value4);
          }
          this.updateOptimisticToggleVisuals(entityId);
        }
      }
    }, 8000);
    this.states.set(entityId, value9);
    this.updateOptimisticToggleVisuals(entityId);
    return () => {
      window.clearTimeout(value11);
      if (this.pendingOptimisticStates.get(text) === value10) {
        this.pendingOptimisticStates.delete(text);
      }
      if (this.states.get(entityId) === value9) {
        if (value4 === undefined) {
          this.states.delete(entityId);
        } else {
          this.states.set(entityId, value4);
        }
        this.updateOptimisticToggleVisuals(entityId);
      }
    };
  }
  renderComponent(
    component,
    value = this.canvas,
    value2 = 0,
    value3 = null,
    value4 = null,
  ) {
    const iconButtonEffectComponent =
      normalizeIconButtonEffectComponent(component);
    const component2 = this.runtimePowerComponent(iconButtonEffectComponent);
    const element = ["camera", "vacuum-map", "floorplan-auto-diagram"].includes(
      component.type,
    )
      ? value3?.get(component.id)
      : null;
    if (element) {
      const value13 = component.position || {};
      const value14 =
        value === this.canvas &&
        component.type === "floorplan-auto-diagram" &&
        component.properties?.layoutMode === "fill";
      const value15 = value14
        ? {
            ...value13,
            x: 0,
            y: 0,
            width: Number(this.document.canvas?.width || 2778),
            height: Number(this.document.canvas?.height || 1940),
            rotation: 0,
          }
        : value13;
      const count2 = Math.max(
        0.01,
        Math.min(5, Number(component.style?.scale || 1)),
      );
      const value16 = value2 + Number(value15.zIndex || 1);
      Object.assign(element.style, {
        left: (value15.x || 0) + "px",
        top: (value15.y || 0) + "px",
        width: (value15.width || 100) + "px",
        height: (value15.height || 100) + "px",
        zIndex: String(value16),
        transform:
          "rotate(" +
          (value15.rotation || 0) +
          "deg) scale(" +
          (value14 ? 1 : count2) +
          ")",
      });
      element.style.setProperty("--hb-component-z", String(value16));
      element.hidden = component.style?.visible === false;
      element.classList.toggle("layout-fill", value14);
      if (component.type === "floorplan-auto-diagram") {
        const value17 = component.properties?.interactionMode === "view";
        const hbFloorplanAutoDiagramPreview = element.querySelector(
          ".hb-floorplan-auto-diagram-preview",
        );
        const hbFloorplanAutoDiagramPreviewHint = element.querySelector(
          ".hb-floorplan-auto-diagram-preview-hint",
        );
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-view-mode",
          value17,
        );
        hbFloorplanAutoDiagramPreview?.classList.toggle(
          "is-position-mode",
          !value17,
        );
        if (hbFloorplanAutoDiagramPreviewHint) {
          hbFloorplanAutoDiagramPreviewHint.textContent = value17
            ? "拖动旋转 · 右键平移 · 滚轮缩放"
            : "拖动控件调整位置，右下角调整大小";
        }
      }
      this.componentHosts.set(component.id, element);
      this.componentRecords.set(component.id, component);
      const componentId2 = value?.dataset?.componentId;
      if (componentId2) {
        this.componentParentIds.set(component.id, componentId2);
      }
      this.indexRuntimeComponent(component);
      if (element.parentElement !== value) {
        value.append(element);
      }
      return;
    }
    const element2 = document.createElement("div");
    element2.className =
      "hb-component hb-component-" +
      component.type.replace(/[^a-z0-9_-]/gi, "-");
    element2.dataset.componentId = component.id;
    const value6 = component.position || {};
    const value7 =
      value === this.canvas &&
      ["image", "floorplan-auto-diagram"].includes(component.type) &&
      component.properties?.layoutMode === "fill";
    const value8 = value7
      ? {
          ...value6,
          x: 0,
          y: 0,
          width: Number(this.document.canvas?.width || 2778),
          height: Number(this.document.canvas?.height || 1940),
          rotation: 0,
        }
      : value6;
    const count = Math.max(
      0.01,
      Math.min(5, Number(component.style?.scale || 1)),
    );
    const value9 = value2 + Number(value8.zIndex || 1);
    const value10 = componentHostZIndex(
      component,
      value9,
      value === this.canvas,
    );
    Object.assign(element2.style, {
      left: (value8.x || 0) + "px",
      top: (value8.y || 0) + "px",
      width: (value8.width || 100) + "px",
      height: (value8.height || 100) + "px",
      zIndex: String(value10),
      transform:
        "rotate(" +
        (value8.rotation || 0) +
        "deg) scale(" +
        (value7 ? 1 : count) +
        ")",
    });
    element2.style.setProperty("--hb-component-z", String(value10));
    element2.hidden = component.style?.visible === false;
    if (
      component.type === "icon-button-effect" &&
      component.properties?.buttonVisible === false &&
      component.properties?.hiddenContentClickable !== true &&
      !this.options.editable
    ) {
      element2.style.pointerEvents = "none";
    }
    element2.classList.toggle("layout-fill", value7);
    this.componentHosts.set(component.id, element2);
    this.componentRecords.set(component.id, component);
    const componentId = value?.dataset?.componentId;
    if (componentId) {
      this.componentParentIds.set(component.id, componentId);
    }
    this.indexRuntimeComponent(component);
    const value11 = {
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
      const element4 = renderIconButtonEffectLayer(component2, value11);
      if (element4) {
        const value13 = value4?.get(component.id) || null;
        const element5 = value13 || element4;
        const element6 = element4.querySelector("img");
        const element7 = element5.querySelector("img");
        const active = element4.classList.contains("active");
        if (value13 && element7 && element6) {
          element5.classList.toggle(
            "awaiting-light-visual",
            element4.classList.contains("awaiting-light-visual"),
          );
          const value18 = element6.dataset.effectSource || "";
          if (value18) {
            element7.dataset.effectSource = value18;
          } else {
            delete element7.dataset.effectSource;
            const value19 = element6.getAttribute("src");
            if (value19) {
              element7.src = value19;
            }
          }
          element7.alt = element6.alt;
          element7.draggable = false;
          element7.decoding = "async";
          element7.style.objectFit = element6.style.objectFit;
          element7.style.mixBlendMode = element6.style.mixBlendMode;
          for (const value19 of [
            "effectOriginalWidth",
            "effectOriginalHeight",
            "effectCropX",
            "effectCropY",
            "effectCropWidth",
            "effectCropHeight",
          ]) {
            if (element6.dataset[value19] !== undefined) {
              element7.dataset[value19] = element6.dataset[value19];
            } else {
              delete element7.dataset[value19];
            }
          }
        }
        const value14 = component2.properties || {};
        const numeric2 = Number(this.document.canvas?.width || 2778);
        const numeric3 = Number(this.document.canvas?.height || 1940);
        const value15 = value14.effectLayoutMode === "fill";
        const value16 = value !== this.canvas;
        element5.dataset.effectFor = component.id;
        element5.hidden = component.style?.visible === false;
        const fn = () => {
          const value18 = effectSourceDimensions(
            value14,
            element7,
            numeric2,
            numeric3,
          );
          const value19 = effectCropRectangle(element7, value18);
          const value20 =
            !value15 && !value18.pendingNaturalSize
              ? effectReferenceImageTransform(
                  this.page,
                  component,
                  value18.width,
                  value18.height,
                  numeric2,
                  numeric3,
                )
              : null;
          const count2 = Math.max(
            0.01,
            Math.min(5, Number(value14.effectScale || 1)),
          );
          const scale = value15
            ? Math.min(numeric2 / value18.width, numeric3 / value18.height)
            : (value20?.scale || 1) * count2;
          const rotation = value15 ? 0 : Number(value14.effectRotation || 0);
          const value21 = Number(value14.effectLeft ?? 50) / 100;
          const value22 = Number(value14.effectTop ?? 50) / 100;
          const centerX = value15 ? numeric2 / 2 : numeric2 * value21;
          const centerY = value15 ? numeric3 / 2 : numeric3 * value22;
          const value23 = effectCroppedLayerGeometry({
            centerX: centerX,
            centerY: centerY,
            originalWidth: value18.width,
            originalHeight: value18.height,
            cropX: value19.x,
            cropY: value19.y,
            cropWidth: value19.width,
            cropHeight: value19.height,
            scale: scale,
            rotation: rotation,
          });
          let value24 = value23;
          if (value16) {
            const value25 = value23.left + value23.width / 2;
            const value26 = value23.top + value23.height / 2;
            const componentId2 = value?.dataset?.componentId;
            const value27 = componentId2
              ? this.worldPointToComponentLocal(componentId2, value25, value26)
              : {
                  x: value25,
                  y: value26,
                };
            const value28 = componentId2
              ? this.componentWorldTransform(componentId2)
              : {
                  scale: 1,
                  rotation: 0,
                };
            value24 = {
              ...value23,
              left: value27.x - value23.width / 2,
              top: value27.y - value23.height / 2,
              scale: value23.scale / Math.max(0.0001, value28.scale),
              rotation: value23.rotation - value28.rotation,
            };
          }
          Object.assign(element5.style, {
            left: value24.left + "px",
            top: value24.top + "px",
            width: value23.width + "px",
            height: value23.height + "px",
            visibility: value18.pendingNaturalSize ? "hidden" : "",
            zIndex: String(value16 ? value9 - 0.1 : value9),
            transform:
              "rotate(" +
              value24.rotation +
              "deg) scale(" +
              value24.scale +
              ")",
          });
          return value18;
        };
        if (fn().pendingNaturalSize && element7) {
          element7.addEventListener(
            "load",
            () => {
              if (element5.isConnected) {
                fn();
              }
            },
            {
              once: true,
            },
          );
        }
        (value16 ? value : value15 ? this.canvas : value).append(element5);
        this.componentEffectLayers.set(component.id, element5);
        const value17 = element7?.dataset.effectSource || "";
        if (value17) {
          this.runtimeEffectImageLoader.enqueue(element7, value17, {
            active: active,
          });
        }
        if (value13) {
          const value18 = element6?.style.filter || "none";
          const value19 = element4.style.getPropertyValue(
            "--hb-effect-image-opacity",
          );
          const value20 = element4.style.getPropertyValue(
            "--hb-effect-fade-duration",
          );
          const value21 = element4.style.getPropertyValue(
            "--hb-effect-visual-transition-duration",
          );
          const opacity = element4.style.opacity;
          const transition = element4.style.transition;
          element7?.offsetWidth;
          if (element7) {
            element7.style.filter = value18;
          }
          element5.style.opacity = opacity;
          element5.style.transition = transition;
          element5.style.setProperty("--hb-effect-image-opacity", value19);
          element5.style.setProperty("--hb-effect-fade-duration", value20);
          element5.style.setProperty(
            "--hb-effect-visual-transition-duration",
            value21,
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
      const value13 = renderAirConditionerAirflowLayer(component2, value11);
      if (value13) {
        value13.dataset.airflowFor = component.id;
        value13.hidden = component.style?.visible === false;
        const grouped = value !== this.canvas;
        const value14 = airflowLayerGeometry(component, {
          grouped: grouped,
        });
        Object.assign(value13.style, {
          left: value14.left + "px",
          top: value14.top + "px",
          width: value14.width + "px",
          height: value14.height + "px",
          zIndex: String(value9),
          transform:
            "rotate(" + value14.rotation + "deg) scale(" + value14.scale + ")",
        });
        (grouped ? element2 : value).append(value13);
        this.componentAirflowLayers.set(component.id, value13);
      }
    }
    const value12 =
      component.type === "group"
        ? (() => {
            const value13 = document.createElement("div");
            value13.className = "hb-group-container";
            return value13;
          })()
        : renderRegisteredComponent(component2, value11);
    const numeric = Number(this.document.canvas.componentScale || 1);
    if (numeric !== 1) {
      value12.style.width = 100 / numeric + "%";
      value12.style.height = 100 / numeric + "%";
      value12.style.transform = "scale(" + numeric + ")";
      value12.style.transformOrigin = "top left";
    }
    element2.append(value12);
    if (component.type === "line-chart") {
      let element4 = value12;
      const fn = () => {
        if (!element4?.isConnected) {
          return;
        }
        const value13 = renderRegisteredComponent(component2, value11);
        if (numeric !== 1) {
          value13.style.width = 100 / numeric + "%";
          value13.style.height = 100 / numeric + "%";
          value13.style.transform = "scale(" + numeric + ")";
          value13.style.transformOrigin = "top left";
        }
        element4.cleanupLineChartHover?.();
        element4.replaceWith(value13);
        element4 = value13;
      };
      this.registerRuntimeStateHandler(
        component.bindings?.entity?.entityId,
        (value13) => {
          element4.syncLineChartState?.(value13);
          if (element4.classList.contains("history-loading")) {
            fn();
          }
        },
        component.id,
      );
      this.registerHistoryChartRefresher(fn, component.id);
    }
    if (this.options.editable) {
      element2.classList.add("editable");
      element2.addEventListener("pointerdown", (value13) =>
        this.startComponentMove(value13, component, element2),
      );
    } else {
      const value13 = Object.prototype.hasOwnProperty.call(
        component.actions || {},
        "tap",
      );
      const value14 =
        component.type === "camera" &&
        component.bindings?.entity?.entityId &&
        !value13
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
        Object.values(value14.actions || {}).some((value15) =>
          De(value14, value15),
        )
      ) {
        element2.classList.add("interactive");
        let value15 = element2;
        if (
          ["title-button", "device-button", "light-statistics"].includes(
            component.type,
          )
        ) {
          value15 = document.createElement("span");
          value15.className = "hb-runtime-action-hitbox";
          value15.setAttribute("aria-hidden", "true");
          element2.classList.add("hb-runtime-fitted-hit-area");
          element2.append(value15);
        }
        this.bindRuntimeActions(value15, value14);
      }
    }
    value.append(element2);
    const element3 = element2.querySelector(
      ":scope > .hb-runtime-action-hitbox",
    );
    if (element3) {
      const value13 =
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
      element3.hidden = !value13;
    }
    for (const value13 of component.children || []) {
      this.renderComponent(value13, element2, 0, value3, value4);
    }
  }
  startComponentMove(event, component, value, value2 = value) {
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
    const value3 = [...this.selectedComponentIds]
      .map((value16) => ({
        component: this.componentRecords.get(value16),
        host: this.componentHosts.get(value16),
      }))
      .filter((value16) => value16.component && value16.host)
      .map((value16) => ({
        ...value16,
        initialX: Number(value16.component.position?.x || 0),
        initialY: Number(value16.component.position?.y || 0),
        width: Number(value16.component.position?.width || 100),
        height: Number(value16.component.position?.height || 100),
        parentId: this.componentParentIds.get(value16.component.id) || null,
        parentTransform: this.componentParentTransform(value16.component.id),
      }));
    if (
      !value3.some((value16) => value16.component.id === component.id) ||
      value3.some(
        (value16) => value16.component.properties?.layoutMode === "fill",
      )
    ) {
      return;
    }
    let value4 = gi(event);
    let value5 =
      !value4 &&
      value3.length === 1 &&
      component.type === "air-conditioner" &&
      this.componentSelectionLayers.get(component.id) !== "airflow";
    const numeric = Number(component.properties?.airflowOffsetX ?? -75);
    const numeric2 = Number(component.properties?.airflowOffsetY ?? 34);
    let airflowOffsetX = numeric;
    let airflowOffsetY = numeric2;
    const numeric3 = Number(this.document?.canvas?.width || 2778);
    const numeric4 = Number(this.document?.canvas?.height || 1940);
    const fn = (value16) => {
      const value17 = value16.parentId
        ? this.componentRecords.get(value16.parentId)
        : null;
      const numeric7 = Number(value17?.position?.width || numeric3);
      const numeric8 = Number(value17?.position?.height || numeric4);
      return {
        minX: -value16.width / 2 - value16.initialX,
        maxX: numeric7 - value16.width / 2 - value16.initialX,
        minY: -value16.height / 2 - value16.initialY,
        maxY: numeric8 - value16.height / 2 - value16.initialY,
      };
    };
    const fn2 = (value16, value17, value18) => {
      const value19 = groupedComponentLocalDelta(
        value17,
        value18,
        value16.parentTransform,
      );
      const value20 = fn(value16);
      return {
        x: Math.max(value20.minX, Math.min(value20.maxX, value19.x)),
        y: Math.max(value20.minY, Math.min(value20.maxY, value19.y)),
      };
    };
    const numeric5 = Number(component.position?.x || 0);
    const numeric6 = Number(component.position?.y || 0);
    let value6 = numeric5;
    let value7 = numeric6;
    let value8 = value3;
    let value9 = [];
    let value10 = value3.map((value16) => ({
      componentId: value16.component.id,
      x: value16.initialX,
      y: value16.initialY,
    }));
    let id = component.id;
    let value11 = false;
    let value12 = "";
    let value13 = false;
    const pointerId = event.pointerId;
    value2.setPointerCapture(pointerId);
    value3.forEach((value16) => value16.host.classList.add("moving"));
    const value14 = (value16) => {
      if (value16.pointerId !== pointerId) {
        return;
      }
      if (!value2.hasPointerCapture?.(pointerId) && value2.isConnected) {
        try {
          value2.setPointerCapture(pointerId);
        } catch {}
      }
      if (!value4 && gi(value16)) {
        value4 = true;
        value5 = false;
      }
      let value17 = value16.clientX - clientX;
      let value18 = value16.clientY - clientY;
      if (value4 && !value11) {
        if (Math.hypot(value17, value18) < 3) {
          return;
        }
        value9 = value3.map((value23) => {
          const copiedComponent = hi(structuredClone(value23.component));
          copiedComponent.position = {
            ...(copiedComponent.position || {}),
            zIndex: Number(copiedComponent.position?.zIndex || 1) + 1,
          };
          this.renderComponent(copiedComponent, value23.host.parentElement);
          return {
            sourceComponentId: value23.component.id,
            copiedComponent: copiedComponent,
          };
        });
        value8 = value9.map((value23, value24) => ({
          component: value23.copiedComponent,
          host: this.componentHosts.get(value23.copiedComponent.id),
          initialX: value3[value24].initialX,
          initialY: value3[value24].initialY,
          width: value3[value24].width,
          height: value3[value24].height,
          parentId: value3[value24].parentId,
          parentTransform: value3[value24].parentTransform,
        }));
        id =
          value9.find((value23) => value23.sourceComponentId === component.id)
            ?.copiedComponent.id || value9[0]?.copiedComponent.id;
        value11 = true;
        value3.forEach((value23) => value23.host.classList.remove("moving"));
        value8.forEach((value23) => value23.host?.classList.add("moving"));
        this.selectedComponentId = id;
        this.selectedComponentIds = new Set(
          value8.map((value23) => value23.component.id),
        );
      }
      if (value16.shiftKey) {
        if (!value12 && Math.hypot(value17, value18) >= 1) {
          value12 =
            Math.abs(value17) >= Math.abs(value18) ? "horizontal" : "vertical";
        }
        if (value12 === "horizontal") {
          value18 = 0;
        }
        if (value12 === "vertical") {
          value17 = 0;
        }
      } else {
        value12 = "";
      }
      const value19 = value17 / (this.appliedScaleX || 1);
      const value20 = value18 / (this.appliedScaleY || 1);
      const value21 = fn2(
        value3.find((value23) => value23.component.id === component.id) ||
          value3[0],
        value19,
        value20,
      );
      value6 = numeric5 + value21.x;
      value7 = numeric6 + value21.y;
      if (value5) {
        airflowOffsetX =
          numeric -
          (value21.x / Math.max(1, Number(component.position?.width || 100))) *
            100;
        airflowOffsetY =
          numeric2 -
          (value21.y / Math.max(1, Number(component.position?.height || 100))) *
            100;
        component.properties = {
          ...(component.properties || {}),
          airflowOffsetX: airflowOffsetX,
          airflowOffsetY: airflowOffsetY,
        };
        this.options.onComponentPropertiesPreview?.(component.id, {
          airflowOffsetX: airflowOffsetX,
          airflowOffsetY: airflowOffsetY,
        });
      }
      const value22 = value8.map((value23) => {
        const value24 = fn2(value23, value19, value20);
        return {
          componentId: value23.component.id,
          x: value23.initialX + value24.x,
          y: value23.initialY + value24.y,
        };
      });
      value10 = value22;
      for (const value23 of value22) {
        const value24 = this.componentHosts.get(value23.componentId);
        if (value24) {
          value24.style.left = value23.x + "px";
          value24.style.top = value23.y + "px";
        }
        const value25 = this.componentSelectionOverlays.get(
          value23.componentId,
        );
        if (value25) {
          value25.style.left = value23.x + "px";
          value25.style.top = value23.y + "px";
        }
      }
      if (!value11) {
        if (value22.length > 1) {
          this.options.onComponentsTransformPreview?.(value22, component.id);
        } else {
          this.options.onComponentTransformPreview?.(component.id, {
            x: value6,
            y: value7,
          });
        }
      }
    };
    const value15 = (value16 = null) => {
      if (
        !value13 &&
        (value16?.pointerId == null || value16.pointerId === pointerId) &&
        ((value13 = true),
        value8.forEach((value17) => value17.host?.classList.remove("moving")),
        value3.forEach((value17) => value17.host.classList.remove("moving")),
        window.removeEventListener("pointermove", value14, true),
        window.removeEventListener("pointerup", value15, true),
        window.removeEventListener("pointercancel", value15, true),
        window.removeEventListener("blur", value15),
        value6 !== numeric5 || value7 !== numeric6)
      ) {
        if (value11) {
          value8.forEach((value17) => {
            const value18 = value10.find(
              (value19) => value19.componentId === value17.component.id,
            );
            value17.component.position = {
              ...(value17.component.position || {}),
              x: value18?.x ?? value17.initialX,
              y: value18?.y ?? value17.initialY,
            };
          });
          this.options.onComponentsDuplicate?.(value9, component.id, id);
        } else if (value3.length > 1) {
          const value17 = value10.map((value18) => {
            const value19 = value3.find(
              (value20) => value20.component.id === value18.componentId,
            );
            if (value19) {
              value19.component.position = {
                ...(value19.component.position || {}),
                x: value18.x,
                y: value18.y,
              };
            }
            return value18;
          });
          this.options.onComponentsTransform?.(value17, component.id);
        } else {
          component.position = {
            ...(component.position || {}),
            x: value6,
            y: value7,
          };
          this.options.onComponentTransform?.(component.id, {
            x: value6,
            y: value7,
            ...(value5
              ? {
                  airflowOffsetX: airflowOffsetX,
                  airflowOffsetY: airflowOffsetY,
                }
              : {}),
          });
        }
      }
    };
    window.addEventListener("pointermove", value14, true);
    window.addEventListener("pointerup", value15, true);
    window.addEventListener("pointercancel", value15, true);
    window.addEventListener("blur", value15);
  }
  createComponentSelectionOverlay(value, component) {
    if (
      !value ||
      !component ||
      !value.parentElement ||
      (value.parentElement !== this.canvas && !value.hidden)
    ) {
      return null;
    }
    const parentElement = value.parentElement;
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
      left: value.style.left,
      top: value.style.top,
      width: value.style.width,
      height: value.style.height,
      transform: value.style.transform,
    });
    if (component.type !== "light-statistics") {
      element.addEventListener("pointerdown", (value2) =>
        this.startComponentMove(value2, component, value, element),
      );
    }
    parentElement.append(element);
    this.componentSelectionOverlays.set(component.id, element);
    return element;
  }
  createAirflowSelectionOverlay(value, value2) {
    if (!value || !value2 || !value.parentElement) {
      return null;
    }
    const value3 = document.createElement("div");
    value3.className =
      "hb-component-selection-overlay hb-airflow-selection-overlay";
    value3.dataset.selectionFor = value2.id;
    Object.assign(value3.style, {
      left: value.style.left,
      top: value.style.top,
      width: value.style.width,
      height: value.style.height,
      transform: value.style.transform,
    });
    value.parentElement.append(value3);
    this.componentSelectionOverlays.set(value2.id, value3);
    return value3;
  }
  syncAirflowLayerGeometry(value, value2, value3 = null) {
    if (!value || !value2) {
      return;
    }
    const value4 = airflowLayerGeometry(value2, {
      grouped: value.parentElement !== this.canvas,
    });
    const value5 = {
      left: value4.left + "px",
      top: value4.top + "px",
      width: value4.width + "px",
      height: value4.height + "px",
      transform:
        "rotate(" + value4.rotation + "deg) scale(" + value4.scale + ")",
    };
    Object.assign(value.style, value5);
    if (value3) {
      Object.assign(value3.style, value5);
    }
  }
  appendEffectSelectionBounds(value, value2) {
    if (!value || !value2 || !value.parentElement) {
      return;
    }
    const value3 = document.createElement("div");
    value3.className =
      "hb-component-selection-overlay hb-effect-selection-overlay";
    value3.dataset.selectionFor = value2.id;
    Object.assign(value3.style, {
      left: value.style.left,
      top: value.style.top,
      width: value.style.width,
      height: value.style.height,
      transform: value.style.transform,
      pointerEvents: "none",
    });
    const value4 = document.createElement("div");
    value4.className = "hb-selection-bounds hb-effect-selection-bounds";
    for (const value5 of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const value6 = document.createElement("i");
      value6.className = "hb-corner-marker hb-corner-" + value5;
      value6.setAttribute("aria-hidden", "true");
      value4.append(value6);
    }
    value3.append(value4);
    value.parentElement.append(value3);
    this.componentSelectionOverlays.set(value2.id, value3);
    this.updateTransformHandleScale(value, value2, value4);
  }
  syncComponentSelectionOverlay(value) {
    const element = this.componentSelectionOverlays.get(value);
    const value2 = this.componentHosts.get(value);
    if (
      !!element &&
      !!value2 &&
      !element.classList.contains("hb-airflow-selection-overlay") &&
      !element.classList.contains("hb-effect-selection-overlay")
    ) {
      Object.assign(element.style, {
        left: value2.style.left,
        top: value2.style.top,
        width: value2.style.width,
        height: value2.style.height,
        transform: value2.style.transform,
      });
    }
  }
  appendTransformHandles(value, component, value2 = true, element = value) {
    if (!value || !component) {
      return;
    }
    const value3 = document.createElement("div");
    value3.className = "hb-selection-bounds";
    for (const value5 of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const value6 = document.createElement("i");
      value6.className = "hb-corner-marker hb-corner-" + value5;
      value6.setAttribute("aria-hidden", "true");
      value3.append(value6);
    }
    if (value2 && component.properties?.layoutMode !== "fill") {
      const value5 = document.createElement("button");
      value5.type = "button";
      value5.className = "hb-transform-handle hb-resize-handle";
      value5.title = "拖动缩放";
      value5.addEventListener("pointerdown", (value7) =>
        this.startComponentScale(value7, component, value, value3),
      );
      const value6 = document.createElement("button");
      value6.type = "button";
      value6.className = "hb-transform-handle hb-rotate-handle";
      value6.title = "拖动旋转";
      value6.addEventListener("pointerdown", (value7) =>
        this.startComponentRotate(value7, component, value, value3),
      );
      value3.append(value5, value6);
    }
    element.append(value3);
    if (
      component.type === "light-statistics" &&
      element.classList?.contains("hb-light-statistics-selection-overlay")
    ) {
      value3.addEventListener("pointerdown", (value5) =>
        this.startComponentMove(value5, component, value, value3),
      );
    }
    this.updateImageSelectionBounds(value, component, value3);
    this.updateTextSelectionBounds(value, component, value3);
    this.updateTitleButtonSelectionBounds(value, component, value3);
    this.updateDeviceButtonSelectionBounds(value, component, value3);
    const value4 = this.updateLightStatisticsSelectionBounds(
      value,
      component,
      value3,
    );
    if (component.type === "light-statistics" && !value4) {
      Object.assign(value3.style, {
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
      });
    }
    this.updateAirConditionerButtonSelectionBounds(value, component, value3);
    this.updateTransformHandleScale(value, component, value3);
  }
  withSelectionMeasurementHost(value, fn) {
    const value2 = [];
    let value3 = value;
    while (value3 && value3 !== this.canvas) {
      if (value3.hidden) {
        value2.push(value3);
        value3.hidden = false;
      }
      value3 = value3.parentElement;
    }
    try {
      return fn();
    } finally {
      for (const value4 of value2) {
        value4.hidden = true;
      }
    }
  }
  selectionElementIsVisible(element) {
    if (!element || element.hidden) {
      return false;
    }
    const value = window.getComputedStyle?.(element);
    if (value?.display === "none" || value?.visibility === "hidden") {
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
  selectionElementBox(element, value) {
    let left = 0;
    let top = 0;
    let value2 = element;
    const allowed = new Set();
    while (value2 && value2 !== value && !allowed.has(value2)) {
      allowed.add(value2);
      left += Number(value2.offsetLeft || 0);
      top += Number(value2.offsetTop || 0);
      value2 = value2.offsetParent || value2.parentElement;
    }
    const value3 = element.getBoundingClientRect?.();
    const width = Number(element.offsetWidth || value3?.width || 0);
    const height = Number(element.offsetHeight || value3?.height || 0);
    return {
      left: left,
      top: top,
      width: width,
      height: height,
    };
  }
  applyDoorWindowPerspective(value, value2, value3) {
    const value4 = value?.querySelector(".hb-door-window-visual");
    if (!value4 || !value2) {
      return;
    }
    const count = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const count2 = Math.max(1, Number(value2.position?.width || 100) / count);
    const count3 = Math.max(1, Number(value2.position?.height || 100) / count);
    value4.style.transform = doorWindowPerspectiveMatrix(
      count2,
      count3,
      value3,
    );
  }
  updateDoorWindowPerspectiveHandles(value, value2) {
    if (!value) {
      return;
    }
    const value3 = doorWindowPerspectiveCorners(value2);
    value
      .querySelector(".hb-door-window-perspective-guide polygon")
      ?.setAttribute(
        "points",
        [0, 1, 2, 3]
          .map((value4) => value3[value4 * 2] + "," + value3[value4 * 2 + 1])
          .join(" "),
      );
    value
      .querySelectorAll(".hb-door-window-perspective-handle")
      .forEach((value4) => {
        const numeric = Number(value4.dataset.perspectiveCornerIndex || 0);
        value4.style.left = value3[numeric * 2] * 100 + "%";
        value4.style.top = value3[numeric * 2 + 1] * 100 + "%";
      });
  }
  appendDoorWindowPerspectiveHandles(value, component, value2 = value) {
    if (
      !value ||
      !component ||
      component.properties?.sensorKind !== "door-window"
    ) {
      return;
    }
    const value3 = doorWindowPerspectiveCorners(
      component.properties?.perspectiveCorners,
    );
    const value4 = document.createElement("div");
    value4.className = "hb-selection-bounds hb-door-window-perspective-bounds";
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
    value4.append(element);
    const value5 = ["左上角", "右上角", "右下角", "左下角"];
    for (let value6 = 0; value6 < 4; value6 += 1) {
      const value7 = document.createElement("button");
      value7.type = "button";
      value7.className = "hb-door-window-perspective-handle";
      value7.dataset.perspectiveCornerIndex = String(value6);
      value7.title = "拖动" + value5[value6] + "调整透视";
      value7.setAttribute("aria-label", value7.title);
      value7.addEventListener("pointerdown", (value8) =>
        this.startDoorWindowPerspective(
          value8,
          component,
          value,
          value4,
          value6,
        ),
      );
      value4.append(value7);
    }
    value2.append(value4);
    this.updateDoorWindowPerspectiveHandles(value4, value3);
    this.updateTransformHandleScale(value, component, value4);
  }
  startDoorWindowPerspective(event, component, value, value2, value3) {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const value4 = doorWindowPerspectiveCorners(
      component.properties?.perspectiveCorners,
    );
    const value5 = value4[value3 * 2];
    const value6 = value4[value3 * 2 + 1];
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const value7 = this.componentWorldTransform(component.id);
    const scale = value7.scale;
    const value8 = (value7.rotation * Math.PI) / 180;
    const value9 = Math.cos(value8);
    const value10 = Math.sin(value8);
    let perspectiveCorners = value4;
    let value11 = false;
    const value12 = (value14) => {
      if (value14.pointerId !== pointerId) {
        return;
      }
      const value15 =
        (value14.clientX - clientX) / Math.max(0.001, this.appliedScaleX || 1);
      const value16 =
        (value14.clientY - clientY) / Math.max(0.001, this.appliedScaleY || 1);
      const value17 = (value9 * value15 + value10 * value16) / scale;
      const value18 = (-value10 * value15 + value9 * value16) / scale;
      const value19 = value4.slice();
      value19[value3 * 2] = value5 + value17 / count;
      value19[value3 * 2 + 1] = value6 + value18 / count2;
      perspectiveCorners = doorWindowPerspectiveCorners(value19);
      component.properties = {
        ...(component.properties || {}),
        perspectiveCorners: perspectiveCorners,
      };
      this.applyDoorWindowPerspective(value, component, perspectiveCorners);
      this.updateDoorWindowPerspectiveHandles(value2, perspectiveCorners);
      this.options.onComponentPropertiesPreview?.(component.id, {
        perspectiveCorners: perspectiveCorners,
      });
    };
    const value13 = (value14 = null) => {
      if (
        !value11 &&
        (value14?.pointerId == null || value14.pointerId === pointerId)
      ) {
        value11 = true;
        window.removeEventListener("pointermove", value12, true);
        window.removeEventListener("pointerup", value13, true);
        window.removeEventListener("pointercancel", value13, true);
        window.removeEventListener("blur", value13);
        if (JSON.stringify(perspectiveCorners) !== JSON.stringify(value4)) {
          this.options.onComponentProperties?.(component.id, {
            perspectiveCorners: perspectiveCorners,
          });
        }
      }
    };
    window.addEventListener("pointermove", value12, true);
    window.addEventListener("pointerup", value13, true);
    window.addEventListener("pointercancel", value13, true);
    window.addEventListener("blur", value13);
  }
  appendAirflowTransformHandles(value, value2) {
    if (!value || !value2) {
      return;
    }
    const value3 = this.createAirflowSelectionOverlay(value, value2);
    if (!value3) {
      return;
    }
    const value4 = document.createElement("div");
    value4.className = "hb-selection-bounds hb-airflow-selection-bounds";
    for (const value7 of [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]) {
      const value8 = document.createElement("i");
      value8.className = "hb-corner-marker hb-corner-" + value7;
      value8.setAttribute("aria-hidden", "true");
      value4.append(value8);
    }
    const value5 = document.createElement("button");
    value5.type = "button";
    value5.className = "hb-transform-handle hb-resize-handle";
    value5.title = "拖动缩放出风效果";
    value5.addEventListener("pointerdown", (value7) =>
      this.startAirflowScale(value7, value2, value, value4, value3),
    );
    const value6 = document.createElement("button");
    value6.type = "button";
    value6.className = "hb-transform-handle hb-rotate-handle";
    value6.title = "拖动旋转出风效果";
    value6.addEventListener("pointerdown", (value7) =>
      this.startAirflowRotate(value7, value2, value, value4, value3),
    );
    value4.append(value5, value6);
    value4.addEventListener("pointerdown", (value7) =>
      this.startAirflowMove(value7, value2, value, value4, value3),
    );
    value3.append(value4);
    this.updateAirflowHandleScale(value2, value4);
  }
  startAirflowMove(event, component, value, value2, value3) {
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
    const value4 = airflowCanvasOffsetBounds(component, this.document?.canvas);
    let airflowOffsetX = numeric;
    let airflowOffsetY = numeric2;
    let value5 = "";
    let value6 = false;
    const pointerId = event.pointerId;
    value2.setPointerCapture(pointerId);
    const value7 = (value9) => {
      if (value9.pointerId !== pointerId) {
        return;
      }
      if (!value2.hasPointerCapture?.(pointerId) && value2.isConnected) {
        try {
          value2.setPointerCapture(pointerId);
        } catch {}
      }
      let value10 = value9.clientX - clientX;
      let value11 = value9.clientY - clientY;
      if (value9.shiftKey) {
        if (!value5 && Math.hypot(value10, value11) >= 1) {
          value5 =
            Math.abs(value10) >= Math.abs(value11) ? "horizontal" : "vertical";
        }
        if (value5 === "horizontal") {
          value11 = 0;
        }
        if (value5 === "vertical") {
          value10 = 0;
        }
      } else {
        value5 = "";
      }
      const value12 = value10 / Math.max(0.001, this.appliedScaleX || 1);
      const value13 = value11 / Math.max(0.001, this.appliedScaleY || 1);
      const value14 = groupedComponentLocalDelta(
        value12,
        value13,
        this.componentParentTransform(component.id),
      );
      airflowOffsetX = Math.max(
        value4.minX,
        Math.min(value4.maxX, numeric + (value14.x / count) * 100),
      );
      airflowOffsetY = Math.max(
        value4.minY,
        Math.min(value4.maxY, numeric2 + (value14.y / count2) * 100),
      );
      component.properties = {
        ...(component.properties || {}),
        airflowOffsetX: airflowOffsetX,
        airflowOffsetY: airflowOffsetY,
      };
      this.syncAirflowLayerGeometry(value, component, value3);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowOffsetX: airflowOffsetX,
        airflowOffsetY: airflowOffsetY,
      });
    };
    const value8 = (value9 = null) => {
      if (
        !value6 &&
        (value9?.pointerId == null || value9.pointerId === pointerId)
      ) {
        value6 = true;
        window.removeEventListener("pointermove", value7, true);
        window.removeEventListener("pointerup", value8, true);
        window.removeEventListener("pointercancel", value8, true);
        window.removeEventListener("blur", value8);
        if (airflowOffsetX !== numeric || airflowOffsetY !== numeric2) {
          this.options.onComponentProperties?.(component.id, {
            airflowOffsetX: airflowOffsetX,
            airflowOffsetY: airflowOffsetY,
          });
        }
      }
    };
    window.addEventListener("pointermove", value7, true);
    window.addEventListener("pointerup", value8, true);
    window.addEventListener("pointercancel", value8, true);
    window.addEventListener("blur", value8);
  }
  updateAirflowHandleScale(component, element) {
    if (!component || !element) {
      return;
    }
    const value = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(
      0.01,
      Math.min(5, Number(component.properties?.airflowScale || 1)),
    );
    const scale = this.componentParentTransform(component.id).scale;
    const value2 = 1 / Math.max(0.001, value * count * scale);
    element.style.setProperty("--hb-ui-scale", String(value2));
    element.style.setProperty("--hb-handle-outset", value2 * 30 + "px");
    const value3 = element.getBoundingClientRect();
    element.classList.toggle(
      "handles-outside",
      value3.width < 132 || value3.height < 112,
    );
  }
  startAirflowScale(event, component, value, element, value2) {
    event.preventDefault();
    event.stopPropagation();
    const value3 = element.getBoundingClientRect();
    const value4 = value3.left + value3.width / 2;
    const value5 = value3.top + value3.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - value4, event.clientY - value5),
    );
    const count2 = Math.max(
      0.01,
      Math.min(5, Number(component.properties?.airflowScale || 1)),
    );
    let airflowScale = count2;
    let value6 = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const fn = () => {
      this.syncAirflowLayerGeometry(value, component, value2);
      this.updateAirflowHandleScale(component, element);
    };
    const value7 = (value9) => {
      const value10 = Math.hypot(
        value9.clientX - value4,
        value9.clientY - value5,
      );
      airflowScale = Math.max(0.01, Math.min(5, (count2 * value10) / count));
      component.properties = {
        ...(component.properties || {}),
        airflowScale: airflowScale,
      };
      fn();
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowScale: airflowScale,
      });
    };
    const value8 = () => {
      if (!value6) {
        value6 = true;
        currentTarget.removeEventListener("pointermove", value7);
        currentTarget.removeEventListener("pointerup", value8);
        currentTarget.removeEventListener("pointercancel", value8);
        currentTarget.removeEventListener("lostpointercapture", value8);
        if (airflowScale !== count2) {
          this.options.onComponentProperties?.(component.id, {
            airflowScale: airflowScale,
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", value7);
    currentTarget.addEventListener("pointerup", value8);
    currentTarget.addEventListener("pointercancel", value8);
    currentTarget.addEventListener("lostpointercapture", value8);
  }
  startAirflowRotate(event, component, value, element, value2) {
    event.preventDefault();
    event.stopPropagation();
    const value3 = element.getBoundingClientRect();
    const value4 = value3.left + value3.width / 2;
    const value5 = value3.top + value3.height / 2;
    const value6 = Math.atan2(event.clientY - value5, event.clientX - value4);
    const numeric = Number(component.properties?.airflowRotation || 0);
    let airflowRotation = numeric;
    let value7 = false;
    const currentTarget = event.currentTarget;
    currentTarget.setPointerCapture(event.pointerId);
    const value8 = (value10) => {
      const value11 = Math.atan2(
        value10.clientY - value5,
        value10.clientX - value4,
      );
      airflowRotation = numeric + ((value11 - value6) * 180) / Math.PI;
      component.properties = {
        ...(component.properties || {}),
        airflowRotation: airflowRotation,
      };
      this.syncAirflowLayerGeometry(value, component, value2);
      this.options.onComponentPropertiesPreview?.(component.id, {
        airflowRotation: airflowRotation,
      });
    };
    const value9 = () => {
      if (!value7) {
        value7 = true;
        currentTarget.removeEventListener("pointermove", value8);
        currentTarget.removeEventListener("pointerup", value9);
        currentTarget.removeEventListener("pointercancel", value9);
        currentTarget.removeEventListener("lostpointercapture", value9);
        if (airflowRotation !== numeric) {
          this.options.onComponentProperties?.(component.id, {
            airflowRotation: airflowRotation,
          });
        }
      }
    };
    currentTarget.addEventListener("pointermove", value8);
    currentTarget.addEventListener("pointerup", value9);
    currentTarget.addEventListener("pointercancel", value9);
    currentTarget.addEventListener("lostpointercapture", value9);
  }
  updateAirConditionerButtonSelectionBounds(value, component, value2) {
    if (!value || component?.type !== "air-conditioner" || !value2) {
      return;
    }
    const value3 = component.properties || {};
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const value4 = [];
    const fn = (value11, value12, value13, value14) => {
      const numeric = Number(value11);
      return Math.max(
        value12,
        Math.min(value13, Number.isFinite(numeric) ? numeric : value14),
      );
    };
    const fn2 = (value11, value12, value13, value14) => {
      value4.push({
        left: value11 - value13 / 2,
        top: value12 - value14 / 2,
        right: value11 + value13 / 2,
        bottom: value12 + value14 / 2,
      });
    };
    const fn3 = (value11, value12, value13, value14) => {
      const count4 = Math.max(
        value14,
        Number(value11?.offsetWidth || 0) * count3,
      );
      const count5 = Math.max(
        value14,
        Number(value11?.offsetHeight || 0) * count3,
      );
      const left = (count * fn(value12, -100, 200, 0)) / 100;
      const value15 = (count2 * fn(value13, -100, 200, 50)) / 100;
      value4.push({
        left: left,
        top: value15 - count5 / 2,
        right: left + count4,
        bottom: value15 + count5 / 2,
      });
    };
    const value5 = (count2 * fn(value3.badgeSize, 1, 100, 28)) / 100;
    if (value3.iconVisible !== false) {
      fn2(
        (count * fn(value3.iconLeft, -100, 200, 20)) / 100,
        (count2 * fn(value3.iconTop, -100, 200, 50)) / 100,
        value5,
        value5,
      );
    }
    if (value3.mainTextVisible !== false) {
      fn3(
        value.querySelector(
          ":scope > .hb-air-conditioner .hb-air-conditioner-text strong",
        ),
        value3.mainTextLeft,
        value3.mainTextTop,
        (count2 * fn(value3.mainSize, 6, 120, 21)) / 100,
      );
    }
    if (value3.secondaryTextVisible !== false) {
      fn3(
        value.querySelector(
          ":scope > .hb-air-conditioner .hb-air-conditioner-text small",
        ),
        value3.secondaryTextLeft,
        value3.secondaryTextTop,
        (count2 * fn(value3.secondarySize, 5, 80, 12)) / 100,
      );
    }
    if (!value4.length) {
      Object.assign(value2.style, {
        left: "0px",
        top: "0px",
        width: count + "px",
        height: count2 + "px",
      });
      return;
    }
    const value6 = 4;
    const value7 = Math.min(...value4.map((value11) => value11.left)) - value6;
    const value8 = Math.min(...value4.map((value11) => value11.top)) - value6;
    const value9 = Math.max(...value4.map((value11) => value11.right)) + value6;
    const value10 =
      Math.max(...value4.map((value11) => value11.bottom)) + value6;
    Object.assign(value2.style, {
      left: value7 + "px",
      top: value8 + "px",
      width: Math.max(1, value9 - value7) + "px",
      height: Math.max(1, value10 - value8) + "px",
    });
  }
  updateDeviceButtonSelectionBounds(value, component, value2) {
    if (!value || component?.type !== "device-button" || !value2) {
      return false;
    }
    const value3 = component.properties || {};
    const value4 = value3.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const value5 = [];
    const fn = (value12, value13, value14, value15) => {
      const numeric = Number(value12);
      return Math.max(
        value13,
        Math.min(value14, Number.isFinite(numeric) ? numeric : value15),
      );
    };
    const fn2 = (value12, value13, value14, value15) => {
      if (
        !![value12, value13, value14, value15].every(Number.isFinite) &&
        !(value14 <= 0) &&
        !(value15 <= 0)
      ) {
        value5.push({
          left: value12 - value14 / 2,
          top: value13 - value15 / 2,
          right: value12 + value14 / 2,
          bottom: value13 + value15 / 2,
        });
      }
    };
    const fn3 = (value12, value13, value14, value15) => {
      const count4 = Math.max(
        value15,
        Number(value12?.offsetWidth || 0) * count3,
      );
      const count5 = Math.max(
        value15,
        Number(value12?.offsetHeight || 0) * count3,
      );
      const left = (count * fn(value13, -100, 200, 0)) / 100;
      const value16 = (count2 * fn(value14, -100, 200, 50)) / 100;
      value5.push({
        left: left,
        top: value16 - count5 / 2,
        right: left + count4,
        bottom: value16 + count5 / 2,
      });
    };
    const value6 =
      (count2 * fn(value3.badgeSize ?? value3.iconSize, 1, 100, 28)) / 100;
    if (value3.iconVisible !== false || value4) {
      fn2(
        (count * fn(value3.iconLeft, -100, 200, 20)) / 100,
        (count2 * fn(value3.iconTop, -100, 200, 50)) / 100,
        value6,
        value6,
      );
    }
    if (value3.mainTextVisible !== false || value4) {
      fn3(
        value.querySelector(
          ":scope > .hb-icon-button .hb-icon-button-text strong",
        ),
        value3.mainTextLeft,
        value3.mainTextTop,
        (count2 * fn(value3.mainSize, 6, 120, 21)) / 100,
      );
    }
    if (value3.secondaryTextVisible !== false || value4) {
      fn3(
        value.querySelector(
          ":scope > .hb-icon-button .hb-icon-button-text small",
        ),
        value3.secondaryTextLeft,
        value3.secondaryTextTop,
        (count2 * fn(value3.secondarySize, 5, 80, 12)) / 100,
      );
    }
    if (!value5.length) {
      return false;
    }
    const value7 = 4;
    const value8 = Math.min(...value5.map((value12) => value12.left)) - value7;
    const value9 = Math.min(...value5.map((value12) => value12.top)) - value7;
    const value10 =
      Math.max(...value5.map((value12) => value12.right)) + value7;
    const value11 =
      Math.max(...value5.map((value12) => value12.bottom)) + value7;
    Object.assign(value2.style, {
      left: value8 + "px",
      top: value9 + "px",
      width: Math.max(1, value10 - value8) + "px",
      height: Math.max(1, value11 - value9) + "px",
    });
    return true;
  }
  updateTitleButtonSelectionBounds(value, component, value2) {
    if (!value || component?.type !== "title-button" || !value2) {
      return false;
    }
    const value3 = component.properties || {};
    const value4 = value3.hiddenContentClickable === true;
    const count = Math.max(1, Number(component.position?.width || 100));
    const count2 = Math.max(1, Number(component.position?.height || 100));
    const count3 = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const value5 = [];
    const fn = (left, top, value11, value12) => {
      if (
        !![left, top, value11, value12].every(Number.isFinite) &&
        !(value11 <= 0) &&
        !(value12 <= 0)
      ) {
        value5.push({
          left: left,
          top: top,
          right: left + value11,
          bottom: top + value12,
        });
      }
    };
    const fn2 = (value11, value12, value13, value14) => {
      const numeric = Number(value11);
      return Math.max(
        value12,
        Math.min(value13, Number.isFinite(numeric) ? numeric : value14),
      );
    };
    if (value3.frameVisible !== false || value4) {
      const value11 = fn2(value3.frameSize, 10, 300, 100) / 100;
      const value12 = count2 * 0.45 * value11;
      const value13 =
        count / 2 + (count * fn2(value3.frameOffsetX, -100, 100, 0)) / 100;
      const value14 =
        count2 / 2 + (count2 * fn2(value3.frameOffsetY, -100, 100, 0)) / 100;
      const value15 = (count * fn2(value3.frameSpacing, 0, 300, 100)) / 200;
      const value16 = count2 * 0.12;
      const value17 = fn2(value3.frameWidth, 0, 12, 1.5);
      fn(
        value13 - value15 - value17 / 2,
        value14 - value12 / 2 - value17 / 2,
        value16 + value17,
        value12 + value17,
      );
      fn(
        value13 + value15 - value16 - value17 / 2,
        value14 - value12 / 2 - value17 / 2,
        value16 + value17,
        value12 + value17,
      );
    }
    if (value3.mainTextVisible !== false || value4) {
      const element = value.querySelector(
        ":scope > .hb-title-button .hb-title-button-main",
      );
      const value11 = (count2 * fn2(value3.mainSize, 8, 200, 34)) / 100;
      fn(
        (count * fn2(value3.mainTextLeft, -100, 200, 5.5)) / 100,
        (count2 * fn2(value3.mainTextTop, -100, 200, 45)) / 100 - value11 / 2,
        Math.max(value11, Number(element?.offsetWidth || 0) * count3),
        Math.max(value11, Number(element?.offsetHeight || 0) * count3),
      );
    }
    if (value3.secondaryTextVisible !== false || value4) {
      const element = value.querySelector(
        ":scope > .hb-title-button .hb-title-button-secondary",
      );
      const value11 = (count2 * fn2(value3.secondarySize, 6, 100, 12)) / 100;
      const count4 = Math.max(
        value11,
        Number(element?.offsetHeight || 0) * count3,
      );
      fn(
        (count * fn2(value3.secondaryTextLeft, -100, 200, 54)) / 100,
        (count2 * fn2(value3.secondaryTextTop, -100, 200, 43)) / 100 -
          count4 / 2,
        Math.max(value11, Number(element?.offsetWidth || 0) * count3),
        count4,
      );
    }
    if ((value3.iconVisible !== false || value4) && value3.icon) {
      const value11 = (count2 * fn2(value3.iconSize, 1, 100, 30)) / 100;
      fn(
        (count * fn2(value3.iconLeft, -100, 200, 50)) / 100 - value11 / 2,
        (count2 * fn2(value3.iconTop, -100, 200, 45)) / 100 - value11 / 2,
        value11,
        value11,
      );
    }
    if (value3.markerVisible !== false || value4) {
      const value11 = (count2 * fn2(value3.markerSize, 2, 60, 10)) / 100;
      const value12 = (count * fn2(value3.markerLeft, -100, 200, 1.8)) / 100;
      const value13 = (count2 * fn2(value3.markerTop, -100, 200, 84)) / 100;
      fn(value12 - value11 * 0.58, value13, value11 * 1.16, value11);
    }
    if (!value5.length) {
      return false;
    }
    const value6 = 4;
    const value7 = Math.min(...value5.map((value11) => value11.left)) - value6;
    const value8 = Math.min(...value5.map((value11) => value11.top)) - value6;
    const value9 = Math.max(...value5.map((value11) => value11.right)) + value6;
    const value10 =
      Math.max(...value5.map((value11) => value11.bottom)) + value6;
    Object.assign(value2.style, {
      left: value7 + "px",
      top: value8 + "px",
      width: Math.max(1, value9 - value7) + "px",
      height: Math.max(1, value10 - value8) + "px",
    });
    return true;
  }
  updateLightStatisticsSelectionBounds(value, value2, value3) {
    if (
      !value ||
      value2?.type !== "light-statistics" ||
      !value3 ||
      value.hidden
    ) {
      return false;
    }
    const element = value.querySelector(":scope > .hb-light-statistics");
    if (!element) {
      return false;
    }
    const value4 = [...element.children].filter((value10) =>
      value10.hidden ||
      Number(value10.offsetWidth || 0) <= 0 ||
      Number(value10.offsetHeight || 0) <= 0
        ? false
        : window.getComputedStyle?.(value10).display !== "none",
    );
    if (!value4.length) {
      return false;
    }
    const count = Math.max(
      0.01,
      Number(this.document?.canvas?.componentScale || 1),
    );
    const value5 = 4;
    const value6 =
      (Math.min(...value4.map((value10) => value10.offsetLeft)) - value5) *
      count;
    const value7 =
      (Math.min(...value4.map((value10) => value10.offsetTop)) - value5) *
      count;
    const value8 =
      (Math.max(
        ...value4.map((value10) => value10.offsetLeft + value10.offsetWidth),
      ) +
        value5) *
      count;
    const value9 =
      (Math.max(
        ...value4.map((value10) => value10.offsetTop + value10.offsetHeight),
      ) +
        value5) *
      count;
    Object.assign(value3.style, {
      left: value6 + "px",
      top: value7 + "px",
      width: Math.max(1, value8 - value6) + "px",
      height: Math.max(1, value9 - value7) + "px",
    });
    return true;
  }
  updateTextSelectionBounds(value, value2, value3) {
    if (
      !value ||
      !["time", "date", "weather"].includes(value2?.type) ||
      !value3
    ) {
      return false;
    } else {
      return this.withSelectionMeasurementHost(value, () => {
        const element = value.querySelector(
          ":scope > .hb-time-component, :scope > .hb-date-component, :scope > .hb-weather-component",
        );
        if (!element) {
          return false;
        }
        const value4 = (
          value2.type === "time"
            ? [
                ...element.querySelectorAll(
                  ":scope > .hb-time-value, :scope > .hb-time-period",
                ),
              ]
            : value2.type === "date"
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
        ).filter((value11) => this.selectionElementIsVisible(value11));
        const count = Math.max(
          0.01,
          Number(this.document?.canvas?.componentScale || 1),
        );
        const count2 = Math.max(1, Number(value2.position?.width || 100));
        const count3 = Math.max(1, Number(value2.position?.height || 100));
        if (!value4.length) {
          const value11 = Math.min(
            32,
            Math.max(20, Math.min(count2, count3) * 0.2),
          );
          Object.assign(value3.style, {
            left: (count2 - value11) / 2 + "px",
            top: (count3 - value11) / 2 + "px",
            width: value11 + "px",
            height: value11 + "px",
          });
          return false;
        }
        const value5 = value4.map((value11) =>
          this.selectionElementBox(value11, value),
        );
        const value6 = 3;
        const value7 =
          (Math.min(...value5.map((value11) => value11.left)) - value6) * count;
        const value8 =
          (Math.min(...value5.map((value11) => value11.top)) - value6) * count;
        const value9 =
          (Math.max(...value5.map((value11) => value11.left + value11.width)) +
            value6) *
          count;
        const value10 =
          (Math.max(...value5.map((value11) => value11.top + value11.height)) +
            value6) *
          count;
        Object.assign(value3.style, {
          left: value7 + "px",
          top: value8 + "px",
          width: Math.max(1, value9 - value7) + "px",
          height: Math.max(1, value10 - value8) + "px",
        });
        return true;
      });
    }
  }
  async updateImageSelectionBounds(value, value2, value3) {
    const element = value.querySelector(":scope > .hb-image-component");
    if (
      !element ||
      ((!element.complete || !element.naturalWidth) &&
        (await new Promise((value10) => {
          element.addEventListener("load", value10, {
            once: true,
          });
          element.addEventListener("error", value10, {
            once: true,
          });
        })),
      !value.isConnected ||
        !value3.isConnected ||
        !element.naturalWidth ||
        !element.naturalHeight)
    ) {
      return;
    }
    const numeric = Number(value2.position?.width || 100);
    const numeric2 = Number(value2.position?.height || 100);
    const value4 = element.naturalWidth / element.naturalHeight;
    const value5 = numeric / numeric2;
    const value6 = value4 >= value5 ? numeric : numeric2 * value4;
    const value7 = value4 >= value5 ? numeric / value4 : numeric2;
    const value8 = (numeric - value6) / 2;
    const value9 = (numeric2 - value7) / 2;
    Object.assign(value3.style, {
      left: (value8 / numeric) * 100 + "%",
      top: (value9 / numeric2) * 100 + "%",
      width: (value6 / numeric) * 100 + "%",
      height: (value7 / numeric2) * 100 + "%",
    });
  }
  updateTransformHandleScale(value, value2, value3 = null) {
    if (!value || !value2) {
      return;
    }
    const value4 = Math.min(this.appliedScaleX || 1, this.appliedScaleY || 1);
    const count = Math.max(0.01, Math.min(5, Number(value2.style?.scale || 1)));
    const scale = this.componentParentTransform(value2.id).scale;
    const value5 = 1 / Math.max(0.001, value4 * count * scale);
    const element =
      value3 ||
      this.componentSelectionOverlays
        .get(value2.id)
        ?.querySelector(":scope > .hb-selection-bounds") ||
      value.querySelector(":scope > .hb-selection-bounds");
    if (!element) {
      return;
    }
    element.style.setProperty("--hb-ui-scale", String(value5));
    element.style.setProperty("--hb-handle-outset", value5 * 30 + "px");
    const value6 = element.getBoundingClientRect();
    element.classList.toggle(
      "handles-outside",
      value6.width < 132 || value6.height < 112,
    );
  }
  startComponentScale(event, value, element, element2) {
    event.preventDefault();
    event.stopPropagation();
    const value2 =
      element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const value3 = value2.left + value2.width / 2;
    const value4 = value2.top + value2.height / 2;
    const count = Math.max(
      1,
      Math.hypot(event.clientX - value3, event.clientY - value4),
    );
    const count2 = Math.max(0.01, Math.min(5, Number(value.style?.scale || 1)));
    let scale = count2;
    let value5 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const value6 = (value8) => {
      if (value8.pointerId !== pointerId) {
        return;
      }
      const value9 = Math.hypot(
        value8.clientX - value3,
        value8.clientY - value4,
      );
      scale = Math.max(0.01, Math.min(5, (count2 * value9) / count));
      value.style = {
        ...(value.style || {}),
        scale: scale,
      };
      element.style.transform =
        "rotate(" +
        Number(value.position?.rotation || 0) +
        "deg) scale(" +
        scale +
        ")";
      const value10 = this.componentSelectionOverlays.get(value.id);
      if (value10) {
        value10.style.transform = element.style.transform;
      }
      this.updateTransformHandleScale(element, value, element2);
      this.options.onComponentTransformPreview?.(value.id, {
        scale: scale,
      });
    };
    const value7 = (value8 = null) => {
      if (
        !value5 &&
        (value8?.pointerId == null || value8.pointerId === pointerId)
      ) {
        value5 = true;
        window.removeEventListener("pointermove", value6, true);
        window.removeEventListener("pointerup", value7, true);
        window.removeEventListener("pointercancel", value7, true);
        window.removeEventListener("blur", value7);
        value.style = {
          ...(value.style || {}),
          scale: scale,
        };
        if (scale !== count2) {
          this.options.onComponentTransform?.(value.id, {
            scale: scale,
          });
        }
      }
    };
    window.addEventListener("pointermove", value6, true);
    window.addEventListener("pointerup", value7, true);
    window.addEventListener("pointercancel", value7, true);
    window.addEventListener("blur", value7);
  }
  startComponentRotate(event, value, element, element2) {
    event.preventDefault();
    event.stopPropagation();
    const value2 =
      element2?.getBoundingClientRect() || element.getBoundingClientRect();
    const value3 = value2.left + value2.width / 2;
    const value4 = value2.top + value2.height / 2;
    const value5 = Math.atan2(event.clientY - value4, event.clientX - value3);
    const numeric = Number(value.position?.rotation || 0);
    let rotation = numeric;
    let value6 = false;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const value7 = (value9) => {
      if (value9.pointerId !== pointerId) {
        return;
      }
      const value10 = Math.atan2(
        value9.clientY - value4,
        value9.clientX - value3,
      );
      rotation = numeric + ((value10 - value5) * 180) / Math.PI;
      element.style.transform =
        "rotate(" +
        rotation +
        "deg) scale(" +
        Number(value.style?.scale || 1) +
        ")";
      const value11 = this.componentSelectionOverlays.get(value.id);
      if (value11) {
        value11.style.transform = element.style.transform;
      }
      this.options.onComponentTransformPreview?.(value.id, {
        rotation: rotation,
      });
    };
    const value8 = (value9 = null) => {
      if (
        !value6 &&
        (value9?.pointerId == null || value9.pointerId === pointerId)
      ) {
        value6 = true;
        window.removeEventListener("pointermove", value7, true);
        window.removeEventListener("pointerup", value8, true);
        window.removeEventListener("pointercancel", value8, true);
        window.removeEventListener("blur", value8);
        value.position = {
          ...(value.position || {}),
          rotation: rotation,
        };
        if (rotation !== numeric) {
          this.options.onComponentTransform?.(value.id, {
            rotation: rotation,
          });
        }
      }
    };
    window.addEventListener("pointermove", value7, true);
    window.addEventListener("pointerup", value8, true);
    window.addEventListener("pointercancel", value8, true);
    window.addEventListener("blur", value8);
  }
  bindRuntimeActions(value, component) {
    let value2 = null;
    let value3 = null;
    let value4 = null;
    let value5 = false;
    let value6 = null;
    let value7 = null;
    let value8 = 0;
    let value9 = null;
    let value10;
    const value11 = De(component, component.actions?.tap)
      ? component.actions.tap
      : null;
    const value12 = De(component, component.actions?.doubleTap)
      ? component.actions.doubleTap
      : null;
    const value13 = De(component, component.actions?.hold)
      ? component.actions.hold
      : null;
    const value14 = !!value11?.type && value11.type !== "none";
    const value15 = !!value12?.type && value12.type !== "none";
    const value16 = !!value13?.type && value13.type !== "none";
    const fn = () => {
      this.options.onRuntimeButtonPress?.(value);
    };
    const fn2 = () => {
      if (value9 || value11?.type !== "toggle") {
        return;
      }
      const entityId = component.bindings?.entity?.entityId;
      if (entityId && !isVirtualEntityId(entityId)) {
        value10 = this.states.get(this.powerEntityId(component, entityId));
        value9 = this.applyOptimisticToggle(entityId, component);
      }
    };
    const fn3 = () => {
      value9?.();
      value9 = null;
      value10 = undefined;
    };
    const fn4 = () => {
      const optimisticRollback = value9;
      const optimisticPreviousState = value10;
      value9 = null;
      value10 = undefined;
      if (value14) {
        this.runAction(component, value11, {
          optimisticAlreadyApplied: !!optimisticRollback,
          optimisticRollback: optimisticRollback,
          optimisticPreviousState: optimisticPreviousState,
        });
      }
    };
    value.style.touchAction = "manipulation";
    value.addEventListener("contextmenu", (event) => event.preventDefault());
    value.addEventListener("selectstart", (event) => event.preventDefault());
    value.addEventListener("dragstart", (event) => event.preventDefault());
    value.addEventListener("pointerdown", (value17) => {
      value5 = false;
      value6 = {
        pointerId: value17.pointerId,
        pointerType: value17.pointerType || "mouse",
        x: value17.clientX,
        y: value17.clientY,
        moved: false,
      };
      if (value16) {
        value4 = window.setTimeout(() => {
          value5 = true;
          value7 = null;
          window.clearTimeout(value3);
          fn();
          this.runAction(component, value13);
        }, 400);
      }
    });
    const fn5 = () => window.clearTimeout(value4);
    value.addEventListener("pointermove", (value17) => {
      if (
        !!value6 &&
        value6.pointerId === value17.pointerId &&
        !(
          Math.hypot(value17.clientX - value6.x, value17.clientY - value6.y) <=
          18
        )
      ) {
        value6.moved = true;
        fn5();
      }
    });
    value.addEventListener("pointerup", (event) => {
      fn5();
      const value17 = value6?.pointerId === event.pointerId ? value6 : null;
      value6 = null;
      if (
        !value17 ||
        value17.pointerType === "mouse" ||
        value17.moved ||
        value5
      ) {
        return;
      }
      event.preventDefault();
      value8 = performance.now() + 700;
      if (value14 || value15) {
        fn();
      }
      const time = performance.now();
      if (
        value15 &&
        value7 &&
        time - value7.time <= 180 &&
        Math.hypot(event.clientX - value7.x, event.clientY - value7.y) <= 34
      ) {
        window.clearTimeout(value3);
        fn3();
        value7 = null;
        this.runAction(component, value12);
        return;
      }
      value7 = {
        time: time,
        x: event.clientX,
        y: event.clientY,
      };
      if (value15) {
        fn2();
        window.clearTimeout(value3);
        value3 = window.setTimeout(() => {
          fn4();
          value7 = null;
        }, 180);
      } else {
        if (value14) {
          this.runAction(component, value11);
        }
        value7 = null;
      }
    });
    value.addEventListener("pointercancel", () => {
      fn5();
      value6 = null;
    });
    value.addEventListener("click", () => {
      if (!(performance.now() < value8) && !value5) {
        if (value14 || value15) {
          fn();
        }
        if (value15) {
          fn2();
          window.clearTimeout(value2);
          value2 = window.setTimeout(() => {
            fn4();
          }, 180);
        } else if (value14) {
          this.runAction(component, value11);
        }
      }
    });
    value.addEventListener("dblclick", () => {
      window.clearTimeout(value2);
      fn3();
      if (value15) {
        this.runAction(component, value12);
      }
    });
    this.cleanups.push(() => {
      window.clearTimeout(value2);
      window.clearTimeout(value3);
      window.clearTimeout(value4);
      fn3();
    });
  }
  runAction(component, value, value2 = {}) {
    if (!!value?.type && value.type !== "none") {
      this.dispatchAction(component, value, value2).catch((value3) => {
        window.HABridgeLog?.error(value3, {
          componentId: component.id,
          entityId: component.bindings?.entity?.entityId || "",
          phase: "component-action",
        });
        this.options.onError?.(value3);
      });
    }
  }
  previewAction(value, value2) {
    if (value2?.type === "more-info") {
      this.showActionPopup(value, value2, {
        preview: true,
      });
    }
  }
  popupComponentForEntity(value, value2 = "") {
    let entityId = String(value || "");
    let value3 = entityId.split(".")[0];
    const value4 = this.deviceProfile(entityId);
    if (
      value4?.deviceType === "air-purifier" &&
      value4.roles?.fan &&
      value3 !== "fan"
    ) {
      entityId = value4.roles.fan;
      value3 = "fan";
    }
    const value5 = value4?.roles?.climate || value4?.roles?.fan || "";
    if (
      ["air-conditioner", "bath-heater"].includes(value4?.deviceType) &&
      value5 &&
      !["climate", "light"].includes(value3)
    ) {
      entityId = value5;
      value3 = entityId.split(".")[0];
    }
    const value6 = this.entityMetadata.get(entityId);
    if (
      value3 === "sensor" &&
      value6?.deviceId &&
      ["state", "status", "task_status"].includes(value6.translationKey)
    ) {
      const value7 = [...this.entityMetadata.values()].find(
        (value8) =>
          value8.deviceId === value6.deviceId &&
          value8.domain === "vacuum" &&
          entityMetadataIsAvailable(value8),
      );
      if (value7?.entityId) {
        entityId = value7.entityId;
        value3 = "vacuum";
      }
    }
    const type =
      value4?.deviceType === "electric-bed"
        ? "electric-bed"
        : value4?.deviceType === "air-purifier" && value3 === "fan"
          ? "air-purifier"
          : (["air-conditioner", "bath-heater"].includes(value4?.deviceType) &&
                ["climate", "fan"].includes(value3)) ||
              value3 === "climate"
            ? "air-conditioner"
            : value3 === "water_heater"
              ? "water-heater"
              : value3 === "camera"
                ? "camera"
                : value3 === "media_player"
                  ? "media-player"
                  : ["fan", "select", "number", "input_number"].includes(value3)
                    ? "device-button"
                    : ["light", "switch", "input_boolean"].includes(value3)
                      ? "icon-button"
                      : value3 === "sensor"
                        ? "line-chart"
                        : value3 === "vacuum"
                          ? "vacuum-control"
                          : "device-button";
    return {
      id: "popup-" + entityId,
      type: type,
      bindings: {
        entity: {
          entityId: entityId,
        },
      },
      properties: {
        label: value2 || "",
        ...(["air-conditioner", "bath-heater"].includes(value4?.deviceType)
          ? {
              deviceType: value4.deviceType,
            }
          : {}),
        ...(value4?.deviceType === "air-purifier"
          ? {
              deviceType: "air-purifier",
            }
          : {}),
        ...(value4?.deviceType === "electric-bed"
          ? {
              deviceType: "electric-bed",
            }
          : {}),
        ...(value4?.coverKind
          ? {
              coverKind: value4.coverKind,
            }
          : {}),
      },
      actions: {},
    };
  }
  showActionPopup(component, value, { preview = false } = {}) {
    const value2 = value?.data?.popupSource || "current";
    if (value2 === "custom") {
      const value4 = (this.document?.customPopups || []).find(
        (value5) => value5.id === value.data?.popupId,
      );
      if (!value4) {
        throw new Error("选择的组合弹窗不存在。");
      }
      this.showCustomPopup(value4, {
        preview: preview,
      });
      return;
    }
    const entityId = component?.bindings?.entity?.entityId;
    const value3 =
      String(entityId || "").split(".", 1)[0] === "cover" ||
      ["camera", "line-chart", "air-conditioner", "icon-button"].includes(
        component?.type,
      );
    let component2 =
      value2 === "entity"
        ? this.popupComponentForEntity(
            value.data?.entityId,
            componentDialogTitle(
              component,
              value.data?.title || value.data?.entityId,
            ),
          )
        : value3
          ? component
          : this.popupComponentForEntity(
              entityId,
              componentDialogTitle(component, ""),
            );
    if (
      value2 !== "entity" &&
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
        preview: preview,
      });
    } else {
      this.showEntityDetails(component2, {
        preview: preview,
      });
    }
  }
  async dispatchAction(
    component,
    value,
    {
      optimisticAlreadyApplied: value3 = false,
      optimisticRollback: value4 = null,
      optimisticPreviousState: value2,
    } = {},
  ) {
    if (value.type === "toggle") {
      const entityId = component.bindings?.entity?.entityId;
      if (!entityId) {
        throw new Error("该控件没有关联实体。");
      }
      if (isVirtualEntityId(entityId)) {
        this.toggleVirtualEntity(entityId);
        return;
      }
      const value5 =
        typeof this.powerEntityId == "function"
          ? this.powerEntityId(component, entityId)
          : entityId;
      const value6 = value5.split(".", 1)[0];
      if (["button", "script"].includes(value6)) {
        const value8 = entityToggleCommand(
          value5,
          this.states.get(value5),
          component,
        );
        await this.callEntityService(
          value8.domain,
          value8.service,
          value5,
          value8.data,
        );
        return;
      }
      const value7 = value3 ? value2 : this.states.get(value5);
      const fn = value3
        ? value4 || (() => {})
        : this.applyOptimisticToggle(value5, component);
      try {
        if (value6 === "cover") {
          const index = new Map(this.states);
          if (value7 === undefined) {
            index.delete(value5);
          } else {
            index.set(value5, value7);
          }
          await this.callEntityService(
            "cover",
            coverToggleServiceForComponent(
              component,
              this.entityMetadata,
              index,
              value5,
            ),
            value5,
          );
        } else if (
          ["climate", "fan", "water_heater", "media_player"].includes(value6)
        ) {
          const value8 =
            typeof this.runtimePowerComponent == "function"
              ? this.runtimePowerComponent(component, entityId)
              : component;
          const value9 = entityToggleCommand(value5, value7, value8);
          await this.callEntityService(
            value9.domain,
            value9.service,
            value5,
            value9.data,
          );
        } else {
          await this.callEntityService("homeassistant", "toggle", value5);
        }
      } catch (error) {
        fn();
        throw error;
      }
      return;
    }
    if (value.type === "more-info") {
      this.showActionPopup(component, value);
      return;
    }
    if (value.type === "navigate") {
      if (
        !value.target ||
        !this.document?.pages?.some((value5) => value5.path === value.target)
      ) {
        throw new Error("跳转的页面不存在。");
      }
      this.navigate(value.target);
    }
  }
  async callEntityService(domain, service, entityId, data = {}) {
    const response = await fetch("/api/v1/ha/services/call", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        domain: domain,
        service: service,
        entityId: entityId,
        data: data,
      }),
      hbLogContext: {
        entityId: entityId,
        service: domain + "." + service,
        phase: "device-control",
      },
    });
    if (!response.ok) {
      const value = await response.json().catch(() => ({}));
      const value2 = new Error(
        typeof value.detail == "string"
          ? value.detail
          : value.detail?.message || "实体操作失败。",
      );
      throw window.HABridgeLog?.linkError(value2, response) || value2;
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
        entityId: entityId,
        mediaContentId: mediaContentId,
        mediaContentType: mediaContentType,
      }),
    });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(value.detail || "媒体目录读取失败。");
    }
    return value.result || {};
  }
  createMediaBrowserControl(value, { preview: value2 = false } = {}) {
    const root = document.createElement("section");
    root.className = "hb-media-browser";
    const element = document.createElement("button");
    element.type = "button";
    element.className = "hb-media-browser-trigger";
    element.innerHTML = '<span aria-hidden="true"></span>';
    element.setAttribute("aria-label", "选择本地媒体");
    element.setAttribute("title", "选择本地媒体");
    element.setAttribute("aria-expanded", "false");
    element.disabled = value2;
    const panel = document.createElement("div");
    panel.className = "hb-media-browser-panel";
    panel.hidden = true;
    const value3 = document.createElement("div");
    value3.className = "hb-media-browser-toolbar";
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
    value3.append(element2, element3, element4, element5);
    const value4 = document.createElement("div");
    value4.className = "hb-media-browser-list";
    panel.append(value3, value4);
    root.append(element);
    let id = "media-source://";
    let type = "";
    let value5 = [];
    let value6 = false;
    let value7 = false;
    const fn = (value8 = "") => {
      element4.textContent = value8;
    };
    const fn2 = () => {
      panel.hidden = true;
      element.setAttribute("aria-expanded", "false");
    };
    const fn3 = (value8) => {
      value6 = !!value8;
      element.disabled = value2 || value6 || !value7;
      element2.disabled = value6;
      value4.querySelectorAll("button").forEach((value9) => {
        value9.disabled = value6;
      });
    };
    const fn4 = (value8) =>
      String(
        value8?.title ||
          value8?.name ||
          value8?.media_content_id ||
          "未命名媒体",
      );
    const fn5 = async (
      value8,
      value9 = "",
      { pushHistory: value10 = true } = {},
    ) => {
      if (!value6 && !value2 && !!value7) {
        fn3(true);
        fn("读取中…");
        try {
          const value11 = await this.browseMedia(value, value8, value9);
          if (value10 && id !== value8) {
            value5.push({
              id: id,
              type: type,
              title: element3.textContent,
            });
          }
          id = value8;
          type = value9 || "";
          element3.textContent = fn4(value11) || "媒体库";
          element2.hidden = value5.length === 0;
          value4.replaceChildren();
          const list = Array.isArray(value11?.children) ? value11.children : [];
          if (!list.length) {
            const element6 = document.createElement("p");
            element6.className = "hb-media-browser-empty";
            element6.textContent = "此处没有可播放的媒体。";
            value4.append(element6);
          }
          list.forEach((value12) => {
            const value13 = document.createElement("div");
            value13.className = "hb-media-browser-item";
            const element6 = document.createElement("span");
            element6.className = "hb-media-browser-item-title";
            element6.textContent = fn4(value12);
            const element7 = document.createElement("button");
            element7.type = "button";
            const value14 = !!value12?.can_expand || !!value12?.children;
            const value15 = !!value12?.can_play;
            element7.textContent = value14 ? "打开" : "播放";
            element7.disabled = !value14 && !value15;
            element7.addEventListener("click", async () => {
              if (value14) {
                await fn5(
                  value12.media_content_id,
                  value12.media_content_type || "",
                  {
                    pushHistory: true,
                  },
                );
                return;
              }
              if (!!value15 && !value6) {
                fn3(true);
                fn("发送播放…");
                try {
                  await this.callEntityService(
                    "media_player",
                    "play_media",
                    value,
                    {
                      media_content_id: value12.media_content_id,
                      media_content_type: value12.media_content_type || "music",
                    },
                  );
                  fn("已发送播放");
                } catch (error) {
                  fn(error.message || "播放失败");
                  this.options.onError?.(error);
                } finally {
                  fn3(false);
                }
              }
            });
            value13.append(element6, element7);
            value4.append(value13);
          });
          panel.hidden = false;
          element.setAttribute("aria-expanded", "true");
          fn(list.length ? list.length + " 项" : "");
        } catch (error) {
          const text = String(error?.message || "媒体目录读取失败");
          fn(
            text.includes("Media directory does not exist")
              ? "此目录暂无媒体"
              : text,
          );
          value4.replaceChildren();
          const element6 = document.createElement("p");
          element6.className = "hb-media-browser-empty";
          element6.textContent = text.includes("Media directory does not exist")
            ? "此目录暂无可用媒体。"
            : text;
          value4.append(element6);
          panel.hidden = false;
          element.setAttribute("aria-expanded", "true");
        } finally {
          fn3(false);
        }
      }
    };
    element.addEventListener("click", () => {
      if (!panel.hidden) {
        fn2();
        return;
      }
      fn5(id, type, {
        pushHistory: false,
      });
    });
    element5.addEventListener("click", fn2);
    element2.addEventListener("click", async () => {
      const value8 = value5.pop();
      if (value8) {
        await fn5(value8.id, value8.type, {
          pushHistory: false,
        });
        element3.textContent = value8.title || "媒体库";
        element2.hidden = value5.length === 0;
      }
    });
    return {
      root: root,
      panel: panel,
      sync: (sync) => {
        value7 = !!(Number(sync?.attributes?.supported_features || 0) & 512);
        root.hidden = !value7;
        if (!value7) {
          fn2();
        }
        element.disabled = value2 || value6 || !value7;
      },
      cleanup: () => {
        root.remove();
        panel.remove();
      },
    };
  }
  registerRuntimeDialogScale(dialogLayer, dialog, value, value2) {
    const value3 = runtimeDialogUsesStableMotion();
    dialogLayer.classList.toggle("hb-runtime-stable-motion", value3);
    dialogLayer.classList.toggle(
      "hb-runtime-simplified-motion",
      value3 && dialog.classList.contains("hb-custom-popup-dialog"),
    );
    const value4 = {
      dialogLayer: dialogLayer,
      dialog: dialog,
      designWidth: Math.max(1, Number(value) || 1),
      designHeight: Math.max(1, Number(value2) || 1),
      fillAvailable:
        dialog.dataset.runtimeDialogLayout === "fill" ||
        dialog.classList.contains("media-player-details"),
      tightFill: dialog.classList.contains("media-player-details"),
      targetOccupancy:
        dialog.dataset.runtimeDialogLayout === "compact" ? ss : cn,
      measureFrame: 0,
      layoutObserver: null,
      entranceAnimations: [],
    };
    this.runtimeDialogScaleContext = value4;
    dialog.classList.add("hb-runtime-scaled-dialog");
    dialog.style.width = value4.designWidth + "px";
    dialog.style.minWidth = value4.designWidth + "px";
    dialog.style.maxWidth = "none";
    dialog.style.height = "auto";
    dialog.style.minHeight = "0";
    dialog.style.maxHeight = "none";
    dialog.style.boxSizing = "border-box";
    dialog.style.setProperty(
      "--hb-runtime-dialog-design-height",
      value4.designHeight + "px",
    );
    const element = dialog.querySelector(":scope > .hb-custom-popup-card");
    if (element) {
      element.style.width = value4.designWidth + "px";
      element.style.minWidth = value4.designWidth + "px";
      element.style.maxWidth = "none";
    }
    this.updateRuntimeDialogScale();
    value4.measureFrame = window.requestAnimationFrame(() => {
      value4.measureFrame = 0;
      if (this.runtimeDialogScaleContext === value4) {
        this.updateRuntimeDialogScale();
        if (dialog.open) {
          value4.entranceAnimations = playStableRuntimeDialogEntrance(
            dialogLayer,
            dialog,
          );
        }
      }
    });
    value4.layoutObserver = new ResizeObserver(() => {
      if (this.runtimeDialogScaleContext === value4 && !value4.measureFrame) {
        value4.measureFrame = window.requestAnimationFrame(() => {
          value4.measureFrame = 0;
          if (this.runtimeDialogScaleContext === value4) {
            this.updateRuntimeDialogScale();
          }
        });
      }
    });
    value4.layoutObserver.observe(dialog);
    if (element) {
      value4.layoutObserver.observe(element);
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
    const value = runtimeDialogScaleContext.dialogLayer.getBoundingClientRect();
    const value2 = this.viewport?.getBoundingClientRect();
    const value3 = runtimeDialogViewport({
      layerLeft: value.left,
      layerTop: value.top,
      layerWidth:
        value.width ||
        runtimeDialogScaleContext.dialogLayer.clientWidth ||
        this.container.clientWidth,
      layerHeight:
        value.height ||
        runtimeDialogScaleContext.dialogLayer.clientHeight ||
        this.container.clientHeight,
      dashboardLeft: value2?.left,
      dashboardTop: value2?.top,
      dashboardWidth: value2?.width,
      dashboardHeight: value2?.height,
    });
    const layerWidth = value3.width;
    const layerHeight = value3.height;
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
    const value4 = runtimeDialogLayout({
      layerWidth: layerWidth,
      layerHeight: layerHeight,
      layoutWidth: layoutWidth,
      layoutHeight: layoutHeight,
      fillAvailable: runtimeDialogScaleContext.fillAvailable,
      tightFill: runtimeDialogScaleContext.tightFill,
      targetOccupancy: runtimeDialogScaleContext.targetOccupancy,
    });
    const scale = value4.scale;
    runtimeDialogScaleContext.dialog.style.position = "absolute";
    runtimeDialogScaleContext.dialog.style.inset = "auto";
    runtimeDialogScaleContext.dialog.style.top = value3.centerY + "px";
    runtimeDialogScaleContext.dialog.style.left = value3.centerX + "px";
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
      value4.safeInset.toFixed(2);
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportWidth = String(
      Math.round(value3.width),
    );
    runtimeDialogScaleContext.dialogLayer.dataset.dialogViewportHeight = String(
      Math.round(value3.height),
    );
  }
  clearRuntimeDialogScale(element) {
    if (this.runtimeDialogScaleContext?.dialog === element) {
      window.cancelAnimationFrame(
        this.runtimeDialogScaleContext.measureFrame || 0,
      );
      this.runtimeDialogScaleContext.layoutObserver?.disconnect();
      for (const value of this.runtimeDialogScaleContext.entranceAnimations ||
        []) {
        value.cancel();
      }
      element.classList.remove("hb-runtime-scaled-dialog");
      this.runtimeDialogScaleContext = null;
    }
  }
  closeRuntimeDialog(value = this.detailsDialog) {
    if (value) {
      if (value.open) {
        value.close();
      } else {
        value.dispatchEvent(new Event("close"));
      }
      if (value.isConnected) {
        value.remove();
      }
      if (this.detailsDialog === value) {
        this.detailsDialog = null;
      }
      if (this.detailsStateSync?.dialog === value) {
        this.detailsStateSync = null;
      }
    }
  }
  bindRuntimeDialogOutsideDismiss(value, value2, value3) {
    const value4 = performance.now() + 320;
    value.addEventListener("click", (event) => {
      if (!value3.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        if (!(performance.now() < value4)) {
          value2.close();
        }
      }
    });
  }
  showCameraPreview(component, { preview: value = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该摄像头控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const value2 = document.createElement("dialog");
    value2.className = "hb-camera-preview-dialog fit-media-ratio";
    value2.dataset.componentId = component.id || "";
    const value3 = document.createElement("div");
    value3.className = "hb-camera-preview-card";
    const value4 = document.createElement("div");
    value4.className = "hb-camera-preview-heading";
    const value5 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, "摄像头实时预览");
    const element2 = document.createElement("span");
    element2.className = "hb-camera-preview-status";
    element2.textContent = "正在连接";
    element2.classList.add("is-connecting");
    value5.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.setAttribute("aria-label", "关闭摄像头预览");
    element3.textContent = "×";
    value4.append(value5, element3);
    const element4 = document.createElement("section");
    element4.className = "hb-camera-device-visual";
    element4.setAttribute("aria-hidden", "true");
    const value6 = document.createElement("i");
    value6.className = "hb-camera-device-mount";
    const value7 = document.createElement("i");
    value7.className = "hb-camera-device-arm";
    const value8 = document.createElement("div");
    value8.className = "hb-camera-device-body";
    const value9 = document.createElement("i");
    value9.className = "hb-camera-device-lens";
    const value10 = document.createElement("i");
    value10.className = "hb-camera-device-led";
    value8.append(value9, value10);
    element4.append(value6, value7, value8);
    let value11 = 0;
    let value12 = null;
    let value13 = 0;
    const fn = (value23, value24 = 0) =>
      "translateX(-50%) perspective(260px) rotateY(" +
      value23 +
      "deg) rotateZ(" +
      value23 * 0.035 +
      "deg) translateY(" +
      value24 +
      "px)";
    const value14 = () => {
      if (!value8.isConnected) {
        return;
      }
      const value23 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(
        (value29) => Math.abs(value29 - value13) >= 7,
      );
      const value24 = value23[Math.floor(Math.random() * value23.length)] ?? 0;
      const value25 = Math.sign(value24 - value13) || 1;
      const value26 = Math.abs(value24 - value13);
      const duration = Math.round(430 + value26 * 18 + Math.random() * 320);
      const value27 = value24 + value25 * (1.4 + Math.random() * 2.2);
      const value28 = Math.random() * 1.4 - 0.7;
      value9.style.setProperty(
        "--hb-camera-lens-shift",
        (value24 / 23) * 2.5 + "px",
      );
      value12?.cancel();
      value12 = value8.animate(
        [
          {
            transform: fn(value13, 0),
            offset: 0,
          },
          {
            transform: fn(value27, value28),
            offset: 0.78,
          },
          {
            transform: fn(value24, value28 * 0.35),
            offset: 1,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(.2,.72,.22,1)",
          fill: "forwards",
        },
      );
      value12.addEventListener(
        "finish",
        () => {
          value13 = value24;
          value8.style.transform = fn(value13, value28 * 0.35);
          value12?.cancel();
          value12 = null;
          const value29 =
            Math.random() < 0.22
              ? 180 + Math.random() * 260
              : 680 + Math.random() * 1500;
          value11 = window.setTimeout(value14, value29);
        },
        {
          once: true,
        },
      );
    };
    if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      value11 = window.setTimeout(value14, 620);
    }
    const container = document.createElement("div");
    container.className = "hb-camera-preview-stage";
    container.classList.add("is-connecting");
    const value15 = document.createElement("i");
    value15.className = "hb-camera-preview-reveal-veil";
    value15.setAttribute("aria-hidden", "true");
    const value16 = document.createElement("i");
    value16.className = "hb-camera-preview-scan-line";
    value16.setAttribute("aria-hidden", "true");
    container.append(value15, value16);
    const value17 = false;
    const value18 = component.properties?.mediaVisible !== false;
    container.classList.toggle("is-16-9", !value17);
    container.classList.toggle("media-hidden", !value18);
    const value19 = [];
    let value20 = false;
    const onReady = () => {
      if (!value20) {
        value20 = true;
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
    let value21 = value17 ? 4 / 3 : 16 / 9;
    const fn2 = () => {
      const count = Math.max(280, this.container.clientWidth - 32);
      const count2 = Math.max(
        180,
        Math.min(625, this.container.clientHeight - 88),
      );
      const value23 = Math.min(760, count, count2 * value21);
      const value24 = value23 / value21;
      value2.style.width = Math.max(280, value23) + "px";
      container.style.aspectRatio = String(value21);
      container.style.borderRadius = "16px";
    };
    if (value18 && !value) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "正在载入摄像头实时预览";
      container.append(placeholder);
      const value23 = mountCameraMedia({
        container: container,
        entityId: entityId,
        label: element.textContent,
        objectFit: "fill",
        placeholder: placeholder,
        onReady: onReady,
        onUnavailable: onUnavailable,
        cleanup: (cleanup) => value19.push(cleanup),
      });
      const fn3 = (value26, value27) => {
        if (!!value17 && !!value26 && !!value27) {
          value21 = value26 / value27;
          fn2();
        }
      };
      const value24 = () =>
        fn3(value23.video.videoWidth, value23.video.videoHeight);
      const value25 = () =>
        fn3(value23.image.naturalWidth, value23.image.naturalHeight);
      value23.video.addEventListener("loadedmetadata", value24);
      value23.image.addEventListener("load", value25);
      value19.push(() =>
        value23.video.removeEventListener("loadedmetadata", value24),
      );
      value19.push(() => value23.image.removeEventListener("load", value25));
    } else if (value) {
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
    window.addEventListener("resize", fn2);
    value19.push(() => window.removeEventListener("resize", fn2));
    fn2();
    value3.append(value4, element4, container);
    value2.append(value3);
    const value22 = document.createElement("div");
    value22.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value22.tabIndex = -1;
    value22.append(value2);
    this.container.append(value22);
    this.detailsDialog = value2;
    this.registerRuntimeDialogScale(value22, value2, 760, 680);
    element3.addEventListener("click", () => value2.close());
    this.bindRuntimeDialogOutsideDismiss(value22, value2, value3);
    value22.addEventListener("keydown", (value23) => {
      if (value23.key === "Escape") {
        value2.close();
      }
    });
    value2.addEventListener(
      "close",
      () => {
        window.clearTimeout(value11);
        value12?.cancel();
        for (const fn3 of value19.splice(0)) {
          fn3();
        }
        this.clearRuntimeDialogScale(value2);
        if (this.detailsDialog === value2) {
          this.detailsDialog = null;
        }
        value22.remove();
      },
      {
        once: true,
      },
    );
    value2.show();
  }
  createCapabilityDetailsControls(
    entityId,
    value,
    {
      interactive = true,
      variant: value2 = "",
      selectLabel: value3 = "模式",
    } = {},
  ) {
    const value4 = document.createElement("section");
    value4.className =
      "hb-capability-details-controls" +
      (value2 ? " hb-capability-details-controls--" + value2 : "");
    value4.inert = !interactive;
    const value5 = String(entityId || "").split(".", 1)[0];
    let value6 = value || {
      entityId: entityId,
      state: "unknown",
      attributes: {},
    };
    const value7 =
      value5 === "fan"
        ? resolveClimateDeviceType(
            {
              properties: {},
            },
            value6,
            entityId,
          )
        : "generic";
    const value8 = {
      entityId: entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations,
    };
    const fn = () => value6?.attributes || {};
    const fn2 = () =>
      ["unknown", "unavailable"].includes(
        String(value6?.state || "").toLowerCase(),
      );
    const value9 = [];
    const value10 = ["fan", "switch", "input_boolean"].includes(value5);
    const value11 = dn({
      label: "电源",
      interactive: interactive,
      compact: value2 === "air-purifier",
      onToggle: async () => {
        if (!interactive || fn2()) {
          return;
        }
        const onToggle = String(value6?.state || "").toLowerCase() === "off";
        const onToggle2 = value6;
        value6 = {
          ...value6,
          state: onToggle ? "on" : "off",
        };
        fn4(value6);
        try {
          await this.callEntityService(
            value5 === "fan" ? "fan" : "homeassistant",
            value5 === "fan" ? (onToggle ? "turn_on" : "turn_off") : "toggle",
            entityId,
          );
        } catch (error) {
          value6 = onToggle2;
          fn4(onToggle2);
          this.options.onError?.(error);
        }
      },
    });
    value11.visual.classList.add("hb-capability-power");
    if (value10) {
      value4.append(value11.visual);
    }
    const fn3 = (
      value12,
      value13,
      value14,
      service,
      dataKey,
      value15 = value5,
    ) => {
      const value16 = [
        ...new Set(
          (value13 || [])
            .map((value19) => String(value19 ?? "").trim())
            .filter(Boolean),
        ),
      ];
      if (
        !value16.length &&
        (!["electric-bed", "electric-bed-memory"].includes(value2) ||
          value5 !== "select")
      ) {
        return;
      }
      const value17 = document.createElement("section");
      value17.className = "hb-capability-option-group";
      const element = document.createElement("strong");
      element.textContent = value12;
      const value18 = document.createElement("div");
      value18.className = "hb-capability-options";
      if (
        ["electric-bed", "electric-bed-memory"].includes(value2) &&
        value5 === "select"
      ) {
        const value19 = document.createElement("div");
        value19.className = "hb-electric-bed-select";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "hb-electric-bed-select-trigger";
        trigger.setAttribute("aria-label", value12);
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");
        const element2 = document.createElement("span");
        const value20 = document.createElement("i");
        value20.setAttribute("aria-hidden", "true");
        trigger.append(element2, value20);
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
        let value21 = false;
        const fn5 = () => {
          try {
            return menu.matches(":popover-open");
          } catch {
            return menu.dataset.open === "true";
          }
        };
        const fn6 = () => {
          if (!fn5() && menu.hidden) {
            return;
          }
          const value22 = trigger.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const value23 = Math.min(
            Math.max(value22.width, 150),
            Math.max(150, innerWidth - 20),
          );
          menu.style.width = value23 + "px";
          menu.style.maxHeight =
            Math.min(306, Math.max(96, innerHeight - 20)) + "px";
          const value24 = Math.min(menu.scrollHeight || 0, 306);
          const value25 = innerHeight - value22.bottom - 10;
          const value26 = value22.top - 10;
          const value27 =
            value25 < Math.min(value24, 160) && value26 > value25
              ? Math.max(10, value22.top - value24 - 5)
              : Math.min(innerHeight - value24 - 10, value22.bottom + 5);
          menu.style.left =
            Math.max(10, Math.min(value22.left, innerWidth - value23 - 10)) +
            "px";
          menu.style.top = Math.max(10, value27) + "px";
        };
        const closeMenu = () => {
          if (fn5() && typeof menu.hidePopover == "function") {
            menu.hidePopover();
          }
          menu.hidden = true;
          menu.dataset.open = "false";
          trigger.setAttribute("aria-expanded", "false");
        };
        const fn7 = (value22 = false) => {
          if (!trigger.disabled) {
            menu.hidden = false;
            if (typeof menu.showPopover == "function") {
              menu.showPopover();
            } else {
              menu.dataset.open = "true";
            }
            trigger.setAttribute("aria-expanded", "true");
            fn6();
            if (value22) {
              (
                menu.querySelector('[aria-selected="true"]') ||
                menu.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const fn8 = async (value22) => {
          if (!interactive || value21 || !value22 || fn2()) {
            return;
          }
          const value23 = value6;
          value21 = true;
          closeMenu();
          value6 = {
            ...value6,
            state: service === "select_option" ? value22 : value6.state,
            attributes: {
              ...fn(),
              [dataKey]: value22,
            },
          };
          fn4(value6);
          try {
            await this.callEntityService(value15, service, entityId, {
              [dataKey]: value22,
            });
          } catch (error) {
            value6 = value23;
            fn4(value23);
            this.options.onError?.(error);
          } finally {
            value21 = false;
            fn4(value6);
          }
        };
        const renderOptions = (value22, value23) => {
          menu.replaceChildren(
            ...value22.map((value25) => {
              const element3 = document.createElement("button");
              element3.type = "button";
              element3.className = "hb-electric-bed-select-option";
              element3.setAttribute("role", "option");
              element3.dataset.value = value25;
              element3.textContent = value25;
              const value26 = value25 === String(value23 ?? "");
              element3.classList.toggle("active", value26);
              element3.setAttribute("aria-selected", String(value26));
              element3.addEventListener("click", () => fn8(value25));
              return element3;
            }),
          );
          const value24 = value22.includes(String(value23 ?? ""))
            ? String(value23)
            : value22[0] || "读取中…";
          element2.textContent = value24;
          element2.title = value24;
        };
        trigger.addEventListener("click", () => {
          if (fn5() || menu.dataset.open === "true") {
            closeMenu();
          } else {
            fn7();
          }
        });
        trigger.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            fn7(true);
          }
        });
        menu.addEventListener("keydown", (event) => {
          const value22 = [...menu.querySelectorAll('[role="option"]')];
          const value23 = value22.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
            trigger.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const value24 = event.key === "ArrowDown" ? 1 : -1;
            value22[
              (value23 + value24 + value22.length) % value22.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        menu.addEventListener("toggle", (value22) => {
          const value23 = value22.newState === "open";
          menu.hidden = !value23;
          menu.dataset.open = String(value23);
          trigger.setAttribute("aria-expanded", String(value23));
          if (value23) {
            fn6();
          }
        });
        value19.append(trigger, menu);
        value17.append(element, value19);
        value4.append(value17);
        value9.push({
          type: "bed-select",
          service: service,
          dataKey: dataKey,
          trigger: trigger,
          menu: menu,
          renderOptions: renderOptions,
          closeMenu: closeMenu,
          isPending: () => value21,
        });
        return;
      }
      const buttons = [];
      for (const value19 of value16) {
        const element2 = document.createElement("button");
        element2.type = "button";
        const value20 = {
          auto: "自动",
          sleep: "睡眠",
          favorite: "喜爱",
          none: "标准",
          manual: "手动",
          silent: "静音",
        };
        element2.textContent =
          value2 === "air-purifier" && value12 === "运行模式"
            ? value20[value19.toLowerCase()] || value19
            : value5 === "fan" &&
                value7 === "bath-heater" &&
                value12 === "运行模式"
              ? climateModeLabel(value19, "bath-heater", value8)
              : value19;
        element2.dataset.value = value19;
        element2.classList.toggle("active", value19 === String(value14 ?? ""));
        element2.addEventListener("click", async () => {
          if (!interactive) {
            return;
          }
          buttons.forEach((value22) => {
            value22.disabled = true;
          });
          const value21 = value6;
          value6 = {
            ...value6,
            state: service === "select_option" ? value19 : value6.state,
            attributes: {
              ...fn(),
              [dataKey]: value19,
            },
          };
          fn4(value6);
          try {
            await this.callEntityService(value15, service, entityId, {
              [dataKey]: value19,
            });
          } catch (error) {
            value6 = value21;
            fn4(value21);
            this.options.onError?.(error);
          } finally {
            buttons.forEach((value22) => {
              value22.disabled = false;
            });
          }
        });
        buttons.push(element2);
        value18.append(element2);
      }
      value17.append(element, value18);
      value4.append(value17);
      value9.push({
        type: "options",
        service: service,
        dataKey: dataKey,
        buttons: buttons,
      });
    };
    const numeric = Number(fn().percentage);
    if (value5 === "fan" && Number.isFinite(numeric)) {
      if (value2 === "air-purifier") {
        const value12 = document.createElement("section");
        value12.className =
          "hb-capability-option-group hb-air-purifier-speed-group";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const value13 = document.createElement("div");
        value13.className =
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
            if (!interactive || fn2()) {
              return;
            }
            buttons.forEach((value15) => {
              value15.disabled = true;
            });
            const value14 = value6;
            value6 = {
              ...value6,
              attributes: {
                ...fn(),
                percentage: element2.value,
              },
            };
            fn4(value6);
            try {
              await this.callEntityService("fan", "set_percentage", entityId, {
                percentage: element2.value,
              });
            } catch (error) {
              value6 = value14;
              fn4(value14);
              this.options.onError?.(error);
            } finally {
              buttons.forEach((value15) => {
                value15.disabled = false;
              });
            }
          });
          value13.append(element3);
          return element3;
        });
        value12.append(element, value13);
        value4.append(value12);
        value9.push({
          type: "percentage-options",
          buttons: buttons,
        });
      } else {
        const value12 = document.createElement("section");
        value12.className = "hb-capability-range-group";
        const value13 = document.createElement("div");
        value13.className = "hb-capability-range-heading";
        const element = document.createElement("strong");
        element.textContent = "风速";
        const output = document.createElement("output");
        value13.append(element, output);
        const input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = "100";
        input.step = "1";
        input.value = String(numeric);
        input.addEventListener("change", async () => {
          if (!interactive || fn2()) {
            return;
          }
          input.disabled = true;
          const value14 = value6;
          const percentage = Number(input.value);
          value6 = {
            ...value6,
            attributes: {
              ...fn(),
              percentage: percentage,
            },
          };
          fn4(value6);
          try {
            await this.callEntityService("fan", "set_percentage", entityId, {
              percentage: percentage,
            });
          } catch (error) {
            value6 = value14;
            fn4(value14);
            this.options.onError?.(error);
          } finally {
            input.disabled = false;
          }
        });
        value12.append(value13, input);
        value4.append(value12);
        value9.push({
          type: "range",
          input: input,
          output: output,
          dataKey: "percentage",
        });
      }
    }
    if (value5 === "fan") {
      fn3(
        "运行模式",
        fn().preset_modes,
        fn().preset_mode,
        "set_preset_mode",
        "preset_mode",
      );
    }
    if (value5 === "select") {
      fn3(
        value3,
        fn().options,
        value6?.state,
        "select_option",
        "option",
        "select",
      );
    }
    if (["number", "input_number"].includes(value5)) {
      const value12 = Number.isFinite(Number(fn().min)) ? Number(fn().min) : 0;
      const value13 = Number.isFinite(Number(fn().max))
        ? Number(fn().max)
        : 100;
      const value14 =
        Number.isFinite(Number(fn().step)) && Number(fn().step) > 0
          ? Number(fn().step)
          : 1;
      const value15 = document.createElement("section");
      value15.className = "hb-capability-range-group";
      const value16 = document.createElement("div");
      value16.className = "hb-capability-range-heading";
      const element = document.createElement("strong");
      element.textContent = fn().unit_of_measurement
        ? "数值（" + fn().unit_of_measurement + "）"
        : "数值";
      const output = document.createElement("output");
      value16.append(element, output);
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(value12);
      input.max = String(value13);
      input.step = String(value14);
      input.value = String(Number(value6?.state) || value12);
      input.addEventListener("change", async () => {
        if (!interactive || fn2()) {
          return;
        }
        input.disabled = true;
        const value17 = value6;
        const value18 = Number(input.value);
        value6 = {
          ...value6,
          state: String(value18),
        };
        fn4(value6);
        try {
          await this.callEntityService(value5, "set_value", entityId, {
            value: value18,
          });
        } catch (error) {
          value6 = value17;
          fn4(value17);
          this.options.onError?.(error);
        } finally {
          input.disabled = false;
        }
      });
      value15.append(value16, input);
      value4.append(value15);
      value9.push({
        type: "range",
        input: input,
        output: output,
        dataKey: "state",
      });
    }
    function fn4(value12) {
      value6 = value12 || value6;
      const value13 = String(value6?.state || "").toLowerCase();
      const value14 =
        value5 === "fan"
          ? !["off", "unknown", "unavailable"].includes(value13)
          : value13 === "on";
      const value15 = value2 !== "air-purifier" || value14;
      if (value10) {
        value11.sync(value14, {
          unavailable: fn2(),
        });
      }
      for (const value16 of value9) {
        if (value16.type === "options") {
          const value17 =
            value16.service === "select_option"
              ? value6?.state
              : fn()[value16.dataKey];
          value16.buttons.forEach((element) =>
            element.classList.toggle(
              "active",
              value15 && element.dataset.value === String(value17 ?? ""),
            ),
          );
        } else if (value16.type === "bed-select") {
          const value17 = [
            ...new Set(
              (fn().options || [])
                .map((value19) => String(value19 ?? "").trim())
                .filter(Boolean),
            ),
          ];
          const value18 =
            value16.service === "select_option"
              ? value6?.state
              : fn()[value16.dataKey];
          value16.renderOptions(value17, value18);
          value16.trigger.disabled =
            !interactive || value16.isPending() || !value17.length || fn2();
          if (value16.trigger.disabled) {
            value16.closeMenu();
          }
        } else if (value16.type === "select") {
          const value17 = [
            ...new Set(
              (fn().options || [])
                .map((value19) => String(value19 ?? "").trim())
                .filter(Boolean),
            ),
          ];
          if (value17.length) {
            const value19 = [...value16.input.options].map(
              (element) => element.value,
            );
            if (
              value19.length !== value17.length ||
              value19.some((value20, value21) => value20 !== value17[value21])
            ) {
              value16.input.replaceChildren(
                ...value17.map((value20) => {
                  const element = document.createElement("option");
                  element.value = value20;
                  element.textContent = value20;
                  return element;
                }),
              );
            }
          }
          const value18 =
            value16.service === "select_option"
              ? value6?.state
              : fn()[value16.dataKey];
          if (
            value18 != null &&
            [...value16.input.options].some(
              (element) => element.value === String(value18),
            )
          ) {
            value16.input.value = String(value18);
          }
          value16.input.disabled = !interactive || !value17.length || fn2();
        } else if (value16.type === "percentage-options") {
          const numeric2 = Number(fn().percentage);
          const value17 =
            numeric2 <= 0 || !Number.isFinite(numeric2)
              ? 0
              : numeric2 <= 49
                ? 33
                : numeric2 <= 82
                  ? 66
                  : 100;
          value16.buttons.forEach((element) =>
            element.classList.toggle(
              "active",
              value15 && Number(element.dataset.percentage) === value17,
            ),
          );
        } else {
          if (["number", "input_number"].includes(value5)) {
            const value18 = Number.isFinite(Number(fn().min))
              ? Number(fn().min)
              : 0;
            const value19 = Number.isFinite(Number(fn().max))
              ? Number(fn().max)
              : 100;
            const value20 =
              Number.isFinite(Number(fn().step)) && Number(fn().step) > 0
                ? Number(fn().step)
                : 1;
            value16.input.min = String(value18);
            value16.input.max = String(value19);
            value16.input.step = String(value20);
          }
          const value17 =
            value16.dataKey === "state"
              ? Number(value6?.state)
              : Number(fn()[value16.dataKey]);
          if (Number.isFinite(value17)) {
            value16.input.value = String(value17);
          }
          value16.output.textContent = Number.isFinite(value17)
            ? "" + value17 + (fn().unit_of_measurement || "%")
            : "--";
        }
      }
    }
    value4.syncCapabilityState = fn4;
    value4.cleanupCapabilityDetails = () => {
      for (const value12 of value9) {
        value12.closeMenu?.();
      }
    };
    fn4(value6);
    return value4;
  }
  showCapabilityDetails(
    component,
    { preview: value = false, title: value2 = "" } = {},
  ) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const value3 = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId: entityId,
        state: "unknown",
        attributes: {},
      };
    const value4 = this.deviceProfile(entityId);
    const value5 = value4?.deviceType === "air-purifier";
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog capability-details" +
      (value5 ? " air-purifier-details" : "");
    const value6 = document.createElement("div");
    value6.className = "hb-entity-details-card";
    const value7 = document.createElement("div");
    value7.className = "hb-entity-details-heading";
    const value8 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent =
      value2 ||
      component.properties?.label ||
      value3.attributes?.friendly_name ||
      entityId;
    const element2 = document.createElement("span");
    element2.textContent =
      value3.state === "unavailable" ? "当前不可用" : "设备控制";
    value8.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭弹窗");
    value7.append(value8, element3);
    const value9 = document.createElement("div");
    value9.className = "hb-capability-details-body";
    const value10 = this.createCapabilityDetailsControls(entityId, value3, {
      interactive: !value,
      variant: value5 ? "air-purifier" : "",
    });
    value9.append(value10);
    value6.append(value7, value9);
    dialog.append(value6);
    const value11 = {
      pm25: "PM2.5",
      airQuality: "空气质量",
      temperature: "温度",
      humidity: "湿度",
      filterLife: "滤芯寿命",
    };
    const value12 = value5
      ? ["pm25", "airQuality", "temperature", "humidity", "filterLife"]
          .map((role) => ({
            role: role,
            id: value4.roles?.[role],
          }))
          .filter(({ id: value16 }) => value16)
          .map(({ role: role, id: value16 }) => ({
            role: role,
            item: this.entityMetadata.get(value16),
          }))
          .filter(
            ({ item: value16 }) =>
              ["sensor", "binary_sensor"].includes(value16?.domain) &&
              entityMetadataIsAvailable(value16),
          )
          .slice(0, 5)
      : [];
    const index = new Map();
    if (value12.length) {
      const value16 = document.createElement("div");
      value16.className = "hb-capability-metrics";
      for (const { role: value17, item: value18 } of value12) {
        const value19 = document.createElement("div");
        value19.className =
          "hb-capability-metric hb-capability-metric--" + value17;
        const element4 = document.createElement("small");
        element4.textContent =
          value11[value17] ||
          value18.name ||
          value18.originalName ||
          value18.entityId;
        const value20 = document.createElement("strong");
        value19.append(element4, value20);
        value16.append(value19);
        index.set(value18.entityId, value20);
      }
      value9.prepend(value16);
    }
    const value14 = document.createElement("div");
    value14.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value14.tabIndex = -1;
    value14.append(dialog);
    this.container.append(value14);
    this.detailsDialog = dialog;
    const value15 = (value16) => {
      value10.syncCapabilityState?.(value16);
      element2.textContent = ["unknown", "unavailable"].includes(
        String(value16?.state || "").toLowerCase(),
      )
        ? "当前不可用"
        : "设备控制";
    };
    const handlers = new Map([[entityId, [value15]]]);
    for (const { item: value16 } of value12) {
      const fn = (value17) => {
        const element4 = index.get(value16.entityId);
        if (element4) {
          element4.textContent =
            value17?.state === "unknown" || value17?.state === "unavailable"
              ? "--"
              : (
                  (value17?.state ?? "--") +
                  " " +
                  (value17?.attributes?.unit_of_measurement || "")
                ).trim();
        }
      };
      fn(
        this.states.get(value16.entityId)?.newState ||
          this.states.get(value16.entityId),
      );
      handlers.set(value16.entityId, [fn]);
    }
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
    };
    this.registerRuntimeDialogScale(
      value14,
      dialog,
      value5 ? 620 : 560,
      value5 ? 560 : 500,
    );
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value14, dialog, value6);
    value14.addEventListener("keydown", (value16) => {
      if (value16.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        value10.cleanupCapabilityDetails?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value14.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showAirPurifierDetails(
    component,
    { preview: value = false, title: value2 = "" } = {},
  ) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该控件没有关联实体。");
    }
    this.closeRuntimeDialog();
    const value3 = this.deviceProfile(entityId);
    const value4 = selectedRelatedEntityIds(component);
    let value5 = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId: entityId,
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog air-purifier-details capability-details";
    const value6 = document.createElement("div");
    value6.className = "hb-entity-details-card";
    const value7 = document.createElement("div");
    value7.className = "hb-entity-details-heading";
    const value8 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent =
      value2 ||
      componentDialogTitle(
        component,
        value5.attributes?.friendly_name || "空气净化器",
      );
    const element2 = document.createElement("span");
    value8.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.className = "hb-air-purifier-visual";
    element3.inert = value;
    element3.setAttribute("aria-label", "切换空气净化器电源");
    const value9 = document.createElement("i");
    value9.className = "hb-air-purifier-visual-aura";
    const value10 = document.createElement("span");
    value10.className = "hb-air-purifier-visual-airflow";
    for (let value36 = 0; value36 < 4; value36 += 1) {
      value10.append(document.createElement("i"));
    }
    const value11 = document.createElement("span");
    value11.className = "hb-air-purifier-visual-body";
    const value12 = document.createElement("i");
    value12.className = "hb-air-purifier-visual-top";
    const value13 = document.createElement("i");
    value13.className = "hb-air-purifier-visual-vent";
    const value14 = document.createElement("span");
    value14.className = "hb-air-purifier-visual-display";
    const element4 = document.createElement("strong");
    value14.append(element4);
    value11.append(value12, value13, value14);
    element3.append(value9, value10, value11);
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.textContent = "×";
    element5.setAttribute("aria-label", "关闭弹窗");
    value7.append(value8, element3, element5);
    const value15 = document.createElement("div");
    value15.className = "hb-air-purifier-layout";
    const value16 = document.createElement("section");
    value16.className = "hb-air-purifier-summary";
    const value17 = document.createElement("div");
    value17.className = "hb-air-purifier-gauge-wrap";
    const element6 = document.createElement("div");
    element6.className = "hb-air-purifier-gauge is-quality";
    const element7 = document.createElement("i");
    element7.className = "hb-air-purifier-gauge-orbit";
    const value18 = document.createElement("i");
    value18.className = "hb-air-purifier-arc-cap start";
    const value19 = document.createElement("i");
    value19.className = "hb-air-purifier-arc-cap end";
    const value20 = document.createElement("div");
    value20.className = "hb-air-purifier-gauge-content";
    const element8 = document.createElement("small");
    element8.textContent = "室内空气质量";
    const value21 = document.createElement("strong");
    const element9 = document.createElement("span");
    const element10 = document.createElement("small");
    element10.textContent = "";
    const element11 = document.createElement("span");
    element11.textContent = "设备状态 --";
    value21.append(element9, element10);
    value20.append(element8, value21, element11);
    element6.append(value18, value19, value20);
    value17.append(element7, element6);
    const value22 = document.createElement("div");
    value22.className = "hb-air-purifier-secondary-metrics";
    value16.append(value17, value22);
    const value23 = this.createCapabilityDetailsControls(entityId, value5, {
      interactive: !value,
      variant: "air-purifier",
    });
    const value24 = document.createElement("section");
    value24.className = "hb-air-purifier-controls-pane";
    value24.append(value23);
    value15.append(value16, value24);
    value6.append(value7, value15);
    dialog.append(value6);
    const value25 = [
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
      .map((value36) => ({
        ...value36,
        candidates: value36.roles
          .map((role) => ({
            role: role,
            id: value3?.roles?.[role],
          }))
          .filter(
            ({ id: value37 }, value38, value39) =>
              value37 &&
              value39.findIndex((value40) => value40.id === value37) ===
                value38,
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
      .filter(({ candidates: value36 }) => value36.length);
    const fn = (value36) => {
      const numeric = Number(value36?.state);
      if (
        ["unknown", "unavailable"].includes(
          String(value36?.state || "").toLowerCase(),
        ) ||
        !Number.isFinite(numeric)
      ) {
        return null;
      } else {
        return numeric;
      }
    };
    const fn2 = (value36) =>
      this.states.get(value36?.id)?.newState ||
      this.states.get(value36?.id) ||
      null;
    const fn3 = (value36) =>
      value36.candidates.find((value37) => fn(fn2(value37)) != null) ||
      value36.candidates[0] ||
      null;
    const value26 = Array.from(
      {
        length: 3,
      },
      () => {
        const item = document.createElement("div");
        item.className = "hb-air-purifier-secondary-metric";
        const label = document.createElement("small");
        const value36 = document.createElement("strong");
        item.append(label, value36);
        value22.append(item);
        return {
          item: item,
          label: label,
          value: value36,
        };
      },
    );
    value22.hidden = true;
    const value27 = {
      pm25: "μg/m³",
      pm10: "μg/m³",
      hcho: "mg/m³",
      filterLife: "%",
      filterLeftTime: "h",
      temperature: "°C",
      humidity: "%",
    };
    const fn4 = (value36, value37) => {
      if (
        ["unknown", "unavailable"].includes(
          String(value36?.state || "").toLowerCase(),
        )
      ) {
        return "--";
      }
      const value38 = {
        hours: "小时",
        hour: "小时",
        days: "天",
        day: "天",
      };
      const value39 =
        value36?.attributes?.unit_of_measurement || value27[value37] || "";
      const value40 = value38[String(value39).toLowerCase()] || value39;
      return "" + (value36?.state ?? "--") + (value40 ? " " + value40 : "");
    };
    const handlers = new Map();
    const fn5 = (value36, value37) => {
      if (value36) {
        if (!handlers.has(value36)) {
          handlers.set(value36, []);
        }
        handlers.get(value36).push(value37);
      }
    };
    const value28 = value25.flatMap((value36) =>
      value36.candidates.map((value37) => value37.id),
    );
    const value29 = value3?.roles?.airQuality || "";
    const value30 =
      value4 !== null
        ? this.createWaterHeaterExtensionControls(entityId, {
            component: component,
            interactive: !value,
            excludedEntityIds: [...value28, ...(value29 ? [value29] : [])],
          })
        : null;
    if (value30) {
      value6.append(value30);
      dialog.classList.add("has-related-extensions");
      for (const [value36, value37] of value30.stateHandlers || []) {
        handlers.set(value36, value37);
      }
    }
    const value31 = {
      excellent: "空气优",
      good: "空气良",
      moderate: "一般",
      fair: "一般",
      poor: "较差",
      unhealthy: "较差",
      very_poor: "很差",
    };
    let value32 = value29
      ? this.states.get(value29)?.newState || this.states.get(value29)
      : null;
    let value33 = false;
    const value34 = value25.find((value36) => value36.key === "pm25");
    const fn6 = () => {
      const value36 = value34 ? fn3(value34) : null;
      const value37 = fn(fn2(value36));
      if (value37 == null) {
        return {
          text: "--",
          level: "unknown",
        };
      } else if (value37 <= 35) {
        return {
          text: "空气优",
          level: "excellent",
        };
      } else if (value37 <= 75) {
        return {
          text: "空气良",
          level: "good",
        };
      } else if (value37 <= 115) {
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
    const fn7 = () => {
      const value36 = String(value32?.state || "").trim();
      const value37 = value36.toLowerCase();
      let value38 = ["unknown", "unavailable", ""].includes(value37)
        ? ""
        : value31[value37] || value36;
      let value39 = "good";
      if (value38) {
        if (
          /very.?poor|severe|很差|重度|严重/.test(value37) ||
          /poor|unhealthy|较差|中度/.test(value37)
        ) {
          value39 = "poor";
        } else if (/moderate|fair|一般|轻度|污染/.test(value37)) {
          value39 = "warning";
        } else if (/excellent|优/.test(value37)) {
          value39 = "excellent";
        }
      } else {
        ({ text: value38, level: value39 } = fn6());
      }
      element9.textContent = value38 || "--";
      element10.textContent = "";
      element6.style.setProperty(
        "--hb-air-purifier-progress",
        {
          excellent: 72,
          good: 58,
          warning: 42,
          poor: 26,
          unknown: 0,
        }[value39] + "%",
      );
      element6.classList.toggle("is-warning", value39 === "warning");
      element6.classList.toggle("is-poor", value39 === "poor");
      const value40 =
        {
          excellent: "#76cfa1",
          good: "#76cfa1",
          warning: "#e4b15f",
          poor: "#db7770",
          unknown: "#7d8990",
        }[value39] || "#76cfa1";
      const value41 =
        {
          excellent: "rgba(118,207,161,.13)",
          good: "rgba(118,207,161,.13)",
          warning: "rgba(228,177,95,.15)",
          poor: "rgba(219,119,112,.15)",
          unknown: "rgba(125,137,144,.13)",
        }[value39] || "rgba(118,207,161,.13)";
      dialog.style.setProperty("--hb-air-purifier-accent", value40);
      dialog.style.setProperty("--hb-air-purifier-accent-soft", value41);
    };
    const fn8 = (value36) => {
      value32 = value36;
      fn7();
    };
    const fn9 = (value36) => {
      value5 = value36 || value5;
      const value37 = String(value5?.state || "").toLowerCase();
      const value38 = ["unknown", "unavailable"].includes(value37);
      const value39 = !value38 && value37 !== "off";
      value33 = value39;
      element4.textContent = value39 ? "ON" : "OFF";
      element2.textContent = value38
        ? "当前不可用"
        : value39
          ? "已开启"
          : "已关闭";
      element11.textContent = value38
        ? "设备不可用"
        : value39
          ? "净化中"
          : "已关闭";
      element2.classList.toggle("is-on", value39);
      element3.classList.toggle("is-on", value39);
      element3.classList.toggle("is-unavailable", value38);
      element6.classList.toggle("is-running", value39);
      element7.classList.toggle("is-running", value39);
      element3.setAttribute("aria-pressed", String(value39));
      value23.syncCapabilityState?.(value5);
    };
    const fn10 = () => {
      const value36 = value25
        .map((metric) => ({
          metric: metric,
          selected: fn3(metric),
        }))
        .filter(({ selected: value37 }) => fn(fn2(value37)) != null)
        .slice(0, value26.length);
      value26.forEach((element12, value37) => {
        const value38 = value36[value37];
        element12.item.hidden = !value38;
        element12.item.className =
          "hb-air-purifier-secondary-metric" +
          (value38
            ? " hb-air-purifier-secondary-metric--" + value38.metric.key
            : "");
        if (!value38) {
          element12.label.textContent = "";
          element12.value.textContent = "";
          return;
        }
        const value39 = value38.selected?.role || value38.metric.key;
        element12.label.textContent =
          value38.metric.key === "filter" && value39 === "filterLeftTime"
            ? "滤芯剩余时间"
            : value38.metric.label;
        element12.value.textContent = fn4(fn2(value38.selected), value39);
      });
      value22.hidden = value36.length === 0;
    };
    fn9(value5);
    fn5(entityId, fn9);
    for (const value36 of value25) {
      const fn11 = () => {
        fn10();
        if (value36.key === "pm25") {
          fn7();
        }
      };
      fn11();
      for (const value37 of value36.candidates) {
        fn5(value37.id, fn11);
      }
    }
    fn8(value32);
    fn5(value29, fn8);
    element3.addEventListener("click", () =>
      value23.querySelector(".hb-capability-power")?.click(),
    );
    const value35 = document.createElement("div");
    value35.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value35.tabIndex = -1;
    value35.append(dialog);
    this.container.append(value35);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
    };
    this.registerRuntimeDialogScale(value35, dialog, 920, value30 ? 620 : 540);
    element5.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value35, dialog, value6);
    value35.addEventListener("keydown", (value36) => {
      if (value36.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        value23.cleanupCapabilityDetails?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value35.remove();
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
    let value = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId: entityId,
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className =
      "hb-entity-details-dialog media-player-details capability-details";
    const value2 = document.createElement("div");
    value2.className = "hb-entity-details-card";
    const value3 = document.createElement("div");
    value3.className = "hb-entity-details-heading";
    const value4 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      value.attributes?.friendly_name || "媒体",
    );
    const element2 = document.createElement("span");
    value4.append(element, element2);
    const element3 = document.createElement("div");
    element3.className = "hb-media-speaker-visual";
    element3.setAttribute("aria-hidden", "true");
    const value5 = document.createElement("i");
    value5.className = "hb-media-speaker-body";
    const value6 = document.createElement("img");
    value6.className = "hb-media-speaker-artwork";
    value6.alt = "";
    value6.hidden = true;
    const value7 = document.createElement("i");
    value7.className = "hb-media-speaker-light";
    element3.append(value5, value6, value7);
    value3.append(value4, element3);
    const value8 = document.createElement("div");
    value8.className = "hb-media-player-details-body";
    const element4 = document.createElement("section");
    element4.className = "hb-media-player-now-playing";
    const value9 = document.createElement("img");
    value9.className = "hb-media-player-artwork";
    value9.alt = "";
    value9.hidden = true;
    const value10 = document.createElement("div");
    value10.className = "hb-media-player-copy";
    const element5 = document.createElement("strong");
    const element6 = document.createElement("span");
    const value11 = document.createElement("div");
    value11.className = "hb-media-player-progress";
    value11.hidden = true;
    const element7 = document.createElement("progress");
    element7.max = 1;
    element7.value = 0;
    const value12 = document.createElement("span");
    const element8 = document.createElement("time");
    const element9 = document.createElement("time");
    value12.append(element8, element9);
    value11.append(element7, value12);
    value10.append(element5, element6, value11);
    element4.append(value9, value10);
    const value13 = document.createElement("div");
    value13.className = "hb-media-player-actions";
    const fn = (value36, value37, value38 = {}) => {
      const element14 = document.createElement("button");
      element14.type = "button";
      element14.textContent = value36;
      element14.addEventListener("click", async () => {
        if (!preview) {
          element14.disabled = true;
          try {
            await this.callEntityService(
              "media_player",
              value37,
              entityId,
              value38,
            );
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element14.disabled = false;
          }
        }
      });
      value13.append(element14);
      return element14;
    };
    const value14 = fn("上一曲", "media_previous_track");
    const element10 = fn("播放", "media_play_pause");
    const value15 = fn("下一曲", "media_next_track");
    const value16 = this.createMediaBrowserControl(entityId, {
      preview: preview,
    });
    const value17 = document.createElement("section");
    value17.className = "hb-capability-range-group";
    const value18 = document.createElement("div");
    value18.className = "hb-capability-range-heading";
    const element11 = document.createElement("strong");
    element11.textContent = "音量";
    const element12 = document.createElement("output");
    value18.append(element11, element12);
    const element13 = document.createElement("input");
    element13.type = "range";
    element13.min = "0";
    element13.max = "1";
    element13.step = ".01";
    element13.disabled = preview;
    value17.append(value18, element13);
    element4.append(value16.root);
    value8.append(element4, value13, value17);
    let value19 = "";
    let value20 = null;
    let value21 = null;
    let value22 = null;
    let value23 = null;
    let value24 = false;
    let value25 = null;
    let value26 = null;
    let value27 = null;
    let value28 = 0;
    let value29 = null;
    let value30 = false;
    const fn2 = (value36) => {
      const count = Math.max(0, Math.floor(Number(value36) || 0));
      const value37 = Math.floor(count / 60);
      const value38 = String(count % 60).padStart(2, "0");
      return value37 + ":" + value38;
    };
    const fn3 = () => {
      if (!Number.isFinite(value27) || value27 <= 0) {
        value11.hidden = true;
        return;
      }
      let value36 = Number.isFinite(value28) ? value28 : 0;
      if (value30 && Number.isFinite(value29)) {
        value36 += Math.max(0, (Date.now() - value29) / 1000);
      }
      value36 = Math.max(0, Math.min(value27, value36));
      value11.hidden = false;
      element7.max = value27;
      element7.value = value36;
      element8.textContent = fn2(value36);
      element9.textContent = fn2(value27);
    };
    const value31 = window.setInterval(fn3, 1000);
    const fn4 = (value36, value37) =>
      Number.isFinite(value36) &&
      Number.isFinite(value37) &&
      Math.abs(value36 - value37) <= 0.005;
    const fn5 = (value36) => {
      value20 = Math.max(0, Math.min(1, Number(value36) || 0));
      element13.value = String(value20);
      element12.textContent = Math.round(value20 * 100) + "%";
    };
    const value32 = async () => {
      window.clearTimeout(value25);
      value25 = null;
      if (value24 || value23 === null) {
        return;
      }
      const volume_level = value23;
      value23 = null;
      value24 = true;
      try {
        await this.callEntityService("media_player", "volume_set", entityId, {
          volume_level: volume_level,
        });
      } catch (error) {
        value23 = null;
        value22 = null;
        window.clearTimeout(value26);
        if (value21 !== null) {
          fn5(value21);
        }
        this.options.onError?.(error);
      } finally {
        value24 = false;
        if (value23 !== null && !fn4(value23, volume_level)) {
          value25 = window.setTimeout(value32, 140);
        }
      }
    };
    const value33 = () => {
      const count = Math.max(0, Math.min(1, Number(element13.value) || 0));
      value22 = count;
      value23 = count;
      window.clearTimeout(value26);
      if (!value24) {
        window.clearTimeout(value25);
        value25 = window.setTimeout(value32, 120);
      }
    };
    value9.addEventListener("error", () => {
      value9.hidden = true;
      element4.classList.remove("has-artwork");
    });
    value9.addEventListener("load", () => {
      value9.hidden = false;
      element4.classList.add("has-artwork");
    });
    value6.addEventListener("error", () => {
      value6.hidden = true;
      element3.classList.remove("has-artwork");
    });
    value6.addEventListener("load", () => {
      value6.hidden = false;
      element3.classList.add("has-artwork");
    });
    element13.addEventListener("input", () => fn5(element13.value));
    element13.addEventListener("change", value33);
    const fn6 = (value36) => {
      value = value36 || value;
      const value37 = value.attributes || {};
      const value38 = {
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
      const value39 = String(value.state || "unknown").toLowerCase();
      const numeric = Number(value37.supported_features || 0);
      value16.sync(value);
      element2.textContent = value38[value39] || value.state || "未知状态";
      element3.classList.toggle("is-playing", value39 === "playing");
      element3.classList.toggle("is-paused", value39 === "paused");
      element3.classList.toggle(
        "is-off",
        ["off", "unavailable", "unknown"].includes(value39),
      );
      element5.textContent =
        value37.media_title ||
        value37.media_series_title ||
        value37.app_name ||
        value37.source ||
        "暂无播放内容";
      element6.textContent =
        [value37.media_artist, value37.media_album_name]
          .filter(Boolean)
          .join(" · ") ||
        value37.media_content_type ||
        "媒体播放器";
      element10.textContent = value39 === "playing" ? "暂停" : "播放";
      element10.disabled =
        preview || ["off", "unavailable", "unknown"].includes(value39);
      value14.disabled = preview || !(numeric & 16);
      value15.disabled = preview || !(numeric & 32);
      value27 = Number.isFinite(Number(value37.media_duration))
        ? Number(value37.media_duration)
        : null;
      value28 = Number.isFinite(Number(value37.media_position))
        ? Number(value37.media_position)
        : 0;
      const value40 = Date.parse(
        String(value37.media_position_updated_at || ""),
      );
      value29 = Number.isFinite(value40) ? value40 : null;
      value30 = value39 === "playing";
      fn3();
      const numeric2 = Number(value37.volume_level);
      value17.hidden = !Number.isFinite(numeric2);
      if (Number.isFinite(numeric2)) {
        if (value22 === null) {
          value21 = numeric2;
          fn5(numeric2);
        } else if (fn4(numeric2, value22)) {
          value21 = numeric2;
          fn5(value22);
          window.clearTimeout(value26);
          value26 = window.setTimeout(() => {
            value22 = null;
          }, 1800);
        } else {
          window.clearTimeout(value26);
        }
      }
      const value41 =
        [
          value37.entity_picture_local,
          value37.entity_picture,
          value37.media_image_url,
        ]
          .map((value42) => String(value42 || "").trim())
          .find(
            (value42) =>
              value42.startsWith("/api/media_player_proxy/") ||
              value42.startsWith("/api/image_proxy/"),
          ) || "";
      if (value41 !== value19) {
        value19 = value41;
        value9.hidden = !value19;
        element4.classList.toggle("has-artwork", !!value19);
        value6.hidden = !value19;
        element3.classList.toggle("has-artwork", !!value19);
        if (value19) {
          value9.src = value19;
          value6.src = value19;
        } else {
          value9.removeAttribute("src");
          value6.removeAttribute("src");
        }
      }
    };
    fn6(value);
    value2.append(value3, value8, value16.panel);
    dialog.append(value2);
    const value34 = document.createElement("div");
    value34.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value34.tabIndex = -1;
    value34.append(dialog);
    this.container.append(value34);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog: dialog,
      handlers: new Map([[entityId, [fn6]]]),
    };
    this.registerRuntimeDialogScale(value34, dialog, 540, 368);
    this.bindRuntimeDialogOutsideDismiss(value34, dialog, value2);
    value34.addEventListener("keydown", (value36) => {
      if (value36.key === "Escape") {
        dialog.close();
      }
    });
    let value35 = null;
    dialog.addEventListener(
      "close",
      () => {
        value35?.cancel();
        value16.cleanup?.();
        window.clearInterval(value31);
        window.clearTimeout(value25);
        window.clearTimeout(value26);
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value34.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
    value35 = playMediaSpeakerEntrance(element3);
  }
  showCustomPopup(value, { preview = false } = {}) {
    this.closeRuntimeDialog();
    this.historyPopupGeneration += 1;
    this.activePopupId = String(value?.id || "");
    this.connectRuntime();
    const dialog = document.createElement("dialog");
    dialog.className = "hb-custom-popup-dialog";
    const value2 = document.createElement("div");
    value2.className = "hb-custom-popup-card";
    const value3 = value.modules || [];
    const value4 = popupLayoutMetrics(value3, value.layout);
    const popupWidth = value4.popupWidth;
    const popupHeight = value4.popupHeight;
    dialog.dataset.runtimeDialogLayout =
      value4.rows === 1 && value4.columns === 2 ? "compact" : "fill";
    value2.style.width = popupWidth + "px";
    value2.style.height = popupHeight + "px";
    value2.style.maxHeight = "none";
    const value5 = document.createElement("div");
    value5.className = "hb-custom-popup-heading";
    const value6 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = value.name || "组合弹窗";
    value6.append(element);
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.textContent = "×";
    element2.setAttribute("aria-label", "关闭组合弹窗");
    value5.append(value6, element2);
    const value7 = document.createElement("div");
    value7.className = "hb-custom-popup-grid";
    value7.style.gridTemplateColumns =
      "repeat(" + value4.columns + ", minmax(0, 1fr))";
    value7.style.gridTemplateRows =
      "repeat(" + value4.rows + ", minmax(0, 1fr))";
    const value8 = [];
    const value9 = [];
    const value10 = [];
    const value11 = [];
    const value12 = [];
    const handlers = new Map();
    const fn = (value15, value16) => {
      if (!handlers.has(value15)) {
        handlers.set(value15, []);
      }
      handlers.get(value15).push(value16);
    };
    for (const [value15, value16] of value3.entries()) {
      const component =
        value16.type === "capability-device"
          ? {
              ...value16,
              type: "generic",
            }
          : value16;
      const text = String(component.entityId || "");
      const value17 = this.deviceProfile(text);
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
        value17,
      );
      const component3 = value17
        ? {
            ...component,
            properties: component2.properties,
            deviceType:
              component2.properties?.deviceType || component.deviceType,
          }
        : component;
      const value18 = value4.placements[value15] || {
        x: 0,
        y: value15,
        width: 1,
        height: 1,
      };
      const value19 = [
        "climate",
        "air-purifier",
        "water-heater",
        "media-player",
        "camera",
        "line-chart",
      ].includes(component3.type)
        ? 2
        : value18.width;
      const entityId = text || component3.entityId;
      const value20 = this.states.get(entityId);
      const value21 = value20?.newState || value20;
      const element3 = document.createElement("section");
      element3.className =
        "hb-custom-popup-module hb-custom-popup-module--" +
        (component3.type || "generic");
      element3.style.gridColumn = value18.x + 1 + " / span " + value19;
      element3.style.gridRow = value18.y + 1 + " / span " + value18.height;
      const element4 = document.createElement("div");
      element4.className = "hb-custom-popup-module-heading";
      const element5 = document.createElement("strong");
      element5.textContent = popupModuleDialogTitle(component3, value21);
      const element6 = document.createElement("span");
      element6.className =
        "hb-custom-popup-module-status type-" + (component3.type || "generic");
      const value22 = {
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
      element6.textContent = value22[component3.type] || value22.generic;
      element4.append(element5, element6);
      element3.append(element4);
      if (
        component3.type === "electric-bed" &&
        value17?.deviceType !== "electric-bed"
      ) {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const value23 = document.createElement("section");
        value23.className =
          "hb-custom-electric-bed-loading hb-climate-details-loading is-loading";
        const value24 = document.createElement("i");
        value24.setAttribute("aria-hidden", "true");
        const element7 = document.createElement("strong");
        element7.textContent = "正在加载设备状态…";
        value23.append(value24, element7);
        element3.append(value23);
      } else if (component3.type === "electric-bed") {
        element3.classList.add("hb-custom-popup-module--electric-bed");
        const value23 = (value17 || this.deviceProfile(entityId))?.roles || {};
        const fn3 = (entityId2) => {
          const value33 = this.states.get(entityId2);
          return (
            value33?.newState ||
            value33 || {
              entityId: entityId2,
              state: "unknown",
              attributes: {},
            }
          );
        };
        const value24 = document.createElement("div");
        value24.className = "hb-custom-electric-bed-body";
        const value25 = document.createElement("section");
        value25.className = "hb-electric-bed-visual";
        const value26 = document.createElement("div");
        value26.className = "hb-electric-bed-model";
        for (const value33 of ["mattress", "back", "waist", "legs", "base"]) {
          const value34 = document.createElement("i");
          value34.className = "hb-electric-bed-" + value33;
          value26.append(value34);
        }
        const fn4 = (value33, value34) => {
          const item = document.createElement("span");
          item.className = "hb-electric-bed-angle-readout " + value33;
          const value35 = document.createElement("strong");
          const element11 = document.createElement("small");
          element11.textContent = value34;
          item.append(value35, element11);
          return {
            item: item,
            value: value35,
          };
        };
        const element7 = fn4("back", "靠背");
        const element8 = fn4("waist", "腰部");
        const element9 = fn4("legs", "腿部");
        value25.append(value26, element7.item, element8.item, element9.item);
        const value27 = document.createElement("section");
        value27.className = "hb-electric-bed-control hb-electric-bed-mode";
        const value28 = document.createElement("section");
        value28.className = "hb-electric-bed-memory";
        const value29 = document.createElement("section");
        value29.className = "hb-electric-bed-angle-controls";
        const text2 = String(value23.mode || "");
        const value30 = [value23.memory1, value23.memory2]
          .filter(Boolean)
          .slice(0, 2);
        const value31 = [
          ["backrest", "靠背角度", "back"],
          ["leg", "腿部角度", "legs"],
          ["waist", "腰部角度", "waist"],
        ]
          .map(([role, label, visualClass]) => ({
            role: role,
            label: label,
            visualClass: visualClass,
            entityId: String(value23[role] || ""),
          }))
          .filter((value33) => value33.entityId);
        const fn5 = (value33, value34, value35, variant = "") => {
          const value36 = document.createElement("section");
          value36.className = "hb-electric-bed-control";
          const element11 = document.createElement("strong");
          element11.textContent = value34;
          const element12 = this.createCapabilityDetailsControls(
            value35,
            fn3(value35),
            {
              interactive: !preview,
              variant: variant,
            },
          );
          element12.classList.add("hb-electric-bed-capability");
          value36.append(element11, element12);
          value33.append(value36);
          value8.push(() => element12.cleanupCapabilityDetails?.());
          fn(value35, (value37) => element12.syncCapabilityState?.(value37));
        };
        if (text2) {
          fn5(value27, "模式", text2, "electric-bed");
        } else {
          const element11 = document.createElement("strong");
          element11.textContent = "模式";
          const value33 = document.createElement("select");
          value33.className = "hb-capability-select";
          value33.disabled = true;
          value33.append(new Option("未识别到模式实体"));
          value27.append(element11, value33);
        }
        const element10 = document.createElement("strong");
        element10.textContent = "记忆姿势";
        const value32 = document.createElement("div");
        value32.className = "hb-electric-bed-memory-list";
        for (let value33 = 0; value33 < 2; value33 += 1) {
          const text3 = String(value30[value33] || "");
          const value34 = text3 ? this.entityMetadata.get(text3) : null;
          if (text3.split(".", 1)[0] === "select") {
            fn5(
              value32,
              "记忆姿势 " + (value33 + 1),
              text3,
              "electric-bed-memory",
            );
            continue;
          }
          const element11 = document.createElement("button");
          element11.type = "button";
          element11.className = "hb-electric-bed-memory-button";
          element11.textContent =
            value34?.name ||
            value34?.originalName ||
            "记忆姿势 " + (value33 + 1);
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
          value32.append(element11);
        }
        value28.append(element10, value32);
        for (const value33 of value31) {
          fn5(value29, value33.label, value33.entityId);
        }
        const fn6 = () => {
          const value33 = {
            backrest: fn3(value23.backrest),
            leg: fn3(value23.leg),
            waist: fn3(value23.waist),
          };
          const fn7 = (value34) => {
            const numeric = Number(value34?.state);
            if (Number.isFinite(numeric)) {
              return numeric;
            } else {
              return null;
            }
          };
          const fn8 = (value34, _, element11) => {
            const value35 = fn7(value33[value34]);
            element11.textContent =
              value35 === null ? "--" : Math.round(value35) + "°";
            if (value35 !== null) {
              value26.style.setProperty(
                "--hb-bed-" +
                  (value34 === "backrest" ? "backrest" : value34) +
                  "-angle",
                value35 + "deg",
              );
            }
          };
          fn8("backrest", value26, element7.value);
          fn8("waist", value26, element8.value);
          fn8("leg", value26, element9.value);
          element6.textContent = "已连接";
        };
        for (const value33 of [
          value23.backrest,
          value23.leg,
          value23.waist,
        ].filter(Boolean)) {
          fn(value33, fn6);
        }
        fn6();
        value24.append(value27, value25, value28, value29);
        element3.append(value24);
      } else if (component3.type === "camera") {
        const element7 = document.createElement("section");
        element7.className =
          "hb-camera-device-visual hb-custom-camera-device-visual";
        element7.setAttribute("aria-hidden", "true");
        const value23 = document.createElement("i");
        value23.className = "hb-camera-device-mount";
        const value24 = document.createElement("i");
        value24.className = "hb-camera-device-arm";
        const value25 = document.createElement("div");
        value25.className = "hb-camera-device-body";
        const value26 = document.createElement("i");
        value26.className = "hb-camera-device-lens";
        const value27 = document.createElement("i");
        value27.className = "hb-camera-device-led";
        value25.append(value26, value27);
        element7.append(value23, value24, value25);
        element4.append(element7);
        let value28 = 0;
        let value29 = null;
        let value30 = 0;
        const fn3 = (value34, value35 = 0) =>
          "translateX(-50%) perspective(260px) rotateY(" +
          value34 +
          "deg) rotateZ(" +
          value34 * 0.035 +
          "deg) translateY(" +
          value35 +
          "px)";
        const value31 = () => {
          if (!value25.isConnected) {
            return;
          }
          const value34 = [-22, -16, -9, -4, 0, 6, 12, 18, 23].filter(
            (value40) => Math.abs(value40 - value30) >= 7,
          );
          const value35 =
            value34[Math.floor(Math.random() * value34.length)] ?? 0;
          const value36 = Math.sign(value35 - value30) || 1;
          const value37 = Math.abs(value35 - value30);
          const duration = Math.round(430 + value37 * 18 + Math.random() * 320);
          const value38 = value35 + value36 * (1.4 + Math.random() * 2.2);
          const value39 = Math.random() * 1.4 - 0.7;
          value26.style.setProperty(
            "--hb-camera-lens-shift",
            (value35 / 23) * 2.5 + "px",
          );
          value29?.cancel();
          value29 = value25.animate(
            [
              {
                transform: fn3(value30, 0),
                offset: 0,
              },
              {
                transform: fn3(value38, value39),
                offset: 0.78,
              },
              {
                transform: fn3(value35, value39 * 0.35),
                offset: 1,
              },
            ],
            {
              duration: duration,
              easing: "cubic-bezier(.2,.72,.22,1)",
              fill: "forwards",
            },
          );
          value29.addEventListener(
            "finish",
            () => {
              value30 = value35;
              value25.style.transform = fn3(value30, value39 * 0.35);
              value29?.cancel();
              value29 = null;
              const value40 =
                Math.random() < 0.22
                  ? 180 + Math.random() * 260
                  : 680 + Math.random() * 1500;
              value28 = window.setTimeout(value31, value40);
            },
            {
              once: true,
            },
          );
        };
        if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
          value28 = window.setTimeout(value31, 620);
        }
        value8.push(() => {
          window.clearTimeout(value28);
          value29?.cancel();
        });
        const container = document.createElement("div");
        container.className = "hb-custom-popup-camera-stage is-connecting";
        element6.textContent = preview ? "预览模式" : "正在连接";
        element6.classList.add("is-connecting");
        const value32 = document.createElement("i");
        value32.className = "hb-camera-preview-reveal-veil";
        const value33 = document.createElement("i");
        value33.className = "hb-camera-preview-scan-line";
        container.append(value32, value33);
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
            container: container,
            entityId: entityId,
            label: element5.textContent,
            objectFit: "fill",
            placeholder: placeholder,
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
            cleanup: (cleanup) => value8.push(cleanup),
          });
        }
        element3.append(container);
      } else if (component3.type === "line-chart") {
        const component4 = {
          type: "line-chart",
          bindings: {
            entity: {
              entityId: entityId,
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
        const value23 = document.createElement("output");
        value23.className = "hb-custom-line-chart-current";
        const element7 = document.createElement("strong");
        const element8 = document.createElement("small");
        const text2 = String(component4.properties?.valueColor || "#dce1e5");
        element7.style.color = text2;
        element8.style.color = text2;
        value23.append(element7, element8);
        element4.append(value23);
        const fn3 = (value28) => {
          const value29 = Number.parseFloat(value28?.state);
          element7.textContent = Number.isFinite(value29)
            ? formatLineChartValue(
                value29,
                component4.properties?.statePrecision,
              )
            : value28?.state || "--";
          element8.textContent = String(
            value28?.attributes?.unit_of_measurement || "",
          );
          value23.setAttribute(
            "aria-label",
            "当前数值 " + element7.textContent + element8.textContent,
          );
        };
        const value24 = {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace + "-" + component3.id,
          interactive: true,
          animate: false,
        };
        let value25 = renderLineChartDetails(component4, value24);
        let value26 = 0;
        const value27 = () => {
          value26 = 0;
          if (
            !value25?.isConnected ||
            this.detailsStateSync?.dialog !== dialog
          ) {
            return;
          }
          const value28 = renderLineChartDetails(component4, value24);
          value25.cleanupLineChartHover?.();
          value25.replaceWith(value28);
          value25 = value28;
          fn5();
        };
        const fn4 = (value28 = 700) => {
          value26 ||= window.setTimeout(
            value27,
            Math.max(0, Number(value28) || 0),
          );
        };
        value12.push(() => fn4(0));
        const fn5 = () => {
          value23.style.setProperty(
            "--hb-custom-chart-accent",
            value25.style.getPropertyValue("--hb-chart-current-color") ||
              "#68cc3e",
          );
        };
        fn3(value21);
        fn5();
        fn(entityId, (value28) => {
          fn3(value28);
          value25.syncLineChartState?.(value28);
          fn5();
        });
        value8.push(() => {
          window.clearTimeout(value26);
          value25.cleanupLineChartHover?.();
        });
        element3.append(value25);
      } else if (component3.type === "switch") {
        let value23 = value21;
        let value24 = false;
        let value25 = "idle";
        let value26 = null;
        const momentary = entityId.split(".")[0] === "button";
        const value27 = dn({
          label: element5.textContent,
          interactive: !preview,
          momentary: momentary,
          onToggle: () => value26?.(),
        });
        value27.visual.classList.add("hb-custom-switch-visual");
        const fn3 = (value28) => {
          value23 = value28;
          const unavailable =
            !value28?.state ||
            ["unknown", "unavailable"].includes(value28.state);
          const value29 = !momentary && value28?.state === "on";
          value27.sync(value29, {
            unavailable: unavailable,
            pending: value24 && value25 !== "success",
            success: value25 === "success",
          });
          element6.textContent = unavailable
            ? "当前不可用"
            : momentary
              ? value25 === "success"
                ? "执行成功"
                : value24
                  ? "正在执行"
                  : "按下执行"
              : value29
                ? "已开启"
                : "已关闭";
          element6.classList.toggle(
            "is-live",
            (momentary ? value24 || value25 === "success" : value29) &&
              !unavailable,
          );
        };
        value26 = async () => {
          if (
            preview ||
            value24 ||
            ["unknown", "unavailable"].includes(value23?.state)
          ) {
            return;
          }
          const value28 = value23;
          value24 = true;
          value25 = "idle";
          fn3(
            momentary
              ? value28
              : {
                  ...value28,
                  state: value28?.state === "on" ? "off" : "on",
                },
          );
          try {
            if (momentary) {
              await this.callEntityService("button", "press", entityId);
              value25 = "success";
              fn3(value23);
              await new Promise((value29) => window.setTimeout(value29, 900));
            } else {
              await this.callEntityService("homeassistant", "toggle", entityId);
            }
          } catch (error) {
            value25 = "idle";
            fn3(value28);
            this.options.onError?.(error);
          } finally {
            value24 = false;
            value25 = "idle";
            fn3(value23);
          }
        };
        fn3(value21);
        fn(entityId, fn3);
        element3.append(value27.visual);
      } else if (component3.type === "light") {
        let value23 = null;
        element4.classList.add("has-light-visual");
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className = "hb-light-visual hb-custom-light-visual";
        element7.style.animationDelay = 0.08 + value15 * 0.07 + "s";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const value24 = document.createElement("div");
        value24.className = "hb-light-visual-aura";
        const value25 = document.createElement("div");
        value25.className = "hb-light-visual-lamp";
        for (const value33 of ["cord", "shade", "bulb", "filament"]) {
          const value34 = document.createElement("i");
          value34.className = "hb-light-visual-" + value33;
          value25.append(value34);
        }
        element7.append(value24, value25);
        element4.append(element7);
        const value26 = value21?.attributes || {};
        const value27 = lightSupportsColor(value26);
        const value28 =
          Number(value26.min_color_temp_kelvin) ||
          (Number.isFinite(Number(value26.max_mireds))
            ? 1000000 / Number(value26.max_mireds)
            : 2000);
        const value29 =
          Number(value26.max_color_temp_kelvin) ||
          (Number.isFinite(Number(value26.min_mireds))
            ? 1000000 / Number(value26.min_mireds)
            : 6500);
        const value30 =
          Number(value26.color_temp_kelvin) ||
          (Number.isFinite(Number(value26.color_temp))
            ? 1000000 / Number(value26.color_temp)
            : NaN);
        const value31 = {
          isOn: value21?.state === "on",
          brightnessPercent: Number.isFinite(Number(value26.brightness))
            ? (Number(value26.brightness) / 255) * 100
            : 100,
          colorTemperatureKelvin: Number.isFinite(value30)
            ? value30
            : (value28 + value29) / 2,
          colorRgb:
            value27 && Array.isArray(value26.rgb_color)
              ? value26.rgb_color
                  .slice(0, 3)
                  .map((colorRgb) => Number(colorRgb) || 0)
              : value27 && Array.isArray(value26.hs_color)
                ? hsToRgbColor(value26.hs_color)
                : null,
        };
        const onVisualChange = (value33 = {}) => {
          const value34 = value33.attributes || {};
          if (typeof value33.isOn == "boolean") {
            value31.isOn = value33.isOn;
          } else if (typeof value33.state == "string") {
            value31.isOn = value33.state === "on";
          }
          if (Number.isFinite(Number(value33.brightnessPercent))) {
            value31.brightnessPercent = Number(value33.brightnessPercent);
          } else if (Number.isFinite(Number(value34.brightness))) {
            value31.brightnessPercent =
              (Number(value34.brightness) / 255) * 100;
          }
          if (Number.isFinite(Number(value33.colorTemperatureKelvin))) {
            value31.colorTemperatureKelvin = Number(
              value33.colorTemperatureKelvin,
            );
          } else if (Number.isFinite(Number(value34.color_temp_kelvin))) {
            value31.colorTemperatureKelvin = Number(value34.color_temp_kelvin);
          } else if (Number.isFinite(Number(value34.color_temp))) {
            value31.colorTemperatureKelvin =
              1000000 / Number(value34.color_temp);
          }
          if (value27 && Array.isArray(value33.colorRgb)) {
            value31.colorRgb = value33.colorRgb
              .slice(0, 3)
              .map((value39) => Number(value39) || 0);
          } else if (value27 && Array.isArray(value34.rgb_color)) {
            value31.colorRgb = value34.rgb_color
              .slice(0, 3)
              .map((value39) => Number(value39) || 0);
          } else if (value27 && Array.isArray(value34.hs_color)) {
            value31.colorRgb = hsToRgbColor(value34.hs_color);
          }
          const count = Math.max(
            1,
            Math.min(100, Number(value31.brightnessPercent) || 1),
          );
          const value35 =
            (Math.max(
              2000,
              Math.min(6500, Number(value31.colorTemperatureKelvin) || 4250),
            ) -
              2000) /
            4500;
          const value36 = [255, 132, 42];
          const value37 = [172, 225, 255];
          const value38 =
            value31.colorRgb ||
            value36.map((value39, value40) =>
              Math.round(value39 + (value37[value40] - value39) * value35),
            );
          element7.classList.toggle("is-on", value31.isOn);
          element7.style.setProperty(
            "--hb-light-visual-color",
            "rgb(" + value38.join(",") + ")",
          );
          element7.style.setProperty(
            "--hb-light-visual-opacity",
            value31.isOn ? String(0.08 + (count / 100) * 0.92) : "0",
          );
          element7.style.setProperty(
            "--hb-light-visual-blur",
            Math.round(15 + count * 1.14) + "px",
          );
          element7.style.setProperty(
            "--hb-light-visual-scale",
            String(0.62 + (count / 100) * 1.05),
          );
          element7.setAttribute("aria-pressed", String(value31.isOn));
          element7.setAttribute(
            "aria-label",
            "" +
              element5.textContent +
              (value31.isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
          element6.textContent = value31.isOn ? "已开启" : "已关闭";
          element6.classList.toggle("is-live", value31.isOn);
        };
        onVisualChange();
        let value32 = false;
        element7.addEventListener("click", async () => {
          if (preview || value32) {
            return;
          }
          value32 = true;
          element7.setAttribute("aria-busy", "true");
          const isOn = value31.isOn;
          onVisualChange({
            isOn: !isOn,
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            onVisualChange({
              isOn: isOn,
            });
            this.options.onError?.(error);
          } finally {
            value32 = false;
            element7.removeAttribute("aria-busy");
          }
        });
        value23 = this.createLightDetailsControls(entityId, value21, {
          interactive: !preview,
          onTurnOn: () => {
            onVisualChange({
              isOn: true,
            });
          },
          onVisualChange: onVisualChange,
        });
        value8.push(() => value23?.cleanupLightDetails?.());
        fn(entityId, (value33) => {
          onVisualChange(value33);
          value23?.syncLightState?.(value33);
        });
        element3.append(value23);
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
                value21,
                entityId,
              );
        let value23 = value21;
        const value24 = {
          entityId: entityId,
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
          value11.push({
            visual: visual,
            distance: 168,
            delay: 100 + value15 * 45,
          });
        }
        visual.inert = preview;
        visual.setAttribute("aria-disabled", String(preview));
        const value25 = document.createElement("div");
        value25.className = "hb-climate-visual-unit";
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
        const value26 = document.createElement("div");
        value26.className = "hb-climate-visual-vent";
        for (let value38 = 0; value38 < 5; value38 += 1) {
          value26.append(document.createElement("i"));
        }
        value25.append(element7, element8, value26);
        const value27 = document.createElement("div");
        value27.className = "hb-climate-visual-airflow";
        for (let value38 = 0; value38 < 3; value38 += 1) {
          value27.append(document.createElement("i"));
        }
        visual.append(value25, value27);
        const fn3 = ({
          mode: value39 = "off",
          visualMode: value40 = "off",
          running: value41 = false,
          accentColor: value42 = "#65717a",
          targetTemperature: value38,
        } = {}) => {
          const value43 = value40 !== "off";
          visual.classList.toggle("is-on", value43);
          visual.classList.toggle("is-running", value41);
          visual.classList.toggle(
            "is-airflow-mode",
            deviceType === "bath-heater" &&
              value43 &&
              bathHeaterModeUsesAirflow(value39),
          );
          visual.dataset.visualMode = value40;
          visual.style.setProperty("--hb-climate-visual-accent", value42);
          const value44 =
            value38 != null &&
            value38 !== "" &&
            Number.isFinite(Number(value38));
          element8.textContent = value43
            ? value44
              ? Number(value38) + "°"
              : climateModeLabel(value39, deviceType, value24)
            : "OFF";
          if (deviceType === "bath-heater") {
            visual.setAttribute(
              "aria-label",
              element5.textContent + "，点击切换浴霸灯",
            );
          } else {
            visual.setAttribute("aria-pressed", String(value43));
            visual.setAttribute(
              "aria-label",
              "" +
                element5.textContent +
                (value43 ? "已开启，点击关闭" : "已关闭，点击开启"),
            );
          }
        };
        const element9 = this.createClimateDetailsControls(entityId, value21, {
          interactive: !preview,
          deviceType: deviceType,
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
              value24,
            );
            element6.classList.toggle("is-live", onVisualChange2 !== "off");
            element6.classList.toggle("is-running", onVisualChange3);
            element6.style.setProperty("--hb-climate-accent", onVisualChange4);
            element6.style.setProperty(
              "--hb-climate-accent-soft",
              onVisualChange5,
            );
            fn3({
              mode: onVisualChange,
              visualMode: onVisualChange2,
              running: onVisualChange3,
              accentColor: onVisualChange4,
              targetTemperature: onVisualChange6,
            });
          },
        });
        value8.push(() => element9.cleanupClimateDetails?.());
        const value28 =
          deviceType === "bath-heater" ? value17?.roles?.light : "";
        const value29 = value28
          ? this.entityMetadata.get(value28)
          : deviceType === "bath-heater"
            ? relatedDeviceDomainEntity(this.entityMetadata, entityId, "light")
            : null;
        let value30 = null;
        if (value29?.entityId) {
          const value38 = this.states.get(value29.entityId);
          const value39 = value38?.newState ||
            value38 || {
              state: "unknown",
              attributes: {},
            };
          value30 = this.createBathHeaterLightControl(
            value29.entityId,
            value39,
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
          element9.append(value30);
          fn(value29.entityId, (value40) =>
            value30.syncBathLightState?.(value40),
          );
        }
        const value31 = Array.from(element9.children);
        const value32 = value31.find((element10) =>
          element10.classList.contains("hb-climate-thermostat"),
        );
        const value33 = value31.find((element10) =>
          element10.classList.contains("hb-climate-fan-slider"),
        );
        const value34 = document.createElement("div");
        value34.className = "hb-custom-climate-left";
        const value35 = document.createElement("div");
        value35.className = "hb-custom-climate-right";
        if (value32) {
          value34.append(value32);
        }
        if (value33) {
          value34.append(value33);
        }
        value35.append(
          visual,
          ...value31.filter(
            (value38) => value38 !== value32 && value38 !== value33,
          ),
        );
        const value36 = !!value32 || !!value33;
        element9.classList.toggle("without-primary-controls", !value36);
        element9.replaceChildren(...(value36 ? [value34, value35] : [value35]));
        let value37 = false;
        visual.addEventListener("click", async () => {
          if (deviceType === "bath-heater") {
            if (value30?.toggleBathLight) {
              await value30.toggleBathLight();
            } else {
              this.options.onError?.(
                new Error("未找到与浴霸同设备的灯光实体。"),
              );
            }
            return;
          }
          if (preview || value37) {
            return;
          }
          value37 = true;
          visual.setAttribute("aria-busy", "true");
          const value38 = value23;
          const value39 = climateIsPoweredOn(value38, deviceType);
          const value40 =
            element9.dataset.lastClimateMode ||
            (value39 ? value38.state : "auto");
          const value41 = {
            state: value39 ? "off" : value40,
            attributes: {
              ...(value38?.attributes || {}),
              hvac_action: value39 ? "off" : value40,
            },
          };
          value23 = value41;
          element9.syncClimateState?.(value41);
          try {
            const value42 = climatePowerCommand(
              entityId,
              value38,
              !value39,
              deviceType,
              element9.dataset.lastClimateMode || "",
            );
            await this.callEntityService(
              value42.domain,
              value42.service,
              entityId,
              value42.data,
            );
          } catch (error) {
            value23 = value38;
            element9.syncClimateState?.(value38);
            this.options.onError?.(error);
          } finally {
            value37 = false;
            visual.removeAttribute("aria-busy");
          }
        });
        fn(entityId, (value38) => {
          value23 = value38;
          element9.syncClimateState?.(value38);
        });
        element3.append(element9);
      } else if (component3.type === "cover") {
        let value23 = value21;
        const value24 = value21?.attributes || {};
        const airer = coverComponentIsAirer(
          component3,
          entityId,
          value21,
          this.entityMetadata,
          this.deviceMetadata,
        );
        const numeric = Number(value24.supported_features || 0);
        const value25 =
          entityId +
          " " +
          (value24.friendly_name || "") +
          " " +
          (component3.title || "");
        const value26 =
          Number.isFinite(Number(value24.current_tilt_position)) ||
          !!(numeric & 240);
        const value27 = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(
          value25,
        );
        const value28 = ["standard", "dream", "airer"].includes(
          component3.properties?.coverKind,
        )
          ? component3.properties.coverKind
          : "auto";
        const dream =
          !airer &&
          (value28 === "dream" || (value28 === "auto" && (value26 || value27)));
        const value29 =
          (airer
            ? relatedAirerLightEntity(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const value30 = value29 ? this.states.get(value29) : null;
        let value31 = value30?.newState || value30 || null;
        const positionCommandEntityId =
          (airer
            ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const value32 = this.states.get(positionCommandEntityId);
        const positionCommandState = value32?.newState || value32 || null;
        const value33 =
          (airer
            ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const value34 =
          (airer
            ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId)
            : null
          )?.entityId || "";
        const value35 = this.states.get(value34);
        const motorState = value35?.newState || value35 || null;
        const value36 = airer
          ? relatedAirerMotorActionEntities(this.entityMetadata, entityId)
          : {};
        const airerActionEntityIds = Object.fromEntries(
          Object.entries(value36).map(([value51, value52]) => [
            value51,
            value52?.entityId || "",
          ]),
        );
        const value37 = this.states.get(value33 || positionCommandEntityId);
        const positionState = value37?.newState || value37 || null;
        const tilt = dream && value26;
        const motorReversed = coverMotorIsReversedForComponent(
          component3,
          this.entityMetadata,
          this.states,
          entityId,
        );
        const value38 = motorReversed ? "open_cover" : "close_cover";
        const value39 = motorReversed ? "close_cover" : "open_cover";
        const value40 = ["left", "right"].includes(
          component3.properties?.coverDirection,
        )
          ? component3.properties.coverDirection
          : "split";
        const value41 = document.createElement("div");
        value41.className = "hb-custom-cover-layout";
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className = "hb-cover-visual hb-custom-cover-visual";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const value42 = document.createElement("i");
        value42.className = "hb-cover-visual-rail";
        const value43 = document.createElement("i");
        value43.className = "hb-cover-visual-panel left";
        const value44 = document.createElement("i");
        value44.className = "hb-cover-visual-panel right";
        const value45 = document.createElement("span");
        value45.className = "hb-cover-visual-slats";
        const value46 = 13;
        for (let value51 = 0; value51 < value46; value51 += 1) {
          const value52 = document.createElement("span");
          value52.className = "hb-cover-visual-slat";
          const value53 = document.createElement("i");
          value52.style.setProperty("--hb-cover-slat-index", String(value51));
          const value54 =
            value40 === "right"
              ? value46 - 1 - value51
              : value40 === "split"
                ? Math.abs((value46 - 1) / 2 - value51)
                : value51;
          value52.style.setProperty(
            "--hb-cover-slat-delay-index",
            String(value54),
          );
          const value55 =
            value40 === "left"
              ? -value51 * 14.5
              : value40 === "right"
                ? (value46 - 1 - value51) * 14.5
                : value51 <= (value46 - 1) / 2
                  ? -value51 * 14.5
                  : (value46 - 1 - value51) * 14.5;
          value52.style.setProperty(
            "--hb-cover-retracted-shift",
            value55 + "px",
          );
          value52.append(value53);
          value45.append(value52);
        }
        const value47 = document.createElement("i");
        value47.className = "hb-cover-visual-window";
        element7.classList.toggle("is-dream", dream);
        element7.classList.toggle("is-airer", airer);
        element7.classList.add("direction-" + value40);
        element7.append(value47, value42, value43, value44, value45);
        if (airer) {
          fi(element7);
        }
        const fn3 = (value51 = value31) => {
          if (!airer) {
            return;
          }
          value31 = value51 || value31;
          const value52 =
            !value29 ||
            ["unknown", "unavailable"].includes(
              String(value31?.state || "unknown"),
            );
          const value53 = value31?.state === "on";
          element7.classList.toggle("is-light-on", value53 && !value52);
          element7.classList.toggle("is-light-unavailable", value52);
          element7.disabled = preview || value52;
          element7.setAttribute("aria-pressed", String(value53 && !value52));
          element7.setAttribute(
            "aria-label",
            value52
              ? "晾衣机灯光实体不可用"
              : "晾衣机灯光" +
                  (value53 ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
        };
        fn3();
        let value48 = 0;
        const positionCalibration = airerPositionCalibration(
          this.entityMetadata,
          this.deviceMetadata,
          entityId,
        );
        const onVisualChange = ({ position: value51 = 0, state = "" } = {}) => {
          const current_position = Math.max(
            0,
            Math.min(100, Number(value51) || 0),
          );
          const value52 = coverPresentationState(
            {
              state: state,
              attributes: {
                current_position: current_position,
              },
            },
            motorReversed,
          );
          const value53 = physicalCoverState(
            state || value23?.state,
            motorReversed,
          );
          const value54 = value53 === "open" || value53 === "opening";
          value48 = current_position;
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
            dream ? value54 : value52 === "open" || value52 === "opening",
          );
          element7.classList.toggle(
            "is-moving",
            state === "opening" || state === "closing",
          );
          element7.setAttribute(
            "aria-pressed",
            String(
              dream ? value54 : value52 === "open" || value52 === "opening",
            ),
          );
          if (airer) {
            element6.textContent =
              ln(value52) || Math.round(current_position) + "%";
          } else if (dream) {
            element6.textContent = dreamCurtainStatusText(
              state || value23?.state,
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
              }[value52] || Math.round(current_position) + "%";
          }
          element6.classList.toggle(
            "is-live",
            dream ? value54 : value52 === "open" || value52 === "opening",
          );
          if (!airer) {
            element7.setAttribute(
              "aria-label",
              dream
                ? "" +
                    element5.textContent +
                    dreamCurtainStatusText(
                      state || value23?.state,
                      current_position,
                      motorReversed,
                    )
                : "" +
                    element5.textContent +
                    (value52 === "open" || value52 === "opening"
                      ? "已打开，点击关闭"
                      : "已关闭，点击打开"),
            );
          }
        };
        const value49 = this.createCoverDetailsControls(entityId, value21, {
          interactive: !preview,
          dream: dream,
          airer: airer,
          tilt: tilt,
          motorReversed: motorReversed,
          positionState: positionState,
          positionCommandEntityId: positionCommandEntityId,
          positionCommandState: positionCommandState,
          motorState: motorState,
          airerActionEntityIds: airerActionEntityIds,
          positionCalibration: positionCalibration,
          onVisualChange: onVisualChange,
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
                value48,
              );
              element6.classList.toggle("is-live", onCurtainPositionChange);
            }
          },
        });
        let value50 = false;
        element7.addEventListener("click", async () => {
          if (preview || value50) {
            return;
          }
          value50 = true;
          element7.setAttribute("aria-busy", "true");
          if (airer) {
            const value54 = value31;
            fn3({
              ...(value31 || {}),
              state: value31?.state === "on" ? "off" : "on",
            });
            try {
              await this.callEntityService("homeassistant", "toggle", value29);
            } catch (error) {
              fn3(value54);
              this.options.onError?.(error);
            } finally {
              value50 = false;
              element7.removeAttribute("aria-busy");
            }
            return;
          }
          const value51 = value48;
          const value52 =
            value49.isDreamCurtainRetracted?.() ??
            element7.dataset.curtainRetracted === "true";
          const value53 = value51 > COVER_CLOSED_POSITION_EPSILON;
          if (dream) {
            value49.beginDreamCurtainMotion?.(!value52);
          } else {
            value49.beginCoverMotion?.(
              value53 ? 0 : 100,
              value53 ? "closing" : "opening",
            );
          }
          try {
            await this.callEntityService(
              "cover",
              dream
                ? dreamCurtainToggleService(value52, value39, value38)
                : value53
                  ? value38
                  : value39,
              entityId,
            );
          } catch (error) {
            if (dream) {
              value49.cancelDreamCurtainMotion?.();
              value49.setDreamCurtainRetracted?.(value52, false);
            } else {
              value49.cancelCoverMotion?.();
            }
            value49.syncCoverState?.(value23);
            this.options.onError?.(error);
          } finally {
            value50 = false;
            element7.removeAttribute("aria-busy");
          }
        });
        fn(entityId, (value51) => {
          value23 = value51;
          value49.syncCoverState?.(value51);
        });
        if (value29) {
          fn(value29, fn3);
        }
        if (value33) {
          fn(value33, (value51) => value49.syncCoverPositionState?.(value51));
        }
        if (positionCommandEntityId) {
          fn(positionCommandEntityId, (value51) => {
            value49.syncCoverPositionCommandState?.(value51);
            if (!value33) {
              value49.syncCoverPositionState?.(value51);
            }
          });
        }
        if (value34) {
          fn(value34, (value51) => value49.syncAirerMotorState?.(value51));
        }
        value8.push(() => value49.cleanupCoverDetails?.());
        value41.append(element7, value49);
        element3.append(value41);
      } else if (component3.type === "air-purifier") {
        let value23 = value21 || {
          entityId: entityId,
          state: "unknown",
          attributes: {},
        };
        const element7 = document.createElement("button");
        element7.type = "button";
        element7.className =
          "hb-air-purifier-visual hb-custom-air-purifier-visual";
        element7.inert = preview;
        element7.setAttribute("aria-disabled", String(preview));
        const value24 = document.createElement("i");
        value24.className = "hb-air-purifier-visual-aura";
        const value25 = document.createElement("span");
        value25.className = "hb-air-purifier-visual-airflow";
        for (let value44 = 0; value44 < 4; value44 += 1) {
          value25.append(document.createElement("i"));
        }
        const value26 = document.createElement("span");
        value26.className = "hb-air-purifier-visual-body";
        const value27 = document.createElement("i");
        value27.className = "hb-air-purifier-visual-top";
        const value28 = document.createElement("i");
        value28.className = "hb-air-purifier-visual-vent";
        const value29 = document.createElement("span");
        value29.className = "hb-air-purifier-visual-display";
        const element8 = document.createElement("strong");
        value29.append(element8);
        value26.append(value27, value28, value29);
        element7.append(value24, value25, value26);
        const value30 = this.createCapabilityDetailsControls(
          entityId,
          value23,
          {
            interactive: !preview,
            variant: "air-purifier",
          },
        );
        const value31 = document.createElement("div");
        value31.className =
          "hb-air-purifier-layout hb-custom-air-purifier-layout";
        const value32 = document.createElement("section");
        value32.className = "hb-air-purifier-summary";
        const value33 = document.createElement("div");
        value33.className = "hb-air-purifier-gauge-wrap";
        const element9 = document.createElement("div");
        element9.className = "hb-air-purifier-gauge is-quality";
        const element10 = document.createElement("i");
        element10.className = "hb-air-purifier-gauge-orbit";
        const value34 = document.createElement("i");
        value34.className = "hb-air-purifier-arc-cap start";
        const value35 = document.createElement("i");
        value35.className = "hb-air-purifier-arc-cap end";
        const value36 = document.createElement("div");
        value36.className = "hb-air-purifier-gauge-content";
        const element11 = document.createElement("small");
        element11.textContent = "室内空气质量";
        const value37 = document.createElement("strong");
        const element12 = document.createElement("span");
        const element13 = document.createElement("span");
        element13.textContent = "设备状态 --";
        value37.append(element12);
        value36.append(element11, value37, element13);
        element9.append(value34, value35, value36);
        value33.append(element10, element9);
        const value38 = document.createElement("section");
        value38.className = "hb-air-purifier-controls-pane";
        value38.append(value30);
        const value39 = {
          pm25: "PM2.5",
          pm10: "PM10",
          filterLife: "滤芯寿命",
          filterLeftTime: "滤芯剩余时间",
          hcho: "甲醛",
          temperature: "温度",
          humidity: "湿度",
        };
        const value40 = [
          {
            role: "pm25",
            ids: [value17?.roles?.pm25],
          },
          {
            role: "pm10",
            ids: [value17?.roles?.pm10],
          },
          {
            role: "filterLife",
            ids: [value17?.roles?.filterLife, value17?.roles?.filterLeftTime],
          },
          {
            role: "hcho",
            ids: [value17?.roles?.hcho],
          },
          {
            role: "temperature",
            ids: [value17?.roles?.temperature],
          },
          {
            role: "humidity",
            ids: [value17?.roles?.humidity],
          },
        ].map((value44) => ({
          ...value44,
          ids: value44.ids.filter(Boolean),
        }));
        const fn3 = (value44) => {
          const value45 = this.states.get(value44);
          return value45?.newState || value45 || null;
        };
        const fn4 = (value44) => {
          const value45 = fn3(value44);
          return (
            value45 &&
            !["unknown", "unavailable"].includes(
              String(value45.state || "").toLowerCase(),
            ) &&
            Number.isFinite(Number(value45.state))
          );
        };
        const value41 = value40
          .map((value44) => ({
            ...value44,
            id:
              value44.ids.find((id) => fn4(id)) ||
              value44.ids.find((id) => this.entityMetadata.has(id)),
          }))
          .filter((value44) => value44.id)
          .slice(0, 3);
        const value42 = document.createElement("div");
        value42.className =
          "hb-air-purifier-secondary-metrics hb-custom-air-purifier-metrics";
        for (const value44 of value41) {
          const value45 = this.entityMetadata.get(value44.id);
          const value46 = document.createElement("div");
          value46.className =
            "hb-air-purifier-secondary-metric hb-air-purifier-secondary-metric--" +
            value44.role;
          const element14 = document.createElement("small");
          element14.textContent = value39[value44.role] || value44.role;
          const element15 = document.createElement("strong");
          value46.append(element14, element15);
          value42.append(value46);
          const fn7 = (value47) => {
            element15.textContent = ["unknown", "unavailable"].includes(
              String(value47?.state || "").toLowerCase(),
            )
              ? "--"
              : (
                  (value47?.state ?? "--") +
                  " " +
                  (value47?.attributes?.unit_of_measurement ||
                    value45?.unitOfMeasurement ||
                    "")
                ).trim();
          };
          fn7(fn3(value44.id));
          fn(value44.id, fn7);
        }
        const airQuality = value17?.roles?.airQuality;
        const pm25 = value17?.roles?.pm25;
        const fn5 = () => {
          const value44 = fn3(airQuality);
          const value45 = fn3(pm25);
          const value46 = ["unknown", "unavailable"].includes(
            String(value44?.state || "").toLowerCase(),
          )
            ? ""
            : String(value44?.state || "").trim();
          const numeric = Number(value45?.state);
          const value47 = value46.toLowerCase();
          let value48 = value46;
          let value49 = "unknown";
          if (/excellent|优/.test(value47)) {
            value49 = "excellent";
          } else if (/good|良/.test(value47)) {
            value49 = "good";
          } else if (/moderate|fair|一般|轻度|污染/.test(value47)) {
            value49 = "warning";
          } else if (/poor|unhealthy|较差|中度|重度|严重/.test(value47)) {
            value49 = "poor";
          } else if (Number.isFinite(numeric)) {
            value49 =
              numeric <= 15
                ? "excellent"
                : numeric <= 35
                  ? "good"
                  : numeric <= 75
                    ? "warning"
                    : "poor";
            value48 = {
              excellent: "空气优",
              good: "空气良",
              warning: "轻度污染",
              poor: "空气较差",
            }[value49];
          }
          element12.textContent = value48 || "--";
          element9.style.setProperty(
            "--hb-air-purifier-progress",
            {
              excellent: 72,
              good: 58,
              warning: 42,
              poor: 26,
              unknown: 0,
            }[value49] + "%",
          );
          element9.classList.toggle("is-warning", value49 === "warning");
          element9.classList.toggle("is-poor", value49 === "poor");
          const value50 = {
            excellent: "#76cfa1",
            good: "#76cfa1",
            warning: "#e4b15f",
            poor: "#db7770",
            unknown: "#7d8990",
          }[value49];
          const value51 = {
            excellent: "rgba(118,207,161,.13)",
            good: "rgba(118,207,161,.13)",
            warning: "rgba(228,177,95,.15)",
            poor: "rgba(219,119,112,.15)",
            unknown: "rgba(125,137,144,.13)",
          }[value49];
          element3.style.setProperty("--hb-air-purifier-accent", value50);
          element3.style.setProperty("--hb-air-purifier-accent-soft", value51);
        };
        if (airQuality) {
          fn(airQuality, fn5);
        }
        if (pm25 && pm25 !== airQuality) {
          fn(pm25, fn5);
        }
        fn5();
        const fn6 = (value44 = value23) => {
          value23 = value44 || value23;
          const value45 = String(value23?.state || "").toLowerCase();
          const value46 = ["unknown", "unavailable"].includes(value45);
          const value47 = !value46 && value45 !== "off";
          element8.textContent = value47 ? "ON" : "OFF";
          element7.classList.toggle("is-on", value47);
          element7.classList.toggle("is-unavailable", value46);
          element7.setAttribute("aria-pressed", String(value47));
          element7.setAttribute(
            "aria-label",
            "" +
              element5.textContent +
              (value47 ? "已开启，点击关闭" : "已关闭，点击开启"),
          );
          element6.textContent = value46
            ? "当前不可用"
            : value47
              ? "已开启"
              : "已关闭";
          element6.classList.toggle("is-live", value47);
          element13.textContent = value46
            ? "设备不可用"
            : value47
              ? "净化中"
              : "已关闭";
          element9.classList.toggle("is-running", value47);
          element10.classList.toggle("is-running", value47);
          value30.syncCapabilityState?.(value23);
        };
        fn6();
        let value43 = false;
        element7.addEventListener("click", async () => {
          if (
            preview ||
            value43 ||
            ["unknown", "unavailable"].includes(
              String(value23?.state || "").toLowerCase(),
            )
          ) {
            return;
          }
          value43 = true;
          element7.setAttribute("aria-busy", "true");
          const value44 = value23;
          const value45 = String(value44?.state || "").toLowerCase() === "off";
          fn6({
            ...value44,
            state: value45 ? "on" : "off",
          });
          try {
            await this.callEntityService(
              "fan",
              value45 ? "turn_on" : "turn_off",
              entityId,
            );
          } catch (error) {
            fn6(value44);
            this.options.onError?.(error);
          } finally {
            value43 = false;
            element7.removeAttribute("aria-busy");
          }
        });
        fn(entityId, fn6);
        element4.append(element7);
        value32.append(value33, value42);
        value31.append(value32, value38);
        element3.append(value31);
      } else if (component3.type === "media-player") {
        element5.textContent = popupModuleDialogTitle(
          component3,
          value21,
          "媒体",
        );
        element3.classList.add("hb-media-player-details");
        const element7 = document.createElement("div");
        element7.className = "hb-media-speaker-visual";
        element7.setAttribute("aria-hidden", "true");
        value9.push(element7);
        const value23 = document.createElement("i");
        value23.className = "hb-media-speaker-body";
        const value24 = document.createElement("img");
        value24.className = "hb-media-speaker-artwork";
        value24.alt = "";
        value24.hidden = true;
        const value25 = document.createElement("i");
        value25.className = "hb-media-speaker-light";
        element7.append(value23, value24, value25);
        element4.append(element7);
        const value26 = document.createElement("div");
        value26.className =
          "hb-media-player-details-body hb-custom-media-player-body";
        const element8 = document.createElement("section");
        element8.className = "hb-media-player-now-playing";
        const value27 = document.createElement("img");
        value27.className = "hb-media-player-artwork";
        value27.alt = "";
        value27.hidden = true;
        const value28 = document.createElement("div");
        value28.className = "hb-media-player-copy";
        const element9 = document.createElement("strong");
        const element10 = document.createElement("span");
        const value29 = document.createElement("div");
        value29.className = "hb-media-player-progress";
        value29.hidden = true;
        const element11 = document.createElement("progress");
        element11.max = 1;
        element11.value = 0;
        const value30 = document.createElement("span");
        const element12 = document.createElement("time");
        const element13 = document.createElement("time");
        value30.append(element12, element13);
        value29.append(element11, value30);
        value28.append(element9, element10, value29);
        element8.append(value27, value28);
        const value31 = document.createElement("div");
        value31.className = "hb-media-player-actions";
        const fn3 = (value52, value53) => {
          const element18 = document.createElement("button");
          element18.type = "button";
          element18.textContent = value52;
          element18.addEventListener("click", async () => {
            if (!preview) {
              element18.disabled = true;
              try {
                await this.callEntityService("media_player", value53, entityId);
              } catch (error) {
                this.options.onError?.(error);
              } finally {
                element18.disabled = false;
              }
            }
          });
          value31.append(element18);
          return element18;
        };
        const value32 = fn3("上一曲", "media_previous_track");
        const element14 = fn3("播放", "media_play_pause");
        const value33 = fn3("下一曲", "media_next_track");
        const value34 = this.createMediaBrowserControl(entityId, {
          preview: preview,
        });
        value8.push(() => value34.cleanup?.());
        const value35 = document.createElement("section");
        value35.className = "hb-capability-range-group";
        const value36 = document.createElement("div");
        value36.className = "hb-capability-range-heading";
        const element15 = document.createElement("strong");
        element15.textContent = "音量";
        const element16 = document.createElement("output");
        value36.append(element15, element16);
        const element17 = document.createElement("input");
        element17.type = "range";
        element17.min = "0";
        element17.max = "1";
        element17.step = ".01";
        element17.disabled = preview;
        value35.append(value36, element17);
        let value37 = "";
        let value38 = null;
        let value39 = 0;
        let value40 = null;
        let value41 = false;
        let value42 = null;
        let value43 = null;
        let value44 = null;
        let value45 = null;
        let value46 = false;
        let value47 = null;
        let value48 = null;
        const fn4 = (value52) => {
          const count = Math.max(0, Math.floor(Number(value52) || 0));
          return (
            Math.floor(count / 60) + ":" + String(count % 60).padStart(2, "0")
          );
        };
        const fn5 = () => {
          if (!Number.isFinite(value38) || value38 <= 0) {
            value29.hidden = true;
            return;
          }
          let value52 = Number.isFinite(value39) ? value39 : 0;
          if (value41 && Number.isFinite(value40)) {
            value52 += Math.max(0, (Date.now() - value40) / 1000);
          }
          value52 = Math.max(0, Math.min(value38, value52));
          value29.hidden = false;
          element11.max = value38;
          element11.value = value52;
          element12.textContent = fn4(value52);
          element13.textContent = fn4(value38);
        };
        const value49 = window.setInterval(fn5, 1000);
        value8.push(() => {
          window.clearInterval(value49);
          window.clearTimeout(value47);
          window.clearTimeout(value48);
        });
        value27.addEventListener("error", () => {
          value27.hidden = true;
          element8.classList.remove("has-artwork");
        });
        value27.addEventListener("load", () => {
          value27.hidden = false;
          element8.classList.add("has-artwork");
        });
        value24.addEventListener("error", () => {
          value24.hidden = true;
          element7.classList.remove("has-artwork");
        });
        value24.addEventListener("load", () => {
          value24.hidden = false;
          element7.classList.add("has-artwork");
        });
        const fn6 = (value52, value53) =>
          Number.isFinite(value52) &&
          Number.isFinite(value53) &&
          Math.abs(value52 - value53) <= 0.005;
        const fn7 = (value52) => {
          value42 = Math.max(0, Math.min(1, Number(value52) || 0));
          element17.value = String(value42);
          element16.textContent = Math.round(value42 * 100) + "%";
        };
        const value50 = async () => {
          window.clearTimeout(value47);
          value47 = null;
          if (value46 || value45 === null) {
            return;
          }
          const volume_level = value45;
          value45 = null;
          value46 = true;
          try {
            await this.callEntityService(
              "media_player",
              "volume_set",
              entityId,
              {
                volume_level: volume_level,
              },
            );
          } catch (error) {
            value45 = null;
            value44 = null;
            window.clearTimeout(value48);
            if (value43 !== null) {
              fn7(value43);
            }
            this.options.onError?.(error);
          } finally {
            value46 = false;
            if (value45 !== null && !fn6(value45, volume_level)) {
              value47 = window.setTimeout(value50, 140);
            }
          }
        };
        const value51 = () => {
          const count = Math.max(0, Math.min(1, Number(element17.value) || 0));
          value44 = count;
          value45 = count;
          window.clearTimeout(value48);
          if (!value46) {
            window.clearTimeout(value47);
            value47 = window.setTimeout(value50, 120);
          }
        };
        element17.addEventListener("input", () => fn7(element17.value));
        element17.addEventListener("change", value51);
        const fn8 = (value52) => {
          const value53 = value52?.attributes || {};
          const value54 = String(value52?.state || "unknown").toLowerCase();
          const numeric = Number(value53.supported_features || 0);
          value34.sync(value52);
          const value55 = {
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
            value55[value54] || value52?.state || "未知状态";
          element6.classList.toggle(
            "is-live",
            ["playing", "paused"].includes(value54),
          );
          element9.textContent =
            value53.media_title ||
            value53.media_series_title ||
            value53.app_name ||
            value53.source ||
            "暂无播放内容";
          element10.textContent =
            [value53.media_artist, value53.media_album_name]
              .filter(Boolean)
              .join(" · ") ||
            value53.media_content_type ||
            "媒体播放器";
          element14.textContent = value54 === "playing" ? "暂停" : "播放";
          element14.disabled =
            preview || ["off", "unavailable", "unknown"].includes(value54);
          value32.disabled = preview || !(numeric & 16);
          value33.disabled = preview || !(numeric & 32);
          element7.classList.toggle("is-playing", value54 === "playing");
          element7.classList.toggle("is-paused", value54 === "paused");
          element7.classList.toggle(
            "is-off",
            ["off", "unavailable", "unknown"].includes(value54),
          );
          value38 = Number.isFinite(Number(value53.media_duration))
            ? Number(value53.media_duration)
            : null;
          value39 = Number.isFinite(Number(value53.media_position))
            ? Number(value53.media_position)
            : 0;
          const value56 = Date.parse(
            String(value53.media_position_updated_at || ""),
          );
          value40 = Number.isFinite(value56) ? value56 : null;
          value41 = value54 === "playing";
          fn5();
          const numeric2 = Number(value53.volume_level);
          value35.hidden = !Number.isFinite(numeric2);
          if (Number.isFinite(numeric2)) {
            if (value44 === null) {
              value43 = numeric2;
              fn7(numeric2);
            } else if (fn6(numeric2, value44)) {
              value43 = numeric2;
              fn7(value44);
              window.clearTimeout(value48);
              value48 = window.setTimeout(() => {
                value44 = null;
              }, 1800);
            } else {
              window.clearTimeout(value48);
            }
          }
          const value57 =
            [
              value53.entity_picture_local,
              value53.entity_picture,
              value53.media_image_url,
            ]
              .map((value58) => String(value58 || "").trim())
              .find(
                (value58) =>
                  value58.startsWith("/api/media_player_proxy/") ||
                  value58.startsWith("/api/image_proxy/"),
              ) || "";
          if (value57 !== value37) {
            value37 = value57;
            value27.hidden = !value37;
            value24.hidden = !value37;
            element8.classList.toggle("has-artwork", !!value37);
            element7.classList.toggle("has-artwork", !!value37);
            if (value37) {
              value27.src = value37;
              value24.src = value37;
            } else {
              value27.removeAttribute("src");
              value24.removeAttribute("src");
            }
          }
        };
        element8.append(value34.root);
        fn8(value21);
        fn(entityId, fn8);
        value26.append(element8, value31, value35);
        value10.push(value34.panel);
        element3.append(value26);
      } else {
        const element7 = document.createElement("p");
        element7.className = "hb-custom-popup-generic";
        const fn3 = (value23) => {
          element7.textContent = "当前状态：" + (value23?.state ?? "暂无状态");
        };
        fn3(value21);
        fn(entityId, fn3);
        element3.append(element7);
      }
      value7.append(element3);
    }
    if (!(value.modules || []).length) {
      const element3 = document.createElement("p");
      element3.className = "hb-custom-popup-generic";
      element3.textContent = "这个组合弹窗还没有添加模块。";
      value7.append(element3);
    }
    value2.append(value5, value7, ...value10);
    dialog.append(value2);
    const value13 = document.createElement("div");
    value13.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value13.tabIndex = -1;
    value13.append(dialog);
    this.container.append(value13);
    this.detailsDialog = dialog;
    const fn2 = (value15) =>
      value15
        .map((value16) => {
          const value17 =
            value16.type === "electric-bed"
              ? this.deviceProfile(this.runtimeEntityId(value16.entityId))
              : null;
          const value18 =
            value17?.deviceType === "electric-bed" ? value17.roles || {} : {};
          return [
            value16.id,
            value17?.deviceType || value16.type || "generic",
            "backrest",
            "leg",
            "waist",
            "mode",
            "memory1",
            "memory2",
          ]
            .map((value19) =>
              String(
                value19 === value16.id ? value16.id : value18[value19] || "",
              ),
            )
            .join(":");
        })
        .join("|");
    const value14 = fn2(value3);
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
      refreshHistory: () =>
        value12.forEach((refreshHistory) => refreshHistory()),
      refreshEntityCatalog: () => {
        if (this.detailsDialog === dialog && !!dialog.open) {
          if (fn2(value3) !== value14) {
            this.showCustomPopup(value, {
              preview: preview,
            });
          }
        }
      },
    };
    this.registerRuntimeDialogScale(value13, dialog, popupWidth, popupHeight);
    element2.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value13, dialog, value2);
    value13.addEventListener("keydown", (value15) => {
      if (value15.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        for (const fn3 of value8.splice(0)) {
          fn3();
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
          this.activePopupId === String(value?.id || "")
        ) {
          this.activePopupId = null;
          this.historyPopupGeneration += 1;
          this.connectRuntime();
          this.refreshHistorySeries();
        }
        value13.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
    this.refreshHistorySeries();
    for (const value15 of value9) {
      const value16 = playMediaSpeakerEntrance(value15);
      if (value16) {
        value8.push(() => value16.cancel());
      }
    }
    for (const value15 of value11) {
      const value16 = playFixedDeviceDropEntrance(value15.visual, value15);
      if (value16) {
        value8.push(() => value16.cancel());
      }
    }
  }
  createLightDetailsControls(
    value,
    value2,
    {
      interactive: value3 = true,
      onTurnOn: value4 = null,
      onVisualChange: value5 = null,
    } = {},
  ) {
    const value6 = value2?.attributes || {};
    const value7 = value.startsWith("light.");
    const value8 = value7 && lightSupportsColor(value6);
    const { brightness: supported, colorTemperature: supported2 } =
      lightRealtimeCapabilities(value, value2);
    const value9 = supported2 && !value8;
    const element = document.createElement("section");
    element.className = "hb-light-details-controls";
    element.classList.toggle("has-color-picker", value8);
    element.inert = !value3;
    const index = new Map();
    const fn = ({
      label: value26,
      value: value27,
      minimum: value28,
      maximum: value29,
      step: value30,
      suffix: value31,
      dataKey: value32,
      className: value36 = "",
      icon: value33,
      minimumLabel: value34,
      maximumLabel: value35,
      supported: supported3 = true,
    }) => {
      const element3 = document.createElement("label");
      element3.className = ("hb-light-details-slider " + value36).trim();
      element3.classList.toggle("is-unavailable", !supported3);
      const value37 = document.createElement("span");
      value37.className = "hb-light-details-slider-heading";
      const element4 = document.createElement("i");
      element4.className = "hb-light-details-slider-icon";
      element4.setAttribute("aria-hidden", "true");
      element4.textContent = value33;
      const element5 = document.createElement("strong");
      element5.textContent = value26;
      const element6 = document.createElement("output");
      const count = Math.max(value28, Math.min(value29, value27));
      element6.textContent = "" + Math.round(count) + value31;
      value37.append(element4, element5, element6);
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(value28);
      input.max = String(value29);
      input.step = String(value30);
      input.value = String(count);
      input.disabled = !supported3;
      const updateSliderValue = ({ notify: value39 = false } = {}) => {
        const brightnessPercent = Number(input.value);
        const value40 =
          ((brightnessPercent - value28) / Math.max(1, value29 - value28)) *
          100;
        element6.textContent = supported3
          ? "" + Math.round(brightnessPercent) + value31
          : "不支持";
        input.style.setProperty(
          "--hb-light-slider-progress",
          Math.max(0, Math.min(100, value40)) + "%",
        );
        if (value39 && supported3) {
          value5?.(
            value32 === "brightness_pct"
              ? {
                  brightnessPercent: brightnessPercent,
                }
              : {
                  colorTemperatureKelvin: brightnessPercent,
                },
          );
        }
      };
      updateSliderValue();
      input.addEventListener("input", () => {
        fn2();
        updateSliderValue({
          notify: true,
        });
      });
      input.addEventListener("change", async () => {
        if (!!value3 && !!supported3) {
          try {
            await this.callEntityService("light", "turn_on", value, {
              [value32]: Number(input.value),
            });
            value4?.();
          } catch (error) {
            this.options.onError?.(error);
            element6.textContent = "设置失败";
          }
        }
      });
      const value38 = document.createElement("span");
      value38.className = "hb-light-details-slider-legend";
      const element7 = document.createElement("small");
      element7.textContent = value34;
      const element8 = document.createElement("small");
      element8.textContent = value35;
      value38.append(element7, element8);
      element3.append(value37, input, value38);
      element.append(element3);
      index.set(value32, {
        input: input,
        updateSliderValue: updateSliderValue,
        supported: supported3,
      });
    };
    let element2 = null;
    let value11 = null;
    let value12 = false;
    if (value8) {
      const list = Array.isArray(value6.hs_color)
        ? value6.hs_color
        : rgbToHsColor(value6.rgb_color) || [0, 100];
      value11 = {
        hue: Number(list[0]) || 0,
        saturation: Number(list[1]) || 0,
      };
      element2 = document.createElement("div");
      element2.className = "hb-light-color-picker";
      element2.setAttribute("role", "slider");
      element2.setAttribute("tabindex", value3 ? "0" : "-1");
      element2.setAttribute("aria-label", "选择灯光颜色");
      const value26 = document.createElement("i");
      value26.className = "hb-light-color-picker-glow";
      const value27 = document.createElement("i");
      value27.className = "hb-light-color-picker-handle";
      element2.append(value26, value27);
      const fn6 = () =>
        lightColorPickerPointFromHs([value11.hue, value11.saturation]);
      const fn7 = ({
        hue: value29 = value11.hue,
        saturation: value30 = value11.saturation,
      } = {}) => {
        value11.hue = (((Number(value29) || 0) % 360) + 360) % 360;
        value11.saturation = Math.max(0, Math.min(100, Number(value30) || 0));
        const value31 = fn6();
        const colorRgb = hsToRgbColor([value11.hue, value11.saturation]);
        const value32 = "rgb(" + colorRgb.join(",") + ")";
        element2.style.setProperty(
          "--hb-light-color-picker-x",
          value31.x * 100 + "%",
        );
        element2.style.setProperty(
          "--hb-light-color-picker-y",
          value31.y * 100 + "%",
        );
        element2.style.setProperty("--hb-light-color-picker-color", value32);
        element2.setAttribute(
          "aria-valuetext",
          "色相 " +
            Math.round(value11.hue) +
            " 度，饱和度 " +
            Math.round(value11.saturation) +
            "%",
        );
        value5?.({
          colorHs: [value11.hue, value11.saturation],
          colorRgb: colorRgb,
        });
      };
      const fn8 = (value29) => {
        const value30 = element2.getBoundingClientRect();
        if (!value30.width || !value30.height) {
          return;
        }
        const count = Math.max(
          0,
          Math.min(1, (value29.clientX - value30.left) / value30.width),
        );
        const count2 = Math.max(
          0,
          Math.min(1, (value29.clientY - value30.top) / value30.height),
        );
        const [hue, saturation] = lightColorPickerHsFromPoint(count, count2);
        fn7({
          hue: hue,
          saturation: saturation,
        });
      };
      const fn9 = async () => {
        if (!!value3 && !value12) {
          value12 = true;
          element2.setAttribute("aria-busy", "true");
          try {
            await this.callEntityService(
              "light",
              "turn_on",
              value,
              lightColorServiceData(value6, [value11.hue, value11.saturation]),
            );
            value4?.();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            value12 = false;
            element2.removeAttribute("aria-busy");
          }
        }
      };
      element2.addEventListener("pointerdown", (event) => {
        if (value3) {
          element2.setPointerCapture?.(event.pointerId);
          element2.dataset.dragging = "true";
          fn8(event);
          event.preventDefault();
        }
      });
      element2.addEventListener("pointermove", (value29) => {
        if (element2.dataset.dragging === "true") {
          fn8(value29);
        }
      });
      const value28 = async (value29) => {
        if (element2.dataset.dragging === "true") {
          element2.dataset.dragging = "false";
          element2.releasePointerCapture?.(value29.pointerId);
          await fn9();
        }
      };
      element2.addEventListener("pointerup", value28);
      element2.addEventListener("pointercancel", value28);
      element2.addEventListener("keydown", async (event) => {
        if (!value3) {
          return;
        }
        const value29 = event.shiftKey ? 10 : 3;
        let { hue: hue, saturation: saturation } = value11;
        if (event.key === "ArrowLeft") {
          hue -= value29;
        } else if (event.key === "ArrowRight") {
          hue += value29;
        } else if (event.key === "ArrowUp") {
          saturation -= value29;
        } else if (event.key === "ArrowDown") {
          saturation += value29;
        } else if (event.key === "Enter" || event.key === " ") {
          await fn9();
          event.preventDefault();
          return;
        } else {
          return;
        }
        fn7({
          hue: hue,
          saturation: saturation,
        });
        event.preventDefault();
      });
      element2.syncColorPicker = fn7;
      element2.cleanupColorPicker = () => {
        element2.dataset.dragging = "false";
      };
      fn7();
      element.append(element2);
    }
    const value13 = Number.isFinite(Number(value6.max_mireds))
      ? 1000000 / Number(value6.max_mireds)
      : 2000;
    const value14 = Number.isFinite(Number(value6.min_mireds))
      ? 1000000 / Number(value6.min_mireds)
      : 6500;
    const value15 = Number(value6.min_color_temp_kelvin) || value13;
    const value16 = Number(value6.max_color_temp_kelvin) || value14;
    const value17 = Number.isFinite(Number(value6.color_temp))
      ? 1000000 / Number(value6.color_temp)
      : value15;
    const value18 = Number(value6.color_temp_kelvin) || value17;
    if (!value8) {
      fn({
        label: "色温",
        value: value18,
        minimum: Math.round(value15),
        maximum: Math.round(value16),
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
    const value19 = Number.isFinite(Number(value6.brightness))
      ? (Number(value6.brightness) / 255) * 100
      : 100;
    fn({
      label: "亮度",
      value: value19,
      minimum: 1,
      maximum: 100,
      step: 1,
      suffix: "%",
      dataKey: "brightness_pct",
      className: "hb-light-details-brightness",
      icon: "☀",
      minimumLabel: "暗",
      maximumLabel: "亮",
      supported: supported,
    });
    let value20 = null;
    let value21 = 0;
    let value22 = value2;
    const fn2 = ({ resync: value26 = false } = {}) => {
      window.clearTimeout(value21);
      value21 = 0;
      value20 = null;
      if (value26) {
        element.syncLightState?.(value22);
      }
    };
    const fn3 = () => {
      window.clearTimeout(value21);
      value21 = 0;
      if (!value20) {
        return;
      }
      const value26 = Date.now();
      const value27 = lightPresetPendingDecision(value20, value26);
      if (value27 === "confirmed" || value27 === "timeout") {
        fn2({
          resync: true,
        });
        return;
      }
      const value28 = value20.latestMatches
        ? Math.min(
            value20.expiresAt,
            Math.max(
              value20.minimumHoldUntil,
              value20.matchStartedAt + LIGHT_PRESET_STABLE_CONFIRMATION_MS,
            ),
          )
        : value20.expiresAt;
      value21 = window.setTimeout(fn3, Math.max(50, value28 - value26));
    };
    const value23 = LIGHT_DETAIL_PRESET_DEFINITIONS;
    const fn4 = (value26) =>
      relativeLightColorTemperature(
        value15,
        value16,
        value26.colorTemperaturePercent,
      );
    const value24 = document.createElement("div");
    value24.className = "hb-light-details-presets";
    value24.hidden = value8 || (!supported && !value9);
    const value25 = value23.map((value26) => {
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = !value7;
      const element3 = document.createElement("strong");
      element3.textContent = value26.label;
      const element4 = document.createElement("small");
      element4.textContent = supported ? value26.detail : "开启";
      button.append(element3, element4);
      button.addEventListener("click", async () => {
        if (!value3 || !value7) {
          return;
        }
        const colorTemperatureKelvin = fn4(value26);
        const value27 = {};
        if (supported) {
          Object.assign(
            value27,
            lightPresetBrightnessServiceData(value26.brightnessPercent),
          );
        }
        if (value9) {
          value27.color_temp_kelvin = Math.round(colorTemperatureKelvin);
        }
        window.clearTimeout(value21);
        const value28 = Date.now();
        value20 = {
          brightnessPercent: value26.brightnessPercent,
          colorTemperatureKelvin: colorTemperatureKelvin,
          minimumHoldUntil: value28 + LIGHT_PRESET_MINIMUM_HOLD_MS,
          expiresAt: value28 + LIGHT_PRESET_MAXIMUM_HOLD_MS,
          latestMatches: false,
          matchStartedAt: null,
        };
        fn3();
        const value29 = index.get("brightness_pct");
        if (value29?.supported) {
          value29.input.value = String(value26.brightnessPercent);
          value29.updateSliderValue({
            notify: true,
          });
        }
        const value30 = index.get("color_temp_kelvin");
        if (value30?.supported) {
          value30.input.value = String(colorTemperatureKelvin);
          value30.updateSliderValue({
            notify: true,
          });
        }
        for (const value31 of value25) {
          value31.button.classList.toggle(
            "is-active",
            value31.button === button,
          );
        }
        value5?.({
          isOn: true,
          ...(supported
            ? {
                brightnessPercent: value26.brightnessPercent,
              }
            : {}),
          ...(value9
            ? {
                colorTemperatureKelvin: colorTemperatureKelvin,
              }
            : {}),
        });
        value4?.();
        try {
          await this.callEntityService("light", "turn_on", value, value27);
        } catch (error) {
          fn2({
            resync: true,
          });
          button.classList.remove("is-active");
          this.options.onError?.(error);
        }
      });
      value24.append(button);
      return {
        button: button,
        ...value26,
      };
    });
    element.append(value24);
    const fn5 = (value26) => {
      const value27 = value26?.attributes || {};
      const value28 = value26?.state === "on";
      const value29 = Number.isFinite(Number(value27.brightness))
        ? (Number(value27.brightness) / 255) * 100
        : NaN;
      const value30 = Number.isFinite(Number(value27.color_temp))
        ? 1000000 / Number(value27.color_temp)
        : NaN;
      const value31 = Number(value27.color_temp_kelvin) || value30;
      for (const value32 of value25) {
        const value33 = fn4(value32);
        const count = Math.max(50, (value16 - value15) * 0.06);
        const value34 =
          !supported ||
          (Number.isFinite(value29) &&
            Math.abs(value29 - value32.brightnessPercent) <= 4);
        const value35 =
          !value9 ||
          (Number.isFinite(value31) && Math.abs(value31 - value33) <= count);
        value32.button.classList.toggle(
          "is-active",
          value28 && value34 && value35,
        );
      }
    };
    fn5(value2);
    element.syncLightState = (value26) => {
      if (!value26) {
        return;
      }
      value22 = value26;
      const value27 = value26.attributes || {};
      const value28 = index.get("color_temp_kelvin");
      const value29 = Number.isFinite(Number(value27.color_temp))
        ? 1000000 / Number(value27.color_temp)
        : NaN;
      const value30 = Number(value27.color_temp_kelvin) || value29;
      const value31 = index.get("brightness_pct");
      const value32 = Number.isFinite(Number(value27.brightness))
        ? (Number(value27.brightness) / 255) * 100
        : NaN;
      if (value20) {
        const value35 =
          !supported ||
          (Number.isFinite(value32) &&
            Math.abs(value32 - value20.brightnessPercent) <= 4);
        const value36 =
          !value9 ||
          (Number.isFinite(value30) &&
            Math.abs(value30 - value20.colorTemperatureKelvin) <= 220);
        const value37 = value35 && value36;
        if (value37 && !value20.latestMatches) {
          value20.matchStartedAt = Date.now();
        }
        if (!value37) {
          value20.matchStartedAt = null;
        }
        value20.latestMatches = value37;
        fn3();
      }
      const value33 = value20?.colorTemperatureKelvin ?? value30;
      const value34 = value20?.brightnessPercent ?? value32;
      if (value28?.supported && Number.isFinite(value33)) {
        value28.input.value = String(value33);
        value28.updateSliderValue();
      }
      if (value31?.supported && Number.isFinite(value34)) {
        value31.input.value = String(value34);
        value31.updateSliderValue();
      }
      if (element2) {
        const list = Array.isArray(value27.hs_color)
          ? value27.hs_color
          : rgbToHsColor(value27.rgb_color);
        if (list) {
          element2.syncColorPicker({
            hue: list[0],
            saturation: list[1],
          });
        }
      }
      fn5(
        value20
          ? {
              state: "on",
              attributes: {
                ...value27,
                ...(supported
                  ? {
                      brightness: (value20.brightnessPercent / 100) * 255,
                    }
                  : {}),
                ...(value9
                  ? {
                      color_temp_kelvin: value20.colorTemperatureKelvin,
                    }
                  : {}),
              },
            }
          : value26,
      );
      const colorTemperatureKelvin = lightVisualValueForCapability(
        value9,
        value33,
        UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN,
      );
      const brightnessPercent = lightVisualValueForCapability(
        supported,
        value34,
        UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT,
      );
      value5?.({
        isOn: value26.state === "on",
        colorTemperatureKelvin: colorTemperatureKelvin,
        brightnessPercent: brightnessPercent,
      });
    };
    element.syncLightState(value2);
    element.cleanupLightDetails = () => {
      fn2();
      element2?.cleanupColorPicker?.();
    };
    return element;
  }
  createCoverDetailsControls(
    value,
    value2,
    {
      interactive: value3 = true,
      dream: value4 = false,
      airer: value5 = false,
      tilt: value6 = false,
      motorReversed: value7 = false,
      positionState: value8 = null,
      positionCommandEntityId: value9 = "",
      positionCommandState: value10 = null,
      motorState: value11 = null,
      airerActionEntityIds: value12 = {},
      positionCalibration: value13 = {},
      onVisualChange: value14 = null,
      onCurtainPositionChange: value15 = null,
    } = {},
  ) {
    const value16 = document.createElement("section");
    value16.className = "hb-cover-details-controls";
    value16.inert = !value3;
    const value17 = document.createElement("label");
    value17.className = "hb-cover-details-position";
    const value18 = document.createElement("span");
    value18.className = "hb-cover-details-position-heading";
    const element = document.createElement("strong");
    element.textContent = value4
      ? "叶片角度"
      : value5
        ? "晾杆高度"
        : "开合位置";
    const element2 = document.createElement("output");
    value18.append(element, element2);
    const element3 = document.createElement("input");
    element3.type = "range";
    element3.min = "0";
    element3.max = "100";
    element3.step = "1";
    const value19 = document.createElement("span");
    value19.className = "hb-cover-details-position-legend";
    if (value4) {
      value19.append(
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
    } else if (value5) {
      value19.append(
        Object.assign(document.createElement("small"), {
          textContent: "下降",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "升起",
        }),
      );
    } else {
      value19.append(
        Object.assign(document.createElement("small"), {
          textContent: "关闭",
        }),
        Object.assign(document.createElement("small"), {
          textContent: "打开",
        }),
      );
    }
    value17.append(value18, element3, value19);
    const value20 = document.createElement("div");
    value20.className = "hb-cover-details-actions";
    const value21 = "open_cover";
    const service = "stop_cover";
    const value22 = "close_cover";
    const service2 = value7 ? value21 : value22;
    const service3 = value7 ? value22 : value21;
    let retracted = dreamCurtainIsRetracted(value2?.state, value7);
    const value23 = (
      value4
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
              service: service,
            },
            {
              label: "开启",
              icon: "→",
              service: service3,
              curtainRetracted: true,
            },
          ]
        : value5
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
                service: service,
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
                service: service,
              },
              {
                label: "打开",
                icon: "→",
                service: service3,
              },
            ]
    ).map((value35) => {
      const element4 = document.createElement("button");
      element4.type = "button";
      element4.dataset.coverAction = value35.service;
      const element5 = document.createElement("i");
      element5.textContent = value35.icon;
      element5.setAttribute("aria-hidden", "true");
      const element6 = document.createElement("strong");
      element6.textContent = value35.label;
      element4.append(element5, element6);
      element4.addEventListener("click", async () => {
        if (value3) {
          if (value4 && typeof value35.curtainRetracted == "boolean") {
            value16.beginDreamCurtainMotion?.(value35.curtainRetracted);
          }
          if (!value4 && value35.service === service3) {
            value16.beginCoverMotion?.(100, "opening");
          } else if (!value4 && value35.service === service2) {
            value16.beginCoverMotion?.(0, "closing");
          } else {
            value16.stopCoverMotion?.();
          }
          element4.classList.add("is-pending");
          try {
            const value36 =
              value5 && value35.action ? value12[value35.action] : "";
            if (value5 && value9 && ["up", "down"].includes(value35.action)) {
              const value37 = value35.action === "up" ? 100 : 0;
              const value38 = airerDevicePosition(value37, value13);
              await this.callEntityService("number", "set_value", value9, {
                value: value38,
              });
            } else if (value5 && value35.action === "pause") {
              await this.callEntityService("cover", service, value);
            } else if (value36) {
              await this.callEntityService("button", "press", value36);
            } else {
              await this.callEntityService("cover", value35.service, value);
            }
          } catch (error) {
            value16.cancelDreamCurtainMotion?.();
            value16.cancelCoverMotion?.();
            value16.syncCoverState?.(value2);
            this.options.onError?.(error);
          } finally {
            element4.classList.remove("is-pending");
          }
        }
      });
      value20.append(element4);
      return element4;
    });
    let value24 = value8;
    let value25 = value10;
    let value26 = value11;
    const fn = () => {
      if (value5) {
        learnAirerPositionCalibration(
          value13,
          value24?.state,
          value25?.state,
          value26?.state,
        );
      }
    };
    fn();
    let text = String(value2?.state || "");
    const fn2 = (value35) => {
      const value36 = value5
        ? airerReportedPosition(value24, value35, value13)
        : Number(
            value35?.attributes?.[
              value6 ? "current_tilt_position" : "current_position"
            ],
          );
      if (Number.isFinite(value36)) {
        const count = Math.max(0, Math.min(100, value36));
        if (value5) {
          return airerPresentationPositionForState(
            count,
            text || value35?.state,
            value13,
            value7,
          );
        } else {
          return count;
        }
      }
      if (value35?.state === "open") {
        return 100;
      } else {
        return 0;
      }
    };
    let value27 = value2;
    let value28 = fn2(value2);
    let position = value28;
    let value29 = false;
    let value30 = 0;
    let value31 = null;
    let value32 = null;
    let value33 = 0;
    let value34 = null;
    const fn3 = () => {
      window.cancelAnimationFrame(value30);
      value30 = 0;
    };
    const fn4 = (value35, state = "") => {
      position = Math.max(0, Math.min(100, Number(value35) || 0));
      element3.value = String(position);
      element3.style.setProperty(
        "--hb-cover-position-progress",
        position + "%",
      );
      element2.textContent = Math.round(position) + "%";
      for (const element4 of value23) {
        element4.classList.toggle(
          "is-active",
          element4.dataset.coverAction ===
            (state === "opening"
              ? value21
              : state === "closing"
                ? value22
                : ""),
        );
      }
      value14?.({
        position: position,
        state: state,
      });
    };
    value16.setDreamCurtainRetracted = (value35, value36 = false) => {
      if (value4) {
        retracted = !!value35;
        element3.disabled = !value3;
        value15?.({
          retracted: retracted,
          moving: !!value36,
        });
      }
    };
    value16.isDreamCurtainRetracted = () => retracted;
    value16.beginDreamCurtainMotion = (value35) => {
      if (value4) {
        value34 = {
          target: !!value35,
          expiresAt: Date.now() + 10000,
        };
        value16.setDreamCurtainRetracted?.(value34.target, true);
      }
    };
    value16.cancelDreamCurtainMotion = () => {
      value34 = null;
    };
    value16.beginCoverMotion = (value35, state) => {
      fn3();
      value32 = null;
      value33 = 0;
      const initialPosition = position;
      const target = Math.max(0, Math.min(100, Number(value35) || 0));
      value31 = {
        direction: target >= initialPosition ? 1 : -1,
        target: target,
        state: state,
        initialPosition: initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (value5 ? 120000 : 10000),
      };
      const value36 = performance.now();
      const count = Math.max(900, Math.abs(target - initialPosition) * 28);
      const value37 = (value38) => {
        const value39 = Math.min(1, (value38 - value36) / count);
        const value40 = 1 - (1 - value39) ** 3;
        fn4(initialPosition + (target - initialPosition) * value40, state);
        if (value39 < 1) {
          value30 = window.requestAnimationFrame(value37);
        } else {
          value30 = 0;
        }
      };
      fn4(initialPosition, state);
      value30 = window.requestAnimationFrame(value37);
    };
    value16.stopCoverMotion = () => {
      fn3();
      value31 = null;
      fn4(position, "");
    };
    value16.cancelCoverMotion = () => {
      fn3();
      value31 = null;
    };
    value16.holdCoverPosition = (value35) => {
      fn3();
      value32 = null;
      value33 = 0;
      const target = Math.max(0, Math.min(100, Number(value35) || 0));
      const initialPosition = value28;
      const direction = target >= initialPosition ? 1 : -1;
      const state =
        value4 || Math.abs(target - initialPosition) < 0.5
          ? ""
          : direction > 0
            ? "opening"
            : "closing";
      value31 = {
        direction: direction,
        target: target,
        state: state,
        initialPosition: initialPosition,
        lastServerPosition: initialPosition,
        sawMotorRunning: false,
        ignoreStaleUntil: Date.now() + 4000,
        expiresAt: Date.now() + (value5 ? 120000 : 10000),
      };
      fn4(target, state);
    };
    const fn5 = (value35, { primary: value36 = false } = {}) => {
      if (value36) {
        value27 = value35 || value27;
        text = String(value35?.state || text);
      }
      if (value32 !== null && Date.now() >= value33) {
        value32 = null;
        value33 = 0;
      }
      const value37 = value5 && value32 !== null ? value32 : fn2(value35);
      value28 = value37;
      const text2 = String(value35?.state || "");
      if (value4) {
        const value38 = physicalCoverState(text2, value7);
        const value39 = dreamCurtainIsRetracted(text2, value7);
        if (value34 && value39 === value34.target) {
          const target = value34.target;
          value34 = null;
          value16.setDreamCurtainRetracted?.(target, false);
        } else if (value34 && Date.now() < value34.expiresAt) {
          value16.setDreamCurtainRetracted?.(value34.target, true);
        } else {
          value34 = null;
          value16.setDreamCurtainRetracted?.(
            value39,
            value38 === "opening" || value38 === "closing",
          );
        }
      }
      if (!value29) {
        if (value31) {
          const value38 = Date.now();
          const {
            direction: value39,
            target: value40,
            state: value41,
          } = value31;
          const value42 = coverPositionReachedTarget(value37, value40, value39);
          const value43 =
            (value40 <= 0.5 && text2 === "closed") ||
            (value40 >= 99.5 && text2 === "open");
          const numeric = Number(value26?.state);
          const value44 =
            value5 &&
            value31.sawMotorRunning &&
            Number.isFinite(numeric) &&
            Math.abs(numeric) < 0.5;
          if (
            value5
              ? value43 || (value44 && value42)
              : value42 || value43 || (value40 >= 99.5 && value37 >= 99.5)
          ) {
            fn3();
            if (value5) {
              value32 = value40;
              value33 = Date.now() + 120000;
            }
            value31 = null;
            fn4(value40, text2 || (value39 < 0 ? "closed" : "open"));
            return;
          }
          if (
            value39 < 0
              ? value37 < value31.lastServerPosition - 0.5 ||
                text2 === "closing"
              : value37 > value31.lastServerPosition + 0.5 ||
                text2 === "opening"
          ) {
            value31.lastServerPosition =
              value39 < 0
                ? Math.min(value31.lastServerPosition, value37)
                : Math.max(value31.lastServerPosition, value37);
            const value45 = coverPendingDisplayPosition(
              position,
              value37,
              value39,
            );
            fn4(value45, value41);
            return;
          }
          if (
            value38 < value31.ignoreStaleUntil ||
            (value5 && value38 < value31.expiresAt) ||
            (value38 < value31.expiresAt &&
              Math.abs(value37 - value31.initialPosition) < 0.5)
          ) {
            return;
          }
          fn3();
          value31 = null;
        } else {
          fn3();
        }
        fn4(value37, text2);
      }
    };
    element3.addEventListener("pointerdown", () => {
      value29 = true;
      fn3();
      value31 = null;
    });
    element3.addEventListener("input", () => {
      value29 = true;
      fn3();
      value31 = null;
      const numeric = Number(element3.value);
      fn4(numeric, value4 ? "" : numeric > 0 ? "open" : "closed");
    });
    element3.addEventListener("change", async () => {
      value29 = false;
      if (!value3) {
        return;
      }
      const numeric = Number(element3.value);
      const value35 = airerDevicePosition(numeric, value13);
      value16.holdCoverPosition(numeric);
      try {
        if (value5 && value9) {
          await this.callEntityService("number", "set_value", value9, {
            value: value35,
          });
        } else {
          await this.callEntityService(
            "cover",
            value6 ? "set_cover_tilt_position" : "set_cover_position",
            value,
            {
              [value6 ? "tilt_position" : "position"]: numeric,
            },
          );
        }
      } catch (error) {
        value16.cancelCoverMotion();
        fn5(value27);
        this.options.onError?.(error);
      }
    });
    element3.addEventListener("pointercancel", () => {
      value29 = false;
      fn5(value27);
    });
    value16.append(value17, value20);
    value16.syncCoverState = (value35) =>
      fn5(value35, {
        primary: true,
      });
    value16.syncCoverPositionState = (value35) => {
      value24 = value35 || value24;
      fn();
      fn5(value27);
    };
    value16.syncCoverPositionCommandState = (value35) => {
      value25 = value35 || value25;
      fn();
      fn5(value27);
    };
    value16.syncAirerMotorState = (value35) => {
      value26 = value35 || value26;
      const numeric = Number(value26?.state);
      if (value31 && Number.isFinite(numeric) && Math.abs(numeric) >= 0.5) {
        value31.sawMotorRunning = true;
      }
      fn();
      fn5(value27);
    };
    value16.cleanupCoverDetails = () => {
      fn3();
      value31 = null;
      value34 = null;
      value29 = false;
    };
    fn5(value2, {
      primary: true,
    });
    return value16;
  }
  createClimateDetailsControls(
    entityId,
    value,
    {
      interactive: value2 = true,
      onPowerChange: value3 = null,
      onVisualChange: value4 = null,
      modeColors: value5 = {},
      deviceType: value6 = "air-conditioner",
    } = {},
  ) {
    const climateCapabilities = normalizeClimateCapabilities(value);
    const attributes = climateCapabilities.attributes;
    const value8 = String(entityId || "").split(".", 1)[0];
    const value9 = {
      entityId: entityId,
      entityMetadata: this.entityMetadata,
      entityTranslations: this.entityTranslations,
    };
    const element = document.createElement("section");
    element.className = "hb-climate-details-controls";
    element.dataset.climateDeviceType = value6;
    element.dataset.climateStructureKey = climateControlStructureKey(
      entityId,
      value,
      value6,
    );
    element.inert = !value2;
    const currentTemperature = climateCapabilities.currentTemperature;
    const targetTemperature = climateCapabilities.targetTemperature;
    const minimumTemperature = climateCapabilities.minimumTemperature;
    const maximumTemperature = climateCapabilities.maximumTemperature;
    const temperatureStep = climateCapabilities.temperatureStep;
    const value10 =
      ["climate", "water_heater"].includes(value8) &&
      climateCapabilities.supportsTargetTemperature;
    const value11 = value8 === "water_heater";
    element.classList.toggle("without-temperature", !value10);
    let previous = value10 ? targetTemperature : minimumTemperature;
    let value12 = null;
    let value13 = null;
    let value14 = null;
    const fn = () => {
      value12 = null;
      window.clearTimeout(value13);
      window.clearTimeout(value14);
      value13 = null;
      value14 = null;
    };
    const fn2 = (value33) => {
      value12 = value33;
      window.clearTimeout(value13);
      window.clearTimeout(value14);
      value14 = null;
      value13 = window.setTimeout(() => {
        value12 = null;
        value13 = null;
      }, 8000);
    };
    const fn3 = () => {
      window.clearTimeout(value14);
      value14 = window.setTimeout(fn, 2500);
    };
    const value15 = document.createElement("section");
    value15.className = "hb-climate-thermostat";
    const element2 = document.createElement("button");
    element2.type = "button";
    element2.className = "hb-climate-temperature-step";
    element2.textContent = "−";
    element2.setAttribute("aria-label", "降低设定温度");
    const element3 = document.createElement("div");
    element3.className = "hb-climate-temperature-dial";
    const value16 = document.createElement("i");
    value16.className = "hb-climate-arc-cap start";
    value16.setAttribute("aria-hidden", "true");
    const value17 = document.createElement("i");
    value17.className = "hb-climate-arc-cap end";
    value17.setAttribute("aria-hidden", "true");
    const value18 = document.createElement("button");
    value18.type = "button";
    value18.className = "hb-climate-temperature-thumb";
    value18.setAttribute("aria-label", "拖动调节设定温度");
    const value19 = document.createElement("div");
    value19.className = "hb-climate-temperature-content";
    const element4 = document.createElement("small");
    element4.textContent = "设定温度";
    const element5 = document.createElement("strong");
    const element6 = document.createElement("span");
    element6.textContent = Number.isFinite(currentTemperature)
      ? "当前温度 " + currentTemperature + "°C"
      : "当前温度 --";
    value19.append(element4, element5, element6);
    element3.append(value16, value17, value18, value19);
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.className = "hb-climate-temperature-step";
    element7.textContent = "+";
    element7.setAttribute("aria-label", "提高设定温度");
    let value20 = value;
    const fn4 = (value33) => climateEffectMode(value33, value6);
    const fn5 = (value33 = value20) => {
      value20 = value33 || value20;
      const visualMode = fn4(value20);
      const count = Math.max(
        0,
        Math.min(
          1,
          (previous - minimumTemperature) /
            Math.max(temperatureStep, maximumTemperature - minimumTemperature),
        ),
      );
      const value34 =
        visualMode === "cool"
          ? value5.cool || "#73c8ff"
          : visualMode === "heat"
            ? value5.heat || "#ff8a65"
            : value5.other || "#dce2e6";
      const accentColor =
        visualMode === "off"
          ? "#65717a"
          : visualMode === "cool"
            ? un(value34, "#ffffff", count * 0.32)
            : visualMode === "heat"
              ? un(value34, "#ffffff", (1 - count) * 0.3)
              : value34;
      element.dataset.climateVisualMode = visualMode;
      if (visualMode !== "off") {
        element.dataset.lastClimateMode = String(value20?.state || "auto");
      }
      const accentSoft = un(accentColor, "#11171c", 0.72);
      element.style.setProperty("--hb-climate-accent", accentColor);
      element.style.setProperty("--hb-climate-accent-soft", accentSoft);
      const running = climateIsRunning(value20, value6);
      element.classList.toggle("is-running", running);
      value4?.({
        mode: climatePresentationMode(value20, value6),
        visualMode: visualMode,
        running: running,
        accentColor: accentColor,
        accentSoft: accentSoft,
        targetTemperature: value10 ? previous : null,
      });
      const currentTemperature2 =
        normalizeClimateCapabilities(value20).currentTemperature;
      element6.textContent =
        currentTemperature2 !== null
          ? "当前温度 " + currentTemperature2 + "°C"
          : "当前温度 --";
      const fn15 = (value35) =>
        value35 === "set_hvac_mode"
          ? value20?.state
          : value35 === "set_fan_mode"
            ? value20?.attributes?.fan_mode
            : value35 === "set_swing_mode"
              ? value20?.attributes?.swing_mode
              : value35 === "set_swing_horizontal_mode"
                ? value20?.attributes?.swing_horizontal_mode
                : value35 === "set_preset_mode"
                  ? value20?.attributes?.preset_mode
                  : value35 === "set_operation_mode"
                    ? value20?.attributes?.operation_mode
                    : null;
      for (const element8 of element.querySelectorAll(
        "button[data-climate-service]",
      )) {
        const climateService = element8.dataset.climateService;
        const value35 = fn15(climateService);
        element8.classList.toggle(
          "active",
          element8.dataset.climateValue === String(value35 ?? ""),
        );
      }
      for (const value35 of element.querySelectorAll(
        ".hb-climate-select[data-climate-service]",
      )) {
        const text = String(fn15(value35.dataset.climateService) ?? "");
        value35.dataset.currentValue = text;
        const element8 = Array.from(
          value35.querySelectorAll('[role="option"]'),
        ).find((value36) => value36.dataset.value === text);
        const element9 = value35.querySelector(
          ".hb-climate-select-trigger > span",
        );
        if (element9) {
          element9.textContent = element8?.textContent || text || "请选择";
          element9.title = element9.textContent;
        }
        value35.querySelectorAll('[role="option"]').forEach((element10) => {
          const value36 = element10.dataset.value === text;
          element10.classList.toggle("active", value36);
          element10.setAttribute("aria-selected", String(value36));
        });
      }
    };
    const fn6 = (value33 = false) => {
      element5.innerHTML = value10 ? previous + "<small>°C</small>" : "--";
      const value34 =
        ((previous - minimumTemperature) /
          Math.max(temperatureStep, maximumTemperature - minimumTemperature)) *
        75;
      const count = Math.max(0, Math.min(75, value34));
      element3.style.setProperty(
        "--hb-climate-temperature-progress",
        count + "%",
      );
      element3.style.setProperty(
        "--hb-climate-thumb-angle",
        225 + (count / 75) * 270 + "deg",
      );
      value18.setAttribute("aria-valuemin", String(minimumTemperature));
      value18.setAttribute("aria-valuemax", String(maximumTemperature));
      value18.setAttribute("aria-valuenow", String(previous));
      value18.setAttribute("aria-valuetext", previous + "°C");
      const count2 = Math.max(0.001, temperatureStep / 2);
      element2.disabled = !value10 || previous <= minimumTemperature + count2;
      element7.disabled = !value10 || previous >= maximumTemperature - count2;
      element2.title = "最低 " + minimumTemperature + "°C";
      element7.title = "最高 " + maximumTemperature + "°C";
      fn5();
      if (value33) {
        element5.classList.remove("is-changing");
        window.requestAnimationFrame(() =>
          element5.classList.add("is-changing"),
        );
      }
    };
    let value21 = previous;
    const value22 = [];
    let value23 = null;
    let value24 = previous;
    let value25 = false;
    let value26 = null;
    const fn7 = (value33, value34) =>
      value33 !== null &&
      value34 !== null &&
      Math.abs(value33 - value34) < 1e-8;
    const fn8 = () => value22.at(-1) ?? value23;
    const fn9 = () => {
      const value33 = fn8();
      if (value33 !== null) {
        fn2(value33);
      }
    };
    const value27 = async () => {
      window.clearTimeout(value26);
      value26 = null;
      if (value25 || !value22.length) {
        return;
      }
      const temperature = value22.shift();
      value23 = temperature;
      if (fn7(temperature, value21)) {
        value23 = null;
        fn9();
        if (value22.length) {
          value26 = window.setTimeout(value27, 220);
        }
        return;
      }
      value25 = true;
      try {
        await this.callEntityService(
          value8 === "climate" ? "climate" : value8,
          "set_temperature",
          entityId,
          {
            temperature: temperature,
          },
        );
        value21 = temperature;
        if (value8 !== "water_heater") {
          value3?.(true);
        }
      } catch (error) {
        value22.length = 0;
        fn();
        value24 = value21;
        previous = value21;
        fn6(true);
        this.options.onError?.(error);
      } finally {
        value25 = false;
        value23 = null;
        fn9();
        if (value22.length) {
          value26 = window.setTimeout(value27, 220);
        }
      }
    };
    const fn10 = ({ preserveIntermediateSteps: value33 = true } = {}) => {
      const value34 = previous;
      value24 = value34;
      const value35 = value22.at(-1) ?? value23 ?? value21;
      if (fn7(value34, value35)) {
        fn9();
        return;
      }
      if (value33 && value11) {
        const value36 = value22.at(-2) ?? value23 ?? value21;
        if (value22.length && fn7(value34, value36)) {
          value22.pop();
        } else {
          value22.push(value34);
        }
      } else {
        value22.length = 0;
        value22.push(value34);
      }
      fn9();
      if (!value25) {
        window.clearTimeout(value26);
        value26 = window.setTimeout(value27, 160);
      }
    };
    const fn11 = (value33) => {
      if (!value2 || !value10) {
        return;
      }
      const value34 = previous;
      const value35 = String(temperatureStep).split(".")[1]?.length || 0;
      previous = Number(
        Math.max(
          minimumTemperature,
          Math.min(maximumTemperature, previous + value33 * temperatureStep),
        ).toFixed(value35),
      );
      if (previous !== value34) {
        fn6(true);
        fn10();
      }
    };
    const fn12 = (value33) => {
      const value34 = element3.getBoundingClientRect();
      const value35 = value34.left + value34.width / 2;
      const value36 = value34.top + value34.height / 2;
      const value37 = value33.clientX - value35;
      const value38 = value33.clientY - value36;
      const value39 =
        ((Math.atan2(value37, -value38) * 180) / Math.PI + 360) % 360;
      let value40;
      if (value39 >= 225) {
        value40 = value39;
      } else if (value39 <= 135) {
        value40 = value39 + 360;
      } else {
        value40 = value39 <= 180 ? 495 : 225;
      }
      const count = Math.max(0, Math.min(1, (value40 - 225) / 270));
      const value41 = String(temperatureStep).split(".")[1]?.length || 0;
      return Number(
        (
          minimumTemperature +
          Math.round(
            ((maximumTemperature - minimumTemperature) * count) /
              temperatureStep,
          ) *
            temperatureStep
        ).toFixed(value41),
      );
    };
    let value28 = null;
    element3.addEventListener("pointerdown", (event) => {
      if (!value2 || !value10) {
        return;
      }
      const value33 = element3.getBoundingClientRect();
      const value34 = Math.min(value33.width, value33.height) / 2;
      const value35 = Math.hypot(
        event.clientX - (value33.left + value33.width / 2),
        event.clientY - (value33.top + value33.height / 2),
      );
      if (event.target === value18 || !(Math.abs(value35 - value34) > 34)) {
        event.preventDefault();
        value28 = {
          pointerId: event.pointerId,
          previous: previous,
        };
        element3.setPointerCapture(event.pointerId);
        element3.classList.add("is-dragging");
        previous = fn12(event);
        fn6();
      }
    });
    element3.addEventListener("pointermove", (value33) => {
      if (!!value28 && value33.pointerId === value28.pointerId) {
        previous = fn12(value33);
        fn6();
      }
    });
    const value29 = (value33) => {
      if (!value28 || value33.pointerId !== value28.pointerId) {
        return;
      }
      const previous2 = value28.previous;
      value28 = null;
      element3.classList.remove("is-dragging");
      if (element3.hasPointerCapture(value33.pointerId)) {
        element3.releasePointerCapture(value33.pointerId);
      }
      fn6(true);
      if (previous !== previous2) {
        fn10({
          preserveIntermediateSteps: false,
        });
      }
    };
    element3.addEventListener("pointerup", value29);
    element3.addEventListener("pointercancel", value29);
    value18.disabled = !value10;
    element2.addEventListener("click", () => fn11(-1));
    element7.addEventListener("click", () => fn11(1));
    fn6();
    value15.append(element2, element3, element7);
    if (value10) {
      element.append(value15);
    }
    const value30 =
      value6 === "water-heater" ? document.createElement("section") : null;
    if (value30) {
      value30.className = "hb-water-heater-control-panel";
      value30.dataset.controlSource = "primary-entity";
      element.append(value30);
      element.waterHeaterControlPanel = value30;
    }
    const fn13 = ({
      label: value33,
      values: value34,
      current: value35,
      service: value36,
      dataKey: value37,
      labels: value38 = {},
      icons: value39 = {},
      className: value40 = "",
      domain: value41 = "climate",
      presentation: value42 = "auto",
    }) => {
      const value43 = [
        ...new Set(
          (Array.isArray(value34) ? value34 : [])
            .map((value46) => String(value46 ?? "").trim())
            .filter(Boolean),
        ),
      ];
      if (!value43.length) {
        return;
      }
      const value44 =
        value42 === "auto"
          ? climateOptionPresentation(value43, value38)
          : value42;
      const element8 = document.createElement("div");
      element8.className = ("hb-climate-details-group " + value40).trim();
      if (value30) {
        element8.dataset.controlSource = "primary-entity";
      }
      const element9 = document.createElement("strong");
      element9.textContent = value33;
      if (value44 === "select") {
        element8.classList.add("select-options");
        const value46 = document.createElement("div");
        value46.className = "hb-climate-select";
        value46.dataset.climateService = value36;
        value46.dataset.currentValue = String(value35 ?? "");
        const element10 = document.createElement("button");
        element10.type = "button";
        element10.className = "hb-climate-select-trigger";
        element10.setAttribute("aria-label", value33);
        element10.setAttribute("aria-haspopup", "listbox");
        element10.setAttribute("aria-expanded", "false");
        element10.disabled = !value2;
        const element11 = document.createElement("span");
        const value47 = document.createElement("i");
        value47.setAttribute("aria-hidden", "true");
        element10.append(element11, value47);
        const value48 = document.createElement("div");
        value48.className = "hb-climate-select-menu";
        value48.id = "hb-climate-select-" + randomUuid();
        value48.setAttribute("role", "listbox");
        value48.setAttribute("aria-label", value33);
        value48.setAttribute("popover", "auto");
        value48.hidden = true;
        element10.setAttribute("aria-controls", value48.id);
        let value49 = false;
        const fn15 = () => {
          try {
            return value48.matches(":popover-open");
          } catch {
            return value48.dataset.open === "true";
          }
        };
        const fn16 = (value50) => {
          const text = String(value50 ?? "");
          value46.dataset.currentValue = text;
          const element12 = Array.from(
            value48.querySelectorAll('[role="option"]'),
          ).find((value51) => value51.dataset.value === text);
          element11.textContent = element12?.textContent || text || "请选择";
          element11.title = element11.textContent;
          value48.querySelectorAll('[role="option"]').forEach((element13) => {
            const value51 = element13.dataset.value === text;
            element13.classList.toggle("active", value51);
            element13.setAttribute("aria-selected", String(value51));
          });
        };
        const fn17 = () => {
          if (!fn15() && value48.hidden) {
            return;
          }
          const value50 = element10.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const value51 = Math.min(
            Math.max(value50.width, 190),
            Math.max(190, innerWidth - 20),
          );
          value48.style.width = value51 + "px";
          value48.style.maxHeight =
            Math.min(360, Math.max(120, innerHeight - 20)) + "px";
          const value52 = Math.min(value48.scrollHeight || 0, 360);
          const value53 = innerHeight - value50.bottom - 10;
          const value54 = value50.top - 10;
          const value55 =
            value53 < Math.min(value52, 180) && value54 > value53
              ? Math.max(10, value50.top - value52 - 5)
              : Math.min(innerHeight - value52 - 10, value50.bottom + 5);
          value48.style.left =
            Math.max(10, Math.min(value50.left, innerWidth - value51 - 10)) +
            "px";
          value48.style.top = Math.max(10, value55) + "px";
        };
        const fn18 = () => {
          if (fn15() && typeof value48.hidePopover == "function") {
            value48.hidePopover();
          }
          value48.hidden = true;
          value48.dataset.open = "false";
          element10.setAttribute("aria-expanded", "false");
        };
        const fn19 = (value50 = false) => {
          if (!element10.disabled && !value49) {
            value48.hidden = false;
            if (typeof value48.showPopover == "function") {
              value48.showPopover();
            } else {
              value48.dataset.open = "true";
            }
            element10.setAttribute("aria-expanded", "true");
            fn17();
            if (value50) {
              (
                value48.querySelector('[aria-selected="true"]') ||
                value48.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const fn20 = async (state) => {
          if (!value2 || value49) {
            return;
          }
          const currentValue = value46.dataset.currentValue;
          value49 = true;
          element10.disabled = true;
          fn18();
          fn16(state);
          try {
            await this.callEntityService(value41, value36, entityId, {
              [value37]: state,
            });
            const attributes2 = {
              ...(value20?.attributes || {}),
              [value37]: state,
            };
            if (value36 === "set_hvac_mode") {
              value20 = {
                ...(value20 || {}),
                state: state,
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
              value3?.(state !== "off");
            } else if (value36 === "set_preset_mode") {
              const value50 =
                value6 === "bath-heater" &&
                ["idle", "standby", "待机", "关闭"].includes(
                  String(state).trim().toLowerCase(),
                );
              const value51 =
                element.dataset.lastClimateMode ||
                climateCapabilities.hvacModes.find(
                  (value54) => value54 !== "off",
                ) ||
                (value8 === "fan" ? "on" : "auto");
              const value52 = {
                ...(value20 || {}),
                state: value50
                  ? "off"
                  : climateIsPoweredOn(value20, value6)
                    ? value20?.state
                    : value51,
                attributes: {
                  ...attributes2,
                  preset_mode: state,
                },
              };
              const value53 = climateEffectMode(value52, value6);
              value52.attributes.hvac_action = value50
                ? "idle"
                : value53 === "cool"
                  ? "cooling"
                  : value53 === "heat"
                    ? "heating"
                    : "fan";
              value20 = value52;
              value3?.(!value50);
            } else if (value36 === "set_operation_mode") {
              value20 = {
                ...(value20 || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...attributes2,
                  operation_mode: state,
                },
              };
              value3?.(state !== "off");
            } else {
              value20 = {
                ...(value20 || {}),
                attributes: attributes2,
              };
            }
            fn5();
          } catch (error) {
            fn16(currentValue);
            this.options.onError?.(error);
          } finally {
            value49 = false;
            element10.disabled = !value2;
          }
        };
        for (const value50 of value43) {
          const element12 = document.createElement("button");
          element12.type = "button";
          element12.className = "hb-climate-select-option";
          element12.setAttribute("role", "option");
          element12.dataset.value = value50;
          element12.textContent = value38[value50] || value50;
          element12.title = element12.textContent;
          element12.addEventListener("click", () => fn20(value50));
          value48.append(element12);
        }
        fn16(String(value35 ?? ""));
        element10.addEventListener("click", () => {
          if (fn15() || value48.dataset.open === "true") {
            fn18();
          } else {
            fn19();
          }
        });
        element10.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            fn19(true);
          }
        });
        value48.addEventListener("keydown", (event) => {
          const value50 = [...value48.querySelectorAll('[role="option"]')];
          const value51 = value50.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            fn18();
            element10.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const value52 = event.key === "ArrowDown" ? 1 : -1;
            value50[
              (value51 + value52 + value50.length) % value50.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        value48.addEventListener("toggle", (value50) => {
          const value51 = value50.newState === "open";
          value48.hidden = !value51;
          value48.dataset.open = String(value51);
          element10.setAttribute("aria-expanded", String(value51));
          if (value51) {
            fn17();
          }
        });
        value46.append(element10, value48);
        element8.append(element9, value46);
        (value30 || element).append(element8);
        return;
      }
      const value45 = document.createElement("div");
      value45.className = "hb-climate-details-options";
      for (const state of value43) {
        const element10 = document.createElement("button");
        element10.type = "button";
        element10.dataset.climateService = value36;
        element10.dataset.climateValue = state;
        const element11 = document.createElement("i");
        element11.setAttribute("aria-hidden", "true");
        element11.textContent = value39[state] || "";
        const element12 = document.createElement("span");
        element12.textContent = value38[state] || state;
        element10.append(element11, element12);
        element10.classList.toggle("active", state === value35);
        element10.addEventListener("click", async () => {
          if (!value2) {
            return;
          }
          const value46 =
            value6 === "bath-heater" &&
            value36 === "set_preset_mode" &&
            ["idle", "standby", "待机", "关闭"].includes(
              String(state).trim().toLowerCase(),
            );
          value45.querySelectorAll("button").forEach((value47) => {
            value47.disabled = true;
          });
          try {
            await this.callEntityService(value41, value36, entityId, {
              [value37]: state,
            });
            if (value46) {
              const value47 = climatePowerCommand(
                entityId,
                value20,
                false,
                "bath-heater",
              );
              await this.callEntityService(
                value47.domain,
                value47.service,
                entityId,
                value47.data,
              );
            }
            value45
              .querySelectorAll("button")
              .forEach((element13) =>
                element13.classList.toggle("active", element13 === element10),
              );
            if (value36 === "set_hvac_mode") {
              const hvac_action =
                state === "cool"
                  ? "cooling"
                  : state === "heat"
                    ? "heating"
                    : state === "off"
                      ? "off"
                      : state;
              value20 = {
                ...(value20 || {}),
                state: state,
                attributes: {
                  ...(value20?.attributes || {}),
                  hvac_action: hvac_action,
                },
              };
              fn5();
              value3?.(state !== "off");
            } else if (value36 === "set_preset_mode") {
              const value47 = value46;
              const value48 =
                element.dataset.lastClimateMode ||
                climateCapabilities.hvacModes.find(
                  (value51) => value51 !== "off",
                ) ||
                (value8 === "fan" ? "on" : "auto");
              const value49 = {
                ...(value20 || {}),
                state: value47
                  ? "off"
                  : climateIsPoweredOn(value20, value6)
                    ? value20?.state
                    : value48,
                attributes: {
                  ...(value20?.attributes || {}),
                  preset_mode: state,
                },
              };
              const value50 = climateEffectMode(value49, value6);
              value49.attributes.hvac_action = value47
                ? "idle"
                : value50 === "cool"
                  ? "cooling"
                  : value50 === "heat"
                    ? "heating"
                    : "fan";
              value20 = value49;
              fn5();
              value3?.(!value47);
            } else if (value36 === "set_operation_mode") {
              value20 = {
                ...(value20 || {}),
                state: state === "off" ? "off" : "on",
                attributes: {
                  ...(value20?.attributes || {}),
                  operation_mode: state,
                },
              };
              fn5();
              value3?.(state !== "off");
            }
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            value45.querySelectorAll("button").forEach((value47) => {
              value47.disabled = false;
            });
          }
        });
        value45.append(element10);
      }
      element8.append(element9, value45);
      (value30 || element).append(element8);
    };
    const values = climateOperationModeValues(value, value6);
    const labels = Object.fromEntries(
      values.map((value33) => [
        value33,
        climateModeLabel(value33, value6, value9),
      ]),
    );
    const icons = Object.fromEntries(
      values.map((value33) => [value33, climateModeIcon(value33, value6)]),
    );
    fn13({
      label: "运行模式",
      values: values,
      current: String(
        value6 === "water-heater"
          ? attributes.operation_mode || ""
          : value?.state || "",
      ),
      service:
        value6 === "water-heater" ? "set_operation_mode" : "set_hvac_mode",
      dataKey: value6 === "water-heater" ? "operation_mode" : "hvac_mode",
      labels: labels,
      icons: icons,
      className: "mode-options",
      domain: value6 === "water-heater" ? "water_heater" : "climate",
      presentation: climateOptionPresentation(values, labels),
    });
    const value31 = value8 === "climate" ? climateCapabilities.fanModes : [];
    if (value31.length) {
      const value33 = {
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
      const fan_mode = value31.find((value40) =>
        ["auto", "自动"].includes(String(value40).toLowerCase()),
      );
      const value34 = value31.filter((value40) => value40 !== fan_mode);
      const value35 = document.createElement("section");
      value35.className = "hb-climate-fan-slider";
      const value36 = document.createElement("span");
      value36.className = "hb-climate-fan-slider-heading";
      const element8 = document.createElement("i");
      element8.setAttribute("aria-hidden", "true");
      element8.textContent = "✾";
      const element9 = document.createElement("strong");
      element9.textContent = "风速";
      const element10 = document.createElement("output");
      const count = Math.max(0, value34.indexOf(attributes.fan_mode));
      let value37 = count;
      let value38 = !!fan_mode && attributes.fan_mode === fan_mode;
      let fan_mode2 = attributes.fan_mode;
      const element11 = document.createElement("input");
      element11.type = "range";
      element11.min = "0";
      element11.max = String(Math.max(0, value34.length - 1));
      element11.step = "1";
      element11.value = String(count);
      element11.disabled = value34.length === 0;
      const fn15 = (value40) =>
        value33[String(value34[value40]).toLowerCase()] ||
        value34[value40] ||
        "--";
      const element12 = document.createElement("button");
      element12.type = "button";
      element12.className = "hb-climate-fan-auto";
      element12.textContent = "自动";
      element12.hidden = !fan_mode;
      element12.classList.toggle("active", value38);
      const fn16 = () => {
        const numeric = Number(element11.value);
        const value40 =
          value34.length > 1 ? (numeric / (value34.length - 1)) * 100 : 100;
        element10.textContent = value38 ? "自动" : fn15(numeric);
        element11.style.setProperty("--hb-climate-fan-progress", value40 + "%");
      };
      value36.append(element8, element9, element10, element12);
      element11.addEventListener("input", () => {
        value38 = false;
        element12.classList.remove("active");
        fn16();
      });
      element11.addEventListener("change", async () => {
        if (!value2 || !value34.length) {
          return;
        }
        const numeric = Number(element11.value);
        const fan_mode3 = value34[numeric];
        element11.disabled = true;
        element12.disabled = true;
        try {
          await this.callEntityService("climate", "set_fan_mode", entityId, {
            fan_mode: fan_mode3,
          });
          value37 = numeric;
          fan_mode2 = fan_mode3;
          value38 = false;
        } catch (error) {
          value38 = !!fan_mode && fan_mode2 === fan_mode;
          if (!value38) {
            element11.value = String(value37);
          }
          element12.classList.toggle("active", value38);
          fn16();
          this.options.onError?.(error);
        } finally {
          element11.disabled = false;
          element12.disabled = false;
        }
      });
      element12.addEventListener("click", async () => {
        if (!!value2 && !!fan_mode && !element12.disabled) {
          element11.disabled = true;
          element12.disabled = true;
          try {
            await this.callEntityService("climate", "set_fan_mode", entityId, {
              fan_mode: fan_mode,
            });
            value38 = true;
            fan_mode2 = fan_mode;
            element12.classList.add("active");
            fn16();
          } catch (error) {
            this.options.onError?.(error);
          } finally {
            element11.disabled = value34.length === 0;
            element12.disabled = false;
          }
        }
      });
      const value39 = document.createElement("span");
      value39.className = "hb-climate-fan-slider-legend";
      const element13 = document.createElement("small");
      element13.textContent = fn15(0);
      const element14 = document.createElement("small");
      element14.textContent = fn15(value34.length - 1);
      value39.append(element13, element14);
      fn16();
      value35.append(value36, element11, value39);
      element.append(value35);
    }
    let value32 = null;
    if (value8 === "fan" && climateCapabilities.supportsFanPercentage) {
      const value33 = document.createElement("section");
      value33.className = "hb-climate-fan-slider";
      const value34 = document.createElement("span");
      value34.className = "hb-climate-fan-slider-heading";
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
      const fn15 = () => {
        const count2 = Math.max(0, Math.min(100, Number(element11.value) || 0));
        element10.textContent = Math.round(count2) + "%";
        element11.style.setProperty("--hb-climate-fan-progress", count2 + "%");
      };
      value32 = (value36) => {
        const fanPercentage =
          normalizeClimateCapabilities(value36).fanPercentage;
        if (fanPercentage !== null) {
          count = Math.max(0, Math.min(100, fanPercentage));
          element11.value = String(count);
          fn15();
        }
      };
      element11.addEventListener("input", fn15);
      element11.addEventListener("change", async () => {
        if (!value2 || element11.disabled) {
          return;
        }
        const percentage = Math.max(
          0,
          Math.min(100, Number(element11.value) || 0),
        );
        element11.disabled = true;
        try {
          await this.callEntityService("fan", "set_percentage", entityId, {
            percentage: percentage,
          });
          count = percentage;
          value20 = {
            ...(value20 || {}),
            state: percentage > 0 ? "on" : "off",
            attributes: {
              ...(value20?.attributes || {}),
              percentage: percentage,
            },
          };
          fn5();
          value3?.(percentage > 0);
        } catch (error) {
          element11.value = String(count);
          fn15();
          this.options.onError?.(error);
        } finally {
          element11.disabled = false;
        }
      });
      const value35 = document.createElement("span");
      value35.className = "hb-climate-fan-slider-legend";
      const element12 = document.createElement("small");
      element12.textContent = "关闭";
      const element13 = document.createElement("small");
      element13.textContent = "最大";
      value35.append(element12, element13);
      value34.append(element8, element9, element10);
      fn15();
      value33.append(value34, element11, value35);
      element.append(value33);
    }
    const labels2 = Object.fromEntries(
      climateCapabilities.swingModes.map((value33) => [
        value33,
        climateSwingModeLabel(value33, "vertical", value9),
      ]),
    );
    fn13({
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
      climateCapabilities.horizontalSwingModes.map((value33) => [
        value33,
        climateSwingModeLabel(value33, "horizontal", value9),
      ]),
    );
    fn13({
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
      climateCapabilities.presetModes.map((value33) => [
        value33,
        climateModeLabel(value33, value6, value9),
      ]),
    );
    const icons2 = Object.fromEntries(
      climateCapabilities.presetModes.map((value33) => [
        value33,
        climateModeIcon(value33, value6),
      ]),
    );
    fn13({
      label: "预设模式",
      values: climateCapabilities.presetModes,
      current: attributes.preset_mode,
      service: "set_preset_mode",
      dataKey: "preset_mode",
      labels: labels4,
      icons: icons2,
      className: "compact-options",
      domain: value8 === "fan" ? "fan" : "climate",
      presentation: climateOptionPresentation(
        climateCapabilities.presetModes,
        labels4,
        {
          inlineIcon: true,
        },
      ),
    });
    let fn14 = null;
    if (!element.childElementCount) {
      const element8 = document.createElement("section");
      element8.className = "hb-climate-details-loading";
      const value33 = document.createElement("i");
      value33.setAttribute("aria-hidden", "true");
      const element9 = document.createElement("strong");
      const element10 = document.createElement("span");
      fn14 = (value34) => {
        const value35 = String(value34?.state || "")
          .trim()
          .toLowerCase();
        const value36 = !value34 || !value35 || value35 === "unknown";
        const value37 = value35 === "unavailable";
        element8.classList.toggle("is-loading", value36);
        element8.classList.toggle("is-unavailable", value37);
        element9.textContent = value36
          ? "正在加载设备状态…"
          : value37
            ? "设备当前不可用"
            : "暂无可用控制数据";
        element10.textContent = value36
          ? "状态到达后会自动显示，无需重新打开弹窗"
          : value37
            ? "连接恢复后会自动更新"
            : "请检查该实体在 Home Assistant 中提供的控制能力";
      };
      fn14(value);
      element8.append(value33, element9, element10);
      element.append(element8);
    }
    element.syncClimateGrid = () => {
      const value33 = Array.from(element.children);
      const value34 = value33.find((element8) =>
        element8.classList.contains("hb-climate-thermostat"),
      );
      if (!value34) {
        return;
      }
      const value35 = value33.find((element8) =>
        element8.classList.contains("is-water-heater"),
      );
      const length = value33.filter(
        (value36) => value36 !== value34 && value36 !== value35,
      ).length;
      value34.style.gridRow = "1 / span " + Math.max(1, length);
      if (value35) {
        value35.style.gridRow = "1 / span " + Math.max(1, length);
      }
    };
    element.syncClimateGrid();
    element.syncClimateState = (value33) => {
      if (!value33) {
        return;
      }
      value20 = value33;
      fn14?.(value33);
      value32?.(value33);
      const targetTemperature2 =
        normalizeClimateCapabilities(value33).targetTemperature;
      const value34 = reconcileClimateTargetTemperature(
        value24,
        targetTemperature2,
        value12,
        temperatureStep,
      );
      if (value12 === null || value34.confirmed) {
        value24 = value34.temperature;
      }
      previous = value24;
      if (
        targetTemperature2 !== null &&
        (value12 === null || value34.confirmed)
      ) {
        value21 = targetTemperature2;
      }
      if (value12 !== null && value34.confirmed) {
        if (value11) {
          fn3();
        } else {
          fn();
        }
      }
      fn6();
    };
    element.cleanupClimateDetails = () => {
      window.clearTimeout(value26);
      value26 = null;
      value22.length = 0;
      value23 = null;
      fn();
    };
    fn5();
    return element;
  }
  createWaterHeaterExtensionControls(
    value,
    {
      component: value2 = null,
      interactive: value3 = true,
      excludedEntityIds: value4 = [],
    } = {},
  ) {
    const value5 = value2
      ? relatedPopupContext(
          value2,
          this.entityMetadata,
          this.deviceMetadata,
          this.states,
        )
      : null;
    const value6 = value2
      ? selectedRelatedEntities(
          value2,
          this.entityMetadata,
          this.deviceMetadata,
          this.states,
        )
      : null;
    const allowed = new Set(value4);
    const value7 = (
      value6 === null
        ? relatedWaterHeaterEntities(this.entityMetadata, value)
        : value6
    ).filter((value12) => !allowed.has(value12.entityId));
    const value8 = value5?.primary || this.entityMetadata.get(value);
    if (!value7.length) {
      return null;
    }
    const value9 = document.createElement("section");
    value9.className =
      "hb-related-entity-extensions hb-water-heater-extensions" +
      (value5?.deviceType ? " is-" + value5.deviceType : "");
    value9.dataset.controlSource =
      value6 === null ? "automatic-device" : "user-selected";
    const index = new Map();
    const fn = (entityId) => {
      const value12 = this.states.get(entityId);
      return (
        value12?.newState ||
        value12 || {
          entityId: entityId,
          state: "unknown",
          attributes: {},
        }
      );
    };
    const fn2 = (value12, value13) => {
      if (!index.has(value12)) {
        index.set(value12, []);
      }
      index.get(value12).push(value13);
    };
    const value11 = document.createElement("div");
    value11.className = "hb-water-heater-extension-grid";
    for (const metadata of value7) {
      const entityId = metadata.entityId;
      const text = String(metadata.domain || "");
      const value13 = value5
        ? relatedEntityLabel(value5, metadata)
        : waterHeaterRelatedEntityLabel(value8, metadata);
      if (["light", "switch", "input_boolean", "fan"].includes(text)) {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "hb-water-heater-extension-toggle";
        const value14 = document.createElement("i");
        value14.setAttribute("aria-hidden", "true");
        const value15 = document.createElement("span");
        const element2 = document.createElement("strong");
        element2.textContent = value13;
        const element3 = document.createElement("small");
        value15.append(element2, element3);
        element.append(value14, value15);
        let value16 = fn(entityId);
        let value17 = false;
        const fn3 = (value18 = value16) => {
          value16 = value18 || value16;
          const value19 = String(value16?.state || "").toLowerCase();
          const value20 = ["unknown", "unavailable"].includes(value19);
          const value21 = value19 === "on";
          element.classList.toggle("is-on", value21 && !value20);
          element.classList.toggle("is-unavailable", value20);
          element.disabled = !value3 || value17 || value20;
          element.setAttribute("aria-pressed", String(value21));
          element.setAttribute("aria-busy", String(value17));
          element3.textContent = value20
            ? "不可用"
            : value21
              ? "已开启"
              : "已关闭";
        };
        element.addEventListener("click", async () => {
          if (
            !value3 ||
            value17 ||
            element.classList.contains("is-unavailable")
          ) {
            return;
          }
          const value18 = value16;
          const value19 = String(value16?.state || "").toLowerCase() !== "on";
          value17 = true;
          fn3({
            ...(value16 || {}),
            state: value19 ? "on" : "off",
          });
          try {
            await this.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            fn3(value18);
            this.options.onError?.(error);
          } finally {
            value17 = false;
            fn3(value16);
          }
        });
        fn3(value16);
        fn2(entityId, fn3);
        value11.append(element);
      } else if (["select", "input_select"].includes(text)) {
        const value14 = document.createElement("div");
        value14.className = "hb-water-heater-extension-select";
        const element = document.createElement("span");
        element.textContent = value13;
        element.title = value13;
        const element2 = document.createElement("button");
        element2.type = "button";
        element2.className = "hb-related-select-trigger";
        element2.setAttribute("aria-label", value13);
        element2.setAttribute("aria-haspopup", "listbox");
        element2.setAttribute("aria-expanded", "false");
        const element3 = document.createElement("span");
        const value15 = document.createElement("i");
        value15.setAttribute("aria-hidden", "true");
        element2.append(element3, value15);
        const value16 = document.createElement("div");
        value16.className = "hb-related-select-menu";
        value16.id =
          "hb-related-select-" +
          String(this.renderNamespace || "runtime").replace(
            /[^a-z0-9_-]/gi,
            "-",
          ) +
          "-" +
          entityId.replace(/[^a-z0-9_-]/gi, "-");
        value16.setAttribute("role", "listbox");
        value16.setAttribute("popover", "auto");
        value16.hidden = true;
        element2.setAttribute("aria-controls", value16.id);
        let value17 = fn(entityId);
        let text2 = String(value17?.state || "");
        let value18 = false;
        let value19 = "";
        let options = [];
        const value20 = {
          entityId: entityId,
          entityMetadata: this.entityMetadata,
          entityTranslations: this.entityTranslations,
          attributes: ["options", "option"],
        };
        const fn3 = (value21) =>
          value5?.deviceType === "bath-heater"
            ? climateModeLabel(value21, "bath-heater", value20)
            : String(value21 || "");
        const fn4 = () => {
          try {
            return value16.matches(":popover-open");
          } catch {
            return value16.dataset.open === "true";
          }
        };
        const fn5 = () => {
          if (!fn4() && value16.hidden) {
            return;
          }
          const value21 = element2.getBoundingClientRect();
          const innerWidth = window.innerWidth;
          const innerHeight = window.innerHeight;
          const value22 = Math.min(
            Math.max(value21.width, 132),
            Math.max(132, innerWidth - 16),
          );
          value16.style.width = value22 + "px";
          value16.style.maxHeight =
            Math.min(216, Math.max(88, innerHeight - 16)) + "px";
          const value23 = Math.min(value16.scrollHeight || 0, 216);
          const value24 = innerHeight - value21.bottom - 8;
          const value25 = value21.top - 8;
          const value26 =
            value24 < Math.min(value23, 140) && value25 > value24
              ? Math.max(8, value21.top - value23 - 4)
              : Math.min(innerHeight - value23 - 8, value21.bottom + 4);
          value16.style.left =
            Math.max(8, Math.min(value21.left, innerWidth - value22 - 8)) +
            "px";
          value16.style.top = Math.max(8, value26) + "px";
        };
        const fn6 = () => {
          if (fn4() && typeof value16.hidePopover == "function") {
            value16.hidePopover();
          }
          value16.hidden = true;
          value16.dataset.open = "false";
          element2.setAttribute("aria-expanded", "false");
        };
        const fn7 = (value21 = false) => {
          if (!element2.disabled) {
            value16.hidden = false;
            if (typeof value16.showPopover == "function") {
              value16.showPopover();
            } else {
              value16.dataset.open = "true";
            }
            element2.setAttribute("aria-expanded", "true");
            fn5();
            if (value21) {
              (
                value16.querySelector('[aria-selected="true"]') ||
                value16.querySelector('[role="option"]')
              )?.focus();
            }
          }
        };
        const fn8 = async (state) => {
          if (!value3 || value18 || !state) {
            return;
          }
          const value21 = value17;
          value18 = true;
          fn6();
          fn10({
            ...(value17 || {}),
            state: state,
            attributes: {
              ...(value17?.attributes || {}),
              options: options,
            },
          });
          try {
            const value22 = relatedEntitySelectService(text);
            if (!value22) {
              throw new Error("实体 " + entityId + " 不支持选项服务。");
            }
            await this.callEntityService(
              value22.domain,
              value22.service,
              entityId,
              {
                option: state,
              },
            );
            text2 = state;
          } catch (error) {
            fn10(value21);
            this.options.onError?.(error);
          } finally {
            value18 = false;
            fn10(value17);
          }
        };
        const fn9 = (value21, value22) => {
          value16.replaceChildren(
            ...value21.map((value23) => {
              const element4 = document.createElement("button");
              element4.type = "button";
              element4.className = "hb-related-select-option";
              element4.setAttribute("role", "option");
              element4.dataset.value = value23;
              element4.textContent = fn3(value23);
              element4.title = element4.textContent;
              const value24 = value23 === value22;
              element4.classList.toggle("active", value24);
              element4.setAttribute("aria-selected", String(value24));
              element4.addEventListener("click", () => fn8(value23));
              return element4;
            }),
          );
        };
        const fn10 = (value21 = value17) => {
          value17 = value21 || value17;
          const text3 = String(value17?.state || "");
          const value22 = relatedEntityOptions(metadata, value17);
          options = value22;
          const value23 = JSON.stringify(value22);
          if (value23 !== value19) {
            value19 = value23;
            fn9(value22, text3);
          } else {
            for (const element4 of value16.querySelectorAll(
              '[role="option"]',
            )) {
              const value24 = element4.dataset.value === text3;
              element4.classList.toggle("active", value24);
              element4.setAttribute("aria-selected", String(value24));
            }
          }
          if (
            text3 &&
            !["unknown", "unavailable"].includes(text3.toLowerCase())
          ) {
            text2 = text3;
          }
          element3.textContent = text2
            ? fn3(text2)
            : value22.length
              ? fn3(value22[0])
              : "无选项";
          element3.title = element3.textContent;
          element2.disabled =
            !value3 ||
            value18 ||
            !value22.length ||
            text3.toLowerCase() === "unavailable";
        };
        element2.addEventListener("click", () => {
          if (fn4() || value16.dataset.open === "true") {
            fn6();
          } else {
            fn7();
          }
        });
        element2.addEventListener("keydown", (event) => {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            fn7(true);
          }
        });
        value16.addEventListener("keydown", (event) => {
          const value21 = [...value16.querySelectorAll('[role="option"]')];
          const value22 = value21.indexOf(document.activeElement);
          if (event.key === "Escape") {
            event.preventDefault();
            fn6();
            element2.focus();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const value23 = event.key === "ArrowDown" ? 1 : -1;
            value21[
              (value22 + value23 + value21.length) % value21.length
            ]?.focus();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            document.activeElement?.click();
          }
        });
        value16.addEventListener("toggle", (value21) => {
          const value22 = value21.newState === "open";
          value16.hidden = !value22;
          value16.dataset.open = String(value22);
          element2.setAttribute("aria-expanded", String(value22));
          if (value22) {
            fn5();
          }
        });
        value14.append(element, element2, value16);
        fn10(value17);
        fn2(entityId, fn10);
        value11.append(value14);
      } else if (["number", "input_number"].includes(text)) {
        const value14 = document.createElement("div");
        value14.className = "hb-water-heater-extension-number";
        const element = document.createElement("span");
        element.textContent = value13;
        const value15 = document.createElement("span");
        const element2 = document.createElement("button");
        element2.type = "button";
        element2.textContent = "−";
        const element3 = document.createElement("output");
        const element4 = document.createElement("button");
        element4.type = "button";
        element4.textContent = "+";
        value15.append(element2, element3, element4);
        value14.append(element, value15);
        let value16 = fn(entityId);
        let numeric = Number(value16?.state);
        let value17 = false;
        const fn3 = () => {
          const value18 = value16?.attributes || {};
          const numeric2 = Number(value18.min);
          const numeric3 = Number(value18.max);
          const step = Math.max(0.001, Number(value18.step) || 1);
          return {
            minimum: Number.isFinite(numeric2) ? numeric2 : 0,
            maximum: Number.isFinite(numeric3) ? numeric3 : 100,
            step: step,
          };
        };
        const fn4 = (value18 = value16) => {
          value16 = value18 || value16;
          const numeric2 = Number(value16?.state);
          const value19 =
            !Number.isFinite(numeric2) ||
            ["unknown", "unavailable"].includes(
              String(value16?.state || "").toLowerCase(),
            );
          if (!value19) {
            numeric = numeric2;
          }
          const text2 = String(value16?.attributes?.unit_of_measurement || "");
          element3.textContent = value19 ? "--" : "" + numeric2 + text2;
          element2.disabled = !value3 || value17 || value19;
          element4.disabled = !value3 || value17 || value19;
        };
        const fn5 = async (value18) => {
          if (!value3 || value17 || !Number.isFinite(numeric)) {
            return;
          }
          const { minimum: value19, maximum: value20, step: value21 } = fn3();
          const value22 = String(value21).split(".")[1]?.length || 0;
          const value23 = Number(
            Math.max(
              value19,
              Math.min(value20, numeric + value18 * value21),
            ).toFixed(value22),
          );
          if (value23 === numeric) {
            return;
          }
          const value24 = value16;
          value17 = true;
          fn4({
            ...(value16 || {}),
            state: String(value23),
          });
          try {
            await this.callEntityService(text, "set_value", entityId, {
              value: value23,
            });
            numeric = value23;
          } catch (error) {
            fn4(value24);
            this.options.onError?.(error);
          } finally {
            value17 = false;
            fn4(value16);
          }
        };
        element2.addEventListener("click", () => fn5(-1));
        element4.addEventListener("click", () => fn5(1));
        fn4(value16);
        fn2(entityId, fn4);
        value11.append(value14);
      } else if (text === "button") {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "hb-water-heater-extension-action";
        element.textContent = value13;
        let value14 = false;
        const fn3 = (value15) => {
          const value16 =
            String(value15?.state || "").toLowerCase() === "unavailable";
          element.disabled = !value3 || value14 || value16;
        };
        element.addEventListener("click", async () => {
          if (
            !!value3 &&
            !value14 &&
            !element.disabled &&
            (!relatedEntityNeedsConfirmation(metadata) ||
              !!window.confirm("确认执行“" + value13 + "”吗？"))
          ) {
            value14 = true;
            fn3(fn(entityId));
            try {
              await this.callEntityService("button", "press", entityId);
            } catch (error) {
              this.options.onError?.(error);
            } finally {
              value14 = false;
              fn3(fn(entityId));
            }
          }
        });
        fn3(fn(entityId));
        fn2(entityId, fn3);
        value11.append(element);
      } else if (["sensor", "binary_sensor"].includes(text)) {
        const element = document.createElement("div");
        element.className = "hb-water-heater-extension-readonly";
        const element2 = document.createElement("strong");
        element2.textContent = value13;
        const element3 = document.createElement("small");
        const fn3 = (value14) => {
          const text2 = String(value14?.state || "unknown");
          const value15 = ["unknown", "unavailable"].includes(
            text2.toLowerCase(),
          );
          const text3 = String(value14?.attributes?.unit_of_measurement || "");
          if (value15) {
            element3.textContent = "不可用";
          } else if (text === "binary_sensor") {
            element3.textContent = text2 === "on" ? "已触发" : "正常";
          } else {
            element3.textContent = "" + text2 + (text3 ? " " + text3 : "");
          }
          element.classList.toggle("is-unavailable", value15);
        };
        element.append(element2, element3);
        fn3(fn(entityId));
        fn2(entityId, fn3);
        value11.append(element);
      }
    }
    if (value11.childElementCount) {
      const element = document.createElement("strong");
      element.className = "hb-water-heater-extension-title";
      element.textContent = "扩展功能";
      value9.dataset.controlCount = String(value11.childElementCount);
      value11.dataset.controlCount = String(value11.childElementCount);
      value9.append(element, value11);
    }
    value9.stateHandlers = index;
    value9.relatedEntityIds = value7.map((value12) => value12.entityId);
    return value9;
  }
  createBathHeaterLightControl(
    value,
    value2,
    { interactive: value3 = true, onStateChange: value4 = null } = {},
  ) {
    const element = document.createElement("section");
    element.className = "hb-bath-heater-light-control";
    const value5 = document.createElement("span");
    const element2 = document.createElement("i");
    element2.setAttribute("aria-hidden", "true");
    element2.textContent = "☀";
    const element3 = document.createElement("strong");
    element3.textContent = String(
      value2?.attributes?.friendly_name || "浴霸灯",
    );
    const element4 = document.createElement("output");
    value5.append(element2, element3, element4);
    const element5 = document.createElement("button");
    element5.type = "button";
    element5.disabled = !value3;
    let value6 = value2;
    let value7 = false;
    const fn = (value9 = value6) => {
      value6 = value9 || value6;
      const unavailable = ["unknown", "unavailable"].includes(
        String(value6?.state || ""),
      );
      const isOn = value6?.state === "on";
      element.classList.toggle("is-on", isOn && !unavailable);
      element.classList.toggle("is-unavailable", unavailable);
      element4.textContent = unavailable
        ? "不可用"
        : isOn
          ? "已开启"
          : "已关闭";
      element5.textContent = isOn ? "关闭灯光" : "开启灯光";
      element5.disabled = !value3 || value7 || unavailable;
      element5.setAttribute("aria-pressed", String(isOn));
      value4?.({
        isOn: isOn,
        unavailable: unavailable,
      });
    };
    const value8 = async () => {
      if (!value3 || value7) {
        return;
      }
      value7 = true;
      const value9 = value6;
      fn({
        ...(value6 || {}),
        state: value6?.state === "on" ? "off" : "on",
      });
      try {
        await this.callEntityService("homeassistant", "toggle", value);
      } catch (error) {
        fn(value9);
        this.options.onError?.(error);
      } finally {
        value7 = false;
        fn(value6);
      }
    };
    element5.addEventListener("click", value8);
    element.append(value5, element5);
    element.syncBathLightState = fn;
    element.toggleBathLight = value8;
    fn(value2);
    return element;
  }
  showElectricBedLoadingDetails(component, { preview: _ = false } = {}) {
    if (!component.bindings?.entity?.entityId) {
      return;
    }
    this.closeRuntimeDialog();
    const value = document.createElement("dialog");
    value.className =
      "hb-entity-details-dialog electric-bed-details electric-bed-loading-details";
    value.tabIndex = -1;
    const value2 = document.createElement("div");
    value2.className = "hb-entity-details-card";
    const value3 = document.createElement("div");
    value3.className = "hb-entity-details-heading";
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(component, "电动床");
    value3.append(element);
    const value4 = document.createElement("section");
    value4.className = "hb-electric-bed-loading-body";
    const value5 = document.createElement("section");
    value5.className = "hb-climate-details-loading is-loading";
    const value6 = document.createElement("i");
    value6.setAttribute("aria-hidden", "true");
    const element2 = document.createElement("strong");
    element2.textContent = "正在加载设备状态…";
    const element3 = document.createElement("span");
    element3.textContent = "状态到达后会自动显示，无需重新打开弹窗";
    value5.append(value6, element2, element3);
    value4.append(value5);
    value2.append(value3, value4);
    value.append(value2);
    const value7 = document.createElement("div");
    value7.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value7.tabIndex = -1;
    value7.append(value);
    this.container.append(value7);
    this.detailsDialog = value;
    this.registerRuntimeDialogScale(value7, value, 760, 420);
    this.bindRuntimeDialogOutsideDismiss(value7, value, value2);
    value7.addEventListener("keydown", (value8) => {
      if (value8.key === "Escape") {
        value.close();
      }
    });
    value.addEventListener(
      "close",
      () => {
        this.clearRuntimeDialogScale(value);
        if (this.detailsDialog === value) {
          this.detailsDialog = null;
        }
        value7.remove();
      },
      {
        once: true,
      },
    );
    value.show();
    value.focus({
      preventScroll: true,
    });
  }
  showElectricBedDetails(component, { preview: value = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该电动床控件没有关联实体。");
    }
    const value2 = this.deviceProfile(entityId);
    const value3 = value2?.roles || {};
    const value4 = [
      ["backrest", "靠背角度"],
      ["leg", "腿部角度"],
      ["waist", "腰部角度"],
    ]
      .map(([role, label]) => ({
        role: role,
        label: label,
        entityId: String(value3[role] || ""),
      }))
      .filter((value26) => value26.entityId);
    const text = String(value3.mode || "");
    const value5 = this.entityMetadata.get(entityId);
    const value6 = value5?.deviceId
      ? [...this.entityMetadata.values()]
          .filter(
            (metadata) =>
              metadata.deviceId === value5.deviceId &&
              ["button", "select"].includes(
                String(metadata.domain || metadata.entityId || "").split(
                  ".",
                  1,
                )[0],
              ) &&
              metadata.entityId !== value3.mode &&
              entityMetadataIsAvailable(metadata),
          )
          .sort((value26, value27) =>
            String(value26.entityId || "").localeCompare(
              String(value27.entityId || ""),
            ),
          )
          .map((value26) => value26.entityId)
      : [];
    const value7 = [
      ...new Set(
        [
          String(value3.memory1 || ""),
          String(value3.memory2 || ""),
          ...value6,
        ].filter(Boolean),
      ),
    ].slice(0, 2);
    this.closeRuntimeDialog();
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog electric-bed-details";
    const value8 = document.createElement("div");
    value8.className = "hb-entity-details-card";
    const value9 = document.createElement("div");
    value9.className = "hb-entity-details-heading";
    const value10 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      value2?.deviceName || "电动床",
    );
    const element2 = document.createElement("span");
    value10.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭电动床详情");
    value9.append(value10, element3);
    const value11 = document.createElement("div");
    value11.className = "hb-electric-bed-details-body";
    const value12 = document.createElement("section");
    value12.className = "hb-electric-bed-visual";
    const value13 = document.createElement("div");
    value13.className = "hb-electric-bed-model";
    const value14 = document.createElement("i");
    value14.className = "hb-electric-bed-mattress";
    const value15 = document.createElement("i");
    value15.className = "hb-electric-bed-back";
    const value16 = document.createElement("i");
    value16.className = "hb-electric-bed-waist";
    const value17 = document.createElement("i");
    value17.className = "hb-electric-bed-legs";
    const value18 = document.createElement("i");
    value18.className = "hb-electric-bed-base";
    value13.append(value14, value15, value16, value17, value18);
    const fn = (value26, value27) => {
      const readout = document.createElement("span");
      readout.className = "hb-electric-bed-angle-readout " + value26;
      const value28 = document.createElement("strong");
      const element10 = document.createElement("small");
      element10.textContent = value27;
      readout.append(value28, element10);
      return {
        readout: readout,
        value: value28,
      };
    };
    const element4 = fn("back", "靠背");
    const element5 = fn("waist", "腰部");
    const element6 = fn("legs", "腿部");
    const element7 = document.createElement("strong");
    const element8 = document.createElement("small");
    value12.append(
      value13,
      element4.readout,
      element5.readout,
      element6.readout,
      element7,
      element8,
    );
    const value19 = document.createElement("section");
    value19.className = "hb-electric-bed-utilities";
    const value20 = document.createElement("section");
    value20.className = "hb-electric-bed-main";
    const value21 = document.createElement("section");
    value21.className = "hb-electric-bed-angle-controls";
    const handlers = new Map();
    const value22 = [];
    const fn2 = (entityId2) => {
      const value26 = this.states.get(entityId2);
      return (
        value26?.newState ||
        value26 || {
          entityId: entityId2,
          state: "unknown",
          attributes: {},
        }
      );
    };
    const fn3 = (role, entityId2, variant = "", value26 = value21) => {
      const value27 = fn2(entityId2);
      const element10 = document.createElement("section");
      element10.className = "hb-electric-bed-control";
      if (role === "模式") {
        element10.classList.add("hb-electric-bed-mode");
      }
      const element11 = document.createElement("strong");
      element11.textContent = role;
      const element12 = this.createCapabilityDetailsControls(
        entityId2,
        value27,
        {
          interactive: !value,
          variant: variant,
        },
      );
      element12.classList.add("hb-electric-bed-capability");
      element10.append(element11, element12);
      value26.append(element10);
      const sync = (value28) => element12.syncCapabilityState?.(value28);
      handlers.set(entityId2, [sync]);
      value22.push({
        role: role,
        entityId: entityId2,
        sync: sync,
        cleanup: () => element12.cleanupCapabilityDetails?.(),
      });
    };
    for (const value26 of value4) {
      fn3(value26.label, value26.entityId);
    }
    if (text) {
      fn3("模式", text, "electric-bed", value19);
    } else {
      const value26 = document.createElement("section");
      value26.className =
        "hb-electric-bed-control hb-electric-bed-mode is-unavailable";
      const element10 = document.createElement("strong");
      element10.textContent = "模式";
      const value27 = document.createElement("select");
      value27.className = "hb-capability-select";
      value27.disabled = true;
      value27.setAttribute("aria-label", "模式");
      const element11 = document.createElement("option");
      element11.textContent = "未识别到模式实体";
      value27.append(element11);
      value26.append(element10, value27);
      value19.append(value26);
    }
    const value23 = document.createElement("section");
    value23.className = "hb-electric-bed-memory";
    const element9 = document.createElement("strong");
    element9.textContent = "记忆姿势";
    const value24 = document.createElement("div");
    value24.className = "hb-electric-bed-memory-list";
    for (let value26 = 0; value26 < 2; value26 += 1) {
      const entityId2 = value7[value26] || "";
      const value27 = entityId2 ? this.entityMetadata.get(entityId2) : null;
      if (String(entityId2).split(".", 1)[0] === "select") {
        const value28 = document.createElement("section");
        value28.className =
          "hb-electric-bed-memory-control hb-electric-bed-control";
        const element11 = document.createElement("strong");
        element11.textContent = "记忆姿势 " + (value26 + 1);
        const element12 = this.createCapabilityDetailsControls(
          entityId2,
          fn2(entityId2),
          {
            interactive: !value,
            variant: "electric-bed-memory",
            selectLabel: "姿势",
          },
        );
        element12.classList.add("hb-electric-bed-capability");
        value28.append(element11, element12);
        value24.append(value28);
        const sync = (value29) => element12.syncCapabilityState?.(value29);
        handlers.set(entityId2, [sync]);
        value22.push({
          role: "memory" + (value26 + 1),
          entityId: entityId2,
          sync: sync,
          cleanup: () => element12.cleanupCapabilityDetails?.(),
        });
        continue;
      }
      const element10 = document.createElement("button");
      element10.type = "button";
      element10.className = "hb-electric-bed-memory-button";
      element10.textContent =
        value27?.name || value27?.originalName || "记忆姿势 " + (value26 + 1);
      element10.disabled = value || !entityId2;
      element10.classList.toggle("is-unavailable", !entityId2);
      element10.addEventListener("click", async () => {
        if (!value && !!entityId2 && !element10.disabled) {
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
            element10.disabled = value || !entityId2;
          }
        }
      });
      value24.append(element10);
    }
    value23.append(element9, value24);
    value19.append(value23);
    if (!value4.length) {
      const element10 = document.createElement("p");
      element10.className = "hb-electric-bed-empty";
      element10.textContent = "暂未识别到角度实体";
      value21.append(element10);
    }
    value20.append(value12, value21);
    value11.append(value19, value20);
    value8.append(value9, value11);
    dialog.append(value8);
    const fn4 = (_, fallback) => {
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
    const fn5 = () => {
      const value26 = fn2(value3.backrest);
      const value27 = fn2(value3.leg);
      const value28 = fn2(value3.waist);
      const fn6 = (value32) => {
        const numeric = Number(value32?.state);
        if (!Number.isFinite(numeric)) {
          return "--";
        }
        const text2 = String(value32?.attributes?.unit_of_measurement || "°");
        return "" + numeric + text2;
      };
      element4.value.textContent = fn6(value26);
      element5.value.textContent = fn6(value28);
      element6.value.textContent = fn6(value27);
      value12.style.setProperty(
        "--hb-bed-backrest-angle",
        fn4(value3.backrest, value26) * -0.42 + "deg",
      );
      value12.style.setProperty(
        "--hb-bed-leg-angle",
        fn4(value3.leg, value27) * -0.28 + "deg",
      );
      value12.style.setProperty(
        "--hb-bed-waist-angle",
        fn4(value3.waist, value28) * -0.1 + "deg",
      );
      const value29 = [value26, value27, value28].map((value32) =>
        String(value32?.state || "").toLowerCase(),
      );
      const value30 = value29.some((value32) => value32 === "unavailable");
      const value31 =
        !value30 &&
        value29.some((value32) => value32 === "unknown" || !value32);
      element7.textContent = value30
        ? "部分实体不可用"
        : value31
          ? "正在读取实体"
          : "设备在线";
      element8.textContent =
        value4.length === 3 ? "三个角度独立控制" : "正在读取电动床实体";
      element2.textContent = value30 ? "部分功能不可用" : "";
    };
    fn5();
    for (const value26 of value4) {
      handlers.get(value26.entityId)?.push(() => {
        fn5();
      });
    }
    if (text) {
      handlers.get(text)?.push(() => fn5());
    }
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
    };
    const value25 = document.createElement("div");
    value25.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value25.tabIndex = -1;
    value25.append(dialog);
    this.container.append(value25);
    this.detailsDialog = dialog;
    this.registerRuntimeDialogScale(value25, dialog, 760, 560);
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value25, dialog, value8);
    value25.addEventListener("keydown", (value26) => {
      if (value26.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        for (const value26 of value22) {
          value26.cleanup?.();
        }
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value25.remove();
      },
      {
        once: true,
      },
    );
    dialog.show();
  }
  showVacuumDetails(component, { preview: value = false } = {}) {
    const entityId = component.bindings?.entity?.entityId;
    if (!entityId) {
      throw new Error("该扫地机器人控件没有关联实体。");
    }
    const value2 = selectedRelatedEntityIds(component);
    this.closeRuntimeDialog();
    const value3 = this.states.get(entityId);
    let value4 = value3?.newState ||
      value3 || {
        state: "unknown",
        attributes: {},
      };
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog vacuum-details";
    const element = document.createElement("div");
    element.className = "hb-entity-details-card";
    element.classList.add("hb-vacuum-details-card");
    const value5 = document.createElement("div");
    value5.className = "hb-entity-details-heading";
    const value6 = document.createElement("div");
    const element2 = document.createElement("strong");
    const value7 =
      String(value4.attributes?.friendly_name || "扫地机器人").replace(
        /^\d+/,
        "",
      ) || "扫地机器人";
    element2.textContent = componentDialogTitle(component, value7);
    const element3 = document.createElement("span");
    element3.className = "hb-vacuum-details-subtitle";
    const element4 = document.createElement("button");
    element4.type = "button";
    element4.setAttribute("aria-label", "关闭扫地机器人详情");
    element4.textContent = "×";
    value6.append(element2, element3);
    value5.append(value6, element4);
    const value8 = document.createElement("div");
    value8.className = "hb-vacuum-details-layout";
    const value9 = document.createElement("section");
    value9.className = "hb-vacuum-details-overview";
    const element5 = document.createElement("div");
    element5.className = "hb-vacuum-visual";
    const value10 = document.createElement("div");
    value10.className = "hb-vacuum-battery-ring";
    const value11 = document.createElement("div");
    value11.className = "hb-vacuum-robot";
    const value12 = document.createElement("i");
    value12.className = "hb-vacuum-robot-lidar";
    const value13 = document.createElement("i");
    value13.className = "hb-vacuum-robot-sensor";
    const value14 = document.createElement("i");
    value14.className = "hb-vacuum-robot-bumper";
    const value15 = document.createElement("i");
    value15.className = "hb-vacuum-robot-brush";
    const value16 = document.createElement("i");
    value16.className = "hb-vacuum-robot-mop left";
    const value17 = document.createElement("i");
    value17.className = "hb-vacuum-robot-mop right";
    value11.append(value12, value13, value14, value15, value16, value17);
    const value18 = document.createElement("div");
    value18.className = "hb-vacuum-battery";
    const element6 = document.createElement("strong");
    const element7 = document.createElement("small");
    element7.textContent = "电量";
    value18.append(element6, element7);
    value10.append(value11);
    value5.append(value18);
    const element8 = document.createElement("span");
    element8.className = "hb-vacuum-visual-status";
    element5.append(value10, element8);
    const value19 = document.createElement("div");
    value19.className = "hb-vacuum-details-stats";
    const fn = (value44, value45) => {
      const value46 = document.createElement("div");
      const value47 = document.createElement("span");
      value47.className = "hb-vacuum-details-stat-value";
      const element14 = document.createElement("i");
      element14.textContent = value45;
      element14.setAttribute("aria-hidden", "true");
      const value48 = document.createElement("strong");
      const element15 = document.createElement("small");
      element15.textContent = value44;
      value47.append(element14, value48);
      value46.append(value47, element15);
      value19.append(value46);
      return value48;
    };
    const element9 = fn("本次面积", "◇");
    const element10 = fn("清扫时长", "◷");
    value9.append(element5, value19);
    const element11 = document.createElement("section");
    element11.className = "hb-vacuum-details-controls";
    const element12 = document.createElement("div");
    element12.className = "hb-vacuum-details-actions";
    const fn2 = (value44, value45, value46, value47) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.service = value47;
      button.disabled = value;
      const element14 = document.createElement("i");
      element14.textContent = value46;
      element14.setAttribute("aria-hidden", "true");
      const value48 = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = value44;
      const description = document.createElement("small");
      description.textContent = value45;
      value48.append(name, description);
      button.append(element14, value48);
      element12.append(button);
      return {
        button: button,
        name: name,
        description: description,
      };
    };
    const value20 = [
      ["start", "开始清扫", "启动全屋任务", "▶"],
      ["pause", "暂停", "保留当前进度", "Ⅱ"],
      ["stop", "停止", "结束当前任务", "■"],
      ["return_to_base", "回充", "返回充电座", "⌂"],
      ["locate", "定位", "让设备发出声音", "◎"],
      ["clean_spot", "局部清扫", "清扫当前位置", "⌖"],
    ];
    const index = new Map(
      value20.map(([value44, value45, value46, value47]) => [
        value44,
        fn2(value45, value46, value47, value44),
      ]),
    );
    const value22 = index.get("start");
    const value23 = index.get("pause");
    const value24 = index.get("stop");
    const value25 = index.get("return_to_base");
    const value26 = index.get("locate");
    const value27 = index.get("clean_spot");
    element11.append(element12);
    const fn3 = (value44) =>
      String(value44 || "")
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
    const value28 = [];
    const fn4 = ({
      label: value44,
      detail: value45,
      options: value46,
      current: value47,
      labels: value48,
      onSelect: fn12,
      enabled: value49 = true,
    }) => {
      if (!value46.length) {
        return null;
      }
      const group = document.createElement("section");
      group.className = "hb-vacuum-details-option-group";
      const value50 = document.createElement("div");
      const element14 = document.createElement("strong");
      element14.textContent = value44;
      const element15 = document.createElement("small");
      element15.textContent = value45;
      value50.append(element14, element15);
      const value51 = document.createElement("div");
      value51.className = "hb-vacuum-details-options";
      const entries = value46.map((value52) => {
        const key = fn3(value52);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = value48[key] || String(value52);
        button.disabled = value || !value49;
        button.addEventListener("click", () => fn12(value52, button));
        value51.append(button);
        return {
          button: button,
          key: key,
        };
      });
      const sync = (value52) => {
        const value53 = fn3(value52);
        for (const value54 of entries) {
          value54.button.classList.toggle("active", value54.key === value53);
        }
      };
      sync(value47);
      value28.push({
        group: group,
        sync: sync,
      });
      group.append(value50, value51);
      element11.append(group);
      return {
        group: group,
        sync: sync,
        entries: entries,
      };
    };
    const value29 = value4.attributes || {};
    const value30 =
      "select." + entityId.slice(entityId.indexOf(".") + 1) + "_cleaning_mode";
    const value31 = relatedDeviceEntity(
      this.entityMetadata,
      entityId,
      "select",
      "cleaning_mode",
      value30,
    );
    const text = String(value31?.entityId || "");
    const value32 = text ? this.states.get(text) : null;
    let value33 = value32?.newState || value32 || null;
    const value34 = relatedVacuumBatteryEntity(
      this.entityMetadata,
      this.states,
      entityId,
    );
    const text2 = String(value34?.entityId || "");
    const value35 = text2 ? this.states.get(text2) : null;
    let value36 = value35?.newState || value35 || null;
    let value37 = null;
    const value38 = (value44) => {
      if (value44) {
        value33 = value44;
        value37?.sync(value44.state);
      }
    };
    let value39 = false;
    const fn5 = (value44) => {
      value39 = value44;
      element11.classList.toggle("is-pending", value44);
      for (const value45 of element11.querySelectorAll(
        ":scope > .hb-vacuum-details-actions button, :scope > .hb-vacuum-details-option-group button",
      )) {
        value45.disabled =
          value || value44 || value45.dataset.unsupported === "true";
      }
    };
    const fn6 = async (
      value44,
      value45,
      value46,
      value47,
      value48 = null,
      fn12 = fn11,
      value49 = value4,
    ) => {
      if (value || value39) {
        return false;
      }
      if (value48) {
        fn12(value48);
      }
      fn5(true);
      try {
        await this.callEntityService(value44, value45, value46, value47);
        return true;
      } catch (error) {
        fn12(value49);
        this.options.onError?.(error);
        return false;
      } finally {
        fn5(false);
      }
    };
    const options = Array.isArray(value33?.attributes?.options)
      ? value33.attributes.options
      : Array.isArray(value29.cleaning_mode_list)
        ? value29.cleaning_mode_list
        : [];
    const enabled = !!text;
    value37 = fn4({
      label: "清洁模式",
      detail: enabled ? "选择本次任务方式" : "当前设备未提供模式切换实体",
      options: options,
      current: value33?.state || value29.cleaning_mode,
      labels: labels,
      enabled: enabled,
      onSelect: async (onSelect) => {
        const onSelect2 = value33 || {
          state: value29.cleaning_mode || "unknown",
          attributes: {
            options: options,
          },
        };
        const onSelect3 = {
          ...onSelect2,
          state: onSelect,
          attributes: {
            ...(onSelect2.attributes || {}),
            options: options,
          },
        };
        await fn6(
          "select",
          "select_option",
          text,
          {
            option: onSelect,
          },
          onSelect3,
          value38,
          onSelect2,
        );
      },
    });
    if (value37 && !enabled) {
      for (const value44 of value37.entries) {
        value44.button.dataset.unsupported = "true";
      }
    }
    const options2 =
      Array.isArray(value29.fan_speed_list) && value29.fan_speed_list.length
        ? value29.fan_speed_list
        : Array.isArray(value29.suction_level_list)
          ? value29.suction_level_list
          : [];
    const value40 = fn4({
      label: "吸力",
      detail: "按地面情况调节",
      options: options2,
      current: value29.fan_speed || value29.suction_level,
      labels: labels2,
      onSelect: async (fan_speed) => {
        const onSelect = value4;
        const onSelect2 = {
          ...onSelect,
          attributes: {
            ...(onSelect.attributes || {}),
            fan_speed: fan_speed,
            suction_level: fan_speed,
          },
        };
        await fn6(
          "vacuum",
          "set_fan_speed",
          entityId,
          {
            fan_speed: fan_speed,
          },
          onSelect2,
        );
      },
    });
    const value41 =
      value2 !== null
        ? this.createWaterHeaterExtensionControls(entityId, {
            component: component,
            interactive: !value,
            excludedEntityIds: [text, text2].filter(Boolean),
          })
        : null;
    const element13 = document.createElement("p");
    element13.className = "hb-vacuum-details-warning";
    element11.append(element13);
    value8.append(value9, element11);
    element.append(value5, value8);
    if (value41) {
      element.append(value41);
      dialog.classList.add("has-related-extensions");
    }
    dialog.append(element);
    const fn7 = (value44) => {
      const value45 = value44?.attributes || {};
      if (value45.washing) {
        if (value45.washing_paused) {
          return "拖布清洗已暂停";
        } else {
          return "正在清洗拖布";
        }
      }
      if (value45.drying) {
        return "正在烘干拖布";
      }
      if (value45.draining) {
        return "正在排水";
      }
      if (value45.returning) {
        return "正在返回充电座";
      }
      if (value45.mapping) {
        return "正在绘制地图";
      }
      const value46 = String(
        value45.vacuum_state || value44?.state || "",
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
        }[value46] || String(value44?.state || "状态未知")
      );
    };
    const fn8 = (value44, value45 = "--") =>
      Number.isFinite(Number(value44)) ? Number(value44) : value45;
    const fn9 = (value44) => {
      const value45 = value44?.attributes || {};
      return (
        !!value45.running ||
        !!value45.returning ||
        !!value45.washing ||
        !!value45.drying ||
        !!value45.mapping ||
        ["cleaning", "returning"].includes(
          String(value44?.state || "").toLowerCase(),
        )
      );
    };
    const fn10 = () => {
      const value44 = vacuumBatteryPercent(value4, value36);
      element6.textContent =
        value44 === null ? "--" : Math.round(value44) + "%";
    };
    const value42 = (value44) => {
      value36 = value44 || value36;
      fn10();
    };
    function fn11(value44) {
      if (!value44) {
        return;
      }
      value4 = value44;
      const value45 = value44.attributes || {};
      const value46 = fn7(value44);
      const value47 = fn9(value44);
      const value48 =
        !!value45.paused ||
        !!value45.washing_paused ||
        value44.state === "paused";
      const value49 = !!value45.returning || value44.state === "returning";
      const value50 = fn3(value45.cleaning_mode);
      const value51 = [
        "sweeping",
        "sweeping_and_mopping",
        "mopping_after_sweeping",
      ].includes(value50);
      const value52 = [
        "mopping",
        "sweeping_and_mopping",
        "mopping_after_sweeping",
      ].includes(value50);
      const allowed = new Set(vacuumSupportedActions(value44));
      for (const [value58, value59] of index) {
        value59.button.hidden = !allowed.has(value58);
      }
      const value53 = [...index.values()].filter(
        (value58) => !value58.button.hidden,
      );
      const length = value53.length;
      element12.hidden = length === 0;
      element12.classList.toggle("has-many-actions", length > 3);
      for (const value58 of index.values()) {
        value58.button.classList.remove(
          "is-last-row-pair",
          "is-last-row-single",
        );
      }
      const value54 = length % 3 || Math.min(length, 3);
      if (value54 === 2) {
        for (const value58 of value53.slice(-2)) {
          value58.button.classList.add("is-last-row-pair");
        }
      } else if (value54 === 1) {
        value53.at(-1)?.button.classList.add("is-last-row-single");
      }
      element3.textContent = value46;
      element3.classList.toggle("is-active", value47 && !value48);
      element8.textContent = value46;
      fn10();
      element5.classList.toggle("is-working", value47 && !value48);
      element5.classList.toggle("is-paused", value48);
      element5.classList.toggle("is-returning", value49);
      element5.classList.toggle("is-sweeping", value51);
      element5.classList.toggle("is-mopping", value52);
      element9.textContent = fn8(value45.cleaned_area) + " m²";
      element10.textContent = fn8(value45.cleaning_time) + " min";
      value22.button.classList.toggle(
        "active",
        value47 && !value48 && !value49,
      );
      value23.button.classList.toggle("active", value48);
      value24.button.classList.toggle("active", false);
      value25.button.classList.toggle("active", value49);
      value26.button.classList.toggle("active", false);
      value27.button.classList.toggle(
        "active",
        value47 && !value48 && !value49 && value44.state === "cleaning",
      );
      value22.name.textContent = value48 ? "继续清扫" : "开始清扫";
      if (!text) {
        value37?.sync(value45.cleaning_mode);
      }
      value40?.sync(value45.fan_speed || value45.suction_level);
      const value55 = String(value45.error || "").trim();
      const value56 = String(value45.low_water_warning || "").trim();
      const value57 = [];
      if (value55 && !/^no error$/i.test(value55)) {
        value57.push(value55);
      }
      if (value56 && !/^no warning$/i.test(value56)) {
        value57.push(value56);
      }
      element13.textContent = value57.length
        ? "注意：" + value57.join(" · ")
        : "";
      element13.hidden = !value57.length;
    }
    value22.button.addEventListener("click", () =>
      fn6(
        "vacuum",
        vacuumActionService(value4, "start"),
        entityId,
        {},
        {
          ...value4,
          state: "cleaning",
          attributes: {
            ...(value4.attributes || {}),
            running: true,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    value23.button.addEventListener("click", () =>
      fn6(
        "vacuum",
        "pause",
        entityId,
        {},
        {
          ...value4,
          state: "paused",
          attributes: {
            ...(value4.attributes || {}),
            running: false,
            paused: true,
          },
        },
      ),
    );
    value25.button.addEventListener("click", () =>
      fn6(
        "vacuum",
        "return_to_base",
        entityId,
        {},
        {
          ...value4,
          state: "returning",
          attributes: {
            ...(value4.attributes || {}),
            running: false,
            paused: false,
            returning: true,
          },
        },
      ),
    );
    value24.button.addEventListener("click", () =>
      fn6(
        "vacuum",
        vacuumActionService(value4, "stop"),
        entityId,
        {},
        {
          ...value4,
          state: "idle",
          attributes: {
            ...(value4.attributes || {}),
            running: false,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    value26.button.addEventListener("click", () =>
      fn6("vacuum", "locate", entityId, {}),
    );
    value27.button.addEventListener("click", () =>
      fn6(
        "vacuum",
        "clean_spot",
        entityId,
        {},
        {
          ...value4,
          state: "cleaning",
          attributes: {
            ...(value4.attributes || {}),
            running: true,
            paused: false,
            returning: false,
          },
        },
      ),
    );
    fn11(value4);
    const value43 = document.createElement("div");
    value43.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value43.tabIndex = -1;
    value43.append(dialog);
    this.container.append(value43);
    this.detailsDialog = dialog;
    const handlers = new Map([[entityId, [fn11]]]);
    if (text) {
      handlers.set(text, [value38]);
    }
    if (text2) {
      handlers.set(text2, [value42]);
    }
    for (const [value44, value45] of value41?.stateHandlers || []) {
      handlers.set(value44, value45);
    }
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
    };
    this.registerRuntimeDialogScale(value43, dialog, 840, value41 ? 560 : 458);
    element4.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value43, dialog, element);
    value43.addEventListener("keydown", (value44) => {
      if (value44.key === "Escape") {
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
        value43.remove();
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
    const value = [
      "presence",
      "door-window",
      "water-leak",
      "smoke",
      "natural-gas",
    ].includes(component.properties?.sensorKind)
      ? component.properties.sensorKind
      : "presence";
    const value2 = {
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
    }[value];
    let value3 = this.states.get(entityId)?.newState ||
      this.states.get(entityId) || {
        entityId: entityId,
        state: "unknown",
        attributes: {},
      };
    const count = Math.max(
      1,
      Math.min(168, Number(component.properties?.historyHours || 24)),
    );
    const value4 = this.historySeries.get(entityId)?.points || [];
    const value5 =
      component.properties?.iconOnColor ||
      component.properties?.occupiedColor ||
      "#ffffff";
    const value6 =
      component.properties?.iconColor ||
      component.properties?.clearColor ||
      "#758189";
    const fn = (value19, now = Date.now()) =>
      presenceSensorPresentation(value19, "auto", {
        ...presenceMotionEventConfig(
          entityId,
          value19,
          this.entityMetadata,
          this.states,
          component.properties,
        ),
        now: now,
      });
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog presence-details";
    dialog.dataset.sensorKind = value;
    dialog.style.setProperty("--hb-presence-occupied", value5);
    dialog.style.setProperty("--hb-presence-clear", value6);
    const value7 = document.createElement("div");
    value7.className = "hb-entity-details-card";
    const value8 = document.createElement("div");
    value8.className = "hb-entity-details-heading";
    const value9 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = componentDialogTitle(
      component,
      value3.attributes?.friendly_name || value2.title,
    );
    const element2 = document.createElement("span");
    value9.append(element, element2);
    const element3 = document.createElement("button");
    element3.type = "button";
    element3.textContent = "×";
    element3.setAttribute("aria-label", "关闭弹窗");
    value8.append(value9, element3);
    const value10 = document.createElement("div");
    value10.className = "hb-presence-details-body";
    const value11 = document.createElement("section");
    value11.className = "hb-presence-details-visual";
    let element4 = null;
    if (value === "presence") {
      const value19 = document.createElement("span");
      value19.className = "hb-presence-sensor-space";
      for (let value28 = 0; value28 < 3; value28 += 1) {
        value19.append(document.createElement("i"));
      }
      const value20 = document.createElement("span");
      value20.className = "hb-presence-sensor-floor";
      const value21 = document.createElement("span");
      value21.className = "hb-presence-sensor-person";
      const value22 = document.createElement("i");
      const value23 = document.createElement("b");
      const value24 = document.createElement("span");
      value24.className = "arm left";
      const value25 = document.createElement("span");
      value25.className = "arm right";
      const value26 = document.createElement("span");
      value26.className = "leg left";
      const value27 = document.createElement("span");
      value27.className = "leg right";
      value21.append(value22, value23, value24, value25, value26, value27);
      value11.append(value19, value20, value21);
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
          states: new Map([[entityId, value3]]),
          entityMetadata: this.entityMetadata,
          editable: false,
          previewState: "auto",
          document: this.document,
        },
      );
      element4.classList.add("hb-presence-details-sensor");
      value11.append(element4);
    }
    const element5 = document.createElement("strong");
    const element6 = document.createElement("small");
    value11.append(element5, element6);
    const value12 = document.createElement("section");
    value12.className = "hb-presence-details-metrics";
    const fn2 = (value19) => {
      const value20 = document.createElement("div");
      const element13 = document.createElement("small");
      element13.textContent = value19;
      const value21 = document.createElement("strong");
      value20.append(element13, value21);
      value12.append(value20);
      return value21;
    };
    const element7 = fn2("当前状态持续");
    const element8 = fn2("最近检测到人");
    const element9 = fn2(count + " 小时有人时长");
    const value13 = document.createElement("section");
    value13.className = "hb-presence-details-timeline";
    const value14 = document.createElement("div");
    const element10 = document.createElement("strong");
    element10.textContent = count + " 小时在家时间轴";
    const element11 = document.createElement("span");
    element11.textContent = "亮色为有人";
    value14.append(element10, element11);
    const value15 = document.createElement("div");
    const element12 = document.createElement("div");
    element12.innerHTML = "<span>" + count + " 小时前</span><span>现在</span>";
    value13.append(value14, value15, element12);
    value10.append(value11, value12, value13);
    value7.append(value8, value10);
    dialog.append(value7);
    const fn3 = (value19) => {
      if (!Number.isFinite(value19)) {
        return "--";
      }
      const value20 = new Date(value19);
      const value21 = new Date();
      const value22 =
        value20.getFullYear() === value21.getFullYear() &&
        value20.getMonth() === value21.getMonth() &&
        value20.getDate() === value21.getDate();
      const value23 = new Intl.DateTimeFormat("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(value20);
      if (value22) {
        return "今天 " + value23;
      } else {
        return new Intl.DateTimeFormat("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
          .format(value20)
          .replace(/\//g, "-");
      }
    };
    const fn4 = () => {
      const value19 = presenceHistoryBuckets(
        value4,
        value3,
        Date.now(),
        count,
        48,
        presenceMotionEventConfig(
          entityId,
          value3,
          this.entityMetadata,
          this.states,
          component.properties,
        ),
      );
      value15.replaceChildren(
        ...value19.map((value20, value21) => {
          const value22 = document.createElement("i");
          value22.className = "is-" + value20;
          const rounded2 = Math.round(
            (count * 60 * (value19.length - value21 - 1)) / value19.length,
          );
          value22.title =
            (rounded2 ? rounded2 + " 分钟前" : "现在") +
            "：" +
            {
              occupied: "有人",
              clear: "无人",
              unavailable: "离线",
              unknown: "未知",
            }[value20];
          return value22;
        }),
      );
      const length = value19.filter((value20) => value20 === "occupied").length;
      const rounded = Math.round(
        (count * 60 * length) / Math.max(1, value19.length),
      );
      element9.textContent =
        rounded >= 60
          ? Math.floor(rounded / 60) + " 小时 " + (rounded % 60) + " 分钟"
          : rounded + " 分钟";
    };
    const fn5 = () => {
      const value19 = presenceMotionEventConfig(
        entityId,
        value3,
        this.entityMetadata,
        this.states,
        component.properties,
      );
      const value20 = value4
        .map((element13) => ({
          timestamp: Date.parse(element13?.timestamp),
          state: {
            state: element13?.value,
          },
        }))
        .filter(
          (value21) =>
            Number.isFinite(value21.timestamp) &&
            presenceSensorPresentation(
              {
                state: value21?.state?.state,
                lastChanged: new Date(value21.timestamp).toISOString(),
              },
              "auto",
              {
                ...value19,
                now: value21.timestamp,
                noMotionSeconds: null,
                noMotionStateTimestamp: null,
              },
            ).key === "occupied",
        );
      const timestamp = presenceStateTimestamp(value3);
      if (fn(value3).key === "occupied" && Number.isFinite(timestamp)) {
        value20.push({
          timestamp: timestamp,
        });
      }
      if (value20.length) {
        return Math.max(...value20.map((value21) => value21.timestamp));
      } else {
        return null;
      }
    };
    const fn6 = (value19) => {
      value3 = value19 || value3;
      const value20 = fn(value3);
      const value21 = presenceStateTimestamp(value3);
      dialog.dataset.presenceState = value20.key;
      value11.className = "hb-presence-details-visual is-" + value20.key;
      const value22 = value2[value20.key] || value2.unknown;
      element2.textContent = value22;
      element2.classList.toggle("is-on", value20.key === "occupied");
      element5.textContent = value22;
      element6.textContent =
        value20.key === "occupied"
          ? value2.hintOccupied
          : value20.key === "clear"
            ? value2.hintClear
            : value20.key === "unavailable"
              ? "设备当前不可用"
              : "正在等待状态";
      if (element4) {
        const value23 = {
          "door-window":
            "hb-door-window-sensor is-" +
            (value20.key === "occupied" ? "open" : value20.key),
          "water-leak":
            "hb-water-leak-sensor is-" +
            (value20.key === "occupied" ? "wet" : value20.key),
          smoke:
            "hb-smoke-sensor is-" +
            (value20.key === "occupied" ? "alert" : value20.key),
          "natural-gas":
            "hb-natural-gas-sensor is-" +
            (value20.key === "occupied" ? "alert" : value20.key),
        }[value];
        element4.className = value23 + " hb-presence-details-sensor";
        element4.dataset.sensorState = value20.key;
        element4.setAttribute("aria-label", value2.title + "：" + value22);
      }
      element7.textContent = ["unknown", "unavailable"].includes(value20.key)
        ? "--"
        : formatPresenceDuration(value21);
      element8.textContent = fn3(fn5());
      fn4();
    };
    fn6(value3);
    const value16 = presenceMotionEventConfig(
      entityId,
      value3,
      this.entityMetadata,
      this.states,
      component.properties,
    );
    const handlers = new Map([[entityId, [fn6]]]);
    for (const value19 of value16.companionEntityIds) {
      handlers.set(value19, [() => fn6(value3)]);
    }
    const value17 = value16.motionEvent
      ? window.setInterval(() => fn6(value3), 1000)
      : null;
    const value18 = document.createElement("div");
    value18.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value18.tabIndex = -1;
    value18.append(dialog);
    this.container.append(value18);
    this.detailsDialog = dialog;
    this.detailsStateSync = {
      dialog: dialog,
      handlers: handlers,
    };
    this.registerRuntimeDialogScale(value18, dialog, 760, 560);
    element3.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value18, dialog, value7);
    value18.addEventListener("keydown", (value19) => {
      if (value19.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        if (value17) {
          window.clearInterval(value17);
        }
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value18.remove();
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
    const value = this.deviceProfile(entityId2);
    component = applyXiaomiDeviceProfile(component, value);
    const value2 = entityId2.split(".", 1)[0];
    const value3 =
      component.properties?.deviceType === "electric-bed" ||
      value?.deviceType === "electric-bed";
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
        value3 ? "electric-bed-catalog" : "catalog",
      );
      if (value3) {
        this.showElectricBedLoadingDetails(component, {
          preview: preview,
        });
      }
      return;
    }
    if (
      !value &&
      value2 === "number" &&
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
        value3 ? "electric-bed-catalog" : "catalog",
      );
      if (value3) {
        this.showElectricBedLoadingDetails(component, {
          preview: preview,
        });
      }
      return;
    }
    if (value2 === "water_heater" && !this.waterHeaterDetailsReady(entityId2)) {
      this.deferEntityDetailsUntilReady(component, preview);
      return;
    }
    window.clearTimeout(this.pendingEntityDetails?.timer);
    this.pendingEntityDetails = null;
    if (component.type === "presence-sensor") {
      this.showPresenceDetails(component, {
        preview: preview,
      });
      return;
    }
    if (value?.deviceType === "electric-bed") {
      this.showElectricBedDetails(component, {
        preview: preview,
      });
      return;
    }
    if (
      value?.deviceType === "air-purifier" &&
      value2 === "fan" &&
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
    const value4 = new Set([
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
      (!value4 && value2 === "media_player")
    ) {
      this.showMediaPlayerDetails(component, {
        preview: preview,
      });
      return;
    }
    if (component.type === "air-purifier") {
      this.showAirPurifierDetails(component, {
        preview: preview,
      });
      return;
    }
    if (
      ["air-conditioner", "bath-heater"].includes(value?.deviceType) &&
      ["climate", "fan"].includes(value2) &&
      !value4 &&
      component.type !== "air-conditioner"
    ) {
      component = {
        ...component,
        type: "air-conditioner",
      };
    }
    if (
      component.type === "vacuum-control" ||
      (!value4 && entityId2.startsWith("vacuum."))
    ) {
      this.showVacuumDetails(component, {
        preview: preview,
      });
      return;
    }
    const value5 = this.states.get(entityId2);
    const value6 = value5?.newState || value5;
    const value7 = value6?.attributes || {};
    const value8 = component.type === "line-chart";
    const value9 = !value8 && value2 === "cover";
    const value10 = ["standard", "dream", "airer"].includes(
      component.properties?.coverKind,
    )
      ? component.properties.coverKind
      : "auto";
    const airer =
      value9 &&
      coverComponentIsAirer(
        component,
        entityId2,
        value6,
        this.entityMetadata,
        this.deviceMetadata,
      );
    const numeric = Number(value7.supported_features || 0);
    const value11 =
      entityId2 +
      " " +
      (value7.friendly_name || "") +
      " " +
      (component.properties?.label || "");
    const value12 =
      Number.isFinite(Number(value7.current_tilt_position)) ||
      !!(numeric & 240);
    const value13 = /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(
      value11,
    );
    const dream =
      value9 &&
      !airer &&
      (value10 === "dream" || (value10 === "auto" && (value12 || value13)));
    const tilt = dream && value12;
    const value14 =
      (airer ? relatedAirerLightEntity(this.entityMetadata, entityId2) : null)
        ?.entityId || "";
    const value15 = value14 ? this.states.get(value14) : null;
    let value16 = value15?.newState || value15 || null;
    const positionCommandEntityId =
      (airer
        ? relatedAirerPositionNumberEntity(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const value17 = this.states.get(positionCommandEntityId);
    const positionCommandState = value17?.newState || value17 || null;
    const value18 =
      (airer
        ? relatedAirerCurrentPositionSensor(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const value19 =
      (airer
        ? relatedAirerMotorSpeedSensor(this.entityMetadata, entityId2)
        : null
      )?.entityId || "";
    const value20 = this.states.get(value19);
    const motorState = value20?.newState || value20 || null;
    const value21 = airer
      ? relatedAirerMotorActionEntities(this.entityMetadata, entityId2)
      : {};
    const airerActionEntityIds = Object.fromEntries(
      Object.entries(value21).map(([value57, value58]) => [
        value57,
        value58?.entityId || "",
      ]),
    );
    const value22 = this.states.get(value18 || positionCommandEntityId);
    const positionState = value22?.newState || value22 || null;
    const motorReversed =
      value9 &&
      coverMotorIsReversedForComponent(
        component,
        this.entityMetadata,
        this.states,
        entityId2,
      );
    const value23 = motorReversed ? "open_cover" : "close_cover";
    const value24 = motorReversed ? "close_cover" : "open_cover";
    const value25 = ["left", "right"].includes(
      component.properties?.coverDirection,
    )
      ? component.properties.coverDirection
      : "split";
    const momentary = !value8 && value2 === "button";
    const value26 =
      !value8 && (momentary || ["switch", "input_boolean"].includes(value2));
    const value27 = component.type === "icon-button" && value2 === "light";
    const value28 =
      !value8 &&
      (component.type === "air-conditioner" ||
        component.type === "water-heater" ||
        ["climate", "water_heater"].includes(value2));
    const deviceType = value28
      ? value2 === "water_heater" || component.type === "water-heater"
        ? "water-heater"
        : resolveClimateDeviceType(component, value6, entityId2)
      : "air-conditioner";
    const value29 = climateDeviceLabel(deviceType);
    const value30 = componentDialogTitle(
      component,
      String(value7.friendly_name || "").trim() || value29,
    ).replace(/(浴霸)(?:\s+浴霸)+$/i, "$1");
    const label = componentDialogTitle(
      component,
      String(value7.friendly_name || "").trim() ||
        (momentary ? "按钮" : "开关"),
    );
    const value31 = value27 || value28 || value26;
    this.closeRuntimeDialog();
    const fn = (state, attributes = value7) =>
      momentary
        ? false
        : value27 || value26
          ? state === "on"
          : climateIsPoweredOn(
              {
                state: state,
                attributes: attributes,
              },
              deviceType,
            );
    const dialog = document.createElement("dialog");
    dialog.className = "hb-entity-details-dialog";
    dialog.tabIndex = -1;
    dialog.classList.toggle("line-chart-details", value8);
    dialog.classList.toggle("light-details", value27);
    dialog.classList.toggle("cover-details", value9);
    dialog.classList.toggle("dream-cover-details", dream);
    dialog.classList.toggle("airer-cover-details", airer);
    dialog.classList.toggle("climate-details", value28);
    dialog.classList.toggle(
      "bath-heater-details",
      deviceType === "bath-heater",
    );
    dialog.classList.toggle(
      "water-heater-details",
      deviceType === "water-heater",
    );
    dialog.classList.toggle("switch-details", value26);
    dialog.classList.toggle("momentary-button-details", momentary);
    const value32 = document.createElement("div");
    value32.className = "hb-entity-details-card";
    const value33 = document.createElement("div");
    value33.className = "hb-entity-details-heading";
    const value34 = document.createElement("div");
    const element = document.createElement("strong");
    element.textContent = value27
      ? componentDialogTitle(component, "灯光")
      : value9
        ? componentDialogTitle(component, airer ? "晾衣机" : "窗帘")
        : value28
          ? value30
          : value26
            ? label
            : componentDialogTitle(component, "设备详情");
    value34.append(element);
    let element2 = null;
    let element3 = null;
    let text = String(value6?.state || "");
    let element4 = null;
    let element5 = null;
    let element6 = null;
    if (value27) {
      const element17 = document.createElement("span");
      element17.textContent = value6?.state === "on" ? "已开启" : "已关闭";
      element17.classList.toggle("is-on", value6?.state === "on");
      element2 = element17;
      value34.append(element17);
    } else if (value9) {
      const element17 = document.createElement("span");
      const value57 = physicalCoverState(value6?.state, motorReversed);
      const numeric2 = Number(
        value7[tilt ? "current_tilt_position" : "current_position"],
      );
      const value58 = {
        open: "已打开",
        closed: "已关闭",
        opening: "正在打开",
        closing: "正在关闭",
      };
      element17.textContent = airer
        ? ln(value57) || value57 || "状态未知"
        : dream
          ? dreamCurtainStatusText(value6?.state, numeric2, motorReversed)
          : value58[value57] || value57 || "状态未知";
      element17.classList.toggle(
        "is-on",
        value57 === "open" || value57 === "opening",
      );
      element3 = element17;
      value34.append(element17);
    } else if (value28 || value26) {
      const element17 = document.createElement("span");
      const value57 = fn(value6?.state);
      element17.textContent = momentary
        ? ["unknown", "unavailable"].includes(value6?.state)
          ? "当前不可用"
          : "按下执行"
        : deviceType === "water-heater"
          ? waterHeaterStatusLabel(value6)
          : ["unknown", "unavailable"].includes(value6?.state)
            ? "当前不可用"
            : value57
              ? "已开启"
              : "已关闭";
      element17.classList.toggle("is-on", value57);
      if (value28) {
        element4 = element17;
      } else {
        element5 = element17;
      }
      value34.append(element17);
    } else if (component.type === "line-chart") {
      const element17 = document.createElement("span");
      element17.textContent =
        value6?.state == null ||
        ["unknown", "unavailable"].includes(value6.state)
          ? "暂无数据"
          : "实时数据";
      element6 = element17;
      value34.append(element17);
    }
    const element7 = document.createElement("button");
    element7.type = "button";
    element7.setAttribute("aria-label", "关闭实体详情");
    element7.textContent = "×";
    value33.append(value34, element7);
    let value35 = value6;
    let element8 = null;
    let fn2 = null;
    let element9 = null;
    let value36 = null;
    let element10 = null;
    let fn3 = null;
    let fn4 = null;
    let value37 = 0;
    const positionCalibration = airerPositionCalibration(
      this.entityMetadata,
      this.deviceMetadata,
      entityId2,
    );
    let value38 = false;
    let element11 = null;
    let value39 = null;
    let value40 = null;
    let fn5 = null;
    let fn6 = null;
    let value41 = false;
    let value42 = null;
    let value43 = "idle";
    let value44 = "";
    let value45 = null;
    let value46 = null;
    let allowed = new Set();
    const value47 = selectedRelatedEntityIds(component);
    const allowed2 = new Set(value47 || []);
    if (value27) {
      element9 = document.createElement("button");
      element9.type = "button";
      element9.className = "hb-light-visual";
      element9.inert = preview;
      element9.setAttribute("aria-disabled", String(preview));
      const value57 = document.createElement("div");
      value57.className = "hb-light-visual-aura";
      const value58 = document.createElement("div");
      value58.className = "hb-light-visual-lamp";
      for (const value64 of ["cord", "shade", "bulb", "filament"]) {
        const value65 = document.createElement("i");
        value65.className = "hb-light-visual-" + value64;
        value65.setAttribute("aria-hidden", "true");
        value58.append(value65);
      }
      const element17 = document.createElement("span");
      element17.className = "hb-light-visual-status";
      element9.append(value57, value58, element17);
      const value59 =
        Number(value7.min_color_temp_kelvin) ||
        (Number.isFinite(Number(value7.max_mireds))
          ? 1000000 / Number(value7.max_mireds)
          : 2000);
      const value60 =
        Number(value7.max_color_temp_kelvin) ||
        (Number.isFinite(Number(value7.min_mireds))
          ? 1000000 / Number(value7.min_mireds)
          : 6500);
      const value61 =
        Number(value7.color_temp_kelvin) ||
        (Number.isFinite(Number(value7.color_temp))
          ? 1000000 / Number(value7.color_temp)
          : NaN);
      const colorTemperatureKelvin = Number.isFinite(value61)
        ? value61
        : (value59 + value60) / 2;
      const value62 = lightSupportsColor(value7);
      const value63 = {
        isOn: value6?.state === "on",
        brightnessPercent: Number.isFinite(Number(value7.brightness))
          ? (Number(value7.brightness) / 255) * 100
          : 100,
        colorTemperatureKelvin: colorTemperatureKelvin,
        colorRgb:
          value62 && Array.isArray(value7.rgb_color)
            ? value7.rgb_color
                .slice(0, 3)
                .map((colorRgb) => Number(colorRgb) || 0)
            : value62 && Array.isArray(value7.hs_color)
              ? hsToRgbColor(value7.hs_color)
              : null,
      };
      const fn8 = () => {
        const count = Math.max(
          1,
          Math.min(100, Number(value63.brightnessPercent) || 1),
        );
        const count2 = Math.max(
          2000,
          Math.min(6500, Number(value63.colorTemperatureKelvin) || 3000),
        );
        const value64 = (count2 - 2000) / 4500;
        const value65 = [255, 132, 42];
        const value66 = [172, 225, 255];
        const value67 =
          "rgb(" +
          (
            value63.colorRgb ||
            value65.map((value68, value69) =>
              Math.round(value68 + (value66[value69] - value68) * value64),
            )
          ).join(",") +
          ")";
        element9.classList.toggle("is-on", value63.isOn);
        element9.style.setProperty("--hb-light-visual-color", value67);
        element9.style.setProperty(
          "--hb-light-visual-opacity",
          value63.isOn ? String(0.08 + (count / 100) * 0.92) : "0",
        );
        element9.style.setProperty(
          "--hb-light-visual-blur",
          Math.round(15 + count * 1.14) + "px",
        );
        element9.style.setProperty(
          "--hb-light-visual-scale",
          String(0.62 + (count / 100) * 1.05),
        );
        element17.textContent = value63.isOn
          ? Math.round(count) + "%  ·  " + Math.round(count2) + "K"
          : "灯光已关闭";
        element9.setAttribute("aria-label", element17.textContent);
      };
      value36 = (value64 = {}) => {
        const value65 = value64.attributes || {};
        if (typeof value64.isOn == "boolean") {
          value63.isOn = value64.isOn;
        } else if (typeof value64.state == "string") {
          value63.isOn = value64.state === "on";
        }
        if (Number.isFinite(Number(value64.brightnessPercent))) {
          value63.brightnessPercent = Number(value64.brightnessPercent);
        } else if (Number.isFinite(Number(value65.brightness))) {
          value63.brightnessPercent = (Number(value65.brightness) / 255) * 100;
        }
        if (Number.isFinite(Number(value64.colorTemperatureKelvin))) {
          value63.colorTemperatureKelvin = Number(
            value64.colorTemperatureKelvin,
          );
        } else if (Number.isFinite(Number(value65.color_temp_kelvin))) {
          value63.colorTemperatureKelvin = Number(value65.color_temp_kelvin);
        } else if (Number.isFinite(Number(value65.color_temp))) {
          value63.colorTemperatureKelvin = 1000000 / Number(value65.color_temp);
        }
        if (value62 && Array.isArray(value64.colorRgb)) {
          value63.colorRgb = value64.colorRgb
            .slice(0, 3)
            .map((value66) => Number(value66) || 0);
        } else if (value62 && Array.isArray(value65.rgb_color)) {
          value63.colorRgb = value65.rgb_color
            .slice(0, 3)
            .map((value66) => Number(value66) || 0);
        } else if (value62 && Array.isArray(value65.hs_color)) {
          value63.colorRgb = hsToRgbColor(value65.hs_color);
        }
        fn8();
      };
      fn8();
    }
    if (value9) {
      element10 = document.createElement("button");
      element10.type = "button";
      element10.className = "hb-cover-visual";
      element10.inert = preview;
      element10.setAttribute("aria-disabled", String(preview));
      const value57 = document.createElement("i");
      value57.className = "hb-cover-visual-rail";
      const value58 = document.createElement("i");
      value58.className = "hb-cover-visual-panel left";
      const value59 = document.createElement("i");
      value59.className = "hb-cover-visual-panel right";
      const value60 = document.createElement("span");
      value60.className = "hb-cover-visual-slats";
      const value61 = 13;
      for (let value63 = 0; value63 < value61; value63 += 1) {
        const value64 = document.createElement("span");
        value64.className = "hb-cover-visual-slat";
        const value65 = document.createElement("i");
        value64.style.setProperty("--hb-cover-slat-index", String(value63));
        const value66 =
          value25 === "right"
            ? value61 - 1 - value63
            : value25 === "split"
              ? Math.abs((value61 - 1) / 2 - value63)
              : value63;
        value64.style.setProperty(
          "--hb-cover-slat-delay-index",
          String(value66),
        );
        const value67 =
          value25 === "left"
            ? -value63 * 14.5
            : value25 === "right"
              ? (value61 - 1 - value63) * 14.5
              : value63 <= (value61 - 1) / 2
                ? -value63 * 14.5
                : (value61 - 1 - value63) * 14.5;
        value64.style.setProperty("--hb-cover-retracted-shift", value67 + "px");
        value64.append(value65);
        value60.append(value64);
      }
      const value62 = document.createElement("i");
      value62.className = "hb-cover-visual-window";
      element10.classList.toggle("is-dream", dream);
      element10.classList.toggle("is-airer", airer);
      element10.classList.add("direction-" + value25);
      element10.append(value62, value57, value58, value59, value60);
      if (airer) {
        fi(element10);
      }
      fn4 = (value63 = value16) => {
        if (!airer) {
          return;
        }
        value16 = value63 || value16;
        const value64 =
          !value14 ||
          ["unknown", "unavailable"].includes(
            String(value16?.state || "unknown"),
          );
        const value65 = value16?.state === "on";
        element10.classList.toggle("is-light-on", value65 && !value64);
        element10.classList.toggle("is-light-unavailable", value64);
        element10.disabled = preview || value64;
        element10.setAttribute("aria-pressed", String(value65 && !value64));
        element10.setAttribute(
          "aria-label",
          value64
            ? "晾衣机灯光实体不可用"
            : "晾衣机灯光" +
                (value65 ? "已开启，点击关闭" : "已关闭，点击开启"),
        );
      };
      fn4();
      fn3 = ({ position: value63 = 0, state = "" } = {}) => {
        const current_position = Math.max(
          0,
          Math.min(100, Number(value63) || 0),
        );
        const value64 = coverPresentationState(
          {
            state: state,
            attributes: {
              current_position: current_position,
            },
          },
          motorReversed,
        );
        const value65 = physicalCoverState(state || text, motorReversed);
        const value66 = value65 === "open" || value65 === "opening";
        value37 = current_position;
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
          dream ? value66 : value64 === "open" || value64 === "opening",
        );
        element10.classList.toggle(
          "is-moving",
          state === "opening" || state === "closing",
        );
        element10.setAttribute(
          "aria-pressed",
          String(dream ? value66 : value64 === "open" || value64 === "opening"),
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
                  (value64 === "open" || value64 === "opening"
                    ? "已打开，点击关闭"
                    : "已关闭，点击打开"),
          );
        }
      };
      fn3({
        position: Number.isFinite(
          Number(value7[tilt ? "current_tilt_position" : "current_position"]),
        )
          ? Number(value7[tilt ? "current_tilt_position" : "current_position"])
          : value6?.state === "open"
            ? 100
            : 0,
        state: value6?.state,
      });
      element10.addEventListener("click", async () => {
        if (preview || value38) {
          return;
        }
        value38 = true;
        element10.setAttribute("aria-busy", "true");
        if (airer) {
          const value65 = value16;
          fn4({
            ...(value16 || {}),
            state: value16?.state === "on" ? "off" : "on",
          });
          try {
            await this.callEntityService("homeassistant", "toggle", value14);
          } catch (error) {
            fn4(value65);
            this.options.onError?.(error);
          } finally {
            value38 = false;
            element10.removeAttribute("aria-busy");
          }
          return;
        }
        const position = value37;
        const value63 =
          element8?.isDreamCurtainRetracted?.() ??
          element10.dataset.curtainRetracted === "true";
        const value64 = position > COVER_CLOSED_POSITION_EPSILON;
        if (dream) {
          element8?.beginDreamCurtainMotion?.(!value63);
        }
        if (!dream) {
          element8?.beginCoverMotion?.(
            value64 ? 0 : 100,
            value64 ? "closing" : "opening",
          );
        }
        try {
          await this.callEntityService(
            "cover",
            dream
              ? dreamCurtainToggleService(value63, value24, value23)
              : value64
                ? value23
                : value24,
            entityId2,
          );
        } catch (error) {
          if (dream) {
            element8?.cancelDreamCurtainMotion?.();
            element8?.setDreamCurtainRetracted?.(value63, false);
          } else {
            element8?.cancelCoverMotion?.();
          }
          element8?.syncCoverState?.(value6);
          fn3({
            position: position,
            state: value6?.state,
          });
          this.options.onError?.(error);
        } finally {
          value38 = false;
          element10.removeAttribute("aria-busy");
        }
      });
    }
    if (value28) {
      const value57 = {
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
      const value58 = document.createElement("div");
      value58.className = "hb-climate-visual-unit";
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
      const value59 = document.createElement("div");
      value59.className = "hb-climate-visual-vent";
      for (let value61 = 0; value61 < 5; value61 += 1) {
        value59.append(document.createElement("i"));
      }
      value58.append(element17, element18, value59);
      const value60 = document.createElement("div");
      value60.className = "hb-climate-visual-airflow";
      for (let value61 = 0; value61 < 3; value61 += 1) {
        value60.append(document.createElement("i"));
      }
      element11.append(value58, value60);
      value39 = ({
        mode: value62 = "off",
        visualMode: value63 = "off",
        running: value64 = false,
        accentColor: value65 = "#65717a",
        targetTemperature: value61,
      } = {}) => {
        const value66 = value63 !== "off";
        element11.classList.toggle("is-on", value66);
        element11.classList.toggle("is-running", value64);
        element11.classList.toggle(
          "is-airflow-mode",
          deviceType === "bath-heater" &&
            value66 &&
            bathHeaterModeUsesAirflow(value62),
        );
        element11.dataset.visualMode = value63;
        element11.style.setProperty("--hb-climate-visual-accent", value65);
        const value67 =
          value61 != null && value61 !== "" && Number.isFinite(Number(value61));
        element18.textContent = value66
          ? value67
            ? Number(value61) + "°"
            : climateModeLabel(value62, deviceType, value57)
          : "OFF";
      };
    }
    if (value26) {
      const value57 = dn({
        label: label,
        interactive: !preview,
        momentary: momentary,
        onToggle: () => fn6?.(),
      });
      value40 = value57.visual;
      fn5 = value57.sync;
      fn5(fn(value6?.state), {
        unavailable: ["unknown", "unavailable"].includes(value6?.state),
      });
    }
    const element12 = document.createElement(value31 ? "button" : "div");
    element12.className = "hb-entity-details-state";
    if (value31) {
      element12.type = "button";
    }
    const element13 = document.createElement("span");
    element13.textContent = value31 ? "⏻" : "当前状态";
    const element14 = document.createElement("strong");
    const value48 = {
      off: "关闭",
      auto: "自动",
      cool: "制冷",
      dry: "除湿",
      heat: "制热",
      fan_only: "送风",
      heat_cool: "冷暖自动",
    };
    element14.textContent = value31
      ? value6?.state
        ? fn(value6.state)
          ? "已开启"
          : "已关闭"
        : "状态未知"
      : value2 === "climate"
        ? value48[value6?.state] || value6?.state || "暂无状态"
        : (value6?.state ?? "暂无状态");
    element12.classList.toggle("hb-light-details-power", value27);
    element12.classList.toggle("hb-climate-details-power", value28);
    element12.classList.toggle("hb-switch-details-power", value26);
    element12.classList.toggle("is-on", value31 && fn(value6?.state));
    element12.append(element13, element14);
    if (value31) {
      element12.inert = preview;
      element12.setAttribute("aria-disabled", String(preview));
      fn2 = (
        isOn,
        { unavailable = false, syncClimate: value57 = true } = {},
      ) => {
        element12.classList.toggle("is-on", isOn);
        element12.classList.toggle("is-unavailable", unavailable);
        element12.setAttribute("aria-pressed", String(isOn));
        element12.disabled = unavailable || preview;
        element14.textContent = unavailable
          ? "当前不可用"
          : momentary
            ? value43 === "success"
              ? "执行成功"
              : value41
                ? "执行中"
                : "等待执行"
            : isOn
              ? "已开启"
              : "已关闭";
        element12.setAttribute(
          "aria-label",
          unavailable
            ? (value27
                ? componentDialogTitle(component, "灯光")
                : value28
                  ? value30
                  : label) + "当前不可用"
            : momentary
              ? "" +
                label +
                (value43 === "success"
                  ? "执行成功"
                  : value41
                    ? "正在执行"
                    : "，点击执行")
              : "" +
                componentDialogTitle(
                  component,
                  value27 ? "灯光" : value28 ? value29 : "开关",
                ) +
                (isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
        );
        if (value27) {
          value36?.({
            isOn: isOn,
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
        if (value28 && element8?.syncClimateState && value57) {
          const climateCapabilities = normalizeClimateCapabilities(
            value35 || value6,
          );
          const value59 =
            deviceType === "water-heater"
              ? climateCapabilities.operationModes.find(
                  (value61) =>
                    !["off", "空"].includes(
                      String(value61).trim().toLowerCase(),
                    ),
                ) || "普通"
              : climateCapabilities.hvacModes.find(
                  (value61) => value61 !== "off",
                ) || (deviceType === "bath-heater" ? "heat" : "auto");
          const value60 =
            element8.dataset.lastClimateMode ||
            (value6?.state && value6.state !== "off" ? value6.state : value59);
          element8.syncClimateState({
            state: isOn
              ? deviceType === "water-heater"
                ? "on"
                : value60
              : "off",
            attributes: {
              ...(value35?.attributes || value6?.attributes || {}),
              operation_mode:
                deviceType === "water-heater"
                  ? isOn
                    ? value35?.attributes?.operation_mode || value59
                    : "off"
                  : undefined,
              hvac_action:
                deviceType === "water-heater"
                  ? undefined
                  : isOn
                    ? value6?.attributes?.hvac_action || value60
                    : "off",
            },
          });
        }
        if (value28) {
          element4.textContent =
            deviceType === "water-heater"
              ? waterHeaterStatusLabel({
                  ...(value35 || value6 || {}),
                  state: isOn ? "on" : "off",
                })
              : isOn
                ? "已开启"
                : "已关闭";
          element4.classList.toggle("is-on", isOn);
          if (deviceType === "bath-heater") {
            if (!value45) {
              element11.setAttribute("aria-pressed", "false");
            }
            element11.setAttribute("aria-label", value30 + "，点击切换浴霸灯");
          } else {
            element11.setAttribute("aria-pressed", String(isOn));
            element11.setAttribute(
              "aria-label",
              "" + value30 + (isOn ? "已开启，点击关闭" : "已关闭，点击开启"),
            );
          }
        }
        if (value26) {
          fn5?.(isOn, {
            pending: value41 && value43 !== "success",
            success: value43 === "success",
            unavailable: unavailable,
          });
          element5.textContent = unavailable
            ? "当前不可用"
            : momentary
              ? value43 === "success"
                ? "执行成功"
                : value41
                  ? "正在执行"
                  : "按下执行"
              : isOn
                ? "已开启"
                : "已关闭";
          element5.classList.toggle(
            "is-on",
            (momentary ? value41 || value43 === "success" : isOn) &&
              !unavailable,
          );
        }
      };
      if (value6?.state) {
        fn2(fn(value6.state), {
          unavailable: ["unknown", "unavailable"].includes(value6.state),
        });
      }
      fn6 = async () => {
        if (preview || value41 || !value35?.state) {
          return;
        }
        value41 = true;
        const value57 = value27 ? element9 : value28 ? element11 : value40;
        value57?.setAttribute("aria-busy", "true");
        const value58 = element12.classList.contains("is-on");
        const value59 = momentary || !value58;
        fn2(value59);
        try {
          if (momentary) {
            await this.callEntityService("button", "press", entityId2);
            value43 = "success";
            fn2(false);
            await new Promise((value60) => window.setTimeout(value60, 900));
          } else if (value28) {
            if (!value59 && deviceType === "bath-heater") {
              const preset_mode = normalizeClimateCapabilities(
                value35,
              ).presetModes.find((value61) =>
                ["idle", "standby", "待机", "关闭"].includes(
                  String(value61).trim().toLowerCase(),
                ),
              );
              if (preset_mode) {
                await this.callEntityService(
                  value2 === "fan" ? "fan" : "climate",
                  "set_preset_mode",
                  entityId2,
                  {
                    preset_mode: preset_mode,
                  },
                );
              }
            }
            const value60 = climatePowerCommand(
              entityId2,
              value35,
              value59,
              deviceType,
              element8?.dataset.lastClimateMode || "",
            );
            await this.callEntityService(
              value60.domain,
              value60.service,
              entityId2,
              value60.data,
            );
          } else {
            await this.callEntityService("homeassistant", "toggle", entityId2);
          }
        } catch (error) {
          value43 = "idle";
          fn2(value58);
          this.options.onError?.(error);
        } finally {
          value41 = false;
          if (momentary) {
            value43 = "idle";
            fn2(false);
          } else if (value26) {
            fn5?.(element12.classList.contains("is-on"));
          }
          value57?.removeAttribute("aria-busy");
        }
      };
      element12.addEventListener("click", fn6);
      if (value27) {
        element9.addEventListener("click", fn6);
      }
      if (value28) {
        element11.addEventListener("click", () => {
          if (deviceType === "bath-heater") {
            if (value45?.toggleBathLight) {
              value45.toggleBathLight();
            } else {
              this.options.onError?.(
                new Error("未找到与浴霸同设备的灯光实体。"),
              );
            }
            return;
          }
          fn6();
        });
      }
    }
    const fn7 = value28
      ? (value57) =>
          this.createClimateDetailsControls(entityId2, value57, {
            interactive: !preview,
            deviceType: deviceType,
            onPowerChange: (onPowerChange) =>
              fn2?.(onPowerChange, {
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
              value39?.({
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
    element8 = value27
      ? this.createLightDetailsControls(entityId2, value6, {
          interactive: !preview,
          onTurnOn: () => fn2?.(true),
          onVisualChange: (onVisualChange) => value36?.(onVisualChange),
        })
      : value28
        ? fn7(value6)
        : value9
          ? this.createCoverDetailsControls(entityId2, value6, {
              interactive: !preview,
              dream: dream,
              airer: airer,
              tilt: tilt,
              motorReversed: motorReversed,
              positionState: positionState,
              positionCommandEntityId: positionCommandEntityId,
              positionCommandState: positionCommandState,
              motorState: motorState,
              airerActionEntityIds: airerActionEntityIds,
              positionCalibration: positionCalibration,
              onVisualChange: ({ position: onVisualChange, state: state }) => {
                if (state) {
                  text = state;
                }
                fn3?.({
                  position: onVisualChange,
                  state: state,
                });
                const onVisualChange2 = coverPresentationState(
                  {
                    state: state,
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
                  ? ln(onVisualChange2) || Math.round(onVisualChange) + "%"
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
                    value37,
                  );
                  element3.classList.toggle("is-on", onCurtainPositionChange);
                }
              },
            })
          : null;
    if (value27 && element8?.classList.contains("has-color-picker")) {
      dialog.classList.add("color-picker-details");
    }
    if (value28 && deviceType === "water-heater" && element8 && element11) {
      element8.prepend(element11);
      element8.syncClimateGrid?.();
    }
    const value49 =
      (value28 && deviceType === "bath-heater" && value?.roles?.light) || "";
    value44 =
      (value49
        ? this.entityMetadata.get(value49)
        : value28 && deviceType === "bath-heater"
          ? relatedDeviceDomainEntity(this.entityMetadata, entityId2, "light")
          : null
      )?.entityId || "";
    if (value44 && element8) {
      const value57 = this.states.get(value44);
      const value58 = value57?.newState ||
        value57 || {
          state: "unknown",
          attributes: {},
        };
      value45 = this.createBathHeaterLightControl(value44, value58, {
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
      element8.append(value45);
      element8.syncClimateGrid?.();
    }
    const refreshEntityCatalog =
      value28 && (deviceType === "water-heater" || value47 !== null)
        ? () => {
            const value57 = allowed;
            const value58 = this.createWaterHeaterExtensionControls(entityId2, {
              component: component,
              interactive: !preview,
              excludedEntityIds: value44 ? [value44] : [],
            });
            value46?.remove();
            value46 = value58;
            allowed = new Set(value58?.relatedEntityIds || []);
            element8?.classList.toggle(
              "has-multiline-water-heater-extensions",
              deviceType === "water-heater" &&
                Number(value58?.dataset?.controlCount || 0) > 2,
            );
            if (deviceType !== "water-heater" && value32.isConnected) {
              dialog.classList.toggle("has-related-extensions", !!value58);
            }
            if (value58 && element8) {
              if (deviceType === "water-heater") {
                (element8.waterHeaterControlPanel || element8).append(value58);
                element8.syncClimateGrid?.();
              } else if (value32.isConnected) {
                value32.append(value58);
                dialog.classList.add("has-related-extensions");
              }
            }
            const handlers = this.detailsStateSync?.handlers;
            if (handlers) {
              for (const value59 of value57) {
                handlers.delete(value59);
              }
              for (const [value59, value60] of value58?.stateHandlers || []) {
                handlers.set(value59, value60);
                const value61 = this.states.get(value59);
                if (value61) {
                  for (const fn8 of value60) {
                    fn8(value61.newState || value61);
                  }
                }
              }
            }
          }
        : null;
    refreshEntityCatalog?.();
    let value50 =
      component.type === "line-chart"
        ? renderLineChartDetails(component, {
            states: this.states,
            history: this.historySeries,
            renderNamespace: this.renderNamespace,
          })
        : null;
    let value51 = null;
    let element15 = null;
    let element16 = null;
    const value52 = document.createElement("dl");
    value52.className = "hb-entity-details-attributes";
    for (const [value57, value58] of Object.entries(value7).filter(
      ([value59]) => value59 !== "friendly_name",
    )) {
      const value59 = document.createElement("div");
      const element17 = document.createElement("dt");
      element17.textContent = value57;
      const element18 = document.createElement("dd");
      element18.textContent =
        typeof value58 == "string" ? value58 : JSON.stringify(value58);
      value59.append(element17, element18);
      value52.append(value59);
    }
    if (value50) {
      value51 = document.createElement("section");
      value51.className = "hb-line-chart-current-visual";
      value51.style.setProperty(
        "--hb-chart-current-color",
        value50.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e",
      );
      element15 = document.createElement("strong");
      const value57 = Number.parseFloat(value6?.state);
      element15.textContent = Number.isFinite(value57)
        ? formatLineChartValue(value57, component.properties?.statePrecision)
        : value6?.state || "--";
      element16 = document.createElement("small");
      element16.textContent = String(value7.unit_of_measurement || "实时数值");
      value51.append(element15, element16);
      element12.style.setProperty(
        "--hb-chart-current-color",
        value50.style.getPropertyValue("--hb-chart-current-color") || "#68cc3e",
      );
      element13.textContent = "●";
      element14.textContent = "实时数据";
      value32.append(value33, value51, value50);
    } else if (value28) {
      value32.append(
        value33,
        ...(deviceType === "water-heater" ? [element8] : [element11, element8]),
        ...(deviceType !== "water-heater" && value46 ? [value46] : []),
      );
      dialog.classList.toggle(
        "has-related-extensions",
        deviceType !== "water-heater" && !!value46,
      );
    } else if (value27) {
      const value57 = document.createElement("div");
      value57.className = "hb-light-details-layout";
      const value58 = document.createElement("section");
      value58.className = "hb-light-details-panel";
      value58.append(...(element8 ? [element8] : []));
      value57.append(value58, element9);
      value32.append(value33, value57);
    } else if (value26) {
      const value57 = document.createElement("div");
      value57.className = "hb-switch-details-layout";
      value57.append(value40);
      value32.append(value33, value57);
    } else if (value9) {
      const value57 = document.createElement("div");
      value57.className = "hb-cover-details-layout";
      const value58 = document.createElement("section");
      value58.className = "hb-cover-details-panel";
      value58.append(...(element8 ? [element8] : []));
      value57.append(value58, element10);
      value32.append(value33, value57);
    } else if (value52.childElementCount) {
      value32.append(
        value33,
        element12,
        ...(element8 ? [element8] : []),
        value52,
      );
    } else {
      const element17 = document.createElement("p");
      element17.className = "hb-entity-details-empty";
      element17.textContent = "该实体暂无附加属性。";
      value52.replaceWith(element17);
      value32.append(
        value33,
        element12,
        ...(element8 ? [element8] : []),
        element17,
      );
    }
    dialog.append(value32);
    const value53 = document.createElement("div");
    value53.className =
      "hb-renderer-runtime-dialog-layer" +
      (this.options.editable ? "" : " hb-runtime-no-select");
    value53.tabIndex = -1;
    value53.append(dialog);
    this.container.append(value53);
    this.detailsDialog = dialog;
    const value54 = value28
      ? 840
      : component.type === "line-chart"
        ? 780
        : value27 || value9
          ? 760
          : value26
            ? 620
            : 460;
    const value55 = value28
      ? deviceType !== "water-heater" && value46
        ? 620
        : 540
      : value27 || value9
        ? 620
        : value26
          ? 500
          : 680;
    this.registerRuntimeDialogScale(value53, dialog, value54, value55);
    let value56 = 0;
    if (component.type === "line-chart" && value50) {
      const value57 = () => {
        value56 = 0;
        if (!value50?.isConnected || this.detailsStateSync?.dialog !== dialog) {
          return;
        }
        const value58 = renderLineChartDetails(component, {
          states: this.states,
          history: this.historySeries,
          renderNamespace: this.renderNamespace,
        });
        value50.cleanupLineChartHover?.();
        value50.replaceWith(value58);
        value50 = value58;
        value51.style.setProperty(
          "--hb-chart-current-color",
          value50.style.getPropertyValue("--hb-chart-current-color") ||
            "#68cc3e",
        );
      };
      const fn8 = (value58 = 700) => {
        value56 ||= window.setTimeout(
          value57,
          Math.max(0, Number(value58) || 0),
        );
      };
      this.detailsStateSync = {
        dialog: dialog,
        entityId: entityId2,
        refreshHistory: () => fn8(0),
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
          value50.syncLineChartState?.(apply);
          value51.style.setProperty(
            "--hb-chart-current-color",
            value50.style.getPropertyValue("--hb-chart-current-color") ||
              "#68cc3e",
          );
        },
      };
    } else if (value31 && fn2) {
      const fn8 = (value57) => {
        value35 = value57;
        if (value28 && fn7 && element8) {
          const value58 = climateControlStructureKey(
            entityId2,
            value57,
            deviceType,
          );
          if (element8.dataset.climateStructureKey !== value58) {
            const element17 = fn7(value57);
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
            if (value45) {
              element17.append(value45);
              element17.syncClimateGrid?.();
            }
            if (value46 && deviceType === "water-heater") {
              (element17.waterHeaterControlPanel || element17).append(value46);
              element17.syncClimateGrid?.();
            }
            element8.replaceWith(element17);
            element8 = element17;
          }
        }
        if (value57?.state) {
          fn2(fn(value57.state, value57.attributes), {
            unavailable: ["unknown", "unavailable"].includes(value57.state),
          });
        }
        element8?.syncLightState?.(value57);
        element8?.syncClimateState?.(value57);
      };
      const handlers = new Map([[entityId2, [fn8]]]);
      if (value44 && value45) {
        handlers.set(value44, [
          (value57) => value45.syncBathLightState?.(value57),
        ]);
      }
      if (value46?.stateHandlers) {
        for (const [value57, value58] of value46.stateHandlers) {
          handlers.set(value57, value58);
        }
      }
      this.detailsStateSync = {
        dialog: dialog,
        handlers: handlers,
        refreshEntityCatalog: refreshEntityCatalog,
      };
      if (value28 && element8?.querySelector(".hb-climate-details-loading")) {
        const value57 = Date.now();
        value42 = window.setInterval(() => {
          const value58 = this.states.get(entityId2);
          const value59 = value58?.newState || value58;
          if (value59) {
            fn8(value59);
          }
          if (
            !element8?.querySelector(".hb-climate-details-loading") ||
            Date.now() - value57 >= 30000
          ) {
            window.clearInterval(value42);
            value42 = null;
          }
        }, 120);
      }
    } else if (value9) {
      const handlers = new Map([
        [entityId2, [(value57) => element8?.syncCoverState?.(value57)]],
      ]);
      if (value14) {
        handlers.set(value14, [fn4]);
      }
      if (value18) {
        handlers.set(value18, [
          (value57) => element8?.syncCoverPositionState?.(value57),
        ]);
      }
      if (positionCommandEntityId) {
        handlers.set(positionCommandEntityId, [
          (value57) => {
            element8?.syncCoverPositionCommandState?.(value57);
            if (!value18) {
              element8?.syncCoverPositionState?.(value57);
            }
          },
        ]);
      }
      if (value19) {
        handlers.set(value19, [
          (value57) => element8?.syncAirerMotorState?.(value57),
        ]);
      }
      this.detailsStateSync = {
        dialog: dialog,
        handlers: handlers,
      };
    }
    element7.addEventListener("click", () => dialog.close());
    this.bindRuntimeDialogOutsideDismiss(value53, dialog, value32);
    value53.addEventListener("keydown", (value57) => {
      if (value57.key === "Escape") {
        dialog.close();
      }
    });
    dialog.addEventListener(
      "close",
      () => {
        window.clearTimeout(value56);
        window.clearInterval(value42);
        value42 = null;
        element8?.cleanupLightDetails?.();
        element8?.cleanupClimateDetails?.();
        element8?.cleanupCoverDetails?.();
        value50?.cleanupLineChartHover?.();
        this.clearRuntimeDialogScale(dialog);
        if (this.detailsDialog === dialog) {
          this.detailsDialog = null;
        }
        if (this.detailsStateSync?.dialog === dialog) {
          this.detailsStateSync = null;
        }
        value53.remove();
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
    const value = clientWidth / this.document.canvas.width;
    const value2 = clientHeight / this.document.canvas.height;
    const value3 =
      this.options.scaleMode || this.document.canvas.scaleMode || "contain";
    const value4 =
      value3 === "cover" ? Math.max(value, value2) : Math.min(value, value2);
    const value5 = value3 === "stretch" ? value : value4;
    const value6 = value3 === "stretch" ? value2 : value4;
    this.appliedScaleX = value5;
    this.appliedScaleY = value6;
    this.canvas.style.transform = "scale(" + value5 + ", " + value6 + ")";
    this.viewport.style.width = this.document.canvas.width * value5 + "px";
    this.viewport.style.height = this.document.canvas.height * value6 + "px";
    this.container.dataset.viewportAspect = (
      clientWidth / clientHeight
    ).toFixed(3);
    this.container.dataset.renderScale = Math.min(value5, value6).toFixed(4);
    for (const [value7, value8] of this.componentHosts) {
      this.updateTransformHandleScale(
        value8,
        this.componentRecords.get(value7),
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
    const value = this.page || this.document.pages?.[0];
    const index = new Map(
      (this.document.sharedComponents || []).map((value8) => [
        value8.id,
        value8,
      ]),
    );
    const value3 = [
      ...(value?.sharedComponentIds || [])
        .map((value8) => index.get(value8))
        .filter(Boolean),
      ...(value?.components || []),
    ];
    const value4 = collectEntityIds(value3);
    const value5 = this.activePopupId
      ? (this.document.customPopups || []).find(
          (value8) => String(value8.id || "") === this.activePopupId,
        )
      : null;
    for (const value8 of value5?.modules || []) {
      if (value8.entityId && !isVirtualEntityId(value8.entityId)) {
        value4.add(value8.entityId);
      }
    }
    for (const value8 of [...value4]) {
      if (this.entityMetadata.get(value8)?.domain !== "event") {
        continue;
      }
      const component = collectComponents(
        value3,
        (component2) =>
          component2.type === "presence-sensor" &&
          component2.bindings?.entity?.entityId === value8,
      )[0];
      if (!component) {
        continue;
      }
      const value9 = presenceMotionEventConfig(
        value8,
        this.states.get(value8),
        this.entityMetadata,
        this.states,
        component.properties,
      );
      for (const value10 of value9.companionEntityIds) {
        value4.add(value10);
      }
    }
    for (const value8 of [...value4]) {
      const value9 = this.entityMetadata.get(value8);
      if (
        value9?.domain !== "sensor" ||
        !value9.deviceId ||
        !["state", "status", "task_status"].includes(value9.translationKey)
      ) {
        continue;
      }
      const value10 = [...this.entityMetadata.values()].find(
        (value11) =>
          value11.deviceId === value9.deviceId &&
          value11.domain === "vacuum" &&
          entityMetadataIsAvailable(value11),
      );
      if (value10?.entityId) {
        value4.add(value10.entityId);
      }
    }
    for (const value8 of [...value4]) {
      if (this.entityMetadata.get(value8)?.domain !== "vacuum") {
        continue;
      }
      const value9 = value8.slice(value8.indexOf(".") + 1);
      const value10 = relatedDeviceEntity(
        this.entityMetadata,
        value8,
        "select",
        "cleaning_mode",
        "select." + value9 + "_cleaning_mode",
      );
      if (value10?.entityId) {
        value4.add(value10.entityId);
      }
      const value11 = relatedVacuumBatteryEntity(
        this.entityMetadata,
        this.states,
        value8,
      );
      if (value11?.entityId) {
        value4.add(value11.entityId);
      }
    }
    for (const value8 of [...value4]) {
      if (
        (this.entityMetadata.get(value8)?.domain ||
          String(value8 || "").split(".", 1)[0]) !== "cover"
      ) {
        continue;
      }
      const value9 = relatedCoverMotorReverseEntity(
        this.entityMetadata,
        value8,
      );
      if (value9?.entityId) {
        value4.add(value9.entityId);
      }
      const value10 = relatedAirerLightEntity(this.entityMetadata, value8);
      if (value10?.entityId) {
        value4.add(value10.entityId);
      }
      const value11 = relatedAirerPositionNumberEntity(
        this.entityMetadata,
        value8,
      );
      if (value11?.entityId) {
        value4.add(value11.entityId);
      }
      const value12 = relatedAirerCurrentPositionSensor(
        this.entityMetadata,
        value8,
      );
      if (value12?.entityId) {
        value4.add(value12.entityId);
      }
      const value13 = relatedAirerMotorSpeedSensor(this.entityMetadata, value8);
      if (value13?.entityId) {
        value4.add(value13.entityId);
      }
      const value14 = relatedAirerMotorActionEntities(
        this.entityMetadata,
        value8,
      );
      for (const value15 of Object.values(value14)) {
        if (value15?.entityId) {
          value4.add(value15.entityId);
        }
      }
    }
    for (const value8 of [...value4]) {
      const value9 = this.entityMetadata.get(value8);
      if (!["climate", "fan"].includes(String(value9?.domain || ""))) {
        continue;
      }
      const value10 = relatedDeviceDomainEntity(
        this.entityMetadata,
        value8,
        "light",
      );
      if (value10?.entityId) {
        value4.add(value10.entityId);
      }
    }
    for (const value8 of [...value4]) {
      if (this.entityMetadata.get(value8)?.domain === "water_heater") {
        for (const value9 of relatedWaterHeaterEntities(
          this.entityMetadata,
          value8,
        )) {
          value4.add(value9.entityId);
        }
      }
    }
    for (const value8 of [...value4]) {
      const value9 = this.deviceProfile(value8);
      if (value9) {
        for (const value10 of [
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
          const value11 = value9.roles?.[value10];
          if (value11) {
            value4.add(value11);
          }
        }
      }
    }
    const entityIds = [...value4];
    if (!entityIds.length || this.destroyed) {
      return;
    }
    if (entityIds.length > rn) {
      const text = String(entityIds.length);
      if (this.runtimeEntityLimitSignature !== text) {
        this.runtimeEntityLimitSignature = text;
        this.options.onError?.(
          new Error(
            "当前项目需要实时订阅 " +
              entityIds.length +
              " 个实体，已超过 " +
              rn +
              " 个上限。请减少统计或控件中绑定的实体。",
          ),
        );
      }
      return;
    }
    this.runtimeEntityLimitSignature = "";
    const value6 = window.location.protocol === "https:" ? "wss" : "ws";
    const value7 = new WebSocket(
      value6 + "://" + window.location.host + "/api/v1/ws/runtime",
    );
    this.socket = value7;
    value7.addEventListener("open", () => {
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
        value7.send(
          JSON.stringify({
            type: "subscribe",
            entityIds: entityIds,
          }),
        );
      }
    });
    value7.addEventListener("message", (value8) => {
      if (socketGeneration !== this.socketGeneration) {
        return;
      }
      let value9;
      try {
        value9 = JSON.parse(value8.data);
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
      if (value9.type === "snapshot") {
        const value10 = value9.states || [];
        const allowed = new Set(
          value10
            .map((value12) => String(value12?.entityId || ""))
            .filter(Boolean),
        );
        for (const value12 of entityIds) {
          if (!allowed.has(value12)) {
            if (this.states.has(value12)) {
              this.removedRuntimeEntityIds.add(value12);
            }
            this.states.delete(value12);
          }
        }
        for (const value12 of value10) {
          if (this.optimisticStateIsConfirmed(value12.entityId, value12)) {
            this.rememberLightVisualState(value12.entityId, value12);
            this.removedRuntimeEntityIds.delete(value12.entityId);
            this.states.set(value12.entityId, value12);
            this.applyRuntimeStateHandlers(
              value12.entityId,
              value12.newState || value12,
            );
          }
        }
        this.options.onRuntimeStateChange?.(value10);
        this.tryOpenPendingEntityDetails();
        for (const value12 of value10) {
          this.refreshVacuumMapEntity(value12.entityId);
        }
        if (this.detailsStateSync?.handlers) {
          for (const [value12, value13] of this.detailsStateSync.handlers) {
            const value14 = this.states.get(value12);
            if (value14) {
              for (const fn of value13) {
                fn(value14.newState || value14);
              }
            }
          }
        } else {
          const value12 = this.detailsStateSync
            ? this.states.get(this.detailsStateSync.entityId)
            : null;
          if (this.detailsStateSync && value12) {
            this.detailsStateSync.apply(value12.newState || value12);
          }
        }
        this.refreshRuntimeComponents([
          ...allowed,
          ...this.removedRuntimeEntityIds,
        ]);
        const allowed2 = new Set(
          collectComponents(value3, (value12) => value12.type === "line-chart")
            .map((component) =>
              String(component.bindings?.entity?.entityId || ""),
            )
            .filter(Boolean),
        );
        const value11 = entityIds.filter(
          (value12) =>
            allowed2.has(value12) &&
            lineChartRuntimeStateNeedsHydration(this.states.get(value12)),
        );
        if (value11.length && this.runtimeHydrationRetryAttempt < 5) {
          this.runtimeHydrationRetryAttempt += 1;
          window.clearTimeout(this.runtimeHydrationRetryTimer);
          const value12 = Math.min(
            10000,
            2 ** (this.runtimeHydrationRetryAttempt - 1) * 500,
          );
          this.runtimeHydrationRetryTimer = window.setTimeout(() => {
            this.runtimeHydrationRetryTimer = null;
            if (socketGeneration === this.socketGeneration && !this.destroyed) {
              this.connectRuntime();
            }
          }, value12);
        } else if (!value11.length) {
          this.runtimeHydrationRetryAttempt = 0;
        }
      } else if (value9.type === "state_removed") {
        const entityId = String(value9.entityId || "");
        if (!entityId) {
          return;
        }
        const value10 = {
          type: "state_changed",
          entityId: entityId,
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
          for (const fn of this.detailsStateSync.handlers.get(entityId)) {
            fn(value10);
          }
        } else if (this.detailsStateSync?.entityId === entityId) {
          this.detailsStateSync.apply(value10);
        }
        this.applyRuntimeStateHandlers(entityId, value10);
        this.refreshRuntimeComponents([entityId]);
        for (const value11 of this.runtimeEntityComponentIndex.get(entityId) ||
          []) {
          const value12 = this.componentRecords.get(value11);
          if (["line-chart", "camera", "vacuum-map"].includes(value12?.type)) {
            this.refreshRuntimeComponent(value11);
          }
        }
        this.refreshVacuumMapEntity(entityId);
      } else if (value9.type === "resync_required") {
        if (socketGeneration === this.socketGeneration && !this.destroyed) {
          this.connectRuntime();
        }
      } else if (value9.type === "state_changed") {
        if (!this.optimisticStateIsConfirmed(value9.entityId, value9)) {
          return;
        }
        this.rememberLightVisualState(value9.entityId, value9);
        this.removedRuntimeEntityIds.delete(value9.entityId);
        this.states.set(value9.entityId, value9);
        this.options.onRuntimeStateChange?.([value9]);
        this.tryOpenPendingEntityDetails();
        this.refreshVacuumMapEntity(value9.entityId);
        if (this.detailsStateSync?.handlers?.has(value9.entityId)) {
          for (const fn of this.detailsStateSync.handlers.get(
            value9.entityId,
          )) {
            fn(value9.newState || value9);
          }
        } else if (this.detailsStateSync?.entityId === value9.entityId) {
          this.detailsStateSync.apply(value9.newState || value9);
        }
        this.applyRuntimeStateHandlers(
          value9.entityId,
          value9.newState || value9,
        );
        this.scheduleRuntimeRender(value9.entityId);
      }
    });
    value7.addEventListener("close", (value8) => {
      if (socketGeneration !== this.socketGeneration || this.destroyed) {
        return;
      }
      this.socket = null;
      window.HABridgeLog?.report(
        "warning",
        "实时连接",
        "实时状态连接已断开（" +
          value8.code +
          "）" +
          ([4400, 4401, 4403].includes(value8.code) ? "" : "，正在重连"),
        {
          code: value8.code,
          phase: "websocket-disconnected",
          path: "/api/v1/ws/runtime",
        },
      );
      if (value8.code === 4401) {
        const value10 =
          window.location.pathname.startsWith("/display/") ||
          window.location.pathname.startsWith("/habridge/");
        window.location.assign(
          value10
            ? "/pair?next=" +
                encodeURIComponent(
                  "" + window.location.pathname + window.location.search,
                )
            : "/login",
        );
        return;
      }
      if (value8.code === 4403) {
        window.location.replace("/license");
        return;
      }
      if (value8.code === 4400) {
        const value10 =
          value8.reason === "too many entities"
            ? "当前项目的实时订阅实体超过 " +
              rn +
              " 个，已停止重连。请减少统计或控件中绑定的实体。"
            : "实时状态订阅请求无效，已停止自动重连。";
        this.options.onError?.(new Error(value10));
        return;
      }
      const value9 = Math.min(2 ** this.reconnectAttempt * 1000, 15000);
      this.reconnectAttempt += 1;
      this.reconnectTimer = window.setTimeout(
        () => this.connectRuntime(),
        value9,
      );
    });
    value7.addEventListener("error", () => value7.close());
  }
  refreshHistorySeries() {
    if (
      !this.document ||
      this.destroyed ||
      document.visibilityState === "hidden"
    ) {
      return;
    }
    const value = [
      this.historyDocumentGeneration,
      this.page?.path || "",
      this.activePopupId || "",
      this.historyPopupGeneration,
    ].join(":");
    return this.historyRefreshCoordinator.request(value, () =>
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
    const value = Math.min(8000, 2 ** historyRetryAttempt * 1000);
    this.historyRetryAttempt += 1;
    this.historyRetryTimer = window.setTimeout(() => {
      this.historyRetryTimer = 0;
      this.refreshHistorySeries();
    }, value);
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
    const fn = (value8, value9) => {
      const value10 = collectComponents(
        value8,
        (value11) =>
          value11.type === "line-chart" || value11.type === "presence-sensor",
      );
      for (const component of value10) {
        const entityId = component.bindings?.entity?.entityId;
        if (!entityId) {
          continue;
        }
        const value11 = component.type === "presence-sensor";
        const count = Math.max(
          30,
          Math.min(
            86400,
            Number(value11 ? 300 : component.properties?.updateInterval || 600),
          ),
        );
        const count2 = Math.max(
          1,
          Math.min(
            168,
            Number(
              value11
                ? component.properties?.historyHours || 24
                : component.properties?.hours || 24,
            ),
          ),
        );
        const value12 = index.get(entityId);
        index.set(entityId, {
          interval: Math.min(value12?.interval ?? count, count),
          hours: Math.max(value12?.hours ?? count2, count2),
          documentGeneration: documentGeneration,
          shared: !!value12?.shared || !!value9.shared,
          pagePath: value12?.pagePath ?? value9.pagePath ?? null,
          popupId: value12?.popupId ?? value9.popupId ?? null,
          popupGeneration: popupGeneration,
        });
      }
    };
    fn(this.document.sharedComponents || [], {
      shared: true,
    });
    fn(this.page?.components || [], {
      pagePath: pagePath,
    });
    const value2 = this.activePopupId
      ? (this.document.customPopups || []).find(
          (value8) => String(value8.id || "") === this.activePopupId,
        )
      : null;
    const value3 = [];
    for (const component of value2?.modules || []) {
      if (component.type === "line-chart" && component.entityId) {
        value3.push({
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
    fn(value3, {
      popupId: this.activePopupId || null,
    });
    const value4 = Date.now();
    let value5 = false;
    let value6 = false;
    const value7 = [...index];
    const fn2 = () => ({
      documentGeneration: this.historyDocumentGeneration,
      pagePath: this.page?.path || "",
      popupId: this.activePopupId || null,
      popupGeneration: this.historyPopupGeneration,
    });
    const fn3 = async () => {
      while (value7.length) {
        const [entityId, value8] = value7.shift();
        if (this.destroyed || !historyRequestStillRelevant(value8, fn2())) {
          continue;
        }
        const value9 = this.historySeries.get(entityId);
        const value10 = this.historySeriesCache.get(
          historySeriesCacheKey(entityId, value8.hours),
        );
        const value11 = [value9, value10]
          .filter(
            (value14) =>
              value14 &&
              value14.hours === value8.hours &&
              Array.isArray(value14.points) &&
              value14.points.length > 0,
          )
          .sort((value14, value15) => value15.fetchedAt - value14.fetchedAt)[0];
        if (value11 && value4 - value11.fetchedAt < value8.interval * 1000) {
          if (value9 !== value11) {
            this.historySeries.set(entityId, value11);
            value5 = true;
          }
          continue;
        }
        if (this.historyFetches.has(entityId)) {
          continue;
        }
        this.historyFetches.add(entityId);
        const value12 =
          typeof AbortController == "function" ? new AbortController() : null;
        const value13 = window.setTimeout(
          () => value12?.abort(),
          HISTORY_FETCH_TIMEOUT_MS,
        );
        try {
          const response = await fetch(
            "/api/v1/ha/history?entityId=" +
              encodeURIComponent(entityId) +
              "&hours=" +
              value8.hours,
            {
              credentials: "same-origin",
              headers: {
                Accept: "application/json",
              },
              ...(value12
                ? {
                    signal: value12.signal,
                  }
                : {}),
            },
          );
          if (!response.ok) {
            value6 = true;
            continue;
          }
          const value14 = await response.json();
          if (!historyRequestStillRelevant(value8, fn2())) {
            continue;
          }
          const value15 = {
            points: Array.isArray(value14.points) ? value14.points : [],
            hours: value8.hours,
            fetchedAt: Date.now(),
          };
          this.historySeries.set(entityId, value15);
          cacheHistorySeries(this.historySeriesCache, entityId, value15);
          value5 = true;
          if (!value15.points.length) {
            value6 = true;
          }
        } catch (error) {
          if (error?.name === "AbortError") {
            window.HABridgeLog?.report(
              "warning",
              "网络请求",
              "历史曲线请求超时",
              {
                entityId: entityId,
                phase: "history-timeout",
                path: "/api/v1/ha/history",
                durationMs: HISTORY_FETCH_TIMEOUT_MS,
              },
            );
          }
          value6 = true;
        } finally {
          window.clearTimeout(value13);
          this.historyFetches.delete(entityId);
        }
      }
    };
    await Promise.all(
      Array.from(
        {
          length: Math.min(2, value7.length),
        },
        () => fn3(),
      ),
    );
    if (value6 && !this.destroyed) {
      this.scheduleHistoryRetry();
    } else {
      this.historyRetryAttempt = 0;
    }
    if (value5 && !this.destroyed) {
      this.detailsStateSync?.refreshHistory?.();
      for (const fn4 of this.historyChartRefreshers) {
        fn4();
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
