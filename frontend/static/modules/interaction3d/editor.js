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
  const position = new Map([...hidden.querySelectorAll("details")].filter(dataset => dataset.dataset.inspectorGroup).map(dataset => [dataset.dataset.inspectorGroup, dataset.open]));
  hidden.replaceChildren();
  const createEl = (tagName, element = "", elementCurrent = "") => {
    const className = document.createElement(tagName);
    className.className = element;
    className.textContent = elementCurrent;
    return className;
  };
  const createInspectorSection = sectionTitle => {
    const append = createEl("section", "inspector-section");
    append.append(createEl("h3", "", sectionTitle));
    hidden.append(append);
    return append;
  };
  const viewEditing = (append, labelText, controlEl) => {
    const el = createEl("label");
    el.append(createEl("span", "", labelText), controlEl);
    append.append(el);
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
  const metadata = getInteraction3dEditorView(component.id);
  const positionGrid = !!metadata?.viewEditing;
  const addPositionField = callbacks.document?.canvas || {};
  const canvasWidthPx = Number(addPositionField.width || 2778);
  const canvasHeightPx = Number(addPositionField.height || 1940);
  const sceneCacheKey = Number(canvasHeight.width || 100);
  const sceneLoad = Number(canvasHeight.height || 100);
  const reloadBtn = createInspectorSection("布局与位置");
  const setAttribute = createEl("div", "image-layout-options");
  setAttribute.setAttribute("role", "group");
  setAttribute.setAttribute("aria-label", "3D 交互布局");
  const disabled = canvasWidth.layoutMode === "fill";
  for (const [layoutMode, layoutLabel] of [["free", "自由"], ["fill", "铺满"]]) {
    const layoutBtn = createEl("button", "", layoutLabel);
    layoutBtn.type = "button";
    layoutBtn.dataset.interaction3dLayout = layoutMode;
    const isActiveLayout = (disabled ? "fill" : "free") === layoutMode;
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
    setAttribute.append(layoutBtn);
  }
  const prepareEditorView = createEl("div", "inspector-grid two-columns");
  reloadBtn.append(setAttribute, prepareEditorView);
  prepareEditorView.hidden = disabled;
  const addPositionPercentField = (fieldTitle, currentValue, minValue, maxValue, buildPatch) => {
    const valueAsNumber = createEl("input");
    Object.assign(valueAsNumber, {
      name: "i3d-position-" + fieldTitle,
      type: "number",
      min: String(minValue),
      max: String(maxValue),
      step: ".1",
      value: String(Math.round(currentValue * 10) / 10),
      disabled: disabled
    });
    valueAsNumber.addEventListener("change", () => {
      if (Number.isFinite(valueAsNumber.valueAsNumber)) {
        applyInspectorChange(buildPatch(Math.max(minValue, Math.min(maxValue, valueAsNumber.valueAsNumber))));
      }
    });
    viewEditing(prepareEditorView, fieldTitle, valueAsNumber);
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
  const append = createInspectorSection("户型");
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
  const type = createEl("button", "", "重新载入户型");
  type.type = "button";
  const lightConfigButton = createEl("button", "", "配置灯光");
  lightConfigButton.type = "button";
  const environmentConfigButton = createEl("button", "", "配置环境");
  environmentConfigButton.type = "button";
  const appearanceConfigButton = createEl("button", "", "户型渲染");
  appearanceConfigButton.type = "button";
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
  appearanceConfigButton.addEventListener("click", async () => {
    appearanceConfigButton.disabled = true;
    try {
      if (!(await focalInput())) {
        return;
      }
      await requestInteraction3dAccess();
      const {
        openInteraction3dAppearanceEditor: openAppearanceEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1-20260911-unified-settings-v1-focus-layout-anim-v1-hint-align-v1-20260912-align-v1-nas-select-tdz-fix-v1");
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
      appearanceConfigButton.disabled = false;
    }
  });
  const el = createEl("div", "i3d-house-actions");
  append.append(loadScene, type, el);
  const rotationControl = createInspectorSection("灯光效果");
  const lightSection = createInspectorSection("灯光");
  lightSection.append(lightConfigButton);
  const environmentSection = createInspectorSection("环境");
  environmentSection.append(environmentConfigButton);
  const devicesSection = createInspectorSection("设备");
  const devicesConfigButton = createEl("button", "", "配置设备");
  devicesConfigButton.type = "button";
  devicesSection.append(devicesConfigButton);
  devicesConfigButton.addEventListener("click", async () => {
    devicesConfigButton.disabled = true;
    try {
      const {
        openInteraction3dEditor: openDevicesEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1-20260911-unified-settings-v1-focus-layout-anim-v1-hint-align-v1-20260912-align-v1-nas-select-tdz-fix-v1");
      await openDevicesEditor({
        component,
        deviceKind: "devices",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties => callbacks.onChange({
          properties: properties
        }, {
          replaceProperties: true
        })
      });
    } catch (devicesConfigError) {
      callbacks.onError?.(devicesConfigError);
    } finally {
      devicesConfigButton.disabled = false;
    }
  });
  const securitySection = createInspectorSection("安防");
  const securityConfigButton = createEl("button", "", "配置安防");
  securityConfigButton.type = "button";
  securitySection.append(securityConfigButton);
  securityConfigButton.addEventListener("click", async () => {
    securityConfigButton.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openSecurityEditor
      } = await import("/api/v1/modules/interaction3d/security-editor.js?v=20260911-security-focal-v1-focus-layout-anim-v1-presence-pages-v2");
      await openSecurityEditor({
        component,
        panelDocument: callbacks.document,
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
      securityConfigButton.disabled = false;
    }
  });
  const vacuumSection = createInspectorSection("扫地机");
  const vacuumConfigButton = createEl("button", "", "配置扫地机");
  vacuumConfigButton.type = "button";
  vacuumSection.append(vacuumConfigButton);
  vacuumConfigButton.addEventListener("click", async () => {
    vacuumConfigButton.disabled = true;
    try {
      const {
        openInteraction3dEditor: openVacuumEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1-20260911-unified-settings-v1-focus-layout-anim-v1-hint-align-v1-20260912-align-v1-nas-select-tdz-fix-v1");
      await openVacuumEditor({
        component,
        deviceKind: "vacuum",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties => callbacks.onChange({
          properties: properties
        }, {
          replaceProperties: true
        })
      });
    } catch (vacuumConfigError) {
      callbacks.onError?.(vacuumConfigError);
    } finally {
      vacuumConfigButton.disabled = false;
    }
  });
  viewEditBtn.refresh = () => {
    if (loadScene.isConnected) {
      loadScene.textContent = canvasWidth.sceneId ? "已关联户型，可继续配置视角和灯光。" : viewEditBtn.state === "loading" ? "正在载入已保存的户型…" : viewEditBtn.error || "尚未载入户型。";
      loadScene.hidden = !!canvasWidth.sceneId;
      type.hidden = !!canvasWidth.sceneId || viewEditBtn.state === "loading";
      lightConfigButton.disabled = !canvasWidth.sceneId || positionGrid;
      securityConfigButton.disabled = vacuumConfigButton.disabled = devicesConfigButton.disabled = environmentConfigButton.disabled = lightConfigButton.disabled;
      appearanceConfigButton.disabled = !canvasWidth.sceneId || positionGrid;
    }
  };
  const returnDefaultToggle = async () => {
    if (viewEditBtn.state !== "loading") {
      viewEditBtn.state = "loading";
      viewEditBtn.error = "";
      viewEditBtn.refresh();
      try {
        const properties = await requestInteraction3dScene();
        await callbacks.onChange({
          properties: properties
        });
        viewEditBtn.state = "ready";
      } catch (name2) {
        viewEditBtn.state = "error";
        viewEditBtn.error = name2.name === "TimeoutError" ? "户型载入超时，请重试。" : name2.message;
      }
      viewEditBtn.refresh();
    }
  };
  type.addEventListener("click", () => void returnDefaultToggle());
  lightConfigButton.addEventListener("click", async () => {
    lightConfigButton.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: openClimateEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1-20260911-unified-settings-v1-focus-layout-anim-v1-hint-align-v1-20260912-align-v1-nas-select-tdz-fix-v1");
      await openClimateEditor({
        component,
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties => callbacks.onChange({
          properties: properties
        }, {
          replaceProperties: true
        })
      });
    } catch (climateConfigError) {
      callbacks.onError?.(climateConfigError);
    } finally {
      lightConfigButton.disabled = false;
    }
  });
  environmentConfigButton.addEventListener("click", async () => {
    environmentConfigButton.disabled = true;
    try {
      await requestInteraction3dAccess();
      const {
        openInteraction3dEditor: openEnvironmentEditor
      } = await import("/api/v1/modules/interaction3d/config-editor.js?v=20260909-preview-sleep-v1-20260911-unified-settings-v1-focus-layout-anim-v1-hint-align-v1-20260912-align-v1-nas-select-tdz-fix-v1");
      await openEnvironmentEditor({
        component,
        deviceKind: "environment",
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: properties => callbacks.onChange({
          properties: properties
        }, {
          replaceProperties: true
        })
      });
    } catch (environmentConfigError) {
      callbacks.onError?.(environmentConfigError);
    } finally {
      environmentConfigButton.disabled = false;
    }
  });
  const section = createInspectorSection("楼层视角");
  const viewFloorRow = createEl("div", "i3d-view-floor-row");
  section.append(viewFloorRow);
  const viewFloorSelect = createEl("select");
  viewFloorSelect.name = "i3d-view-floor";
  viewFloorSelect.disabled = positionGrid;
  viewEditing(viewFloorRow, "视角楼层", viewFloorSelect);
  const disabledCurrent = createEl("input");
  Object.assign(disabledCurrent, {
    name: "i3d-floor-gap",
    type: "number",
    min: "0",
    max: "20",
    step: "0.1",
    value: String(canvasWidth.floorGap ?? metadata?.metadata?.floorGap ?? 3)
  });
  viewEditing(viewFloorRow, "楼层间距（m）", disabledCurrent);
  disabledCurrent.disabled = canvasWidth.floorSelection !== "all";
  disabledCurrent.addEventListener("change", () => {
    if (!disabledCurrent.disabled) {
      if (Number.isFinite(disabledCurrent.valueAsNumber)) {
        const floorGap = Math.max(0, Math.min(20, disabledCurrent.valueAsNumber));
        disabledCurrent.value = String(floorGap);
        applyInspectorChange({
          properties: {
            floorGap
          }
        });
      } else {
        disabledCurrent.value = String(canvasWidth.floorGap ?? metadata?.metadata?.floorGap ?? 3);
      }
    }
  });
  const appendCurrent = createEl("div", "i3d-floor-number-group");
  appendCurrent.append(createEl("span", "i3d-floor-number-title", "楼层编号"));
  const idleIconsGrid = createEl("div", "i3d-floor-number-fields");
  appendCurrent.append(idleIconsGrid);
  section.append(appendCurrent);
  const idleSecondsInput = length => {
    idleIconsGrid.replaceChildren();
    appendCurrent.hidden = !length.length;
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
  const displaySection = metadata => {
    if (!viewFloorSelect.isConnected) {
      return;
    }
    const length = metadata?.metadata?.floors || [];
    idleSecondsInput(length);
    if (canvasWidth.floorGap === undefined && Number.isFinite(metadata?.metadata?.floorGap)) {
      disabledCurrent.value = String(metadata.metadata.floorGap);
    }
    viewFloorSelect.replaceChildren();
    const viewFloorOptions = length.length ? [...(length.length > 1 ? [["all", "全部楼层"]] : []), ...length.map(id => [id.id, id.name || "未命名楼层"])] : [[canvasWidth.floorSelection || "all", "当前楼层"]];
    for (const [element, floorOptionLabel] of viewFloorOptions) {
      const floorOption = createEl("option", "", floorOptionLabel);
      floorOption.value = element;
      viewFloorSelect.append(floorOption);
    }
    viewFloorSelect.value = canvasWidth.floorSelection || viewFloorOptions[0][0];
    disabledCurrent.disabled = viewFloorSelect.value !== "all" || length.length < 2;
    viewFloorSelect.disabled = positionGrid || length.length < 2;
  };
  displaySection(metadata);
  if (canvasWidth.sceneId && !metadata?.metadata?.floors?.length && typeof waitInteraction3dEditorView == "function") {
    waitInteraction3dEditorView(component.id).then(displaySection).catch(() => {});
  }
  viewFloorSelect.addEventListener("change", async () => {
    if (positionGrid) {
      return;
    }
    const floorSelection = viewFloorSelect.value;
    const floorCameras = {
      ...canvasWidth.floorCameras
    };
    if (canvasWidth.camera && canvasWidth.floorSelection && !floorCameras[canvasWidth.floorSelection]) {
      floorCameras[canvasWidth.floorSelection] = canvasWidth.camera;
    }
    const properties = {
      floorSelection,
      floorCameras: floorCameras,
      camera: floorCameras[floorSelection] || null
    };
    await applyInspectorChange({
      properties: properties
    });
    renderInteraction3dInspector(panel, {
      ...component,
      properties: {
        ...canvasWidth,
        ...properties
      }
    }, callbacks);
  });
  const disabledNext = createEl("button", positionGrid ? "primary" : "", positionGrid ? "完成并固定" : "调整户型视角");
  disabledNext.type = "button";
  disabledNext.disabled = !canvasWidth.sceneId;
  disabledNext.setAttribute("aria-pressed", String(positionGrid));
  const typeCurrent = createEl("button", "", "取消本次调整");
  typeCurrent.type = "button";
  typeCurrent.hidden = !positionGrid;
  const renderScaleSelect = createEl("p", "inspector-section-note");
  renderScaleSelect.hidden = true;
  disabledNext.addEventListener("click", async () => {
    disabledNext.disabled = true;
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
    } catch (error) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = error.message;
    } finally {
      disabledNext.disabled = false;
    }
  });
  typeCurrent.addEventListener("click", () => {
    getInteraction3dEditorView(component.id)?.setViewEditing(false);
    renderInteraction3dInspector(panel, component, callbacks);
  });
  el.append(disabledNext);
  section.append(el);
  section.append(typeCurrent, renderScaleSelect);
  const hiddenCurrent = createEl("div", "i3d-view-options");
  hiddenCurrent.hidden = !positionGrid;
  section.append(hiddenCurrent);
  const popupTransparencyInput = metadata?.viewCamera || canvasWidth.camera || {};
  const popupTransparencyOutput = async (viewCommandKey, viewCommandValue) => {
    try {
      const viewEditing = getInteraction3dEditorView(component.id);
      if (!viewEditing?.viewEditing) {
        return;
      }
      await viewEditing.viewCommand(viewCommandKey, viewCommandValue);
      renderInteraction3dInspector(panel, component, callbacks);
    } catch (error) {
      renderScaleSelect.hidden = false;
      renderScaleSelect.textContent = error.message;
    }
  };
  ((segmentTitle, viewCommandName, segmentOptions, selectedSegment) => {
    const append = createEl("div", "navigation-property-control");
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
    append.append(createEl("span", "", segmentTitle), setAttribute);
    hiddenCurrent.append(append);
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
  viewEditing(hiddenCurrent, "焦段（mm）", popupTransparency);
  const appendNext = createInspectorSection("导航位置");
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
    appendNext.append(rotBtn);
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
  const scaleRow = createEl("div", "i3d-finishing-row");
  appendNext.append(scaleRow);
  const scaleInputs = [];
  for (const [scaleMode, scaleLabel] of [["categories", "分类栏"], ["floors", "楼层栏"]]) {
    const scaleInput = createEl("input");
    Object.assign(scaleInput, {
      name: "i3d-navigation-" + scaleMode + "-scale",
      type: "number",
      min: "50",
      max: "200",
      step: "5",
      value: String(Math.round((vignetteInput[scaleMode].scale ?? 1) * 100)),
      disabled: positionGrid
    });
    scaleInput.addEventListener("change", () => {
      if (!positionGrid) {
        if (Number.isFinite(scaleInput.valueAsNumber)) {
          vignetteInput[scaleMode].scale = Math.max(50, Math.min(200, scaleInput.valueAsNumber)) / 100;
          applyInspectorChange({
            properties: {
              navigation: structuredClone(vignetteInput)
            }
          });
        }
        scaleInput.value = String(Math.round((vignetteInput[scaleMode].scale ?? 1) * 100));
      }
    });
    viewEditing(scaleRow, scaleLabel + "缩放（%）", scaleInput);
    scaleInputs.push(scaleInput);
  }
  const typeNext = createEl("button", "secondary-button", "恢复默认位置与大小");
  typeNext.type = "button";
  typeNext.disabled = positionGrid;
  typeNext.addEventListener("click", () => {
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
      for (const scaleInputEl of scaleInputs) {
        scaleInputEl.value = "100";
      }
      applyInspectorChange({
        properties: {
          navigation: structuredClone(vignetteInput)
        }
      });
    }
  });
  appendNext.append(typeNext);
  const appendPrevious = createInspectorSection("交互行为");
  let vignetteStrength = canvasWidth.behaviorScope === "page" ? "page" : "global";
  const behaviorPageOptions = [["overview", "ALL（全部楼层）"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]];
  let element = panel.dataset.behaviorPage || "overview";
  let pageBehaviors = structuredClone(canvasWidth.pageBehaviors || {});
  let behaviorDocument = {
    ...canvasWidth,
    pageBehaviors
  };
  const currentPageBehavior = () => resolvePageBehavior({
    ...behaviorDocument,
    behaviorScope: vignetteStrength,
    pageBehaviors
  }, element);
  const isPageBehaviorEnabled = behaviorFlag => behaviorFlag === "hideIconsWhileRotating" ? currentPageBehavior()[behaviorFlag] : currentPageBehavior()[behaviorFlag].enabled;
  const vignetteInputCurrent = createEl("div", "i3d-behavior-scope-row");
  const popupTransparencyInputCurrent = createEl("select");
  const behaviorPageSelect = createEl("select");
  Object.assign(popupTransparencyInputCurrent, {
    name: "i3d-behavior-scope",
    disabled: positionGrid
  });
  popupTransparencyInputCurrent.setAttribute("aria-label", "交互行为设置范围");
  for (const [dirValue, dirLabel] of [["global", "全部页面"], ["page", "单页面"]]) {
    const dirBtn = createEl("option", "", dirLabel);
    dirBtn.value = dirValue;
    popupTransparencyInputCurrent.append(dirBtn);
  }
  popupTransparencyInputCurrent.value = vignetteStrength;
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
  behaviorPageSelect.value = element;
  const hiddenNext = createEl("div");
  hiddenNext.append(behaviorPageSelect);
  hiddenNext.hidden = vignetteStrength !== "page";
  vignetteInputCurrent.append(popupTransparencyInputCurrent, hiddenNext);
  appendPrevious.append(vignetteInputCurrent);
  appendPrevious.append(createEl("p", "inspector-section-note", "以下设置统一应用于所选范围；单页面未单独设置的参数沿用全部页面。"));
  const updatePageBehavior = (behaviorName, behaviorUpdate) => {
    if (!positionGrid) {
      if (vignetteStrength === "page") {
        const enabled = pageBehaviors[element]?.[behaviorName];
        const behaviorValue = typeof behaviorUpdate == "boolean" ? behaviorUpdate : {
          ...(typeof enabled == "boolean" ? {
            enabled
          } : enabled || {}),
          ...behaviorUpdate
        };
        pageBehaviors = {
          ...pageBehaviors,
          [element]: {
            ...pageBehaviors[element],
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
  const setPageBehaviorEnabled = (behaviorKey, enabled) => updatePageBehavior(behaviorKey, behaviorKey === "hideIconsWhileRotating" ? enabled : {
    enabled: enabled
  });
  popupTransparencyInputCurrent.addEventListener("change", () => {
    if (!positionGrid) {
      vignetteStrength = popupTransparencyInputCurrent.value;
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
    element = behaviorPageSelect.value;
    panel.dataset.behaviorPage = element;
    syncAutoRotateControls();
  });
  const appendLocal = createEl("div", "navigation-property-control");
  const setAttributeCurrent = createEl("div", "navigation-segmented-options three-columns");
  setAttributeCurrent.setAttribute("role", "group");
  setAttributeCurrent.setAttribute("aria-label", "3D 旋转方式");
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
    setAttributeCurrent.append(scaleOption);
  }
  appendLocal.append(createEl("span", "", "旋转方式"), setAttributeCurrent);
  appendPrevious.append(appendLocal);
  const appendItem = createInspectorSection("自动旋转");
  const enabled = {
    ...currentPageBehavior().autoRotate
  };
  const appendEntry = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checked = createEl("input");
  Object.assign(checked, {
    name: "i3d-auto-rotate-enabled",
    type: "checkbox",
    checked: enabled.enabled,
    disabled: positionGrid
  });
  appendEntry.append(createEl("span", "", "开启自动旋转"), checked);
  const hiddenPrevious = createEl("div", "inspector-grid two-columns");
  hiddenPrevious.hidden = !enabled.enabled;
  const appendList = createEl("div", "i3d-auto-rotate-row");
  const setAttributeNext = createEl("div", "navigation-segmented-options");
  setAttributeNext.setAttribute("role", "group");
  setAttributeNext.setAttribute("aria-label", "自动旋转方向");
  for (const [direction, directionLabel] of [["clockwise", "顺时针"], ["counterclockwise", "逆时针"]]) {
    const type = createEl("button", "", directionLabel);
    type.type = "button";
    type.disabled = positionGrid;
    type.dataset.direction = direction;
    type.classList.toggle("active", enabled.direction === direction);
    type.setAttribute("aria-pressed", String(enabled.direction === direction));
    type.addEventListener("click", () => {
      if (!positionGrid && enabled.direction !== direction) {
        enabled.direction = direction;
        for (const classList of setAttributeNext.children) {
          const isDirectionPressed = classList === type;
          classList.classList.toggle("active", isDirectionPressed);
          classList.setAttribute("aria-pressed", String(isDirectionPressed));
        }
        updatePageBehavior("autoRotate", {
          direction: enabled.direction
        });
      }
    });
    setAttributeNext.append(type);
  }
  appendList.append(appendEntry, setAttributeNext);
  appendItem.append(appendList, hiddenPrevious);
  const addAutoRotateNumberField = (fieldLabel, fieldKey, fieldMin, fieldMax, fieldStep) => {
    const addEventListener = createEl("input");
    Object.assign(addEventListener, {
      type: "number",
      min: String(fieldMin),
      max: String(fieldMax),
      step: String(fieldStep),
      name: "i3d-auto-rotate-" + fieldKey,
      value: String(enabled[fieldKey]),
      disabled: positionGrid || !enabled.enabled
    });
    addEventListener.addEventListener("change", () => {
      const autoRotateFieldValue = addEventListener.valueAsNumber;
      if (Number.isFinite(autoRotateFieldValue)) {
        enabled[fieldKey] = Math.max(fieldMin, Math.min(fieldMax, fieldKey === "idleSeconds" ? Math.round(autoRotateFieldValue) : autoRotateFieldValue));
        updatePageBehavior("autoRotate", {
          [fieldKey]: enabled[fieldKey]
        });
      }
      addEventListener.value = String(enabled[fieldKey]);
    });
    viewEditing(hiddenPrevious, fieldLabel, addEventListener);
  };
  addAutoRotateNumberField("等待时间（秒）", "idleSeconds", 1, 3600, 1);
  addAutoRotateNumberField("旋转速度（°/秒）", "speed", 0.5, 30, 0.5);
  const appendText = createEl("label", "i3d-setting-toggle i3d-view-toggle i3d-return-default");
  const disabledPrevious = createEl("input");
  Object.assign(disabledPrevious, {
    name: "i3d-auto-rotate-return-default",
    type: "checkbox",
    checked: enabled.returnToDefault,
    disabled: positionGrid || !enabled.enabled
  });
  appendText.append(createEl("span", "", "旋转前回到默认视角"), disabledPrevious);
  disabledPrevious.addEventListener("change", () => {
    if (!disabledPrevious.disabled) {
      enabled.returnToDefault = disabledPrevious.checked;
      updatePageBehavior("autoRotate", {
        returnToDefault: enabled.returnToDefault
      });
    }
  });
  checked.addEventListener("change", () => {
    if (!positionGrid) {
      enabled.enabled = checked.checked;
      hiddenPrevious.hidden = !enabled.enabled;
      disabledPrevious.disabled = positionGrid || !enabled.enabled;
      for (const disabled of hiddenPrevious.querySelectorAll("input")) {
        disabled.disabled = positionGrid || !enabled.enabled;
      }
      setPageBehaviorEnabled("autoRotate", enabled.enabled);
    }
  });
  const appendValue = createInspectorSection("闲置退出聚焦");
  const options = {
    ...currentPageBehavior().idleExitFocus
  };
  const appendSource = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checkedCurrent = createEl("input");
  Object.assign(checkedCurrent, {
    name: "i3d-idle-exit-enabled",
    type: "checkbox",
    checked: options.enabled,
    disabled: positionGrid
  });
  appendSource.append(createEl("span", "", "无操作时自动退出"), checkedCurrent);
  const hiddenLocal = createEl("div", "inspector-grid");
  hiddenLocal.hidden = !options.enabled;
  const disabledLocal = createEl("input");
  Object.assign(disabledLocal, {
    name: "i3d-idle-exit-seconds",
    type: "number",
    min: "1",
    max: "3600",
    step: "1",
    value: String(options.idleSeconds),
    disabled: positionGrid || !options.enabled
  });
  disabledLocal.addEventListener("change", () => {
    if (!disabledLocal.disabled) {
      if (Number.isFinite(disabledLocal.valueAsNumber)) {
        options.idleSeconds = Math.max(1, Math.min(3600, Math.round(disabledLocal.valueAsNumber)));
        updatePageBehavior("idleExitFocus", {
          idleSeconds: options.idleSeconds
        });
      }
      disabledLocal.value = String(options.idleSeconds);
    }
  });
  disabledLocal.setAttribute("aria-label", "闲置退出聚焦等待秒数");
  viewEditing(hiddenLocal, "等待时间（秒）", disabledLocal);
  checkedCurrent.addEventListener("change", () => {
    if (!checkedCurrent.disabled) {
      options.enabled = checkedCurrent.checked;
      hiddenLocal.hidden = !options.enabled;
      disabledLocal.disabled = positionGrid || !options.enabled;
      setPageBehaviorEnabled("idleExitFocus", options.enabled);
    }
  });
  appendValue.append(appendSource, hiddenLocal);
  const appendTarget = createInspectorSection("图标显示");
  appendTarget.classList.add("i3d-icon-visibility-row");
  const enabledCurrent = {
    ...currentPageBehavior().idleHideIcons
  };
  const appendDefault = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checkedNext = createEl("input");
  Object.assign(checkedNext, {
    name: "i3d-idle-icons-enabled",
    type: "checkbox",
    checked: enabledCurrent.enabled,
    disabled: positionGrid
  });
  appendDefault.append(createEl("span", "", "闲置后隐藏图标"), checkedNext);
  const hiddenItem = createEl("div", "inspector-grid");
  hiddenItem.hidden = !enabledCurrent.enabled;
  const valueAsNumber = createEl("input");
  Object.assign(valueAsNumber, {
    name: "i3d-idle-icons-seconds",
    type: "number",
    min: "1",
    max: "3600",
    step: "1",
    value: String(enabledCurrent.idleSeconds),
    disabled: positionGrid || !enabledCurrent.enabled
  });
  valueAsNumber.addEventListener("change", () => {
    if (Number.isFinite(valueAsNumber.valueAsNumber)) {
      enabledCurrent.idleSeconds = Math.max(1, Math.min(3600, Math.round(valueAsNumber.valueAsNumber)));
      updatePageBehavior("idleHideIcons", {
        idleSeconds: enabledCurrent.idleSeconds
      });
    }
    valueAsNumber.value = String(enabledCurrent.idleSeconds);
  });
  valueAsNumber.setAttribute("aria-label", "隐藏图标等待秒数");
  viewEditing(hiddenItem, "等待时间（秒）", valueAsNumber);
  checkedNext.addEventListener("change", () => {
    if (!positionGrid) {
      enabledCurrent.enabled = checkedNext.checked;
      hiddenItem.hidden = !enabledCurrent.enabled;
      valueAsNumber.disabled = positionGrid || !enabledCurrent.enabled;
      setPageBehaviorEnabled("idleHideIcons", enabledCurrent.enabled);
    }
  });
  appendTarget.append(appendDefault, hiddenItem);
  const appendFallback = createEl("label", "i3d-setting-toggle i3d-view-toggle");
  const checkedPrevious = createEl("input");
  Object.assign(checkedPrevious, {
    type: "checkbox",
    name: "i3d-hide-icons-rotating",
    checked: isPageBehaviorEnabled("hideIconsWhileRotating"),
    disabled: positionGrid
  });
  checkedPrevious.addEventListener("change", () => setPageBehaviorEnabled("hideIconsWhileRotating", checkedPrevious.checked));
  appendFallback.append(createEl("span", "", "旋转时隐藏图标"), checkedPrevious);
  appendTarget.append(appendFallback);
  function syncAutoRotateControls() {
    hiddenNext.hidden = vignetteStrength !== "page";
    const autoRotate = currentPageBehavior();
    Object.assign(enabled, autoRotate.autoRotate);
    Object.assign(options, autoRotate.idleExitFocus);
    Object.assign(enabledCurrent, autoRotate.idleHideIcons);
    for (const dataset of setAttributeCurrent.children) {
      const isRotationModeSelected = dataset.dataset.rotationMode === autoRotate.interaction.rotationMode;
      dataset.classList.toggle("active", isRotationModeSelected);
      dataset.setAttribute("aria-pressed", String(isRotationModeSelected));
    }
    for (const dataset of setAttributeNext.children) {
      const isDirectionActive = dataset.dataset.direction === enabled.direction;
      dataset.classList.toggle("active", isDirectionActive);
      dataset.setAttribute("aria-pressed", String(isDirectionActive));
    }
    for (const autoRotateInput of hiddenPrevious.querySelectorAll("input")) {
      autoRotateInput.value = String(enabled[autoRotateInput.name.replace("i3d-auto-rotate-", "")]);
    }
    disabledPrevious.checked = enabled.returnToDefault;
    checkedCurrent.checked = options.enabled;
    disabledLocal.value = String(options.idleSeconds);
    hiddenLocal.hidden = !options.enabled;
    disabledLocal.disabled = positionGrid || !options.enabled;
    valueAsNumber.value = String(enabledCurrent.idleSeconds);
    checked.checked = enabled.enabled;
    hiddenPrevious.hidden = !enabled.enabled;
    disabledPrevious.disabled = positionGrid || !enabled.enabled;
    for (const disabled of hiddenPrevious.querySelectorAll("input")) {
      disabled.disabled = positionGrid || !enabled.enabled;
    }
    enabledCurrent.enabled = isPageBehaviorEnabled("idleHideIcons");
    checkedNext.checked = enabledCurrent.enabled;
    hiddenItem.hidden = !enabledCurrent.enabled;
    valueAsNumber.disabled = positionGrid || !enabledCurrent.enabled;
    checkedPrevious.checked = isPageBehaviorEnabled("hideIconsWhileRotating");
  }
  const appendPending = createInspectorSection("画面显示");
  let elementCurrent = normalizeInteraction3dLightingMode(canvasWidth.lightingMode);
  const lightingModeSelect = createEl("select");
  lightingModeSelect.name = "i3d-lighting-mode";
  lightingModeSelect.setAttribute("aria-label", "灯光模式");
  for (const [element, lightingModeLabel] of INTERACTION3D_LIGHTING_MODES) {
    const lightingModeOption = createEl("option", "", lightingModeLabel);
    lightingModeOption.value = element;
    lightingModeSelect.append(lightingModeOption);
  }
  lightingModeSelect.value = elementCurrent;
  viewEditing(rotationControl, "灯光模式", lightingModeSelect);
  lightingModeSelect.addEventListener("change", async () => {
    if (compWidth.has(lightingModeSelect)) {
      return;
    }
    const lightingMode = normalizeInteraction3dLightingMode(lightingModeSelect.value);
    compHeight(lightingModeSelect, elementCurrent);
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
      elementCurrent = lightingMode;
      compHeight(lightingModeSelect, lightingMode);
    } catch (lightingError) {
      lightingModeSelect.value = elementCurrent;
      callbacks.onError?.(lightingError);
    } finally {
      lightingModeSelect.disabled = positionGrid;
    }
  });
  rotationControl.append(appearanceConfigButton);
  const appendRaw = createEl("div", "navigation-property-control");
  const setAttributePrevious = createEl("div", "navigation-segmented-options");
  setAttributePrevious.setAttribute("role", "group");
  setAttributePrevious.setAttribute("aria-label", "户型底图");
  for (const [backgroundVisible, backgroundVisibleLabel] of [[true, "显示"], [false, "隐藏"]]) {
    const type = createEl("button", "", backgroundVisibleLabel);
    type.type = "button";
    const isBackgroundVisibleActive = canvasWidth.backgroundVisible !== false === backgroundVisible;
    type.classList.toggle("active", isBackgroundVisibleActive);
    type.setAttribute("aria-pressed", String(isBackgroundVisibleActive));
    type.addEventListener("click", () => {
      if (!isBackgroundVisibleActive) {
        applyInspectorChange({
          properties: {
            backgroundVisible
          }
        });
      }
    });
    setAttributePrevious.append(type);
  }
  appendRaw.append(createEl("span", "", "户型底图"), setAttributePrevious);
  appendPending.append(appendRaw);
  const renderScaleSelectEl = createEl("select");
  renderScaleSelectEl.name = "i3d-render-scale";
  for (const [renderScaleValue, renderScaleLabel] of [[1.5, "高清 150%"], [1, "标准 100%"], [0.8, "均衡 80%"], [0.75, "均衡 75%"], [0.5, "流畅 50%"], [0.25, "低负载 25%"]]) {
    const renderScaleOption = createEl("option", "", renderScaleLabel);
    renderScaleOption.value = String(renderScaleValue);
    renderScaleSelectEl.append(renderScaleOption);
  }
  const appendFinal = createInspectorSection("渲染分辨率");
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
  appendFinal.append(renderScaleSelectEl);
  renderScaleSelectEl.title = "画面卡顿时，可降低渲染分辨率。";
  const appendExtra = createInspectorSection("转动分辨率");
  const motionScaleGrid = createEl("div", "inspector-grid two-columns");
  const disabled16 = createEl("select");
  const disabledItem = createEl("input");
  let currentMotionScale = typeof canvasWidth.motionRenderScale == "number" && Number.isFinite(canvasWidth.motionRenderScale) ? Math.max(0.25, Math.min(1, canvasWidth.motionRenderScale)) : null;
  let customMotionScale = currentMotionScale ?? 0.75;
  for (const [element, motionModeLabel] of [["auto", "自动"], ["custom", "自定义"]]) {
    const motionModeOption = createEl("option", "", motionModeLabel);
    motionModeOption.value = element;
    disabled16.append(motionModeOption);
  }
  disabled16.name = "i3d-motion-resolution-mode";
  disabled16.setAttribute("aria-label", "转动分辨率调整方式");
  Object.assign(disabledItem, {
    name: "i3d-motion-render-scale",
    type: "number",
    min: "25",
    max: "100",
    step: "1"
  });
  disabledItem.setAttribute("aria-label", "转动分辨率百分比");
  const syncMotionScaleControls = () => {
    compHeight(disabled16, currentMotionScale === null ? "auto" : "custom");
    disabled16.disabled = positionGrid;
    disabledItem.disabled = positionGrid || currentMotionScale === null;
    disabledItem.value = String(Math.round(customMotionScale * 100));
  };
  const commitMotionRenderScale = async motionRenderScale => {
    disabled16.disabled = disabledItem.disabled = true;
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
  disabledItem.addEventListener("change", () => {
    if (disabledItem.disabled) {
      return;
    }
    const parsedMotionPercent = disabledItem.value.trim() === "" ? NaN : Number(disabledItem.value);
    if (!Number.isFinite(parsedMotionPercent)) {
      syncMotionScaleControls();
      return;
    }
    commitMotionRenderScale(Math.max(25, Math.min(100, Math.round(parsedMotionPercent))) / 100);
  });
  viewEditing(motionScaleGrid, "调整方式", disabled16);
  viewEditing(motionScaleGrid, "转动比例（%）", disabledItem);
  appendExtra.append(motionScaleGrid);
  syncMotionScaleControls();
  const motionScaleNote = createEl("p", "inspector-section-note", "按静止分辨率计算，停止转动后恢复。100% 不降清晰度。");
  appendExtra.append(motionScaleNote);
  const classList = createInspectorSection("地面反射");
  classList.classList.add("i3d-reflection-section");
  let mode = normalizeGroundReflection(canvasWidth.groundReflection);
  const reflectionModeSelect = createEl("select");
  const reflectionResolutionSelect = createEl("select");
  reflectionModeSelect.name = "i3d-reflection-mode";
  reflectionModeSelect.setAttribute("aria-label", "地面反射范围");
  reflectionResolutionSelect.name = "i3d-reflection-resolution";
  reflectionResolutionSelect.setAttribute("aria-label", "反射清晰度");
  for (const [element, reflectionModeLabel] of [["off", "关闭"], ["inside", "室内"], ["outside", "室外"], ["all", "室内＋室外"]]) {
    const reflectionModeOption = createEl("option", "", reflectionModeLabel);
    reflectionModeOption.value = element;
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
  const appendInner = createEl("div", "i3d-vignette-setting");
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
  appendInner.append(reflectionStrengthInput, textContent);
  classList.append(reflectionOptionsRow);
  viewEditing(classList, "强度", appendInner);
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
  const appendOuter = createEl("section", "inspector-section i3d-page-dimming");
  appendOuter.append(createEl("h3", "", "画面压暗"));
  const dimPageSelect = createEl("select");
  const pageDimInput = createEl("input");
  const textContentCurrent = createEl("output");
  dimPageSelect.name = "i3d-dim-page";
  dimPageSelect.setAttribute("aria-label", "压暗页面");
  for (const [element, dimPageLabel] of [["overview", "ALL（全部楼层）"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]]) {
    const dimPageOption = createEl("option", "", dimPageLabel);
    dimPageOption.value = element;
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
  const textContentNext = createEl("output");
  const appendLeft = createEl("div", "i3d-vignette-setting");
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
  textContentNext.textContent = pageSaturationInput.value + "%";
  pageSaturationInput.addEventListener("input", () => {
    textContentNext.textContent = pageSaturationInput.value + "%";
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
  appendLeft.append(pageSaturationInput, textContentNext);
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
  textContentCurrent.textContent = pageDimInput.value + "%";
  dimPageSelect.addEventListener("change", () => {
    panel.dataset.dimmingPage = dimPageSelect.value;
    pageDimInput.value = String(currentPageDimStrength());
    textContentCurrent.textContent = pageDimInput.value + "%";
    pageSaturationInput.value = String(currentPageSaturation());
    textContentNext.textContent = pageSaturationInput.value + "%";
  });
  pageDimInput.addEventListener("input", () => {
    textContentCurrent.textContent = pageDimInput.value + "%";
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
  const appendRight = createEl("div", "i3d-page-dim-row");
  const appendFirst = createEl("div", "i3d-vignette-setting");
  appendFirst.append(pageDimInput, textContentCurrent);
  appendRight.append(dimPageSelect);
  appendOuter.append(appendRight);
  viewEditing(appendOuter, "整体压暗", appendFirst);
  viewEditing(appendOuter, "饱和度", appendLeft);
  const focusDimInput = createEl("input");
  const textContentPrevious = createEl("output");
  const appendSecond = createEl("div", "i3d-vignette-setting");
  Object.assign(focusDimInput, {
    name: "i3d-focus-dim-strength",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(canvasWidth.focusDimStrength ?? 15)
  });
  focusDimInput.setAttribute("aria-label", "聚焦加深");
  textContentPrevious.textContent = focusDimInput.value + "%";
  focusDimInput.addEventListener("input", () => {
    textContentPrevious.textContent = focusDimInput.value + "%";
  });
  focusDimInput.addEventListener("change", () => void applyInspectorChange({
    properties: {
      focusDimStrength: Number(focusDimInput.value)
    }
  }));
  appendSecond.append(focusDimInput, textContentPrevious);
  viewEditing(appendOuter, "聚焦加深", appendSecond);
  const finishingSection = createEl("section", "inspector-section i3d-finishing-row");
  const appendOther = createEl("div", "i3d-vignette-setting");
  const addEventListener = createEl("input");
  const textContentLocal = createEl("output");
  const popupTransparencyPercent = 100 - (Number.isFinite(canvasWidth.popupOpacity) ? Math.max(0, Math.min(100, canvasWidth.popupOpacity)) : 74);
  Object.assign(addEventListener, {
    name: "i3d-popup-transparency",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(popupTransparencyPercent)
  });
  addEventListener.setAttribute("aria-label", "弹窗透明度");
  textContentLocal.textContent = popupTransparencyPercent + "%";
  addEventListener.addEventListener("input", () => {
    textContentLocal.textContent = addEventListener.value + "%";
  });
  addEventListener.addEventListener("change", () => {
    const popupTransparencyValue = Math.max(0, Math.min(100, Number(addEventListener.value)));
    if (Number.isFinite(popupTransparencyValue)) {
      applyInspectorChange({
        properties: {
          popupOpacity: 100 - popupTransparencyValue
        }
      });
    }
  });
  appendOther.append(addEventListener, textContentLocal);
  viewEditing(finishingSection, "弹窗透明度", appendOther);
  const appendResolved = createEl("div", "i3d-vignette-setting");
  const addEventListenerCurrent = createEl("input");
  const textContentItem = createEl("output");
  const focusVignettePercent = Number.isFinite(canvasWidth.focusVignetteStrength) ? Math.max(0, Math.min(60, canvasWidth.focusVignetteStrength)) : 14;
  Object.assign(addEventListenerCurrent, {
    name: "i3d-focus-vignette",
    type: "range",
    min: "0",
    max: "60",
    step: "1",
    value: String(focusVignettePercent)
  });
  addEventListenerCurrent.setAttribute("aria-label", "聚焦暗角强度");
  textContentItem.textContent = focusVignettePercent + "%";
  addEventListenerCurrent.addEventListener("input", () => {
    textContentItem.textContent = addEventListenerCurrent.value + "%";
  });
  addEventListenerCurrent.addEventListener("change", () => void applyInspectorChange({
    properties: {
      focusVignetteStrength: Number(addEventListenerCurrent.value)
    }
  }));
  appendResolved.append(addEventListenerCurrent, textContentItem);
  viewEditing(finishingSection, "聚焦暗角", appendResolved);
  if (positionGrid) {
    for (const querySelectorAll of [reloadBtn, lightSection, environmentSection, devicesSection, vacuumSection, rotationControl, appendPending, appendFinal, classList, appendOuter, finishingSection]) {
      for (const disabled of querySelectorAll.querySelectorAll("input, select, button")) {
        disabled.disabled = true;
      }
    }
  }
  for (const classList of [append, appendPending, reloadBtn, lightSection, environmentSection, devicesSection, vacuumSection, securitySection, rotationControl, appendFinal]) {
    classList.classList.add("i3d-inline-section");
  }
  for (const classList of [lightSection, environmentSection, devicesSection, vacuumSection, securitySection]) {
    classList.classList.add("i3d-category-entry");
  }
  append.classList.add("i3d-house-section");
  reloadBtn.classList.add("i3d-placement-section");
  rotationControl.classList.add("i3d-light-effects-row");
  lightingModeSelect.parentElement.children[0].hidden = true;
  for (const classList of [appendItem, appendValue, appendTarget]) {
    classList.classList.add("i3d-inspector-subsection");
  }
  for (const [classList, classListCurrent] of [[appendValue, hiddenLocal], [appendTarget, hiddenItem]]) {
    classList.classList.add("i3d-idle-inline");
    classListCurrent.classList.add("i3d-idle-wait");
    classListCurrent.children[0].children[0].textContent = "秒";
  }
  appendSource.children[0].textContent = "闲置时退出聚焦";
  const appendNormalized = createEl("div", "i3d-behavior-row i3d-inspector-subsection");
  appendValue.classList.remove("i3d-inspector-subsection");
  appendItem.append(appendText);
  appendNormalized.append(appendValue);
  appendPrevious.append(appendItem, appendNormalized, appendTarget);
  const appendInspectorGroup = (inspectorGroup, groupTitle, groupChildren, defaultOpen = false) => {
    const dataset = createEl("details", "i3d-inspector-group");
    dataset.dataset.inspectorGroup = inspectorGroup;
    dataset.open = position.get(inspectorGroup) ?? defaultOpen;
    dataset.append(createEl("summary", "", groupTitle), ...groupChildren);
    hidden.append(dataset);
  };
  appendInspectorGroup("layout", "户型与布局", [append, reloadBtn, appendPending], !canvasWidth.sceneId);
  appendInspectorGroup("devices", "设备配置", [lightSection, environmentSection, devicesSection, vacuumSection, securitySection], true);
  appendInspectorGroup("appearance", "画面效果", [rotationControl, appendFinal, appendExtra, classList, appendOuter, finishingSection]);
  appendInspectorGroup("view", "视角与导航", [section, appendNext], positionGrid);
  appendPrevious.children[0].hidden = true;
  appendInspectorGroup("interaction", "交互行为", [appendPrevious], true);
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
