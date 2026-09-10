export const PRESENCE_PAGES = [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]];
export function presenceVisibleOnPage(sensor, pageId) {
  const includes = sensor.displayPages ?? ["overview", "security"];
  return PRESENCE_PAGES.some(([id]) => id === pageId) && (includes === "all" || Array.isArray(includes) && includes.includes(pageId));
}
export function validPresenceRoute(route) {
  if (!Array.isArray(route) || route.length < 3 || route.length > 128 || route.some(point => !point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || Math.abs(point.x) > 1000000 || Math.abs(point.y) > 1000000)) {
    return false;
  }
  const first = route[0];
  if (new Set(route.map(point => point.x + "," + point.y)).size !== route.length) {
    return false;
  } else {
    return route.slice(1, -1).some((point, index) => {
      const next = route[index + 2];
      return Math.abs((point.x - first.x) * (next.y - first.y) - (point.y - first.y) * (next.x - first.x)) > 0.000001;
    });
  }
}
export function snapsToPresenceStart(route, point, scale, threshold = 16) {
  return validPresenceRoute(route) && !!point && Math.hypot(point.x - route[0].x, point.y - route[0].y) * Math.abs(scale) <= threshold;
}
export function presenceIsActive(newState) {
  const available = newState?.newState || newState;
  return available?.available !== false && available?.state === "on";
}
export function createPresenceTriggers(getNow = () => Date.now()) {
  const triggers = new Map();
  return {
    sync(sensors, states) {
      const keepIds = new Set(sensors.map(sensor => sensor.id));
      for (const id of triggers.keys()) {
        if (!keepIds.has(id)) {
          triggers.delete(id);
        }
      }
      for (const sensor of sensors) {
        const state = states[sensor.entityId]?.newState || states[sensor.entityId];
        if (sensor.entityId?.startsWith("event.")) {
          const started = /^\d{4}-\d{2}-\d{2}T/.test(state?.state || "") ? Date.parse(state.state) : NaN;
          triggers.set(sensor.id, {
            entityId: sensor.entityId,
            on: state?.available !== false && Number.isFinite(started),
            started,
            duration: sensor.displayDuration > 0 ? sensor.displayDuration : 30
          });
          continue;
        }
        const on = presenceIsActive(state);
        const previous = triggers.get(sensor.id);
        const parsed = Date.parse(state?.lastChanged || state?.last_changed || "");
        const timestamp = Number.isFinite(parsed) ? Math.min(parsed, getNow()) : null;
        if (!previous || previous.entityId !== sensor.entityId || on && (!previous.on || timestamp !== null && timestamp !== previous.timestamp)) {
          triggers.set(sensor.id, {
            entityId: sensor.entityId,
            on,
            timestamp,
            started: timestamp ?? getNow(),
            duration: sensor.displayDuration ?? 0
          });
        } else {
          previous.on = on;
          previous.duration = sensor.displayDuration ?? 0;
        }
      }
    },
    visible(id) {
      const trigger = triggers.get(id);
      return !!trigger?.on && getNow() >= trigger.started && (!trigger.duration || getNow() - trigger.started < trigger.duration * 1000);
    }
  };
}
export function closedPath(points) {
  const segments = [];
  let offset = 0;
  for (let i = 0; i < points.length; i++) {
    const from = points[i];
    const to = points[(i + 1) % points.length];
    const length = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
    if (length > 1e-8) {
      segments.push({
        a: from,
        b: to,
        start: offset,
        length
      });
      offset += length;
    }
  }
  return {
    length: offset,
    segments
  };
}
export function sampleClosedPath(path, distance) {
  if (!(path.length > 0)) {
    return null;
  }
  const wrapped = (distance % path.length + path.length) % path.length;
  const segment = path.segments.find(entry => wrapped < entry.start + entry.length) || path.segments.at(-1);
  const t = (wrapped - segment.start) / segment.length;
  return {
    x: segment.a.x + (segment.b.x - segment.a.x) * t,
    y: segment.a.y + (segment.b.y - segment.a.y) * t,
    z: segment.a.z + (segment.b.z - segment.a.z) * t,
    heading: Math.atan2(segment.b.x - segment.a.x, segment.b.z - segment.a.z)
  };
}
