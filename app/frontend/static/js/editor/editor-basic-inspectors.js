import {
  clampNumber,
  roundField,
} from "./editor-utils.js?v=20260831-editor-utils-v1";
export function setInspectorToggle(element, hidden) {
  element.setAttribute("aria-pressed", String(hidden));
  element.textContent = hidden ? "隐藏" : "显示";
}
export function iconButtonEffectInspectorLayer(_component = {}, layer = "") {
  if (layer === "button" || layer === "effect") {
    return layer;
  } else {
    return "button";
  }
}
export function fitInspectorComponentToDimensions(
  component,
  template,
  measure,
) {
  if (!component) {
    return;
  }
  const currentWidth = Number(component.position?.width || 100);
  const currentHeight = Number(component.position?.height || 100);
  const centerX = Number(component.position?.x || 0) + currentWidth / 2;
  const centerY = Number(component.position?.y || 0) + currentHeight / 2;
  const { width, height } = measure(template);
  component.position = {
    ...(component.position || {}),
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  };
}
export function inspectorComponentMetrics(component, document) {
  const position = component.position || {};
  const canvasWidth = Number(document?.canvas?.width || 2778);
  const canvasHeight = Number(document?.canvas?.height || 1940);
  const width = Number(position.width || 100);
  const height = Number(position.height || 100);
  return {
    position,
    width,
    height,
    left: roundField(
      clampNumber(
        ((Number(position.x || 0) + width / 2) / canvasWidth) * 100,
        0,
        100,
      ),
    ),
    top: roundField(
      clampNumber(
        ((Number(position.y || 0) + height / 2) / canvasHeight) * 100,
        0,
        100,
      ),
    ),
    widthPercent: roundField(
      clampNumber((width / canvasWidth) * 100, 0.1, 100),
    ),
    heightPercent: roundField(
      clampNumber((height / canvasHeight) * 100, 0.1, 100),
    ),
    scale: roundField(
      clampNumber(Number(component.style?.scale || 1) * 100, 1, 500),
    ),
    rotation: roundField(
      clampNumber(Number(position.rotation || 0), -360, 360),
    ),
  };
}
