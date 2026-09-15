const positiveNumberOr = (value, fallback) =>
  Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
export function interaction3dPreviewSize(component, documentApi, containerWidth, containerHeight) {
  const isFillLayout = component.properties?.layoutMode === "fill";
  const sizeSource = isFillLayout ? documentApi?.canvas : component.position;
  const width = positiveNumberOr(sizeSource?.width, isFillLayout ? 2778 : 100);
  const height = positiveNumberOr(sizeSource?.height, isFillLayout ? 1940 : 100);
  const fitScale = Math.min(
    positiveNumberOr(containerWidth, 0) / width,
    positiveNumberOr(containerHeight, 0) / height
  );
  return {
    width: width * fitScale,
    height: height * fitScale,
    aspectRatio: width / height
  };
}
