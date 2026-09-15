function toPositiveNumber(value) {
  const parsedValue = Number(value);
  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  } else {
    return 3;
  }
}
export function reorderFloors(
  floors,
  draggedFloorId,
  targetFloorId,
  placeAfter = false,
  defaultFloorSpacing = 3
) {
  if (
    !Array.isArray(floors) ||
    floors.length < 2 ||
    !draggedFloorId ||
    !targetFloorId ||
    draggedFloorId === targetFloorId
  ) {
    return floors;
  }
  const draggedIndex = floors.findIndex(floorEntry => floorEntry?.id === draggedFloorId);
  const targetIndex = floors.findIndex(candidateFloor => candidateFloor?.id === targetFloorId);
  if (draggedIndex < 0 || targetIndex < 0) {
    return floors;
  }
  const reorderedFloors = [...floors];
  const [movedFloor] = reorderedFloors.splice(draggedIndex, 1);
  const insertIndex = reorderedFloors.findIndex(
    remainingFloor => remainingFloor?.id === targetFloorId
  );
  reorderedFloors.splice(insertIndex + (placeAfter ? 1 : 0), 0, movedFloor);
  if (
    reorderedFloors.every((orderedFloor, floorIndex) => orderedFloor?.id === floors[floorIndex]?.id)
  ) {
    return floors;
  }
  const floorSpacing = toPositiveNumber(defaultFloorSpacing);
  return reorderedFloors.map((floorRecord, stackIndex) => ({
    ...floorRecord,
    elevation: stackIndex * floorSpacing
  }));
}
