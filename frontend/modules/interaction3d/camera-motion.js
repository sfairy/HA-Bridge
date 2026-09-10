const EPSILON = 1e-8;
const WORLD_LIMIT = 10000;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback) => Number.isFinite(value) ? value : fallback;
function cloneCameraState(state) {
  return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}
function vectorFrom(THREE, values, fallback) {
  return new THREE.Vector3(...[0, 1, 2].map(index => finite(values?.[index], fallback[index])));
}
function cameraFrame(THREE, camera) {
  const target = vectorFrom(THREE, camera.target, [0, 0, 0]);
  const offset = vectorFrom(THREE, camera.position, [0, 3, 6]).clone().sub(target);
  const distance = Math.max(offset.length(), 1e-8);
  if (offset.lengthSq() < 1.0000000000000001e-16) {
    offset.set(0, 0, 1);
  }
  offset.normalize();
  const up = vectorFrom(THREE, camera.up, [0, 1, 0]);
  up.addScaledVector(offset, -up.dot(offset));
  if (up.lengthSq() < 1.0000000000000001e-16) {
    up.set(0, Math.abs(offset.y) < 0.9 ? 1 : 0, Math.abs(offset.y) < 0.9 ? 0 : -1);
    up.addScaledVector(offset, -up.dot(offset));
  }
  up.normalize();
  const right = up.clone().cross(offset).normalize();
  up.crossVectors(offset, right).normalize();
  const rotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, offset));
  return {
    target,
    distance,
    rotation
  };
}
function easeProgress(elapsed, duration, rate) {
  return -Math.expm1(-rate * elapsed / 1000) / -Math.expm1(-rate * duration / 1000);
}
export function sampleFocusCamera(THREE, from, to, elapsed, durationMs = 1100) {
  return createFocusCameraSampler(THREE, from, to, durationMs)(elapsed);
}
export function createFocusCameraSampler(THREE, fromCamera, toCamera, durationMs = 1100, arg3 = "focus", fromPivot2 = null) {
  fromCamera = cloneCameraState(fromCamera);
  toCamera = cloneCameraState(toCamera);
  const duration = Math.max(0, finite(durationMs, 1100));
  let fromFrame;
  let toFrame;
  let fromPivot3;
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
    const positionT = time / duration;
    const rotationT = positionT * positionT * (3 - positionT * 2);
    const value3 = arg3 === "floor" ? rotationT : easeProgress(time, duration, 5);
    const target = arg3 === "floor" ? rotationT : easeProgress(time, duration, 4);
    const distance = fromFrame.rotation.clone().slerp(toFrame.rotation, target).normalize();
    let position = fromFrame.target.clone().lerp(toFrame.target, value3);
    const up = Math.max(1e-8, fromFrame.distance + (toFrame.distance - fromFrame.distance) * value3);
    let next = new THREE.Vector3(0, 0, up).applyQuaternion(distance).add(position);
    if (arg3 === "floor" && fromPivot2?.fromPivot && fromPivot2?.toPivot) {
      if (!fromPivot3) {
        const fromPivot = vectorFrom(THREE, fromPivot2.fromPivot, [0, 0, 0]);
        const toPivot = vectorFrom(THREE, fromPivot2.toPivot, [0, 0, 0]);
        const value = (arg, arg2, clone) => vectorFrom(THREE, arg, [0, 0, 0]).sub(arg2).applyQuaternion(clone.clone().invert());
        fromPivot3 = {
          fromPivot,
          toPivot,
          fromPosition: value(fromCamera.position, fromPivot, fromFrame.rotation),
          toPosition: value(toCamera.position, toPivot, toFrame.rotation),
          fromTarget: value(fromCamera.target, fromPivot, fromFrame.rotation),
          toTarget: value(toCamera.target, toPivot, toFrame.rotation)
        };
      }
      const value2 = fromPivot3.fromPivot.clone().lerp(fromPivot3.toPivot, value3);
      next = fromPivot3.fromPosition.clone().lerp(fromPivot3.toPosition, value3).applyQuaternion(distance).add(value2);
      position = fromPivot3.fromTarget.clone().lerp(fromPivot3.toTarget, value3).applyQuaternion(distance).add(value2);
    }
    const toArray = new THREE.Vector3(0, 1, 0).applyQuaternion(distance).normalize();
    const next2 = {
      ...cloneCameraState(fromCamera),
      ...cloneCameraState(toCamera),
      position: next.toArray(),
      target: position.toArray(),
      up: toArray.toArray()
    };
    for (const [key, fallback] of [["zoom", 1], ["focalLength", 50], ["frameSize", 10]]) {
      if (key in fromCamera || key in toCamera) {
        const fromValue = finite(fromCamera[key], fallback);
        const toValue = finite(toCamera[key], fallback);
        next2[key] = fromValue + (toValue - fromValue) * value3;
      }
    }
    return next2;
  };
}
function projectAlongRay(THREE, origin, direction, maxDistance) {
  let distance = maxDistance;
  for (const axis of ["x", "y", "z"]) {
    if (Math.abs(direction[axis]) > 1e-8) {
      const limit = Math.sign(direction[axis]) * 10000;
      distance = Math.min(distance, Math.max(0, (limit - origin[axis]) / direction[axis]));
    }
  }
  if (distance < 1e-8) {
    direction.copy(origin).negate();
    if (direction.lengthSq() < 1e-8) {
      direction.set(0, 0, 1);
    }
    direction.normalize();
    return projectAlongRay(THREE, origin, direction, Math.min(maxDistance, 10000));
  } else {
    return origin.clone().addScaledVector(direction, distance);
  }
}
export function automaticLightCamera(THREE, camera, lightTarget) {
  const source = camera || {};
  const {
    distance,
    rotation
  } = cameraFrame(THREE, source);
  const target = vectorFrom(THREE, lightTarget, [0, 0, 0]).clampScalar(-10000, 10000);
  const perspective = source.mode === "perspective";
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation).normalize();
  const maxDistance = perspective ? Math.max(3, distance * 0.5) : Math.max(3, distance);
  const position = projectAlongRay(THREE, target, forward, maxDistance);
  const look = position.clone().sub(target).normalize();
  const preferredUp = vectorFrom(THREE, source.up, [0, 1, 0]);
  const preferredLength = preferredUp.length();
  const preferredUsable = preferredLength > 1e-8 && preferredUp.clone().divideScalar(preferredLength).cross(look).lengthSq() > 1.0000000000000001e-16;
  const up = preferredUsable ? preferredUp : new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize();
  const next = {
    mode: perspective ? "perspective" : "orthographic",
    position: position.toArray(),
    target: target.toArray(),
    up: up.toArray(),
    zoom: clamp(finite(source.zoom, 1) * (perspective ? 1 : 2.2), 0.01, 100),
    frameSize: clamp(finite(source.frameSize, 10), 0.001, 20000),
    focalLength: clamp(finite(source.focalLength, 50), 18, 120),
    view: source.view === "top" ? "top" : "free",
    topRotation: clamp(finite(source.topRotation, 0), 0, 360)
  };
  if (!preferredUsable) {
    const frame = cameraFrame(THREE, next);
    next.up = new THREE.Vector3(0, 1, 0).applyQuaternion(frame.rotation).normalize().toArray();
  }
  return next;
}
export function automaticAirConditionerCamera(Vector3, arg4, arg5, arg6, arg7, {
  minimumFrameSize: arg8 = 3,
  minimumDistance: arg9 = 3
} = {}) {
  const aspect = arg4 || {};
  const x2 = vectorFrom(Vector3, arg5, [0, 0, 0]).clampScalar(-10000, 10000);
  const y = vectorFrom(Vector3, arg6, [0, 0, 1]);
  y.y = 0;
  const value5 = Math.max(Math.abs(y.x), Math.abs(y.z));
  if (value5 < 1e-8) {
    y.set(0, 0, 1);
  } else {
    y.divideScalar(value5).normalize();
  }
  const clone2 = new Vector3.Vector3(0, 1, 0);
  const clone3 = y.clone().addScaledVector(clone2, 0.38).normalize();
  const value6 = clone2.clone().cross(clone3).normalize();
  const value7 = clone3.clone().cross(value6).normalize();
  const x3 = vectorFrom(Vector3, arg7, [0.9, 0.28, 0.22]);
  for (const value4 of ["x", "y", "z"]) {
    x3[value4] = clamp(Math.abs(x3[value4]), 0.01, 10000);
  }
  const value8 = x => Math.abs(x.x) * x3.x + Math.abs(x.y) * x3.y + Math.abs(x.z) * x3.z;
  const value9 = clamp(finite(aspect.aspect, finite(aspect.viewportAspect, 1.6)), 0.25, 4);
  const value10 = value8(value7);
  const value11 = value8(value6);
  const value12 = value8(clone3);
  const frameSize = clamp(Math.max(arg8, value10 * 2.1, value11 / value9 * 1.8), arg8, 20000);
  const value13 = aspect.mode === "perspective";
  const focalLength = 35;
  const value14 = clamp(value13 ? frameSize * Math.max(value9, 1) + value12 * 0.5 : value12 * 0.5 + 2, arg9, 10000);
  let distanceTo = projectAlongRay(Vector3, x2, clone3.clone(), value14);
  if (distanceTo.distanceTo(x2) < arg9 - 1e-8) {
    const z = new Vector3.Vector3(-Math.sign(x2.x), -Math.sign(x2.y) * 0.38, -Math.sign(x2.z));
    if (Math.abs(z.x) + Math.abs(z.z) < 1e-8) {
      z.z = 1;
    }
    distanceTo = projectAlongRay(Vector3, x2, z.normalize(), value14);
  }
  return {
    mode: value13 ? "perspective" : "orthographic",
    position: distanceTo.toArray(),
    target: x2.toArray(),
    up: clone2.toArray(),
    zoom: 1,
    frameSize,
    focalLength,
    view: "free",
    topRotation: 0
  };
}
