function positiveGap(value) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric;
  } else {
    return 3;
  }
}
export function reorderFloors(
  floors,
  sourceId,
  targetId,
  placeAfter = false,
  gap = 3,
) {
  if (
    !Array.isArray(floors) ||
    floors.length < 2 ||
    !sourceId ||
    !targetId ||
    sourceId === targetId
  ) {
    return floors;
  }
  const sourceIndex = floors.findIndex((floor) => floor?.id === sourceId);
  const targetIndex = floors.findIndex((floor) => floor?.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) {
    return floors;
  }
  const next = [...floors];
  const [moved] = next.splice(sourceIndex, 1);
  const insertAt = next.findIndex((floor) => floor?.id === targetId);
  next.splice(insertAt + (placeAfter ? 1 : 0), 0, moved);
  if (next.every((floor, index) => floor?.id === floors[index]?.id)) {
    return floors;
  }
  const elevationGap = positiveGap(gap);
  return next.map((floor, index) => ({
    ...floor,
    elevation: index * elevationGap,
  }));
}
