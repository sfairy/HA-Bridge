const COMPONENT_OWN_KEYS = new Set([
  "actions",
  "bindings",
  "position",
  "properties",
  "style",
]);
export function editorComponentEntries(document) {
  const entries = new Map();
  const order = [];
  const visit = (component, scope, pagePath, parentId = null) => {
    if (!component?.id) {
      return;
    }
    const componentId = String(component.id);
    entries.set(componentId, {
      component,
      scope,
      pagePath,
      parentId,
    });
    order.push(
      scope +
        ":" +
        (pagePath || "") +
        ":" +
        (parentId || "") +
        ":" +
        componentId,
    );
    for (const child of component.children || []) {
      visit(child, scope, pagePath, componentId);
    }
  };
  for (const component of document?.sharedComponents || []) {
    visit(component, "shared", "", null);
  }
  for (const page of document?.pages || []) {
    for (const component of page.components || []) {
      visit(component, "page", page.path, null);
    }
  }
  return {
    entries,
    order,
  };
}
export function editorComponentStructure(component) {
  const snapshot = {};
  for (const [key, field] of Object.entries(component || {})) {
    if (!COMPONENT_OWN_KEYS.has(key) && key !== "children") {
      snapshot[key] = field;
    }
  }
  snapshot.children = (component?.children || []).map((child) =>
    editorComponentStructure(child),
  );
  return JSON.stringify(snapshot);
}
export function editorDocumentFrameSignature(document) {
  const frame = structuredClone(document || {});
  frame.sharedComponents = [];
  for (const page of frame.pages || []) {
    page.components = [];
  }
  return documentSignature(frame);
}
export function documentSignature(document) {
  const normalizeAction = (action) => {
    if (!action || !action.type || action.type === "none") {
      return null;
    }
    const next = {
      ...action,
    };
    if (!next.data || !Object.keys(next.data).length) {
      delete next.data;
    }
    if (next.type !== "navigate") {
      delete next.target;
    }
    delete next.domain;
    delete next.service;
    return stableValue(next);
  };
  const stableValue = (value, key = "") =>
    Array.isArray(value)
      ? value.map((item) => stableValue(item))
      : value && typeof value == "object"
        ? Object.fromEntries(
            key === "actions"
              ? Object.keys(value)
                  .sort()
                  .flatMap((actionKey) => {
                    const action = normalizeAction(value[actionKey]);
                    if (action) {
                      return [[actionKey, action]];
                    } else {
                      return [];
                    }
                  })
              : Object.keys(value)
                  .sort()
                  .map((childKey) => [
                    childKey,
                    stableValue(value[childKey], childKey),
                  ]),
          )
        : value;
  return JSON.stringify(stableValue(document || null));
}
export function recoveryStorageKey(prefix, suffix) {
  return "" + prefix + suffix;
}
