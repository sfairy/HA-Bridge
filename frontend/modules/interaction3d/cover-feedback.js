export function createCoverFeedback({
  now: now = () => performance.now(),
  smoothingTime: smoothingTime = 180,
  commandPreview: commandPreview = false,
  travelTime: travelTime = 6000
} = {}) {
  const feedbackByEntityId = new Map();
  const readLastUpdated = state =>
    Date.parse(state.raw?.last_updated ?? state.raw?.updatedAt ?? "");
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
      feedbackByEntityId.set(entityId, {
        actual: nextState,
        position: nextState.position,
        motion: null,
        intent: null,
        token: null,
        error: "",
        draft: null,
        railUnconfirmed: false,
        estimated: false,
        lastAvailable: nextState.available ? nextState : null,
        lastTimestamp: readLastUpdated(nextState)
      });
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
      entry.railUnconfirmed = !!nextState.dream;
      return;
    }
    entry.lastAvailable = nextState;
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
    return true;
  }
  function fail(failedEntityId, failedToken, message) {
    const failedEntry = feedbackByEntityId.get(failedEntityId);
    if (!failedEntry || failedEntry.token !== failedToken) {
      return false;
    } else {
      advanceMotion(failedEntry, now());
      failedEntry.motion = null;
      failedEntry.intent = null;
      failedEntry.draft = null;
      failedEntry.error = message;
      if (failedEntry.actual.position !== null) {
        failedEntry.position = failedEntry.actual.position;
        failedEntry.estimated = false;
      }
      return true;
    }
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
