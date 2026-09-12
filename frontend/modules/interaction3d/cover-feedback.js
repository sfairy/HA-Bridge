export function createCoverFeedback({
  now = () => performance.now(),
  travelTime = 2000
} = {}) {
  const items = new Map();
  function advanceMotion(entry, nowMs) {
    if (!entry.motion) {
      return false;
    }
    const {
      from,
      to,
      start,
      duration,
      linear
    } = entry.motion;
    const progress = Math.max(0, Math.min(1, (nowMs - start) / duration));
    const eased = linear ? progress : progress * progress * (3 - progress * 2);
    entry.position = from + (to - from) * eased;
    if (progress === 1) {
      entry.motion = null;
    }
    return true;
  }
  function setMotionTo(entry, to, duration = 420, linear = false) {
    advanceMotion(entry, now());
    if (to === null) {
      entry.motion = null;
      entry.position = null;
      return;
    }
    if (entry.position === null || entry.position === to) {
      entry.position = to;
      entry.motion = null;
      return;
    }
    entry.motion = {
      from: entry.position,
      to,
      start: now(),
      duration,
      linear
    };
  }
  function sync(entityId, nextState) {
    let entry = items.get(entityId);
    if (!entry) {
      items.set(entityId, {
        actual: nextState,
        position: nextState.position,
        motion: null,
        intent: null,
        token: null,
        error: "",
        draft: null
      });
      return;
    }
    const prevActual = entry.actual;
    const parseUpdatedAt = cover => Date.parse(cover.raw.last_updated ?? cover.raw.updatedAt ?? "");
    if (parseUpdatedAt(nextState) < parseUpdatedAt(prevActual)) {
      return;
    }
    entry.actual = nextState;
    if (!nextState.available) {
      entry.intent = null;
      entry.draft = null;
      entry.error = "";
      setMotionTo(entry, nextState.position);
      return;
    }
    const positionChanged = nextState.position !== prevActual.position;
    const stateChanged = nextState.state !== prevActual.state;
    if (entry.intent) {
      const confirmed = entry.intent;
      const hasUpdate = positionChanged || stateChanged || nextState.raw.last_updated !== prevActual.raw.last_updated || nextState.raw.updatedAt !== prevActual.raw.updatedAt;
      const stopConfirmed = confirmed.stop && hasUpdate && !nextState.moving;
      const reachedTarget = hasUpdate && nextState.position !== null && nextState.position === confirmed.target;
      const settledAfterConfirm = confirmed.confirmed && stateChanged && !nextState.moving;
      const direction = confirmed.direction;
      const movedToward = positionChanged && nextState.position !== null && (confirmed.initialPosition === null || (nextState.position - confirmed.initialPosition) * direction > 0);
      const movingInDirection = stateChanged && (direction > 0 && nextState.opening || direction < 0 && nextState.closing);
      if (movingInDirection) {
        confirmed.expires = Infinity;
        confirmed.confirmed = true;
      }
      if (!stopConfirmed && !settledAfterConfirm && !movedToward && !reachedTarget && (!movingInDirection || !positionChanged)) {
        return;
      }
      entry.intent = null;
      entry.error = "";
    } else if (!positionChanged) {
      return;
    }
    setMotionTo(entry, nextState.position);
  }
  function begin(service, token) {
    const entry = items.get(service.entityId);
    if (!entry) {
      return;
    }
    advanceMotion(entry, now());
    entry.error = "";
    entry.token = token;
    if (entry.draft !== null) {
      entry.position = entry.draft;
      entry.motion = null;
      entry.draft = null;
    }
    const stop = service.service === "stop_cover";
    const target = stop ? entry.position : service.service === "open_cover" ? 100 : service.service === "close_cover" ? 0 : service.data.position;
    const fromPosition = entry.position ?? 0;
    entry.intent = {
      stop,
      target,
      confirmed: false,
      direction: Math.sign((target ?? fromPosition) - (target === fromPosition ? entry.actual.position ?? fromPosition : fromPosition)),
      initialPosition: entry.actual.position,
      expires: now() + 15000
    };
    if (stop) {
      entry.motion = null;
    } else {
      entry.position = fromPosition;
      setMotionTo(entry, target, Math.max(420, Math.abs(target - fromPosition) / 100 * travelTime), true);
    }
  }
  function fail(entityId, token, error) {
    const entry = items.get(entityId);
    if (!entry || entry.token !== token) {
      return false;
    } else {
      entry.intent = null;
      entry.error = error;
      setMotionTo(entry, entry.actual.position);
      return true;
    }
  }
  function read(entityId, fallback) {
    const entry = items.get(entityId);
    if (!entry) {
      return fallback;
    }
    const actual = entry.actual;
    const intent = entry.intent;
    const isOpening = intent ? !intent.stop && intent.direction > 0 && !!entry.motion : actual.opening;
    const closing = intent ? !intent.stop && intent.direction < 0 && !!entry.motion : actual.closing;
    const state = entry.draft !== null ? entry.draft === 0 ? "closed" : "open" : intent ? isOpening ? "opening" : closing ? "closing" : entry.position === 0 ? "closed" : "open" : actual.state;
    return {
      ...actual,
      state,
      position: entry.draft ?? entry.position,
      opening: isOpening,
      closing,
      moving: isOpening || closing,
      on: actual.available && (isOpening || (entry.draft ?? entry.position ?? 0) > 0),
      preview: !!intent,
      error: entry.error
    };
  }
  function tick(nowMs = now()) {
    let changed = false;
    for (const [entityId, entry] of items) {
      if (entry.intent?.expires <= nowMs) {
        changed = fail(entityId, entry.token, "") || changed;
      }
      changed = advanceMotion(entry, nowMs) || changed;
    }
    return changed;
  }
  function nextDelay(nowMs = now()) {
    let delay = Infinity;
    for (const entry of items.values()) {
      delay = Math.min(delay, entry.motion ? 1000 / 30 : Infinity, entry.intent ? Math.max(0, entry.intent.expires - nowMs) : Infinity);
    }
    return delay;
  }
  function retain(entityIds) {
    const has = new Set(entityIds);
    for (const entityId of items.keys()) {
      if (!has.has(entityId)) {
        items.delete(entityId);
      }
    }
  }
  function preview(entityId, position) {
    const entry = items.get(entityId);
    if (entry) {
      entry.draft = Number.isFinite(position) ? Math.max(0, Math.min(100, position)) : null;
    }
  }
  return {
    sync,
    begin,
    fail,
    read,
    tick,
    nextDelay,
    retain,
    preview,
    clear: () => items.clear()
  };
}
