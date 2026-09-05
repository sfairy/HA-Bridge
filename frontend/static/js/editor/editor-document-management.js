import {
  clone,
  newId,
  slugify,
} from "./editor-utils.js?v=20260831-editor-utils-v1";
export function uniquePagePath(value, value2, value3 = "") {
  const value4 = slugify(value2);
  const allowed = new Set(
    (value || [])
      .map((value7) => value7.path)
      .filter((value7) => value7 !== value3),
  );
  let value5 = value4;
  let value6 = 2;
  while (allowed.has(value5)) {
    value5 = value4 + "-" + value6++;
  }
  return value5;
}
export function clonePageWithFreshIds(value, value2, value3 = []) {
  const page = clone(value);
  page.id = newId("page");
  page.name = value2;
  page.path = uniquePagePath(value3, value2);
  const fn = (value5) => {
    for (const value6 of value5 || []) {
      value6.id = newId("component");
      fn(value6.children);
    }
  };
  fn(page.components);
  return page;
}
export function findCustomPopup(document, value2) {
  return (
    (document?.customPopups || []).find((value3) => value3.id === value2) ||
    null
  );
}
export function popupModuleTypeLabel(value) {
  return (
    {
      light: "灯光",
      climate: "空调 / 浴霸",
      "air-purifier": "空气净化器",
      "water-heater": "热水器",
      "media-player": "媒体",
      "electric-bed": "电动床",
      switch: "开关 / 按钮",
      cover: "窗帘",
      camera: "摄像头",
      "line-chart": "折线图",
      generic: "通用设备",
      "capability-device": "通用设备",
    }[value] || "通用设备"
  );
}
const p = ["auto", "air-conditioner", "bath-heater"];
export function normalizedPopupClimateDeviceType(dPopupClimateDeviceType) {
  if (p.includes(dPopupClimateDeviceType)) {
    return dPopupClimateDeviceType;
  } else {
    return "auto";
  }
}
export function popupModuleEntityRecommended(metadata, value2) {
  const value3 =
    metadata?.domain || String(metadata?.entityId || "").split(".")[0];
  if (value2 === "light") {
    return value3 === "light";
  } else if (value2 === "climate") {
    return ["climate", "fan"].includes(value3);
  } else if (value2 === "air-purifier") {
    return value3 === "fan";
  } else if (value2 === "water-heater") {
    return value3 === "water_heater";
  } else if (value2 === "media-player") {
    return value3 === "media_player";
  } else if (value2 === "electric-bed") {
    return ["number", "select", "button", "switch"].includes(value3);
  } else if (value2 === "switch") {
    return ["switch", "input_boolean", "button"].includes(value3);
  } else if (value2 === "cover") {
    return value3 === "cover";
  } else if (value2 === "camera") {
    return value3 === "camera";
  } else if (value2 === "line-chart") {
    return value3 === "sensor";
  } else {
    return true;
  }
}
export function reorderedPopupModules(
  value,
  value2,
  value3 = null,
  value4 = false,
) {
  const value5 = [...(value || [])];
  const value6 = value5.findIndex((value9) => value9.id === value2);
  if (value6 < 0 || value2 === value3) {
    return value5;
  }
  const [value7] = value5.splice(value6, 1);
  if (!value3) {
    value5.push(value7);
    return value5;
  }
  const value8 = value5.findIndex((value9) => value9.id === value3);
  if (value8 < 0) {
    value5.splice(value6, 0, value7);
    return value5;
  } else {
    value5.splice(value8 + (value4 ? 1 : 0), 0, value7);
    return value5;
  }
}
export function popupModuleDropPosition(element, value) {
  const value2 = element.getBoundingClientRect();
  const value3 = value.clientY - value2.top;
  const value4 = Math.min(48, value2.height * 0.22);
  if (value3 <= value4) {
    return {
      placeAfter: false,
      edge: "top",
    };
  } else if (value3 >= value2.height - value4) {
    return {
      placeAfter: true,
      edge: "bottom",
    };
  } else if (value.clientX < value2.left + value2.width / 2) {
    return {
      placeAfter: false,
      edge: "left",
    };
  } else {
    return {
      placeAfter: true,
      edge: "right",
    };
  }
}
export function greatestCommonDivisor(value, value2) {
  let value3 = Math.abs(Math.trunc(value));
  let value4 = Math.abs(Math.trunc(value2));
  while (value4) {
    [value3, value4] = [value4, value3 % value4];
  }
  return value3 || 1;
}
