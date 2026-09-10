const S = new URL(import.meta.url.startsWith("file:") ? "../../static/modules/interaction3d/page-behavior.js?v=20260910-full-page-behavior-v1" : "/bridge-static/modules/interaction3d/page-behavior.js?v=20260910-full-page-behavior-v1", import.meta.url);
export const {
  resolvePageBehavior
} = await import(S.href);
export function createIdleRotation({
  now = () => performance.now(),
  returnToBase: arg20,
  start: arg21,
  rotate: arg22,
  stop: arg23
}) {
  let config = {
    enabled: false,
    idleSeconds: 30,
    speed: 6,
    direction: "clockwise"
  };
  let available = false;
  let held = false;
  let hidden = "waiting";
  let disposed = now();
  let lastActivityAt = 0;
  let value5 = 0;
  let value6 = 0;
  let value7 = 0;
  function activity(arg16 = now()) {
    const value4 = hidden === "returning" || hidden === "rotating";
    value7++;
    hidden = "waiting";
    disposed = arg16;
    lastActivityAt = 0;
    value5 = 0;
    value6 = 0;
    if (value4) {
      arg23();
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
        if (hidden === "waiting" && at - disposed >= config.idleSeconds * 1000) {
          hidden = "returning";
          const value3 = ++value7;
          arg20(() => {
            if (value3 === value7 && hidden === "returning" && !!available && !held && !!config.enabled) {
              hidden = "rotating";
              lastActivityAt = now();
              value5 = 0;
              value6 = 0;
              arg21();
            }
          });
        } else if (hidden === "rotating") {
          const value = Math.max(0, Math.min(0.1, (at - lastActivityAt) / 1000));
          lastActivityAt = at;
          const value2 = Math.min(1, value6 / 0.6);
          value6 += value;
          value5 = (value5 + value * config.speed * Math.PI / 180 * (value2 + Math.min(1, value6 / 0.6)) / 2) % (Math.PI * 2);
          arg22(config.direction === "counterclockwise" ? -value5 : value5);
        }
      }
    },
    dispose() {
      available = false;
      activity();
    },
    nextDelay(arg = now()) {
      if (!config.enabled || !available || held) {
        return Infinity;
      } else if (hidden === "rotating") {
        return 0;
      } else if (hidden === "waiting") {
        return Math.max(0, disposed + config.idleSeconds * 1000 - arg);
      } else {
        return Infinity;
      }
    },
    get phase() {
      return hidden;
    }
  };
}
export function createIdleFocusExit({
  now: arg25 = () => performance.now(),
  onExit: arg24
} = {}) {
  let enabled3 = {
    enabled: false,
    idleSeconds: 30
  };
  let value8 = false;
  let value9 = false;
  let value10 = false;
  let value11 = false;
  let value12 = arg25();
  function activity2(arg17 = arg25()) {
    if (!value10) {
      value12 = arg17;
      value11 = false;
    }
  }
  return {
    configure(idleSeconds = {}, arg2 = arg25()) {
      if (value10) {
        return;
      }
      const enabled = {
        enabled: idleSeconds?.enabled === true,
        idleSeconds: Number.isInteger(idleSeconds?.idleSeconds) ? Math.max(1, Math.min(3600, idleSeconds.idleSeconds)) : 30
      };
      if (enabled.enabled !== enabled3.enabled || enabled.idleSeconds !== enabled3.idleSeconds) {
        enabled3 = enabled;
        activity2(arg2);
      }
    },
    setAvailable(arg3, arg4 = arg25()) {
      if (!value10 && value8 !== !!arg3) {
        value8 = !!arg3;
        if (!value8) {
          value9 = false;
        }
        activity2(arg4);
      }
    },
    hold(arg5, arg6 = arg25()) {
      if (!value10) {
        value9 = !!arg5;
        activity2(arg6);
      }
    },
    activity: activity2,
    tick(arg7 = arg25()) {
      if (!value10 && !!enabled3.enabled && !!value8 && !value9 && !value11) {
        if (arg7 - value12 >= enabled3.idleSeconds * 1000) {
          value11 = true;
          arg24();
        }
      }
    },
    nextDelay(arg8 = arg25()) {
      if (value10 || !enabled3.enabled || !value8 || value9 || value11) {
        return Infinity;
      } else {
        return Math.max(0, value12 + enabled3.idleSeconds * 1000 - arg8);
      }
    },
    dispose() {
      value10 = true;
      value8 = false;
      value9 = false;
    }
  };
}
export function createIdleIconVisibility({
  now: arg26 = () => performance.now(),
  onChange: arg27 = () => {}
} = {}) {
  let enabled4 = {
    enabled: false,
    idleSeconds: 30
  };
  let value13 = false;
  let value14 = false;
  let value15 = false;
  let value16 = false;
  let value17 = arg26();
  function fn(arg18) {
    if (value15 !== arg18) {
      value15 = arg18;
      arg27(value15);
    }
  }
  function activity3(arg19 = arg26()) {
    if (!value16) {
      value17 = arg19;
      fn(false);
    }
  }
  return {
    configure(idleSeconds2 = {}, arg9 = arg26()) {
      if (value16) {
        return;
      }
      const enabled2 = {
        enabled: idleSeconds2?.enabled === true,
        idleSeconds: Number.isInteger(idleSeconds2?.idleSeconds) ? Math.max(1, Math.min(3600, idleSeconds2.idleSeconds)) : 30
      };
      if (enabled2.enabled !== enabled4.enabled || enabled2.idleSeconds !== enabled4.idleSeconds) {
        enabled4 = enabled2;
        activity3(arg9);
      }
    },
    setAvailable(arg10, arg11 = arg26()) {
      if (!value16 && value13 !== !!arg10) {
        value13 = !!arg10;
        if (!value13) {
          value14 = false;
        }
        activity3(arg11);
      }
    },
    hold(arg12, arg13 = arg26()) {
      if (!value16) {
        value14 = !!arg12;
        activity3(arg13);
      }
    },
    activity: activity3,
    tick(arg14 = arg26()) {
      if (!value16 && !!enabled4.enabled && !!value13 && !value14) {
        if (arg14 - value17 >= enabled4.idleSeconds * 1000) {
          fn(true);
        }
      }
    },
    dispose() {
      if (!value16) {
        value16 = true;
        value13 = false;
        value14 = false;
        fn(false);
      }
    },
    get hidden() {
      return value15;
    },
    nextDelay(arg15 = arg26()) {
      if (value16 || !enabled4.enabled || !value13 || value14 || value15) {
        return Infinity;
      } else {
        return Math.max(0, value17 + enabled4.idleSeconds * 1000 - arg15);
      }
    }
  };
}
