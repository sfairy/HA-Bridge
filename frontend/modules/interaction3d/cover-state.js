const a = trim => ["number", "string"].includes(typeof trim) && (typeof trim != "string" || trim.trim() !== "") && Number.isFinite(Number(trim)) ? Number(trim) : null;
const u = {
  open: "已打开",
  closed: "已关闭",
  opening: "正在打开",
  closing: "正在关闭"
};
export function coverStateLabel(arg) {
  if (Object.hasOwn(u, arg)) {
    return u[arg];
  } else {
    return "设备不可用";
  }
}
export function coverIconIsOn(iconStateReversed, on) {
  return !!on?.available && !!(iconStateReversed?.iconStateReversed === true ? !on.on : on.on);
}
export function coverState(entityId, newState) {
  const attributes = newState?.newState || newState || {};
  const current_position = attributes.attributes || {};
  const state = String(attributes.state || "").trim().toLowerCase();
  const value = a(current_position.current_position);
  const position2 = value === null ? state === "closed" ? 0 : null : Math.max(0, Math.min(100, value));
  const value2 = a(current_position.supported_features);
  const features = Number.isSafeInteger(value2) && value2 >= 0 ? value2 : 0;
  const available = /^cover\.[a-z0-9_]+$/.test(entityId) && attributes.available !== false && Object.hasOwn(u, state);
  return {
    entityId,
    raw: attributes,
    available,
    name: String(current_position.friendly_name || entityId || "窗帘"),
    state,
    position: position2,
    positionKnown: position2 !== null,
    positionReported: value !== null,
    features,
    opening: available && state === "opening",
    closing: available && state === "closing",
    moving: available && ["opening", "closing"].includes(state),
    on: available && (state === "opening" || (position2 !== null ? position2 > 0 : state === "open")),
    openSupported: !!(features & 1),
    closeSupported: !!(features & 2),
    positionSupported: !!(features & 4),
    stopSupported: !!(features & 8)
  };
}
export function coverControl(available2, service, arg2) {
  if (!available2.available) {
    throw new Error("窗帘当前不可用。");
  }
  const value3 = {
    open_cover: "openSupported",
    close_cover: "closeSupported",
    stop_cover: "stopSupported",
    set_cover_position: "positionSupported"
  }[service];
  if (!value3 || !available2[value3]) {
    throw new Error("设备不支持此窗帘操作。");
  }
  let data = {};
  if (service === "set_cover_position") {
    const position = a(arg2);
    if (!Number.isInteger(position) || position < 0 || position > 100) {
      throw new Error("目标位置必须是 0–100 之间的整数。");
    }
    data = {
      position
    };
  }
  return {
    entityId: available2.entityId,
    domain: "cover",
    service,
    data
  };
}
