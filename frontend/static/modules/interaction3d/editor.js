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
  const createEl = (tagName, element2 = "", element3 = "") => {
    const className = document.createElement(tagName);
    className.className = element2;
    className.textContent = element3;
    return className;
  };
  const createInspectorSection = sectionTitle => {
    const append = createEl("section", "inspector-section");
    append.append(createEl("h3", "", sectionTitle));
    hidden.append(append);
    return append;
  };
  const viewEditing = (append2, labelText, controlEl) => {
    const append3 = createEl("label");
    append3.append(createEl("span", "", labelText), controlEl);
    append2.append(append3);
    return controlEl;
  };
  const applyInspectorChange = changePatch => Promise.resolve(callbacks.onChange(changePatch)).catch(topPercent => callbacks.onError?.(topPercent));
  const canvasWidth = component.properties || {};
  const canvasHeight = component.position || {};
  const compWidth = new WeakSet();
  const compHeight = (inputEl, nextInputValue) => {
    inputEl.value = String(nextInputValue);
    compWidth.add(inputEl);
    try {
      inputEl.dispatchEvent?.(new Event("change", {
        bubbles: true
      }));
    } finally {
      compWidth.delete(inputEl);
    }
  };
  const layoutSection = async pendingProperties => (await confirmPerformanceWarning(performanceWarnings(canvasWidth, pendingProperties), {
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
  const canvasWidthPx = Number(addPositionField.width || 2778);
  const canvasHeightPx = Number(addPositionField.height || 1940);
  const sceneCacheKey = Number(canvasHeight.width || 100);
  const sceneLoad = Number(canvasHeight.height || 100);
  const reloadBtn = createInspectorSection("布局与位置");
  const setAttribute2 = createEl("div", "image-layout-options");
  setAttribute2.setAttribute("role", "group");
  setAttribute2.setAttribute("aria-label", "3D 交互布局");
  const disabled4 = canvasWidth.layoutMode === "fill";
  for (const [layoutMode, layoutLabel] of [["free", "自由"], ["fill", "铺满"]]) {
    const layoutBtn = createEl("button", "", layoutLabel);
    layoutBtn.type = "button";
    layoutBtn.dataset.interaction3dLayout = layoutMode;
    const isActiveLayout = (disabled4 ? "fill" : "free") === layoutMode;
    layoutBtn.classList.toggle("active", isActiveLayout);
    layoutBtn.setAttribute("aria-pressed", String(isActiveLayout));
    layoutBtn.addEventListener("click", () => {
      if (!isActiveLayout) {
        applyInspectorChange({
          properties: {
            layoutMode
          }
        });
      }
    });
    setAttribute2.append(layoutBtn);
  }
  const prepareEditorView = createEl("div", "inspector-grid two-columns");
  reloadBtn.append(setAttribute2, prepareEditorView);
  prepareEditorView.hidden = disabled4;
  const addPositionPercentField = (fieldTitle, currentValue, minValue, maxValue, buildPatch) => {
    const valueAsNumber2 = createEl("input");
    Object.assign(valueAsNumber2, {
      name: "i3d-position-" + fieldTitle,
      type: "number",
      min: String(minValue),
      max: String(maxValue),
      step: ".1",
      value: String(Math.round(currentValue * 10) / 10),
      disabled: disabled4
    });
    valueAsNumber2.addEventListener("change", () => {
      if (Number.isFinite(valueAsNumber2.valueAsNumber)) {
        applyInspectorChange(buildPatch(Math.max(minValue, Math.min(maxValue, valueAsNumber2.valueAsNumber))));
      }
    });
    viewEditing(prepareEditorView, fieldTitle, valueAsNumber2);
  };
  addPositionPercentField("左侧（%）", (Number(canvasHeight.x || 0) + sceneCacheKey / 2) / canvasWidthPx * 100, 0, 100, widthPercent => ({
    position: {
      x: widthPercent * canvasWidthPx / 100 - sceneCacheKey / 2
    }
  }));
  addPositionPercentField("顶部（%）", (Number(canvasHeight.y || 0) + sceneLoad / 2) / canvasHeightPx * 100, 0, 100, heightPercent => ({
    position: {
      y: heightPercent * canvasHeightPx / 100 - sceneLoad / 2
    }
  }));
  addPositionPercentField("宽度（%）", sceneCacheKey / canvasWidthPx * 100, 0.1, 100, scalePercent => ({
    position: {
      width: scalePercent * canvasWidthPx / 100
    }
  }));
  addPositionPercentField("高度（%）", sceneLoad / canvasHeightPx * 100, 0.1, 100, rotationDeg => ({
    position: {
      height: rotationDeg * canvasHeightPx / 100
    }
  }));
  addPositionPercentField("缩放（%）", Number(component.style?.scale || 1) * 100, 1, 500, scaleFieldPercent => ({
    style: {
      scale: scaleFieldPercent / 100
    }
  }));
  addPositionPercentField("旋转（°）", Number(canvasHeight.rotation || 0), -360, 360, rotation => ({
    position: {
      rotation
    }
  }));
  const append5 = createInspectorSection("户型");
  const loadScene = createEl("p", "inspector-section-note");
  loadScene.setAttribute("role", "status");
  const houseSectionRef = (callbacks.document?.projectId || "") + "/" + component.id;
  if (!Vt.has(houseSectionRef)) {
    Vt.set(houseSectionRef, {
      state: "idle",
      error: ""
    });
  }
  const viewEditBtn = Vt.get(houseSectionRef);
  const type4 = createEl("button", "", "重新载入户型");
  type4.type = "button";
  const disabled5 = createEl("button", "", "配置灯光");
  disabled5.type = "button";
  const disabled6 = createEl("button", "", "配置空调");
  disabled6.type = "button";
  const disabled7 = createEl("button", "", "配置窗帘");
  disabled7.type = "button";
  const disabled8 = createEl("button", "", "户型渲染");
  disabled8.type = "button";
  const focalInput = async () => {
    callbacks.prepareCanvas?.();
    renderScaleSelect.hidden = false;
    renderScaleSelect.textContent = "正在准备户型…";
    const editorView = await waitInteraction3dEditorView(component.id);
    if (hidden.hidden || hidden.dataset.componentId !== component.id) {
      return null;
    } else {
      renderScaleSelect.hidden = true;
      return editorView;
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
        openInteraction3dAppearanceEditor: openAppearanceEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openAppearanceEditor({
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
  const append6 = createEl("div", "i3d-house-actions");
  append5.append(loadScene, type4, append6);
  const rotationControl = createInspectorSection("灯光效果");
  const rotationOptions = createInspectorSection("灯光");
  rotationOptions.append(disabled5);
  const autoRotateSection = createInspectorSection("环境");
  autoRotateSection.append(disabled6, disabled7);
  const autoRotate = createInspectorSection("设备");
  const autoRotateToggle = createEl("button", "", "配置设备");
  autoRotateToggle.type = "button";
  autoRotate.append(autoRotateToggle);
  autoRotateToggle.addEventListener("click", async () => {
    autoRotateToggle.disabled = true;
    try {
      const {
        openInteraction3dEditor: openDevicesEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openDevicesEditor({
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
    } catch (devicesConfigError) {
      callbacks.onError?.(devicesConfigError);
    } finally {
      autoRotateToggle.disabled = false;
    }
  });
  const append7 = createInspectorSection("安防");
  const disabled9 = createEl("button", "", "配置安防");
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
        openPresenceEditor: openPresenceEditorFn
      } = await import("/api/v1/modules/interaction3d/presence-editor.js?v=20260910-presence-v9");
      await openPresenceEditorFn({
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
    } catch (presenceConfigError) {
      callbacks.onError?.(presenceConfigError);
    } finally {
      disabled9.disabled = false;
    }
  });
  const append8 = createInspectorSection("扫地机");
  const disabled10 = createEl("button", "", "配置扫地机");
  disabled10.type = "button";
  append8.append(disabled10);
  disabled10.addEventListener("click", async () => {
    disabled10.disabled = true;
    try {
      const {
        openInteraction3dEditor: openVacuumEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openVacuumEditor({
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
    } catch (vacuumConfigError) {
      callbacks.onError?.(vacuumConfigError);
    } finally {
      disabled10.disabled = false;
    }
  });
  const disabled11 = createEl("button", "", "快捷指令设置");
  disabled11.type = "button";
  append8.append(disabled11);
  disabled11.addEventListener("click", async () => {
    disabled11.disabled = true;
    try {
      const {
        openInteraction3dEditor: openShortcutEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openShortcutEditor({
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
    } catch (shortcutConfigError) {
      callbacks.onError?.(shortcutConfigError);
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
        openInteraction3dEditor: openClimateEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openClimateEditor({
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
    } catch (climateConfigError) {
      callbacks.onError?.(climateConfigError);
    } finally {
      disabled5.disabled = false;
    }
  });
  disabled6.addEventListener("click", async () => {
    disabled6.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: openTelevisionEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openTelevisionEditor({
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
    } catch (televisionConfigError) {
      callbacks.onError?.(televisionConfigError);
    } finally {
      disabled6.disabled = false;
    }
  });
  disabled7.addEventListener("click", async () => {
    disabled7.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: openNasEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1");
      await openNasEditor({
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
    } catch (nasConfigError) {
      callbacks.onError?.(nasConfigError);
    } finally {
      disabled7.disabled = false;
    }
  });
  const append9 = createInspectorSection("楼层视角");
  const viewFloorRow = createEl("div", "i3d-view-floor-row");
  append9.append(viewFloorRow);
  const viewFloorSelect = createEl("select");
  viewFloorSelect.name = "i3d-view-floor";
  viewFloorSelect.disabled = positionGrid;
  viewEditing(viewFloorRow, "视角楼层", viewFloorSelect);
  const disabled12 = createEl("input");
  Object.assign(disabled12, {
    name: "i3d-floor-gap",
    type: "number",
    min: "0",
    max: "20",
    step: "0.1",
    value: String(canvasWidth.floorGap ?? metadata3?.metadata?.floorGap ?? 3)
  });
  viewEditing(viewFloorRow, "楼层间距（m）", disabled12);
  disabled12.disabled = canvasWidth.floorSelection !== "all";
  disabled12.addEventListener("change", () => {
    if (!disabled12.disabled) {
      if (Number.isFinite(disabled12.valueAsNumber)) {
        const floorGap = Math.max(0, Math.min(20, disabled12.valueAsNumber));
        disabled12.value = String(floorGap);
        applyInspectorChange({
          properties: {
            floorGap
          }
        });
      } else {
        disabled12.value = String(canvasWidth.floorGap ?? metadata3?.metadata?.floorGap ?? 3);
      }
    }
  });
  const append10 = createEl("div", "i3d-floor-number-group");
  append10.append(createEl("span", "i3d-floor-number-title", "楼层编号"));
  const idleIconsGrid = createEl("div", "i3d-floor-number-fields");
  append10.append(idleIconsGrid);
  append9.append(append10);
  const idleSecondsInput = length => {
    idleIconsGrid.replaceChildren();
    append10.hidden = !length.length;
    for (const [floorIndex, id2] of length.entries()) {
      const floorId = id2.id;
      const floorName = id2.name || "未命名楼层";
      const floorNumber = canvasWidth.floorNumbers?.[floorId] ?? id2.number ?? floorIndex + 1;
      const floorNumberInput = createEl("input");
      Object.assign(floorNumberInput, {
        type: "number",
        min: "-99",
        max: "99",
        step: "1",
        value: String(floorNumber),
        name: "i3d-floor-number-" + floorId,
        title: "负数为地下层，1 为一层",
        disabled: positionGrid
      });
      viewEditing(idleIconsGrid, floorName, floorNumberInput);
      let previousFloorNumber = floorNumber;
      floorNumberInput.addEventListener("change", async () => {
        let nextFloorNumber = floorNumberInput.valueAsNumber;
        if (nextFloorNumber === 0) {
          nextFloorNumber = previousFloorNumber < 0 ? 1 : -1;
        }
        if (!Number.isInteger(nextFloorNumber) || nextFloorNumber < -99 || nextFloorNumber > 99) {
          floorNumberInput.value = String(previousFloorNumber);
          return;
        }
        const floorNumbers = {
          ...canvasWidth.floorNumbers,
          [floorId]: nextFloorNumber
        };
        floorNumberInput.disabled = true;
        try {
          await callbacks.onChange({
            properties: {
              floorNumbers
            }
          });
          canvasWidth.floorNumbers = floorNumbers;
          previousFloorNumber = nextFloorNumber;
          floorNumberInput.value = String(nextFloorNumber);
        } catch (value) {
          floorNumberInput.value = String(previousFloorNumber);
          callbacks.onError?.(value);
        } finally {
          floorNumberInput.disabled = positionGrid;
        }
      });
    }
  };
  const displaySection = metadata2 => {
    if (!viewFloorSelect.isConnected) {
      return;
    }
    const length2 = metadata2?.metadata?.floors || [];
    idleSecondsInput(length2);
    if (canvasWidth.floorGap === undefined && Number.isFinite(metadata2?.metadata?.floorGap)) {
      disabled12.value = String(metadata2.metadata.floorGap);
    }
    viewFloorSelect.replaceChildren();
    const viewFloorOptions = length2.length ? [...(length2.length > 1 ? [["all", "全部楼层"]] : []), ...length2.map(id => [id.id, id.name || "未命名楼层"])] : [[canvasWidth.floorSelection || "all", "当前楼层"]];
    for (const [element, floorOptionLabel] of viewFloorOptions) {
      const floorOption = createEl("option", "", floorOptionLabel);
      floorOption.value = element;
      viewFloorSelect.append(floorOption);
    }
    viewFloorSelect.value = canvasWidth.floorSelection || viewFloorOptions[0][0];
    disabled12.disabled = viewFloorSelect.value !== "all" || length2.length < 2;
    viewFloorSelect.disabled = positionGrid || length2.length < 2;
  };
  displaySection(metadata3);
  if (canvasWidth.sceneId && !metadata3?.metadata?.floors?.length && typeof waitInteraction3dEditorView == "function") {
    waitInteraction3dEditorView(component.id).then(displaySection).catch(() => {});
  }
  viewFloorSelect.addEventListener("change", async () => {
    if (positionGrid) {
      return;
    }
    const floorSelection = viewFloorSelect.value;
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
    await applyInspectorChange({
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
  const disabled13 = createEl("button", positionGrid ? "primary" : "", positionGrid ? "完成并固定" : "调整户型视角");
  disabled13.type = "button";
  disabled13.disabled = !canvasWidth.sceneId;
  disabled13.setAttribute("aria-pressed", String(positionGrid));
  const type5 = createEl("button", "", "取消本次调整");
  type5.type = "button";
  type5.hidden = !positionGrid;
  const renderScaleSelect = createEl("p", "inspector-section-note");
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
          [canvasWidth.floorSelection || viewFloorSelect.value]: camera
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
  const hidden2 = createEl("div", "i3d-view-options");
  hidden2.hidden = !positionGrid;
  append9.append(hidden2);
  const popupTransparencyInput = metadata3?.viewCamera || canvasWidth.camera || {};
  const popupTransparencyOutput = async (viewCommandKey, viewCommandValue) => {
    try {
      const viewEditing2 = getInteraction3dEditorView(component.id);
      if (!viewEditing2?.viewEditing) {
        return;
      }
      await viewEditing2.viewCommand(viewCommandKey, viewCommandValue);
      renderInteraction3dInspector(panel, component, callbacks);
    } catch (message3) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = message3.message;
    }
  };
  ((segmentTitle, viewCommandName, segmentOptions, selectedSegment) => {
    const append4 = createEl("div", "navigation-property-control");
    const setAttribute = createEl("div", "navigation-segmented-options");
    setAttribute.setAttribute("role", "group");
    setAttribute.setAttribute("aria-label", "3D " + segmentTitle);
    for (const [segmentValue, segmentLabel] of segmentOptions) {
      const type = createEl("button", "", segmentLabel);
      type.type = "button";
      type.disabled = !positionGrid;
      type.classList.toggle("active", segmentValue === selectedSegment);
      type.setAttribute("aria-pressed", String(segmentValue === selectedSegment));
      type.addEventListener("click", () => void popupTransparencyOutput(viewCommandName, segmentValue));
      setAttribute.append(type);
    }
    append4.append(createEl("span", "", segmentTitle), setAttribute);
    hidden2.append(append4);
  })("投影", "projection", [["orthographic", "正交"], ["perspective", "透视"]], popupTransparencyInput.mode || "orthographic");
  const popupTransparency = createEl("input");
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
  const append11 = createInspectorSection("导航位置");
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
    const rotBtn = createEl("div", "i3d-finishing-row");
    append11.append(rotBtn);
    for (const [navAxis, navAxisLabel] of [["x", "横向"], ["y", "纵向"]]) {
      const valueAsNumber = createEl("input");
      Object.assign(valueAsNumber, {
        name: "i3d-navigation-" + rotMode + "-" + navAxis,
        type: "number",
        min: "0",
        max: "100",
        step: "1",
        value: String(vignetteInput[rotMode][navAxis]),
        disabled: positionGrid
      });
      valueAsNumber.addEventListener("change", () => {
        if (!positionGrid) {
          if (Number.isFinite(valueAsNumber.valueAsNumber)) {
            vignetteInput[rotMode][navAxis] = Math.max(0, Math.min(100, valueAsNumber.valueAsNumber));
            applyInspectorChange({
              properties: {
                navigation: structuredClone(vignetteInput)
              }
            });
          }
          valueAsNumber.value = String(vignetteInput[rotMode][navAxis]);
        }
      });
      viewEditing(rotBtn, "" + rotLabel + navAxisLabel + "（%）", valueAsNumber);
      vignetteOutput.push([valueAsNumber, rotMode, navAxis]);
    }
  }
  const type6 = createEl("button", "secondary-button", "恢复默认位置");
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
      for (const [vignetteInputEl, vignetteGroupKey, vignetteFieldKey] of vignetteOutput) {
        vignetteInputEl.value = String(vignetteInput[vignetteGroupKey][vignetteFieldKey]);
      }
      applyInspectorChange({
        properties: {
          navigation: structuredClone(vignetteInput)
        }
      });
    }
  });
  append11.append(type6);
  const append12 = createInspectorSection("交互行为");
  let vignetteStrength = canvasWidth.behaviorScope === "page" ? "page" : "global";
  const behaviorPageOptions = [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]];
  let element8 = panel.dataset.behaviorPage || "overview";
  let pageBehaviors = structuredClone(canvasWidth.pageBehaviors || {});
  let behaviorDocument = {
    ...canvasWidth,
    pageBehaviors
  };
  const currentPageBehavior = () => resolvePageBehavior({
    ...behaviorDocument,
    behaviorScope: vignetteStrength,
    pageBehaviors
  }, element8);
  const isPageBehaviorEnabled = behaviorFlag => behaviorFlag === "hideIconsWhileRotating" ? currentPageBehavior()[behaviorFlag] : currentPageBehavior()[behaviorFlag].enabled;
  const vignetteInput2 = createEl("div", "i3d-behavior-scope-row");
  const popupTransparencyInput2 = createEl("select");
  const behaviorPageSelect = createEl("select");
  Object.assign(popupTransparencyInput2, {
    name: "i3d-behavior-scope",
    disabled: positionGrid
  });
  popupTransparencyInput2.setAttribute("aria-label", "交互行为设置范围");
  for (const [dirValue, dirLabel] of [["global", "全部页面"], ["page", "单页面"]]) {
    const dirBtn = createEl("option", "", dirLabel);
    dirBtn.value = dirValue;
    popupTransparencyInput2.append(dirBtn);
  }
  popupTransparencyInput2.value = vignetteStrength;
  Object.assign(behaviorPageSelect, {
    name: "i3d-behavior-page",
    disabled: positionGrid
  });
  behaviorPageSelect.setAttribute("aria-label", "交互设置页面");
  for (const [bgVisible, bgLabel] of behaviorPageOptions) {
    const behaviorPageOption = createEl("option", "", bgLabel);
    behaviorPageOption.value = bgVisible;
    behaviorPageSelect.append(behaviorPageOption);
  }
  behaviorPageSelect.value = element8;
  const hidden3 = createEl("div");
  hidden3.append(behaviorPageSelect);
  hidden3.hidden = vignetteStrength !== "page";
  vignetteInput2.append(popupTransparencyInput2, hidden3);
  append12.append(vignetteInput2);
  append12.append(createEl("p", "inspector-section-note", "以下设置统一应用于所选范围；单页面未单独设置的参数沿用全部页面。"));
  const updatePageBehavior = (behaviorName, behaviorUpdate) => {
    if (!positionGrid) {
      if (vignetteStrength === "page") {
        const enabled = pageBehaviors[element8]?.[behaviorName];
        const behaviorValue = typeof behaviorUpdate == "boolean" ? behaviorUpdate : {
          ...(typeof enabled == "boolean" ? {
            enabled
          } : enabled || {}),
          ...behaviorUpdate
        };
        pageBehaviors = {
          ...pageBehaviors,
          [element8]: {
            ...pageBehaviors[element8],
            [behaviorName]: behaviorValue
          }
        };
        applyInspectorChange({
          properties: {
            pageBehaviors
          }
        });
      } else {
        const behaviorPatch = typeof behaviorUpdate == "boolean" ? behaviorUpdate : {
          ...resolvePageBehavior({
            ...behaviorDocument,
            behaviorScope: "global"
          })[behaviorName],
          ...behaviorUpdate
        };
        behaviorDocument = {
          ...behaviorDocument,
          [behaviorName]: behaviorPatch
        };
        applyInspectorChange({
          properties: {
            [behaviorName]: behaviorPatch
          }
        });
      }
    }
  };
  const setPageBehaviorEnabled = (behaviorKey, enabled2) => updatePageBehavior(behaviorKey, behaviorKey === "hideIconsWhileRotating" ? enabled2 : {
    enabled: enabled2
  });
  popupTransparencyInput2.addEventListener("change", () => {
    if (!positionGrid) {
      vignetteStrength = popupTransparencyInput2.value;
      syncAutoRotateControls();
      applyInspectorChange({
        properties: {
          behaviorScope: vignetteStrength,
          ...(vignetteStrength === "page" ? {
            pageBehaviors
          } : {})
        }
      });
    }
  });
  behaviorPageSelect.addEventListener("change", () => {
    element8 = behaviorPageSelect.value;
    panel.dataset.behaviorPage = element8;
    syncAutoRotateControls();
  });
  const append13 = createEl("div", "navigation-property-control");
  const setAttribute3 = createEl("div", "navigation-segmented-options three-columns");
  setAttribute3.setAttribute("role", "group");
  setAttribute3.setAttribute("aria-label", "3D 旋转方式");
  for (const [scaleValue, scaleLabel] of [["free", "自由"], ["horizontal", "仅左右"], ["vertical", "仅上下"]]) {
    const scaleOption = createEl("button", "", scaleLabel);
    scaleOption.type = "button";
    scaleOption.disabled = positionGrid;
    scaleOption.dataset.rotationMode = scaleValue;
    const isRotationModeActive = currentPageBehavior().interaction.rotationMode === scaleValue;
    scaleOption.classList.toggle("active", isRotationModeActive);
    scaleOption.setAttribute("aria-pressed", String(isRotationModeActive));
    scaleOption.addEventListener("click", () => {
      updatePageBehavior("interaction", {
        rotationMode: scaleValue
      });
      syncAutoRotateControls();
    });
    setAttribute3.append(scaleOption);
  }
  append13.append(createEl("span", "", "旋转方式"), setAttribute3);
  append12.append(append13);
  const append14 = createInspectorSection("自动旋转");
  const enabled3 = {
    ...currentPageBehavior().autoRotate
  };
  const append15 = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checked = createEl("input");
  Object.assign(checked, {
    name: "i3d-auto-rotate-enabled",
    type: "checkbox",
    checked: enabled3.enabled,
    disabled: positionGrid
  });
  append15.append(createEl("span", "", "开启自动旋转"), checked);
  const hidden4 = createEl("div", "inspector-grid two-columns");
  hidden4.hidden = !enabled3.enabled;
  const append16 = createEl("div", "i3d-auto-rotate-row");
  const setAttribute4 = createEl("div", "navigation-segmented-options");
  setAttribute4.setAttribute("role", "group");
  setAttribute4.setAttribute("aria-label", "自动旋转方向");
  for (const [direction, directionLabel] of [["clockwise", "顺时针"], ["counterclockwise", "逆时针"]]) {
    const type2 = createEl("button", "", directionLabel);
    type2.type = "button";
    type2.disabled = positionGrid;
    type2.dataset.direction = direction;
    type2.classList.toggle("active", enabled3.direction === direction);
    type2.setAttribute("aria-pressed", String(enabled3.direction === direction));
    type2.addEventListener("click", () => {
      if (!positionGrid && enabled3.direction !== direction) {
        enabled3.direction = direction;
        for (const classList of setAttribute4.children) {
          const isDirectionPressed = classList === type2;
          classList.classList.toggle("active", isDirectionPressed);
          classList.setAttribute("aria-pressed", String(isDirectionPressed));
        }
        updatePageBehavior("autoRotate", {
          direction: enabled3.direction
        });
      }
    });
    setAttribute4.append(type2);
  }
  append16.append(append15, setAttribute4);
  append14.append(append16, hidden4);
  const addAutoRotateNumberField = (fieldLabel, fieldKey, fieldMin, fieldMax, fieldStep) => {
    const addEventListener = createEl("input");
    Object.assign(addEventListener, {
      type: "number",
      min: String(fieldMin),
      max: String(fieldMax),
      step: String(fieldStep),
      name: "i3d-auto-rotate-" + fieldKey,
      value: String(enabled3[fieldKey]),
      disabled: positionGrid || !enabled3.enabled
    });
    addEventListener.addEventListener("change", () => {
      const autoRotateFieldValue = addEventListener.valueAsNumber;
      if (Number.isFinite(autoRotateFieldValue)) {
        enabled3[fieldKey] = Math.max(fieldMin, Math.min(fieldMax, fieldKey === "idleSeconds" ? Math.round(autoRotateFieldValue) : autoRotateFieldValue));
        updatePageBehavior("autoRotate", {
          [fieldKey]: enabled3[fieldKey]
        });
      }
      addEventListener.value = String(enabled3[fieldKey]);
    });
    viewEditing(hidden4, fieldLabel, addEventListener);
  };
  addAutoRotateNumberField("等待时间（秒）", "idleSeconds", 1, 3600, 1);
  addAutoRotateNumberField("旋转速度（°/秒）", "speed", 0.5, 30, 0.5);
  const append17 = createEl("label", "i3d-setting-toggle i3d-view-toggle i3d-return-default");
  const disabled14 = createEl("input");
  Object.assign(disabled14, {
    name: "i3d-auto-rotate-return-default",
    type: "checkbox",
    checked: enabled3.returnToDefault,
    disabled: positionGrid || !enabled3.enabled
  });
  append17.append(createEl("span", "", "旋转前回到默认视角"), disabled14);
  disabled14.addEventListener("change", () => {
    if (!disabled14.disabled) {
      enabled3.returnToDefault = disabled14.checked;
      updatePageBehavior("autoRotate", {
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
      setPageBehaviorEnabled("autoRotate", enabled3.enabled);
    }
  });
  const append18 = createInspectorSection("闲置退出聚焦");
  const enabled4 = {
    ...currentPageBehavior().idleExitFocus
  };
  const append19 = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checked2 = createEl("input");
  Object.assign(checked2, {
    name: "i3d-idle-exit-enabled",
    type: "checkbox",
    checked: enabled4.enabled,
    disabled: positionGrid
  });
  append19.append(createEl("span", "", "无操作时自动退出"), checked2);
  const hidden5 = createEl("div", "inspector-grid");
  hidden5.hidden = !enabled4.enabled;
  const disabled15 = createEl("input");
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
        updatePageBehavior("idleExitFocus", {
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
      setPageBehaviorEnabled("idleExitFocus", enabled4.enabled);
    }
  });
  append18.append(append19, hidden5);
  const append20 = createInspectorSection("图标显示");
  append20.classList.add("i3d-icon-visibility-row");
  const enabled5 = {
    ...currentPageBehavior().idleHideIcons
  };
  const append21 = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checked3 = createEl("input");
  Object.assign(checked3, {
    name: "i3d-idle-icons-enabled",
    type: "checkbox",
    checked: enabled5.enabled,
    disabled: positionGrid
  });
  append21.append(createEl("span", "", "闲置后隐藏图标"), checked3);
  const hidden6 = createEl("div", "inspector-grid");
  hidden6.hidden = !enabled5.enabled;
  const valueAsNumber3 = createEl("input");
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
      updatePageBehavior("idleHideIcons", {
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
      setPageBehaviorEnabled("idleHideIcons", enabled5.enabled);
    }
  });
  append20.append(append21, hidden6);
  const append22 = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checked4 = createEl("input");
  Object.assign(checked4, {
    type: "checkbox",
    name: "i3d-hide-icons-rotating",
    checked: isPageBehaviorEnabled("hideIconsWhileRotating"),
    disabled: positionGrid
  });
  checked4.addEventListener("change", () => setPageBehaviorEnabled("hideIconsWhileRotating", checked4.checked));
  append22.append(createEl("span", "", "旋转时隐藏图标"), checked4);
  append20.append(append22);
  function syncAutoRotateControls() {
    hidden3.hidden = vignetteStrength !== "page";
    const autoRotate2 = currentPageBehavior();
    Object.assign(enabled3, autoRotate2.autoRotate);
    Object.assign(enabled4, autoRotate2.idleExitFocus);
    Object.assign(enabled5, autoRotate2.idleHideIcons);
    for (const dataset3 of setAttribute3.children) {
      const isRotationModeSelected = dataset3.dataset.rotationMode === autoRotate2.interaction.rotationMode;
      dataset3.classList.toggle("active", isRotationModeSelected);
      dataset3.setAttribute("aria-pressed", String(isRotationModeSelected));
    }
    for (const dataset4 of setAttribute4.children) {
      const isDirectionActive = dataset4.dataset.direction === enabled3.direction;
      dataset4.classList.toggle("active", isDirectionActive);
      dataset4.setAttribute("aria-pressed", String(isDirectionActive));
    }
    for (const autoRotateInput of hidden4.querySelectorAll("input")) {
      autoRotateInput.value = String(enabled3[autoRotateInput.name.replace("i3d-auto-rotate-", "")]);
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
    enabled5.enabled = isPageBehaviorEnabled("idleHideIcons");
    checked3.checked = enabled5.enabled;
    hidden6.hidden = !enabled5.enabled;
    valueAsNumber3.disabled = positionGrid || !enabled5.enabled;
    checked4.checked = isPageBehaviorEnabled("hideIconsWhileRotating");
  }
  const append23 = createInspectorSection("画面显示");
  let element9 = normalizeInteraction3dLightingMode(canvasWidth.lightingMode);
  const lightingModeSelect = createEl("select");
  lightingModeSelect.name = "i3d-lighting-mode";
  lightingModeSelect.setAttribute("aria-label", "灯光模式");
  for (const [element4, lightingModeLabel] of INTERACTION3D_LIGHTING_MODES) {
    const lightingModeOption = createEl("option", "", lightingModeLabel);
    lightingModeOption.value = element4;
    lightingModeSelect.append(lightingModeOption);
  }
  lightingModeSelect.value = element9;
  viewEditing(rotationControl, "灯光模式", lightingModeSelect);
  lightingModeSelect.addEventListener("change", async () => {
    if (compWidth.has(lightingModeSelect)) {
      return;
    }
    const lightingMode = normalizeInteraction3dLightingMode(lightingModeSelect.value);
    compHeight(lightingModeSelect, element9);
    lightingModeSelect.disabled = true;
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
      compHeight(lightingModeSelect, lightingMode);
    } catch (lightingError) {
      lightingModeSelect.value = element9;
      callbacks.onError?.(lightingError);
    } finally {
      lightingModeSelect.disabled = positionGrid;
    }
  });
  rotationControl.append(disabled8);
  const append24 = createEl("div", "navigation-property-control");
  const setAttribute5 = createEl("div", "navigation-segmented-options");
  setAttribute5.setAttribute("role", "group");
  setAttribute5.setAttribute("aria-label", "户型底图");
  for (const [backgroundVisible, backgroundVisibleLabel] of [[true, "显示"], [false, "隐藏"]]) {
    const type3 = createEl("button", "", backgroundVisibleLabel);
    type3.type = "button";
    const isBackgroundVisibleActive = canvasWidth.backgroundVisible !== false === backgroundVisible;
    type3.classList.toggle("active", isBackgroundVisibleActive);
    type3.setAttribute("aria-pressed", String(isBackgroundVisibleActive));
    type3.addEventListener("click", () => {
      if (!isBackgroundVisibleActive) {
        applyInspectorChange({
          properties: {
            backgroundVisible
          }
        });
      }
    });
    setAttribute5.append(type3);
  }
  append24.append(createEl("span", "", "户型底图"), setAttribute5);
  append23.append(append24);
  const renderScaleSelectEl = createEl("select");
  renderScaleSelectEl.name = "i3d-render-scale";
  for (const [renderScaleValue, renderScaleLabel] of [[1.5, "高清 150%"], [1, "标准 100%"], [0.8, "均衡 80%"], [0.75, "均衡 75%"], [0.5, "流畅 50%"], [0.25, "低负载 25%"]]) {
    const renderScaleOption = createEl("option", "", renderScaleLabel);
    renderScaleOption.value = String(renderScaleValue);
    renderScaleSelectEl.append(renderScaleOption);
  }
  const append25 = createInspectorSection("渲染分辨率");
  renderScaleSelectEl.setAttribute("aria-label", "渲染分辨率");
  renderScaleSelectEl.value = String(canvasWidth.renderScale ?? 1);
  renderScaleSelectEl.addEventListener("change", async () => {
    if (compWidth.has(renderScaleSelectEl)) {
      return;
    }
    const renderScale = Number(renderScaleSelectEl.value);
    const currentRenderScale = canvasWidth.renderScale ?? 1;
    compHeight(renderScaleSelectEl, currentRenderScale);
    renderScaleSelectEl.disabled = true;
    try {
      if (await layoutSection({
        renderScale
      })) {
        await applyInspectorChange({
          properties: {
            renderScale
          }
        });
      }
    } finally {
      renderScaleSelectEl.disabled = positionGrid;
    }
  });
  append25.append(renderScaleSelectEl);
  renderScaleSelectEl.title = "画面卡顿时，可降低渲染分辨率。";
  const append26 = createInspectorSection("转动分辨率");
  const motionScaleGrid = createEl("div", "inspector-grid two-columns");
  const disabled16 = createEl("select");
  const disabled17 = createEl("input");
  let currentMotionScale = typeof canvasWidth.motionRenderScale == "number" && Number.isFinite(canvasWidth.motionRenderScale) ? Math.max(0.25, Math.min(1, canvasWidth.motionRenderScale)) : null;
  let customMotionScale = currentMotionScale ?? 0.75;
  for (const [element5, motionModeLabel] of [["auto", "自动"], ["custom", "自定义"]]) {
    const motionModeOption = createEl("option", "", motionModeLabel);
    motionModeOption.value = element5;
    disabled16.append(motionModeOption);
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
  const syncMotionScaleControls = () => {
    compHeight(disabled16, currentMotionScale === null ? "auto" : "custom");
    disabled16.disabled = positionGrid;
    disabled17.disabled = positionGrid || currentMotionScale === null;
    disabled17.value = String(Math.round(customMotionScale * 100));
  };
  const commitMotionRenderScale = async motionRenderScale => {
    disabled16.disabled = disabled17.disabled = true;
    try {
      if (await layoutSection({
        motionRenderScale
      })) {
        await applyInspectorChange({
          properties: {
            motionRenderScale
          }
        });
        currentMotionScale = motionRenderScale;
        if (motionRenderScale !== null) {
          customMotionScale = motionRenderScale;
        }
      }
    } catch (backgroundError) {
      callbacks.onError?.(backgroundError);
    } finally {
      syncMotionScaleControls();
    }
  };
  disabled16.addEventListener("change", () => {
    if (!compWidth.has(disabled16) && !disabled16.disabled) {
      commitMotionRenderScale(disabled16.value === "auto" ? null : customMotionScale);
    }
  });
  disabled17.addEventListener("change", () => {
    if (disabled17.disabled) {
      return;
    }
    const parsedMotionPercent = disabled17.value.trim() === "" ? NaN : Number(disabled17.value);
    if (!Number.isFinite(parsedMotionPercent)) {
      syncMotionScaleControls();
      return;
    }
    commitMotionRenderScale(Math.max(25, Math.min(100, Math.round(parsedMotionPercent))) / 100);
  });
  viewEditing(motionScaleGrid, "调整方式", disabled16);
  viewEditing(motionScaleGrid, "转动比例（%）", disabled17);
  append26.append(motionScaleGrid);
  syncMotionScaleControls();
  const motionScaleNote = createEl("p", "inspector-section-note", "按静止分辨率计算，停止转动后恢复。100% 不降清晰度。");
  append26.append(motionScaleNote);
  const classList6 = createInspectorSection("地面反射");
  classList6.classList.add("i3d-reflection-section");
  let mode = normalizeGroundReflection(canvasWidth.groundReflection);
  const reflectionModeSelect = createEl("select");
  const reflectionResolutionSelect = createEl("select");
  reflectionModeSelect.name = "i3d-reflection-mode";
  reflectionModeSelect.setAttribute("aria-label", "地面反射范围");
  reflectionResolutionSelect.name = "i3d-reflection-resolution";
  reflectionResolutionSelect.setAttribute("aria-label", "反射清晰度");
  for (const [element6, reflectionModeLabel] of [["off", "关闭"], ["inside", "室内"], ["outside", "室外"], ["all", "室内＋室外"]]) {
    const reflectionModeOption = createEl("option", "", reflectionModeLabel);
    reflectionModeOption.value = element6;
    reflectionModeSelect.append(reflectionModeOption);
  }
  for (const [reflectionResValue, reflectionResLabel] of [[256, "低"], [512, "中"], [768, "高"]]) {
    const reflectionResOption = createEl("option", "", reflectionResLabel);
    reflectionResOption.value = String(reflectionResValue);
    reflectionResolutionSelect.append(reflectionResOption);
  }
  reflectionModeSelect.value = mode.mode;
  reflectionResolutionSelect.value = String(mode.resolution);
  const reflectionOptionsRow = createEl("div", "i3d-reflection-options");
  viewEditing(reflectionOptionsRow, "范围", reflectionModeSelect);
  viewEditing(reflectionOptionsRow, "清晰度", reflectionResolutionSelect);
  const append27 = createEl("div", "i3d-vignette-setting");
  const reflectionStrengthInput = createEl("input");
  const textContent = createEl("output");
  Object.assign(reflectionStrengthInput, {
    name: "i3d-reflection-strength",
    type: "range",
    min: "0",
    max: "45",
    step: "1",
    value: String(Math.round(mode.strength * 100))
  });
  reflectionStrengthInput.setAttribute("aria-label", "反射强度");
  textContent.textContent = reflectionStrengthInput.value + "%";
  append27.append(reflectionStrengthInput, textContent);
  classList6.append(reflectionOptionsRow);
  viewEditing(classList6, "强度", append27);
  const syncReflectionControls = () => {
    reflectionResolutionSelect.disabled = reflectionStrengthInput.disabled = positionGrid || mode.mode === "off";
  };
  const commitReflectionSettings = async target => {
    if (compWidth.has(target?.target)) {
      return;
    }
    const groundReflection = normalizeGroundReflection({
      mode: reflectionModeSelect.value,
      resolution: Number(reflectionResolutionSelect.value),
      strength: Number(reflectionStrengthInput.value) / 100
    });
    compHeight(reflectionModeSelect, mode.mode);
    compHeight(reflectionResolutionSelect, mode.resolution);
    reflectionStrengthInput.value = String(Math.round(mode.strength * 100));
    textContent.textContent = reflectionStrengthInput.value + "%";
    reflectionModeSelect.disabled = reflectionResolutionSelect.disabled = reflectionStrengthInput.disabled = true;
    try {
      if (!(await layoutSection({
        groundReflection
      }))) {
        return;
      }
      await applyInspectorChange({
        properties: {
          groundReflection: {
            ...groundReflection
          }
        }
      });
    } finally {
      reflectionModeSelect.disabled = positionGrid;
      syncReflectionControls();
    }
  };
  reflectionModeSelect.addEventListener("change", commitReflectionSettings);
  reflectionResolutionSelect.addEventListener("change", commitReflectionSettings);
  reflectionStrengthInput.addEventListener("input", () => {
    textContent.textContent = reflectionStrengthInput.value + "%";
  });
  reflectionStrengthInput.addEventListener("change", commitReflectionSettings);
  syncReflectionControls();
  const append28 = createEl("section", "inspector-section i3d-page-dimming");
  append28.append(createEl("h3", "", "画面压暗"));
  const dimPageSelect = createEl("select");
  const pageDimInput = createEl("input");
  const textContent2 = createEl("output");
  dimPageSelect.name = "i3d-dim-page";
  dimPageSelect.setAttribute("aria-label", "压暗页面");
  for (const [element7, dimPageLabel] of [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]]) {
    const dimPageOption = createEl("option", "", dimPageLabel);
    dimPageOption.value = element7;
    dimPageSelect.append(dimPageOption);
  }
  dimPageSelect.value = panel.dataset.dimmingPage || "light";
  let dimStrengthByPage = {
    ...canvasWidth.pageDimStrength
  };
  let saturationByPage = {
    ...canvasWidth.pageSaturation
  };
  const pageSaturationInput = createEl("input");
  const textContent3 = createEl("output");
  const append29 = createEl("div", "i3d-vignette-setting");
  const currentPageSaturation = () => saturationByPage[dimPageSelect.value] ?? (dimPageSelect.value === "overview" ? 100 : 75);
  Object.assign(pageSaturationInput, {
    name: "i3d-page-saturation",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(currentPageSaturation())
  });
  pageSaturationInput.setAttribute("aria-label", "页面饱和度");
  textContent3.textContent = pageSaturationInput.value + "%";
  pageSaturationInput.addEventListener("input", () => {
    textContent3.textContent = pageSaturationInput.value + "%";
  });
  pageSaturationInput.addEventListener("change", async () => {
    const pageSaturation = {
      ...saturationByPage,
      [dimPageSelect.value]: Number(pageSaturationInput.value)
    };
    await applyInspectorChange({
      properties: {
        pageSaturation
      }
    });
    saturationByPage = pageSaturation;
  });
  append29.append(pageSaturationInput, textContent3);
  const currentPageDimStrength = () => dimStrengthByPage[dimPageSelect.value] ?? (dimPageSelect.value === "overview" ? 0 : canvasWidth.environment?.dimStrength ?? 70);
  Object.assign(pageDimInput, {
    name: "i3d-page-dim-strength",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(currentPageDimStrength())
  });
  pageDimInput.setAttribute("aria-label", "页面压暗强度");
  textContent2.textContent = pageDimInput.value + "%";
  dimPageSelect.addEventListener("change", () => {
    panel.dataset.dimmingPage = dimPageSelect.value;
    pageDimInput.value = String(currentPageDimStrength());
    textContent2.textContent = pageDimInput.value + "%";
    pageSaturationInput.value = String(currentPageSaturation());
    textContent3.textContent = pageSaturationInput.value + "%";
  });
  pageDimInput.addEventListener("input", () => {
    textContent2.textContent = pageDimInput.value + "%";
  });
  pageDimInput.addEventListener("change", async () => {
    const pageDimStrength = {
      ...dimStrengthByPage,
      [dimPageSelect.value]: Number(pageDimInput.value)
    };
    await applyInspectorChange({
      properties: {
        pageDimStrength
      }
    });
    dimStrengthByPage = pageDimStrength;
  });
  const append30 = createEl("div", "i3d-page-dim-row");
  const append31 = createEl("div", "i3d-vignette-setting");
  append31.append(pageDimInput, textContent2);
  append30.append(dimPageSelect);
  append28.append(append30);
  viewEditing(append28, "整体压暗", append31);
  viewEditing(append28, "饱和度", append29);
  const focusDimInput = createEl("input");
  const textContent4 = createEl("output");
  const append32 = createEl("div", "i3d-vignette-setting");
  Object.assign(focusDimInput, {
    name: "i3d-focus-dim-strength",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(canvasWidth.focusDimStrength ?? 15)
  });
  focusDimInput.setAttribute("aria-label", "聚焦加深");
  textContent4.textContent = focusDimInput.value + "%";
  focusDimInput.addEventListener("input", () => {
    textContent4.textContent = focusDimInput.value + "%";
  });
  focusDimInput.addEventListener("change", () => void applyInspectorChange({
    properties: {
      focusDimStrength: Number(focusDimInput.value)
    }
  }));
  append32.append(focusDimInput, textContent4);
  viewEditing(append28, "聚焦加深", append32);
  const finishingSection = createEl("section", "inspector-section i3d-finishing-row");
  const append33 = createEl("div", "i3d-vignette-setting");
  const addEventListener2 = createEl("input");
  const textContent5 = createEl("output");
  const popupTransparencyPercent = 100 - (Number.isFinite(canvasWidth.popupOpacity) ? Math.max(0, Math.min(100, canvasWidth.popupOpacity)) : 74);
  Object.assign(addEventListener2, {
    name: "i3d-popup-transparency",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(popupTransparencyPercent)
  });
  addEventListener2.setAttribute("aria-label", "弹窗透明度");
  textContent5.textContent = popupTransparencyPercent + "%";
  addEventListener2.addEventListener("input", () => {
    textContent5.textContent = addEventListener2.value + "%";
  });
  addEventListener2.addEventListener("change", () => {
    const popupTransparencyValue = Math.max(0, Math.min(100, Number(addEventListener2.value)));
    if (Number.isFinite(popupTransparencyValue)) {
      applyInspectorChange({
        properties: {
          popupOpacity: 100 - popupTransparencyValue
        }
      });
    }
  });
  append33.append(addEventListener2, textContent5);
  viewEditing(finishingSection, "弹窗透明度", append33);
  const append34 = createEl("div", "i3d-vignette-setting");
  const addEventListener3 = createEl("input");
  const textContent6 = createEl("output");
  const focusVignettePercent = Number.isFinite(canvasWidth.focusVignetteStrength) ? Math.max(0, Math.min(60, canvasWidth.focusVignetteStrength)) : 14;
  Object.assign(addEventListener3, {
    name: "i3d-focus-vignette",
    type: "range",
    min: "0",
    max: "60",
    step: "1",
    value: String(focusVignettePercent)
  });
  addEventListener3.setAttribute("aria-label", "聚焦暗角强度");
  textContent6.textContent = focusVignettePercent + "%";
  addEventListener3.addEventListener("input", () => {
    textContent6.textContent = addEventListener3.value + "%";
  });
  addEventListener3.addEventListener("change", () => void applyInspectorChange({
    properties: {
      focusVignetteStrength: Number(addEventListener3.value)
    }
  }));
  append34.append(addEventListener3, textContent6);
  viewEditing(finishingSection, "聚焦暗角", append34);
  if (positionGrid) {
    for (const querySelectorAll of [reloadBtn, rotationOptions, autoRotateSection, autoRotate, append8, rotationControl, append23, append25, classList6, append28, finishingSection]) {
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
  lightingModeSelect.parentElement.children[0].hidden = true;
  for (const classList3 of [append14, append18, append20]) {
    classList3.classList.add("i3d-inspector-subsection");
  }
  for (const [classList4, classList5] of [[append18, hidden5], [append20, hidden6]]) {
    classList4.classList.add("i3d-idle-inline");
    classList5.classList.add("i3d-idle-wait");
    classList5.children[0].children[0].textContent = "秒";
  }
  append19.children[0].textContent = "闲置时退出聚焦";
  const append35 = createEl("div", "i3d-behavior-row i3d-inspector-subsection");
  append18.classList.remove("i3d-inspector-subsection");
  append14.append(append17);
  append35.append(append18);
  append12.append(append14, append35, append20);
  const appendInspectorGroup = (inspectorGroup, groupTitle, groupChildren, defaultOpen = false) => {
    const dataset5 = createEl("details", "i3d-inspector-group");
    dataset5.dataset.inspectorGroup = inspectorGroup;
    dataset5.open = position.get(inspectorGroup) ?? defaultOpen;
    dataset5.append(createEl("summary", "", groupTitle), ...groupChildren);
    hidden.append(dataset5);
  };
  appendInspectorGroup("layout", "户型与布局", [append5, reloadBtn, append23], !canvasWidth.sceneId);
  appendInspectorGroup("devices", "设备配置", [rotationOptions, autoRotateSection, autoRotate, append8, append7], true);
  appendInspectorGroup("appearance", "画面效果", [rotationControl, append25, append26, classList6, append28, finishingSection]);
  appendInspectorGroup("view", "视角与导航", [append9, append11], positionGrid);
  append12.children[0].hidden = true;
  appendInspectorGroup("interaction", "交互行为", [append12], true);
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
