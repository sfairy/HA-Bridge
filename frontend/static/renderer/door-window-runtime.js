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
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const map = doorWindowPerspectiveCorners(corners);
  const [x0, y0, x3, y3, x1, y1, x2, y2] = map.map((corner, index) => corner * (index % 2 === 0 ? safeWidth : safeHeight));
  const dx30 = x3 - x1;
  const deltaX = x2 - x1;
  const sx = x0 - x3 + x1 - x2;
  const dy30 = y3 - y1;
  const deltaY = y2 - y1;
  const sy = y0 - y3 + y1 - y2;
  const det = dx30 * deltaY - deltaX * dy30;
  if (Math.abs(det) < 0.000001) {
    return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
  }
  const coeffH = (sx * deltaY - deltaX * sy) / det;
  const coeffG = (dx30 * sy - sx * dy30) / det;
  const a11 = (x3 - x0 + coeffH * x3) / safeWidth;
  const a21 = (x2 - x0 + coeffG * x2) / safeHeight;
  const a12 = (y3 - y0 + coeffH * y3) / safeWidth;
  const a22 = (y2 - y0 + coeffG * y2) / safeHeight;
  const a14 = coeffH / safeWidth;
  const a24 = coeffG / safeHeight;
  return "matrix3d(" + [a11, a12, 0, a14, a21, a22, 0, a24, 0, 0, 1, 0, x0, y0, 0, 1].map(value => Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(8))).join(",") + ")";
}
