import { clone, newId, slugify } from "./editor-utils.js?v=20260831-editor-utils-v1";
export function uniquePagePath(pages, name, excludePath = "") {
  const basePath = slugify(name);
  const usedPaths = new Set((pages || []).map(page => page.path).filter(path => path !== excludePath));
  let candidate = basePath;
  let suffix = 2;
  while (usedPaths.has(candidate)) {
    candidate = basePath + "-" + suffix++;
  }
  return candidate;
}
export function clonePageWithFreshIds(pageSource, name, existingPages = []) {
  const page = clone(pageSource);
  page.id = newId("page");
  page.name = name;
  page.path = uniquePagePath(existingPages, name);
  const assignFreshComponentIds = components => {
    for (const component of components || []) {
      component.id = newId("component");
      assignFreshComponentIds(component.children);
    }
  };
  assignFreshComponentIds(page.components);
  return page;
}
export function findCustomPopup(document, popupId) {
  return (document?.customPopups || []).find(popup => popup.id === popupId) || null;
}
export function popupModuleTypeLabel(moduleType) {
  return {
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
    "capability-device": "通用设备"
  }[moduleType] || "通用设备";
}
const ALLOWED_CLIMATE_DEVICE_TYPES = ["auto", "air-conditioner", "bath-heater"];
export function normalizedPopupClimateDeviceType(deviceType) {
  if (ALLOWED_CLIMATE_DEVICE_TYPES.includes(deviceType)) {
    return deviceType;
  } else {
    return "auto";
  }
}
export function popupModuleEntityRecommended(metadata, moduleType) {
  const domain = metadata?.domain || String(metadata?.entityId || "").split(".")[0];
  if (moduleType === "light") {
    return domain === "light";
  } else if (moduleType === "climate") {
    return ["climate", "fan"].includes(domain);
  } else if (moduleType === "air-purifier") {
    return domain === "fan";
  } else if (moduleType === "water-heater") {
    return domain === "water_heater";
  } else if (moduleType === "media-player") {
    return domain === "media_player";
  } else if (moduleType === "electric-bed") {
    return ["number", "select", "button", "switch"].includes(domain);
  } else if (moduleType === "switch") {
    return ["switch", "input_boolean", "button"].includes(domain);
  } else if (moduleType === "cover") {
    return domain === "cover";
  } else if (moduleType === "camera") {
    return domain === "camera";
  } else if (moduleType === "line-chart") {
    return domain === "sensor";
  } else {
    return true;
  }
}
export function reorderedPopupModules(modules, draggedId, targetId = null, placeAfter = false) {
  const next = [...(modules || [])];
  const fromIndex = next.findIndex(module => module.id === draggedId);
  if (fromIndex < 0 || draggedId === targetId) {
    return next;
  }
  const [moved] = next.splice(fromIndex, 1);
  if (!targetId) {
    next.push(moved);
    return next;
  }
  const toIndex = next.findIndex(module => module.id === targetId);
  if (toIndex < 0) {
    next.splice(fromIndex, 0, moved);
    return next;
  } else {
    next.splice(toIndex + (placeAfter ? 1 : 0), 0, moved);
    return next;
  }
}
export function popupModuleDropPosition(element, pointerEvent) {
  const rect = element.getBoundingClientRect();
  const offsetY = pointerEvent.clientY - rect.top;
  const edgeThreshold = Math.min(48, rect.height * 0.22);
  if (offsetY <= edgeThreshold) {
    return {
      placeAfter: false,
      edge: "top"
    };
  } else if (offsetY >= rect.height - edgeThreshold) {
    return {
      placeAfter: true,
      edge: "bottom"
    };
  } else if (pointerEvent.clientX < rect.left + rect.width / 2) {
    return {
      placeAfter: false,
      edge: "left"
    };
  } else {
    return {
      placeAfter: true,
      edge: "right"
    };
  }
}
export function greatestCommonDivisor(arg, arg2) {
  let value = Math.abs(Math.trunc(arg));
  let value2 = Math.abs(Math.trunc(arg2));
  while (value2) {
    [value, value2] = [value2, value % value2];
  }
  return value || 1;
}
