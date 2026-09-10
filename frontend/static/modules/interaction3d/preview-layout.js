const positiveSize = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
export function interaction3dPreviewSize(component, document, maxWidth, maxHeight) {
  const fill = component.properties?.layoutMode === "fill";
  const box = fill ? document?.canvas : component.position;
  const width = positiveSize(box?.width, fill ? 2778 : 100);
  const height = positiveSize(box?.height, fill ? 1940 : 100);
  const scale = Math.min(positiveSize(maxWidth, 0) / width, positiveSize(maxHeight, 0) / height);
  return {
    width: width * scale,
    height: height * scale,
    aspectRatio: width / height
  };
}
