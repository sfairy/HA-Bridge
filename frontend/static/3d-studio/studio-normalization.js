function clampNumber(inputValue, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, inputValue));
}
export function finite(value, fallback = 0) {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  } else {
    return fallback;
  }
}
export function normalizeFullRotation(degrees, fallbackDegrees = 0) {
  const rotationDegrees = finite(degrees, fallbackDegrees);
  if (rotationDegrees >= 0 && rotationDegrees <= 360) {
    return rotationDegrees;
  } else {
    return ((rotationDegrees % 360) + 360) % 360;
  }
}
export function itemMinimumFootprint(itemType) {
  if (itemType === "presence") {
    return 0.01;
  } else {
    return 0.1;
  }
}
export function itemMinimumHeight(itemKind) {
  if (itemKind === "planlabel") {
    return 0.001;
  } else if (itemKind === "rug") {
    return 0.004;
  } else {
    return 0.05;
  }
}
export function normalizePoint(point) {
  return {
    x: finite(point?.x),
    y: finite(point?.y)
  };
}
export function normalizeLabelText(labelText, fallbackText, maxLength) {
  return (
    String(labelText ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength) || fallbackText
  );
}
export function kelvinToRgbHex(kelvin) {
  const scaledKelvin = clampNumber(finite(kelvin, 3000), 2200, 6500) / 100;
  const redValue = scaledKelvin <= 66 ? 255 : (scaledKelvin - 60) ** -0.1332047592 * 329.698727446;
  const greenValue =
    scaledKelvin <= 66
      ? Math.log(scaledKelvin) * 99.4708025861 - 161.1195681661
      : (scaledKelvin - 60) ** -0.0755148492 * 288.1221695283;
  const blueValue =
    scaledKelvin >= 66
      ? 255
      : scaledKelvin <= 19
        ? 0
        : Math.log(scaledKelvin - 10) * 138.5177312231 - 305.0447927307;
  const clampChannel = channelValue => Math.round(clampNumber(channelValue, 0, 255));
  return (clampChannel(redValue) << 16) | (clampChannel(greenValue) << 8) | clampChannel(blueValue);
}
export function normalizeFixedCameraView(savedView) {
  if (!savedView || typeof savedView != "object") {
    return null;
  }
  const positionVector = {
    x: clampNumber(finite(savedView.position?.x), -500, 500),
    y: clampNumber(finite(savedView.position?.y), -500, 500),
    z: clampNumber(finite(savedView.position?.z), -500, 500)
  };
  const targetVector = {
    x: clampNumber(finite(savedView.target?.x), -500, 500),
    y: clampNumber(finite(savedView.target?.y), -500, 500),
    z: clampNumber(finite(savedView.target?.z), -500, 500)
  };
  if (
    Math.hypot(
      positionVector.x - targetVector.x,
      positionVector.y - targetVector.y,
      positionVector.z - targetVector.z
    ) < 0.1
  ) {
    return null;
  } else {
    return {
      mode: savedView.mode === "perspective" ? "perspective" : "orthographic",
      view: savedView.view === "top" ? "top" : "free",
      topRotation: (((Math.round(finite(savedView.topRotation, 0) / 90) * 90) % 360) + 360) % 360,
      position: positionVector,
      target: targetVector,
      visibleHeight: clampNumber(finite(savedView.visibleHeight, 10), 1, 100),
      fov: clampNumber(finite(savedView.fov, 36), 20, 80),
      focalLength:
        savedView.focalLength !== null &&
        savedView.focalLength !== undefined &&
        Number.isFinite(Number(savedView.focalLength))
          ? clampNumber(finite(savedView.focalLength, 50), 18, 120)
          : null
    };
  }
}
export function normalizeCameraSettings(cameraSettings) {
  return {
    cameraView: cameraSettings?.cameraView === "top" ? "top" : "free",
    cameraTopRotation:
      (((Math.round(finite(cameraSettings?.cameraTopRotation, 0) / 90) * 90) % 360) + 360) % 360,
    cameraMode: cameraSettings?.cameraMode === "orthographic" ? "orthographic" : "perspective",
    cameraFocalLength: clampNumber(finite(cameraSettings?.cameraFocalLength, 50), 18, 120)
  };
}
export const DEFAULT_BASE_LIGHTING = Object.freeze({
  exposure: 1.05,
  hemisphereIntensity: 0.58,
  ambientIntensity: 0.16,
  mainIntensity: 2.05,
  mainAzimuth: 139,
  mainElevation: 55,
  mainShadowIntensity: 0.18,
  fillIntensity: 0.16,
  fillAzimuth: -48,
  fillElevation: 28,
  topIntensity: 0.12,
  topAzimuth: 90,
  topElevation: 86
});
export function normalizeBaseLighting(lightingSettings) {
  const lightingInput =
    lightingSettings && typeof lightingSettings == "object" ? lightingSettings : {};
  return {
    exposure: clampNumber(finite(lightingInput.exposure, DEFAULT_BASE_LIGHTING.exposure), 0.5, 2),
    ...(lightingInput.floorBrightness !== undefined
      ? {
          floorBrightness: clampNumber(finite(lightingInput.floorBrightness, 100), 50, 150)
        }
      : {}),
    hemisphereIntensity: clampNumber(
      finite(lightingInput.hemisphereIntensity, DEFAULT_BASE_LIGHTING.hemisphereIntensity),
      0,
      3
    ),
    ambientIntensity: clampNumber(
      finite(lightingInput.ambientIntensity, DEFAULT_BASE_LIGHTING.ambientIntensity),
      0,
      2
    ),
    mainIntensity: clampNumber(
      finite(lightingInput.mainIntensity, DEFAULT_BASE_LIGHTING.mainIntensity),
      0,
      5
    ),
    mainAzimuth: clampNumber(
      finite(lightingInput.mainAzimuth, DEFAULT_BASE_LIGHTING.mainAzimuth),
      -180,
      180
    ),
    mainElevation: clampNumber(
      finite(lightingInput.mainElevation, DEFAULT_BASE_LIGHTING.mainElevation),
      5,
      89
    ),
    mainShadowIntensity: clampNumber(
      finite(lightingInput.mainShadowIntensity, DEFAULT_BASE_LIGHTING.mainShadowIntensity),
      0,
      1
    ),
    fillIntensity: clampNumber(
      finite(lightingInput.fillIntensity, DEFAULT_BASE_LIGHTING.fillIntensity),
      0,
      3
    ),
    fillAzimuth: clampNumber(
      finite(lightingInput.fillAzimuth, DEFAULT_BASE_LIGHTING.fillAzimuth),
      -180,
      180
    ),
    fillElevation: clampNumber(
      finite(lightingInput.fillElevation, DEFAULT_BASE_LIGHTING.fillElevation),
      0,
      89
    ),
    topIntensity: clampNumber(
      finite(lightingInput.topIntensity, DEFAULT_BASE_LIGHTING.topIntensity),
      0,
      3
    ),
    topAzimuth: clampNumber(
      finite(lightingInput.topAzimuth, DEFAULT_BASE_LIGHTING.topAzimuth),
      -180,
      180
    ),
    topElevation: clampNumber(
      finite(lightingInput.topElevation, DEFAULT_BASE_LIGHTING.topElevation),
      0,
      89
    )
  };
}
