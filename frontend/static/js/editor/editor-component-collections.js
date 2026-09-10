import { newId } from "./editor-utils.js?v=20260831-editor-utils-v1";
export function componentLabel(component) {
  const typeLabel = component.type === "image" ? "图片" : component.type === "time" ? "时间" : component.type === "date" ? "日期" : component.type === "weather" ? "天气" : component.type === "line-chart" ? "折线图" : component.type === "panel-frame" ? "底图框" : component.type === "navigation-button" ? "导航按钮" : component.type === "title-button" ? "标题按钮" : component.type === "light-statistics" ? "数量统计" : component.type === "icon-button" ? "图标按钮" : component.type === "device-button" ? "设备按钮" : component.type === "presence-sensor" ? "传感器" : component.type === "air-conditioner" ? "空调" : component.type === "vacuum-map" ? "扫地机器人实时地图" : component.type === "camera" ? "摄像头实时预览" : component.type === "icon-button-effect" ? "图标按钮（效果）" : component.type === "group" ? "组合" : component.type;
  const instanceName = component.properties?.instanceName;
  const legacyStatisticsMatch = component.type === "light-statistics" ? /^(?:灯光统计|开灯统计)(_副本\d*)?$/.exec(String(instanceName || "")) : null;
  const resolvedName = component.type === "light-statistics" && instanceName === "图片" ? typeLabel : legacyStatisticsMatch ? "" + typeLabel + (legacyStatisticsMatch[1] || "") : component.type === "vacuum-map" && instanceName === "扫地机地图" || component.type === "camera" && instanceName === "摄像头画面" ? typeLabel : instanceName;
  return component.properties?.label || resolvedName || component.properties?.title || typeLabel;
}
export function nextTemplateInstanceName(components, baseName) {
  const usedNames = new Set((components || []).map(component => componentLabel(component)));
  if (!usedNames.has(baseName)) {
    return baseName;
  }
  let candidate = baseName + "_副本";
  let suffix = 2;
  while (usedNames.has(candidate)) {
    candidate = baseName + "_副本" + suffix;
    suffix += 1;
  }
  return candidate;
}
export function groupNameForCollection(components, baseName = "组合") {
  const usedNames = new Set((components || []).map(component => componentLabel(component)));
  if (!usedNames.has(baseName)) {
    return baseName;
  }
  let suffix = 2;
  while (usedNames.has(baseName + " " + suffix)) {
    suffix += 1;
  }
  return baseName + " " + suffix;
}
export function refreshComponentIds(component, forcedId = null) {
  component.id = forcedId || newId("component");
  for (const child of component.children || []) {
    refreshComponentIds(child);
  }
  return component;
}
export function copiedComponentLabel(component, siblings) {
  const baseLabel = String(componentLabel(component) || "控件").trim().replace(/_副本\d*$/, "") || "控件";
  const usedNames = new Set((siblings || []).map(sibling => String(componentLabel(sibling)).trim()));
  let candidate = baseLabel + "_副本";
  let suffix = 2;
  while (usedNames.has(candidate)) {
    candidate = baseLabel + "_副本" + suffix;
    suffix += 1;
  }
  return candidate;
}
export function applyCollectionLayerOrder(components) {
  for (let index = 0; index < (components || []).length; index += 1) {
    const component = components[index];
    component.position = {
      ...(component.position || {}),
      zIndex: components.length - index
    };
  }
}
export function syncSharedComponentReferenceOrder(document) {
  const sharedIds = (document.sharedComponents || []).map(component => component.id);
  for (const page of document.pages || []) {
    const referenced = new Set(page.sharedComponentIds || []);
    page.sharedComponentIds = sharedIds.filter(id => referenced.has(id));
  }
}
export function ensureSharedComponentReference(document, componentId, pagePath) {
  const page = (document?.pages || []).find(entry => entry.path === pagePath);
  const sharedExists = (document?.sharedComponents || []).some(component => component.id === componentId);
  if (!page || !sharedExists) {
    return false;
  }
  const existingIds = page.sharedComponentIds || [];
  if (existingIds.includes(componentId)) {
    return false;
  } else {
    page.sharedComponentIds = [componentId, ...existingIds.filter(id => id !== componentId)];
    return true;
  }
}
