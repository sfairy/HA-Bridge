import { resolvePageBehavior } from "./page-behavior.js?v=20260910-full-page-behavior-v1";
import { performanceWarnings, confirmPerformanceWarning } from "./performance-warning.js?v=20260908-performance-warning-v1-motion-resolution-v1";
import { normalizeGroundReflection } from "./reflection-settings.js?v=20260908-reflections-v1";
import { requestInteraction3dAccess, getInteraction3dEditorView, waitInteraction3dEditorView, cancelOtherInteraction3dViews } from "./bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
import { createInteraction3dCover, updateInteraction3dCoverMessage } from "./cover.js?v=20260905-interaction3d-cover-v1-20260908-access-lock-v1";
import { withRequestTimeout } from "../../utils/request-timeout.js?v=20260907-browser-compat-v1";
import { INTERACTION3D_LIGHTING_MODES, normalizeInteraction3dLightingMode } from "./definition.js?v=20260905-interaction3d-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1";
export function interaction3dEntries(node, path = [], entries = new Map()) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => interaction3dEntries(item, [...path, String(item?.id ?? item?.path ?? index)], entries));
  } else if (node && typeof node == "object") {
    if (node.type === "interaction3d") {
      entries.set(JSON.stringify(path), node);
    }
    for (const [key, child] of Object.entries(node)) {
      interaction3dEntries(child, [...path, key], entries);
    }
  }
  return entries;
}
function stableStringify(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map(stableStringify));
  } else {
    return JSON.stringify(value && typeof value == "object" ? Object.keys(value).sort().map(sortedKey => [sortedKey, stableStringify(value[sortedKey])]) : value);
  }
}
function withoutZIndex(component) {
  if (!component) {
    return null;
  }
  const {
    zIndex: _zIndex,
    ...positionRest
  } = component.position || {};
  return {
    ...component,
    position: positionRest
  };
}
export function changesInteraction3d(beforeDoc, afterDoc) {
  const beforeEntries = interaction3dEntries(beforeDoc);
  const afterEntries = interaction3dEntries(afterDoc);
  for (const [entryPath, afterComp] of afterEntries) {
    if (stableStringify(withoutZIndex(afterComp)) !== stableStringify(withoutZIndex(beforeEntries.get(entryPath)))) {
      return true;
    }
  }
  const sharedWithI3d = new Set((afterDoc?.sharedComponents || []).filter(sharedComp => interaction3dEntries(sharedComp).size).map(sharedItem => sharedItem.id));
  return (afterDoc?.pages || []).some(page => {
    const beforeSharedIds = new Set((beforeDoc?.pages || []).find(beforePage => beforePage.id === page.id)?.sharedComponentIds || []);
    return (page.sharedComponentIds || []).some(sharedId => sharedWithI3d.has(sharedId) && !beforeSharedIds.has(sharedId));
  });
}
export async function guardInteraction3dChanges(beforeDocument, afterDocument) {
  if (changesInteraction3d(beforeDocument, afterDocument)) {
    await requestInteraction3dAccess();
  }
}
export function renderInteraction3dThumbnail(thumbnailEl) {
  thumbnailEl.classList.add("interaction3d-thumbnail");
  thumbnailEl.append(createInteraction3dCover());
}
const sceneLoadStates = new WeakMap();
export async function updateInteraction3dCard(title) {
  const denied = {
    denied: sceneLoadStates.get(title)?.denied === true
  };
  sceneLoadStates.set(title, denied);
  title.disabled = true;
  title.title = "3D 交互";
  const cardEl = title.querySelector(".interaction3d-cover-title");
  cardEl.hidden = false;
  if (!denied.denied) {
    updateInteraction3dCoverMessage(cardEl, ["正在验证 3D 交互授权…"]);
  }
  try {
    await requestInteraction3dAccess();
    if (sceneLoadStates.get(title) !== denied) {
      return;
    }
    denied.denied = false;
    title.disabled = false;
    title.title = "添加 3D 交互控件";
    cardEl.hidden = true;
  } catch (accessError) {
    if (sceneLoadStates.get(title) !== denied) {
      return;
    }
    denied.denied ||= accessError?.status === 403;
    cardEl.hidden = false;
    updateInteraction3dCoverMessage(cardEl, denied.denied ? undefined : [accessError?.status === 401 ? "登录状态已失效，请重新登录" : "暂时无法验证授权，请稍后重试"]);
    title.title = accessError?.status === 403 ? "3D 交互" : "3D 交互暂时无法连接，请稍后重试";
  }
}
const Vt = new Map();
const xn = new WeakMap();
export async function requestInteraction3dScene() {
  return withRequestTimeout(20000, async signal => {
    const response = await fetch("/api/v1/modules/interaction3d/scenes", {
      method: "POST",
      credentials: "same-origin",
      signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof payload.detail == "string" ? payload.detail : "户型载入失败，请重试。");
    }
    if (!/^[0-9a-f]{32}$/.test(payload.sceneId || "")) {
      throw new Error("户型载入失败，请重试。");
    }
    return {
      sceneId: payload.sceneId
    };
  });
}
export function renderInteraction3dInspector(panel, component, callbacks) {
  xn.get(panel)?.abort();
  const inspector = new AbortController();
  xn.set(panel, inspector);
  cancelOtherInteraction3dViews(component?.type === "interaction3d" ? component.id : null);
  let hidden = panel.querySelector("#interaction3d-inspector");
  if (!hidden) {
    hidden = document.createElement("section");
    hidden.id = "interaction3d-inspector";
    hidden.className = "inspector-form";
    panel.append(hidden);
  }
  const addSection = !hidden.hidden && hidden.dataset.componentId === component?.id;
  const appendLabeled = panel.scrollTop;
  const applyChange = hidden.contains(document.activeElement) ? document.activeElement.name : "";
  const properties = hidden.style.minHeight;
  if (addSection) {
    hidden.style.minHeight = hidden.getBoundingClientRect().height + "px";
  }
  hidden.hidden = component?.type !== "interaction3d";
  if (hidden.hidden) {
    hidden.style.minHeight = properties;
    return;
  }
  hidden.dataset.componentId = component.id;
  const position = new Map([...hidden.querySelectorAll("details")].filter(dataset => dataset.dataset.inspectorGroup).map(dataset2 => [dataset2.dataset.inspectorGroup, dataset2.open]));
  hidden.replaceChildren();
  const value67 = (arg2, element2 = "", element3 = "") => {
    const className = document.createElement(arg2);
    className.className = element2;
    className.textContent = element3;
    return className;
  };
  const value68 = arg3 => {
    const append = value67("section", "inspector-section");
    append.append(value67("h3", "", arg3));
    hidden.append(append);
    return append;
  };
  const viewEditing = (append2, arg4, arg5) => {
    const append3 = value67("label");
    append3.append(value67("span", "", arg4), arg5);
    append2.append(append3);
    return arg5;
  };
  const value69 = arg6 => Promise.resolve(callbacks.onChange(arg6)).catch(topPercent => callbacks.onError?.(topPercent));
  const canvasWidth = component.properties || {};
  const canvasHeight = component.position || {};
  const compWidth = new WeakSet();
  const compHeight = (value39, arg7) => {
    value39.value = String(arg7);
    compWidth.add(value39);
    try {
      value39.dispatchEvent?.(new Event("change", {
        bubbles: true
      }));
    } finally {
      compWidth.delete(value39);
    }
  };
  const layoutSection = async arg8 => (await confirmPerformanceWarning(performanceWarnings(canvasWidth, arg8), {
    document,
    signal: inspector.signal
  })) && !inspector.signal.aborted && !hidden.hidden && hidden.dataset.componentId === component.id;
  const layoutOptions = {
    rotationMode: canvasWidth.interaction?.rotationMode || canvasWidth.camera?.rotationMode || "free",
    panEnabled: false,
    zoomEnabled: false
  };
  const metadata3 = getInteraction3dEditorView(component.id);
  const positionGrid = !!metadata3?.viewEditing;
  const addPositionField = callbacks.document?.canvas || {};
  const value70 = Number(addPositionField.width || 2778);
  const value71 = Number(addPositionField.height || 1940);
  const sceneCacheKey = Number(canvasHeight.width || 100);
  const sceneLoad = Number(canvasHeight.height || 100);
  const reloadBtn = value68("布局与位置");
  const setAttribute2 = value67("div", "image-layout-options");
  setAttribute2.setAttribute("role", "group");
  setAttribute2.setAttribute("aria-label", "3D 交互布局");
  const disabled4 = canvasWidth.layoutMode === "fill";
  for (const [layoutMode, layoutLabel] of [["free", "自由"], ["fill", "铺满"]]) {
    const layoutBtn = value67("button", "", layoutLabel);
    layoutBtn.type = "button";
    layoutBtn.dataset.interaction3dLayout = layoutMode;
    const isActiveLayout = (disabled4 ? "fill" : "free") === layoutMode;
    layoutBtn.classList.toggle("active", isActiveLayout);
    layoutBtn.setAttribute("aria-pressed", String(isActiveLayout));
    layoutBtn.addEventListener("click", () => {
      if (!isActiveLayout) {
        value69({
          properties: {
            layoutMode
          }
        });
      }
    });
    setAttribute2.append(layoutBtn);
  }
  const prepareEditorView = value67("div", "inspector-grid two-columns");
  reloadBtn.append(setAttribute2, prepareEditorView);
  prepareEditorView.hidden = disabled4;
  const value72 = (arg9, arg10, arg11, arg12, arg13) => {
    const valueAsNumber2 = value67("input");
    Object.assign(valueAsNumber2, {
      name: "i3d-position-" + arg9,
      type: "number",
      min: String(arg11),
      max: String(arg12),
      step: ".1",
      value: String(Math.round(arg10 * 10) / 10),
      disabled: disabled4
    });
    valueAsNumber2.addEventListener("change", () => {
      if (Number.isFinite(valueAsNumber2.valueAsNumber)) {
        value69(arg13(Math.max(arg11, Math.min(arg12, valueAsNumber2.valueAsNumber))));
      }
    });
    viewEditing(prepareEditorView, arg9, valueAsNumber2);
  };
  value72("左侧（%）", (Number(canvasHeight.x || 0) + sceneCacheKey / 2) / value70 * 100, 0, 100, widthPercent => ({
    position: {
      x: widthPercent * value70 / 100 - sceneCacheKey / 2
    }
  }));
  value72("顶部（%）", (Number(canvasHeight.y || 0) + sceneLoad / 2) / value71 * 100, 0, 100, heightPercent => ({
    position: {
      y: heightPercent * value71 / 100 - sceneLoad / 2
    }
  }));
  value72("宽度（%）", sceneCacheKey / value70 * 100, 0.1, 100, scalePercent => ({
    position: {
      width: scalePercent * value70 / 100
    }
  }));
  value72("高度（%）", sceneLoad / value71 * 100, 0.1, 100, rotationDeg => ({
    position: {
      height: rotationDeg * value71 / 100
    }
  }));
  value72("缩放（%）", Number(component.style?.scale || 1) * 100, 1, 500, arg14 => ({
    style: {
      scale: arg14 / 100
    }
  }));
  value72("旋转（°）", Number(canvasHeight.rotation || 0), -360, 360, rotation => ({
    position: {
      rotation
    }
  }));
  const append5 = value68("户型");
  const loadScene = value67("p", "inspector-section-note");
  loadScene.setAttribute("role", "status");
  const houseSectionRef = (callbacks.document?.projectId || "") + "/" + component.id;
  if (!Vt.has(houseSectionRef)) {
    Vt.set(houseSectionRef, {
      state: "idle",
      error: ""
    });
  }
  const viewEditBtn = Vt.get(houseSectionRef);
  const type4 = value67("button", "", "重新载入户型");
  type4.type = "button";
  const disabled5 = value67("button", "", "配置灯光");
  disabled5.type = "button";
  const disabled6 = value67("button", "", "配置空调");
  disabled6.type = "button";
  const disabled7 = value67("button", "", "配置窗帘");
  disabled7.type = "button";
  const disabled8 = value67("button", "", "户型渲染");
  disabled8.type = "button";
  const focalInput = async () => {
    callbacks.prepareCanvas?.();
    renderScaleSelect.hidden = false;
    renderScaleSelect.textContent = "正在准备户型…";
    const value40 = await waitInteraction3dEditorView(component.id);
    if (hidden.hidden || hidden.dataset.componentId !== component.id) {
      return null;
    } else {
      renderScaleSelect.hidden = true;
      return value40;
    }
  };
  disabled8.addEventListener("click", async () => {
    disabled8.disabled = true;
    try {
      if (!(await focalInput())) {
        return;
      }
      await requestInteraction3dAccess();
      const {
        openInteraction3dAppearanceEditor: value10
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value10({
        component,
        onSave: baseLighting => callbacks.onChange({
          properties: {
            baseLighting
          }
        })
      });
    } catch (message) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = message.message;
    } finally {
      disabled8.disabled = false;
    }
  });
  const append6 = value67("div", "i3d-house-actions");
  append5.append(loadScene, type4, append6);
  const rotationControl = value68("灯光效果");
  const rotationOptions = value68("灯光");
  rotationOptions.append(disabled5);
  const autoRotateSection = value68("环境");
  autoRotateSection.append(disabled6, disabled7);
  const autoRotate = value68("设备");
  const autoRotateToggle = value67("button", "", "配置设备");
  autoRotateToggle.type = "button";
  autoRotate.append(autoRotateToggle);
  autoRotateToggle.addEventListener("click", async () => {
    autoRotateToggle.disabled = true;
    try {
      const {
        openInteraction3dEditor: value11
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value11({
        component,
        deviceKind: "devices",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value12) {
      callbacks.onError?.(value12);
    } finally {
      autoRotateToggle.disabled = false;
    }
  });
  const append7 = value68("安防");
  const disabled9 = value67("button", "", "配置安防");
  disabled9.type = "button";
  append7.append(disabled9);
  disabled9.addEventListener("click", async () => {
    disabled9.disabled = true;
    try {
      await requestInteraction3dAccess();
      const metadata = await focalInput();
      if (!metadata) {
        return;
      }
      const {
        openPresenceEditor: value13
      } = await import("/api/v1/modules/interaction3d/presence-editor.js?v=20260910-presence-v9");
      await value13({
        component,
        panelDocument: callbacks.document,
        floors: metadata.metadata?.floors || [],
        entities: callbacks.entities,
        pickers: callbacks.pickers,
        onSave: async security => {
          await callbacks.onChange({
            properties: {
              security: security.security
            }
          });
        }
      });
    } catch (value14) {
      callbacks.onError?.(value14);
    } finally {
      disabled9.disabled = false;
    }
  });
  const append8 = value68("扫地机");
  const disabled10 = value67("button", "", "配置扫地机");
  disabled10.type = "button";
  append8.append(disabled10);
  disabled10.addEventListener("click", async () => {
    disabled10.disabled = true;
    try {
      const {
        openInteraction3dEditor: value15
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value15({
        component,
        deviceKind: "vacuum",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value16) {
      callbacks.onError?.(value16);
    } finally {
      disabled10.disabled = false;
    }
  });
  const disabled11 = value67("button", "", "快捷指令设置");
  disabled11.type = "button";
  append8.append(disabled11);
  disabled11.addEventListener("click", async () => {
    disabled11.disabled = true;
    try {
      const {
        openInteraction3dEditor: value17
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value17({
        component,
        deviceKind: "vacuum-shortcut",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value18) {
      callbacks.onError?.(value18);
    } finally {
      disabled11.disabled = false;
    }
  });
  viewEditBtn.refresh = () => {
    if (loadScene.isConnected) {
      loadScene.textContent = canvasWidth.sceneId ? "已关联户型，可继续配置视角和灯光。" : viewEditBtn.state === "loading" ? "正在载入已保存的户型…" : viewEditBtn.error || "尚未载入户型。";
      loadScene.hidden = !!canvasWidth.sceneId;
      type4.hidden = !!canvasWidth.sceneId || viewEditBtn.state === "loading";
      disabled5.disabled = !canvasWidth.sceneId || positionGrid;
      disabled9.disabled = disabled11.disabled = disabled10.disabled = autoRotateToggle.disabled = disabled6.disabled = disabled7.disabled = disabled5.disabled;
      disabled8.disabled = !canvasWidth.sceneId || positionGrid;
    }
  };
  const returnDefaultToggle = async () => {
    if (viewEditBtn.state !== "loading") {
      viewEditBtn.state = "loading";
      viewEditBtn.error = "";
      viewEditBtn.refresh();
      try {
        const properties2 = await requestInteraction3dScene();
        await callbacks.onChange({
          properties: properties2
        });
        viewEditBtn.state = "ready";
      } catch (name2) {
        viewEditBtn.state = "error";
        viewEditBtn.error = name2.name === "TimeoutError" ? "户型载入超时，请重试。" : name2.message;
      }
      viewEditBtn.refresh();
    }
  };
  type4.addEventListener("click", () => void returnDefaultToggle());
  disabled5.addEventListener("click", async () => {
    disabled5.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: value19
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value19({
        component,
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value20) {
      callbacks.onError?.(value20);
    } finally {
      disabled5.disabled = false;
    }
  });
  disabled6.addEventListener("click", async () => {
    disabled6.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: value21
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value21({
        component,
        deviceKind: "climate",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value22) {
      callbacks.onError?.(value22);
    } finally {
      disabled6.disabled = false;
    }
  });
  disabled7.addEventListener("click", async () => {
    disabled7.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: value23
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await value23({
        component,
        deviceKind: "cover",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties2 => callbacks.onChange({
          properties: properties2
        }, {
          replaceProperties: true
        })
      });
    } catch (value24) {
      callbacks.onError?.(value24);
    } finally {
      disabled7.disabled = false;
    }
  });
  const append9 = value68("楼层视角");
  const value73 = value67("div", "i3d-view-floor-row");
  append9.append(value73);
  const value74 = value67("select");
  value74.name = "i3d-view-floor";
  value74.disabled = positionGrid;
  viewEditing(value73, "视角楼层", value74);
  const disabled12 = value67("input");
  Object.assign(disabled12, {
    name: "i3d-floor-gap",
    type: "number",
    min: "0",
    max: "20",
    step: "0.1",
    value: String(canvasWidth.floorGap ?? metadata3?.metadata?.floorGap ?? 3)
  });
  viewEditing(value73, "楼层间距（m）", disabled12);
  disabled12.disabled = canvasWidth.floorSelection !== "all";
  disabled12.addEventListener("change", () => {
    if (!disabled12.disabled) {
      if (Number.isFinite(disabled12.valueAsNumber)) {
        const floorGap = Math.max(0, Math.min(20, disabled12.valueAsNumber));
        disabled12.value = String(floorGap);
        value69({
          properties: {
            floorGap
          }
        });
      } else {
        disabled12.value = String(canvasWidth.floorGap ?? metadata3?.metadata?.floorGap ?? 3);
      }
    }
  });
  const append10 = value67("div", "i3d-floor-number-group");
  append10.append(value67("span", "i3d-floor-number-title", "楼层编号"));
  const idleIconsGrid = value67("div", "i3d-floor-number-fields");
  append10.append(idleIconsGrid);
  append9.append(append10);
  const idleSecondsInput = length => {
    idleIconsGrid.replaceChildren();
    append10.hidden = !length.length;
    for (const [value33, id2] of length.entries()) {
      const value25 = id2.id;
      const value26 = id2.name || "未命名楼层";
      const value27 = canvasWidth.floorNumbers?.[value25] ?? id2.number ?? value33 + 1;
      const value28 = value67("input");
      Object.assign(value28, {
        type: "number",
        min: "-99",
        max: "99",
        step: "1",
        value: String(value27),
        name: "i3d-floor-number-" + value25,
        title: "负数为地下层，1 为一层",
        disabled: positionGrid
      });
      viewEditing(idleIconsGrid, value26, value28);
      let value29 = value27;
      value28.addEventListener("change", async () => {
        let value3 = value28.valueAsNumber;
        if (value3 === 0) {
          value3 = value29 < 0 ? 1 : -1;
        }
        if (!Number.isInteger(value3) || value3 < -99 || value3 > 99) {
          value28.value = String(value29);
          return;
        }
        const floorNumbers = {
          ...canvasWidth.floorNumbers,
          [value25]: value3
        };
        value28.disabled = true;
        try {
          await callbacks.onChange({
            properties: {
              floorNumbers
            }
          });
          canvasWidth.floorNumbers = floorNumbers;
          value29 = value3;
          value28.value = String(value3);
        } catch (value) {
          value28.value = String(value29);
          callbacks.onError?.(value);
        } finally {
          value28.disabled = positionGrid;
        }
      });
    }
  };
  const displaySection = metadata2 => {
    if (!value74.isConnected) {
      return;
    }
    const length2 = metadata2?.metadata?.floors || [];
    idleSecondsInput(length2);
    if (canvasWidth.floorGap === undefined && Number.isFinite(metadata2?.metadata?.floorGap)) {
      disabled12.value = String(metadata2.metadata.floorGap);
    }
    value74.replaceChildren();
    const value41 = length2.length ? [...(length2.length > 1 ? [["all", "全部楼层"]] : []), ...length2.map(id => [id.id, id.name || "未命名楼层"])] : [[canvasWidth.floorSelection || "all", "当前楼层"]];
    for (const [element, value34] of value41) {
      const value30 = value67("option", "", value34);
      value30.value = element;
      value74.append(value30);
    }
    value74.value = canvasWidth.floorSelection || value41[0][0];
    disabled12.disabled = value74.value !== "all" || length2.length < 2;
    value74.disabled = positionGrid || length2.length < 2;
  };
  displaySection(metadata3);
  if (canvasWidth.sceneId && !metadata3?.metadata?.floors?.length && typeof waitInteraction3dEditorView == "function") {
    waitInteraction3dEditorView(component.id).then(displaySection).catch(() => {});
  }
  value74.addEventListener("change", async () => {
    if (positionGrid) {
      return;
    }
    const floorSelection = value74.value;
    const floorCameras2 = {
      ...canvasWidth.floorCameras
    };
    if (canvasWidth.camera && canvasWidth.floorSelection && !floorCameras2[canvasWidth.floorSelection]) {
      floorCameras2[canvasWidth.floorSelection] = canvasWidth.camera;
    }
    const properties2 = {
      floorSelection,
      floorCameras: floorCameras2,
      camera: floorCameras2[floorSelection] || null
    };
    await value69({
      properties: properties2
    });
    renderInteraction3dInspector(panel, {
      ...component,
      properties: {
        ...canvasWidth,
        ...properties2
      }
    }, callbacks);
  });
  const disabled13 = value67("button", positionGrid ? "primary" : "", positionGrid ? "完成并固定" : "调整户型视角");
  disabled13.type = "button";
  disabled13.disabled = !canvasWidth.sceneId;
  disabled13.setAttribute("aria-pressed", String(positionGrid));
  const type5 = value67("button", "", "取消本次调整");
  type5.type = "button";
  type5.hidden = !positionGrid;
  const renderScaleSelect = value67("p", "inspector-section-note");
  renderScaleSelect.hidden = true;
  disabled13.addEventListener("click", async () => {
    disabled13.disabled = true;
    try {
      const setViewEditing = await focalInput();
      if (!setViewEditing) {
        return;
      }
      if (setViewEditing.viewEditing) {
        const camera = await setViewEditing.captureView();
        const floorCameras = {
          ...canvasWidth.floorCameras,
          [canvasWidth.floorSelection || value74.value]: camera
        };
        await callbacks.onChange({
          properties: {
            camera,
            floorCameras,
            interaction: layoutOptions
          }
        });
        setViewEditing.setViewEditing(false);
        renderInteraction3dInspector(panel, {
          ...component,
          properties: {
            ...canvasWidth,
            camera,
            floorCameras,
            interaction: layoutOptions
          }
        }, callbacks);
      } else {
        setViewEditing.setViewEditing(true);
        renderInteraction3dInspector(panel, component, callbacks);
      }
    } catch (message2) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = message2.message;
    } finally {
      disabled13.disabled = false;
    }
  });
  type5.addEventListener("click", () => {
    getInteraction3dEditorView(component.id)?.setViewEditing(false);
    renderInteraction3dInspector(panel, component, callbacks);
  });
  append6.append(disabled13);
  append9.append(append6);
  append9.append(type5, renderScaleSelect);
  const hidden2 = value67("div", "i3d-view-options");
  hidden2.hidden = !positionGrid;
  append9.append(hidden2);
  const popupTransparencyInput = metadata3?.viewCamera || canvasWidth.camera || {};
  const popupTransparencyOutput = async (arg15, arg16) => {
    try {
      const viewEditing2 = getInteraction3dEditorView(component.id);
      if (!viewEditing2?.viewEditing) {
        return;
      }
      await viewEditing2.viewCommand(arg15, arg16);
      renderInteraction3dInspector(panel, component, callbacks);
    } catch (message3) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = message3.message;
    }
  };
  ((arg17, arg18, arg19, arg20) => {
    const append4 = value67("div", "navigation-property-control");
    const setAttribute = value67("div", "navigation-segmented-options");
    setAttribute.setAttribute("role", "group");
    setAttribute.setAttribute("aria-label", "3D " + arg17);
    for (const [value35, value36] of arg19) {
      const type = value67("button", "", value36);
      type.type = "button";
      type.disabled = !positionGrid;
      type.classList.toggle("active", value35 === arg20);
      type.setAttribute("aria-pressed", String(value35 === arg20));
      type.addEventListener("click", () => void popupTransparencyOutput(arg18, value35));
      setAttribute.append(type);
    }
    append4.append(value67("span", "", arg17), setAttribute);
    hidden2.append(append4);
  })("投影", "projection", [["orthographic", "正交"], ["perspective", "透视"]], popupTransparencyInput.mode || "orthographic");
  const popupTransparency = value67("input");
  Object.assign(popupTransparency, {
    name: "i3d-focal-length",
    type: "number",
    min: "18",
    max: "120",
    step: "1",
    value: String(Math.round(popupTransparencyInput.focalLength || 50)),
    disabled: !positionGrid || popupTransparencyInput.mode !== "perspective"
  });
  popupTransparency.addEventListener("change", () => {
    if (Number.isFinite(popupTransparency.valueAsNumber)) {
      popupTransparencyOutput("focal-length", Math.max(18, Math.min(120, popupTransparency.valueAsNumber)));
    }
  });
  viewEditing(hidden2, "焦段（mm）", popupTransparency);
  const append11 = value68("导航位置");
  const vignetteInput = {
    categories: {
      x: 50,
      y: 94,
      ...canvasWidth.navigation?.categories
    },
    floors: {
      x: 96,
      y: 50,
      ...canvasWidth.navigation?.floors
    },
    followOffset: canvasWidth.navigation?.followOffset ?? 16
  };
  const vignetteOutput = [];
  for (const [rotMode, rotLabel] of [["categories", "分类栏"], ["floors", "楼层栏"]]) {
    const rotBtn = value67("div", "i3d-finishing-row");
    append11.append(rotBtn);
    for (const [value42, value43] of [["x", "横向"], ["y", "纵向"]]) {
      const valueAsNumber = value67("input");
      Object.assign(valueAsNumber, {
        name: "i3d-navigation-" + rotMode + "-" + value42,
        type: "number",
        min: "0",
        max: "100",
        step: "1",
        value: String(vignetteInput[rotMode][value42]),
        disabled: positionGrid
      });
      valueAsNumber.addEventListener("change", () => {
        if (!positionGrid) {
          if (Number.isFinite(valueAsNumber.valueAsNumber)) {
            vignetteInput[rotMode][value42] = Math.max(0, Math.min(100, valueAsNumber.valueAsNumber));
            value69({
              properties: {
                navigation: structuredClone(vignetteInput)
              }
            });
          }
          valueAsNumber.value = String(vignetteInput[rotMode][value42]);
        }
      });
      viewEditing(rotBtn, "" + rotLabel + value43 + "（%）", valueAsNumber);
      vignetteOutput.push([valueAsNumber, rotMode, value42]);
    }
  }
  const type6 = value67("button", "secondary-button", "恢复默认位置");
  type6.type = "button";
  type6.disabled = positionGrid;
  type6.addEventListener("click", () => {
    if (!positionGrid) {
      Object.assign(vignetteInput, {
        categories: {
          x: 50,
          y: 94
        },
        floors: {
          x: 96,
          y: 50
        }
      });
      for (const [value6, value7, value8] of vignetteOutput) {
        value6.value = String(vignetteInput[value7][value8]);
      }
      value69({
        properties: {
          navigation: structuredClone(vignetteInput)
        }
      });
    }
  });
  append11.append(type6);
  const append12 = value68("交互行为");
  let vignetteStrength = canvasWidth.behaviorScope === "page" ? "page" : "global";
  const value75 = [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]];
  let element8 = panel.dataset.behaviorPage || "overview";
  let pageBehaviors = structuredClone(canvasWidth.pageBehaviors || {});
  let value76 = {
    ...canvasWidth,
    pageBehaviors
  };
  const value77 = () => resolvePageBehavior({
    ...value76,
    behaviorScope: vignetteStrength,
    pageBehaviors
  }, element8);
  const value78 = arg21 => arg21 === "hideIconsWhileRotating" ? value77()[arg21] : value77()[arg21].enabled;
  const vignetteInput2 = value67("div", "i3d-behavior-scope-row");
  const popupTransparencyInput2 = value67("select");
  const value79 = value67("select");
  Object.assign(popupTransparencyInput2, {
    name: "i3d-behavior-scope",
    disabled: positionGrid
  });
  popupTransparencyInput2.setAttribute("aria-label", "交互行为设置范围");
  for (const [dirValue, dirLabel] of [["global", "全部页面"], ["page", "单页面"]]) {
    const dirBtn = value67("option", "", dirLabel);
    dirBtn.value = dirValue;
    popupTransparencyInput2.append(dirBtn);
  }
  popupTransparencyInput2.value = vignetteStrength;
  Object.assign(value79, {
    name: "i3d-behavior-page",
    disabled: positionGrid
  });
  value79.setAttribute("aria-label", "交互设置页面");
  for (const [bgVisible, bgLabel] of value75) {
    const value48 = value67("option", "", bgLabel);
    value48.value = bgVisible;
    value79.append(value48);
  }
  value79.value = element8;
  const hidden3 = value67("div");
  hidden3.append(value79);
  hidden3.hidden = vignetteStrength !== "page";
  vignetteInput2.append(popupTransparencyInput2, hidden3);
  append12.append(vignetteInput2);
  append12.append(value67("p", "inspector-section-note", "以下设置统一应用于所选范围；单页面未单独设置的参数沿用全部页面。"));
  const value80 = (arg22, arg23) => {
    if (!positionGrid) {
      if (vignetteStrength === "page") {
        const enabled = pageBehaviors[element8]?.[arg22];
        const value4 = typeof arg23 == "boolean" ? arg23 : {
          ...(typeof enabled == "boolean" ? {
            enabled
          } : enabled || {}),
          ...arg23
        };
        pageBehaviors = {
          ...pageBehaviors,
          [element8]: {
            ...pageBehaviors[element8],
            [arg22]: value4
          }
        };
        value69({
          properties: {
            pageBehaviors
          }
        });
      } else {
        const value5 = typeof arg23 == "boolean" ? arg23 : {
          ...resolvePageBehavior({
            ...value76,
            behaviorScope: "global"
          })[arg22],
          ...arg23
        };
        value76 = {
          ...value76,
          [arg22]: value5
        };
        value69({
          properties: {
            [arg22]: value5
          }
        });
      }
    }
  };
  const value81 = (arg24, enabled2) => value80(arg24, arg24 === "hideIconsWhileRotating" ? enabled2 : {
    enabled: enabled2
  });
  popupTransparencyInput2.addEventListener("change", () => {
    if (!positionGrid) {
      vignetteStrength = popupTransparencyInput2.value;
      fn();
      value69({
        properties: {
          behaviorScope: vignetteStrength,
          ...(vignetteStrength === "page" ? {
            pageBehaviors
          } : {})
        }
      });
    }
  });
  value79.addEventListener("change", () => {
    element8 = value79.value;
    panel.dataset.behaviorPage = element8;
    fn();
  });
  const append13 = value67("div", "navigation-property-control");
  const setAttribute3 = value67("div", "navigation-segmented-options three-columns");
  setAttribute3.setAttribute("role", "group");
  setAttribute3.setAttribute("aria-label", "3D 旋转方式");
  for (const [scaleValue, scaleLabel] of [["free", "自由"], ["horizontal", "仅左右"], ["vertical", "仅上下"]]) {
    const scaleOption = value67("button", "", scaleLabel);
    scaleOption.type = "button";
    scaleOption.disabled = positionGrid;
    scaleOption.dataset.rotationMode = scaleValue;
    const value49 = value77().interaction.rotationMode === scaleValue;
    scaleOption.classList.toggle("active", value49);
    scaleOption.setAttribute("aria-pressed", String(value49));
    scaleOption.addEventListener("click", () => {
      value80("interaction", {
        rotationMode: scaleValue
      });
      fn();
    });
    setAttribute3.append(scaleOption);
  }
  append13.append(value67("span", "", "旋转方式"), setAttribute3);
  append12.append(append13);
  const append14 = value68("自动旋转");
  const enabled3 = {
    ...value77().autoRotate
  };
  const append15 = value67("label", "i3d-setting-toggle i3d-view-toggle");
  const checked = value67("input");
  Object.assign(checked, {
    name: "i3d-auto-rotate-enabled",
    type: "checkbox",
    checked: enabled3.enabled,
    disabled: positionGrid
  });
  append15.append(value67("span", "", "开启自动旋转"), checked);
  const hidden4 = value67("div", "inspector-grid two-columns");
  hidden4.hidden = !enabled3.enabled;
  const append16 = value67("div", "i3d-auto-rotate-row");
  const setAttribute4 = value67("div", "navigation-segmented-options");
  setAttribute4.setAttribute("role", "group");
  setAttribute4.setAttribute("aria-label", "自动旋转方向");
  for (const [direction, value57] of [["clockwise", "顺时针"], ["counterclockwise", "逆时针"]]) {
    const type2 = value67("button", "", value57);
    type2.type = "button";
    type2.disabled = positionGrid;
    type2.dataset.direction = direction;
    type2.classList.toggle("active", enabled3.direction === direction);
    type2.setAttribute("aria-pressed", String(enabled3.direction === direction));
    type2.addEventListener("click", () => {
      if (!positionGrid && enabled3.direction !== direction) {
        enabled3.direction = direction;
        for (const classList of setAttribute4.children) {
          const value2 = classList === type2;
          classList.classList.toggle("active", value2);
          classList.setAttribute("aria-pressed", String(value2));
        }
        value80("autoRotate", {
          direction: enabled3.direction
        });
      }
    });
    setAttribute4.append(type2);
  }
  append16.append(append15, setAttribute4);
  append14.append(append16, hidden4);
  const value82 = (arg25, arg26, arg27, arg28, arg29) => {
    const addEventListener = value67("input");
    Object.assign(addEventListener, {
      type: "number",
      min: String(arg27),
      max: String(arg28),
      step: String(arg29),
      name: "i3d-auto-rotate-" + arg26,
      value: String(enabled3[arg26]),
      disabled: positionGrid || !enabled3.enabled
    });
    addEventListener.addEventListener("change", () => {
      const value9 = addEventListener.valueAsNumber;
      if (Number.isFinite(value9)) {
        enabled3[arg26] = Math.max(arg27, Math.min(arg28, arg26 === "idleSeconds" ? Math.round(value9) : value9));
        value80("autoRotate", {
          [arg26]: enabled3[arg26]
        });
      }
      addEventListener.value = String(enabled3[arg26]);
    });
    viewEditing(hidden4, arg25, addEventListener);
  };
  value82("等待时间（秒）", "idleSeconds", 1, 3600, 1);
  value82("旋转速度（°/秒）", "speed", 0.5, 30, 0.5);
  const append17 = value67("label", "i3d-setting-toggle i3d-view-toggle i3d-return-default");
  const disabled14 = value67("input");
  Object.assign(disabled14, {
    name: "i3d-auto-rotate-return-default",
    type: "checkbox",
    checked: enabled3.returnToDefault,
    disabled: positionGrid || !enabled3.enabled
  });
  append17.append(value67("span", "", "旋转前回到默认视角"), disabled14);
  disabled14.addEventListener("change", () => {
    if (!disabled14.disabled) {
      enabled3.returnToDefault = disabled14.checked;
      value80("autoRotate", {
        returnToDefault: enabled3.returnToDefault
      });
    }
  });
  checked.addEventListener("change", () => {
    if (!positionGrid) {
      enabled3.enabled = checked.checked;
      hidden4.hidden = !enabled3.enabled;
      disabled14.disabled = positionGrid || !enabled3.enabled;
      for (const disabled of hidden4.querySelectorAll("input")) {
        disabled.disabled = positionGrid || !enabled3.enabled;
      }
      value81("autoRotate", enabled3.enabled);
    }
  });
  const append18 = value68("闲置退出聚焦");
  const enabled4 = {
    ...value77().idleExitFocus
  };
  const append19 = value67("label", "i3d-setting-toggle i3d-view-toggle");
  const checked2 = value67("input");
  Object.assign(checked2, {
    name: "i3d-idle-exit-enabled",
    type: "checkbox",
    checked: enabled4.enabled,
    disabled: positionGrid
  });
  append19.append(value67("span", "", "无操作时自动退出"), checked2);
  const hidden5 = value67("div", "inspector-grid");
  hidden5.hidden = !enabled4.enabled;
  const disabled15 = value67("input");
  Object.assign(disabled15, {
    name: "i3d-idle-exit-seconds",
    type: "number",
    min: "1",
    max: "3600",
    step: "1",
    value: String(enabled4.idleSeconds),
    disabled: positionGrid || !enabled4.enabled
  });
  disabled15.addEventListener("change", () => {
    if (!disabled15.disabled) {
      if (Number.isFinite(disabled15.valueAsNumber)) {
        enabled4.idleSeconds = Math.max(1, Math.min(3600, Math.round(disabled15.valueAsNumber)));
        value80("idleExitFocus", {
          idleSeconds: enabled4.idleSeconds
        });
      }
      disabled15.value = String(enabled4.idleSeconds);
    }
  });
  disabled15.setAttribute("aria-label", "闲置退出聚焦等待秒数");
  viewEditing(hidden5, "等待时间（秒）", disabled15);
  checked2.addEventListener("change", () => {
    if (!checked2.disabled) {
      enabled4.enabled = checked2.checked;
      hidden5.hidden = !enabled4.enabled;
      disabled15.disabled = positionGrid || !enabled4.enabled;
      value81("idleExitFocus", enabled4.enabled);
    }
  });
  append18.append(append19, hidden5);
  const append20 = value68("图标显示");
  append20.classList.add("i3d-icon-visibility-row");
  const enabled5 = {
    ...value77().idleHideIcons
  };
  const append21 = value67("label", "i3d-setting-toggle i3d-view-toggle");
  const checked3 = value67("input");
  Object.assign(checked3, {
    name: "i3d-idle-icons-enabled",
    type: "checkbox",
    checked: enabled5.enabled,
    disabled: positionGrid
  });
  append21.append(value67("span", "", "闲置后隐藏图标"), checked3);
  const hidden6 = value67("div", "inspector-grid");
  hidden6.hidden = !enabled5.enabled;
  const valueAsNumber3 = value67("input");
  Object.assign(valueAsNumber3, {
    name: "i3d-idle-icons-seconds",
    type: "number",
    min: "1",
    max: "3600",
    step: "1",
    value: String(enabled5.idleSeconds),
    disabled: positionGrid || !enabled5.enabled
  });
  valueAsNumber3.addEventListener("change", () => {
    if (Number.isFinite(valueAsNumber3.valueAsNumber)) {
      enabled5.idleSeconds = Math.max(1, Math.min(3600, Math.round(valueAsNumber3.valueAsNumber)));
      value80("idleHideIcons", {
        idleSeconds: enabled5.idleSeconds
      });
    }
    valueAsNumber3.value = String(enabled5.idleSeconds);
  });
  valueAsNumber3.setAttribute("aria-label", "隐藏图标等待秒数");
  viewEditing(hidden6, "等待时间（秒）", valueAsNumber3);
  checked3.addEventListener("change", () => {
    if (!positionGrid) {
      enabled5.enabled = checked3.checked;
      hidden6.hidden = !enabled5.enabled;
      valueAsNumber3.disabled = positionGrid || !enabled5.enabled;
      value81("idleHideIcons", enabled5.enabled);
    }
  });
  append20.append(append21, hidden6);
  const append22 = value67("label", "i3d-setting-toggle i3d-view-toggle");
  const checked4 = value67("input");
  Object.assign(checked4, {
    type: "checkbox",
    name: "i3d-hide-icons-rotating",
    checked: value78("hideIconsWhileRotating"),
    disabled: positionGrid
  });
  checked4.addEventListener("change", () => value81("hideIconsWhileRotating", checked4.checked));
  append22.append(value67("span", "", "旋转时隐藏图标"), checked4);
  append20.append(append22);
  function fn() {
    hidden3.hidden = vignetteStrength !== "page";
    const autoRotate2 = value77();
    Object.assign(enabled3, autoRotate2.autoRotate);
    Object.assign(enabled4, autoRotate2.idleExitFocus);
    Object.assign(enabled5, autoRotate2.idleHideIcons);
    for (const dataset3 of setAttribute3.children) {
      const value37 = dataset3.dataset.rotationMode === autoRotate2.interaction.rotationMode;
      dataset3.classList.toggle("active", value37);
      dataset3.setAttribute("aria-pressed", String(value37));
    }
    for (const dataset4 of setAttribute4.children) {
      const value38 = dataset4.dataset.direction === enabled3.direction;
      dataset4.classList.toggle("active", value38);
      dataset4.setAttribute("aria-pressed", String(value38));
    }
    for (const value44 of hidden4.querySelectorAll("input")) {
      value44.value = String(enabled3[value44.name.replace("i3d-auto-rotate-", "")]);
    }
    disabled14.checked = enabled3.returnToDefault;
    checked2.checked = enabled4.enabled;
    disabled15.value = String(enabled4.idleSeconds);
    hidden5.hidden = !enabled4.enabled;
    disabled15.disabled = positionGrid || !enabled4.enabled;
    valueAsNumber3.value = String(enabled5.idleSeconds);
    checked.checked = enabled3.enabled;
    hidden4.hidden = !enabled3.enabled;
    disabled14.disabled = positionGrid || !enabled3.enabled;
    for (const disabled3 of hidden4.querySelectorAll("input")) {
      disabled3.disabled = positionGrid || !enabled3.enabled;
    }
    enabled5.enabled = value78("idleHideIcons");
    checked3.checked = enabled5.enabled;
    hidden6.hidden = !enabled5.enabled;
    valueAsNumber3.disabled = positionGrid || !enabled5.enabled;
    checked4.checked = value78("hideIconsWhileRotating");
  }
  const append23 = value68("画面显示");
  let element9 = normalizeInteraction3dLightingMode(canvasWidth.lightingMode);
  const value83 = value67("select");
  value83.name = "i3d-lighting-mode";
  value83.setAttribute("aria-label", "灯光模式");
  for (const [element4, value58] of INTERACTION3D_LIGHTING_MODES) {
    const value50 = value67("option", "", value58);
    value50.value = element4;
    value83.append(value50);
  }
  value83.value = element9;
  viewEditing(rotationControl, "灯光模式", value83);
  value83.addEventListener("change", async () => {
    if (compWidth.has(value83)) {
      return;
    }
    const lightingMode = normalizeInteraction3dLightingMode(value83.value);
    compHeight(value83, element9);
    value83.disabled = true;
    try {
      await requestInteraction3dAccess();
      if (hidden.hidden || hidden.dataset.componentId !== component.id || !(await layoutSection({
        lightingMode
      }))) {
        return;
      }
      await callbacks.onChange({
        properties: {
          lightingMode
        }
      });
      element9 = lightingMode;
      compHeight(value83, lightingMode);
    } catch (value31) {
      value83.value = element9;
      callbacks.onError?.(value31);
    } finally {
      value83.disabled = positionGrid;
    }
  });
  rotationControl.append(disabled8);
  const append24 = value67("div", "navigation-property-control");
  const setAttribute5 = value67("div", "navigation-segmented-options");
  setAttribute5.setAttribute("role", "group");
  setAttribute5.setAttribute("aria-label", "户型底图");
  for (const [backgroundVisible, value59] of [[true, "显示"], [false, "隐藏"]]) {
    const type3 = value67("button", "", value59);
    type3.type = "button";
    const value51 = canvasWidth.backgroundVisible !== false === backgroundVisible;
    type3.classList.toggle("active", value51);
    type3.setAttribute("aria-pressed", String(value51));
    type3.addEventListener("click", () => {
      if (!value51) {
        value69({
          properties: {
            backgroundVisible
          }
        });
      }
    });
    setAttribute5.append(type3);
  }
  append24.append(value67("span", "", "户型底图"), setAttribute5);
  append23.append(append24);
  const value84 = value67("select");
  value84.name = "i3d-render-scale";
  for (const [value60, value61] of [[1.5, "高清 150%"], [1, "标准 100%"], [0.8, "均衡 80%"], [0.75, "均衡 75%"], [0.5, "流畅 50%"], [0.25, "低负载 25%"]]) {
    const value52 = value67("option", "", value61);
    value52.value = String(value60);
    value84.append(value52);
  }
  const append25 = value68("渲染分辨率");
  value84.setAttribute("aria-label", "渲染分辨率");
  value84.value = String(canvasWidth.renderScale ?? 1);
  value84.addEventListener("change", async () => {
    if (compWidth.has(value84)) {
      return;
    }
    const renderScale = Number(value84.value);
    const value45 = canvasWidth.renderScale ?? 1;
    compHeight(value84, value45);
    value84.disabled = true;
    try {
      if (await layoutSection({
        renderScale
      })) {
        await value69({
          properties: {
            renderScale
          }
        });
      }
    } finally {
      value84.disabled = positionGrid;
    }
  });
  append25.append(value84);
  value84.title = "画面卡顿时，可降低渲染分辨率。";
  const append26 = value68("转动分辨率");
  const value85 = value67("div", "inspector-grid two-columns");
  const disabled16 = value67("select");
  const disabled17 = value67("input");
  let value86 = typeof canvasWidth.motionRenderScale == "number" && Number.isFinite(canvasWidth.motionRenderScale) ? Math.max(0.25, Math.min(1, canvasWidth.motionRenderScale)) : null;
  let value87 = value86 ?? 0.75;
  for (const [element5, value62] of [["auto", "自动"], ["custom", "自定义"]]) {
    const value53 = value67("option", "", value62);
    value53.value = element5;
    disabled16.append(value53);
  }
  disabled16.name = "i3d-motion-resolution-mode";
  disabled16.setAttribute("aria-label", "转动分辨率调整方式");
  Object.assign(disabled17, {
    name: "i3d-motion-render-scale",
    type: "number",
    min: "25",
    max: "100",
    step: "1"
  });
  disabled17.setAttribute("aria-label", "转动分辨率百分比");
  const value88 = () => {
    compHeight(disabled16, value86 === null ? "auto" : "custom");
    disabled16.disabled = positionGrid;
    disabled17.disabled = positionGrid || value86 === null;
    disabled17.value = String(Math.round(value87 * 100));
  };
  const value89 = async motionRenderScale => {
    disabled16.disabled = disabled17.disabled = true;
    try {
      if (await layoutSection({
        motionRenderScale
      })) {
        await value69({
          properties: {
            motionRenderScale
          }
        });
        value86 = motionRenderScale;
        if (motionRenderScale !== null) {
          value87 = motionRenderScale;
        }
      }
    } catch (value32) {
      callbacks.onError?.(value32);
    } finally {
      value88();
    }
  };
  disabled16.addEventListener("change", () => {
    if (!compWidth.has(disabled16) && !disabled16.disabled) {
      value89(disabled16.value === "auto" ? null : value87);
    }
  });
  disabled17.addEventListener("change", () => {
    if (disabled17.disabled) {
      return;
    }
    const value46 = disabled17.value.trim() === "" ? NaN : Number(disabled17.value);
    if (!Number.isFinite(value46)) {
      value88();
      return;
    }
    value89(Math.max(25, Math.min(100, Math.round(value46))) / 100);
  });
  viewEditing(value85, "调整方式", disabled16);
  viewEditing(value85, "转动比例（%）", disabled17);
  append26.append(value85);
  value88();
  const value90 = value67("p", "inspector-section-note", "按静止分辨率计算，停止转动后恢复。100% 不降清晰度。");
  append26.append(value90);
  const classList6 = value68("地面反射");
  classList6.classList.add("i3d-reflection-section");
  let mode = normalizeGroundReflection(canvasWidth.groundReflection);
  const value91 = value67("select");
  const value92 = value67("select");
  value91.name = "i3d-reflection-mode";
  value91.setAttribute("aria-label", "地面反射范围");
  value92.name = "i3d-reflection-resolution";
  value92.setAttribute("aria-label", "反射清晰度");
  for (const [element6, value63] of [["off", "关闭"], ["inside", "室内"], ["outside", "室外"], ["all", "室内＋室外"]]) {
    const value54 = value67("option", "", value63);
    value54.value = element6;
    value91.append(value54);
  }
  for (const [value64, value65] of [[256, "低"], [512, "中"], [768, "高"]]) {
    const value55 = value67("option", "", value65);
    value55.value = String(value64);
    value92.append(value55);
  }
  value91.value = mode.mode;
  value92.value = String(mode.resolution);
  const value93 = value67("div", "i3d-reflection-options");
  viewEditing(value93, "范围", value91);
  viewEditing(value93, "清晰度", value92);
  const append27 = value67("div", "i3d-vignette-setting");
  const value94 = value67("input");
  const textContent = value67("output");
  Object.assign(value94, {
    name: "i3d-reflection-strength",
    type: "range",
    min: "0",
    max: "45",
    step: "1",
    value: String(Math.round(mode.strength * 100))
  });
  value94.setAttribute("aria-label", "反射强度");
  textContent.textContent = value94.value + "%";
  append27.append(value94, textContent);
  classList6.append(value93);
  viewEditing(classList6, "强度", append27);
  const value95 = () => {
    value92.disabled = value94.disabled = positionGrid || mode.mode === "off";
  };
  const value96 = async target => {
    if (compWidth.has(target?.target)) {
      return;
    }
    const groundReflection = normalizeGroundReflection({
      mode: value91.value,
      resolution: Number(value92.value),
      strength: Number(value94.value) / 100
    });
    compHeight(value91, mode.mode);
    compHeight(value92, mode.resolution);
    value94.value = String(Math.round(mode.strength * 100));
    textContent.textContent = value94.value + "%";
    value91.disabled = value92.disabled = value94.disabled = true;
    try {
      if (!(await layoutSection({
        groundReflection
      }))) {
        return;
      }
      await value69({
        properties: {
          groundReflection: {
            ...groundReflection
          }
        }
      });
    } finally {
      value91.disabled = positionGrid;
      value95();
    }
  };
  value91.addEventListener("change", value96);
  value92.addEventListener("change", value96);
  value94.addEventListener("input", () => {
    textContent.textContent = value94.value + "%";
  });
  value94.addEventListener("change", value96);
  value95();
  const append28 = value67("section", "inspector-section i3d-page-dimming");
  append28.append(value67("h3", "", "画面压暗"));
  const value97 = value67("select");
  const value98 = value67("input");
  const textContent2 = value67("output");
  value97.name = "i3d-dim-page";
  value97.setAttribute("aria-label", "压暗页面");
  for (const [element7, value66] of [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]]) {
    const value56 = value67("option", "", value66);
    value56.value = element7;
    value97.append(value56);
  }
  value97.value = panel.dataset.dimmingPage || "light";
  let value99 = {
    ...canvasWidth.pageDimStrength
  };
  let value100 = {
    ...canvasWidth.pageSaturation
  };
  const value101 = value67("input");
  const textContent3 = value67("output");
  const append29 = value67("div", "i3d-vignette-setting");
  const value102 = () => value100[value97.value] ?? (value97.value === "overview" ? 100 : 75);
  Object.assign(value101, {
    name: "i3d-page-saturation",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(value102())
  });
  value101.setAttribute("aria-label", "页面饱和度");
  textContent3.textContent = value101.value + "%";
  value101.addEventListener("input", () => {
    textContent3.textContent = value101.value + "%";
  });
  value101.addEventListener("change", async () => {
    const pageSaturation = {
      ...value100,
      [value97.value]: Number(value101.value)
    };
    await value69({
      properties: {
        pageSaturation
      }
    });
    value100 = pageSaturation;
  });
  append29.append(value101, textContent3);
  const value103 = () => value99[value97.value] ?? (value97.value === "overview" ? 0 : canvasWidth.environment?.dimStrength ?? 70);
  Object.assign(value98, {
    name: "i3d-page-dim-strength",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(value103())
  });
  value98.setAttribute("aria-label", "页面压暗强度");
  textContent2.textContent = value98.value + "%";
  value97.addEventListener("change", () => {
    panel.dataset.dimmingPage = value97.value;
    value98.value = String(value103());
    textContent2.textContent = value98.value + "%";
    value101.value = String(value102());
    textContent3.textContent = value101.value + "%";
  });
  value98.addEventListener("input", () => {
    textContent2.textContent = value98.value + "%";
  });
  value98.addEventListener("change", async () => {
    const pageDimStrength = {
      ...value99,
      [value97.value]: Number(value98.value)
    };
    await value69({
      properties: {
        pageDimStrength
      }
    });
    value99 = pageDimStrength;
  });
  const append30 = value67("div", "i3d-page-dim-row");
  const append31 = value67("div", "i3d-vignette-setting");
  append31.append(value98, textContent2);
  append30.append(value97);
  append28.append(append30);
  viewEditing(append28, "整体压暗", append31);
  viewEditing(append28, "饱和度", append29);
  const value104 = value67("input");
  const textContent4 = value67("output");
  const append32 = value67("div", "i3d-vignette-setting");
  Object.assign(value104, {
    name: "i3d-focus-dim-strength",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(canvasWidth.focusDimStrength ?? 15)
  });
  value104.setAttribute("aria-label", "聚焦加深");
  textContent4.textContent = value104.value + "%";
  value104.addEventListener("input", () => {
    textContent4.textContent = value104.value + "%";
  });
  value104.addEventListener("change", () => void value69({
    properties: {
      focusDimStrength: Number(value104.value)
    }
  }));
  append32.append(value104, textContent4);
  viewEditing(append28, "聚焦加深", append32);
  const value105 = value67("section", "inspector-section i3d-finishing-row");
  const append33 = value67("div", "i3d-vignette-setting");
  const addEventListener2 = value67("input");
  const textContent5 = value67("output");
  const value106 = 100 - (Number.isFinite(canvasWidth.popupOpacity) ? Math.max(0, Math.min(100, canvasWidth.popupOpacity)) : 74);
  Object.assign(addEventListener2, {
    name: "i3d-popup-transparency",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(value106)
  });
  addEventListener2.setAttribute("aria-label", "弹窗透明度");
  textContent5.textContent = value106 + "%";
  addEventListener2.addEventListener("input", () => {
    textContent5.textContent = addEventListener2.value + "%";
  });
  addEventListener2.addEventListener("change", () => {
    const value47 = Math.max(0, Math.min(100, Number(addEventListener2.value)));
    if (Number.isFinite(value47)) {
      value69({
        properties: {
          popupOpacity: 100 - value47
        }
      });
    }
  });
  append33.append(addEventListener2, textContent5);
  viewEditing(value105, "弹窗透明度", append33);
  const append34 = value67("div", "i3d-vignette-setting");
  const addEventListener3 = value67("input");
  const textContent6 = value67("output");
  const value107 = Number.isFinite(canvasWidth.focusVignetteStrength) ? Math.max(0, Math.min(60, canvasWidth.focusVignetteStrength)) : 14;
  Object.assign(addEventListener3, {
    name: "i3d-focus-vignette",
    type: "range",
    min: "0",
    max: "60",
    step: "1",
    value: String(value107)
  });
  addEventListener3.setAttribute("aria-label", "聚焦暗角强度");
  textContent6.textContent = value107 + "%";
  addEventListener3.addEventListener("input", () => {
    textContent6.textContent = addEventListener3.value + "%";
  });
  addEventListener3.addEventListener("change", () => void value69({
    properties: {
      focusVignetteStrength: Number(addEventListener3.value)
    }
  }));
  append34.append(addEventListener3, textContent6);
  viewEditing(value105, "聚焦暗角", append34);
  if (positionGrid) {
    for (const querySelectorAll of [reloadBtn, rotationOptions, autoRotateSection, autoRotate, append8, rotationControl, append23, append25, classList6, append28, value105]) {
      for (const disabled2 of querySelectorAll.querySelectorAll("input, select, button")) {
        disabled2.disabled = true;
      }
    }
  }
  for (const classList2 of [append5, append23, reloadBtn, rotationOptions, autoRotateSection, autoRotate, append8, append7, rotationControl, append25]) {
    classList2.classList.add("i3d-inline-section");
  }
  append5.classList.add("i3d-house-section");
  reloadBtn.classList.add("i3d-placement-section");
  rotationControl.classList.add("i3d-light-effects-row");
  value83.parentElement.children[0].hidden = true;
  for (const classList3 of [append14, append18, append20]) {
    classList3.classList.add("i3d-inspector-subsection");
  }
  for (const [classList4, classList5] of [[append18, hidden5], [append20, hidden6]]) {
    classList4.classList.add("i3d-idle-inline");
    classList5.classList.add("i3d-idle-wait");
    classList5.children[0].children[0].textContent = "秒";
  }
  append19.children[0].textContent = "闲置时退出聚焦";
  const append35 = value67("div", "i3d-behavior-row i3d-inspector-subsection");
  append18.classList.remove("i3d-inspector-subsection");
  append14.append(append17);
  append35.append(append18);
  append12.append(append14, append35, append20);
  const value108 = (inspectorGroup, arg30, arg31, arg32 = false) => {
    const dataset5 = value67("details", "i3d-inspector-group");
    dataset5.dataset.inspectorGroup = inspectorGroup;
    dataset5.open = position.get(inspectorGroup) ?? arg32;
    dataset5.append(value67("summary", "", arg30), ...arg31);
    hidden.append(dataset5);
  };
  value108("layout", "户型与布局", [append5, reloadBtn, append23], !canvasWidth.sceneId);
  value108("devices", "设备配置", [rotationOptions, autoRotateSection, autoRotate, append8, append7], true);
  value108("appearance", "画面效果", [rotationControl, append25, append26, classList6, append28, value105]);
  value108("view", "视角与导航", [append9, append11], positionGrid);
  append12.children[0].hidden = true;
  value108("interaction", "交互行为", [append12], true);
  viewEditBtn.refresh();
  callbacks.enhanceControls?.(hidden);
  hidden.style.minHeight = properties;
  if (addSection) {
    panel.scrollTop = appendLabeled;
    if (applyChange) {
      [...hidden.querySelectorAll("input,select")].find(name => name.name === applyChange)?.focus({
        preventScroll: true
      });
    }
  }
  if (!canvasWidth.sceneId && viewEditBtn.state === "idle") {
    returnDefaultToggle();
  }
}
