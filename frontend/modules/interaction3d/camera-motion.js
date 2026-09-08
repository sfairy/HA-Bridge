const EPSILON = 1e-8;
const WORLD_LIMIT = 10000;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback) => (Number.isFinite(value) ? value : fallback);

function cloneCameraState(state) {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      Array.isArray(value) ? [...value] : value,
    ]),
  );
}

function vectorFrom(THREE, values, fallback) {
  return new THREE.Vector3(
    ...[0, 1, 2].map((index) => finite(values?.[index], fallback[index])),
  );
}

function cameraFrame(THREE, camera) {
  const target = vectorFrom(THREE, camera.target, [0, 0, 0]);
  const offset = vectorFrom(THREE, camera.position, [0, 3, 6])
    .clone()
    .sub(target);
  const distance = Math.max(offset.length(), EPSILON);
  if (offset.lengthSq() < EPSILON * EPSILON) {
    offset.set(0, 0, 1);
  }
  offset.normalize();
  const up = vectorFrom(THREE, camera.up, [0, 1, 0]);
  up.addScaledVector(offset, -up.dot(offset));
  if (up.lengthSq() < EPSILON * EPSILON) {
    up.set(
      0,
      Math.abs(offset.y) < 0.9 ? 1 : 0,
      Math.abs(offset.y) < 0.9 ? 0 : -1,
    );
    up.addScaledVector(offset, -up.dot(offset));
  }
  up.normalize();
  const right = up.clone().cross(offset).normalize();
  up.crossVectors(offset, right).normalize();
  const rotation = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(right, up, offset),
  );
  return { target, distance, rotation };
}

function easeProgress(elapsed, duration, rate) {
  return (
    -Math.expm1((-rate * elapsed) / 1000) /
    -Math.expm1((-rate * duration) / 1000)
  );
}

export function sampleFocusCamera(THREE, from, to, elapsed, durationMs = 1100) {
  return createFocusCameraSampler(THREE, from, to, durationMs)(elapsed);
}

export function createFocusCameraSampler(
  THREE,
  fromCamera,
  toCamera,
  durationMs = 1100,
) {
  fromCamera = cloneCameraState(fromCamera);
  toCamera = cloneCameraState(toCamera);
  const duration = Math.max(0, finite(durationMs, 1100));
  let fromFrame;
  let toFrame;
  return function (elapsed) {
    const time = Number.isNaN(elapsed) ? 0 : elapsed;
    if (duration === 0 || time >= duration) {
      return cloneCameraState(toCamera);
    }
    if (!(time > 0)) {
      return cloneCameraState(fromCamera);
    }
    fromFrame ||= cameraFrame(THREE, fromCamera);
    toFrame ||= cameraFrame(THREE, toCamera);
    const positionT = easeProgress(time, duration, 5);
    const rotationT = easeProgress(time, duration, 4);
    const rotation = fromFrame.rotation
      .clone()
      .slerp(toFrame.rotation, rotationT)
      .normalize();
    const target = fromFrame.target.clone().lerp(toFrame.target, positionT);
    const distance = Math.max(
      EPSILON,
      fromFrame.distance + (toFrame.distance - fromFrame.distance) * positionT,
    );
    const position = new THREE.Vector3(0, 0, distance)
      .applyQuaternion(rotation)
      .add(target);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize();
    const next = {
      ...cloneCameraState(fromCamera),
      ...cloneCameraState(toCamera),
      position: position.toArray(),
      target: target.toArray(),
      up: up.toArray(),
    };
    for (const [key, fallback] of [
      ["zoom", 1],
      ["focalLength", 50],
      ["frameSize", 10],
    ]) {
      if (key in fromCamera || key in toCamera) {
        const fromValue = finite(fromCamera[key], fallback);
        const toValue = finite(toCamera[key], fallback);
        next[key] = fromValue + (toValue - fromValue) * positionT;
      }
    }
    return next;
  };
}

function projectAlongRay(THREE, origin, direction, maxDistance) {
  let distance = maxDistance;
  for (const axis of ["x", "y", "z"]) {
    if (Math.abs(direction[axis]) > EPSILON) {
      const limit = Math.sign(direction[axis]) * WORLD_LIMIT;
      distance = Math.min(
        distance,
        Math.max(0, (limit - origin[axis]) / direction[axis]),
      );
    }
  }
  if (distance < EPSILON) {
    direction.copy(origin).negate();
    if (direction.lengthSq() < EPSILON) {
      direction.set(0, 0, 1);
    }
    direction.normalize();
    return projectAlongRay(
      THREE,
      origin,
      direction,
      Math.min(maxDistance, WORLD_LIMIT),
    );
  }
  return origin.clone().addScaledVector(direction, distance);
}

export function automaticLightCamera(THREE, camera, lightTarget) {
  const source = camera || {};
  const { distance, rotation } = cameraFrame(THREE, source);
  const target = vectorFrom(THREE, lightTarget, [0, 0, 0]).clampScalar(
    -WORLD_LIMIT,
    WORLD_LIMIT,
  );
  const perspective = source.mode === "perspective";
  const forward = new THREE.Vector3(0, 0, 1)
    .applyQuaternion(rotation)
    .normalize();
  const maxDistance = perspective
    ? Math.max(3, distance * 0.5)
    : Math.max(3, distance);
  const position = projectAlongRay(THREE, target, forward, maxDistance);
  const look = position.clone().sub(target).normalize();
  const preferredUp = vectorFrom(THREE, source.up, [0, 1, 0]);
  const preferredLength = preferredUp.length();
  const preferredUsable =
    preferredLength > EPSILON &&
    preferredUp.clone().divideScalar(preferredLength).cross(look).lengthSq() >
      EPSILON * EPSILON;
  const up = preferredUsable
    ? preferredUp
    : new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize();
  const next = {
    mode: perspective ? "perspective" : "orthographic",
    position: position.toArray(),
    target: target.toArray(),
    up: up.toArray(),
    zoom: clamp(finite(source.zoom, 1) * (perspective ? 1 : 2.2), 0.01, 100),
    frameSize: clamp(finite(source.frameSize, 10), 0.001, 20000),
    focalLength: clamp(finite(source.focalLength, 50), 18, 120),
    view: source.view === "top" ? "top" : "free",
    topRotation: clamp(finite(source.topRotation, 0), 0, 360),
  };
  if (!preferredUsable) {
    const frame = cameraFrame(THREE, next);
    next.up = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(frame.rotation)
      .normalize()
      .toArray();
  }
  return next;
}
