export function relativeLightColorTemperature(minKelvin, maxKelvin, percent) {
  const minimum = Number(minKelvin);
  const maximum = Number(maxKelvin);
  const ratio = Math.max(0, Math.min(100, Number(percent) || 0)) / 100;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum <= minimum) {
    if (Number.isFinite(minimum)) {
      return minimum;
    } else {
      return 2700;
    }
  } else {
    return minimum + (maximum - minimum) * ratio;
  }
}
export function lightVisualValueForCapability(supported, realtimeValue, fallbackValue) {
  const numeric = Number(realtimeValue);
  if (supported && Number.isFinite(numeric)) {
    return numeric;
  } else {
    return Number(fallbackValue);
  }
}
const COLOR_MODES = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]);
function parseSupportedColorModes(attributes = {}) {
  const list = Array.isArray(attributes?.supported_color_modes) ? attributes.supported_color_modes.map(mode => String(mode || "").trim().toLowerCase()).filter(Boolean) : [];
  if (list.length) {
    return list;
  } else if (Array.isArray(attributes?.hs_color) || Array.isArray(attributes?.rgb_color)) {
    return ["hs"];
  } else {
    return list;
  }
}
export function lightSupportsColor(attributes = {}) {
  return parseSupportedColorModes(attributes).some(mode => COLOR_MODES.has(mode));
}
export function lightRealtimeCapabilities(entityId = "", entityOrEvent = {}) {
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  const attributes = stateEntry?.attributes || {};
  const isLight = String(entityId || stateEntry.entityId || stateEntry.domain || "").split(".", 1)[0] === "light";
  const supportedModes = Array.isArray(attributes.supported_color_modes) ? attributes.supported_color_modes : [];
  const supportedFeatures = Number(attributes.supported_features || 0);
  const hasFiniteAttribute = key => attributes[key] !== null && attributes[key] !== undefined && Number.isFinite(Number(attributes[key]));
  return {
    brightness: isLight && (hasFiniteAttribute("brightness") || supportedModes.some(mode => mode !== "onoff") || (supportedFeatures & 1) === 1),
    colorTemperature: isLight && (supportedModes.includes("color_temp") || hasFiniteAttribute("color_temp_kelvin") || hasFiniteAttribute("min_color_temp_kelvin") || hasFiniteAttribute("max_color_temp_kelvin") || hasFiniteAttribute("color_temp") || (supportedFeatures & 2) === 2)
  };
}
export function rgbToHsColor(rgb) {
  if (!Array.isArray(rgb) || rgb.length < 3) {
    return null;
  }
  const channels = rgb.slice(0, 3).map(channel => Math.max(0, Math.min(255, Number(channel) || 0)) / 255);
  const max = Math.max(...channels);
  const min = Math.min(...channels);
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === channels[0]) {
      hue = (channels[1] - channels[2]) / delta % 6 * 60;
    } else if (max === channels[1]) {
      hue = ((channels[2] - channels[0]) / delta + 2) * 60;
    } else {
      hue = ((channels[0] - channels[1]) / delta + 4) * 60;
    }
  }
  if (hue < 0) {
    hue += 360;
  }
  const saturation = max <= 0 ? 0 : delta / max;
  return [hue, saturation * 100];
}
export function hsToRgbColor(hs) {
  if (!Array.isArray(hs) || hs.length < 2) {
    return null;
  }
  const hue = ((Number(hs[0]) || 0) % 360 + 360) % 360;
  const saturation = Math.max(0, Math.min(100, Number(hs[1]) || 0)) / 100;
  const value = 1;
  const chroma = value * saturation;
  const sector = hue / 60;
  const secondary = chroma * (1 - Math.abs(sector % 2 - 1));
  const match = value - chroma;
  const [red, green, blue] = sector < 1 ? [chroma, secondary, 0] : sector < 2 ? [secondary, chroma, 0] : sector < 3 ? [0, chroma, secondary] : sector < 4 ? [0, secondary, chroma] : sector < 5 ? [secondary, 0, chroma] : [chroma, 0, secondary];
  return [red, green, blue].map(channel => Math.round((channel + match) * 255));
}
export function lightColorPickerHsFromPoint(normalizedPointX, normalizedPointY) {
  const normalizedX = Math.max(0, Math.min(1, Number(normalizedPointX) || 0));
  const normalizedY = Math.max(0, Math.min(1, Number(normalizedPointY) || 0));
  const offsetX = normalizedX - 0.5;
  const offsetY = normalizedY - 0.5;
  const saturation = Math.min(1, Math.hypot(offsetX / 0.36, offsetY / 0.36));
  return [((Math.atan2(offsetY, offsetX) * 180 / Math.PI + 360) % 360 + 90) % 360, saturation * 100];
}
export function lightColorPickerPointFromHs(hs) {
  const hue = ((Number(hs?.[0]) || 0) % 360 + 360) % 360;
  const saturation = Math.max(0, Math.min(100, Number(hs?.[1]) || 0)) / 100;
  const radians = (hue - 90) * Math.PI / 180;
  return {
    x: Math.max(0, Math.min(1, 0.5 + Math.cos(radians) * saturation * 0.36)),
    y: Math.max(0, Math.min(1, 0.5 + Math.sin(radians) * saturation * 0.36))
  };
}
export function lightColorServiceData(attributes, hs) {
  const supportedModes = parseSupportedColorModes(attributes);
  const hs_color = [Math.round(((Number(hs?.[0]) || 0) % 360 + 360) % 360), Math.round(Math.max(0, Math.min(100, Number(hs?.[1]) || 0)))];
  if (supportedModes.includes("hs") || supportedModes.includes("xy") || !supportedModes.includes("rgb")) {
    return {
      hs_color
    };
  } else {
    return {
      rgb_color: hsToRgbColor(hs_color)
    };
  }
}
export const UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN = 4600;
export const UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT = 100;
export function lightPresetBrightnessServiceData(percent) {
  const brightness_pct = Math.max(1, Math.min(100, Math.round(Number(percent) || 1)));
  if (brightness_pct === 100) {
    return {
      brightness: 255
    };
  } else {
    return {
      brightness_pct
    };
  }
}
export const LIGHT_DETAIL_PRESET_DEFINITIONS = Object.freeze([Object.freeze({
  label: "柔和",
  detail: "25%",
  brightnessPercent: 25,
  colorTemperaturePercent: 10
}), Object.freeze({
  label: "日常",
  detail: "60%",
  brightnessPercent: 60,
  colorTemperaturePercent: 50
}), Object.freeze({
  label: "明亮",
  detail: "100%",
  brightnessPercent: 100,
  colorTemperaturePercent: 100
})]);
export const LIGHT_PRESET_MINIMUM_HOLD_MS = 8000;
export const LIGHT_PRESET_STABLE_CONFIRMATION_MS = 1200;
export const LIGHT_PRESET_MAXIMUM_HOLD_MS = 12000;
export function lightPresetPendingDecision(pending, now = Date.now()) {
  if (!pending) {
    return "idle";
  }
  const timestamp = Number(now) || 0;
  if (timestamp >= Number(pending.expiresAt || 0)) {
    return "timeout";
  }
  if (!pending.latestMatches || !Number.isFinite(Number(pending.matchStartedAt))) {
    return "hold";
  }
  const heldLongEnough = timestamp >= Number(pending.minimumHoldUntil || 0);
  const stableLongEnough = timestamp - Number(pending.matchStartedAt) >= LIGHT_PRESET_STABLE_CONFIRMATION_MS;
  if (heldLongEnough && stableLongEnough) {
    return "confirmed";
  } else {
    return "hold";
  }
}
