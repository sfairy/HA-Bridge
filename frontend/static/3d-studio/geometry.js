const EPSILON = 1e-7;
export function clamp(value, lowerBound, upperBound) {
  return Math.min(upperBound, Math.max(lowerBound, value));
}
export function spotLightBrightnessResponse(lightType = "downlight", brightnessInput = 0) {
  const brightnessRatio = clamp(Number(brightnessInput) || 0, 0, 1);
  const baseResponse = brightnessRatio * brightnessRatio;
  if (lightType !== "ceilinglight" || brightnessRatio <= 0 || brightnessRatio >= 0.35) {
    return baseResponse;
  }
  const downlightBoost = brightnessRatio * 0.08 * (1 - brightnessRatio / 0.35);
  return baseResponse + downlightBoost;
}
export function stripLightProjection(elevationInput = 2.7, rangeInput = 3.5, lengthInput = 2) {
  const elevationMeters = clamp(
    Number.isFinite(Number(elevationInput)) ? Number(elevationInput) : 2.7,
    0.05,
    6
  );
  const rangeMeters = clamp(
    Number.isFinite(Number(rangeInput)) ? Number(rangeInput) : 3.5,
    0.5,
    10
  );
  const lengthMeters = clamp(
    Number.isFinite(Number(lengthInput)) ? Number(lengthInput) : 2,
    0.2,
    8
  );
  const elevationRatio = clamp(elevationMeters / 2.7, 0.2, 2.2);
  const lengthRatio = clamp(lengthMeters / 2, 0.1, 4);
  return {
    elevation: elevationMeters,
    range:
      rangeMeters *
      clamp(0.5 + elevationRatio * 0.5, 0.6, 1.6) *
      clamp(0.82 + lengthRatio * 0.18, 0.75, 1.5),
    coreScale: clamp(0.55 + elevationRatio * 0.45, 0.65, 1.55),
    intensity: clamp(1 / elevationRatio, 0.5, 2.2)
  };
}
export function adaptiveLightRenderCost(lights = []) {
  return lights.reduce(
    (totalCost, light) =>
      light?.enabled === false || Math.max(0, Number(light?.brightness) || 0) <= 0
        ? totalCost
        : light?.type === "striplight"
          ? totalCost + 0.3
          : light?.type === "ceilinglight"
            ? totalCost + (Number(light?.angle) >= 140 ? 1.65 : 1.1)
            : light?.type === "downlight"
              ? totalCost + 1
              : totalCost,
    0
  );
}
export function adaptiveDeviceLightBudget({
  hardwareConcurrency: hardwareConcurrency = 4,
  deviceMemory: deviceMemory = 8,
  previewPixels: previewPixels = 500000
} = {}) {
  const coreCount = clamp(Number(hardwareConcurrency) || 4, 2, 24);
  const memoryGb = clamp(Number(deviceMemory) || 8, 2, 32);
  const previewPixelCount = clamp(Number(previewPixels) || 500000, 120000, 4000000);
  const baseBudget = 4.5 + Math.min(coreCount, 16) * 0.55;
  const memoryFactor = memoryGb <= 4 ? 0.78 : memoryGb < 8 ? 0.88 : memoryGb >= 16 ? 1.1 : 1;
  const pixelFactor = clamp(Math.sqrt(500000 / previewPixelCount), 0.72, 1.2);
  return clamp(baseBudget * memoryFactor * pixelFactor, 4, 16);
}
export function assessAdaptiveRenderFrames(frameTimes = []) {
  const validFrameTimesMs = frameTimes
    .map(Number)
    .filter(frameTime => Number.isFinite(frameTime) && frameTime >= 8 && frameTime <= 120);
  if (validFrameTimesMs.length < 12) {
    return {
      sufficient: false,
      sampleCount: validFrameTimesMs.length
    };
  }
  const sortedFrameTimesMs = [...validFrameTimesMs].sort(
    (frameTimeLeft, frameTimeRight) => frameTimeLeft - frameTimeRight
  );
  const frameTimeAtPercentile = percentile =>
    sortedFrameTimesMs[
      Math.min(
        Math.floor((sortedFrameTimesMs.length - 1) * percentile),
        sortedFrameTimesMs.length - 1
      )
    ];
  const averageFrameMs =
    validFrameTimesMs.reduce((sum, frameTimeSample) => sum + frameTimeSample, 0) /
    validFrameTimesMs.length;
  const p75FrameMs = frameTimeAtPercentile(0.75);
  const p90FrameMs = frameTimeAtPercentile(0.9);
  return {
    sufficient: true,
    sampleCount: validFrameTimesMs.length,
    averageFrameMs: averageFrameMs,
    p75FrameMs: p75FrameMs,
    p90FrameMs: p90FrameMs,
    fps: 1000 / averageFrameMs,
    severe: averageFrameMs >= 45 || p75FrameMs >= 50 || p90FrameMs >= 68,
    slow: averageFrameMs >= 34 || p75FrameMs >= 38 || p90FrameMs >= 55,
    smooth: averageFrameMs <= 24 && p90FrameMs <= 32
  };
}
export function planLabelProjectionMetrics(widthPx, heightPx, baselineScaleInput = 0.86) {
  const safeWidthPx = Math.max(0, Number(widthPx) || 0);
  const safeHeightPx = Math.max(0, Number(heightPx) || 0);
  const baselineScaleRatio = clamp(
    Number.isFinite(Number(baselineScaleInput)) ? Number(baselineScaleInput) : 0.86,
    0.3,
    1
  );
  return {
    titleStartX: -safeWidthPx * (0.5 - 115 / 2048),
    titleY: safeHeightPx * (130 / 640 - 0.5),
    titleFontSize: (safeHeightPx * 184) / 640,
    titleMaxWidth: (safeWidthPx * 1340) / 2048,
    iconX: safeWidthPx * (1580 / 2048 - 0.5),
    iconY: safeHeightPx * (130 / 640 - 0.5),
    iconSize: (safeHeightPx * 170) / 640,
    subtitleStartX: -safeWidthPx * (0.5 - 72 / 2048),
    subtitleY: safeHeightPx * (410 / 640 - 0.5),
    subtitleFontSize: (safeHeightPx * 310) / 640,
    subtitleMaxWidth: (safeWidthPx * 1880) / 2048,
    baselineY: safeHeightPx * (590 / 640 - 0.5),
    baselineStartX: -safeWidthPx * (0.5 - 74 / 2048),
    baselineLength: ((safeWidthPx * 1880) / 2048) * baselineScaleRatio,
    baselineLineWidth: (safeHeightPx * 16) / 640,
    baselineCapHalfHeight: (safeHeightPx * 24) / 640
  };
}
export function selectShadowCastingLightIds(lightList = [], maxCount = 8) {
  const lightLimit = Math.max(0, Math.floor(Number(maxCount) || 0));
  if (lightLimit === 0) {
    return [];
  }
  const scoredLights = lightList
    .map((lightRecord, lightIndex) => ({
      id: String(lightRecord?.id || ""),
      groupId: String(lightRecord?.groupId || ""),
      type: String(lightRecord?.type || ""),
      brightness: Math.max(0, Number(lightRecord?.brightness) || 0),
      enabled: lightRecord?.enabled !== false,
      index: lightIndex
    }))
    .filter(
      candidate =>
        candidate.id &&
        candidate.enabled &&
        candidate.brightness > 0 &&
        candidate.type !== "striplight"
    )
    .map(scoredCandidate => ({
      ...scoredCandidate,
      score: scoredCandidate.brightness * (scoredCandidate.type === "ceilinglight" ? 1.08 : 1)
    }));
  if (scoredLights.length <= lightLimit) {
    return scoredLights.map(rankedLight => rankedLight.id);
  }
  const compareLightsByScore = (leftLight, rightLight) =>
    rightLight.score - leftLight.score || leftLight.index - rightLight.index;
  const bestCandidateByGroupId = new Map();
  for (const groupCandidate of scoredLights) {
    const groupId = groupCandidate.groupId || "__ungrouped-" + groupCandidate.index;
    const currentBest = bestCandidateByGroupId.get(groupId);
    if (!currentBest || compareLightsByScore(groupCandidate, currentBest) < 0) {
      bestCandidateByGroupId.set(groupId, groupCandidate);
    }
  }
  const selectedLights = [...bestCandidateByGroupId.values()]
    .sort(compareLightsByScore)
    .slice(0, lightLimit);
  if (selectedLights.length < lightLimit) {
    const selectedIdSet = new Set(selectedLights.map(selectedLight => selectedLight.id));
    const remainingLights = scoredLights
      .filter(remainingLight => !selectedIdSet.has(remainingLight.id))
      .sort(compareLightsByScore);
    selectedLights.push(...remainingLights.slice(0, lightLimit - selectedLights.length));
  }
  return selectedLights.map(finalLight => finalLight.id);
}
export function spotShadowTextureUnitLimit({
  maxTextureUnits: maxTextureUnits = 16,
  materialTextureUnits: materialTextureUnits = 0,
  nonSpotShadowTextureUnits: nonSpotShadowTextureUnits = 1,
  rectAreaLightTextureUnits: rectAreaLightTextureUnits = 0,
  reservedTextureUnits: reservedTextureUnits = 1,
  hardLimit: hardLimit = 8
} = {}) {
  const unitCapacity = Math.max(0, Math.floor(Number(maxTextureUnits) || 0));
  const unitsInUse = [
    materialTextureUnits,
    nonSpotShadowTextureUnits,
    rectAreaLightTextureUnits,
    reservedTextureUnits
  ].reduce((unitSum, unitGroup) => unitSum + Math.max(0, Math.floor(Number(unitGroup) || 0)), 0);
  const hardLimitUnits = Math.max(0, Math.floor(Number(hardLimit) || 0));
  const adaptiveLimitUnits = unitCapacity <= 16 ? 3 : unitCapacity <= 24 ? 6 : hardLimitUnits;
  return Math.min(hardLimitUnits, adaptiveLimitUnits, Math.max(0, unitCapacity - unitsInUse));
}
export function localSpotShadowSettings(
  shadowLightType = "downlight",
  shadowRangeInput = 3.5,
  angleInput = 90
) {
  const shadowRangeMeters = clamp(
    Number.isFinite(Number(shadowRangeInput)) ? Number(shadowRangeInput) : 3.5,
    0.5,
    10
  );
  const angleDeg = clamp(Number.isFinite(Number(angleInput)) ? Number(angleInput) : 90, 15, 180);
  const isWideCeilingLight = shadowLightType === "ceilinglight" && angleDeg >= 140;
  return {
    mapSize: isWideCeilingLight ? 512 : 256,
    radius: isWideCeilingLight ? 1.25 : 1,
    blurSamples: isWideCeilingLight ? 8 : 4,
    normalBias: 0.018,
    wideCeilingLight: isWideCeilingLight,
    range: shadowRangeMeters,
    angle: angleDeg
  };
}
export function distance(firstPoint, secondPoint) {
  return Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
}
export function slidingDoorPanelCenters(panelWidth, handleSide = -1, openRatio = 2 / 3) {
  const fixedOffset = (handleSide >= 0 ? 1 : -1) * panelWidth * 0.23;
  const movingBaseOffset = -fixedOffset;
  return {
    fixed: fixedOffset,
    moving: movingBaseOffset + (fixedOffset - movingBaseOffset) * clamp(openRatio, 0, 1)
  };
}
export function projectPointToSegment(point, segmentStart, segmentEnd) {
  const segmentDirX = segmentEnd.x - segmentStart.x;
  const segmentDirY = segmentEnd.y - segmentStart.y;
  const segmentLengthSquared = segmentDirX * segmentDirX + segmentDirY * segmentDirY;
  if (segmentLengthSquared <= 1e-7) {
    return {
      point: {
        ...segmentStart
      },
      t: 0,
      distance: distance(point, segmentStart)
    };
  }
  const projectionT = clamp(
    ((point.x - segmentStart.x) * segmentDirX + (point.y - segmentStart.y) * segmentDirY) /
      segmentLengthSquared,
    0,
    1
  );
  const closestPoint = {
    x: segmentStart.x + segmentDirX * projectionT,
    y: segmentStart.y + segmentDirY * projectionT
  };
  return {
    point: closestPoint,
    t: projectionT,
    distance: distance(point, closestPoint)
  };
}
export function segmentIntersection(firstStart, firstEnd, secondStart, secondEnd) {
  const firstDirX = firstEnd.x - firstStart.x;
  const firstDirY = firstEnd.y - firstStart.y;
  const secondDirX = secondEnd.x - secondStart.x;
  const secondDirY = secondEnd.y - secondStart.y;
  const crossDenominator = firstDirX * secondDirY - firstDirY * secondDirX;
  if (Math.abs(crossDenominator) <= 1e-7) {
    return null;
  }
  const startDeltaX = secondStart.x - firstStart.x;
  const startDeltaY = secondStart.y - firstStart.y;
  const firstT = (startDeltaX * secondDirY - startDeltaY * secondDirX) / crossDenominator;
  const secondT = (startDeltaX * firstDirY - startDeltaY * firstDirX) / crossDenominator;
  if (firstT < -1e-7 || firstT > 1.0000001 || secondT < -1e-7 || secondT > 1.0000001) {
    return null;
  } else {
    return {
      x: firstStart.x + firstDirX * clamp(firstT, 0, 1),
      y: firstStart.y + firstDirY * clamp(firstT, 0, 1)
    };
  }
}
export function wallIntersections(wallList) {
  const intersectionPoints = [];
  for (let wallIndex = 0; wallIndex < wallList.length; wallIndex += 1) {
    for (
      let otherWallIndex = wallIndex + 1;
      otherWallIndex < wallList.length;
      otherWallIndex += 1
    ) {
      const intersection = segmentIntersection(
        wallList[wallIndex].start,
        wallList[wallIndex].end,
        wallList[otherWallIndex].start,
        wallList[otherWallIndex].end
      );
      if (
        !!intersection &&
        !intersectionPoints.some(existingPoint => distance(existingPoint, intersection) <= 1e-7)
      ) {
        intersectionPoints.push(intersection);
      }
    }
  }
  return intersectionPoints;
}
export function splitWallSegments(inputWalls, minGap = 0.000001) {
  const gapTolerance = Math.max(Number(minGap) || 0, 1e-7);
  const cutTsByWall = inputWalls.map(() => [0, 1]);
  for (let splitWallIndex = 0; splitWallIndex < inputWalls.length; splitWallIndex += 1) {
    for (
      let splitOtherWallIndex = splitWallIndex + 1;
      splitOtherWallIndex < inputWalls.length;
      splitOtherWallIndex += 1
    ) {
      const wall = inputWalls[splitWallIndex];
      const otherWall = inputWalls[splitOtherWallIndex];
      const wallIntersection = segmentIntersection(
        wall.start,
        wall.end,
        otherWall.start,
        otherWall.end
      );
      if (!wallIntersection) {
        continue;
      }
      const selfProjection = projectPointToSegment(wallIntersection, wall.start, wall.end);
      const otherProjection = projectPointToSegment(
        wallIntersection,
        otherWall.start,
        otherWall.end
      );
      if (selfProjection.t > gapTolerance && selfProjection.t < 1 - gapTolerance) {
        cutTsByWall[splitWallIndex].push(selfProjection.t);
      }
      if (otherProjection.t > gapTolerance && otherProjection.t < 1 - gapTolerance) {
        cutTsByWall[splitOtherWallIndex].push(otherProjection.t);
      }
    }
  }
  const pieces = [];
  inputWalls.forEach((sourceWall, sourceWallIndex) => {
    const sourceDirX = sourceWall.end.x - sourceWall.start.x;
    const sourceDirY = sourceWall.end.y - sourceWall.start.y;
    const sortedCutTs = [...cutTsByWall[sourceWallIndex]]
      .sort((cutTLeft, cutTRight) => cutTLeft - cutTRight)
      .filter(
        (currentT, currentIndex, tsList) =>
          currentIndex === 0 || currentT - tsList[currentIndex - 1] > gapTolerance
      );
    for (let pieceIndex = 0; pieceIndex < sortedCutTs.length - 1; pieceIndex += 1) {
      const pieceStartT = sortedCutTs[pieceIndex];
      const pieceEndT = sortedCutTs[pieceIndex + 1];
      if (!(pieceEndT - pieceStartT <= gapTolerance)) {
        pieces.push({
          sourceWall: sourceWall,
          sourceIndex: sourceWallIndex,
          pieceIndex: pieceIndex,
          pieceCount: sortedCutTs.length - 1,
          startT: pieceStartT,
          endT: pieceEndT,
          start: {
            x: sourceWall.start.x + sourceDirX * pieceStartT,
            y: sourceWall.start.y + sourceDirY * pieceStartT
          },
          end: {
            x: sourceWall.start.x + sourceDirX * pieceEndT,
            y: sourceWall.start.y + sourceDirY * pieceEndT
          }
        });
      }
    }
  });
  return pieces;
}
export function uncoveredCollinearWallSegments(referenceWall, otherWalls, minLength = 0.001) {
  if (!referenceWall?.start || !referenceWall?.end) {
    return [];
  }
  const lengthTolerance = Math.max(Number(minLength) || 0, 1e-7);
  const dirX = referenceWall.end.x - referenceWall.start.x;
  const dirY = referenceWall.end.y - referenceWall.start.y;
  const wallLength = Math.hypot(dirX, dirY);
  if (wallLength <= lengthTolerance) {
    return [];
  }
  const unitDirection = {
    x: dirX / wallLength,
    y: dirY / wallLength
  };
  const normalizedTolerance = lengthTolerance / wallLength;
  const coveredRanges = [];
  for (const overlappingWall of otherWalls || []) {
    if (
      !overlappingWall?.start ||
      !overlappingWall?.end ||
      overlappingWall.id === referenceWall.id
    ) {
      continue;
    }
    const otherDirX = overlappingWall.end.x - overlappingWall.start.x;
    const otherDirY = overlappingWall.end.y - overlappingWall.start.y;
    const otherLength = Math.hypot(otherDirX, otherDirY);
    if (
      otherLength <= lengthTolerance ||
      Math.abs(
        (unitDirection.x * otherDirY) / otherLength - (unitDirection.y * otherDirX) / otherLength
      ) > normalizedTolerance
    ) {
      continue;
    }
    const startOffsetVector = {
      x: overlappingWall.start.x - referenceWall.start.x,
      y: overlappingWall.start.y - referenceWall.start.y
    };
    const endOffsetVector = {
      x: overlappingWall.end.x - referenceWall.start.x,
      y: overlappingWall.end.y - referenceWall.start.y
    };
    const startOffset = Math.abs(
      startOffsetVector.x * unitDirection.y - startOffsetVector.y * unitDirection.x
    );
    const endOffset = Math.abs(
      endOffsetVector.x * unitDirection.y - endOffsetVector.y * unitDirection.x
    );
    if (Math.max(startOffset, endOffset) > lengthTolerance) {
      continue;
    }
    const startProjection =
      (startOffsetVector.x * unitDirection.x + startOffsetVector.y * unitDirection.y) / wallLength;
    const endProjection =
      (endOffsetVector.x * unitDirection.x + endOffsetVector.y * unitDirection.y) / wallLength;
    const rangeStart = clamp(Math.min(startProjection, endProjection), 0, 1);
    const rangeEnd = clamp(Math.max(startProjection, endProjection), 0, 1);
    if (rangeEnd - rangeStart > normalizedTolerance) {
      coveredRanges.push([rangeStart, rangeEnd]);
    }
  }
  if (!coveredRanges.length) {
    return [
      {
        start: {
          ...referenceWall.start
        },
        end: {
          ...referenceWall.end
        }
      }
    ];
  }
  coveredRanges.sort((rangeLeft, rangeRight) => rangeLeft[0] - rangeRight[0]);
  const mergedRanges = [];
  for (const range of coveredRanges) {
    const lastRange = mergedRanges.at(-1);
    if (lastRange && range[0] <= lastRange[1] + normalizedTolerance) {
      lastRange[1] = Math.max(lastRange[1], range[1]);
    } else {
      mergedRanges.push([...range]);
    }
  }
  const gapRanges = [];
  let cursor = 0;
  for (const [mergedRangeStart, mergedRangeEnd] of mergedRanges) {
    if (mergedRangeStart - cursor > normalizedTolerance) {
      gapRanges.push([cursor, mergedRangeStart]);
    }
    cursor = Math.max(cursor, mergedRangeEnd);
  }
  if (1 - cursor > normalizedTolerance) {
    gapRanges.push([cursor, 1]);
  }
  return gapRanges.map(([startT, endT]) => ({
    start: {
      x: referenceWall.start.x + dirX * startT,
      y: referenceWall.start.y + dirY * startT
    },
    end: {
      x: referenceWall.start.x + dirX * endT,
      y: referenceWall.start.y + dirY * endT
    }
  }));
}
export function canonicalPolygonKey(points, precision = 5) {
  if (!Array.isArray(points) || !points.length) {
    return "";
  }
  const decimals = clamp(Math.round(Number(precision) || 0), 0, 12);
  const coordinateKeys = points.map(polygonPoint => {
    const roundedX =
      Math.abs(Number(polygonPoint?.x) || 0) < 10 ** -decimals / 2
        ? 0
        : Number(polygonPoint?.x) || 0;
    const roundedY =
      Math.abs(Number(polygonPoint?.y) || 0) < 10 ** -decimals / 2
        ? 0
        : Number(polygonPoint?.y) || 0;
    return roundedX.toFixed(decimals) + "," + roundedY.toFixed(decimals);
  });
  const rotationKeys = [];
  for (const sequence of [coordinateKeys, [...coordinateKeys].reverse()]) {
    for (let offsetIndex = 0; offsetIndex < sequence.length; offsetIndex += 1) {
      rotationKeys.push(
        [...sequence.slice(offsetIndex), ...sequence.slice(0, offsetIndex)].join(";")
      );
    }
  }
  return rotationKeys.sort()[0];
}
function matchWallEndpoints(wallA, wallB, endpointTolerance) {
  const matchingPairs = [
    {
      firstKey: "start",
      secondKey: "start"
    },
    {
      firstKey: "start",
      secondKey: "end"
    },
    {
      firstKey: "end",
      secondKey: "start"
    },
    {
      firstKey: "end",
      secondKey: "end"
    }
  ].filter(
    ({ firstKey: wallAEndpointKey, secondKey: wallBEndpointKey }) =>
      distance(wallA[wallAEndpointKey], wallB[wallBEndpointKey]) <= endpointTolerance
  );
  if (matchingPairs.length !== 1) {
    return null;
  }
  const matchedPair = matchingPairs[0];
  return {
    point: {
      x: (wallA[matchedPair.firstKey].x + wallB[matchedPair.secondKey].x) / 2,
      y: (wallA[matchedPair.firstKey].y + wallB[matchedPair.secondKey].y) / 2
    },
    firstKey: matchedPair.firstKey,
    secondKey: matchedPair.secondKey,
    firstOuter: wallA[matchedPair.firstKey === "start" ? "end" : "start"],
    secondOuter: wallB[matchedPair.secondKey === "start" ? "end" : "start"]
  };
}
function canMergeWalls(firstWall, secondWall, compatibilityTolerance) {
  const firstOpacity =
    firstWall.opacity === null || firstWall.opacity === undefined
      ? null
      : Number(firstWall.opacity);
  const secondOpacity =
    secondWall.opacity === null || secondWall.opacity === undefined
      ? null
      : Number(secondWall.opacity);
  const isOpacityCompatible =
    firstOpacity === null || secondOpacity === null
      ? firstOpacity === secondOpacity
      : Math.abs(firstOpacity - secondOpacity) <= compatibilityTolerance;
  return (
    Math.abs((Number(firstWall.height) || 0) - (Number(secondWall.height) || 0)) <=
      compatibilityTolerance &&
    Math.abs((Number(firstWall.thickness) || 0) - (Number(secondWall.thickness) || 0)) <=
      compatibilityTolerance &&
    isOpacityCompatible &&
    (firstWall.allowOpenEnd === true) == (secondWall.allowOpenEnd === true)
  );
}
function countEndpointsNearPoint(incidentWallEntries, probePoint, proximityTolerance) {
  return incidentWallEntries.reduce(
    (count, nearbyWall) =>
      count +
      (distance(nearbyWall.wall.start, probePoint) <= proximityTolerance ? 1 : 0) +
      (distance(nearbyWall.wall.end, probePoint) <= proximityTolerance ? 1 : 0),
    0
  );
}
function isHairpinJoin(endpointMatch, hairpinTolerance) {
  const firstOuterVector = subtractPoints(endpointMatch.firstOuter, endpointMatch.point);
  const secondOuterVector = subtractPoints(endpointMatch.secondOuter, endpointMatch.point);
  const firstOuterLength = Math.hypot(firstOuterVector.x, firstOuterVector.y);
  const secondOuterLength = Math.hypot(secondOuterVector.x, secondOuterVector.y);
  if (firstOuterLength <= hairpinTolerance || secondOuterLength <= hairpinTolerance) {
    return false;
  }
  const crossMagnitude = Math.abs(crossProduct(firstOuterVector, secondOuterVector));
  return (
    firstOuterVector.x * secondOuterVector.x + firstOuterVector.y * secondOuterVector.y < 0 &&
    crossMagnitude <= hairpinTolerance * Math.max(firstOuterLength, secondOuterLength, 1)
  );
}
export function mergeCollinearWallSegments(sourceWalls, mergeDistanceTolerance = 0.000001) {
  const mergeTolerance = Math.max(Number(mergeDistanceTolerance) || 0, 1e-7);
  const workList = (sourceWalls || [])
    .filter(
      rawWall =>
        rawWall?.start && rawWall?.end && distance(rawWall.start, rawWall.end) > mergeTolerance
    )
    .map(clonedWall => ({
      wall: {
        ...clonedWall,
        start: {
          ...clonedWall.start
        },
        end: {
          ...clonedWall.end
        }
      },
      sourceIds: new Set([clonedWall.id])
    }));
  let didMerge = true;
  while (didMerge) {
    didMerge = false;
    for (let leftIndex = 0; leftIndex < workList.length && !didMerge; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < workList.length; rightIndex += 1) {
        const leftEntry = workList[leftIndex];
        const rightEntry = workList[rightIndex];
        if (!canMergeWalls(leftEntry.wall, rightEntry.wall, mergeTolerance)) {
          continue;
        }
        const mergeMatch = matchWallEndpoints(leftEntry.wall, rightEntry.wall, mergeTolerance);
        if (
          !mergeMatch ||
          countEndpointsNearPoint(workList, mergeMatch.point, mergeTolerance) !== 2 ||
          !isHairpinJoin(mergeMatch, mergeTolerance)
        ) {
          continue;
        }
        const mergedWall = {
          ...leftEntry.wall,
          start:
            mergeMatch.firstKey === "end"
              ? {
                  ...mergeMatch.firstOuter
                }
              : {
                  ...mergeMatch.secondOuter
                },
          end:
            mergeMatch.firstKey === "end"
              ? {
                  ...mergeMatch.secondOuter
                }
              : {
                  ...mergeMatch.firstOuter
                }
        };
        workList[leftIndex] = {
          wall: mergedWall,
          sourceIds: new Set([...leftEntry.sourceIds, ...rightEntry.sourceIds])
        };
        workList.splice(rightIndex, 1);
        didMerge = true;
        break;
      }
    }
  }
  const wallIdBySourceId = new Map();
  for (const mergedEntry of workList) {
    for (const sourceId of mergedEntry.sourceIds) {
      wallIdBySourceId.set(sourceId, mergedEntry.wall.id);
    }
  }
  return {
    walls: workList.map(resultEntry => resultEntry.wall),
    wallIdMap: wallIdBySourceId
  };
}
export function remapWallAttachment(attachment, fromWall, destinationWall) {
  if (!attachment || !fromWall || !destinationWall) {
    return attachment;
  }
  const attachmentT = clamp(Number(attachment.t) || 0, 0, 1);
  const pointOnSourceWall = lerpPoint(fromWall.start, fromWall.end, attachmentT);
  return {
    ...attachment,
    wallId: destinationWall.id,
    t: clamp(
      projectPointToSegment(pointOnSourceWall, destinationWall.start, destinationWall.end).t,
      0,
      1
    )
  };
}
function findNearestCandidate(queryPoint, candidates, maxDistance) {
  let bestCandidate = null;
  for (const snapCandidate of candidates) {
    const candidateDistance = distance(queryPoint, snapCandidate.point);
    if (
      !(candidateDistance > maxDistance) &&
      (!bestCandidate || !(candidateDistance >= bestCandidate.distance))
    ) {
      bestCandidate = {
        ...snapCandidate,
        distance: candidateDistance
      };
    }
  }
  return bestCandidate;
}
export function axisLockedPoint(freePoint, lockedAnchor) {
  const deltaX = freePoint.x - lockedAnchor.x;
  const deltaY = freePoint.y - lockedAnchor.y;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return {
      point: {
        x: freePoint.x,
        y: lockedAnchor.y
      },
      axis: "horizontal",
      label: "水平轴"
    };
  } else {
    return {
      point: {
        x: lockedAnchor.x,
        y: freePoint.y
      },
      axis: "vertical",
      label: "垂直轴"
    };
  }
}
function findAxisSnapOnWalls(snapQueryPoint, snapAnchor, targetWalls, snapDistanceLimit, axis) {
  let bestSnap = null;
  for (const snapWall of targetWalls) {
    const axisKey = axis === "vertical" ? "x" : "y";
    const crossAxisKey = axis === "vertical" ? "y" : "x";
    const wallDelta = snapWall.end[axisKey] - snapWall.start[axisKey];
    if (Math.abs(wallDelta) <= 1e-7) {
      if (Math.abs(snapWall.start[axisKey] - snapAnchor[axisKey]) > 1e-7) {
        continue;
      }
      const snapProjection = projectPointToSegment(snapQueryPoint, snapWall.start, snapWall.end);
      if (
        snapProjection.distance > snapDistanceLimit ||
        (bestSnap && snapProjection.distance >= bestSnap.distance)
      ) {
        continue;
      }
      bestSnap = {
        point: {
          ...snapProjection.point,
          [axisKey]: snapAnchor[axisKey]
        },
        kind: "segment",
        targetId: snapWall.id,
        label: (axis === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: snapProjection.distance
      };
      continue;
    }
    const wallT = (snapAnchor[axisKey] - snapWall.start[axisKey]) / wallDelta;
    if (wallT < -1e-7 || wallT > 1.0000001) {
      continue;
    }
    const lockedPoint = {
      ...snapAnchor
    };
    lockedPoint[crossAxisKey] =
      snapWall.start[crossAxisKey] +
      (snapWall.end[crossAxisKey] - snapWall.start[crossAxisKey]) * clamp(wallT, 0, 1);
    const lockedDistance = distance(snapQueryPoint, lockedPoint);
    if (
      !(lockedDistance > snapDistanceLimit) &&
      (!bestSnap || !(lockedDistance >= bestSnap.distance))
    ) {
      bestSnap = {
        point: lockedPoint,
        kind: "segment",
        targetId: snapWall.id,
        label: (axis === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: lockedDistance
      };
    }
  }
  return bestSnap;
}
function findVerticalAxisSnap(pointInput, verticalAnchor, wallSegments, verticalSnapDistance) {
  if (!verticalAnchor || Math.abs(pointInput.x - verticalAnchor.x) > verticalSnapDistance) {
    return null;
  }
  const verticalSnap = findAxisSnapOnWalls(
    pointInput,
    verticalAnchor,
    wallSegments,
    verticalSnapDistance,
    "vertical"
  );
  return (
    verticalSnap || {
      point: {
        x: verticalAnchor.x,
        y: pointInput.y
      },
      kind: "axis",
      label: "垂直轴",
      distance: Math.abs(pointInput.x - verticalAnchor.x)
    }
  );
}
function findOrthogonalAxisSnap(
  cursorPoint,
  orthogonalAnchor,
  wallGeometry,
  orthogonalSnapDistance,
  knownIntersections = wallIntersections(wallGeometry),
  options = {}
) {
  const axisLock = axisLockedPoint(cursorPoint, orthogonalAnchor);
  const lockAxisKey = axisLock.axis === "vertical" ? "x" : "y";
  const coordinateTolerance = Math.max(1e-7, orthogonalSnapDistance * 0.000001);
  const axisLabel = axisLock.axis === "vertical" ? "垂直" : "水平";
  const orthoCandidates = [
    ...(options.snapEndpoints === false
      ? []
      : wallGeometry.flatMap(endpointCandidateWall => [
          {
            point: endpointCandidateWall.start,
            kind: "endpoint",
            targetId: endpointCandidateWall.id,
            label: axisLabel + " · 端点"
          },
          {
            point: endpointCandidateWall.end,
            kind: "endpoint",
            targetId: endpointCandidateWall.id,
            label: axisLabel + " · 端点"
          }
        ])),
    ...(options.snapIntersections === false
      ? []
      : knownIntersections.map(intersectionPoint => ({
          point: intersectionPoint,
          kind: "intersection",
          label: axisLabel + " · 交点"
        })))
  ].filter(
    orthoCandidate =>
      Math.abs(orthoCandidate.point[lockAxisKey] - orthogonalAnchor[lockAxisKey]) <=
      coordinateTolerance
  );
  const endpointSnap = findNearestCandidate(cursorPoint, orthoCandidates, orthogonalSnapDistance);
  if (endpointSnap) {
    return endpointSnap;
  }
  if (options.snapSegments !== false) {
    const orthogonalSnap = findAxisSnapOnWalls(
      cursorPoint,
      orthogonalAnchor,
      wallGeometry,
      orthogonalSnapDistance,
      axisLock.axis
    );
    if (orthogonalSnap) {
      return orthogonalSnap;
    }
  }
  return {
    ...axisLock,
    kind: "axis",
    distance: distance(cursorPoint, axisLock.point)
  };
}
export function snapPoint(pointToSnap, wallShapes, snapOptions = {}) {
  const zoomScale = Math.max(Number(snapOptions.zoom) || 1, 1e-7);
  const worldTolerance = (Number(snapOptions.screenTolerance) || 12) / zoomScale;
  const intersections = Array.isArray(snapOptions.intersections) ? snapOptions.intersections : null;
  if (snapOptions.forceOrthogonalAxis === true && snapOptions.anchor) {
    const orthogonalIntersections =
      snapOptions.snapIntersections === false ? [] : intersections || wallIntersections(wallShapes);
    return findOrthogonalAxisSnap(
      pointToSnap,
      snapOptions.anchor,
      wallShapes,
      worldTolerance,
      orthogonalIntersections,
      snapOptions
    );
  }
  const endpointCandidates = [];
  if (snapOptions.snapEndpoints !== false) {
    for (const endpointSourceWall of wallShapes) {
      endpointCandidates.push(
        {
          point: endpointSourceWall.start,
          kind: "endpoint",
          targetId: endpointSourceWall.id,
          label: "端点"
        },
        {
          point: endpointSourceWall.end,
          kind: "endpoint",
          targetId: endpointSourceWall.id,
          label: "端点"
        }
      );
    }
  }
  const endpointSnapResult = findNearestCandidate(pointToSnap, endpointCandidates, worldTolerance);
  if (endpointSnapResult) {
    return endpointSnapResult;
  }
  if (snapOptions.snapIntersections !== false) {
    const intersectionSnap = findNearestCandidate(
      pointToSnap,
      (intersections || wallIntersections(wallShapes)).map(snapIntersection => ({
        point: snapIntersection,
        kind: "intersection",
        label: "交点"
      })),
      worldTolerance
    );
    if (intersectionSnap) {
      return intersectionSnap;
    }
  }
  if (
    snapOptions.preferVerticalAxis === true &&
    snapOptions.snapOrthogonal !== false &&
    snapOptions.anchor
  ) {
    const verticalAxisSnap = findVerticalAxisSnap(
      pointToSnap,
      snapOptions.anchor,
      wallShapes,
      worldTolerance
    );
    if (verticalAxisSnap) {
      return verticalAxisSnap;
    }
  }
  if (snapOptions.snapSegments !== false) {
    const segmentSnap = wallShapes
      .map(segmentWall => {
        const segmentProjection = projectPointToSegment(
          pointToSnap,
          segmentWall.start,
          segmentWall.end
        );
        return {
          point: segmentProjection.point,
          kind: "segment",
          targetId: segmentWall.id,
          label: "墙线",
          distance: segmentProjection.distance
        };
      })
      .filter(segmentCandidate => segmentCandidate.distance <= worldTolerance)
      .sort(
        (leftSegCandidate, rightSegCandidate) =>
          leftSegCandidate.distance - rightSegCandidate.distance
      )[0];
    if (segmentSnap) {
      return segmentSnap;
    }
  }
  if (snapOptions.snapAngles !== false && snapOptions.anchor) {
    const anchorDeltaX = pointToSnap.x - snapOptions.anchor.x;
    const anchorDeltaY = pointToSnap.y - snapOptions.anchor.y;
    const anchorDistance = Math.hypot(anchorDeltaX, anchorDeltaY);
    if (anchorDistance > 1e-7) {
      const angleStepRad = ((Number(snapOptions.angleStepDegrees) || 15) * Math.PI) / 180;
      const pointerAngleRad = Math.atan2(anchorDeltaY, anchorDeltaX);
      const snappedAngleRad = Math.round(pointerAngleRad / angleStepRad) * angleStepRad;
      const angleSnapPoint = {
        x: snapOptions.anchor.x + Math.cos(snappedAngleRad) * anchorDistance,
        y: snapOptions.anchor.y + Math.sin(snappedAngleRad) * anchorDistance
      };
      const angleSnapDistance = distance(pointToSnap, angleSnapPoint);
      if (angleSnapDistance <= worldTolerance) {
        const snappedAngleDeg = ((snappedAngleRad * 180) / Math.PI + 360) % 360;
        return {
          point: angleSnapPoint,
          kind: "angle",
          label: Math.round(snappedAngleDeg) + "°",
          distance: angleSnapDistance
        };
      }
    }
  }
  const gridSize = Number(snapOptions.gridSize) || 0;
  if (snapOptions.snapGrid !== false && gridSize > 1e-7) {
    const gridPoint = {
      x: Math.round(pointToSnap.x / gridSize) * gridSize,
      y: Math.round(pointToSnap.y / gridSize) * gridSize
    };
    const gridSnapDistance = distance(pointToSnap, gridPoint);
    if (gridSnapDistance <= worldTolerance) {
      return {
        point: gridPoint,
        kind: "grid",
        label: "网格",
        distance: gridSnapDistance
      };
    }
  }
  return {
    point: {
      ...pointToSnap
    },
    kind: null,
    label: "",
    distance: 0
  };
}
export function nearestWall(referencePoint, wallCandidates, maxWallDistance = Infinity) {
  let nearestHit = null;
  for (const hitWall of wallCandidates) {
    const wallProjection = projectPointToSegment(referencePoint, hitWall.start, hitWall.end);
    if (
      !(wallProjection.distance > maxWallDistance) &&
      (!nearestHit || !(wallProjection.distance >= nearestHit.distance))
    ) {
      nearestHit = {
        wall: hitWall,
        ...wallProjection
      };
    }
  }
  return nearestHit;
}
export function wallLengthMeters(measuredWall, pixelsPerMeter) {
  return (
    distance(measuredWall.start, measuredWall.end) / Math.max(Number(pixelsPerMeter) || 1, 1e-7)
  );
}
export function clampWindowT(openingWall, windowOpening, pixelsPerMeterReference) {
  const openingWallLength = wallLengthMeters(openingWall, pixelsPerMeterReference);
  if (openingWallLength <= 1e-7) {
    return 0.5;
  }
  const halfWidth = Math.min(
    Math.max(Number(windowOpening.width) || 0, 0) / 2,
    openingWallLength / 2
  );
  return clamp(
    Number(windowOpening.t) || 0,
    halfWidth / openingWallLength,
    1 - halfWidth / openingWallLength
  );
}
export function doorLeafRotation(door, maxAngleRad = Math.PI / 2) {
  return -(door?.swing === -1 ? -1 : 1) * maxAngleRad;
}
export function wallJoinExtensions(wallEntries, junctionTolerance = 0.001, maxExtensionRatio = 4) {
  const joinTolerance = Math.max(Number(junctionTolerance) || 0, 1e-7);
  const extensionRatioLimit = Math.max(Number(maxExtensionRatio) || 0, 1);
  const extensionsByWallId = Object.fromEntries(
    (wallEntries || []).map(wallEntry => [
      wallEntry.id,
      {
        start: 0,
        end: 0
      }
    ])
  );
  const junctions = [];
  const getJunction = endpointPoint => {
    let junction = junctions.find(
      matchingJunction => distance(matchingJunction.point, endpointPoint) <= joinTolerance
    );
    if (!junction) {
      junction = {
        point: {
          ...endpointPoint
        },
        incidents: []
      };
      junctions.push(junction);
    }
    return junction;
  };
  for (const extendedWallEntry of wallEntries || []) {
    const wallDirX = extendedWallEntry.end.x - extendedWallEntry.start.x;
    const wallDirY = extendedWallEntry.end.y - extendedWallEntry.start.y;
    const wallSpanLength = Math.hypot(wallDirX, wallDirY);
    if (wallSpanLength <= joinTolerance) {
      continue;
    }
    const halfThickness = Math.max(Number(extendedWallEntry.thickness) || 0, 0) / 2;
    getJunction(extendedWallEntry.start).incidents.push({
      wallId: extendedWallEntry.id,
      endpoint: "start",
      x: wallDirX / wallSpanLength,
      y: wallDirY / wallSpanLength,
      halfThickness: halfThickness
    });
    getJunction(extendedWallEntry.end).incidents.push({
      wallId: extendedWallEntry.id,
      endpoint: "end",
      x: -wallDirX / wallSpanLength,
      y: -wallDirY / wallSpanLength,
      halfThickness: halfThickness
    });
  }
  const SIN_TOLERANCE = 0.0001;
  for (const incidentJunction of junctions) {
    if (incidentJunction.incidents.length < 2) {
      continue;
    }
    const sortedIncidents = incidentJunction.incidents
      .map(incident => ({
        ...incident,
        angle: Math.atan2(incident.y, incident.x)
      }))
      .sort((incidentLeft, incidentRight) => incidentLeft.angle - incidentRight.angle);
    for (let incidentIndex = 0; incidentIndex < sortedIncidents.length; incidentIndex += 1) {
      const currentIncident = sortedIncidents[incidentIndex];
      const nextIncident = sortedIncidents[(incidentIndex + 1) % sortedIncidents.length];
      const gapAngleRad =
        (nextIncident.angle - currentIncident.angle + Math.PI * 2) % (Math.PI * 2);
      if (gapAngleRad <= SIN_TOLERANCE || gapAngleRad >= Math.PI - SIN_TOLERANCE) {
        continue;
      }
      const sinGap = Math.sin(gapAngleRad);
      const cosGap = Math.cos(gapAngleRad);
      if (sinGap <= SIN_TOLERANCE) {
        continue;
      }
      const maxExtension =
        Math.max(currentIncident.halfThickness, nextIncident.halfThickness, 0.000001) *
        extensionRatioLimit;
      const incidentExtension = clamp(
        (nextIncident.halfThickness + currentIncident.halfThickness * cosGap) / sinGap,
        0,
        maxExtension
      );
      const nextExtension = clamp(
        (currentIncident.halfThickness + nextIncident.halfThickness * cosGap) / sinGap,
        0,
        maxExtension
      );
      extensionsByWallId[currentIncident.wallId][currentIncident.endpoint] = Math.max(
        extensionsByWallId[currentIncident.wallId][currentIncident.endpoint],
        incidentExtension
      );
      extensionsByWallId[nextIncident.wallId][nextIncident.endpoint] = Math.max(
        extensionsByWallId[nextIncident.wallId][nextIncident.endpoint],
        nextExtension
      );
    }
  }
  return extensionsByWallId;
}
export function wallSolidPieces(targetWall, openings, pixelsPerMeterScale, wallHeightMeters) {
  const wallLengthValue = wallLengthMeters(targetWall, pixelsPerMeterScale);
  const wallHeight = Math.max(Number(wallHeightMeters) || 0, 0);
  if (wallLengthValue <= 1e-7 || wallHeight <= 1e-7) {
    return [];
  }
  const openingSpans = openings
    .filter(opening => opening.wallId === targetWall.id)
    .map(mappedOpening => {
      const openingWidth = clamp(Number(mappedOpening.width) || 0, 0, wallLengthValue);
      const openingCenter =
        clampWindowT(targetWall, mappedOpening, pixelsPerMeterScale) * wallLengthValue;
      const openingSill = clamp(Number(mappedOpening.sill) || 0, 0, wallHeight);
      const openingTop = clamp(
        openingSill + Math.max(Number(mappedOpening.height) || 0, 0),
        openingSill,
        wallHeight
      );
      return {
        start: clamp(openingCenter - openingWidth / 2, 0, wallLengthValue),
        end: clamp(openingCenter + openingWidth / 2, 0, wallLengthValue),
        bottom: openingSill,
        top: openingTop
      };
    })
    .filter(
      openingSpan =>
        openingSpan.end - openingSpan.start > 1e-7 && openingSpan.top - openingSpan.bottom > 1e-7
    );
  const boundaries = [
    ...new Set([
      0,
      wallLengthValue,
      ...openingSpans.flatMap(boundarySpan => [boundarySpan.start, boundarySpan.end])
    ])
  ].sort((boundaryLeft, boundaryRight) => boundaryLeft - boundaryRight);
  const solidPieces = [];
  for (let boundaryIndex = 0; boundaryIndex < boundaries.length - 1; boundaryIndex += 1) {
    const spanStart = boundaries[boundaryIndex];
    const spanEnd = boundaries[boundaryIndex + 1];
    if (spanEnd - spanStart <= 1e-7) {
      continue;
    }
    const spanMidpoint = (spanStart + spanEnd) / 2;
    const overlappingSpans = openingSpans
      .filter(
        overlapSpan =>
          spanMidpoint > overlapSpan.start - 1e-7 && spanMidpoint < overlapSpan.end + 1e-7
      )
      .map(mappedOverlap => [mappedOverlap.bottom, mappedOverlap.top])
      .sort((spanLeft, spanRight) => spanLeft[0] - spanRight[0]);
    if (!overlappingSpans.length) {
      solidPieces.push({
        start: spanStart,
        end: spanEnd,
        bottom: 0,
        top: wallHeight
      });
      continue;
    }
    const mergedVerticalSpans = [];
    for (const verticalSpan of overlappingSpans) {
      const lastVerticalSpan = mergedVerticalSpans.at(-1);
      if (lastVerticalSpan && verticalSpan[0] <= lastVerticalSpan[1] + 1e-7) {
        lastVerticalSpan[1] = Math.max(lastVerticalSpan[1], verticalSpan[1]);
      } else {
        mergedVerticalSpans.push([...verticalSpan]);
      }
    }
    let verticalCursor = 0;
    for (const [verticalSpanStart, verticalSpanEnd] of mergedVerticalSpans) {
      if (verticalSpanStart - verticalCursor > 1e-7) {
        solidPieces.push({
          start: spanStart,
          end: spanEnd,
          bottom: verticalCursor,
          top: verticalSpanStart
        });
      }
      verticalCursor = Math.max(verticalCursor, verticalSpanEnd);
    }
    if (wallHeight - verticalCursor > 1e-7) {
      solidPieces.push({
        start: spanStart,
        end: spanEnd,
        bottom: verticalCursor,
        top: wallHeight
      });
    }
  }
  return solidPieces;
}
export function pointInRotatedRectangle(worldPoint, rect, scale) {
  const inverseRotationRad = (-(Number(rect.rotation) || 0) * Math.PI) / 180;
  const localDeltaX = worldPoint.x - rect.x;
  const localDeltaY = worldPoint.y - rect.y;
  const alignedX =
    localDeltaX * Math.cos(inverseRotationRad) - localDeltaY * Math.sin(inverseRotationRad);
  const alignedY =
    localDeltaX * Math.sin(inverseRotationRad) + localDeltaY * Math.cos(inverseRotationRad);
  const halfBoxWidth = (Math.max(Number(rect.width) || 0, 0) * scale) / 2;
  const halfBoxDepth = (Math.max(Number(rect.depth) || 0, 0) * scale) / 2;
  return Math.abs(alignedX) <= halfBoxWidth && Math.abs(alignedY) <= halfBoxDepth;
}
export function resizeRotatedItemFromCorner(
  item,
  cornerSign,
  anchorPoint,
  pointerPoint,
  cornerPixelsPerMeter,
  isUniformScale = false,
  resizeOptions = {}
) {
  const pixelScale = Math.max(Number(cornerPixelsPerMeter) || 0, 1e-7);
  const signX = cornerSign?.x < 0 ? -1 : 1;
  const signY = cornerSign?.y < 0 ? -1 : 1;
  const itemInverseRotationRad = (-(Number(item.rotation) || 0) * Math.PI) / 180;
  const pointerDeltaX = pointerPoint.x - anchorPoint.x;
  const pointerDeltaY = pointerPoint.y - anchorPoint.y;
  const rotatedDeltaX =
    pointerDeltaX * Math.cos(itemInverseRotationRad) -
    pointerDeltaY * Math.sin(itemInverseRotationRad);
  const rotatedDeltaY =
    pointerDeltaX * Math.sin(itemInverseRotationRad) +
    pointerDeltaY * Math.cos(itemInverseRotationRad);
  const deltaWidthMeters = (signX * rotatedDeltaX) / pixelScale;
  const deltaDepthMeters = (signY * rotatedDeltaY) / pixelScale;
  const minDimension = Math.max(Number(resizeOptions.minimumDimension) || 0.1, 1e-7);
  const itemWidth = Math.max(Number(item.width) || minDimension, minDimension);
  const itemDepth = Math.max(Number(item.depth) || minDimension, minDimension);
  const itemHeight = Number(item.height);
  let newWidth = clamp(deltaWidthMeters, minDimension, 8);
  let newDepth = clamp(deltaDepthMeters, minDimension, 8);
  let uniformScale = 1;
  if (isUniformScale) {
    const minScale = Math.max(Number(resizeOptions.minimum) || 0, 1e-7);
    const maxScale = Math.max(Number(resizeOptions.maximum) || Number.POSITIVE_INFINITY, minScale);
    uniformScale = clamp(
      Math.max(deltaWidthMeters / itemWidth, deltaDepthMeters / itemDepth),
      minScale,
      maxScale
    );
    newWidth = itemWidth * uniformScale;
    newDepth = itemDepth * uniformScale;
  }
  const offsetX = (signX * newWidth * pixelScale) / 2;
  const offsetY = (signY * newDepth * pixelScale) / 2;
  const rotationRad = ((Number(item.rotation) || 0) * Math.PI) / 180;
  const resizedItem = {
    x: anchorPoint.x + offsetX * Math.cos(rotationRad) - offsetY * Math.sin(rotationRad),
    y: anchorPoint.y + offsetX * Math.sin(rotationRad) + offsetY * Math.cos(rotationRad),
    width: newWidth,
    depth: newDepth
  };
  if (Number.isFinite(itemHeight) && itemHeight > 0) {
    resizedItem.height = isUniformScale ? itemHeight * uniformScale : itemHeight;
  }
  return resizedItem;
}
export function itemRotationFromPointers(
  baseRotationDeg,
  pivotPoint,
  firstPointer,
  secondPointer,
  angleStepDeg = 0
) {
  const firstAngleRad = Math.atan2(firstPointer.y - pivotPoint.y, firstPointer.x - pivotPoint.x);
  const secondAngleRad = Math.atan2(secondPointer.y - pivotPoint.y, secondPointer.x - pivotPoint.x);
  let rotationDeg =
    (Number(baseRotationDeg) || 0) + ((secondAngleRad - firstAngleRad) * 180) / Math.PI;
  const stepDeg = Math.max(Number(angleStepDeg) || 0, 0);
  if (stepDeg > 0) {
    rotationDeg = Math.round(rotationDeg / stepDeg) * stepDeg;
  }
  return ((rotationDeg % 360) + 360) % 360;
}
export function polygonArea(polygon) {
  let doubleArea = 0;
  for (let vertexIndex = 0; vertexIndex < polygon.length; vertexIndex += 1) {
    const vertex = polygon[vertexIndex];
    const nextVertex = polygon[(vertexIndex + 1) % polygon.length];
    doubleArea += vertex.x * nextVertex.y - nextVertex.x * vertex.y;
  }
  return doubleArea / 2;
}
export function pointInPolygon(testPoint, polygonOutline, edgeTolerance = 1e-7) {
  if (!Array.isArray(polygonOutline) || polygonOutline.length < 3) {
    return false;
  }
  const polygonEdgeTolerance = Math.max(Number(edgeTolerance) || 0, 1e-7);
  let isInside = false;
  for (let polygonEdgeIndex = 0; polygonEdgeIndex < polygonOutline.length; polygonEdgeIndex += 1) {
    const edgeStartVertex = polygonOutline[polygonEdgeIndex];
    const edgeEndVertex = polygonOutline[(polygonEdgeIndex + 1) % polygonOutline.length];
    if (
      projectPointToSegment(testPoint, edgeStartVertex, edgeEndVertex).distance <=
      polygonEdgeTolerance
    ) {
      return true;
    }
    if (edgeStartVertex.y > testPoint.y == edgeEndVertex.y > testPoint.y) {
      continue;
    }
    if (
      edgeStartVertex.x +
        ((testPoint.y - edgeStartVertex.y) * (edgeEndVertex.x - edgeStartVertex.x)) /
          (edgeEndVertex.y - edgeStartVertex.y) >
      testPoint.x
    ) {
      isInside = !isInside;
    }
  }
  return isInside;
}
function crossProduct(vectorA, vectorB) {
  return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
}
function subtractPoints(pointA, pointB) {
  return {
    x: pointA.x - pointB.x,
    y: pointA.y - pointB.y
  };
}
function lerpPoint(startPoint, endPoint, factor) {
  return {
    x: startPoint.x + (endPoint.x - startPoint.x) * factor,
    y: startPoint.y + (endPoint.y - startPoint.y) * factor
  };
}
function pushCutT(cutLists, edgeIndex, cutT, cutTolerance) {
  if (!(cutT < -cutTolerance) && !(cutT > 1 + cutTolerance)) {
    cutLists[edgeIndex].push(clamp(cutT, 0, 1));
  }
}
function simplifyPolygon(polygonPoints, simplifyTolerance) {
  const simplifiedPoints = polygonPoints.filter(
    (dedupePoint, pointIndex) =>
      pointIndex === 0 || distance(dedupePoint, polygonPoints[pointIndex - 1]) > simplifyTolerance
  );
  if (
    simplifiedPoints.length > 1 &&
    distance(simplifiedPoints[0], simplifiedPoints.at(-1)) <= simplifyTolerance
  ) {
    simplifiedPoints.pop();
  }
  if (simplifiedPoints.length < 3) {
    return [];
  }
  let didChange = true;
  while (didChange && simplifiedPoints.length >= 3) {
    didChange = false;
    for (let simplifyIndex = 0; simplifyIndex < simplifiedPoints.length; simplifyIndex += 1) {
      const previousPoint =
        simplifiedPoints[(simplifyIndex - 1 + simplifiedPoints.length) % simplifiedPoints.length];
      const currentPoint = simplifiedPoints[simplifyIndex];
      const nextPoint = simplifiedPoints[(simplifyIndex + 1) % simplifiedPoints.length];
      const incomingVector = subtractPoints(currentPoint, previousPoint);
      const outgoingVector = subtractPoints(nextPoint, currentPoint);
      const lengthProduct = Math.max(
        Math.hypot(incomingVector.x, incomingVector.y) *
          Math.hypot(outgoingVector.x, outgoingVector.y),
        1
      );
      if (
        !(
          Math.abs(crossProduct(incomingVector, outgoingVector)) >
          simplifyTolerance * lengthProduct
        )
      ) {
        simplifiedPoints.splice(simplifyIndex, 1);
        didChange = true;
        break;
      }
    }
  }
  return simplifiedPoints;
}
export function subtractPolygonLoops(baseLoops, holeLoops, loopTolerance = 0.000001) {
  return unionPolygonLoops(baseLoops, loopTolerance, holeLoops);
}
export function unionPolygonLoops(loops, loopMergeTolerance = 0.000001, holesToSubtract = []) {
  const epsilon = Math.max(Number(loopMergeTolerance) || 0, 1e-7);
  const normalizedLoops = (loops || [])
    .filter(rawLoop => Array.isArray(rawLoop) && rawLoop.length >= 3)
    .map(loopPoints =>
      loopPoints.map(rawPoint => ({
        x: Number(rawPoint.x) || 0,
        y: Number(rawPoint.y) || 0
      }))
    )
    .filter(cleanedLoop => Math.abs(polygonArea(cleanedLoop)) > epsilon * epsilon);
  if (!normalizedLoops.length) {
    return [];
  }
  const normalizedHoles = holesToSubtract.filter(
    rawHole =>
      Array.isArray(rawHole) &&
      rawHole.length >= 3 &&
      rawHole.every(holePoint => Number.isFinite(holePoint.x) && Number.isFinite(holePoint.y)) &&
      Math.abs(polygonArea(rawHole)) > epsilon * epsilon
  );
  const sourceEdges = [];
  for (const sourceLoop of [...normalizedLoops, ...normalizedHoles]) {
    for (let loopVertexIndex = 0; loopVertexIndex < sourceLoop.length; loopVertexIndex += 1) {
      const edgeStart = sourceLoop[loopVertexIndex];
      const edgeEnd = sourceLoop[(loopVertexIndex + 1) % sourceLoop.length];
      if (distance(edgeStart, edgeEnd) > epsilon) {
        sourceEdges.push({
          start: edgeStart,
          end: edgeEnd
        });
      }
    }
  }
  const edgeCutTs = sourceEdges.map(() => [0, 1]);
  for (let firstEdgeIndex = 0; firstEdgeIndex < sourceEdges.length; firstEdgeIndex += 1) {
    const firstEdge = sourceEdges[firstEdgeIndex];
    const firstEdgeVector = subtractPoints(firstEdge.end, firstEdge.start);
    const firstEdgeLengthSquared =
      firstEdgeVector.x * firstEdgeVector.x + firstEdgeVector.y * firstEdgeVector.y;
    for (
      let secondEdgeIndex = firstEdgeIndex + 1;
      secondEdgeIndex < sourceEdges.length;
      secondEdgeIndex += 1
    ) {
      const secondEdge = sourceEdges[secondEdgeIndex];
      const secondEdgeVector = subtractPoints(secondEdge.end, secondEdge.start);
      const secondEdgeLengthSquared =
        secondEdgeVector.x * secondEdgeVector.x + secondEdgeVector.y * secondEdgeVector.y;
      const originOffset = subtractPoints(secondEdge.start, firstEdge.start);
      const edgeCross = crossProduct(firstEdgeVector, secondEdgeVector);
      const crossTolerance =
        epsilon * Math.max(Math.sqrt(firstEdgeLengthSquared * secondEdgeLengthSquared), 1);
      if (Math.abs(edgeCross) > crossTolerance) {
        const intersectionTFirst = crossProduct(originOffset, secondEdgeVector) / edgeCross;
        const intersectionTSecond = crossProduct(originOffset, firstEdgeVector) / edgeCross;
        if (
          intersectionTFirst < -epsilon ||
          intersectionTFirst > 1 + epsilon ||
          intersectionTSecond < -epsilon ||
          intersectionTSecond > 1 + epsilon
        ) {
          continue;
        }
        pushCutT(edgeCutTs, firstEdgeIndex, intersectionTFirst, epsilon);
        pushCutT(edgeCutTs, secondEdgeIndex, intersectionTSecond, epsilon);
        continue;
      }
      if (
        Math.abs(crossProduct(originOffset, firstEdgeVector)) >
        epsilon * Math.max(Math.sqrt(firstEdgeLengthSquared), 1)
      ) {
        continue;
      }
      const projectedStartT =
        (originOffset.x * firstEdgeVector.x + originOffset.y * firstEdgeVector.y) /
        firstEdgeLengthSquared;
      const secondEndOffset = subtractPoints(secondEdge.end, firstEdge.start);
      const projectedSecondEndT =
        (secondEndOffset.x * firstEdgeVector.x + secondEndOffset.y * firstEdgeVector.y) /
        firstEdgeLengthSquared;
      pushCutT(edgeCutTs, firstEdgeIndex, projectedStartT, epsilon);
      pushCutT(edgeCutTs, firstEdgeIndex, projectedSecondEndT, epsilon);
      const secondStartOffset = subtractPoints(firstEdge.start, secondEdge.start);
      const projectedSecondStartT =
        (secondStartOffset.x * secondEdgeVector.x + secondStartOffset.y * secondEdgeVector.y) /
        secondEdgeLengthSquared;
      const firstEndOffset = subtractPoints(firstEdge.end, secondEdge.start);
      const projectedFirstEndT =
        (firstEndOffset.x * secondEdgeVector.x + firstEndOffset.y * secondEdgeVector.y) /
        secondEdgeLengthSquared;
      pushCutT(edgeCutTs, secondEdgeIndex, projectedSecondStartT, epsilon);
      pushCutT(edgeCutTs, secondEdgeIndex, projectedFirstEndT, epsilon);
    }
  }
  const isInteriorPoint = samplePoint =>
    normalizedLoops.some(loop => pointInPolygon(samplePoint, loop, epsilon)) &&
    !normalizedHoles.some(hole => pointInPolygon(samplePoint, hole, epsilon));
  const snapStep = epsilon * 8;
  const snappedPointByKey = new Map();
  const snapSamplePoint = snapInputPoint => {
    const snappedX = Math.round(snapInputPoint.x / snapStep) * snapStep;
    const snappedY = Math.round(snapInputPoint.y / snapStep) * snapStep;
    const snapKey = Math.round(snappedX / snapStep) + "," + Math.round(snappedY / snapStep);
    if (!snappedPointByKey.has(snapKey)) {
      snappedPointByKey.set(snapKey, {
        key: snapKey,
        point: {
          x: snappedX,
          y: snappedY
        }
      });
    }
    return snappedPointByKey.get(snapKey);
  };
  const boundaryEdges = [];
  const seenEdgeKeys = new Set();
  sourceEdges.forEach((edge, sourceEdgeIndex) => {
    const edgeSortedCutTs = [...edgeCutTs[sourceEdgeIndex]]
      .sort((pieceCutTLeft, pieceCutTRight) => pieceCutTLeft - pieceCutTRight)
      .filter(
        (filteredT, filteredIndex, cutTsList) =>
          filteredIndex === 0 || filteredT - cutTsList[filteredIndex - 1] > epsilon
      );
    for (let edgePieceIndex = 0; edgePieceIndex < edgeSortedCutTs.length - 1; edgePieceIndex += 1) {
      const pieceStartPoint = lerpPoint(edge.start, edge.end, edgeSortedCutTs[edgePieceIndex]);
      const pieceEndPoint = lerpPoint(edge.start, edge.end, edgeSortedCutTs[edgePieceIndex + 1]);
      const pieceLength = distance(pieceStartPoint, pieceEndPoint);
      if (pieceLength <= epsilon) {
        continue;
      }
      const pieceDirection = {
        x: (pieceEndPoint.x - pieceStartPoint.x) / pieceLength,
        y: (pieceEndPoint.y - pieceStartPoint.y) / pieceLength
      };
      const pieceMidpoint = lerpPoint(pieceStartPoint, pieceEndPoint, 0.5);
      const probeOffset = Math.min(pieceLength * 0.2, Math.max(epsilon * 32, 0.00001));
      const leftProbePoint = {
        x: pieceMidpoint.x - pieceDirection.y * probeOffset,
        y: pieceMidpoint.y + pieceDirection.x * probeOffset
      };
      const rightProbePoint = {
        x: pieceMidpoint.x + pieceDirection.y * probeOffset,
        y: pieceMidpoint.y - pieceDirection.x * probeOffset
      };
      const isLeftInside = isInteriorPoint(leftProbePoint);
      const isRightInside = isInteriorPoint(rightProbePoint);
      if (isLeftInside === isRightInside) {
        continue;
      }
      const startNode = snapSamplePoint(isLeftInside ? pieceStartPoint : pieceEndPoint);
      const endNode = snapSamplePoint(isLeftInside ? pieceEndPoint : pieceStartPoint);
      if (startNode.key === endNode.key) {
        continue;
      }
      const edgeKey = [startNode.key, endNode.key].sort().join("|");
      if (!seenEdgeKeys.has(edgeKey)) {
        seenEdgeKeys.add(edgeKey);
        boundaryEdges.push({
          start: startNode,
          end: endNode
        });
      }
    }
  });
  const edgeIndicesByStartKey = new Map();
  boundaryEdges.forEach((listedEdge, listedEdgeIndex) => {
    if (!edgeIndicesByStartKey.has(listedEdge.start.key)) {
      edgeIndicesByStartKey.set(listedEdge.start.key, []);
    }
    edgeIndicesByStartKey.get(listedEdge.start.key).push(listedEdgeIndex);
  });
  const unvisitedEdges = new Set(
    boundaryEdges.map((mappedEdge, mappedEdgeIndex) => mappedEdgeIndex)
  );
  const resultPolygons = [];
  while (unvisitedEdges.size) {
    const startEdgeIndex = unvisitedEdges.values().next().value;
    const startEdge = boundaryEdges[startEdgeIndex];
    const walkPoints = [startEdge.start.point];
    let currentEdgeIndex = startEdgeIndex;
    let isClosed = false;
    for (let stepIndex = 0; stepIndex <= boundaryEdges.length; stepIndex += 1) {
      const currentEdge = boundaryEdges[currentEdgeIndex];
      unvisitedEdges.delete(currentEdgeIndex);
      if (currentEdge.end.key === startEdge.start.key) {
        isClosed = true;
        break;
      }
      walkPoints.push(currentEdge.end.point);
      const nextEdgeIndices = (edgeIndicesByStartKey.get(currentEdge.end.key) || []).filter(
        candidateEdgeIndex => unvisitedEdges.has(candidateEdgeIndex)
      );
      if (!nextEdgeIndices.length) {
        break;
      }
      if (nextEdgeIndices.length === 1) {
        currentEdgeIndex = nextEdgeIndices[0];
        continue;
      }
      const incomingDirection = subtractPoints(currentEdge.end.point, currentEdge.start.point);
      currentEdgeIndex = nextEdgeIndices
        .map(candidateIndex => {
          const candidateEdge = boundaryEdges[candidateIndex];
          const outgoingDirection = subtractPoints(
            candidateEdge.end.point,
            candidateEdge.start.point
          );
          return {
            index: candidateIndex,
            turn: Math.atan2(
              crossProduct(incomingDirection, outgoingDirection),
              incomingDirection.x * outgoingDirection.x + incomingDirection.y * outgoingDirection.y
            )
          };
        })
        .sort((candidateLeft, candidateRight) => candidateRight.turn - candidateLeft.turn)[0].index;
    }
    if (!isClosed) {
      continue;
    }
    const walkPolygon = simplifyPolygon(walkPoints, epsilon * 8);
    if (walkPolygon.length >= 3 && Math.abs(polygonArea(walkPolygon)) > epsilon * epsilon) {
      resultPolygons.push(walkPolygon);
    }
  }
  return resultPolygons.sort(
    (loopLeft, loopRight) => Math.abs(polygonArea(loopRight)) - Math.abs(polygonArea(loopLeft))
  );
}
export function validatedUnionPolygonLoops(inputLoops, validationTolerance = 0.000001) {
  const epsilonValue = Math.max(Number(validationTolerance) || 0, 1e-7);
  const validLoops = (inputLoops || [])
    .filter(checkedLoop => Array.isArray(checkedLoop) && checkedLoop.length >= 3)
    .filter(areaLoop => Math.abs(polygonArea(areaLoop)) > epsilonValue * epsilonValue);
  if (!validLoops.length) {
    return [];
  }
  const mergedLoops = unionPolygonLoops(validLoops, epsilonValue);
  if (!mergedLoops.length) {
    return [];
  }
  const sourceTotalArea = validLoops.reduce(
    (areaSum, sourceLoopItem) => areaSum + Math.abs(polygonArea(sourceLoopItem)),
    0
  );
  const mergedTotalArea = mergedLoops.reduce(
    (mergedAreaSum, mergedLoop) => mergedAreaSum + polygonArea(mergedLoop),
    0
  );
  const areaTolerance = Math.max(sourceTotalArea * 0.001, epsilonValue * epsilonValue * 1024);
  if (mergedTotalArea <= areaTolerance || mergedTotalArea > sourceTotalArea + areaTolerance) {
    return [];
  } else {
    return mergedLoops;
  }
}
function buildWallGraph(graphWalls, nodeTolerance) {
  const nodes = [];
  const endpointWallsByNode = [];
  const nodeIndicesByCell = new Map();
  const getNodeIndex = nodePoint => {
    const cellX = Math.floor(nodePoint.x / nodeTolerance);
    const cellY = Math.floor(nodePoint.y / nodeTolerance);
    let bestNodeIndex = -1;
    for (let cellOffsetX = -1; cellOffsetX <= 1; cellOffsetX += 1) {
      for (let cellOffsetY = -1; cellOffsetY <= 1; cellOffsetY += 1) {
        for (const candidateNodeIndex of nodeIndicesByCell.get(
          cellX + cellOffsetX + "," + (cellY + cellOffsetY)
        ) || []) {
          if (
            (bestNodeIndex < 0 || candidateNodeIndex < bestNodeIndex) &&
            distance(nodes[candidateNodeIndex], nodePoint) <= nodeTolerance
          ) {
            bestNodeIndex = candidateNodeIndex;
          }
        }
      }
    }
    if (bestNodeIndex >= 0) {
      return bestNodeIndex;
    }
    const newNodeIndex = nodes.length;
    nodes.push({
      x: nodePoint.x,
      y: nodePoint.y
    });
    endpointWallsByNode.push([]);
    const cellKey = cellX + "," + cellY;
    if (!nodeIndicesByCell.has(cellKey)) {
      nodeIndicesByCell.set(cellKey, []);
    }
    nodeIndicesByCell.get(cellKey).push(newNodeIndex);
    return newNodeIndex;
  };
  const makeNodePairKey = (nodeIndexA, nodeIndexB) =>
    nodeIndexA < nodeIndexB ? nodeIndexA + "," + nodeIndexB : nodeIndexB + "," + nodeIndexA;
  const graphEdges = [];
  const seenNodePairs = new Set();
  for (const inputWall of graphWalls || []) {
    if (
      ![inputWall?.start?.x, inputWall?.start?.y, inputWall?.end?.x, inputWall?.end?.y].every(
        Number.isFinite
      )
    ) {
      continue;
    }
    const startNodeIndex = getNodeIndex(inputWall.start);
    const endNodeIndex = getNodeIndex(inputWall.end);
    if (startNodeIndex === endNodeIndex) {
      continue;
    }
    endpointWallsByNode[startNodeIndex].push(inputWall);
    endpointWallsByNode[endNodeIndex].push(inputWall);
    const nodePairKey = makeNodePairKey(startNodeIndex, endNodeIndex);
    if (seenNodePairs.has(nodePairKey)) {
      continue;
    }
    seenNodePairs.add(nodePairKey);
    const startNodePoint = nodes[startNodeIndex];
    const endNodePoint = nodes[endNodeIndex];
    graphEdges.push({
      start: startNodeIndex,
      end: endNodeIndex,
      minX: Math.min(startNodePoint.x, endNodePoint.x),
      maxX: Math.max(startNodePoint.x, endNodePoint.x),
      minY: Math.min(startNodePoint.y, endNodePoint.y),
      maxY: Math.max(startNodePoint.y, endNodePoint.y),
      cuts: [
        {
          t: 0,
          node: startNodeIndex
        },
        {
          t: 1,
          node: endNodeIndex
        }
      ]
    });
  }
  const addGraphEdgeCut = (graphEdge, intersectionNodeIndex) => {
    if (intersectionNodeIndex === graphEdge.start || intersectionNodeIndex === graphEdge.end) {
      return;
    }
    const cutProjection = projectPointToSegment(
      nodes[intersectionNodeIndex],
      nodes[graphEdge.start],
      nodes[graphEdge.end]
    );
    if (cutProjection.t > 0 && cutProjection.t < 1 && cutProjection.distance <= nodeTolerance) {
      graphEdge.cuts.push({
        t: cutProjection.t,
        node: intersectionNodeIndex
      });
    }
  };
  graphEdges.sort((graphEdgeLeft, graphEdgeRight) => graphEdgeLeft.minX - graphEdgeRight.minX);
  for (let outerEdgeIndex = 0; outerEdgeIndex < graphEdges.length; outerEdgeIndex += 1) {
    const outerEdge = graphEdges[outerEdgeIndex];
    for (
      let innerEdgeIndex = outerEdgeIndex + 1;
      innerEdgeIndex < graphEdges.length;
      innerEdgeIndex += 1
    ) {
      const innerEdge = graphEdges[innerEdgeIndex];
      if (innerEdge.minX > outerEdge.maxX + nodeTolerance) {
        break;
      }
      if (
        innerEdge.minY > outerEdge.maxY + nodeTolerance ||
        innerEdge.maxY < outerEdge.minY - nodeTolerance
      ) {
        continue;
      }
      addGraphEdgeCut(outerEdge, innerEdge.start);
      addGraphEdgeCut(outerEdge, innerEdge.end);
      addGraphEdgeCut(innerEdge, outerEdge.start);
      addGraphEdgeCut(innerEdge, outerEdge.end);
      const crossingPoint = segmentIntersection(
        nodes[outerEdge.start],
        nodes[outerEdge.end],
        nodes[innerEdge.start],
        nodes[innerEdge.end]
      );
      if (crossingPoint) {
        const crossingNodeIndex = getNodeIndex(crossingPoint);
        addGraphEdgeCut(outerEdge, crossingNodeIndex);
        addGraphEdgeCut(innerEdge, crossingNodeIndex);
      }
    }
  }
  const subEdges = [];
  const seenSubEdgeKeys = new Set();
  for (const subEdgeSource of graphEdges) {
    subEdgeSource.cuts.sort((cutLeft, cutRight) => cutLeft.t - cutRight.t);
    let previousNodeIndex = subEdgeSource.cuts[0].node;
    for (const cut of subEdgeSource.cuts.slice(1)) {
      const cutNodeIndex = cut.node;
      const subEdgeKey = makeNodePairKey(previousNodeIndex, cutNodeIndex);
      if (previousNodeIndex !== cutNodeIndex && !seenSubEdgeKeys.has(subEdgeKey)) {
        seenSubEdgeKeys.add(subEdgeKey);
        subEdges.push({
          start: previousNodeIndex,
          end: cutNodeIndex
        });
      }
      previousNodeIndex = cutNodeIndex;
    }
  }
  return {
    nodes: nodes,
    edges: subEdges,
    endpointWalls: endpointWallsByNode
  };
}
function extractClosedFaces(faceWalls, faceTolerance) {
  const { nodes: graphNodes, edges: faceGraphEdges } = buildWallGraph(faceWalls, faceTolerance);
  const halfEdgeIndicesByNode = Array.from(
    {
      length: graphNodes.length
    },
    () => []
  );
  const halfEdges = [];
  for (const baseEdge of faceGraphEdges) {
    const forwardHalfEdgeIndex = halfEdges.length;
    halfEdges.push(
      {
        start: baseEdge.start,
        end: baseEdge.end
      },
      {
        start: baseEdge.end,
        end: baseEdge.start
      }
    );
    halfEdgeIndicesByNode[baseEdge.start].push(forwardHalfEdgeIndex);
    halfEdgeIndicesByNode[baseEdge.end].push(forwardHalfEdgeIndex + 1);
  }
  const sortedOrderByHalfEdge = new Int32Array(halfEdges.length);
  halfEdgeIndicesByNode.forEach((nodeHalfEdges, nodeIndex) => {
    const halfEdgeAngle = halfEdgeIndex =>
      Math.atan2(
        graphNodes[halfEdges[halfEdgeIndex].end].y - graphNodes[nodeIndex].y,
        graphNodes[halfEdges[halfEdgeIndex].end].x - graphNodes[nodeIndex].x
      );
    nodeHalfEdges.sort(
      (halfEdgeLeft, halfEdgeRight) => halfEdgeAngle(halfEdgeLeft) - halfEdgeAngle(halfEdgeRight)
    );
    nodeHalfEdges.forEach((sortedHalfEdgeIndex, sortedOrder) => {
      sortedOrderByHalfEdge[sortedHalfEdgeIndex] = sortedOrder;
    });
  });
  const nextHalfEdgeIndices = halfEdges.map((forwardHalfEdge, forwardIndex) => {
    const adjacentHalfEdges = halfEdgeIndicesByNode[forwardHalfEdge.end];
    return adjacentHalfEdges[
      (sortedOrderByHalfEdge[forwardIndex ^ 1] + adjacentHalfEdges.length - 1) %
        adjacentHalfEdges.length
    ];
  });
  const visitedHalfEdges = new Uint8Array(halfEdges.length);
  const facesByCycleKey = new Map();
  const recordFace = cycleHalfEdges => {
    if (cycleHalfEdges.length < 3) {
      return;
    }
    const cyclePoints = cycleHalfEdges.map(cycleHalfEdgeIndex => graphNodes[cycleHalfEdgeIndex]);
    const originPoint = cyclePoints[0];
    const signedArea = polygonArea(
      cyclePoints.map(cyclePoint => subtractPoints(cyclePoint, originPoint))
    );
    if (Math.abs(signedArea) <= faceTolerance * faceTolerance) {
      return;
    }
    const orientedCycle = signedArea > 0 ? cycleHalfEdges : [...cycleHalfEdges].reverse();
    let minVertexIndex = 0;
    for (let scanIndex = 1; scanIndex < orientedCycle.length; scanIndex += 1) {
      if (orientedCycle[scanIndex] < orientedCycle[minVertexIndex]) {
        minVertexIndex = scanIndex;
      }
    }
    const cycleKey = [
      ...orientedCycle.slice(minVertexIndex),
      ...orientedCycle.slice(0, minVertexIndex)
    ].join(",");
    const existingFace = facesByCycleKey.get(cycleKey);
    if (existingFace) {
      existingFace.outer ||= signedArea < 0;
      return;
    }
    const facePolygon = simplifyPolygon(
      orientedCycle.map(polygonNodeIndex => ({
        ...graphNodes[polygonNodeIndex]
      })),
      1e-7
    );
    if (facePolygon.length >= 3) {
      facesByCycleKey.set(cycleKey, {
        polygon: facePolygon,
        area: Math.abs(signedArea),
        outer: signedArea < 0
      });
    }
  };
  for (
    let walkStartHalfEdgeIndex = 0;
    walkStartHalfEdgeIndex < halfEdges.length;
    walkStartHalfEdgeIndex += 1
  ) {
    if (visitedHalfEdges[walkStartHalfEdgeIndex]) {
      continue;
    }
    const faceWalk = [];
    const walkPositions = new Map();
    let currentWalkHalfEdge = walkStartHalfEdgeIndex;
    const pushFaceWalk = walkHalfEdgeIndex => {
      const existingPosition = walkPositions.get(walkHalfEdgeIndex);
      if (existingPosition !== undefined) {
        for (
          recordFace(faceWalk.slice(existingPosition));
          faceWalk.length > existingPosition + 1;
        ) {
          walkPositions.delete(faceWalk.pop());
        }
      } else {
        walkPositions.set(walkHalfEdgeIndex, faceWalk.length);
        faceWalk.push(walkHalfEdgeIndex);
      }
    };
    while (!visitedHalfEdges[currentWalkHalfEdge]) {
      visitedHalfEdges[currentWalkHalfEdge] = 1;
      pushFaceWalk(halfEdges[currentWalkHalfEdge].start);
      currentWalkHalfEdge = nextHalfEdgeIndices[currentWalkHalfEdge];
    }
    if (currentWalkHalfEdge === walkStartHalfEdgeIndex) {
      pushFaceWalk(halfEdges[walkStartHalfEdgeIndex].start);
    }
  }
  return [...facesByCycleKey.values()].sort(
    (faceLeft, faceRight) => faceRight.area - faceLeft.area
  );
}
export function closedWallPolygons(loopWalls, polygonTolerance = 1) {
  const polygonToleranceValue = Math.max(Number(polygonTolerance) || 0, 1e-7);
  return extractClosedFaces(loopWalls, polygonToleranceValue).map(face => face.polygon);
}
function collectOpenEndpoints(degreeWalls, degreeTolerance = 1) {
  const endpointToleranceValue = Math.max(Number(degreeTolerance) || 0, 1e-7);
  const {
    nodes: degreeNodes,
    edges: degreeEdges,
    endpointWalls: endpointWallGroups
  } = buildWallGraph(degreeWalls, endpointToleranceValue);
  const degreeByNode = new Uint32Array(degreeNodes.length);
  for (const degreeEdge of degreeEdges) {
    degreeByNode[degreeEdge.start] += 1;
    degreeByNode[degreeEdge.end] += 1;
  }
  return degreeNodes.flatMap((node, degreeNodeIndex) =>
    degreeByNode[degreeNodeIndex] === 1
      ? [
          {
            point: node,
            walls: endpointWallGroups[degreeNodeIndex]
          }
        ]
      : []
  );
}
export function openWallEndpoints(endpointWalls, openEndpointTolerance = 1) {
  return collectOpenEndpoints(endpointWalls, openEndpointTolerance).map(endpoint => ({
    ...endpoint.point
  }));
}
function isStrictlyInsidePolygon(boundaryPolygon, enclosingPolygon, loopEdgeTolerance) {
  if (pointInPolygon(boundaryPolygon, enclosingPolygon, loopEdgeTolerance)) {
    return enclosingPolygon.every(
      (boundaryVertex, boundaryVertexIndex) =>
        projectPointToSegment(
          boundaryPolygon,
          boundaryVertex,
          enclosingPolygon[(boundaryVertexIndex + 1) % enclosingPolygon.length]
        ).distance > loopEdgeTolerance
    );
  } else {
    return false;
  }
}
export function unclosedWallEndpoints(unclosedWalls, unclosedTolerance = 1, floorPolygons = null) {
  const wallToleranceValue = Math.max(Number(unclosedTolerance) || 0, 1e-7);
  const checkedFloorPolygons = Array.isArray(floorPolygons)
    ? floorPolygons
    : closedWallFloorPolygons(unclosedWalls, wallToleranceValue);
  return collectOpenEndpoints(unclosedWalls, wallToleranceValue)
    .filter(
      openEndpoint =>
        !openEndpoint.walls.length ||
        openEndpoint.walls.some(endpointWall => endpointWall.allowOpenEnd !== true)
    )
    .filter(
      testedEndpoint =>
        !checkedFloorPolygons.some(floorPolygon =>
          isStrictlyInsidePolygon(testedEndpoint.point, floorPolygon, wallToleranceValue)
        )
    )
    .map(mappedEndpoint => ({
      ...mappedEndpoint.point
    }));
}
function isLoopEngulfedByLoop(innerLoop, outerLoop, engulfTolerance) {
  const toleranceSquared = engulfTolerance * engulfTolerance;
  const absolutePolygonArea = measuredLoop =>
    Math.abs(
      polygonArea(measuredLoop.map(loopPoint => subtractPoints(loopPoint, measuredLoop[0])))
    );
  if (absolutePolygonArea(outerLoop) <= absolutePolygonArea(innerLoop) + toleranceSquared) {
    return false;
  } else {
    return innerLoop.every((innerVertex, cornerIndex) => {
      if (!pointInPolygon(innerVertex, outerLoop, engulfTolerance)) {
        return false;
      }
      const nextInnerVertex = innerLoop[(cornerIndex + 1) % innerLoop.length];
      const edgeMidpoint = {
        x: (innerVertex.x + nextInnerVertex.x) / 2,
        y: (innerVertex.y + nextInnerVertex.y) / 2
      };
      return pointInPolygon(edgeMidpoint, outerLoop, engulfTolerance);
    });
  }
}
export function closedWallFloorPolygons(floorWalls, floorTolerance = 1) {
  const floorToleranceValue = Math.max(Number(floorTolerance) || 0, 1e-7);
  const outerFloorPolygons = [];
  for (const { polygon: outerFacePolygon, outer: isOuterFace } of extractClosedFaces(
    floorWalls,
    floorToleranceValue
  )) {
    if (
      !!isOuterFace &&
      !outerFloorPolygons.some(candidateFloor =>
        isLoopEngulfedByLoop(outerFacePolygon, candidateFloor, floorToleranceValue)
      )
    ) {
      outerFloorPolygons.push(outerFacePolygon);
    }
  }
  return outerFloorPolygons;
}
export function modelBounds(model) {
  const boundPoints = [];
  if (model.background?.width && model.background?.height) {
    boundPoints.push(
      {
        x: 0,
        y: 0
      },
      {
        x: model.background.width,
        y: model.background.height
      }
    );
  }
  for (const boundWall of model.walls || []) {
    boundPoints.push(boundWall.start, boundWall.end);
  }
  for (const boundItem of model.items || []) {
    boundPoints.push({
      x: boundItem.x,
      y: boundItem.y
    });
  }
  if (!boundPoints.length) {
    return {
      minX: 0,
      minY: 0,
      maxX: 1200,
      maxY: 800,
      width: 1200,
      height: 800
    };
  }
  const minX = Math.min(...boundPoints.map(minXPoint => minXPoint.x));
  const minY = Math.min(...boundPoints.map(minYPoint => minYPoint.y));
  const maxX = Math.max(...boundPoints.map(maxXPoint => maxXPoint.x));
  const maxY = Math.max(...boundPoints.map(maxYPoint => maxYPoint.y));
  return {
    minX: minX,
    minY: minY,
    maxX: Math.max(maxX, minX + 1),
    maxY: Math.max(maxY, minY + 1),
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1)
  };
}
