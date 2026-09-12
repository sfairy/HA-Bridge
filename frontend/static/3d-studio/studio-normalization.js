function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
export function finite(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}
export function normalizeFullRotation(value, fallback = 0) {
  const rotation = finite(value, fallback);
  if (rotation >= 0 && rotation <= 360) {
    return rotation;
  }
  return (rotation % 360 + 360) % 360;
}
export function itemMinimumHeight(itemType) {
  if (itemType === "planlabel") {
    return 0.001;
  }
  if (itemType === "rug") {
    return 0.004;
  }
  return 0.05;
}
export function normalizePoint(point) {
  return {
    x: finite(point?.x),
    y: finite(point?.y)
  };
}
export function normalizeLabelText(value, fallback, maxLength) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength) || fallback;
}
export function kelvinToRgbHex(kelvin) {
  const temperature = clamp(finite(kelvin, 3000), 2200, 6500) / 100;
  const red = temperature <= 66 ? 255 : (temperature - 60) ** -0.1332047592 * 329.698727446;
  const green = temperature <= 66 ? Math.log(temperature) * 99.4708025861 - 161.1195681661 : (temperature - 60) ** -0.0755148492 * 288.1221695283;
  const blue = temperature >= 66 ? 255 : temperature <= 19 ? 0 : Math.log(temperature - 10) * 138.5177312231 - 305.0447927307;
  const channel = value => Math.round(clamp(value, 0, 255));
  return channel(red) << 16 | channel(green) << 8 | channel(blue);
}
export function normalizeFixedCameraView(view) {
  if (!view || typeof view != "object") {
    return null;
  }
  const position = {
    x: clamp(finite(view.position?.x), -500, 500),
    y: clamp(finite(view.position?.y), -500, 500),
    z: clamp(finite(view.position?.z), -500, 500)
  };
  const target = {
    x: clamp(finite(view.target?.x), -500, 500),
    y: clamp(finite(view.target?.y), -500, 500),
    z: clamp(finite(view.target?.z), -500, 500)
  };
  if (Math.hypot(position.x - target.x, position.y - target.y, position.z - target.z) < 0.1) {
    return null;
  }
  return {
    mode: view.mode === "perspective" ? "perspective" : "orthographic",
    view: view.view === "top" ? "top" : "free",
    topRotation: (Math.round(finite(view.topRotation, 0) / 90) * 90 % 360 + 360) % 360,
    position,
    target,
    visibleHeight: clamp(finite(view.visibleHeight, 10), 1, 100),
    fov: clamp(finite(view.fov, 36), 20, 80),
    focalLength: view.focalLength !== null && view.focalLength !== undefined && Number.isFinite(Number(view.focalLength)) ? clamp(finite(view.focalLength, 50), 18, 120) : null
  };
}
export function normalizeCameraSettings(settings) {
  return {
    cameraView: settings?.cameraView === "top" ? "top" : "free",
    cameraTopRotation: (Math.round(finite(settings?.cameraTopRotation, 0) / 90) * 90 % 360 + 360) % 360,
    cameraMode: settings?.cameraMode === "orthographic" ? "orthographic" : "perspective",
    cameraFocalLength: clamp(finite(settings?.cameraFocalLength, 50), 18, 120)
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
export function normalizeBaseLighting(lighting) {
  const source = lighting && typeof lighting == "object" ? lighting : {};
  return {
    exposure: clamp(finite(source.exposure, DEFAULT_BASE_LIGHTING.exposure), 0.5, 2),
    ...(source.floorBrightness !== undefined ? {
      floorBrightness: clamp(finite(source.floorBrightness, 100), 50, 150)
    } : {}),
    hemisphereIntensity: clamp(finite(source.hemisphereIntensity, DEFAULT_BASE_LIGHTING.hemisphereIntensity), 0, 3),
    ambientIntensity: clamp(finite(source.ambientIntensity, DEFAULT_BASE_LIGHTING.ambientIntensity), 0, 2),
    mainIntensity: clamp(finite(source.mainIntensity, DEFAULT_BASE_LIGHTING.mainIntensity), 0, 5),
    mainAzimuth: clamp(finite(source.mainAzimuth, DEFAULT_BASE_LIGHTING.mainAzimuth), -180, 180),
    mainElevation: clamp(finite(source.mainElevation, DEFAULT_BASE_LIGHTING.mainElevation), 5, 89),
    mainShadowIntensity: clamp(finite(source.mainShadowIntensity, DEFAULT_BASE_LIGHTING.mainShadowIntensity), 0, 1),
    fillIntensity: clamp(finite(source.fillIntensity, DEFAULT_BASE_LIGHTING.fillIntensity), 0, 3),
    fillAzimuth: clamp(finite(source.fillAzimuth, DEFAULT_BASE_LIGHTING.fillAzimuth), -180, 180),
    fillElevation: clamp(finite(source.fillElevation, DEFAULT_BASE_LIGHTING.fillElevation), 0, 89),
    topIntensity: clamp(finite(source.topIntensity, DEFAULT_BASE_LIGHTING.topIntensity), 0, 3),
    topAzimuth: clamp(finite(source.topAzimuth, DEFAULT_BASE_LIGHTING.topAzimuth), -180, 180),
    topElevation: clamp(finite(source.topElevation, DEFAULT_BASE_LIGHTING.topElevation), 0, 89)
  };
}
