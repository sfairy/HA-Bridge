import { randomUuid } from "../utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { climateDefaultIcon, climateEffectMode, climateIsPoweredOn, climateModeLabel, climatePresentationMode, normalizeClimateCapabilities, resolveClimateDeviceType } from "./climate.js?v=20260812-presence-phase-v79-20260904-climate-capability-options-v3";
import { entityPowerIsOn } from "./entity-power.js?v=20260813-generic-device-power-v2";
import { lightRealtimeCapabilities } from "./light-runtime.js?v=20260901-renderer-light-runtime-v1";
import { renderInteraction3d } from "../modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
const COMPONENT_RENDERERS = new Map();
registerComponent("interaction3d", {
  render: renderInteraction3d
});
const builtinAssetVersions = new Map();
const builtinAssetUrls = new Map();
const builtinEffectVariants = new Map();
export function setBuiltinAssetVersions(assetVersions = []) {
  const nextAssetVersions = new Map();
  const nextAssetUrls = new Map();
  const nextEffectVariants = new Map();
  for (const entry of assetVersions || []) {
    const assetId = String(entry?.assetId || "");
    if (!assetId) {
      continue;
    }
    const version = String(entry.version || "");
    const list = Array.isArray(entry.legacyAssetIds) ? entry.legacyAssetIds : [];
    for (const assetKey of [assetId, ...list]) {
      nextAssetVersions.set(String(assetKey), version);
      if (entry.url) {
        nextAssetUrls.set(String(assetKey), String(entry.url));
      }
      const effectVariant = entry.effectVariant || {};
      const originalWidth = Number(effectVariant.originalWidth || 0);
      const originalHeight = Number(effectVariant.originalHeight || 0);
      const cropX = Number(effectVariant.cropX);
      const cropY = Number(effectVariant.cropY);
      const width = Number(effectVariant.width || 0);
      const height = Number(effectVariant.height || 0);
      if (String(effectVariant.url || "").startsWith("/api/v1/assets/effect-variant?") && originalWidth > 0 && originalHeight > 0 && Number.isFinite(cropX) && Number.isFinite(cropY) && cropX >= 0 && cropY >= 0 && width > 0 && height > 0 && cropX + width <= originalWidth && cropY + height <= originalHeight) {
        nextEffectVariants.set(String(assetKey), {
          url: String(effectVariant.url),
          originalWidth,
          originalHeight,
          cropX,
          cropY,
          width,
          height
        });
      }
    }
  }
  if (nextAssetVersions.size === builtinAssetVersions.size && ![...nextAssetVersions].some(([assetKey, mappedValue]) => builtinAssetVersions.get(assetKey) !== mappedValue) && nextAssetUrls.size === builtinAssetUrls.size && ![...nextAssetUrls].some(([assetKey, mappedValue]) => builtinAssetUrls.get(assetKey) !== mappedValue) && nextEffectVariants.size === builtinEffectVariants.size && ![...nextEffectVariants].some(([assetKey, mappedValue]) => JSON.stringify(builtinEffectVariants.get(assetKey)) !== JSON.stringify(mappedValue))) {
    return false;
  }
  builtinAssetVersions.clear();
  for (const [assetKey, mappedValue] of nextAssetVersions) {
    builtinAssetVersions.set(assetKey, mappedValue);
  }
  builtinAssetUrls.clear();
  for (const [assetKey, mappedValue] of nextAssetUrls) {
    builtinAssetUrls.set(assetKey, mappedValue);
  }
  builtinEffectVariants.clear();
  for (const [assetKey, mappedValue] of nextEffectVariants) {
    builtinEffectVariants.set(assetKey, mappedValue);
  }
  return true;
}
export function registerComponent(type, renderer) {
  COMPONENT_RENDERERS.set(type, renderer);
}
export function renderRegisteredComponent(component, context) {
  const renderer = COMPONENT_RENDERERS.get(component.type);
  if (renderer) {
    return renderer.render(component, context);
  }
  const fallback = document.createElement("div");
  fallback.className = "hb-unknown-component";
  const element = document.createElement("strong");
  element.textContent = "控件尚未实现";
  const elementCurrent = document.createElement("span");
  elementCurrent.textContent = component.type;
  fallback.append(element, elementCurrent);
  return fallback;
}
function resolveAssetUrl(assetId) {
  const rawAssetId = String(assetId || "");
  if (builtinAssetUrls.has(rawAssetId)) {
    return builtinAssetUrls.get(rawAssetId);
  }
  if (rawAssetId.startsWith("studio3d:")) {
    const studioParts = rawAssetId.slice(9).split("/");
    if (studioParts.length !== 2 || !studioParts[0] || !studioParts[1]) {
      return "";
    } else {
      return "/api/v1/assets/studio3d-export/" + encodeURIComponent(studioParts[0]) + "/" + encodeURIComponent(studioParts[1]);
    }
  }
  if (rawAssetId.startsWith("user:")) {
    const userAssetHash = rawAssetId.slice(5);
    if (/^[0-9a-f]{32}$/.test(userAssetHash)) {
      return "/api/v1/assets/user/" + userAssetHash;
    } else {
      return "";
    }
  }
  if (!rawAssetId.startsWith("builtin:")) {
    return "";
  }
  const builtinPath = rawAssetId.slice(8);
  const encodedPath = (builtinPath.startsWith("v1/2D/") || builtinPath.startsWith("v1/3D/") ? builtinPath.replace(/^v1\//, "v1/户型图示例/") : builtinPath).split("/").filter(Boolean).map(item => encodeURIComponent(item)).join("/");
  if (!encodedPath) {
    return "";
  }
  const version = builtinAssetVersions.get(rawAssetId) || "";
  return "/assets/builtin/" + encodedPath + (version ? "?v=" + encodeURIComponent(version) : "");
}
export function staticAssetImageSource(staticAssetImage) {
  return resolveAssetUrl(staticAssetImage);
}
function clampWithDefault(raw, min, max, fallback) {
  const numeric = Number(raw);
  return Math.max(min, Math.min(max, Number.isFinite(numeric) ? numeric : fallback));
}
function safeCssColor(color, fallback) {
  const trimmed = String(color || "").trim();
  if (/^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(trimmed)) {
    return trimmed;
  } else {
    return fallback;
  }
}
function applyTextStroke(element, weight, fontSize) {
  const numeric = Number(weight);
  const normalizedWeight = Number.isFinite(numeric) && numeric > 1 ? clampWithDefault((numeric - 1) / 899, 0, 1, 0.4) : clampWithDefault(numeric, 0, 1, 0.4);
  const fontSizePx = Math.max(1, Number(fontSize || 16));
  const strokeWidth = normalizedWeight * fontSizePx * 0.05;
  element.style.fontWeight = "100";
  element.style.webkitTextStroke = strokeWidth.toFixed(3) + "px currentColor";
  element.style.paintOrder = "stroke fill";
}
function resolveMdiIconUrl(icon) {
  const name = String(icon || "").trim().replace(/^mdi:/, "");
  if (/^[a-z0-9-]+$/.test(name)) {
    return "/bridge-static/vendor/mdi/7.4.47/svg/" + name + ".svg";
  } else {
    return "";
  }
}
function entityStateIsActive(stateEntry) {
  const state = String(stateEntry?.state ?? stateEntry?.newState?.state ?? "").trim().toLowerCase();
  return ["on", "open", "true", "home"].includes(state);
}
const COVER_CLOSED_POSITION_EPSILON = 1;
function he(stateEntry) {
  return stateEntry?.properties?.coverMotorDirection === "reversed";
}
export function coverComponentIsDream(component, entityId = "", stateEntry = null, entityMetadata = new Map()) {
  const coverKind = component?.properties?.coverKind;
  if (coverKind === "dream") {
    return true;
  }
  if (["standard", "airer"].includes(coverKind)) {
    return false;
  }
  const state = readState(stateEntry) || {};
  const numeric = Number(state.attributes?.supported_features || 0);
  const metadata = entityMetadata?.get?.(entityId) || {};
  const searchText = entityId + " " + (state.attributes?.friendly_name || "") + " " + (metadata.name || "") + " " + (metadata.originalName || "");
  return Number.isFinite(Number(state.attributes?.current_tilt_position)) || !!(numeric & 240) || /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(searchText);
}
function Ge(component, coverEntityId, entityOrEvent, entityMetadata) {
  const coverMotorDirection = readState(entityOrEvent) || {};
  const reverseEntity = String(coverMotorDirection.state || "").trim().toLowerCase();
  const stateEntry = he(component);
  const presentationState = stateEntry && {
    open: "closed",
    closed: "open",
    opening: "closing",
    closing: "opening"
  }[reverseEntity] || reverseEntity;
  if (presentationState === "opening") {
    return true;
  }
  if (presentationState === "closing") {
    return false;
  }
  if (coverComponentIsDream(component, coverEntityId, coverMotorDirection, entityMetadata.entityMetadata)) {
    return presentationState === "open";
  }
  const currentPosition = Number(coverMotorDirection.attributes?.current_position);
  if (Number.isFinite(currentPosition)) {
    return (stateEntry ? 100 - currentPosition : currentPosition) > COVER_CLOSED_POSITION_EPSILON;
  } else if (stateEntry) {
    return !entityStateIsActive(coverMotorDirection);
  } else {
    return entityStateIsActive(coverMotorDirection);
  }
}
export function coverComponentIsActive(component, entityId, stateEntry, context = {}) {
  return Ge(component, entityId, stateEntry, context);
}
function componentIsActive(component, entityId, stateEntry, states = {}) {
  if (String(entityId || "").startsWith("cover.")) {
    return coverComponentIsActive(component, entityId, stateEntry, states);
  }
  const state = String(component?.properties?.runtimePowerEntityId || entityId);
  const rawState = state === entityId ? stateEntry : states.states?.get(state);
  return entityPowerIsOn(state, rawState, component);
}
function readState(brightness) {
  return brightness?.newState || brightness || null;
}
export function iconButtonEffectLightVisualAwaiting(component, context = {}) {
  const properties = component?.properties || {};
  const text = String(component?.bindings?.entity?.entityId || "");
  if (!!context.editable || !text.startsWith("light.") || properties.effectBrightnessRealtime === false && properties.effectColorTemperatureRealtime === false) {
    return false;
  }
  const state = readState(context.states?.get?.(text));
  const stateText = String(state?.state || "").toLowerCase();
  if (!state || stateText === "unknown" || stateText === "unavailable") {
    return true;
  }
  if (context.pendingOptimisticState?.desiredActive === true || stateText !== "on") {
    return false;
  }
  const attributes = state.attributes || {};
  const capabilities = lightRealtimeCapabilities(text, state);
  const hasNumericAttribute = item => attributes[item] !== null && attributes[item] !== undefined && attributes[item] !== "" && Number.isFinite(Number(attributes[item]));
  if (properties.effectBrightnessRealtime !== false && capabilities.brightness && !hasNumericAttribute("brightness")) {
    return true;
  }
  const list = Array.isArray(attributes.supported_color_modes) ? attributes.supported_color_modes.map(key => String(key || "").toLowerCase()) : [];
  const colorMode = String(attributes.color_mode || "").toLowerCase();
  const isColorTempMode = colorMode === "color_temp" || !colorMode && list.length === 1 && list[0] === "color_temp";
  return properties.effectColorTemperatureRealtime !== false && !!capabilities.colorTemperature && !!isColorTempMode && !hasNumericAttribute("color_temp_kelvin") && !hasNumericAttribute("color_temp");
}
export function vacuumMapImageSource(vacuumMapImage, stateEntry = null) {
  const state = readState(stateEntry) || {};
  const text = String(state.updatedAt || state.lastChanged || state.state || "initial");
  return "/api/image_proxy/" + encodeURIComponent(String(vacuumMapImage || "")) + "?hb=" + encodeURIComponent(text);
}
import { lightStatisticsEntityStateStatus, lightStatisticsEntitySupport, lightStatisticsSummary } from "./light-statistics-runtime.js?v=20260901-renderer-light-statistics-runtime-v1";
import { automaticNumericPrecision, formatLineChartValue, formatNumericValue, lineChartGeometry, normalizedStatePrecision } from "./line-chart-runtime.js?v=20260901-renderer-line-chart-runtime-v1";
import { doorWindowPerspectiveCorners, doorWindowPerspectiveMatrix } from "./door-window-runtime.js?v=20260901-renderer-door-window-runtime-v1";
import { automaticThresholds, meteoconUrl, normalizedThresholds, resolvedThresholds, smoothChartPath, thresholdColor, weatherVisual } from "./weather-chart-runtime.js?v=20260901-renderer-weather-chart-runtime-v2";
import { formatLocalDate, formatLocalTime, formatLunarDate } from "./date-time-runtime.js?v=20260901-renderer-date-time-runtime-v1";
export { lightStatisticsEntityStateStatus, lightStatisticsEntitySupport, lightStatisticsSummary, automaticNumericPrecision, formatLineChartValue, formatNumericValue, lineChartGeometry, normalizedStatePrecision, doorWindowPerspectiveCorners, doorWindowPerspectiveMatrix, meteoconUrl, automaticThresholds, normalizedThresholds, resolvedThresholds, smoothChartPath, thresholdColor, weatherVisual, formatLocalDate, formatLocalTime, formatLunarDate };
import { formatPresenceDuration, presenceAnimationPhase, presenceHistoryBuckets, presenceMotionEventConfig, presenceSensorPresentation, presenceStateTimestamp } from "./presence-runtime.js?v=20260901-renderer-presence-runtime-v1";
export { formatPresenceDuration, presenceAnimationPhase, presenceHistoryBuckets, presenceMotionEventConfig, presenceSensorPresentation, presenceStateTimestamp };
function tt(entityMetadata, entityId) {
  const metadata = String(readState(entityId)?.attributes?.icon || "").trim();
  if (metadata) {
    return metadata;
  }
  const entityDomain = String(entityMetadata || "").split(".")[0];
  return {
    binary_sensor: "mdi:radiobox-marked",
    button: "mdi:gesture-tap-button",
    climate: "mdi:thermostat",
    cover: "mdi:window-shutter",
    fan: "mdi:fan",
    input_boolean: "mdi:toggle-switch",
    light: "mdi:lightbulb-outline",
    lock: "mdi:lock-outline",
    media_player: "mdi:play-circle-outline",
    number: "mdi:numeric",
    remote: "mdi:remote",
    sensor: "mdi:gauge",
    switch: "mdi:toggle-switch-outline",
    water_heater: "mdi:water-boiler"
  }[entityDomain] || "mdi:devices";
}
export function formatEntityState(component, entityId = "", context = {}) {
  const state = readState(component);
  if (!state) {
    return "等待实体状态";
  }
  const rawState = String(state.state ?? "").trim();
  const metadata = context.entityMetadata?.get?.(entityId) || {};
  const platform = String(metadata.platform || "").trim();
  const domain = String(metadata.domain || entityId.split(".")[0] || "").trim();
  const translationKey = String(metadata.translationKey || "").trim();
  const translationPath = platform && domain && translationKey && rawState ? "component." + platform + ".entity." + domain + "." + translationKey + ".state." + rawState : "";
  const deviceClass = String(state.attributes?.device_class || "").trim();
  const deviceClassPath = domain && deviceClass && rawState ? "component." + domain + ".entity_component." + deviceClass + ".state." + rawState : "";
  const translated = String((translationPath ? context.entityTranslations?.[translationPath] : "") || (deviceClassPath ? context.entityTranslations?.[deviceClassPath] : "") || "").trim();
  const fallbackLabel = {
    on: "开启",
    off: "关闭",
    open: "打开",
    closed: "关闭",
    locked: "已上锁",
    unlocked: "已解锁",
    home: "在家",
    not_home: "离家",
    unavailable: "不可用",
    unknown: "未知",
    idle: "待机",
    sweeping: "扫地中",
    charging: "充电中",
    docked: "已停靠",
    partlycloudy: "晴间多云",
    "power off": "已关闭",
    playing: "播放中",
    paused: "已暂停"
  }[rawState.toLowerCase()] || rawState || "未知";
  const coverReversedLabel = String(entityId || "").startsWith("cover.") && he(context.component) ? {
    open: "关闭",
    closed: "打开",
    opening: "正在关闭",
    closing: "正在打开"
  }[rawState.toLowerCase()] : "";
  const numericState = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(rawState) ? Number(rawState) : Number.NaN;
  const displayValue = Number.isFinite(numericState) ? formatNumericValue(numericState, context.component?.properties?.statePrecision) : coverReversedLabel || translated || fallbackLabel;
  const unit = String(state.attributes?.unit_of_measurement || "").trim();
  if (unit && !["不可用", "未知"].includes(displayValue)) {
    return displayValue + " " + unit;
  } else {
    return displayValue;
  }
}
function iconButtonEffectIsActive(entityId, stateEntry) {
  if (stateEntry.editable && stateEntry.previewState === "on") {
    return true;
  }
  if (stateEntry.editable && stateEntry.previewState === "off") {
    return false;
  }
  const icon = entityId.bindings?.entity?.entityId || "";
  return !!icon && !!componentIsActive(entityId, icon, stateEntry.states?.get(icon), stateEntry);
}
export const ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN = 3500;
function nt(brightnessPercent) {
  if (brightnessPercent == null || brightnessPercent === "" || !Number.isFinite(Number(brightnessPercent))) {
    return 1;
  }
  const numeric = Math.max(0, Math.min(1, Number(brightnessPercent) / 100));
  if (numeric <= 0) {
    return 0;
  } else {
    return 0.2 + numeric * 0.8;
  }
}
function it(color_temp_kelvin = {}) {
  const key = Number(color_temp_kelvin.color_temp_kelvin);
  if (Number.isFinite(key) && key > 0) {
    return key;
  }
  const now = Number(color_temp_kelvin.color_temp);
  if (Number.isFinite(now) && now > 0) {
    return 1000000 / now;
  } else {
    return null;
  }
}
export function iconButtonEffectLightVisualState(component, context = {}) {
  const entityId = String(component?.bindings?.entity?.entityId || "");
  const attributes = readState(context.states?.get?.(entityId))?.attributes || {};
  if (!entityId.startsWith("light.")) {
    return {
      brightnessPercent: null,
      colorTemperatureKelvin: null,
      opacity: 1,
      filter: "none"
    };
  }
  const brightness = attributes.brightness;
  const brightnessValue = brightness == null || brightness === "" ? Number.NaN : Number(brightness);
  const brightnessPercent = Number.isFinite(brightnessValue) ? Math.max(0, Math.min(100, brightnessValue / 255 * 100)) : null;
  const colorTemperatureKelvin = it(attributes);
  const properties = component?.properties || {};
  const useRealtimeBrightness = properties.effectBrightnessRealtime !== false;
  const useRealtimeColorTemp = properties.effectColorTemperatureRealtime !== false;
  const opacity = useRealtimeBrightness ? nt(brightnessPercent) : 1;
  if (!useRealtimeColorTemp || !Number.isFinite(colorTemperatureKelvin)) {
    return {
      brightnessPercent,
      colorTemperatureKelvin: null,
      opacity,
      filter: "none"
    };
  }
  const coolBias = Math.max(0, Math.min(1, (ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN - colorTemperatureKelvin) / 1500));
  const warmBias = Math.max(0, Math.min(1, (colorTemperatureKelvin - ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN) / 3000));
  const saturation = 1 + coolBias * 0.95 - warmBias * 0.55;
  return {
    brightnessPercent,
    colorTemperatureKelvin,
    opacity,
    filter: "saturate(" + saturation.toFixed(3) + ")"
  };
}
function ot(component, context) {
  if (context.editable && context.previewState === "on") {
    return true;
  }
  if (context.editable && context.previewState === "off") {
    return false;
  }
  const entityId = component.bindings?.entity?.entityId || "";
  return !!entityId && !!componentIsActive(component, entityId, context.states?.get(entityId), context);
}
function st(component, context) {
  const entityId = component.bindings?.entity?.entityId || "";
  const climateState = readState(context.states?.get(entityId));
  const climateDeviceType = resolveClimateDeviceType(component, climateState, entityId);
  if (context.editable && context.previewState === "on") {
    if (climateDeviceType === "bath-heater") {
      return "heat";
    } else {
      return "cool";
    }
  } else if (context.editable && context.previewState === "off") {
    return "off";
  } else {
    return climatePresentationMode(climateState, climateDeviceType).toLowerCase();
  }
}
function climateIsPoweredOnForComponent(component, context) {
  if (context.editable && context.previewState === "on") {
    return true;
  }
  if (context.editable && context.previewState === "off") {
    return false;
  }
  const entityId = component.bindings?.entity?.entityId || "";
  const state = readState(context.states?.get(entityId));
  return climateIsPoweredOn(state, resolveClimateDeviceType(component, state, entityId));
}
function at(component, context) {
  const entityId = component.bindings?.entity?.entityId || "";
  const state = readState(context.states?.get(entityId));
  const effectDeviceType = resolveClimateDeviceType(component, state, entityId);
  if (context.editable && context.previewState === "on") {
    return "cool";
  } else if (context.editable && context.previewState === "off") {
    return "off";
  } else {
    return climateEffectMode(state, effectDeviceType);
  }
}
function rt(component, states) {
  const entityId = component.bindings?.entity?.entityId || "";
  const state = readState(states.states?.get(entityId));
  const deviceType = st(component, states);
  const labelDeviceType = resolveClimateDeviceType(component, state, entityId);
  const climateModeText = climateModeLabel(deviceType, labelDeviceType);
  if (!climateIsPoweredOnForComponent(component, states)) {
    return climateModeText;
  }
  const targetTemperature = normalizeClimateCapabilities(state);
  if (targetTemperature.targetTemperature !== null) {
    return climateModeText + " · " + targetTemperature.targetTemperature + "°C";
  } else if (targetTemperature.currentTemperature !== null) {
    return climateModeText + " · " + targetTemperature.currentTemperature + "°C";
  } else {
    return climateModeText;
  }
}
function ct(airflowMotion = {}, effectMode = "other") {
  const entityId = airflowMotion.airflowMotion === "static" ? "static" : "dynamic";
  const state = effectMode === "cool" ? safeCssColor(airflowMotion.airflowCoolColor, "#73c8ff") : effectMode === "heat" ? safeCssColor(airflowMotion.airflowHeatColor, "#ff8a65") : safeCssColor(airflowMotion.airflowOtherColor, "#ffffff");
  const presentationMode = clampWithDefault(airflowMotion.airflowAngle, -360, 360, 7);
  const deviceType = clampWithDefault(airflowMotion.airflowLength, 10, 300, 200) / 100;
  const modeLabel = clampWithDefault(airflowMotion.airflowFadePosition, 15, 100, 50) / 100;
  const climateCapabilities = clampWithDefault(airflowMotion.airflowSpread, 10, 300, 100);
  const airflowCurve = Math.tanh(clampWithDefault(airflowMotion.airflowCurve, -200, 200, 20) / 140);
  const airflowDensity = clampWithDefault(airflowMotion.airflowDensity, 20, 200, 60) / 100;
  const airflowIrregularity = clampWithDefault(airflowMotion.airflowIrregularity, 0, 200, 50) / 100;
  const airflowThickness = clampWithDefault(airflowMotion.airflowThickness, 5, 300, 40) / 100;
  const airflowStrength = clampWithDefault(airflowMotion.airflowStrength, 0, 500, 200) / 100;
  const airflowBlur = clampWithDefault(airflowMotion.airflowBlur, 0, 30, 6);
  const airflowSpeed = clampWithDefault(airflowMotion.airflowSpeed, 0.3, 12, 1);
  const pathStartY = 6;
  const toFixed = pathStartY + (228 - pathStartY) * modeLabel;
  const value = pathStartY + (toFixed - pathStartY) * 0.63;
  const toFixedCurrent = value + (toFixed - value) * 0.56;
  const spreadWidth = Math.min(70, Math.sqrt(climateCapabilities / 100) * 44);
  const hashNoise = noiseSeed => {
    const hashFract = Math.sin(noiseSeed * 12.9898) * 43758.5453;
    return hashFract - Math.floor(hashFract);
  };
  const length = Math.max(3, Math.min(12, Math.round(airflowDensity * 8)));
  const max = Math.max(2, Math.min(4, Math.round(1.5 + airflowDensity * 1.2)));
  const map = Array.from({
    length
  }, (_laneUnused, laneIndex) => {
    const laneRatio = length === 1 ? 0.5 : laneIndex / (length - 1);
    const laneJitter = (hashNoise(laneIndex + 3) - 0.5) * 10 * airflowIrregularity;
    return Math.max(10, Math.min(170, 90 + (laneRatio - 0.5) * spreadWidth * 2 + laneJitter));
  });
  const minLaneX = Math.min(...map);
  const maxLaneX = Math.max(...map);
  const curveRoom = airflowCurve >= 0 ? 168 - maxLaneX : minLaneX - 12;
  const curveOffset = airflowCurve * Math.max(0, curveRoom);
  const flatMap = map.map(item => {
    const toFixedNext = item + curveOffset;
    const toFixedPrevious = item + curveOffset * 0.42;
    return "M" + item.toFixed(2) + " " + pathStartY + "L" + item.toFixed(2) + " " + value.toFixed(2) + "C" + item.toFixed(2) + " " + toFixedCurrent.toFixed(2) + " " + toFixedPrevious.toFixed(2) + " " + toFixed.toFixed(2) + " " + toFixedNext.toFixed(2) + " " + toFixed.toFixed(2);
  });
  const join = flatMap.flatMap((motionPath, pathIndex) => Array.from({
    length: max
  }, (_wispUnused, wispIndex) => {
    const value = pathIndex * 41 + wispIndex * 67 + 11;
    const toFixed = Math.max(8, Math.min(112, (34 + hashNoise(value) * 42 * (0.7 + airflowIrregularity * 0.3)) * deviceType));
    const wispHeight = Math.max(0.2, Math.min(14, (1.5 + hashNoise(value + 7) * 2.9) * airflowThickness));
    const toFixedCurrent = airflowSpeed * (0.8 + hashNoise(value + 13) * 0.42 * (0.55 + airflowIrregularity * 0.45));
    const toFixedNext = (wispIndex / max + pathIndex * 0.067 + (hashNoise(value + 19) - 0.5) * 0.08 * airflowIrregularity + 1) % 1;
    const min = Math.min(1, airflowStrength * (0.62 + hashNoise(value + 29) * 0.5));
    const wispRects = "<rect x=\"" + (-toFixed / 2).toFixed(2) + "\" y=\"" + (-wispHeight * 1.3).toFixed(2) + "\" width=\"" + toFixed.toFixed(2) + "\" height=\"" + (wispHeight * 2.6).toFixed(2) + "\" rx=\"" + (wispHeight * 1.3).toFixed(2) + "\" fill=\"url(#wisp)\" filter=\"url(#glow)\"/><rect x=\"" + (-toFixed * 0.42).toFixed(2) + "\" y=\"" + (-wispHeight * 0.22).toFixed(2) + "\" width=\"" + (toFixed * 0.82).toFixed(2) + "\" height=\"" + (wispHeight * 0.44).toFixed(2) + "\" rx=\"" + (wispHeight * 0.22).toFixed(2) + "\" fill=\"url(#core)\"/>";
    if (entityId === "static") {
      return "<g opacity=\"" + min.toFixed(3) + "\">" + wispRects + "<animateMotion path=\"" + motionPath + "\" dur=\"0.001s\" keyPoints=\"" + toFixedNext.toFixed(4) + ";" + toFixedNext.toFixed(4) + "\" keyTimes=\"0;1\" fill=\"freeze\" rotate=\"auto\"/></g>";
    } else {
      return "<g opacity=\"0\">" + wispRects + "<animate attributeName=\"opacity\" values=\"0;" + min.toFixed(3) + ";" + min.toFixed(3) + ";0\" keyTimes=\"0;.06;.78;1\" dur=\"" + toFixedCurrent.toFixed(3) + "s\" begin=\"" + (-toFixedCurrent * toFixedNext).toFixed(3) + "s\" repeatCount=\"indefinite\"/><animateMotion path=\"" + motionPath + "\" dur=\"" + toFixedCurrent.toFixed(3) + "s\" begin=\"" + (-toFixedCurrent * toFixedNext).toFixed(3) + "s\" rotate=\"auto\" repeatCount=\"indefinite\"/></g>";
    }
  }));
  const svgMarkup = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 180 240\" preserveAspectRatio=\"none\"><defs><linearGradient id=\"bed\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"" + state + "\" stop-opacity=\"0\"/><stop offset=\".22\" stop-color=\"" + state + "\" stop-opacity=\".25\"/><stop offset=\".58\" stop-color=\"" + state + "\" stop-opacity=\".8\"/><stop offset=\"1\" stop-color=\"" + state + "\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"wisp\"><stop offset=\"0\" stop-color=\"" + state + "\" stop-opacity=\"0\"/><stop offset=\".2\" stop-color=\"" + state + "\" stop-opacity=\".18\"/><stop offset=\".52\" stop-color=\"" + state + "\"/><stop offset=\".78\" stop-color=\"" + state + "\" stop-opacity=\".52\"/><stop offset=\"1\" stop-color=\"" + state + "\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"core\"><stop offset=\"0\" stop-color=\"" + state + "\" stop-opacity=\"0\"/><stop offset=\".34\" stop-color=\"" + state + "\" stop-opacity=\".12\"/><stop offset=\".58\" stop-color=\"" + state + "\"/><stop offset=\".82\" stop-color=\"" + state + "\" stop-opacity=\".28\"/><stop offset=\"1\" stop-color=\"" + state + "\" stop-opacity=\"0\"/></linearGradient><filter id=\"glow\" x=\"-120%\" y=\"-240%\" width=\"340%\" height=\"580%\"><feGaussianBlur stdDeviation=\"" + Math.max(0.2, airflowBlur * 1.35) + "\"/><feComponentTransfer><feFuncA type=\"linear\" slope=\"" + (airflowStrength <= 1 ? 1 : 1 + (airflowStrength - 1) * 0.9).toFixed(3) + "\"/></feComponentTransfer></filter></defs><g transform=\"rotate(" + presentationMode + " 90 120)\">" + flatMap.map(strokePath => "<path d=\"" + strokePath + "\" fill=\"none\" stroke=\"url(#bed)\" stroke-width=\"1.2\" stroke-linecap=\"round\" opacity=\"" + Math.min(1, airflowStrength * 0.075).toFixed(3) + "\"/>").join("") + join.join("") + "</g></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);
}
export function renderAirConditionerAirflowLayer(component, context) {
  const properties = component.properties || {};
  if (properties.airflowVisible === false || !climateIsPoweredOnForComponent(component, context)) {
    return null;
  }
  const layer = document.createElement("div");
  layer.className = "hb-air-conditioner-airflow-layer";
  const image = document.createElement("img");
  image.src = ct(properties, at(component, context));
  image.alt = "";
  image.draggable = false;
  layer.append(image);
  return layer;
}
function appendSvgChild(parent, tagName, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  for (const [attrName, attrValue] of Object.entries(attributes)) {
    node.setAttribute(attrName, String(attrValue));
  }
  parent.append(node);
  return node;
}
function buildLineChartSeries(component, entityId, stateEntry, context = 24) {
  const text = (Array.isArray(component.history?.get(entityId)?.points) ? component.history.get(entityId).points : []).map(timestamp => ({
    timestamp: Date.parse(timestamp.timestamp),
    value: Number(timestamp.value)
  })).filter(timestamp => Number.isFinite(timestamp.timestamp) && Number.isFinite(timestamp.value));
  const powerStateEntry = Date.now();
  if (Number.isFinite(stateEntry)) {
    text.push({
      timestamp: powerStateEntry,
      value: stateEntry
    });
  }
  text.sort((timestamp, timestampRight) => timestamp.timestamp - timestampRight.timestamp);
  const length = text.filter((timestamp, sampleIndex) => sampleIndex === 0 || timestamp.timestamp !== text[sampleIndex - 1].timestamp || timestamp.value !== text[sampleIndex - 1].value);
  if (!length.length) {
    return [];
  }
  const hours = Math.round(clampWithDefault(context, 1, 168, 24));
  const msPerHour = 3600000;
  const windowStart = powerStateEntry - hours * msPerHour;
  const push = [];
  let pointCursor = 0;
  let latestPoint = null;
  for (let hourStep = 0; hourStep <= hours; hourStep += 1) {
    const timestamp = hourStep === hours ? powerStateEntry : windowStart + hourStep * msPerHour;
    while (pointCursor < length.length && length[pointCursor].timestamp <= timestamp) {
      latestPoint = length[pointCursor];
      pointCursor += 1;
    }
    const samplePoint = latestPoint || length[pointCursor] || length[0];
    if (samplePoint) {
      push.push({
        timestamp: timestamp,
        value: samplePoint.value
      });
    }
  }
  return push;
}
function formatChartTime(timestampMs, mode = true) {
  const motion = mode ? {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  } : {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };
  return new Intl.DateTimeFormat("zh-CN", motion).format(new Date(timestampMs)).replace(/\//g, "-");
}
function setupLineChartHoverTooltip(chartElement, overlayRoot, geometry, unit, pointToPercent, statePrecision = "auto", xRange = {
  start: 0,
  end: 1
}, tooltipHost = document.body) {
  const tooltip = document.createElement("span");
  tooltip.className = "hb-line-chart-tooltip";
  if (tooltipHost === overlayRoot) {
    tooltip.classList.add("hb-line-chart-details-tooltip");
  }
  tooltip.hidden = true;
  const hoverGuide = document.createElement("i");
  hoverGuide.className = "hb-line-chart-hover-guide";
  hoverGuide.hidden = true;
  const hoverDot = document.createElement("i");
  hoverDot.className = "hb-line-chart-hover-dot";
  hoverDot.hidden = true;
  overlayRoot.append(hoverGuide, hoverDot);
  tooltipHost.append(tooltip);
  const onPointerMove = pointerEvent => {
    const dialogLayer = tooltipHost === overlayRoot ? overlayRoot.closest(".hb-renderer-runtime-dialog-layer") : null;
    if (dialogLayer && tooltip.parentElement !== dialogLayer) {
      dialogLayer.append(tooltip);
    }
    const chartRect = chartElement.getBoundingClientRect();
    if (!chartRect.width) {
      return;
    }
    const rawRatio = (pointerEvent.clientX - chartRect.left) / chartRect.width;
    const clamped = clampWithDefault((rawRatio - xRange.start) / Math.max(0.001, xRange.end - xRange.start), 0, 1, 0);
    const hoverTime = geometry.firstTime + clamped * (geometry.lastTime - geometry.firstTime);
    const nearestPoint = geometry.points.reduce((bestPoint, candidatePoint) => Math.abs(candidatePoint.timestamp - hoverTime) < Math.abs(bestPoint.timestamp - hoverTime) ? candidatePoint : bestPoint);
    const pointPercent = pointToPercent(nearestPoint);
    const overlayRect = overlayRoot.getBoundingClientRect();
    const localX = chartElement.getBoundingClientRect().left - overlayRect.left + pointPercent.x / 100 * chartRect.width;
    const localY = chartElement.getBoundingClientRect().top - overlayRect.top + pointPercent.y / 100 * chartRect.height;
    const pageX = overlayRect.left + localX;
    const pageY = overlayRect.top + localY;
    const guideXPercent = localX / Math.max(1, overlayRect.width) * 100;
    const guideYPercent = localY / Math.max(1, overlayRect.height) * 100;
    const tooltipInOverlay = tooltip.parentElement === overlayRoot;
    const tooltipInDialog = dialogLayer && tooltip.parentElement === dialogLayer;
    const dialogRect = tooltipInDialog ? dialogLayer.getBoundingClientRect() : null;
    const dialogLocalX = tooltipInDialog ? pageX - dialogRect.left : pageX;
    const dialogLocalY = tooltipInDialog ? pageY - dialogRect.top : pageY;
    tooltip.textContent = formatChartTime(nearestPoint.timestamp) + "  " + formatLineChartValue(nearestPoint.value, statePrecision) + unit;
    tooltip.style.position = tooltipInOverlay || tooltipInDialog ? "absolute" : "fixed";
    tooltip.style.left = (tooltipInOverlay ? localX : dialogLocalX) + "px";
    tooltip.style.top = (tooltipInOverlay ? localY : dialogLocalY) + "px";
    const tooltipAnchorX = tooltipInOverlay ? localX : dialogLocalX;
    const viewportWidth = tooltipInOverlay ? overlayRect.width : tooltipInDialog ? dialogRect.width : window.innerWidth;
    tooltip.style.transform = tooltipAnchorX < 110 ? "translate(0, calc(-100% - 9px))" : tooltipAnchorX > viewportWidth - 110 ? "translate(-100%, calc(-100% - 9px))" : "translate(-50%, calc(-100% - 9px))";
    hoverGuide.style.left = guideXPercent + "%";
    hoverDot.style.left = guideXPercent + "%";
    hoverDot.style.top = guideYPercent + "%";
    tooltip.hidden = false;
    hoverGuide.hidden = false;
    hoverDot.hidden = false;
  };
  const onPointerLeave = () => {
    tooltip.hidden = true;
    hoverGuide.hidden = true;
    hoverDot.hidden = true;
  };
  chartElement.addEventListener("pointermove", onPointerMove);
  chartElement.addEventListener("pointerleave", onPointerLeave);
  return () => {
    chartElement.removeEventListener("pointermove", onPointerMove);
    chartElement.removeEventListener("pointerleave", onPointerLeave);
    tooltip.remove();
  };
}
function buildLightFrameVisual(component, properties, isActive, frameOpacity, glowStrength, glowSize) {
  const frameWidthPx = Math.max(1, Number(component.position?.width || 236));
  const frameHeightPx = Math.max(1, Number(component.position?.height || 100));
  const normalizedHeight = Math.max(8, frameHeightPx * 236 / frameWidthPx);
  const frameWidth = clampWithDefault(properties.frameWidth, 0, 20, 2);
  const halfStroke = Math.max(0.5, frameWidth / 2 + 0.5);
  const innerWidth = Math.max(1, 236 - halfStroke * 2);
  const innerHeight = Math.max(1, normalizedHeight - halfStroke * 2);
  const radius = Math.min(innerWidth, innerHeight) * clampWithDefault(properties.radius, 0, 0.5, 0.5);
  const glowOpacity = Math.min(1, glowStrength * 0.38);
  const glowRadius = Math.max(0, Math.min(innerWidth, innerHeight) * 0.42 * glowSize);
  const glowCoreRadius = Math.max(0, Math.min(innerWidth, innerHeight) * 0.095 * glowSize);
  const centerX = 118;
  const centerY = normalizedHeight / 2;
  const frameColor = safeCssColor(properties.frameColor, "#d9e0e6");
  const glowColor = safeCssColor(properties.glowColor, "#f2f6fa");
  const frameAngle = clampWithDefault(properties.frameAngle, 0, 360, 45);
  const glowAngle = clampWithDefault(properties.glowAngle, 0, 360, 45);
  const activeOpacityScale = isActive ? 0.98 : 0.48;
  const scaledOpacity = amount => Math.max(0, Math.min(1, amount * frameOpacity / activeOpacityScale));
  const gradientId = "navigation-" + randomUuid();
  const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  element.classList.add("hb-navigation-effects");
  element.setAttribute("viewBox", "0 0 236 " + normalizedHeight);
  element.setAttribute("preserveAspectRatio", "none");
  element.setAttribute("aria-hidden", "true");
  element.innerHTML = "\n    <defs>\n      <linearGradient id=\"navigation-edge-" + gradientId + "\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"" + centerY + "\" x2=\"236\" y2=\"" + centerY + "\" gradientTransform=\"rotate(" + frameAngle + " " + centerX + " " + centerY + ")\">\n        <stop offset=\"0\" stop-color=\"" + frameColor + "\" stop-opacity=\"" + scaledOpacity(isActive ? 0.98 : 0.48) + "\"/>\n        <stop offset=\".48\" stop-color=\"" + frameColor + "\" stop-opacity=\"" + scaledOpacity(isActive ? 0.58 : 0.22) + "\"/>\n        <stop offset=\"1\" stop-color=\"" + frameColor + "\" stop-opacity=\"" + scaledOpacity(isActive ? 0.82 : 0.36) + "\"/>\n      </linearGradient>\n      <linearGradient id=\"navigation-light-" + gradientId + "\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"" + centerY + "\" x2=\"236\" y2=\"" + centerY + "\" gradientTransform=\"rotate(" + glowAngle + " " + centerX + " " + centerY + ")\">\n        <stop offset=\"0\" stop-color=\"" + glowColor + "\" stop-opacity=\"" + glowOpacity + "\"/>\n        <stop offset=\".45\" stop-color=\"" + glowColor + "\" stop-opacity=\"" + glowOpacity * 0.35 + "\"/>\n        <stop offset=\"1\" stop-color=\"" + glowColor + "\" stop-opacity=\"" + glowOpacity * 0.72 + "\"/>\n      </linearGradient>\n      <clipPath id=\"navigation-shape-" + gradientId + "\"><rect x=\"" + halfStroke + "\" y=\"" + halfStroke + "\" width=\"" + innerWidth + "\" height=\"" + innerHeight + "\" rx=\"" + radius + "\"/></clipPath>\n      <filter id=\"navigation-soft-light-" + gradientId + "\" x=\"-35%\" y=\"-75%\" width=\"170%\" height=\"250%\"><feGaussianBlur stdDeviation=\"" + glowCoreRadius + "\"/></filter>\n    </defs>\n    " + (properties.glowVisible !== false && glowRadius > 0 && glowOpacity > 0 ? "<g clip-path=\"url(#navigation-shape-" + gradientId + ")\"><rect x=\"" + halfStroke + "\" y=\"" + halfStroke + "\" width=\"" + innerWidth + "\" height=\"" + innerHeight + "\" rx=\"" + radius + "\" fill=\"none\" stroke=\"url(#navigation-light-" + gradientId + ")\" stroke-width=\"" + glowRadius + "\" filter=\"url(#navigation-soft-light-" + gradientId + ")\"/></g>" : "") + "\n    " + (properties.frameVisible !== false ? "<rect x=\"" + halfStroke + "\" y=\"" + halfStroke + "\" width=\"" + innerWidth + "\" height=\"" + innerHeight + "\" rx=\"" + radius + "\" fill=\"none\" stroke=\"url(#navigation-edge-" + gradientId + ")\" stroke-width=\"" + frameWidth + "\"/>" : "") + "\n  ";
  return element;
}
export function navigationButtonIsActive({
  targetPage = "",
  currentPagePath = "",
  entityId = "",
  entityActive = false,
  previewState = "auto"
} = {}) {
  if (previewState === "on") {
    return true;
  } else if (previewState === "off") {
    return false;
  } else if (targetPage) {
    return targetPage === currentPagePath;
  } else {
    return !!entityId && !!entityActive;
  }
}
registerComponent("image", {
  render(component) {
    const properties = component.properties || {};
    const src = staticAssetImageSource(properties.assetId);
    if (!src) {
      const element = document.createElement("div");
      element.className = "hb-unknown-component";
      element.textContent = "尚未选择图片";
      return element;
    }
    const image = document.createElement("img");
    image.className = "hb-image-component";
    image.src = src;
    image.alt = properties.alt || properties.label || "图片";
    image.draggable = false;
    image.style.objectFit = "contain";
    image.style.opacity = String(Math.max(0, Math.min(1, Number(properties.opacity ?? 1))));
    return image;
  }
});
function dt(timestamp, states) {
  if (!timestamp) {
    return false;
  }
  const options = states?.states?.get?.(String(timestamp));
  const normalizedState = String(options?.newState?.state ?? options?.state ?? "").toLowerCase();
  return ["on", "true", "1", "open", "opening", "active", "playing"].includes(normalizedState);
}
registerComponent("floorplan-auto-diagram", {
  render(component, context = {}) {
    const properties = component.properties || {};
    const root = document.createElement("div");
    root.className = "hb-floorplan-auto-diagram";
    root.setAttribute("aria-label", properties.label || properties.instanceName || "户型图自动导图");
    if (context.editable && properties.previewReady === true && (properties.generated !== true || properties.previewing === true)) {
      const iframe = document.createElement("iframe");
      iframe.className = "hb-floorplan-auto-diagram-preview is-" + (properties.interactionMode === "view" ? "view" : "position") + "-mode";
      iframe.title = "3D户型图构图预览";
      const canvas = context.document?.canvas || {};
      const position = component.position || {};
      const exportFolder = properties.exportFolder || "自动导图-" + component.id;
      const query = new URLSearchParams({
        "auto-diagram-component": component.id,
        "auto-diagram-embed": "1",
        "dashboard-width": String(Number(canvas.width || 2778)),
        "dashboard-height": String(Number(canvas.height || 1940)),
        "component-width": String(Math.max(1, Math.round(Number(position.width || 100)))),
        "component-height": String(Math.max(1, Math.round(Number(position.height || 100)))),
        "export-folder": exportFolder
      });
      if (properties.floorSelection) {
        query.set("floor-selection", String(properties.floorSelection));
      }
      iframe.src = "/3d-studio?" + query;
      iframe.setAttribute("allow", "fullscreen");
      root.append(iframe);
      const element = document.createElement("div");
      element.className = "hb-floorplan-auto-diagram-loading";
      element.innerHTML = "<i aria-hidden=\"true\"></i><strong>正在加载3D户型…</strong>";
      root.append(element);
      const elementCurrent = document.createElement("div");
      elementCurrent.className = "hb-floorplan-auto-diagram-preview-hint";
      elementCurrent.textContent = properties.interactionMode === "view" ? "拖动旋转 · 右键平移 · 滚轮缩放" : "拖动控件调整位置，右下角调整大小";
      root.append(elementCurrent);
      return root;
    }
    const baseImage = document.createElement("img");
    baseImage.className = "hb-floorplan-auto-diagram-base";
    baseImage.alt = "户型图";
    baseImage.draggable = false;
    const baseUrl = resolveAssetUrl(properties.baseAssetId || properties.floorPlanAssetId || "");
    if (baseUrl) {
      baseImage.src = baseUrl;
    } else {
      baseImage.className += " is-empty";
      baseImage.alt = "";
    }
    root.append(baseImage);
    const layers = [];
    const buttons = [];
    const syncLayerStates = () => {
      for (const layer of layers) {
        const isOn = dt(layer.entityId, context);
        layer.image.classList.toggle("is-active", isOn || context.editable);
        layer.button.classList.toggle("is-active", isOn);
        layer.button.setAttribute("aria-pressed", String(isOn));
      }
    };
    const list = Array.isArray(properties.lightLayers) ? properties.lightLayers : [];
    for (const layer of list) {
      const image = document.createElement("img");
      image.className = "hb-floorplan-auto-diagram-layer";
      image.alt = "";
      image.draggable = false;
      const assetUrl = resolveAssetUrl(layer.assetId || "");
      if (assetUrl) {
        image.src = assetUrl;
      }
      const binding = component.bindings?.["lightGroup:" + layer.id] || {};
      const entityId = String(binding.entityId || layer.entityId || "");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hb-floorplan-auto-diagram-button";
      button.textContent = layer.name || layer.note || "灯组";
      if (layer.note) {
        button.title = layer.note;
      }
      button.addEventListener("click", async event => {
        event.preventDefault();
        event.stopPropagation();
        if (!!entityId && !context.editable && typeof context.callEntityService == "function") {
          button.disabled = true;
          try {
            await context.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            context.onError?.(error);
          } finally {
            button.disabled = false;
          }
        }
      });
      root.append(image, button);
      const options = {
        image,
        button,
        entityId
      };
      layers.push(options);
      buttons.push(button);
      if (entityId && typeof context.registerRuntimeStateHandler == "function") {
        context.registerRuntimeStateHandler(entityId, syncLayerStates);
      }
    }
    if (!baseUrl) {
      const element = document.createElement("div");
      element.className = "hb-floorplan-auto-diagram-empty";
      element.textContent = "请先完成户型和灯组，再生成导图";
      root.append(element);
    }
    root.syncFloorplanAutoDiagramState = syncLayerStates;
    syncLayerStates();
    return root;
  }
});
export function renderIconButtonEffectLayer(component, context) {
  const properties = component.properties || {};
  const effectVariant = context.editable ? null : builtinEffectVariants.get(String(properties.effectAssetId || ""));
  const effectUrl = effectVariant?.url || resolveAssetUrl(properties.effectAssetId);
  if (!effectUrl || properties.effectVisible === false) {
    return null;
  }
  const isActive = iconButtonEffectIsActive(component, context);
  const lightVisual = iconButtonEffectLightVisualState(component, context);
  const awaitingVisual = iconButtonEffectLightVisualAwaiting(component, context);
  const layer = document.createElement("div");
  layer.className = "hb-icon-button-effect-layer" + (isActive ? " active" : "") + (awaitingVisual ? " awaiting-light-visual" : "");
  layer.style.setProperty("--hb-effect-image-opacity", String(clampWithDefault(properties.effectOpacity, 0, 1, 1) * lightVisual.opacity));
  const fadeDuration = clampWithDefault(properties.effectFadeDuration, 0, 3, 0.52);
  layer.style.setProperty("--hb-effect-fade-duration", fadeDuration + "s");
  layer.style.setProperty("--hb-effect-visual-transition-duration", Math.max(0.45, fadeDuration) + "s");
  const image = document.createElement("img");
  if (effectVariant) {
    image.dataset.effectSource = effectUrl;
  } else {
    image.src = effectUrl;
  }
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";
  image.style.objectFit = "contain";
  image.style.mixBlendMode = "normal";
  image.style.filter = lightVisual.filter;
  if (effectVariant) {
    image.dataset.effectOriginalWidth = String(effectVariant.originalWidth);
    image.dataset.effectOriginalHeight = String(effectVariant.originalHeight);
    image.dataset.effectCropX = String(effectVariant.cropX);
    image.dataset.effectCropY = String(effectVariant.cropY);
    image.dataset.effectCropWidth = String(effectVariant.width);
    image.dataset.effectCropHeight = String(effectVariant.height);
  }
  layer.append(image);
  return layer;
}
registerComponent("icon-button-effect", {
  render(component, context) {
    const properties = component.properties || {};
    const isActive = iconButtonEffectIsActive(component, context);
    const iconVisible = context?.isIconVisible?.(component.id) !== false;
    const root = document.createElement("div");
    root.className = "hb-icon-button-effect" + (isActive ? " active" : "");
    root.hidden = properties.buttonVisible === false;
    root.style.opacity = iconVisible ? "1" : "0";
    root.style.transition = "opacity .24s ease";
    root.style.setProperty("--effect-button-color", safeCssColor(isActive ? properties.buttonOnColor : properties.buttonOffColor, isActive ? "#1f91b8" : "#17242d"));
    root.style.setProperty("--effect-button-opacity", clampWithDefault(properties.buttonOpacity, 0, 1, 0.92) * 100 + "%");
    root.style.setProperty("--effect-frame-color", safeCssColor(properties.frameColor, "#dcebf2"));
    root.style.setProperty("--effect-frame-width", clampWithDefault(properties.frameWidth, 0, 20, 1.5) + "px");
    root.style.setProperty("--effect-frame-opacity", clampWithDefault(properties.frameOpacity, 0, 1, 0.72) * 100 + "%");
    root.style.setProperty("--effect-radius", clampWithDefault(properties.radius, 0, 50, 50) + "%");
    root.style.setProperty("--effect-glow-color", safeCssColor(properties.glowColor, "#43c8f0"));
    const glowStrength = clampWithDefault(isActive ? properties.glowOnStrength : properties.glowOffStrength, 0, 3, isActive ? 1 : 0);
    root.style.setProperty("--effect-glow-size", glowStrength * 18 + "px");
    root.style.setProperty("--effect-glow-inset-size", glowStrength * 13 + "px");
    root.style.setProperty("--effect-glow-opacity", Math.min(100, glowStrength * 38) + "%");
    root.style.setProperty("--effect-glow-inset-opacity", Math.min(100, glowStrength * 30) + "%");
    const iconUrl = resolveMdiIconUrl(properties.icon || "mdi:lightbulb-outline");
    if (iconUrl) {
      const icon = document.createElement("i");
      icon.className = "hb-icon-button-effect-icon";
      icon.style.transition = "opacity .24s ease";
      icon.style.opacity = iconVisible ? "1" : "0";
      icon.style.backgroundColor = safeCssColor(isActive ? properties.iconOnColor : properties.iconOffColor, isActive ? "#ffffff" : "#9aa5ad");
      icon.style.width = clampWithDefault(properties.iconSize, 1, 100, 44) + "%";
      icon.style.height = clampWithDefault(properties.iconSize, 1, 100, 44) + "%";
      icon.style.maskImage = "url(\"" + iconUrl + "\")";
      icon.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
      root.append(icon);
    }
    return root;
  }
});
registerComponent("title-button", {
  render(component, context) {
    const properties = component.properties || {};
    const hiddenContentClickable = properties.hiddenContentClickable === true;
    const boxWidth = Math.max(20, Number(component.position?.width || 500));
    const boxHeight = Math.max(20, Number(component.position?.height || 122));
    const {
      height: unit
    } = componentContentUnitsPx(component, context);
    const root = document.createElement("div");
    root.className = "hb-title-button";
    root.style.setProperty("--title-frame-color", safeCssColor(properties.frameColor, "#60636a"));
    root.style.setProperty("--title-frame-width", clampWithDefault(properties.frameWidth, 0, 12, 1.5) + "px");
    root.style.setProperty("--title-frame-offset-x", clampWithDefault(properties.frameOffsetX, -100, 100, 0) + "%");
    root.style.setProperty("--title-frame-offset-y", clampWithDefault(properties.frameOffsetY, -100, 100, 0) + "%");
    root.style.setProperty("--title-main-size", clampWithDefault(properties.mainSize, 8, 200, 34) * unit + "px");
    root.style.setProperty("--title-secondary-size", clampWithDefault(properties.secondarySize, 6, 100, 12) * unit + "px");
    root.style.setProperty("--title-main-spacing", clampWithDefault(properties.mainSpacing, -20, 100, 1) * unit + "px");
    root.style.setProperty("--title-secondary-spacing", clampWithDefault(properties.secondarySpacing, -20, 100, 2) * unit + "px");
    root.style.setProperty("--title-secondary-line-gap", clampWithDefault(properties.secondaryLineGap, 0, 100, 2) * unit + "px");
    root.style.setProperty("--title-main-left", clampWithDefault(properties.mainTextLeft, -100, 200, 5.5) + "%");
    root.style.setProperty("--title-main-top", clampWithDefault(properties.mainTextTop, -100, 200, 45) + "%");
    root.style.setProperty("--title-secondary-left", clampWithDefault(properties.secondaryTextLeft, -100, 200, 54) + "%");
    root.style.setProperty("--title-secondary-top", clampWithDefault(properties.secondaryTextTop, -100, 200, 43) + "%");
    root.style.setProperty("--title-icon-size", clampWithDefault(properties.iconSize, 1, 100, 30) * unit + "px");
    root.style.setProperty("--title-icon-left", clampWithDefault(properties.iconLeft, -100, 200, 50) + "%");
    root.style.setProperty("--title-icon-top", clampWithDefault(properties.iconTop, -100, 200, 45) + "%");
    root.style.setProperty("--title-marker-left", clampWithDefault(properties.markerLeft, -100, 200, 1.8) + "%");
    root.style.setProperty("--title-marker-top", clampWithDefault(properties.markerTop, -100, 200, 84) + "%");
    if (properties.frameVisible !== false || hiddenContentClickable) {
      const frameScale = clampWithDefault(properties.frameSize, 10, 300, 100) / 100;
      const bracketHeight = boxHeight * 0.45 * frameScale;
      const offsetX = boxWidth * clampWithDefault(properties.frameOffsetX, -100, 100, 0) / 100;
      const offsetY = boxHeight * clampWithDefault(properties.frameOffsetY, -100, 100, 0) / 100;
      const halfSpacing = boxWidth * clampWithDefault(properties.frameSpacing, 0, 300, 100) / 200;
      const centerX = boxWidth / 2 + offsetX;
      const centerY = boxHeight / 2 + offsetY;
      const topY = centerY - bracketHeight / 2;
      const bottomY = centerY + bracketHeight / 2;
      const hookLength = boxHeight * 0.12;
      const halfStroke = clampWithDefault(properties.frameWidth, 0, 12, 1.5) / 2;
      const leftX = centerX - halfSpacing + halfStroke;
      const rightX = centerX + halfSpacing - halfStroke;
      const svg = appendSvgChild(root, "svg", {
        viewBox: "0 0 " + boxWidth + " " + boxHeight,
        preserveAspectRatio: "none",
        "aria-hidden": "true"
      });
      svg.setAttribute("class", "hb-title-button-brackets");
      if (properties.frameVisible === false) {
        svg.style.visibility = "hidden";
      }
      const strokeAttrs = {
        fill: "none",
        stroke: safeCssColor(properties.frameColor, "#60636a"),
        "stroke-width": clampWithDefault(properties.frameWidth, 0, 12, 1.5),
        "stroke-opacity": 1,
        "stroke-linecap": "butt",
        "stroke-linejoin": "miter",
        "vector-effect": "non-scaling-stroke"
      };
      appendSvgChild(svg, "path", {
        ...strokeAttrs,
        d: "M " + (leftX + hookLength) + " " + topY + " H " + leftX + " V " + bottomY + " H " + (leftX + hookLength)
      });
      appendSvgChild(svg, "path", {
        ...strokeAttrs,
        d: "M " + (rightX - hookLength) + " " + topY + " H " + rightX + " V " + bottomY + " H " + (rightX - hookLength)
      });
    }
    if (properties.mainTextVisible !== false || hiddenContentClickable) {
      const element = document.createElement("strong");
      element.className = "hb-title-button-main";
      element.textContent = String(properties.mainText || "客厅");
      element.style.color = safeCssColor(properties.mainColor, "#b9bbc0");
      if (properties.mainTextVisible === false) {
        element.style.visibility = "hidden";
      }
      applyTextStroke(element, properties.mainWeight, clampWithDefault(properties.mainSize, 8, 200, 34));
      root.append(element);
    }
    if (properties.secondaryTextVisible !== false || hiddenContentClickable) {
      const smallEl = document.createElement("small");
      smallEl.className = "hb-title-button-secondary";
      String(properties.secondaryText || "LIVING ROOM\nLIGHTING").split(/\r?\n/).slice(0, 2).forEach(item => {
        const element = document.createElement("span");
        element.textContent = item;
        smallEl.append(element);
      });
      smallEl.style.color = safeCssColor(properties.secondaryColor, "#70737b");
      if (properties.secondaryTextVisible === false) {
        smallEl.style.visibility = "hidden";
      }
      applyTextStroke(smallEl, properties.secondaryWeight, clampWithDefault(properties.secondarySize, 6, 100, 12));
      root.append(smallEl);
    }
    if (properties.iconVisible !== false || hiddenContentClickable) {
      const iconUrl = resolveMdiIconUrl(properties.icon || "");
      if (iconUrl) {
        const iconEl = document.createElement("i");
        iconEl.className = "hb-title-button-icon";
        if (properties.iconVisible === false) {
          iconEl.style.visibility = "hidden";
        }
        iconEl.style.backgroundColor = safeCssColor(properties.iconColor, "#b9bbc0");
        iconEl.style.maskImage = "url(\"" + iconUrl + "\")";
        iconEl.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
        root.append(iconEl);
      }
    }
    if (properties.markerVisible !== false || hiddenContentClickable) {
      const iconEl = document.createElement("i");
      iconEl.className = "hb-title-button-marker";
      if (properties.markerVisible === false) {
        iconEl.style.visibility = "hidden";
      }
      iconEl.style.color = safeCssColor(properties.markerColor, "#f2a20d");
      iconEl.style.borderTopColor = safeCssColor(properties.markerColor, "#f2a20d");
      iconEl.style.setProperty("--title-marker-size", clampWithDefault(properties.markerSize, 2, 60, 10) * unit + "px");
      root.append(iconEl);
    }
    return root;
  }
});
registerComponent("light-statistics", {
  render(component, context) {
    const properties = component.properties || {};
    const summary = lightStatisticsSummary(properties.entityIds, context.states, context.entityMetadata);
    const {
      width: unitWidth,
      height: unitHeight
    } = componentContentUnitsPx(component, context);
    const element = document.createElement("div");
    element.className = "hb-light-statistics";
    element.classList.toggle("active", summary.on > 0);
    element.dataset.total = String(summary.total);
    element.dataset.on = String(summary.on);
    element.dataset.off = String(summary.off);
    element.dataset.abnormal = String(summary.abnormal);
    element.style.setProperty("--light-statistics-icon-size", clampWithDefault(properties.iconSize, 1, 100, 42) * unitHeight + "px");
    element.style.setProperty("--light-statistics-title-size", clampWithDefault(properties.titleSize, 8, 200, 32) * unitHeight + "px");
    element.style.setProperty("--light-statistics-title-spacing", clampWithDefault(properties.titleSpacing, -20, 100, 1.2) * unitHeight + "px");
    element.style.setProperty("--light-statistics-count-size", clampWithDefault(properties.countSize, 8, 200, 34) * unitHeight + "px");
    element.style.setProperty("--light-statistics-count-spacing", clampWithDefault(properties.countSpacing, -20, 100, 0) * unitHeight + "px");
    element.style.setProperty("--light-statistics-icon-gap", clampWithDefault(properties.iconGap, 0, 40, 4.5) * unitWidth + "px");
    element.style.setProperty("--light-statistics-count-gap", clampWithDefault(properties.countGap, 0, 40, 4.5) * unitWidth + "px");
    element.style.setProperty("--light-statistics-icon-color", safeCssColor(properties.iconColor, "#8b9298"));
    element.style.setProperty("--light-statistics-icon-active-color", safeCssColor(properties.iconActiveColor, "#f2a20d"));
    element.style.setProperty("--light-statistics-title-color", safeCssColor(properties.titleColor, "#b9bbc0"));
    element.style.setProperty("--light-statistics-count-color", safeCssColor(properties.countColor, "#b9bbc0"));
    element.style.setProperty("--light-statistics-count-active-color", safeCssColor(properties.countActiveColor, "#f2a20d"));
    const iconName = Object.prototype.hasOwnProperty.call(properties, "icon") ? String(properties.icon || "") : "mdi:lightbulb-group-outline";
    const iconUrl = resolveMdiIconUrl(iconName);
    const showIcon = properties.iconVisible !== false && !!iconUrl;
    const showTitle = properties.titleVisible !== false;
    const showCount = properties.countVisible !== false;
    element.classList.toggle("has-icon", showIcon);
    element.classList.toggle("has-title", showTitle);
    element.classList.toggle("has-count", showCount);
    if (showIcon) {
      const iconOrCount = document.createElement("i");
      iconOrCount.className = "hb-light-statistics-icon";
      iconOrCount.style.maskImage = "url(\"" + iconUrl + "\")";
      iconOrCount.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
      element.append(iconOrCount);
    }
    if (showTitle) {
      const elementCurrent = document.createElement("strong");
      elementCurrent.className = "hb-light-statistics-title";
      elementCurrent.textContent = String(properties.title || "数量");
      applyTextStroke(elementCurrent, properties.titleWeight, clampWithDefault(properties.titleSize, 8, 200, 32));
      element.append(elementCurrent);
    }
    if (showCount) {
      const spanEl = document.createElement("span");
      spanEl.className = "hb-light-statistics-count";
      const elementCurrent = document.createElement("b");
      elementCurrent.textContent = summary.total ? String(summary.on) : "--";
      applyTextStroke(elementCurrent, properties.countWeight, clampWithDefault(properties.countSize, 8, 200, 34));
      spanEl.append(elementCurrent);
      if (summary.total) {
        const element = document.createElement("em");
        element.textContent = " / " + summary.total;
        spanEl.append(element);
      }
      element.append(spanEl);
    }
    return element;
  }
});
const iconButtonRenderer = {
  render(component, context) {
    const properties = component.properties || {};
    const isDeviceButton = component.type === "device-button";
    const entityId = component.bindings?.entity?.entityId || "";
    const stateEntry = context.states?.get(entityId);
    const state = readState(stateEntry);
    const isActive = ot(component, context);
    const boxWidth = Math.max(20, Number(component.position?.width || 144));
    const boxHeight = Math.max(20, Number(component.position?.height || 150));
    const {
      height: unit
    } = componentContentUnitsPx(component, context);
    const cutCorner = Math.min(boxWidth, boxHeight) * clampWithDefault(properties.cutCorner, 0, 50, 20) / 100;
    const frameWidth = clampWithDefault(properties.frameWidth, 0, 12, 1);
    const frameAngle = clampWithDefault(properties.frameAngle, 0, 360, 45);
    const frameOpacity = clampWithDefault(isActive ? properties.frameOnOpacity : properties.frameOffOpacity, 0, 1, isActive ? 1 : 0.8);
    const softLightColor = safeCssColor(properties.softLightColor, "#ffffff");
    const softLightStrength = clampWithDefault(properties.softLightStrength, 0, 5, 1);
    const softLightSize = clampWithDefault(properties.softLightSize, 0, 3, 1);
    const softLightAngle = clampWithDefault(properties.softLightAngle, 0, 360, 45);
    const glowColor = safeCssColor(properties.glowColor, "#ffffff");
    const glowStrength = clampWithDefault(properties.glowStrength, 0, 5, 1);
    const glowSize = clampWithDefault(properties.glowSize, 0, 3, 1);
    const glowAngle = clampWithDefault(properties.glowAngle, 0, 360, 220);
    const centerX = boxWidth / 2;
    const centerY = boxHeight / 2;
    const glowRadians = glowAngle * Math.PI / 180;
    const cx = centerX + Math.cos(glowRadians) * boxWidth * 0.16;
    const cy = centerY + Math.sin(glowRadians) * boxHeight * 0.18;
    const gradientNs = (context.renderNamespace || "renderer") + "-icon-button-" + String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
    const root = document.createElement("div");
    root.className = "hb-icon-button" + (isActive ? " active" : "");
    root.style.setProperty("--icon-button-main-left", clampWithDefault(properties.mainTextLeft, -100, 200, 9) + "%");
    root.style.setProperty("--icon-button-main-top", clampWithDefault(properties.mainTextTop, -100, 200, 78) + "%");
    root.style.setProperty("--icon-button-secondary-left", clampWithDefault(properties.secondaryTextLeft, -100, 200, 9) + "%");
    root.style.setProperty("--icon-button-secondary-top", clampWithDefault(properties.secondaryTextTop, -100, 200, 91) + "%");
    root.style.setProperty("--icon-button-icon-left", clampWithDefault(properties.iconLeft, -100, 200, 50) + "%");
    root.style.setProperty("--icon-button-icon-top", clampWithDefault(properties.iconTop, -100, 200, 34) + "%");
    root.style.setProperty("--icon-button-icon-glow-size", unit * 9 + "px");
    root.style.setProperty("--device-button-icon-glow-size", unit * 5 + "px");
    root.style.setProperty("--device-button-icon-active-glow-size", unit * 7 + "px");
    root.style.setProperty("--hb-on-fill-fade-duration", clampWithDefault(properties.onFillFadeDuration, 0, 3, 0.3) + "s");
    if (!isDeviceButton) {
      const svg = appendSvgChild(root, "svg", {
        viewBox: "0 0 " + boxWidth + " " + boxHeight,
        preserveAspectRatio: "none",
        "aria-hidden": "true"
      });
      const defs = appendSvgChild(svg, "defs");
      const points = "0,0 " + (boxWidth - cutCorner) + ",0 " + boxWidth + "," + cutCorner + " " + boxWidth + "," + boxHeight + " 0," + boxHeight;
      const clipPath = appendSvgChild(defs, "clipPath", {
        id: gradientNs + "-clip"
      });
      appendSvgChild(clipPath, "polygon", {
        points
      });
      const softExtent = boxWidth * 0.5 * softLightSize;
      const softGradient = appendSvgChild(defs, "linearGradient", {
        id: gradientNs + "-soft-light",
        gradientUnits: "userSpaceOnUse",
        x1: centerX - softExtent,
        y1: centerY,
        x2: centerX + softExtent,
        y2: centerY,
        gradientTransform: "rotate(" + softLightAngle + " " + centerX + " " + centerY + ")"
      });
      appendSvgChild(softGradient, "stop", {
        offset: 0,
        "stop-color": softLightColor,
        "stop-opacity": Math.min(1, softLightStrength * 0.055)
      });
      appendSvgChild(softGradient, "stop", {
        offset: 0.55,
        "stop-color": softLightColor,
        "stop-opacity": Math.min(1, softLightStrength * 0.018)
      });
      appendSvgChild(softGradient, "stop", {
        offset: 1,
        "stop-color": softLightColor,
        "stop-opacity": Math.min(1, softLightStrength * 0.085)
      });
      const edgeGradient = appendSvgChild(defs, "linearGradient", {
        id: gradientNs + "-edge",
        gradientUnits: "userSpaceOnUse",
        x1: 0,
        y1: centerY,
        x2: boxWidth,
        y2: centerY,
        gradientTransform: "rotate(" + frameAngle + " " + centerX + " " + centerY + ")"
      });
      appendSvgChild(edgeGradient, "stop", {
        offset: 0,
        "stop-color": "#ffffff",
        "stop-opacity": frameOpacity
      });
      appendSvgChild(edgeGradient, "stop", {
        offset: 0.48,
        "stop-color": "#ffffff",
        "stop-opacity": frameOpacity * 0.49
      });
      appendSvgChild(edgeGradient, "stop", {
        offset: 1,
        "stop-color": "#ffffff",
        "stop-opacity": frameOpacity * 0.66
      });
      const glowGradient = appendSvgChild(defs, "radialGradient", {
        id: gradientNs + "-glow",
        gradientUnits: "userSpaceOnUse",
        cx,
        cy,
        r: Math.min(boxWidth, boxHeight) * 0.42 * glowSize
      });
      appendSvgChild(glowGradient, "stop", {
        offset: 0,
        "stop-color": glowColor,
        "stop-opacity": Math.min(1, glowStrength * 0.12)
      });
      appendSvgChild(glowGradient, "stop", {
        offset: 0.52,
        "stop-color": glowColor,
        "stop-opacity": Math.min(1, glowStrength * 0.025)
      });
      appendSvgChild(glowGradient, "stop", {
        offset: 1,
        "stop-color": glowColor,
        "stop-opacity": 0
      });
      const glowFilter = appendSvgChild(defs, "filter", {
        id: gradientNs + "-glow-blur",
        x: "-40%",
        y: "-40%",
        width: "180%",
        height: "180%"
      });
      appendSvgChild(glowFilter, "feGaussianBlur", {
        stdDeviation: Math.min(boxWidth, boxHeight) * 0.03
      });
      const clippedGroup = appendSvgChild(svg, "g", {
        "clip-path": "url(#" + gradientNs + "-clip)"
      });
      if (properties.onFillVisible !== false) {
        appendSvgChild(clippedGroup, "polygon", {
          class: "hb-icon-button-on-fill",
          points,
          fill: safeCssColor(properties.onFillColor, "#dfb64f"),
          "fill-opacity": clampWithDefault(properties.onFillStrength, 0, 1, 1)
        });
      }
      if (properties.softLightVisible !== false && softLightSize > 0) {
        appendSvgChild(clippedGroup, "polygon", {
          points,
          fill: "url(#" + gradientNs + "-soft-light)"
        });
      }
      if (properties.glowVisible !== false && glowSize > 0) {
        appendSvgChild(clippedGroup, "ellipse", {
          cx,
          cy,
          rx: boxWidth * 0.42 * glowSize,
          ry: boxHeight * 0.42 * glowSize,
          fill: "url(#" + gradientNs + "-glow)",
          filter: "url(#" + gradientNs + "-glow-blur)"
        });
      }
      if (properties.frameVisible !== false && frameWidth > 0) {
        appendSvgChild(clippedGroup, "polygon", {
          points,
          fill: "none",
          stroke: "url(#" + gradientNs + "-edge)",
          "stroke-width": frameWidth,
          "vector-effect": "non-scaling-stroke"
        });
      }
    }
    const iconName = String(properties.icon || "").trim() || (isDeviceButton ? tt(entityId, stateEntry) : "mdi:ceiling-light");
    const iconUrl = resolveMdiIconUrl(iconName);
    if (iconUrl && (!isDeviceButton || properties.iconVisible !== false || properties.hiddenContentClickable === true)) {
      const iconEl = document.createElement("i");
      iconEl.className = isDeviceButton ? "hb-device-button-icon" : "hb-icon-button-icon";
      if (!isDeviceButton) {
        iconEl.style.width = clampWithDefault(properties.iconSize, 1, 100, 42) + "%";
        iconEl.style.height = clampWithDefault(properties.iconSize, 1, 100, 42) + "%";
      }
      iconEl.style.backgroundColor = isDeviceButton && isActive ? safeCssColor(properties.iconOnColor, "#379bff") : safeCssColor(properties.iconColor || properties.iconOffColor || properties.iconOnColor, "#d7d8da");
      iconEl.style.opacity = isDeviceButton ? "1" : String(clampWithDefault(isActive ? properties.iconOnOpacity : properties.iconOffOpacity, 0, 1, 1));
      iconEl.style.maskImage = "url(\"" + iconUrl + "\")";
      iconEl.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
      if (isDeviceButton) {
        const clamped = clampWithDefault(properties.iconSize, 1, 100, 28);
        const clampedCurrent = clampWithDefault(properties.badgeSize ?? clamped, 1, 100, clamped);
        const clampedNext = clampWithDefault(properties.symbolSize ?? clamped * 0.5, 1, 100, clamped * 0.5);
        const clampedPrevious = clampWithDefault(clampedNext / clampedCurrent * 100, 1, 100, 50);
        iconEl.style.width = clampedPrevious + "%";
        iconEl.style.height = clampedPrevious + "%";
        const spanEl = document.createElement("span");
        spanEl.className = "hb-device-button-icon-badge" + (isActive ? " active" : "");
        if (properties.iconVisible === false) {
          spanEl.style.visibility = "hidden";
        }
        spanEl.style.width = clampedCurrent * unit + "px";
        spanEl.style.height = clampedCurrent * unit + "px";
        spanEl.style.setProperty("--device-badge-color", safeCssColor(properties.badgeColor, "#5b5e66"));
        spanEl.style.setProperty("--device-badge-opacity", clampWithDefault(properties.badgeOpacity, 0, 1, 0.58) * 100 + "%");
        spanEl.append(iconEl);
        root.append(spanEl);
      } else {
        root.append(iconEl);
      }
    }
    const textWrap = document.createElement("span");
    textWrap.className = "hb-icon-button-text";
    const mainSize = clampWithDefault(properties.mainSize, 6, 120, 25);
    const element = document.createElement("strong");
    element.textContent = isDeviceButton ? String(properties.mainText || "").trim() || String(state?.attributes?.friendly_name || entityId || "未选择实体") : String(properties.mainText || "主灯");
    element.style.color = safeCssColor(properties.mainColor || properties.mainOffColor || properties.mainOnColor, "#c7c8cb");
    element.style.opacity = isDeviceButton ? "1" : String(clampWithDefault(isActive ? properties.mainOnOpacity : properties.mainOffOpacity, 0, 1, 1));
    element.style.fontSize = mainSize * unit + "px";
    element.style.letterSpacing = clampWithDefault(properties.mainSpacing, -20, 100, 1) * unit + "px";
    applyTextStroke(element, properties.mainWeight, mainSize);
    element.hidden = isDeviceButton && properties.mainTextVisible === false && properties.hiddenContentClickable !== true;
    if (isDeviceButton && properties.mainTextVisible === false && properties.hiddenContentClickable === true) {
      element.style.visibility = "hidden";
    }
    const secondarySize = clampWithDefault(properties.secondarySize, 5, 80, 10);
    const elementCurrent = document.createElement("small");
    elementCurrent.textContent = isDeviceButton ? String(properties.secondaryText || "").trim() || (entityId ? formatEntityState(stateEntry, entityId, {
      ...context,
      component
    }) : "未选择实体") : String(properties.secondaryText || "MAIN LIGHT");
    elementCurrent.style.color = safeCssColor(properties.secondaryColor || properties.secondaryOffColor || properties.secondaryOnColor, "#75777d");
    elementCurrent.style.opacity = isDeviceButton ? "1" : String(clampWithDefault(isActive ? properties.secondaryOnOpacity : properties.secondaryOffOpacity, 0, 1, 1));
    elementCurrent.style.fontSize = secondarySize * unit + "px";
    elementCurrent.style.letterSpacing = clampWithDefault(properties.secondarySpacing, -20, 100, 0.7) * unit + "px";
    applyTextStroke(elementCurrent, properties.secondaryWeight, secondarySize);
    elementCurrent.hidden = isDeviceButton && properties.secondaryTextVisible === false && properties.hiddenContentClickable !== true;
    if (isDeviceButton && properties.secondaryTextVisible === false && properties.hiddenContentClickable === true) {
      elementCurrent.style.visibility = "hidden";
    }
    textWrap.append(element, elementCurrent);
    root.append(textWrap);
    return root;
  }
};
registerComponent("icon-button", iconButtonRenderer);
registerComponent("device-button", iconButtonRenderer);
function renderDoorWindowSensor(component, properties, presentation, context) {
  const rawPoints = safeCssColor(properties.iconOnColor || properties.occupiedColor, "#ffffff");
  const timestamp = presentation.key === "occupied";
  const dedupedPoints = timestamp ? "打开" : presentation.key === "clear" ? "关闭" : presentation.key === "unavailable" ? "离线" : "未知";
  const setAttribute = document.createElement("div");
  setAttribute.className = "hb-door-window-sensor is-" + (timestamp ? "open" : presentation.key);
  setAttribute.dataset.sensorState = timestamp ? "open" : presentation.key;
  setAttribute.style.setProperty("--hb-door-window-accent", rawPoints);
  setAttribute.setAttribute("role", "img");
  setAttribute.setAttribute("aria-label", "门窗传感器：" + dedupedPoints);
  const msPerHour = document.createElement("div");
  msPerHour.className = "hb-door-window-visual";
  const windowStart = Math.max(0.01, Number(context.document?.canvas?.componentScale || 1));
  const series = Math.max(1, Number(component.position?.width || 100) / windowStart);
  const cursor = Math.max(1, Number(component.position?.height || 100) / windowStart);
  msPerHour.style.transform = doorWindowPerspectiveMatrix(series, cursor, properties.perspectiveCorners);
  const lastPoint = document.createElement("span");
  lastPoint.className = "hb-door-window-frame";
  const className = document.createElement("span");
  className.className = "hb-door-window-panel left";
  const element = document.createElement("span");
  element.className = "hb-door-window-panel right";
  className.append(document.createElement("i"));
  element.append(document.createElement("i"));
  lastPoint.append(className, element);
  const classNameCurrent = document.createElement("span");
  classNameCurrent.className = "hb-door-window-airflow";
  for (let step = 0; step < 3; step += 1) {
    classNameCurrent.append(document.createElement("i"));
  }
  msPerHour.append(lastPoint, classNameCurrent);
  setAttribute.append(msPerHour);
  return setAttribute;
}
function mt(entityId, context) {
  const stateEntry = safeCssColor(entityId.waterLeakColor, "#42c8ff");
  const state = context.key === "occupied";
  const waterLeakLabel = state ? "检测到水浸" : context.key === "clear" ? "正常" : context.key === "unavailable" ? "离线" : "未知";
  const setAttribute = document.createElement("div");
  setAttribute.className = "hb-water-leak-sensor is-" + (state ? "wet" : context.key);
  setAttribute.dataset.sensorState = state ? "wet" : context.key;
  setAttribute.style.setProperty("--hb-water-leak-accent", stateEntry);
  setAttribute.setAttribute("role", "img");
  setAttribute.setAttribute("aria-label", "水浸传感器：" + waterLeakLabel);
  const className = document.createElement("div");
  className.className = "hb-water-leak-visual";
  const element = document.createElement("span");
  element.className = "hb-water-leak-puddle";
  const classNameCurrent = document.createElement("span");
  classNameCurrent.className = "hb-water-leak-ripples";
  for (let rippleIndex = 0; rippleIndex < 3; rippleIndex += 1) {
    classNameCurrent.append(document.createElement("i"));
  }
  const svgNs = "http://www.w3.org/2000/svg";
  const nS = document.createElementNS(svgNs, "svg");
  nS.setAttribute("class", "hb-water-leak-droplet");
  nS.setAttribute("viewBox", "0 0 48 64");
  nS.setAttribute("aria-hidden", "true");
  const setAttributeCurrent = document.createElementNS(svgNs, "path");
  setAttributeCurrent.setAttribute("class", "body");
  setAttributeCurrent.setAttribute("d", "M24 3C20 10 6 27 6 40c0 11 8 20 18 20s18-9 18-20C42 27 28 10 24 3Z");
  const setAttributeNext = document.createElementNS(svgNs, "path");
  setAttributeNext.setAttribute("class", "highlight");
  setAttributeNext.setAttribute("d", "M15 40c0-6 3-12 8-18");
  nS.append(setAttributeCurrent, setAttributeNext);
  className.append(element, classNameCurrent, nS);
  setAttribute.append(className);
  return setAttribute;
}
function ut(properties, presentation) {
  const accent = safeCssColor(properties.smokeColor, "#ffffff");
  const isWet = presentation.key === "occupied";
  const label = isWet ? "检测到烟雾" : presentation.key === "clear" ? "正常" : presentation.key === "unavailable" ? "离线" : "未知";
  const setAttribute = document.createElement("div");
  setAttribute.className = "hb-smoke-sensor is-" + (isWet ? "alert" : presentation.key);
  setAttribute.dataset.sensorState = isWet ? "alert" : presentation.key;
  setAttribute.style.setProperty("--hb-smoke-accent", accent);
  setAttribute.setAttribute("role", "img");
  setAttribute.setAttribute("aria-label", "烟雾传感器：" + label);
  const className = document.createElement("span");
  className.className = "hb-smoke-visual";
  const puddle = document.createElement("span");
  puddle.className = "hb-smoke-ground";
  const ripples = "http://www.w3.org/2000/svg";
  const nS = document.createElementNS(ripples, "svg");
  nS.setAttribute("class", "hb-smoke-wisps");
  nS.setAttribute("viewBox", "0 0 100 100");
  nS.setAttribute("aria-hidden", "true");
  for (const smokePathD of ["M27 94C12 76 41 67 27 49C13 32 38 22 30 7", "M50 97C34 79 65 69 49 50C35 33 61 21 52 3", "M73 93C60 77 86 66 72 48C59 32 83 22 75 8"]) {
    const setAttribute = document.createElementNS(ripples, "path");
    setAttribute.setAttribute("d", smokePathD);
    nS.append(setAttribute);
  }
  className.append(puddle, nS);
  setAttribute.append(className);
  return setAttribute;
}
function ft(properties, presentation) {
  const accent = safeCssColor(properties.naturalGasColor, "#ffb347");
  const isAlert = presentation.key === "occupied";
  const label = isAlert ? "检测到天然气" : presentation.key === "clear" ? "正常" : presentation.key === "unavailable" ? "离线" : "未知";
  const root = document.createElement("div");
  root.className = "hb-natural-gas-sensor is-" + (isAlert ? "alert" : presentation.key);
  root.dataset.sensorState = isAlert ? "alert" : presentation.key;
  root.style.setProperty("--hb-natural-gas-accent", accent);
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "天然气传感器：" + label);
  const visual = document.createElement("span");
  visual.className = "hb-natural-gas-visual";
  const ground = document.createElement("span");
  ground.className = "hb-natural-gas-haze";
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("class", "hb-natural-gas-currents");
  svg.setAttribute("viewBox", "0 0 120 80");
  svg.setAttribute("aria-hidden", "true");
  for (const pathData of ["M3 19C23 5 38 32 58 18C78 4 94 29 117 13", "M0 40C20 26 35 53 55 39C76 24 94 54 120 35", "M5 62C26 47 42 74 64 58C85 43 101 67 117 54"]) {
    const path = document.createElementNS(svgNs, "path");
    path.setAttribute("d", pathData);
    svg.append(path);
  }
  visual.append(ground, svg);
  root.append(visual);
  return root;
}
registerComponent("presence-sensor", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const stateEntry = context.states?.get(entityId);
    const motionConfig = presenceMotionEventConfig(entityId, stateEntry, context.entityMetadata, context.states, properties);
    const presentation = presenceSensorPresentation(stateEntry, context.editable ? context.previewState : "auto", motionConfig);
    if (properties.sensorKind === "door-window") {
      return renderDoorWindowSensor(component, properties, presentation, context);
    }
    if (properties.sensorKind === "water-leak") {
      return mt(properties, presentation);
    }
    if (properties.sensorKind === "smoke") {
      return ut(properties, presentation);
    }
    if (properties.sensorKind === "natural-gas") {
      return ft(properties, presentation);
    }
    const occupiedColor = safeCssColor(properties.iconOnColor || properties.occupiedColor, "#ffffff");
    const clearColor = safeCssColor(properties.iconColor || properties.clearColor, "#758189");
    const units = componentContentUnitsPx(component, context);
    const element = document.createElement("div");
    element.className = "hb-presence-sensor is-" + presentation.key;
    element.classList.toggle("is-halo-hidden", properties.haloVisible === false);
    element.classList.toggle("is-person-hidden", properties.personVisible === false);
    element.dataset.presenceState = presentation.key;
    element.style.setProperty("--hb-presence-occupied", occupiedColor);
    element.style.setProperty("--hb-presence-clear", clearColor);
    const animationStrength = clampWithDefault(properties.animationStrength, 0, 1, 0.72);
    const haloScale = clampWithDefault(properties.haloScale, 0.2, 3, 1);
    const haloScaleX = clampWithDefault(properties.haloScaleX, 0.2, 3, haloScale);
    const haloScaleY = clampWithDefault(properties.haloScaleY, 0.2, 3, haloScale);
    const haloRotation = clampWithDefault(properties.haloRotation, -360, 360, 0);
    const haloOpacity = clampWithDefault(properties.haloOpacity, 0, 1, 1);
    const personScale = clampWithDefault(properties.personScale, 0.2, 3, 1);
    const personRotation = clampWithDefault(properties.personRotation, -360, 360, 0);
    const personOpacity = clampWithDefault(properties.personOpacity, 0, 1, 1);
    const orbit = clampWithDefault(properties.orbitDuration, 2, 60, 8);
    element.style.setProperty("--hb-presence-motion", String(animationStrength));
    const wave = Number((3.2 - animationStrength * 0.8).toFixed(2));
    element.style.setProperty("--hb-presence-wave-duration", wave + "s");
    element.style.setProperty("--hb-presence-halo-scale-x", String(haloScaleX));
    element.style.setProperty("--hb-presence-halo-scale-y", String(haloScaleY));
    element.style.setProperty("--hb-presence-halo-rotation", haloRotation + "deg");
    element.style.setProperty("--hb-presence-halo-opacity", String(haloOpacity));
    element.style.setProperty("--hb-presence-person-scale", String(personScale));
    element.style.setProperty("--hb-presence-person-rotation", personRotation + "deg");
    element.style.setProperty("--hb-presence-person-opacity", String(personOpacity));
    element.style.setProperty("--hb-presence-orbit-duration", orbit + "s");
    if (presentation.key === "occupied") {
      const phaseOrIndex = presenceAnimationPhase(stateEntry, {
        orbit,
        wave
      });
      element.style.setProperty("--hb-presence-orbit-delay", phaseOrIndex.orbitDelay);
      element.style.setProperty("--hb-presence-wave-delay", phaseOrIndex.waveDelay);
      element.style.setProperty("--hb-presence-floor-delay", phaseOrIndex.floorDelay);
      element.style.setProperty("--hb-presence-step-delay", phaseOrIndex.stepDelay);
    }
    const orbitX = haloScaleX * 32 * units.width;
    const orbitY = haloScaleY * 13 * units.height;
    element.style.setProperty("--hb-presence-orbit-x", orbitX.toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-negative", (-orbitX).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y", orbitY.toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-negative", (-orbitY).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-diagonal", (orbitX * 0.707).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-diagonal-negative", (-orbitX * 0.707).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-diagonal", (orbitY * 0.707).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-diagonal-negative", (-orbitY * 0.707).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-shallow", (orbitX * 0.382683).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-shallow-negative", (-orbitX * 0.382683).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-steep", (orbitX * 0.92388).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-x-steep-negative", (-orbitX * 0.92388).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-shallow", (orbitY * 0.382683).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-shallow-negative", (-orbitY * 0.382683).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-steep", (orbitY * 0.92388).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-orbit-y-steep-negative", (-orbitY * 0.92388).toFixed(4) + "px");
    element.style.setProperty("--hb-presence-person-width", units.width * 22 + "px");
    element.style.setProperty("--hb-presence-person-height", units.height * 62 + "px");
    element.style.setProperty("--hb-presence-copy-gap", units.height * 7 + "px");
    element.style.setProperty("--hb-presence-copy-main-size", units.height * 20 + "px");
    element.style.setProperty("--hb-presence-copy-secondary-size", units.height * 10 + "px");
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", "人在传感器：" + presentation.label);
    const visual = document.createElement("div");
    visual.className = "hb-presence-sensor-visual";
    const halo = document.createElement("span");
    halo.className = "hb-presence-sensor-halo";
    const space = document.createElement("span");
    space.className = "hb-presence-sensor-space";
    for (let presenceRippleIndex = 0; presenceRippleIndex < 3; presenceRippleIndex += 1) {
      space.append(document.createElement("i"));
    }
    const person = document.createElement("span");
    person.className = "hb-presence-sensor-person";
    const head = document.createElement("i");
    const body = document.createElement("b");
    const armLeft = document.createElement("span");
    armLeft.className = "arm left";
    const armRight = document.createElement("span");
    armRight.className = "arm right";
    const legLeft = document.createElement("span");
    legLeft.className = "leg left";
    const legRight = document.createElement("span");
    legRight.className = "leg right";
    person.append(head, body, armLeft, armRight, legLeft, legRight);
    const floor = document.createElement("span");
    floor.className = "hb-presence-sensor-floor";
    halo.append(space, floor);
    const orbitCurrent = document.createElement("span");
    orbitCurrent.className = "hb-presence-sensor-orbit";
    const traveler = document.createElement("span");
    traveler.className = "hb-presence-sensor-traveler";
    traveler.append(person);
    orbitCurrent.append(traveler);
    visual.append(halo, orbitCurrent);
    element.append(visual);
    if (!context.editable && motionConfig.motionEvent && presentation.key === "occupied") {
      const stateTimestamp = presenceStateTimestamp(stateEntry);
      const remainingMs = Number.isFinite(stateTimestamp) ? motionConfig.motionTimeoutSeconds * 1000 - (Date.now() - stateTimestamp) : 0;
      if (remainingMs > 0) {
        const timeoutId = window.setTimeout(() => context.invalidate?.(), remainingMs + 80);
        context.cleanup(() => window.clearTimeout(timeoutId));
      }
    }
    return element;
  }
});
registerComponent("air-conditioner", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const state = readState(context.states?.get(entityId));
    const deviceType = resolveClimateDeviceType(component, state, entityId);
    const isPoweredOn = climateIsPoweredOnForComponent(component, context);
    const {
      height: unit
    } = componentContentUnitsPx(component, context);
    const root = document.createElement("div");
    root.className = "hb-air-conditioner" + (isPoweredOn ? " active" : "");
    root.style.setProperty("--climate-icon-left", clampWithDefault(properties.iconLeft, -100, 200, 20) + "%");
    root.style.setProperty("--climate-icon-top", clampWithDefault(properties.iconTop, -100, 200, 50) + "%");
    root.style.setProperty("--climate-main-left", clampWithDefault(properties.mainTextLeft, -100, 200, 39) + "%");
    root.style.setProperty("--climate-main-top", clampWithDefault(properties.mainTextTop, -100, 200, 40) + "%");
    root.style.setProperty("--climate-secondary-left", clampWithDefault(properties.secondaryTextLeft, -100, 200, 39) + "%");
    root.style.setProperty("--climate-secondary-top", clampWithDefault(properties.secondaryTextTop, -100, 200, 67) + "%");
    root.style.setProperty("--climate-badge-color", safeCssColor(properties.badgeColor, "#5b5e66"));
    root.style.setProperty("--climate-badge-opacity", clampWithDefault(properties.badgeOpacity, 0, 1, 0.58) * 100 + "%");
    const iconColor = safeCssColor(isPoweredOn ? properties.iconOnColor : properties.iconOffColor, isPoweredOn ? "#73c8ff" : "#9aa5ad");
    root.style.setProperty("--climate-icon-color", iconColor);
    root.style.setProperty("--climate-icon-glow-size", unit * 7 + "px");
    const badgeSize = clampWithDefault(properties.badgeSize, 1, 100, 28);
    const symbolSize = clampWithDefault(properties.symbolSize, 1, 100, 14);
    if (properties.iconVisible !== false) {
      const badge = document.createElement("span");
      badge.className = "hb-air-conditioner-icon-badge";
      badge.style.width = badgeSize * unit + "px";
      badge.style.height = badgeSize * unit + "px";
      const text = String(properties.icon || "");
      const iconName = deviceType === "bath-heater" && (!text || text === "mdi:air-conditioner") ? climateDefaultIcon(deviceType) : text || climateDefaultIcon(deviceType);
      const iconUrl = resolveMdiIconUrl(iconName);
      if (iconUrl) {
        const icon = document.createElement("i");
        icon.className = "hb-air-conditioner-icon";
        const iconPct = clampWithDefault(symbolSize / badgeSize * 100, 1, 100, 50);
        icon.style.width = iconPct + "%";
        icon.style.height = iconPct + "%";
        icon.style.backgroundColor = iconColor;
        icon.style.maskImage = "url(\"" + iconUrl + "\")";
        icon.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
        badge.append(icon);
      }
      root.append(badge);
    }
    const textWrap = document.createElement("span");
    textWrap.className = "hb-air-conditioner-text";
    const mainSize = clampWithDefault(properties.mainSize, 6, 120, 21);
    const element = document.createElement("strong");
    element.textContent = String(properties.mainText || "").trim() || String(state?.attributes?.friendly_name || entityId || (deviceType === "bath-heater" ? "未选择浴霸实体" : "未选择空调实体"));
    element.style.color = safeCssColor(properties.mainColor, "#c7c8cb");
    element.style.fontSize = mainSize * unit + "px";
    element.style.letterSpacing = clampWithDefault(properties.mainSpacing, -20, 100, 0.5) * unit + "px";
    applyTextStroke(element, properties.mainWeight, mainSize);
    const secondarySize = clampWithDefault(properties.secondarySize, 5, 80, 12);
    const elementCurrent = document.createElement("small");
    elementCurrent.textContent = entityId ? rt(component, context) : "未选择实体";
    elementCurrent.style.color = safeCssColor(properties.secondaryColor, "#75777d");
    elementCurrent.style.fontSize = secondarySize * unit + "px";
    elementCurrent.style.letterSpacing = clampWithDefault(properties.secondarySpacing, -20, 100, 0.3) * unit + "px";
    applyTextStroke(elementCurrent, properties.secondaryWeight, secondarySize);
    if (properties.mainTextVisible !== false) {
      textWrap.append(element);
    }
    if (properties.secondaryTextVisible !== false) {
      textWrap.append(elementCurrent);
    }
    if (textWrap.childElementCount) {
      root.append(textWrap);
    }
    return root;
  }
});
export function cameraRadiusRatio(radius, fallback = 0.04) {
  const numeric = Number(radius);
  if (Number.isFinite(numeric)) {
    return clampWithDefault(numeric > 0.5 ? numeric / 100 : numeric, 0, 0.5, fallback);
  } else {
    return fallback;
  }
}
export function appendCameraFrame(container, component, properties = {}, namespace = "renderer") {
  if (!container || properties.frameVisible === false) {
    return null;
  }
  const frameSize = Math.max(20, Number(component?.position?.width || container.clientWidth || 320));
  const frameHeight = Math.max(20, Number(component?.position?.height || container.clientHeight || 180));
  const frameWidth = clampWithDefault(properties.frameWidth, 0, 20, 1);
  if (frameWidth <= 0) {
    return null;
  }
  const inset = Math.max(0.5, frameWidth / 2 + 0.5);
  const width = Math.max(1, frameSize - inset * 2);
  const height = Math.max(1, frameHeight - inset * 2);
  const radiusRatio = cameraRadiusRatio(properties.radius);
  const rx = Math.min(width, height) * radiusRatio;
  const frameOpacity = clampWithDefault(properties.frameOpacity, 0, 1, 0.9);
  const frameColor = safeCssColor(properties.frameColor, "#d4d4d4");
  const gradientId = namespace + "-camera-frame-" + String(component?.id || "").replace(/[^a-z0-9_-]/gi, "");
  const svg = appendSvgChild(container, "svg", {
    class: "hb-camera-frame",
    viewBox: "0 0 " + frameSize + " " + frameHeight,
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  });
  const defs = appendSvgChild(svg, "defs");
  const gradient = appendSvgChild(defs, "linearGradient", {
    id: gradientId + "-edge",
    gradientUnits: "userSpaceOnUse",
    x1: 0,
    y1: frameHeight / 2,
    x2: frameSize,
    y2: frameHeight / 2,
    gradientTransform: "rotate(" + clampWithDefault(properties.frameAngle, 0, 360, 45) + " " + frameSize / 2 + " " + frameHeight / 2 + ")"
  });
  for (const [offset, stopOpacity] of [[0, 0.96], [0.22, 0.72], [0.52, 0.3], [0.78, 0.66], [1, 0.42]]) {
    appendSvgChild(gradient, "stop", {
      offset,
      "stop-color": frameColor,
      "stop-opacity": stopOpacity * frameOpacity
    });
  }
  appendSvgChild(svg, "rect", {
    x: inset,
    y: inset,
    width,
    height,
    rx,
    fill: "none",
    stroke: "url(#" + gradientId + "-edge)",
    "stroke-width": frameWidth,
    "vector-effect": "non-scaling-stroke"
  });
  return svg;
}
const CAMERA_HLS_CACHE_TTL_MS = 30000;
const CAMERA_PREWARM_LIMIT = 4;
const CAMERA_HLS_SOURCE_CACHE = new Map();
const ie = new Map();
async function fetchCameraHlsSource(component) {
  const accent = String(component || "").trim();
  if (!accent) {
    throw new Error("Camera entity is required");
  }
  const isOpen = Date.now();
  const label = CAMERA_HLS_SOURCE_CACHE.get(accent);
  if (label && isOpen - label.createdAt < CAMERA_HLS_CACHE_TTL_MS) {
    return label;
  }
  const root = ie.get(accent);
  if (root) {
    return root;
  }
  const visual = (async () => {
    const ok = await fetch("/api/camera_hls/" + encodeURIComponent(accent));
    if (!ok.ok) {
      throw new Error("Camera HLS request failed: " + ok.status);
    }
    const url = await ok.json();
    const startsWith = typeof url?.url == "string" ? url.url.trim() : "";
    if (!startsWith.startsWith("/")) {
      throw new Error("Camera HLS response has no proxy URL");
    }
    const entry = {
      source: startsWith,
      format: url?.format === "mjpeg" ? "mjpeg" : "hls",
      createdAt: Date.now()
    };
    CAMERA_HLS_SOURCE_CACHE.set(accent, entry);
    return entry;
  })();
  ie.set(accent, visual);
  try {
    return await visual;
  } finally {
    if (ie.get(accent) === visual) {
      ie.delete(accent);
    }
  }
}
export async function prewarmCameraMedia(entityIds = []) {
  if (document.visibilityState === "hidden") {
    return;
  }
  const uniqueIds = [...new Set((entityIds || []).map(entityId => String(entityId || "").trim()).filter(Boolean))].slice(0, CAMERA_PREWARM_LIMIT);
  await Promise.allSettled(uniqueIds.map(item => fetchCameraHlsSource(item)));
}
export function mountCameraSnapshot({
  container,
  entityId,
  label,
  objectFit = "cover",
  refreshInterval = 10,
  placeholder: element,
  cleanup: registerCleanup = () => {}
}) {
  const image = document.createElement("img");
  image.className = "hb-camera-image";
  image.alt = label || entityId;
  image.draggable = false;
  image.style.objectFit = objectFit;
  const numeric = Number(refreshInterval);
  const intervalSeconds = Number.isFinite(numeric) ? Math.max(6, Math.round(numeric)) : 10;
  const intervalMs = Math.min(2147483000, intervalSeconds * 1000);
  let disposed = false;
  let suspended = document.visibilityState === "hidden";
  let refreshTimer = 0;
  let hasLoadedOnce = false;
  let loadGeneration = 0;
  const clearRefreshTimer = () => {
    window.clearTimeout(refreshTimer);
    refreshTimer = 0;
  };
  const scheduleRefresh = () => {
    clearRefreshTimer();
    if (!disposed && !suspended) {
      refreshTimer = window.setTimeout(loadSnapshot, intervalMs);
    }
  };
  const loadSnapshot = () => {
    if (disposed || suspended) {
      return;
    }
    clearRefreshTimer();
    const url = "/api/camera_proxy/" + encodeURIComponent(entityId) + "?hb=" + Date.now();
    if (!hasLoadedOnce) {
      element.hidden = false;
      element.textContent = "正在载入摄像头快照";
      container.dataset.cameraState = "snapshot-loading";
      image.src = url;
      return;
    }
    container.dataset.cameraState = "snapshot-loading";
    const generation = ++loadGeneration;
    const imageEl = document.createElement("img");
    imageEl.addEventListener("load", () => {
      if (!disposed && !suspended && generation === loadGeneration) {
        image.src = url;
      }
    });
    imageEl.addEventListener("error", () => {
      if (!disposed && !suspended && generation === loadGeneration) {
        container.dataset.cameraState = "snapshot-stale";
        scheduleRefresh();
      }
    });
    imageEl.src = url;
  };
  image.addEventListener("load", () => {
    if (!disposed && !suspended) {
      hasLoadedOnce = true;
      element.hidden = true;
      container.dataset.cameraState = "snapshot-ready";
      scheduleRefresh();
    }
  });
  image.addEventListener("error", () => {
    if (!disposed && !suspended) {
      element.hidden = false;
      element.textContent = "摄像头快照不可用";
      container.dataset.cameraState = "snapshot-unavailable";
      scheduleRefresh();
    }
  });
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      suspended = true;
      clearRefreshTimer();
      container.dataset.cameraState = "snapshot-suspended";
      return;
    }
    if (suspended) {
      suspended = false;
      loadSnapshot();
    }
  };
  container.dataset.cameraTransport = "snapshot";
  container.prepend(image);
  document.addEventListener("visibilitychange", onVisibilityChange);
  if (suspended) {
    container.dataset.cameraState = "snapshot-suspended";
  } else {
    loadSnapshot();
  }
  registerCleanup(() => {
    disposed = true;
    clearRefreshTimer();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    image.removeAttribute("src");
  });
  return {
    image
  };
}
export function mountCameraMedia({
  container,
  entityId,
  label,
  objectFit = "cover",
  placeholder: element,
  onReady = () => {},
  onUnavailable = () => {},
  cleanup: registerCleanup = () => {}
}) {
  const video = document.createElement("video");
  video.className = "hb-camera-video";
  video.setAttribute("aria-label", label || entityId);
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;
  video.style.objectFit = objectFit;
  const image = document.createElement("img");
  image.className = "hb-camera-image";
  image.alt = label || entityId;
  image.draggable = false;
  image.style.objectFit = objectFit;
  let disposed = false;
  let legacyStarted = false;
  let snapshotFallbackStarted = false;
  let startTimer = 0;
  let legacyFallbackTimer = 0;
  let snapshotFallbackTimer = 0;
  let hlsPlayer = null;
  let readyFired = false;
  let sessionId = 0;
  let suspended = document.visibilityState === "hidden";
  const teardownPlayback = () => {
    sessionId += 1;
    window.clearTimeout(startTimer);
    window.clearTimeout(legacyFallbackTimer);
    window.clearTimeout(snapshotFallbackTimer);
    startTimer = 0;
    legacyFallbackTimer = 0;
    snapshotFallbackTimer = 0;
    hlsPlayer?.destroy();
    hlsPlayer = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    image.removeAttribute("src");
    legacyStarted = false;
    snapshotFallbackStarted = false;
    readyFired = false;
  };
  const ensureVideoMounted = () => {
    image.remove();
    if (!video.isConnected) {
      container.prepend(video);
    }
  };
  const markReady = () => {
    if (!disposed && !suspended && !readyFired) {
      readyFired = true;
      window.clearTimeout(legacyFallbackTimer);
      window.clearTimeout(snapshotFallbackTimer);
      element.hidden = true;
      onReady();
    }
  };
  const markUnavailable = () => {
    if (!disposed && !suspended) {
      readyFired = false;
      element.hidden = false;
      element.textContent = "摄像头实时预览不可用";
      onUnavailable();
    }
  };
  const loadSnapshotFallback = () => {
    if (!disposed && !suspended) {
      image.src = "/api/camera_proxy/" + encodeURIComponent(entityId) + "?hb=" + Date.now();
    }
  };
  const startSnapshotFallback = (item = sessionId) => {
    if (!disposed && !suspended && item === sessionId && !snapshotFallbackStarted) {
      snapshotFallbackStarted = true;
      window.clearTimeout(snapshotFallbackTimer);
      loadSnapshotFallback();
    }
  };
  const startLegacyStream = (item = sessionId, source = "") => {
    if (!disposed && !suspended && item === sessionId && !legacyStarted) {
      legacyStarted = true;
      container.dataset.cameraTransport = "legacy";
      window.clearTimeout(legacyFallbackTimer);
      hlsPlayer?.destroy();
      hlsPlayer = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      container.prepend(image);
      image.src = source || "/api/camera_proxy_stream/" + encodeURIComponent(entityId);
      snapshotFallbackTimer = window.setTimeout(() => {
        if (!image.naturalWidth) {
          startSnapshotFallback(item);
        }
      }, 7000);
    }
  };
  video.addEventListener("loadeddata", markReady);
  video.addEventListener("playing", markReady);
  video.addEventListener("error", () => {
    if (!hlsPlayer) {
      startLegacyStream();
    }
  }, {
    once: true
  });
  image.addEventListener("load", markReady);
  image.addEventListener("error", () => {
    if (!disposed && !suspended) {
      if (snapshotFallbackStarted) {
        markUnavailable();
      } else {
        startSnapshotFallback();
      }
    }
  });
  container.prepend(video);
  const startHls = async item => {
    try {
      const sourceEntry = await fetchCameraHlsSource(entityId);
      if (disposed || suspended || item !== sessionId) {
        return;
      }
      const hlsSource = sourceEntry.source;
      if (sourceEntry.format === "mjpeg") {
        container.dataset.cameraState = "mjpeg-fallback";
        startLegacyStream(item, hlsSource);
        return;
      }
      container.dataset.cameraHlsSource = hlsSource;
      container.dataset.cameraTransport = "hls";
      if (window.Hls?.isSupported?.()) {
        hlsPlayer = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 15,
          maxBufferLength: 15
        });
        hlsPlayer.on(window.Hls.Events.MEDIA_ATTACHED, () => hlsPlayer?.loadSource(hlsSource));
        hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, () => {
          container.dataset.cameraState = "manifest-parsed";
          video.play().catch(() => {});
        });
        hlsPlayer.on(window.Hls.Events.ERROR, (_event, hlsError) => {
          if (!disposed && !suspended && item === sessionId) {
            if (hlsError?.fatal) {
              CAMERA_HLS_SOURCE_CACHE.delete(String(entityId || "").trim());
              container.dataset.cameraState = "hls-failed";
              container.dataset.cameraError = [hlsError.type, hlsError.details, hlsError.url || hlsError.response?.url || "", hlsError.response?.code || 0, hlsError.reason || hlsError.error?.message || ""].join(" | ");
              window.HABridgeLog?.report("error", "摄像头", "摄像头播放失败：" + (hlsError.type || "") + " / " + (hlsError.details || ""), {
                entityId,
                phase: "hls-playback",
                status: hlsError.response?.code || 0,
                path: hlsError.url || hlsError.response?.url || ""
              });
              console.warn("[HA Bridge camera] HLS playback failed", {
                entityId,
                type: hlsError.type,
                details: hlsError.details,
                url: hlsError.url || hlsError.response?.url || "",
                status: hlsError.response?.code || 0,
                reason: hlsError.reason || hlsError.error?.message || ""
              });
              startLegacyStream(item);
            }
          }
        });
        hlsPlayer.attachMedia(video);
      } else {
        video.src = hlsSource;
        video.play().catch(() => {});
      }
    } catch (error) {
      if (disposed || suspended || item !== sessionId) {
        return;
      }
      container.dataset.cameraState = "setup-failed";
      container.dataset.cameraError = String(error);
      window.HABridgeLog?.error(error, {
        entityId,
        phase: "hls-setup"
      }, "摄像头连接失败：" + (error?.message || error));
      console.warn("[HA Bridge camera] HLS setup failed", {
        entityId,
        error: String(error)
      });
      startLegacyStream(item);
    }
  };
  const beginSession = () => {
    if (disposed || suspended) {
      return;
    }
    ensureVideoMounted();
    readyFired = false;
    element.hidden = false;
    element.textContent = "摄像头正在连接";
    const activeSessionId = sessionId;
    container.dataset.cameraState = "starting";
    startHls(activeSessionId);
    legacyFallbackTimer = window.setTimeout(() => startLegacyStream(activeSessionId), 12000);
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      if (suspended) {
        return;
      }
      suspended = true;
      teardownPlayback();
      container.dataset.cameraState = "suspended";
      element.hidden = false;
      element.textContent = "摄像头已在后台暂停";
      return;
    }
    if (suspended) {
      suspended = false;
      beginSession();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  if (suspended) {
    container.dataset.cameraState = "suspended";
    element.hidden = false;
    element.textContent = "摄像头已在后台暂停";
  } else {
    container.dataset.cameraState = "deferred";
    startTimer = window.setTimeout(beginSession, 0);
  }
  registerCleanup(() => {
    disposed = true;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    teardownPlayback();
  });
  return {
    video,
    image
  };
}
registerComponent("camera", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const container = document.createElement("div");
    container.className = "hb-camera-component";
    const boxWidth = Math.max(1, Number(component.position?.width || 320));
    const boxHeight = Math.max(1, Number(component.position?.height || 180));
    const contentUnit = Math.max(0.01, Number(context.document?.canvas?.componentScale || 1));
    const borderRadius = Math.min(boxWidth, boxHeight) * cameraRadiusRatio(properties.radius) / contentUnit;
    container.style.borderRadius = borderRadius + "px";
    if (context.editable) {
      const element = document.createElement("div");
      element.className = "hb-camera-placeholder";
      element.textContent = properties.mediaVisible === false ? "摄像头画面已隐藏" : "编辑模式不加载实时画面";
      container.append(element);
    } else if (context.liveMedia !== false && properties.mediaVisible !== false) {
      const placeholder = document.createElement("div");
      placeholder.className = "hb-camera-placeholder";
      const isSnapshot = properties.displayMode === "snapshot";
      placeholder.textContent = entityId ? isSnapshot ? "正在载入摄像头快照" : "正在载入摄像头实时预览" : "未选择摄像头实体";
      container.append(placeholder);
      if (entityId) {
        const mountOptions = {
          container,
          entityId,
          label: readState(context.states?.get(entityId))?.attributes?.friendly_name || entityId,
          objectFit: properties.fit === "contain" ? "contain" : "fill",
          placeholder,
          cleanup: cleanup => context.cleanup(cleanup)
        };
        if (isSnapshot) {
          mountCameraSnapshot({
            ...mountOptions,
            refreshInterval: properties.refreshInterval
          });
        } else {
          mountCameraMedia(mountOptions);
        }
      }
    }
    appendCameraFrame(container, component, properties, context.renderNamespace);
    return container;
  }
});
registerComponent("vacuum-map", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const root = document.createElement("div");
    root.className = "hb-vacuum-map-component";
    root.style.opacity = String(clampWithDefault(properties.opacity, 0, 1, 0.5));
    root.setAttribute("aria-label", properties.label || "扫地机器人实时地图");
    if (!entityId) {
      if (context.editable) {
        const element = document.createElement("span");
        element.className = "hb-vacuum-map-placeholder";
        element.textContent = "请选择实时地图实体";
        root.append(element);
      }
      return root;
    }
    const image = document.createElement("img");
    image.className = "hb-vacuum-map-image";
    image.alt = properties.label || readState(context.states?.get(entityId))?.attributes?.friendly_name || entityId;
    image.draggable = false;
    const encodedEntityId = encodeURIComponent(entityId);
    const isImageEntity = entityId.startsWith("image.");
    const allowLive = context.liveMedia !== false;
    const trackVisibility = context.liveMedia !== false && !context.editable;
    if (trackVisibility && document.visibilityState === "hidden") {
      image.dataset.vacuumMapSuspended = "true";
    }
    const resolveMapUrl = () => isImageEntity ? vacuumMapImageSource(entityId, context.states?.get(entityId)) : context.editable ? "/api/camera_proxy/" + encodedEntityId + "?hb=" + Date.now() : "/api/camera_proxy_stream/" + encodedEntityId;
    let retryTimer = 0;
    let retryCount = 0;
    const maxRetries = 4;
    const clearRetryTimer = () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
        retryTimer = 0;
      }
    };
    const applyMapSource = () => {
      const mapUrl = resolveMapUrl();
      if (isImageEntity) {
        image.dataset.vacuumMapSource = mapUrl;
      }
      if (image.dataset.vacuumMapSuspended === "true") {
        image.removeAttribute("src");
        return;
      }
      image.src = mapUrl;
    };
    const onLoad = () => {
      retryCount = 0;
      clearRetryTimer();
    };
    const showUnavailable = () => {
      if (!context.editable || !image.isConnected) {
        return;
      }
      const element = document.createElement("span");
      element.className = "hb-vacuum-map-placeholder";
      element.textContent = "实时地图暂时不可用";
      image.replaceWith(element);
    };
    const onError = () => {
      if (!allowLive || image.dataset.vacuumMapSuspended === "true") {
        return;
      }
      if (retryCount >= maxRetries) {
        showUnavailable();
        return;
      }
      retryCount += 1;
      clearRetryTimer();
      const retryDelayMs = Math.min(4000, 2 ** (retryCount - 1) * 700);
      retryTimer = window.setTimeout(() => {
        retryTimer = 0;
        if (image.dataset.vacuumMapSuspended === "true" || !image.isConnected) {
          return;
        }
        const resolvedUrl = resolveMapUrl();
        const imageSrc = isImageEntity ? resolvedUrl : "" + resolvedUrl + (resolvedUrl.includes("?") ? "&" : "?") + "hb=" + Date.now();
        if (isImageEntity) {
          image.dataset.vacuumMapSource = imageSrc;
        }
        image.src = imageSrc;
      }, retryDelayMs);
    };
    image.addEventListener("load", onLoad);
    if (allowLive) {
      image.addEventListener("error", onError);
    }
    if (context.liveMedia !== false) {
      applyMapSource();
    }
    if (trackVisibility) {
      const onVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          if (image.dataset.vacuumMapSuspended === "true") {
            return;
          }
          image.dataset.vacuumMapSuspended = "true";
          image.removeAttribute("src");
          return;
        }
        if (image.dataset.vacuumMapSuspended === "true") {
          delete image.dataset.vacuumMapSuspended;
          applyMapSource();
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      context.cleanup(() => document.removeEventListener("visibilitychange", onVisibilityChange));
    }
    if (!allowLive) {
      image.addEventListener("error", showUnavailable, {
        once: true
      });
    }
    root.append(image);
    context.cleanup(() => {
      clearRetryTimer();
      image.removeEventListener?.("load", onLoad);
      if (allowLive) {
        image.removeEventListener?.("error", onError);
      }
      image.removeAttribute("src");
    });
    return root;
  }
});
registerComponent("time", {
  render(component, context) {
    const properties = component.properties || {};
    const fontSize = clampWithDefault(properties.fontSize, 12, 500, 96);
    const root = document.createElement("time");
    root.className = "hb-time-component";
    root.style.color = safeCssColor(properties.color, "#248eb2");
    root.style.fontSize = fontSize + "px";
    root.style.letterSpacing = clampWithDefault(properties.letterSpacing, -20, 100, 2.2) + "px";
    root.style.opacity = String(clampWithDefault(properties.opacity, 0, 1, 1));
    const element = document.createElement("span");
    element.className = "hb-time-value";
    applyTextStroke(element, properties.fontWeight, fontSize);
    const elementCurrent = document.createElement("small");
    elementCurrent.className = "hb-time-period";
    applyTextStroke(elementCurrent, properties.fontWeight, fontSize * 0.5);
    root.append(element, elementCurrent);
    const tick = () => {
      const now = new Date();
      const time = formatLocalTime(properties, now);
      root.dateTime = now.toISOString();
      element.textContent = time.value;
      elementCurrent.textContent = time.suffix;
      elementCurrent.hidden = !time.suffix;
    };
    tick();
    const intervalId = window.setInterval(tick, properties.showSeconds === true ? 250 : 1000);
    context.cleanup(() => window.clearInterval(intervalId));
    return root;
  }
});
registerComponent("date", {
  render(component, context) {
    const properties = component.properties || {};
    const root = document.createElement("div");
    root.className = "hb-date-component";
    root.style.opacity = String(clampWithDefault(properties.opacity, 0, 1, 1));
    root.style.gap = clampWithDefault(properties.lineGap, 0, 200, 8) + "px";
    const element = document.createElement("strong");
    element.className = "hb-date-primary";
    element.style.color = safeCssColor(properties.primaryColor, "#8d9296");
    const primarySize = clampWithDefault(properties.primarySize, 12, 500, 36);
    element.style.fontSize = primarySize + "px";
    applyTextStroke(element, properties.primaryWeight, primarySize);
    element.style.letterSpacing = clampWithDefault(properties.primarySpacing, -20, 100, 1) + "px";
    root.append(element);
    let elementCurrent = null;
    if (properties.showLunar === true) {
      elementCurrent = document.createElement("small");
      elementCurrent.className = "hb-date-lunar";
      elementCurrent.style.color = safeCssColor(properties.lunarColor, "#7f878c");
      const now = clampWithDefault(properties.lunarSize, 10, 500, 24);
      elementCurrent.style.fontSize = now + "px";
      applyTextStroke(elementCurrent, properties.lunarWeight, now);
      elementCurrent.style.letterSpacing = clampWithDefault(properties.lunarSpacing, -20, 100, 1) + "px";
      root.append(elementCurrent);
    }
    const tick = () => {
      const now = new Date();
      element.textContent = formatLocalDate(properties, now);
      if (elementCurrent) {
        elementCurrent.textContent = formatLunarDate(now);
      }
    };
    tick();
    const intervalId = window.setInterval(tick, 30000);
    context.cleanup(() => window.clearInterval(intervalId));
    return root;
  }
});
registerComponent("weather", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const sunEntityId = component.bindings?.sun?.entityId || "sun.sun";
    const weatherState = context.states.get(entityId);
    const sunState = context.states.get(sunEntityId)?.state || "";
    const attributes = weatherState?.attributes || {};
    const [iconName, conditionLabel] = weatherVisual(weatherState?.state, sunState);
    const root = document.createElement("div");
    root.className = "hb-weather-component";
    root.style.gap = clampWithDefault(properties.iconGap, 0, 300, 22) + "px";
    root.style.opacity = String(clampWithDefault(properties.opacity, 0, 1, 1));
    if (properties.iconVisible !== false) {
      const partsOrSize = document.createElement("img");
      partsOrSize.className = "hb-weather-icon";
      partsOrSize.src = meteoconUrl(iconName);
      partsOrSize.alt = conditionLabel;
      partsOrSize.draggable = false;
      partsOrSize.style.width = clampWithDefault(properties.iconSize, 12, 500, 64) + "px";
      partsOrSize.style.height = clampWithDefault(properties.iconSize, 12, 500, 64) + "px";
      root.append(partsOrSize);
    }
    const content = document.createElement("span");
    content.className = "hb-weather-content";
    content.style.gap = clampWithDefault(properties.lineGap, 0, 200, 7) + "px";
    if (properties.temperatureVisible !== false) {
      const element = document.createElement("strong");
      const numeric = Number(attributes.temperature);
      const text = String(attributes.temperature_unit || attributes.unit_of_measurement || "°C");
      element.textContent = Number.isFinite(numeric) ? "" + numeric + text : "--" + text;
      element.style.color = safeCssColor(properties.temperatureColor, "#aeb3b7");
      const clamped = clampWithDefault(properties.temperatureSize, 12, 500, 32);
      element.style.fontSize = clamped + "px";
      applyTextStroke(element, properties.temperatureWeight, clamped);
      element.style.letterSpacing = clampWithDefault(properties.temperatureSpacing, -20, 100, 1) + "px";
      content.append(element);
    }
    if (properties.conditionVisible !== false || properties.humidityVisible !== false) {
      const element = document.createElement("small");
      const list = [];
      if (properties.conditionVisible !== false) {
        list.push(conditionLabel);
      }
      const numeric = Number(attributes.humidity);
      if (properties.humidityVisible !== false) {
        list.push(Number.isFinite(numeric) ? "湿度 " + numeric + "%" : "湿度 --");
      }
      element.textContent = list.join(" · ");
      element.style.color = safeCssColor(properties.secondaryColor, "#8d9296");
      const secondarySize = clampWithDefault(properties.secondarySize, 10, 500, 18);
      element.style.fontSize = secondarySize + "px";
      applyTextStroke(element, properties.secondaryWeight, secondarySize);
      element.style.letterSpacing = clampWithDefault(properties.secondarySpacing, -20, 100, 1) + "px";
      content.append(element);
    }
    if (content.childElementCount) {
      root.append(content);
    }
    return root;
  }
});
registerComponent("line-chart", {
  render(component, context) {
    const properties = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const stateEntry = context.states.get(entityId);
    const text = String(stateEntry?.attributes?.unit_of_measurement || "");
    const currentValue = Number.parseFloat(stateEntry?.state);
    const series = buildLineChartSeries(context, entityId, currentValue, properties.hours);
    const thresholds = resolvedThresholds(properties.thresholds, series, properties.thresholdMode);
    const element = document.createElement("div");
    element.className = "hb-line-chart-component";
    element.style.borderRadius = clampWithDefault(properties.cornerRadius, 0, 50, 10) + "%";
    const valueEl = document.createElement("span");
    valueEl.className = "hb-line-chart-value";
    valueEl.hidden = properties.valueVisible === false;
    valueEl.style.color = safeCssColor(properties.valueColor, "#dce1e5");
    valueEl.style.fontSize = Math.max(10, Number(component.position?.height || 300) * 0.12 * clampWithDefault(properties.valueScale, 10, 500, 100) / 100) + "px";
    valueEl.style.left = 95 + clampWithDefault(properties.valueOffsetX, -100, 100, 0) + "%";
    valueEl.style.top = 8 + clampWithDefault(properties.valueOffsetY, -100, 100, 0) + "%";
    const elementCurrent = document.createElement("strong");
    elementCurrent.textContent = formatLineChartValue(currentValue, properties.statePrecision);
    const elementNext = document.createElement("small");
    elementNext.textContent = text;
    valueEl.append(elementCurrent, elementNext);
    element.append(valueEl);
    element.syncLineChartState = geometryOrState => {
      const minimum = Number.parseFloat(geometryOrState?.state);
      elementCurrent.textContent = formatLineChartValue(minimum, properties.statePrecision);
      elementNext.textContent = String(geometryOrState?.attributes?.unit_of_measurement || "");
      element.style.setProperty("--hb-chart-current-color", Number.isFinite(minimum) ? thresholdColor(thresholds, minimum) : "#68cc3e");
    };
    const child = appendSvgChild(element, "svg", {
      viewBox: "0 0 100 70",
      preserveAspectRatio: "none",
      "aria-hidden": "true"
    });
    child.classList.add("hb-line-chart-graph");
    if (series.length) {
      const geometry = lineChartGeometry(series);
      const {
        minimum: chartMinimum,
        maximum,
        span,
        points
      } = geometry;
      const path = smoothChartPath(points);
      const gradientId = (context.renderNamespace || "renderer") + "-chart-" + String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
      const defs = appendSvgChild(child, "defs");
      const gradient = appendSvgChild(defs, "linearGradient", {
        id: gradientId + "-line",
        gradientUnits: "userSpaceOnUse",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 70
      });
      const stops = thresholds.length ? thresholds : [{
        value: chartMinimum,
        color: "#68cc3e"
      }];
      for (const element of [...stops].sort((element, elementRight) => elementRight.value - element.value)) {
        appendSvgChild(gradient, "stop", {
          offset: clampWithDefault((maximum - element.value) / span * 100, 0, 100, 0) + "%",
          "stop-color": element.color
        });
      }
      appendSvgChild(child, "path", {
        d: path + " L100 70 L0 70 Z",
        fill: "url(#" + gradientId + "-line)",
        opacity: 0.18
      });
      appendSvgChild(child, "path", {
        d: path,
        fill: "none",
        stroke: "url(#" + gradientId + "-line)",
        "stroke-width": 1.6,
        "vector-effect": "non-scaling-stroke"
      });
      if (!context.editable) {
        const hoverLayer = document.createElement("span");
        hoverLayer.className = "hb-line-chart-hover-layer";
        element.append(hoverLayer);
        const cleanupHover = setupLineChartHoverTooltip(hoverLayer, element, geometry, text, point => ({
          x: point.x,
          y: point.y / 70 * 100
        }), properties.statePrecision);
        context.cleanup?.(cleanupHover);
      }
    } else {
      element.classList.add("history-loading");
    }
    element.style.setProperty("--hb-chart-current-color", Number.isFinite(currentValue) ? thresholdColor(thresholds, currentValue) : "#68cc3e");
    return element;
  }
});
export function renderLineChartDetails(component, context) {
  const entityId = component.bindings?.entity?.entityId || "";
  const stateEntry = context.states.get(entityId);
  const text = String(stateEntry?.attributes?.unit_of_measurement || "");
  const currentValue = Number.parseFloat(stateEntry?.state);
  const series = buildLineChartSeries(context, entityId, currentValue, component.properties?.hours);
  const section = document.createElement("section");
  section.className = "hb-line-chart-details";
  const thresholds = resolvedThresholds(component.properties?.thresholds, series, component.properties?.thresholdMode);
  section.style.setProperty("--hb-chart-current-color", Number.isFinite(currentValue) ? thresholdColor(thresholds, currentValue) : "#68cc3e");
  section.syncLineChartState = tickOrPoint => {
    const parsedState = Number.parseFloat(tickOrPoint?.state);
    section.style.setProperty("--hb-chart-current-color", Number.isFinite(parsedState) ? thresholdColor(thresholds, parsedState) : "#68cc3e");
  };
  if (!series.length) {
    const element = document.createElement("p");
    element.textContent = "暂无历史数据。";
    section.append(element);
    return section;
  }
  const compactHorizontal = component.properties?.compactDetailsHorizontal === true;
  const viewWidth = compactHorizontal ? 790 : 720;
  const extraHeight = compactHorizontal ? 0 : 56;
  const viewHeight = 340 + extraHeight;
  const left = compactHorizontal ? 44 : 66;
  const rightPad = compactHorizontal ? 44 : 26;
  const plot = {
    left,
    top: 24,
    width: viewWidth - left - rightPad,
    height: 258 + extraHeight
  };
  const geometry = lineChartGeometry(series, plot.left, plot.top, plot.width, plot.height);
  const svg = appendSvgChild(section, "svg", {
    viewBox: "0 0 " + viewWidth + " " + viewHeight,
    preserveAspectRatio: "xMidYMid meet",
    role: "img",
    "aria-label": "带时间轴和数值轴的历史折线图"
  });
  const gradientId = (context.renderNamespace || "renderer") + "-chart-details-" + String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
  const defs = appendSvgChild(svg, "defs");
  const gradient = appendSvgChild(defs, "linearGradient", {
    id: gradientId + "-line",
    gradientUnits: "userSpaceOnUse",
    x1: 0,
    y1: plot.top,
    x2: 0,
    y2: plot.top + plot.height
  });
  const stops = thresholds.length ? thresholds : [{
    value: geometry.minimum,
    color: "#68cc3e"
  }];
  for (const element of [...stops].sort((element, elementRight) => elementRight.value - element.value)) {
    appendSvgChild(gradient, "stop", {
      offset: clampWithDefault((geometry.maximum - element.value) / geometry.span * 100, 0, 100, 0) + "%",
      "stop-color": element.color
    });
  }
  for (let valueTickIndex = 0; valueTickIndex <= 4; valueTickIndex += 1) {
    const valueTickRatio = valueTickIndex / 4;
    const y1 = plot.top + valueTickRatio * plot.height;
    const tickValue = geometry.maximum - valueTickRatio * geometry.span;
    appendSvgChild(svg, "line", {
      x1: plot.left,
      y1,
      x2: plot.left + plot.width,
      y2: y1,
      class: "hb-line-chart-details-grid"
    });
    const element = appendSvgChild(svg, "text", {
      x: plot.left - (compactHorizontal ? 8 : 12),
      y: y1 + 4,
      "text-anchor": "end",
      class: "hb-line-chart-details-axis-label"
    });
    element.textContent = formatLineChartValue(tickValue, component.properties?.statePrecision);
  }
  const includeDate = Number(component.properties?.hours || 24) > 24;
  for (let timeTickIndex = 0; timeTickIndex <= 5; timeTickIndex += 1) {
    const timeTickRatio = timeTickIndex / 5;
    const x1 = plot.left + timeTickRatio * plot.width;
    const tickTime = geometry.firstTime + timeTickRatio * (geometry.lastTime - geometry.firstTime);
    appendSvgChild(svg, "line", {
      x1,
      y1: plot.top,
      x2: x1,
      y2: plot.top + plot.height,
      class: "hb-line-chart-details-grid vertical"
    });
    const element = appendSvgChild(svg, "text", {
      x: x1,
      y: plot.top + plot.height + 25,
      "text-anchor": "middle",
      class: "hb-line-chart-details-axis-label"
    });
    element.textContent = formatChartTime(tickTime, includeDate);
  }
  appendSvgChild(svg, "line", {
    x1: plot.left,
    y1: plot.top,
    x2: plot.left,
    y2: plot.top + plot.height,
    class: "hb-line-chart-details-axis"
  });
  appendSvgChild(svg, "line", {
    x1: plot.left,
    y1: plot.top + plot.height,
    x2: plot.left + plot.width,
    y2: plot.top + plot.height,
    class: "hb-line-chart-details-axis"
  });
  const element = appendSvgChild(svg, "text", {
    x: plot.left,
    y: 20,
    class: "hb-line-chart-details-axis-title"
  });
  element.textContent = text || "数值";
  const path = smoothChartPath(geometry.points);
  appendSvgChild(svg, "path", {
    d: path + " L" + (plot.left + plot.width) + " " + (plot.top + plot.height) + " L" + plot.left + " " + (plot.top + plot.height) + " Z",
    fill: "url(#" + gradientId + "-line)",
    opacity: 0.12,
    class: "hb-line-chart-details-fill"
  });
  appendSvgChild(svg, "path", {
    d: path,
    fill: "none",
    stroke: "url(#" + gradientId + "-line)",
    "stroke-width": 2.4,
    pathLength: 100,
    "vector-effect": "non-scaling-stroke",
    class: "hb-line-chart-details-line"
  });
  const leadDot = appendSvgChild(svg, "circle", {
    cx: 0,
    cy: 0,
    r: 4.2,
    class: "hb-line-chart-details-lead-dot"
  });
  if (context.animate !== false) {
    appendSvgChild(leadDot, "animateMotion", {
      path,
      dur: "1.1s",
      begin: ".28s",
      fill: "freeze"
    });
  }
  section.cleanupLineChartHover = () => {};
  if (context.interactive !== false) {
    section.cleanupLineChartHover = setupLineChartHoverTooltip(svg, section, geometry, text, item => ({
      x: item.x / viewWidth * 100,
      y: item.y / viewHeight * 100
    }), component.properties?.statePrecision, {
      start: plot.left / viewWidth,
      end: (plot.left + plot.width) / viewWidth
    }, section);
  }
  return section;
}
registerComponent("panel-frame", {
  render(component, context) {
    const properties = component.properties || {};
    const boxWidth = Math.max(20, Number(component.position?.width || 528));
    const boxHeight = Math.max(20, Number(component.position?.height || 300));
    const edgeWidth = clampWithDefault(properties.edgeWidth, 0, 20, 0.9);
    const halfStroke = Math.max(0.5, edgeWidth / 2 + 0.5);
    const width = Math.max(1, boxWidth - halfStroke * 2);
    const height = Math.max(1, boxHeight - halfStroke * 2);
    const rx = Math.min(width, height) * clampWithDefault(properties.radius, 0, 0.5, 0.195);
    const edgeOpacity = clampWithDefault(properties.edgeOpacity, 0, 1, 1);
    const glowStrength = clampWithDefault(properties.glowStrength, 0, 5, 0.5);
    const glowSize = clampWithDefault(properties.glowSize, 0, 3, 1.5);
    const glowStroke = Math.min(width, height) * 0.22 * glowSize;
    const stdDeviation = Math.min(width, height) * 0.06 * glowSize;
    const edgeColor = safeCssColor(properties.edgeColor, "#d4d4d4");
    const glowColor = safeCssColor(properties.glowColor, "#ffffff");
    const gradientId = (context.renderNamespace || "renderer") + "-frame-" + String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
    const root = document.createElement("div");
    root.className = "hb-panel-frame-component";
    const svg = appendSvgChild(root, "svg", {
      viewBox: "0 0 " + boxWidth + " " + boxHeight,
      preserveAspectRatio: "none",
      "aria-hidden": "true"
    });
    const defs = appendSvgChild(svg, "defs");
    const glassGradient = appendSvgChild(defs, "linearGradient", {
      id: gradientId + "-glass",
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1
    });
    appendSvgChild(glassGradient, "stop", {
      offset: 0,
      "stop-color": glowColor,
      "stop-opacity": Math.min(0.35, glowStrength * 0.035)
    });
    appendSvgChild(glassGradient, "stop", {
      offset: 0.52,
      "stop-color": glowColor,
      "stop-opacity": Math.min(0.12, glowStrength * 0.01)
    });
    appendSvgChild(glassGradient, "stop", {
      offset: 1,
      "stop-color": glowColor,
      "stop-opacity": Math.min(0.25, glowStrength * 0.025)
    });
    const edgeGradient = appendSvgChild(defs, "linearGradient", {
      id: gradientId + "-edge",
      gradientUnits: "userSpaceOnUse",
      x1: 0,
      y1: boxHeight / 2,
      x2: boxWidth,
      y2: boxHeight / 2,
      gradientTransform: "rotate(" + clampWithDefault(properties.edgeAngle, 0, 360, 45) + " " + boxWidth / 2 + " " + boxHeight / 2 + ")"
    });
    for (const [offset, stopOpacityOrWeight] of [[0, 0.96], [0.22, 0.72], [0.52, 0.3], [0.78, 0.66], [1, 0.42]]) {
      appendSvgChild(edgeGradient, "stop", {
        offset,
        "stop-color": edgeColor,
        "stop-opacity": stopOpacityOrWeight * edgeOpacity
      });
    }
    const glowGradient = appendSvgChild(defs, "linearGradient", {
      id: gradientId + "-glow",
      gradientUnits: "userSpaceOnUse",
      x1: 0,
      y1: boxHeight / 2,
      x2: boxWidth,
      y2: boxHeight / 2,
      gradientTransform: "rotate(" + clampWithDefault(properties.glowAngle, 0, 360, 242) + " " + boxWidth / 2 + " " + boxHeight / 2 + ")"
    });
    for (const [offset, val] of [[0, 0.32], [0.42, 0.09], [0.72, 0.05], [1, 0.22]]) {
      appendSvgChild(glowGradient, "stop", {
        offset,
        "stop-color": glowColor,
        "stop-opacity": Math.min(1, val * glowStrength)
      });
    }
    const clipPath = appendSvgChild(defs, "clipPath", {
      id: gradientId + "-clip"
    });
    appendSvgChild(clipPath, "rect", {
      x: halfStroke,
      y: halfStroke,
      width,
      height,
      rx
    });
    const blurFilter = appendSvgChild(defs, "filter", {
      id: gradientId + "-blur",
      x: "-35%",
      y: "-55%",
      width: "170%",
      height: "210%"
    });
    appendSvgChild(blurFilter, "feGaussianBlur", {
      stdDeviation
    });
    if (properties.glowVisible !== false) {
      const svgG = appendSvgChild(svg, "g", {
        "clip-path": "url(#" + gradientId + "-clip)"
      });
      appendSvgChild(svgG, "rect", {
        x: halfStroke,
        y: halfStroke,
        width,
        height,
        rx,
        fill: "url(#" + gradientId + "-glass)"
      });
      if (glowStroke > 0 && glowStrength > 0) {
        appendSvgChild(svgG, "rect", {
          x: halfStroke,
          y: halfStroke,
          width,
          height,
          rx,
          fill: "none",
          stroke: "url(#" + gradientId + "-glow)",
          "stroke-width": glowStroke,
          filter: "url(#" + gradientId + "-blur)"
        });
      }
    }
    if (properties.edgeVisible !== false) {
      appendSvgChild(svg, "rect", {
        x: halfStroke,
        y: halfStroke,
        width,
        height,
        rx,
        fill: "none",
        stroke: "url(#" + gradientId + "-edge)",
        "stroke-width": edgeWidth
      });
    }
    const textLeft = clampWithDefault(properties.textLeft, -100, 200, 5.2);
    const textTop = clampWithDefault(properties.textTop, -100, 200, 28);
    const mainX = boxWidth * clampWithDefault(properties.mainTextLeft, -100, 200, textLeft) / 100;
    const mainY = boxHeight * clampWithDefault(properties.mainTextTop, -100, 200, textTop - clampWithDefault(properties.lineGap, 0, 500, 24) / boxHeight * 100) / 100;
    const secondaryX = boxWidth * clampWithDefault(properties.secondaryTextLeft, -100, 200, textLeft) / 100;
    const secondaryY = boxHeight * clampWithDefault(properties.secondaryTextTop, -100, 200, textTop) / 100;
    const mainOpacity = clampWithDefault(properties.mainOpacity, 0, 1, 0.72);
    const secondaryOpacity = clampWithDefault(properties.secondaryOpacity, 0, 1, 0.36);
    if (properties.mainTextVisible !== false) {
      const element = appendSvgChild(svg, "text", {
        x: mainX,
        y: mainY,
        "text-anchor": "start",
        fill: safeCssColor(properties.mainColor, "#ffffff"),
        "fill-opacity": mainOpacity,
        "font-family": "PingFang SC,Noto Sans SC,Microsoft YaHei,sans-serif",
        "font-size": clampWithDefault(properties.mainSize, 8, 500, 30),
        "font-weight": 300,
        "letter-spacing": clampWithDefault(properties.mainSpacing, -20, 100, 2)
      });
      const clamped = clampWithDefault(properties.mainWeight, 0, 3, 0);
      if (clamped > 0) {
        Object.entries({
          stroke: safeCssColor(properties.mainColor, "#ffffff"),
          "stroke-opacity": mainOpacity,
          "stroke-width": clamped,
          "paint-order": "stroke fill"
        }).forEach(([attrName, attrValue]) => element.setAttribute(attrName, attrValue));
      }
      element.textContent = String(properties.mainText || "");
    }
    if (properties.secondaryTextVisible !== false) {
      const element = appendSvgChild(svg, "text", {
        x: secondaryX,
        y: secondaryY,
        "text-anchor": "start",
        fill: safeCssColor(properties.secondaryColor, "#ffffff"),
        "fill-opacity": secondaryOpacity,
        "font-family": "Helvetica Neue,Arial,sans-serif",
        "font-size": clampWithDefault(properties.secondarySize, 6, 500, 15),
        "font-weight": 300,
        "letter-spacing": clampWithDefault(properties.secondarySpacing, -20, 100, 2.1)
      });
      const clamped = clampWithDefault(properties.secondaryWeight, 0, 3, 0);
      if (clamped > 0) {
        Object.entries({
          stroke: safeCssColor(properties.secondaryColor, "#ffffff"),
          "stroke-opacity": secondaryOpacity,
          "stroke-width": clamped,
          "paint-order": "stroke fill"
        }).forEach(([attrName, attrValue]) => element.setAttribute(attrName, attrValue));
      }
      element.textContent = String(properties.secondaryText || "");
    }
    return root;
  }
});
export function componentContentUnitsPx(component, context) {
  const count = Math.max(0.01, Number(context?.document?.canvas?.componentScale || 1));
  return {
    width: Math.max(1, Number(component?.position?.width || 100)) / count / 100,
    height: Math.max(1, Number(component?.position?.height || 100)) / count / 100
  };
}
export function navigationContentUnitPx(component, context) {
  return componentContentUnitsPx(component, context).height * 100 / 64.36;
}
registerComponent("navigation-button", {
  render(component, context) {
    const properties = component.properties || {};
    const targetPage = ["tap", "doubleTap", "hold"].map(actionOrIconUrl => component.actions?.[actionOrIconUrl]).find(item => item?.type === "navigate" && item.target)?.target || properties.targetPage || "";
    const entityId = component.bindings?.entity?.entityId || "";
    const previewState = context.editable && ["off", "on"].includes(context.previewState) ? context.previewState : "auto";
    const entityActive = !!entityId && !!componentIsActive(component, entityId, context.states?.get(entityId), context);
    const isActive = navigationButtonIsActive({
      targetPage,
      currentPagePath: context.page?.path || "",
      entityId,
      entityActive,
      previewState
    });
    const textOpacity = clampWithDefault(isActive ? properties.textActiveOpacity ?? properties.activeOpacity : properties.textIdleOpacity ?? properties.idleOpacity, 0, 1, isActive ? 0.96 : 0.3);
    const iconOpacity = clampWithDefault(isActive ? properties.iconActiveOpacity ?? properties.activeOpacity : properties.iconIdleOpacity ?? properties.idleOpacity, 0, 1, isActive ? 0.96 : 0.3);
    const frameOpacity = clampWithDefault(isActive ? properties.frameActiveOpacity : properties.frameIdleOpacity, 0, 1, isActive ? 0.98 : 0.48);
    const glowStrength = clampWithDefault(isActive ? properties.glowActiveStrength : properties.glowIdleStrength, 0, 5, isActive ? 2.2 : 0.5);
    const glowSize = clampWithDefault(isActive ? properties.glowActiveSize : properties.glowIdleSize, 0, 3, isActive ? 3 : 1.5);
    const mainColor = safeCssColor(properties.mainColor, "#e9edf0");
    const secondaryColor = safeCssColor(properties.secondaryColor, "#e9edf0");
    const lineGapUnit = 100 / 64.36;
    const contentUnit = navigationContentUnitPx(component, context);
    const textLeft = clampWithDefault(properties.textLeft, -100, 200, 27.5);
    const textTop = clampWithDefault(properties.textTop, -100, 200, 81.5);
    const mainLeft = clampWithDefault(properties.mainTextLeft, -100, 200, textLeft);
    const mainTop = clampWithDefault(properties.mainTextTop, -100, 200, textTop - lineGapUnit * 18);
    const secondaryLeft = clampWithDefault(properties.secondaryTextLeft, -100, 200, textLeft);
    const secondaryTop = clampWithDefault(properties.secondaryTextTop, -100, 200, textTop);
    const root = document.createElement("div");
    root.className = "hb-navigation-button" + (isActive ? " active" : "");
    root.dataset.targetPage = targetPage;
    root.style.setProperty("--navigation-text-opacity", String(textOpacity));
    root.style.setProperty("--navigation-icon-opacity", String(iconOpacity));
    root.style.setProperty("--navigation-icon-size", clampWithDefault(properties.iconSize, 1, 500, 50) * contentUnit + "px");
    root.style.setProperty("--navigation-icon-left", clampWithDefault(properties.iconLeft, -100, 200, 14) + "%");
    root.style.setProperty("--navigation-icon-top", clampWithDefault(properties.iconTop, -100, 200, 50) + "%");
    root.style.setProperty("--navigation-main-size", clampWithDefault(properties.mainSize, 1, 500, 30) * contentUnit + "px");
    root.style.setProperty("--navigation-secondary-size", clampWithDefault(properties.secondarySize, 1, 500, 11) * contentUnit + "px");
    root.style.setProperty("--navigation-main-spacing", clampWithDefault(properties.mainSpacing, -20, 100, 8) * contentUnit + "px");
    root.style.setProperty("--navigation-secondary-spacing", clampWithDefault(properties.secondarySpacing, -20, 100, 3) * contentUnit + "px");
    root.style.setProperty("--navigation-main-left", mainLeft + "%");
    root.style.setProperty("--navigation-secondary-left", secondaryLeft + "%");
    root.style.setProperty("--navigation-main-top", mainTop + "%");
    root.style.setProperty("--navigation-secondary-top", secondaryTop + "%");
    if (properties.glowVisible !== false || properties.frameVisible !== false) {
      root.append(buildLightFrameVisual(component, properties, isActive, frameOpacity, glowStrength, glowSize));
    }
    if (properties.iconVisible !== false) {
      const iconUrl = resolveMdiIconUrl(properties.icon || "mdi:home-lightbulb-outline");
      if (iconUrl) {
        const icon = document.createElement("i");
        icon.className = "hb-navigation-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.style.backgroundColor = safeCssColor(properties.iconColor, "#e9edf0");
        icon.style.maskImage = "url(\"" + iconUrl + "\")";
        icon.style.webkitMaskImage = "url(\"" + iconUrl + "\")";
        root.append(icon);
      }
    }
    const textWrap = document.createElement("span");
    textWrap.className = "hb-navigation-text";
    if (properties.mainTextVisible !== false) {
      const element = document.createElement("strong");
      element.textContent = properties.mainText || "页面导航";
      element.style.color = mainColor;
      element.style.webkitTextStrokeColor = mainColor;
      element.style.webkitTextStrokeWidth = clampWithDefault(properties.mainWeight, 0, 3, 0) * contentUnit + "px";
      textWrap.append(element);
    }
    if (properties.secondaryTextVisible !== false) {
      const element = document.createElement("small");
      element.textContent = properties.secondaryText || "NAVIGATION";
      element.style.color = secondaryColor;
      element.style.webkitTextStrokeColor = secondaryColor;
      element.style.webkitTextStrokeWidth = clampWithDefault(properties.secondaryWeight, 0, 3, 0) * contentUnit + "px";
      textWrap.append(element);
    }
    if (textWrap.childElementCount) {
      root.append(textWrap);
    }
    return root;
  }
});
