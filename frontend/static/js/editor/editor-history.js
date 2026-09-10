const COMPONENT_OWN_KEYS = new Set(["actions", "bindings", "position", "properties", "style"]);
export function createRecoveryWriter(document, {
  delay: arg7 = 200,
  setTimer: arg8 = setTimeout,
  clearTimer: arg9 = clearTimeout
} = {}) {
  let entries = null;
  let order = null;
  const flush = () => {
    if (order !== null) {
      arg9(order);
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
        order = arg8(flush, arg7);
      }
    },
    flush,
    cancel(arg5) {
      if (!!entries && entries.projectId === arg5) {
        entries = null;
        if (order !== null) {
          arg9(order);
        }
        order = null;
      }
    }
  };
}
export function editorComponentEntries(component) {
  const snapshot = new Map();
  const push = [];
  const value8 = (id, scope, pagePath, parentId = null) => {
    if (!id?.id) {
      return;
    }
    const value3 = String(id.id);
    snapshot.set(value3, {
      component: id,
      scope,
      pagePath,
      parentId
    });
    push.push(scope + ":" + (pagePath || "") + ":" + (parentId || "") + ":" + value3);
    for (const value2 of id.children || []) {
      value8(value2, scope, pagePath, value3);
    }
  };
  for (const value5 of component?.sharedComponents || []) {
    value8(value5, "shared", "", null);
  }
  for (const components of component?.pages || []) {
    for (const value4 of components.components || []) {
      value8(value4, "page", components.path, null);
    }
  }
  return {
    entries: snapshot,
    order: push
  };
}
export function editorComponentStructure(document) {
  const frame = {};
  for (const [value6, value7] of Object.entries(document || {})) {
    if (!COMPONENT_OWN_KEYS.has(value6) && value6 !== "children") {
      frame[value6] = value7;
    }
  }
  frame.children = (document?.children || []).map(arg4 => editorComponentStructure(arg4));
  return JSON.stringify(frame);
}
export function editorDocumentFrameSignature(document) {
  const normalizeAction = structuredClone(document || {});
  normalizeAction.sharedComponents = [];
  for (const components2 of normalizeAction.pages || []) {
    components2.components = [];
  }
  return documentSignature(normalizeAction);
}
export function documentSignature(prefix) {
  const value9 = type => {
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
    return value10(data);
  };
  const value10 = (map, arg6 = "") => Array.isArray(map) ? map.map(arg3 => value10(arg3)) : map && typeof map == "object" ? Object.fromEntries(arg6 === "actions" ? Object.keys(map).sort().flatMap(arg => {
    const value = value9(map[arg]);
    if (value) {
      return [[arg, value]];
    } else {
      return [];
    }
  }) : Object.keys(map).sort().map(arg2 => [arg2, value10(map[arg2], arg2)])) : map;
  return JSON.stringify(value10(prefix || null));
}
export function recoveryStorageKey(arg10, arg11) {
  return "" + arg10 + arg11;
}
