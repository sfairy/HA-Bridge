const ON_OFF_DOMAINS_SET = new Set([
  "light",
  "switch",
  "input_boolean",
  "fan",
  "humidifier",
  "siren"
]);
const RUNNING_STATE_DOMAINS_SET = new Set(["climate", "water_heater"]);
function resolveEntityDomain(entityDescriptor) {
  const entityId =
    typeof entityDescriptor == "string"
      ? entityDescriptor
      : String(entityDescriptor?.entityId || entityDescriptor?.entity_id || "");
  return (
    String(typeof entityDescriptor == "string" ? "" : entityDescriptor?.domain || "")
      .trim()
      .toLowerCase() || entityId.split(".", 1)[0].toLowerCase()
  );
}
export function lightStatisticsEntitySupport(entityLike) {
  const targetEntityId =
    typeof entityLike == "string"
      ? entityLike
      : String(entityLike?.entityId || entityLike?.entity_id || "");
  const entityDomain = resolveEntityDomain(entityLike);
  if (entityDomain === "virtual" || entityLike?.virtual) {
    return {
      supported: true,
      message: "虚拟实体按当前显示状态统计。"
    };
  } else if (entityDomain === "group") {
    return {
      supported: true,
      message: "群组将作为 1 个实体统计。"
    };
  } else if (ON_OFF_DOMAINS_SET.has(entityDomain)) {
    return {
      supported: true,
      message: "按开启/关闭状态统计。"
    };
  } else if (RUNNING_STATE_DOMAINS_SET.has(entityDomain)) {
    return {
      supported: true,
      message: "按关闭/运行状态统计。"
    };
  } else {
    return {
      supported: false,
      message: "该实体没有明确的开启/关闭状态。"
    };
  }
}
export function lightStatisticsEntityStateStatus(entityInput, stateLike) {
  if (!lightStatisticsEntitySupport(entityInput).supported) {
    return "abnormal";
  }
  const domainName = resolveEntityDomain(entityInput);
  const normalizedState = String(stateLike?.state ?? stateLike ?? "")
    .trim()
    .toLowerCase();
  if (!normalizedState || ["unknown", "unavailable"].includes(normalizedState)) {
    return "abnormal";
  } else if (normalizedState === "off") {
    return "off";
  } else if (normalizedState === "on" || RUNNING_STATE_DOMAINS_SET.has(domainName)) {
    return "on";
  } else {
    return "abnormal";
  }
}
function readFromMapOrRecord(source, key) {
  if (typeof source?.get == "function") {
    return source.get(key) || null;
  } else {
    return (source && typeof source == "object" && source[key]) || null;
  }
}
function unwrapStateChange(statesByEntityId, entityIdKey) {
  const stateOrChange =
    typeof statesByEntityId?.get == "function"
      ? statesByEntityId.get(entityIdKey)
      : statesByEntityId?.[entityIdKey];
  if (
    stateOrChange &&
    typeof stateOrChange == "object" &&
    Object.prototype.hasOwnProperty.call(stateOrChange, "newState")
  ) {
    return stateOrChange.newState || null;
  } else {
    return stateOrChange || null;
  }
}
export function lightStatisticsSummary(
  entityIds,
  liveStatesByEntityId = new Map(),
  descriptorsByEntityId = new Map()
) {
  const orderedEntityIds = [];
  const seenEntityIds = new Set();
  for (const entityIdEntry of Array.isArray(entityIds) ? entityIds : []) {
    const normalizedEntityId = String(entityIdEntry || "").trim();
    if (!!normalizedEntityId && !seenEntityIds.has(normalizedEntityId)) {
      seenEntityIds.add(normalizedEntityId);
      orderedEntityIds.push(normalizedEntityId);
    }
  }
  const items = orderedEntityIds.map(currentEntityId => {
    const descriptor = readFromMapOrRecord(descriptorsByEntityId, currentEntityId) || {};
    const stateChange = unwrapStateChange(liveStatesByEntityId, currentEntityId);
    const normalizedStateEntry = String(stateChange?.state || "")
      .trim()
      .toLowerCase();
    const support = lightStatisticsEntitySupport({
      ...descriptor,
      entityId: currentEntityId
    });
    const status = lightStatisticsEntityStateStatus(
      {
        ...descriptor,
        entityId: currentEntityId
      },
      stateChange
    );
    return {
      entityId: currentEntityId,
      label: String(
        stateChange?.attributes?.friendly_name ||
          descriptor.name ||
          descriptor.originalName ||
          currentEntityId
      ),
      state: normalizedStateEntry,
      status: status,
      message: status === "abnormal" && support.supported ? "当前状态无法判断" : support.message
    };
  });
  return {
    total: items.length,
    on: items.filter(item => item.status === "on").length,
    off: items.filter(entry => entry.status === "off").length,
    abnormal: items.filter(candidate => candidate.status === "abnormal").length,
    items: items
  };
}
