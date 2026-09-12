const previewRatios = new Map();

export function cameraPreviewRatio(entityId, ratio) {
  if (Number.isFinite(ratio) && ratio > 0) {
    previewRatios.set(entityId, ratio);
  }
  return previewRatios.get(entityId) || 16 / 9;
}

export function cameraPopupLayout(viewportWidth, viewportHeight, ratio = 16 / 9, headingHeight = 58) {
  const maxPanelHeight = Math.max(1, (viewportHeight - 24) / 2 - 26 - headingHeight);
  const panelWidth = Math.max(
    27,
    Math.min(viewportWidth * 0.3, (viewportWidth - 32) / 2, maxPanelHeight * ratio + 26),
  );
  const mediaHeight = (panelWidth - 26) / ratio;
  const panelHeight = 26 + headingHeight + mediaHeight;
  const top = Math.max(12, Math.min(viewportHeight * 0.56 - panelHeight, viewportHeight - panelHeight * 2 - 12));
  return { panelWidth, mediaHeight, panelHeight, top };
}
