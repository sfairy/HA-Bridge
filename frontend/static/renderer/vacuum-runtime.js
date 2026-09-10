import { entityMetadataIsAvailable } from "./entity-metadata.js?v=20260901-renderer-entity-metadata-v1";
const VACUUM_FEATURE_BITS = Object.freeze({
  turn_on: 1,
  turn_off: 2,
  pause: 4,
  stop: 8,
  return_to_base: 16,
  locate: 512,
  clean_spot: 1024,
  start: 8192
});
export function vacuumSupportedActions(state) {
  const supportedFeatures = state?.attributes?.supported_features;
  if (supportedFeatures == null || supportedFeatures === "") {
    return ["start", "pause", "return_to_base"];
  }
  const bits = Number(supportedFeatures);
  if (!Number.isFinite(bits)) {
    return ["start", "pause", "return_to_base"];
  }
  const actions = [];
  if (bits & VACUUM_FEATURE_BITS.start || bits & VACUUM_FEATURE_BITS.turn_on) {
    actions.push("start");
  }
  if (bits & VACUUM_FEATURE_BITS.pause) {
    actions.push("pause");
  }
  if (bits & VACUUM_FEATURE_BITS.stop || bits & VACUUM_FEATURE_BITS.turn_off) {
    actions.push("stop");
  }
  if (bits & VACUUM_FEATURE_BITS.return_to_base) {
    actions.push("return_to_base");
  }
  if (bits & VACUUM_FEATURE_BITS.locate) {
    actions.push("locate");
  }
  if (bits & VACUUM_FEATURE_BITS.clean_spot) {
    actions.push("clean_spot");
  }
  return actions;
}
export function vacuumActionService(state, action) {
  const bits = Number(state?.attributes?.supported_features);
  if (Number.isFinite(bits)) {
    if (action === "start" && !(bits & VACUUM_FEATURE_BITS.start) && bits & VACUUM_FEATURE_BITS.turn_on) {
      return "turn_on";
    } else if (action === "stop" && !(bits & VACUUM_FEATURE_BITS.stop) && bits & VACUUM_FEATURE_BITS.turn_off) {
      return "turn_off";
    } else {
      return action;
    }
  } else {
    return action;
  }
}
function entityState(state) {
  return state?.newState || state || null;
}
function batteryPercent(value) {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const numeric = Number.parseFloat(String(value));
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(100, numeric));
  } else {
    return null;
  }
}
export function vacuumBatteryPercent(state, batteryState = null) {
  const attributes = entityState(state)?.attributes || {};
  for (const field of [attributes.battery_level, attributes.battery_percentage, attributes.battery]) {
    const percent = batteryPercent(field);
    if (percent !== null) {
      return percent;
    }
  }
  return batteryPercent(entityState(batteryState)?.state);
}
export function relatedVacuumBatteryEntity(catalog, states, entityId) {
  const vacuum = catalog.get(entityId);
  return vacuum?.deviceId && [...catalog.values()].filter(item => item.deviceId === vacuum.deviceId && item.domain === "sensor" && entityMetadataIsAvailable(item)).map(item => {
    const state = entityState(states.get(item.entityId));
    const attributes = state?.attributes || {};
    const haystack = ((item.entityId || "") + " " + (item.name || "") + " " + (item.originalName || "") + " " + (item.translationKey || "") + " " + (item.icon || "")).toLowerCase();
    const deviceClass = String(attributes.device_class || "").toLowerCase();
    const unit = String(attributes.unit_of_measurement || "").trim();
    let score = 0;
    if (deviceClass === "battery") {
      score += 240;
    }
    if (String(item.translationKey || "").toLowerCase() === "battery") {
      score += 210;
    }
    if (/(?:^|[._\s-])battery(?:_level|_percentage)?(?:$|[._\s-])|电池电量|剩余电量|电量/.test(haystack)) {
      score += 150;
    }
    if (/mdi:battery/.test(haystack)) {
      score += 60;
    }
    if (unit === "%") {
      score += 25;
    }
    if (/filter|brush|mop|consumable|life|尘袋|滤芯|主刷|边刷|拖布|耗材/.test(haystack)) {
      score -= 260;
    }
    if (batteryPercent(state?.state) === null) {
      score -= 40;
    }
    return {
      item,
      score
    };
  }).filter(({
    score
  }) => score > 0).sort((left, right) => right.score - left.score || String(left.item.entityId || "").length - String(right.item.entityId || "").length || String(left.item.entityId || "").localeCompare(String(right.item.entityId || "")))[0]?.item || null;
}
