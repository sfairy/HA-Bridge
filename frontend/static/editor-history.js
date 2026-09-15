const IGNORED_COMPONENT_KEYS = new Set(["actions", "bindings", "position", "properties", "style"]);
export function createRecoveryWriter(
  writeRecovery,
  {
    delay: delayMs = 200,
    setTimer: setTimer = setTimeout,
    clearTimer: clearTimer = clearTimeout
  } = {}
) {
  let pendingRecovery = null;
  let flushTimer = null;
  const flushRecovery = () => {
    if (flushTimer !== null) {
      clearTimer(flushTimer);
    }
    flushTimer = null;
    const recoveryToWrite = pendingRecovery;
    pendingRecovery = null;
    if (recoveryToWrite) {
      writeRecovery(recoveryToWrite);
    }
  };
  return {
    schedule(recovery) {
      if (pendingRecovery && pendingRecovery.projectId !== recovery.projectId) {
        flushRecovery();
      }
      pendingRecovery = recovery;
      if (flushTimer === null) {
        flushTimer = setTimer(flushRecovery, delayMs);
      }
    },
    flush: flushRecovery,
    cancel(projectId) {
      if (!!pendingRecovery && pendingRecovery.projectId === projectId) {
        pendingRecovery = null;
        if (flushTimer !== null) {
          clearTimer(flushTimer);
        }
        flushTimer = null;
      }
    }
  };
}
export function editorComponentEntries(editorDocument) {
  const entriesByComponentId = new Map();
  const entryOrder = [];
  const collectEntry = (component, scope, pagePath, parentId = null) => {
    if (!component?.id) {
      return;
    }
    const componentId = String(component.id);
    entriesByComponentId.set(componentId, {
      component: component,
      scope: scope,
      pagePath: pagePath,
      parentId: parentId
    });
    entryOrder.push(scope + ":" + (pagePath || "") + ":" + (parentId || "") + ":" + componentId);
    for (const childComponent of component.children || []) {
      collectEntry(childComponent, scope, pagePath, componentId);
    }
  };
  for (const sharedComponent of editorDocument?.sharedComponents || []) {
    collectEntry(sharedComponent, "shared", "", null);
  }
  for (const documentPage of editorDocument?.pages || []) {
    for (const pageComponent of documentPage.components || []) {
      collectEntry(pageComponent, "page", documentPage.path, null);
    }
  }
  return {
    entries: entriesByComponentId,
    order: entryOrder
  };
}
export function editorComponentStructure(structureComponent) {
  const structure = {};
  for (const [key, value] of Object.entries(structureComponent || {})) {
    if (!IGNORED_COMPONENT_KEYS.has(key) && key !== "children") {
      structure[key] = value;
    }
  }
  structure.children = (structureComponent?.children || []).map(
    childComponentId => childComponentId.id
  );
  return JSON.stringify(structure);
}
export function editorDocumentFrameSignature(sourceDocument) {
  const documentWithoutComponents = {
    ...(sourceDocument || {})
  };
  documentWithoutComponents.sharedComponents = [];
  documentWithoutComponents.pages &&= documentWithoutComponents.pages.map(mappedPage => ({
    ...mappedPage,
    components: []
  }));
  return documentSignature(documentWithoutComponents);
}
export function documentSignature(document) {
  const normalizeAction = action => {
    if (!action || !action.type || action.type === "none") {
      return null;
    }
    const strippedAction = {
      ...action
    };
    if (!strippedAction.data || !Object.keys(strippedAction.data).length) {
      delete strippedAction.data;
    }
    if (strippedAction.type !== "navigate") {
      delete strippedAction.target;
    }
    delete strippedAction.domain;
    delete strippedAction.service;
    return normalizeValue(strippedAction);
  };
  const normalizeValue = (input, parentKey = "") =>
    Array.isArray(input)
      ? input.map(arrayItem => normalizeValue(arrayItem))
      : input && typeof input == "object"
        ? Object.fromEntries(
            parentKey === "actions"
              ? Object.keys(input)
                  .sort()
                  .flatMap(actionKey => {
                    const normalizedActionEntry = normalizeAction(input[actionKey]);
                    if (normalizedActionEntry) {
                      return [[actionKey, normalizedActionEntry]];
                    } else {
                      return [];
                    }
                  })
              : Object.keys(input)
                  .sort()
                  .map(valueKey => [valueKey, normalizeValue(input[valueKey], valueKey)])
          )
        : input;
  return JSON.stringify(normalizeValue(document || null));
}
export function recoveryStorageKey(storagePrefix, storageProjectId) {
  return "" + storagePrefix + storageProjectId;
}
