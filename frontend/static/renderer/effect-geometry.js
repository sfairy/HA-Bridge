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
export function componentHostZIndex(component, zIndex, applySpecialBases = true) {
  const numeric = Number(zIndex || 0);
  if (!applySpecialBases && component?.type !== "group") {
    return numeric;
  } else if (
    component?.type === "icon-button-effect" &&
    (component.properties?.buttonVisible !== false ||
      component.properties?.hiddenContentClickable === true)
  ) {
    return Z_INDEX_ICON_BUTTON_EFFECT_BASE + numeric;
  } else if (component?.type === "presence-sensor") {
    return Z_INDEX_PRESENCE_SENSOR_BASE + numeric;
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
export function effectLayerDimensions(properties, imageElement, width, height) {
  if (properties?.effectLayoutMode === "fill") {
    return {
      width: width,
      height: height,
      pendingNaturalSize: false,
    };
  }
  const storedWidth = Number(properties?.effectNaturalWidth || 0);
  const storedHeight = Number(properties?.effectNaturalHeight || 0);
  const elementWidth = Number(
    imageElement?.dataset?.effectOriginalWidth || imageElement?.naturalWidth || 0,
  );
  const elementHeight = Number(
    imageElement?.dataset?.effectOriginalHeight ||
      imageElement?.naturalHeight ||
      0,
  );
  const resolvedWidth = storedWidth > 0 ? storedWidth : elementWidth;
  const resolvedHeight = storedHeight > 0 ? storedHeight : elementHeight;
  if (resolvedWidth > 0 && resolvedHeight > 0) {
    return {
      width: resolvedWidth,
      height: resolvedHeight,
      pendingNaturalSize: false,
    };
  } else {
    return {
      width:
        (width * Math.max(0.001, Number(properties?.effectWidth ?? 100))) / 100,
      height:
        (height * Math.max(0.001, Number(properties?.effectHeight ?? 100))) /
        100,
      pendingNaturalSize: true,
    };
  }
}
export function effectSourceDimensions(properties, imageElement, width, height) {
  const storedWidth = Number(properties?.effectNaturalWidth || 0);
  const storedHeight = Number(properties?.effectNaturalHeight || 0);
  const datasetWidth = Number(imageElement?.dataset?.effectOriginalWidth || 0);
  const datasetHeight = Number(imageElement?.dataset?.effectOriginalHeight || 0);
  const naturalWidth = Number(imageElement?.naturalWidth || 0);
  const naturalHeight = Number(imageElement?.naturalHeight || 0);
  const resolvedWidth =
    storedWidth > 0 ? storedWidth : datasetWidth > 0 ? datasetWidth : naturalWidth;
  const resolvedHeight =
    storedHeight > 0
      ? storedHeight
      : datasetHeight > 0
        ? datasetHeight
        : naturalHeight;
  if (resolvedWidth > 0 && resolvedHeight > 0) {
    return {
      width: resolvedWidth,
      height: resolvedHeight,
      pendingNaturalSize: false,
    };
  } else if (properties?.effectLayoutMode === "fill") {
    return {
      width: width,
      height: height,
      pendingNaturalSize: true,
    };
  } else {
    return {
      width:
        (width * Math.max(0.001, Number(properties?.effectWidth ?? 100))) / 100,
      height:
        (height * Math.max(0.001, Number(properties?.effectHeight ?? 100))) /
        100,
      pendingNaturalSize: true,
    };
  }
}
export function effectCropRectangle(imageElement, fallback) {
  const originalWidth = Number(imageElement?.dataset?.effectOriginalWidth || 0);
  const originalHeight = Number(imageElement?.dataset?.effectOriginalHeight || 0);
  const cropX = Number(imageElement?.dataset?.effectCropX);
  const cropY = Number(imageElement?.dataset?.effectCropY);
  const cropWidth = Number(imageElement?.dataset?.effectCropWidth || 0);
  const cropHeight = Number(imageElement?.dataset?.effectCropHeight || 0);
  if (
    originalWidth > 0 &&
    originalHeight > 0 &&
    Number.isFinite(cropX) &&
    Number.isFinite(cropY) &&
    cropX >= 0 &&
    cropY >= 0 &&
    cropWidth > 0 &&
    cropHeight > 0 &&
    cropX + cropWidth <= originalWidth &&
    cropY + cropHeight <= originalHeight
  ) {
    const scaleX = fallback.width / originalWidth;
    const scaleY = fallback.height / originalHeight;
    return {
      x: cropX * scaleX,
      y: cropY * scaleY,
      width: cropWidth * scaleX,
      height: cropHeight * scaleY,
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
  centerX,
  centerY,
  originalWidth,
  originalHeight,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  scale: inputScale = 1,
  rotation = 0,
}) {
  const rotationRad = (Number(rotation || 0) * Math.PI) / 180;
  const scale = Math.max(0.0001, Number(inputScale || 1));
  const offsetX =
    (Number(cropX || 0) + Number(cropWidth || 0) / 2 - Number(originalWidth || 0) / 2) *
    scale;
  const offsetY =
    (Number(cropY || 0) +
      Number(cropHeight || 0) / 2 -
      Number(originalHeight || 0) / 2) *
    scale;
  const rotatedX = offsetX * Math.cos(rotationRad) - offsetY * Math.sin(rotationRad);
  const rotatedY = offsetX * Math.sin(rotationRad) + offsetY * Math.cos(rotationRad);
  const layerCenterX = Number(centerX || 0) + rotatedX;
  const layerCenterY = Number(centerY || 0) + rotatedY;
  return {
    left: layerCenterX - Number(cropWidth || 0) / 2,
    top: layerCenterY - Number(cropHeight || 0) / 2,
    width: Number(cropWidth || 0),
    height: Number(cropHeight || 0),
    scale: scale,
    rotation: Number(rotation || 0),
  };
}
export function effectReferenceImageTransform(
  page,
  component,
  naturalWidth,
  naturalHeight,
  hostWidth,
  hostHeight,
) {
  if (!(naturalWidth > 0) || !(naturalHeight > 0)) {
    return null;
  }
  const componentZIndex = Number(component?.position?.zIndex || 1);
  const referenceImageId = String(
    component?.properties?.effectReferenceImageId || "",
  );
  const exactMatches = [];
  const sizeMatches = [];
  const visit = (components) => {
    for (const child of components || []) {
      if (child.type === "image") {
        const properties = child.properties || {};
        const imageNaturalWidth = Number(properties.naturalWidth || 0);
        const imageNaturalHeight = Number(properties.naturalHeight || 0);
        const zIndex = Number(child.position?.zIndex || 1);
        const isExactReference =
          referenceImageId && child.id === referenceImageId;
        const isSizeMatch =
          !referenceImageId &&
          child.style?.visible !== false &&
          imageNaturalWidth === naturalWidth &&
          imageNaturalHeight === naturalHeight &&
          zIndex < componentZIndex;
        if (isExactReference || isSizeMatch) {
          const fillLayout = properties.layoutMode === "fill";
          const position = child.position || {};
          const displayWidth = fillLayout
            ? hostWidth
            : Number(position.width || naturalWidth);
          const displayHeight = fillLayout
            ? hostHeight
            : Number(position.height || naturalHeight);
          const match = {
            zIndex: zIndex,
            scale: Math.min(
              displayWidth / naturalWidth,
              displayHeight / naturalHeight,
            ),
          };
          if (isExactReference) {
            exactMatches.push(match);
          } else {
            sizeMatches.push(match);
          }
        }
      }
      visit(child.children);
    }
  };
  visit(page?.components);
  return (
    exactMatches[0] ||
    sizeMatches.sort((a, b) => b.zIndex - a.zIndex)[0] ||
    null
  );
}
