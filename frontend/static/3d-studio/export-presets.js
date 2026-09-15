export const DEFAULT_EXPORT_PRESET_COUNT = 4;
export const MAX_EXPORT_PRESET_COUNT = 8;
const VALID_SELECTED_FILE_KEYS = new Set([
  "background",
  "backgroundWithPlan",
  "televisionOn",
  "vehicleCharging",
  "floorPlan",
  "dataLights",
  "dataScene"
]);
function toFiniteNumber(value, fallback = 0) {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  } else {
    return fallback;
  }
}
function clampNumber(inputValue, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, inputValue));
}
function normalizeVector3(source, defaults = {}) {
  return {
    x: toFiniteNumber(source?.x, defaults.x),
    y: toFiniteNumber(source?.y, defaults.y),
    z: toFiniteNumber(source?.z, defaults.z)
  };
}
function normalizeSelectedFiles(files) {
  if (Array.isArray(files)) {
    return [
      ...new Set(
        files
          .map(entry => String(entry || ""))
          .filter(
            fileKey =>
              VALID_SELECTED_FILE_KEYS.has(fileKey) ||
              /^(?:group|screen|vehicle):[A-Za-z0-9_.:-]{1,180}$/.test(fileKey)
          )
      )
    ].slice(0, 128);
  } else {
    return [];
  }
}
function normalizePresetCamera(camera) {
  const cameraMode = camera?.mode === "perspective" ? "perspective" : "orthographic";
  const cameraView = camera?.view === "top" ? "top" : "free";
  return {
    mode: cameraMode,
    view: cameraView,
    topRotation:
      (((Math.round(toFiniteNumber(camera?.topRotation, 0) / 90) * 90) % 360) + 360) % 360,
    position: normalizeVector3(camera?.position, {
      x: 7,
      y: 7,
      z: 7
    }),
    target: normalizeVector3(camera?.target, {
      x: 0,
      y: 0.6,
      z: 0
    }),
    visibleHeight: clampNumber(toFiniteNumber(camera?.visibleHeight, 10), 0.1, 1000),
    fov: clampNumber(toFiniteNumber(camera?.fov, 36), 5, 120),
    focalLength:
      cameraMode === "perspective"
        ? clampNumber(toFiniteNumber(camera?.focalLength, 50), 18, 120)
        : null
  };
}
export function normalizeExportPreset(rawPreset) {
  if (!rawPreset || typeof rawPreset != "object") {
    return null;
  }
  const normalizedWidth = Math.round(clampNumber(toFiniteNumber(rawPreset.width, 1852), 320, 4096));
  const normalizedHeight = Math.round(
    clampNumber(toFiniteNumber(rawPreset.height, 1293), 320, 4096)
  );
  return {
    version: 1,
    name: String(rawPreset.name || "")
      .trim()
      .slice(0, 24),
    width: normalizedWidth,
    height: normalizedHeight,
    lockRatio: rawPreset.lockRatio !== false,
    floorMode: rawPreset.floorMode === "all" ? "all" : "floor",
    floorId: String(rawPreset.floorId || "").slice(0, 180),
    floorGap: clampNumber(toFiniteNumber(rawPreset.floorGap, 3), 0, 20),
    camera: normalizePresetCamera(rawPreset.camera),
    folderName: String(rawPreset.folderName || "").slice(0, 60),
    selectedFiles: normalizeSelectedFiles(rawPreset.selectedFiles)
  };
}
export function normalizeExportPresetSlots(slots) {
  const slotList = Array.isArray(slots) ? slots : [];
  const slotCount = Array.isArray(slots) ? Math.max(1, Math.min(8, slotList.length || 1)) : 4;
  return Array.from(
    {
      length: slotCount
    },
    (slotEntry, slotIndex) => normalizeExportPreset(slotList[slotIndex])
  );
}
export function normalizeActiveExportPresetSlot(activeSlotIndex, requestedSlotCount = 4) {
  const slotNumber = Number(activeSlotIndex);
  const maxSlotNumber = Math.max(1, Math.min(8, Number(requestedSlotCount) || 4));
  if (Number.isInteger(slotNumber) && slotNumber >= 0 && slotNumber < maxSlotNumber) {
    return slotNumber;
  } else {
    return 0;
  }
}
export function exportPresetIsEmpty(preset, presetFeatureEnabled = false) {
  return !normalizeExportPreset(preset) && !presetFeatureEnabled;
}
export function exportPresetSummary(storedPreset, floorLabelsById = new Map()) {
  const normalizedPreset = normalizeExportPreset(storedPreset);
  if (!normalizedPreset) {
    return "未设置";
  }
  const floorLabel =
    normalizedPreset.floorMode === "all"
      ? "全楼合并"
      : floorLabelsById.get(normalizedPreset.floorId) || "楼层已变更";
  const cameraModeLabel = normalizedPreset.camera.mode === "perspective" ? "透视" : "正交";
  return (
    normalizedPreset.width +
    "×" +
    normalizedPreset.height +
    " · " +
    floorLabel +
    " · " +
    cameraModeLabel
  );
}
