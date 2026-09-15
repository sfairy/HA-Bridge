export function airflowCanvasOffsetBounds(component, canvasSize) {
  const position = component?.position || {};
  const componentWidthPx = Math.max(1, Number(position.width || 100));
  const componentHeightPx = Math.max(1, Number(position.height || 100));
  const canvasWidth = Math.max(1, Number(canvasSize?.width || 2778));
  const canvasHeight = Math.max(1, Number(canvasSize?.height || 1940));
  const centerX = Number(position.x || 0) + componentWidthPx / 2;
  const centerY = Number(position.y || 0) + componentHeightPx / 2;
  return {
    minX: Math.min(-500, (-centerX / componentWidthPx) * 100),
    maxX: Math.max(500, ((canvasWidth - centerX) / componentWidthPx) * 100),
    minY: Math.min(-500, (-centerY / componentHeightPx) * 100),
    maxY: Math.max(500, ((canvasHeight - centerY) / componentHeightPx) * 100)
  };
}
export function airflowLayerGeometry(sourceComponent, { grouped: isGrouped = false } = {}) {
  const componentPosition = sourceComponent?.position || {};
  const properties = sourceComponent?.properties || {};
  const componentWidth = Math.max(1, Number(componentPosition.width || 300));
  const componentHeight = Math.max(1, Number(componentPosition.height || 150));
  const airflowOffsetXPx = (componentWidth * Number(properties.airflowOffsetX ?? -75)) / 100;
  const airflowOffsetYPx = (componentHeight * Number(properties.airflowOffsetY ?? 34)) / 100;
  const airflowWidthPx =
    (componentWidth * Math.max(0.01, Number(properties.airflowWidth ?? 64))) / 100;
  const airflowHeightPx =
    (componentHeight * Math.max(0.01, Number(properties.airflowHeight ?? 125))) / 100;
  const componentRotation = Number(componentPosition.rotation || 0);
  const airflowRotation = Number(properties.airflowRotation || 0);
  const airflowScale = Math.max(0.01, Math.min(5, Number(properties.airflowScale || 1)));
  if (!isGrouped) {
    return {
      left:
        Number(componentPosition.x || 0) +
        componentWidth / 2 +
        airflowOffsetXPx -
        airflowWidthPx / 2,
      top:
        Number(componentPosition.y || 0) +
        componentHeight / 2 +
        airflowOffsetYPx -
        airflowHeightPx / 2,
      width: airflowWidthPx,
      height: airflowHeightPx,
      rotation: componentRotation + airflowRotation,
      scale: airflowScale
    };
  }
  const groupScale = Math.max(0.01, Math.min(5, Number(sourceComponent?.style?.scale || 1)));
  const groupRotationRadians = (componentRotation * Math.PI) / 180;
  const groupRotationCos = Math.cos(groupRotationRadians);
  const groupRotationSin = Math.sin(groupRotationRadians);
  const scaledOffsetXPx =
    (groupRotationCos * airflowOffsetXPx + groupRotationSin * airflowOffsetYPx) / groupScale;
  const scaledOffsetYPx =
    (-groupRotationSin * airflowOffsetXPx + groupRotationCos * airflowOffsetYPx) / groupScale;
  return {
    left: componentWidth / 2 + scaledOffsetXPx - airflowWidthPx / 2,
    top: componentHeight / 2 + scaledOffsetYPx - airflowHeightPx / 2,
    width: airflowWidthPx,
    height: airflowHeightPx,
    rotation: airflowRotation,
    scale: airflowScale / groupScale
  };
}
export function rotateMultiSelectionTransforms(transforms, pivotX, pivotY, pivotRotationDegrees) {
  const selectionRotationRadians = (Number(pivotRotationDegrees || 0) * Math.PI) / 180;
  const selectionRotationCos = Math.cos(selectionRotationRadians);
  const selectionRotationSin = Math.sin(selectionRotationRadians);
  return (transforms || []).map(transform => {
    const relativeX = Number(transform.centerX || 0) - pivotX;
    const relativeY = Number(transform.centerY || 0) - pivotY;
    const rotatedX = pivotX + relativeX * selectionRotationCos - relativeY * selectionRotationSin;
    const rotatedY = pivotY + relativeX * selectionRotationSin + relativeY * selectionRotationCos;
    return {
      componentId: transform.componentId,
      x: rotatedX - Number(transform.width || 0) / 2,
      y: rotatedY - Number(transform.height || 0) / 2,
      rotation: Number(transform.rotation || 0) + pivotRotationDegrees
    };
  });
}
export function groupedComponentLocalDelta(
  deltaX,
  deltaY,
  { rotation: rotationDegrees = 0, scale: scale = 1 } = {}
) {
  const localRotationRadians = (Number(rotationDegrees || 0) * Math.PI) / 180;
  const localRotationCos = Math.cos(localRotationRadians);
  const localRotationSin = Math.sin(localRotationRadians);
  const groupLocalScale = Math.max(0.01, Number(scale) || 1);
  return {
    x:
      (localRotationCos * Number(deltaX || 0) + localRotationSin * Number(deltaY || 0)) /
      groupLocalScale,
    y:
      (-localRotationSin * Number(deltaX || 0) + localRotationCos * Number(deltaY || 0)) /
      groupLocalScale
  };
}
