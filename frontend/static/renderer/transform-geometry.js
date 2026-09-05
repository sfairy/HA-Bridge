export function airflowCanvasOffsetBounds(value, value2) {
  const value3 = value?.position || {};
  const count = Math.max(1, Number(value3.width || 100));
  const count2 = Math.max(1, Number(value3.height || 100));
  const count3 = Math.max(1, Number(value2?.width || 2778));
  const count4 = Math.max(1, Number(value2?.height || 1940));
  const value4 = Number(value3.x || 0) + count / 2;
  const value5 = Number(value3.y || 0) + count2 / 2;
  return {
    minX: Math.min(-500, (-value4 / count) * 100),
    maxX: Math.max(500, ((count3 - value4) / count) * 100),
    minY: Math.min(-500, (-value5 / count2) * 100),
    maxY: Math.max(500, ((count4 - value5) / count2) * 100),
  };
}
export function airflowLayerGeometry(
  component,
  { grouped: value = false } = {},
) {
  const value2 = component?.position || {};
  const value3 = component?.properties || {};
  const count = Math.max(1, Number(value2.width || 300));
  const count2 = Math.max(1, Number(value2.height || 150));
  const value4 = (count * Number(value3.airflowOffsetX ?? -75)) / 100;
  const value5 = (count2 * Number(value3.airflowOffsetY ?? 34)) / 100;
  const width =
    (count * Math.max(0.01, Number(value3.airflowWidth ?? 64))) / 100;
  const height =
    (count2 * Math.max(0.01, Number(value3.airflowHeight ?? 125))) / 100;
  const numeric = Number(value2.rotation || 0);
  const rotation = Number(value3.airflowRotation || 0);
  const scale = Math.max(0.01, Math.min(5, Number(value3.airflowScale || 1)));
  if (!value) {
    return {
      left: Number(value2.x || 0) + count / 2 + value4 - width / 2,
      top: Number(value2.y || 0) + count2 / 2 + value5 - height / 2,
      width: width,
      height: height,
      rotation: numeric + rotation,
      scale: scale,
    };
  }
  const count3 = Math.max(
    0.01,
    Math.min(5, Number(component?.style?.scale || 1)),
  );
  const value6 = (numeric * Math.PI) / 180;
  const value7 = Math.cos(value6);
  const value8 = Math.sin(value6);
  const value9 = (value7 * value4 + value8 * value5) / count3;
  const value10 = (-value8 * value4 + value7 * value5) / count3;
  return {
    left: count / 2 + value9 - width / 2,
    top: count2 / 2 + value10 - height / 2,
    width: width,
    height: height,
    rotation: rotation,
    scale: scale / count3,
  };
}
export function rotateMultiSelectionTransforms(value, value2, value3, value4) {
  const value5 = (Number(value4 || 0) * Math.PI) / 180;
  const value6 = Math.cos(value5);
  const value7 = Math.sin(value5);
  return (value || []).map((value8) => {
    const value9 = Number(value8.centerX || 0) - value2;
    const value10 = Number(value8.centerY || 0) - value3;
    const value11 = value2 + value9 * value6 - value10 * value7;
    const value12 = value3 + value9 * value7 + value10 * value6;
    return {
      componentId: value8.componentId,
      x: value11 - Number(value8.width || 0) / 2,
      y: value12 - Number(value8.height || 0) / 2,
      rotation: Number(value8.rotation || 0) + value4,
    };
  });
}
export function groupedComponentLocalDelta(
  value,
  value2,
  { rotation: value3 = 0, scale: value4 = 1 } = {},
) {
  const value5 = (Number(value3 || 0) * Math.PI) / 180;
  const value6 = Math.cos(value5);
  const value7 = Math.sin(value5);
  const count = Math.max(0.01, Number(value4) || 1);
  return {
    x: (value6 * Number(value || 0) + value7 * Number(value2 || 0)) / count,
    y: (-value7 * Number(value || 0) + value6 * Number(value2 || 0)) / count,
  };
}
