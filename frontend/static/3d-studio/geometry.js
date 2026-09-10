const EPSILON = 1e-7;
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
export function spotLightBrightnessResponse(lightType = "downlight", brightness = 0) {
  const clampedBrightness = clamp(Number(brightness) || 0, 0, 1);
  const squared = clampedBrightness * clampedBrightness;
  if (lightType !== "ceilinglight" || clampedBrightness <= 0 || clampedBrightness >= 0.35) {
    return squared;
  }
  const boost = clampedBrightness * 0.08 * (1 - clampedBrightness / 0.35);
  return squared + boost;
}
export function stripLightProjection(elevationInput = 2.7, rangeInput = 3.5, coreScaleInput = 2) {
  const elevation = clamp(Number.isFinite(Number(elevationInput)) ? Number(elevationInput) : 2.7, 0.05, 6);
  const rangeBase = clamp(Number.isFinite(Number(rangeInput)) ? Number(rangeInput) : 3.5, 0.5, 10);
  const coreScaleBase = clamp(Number.isFinite(Number(coreScaleInput)) ? Number(coreScaleInput) : 2, 0.2, 8);
  const elevationFactor = clamp(elevation / 2.7, 0.2, 2.2);
  const coreScaleFactor = clamp(coreScaleBase / 2, 0.1, 4);
  return {
    elevation,
    range: rangeBase * clamp(0.5 + elevationFactor * 0.5, 0.6, 1.6) * clamp(0.82 + coreScaleFactor * 0.18, 0.75, 1.5),
    coreScale: clamp(0.55 + elevationFactor * 0.45, 0.65, 1.55),
    intensity: clamp(1 / elevationFactor, 0.5, 2.2)
  };
}
export function adaptiveLightRenderCost(lights = []) {
  return lights.reduce((cost, light) => light?.enabled === false || Math.max(0, Number(light?.brightness) || 0) <= 0 ? cost : light?.type === "striplight" ? cost + 0.3 : light?.type === "ceilinglight" ? cost + (Number(light?.angle) >= 140 ? 1.65 : 1.1) : light?.type === "downlight" ? cost + 1 : cost, 0);
}
export function adaptiveDeviceLightBudget({
  hardwareConcurrency = 4,
  deviceMemory = 8,
  previewPixels = 500000
} = {}) {
  const cores = clamp(Number(hardwareConcurrency) || 4, 2, 24);
  const memoryGb = clamp(Number(deviceMemory) || 8, 2, 32);
  const pixels = clamp(Number(previewPixels) || 500000, 120000, 4000000);
  const baseBudget = 4.5 + Math.min(cores, 16) * 0.55;
  const memoryFactor = memoryGb <= 4 ? 0.78 : memoryGb < 8 ? 0.88 : memoryGb >= 16 ? 1.1 : 1;
  const pixelFactor = clamp(Math.sqrt(500000 / pixels), 0.72, 1.2);
  return clamp(baseBudget * memoryFactor * pixelFactor, 4, 16);
}
export function assessAdaptiveRenderFrames(frameSamplesMs = []) {
  const samples = frameSamplesMs.map(Number).filter(sampleMs => Number.isFinite(sampleMs) && sampleMs >= 8 && sampleMs <= 120);
  if (samples.length < 12) {
    return {
      sufficient: false,
      sampleCount: samples.length
    };
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const percentile = ratio => sorted[Math.min(Math.floor((sorted.length - 1) * ratio), sorted.length - 1)];
  const averageFrameMs = samples.reduce((sum, ms) => sum + ms, 0) / samples.length;
  const p75FrameMs = percentile(0.75);
  const p90FrameMs = percentile(0.9);
  return {
    sufficient: true,
    sampleCount: samples.length,
    averageFrameMs,
    p75FrameMs,
    p90FrameMs,
    fps: 1000 / averageFrameMs,
    severe: averageFrameMs >= 45 || p75FrameMs >= 50 || p90FrameMs >= 68,
    slow: averageFrameMs >= 34 || p75FrameMs >= 38 || p90FrameMs >= 55,
    smooth: averageFrameMs <= 24 && p90FrameMs <= 32
  };
}
export function planLabelProjectionMetrics(width, height, baselineRatio = 0.86) {
  const safeWidth = Math.max(0, Number(width) || 0);
  const safeHeight = Math.max(0, Number(height) || 0);
  const safeBaselineRatio = clamp(Number.isFinite(Number(baselineRatio)) ? Number(baselineRatio) : 0.86, 0.3, 1);
  return {
    titleStartX: -safeWidth * (0.5 - 115 / 2048),
    titleY: safeHeight * (130 / 640 - 0.5),
    titleFontSize: safeHeight * 184 / 640,
    titleMaxWidth: safeWidth * 1340 / 2048,
    iconX: safeWidth * (1580 / 2048 - 0.5),
    iconY: safeHeight * (130 / 640 - 0.5),
    iconSize: safeHeight * 170 / 640,
    subtitleStartX: -safeWidth * (0.5 - 72 / 2048),
    subtitleY: safeHeight * (410 / 640 - 0.5),
    subtitleFontSize: safeHeight * 310 / 640,
    subtitleMaxWidth: safeWidth * 1880 / 2048,
    baselineY: safeHeight * (590 / 640 - 0.5),
    baselineStartX: -safeWidth * (0.5 - 74 / 2048),
    baselineLength: safeWidth * 1880 / 2048 * safeBaselineRatio,
    baselineLineWidth: safeHeight * 16 / 640,
    baselineCapHalfHeight: safeHeight * 24 / 640
  };
}
export function selectShadowCastingLightIds(lights = [], budget = 8) {
  const limit = Math.max(0, Math.floor(Number(budget) || 0));
  if (limit === 0) {
    return [];
  }
  const candidates = lights.map((light, index) => ({
    id: String(light?.id || ""),
    groupId: String(light?.groupId || ""),
    type: String(light?.type || ""),
    brightness: Math.max(0, Number(light?.brightness) || 0),
    enabled: light?.enabled !== false,
    index
  })).filter(candidate => candidate.id && candidate.enabled && candidate.brightness > 0 && candidate.type !== "striplight").map(entry => ({
    ...entry,
    score: entry.brightness * (entry.type === "ceilinglight" ? 1.08 : 1)
  }));
  if (candidates.length <= limit) {
    return candidates.map(selected => selected.id);
  }
  const compareScore = (left, right) => right.score - left.score || left.index - right.index;
  const bestByGroup = new Map();
  for (const item of candidates) {
    const groupKey = item.groupId || "__ungrouped-" + item.index;
    const currentBest = bestByGroup.get(groupKey);
    if (!currentBest || compareScore(item, currentBest) < 0) {
      bestByGroup.set(groupKey, item);
    }
  }
  const picked = [...bestByGroup.values()].sort(compareScore).slice(0, limit);
  if (picked.length < limit) {
    const pickedIds = new Set(picked.map(pickedItem => pickedItem.id));
    const remaining = candidates.filter(rest => !pickedIds.has(rest.id)).sort(compareScore);
    picked.push(...remaining.slice(0, limit - picked.length));
  }
  return picked.map(finalItem => finalItem.id);
}
export function spotShadowTextureUnitLimit({
  maxTextureUnits = 16,
  materialTextureUnits = 0,
  nonSpotShadowTextureUnits = 1,
  rectAreaLightTextureUnits = 0,
  reservedTextureUnits = 1,
  hardLimit = 8
} = {}) {
  const maxUnits = Math.max(0, Math.floor(Number(maxTextureUnits) || 0));
  const usedUnits = [materialTextureUnits, nonSpotShadowTextureUnits, rectAreaLightTextureUnits, reservedTextureUnits].reduce((sum, units) => sum + Math.max(0, Math.floor(Number(units) || 0)), 0);
  const hardCap = Math.max(0, Math.floor(Number(hardLimit) || 0));
  const softCap = maxUnits <= 16 ? 3 : maxUnits <= 24 ? 6 : hardCap;
  return Math.min(hardCap, softCap, Math.max(0, maxUnits - usedUnits));
}
export function localSpotShadowSettings(lightType = "downlight", rangeInput = 3.5, angleInput = 90) {
  const range = clamp(Number.isFinite(Number(rangeInput)) ? Number(rangeInput) : 3.5, 0.5, 10);
  const angle = clamp(Number.isFinite(Number(angleInput)) ? Number(angleInput) : 90, 15, 180);
  const wideCeilingLight = lightType === "ceilinglight" && angle >= 140;
  return {
    mapSize: wideCeilingLight ? 512 : 256,
    radius: wideCeilingLight ? 1.25 : 1,
    blurSamples: wideCeilingLight ? 8 : 4,
    normalBias: 0.018,
    wideCeilingLight,
    range,
    angle
  };
}
export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
export function slidingDoorPanelCenters(openingWidth, swing = -1, openRatio = 2 / 3) {
  const fixedCenter = (swing >= 0 ? 1 : -1) * openingWidth * 0.23;
  const closedMovingCenter = -fixedCenter;
  return {
    fixed: fixedCenter,
    moving: closedMovingCenter + (fixedCenter - closedMovingCenter) * clamp(openRatio, 0, 1)
  };
}
export function projectPointToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 1e-7) {
    return {
      point: {
        ...start
      },
      t: 0,
      distance: distance(point, start)
    };
  }
  const param = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq, 0, 1);
  const projected = {
    x: start.x + dx * param,
    y: start.y + dy * param
  };
  return {
    point: projected,
    t: param,
    distance: distance(point, projected)
  };
}
export function segmentIntersection(aStart, aEnd, bStart, bEnd) {
  const adx = aEnd.x - aStart.x;
  const ady = aEnd.y - aStart.y;
  const bdx = bEnd.x - bStart.x;
  const bdy = bEnd.y - bStart.y;
  const denom = adx * bdy - ady * bdx;
  if (Math.abs(denom) <= 1e-7) {
    return null;
  }
  const ox = bStart.x - aStart.x;
  const oy = bStart.y - aStart.y;
  const paramA = (ox * bdy - oy * bdx) / denom;
  const paramB = (ox * ady - oy * adx) / denom;
  if (paramA < -1e-7 || paramA > 1.0000001 || paramB < -1e-7 || paramB > 1.0000001) {
    return null;
  } else {
    return {
      x: aStart.x + adx * clamp(paramA, 0, 1),
      y: aStart.y + ady * clamp(paramA, 0, 1)
    };
  }
}
export function wallIntersections(walls) {
  const points = [];
  for (let i = 0; i < walls.length; i += 1) {
    for (let buildWallGraph = i + 1; buildWallGraph < walls.length; buildWallGraph += 1) {
      const hit = segmentIntersection(walls[i].start, walls[i].end, walls[buildWallGraph].start, walls[buildWallGraph].end);
      if (!!hit && !points.some(existing => distance(existing, hit) <= 1e-7)) {
        points.push(hit);
      }
    }
  }
  return points;
}
export function splitWallSegments(walls, epsilonInput = 0.000001) {
  const epsilon = Math.max(Number(epsilonInput) || 0, 1e-7);
  const cutParams = walls.map(() => [0, 1]);
  for (let i = 0; i < walls.length; i += 1) {
    for (let buildWallGraph = i + 1; buildWallGraph < walls.length; buildWallGraph += 1) {
      const wallA = walls[i];
      const wallB = walls[buildWallGraph];
      const hit = segmentIntersection(wallA.start, wallA.end, wallB.start, wallB.end);
      if (!hit) {
        continue;
      }
      const projA = projectPointToSegment(hit, wallA.start, wallA.end);
      const projB = projectPointToSegment(hit, wallB.start, wallB.end);
      if (projA.t > epsilon && projA.t < 1 - epsilon) {
        cutParams[i].push(projA.t);
      }
      if (projB.t > epsilon && projB.t < 1 - epsilon) {
        cutParams[buildWallGraph].push(projB.t);
      }
    }
  }
  const pieces = [];
  walls.forEach((wall, wallIndex) => {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    const params = [...cutParams[wallIndex]].sort((pa, pb) => pa - pb).filter((param, paramIndex, allParams) => paramIndex === 0 || param - allParams[paramIndex - 1] > epsilon);
    for (let pieceIndex = 0; pieceIndex < params.length - 1; pieceIndex += 1) {
      const startT = params[pieceIndex];
      const endT = params[pieceIndex + 1];
      if (!(endT - startT <= epsilon)) {
        pieces.push({
          sourceWall: wall,
          sourceIndex: wallIndex,
          pieceIndex,
          pieceCount: params.length - 1,
          startT,
          endT,
          start: {
            x: wall.start.x + dx * startT,
            y: wall.start.y + dy * startT
          },
          end: {
            x: wall.start.x + dx * endT,
            y: wall.start.y + dy * endT
          }
        });
      }
    }
  });
  return pieces;
}
export function uncoveredCollinearWallSegments(wall, otherWalls, toleranceInput = 0.001) {
  if (!wall?.start || !wall?.end) {
    return [];
  }
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy);
  if (length <= tolerance) {
    return [];
  }
  const direction = {
    x: dx / length,
    y: dy / length
  };
  const paramTolerance = tolerance / length;
  const coverIntervals = [];
  for (const other of otherWalls || []) {
    if (!other?.start || !other?.end || other.id === wall.id) {
      continue;
    }
    const odx = other.end.x - other.start.x;
    const ody = other.end.y - other.start.y;
    const otherLength = Math.hypot(odx, ody);
    if (otherLength <= tolerance || Math.abs(direction.x * ody / otherLength - direction.y * odx / otherLength) > paramTolerance) {
      continue;
    }
    const startOffset = {
      x: other.start.x - wall.start.x,
      y: other.start.y - wall.start.y
    };
    const endOffset = {
      x: other.end.x - wall.start.x,
      y: other.end.y - wall.start.y
    };
    const startCross = Math.abs(startOffset.x * direction.y - startOffset.y * direction.x);
    const endCross = Math.abs(endOffset.x * direction.y - endOffset.y * direction.x);
    if (Math.max(startCross, endCross) > tolerance) {
      continue;
    }
    const startParam = (startOffset.x * direction.x + startOffset.y * direction.y) / length;
    const endParam = (endOffset.x * direction.x + endOffset.y * direction.y) / length;
    const intervalStart = clamp(Math.min(startParam, endParam), 0, 1);
    const intervalEnd = clamp(Math.max(startParam, endParam), 0, 1);
    if (intervalEnd - intervalStart > paramTolerance) {
      coverIntervals.push([intervalStart, intervalEnd]);
    }
  }
  if (!coverIntervals.length) {
    return [{
      start: {
        ...wall.start
      },
      end: {
        ...wall.end
      }
    }];
  }
  coverIntervals.sort((left, right) => left[0] - right[0]);
  const merged = [];
  for (const interval of coverIntervals) {
    const last = merged.at(-1);
    if (last && interval[0] <= last[1] + paramTolerance) {
      last[1] = Math.max(last[1], interval[1]);
    } else {
      merged.push([...interval]);
    }
  }
  const gaps = [];
  let cursor = 0;
  for (const [coverStart, coverEnd] of merged) {
    if (coverStart - cursor > paramTolerance) {
      gaps.push([cursor, coverStart]);
    }
    cursor = Math.max(cursor, coverEnd);
  }
  if (1 - cursor > paramTolerance) {
    gaps.push([cursor, 1]);
  }
  return gaps.map(([gapStart, gapEnd]) => ({
    start: {
      x: wall.start.x + dx * gapStart,
      y: wall.start.y + dy * gapStart
    },
    end: {
      x: wall.start.x + dx * gapEnd,
      y: wall.start.y + dy * gapEnd
    }
  }));
}
export function canonicalPolygonKey(polygon, precisionInput = 5) {
  if (!Array.isArray(polygon) || !polygon.length) {
    return "";
  }
  const precision = clamp(Math.round(Number(precisionInput) || 0), 0, 12);
  const coords = polygon.map(vertex => {
    const x = Math.abs(Number(vertex?.x) || 0) < 10 ** -precision / 2 ? 0 : Number(vertex?.x) || 0;
    const y = Math.abs(Number(vertex?.y) || 0) < 10 ** -precision / 2 ? 0 : Number(vertex?.y) || 0;
    return x.toFixed(precision) + "," + y.toFixed(precision);
  });
  const rotations = [];
  for (const sequence of [coords, [...coords].reverse()]) {
    for (let offset = 0; offset < sequence.length; offset += 1) {
      rotations.push([...sequence.slice(offset), ...sequence.slice(0, offset)].join(";"));
    }
  }
  return rotations.sort()[0];
}
function findWallEndpointJunction(firstWall, secondWall, tolerance) {
  const matches = [{
    firstKey: "start",
    secondKey: "start"
  }, {
    firstKey: "start",
    secondKey: "end"
  }, {
    firstKey: "end",
    secondKey: "start"
  }, {
    firstKey: "end",
    secondKey: "end"
  }].filter(({
    firstKey,
    secondKey
  }) => distance(firstWall[firstKey], secondWall[secondKey]) <= tolerance);
  if (matches.length !== 1) {
    return null;
  }
  const match = matches[0];
  return {
    point: {
      x: (firstWall[match.firstKey].x + secondWall[match.secondKey].x) / 2,
      y: (firstWall[match.firstKey].y + secondWall[match.secondKey].y) / 2
    },
    firstKey: match.firstKey,
    secondKey: match.secondKey,
    firstOuter: firstWall[match.firstKey === "start" ? "end" : "start"],
    secondOuter: secondWall[match.secondKey === "start" ? "end" : "start"]
  };
}
function wallsHaveMatchingProps(firstWall, secondWall, tolerance) {
  const firstOpacity = firstWall.opacity === null || firstWall.opacity === undefined ? null : Number(firstWall.opacity);
  const secondOpacity = secondWall.opacity === null || secondWall.opacity === undefined ? null : Number(secondWall.opacity);
  const opacityMatches = firstOpacity === null || secondOpacity === null ? firstOpacity === secondOpacity : Math.abs(firstOpacity - secondOpacity) <= tolerance;
  return Math.abs((Number(firstWall.height) || 0) - (Number(secondWall.height) || 0)) <= tolerance && Math.abs((Number(firstWall.thickness) || 0) - (Number(secondWall.thickness) || 0)) <= tolerance && opacityMatches && firstWall.allowOpenEnd === true == (secondWall.allowOpenEnd === true);
}
function countWallEndpointsNear(entries, point, tolerance) {
  return entries.reduce((count, entry) => count + (distance(entry.wall.start, point) <= tolerance ? 1 : 0) + (distance(entry.wall.end, point) <= tolerance ? 1 : 0), 0);
}
function isCollinearOppositeJunction(junction, tolerance) {
  const firstVec = subtractPoints(junction.firstOuter, junction.point);
  const secondVec = subtractPoints(junction.secondOuter, junction.point);
  const firstLen = Math.hypot(firstVec.x, firstVec.y);
  const secondLen = Math.hypot(secondVec.x, secondVec.y);
  if (firstLen <= tolerance || secondLen <= tolerance) {
    return false;
  }
  const crossAbs = Math.abs(cross2d(firstVec, secondVec));
  return firstVec.x * secondVec.x + firstVec.y * secondVec.y < 0 && crossAbs <= tolerance * Math.max(firstLen, secondLen, 1);
}
export function mergeCollinearWallSegments(walls, epsilonInput = 0.000001) {
  const epsilon = Math.max(Number(epsilonInput) || 0, 1e-7);
  const entries = (walls || []).filter(wall => wall?.start && wall?.end && distance(wall.start, wall.end) > epsilon).map(source => ({
    wall: {
      ...source,
      start: {
        ...source.start
      },
      end: {
        ...source.end
      }
    },
    sourceIds: new Set([source.id])
  }));
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < entries.length && !merged; i += 1) {
      for (let buildWallGraph = i + 1; buildWallGraph < entries.length; buildWallGraph += 1) {
        const entryA = entries[i];
        const entryB = entries[buildWallGraph];
        if (!wallsHaveMatchingProps(entryA.wall, entryB.wall, epsilon)) {
          continue;
        }
        const junction = findWallEndpointJunction(entryA.wall, entryB.wall, epsilon);
        if (!junction || countWallEndpointsNear(entries, junction.point, epsilon) !== 2 || !isCollinearOppositeJunction(junction, epsilon)) {
          continue;
        }
        const mergedWall = {
          ...entryA.wall,
          start: junction.firstKey === "end" ? {
            ...junction.firstOuter
          } : {
            ...junction.secondOuter
          },
          end: junction.firstKey === "end" ? {
            ...junction.secondOuter
          } : {
            ...junction.firstOuter
          }
        };
        entries[i] = {
          wall: mergedWall,
          sourceIds: new Set([...entryA.sourceIds, ...entryB.sourceIds])
        };
        entries.splice(buildWallGraph, 1);
        merged = true;
        break;
      }
    }
  }
  const wallIdMap = new Map();
  for (const entry of entries) {
    for (const sourceId of entry.sourceIds) {
      wallIdMap.set(sourceId, entry.wall.id);
    }
  }
  return {
    walls: entries.map(finalEntry => finalEntry.wall),
    wallIdMap
  };
}
export function remapWallAttachment(attachment, fromWall, toWall) {
  if (!attachment || !fromWall || !toWall) {
    return attachment;
  }
  const param = clamp(Number(attachment.t) || 0, 0, 1);
  const worldPoint = lerpPoint(fromWall.start, fromWall.end, param);
  return {
    ...attachment,
    wallId: toWall.id,
    t: clamp(projectPointToSegment(worldPoint, toWall.start, toWall.end).t, 0, 1)
  };
}
function nearestSnapCandidate(point, candidates, tolerance) {
  let best = null;
  for (const candidate of candidates) {
    const dist = distance(point, candidate.point);
    if (!(dist > tolerance) && (!best || !(dist >= best.distance))) {
      best = {
        ...candidate,
        distance: dist
      };
    }
  }
  return best;
}
export function axisLockedPoint(point, anchor) {
  const dx = point.x - anchor.x;
  const dy = point.y - anchor.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      point: {
        x: point.x,
        y: anchor.y
      },
      axis: "horizontal",
      label: "水平轴"
    };
  } else {
    return {
      point: {
        x: anchor.x,
        y: point.y
      },
      axis: "vertical",
      label: "垂直轴"
    };
  }
}
function snapAlongAxisToWall(point, axisPoint, walls, tolerance, axis) {
  let best = null;
  for (const wall of walls) {
    const fixedAxis = axis === "vertical" ? "x" : "y";
    const freeAxis = axis === "vertical" ? "y" : "x";
    const axisDelta = wall.end[fixedAxis] - wall.start[fixedAxis];
    if (Math.abs(axisDelta) <= 1e-7) {
      if (Math.abs(wall.start[fixedAxis] - axisPoint[fixedAxis]) > 1e-7) {
        continue;
      }
      const projection = projectPointToSegment(point, wall.start, wall.end);
      if (projection.distance > tolerance || best && projection.distance >= best.distance) {
        continue;
      }
      best = {
        point: {
          ...projection.point,
          [fixedAxis]: axisPoint[fixedAxis]
        },
        kind: "segment",
        targetId: wall.id,
        label: (axis === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: projection.distance
      };
      continue;
    }
    const param = (axisPoint[fixedAxis] - wall.start[fixedAxis]) / axisDelta;
    if (param < -1e-7 || param > 1.0000001) {
      continue;
    }
    const snapAt = {
      ...axisPoint
    };
    snapAt[freeAxis] = wall.start[freeAxis] + (wall.end[freeAxis] - wall.start[freeAxis]) * clamp(param, 0, 1);
    const dist = distance(point, snapAt);
    if (!(dist > tolerance) && (!best || !(dist >= best.distance))) {
      best = {
        point: snapAt,
        kind: "segment",
        targetId: wall.id,
        label: (axis === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: dist
      };
    }
  }
  return best;
}
function preferVerticalAxisSnap(point, anchor, walls, tolerance) {
  if (!anchor || Math.abs(point.x - anchor.x) > tolerance) {
    return null;
  }
  const segmentSnap = snapAlongAxisToWall(point, anchor, walls, tolerance, "vertical");
  return segmentSnap || {
    point: {
      x: anchor.x,
      y: point.y
    },
    kind: "axis",
    label: "垂直轴",
    distance: Math.abs(point.x - anchor.x)
  };
}
function snapOrthogonalFromAnchor(point, anchor, walls, tolerance, intersections = wallIntersections(walls), options = {}) {
  const locked = axisLockedPoint(point, anchor);
  const fixedAxis = locked.axis === "vertical" ? "x" : "y";
  const axisTolerance = Math.max(1e-7, tolerance * 0.000001);
  const axisLabel = locked.axis === "vertical" ? "垂直" : "水平";
  const candidates = [...(options.snapEndpoints === false ? [] : walls.flatMap(wall => [{
    point: wall.start,
    kind: "endpoint",
    targetId: wall.id,
    label: axisLabel + " · 端点"
  }, {
    point: wall.end,
    kind: "endpoint",
    targetId: wall.id,
    label: axisLabel + " · 端点"
  }])), ...(options.snapIntersections === false ? [] : intersections.map(intersection => ({
    point: intersection,
    kind: "intersection",
    label: axisLabel + " · 交点"
  })))].filter(candidate => Math.abs(candidate.point[fixedAxis] - anchor[fixedAxis]) <= axisTolerance);
  const nearest = nearestSnapCandidate(point, candidates, tolerance);
  if (nearest) {
    return nearest;
  }
  if (options.snapSegments !== false) {
    const segmentSnap = snapAlongAxisToWall(point, anchor, walls, tolerance, locked.axis);
    if (segmentSnap) {
      return segmentSnap;
    }
  }
  return {
    ...locked,
    kind: "axis",
    distance: distance(point, locked.point)
  };
}
export function snapPoint(point, walls, options = {}) {
  const zoom = Math.max(Number(options.zoom) || 1, 1e-7);
  const tolerance = (Number(options.screenTolerance) || 12) / zoom;
  const cachedIntersections = Array.isArray(options.intersections) ? options.intersections : null;
  if (options.forceOrthogonalAxis === true && options.anchor) {
    const orthogonalIntersections = options.snapIntersections === false ? [] : cachedIntersections || wallIntersections(walls);
    return snapOrthogonalFromAnchor(point, options.anchor, walls, tolerance, orthogonalIntersections, options);
  }
  const endpointCandidates = [];
  if (options.snapEndpoints !== false) {
    for (const wall of walls) {
      endpointCandidates.push({
        point: wall.start,
        kind: "endpoint",
        targetId: wall.id,
        label: "端点"
      }, {
        point: wall.end,
        kind: "endpoint",
        targetId: wall.id,
        label: "端点"
      });
    }
  }
  const endpointSnap = nearestSnapCandidate(point, endpointCandidates, tolerance);
  if (endpointSnap) {
    return endpointSnap;
  }
  if (options.snapIntersections !== false) {
    const intersectionSnap = nearestSnapCandidate(point, (cachedIntersections || wallIntersections(walls)).map(intersection => ({
      point: intersection,
      kind: "intersection",
      label: "交点"
    })), tolerance);
    if (intersectionSnap) {
      return intersectionSnap;
    }
  }
  if (options.preferVerticalAxis === true && options.snapOrthogonal !== false && options.anchor) {
    const verticalSnap = preferVerticalAxisSnap(point, options.anchor, walls, tolerance);
    if (verticalSnap) {
      return verticalSnap;
    }
  }
  if (options.snapSegments !== false) {
    const segmentSnap = walls.map(segWall => {
      const projection = projectPointToSegment(point, segWall.start, segWall.end);
      return {
        point: projection.point,
        kind: "segment",
        targetId: segWall.id,
        label: "墙线",
        distance: projection.distance
      };
    }).filter(candidate => candidate.distance <= tolerance).sort((a, b) => a.distance - b.distance)[0];
    if (segmentSnap) {
      return segmentSnap;
    }
  }
  if (options.snapAngles !== false && options.anchor) {
    const dx = point.x - options.anchor.x;
    const dy = point.y - options.anchor.y;
    const radius = Math.hypot(dx, dy);
    if (radius > 1e-7) {
      const stepRadians = (Number(options.angleStepDegrees) || 15) * Math.PI / 180;
      const rawAngle = Math.atan2(dy, dx);
      const snappedAngle = Math.round(rawAngle / stepRadians) * stepRadians;
      const angledPoint = {
        x: options.anchor.x + Math.cos(snappedAngle) * radius,
        y: options.anchor.y + Math.sin(snappedAngle) * radius
      };
      const angleDistance = distance(point, angledPoint);
      if (angleDistance <= tolerance) {
        const degrees = (snappedAngle * 180 / Math.PI + 360) % 360;
        return {
          point: angledPoint,
          kind: "angle",
          label: Math.round(degrees) + "°",
          distance: angleDistance
        };
      }
    }
  }
  const gridSize = Number(options.gridSize) || 0;
  if (options.snapGrid !== false && gridSize > 1e-7) {
    const gridPoint = {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
    const gridDistance = distance(point, gridPoint);
    if (gridDistance <= tolerance) {
      return {
        point: gridPoint,
        kind: "grid",
        label: "网格",
        distance: gridDistance
      };
    }
  }
  return {
    point: {
      ...point
    },
    kind: null,
    label: "",
    distance: 0
  };
}
export function nearestWall(point, walls, maxDistance = Infinity) {
  let best = null;
  for (const wall of walls) {
    const projection = projectPointToSegment(point, wall.start, wall.end);
    if (!(projection.distance > maxDistance) && (!best || !(projection.distance >= best.distance))) {
      best = {
        wall,
        ...projection
      };
    }
  }
  return best;
}
export function wallLengthMeters(wall, pixelsPerMeter) {
  return distance(wall.start, wall.end) / Math.max(Number(pixelsPerMeter) || 1, 1e-7);
}
export function clampWindowT(wall, windowItem, pixelsPerMeter) {
  const wallLength = wallLengthMeters(wall, pixelsPerMeter);
  if (wallLength <= 1e-7) {
    return 0.5;
  }
  const halfWidthMeters = Math.min(Math.max(Number(windowItem.width) || 0, 0) / 2, wallLength / 2);
  return clamp(Number(windowItem.t) || 0, halfWidthMeters / wallLength, 1 - halfWidthMeters / wallLength);
}
export function doorLeafRotation(door, openAngle = Math.PI / 2) {
  return -(door?.swing === -1 ? -1 : 1) * openAngle;
}
export function wallJoinExtensions(walls, toleranceInput = 0.001, extensionFactor = 4) {
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  const factor = Math.max(Number(extensionFactor) || 0, 1);
  const extensions = Object.fromEntries((walls || []).map(wall => [wall.id, {
    start: 0,
    end: 0
  }]));
  const nodes = [];
  const getOrCreateNode = point => {
    let node = nodes.find(existing => distance(existing.point, point) <= tolerance);
    if (!node) {
      node = {
        point: {
          ...point
        },
        incidents: []
      };
      nodes.push(node);
    }
    return node;
  };
  for (const joinWall of walls || []) {
    const dx = joinWall.end.x - joinWall.start.x;
    const dy = joinWall.end.y - joinWall.start.y;
    const length = Math.hypot(dx, dy);
    if (length <= tolerance) {
      continue;
    }
    const halfThickness = Math.max(Number(joinWall.thickness) || 0, 0) / 2;
    getOrCreateNode(joinWall.start).incidents.push({
      wallId: joinWall.id,
      endpoint: "start",
      x: dx / length,
      y: dy / length,
      halfThickness
    });
    getOrCreateNode(joinWall.end).incidents.push({
      wallId: joinWall.id,
      endpoint: "end",
      x: -dx / length,
      y: -dy / length,
      halfThickness
    });
  }
  const angleEpsilon = 0.0001;
  for (const joinNode of nodes) {
    if (joinNode.incidents.length < 2) {
      continue;
    }
    const incidents = joinNode.incidents.map(incident => ({
      ...incident,
      angle: Math.atan2(incident.y, incident.x)
    })).sort((a, b) => a.angle - b.angle);
    for (let i = 0; i < incidents.length; i += 1) {
      const left = incidents[i];
      const right = incidents[(i + 1) % incidents.length];
      const angleDelta = (right.angle - left.angle + Math.PI * 2) % (Math.PI * 2);
      if (angleDelta <= angleEpsilon || angleDelta >= Math.PI - angleEpsilon) {
        continue;
      }
      const sinDelta = Math.sin(angleDelta);
      const cosDelta = Math.cos(angleDelta);
      if (sinDelta <= angleEpsilon) {
        continue;
      }
      const maxExtension = Math.max(left.halfThickness, right.halfThickness, 0.000001) * factor;
      const leftExtension = clamp((right.halfThickness + left.halfThickness * cosDelta) / sinDelta, 0, maxExtension);
      const rightExtension = clamp((left.halfThickness + right.halfThickness * cosDelta) / sinDelta, 0, maxExtension);
      extensions[left.wallId][left.endpoint] = Math.max(extensions[left.wallId][left.endpoint], leftExtension);
      extensions[right.wallId][right.endpoint] = Math.max(extensions[right.wallId][right.endpoint], rightExtension);
    }
  }
  return extensions;
}
export function wallSolidPieces(wall, openings, pixelsPerMeter, wallHeight) {
  const wallLength = wallLengthMeters(wall, pixelsPerMeter);
  const height = Math.max(Number(wallHeight) || 0, 0);
  if (wallLength <= 1e-7 || height <= 1e-7) {
    return [];
  }
  const openingBoxes = openings.filter(opening => opening.wallId === wall.id).map(item => {
    const width = clamp(Number(item.width) || 0, 0, wallLength);
    const centerAlong = clampWindowT(wall, item, pixelsPerMeter) * wallLength;
    const bottom = clamp(Number(item.sill) || 0, 0, height);
    const top = clamp(bottom + Math.max(Number(item.height) || 0, 0), bottom, height);
    return {
      start: clamp(centerAlong - width / 2, 0, wallLength),
      end: clamp(centerAlong + width / 2, 0, wallLength),
      bottom,
      top
    };
  }).filter(box => box.end - box.start > 1e-7 && box.top - box.bottom > 1e-7);
  const splits = [...new Set([0, wallLength, ...openingBoxes.flatMap(splitBox => [splitBox.start, splitBox.end])])].sort((a, b) => a - b);
  const pieces = [];
  for (let i = 0; i < splits.length - 1; i += 1) {
    const segStart = splits[i];
    const segEnd = splits[i + 1];
    if (segEnd - segStart <= 1e-7) {
      continue;
    }
    const mid = (segStart + segEnd) / 2;
    const verticalGaps = openingBoxes.filter(covering => mid > covering.start - 1e-7 && mid < covering.end + 1e-7).map(coveringBox => [coveringBox.bottom, coveringBox.top]).sort((ga, gb) => ga[0] - gb[0]);
    if (!verticalGaps.length) {
      pieces.push({
        start: segStart,
        end: segEnd,
        bottom: 0,
        top: height
      });
      continue;
    }
    const mergedGaps = [];
    for (const gap of verticalGaps) {
      const last = mergedGaps.at(-1);
      if (last && gap[0] <= last[1] + 1e-7) {
        last[1] = Math.max(last[1], gap[1]);
      } else {
        mergedGaps.push([...gap]);
      }
    }
    let cursor = 0;
    for (const [gapBottom, gapTop] of mergedGaps) {
      if (gapBottom - cursor > 1e-7) {
        pieces.push({
          start: segStart,
          end: segEnd,
          bottom: cursor,
          top: gapBottom
        });
      }
      cursor = Math.max(cursor, gapTop);
    }
    if (height - cursor > 1e-7) {
      pieces.push({
        start: segStart,
        end: segEnd,
        bottom: cursor,
        top: height
      });
    }
  }
  return pieces;
}
export function pointInRotatedRectangle(point, item, pixelsPerMeter) {
  const negRotation = -(Number(item.rotation) || 0) * Math.PI / 180;
  const dx = point.x - item.x;
  const dy = point.y - item.y;
  const localX = dx * Math.cos(negRotation) - dy * Math.sin(negRotation);
  const localY = dx * Math.sin(negRotation) + dy * Math.cos(negRotation);
  const halfWidth = Math.max(Number(item.width) || 0, 0) * pixelsPerMeter / 2;
  const halfDepth = Math.max(Number(item.depth) || 0, 0) * pixelsPerMeter / 2;
  return Math.abs(localX) <= halfWidth && Math.abs(localY) <= halfDepth;
}
export function resizeRotatedItemFromCorner(item, cornerSign, fixedCorner, pointer, pixelsPerMeter, uniformScale = false, scaleLimits = {}) {
  const ppm = Math.max(Number(pixelsPerMeter) || 0, 1e-7);
  const signX = cornerSign?.x < 0 ? -1 : 1;
  const signY = cornerSign?.y < 0 ? -1 : 1;
  const negRotation = -(Number(item.rotation) || 0) * Math.PI / 180;
  const dx = pointer.x - fixedCorner.x;
  const dy = pointer.y - fixedCorner.y;
  const localX = dx * Math.cos(negRotation) - dy * Math.sin(negRotation);
  const localY = dx * Math.sin(negRotation) + dy * Math.cos(negRotation);
  const rawWidth = signX * localX / ppm;
  const rawDepth = signY * localY / ppm;
  const baseWidth = Math.max(Number(item.width) || 0.1, 0.1);
  const baseDepth = Math.max(Number(item.depth) || 0.1, 0.1);
  const baseHeight = Number(item.height);
  let width = clamp(rawWidth, 0.1, 8);
  let depth = clamp(rawDepth, 0.1, 8);
  let scale = 1;
  if (uniformScale) {
    const minScale = Math.max(Number(scaleLimits.minimum) || 0, 1e-7);
    const maxScale = Math.max(Number(scaleLimits.maximum) || Number.POSITIVE_INFINITY, minScale);
    scale = clamp(Math.max(rawWidth / baseWidth, rawDepth / baseDepth), minScale, maxScale);
    width = baseWidth * scale;
    depth = baseDepth * scale;
  }
  const offsetX = signX * width * ppm / 2;
  const offsetY = signY * depth * ppm / 2;
  const rotation = (Number(item.rotation) || 0) * Math.PI / 180;
  const result = {
    x: fixedCorner.x + offsetX * Math.cos(rotation) - offsetY * Math.sin(rotation),
    y: fixedCorner.y + offsetX * Math.sin(rotation) + offsetY * Math.cos(rotation),
    width,
    depth
  };
  if (Number.isFinite(baseHeight) && baseHeight > 0) {
    result.height = uniformScale ? baseHeight * scale : baseHeight;
  }
  return result;
}
export function itemRotationFromPointers(baseRotation, center, startPointer, endPointer, snapDegrees = 0) {
  const startAngle = Math.atan2(startPointer.y - center.y, startPointer.x - center.x);
  const endAngle = Math.atan2(endPointer.y - center.y, endPointer.x - center.x);
  let rotation = (Number(baseRotation) || 0) + (endAngle - startAngle) * 180 / Math.PI;
  const step = Math.max(Number(snapDegrees) || 0, 0);
  if (step > 0) {
    rotation = Math.round(rotation / step) * step;
  }
  return (rotation % 360 + 360) % 360;
}
export function polygonArea(polygon) {
  let area = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    area += current.x * next.y - next.x * current.y;
  }
  return area / 2;
}
export function pointInPolygon(point, polygon, toleranceInput = 1e-7) {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    return false;
  }
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  let inside = false;
  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    if (projectPointToSegment(point, a, b).distance <= tolerance) {
      return true;
    }
    if (a.y > point.y == b.y > point.y) {
      continue;
    }
    if (a.x + (point.y - a.y) * (b.x - a.x) / (b.y - a.y) > point.x) {
      inside = !inside;
    }
  }
  return inside;
}
function cross2d(a, b) {
  return a.x * b.y - a.y * b.x;
}
function subtractPoints(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
function lerpPoint(start, end, t) {
  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t
  };
}
function pushParamIfInRange(cutParams, index, param, tolerance) {
  if (!(param < -tolerance) && !(param > 1 + tolerance)) {
    cutParams[index].push(clamp(param, 0, 1));
  }
}
function simplifyCollinearRing(ring, tolerance) {
  const points = ring.filter((point, index) => index === 0 || distance(point, ring[index - 1]) > tolerance);
  if (points.length > 1 && distance(points[0], points.at(-1)) <= tolerance) {
    points.pop();
  }
  if (points.length < 3) {
    return [];
  }
  let removed = true;
  while (removed && points.length >= 3) {
    removed = false;
    for (let i = 0; i < points.length; i += 1) {
      const prev = points[(i - 1 + points.length) % points.length];
      const curr = points[i];
      const next = points[(i + 1) % points.length];
      const incoming = subtractPoints(curr, prev);
      const outgoing = subtractPoints(next, curr);
      const scale = Math.max(Math.hypot(incoming.x, incoming.y) * Math.hypot(outgoing.x, outgoing.y), 1);
      if (!(Math.abs(cross2d(incoming, outgoing)) > tolerance * scale)) {
        points.splice(i, 1);
        removed = true;
        break;
      }
    }
  }
  return points;
}
export function unionPolygonLoops(loops, epsilonInput = 0.000001, holeLoops = []) {
  const epsilon = Math.max(Number(epsilonInput) || 0, 1e-7);
  const polygons = (loops || []).filter(rawLoop => Array.isArray(rawLoop) && rawLoop.length >= 3).map(loop => loop.map(vertex => ({
    x: Number(vertex.x) || 0,
    y: Number(vertex.y) || 0
  }))).filter(areaPolygon => Math.abs(polygonArea(areaPolygon)) > epsilon * epsilon);
  if (!polygons.length) {
    return [];
  }
  const holes = (holeLoops || []).filter(rawLoop => Array.isArray(rawLoop) && rawLoop.length >= 3 && rawLoop.every(vertex => Number.isFinite(vertex.x) && Number.isFinite(vertex.y)) && Math.abs(polygonArea(rawLoop)) > epsilon * epsilon).map(loop => loop.map(vertex => ({
    x: Number(vertex.x) || 0,
    y: Number(vertex.y) || 0
  })));
  const edges = [];
  for (const edgePolygon of [...polygons, ...holes]) {
    for (let vi = 0; vi < edgePolygon.length; vi += 1) {
      const start = edgePolygon[vi];
      const end = edgePolygon[(vi + 1) % edgePolygon.length];
      if (distance(start, end) > epsilon) {
        edges.push({
          start,
          end
        });
      }
    }
  }
  const cutParams = edges.map(() => [0, 1]);
  for (let i = 0; i < edges.length; i += 1) {
    const edgeA = edges[i];
    const dirA = subtractPoints(edgeA.end, edgeA.start);
    const lenSqA = dirA.x * dirA.x + dirA.y * dirA.y;
    for (let buildWallGraph = i + 1; buildWallGraph < edges.length; buildWallGraph += 1) {
      const edgeB = edges[buildWallGraph];
      const dirB = subtractPoints(edgeB.end, edgeB.start);
      const lenSqB = dirB.x * dirB.x + dirB.y * dirB.y;
      const originOffset = subtractPoints(edgeB.start, edgeA.start);
      const cross = cross2d(dirA, dirB);
      const crossTol = epsilon * Math.max(Math.sqrt(lenSqA * lenSqB), 1);
      if (Math.abs(cross) > crossTol) {
        const paramA = cross2d(originOffset, dirB) / cross;
        const paramB = cross2d(originOffset, dirA) / cross;
        if (paramA < -epsilon || paramA > 1 + epsilon || paramB < -epsilon || paramB > 1 + epsilon) {
          continue;
        }
        pushParamIfInRange(cutParams, i, paramA, epsilon);
        pushParamIfInRange(cutParams, buildWallGraph, paramB, epsilon);
        continue;
      }
      if (Math.abs(cross2d(originOffset, dirA)) > epsilon * Math.max(Math.sqrt(lenSqA), 1)) {
        continue;
      }
      const startParamOnA = (originOffset.x * dirA.x + originOffset.y * dirA.y) / lenSqA;
      const endOffset = subtractPoints(edgeB.end, edgeA.start);
      const endParamOnA = (endOffset.x * dirA.x + endOffset.y * dirA.y) / lenSqA;
      pushParamIfInRange(cutParams, i, startParamOnA, epsilon);
      pushParamIfInRange(cutParams, i, endParamOnA, epsilon);
      const startOffsetOnB = subtractPoints(edgeA.start, edgeB.start);
      const startParamOnB = (startOffsetOnB.x * dirB.x + startOffsetOnB.y * dirB.y) / lenSqB;
      const endOffsetOnB = subtractPoints(edgeA.end, edgeB.start);
      const endParamOnB = (endOffsetOnB.x * dirB.x + endOffsetOnB.y * dirB.y) / lenSqB;
      pushParamIfInRange(cutParams, buildWallGraph, startParamOnB, epsilon);
      pushParamIfInRange(cutParams, buildWallGraph, endParamOnB, epsilon);
    }
  }
  const isInsideAny = testPoint => polygons.some(testPolygon => pointInPolygon(testPoint, testPolygon, epsilon));
  const quantizeStep = epsilon * 8;
  const nodeMap = new Map();
  const quantizeNode = point => {
    const qx = Math.round(point.x / quantizeStep) * quantizeStep;
    const qy = Math.round(point.y / quantizeStep) * quantizeStep;
    const key = Math.round(qx / quantizeStep) + "," + Math.round(qy / quantizeStep);
    if (!nodeMap.has(key)) {
      nodeMap.set(key, {
        key,
        point: {
          x: qx,
          y: qy
        }
      });
    }
    return nodeMap.get(key);
  };
  const boundaryEdges = [];
  const seenEdges = new Set();
  edges.forEach((edge, edgeIndex) => {
    const params = [...cutParams[edgeIndex]].sort((pa, pb) => pa - pb).filter((param, paramIndex, allParams) => paramIndex === 0 || param - allParams[paramIndex - 1] > epsilon);
    for (let pieceIndex = 0; pieceIndex < params.length - 1; pieceIndex += 1) {
      const pieceStart = lerpPoint(edge.start, edge.end, params[pieceIndex]);
      const pieceEnd = lerpPoint(edge.start, edge.end, params[pieceIndex + 1]);
      const pieceLength = distance(pieceStart, pieceEnd);
      if (pieceLength <= epsilon) {
        continue;
      }
      const direction = {
        x: (pieceEnd.x - pieceStart.x) / pieceLength,
        y: (pieceEnd.y - pieceStart.y) / pieceLength
      };
      const midpoint = lerpPoint(pieceStart, pieceEnd, 0.5);
      const offsetDist = Math.min(pieceLength * 0.2, Math.max(epsilon * 32, 0.00001));
      const leftSample = {
        x: midpoint.x - direction.y * offsetDist,
        y: midpoint.y + direction.x * offsetDist
      };
      const rightSample = {
        x: midpoint.x + direction.y * offsetDist,
        y: midpoint.y - direction.x * offsetDist
      };
      const leftInside = isInsideAny(leftSample);
      const rightInside = isInsideAny(rightSample);
      if (leftInside === rightInside) {
        continue;
      }
      const fromNode = quantizeNode(leftInside ? pieceStart : pieceEnd);
      const toNode = quantizeNode(leftInside ? pieceEnd : pieceStart);
      if (fromNode.key === toNode.key) {
        continue;
      }
      const edgeKey = [fromNode.key, toNode.key].sort().join("|");
      if (!seenEdges.has(edgeKey)) {
        seenEdges.add(edgeKey);
        boundaryEdges.push({
          start: fromNode,
          end: toNode
        });
      }
    }
  });
  const adjacency = new Map();
  boundaryEdges.forEach((boundaryEdge, adjEdgeIndex) => {
    if (!adjacency.has(boundaryEdge.start.key)) {
      adjacency.set(boundaryEdge.start.key, []);
    }
    adjacency.get(boundaryEdge.start.key).push(adjEdgeIndex);
  });
  const unused = new Set(boundaryEdges.map((unusedEdge, unusedIndex) => unusedIndex));
  const resultLoops = [];
  while (unused.size) {
    const startEdgeIndex = unused.values().next().value;
    const startEdge = boundaryEdges[startEdgeIndex];
    const path = [startEdge.start.point];
    let currentEdgeIndex = startEdgeIndex;
    let closed = false;
    for (let step = 0; step <= boundaryEdges.length; step += 1) {
      const currentEdge = boundaryEdges[currentEdgeIndex];
      unused.delete(currentEdgeIndex);
      if (currentEdge.end.key === startEdge.start.key) {
        closed = true;
        break;
      }
      path.push(currentEdge.end.point);
      const nextCandidates = (adjacency.get(currentEdge.end.key) || []).filter(candidateIndex => unused.has(candidateIndex));
      if (!nextCandidates.length) {
        break;
      }
      if (nextCandidates.length === 1) {
        currentEdgeIndex = nextCandidates[0];
        continue;
      }
      const incoming = subtractPoints(currentEdge.end.point, currentEdge.start.point);
      currentEdgeIndex = nextCandidates.map(branchIndex => {
        const candidateEdge = boundaryEdges[branchIndex];
        const outgoing = subtractPoints(candidateEdge.end.point, candidateEdge.start.point);
        return {
          index: branchIndex,
          turn: Math.atan2(cross2d(incoming, outgoing), incoming.x * outgoing.x + incoming.y * outgoing.y)
        };
      }).sort((turnA, turnB) => turnB.turn - turnA.turn)[0].index;
    }
    if (!closed) {
      continue;
    }
    const simplified = simplifyCollinearRing(path, epsilon * 8);
    if (simplified.length >= 3 && Math.abs(polygonArea(simplified)) > epsilon * epsilon) {
      resultLoops.push(simplified);
    }
  }
  return resultLoops.sort((loopA, loopB) => Math.abs(polygonArea(loopB)) - Math.abs(polygonArea(loopA)));
}
export function subtractPolygonLoops(loops, holeLoops, epsilonInput = 0.000001) {
  return unionPolygonLoops(loops, epsilonInput, holeLoops);
}
export function validatedUnionPolygonLoops(loops, epsilonInput = 0.000001) {
  const epsilon = Math.max(Number(epsilonInput) || 0, 1e-7);
  const polygons = (loops || []).filter(rawLoop => Array.isArray(rawLoop) && rawLoop.length >= 3).filter(areaLoop => Math.abs(polygonArea(areaLoop)) > epsilon * epsilon);
  if (!polygons.length) {
    return [];
  }
  const unioned = unionPolygonLoops(polygons, epsilon);
  if (!unioned.length) {
    return [];
  }
  const inputArea = polygons.reduce((inputSum, inputPolygon) => inputSum + Math.abs(polygonArea(inputPolygon)), 0);
  const unionArea = unioned.reduce((unionSum, unionPolygon) => unionSum + polygonArea(unionPolygon), 0);
  const areaTolerance = Math.max(inputArea * 0.001, epsilon * epsilon * 1024);
  if (unionArea <= areaTolerance || unionArea > inputArea + areaTolerance) {
    return [];
  } else {
    return unioned;
  }
}
function buildWallGraph(walls, tolerance) {
  const nodes = [];
  const endpointWalls = [];
  const spatialIndex = new Map();
  const addNode = point => {
    const cellX = Math.floor(point.x / tolerance);
    const cellY = Math.floor(point.y / tolerance);
    let bestIndex = -1;
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        for (const nodeIndex of spatialIndex.get(cellX + dx + "," + (cellY + dy)) || []) {
          if ((bestIndex < 0 || nodeIndex < bestIndex) && distance(nodes[nodeIndex], point) <= tolerance) {
            bestIndex = nodeIndex;
          }
        }
      }
    }
    if (bestIndex >= 0) {
      return bestIndex;
    }
    const newIndex = nodes.length;
    nodes.push({
      x: point.x,
      y: point.y
    });
    endpointWalls.push([]);
    const cellKey = cellX + "," + cellY;
    if (!spatialIndex.has(cellKey)) {
      spatialIndex.set(cellKey, []);
    }
    spatialIndex.get(cellKey).push(newIndex);
    return newIndex;
  };
  const edgeKey = (a, b) => a < b ? a + "," + b : b + "," + a;
  const rawEdges = [];
  const seenEdgeKeys = new Set();
  for (const wall of walls || []) {
    if (![wall?.start?.x, wall?.start?.y, wall?.end?.x, wall?.end?.y].every(Number.isFinite)) {
      continue;
    }
    const startNode = addNode(wall.start);
    const endNode = addNode(wall.end);
    if (startNode === endNode) {
      continue;
    }
    endpointWalls[startNode].push(wall);
    endpointWalls[endNode].push(wall);
    const key = edgeKey(startNode, endNode);
    if (seenEdgeKeys.has(key)) {
      continue;
    }
    seenEdgeKeys.add(key);
    const startPoint = nodes[startNode];
    const endPoint = nodes[endNode];
    rawEdges.push({
      start: startNode,
      end: endNode,
      minX: Math.min(startPoint.x, endPoint.x),
      maxX: Math.max(startPoint.x, endPoint.x),
      minY: Math.min(startPoint.y, endPoint.y),
      maxY: Math.max(startPoint.y, endPoint.y),
      cuts: [{
        t: 0,
        node: startNode
      }, {
        t: 1,
        node: endNode
      }]
    });
  }
  const addCutFromNode = (edge, cutNodeIndex) => {
    if (cutNodeIndex === edge.start || cutNodeIndex === edge.end) {
      return;
    }
    const projection = projectPointToSegment(nodes[cutNodeIndex], nodes[edge.start], nodes[edge.end]);
    if (projection.t > 0 && projection.t < 1 && projection.distance <= tolerance) {
      edge.cuts.push({
        t: projection.t,
        node: cutNodeIndex
      });
    }
  };
  rawEdges.sort((sortA, sortB) => sortA.minX - sortB.minX);
  for (let i = 0; i < rawEdges.length; i += 1) {
    const edgeA = rawEdges[i];
    for (let buildWallGraph = i + 1; buildWallGraph < rawEdges.length; buildWallGraph += 1) {
      const edgeB = rawEdges[buildWallGraph];
      if (edgeB.minX > edgeA.maxX + tolerance) {
        break;
      }
      if (edgeB.minY > edgeA.maxY + tolerance || edgeB.maxY < edgeA.minY - tolerance) {
        continue;
      }
      addCutFromNode(edgeA, edgeB.start);
      addCutFromNode(edgeA, edgeB.end);
      addCutFromNode(edgeB, edgeA.start);
      addCutFromNode(edgeB, edgeA.end);
      const hit = segmentIntersection(nodes[edgeA.start], nodes[edgeA.end], nodes[edgeB.start], nodes[edgeB.end]);
      if (hit) {
        const hitNode = addNode(hit);
        addCutFromNode(edgeA, hitNode);
        addCutFromNode(edgeB, hitNode);
      }
    }
  }
  const splitEdges = [];
  const seenSplitKeys = new Set();
  for (const splitEdge of rawEdges) {
    splitEdge.cuts.sort((cutA, cutB) => cutA.t - cutB.t);
    let prevNode = splitEdge.cuts[0].node;
    for (const cut of splitEdge.cuts.slice(1)) {
      const nextNode = cut.node;
      const splitKey = edgeKey(prevNode, nextNode);
      if (prevNode !== nextNode && !seenSplitKeys.has(splitKey)) {
        seenSplitKeys.add(splitKey);
        splitEdges.push({
          start: prevNode,
          end: nextNode
        });
      }
      prevNode = nextNode;
    }
  }
  return {
    nodes,
    edges: splitEdges,
    endpointWalls
  };
}
function findClosedWallFaces(walls, tolerance) {
  const {
    nodes,
    edges
  } = buildWallGraph(walls, tolerance);
  const outgoing = Array.from({
    length: nodes.length
  }, () => []);
  const halfEdges = [];
  for (const edge of edges) {
    const halfIndex = halfEdges.length;
    halfEdges.push({
      start: edge.start,
      end: edge.end
    }, {
      start: edge.end,
      end: edge.start
    });
    outgoing[edge.start].push(halfIndex);
    outgoing[edge.end].push(halfIndex + 1);
  }
  const slotIndex = new Int32Array(halfEdges.length);
  outgoing.forEach((halfIndices, nodeIndex) => {
    const angleOf = angleHalf => Math.atan2(nodes[halfEdges[angleHalf].end].y - nodes[nodeIndex].y, nodes[halfEdges[angleHalf].end].x - nodes[nodeIndex].x);
    halfIndices.sort((ha, hb) => angleOf(ha) - angleOf(hb));
    halfIndices.forEach((slotHalf, slot) => {
      slotIndex[slotHalf] = slot;
    });
  });
  const nextHalf = halfEdges.map((halfEdge, nextHalfIndex) => {
    const atEnd = outgoing[halfEdge.end];
    return atEnd[(slotIndex[nextHalfIndex ^ 1] + atEnd.length - 1) % atEnd.length];
  });
  const visited = new Uint8Array(halfEdges.length);
  const faceMap = new Map();
  const registerFace = nodePath => {
    if (nodePath.length < 3) {
      return;
    }
    const points = nodePath.map(pathNode => nodes[pathNode]);
    const origin = points[0];
    const signedArea = polygonArea(points.map(areaPoint => subtractPoints(areaPoint, origin)));
    if (Math.abs(signedArea) <= tolerance * tolerance) {
      return;
    }
    const ordered = signedArea > 0 ? nodePath : [...nodePath].reverse();
    let minIndex = 0;
    for (let i = 1; i < ordered.length; i += 1) {
      if (ordered[i] < ordered[minIndex]) {
        minIndex = i;
      }
    }
    const canonicalKey = [...ordered.slice(minIndex), ...ordered.slice(0, minIndex)].join(",");
    const existing = faceMap.get(canonicalKey);
    if (existing) {
      existing.outer ||= signedArea < 0;
      return;
    }
    const simplified = simplifyCollinearRing(ordered.map(orderedNode => ({
      ...nodes[orderedNode]
    })), 1e-7);
    if (simplified.length >= 3) {
      faceMap.set(canonicalKey, {
        polygon: simplified,
        area: Math.abs(signedArea),
        outer: signedArea < 0
      });
    }
  };
  for (let startHalf = 0; startHalf < halfEdges.length; startHalf += 1) {
    if (visited[startHalf]) {
      continue;
    }
    const path = [];
    const pathIndex = new Map();
    let walkHalf = startHalf;
    const pushNode = pushNodeIndex => {
      const existingIndex = pathIndex.get(pushNodeIndex);
      if (existingIndex !== undefined) {
        for (registerFace(path.slice(existingIndex)); path.length > existingIndex + 1;) {
          pathIndex.delete(path.pop());
        }
      } else {
        pathIndex.set(pushNodeIndex, path.length);
        path.push(pushNodeIndex);
      }
    };
    while (!visited[walkHalf]) {
      visited[walkHalf] = 1;
      pushNode(halfEdges[walkHalf].start);
      walkHalf = nextHalf[walkHalf];
    }
    if (walkHalf === startHalf) {
      pushNode(halfEdges[startHalf].start);
    }
  }
  return [...faceMap.values()].sort((faceA, faceB) => faceB.area - faceA.area);
}
export function closedWallPolygons(walls, toleranceInput = 1) {
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  return findClosedWallFaces(walls, tolerance).map(face => face.polygon);
}
function findDegreeOneEndpoints(walls, toleranceInput = 1) {
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  const {
    nodes,
    edges,
    endpointWalls
  } = buildWallGraph(walls, tolerance);
  const degree = new Uint32Array(nodes.length);
  for (const edge of edges) {
    degree[edge.start] += 1;
    degree[edge.end] += 1;
  }
  return nodes.flatMap((point, nodeIndex) => degree[nodeIndex] === 1 ? [{
    point,
    walls: endpointWalls[nodeIndex]
  }] : []);
}
export function openWallEndpoints(walls, toleranceInput = 1) {
  return findDegreeOneEndpoints(walls, toleranceInput).map(endpoint => ({
    ...endpoint.point
  }));
}
function isStrictlyInsidePolygon(point, polygon, tolerance) {
  if (pointInPolygon(point, polygon, tolerance)) {
    return polygon.every((vertex, i) => projectPointToSegment(point, vertex, polygon[(i + 1) % polygon.length]).distance > tolerance);
  } else {
    return false;
  }
}
export function unclosedWallEndpoints(walls, toleranceInput = 1, floorPolygons = null) {
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  const polygons = Array.isArray(floorPolygons) ? floorPolygons : closedWallFloorPolygons(walls, tolerance);
  return findDegreeOneEndpoints(walls, tolerance).filter(endpoint => !endpoint.walls.length || endpoint.walls.some(wall => wall.allowOpenEnd !== true)).filter(openEndpoint => !polygons.some(polygon => isStrictlyInsidePolygon(openEndpoint.point, polygon, tolerance))).map(mappedEndpoint => ({
    ...mappedEndpoint.point
  }));
}
function isPolygonStrictlyInside(inner, outer, tolerance) {
  const areaTolSq = tolerance * tolerance;
  const areaFromOrigin = polygon => Math.abs(polygonArea(polygon.map(point => subtractPoints(point, polygon[0]))));
  if (areaFromOrigin(outer) <= areaFromOrigin(inner) + areaTolSq) {
    return false;
  } else {
    return inner.every((vertex, i) => {
      if (!pointInPolygon(vertex, outer, tolerance)) {
        return false;
      }
      const next = inner[(i + 1) % inner.length];
      const midpoint = {
        x: (vertex.x + next.x) / 2,
        y: (vertex.y + next.y) / 2
      };
      return pointInPolygon(midpoint, outer, tolerance);
    });
  }
}
export function closedWallFloorPolygons(walls, toleranceInput = 1) {
  const tolerance = Math.max(Number(toleranceInput) || 0, 1e-7);
  const floors = [];
  for (const {
    polygon,
    outer
  } of findClosedWallFaces(walls, tolerance)) {
    if (!!outer && !floors.some(existing => isPolygonStrictlyInside(polygon, existing, tolerance))) {
      floors.push(polygon);
    }
  }
  return floors;
}
export function modelBounds(model) {
  const points = [];
  if (model.background?.width && model.background?.height) {
    points.push({
      x: 0,
      y: 0
    }, {
      x: model.background.width,
      y: model.background.height
    });
  }
  for (const wall of model.walls || []) {
    points.push(wall.start, wall.end);
  }
  for (const item of model.items || []) {
    points.push({
      x: item.x,
      y: item.y
    });
  }
  if (!points.length) {
    return {
      minX: 0,
      minY: 0,
      maxX: 1200,
      maxY: 800,
      width: 1200,
      height: 800
    };
  }
  const minX = Math.min(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxX = Math.max(...points.map(p => p.x));
  const maxY = Math.max(...points.map(p => p.y));
  return {
    minX,
    minY,
    maxX: Math.max(maxX, minX + 1),
    maxY: Math.max(maxY, minY + 1),
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1)
  };
}
