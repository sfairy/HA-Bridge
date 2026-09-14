export const MAX_CAMERA_POLAR_ANGLE = Math.PI * 0.49;

const MIN_CAMERA_HEIGHT = 0.02;
const MIN_VERTICAL_RATIO = Math.cos(MAX_CAMERA_POLAR_ANGLE);

export function constrainCameraPosition(position, target) {
  const dx = position.x - target.x;
  const dy = position.y - target.y;
  const dz = position.z - target.z;
  const distance = Math.max(Math.hypot(dx, dy, dz), 0.001);
  const minHeight = Math.max(distance * MIN_VERTICAL_RATIO, MIN_CAMERA_HEIGHT - target.y);
  if (dy >= minHeight - 1e-9) {
    return false;
  }
  const horizontal = Math.hypot(dx, dz);
  const length = Math.max(distance, minHeight);
  const reach = Math.sqrt(Math.max(0, length * length - minHeight * minHeight));
  position.x = target.x + (horizontal > 1e-9 ? dx / horizontal : 0) * reach;
  position.z = target.z + (horizontal > 1e-9 ? dz / horizontal : 1) * reach;
  position.y = target.y + minHeight;
  return true;
}

export function constrainCameraPose(pose) {
  if (!pose) {
    return pose;
  }
  const [px, py, pz] = pose.position;
  const [tx, ty, tz] = pose.target;
  const position = { x: px, y: py, z: pz };
  if (!constrainCameraPosition(position, { x: tx, y: ty, z: tz })) {
    return pose;
  }
  return {
    ...pose,
    position: [position.x, position.y, position.z],
  };
}
