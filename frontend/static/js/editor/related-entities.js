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
export function relatedPopupSelectionLimit(deviceTypeOrContext) {
  const deviceType =
    typeof deviceTypeOrContext == "string"
      ? deviceTypeOrContext
      : deviceTypeOrContext?.deviceType;
  return Number(RELATED_POPUP_SELECTION_LIMITS[deviceType] || 0);
}
const DEVICE_RELATED_DOMAINS = Object.freeze({
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
const DOMAIN_SORT_ORDER = new Map([
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
function entityDomain(metadata) {
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
function entitiesForDevice(entityMetadata, deviceId) {
  if (deviceId) {
    return [...(entityMetadata?.values?.() || [])].filter(
      (entity) => entity.deviceId === deviceId,
    );
  } else {
    return [];
  }
}
function findAvailableEntityByDomain(entities, domain) {
  return (
    entities.find(
      (entity) =>
        entityDomain(entity) === domain && relatedEntityIsAvailable(entity),
    ) || null
  );
}
function findVacuumEntity(entities) {
  return findAvailableEntityByDomain(entities, "vacuum");
}
function findWaterHeaterEntity(entities) {
  return findAvailableEntityByDomain(entities, "water_heater");
}
export function relatedPopupContext(
  component,
  entityMetadata = new Map(),
  deviceMetadata = new Map(),
  states = new Map(),
) {
  const isPopupCapableComponent = [
    "icon-button-effect",
    "icon-button",
    "device-button",
    "air-conditioner",
    "water-heater",
    "air-purifier",
    "vacuum-control",
  ].includes(component?.type);
  const hasDevicePopupAction = Object.values(component?.actions || {}).some(
    (action) =>
      action?.type === "more-info" &&
      !["entity", "custom"].includes(
        String(action?.data?.popupSource || "current"),
      ),
  );
  if (!isPopupCapableComponent && !hasDevicePopupAction) {
    return null;
  }
  const configuredEntityId = String(
    component?.bindings?.entity?.entityId || "",
  );
  const source = entityMetadata.get(configuredEntityId) || null;
  if (!configuredEntityId || !source) {
    return null;
  }
  const siblings = entitiesForDevice(entityMetadata, source.deviceId);
  const profile = resolveXiaomiDeviceProfile(
    configuredEntityId,
    entityMetadata,
    deviceMetadata,
    states,
  );
  const propertyDeviceType = String(component?.properties?.deviceType || "");
  const sourceDomain = entityDomain(source);
  const climateOrFanRole =
    profile?.roles?.climate || profile?.roles?.fan || "";
  const isPrimaryClimateOrFan =
    !!climateOrFanRole && configuredEntityId === climateOrFanRole;
  const waterHeaterEntity =
    sourceDomain === "water_heater"
      ? source
      : findWaterHeaterEntity(siblings);
  const vacuumEntity =
    sourceDomain === "vacuum" ? source : findVacuumEntity(siblings);
  let deviceType = "";
  let primaryEntityId = configuredEntityId;
  if (component?.type === "water-heater" || waterHeaterEntity) {
    deviceType = "water-heater";
    primaryEntityId = waterHeaterEntity?.entityId || configuredEntityId;
  } else if (
    component?.type === "air-purifier" ||
    propertyDeviceType === "air-purifier" ||
    profile?.deviceType === "air-purifier"
  ) {
    deviceType = "air-purifier";
    primaryEntityId = profile?.roles?.fan || configuredEntityId;
  } else if (component?.type === "vacuum-control" || vacuumEntity) {
    deviceType = "vacuum";
    primaryEntityId = vacuumEntity?.entityId || configuredEntityId;
  } else if (
    propertyDeviceType === "bath-heater" ||
    (profile?.deviceType === "bath-heater" && isPrimaryClimateOrFan)
  ) {
    deviceType = "bath-heater";
    primaryEntityId =
      profile?.roles?.climate || profile?.roles?.fan || configuredEntityId;
  } else if (
    propertyDeviceType === "air-conditioner" ||
    profile?.deviceType === "air-conditioner" ||
    sourceDomain === "climate"
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
      primary: entityMetadata.get(primaryEntityId) || source,
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
          .map((entityId) => String(entityId || "").trim())
          .filter(Boolean),
      ),
    ];
  }
}
export function relatedPopupCandidates(
  component,
  entityMetadata = new Map(),
  deviceMetadata = new Map(),
  states = new Map(),
) {
  const context = relatedPopupContext(
    component,
    entityMetadata,
    deviceMetadata,
    states,
  );
  if (!context) {
    return [];
  }
  const allowedDomains = DEVICE_RELATED_DOMAINS[context.deviceType] || new Set();
  const allowed = new Set(selectedRelatedEntityIds(component) || []);
  return context.siblings
    .filter(
      (entity) =>
        entity.entityId !== context.primaryEntityId &&
        allowedDomains.has(entityDomain(entity)) &&
        (relatedEntityIsAvailable(entity) || allowed.has(entity.entityId)),
    )
    .sort((left, right) => {
      const leftUnavailable = relatedEntityIsAvailable(left) ? 0 : 1;
      const rightUnavailable = relatedEntityIsAvailable(right) ? 0 : 1;
      return (
        leftUnavailable - rightUnavailable ||
        (DOMAIN_SORT_ORDER.get(entityDomain(left)) ?? 99) -
          (DOMAIN_SORT_ORDER.get(entityDomain(right)) ?? 99) ||
        String(left.entityId || "").localeCompare(String(right.entityId || ""))
      );
    });
}
export function legacyRelatedEntityIds(
  component,
  entityMetadata = new Map(),
  deviceMetadata = new Map(),
  states = new Map(),
) {
  const context = relatedPopupContext(
    component,
    entityMetadata,
    deviceMetadata,
    states,
  );
  if (!context) {
    return [];
  }
  const candidates = relatedPopupCandidates(
    component,
    entityMetadata,
    deviceMetadata,
    states,
  );
  if (context.deviceType === "water-heater") {
    return candidates
      .filter(
        (entity) =>
          ["switch", "select", "number", "button"].includes(
            entityDomain(entity),
          ) && relatedEntityIsAvailable(entity),
      )
      .map((entity) => entity.entityId);
  }
  if (context.deviceType === "air-purifier") {
    const roles = context.profile?.roles || {};
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
          .map((roleKey) => roles[roleKey])
          .filter(Boolean),
      ),
    ];
  }
  if (context.deviceType === "bath-heater") {
    const lightEntityId =
      context.profile?.roles?.light ||
      candidates.find(
        (entity) =>
          entityDomain(entity) === "light" && relatedEntityIsAvailable(entity),
      )?.entityId;
    if (lightEntityId) {
      return [lightEntityId];
    } else {
      return [];
    }
  }
  if (context.deviceType === "vacuum") {
    const cleaningModeEntity = candidates.find(
      (entity) =>
        entityDomain(entity) === "select" &&
        (/cleaning_mode/i.test(String(entity.entityId || "")) ||
          entity.translationKey === "cleaning_mode"),
    );
    if (cleaningModeEntity?.entityId) {
      return [cleaningModeEntity.entityId];
    } else {
      return [];
    }
  }
  return [];
}
export function relatedEntityLabel(context, entity) {
  let label = String(entity?.name || entity?.originalName || "")
    .replace(/\s+/g, " ")
    .trim();
  const deviceNamePrefixes = [
    ...new Set(
      [
        context?.source?.originalName,
        context?.source?.name,
        context?.primary?.originalName,
        context?.primary?.name,
      ]
        .map((name) =>
          String(name || "")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean),
    ),
  ].sort((left, right) => right.length - left.length);
  for (const prefix of deviceNamePrefixes) {
    while (label !== prefix && label.startsWith(prefix + " ")) {
      label = label.slice(prefix.length).trim();
    }
  }
  return (
    label ||
    (String(entity?.entityId || "").split(".", 2)[1] || "关联功能").replace(
      /_/g,
      " ",
    )
  );
}
export function relatedEntityNeedsConfirmation(entity) {
  if (entityDomain(entity) !== "button") {
    return false;
  }
  const searchableText = [
    entity?.entityId,
    entity?.name,
    entity?.originalName,
    entity?.translationKey,
  ]
    .map((part) => String(part || ""))
    .join(" ");
  return /清空|清除|删除|重置|恢复出厂|格式化|解绑|empty|clear|delete|remove|reset|factory|wipe|format|unbind|purge/i.test(
    searchableText,
  );
}
export function relatedEntityOptions(entity, state) {
  const attributes = state?.attributes || {};
  const rawOptions =
    [
      attributes.options,
      attributes.option_list,
      entity?.options,
      entity?.attributes?.options,
      entity?.capabilities?.options,
    ].find((options) => Array.isArray(options)) || [];
  const currentState = String(state?.state || "").trim();
  const options = rawOptions
    .map((option) => String(option ?? "").trim())
    .filter(Boolean);
  if (
    currentState &&
    !["unknown", "unavailable"].includes(currentState.toLowerCase())
  ) {
    options.push(currentState);
  }
  return [...new Set(options)];
}
export function relatedEntitySelectService(entityOrDomain) {
  const domain =
    typeof entityOrDomain == "string"
      ? entityOrDomain
      : entityDomain(entityOrDomain);
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
  component,
  entityMetadata = new Map(),
  deviceMetadata = new Map(),
  states = new Map(),
) {
  const selectedIds = selectedRelatedEntityIds(component);
  if (selectedIds === null) {
    return null;
  }
  const context = relatedPopupContext(
    component,
    entityMetadata,
    deviceMetadata,
    states,
  );
  const selectionLimit = relatedPopupSelectionLimit(context);
  const candidatesById = new Map(
    relatedPopupCandidates(
      component,
      entityMetadata,
      deviceMetadata,
      states,
    ).map((entity) => [entity.entityId, entity]),
  );
  const selected = selectedIds
    .map((entityId) => candidatesById.get(entityId))
    .filter(Boolean);
  if (selectionLimit > 0) {
    return selected.slice(0, selectionLimit);
  } else {
    return selected;
  }
}
export function manualRelatedEntityConfig(entityIds = []) {
  return {
    mode: RELATED_ENTITY_MODE_SELECTED,
    entityIds: [
      ...new Set(
        entityIds.map((entityId) => String(entityId || "").trim()).filter(Boolean),
      ),
    ],
  };
}
