const ALLOWED_CLIMATE_DEVICE_TYPES = new Set(["auto", "air-conditioner", "bath-heater"]);
function normalizeStringList(stringList) {
  if (Array.isArray(stringList)) {
    return [
      ...new Set(
        stringList.map((entry) => String(entry ?? "").trim()).filter(Boolean),
      ),
    ];
  } else {
    return [];
  }
}
function toFiniteNumber(value, fallback = null) {
  if (value == null || value === "") {
    return fallback;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  } else {
    return fallback;
  }
}
export function configuredClimateDeviceType(component) {
  const text = String(component?.properties?.deviceType || "auto");
  if (ALLOWED_CLIMATE_DEVICE_TYPES.has(text)) {
    return text;
  } else {
    return "auto";
  }
}
export function normalizeClimateCapabilities(climateCapabilities) {
  const attributes =
    climateCapabilities?.attributes &&
    typeof climateCapabilities.attributes == "object"
      ? climateCapabilities.attributes
      : {};
  const hvacModes = normalizeStringList(attributes.hvac_modes);
  const fanModes = normalizeStringList(attributes.fan_modes);
  const swingModes = normalizeStringList(attributes.swing_modes);
  const horizontalSwingModes = normalizeStringList(
    attributes.swing_horizontal_modes,
  );
  const presetModes = normalizeStringList(attributes.preset_modes);
  const operationModes = normalizeStringList(attributes.operation_list);
  const fanPercentage = toFiniteNumber(attributes.percentage);
  const fanPercentageStep = Math.max(
    1,
    toFiniteNumber(attributes.percentage_step, 1),
  );
  const targetTemperature = toFiniteNumber(attributes.temperature);
  const currentTemperature = toFiniteNumber(attributes.current_temperature);
  let minimumTemperature = toFiniteNumber(attributes.min_temp, 16);
  let maximumTemperature = toFiniteNumber(attributes.max_temp, 30);
  if (maximumTemperature <= minimumTemperature) {
    minimumTemperature = 16;
    maximumTemperature = 30;
  }
  const temperatureStep = Math.max(
    0.1,
    toFiniteNumber(attributes.target_temp_step, 0.5),
  );
  return {
    attributes: attributes,
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
      hvacModes.some((mode) => mode !== "off") ||
      operationModes.some(
        (mode) =>
          !["off", "空"].includes(mode.toLowerCase()),
      ),
    hasFanControl: fanModes.length > 0,
    hasSwingControl: swingModes.length > 0,
    hasHorizontalSwingControl: horizontalSwingModes.length > 0,
    hasPresetControl: presetModes.length > 0,
    supportsFanPercentage: fanPercentage !== null,
  };
}
export function climateOperationModeValues(
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  const climateCapabilities = normalizeClimateCapabilities(entityOrEvent);
  if (deviceType === "water-heater") {
    return climateCapabilities.operationModes.filter(
      (mode) => !["off", "空"].includes(String(mode).trim().toLowerCase()),
    );
  } else {
    return climateCapabilities.hvacModes;
  }
}
export function reconcileClimateTargetTemperature(
  temperature,
  reportedTemperature,
  pending,
  temperatureStep = 0.5,
) {
  const reported = toFiniteNumber(reportedTemperature);
  const pendingTemperature = toFiniteNumber(pending);
  if (reported === null) {
    return {
      temperature: temperature,
      pending: pending,
      confirmed: false,
    };
  }
  if (pendingTemperature === null) {
    return {
      temperature: reported,
      pending: null,
      confirmed: false,
    };
  }
  const tolerance = Math.max(
    0.001,
    Math.abs(toFiniteNumber(temperatureStep, 0.5)) / 2,
  );
  if (Math.abs(reported - pendingTemperature) <= tolerance) {
    return {
      temperature: reported,
      pending: null,
      confirmed: true,
    };
  } else {
    return {
      temperature: temperature,
      pending: pending,
      confirmed: false,
    };
  }
}
export function climateControlStructureKey(
  entityId,
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  const climateCapabilities = normalizeClimateCapabilities(entityOrEvent);
  const domain = String(entityId || "").split(".", 1)[0];
  const supportsTemperatureControl =
    ["climate", "water_heater"].includes(domain) &&
    climateCapabilities.supportsTargetTemperature;
  return JSON.stringify({
    temperature: supportsTemperatureControl
      ? [
          climateCapabilities.minimumTemperature,
          climateCapabilities.maximumTemperature,
          climateCapabilities.temperatureStep,
        ]
      : null,
    modes: climateOperationModeValues(entityOrEvent, deviceType),
    fanModes: domain === "climate" ? climateCapabilities.fanModes : [],
    fanPercentageStep:
      domain === "fan" && climateCapabilities.supportsFanPercentage
        ? climateCapabilities.fanPercentageStep
        : null,
    swingModes: climateCapabilities.swingModes,
    horizontalSwingModes: climateCapabilities.horizontalSwingModes,
    presetModes: climateCapabilities.presetModes,
  });
}
export function resolveClimateDeviceType(
  component,
  entityOrEvent,
  entityId = "",
) {
  const configuredType = configuredClimateDeviceType(component);
  if (configuredType !== "auto") {
    return configuredType;
  }
  const climateCapabilities = normalizeClimateCapabilities(entityOrEvent);
  const searchText = [
    component?.properties?.label,
    entityOrEvent?.attributes?.friendly_name,
    entityId,
  ]
    .map((part) => String(part || "").toLowerCase())
    .join(" ");
  if (/(浴霸|风暖|暖风|浴室取暖|bath.?heater)/i.test(searchText)) {
    return "bath-heater";
  }
  const hvacModeKeys = climateCapabilities.hvacModes.map(normalizeClimateModeKey);
  const presetModeKeys = climateCapabilities.presetModes.map(
    normalizeClimateModeKey,
  );
  if (
    [...hvacModeKeys, ...presetModeKeys].some((modeKey) =>
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
        "干燥",
      ].includes(modeKey),
    )
  ) {
    return "bath-heater";
  }
  if (hvacModeKeys.some((modeKey) => ["cool", "heat_cool"].includes(modeKey))) {
    return "air-conditioner";
  }
  const nonOffModes = hvacModeKeys.filter((modeKey) => modeKey !== "off");
  if (nonOffModes.length === 1 && nonOffModes[0] === "heat") {
    return "bath-heater";
  } else {
    return "air-conditioner";
  }
}
const AC_PRESET_LABELS = {
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
  eco_mold_prev: "节能＋防霉",
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
  待机: "待机",
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
  保温: "保温",
};
const SWING_MODE_LABELS = {
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
  swing_lower: "下方摆动",
};
const HORIZONTAL_SWING_MODE_LABELS = {
  off: "关闭",
  auto: "自动",
  default: "默认",
  full_swing: "全范围摆动",
  left: "固定左侧",
  left_center: "固定中左",
  center: "固定居中",
  right_center: "固定中右",
  right: "固定右侧",
};
const HORIZONTAL_POSITION_LABELS = {
  horizontal_leftmost: "固定最左",
  horizontal_middle_left: "固定左中",
  horizontal_middle_right: "固定右中",
  horizontal_rightmost: "固定最右",
};
export function normalizeClimateModeKey(climateModeKey) {
  return String(climateModeKey || "")
    .normalize("NFKC")
    .trim()
    .replace(/([a-z\d])([A-Z])/g, "$1_$2")
    .replace(/[+&]/g, "_and_")
    .toLowerCase()
    .replace(/[\s./-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}
function estimateTextWidth(text, fontSize) {
  return Array.from(String(text || "")).reduce(
    (width, character) =>
      /\s/u.test(character)
        ? width + fontSize * 0.35
        : /[\x00-\x7f]/u.test(character)
          ? /[ilI1.,:;'|!]/u.test(character)
            ? width + fontSize * 0.32
            : /[mwMW@#%&]/u.test(character)
              ? width + fontSize * 0.82
              : width + fontSize * 0.58
          : width + fontSize,
    0,
  );
}
export function climateOptionPresentation(
  options,
  labels = {},
  {
    availableWidth = 380,
    buttonGap = 5,
    minimumButtonWidth = 36,
    horizontalPadding = 8,
    iconWidth = 20,
    inlineIcon = false,
    inlineIconGap = 4,
    fontSize = 11,
  } = {},
) {
  const stringList = normalizeStringList(options);
  if (
    stringList.length &&
    stringList
      .map((option) => String(labels?.[option] || option).trim())
      .reduce(
        (totalWidth, label) => {
          const textWidth = estimateTextWidth(label, fontSize);
          const contentWidth = inlineIcon
            ? iconWidth + inlineIconGap + textWidth
            : Math.max(iconWidth, textWidth);
          return totalWidth + Math.max(minimumButtonWidth, contentWidth + horizontalPadding);
        },
        Math.max(0, stringList.length - 1) * buttonGap,
      ) > availableWidth
  ) {
    return "select";
  } else {
    return "buttons";
  }
}
export function climateModeTranslation(
  mode,
  {
    entityId = "",
    entityMetadata = null,
    entityTranslations = null,
    attributes = null,
  } = {},
) {
  if (!entityTranslations || typeof entityTranslations != "object") {
    return "";
  }
  const metadata = entityMetadata?.get?.(entityId) || {};
  const platform = String(metadata.platform || "").trim();
  const domain = String(
    metadata.domain || String(entityId).split(".")[0] || "",
  ).trim();
  const translationKey = String(metadata.translationKey || "").trim();
  const climateModeKey = normalizeClimateModeKey(mode);
  if (!platform || !domain || !translationKey || !climateModeKey) {
    return "";
  }
  const translationPrefix =
    "component." + platform + ".entity." + domain + "." + translationKey;
  const attributeKeys =
    Array.isArray(attributes) && attributes.length
      ? attributes
      : ["preset_mode", "hvac_mode", "operation_mode", "fan_mode"];
  const rawMode = String(mode || "").trim();
  const modeVariants = [
    ...new Set(
      [rawMode, rawMode.toLowerCase(), climateModeKey].filter(Boolean),
    ),
  ];
  const translationPaths = attributeKeys.flatMap((attributeKey) =>
    modeVariants.flatMap((modeVariant) => [
      translationPrefix +
        ".state_attributes." +
        attributeKey +
        ".state." +
        modeVariant,
      translationPrefix +
        ".state_attributes." +
        attributeKey +
        ".options." +
        modeVariant,
      translationPrefix + ".state_attributes." + attributeKey + "." + modeVariant,
    ]),
  );
  for (const path of translationPaths) {
    const translated = String(entityTranslations[path] || "").trim();
    if (translated) {
      return translated;
    }
  }
  return "";
}
export function climateModeLabel(
  mode,
  deviceType = "air-conditioner",
  translationOptions = {},
) {
  const rawMode = String(mode || "").trim();
  if (!rawMode) {
    return "等待实体状态";
  }
  const climateModeKey = normalizeClimateModeKey(rawMode);
  const labelTable =
    deviceType === "bath-heater"
      ? BATH_HEATER_MODE_LABELS
      : deviceType === "water-heater"
        ? WATER_HEATER_MODE_LABELS
        : AC_PRESET_LABELS;
  const translated = climateModeTranslation(rawMode, translationOptions);
  if (translated && /[^\x00-\x7f]/u.test(translated)) {
    return translated;
  } else {
    return labelTable[climateModeKey] || translated || rawMode;
  }
}
export function climateSwingModeLabel(
  mode,
  orientation = "vertical",
  translationOptions = {},
) {
  const rawMode = String(mode || "").trim();
  if (!rawMode) {
    return "等待实体状态";
  }
  const climateModeKey = normalizeClimateModeKey(rawMode);
  const labelTable =
    orientation === "horizontal"
      ? HORIZONTAL_SWING_MODE_LABELS
      : SWING_MODE_LABELS;
  if (labelTable[climateModeKey]) {
    return labelTable[climateModeKey];
  }
  if (orientation === "vertical") {
    const combinedMatch = climateModeKey.match(
      /^(horizontal_(?:leftmost|middle_left|middle_right|rightmost))(?:_and_)?vertical_swing$/,
    );
    if (combinedMatch) {
      const horizontalLabel = HORIZONTAL_POSITION_LABELS[combinedMatch[1]];
      if (horizontalLabel) {
        return horizontalLabel + "＋上下摆动";
      }
    }
    if (HORIZONTAL_POSITION_LABELS[climateModeKey]) {
      return HORIZONTAL_POSITION_LABELS[climateModeKey];
    }
  }
  return (
    climateModeTranslation(rawMode, {
      ...translationOptions,
      attributes: [
        orientation === "horizontal" ? "swing_horizontal_mode" : "swing_mode",
      ],
    }) || rawMode
  );
}
export function bathHeaterModeUsesAirflow(mode) {
  const climateModeKey = normalizeClimateModeKey(mode);
  if (climateModeKey) {
    return ![
      "off",
      "idle",
      "standby",
      "unknown",
      "unavailable",
      "待机",
      "关闭",
    ].includes(climateModeKey);
  } else {
    return false;
  }
}
export function climatePresentationMode(
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  const state = String(entityOrEvent?.state || "off").trim();
  if (deviceType === "water-heater") {
    if (["off", "unknown", "unavailable"].includes(state.toLowerCase())) {
      return state;
    } else {
      return String(entityOrEvent?.attributes?.operation_mode || state).trim();
    }
  }
  if (
    deviceType !== "bath-heater" ||
    ["unknown", "unavailable"].includes(state.toLowerCase())
  ) {
    return state;
  }
  if (state.toLowerCase() === "off") {
    const presetOrMode = String(
      entityOrEvent?.attributes?.preset_mode ||
        entityOrEvent?.attributes?.mode ||
        "",
    ).trim();
    if (bathHeaterModeUsesAirflow(presetOrMode)) {
      return presetOrMode;
    } else {
      return "off";
    }
  }
  return String(
    entityOrEvent?.attributes?.preset_mode ||
      entityOrEvent?.attributes?.mode ||
      entityOrEvent?.attributes?.fan_mode ||
      state,
  ).trim();
}
export function climateIsPoweredOn(
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  const state = String(entityOrEvent?.state || "off")
    .trim()
    .toLowerCase();
  if (deviceType === "bath-heater") {
    if (!state || ["unknown", "unavailable"].includes(state)) {
      return false;
    }
    const climateModeKey = normalizeClimateModeKey(
      climatePresentationMode(entityOrEvent, deviceType),
    );
    if (["off", "idle", "standby", "待机", "关闭"].includes(climateModeKey)) {
      return false;
    } else if (state === "off") {
      return bathHeaterModeUsesAirflow(climateModeKey);
    } else {
      return true;
    }
  }
  return !["off", "unknown", "unavailable"].includes(state);
}
export function climateIsRunning(
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  if (!climateIsPoweredOn(entityOrEvent, deviceType)) {
    return false;
  }
  if (deviceType === "water-heater") {
    const currentTemperature = toFiniteNumber(
      entityOrEvent?.attributes?.current_temperature,
    );
    const targetTemperature = toFiniteNumber(
      entityOrEvent?.attributes?.temperature,
    );
    if (currentTemperature !== null && targetTemperature !== null) {
      return currentTemperature < targetTemperature - 0.4;
    } else {
      return true;
    }
  }
  if (deviceType === "bath-heater") {
    return bathHeaterModeUsesAirflow(
      climatePresentationMode(entityOrEvent, deviceType),
    );
  }
  const hvacAction = String(entityOrEvent?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  return !["idle", "off"].includes(hvacAction);
}
export function climateEffectMode(
  entityOrEvent,
  deviceType = "air-conditioner",
) {
  if (!climateIsPoweredOn(entityOrEvent, deviceType)) {
    return "off";
  }
  if (deviceType === "water-heater") {
    return "heat";
  }
  const climateModeKey = normalizeClimateModeKey(
    climatePresentationMode(entityOrEvent, deviceType),
  );
  const hvacAction = String(entityOrEvent?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  if (deviceType === "bath-heater") {
    if (["fan", "fan_only", "吹风"].includes(climateModeKey)) {
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
        "制热",
      ].includes(climateModeKey)
    ) {
      return "heat";
    } else {
      return "other";
    }
  } else if (
    ["cooling", "cool"].includes(hvacAction) ||
    climateModeKey === "cool"
  ) {
    return "cool";
  } else if (
    ["heating", "heat"].includes(hvacAction) ||
    ["heat", "heating"].includes(climateModeKey)
  ) {
    return "heat";
  } else {
    return "other";
  }
}
export function climateModeIcon(mode, deviceType = "air-conditioner") {
  const climateModeKey = normalizeClimateModeKey(mode);
  if (deviceType === "water-heater") {
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
        保温: "○",
      }[climateModeKey] || "•"
    );
  } else if (deviceType === "bath-heater") {
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
        待机: "○",
      }[climateModeKey] || "•"
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
        eco_mold_prev: "♢",
      }[climateModeKey] || "•"
    );
  }
}
export function climateDeviceLabel(deviceType) {
  if (deviceType === "bath-heater") {
    return "浴霸";
  } else if (deviceType === "water-heater") {
    return "热水器";
  } else {
    return "空调";
  }
}
export function climateDialogTitle(
  title,
  fallbackLabel = "",
  deviceType = "air-conditioner",
) {
  const trimmedTitle = String(title || "").trim();
  const deviceLabel =
    String(fallbackLabel || "").trim() || climateDeviceLabel(deviceType);
  if (trimmedTitle) {
    if (deviceType === "bath-heater" && trimmedTitle === "空调") {
      return deviceLabel;
    } else {
      return trimmedTitle;
    }
  } else {
    return deviceLabel;
  }
}
export function climatePowerCommand(
  entityId,
  entityOrEvent,
  turnOn,
  deviceType = "air-conditioner",
  preferredMode = "",
) {
  const domain = String(entityId || "").split(".", 1)[0];
  if (domain === "water_heater") {
    return {
      domain: "water_heater",
      service: turnOn ? "turn_on" : "turn_off",
      data: {},
    };
  }
  if (domain === "fan") {
    return {
      domain: "fan",
      service: turnOn ? "turn_on" : "turn_off",
      data: {},
    };
  }
  if (domain !== "climate") {
    return {
      domain: "homeassistant",
      service: "toggle",
      data: {},
    };
  }
  const climateCapabilities = normalizeClimateCapabilities(entityOrEvent);
  if (!turnOn) {
    if (climateCapabilities.hvacModes.includes("off")) {
      return {
        domain: "climate",
        service: "set_hvac_mode",
        data: {
          hvac_mode: "off",
        },
      };
    } else {
      return {
        domain: "homeassistant",
        service: "toggle",
        data: {},
      };
    }
  }
  const availableModes = climateCapabilities.hvacModes.filter(
    (mode) => mode !== "off",
  );
  const preferredModes =
    deviceType === "bath-heater"
      ? ["heat", "auto", "fan_only", "ventilation", "dry", "idle"]
      : ["auto", "cool", "heat_cool", "heat", "fan_only", "dry", "idle"];
  const hvac_mode = availableModes.includes(preferredMode)
    ? preferredMode
    : preferredModes.find((mode) => availableModes.includes(mode)) ||
      availableModes[0];
  if (hvac_mode) {
    return {
      domain: "climate",
      service: "set_hvac_mode",
      data: {
        hvac_mode: hvac_mode,
      },
    };
  } else {
    return {
      domain: "homeassistant",
      service: "toggle",
      data: {},
    };
  }
}
export function climateDefaultIcon(deviceType) {
  if (deviceType === "bath-heater") {
    return "mdi:radiator";
  } else if (deviceType === "water-heater") {
    return "mdi:water-boiler";
  } else {
    return "mdi:air-conditioner";
  }
}
export function waterHeaterStatusLabel(entityOrEvent) {
  const state = String(entityOrEvent?.state || "")
    .trim()
    .toLowerCase();
  if (state === "unavailable") {
    return "当前不可用";
  } else if (!state || state === "unknown") {
    return "状态未知";
  } else if (state === "off") {
    return "已关闭";
  } else if (climateIsRunning(entityOrEvent, "water-heater")) {
    return "正在加热";
  } else {
    return "保温中";
  }
}
