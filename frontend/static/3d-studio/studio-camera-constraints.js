export const MAX_CAMERA_POLAR_ANGLE = Math.PI * 0.49;
const MIN_CAMERA_HEIGHT = 0.02;
const COS_MAX_POLAR_ANGLE = Math.cos(MAX_CAMERA_POLAR_ANGLE);
export function constrainCameraPosition(cameraPosition, orbitTarget) {
  const offsetX = cameraPosition.x - orbitTarget.x;
  const offsetY = cameraPosition.y - orbitTarget.y;
  const offsetZ = cameraPosition.z - orbitTarget.z;
  const distance = Math.max(Math.hypot(offsetX, offsetY, offsetZ), 0.001);
  const clampedOffsetY = Math.max(
    distance * COS_MAX_POLAR_ANGLE,
    MIN_CAMERA_HEIGHT - orbitTarget.y
  );
  if (offsetY >= clampedOffsetY - 1e-9) {
    return false;
  }
  const horizontalDistance = Math.hypot(offsetX, offsetZ);
  const clampedDistance = Math.max(distance, clampedOffsetY);
  const constrainedHorizontalDistance = Math.sqrt(
    Math.max(0, clampedDistance * clampedDistance - clampedOffsetY * clampedOffsetY)
  );
  cameraPosition.x =
    orbitTarget.x +
    (horizontalDistance > 1e-9 ? offsetX / horizontalDistance : 0) * constrainedHorizontalDistance;
  cameraPosition.z =
    orbitTarget.z +
    (horizontalDistance > 1e-9 ? offsetZ / horizontalDistance : 1) * constrainedHorizontalDistance;
  cameraPosition.y = orbitTarget.y + clampedOffsetY;
  return true;
}
export function constrainCameraPose(pose) {
  if (!pose) {
    return pose;
  }
  const [positionX, positionY, positionZ] = pose.position;
  const [targetX, targetY, targetZ] = pose.target;
  const cameraPositionVector = {
    x: positionX,
    y: positionY,
    z: positionZ
  };
  if (
    constrainCameraPosition(cameraPositionVector, {
      x: targetX,
      y: targetY,
      z: targetZ
    })
  ) {
    return {
      ...pose,
      position: [cameraPositionVector.x, cameraPositionVector.y, cameraPositionVector.z]
    };
  } else {
    return pose;
  }
}
