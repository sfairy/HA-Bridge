import { randomUuid } from "../utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import {
  climateDefaultIcon,
  climateEffectMode,
  climateIsPoweredOn,
  climateModeLabel,
  climatePresentationMode,
  normalizeClimateCapabilities,
  resolveClimateDeviceType,
} from "./climate.js?v=20260812-presence-phase-v79-20260904-climate-capability-options-v3";
import { entityPowerIsOn } from "./entity-power.js?v=20260813-generic-device-power-v2";
import { lightRealtimeCapabilities } from "./light-runtime.js?v=20260901-renderer-light-runtime-v1";
import { renderInteraction3d } from "../modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6";
const ue = new Map();
const index = new Map();
const index2 = new Map();
const index3 = new Map();
export function setBuiltinAssetVersions(value = []) {
  const index4 = new Map();
  const index5 = new Map();
  const index6 = new Map();
  for (const value5 of value || []) {
    const text = String(value5?.assetId || "");
    if (!text) {
      continue;
    }
    const text2 = String(value5.version || "");
    const list = Array.isArray(value5.legacyAssetIds)
      ? value5.legacyAssetIds
      : [];
    for (const value6 of [text, ...list]) {
      index4.set(String(value6), text2);
      if (value5.url) {
        index5.set(String(value6), String(value5.url));
      }
      const value7 = value5.effectVariant || {};
      const originalWidth = Number(value7.originalWidth || 0);
      const originalHeight = Number(value7.originalHeight || 0);
      const cropX = Number(value7.cropX);
      const cropY = Number(value7.cropY);
      const width = Number(value7.width || 0);
      const height = Number(value7.height || 0);
      if (
        String(value7.url || "").startsWith("/api/v1/assets/effect-variant?") &&
        originalWidth > 0 &&
        originalHeight > 0 &&
        Number.isFinite(cropX) &&
        Number.isFinite(cropY) &&
        cropX >= 0 &&
        cropY >= 0 &&
        width > 0 &&
        height > 0 &&
        cropX + width <= originalWidth &&
        cropY + height <= originalHeight
      ) {
        index6.set(String(value6), {
          url: String(value7.url),
          originalWidth: originalWidth,
          originalHeight: originalHeight,
          cropX: cropX,
          cropY: cropY,
          width: width,
          height: height,
        });
      }
    }
  }
  if (
    index4.size === index.size &&
    ![...index4].some(([value5, value6]) => index.get(value5) !== value6) &&
    index5.size === index2.size &&
    ![...index5].some(([value5, value6]) => index2.get(value5) !== value6) &&
    index6.size === index3.size &&
    ![...index6].some(
      ([value5, value6]) =>
        JSON.stringify(index3.get(value5)) !== JSON.stringify(value6),
    )
  ) {
    return false;
  }
  index.clear();
  for (const [value5, value6] of index4) {
    index.set(value5, value6);
  }
  index2.clear();
  for (const [value5, value6] of index5) {
    index2.set(value5, value6);
  }
  index3.clear();
  for (const [value5, value6] of index6) {
    index3.set(value5, value6);
  }
  return true;
}
export function registerComponent(value, value2) {
  ue.set(value, value2);
}
registerComponent("interaction3d", { render: renderInteraction3d });
export function renderRegisteredComponent(value, value2) {
  const value3 = ue.get(value.type);
  if (value3) {
    return value3.render(value, value2);
  }
  const value4 = document.createElement("div");
  value4.className = "hb-unknown-component";
  const element = document.createElement("strong");
  element.textContent = "控件尚未实现";
  const element2 = document.createElement("span");
  element2.textContent = value.type;
  value4.append(element, element2);
  return value4;
}
function ne(value) {
  const text = String(value || "");
  if (index2.has(text)) {
    return index2.get(text);
  }
  if (text.startsWith("studio3d:")) {
    const value5 = text.slice(9).split("/");
    if (value5.length !== 2 || !value5[0] || !value5[1]) {
      return "";
    } else {
      return (
        "/api/v1/assets/studio3d-export/" +
        encodeURIComponent(value5[0]) +
        "/" +
        encodeURIComponent(value5[1])
      );
    }
  }
  if (text.startsWith("user:")) {
    const value5 = text.slice(5);
    if (/^[0-9a-f]{32}$/.test(value5)) {
      return "/api/v1/assets/user/" + value5;
    } else {
      return "";
    }
  }
  if (!text.startsWith("builtin:")) {
    return "";
  }
  const value2 = text.slice(8);
  const value3 = (
    value2.startsWith("v1/2D/") || value2.startsWith("v1/3D/")
      ? value2.replace(/^v1\//, "v1/户型图示例/")
      : value2
  )
    .split("/")
    .filter(Boolean)
    .map((value5) => encodeURIComponent(value5))
    .join("/");
  if (!value3) {
    return "";
  }
  const value4 = index.get(text) || "";
  return (
    "/assets/builtin/" +
    value3 +
    (value4 ? "?v=" + encodeURIComponent(value4) : "")
  );
}
export function staticAssetImageSource(staticAssetImage) {
  return ne(staticAssetImage);
}
function fn(value, value2, value3, value4) {
  const numeric = Number(value);
  return Math.max(
    value2,
    Math.min(value3, Number.isFinite(numeric) ? numeric : value4),
  );
}
function S(value, value2) {
  const value3 = String(value || "").trim();
  if (
    /^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(value3)
  ) {
    return value3;
  } else {
    return value2;
  }
}
function B(value, value2, value3) {
  const numeric = Number(value2);
  const value4 =
    Number.isFinite(numeric) && numeric > 1
      ? fn((numeric - 1) / 899, 0, 1, 0.4)
      : fn(numeric, 0, 1, 0.4);
  const count = Math.max(1, Number(value3 || 16));
  const value5 = value4 * count * 0.05;
  value.style.fontWeight = "100";
  value.style.webkitTextStroke = value5.toFixed(3) + "px currentColor";
  value.style.paintOrder = "stroke fill";
}
function K(value) {
  const value2 = String(value || "")
    .trim()
    .replace(/^mdi:/, "");
  if (/^[a-z0-9-]+$/.test(value2)) {
    return "/bridge-static/vendor/mdi/7.4.47/svg/" + value2 + ".svg";
  } else {
    return "";
  }
}
function fe(value) {
  const value2 = String(value?.state ?? value?.newState?.state ?? "")
    .trim()
    .toLowerCase();
  return ["on", "open", "true", "home"].includes(value2);
}
const De = 1;
function he(component) {
  return component?.properties?.coverMotorDirection === "reversed";
}
export function coverComponentIsDream(
  component,
  value = "",
  value2 = null,
  value3 = new Map(),
) {
  const coverKind = component?.properties?.coverKind;
  if (coverKind === "dream") {
    return true;
  }
  if (["standard", "airer"].includes(coverKind)) {
    return false;
  }
  const value4 = D(value2) || {};
  const numeric = Number(value4.attributes?.supported_features || 0);
  const value5 = value3?.get?.(value) || {};
  const value6 =
    value +
    " " +
    (value4.attributes?.friendly_name || "") +
    " " +
    (value5.name || "") +
    " " +
    (value5.originalName || "");
  return (
    Number.isFinite(Number(value4.attributes?.current_tilt_position)) ||
    !!(numeric & 240) ||
    /梦幻|竖帘|垂直帘|百叶|(^|[._-])novo([._-]|$)/i.test(value6)
  );
}
function Be(value, value2, value3, value4) {
  const value5 = D(value3) || {};
  const value6 = String(value5.state || "")
    .trim()
    .toLowerCase();
  const value7 = he(value);
  const value8 =
    (value7 &&
      {
        open: "closed",
        closed: "open",
        opening: "closing",
        closing: "opening",
      }[value6]) ||
    value6;
  if (value8 === "opening") {
    return true;
  }
  if (value8 === "closing") {
    return false;
  }
  if (coverComponentIsDream(value, value2, value5, value4.entityMetadata)) {
    return value8 === "open";
  }
  const numeric = Number(value5.attributes?.current_position);
  if (Number.isFinite(numeric)) {
    return (value7 ? 100 - numeric : numeric) > De;
  } else if (value7) {
    return !fe(value5);
  } else {
    return fe(value5);
  }
}
export function coverComponentIsActive(value, value2, value3, value4 = {}) {
  return Be(value, value2, value3, value4);
}
function ae(component, value, value2, value3 = {}) {
  if (String(value || "").startsWith("cover.")) {
    return coverComponentIsActive(component, value, value2, value3);
  }
  const text = String(component?.properties?.runtimePowerEntityId || value);
  const value4 = text === value ? value2 : value3.states?.get(text);
  return entityPowerIsOn(text, value4, component);
}
function D(value) {
  return value?.newState || value || null;
}
export function iconButtonEffectLightVisualAwaiting(component, value = {}) {
  const value2 = component?.properties || {};
  const text = String(component?.bindings?.entity?.entityId || "");
  if (
    !!value.editable ||
    !text.startsWith("light.") ||
    (value2.effectBrightnessRealtime === false &&
      value2.effectColorTemperatureRealtime === false)
  ) {
    return false;
  }
  const value3 = D(value.states?.get?.(text));
  const value4 = String(value3?.state || "").toLowerCase();
  if (!value3 || value4 === "unknown" || value4 === "unavailable") {
    return true;
  }
  if (value.pendingOptimisticState?.desiredActive === true || value4 !== "on") {
    return false;
  }
  const value5 = value3.attributes || {};
  const value6 = lightRealtimeCapabilities(text, value3);
  const fn3 = (value9) =>
    value5[value9] !== null &&
    value5[value9] !== undefined &&
    value5[value9] !== "" &&
    Number.isFinite(Number(value5[value9]));
  if (
    value2.effectBrightnessRealtime !== false &&
    value6.brightness &&
    !fn3("brightness")
  ) {
    return true;
  }
  const list = Array.isArray(value5.supported_color_modes)
    ? value5.supported_color_modes.map((value9) =>
        String(value9 || "").toLowerCase(),
      )
    : [];
  const value7 = String(value5.color_mode || "").toLowerCase();
  const value8 =
    value7 === "color_temp" ||
    (!value7 && list.length === 1 && list[0] === "color_temp");
  return (
    value2.effectColorTemperatureRealtime !== false &&
    !!value6.colorTemperature &&
    !!value8 &&
    !fn3("color_temp_kelvin") &&
    !fn3("color_temp")
  );
}
export function vacuumMapImageSource(vacuumMapImage, value = null) {
  const value2 = D(value) || {};
  const text = String(
    value2.updatedAt || value2.lastChanged || value2.state || "initial",
  );
  return (
    "/api/image_proxy/" +
    encodeURIComponent(String(vacuumMapImage || "")) +
    "?hb=" +
    encodeURIComponent(text)
  );
}
import {
  lightStatisticsEntityStateStatus,
  lightStatisticsEntitySupport,
  lightStatisticsSummary,
} from "./light-statistics-runtime.js?v=20260901-renderer-light-statistics-runtime-v1";
import {
  automaticNumericPrecision,
  formatLineChartValue,
  formatNumericValue,
  lineChartGeometry,
  normalizedStatePrecision,
} from "./line-chart-runtime.js?v=20260901-renderer-line-chart-runtime-v1";
import {
  doorWindowPerspectiveCorners,
  doorWindowPerspectiveMatrix,
} from "./door-window-runtime.js?v=20260901-renderer-door-window-runtime-v1";
import {
  automaticThresholds,
  meteoconUrl,
  normalizedThresholds,
  resolvedThresholds,
  smoothChartPath,
  thresholdColor,
  weatherVisual,
} from "./weather-chart-runtime.js?v=20260901-renderer-weather-chart-runtime-v2";
import {
  formatLocalDate,
  formatLocalTime,
  formatLunarDate,
} from "./date-time-runtime.js?v=20260901-renderer-date-time-runtime-v1";
export {
  lightStatisticsEntityStateStatus,
  lightStatisticsEntitySupport,
  lightStatisticsSummary,
  automaticNumericPrecision,
  formatLineChartValue,
  formatNumericValue,
  lineChartGeometry,
  normalizedStatePrecision,
  doorWindowPerspectiveCorners,
  doorWindowPerspectiveMatrix,
  meteoconUrl,
  automaticThresholds,
  normalizedThresholds,
  resolvedThresholds,
  smoothChartPath,
  thresholdColor,
  weatherVisual,
  formatLocalDate,
  formatLocalTime,
  formatLunarDate,
};
import {
  formatPresenceDuration,
  presenceAnimationPhase,
  presenceHistoryBuckets,
  presenceMotionEventConfig,
  presenceSensorPresentation,
  presenceStateTimestamp,
} from "./presence-runtime.js?v=20260901-renderer-presence-runtime-v1";
export {
  formatPresenceDuration,
  presenceAnimationPhase,
  presenceHistoryBuckets,
  presenceMotionEventConfig,
  presenceSensorPresentation,
  presenceStateTimestamp,
};
function et(value, value2) {
  const value3 = String(D(value2)?.attributes?.icon || "").trim();
  if (value3) {
    return value3;
  }
  const value4 = String(value || "").split(".")[0];
  return (
    {
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
      water_heater: "mdi:water-boiler",
    }[value4] || "mdi:devices"
  );
}
export function formatEntityState(component, value2 = "", value3 = {}) {
  const value4 = D(component);
  if (!value4) {
    return "等待实体状态";
  }
  const value5 = String(value4.state ?? "").trim();
  const value6 = value3.entityMetadata?.get?.(value2) || {};
  const value7 = String(value6.platform || "").trim();
  const value8 = String(value6.domain || value2.split(".")[0] || "").trim();
  const value9 = String(value6.translationKey || "").trim();
  const value10 =
    value7 && value8 && value9 && value5
      ? "component." +
        value7 +
        ".entity." +
        value8 +
        "." +
        value9 +
        ".state." +
        value5
      : "";
  const value11 = String(value4.attributes?.device_class || "").trim();
  const value12 =
    value8 && value11 && value5
      ? "component." +
        value8 +
        ".entity_component." +
        value11 +
        ".state." +
        value5
      : "";
  const value13 = String(
    (value10 ? value3.entityTranslations?.[value10] : "") ||
      (value12 ? value3.entityTranslations?.[value12] : "") ||
      "",
  ).trim();
  const value14 =
    {
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
      paused: "已暂停",
    }[value5.toLowerCase()] ||
    value5 ||
    "未知";
  const value15 =
    String(value2 || "").startsWith("cover.") && he(value3.component)
      ? {
          open: "关闭",
          closed: "打开",
          opening: "正在关闭",
          closing: "正在打开",
        }[value5.toLowerCase()]
      : "";
  const value16 = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value5)
    ? Number(value5)
    : Number.NaN;
  const value17 = Number.isFinite(value16)
    ? formatNumericValue(value16, value3.component?.properties?.statePrecision)
    : value15 || value13 || value14;
  const value18 = String(value4.attributes?.unit_of_measurement || "").trim();
  if (value18 && !["不可用", "未知"].includes(value17)) {
    return value17 + " " + value18;
  } else {
    return value17;
  }
}
function Pe(component, value) {
  if (value.editable && value.previewState === "on") {
    return true;
  }
  if (value.editable && value.previewState === "off") {
    return false;
  }
  const value2 = component.bindings?.entity?.entityId || "";
  return !!value2 && !!ae(component, value2, value.states?.get(value2), value);
}
export const ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN = 3500;
function tt(value) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return 1;
  }
  const count = Math.max(0, Math.min(1, Number(value) / 100));
  if (count <= 0) {
    return 0;
  } else {
    return 0.2 + count * 0.8;
  }
}
function nt(value = {}) {
  const numeric = Number(value.color_temp_kelvin);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  }
  const numeric2 = Number(value.color_temp);
  if (Number.isFinite(numeric2) && numeric2 > 0) {
    return 1000000 / numeric2;
  } else {
    return null;
  }
}
export function iconButtonEffectLightVisualState(component, value = {}) {
  const text = String(component?.bindings?.entity?.entityId || "");
  const value2 = D(value.states?.get?.(text))?.attributes || {};
  if (!text.startsWith("light.")) {
    return {
      brightnessPercent: null,
      colorTemperatureKelvin: null,
      opacity: 1,
      filter: "none",
    };
  }
  const brightness = value2.brightness;
  const value3 =
    brightness == null || brightness === "" ? Number.NaN : Number(brightness);
  const brightnessPercent = Number.isFinite(value3)
    ? Math.max(0, Math.min(100, (value3 / 255) * 100))
    : null;
  const colorTemperatureKelvin = nt(value2);
  const value4 = component?.properties || {};
  const value5 = value4.effectBrightnessRealtime !== false;
  const value6 = value4.effectColorTemperatureRealtime !== false;
  const opacity = value5 ? tt(brightnessPercent) : 1;
  if (!value6 || !Number.isFinite(colorTemperatureKelvin)) {
    return {
      brightnessPercent: brightnessPercent,
      colorTemperatureKelvin: null,
      opacity: opacity,
      filter: "none",
    };
  }
  const count = Math.max(
    0,
    Math.min(
      1,
      (ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN - colorTemperatureKelvin) /
        1500,
    ),
  );
  const count2 = Math.max(
    0,
    Math.min(
      1,
      (colorTemperatureKelvin - ICON_BUTTON_EFFECT_BASE_TEMPERATURE_KELVIN) /
        3000,
    ),
  );
  const value7 = 1 + count * 0.95 - count2 * 0.55;
  return {
    brightnessPercent: brightnessPercent,
    colorTemperatureKelvin: colorTemperatureKelvin,
    opacity: opacity,
    filter: "saturate(" + value7.toFixed(3) + ")",
  };
}
function it(component, value) {
  if (value.editable && value.previewState === "on") {
    return true;
  }
  if (value.editable && value.previewState === "off") {
    return false;
  }
  const value2 = component.bindings?.entity?.entityId || "";
  return !!value2 && !!ae(component, value2, value.states?.get(value2), value);
}
function ot(component, value) {
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = D(value.states?.get(value2));
  const value4 = resolveClimateDeviceType(component, value3, value2);
  if (value.editable && value.previewState === "on") {
    if (value4 === "bath-heater") {
      return "heat";
    } else {
      return "cool";
    }
  } else if (value.editable && value.previewState === "off") {
    return "off";
  } else {
    return climatePresentationMode(value3, value4).toLowerCase();
  }
}
function de(component, value) {
  if (value.editable && value.previewState === "on") {
    return true;
  }
  if (value.editable && value.previewState === "off") {
    return false;
  }
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = D(value.states?.get(value2));
  return climateIsPoweredOn(
    value3,
    resolveClimateDeviceType(component, value3, value2),
  );
}
function st(component, value) {
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = D(value.states?.get(value2));
  const value4 = resolveClimateDeviceType(component, value3, value2);
  if (value.editable && value.previewState === "on") {
    return "cool";
  } else if (value.editable && value.previewState === "off") {
    return "off";
  } else {
    return climateEffectMode(value3, value4);
  }
}
function at(component, value) {
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = D(value.states?.get(value2));
  const value4 = ot(component, value);
  const value5 = resolveClimateDeviceType(component, value3, value2);
  const value6 = climateModeLabel(value4, value5);
  if (!de(component, value)) {
    return value6;
  }
  const climateCapabilities = normalizeClimateCapabilities(value3);
  if (climateCapabilities.targetTemperature !== null) {
    return value6 + " · " + climateCapabilities.targetTemperature + "°C";
  } else if (climateCapabilities.currentTemperature !== null) {
    return value6 + " · " + climateCapabilities.currentTemperature + "°C";
  } else {
    return value6;
  }
}
function rt(value = {}, value2 = "other") {
  const value3 = value.airflowMotion === "static" ? "static" : "dynamic";
  const value4 =
    value2 === "cool"
      ? S(value.airflowCoolColor, "#73c8ff")
      : value2 === "heat"
        ? S(value.airflowHeatColor, "#ff8a65")
        : S(value.airflowOtherColor, "#ffffff");
  const value5 = fn(value.airflowAngle, -360, 360, 7);
  const value6 = fn(value.airflowLength, 10, 300, 200) / 100;
  const value7 = fn(value.airflowFadePosition, 15, 100, 50) / 100;
  const value8 = fn(value.airflowSpread, 10, 300, 100);
  const value9 = Math.tanh(fn(value.airflowCurve, -200, 200, 20) / 140);
  const value10 = fn(value.airflowDensity, 20, 200, 60) / 100;
  const value11 = fn(value.airflowIrregularity, 0, 200, 50) / 100;
  const value12 = fn(value.airflowThickness, 5, 300, 40) / 100;
  const value13 = fn(value.airflowStrength, 0, 500, 200) / 100;
  const value14 = fn(value.airflowBlur, 0, 30, 6);
  const value15 = fn(value.airflowSpeed, 0.3, 12, 1);
  const value16 = 6;
  const value17 = value16 + (228 - value16) * value7;
  const value18 = value16 + (value17 - value16) * 0.63;
  const value19 = value18 + (value17 - value18) * 0.56;
  const value20 = Math.min(70, Math.sqrt(value8 / 100) * 44);
  const fn3 = (value28) => {
    const value29 = Math.sin(value28 * 12.9898) * 43758.5453;
    return value29 - Math.floor(value29);
  };
  const length = Math.max(3, Math.min(12, Math.round(value10 * 8)));
  const length2 = Math.max(2, Math.min(4, Math.round(1.5 + value10 * 1.2)));
  const value21 = Array.from(
    {
      length: length,
    },
    (_, value28) => {
      const value29 = length === 1 ? 0.5 : value28 / (length - 1);
      const value30 = (fn3(value28 + 3) - 0.5) * 10 * value11;
      return Math.max(
        10,
        Math.min(170, 90 + (value29 - 0.5) * value20 * 2 + value30),
      );
    },
  );
  const value22 = Math.min(...value21);
  const count = Math.max(...value21);
  const value23 = value9 >= 0 ? 168 - count : value22 - 12;
  const value24 = value9 * Math.max(0, value23);
  const value25 = value21.map((value28) => {
    const value29 = value28 + value24;
    const value30 = value28 + value24 * 0.42;
    return (
      "M" +
      value28.toFixed(2) +
      " " +
      value16 +
      "L" +
      value28.toFixed(2) +
      " " +
      value18.toFixed(2) +
      "C" +
      value28.toFixed(2) +
      " " +
      value19.toFixed(2) +
      " " +
      value30.toFixed(2) +
      " " +
      value17.toFixed(2) +
      " " +
      value29.toFixed(2) +
      " " +
      value17.toFixed(2)
    );
  });
  const value26 = value25.flatMap((value28, value29) =>
    Array.from(
      {
        length: length2,
      },
      (_, value30) => {
        const value31 = value29 * 41 + value30 * 67 + 11;
        const count2 = Math.max(
          8,
          Math.min(
            112,
            (34 + fn3(value31) * 42 * (0.7 + value11 * 0.3)) * value6,
          ),
        );
        const count3 = Math.max(
          0.2,
          Math.min(14, (1.5 + fn3(value31 + 7) * 2.9) * value12),
        );
        const value32 =
          value15 * (0.8 + fn3(value31 + 13) * 0.42 * (0.55 + value11 * 0.45));
        const value33 =
          (value30 / length2 +
            value29 * 0.067 +
            (fn3(value31 + 19) - 0.5) * 0.08 * value11 +
            1) %
          1;
        const value34 = Math.min(1, value13 * (0.62 + fn3(value31 + 29) * 0.5));
        const value35 =
          '<rect x="' +
          (-count2 / 2).toFixed(2) +
          '" y="' +
          (-count3 * 1.3).toFixed(2) +
          '" width="' +
          count2.toFixed(2) +
          '" height="' +
          (count3 * 2.6).toFixed(2) +
          '" rx="' +
          (count3 * 1.3).toFixed(2) +
          '" fill="url(#wisp)" filter="url(#glow)"/><rect x="' +
          (-count2 * 0.42).toFixed(2) +
          '" y="' +
          (-count3 * 0.22).toFixed(2) +
          '" width="' +
          (count2 * 0.82).toFixed(2) +
          '" height="' +
          (count3 * 0.44).toFixed(2) +
          '" rx="' +
          (count3 * 0.22).toFixed(2) +
          '" fill="url(#core)"/>';
        if (value3 === "static") {
          return (
            '<g opacity="' +
            value34.toFixed(3) +
            '">' +
            value35 +
            '<animateMotion path="' +
            value28 +
            '" dur="0.001s" keyPoints="' +
            value33.toFixed(4) +
            ";" +
            value33.toFixed(4) +
            '" keyTimes="0;1" fill="freeze" rotate="auto"/></g>'
          );
        } else {
          return (
            '<g opacity="0">' +
            value35 +
            '<animate attributeName="opacity" values="0;' +
            value34.toFixed(3) +
            ";" +
            value34.toFixed(3) +
            ';0" keyTimes="0;.06;.78;1" dur="' +
            value32.toFixed(3) +
            's" begin="' +
            (-value32 * value33).toFixed(3) +
            's" repeatCount="indefinite"/><animateMotion path="' +
            value28 +
            '" dur="' +
            value32.toFixed(3) +
            's" begin="' +
            (-value32 * value33).toFixed(3) +
            's" rotate="auto" repeatCount="indefinite"/></g>'
          );
        }
      },
    ),
  );
  const value27 =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 240" preserveAspectRatio="none"><defs><linearGradient id="bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
    value4 +
    '" stop-opacity="0"/><stop offset=".22" stop-color="' +
    value4 +
    '" stop-opacity=".25"/><stop offset=".58" stop-color="' +
    value4 +
    '" stop-opacity=".8"/><stop offset="1" stop-color="' +
    value4 +
    '" stop-opacity="0"/></linearGradient><linearGradient id="wisp"><stop offset="0" stop-color="' +
    value4 +
    '" stop-opacity="0"/><stop offset=".2" stop-color="' +
    value4 +
    '" stop-opacity=".18"/><stop offset=".52" stop-color="' +
    value4 +
    '"/><stop offset=".78" stop-color="' +
    value4 +
    '" stop-opacity=".52"/><stop offset="1" stop-color="' +
    value4 +
    '" stop-opacity="0"/></linearGradient><linearGradient id="core"><stop offset="0" stop-color="' +
    value4 +
    '" stop-opacity="0"/><stop offset=".34" stop-color="' +
    value4 +
    '" stop-opacity=".12"/><stop offset=".58" stop-color="' +
    value4 +
    '"/><stop offset=".82" stop-color="' +
    value4 +
    '" stop-opacity=".28"/><stop offset="1" stop-color="' +
    value4 +
    '" stop-opacity="0"/></linearGradient><filter id="glow" x="-120%" y="-240%" width="340%" height="580%"><feGaussianBlur stdDeviation="' +
    Math.max(0.2, value14 * 1.35) +
    '"/><feComponentTransfer><feFuncA type="linear" slope="' +
    (value13 <= 1 ? 1 : 1 + (value13 - 1) * 0.9).toFixed(3) +
    '"/></feComponentTransfer></filter></defs><g transform="rotate(' +
    value5 +
    ' 90 120)">' +
    value25
      .map(
        (value28) =>
          '<path d="' +
          value28 +
          '" fill="none" stroke="url(#bed)" stroke-width="1.2" stroke-linecap="round" opacity="' +
          Math.min(1, value13 * 0.075).toFixed(3) +
          '"/>',
      )
      .join("") +
    value26.join("") +
    "</g></svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(value27);
}
export function renderAirConditionerAirflowLayer(component, value) {
  const value2 = component.properties || {};
  if (value2.airflowVisible === false || !de(component, value)) {
    return null;
  }
  const value3 = document.createElement("div");
  value3.className = "hb-air-conditioner-airflow-layer";
  const value4 = document.createElement("img");
  value4.src = rt(value2, st(component, value));
  value4.alt = "";
  value4.draggable = false;
  value3.append(value4);
  return value3;
}
function fn2(value, value2, value3 = {}) {
  const value4 = document.createElementNS("http://www.w3.org/2000/svg", value2);
  for (const [value5, value6] of Object.entries(value3)) {
    value4.setAttribute(value5, String(value6));
  }
  value.append(value4);
  return value4;
}
function Te(value, value2, value3, value4 = 24) {
  const value5 = (
    Array.isArray(value.history?.get(value2)?.points)
      ? value.history.get(value2).points
      : []
  )
    .map((element) => ({
      timestamp: Date.parse(element.timestamp),
      value: Number(element.value),
    }))
    .filter(
      (element) =>
        Number.isFinite(element.timestamp) && Number.isFinite(element.value),
    );
  const timestamp = Date.now();
  if (Number.isFinite(value3)) {
    value5.push({
      timestamp: timestamp,
      value: value3,
    });
  }
  value5.sort((value12, value13) => value12.timestamp - value13.timestamp);
  const value6 = value5.filter(
    (element, value12) =>
      value12 === 0 ||
      element.timestamp !== value5[value12 - 1].timestamp ||
      element.value !== value5[value12 - 1].value,
  );
  if (!value6.length) {
    return [];
  }
  const rounded = Math.round(fn(value4, 1, 168, 24));
  const value7 = 3600000;
  const value8 = timestamp - rounded * value7;
  const value9 = [];
  let value10 = 0;
  let value11 = null;
  for (let value12 = 0; value12 <= rounded; value12 += 1) {
    const timestamp2 =
      value12 === rounded ? timestamp : value8 + value12 * value7;
    while (value10 < value6.length && value6[value10].timestamp <= timestamp2) {
      value11 = value6[value10];
      value10 += 1;
    }
    const element = value11 || value6[value10] || value6[0];
    if (element) {
      value9.push({
        timestamp: timestamp2,
        value: element.value,
      });
    }
  }
  return value9;
}
function ke(value, value2 = true) {
  const value3 = value2
    ? {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    : {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
  return new Intl.DateTimeFormat("zh-CN", value3)
    .format(new Date(value))
    .replace(/\//g, "-");
}
function Le(
  element,
  element2,
  value,
  value2,
  fn3,
  value3 = "auto",
  value4 = {
    start: 0,
    end: 1,
  },
  value5 = document.body,
) {
  const element3 = document.createElement("span");
  element3.className = "hb-line-chart-tooltip";
  if (value5 === element2) {
    element3.classList.add("hb-line-chart-details-tooltip");
  }
  element3.hidden = true;
  const value6 = document.createElement("i");
  value6.className = "hb-line-chart-hover-guide";
  value6.hidden = true;
  const value7 = document.createElement("i");
  value7.className = "hb-line-chart-hover-dot";
  value7.hidden = true;
  element2.append(value6, value7);
  value5.append(element3);
  const value8 = (value10) => {
    const element4 =
      value5 === element2
        ? element2.closest(".hb-renderer-runtime-dialog-layer")
        : null;
    if (element4 && element3.parentElement !== element4) {
      element4.append(element3);
    }
    const value11 = element.getBoundingClientRect();
    if (!value11.width) {
      return;
    }
    const value12 = (value10.clientX - value11.left) / value11.width;
    const value13 = fn(
      (value12 - value4.start) / Math.max(0.001, value4.end - value4.start),
      0,
      1,
      0,
    );
    const value14 =
      value.firstTime + value13 * (value.lastTime - value.firstTime);
    const element5 = value.points.reduce((value30, value31) =>
      Math.abs(value31.timestamp - value14) <
      Math.abs(value30.timestamp - value14)
        ? value31
        : value30,
    );
    const value15 = fn3(element5);
    const value16 = element2.getBoundingClientRect();
    const value17 =
      element.getBoundingClientRect().left -
      value16.left +
      (value15.x / 100) * value11.width;
    const value18 =
      element.getBoundingClientRect().top -
      value16.top +
      (value15.y / 100) * value11.height;
    const value19 = value16.left + value17;
    const value20 = value16.top + value18;
    const value21 = (value17 / Math.max(1, value16.width)) * 100;
    const value22 = (value18 / Math.max(1, value16.height)) * 100;
    const value23 = element3.parentElement === element2;
    const value24 = element4 && element3.parentElement === element4;
    const value25 = value24 ? element4.getBoundingClientRect() : null;
    const value26 = value24 ? value19 - value25.left : value19;
    const value27 = value24 ? value20 - value25.top : value20;
    element3.textContent =
      ke(element5.timestamp) +
      "  " +
      formatLineChartValue(element5.value, value3) +
      value2;
    element3.style.position = value23 || value24 ? "absolute" : "fixed";
    element3.style.left = (value23 ? value17 : value26) + "px";
    element3.style.top = (value23 ? value18 : value27) + "px";
    const value28 = value23 ? value17 : value26;
    const value29 = value23
      ? value16.width
      : value24
        ? value25.width
        : window.innerWidth;
    element3.style.transform =
      value28 < 110
        ? "translate(0, calc(-100% - 9px))"
        : value28 > value29 - 110
          ? "translate(-100%, calc(-100% - 9px))"
          : "translate(-50%, calc(-100% - 9px))";
    value6.style.left = value21 + "%";
    value7.style.left = value21 + "%";
    value7.style.top = value22 + "%";
    element3.hidden = false;
    value6.hidden = false;
    value7.hidden = false;
  };
  const value9 = () => {
    element3.hidden = true;
    value6.hidden = true;
    value7.hidden = true;
  };
  element.addEventListener("pointermove", value8);
  element.addEventListener("pointerleave", value9);
  return () => {
    element.removeEventListener("pointermove", value8);
    element.removeEventListener("pointerleave", value9);
    element3.remove();
  };
}
function ct(value, value2, value3, value4, value5, value6) {
  const count = Math.max(1, Number(value.position?.width || 236));
  const count2 = Math.max(1, Number(value.position?.height || 100));
  const count3 = Math.max(8, (count2 * 236) / count);
  const value7 = fn(value2.frameWidth, 0, 20, 2);
  const count4 = Math.max(0.5, value7 / 2 + 0.5);
  const count5 = Math.max(1, 236 - count4 * 2);
  const count6 = Math.max(1, count3 - count4 * 2);
  const value8 = Math.min(count5, count6) * fn(value2.radius, 0, 0.5, 0.5);
  const value9 = Math.min(1, value5 * 0.38);
  const count7 = Math.max(0, Math.min(count5, count6) * 0.42 * value6);
  const count8 = Math.max(0, Math.min(count5, count6) * 0.095 * value6);
  const value10 = 118;
  const value11 = count3 / 2;
  const value12 = S(value2.frameColor, "#d9e0e6");
  const value13 = S(value2.glowColor, "#f2f6fa");
  const value14 = fn(value2.frameAngle, 0, 360, 45);
  const value15 = fn(value2.glowAngle, 0, 360, 45);
  const value16 = value3 ? 0.98 : 0.48;
  const fn3 = (value18) =>
    Math.max(0, Math.min(1, (value18 * value4) / value16));
  const value17 = "navigation-" + randomUuid();
  const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  element.classList.add("hb-navigation-effects");
  element.setAttribute("viewBox", "0 0 236 " + count3);
  element.setAttribute("preserveAspectRatio", "none");
  element.setAttribute("aria-hidden", "true");
  element.innerHTML =
    '\n    <defs>\n      <linearGradient id="navigation-edge-' +
    value17 +
    '" gradientUnits="userSpaceOnUse" x1="0" y1="' +
    value11 +
    '" x2="236" y2="' +
    value11 +
    '" gradientTransform="rotate(' +
    value14 +
    " " +
    value10 +
    " " +
    value11 +
    ')">\n        <stop offset="0" stop-color="' +
    value12 +
    '" stop-opacity="' +
    fn3(value3 ? 0.98 : 0.48) +
    '"/>\n        <stop offset=".48" stop-color="' +
    value12 +
    '" stop-opacity="' +
    fn3(value3 ? 0.58 : 0.22) +
    '"/>\n        <stop offset="1" stop-color="' +
    value12 +
    '" stop-opacity="' +
    fn3(value3 ? 0.82 : 0.36) +
    '"/>\n      </linearGradient>\n      <linearGradient id="navigation-light-' +
    value17 +
    '" gradientUnits="userSpaceOnUse" x1="0" y1="' +
    value11 +
    '" x2="236" y2="' +
    value11 +
    '" gradientTransform="rotate(' +
    value15 +
    " " +
    value10 +
    " " +
    value11 +
    ')">\n        <stop offset="0" stop-color="' +
    value13 +
    '" stop-opacity="' +
    value9 +
    '"/>\n        <stop offset=".45" stop-color="' +
    value13 +
    '" stop-opacity="' +
    value9 * 0.35 +
    '"/>\n        <stop offset="1" stop-color="' +
    value13 +
    '" stop-opacity="' +
    value9 * 0.72 +
    '"/>\n      </linearGradient>\n      <clipPath id="navigation-shape-' +
    value17 +
    '"><rect x="' +
    count4 +
    '" y="' +
    count4 +
    '" width="' +
    count5 +
    '" height="' +
    count6 +
    '" rx="' +
    value8 +
    '"/></clipPath>\n      <filter id="navigation-soft-light-' +
    value17 +
    '" x="-35%" y="-75%" width="170%" height="250%"><feGaussianBlur stdDeviation="' +
    count8 +
    '"/></filter>\n    </defs>\n    ' +
    (value2.glowVisible !== false && count7 > 0 && value9 > 0
      ? '<g clip-path="url(#navigation-shape-' +
        value17 +
        ')"><rect x="' +
        count4 +
        '" y="' +
        count4 +
        '" width="' +
        count5 +
        '" height="' +
        count6 +
        '" rx="' +
        value8 +
        '" fill="none" stroke="url(#navigation-light-' +
        value17 +
        ')" stroke-width="' +
        count7 +
        '" filter="url(#navigation-soft-light-' +
        value17 +
        ')"/></g>'
      : "") +
    "\n    " +
    (value2.frameVisible !== false
      ? '<rect x="' +
        count4 +
        '" y="' +
        count4 +
        '" width="' +
        count5 +
        '" height="' +
        count6 +
        '" rx="' +
        value8 +
        '" fill="none" stroke="url(#navigation-edge-' +
        value17 +
        ')" stroke-width="' +
        value7 +
        '"/>'
      : "") +
    "\n  ";
  return element;
}
export function navigationButtonIsActive({
  targetPage: value = "",
  currentPagePath: value2 = "",
  entityId: value3 = "",
  entityActive: value4 = false,
  previewState: value5 = "auto",
} = {}) {
  if (value5 === "on") {
    return true;
  } else if (value5 === "off") {
    return false;
  } else if (value) {
    return value === value2;
  } else {
    return !!value3 && !!value4;
  }
}
registerComponent("image", {
  render(component) {
    const value = component.properties || {};
    const value2 = staticAssetImageSource(value.assetId);
    if (!value2) {
      const element = document.createElement("div");
      element.className = "hb-unknown-component";
      element.textContent = "尚未选择图片";
      return element;
    }
    const value3 = document.createElement("img");
    value3.className = "hb-image-component";
    value3.src = value2;
    value3.alt = value.alt || value.label || "图片";
    value3.draggable = false;
    value3.style.objectFit = "contain";
    value3.style.opacity = String(
      Math.max(0, Math.min(1, Number(value.opacity ?? 1))),
    );
    return value3;
  },
});
function lt(value, value2) {
  if (!value) {
    return false;
  }
  const value3 = value2?.states?.get?.(String(value));
  const value4 = String(
    value3?.newState?.state ?? value3?.state ?? "",
  ).toLowerCase();
  return ["on", "true", "1", "open", "opening", "active", "playing"].includes(
    value4,
  );
}
registerComponent("floorplan-auto-diagram", {
  render(component, value = {}) {
    const value2 = component.properties || {};
    const value3 = document.createElement("div");
    value3.className = "hb-floorplan-auto-diagram";
    value3.setAttribute(
      "aria-label",
      value2.label || value2.instanceName || "户型图自动导图",
    );
    if (
      value.editable &&
      value2.previewReady === true &&
      (value2.generated !== true || value2.previewing === true)
    ) {
      const value8 = document.createElement("iframe");
      value8.className =
        "hb-floorplan-auto-diagram-preview is-" +
        (value2.interactionMode === "view" ? "view" : "position") +
        "-mode";
      value8.title = "3D户型图构图预览";
      const value9 = value.document?.canvas || {};
      const value10 = component.position || {};
      const value11 = value2.exportFolder || "自动导图-" + component.id;
      const value12 = new URLSearchParams({
        "auto-diagram-component": component.id,
        "auto-diagram-embed": "1",
        "dashboard-width": String(Number(value9.width || 2778)),
        "dashboard-height": String(Number(value9.height || 1940)),
        "component-width": String(
          Math.max(1, Math.round(Number(value10.width || 100))),
        ),
        "component-height": String(
          Math.max(1, Math.round(Number(value10.height || 100))),
        ),
        "export-folder": value11,
      });
      if (value2.floorSelection) {
        value12.set("floor-selection", String(value2.floorSelection));
      }
      value8.src = "/3d-studio?" + value12;
      value8.setAttribute("allow", "fullscreen");
      value3.append(value8);
      const element = document.createElement("div");
      element.className = "hb-floorplan-auto-diagram-loading";
      element.innerHTML =
        '<i aria-hidden="true"></i><strong>正在加载3D户型…</strong>';
      value3.append(element);
      const element2 = document.createElement("div");
      element2.className = "hb-floorplan-auto-diagram-preview-hint";
      element2.textContent =
        value2.interactionMode === "view"
          ? "拖动旋转 · 右键平移 · 滚轮缩放"
          : "拖动控件调整位置，右下角调整大小";
      value3.append(element2);
      return value3;
    }
    const value4 = document.createElement("img");
    value4.className = "hb-floorplan-auto-diagram-base";
    value4.alt = "户型图";
    value4.draggable = false;
    const value5 = ne(value2.baseAssetId || value2.floorPlanAssetId || "");
    if (value5) {
      value4.src = value5;
    } else {
      value4.className += " is-empty";
      value4.alt = "";
    }
    value3.append(value4);
    const value6 = [];
    const value7 = [];
    const fn3 = () => {
      for (const value8 of value6) {
        const value9 = lt(value8.entityId, value);
        value8.image.classList.toggle("is-active", value9 || value.editable);
        value8.button.classList.toggle("is-active", value9);
        value8.button.setAttribute("aria-pressed", String(value9));
      }
    };
    const list = Array.isArray(value2.lightLayers) ? value2.lightLayers : [];
    for (const value8 of list) {
      const image = document.createElement("img");
      image.className = "hb-floorplan-auto-diagram-layer";
      image.alt = "";
      image.draggable = false;
      const value9 = ne(value8.assetId || "");
      if (value9) {
        image.src = value9;
      }
      const value10 = component.bindings?.["lightGroup:" + value8.id] || {};
      const entityId = String(value10.entityId || value8.entityId || "");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hb-floorplan-auto-diagram-button";
      button.textContent = value8.name || value8.note || "灯组";
      if (value8.note) {
        button.title = value8.note;
      }
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (
          !!entityId &&
          !value.editable &&
          typeof value.callEntityService == "function"
        ) {
          button.disabled = true;
          try {
            await value.callEntityService("homeassistant", "toggle", entityId);
          } catch (error) {
            value.onError?.(error);
          } finally {
            button.disabled = false;
          }
        }
      });
      value3.append(image, button);
      const value11 = {
        image: image,
        button: button,
        entityId: entityId,
      };
      value6.push(value11);
      value7.push(button);
      if (entityId && typeof value.registerRuntimeStateHandler == "function") {
        value.registerRuntimeStateHandler(entityId, fn3);
      }
    }
    if (!value5) {
      const element = document.createElement("div");
      element.className = "hb-floorplan-auto-diagram-empty";
      element.textContent = "请先完成户型和灯组，再生成导图";
      value3.append(element);
    }
    value3.syncFloorplanAutoDiagramState = fn3;
    fn3();
    return value3;
  },
});
export function renderIconButtonEffectLayer(component, value) {
  const value2 = component.properties || {};
  const value3 = value.editable
    ? null
    : index3.get(String(value2.effectAssetId || ""));
  const value4 = value3?.url || ne(value2.effectAssetId);
  if (!value4 || value2.effectVisible === false) {
    return null;
  }
  const value5 = Pe(component, value);
  const value6 = iconButtonEffectLightVisualState(component, value);
  const value7 = iconButtonEffectLightVisualAwaiting(component, value);
  const value8 = document.createElement("div");
  value8.className =
    "hb-icon-button-effect-layer" +
    (value5 ? " active" : "") +
    (value7 ? " awaiting-light-visual" : "");
  value8.style.setProperty(
    "--hb-effect-image-opacity",
    String(fn(value2.effectOpacity, 0, 1, 1) * value6.opacity),
  );
  const value9 = fn(value2.effectFadeDuration, 0, 3, 0.52);
  value8.style.setProperty("--hb-effect-fade-duration", value9 + "s");
  value8.style.setProperty(
    "--hb-effect-visual-transition-duration",
    Math.max(0.45, value9) + "s",
  );
  const value10 = document.createElement("img");
  if (value3) {
    value10.dataset.effectSource = value4;
  } else {
    value10.src = value4;
  }
  value10.alt = "";
  value10.draggable = false;
  value10.decoding = "async";
  value10.style.objectFit = "contain";
  value10.style.mixBlendMode = "normal";
  value10.style.filter = value6.filter;
  if (value3) {
    value10.dataset.effectOriginalWidth = String(value3.originalWidth);
    value10.dataset.effectOriginalHeight = String(value3.originalHeight);
    value10.dataset.effectCropX = String(value3.cropX);
    value10.dataset.effectCropY = String(value3.cropY);
    value10.dataset.effectCropWidth = String(value3.width);
    value10.dataset.effectCropHeight = String(value3.height);
  }
  value8.append(value10);
  return value8;
}
registerComponent("icon-button-effect", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = Pe(component, value);
    const value4 = value?.isIconVisible?.(component.id) !== false;
    const value5 = document.createElement("div");
    value5.className = "hb-icon-button-effect" + (value3 ? " active" : "");
    value5.hidden = value2.buttonVisible === false;
    value5.style.opacity = value4 ? "1" : "0";
    value5.style.transition = "opacity .24s ease";
    value5.style.setProperty(
      "--effect-button-color",
      S(
        value3 ? value2.buttonOnColor : value2.buttonOffColor,
        value3 ? "#1f91b8" : "#17242d",
      ),
    );
    value5.style.setProperty(
      "--effect-button-opacity",
      fn(value2.buttonOpacity, 0, 1, 0.92) * 100 + "%",
    );
    value5.style.setProperty(
      "--effect-frame-color",
      S(value2.frameColor, "#dcebf2"),
    );
    value5.style.setProperty(
      "--effect-frame-width",
      fn(value2.frameWidth, 0, 20, 1.5) + "px",
    );
    value5.style.setProperty(
      "--effect-frame-opacity",
      fn(value2.frameOpacity, 0, 1, 0.72) * 100 + "%",
    );
    value5.style.setProperty(
      "--effect-radius",
      fn(value2.radius, 0, 50, 50) + "%",
    );
    value5.style.setProperty(
      "--effect-glow-color",
      S(value2.glowColor, "#43c8f0"),
    );
    const value6 = fn(
      value3 ? value2.glowOnStrength : value2.glowOffStrength,
      0,
      3,
      value3 ? 1 : 0,
    );
    value5.style.setProperty("--effect-glow-size", value6 * 18 + "px");
    value5.style.setProperty("--effect-glow-inset-size", value6 * 13 + "px");
    value5.style.setProperty(
      "--effect-glow-opacity",
      Math.min(100, value6 * 38) + "%",
    );
    value5.style.setProperty(
      "--effect-glow-inset-opacity",
      Math.min(100, value6 * 30) + "%",
    );
    const value7 = K(value2.icon || "mdi:lightbulb-outline");
    if (value7) {
      const value8 = document.createElement("i");
      value8.className = "hb-icon-button-effect-icon";
      value8.style.transition = "opacity .24s ease";
      value8.style.opacity = value4 ? "1" : "0";
      value8.style.backgroundColor = S(
        value3 ? value2.iconOnColor : value2.iconOffColor,
        value3 ? "#ffffff" : "#9aa5ad",
      );
      value8.style.width = fn(value2.iconSize, 1, 100, 44) + "%";
      value8.style.height = fn(value2.iconSize, 1, 100, 44) + "%";
      value8.style.maskImage = 'url("' + value7 + '")';
      value8.style.webkitMaskImage = 'url("' + value7 + '")';
      value5.append(value8);
    }
    return value5;
  },
});
registerComponent("title-button", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = value2.hiddenContentClickable === true;
    const count = Math.max(20, Number(component.position?.width || 500));
    const count2 = Math.max(20, Number(component.position?.height || 122));
    const { height: value4 } = componentContentUnitsPx(component, value);
    const value5 = document.createElement("div");
    value5.className = "hb-title-button";
    value5.style.setProperty(
      "--title-frame-color",
      S(value2.frameColor, "#60636a"),
    );
    value5.style.setProperty(
      "--title-frame-width",
      fn(value2.frameWidth, 0, 12, 1.5) + "px",
    );
    value5.style.setProperty(
      "--title-frame-offset-x",
      fn(value2.frameOffsetX, -100, 100, 0) + "%",
    );
    value5.style.setProperty(
      "--title-frame-offset-y",
      fn(value2.frameOffsetY, -100, 100, 0) + "%",
    );
    value5.style.setProperty(
      "--title-main-size",
      fn(value2.mainSize, 8, 200, 34) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-secondary-size",
      fn(value2.secondarySize, 6, 100, 12) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-main-spacing",
      fn(value2.mainSpacing, -20, 100, 1) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-secondary-spacing",
      fn(value2.secondarySpacing, -20, 100, 2) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-secondary-line-gap",
      fn(value2.secondaryLineGap, 0, 100, 2) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-main-left",
      fn(value2.mainTextLeft, -100, 200, 5.5) + "%",
    );
    value5.style.setProperty(
      "--title-main-top",
      fn(value2.mainTextTop, -100, 200, 45) + "%",
    );
    value5.style.setProperty(
      "--title-secondary-left",
      fn(value2.secondaryTextLeft, -100, 200, 54) + "%",
    );
    value5.style.setProperty(
      "--title-secondary-top",
      fn(value2.secondaryTextTop, -100, 200, 43) + "%",
    );
    value5.style.setProperty(
      "--title-icon-size",
      fn(value2.iconSize, 1, 100, 30) * value4 + "px",
    );
    value5.style.setProperty(
      "--title-icon-left",
      fn(value2.iconLeft, -100, 200, 50) + "%",
    );
    value5.style.setProperty(
      "--title-icon-top",
      fn(value2.iconTop, -100, 200, 45) + "%",
    );
    value5.style.setProperty(
      "--title-marker-left",
      fn(value2.markerLeft, -100, 200, 1.8) + "%",
    );
    value5.style.setProperty(
      "--title-marker-top",
      fn(value2.markerTop, -100, 200, 84) + "%",
    );
    if (value2.frameVisible !== false || value3) {
      const value6 = fn(value2.frameSize, 10, 300, 100) / 100;
      const value7 = count2 * 0.45 * value6;
      const value8 = (count * fn(value2.frameOffsetX, -100, 100, 0)) / 100;
      const value9 = (count2 * fn(value2.frameOffsetY, -100, 100, 0)) / 100;
      const value10 = (count * fn(value2.frameSpacing, 0, 300, 100)) / 200;
      const value11 = count / 2 + value8;
      const value12 = count2 / 2 + value9;
      const value13 = value12 - value7 / 2;
      const value14 = value12 + value7 / 2;
      const value15 = count2 * 0.12;
      const value16 = fn(value2.frameWidth, 0, 12, 1.5) / 2;
      const value17 = value11 - value10 + value16;
      const value18 = value11 + value10 - value16;
      const value19 = fn2(value5, "svg", {
        viewBox: "0 0 " + count + " " + count2,
        preserveAspectRatio: "none",
        "aria-hidden": "true",
      });
      value19.setAttribute("class", "hb-title-button-brackets");
      if (value2.frameVisible === false) {
        value19.style.visibility = "hidden";
      }
      const value20 = {
        fill: "none",
        stroke: S(value2.frameColor, "#60636a"),
        "stroke-width": fn(value2.frameWidth, 0, 12, 1.5),
        "stroke-opacity": 1,
        "stroke-linecap": "butt",
        "stroke-linejoin": "miter",
        "vector-effect": "non-scaling-stroke",
      };
      fn2(value19, "path", {
        ...value20,
        d:
          "M " +
          (value17 + value15) +
          " " +
          value13 +
          " H " +
          value17 +
          " V " +
          value14 +
          " H " +
          (value17 + value15),
      });
      fn2(value19, "path", {
        ...value20,
        d:
          "M " +
          (value18 - value15) +
          " " +
          value13 +
          " H " +
          value18 +
          " V " +
          value14 +
          " H " +
          (value18 - value15),
      });
    }
    if (value2.mainTextVisible !== false || value3) {
      const element = document.createElement("strong");
      element.className = "hb-title-button-main";
      element.textContent = String(value2.mainText || "客厅");
      element.style.color = S(value2.mainColor, "#b9bbc0");
      if (value2.mainTextVisible === false) {
        element.style.visibility = "hidden";
      }
      B(element, value2.mainWeight, fn(value2.mainSize, 8, 200, 34));
      value5.append(element);
    }
    if (value2.secondaryTextVisible !== false || value3) {
      const value6 = document.createElement("small");
      value6.className = "hb-title-button-secondary";
      String(value2.secondaryText || "LIVING ROOM\nLIGHTING")
        .split(/\r?\n/)
        .slice(0, 2)
        .forEach((value7) => {
          const element = document.createElement("span");
          element.textContent = value7;
          value6.append(element);
        });
      value6.style.color = S(value2.secondaryColor, "#70737b");
      if (value2.secondaryTextVisible === false) {
        value6.style.visibility = "hidden";
      }
      B(value6, value2.secondaryWeight, fn(value2.secondarySize, 6, 100, 12));
      value5.append(value6);
    }
    if (value2.iconVisible !== false || value3) {
      const value6 = K(value2.icon || "");
      if (value6) {
        const value7 = document.createElement("i");
        value7.className = "hb-title-button-icon";
        if (value2.iconVisible === false) {
          value7.style.visibility = "hidden";
        }
        value7.style.backgroundColor = S(value2.iconColor, "#b9bbc0");
        value7.style.maskImage = 'url("' + value6 + '")';
        value7.style.webkitMaskImage = 'url("' + value6 + '")';
        value5.append(value7);
      }
    }
    if (value2.markerVisible !== false || value3) {
      const value6 = document.createElement("i");
      value6.className = "hb-title-button-marker";
      if (value2.markerVisible === false) {
        value6.style.visibility = "hidden";
      }
      value6.style.color = S(value2.markerColor, "#f2a20d");
      value6.style.borderTopColor = S(value2.markerColor, "#f2a20d");
      value6.style.setProperty(
        "--title-marker-size",
        fn(value2.markerSize, 2, 60, 10) * value4 + "px",
      );
      value5.append(value6);
    }
    return value5;
  },
});
registerComponent("light-statistics", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = lightStatisticsSummary(
      value2.entityIds,
      value.states,
      value.entityMetadata,
    );
    const { width: value4, height: value5 } = componentContentUnitsPx(
      component,
      value,
    );
    const element = document.createElement("div");
    element.className = "hb-light-statistics";
    element.classList.toggle("active", value3.on > 0);
    element.dataset.total = String(value3.total);
    element.dataset.on = String(value3.on);
    element.dataset.off = String(value3.off);
    element.dataset.abnormal = String(value3.abnormal);
    element.style.setProperty(
      "--light-statistics-icon-size",
      fn(value2.iconSize, 1, 100, 42) * value5 + "px",
    );
    element.style.setProperty(
      "--light-statistics-title-size",
      fn(value2.titleSize, 8, 200, 32) * value5 + "px",
    );
    element.style.setProperty(
      "--light-statistics-title-spacing",
      fn(value2.titleSpacing, -20, 100, 1.2) * value5 + "px",
    );
    element.style.setProperty(
      "--light-statistics-count-size",
      fn(value2.countSize, 8, 200, 34) * value5 + "px",
    );
    element.style.setProperty(
      "--light-statistics-count-spacing",
      fn(value2.countSpacing, -20, 100, 0) * value5 + "px",
    );
    element.style.setProperty(
      "--light-statistics-icon-gap",
      fn(value2.iconGap, 0, 40, 4.5) * value4 + "px",
    );
    element.style.setProperty(
      "--light-statistics-count-gap",
      fn(value2.countGap, 0, 40, 4.5) * value4 + "px",
    );
    element.style.setProperty(
      "--light-statistics-icon-color",
      S(value2.iconColor, "#8b9298"),
    );
    element.style.setProperty(
      "--light-statistics-icon-active-color",
      S(value2.iconActiveColor, "#f2a20d"),
    );
    element.style.setProperty(
      "--light-statistics-title-color",
      S(value2.titleColor, "#b9bbc0"),
    );
    element.style.setProperty(
      "--light-statistics-count-color",
      S(value2.countColor, "#b9bbc0"),
    );
    element.style.setProperty(
      "--light-statistics-count-active-color",
      S(value2.countActiveColor, "#f2a20d"),
    );
    const value6 = Object.prototype.hasOwnProperty.call(value2, "icon")
      ? String(value2.icon || "")
      : "mdi:lightbulb-group-outline";
    const value7 = K(value6);
    const value8 = value2.iconVisible !== false && !!value7;
    const value9 = value2.titleVisible !== false;
    const value10 = value2.countVisible !== false;
    element.classList.toggle("has-icon", value8);
    element.classList.toggle("has-title", value9);
    element.classList.toggle("has-count", value10);
    if (value8) {
      const value11 = document.createElement("i");
      value11.className = "hb-light-statistics-icon";
      value11.style.maskImage = 'url("' + value7 + '")';
      value11.style.webkitMaskImage = 'url("' + value7 + '")';
      element.append(value11);
    }
    if (value9) {
      const element2 = document.createElement("strong");
      element2.className = "hb-light-statistics-title";
      element2.textContent = String(value2.title || "数量");
      B(element2, value2.titleWeight, fn(value2.titleSize, 8, 200, 32));
      element.append(element2);
    }
    if (value10) {
      const value11 = document.createElement("span");
      value11.className = "hb-light-statistics-count";
      const element2 = document.createElement("b");
      element2.textContent = value3.total ? String(value3.on) : "--";
      B(element2, value2.countWeight, fn(value2.countSize, 8, 200, 34));
      value11.append(element2);
      if (value3.total) {
        const element3 = document.createElement("em");
        element3.textContent = " / " + value3.total;
        value11.append(element3);
      }
      element.append(value11);
    }
    return element;
  },
});
const Ae = {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.type === "device-button";
    const value4 = component.bindings?.entity?.entityId || "";
    const value5 = value.states?.get(value4);
    const value6 = D(value5);
    const value7 = it(component, value);
    const x2 = Math.max(20, Number(component.position?.width || 144));
    const count = Math.max(20, Number(component.position?.height || 150));
    const { height: value8 } = componentContentUnitsPx(component, value);
    const value9 =
      (Math.min(x2, count) * fn(value2.cutCorner, 0, 50, 20)) / 100;
    const value10 = fn(value2.frameWidth, 0, 12, 1);
    const value11 = fn(value2.frameAngle, 0, 360, 45);
    const value12 = fn(
      value7 ? value2.frameOnOpacity : value2.frameOffOpacity,
      0,
      1,
      value7 ? 1 : 0.8,
    );
    const value13 = S(value2.softLightColor, "#ffffff");
    const value14 = fn(value2.softLightStrength, 0, 5, 1);
    const value15 = fn(value2.softLightSize, 0, 3, 1);
    const value16 = fn(value2.softLightAngle, 0, 360, 45);
    const value17 = S(value2.glowColor, "#ffffff");
    const value18 = fn(value2.glowStrength, 0, 5, 1);
    const value19 = fn(value2.glowSize, 0, 3, 1);
    const value20 = fn(value2.glowAngle, 0, 360, 220);
    const value21 = x2 / 2;
    const y1 = count / 2;
    const value22 = (value20 * Math.PI) / 180;
    const cx = value21 + Math.cos(value22) * x2 * 0.16;
    const cy = y1 + Math.sin(value22) * count * 0.18;
    const value23 =
      (value.renderNamespace || "renderer") +
      "-icon-button-" +
      String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
    const value24 = document.createElement("div");
    value24.className = "hb-icon-button" + (value7 ? " active" : "");
    value24.style.setProperty(
      "--icon-button-main-left",
      fn(value2.mainTextLeft, -100, 200, 9) + "%",
    );
    value24.style.setProperty(
      "--icon-button-main-top",
      fn(value2.mainTextTop, -100, 200, 78) + "%",
    );
    value24.style.setProperty(
      "--icon-button-secondary-left",
      fn(value2.secondaryTextLeft, -100, 200, 9) + "%",
    );
    value24.style.setProperty(
      "--icon-button-secondary-top",
      fn(value2.secondaryTextTop, -100, 200, 91) + "%",
    );
    value24.style.setProperty(
      "--icon-button-icon-left",
      fn(value2.iconLeft, -100, 200, 50) + "%",
    );
    value24.style.setProperty(
      "--icon-button-icon-top",
      fn(value2.iconTop, -100, 200, 34) + "%",
    );
    value24.style.setProperty(
      "--icon-button-icon-glow-size",
      value8 * 9 + "px",
    );
    value24.style.setProperty(
      "--device-button-icon-glow-size",
      value8 * 5 + "px",
    );
    value24.style.setProperty(
      "--device-button-icon-active-glow-size",
      value8 * 7 + "px",
    );
    value24.style.setProperty(
      "--hb-on-fill-fade-duration",
      fn(value2.onFillFadeDuration, 0, 3, 0.3) + "s",
    );
    if (!value3) {
      const value30 = fn2(value24, "svg", {
        viewBox: "0 0 " + x2 + " " + count,
        preserveAspectRatio: "none",
        "aria-hidden": "true",
      });
      const value31 = fn2(value30, "defs");
      const points =
        "0,0 " +
        (x2 - value9) +
        ",0 " +
        x2 +
        "," +
        value9 +
        " " +
        x2 +
        "," +
        count +
        " 0," +
        count;
      const value32 = fn2(value31, "clipPath", {
        id: value23 + "-clip",
      });
      fn2(value32, "polygon", {
        points: points,
      });
      const value33 = x2 * 0.5 * value15;
      const value34 = fn2(value31, "linearGradient", {
        id: value23 + "-soft-light",
        gradientUnits: "userSpaceOnUse",
        x1: value21 - value33,
        y1: y1,
        x2: value21 + value33,
        y2: y1,
        gradientTransform: "rotate(" + value16 + " " + value21 + " " + y1 + ")",
      });
      fn2(value34, "stop", {
        offset: 0,
        "stop-color": value13,
        "stop-opacity": Math.min(1, value14 * 0.055),
      });
      fn2(value34, "stop", {
        offset: 0.55,
        "stop-color": value13,
        "stop-opacity": Math.min(1, value14 * 0.018),
      });
      fn2(value34, "stop", {
        offset: 1,
        "stop-color": value13,
        "stop-opacity": Math.min(1, value14 * 0.085),
      });
      const value35 = fn2(value31, "linearGradient", {
        id: value23 + "-edge",
        gradientUnits: "userSpaceOnUse",
        x1: 0,
        y1: y1,
        x2: x2,
        y2: y1,
        gradientTransform: "rotate(" + value11 + " " + value21 + " " + y1 + ")",
      });
      fn2(value35, "stop", {
        offset: 0,
        "stop-color": "#ffffff",
        "stop-opacity": value12,
      });
      fn2(value35, "stop", {
        offset: 0.48,
        "stop-color": "#ffffff",
        "stop-opacity": value12 * 0.49,
      });
      fn2(value35, "stop", {
        offset: 1,
        "stop-color": "#ffffff",
        "stop-opacity": value12 * 0.66,
      });
      const value36 = fn2(value31, "radialGradient", {
        id: value23 + "-glow",
        gradientUnits: "userSpaceOnUse",
        cx: cx,
        cy: cy,
        r: Math.min(x2, count) * 0.42 * value19,
      });
      fn2(value36, "stop", {
        offset: 0,
        "stop-color": value17,
        "stop-opacity": Math.min(1, value18 * 0.12),
      });
      fn2(value36, "stop", {
        offset: 0.52,
        "stop-color": value17,
        "stop-opacity": Math.min(1, value18 * 0.025),
      });
      fn2(value36, "stop", {
        offset: 1,
        "stop-color": value17,
        "stop-opacity": 0,
      });
      const value37 = fn2(value31, "filter", {
        id: value23 + "-glow-blur",
        x: "-40%",
        y: "-40%",
        width: "180%",
        height: "180%",
      });
      fn2(value37, "feGaussianBlur", {
        stdDeviation: Math.min(x2, count) * 0.03,
      });
      const value38 = fn2(value30, "g", {
        "clip-path": "url(#" + value23 + "-clip)",
      });
      if (value2.onFillVisible !== false) {
        fn2(value38, "polygon", {
          class: "hb-icon-button-on-fill",
          points: points,
          fill: S(value2.onFillColor, "#dfb64f"),
          "fill-opacity": fn(value2.onFillStrength, 0, 1, 1),
        });
      }
      if (value2.softLightVisible !== false && value15 > 0) {
        fn2(value38, "polygon", {
          points: points,
          fill: "url(#" + value23 + "-soft-light)",
        });
      }
      if (value2.glowVisible !== false && value19 > 0) {
        fn2(value38, "ellipse", {
          cx: cx,
          cy: cy,
          rx: x2 * 0.42 * value19,
          ry: count * 0.42 * value19,
          fill: "url(#" + value23 + "-glow)",
          filter: "url(#" + value23 + "-glow-blur)",
        });
      }
      if (value2.frameVisible !== false && value10 > 0) {
        fn2(value38, "polygon", {
          points: points,
          fill: "none",
          stroke: "url(#" + value23 + "-edge)",
          "stroke-width": value10,
          "vector-effect": "non-scaling-stroke",
        });
      }
    }
    const value25 =
      String(value2.icon || "").trim() ||
      (value3 ? et(value4, value5) : "mdi:ceiling-light");
    const value26 = K(value25);
    if (
      value26 &&
      (!value3 ||
        value2.iconVisible !== false ||
        value2.hiddenContentClickable === true)
    ) {
      const value30 = document.createElement("i");
      value30.className = value3
        ? "hb-device-button-icon"
        : "hb-icon-button-icon";
      if (!value3) {
        value30.style.width = fn(value2.iconSize, 1, 100, 42) + "%";
        value30.style.height = fn(value2.iconSize, 1, 100, 42) + "%";
      }
      value30.style.backgroundColor =
        value3 && value7
          ? S(value2.iconOnColor, "#379bff")
          : S(
              value2.iconColor || value2.iconOffColor || value2.iconOnColor,
              "#d7d8da",
            );
      value30.style.opacity = value3
        ? "1"
        : String(
            fn(value7 ? value2.iconOnOpacity : value2.iconOffOpacity, 0, 1, 1),
          );
      value30.style.maskImage = 'url("' + value26 + '")';
      value30.style.webkitMaskImage = 'url("' + value26 + '")';
      if (value3) {
        const value31 = fn(value2.iconSize, 1, 100, 28);
        const value32 = fn(value2.badgeSize ?? value31, 1, 100, value31);
        const value33 = fn(
          value2.symbolSize ?? value31 * 0.5,
          1,
          100,
          value31 * 0.5,
        );
        const value34 = fn((value33 / value32) * 100, 1, 100, 50);
        value30.style.width = value34 + "%";
        value30.style.height = value34 + "%";
        const value35 = document.createElement("span");
        value35.className =
          "hb-device-button-icon-badge" + (value7 ? " active" : "");
        if (value2.iconVisible === false) {
          value35.style.visibility = "hidden";
        }
        value35.style.width = value32 * value8 + "px";
        value35.style.height = value32 * value8 + "px";
        value35.style.setProperty(
          "--device-badge-color",
          S(value2.badgeColor, "#5b5e66"),
        );
        value35.style.setProperty(
          "--device-badge-opacity",
          fn(value2.badgeOpacity, 0, 1, 0.58) * 100 + "%",
        );
        value35.append(value30);
        value24.append(value35);
      } else {
        value24.append(value30);
      }
    }
    const value27 = document.createElement("span");
    value27.className = "hb-icon-button-text";
    const value28 = fn(value2.mainSize, 6, 120, 25);
    const element = document.createElement("strong");
    element.textContent = value3
      ? String(value2.mainText || "").trim() ||
        String(value6?.attributes?.friendly_name || value4 || "未选择实体")
      : String(value2.mainText || "主灯");
    element.style.color = S(
      value2.mainColor || value2.mainOffColor || value2.mainOnColor,
      "#c7c8cb",
    );
    element.style.opacity = value3
      ? "1"
      : String(
          fn(value7 ? value2.mainOnOpacity : value2.mainOffOpacity, 0, 1, 1),
        );
    element.style.fontSize = value28 * value8 + "px";
    element.style.letterSpacing =
      fn(value2.mainSpacing, -20, 100, 1) * value8 + "px";
    B(element, value2.mainWeight, value28);
    element.hidden =
      value3 &&
      value2.mainTextVisible === false &&
      value2.hiddenContentClickable !== true;
    if (
      value3 &&
      value2.mainTextVisible === false &&
      value2.hiddenContentClickable === true
    ) {
      element.style.visibility = "hidden";
    }
    const value29 = fn(value2.secondarySize, 5, 80, 10);
    const element2 = document.createElement("small");
    element2.textContent = value3
      ? String(value2.secondaryText || "").trim() ||
        (value4
          ? formatEntityState(value5, value4, {
              ...value,
              component: component,
            })
          : "未选择实体")
      : String(value2.secondaryText || "MAIN LIGHT");
    element2.style.color = S(
      value2.secondaryColor ||
        value2.secondaryOffColor ||
        value2.secondaryOnColor,
      "#75777d",
    );
    element2.style.opacity = value3
      ? "1"
      : String(
          fn(
            value7 ? value2.secondaryOnOpacity : value2.secondaryOffOpacity,
            0,
            1,
            1,
          ),
        );
    element2.style.fontSize = value29 * value8 + "px";
    element2.style.letterSpacing =
      fn(value2.secondarySpacing, -20, 100, 0.7) * value8 + "px";
    B(element2, value2.secondaryWeight, value29);
    element2.hidden =
      value3 &&
      value2.secondaryTextVisible === false &&
      value2.hiddenContentClickable !== true;
    if (
      value3 &&
      value2.secondaryTextVisible === false &&
      value2.hiddenContentClickable === true
    ) {
      element2.style.visibility = "hidden";
    }
    value27.append(element, element2);
    value24.append(value27);
    return value24;
  },
};
registerComponent("icon-button", Ae);
registerComponent("device-button", Ae);
function dt(value, value2, value3, value4) {
  const value5 = S(value2.iconOnColor || value2.occupiedColor, "#ffffff");
  const value6 = value3.key === "occupied";
  const value7 = value6
    ? "打开"
    : value3.key === "clear"
      ? "关闭"
      : value3.key === "unavailable"
        ? "离线"
        : "未知";
  const value8 = document.createElement("div");
  value8.className =
    "hb-door-window-sensor is-" + (value6 ? "open" : value3.key);
  value8.dataset.sensorState = value6 ? "open" : value3.key;
  value8.style.setProperty("--hb-door-window-accent", value5);
  value8.setAttribute("role", "img");
  value8.setAttribute("aria-label", "门窗传感器：" + value7);
  const value9 = document.createElement("div");
  value9.className = "hb-door-window-visual";
  const count = Math.max(
    0.01,
    Number(value4.document?.canvas?.componentScale || 1),
  );
  const count2 = Math.max(1, Number(value.position?.width || 100) / count);
  const count3 = Math.max(1, Number(value.position?.height || 100) / count);
  value9.style.transform = doorWindowPerspectiveMatrix(
    count2,
    count3,
    value2.perspectiveCorners,
  );
  const value10 = document.createElement("span");
  value10.className = "hb-door-window-frame";
  const value11 = document.createElement("span");
  value11.className = "hb-door-window-panel left";
  const value12 = document.createElement("span");
  value12.className = "hb-door-window-panel right";
  value11.append(document.createElement("i"));
  value12.append(document.createElement("i"));
  value10.append(value11, value12);
  const value13 = document.createElement("span");
  value13.className = "hb-door-window-airflow";
  for (let value14 = 0; value14 < 3; value14 += 1) {
    value13.append(document.createElement("i"));
  }
  value9.append(value10, value13);
  value8.append(value9);
  return value8;
}
function pt(value, value2) {
  const value3 = S(value.waterLeakColor, "#42c8ff");
  const value4 = value2.key === "occupied";
  const value5 = value4
    ? "检测到水浸"
    : value2.key === "clear"
      ? "正常"
      : value2.key === "unavailable"
        ? "离线"
        : "未知";
  const value6 = document.createElement("div");
  value6.className = "hb-water-leak-sensor is-" + (value4 ? "wet" : value2.key);
  value6.dataset.sensorState = value4 ? "wet" : value2.key;
  value6.style.setProperty("--hb-water-leak-accent", value3);
  value6.setAttribute("role", "img");
  value6.setAttribute("aria-label", "水浸传感器：" + value5);
  const value7 = document.createElement("div");
  value7.className = "hb-water-leak-visual";
  const value8 = document.createElement("span");
  value8.className = "hb-water-leak-puddle";
  const value9 = document.createElement("span");
  value9.className = "hb-water-leak-ripples";
  for (let value14 = 0; value14 < 3; value14 += 1) {
    value9.append(document.createElement("i"));
  }
  const value10 = "http://www.w3.org/2000/svg";
  const value11 = document.createElementNS(value10, "svg");
  value11.setAttribute("class", "hb-water-leak-droplet");
  value11.setAttribute("viewBox", "0 0 48 64");
  value11.setAttribute("aria-hidden", "true");
  const value12 = document.createElementNS(value10, "path");
  value12.setAttribute("class", "body");
  value12.setAttribute(
    "d",
    "M24 3C20 10 6 27 6 40c0 11 8 20 18 20s18-9 18-20C42 27 28 10 24 3Z",
  );
  const value13 = document.createElementNS(value10, "path");
  value13.setAttribute("class", "highlight");
  value13.setAttribute("d", "M15 40c0-6 3-12 8-18");
  value11.append(value12, value13);
  value7.append(value8, value9, value11);
  value6.append(value7);
  return value6;
}
function mt(value, value2) {
  const value3 = S(value.smokeColor, "#ffffff");
  const value4 = value2.key === "occupied";
  const value5 = value4
    ? "检测到烟雾"
    : value2.key === "clear"
      ? "正常"
      : value2.key === "unavailable"
        ? "离线"
        : "未知";
  const value6 = document.createElement("div");
  value6.className = "hb-smoke-sensor is-" + (value4 ? "alert" : value2.key);
  value6.dataset.sensorState = value4 ? "alert" : value2.key;
  value6.style.setProperty("--hb-smoke-accent", value3);
  value6.setAttribute("role", "img");
  value6.setAttribute("aria-label", "烟雾传感器：" + value5);
  const value7 = document.createElement("span");
  value7.className = "hb-smoke-visual";
  const value8 = document.createElement("span");
  value8.className = "hb-smoke-ground";
  const value9 = "http://www.w3.org/2000/svg";
  const value10 = document.createElementNS(value9, "svg");
  value10.setAttribute("class", "hb-smoke-wisps");
  value10.setAttribute("viewBox", "0 0 100 100");
  value10.setAttribute("aria-hidden", "true");
  for (const value11 of [
    "M27 94C12 76 41 67 27 49C13 32 38 22 30 7",
    "M50 97C34 79 65 69 49 50C35 33 61 21 52 3",
    "M73 93C60 77 86 66 72 48C59 32 83 22 75 8",
  ]) {
    const value12 = document.createElementNS(value9, "path");
    value12.setAttribute("d", value11);
    value10.append(value12);
  }
  value7.append(value8, value10);
  value6.append(value7);
  return value6;
}
function ut(value, value2) {
  const value3 = S(value.naturalGasColor, "#ffb347");
  const value4 = value2.key === "occupied";
  const value5 = value4
    ? "检测到天然气"
    : value2.key === "clear"
      ? "正常"
      : value2.key === "unavailable"
        ? "离线"
        : "未知";
  const value6 = document.createElement("div");
  value6.className =
    "hb-natural-gas-sensor is-" + (value4 ? "alert" : value2.key);
  value6.dataset.sensorState = value4 ? "alert" : value2.key;
  value6.style.setProperty("--hb-natural-gas-accent", value3);
  value6.setAttribute("role", "img");
  value6.setAttribute("aria-label", "天然气传感器：" + value5);
  const value7 = document.createElement("span");
  value7.className = "hb-natural-gas-visual";
  const value8 = document.createElement("span");
  value8.className = "hb-natural-gas-haze";
  const value9 = "http://www.w3.org/2000/svg";
  const value10 = document.createElementNS(value9, "svg");
  value10.setAttribute("class", "hb-natural-gas-currents");
  value10.setAttribute("viewBox", "0 0 120 80");
  value10.setAttribute("aria-hidden", "true");
  for (const value11 of [
    "M3 19C23 5 38 32 58 18C78 4 94 29 117 13",
    "M0 40C20 26 35 53 55 39C76 24 94 54 120 35",
    "M5 62C26 47 42 74 64 58C85 43 101 67 117 54",
  ]) {
    const value12 = document.createElementNS(value9, "path");
    value12.setAttribute("d", value11);
    value10.append(value12);
  }
  value7.append(value8, value10);
  value6.append(value7);
  return value6;
}
registerComponent("presence-sensor", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.bindings?.entity?.entityId || "";
    const value4 = value.states?.get(value3);
    const value5 = presenceMotionEventConfig(
      value3,
      value4,
      value.entityMetadata,
      value.states,
      value2,
    );
    const value6 = presenceSensorPresentation(
      value4,
      value.editable ? value.previewState : "auto",
      value5,
    );
    if (value2.sensorKind === "door-window") {
      return dt(component, value2, value6, value);
    }
    if (value2.sensorKind === "water-leak") {
      return pt(value2, value6);
    }
    if (value2.sensorKind === "smoke") {
      return mt(value2, value6);
    }
    if (value2.sensorKind === "natural-gas") {
      return ut(value2, value6);
    }
    const value7 = S(value2.iconOnColor || value2.occupiedColor, "#ffffff");
    const value8 = S(value2.iconColor || value2.clearColor, "#758189");
    const value9 = componentContentUnitsPx(component, value);
    const element = document.createElement("div");
    element.className = "hb-presence-sensor is-" + value6.key;
    element.classList.toggle("is-halo-hidden", value2.haloVisible === false);
    element.classList.toggle(
      "is-person-hidden",
      value2.personVisible === false,
    );
    element.dataset.presenceState = value6.key;
    element.style.setProperty("--hb-presence-occupied", value7);
    element.style.setProperty("--hb-presence-clear", value8);
    const value10 = fn(value2.animationStrength, 0, 1, 0.72);
    const value11 = fn(value2.haloScale, 0.2, 3, 1);
    const value12 = fn(value2.haloScaleX, 0.2, 3, value11);
    const value13 = fn(value2.haloScaleY, 0.2, 3, value11);
    const value14 = fn(value2.haloRotation, -360, 360, 0);
    const value15 = fn(value2.haloOpacity, 0, 1, 1);
    const value16 = fn(value2.personScale, 0.2, 3, 1);
    const value17 = fn(value2.personRotation, -360, 360, 0);
    const value18 = fn(value2.personOpacity, 0, 1, 1);
    const orbit = fn(value2.orbitDuration, 2, 60, 8);
    element.style.setProperty("--hb-presence-motion", String(value10));
    const wave = Number((3.2 - value10 * 0.8).toFixed(2));
    element.style.setProperty("--hb-presence-wave-duration", wave + "s");
    element.style.setProperty("--hb-presence-halo-scale-x", String(value12));
    element.style.setProperty("--hb-presence-halo-scale-y", String(value13));
    element.style.setProperty("--hb-presence-halo-rotation", value14 + "deg");
    element.style.setProperty("--hb-presence-halo-opacity", String(value15));
    element.style.setProperty("--hb-presence-person-scale", String(value16));
    element.style.setProperty("--hb-presence-person-rotation", value17 + "deg");
    element.style.setProperty("--hb-presence-person-opacity", String(value18));
    element.style.setProperty("--hb-presence-orbit-duration", orbit + "s");
    if (value6.key === "occupied") {
      const value34 = presenceAnimationPhase(value4, {
        orbit: orbit,
        wave: wave,
      });
      element.style.setProperty(
        "--hb-presence-orbit-delay",
        value34.orbitDelay,
      );
      element.style.setProperty("--hb-presence-wave-delay", value34.waveDelay);
      element.style.setProperty(
        "--hb-presence-floor-delay",
        value34.floorDelay,
      );
      element.style.setProperty("--hb-presence-step-delay", value34.stepDelay);
    }
    const value19 = value12 * 32 * value9.width;
    const value20 = value13 * 13 * value9.height;
    element.style.setProperty(
      "--hb-presence-orbit-x",
      value19.toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-negative",
      (-value19).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y",
      value20.toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-negative",
      (-value20).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-diagonal",
      (value19 * 0.707).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-diagonal-negative",
      (-value19 * 0.707).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-diagonal",
      (value20 * 0.707).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-diagonal-negative",
      (-value20 * 0.707).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-shallow",
      (value19 * 0.382683).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-shallow-negative",
      (-value19 * 0.382683).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-steep",
      (value19 * 0.92388).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-x-steep-negative",
      (-value19 * 0.92388).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-shallow",
      (value20 * 0.382683).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-shallow-negative",
      (-value20 * 0.382683).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-steep",
      (value20 * 0.92388).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-orbit-y-steep-negative",
      (-value20 * 0.92388).toFixed(4) + "px",
    );
    element.style.setProperty(
      "--hb-presence-person-width",
      value9.width * 22 + "px",
    );
    element.style.setProperty(
      "--hb-presence-person-height",
      value9.height * 62 + "px",
    );
    element.style.setProperty(
      "--hb-presence-copy-gap",
      value9.height * 7 + "px",
    );
    element.style.setProperty(
      "--hb-presence-copy-main-size",
      value9.height * 20 + "px",
    );
    element.style.setProperty(
      "--hb-presence-copy-secondary-size",
      value9.height * 10 + "px",
    );
    element.setAttribute("role", "img");
    element.setAttribute("aria-label", "人在传感器：" + value6.label);
    const value21 = document.createElement("div");
    value21.className = "hb-presence-sensor-visual";
    const value22 = document.createElement("span");
    value22.className = "hb-presence-sensor-halo";
    const value23 = document.createElement("span");
    value23.className = "hb-presence-sensor-space";
    for (let value34 = 0; value34 < 3; value34 += 1) {
      value23.append(document.createElement("i"));
    }
    const value24 = document.createElement("span");
    value24.className = "hb-presence-sensor-person";
    const value25 = document.createElement("i");
    const value26 = document.createElement("b");
    const value27 = document.createElement("span");
    value27.className = "arm left";
    const value28 = document.createElement("span");
    value28.className = "arm right";
    const value29 = document.createElement("span");
    value29.className = "leg left";
    const value30 = document.createElement("span");
    value30.className = "leg right";
    value24.append(value25, value26, value27, value28, value29, value30);
    const value31 = document.createElement("span");
    value31.className = "hb-presence-sensor-floor";
    value22.append(value23, value31);
    const value32 = document.createElement("span");
    value32.className = "hb-presence-sensor-orbit";
    const value33 = document.createElement("span");
    value33.className = "hb-presence-sensor-traveler";
    value33.append(value24);
    value32.append(value33);
    value21.append(value22, value32);
    element.append(value21);
    if (!value.editable && value5.motionEvent && value6.key === "occupied") {
      const value34 = presenceStateTimestamp(value4);
      const value35 = Number.isFinite(value34)
        ? value5.motionTimeoutSeconds * 1000 - (Date.now() - value34)
        : 0;
      if (value35 > 0) {
        const value36 = window.setTimeout(
          () => value.invalidate?.(),
          value35 + 80,
        );
        value.cleanup(() => window.clearTimeout(value36));
      }
    }
    return element;
  },
});
registerComponent("air-conditioner", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.bindings?.entity?.entityId || "";
    const value4 = D(value.states?.get(value3));
    const value5 = resolveClimateDeviceType(component, value4, value3);
    const value6 = de(component, value);
    const { height: value7 } = componentContentUnitsPx(component, value);
    const value8 = document.createElement("div");
    value8.className = "hb-air-conditioner" + (value6 ? " active" : "");
    value8.style.setProperty(
      "--climate-icon-left",
      fn(value2.iconLeft, -100, 200, 20) + "%",
    );
    value8.style.setProperty(
      "--climate-icon-top",
      fn(value2.iconTop, -100, 200, 50) + "%",
    );
    value8.style.setProperty(
      "--climate-main-left",
      fn(value2.mainTextLeft, -100, 200, 39) + "%",
    );
    value8.style.setProperty(
      "--climate-main-top",
      fn(value2.mainTextTop, -100, 200, 40) + "%",
    );
    value8.style.setProperty(
      "--climate-secondary-left",
      fn(value2.secondaryTextLeft, -100, 200, 39) + "%",
    );
    value8.style.setProperty(
      "--climate-secondary-top",
      fn(value2.secondaryTextTop, -100, 200, 67) + "%",
    );
    value8.style.setProperty(
      "--climate-badge-color",
      S(value2.badgeColor, "#5b5e66"),
    );
    value8.style.setProperty(
      "--climate-badge-opacity",
      fn(value2.badgeOpacity, 0, 1, 0.58) * 100 + "%",
    );
    const value9 = S(
      value6 ? value2.iconOnColor : value2.iconOffColor,
      value6 ? "#73c8ff" : "#9aa5ad",
    );
    value8.style.setProperty("--climate-icon-color", value9);
    value8.style.setProperty("--climate-icon-glow-size", value7 * 7 + "px");
    const value10 = fn(value2.badgeSize, 1, 100, 28);
    const value11 = fn(value2.symbolSize, 1, 100, 14);
    if (value2.iconVisible !== false) {
      const value15 = document.createElement("span");
      value15.className = "hb-air-conditioner-icon-badge";
      value15.style.width = value10 * value7 + "px";
      value15.style.height = value10 * value7 + "px";
      const text = String(value2.icon || "");
      const value16 =
        value5 === "bath-heater" && (!text || text === "mdi:air-conditioner")
          ? climateDefaultIcon(value5)
          : text || climateDefaultIcon(value5);
      const value17 = K(value16);
      if (value17) {
        const value18 = document.createElement("i");
        value18.className = "hb-air-conditioner-icon";
        const value19 = fn((value11 / value10) * 100, 1, 100, 50);
        value18.style.width = value19 + "%";
        value18.style.height = value19 + "%";
        value18.style.backgroundColor = value9;
        value18.style.maskImage = 'url("' + value17 + '")';
        value18.style.webkitMaskImage = 'url("' + value17 + '")';
        value15.append(value18);
      }
      value8.append(value15);
    }
    const value12 = document.createElement("span");
    value12.className = "hb-air-conditioner-text";
    const value13 = fn(value2.mainSize, 6, 120, 21);
    const element = document.createElement("strong");
    element.textContent =
      String(value2.mainText || "").trim() ||
      String(
        value4?.attributes?.friendly_name ||
          value3 ||
          (value5 === "bath-heater" ? "未选择浴霸实体" : "未选择空调实体"),
      );
    element.style.color = S(value2.mainColor, "#c7c8cb");
    element.style.fontSize = value13 * value7 + "px";
    element.style.letterSpacing =
      fn(value2.mainSpacing, -20, 100, 0.5) * value7 + "px";
    B(element, value2.mainWeight, value13);
    const value14 = fn(value2.secondarySize, 5, 80, 12);
    const element2 = document.createElement("small");
    element2.textContent = value3 ? at(component, value) : "未选择实体";
    element2.style.color = S(value2.secondaryColor, "#75777d");
    element2.style.fontSize = value14 * value7 + "px";
    element2.style.letterSpacing =
      fn(value2.secondarySpacing, -20, 100, 0.3) * value7 + "px";
    B(element2, value2.secondaryWeight, value14);
    if (value2.mainTextVisible !== false) {
      value12.append(element);
    }
    if (value2.secondaryTextVisible !== false) {
      value12.append(element2);
    }
    if (value12.childElementCount) {
      value8.append(value12);
    }
    return value8;
  },
});
export function cameraRadiusRatio(value, fallback = 0.04) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return fn(numeric > 0.5 ? numeric / 100 : numeric, 0, 0.5, fallback);
  } else {
    return fallback;
  }
}
export function appendCameraFrame(
  value,
  value2,
  value3 = {},
  value4 = "renderer",
) {
  if (!value || value3.frameVisible === false) {
    return null;
  }
  const x2 = Math.max(
    20,
    Number(value2?.position?.width || value.clientWidth || 320),
  );
  const count = Math.max(
    20,
    Number(value2?.position?.height || value.clientHeight || 180),
  );
  const value5 = fn(value3.frameWidth, 0, 20, 1);
  if (value5 <= 0) {
    return null;
  }
  const count2 = Math.max(0.5, value5 / 2 + 0.5);
  const width = Math.max(1, x2 - count2 * 2);
  const height = Math.max(1, count - count2 * 2);
  const value6 = cameraRadiusRatio(value3.radius);
  const rx = Math.min(width, height) * value6;
  const value7 = fn(value3.frameOpacity, 0, 1, 0.9);
  const value8 = S(value3.frameColor, "#d4d4d4");
  const value9 =
    value4 +
    "-camera-frame-" +
    String(value2?.id || "").replace(/[^a-z0-9_-]/gi, "");
  const value10 = fn2(value, "svg", {
    class: "hb-camera-frame",
    viewBox: "0 0 " + x2 + " " + count,
    preserveAspectRatio: "none",
    "aria-hidden": "true",
  });
  const value11 = fn2(value10, "defs");
  const value12 = fn2(value11, "linearGradient", {
    id: value9 + "-edge",
    gradientUnits: "userSpaceOnUse",
    x1: 0,
    y1: count / 2,
    x2: x2,
    y2: count / 2,
    gradientTransform:
      "rotate(" +
      fn(value3.frameAngle, 0, 360, 45) +
      " " +
      x2 / 2 +
      " " +
      count / 2 +
      ")",
  });
  for (const [offset, value13] of [
    [0, 0.96],
    [0.22, 0.72],
    [0.52, 0.3],
    [0.78, 0.66],
    [1, 0.42],
  ]) {
    fn2(value12, "stop", {
      offset: offset,
      "stop-color": value8,
      "stop-opacity": value13 * value7,
    });
  }
  fn2(value10, "rect", {
    x: count2,
    y: count2,
    width: width,
    height: height,
    rx: rx,
    fill: "none",
    stroke: "url(#" + value9 + "-edge)",
    "stroke-width": value5,
    "vector-effect": "non-scaling-stroke",
  });
  return value10;
}
const ft = 30000;
const ht = 4;
const pe = new Map();
const ie = new Map();
async function Ie(value) {
  const value2 = String(value || "").trim();
  if (!value2) {
    throw new Error("Camera entity is required");
  }
  const value3 = Date.now();
  const value4 = pe.get(value2);
  if (value4 && value3 - value4.createdAt < ft) {
    return value4.source;
  }
  const value5 = ie.get(value2);
  if (value5) {
    return value5;
  }
  const value6 = (async () => {
    const response = await fetch(
      "/api/camera_hls/" + encodeURIComponent(value2),
    );
    if (!response.ok) {
      throw new Error("Camera HLS request failed: " + response.status);
    }
    const value7 = await response.json();
    const source = typeof value7?.url == "string" ? value7.url.trim() : "";
    if (!source.startsWith("/")) {
      throw new Error("Camera HLS response has no proxy URL");
    }
    pe.set(value2, {
      source: source,
      createdAt: Date.now(),
    });
    return source;
  })();
  ie.set(value2, value6);
  try {
    return await value6;
  } finally {
    if (ie.get(value2) === value6) {
      ie.delete(value2);
    }
  }
}
export async function prewarmCameraMedia(value = []) {
  if (document.visibilityState === "hidden") {
    return;
  }
  const value2 = [
    ...new Set(
      (value || [])
        .map((value3) => String(value3 || "").trim())
        .filter(Boolean),
    ),
  ].slice(0, ht);
  await Promise.allSettled(value2.map((value3) => Ie(value3)));
}
export function mountCameraSnapshot({
  container: value,
  entityId: value2,
  label: value3,
  objectFit: value4 = "cover",
  refreshInterval: value5 = 10,
  placeholder: element,
  cleanup: fn3 = () => {},
}) {
  const image = document.createElement("img");
  image.className = "hb-camera-image";
  image.alt = value3 || value2;
  image.draggable = false;
  image.style.objectFit = value4;
  const numeric = Number(value5);
  const value6 = Number.isFinite(numeric)
    ? Math.max(6, Math.round(numeric))
    : 10;
  const value7 = Math.min(2147483000, value6 * 1000);
  let value8 = false;
  let value9 = document.visibilityState === "hidden";
  let value10 = 0;
  let value11 = false;
  let value12 = 0;
  const fn4 = () => {
    window.clearTimeout(value10);
    value10 = 0;
  };
  const fn5 = () => {
    fn4();
    if (!value8 && !value9) {
      value10 = window.setTimeout(fn6, value7);
    }
  };
  const fn6 = () => {
    if (value8 || value9) {
      return;
    }
    fn4();
    const value14 =
      "/api/camera_proxy/" + encodeURIComponent(value2) + "?hb=" + Date.now();
    if (!value11) {
      element.hidden = false;
      element.textContent = "正在载入摄像头快照";
      value.dataset.cameraState = "snapshot-loading";
      image.src = value14;
      return;
    }
    value.dataset.cameraState = "snapshot-loading";
    const value15 = ++value12;
    const value16 = document.createElement("img");
    value16.addEventListener("load", () => {
      if (!value8 && !value9 && value15 === value12) {
        image.src = value14;
      }
    });
    value16.addEventListener("error", () => {
      if (!value8 && !value9 && value15 === value12) {
        value.dataset.cameraState = "snapshot-stale";
        fn5();
      }
    });
    value16.src = value14;
  };
  image.addEventListener("load", () => {
    if (!value8 && !value9) {
      value11 = true;
      element.hidden = true;
      value.dataset.cameraState = "snapshot-ready";
      fn5();
    }
  });
  image.addEventListener("error", () => {
    if (!value8 && !value9) {
      element.hidden = false;
      element.textContent = "摄像头快照不可用";
      value.dataset.cameraState = "snapshot-unavailable";
      fn5();
    }
  });
  const value13 = () => {
    if (document.visibilityState === "hidden") {
      value9 = true;
      fn4();
      value.dataset.cameraState = "snapshot-suspended";
      return;
    }
    if (value9) {
      value9 = false;
      fn6();
    }
  };
  value.dataset.cameraTransport = "snapshot";
  value.prepend(image);
  document.addEventListener("visibilitychange", value13);
  if (value9) {
    value.dataset.cameraState = "snapshot-suspended";
  } else {
    fn6();
  }
  fn3(() => {
    value8 = true;
    fn4();
    document.removeEventListener("visibilitychange", value13);
    image.removeAttribute("src");
  });
  return {
    image: image,
  };
}
export function mountCameraMedia({
  container: value,
  entityId: entityId,
  label: value2,
  objectFit: value3 = "cover",
  placeholder: element,
  onReady: fn3 = () => {},
  onUnavailable: fn4 = () => {},
  cleanup: fn5 = () => {},
}) {
  const video = document.createElement("video");
  video.className = "hb-camera-video";
  video.setAttribute("aria-label", value2 || entityId);
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.disablePictureInPicture = true;
  video.style.objectFit = value3;
  const image = document.createElement("img");
  image.className = "hb-camera-image";
  image.alt = value2 || entityId;
  image.draggable = false;
  image.style.objectFit = value3;
  let value4 = false;
  let value5 = false;
  let value6 = false;
  let value7 = 0;
  let value8 = 0;
  let value9 = 0;
  let value10 = null;
  let value11 = false;
  let value12 = 0;
  let value13 = document.visibilityState === "hidden";
  const fn6 = () => {
    value12 += 1;
    window.clearTimeout(value7);
    window.clearTimeout(value8);
    window.clearTimeout(value9);
    value7 = 0;
    value8 = 0;
    value9 = 0;
    value10?.destroy();
    value10 = null;
    video.pause();
    video.removeAttribute("src");
    video.load();
    image.removeAttribute("src");
    value5 = false;
    value6 = false;
    value11 = false;
  };
  const fn7 = () => {
    image.remove();
    if (!video.isConnected) {
      value.prepend(video);
    }
  };
  const value14 = () => {
    if (!value4 && !value13 && !value11) {
      value11 = true;
      window.clearTimeout(value8);
      window.clearTimeout(value9);
      element.hidden = true;
      fn3();
    }
  };
  const fn8 = () => {
    if (!value4 && !value13) {
      value11 = false;
      element.hidden = false;
      element.textContent = "摄像头实时预览不可用";
      fn4();
    }
  };
  const fn9 = () => {
    if (!value4 && !value13) {
      image.src =
        "/api/camera_proxy/" +
        encodeURIComponent(entityId) +
        "?hb=" +
        Date.now();
    }
  };
  const fn10 = (value16 = value12) => {
    if (!value4 && !value13 && value16 === value12 && !value6) {
      value6 = true;
      window.clearTimeout(value9);
      fn9();
    }
  };
  const fn11 = (value16 = value12) => {
    if (!value4 && !value13 && value16 === value12 && !value5) {
      value5 = true;
      value.dataset.cameraTransport = "legacy";
      window.clearTimeout(value8);
      value10?.destroy();
      value10 = null;
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      value.prepend(image);
      image.src = "/api/camera_proxy_stream/" + encodeURIComponent(entityId);
      value9 = window.setTimeout(() => {
        if (!image.naturalWidth) {
          fn10(value16);
        }
      }, 7000);
    }
  };
  video.addEventListener("loadeddata", value14);
  video.addEventListener("playing", value14);
  video.addEventListener(
    "error",
    () => {
      if (!value10) {
        fn11();
      }
    },
    {
      once: true,
    },
  );
  image.addEventListener("load", value14);
  image.addEventListener("error", () => {
    if (!value4 && !value13) {
      if (value6) {
        fn8();
      } else {
        fn10();
      }
    }
  });
  value.prepend(video);
  const fn12 = async (value16) => {
    try {
      const value17 = await Ie(entityId);
      if (value4 || value13 || value16 !== value12) {
        return;
      }
      value.dataset.cameraHlsSource = value17;
      value.dataset.cameraTransport = "hls";
      if (window.Hls?.isSupported?.()) {
        value10 = new window.Hls({
          lowLatencyMode: true,
          backBufferLength: 15,
          maxBufferLength: 15,
        });
        value10.on(window.Hls.Events.MEDIA_ATTACHED, () =>
          value10?.loadSource(value17),
        );
        value10.on(window.Hls.Events.MANIFEST_PARSED, () => {
          value.dataset.cameraState = "manifest-parsed";
          video.play().catch(() => {});
        });
        value10.on(window.Hls.Events.ERROR, (_, value18) => {
          if (!value4 && !value13 && value16 === value12) {
            if (value18?.fatal) {
              pe.delete(String(entityId || "").trim());
              value.dataset.cameraState = "hls-failed";
              value.dataset.cameraError = [
                value18.type,
                value18.details,
                value18.url || value18.response?.url || "",
                value18.response?.code || 0,
                value18.reason || value18.error?.message || "",
              ].join(" | ");
              window.HABridgeLog?.report(
                "error",
                "摄像头",
                "摄像头播放失败：" +
                  (value18.type || "") +
                  " / " +
                  (value18.details || ""),
                {
                  entityId: entityId,
                  phase: "hls-playback",
                  status: value18.response?.code || 0,
                  path: value18.url || value18.response?.url || "",
                },
              );
              console.warn("[HA Bridge camera] HLS playback failed", {
                entityId: entityId,
                type: value18.type,
                details: value18.details,
                url: value18.url || value18.response?.url || "",
                status: value18.response?.code || 0,
                reason: value18.reason || value18.error?.message || "",
              });
              fn11(value16);
            }
          }
        });
        value10.attachMedia(video);
      } else {
        video.src = value17;
        video.play().catch(() => {});
      }
    } catch (error) {
      if (value4 || value13 || value16 !== value12) {
        return;
      }
      value.dataset.cameraState = "setup-failed";
      value.dataset.cameraError = String(error);
      window.HABridgeLog?.error(
        error,
        {
          entityId: entityId,
          phase: "hls-setup",
        },
        "摄像头连接失败：" + (error?.message || error),
      );
      console.warn("[HA Bridge camera] HLS setup failed", {
        entityId: entityId,
        error: String(error),
      });
      fn11(value16);
    }
  };
  const fn13 = () => {
    if (value4 || value13) {
      return;
    }
    fn7();
    value11 = false;
    element.hidden = false;
    element.textContent = "摄像头正在连接";
    const value16 = value12;
    value.dataset.cameraState = "starting";
    fn12(value16);
    value8 = window.setTimeout(() => fn11(value16), 12000);
  };
  const value15 = () => {
    if (document.visibilityState === "hidden") {
      if (value13) {
        return;
      }
      value13 = true;
      fn6();
      value.dataset.cameraState = "suspended";
      element.hidden = false;
      element.textContent = "摄像头已在后台暂停";
      return;
    }
    if (value13) {
      value13 = false;
      fn13();
    }
  };
  document.addEventListener("visibilitychange", value15);
  if (value13) {
    value.dataset.cameraState = "suspended";
    element.hidden = false;
    element.textContent = "摄像头已在后台暂停";
  } else {
    value.dataset.cameraState = "deferred";
    value7 = window.setTimeout(fn13, 0);
  }
  fn5(() => {
    value4 = true;
    document.removeEventListener("visibilitychange", value15);
    fn6();
  });
  return {
    video: video,
    image: image,
  };
}
registerComponent("camera", {
  render(component, value) {
    const value2 = component.properties || {};
    const entityId = component.bindings?.entity?.entityId || "";
    const container = document.createElement("div");
    container.className = "hb-camera-component";
    const count = Math.max(1, Number(component.position?.width || 320));
    const count2 = Math.max(1, Number(component.position?.height || 180));
    const count3 = Math.max(
      0.01,
      Number(value.document?.canvas?.componentScale || 1),
    );
    const value3 =
      (Math.min(count, count2) * cameraRadiusRatio(value2.radius)) / count3;
    container.style.borderRadius = value3 + "px";
    if (value.editable) {
      const element = document.createElement("div");
      element.className = "hb-camera-placeholder";
      element.textContent =
        value2.mediaVisible === false
          ? "摄像头画面已隐藏"
          : "编辑模式不加载实时画面";
      container.append(element);
    } else if (value.liveMedia !== false && value2.mediaVisible !== false) {
      const placeholder = document.createElement("div");
      placeholder.className = "hb-camera-placeholder";
      const value4 = value2.displayMode === "snapshot";
      placeholder.textContent = entityId
        ? value4
          ? "正在载入摄像头快照"
          : "正在载入摄像头实时预览"
        : "未选择摄像头实体";
      container.append(placeholder);
      if (entityId) {
        const value5 = {
          container: container,
          entityId: entityId,
          label:
            D(value.states?.get(entityId))?.attributes?.friendly_name ||
            entityId,
          objectFit: value2.fit === "contain" ? "contain" : "fill",
          placeholder: placeholder,
          cleanup: (cleanup) => value.cleanup(cleanup),
        };
        if (value4) {
          mountCameraSnapshot({
            ...value5,
            refreshInterval: value2.refreshInterval,
          });
        } else {
          mountCameraMedia(value5);
        }
      }
    }
    appendCameraFrame(container, component, value2, value.renderNamespace);
    return container;
  },
});
registerComponent("vacuum-map", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.bindings?.entity?.entityId || "";
    const value4 = document.createElement("div");
    value4.className = "hb-vacuum-map-component";
    value4.style.opacity = String(fn(value2.opacity, 0, 1, 0.5));
    value4.setAttribute("aria-label", value2.label || "扫地机器人实时地图");
    if (!value3) {
      if (value.editable) {
        const element = document.createElement("span");
        element.className = "hb-vacuum-map-placeholder";
        element.textContent = "请选择实时地图实体";
        value4.append(element);
      }
      return value4;
    }
    const value5 = document.createElement("img");
    value5.className = "hb-vacuum-map-image";
    value5.alt =
      value2.label ||
      D(value.states?.get(value3))?.attributes?.friendly_name ||
      value3;
    value5.draggable = false;
    const value6 = encodeURIComponent(value3);
    const value7 = value3.startsWith("image.");
    const value8 = value.liveMedia !== false;
    const value9 = value.liveMedia !== false && !value.editable;
    if (value9 && document.visibilityState === "hidden") {
      value5.dataset.vacuumMapSuspended = "true";
    }
    const fn3 = () =>
      value7
        ? vacuumMapImageSource(value3, value.states?.get(value3))
        : value.editable
          ? "/api/camera_proxy/" + value6 + "?hb=" + Date.now()
          : "/api/camera_proxy_stream/" + value6;
    let value10 = 0;
    let value11 = 0;
    const value12 = 4;
    const fn4 = () => {
      if (value10) {
        window.clearTimeout(value10);
        value10 = 0;
      }
    };
    const fn5 = () => {
      const value15 = fn3();
      if (value7) {
        value5.dataset.vacuumMapSource = value15;
      }
      if (value5.dataset.vacuumMapSuspended === "true") {
        value5.removeAttribute("src");
        return;
      }
      value5.src = value15;
    };
    const value13 = () => {
      value11 = 0;
      fn4();
    };
    const fn6 = () => {
      if (!value.editable || !value5.isConnected) {
        return;
      }
      const element = document.createElement("span");
      element.className = "hb-vacuum-map-placeholder";
      element.textContent = "实时地图暂时不可用";
      value5.replaceWith(element);
    };
    const value14 = () => {
      if (!value8 || value5.dataset.vacuumMapSuspended === "true") {
        return;
      }
      if (value11 >= value12) {
        fn6();
        return;
      }
      value11 += 1;
      fn4();
      const value15 = Math.min(4000, 2 ** (value11 - 1) * 700);
      value10 = window.setTimeout(() => {
        value10 = 0;
        if (
          value5.dataset.vacuumMapSuspended === "true" ||
          !value5.isConnected
        ) {
          return;
        }
        const value16 = fn3();
        const value17 = value7
          ? value16
          : "" +
            value16 +
            (value16.includes("?") ? "&" : "?") +
            "hb=" +
            Date.now();
        if (value7) {
          value5.dataset.vacuumMapSource = value17;
        }
        value5.src = value17;
      }, value15);
    };
    value5.addEventListener("load", value13);
    if (value8) {
      value5.addEventListener("error", value14);
    }
    if (value.liveMedia !== false) {
      fn5();
    }
    if (value9) {
      const value15 = () => {
        if (document.visibilityState === "hidden") {
          if (value5.dataset.vacuumMapSuspended === "true") {
            return;
          }
          value5.dataset.vacuumMapSuspended = "true";
          value5.removeAttribute("src");
          return;
        }
        if (value5.dataset.vacuumMapSuspended === "true") {
          delete value5.dataset.vacuumMapSuspended;
          fn5();
        }
      };
      document.addEventListener("visibilitychange", value15);
      value.cleanup(() =>
        document.removeEventListener("visibilitychange", value15),
      );
    }
    if (!value8) {
      value5.addEventListener("error", fn6, {
        once: true,
      });
    }
    value4.append(value5);
    value.cleanup(() => {
      fn4();
      value5.removeEventListener?.("load", value13);
      if (value8) {
        value5.removeEventListener?.("error", value14);
      }
      value5.removeAttribute("src");
    });
    return value4;
  },
});
registerComponent("time", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = fn(value2.fontSize, 12, 500, 96);
    const value4 = document.createElement("time");
    value4.className = "hb-time-component";
    value4.style.color = S(value2.color, "#248eb2");
    value4.style.fontSize = value3 + "px";
    value4.style.letterSpacing = fn(value2.letterSpacing, -20, 100, 2.2) + "px";
    value4.style.opacity = String(fn(value2.opacity, 0, 1, 1));
    const element = document.createElement("span");
    element.className = "hb-time-value";
    B(element, value2.fontWeight, value3);
    const element2 = document.createElement("small");
    element2.className = "hb-time-period";
    B(element2, value2.fontWeight, value3 * 0.5);
    value4.append(element, element2);
    const fn3 = () => {
      const value6 = new Date();
      const element3 = formatLocalTime(value2, value6);
      value4.dateTime = value6.toISOString();
      element.textContent = element3.value;
      element2.textContent = element3.suffix;
      element2.hidden = !element3.suffix;
    };
    fn3();
    const value5 = window.setInterval(
      fn3,
      value2.showSeconds === true ? 250 : 1000,
    );
    value.cleanup(() => window.clearInterval(value5));
    return value4;
  },
});
registerComponent("date", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = document.createElement("div");
    value3.className = "hb-date-component";
    value3.style.opacity = String(fn(value2.opacity, 0, 1, 1));
    value3.style.gap = fn(value2.lineGap, 0, 200, 8) + "px";
    const element = document.createElement("strong");
    element.className = "hb-date-primary";
    element.style.color = S(value2.primaryColor, "#8d9296");
    const value4 = fn(value2.primarySize, 12, 500, 36);
    element.style.fontSize = value4 + "px";
    B(element, value2.primaryWeight, value4);
    element.style.letterSpacing = fn(value2.primarySpacing, -20, 100, 1) + "px";
    value3.append(element);
    let element2 = null;
    if (value2.showLunar === true) {
      element2 = document.createElement("small");
      element2.className = "hb-date-lunar";
      element2.style.color = S(value2.lunarColor, "#7f878c");
      const value6 = fn(value2.lunarSize, 10, 500, 24);
      element2.style.fontSize = value6 + "px";
      B(element2, value2.lunarWeight, value6);
      element2.style.letterSpacing =
        fn(value2.lunarSpacing, -20, 100, 1) + "px";
      value3.append(element2);
    }
    const fn3 = () => {
      const value6 = new Date();
      element.textContent = formatLocalDate(value2, value6);
      if (element2) {
        element2.textContent = formatLunarDate(value6);
      }
    };
    fn3();
    const value5 = window.setInterval(fn3, 30000);
    value.cleanup(() => window.clearInterval(value5));
    return value3;
  },
});
registerComponent("weather", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.bindings?.entity?.entityId || "";
    const value4 = component.bindings?.sun?.entityId || "sun.sun";
    const value5 = value.states.get(value3);
    const value6 = value.states.get(value4)?.state || "";
    const value7 = value5?.attributes || {};
    const [value8, value9] = weatherVisual(value5?.state, value6);
    const value10 = document.createElement("div");
    value10.className = "hb-weather-component";
    value10.style.gap = fn(value2.iconGap, 0, 300, 22) + "px";
    value10.style.opacity = String(fn(value2.opacity, 0, 1, 1));
    if (value2.iconVisible !== false) {
      const value12 = document.createElement("img");
      value12.className = "hb-weather-icon";
      value12.src = meteoconUrl(value8);
      value12.alt = value9;
      value12.draggable = false;
      value12.style.width = fn(value2.iconSize, 12, 500, 64) + "px";
      value12.style.height = fn(value2.iconSize, 12, 500, 64) + "px";
      value10.append(value12);
    }
    const value11 = document.createElement("span");
    value11.className = "hb-weather-content";
    value11.style.gap = fn(value2.lineGap, 0, 200, 7) + "px";
    if (value2.temperatureVisible !== false) {
      const element = document.createElement("strong");
      const numeric = Number(value7.temperature);
      const text = String(
        value7.temperature_unit || value7.unit_of_measurement || "°C",
      );
      element.textContent = Number.isFinite(numeric)
        ? "" + numeric + text
        : "--" + text;
      element.style.color = S(value2.temperatureColor, "#aeb3b7");
      const value12 = fn(value2.temperatureSize, 12, 500, 32);
      element.style.fontSize = value12 + "px";
      B(element, value2.temperatureWeight, value12);
      element.style.letterSpacing =
        fn(value2.temperatureSpacing, -20, 100, 1) + "px";
      value11.append(element);
    }
    if (value2.conditionVisible !== false || value2.humidityVisible !== false) {
      const element = document.createElement("small");
      const value12 = [];
      if (value2.conditionVisible !== false) {
        value12.push(value9);
      }
      const numeric = Number(value7.humidity);
      if (value2.humidityVisible !== false) {
        value12.push(
          Number.isFinite(numeric) ? "湿度 " + numeric + "%" : "湿度 --",
        );
      }
      element.textContent = value12.join(" · ");
      element.style.color = S(value2.secondaryColor, "#8d9296");
      const value13 = fn(value2.secondarySize, 10, 500, 18);
      element.style.fontSize = value13 + "px";
      B(element, value2.secondaryWeight, value13);
      element.style.letterSpacing =
        fn(value2.secondarySpacing, -20, 100, 1) + "px";
      value11.append(element);
    }
    if (value11.childElementCount) {
      value10.append(value11);
    }
    return value10;
  },
});
registerComponent("line-chart", {
  render(component, value) {
    const value2 = component.properties || {};
    const value3 = component.bindings?.entity?.entityId || "";
    const value4 = value.states.get(value3);
    const text = String(value4?.attributes?.unit_of_measurement || "");
    const value5 = Number.parseFloat(value4?.state);
    const value6 = Te(value, value3, value5, value2.hours);
    const value7 = resolvedThresholds(
      value2.thresholds,
      value6,
      value2.thresholdMode,
    );
    const element = document.createElement("div");
    element.className = "hb-line-chart-component";
    element.style.borderRadius = fn(value2.cornerRadius, 0, 50, 10) + "%";
    const value8 = document.createElement("span");
    value8.className = "hb-line-chart-value";
    value8.hidden = value2.valueVisible === false;
    value8.style.color = S(value2.valueColor, "#dce1e5");
    value8.style.fontSize =
      Math.max(
        10,
        (Number(component.position?.height || 300) *
          0.12 *
          fn(value2.valueScale, 10, 500, 100)) /
          100,
      ) + "px";
    value8.style.left = 95 + fn(value2.valueOffsetX, -100, 100, 0) + "%";
    value8.style.top = 8 + fn(value2.valueOffsetY, -100, 100, 0) + "%";
    const element2 = document.createElement("strong");
    element2.textContent = formatLineChartValue(value5, value2.statePrecision);
    const element3 = document.createElement("small");
    element3.textContent = text;
    value8.append(element2, element3);
    element.append(value8);
    element.syncLineChartState = (value9) => {
      const value10 = Number.parseFloat(value9?.state);
      element2.textContent = formatLineChartValue(
        value10,
        value2.statePrecision,
      );
      element3.textContent = String(
        value9?.attributes?.unit_of_measurement || "",
      );
      element.style.setProperty(
        "--hb-chart-current-color",
        Number.isFinite(value10) ? thresholdColor(value7, value10) : "#68cc3e",
      );
    };
    const element4 = fn2(element, "svg", {
      viewBox: "0 0 100 70",
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    });
    element4.classList.add("hb-line-chart-graph");
    if (value6.length) {
      const value9 = lineChartGeometry(value6);
      const {
        minimum: value10,
        maximum: value11,
        span: value12,
        points: value13,
      } = value9;
      const value14 = smoothChartPath(value13);
      const value15 =
        (value.renderNamespace || "renderer") +
        "-chart-" +
        String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
      const value16 = fn2(element4, "defs");
      const value17 = fn2(value16, "linearGradient", {
        id: value15 + "-line",
        gradientUnits: "userSpaceOnUse",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 70,
      });
      const value18 = value7.length
        ? value7
        : [
            {
              value: value10,
              color: "#68cc3e",
            },
          ];
      for (const element5 of [...value18].sort(
        (element6, element7) => element7.value - element6.value,
      )) {
        fn2(value17, "stop", {
          offset:
            fn(((value11 - element5.value) / value12) * 100, 0, 100, 0) + "%",
          "stop-color": element5.color,
        });
      }
      fn2(element4, "path", {
        d: value14 + " L100 70 L0 70 Z",
        fill: "url(#" + value15 + "-line)",
        opacity: 0.18,
      });
      fn2(element4, "path", {
        d: value14,
        fill: "none",
        stroke: "url(#" + value15 + "-line)",
        "stroke-width": 1.6,
        "vector-effect": "non-scaling-stroke",
      });
      if (!value.editable) {
        const value19 = document.createElement("span");
        value19.className = "hb-line-chart-hover-layer";
        element.append(value19);
        const value20 = Le(
          value19,
          element,
          value9,
          text,
          (value21) => ({
            x: value21.x,
            y: (value21.y / 70) * 100,
          }),
          value2.statePrecision,
        );
        value.cleanup?.(value20);
      }
    } else {
      element.classList.add("history-loading");
    }
    element.style.setProperty(
      "--hb-chart-current-color",
      Number.isFinite(value5) ? thresholdColor(value7, value5) : "#68cc3e",
    );
    return element;
  },
});
export function renderLineChartDetails(component, value) {
  const value2 = component.bindings?.entity?.entityId || "";
  const value3 = value.states.get(value2);
  const text = String(value3?.attributes?.unit_of_measurement || "");
  const value4 = Number.parseFloat(value3?.state);
  const value5 = Te(value, value2, value4, component.properties?.hours);
  const value6 = document.createElement("section");
  value6.className = "hb-line-chart-details";
  const value7 = resolvedThresholds(
    component.properties?.thresholds,
    value5,
    component.properties?.thresholdMode,
  );
  value6.style.setProperty(
    "--hb-chart-current-color",
    Number.isFinite(value4) ? thresholdColor(value7, value4) : "#68cc3e",
  );
  value6.syncLineChartState = (value22) => {
    const value23 = Number.parseFloat(value22?.state);
    value6.style.setProperty(
      "--hb-chart-current-color",
      Number.isFinite(value23) ? thresholdColor(value7, value23) : "#68cc3e",
    );
  };
  if (!value5.length) {
    const element2 = document.createElement("p");
    element2.textContent = "暂无历史数据。";
    value6.append(element2);
    return value6;
  }
  const value8 = component.properties?.compactDetailsHorizontal === true;
  const value9 = value8 ? 790 : 720;
  const value10 = value8 ? 0 : 56;
  const value11 = 340 + value10;
  const left = value8 ? 44 : 66;
  const value12 = value8 ? 44 : 26;
  const value13 = {
    left: left,
    top: 24,
    width: value9 - left - value12,
    height: 258 + value10,
  };
  const value14 = lineChartGeometry(
    value5,
    value13.left,
    value13.top,
    value13.width,
    value13.height,
  );
  const value15 = fn2(value6, "svg", {
    viewBox: "0 0 " + value9 + " " + value11,
    preserveAspectRatio: "xMidYMid meet",
    role: "img",
    "aria-label": "带时间轴和数值轴的历史折线图",
  });
  const value16 =
    (value.renderNamespace || "renderer") +
    "-chart-details-" +
    String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
  const value17 = fn2(value15, "defs");
  const value18 = fn2(value17, "linearGradient", {
    id: value16 + "-line",
    gradientUnits: "userSpaceOnUse",
    x1: 0,
    y1: value13.top,
    x2: 0,
    y2: value13.top + value13.height,
  });
  const value19 = value7.length
    ? value7
    : [
        {
          value: value14.minimum,
          color: "#68cc3e",
        },
      ];
  for (const element2 of [...value19].sort(
    (element3, element4) => element4.value - element3.value,
  )) {
    fn2(value18, "stop", {
      offset:
        fn(
          ((value14.maximum - element2.value) / value14.span) * 100,
          0,
          100,
          0,
        ) + "%",
      "stop-color": element2.color,
    });
  }
  for (let value22 = 0; value22 <= 4; value22 += 1) {
    const value23 = value22 / 4;
    const y1 = value13.top + value23 * value13.height;
    const value24 = value14.maximum - value23 * value14.span;
    fn2(value15, "line", {
      x1: value13.left,
      y1: y1,
      x2: value13.left + value13.width,
      y2: y1,
      class: "hb-line-chart-details-grid",
    });
    const element2 = fn2(value15, "text", {
      x: value13.left - (value8 ? 8 : 12),
      y: y1 + 4,
      "text-anchor": "end",
      class: "hb-line-chart-details-axis-label",
    });
    element2.textContent = formatLineChartValue(
      value24,
      component.properties?.statePrecision,
    );
  }
  const value20 = Number(component.properties?.hours || 24) > 24;
  for (let value22 = 0; value22 <= 5; value22 += 1) {
    const value23 = value22 / 5;
    const x1 = value13.left + value23 * value13.width;
    const value24 =
      value14.firstTime + value23 * (value14.lastTime - value14.firstTime);
    fn2(value15, "line", {
      x1: x1,
      y1: value13.top,
      x2: x1,
      y2: value13.top + value13.height,
      class: "hb-line-chart-details-grid vertical",
    });
    const element2 = fn2(value15, "text", {
      x: x1,
      y: value13.top + value13.height + 25,
      "text-anchor": "middle",
      class: "hb-line-chart-details-axis-label",
    });
    element2.textContent = ke(value24, value20);
  }
  fn2(value15, "line", {
    x1: value13.left,
    y1: value13.top,
    x2: value13.left,
    y2: value13.top + value13.height,
    class: "hb-line-chart-details-axis",
  });
  fn2(value15, "line", {
    x1: value13.left,
    y1: value13.top + value13.height,
    x2: value13.left + value13.width,
    y2: value13.top + value13.height,
    class: "hb-line-chart-details-axis",
  });
  const element = fn2(value15, "text", {
    x: value13.left,
    y: 20,
    class: "hb-line-chart-details-axis-title",
  });
  element.textContent = text || "数值";
  const path = smoothChartPath(value14.points);
  fn2(value15, "path", {
    d:
      path +
      " L" +
      (value13.left + value13.width) +
      " " +
      (value13.top + value13.height) +
      " L" +
      value13.left +
      " " +
      (value13.top + value13.height) +
      " Z",
    fill: "url(#" + value16 + "-line)",
    opacity: 0.12,
    class: "hb-line-chart-details-fill",
  });
  fn2(value15, "path", {
    d: path,
    fill: "none",
    stroke: "url(#" + value16 + "-line)",
    "stroke-width": 2.4,
    pathLength: 100,
    "vector-effect": "non-scaling-stroke",
    class: "hb-line-chart-details-line",
  });
  const value21 = fn2(value15, "circle", {
    cx: 0,
    cy: 0,
    r: 4.2,
    class: "hb-line-chart-details-lead-dot",
  });
  if (value.animate !== false) {
    fn2(value21, "animateMotion", {
      path: path,
      dur: "1.1s",
      begin: ".28s",
      fill: "freeze",
    });
  }
  value6.cleanupLineChartHover = () => {};
  if (value.interactive !== false) {
    value6.cleanupLineChartHover = Le(
      value15,
      value6,
      value14,
      text,
      (value22) => ({
        x: (value22.x / value9) * 100,
        y: (value22.y / value11) * 100,
      }),
      component.properties?.statePrecision,
      {
        start: value13.left / value9,
        end: (value13.left + value13.width) / value9,
      },
      value6,
    );
  }
  return value6;
}
registerComponent("panel-frame", {
  render(component, value) {
    const value2 = component.properties || {};
    const x2 = Math.max(20, Number(component.position?.width || 528));
    const count = Math.max(20, Number(component.position?.height || 300));
    const value3 = fn(value2.edgeWidth, 0, 20, 0.9);
    const count2 = Math.max(0.5, value3 / 2 + 0.5);
    const width = Math.max(1, x2 - count2 * 2);
    const height = Math.max(1, count - count2 * 2);
    const rx = Math.min(width, height) * fn(value2.radius, 0, 0.5, 0.195);
    const value4 = fn(value2.edgeOpacity, 0, 1, 1);
    const value5 = fn(value2.glowStrength, 0, 5, 0.5);
    const value6 = fn(value2.glowSize, 0, 3, 1.5);
    const value7 = Math.min(width, height) * 0.22 * value6;
    const stdDeviation = Math.min(width, height) * 0.06 * value6;
    const value8 = S(value2.edgeColor, "#d4d4d4");
    const value9 = S(value2.glowColor, "#ffffff");
    const value10 =
      (value.renderNamespace || "renderer") +
      "-frame-" +
      String(component.id || "").replace(/[^a-z0-9_-]/gi, "");
    const value11 = document.createElement("div");
    value11.className = "hb-panel-frame-component";
    const value12 = fn2(value11, "svg", {
      viewBox: "0 0 " + x2 + " " + count,
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    });
    const value13 = fn2(value12, "defs");
    const value14 = fn2(value13, "linearGradient", {
      id: value10 + "-glass",
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
    });
    fn2(value14, "stop", {
      offset: 0,
      "stop-color": value9,
      "stop-opacity": Math.min(0.35, value5 * 0.035),
    });
    fn2(value14, "stop", {
      offset: 0.52,
      "stop-color": value9,
      "stop-opacity": Math.min(0.12, value5 * 0.01),
    });
    fn2(value14, "stop", {
      offset: 1,
      "stop-color": value9,
      "stop-opacity": Math.min(0.25, value5 * 0.025),
    });
    const value15 = fn2(value13, "linearGradient", {
      id: value10 + "-edge",
      gradientUnits: "userSpaceOnUse",
      x1: 0,
      y1: count / 2,
      x2: x2,
      y2: count / 2,
      gradientTransform:
        "rotate(" +
        fn(value2.edgeAngle, 0, 360, 45) +
        " " +
        x2 / 2 +
        " " +
        count / 2 +
        ")",
    });
    for (const [offset, value27] of [
      [0, 0.96],
      [0.22, 0.72],
      [0.52, 0.3],
      [0.78, 0.66],
      [1, 0.42],
    ]) {
      fn2(value15, "stop", {
        offset: offset,
        "stop-color": value8,
        "stop-opacity": value27 * value4,
      });
    }
    const value16 = fn2(value13, "linearGradient", {
      id: value10 + "-glow",
      gradientUnits: "userSpaceOnUse",
      x1: 0,
      y1: count / 2,
      x2: x2,
      y2: count / 2,
      gradientTransform:
        "rotate(" +
        fn(value2.glowAngle, 0, 360, 242) +
        " " +
        x2 / 2 +
        " " +
        count / 2 +
        ")",
    });
    for (const [offset, value27] of [
      [0, 0.32],
      [0.42, 0.09],
      [0.72, 0.05],
      [1, 0.22],
    ]) {
      fn2(value16, "stop", {
        offset: offset,
        "stop-color": value9,
        "stop-opacity": Math.min(1, value27 * value5),
      });
    }
    const value17 = fn2(value13, "clipPath", {
      id: value10 + "-clip",
    });
    fn2(value17, "rect", {
      x: count2,
      y: count2,
      width: width,
      height: height,
      rx: rx,
    });
    const value18 = fn2(value13, "filter", {
      id: value10 + "-blur",
      x: "-35%",
      y: "-55%",
      width: "170%",
      height: "210%",
    });
    fn2(value18, "feGaussianBlur", {
      stdDeviation: stdDeviation,
    });
    if (value2.glowVisible !== false) {
      const value27 = fn2(value12, "g", {
        "clip-path": "url(#" + value10 + "-clip)",
      });
      fn2(value27, "rect", {
        x: count2,
        y: count2,
        width: width,
        height: height,
        rx: rx,
        fill: "url(#" + value10 + "-glass)",
      });
      if (value7 > 0 && value5 > 0) {
        fn2(value27, "rect", {
          x: count2,
          y: count2,
          width: width,
          height: height,
          rx: rx,
          fill: "none",
          stroke: "url(#" + value10 + "-glow)",
          "stroke-width": value7,
          filter: "url(#" + value10 + "-blur)",
        });
      }
    }
    if (value2.edgeVisible !== false) {
      fn2(value12, "rect", {
        x: count2,
        y: count2,
        width: width,
        height: height,
        rx: rx,
        fill: "none",
        stroke: "url(#" + value10 + "-edge)",
        "stroke-width": value3,
      });
    }
    const value19 = fn(value2.textLeft, -100, 200, 5.2);
    const value20 = fn(value2.textTop, -100, 200, 28);
    const value21 = (x2 * fn(value2.mainTextLeft, -100, 200, value19)) / 100;
    const value22 =
      (count *
        fn(
          value2.mainTextTop,
          -100,
          200,
          value20 - (fn(value2.lineGap, 0, 500, 24) / count) * 100,
        )) /
      100;
    const value23 =
      (x2 * fn(value2.secondaryTextLeft, -100, 200, value19)) / 100;
    const value24 =
      (count * fn(value2.secondaryTextTop, -100, 200, value20)) / 100;
    const value25 = fn(value2.mainOpacity, 0, 1, 0.72);
    const value26 = fn(value2.secondaryOpacity, 0, 1, 0.36);
    if (value2.mainTextVisible !== false) {
      const element = fn2(value12, "text", {
        x: value21,
        y: value22,
        "text-anchor": "start",
        fill: S(value2.mainColor, "#ffffff"),
        "fill-opacity": value25,
        "font-family": "PingFang SC,Noto Sans SC,Microsoft YaHei,sans-serif",
        "font-size": fn(value2.mainSize, 8, 500, 30),
        "font-weight": 300,
        "letter-spacing": fn(value2.mainSpacing, -20, 100, 2),
      });
      const value27 = fn(value2.mainWeight, 0, 3, 0);
      if (value27 > 0) {
        Object.entries({
          stroke: S(value2.mainColor, "#ffffff"),
          "stroke-opacity": value25,
          "stroke-width": value27,
          "paint-order": "stroke fill",
        }).forEach(([value28, value29]) =>
          element.setAttribute(value28, value29),
        );
      }
      element.textContent = String(value2.mainText || "");
    }
    if (value2.secondaryTextVisible !== false) {
      const element = fn2(value12, "text", {
        x: value23,
        y: value24,
        "text-anchor": "start",
        fill: S(value2.secondaryColor, "#ffffff"),
        "fill-opacity": value26,
        "font-family": "Helvetica Neue,Arial,sans-serif",
        "font-size": fn(value2.secondarySize, 6, 500, 15),
        "font-weight": 300,
        "letter-spacing": fn(value2.secondarySpacing, -20, 100, 2.1),
      });
      const value27 = fn(value2.secondaryWeight, 0, 3, 0);
      if (value27 > 0) {
        Object.entries({
          stroke: S(value2.secondaryColor, "#ffffff"),
          "stroke-opacity": value26,
          "stroke-width": value27,
          "paint-order": "stroke fill",
        }).forEach(([value28, value29]) =>
          element.setAttribute(value28, value29),
        );
      }
      element.textContent = String(value2.secondaryText || "");
    }
    return value11;
  },
});
export function componentContentUnitsPx(value, value2) {
  const count = Math.max(
    0.01,
    Number(value2?.document?.canvas?.componentScale || 1),
  );
  return {
    width: Math.max(1, Number(value?.position?.width || 100)) / count / 100,
    height: Math.max(1, Number(value?.position?.height || 100)) / count / 100,
  };
}
export function navigationContentUnitPx(value, value2) {
  return (componentContentUnitsPx(value, value2).height * 100) / 64.36;
}
registerComponent("navigation-button", {
  render(component, value) {
    const value2 = component.properties || {};
    const targetPage =
      ["tap", "doubleTap", "hold"]
        .map((value21) => component.actions?.[value21])
        .find((value21) => value21?.type === "navigate" && value21.target)
        ?.target ||
      value2.targetPage ||
      "";
    const entityId = component.bindings?.entity?.entityId || "";
    const previewState =
      value.editable && ["off", "on"].includes(value.previewState)
        ? value.previewState
        : "auto";
    const entityActive =
      !!entityId &&
      !!ae(component, entityId, value.states?.get(entityId), value);
    const value3 = navigationButtonIsActive({
      targetPage: targetPage,
      currentPagePath: value.page?.path || "",
      entityId: entityId,
      entityActive: entityActive,
      previewState: previewState,
    });
    const value4 = fn(
      value3
        ? (value2.textActiveOpacity ?? value2.activeOpacity)
        : (value2.textIdleOpacity ?? value2.idleOpacity),
      0,
      1,
      value3 ? 0.96 : 0.3,
    );
    const value5 = fn(
      value3
        ? (value2.iconActiveOpacity ?? value2.activeOpacity)
        : (value2.iconIdleOpacity ?? value2.idleOpacity),
      0,
      1,
      value3 ? 0.96 : 0.3,
    );
    const value6 = fn(
      value3 ? value2.frameActiveOpacity : value2.frameIdleOpacity,
      0,
      1,
      value3 ? 0.98 : 0.48,
    );
    const value7 = fn(
      value3 ? value2.glowActiveStrength : value2.glowIdleStrength,
      0,
      5,
      value3 ? 2.2 : 0.5,
    );
    const value8 = fn(
      value3 ? value2.glowActiveSize : value2.glowIdleSize,
      0,
      3,
      value3 ? 3 : 1.5,
    );
    const value9 = S(value2.mainColor, "#e9edf0");
    const value10 = S(value2.secondaryColor, "#e9edf0");
    const value11 = 100 / 64.36;
    const value12 = navigationContentUnitPx(component, value);
    const value13 = fn(value2.textLeft, -100, 200, 27.5);
    const value14 = fn(value2.textTop, -100, 200, 81.5);
    const value15 = fn(value2.mainTextLeft, -100, 200, value13);
    const value16 = fn(value2.mainTextTop, -100, 200, value14 - value11 * 18);
    const value17 = fn(value2.secondaryTextLeft, -100, 200, value13);
    const value18 = fn(value2.secondaryTextTop, -100, 200, value14);
    const value19 = document.createElement("div");
    value19.className = "hb-navigation-button" + (value3 ? " active" : "");
    value19.dataset.targetPage = targetPage;
    value19.style.setProperty("--navigation-text-opacity", String(value4));
    value19.style.setProperty("--navigation-icon-opacity", String(value5));
    value19.style.setProperty(
      "--navigation-icon-size",
      fn(value2.iconSize, 1, 500, 50) * value12 + "px",
    );
    value19.style.setProperty(
      "--navigation-icon-left",
      fn(value2.iconLeft, -100, 200, 14) + "%",
    );
    value19.style.setProperty(
      "--navigation-icon-top",
      fn(value2.iconTop, -100, 200, 50) + "%",
    );
    value19.style.setProperty(
      "--navigation-main-size",
      fn(value2.mainSize, 1, 500, 30) * value12 + "px",
    );
    value19.style.setProperty(
      "--navigation-secondary-size",
      fn(value2.secondarySize, 1, 500, 11) * value12 + "px",
    );
    value19.style.setProperty(
      "--navigation-main-spacing",
      fn(value2.mainSpacing, -20, 100, 8) * value12 + "px",
    );
    value19.style.setProperty(
      "--navigation-secondary-spacing",
      fn(value2.secondarySpacing, -20, 100, 3) * value12 + "px",
    );
    value19.style.setProperty("--navigation-main-left", value15 + "%");
    value19.style.setProperty("--navigation-secondary-left", value17 + "%");
    value19.style.setProperty("--navigation-main-top", value16 + "%");
    value19.style.setProperty("--navigation-secondary-top", value18 + "%");
    if (value2.glowVisible !== false || value2.frameVisible !== false) {
      value19.append(ct(component, value2, value3, value6, value7, value8));
    }
    if (value2.iconVisible !== false) {
      const value21 = K(value2.icon || "mdi:home-lightbulb-outline");
      if (value21) {
        const value22 = document.createElement("i");
        value22.className = "hb-navigation-icon";
        value22.setAttribute("aria-hidden", "true");
        value22.style.backgroundColor = S(value2.iconColor, "#e9edf0");
        value22.style.maskImage = 'url("' + value21 + '")';
        value22.style.webkitMaskImage = 'url("' + value21 + '")';
        value19.append(value22);
      }
    }
    const value20 = document.createElement("span");
    value20.className = "hb-navigation-text";
    if (value2.mainTextVisible !== false) {
      const element = document.createElement("strong");
      element.textContent = value2.mainText || "页面导航";
      element.style.color = value9;
      element.style.webkitTextStrokeColor = value9;
      element.style.webkitTextStrokeWidth =
        fn(value2.mainWeight, 0, 3, 0) * value12 + "px";
      value20.append(element);
    }
    if (value2.secondaryTextVisible !== false) {
      const element = document.createElement("small");
      element.textContent = value2.secondaryText || "NAVIGATION";
      element.style.color = value10;
      element.style.webkitTextStrokeColor = value10;
      element.style.webkitTextStrokeWidth =
        fn(value2.secondaryWeight, 0, 3, 0) * value12 + "px";
      value20.append(element);
    }
    if (value20.childElementCount) {
      value19.append(value20);
    }
    return value19;
  },
});
