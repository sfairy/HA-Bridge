const WEATHER_ICON_MAP = {
  sunny: ["clear-day", "晴"],
  "clear-night": ["clear-night", "晴"],
  partlycloudy: ["partly-cloudy-day", "多云"],
  cloudy: ["overcast", "阴"],
  rainy: ["rain", "小雨"],
  pouring: ["extreme-rain", "大雨"],
  lightning: ["thunderstorms", "雷电"],
  "lightning-rainy": ["thunderstorms-rain", "雷雨"],
  snowy: ["snow", "下雪"],
  "snowy-rainy": ["sleet", "雨夹雪"],
  fog: ["fog", "雾"],
  windy: ["wind", "大风"],
  "windy-variant": ["wind", "有风"],
  hail: ["hail", "冰雹"],
  exceptional: ["code-red", "异常天气"],
};
export function weatherVisual(condition, sunState = "") {
  let conditionKey = String(condition || "")
    .trim()
    .toLowerCase();
  const belowHorizon = sunState === "below_horizon";
  if (belowHorizon && conditionKey === "sunny") {
    conditionKey = "clear-night";
  }
  if (belowHorizon && conditionKey === "partlycloudy") {
    return ["partly-cloudy-night", "多云"];
  } else {
    return (
      WEATHER_ICON_MAP[conditionKey] || [
        "code-red",
        conditionKey && !["unknown", "unavailable"].includes(conditionKey)
          ? conditionKey
          : "天气不可用",
      ]
    );
  }
}
export function meteoconUrl(iconName) {
  const name = String(iconName || "").trim();
  if (/^[a-z0-9-]+$/.test(name)) {
    return "/bridge-static/vendor/meteocons/fill/" + name + ".svg";
  } else {
    return "/bridge-static/vendor/meteocons/fill/code-red.svg";
  }
}
function safeCssColor(color, fallback) {
  const trimmed = String(color || "").trim();
  if (
    /^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(trimmed)
  ) {
    return trimmed;
  } else {
    return fallback;
  }
}
const ALERT_LEVEL_COLORS = ["#ddffc2", "#68cc3e", "#ff8e52", "#ff1a1a"];
function percentile(sortedValues, quantile) {
  if (!sortedValues.length) {
    return NaN;
  }
  const rank = (sortedValues.length - 1) * quantile;
  const lowerIndex = Math.floor(rank);
  const upperIndex = Math.ceil(rank);
  if (lowerIndex === upperIndex) {
    return sortedValues[lowerIndex];
  } else {
    return (
      sortedValues[lowerIndex] +
      (sortedValues[upperIndex] - sortedValues[lowerIndex]) * (rank - lowerIndex)
    );
  }
}
export function normalizedThresholds(thresholds) {
  return (Array.isArray(thresholds) ? thresholds : [])
    .filter((element) => Number.isFinite(Number(element?.value)))
    .map((element) => ({
      value: Number(element.value),
      color: safeCssColor(element.color, "#68cc3e"),
    }))
    .sort((element, element2) => element.value - element2.value);
}
export function automaticThresholds(samples) {
  const sorted = (Array.isArray(samples) ? samples : [])
    .map((element) => Number(element?.value ?? element))
    .filter((sample) => Number.isFinite(sample))
    .sort((a, b) => a - b);
  if (!sorted.length) {
    return [];
  }
  let low = percentile(sorted, sorted.length >= 5 ? 0.05 : 0);
  let high = percentile(sorted, sorted.length >= 5 ? 0.95 : 1);
  if (!Number.isFinite(low) || !Number.isFinite(high)) {
    return [];
  }
  if (high < low) {
    [low, high] = [high, low];
  }
  const span = high - low;
  const epsilon = Math.max(Math.abs(low), Math.abs(high), 1) * 1e-9;
  if (span <= epsilon) {
    const step = Math.max(Math.abs(low) * 0.01, 0.01);
    return [
      {
        value: low - step,
        color: ALERT_LEVEL_COLORS[0],
      },
      {
        value: low,
        color: ALERT_LEVEL_COLORS[1],
      },
      {
        value: low + step,
        color: ALERT_LEVEL_COLORS[2],
      },
      {
        value: low + step * 2,
        color: ALERT_LEVEL_COLORS[3],
      },
    ];
  }
  const step = span / (ALERT_LEVEL_COLORS.length - 1);
  return ALERT_LEVEL_COLORS.map((color, index) => ({
    value: low + step * index,
    color: color,
  }));
}
export function resolvedThresholds(configured, samples, mode = "") {
  const manual = normalizedThresholds(configured);
  if (mode === "auto") {
    return automaticThresholds(samples);
  } else if (mode === "manual" || manual.length) {
    return manual;
  } else {
    return automaticThresholds(samples);
  }
}
export function thresholdColor(thresholds, sampleValue) {
  return (
    thresholds.filter((element) => sampleValue >= element.value).at(-1)?.color ||
    thresholds[0]?.color ||
    "#68cc3e"
  );
}
export function smoothChartPath(points) {
  if (!points.length) {
    return "";
  }
  if (points.length === 1) {
    return "M0 " + points[0].y + " L100 " + points[0].y;
  }
  let path = "M" + points[0].x.toFixed(3) + " " + points[0].y.toFixed(3);
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const previous = points[index - 1] || current;
    const afterNext = points[index + 2] || next;
    const control1X = current.x + (next.x - previous.x) / 6;
    const control1Y = current.y + (next.y - previous.y) / 6;
    const control2X = next.x - (afterNext.x - current.x) / 6;
    const control2Y = next.y - (afterNext.y - current.y) / 6;
    path +=
      " C" +
      control1X.toFixed(3) +
      " " +
      control1Y.toFixed(3) +
      " " +
      control2X.toFixed(3) +
      " " +
      control2Y.toFixed(3) +
      " " +
      next.x.toFixed(3) +
      " " +
      next.y.toFixed(3);
  }
  return path;
}
