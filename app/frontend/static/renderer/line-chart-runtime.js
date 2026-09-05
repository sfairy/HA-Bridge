export function lineChartGeometry(
  series,
  originX = 0,
  originY = 5,
  width = 100,
  height = 59,
) {
  const dataMin = Math.min(...series.map((point) => point.value));
  const dataMax = Math.max(...series.map((point) => point.value));
  const range = dataMax - dataMin;
  const magnitude = Math.max(Math.abs(dataMin), Math.abs(dataMax), 0.001);
  const padding = Math.max(0.0001, range * 0.12, magnitude * 0.02);
  const minimum = dataMin - padding;
  const maximum = dataMax + padding;
  const span = Math.max(0.000001, maximum - minimum);
  const firstTime = series[0].timestamp;
  const lastTime = Math.max(firstTime + 1, series.at(-1).timestamp);
  const points = series.map((point) => ({
    ...point,
    x:
      originX +
      ((point.timestamp - firstTime) / (lastTime - firstTime)) * width,
    y: originY + ((maximum - point.value) / span) * height,
  }));
  return {
    dataMin,
    dataMax,
    minimum,
    maximum,
    span,
    firstTime,
    lastTime,
    points,
  };
}
export function normalizedStatePrecision(statePrecision) {
  if (
    statePrecision == null ||
    statePrecision === "" ||
    statePrecision === "auto"
  ) {
    return "auto";
  }
  const numeric = Number(statePrecision);
  if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 4) {
    return numeric;
  } else {
    return "auto";
  }
}
export function automaticNumericPrecision(value) {
  const magnitude = Math.abs(Number(value));
  if (!Number.isFinite(magnitude) || magnitude === 0 || magnitude >= 100) {
    return 0;
  } else if (magnitude >= 10) {
    return 1;
  } else if (magnitude >= 1) {
    return 2;
  } else if (magnitude >= 0.01) {
    return 3;
  } else {
    return 4;
  }
}
export function formatNumericValue(value, precision = "auto") {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "--";
  }
  const resolved = normalizedStatePrecision(precision);
  const digits =
    resolved === "auto" ? automaticNumericPrecision(numeric) : resolved;
  const formatted = numeric.toFixed(digits);
  if (resolved === "auto") {
    return String(Number(formatted));
  } else {
    return formatted;
  }
}
export function formatLineChartValue(value, precision = "auto") {
  return formatNumericValue(value, precision);
}
