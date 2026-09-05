export const DEFAULT_EXPORT_PRESET_COUNT = 4;
export const MAX_EXPORT_PRESET_COUNT = 8;
const ALLOWED_EXPORT_FILES = new Set([
  "background",
  "backgroundWithPlan",
  "televisionOn",
  "vehicleCharging",
  "floorPlan",
  "dataLights",
  "dataScene",
]);
function toFiniteNumber(value, fallback = 0) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  } else {
    return fallback;
  }
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function asVec3(value, fallback = {}) {
  return {
    x: toFiniteNumber(value?.x, fallback.x),
    y: toFiniteNumber(value?.y, fallback.y),
    z: toFiniteNumber(value?.z, fallback.z),
  };
}
function normalizeSelectedFiles(value) {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value
          .map((item) => String(item || ""))
          .filter(
            (item) =>
              ALLOWED_EXPORT_FILES.has(item) ||
              /^(?:group|screen|vehicle):[A-Za-z0-9_.:-]{1,180}$/.test(item),
          ),
      ),
    ].slice(0, 128);
  } else {
    return [];
  }
}
function normalizeCamera(camera) {
  const mode = camera?.mode === "perspective" ? "perspective" : "orthographic";
  const view = camera?.view === "top" ? "top" : "free";
  return {
    mode,
    view,
    topRotation:
      (((Math.round(toFiniteNumber(camera?.topRotation, 0) / 90) * 90) % 360) +
        360) %
      360,
    position: asVec3(camera?.position, {
      x: 7,
      y: 7,
      z: 7,
    }),
    target: asVec3(camera?.target, {
      x: 0,
      y: 0.6,
      z: 0,
    }),
    visibleHeight: clamp(toFiniteNumber(camera?.visibleHeight, 10), 0.1, 1000),
    fov: clamp(toFiniteNumber(camera?.fov, 36), 5, 120),
    focalLength:
      mode === "perspective"
        ? clamp(toFiniteNumber(camera?.focalLength, 50), 18, 120)
        : null,
  };
}
export function normalizeExportPreset(preset) {
  if (!preset || typeof preset != "object") {
    return null;
  }
  const width = Math.round(
    clamp(toFiniteNumber(preset.width, 1852), 320, 4096),
  );
  const height = Math.round(
    clamp(toFiniteNumber(preset.height, 1293), 320, 4096),
  );
  return {
    version: 1,
    name: String(preset.name || "")
      .trim()
      .slice(0, 24),
    width,
    height,
    lockRatio: preset.lockRatio !== false,
    floorMode: preset.floorMode === "all" ? "all" : "floor",
    floorId: String(preset.floorId || "").slice(0, 180),
    floorGap: clamp(toFiniteNumber(preset.floorGap, 3), 0, 20),
    camera: normalizeCamera(preset.camera),
    folderName: String(preset.folderName || "").slice(0, 60),
    selectedFiles: normalizeSelectedFiles(preset.selectedFiles),
  };
}
export function normalizeExportPresetSlots(exportPresetList) {
  const list = Array.isArray(exportPresetList) ? exportPresetList : [];
  const count = Array.isArray(exportPresetList)
    ? Math.max(1, Math.min(MAX_EXPORT_PRESET_COUNT, list.length || 1))
    : DEFAULT_EXPORT_PRESET_COUNT;
  return Array.from({ length: count }, (_, index) =>
    normalizeExportPreset(list[index]),
  );
}
export function normalizeActiveExportPresetSlot(
  slotIndex,
  slotCount = DEFAULT_EXPORT_PRESET_COUNT,
) {
  const numeric = Number(slotIndex);
  const count = Math.max(
    1,
    Math.min(
      MAX_EXPORT_PRESET_COUNT,
      Number(slotCount) || DEFAULT_EXPORT_PRESET_COUNT,
    ),
  );
  if (Number.isInteger(numeric) && numeric >= 0 && numeric < count) {
    return numeric;
  } else {
    return 0;
  }
}
export function exportPresetIsEmpty(exportPreset, allowEmpty = false) {
  return !normalizeExportPreset(exportPreset) && !allowEmpty;
}
export function exportPresetSummary(exportPreset, floorNames = new Map()) {
  const preset = normalizeExportPreset(exportPreset);
  if (!preset) {
    return "未设置";
  }
  const floorLabel =
    preset.floorMode === "all"
      ? "全楼合并"
      : floorNames.get(preset.floorId) || "楼层已变更";
  const cameraLabel = preset.camera.mode === "perspective" ? "透视" : "正交";
  return (
    preset.width +
    "×" +
    preset.height +
    " · " +
    floorLabel +
    " · " +
    cameraLabel
  );
}
