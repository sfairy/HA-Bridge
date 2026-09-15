export function createDemandFrameLoop({
  step: step,
  onWake: onWake = () => {},
  now: now = () => performance.now(),
  requestFrame: requestFrame = rafCallback => requestAnimationFrame(rafCallback),
  cancelFrame: cancelFrame = rafHandle => cancelAnimationFrame(rafHandle),
  schedule: schedule = (timerCallback, delayMs) => setTimeout(timerCallback, delayMs),
  cancel: cancel = timerId => clearTimeout(timerId)
}) {
  let frameHandle = null;
  let deadlineTimerId = null;
  let isAvailable = true;
  let isDisposed = false;
  let isStepping = false;
  let wakeRequested = false;
  const stats = {
    frames: 0,
    deadlines: 0
  };
  function cancelScheduled() {
    if (frameHandle !== null) {
      cancelFrame(frameHandle);
    }
    if (deadlineTimerId !== null) {
      cancel(deadlineTimerId);
    }
    frameHandle = deadlineTimerId = null;
  }
  function wake() {
    if (!isDisposed && !!isAvailable) {
      if (isStepping) {
        wakeRequested = true;
        return;
      }
      if (deadlineTimerId !== null) {
        cancel(deadlineTimerId);
      }
      deadlineTimerId = null;
      if (frameHandle === null) {
        onWake();
        frameHandle = requestFrame(handleFrame);
      }
    }
  }
  function handleFrame(timestamp = now()) {
    frameHandle = null;
    if (isDisposed || !isAvailable) {
      return;
    }
    isStepping = true;
    wakeRequested = false;
    stats.frames++;
    let nextDelayMs = Infinity;
    try {
      nextDelayMs = step(timestamp);
    } finally {
      isStepping = false;
    }
    if (!isDisposed && !!isAvailable) {
      if (wakeRequested || nextDelayMs <= 0) {
        frameHandle = requestFrame(handleFrame);
      } else if (Number.isFinite(nextDelayMs)) {
        deadlineTimerId = schedule(() => {
          deadlineTimerId = null;
          stats.deadlines++;
          wake();
        }, nextDelayMs);
      }
    }
  }
  return {
    wake: wake,
    stats: stats,
    setAvailable(isAvailableNext) {
      if (!isDisposed && isAvailable !== !!isAvailableNext) {
        isAvailable = !!isAvailableNext;
        if (isAvailable) {
          wake();
        } else {
          cancelScheduled();
        }
      }
    },
    dispose() {
      isDisposed = true;
      cancelScheduled();
    },
    get pending() {
      return frameHandle !== null || deadlineTimerId !== null;
    }
  };
}
