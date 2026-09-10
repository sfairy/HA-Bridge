export function createCoverFeedback({
  now: arg12 = () => performance.now(),
  travelTime: arg13 = 2000
} = {}) {
  const items = new Map();
  function fn(motion, arg) {
    if (!motion.motion) {
      return false;
    }
    const {
      from: value10,
      to: value11,
      start: value12,
      duration: value13,
      linear: value14
    } = motion.motion;
    const value15 = Math.max(0, Math.min(1, (arg - value12) / value13));
    const value16 = value14 ? value15 : value15 * value15 * (3 - value15 * 2);
    motion.position = value10 + (value11 - value10) * value16;
    if (value15 === 1) {
      motion.motion = null;
    }
    return true;
  }
  function fn2(position, to, duration = 420, linear = false) {
    fn(position, arg12());
    if (to === null) {
      position.motion = null;
      position.position = null;
      return;
    }
    if (position.position === null || position.position === to) {
      position.position = to;
      position.motion = null;
      return;
    }
    position.motion = {
      from: position.position,
      to,
      start: arg12(),
      duration,
      linear
    };
  }
  function sync(arg2, position2) {
    let intent3 = items.get(arg2);
    if (!intent3) {
      items.set(arg2, {
        actual: position2,
        position: position2.position,
        motion: null,
        intent: null,
        token: null,
        error: "",
        draft: null
      });
      return;
    }
    const raw2 = intent3.actual;
    const value17 = raw => Date.parse(raw.raw.last_updated ?? raw.raw.updatedAt ?? "");
    if (value17(position2) < value17(raw2)) {
      return;
    }
    intent3.actual = position2;
    if (!position2.available) {
      intent3.intent = null;
      intent3.draft = null;
      intent3.error = "";
      fn2(intent3, position2.position);
      return;
    }
    const value18 = position2.position !== raw2.position;
    const value19 = position2.state !== raw2.state;
    if (intent3.intent) {
      const confirmed = intent3.intent;
      const value = value18 || value19 || position2.raw.last_updated !== raw2.raw.last_updated || position2.raw.updatedAt !== raw2.raw.updatedAt;
      const value2 = confirmed.stop && value && !position2.moving;
      const value3 = value && position2.position !== null && position2.position === confirmed.target;
      const value4 = confirmed.confirmed && value19 && !position2.moving;
      const value5 = confirmed.direction;
      const value6 = value18 && position2.position !== null && (confirmed.initialPosition === null || (position2.position - confirmed.initialPosition) * value5 > 0);
      const value7 = value19 && (value5 > 0 && position2.opening || value5 < 0 && position2.closing);
      if (value7) {
        confirmed.expires = Infinity;
        confirmed.confirmed = true;
      }
      if (!value2 && !value4 && !value6 && !value3 && (!value7 || !value18)) {
        return;
      }
      intent3.intent = null;
      intent3.error = "";
    } else if (!value18) {
      return;
    }
    fn2(intent3, position2.position);
  }
  function begin(service, token) {
    const position3 = items.get(service.entityId);
    if (!position3) {
      return;
    }
    fn(position3, arg12());
    position3.error = "";
    position3.token = token;
    if (position3.draft !== null) {
      position3.position = position3.draft;
      position3.motion = null;
      position3.draft = null;
    }
    const stop = service.service === "stop_cover";
    const target = stop ? position3.position : service.service === "open_cover" ? 100 : service.service === "close_cover" ? 0 : service.data.position;
    const position4 = position3.position ?? 0;
    position3.intent = {
      stop,
      target,
      confirmed: false,
      direction: Math.sign((target ?? position4) - (target === position4 ? position3.actual.position ?? position4 : position4)),
      initialPosition: position3.actual.position,
      expires: arg12() + 15000
    };
    if (stop) {
      position3.motion = null;
    } else {
      position3.position = position4;
      fn2(position3, target, Math.max(420, Math.abs(target - position4) / 100 * arg13), true);
    }
  }
  function fail(arg3, arg4, error) {
    const token2 = items.get(arg3);
    if (!token2 || token2.token !== arg4) {
      return false;
    } else {
      token2.intent = null;
      token2.error = error;
      fn2(token2, token2.actual.position);
      return true;
    }
  }
  function read(arg5, arg6) {
    const draft = items.get(arg5);
    if (!draft) {
      return arg6;
    }
    const opening = draft.actual;
    const stop2 = draft.intent;
    const opening2 = stop2 ? !stop2.stop && stop2.direction > 0 && !!draft.motion : opening.opening;
    const closing = stop2 ? !stop2.stop && stop2.direction < 0 && !!draft.motion : opening.closing;
    const state = draft.draft !== null ? draft.draft === 0 ? "closed" : "open" : stop2 ? opening2 ? "opening" : closing ? "closing" : draft.position === 0 ? "closed" : "open" : opening.state;
    return {
      ...opening,
      state,
      position: draft.draft ?? draft.position,
      opening: opening2,
      closing,
      moving: opening2 || closing,
      on: opening.available && (opening2 || (draft.draft ?? draft.position ?? 0) > 0),
      preview: !!stop2,
      error: draft.error
    };
  }
  function tick(arg7 = arg12()) {
    let value20 = false;
    for (const [value8, intent] of items) {
      if (intent.intent?.expires <= arg7) {
        value20 = fail(value8, intent.token, "窗帘未响应，请重试。") || value20;
      }
      value20 = fn(intent, arg7) || value20;
    }
    return value20;
  }
  function nextDelay(arg8 = arg12()) {
    let value21 = Infinity;
    for (const intent2 of items.values()) {
      value21 = Math.min(value21, intent2.motion ? 1000 / 30 : Infinity, intent2.intent ? Math.max(0, intent2.intent.expires - arg8) : Infinity);
    }
    return value21;
  }
  function retain(arg9) {
    const has = new Set(arg9);
    for (const value9 of items.keys()) {
      if (!has.has(value9)) {
        items.delete(value9);
      }
    }
  }
  function preview(arg10, arg11) {
    const draft2 = items.get(arg10);
    if (draft2) {
      draft2.draft = Number.isFinite(arg11) ? Math.max(0, Math.min(100, arg11)) : null;
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
