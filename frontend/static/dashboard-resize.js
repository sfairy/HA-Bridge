const roundToMicroPrecision = rawValue => Math.round(Number(rawValue) * 1e6) / 1e6;
function positiveNumberOrDefault(candidateNumber, fallbackNumber) {
  const numericValue = Number(candidateNumber);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallbackNumber;
}
function scaleComponentSubtree(
  componentNode,
  horizontalScale,
  verticalScale,
  contentScaleFactor,
  isTopLevel = !0
) {
  if (!componentNode || typeof componentNode != "object") return;
  const position = componentNode.position || {},
    originalWidth = positiveNumberOrDefault(position.width, 100),
    originalHeight = positiveNumberOrDefault(position.height, 100),
    originalX = Number.isFinite(Number(position.x)) ? Number(position.x) : 0,
    originalY = Number.isFinite(Number(position.y)) ? Number(position.y) : 0,
    scaledWidth = originalWidth * contentScaleFactor,
    scaledHeight = originalHeight * contentScaleFactor;
  if (
    ((componentNode.position = {
      ...position,
      x: roundToMicroPrecision(
        isTopLevel
          ? (originalX + originalWidth / 2) * horizontalScale - scaledWidth / 2
          : originalX * contentScaleFactor
      ),
      y: roundToMicroPrecision(
        isTopLevel
          ? (originalY + originalHeight / 2) * verticalScale - scaledHeight / 2
          : originalY * contentScaleFactor
      ),
      width: roundToMicroPrecision(scaledWidth),
      height: roundToMicroPrecision(scaledHeight)
    }),
    componentNode.type === "icon-button-effect" &&
      componentNode.properties?.effectLayoutMode !== "fill")
  ) {
    const effectWidth = Number(componentNode.properties?.effectWidth),
      effectHeight = Number(componentNode.properties?.effectHeight);
    (Number.isFinite(effectWidth) &&
      (componentNode.properties.effectWidth = roundToMicroPrecision(
        (effectWidth * contentScaleFactor) / horizontalScale
      )),
      Number.isFinite(effectHeight) &&
        (componentNode.properties.effectHeight = roundToMicroPrecision(
          (effectHeight * contentScaleFactor) / verticalScale
        )));
  }
  for (const nestedComponent of componentNode.children || [])
    scaleComponentSubtree(
      nestedComponent,
      contentScaleFactor,
      contentScaleFactor,
      contentScaleFactor,
      !1
    );
}
function flattenComponents(dashboardDocument) {
  return [
    ...(dashboardDocument.sharedComponents || []),
    ...(dashboardDocument.pages || []).flatMap(page => page.components || [])
  ];
}
function isComponentOutsideCanvas(targetComponent, canvasWidth, limitHeight) {
  const componentPosition = targetComponent?.position || {},
    positionX = Number(componentPosition.x),
    positionY = Number(componentPosition.y),
    componentWidth = positiveNumberOrDefault(componentPosition.width, 100),
    componentHeight = positiveNumberOrDefault(componentPosition.height, 100);
  return !Number.isFinite(positionX) || !Number.isFinite(positionY)
    ? !1
    : positionX < 0 ||
        positionY < 0 ||
        positionX + componentWidth > canvasWidth ||
        positionY + componentHeight > limitHeight;
}
export function countComponentsOutsideCanvas(documentModel, documentWidth, documentHeight) {
  const limitWidth = Number(documentWidth),
    canvasHeight = Number(documentHeight);
  return !Number.isFinite(limitWidth) || !Number.isFinite(canvasHeight)
    ? 0
    : flattenComponents(documentModel).filter(component =>
        isComponentOutsideCanvas(component, limitWidth, canvasHeight)
      ).length;
}
export function resizeDashboardDocument(sourceDocument, targetWidth, targetHeight, options = {}) {
  const resizedDocument = JSON.parse(JSON.stringify(sourceDocument)),
    baseWidth = positiveNumberOrDefault(resizedDocument?.canvas?.width, 2778),
    baseHeight = positiveNumberOrDefault(resizedDocument?.canvas?.height, 1940),
    resizeBaseWidth = positiveNumberOrDefault(resizedDocument?.canvas?.resizeBaseWidth, baseWidth),
    resizeBaseHeight = positiveNumberOrDefault(
      resizedDocument?.canvas?.resizeBaseHeight,
      baseHeight
    ),
    resizeContentScale = positiveNumberOrDefault(
      resizedDocument?.canvas?.resizeContentScale,
      Math.min(baseWidth / resizeBaseWidth, baseHeight / resizeBaseHeight)
    ),
    widthPx = Number(targetWidth),
    heightPx = Number(targetHeight);
  if (!Number.isInteger(widthPx) || widthPx < 320 || widthPx > 7680)
    throw new Error(
      "\u4EEA\u8868\u76D8\u5BBD\u5EA6\u5FC5\u987B\u4E3A 320 \u81F3 7680 \u4E4B\u95F4\u7684\u6574\u6570\u3002"
    );
  if (!Number.isInteger(heightPx) || heightPx < 240 || heightPx > 4320)
    throw new Error(
      "\u4EEA\u8868\u76D8\u9AD8\u5EA6\u5FC5\u987B\u4E3A 240 \u81F3 4320 \u4E4B\u95F4\u7684\u6574\u6570\u3002"
    );
  if (widthPx === baseWidth && heightPx === baseHeight) return resizedDocument;
  if (options.lockContent)
    return (
      (resizedDocument.canvas = {
        ...(resizedDocument.canvas || {}),
        width: widthPx,
        height: heightPx,
        resizeBaseWidth: roundToMicroPrecision(resizeBaseWidth),
        resizeBaseHeight: roundToMicroPrecision(resizeBaseHeight),
        resizeContentScale: roundToMicroPrecision(resizeContentScale)
      }),
      resizedDocument
    );
  const scaleRatioX = widthPx / baseWidth,
    scaleRatioY = heightPx / baseHeight,
    nextContentScale = Math.min(widthPx / resizeBaseWidth, heightPx / resizeBaseHeight),
    scaleDelta = nextContentScale / resizeContentScale,
    components = flattenComponents(resizedDocument);
  for (const flatComponent of components)
    scaleComponentSubtree(flatComponent, scaleRatioX, scaleRatioY, scaleDelta, !0);
  return (
    (resizedDocument.canvas = {
      ...(resizedDocument.canvas || {}),
      width: widthPx,
      height: heightPx,
      componentScale: roundToMicroPrecision(
        positiveNumberOrDefault(resizedDocument.canvas?.componentScale, 1) * scaleDelta
      ),
      popupScale: roundToMicroPrecision(
        positiveNumberOrDefault(resizedDocument.canvas?.popupScale, 1) * scaleDelta
      ),
      resizeBaseWidth: roundToMicroPrecision(resizeBaseWidth),
      resizeBaseHeight: roundToMicroPrecision(resizeBaseHeight),
      resizeContentScale: roundToMicroPrecision(nextContentScale)
    }),
    resizedDocument
  );
}
