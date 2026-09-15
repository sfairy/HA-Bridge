const MIN_VECTOR_LENGTH_EPSILON = 1e-8;
const MAX_COORDINATE_MAGNITUDE = 10000;
const clampValue = (clampedValue, minimumValue, maximumValue) =>
  Math.max(minimumValue, Math.min(maximumValue, clampedValue));
const finiteOrFallback = (numericValue, fallbackValue) =>
  Number.isFinite(numericValue) ? numericValue : fallbackValue;
function clonePose(pose) {
  return Object.fromEntries(
    Object.entries(pose).map(([poseKey, poseField]) => [
      poseKey,
      Array.isArray(poseField) ? [...poseField] : poseField
    ])
  );
}
function readVector3(three, sourceArray, fallbackArray) {
  return new three.Vector3(
    ...[0, 1, 2].map(axisIndex =>
      finiteOrFallback(sourceArray?.[axisIndex], fallbackArray[axisIndex])
    )
  );
}
function resolveCameraPose(threeNamespace, poseConfig) {
  const targetVector = readVector3(threeNamespace, poseConfig.target, [0, 0, 0]);
  const offsetVector = readVector3(threeNamespace, poseConfig.position, [0, 3, 6])
    .clone()
    .sub(targetVector);
  const distanceValue = Math.max(offsetVector.length(), 1e-8);
  if (offsetVector.lengthSq() < 1.0000000000000001e-16) {
    offsetVector.set(0, 0, 1);
  }
  offsetVector.normalize();
  const upVector = readVector3(threeNamespace, poseConfig.up, [0, 1, 0]);
  upVector.addScaledVector(offsetVector, -upVector.dot(offsetVector));
  if (upVector.lengthSq() < 1.0000000000000001e-16) {
    upVector.set(
      0,
      Math.abs(offsetVector.y) < 0.9 ? 1 : 0,
      Math.abs(offsetVector.y) < 0.9 ? 0 : -1
    );
    upVector.addScaledVector(offsetVector, -upVector.dot(offsetVector));
  }
  upVector.normalize();
  const rightVector = upVector.clone().cross(offsetVector).normalize();
  upVector.crossVectors(offsetVector, rightVector).normalize();
  const rotationQuaternion = new threeNamespace.Quaternion().setFromRotationMatrix(
    new threeNamespace.Matrix4().makeBasis(rightVector, upVector, offsetVector)
  );
  return {
    target: targetVector,
    distance: distanceValue,
    rotation: rotationQuaternion
  };
}
function readOrbitAngles(threeLib, viewPose, resolvedPose) {
  if (viewPose.view === "top") {
    return null;
  }
  const forwardVector = new threeLib.Vector3(0, 0, 1).applyQuaternion(resolvedPose.rotation);
  if (
    Math.hypot(forwardVector.x, forwardVector.z) < 0.00001 ||
    new threeLib.Quaternion()
      .setFromRotationMatrix(
        new threeLib.Matrix4().lookAt(
          forwardVector,
          new threeLib.Vector3(),
          new threeLib.Vector3(0, 1, 0)
        )
      )
      .angleTo(resolvedPose.rotation) > 0.00001
  ) {
    return null;
  } else {
    return {
      theta: Math.atan2(forwardVector.x, forwardVector.z),
      phi: Math.acos(clampValue(forwardVector.y, -1, 1))
    };
  }
}
export function cameraMotionProgress(progressElapsedMs, progressDurationMs) {
  if (progressDurationMs <= 0 || progressElapsedMs >= progressDurationMs) {
    return 1;
  } else {
    return (
      1 -
      (1 -
        clampValue(
          Number.isNaN(progressElapsedMs) ? 0 : progressElapsedMs / progressDurationMs,
          0,
          1
        )) **
        3
    );
  }
}
const DEFAULT_SETTLE_EPSILON = 0.0001;
const SETTLE_WINDOW_MS = 500;
export function createReleasedFocusMotion(
  threeApi,
  releaseFromPose,
  releaseToPose,
  { immediate: immediate = false } = {}
) {
  const releaseDurationMs = immediate ? 0 : 1100;
  const isSettled = releaseElapsedMs =>
    releaseDurationMs === 0 || releaseElapsedMs >= releaseDurationMs;
  const releaseEase = (releaseTimelineMs, releaseRatePerSecond) =>
    isSettled(releaseTimelineMs)
      ? 1
      : -Math.expm1(
          (-releaseRatePerSecond *
            Math.max(0, Number.isNaN(releaseTimelineMs) ? 0 : releaseTimelineMs)) /
            1000
        ) / -Math.expm1((-releaseRatePerSecond * releaseDurationMs) / 1000);
  const releaseEasing = {
    settled: isSettled,
    move: releaseMoveMs => releaseEase(releaseMoveMs, 5),
    turn: releaseTurnMs => releaseEase(releaseTurnMs, 4)
  };
  return {
    settled: isSettled,
    progress: releaseEasing.move,
    sample: createFocusCameraSampler(
      threeApi,
      releaseFromPose,
      releaseToPose,
      releaseDurationMs,
      "focus",
      null,
      releaseEasing
    )
  };
}
export function createDampedCameraMotion(
  threeCore,
  dampedFromPose,
  dampedToPose,
  {
    immediate: immediateStart = false,
    owner: ownerKind = "focus",
    floorFrame: floorFrame = null
  } = {}
) {
  const isFocusOwner = ownerKind === "focus";
  const moveRatePerSecond = ownerKind === "floor" ? 8 : isFocusOwner ? 5 : 6;
  const turnRatePerSecond = ownerKind === "floor" ? 7 : isFocusOwner ? 4 : 5;
  const settleEpsilon = ownerKind === "floor" ? 0.0005 : DEFAULT_SETTLE_EPSILON;
  const decayFactor = (decayElapsedMs, decayRatePerSecond) =>
    Math.exp((-decayRatePerSecond * Math.max(0, finiteOrFallback(decayElapsedMs, 0))) / 1000);
  const isDampingSettled = dampingElapsedMs =>
    immediateStart || decayFactor(dampingElapsedMs, turnRatePerSecond) <= settleEpsilon;
  const dampingTailMs = (-Math.log(settleEpsilon) * 1000) / turnRatePerSecond - SETTLE_WINDOW_MS;
  const dampedProgress = (dampedElapsedMs, dampedRatePerSecond = moveRatePerSecond) => {
    if (isDampingSettled(dampedElapsedMs)) {
      return 1;
    }
    if (!isFocusOwner || dampedElapsedMs <= dampingTailMs) {
      return 1 - decayFactor(dampedElapsedMs, dampedRatePerSecond);
    }
    const tailRatio = clampValue((dampedElapsedMs - dampingTailMs) / SETTLE_WINDOW_MS, 0, 1);
    const tailRemaining = 1 - tailRatio;
    const rateWindowRatio = (dampedRatePerSecond * SETTLE_WINDOW_MS) / 1000;
    const tailEaseValue =
      tailRemaining ** 3 *
      (1 +
        (3 - rateWindowRatio) * tailRatio +
        (6 - rateWindowRatio * 3 + rateWindowRatio * 0.5 * rateWindowRatio) *
          tailRatio *
          tailRatio);
    return 1 - decayFactor(dampingTailMs, dampedRatePerSecond) * tailEaseValue;
  };
  const dampedEasing = {
    settled: isDampingSettled,
    move: dampedMoveMs => dampedProgress(dampedMoveMs),
    turn: dampedTurnMs => dampedProgress(dampedTurnMs, turnRatePerSecond)
  };
  return {
    settled: isDampingSettled,
    progress: dampedEasing.move,
    sample: createFocusCameraSampler(
      threeCore,
      dampedFromPose,
      dampedToPose,
      0,
      isFocusOwner ? "focus-orbit" : ownerKind,
      floorFrame,
      dampedEasing
    )
  };
}
export function sampleFocusCamera(
  threeRuntime,
  sourcePose,
  destinationPose,
  sampleElapsedMs,
  sampleDurationMs = 1100
) {
  return createFocusCameraSampler(
    threeRuntime,
    sourcePose,
    destinationPose,
    sampleDurationMs
  )(sampleElapsedMs);
}
export function createFocusCameraSampler(
  threeFrame,
  initialPose,
  targetPose,
  motionDurationMs = 1100,
  motionMode = "focus",
  floorFrameData = null,
  easingHooks = null
) {
  initialPose = clonePose(initialPose);
  targetPose = clonePose(targetPose);
  const resolvedDurationMs = Math.max(0, finiteOrFallback(motionDurationMs, 1100));
  let fromPose;
  let toPose;
  let pivotFrame;
  let orbitAngles;
  return function (sampleTimeMs) {
    const sampleElapsed = Number.isNaN(sampleTimeMs) ? 0 : sampleTimeMs;
    if (
      easingHooks
        ? easingHooks.settled(sampleElapsed)
        : resolvedDurationMs === 0 || sampleElapsed >= resolvedDurationMs
    ) {
      return clonePose(targetPose);
    }
    if (!(sampleElapsed > 0)) {
      return clonePose(initialPose);
    }
    fromPose ||= resolveCameraPose(threeFrame, initialPose);
    toPose ||= resolveCameraPose(threeFrame, targetPose);
    const moveProgress = easingHooks
      ? easingHooks.move(sampleElapsed)
      : cameraMotionProgress(sampleElapsed, resolvedDurationMs);
    const turnProgress = easingHooks ? easingHooks.turn(sampleElapsed) : moveProgress;
    const slerpedRotation = fromPose.rotation
      .clone()
      .slerp(toPose.rotation, turnProgress)
      .normalize();
    if (motionMode === "focus-orbit") {
      if (orbitAngles === undefined) {
        const fromOrbitAngles = readOrbitAngles(threeFrame, initialPose, fromPose);
        const toOrbitAngles = readOrbitAngles(threeFrame, targetPose, toPose);
        orbitAngles =
          fromOrbitAngles && toOrbitAngles
            ? {
                start: fromOrbitAngles,
                end: toOrbitAngles,
                deltaTheta: Math.atan2(
                  Math.sin(toOrbitAngles.theta - fromOrbitAngles.theta),
                  Math.cos(toOrbitAngles.theta - fromOrbitAngles.theta)
                )
              }
            : null;
      }
      if (orbitAngles) {
        const {
          start: startOrbitAngles,
          end: endOrbitAngles,
          deltaTheta: orbitDeltaTheta
        } = orbitAngles;
        const orbitDirection = new threeFrame.Vector3().setFromSphericalCoords(
          1,
          startOrbitAngles.phi + (endOrbitAngles.phi - startOrbitAngles.phi) * turnProgress,
          startOrbitAngles.theta + orbitDeltaTheta * turnProgress
        );
        slerpedRotation.setFromRotationMatrix(
          new threeFrame.Matrix4().lookAt(
            orbitDirection,
            new threeFrame.Vector3(),
            new threeFrame.Vector3(0, 1, 0)
          )
        );
      }
    }
    let interpolatedTarget = fromPose.target.clone().lerp(toPose.target, moveProgress);
    const interpolatedDistance = Math.max(
      1e-8,
      fromPose.distance + (toPose.distance - fromPose.distance) * moveProgress
    );
    let interpolatedPosition = new threeFrame.Vector3(0, 0, interpolatedDistance)
      .applyQuaternion(slerpedRotation)
      .add(interpolatedTarget);
    if (motionMode === "floor" && floorFrameData?.fromPivot && floorFrameData?.toPivot) {
      if (!pivotFrame) {
        const fromPivotVector = readVector3(threeFrame, floorFrameData.fromPivot, [0, 0, 0]);
        const toPivotVector = readVector3(threeFrame, floorFrameData.toPivot, [0, 0, 0]);
        const toPivotLocalPoint = (worldPoint, pivotPoint, pivotRotation) =>
          readVector3(threeFrame, worldPoint, [0, 0, 0])
            .sub(pivotPoint)
            .applyQuaternion(pivotRotation.clone().invert());
        pivotFrame = {
          fromPivot: fromPivotVector,
          toPivot: toPivotVector,
          fromPosition: toPivotLocalPoint(initialPose.position, fromPivotVector, fromPose.rotation),
          toPosition: toPivotLocalPoint(targetPose.position, toPivotVector, toPose.rotation),
          fromTarget: toPivotLocalPoint(initialPose.target, fromPivotVector, fromPose.rotation),
          toTarget: toPivotLocalPoint(targetPose.target, toPivotVector, toPose.rotation)
        };
      }
      const pivotVector = pivotFrame.fromPivot.clone().lerp(pivotFrame.toPivot, moveProgress);
      interpolatedPosition = pivotFrame.fromPosition
        .clone()
        .lerp(pivotFrame.toPosition, moveProgress)
        .applyQuaternion(slerpedRotation)
        .add(pivotVector);
      interpolatedTarget = pivotFrame.fromTarget
        .clone()
        .lerp(pivotFrame.toTarget, moveProgress)
        .applyQuaternion(slerpedRotation)
        .add(pivotVector);
    }
    const animatedUpVector = new threeFrame.Vector3(0, 1, 0)
      .applyQuaternion(slerpedRotation)
      .normalize();
    const sampledPose = {
      ...clonePose(initialPose),
      ...clonePose(targetPose),
      position: interpolatedPosition.toArray(),
      target: interpolatedTarget.toArray(),
      up: animatedUpVector.toArray()
    };
    for (const [poseKeyName, poseKeyDefault] of [
      ["zoom", 1],
      ["focalLength", 50],
      ["frameSize", 10]
    ]) {
      if (poseKeyName in initialPose || poseKeyName in targetPose) {
        const fromKeyValue = finiteOrFallback(initialPose[poseKeyName], poseKeyDefault);
        const toKeyValue = finiteOrFallback(targetPose[poseKeyName], poseKeyDefault);
        sampledPose[poseKeyName] = fromKeyValue + (toKeyValue - fromKeyValue) * moveProgress;
      }
    }
    return sampledPose;
  };
}
function clipRayToBounds(threeModule, rayOrigin, rayDirection, maxTravelDistance) {
  let travelDistance = maxTravelDistance;
  for (const axisName of ["x", "y", "z"]) {
    if (Math.abs(rayDirection[axisName]) > 1e-8) {
      const axisLimit = Math.sign(rayDirection[axisName]) * 10000;
      travelDistance = Math.min(
        travelDistance,
        Math.max(0, (axisLimit - rayOrigin[axisName]) / rayDirection[axisName])
      );
    }
  }
  if (travelDistance < 1e-8) {
    rayDirection.copy(rayOrigin).negate();
    if (rayDirection.lengthSq() < 1e-8) {
      rayDirection.set(0, 0, 1);
    }
    rayDirection.normalize();
    return clipRayToBounds(
      threeModule,
      rayOrigin,
      rayDirection,
      Math.min(maxTravelDistance, 10000)
    );
  } else {
    return rayOrigin.clone().addScaledVector(rayDirection, travelDistance);
  }
}
export function automaticLightCamera(threeToolkit, lightConfig, lightTarget) {
  const lightOptions = lightConfig || {};
  const { distance: lightDistance, rotation: lightRotation } = resolveCameraPose(
    threeToolkit,
    lightOptions
  );
  const lightTargetPoint = readVector3(threeToolkit, lightTarget, [0, 0, 0]).clampScalar(
    -10000,
    10000
  );
  const isPerspectiveMode = lightOptions.mode === "perspective";
  const lightForwardDirection = new threeToolkit.Vector3(0, 0, 1)
    .applyQuaternion(lightRotation)
    .normalize();
  const lightRayLength = isPerspectiveMode
    ? Math.max(3, lightDistance * 0.5)
    : Math.max(3, lightDistance);
  const lightPositionPoint = clipRayToBounds(
    threeToolkit,
    lightTargetPoint,
    lightForwardDirection,
    lightRayLength
  );
  const lightViewDirection = lightPositionPoint.clone().sub(lightTargetPoint).normalize();
  const lightUpCandidate = readVector3(threeToolkit, lightOptions.up, [0, 1, 0]);
  const lightUpLength = lightUpCandidate.length();
  const hasUsableUp =
    lightUpLength > 1e-8 &&
    lightUpCandidate.clone().divideScalar(lightUpLength).cross(lightViewDirection).lengthSq() >
      1.0000000000000001e-16;
  const lightUpVector = hasUsableUp
    ? lightUpCandidate
    : new threeToolkit.Vector3(0, 1, 0).applyQuaternion(lightRotation).normalize();
  const lightCameraPose = {
    mode: isPerspectiveMode ? "perspective" : "orthographic",
    position: lightPositionPoint.toArray(),
    target: lightTargetPoint.toArray(),
    up: lightUpVector.toArray(),
    zoom: clampValue(
      finiteOrFallback(lightOptions.zoom, 1) * (isPerspectiveMode ? 1 : 2.2),
      0.01,
      100
    ),
    frameSize: clampValue(finiteOrFallback(lightOptions.frameSize, 10), 0.001, 20000),
    focalLength: clampValue(finiteOrFallback(lightOptions.focalLength, 50), 18, 120),
    view: lightOptions.view === "top" ? "top" : "free",
    topRotation: clampValue(finiteOrFallback(lightOptions.topRotation, 0), 0, 360)
  };
  if (!hasUsableUp) {
    const correctedLightPose = resolveCameraPose(threeToolkit, lightCameraPose);
    lightCameraPose.up = new threeToolkit.Vector3(0, 1, 0)
      .applyQuaternion(correctedLightPose.rotation)
      .normalize()
      .toArray();
  }
  return lightCameraPose;
}
export function automaticAirConditionerCamera(
  threeContext,
  conditionerConfig,
  conditionerTarget,
  conditionerDirection,
  conditionerFrameWeight,
  { minimumFrameSize: minimumFrameSize = 3, minimumDistance: minimumDistance = 3 } = {}
) {
  const conditionerOptions = conditionerConfig || {};
  const conditionerTargetPoint = readVector3(
    threeContext,
    conditionerTarget,
    [0, 0, 0]
  ).clampScalar(-10000, 10000);
  const flatDirection = readVector3(threeContext, conditionerDirection, [0, 0, 1]);
  flatDirection.y = 0;
  const directionMagnitude = Math.max(Math.abs(flatDirection.x), Math.abs(flatDirection.z));
  if (directionMagnitude < 1e-8) {
    flatDirection.set(0, 0, 1);
  } else {
    flatDirection.divideScalar(directionMagnitude).normalize();
  }
  const unitUpVector = new threeContext.Vector3(0, 1, 0);
  const elevatedDirection = flatDirection.clone().addScaledVector(unitUpVector, 0.38).normalize();
  const lateralDirection = unitUpVector.clone().cross(elevatedDirection).normalize();
  const verticalDirection = elevatedDirection.clone().cross(lateralDirection).normalize();
  const frameWeightVector = readVector3(threeContext, conditionerFrameWeight, [0.9, 0.28, 0.22]);
  for (const weightAxisName of ["x", "y", "z"]) {
    frameWeightVector[weightAxisName] = clampValue(
      Math.abs(frameWeightVector[weightAxisName]),
      0.01,
      10000
    );
  }
  const weightedExtent = extentDirection =>
    Math.abs(extentDirection.x) * frameWeightVector.x +
    Math.abs(extentDirection.y) * frameWeightVector.y +
    Math.abs(extentDirection.z) * frameWeightVector.z;
  const viewportAspect = clampValue(
    finiteOrFallback(
      conditionerOptions.aspect,
      finiteOrFallback(conditionerOptions.viewportAspect, 1.6)
    ),
    0.25,
    4
  );
  const verticalExtent = weightedExtent(verticalDirection);
  const lateralExtent = weightedExtent(lateralDirection);
  const forwardExtent = weightedExtent(elevatedDirection);
  const frameSizeValue = clampValue(
    Math.max(minimumFrameSize, verticalExtent * 2.1, (lateralExtent / viewportAspect) * 1.8),
    minimumFrameSize,
    20000
  );
  const usesPerspective = conditionerOptions.mode === "perspective";
  const focalLengthMm = 35;
  const cameraDistance = clampValue(
    usesPerspective
      ? frameSizeValue * Math.max(viewportAspect, 1) + forwardExtent * 0.5
      : forwardExtent * 0.5 + 2,
    minimumDistance,
    10000
  );
  let conditionerPosition = clipRayToBounds(
    threeContext,
    conditionerTargetPoint,
    elevatedDirection.clone(),
    cameraDistance
  );
  if (conditionerPosition.distanceTo(conditionerTargetPoint) < minimumDistance - 1e-8) {
    const fallbackDirection = new threeContext.Vector3(
      -Math.sign(conditionerTargetPoint.x),
      -Math.sign(conditionerTargetPoint.y) * 0.38,
      -Math.sign(conditionerTargetPoint.z)
    );
    if (Math.abs(fallbackDirection.x) + Math.abs(fallbackDirection.z) < 1e-8) {
      fallbackDirection.z = 1;
    }
    conditionerPosition = clipRayToBounds(
      threeContext,
      conditionerTargetPoint,
      fallbackDirection.normalize(),
      cameraDistance
    );
  }
  return {
    mode: usesPerspective ? "perspective" : "orthographic",
    position: conditionerPosition.toArray(),
    target: conditionerTargetPoint.toArray(),
    up: unitUpVector.toArray(),
    zoom: 1,
    frameSize: frameSizeValue,
    focalLength: focalLengthMm,
    view: "free",
    topRotation: 0
  };
}
