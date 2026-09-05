const J = 1e-7;
export function clamp(value, value2, value3) {
  return Math.min(value3, Math.max(value2, value));
}
export function spotLightBrightnessResponse(value = "downlight", value2 = 0) {
  const value3 = clamp(Number(value2) || 0, 0, 1);
  const value4 = value3 * value3;
  if (value !== "ceilinglight" || value3 <= 0 || value3 >= 0.35) {
    return value4;
  }
  const value5 = value3 * 0.08 * (1 - value3 / 0.35);
  return value4 + value5;
}
export function stripLightProjection(value = 2.7, value2 = 3.5, value3 = 2) {
  const elevation = clamp(
    Number.isFinite(Number(value)) ? Number(value) : 2.7,
    0.05,
    6,
  );
  const value4 = clamp(
    Number.isFinite(Number(value2)) ? Number(value2) : 3.5,
    0.5,
    10,
  );
  const value5 = clamp(
    Number.isFinite(Number(value3)) ? Number(value3) : 2,
    0.2,
    8,
  );
  const value6 = clamp(elevation / 2.7, 0.2, 2.2);
  const value7 = clamp(value5 / 2, 0.1, 4);
  return {
    elevation: elevation,
    range:
      value4 *
      clamp(0.5 + value6 * 0.5, 0.6, 1.6) *
      clamp(0.82 + value7 * 0.18, 0.75, 1.5),
    coreScale: clamp(0.55 + value6 * 0.45, 0.65, 1.55),
    intensity: clamp(1 / value6, 0.5, 2.2),
  };
}
export function adaptiveLightRenderCost(value = []) {
  return value.reduce(
    (value2, value3) =>
      value3?.enabled === false ||
      Math.max(0, Number(value3?.brightness) || 0) <= 0
        ? value2
        : value3?.type === "striplight"
          ? value2 + 0.3
          : value3?.type === "ceilinglight"
            ? value2 + (Number(value3?.angle) >= 140 ? 1.65 : 1.1)
            : value3?.type === "downlight"
              ? value2 + 1
              : value2,
    0,
  );
}
export function adaptiveDeviceLightBudget({
  hardwareConcurrency: value = 4,
  deviceMemory: value2 = 8,
  previewPixels: value3 = 500000,
} = {}) {
  const value4 = clamp(Number(value) || 4, 2, 24);
  const value5 = clamp(Number(value2) || 8, 2, 32);
  const value6 = clamp(Number(value3) || 500000, 120000, 4000000);
  const value7 = 4.5 + Math.min(value4, 16) * 0.55;
  const value8 =
    value5 <= 4 ? 0.78 : value5 < 8 ? 0.88 : value5 >= 16 ? 1.1 : 1;
  const value9 = clamp(Math.sqrt(500000 / value6), 0.72, 1.2);
  return clamp(value7 * value8 * value9, 4, 16);
}
export function assessAdaptiveRenderFrames(value = []) {
  const value2 = value
    .map(Number)
    .filter(
      (value4) => Number.isFinite(value4) && value4 >= 8 && value4 <= 120,
    );
  if (value2.length < 12) {
    return {
      sufficient: false,
      sampleCount: value2.length,
    };
  }
  const value3 = [...value2].sort((value4, value5) => value4 - value5);
  const fn4 = (value4) =>
    value3[
      Math.min(Math.floor((value3.length - 1) * value4), value3.length - 1)
    ];
  const averageFrameMs =
    value2.reduce((value4, value5) => value4 + value5, 0) / value2.length;
  const p75FrameMs = fn4(0.75);
  const p90FrameMs = fn4(0.9);
  return {
    sufficient: true,
    sampleCount: value2.length,
    averageFrameMs: averageFrameMs,
    p75FrameMs: p75FrameMs,
    p90FrameMs: p90FrameMs,
    fps: 1000 / averageFrameMs,
    severe: averageFrameMs >= 45 || p75FrameMs >= 50 || p90FrameMs >= 68,
    slow: averageFrameMs >= 34 || p75FrameMs >= 38 || p90FrameMs >= 55,
    smooth: averageFrameMs <= 24 && p90FrameMs <= 32,
  };
}
export function planLabelProjectionMetrics(value, value2, value3 = 0.86) {
  const count = Math.max(0, Number(value) || 0);
  const count2 = Math.max(0, Number(value2) || 0);
  const value4 = clamp(
    Number.isFinite(Number(value3)) ? Number(value3) : 0.86,
    0.3,
    1,
  );
  return {
    titleStartX: -count * (0.5 - 115 / 2048),
    titleY: count2 * (130 / 640 - 0.5),
    titleFontSize: (count2 * 184) / 640,
    titleMaxWidth: (count * 1340) / 2048,
    iconX: count * (1580 / 2048 - 0.5),
    iconY: count2 * (130 / 640 - 0.5),
    iconSize: (count2 * 170) / 640,
    subtitleStartX: -count * (0.5 - 72 / 2048),
    subtitleY: count2 * (410 / 640 - 0.5),
    subtitleFontSize: (count2 * 310) / 640,
    subtitleMaxWidth: (count * 1880) / 2048,
    baselineY: count2 * (590 / 640 - 0.5),
    baselineStartX: -count * (0.5 - 74 / 2048),
    baselineLength: ((count * 1880) / 2048) * value4,
    baselineLineWidth: (count2 * 16) / 640,
    baselineCapHalfHeight: (count2 * 24) / 640,
  };
}
export function selectShadowCastingLightIds(value = [], value2 = 8) {
  const count = Math.max(0, Math.floor(Number(value2) || 0));
  if (count === 0) {
    return [];
  }
  const value3 = value
    .map((value6, index) => ({
      id: String(value6?.id || ""),
      groupId: String(value6?.groupId || ""),
      type: String(value6?.type || ""),
      brightness: Math.max(0, Number(value6?.brightness) || 0),
      enabled: value6?.enabled !== false,
      index: index,
    }))
    .filter(
      (value6) =>
        value6.id &&
        value6.enabled &&
        value6.brightness > 0 &&
        value6.type !== "striplight",
    )
    .map((value6) => ({
      ...value6,
      score: value6.brightness * (value6.type === "ceilinglight" ? 1.08 : 1),
    }));
  if (value3.length <= count) {
    return value3.map((value6) => value6.id);
  }
  const fn4 = (value6, value7) =>
    value7.score - value6.score || value6.index - value7.index;
  const index = new Map();
  for (const value6 of value3) {
    const value7 = value6.groupId || "__ungrouped-" + value6.index;
    const value8 = index.get(value7);
    if (!value8 || fn4(value6, value8) < 0) {
      index.set(value7, value6);
    }
  }
  const value5 = [...index.values()].sort(fn4).slice(0, count);
  if (value5.length < count) {
    const allowed = new Set(value5.map((value7) => value7.id));
    const value6 = value3.filter((value7) => !allowed.has(value7.id)).sort(fn4);
    value5.push(...value6.slice(0, count - value5.length));
  }
  return value5.map((value6) => value6.id);
}
export function spotShadowTextureUnitLimit({
  maxTextureUnits: value = 16,
  materialTextureUnits: value2 = 0,
  nonSpotShadowTextureUnits: value3 = 1,
  rectAreaLightTextureUnits: value4 = 0,
  reservedTextureUnits: value5 = 1,
  hardLimit: value6 = 8,
} = {}) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  const value7 = [value2, value3, value4, value5].reduce(
    (value9, value10) => value9 + Math.max(0, Math.floor(Number(value10) || 0)),
    0,
  );
  const count2 = Math.max(0, Math.floor(Number(value6) || 0));
  const value8 = count <= 16 ? 3 : count <= 24 ? 6 : count2;
  return Math.min(count2, value8, Math.max(0, count - value7));
}
export function localSpotShadowSettings(
  value = "downlight",
  value2 = 3.5,
  value3 = 90,
) {
  const range = clamp(
    Number.isFinite(Number(value2)) ? Number(value2) : 3.5,
    0.5,
    10,
  );
  const angle = clamp(
    Number.isFinite(Number(value3)) ? Number(value3) : 90,
    15,
    180,
  );
  const wideCeilingLight = value === "ceilinglight" && angle >= 140;
  return {
    mapSize: wideCeilingLight ? 512 : 256,
    radius: wideCeilingLight ? 1.25 : 1,
    blurSamples: wideCeilingLight ? 8 : 4,
    normalBias: 0.018,
    wideCeilingLight: wideCeilingLight,
    range: range,
    angle: angle,
  };
}
export function distance(value, value2) {
  return Math.hypot(value2.x - value.x, value2.y - value.y);
}
export function slidingDoorPanelCenters(value, value2 = -1, value3 = 2 / 3) {
  const fixed = (value2 >= 0 ? 1 : -1) * value * 0.23;
  const value4 = -fixed;
  return {
    fixed: fixed,
    moving: value4 + (fixed - value4) * clamp(value3, 0, 1),
  };
}
export function projectPointToSegment(value, value2, value3) {
  const value4 = value3.x - value2.x;
  const value5 = value3.y - value2.y;
  const value6 = value4 * value4 + value5 * value5;
  if (value6 <= 1e-7) {
    return {
      point: {
        ...value2,
      },
      t: 0,
      distance: distance(value, value2),
    };
  }
  const value7 = clamp(
    ((value.x - value2.x) * value4 + (value.y - value2.y) * value5) / value6,
    0,
    1,
  );
  const point = {
    x: value2.x + value4 * value7,
    y: value2.y + value5 * value7,
  };
  return {
    point: point,
    t: value7,
    distance: distance(value, point),
  };
}
export function segmentIntersection(value, value2, value3, value4) {
  const value5 = value2.x - value.x;
  const value6 = value2.y - value.y;
  const value7 = value4.x - value3.x;
  const value8 = value4.y - value3.y;
  const value9 = value5 * value8 - value6 * value7;
  if (Math.abs(value9) <= 1e-7) {
    return null;
  }
  const value10 = value3.x - value.x;
  const value11 = value3.y - value.y;
  const value12 = (value10 * value8 - value11 * value7) / value9;
  const value13 = (value10 * value6 - value11 * value5) / value9;
  if (
    value12 < -1e-7 ||
    value12 > 1.0000001 ||
    value13 < -1e-7 ||
    value13 > 1.0000001
  ) {
    return null;
  } else {
    return {
      x: value.x + value5 * clamp(value12, 0, 1),
      y: value.y + value6 * clamp(value12, 0, 1),
    };
  }
}
export function wallIntersections(value) {
  const value2 = [];
  for (let value3 = 0; value3 < value.length; value3 += 1) {
    for (let value4 = value3 + 1; value4 < value.length; value4 += 1) {
      const value5 = segmentIntersection(
        value[value3].start,
        value[value3].end,
        value[value4].start,
        value[value4].end,
      );
      if (
        !!value5 &&
        !value2.some((value6) => distance(value6, value5) <= 1e-7)
      ) {
        value2.push(value5);
      }
    }
  }
  return value2;
}
export function splitWallSegments(value, value2 = 0.000001) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = value.map(() => [0, 1]);
  for (let value5 = 0; value5 < value.length; value5 += 1) {
    for (let value6 = value5 + 1; value6 < value.length; value6 += 1) {
      const value7 = value[value5];
      const value8 = value[value6];
      const value9 = segmentIntersection(
        value7.start,
        value7.end,
        value8.start,
        value8.end,
      );
      if (!value9) {
        continue;
      }
      const value10 = projectPointToSegment(value9, value7.start, value7.end);
      const value11 = projectPointToSegment(value9, value8.start, value8.end);
      if (value10.t > count && value10.t < 1 - count) {
        value3[value5].push(value10.t);
      }
      if (value11.t > count && value11.t < 1 - count) {
        value3[value6].push(value11.t);
      }
    }
  }
  const value4 = [];
  value.forEach((sourceWall, sourceIndex) => {
    const value5 = sourceWall.end.x - sourceWall.start.x;
    const value6 = sourceWall.end.y - sourceWall.start.y;
    const value7 = [...value3[sourceIndex]]
      .sort((value8, value9) => value8 - value9)
      .filter(
        (value8, value9, value10) =>
          value9 === 0 || value8 - value10[value9 - 1] > count,
      );
    for (let pieceIndex = 0; pieceIndex < value7.length - 1; pieceIndex += 1) {
      const startT = value7[pieceIndex];
      const endT = value7[pieceIndex + 1];
      if (!(endT - startT <= count)) {
        value4.push({
          sourceWall: sourceWall,
          sourceIndex: sourceIndex,
          pieceIndex: pieceIndex,
          pieceCount: value7.length - 1,
          startT: startT,
          endT: endT,
          start: {
            x: sourceWall.start.x + value5 * startT,
            y: sourceWall.start.y + value6 * startT,
          },
          end: {
            x: sourceWall.start.x + value5 * endT,
            y: sourceWall.start.y + value6 * endT,
          },
        });
      }
    }
  });
  return value4;
}
export function uncoveredCollinearWallSegments(value, value2, value3 = 0.001) {
  if (!value?.start || !value?.end) {
    return [];
  }
  const count = Math.max(Number(value3) || 0, 1e-7);
  const value4 = value.end.x - value.start.x;
  const value5 = value.end.y - value.start.y;
  const value6 = Math.hypot(value4, value5);
  if (value6 <= count) {
    return [];
  }
  const value7 = {
    x: value4 / value6,
    y: value5 / value6,
  };
  const value8 = count / value6;
  const value9 = [];
  for (const value13 of value2 || []) {
    if (!value13?.start || !value13?.end || value13.id === value.id) {
      continue;
    }
    const value14 = value13.end.x - value13.start.x;
    const value15 = value13.end.y - value13.start.y;
    const value16 = Math.hypot(value14, value15);
    if (
      value16 <= count ||
      Math.abs(
        (value7.x * value15) / value16 - (value7.y * value14) / value16,
      ) > value8
    ) {
      continue;
    }
    const value17 = {
      x: value13.start.x - value.start.x,
      y: value13.start.y - value.start.y,
    };
    const value18 = {
      x: value13.end.x - value.start.x,
      y: value13.end.y - value.start.y,
    };
    const value19 = Math.abs(value17.x * value7.y - value17.y * value7.x);
    const value20 = Math.abs(value18.x * value7.y - value18.y * value7.x);
    if (Math.max(value19, value20) > count) {
      continue;
    }
    const value21 = (value17.x * value7.x + value17.y * value7.y) / value6;
    const value22 = (value18.x * value7.x + value18.y * value7.y) / value6;
    const value23 = clamp(Math.min(value21, value22), 0, 1);
    const value24 = clamp(Math.max(value21, value22), 0, 1);
    if (value24 - value23 > value8) {
      value9.push([value23, value24]);
    }
  }
  if (!value9.length) {
    return [
      {
        start: {
          ...value.start,
        },
        end: {
          ...value.end,
        },
      },
    ];
  }
  value9.sort((value13, value14) => value13[0] - value14[0]);
  const value10 = [];
  for (const value13 of value9) {
    const value14 = value10.at(-1);
    if (value14 && value13[0] <= value14[1] + value8) {
      value14[1] = Math.max(value14[1], value13[1]);
    } else {
      value10.push([...value13]);
    }
  }
  const value11 = [];
  let value12 = 0;
  for (const [value13, value14] of value10) {
    if (value13 - value12 > value8) {
      value11.push([value12, value13]);
    }
    value12 = Math.max(value12, value14);
  }
  if (1 - value12 > value8) {
    value11.push([value12, 1]);
  }
  return value11.map(([value13, value14]) => ({
    start: {
      x: value.start.x + value4 * value13,
      y: value.start.y + value5 * value13,
    },
    end: {
      x: value.start.x + value4 * value14,
      y: value.start.y + value5 * value14,
    },
  }));
}
export function canonicalPolygonKey(value, value2 = 5) {
  if (!Array.isArray(value) || !value.length) {
    return "";
  }
  const value3 = clamp(Math.round(Number(value2) || 0), 0, 12);
  const value4 = value.map((value6) => {
    const value7 =
      Math.abs(Number(value6?.x) || 0) < 10 ** -value3 / 2
        ? 0
        : Number(value6?.x) || 0;
    const value8 =
      Math.abs(Number(value6?.y) || 0) < 10 ** -value3 / 2
        ? 0
        : Number(value6?.y) || 0;
    return value7.toFixed(value3) + "," + value8.toFixed(value3);
  });
  const value5 = [];
  for (const value6 of [value4, [...value4].reverse()]) {
    for (let value7 = 0; value7 < value6.length; value7 += 1) {
      value5.push(
        [...value6.slice(value7), ...value6.slice(0, value7)].join(";"),
      );
    }
  }
  return value5.sort()[0];
}
function fn(value, value2, value3) {
  const value4 = [
    {
      firstKey: "start",
      secondKey: "start",
    },
    {
      firstKey: "start",
      secondKey: "end",
    },
    {
      firstKey: "end",
      secondKey: "start",
    },
    {
      firstKey: "end",
      secondKey: "end",
    },
  ].filter(
    ({ firstKey: value6, secondKey: value7 }) =>
      distance(value[value6], value2[value7]) <= value3,
  );
  if (value4.length !== 1) {
    return null;
  }
  const value5 = value4[0];
  return {
    point: {
      x: (value[value5.firstKey].x + value2[value5.secondKey].x) / 2,
      y: (value[value5.firstKey].y + value2[value5.secondKey].y) / 2,
    },
    firstKey: value5.firstKey,
    secondKey: value5.secondKey,
    firstOuter: value[value5.firstKey === "start" ? "end" : "start"],
    secondOuter: value2[value5.secondKey === "start" ? "end" : "start"],
  };
}
function $(value, value2, value3) {
  const value4 =
    value.opacity === null || value.opacity === undefined
      ? null
      : Number(value.opacity);
  const value5 =
    value2.opacity === null || value2.opacity === undefined
      ? null
      : Number(value2.opacity);
  const value6 =
    value4 === null || value5 === null
      ? value4 === value5
      : Math.abs(value4 - value5) <= value3;
  return (
    Math.abs((Number(value.height) || 0) - (Number(value2.height) || 0)) <=
      value3 &&
    Math.abs(
      (Number(value.thickness) || 0) - (Number(value2.thickness) || 0),
    ) <= value3 &&
    value6 &&
    (value.allowOpenEnd === true) == (value2.allowOpenEnd === true)
  );
}
function fn2(value, value2, value3) {
  return value.reduce(
    (value4, value5) =>
      value4 +
      (distance(value5.wall.start, value2) <= value3 ? 1 : 0) +
      (distance(value5.wall.end, value2) <= value3 ? 1 : 0),
    0,
  );
}
function B(value, value2) {
  const value3 = P(value.firstOuter, value.point);
  const value4 = P(value.secondOuter, value.point);
  const value5 = Math.hypot(value3.x, value3.y);
  const value6 = Math.hypot(value4.x, value4.y);
  if (value5 <= value2 || value6 <= value2) {
    return false;
  }
  const value7 = Math.abs(T(value3, value4));
  return (
    value3.x * value4.x + value3.y * value4.y < 0 &&
    value7 <= value2 * Math.max(value5, value6, 1)
  );
}
export function mergeCollinearWallSegments(value, value2 = 0.000001) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = (value || [])
    .filter(
      (value5) =>
        value5?.start &&
        value5?.end &&
        distance(value5.start, value5.end) > count,
    )
    .map((value5) => ({
      wall: {
        ...value5,
        start: {
          ...value5.start,
        },
        end: {
          ...value5.end,
        },
      },
      sourceIds: new Set([value5.id]),
    }));
  let value4 = true;
  while (value4) {
    value4 = false;
    for (let value5 = 0; value5 < value3.length && !value4; value5 += 1) {
      for (let value6 = value5 + 1; value6 < value3.length; value6 += 1) {
        const value7 = value3[value5];
        const value8 = value3[value6];
        if (!$(value7.wall, value8.wall, count)) {
          continue;
        }
        const value9 = fn(value7.wall, value8.wall, count);
        if (
          !value9 ||
          fn2(value3, value9.point, count) !== 2 ||
          !B(value9, count)
        ) {
          continue;
        }
        const wall = {
          ...value7.wall,
          start:
            value9.firstKey === "end"
              ? {
                  ...value9.firstOuter,
                }
              : {
                  ...value9.secondOuter,
                },
          end:
            value9.firstKey === "end"
              ? {
                  ...value9.secondOuter,
                }
              : {
                  ...value9.firstOuter,
                },
        };
        value3[value5] = {
          wall: wall,
          sourceIds: new Set([...value7.sourceIds, ...value8.sourceIds]),
        };
        value3.splice(value6, 1);
        value4 = true;
        break;
      }
    }
  }
  const wallIdMap = new Map();
  for (const value5 of value3) {
    for (const value6 of value5.sourceIds) {
      wallIdMap.set(value6, value5.wall.id);
    }
  }
  return {
    walls: value3.map((walls) => walls.wall),
    wallIdMap: wallIdMap,
  };
}
export function remapWallAttachment(value, value2, value3) {
  if (!value || !value2 || !value3) {
    return value;
  }
  const value4 = clamp(Number(value.t) || 0, 0, 1);
  const value5 = D(value2.start, value2.end, value4);
  return {
    ...value,
    wallId: value3.id,
    t: clamp(projectPointToSegment(value5, value3.start, value3.end).t, 0, 1),
  };
}
function X(value, value2, value3) {
  let value4 = null;
  for (const value5 of value2) {
    const distance2 = distance(value, value5.point);
    if (!(distance2 > value3) && (!value4 || !(distance2 >= value4.distance))) {
      value4 = {
        ...value5,
        distance: distance2,
      };
    }
  }
  return value4;
}
export function axisLockedPoint(value, value2) {
  const value3 = value.x - value2.x;
  const value4 = value.y - value2.y;
  if (Math.abs(value3) > Math.abs(value4)) {
    return {
      point: {
        x: value.x,
        y: value2.y,
      },
      axis: "horizontal",
      label: "水平轴",
    };
  } else {
    return {
      point: {
        x: value2.x,
        y: value.y,
      },
      axis: "vertical",
      label: "垂直轴",
    };
  }
}
function Y(value, value2, value3, value4, value5) {
  let value6 = null;
  for (const value7 of value3) {
    const value8 = value5 === "vertical" ? "x" : "y";
    const value9 = value5 === "vertical" ? "y" : "x";
    const value10 = value7.end[value8] - value7.start[value8];
    if (Math.abs(value10) <= 1e-7) {
      if (Math.abs(value7.start[value8] - value2[value8]) > 1e-7) {
        continue;
      }
      const value12 = projectPointToSegment(value, value7.start, value7.end);
      if (
        value12.distance > value4 ||
        (value6 && value12.distance >= value6.distance)
      ) {
        continue;
      }
      value6 = {
        point: {
          ...value12.point,
          [value8]: value2[value8],
        },
        kind: "segment",
        targetId: value7.id,
        label: (value5 === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: value12.distance,
      };
      continue;
    }
    const value11 = (value2[value8] - value7.start[value8]) / value10;
    if (value11 < -1e-7 || value11 > 1.0000001) {
      continue;
    }
    const point = {
      ...value2,
    };
    point[value9] =
      value7.start[value9] +
      (value7.end[value9] - value7.start[value9]) * clamp(value11, 0, 1);
    const distance2 = distance(value, point);
    if (!(distance2 > value4) && (!value6 || !(distance2 >= value6.distance))) {
      value6 = {
        point: point,
        kind: "segment",
        targetId: value7.id,
        label: (value5 === "vertical" ? "垂直" : "水平") + " · 墙线",
        distance: distance2,
      };
    }
  }
  return value6;
}
function H(value, value2, value3, value4) {
  if (!value2 || Math.abs(value.x - value2.x) > value4) {
    return null;
  }
  const value5 = Y(value, value2, value3, value4, "vertical");
  return (
    value5 || {
      point: {
        x: value2.x,
        y: value.y,
      },
      kind: "axis",
      label: "垂直轴",
      distance: Math.abs(value.x - value2.x),
    }
  );
}
function V(
  value,
  value2,
  value3,
  value4,
  value5 = wallIntersections(value3),
  value6 = {},
) {
  const value7 = axisLockedPoint(value, value2);
  const value8 = value7.axis === "vertical" ? "x" : "y";
  const count = Math.max(1e-7, value4 * 0.000001);
  const value9 = value7.axis === "vertical" ? "垂直" : "水平";
  const value10 = [
    ...(value6.snapEndpoints === false
      ? []
      : value3.flatMap((value12) => [
          {
            point: value12.start,
            kind: "endpoint",
            targetId: value12.id,
            label: value9 + " · 端点",
          },
          {
            point: value12.end,
            kind: "endpoint",
            targetId: value12.id,
            label: value9 + " · 端点",
          },
        ])),
    ...(value6.snapIntersections === false
      ? []
      : value5.map((point) => ({
          point: point,
          kind: "intersection",
          label: value9 + " · 交点",
        }))),
  ].filter(
    (value12) => Math.abs(value12.point[value8] - value2[value8]) <= count,
  );
  const value11 = X(value, value10, value4);
  if (value11) {
    return value11;
  }
  if (value6.snapSegments !== false) {
    const value12 = Y(value, value2, value3, value4, value7.axis);
    if (value12) {
      return value12;
    }
  }
  return {
    ...value7,
    kind: "axis",
    distance: distance(value, value7.point),
  };
}
export function snapPoint(value, value2, value3 = {}) {
  const count = Math.max(Number(value3.zoom) || 1, 1e-7);
  const value4 = (Number(value3.screenTolerance) || 12) / count;
  const list = Array.isArray(value3.intersections)
    ? value3.intersections
    : null;
  if (value3.forceOrthogonalAxis === true && value3.anchor) {
    const value8 =
      value3.snapIntersections === false
        ? []
        : list || wallIntersections(value2);
    return V(value, value3.anchor, value2, value4, value8, value3);
  }
  const value5 = [];
  if (value3.snapEndpoints !== false) {
    for (const value8 of value2) {
      value5.push(
        {
          point: value8.start,
          kind: "endpoint",
          targetId: value8.id,
          label: "端点",
        },
        {
          point: value8.end,
          kind: "endpoint",
          targetId: value8.id,
          label: "端点",
        },
      );
    }
  }
  const value6 = X(value, value5, value4);
  if (value6) {
    return value6;
  }
  if (value3.snapIntersections !== false) {
    const value8 = X(
      value,
      (list || wallIntersections(value2)).map((point) => ({
        point: point,
        kind: "intersection",
        label: "交点",
      })),
      value4,
    );
    if (value8) {
      return value8;
    }
  }
  if (
    value3.preferVerticalAxis === true &&
    value3.snapOrthogonal !== false &&
    value3.anchor
  ) {
    const value8 = H(value, value3.anchor, value2, value4);
    if (value8) {
      return value8;
    }
  }
  if (value3.snapSegments !== false) {
    const value8 = value2
      .map((value9) => {
        const value10 = projectPointToSegment(value, value9.start, value9.end);
        return {
          point: value10.point,
          kind: "segment",
          targetId: value9.id,
          label: "墙线",
          distance: value10.distance,
        };
      })
      .filter((value9) => value9.distance <= value4)
      .sort((value9, value10) => value9.distance - value10.distance)[0];
    if (value8) {
      return value8;
    }
  }
  if (value3.snapAngles !== false && value3.anchor) {
    const value8 = value.x - value3.anchor.x;
    const value9 = value.y - value3.anchor.y;
    const value10 = Math.hypot(value8, value9);
    if (value10 > 1e-7) {
      const value11 = ((Number(value3.angleStepDegrees) || 15) * Math.PI) / 180;
      const value12 = Math.atan2(value9, value8);
      const value13 = Math.round(value12 / value11) * value11;
      const point = {
        x: value3.anchor.x + Math.cos(value13) * value10,
        y: value3.anchor.y + Math.sin(value13) * value10,
      };
      const distance2 = distance(value, point);
      if (distance2 <= value4) {
        const value14 = ((value13 * 180) / Math.PI + 360) % 360;
        return {
          point: point,
          kind: "angle",
          label: Math.round(value14) + "°",
          distance: distance2,
        };
      }
    }
  }
  const value7 = Number(value3.gridSize) || 0;
  if (value3.snapGrid !== false && value7 > 1e-7) {
    const point = {
      x: Math.round(value.x / value7) * value7,
      y: Math.round(value.y / value7) * value7,
    };
    const distance2 = distance(value, point);
    if (distance2 <= value4) {
      return {
        point: point,
        kind: "grid",
        label: "网格",
        distance: distance2,
      };
    }
  }
  return {
    point: {
      ...value,
    },
    kind: null,
    label: "",
    distance: 0,
  };
}
export function nearestWall(value, value2, value3 = Infinity) {
  let value4 = null;
  for (const wall of value2) {
    const value5 = projectPointToSegment(value, wall.start, wall.end);
    if (
      !(value5.distance > value3) &&
      (!value4 || !(value5.distance >= value4.distance))
    ) {
      value4 = {
        wall: wall,
        ...value5,
      };
    }
  }
  return value4;
}
export function wallLengthMeters(value, value2) {
  return distance(value.start, value.end) / Math.max(Number(value2) || 1, 1e-7);
}
export function clampWindowT(value, value2, value3) {
  const value4 = wallLengthMeters(value, value3);
  if (value4 <= 1e-7) {
    return 0.5;
  }
  const value5 = Math.min(
    Math.max(Number(value2.width) || 0, 0) / 2,
    value4 / 2,
  );
  return clamp(Number(value2.t) || 0, value5 / value4, 1 - value5 / value4);
}
export function doorLeafRotation(value, value2 = Math.PI / 2) {
  return -(value?.swing === -1 ? -1 : 1) * value2;
}
export function wallJoinExtensions(value, value2 = 0.001, value3 = 4) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const count2 = Math.max(Number(value3) || 0, 1);
  const value4 = Object.fromEntries(
    (value || []).map((value7) => [
      value7.id,
      {
        start: 0,
        end: 0,
      },
    ]),
  );
  const value5 = [];
  const fn4 = (value7) => {
    let value8 = value5.find(
      (value9) => distance(value9.point, value7) <= count,
    );
    if (!value8) {
      value8 = {
        point: {
          ...value7,
        },
        incidents: [],
      };
      value5.push(value8);
    }
    return value8;
  };
  for (const value7 of value || []) {
    const value8 = value7.end.x - value7.start.x;
    const value9 = value7.end.y - value7.start.y;
    const value10 = Math.hypot(value8, value9);
    if (value10 <= count) {
      continue;
    }
    const halfThickness = Math.max(Number(value7.thickness) || 0, 0) / 2;
    fn4(value7.start).incidents.push({
      wallId: value7.id,
      endpoint: "start",
      x: value8 / value10,
      y: value9 / value10,
      halfThickness: halfThickness,
    });
    fn4(value7.end).incidents.push({
      wallId: value7.id,
      endpoint: "end",
      x: -value8 / value10,
      y: -value9 / value10,
      halfThickness: halfThickness,
    });
  }
  const value6 = 0.0001;
  for (const value7 of value5) {
    if (value7.incidents.length < 2) {
      continue;
    }
    const value8 = value7.incidents
      .map((value9) => ({
        ...value9,
        angle: Math.atan2(value9.y, value9.x),
      }))
      .sort((value9, value10) => value9.angle - value10.angle);
    for (let value9 = 0; value9 < value8.length; value9 += 1) {
      const value10 = value8[value9];
      const value11 = value8[(value9 + 1) % value8.length];
      const value12 =
        (value11.angle - value10.angle + Math.PI * 2) % (Math.PI * 2);
      if (value12 <= value6 || value12 >= Math.PI - value6) {
        continue;
      }
      const value13 = Math.sin(value12);
      const value14 = Math.cos(value12);
      if (value13 <= value6) {
        continue;
      }
      const value15 =
        Math.max(value10.halfThickness, value11.halfThickness, 0.000001) *
        count2;
      const value16 = clamp(
        (value11.halfThickness + value10.halfThickness * value14) / value13,
        0,
        value15,
      );
      const value17 = clamp(
        (value10.halfThickness + value11.halfThickness * value14) / value13,
        0,
        value15,
      );
      value4[value10.wallId][value10.endpoint] = Math.max(
        value4[value10.wallId][value10.endpoint],
        value16,
      );
      value4[value11.wallId][value11.endpoint] = Math.max(
        value4[value11.wallId][value11.endpoint],
        value17,
      );
    }
  }
  return value4;
}
export function wallSolidPieces(value, value2, value3, value4) {
  const value5 = wallLengthMeters(value, value3);
  const top = Math.max(Number(value4) || 0, 0);
  if (value5 <= 1e-7 || top <= 1e-7) {
    return [];
  }
  const value6 = value2
    .filter((value9) => value9.wallId === value.id)
    .map((value9) => {
      const value10 = clamp(Number(value9.width) || 0, 0, value5);
      const value11 = clampWindowT(value, value9, value3) * value5;
      const bottom = clamp(Number(value9.sill) || 0, 0, top);
      const top2 = clamp(
        bottom + Math.max(Number(value9.height) || 0, 0),
        bottom,
        top,
      );
      return {
        start: clamp(value11 - value10 / 2, 0, value5),
        end: clamp(value11 + value10 / 2, 0, value5),
        bottom: bottom,
        top: top2,
      };
    })
    .filter(
      (value9) =>
        value9.end - value9.start > 1e-7 && value9.top - value9.bottom > 1e-7,
    );
  const value7 = [
    ...new Set([
      0,
      value5,
      ...value6.flatMap((value9) => [value9.start, value9.end]),
    ]),
  ].sort((value9, value10) => value9 - value10);
  const value8 = [];
  for (let value9 = 0; value9 < value7.length - 1; value9 += 1) {
    const start = value7[value9];
    const end = value7[value9 + 1];
    if (end - start <= 1e-7) {
      continue;
    }
    const value10 = (start + end) / 2;
    const value11 = value6
      .filter(
        (value13) =>
          value10 > value13.start - 1e-7 && value10 < value13.end + 1e-7,
      )
      .map((value13) => [value13.bottom, value13.top])
      .sort((value13, value14) => value13[0] - value14[0]);
    if (!value11.length) {
      value8.push({
        start: start,
        end: end,
        bottom: 0,
        top: top,
      });
      continue;
    }
    const value12 = [];
    for (const value13 of value11) {
      const value14 = value12.at(-1);
      if (value14 && value13[0] <= value14[1] + 1e-7) {
        value14[1] = Math.max(value14[1], value13[1]);
      } else {
        value12.push([...value13]);
      }
    }
    let bottom = 0;
    for (const [top2, value13] of value12) {
      if (top2 - bottom > 1e-7) {
        value8.push({
          start: start,
          end: end,
          bottom: bottom,
          top: top2,
        });
      }
      bottom = Math.max(bottom, value13);
    }
    if (top - bottom > 1e-7) {
      value8.push({
        start: start,
        end: end,
        bottom: bottom,
        top: top,
      });
    }
  }
  return value8;
}
export function pointInRotatedRectangle(value, value2, value3) {
  const value4 = (-(Number(value2.rotation) || 0) * Math.PI) / 180;
  const value5 = value.x - value2.x;
  const value6 = value.y - value2.y;
  const value7 = value5 * Math.cos(value4) - value6 * Math.sin(value4);
  const value8 = value5 * Math.sin(value4) + value6 * Math.cos(value4);
  const value9 = (Math.max(Number(value2.width) || 0, 0) * value3) / 2;
  const value10 = (Math.max(Number(value2.depth) || 0, 0) * value3) / 2;
  return Math.abs(value7) <= value9 && Math.abs(value8) <= value10;
}
export function resizeRotatedItemFromCorner(
  value,
  value2,
  value3,
  value4,
  value5,
  value6 = false,
  value7 = {},
) {
  const count = Math.max(Number(value5) || 0, 1e-7);
  const value8 = value2?.x < 0 ? -1 : 1;
  const value9 = value2?.y < 0 ? -1 : 1;
  const value10 = (-(Number(value.rotation) || 0) * Math.PI) / 180;
  const value11 = value4.x - value3.x;
  const value12 = value4.y - value3.y;
  const value13 = value11 * Math.cos(value10) - value12 * Math.sin(value10);
  const value14 = value11 * Math.sin(value10) + value12 * Math.cos(value10);
  const value15 = (value8 * value13) / count;
  const value16 = (value9 * value14) / count;
  const count2 = Math.max(Number(value.width) || 0.1, 0.1);
  const count3 = Math.max(Number(value.depth) || 0.1, 0.1);
  const numeric = Number(value.height);
  let width = clamp(value15, 0.1, 8);
  let depth = clamp(value16, 0.1, 8);
  let value17 = 1;
  if (value6) {
    const count4 = Math.max(Number(value7.minimum) || 0, 1e-7);
    const count5 = Math.max(
      Number(value7.maximum) || Number.POSITIVE_INFINITY,
      count4,
    );
    value17 = clamp(
      Math.max(value15 / count2, value16 / count3),
      count4,
      count5,
    );
    width = count2 * value17;
    depth = count3 * value17;
  }
  const value18 = (value8 * width * count) / 2;
  const value19 = (value9 * depth * count) / 2;
  const value20 = ((Number(value.rotation) || 0) * Math.PI) / 180;
  const value21 = {
    x: value3.x + value18 * Math.cos(value20) - value19 * Math.sin(value20),
    y: value3.y + value18 * Math.sin(value20) + value19 * Math.cos(value20),
    width: width,
    depth: depth,
  };
  if (Number.isFinite(numeric) && numeric > 0) {
    value21.height = value6 ? numeric * value17 : numeric;
  }
  return value21;
}
export function itemRotationFromPointers(
  value,
  value2,
  value3,
  value4,
  value5 = 0,
) {
  const value6 = Math.atan2(value3.y - value2.y, value3.x - value2.x);
  const value7 = Math.atan2(value4.y - value2.y, value4.x - value2.x);
  let value8 = (Number(value) || 0) + ((value7 - value6) * 180) / Math.PI;
  const count = Math.max(Number(value5) || 0, 0);
  if (count > 0) {
    value8 = Math.round(value8 / count) * count;
  }
  return ((value8 % 360) + 360) % 360;
}
export function polygonArea(value) {
  let value2 = 0;
  for (let value3 = 0; value3 < value.length; value3 += 1) {
    const value4 = value[value3];
    const value5 = value[(value3 + 1) % value.length];
    value2 += value4.x * value5.y - value5.x * value4.y;
  }
  return value2 / 2;
}
export function pointInPolygon(value, value2, value3 = 1e-7) {
  if (!Array.isArray(value2) || value2.length < 3) {
    return false;
  }
  const count = Math.max(Number(value3) || 0, 1e-7);
  let value4 = false;
  for (let value5 = 0; value5 < value2.length; value5 += 1) {
    const value6 = value2[value5];
    const value7 = value2[(value5 + 1) % value2.length];
    if (projectPointToSegment(value, value6, value7).distance <= count) {
      return true;
    }
    if (value6.y > value.y == value7.y > value.y) {
      continue;
    }
    if (
      value6.x +
        ((value.y - value6.y) * (value7.x - value6.x)) / (value7.y - value6.y) >
      value.x
    ) {
      value4 = !value4;
    }
  }
  return value4;
}
function T(value, value2) {
  return value.x * value2.y - value.y * value2.x;
}
function P(value, value2) {
  return {
    x: value.x - value2.x,
    y: value.y - value2.y,
  };
}
function D(value, value2, value3) {
  return {
    x: value.x + (value2.x - value.x) * value3,
    y: value.y + (value2.y - value.y) * value3,
  };
}
function K(value, value2, value3, value4) {
  if (!(value3 < -value4) && !(value3 > 1 + value4)) {
    value[value2].push(clamp(value3, 0, 1));
  }
}
function _(value, value2) {
  const value3 = value.filter(
    (value5, value6) =>
      value6 === 0 || distance(value5, value[value6 - 1]) > value2,
  );
  if (value3.length > 1 && distance(value3[0], value3.at(-1)) <= value2) {
    value3.pop();
  }
  if (value3.length < 3) {
    return [];
  }
  let value4 = true;
  while (value4 && value3.length >= 3) {
    value4 = false;
    for (let value5 = 0; value5 < value3.length; value5 += 1) {
      const value6 = value3[(value5 - 1 + value3.length) % value3.length];
      const value7 = value3[value5];
      const value8 = value3[(value5 + 1) % value3.length];
      const value9 = P(value7, value6);
      const value10 = P(value8, value7);
      const count = Math.max(
        Math.hypot(value9.x, value9.y) * Math.hypot(value10.x, value10.y),
        1,
      );
      if (!(Math.abs(T(value9, value10)) > value2 * count)) {
        value3.splice(value5, 1);
        value4 = true;
        break;
      }
    }
  }
  return value3;
}
export function unionPolygonLoops(value, value2 = 0.000001) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = (value || [])
    .filter((value11) => Array.isArray(value11) && value11.length >= 3)
    .map((value11) =>
      value11.map((value12) => ({
        x: Number(value12.x) || 0,
        y: Number(value12.y) || 0,
      })),
    )
    .filter((value11) => Math.abs(polygonArea(value11)) > count * count);
  if (!value3.length) {
    return [];
  }
  const value4 = [];
  for (const value11 of value3) {
    for (let value12 = 0; value12 < value11.length; value12 += 1) {
      const start = value11[value12];
      const end = value11[(value12 + 1) % value11.length];
      if (distance(start, end) > count) {
        value4.push({
          start: start,
          end: end,
        });
      }
    }
  }
  const value5 = value4.map(() => [0, 1]);
  for (let value11 = 0; value11 < value4.length; value11 += 1) {
    const value12 = value4[value11];
    const value13 = P(value12.end, value12.start);
    const value14 = value13.x * value13.x + value13.y * value13.y;
    for (let value15 = value11 + 1; value15 < value4.length; value15 += 1) {
      const value16 = value4[value15];
      const value17 = P(value16.end, value16.start);
      const value18 = value17.x * value17.x + value17.y * value17.y;
      const value19 = P(value16.start, value12.start);
      const value20 = T(value13, value17);
      const value21 = count * Math.max(Math.sqrt(value14 * value18), 1);
      if (Math.abs(value20) > value21) {
        const value29 = T(value19, value17) / value20;
        const value30 = T(value19, value13) / value20;
        if (
          value29 < -count ||
          value29 > 1 + count ||
          value30 < -count ||
          value30 > 1 + count
        ) {
          continue;
        }
        K(value5, value11, value29, count);
        K(value5, value15, value30, count);
        continue;
      }
      if (
        Math.abs(T(value19, value13)) >
        count * Math.max(Math.sqrt(value14), 1)
      ) {
        continue;
      }
      const value22 = (value19.x * value13.x + value19.y * value13.y) / value14;
      const value23 = P(value16.end, value12.start);
      const value24 = (value23.x * value13.x + value23.y * value13.y) / value14;
      K(value5, value11, value22, count);
      K(value5, value11, value24, count);
      const value25 = P(value12.start, value16.start);
      const value26 = (value25.x * value17.x + value25.y * value17.y) / value18;
      const value27 = P(value12.end, value16.start);
      const value28 = (value27.x * value17.x + value27.y * value17.y) / value18;
      K(value5, value15, value26, count);
      K(value5, value15, value28, count);
    }
  }
  const fn4 = (value11) =>
    value3.some((value12) => pointInPolygon(value11, value12, count));
  const value6 = count * 8;
  const index = new Map();
  const fn5 = (value11) => {
    const value12 = Math.round(value11.x / value6) * value6;
    const value13 = Math.round(value11.y / value6) * value6;
    const key =
      Math.round(value12 / value6) + "," + Math.round(value13 / value6);
    if (!index.has(key)) {
      index.set(key, {
        key: key,
        point: {
          x: value12,
          y: value13,
        },
      });
    }
    return index.get(key);
  };
  const value8 = [];
  const allowed = new Set();
  value4.forEach((value11, value12) => {
    const value13 = [...value5[value12]]
      .sort((value14, value15) => value14 - value15)
      .filter(
        (value14, value15, value16) =>
          value15 === 0 || value14 - value16[value15 - 1] > count,
      );
    for (let value14 = 0; value14 < value13.length - 1; value14 += 1) {
      const value15 = D(value11.start, value11.end, value13[value14]);
      const value16 = D(value11.start, value11.end, value13[value14 + 1]);
      const value17 = distance(value15, value16);
      if (value17 <= count) {
        continue;
      }
      const value18 = {
        x: (value16.x - value15.x) / value17,
        y: (value16.y - value15.y) / value17,
      };
      const value19 = D(value15, value16, 0.5);
      const value20 = Math.min(value17 * 0.2, Math.max(count * 32, 0.00001));
      const value21 = {
        x: value19.x - value18.y * value20,
        y: value19.y + value18.x * value20,
      };
      const value22 = {
        x: value19.x + value18.y * value20,
        y: value19.y - value18.x * value20,
      };
      const value23 = fn4(value21);
      const value24 = fn4(value22);
      if (value23 === value24) {
        continue;
      }
      const start = fn5(value23 ? value15 : value16);
      const end = fn5(value23 ? value16 : value15);
      if (start.key === end.key) {
        continue;
      }
      const value25 = [start.key, end.key].sort().join("|");
      if (!allowed.has(value25)) {
        allowed.add(value25);
        value8.push({
          start: start,
          end: end,
        });
      }
    }
  });
  const index2 = new Map();
  value8.forEach((value11, value12) => {
    if (!index2.has(value11.start.key)) {
      index2.set(value11.start.key, []);
    }
    index2.get(value11.start.key).push(value12);
  });
  const allowed2 = new Set(value8.map((_2, value11) => value11));
  const value10 = [];
  while (allowed2.size) {
    const value11 = allowed2.values().next().value;
    const value12 = value8[value11];
    const value13 = [value12.start.point];
    let value14 = value11;
    let value15 = false;
    for (let value17 = 0; value17 <= value8.length; value17 += 1) {
      const value18 = value8[value14];
      allowed2.delete(value14);
      if (value18.end.key === value12.start.key) {
        value15 = true;
        break;
      }
      value13.push(value18.end.point);
      const value19 = (index2.get(value18.end.key) || []).filter((value21) =>
        allowed2.has(value21),
      );
      if (!value19.length) {
        break;
      }
      if (value19.length === 1) {
        value14 = value19[0];
        continue;
      }
      const value20 = P(value18.end.point, value18.start.point);
      value14 = value19
        .map((index) => {
          const value21 = value8[index];
          const value22 = P(value21.end.point, value21.start.point);
          return {
            index: index,
            turn: Math.atan2(
              T(value20, value22),
              value20.x * value22.x + value20.y * value22.y,
            ),
          };
        })
        .sort((value21, value22) => value22.turn - value21.turn)[0].index;
    }
    if (!value15) {
      continue;
    }
    const value16 = _(value13, count * 8);
    if (value16.length >= 3 && Math.abs(polygonArea(value16)) > count * count) {
      value10.push(value16);
    }
  }
  return value10.sort(
    (value11, value12) =>
      Math.abs(polygonArea(value12)) - Math.abs(polygonArea(value11)),
  );
}
export function validatedUnionPolygonLoops(value, value2 = 0.000001) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = (value || [])
    .filter((value7) => Array.isArray(value7) && value7.length >= 3)
    .filter((value7) => Math.abs(polygonArea(value7)) > count * count);
  if (!value3.length) {
    return [];
  }
  const value4 = unionPolygonLoops(value3, count);
  if (!value4.length) {
    return [];
  }
  const value5 = value3.reduce(
    (value7, value8) => value7 + Math.abs(polygonArea(value8)),
    0,
  );
  const value6 = value4.reduce(
    (value7, value8) => value7 + polygonArea(value8),
    0,
  );
  const count2 = Math.max(value5 * 0.001, count * count * 1024);
  if (value6 <= count2 || value6 > value5 + count2) {
    return [];
  } else {
    return value4;
  }
}
export function closedWallPolygons(value, value2 = 1) {
  const value3 = [];
  const fn4 = (value9) => {
    const value10 = value3.findIndex(
      (value11) => distance(value11, value9) <= value2,
    );
    if (value10 >= 0) {
      return value10;
    } else {
      value3.push({
        ...value9,
      });
      return value3.length - 1;
    }
  };
  const value4 = [];
  for (const value9 of value) {
    const start = fn4(value9.start);
    const end = fn4(value9.end);
    if (start !== end) {
      value4.push({
        start: start,
        end: end,
      });
    }
  }
  const value5 = Array.from(
    {
      length: value3.length,
    },
    () => [],
  );
  value4.forEach((value9, value10) => {
    value5[value9.start].push(value10);
    value5[value9.end].push(value10);
  });
  const value6 = [];
  const allowed = new Set();
  const value7 = 512;
  const value8 = Math.min(value4.length, 120);
  const fn5 = (value9, value10, value11, value12) => {
    if (!(value6.length >= value7) && !(value11.length > value8)) {
      for (const value13 of value5[value10]) {
        if (value12.has(value13)) {
          continue;
        }
        const value14 = value4[value13];
        const value15 = value14.start === value10 ? value14.end : value14.start;
        if (value15 === value9) {
          if (value11.length < 3) {
            continue;
          }
          const value16 = [...value12, value13]
            .sort((value19, value20) => value19 - value20)
            .join(",");
          if (allowed.has(value16)) {
            continue;
          }
          const value17 = value11.map((value19) => ({
            ...value3[value19],
          }));
          const value18 = polygonArea(value17);
          if (Math.abs(value18) <= value2 * value2) {
            continue;
          }
          allowed.add(value16);
          value6.push(value18 < 0 ? value17.reverse() : value17);
          continue;
        }
        if (value11.includes(value15)) {
          continue;
        }
        const allowed2 = new Set(value12);
        allowed2.add(value13);
        fn5(value9, value15, [...value11, value15], allowed2);
      }
    }
  };
  for (
    let value9 = 0;
    value9 < value3.length && value6.length < value7;
    value9 += 1
  ) {
    fn5(value9, value9, [value9], new Set());
  }
  return value6.sort(
    (value9, value10) =>
      Math.abs(polygonArea(value10)) - Math.abs(polygonArea(value9)),
  );
}
function fn3(value, value2 = 1) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = [];
  const fn4 = (value4, value5) => {
    let value6 = value3.find(
      (value7) => distance(value7.point, value4) <= count,
    );
    if (!value6) {
      value6 = {
        point: {
          ...value4,
        },
        walls: [],
      };
      value3.push(value6);
    }
    value6.walls.push(value5);
    return value6;
  };
  for (const value4 of value || []) {
    if (
      !!value4?.start &&
      !!value4?.end &&
      !(distance(value4.start, value4.end) <= count)
    ) {
      fn4(value4.start, value4);
      fn4(value4.end, value4);
    }
  }
  return value3.filter((value4) => value4.walls.length === 1);
}
export function openWallEndpoints(value, value2 = 1) {
  return fn3(value, value2).map((value3) => ({
    ...value3.point,
  }));
}
function G(value, value2, value3) {
  if (pointInPolygon(value, value2, value3)) {
    return value2.every(
      (value4, value5) =>
        projectPointToSegment(
          value,
          value4,
          value2[(value5 + 1) % value2.length],
        ).distance > value3,
    );
  } else {
    return false;
  }
}
export function unclosedWallEndpoints(value, value2 = 1, value3 = null) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const list = Array.isArray(value3)
    ? value3
    : closedWallFloorPolygons(value, count);
  return fn3(value, count)
    .filter((value4) => value4.walls[0]?.allowOpenEnd !== true)
    .filter((value4) => !list.some((value5) => G(value4.point, value5, count)))
    .map((value4) => ({
      ...value4.point,
    }));
}
function U(value, value2, value3) {
  const value4 = value3 * value3;
  if (Math.abs(polygonArea(value2)) <= Math.abs(polygonArea(value)) + value4) {
    return false;
  } else {
    return value.every((value5, value6) => {
      if (!pointInPolygon(value5, value2, value3)) {
        return false;
      }
      const value7 = value[(value6 + 1) % value.length];
      const value8 = {
        x: (value5.x + value7.x) / 2,
        y: (value5.y + value7.y) / 2,
      };
      return pointInPolygon(value8, value2, value3);
    });
  }
}
export function closedWallFloorPolygons(value, value2 = 1) {
  const count = Math.max(Number(value2) || 0, 1e-7);
  const value3 = (value || []).filter(
    (value7) => distance(value7.start, value7.end) > count,
  );
  if (!value3.length) {
    return [];
  }
  const value4 = [];
  const fn4 = (value7) => {
    const value8 = value4.findIndex(
      (value9) => distance(value9.point, value7) <= count,
    );
    if (value8 >= 0) {
      return value8;
    } else {
      value4.push({
        point: {
          ...value7,
        },
        wallIndexes: [],
      });
      return value4.length - 1;
    }
  };
  const value5 = value3.map((value7, value8) => {
    const value9 = fn4(value7.start);
    const value10 = fn4(value7.end);
    value4[value9].wallIndexes.push(value8);
    value4[value10].wallIndexes.push(value8);
    return [value9, value10];
  });
  const allowed = new Set();
  const value6 = [];
  for (let value7 = 0; value7 < value3.length; value7 += 1) {
    if (allowed.has(value7)) {
      continue;
    }
    const value8 = [];
    const value9 = [value7];
    for (allowed.add(value7); value9.length;) {
      const value12 = value9.pop();
      value8.push(value12);
      for (const value13 of value5[value12]) {
        for (const value14 of value4[value13].wallIndexes) {
          if (!allowed.has(value14)) {
            allowed.add(value14);
            value9.push(value14);
          }
        }
      }
    }
    const value10 = closedWallPolygons(
      value8.map((value12) => value3[value12]),
      count,
    );
    const value11 = [];
    for (const value12 of value10) {
      if (!value11.some((value13) => U(value12, value13, count))) {
        value11.push(value12);
      }
    }
    value6.push(...value11);
  }
  return unionPolygonLoops(value6, 0.000001)
    .filter((value7) => polygonArea(value7) > count * count)
    .sort(
      (value7, value8) =>
        Math.abs(polygonArea(value8)) - Math.abs(polygonArea(value7)),
    );
}
export function modelBounds(value) {
  const value2 = [];
  if (value.background?.width && value.background?.height) {
    value2.push(
      {
        x: 0,
        y: 0,
      },
      {
        x: value.background.width,
        y: value.background.height,
      },
    );
  }
  for (const value3 of value.walls || []) {
    value2.push(value3.start, value3.end);
  }
  for (const value3 of value.items || []) {
    value2.push({
      x: value3.x,
      y: value3.y,
    });
  }
  if (!value2.length) {
    return {
      minX: 0,
      minY: 0,
      maxX: 1200,
      maxY: 800,
      width: 1200,
      height: 800,
    };
  }
  const minX = Math.min(...value2.map((value3) => value3.x));
  const minY = Math.min(...value2.map((value3) => value3.y));
  const count = Math.max(...value2.map((value3) => value3.x));
  const count2 = Math.max(...value2.map((value3) => value3.y));
  return {
    minX: minX,
    minY: minY,
    maxX: Math.max(count, minX + 1),
    maxY: Math.max(count2, minY + 1),
    width: Math.max(count - minX, 1),
    height: Math.max(count2 - minY, 1),
  };
}
