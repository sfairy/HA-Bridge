export function windowGeometryParts(windowWidth, windowHeight, sillHeight, allowDivided = true) {
  if (
    ![windowWidth, windowHeight, sillHeight].every(Number.isFinite) ||
    windowWidth <= 0 ||
    windowHeight <= 0
  ) {
    return null;
  }
  const frameThickness = Math.min(0.045, windowWidth / 4, windowHeight / 4);
  const centerY = sillHeight + windowHeight / 2;
  const glassParts = [
    [windowWidth - frameThickness, windowHeight - frameThickness, 0.025, 0, centerY, 0]
  ];
  const frameParts = [
    [windowWidth, frameThickness, 0.06, 0, sillHeight + frameThickness / 2, 0],
    [windowWidth, frameThickness, 0.06, 0, sillHeight + windowHeight - frameThickness / 2, 0],
    [
      frameThickness,
      windowHeight - frameThickness * 2,
      0.06,
      -(windowWidth - frameThickness) / 2,
      centerY,
      0
    ],
    [
      frameThickness,
      windowHeight - frameThickness * 2,
      0.06,
      (windowWidth - frameThickness) / 2,
      centerY,
      0
    ]
  ];
  const isDivided = allowDivided && windowWidth > 1.2;
  if (isDivided) {
    frameParts.push([
      frameThickness * 0.7,
      windowHeight - frameThickness * 2,
      0.055,
      0,
      centerY,
      0
    ]);
  }
  return {
    glass: glassParts,
    frames: frameParts,
    divided: isDivided
  };
}
