import { coverComponentIsDream } from "./registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-date-time-runtime-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
import { entityMetadataIsAvailable } from "./entity-metadata.js?v=20260901-renderer-entity-metadata-v1";
export function runtimeEntityStateIsActive(entityOrEvent) {
  const state = String(entityOrEvent?.newState?.state ?? entityOrEvent?.state ?? "").trim().toLowerCase();
  return ["on", "open", "true", "home"].includes(state);
}
const COVER_CLOSED_POSITION_EPSILON = 1;
function readCurrentPosition(entityOrEvent) {
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  const numeric = Number(stateEntry.attributes?.current_position);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(100, numeric));
  } else {
    return null;
  }
}
export function coverPositionReachedTarget(currentPosition, targetPosition, direction) {
  const clampedCurrent = Math.max(0, Math.min(100, Number(currentPosition) || 0));
  const clampedTarget = Math.max(0, Math.min(100, Number(targetPosition) || 0));
  if (direction < 0) {
    return clampedCurrent <= clampedTarget + 0.5;
  } else {
    return clampedCurrent >= clampedTarget - 0.5;
  }
}
export function coverPendingDisplayPosition(currentPosition, targetPosition, direction) {
  if (direction < 0) {
    return Math.min(currentPosition, targetPosition);
  } else {
    return Math.max(currentPosition, targetPosition);
  }
}
export function runtimeCoverStateIsActive(entityOrEvent) {
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  const state = String(stateEntry.state || "").trim().toLowerCase();
  if (state === "opening") {
    return true;
  }
  if (state === "closing") {
    return false;
  }
  const currentPosition = readCurrentPosition(stateEntry);
  if (currentPosition !== null) {
    return currentPosition > COVER_CLOSED_POSITION_EPSILON;
  } else {
    return runtimeEntityStateIsActive(stateEntry);
  }
}
export function relatedDeviceEntity(entityMetadata, entityId, domain, translationKey, preferredEntityId = "") {
  const source = entityMetadata.get(entityId);
  if (!source?.deviceId) {
    return null;
  }
  const matches = [...entityMetadata.values()].filter(candidate => candidate.deviceId === source.deviceId && candidate.domain === domain && candidate.translationKey === translationKey && entityMetadataIsAvailable(candidate));
  matches.sort((left, right) => {
    const leftId = String(left.entityId || "");
    const rightId = String(right.entityId || "");
    if (leftId === preferredEntityId) {
      return -1;
    }
    if (rightId === preferredEntityId) {
      return 1;
    }
    const leftIsRoom = /_room_\d+_/.test(leftId);
    const rightIsRoom = /_room_\d+_/.test(rightId);
    if (leftIsRoom !== rightIsRoom) {
      if (leftIsRoom) {
        return 1;
      } else {
        return -1;
      }
    } else {
      return leftId.length - rightId.length || leftId.localeCompare(rightId);
    }
  });
  return matches[0] || null;
}
export function relatedDeviceDomainEntity(entityMetadata, entityId, domain) {
  const source = entityMetadata.get(entityId);
  if (!source?.deviceId) {
    return null;
  }
  const matches = [...entityMetadata.values()].filter(candidate => candidate.deviceId === source.deviceId && candidate.domain === domain && entityMetadataIsAvailable(candidate));
  matches.sort((left, right) => {
    const leftLightScore = /灯|照明|light/i.test((left.name || "") + " " + (left.entityId || "")) ? 0 : 1;
    const rightLightScore = /灯|照明|light/i.test((right.name || "") + " " + (right.entityId || "")) ? 0 : 1;
    return leftLightScore - rightLightScore || String(left.entityId || "").length - String(right.entityId || "").length || String(left.entityId || "").localeCompare(String(right.entityId || ""));
  });
  return matches[0] || null;
}
const AIRER_PATTERN = /airer|clothes.?rack|laundry.?rack|晾衣机|晾衣架/i;
const LIGHT_PATTERN = /light|lamp|灯光|照明|灯(?:$|[\s_-])/i;
const SET_POSITION_PATTERN = /set[_\s-]?position|target[_\s-]?position|设定位置|设置位置|目标位置/i;
const CURRENT_POSITION_PATTERN = /current[_\s-]?position|当前位置|当前高度/i;
const MOTOR_SPEED_PATTERN = /motor[_\s-]?speed|电机速度/i;
const MOTOR_CONTROL_PATTERNS = {
  up: /motor[_\s-]?control[_\s-]?up|晾杆控制[^\n]*(?:上升|升起)/i,
  down: /motor[_\s-]?control[_\s-]?down|晾杆控制[^\n]*下降/i,
  pause: /motor[_\s-]?control[_\s-]?(?:pause|stop)|晾杆控制[^\n]*(?:停止|暂停)/i
};
export function coverComponentIsAirer(component, entityId = "", entityOrEvent = null, entityMetadata = new Map(), devices = new Map()) {
  const coverKind = component?.properties?.coverKind;
  if (coverKind === "airer") {
    return true;
  }
  if (["standard", "dream"].includes(coverKind)) {
    return false;
  }
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  const metadata = entityMetadata.get(entityId) || {};
  const device = metadata.deviceId ? devices.get(metadata.deviceId) || {} : {};
  return AIRER_PATTERN.test([entityId, stateEntry.attributes?.friendly_name, metadata.name, metadata.originalName, metadata.translationKey, metadata.uniqueId, device.name, device.model].filter(Boolean).join(" "));
}
function extractPointIndices(entityId) {
  return new Set([...String(entityId || "").matchAll(/_(?:s|p)_(\d+)(?:_|$)/gi)].map(match => match[1]));
}
export function relatedAirerLightEntity(entityMetadata, entityId) {
  const metadata = entityMetadata.get(entityId);
  if (!metadata?.deviceId) {
    return null;
  }
  const sourcePointIndices = extractPointIndices(metadata.entityId);
  return [...entityMetadata.values()].filter(candidate => candidate.entityId !== entityId && candidate.deviceId === metadata.deviceId && ["light", "switch"].includes(String(candidate.domain || "")) && entityMetadataIsAvailable(candidate)).map(candidate => {
    const searchText = (candidate.entityId || "") + " " + (candidate.name || "") + " " + (candidate.originalName || "") + " " + (candidate.translationKey || "");
    if (candidate.domain === "switch" && !LIGHT_PATTERN.test(searchText)) {
      return null;
    }
    const candidatePointIndices = extractPointIndices(candidate.entityId);
    const sharesPointIndex = [...sourcePointIndices].some(pointIndex => candidatePointIndices.has(pointIndex));
    let score = candidate.domain === "light" ? 180 : 80;
    if (sharesPointIndex) {
      score += 360;
    }
    if (AIRER_PATTERN.test(searchText)) {
      score += 180;
    }
    if (LIGHT_PATTERN.test(searchText)) {
      score += 90;
    }
    if (/night.?light|夜灯/i.test(searchText)) {
      score -= 60;
    }
    return {
      item: candidate,
      score
    };
  }).filter(Boolean).sort((left, right) => right.score - left.score || String(left.item.entityId || "").length - String(right.item.entityId || "").length || String(left.item.entityId || "").localeCompare(String(right.item.entityId || "")))[0]?.item || null;
}
function findRelatedAirerEntity(entityMetadata, entityId, domain, pattern) {
  const metadata = entityMetadata.get(entityId);
  if (!metadata?.deviceId) {
    const hydMatch = String(entityId || "").match(/^cover\.(hyd_cn_[a-z0-9]+_pro2)_s_\d+_airer$/i);
    if (hydMatch) {
      if (domain === "number" && pattern === SET_POSITION_PATTERN) {
        return {
          entityId: "number." + hydMatch[1] + "_set_position_p_4_9",
          domain: "number"
        };
      } else if (domain === "sensor" && pattern === CURRENT_POSITION_PATTERN) {
        return {
          entityId: "sensor." + hydMatch[1] + "_current_position_p_4_11",
          domain: "sensor"
        };
      } else if (domain === "sensor" && pattern === MOTOR_SPEED_PATTERN) {
        return {
          entityId: "sensor." + hydMatch[1] + "_motor_speed_p_4_12",
          domain: "sensor"
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return [...entityMetadata.values()].filter(candidate => candidate.entityId !== entityId && candidate.deviceId === metadata.deviceId && candidate.domain === domain && entityMetadataIsAvailable(candidate)).map(item => {
    const searchText = (item.entityId || "") + " " + (item.name || "") + " " + (item.originalName || "") + " " + (item.translationKey || "");
    if (!pattern.test(searchText)) {
      return null;
    }
    let score = 0;
    if (pattern.test(String(item.translationKey || ""))) {
      score += 300;
    }
    if (pattern.test(String(item.entityId || ""))) {
      score += 180;
    }
    if (AIRER_PATTERN.test(searchText)) {
      score += 90;
    }
    return {
      item,
      score
    };
  }).filter(Boolean).sort((left, right) => right.score - left.score || String(left.item.entityId || "").length - String(right.item.entityId || "").length || String(left.item.entityId || "").localeCompare(String(right.item.entityId || "")))[0]?.item || null;
}
export function relatedAirerPositionNumberEntity(entityMetadata, entityId) {
  return findRelatedAirerEntity(entityMetadata, entityId, "number", SET_POSITION_PATTERN);
}
export function relatedAirerCurrentPositionSensor(entityMetadata, entityId) {
  return findRelatedAirerEntity(entityMetadata, entityId, "sensor", CURRENT_POSITION_PATTERN);
}
export function relatedAirerMotorSpeedSensor(entityMetadata, entityId) {
  return findRelatedAirerEntity(entityMetadata, entityId, "sensor", MOTOR_SPEED_PATTERN);
}
export function relatedAirerMotorActionEntities(entityMetadata, entityId) {
  const metadata = entityMetadata.get(entityId);
  if (!metadata?.deviceId) {
    return {
      up: null,
      down: null,
      pause: null
    };
  }
  const buttons = [...entityMetadata.values()].filter(candidate => candidate.entityId !== entityId && candidate.deviceId === metadata.deviceId && candidate.domain === "button" && entityMetadataIsAvailable(candidate));
  return Object.fromEntries(Object.entries(MOTOR_CONTROL_PATTERNS).map(([action, pattern]) => {
    const match = buttons.find(button => pattern.test((button.entityId || "") + " " + (button.name || "") + " " + (button.originalName || "") + " " + (button.translationKey || "")));
    return [action, match || null];
  }));
}
export function airerVisualDrop(position, coverState = "", calibration = {}) {
  if (coverState === "open") {
    return 2;
  }
  if (coverState === "closed") {
    return 40;
  }
  const clamped = Math.max(0, Math.min(100, Number(position) || 0));
  const raised = calibration.raised === null || calibration.raised === undefined ? Number.NaN : Number(calibration.raised);
  const lowered = calibration.lowered === null || calibration.lowered === undefined ? Number.NaN : Number(calibration.lowered);
  const raisedBaseline = Number.isFinite(raised) ? raised : Number.isFinite(lowered) && lowered >= 50 ? 0 : 100;
  const travel = (Number.isFinite(lowered) ? lowered : raisedBaseline < 50 ? 100 : 0) - raisedBaseline;
  return 2 + (Math.abs(travel) < 0.5 ? 0 : Math.max(0, Math.min(1, (clamped - raisedBaseline) / travel))) * 38;
}
export function airerPositionCalibration(entityMetadata, devices, entityId) {
  const metadata = entityMetadata.get(entityId);
  const device = metadata?.deviceId ? devices.get(metadata.deviceId) : null;
  const searchText = (device?.model || "") + " " + (device?.name || "") + " " + (metadata?.entityId || "") + " " + (entityId || "");
  if (/hyd\.airer\.pro2|hyd_cn_[a-z0-9_]*_pro2(?:_|$)/i.test(searchText)) {
    return {
      raised: null,
      lowered: null,
      commandRaised: 0,
      commandLowered: 100
    };
  } else {
    return {
      raised: null,
      lowered: null,
      commandRaised: null,
      commandLowered: null
    };
  }
}
export function learnAirerPositionCalibration(calibration = {}, reportedPosition, commandPosition, motorSpeed) {
  const reported = Number(reportedPosition);
  const commanded = Number(commandPosition);
  const speed = Number(motorSpeed);
  const commandRaised = calibration.commandRaised === null || calibration.commandRaised === undefined ? Number.NaN : Number(calibration.commandRaised);
  const commandLowered = calibration.commandLowered === null || calibration.commandLowered === undefined ? Number.NaN : Number(calibration.commandLowered);
  if (!!Number.isFinite(reported) && !!Number.isFinite(commanded) && !!Number.isFinite(speed) && !(Math.abs(speed) >= 0.5)) {
    if (Number.isFinite(commandRaised) && Math.abs(commanded - commandRaised) <= 0.5) {
      calibration.raised = Math.max(0, Math.min(100, reported));
    }
    if (Number.isFinite(commandLowered) && Math.abs(commanded - commandLowered) <= 0.5) {
      calibration.lowered = Math.max(0, Math.min(100, reported));
    }
  }
  return calibration;
}
export function airerPresentationPosition(position, calibration = {}) {
  const clamped = Math.max(0, Math.min(100, Number(position) || 0));
  const raised = calibration.raised === null || calibration.raised === undefined ? Number.NaN : Number(calibration.raised);
  const lowered = calibration.lowered === null || calibration.lowered === undefined ? Number.NaN : Number(calibration.lowered);
  if (!Number.isFinite(raised) && !Number.isFinite(lowered)) {
    return clamped;
  }
  const raisedBaseline = Number.isFinite(raised) ? raised : 0;
  const loweredBaseline = Number.isFinite(lowered) ? lowered : 100;
  if (Math.abs(loweredBaseline - raisedBaseline) < 0.5) {
    return clamped;
  } else {
    return Math.max(0, Math.min(100, (loweredBaseline - clamped) / (loweredBaseline - raisedBaseline) * 100));
  }
}
export function airerPresentationPositionForState(position, coverState, calibration = {}, motorReversed = false) {
  const physicalState = physicalCoverState(coverState, motorReversed);
  if (physicalState === "open") {
    return 100;
  } else if (physicalState === "closed") {
    return 0;
  } else {
    return airerPresentationPosition(position, calibration);
  }
}
export function airerReportedPosition(sensorState, coverState, calibration = {}) {
  const sensorNumeric = Number(sensorState?.state);
  const coverNumeric = Number(coverState?.attributes?.current_position);
  const hasRaised = calibration.raised !== null && calibration.raised !== undefined && Number.isFinite(Number(calibration.raised));
  const hasLowered = calibration.lowered !== null && calibration.lowered !== undefined && Number.isFinite(Number(calibration.lowered));
  if (hasRaised && hasLowered && Math.abs(Number(calibration.lowered) - Number(calibration.raised)) >= 0.5 && Number.isFinite(sensorNumeric)) {
    return sensorNumeric;
  } else if (Number.isFinite(coverNumeric)) {
    return coverNumeric;
  } else {
    return sensorNumeric;
  }
}
export function airerDevicePosition(presentationPosition, calibration = {}) {
  const clamped = Math.max(0, Math.min(100, Number(presentationPosition) || 0));
  const raisedCommand = calibration.commandRaised === null || calibration.commandRaised === undefined ? Number(calibration.raised) : Number(calibration.commandRaised);
  const loweredCommand = calibration.commandLowered === null || calibration.commandLowered === undefined ? Number(calibration.lowered) : Number(calibration.commandLowered);
  if (!Number.isFinite(raisedCommand) || !Number.isFinite(loweredCommand) || Math.abs(loweredCommand - raisedCommand) < 0.5) {
    return clamped;
  }
  const raised = raisedCommand;
  const lowered = loweredCommand;
  return lowered - clamped / 100 * (lowered - raised);
}
const WATER_HEATER_RELATED_DOMAINS = new Set(["switch", "select", "number", "button"]);
export function relatedWaterHeaterEntities(entityMetadata, entityId) {
  const metadata = entityMetadata.get(entityId);
  if (!metadata?.deviceId) {
    return [];
  }
  const DOMAIN_ORDER = new Map([["switch", 0], ["select", 1], ["number", 2], ["button", 3]]);
  return [...entityMetadata.values()].filter(candidate => candidate.entityId !== entityId && candidate.deviceId === metadata.deviceId && WATER_HEATER_RELATED_DOMAINS.has(String(candidate.domain || "")) && entityMetadataIsAvailable(candidate)).sort((left, right) => (DOMAIN_ORDER.get(left.domain) ?? 99) - (DOMAIN_ORDER.get(right.domain) ?? 99) || String(left.entityId || "").localeCompare(String(right.entityId || "")));
}
export function waterHeaterRelatedEntityLabel(sourceEntity, relatedEntity) {
  let label = String(relatedEntity?.name || relatedEntity?.originalName || "").replace(/\s+/g, " ").trim();
  const prefixes = [...new Set([sourceEntity?.originalName, sourceEntity?.name].map(name => String(name || "").replace(/\s+/g, " ").trim()).filter(Boolean))].sort((left, right) => right.length - left.length);
  for (const prefix of prefixes) {
    while (label !== prefix && label.startsWith(prefix + " ")) {
      label = label.slice(prefix.length).trim();
    }
  }
  return label || (String(relatedEntity?.entityId || "").split(".", 2)[1] || "扩展功能").replace(/_/g, " ");
}
export function relatedCoverMotorReverseEntity(entityMetadata, entityId) {
  const metadata = entityMetadata.get(entityId);
  return metadata?.deviceId && [...entityMetadata.values()].find(candidate => candidate.deviceId === metadata.deviceId && ["switch", "select"].includes(String(candidate.domain || "")) && /motor_reverse|电机反向/i.test((candidate.entityId || "") + " " + (candidate.name || "")) && entityMetadataIsAvailable(candidate)) || null;
}
function stateLooksEnabled(stateEntry) {
  const state = String(stateEntry?.newState?.state ?? stateEntry?.state ?? "").trim().toLowerCase();
  return ["on", "true", "1", "enabled", "开启", "打开"].includes(state);
}
function isCoverMotorReversed(entityMetadata, states, entityId) {
  const reverseEntity = relatedCoverMotorReverseEntity(entityMetadata, entityId);
  return !!reverseEntity?.entityId && !!stateLooksEnabled(states.get(reverseEntity.entityId));
}
export function coverMotorIsReversedForComponent(component, entityMetadata, states, entityId) {
  const coverMotorDirection = component?.properties?.coverMotorDirection;
  if (coverMotorDirection === "normal") {
    return false;
  } else {
    return coverMotorDirection === "reversed";
  }
}
export function physicalCoverState(state, motorReversed = false) {
  const text = String(state || "");
  return motorReversed && {
    open: "closed",
    closed: "open",
    opening: "closing",
    closing: "opening"
  }[text] || text;
}
export function coverPresentationState(entityOrEvent, motorReversed = false) {
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  const physicalState = physicalCoverState(stateEntry.state, motorReversed);
  if (physicalState === "opening" || physicalState === "closing") {
    return physicalState;
  }
  const currentPosition = readCurrentPosition(stateEntry);
  if (currentPosition === null) {
    return physicalState;
  } else if ((motorReversed ? 100 - currentPosition : currentPosition) <= COVER_CLOSED_POSITION_EPSILON) {
    return "closed";
  } else {
    return "open";
  }
}
function coverPhysicalPresentationState(entityOrEvent, motorReversed = false) {
  const stateEntry = entityOrEvent?.newState || entityOrEvent || {};
  return physicalCoverState(stateEntry.state, motorReversed);
}
export function dreamCurtainBladeLabel(position) {
  const clamped = Math.max(0, Math.min(100, Number(position) || 0));
  if (clamped <= COVER_CLOSED_POSITION_EPSILON) {
    return "一侧闭合";
  } else if (clamped >= 100 - COVER_CLOSED_POSITION_EPSILON) {
    return "反向闭合";
  } else if (Math.abs(clamped - 50) <= 2) {
    return "90°打开";
  } else {
    return Math.round(clamped * 1.8) + "°";
  }
}
export function dreamCurtainStatusText(coverState, bladePosition, motorReversed = false) {
  const physicalState = physicalCoverState(coverState, motorReversed);
  return "整体：" + ({
    open: "开启",
    closed: "关闭",
    opening: "正在开启",
    closing: "正在关闭"
  }[physicalState] || "未知") + " · 叶片：" + dreamCurtainBladeLabel(bladePosition);
}
export function dreamCurtainStatusFromRetraction(isRetracted, isMoving, bladePosition) {
  return "整体：" + (isMoving ? isRetracted ? "正在开启" : "正在关闭" : isRetracted ? "开启" : "关闭") + " · 叶片：" + dreamCurtainBladeLabel(bladePosition);
}
export function dreamCurtainIsRetracted(coverState, motorReversed = false) {
  const physicalState = physicalCoverState(coverState, motorReversed);
  return physicalState === "open" || physicalState === "opening";
}
export function dreamCurtainToggleService(isRetracted, retractService, extendService) {
  if (isRetracted) {
    return extendService;
  } else {
    return retractService;
  }
}
export function coverToggleServiceForComponent(component, entityMetadata, states, entityId) {
  const stateEntry = states.get(entityId);
  const motorReversed = coverMotorIsReversedForComponent(component, entityMetadata, states, entityId);
  const presentationState = coverComponentIsDream(component, entityId, stateEntry, entityMetadata) ? coverPhysicalPresentationState(stateEntry, motorReversed) : coverPresentationState(stateEntry, motorReversed);
  if (presentationState === "open" || presentationState === "opening") {
    if (motorReversed) {
      return "open_cover";
    } else {
      return "close_cover";
    }
  } else if (motorReversed) {
    return "close_cover";
  } else {
    return "open_cover";
  }
}
