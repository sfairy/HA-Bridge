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

function finite(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizePoint3(point, fallback = {}) {
  return {
    x: finite(point?.x, fallback.x),
    y: finite(point?.y, fallback.y),
    z: finite(point?.z, fallback.z),
  };
}

function normalizeSelectedFiles(files) {
  if (!Array.isArray(files)) {
    return [];
  }
  return [
    ...new Set(
      files
        .map((file) => String(file || ""))
        .filter(
          (file) =>
            ALLOWED_EXPORT_FILES.has(file) ||
            /^(?:group|screen|vehicle):[A-Za-z0-9_.:-]{1,180}$/.test(file),
        ),
    ),
  ].slice(0, 128);
}

function normalizeCamera(camera) {
  const mode = camera?.mode === "perspective" ? "perspective" : "orthographic";
  const view = camera?.view === "top" ? "top" : "free";
  return {
    mode,
    view,
    topRotation:
      (((Math.round(finite(camera?.topRotation, 0) / 90) * 90) % 360) + 360) %
      360,
    position: normalizePoint3(camera?.position, { x: 7, y: 7, z: 7 }),
    target: normalizePoint3(camera?.target, { x: 0, y: 0.6, z: 0 }),
    visibleHeight: clamp(finite(camera?.visibleHeight, 10), 0.1, 1000),
    fov: clamp(finite(camera?.fov, 36), 5, 120),
    focalLength:
      mode === "perspective"
        ? clamp(finite(camera?.focalLength, 50), 18, 120)
        : null,
  };
}

export function normalizeExportPreset(preset) {
  if (!preset || typeof preset != "object") {
    return null;
  }
  const width = Math.round(clamp(finite(preset.width, 1852), 320, 4096));
  const height = Math.round(clamp(finite(preset.height, 1293), 320, 4096));
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
    floorGap: clamp(finite(preset.floorGap, 3), 0, 20),
    camera: normalizeCamera(preset.camera),
    folderName: String(preset.folderName || "").slice(0, 60),
    selectedFiles: normalizeSelectedFiles(preset.selectedFiles),
  };
}

export function normalizeExportPresetSlots(slots) {
  const list = Array.isArray(slots) ? slots : [];
  const count = Array.isArray(slots)
    ? Math.max(1, Math.min(8, list.length || 1))
    : 4;
  return Array.from({ length: count }, (_slot, index) =>
    normalizeExportPreset(list[index]),
  );
}

export function normalizeActiveExportPresetSlot(slot, slotCount = 4) {
  const index = Number(slot);
  const count = Math.max(1, Math.min(8, Number(slotCount) || 4));
  if (Number.isInteger(index) && index >= 0 && index < count) {
    return index;
  }
  return 0;
}

export function exportPresetIsEmpty(preset, keepEmpty = false) {
  return !normalizeExportPreset(preset) && !keepEmpty;
}

export function exportPresetSummary(preset, floorNames = new Map()) {
  const normalized = normalizeExportPreset(preset);
  if (!normalized) {
    return "未设置";
  }
  const floorLabel =
    normalized.floorMode === "all"
      ? "全楼合并"
      : floorNames.get(normalized.floorId) || "楼层已变更";
  const cameraLabel =
    normalized.camera.mode === "perspective" ? "透视" : "正交";
  return (
    normalized.width +
    "×" +
    normalized.height +
    " · " +
    floorLabel +
    " · " +
    cameraLabel
  );
}
