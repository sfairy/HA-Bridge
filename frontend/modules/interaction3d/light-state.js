const isNumericValue = candidateValue =>
  candidateValue != null && candidateValue !== "" && Number.isFinite(Number(candidateValue));
const COLOR_MODE_SET = new Set([
  "hs",
  "xy",
  "rgb",
  "rgbw",
  "rgbww",
  "white",
  "brightness",
  "onoff"
]);
export function lightState(entityId, entityState, fallbackState) {
  const stateObject = entityState?.newState || entityState || {};
  const attributes = stateObject.attributes || {};
  const supportedColorModes = Array.isArray(attributes.supported_color_modes)
    ? attributes.supported_color_modes
    : [];
  const isLightDomain = entityId.startsWith("light.");
  const colorMode =
    isLightDomain &&
    (attributes.color_mode === "color_temp" || COLOR_MODE_SET.has(attributes.color_mode))
      ? attributes.color_mode
      : (fallbackState?.colorMode ?? null);
  const brightnessSupported =
    isLightDomain &&
    (supportedColorModes.length
      ? supportedColorModes.some(supportedMode => !["onoff", "unknown"].includes(supportedMode))
      : isNumericValue(attributes.brightness) ||
        (Number(attributes.supported_features) & 1) !== 0 ||
        fallbackState?.brightnessSupported === true);
  const temperatureSupported =
    isLightDomain &&
    (supportedColorModes.length
      ? supportedColorModes.includes("color_temp")
      : isNumericValue(attributes.color_temp_kelvin) ||
        isNumericValue(attributes.color_temp) ||
        isNumericValue(attributes.min_color_temp_kelvin) ||
        isNumericValue(attributes.max_color_temp_kelvin) ||
        (Number(attributes.supported_features) & 2) !== 0 ||
        fallbackState?.temperatureSupported === true);
  const minimumKelvin = isNumericValue(attributes.min_color_temp_kelvin)
    ? Number(attributes.min_color_temp_kelvin)
    : Number(attributes.max_mireds) > 0
      ? 1000000 / Number(attributes.max_mireds)
      : (fallbackState?.minimum ?? 2000);
  const maximumKelvin = isNumericValue(attributes.max_color_temp_kelvin)
    ? Number(attributes.max_color_temp_kelvin)
    : Number(attributes.min_mireds) > 0
      ? 1000000 / Number(attributes.min_mireds)
      : (fallbackState?.maximum ?? 6500);
  const kelvinValue =
    isNumericValue(attributes.color_temp_kelvin) && Number(attributes.color_temp_kelvin) > 0
      ? Number(attributes.color_temp_kelvin)
      : isNumericValue(attributes.color_temp) && Number(attributes.color_temp) > 0
        ? 1000000 / Number(attributes.color_temp)
        : (fallbackState?.kelvin ?? null);
  const rawBrightness = isNumericValue(attributes.brightness)
    ? Math.max(0, Math.min(255, Number(attributes.brightness)))
    : null;
  const brightnessPercent =
    rawBrightness !== null && (stateObject.state !== "off" || rawBrightness !== 0)
      ? rawBrightness > 0
        ? Math.max(1, Math.round((rawBrightness / 255) * 100))
        : 0
      : fallbackState?.brightness > 0
        ? fallbackState.brightness
        : null;
  return {
    on: stateObject.state === "on",
    available: ["on", "off"].includes(stateObject.state),
    name: attributes.friendly_name || fallbackState?.name || entityId,
    brightnessSupported: brightnessSupported,
    temperatureSupported: temperatureSupported,
    colorMode: colorMode,
    brightness: brightnessSupported ? brightnessPercent : null,
    kelvin: temperatureSupported && isNumericValue(kelvinValue) ? Math.round(kelvinValue) : null,
    minimum: Math.round(Math.max(1000, Math.min(minimumKelvin, maximumKelvin))),
    maximum: Math.round(Math.min(20000, Math.max(minimumKelvin, maximumKelvin)))
  };
}
export function lightRenderState(stateSnapshot) {
  const hasMissingBrightness =
    stateSnapshot.brightnessSupported && !Number.isFinite(stateSnapshot.brightness);
  const hasMissingKelvin =
    stateSnapshot.temperatureSupported &&
    !COLOR_MODE_SET.has(stateSnapshot.colorMode) &&
    !Number.isFinite(stateSnapshot.kelvin);
  return {
    ...stateSnapshot,
    on: stateSnapshot.on && !hasMissingBrightness && !hasMissingKelvin
  };
}
const HISTORY_MAX_AGE_MS = 604800000;
const MAX_TRACKED_ENTITIES = 256;
const isLightEntityId = entityIdCandidate => /^(light|switch)\.[a-z0-9_]+$/.test(entityIdCandidate);
const isNumericAttribute = attributeValue =>
  typeof attributeValue != "boolean" && isNumericValue(attributeValue);
const LIGHT_ATTRIBUTE_VALIDATORS = {
  brightness: brightnessValue =>
    Number.isFinite(brightnessValue) && brightnessValue > 0 && brightnessValue <= 100,
  kelvin: kelvinCandidate => Number.isFinite(kelvinCandidate) && kelvinCandidate > 0,
  minimum: minimumCandidate =>
    Number.isFinite(minimumCandidate) && minimumCandidate >= 1000 && minimumCandidate <= 20000,
  maximum: maximumCandidate =>
    Number.isFinite(maximumCandidate) && maximumCandidate >= 1000 && maximumCandidate <= 20000,
  colorMode: colorModeCandidate =>
    colorModeCandidate === "color_temp" || COLOR_MODE_SET.has(colorModeCandidate),
  brightnessSupported: brightnessSupportedFlag => typeof brightnessSupportedFlag == "boolean",
  temperatureSupported: temperatureSupportedFlag => typeof temperatureSupportedFlag == "boolean"
};
function computeAttributePatch(patchEntityId, patchEntityState) {
  const entityStateBody = patchEntityState?.newState || patchEntityState || {};
  const entityAttributes = entityStateBody.attributes || {};
  const resolvedLightState = lightState(patchEntityId, patchEntityState);
  const attributePatch = {};
  const patchSupportedColorModes = Array.isArray(entityAttributes.supported_color_modes)
    ? entityAttributes.supported_color_modes
    : [];
  const hasReportedBrightness =
    isNumericAttribute(entityAttributes.brightness) && Number(entityAttributes.brightness) > 0;
  const hasReportedKelvin =
    (isNumericAttribute(entityAttributes.color_temp_kelvin) &&
      Number(entityAttributes.color_temp_kelvin) > 0) ||
    (isNumericAttribute(entityAttributes.color_temp) && Number(entityAttributes.color_temp) > 0);
  const hasReportedMinKelvin =
    (isNumericAttribute(entityAttributes.min_color_temp_kelvin) &&
      Number(entityAttributes.min_color_temp_kelvin) > 0) ||
    (isNumericAttribute(entityAttributes.max_mireds) && Number(entityAttributes.max_mireds) > 0);
  const hasReportedMaxKelvin =
    (isNumericAttribute(entityAttributes.max_color_temp_kelvin) &&
      Number(entityAttributes.max_color_temp_kelvin) > 0) ||
    (isNumericAttribute(entityAttributes.min_mireds) && Number(entityAttributes.min_mireds) > 0);
  const reportedSupportedFeatures = isNumericAttribute(entityAttributes.supported_features)
    ? Number(entityAttributes.supported_features)
    : 0;
  if (patchSupportedColorModes.length || hasReportedBrightness || reportedSupportedFeatures & 1) {
    attributePatch.brightnessSupported = resolvedLightState.brightnessSupported;
  }
  if (
    patchSupportedColorModes.length ||
    hasReportedKelvin ||
    hasReportedMinKelvin ||
    hasReportedMaxKelvin ||
    reportedSupportedFeatures & 2
  ) {
    attributePatch.temperatureSupported = resolvedLightState.temperatureSupported;
  }
  if (hasReportedBrightness && resolvedLightState.brightnessSupported) {
    attributePatch.brightness = resolvedLightState.brightness;
  }
  if (hasReportedKelvin && resolvedLightState.temperatureSupported) {
    attributePatch.kelvin = resolvedLightState.kelvin;
  }
  if (hasReportedMinKelvin) {
    attributePatch.minimum = resolvedLightState.minimum;
  }
  if (hasReportedMaxKelvin) {
    attributePatch.maximum = resolvedLightState.maximum;
  }
  if (
    entityAttributes.color_mode === "color_temp" ||
    COLOR_MODE_SET.has(entityAttributes.color_mode)
  ) {
    attributePatch.colorMode = resolvedLightState.colorMode;
  }
  return Object.fromEntries(
    Object.entries(attributePatch).filter(([patchKey, patchValue]) =>
      LIGHT_ATTRIBUTE_VALIDATORS[patchKey](patchValue)
    )
  );
}
function createLightHistoryStore(storage, scope, now, schedule, cancel) {
  if (!storage || typeof scope != "string" || !scope.trim()) {
    return null;
  }
  const storageKey = "hb-i3d:light-history:v1:" + scope;
  const historyByEntityId = new Map();
  const signatureByEntityId = new Map();
  let isStorageUsable = true;
  let flushTimerId = null;
  let hasPendingWrites = false;
  let nextPruneMs = 0;
  const latestRecordTimestamp = attributeRecords =>
    Math.max(0, ...Object.values(attributeRecords).map(attributeRecord => attributeRecord.at));
  function pruneExpiredRecords(nowMs) {
    if (nowMs < nextPruneMs && historyByEntityId.size <= MAX_TRACKED_ENTITIES) {
      return false;
    }
    let didPrune = false;
    nextPruneMs = Infinity;
    for (const [storedEntityId, storedAttributes] of historyByEntityId) {
      for (const [attributeKey, record] of Object.entries(storedAttributes)) {
        if (nowMs - record.at >= HISTORY_MAX_AGE_MS) {
          delete storedAttributes[attributeKey];
          didPrune = true;
        } else {
          nextPruneMs = Math.min(nextPruneMs, record.at + HISTORY_MAX_AGE_MS);
        }
      }
      if (!Object.keys(storedAttributes).length) {
        historyByEntityId.delete(storedEntityId);
      }
    }
    if (historyByEntityId.size > MAX_TRACKED_ENTITIES) {
      const entitiesByAge = [...historyByEntityId].sort(
        (leftEntity, rightEntity) =>
          latestRecordTimestamp(leftEntity[1]) - latestRecordTimestamp(rightEntity[1])
      );
      for (const [evictedEntityId] of entitiesByAge.slice(
        0,
        historyByEntityId.size - MAX_TRACKED_ENTITIES
      )) {
        historyByEntityId.delete(evictedEntityId);
      }
      didPrune = true;
    }
    return didPrune;
  }
  function readStoredHistory() {
    const storedHistoryByEntityId = new Map();
    const storedJSON = storage.getItem(storageKey);
    if (storedJSON) {
      const parsedHistory = JSON.parse(storedJSON);
      const readAtMs = now();
      if (
        parsedHistory?.version !== 1 ||
        !parsedHistory.entities ||
        typeof parsedHistory.entities != "object" ||
        Array.isArray(parsedHistory.entities)
      ) {
        throw new Error("Invalid light history");
      }
      for (const [entityIdFromStorage, attributesFromStorage] of Object.entries(
        parsedHistory.entities
      )) {
        if (
          !isLightEntityId(entityIdFromStorage) ||
          !attributesFromStorage ||
          typeof attributesFromStorage != "object" ||
          Array.isArray(attributesFromStorage)
        ) {
          continue;
        }
        const validAttributeRecords = {};
        for (const [recordKey, storedRecord] of Object.entries(attributesFromStorage)) {
          if (
            Object.hasOwn(LIGHT_ATTRIBUTE_VALIDATORS, recordKey) &&
            LIGHT_ATTRIBUTE_VALIDATORS[recordKey](storedRecord?.value) &&
            Number.isFinite(storedRecord.at) &&
            storedRecord.at >= 0 &&
            storedRecord.at <= readAtMs &&
            readAtMs - storedRecord.at < HISTORY_MAX_AGE_MS
          ) {
            validAttributeRecords[recordKey] = {
              value: storedRecord.value,
              at: storedRecord.at
            };
          }
        }
        if (Object.keys(validAttributeRecords).length) {
          storedHistoryByEntityId.set(entityIdFromStorage, validAttributeRecords);
        }
      }
    }
    return storedHistoryByEntityId;
  }
  try {
    for (const [restoredEntityId, restoredAttributes] of readStoredHistory()) {
      historyByEntityId.set(restoredEntityId, restoredAttributes);
    }
    pruneExpiredRecords(now());
  } catch {
    return null;
  }
  const serializeHistory = () =>
    JSON.stringify({
      version: 1,
      entities: Object.fromEntries(historyByEntityId)
    });
  function flushHistory() {
    if (flushTimerId !== null) {
      cancel(flushTimerId);
      flushTimerId = null;
    }
    if (!!isStorageUsable && !!hasPendingWrites) {
      hasPendingWrites = false;
      try {
        for (const [persistedEntityId, persistedAttributes] of readStoredHistory()) {
          const mergedRecords = historyByEntityId.get(persistedEntityId) || {};
          for (const [mergedKey, newerRecord] of Object.entries(persistedAttributes)) {
            if (!mergedRecords[mergedKey] || mergedRecords[mergedKey].at < newerRecord.at) {
              mergedRecords[mergedKey] = newerRecord;
            }
          }
          if (mergedRecords.brightnessSupported?.value === false) {
            delete mergedRecords.brightness;
          }
          if (mergedRecords.temperatureSupported?.value === false) {
            delete mergedRecords.kelvin;
          }
          historyByEntityId.set(persistedEntityId, mergedRecords);
        }
        nextPruneMs = 0;
        pruneExpiredRecords(now());
        storage.setItem(storageKey, serializeHistory());
      } catch {
        isStorageUsable = false;
      }
    }
  }
  function scheduleHistoryFlush() {
    if (!!isStorageUsable && flushTimerId === null && !!hasPendingWrites) {
      flushTimerId = schedule(() => {
        flushTimerId = null;
        flushHistory();
      });
    }
  }
  return {
    resolve(resolveEntityId, resolveEntityState) {
      const resolveNowMs = now();
      hasPendingWrites = pruneExpiredRecords(resolveNowMs) || hasPendingWrites;
      if (isLightEntityId(resolveEntityId)) {
        const resolvedPatch = computeAttributePatch(resolveEntityId, resolveEntityState);
        const patchSignature = JSON.stringify(resolvedPatch);
        if (signatureByEntityId.get(resolveEntityId) !== patchSignature) {
          signatureByEntityId.delete(resolveEntityId);
          signatureByEntityId.set(resolveEntityId, patchSignature);
          const entityHistory = historyByEntityId.get(resolveEntityId) || {};
          for (const [historyAttributeKey, historyAttributeValue] of Object.entries(
            resolvedPatch
          )) {
            if (entityHistory[historyAttributeKey]?.value !== historyAttributeValue) {
              entityHistory[historyAttributeKey] = {
                value: historyAttributeValue,
                at: resolveNowMs
              };
              nextPruneMs = Math.min(nextPruneMs, resolveNowMs + HISTORY_MAX_AGE_MS);
              hasPendingWrites = true;
            }
          }
          if (resolvedPatch.brightnessSupported === false && entityHistory.brightness) {
            delete entityHistory.brightness;
            hasPendingWrites = true;
          }
          if (resolvedPatch.temperatureSupported === false && entityHistory.kelvin) {
            delete entityHistory.kelvin;
            hasPendingWrites = true;
          }
          if (Object.keys(entityHistory).length) {
            historyByEntityId.set(resolveEntityId, entityHistory);
          }
          while (signatureByEntityId.size > MAX_TRACKED_ENTITIES) {
            signatureByEntityId.delete(signatureByEntityId.keys().next().value);
          }
        }
      }
      hasPendingWrites = pruneExpiredRecords(resolveNowMs) || hasPendingWrites;
      scheduleHistoryFlush();
      const mergedAttributes = Object.fromEntries(
        Object.entries(historyByEntityId.get(resolveEntityId) || {}).map(
          ([mergedKeyName, mergedRecord]) => [mergedKeyName, mergedRecord.value]
        )
      );
      mergedAttributes.brightnessSupported ??=
        Number.isFinite(mergedAttributes.brightness) ||
        (!!mergedAttributes.colorMode && mergedAttributes.colorMode !== "onoff");
      mergedAttributes.temperatureSupported ??=
        Number.isFinite(mergedAttributes.kelvin) ||
        Number.isFinite(mergedAttributes.minimum) ||
        Number.isFinite(mergedAttributes.maximum) ||
        mergedAttributes.colorMode === "color_temp";
      return mergedAttributes;
    },
    flush: flushHistory,
    clear() {
      if (flushTimerId !== null) {
        cancel(flushTimerId);
        flushTimerId = null;
      }
      historyByEntityId.clear();
      signatureByEntityId.clear();
      hasPendingWrites = false;
      nextPruneMs = Infinity;
      if (isStorageUsable) {
        try {
          storage.removeItem(storageKey);
        } catch {
          isStorageUsable = false;
        }
      }
    }
  };
}
export function createLightStateCache({
  storage: cacheStorage,
  scope: cacheScope,
  now: cacheNow = () => Date.now(),
  schedule: cacheSchedule = scheduledCallback => setTimeout(scheduledCallback, 50),
  cancel: cacheCancel = scheduledTimerId => clearTimeout(scheduledTimerId)
} = {}) {
  const lastStateByEntityId = new Map();
  const historyStore = createLightHistoryStore(
    cacheStorage,
    cacheScope,
    cacheNow,
    cacheSchedule,
    cacheCancel
  );
  return {
    resolve(cacheEntityId, cacheEntityState) {
      const cachedAttributes = historyStore
        ? {
            name: lastStateByEntityId.get(cacheEntityId)?.name,
            ...historyStore.resolve(cacheEntityId, cacheEntityState)
          }
        : lastStateByEntityId.get(cacheEntityId);
      const computedState = lightState(cacheEntityId, cacheEntityState, cachedAttributes);
      lastStateByEntityId.set(
        cacheEntityId,
        computedState.brightness === 0
          ? {
              ...computedState,
              brightness: cachedAttributes?.brightness > 0 ? cachedAttributes.brightness : null
            }
          : computedState
      );
      return computedState;
    },
    flush() {
      historyStore?.flush();
    },
    clear() {
      lastStateByEntityId.clear();
      historyStore?.clear();
    }
  };
}
export function lightCommand(commandEntityId, commandName, commandValue, capabilities) {
  if (!/^(light|switch)\.[a-z0-9_]+$/.test(commandEntityId) || !capabilities.available) {
    throw new Error("设备不可用。");
  }
  const entityDomain = commandEntityId.split(".")[0];
  if (commandName === "power") {
    return {
      domain: entityDomain,
      service: commandValue ? "turn_on" : "turn_off",
      entityId: commandEntityId,
      data: {}
    };
  }
  if (!Number.isFinite(Number(commandValue))) {
    throw new Error("灯光参数无效。");
  }
  if (commandName === "brightness" && capabilities.brightnessSupported) {
    return {
      domain: entityDomain,
      service: "turn_on",
      entityId: commandEntityId,
      data: {
        brightness: Math.round((Math.max(1, Math.min(100, Number(commandValue))) * 255) / 100)
      }
    };
  }
  if (commandName === "temperature" && capabilities.temperatureSupported) {
    return {
      domain: entityDomain,
      service: "turn_on",
      entityId: commandEntityId,
      data: {
        color_temp_kelvin: Math.round(
          Math.max(capabilities.minimum, Math.min(capabilities.maximum, Number(commandValue)))
        )
      }
    };
  }
  throw new Error("此设备不支持该灯光调节。");
}
export function createLightPreview({ now: previewNow = () => performance.now() } = {}) {
  const previewsByEntityId = new Map();
  let revisionCounter = 0;
  return {
    set(previewEntityId, previewCommand, previewValue, isCommitted = false) {
      const previewValues = {
        ...previewsByEntityId.get(previewEntityId)?.values,
        on: previewCommand === "power" ? previewValue === true : true
      };
      if (previewCommand === "brightness") {
        previewValues.brightness = previewValue;
      }
      if (previewCommand === "temperature") {
        previewValues.kelvin = previewValue;
      }
      if (previewCommand === "preset") {
        if (Number.isFinite(previewValue?.brightness)) {
          previewValues.brightness = previewValue.brightness;
        }
        if (Number.isFinite(previewValue?.kelvin)) {
          previewValues.kelvin = previewValue.kelvin;
        }
      }
      if (previewCommand === "power" && !previewValue) {
        delete previewValues.brightness;
        delete previewValues.kelvin;
      }
      const previewEntry = {
        values: previewValues,
        revision: ++revisionCounter,
        committed: isCommitted,
        expires: previewNow() + 15000
      };
      previewsByEntityId.set(previewEntityId, previewEntry);
      return previewEntry.revision;
    },
    state(stateEntityId, serverState) {
      return {
        ...serverState,
        ...previewsByEntityId.get(stateEntityId)?.values
      };
    },
    reconcile(reconcileEntityId, serverEntityState) {
      const pendingPreview = previewsByEntityId.get(reconcileEntityId);
      if (!pendingPreview) {
        return;
      }
      const isSettled = Object.entries(pendingPreview.values).every(
        ([previewKey, expectedValue]) =>
          previewKey === "on"
            ? serverEntityState.on === expectedValue
            : Number.isFinite(serverEntityState[previewKey]) &&
              Math.abs(serverEntityState[previewKey] - expectedValue) <=
                (previewKey === "kelvin" ? 15 : 1)
      );
      if (!serverEntityState.available || (pendingPreview.committed && isSettled)) {
        previewsByEntityId.delete(reconcileEntityId);
      }
    },
    hold(holdEntityId, holdRevision) {
      const heldPreview = previewsByEntityId.get(holdEntityId);
      if (heldPreview?.revision === holdRevision) {
        heldPreview.committed = false;
      }
    },
    retain(retainEntityId, retainRevision) {
      const retainedPreview = previewsByEntityId.get(retainEntityId);
      if (retainedPreview?.revision === retainRevision) {
        retainedPreview.committed = true;
        retainedPreview.expires = previewNow() + 15000;
      }
    },
    acknowledge(acknowledgeEntityId, acknowledgeRevision) {
      const acknowledgedPreview = previewsByEntityId.get(acknowledgeEntityId);
      if (acknowledgedPreview?.revision === acknowledgeRevision) {
        acknowledgedPreview.expires = previewNow() + 8000;
      }
    },
    reject(rejectEntityId, rejectRevision) {
      if (previewsByEntityId.get(rejectEntityId)?.revision === rejectRevision) {
        previewsByEntityId.delete(rejectEntityId);
      }
    },
    expire() {
      let didExpire = false;
      for (const [expiredEntityId, expiredPreview] of previewsByEntityId) {
        if (expiredPreview.expires <= previewNow()) {
          previewsByEntityId.delete(expiredEntityId);
          didExpire = true;
        }
      }
      return didExpire;
    },
    clear() {
      previewsByEntityId.clear();
    },
    nextDelay(atMs = previewNow()) {
      let earliestExpiryMs = Infinity;
      for (const previewRecord of previewsByEntityId.values()) {
        earliestExpiryMs = Math.min(earliestExpiryMs, previewRecord.expires);
      }
      return Math.max(0, earliestExpiryMs - atMs);
    }
  };
}
