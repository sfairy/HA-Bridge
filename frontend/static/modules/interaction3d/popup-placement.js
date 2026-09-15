const clampNumberOr = (candidate, fallback, minValue, maxValue) =>
  typeof candidate == "number" && Number.isFinite(candidate)
    ? Math.max(minValue, Math.min(maxValue, candidate))
    : fallback;
export function popupPlacement({
  width: viewportWidth,
  height: viewportHeight,
  panelWidth: panelWidth,
  panelHeight: panelHeight,
  defaultScale: defaultScale = 1,
  defaultTop: defaultTop = 12,
  defaultRight: defaultRight = 16,
  settings: settings = {}
}) {
  viewportWidth = Math.max(1, viewportWidth);
  viewportHeight = Math.max(1, viewportHeight);
  panelWidth = Math.max(1, panelWidth);
  panelHeight = Math.max(1, panelHeight);
  const scaleFactor = clampNumberOr(settings?.scale, 1, 0.5, 2);
  const xPercent = clampNumberOr(settings?.x, null, 0, 100);
  const yPercent = clampNumberOr(settings?.y, null, 0, 100);
  if (scaleFactor === 1 && xPercent === null && yPercent === null) {
    return {
      scale: defaultScale,
      top: defaultTop,
      right: defaultRight,
      left: viewportWidth - defaultRight - panelWidth * defaultScale,
      width: panelWidth * defaultScale,
      height: panelHeight * defaultScale,
      custom: false
    };
  }
  const edgeMargin = Math.min(12, viewportWidth / 4, viewportHeight / 4);
  const scale = Math.max(
    0.001,
    Math.min(
      defaultScale * scaleFactor,
      (viewportWidth - edgeMargin * 2) / panelWidth,
      (viewportHeight - edgeMargin * 2) / panelHeight
    )
  );
  const renderedWidth = panelWidth * scale;
  const renderedHeight = panelHeight * scale;
  const left =
    xPercent === null
      ? Math.max(edgeMargin, viewportWidth - Math.max(edgeMargin, defaultRight) - renderedWidth)
      : edgeMargin + ((viewportWidth - edgeMargin * 2 - renderedWidth) * xPercent) / 100;
  const top =
    yPercent === null
      ? Math.max(edgeMargin, Math.min(viewportHeight - edgeMargin - renderedHeight, defaultTop))
      : edgeMargin + ((viewportHeight - edgeMargin * 2 - renderedHeight) * yPercent) / 100;
  return {
    scale: scale,
    top: top,
    right: viewportWidth - left - renderedWidth,
    left: left,
    width: renderedWidth,
    height: renderedHeight,
    custom: true
  };
}
