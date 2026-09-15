const previewRatiosByCameraId = new Map();
export function cameraPreviewRatio(cameraId, aspectRatio) {
  if (Number.isFinite(aspectRatio) && aspectRatio > 0) {
    previewRatiosByCameraId.set(cameraId, aspectRatio);
  }
  return previewRatiosByCameraId.get(cameraId) || 16 / 9;
}
export function cameraPopupLayout(
  containerWidth,
  containerHeight,
  mediaAspectRatio = 16 / 9,
  chromeHeight = 58
) {
  const maxPanelHeight = Math.max(1, (containerHeight - 24) / 2 - 26 - chromeHeight);
  const panelWidth = Math.max(
    27,
    Math.min(
      containerWidth * 0.3,
      (containerWidth - 32) / 2,
      maxPanelHeight * mediaAspectRatio + 26
    )
  );
  const mediaHeight = (panelWidth - 26) / mediaAspectRatio;
  const panelHeight = 26 + chromeHeight + mediaHeight;
  const top = Math.max(
    12,
    Math.min(containerHeight * 0.56 - panelHeight, containerHeight - panelHeight * 2 - 12)
  );
  return {
    panelWidth: panelWidth,
    mediaHeight: mediaHeight,
    panelHeight: panelHeight,
    top: top
  };
}
