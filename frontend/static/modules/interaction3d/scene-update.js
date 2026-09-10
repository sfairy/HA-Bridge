const VISUAL_SETTINGS_KEYS = ["planViewRotation", "cameraView", "cameraTopRotation", "cameraMode", "cameraFocalLength", "fixedCameraView", "livePreviewEnabled", "backgroundVisible", "snapEnabled", "snapEndpoints", "snapIntersections", "snapSegments", "snapOrthogonal", "snapAngles", "snapGrid", "snapTolerance", "previewPanelRatio", "detailsPanelWidthRatio"];
const DOCUMENT_META_KEYS = ["activeFloorId", "previewFloorMode", "combinedCameraSettings", "combinedFixedCameraView", "exportFloorGap", "exportPresets", "activeExportPresetSlot"];
function omitKeys(value, keys) {
  const next = {
    ...value
  };
  for (const key of keys) {
    delete next[key];
  }
  return next;
}
function sortDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortDeep);
  }
  if (value && typeof value == "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortDeep(value[key])]));
  }
  return value;
}
const stableStringify = value => JSON.stringify(sortDeep(value));
const floorSceneSignature = floor => ({
  ...floor.scene,
  settings: omitKeys(floor.scene?.settings, VISUAL_SETTINGS_KEYS)
});
const floorMetaSignature = floor => omitKeys(floor, ["scene", "name", "aligned", "alignmentPending"]);
export function sceneUpdatePlan(previous, next) {
  const previousById = new Map(previous.floors.map(floor => [floor.id, floor]));
  const documentCore = doc => omitKeys(doc, [...DOCUMENT_META_KEYS, "floors", "baseLighting"]);
  const full = stableStringify(documentCore(previous)) !== stableStringify(documentCore(next)) || stableStringify(previous.floors.map(floorMetaSignature)) !== stableStringify(next.floors.map(floorMetaSignature));
  const floors = next.floors.filter(floor => !previousById.has(floor.id) || stableStringify(floorSceneSignature(previousById.get(floor.id))) !== stableStringify(floorSceneSignature(floor))).map(floor => floor.id);
  const lighting = stableStringify(previous.baseLighting) !== stableStringify(next.baseLighting);
  return {
    full,
    floors,
    lighting,
    visual: full || floors.length > 0 || lighting
  };
}
