const parseNumber = raw => ["number", "string"].includes(typeof raw) && (typeof raw != "string" || raw.trim() !== "") && Number.isFinite(Number(raw)) ? Number(raw) : null;
const STATE_LABELS = {
  open: "已打开",
  closed: "已关闭",
  opening: "正在打开",
  closing: "正在关闭"
};
export function coverStateLabel(state) {
  if (Object.hasOwn(STATE_LABELS, state)) {
    return STATE_LABELS[state];
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
  const reportedPosition = parseNumber(current_position.current_position);
  const position = reportedPosition === null ? state === "closed" ? 0 : null : Math.max(0, Math.min(100, reportedPosition));
  const rawFeatures = parseNumber(current_position.supported_features);
  const features = Number.isSafeInteger(rawFeatures) && rawFeatures >= 0 ? rawFeatures : 0;
  const available = /^cover\.[a-z0-9_]+$/.test(entityId) && attributes.available !== false && Object.hasOwn(STATE_LABELS, state);
  return {
    entityId,
    raw: attributes,
    available,
    name: String(current_position.friendly_name || entityId || "窗帘"),
    state,
    position,
    positionKnown: position !== null,
    positionReported: reportedPosition !== null,
    features,
    opening: available && state === "opening",
    closing: available && state === "closing",
    moving: available && ["opening", "closing"].includes(state),
    on: available && (state === "opening" || (position !== null ? position > 0 : state === "open")),
    openSupported: !!(features & 1),
    closeSupported: !!(features & 2),
    positionSupported: !!(features & 4),
    stopSupported: !!(features & 8)
  };
}
export function coverControl(cover, service, positionArg) {
  if (!cover.available) {
    throw new Error("窗帘当前不可用。");
  }
  const capability = {
    open_cover: "openSupported",
    close_cover: "closeSupported",
    stop_cover: "stopSupported",
    set_cover_position: "positionSupported"
  }[service];
  if (!capability || !cover[capability]) {
    throw new Error("设备不支持此窗帘操作。");
  }
  let data = {};
  if (service === "set_cover_position") {
    const position = parseNumber(positionArg);
    if (!Number.isInteger(position) || position < 0 || position > 100) {
      throw new Error("目标位置必须是 0–100 之间的整数。");
    }
    data = {
      position
    };
  }
  return {
    entityId: cover.entityId,
    domain: "cover",
    service,
    data
  };
}
