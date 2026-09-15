export function relativeLightColorTemperature(minimumKelvin, maximumKelvin, relativePercent) {
  const parsedMinimumKelvin = Number(minimumKelvin);
  const parsedMaximumKelvin = Number(maximumKelvin);
  const relativeRatio = Math.max(0, Math.min(100, Number(relativePercent) || 0)) / 100;
  if (
    !Number.isFinite(parsedMinimumKelvin) ||
    !Number.isFinite(parsedMaximumKelvin) ||
    parsedMaximumKelvin <= parsedMinimumKelvin
  ) {
    if (Number.isFinite(parsedMinimumKelvin)) {
      return parsedMinimumKelvin;
    } else {
      return 2700;
    }
  } else {
    return parsedMinimumKelvin + (parsedMaximumKelvin - parsedMinimumKelvin) * relativeRatio;
  }
}
export function lightVisualValueForCapability(
  isCapabilitySupported,
  capabilityValue,
  fallbackValue
) {
  const numericCapabilityValue = Number(capabilityValue);
  if (isCapabilitySupported && Number.isFinite(numericCapabilityValue)) {
    return numericCapabilityValue;
  } else {
    return Number(fallbackValue);
  }
}
const COLOR_CAPABLE_MODES_SET = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]);
function resolveSupportedColorModes(attributes = {}) {
  const normalizedColorModes = Array.isArray(attributes?.supported_color_modes)
    ? attributes.supported_color_modes
        .map(declaredMode =>
          String(declaredMode || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    : [];
  if (normalizedColorModes.length) {
    return normalizedColorModes;
  } else if (Array.isArray(attributes?.hs_color) || Array.isArray(attributes?.rgb_color)) {
    return ["hs"];
  } else {
    return normalizedColorModes;
  }
}
export function lightSupportsColor(entityAttributes = {}) {
  return resolveSupportedColorModes(entityAttributes).some(colorMode =>
    COLOR_CAPABLE_MODES_SET.has(colorMode)
  );
}
export function lightRealtimeCapabilities(entityId = "", entityState = {}) {
  const stateObject = entityState?.newState || entityState || {};
  const stateAttributes = stateObject?.attributes || {};
  const isLightEntity =
    String(entityId || stateObject.entityId || stateObject.domain || "").split(".", 1)[0] ===
    "light";
  const declaredColorModes = Array.isArray(stateAttributes.supported_color_modes)
    ? stateAttributes.supported_color_modes
    : [];
  const supportedFeatures = Number(stateAttributes.supported_features || 0);
  const hasNumericAttribute = attributeName =>
    stateAttributes[attributeName] !== null &&
    stateAttributes[attributeName] !== undefined &&
    Number.isFinite(Number(stateAttributes[attributeName]));
  return {
    brightness:
      isLightEntity &&
      (hasNumericAttribute("brightness") ||
        declaredColorModes.some(supportedMode => supportedMode !== "onoff") ||
        (supportedFeatures & 1) === 1),
    colorTemperature:
      isLightEntity &&
      (declaredColorModes.includes("color_temp") ||
        hasNumericAttribute("color_temp_kelvin") ||
        hasNumericAttribute("min_color_temp_kelvin") ||
        hasNumericAttribute("max_color_temp_kelvin") ||
        hasNumericAttribute("color_temp") ||
        (supportedFeatures & 2) === 2)
  };
}
export function rgbToHsColor(rgbColor) {
  if (!Array.isArray(rgbColor) || rgbColor.length < 3) {
    return null;
  }
  const normalizedChannels = rgbColor
    .slice(0, 3)
    .map(channelValue => Math.max(0, Math.min(255, Number(channelValue) || 0)) / 255);
  const maximumChannel = Math.max(...normalizedChannels);
  const minimumChannel = Math.min(...normalizedChannels);
  const channelRange = maximumChannel - minimumChannel;
  let hueDegrees = 0;
  if (channelRange > 0) {
    if (maximumChannel === normalizedChannels[0]) {
      hueDegrees = (((normalizedChannels[1] - normalizedChannels[2]) / channelRange) % 6) * 60;
    } else if (maximumChannel === normalizedChannels[1]) {
      hueDegrees = ((normalizedChannels[2] - normalizedChannels[0]) / channelRange + 2) * 60;
    } else {
      hueDegrees = ((normalizedChannels[0] - normalizedChannels[1]) / channelRange + 4) * 60;
    }
  }
  if (hueDegrees < 0) {
    hueDegrees += 360;
  }
  const saturationRatio = maximumChannel <= 0 ? 0 : channelRange / maximumChannel;
  return [hueDegrees, saturationRatio * 100];
}
export function hsToRgbColor(hsColor) {
  if (!Array.isArray(hsColor) || hsColor.length < 2) {
    return null;
  }
  const normalizedHue = (((Number(hsColor[0]) || 0) % 360) + 360) % 360;
  const normalizedSaturation = Math.max(0, Math.min(100, Number(hsColor[1]) || 0)) / 100;
  const maximumValue = 1;
  const chroma = maximumValue * normalizedSaturation;
  const hueSector = normalizedHue / 60;
  const secondaryComponent = chroma * (1 - Math.abs((hueSector % 2) - 1));
  const minimumValue = maximumValue - chroma;
  const [redComponent, greenComponent, blueComponent] =
    hueSector < 1
      ? [chroma, secondaryComponent, 0]
      : hueSector < 2
        ? [secondaryComponent, chroma, 0]
        : hueSector < 3
          ? [0, chroma, secondaryComponent]
          : hueSector < 4
            ? [0, secondaryComponent, chroma]
            : hueSector < 5
              ? [secondaryComponent, 0, chroma]
              : [chroma, 0, secondaryComponent];
  return [redComponent, greenComponent, blueComponent].map(componentValue =>
    Math.round((componentValue + minimumValue) * 255)
  );
}
export function lightColorPickerHsFromPoint(normalizedX, normalizedY) {
  const clampedX = Math.max(0, Math.min(1, Number(normalizedX) || 0));
  const clampedY = Math.max(0, Math.min(1, Number(normalizedY) || 0));
  const offsetX = clampedX - 0.5;
  const offsetY = clampedY - 0.5;
  const radiusRatio = Math.min(1, Math.hypot(offsetX / 0.36, offsetY / 0.36));
  return [
    ((((Math.atan2(offsetY, offsetX) * 180) / Math.PI + 360) % 360) + 90) % 360,
    radiusRatio * 100
  ];
}
export function lightColorPickerPointFromHs(hueSaturation) {
  const pickerHueDegrees = (((Number(hueSaturation?.[0]) || 0) % 360) + 360) % 360;
  const pickerSaturationRatio = Math.max(0, Math.min(100, Number(hueSaturation?.[1]) || 0)) / 100;
  const hueRadians = ((pickerHueDegrees - 90) * Math.PI) / 180;
  return {
    x: Math.max(0, Math.min(1, 0.5 + Math.cos(hueRadians) * pickerSaturationRatio * 0.36)),
    y: Math.max(0, Math.min(1, 0.5 + Math.sin(hueRadians) * pickerSaturationRatio * 0.36))
  };
}
export function lightColorServiceData(lightAttributes, hsColorPair) {
  const colorModes = resolveSupportedColorModes(lightAttributes);
  const roundedHsColor = [
    Math.round((((Number(hsColorPair?.[0]) || 0) % 360) + 360) % 360),
    Math.round(Math.max(0, Math.min(100, Number(hsColorPair?.[1]) || 0)))
  ];
  if (colorModes.includes("hs") || colorModes.includes("xy") || !colorModes.includes("rgb")) {
    return {
      hs_color: roundedHsColor
    };
  } else {
    return {
      rgb_color: hsToRgbColor(roundedHsColor)
    };
  }
}
export const UNSUPPORTED_LIGHT_VISUAL_TEMPERATURE_KELVIN = 4600;
export const UNSUPPORTED_LIGHT_VISUAL_BRIGHTNESS_PERCENT = 100;
export function lightPresetBrightnessServiceData(brightnessPercent) {
  const clampedBrightnessPercent = Math.max(
    1,
    Math.min(100, Math.round(Number(brightnessPercent) || 1))
  );
  if (clampedBrightnessPercent === 100) {
    return {
      brightness: 255
    };
  } else {
    return {
      brightness_pct: clampedBrightnessPercent
    };
  }
}
export const LIGHT_DETAIL_PRESET_DEFINITIONS = Object.freeze([
  Object.freeze({
    label: "柔和",
    detail: "25%",
    brightnessPercent: 25,
    colorTemperaturePercent: 10
  }),
  Object.freeze({
    label: "日常",
    detail: "60%",
    brightnessPercent: 60,
    colorTemperaturePercent: 50
  }),
  Object.freeze({
    label: "明亮",
    detail: "100%",
    brightnessPercent: 100,
    colorTemperaturePercent: 100
  })
]);
export const LIGHT_PRESET_MINIMUM_HOLD_MS = 8000;
export const LIGHT_PRESET_STABLE_CONFIRMATION_MS = 1200;
export const LIGHT_PRESET_MAXIMUM_HOLD_MS = 12000;
export function lightPresetPendingDecision(pendingPreset, nowMs = Date.now()) {
  if (!pendingPreset) {
    return "idle";
  }
  const currentTimeMs = Number(nowMs) || 0;
  if (currentTimeMs >= Number(pendingPreset.expiresAt || 0)) {
    return "timeout";
  }
  if (!pendingPreset.latestMatches || !Number.isFinite(Number(pendingPreset.matchStartedAt))) {
    return "hold";
  }
  const hasReachedMinimumHold = currentTimeMs >= Number(pendingPreset.minimumHoldUntil || 0);
  const isStableConfirmationElapsed =
    currentTimeMs - Number(pendingPreset.matchStartedAt) >= LIGHT_PRESET_STABLE_CONFIRMATION_MS;
  if (hasReachedMinimumHold && isStableConfirmationElapsed) {
    return "confirmed";
  } else {
    return "hold";
  }
}
