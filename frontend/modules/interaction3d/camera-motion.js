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
function cameraOrbit(THREE, camera, frame) {
  if (camera.view === "top") {
    return null;
  }
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(frame.rotation);
  if (Math.hypot(forward.x, forward.z) < 0.00001) {
    return null;
  }
  const lookAt = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(forward, new THREE.Vector3(), new THREE.Vector3(0, 1, 0)));
  if (lookAt.angleTo(frame.rotation) > 0.00001) {
    return null;
  }
  return {
    theta: Math.atan2(forward.x, forward.z),
    phi: Math.acos(clamp(forward.y, -1, 1))
  };
}
function easeProgress(elapsed, duration, rate) {
  return -Math.expm1(-rate * elapsed / 1000) / -Math.expm1(-rate * duration / 1000);
}
export function sampleFocusCamera(THREE, from, to, elapsed, durationMs = 1100) {
  return createFocusCameraSampler(THREE, from, to, durationMs)(elapsed);
}
export function createFocusCameraSampler(THREE, fromCamera, toCamera, durationMs = 1100, mode = "focus", pivots = null, progress = null) {
  fromCamera = cloneCameraState(fromCamera);
  toCamera = cloneCameraState(toCamera);
  const duration = Math.max(0, finite(durationMs, 1100));
  let fromFrame;
  let toFrame;
  let pivotLocals;
  let orbit;
  return function (elapsed) {
    const time = Number.isNaN(elapsed) ? 0 : elapsed;
    if (progress ? progress.settled(time) : duration === 0 || time >= duration) {
      return cloneCameraState(toCamera);
    }
    if (!(time > 0)) {
      return cloneCameraState(fromCamera);
    }
    fromFrame ||= cameraFrame(THREE, fromCamera);
    toFrame ||= cameraFrame(THREE, toCamera);
    let lerpT;
    let rotationLerp;
    if (progress) {
      lerpT = progress.move(time);
      rotationLerp = progress.turn(time);
    } else if (mode === "floor") {
      lerpT = time / duration;
      lerpT = lerpT * lerpT * (3 - lerpT * 2);
      rotationLerp = lerpT;
    } else {
      lerpT = easeProgress(time, duration, 5);
      rotationLerp = easeProgress(time, duration, 4);
    }
    const rotation = fromFrame.rotation.clone().slerp(toFrame.rotation, rotationLerp).normalize();
    if (mode === "focus-orbit") {
      if (orbit === undefined) {
        const start = cameraOrbit(THREE, fromCamera, fromFrame);
        const end = cameraOrbit(THREE, toCamera, toFrame);
        orbit = start && end ? {
          start,
          end,
          deltaTheta: Math.atan2(Math.sin(end.theta - start.theta), Math.cos(end.theta - start.theta))
        } : null;
      }
      if (orbit) {
        const { start, end, deltaTheta } = orbit;
        const direction = new THREE.Vector3().setFromSphericalCoords(1, start.phi + (end.phi - start.phi) * rotationLerp, start.theta + deltaTheta * rotationLerp);
        rotation.setFromRotationMatrix(new THREE.Matrix4().lookAt(direction, new THREE.Vector3(), new THREE.Vector3(0, 1, 0)));
      }
    }
    let target = fromFrame.target.clone().lerp(toFrame.target, lerpT);
    const distance = Math.max(1e-8, fromFrame.distance + (toFrame.distance - fromFrame.distance) * lerpT);
    let position = new THREE.Vector3(0, 0, distance).applyQuaternion(rotation).add(target);
    if (mode === "floor" && pivots?.fromPivot && pivots?.toPivot) {
      if (!pivotLocals) {
        const fromPivot = vectorFrom(THREE, pivots.fromPivot, [0, 0, 0]);
        const toPivot = vectorFrom(THREE, pivots.toPivot, [0, 0, 0]);
        const localOffset = (cameraValues, pivot, frameRotation) => vectorFrom(THREE, cameraValues, [0, 0, 0]).sub(pivot).applyQuaternion(frameRotation.clone().invert());
        pivotLocals = {
          fromPivot,
          toPivot,
          fromPosition: localOffset(fromCamera.position, fromPivot, fromFrame.rotation),
          toPosition: localOffset(toCamera.position, toPivot, toFrame.rotation),
          fromTarget: localOffset(fromCamera.target, fromPivot, fromFrame.rotation),
          toTarget: localOffset(toCamera.target, toPivot, toFrame.rotation)
        };
      }
      const pivot = pivotLocals.fromPivot.clone().lerp(pivotLocals.toPivot, lerpT);
      position = pivotLocals.fromPosition.clone().lerp(pivotLocals.toPosition, lerpT).applyQuaternion(rotation).add(pivot);
      target = pivotLocals.fromTarget.clone().lerp(pivotLocals.toTarget, lerpT).applyQuaternion(rotation).add(pivot);
    }
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize();
    const result = {
      ...cloneCameraState(fromCamera),
      ...cloneCameraState(toCamera),
      position: position.toArray(),
      target: target.toArray(),
      up: up.toArray()
    };
    for (const [key, fallback] of [["zoom", 1], ["focalLength", 50], ["frameSize", 10]]) {
      if (key in fromCamera || key in toCamera) {
        const fromValue = finite(fromCamera[key], fallback);
        const toValue = finite(toCamera[key], fallback);
        result[key] = fromValue + (toValue - fromValue) * lerpT;
      }
    }
    return result;
  };
}
export function cameraMotionProgress(elapsed, duration) {
  return duration <= 0 || elapsed >= duration ? 1 : 1 - (1 - clamp(Number.isNaN(elapsed) ? 0 : elapsed / duration, 0, 1)) ** 3;
}
export function createReleasedFocusMotion(THREE, fromCamera, toCamera, {
  immediate = false
} = {}) {
  const duration = immediate ? 0 : 1100;
  const settled = elapsed => duration === 0 || elapsed >= duration;
  const damp = (elapsed, rate) => settled(elapsed) ? 1 : -Math.expm1(-rate * Math.max(0, Number.isNaN(elapsed) ? 0 : elapsed) / 1000) / -Math.expm1(-rate * duration / 1000);
  const progress = {
    settled,
    move: elapsed => damp(elapsed, 5),
    turn: elapsed => damp(elapsed, 4)
  };
  return {
    settled,
    progress: progress.move,
    sample: createFocusCameraSampler(THREE, fromCamera, toCamera, duration, "focus", null, progress)
  };
}
export function createDampedCameraMotion(THREE, fromCamera, toCamera, {
  immediate = false,
  owner = "focus",
  floorFrame = null
} = {}) {
  const isFocus = owner === "focus";
  const moveRate = owner === "floor" ? 8 : isFocus ? 5 : 6;
  const turnRate = owner === "floor" ? 7 : isFocus ? 4 : 5;
  const threshold = owner === "floor" ? 0.0005 : 0.0001;
  const decay = (elapsed, rate) => Math.exp(-rate * Math.max(0, finite(elapsed, 0)) / 1000);
  const settled = elapsed => immediate || decay(elapsed, turnRate) <= threshold;
  const critical = -Math.log(threshold) * 1000 / turnRate - 500;
  const progressFor = (elapsed, rate = moveRate) => {
    if (settled(elapsed)) {
      return 1;
    }
    if (!isFocus || elapsed <= critical) {
      return 1 - decay(elapsed, rate);
    }
    const t = clamp((elapsed - critical) / 500, 0, 1);
    const u = 1 - t;
    const k = rate * 500 / 1000;
    const shaped = u ** 3 * (1 + (3 - k) * t + (6 - 3 * k + 0.5 * k * k) * t * t);
    return 1 - decay(critical, rate) * shaped;
  };
  const progress = {
    settled,
    move: elapsed => progressFor(elapsed),
    turn: elapsed => progressFor(elapsed, turnRate)
  };
  return {
    settled,
    progress: progress.move,
    sample: createFocusCameraSampler(THREE, fromCamera, toCamera, 0, isFocus ? "focus-orbit" : owner, floorFrame, progress)
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
export function automaticAirConditionerCamera(THREE, camera, targetPosition, facing, halfExtents, {
  minimumFrameSize = 3,
  minimumDistance = 3
} = {}) {
  const source = camera || {};
  const focus = vectorFrom(THREE, targetPosition, [0, 0, 0]).clampScalar(-10000, 10000);
  const facingFlat = vectorFrom(THREE, facing, [0, 0, 1]);
  facingFlat.y = 0;
  const horizontal = Math.max(Math.abs(facingFlat.x), Math.abs(facingFlat.z));
  if (horizontal < 1e-8) {
    facingFlat.set(0, 0, 1);
  } else {
    facingFlat.divideScalar(horizontal).normalize();
  }
  const worldUp = new THREE.Vector3(0, 1, 0);
  const lookDirection = facingFlat.clone().addScaledVector(worldUp, 0.38).normalize();
  const right = worldUp.clone().cross(lookDirection).normalize();
  const viewUp = lookDirection.clone().cross(right).normalize();
  const halfSize = vectorFrom(THREE, halfExtents, [0.9, 0.28, 0.22]);
  for (const axis of ["x", "y", "z"]) {
    halfSize[axis] = clamp(Math.abs(halfSize[axis]), 0.01, 10000);
  }
  const extentAlong = direction => Math.abs(direction.x) * halfSize.x + Math.abs(direction.y) * halfSize.y + Math.abs(direction.z) * halfSize.z;
  const aspectRatio = clamp(finite(source.aspect, finite(source.viewportAspect, 1.6)), 0.25, 4);
  const upExtent = extentAlong(viewUp);
  const rightExtent = extentAlong(right);
  const forwardExtent = extentAlong(lookDirection);
  const frameSize = clamp(Math.max(minimumFrameSize, upExtent * 2.1, rightExtent / aspectRatio * 1.8), minimumFrameSize, 20000);
  const perspective = source.mode === "perspective";
  const focalLength = 35;
  const distance = clamp(perspective ? frameSize * Math.max(aspectRatio, 1) + forwardExtent * 0.5 : forwardExtent * 0.5 + 2, minimumDistance, 10000);
  let position = projectAlongRay(THREE, focus, lookDirection.clone(), distance);
  if (position.distanceTo(focus) < minimumDistance - 1e-8) {
    const fallbackDirection = new THREE.Vector3(-Math.sign(focus.x), -Math.sign(focus.y) * 0.38, -Math.sign(focus.z));
    if (Math.abs(fallbackDirection.x) + Math.abs(fallbackDirection.z) < 1e-8) {
      fallbackDirection.z = 1;
    }
    position = projectAlongRay(THREE, focus, fallbackDirection.normalize(), distance);
  }
  return {
    mode: perspective ? "perspective" : "orthographic",
    position: position.toArray(),
    target: focus.toArray(),
    up: worldUp.toArray(),
    zoom: 1,
    frameSize,
    focalLength,
    view: "free",
    topRotation: 0
  };
}
