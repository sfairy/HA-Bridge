export function lineChartGeometry(
  series,
  originX = 0,
  originY = 5,
  plotWidth = 100,
  plotHeight = 59
) {
  const dataMin = Math.min(...series.map(datapoint => datapoint.value));
  const dataMax = Math.max(...series.map(seriesPoint => seriesPoint.value));
  const valueSpan = dataMax - dataMin;
  const valueMagnitude = Math.max(Math.abs(dataMin), Math.abs(dataMax), 0.001);
  const valuePadding = Math.max(0.0001, valueSpan * 0.12, valueMagnitude * 0.02);
  const minimum = dataMin - valuePadding;
  const maximum = dataMax + valuePadding;
  const span = Math.max(0.000001, maximum - minimum);
  const firstTime = series[0].timestamp;
  const lastTime = Math.max(firstTime + 1, series.at(-1).timestamp);
  const points = series.map(point => ({
    ...point,
    x: originX + ((point.timestamp - firstTime) / (lastTime - firstTime)) * plotWidth,
    y: originY + ((maximum - point.value) / span) * plotHeight
  }));
  return {
    dataMin: dataMin,
    dataMax: dataMax,
    minimum: minimum,
    maximum: maximum,
    span: span,
    firstTime: firstTime,
    lastTime: lastTime,
    points: points
  };
}
export function normalizedStatePrecision(precisionOption) {
  if (precisionOption == null || precisionOption === "" || precisionOption === "auto") {
    return "auto";
  }
  const parsedPrecision = Number(precisionOption);
  if (Number.isInteger(parsedPrecision) && parsedPrecision >= 0 && parsedPrecision <= 4) {
    return parsedPrecision;
  } else {
    return "auto";
  }
}
export function automaticNumericPrecision(inputValue) {
  const magnitude = Math.abs(Number(inputValue));
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
export function formatNumericValue(value, precisionSetting = "auto") {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "--";
  }
  const resolvedPrecision = normalizedStatePrecision(precisionSetting);
  const precisionDigits =
    resolvedPrecision === "auto" ? automaticNumericPrecision(numericValue) : resolvedPrecision;
  const formattedValue = numericValue.toFixed(precisionDigits);
  if (resolvedPrecision === "auto") {
    return String(Number(formattedValue));
  } else {
    return formattedValue;
  }
}
export function formatLineChartValue(chartValue, precision = "auto") {
  return formatNumericValue(chartValue, precision);
}
