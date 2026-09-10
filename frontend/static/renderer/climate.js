const bag = new Set(["auto", "air-conditioner", "bath-heater"]);
function normalizeStringList(stringList) {
  if (Array.isArray(stringList)) {
    return [
      ...new Set(
        stringList.map((value2) => String(value2 ?? "").trim()).filter(Boolean),
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
  if (bag.has(text)) {
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
      hvacModes.some((hasModeControl) => hasModeControl !== "off") ||
      operationModes.some(
        (hasModeControl) =>
          !["off", "空"].includes(hasModeControl.toLowerCase()),
      ),
    hasFanControl: fanModes.length > 0,
    hasSwingControl: swingModes.length > 0,
    hasHorizontalSwingControl: horizontalSwingModes.length > 0,
    hasPresetControl: presetModes.length > 0,
    supportsFanPercentage: fanPercentage !== null,
  };
}
export function climateOperationModeValues(value, value2 = "air-conditioner") {
  const climateCapabilities = normalizeClimateCapabilities(value);
  if (value2 === "water-heater") {
    return climateCapabilities.operationModes.filter(
      (value3) => !["off", "空"].includes(String(value3).trim().toLowerCase()),
    );
  } else {
    return climateCapabilities.hvacModes;
  }
}
export function reconcileClimateTargetTemperature(
  temperature,
  value,
  pending,
  value2 = 0.5,
) {
  const temperature2 = toFiniteNumber(value);
  const value3 = toFiniteNumber(pending);
  if (temperature2 === null) {
    return {
      temperature: temperature,
      pending: pending,
      confirmed: false,
    };
  }
  if (value3 === null) {
    return {
      temperature: temperature2,
      pending: null,
      confirmed: false,
    };
  }
  const count = Math.max(0.001, Math.abs(toFiniteNumber(value2, 0.5)) / 2);
  if (Math.abs(temperature2 - value3) <= count) {
    return {
      temperature: temperature2,
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
  value,
  value2,
  value3 = "air-conditioner",
) {
  const climateCapabilities = normalizeClimateCapabilities(value2);
  const value4 = String(value || "").split(".", 1)[0];
  const value5 =
    ["climate", "water_heater"].includes(value4) &&
    climateCapabilities.supportsTargetTemperature;
  return JSON.stringify({
    temperature: value5
      ? [
          climateCapabilities.minimumTemperature,
          climateCapabilities.maximumTemperature,
          climateCapabilities.temperatureStep,
        ]
      : null,
    modes: climateOperationModeValues(value2, value3),
    fanModes: value4 === "climate" ? climateCapabilities.fanModes : [],
    fanPercentageStep:
      value4 === "fan" && climateCapabilities.supportsFanPercentage
        ? climateCapabilities.fanPercentageStep
        : null,
    swingModes: climateCapabilities.swingModes,
    horizontalSwingModes: climateCapabilities.horizontalSwingModes,
    presetModes: climateCapabilities.presetModes,
  });
}
export function resolveClimateDeviceType(component, value, value2 = "") {
  const value3 = configuredClimateDeviceType(component);
  if (value3 !== "auto") {
    return value3;
  }
  const climateCapabilities = normalizeClimateCapabilities(value);
  const value4 = [
    component?.properties?.label,
    value?.attributes?.friendly_name,
    value2,
  ]
    .map((value8) => String(value8 || "").toLowerCase())
    .join(" ");
  if (/(浴霸|风暖|暖风|浴室取暖|bath.?heater)/i.test(value4)) {
    return "bath-heater";
  }
  const value5 = climateCapabilities.hvacModes.map(normalizeClimateModeKey);
  const value6 = climateCapabilities.presetModes.map(normalizeClimateModeKey);
  if (
    [...value5, ...value6].some((value8) =>
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
      ].includes(value8),
    )
  ) {
    return "bath-heater";
  }
  if (value5.some((value8) => ["cool", "heat_cool"].includes(value8))) {
    return "air-conditioner";
  }
  const value7 = value5.filter((value8) => value8 !== "off");
  if (value7.length === 1 && value7[0] === "heat") {
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
function estimateTextWidth(value, value2) {
  return Array.from(String(value || "")).reduce(
    (value3, value4) =>
      /\s/u.test(value4)
        ? value3 + value2 * 0.35
        : /[\x00-\x7f]/u.test(value4)
          ? /[ilI1.,:;'|!]/u.test(value4)
            ? value3 + value2 * 0.32
            : /[mwMW@#%&]/u.test(value4)
              ? value3 + value2 * 0.82
              : value3 + value2 * 0.58
          : value3 + value2,
    0,
  );
}
export function climateOptionPresentation(
  value,
  value2 = {},
  {
    availableWidth: value3 = 380,
    buttonGap: value4 = 5,
    minimumButtonWidth: value5 = 36,
    horizontalPadding: value6 = 8,
    iconWidth: value7 = 20,
    inlineIcon: value8 = false,
    inlineIconGap: value9 = 4,
    fontSize: value10 = 11,
  } = {},
) {
  const stringList = normalizeStringList(value);
  if (
    stringList.length &&
    stringList
      .map((value12) => String(value2?.[value12] || value12).trim())
      .reduce(
        (value12, value13) => {
          const value14 = estimateTextWidth(value13, value10);
          const value15 = value8
            ? value7 + value9 + value14
            : Math.max(value7, value14);
          return value12 + Math.max(value5, value15 + value6);
        },
        Math.max(0, stringList.length - 1) * value4,
      ) > value3
  ) {
    return "select";
  } else {
    return "buttons";
  }
}
export function climateModeTranslation(
  value,
  {
    entityId: value2 = "",
    entityMetadata: value3 = null,
    entityTranslations: value4 = null,
    attributes: value5 = null,
  } = {},
) {
  if (!value4 || typeof value4 != "object") {
    return "";
  }
  const value6 = value3?.get?.(value2) || {};
  const value7 = String(value6.platform || "").trim();
  const value8 = String(
    value6.domain || String(value2).split(".")[0] || "",
  ).trim();
  const value9 = String(value6.translationKey || "").trim();
  const climateModeKey = normalizeClimateModeKey(value);
  if (!value7 || !value8 || !value9 || !climateModeKey) {
    return "";
  }
  const value10 = "component." + value7 + ".entity." + value8 + "." + value9;
  const value11 =
    Array.isArray(value5) && value5.length
      ? value5
      : ["preset_mode", "hvac_mode", "operation_mode", "fan_mode"];
  const value12 = String(value || "").trim();
  const value13 = [
    ...new Set(
      [value12, value12.toLowerCase(), climateModeKey].filter(Boolean),
    ),
  ];
  const value14 = value11.flatMap((value15) =>
    value13.flatMap((value16) => [
      value10 + ".state_attributes." + value15 + ".state." + value16,
      value10 + ".state_attributes." + value15 + ".options." + value16,
      value10 + ".state_attributes." + value15 + "." + value16,
    ]),
  );
  for (const value15 of value14) {
    const value16 = String(value4[value15] || "").trim();
    if (value16) {
      return value16;
    }
  }
  return "";
}
export function climateModeLabel(
  value,
  value2 = "air-conditioner",
  value3 = {},
) {
  const value4 = String(value || "").trim();
  if (!value4) {
    return "等待实体状态";
  }
  const climateModeKey = normalizeClimateModeKey(value4);
  const value5 =
    value2 === "bath-heater" ? BATH_HEATER_MODE_LABELS : value2 === "water-heater" ? WATER_HEATER_MODE_LABELS : AC_PRESET_LABELS;
  const value6 = climateModeTranslation(value4, value3);
  if (value6 && /[^\x00-\x7f]/u.test(value6)) {
    return value6;
  } else {
    return value5[climateModeKey] || value6 || value4;
  }
}
export function climateSwingModeLabel(value, value2 = "vertical", value3 = {}) {
  const value4 = String(value || "").trim();
  if (!value4) {
    return "等待实体状态";
  }
  const climateModeKey = normalizeClimateModeKey(value4);
  const value5 = value2 === "horizontal" ? HORIZONTAL_SWING_MODE_LABELS : SWING_MODE_LABELS;
  if (value5[climateModeKey]) {
    return value5[climateModeKey];
  }
  if (value2 === "vertical") {
    const value6 = climateModeKey.match(
      /^(horizontal_(?:leftmost|middle_left|middle_right|rightmost))(?:_and_)?vertical_swing$/,
    );
    if (value6) {
      const value7 = HORIZONTAL_POSITION_LABELS[value6[1]];
      if (value7) {
        return value7 + "＋上下摆动";
      }
    }
    if (HORIZONTAL_POSITION_LABELS[climateModeKey]) {
      return HORIZONTAL_POSITION_LABELS[climateModeKey];
    }
  }
  return (
    climateModeTranslation(value4, {
      ...value3,
      attributes: [
        value2 === "horizontal" ? "swing_horizontal_mode" : "swing_mode",
      ],
    }) || value4
  );
}
export function bathHeaterModeUsesAirflow(value) {
  const climateModeKey = normalizeClimateModeKey(value);
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
export function climatePresentationMode(value, value2 = "air-conditioner") {
  const value3 = String(value?.state || "off").trim();
  if (value2 === "water-heater") {
    if (["off", "unknown", "unavailable"].includes(value3.toLowerCase())) {
      return value3;
    } else {
      return String(value?.attributes?.operation_mode || value3).trim();
    }
  }
  if (
    value2 !== "bath-heater" ||
    ["unknown", "unavailable"].includes(value3.toLowerCase())
  ) {
    return value3;
  }
  if (value3.toLowerCase() === "off") {
    const value4 = String(
      value?.attributes?.preset_mode || value?.attributes?.mode || "",
    ).trim();
    if (bathHeaterModeUsesAirflow(value4)) {
      return value4;
    } else {
      return "off";
    }
  }
  return String(
    value?.attributes?.preset_mode ||
      value?.attributes?.mode ||
      value?.attributes?.fan_mode ||
      value3,
  ).trim();
}
export function climateIsPoweredOn(value, value2 = "air-conditioner") {
  const value3 = String(value?.state || "off")
    .trim()
    .toLowerCase();
  if (value2 === "bath-heater") {
    if (!value3 || ["unknown", "unavailable"].includes(value3)) {
      return false;
    }
    const climateModeKey = normalizeClimateModeKey(
      climatePresentationMode(value, value2),
    );
    if (["off", "idle", "standby", "待机", "关闭"].includes(climateModeKey)) {
      return false;
    } else if (value3 === "off") {
      return bathHeaterModeUsesAirflow(climateModeKey);
    } else {
      return true;
    }
  }
  return !["off", "unknown", "unavailable"].includes(value3);
}
export function climateIsRunning(value, value2 = "air-conditioner") {
  if (!climateIsPoweredOn(value, value2)) {
    return false;
  }
  if (value2 === "water-heater") {
    const value4 = toFiniteNumber(value?.attributes?.current_temperature);
    const value5 = toFiniteNumber(value?.attributes?.temperature);
    if (value4 !== null && value5 !== null) {
      return value4 < value5 - 0.4;
    } else {
      return true;
    }
  }
  if (value2 === "bath-heater") {
    return bathHeaterModeUsesAirflow(climatePresentationMode(value, value2));
  }
  const value3 = String(value?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  return !["idle", "off"].includes(value3);
}
export function climateEffectMode(value, value2 = "air-conditioner") {
  if (!climateIsPoweredOn(value, value2)) {
    return "off";
  }
  if (value2 === "water-heater") {
    return "heat";
  }
  const climateModeKey = normalizeClimateModeKey(
    climatePresentationMode(value, value2),
  );
  const value3 = String(value?.attributes?.hvac_action || "")
    .trim()
    .toLowerCase();
  if (value2 === "bath-heater") {
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
    ["cooling", "cool"].includes(value3) ||
    climateModeKey === "cool"
  ) {
    return "cool";
  } else if (
    ["heating", "heat"].includes(value3) ||
    ["heat", "heating"].includes(climateModeKey)
  ) {
    return "heat";
  } else {
    return "other";
  }
}
export function climateModeIcon(value, value2 = "air-conditioner") {
  const climateModeKey = normalizeClimateModeKey(value);
  if (value2 === "water-heater") {
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
  } else if (value2 === "bath-heater") {
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
export function climateDeviceLabel(value) {
  if (value === "bath-heater") {
    return "浴霸";
  } else if (value === "water-heater") {
    return "热水器";
  } else {
    return "空调";
  }
}
export function climateDialogTitle(
  value,
  value2 = "",
  value3 = "air-conditioner",
) {
  const value4 = String(value || "").trim();
  const value5 = String(value2 || "").trim() || climateDeviceLabel(value3);
  if (value4) {
    if (value3 === "bath-heater" && value4 === "空调") {
      return value5;
    } else {
      return value4;
    }
  } else {
    return value5;
  }
}
export function climatePowerCommand(
  value,
  value2,
  value3,
  value4 = "air-conditioner",
  value5 = "",
) {
  const value6 = String(value || "").split(".", 1)[0];
  if (value6 === "water_heater") {
    return {
      domain: "water_heater",
      service: value3 ? "turn_on" : "turn_off",
      data: {},
    };
  }
  if (value6 === "fan") {
    return {
      domain: "fan",
      service: value3 ? "turn_on" : "turn_off",
      data: {},
    };
  }
  if (value6 !== "climate") {
    return {
      domain: "homeassistant",
      service: "toggle",
      data: {},
    };
  }
  const climateCapabilities = normalizeClimateCapabilities(value2);
  if (!value3) {
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
  const value7 = climateCapabilities.hvacModes.filter(
    (value9) => value9 !== "off",
  );
  const value8 =
    value4 === "bath-heater"
      ? ["heat", "auto", "fan_only", "ventilation", "dry", "idle"]
      : ["auto", "cool", "heat_cool", "heat", "fan_only", "dry", "idle"];
  const hvac_mode = value7.includes(value5)
    ? value5
    : value8.find((value9) => value7.includes(value9)) || value7[0];
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
export function climateDefaultIcon(value) {
  if (value === "bath-heater") {
    return "mdi:radiator";
  } else if (value === "water-heater") {
    return "mdi:water-boiler";
  } else {
    return "mdi:air-conditioner";
  }
}
export function waterHeaterStatusLabel(value) {
  const value2 = String(value?.state || "")
    .trim()
    .toLowerCase();
  if (value2 === "unavailable") {
    return "当前不可用";
  } else if (!value2 || value2 === "unknown") {
    return "状态未知";
  } else if (value2 === "off") {
    return "已关闭";
  } else if (climateIsRunning(value, "water-heater")) {
    return "正在加热";
  } else {
    return "保温中";
  }
}
