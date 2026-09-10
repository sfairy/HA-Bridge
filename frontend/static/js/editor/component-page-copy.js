function findComponentInTree(components, componentId) {
  for (const component of components || []) {
    if (component.id === componentId) return component;
    const nested = findComponentInTree(component.children, componentId);
    if (nested) return nested;
  }
  return null;
}
function findComponentInDocument(document, componentId) {
  const shared = findComponentInTree(document?.sharedComponents, componentId);
  if (shared) return shared;
  for (const page of document?.pages || []) {
    const found = findComponentInTree(page.components, componentId);
    if (found) return found;
  }
  return null;
}
function locateComponent(document, componentId) {
  const shared = findComponentInTree(document?.sharedComponents, componentId);
  if (shared) return {
    component: shared,
    scope: "shared",
    page: null
  };
  for (const page of document?.pages || []) {
    const found = findComponentInTree(page.components, componentId);
    if (found) return {
      component: found,
      scope: "page",
      page
    };
  }
  return null;
}
function collectComponentsByIds(document, componentIds) {
  const idSet = new Set(componentIds || []);
  const matched = [];
  const walk = components => {
    for (const component of components || []) {
      if (idSet.has(component.id)) matched.push(component);
      walk(component.children);
    }
  };
  walk(document?.sharedComponents);
  for (const page of document?.pages || []) walk(page.components);
  return matched;
}
export function copyComponentTargetPages(document, componentId) {
  const location = locateComponent(document, componentId);
  return location ? (document?.pages || []).filter(page => location.scope === "shared" || page !== location.page) : [];
}
export function copyComponentTargets(document, componentId) {
  const location = locateComponent(document, componentId);
  if (!location) return [];
  const pageTargets = copyComponentTargetPages(document, componentId).map(page => ({
    key: `page:${page.path}`,
    name: page.name,
    scope: "page",
    page
  }));
  return location.scope === "page" ? [{
    key: "shared",
    name: "侧边栏",
    scope: "shared"
  }, ...pageTargets] : pageTargets;
}
function reassignComponentIds(component, createId) {
  component.id = createId();
  for (const child of component.children || []) reassignComponentIds(child, createId);
  return component;
}
function uniqueCopyLabel(source, siblings, componentLabel) {
  const base = String(componentLabel(source) || "控件").trim().replace(/_副本\d*$/, "") || "控件";
  const used = new Set((siblings || []).map(sibling => String(componentLabel(sibling)).trim()));
  let label = `${base}_副本`;
  let suffix = 2;
  while (used.has(label)) {
    label = `${base}_副本${suffix}`;
    suffix += 1;
  }
  return label;
}
function reindexZOrder(components) {
  for (let index = 0; index < (components || []).length; index += 1) {
    const component = components[index];
    component.position = {
      ...(component.position || {}),
      zIndex: components.length - index
    };
  }
}
function roundLayout(value) {
  return Math.round(Number(value) * 1e6) / 1e6;
}
function positiveSize(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}
function scaleComponentLayout(component, scaleX, scaleY, sizeScale, centerOrigin = true) {
  if (!component || typeof component != "object") return;
  const position = component.position || {};
  const width = positiveSize(position.width, 100);
  const height = positiveSize(position.height, 100);
  const x = Number.isFinite(Number(position.x)) ? Number(position.x) : 0;
  const y = Number.isFinite(Number(position.y)) ? Number(position.y) : 0;
  const nextWidth = width * sizeScale;
  const nextHeight = height * sizeScale;
  component.position = {
    ...position,
    x: roundLayout(centerOrigin ? (x + width / 2) * scaleX - nextWidth / 2 : x * sizeScale),
    y: roundLayout(centerOrigin ? (y + height / 2) * scaleY - nextHeight / 2 : y * sizeScale),
    width: roundLayout(nextWidth),
    height: roundLayout(nextHeight)
  };
  for (const child of component.children || []) {
    scaleComponentLayout(child, sizeScale, sizeScale, sizeScale, false);
  }
}
function scaleComponentToCanvas(component, sourceCanvas, targetCanvas) {
  const sourceWidth = positiveSize(sourceCanvas?.width, 2778);
  const sourceHeight = positiveSize(sourceCanvas?.height, 1940);
  const targetWidth = positiveSize(targetCanvas?.width, sourceWidth);
  const targetHeight = positiveSize(targetCanvas?.height, sourceHeight);
  const scaleX = targetWidth / sourceWidth;
  const scaleY = targetHeight / sourceHeight;
  scaleComponentLayout(component, scaleX, scaleY, Math.min(scaleX, scaleY));
  return component;
}
function sanitizeCopiedActions(component, targetDocument, onInvalidAction) {
  if (!component || typeof component != "object") return;
  const pagePaths = new Set((targetDocument?.pages || []).map(page => page.path));
  const popupIds = new Set((targetDocument?.customPopups || []).map(popup => popup.id));
  if (component.properties?.targetPage && !pagePaths.has(component.properties.targetPage)) {
    delete component.properties.targetPage;
    onInvalidAction?.("navigate");
  }
  for (const [actionKey, action] of Object.entries(component.actions || {})) {
    const badNavigate = action?.type === "navigate" && !pagePaths.has(action.target);
    const badPopup = action?.type === "more-info" && action.data?.popupSource === "custom" && !popupIds.has(action.data?.popupId);
    if (badNavigate || badPopup) {
      delete component.actions[actionKey];
      onInvalidAction?.(badNavigate ? "navigate" : "popup");
    }
  }
  for (const child of component.children || []) {
    sanitizeCopiedActions(child, targetDocument, onInvalidAction);
  }
}
function resolveTargetComponentList(document, targetKey) {
  if (targetKey === "shared") {
    return document.sharedComponents || (document.sharedComponents = []);
  }
  const pagePath = String(targetKey || "").replace(/^page:/, "");
  const page = (document.pages || []).find(entry => entry.path === pagePath);
  return page ? page.components || (page.components = []) : null;
}
function appendSharedComponentIds(document, componentIds) {
  if (!componentIds.length) return;
  for (const page of document.pages || []) {
    page.sharedComponentIds = [...new Set([...componentIds, ...(page.sharedComponentIds || [])])];
  }
}
export function copyComponentsAcrossDocuments(sourceDocument, targetDocument, componentIds, targetKey, {
  cloneValue = value => structuredClone(value),
  createId,
  componentLabel = component => component?.properties?.label || component?.type || "控件",
  scaleMode = "none",
  onInvalidAction
} = {}) {
  const ids = [...new Set(componentIds || [])].filter(Boolean);
  if (!sourceDocument || !targetDocument || !ids.length || typeof createId != "function") {
    return [];
  }
  const sources = collectComponentsByIds(sourceDocument, ids);
  const targetList = resolveTargetComponentList(targetDocument, targetKey);
  if (sources.length !== ids.length || !targetList) return [];
  const copies = [];
  for (const source of sources) {
    const copy = reassignComponentIds(cloneValue(source), createId);
    copy.properties = {
      ...(copy.properties || {}),
      label: uniqueCopyLabel(source, [...targetList, ...copies], componentLabel)
    };
    delete copy.properties.previewState;
    sanitizeCopiedActions(copy, targetDocument, onInvalidAction);
    if (scaleMode === "proportional") {
      scaleComponentToCanvas(copy, sourceDocument.canvas, targetDocument.canvas);
    }
    copies.push(copy);
  }
  targetList.unshift(...copies);
  reindexZOrder(targetList);
  if (targetKey === "shared") {
    appendSharedComponentIds(targetDocument, copies.map(copy => copy.id));
  }
  return copies;
}
export function copyComponentAcrossDocuments(sourceDocument, targetDocument, componentId, targetKey, options = {}) {
  return copyComponentsAcrossDocuments(sourceDocument, targetDocument, [componentId], targetKey, options)[0] || null;
}
export function copyComponentToPage(document, componentId, pagePath, {
  cloneValue = value => structuredClone(value),
  createId,
  componentLabel = component => component?.properties?.label || component?.type || "控件"
} = {}) {
  if (!document || !componentId || !pagePath || typeof createId != "function") {
    return null;
  }
  const source = findComponentInDocument(document, componentId);
  const page = (document.pages || []).find(entry => entry.path === pagePath);
  if (!source || !page) return null;
  const targetList = page.components || (page.components = []);
  const copy = reassignComponentIds(cloneValue(source), createId);
  copy.properties = {
    ...(copy.properties || {}),
    label: uniqueCopyLabel(source, targetList, componentLabel)
  };
  delete copy.properties.previewState;
  targetList.unshift(copy);
  reindexZOrder(targetList);
  return copy;
}
export function copyComponentToTarget(document, componentId, targetKey, options = {}) {
  return copyComponentsToTarget(document, [componentId], targetKey, options)[0] || null;
}
export function copyComponentsToTarget(document, componentIds, targetKey, options = {}) {
  return copyComponentsAcrossDocuments(document, document, componentIds, targetKey, {
    ...options,
    scaleMode: "none"
  });
}
