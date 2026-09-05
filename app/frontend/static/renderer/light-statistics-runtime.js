const bag = new Set([
  "light",
  "switch",
  "input_boolean",
  "fan",
  "humidifier",
  "siren",
]);
const bag2 = new Set(["climate", "water_heater"]);
function fn(metadata) {
  const value2 =
    typeof metadata == "string"
      ? metadata
      : String(metadata?.entityId || metadata?.entity_id || "");
  return (
    String(typeof metadata == "string" ? "" : metadata?.domain || "")
      .trim()
      .toLowerCase() || value2.split(".", 1)[0].toLowerCase()
  );
}
export function lightStatisticsEntitySupport(value) {
  const value2 =
    typeof value == "string"
      ? value
      : String(value?.entityId || value?.entity_id || "");
  const value3 = fn(value);
  if (value3 === "virtual" || value?.virtual) {
    return {
      supported: true,
      message: "虚拟实体按当前显示状态统计。",
    };
  } else if (value3 === "group") {
    return {
      supported: true,
      message: "群组将作为 1 个实体统计。",
    };
  } else if (bag.has(value3)) {
    return {
      supported: true,
      message: "按开启/关闭状态统计。",
    };
  } else if (bag2.has(value3)) {
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
export function lightStatisticsEntityStateStatus(value, value2) {
  if (!lightStatisticsEntitySupport(value).supported) {
    return "abnormal";
  }
  const value3 = fn(value);
  const value4 = String(value2?.state ?? value2 ?? "")
    .trim()
    .toLowerCase();
  if (!value4 || ["unknown", "unavailable"].includes(value4)) {
    return "abnormal";
  } else if (value4 === "off") {
    return "off";
  } else if (value4 === "on" || bag2.has(value3)) {
    return "on";
  } else {
    return "abnormal";
  }
}
function S(value, value2) {
  if (typeof value?.get == "function") {
    return value.get(value2) || null;
  } else {
    return (value && typeof value == "object" && value[value2]) || null;
  }
}
function fn2(value, value2) {
  const value3 =
    typeof value?.get == "function" ? value.get(value2) : value?.[value2];
  if (
    value3 &&
    typeof value3 == "object" &&
    Object.prototype.hasOwnProperty.call(value3, "newState")
  ) {
    return value3.newState || null;
  } else {
    return value3 || null;
  }
}
export function lightStatisticsSummary(
  lightStatistics,
  floorNames = new Map(),
  value = new Map(),
) {
  const value2 = [];
  const allowed = new Set();
  for (const value3 of Array.isArray(lightStatistics) ? lightStatistics : []) {
    const value4 = String(value3 || "").trim();
    if (!!value4 && !allowed.has(value4)) {
      allowed.add(value4);
      value2.push(value4);
    }
  }
  const items = value2.map((entityId) => {
    const value3 = S(value, entityId) || {};
    const value4 = fn2(floorNames, entityId);
    const state = String(value4?.state || "")
      .trim()
      .toLowerCase();
    const value5 = lightStatisticsEntitySupport({
      ...value3,
      entityId: entityId,
    });
    const status = lightStatisticsEntityStateStatus(
      {
        ...value3,
        entityId: entityId,
      },
      value4,
    );
    return {
      entityId: entityId,
      label: String(
        value4?.attributes?.friendly_name ||
          value3.name ||
          value3.originalName ||
          entityId,
      ),
      state: state,
      status: status,
      message:
        status === "abnormal" && value5.supported
          ? "当前状态无法判断"
          : value5.message,
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
