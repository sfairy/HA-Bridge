export function windowGeometryParts(width, height, sillHeight, divided = true) {
  if (![width, height, sillHeight].every(Number.isFinite) || width <= 0 || height <= 0) {
    return null;
  }
  const frameWidth = Math.min(0.045, width / 4, height / 4);
  const centerY = sillHeight + height / 2;
  const glass = [[width - frameWidth, height - frameWidth, 0.025, 0, centerY, 0]];
  const frames = [[width, frameWidth, 0.06, 0, sillHeight + frameWidth / 2, 0], [width, frameWidth, 0.06, 0, sillHeight + height - frameWidth / 2, 0], [frameWidth, height - 2 * frameWidth, 0.06, -(width - frameWidth) / 2, centerY, 0], [frameWidth, height - 2 * frameWidth, 0.06, (width - frameWidth) / 2, centerY, 0]];
  const isDivided = divided && width > 1.2;
  isDivided && frames.push([frameWidth * 0.7, height - 2 * frameWidth, 0.055, 0, centerY, 0]);
  return {
    glass,
    frames,
    divided: isDivided
  };
}
