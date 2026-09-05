import { resolveXiaomiDeviceProfile } from "../../renderer/device-profiles.js?v=20260821-electric-bed-sync-v4";
export const RELATED_ENTITY_MODE_SELECTED = "selected";
export const RELATED_POPUP_LABELS = Object.freeze({
  "water-heater": "热水器",
  "air-purifier": "空气净化器",
  "bath-heater": "浴霸",
  "air-conditioner": "空调",
  vacuum: "扫地机器人",
});
export const RELATED_POPUP_SELECTION_LIMITS = Object.freeze({
  "water-heater": 12,
  "air-purifier": 12,
  "bath-heater": 12,
  "air-conditioner": 12,
  vacuum: 12,
});
export function relatedPopupSelectionLimit(value) {
  const value2 = typeof value == "string" ? value : value?.deviceType;
  return Number(RELATED_POPUP_SELECTION_LIMITS[value2] || 0);
}
const E = Object.freeze({
  "water-heater": new Set([
    "light",
    "switch",
    "input_boolean",
    "fan",
    "select",
    "input_select",
    "number",
    "input_number",
    "button",
    "sensor",
    "binary_sensor",
  ]),
  "air-purifier": new Set([
    "light",
    "switch",
    "input_boolean",
    "select",
    "input_select",
    "number",
    "input_number",
    "button",
    "sensor",
    "binary_sensor",
  ]),
  "bath-heater": new Set([
    "light",
    "switch",
    "input_boolean",
    "fan",
    "select",
    "input_select",
    "number",
    "input_number",
    "button",
    "sensor",
    "binary_sensor",
  ]),
  "air-conditioner": new Set([
    "light",
    "switch",
    "input_boolean",
    "fan",
    "select",
    "input_select",
    "number",
    "input_number",
    "button",
    "sensor",
    "binary_sensor",
  ]),
  vacuum: new Set([
    "light",
    "switch",
    "input_boolean",
    "select",
    "input_select",
    "number",
    "input_number",
    "button",
    "sensor",
    "binary_sensor",
  ]),
});
const index = new Map([
  ["light", 0],
  ["switch", 1],
  ["input_boolean", 1],
  ["fan", 2],
  ["select", 3],
  ["input_select", 3],
  ["number", 4],
  ["input_number", 4],
  ["sensor", 5],
  ["binary_sensor", 6],
  ["button", 7],
]);
export const RELATED_ENTITY_DOMAIN_LABELS = Object.freeze({
  light: "灯光",
  switch: "开关",
  input_boolean: "开关",
  fan: "风扇",
  select: "选项",
  input_select: "选项",
  number: "数值",
  input_number: "数值",
  button: "按钮",
  sensor: "数据",
  binary_sensor: "状态",
});
function fn(metadata) {
  return String(metadata?.domain || metadata?.entityId || "").split(".", 1)[0];
}
export function relatedEntityIsAvailable(metadata) {
  return (
    !!metadata?.entityId &&
    !metadata.disabledBy &&
    metadata.status !== "missing" &&
    metadata.status !== "disabled"
  );
}
function S(value, value2) {
  if (value2) {
    return [...(value?.values?.() || [])].filter(
      (value3) => value3.deviceId === value2,
    );
  } else {
    return [];
  }
}
function _(value, value2) {
  return (
    value.find(
      (value3) => fn(value3) === value2 && relatedEntityIsAvailable(value3),
    ) || null
  );
}
function T(value) {
  return _(value, "vacuum");
}
function L(value) {
  return _(value, "water_heater");
}
export function relatedPopupContext(
  component,
  value = new Map(),
  value2 = new Map(),
  value3 = new Map(),
) {
  const value4 = [
    "icon-button-effect",
    "icon-button",
    "device-button",
    "air-conditioner",
    "water-heater",
    "air-purifier",
    "vacuum-control",
  ].includes(component?.type);
  const value5 = Object.values(component?.actions || {}).some(
    (value11) =>
      value11?.type === "more-info" &&
      !["entity", "custom"].includes(
        String(value11?.data?.popupSource || "current"),
      ),
  );
  if (!value4 && !value5) {
    return null;
  }
  const configuredEntityId = String(
    component?.bindings?.entity?.entityId || "",
  );
  const source = value.get(configuredEntityId) || null;
  if (!configuredEntityId || !source) {
    return null;
  }
  const siblings = S(value, source.deviceId);
  const profile = resolveXiaomiDeviceProfile(
    configuredEntityId,
    value,
    value2,
    value3,
  );
  const text = String(component?.properties?.deviceType || "");
  const value6 = fn(source);
  const value7 = profile?.roles?.climate || profile?.roles?.fan || "";
  const value8 = !!value7 && configuredEntityId === value7;
  const value9 = value6 === "water_heater" ? source : L(siblings);
  const value10 = value6 === "vacuum" ? source : T(siblings);
  let deviceType = "";
  let primaryEntityId = configuredEntityId;
  if (component?.type === "water-heater" || value9) {
    deviceType = "water-heater";
    primaryEntityId = value9?.entityId || configuredEntityId;
  } else if (
    component?.type === "air-purifier" ||
    text === "air-purifier" ||
    profile?.deviceType === "air-purifier"
  ) {
    deviceType = "air-purifier";
    primaryEntityId = profile?.roles?.fan || configuredEntityId;
  } else if (component?.type === "vacuum-control" || value10) {
    deviceType = "vacuum";
    primaryEntityId = value10?.entityId || configuredEntityId;
  } else if (
    text === "bath-heater" ||
    (profile?.deviceType === "bath-heater" && value8)
  ) {
    deviceType = "bath-heater";
    primaryEntityId =
      profile?.roles?.climate || profile?.roles?.fan || configuredEntityId;
  } else if (
    text === "air-conditioner" ||
    profile?.deviceType === "air-conditioner" ||
    value6 === "climate"
  ) {
    deviceType = "air-conditioner";
    primaryEntityId = profile?.roles?.climate || configuredEntityId;
  }
  if (!deviceType || !source.deviceId) {
    return null;
  } else {
    return {
      deviceType: deviceType,
      deviceLabel: RELATED_POPUP_LABELS[deviceType],
      configuredEntityId: configuredEntityId,
      primaryEntityId: primaryEntityId,
      deviceId: source.deviceId,
      source: source,
      primary: value.get(primaryEntityId) || source,
      profile: profile,
      siblings: siblings,
    };
  }
}
export function selectedRelatedEntityIds(component) {
  const relatedEntities = component?.properties?.relatedEntities;
  if (
    relatedEntities?.mode !== RELATED_ENTITY_MODE_SELECTED ||
    !Array.isArray(relatedEntities.entityIds)
  ) {
    return null;
  } else {
    return [
      ...new Set(
        relatedEntities.entityIds
          .map((value) => String(value || "").trim())
          .filter(Boolean),
      ),
    ];
  }
}
export function relatedPopupCandidates(
  value,
  value2 = new Map(),
  value3 = new Map(),
  value4 = new Map(),
) {
  const value5 = relatedPopupContext(value, value2, value3, value4);
  if (!value5) {
    return [];
  }
  const value6 = E[value5.deviceType] || new Set();
  const allowed = new Set(selectedRelatedEntityIds(value) || []);
  return value5.siblings
    .filter(
      (value7) =>
        value7.entityId !== value5.primaryEntityId &&
        value6.has(fn(value7)) &&
        (relatedEntityIsAvailable(value7) || allowed.has(value7.entityId)),
    )
    .sort((value7, value8) => {
      const value9 = relatedEntityIsAvailable(value7) ? 0 : 1;
      const value10 = relatedEntityIsAvailable(value8) ? 0 : 1;
      return (
        value9 - value10 ||
        (index.get(fn(value7)) ?? 99) - (index.get(fn(value8)) ?? 99) ||
        String(value7.entityId || "").localeCompare(
          String(value8.entityId || ""),
        )
      );
    });
}
export function legacyRelatedEntityIds(
  value,
  value2 = new Map(),
  value3 = new Map(),
  value4 = new Map(),
) {
  const value5 = relatedPopupContext(value, value2, value3, value4);
  if (!value5) {
    return [];
  }
  const value6 = relatedPopupCandidates(value, value2, value3, value4);
  if (value5.deviceType === "water-heater") {
    return value6
      .filter(
        (value7) =>
          ["switch", "select", "number", "button"].includes(fn(value7)) &&
          relatedEntityIsAvailable(value7),
      )
      .map((value7) => value7.entityId);
  }
  if (value5.deviceType === "air-purifier") {
    const value7 = value5.profile?.roles || {};
    return [
      ...new Set(
        [
          "pm25",
          "pm10",
          "filterLife",
          "filterLeftTime",
          "hcho",
          "temperature",
          "humidity",
          "airQuality",
        ]
          .map((value8) => value7[value8])
          .filter(Boolean),
      ),
    ];
  }
  if (value5.deviceType === "bath-heater") {
    const value7 =
      value5.profile?.roles?.light ||
      value6.find(
        (value8) => fn(value8) === "light" && relatedEntityIsAvailable(value8),
      )?.entityId;
    if (value7) {
      return [value7];
    } else {
      return [];
    }
  }
  if (value5.deviceType === "vacuum") {
    const value7 = value6.find(
      (value8) =>
        fn(value8) === "select" &&
        (/cleaning_mode/i.test(String(value8.entityId || "")) ||
          value8.translationKey === "cleaning_mode"),
    );
    if (value7?.entityId) {
      return [value7.entityId];
    } else {
      return [];
    }
  }
  return [];
}
export function relatedEntityLabel(value, value2) {
  let value3 = String(value2?.name || value2?.originalName || "")
    .replace(/\s+/g, " ")
    .trim();
  const value4 = [
    ...new Set(
      [
        value?.source?.originalName,
        value?.source?.name,
        value?.primary?.originalName,
        value?.primary?.name,
      ]
        .map((value5) =>
          String(value5 || "")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean),
    ),
  ].sort((value5, value6) => value6.length - value5.length);
  for (const value5 of value4) {
    while (value3 !== value5 && value3.startsWith(value5 + " ")) {
      value3 = value3.slice(value5.length).trim();
    }
  }
  return (
    value3 ||
    (String(value2?.entityId || "").split(".", 2)[1] || "关联功能").replace(
      /_/g,
      " ",
    )
  );
}
export function relatedEntityNeedsConfirmation(value) {
  if (fn(value) !== "button") {
    return false;
  }
  const value2 = [
    value?.entityId,
    value?.name,
    value?.originalName,
    value?.translationKey,
  ]
    .map((value3) => String(value3 || ""))
    .join(" ");
  return /清空|清除|删除|重置|恢复出厂|格式化|解绑|empty|clear|delete|remove|reset|factory|wipe|format|unbind|purge/i.test(
    value2,
  );
}
export function relatedEntityOptions(value, value2) {
  const value3 = value2?.attributes || {};
  const value4 =
    [
      value3.options,
      value3.option_list,
      value?.options,
      value?.attributes?.options,
      value?.capabilities?.options,
    ].find((value7) => Array.isArray(value7)) || [];
  const value5 = String(value2?.state || "").trim();
  const value6 = value4
    .map((value7) => String(value7 ?? "").trim())
    .filter(Boolean);
  if (value5 && !["unknown", "unavailable"].includes(value5.toLowerCase())) {
    value6.push(value5);
  }
  return [...new Set(value6)];
}
export function relatedEntitySelectService(value) {
  const domain = typeof value == "string" ? value : fn(value);
  if (["select", "input_select"].includes(domain)) {
    return {
      domain: domain,
      service: "select_option",
    };
  } else {
    return null;
  }
}
export function selectedRelatedEntities(
  value,
  value2 = new Map(),
  value3 = new Map(),
  value4 = new Map(),
) {
  const value5 = selectedRelatedEntityIds(value);
  if (value5 === null) {
    return null;
  }
  const value6 = relatedPopupContext(value, value2, value3, value4);
  const value7 = relatedPopupSelectionLimit(value6);
  const index2 = new Map(
    relatedPopupCandidates(value, value2, value3, value4).map((value10) => [
      value10.entityId,
      value10,
    ]),
  );
  const value9 = value5.map((value10) => index2.get(value10)).filter(Boolean);
  if (value7 > 0) {
    return value9.slice(0, value7);
  } else {
    return value9;
  }
}
export function manualRelatedEntityConfig(value = []) {
  return {
    mode: RELATED_ENTITY_MODE_SELECTED,
    entityIds: [
      ...new Set(
        value.map((value2) => String(value2 || "").trim()).filter(Boolean),
      ),
    ],
  };
}
