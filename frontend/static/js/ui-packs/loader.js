import { applyUiPackToDocument, createComponentFromTemplate, dateComponentDimensions, hasUiPackDefinition, listComponentTemplates, registerComponentTemplate, registerUiPackDefinition, timeComponentDimensions, weatherComponentDimensions } from "../templates/component-templates.js?v=20260814-effect-image-align-v45-20260815-component-thumbnails-v2-20260822-light-feedback-controls-v1-20260824-light-statistics-v4-20260828-count-statistics-v1-20260901-camera-snapshot-v1-20260902-floorplan-auto-diagram-v12-20260904-auto-diagram-floor-v1-20260908-environment-v1-20260908-lighting-mode-v1";
const runtimeLoads = new Map();
export async function ensureUiPackRuntime(uiPack) {
  if (!uiPack?.id) {
    throw new Error("UI 方案信息不完整。");
  }
  if (runtimeLoads.has(uiPack.id)) {
    return runtimeLoads.get(uiPack.id);
  }
  const loading = (async () => {
    if (uiPack.runtimeUrl) {
      const runtime = await import(uiPack.runtimeUrl);
      if (typeof runtime.registerUIPackRuntime == "function") {
        await runtime.registerUIPackRuntime({
          registerComponentTemplate,
          registerUiPackDefinition
        });
      }
    }
    if (!hasUiPackDefinition(uiPack.id)) {
      throw new Error("UI 方案“" + (uiPack.name || uiPack.id) + "”运行时注册失败。");
    }
    return uiPack;
  })().catch(error => {
    runtimeLoads.delete(uiPack.id);
    throw error;
  });
  runtimeLoads.set(uiPack.id, loading);
  return loading;
}
export { applyUiPackToDocument, createComponentFromTemplate, dateComponentDimensions, listComponentTemplates, timeComponentDimensions, weatherComponentDimensions };
