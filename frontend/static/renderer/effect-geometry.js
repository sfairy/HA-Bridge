const PRESENCE_SENSOR_BASE_Z_INDEX = 500000000;
const ICON_BUTTON_EFFECT_BASE_Z_INDEX = 1000000000;
export function normalizeIconButtonEffectComponent(component) {
  if (component?.type !== "icon-button-effect") {
    return component;
  }
  const nextProperties = {
    ...(component.properties || {})
  };
  if (!Object.prototype.hasOwnProperty.call(nextProperties, "buttonVisible")) {
    nextProperties.buttonVisible = true;
  }
  if (!Object.prototype.hasOwnProperty.call(nextProperties, "effectVisible")) {
    nextProperties.effectVisible = true;
  }
  return {
    ...component,
    properties: nextProperties
  };
}
export function componentHostZIndex(hostComponent, baseZIndex, applyTypeBoost = true) {
  const resolvedZIndex = Number(baseZIndex || 0);
  if (!applyTypeBoost && hostComponent?.type !== "group") {
    return resolvedZIndex;
  } else if (
    hostComponent?.type === "icon-button-effect" &&
    (hostComponent.properties?.buttonVisible !== false ||
      hostComponent.properties?.hiddenContentClickable === true)
  ) {
    return 1000000000 + resolvedZIndex;
  } else if (hostComponent?.type === "presence-sensor") {
    return 500000000 + resolvedZIndex;
  } else {
    return resolvedZIndex;
  }
}
export function effectFadeDuration(effectComponent) {
  const durationSeconds = Number(effectComponent?.properties?.effectFadeDuration);
  if (Number.isFinite(durationSeconds)) {
    return Math.max(0, Math.min(3, durationSeconds));
  } else {
    return 0.52;
  }
}
export function effectLayerDimensions(
  layerComponent,
  layerImageElement,
  layerFallbackWidth,
  layerFallbackHeight
) {
  if (layerComponent?.effectLayoutMode === "fill") {
    return {
      width: layerFallbackWidth,
      height: layerFallbackHeight,
      pendingNaturalSize: false
    };
  }
  const declaredWidth = Number(layerComponent?.effectNaturalWidth || 0);
  const declaredHeight = Number(layerComponent?.effectNaturalHeight || 0);
  const layerOriginalWidth = Number(
    layerImageElement?.dataset?.effectOriginalWidth || layerImageElement?.naturalWidth || 0
  );
  const layerOriginalHeight = Number(
    layerImageElement?.dataset?.effectOriginalHeight || layerImageElement?.naturalHeight || 0
  );
  const resolvedWidth = declaredWidth > 0 ? declaredWidth : layerOriginalWidth;
  const resolvedHeight = declaredHeight > 0 ? declaredHeight : layerOriginalHeight;
  if (resolvedWidth > 0 && resolvedHeight > 0) {
    return {
      width: resolvedWidth,
      height: resolvedHeight,
      pendingNaturalSize: false
    };
  } else {
    return {
      width:
        (layerFallbackWidth * Math.max(0.001, Number(layerComponent?.effectWidth ?? 100))) / 100,
      height:
        (layerFallbackHeight * Math.max(0.001, Number(layerComponent?.effectHeight ?? 100))) / 100,
      pendingNaturalSize: true
    };
  }
}
export function effectSourceDimensions(
  sourceComponent,
  sourceImageElement,
  containerWidth,
  containerHeight
) {
  const componentNaturalWidth = Number(sourceComponent?.effectNaturalWidth || 0);
  const componentNaturalHeight = Number(sourceComponent?.effectNaturalHeight || 0);
  const datasetOriginalWidth = Number(sourceImageElement?.dataset?.effectOriginalWidth || 0);
  const datasetOriginalHeight = Number(sourceImageElement?.dataset?.effectOriginalHeight || 0);
  const elementNaturalWidth = Number(sourceImageElement?.naturalWidth || 0);
  const elementNaturalHeight = Number(sourceImageElement?.naturalHeight || 0);
  const sourceWidth =
    componentNaturalWidth > 0
      ? componentNaturalWidth
      : datasetOriginalWidth > 0
        ? datasetOriginalWidth
        : elementNaturalWidth;
  const sourceHeight =
    componentNaturalHeight > 0
      ? componentNaturalHeight
      : datasetOriginalHeight > 0
        ? datasetOriginalHeight
        : elementNaturalHeight;
  if (sourceWidth > 0 && sourceHeight > 0) {
    return {
      width: sourceWidth,
      height: sourceHeight,
      pendingNaturalSize: false
    };
  } else if (sourceComponent?.effectLayoutMode === "fill") {
    return {
      width: containerWidth,
      height: containerHeight,
      pendingNaturalSize: true
    };
  } else {
    return {
      width: (containerWidth * Math.max(0.001, Number(sourceComponent?.effectWidth ?? 100))) / 100,
      height:
        (containerHeight * Math.max(0.001, Number(sourceComponent?.effectHeight ?? 100))) / 100,
      pendingNaturalSize: true
    };
  }
}
export function effectCropRectangle(cropImageElement, targetDimensions) {
  const datasetWidth = Number(cropImageElement?.dataset?.effectOriginalWidth || 0);
  const datasetHeight = Number(cropImageElement?.dataset?.effectOriginalHeight || 0);
  const datasetCropX = Number(cropImageElement?.dataset?.effectCropX);
  const datasetCropY = Number(cropImageElement?.dataset?.effectCropY);
  const datasetCropWidth = Number(cropImageElement?.dataset?.effectCropWidth || 0);
  const datasetCropHeight = Number(cropImageElement?.dataset?.effectCropHeight || 0);
  if (
    datasetWidth > 0 &&
    datasetHeight > 0 &&
    Number.isFinite(datasetCropX) &&
    Number.isFinite(datasetCropY) &&
    datasetCropX >= 0 &&
    datasetCropY >= 0 &&
    datasetCropWidth > 0 &&
    datasetCropHeight > 0 &&
    datasetCropX + datasetCropWidth <= datasetWidth &&
    datasetCropY + datasetCropHeight <= datasetHeight
  ) {
    const scaleX = targetDimensions.width / datasetWidth;
    const scaleY = targetDimensions.height / datasetHeight;
    return {
      x: datasetCropX * scaleX,
      y: datasetCropY * scaleY,
      width: datasetCropWidth * scaleX,
      height: datasetCropHeight * scaleY
    };
  }
  return {
    x: 0,
    y: 0,
    width: targetDimensions.width,
    height: targetDimensions.height
  };
}
export function effectCroppedLayerGeometry({
  centerX: centerX,
  centerY: centerY,
  originalWidth: originalWidth,
  originalHeight: originalHeight,
  cropX: cropX,
  cropY: cropY,
  cropWidth: cropWidth,
  cropHeight: cropHeight,
  scale: scale = 1,
  rotation: rotation = 0
}) {
  const rotationRad = (Number(rotation || 0) * Math.PI) / 180;
  const scaleFactor = Math.max(0.0001, Number(scale || 1));
  const offsetX =
    (Number(cropX || 0) + Number(cropWidth || 0) / 2 - Number(originalWidth || 0) / 2) *
    scaleFactor;
  const offsetY =
    (Number(cropY || 0) + Number(cropHeight || 0) / 2 - Number(originalHeight || 0) / 2) *
    scaleFactor;
  const rotatedOffsetX = offsetX * Math.cos(rotationRad) - offsetY * Math.sin(rotationRad);
  const rotatedOffsetY = offsetX * Math.sin(rotationRad) + offsetY * Math.cos(rotationRad);
  const rotatedCenterX = Number(centerX || 0) + rotatedOffsetX;
  const rotatedCenterY = Number(centerY || 0) + rotatedOffsetY;
  return {
    left: rotatedCenterX - Number(cropWidth || 0) / 2,
    top: rotatedCenterY - Number(cropHeight || 0) / 2,
    width: Number(cropWidth || 0),
    height: Number(cropHeight || 0),
    scale: scaleFactor,
    rotation: Number(rotation || 0)
  };
}
export function effectReferenceImageTransform(
  project,
  referenceComponent,
  targetWidth,
  targetHeight,
  fillWidth,
  fillHeight
) {
  if (!(targetWidth > 0) || !(targetHeight > 0)) {
    return null;
  }
  const referenceZIndex = Number(referenceComponent?.position?.zIndex || 1);
  const referenceImageId = String(referenceComponent?.properties?.effectReferenceImageId || "");
  const referencedCandidates = [];
  const fallbackCandidates = [];
  const collectCandidates = componentList => {
    for (const childComponent of componentList || []) {
      if (childComponent.type === "image") {
        const childProperties = childComponent.properties || {};
        const childNaturalWidth = Number(childProperties.naturalWidth || 0);
        const childNaturalHeight = Number(childProperties.naturalHeight || 0);
        const childZIndex = Number(childComponent.position?.zIndex || 1);
        const isReferenceImage = referenceImageId && childComponent.id === referenceImageId;
        const isBestSizeMatch =
          !referenceImageId &&
          childComponent.style?.visible !== false &&
          childNaturalWidth === targetWidth &&
          childNaturalHeight === targetHeight &&
          childZIndex < referenceZIndex;
        if (isReferenceImage || isBestSizeMatch) {
          const isFillLayout = childProperties.layoutMode === "fill";
          const childPosition = childComponent.position || {};
          const candidateWidth = isFillLayout
            ? fillWidth
            : Number(childPosition.width || targetWidth);
          const candidateHeight = isFillLayout
            ? fillHeight
            : Number(childPosition.height || targetHeight);
          const candidate = {
            zIndex: childZIndex,
            scale: Math.min(candidateWidth / targetWidth, candidateHeight / targetHeight)
          };
          if (isReferenceImage) {
            referencedCandidates.push(candidate);
          } else {
            fallbackCandidates.push(candidate);
          }
        }
      }
      collectCandidates(childComponent.children);
    }
  };
  collectCandidates(project?.components);
  return (
    referencedCandidates[0] ||
    fallbackCandidates.sort(
      (leftCandidate, rightCandidate) => rightCandidate.zIndex - leftCandidate.zIndex
    )[0] ||
    null
  );
}
