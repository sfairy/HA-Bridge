function readState(record) {
  return record?.newState || record || null;
}
function entitySearchText(metadata = {}) {
  return ((metadata.entityId || "") + " " + (metadata.name || "") + " " + (metadata.originalName || "") + " " + (metadata.translationKey || "")).trim();
}
function durationSecondsFromState(record, defaultUnit = "s") {
  const state = readState(record) || {};
  const numeric = Number(state.state);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return null;
  }
  const unit = String(state.attributes?.unit_of_measurement || defaultUnit).trim().toLowerCase();
  if (["min", "minute", "minutes", "分钟"].includes(unit)) {
    return numeric * 60;
  } else if (["h", "hr", "hour", "hours", "小时"].includes(unit)) {
    return numeric * 3600;
  } else {
    return numeric;
  }
}
function findCompanionSensors(entityMetadata, entityId) {
  const metadata = entityMetadata?.get?.(entityId);
  if (!metadata?.deviceId) {
    return {
      timeout: null,
      noMotion: null
    };
  }
  const siblings = [...entityMetadata.values()].filter(entry => entry.deviceId === metadata.deviceId && entry.domain === "sensor" && entry.status !== "missing" && !entry.disabledBy);
  const timeout = siblings.find(entry => /custom[_ -]?no[_ -]?motion[_ -]?time|no[_ -]?motion[_ -]?timeout|自定义超时无人移动时间/i.test(entitySearchText(entry))) || null;
  const noMotion = siblings.find(entry => /no[_ -]?motion[_ -]?duration|无移动状态持续时间/i.test(entitySearchText(entry))) || null;
  return {
    timeout,
    noMotion
  };
}
export function presenceMotionEventConfig(entityId, stateRecord = null, entityMetadata = new Map(), states = new Map(), options = {}) {
  const metadata = entityMetadata?.get?.(entityId) || {};
  const state = readState(stateRecord) || {};
  const searchText = entitySearchText({
    ...metadata,
    entityId
  }) + " " + (state.attributes?.device_class || "") + " " + (state.attributes?.event_type || "");
  if (!String(entityId || "").startsWith("event.") || !/motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(searchText)) {
    return {
      entityId,
      motionEvent: false,
      motionTimeoutSeconds: null,
      noMotionSeconds: null,
      noMotionStateTimestamp: null,
      companionEntityIds: []
    };
  }
  const companions = findCompanionSensors(entityMetadata, entityId);
  const configuredTimeout = Number(options.motionTimeoutSeconds);
  const timeoutState = companions.timeout?.entityId ? states?.get?.(companions.timeout.entityId) : null;
  const timeoutSeconds = durationSecondsFromState(timeoutState, "min");
  const motionTimeoutSeconds = Math.max(1, Math.min(3600, Number.isFinite(timeoutSeconds) && timeoutSeconds > 0 ? timeoutSeconds : Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 60));
  const noMotionState = companions.noMotion?.entityId ? states?.get?.(companions.noMotion.entityId) : null;
  return {
    entityId,
    motionEvent: true,
    motionTimeoutSeconds,
    noMotionSeconds: durationSecondsFromState(noMotionState),
    noMotionStateTimestamp: presenceStateTimestamp(noMotionState),
    companionEntityIds: [companions.timeout?.entityId, companions.noMotion?.entityId].filter(Boolean)
  };
}
export function presenceSensorPresentation(stateRecord, override = "auto", options = {}) {
  if (override === "on") {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true
    };
  }
  if (override === "off") {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true
    };
  }
  const state = readState(stateRecord);
  if (!state) {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false
    };
  }
  const stateValue = String(state.state ?? "").trim().toLowerCase();
  if (stateValue === "unavailable") {
    return {
      key: "unavailable",
      label: "离线",
      active: false,
      available: false
    };
  }
  if (!stateValue || stateValue === "unknown" || stateValue === "none" || stateValue === "null") {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false
    };
  }
  if (options.motionEvent || String(options.entityId || "").startsWith("event.")) {
    const eventType = String(state.attributes?.event_type || "").trim().toLowerCase();
    if (/no[_ -]?motion|motion[_ -]?(?:clear|ended)|clear|inactive|vacant|absent|not[_ -]?detected|无人|无移动|未检测到(?:移动|人体)/i.test(eventType)) {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true
      };
    }
    const changedAt = presenceStateTimestamp(state);
    const now = Number.isFinite(Number(options.now)) ? Number(options.now) : Date.now();
    const timeoutMs = Math.max(1, Number(options.motionTimeoutSeconds) || 60);
    const ageMs = Number.isFinite(changedAt) ? now - changedAt : null;
    const noMotionSeconds = Number(options.noMotionSeconds);
    const noMotionStateTimestamp = Number(options.noMotionStateTimestamp);
    const noMotionIsCurrent = Number.isFinite(noMotionSeconds) && (!Number.isFinite(changedAt) || !Number.isFinite(noMotionStateTimestamp) || noMotionStateTimestamp >= changedAt);
    if ((eventType ? !noMotionIsCurrent || noMotionSeconds < timeoutMs : Number.isFinite(changedAt)) && (ageMs === null || ageMs >= 0 && ageMs <= timeoutMs * 1000)) {
      return {
        key: "occupied",
        label: "有人",
        active: true,
        available: true
      };
    } else {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true
      };
    }
  }
  if (["on", "home", "true", "present", "presence", "occupied", "detected"].includes(stateValue)) {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true
    };
  }
  if (["off", "not_home", "false", "absent", "away", "clear", "empty", "vacant"].includes(stateValue)) {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true
    };
  }
  const numeric = Number(stateValue);
  if (Number.isFinite(numeric)) {
    if (numeric > 0) {
      return {
        key: "occupied",
        label: "有人",
        active: true,
        available: true
      };
    } else {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true
      };
    }
  } else {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false
    };
  }
}
export function presenceStateTimestamp(record) {
  const state = readState(record) || {};
  const raw = state.lastChanged || state.last_changed || state.updatedAt || state.lastUpdated || state.last_updated || state.state || "";
  const parsed = Date.parse(raw);
  if (Number.isFinite(parsed)) {
    return parsed;
  } else {
    return null;
  }
}
export function presenceAnimationPhase(stateRecord, durations = {}, now = Date.now()) {
  const changedAt = presenceStateTimestamp(stateRecord);
  const elapsedMs = Number.isFinite(changedAt) ? Math.max(0, Number(now) - changedAt) : 0;
  const animationDelay = (seconds, fallbackSeconds) => {
    const periodMs = Math.max(0.001, Number(seconds) || fallbackSeconds) * 1000;
    const offsetMs = Math.round(elapsedMs % periodMs);
    if (offsetMs > 0) {
      return "-" + offsetMs + "ms";
    } else {
      return "0ms";
    }
  };
  return {
    orbitDelay: animationDelay(durations.orbit, 8),
    waveDelay: animationDelay(durations.wave, 2.62),
    floorDelay: animationDelay(durations.floor, 2.8),
    stepDelay: animationDelay(durations.step, 0.72)
  };
}
export function formatPresenceDuration(sinceTimestamp, now = Date.now()) {
  const numeric = Number(sinceTimestamp);
  if (!Number.isFinite(numeric)) {
    return "--";
  }
  const totalSeconds = Math.max(0, Math.floor((Number(now) - numeric) / 1000));
  if (totalSeconds < 60) {
    return "刚刚";
  }
  const totalMinutes = Math.floor(totalSeconds / 60);
  if (totalMinutes < 60) {
    return totalMinutes + " 分钟";
  }
  const totalHours = Math.floor(totalMinutes / 60);
  if (totalHours < 24) {
    const remainingMinutes = totalMinutes % 60;
    if (remainingMinutes) {
      return totalHours + " 小时 " + remainingMinutes + " 分钟";
    } else {
      return totalHours + " 小时";
    }
  }
  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  if (remainingHours) {
    return totalDays + " 天 " + remainingHours + " 小时";
  } else {
    return totalDays + " 天";
  }
}
export function presenceHistoryBuckets(history = [], currentState = null, nowMs = Date.now(), hours = 24, bucketCount = 48, options = {}) {
  const now = Number(nowMs);
  const windowMs = Math.max(1, Number(hours) || 24) * 60 * 60 * 1000;
  const windowStart = now - windowMs;
  const samples = (Array.isArray(history) ? history : []).map(element => ({
    timestamp: Date.parse(element?.timestamp),
    state: {
      state: element?.value,
      lastChanged: element?.timestamp
    }
  })).filter(sample => Number.isFinite(sample.timestamp)).sort((timestamp, timestampRight) => timestamp.timestamp - timestampRight.timestamp);
  const timestamp = presenceStateTimestamp(currentState);
  if (currentState && Number.isFinite(timestamp)) {
    samples.push({
      timestamp,
      state: readState(currentState)
    });
  }
  samples.sort((timestamp, timestampRight) => timestamp.timestamp - timestampRight.timestamp);
  const buckets = [];
  const count = Math.max(1, Math.min(288, Math.round(Number(bucketCount) || 48)));
  let sampleIndex = 0;
  let latestSample = null;
  for (let bucketIndex = 0; bucketIndex < count; bucketIndex += 1) {
    const bucketEnd = windowStart + windowMs * (bucketIndex + 1) / count;
    while (sampleIndex < samples.length && samples[sampleIndex].timestamp <= bucketEnd) {
      latestSample = samples[sampleIndex];
      sampleIndex += 1;
    }
    const sample = latestSample || samples[sampleIndex] || null;
    buckets.push(presenceSensorPresentation(sample?.state, "auto", {
      ...options,
      now: bucketEnd,
      noMotionSeconds: null,
      noMotionStateTimestamp: null
    }).key);
  }
  if (currentState && buckets.length) {
    buckets[buckets.length - 1] = presenceSensorPresentation(currentState, "auto", {
      ...options,
      now
    }).key;
  }
  return buckets;
}
