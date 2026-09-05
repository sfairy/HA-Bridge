function fn(value) {
  return value?.newState || value || null;
}
function M(value = {}) {
  return (
    (value.entityId || "") +
    " " +
    (value.name || "") +
    " " +
    (value.originalName || "") +
    " " +
    (value.translationKey || "")
  ).trim();
}
function fn2(value, value2 = "s") {
  const value3 = fn(value) || {};
  const numeric = Number(value3.state);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return null;
  }
  const value4 = String(value3.attributes?.unit_of_measurement || value2)
    .trim()
    .toLowerCase();
  if (["min", "minute", "minutes", "分钟"].includes(value4)) {
    return numeric * 60;
  } else if (["h", "hr", "hour", "hours", "小时"].includes(value4)) {
    return numeric * 3600;
  } else {
    return numeric;
  }
}
function fn3(value, value2) {
  const value3 = value?.get?.(value2);
  if (!value3?.deviceId) {
    return {
      timeout: null,
      noMotion: null,
    };
  }
  const value4 = [...value.values()].filter(
    (value5) =>
      value5.deviceId === value3.deviceId &&
      value5.domain === "sensor" &&
      value5.status !== "missing" &&
      !value5.disabledBy,
  );
  const timeout =
    value4.find((value5) =>
      /custom[_ -]?no[_ -]?motion[_ -]?time|no[_ -]?motion[_ -]?timeout|自定义超时无人移动时间/i.test(
        M(value5),
      ),
    ) || null;
  const noMotion =
    value4.find((value5) =>
      /no[_ -]?motion[_ -]?duration|无移动状态持续时间/i.test(M(value5)),
    ) || null;
  return {
    timeout: timeout,
    noMotion: noMotion,
  };
}
export function presenceMotionEventConfig(
  entityId,
  value = null,
  value2 = new Map(),
  value3 = new Map(),
  value4 = {},
) {
  const value5 = value2?.get?.(entityId) || {};
  const value6 = fn(value) || {};
  const value7 =
    M({
      ...value5,
      entityId: entityId,
    }) +
    " " +
    (value6.attributes?.device_class || "") +
    " " +
    (value6.attributes?.event_type || "");
  if (
    !String(entityId || "").startsWith("event.") ||
    !/motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(value7)
  ) {
    return {
      entityId: entityId,
      motionEvent: false,
      motionTimeoutSeconds: null,
      noMotionSeconds: null,
      noMotionStateTimestamp: null,
      companionEntityIds: [],
    };
  }
  const value8 = fn3(value2, entityId);
  const numeric = Number(value4.motionTimeoutSeconds);
  const value9 = value8.timeout?.entityId
    ? value3?.get?.(value8.timeout.entityId)
    : null;
  const value10 = fn2(value9, "min");
  const motionTimeoutSeconds = Math.max(
    1,
    Math.min(
      3600,
      Number.isFinite(value10) && value10 > 0
        ? value10
        : Number.isFinite(numeric) && numeric > 0
          ? numeric
          : 60,
    ),
  );
  const value11 = value8.noMotion?.entityId
    ? value3?.get?.(value8.noMotion.entityId)
    : null;
  return {
    entityId: entityId,
    motionEvent: true,
    motionTimeoutSeconds: motionTimeoutSeconds,
    noMotionSeconds: fn2(value11),
    noMotionStateTimestamp: presenceStateTimestamp(value11),
    companionEntityIds: [
      value8.timeout?.entityId,
      value8.noMotion?.entityId,
    ].filter(Boolean),
  };
}
export function presenceSensorPresentation(
  value,
  value2 = "auto",
  value3 = {},
) {
  if (value2 === "on") {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true,
    };
  }
  if (value2 === "off") {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true,
    };
  }
  const value4 = fn(value);
  if (!value4) {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false,
    };
  }
  const value5 = String(value4.state ?? "")
    .trim()
    .toLowerCase();
  if (value5 === "unavailable") {
    return {
      key: "unavailable",
      label: "离线",
      active: false,
      available: false,
    };
  }
  if (
    !value5 ||
    value5 === "unknown" ||
    value5 === "none" ||
    value5 === "null"
  ) {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false,
    };
  }
  if (
    value3.motionEvent ||
    String(value3.entityId || "").startsWith("event.")
  ) {
    const value6 = String(value4.attributes?.event_type || "")
      .trim()
      .toLowerCase();
    if (
      /no[_ -]?motion|motion[_ -]?(?:clear|ended)|clear|inactive|vacant|absent|not[_ -]?detected|无人|无移动|未检测到(?:移动|人体)/i.test(
        value6,
      )
    ) {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true,
      };
    }
    const value7 = presenceStateTimestamp(value4);
    const value8 = Number.isFinite(Number(value3.now))
      ? Number(value3.now)
      : Date.now();
    const count = Math.max(1, Number(value3.motionTimeoutSeconds) || 60);
    const value9 = Number.isFinite(value7) ? value8 - value7 : null;
    const numeric2 = Number(value3.noMotionSeconds);
    const numeric3 = Number(value3.noMotionStateTimestamp);
    const value10 =
      Number.isFinite(numeric2) &&
      (!Number.isFinite(value7) ||
        !Number.isFinite(numeric3) ||
        numeric3 >= value7);
    if (
      (value6 ? !value10 || numeric2 < count : Number.isFinite(value7)) &&
      (value9 === null || (value9 >= 0 && value9 <= count * 1000))
    ) {
      return {
        key: "occupied",
        label: "有人",
        active: true,
        available: true,
      };
    } else {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true,
      };
    }
  }
  if (
    [
      "on",
      "home",
      "true",
      "present",
      "presence",
      "occupied",
      "detected",
    ].includes(value5)
  ) {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true,
    };
  }
  if (
    [
      "off",
      "not_home",
      "false",
      "absent",
      "away",
      "clear",
      "empty",
      "vacant",
    ].includes(value5)
  ) {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true,
    };
  }
  const numeric = Number(value5);
  if (Number.isFinite(numeric)) {
    if (numeric > 0) {
      return {
        key: "occupied",
        label: "有人",
        active: true,
        available: true,
      };
    } else {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true,
      };
    }
  } else {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false,
    };
  }
}
export function presenceStateTimestamp(value) {
  const value2 = fn(value) || {};
  const value3 =
    value2.lastChanged ||
    value2.last_changed ||
    value2.updatedAt ||
    value2.lastUpdated ||
    value2.last_updated ||
    value2.state ||
    "";
  const value4 = Date.parse(value3);
  if (Number.isFinite(value4)) {
    return value4;
  } else {
    return null;
  }
}
export function presenceAnimationPhase(
  value,
  value2 = {},
  value3 = Date.now(),
) {
  const value4 = presenceStateTimestamp(value);
  const value5 = Number.isFinite(value4)
    ? Math.max(0, Number(value3) - value4)
    : 0;
  const fn4 = (value6, value7) => {
    const value8 = Math.max(0.001, Number(value6) || value7) * 1000;
    const rounded = Math.round(value5 % value8);
    if (rounded > 0) {
      return "-" + rounded + "ms";
    } else {
      return "0ms";
    }
  };
  return {
    orbitDelay: fn4(value2.orbit, 8),
    waveDelay: fn4(value2.wave, 2.62),
    floorDelay: fn4(value2.floor, 2.8),
    stepDelay: fn4(value2.step, 0.72),
  };
}
export function formatPresenceDuration(component, fallback = Date.now()) {
  const numeric = Number(component);
  if (!Number.isFinite(numeric)) {
    return "--";
  }
  const count = Math.max(0, Math.floor((Number(fallback) - numeric) / 1000));
  if (count < 60) {
    return "刚刚";
  }
  const value2 = Math.floor(count / 60);
  if (value2 < 60) {
    return value2 + " 分钟";
  }
  const value3 = Math.floor(value2 / 60);
  if (value3 < 24) {
    const value6 = value2 % 60;
    if (value6) {
      return value3 + " 小时 " + value6 + " 分钟";
    } else {
      return value3 + " 小时";
    }
  }
  const value4 = Math.floor(value3 / 24);
  const value5 = value3 % 24;
  if (value5) {
    return value4 + " 天 " + value5 + " 小时";
  } else {
    return value4 + " 天";
  }
}
export function presenceHistoryBuckets(
  value = [],
  value2 = null,
  value3 = Date.now(),
  value4 = 24,
  value5 = 48,
  value6 = {},
) {
  const now = Number(value3);
  const value7 = Math.max(1, Number(value4) || 24) * 60 * 60 * 1000;
  const value8 = now - value7;
  const value9 = (Array.isArray(value) ? value : [])
    .map((element) => ({
      timestamp: Date.parse(element?.timestamp),
      state: {
        state: element?.value,
        lastChanged: element?.timestamp,
      },
    }))
    .filter((value13) => Number.isFinite(value13.timestamp))
    .sort((value13, value14) => value13.timestamp - value14.timestamp);
  const timestamp = presenceStateTimestamp(value2);
  if (value2 && Number.isFinite(timestamp)) {
    value9.push({
      timestamp: timestamp,
      state: fn(value2),
    });
  }
  value9.sort((value13, value14) => value13.timestamp - value14.timestamp);
  const value10 = [];
  const count = Math.max(1, Math.min(288, Math.round(Number(value5) || 48)));
  let value11 = 0;
  let value12 = null;
  for (let value13 = 0; value13 < count; value13 += 1) {
    const now2 = value8 + (value7 * (value13 + 1)) / count;
    while (value11 < value9.length && value9[value11].timestamp <= now2) {
      value12 = value9[value11];
      value11 += 1;
    }
    const value14 = value12 || value9[value11] || null;
    value10.push(
      presenceSensorPresentation(value14?.state, "auto", {
        ...value6,
        now: now2,
        noMotionSeconds: null,
        noMotionStateTimestamp: null,
      }).key,
    );
  }
  if (value2 && value10.length) {
    value10[value10.length - 1] = presenceSensorPresentation(value2, "auto", {
      ...value6,
      now: now,
    }).key;
  }
  return value10;
}
