const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finiteOr = (candidate, fallback) => (Number.isFinite(candidate) ? candidate : fallback);
const normalizeLightState = lightState => ({
  intensity: Math.max(0, finiteOr(lightState?.intensity, 0)),
  color: [0, 1, 2].map(channelIndex => clamp(finiteOr(lightState?.color?.[channelIndex], 1), 0, 1))
});
function normalizeRange(minValue, maxValue, fallbackRange, bounds) {
  const clampedMin = clamp(finiteOr(minValue, fallbackRange[0]), bounds[0], bounds[1]);
  const clampedMax = clamp(finiteOr(maxValue, fallbackRange[1]), bounds[0], bounds[1]);
  return [Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)];
}
export function mapLightEffectState(lightEntry) {
  const mappedState = {
    brightness: lightEntry?.brightness,
    kelvin: lightEntry?.kelvin
  };
  const effectRange = lightEntry?.effectRange;
  if (Number.isFinite(mappedState.brightness)) {
    const brightnessPercent = clamp(mappedState.brightness, 0, 100);
    const [brightnessMin, brightnessMax] = normalizeRange(
      effectRange?.brightnessMin,
      effectRange?.brightnessMax,
      [1, 100],
      [0, 100]
    );
    mappedState.brightness =
      brightnessPercent === 0
        ? 0
        : brightnessMin +
          ((brightnessMax - brightnessMin) * (clamp(brightnessPercent, 1, 100) - 1)) / 99;
  }
  if (
    Number.isFinite(mappedState.kelvin) &&
    (Number.isFinite(effectRange?.temperatureMin) || Number.isFinite(effectRange?.temperatureMax))
  ) {
    const kelvinRange = normalizeRange(
      lightEntry.minimum,
      lightEntry.maximum,
      [2000, 6500],
      [1000, 20000]
    );
    const [temperatureMin, temperatureMax] = normalizeRange(
      effectRange.temperatureMin,
      effectRange.temperatureMax,
      kelvinRange,
      [1000, 20000]
    );
    const kelvinRatio =
      kelvinRange[1] > kelvinRange[0]
        ? clamp((mappedState.kelvin - kelvinRange[0]) / (kelvinRange[1] - kelvinRange[0]), 0, 1)
        : 0;
    mappedState.kelvin = temperatureMin + (temperatureMax - temperatureMin) * kelvinRatio;
  }
  if (
    lightEntry?.brightnessSupported === false &&
    Number.isFinite(lightEntry.effectDefaults?.brightness)
  ) {
    mappedState.brightness = clamp(lightEntry.effectDefaults.brightness, 0, 100);
  }
  if (
    lightEntry?.temperatureSupported === false &&
    Number.isFinite(lightEntry.effectDefaults?.kelvin)
  ) {
    mappedState.kelvin = clamp(lightEntry.effectDefaults.kelvin, 1000, 20000);
  }
  return mappedState;
}
export function lightEffectColorHex(kelvin) {
  const scaledKelvin = clamp(finiteOr(kelvin, 3000), 1000, 20000) / 100;
  const redChannel =
    scaledKelvin <= 66 ? 255 : Math.pow(scaledKelvin - 60, -0.1332047592) * 329.698727446;
  const greenChannel =
    scaledKelvin <= 66
      ? Math.log(scaledKelvin) * 99.4708025861 - 161.1195681661
      : Math.pow(scaledKelvin - 60, -0.0755148492) * 288.1221695283;
  const blueChannel =
    scaledKelvin >= 66
      ? 255
      : scaledKelvin <= 19
        ? 0
        : Math.log(scaledKelvin - 10) * 138.5177312231 - 305.0447927307;
  const clampChannel = channel => Math.round(clamp(channel, 0, 255));
  return (
    (clampChannel(redChannel) << 16) | (clampChannel(greenChannel) << 8) | clampChannel(blueChannel)
  );
}
export function lightTransitionDurationMs(wasOn, isOn, fadeDurationSeconds, options = {}) {
  if (options.immediate) {
    return 0;
  } else if (wasOn !== isOn) {
    return clamp(finiteOr(fadeDurationSeconds, 0.3), 0, 10) * 1000;
  } else if (options.preview) {
    return 90;
  } else {
    return 220;
  }
}
export function createLightTransition(fromState, toState, startedAtMs, durationMs) {
  return {
    from: normalizeLightState(fromState),
    to: normalizeLightState(toState),
    started: finiteOr(startedAtMs, 0),
    duration: Math.max(0, finiteOr(durationMs, 0))
  };
}
export function sampleLightTransition(transition, nowMs) {
  const progress = transition.duration
    ? clamp((finiteOr(nowMs, transition.started) - transition.started) / transition.duration, 0, 1)
    : 1;
  const easedProgress = progress * progress * (3 - progress * 2);
  return {
    intensity:
      transition.from.intensity +
      (transition.to.intensity - transition.from.intensity) * easedProgress,
    color: transition.from.color.map(
      (fromChannel, colorIndex) =>
        fromChannel + (transition.to.color[colorIndex] - fromChannel) * easedProgress
    ),
    complete: progress === 1
  };
}
