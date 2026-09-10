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
export function weatherVisual(value, value2 = "") {
  let value3 = String(value || "")
    .trim()
    .toLowerCase();
  const value4 = value2 === "below_horizon";
  if (value4 && value3 === "sunny") {
    value3 = "clear-night";
  }
  if (value4 && value3 === "partlycloudy") {
    return ["partly-cloudy-night", "多云"];
  } else {
    return (
      WEATHER_ICON_MAP[value3] || [
        "code-red",
        value3 && !["unknown", "unavailable"].includes(value3)
          ? value3
          : "天气不可用",
      ]
    );
  }
}
export function meteoconUrl(value) {
  const value2 = String(value || "").trim();
  if (/^[a-z0-9-]+$/.test(value2)) {
    return "/bridge-static/vendor/meteocons/fill/" + value2 + ".svg";
  } else {
    return "/bridge-static/vendor/meteocons/fill/code-red.svg";
  }
}
function safeCssColor(value, value2) {
  const value3 = String(value || "").trim();
  if (
    /^(#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\))$/i.test(value3)
  ) {
    return value3;
  } else {
    return value2;
  }
}
const ALERT_LEVEL_COLORS = ["#ddffc2", "#68cc3e", "#ff8e52", "#ff1a1a"];
function fn2(value, value2) {
  if (!value.length) {
    return NaN;
  }
  const value3 = (value.length - 1) * value2;
  const value4 = Math.floor(value3);
  const value5 = Math.ceil(value3);
  if (value4 === value5) {
    return value[value4];
  } else {
    return value[value4] + (value[value5] - value[value4]) * (value3 - value4);
  }
}
export function normalizedThresholds(dThresholds) {
  return (Array.isArray(dThresholds) ? dThresholds : [])
    .filter((element) => Number.isFinite(Number(element?.value)))
    .map((element) => ({
      value: Number(element.value),
      color: safeCssColor(element.color, "#68cc3e"),
    }))
    .sort((element, element2) => element.value - element2.value);
}
export function automaticThresholds(value) {
  const value2 = (Array.isArray(value) ? value : [])
    .map((element) => Number(element?.value ?? element))
    .filter((value8) => Number.isFinite(value8))
    .sort((value8, value9) => value8 - value9);
  if (!value2.length) {
    return [];
  }
  let value3 = fn2(value2, value2.length >= 5 ? 0.05 : 0);
  let value4 = fn2(value2, value2.length >= 5 ? 0.95 : 1);
  if (!Number.isFinite(value3) || !Number.isFinite(value4)) {
    return [];
  }
  if (value4 < value3) {
    [value3, value4] = [value4, value3];
  }
  const value5 = value4 - value3;
  const value6 = Math.max(Math.abs(value3), Math.abs(value4), 1) * 1e-9;
  if (value5 <= value6) {
    const count = Math.max(Math.abs(value3) * 0.01, 0.01);
    return [
      {
        value: value3 - count,
        color: ALERT_LEVEL_COLORS[0],
      },
      {
        value: value3,
        color: ALERT_LEVEL_COLORS[1],
      },
      {
        value: value3 + count,
        color: ALERT_LEVEL_COLORS[2],
      },
      {
        value: value3 + count * 2,
        color: ALERT_LEVEL_COLORS[3],
      },
    ];
  }
  const value7 = value5 / (ALERT_LEVEL_COLORS.length - 1);
  return ALERT_LEVEL_COLORS.map((color, value8) => ({
    value: value3 + value7 * value8,
    color: color,
  }));
}
export function resolvedThresholds(value, value2, value3 = "") {
  const value4 = normalizedThresholds(value);
  if (value3 === "auto") {
    return automaticThresholds(value2);
  } else if (value3 === "manual" || value4.length) {
    return value4;
  } else {
    return automaticThresholds(value2);
  }
}
export function thresholdColor(value, value2) {
  return (
    value.filter((element) => value2 >= element.value).at(-1)?.color ||
    value[0]?.color ||
    "#68cc3e"
  );
}
export function smoothChartPath(value) {
  if (!value.length) {
    return "";
  }
  if (value.length === 1) {
    return "M0 " + value[0].y + " L100 " + value[0].y;
  }
  let value2 = "M" + value[0].x.toFixed(3) + " " + value[0].y.toFixed(3);
  for (let value3 = 0; value3 < value.length - 1; value3 += 1) {
    const value4 = value[value3];
    const value5 = value[value3 + 1];
    const value6 = value[value3 - 1] || value4;
    const value7 = value[value3 + 2] || value5;
    const value8 = value4.x + (value5.x - value6.x) / 6;
    const value9 = value4.y + (value5.y - value6.y) / 6;
    const value10 = value5.x - (value7.x - value4.x) / 6;
    const value11 = value5.y - (value7.y - value4.y) / 6;
    value2 +=
      " C" +
      value8.toFixed(3) +
      " " +
      value9.toFixed(3) +
      " " +
      value10.toFixed(3) +
      " " +
      value11.toFixed(3) +
      " " +
      value5.x.toFixed(3) +
      " " +
      value5.y.toFixed(3);
  }
  return value2;
}
