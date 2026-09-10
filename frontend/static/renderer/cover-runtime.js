import { coverComponentIsDream } from "./registry.js?v=20260814-tablet-resolution-v84-20260818-airer-v1-20260822-light-feedback-controls-v1-20260822-icon-visibility-v3-20260822-line-chart-performance-v3-20260822-unsupported-light-effect-v1-20260823-hidden-content-clickable-v1-20260823-effect-variant-v1-20260823-navigation-current-page-v1-20260824-light-statistics-v6-20260825-effect-load-queue-v1-20260825-vacuum-map-preload-v1-20260825-static-image-cache-v1-20260825-editor-media-preview-v1-20260828-count-statistics-v1-20260831-background-media-v1-20260831-vacuum-map-background-v1-20260901-renderer-date-time-runtime-v1";
import { entityMetadataIsAvailable } from "./entity-metadata.js?v=20260901-renderer-entity-metadata-v1";
export function runtimeEntityStateIsActive(value) {
  const value2 = String(value?.newState?.state ?? value?.state ?? "")
    .trim()
    .toLowerCase();
  return ["on", "open", "true", "home"].includes(value2);
}
const COVER_CLOSED_POSITION_EPSILON = 1;
function readCurrentPosition(value) {
  const value2 = value?.newState || value || {};
  const numeric = Number(value2.attributes?.current_position);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(100, numeric));
  } else {
    return null;
  }
}
export function coverPositionReachedTarget(value, value2, value3) {
  const count = Math.max(0, Math.min(100, Number(value) || 0));
  const count2 = Math.max(0, Math.min(100, Number(value2) || 0));
  if (value3 < 0) {
    return count <= count2 + 0.5;
  } else {
    return count >= count2 - 0.5;
  }
}
export function coverPendingDisplayPosition(value, value2, value3) {
  if (value3 < 0) {
    return Math.min(value, value2);
  } else {
    return Math.max(value, value2);
  }
}
export function runtimeCoverStateIsActive(value) {
  const value2 = value?.newState || value || {};
  const value3 = String(value2.state || "")
    .trim()
    .toLowerCase();
  if (value3 === "opening") {
    return true;
  }
  if (value3 === "closing") {
    return false;
  }
  const value4 = readCurrentPosition(value2);
  if (value4 !== null) {
    return value4 > COVER_CLOSED_POSITION_EPSILON;
  } else {
    return runtimeEntityStateIsActive(value2);
  }
}
export function relatedDeviceEntity(
  value,
  value2,
  value3,
  value4,
  value5 = "",
) {
  const value6 = value.get(value2);
  if (!value6?.deviceId) {
    return null;
  }
  const value7 = [...value.values()].filter(
    (value8) =>
      value8.deviceId === value6.deviceId &&
      value8.domain === value3 &&
      value8.translationKey === value4 &&
      entityMetadataIsAvailable(value8),
  );
  value7.sort((value8, value9) => {
    const text = String(value8.entityId || "");
    const text2 = String(value9.entityId || "");
    if (text === value5) {
      return -1;
    }
    if (text2 === value5) {
      return 1;
    }
    const value10 = /_room_\d+_/.test(text);
    const value11 = /_room_\d+_/.test(text2);
    if (value10 !== value11) {
      if (value10) {
        return 1;
      } else {
        return -1;
      }
    } else {
      return text.length - text2.length || text.localeCompare(text2);
    }
  });
  return value7[0] || null;
}
export function relatedDeviceDomainEntity(value, value2, value3) {
  const value4 = value.get(value2);
  if (!value4?.deviceId) {
    return null;
  }
  const value5 = [...value.values()].filter(
    (value6) =>
      value6.deviceId === value4.deviceId &&
      value6.domain === value3 &&
      entityMetadataIsAvailable(value6),
  );
  value5.sort((value6, value7) => {
    const value8 = /灯|照明|light/i.test(
      (value6.name || "") + " " + (value6.entityId || ""),
    )
      ? 0
      : 1;
    const value9 = /灯|照明|light/i.test(
      (value7.name || "") + " " + (value7.entityId || ""),
    )
      ? 0
      : 1;
    return (
      value8 - value9 ||
      String(value6.entityId || "").length -
        String(value7.entityId || "").length ||
      String(value6.entityId || "").localeCompare(String(value7.entityId || ""))
    );
  });
  return value5[0] || null;
}
const AIRER_PATTERN = /airer|clothes.?rack|laundry.?rack|晾衣机|晾衣架/i;
const LIGHT_PATTERN = /light|lamp|灯光|照明|灯(?:$|[\s_-])/i;
const SET_POSITION_PATTERN =
  /set[_\s-]?position|target[_\s-]?position|设定位置|设置位置|目标位置/i;
const CURRENT_POSITION_PATTERN = /current[_\s-]?position|当前位置|当前高度/i;
const MOTOR_SPEED_PATTERN = /motor[_\s-]?speed|电机速度/i;
const MOTOR_CONTROL_PATTERNS = {
  up: /motor[_\s-]?control[_\s-]?up|晾杆控制[^\n]*(?:上升|升起)/i,
  down: /motor[_\s-]?control[_\s-]?down|晾杆控制[^\n]*下降/i,
  pause:
    /motor[_\s-]?control[_\s-]?(?:pause|stop)|晾杆控制[^\n]*(?:停止|暂停)/i,
};
export function coverComponentIsAirer(
  component,
  value = "",
  value2 = null,
  value3 = new Map(),
  value4 = new Map(),
) {
  const coverKind = component?.properties?.coverKind;
  if (coverKind === "airer") {
    return true;
  }
  if (["standard", "dream"].includes(coverKind)) {
    return false;
  }
  const value5 = value2?.newState || value2 || {};
  const value6 = value3.get(value) || {};
  const value7 = value6.deviceId ? value4.get(value6.deviceId) || {} : {};
  return AIRER_PATTERN.test(
    [
      value,
      value5.attributes?.friendly_name,
      value6.name,
      value6.originalName,
      value6.translationKey,
      value6.uniqueId,
      value7.name,
      value7.model,
    ]
      .filter(Boolean)
      .join(" "),
  );
}
function extractPointIndices(value) {
  return new Set(
    [...String(value || "").matchAll(/_(?:s|p)_(\d+)(?:_|$)/gi)].map(
      (value2) => value2[1],
    ),
  );
}
export function relatedAirerLightEntity(value, value2) {
  const metadata = value.get(value2);
  if (!metadata?.deviceId) {
    return null;
  }
  const value4 = extractPointIndices(metadata.entityId);
  return (
    [...value.values()]
      .filter(
        (metadata2) =>
          metadata2.entityId !== value2 &&
          metadata2.deviceId === metadata.deviceId &&
          ["light", "switch"].includes(String(metadata2.domain || "")) &&
          entityMetadataIsAvailable(metadata2),
      )
      .map((metadata2) => {
        const value5 =
          (metadata2.entityId || "") +
          " " +
          (metadata2.name || "") +
          " " +
          (metadata2.originalName || "") +
          " " +
          (metadata2.translationKey || "");
        if (metadata2.domain === "switch" && !LIGHT_PATTERN.test(value5)) {
          return null;
        }
        const value6 = extractPointIndices(metadata2.entityId);
        const value7 = [...value4].some((value8) => value6.has(value8));
        let score = metadata2.domain === "light" ? 180 : 80;
        if (value7) {
          score += 360;
        }
        if (AIRER_PATTERN.test(value5)) {
          score += 180;
        }
        if (LIGHT_PATTERN.test(value5)) {
          score += 90;
        }
        if (/night.?light|夜灯/i.test(value5)) {
          score -= 60;
        }
        return {
          item: metadata2,
          score: score,
        };
      })
      .filter(Boolean)
      .sort(
        (value5, value6) =>
          value6.score - value5.score ||
          String(value5.item.entityId || "").length -
            String(value6.item.entityId || "").length ||
          String(value5.item.entityId || "").localeCompare(
            String(value6.item.entityId || ""),
          ),
      )[0]?.item || null
  );
}
function findRelatedAirerEntity(value, value2, value3, value4) {
  const value5 = value.get(value2);
  if (!value5?.deviceId) {
    const value6 = String(value2 || "").match(
      /^cover\.(hyd_cn_[a-z0-9]+_pro2)_s_\d+_airer$/i,
    );
    if (value6) {
      if (value3 === "number" && value4 === SET_POSITION_PATTERN) {
        return {
          entityId: "number." + value6[1] + "_set_position_p_4_9",
          domain: "number",
        };
      } else if (value3 === "sensor" && value4 === CURRENT_POSITION_PATTERN) {
        return {
          entityId: "sensor." + value6[1] + "_current_position_p_4_11",
          domain: "sensor",
        };
      } else if (value3 === "sensor" && value4 === MOTOR_SPEED_PATTERN) {
        return {
          entityId: "sensor." + value6[1] + "_motor_speed_p_4_12",
          domain: "sensor",
        };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return (
    [...value.values()]
      .filter(
        (metadata) =>
          metadata.entityId !== value2 &&
          metadata.deviceId === value5.deviceId &&
          metadata.domain === value3 &&
          entityMetadataIsAvailable(metadata),
      )
      .map((item) => {
        const value6 =
          (item.entityId || "") +
          " " +
          (item.name || "") +
          " " +
          (item.originalName || "") +
          " " +
          (item.translationKey || "");
        if (!value4.test(value6)) {
          return null;
        }
        let score = 0;
        if (value4.test(String(item.translationKey || ""))) {
          score += 300;
        }
        if (value4.test(String(item.entityId || ""))) {
          score += 180;
        }
        if (AIRER_PATTERN.test(value6)) {
          score += 90;
        }
        return {
          item: item,
          score: score,
        };
      })
      .filter(Boolean)
      .sort(
        (value6, value7) =>
          value7.score - value6.score ||
          String(value6.item.entityId || "").length -
            String(value7.item.entityId || "").length ||
          String(value6.item.entityId || "").localeCompare(
            String(value7.item.entityId || ""),
          ),
      )[0]?.item || null
  );
}
export function relatedAirerPositionNumberEntity(value, value2) {
  return findRelatedAirerEntity(value, value2, "number", SET_POSITION_PATTERN);
}
export function relatedAirerCurrentPositionSensor(value, value2) {
  return findRelatedAirerEntity(value, value2, "sensor", CURRENT_POSITION_PATTERN);
}
export function relatedAirerMotorSpeedSensor(value, value2) {
  return findRelatedAirerEntity(value, value2, "sensor", MOTOR_SPEED_PATTERN);
}
export function relatedAirerMotorActionEntities(value, value2) {
  const value3 = value.get(value2);
  if (!value3?.deviceId) {
    return {
      up: null,
      down: null,
      pause: null,
    };
  }
  const value4 = [...value.values()].filter(
    (metadata) =>
      metadata.entityId !== value2 &&
      metadata.deviceId === value3.deviceId &&
      metadata.domain === "button" &&
      entityMetadataIsAvailable(metadata),
  );
  return Object.fromEntries(
    Object.entries(MOTOR_CONTROL_PATTERNS).map(([value5, value6]) => {
      const value7 = value4.find((value8) =>
        value6.test(
          (value8.entityId || "") +
            " " +
            (value8.name || "") +
            " " +
            (value8.originalName || "") +
            " " +
            (value8.translationKey || ""),
        ),
      );
      return [value5, value7 || null];
    }),
  );
}
export function airerVisualDrop(value, value2 = "", value3 = {}) {
  if (value2 === "open") {
    return 2;
  }
  if (value2 === "closed") {
    return 40;
  }
  const count = Math.max(0, Math.min(100, Number(value) || 0));
  const value4 =
    value3.raised === null || value3.raised === undefined
      ? Number.NaN
      : Number(value3.raised);
  const value5 =
    value3.lowered === null || value3.lowered === undefined
      ? Number.NaN
      : Number(value3.lowered);
  const value6 = Number.isFinite(value4)
    ? value4
    : Number.isFinite(value5) && value5 >= 50
      ? 0
      : 100;
  const value7 =
    (Number.isFinite(value5) ? value5 : value6 < 50 ? 100 : 0) - value6;
  return (
    2 +
    (Math.abs(value7) < 0.5
      ? 0
      : Math.max(0, Math.min(1, (count - value6) / value7))) *
      38
  );
}
export function airerPositionCalibration(value, value2, value3) {
  const metadata = value.get(value3);
  const value5 = metadata?.deviceId ? value2.get(metadata.deviceId) : null;
  const value6 =
    (value5?.model || "") +
    " " +
    (value5?.name || "") +
    " " +
    (metadata?.entityId || "") +
    " " +
    (value3 || "");
  if (/hyd\.airer\.pro2|hyd_cn_[a-z0-9_]*_pro2(?:_|$)/i.test(value6)) {
    return {
      raised: null,
      lowered: null,
      commandRaised: 0,
      commandLowered: 100,
    };
  } else {
    return {
      raised: null,
      lowered: null,
      commandRaised: null,
      commandLowered: null,
    };
  }
}
export function learnAirerPositionCalibration(
  value = {},
  value2,
  value3,
  value4,
) {
  const numeric = Number(value2);
  const numeric2 = Number(value3);
  const numeric3 = Number(value4);
  const value5 =
    value.commandRaised === null || value.commandRaised === undefined
      ? Number.NaN
      : Number(value.commandRaised);
  const value6 =
    value.commandLowered === null || value.commandLowered === undefined
      ? Number.NaN
      : Number(value.commandLowered);
  if (
    !!Number.isFinite(numeric) &&
    !!Number.isFinite(numeric2) &&
    !!Number.isFinite(numeric3) &&
    !(Math.abs(numeric3) >= 0.5)
  ) {
    if (Number.isFinite(value5) && Math.abs(numeric2 - value5) <= 0.5) {
      value.raised = Math.max(0, Math.min(100, numeric));
    }
    if (Number.isFinite(value6) && Math.abs(numeric2 - value6) <= 0.5) {
      value.lowered = Math.max(0, Math.min(100, numeric));
    }
  }
  return value;
}
export function airerPresentationPosition(value, value2 = {}) {
  const count = Math.max(0, Math.min(100, Number(value) || 0));
  const value3 =
    value2.raised === null || value2.raised === undefined
      ? Number.NaN
      : Number(value2.raised);
  const value4 =
    value2.lowered === null || value2.lowered === undefined
      ? Number.NaN
      : Number(value2.lowered);
  if (!Number.isFinite(value3) && !Number.isFinite(value4)) {
    return count;
  }
  const value5 = Number.isFinite(value3) ? value3 : 0;
  const value6 = Number.isFinite(value4) ? value4 : 100;
  if (Math.abs(value6 - value5) < 0.5) {
    return count;
  } else {
    return Math.max(
      0,
      Math.min(100, ((value6 - count) / (value6 - value5)) * 100),
    );
  }
}
export function airerPresentationPositionForState(
  value,
  value2,
  value3 = {},
  value4 = false,
) {
  const value5 = physicalCoverState(value2, value4);
  if (value5 === "open") {
    return 100;
  } else if (value5 === "closed") {
    return 0;
  } else {
    return airerPresentationPosition(value, value3);
  }
}
export function airerReportedPosition(value, value2, value3 = {}) {
  const numeric = Number(value?.state);
  const numeric2 = Number(value2?.attributes?.current_position);
  const value4 =
    value3.raised !== null &&
    value3.raised !== undefined &&
    Number.isFinite(Number(value3.raised));
  const value5 =
    value3.lowered !== null &&
    value3.lowered !== undefined &&
    Number.isFinite(Number(value3.lowered));
  if (
    value4 &&
    value5 &&
    Math.abs(Number(value3.lowered) - Number(value3.raised)) >= 0.5 &&
    Number.isFinite(numeric)
  ) {
    return numeric;
  } else if (Number.isFinite(numeric2)) {
    return numeric2;
  } else {
    return numeric;
  }
}
export function airerDevicePosition(value, value2 = {}) {
  const count = Math.max(0, Math.min(100, Number(value) || 0));
  const value3 =
    value2.commandRaised === null || value2.commandRaised === undefined
      ? Number(value2.raised)
      : Number(value2.commandRaised);
  const value4 =
    value2.commandLowered === null || value2.commandLowered === undefined
      ? Number(value2.lowered)
      : Number(value2.commandLowered);
  if (
    !Number.isFinite(value3) ||
    !Number.isFinite(value4) ||
    Math.abs(value4 - value3) < 0.5
  ) {
    return count;
  }
  const value5 = value3;
  const value6 = value4;
  return value6 - (count / 100) * (value6 - value5);
}
const bag = new Set(["switch", "select", "number", "button"]);
export function relatedWaterHeaterEntities(value, value2) {
  const value3 = value.get(value2);
  if (!value3?.deviceId) {
    return [];
  }
  const index = new Map([
    ["switch", 0],
    ["select", 1],
    ["number", 2],
    ["button", 3],
  ]);
  return [...value.values()]
    .filter(
      (metadata) =>
        metadata.entityId !== value2 &&
        metadata.deviceId === value3.deviceId &&
        bag.has(String(metadata.domain || "")) &&
        entityMetadataIsAvailable(metadata),
    )
    .sort(
      (metadata, metadata2) =>
        (index.get(metadata.domain) ?? 99) -
          (index.get(metadata2.domain) ?? 99) ||
        String(metadata.entityId || "").localeCompare(
          String(metadata2.entityId || ""),
        ),
    );
}
export function waterHeaterRelatedEntityLabel(value, value2) {
  let value3 = String(value2?.name || value2?.originalName || "")
    .replace(/\s+/g, " ")
    .trim();
  const value4 = [
    ...new Set(
      [value?.originalName, value?.name]
        .map((value5) =>
          String(value5 || "")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .filter(Boolean),
    ),
  ].sort((value5, value6) => value6.length - value5.length);
  for (const value5 of value4) {
    while (value3 !== value5 && value3.startsWith(value5 + " ")) {
      value3 = value3.slice(value5.length).trim();
    }
  }
  return (
    value3 ||
    (String(value2?.entityId || "").split(".", 2)[1] || "扩展功能").replace(
      /_/g,
      " ",
    )
  );
}
export function relatedCoverMotorReverseEntity(value, value2) {
  const value3 = value.get(value2);
  return (
    (value3?.deviceId &&
      [...value.values()].find(
        (metadata) =>
          metadata.deviceId === value3.deviceId &&
          ["switch", "select"].includes(String(metadata.domain || "")) &&
          /motor_reverse|电机反向/i.test(
            (metadata.entityId || "") + " " + (metadata.name || ""),
          ) &&
          entityMetadataIsAvailable(metadata),
      )) ||
    null
  );
}
function fn2(value) {
  const value2 = String(value?.newState?.state ?? value?.state ?? "")
    .trim()
    .toLowerCase();
  return ["on", "true", "1", "enabled", "开启", "打开"].includes(value2);
}
function isCoverMotorReversed(value, value2, value3) {
  const value4 = relatedCoverMotorReverseEntity(value, value3);
  return !!value4?.entityId && !!fn2(value2.get(value4.entityId));
}
export function coverMotorIsReversedForComponent(component, _2, _3, _4) {
  const coverMotorDirection = component?.properties?.coverMotorDirection;
  if (coverMotorDirection === "normal") {
    return false;
  } else {
    return coverMotorDirection === "reversed";
  }
}
export function physicalCoverState(value, value2 = false) {
  const text = String(value || "");
  return (
    (value2 &&
      {
        open: "closed",
        closed: "open",
        opening: "closing",
        closing: "opening",
      }[text]) ||
    text
  );
}
export function coverPresentationState(value, value2 = false) {
  const value3 = value?.newState || value || {};
  const value4 = physicalCoverState(value3.state, value2);
  if (value4 === "opening" || value4 === "closing") {
    return value4;
  }
  const value5 = readCurrentPosition(value3);
  if (value5 === null) {
    return value4;
  } else if ((value2 ? 100 - value5 : value5) <= COVER_CLOSED_POSITION_EPSILON) {
    return "closed";
  } else {
    return "open";
  }
}
function coverPhysicalPresentationState(value, value2 = false) {
  const value3 = value?.newState || value || {};
  return physicalCoverState(value3.state, value2);
}
export function dreamCurtainBladeLabel(value) {
  const count = Math.max(0, Math.min(100, Number(value) || 0));
  if (count <= COVER_CLOSED_POSITION_EPSILON) {
    return "一侧闭合";
  } else if (count >= 100 - COVER_CLOSED_POSITION_EPSILON) {
    return "反向闭合";
  } else if (Math.abs(count - 50) <= 2) {
    return "90°打开";
  } else {
    return Math.round(count * 1.8) + "°";
  }
}
export function dreamCurtainStatusText(value, value2, value3 = false) {
  const value4 = physicalCoverState(value, value3);
  return (
    "整体：" +
    ({
      open: "开启",
      closed: "关闭",
      opening: "正在开启",
      closing: "正在关闭",
    }[value4] || "未知") +
    " · 叶片：" +
    dreamCurtainBladeLabel(value2)
  );
}
export function dreamCurtainStatusFromRetraction(value, value2, value3) {
  return (
    "整体：" +
    (value2 ? (value ? "正在开启" : "正在关闭") : value ? "开启" : "关闭") +
    " · 叶片：" +
    dreamCurtainBladeLabel(value3)
  );
}
export function dreamCurtainIsRetracted(value, value2 = false) {
  const value3 = physicalCoverState(value, value2);
  return value3 === "open" || value3 === "opening";
}
export function dreamCurtainToggleService(value, value2, value3) {
  if (value) {
    return value3;
  } else {
    return value2;
  }
}
export function coverToggleServiceForComponent(value, value2, value3, value4) {
  const value5 = value3.get(value4);
  const value6 = coverMotorIsReversedForComponent(
    value,
    value2,
    value3,
    value4,
  );
  const value7 = coverComponentIsDream(value, value4, value5, value2)
    ? coverPhysicalPresentationState(value5, value6)
    : coverPresentationState(value5, value6);
  if (value7 === "open" || value7 === "opening") {
    if (value6) {
      return "open_cover";
    } else {
      return "close_cover";
    }
  } else if (value6) {
    return "close_cover";
  } else {
    return "open_cover";
  }
}
