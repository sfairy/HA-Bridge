const isFiniteNumber = (value) => value != null && value !== "" && Number.isFinite(Number(value));
const colorModes = new Set([
  "hs",
  "xy",
  "rgb",
  "rgbw",
  "rgbww",
  "white",
  "brightness",
  "onoff",
]);
export function lightState(entityId, eventOrState, previous = undefined) {
  const statePayload = eventOrState?.newState || eventOrState || {};
  const attributes = statePayload.attributes || {};
  const supportedColorModes = Array.isArray(attributes.supported_color_modes)
    ? attributes.supported_color_modes
    : [];
  const isLightEntity = entityId.startsWith("light.");
  const colorMode =
    isLightEntity && (attributes.color_mode === "color_temp" || colorModes.has(attributes.color_mode))
      ? attributes.color_mode
      : (previous?.colorMode ?? null);
  const brightnessSupported =
    isLightEntity &&
    (supportedColorModes.length
      ? supportedColorModes.some((mode) => !["onoff", "unknown"].includes(mode))
      : isFiniteNumber(attributes.brightness) ||
        (Number(attributes.supported_features) & 1) !== 0 ||
        previous?.brightnessSupported === true);
  const temperatureSupported =
    isLightEntity &&
    (supportedColorModes.length
      ? supportedColorModes.includes("color_temp")
      : isFiniteNumber(attributes.color_temp_kelvin) ||
        isFiniteNumber(attributes.color_temp) ||
        isFiniteNumber(attributes.min_color_temp_kelvin) ||
        isFiniteNumber(attributes.max_color_temp_kelvin) ||
        (Number(attributes.supported_features) & 2) !== 0 ||
        previous?.temperatureSupported === true);
  const minimumKelvin = isFiniteNumber(attributes.min_color_temp_kelvin)
    ? Number(attributes.min_color_temp_kelvin)
    : Number(attributes.max_mireds) > 0
      ? 1000000 / Number(attributes.max_mireds)
      : (previous?.minimum ?? 2000);
  const maximumKelvin = isFiniteNumber(attributes.max_color_temp_kelvin)
    ? Number(attributes.max_color_temp_kelvin)
    : Number(attributes.min_mireds) > 0
      ? 1000000 / Number(attributes.min_mireds)
      : (previous?.maximum ?? 6500);
  const kelvinRaw =
    isFiniteNumber(attributes.color_temp_kelvin) && Number(attributes.color_temp_kelvin) > 0
      ? Number(attributes.color_temp_kelvin)
      : isFiniteNumber(attributes.color_temp) && Number(attributes.color_temp) > 0
        ? 1000000 / Number(attributes.color_temp)
        : (previous?.kelvin ?? null);
  const brightnessByte = isFiniteNumber(attributes.brightness)
    ? Math.max(0, Math.min(255, Number(attributes.brightness)))
    : null;
  const brightnessPercent =
    brightnessByte !== null && (statePayload.state !== "off" || brightnessByte !== 0)
      ? brightnessByte > 0
        ? Math.max(1, Math.round((brightnessByte / 255) * 100))
        : 0
      : previous?.brightness > 0
        ? previous.brightness
        : null;
  return {
    on: statePayload.state === "on",
    available: ["on", "off"].includes(statePayload.state),
    name: attributes.friendly_name || previous?.name || entityId,
    brightnessSupported,
    temperatureSupported,
    colorMode,
    brightness: brightnessSupported ? brightnessPercent : null,
    kelvin: temperatureSupported && isFiniteNumber(kelvinRaw) ? Math.round(kelvinRaw) : null,
    minimum: Math.round(Math.max(1000, Math.min(minimumKelvin, maximumKelvin))),
    maximum: Math.round(Math.min(20000, Math.max(minimumKelvin, maximumKelvin))),
  };
}
export function lightRenderState(state) {
  const missingBrightness = state.brightnessSupported && !Number.isFinite(state.brightness);
  const missingKelvin =
    state.temperatureSupported &&
    !colorModes.has(state.colorMode) &&
    !Number.isFinite(state.kelvin);
  return {
    ...state,
    on: state.on && !missingBrightness && !missingKelvin,
  };
}
const HISTORY_TTL_MS = 604800000;
const HISTORY_MAX_ENTITIES = 256;
const isLightOrSwitchEntity = (entityId) => /^(light|switch)\.[a-z0-9_]+$/.test(entityId);
const isPresentNumber = (value) => typeof value != "boolean" && isFiniteNumber(value);
const fieldValidators = {
  brightness: (value) => Number.isFinite(value) && value > 0 && value <= 100,
  kelvin: (value) => Number.isFinite(value) && value > 0,
  minimum: (value) => Number.isFinite(value) && value >= 1000 && value <= 20000,
  maximum: (value) => Number.isFinite(value) && value >= 1000 && value <= 20000,
  colorMode: (value) => value === "color_temp" || colorModes.has(value),
  brightnessSupported: (value) => typeof value == "boolean",
  temperatureSupported: (value) => typeof value == "boolean",
};
function extractHistoryPatch(entityId, eventOrState) {
  const statePayload = eventOrState?.newState || eventOrState || {};
  const attributes = statePayload.attributes || {};
  const resolved = lightState(entityId, eventOrState);
  const patch = {};
  const supportedColorModes = Array.isArray(attributes.supported_color_modes)
    ? attributes.supported_color_modes
    : [];
  const hasBrightness = isPresentNumber(attributes.brightness) && Number(attributes.brightness) > 0;
  const hasKelvin =
    (isPresentNumber(attributes.color_temp_kelvin) && Number(attributes.color_temp_kelvin) > 0) ||
    (isPresentNumber(attributes.color_temp) && Number(attributes.color_temp) > 0);
  const hasMinimum =
    (isPresentNumber(attributes.min_color_temp_kelvin) && Number(attributes.min_color_temp_kelvin) > 0) ||
    (isPresentNumber(attributes.max_mireds) && Number(attributes.max_mireds) > 0);
  const hasMaximum =
    (isPresentNumber(attributes.max_color_temp_kelvin) && Number(attributes.max_color_temp_kelvin) > 0) ||
    (isPresentNumber(attributes.min_mireds) && Number(attributes.min_mireds) > 0);
  const supportedFeatures = isPresentNumber(attributes.supported_features)
    ? Number(attributes.supported_features)
    : 0;
  if (supportedColorModes.length || hasBrightness || supportedFeatures & 1) {
    patch.brightnessSupported = resolved.brightnessSupported;
  }
  if (supportedColorModes.length || hasKelvin || hasMinimum || hasMaximum || supportedFeatures & 2) {
    patch.temperatureSupported = resolved.temperatureSupported;
  }
  if (hasBrightness && resolved.brightnessSupported) {
    patch.brightness = resolved.brightness;
  }
  if (hasKelvin && resolved.temperatureSupported) {
    patch.kelvin = resolved.kelvin;
  }
  if (hasMinimum) {
    patch.minimum = resolved.minimum;
  }
  if (hasMaximum) {
    patch.maximum = resolved.maximum;
  }
  if (attributes.color_mode === "color_temp" || colorModes.has(attributes.color_mode)) {
    patch.colorMode = resolved.colorMode;
  }
  return Object.fromEntries(
    Object.entries(patch).filter(([field, value]) => fieldValidators[field](value)),
  );
}
function createLightHistoryStore(storage, scope, now, schedule, cancel) {
  if (!storage || typeof scope != "string" || !scope.trim()) {
    return null;
  }
  const storageKey = "hb-i3d:light-history:v1:" + scope;
  const entities = new Map();
  const lastPatchJson = new Map();
  let writable = true;
  let flushTimer = null;
  let dirty = false;
  let nextExpiryAt = 0;
  const latestStamp = (fields) => Math.max(0, ...Object.values(fields).map((entry) => entry.at));
  function prune(nowMs) {
    if (nowMs < nextExpiryAt && entities.size <= HISTORY_MAX_ENTITIES) {
      return false;
    }
    let changed = false;
    nextExpiryAt = Infinity;
    for (const [entityId, fields] of entities) {
      for (const [field, entry] of Object.entries(fields)) {
        if (nowMs - entry.at >= HISTORY_TTL_MS) {
          delete fields[field];
          changed = true;
        } else {
          nextExpiryAt = Math.min(nextExpiryAt, entry.at + HISTORY_TTL_MS);
        }
      }
      if (!Object.keys(fields).length) {
        entities.delete(entityId);
      }
    }
    if (entities.size > HISTORY_MAX_ENTITIES) {
      const ranked = [...entities].sort(
        (left, right) => latestStamp(left[1]) - latestStamp(right[1]),
      );
      for (const [entityId] of ranked.slice(0, entities.size - HISTORY_MAX_ENTITIES)) {
        entities.delete(entityId);
      }
      changed = true;
    }
    return changed;
  }
  function loadFromStorage() {
    const loaded = new Map();
    const raw = storage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const nowMs = now();
      if (
        parsed?.version !== 1 ||
        !parsed.entities ||
        typeof parsed.entities != "object" ||
        Array.isArray(parsed.entities)
      ) {
        throw new Error("Invalid light history");
      }
      for (const [entityId, fields] of Object.entries(parsed.entities)) {
        if (!isLightOrSwitchEntity(entityId) || !fields || typeof fields != "object" || Array.isArray(fields)) {
          continue;
        }
        const kept = {};
        for (const [field, entry] of Object.entries(fields)) {
          if (
            Object.hasOwn(fieldValidators, field) &&
            fieldValidators[field](entry?.value) &&
            Number.isFinite(entry.at) &&
            entry.at >= 0 &&
            entry.at <= nowMs &&
            nowMs - entry.at < HISTORY_TTL_MS
          ) {
            kept[field] = {
              value: entry.value,
              at: entry.at,
            };
          }
        }
        if (Object.keys(kept).length) {
          loaded.set(entityId, kept);
        }
      }
    }
    return loaded;
  }
  try {
    for (const [entityId, fields] of loadFromStorage()) {
      entities.set(entityId, fields);
    }
    prune(now());
  } catch {
    return null;
  }
  const serialize = () =>
    JSON.stringify({
      version: 1,
      entities: Object.fromEntries(entities),
    });
  function flush() {
    if (flushTimer !== null) {
      cancel(flushTimer);
      flushTimer = null;
    }
    if (!!writable && !!dirty) {
      dirty = false;
      try {
        for (const [entityId, storedFields] of loadFromStorage()) {
          const merged = entities.get(entityId) || {};
          for (const [field, entry] of Object.entries(storedFields)) {
            if (!merged[field] || merged[field].at < entry.at) {
              merged[field] = entry;
            }
          }
          if (merged.brightnessSupported?.value === false) {
            delete merged.brightness;
          }
          if (merged.temperatureSupported?.value === false) {
            delete merged.kelvin;
          }
          entities.set(entityId, merged);
        }
        nextExpiryAt = 0;
        prune(now());
        storage.setItem(storageKey, serialize());
      } catch {
        writable = false;
      }
    }
  }
  function scheduleFlush() {
    if (!!writable && flushTimer === null && !!dirty) {
      flushTimer = schedule(() => {
        flushTimer = null;
        flush();
      });
    }
  }
  return {
    resolve(entityId, eventOrState) {
      const nowMs = now();
      dirty = prune(nowMs) || dirty;
      if (isLightOrSwitchEntity(entityId)) {
        const patch = extractHistoryPatch(entityId, eventOrState);
        const patchJson = JSON.stringify(patch);
        if (lastPatchJson.get(entityId) !== patchJson) {
          lastPatchJson.delete(entityId);
          lastPatchJson.set(entityId, patchJson);
          const fields = entities.get(entityId) || {};
          for (const [field, value] of Object.entries(patch)) {
            if (fields[field]?.value !== value) {
              fields[field] = {
                value,
                at: nowMs,
              };
              nextExpiryAt = Math.min(nextExpiryAt, nowMs + HISTORY_TTL_MS);
              dirty = true;
            }
          }
          if (patch.brightnessSupported === false && fields.brightness) {
            delete fields.brightness;
            dirty = true;
          }
          if (patch.temperatureSupported === false && fields.kelvin) {
            delete fields.kelvin;
            dirty = true;
          }
          if (Object.keys(fields).length) {
            entities.set(entityId, fields);
          }
          while (lastPatchJson.size > HISTORY_MAX_ENTITIES) {
            lastPatchJson.delete(lastPatchJson.keys().next().value);
          }
        }
      }
      dirty = prune(nowMs) || dirty;
      scheduleFlush();
      const remembered = Object.fromEntries(
        Object.entries(entities.get(entityId) || {}).map(([field, entry]) => [
          field,
          entry.value,
        ]),
      );
      remembered.brightnessSupported ??=
        Number.isFinite(remembered.brightness) ||
        (!!remembered.colorMode && remembered.colorMode !== "onoff");
      remembered.temperatureSupported ??=
        Number.isFinite(remembered.kelvin) ||
        Number.isFinite(remembered.minimum) ||
        Number.isFinite(remembered.maximum) ||
        remembered.colorMode === "color_temp";
      return remembered;
    },
    flush,
    clear() {
      if (flushTimer !== null) {
        cancel(flushTimer);
        flushTimer = null;
      }
      entities.clear();
      lastPatchJson.clear();
      dirty = false;
      nextExpiryAt = Infinity;
      if (writable) {
        try {
          storage.removeItem(storageKey);
        } catch {
          writable = false;
        }
      }
    },
  };
}
export function createLightStateCache({
  storage,
  scope,
  now = () => Date.now(),
  schedule = (callback) => setTimeout(callback, 50),
  cancel = (timer) => clearTimeout(timer),
} = {}) {
  const liveStates = new Map();
  const history = createLightHistoryStore(storage, scope, now, schedule, cancel);
  return {
    resolve(entityId, eventOrState) {
      const previous = history
        ? {
            name: liveStates.get(entityId)?.name,
            ...history.resolve(entityId, eventOrState),
          }
        : liveStates.get(entityId);
      const resolved = lightState(entityId, eventOrState, previous);
      liveStates.set(
        entityId,
        resolved.brightness === 0
          ? {
              ...resolved,
              brightness: previous?.brightness > 0 ? previous.brightness : null,
            }
          : resolved,
      );
      return resolved;
    },
    flush() {
      history?.flush();
    },
    clear() {
      liveStates.clear();
      history?.clear();
    },
  };
}
export function lightCommand(entityId, kind, value, state) {
  if (!/^(light|switch)\.[a-z0-9_]+$/.test(entityId) || !state.available) {
    throw new Error("设备不可用。");
  }
  const domain = entityId.split(".")[0];
  if (kind === "power") {
    return {
      domain,
      service: value ? "turn_on" : "turn_off",
      entityId,
      data: {},
    };
  }
  if (!Number.isFinite(Number(value))) {
    throw new Error("灯光参数无效。");
  }
  if (kind === "brightness" && state.brightnessSupported) {
    return {
      domain,
      service: "turn_on",
      entityId,
      data: {
        brightness: Math.round(
          (Math.max(1, Math.min(100, Number(value))) * 255) / 100,
        ),
      },
    };
  }
  if (kind === "temperature" && state.temperatureSupported) {
    return {
      domain,
      service: "turn_on",
      entityId,
      data: {
        color_temp_kelvin: Math.round(
          Math.max(state.minimum, Math.min(state.maximum, Number(value))),
        ),
      },
    };
  }
  throw new Error("此设备不支持该灯光调节。");
}
export function createLightPreview({
  now = () => performance.now(),
} = {}) {
  const previews = new Map();
  let revisionCounter = 0;
  return {
    set(entityId, kind, value, committed = false) {
      const values = {
        ...previews.get(entityId)?.values,
        on: kind === "power" ? value === true : true,
      };
      if (kind === "brightness") {
        values.brightness = value;
      }
      if (kind === "temperature") {
        values.kelvin = value;
      }
      if (kind === "preset") {
        if (Number.isFinite(value?.brightness)) {
          values.brightness = value.brightness;
        }
        if (Number.isFinite(value?.kelvin)) {
          values.kelvin = value.kelvin;
        }
      }
      if (kind === "power" && !value) {
        delete values.brightness;
        delete values.kelvin;
      }
      const entry = {
        values,
        revision: ++revisionCounter,
        committed,
        expires: now() + 15000,
      };
      previews.set(entityId, entry);
      return entry.revision;
    },
    state(entityId, baseState) {
      return {
        ...baseState,
        ...previews.get(entityId)?.values,
      };
    },
    reconcile(entityId, liveState) {
      const entry = previews.get(entityId);
      if (!entry) {
        return;
      }
      const matched = Object.entries(entry.values).every(([field, expected]) =>
        field === "on"
          ? liveState.on === expected
          : Number.isFinite(liveState[field]) &&
            Math.abs(liveState[field] - expected) <= (field === "kelvin" ? 15 : 1),
      );
      if (!liveState.available || (entry.committed && matched)) {
        previews.delete(entityId);
      }
    },
    hold(entityId, revision) {
      const entry = previews.get(entityId);
      if (entry?.revision === revision) {
        entry.committed = false;
      }
    },
    retain(entityId, revision) {
      const entry = previews.get(entityId);
      if (entry?.revision === revision) {
        entry.committed = true;
        entry.expires = now() + 15000;
      }
    },
    acknowledge(entityId, revision) {
      const entry = previews.get(entityId);
      if (entry?.revision === revision) {
        entry.expires = now() + 8000;
      }
    },
    reject(entityId, revision) {
      if (previews.get(entityId)?.revision === revision) {
        previews.delete(entityId);
      }
    },
    expire() {
      let removed = false;
      for (const [entityId, entry] of previews) {
        if (entry.expires <= now()) {
          previews.delete(entityId);
          removed = true;
        }
      }
      return removed;
    },
    clear() {
      previews.clear();
    },
    nextDelay(at = now()) {
      let soonest = Infinity;
      for (const entry of previews.values()) {
        soonest = Math.min(soonest, entry.expires);
      }
      return Math.max(0, soonest - at);
    },
  };
}
