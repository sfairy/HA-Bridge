export function findComponentInItems(componentTree, componentId) {
  for (const itemComponent of componentTree || []) {
    if (itemComponent.id === componentId) {
      return itemComponent;
    }
    const childComponent = findComponentInItems(itemComponent.children, componentId);
    if (childComponent) {
      return childComponent;
    }
  }
  return null;
}
export function findComponent(dashboardDocument, targetComponentId) {
  if (!dashboardDocument || !targetComponentId) {
    return null;
  }
  const sharedComponent = findComponentInItems(
    dashboardDocument.sharedComponents,
    targetComponentId
  );
  if (sharedComponent) {
    return {
      component: sharedComponent,
      scope: "shared"
    };
  }
  for (const pageEntry of dashboardDocument.pages || []) {
    const pageComponent = findComponentInItems(pageEntry.components, targetComponentId);
    if (pageComponent) {
      return {
        component: pageComponent,
        scope: "page",
        page: pageEntry
      };
    }
  }
  return null;
}
export function findComponentLocation(documentModel, searchedComponentId) {
  if (!documentModel || !searchedComponentId) {
    return null;
  }
  const locateComponent = (items, scope, page = null, isRoot = false) => {
    for (let index = 0; index < (items || []).length; index += 1) {
      const component = items[index];
      if (component.id === searchedComponentId) {
        return {
          component: component,
          collection: items,
          index: index,
          scope: scope,
          page: page,
          root: isRoot
        };
      }
      const childLocation = locateComponent(component.children, scope, page, false);
      if (childLocation) {
        return childLocation;
      }
    }
    return null;
  };
  const sharedLocation = locateComponent(documentModel.sharedComponents, "shared", null, true);
  if (sharedLocation) {
    return sharedLocation;
  }
  for (const pageRecord of documentModel.pages || []) {
    const pageLocation = locateComponent(pageRecord.components, "page", pageRecord, true);
    if (pageLocation) {
      return pageLocation;
    }
  }
  return null;
}
export function componentDirectLocation(sourceDocument, componentIdToLocate) {
  const location = findComponentLocation(sourceDocument, componentIdToLocate);
  if (location?.root) {
    return location;
  } else {
    return null;
  }
}
