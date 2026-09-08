const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback) => (Number.isFinite(value) ? value : fallback);

const normalizeSample = (sample) => ({
  intensity: Math.max(0, finite(sample?.intensity, 0)),
  color: [0, 1, 2].map((index) =>
    clamp(finite(sample?.color?.[index], 1), 0, 1),
  ),
});

function orderedRange(minValue, maxValue, defaults, bounds) {
  const min = clamp(finite(minValue, defaults[0]), bounds[0], bounds[1]);
  const max = clamp(finite(maxValue, defaults[1]), bounds[0], bounds[1]);
  return [Math.min(min, max), Math.max(min, max)];
}

export function mapLightEffectState(state) {
  const next = {
    brightness: state?.brightness,
    kelvin: state?.kelvin,
  };
  const effectRange = state?.effectRange;
  if (Number.isFinite(next.brightness)) {
    const brightness = clamp(next.brightness, 0, 100);
    const [min, max] = orderedRange(
      effectRange?.brightnessMin,
      effectRange?.brightnessMax,
      [1, 100],
      [0, 100],
    );
    next.brightness =
      brightness === 0
        ? 0
        : min + ((max - min) * (clamp(brightness, 1, 100) - 1)) / 99;
  }
  if (
    Number.isFinite(next.kelvin) &&
    (Number.isFinite(effectRange?.temperatureMin) ||
      Number.isFinite(effectRange?.temperatureMax))
  ) {
    const nativeRange = orderedRange(
      state.minimum,
      state.maximum,
      [2000, 6500],
      [1000, 20000],
    );
    const [min, max] = orderedRange(
      effectRange.temperatureMin,
      effectRange.temperatureMax,
      nativeRange,
      [1000, 20000],
    );
    const t =
      nativeRange[1] > nativeRange[0]
        ? clamp(
            (next.kelvin - nativeRange[0]) / (nativeRange[1] - nativeRange[0]),
            0,
            1,
          )
        : 0;
    next.kelvin = min + (max - min) * t;
  }
  if (
    state?.brightnessSupported === false &&
    Number.isFinite(state.effectDefaults?.brightness)
  ) {
    next.brightness = clamp(state.effectDefaults.brightness, 0, 100);
  }
  if (
    state?.temperatureSupported === false &&
    Number.isFinite(state.effectDefaults?.kelvin)
  ) {
    next.kelvin = clamp(state.effectDefaults.kelvin, 1000, 20000);
  }
  return next;
}

export function lightEffectColorHex(kelvin) {
  const temperature = clamp(finite(kelvin, 3000), 1000, 20000) / 100;
  const red =
    temperature <= 66
      ? 255
      : Math.pow(temperature - 60, -0.1332047592) * 329.698727446;
  const green =
    temperature <= 66
      ? Math.log(temperature) * 99.4708025861 - 161.1195681661
      : Math.pow(temperature - 60, -0.0755148492) * 288.1221695283;
  const blue =
    temperature >= 66
      ? 255
      : temperature <= 19
        ? 0
        : Math.log(temperature - 10) * 138.5177312231 - 305.0447927307;
  const channel = (value) => Math.round(clamp(value, 0, 255));
  return (channel(red) << 16) | (channel(green) << 8) | channel(blue);
}

export function lightTransitionDurationMs(
  previousOn,
  nextOn,
  transitionSeconds,
  options = {},
) {
  if (options.immediate) {
    return 0;
  }
  if (previousOn !== nextOn) {
    return clamp(finite(transitionSeconds, 0.3), 0, 10) * 1000;
  }
  if (options.preview) {
    return 90;
  }
  return 220;
}

export function createLightTransition(from, to, started, duration) {
  return {
    from: normalizeSample(from),
    to: normalizeSample(to),
    started: finite(started, 0),
    duration: Math.max(0, finite(duration, 0)),
  };
}

export function sampleLightTransition(transition, now) {
  const progress = transition.duration
    ? clamp(
        (finite(now, transition.started) - transition.started) /
          transition.duration,
        0,
        1,
      )
    : 1;
  const eased = progress * progress * (3 - progress * 2);
  return {
    intensity:
      transition.from.intensity +
      (transition.to.intensity - transition.from.intensity) * eased,
    color: transition.from.color.map(
      (channel, index) =>
        channel + (transition.to.color[index] - channel) * eased,
    ),
    complete: progress === 1,
  };
}
