function getFloorFrame(config, floorId, allFloorId) {
  const floors = config.floors || [];
  const floor = floors.find((entry) => entry.id === (floorId === "all" ? allFloorId : floorId));
  if (!floor) {
    return null;
  }
  const scene = floor.scene;
  const ppm = scene.calibration?.pixelsPerMeter || 1;
  if (floorId === "all" && floors.length > 1) {
    const radians = (-(floor.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return {
      ppm,
      c: cos,
      s: sin,
      x:
        (floor.offsetX || 0) -
        (cos * (floor.originX || 0) + sin * (floor.originY || 0)) / ppm,
      z:
        (floor.offsetZ || 0) -
        (-sin * (floor.originX || 0) + cos * (floor.originY || 0)) / ppm,
      y:
        [...floors].sort((a, b) => a.elevation - b.elevation).indexOf(floor) *
        config.previewFloorGap,
    };
  }
  let points = scene.walls?.length
    ? scene.walls.flatMap((wall) => [wall.start, wall.end])
    : scene.items?.length
      ? scene.items
      : scene.background?.width && scene.background?.height
        ? [
            {
              x: 0,
              y: 0,
            },
            {
              x: scene.background.width,
              y: scene.background.height,
            },
          ]
        : [
            {
              x: 0,
              y: 0,
            },
            {
              x: 1200,
              y: 800,
            },
          ];
  points = points.filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y));
  if (!points.length) {
    return null;
  }
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxX = Math.max(minX + 1, ...points.map((point) => point.x));
  const maxY = Math.max(minY + 1, ...points.map((point) => point.y));
  return {
    ppm,
    c: 1,
    s: 0,
    x: -(minX + maxX) / 2 / ppm,
    z: -(minY + maxY) / 2 / ppm,
    y: 0,
  };
}
export function transformSceneCamera(camera, fromConfig, toConfig, floorId, reverse = false) {
  if (!camera) {
    return camera;
  }
  const sharedFloorId = fromConfig.floors?.find((fromFloor) =>
    toConfig.floors?.some((toFloor) => toFloor.id === fromFloor.id),
  )?.id;
  let fromFrame = getFloorFrame(fromConfig, floorId, sharedFloorId);
  let toFrame = getFloorFrame(toConfig, floorId, sharedFloorId);
  if (!fromFrame || !toFrame) {
    return structuredClone(camera);
  }
  if (reverse) {
    [fromFrame, toFrame] = [toFrame, fromFrame];
  }
  const scale = fromFrame.ppm / toFrame.ppm;
  const cos = toFrame.c * fromFrame.c + toFrame.s * fromFrame.s;
  const sin = toFrame.s * fromFrame.c - toFrame.c * fromFrame.s;
  const rotateVector = ([x, y, z]) => [
    cos * x + sin * z,
    y,
    -sin * x + cos * z,
  ];
  const transformPoint = ([x, y, z]) => {
    const rotated = rotateVector([x - fromFrame.x, y - fromFrame.y, z - fromFrame.z]);
    return [
      rotated[0] * scale + toFrame.x,
      rotated[1] * scale + toFrame.y,
      rotated[2] * scale + toFrame.z,
    ];
  };
  return {
    ...structuredClone(camera),
    position: transformPoint(camera.position),
    target: transformPoint(camera.target),
    ...(camera.up
      ? {
          up: rotateVector(camera.up),
        }
      : {}),
    ...(camera.frameSize
      ? {
          frameSize: camera.frameSize * scale,
        }
      : {}),
  };
}
