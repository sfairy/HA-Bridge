function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
export function finite(value, fallback = 0) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  } else {
    return fallback;
  }
}
export function normalizeFullRotation(fullRotation, fallback = 0) {
  const rotation = finite(fullRotation, fallback);
  if (rotation >= 0 && rotation <= 360) {
    return rotation;
  } else {
    return ((rotation % 360) + 360) % 360;
  }
}
export function itemMinimumHeight(kind) {
  if (kind === "planlabel") {
    return 0.001;
  } else if (kind === "rug") {
    return 0.004;
  } else {
    return 0.05;
  }
}
export function normalizePoint(point) {
  return {
    x: finite(point?.x),
    y: finite(point?.y),
  };
}
export function normalizeLabelText(labelText, fallback, maxLength) {
  return (
    String(labelText ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength) || fallback
  );
}
export function kelvinToRgbHex(kelvin) {
  const temperature = clamp(finite(kelvin, 3000), 2200, 6500) / 100;
  const red =
    temperature <= 66
      ? 255
      : (temperature - 60) ** -0.1332047592 * 329.698727446;
  const green =
    temperature <= 66
      ? Math.log(temperature) * 99.4708025861 - 161.1195681661
      : (temperature - 60) ** -0.0755148492 * 288.1221695283;
  const blue =
    temperature >= 66
      ? 255
      : temperature <= 19
        ? 0
        : Math.log(temperature - 10) * 138.5177312231 - 305.0447927307;
  const toByte = (channel) => Math.round(clamp(channel, 0, 255));
  return (toByte(red) << 16) | (toByte(green) << 8) | toByte(blue);
}
export function normalizeFixedCameraView(fixedCameraView) {
  if (!fixedCameraView || typeof fixedCameraView != "object") {
    return null;
  }
  const position = {
    x: clamp(finite(fixedCameraView.position?.x), -500, 500),
    y: clamp(finite(fixedCameraView.position?.y), -500, 500),
    z: clamp(finite(fixedCameraView.position?.z), -500, 500),
  };
  const target = {
    x: clamp(finite(fixedCameraView.target?.x), -500, 500),
    y: clamp(finite(fixedCameraView.target?.y), -500, 500),
    z: clamp(finite(fixedCameraView.target?.z), -500, 500),
  };
  if (
    Math.hypot(
      position.x - target.x,
      position.y - target.y,
      position.z - target.z,
    ) < 0.1
  ) {
    return null;
  } else {
    return {
      mode:
        fixedCameraView.mode === "perspective" ? "perspective" : "orthographic",
      view: fixedCameraView.view === "top" ? "top" : "free",
      topRotation:
        (((Math.round(finite(fixedCameraView.topRotation, 0) / 90) * 90) %
          360) +
          360) %
        360,
      position,
      target,
      visibleHeight: clamp(finite(fixedCameraView.visibleHeight, 10), 1, 100),
      fov: clamp(finite(fixedCameraView.fov, 36), 20, 80),
      focalLength:
        fixedCameraView.focalLength !== null &&
        fixedCameraView.focalLength !== undefined &&
        Number.isFinite(Number(fixedCameraView.focalLength))
          ? clamp(finite(fixedCameraView.focalLength, 50), 18, 120)
          : null,
    };
  }
}
export function normalizeCameraSettings(cameraSettings) {
  return {
    cameraView: cameraSettings?.cameraView === "top" ? "top" : "free",
    cameraTopRotation:
      (((Math.round(finite(cameraSettings?.cameraTopRotation, 0) / 90) * 90) %
        360) +
        360) %
      360,
    cameraMode:
      cameraSettings?.cameraMode === "orthographic"
        ? "orthographic"
        : "perspective",
    cameraFocalLength: clamp(
      finite(cameraSettings?.cameraFocalLength, 50),
      18,
      120,
    ),
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
  topElevation: 86,
});
export function normalizeBaseLighting(baseLighting) {
  const lighting =
    baseLighting && typeof baseLighting == "object" ? baseLighting : {};
  return {
    exposure: clamp(
      finite(lighting.exposure, DEFAULT_BASE_LIGHTING.exposure),
      0.5,
      2,
    ),
    hemisphereIntensity: clamp(
      finite(
        lighting.hemisphereIntensity,
        DEFAULT_BASE_LIGHTING.hemisphereIntensity,
      ),
      0,
      3,
    ),
    ambientIntensity: clamp(
      finite(lighting.ambientIntensity, DEFAULT_BASE_LIGHTING.ambientIntensity),
      0,
      2,
    ),
    mainIntensity: clamp(
      finite(lighting.mainIntensity, DEFAULT_BASE_LIGHTING.mainIntensity),
      0,
      5,
    ),
    mainAzimuth: clamp(
      finite(lighting.mainAzimuth, DEFAULT_BASE_LIGHTING.mainAzimuth),
      -180,
      180,
    ),
    mainElevation: clamp(
      finite(lighting.mainElevation, DEFAULT_BASE_LIGHTING.mainElevation),
      5,
      89,
    ),
    mainShadowIntensity: clamp(
      finite(
        lighting.mainShadowIntensity,
        DEFAULT_BASE_LIGHTING.mainShadowIntensity,
      ),
      0,
      1,
    ),
    fillIntensity: clamp(
      finite(lighting.fillIntensity, DEFAULT_BASE_LIGHTING.fillIntensity),
      0,
      3,
    ),
    fillAzimuth: clamp(
      finite(lighting.fillAzimuth, DEFAULT_BASE_LIGHTING.fillAzimuth),
      -180,
      180,
    ),
    fillElevation: clamp(
      finite(lighting.fillElevation, DEFAULT_BASE_LIGHTING.fillElevation),
      0,
      89,
    ),
    topIntensity: clamp(
      finite(lighting.topIntensity, DEFAULT_BASE_LIGHTING.topIntensity),
      0,
      3,
    ),
    topAzimuth: clamp(
      finite(lighting.topAzimuth, DEFAULT_BASE_LIGHTING.topAzimuth),
      -180,
      180,
    ),
    topElevation: clamp(
      finite(lighting.topElevation, DEFAULT_BASE_LIGHTING.topElevation),
      0,
      89,
    ),
  };
}
