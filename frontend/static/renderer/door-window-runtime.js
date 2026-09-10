const DEFAULT_CORNERS = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const CORNER_LIMITS = Object.freeze([[-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5], [-1.5, 2.5]]);
export function doorWindowPerspectiveCorners(corners) {
  return (Array.isArray(corners) && corners.length === 8 ? corners : DEFAULT_CORNERS).map((corner, index) => {
    const numeric = Number(corner);
    const fallback = DEFAULT_CORNERS[index];
    const [min, max] = CORNER_LIMITS[index];
    return Math.max(min, Math.min(max, Number.isFinite(numeric) ? numeric : fallback));
  });
}
export function doorWindowPerspectiveMatrix(width, height, corners) {
  const value = Math.max(1, Number(width) || 1);
  const value2 = Math.max(1, Number(height) || 1);
  const map = doorWindowPerspectiveCorners(corners);
  const [value3, y0, x3, y3, value4, value5, value6, value7] = map.map((arg, arg2) => arg * (arg2 % 2 === 0 ? value : value2));
  const value8 = x3 - value4;
  const deltaX = value6 - value4;
  const value9 = value3 - x3 + value4 - value6;
  const value10 = y3 - value5;
  const deltaY = value7 - value5;
  const value11 = y0 - y3 + value5 - value7;
  const value12 = value8 * deltaY - deltaX * value10;
  if (Math.abs(value12) < 0.000001) {
    return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
  }
  const coeffH = (value9 * deltaY - deltaX * value11) / value12;
  const coeffG = (value8 * value11 - value9 * value10) / value12;
  const value13 = (x3 - value3 + coeffH * x3) / value;
  const value14 = (value6 - value3 + coeffG * value6) / value2;
  const value15 = (y3 - y0 + coeffH * y3) / value;
  const value16 = (value7 - y0 + coeffG * value7) / value2;
  const value17 = coeffH / value;
  const value18 = coeffG / value2;
  return "matrix3d(" + [value13, value15, 0, value17, value14, value16, 0, value18, 0, 0, 1, 0, value3, y0, 0, 1].map(value => Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(8))).join(",") + ")";
}
