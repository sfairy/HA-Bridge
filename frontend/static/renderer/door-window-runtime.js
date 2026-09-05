const DEFAULT_CORNERS = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const CORNER_LIMITS = Object.freeze([
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
]);
export function doorWindowPerspectiveCorners(corners) {
  return (
    Array.isArray(corners) && corners.length === 8 ? corners : DEFAULT_CORNERS
  ).map((corner, index) => {
    const numeric = Number(corner);
    const fallback = DEFAULT_CORNERS[index];
    const [min, max] = CORNER_LIMITS[index];
    return Math.max(
      min,
      Math.min(max, Number.isFinite(numeric) ? numeric : fallback),
    );
  });
}
export function doorWindowPerspectiveMatrix(width, height, corners) {
  const destWidth = Math.max(1, Number(width) || 1);
  const destHeight = Math.max(1, Number(height) || 1);
  const [x0, y0, x1, y1, x2, y2, x3, y3] = doorWindowPerspectiveCorners(
    corners,
  ).map((corner, index) => corner * (index % 2 === 0 ? destWidth : destHeight));
  const edgeX12 = x1 - x2;
  const edgeX32 = x3 - x2;
  const deltaX = x0 - x1 + x2 - x3;
  const edgeY12 = y1 - y2;
  const edgeY32 = y3 - y2;
  const deltaY = y0 - y1 + y2 - y3;
  const denominator = edgeX12 * edgeY32 - edgeX32 * edgeY12;
  if (Math.abs(denominator) < 0.000001) {
    return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
  }
  const coeffG = (deltaX * edgeY32 - edgeX32 * deltaY) / denominator;
  const coeffH = (edgeX12 * deltaY - deltaX * edgeY12) / denominator;
  const a = (x1 - x0 + coeffG * x1) / destWidth;
  const c = (x3 - x0 + coeffH * x3) / destHeight;
  const b = (y1 - y0 + coeffG * y1) / destWidth;
  const d = (y3 - y0 + coeffH * y3) / destHeight;
  const g = coeffG / destWidth;
  const h = coeffH / destHeight;
  return (
    "matrix3d(" +
    [a, b, 0, g, c, d, 0, h, 0, 0, 1, 0, x0, y0, 0, 1]
      .map((value) => (Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(8))))
      .join(",") +
    ")"
  );
}
