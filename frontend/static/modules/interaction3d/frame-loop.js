export function createDemandFrameLoop({
  step,
  onWake = () => {},
  now = () => performance.now(),
  requestFrame = (cb) => requestAnimationFrame(cb),
  cancelFrame = (id) => cancelAnimationFrame(id),
  schedule = (cb, ms) => setTimeout(cb, ms),
  cancel = (id) => clearTimeout(id),
}) {
  let frameId = null;
  let timerId = null;
  let available = true;
  let disposed = false;
  let stepping = false;
  let wakeDuringStep = false;
  const stats = {
    frames: 0,
    deadlines: 0,
  };

  function clearPending() {
    if (frameId !== null) {
      cancelFrame(frameId);
    }
    if (timerId !== null) {
      cancel(timerId);
    }
    frameId = timerId = null;
  }

  function wake() {
    if (disposed || !available) {
      return;
    }
    if (stepping) {
      wakeDuringStep = true;
      return;
    }
    if (timerId !== null) {
      cancel(timerId);
    }
    timerId = null;
    if (frameId === null) {
      onWake();
      frameId = requestFrame(onFrame);
    }
  }

  function onFrame(timestamp = now()) {
    frameId = null;
    if (disposed || !available) {
      return;
    }
    stepping = true;
    wakeDuringStep = false;
    stats.frames++;
    let delay = Infinity;
    try {
      delay = step(timestamp);
    } finally {
      stepping = false;
    }
    if (!disposed && available) {
      if (wakeDuringStep || delay <= 0) {
        frameId = requestFrame(onFrame);
      } else if (Number.isFinite(delay)) {
        timerId = schedule(() => {
          timerId = null;
          stats.deadlines++;
          wake();
        }, delay);
      }
    }
  }

  return {
    wake,
    stats,
    setAvailable(next) {
      if (!disposed && available !== !!next) {
        available = !!next;
        if (available) {
          wake();
        } else {
          clearPending();
        }
      }
    },
    dispose() {
      disposed = true;
      clearPending();
    },
    get pending() {
      return frameId !== null || timerId !== null;
    },
  };
}
