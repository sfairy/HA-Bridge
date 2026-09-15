const CLIMATE_DEVICE_TYPES = new Set(["auto", "air-conditioner", "bath-heater"]);
function normalizeStringList(values) {
  if (Array.isArray(values)) {
    return [...new Set(values.map(entry => String(entry ?? "").trim()).filter(Boolean))];
  } else {
    return [];
  }
}
function toNumberOrDefault(value, fallbackValue = null) {
  if (value == null || value === "") {
    return fallbackValue;
  }
  const parsedNumber = Number(value);
  if (Number.isFinite(parsedNumber)) {
    return parsedNumber;
  } else {
    return fallbackValue;
  }
}
export function configuredClimateDeviceType(component) {
  const configuredType = String(component?.properties?.deviceType || "auto");
  if (CLIMATE_DEVICE_TYPES.has(configuredType)) {
    return configuredType;
  } else {
    return "auto";
  }
}
export function normalizeClimateCapabilities(sourceState) {
  const stateAttributes =
    sourceState?.attributes && typeof sourceState.attributes == "object"
      ? sourceState.attributes
      : {};
  const hvacModes = normalizeStringList(stateAttributes.hvac_modes);
  const fanModes = normalizeStringList(stateAttributes.fan_modes);
  const swingModes = normalizeStringList(stateAttributes.swing_modes);
  const horizontalSwingModes = normalizeStringList(stateAttributes.swing_horizontal_modes);
  const presetModes = normalizeStringList(stateAttributes.preset_modes);
  const operationModes = normalizeStringList(stateAttributes.operation_list);
  const fanPercentage = toNumberOrDefault(stateAttributes.percentage);
  const fanPercentageStep = Math.max(1, toNumberOrDefault(stateAttributes.percentage_step, 1));
  const targetTemperature = toNumberOrDefault(stateAttributes.temperature);
  const currentTemperature = toNumberOrDefault(stateAttributes.current_temperature);
  let minimumTemperature = toNumberOrDefault(stateAttributes.min_temp, 16);
  let maximumTemperature = toNumberOrDefault(stateAttributes.max_temp, 30);
  if (maximumTemperature <= minimumTemperature) {
    minimumTemperature = 16;
    maximumTemperature = 30;
  }
  const temperatureStep = Math.max(0.1, toNumberOrDefault(stateAttributes.target_temp_step, 0.5));
  return {
    attributes: stateAttributes,
    hvacModes: hvacModes,
    fanModes: fanModes,
    swingModes: swingModes,
    horizontalSwingModes: horizontalSwingModes,
    presetModes: presetModes,
    operationModes: operationModes,
    fanPercentage: fanPercentage,
    fanPercentageStep: fanPercentageStep,
    targetTemperature: targetTemperature,
    currentTemperature: currentTemperature,
    minimumTemperature: minimumTemperature,
    maximumTemperature: maximumTemperature,
    temperatureStep: temperatureStep,
    supportsTargetTemperature: targetTemperature !== null,
    hasModeControl:
      hvacModes.some(mode => mode !== "off") ||
      operationModes.some(operationMode => !["off", "空"].includes(operationMode.toLowerCase())),
    hasFanControl: fanModes.length > 0,
    hasSwingControl: swingModes.length > 0,
    hasHorizontalSwingControl: horizontalSwingModes.length > 0,
    hasPresetControl: presetModes.length > 0,
    supportsFanPercentage: fanPercentage !== null
  };
}
export function climateOperationModeValues(stateEntity, deviceType = "air-conditioner") {
  const capabilities = normalizeClimateCapabilities(stateEntity);
  if (deviceType === "water-heater") {
    return capabilities.operationModes.filter(
      operationModeKey => !["off", "空"].includes(String(operationModeKey).trim().toLowerCase())
    );
  } else {
    return capabilities.hvacModes;
  }
}
export function reconcileClimateTargetTemperature(
  componentTargetTemperature,
  confirmedTemperature,
  pendingTemperature,
  stepOverride = 0.5
) {
  const confirmedValue = toNumberOrDefault(confirmedTemperature);
  const pendingValue = toNumberOrDefault(pendingTemperature);
  if (confirmedValue === null) {
    return {
      temperature: componentTargetTemperature,
      pending: pendingTemperature,
      confirmed: false
    };
  }
  if (pendingValue === null) {
    return {
      temperature: confirmedValue,
      pending: null,
      confirmed: false
    };
  }
  const tolerance = Math.max(0.001, Math.abs(toNumberOrDefault(stepOverride, 0.5)) / 2);
  if (Math.abs(confirmedValue - pendingValue) <= tolerance) {
    return {
      temperature: confirmedValue,
      pending: null,
      confirmed: true
    };
  } else {
    return {
      temperature: componentTargetTemperature,
      pending: pendingTemperature,
      confirmed: false
    };
  }
}
export function climateControlStructureKey(
  entityId,
  structureState,
  deviceTypeHint = "air-conditioner"
) {
  const structureCapabilities = normalizeClimateCapabilities(structureState);
  const entityDomain = String(entityId || "").split(".", 1)[0];
  const supportsTemperature =
    ["climate", "water_heater"].includes(entityDomain) &&
    structureCapabilities.supportsTargetTemperature;
  return JSON.stringify({
    temperature: supportsTemperature
      ? [
          structureCapabilities.minimumTemperature,
          structureCapabilities.maximumTemperature,
          structureCapabilities.temperatureStep
        ]
      : null,
    modes: climateOperationModeValues(structureState, deviceTypeHint),
    fanModes: entityDomain === "climate" ? structureCapabilities.fanModes : [],
    fanPercentageStep:
      entityDomain === "fan" && structureCapabilities.supportsFanPercentage
        ? structureCapabilities.fanPercentageStep
        : null,
    swingModes: structureCapabilities.swingModes,
    horizontalSwingModes: structureCapabilities.horizontalSwingModes,
    presetModes: structureCapabilities.presetModes
  });
}
export function resolveClimateDeviceType(deviceComponent, deviceState, friendlyName = "") {
  const configuredDeviceType = configuredClimateDeviceType(deviceComponent);
  if (configuredDeviceType !== "auto") {
    return configuredDeviceType;
  }
  const resolvedCapabilities = normalizeClimateCapabilities(deviceState);
  const nameSearchText = [
    deviceComponent?.properties?.label,
    deviceState?.attributes?.friendly_name,
    friendlyName
  ]
    .map(namePart => String(namePart || "").toLowerCase())
    .join(" ");
  if (/(浴霸|风暖|暖风|浴室取暖|bath.?heater)/i.test(nameSearchText)) {
    return "bath-heater";
  }
  const hvacModeKeys = resolvedCapabilities.hvacModes.map(normalizeClimateModeKey);
  const presetModeKeys = resolvedCapabilities.presetModes.map(normalizeClimateModeKey);
  if (
    [...hvacModeKeys, ...presetModeKeys].some(bathHeaterModeKey =>
      [
        "vent",
        "ventilate",
        "ventilation",
        "exhaust",
        "air_exchange",
        "defog",
        "quick_heat",
        "quick_defog",
        "drying",
        "取暖",
        "吹风",
        "换气",
        "除雾",
        "干燥"
      ].includes(bathHeaterModeKey)
    )
  ) {
    return "bath-heater";
  }
  if (hvacModeKeys.some(coolModeKey => ["cool", "heat_cool"].includes(coolModeKey))) {
    return "air-conditioner";
  }
  const activeHeatModes = hvacModeKeys.filter(heatModeKey => heatModeKey !== "off");
  if (activeHeatModes.length === 1 && activeHeatModes[0] === "heat") {
    return "bath-heater";
  } else {
    return "air-conditioner";
  }
}
const CLIMATE_MODE_LABELS = {
  off: "关闭",
  cool: "制冷",
  heat: "制热",
  dry: "除湿",
  fan_only: "送风",
  fan: "送风",
  auto: "自动",
  heat_cool: "冷暖自动",
  unavailable: "不可用",
  unknown: "未知",
  idle: "待机",
  none: "无",
  eco: "节能",
  boost: "强劲",
  performance: "强劲",
  silent: "静音",
  sleep: "睡眠",
  comfort: "舒适",
  away: "离家",
  mold_prev: "防霉",
  eco_and_mold_prev: "节能＋防霉",
  eco_mold_prev: "节能＋防霉"
};
const BATH_HEATER_MODE_LABELS = {
  off: "关闭",
  heat: "取暖",
  heating: "取暖",
  fan_only: "吹风",
  fan: "吹风",
  ventilation: "换气",
  ventilate: "换气",
  vent: "换气",
  exhaust: "换气",
  air_exchange: "换气",
  defog: "除雾",
  defogging: "除雾",
  demist: "除雾",
  anti_fog: "除雾",
  quick_heat: "快速取暖",
  rapid_heat: "快速取暖",
  fast_heat: "快速取暖",
  quick_defog: "快速除雾",
  rapid_defog: "快速除雾",
  fast_defog: "快速除雾",
  dry: "干燥",
  drying: "干燥",
  auto: "自动",
  unavailable: "不可用",
  unknown: "未知",
  idle: "待机",
  standby: "待机",
  none: "无",
  eco: "节能",
  boost: "强劲",
  performance: "强劲",
  silent: "静音",
  sleep: "睡眠",
  mold_prev: "防霉",
  eco_and_mold_prev: "节能＋防霉",
  eco_mold_prev: "节能＋防霉",
  制热: "取暖",
  暖风: "取暖",
  取暖: "取暖",
  吹风: "吹风",
  换气: "换气",
  除雾: "除雾",
  干燥: "干燥",
  待机: "待机"
};
const WATER_HEATER_MODE_LABELS = {
  off: "关闭",
  normal: "普通",
  standard: "普通",
  eco: "节能",
  adaptive: "自适温",
  auto: "自适温",
  heat_pump: "热泵",
  electric: "电加热",
  gas: "燃气",
  performance: "强力",
  vacation: "假期",
  普通: "普通",
  自适温: "自适温",
  节能: "节能",
  加热: "加热",
  保温: "保温"
};
const VERTICAL_SWING_LABELS = {
  off: "关闭",
  auto: "自动",
  default: "默认",
  full_swing: "全范围摆动",
  vertical: "上下摆动",
  horizontal: "左右摆动",
  both: "上下左右",
  fixed_upper: "固定上方",
  fixed_upper_middle: "固定中上",
  fixed_middle: "固定中间",
  fixed_lower_middle: "固定中下",
  fixed_lower: "固定下方",
  swing_upper: "上方摆动",
  swing_upper_middle: "中上摆动",
  swing_middle: "中间摆动",
  swing_lower_middle: "中下摆动",
  swing_lower: "下方摆动"
};
const HORIZONTAL_SWING_LABELS = {
  off: "关闭",
  auto: "自动",
  default: "默认",
  full_swing: "全范围摆动",
  left: "固定左侧",
  left_center: "固定中左",
  center: "固定居中",
  right_center: "固定中右",
  right: "固定右侧"
};
const HORIZONTAL_POSITION_LABELS = {
  horizontal_leftmost: "固定最左",
  horizontal_middle_left: "固定左中",
  horizontal_middle_right: "固定右中",
  horizontal_rightmost: "固定最右"
};
export function normalizeClimateModeKey(rawModeKey) {
  return String(rawModeKey || "")
    .normalize("NFKC")
    .trim()
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/[+&]/g, "_and_")
    .toLowerCase()
    .replace(/[\s./-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}
function measureTextWidth(text, fontSizePx) {
  return Array.from(String(text || "")).reduce(
    (accumulatedWidth, character) =>
      /\s/u.test(character)
        ? accumulatedWidth + fontSizePx * 0.35
        : /[\x00-\x7f]/u.test(character)
          ? /[ilI1.,:;'|!]/u.test(character)
            ? accumulatedWidth + fontSizePx * 0.32
            : /[mwMW@#%&]/u.test(character)
              ? accumulatedWidth + fontSizePx * 0.82
              : accumulatedWidth + fontSizePx * 0.58
          : accumulatedWidth + fontSizePx,
    0
  );
}
export function climateOptionPresentation(
  modes,
  labelLookup = {},
  {
    availableWidth: availableWidth = 380,
    buttonGap: buttonGap = 5,
    minimumButtonWidth: minimumButtonWidth = 36,
    horizontalPadding: horizontalPadding = 8,
    iconWidth: iconWidth = 20,
    inlineIcon: inlineIcon = false,
    inlineIconGap: inlineIconGap = 4,
    fontSize: fontSize = 11
  } = {}
) {
  const modeList = normalizeStringList(modes);
  if (
    modeList.length &&
    modeList
      .map(modeLabelKey => String(labelLookup?.[modeLabelKey] || modeLabelKey).trim())
      .reduce(
        (totalWidth, label) => {
          const labelWidth = measureTextWidth(label, fontSize);
          const buttonWidth = inlineIcon
            ? iconWidth + inlineIconGap + labelWidth
            : Math.max(iconWidth, labelWidth);
          return totalWidth + Math.max(minimumButtonWidth, buttonWidth + horizontalPadding);
        },
        Math.max(0, modeList.length - 1) * buttonGap
      ) > availableWidth
  ) {
    return "select";
  } else {
    return "buttons";
  }
}
export function climateModeTranslation(
  modeInput,
  {
    entityId: translationEntityId = "",
    entityMetadata: entityMetadata = null,
    entityTranslations: entityTranslations = null,
    attributes: attributeOverride = null
  } = {}
) {
  if (!entityTranslations || typeof entityTranslations != "object") {
    return "";
  }
  const metadata = entityMetadata?.get?.(translationEntityId) || {};
  const platform = String(metadata.platform || "").trim();
  const metadataDomain = String(
    metadata.domain || String(translationEntityId).split(".")[0] || ""
  ).trim();
  const translationKey = String(metadata.translationKey || "").trim();
  const modeKey = normalizeClimateModeKey(modeInput);
  if (!platform || !metadataDomain || !translationKey || !modeKey) {
    return "";
  }
  const translationPrefix =
    "component." + platform + ".entity." + metadataDomain + "." + translationKey;
  const attributeNames =
    Array.isArray(attributeOverride) && attributeOverride.length
      ? attributeOverride
      : ["preset_mode", "hvac_mode", "operation_mode", "fan_mode"];
  const trimmedMode = String(modeInput || "").trim();
  const modeCandidates = [
    ...new Set([trimmedMode, trimmedMode.toLowerCase(), modeKey].filter(Boolean))
  ];
  const translationKeyCandidates = attributeNames.flatMap(attributeName =>
    modeCandidates.flatMap(candidate => [
      translationPrefix + ".state_attributes." + attributeName + ".state." + candidate,
      translationPrefix + ".state_attributes." + attributeName + ".options." + candidate,
      translationPrefix + ".state_attributes." + attributeName + "." + candidate
    ])
  );
  for (const candidateTranslationKey of translationKeyCandidates) {
    const translation = String(entityTranslations[candidateTranslationKey] || "").trim();
    if (translation) {
      return translation;
    }
  }
  return "";
}
export function climateModeLabel(
  requestedMode,
  labelModeDeviceType = "air-conditioner",
  modeLabelOptions = {}
) {
  const rawMode = String(requestedMode || "").trim();
  if (!rawMode) {
    return "等待实体状态";
  }
  const normalizedModeKey = normalizeClimateModeKey(rawMode);
  const modeLabelTable =
    labelModeDeviceType === "bath-heater"
      ? BATH_HEATER_MODE_LABELS
      : labelModeDeviceType === "water-heater"
        ? WATER_HEATER_MODE_LABELS
        : CLIMATE_MODE_LABELS;
  const candidateTranslation = climateModeTranslation(rawMode, modeLabelOptions);
  if (candidateTranslation && /[^\x00-\x7f]/u.test(candidateTranslation)) {
    return candidateTranslation;
  } else {
    return modeLabelTable[normalizedModeKey] || candidateTranslation || rawMode;
  }
}
export function climateSwingModeLabel(
  swingModeInput,
  swingDirection = "vertical",
  swingLabelOptions = {}
) {
  const swingModeName = String(swingModeInput || "").trim();
  if (!swingModeName) {
    return "等待实体状态";
  }
  const normalizedSwingKey = normalizeClimateModeKey(swingModeName);
  const swingLabelTable =
    swingDirection === "horizontal" ? HORIZONTAL_SWING_LABELS : VERTICAL_SWING_LABELS;
  if (swingLabelTable[normalizedSwingKey]) {
    return swingLabelTable[normalizedSwingKey];
  }
  if (swingDirection === "vertical") {
    const positionMatch = normalizedSwingKey.match(
      /^(horizontal_(?:leftmost|middle_left|middle_right|rightmost))(?:_and_)?vertical_swing$/
    );
    if (positionMatch) {
      const positionLabel = HORIZONTAL_POSITION_LABELS[positionMatch[1]];
      if (positionLabel) {
        return positionLabel + "＋上下摆动";
      }
    }
    if (HORIZONTAL_POSITION_LABELS[normalizedSwingKey]) {
      return HORIZONTAL_POSITION_LABELS[normalizedSwingKey];
    }
  }
  return (
    climateModeTranslation(swingModeName, {
      ...swingLabelOptions,
      attributes: [swingDirection === "horizontal" ? "swing_horizontal_mode" : "swing_mode"]
    }) || swingModeName
  );
}
export function bathHeaterModeUsesAirflow(airflowModeInput) {
  const normalizedAirflowKey = normalizeClimateModeKey(airflowModeInput);
  if (normalizedAirflowKey) {
    return !["off", "idle", "standby", "unknown", "unavailable", "待机", "关闭"].includes(
      normalizedAirflowKey
    );
  } else {
    return false;
  }
}
export function climatePresentationMode(
  presentationState,
  presentationDeviceType = "air-conditioner"
) {
  const rawStateName = String(presentationState?.state || "off").trim();
  if (presentationDeviceType === "water-heater") {
    if (["off", "unknown", "unavailable"].includes(rawStateName.toLowerCase())) {
      return rawStateName;
    } else {
      return String(presentationState?.attributes?.operation_mode || rawStateName).trim();
    }
  }
  if (
    presentationDeviceType !== "bath-heater" ||
    ["unknown", "unavailable"].includes(rawStateName.toLowerCase())
  ) {
    return rawStateName;
  }
  if (rawStateName.toLowerCase() === "off") {
    const presetMode = String(
      presentationState?.attributes?.preset_mode || presentationState?.attributes?.mode || ""
    ).trim();
    if (bathHeaterModeUsesAirflow(presetMode)) {
      return presetMode;
    } else {
      return "off";
    }
  }
  return String(
    presentationState?.attributes?.preset_mode ||
      presentationState?.attributes?.mode ||
      presentationState?.attributes?.fan_mode ||
      rawStateName
  ).trim();
}
export function climateIsPoweredOn(powerState, powerDeviceType = "air-conditioner") {
  const lowercasedState = String(powerState?.state || "off")
    .trim()
    .toLowerCase();
  if (powerDeviceType === "bath-heater") {
    if (!lowercasedState || ["unknown", "unavailable"].includes(lowercasedState)) {
      return false;
    }
    const presentationMode = normalizeClimateModeKey(
      climatePresentationMode(powerState, powerDeviceType)
    );
    if (["off", "idle", "standby", "待机", "关闭"].includes(presentationMode)) {
      return false;
    } else if (lowercasedState === "off") {
      return bathHeaterModeUsesAirflow(presentationMode);
    } else {
      return true;
    }
  }
  return !["off", "unknown", "unavailable"].includes(lowercasedState);
}
export function climateIsRunning(runState, runDeviceType = "air-conditioner") {
  if (!climateIsPoweredOn(runState, runDeviceType)) {
    return false;
  }
  if (runDeviceType === "water-heater") {
    const measuredTemperature = toNumberOrDefault(runState?.attributes?.current_temperature);
    const targetTemperatureValue = toNumberOrDefault(runState?.attributes?.temperature);
    if (measuredTemperature !== null && targetTemperatureValue !== null) {
      return measuredTemperature < targetTemperatureValue - 0.4;
    } else {
      return true;
    }
  }
  if (runDeviceType === "bath-heater") {
    return bathHeaterModeUsesAirflow(climatePresentationMode(runState, runDeviceType));
  }
  const hvacAction = String(runState?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  return !["idle", "off"].includes(hvacAction);
}
export function climateEffectMode(effectState, effectDeviceType = "air-conditioner") {
  if (!climateIsPoweredOn(effectState, effectDeviceType)) {
    return "off";
  }
  if (effectDeviceType === "water-heater") {
    return "heat";
  }
  const effectModeKey = normalizeClimateModeKey(
    climatePresentationMode(effectState, effectDeviceType)
  );
  const hvacActionName = String(effectState?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  if (effectDeviceType === "bath-heater") {
    if (["fan", "fan_only", "吹风"].includes(effectModeKey)) {
      return "cool";
    } else if (
      [
        "heat",
        "heating",
        "quick_heat",
        "rapid_heat",
        "fast_heat",
        "quick_defog",
        "rapid_defog",
        "fast_defog",
        "取暖",
        "暖风",
        "制热"
      ].includes(effectModeKey)
    ) {
      return "heat";
    } else {
      return "other";
    }
  } else if (["cooling", "cool"].includes(hvacActionName) || effectModeKey === "cool") {
    return "cool";
  } else if (
    ["heating", "heat"].includes(hvacActionName) ||
    ["heat", "heating"].includes(effectModeKey)
  ) {
    return "heat";
  } else {
    return "other";
  }
}
export function climateModeIcon(iconModeInput, iconDeviceType = "air-conditioner") {
  const iconModeKey = normalizeClimateModeKey(iconModeInput);
  if (iconDeviceType === "water-heater") {
    return (
      {
        normal: "♨",
        standard: "♨",
        eco: "♢",
        adaptive: "A",
        auto: "A",
        heat_pump: "↻",
        electric: "↯",
        gas: "◈",
        performance: "↯",
        vacation: "⌂",
        普通: "♨",
        自适温: "A",
        节能: "♢",
        加热: "♨",
        保温: "○"
      }[iconModeKey] || "•"
    );
  } else if (iconDeviceType === "bath-heater") {
    return (
      {
        heat: "♨",
        heating: "♨",
        quick_heat: "♨",
        rapid_heat: "♨",
        fast_heat: "♨",
        fan_only: "✾",
        fan: "✾",
        ventilation: "↥",
        ventilate: "↥",
        vent: "↥",
        exhaust: "↥",
        air_exchange: "↥",
        defog: "◈",
        defogging: "◈",
        demist: "◈",
        anti_fog: "◈",
        quick_defog: "♨",
        rapid_defog: "♨",
        fast_defog: "♨",
        dry: "◇",
        drying: "◇",
        auto: "A",
        idle: "○",
        standby: "○",
        制热: "♨",
        暖风: "♨",
        取暖: "♨",
        吹风: "✾",
        换气: "↥",
        除雾: "◈",
        干燥: "◇",
        待机: "○"
      }[iconModeKey] || "•"
    );
  } else {
    return (
      {
        cool: "❄",
        heat: "☀",
        dry: "◊",
        fan_only: "✾",
        fan: "✾",
        auto: "A",
        heat_cool: "◐",
        none: "○",
        comfort: "♧",
        eco: "♢",
        boost: "↯",
        sleep: "☾",
        away: "⌂",
        mold_prev: "◌",
        eco_and_mold_prev: "♢",
        eco_mold_prev: "♢"
      }[iconModeKey] || "•"
    );
  }
}
export function climateDeviceLabel(deviceLabelType) {
  if (deviceLabelType === "bath-heater") {
    return "浴霸";
  } else if (deviceLabelType === "water-heater") {
    return "热水器";
  } else {
    return "空调";
  }
}
export function climateDialogTitle(title, fallbackTitle = "", titleDeviceType = "air-conditioner") {
  const trimmedTitle = String(title || "").trim();
  const defaultTitle = String(fallbackTitle || "").trim() || climateDeviceLabel(titleDeviceType);
  if (trimmedTitle) {
    if (titleDeviceType === "bath-heater" && trimmedTitle === "空调") {
      return defaultTitle;
    } else {
      return trimmedTitle;
    }
  } else {
    return defaultTitle;
  }
}
export function climatePowerCommand(
  commandEntityId,
  commandState,
  isTurningOn,
  commandDeviceType = "air-conditioner",
  preferredMode = ""
) {
  const commandDomain = String(commandEntityId || "").split(".", 1)[0];
  if (commandDomain === "water_heater") {
    return {
      domain: "water_heater",
      service: isTurningOn ? "turn_on" : "turn_off",
      data: {}
    };
  }
  if (commandDomain === "fan") {
    return {
      domain: "fan",
      service: isTurningOn ? "turn_on" : "turn_off",
      data: {}
    };
  }
  if (commandDomain !== "climate") {
    return {
      domain: "homeassistant",
      service: "toggle",
      data: {}
    };
  }
  const powerCapabilities = normalizeClimateCapabilities(commandState);
  if (!isTurningOn) {
    if (powerCapabilities.hvacModes.includes("off")) {
      return {
        domain: "climate",
        service: "set_hvac_mode",
        data: {
          hvac_mode: "off"
        }
      };
    } else {
      return {
        domain: "homeassistant",
        service: "toggle",
        data: {}
      };
    }
  }
  const availableModes = powerCapabilities.hvacModes.filter(
    availableMode => availableMode !== "off"
  );
  const preferredModes =
    commandDeviceType === "bath-heater"
      ? ["heat", "auto", "fan_only", "ventilation", "dry", "idle"]
      : ["auto", "cool", "heat_cool", "heat", "fan_only", "dry", "idle"];
  const selectedMode = availableModes.includes(preferredMode)
    ? preferredMode
    : preferredModes.find(candidateMode => availableModes.includes(candidateMode)) ||
      availableModes[0];
  if (selectedMode) {
    return {
      domain: "climate",
      service: "set_hvac_mode",
      data: {
        hvac_mode: selectedMode
      }
    };
  } else {
    return {
      domain: "homeassistant",
      service: "toggle",
      data: {}
    };
  }
}
export function climateDefaultIcon(defaultIconDeviceType) {
  if (defaultIconDeviceType === "bath-heater") {
    return "mdi:radiator";
  } else if (defaultIconDeviceType === "water-heater") {
    return "mdi:water-boiler";
  } else {
    return "mdi:air-conditioner";
  }
}
export function waterHeaterStatusLabel(waterHeaterState) {
  const rawState = String(waterHeaterState?.state || "")
    .trim()
    .toLowerCase();
  if (rawState === "unavailable") {
    return "当前不可用";
  } else if (!rawState || rawState === "unknown") {
    return "状态未知";
  } else if (rawState === "off") {
    return "已关闭";
  } else if (climateIsRunning(waterHeaterState, "water-heater")) {
    return "正在加热";
  } else {
    return "保温中";
  }
}
