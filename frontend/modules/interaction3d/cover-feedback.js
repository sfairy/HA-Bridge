export function createCoverFeedback({
  now: now = () => performance.now(),
  smoothingTime: smoothingTime = 180,
  commandPreview: commandPreview = false,
  travelTime: travelTime = 6000,
  storage,
  scope,
  wallNow: wallNow = () => Date.now()
} = {}) {
  const feedbackByEntityId = new Map();
  const readLastUpdated = state =>
    Date.parse(state.raw?.last_updated ?? state.raw?.updatedAt ?? "");
  const storageKeyFor = entityId =>
    scope ? `hb-cover-presentation:v1:${scope}:${entityId}` : null;
  const shouldPersist = entry =>
    commandPreview &&
    entry.actual.dream &&
    entry.actual.overallFeedbackAvailable === false;
  function clearPresentation(entityId) {
    try {
      const storageKey = storageKeyFor(entityId);
      if (storageKey) {
        storage?.removeItem(storageKey);
      }
    } catch {}
  }
  function savePresentation(entityId, entry) {
    if (!shouldPersist(entry) || !entry.estimated || entry.position === null) {
      return;
    }
    const activeMotion = entry.motion;
    const payload = {
      position: entry.position,
      savedAt: wallNow(),
      motion: activeMotion
        ? {
            to: activeMotion.to,
            duration: Math.max(0, activeMotion.duration - (now() - activeMotion.start))
          }
        : null
    };
    try {
      const storageKey = storageKeyFor(entityId);
      if (storageKey) {
        storage?.setItem(storageKey, JSON.stringify(payload));
      }
    } catch {}
  }
  function restorePresentation(entityId, entry) {
    if (!shouldPersist(entry)) {
      clearPresentation(entityId);
      return;
    }
    try {
      const storageKey = storageKeyFor(entityId);
      const stored = storageKey && JSON.parse(storage?.getItem(storageKey) || "null");
      const isValidPosition = value =>
        typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
      if (!stored || !isValidPosition(stored.position) || !Number.isFinite(stored.savedAt)) {
        return;
      }
      const elapsedMs = Math.max(0, wallNow() - stored.savedAt);
      const storedMotion = stored.motion;
      if (
        storedMotion &&
        (!isValidPosition(storedMotion.to) ||
          !Number.isFinite(storedMotion.duration) ||
          storedMotion.duration < 0 ||
          storedMotion.duration > travelTime)
      ) {
        return;
      }
      entry.position = stored.position;
      if (storedMotion) {
        const progress =
          storedMotion.duration > 0 ? Math.min(1, elapsedMs / storedMotion.duration) : 1;
        entry.position += (storedMotion.to - entry.position) * progress;
        if (progress < 1) {
          entry.motion = {
            from: entry.position,
            to: storedMotion.to,
            start: now(),
            duration: storedMotion.duration - elapsedMs
          };
        }
      }
      entry.estimated = true;
      entry.railUnconfirmed = true;
    } catch {}
  }
  function advanceMotion(trackedEntry, timeMs) {
    if (!trackedEntry.motion) {
      return false;
    }
    const {
      from: fromPosition,
      to: toPosition,
      start: startedAt,
      duration: durationMs = smoothingTime
    } = trackedEntry.motion;
    const progress = Math.max(0, Math.min(1, (timeMs - startedAt) / durationMs));
    trackedEntry.position = fromPosition + (toPosition - fromPosition) * progress;
    if (progress === 1) {
      trackedEntry.motion = null;
    }
    return true;
  }
  function sync(entityId, nextState) {
    let entry = feedbackByEntityId.get(entityId);
    if (!entry) {
      entry = {
        actual: nextState,
        position: nextState.position,
        motion: null,
        intent: null,
        token: null,
        error: "",
        draft: null,
        bladeHold: null,
        railUnconfirmed: false,
        estimated: false,
        lastAvailable: nextState.available ? nextState : null,
        lastTimestamp: readLastUpdated(nextState)
      };
      restorePresentation(entityId, entry);
      feedbackByEntityId.set(entityId, entry);
      return;
    }
    const previousState = entry.actual;
    if (readLastUpdated(nextState) < entry.lastTimestamp) {
      return;
    }
    if (Number.isFinite(readLastUpdated(nextState))) {
      entry.lastTimestamp = readLastUpdated(nextState);
    }
    if (
      nextState.dream !== previousState.dream ||
      nextState.overallFeedbackAvailable !== previousState.overallFeedbackAvailable
    ) {
      feedbackByEntityId.delete(entityId);
      sync(entityId, nextState);
      return;
    }
    const positionChanged = nextState.position !== previousState.position;
    const stateChanged = nextState.state !== previousState.state;
    const lastAvailableChanged =
      !entry.lastAvailable ||
      nextState.position !== entry.lastAvailable.position ||
      nextState.state !== entry.lastAvailable.state;
    entry.actual = nextState;
    advanceMotion(entry, now());
    if (!nextState.available) {
      entry.motion = null;
      entry.intent = null;
      entry.draft = null;
      entry.bladeHold = null;
      entry.railUnconfirmed = !!nextState.dream;
      savePresentation(entityId, entry);
      return;
    }
    entry.lastAvailable = nextState;
    if (entry.bladeHold !== null) {
      if (nextState.position !== entry.bladeHold) {
        return;
      }
      entry.position = nextState.position;
      entry.motion = null;
      entry.estimated = false;
      entry.bladeHold = null;
      entry.intent = null;
      return;
    }
    if (
      positionChanged ||
      (entry.estimated &&
        nextState.axis === "blade" &&
        readLastUpdated(nextState) > readLastUpdated(previousState))
    ) {
      entry.estimated = false;
      if (
        nextState.position === null ||
        entry.position === null ||
        (!nextState.moving && nextState.axis !== "blade") ||
        smoothingTime <= 0
      ) {
        entry.position = nextState.position;
        entry.motion = null;
      } else {
        entry.motion = {
          from: entry.position,
          to: nextState.position,
          start: now()
        };
      }
    } else if (stateChanged && !nextState.moving) {
      entry.estimated = false;
      entry.position = nextState.position;
      entry.motion = null;
    }
    if (
      lastAvailableChanged &&
      nextState.overallFeedbackAvailable !== false &&
      ((entry.railUnconfirmed = false), entry.intent)
    ) {
      const reachedIntentTarget =
        nextState.position !== null && nextState.position === entry.intent.target;
      if (
        (!nextState.moving &&
          (reachedIntentTarget ||
            entry.intent.service === "stop_cover" ||
            entry.intent.confirmed)) ||
        (positionChanged && !nextState.moving)
      ) {
        entry.intent = null;
      } else if (nextState.moving) {
        entry.intent.confirmed = true;
        entry.intent.expires = Infinity;
      }
    }
  }
  function begin(command, token, { defer: defer = false } = {}) {
    const commandEntry = feedbackByEntityId.get(command.entityId);
    if (!commandEntry) {
      return;
    }
    advanceMotion(commandEntry, now());
    commandEntry.error = "";
    commandEntry.token = token;
    const draftPosition = commandEntry.draft;
    commandEntry.draft = null;
    commandEntry.bladeHold = null;
    const intentTarget =
      command.service === "open_cover"
        ? 100
        : command.service === "close_cover"
          ? 0
          : command.service === "stop_cover"
            ? null
            : command.data.position;
    if (
      commandPreview &&
      command.service === "set_cover_position" &&
      draftPosition !== null &&
      draftPosition === intentTarget
    ) {
      commandEntry.position = draftPosition;
      commandEntry.motion = null;
      commandEntry.estimated = true;
      if (commandEntry.actual.axis === "blade") {
        commandEntry.bladeHold = intentTarget;
      }
    }
    if (command.service === "stop_cover" || defer) {
      commandEntry.motion = null;
    }
    commandEntry.intent = {
      service: command.service,
      target: intentTarget,
      confirmed: false,
      expires: now() + 15000
    };
    if (commandPreview && !defer && intentTarget !== null) {
      startPreview(command.entityId, token);
    }
    if (
      commandEntry.actual.dream &&
      ["open_cover", "close_cover", "stop_cover"].includes(command.service)
    ) {
      commandEntry.railUnconfirmed =
        commandEntry.railUnconfirmed ||
        command.service === "open_cover" ||
        !commandEntry.actual.closedConfirmed;
    }
    savePresentation(command.entityId, commandEntry);
  }
  function startPreview(previewEntityId, previewToken) {
    const previewEntry = feedbackByEntityId.get(previewEntityId);
    if (
      !commandPreview ||
      !previewEntry?.intent ||
      previewEntry.token !== previewToken ||
      previewEntry.intent.target === null
    ) {
      return false;
    }
    advanceMotion(previewEntry, now());
    const startPosition = previewEntry.position ?? 0;
    const targetPosition = previewEntry.intent.target;
    previewEntry.position = startPosition;
    previewEntry.estimated =
      startPosition !== targetPosition ||
      previewEntry.actual.position !== targetPosition ||
      previewEntry.railUnconfirmed;
    previewEntry.motion =
      startPosition === targetPosition
        ? null
        : {
            from: startPosition,
            to: targetPosition,
            start: now(),
            duration: Math.max(180, (Math.abs(targetPosition - startPosition) / 100) * travelTime)
          };
    savePresentation(previewEntityId, previewEntry);
    return true;
  }
  function fail(failedEntityId, failedToken, message) {
    const failedEntry = feedbackByEntityId.get(failedEntityId);
    if (!failedEntry || failedEntry.token !== failedToken) {
      return false;
    }
    advanceMotion(failedEntry, now());
    failedEntry.motion = null;
    failedEntry.intent = null;
    failedEntry.draft = null;
    failedEntry.bladeHold = null;
    failedEntry.error = message;
    if (failedEntry.actual.position !== null) {
      failedEntry.position = failedEntry.actual.position;
      failedEntry.estimated = false;
    }
    clearPresentation(failedEntityId);
    return true;
  }
  function read(readEntityId, fallbackState) {
    const snapshotEntry = feedbackByEntityId.get(readEntityId);
    if (!snapshotEntry) {
      return fallbackState;
    }
    const hasMotionEstimate = !!snapshotEntry.estimated && !!snapshotEntry.motion;
    const opening = hasMotionEstimate
      ? snapshotEntry.motion.to > snapshotEntry.motion.from
      : snapshotEntry.actual.opening;
    const closing = hasMotionEstimate
      ? snapshotEntry.motion.to < snapshotEntry.motion.from
      : snapshotEntry.actual.closing;
    return {
      ...snapshotEntry.actual,
      position: (commandPreview ? snapshotEntry.draft : null) ?? snapshotEntry.position,
      estimated: snapshotEntry.estimated,
      dragging: !!commandPreview && snapshotEntry.draft !== null,
      state: hasMotionEstimate ? (opening ? "opening" : "closing") : snapshotEntry.actual.state,
      opening: opening,
      closing: closing,
      moving: opening || closing,
      on:
        snapshotEntry.actual.available &&
        (shouldPersist(snapshotEntry) && snapshotEntry.estimated
          ? snapshotEntry.position > 0
          : snapshotEntry.actual.on),
      closedConfirmed:
        !!snapshotEntry.actual.closedConfirmed &&
        !snapshotEntry.railUnconfirmed &&
        !snapshotEntry.motion &&
        !snapshotEntry.estimated,
      awaitingArrival: snapshotEntry.railUnconfirmed,
      targetPosition: snapshotEntry.draft ?? snapshotEntry.intent?.target ?? null,
      pendingService: snapshotEntry.intent?.service || "",
      preview: !!snapshotEntry.intent,
      error: snapshotEntry.error
    };
  }
  function tick(nowMs = now()) {
    let changed = false;
    for (const tickEntry of feedbackByEntityId.values()) {
      if (tickEntry.intent?.expires <= nowMs) {
        tickEntry.intent = null;
        changed = true;
        if (tickEntry.actual.axis === "blade") {
          tickEntry.motion = null;
          tickEntry.position = tickEntry.actual.position;
          tickEntry.estimated = false;
          tickEntry.bladeHold = null;
        }
      }
      changed = advanceMotion(tickEntry, nowMs) || changed;
    }
    return changed;
  }
  function nextDelay(currentTimeMs = now()) {
    let delayMs = Infinity;
    for (const delayEntry of feedbackByEntityId.values()) {
      delayMs = Math.min(
        delayMs,
        delayEntry.motion ? 1000 / 30 : Infinity,
        delayEntry.intent ? Math.max(0, delayEntry.intent.expires - currentTimeMs) : Infinity
      );
    }
    return delayMs;
  }
  function retain(entityIds) {
    const retainedEntityIds = new Set(entityIds);
    for (const staleEntityId of feedbackByEntityId.keys()) {
      if (!retainedEntityIds.has(staleEntityId)) {
        feedbackByEntityId.delete(staleEntityId);
      }
    }
  }
  function preview(draftEntityId, position) {
    const draftEntry = feedbackByEntityId.get(draftEntityId);
    if (draftEntry) {
      draftEntry.draft = Number.isFinite(position) ? Math.max(0, Math.min(100, position)) : null;
    }
  }
  return {
    sync: sync,
    begin: begin,
    startPreview: startPreview,
    fail: fail,
    read: read,
    tick: tick,
    nextDelay: nextDelay,
    retain: retain,
    preview: preview,
    clear: () => feedbackByEntityId.clear()
  };
}
