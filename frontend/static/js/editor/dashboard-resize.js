function round(value) {
  return Math.round(Number(value) * 1e6) / 1e6;
}
function positiveNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}
function scaleComponent(component, widthRatio, heightRatio, contentScale, fromCenter = true) {
  if (!component || typeof component != "object") {
    return;
  }
  const position = component.position || {};
  const width = positiveNumber(position.width, 100);
  const height = positiveNumber(position.height, 100);
  const x = Number.isFinite(Number(position.x)) ? Number(position.x) : 0;
  const y = Number.isFinite(Number(position.y)) ? Number(position.y) : 0;
  const nextWidth = width * contentScale;
  const nextHeight = height * contentScale;
  component.position = {
    ...position,
    x: round(fromCenter ? (x + width / 2) * widthRatio - nextWidth / 2 : x * contentScale),
    y: round(fromCenter ? (y + height / 2) * heightRatio - nextHeight / 2 : y * contentScale),
    width: round(nextWidth),
    height: round(nextHeight)
  };
  if (component.type === "icon-button-effect" && component.properties?.effectLayoutMode !== "fill") {
    const effectWidth = Number(component.properties?.effectWidth);
    const effectHeight = Number(component.properties?.effectHeight);
    if (Number.isFinite(effectWidth)) {
      component.properties.effectWidth = round(effectWidth * contentScale / widthRatio);
    }
    if (Number.isFinite(effectHeight)) {
      component.properties.effectHeight = round(effectHeight * contentScale / heightRatio);
    }
  }
  for (const child of component.children || []) {
    scaleComponent(child, contentScale, contentScale, contentScale, false);
  }
}
function documentComponents(document) {
  return [...(document.sharedComponents || []), ...(document.pages || []).flatMap(page => page.components || [])];
}
function isOutsideCanvas(component, canvasWidth, canvasHeight) {
  const position = component?.position || {};
  const x = Number(position.x);
  const y = Number(position.y);
  const width = positiveNumber(position.width, 100);
  const height = positiveNumber(position.height, 100);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return false;
  }
  return x < 0 || y < 0 || x + width > canvasWidth || y + height > canvasHeight;
}
export function countComponentsOutsideCanvas(document, width, height) {
  const canvasWidth = Number(width);
  const canvasHeight = Number(height);
  if (!Number.isFinite(canvasWidth) || !Number.isFinite(canvasHeight)) {
    return 0;
  }
  return documentComponents(document).filter(component => isOutsideCanvas(component, canvasWidth, canvasHeight)).length;
}
export function resizeDashboardDocument(document, width, height, options = {}) {
  const next = JSON.parse(JSON.stringify(document));
  const currentWidth = positiveNumber(next?.canvas?.width, 2778);
  const currentHeight = positiveNumber(next?.canvas?.height, 1940);
  const baseWidth = positiveNumber(next?.canvas?.resizeBaseWidth, currentWidth);
  const baseHeight = positiveNumber(next?.canvas?.resizeBaseHeight, currentHeight);
  const currentContentScale = positiveNumber(next?.canvas?.resizeContentScale, Math.min(currentWidth / baseWidth, currentHeight / baseHeight));
  const nextWidth = Number(width);
  const nextHeight = Number(height);
  if (!Number.isInteger(nextWidth) || nextWidth < 320 || nextWidth > 7680) {
    throw new Error("仪表盘宽度必须为 320 至 7680 之间的整数。");
  }
  if (!Number.isInteger(nextHeight) || nextHeight < 240 || nextHeight > 4320) {
    throw new Error("仪表盘高度必须为 240 至 4320 之间的整数。");
  }
  if (nextWidth === currentWidth && nextHeight === currentHeight) {
    return next;
  }
  if (options.lockContent) {
    next.canvas = {
      ...(next.canvas || {}),
      width: nextWidth,
      height: nextHeight,
      resizeBaseWidth: round(baseWidth),
      resizeBaseHeight: round(baseHeight),
      resizeContentScale: round(currentContentScale)
    };
    return next;
  }
  const widthRatio = nextWidth / currentWidth;
  const heightRatio = nextHeight / currentHeight;
  const nextContentScale = Math.min(nextWidth / baseWidth, nextHeight / baseHeight);
  const contentScale = nextContentScale / currentContentScale;
  for (const component of documentComponents(next)) {
    scaleComponent(component, widthRatio, heightRatio, contentScale, true);
  }
  next.canvas = {
    ...(next.canvas || {}),
    width: nextWidth,
    height: nextHeight,
    componentScale: round(positiveNumber(next.canvas?.componentScale, 1) * contentScale),
    popupScale: round(positiveNumber(next.canvas?.popupScale, 1) * contentScale),
    resizeBaseWidth: round(baseWidth),
    resizeBaseHeight: round(baseHeight),
    resizeContentScale: round(nextContentScale)
  };
  return next;
}
