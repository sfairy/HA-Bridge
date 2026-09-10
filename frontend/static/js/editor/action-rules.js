import { isVirtualEntityId } from "./virtual-entities.js?v=20260822-icon-visibility-v1";
export const ACTION_TYPES = Object.freeze(["toggle", "more-info", "navigate"]);
export const POPUP_SOURCES = Object.freeze(["current", "entity", "custom"]);
export const TOGGLE_ENTITY_DOMAINS = new Set(["automation", "button", "climate", "cover", "fan", "input_boolean", "light", "media_player", "remote", "script", "switch", "water_heater"]);
export function actionPopupSource(action) {
  const source = String(action?.data?.popupSource || "current");
  if (POPUP_SOURCES.includes(source)) {
    return source;
  } else {
    return "current";
  }
}
export function actionPopupData(action) {
  return {
    source: actionPopupSource(action),
    entityId: String(action?.data?.entityId || ""),
    popupId: String(action?.data?.popupId || "")
  };
}
export function actionNeedsCurrentEntity(action) {
  return action?.type === "toggle" || action?.type === "more-info" && actionPopupSource(action) === "current";
}
export function entityIdSupportsToggle(entityId) {
  const id = String(entityId || "");
  return isVirtualEntityId(id) || TOGGLE_ENTITY_DOMAINS.has(id.split(".", 1)[0]);
}
export function componentActionIsSupported(component, action, {
  pagePaths = null,
  popupIds = null
} = {}) {
  if (!ACTION_TYPES.includes(action?.type) || component?.type === "presence-sensor") {
    return false;
  }
  const entityId = String(component?.bindings?.entity?.entityId || "");
  if (action.type === "toggle") {
    return entityIdSupportsToggle(entityId);
  }
  if (action.type === "navigate") {
    const target = String(action.target || "");
    return !!target && (!pagePaths || pagePaths.has(target));
  }
  const popupSource = actionPopupSource(action);
  if (popupSource === "current") {
    return !!entityId;
  }
  if (popupSource === "entity") {
    return !!action.data?.entityId;
  }
  const popupId = String(action.data?.popupId || "");
  return !!popupId && (!popupIds || popupIds.has(popupId));
}
