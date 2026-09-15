const IGNORED_SETTING_KEYS = [
  "planViewRotation",
  "cameraView",
  "cameraTopRotation",
  "cameraMode",
  "cameraFocalLength",
  "fixedCameraView",
  "livePreviewEnabled",
  "backgroundVisible",
  "snapEnabled",
  "snapEndpoints",
  "snapIntersections",
  "snapSegments",
  "snapOrthogonal",
  "snapAngles",
  "snapGrid",
  "snapTolerance",
  "previewPanelRatio",
  "detailsPanelWidthRatio"
];
const IGNORED_PROJECT_KEYS = [
  "activeFloorId",
  "previewFloorMode",
  "combinedCameraSettings",
  "combinedFixedCameraView",
  "exportFloorGap",
  "exportPresets",
  "activeExportPresetSlot"
];
function omitKeys(source, keys) {
  const result = {
    ...source
  };
  for (const omittedKey of keys) {
    delete result[omittedKey];
  }
  return result;
}
function sortDeep(node) {
  if (Array.isArray(node)) {
    return node.map(sortDeep);
  } else if (node && typeof node == "object") {
    return Object.fromEntries(
      Object.keys(node)
        .sort()
        .map(sortKey => [sortKey, sortDeep(node[sortKey])])
    );
  } else {
    return node;
  }
}
const stableStringify = value => JSON.stringify(sortDeep(value));
const sceneSignature = floorRecord => ({
  ...floorRecord.scene,
  settings: omitKeys(floorRecord.scene?.settings, IGNORED_SETTING_KEYS)
});
const floorSignature = floorEntry =>
  omitKeys(floorEntry, ["scene", "name", "aligned", "alignmentPending"]);
export function sceneUpdatePlan(previousProject, nextProject) {
  const floorsById = new Map(
    previousProject.floors.map(existingFloor => [existingFloor.id, existingFloor])
  );
  const projectSignature = project =>
    omitKeys(project, [...IGNORED_PROJECT_KEYS, "floors", "baseLighting"]);
  const structureChanged =
    stableStringify(projectSignature(previousProject)) !==
      stableStringify(projectSignature(nextProject)) ||
    stableStringify(previousProject.floors.map(floorSignature)) !==
      stableStringify(nextProject.floors.map(floorSignature));
  const changedFloorIds = nextProject.floors
    .filter(
      candidateFloor =>
        !floorsById.has(candidateFloor.id) ||
        stableStringify(sceneSignature(floorsById.get(candidateFloor.id))) !==
          stableStringify(sceneSignature(candidateFloor))
    )
    .map(floor => floor.id);
  const lightingChanged =
    stableStringify(previousProject.baseLighting) !== stableStringify(nextProject.baseLighting);
  return {
    full: structureChanged,
    floors: changedFloorIds,
    lighting: lightingChanged,
    visual: structureChanged || changedFloorIds.length > 0 || lightingChanged
  };
}
