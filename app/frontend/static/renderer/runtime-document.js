import { selectedRelatedEntityIds } from "../js/editor/related-entities.js?v=20260825-bath-heater-primary-v1";
import { isVirtualEntityId } from "../js/editor/virtual-entities.js?v=20260822-icon-visibility-v1";
export function lineChartRuntimeStateNeedsHydration(state) {
  const current = state?.newState || state;
  if (!current) {
    return true;
  }
  const status = String(current.state ?? "")
    .trim()
    .toLowerCase();
  return status === "" || status === "unknown" || status === "unavailable";
}
export function collectEntityIds(components, entityIds = new Set()) {
  for (const component of components || []) {
    for (const binding of Object.values(component.bindings || {})) {
      if (binding?.entityId && !isVirtualEntityId(binding.entityId)) {
        entityIds.add(binding.entityId);
      }
    }
    if (component.type === "light-statistics") {
      for (const entityId of Array.isArray(component.properties?.entityIds)
        ? component.properties.entityIds
        : []) {
        if (entityId && !isVirtualEntityId(entityId)) {
          entityIds.add(String(entityId));
        }
      }
    }
    if (component.type === "weather") {
      entityIds.add(component.bindings?.sun?.entityId || "sun.sun");
    }
    for (const action of Object.values(component.actions || {})) {
      if (
        action?.type === "more-info" &&
        action.data?.popupSource === "entity" &&
        action.data?.entityId &&
        !isVirtualEntityId(action.data.entityId)
      ) {
        entityIds.add(action.data.entityId);
      }
    }
    for (const entityId of selectedRelatedEntityIds(component) || []) {
      entityIds.add(entityId);
    }
    collectEntityIds(component.children, entityIds);
  }
  return entityIds;
}
export function collectComponents(components, match, matches = []) {
  for (const component of components || []) {
    if (match(component)) {
      matches.push(component);
    }
    collectComponents(component.children, match, matches);
  }
  return matches;
}
export function matchingLineChartComponent(document, page, entityId) {
  const isMatch = (component) =>
    component.type === "line-chart" &&
    component.bindings?.entity?.entityId === entityId;
  const onPage = collectComponents(page?.components || [], isMatch)[0];
  if (onPage) {
    return onPage;
  }
  const sharedById = new Map(
    (document?.sharedComponents || []).map((component) => [
      component.id,
      component,
    ]),
  );
  const pageShared = (page?.sharedComponentIds || [])
    .map((componentId) => sharedById.get(componentId))
    .filter(Boolean);
  const onPageShared = collectComponents(pageShared, isMatch)[0];
  if (onPageShared) {
    return onPageShared;
  }
  for (const otherPage of document?.pages || []) {
    if (otherPage === page) {
      continue;
    }
    const found = collectComponents(otherPage.components || [], isMatch)[0];
    if (found) {
      return found;
    }
  }
  return (
    collectComponents(document?.sharedComponents || [], isMatch)[0] || null
  );
}
export function syncedLineChartProperties(
  document,
  page,
  entityId,
  overrides = {},
) {
  return {
    ...(matchingLineChartComponent(document, page, entityId)?.properties || {}),
    ...(overrides || {}),
  };
}
