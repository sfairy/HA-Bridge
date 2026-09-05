export const VIRTUAL_ENTITY_PREFIX = "virtual.";
export const ICON_VISIBILITY_VIRTUAL_KIND = "icon_visibility";
export const ICON_VISIBILITY_VIRTUAL_NAME = "图标·显示隐藏";
export const ICON_VISIBILITY_VIRTUAL_SCOPE = "current_page";
export function iconVisibilityVirtualEntityId() {
  return (
    "" +
    VIRTUAL_ENTITY_PREFIX +
    ICON_VISIBILITY_VIRTUAL_KIND +
    "." +
    ICON_VISIBILITY_VIRTUAL_SCOPE
  );
}
export function parseVirtualEntityId(entityId) {
  const id = String(entityId || "");
  if (!id.startsWith(VIRTUAL_ENTITY_PREFIX)) {
    return null;
  }
  const separator = id.indexOf(".", VIRTUAL_ENTITY_PREFIX.length);
  if (separator < 0) {
    return null;
  }
  const kind = id.slice(VIRTUAL_ENTITY_PREFIX.length, separator);
  const scope = id.slice(separator + 1);
  if (kind && scope) {
    return {
      kind,
      scope,
    };
  } else {
    return null;
  }
}
export function isVirtualEntityId(entityId) {
  return !!parseVirtualEntityId(entityId);
}
export function createIconVisibilityVirtualEntity(pagePath = "") {
  return {
    entityId: iconVisibilityVirtualEntityId(),
    domain: "virtual",
    name: ICON_VISIBILITY_VIRTUAL_NAME,
    originalName: ICON_VISIBILITY_VIRTUAL_NAME,
    virtual: true,
    virtualKind: ICON_VISIBILITY_VIRTUAL_KIND,
    pagePath: String(pagePath || ""),
  };
}
