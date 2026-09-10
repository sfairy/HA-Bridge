export function airflowCanvasOffsetBounds(component, canvas) {
  const position = component?.position || {};
  const width = Math.max(1, Number(position.width || 100));
  const height = Math.max(1, Number(position.height || 100));
  const canvasWidth = Math.max(1, Number(canvas?.width || 2778));
  const canvasHeight = Math.max(1, Number(canvas?.height || 1940));
  const centerX = Number(position.x || 0) + width / 2;
  const centerY = Number(position.y || 0) + height / 2;
  return {
    minX: Math.min(-500, -centerX / width * 100),
    maxX: Math.max(500, (canvasWidth - centerX) / width * 100),
    minY: Math.min(-500, -centerY / height * 100),
    maxY: Math.max(500, (canvasHeight - centerY) / height * 100)
  };
}
export function airflowLayerGeometry(component, {
  grouped = false
} = {}) {
  const position = component?.position || {};
  const properties = component?.properties || {};
  const width = Math.max(1, Number(position.width || 300));
  const height = Math.max(1, Number(position.height || 150));
  const offsetX = width * Number(properties.airflowOffsetX ?? -75) / 100;
  const offsetY = height * Number(properties.airflowOffsetY ?? 34) / 100;
  const layerWidth = width * Math.max(0.01, Number(properties.airflowWidth ?? 64)) / 100;
  const layerHeight = height * Math.max(0.01, Number(properties.airflowHeight ?? 125)) / 100;
  const componentRotation = Number(position.rotation || 0);
  const airflowRotation = Number(properties.airflowRotation || 0);
  const airflowScale = Math.max(0.01, Math.min(5, Number(properties.airflowScale || 1)));
  if (!grouped) {
    return {
      left: Number(position.x || 0) + width / 2 + offsetX - layerWidth / 2,
      top: Number(position.y || 0) + height / 2 + offsetY - layerHeight / 2,
      width: layerWidth,
      height: layerHeight,
      rotation: componentRotation + airflowRotation,
      scale: airflowScale
    };
  }
  const componentScale = Math.max(0.01, Math.min(5, Number(component?.style?.scale || 1)));
  const radians = componentRotation * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const localOffsetX = (cos * offsetX + sin * offsetY) / componentScale;
  const localOffsetY = (-sin * offsetX + cos * offsetY) / componentScale;
  return {
    left: width / 2 + localOffsetX - layerWidth / 2,
    top: height / 2 + localOffsetY - layerHeight / 2,
    width: layerWidth,
    height: layerHeight,
    rotation: airflowRotation,
    scale: airflowScale / componentScale
  };
}
export function rotateMultiSelectionTransforms(selections, pivotX, pivotY, deltaDegrees) {
  const radians = Number(deltaDegrees || 0) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return (selections || []).map(selection => {
    const relativeX = Number(selection.centerX || 0) - pivotX;
    const relativeY = Number(selection.centerY || 0) - pivotY;
    const rotatedCenterX = pivotX + relativeX * cos - relativeY * sin;
    const rotatedCenterY = pivotY + relativeX * sin + relativeY * cos;
    return {
      componentId: selection.componentId,
      x: rotatedCenterX - Number(selection.width || 0) / 2,
      y: rotatedCenterY - Number(selection.height || 0) / 2,
      rotation: Number(selection.rotation || 0) + deltaDegrees
    };
  });
}
export function groupedComponentLocalDelta(deltaX, deltaY, {
  rotation = 0,
  scale = 1
} = {}) {
  const radians = Number(rotation || 0) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const safeScale = Math.max(0.01, Number(scale) || 1);
  return {
    x: (cos * Number(deltaX || 0) + sin * Number(deltaY || 0)) / safeScale,
    y: (-sin * Number(deltaX || 0) + cos * Number(deltaY || 0)) / safeScale
  };
}
