import { newId } from "./editor-utils.js?v=20260831-editor-utils-v1";
export function componentLabel(component) {
  const value =
    component.type === "image"
      ? "图片"
      : component.type === "time"
        ? "时间"
        : component.type === "date"
          ? "日期"
          : component.type === "weather"
            ? "天气"
            : component.type === "line-chart"
              ? "折线图"
              : component.type === "panel-frame"
                ? "底图框"
                : component.type === "navigation-button"
                  ? "导航按钮"
                  : component.type === "title-button"
                    ? "标题按钮"
                    : component.type === "light-statistics"
                      ? "数量统计"
                      : component.type === "icon-button"
                        ? "图标按钮"
                        : component.type === "device-button"
                          ? "设备按钮"
                          : component.type === "presence-sensor"
                            ? "传感器"
                            : component.type === "air-conditioner"
                              ? "空调"
                              : component.type === "vacuum-map"
                                ? "扫地机器人实时地图"
                                : component.type === "camera"
                                  ? "摄像头实时预览"
                                  : component.type === "icon-button-effect"
                                    ? "图标按钮（效果）"
                                    : component.type === "group"
                                      ? "组合"
                                      : component.type === "floorplan-auto-diagram"
                                        ? "户型图自动导图"
                                        : component.type === "interaction3d"
                                          ? "3D 交互"
                                          : component.type;
  const instanceName = component.properties?.instanceName;
  const value2 =
    component.type === "light-statistics"
      ? /^(?:灯光统计|开灯统计)(_副本\d*)?$/.exec(String(instanceName || ""))
      : null;
  const value3 =
    (component.type === "light-statistics" ||
      component.type === "interaction3d") &&
    instanceName === "图片"
      ? value
      : value2
        ? "" + value + (value2[1] || "")
        : (component.type === "vacuum-map" && instanceName === "扫地机地图") ||
            (component.type === "camera" && instanceName === "摄像头画面")
          ? value
          : instanceName;
  return (
    component.properties?.label ||
    value3 ||
    component.properties?.title ||
    value
  );
}
export function nextTemplateInstanceName(value, value2) {
  const allowed = new Set(
    (value || []).map((value5) => componentLabel(value5)),
  );
  if (!allowed.has(value2)) {
    return value2;
  }
  let value3 = value2 + "_副本";
  let value4 = 2;
  while (allowed.has(value3)) {
    value3 = value2 + "_副本" + value4;
    value4 += 1;
  }
  return value3;
}
export function groupNameForCollection(value, value2 = "组合") {
  const allowed = new Set(
    (value || []).map((value4) => componentLabel(value4)),
  );
  if (!allowed.has(value2)) {
    return value2;
  }
  let value3 = 2;
  while (allowed.has(value2 + " " + value3)) {
    value3 += 1;
  }
  return value2 + " " + value3;
}
export function refreshComponentIds(value, value2 = null) {
  value.id = value2 || newId("component");
  for (const value3 of value.children || []) {
    refreshComponentIds(value3);
  }
  return value;
}
export function copiedComponentLabel(value, value2) {
  const value3 =
    String(componentLabel(value) || "控件")
      .trim()
      .replace(/_副本\d*$/, "") || "控件";
  const allowed = new Set(
    (value2 || []).map((value6) => String(componentLabel(value6)).trim()),
  );
  let value4 = value3 + "_副本";
  let value5 = 2;
  while (allowed.has(value4)) {
    value4 = value3 + "_副本" + value5;
    value5 += 1;
  }
  return value4;
}
export function applyCollectionLayerOrder(value) {
  for (let value2 = 0; value2 < (value || []).length; value2 += 1) {
    const value3 = value[value2];
    value3.position = {
      ...(value3.position || {}),
      zIndex: value.length - value2,
    };
  }
}
export function syncSharedComponentReferenceOrder(document) {
  const value2 = (document.sharedComponents || []).map((value3) => value3.id);
  for (const value3 of document.pages || []) {
    const allowed = new Set(value3.sharedComponentIds || []);
    value3.sharedComponentIds = value2.filter((value4) => allowed.has(value4));
  }
}
export function ensureSharedComponentReference(document, value2, value3) {
  const value4 = (document?.pages || []).find(
    (value7) => value7.path === value3,
  );
  const value5 = (document?.sharedComponents || []).some(
    (value7) => value7.id === value2,
  );
  if (!value4 || !value5) {
    return false;
  }
  const value6 = value4.sharedComponentIds || [];
  if (value6.includes(value2)) {
    return false;
  } else {
    value4.sharedComponentIds = [
      value2,
      ...value6.filter((value7) => value7 !== value2),
    ];
    return true;
  }
}
