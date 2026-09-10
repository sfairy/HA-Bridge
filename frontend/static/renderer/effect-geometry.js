const Z_INDEX_PRESENCE_SENSOR_BASE = 500000000;
const Z_INDEX_ICON_BUTTON_EFFECT_BASE = 1000000000;
export function normalizeIconButtonEffectComponent(component) {
  if (component?.type !== "icon-button-effect") {
    return component;
  }
  const properties = {
    ...(component.properties || {}),
  };
  if (!Object.prototype.hasOwnProperty.call(properties, "buttonVisible")) {
    properties.buttonVisible = true;
  }
  if (!Object.prototype.hasOwnProperty.call(properties, "effectVisible")) {
    properties.effectVisible = true;
  }
  return {
    ...component,
    properties: properties,
  };
}
export function componentHostZIndex(component, value, value2 = true) {
  const numeric = Number(value || 0);
  if (!value2 && component?.type !== "group") {
    return numeric;
  } else if (
    component?.type === "icon-button-effect" &&
    (component.properties?.buttonVisible !== false ||
      component.properties?.hiddenContentClickable === true)
  ) {
    return 1000000000 + numeric;
  } else if (component?.type === "presence-sensor") {
    return 500000000 + numeric;
  } else {
    return numeric;
  }
}
export function effectFadeDuration(component) {
  const numeric = Number(component?.properties?.effectFadeDuration);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(3, numeric));
  } else {
    return 0.52;
  }
}
export function effectLayerDimensions(value, value2, width, height) {
  if (value?.effectLayoutMode === "fill") {
    return {
      width: width,
      height: height,
      pendingNaturalSize: false,
    };
  }
  const numeric = Number(value?.effectNaturalWidth || 0);
  const numeric2 = Number(value?.effectNaturalHeight || 0);
  const numeric3 = Number(
    value2?.dataset?.effectOriginalWidth || value2?.naturalWidth || 0,
  );
  const numeric4 = Number(
    value2?.dataset?.effectOriginalHeight || value2?.naturalHeight || 0,
  );
  const width2 = numeric > 0 ? numeric : numeric3;
  const height2 = numeric2 > 0 ? numeric2 : numeric4;
  if (width2 > 0 && height2 > 0) {
    return {
      width: width2,
      height: height2,
      pendingNaturalSize: false,
    };
  } else {
    return {
      width: (width * Math.max(0.001, Number(value?.effectWidth ?? 100))) / 100,
      height:
        (height * Math.max(0.001, Number(value?.effectHeight ?? 100))) / 100,
      pendingNaturalSize: true,
    };
  }
}
export function effectSourceDimensions(value, value2, width, height) {
  const numeric = Number(value?.effectNaturalWidth || 0);
  const numeric2 = Number(value?.effectNaturalHeight || 0);
  const numeric3 = Number(value2?.dataset?.effectOriginalWidth || 0);
  const numeric4 = Number(value2?.dataset?.effectOriginalHeight || 0);
  const numeric5 = Number(value2?.naturalWidth || 0);
  const numeric6 = Number(value2?.naturalHeight || 0);
  const width2 = numeric > 0 ? numeric : numeric3 > 0 ? numeric3 : numeric5;
  const height2 = numeric2 > 0 ? numeric2 : numeric4 > 0 ? numeric4 : numeric6;
  if (width2 > 0 && height2 > 0) {
    return {
      width: width2,
      height: height2,
      pendingNaturalSize: false,
    };
  } else if (value?.effectLayoutMode === "fill") {
    return {
      width: width,
      height: height,
      pendingNaturalSize: true,
    };
  } else {
    return {
      width: (width * Math.max(0.001, Number(value?.effectWidth ?? 100))) / 100,
      height:
        (height * Math.max(0.001, Number(value?.effectHeight ?? 100))) / 100,
      pendingNaturalSize: true,
    };
  }
}
export function effectCropRectangle(value, fallback) {
  const numeric = Number(value?.dataset?.effectOriginalWidth || 0);
  const numeric2 = Number(value?.dataset?.effectOriginalHeight || 0);
  const numeric3 = Number(value?.dataset?.effectCropX);
  const numeric4 = Number(value?.dataset?.effectCropY);
  const numeric5 = Number(value?.dataset?.effectCropWidth || 0);
  const numeric6 = Number(value?.dataset?.effectCropHeight || 0);
  if (
    numeric > 0 &&
    numeric2 > 0 &&
    Number.isFinite(numeric3) &&
    Number.isFinite(numeric4) &&
    numeric3 >= 0 &&
    numeric4 >= 0 &&
    numeric5 > 0 &&
    numeric6 > 0 &&
    numeric3 + numeric5 <= numeric &&
    numeric4 + numeric6 <= numeric2
  ) {
    const value2 = fallback.width / numeric;
    const value3 = fallback.height / numeric2;
    return {
      x: numeric3 * value2,
      y: numeric4 * value3,
      width: numeric5 * value2,
      height: numeric6 * value3,
    };
  }
  return {
    x: 0,
    y: 0,
    width: fallback.width,
    height: fallback.height,
  };
}
export function effectCroppedLayerGeometry({
  centerX: value,
  centerY: value2,
  originalWidth: value3,
  originalHeight: value4,
  cropX: value5,
  cropY: value6,
  cropWidth: value7,
  cropHeight: value8,
  scale: value9 = 1,
  rotation: value10 = 0,
}) {
  const value11 = (Number(value10 || 0) * Math.PI) / 180;
  const scale = Math.max(0.0001, Number(value9 || 1));
  const value12 =
    (Number(value5 || 0) + Number(value7 || 0) / 2 - Number(value3 || 0) / 2) *
    scale;
  const value13 =
    (Number(value6 || 0) + Number(value8 || 0) / 2 - Number(value4 || 0) / 2) *
    scale;
  const value14 = value12 * Math.cos(value11) - value13 * Math.sin(value11);
  const value15 = value12 * Math.sin(value11) + value13 * Math.cos(value11);
  const value16 = Number(value || 0) + value14;
  const value17 = Number(value2 || 0) + value15;
  return {
    left: value16 - Number(value7 || 0) / 2,
    top: value17 - Number(value8 || 0) / 2,
    width: Number(value7 || 0),
    height: Number(value8 || 0),
    scale: scale,
    rotation: Number(value10 || 0),
  };
}
export function effectReferenceImageTransform(
  value,
  component,
  value2,
  value3,
  value4,
  value5,
) {
  if (!(value2 > 0) || !(value3 > 0)) {
    return null;
  }
  const numeric = Number(component?.position?.zIndex || 1);
  const text = String(component?.properties?.effectReferenceImageId || "");
  const value6 = [];
  const value7 = [];
  const fn = (value8) => {
    for (const component2 of value8 || []) {
      if (component2.type === "image") {
        const value9 = component2.properties || {};
        const numeric2 = Number(value9.naturalWidth || 0);
        const numeric3 = Number(value9.naturalHeight || 0);
        const zIndex = Number(component2.position?.zIndex || 1);
        const value10 = text && component2.id === text;
        const value11 =
          !text &&
          component2.style?.visible !== false &&
          numeric2 === value2 &&
          numeric3 === value3 &&
          zIndex < numeric;
        if (value10 || value11) {
          const value12 = value9.layoutMode === "fill";
          const value13 = component2.position || {};
          const value14 = value12 ? value4 : Number(value13.width || value2);
          const value15 = value12 ? value5 : Number(value13.height || value3);
          const value16 = {
            zIndex: zIndex,
            scale: Math.min(value14 / value2, value15 / value3),
          };
          if (value10) {
            value6.push(value16);
          } else {
            value7.push(value16);
          }
        }
      }
      fn(component2.children);
    }
  };
  fn(value?.components);
  return (
    value6[0] ||
    value7.sort((value8, value9) => value9.zIndex - value8.zIndex)[0] ||
    null
  );
}
