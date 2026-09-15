function resolveEventState(event) {
  return event?.newState || event || null;
}
function entitySearchText(entity = {}) {
  return (
    (entity.entityId || "") +
    " " +
    (entity.name || "") +
    " " +
    (entity.originalName || "") +
    " " +
    (entity.translationKey || "")
  ).trim();
}
function durationSecondsFromState(stateEntity, defaultUnit = "s") {
  const entityState = resolveEventState(stateEntity) || {};
  const rawSeconds = Number(entityState.state);
  if (!Number.isFinite(rawSeconds) || rawSeconds < 0) {
    return null;
  }
  const unit = String(entityState.attributes?.unit_of_measurement || defaultUnit)
    .trim()
    .toLowerCase();
  if (["min", "minute", "minutes", "分钟"].includes(unit)) {
    return rawSeconds * 60;
  } else if (["h", "hr", "hour", "hours", "小时"].includes(unit)) {
    return rawSeconds * 3600;
  } else {
    return rawSeconds;
  }
}
function findMotionCompanionSensors(entitiesById, targetEntityId) {
  const entityMetadata = entitiesById?.get?.(targetEntityId);
  if (!entityMetadata?.deviceId) {
    return {
      timeout: null,
      noMotion: null
    };
  }
  const deviceSensorEntities = [...entitiesById.values()].filter(
    candidateSensor =>
      candidateSensor.deviceId === entityMetadata.deviceId &&
      candidateSensor.domain === "sensor" &&
      candidateSensor.status !== "missing" &&
      !candidateSensor.disabledBy
  );
  const timeoutSensor =
    deviceSensorEntities.find(timeoutCandidate =>
      /custom[_ -]?no[_ -]?motion[_ -]?time|no[_ -]?motion[_ -]?timeout|自定义超时无人移动时间/i.test(
        entitySearchText(timeoutCandidate)
      )
    ) || null;
  const noMotionSensor =
    deviceSensorEntities.find(noMotionCandidate =>
      /no[_ -]?motion[_ -]?duration|无移动状态持续时间/i.test(entitySearchText(noMotionCandidate))
    ) || null;
  return {
    timeout: timeoutSensor,
    noMotion: noMotionSensor
  };
}
export function presenceMotionEventConfig(
  entityId,
  eventState = null,
  entityRegistry = new Map(),
  statesByEntityId = new Map(),
  eventOptions = {}
) {
  const registryEntry = entityRegistry?.get?.(entityId) || {};
  const stateObject = resolveEventState(eventState) || {};
  const searchText =
    entitySearchText({
      ...registryEntry,
      entityId: entityId
    }) +
    " " +
    (stateObject.attributes?.device_class || "") +
    " " +
    (stateObject.attributes?.event_type || "");
  if (
    !String(entityId || "").startsWith("event.") ||
    !/motion|occupancy|presence|pir|moving|移动|运动|人体|有人/i.test(searchText)
  ) {
    return {
      entityId: entityId,
      motionEvent: false,
      motionTimeoutSeconds: null,
      noMotionSeconds: null,
      noMotionStateTimestamp: null,
      companionEntityIds: []
    };
  }
  const companionSensors = findMotionCompanionSensors(entityRegistry, entityId);
  const optionsTimeoutSeconds = Number(eventOptions.motionTimeoutSeconds);
  const timeoutState = companionSensors.timeout?.entityId
    ? statesByEntityId?.get?.(companionSensors.timeout.entityId)
    : null;
  const timeoutSeconds = durationSecondsFromState(timeoutState, "min");
  const resolvedTimeoutSeconds = Math.max(
    1,
    Math.min(
      3600,
      Number.isFinite(timeoutSeconds) && timeoutSeconds > 0
        ? timeoutSeconds
        : Number.isFinite(optionsTimeoutSeconds) && optionsTimeoutSeconds > 0
          ? optionsTimeoutSeconds
          : 60
    )
  );
  const noMotionState = companionSensors.noMotion?.entityId
    ? statesByEntityId?.get?.(companionSensors.noMotion.entityId)
    : null;
  return {
    entityId: entityId,
    motionEvent: true,
    motionTimeoutSeconds: resolvedTimeoutSeconds,
    noMotionSeconds: durationSecondsFromState(noMotionState),
    noMotionStateTimestamp: presenceStateTimestamp(noMotionState),
    companionEntityIds: [
      companionSensors.timeout?.entityId,
      companionSensors.noMotion?.entityId
    ].filter(Boolean)
  };
}
export function presenceSensorPresentation(
  stateSource,
  overrideState = "auto",
  presentationOptions = {}
) {
  if (overrideState === "on") {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true
    };
  }
  if (overrideState === "off") {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true
    };
  }
  const rawState = resolveEventState(stateSource);
  if (!rawState) {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false
    };
  }
  const normalizedState = String(rawState.state ?? "")
    .trim()
    .toLowerCase();
  if (normalizedState === "unavailable") {
    return {
      key: "unavailable",
      label: "离线",
      active: false,
      available: false
    };
  }
  if (
    !normalizedState ||
    normalizedState === "unknown" ||
    normalizedState === "none" ||
    normalizedState === "null"
  ) {
    return {
      key: "unknown",
      label: "未知",
      active: false,
      available: false
    };
  }
  if (
    presentationOptions.motionEvent ||
    String(presentationOptions.entityId || "").startsWith("event.")
  ) {
    const eventType = String(rawState.attributes?.event_type || "")
      .trim()
      .toLowerCase();
    if (
      /no[_ -]?motion|motion[_ -]?(?:clear|ended)|clear|inactive|vacant|absent|not[_ -]?detected|无人|无移动|未检测到(?:移动|人体)/i.test(
        eventType
      )
    ) {
      return {
        key: "clear",
        label: "无人",
        active: false,
        available: true
      };
    }
    const motionStateTimestamp = presenceStateTimestamp(rawState);
    const nowMs = Number.isFinite(Number(presentationOptions.now))
      ? Number(presentationOptions.now)
      : Date.now();
    const motionTimeoutSeconds = Math.max(
      1,
      Number(presentationOptions.motionTimeoutSeconds) || 60
    );
    const elapsedSinceChangeMs = Number.isFinite(motionStateTimestamp)
      ? nowMs - motionStateTimestamp
      : null;
    const noMotionSeconds = Number(presentationOptions.noMotionSeconds);
    const noMotionTimestamp = Number(presentationOptions.noMotionStateTimestamp);
    const noMotionIsFresh =
      Number.isFinite(noMotionSeconds) &&
      (!Number.isFinite(motionStateTimestamp) ||
        !Number.isFinite(noMotionTimestamp) ||
        noMotionTimestamp >= motionStateTimestamp);
    if (
      (eventType
        ? !noMotionIsFresh || noMotionSeconds < motionTimeoutSeconds
        : Number.isFinite(motionStateTimestamp)) &&
      (elapsedSinceChangeMs === null ||
        (elapsedSinceChangeMs >= 0 && elapsedSinceChangeMs <= motionTimeoutSeconds * 1000))
    ) {
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
  if (
    ["on", "home", "true", "present", "presence", "occupied", "detected"].includes(normalizedState)
  ) {
    return {
      key: "occupied",
      label: "有人",
      active: true,
      available: true
    };
  }
  if (
    ["off", "not_home", "false", "absent", "away", "clear", "empty", "vacant"].includes(
      normalizedState
    )
  ) {
    return {
      key: "clear",
      label: "无人",
      active: false,
      available: true
    };
  }
  const numericState = Number(normalizedState);
  if (Number.isFinite(numericState)) {
    if (numericState > 0) {
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
export function presenceStateTimestamp(stateRecord) {
  const resolvedState = resolveEventState(stateRecord) || {};
  const rawTimestamp =
    resolvedState.lastChanged ||
    resolvedState.last_changed ||
    resolvedState.updatedAt ||
    resolvedState.lastUpdated ||
    resolvedState.last_updated ||
    resolvedState.state ||
    "";
  const parsedTimestamp = Date.parse(rawTimestamp);
  if (Number.isFinite(parsedTimestamp)) {
    return parsedTimestamp;
  } else {
    return null;
  }
}
export function presenceAnimationPhase(stateInput, durations = {}, animationNowMs = Date.now()) {
  const stateTimestamp = presenceStateTimestamp(stateInput);
  const elapsedMs = Number.isFinite(stateTimestamp)
    ? Math.max(0, Number(animationNowMs) - stateTimestamp)
    : 0;
  const formatDelayForPeriod = (durationSeconds, defaultSeconds) => {
    const periodMs = Math.max(0.001, Number(durationSeconds) || defaultSeconds) * 1000;
    const delayMs = Math.round(elapsedMs % periodMs);
    if (delayMs > 0) {
      return "-" + delayMs + "ms";
    } else {
      return "0ms";
    }
  };
  return {
    orbitDelay: formatDelayForPeriod(durations.orbit, 8),
    waveDelay: formatDelayForPeriod(durations.wave, 2.62),
    floorDelay: formatDelayForPeriod(durations.floor, 2.8),
    stepDelay: formatDelayForPeriod(durations.step, 0.72)
  };
}
export function formatPresenceDuration(timestamp, referenceNowMs = Date.now()) {
  const timestampValue = Number(timestamp);
  if (!Number.isFinite(timestampValue)) {
    return "--";
  }
  const elapsedSeconds = Math.max(0, Math.floor((Number(referenceNowMs) - timestampValue) / 1000));
  if (elapsedSeconds < 60) {
    return "刚刚";
  }
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return elapsedMinutes + " 分钟";
  }
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    const remainingMinutes = elapsedMinutes % 60;
    if (remainingMinutes) {
      return elapsedHours + " 小时 " + remainingMinutes + " 分钟";
    } else {
      return elapsedHours + " 小时";
    }
  }
  const elapsedDays = Math.floor(elapsedHours / 24);
  const remainingHours = elapsedHours % 24;
  if (remainingHours) {
    return elapsedDays + " 天 " + remainingHours + " 小时";
  } else {
    return elapsedDays + " 天";
  }
}
export function presenceHistoryBuckets(
  historyEntries = [],
  currentState = null,
  nowTimestampMs = Date.now(),
  windowHours = 24,
  bucketCount = 48,
  bucketOptions = {}
) {
  const nowValue = Number(nowTimestampMs);
  const windowMs = Math.max(1, Number(windowHours) || 24) * 60 * 60 * 1000;
  const windowStartMs = nowValue - windowMs;
  const entries = (Array.isArray(historyEntries) ? historyEntries : [])
    .map(historyEntry => ({
      timestamp: Date.parse(historyEntry?.timestamp),
      state: {
        state: historyEntry?.value,
        lastChanged: historyEntry?.timestamp
      }
    }))
    .filter(validEntry => Number.isFinite(validEntry.timestamp))
    .sort((firstEntry, secondEntry) => firstEntry.timestamp - secondEntry.timestamp);
  const currentTimestamp = presenceStateTimestamp(currentState);
  if (currentState && Number.isFinite(currentTimestamp)) {
    entries.push({
      timestamp: currentTimestamp,
      state: resolveEventState(currentState)
    });
  }
  entries.sort((leftEntry, rightEntry) => leftEntry.timestamp - rightEntry.timestamp);
  const bucketStates = [];
  const bucketCountClamped = Math.max(1, Math.min(288, Math.round(Number(bucketCount) || 48)));
  let entryIndex = 0;
  let previousEntry = null;
  for (let bucketIndex = 0; bucketIndex < bucketCountClamped; bucketIndex += 1) {
    const bucketEndMs = windowStartMs + (windowMs * (bucketIndex + 1)) / bucketCountClamped;
    while (entryIndex < entries.length && entries[entryIndex].timestamp <= bucketEndMs) {
      previousEntry = entries[entryIndex];
      entryIndex += 1;
    }
    const entryAtBucket = previousEntry || entries[entryIndex] || null;
    bucketStates.push(
      presenceSensorPresentation(entryAtBucket?.state, "auto", {
        ...bucketOptions,
        now: bucketEndMs,
        noMotionSeconds: null,
        noMotionStateTimestamp: null
      }).key
    );
  }
  if (currentState && bucketStates.length) {
    bucketStates[bucketStates.length - 1] = presenceSensorPresentation(currentState, "auto", {
      ...bucketOptions,
      now: nowValue
    }).key;
  }
  return bucketStates;
}
