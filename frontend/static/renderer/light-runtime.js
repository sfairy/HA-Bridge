export function relativeLightColorTemperature(value, value2, value3) {
  const numeric = Number(value);
  const numeric2 = Number(value2);
  const value4 = Math.max(0, Math.min(100, Number(value3) || 0)) / 100;
  if (
    !Number.isFinite(numeric) ||
    !Number.isFinite(numeric2) ||
    numeric2 <= numeric
  ) {
    if (Number.isFinite(numeric)) {
      return numeric;
    } else {
      return 2700;
    }
  } else {
    return numeric + (numeric2 - numeric) * value4;
  }
}
export function lightVisualValueForCapability(value, value2, value3) {
  const numeric = Number(value2);
  if (value && Number.isFinite(numeric)) {
    return numeric;
  } else {
    return Number(value3);
  }
}
const bag = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]);
function parseSupportedColorModes(value = {}) {
  const list = Array.isArray(value?.supported_color_modes)
    ? value.supported_color_modes
        .map((value2) =>
          String(value2 || "")
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean)
    : [];
  if (list.length) {
    return list;
  } else if (
    Array.isArray(value?.hs_color) ||
    Array.isArray(value?.rgb_color)
  ) {
    return ["hs"];
  } else {
    return list;
  }
}
export function lightSupportsColor(value = {}) {
  return parseSupportedColorModes(value).some((value2) => bag.has(value2));
}
export function lightRealtimeCapabilities(value = "", value2 = {}) {
  const metadata = value2?.newState || value2 || {};
  const value4 = metadata?.attributes || {};
  const value5 =
    String(value || metadata.entityId || metadata.domain || "").split(
      ".",
      1,
    )[0] === "light";
  const list = Array.isArray(value4.supported_color_modes)
    ? value4.supported_color_modes
    : [];
  const numeric = Number(value4.supported_features || 0);
  const fn2 = (value6) =>
    value4[value6] !== null &&
    value4[value6] !== undefined &&
    Number.isFinite(Number(value4[value6]));
  return {
    brightness:
      value5 &&
      (fn2("brightness") ||
        list.some((value6) => value6 !== "onoff") ||
        (numeric & 1) === 1),
    colorTemperature:
      value5 &&
      (list.includes("color_temp") ||
        fn2("color_temp_kelvin") ||
        fn2("min_color_temp_kelvin") ||
        fn2("max_color_temp_kelvin") ||
        fn2("color_temp") ||
        (numeric & 2) === 2),
  };
}
export function rgbToHsColor(value) {
  if (!Array.isArray(value) || value.length < 3) {
    return null;
  }
  const value2 = value
    .slice(0, 3)
    .map((value7) => Math.max(0, Math.min(255, Number(value7) || 0)) / 255);
  const count = Math.max(...value2);
  const value3 = Math.min(...value2);
  const value4 = count - value3;
  let value5 = 0;
  if (value4 > 0) {
    if (count === value2[0]) {
      value5 = (((value2[1] - value2[2]) / value4) % 6) * 60;
    } else if (count === value2[1]) {
      value5 = ((value2[2] - value2[0]) / value4 + 2) * 60;
    } else {
      value5 = ((value2[0] - value2[1]) / value4 + 4) * 60;
    }
  }
  if (value5 < 0) {
    value5 += 360;
  }
  const value6 = count <= 0 ? 0 : value4 / count;
  return [value5, value6 * 100];
}
export function hsToRgbColor(value) {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }
  const value2 = (((Number(value[0]) || 0) % 360) + 360) % 360;
  const value3 = Math.max(0, Math.min(100, Number(value[1]) || 0)) / 100;
  const value4 = 1;
  const value5 = value4 * value3;
  const value6 = value2 / 60;
  const value7 = value5 * (1 - Math.abs((value6 % 2) - 1));
  const value8 = value4 - value5;
  const [value9, value10, value11] =
    value6 < 1
      ? [value5, value7, 0]
      : value6 < 2
        ? [value7, value5, 0]
        : value6 < 3
          ? [0, value5, value7]
          : value6 < 4
            ? [0, value7, value5]
            : value6 < 5
              ? [value7, 0, value5]
              : [value5, 0, value7];
  return [value9, value10, value11].map((value12) =>
    Math.round((value12 + value8) * 255),
  );
}
export function lightColorPickerHsFromPoint(value, value2) {
  const count = Math.max(0, Math.min(1, Number(value) || 0));
  const count2 = Math.max(0, Math.min(1, Number(value2) || 0));
  const value3 = count - 0.5;
  const value4 = count2 - 0.5;
  const value5 = Math.min(1, Math.hypot(value3 / 0.36, value4 / 0.36));
  return [
    ((((Math.atan2(value4, value3) * 180) / Math.PI + 360) % 360) + 90) % 360,
    value5 * 100,
  ];
}
export function lightColorPickerPointFromHs(value) {
  const value2 = (((Number(value?.[0]) || 0) % 360) + 360) % 360;
  const value3 = Math.max(0, Math.min(100, Number(value?.[1]) || 0)) / 100;
  const value4 = ((value2 - 90) * Math.PI) / 180;
  return {
    x: Math.max(0, Math.min(1, 0.5 + Math.cos(value4) * value3 * 0.36)),
    y: Math.max(0, Math.min(1, 0.5 + Math.sin(value4) * value3 * 0.36)),
  };
}
export function lightColorServiceData(value, value2) {
  const value3 = parseSupportedColorModes(value);
  const hs_color = [
    Math.round((((Number(value2?.[0]) || 0) % 360) + 360) % 360),
    Math.round(Math.max(0, Math.min(100, Number(value2?.[1]) || 0))),
  ];
  if (
    value3.includes("hs") ||
    value3.includes("xy") ||
    !value3.includes("rgb")
  ) {
    return {
      hs_color: hs_color,
    };
  } else {
    return {
      rgb_color: hsToRgbColor(hs_color),
    };
  }
}
export const UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN = 4600;
export const UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT = 100;
export function lightPresetBrightnessServiceData(value) {
  const brightness_pct = Math.max(
    1,
    Math.min(100, Math.round(Number(value) || 1)),
  );
  if (brightness_pct === 100) {
    return {
      brightness: 255,
    };
  } else {
    return {
      brightness_pct: brightness_pct,
    };
  }
}
export const LIGHT_DETAIL_PRESET_DEFINITIONS = Object.freeze([
  Object.freeze({
    label: "柔和",
    detail: "25%",
    brightnessPercent: 25,
    colorTemperaturePercent: 10,
  }),
  Object.freeze({
    label: "日常",
    detail: "60%",
    brightnessPercent: 60,
    colorTemperaturePercent: 50,
  }),
  Object.freeze({
    label: "明亮",
    detail: "100%",
    brightnessPercent: 100,
    colorTemperaturePercent: 100,
  }),
]);
export const LIGHT_PRESET_MINIMUM_HOLD_MS = 8000;
export const LIGHT_PRESET_STABLE_CONFIRMATION_MS = 1200;
export const LIGHT_PRESET_MAXIMUM_HOLD_MS = 12000;
export function lightPresetPendingDecision(value, value2 = Date.now()) {
  if (!value) {
    return "idle";
  }
  const value3 = Number(value2) || 0;
  if (value3 >= Number(value.expiresAt || 0)) {
    return "timeout";
  }
  if (!value.latestMatches || !Number.isFinite(Number(value.matchStartedAt))) {
    return "hold";
  }
  const value4 = value3 >= Number(value.minimumHoldUntil || 0);
  const value5 =
    value3 - Number(value.matchStartedAt) >=
    LIGHT_PRESET_STABLE_CONFIRMATION_MS;
  if (value4 && value5) {
    return "confirmed";
  } else {
    return "hold";
  }
}
