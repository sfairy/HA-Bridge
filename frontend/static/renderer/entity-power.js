import { climateIsPoweredOn, climatePowerCommand, resolveClimateDeviceType } from "./climate.js?v=20260812-presence-phase-v79";
function entityState(state) {
  return state?.newState || state || {
    state: "",
    attributes: {}
  };
}
export function entityPowerTarget(entityId, component = {}, related = null) {
  if (component?.type !== "air-conditioner" && related?.deviceType === "bath-heater" && related.roles?.light) {
    return String(related.roles.light);
  } else {
    return String(entityId || "");
  }
}
export function entityPowerIsOn(entityId, state, component = {}) {
  const current = entityState(state);
  const domain = String(entityId || "").split(".", 1)[0];
  const status = String(current.state || "").trim().toLowerCase();
  if (domain === "climate") {
    return climateIsPoweredOn(current, resolveClimateDeviceType(component, current, entityId));
  } else if (domain === "fan") {
    return !["", "off", "unknown", "unavailable"].includes(status);
  } else if (domain === "water_heater") {
    return climateIsPoweredOn(current, "water-heater");
  } else if (domain === "media_player") {
    return ["playing", "buffering"].includes(status);
  } else {
    return ["on", "open", "true", "home"].includes(status);
  }
}
export function entityToggleCommand(entityId, state, component = {}) {
  const current = entityState(state);
  const domain = String(entityId || "").split(".", 1)[0];
  if (domain === "button") {
    return {
      domain: "button",
      service: "press",
      data: {}
    };
  }
  if (domain === "script") {
    return {
      domain: "script",
      service: "turn_on",
      data: {}
    };
  }
  if (domain === "media_player") {
    return {
      domain: "media_player",
      service: "media_play_pause",
      data: {}
    };
  }
  if (["climate", "fan", "water_heater"].includes(domain)) {
    const deviceType = domain === "water_heater" ? "water-heater" : resolveClimateDeviceType(component, current, entityId);
    return climatePowerCommand(entityId, current, !entityPowerIsOn(entityId, current, component), deviceType);
  }
  return {
    domain: "homeassistant",
    service: "toggle",
    data: {}
  };
}
export function optimisticToggleState(entityId, state, component = {}) {
  const current = entityState(state);
  const domain = String(entityId || "").split(".", 1)[0];
  const isOn = entityPowerIsOn(entityId, current, component);
  if (domain === "media_player") {
    return {
      ...current,
      state: entityPowerIsOn(entityId, current, component) ? "paused" : "playing"
    };
  }
  if (domain === "climate") {
    const attributes = {
      ...(current.attributes || {})
    };
    if (!isOn) {
      delete attributes.preset_mode;
      delete attributes.mode;
    }
    return {
      ...current,
      state: isOn ? "off" : "auto",
      attributes
    };
  }
  return {
    ...current,
    state: isOn ? "off" : "on"
  };
}
