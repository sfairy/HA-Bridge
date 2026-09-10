const onOffDomains = new Set([
  "light",
  "switch",
  "input_boolean",
  "fan",
  "humidifier",
  "siren",
]);
const climateLikeDomains = new Set(["climate", "water_heater"]);
function entityDomain(metadata) {
  const entityId =
    typeof metadata == "string"
      ? metadata
      : String(metadata?.entityId || metadata?.entity_id || "");
  return (
    String(typeof metadata == "string" ? "" : metadata?.domain || "")
      .trim()
      .toLowerCase() || entityId.split(".", 1)[0].toLowerCase()
  );
}
export function lightStatisticsEntitySupport(entity) {
  const entityId =
    typeof entity == "string"
      ? entity
      : String(entity?.entityId || entity?.entity_id || "");
  const domain = entityDomain(entity);
  if (domain === "virtual" || entity?.virtual) {
    return {
      supported: true,
      message: "虚拟实体按当前显示状态统计。",
    };
  } else if (domain === "group") {
    return {
      supported: true,
      message: "群组将作为 1 个实体统计。",
    };
  } else if (onOffDomains.has(domain)) {
    return {
      supported: true,
      message: "按开启/关闭状态统计。",
    };
  } else if (climateLikeDomains.has(domain)) {
    return {
      supported: true,
      message: "按关闭/运行状态统计。",
    };
  } else {
    return {
      supported: false,
      message: "该实体没有明确的开启/关闭状态。",
    };
  }
}
export function lightStatisticsEntityStateStatus(entity, stateOrRecord) {
  if (!lightStatisticsEntitySupport(entity).supported) {
    return "abnormal";
  }
  const domain = entityDomain(entity);
  const state = String(stateOrRecord?.state ?? stateOrRecord ?? "")
    .trim()
    .toLowerCase();
  if (!state || ["unknown", "unavailable"].includes(state)) {
    return "abnormal";
  } else if (state === "off") {
    return "off";
  } else if (state === "on" || climateLikeDomains.has(domain)) {
    return "on";
  } else {
    return "abnormal";
  }
}
function metadataGet(metadata, entityId) {
  if (typeof metadata?.get == "function") {
    return metadata.get(entityId) || null;
  } else {
    return (metadata && typeof metadata == "object" && metadata[entityId]) || null;
  }
}
function readEntityState(states, entityId) {
  const record =
    typeof states?.get == "function" ? states.get(entityId) : states?.[entityId];
  if (
    record &&
    typeof record == "object" &&
    Object.prototype.hasOwnProperty.call(record, "newState")
  ) {
    return record.newState || null;
  } else {
    return record || null;
  }
}
export function lightStatisticsSummary(
  lightStatistics,
  states = new Map(),
  entityMetadata = new Map(),
) {
  const entityIds = [];
  const seen = new Set();
  for (const rawId of Array.isArray(lightStatistics) ? lightStatistics : []) {
    const entityId = String(rawId || "").trim();
    if (!!entityId && !seen.has(entityId)) {
      seen.add(entityId);
      entityIds.push(entityId);
    }
  }
  const items = entityIds.map((entityId) => {
    const metadata = metadataGet(entityMetadata, entityId) || {};
    const entityState = readEntityState(states, entityId);
    const state = String(entityState?.state || "")
      .trim()
      .toLowerCase();
    const support = lightStatisticsEntitySupport({
      ...metadata,
      entityId: entityId,
    });
    const status = lightStatisticsEntityStateStatus(
      {
        ...metadata,
        entityId: entityId,
      },
      entityState,
    );
    return {
      entityId: entityId,
      label: String(
        entityState?.attributes?.friendly_name ||
          metadata.name ||
          metadata.originalName ||
          entityId,
      ),
      state: state,
      status: status,
      message:
        status === "abnormal" && support.supported
          ? "当前状态无法判断"
          : support.message,
    };
  });
  return {
    total: items.length,
    on: items.filter((on) => on.status === "on").length,
    off: items.filter((off) => off.status === "off").length,
    abnormal: items.filter((abnormal) => abnormal.status === "abnormal").length,
    items: items,
  };
}
