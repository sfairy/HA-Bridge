export const PRESENCE_PAGES = [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]];
export function presenceVisibleOnPage(displayPages, arg5) {
  const includes = displayPages.displayPages ?? ["overview", "security"];
  return PRESENCE_PAGES.some(([arg2]) => arg2 === arg5) && (includes === "all" || Array.isArray(includes) && includes.includes(arg5));
}
export function validPresenceRoute(length2) {
  if (!Array.isArray(length2) || length2.length < 3 || length2.length > 128 || length2.some(x3 => !x3 || !Number.isFinite(x3.x) || !Number.isFinite(x3.y) || Math.abs(x3.x) > 1000000 || Math.abs(x3.y) > 1000000)) {
    return false;
  }
  const x6 = length2[0];
  if (new Set(length2.map(x => x.x + "," + x.y)).size !== length2.length) {
    return false;
  } else {
    return length2.slice(1, -1).some((x2, arg) => {
      const y = length2[arg + 2];
      return Math.abs((x2.x - x6.x) * (y.y - x6.y) - (x2.y - x6.y) * (y.x - x6.x)) > 0.000001;
    });
  }
}
export function snapsToPresenceStart(arg6, x7, arg7, arg8 = 16) {
  return validPresenceRoute(arg6) && !!x7 && Math.hypot(x7.x - arg6[0].x, x7.y - arg6[0].y) * Math.abs(arg7) <= arg8;
}
export function presenceIsActive(newState) {
  const available = newState?.newState || newState;
  return available?.available !== false && available?.state === "on";
}
export function createPresenceTriggers(arg9 = () => Date.now()) {
  const map = new Map();
  return {
    sync(map, arg3) {
      const has = new Set(map.map(id => id.id));
      for (const value2 of map.keys()) {
        if (!has.has(value2)) {
          map.delete(value2);
        }
      }
      for (const entityId of map) {
        const state = arg3[entityId.entityId]?.newState || arg3[entityId.entityId];
        if (entityId.entityId?.startsWith("event.")) {
          const started = /^\d{4}-\d{2}-\d{2}T/.test(state?.state || "") ? Date.parse(state.state) : NaN;
          map.set(entityId.id, {
            entityId: entityId.entityId,
            on: state?.available !== false && Number.isFinite(started),
            started,
            duration: entityId.displayDuration > 0 ? entityId.displayDuration : 30
          });
          continue;
        }
        const on = presenceIsActive(state);
        const on2 = map.get(entityId.id);
        const value = Date.parse(state?.lastChanged || state?.last_changed || "");
        const timestamp = Number.isFinite(value) ? Math.min(value, arg9()) : null;
        if (!on2 || on2.entityId !== entityId.entityId || on && (!on2.on || timestamp !== null && timestamp !== on2.timestamp)) {
          map.set(entityId.id, {
            entityId: entityId.entityId,
            on,
            timestamp,
            started: timestamp ?? arg9(),
            duration: entityId.displayDuration ?? 0
          });
        } else {
          on2.on = on;
          on2.duration = entityId.displayDuration ?? 0;
        }
      }
    },
    visible(arg4) {
      const started2 = map.get(arg4);
      return !!started2?.on && arg9() >= started2.started && (!started2.duration || arg9() - started2.started < started2.duration * 1000);
    }
  };
}
export function closedPath(length3) {
  const push = [];
  let start2 = 0;
  for (let value3 = 0; value3 < length3.length; value3++) {
    const x4 = length3[value3];
    const x5 = length3[(value3 + 1) % length3.length];
    const length = Math.hypot(x5.x - x4.x, x5.y - x4.y, x5.z - x4.z);
    if (length > 1e-8) {
      push.push({
        a: x4,
        b: x5,
        start: start2,
        length
      });
      start2 += length;
    }
  }
  return {
    length: start2,
    segments: push
  };
}
export function sampleClosedPath(length4, arg10) {
  if (!(length4.length > 0)) {
    return null;
  }
  const value4 = (arg10 % length4.length + length4.length) % length4.length;
  const a = length4.segments.find(start => value4 < start.start + start.length) || length4.segments.at(-1);
  const value5 = (value4 - a.start) / a.length;
  return {
    x: a.a.x + (a.b.x - a.a.x) * value5,
    y: a.a.y + (a.b.y - a.a.y) * value5,
    z: a.a.z + (a.b.z - a.a.z) * value5,
    heading: Math.atan2(a.b.x - a.a.x, a.b.z - a.a.z)
  };
}
