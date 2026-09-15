const toFiniteNumber = input =>
  ["number", "string"].includes(typeof input) &&
  (typeof input != "string" || input.trim() !== "") &&
  Number.isFinite(Number(input))
    ? Number(input)
    : null;
const STATE_LABELS = {
  open: "已打开",
  closed: "已关闭",
  opening: "正在打开",
  closing: "正在关闭"
};
export function coverStateLabel(stateName) {
  if (Object.hasOwn(STATE_LABELS, stateName)) {
    return STATE_LABELS[stateName];
  } else {
    return "设备不可用";
  }
}
export function coverIconIsOn(binding, iconState) {
  return (
    !!iconState?.available && !!(binding?.iconStateReversed === true ? !iconState.on : iconState.on)
  );
}
export function coverState(entityId, receivedState, item = {}) {
  const stateObject = receivedState?.newState || receivedState || {};
  const attributes = stateObject.attributes || {};
  const stateValue = String(stateObject.state || "")
    .trim()
    .toLowerCase();
  const reportedPosition = toFiniteNumber(attributes.current_position);
  const reportedTilt = toFiniteNumber(attributes.current_tilt_position);
  const isDreamCover = item.coverKind === "dream";
  const rawSupportedFeatures = toFiniteNumber(attributes.supported_features);
  const supportedFeatures =
    Number.isSafeInteger(rawSupportedFeatures) && rawSupportedFeatures >= 0
      ? rawSupportedFeatures
      : 0;
  const hasTiltFeedback = reportedTilt !== null || !!(supportedFeatures & 240);
  const overallFeedbackAvailable = !isDreamCover || hasTiltFeedback;
  const normalizedState = overallFeedbackAvailable ? stateValue : "unknown";
  const position = overallFeedbackAvailable
    ? reportedPosition === null
      ? normalizedState === "closed"
        ? 0
        : null
      : Math.max(0, Math.min(100, reportedPosition))
    : null;
  const tiltPosition = hasTiltFeedback ? reportedTilt : reportedPosition;
  const available =
    /^cover\.[a-z0-9_]+$/.test(entityId) &&
    stateObject.available !== false &&
    Object.hasOwn(STATE_LABELS, stateValue);
  return {
    entityId: entityId,
    raw: stateObject,
    available: available,
    dream: isDreamCover,
    overallFeedbackAvailable: overallFeedbackAvailable,
    name: String(attributes.friendly_name || entityId || "窗帘"),
    state: normalizedState,
    position: position,
    positionKnown: position !== null,
    positionReported: overallFeedbackAvailable && reportedPosition !== null,
    features: supportedFeatures,
    closedConfirmed:
      available && overallFeedbackAvailable && normalizedState === "closed" && position === 0,
    tiltPosition: tiltPosition === null ? null : Math.max(0, Math.min(100, tiltPosition)),
    tiltPositionKnown: tiltPosition !== null,
    opening: available && normalizedState === "opening",
    closing: available && normalizedState === "closing",
    moving: available && ["opening", "closing"].includes(normalizedState),
    on:
      available &&
      (normalizedState === "opening" ||
        (position !== null ? position > 0 : normalizedState === "open")),
    openSupported: !!(supportedFeatures & 1),
    closeSupported: !!(supportedFeatures & 2),
    positionSupported: !!(supportedFeatures & 4),
    stopSupported: !!(supportedFeatures & 8),
    tiltSupported: !!(supportedFeatures & 128),
    bladeSupported: !!(supportedFeatures & 128) || (!hasTiltFeedback && !!(supportedFeatures & 4))
  };
}
export function coverCanAdjustBlades(state, presentation = state) {
  if (!state.available || !state.bladeSupported) {
    return false;
  } else if (state.overallFeedbackAvailable) {
    return presentation.closedConfirmed === true;
  } else if (presentation.moving || ["opening", "closing"].includes(state.raw?.state)) {
    return false;
  } else {
    return !presentation.estimated || !(presentation.position > 0);
  }
}
export function coverControl(sourceState, service, value) {
  if (!sourceState.available) {
    throw new Error("窗帘当前不可用。");
  }
  const capabilityKey = {
    open_cover: "openSupported",
    close_cover: "closeSupported",
    stop_cover: "stopSupported",
    set_cover_position: "positionSupported",
    set_cover_tilt_position: "tiltSupported"
  }[service];
  if (!capabilityKey || !sourceState[capabilityKey]) {
    throw new Error("设备不支持此窗帘操作。");
  }
  if (
    sourceState.dream &&
    ["set_cover_position", "set_cover_tilt_position"].includes(service) &&
    !coverCanAdjustBlades(sourceState)
  ) {
    throw new Error("只有确认整体完全关闭且停止后，才能调整叶片。");
  }
  let serviceData = {};
  if (service === "set_cover_position" || service === "set_cover_tilt_position") {
    const positionValue = toFiniteNumber(value);
    if (!Number.isInteger(positionValue) || positionValue < 0 || positionValue > 100) {
      throw new Error("目标位置必须是 0–100 之间的整数。");
    }
    serviceData =
      service === "set_cover_tilt_position"
        ? {
            tilt_position: positionValue
          }
        : {
            position: positionValue
          };
  }
  return {
    entityId: sourceState.entityId,
    domain: "cover",
    service: service,
    data: serviceData
  };
}
