export function floorOpeningPolygon(opening, scaleFactor) {
  const rotationRad = (opening.rotation * Math.PI) / 180;
  const cosRotation = Math.cos(rotationRad);
  const sinRotation = Math.sin(rotationRad);
  const halfWidth = (opening.width * scaleFactor) / 2;
  const halfDepth = (opening.depth * scaleFactor) / 2;
  return [
    [-halfWidth, -halfDepth],
    [halfWidth, -halfDepth],
    [halfWidth, halfDepth],
    [-halfWidth, halfDepth]
  ].map(([localX, localY]) => ({
    x: opening.x + localX * cosRotation - localY * sinRotation,
    y: opening.y + localX * sinRotation + localY * cosRotation
  }));
}
