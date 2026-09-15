const DEFAULT_PERSPECTIVE_CORNERS = Object.freeze([0, 0, 1, 0, 1, 1, 0, 1]);
const PERSPECTIVE_CORNER_BOUNDS = Object.freeze([
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5],
  [-1.5, 2.5]
]);
export function doorWindowPerspectiveCorners(corners) {
  return (
    Array.isArray(corners) && corners.length === 8 ? corners : DEFAULT_PERSPECTIVE_CORNERS
  ).map((cornerValue, cornerIndex) => {
    const numericCornerValue = Number(cornerValue);
    const defaultCornerValue = DEFAULT_PERSPECTIVE_CORNERS[cornerIndex];
    const [minimumCornerValue, maximumCornerValue] = PERSPECTIVE_CORNER_BOUNDS[cornerIndex];
    return Math.max(
      minimumCornerValue,
      Math.min(
        maximumCornerValue,
        Number.isFinite(numericCornerValue) ? numericCornerValue : defaultCornerValue
      )
    );
  });
}
export function doorWindowPerspectiveMatrix(width, height, cornerValues) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const normalizedCorners = doorWindowPerspectiveCorners(cornerValues);
  const [
    topLeftX,
    topLeftY,
    topRightX,
    topRightY,
    bottomRightX,
    bottomRightY,
    bottomLeftX,
    bottomLeftY
  ] = normalizedCorners.map(
    (scaledCornerValue, coordinateIndex) =>
      scaledCornerValue * (coordinateIndex % 2 === 0 ? safeWidth : safeHeight)
  );
  const coefficientA = topRightX - bottomRightX;
  const coefficientB = bottomLeftX - bottomRightX;
  const coefficientC = topLeftX - topRightX + bottomRightX - bottomLeftX;
  const coefficientD = topRightY - bottomRightY;
  const coefficientE = bottomLeftY - bottomRightY;
  const coefficientF = topLeftY - topRightY + bottomRightY - bottomLeftY;
  const determinant = coefficientA * coefficientE - coefficientB * coefficientD;
  if (Math.abs(determinant) < 0.000001) {
    return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
  }
  const homographyH = (coefficientC * coefficientE - coefficientB * coefficientF) / determinant;
  const homographyI = (coefficientA * coefficientF - coefficientC * coefficientD) / determinant;
  const scaleX = (topRightX - topLeftX + homographyH * topRightX) / safeWidth;
  const shearX = (bottomLeftX - topLeftX + homographyI * bottomLeftX) / safeHeight;
  const shearY = (topRightY - topLeftY + homographyH * topRightY) / safeWidth;
  const scaleY = (bottomLeftY - topLeftY + homographyI * bottomLeftY) / safeHeight;
  const perspectiveX = homographyH / safeWidth;
  const perspectiveY = homographyI / safeHeight;
  return (
    "matrix3d(" +
    [
      scaleX,
      shearY,
      0,
      perspectiveX,
      shearX,
      scaleY,
      0,
      perspectiveY,
      0,
      0,
      1,
      0,
      topLeftX,
      topLeftY,
      0,
      1
    ]
      .map(matrixEntry => (Math.abs(matrixEntry) < 1e-8 ? 0 : Number(matrixEntry.toFixed(8))))
      .join(",") +
    ")"
  );
}
