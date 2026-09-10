const climateModule = await (import.meta.url.startsWith("file:")
  ? import(new URL("../../static/renderer/climate.js", import.meta.url))
  : import("/bridge-static/renderer/climate.js?v=20260908-climate-v1"));
const {
  normalizeClimateCapabilities,
  climateIsPoweredOn,
  climateIsRunning,
  climatePowerCommand,
} = climateModule;
export const {
  climateModeLabel,
  climateModeIcon,
  climateSwingModeLabel,
  climateOptionPresentation,
} = climateModule;

const toNumber = (value) =>
  value != null && value !== "" && typeof value != "boolean" && Number.isFinite(Number(value))
    ? Number(value)
    : null;

export function climateState(entityId, eventOrState) {
  const state = eventOrState?.newState || eventOrState || {};
  const attributes = state.attributes || {};
  const capabilities = normalizeClimateCapabilities(state);
  const mode = typeof state.state == "string" ? state.state : "";
  const minimum = toNumber(attributes.min_temp);
  const maximum = toNumber(attributes.max_temp);
  const temperature = toNumber(attributes.temperature);
  const supportedFeatures = toNumber(attributes.supported_features) || 0;
  const targetLow = toNumber(attributes.target_temp_low);
  const targetHigh = toNumber(attributes.target_temp_high);
  const available =
    /^climate\.[a-z0-9_]+$/.test(entityId) &&
    state.available !== false &&
    !!mode &&
    !["unknown", "unavailable"].includes(mode);
  return {
    entityId,
    raw: state,
    available,
    on: available && climateIsPoweredOn(state, "air-conditioner"),
    running:
      available &&
      !["unknown", "unavailable"].includes(String(attributes.hvac_action || "").trim().toLowerCase()) &&
      climateIsRunning(state, "air-conditioner"),
    name: String(attributes.friendly_name || entityId || "空调"),
    mode,
    visualMode:
      !available || !climateIsPoweredOn(state, "air-conditioner")
        ? "off"
        : mode === "cool"
          ? "cool"
          : mode === "heat"
            ? "heat"
            : "other",
    temperature,
    currentTemperature: toNumber(attributes.current_temperature),
    targetLow,
    targetHigh,
    minimum,
    maximum,
    step: capabilities.temperatureStep,
    temperatureSupported:
      minimum !== null &&
      maximum !== null &&
      maximum > minimum &&
      (temperature !== null || !!(supportedFeatures & 1)),
    rangeSupported: !!(supportedFeatures & 2) || targetLow !== null || targetHigh !== null,
    modes: capabilities.hvacModes,
    fanModes: capabilities.fanModes,
    swingModes: capabilities.swingModes,
    horizontalSwingModes: capabilities.horizontalSwingModes,
    presetModes: capabilities.presetModes,
    fanMode: attributes.fan_mode || "",
    swingMode: attributes.swing_mode || "",
    horizontalSwingMode: attributes.swing_horizontal_mode || "",
    presetMode: attributes.preset_mode || "",
  };
}

export function climatePowerControl(state, turnOn = !state.on, preferredMode = "") {
  if (!state.available) {
    throw new Error("设备当前不可用。");
  }
  const command = climatePowerCommand(state.entityId, state.raw, turnOn, "air-conditioner", preferredMode);
  if (command.domain !== "climate" || command.service !== "set_hvac_mode") {
    throw new Error("设备尚未提供可用的开关模式。");
  }
  return {
    entityId: state.entityId,
    domain: "climate",
    service: command.service,
    data: command.data,
  };
}

export function climateControl(state, service, value) {
  if (!state.available) {
    throw new Error("设备当前不可用。");
  }
  let data;
  if (service === "set_temperature") {
    const next = toNumber(value);
    if (!state.temperatureSupported || next === null) {
      throw new Error("设备尚未提供可用的温度控制。");
    }
    const decimals = Math.min(
      8,
      Math.max(
        String(state.step).split(".")[1]?.length || 0,
        String(state.minimum).split(".")[1]?.length || 0,
      ),
    );
    const temperature = Number(
      (
        state.minimum +
        Math.round((Math.max(state.minimum, Math.min(state.maximum, next)) - state.minimum) / state.step) *
          state.step
      ).toFixed(decimals),
    );
    if (temperature < state.minimum || temperature > state.maximum) {
      throw new Error("设定温度超出设备范围。");
    }
    data = { temperature };
  } else {
    const option = {
      set_hvac_mode: ["modes", "hvac_mode"],
      set_fan_mode: ["fanModes", "fan_mode"],
      set_swing_mode: ["swingModes", "swing_mode"],
    }[service];
    if (!option || !state[option[0]].includes(value)) {
      throw new Error("设备不支持此控制选项。");
    }
    data = { [option[1]]: value };
  }
  return {
    entityId: state.entityId,
    domain: "climate",
    service,
    data,
  };
}
