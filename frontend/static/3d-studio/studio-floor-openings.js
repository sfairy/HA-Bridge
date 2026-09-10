export function floorOpeningPolygon(opening, scale) {
  const radians = opening.rotation * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const halfWidth = opening.width * scale / 2;
  const halfDepth = opening.depth * scale / 2;
  return [[-halfWidth, -halfDepth], [halfWidth, -halfDepth], [halfWidth, halfDepth], [-halfWidth, halfDepth]].map(([localX, localY]) => ({
    x: opening.x + localX * cos - localY * sin,
    y: opening.y + localX * sin + localY * cos
  }));
}
