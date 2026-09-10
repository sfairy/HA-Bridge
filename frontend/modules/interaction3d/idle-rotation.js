const pageBehaviorModuleUrl = new URL(import.meta.url.startsWith("file:") ? "../../static/modules/interaction3d/page-behavior.js?v=20260910-full-page-behavior-v1" : "/bridge-static/modules/interaction3d/page-behavior.js?v=20260910-full-page-behavior-v1", import.meta.url);
export const {
  resolvePageBehavior
} = await import(pageBehaviorModuleUrl.href);
export function createIdleRotation({
  now = () => performance.now(),
  returnToBase,
  start,
  rotate,
  stop
}) {
  let config = {
    enabled: false,
    idleSeconds: 30,
    speed: 6,
    direction: "clockwise"
  };
  let available = false;
  let held = false;
  let currentPhase = "waiting";
  let idleSince = now();
  let lastTickAt = 0;
  let angle = 0;
  let rampElapsed = 0;
  let generation = 0;
  function activity(at = now()) {
    const wasActive = currentPhase === "returning" || currentPhase === "rotating";
    generation++;
    currentPhase = "waiting";
    idleSince = at;
    lastTickAt = 0;
    angle = 0;
    rampElapsed = 0;
    if (wasActive) {
      stop();
    }
  }
  return {
    configure(nextConfig = {}, at = now()) {
      const normalized = {
        enabled: nextConfig?.enabled === true,
        direction: nextConfig?.direction === "counterclockwise" ? "counterclockwise" : "clockwise",
        idleSeconds: Number.isInteger(nextConfig?.idleSeconds) ? Math.max(1, Math.min(3600, nextConfig.idleSeconds)) : 30,
        speed: Number.isFinite(nextConfig?.speed) ? Math.max(0.5, Math.min(30, nextConfig.speed)) : 6
      };
      if (JSON.stringify(normalized) !== JSON.stringify(config)) {
        config = normalized;
        activity(at);
      }
    },
    setAvailable(nextAvailable, at = now()) {
      if (available !== !!nextAvailable) {
        available = !!nextAvailable;
        activity(at);
      }
    },
    hold(nextHeld, at = now()) {
      held = !!nextHeld;
      activity(at);
    },
    activity,
    tick(at = now()) {
      if (!!config.enabled && !!available && !held) {
        if (currentPhase === "waiting" && at - idleSince >= config.idleSeconds * 1000) {
          currentPhase = "returning";
          const token = ++generation;
          returnToBase(() => {
            if (token === generation && currentPhase === "returning" && !!available && !held && !!config.enabled) {
              currentPhase = "rotating";
              lastTickAt = now();
              angle = 0;
              rampElapsed = 0;
              start();
            }
          });
        } else if (currentPhase === "rotating") {
          const deltaSeconds = Math.max(0, Math.min(0.1, (at - lastTickAt) / 1000));
          lastTickAt = at;
          const rampFactor = Math.min(1, rampElapsed / 0.6);
          rampElapsed += deltaSeconds;
          angle = (angle + deltaSeconds * config.speed * Math.PI / 180 * (rampFactor + Math.min(1, rampElapsed / 0.6)) / 2) % (Math.PI * 2);
          rotate(config.direction === "counterclockwise" ? -angle : angle);
        }
      }
    },
    dispose() {
      available = false;
      activity();
    },
    nextDelay(at = now()) {
      if (!config.enabled || !available || held) {
        return Infinity;
      } else if (currentPhase === "rotating") {
        return 0;
      } else if (currentPhase === "waiting") {
        return Math.max(0, idleSince + config.idleSeconds * 1000 - at);
      } else {
        return Infinity;
      }
    },
    get phase() {
      return currentPhase;
    }
  };
}
export function createIdleFocusExit({
  now = () => performance.now(),
  onExit
} = {}) {
  let config = {
    enabled: false,
    idleSeconds: 30
  };
  let available = false;
  let held = false;
  let disposed = false;
  let exited = false;
  let lastActivityAt = now();
  function noteActivity(at = now()) {
    if (!disposed) {
      lastActivityAt = at;
      exited = false;
    }
  }
  return {
    configure(nextConfig = {}, at = now()) {
      if (disposed) {
        return;
      }
      const normalized = {
        enabled: nextConfig?.enabled === true,
        idleSeconds: Number.isInteger(nextConfig?.idleSeconds) ? Math.max(1, Math.min(3600, nextConfig.idleSeconds)) : 30
      };
      if (normalized.enabled !== config.enabled || normalized.idleSeconds !== config.idleSeconds) {
        config = normalized;
        noteActivity(at);
      }
    },
    setAvailable(nextAvailable, at = now()) {
      if (!disposed && available !== !!nextAvailable) {
        available = !!nextAvailable;
        if (!available) {
          held = false;
        }
        noteActivity(at);
      }
    },
    hold(nextHeld, at = now()) {
      if (!disposed) {
        held = !!nextHeld;
        noteActivity(at);
      }
    },
    activity: noteActivity,
    tick(at = now()) {
      if (!disposed && !!config.enabled && !!available && !held && !exited) {
        if (at - lastActivityAt >= config.idleSeconds * 1000) {
          exited = true;
          onExit();
        }
      }
    },
    nextDelay(at = now()) {
      if (disposed || !config.enabled || !available || held || exited) {
        return Infinity;
      } else {
        return Math.max(0, lastActivityAt + config.idleSeconds * 1000 - at);
      }
    },
    dispose() {
      disposed = true;
      available = false;
      held = false;
    }
  };
}
export function createIdleIconVisibility({
  now = () => performance.now(),
  onChange = () => {}
} = {}) {
  let config = {
    enabled: false,
    idleSeconds: 30
  };
  let available = false;
  let held = false;
  let hidden = false;
  let disposed = false;
  let lastActivityAt = now();
  function setHidden(nextHidden) {
    if (hidden !== nextHidden) {
      hidden = nextHidden;
      onChange(hidden);
    }
  }
  function noteActivity(at = now()) {
    if (!disposed) {
      lastActivityAt = at;
      setHidden(false);
    }
  }
  return {
    configure(nextConfig = {}, at = now()) {
      if (disposed) {
        return;
      }
      const normalized = {
        enabled: nextConfig?.enabled === true,
        idleSeconds: Number.isInteger(nextConfig?.idleSeconds) ? Math.max(1, Math.min(3600, nextConfig.idleSeconds)) : 30
      };
      if (normalized.enabled !== config.enabled || normalized.idleSeconds !== config.idleSeconds) {
        config = normalized;
        noteActivity(at);
      }
    },
    setAvailable(nextAvailable, at = now()) {
      if (!disposed && available !== !!nextAvailable) {
        available = !!nextAvailable;
        if (!available) {
          held = false;
        }
        noteActivity(at);
      }
    },
    hold(nextHeld, at = now()) {
      if (!disposed) {
        held = !!nextHeld;
        noteActivity(at);
      }
    },
    activity: noteActivity,
    tick(at = now()) {
      if (!disposed && !!config.enabled && !!available && !held) {
        if (at - lastActivityAt >= config.idleSeconds * 1000) {
          setHidden(true);
        }
      }
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        available = false;
        held = false;
        setHidden(false);
      }
    },
    get hidden() {
      return hidden;
    },
    nextDelay(at = now()) {
      if (disposed || !config.enabled || !available || held || hidden) {
        return Infinity;
      } else {
        return Math.max(0, lastActivityAt + config.idleSeconds * 1000 - at);
      }
    }
  };
}
