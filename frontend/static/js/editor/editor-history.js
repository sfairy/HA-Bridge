const COMPONENT_OWN_KEYS = new Set(["actions", "bindings", "position", "properties", "style"]);
export function createRecoveryWriter(document, {
  delay: delayMs = 200,
  setTimer: scheduleTimer = setTimeout,
  clearTimer: cancelTimer = clearTimeout
} = {}) {
  let entries = null;
  let order = null;
  const flush = () => {
    if (order !== null) {
      cancelTimer(order);
    }
    order = null;
    const componentId = entries;
    entries = null;
    if (componentId) {
      document(componentId);
    }
  };
  return {
    schedule(projectId) {
      if (entries && entries.projectId !== projectId.projectId) {
        flush();
      }
      entries = projectId;
      if (order === null) {
        order = scheduleTimer(flush, delayMs);
      }
    },
    flush,
    cancel(projectId) {
      if (!!entries && entries.projectId === projectId) {
        entries = null;
        if (order !== null) {
          cancelTimer(order);
        }
        order = null;
      }
    }
  };
}
export function editorComponentEntries(component) {
  const snapshot = new Map();
  const push = [];
  const collectComponent = (node, scope, pagePath, parentId = null) => {
    if (!node?.id) {
      return;
    }
    const componentId = String(node.id);
    snapshot.set(componentId, {
      component: node,
      scope,
      pagePath,
      parentId
    });
    push.push(scope + ":" + (pagePath || "") + ":" + (parentId || "") + ":" + componentId);
    for (const child of node.children || []) {
      collectComponent(child, scope, pagePath, componentId);
    }
  };
  for (const sharedComponent of component?.sharedComponents || []) {
    collectComponent(sharedComponent, "shared", "", null);
  }
  for (const components of component?.pages || []) {
    for (const pageComponent of components.components || []) {
      collectComponent(pageComponent, "page", components.path, null);
    }
  }
  return {
    entries: snapshot,
    order: push
  };
}
export function editorComponentStructure(document) {
  const frame = {};
  for (const [key, value] of Object.entries(document || {})) {
    if (!COMPONENT_OWN_KEYS.has(key) && key !== "children") {
      frame[key] = value;
    }
  }
  frame.children = (document?.children || []).map(child => editorComponentStructure(child));
  return JSON.stringify(frame);
}
export function editorDocumentFrameSignature(document) {
  const normalizeAction = structuredClone(document || {});
  normalizeAction.sharedComponents = [];
  for (const components of normalizeAction.pages || []) {
    components.components = [];
  }
  return documentSignature(normalizeAction);
}
export function documentSignature(prefix) {
  const normalizeActionNode = type => {
    if (!type || !type.type || type.type === "none") {
      return null;
    }
    const data = {
      ...type
    };
    if (!data.data || !Object.keys(data.data).length) {
      delete data.data;
    }
    if (data.type !== "navigate") {
      delete data.target;
    }
    delete data.domain;
    delete data.service;
    return normalizeValue(data);
  };
  const normalizeValue = (map, key = "") => Array.isArray(map) ? map.map(item => normalizeValue(item)) : map && typeof map == "object" ? Object.fromEntries(key === "actions" ? Object.keys(map).sort().flatMap(actionKey => {
    const normalizedAction = normalizeActionNode(map[actionKey]);
    if (normalizedAction) {
      return [[actionKey, normalizedAction]];
    } else {
      return [];
    }
  }) : Object.keys(map).sort().map(childKey => [childKey, normalizeValue(map[childKey], childKey)])) : map;
  return JSON.stringify(normalizeValue(prefix || null));
}
export function recoveryStorageKey(prefix, suffix) {
  return "" + prefix + suffix;
}
