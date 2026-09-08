export function createIdleRotation({
  now = () => performance.now(),
  returnToBase,
  start,
  rotate,
  stop,
}) {
  let config = {
    enabled: false,
    idleSeconds: 30,
    speed: 6,
    direction: "clockwise",
  };
  let available = false;
  let held = false;
  let phase = "waiting";
  let waitStartedAt = now();
  let lastRotateAt = 0;
  let angle = 0;
  let rotateElapsed = 0;
  let generation = 0;
  function resetActivity(at = now()) {
    const wasActive = phase === "returning" || phase === "rotating";
    generation++;
    phase = "waiting";
    waitStartedAt = at;
    lastRotateAt = 0;
    angle = 0;
    rotateElapsed = 0;
    if (wasActive) {
      stop();
    }
  }
  return {
    configure(nextConfig = {}, at = now()) {
      const normalized = {
        enabled: nextConfig?.enabled === true,
        direction:
          nextConfig?.direction === "counterclockwise"
            ? "counterclockwise"
            : "clockwise",
        idleSeconds: Number.isInteger(nextConfig?.idleSeconds)
          ? Math.max(1, Math.min(3600, nextConfig.idleSeconds))
          : 30,
        speed: Number.isFinite(nextConfig?.speed)
          ? Math.max(0.5, Math.min(30, nextConfig.speed))
          : 6,
      };
      if (JSON.stringify(normalized) !== JSON.stringify(config)) {
        config = normalized;
        resetActivity(at);
      }
    },
    setAvailable(nextAvailable, at = now()) {
      if (available !== !!nextAvailable) {
        available = !!nextAvailable;
        resetActivity(at);
      }
    },
    hold(nextHeld, at = now()) {
      held = !!nextHeld;
      resetActivity(at);
    },
    activity: resetActivity,
    tick(at = now()) {
      if (!!config.enabled && !!available && !held) {
        if (phase === "waiting" && at - waitStartedAt >= config.idleSeconds * 1000) {
          phase = "returning";
          const token = ++generation;
          returnToBase(() => {
            if (
              token === generation &&
              phase === "returning" &&
              !!available &&
              !held &&
              !!config.enabled
            ) {
              phase = "rotating";
              lastRotateAt = now();
              angle = 0;
              rotateElapsed = 0;
              start();
            }
          });
        } else if (phase === "rotating") {
          const deltaSeconds = Math.max(0, Math.min(0.1, (at - lastRotateAt) / 1000));
          lastRotateAt = at;
          const ramp = Math.min(1, rotateElapsed / 0.6);
          rotateElapsed += deltaSeconds;
          angle =
            (angle +
              (((deltaSeconds * config.speed * Math.PI) / 180) *
                (ramp + Math.min(1, rotateElapsed / 0.6))) /
                2) %
            (Math.PI * 2);
          rotate(config.direction === "counterclockwise" ? -angle : angle);
        }
      }
    },
    dispose() {
      available = false;
      resetActivity();
    },
    nextDelay(at = now()) {
      if (!config.enabled || !available || held) {
        return Infinity;
      } else if (phase === "rotating") {
        return 0;
      } else if (phase === "waiting") {
        return Math.max(0, waitStartedAt + config.idleSeconds * 1000 - at);
      } else {
        return Infinity;
      }
    },
    get phase() {
      return phase;
    },
  };
}
export function createIdleIconVisibility({
  now = () => performance.now(),
  onChange = () => {},
} = {}) {
  let config = {
    enabled: false,
    idleSeconds: 30,
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
  function resetActivity(at = now()) {
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
        idleSeconds: Number.isInteger(nextConfig?.idleSeconds)
          ? Math.max(1, Math.min(3600, nextConfig.idleSeconds))
          : 30,
      };
      if (normalized.enabled !== config.enabled || normalized.idleSeconds !== config.idleSeconds) {
        config = normalized;
        resetActivity(at);
      }
    },
    setAvailable(nextAvailable, at = now()) {
      if (!disposed && available !== !!nextAvailable) {
        available = !!nextAvailable;
        if (!available) {
          held = false;
        }
        resetActivity(at);
      }
    },
    hold(nextHeld, at = now()) {
      if (!disposed) {
        held = !!nextHeld;
        resetActivity(at);
      }
    },
    activity: resetActivity,
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
    },
  };
}
