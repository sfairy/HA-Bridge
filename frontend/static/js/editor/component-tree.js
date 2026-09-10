export function findComponentInItems(items, componentId) {
  for (const item of items || []) {
    if (item.id === componentId) {
      return item;
    }
    const nested = findComponentInItems(item.children, componentId);
    if (nested) {
      return nested;
    }
  }
  return null;
}
export function findComponent(document, componentId) {
  if (!document || !componentId) {
    return null;
  }
  const shared = findComponentInItems(document.sharedComponents, componentId);
  if (shared) {
    return {
      component: shared,
      scope: "shared"
    };
  }
  for (const page of document.pages || []) {
    const pageComponent = findComponentInItems(page.components, componentId);
    if (pageComponent) {
      return {
        component: pageComponent,
        scope: "page",
        page
      };
    }
  }
  return null;
}
export function findComponentLocation(document, componentId) {
  if (!document || !componentId) {
    return null;
  }
  const search = (collection, scope, page = null, root = false) => {
    for (let index = 0; index < (collection || []).length; index += 1) {
      const component = collection[index];
      if (component.id === componentId) {
        return {
          component,
          collection,
          index,
          scope,
          page,
          root
        };
      }
      const nested = search(component.children, scope, page, false);
      if (nested) {
        return nested;
      }
    }
    return null;
  };
  const shared = search(document.sharedComponents, "shared", null, true);
  if (shared) {
    return shared;
  }
  for (const page of document.pages || []) {
    const located = search(page.components, "page", page, true);
    if (located) {
      return located;
    }
  }
  return null;
}
export function componentDirectLocation(document, componentId) {
  const location = findComponentLocation(document, componentId);
  if (location?.root) {
    return location;
  } else {
    return null;
  }
}
