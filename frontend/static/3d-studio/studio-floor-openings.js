export function floorOpeningPolygon(rotation, arg3) {
  const value = rotation.rotation * Math.PI / 180;
  const value2 = Math.cos(value);
  const value3 = Math.sin(value);
  const value4 = rotation.width * arg3 / 2;
  const value5 = rotation.depth * arg3 / 2;
  return [[-value4, -value5], [value4, -value5], [value4, value5], [-value4, value5]].map(([arg, arg2]) => ({
    x: rotation.x + arg * value2 - arg2 * value3,
    y: rotation.y + arg * value3 + arg2 * value2
  }));
}
