import {
  requestInteraction3dAccess,
  getInteraction3dEditorView,
  waitInteraction3dEditorView,
  cancelOtherInteraction3dViews,
} from "./bridge.js?v=20260906-i3d-complete-v6";
import { createInteraction3dCover } from "./cover.js?v=20260905-interaction3d-cover-v1";
import { withRequestTimeout } from "../../utils/request-timeout.js?v=20260907-browser-compat-v1";
export function interaction3dEntries(node, path = [], entries = new Map()) {
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      interaction3dEntries(item, [...path, String(item?.id ?? item?.path ?? index)], entries),
    );
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
    return JSON.stringify(
      value && typeof value == "object"
        ? Object.keys(value)
            .sort()
            .map((sortedKey) => [sortedKey, stableStringify(value[sortedKey])])
        : value,
    );
  }
}
function withoutZIndex(component) {
  if (!component) {
    return null;
  }
  const { zIndex: _zIndex, ...positionRest } = component.position || {};
  return {
    ...component,
    position: positionRest,
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
  const sharedWithI3d = new Set(
    (afterDoc?.sharedComponents || [])
      .filter((sharedComp) => interaction3dEntries(sharedComp).size)
      .map((sharedItem) => sharedItem.id),
  );
  return (afterDoc?.pages || []).some((page) => {
    const beforeSharedIds = new Set(
      (beforeDoc?.pages || []).find((beforePage) => beforePage.id === page.id)?.sharedComponentIds ||
        [],
    );
    return (page.sharedComponentIds || []).some(
      (sharedId) => sharedWithI3d.has(sharedId) && !beforeSharedIds.has(sharedId),
    );
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
export async function updateInteraction3dCard(cardEl) {
  cardEl.disabled = true;
  cardEl.title = "3D 交互";
  const coverTitle = cardEl.querySelector(".interaction3d-cover-title");
  coverTitle.hidden = true;
  try {
    await requestInteraction3dAccess();
    cardEl.disabled = false;
    cardEl.title = "添加 3D 交互控件";
    coverTitle.hidden = true;
  } catch (accessError) {
    coverTitle.hidden = accessError?.status !== 403;
    cardEl.title =
      accessError?.status === 403 ? "3D 交互" : "3D 交互暂时无法连接，请稍后重试";
  }
}
const sceneLoadStates = new Map();
export async function requestInteraction3dScene() {
  return withRequestTimeout(20000, async (signal) => {
    const response = await fetch("/api/v1/modules/interaction3d/scenes", {
      method: "POST",
      credentials: "same-origin",
      signal: signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        typeof payload.detail == "string" ? payload.detail : "户型载入失败，请重试。",
      );
    }
    if (!/^[0-9a-f]{32}$/.test(payload.sceneId || "")) {
      throw new Error("户型载入失败，请重试。");
    }
    return {
      sceneId: payload.sceneId,
    };
  });
}
export function renderInteraction3dInspector(panel, component, callbacks) {
  cancelOtherInteraction3dViews(component?.type === "interaction3d" ? component.id : null);
  let inspector = panel.querySelector("#interaction3d-inspector");
  if (!inspector) {
    inspector = document.createElement("section");
    inspector.id = "interaction3d-inspector";
    inspector.className = "inspector-form";
    panel.append(inspector);
  }
  inspector.hidden = component?.type !== "interaction3d";
  if (inspector.hidden) {
    return;
  }
  inspector.dataset.componentId = component.id;
  inspector.replaceChildren();
  const createEl = (tagName, className = "", text = "") => {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = text;
    return el;
  };
  const addSection = (title) => {
    const section = createEl("section", "inspector-section");
    section.append(createEl("h3", "", title));
    inspector.append(section);
    return section;
  };
  const appendLabeled = (parent, labelText, control) => {
    const label = createEl("label");
    label.append(createEl("span", "", labelText), control);
    parent.append(label);
    return control;
  };
  const applyChange = (patch) =>
    Promise.resolve(callbacks.onChange(patch)).catch((changeError) => callbacks.onError?.(changeError));
  const properties = component.properties || {};
  const position = component.position || {};
  const interactionDefaults = {
    rotationMode:
      properties.interaction?.rotationMode || properties.camera?.rotationMode || "free",
    panEnabled: false,
    zoomEnabled: false,
  };
  const editorView = getInteraction3dEditorView(component.id);
  const viewEditing = !!editorView?.viewEditing;
  const canvas = callbacks.document?.canvas || {};
  const canvasWidth = Number(canvas.width || 2778);
  const canvasHeight = Number(canvas.height || 1940);
  const compWidth = Number(position.width || 100);
  const compHeight = Number(position.height || 100);
  const layoutSection = addSection("布局与位置");
  const layoutOptions = createEl("div", "image-layout-options");
  layoutOptions.setAttribute("role", "group");
  layoutOptions.setAttribute("aria-label", "3D 交互布局");
  const isFillLayout = properties.layoutMode === "fill";
  for (const [layoutMode, layoutLabel] of [
    ["free", "自由"],
    ["fill", "铺满"],
  ]) {
    const layoutBtn = createEl("button", "", layoutLabel);
    layoutBtn.type = "button";
    layoutBtn.dataset.interaction3dLayout = layoutMode;
    const isActiveLayout = (isFillLayout ? "fill" : "free") === layoutMode;
    layoutBtn.classList.toggle("active", isActiveLayout);
    layoutBtn.setAttribute("aria-pressed", String(isActiveLayout));
    layoutBtn.addEventListener("click", () => {
      if (!isActiveLayout) {
        applyChange({
          properties: {
            layoutMode: layoutMode,
          },
        });
      }
    });
    layoutOptions.append(layoutBtn);
  }
  const positionGrid = createEl("div", "inspector-grid two-columns");
  layoutSection.append(layoutOptions, positionGrid);
  positionGrid.hidden = isFillLayout;
  const addPositionField = (fieldLabel, fieldValue, fieldMin, fieldMax, toPatch) => {
    const fieldInput = createEl("input");
    Object.assign(fieldInput, {
      name: "i3d-position-" + fieldLabel,
      type: "number",
      min: String(fieldMin),
      max: String(fieldMax),
      step: ".1",
      value: String(Math.round(fieldValue * 10) / 10),
      disabled: isFillLayout,
    });
    fieldInput.addEventListener("change", () => {
      if (Number.isFinite(fieldInput.valueAsNumber)) {
        applyChange(toPatch(Math.max(fieldMin, Math.min(fieldMax, fieldInput.valueAsNumber))));
      }
    });
    appendLabeled(positionGrid, fieldLabel, fieldInput);
  };
  addPositionField(
    "左侧（%）",
    ((Number(position.x || 0) + compWidth / 2) / canvasWidth) * 100,
    0,
    100,
    (leftPercent) => ({
      position: {
        x: (leftPercent * canvasWidth) / 100 - compWidth / 2,
      },
    }),
  );
  addPositionField(
    "顶部（%）",
    ((Number(position.y || 0) + compHeight / 2) / canvasHeight) * 100,
    0,
    100,
    (topPercent) => ({
      position: {
        y: (topPercent * canvasHeight) / 100 - compHeight / 2,
      },
    }),
  );
  addPositionField("宽度（%）", (compWidth / canvasWidth) * 100, 0.1, 100, (widthPercent) => ({
    position: {
      width: (widthPercent * canvasWidth) / 100,
    },
  }));
  addPositionField("高度（%）", (compHeight / canvasHeight) * 100, 0.1, 100, (heightPercent) => ({
    position: {
      height: (heightPercent * canvasHeight) / 100,
    },
  }));
  addPositionField("缩放（%）", Number(component.style?.scale || 1) * 100, 1, 500, (scalePercent) => ({
    style: {
      scale: scalePercent / 100,
    },
  }));
  addPositionField("旋转（°）", Number(position.rotation || 0), -360, 360, (rotationDeg) => ({
    position: {
      rotation: rotationDeg,
    },
  }));
  const houseSection = addSection("3D 户型");
  const houseNote = createEl("p", "inspector-section-note");
  houseNote.setAttribute("role", "status");
  const sceneCacheKey = (callbacks.document?.projectId || "") + "/" + component.id;
  if (!sceneLoadStates.has(sceneCacheKey)) {
    sceneLoadStates.set(sceneCacheKey, {
      state: "idle",
      error: "",
    });
  }
  const sceneLoad = sceneLoadStates.get(sceneCacheKey);
  const reloadBtn = createEl("button", "", "重新载入户型");
  reloadBtn.type = "button";
  const configLightsBtn = createEl("button", "", "配置灯光");
  configLightsBtn.type = "button";
  const advancedBtn = createEl("button", "", "进阶设置");
  advancedBtn.type = "button";
  const prepareEditorView = async () => {
    callbacks.prepareCanvas?.();
    viewStatusNote.hidden = false;
    viewStatusNote.textContent = "正在准备户型…";
    const readyView = await waitInteraction3dEditorView(component.id);
    if (inspector.hidden || inspector.dataset.componentId !== component.id) {
      return null;
    } else {
      viewStatusNote.hidden = true;
      return readyView;
    }
  };
  advancedBtn.addEventListener("click", async () => {
    advancedBtn.disabled = true;
    try {
      if (!(await prepareEditorView())) {
        return;
      }
      await requestInteraction3dAccess();
      const { openInteraction3dAppearanceEditor: openAppearanceEditor } = await import(
        "/api/v1/modules/interaction3d/config-editor.js?v=20260907-light-capability-v1"
      );
      await openAppearanceEditor({
        component: component,
        onSave: (baseLighting) =>
          callbacks.onChange({
            properties: {
              baseLighting: baseLighting,
            },
          }),
      });
    } catch (advancedError) {
      viewStatusNote.hidden = false;
      viewStatusNote.textContent = advancedError.message;
    } finally {
      advancedBtn.disabled = false;
    }
  });
  const houseActions = createEl("div", "i3d-house-actions");
  houseSection.append(houseNote, reloadBtn, houseActions);
  const lightsSection = addSection("灯光");
  lightsSection.append(configLightsBtn);
  sceneLoad.refresh = () => {
    if (houseNote.isConnected) {
      houseNote.textContent = properties.sceneId
        ? "已关联户型，可继续配置视角和灯光。"
        : sceneLoad.state === "loading"
          ? "正在载入已保存的户型…"
          : sceneLoad.error || "尚未载入户型。";
      houseNote.hidden = !!properties.sceneId;
      reloadBtn.hidden = !!properties.sceneId || sceneLoad.state === "loading";
      configLightsBtn.disabled = !properties.sceneId || viewEditing;
      advancedBtn.disabled = !properties.sceneId || viewEditing;
    }
  };
  const loadScene = async () => {
    if (sceneLoad.state !== "loading") {
      sceneLoad.state = "loading";
      sceneLoad.error = "";
      sceneLoad.refresh();
      try {
        const sceneResult = await requestInteraction3dScene();
        await callbacks.onChange({
          properties: sceneResult,
        });
        sceneLoad.state = "ready";
      } catch (loadError) {
        sceneLoad.state = "error";
        sceneLoad.error =
          loadError.name === "TimeoutError"
            ? "户型载入超时，请重试。"
            : loadError.message;
      }
      sceneLoad.refresh();
    }
  };
  reloadBtn.addEventListener("click", () => void loadScene());
  configLightsBtn.addEventListener("click", async () => {
    configLightsBtn.disabled = true;
    try {
      await requestInteraction3dAccess();
      const { openInteraction3dEditor: openLightEditor } = await import(
        "/api/v1/modules/interaction3d/config-editor.js?v=20260907-light-capability-v1"
      );
      await openLightEditor({
        component: component,
        document: callbacks.document,
        entities: callbacks.entities,
        states: callbacks.states,
        pickers: callbacks.pickers,
        onSave: (lightProps) =>
          callbacks.onChange(
            {
              properties: lightProps,
            },
            {
              replaceProperties: true,
            },
          ),
      });
    } catch (lightEditError) {
      callbacks.onError?.(lightEditError);
    } finally {
      configLightsBtn.disabled = false;
    }
  });
  const houseSectionRef = houseSection;
  const viewEditBtn = createEl(
    "button",
    viewEditing ? "primary" : "",
    viewEditing ? "完成并固定" : "调整户型视角",
  );
  viewEditBtn.type = "button";
  viewEditBtn.disabled = !properties.sceneId;
  viewEditBtn.setAttribute("aria-pressed", String(viewEditing));
  const cancelViewBtn = createEl("button", "", "取消本次调整");
  cancelViewBtn.type = "button";
  cancelViewBtn.hidden = !viewEditing;
  const viewStatusNote = createEl("p", "inspector-section-note");
  viewStatusNote.hidden = true;
  viewEditBtn.addEventListener("click", async () => {
    viewEditBtn.disabled = true;
    try {
      const viewApi = await prepareEditorView();
      if (!viewApi) {
        return;
      }
      if (viewApi.viewEditing) {
        const capturedCamera = await viewApi.captureView();
        await callbacks.onChange({
          properties: {
            camera: capturedCamera,
            interaction: interactionDefaults,
          },
        });
        viewApi.setViewEditing(false);
        renderInteraction3dInspector(
          panel,
          {
            ...component,
            properties: {
              ...properties,
              camera: capturedCamera,
              interaction: interactionDefaults,
            },
          },
          callbacks,
        );
      } else {
        viewApi.setViewEditing(true);
        renderInteraction3dInspector(panel, component, callbacks);
      }
    } catch (viewEditError) {
      viewStatusNote.hidden = false;
      viewStatusNote.textContent = viewEditError.message;
    } finally {
      viewEditBtn.disabled = false;
    }
  });
  cancelViewBtn.addEventListener("click", () => {
    getInteraction3dEditorView(component.id)?.setViewEditing(false);
    renderInteraction3dInspector(panel, component, callbacks);
  });
  houseActions.append(advancedBtn, viewEditBtn);
  houseSectionRef.append(cancelViewBtn, viewStatusNote);
  const viewOptions = createEl("div", "i3d-view-options");
  viewOptions.hidden = !viewEditing;
  houseSectionRef.append(viewOptions);
  const viewCamera = editorView?.viewCamera || properties.camera || {};
  const runViewCommand = async (command, commandArg) => {
    try {
      const activeView = getInteraction3dEditorView(component.id);
      if (!activeView?.viewEditing) {
        return;
      }
      await activeView.viewCommand(command, commandArg);
      renderInteraction3dInspector(panel, component, callbacks);
    } catch (viewCmdError) {
      viewStatusNote.hidden = false;
      viewStatusNote.textContent = viewCmdError.message;
    }
  };
  ((optionLabel, optionCommand, optionPairs, currentValue) => {
    const navControl = createEl("div", "navigation-property-control");
    const segmented = createEl("div", "navigation-segmented-options");
    segmented.setAttribute("role", "group");
    segmented.setAttribute("aria-label", "3D " + optionLabel);
    for (const [optValue, optLabel] of optionPairs) {
      const optBtn = createEl("button", "", optLabel);
      optBtn.type = "button";
      optBtn.disabled = !viewEditing;
      optBtn.classList.toggle("active", optValue === currentValue);
      optBtn.setAttribute("aria-pressed", String(optValue === currentValue));
      optBtn.addEventListener("click", () => void runViewCommand(optionCommand, optValue));
      segmented.append(optBtn);
    }
    navControl.append(createEl("span", "", optionLabel), segmented);
    viewOptions.append(navControl);
  })(
    "投影",
    "projection",
    [
      ["orthographic", "正交"],
      ["perspective", "透视"],
    ],
    viewCamera.mode || "orthographic",
  );
  const focalInput = createEl("input");
  Object.assign(focalInput, {
    name: "i3d-focal-length",
    type: "number",
    min: "18",
    max: "120",
    step: "1",
    value: String(Math.round(viewCamera.focalLength || 50)),
    disabled: !viewEditing || viewCamera.mode !== "perspective",
  });
  focalInput.addEventListener("change", () => {
    if (Number.isFinite(focalInput.valueAsNumber)) {
      runViewCommand("focal-length", Math.max(18, Math.min(120, focalInput.valueAsNumber)));
    }
  });
  appendLabeled(viewOptions, "焦段（mm）", focalInput);
  const interactionSection = addSection("交互设置");
  const rotationControl = createEl("div", "navigation-property-control");
  const rotationOptions = createEl("div", "navigation-segmented-options three-columns");
  rotationOptions.setAttribute("role", "group");
  rotationOptions.setAttribute("aria-label", "3D 旋转方式");
  for (const [rotMode, rotLabel] of [
    ["free", "自由"],
    ["horizontal", "仅左右"],
    ["vertical", "仅上下"],
  ]) {
    const rotBtn = createEl("button", "", rotLabel);
    rotBtn.type = "button";
    const isActiveRot = interactionDefaults.rotationMode === rotMode;
    rotBtn.classList.toggle("active", isActiveRot);
    rotBtn.setAttribute("aria-pressed", String(isActiveRot));
    rotBtn.addEventListener("click", () => {
      if (!isActiveRot) {
        applyChange({
          properties: {
            interaction: {
              ...interactionDefaults,
              rotationMode: rotMode,
            },
          },
        });
      }
    });
    rotationOptions.append(rotBtn);
  }
  rotationControl.append(createEl("span", "", "旋转方式"), rotationOptions);
  interactionSection.append(rotationControl);
  const autoRotateSection = addSection("自动旋转");
  const autoRotate = {
    enabled: properties.autoRotate?.enabled === true,
    returnToDefault: properties.autoRotate?.returnToDefault === true,
    direction:
      properties.autoRotate?.direction === "counterclockwise"
        ? "counterclockwise"
        : "clockwise",
    idleSeconds: Number.isInteger(properties.autoRotate?.idleSeconds)
      ? Math.max(1, Math.min(3600, properties.autoRotate.idleSeconds))
      : 30,
    speed: Number.isFinite(properties.autoRotate?.speed)
      ? Math.max(0.5, Math.min(30, properties.autoRotate.speed))
      : 6,
  };
  const autoRotateToggle = createEl("label", "i3d-view-toggle");
  const autoRotateEnabled = createEl("input");
  Object.assign(autoRotateEnabled, {
    name: "i3d-auto-rotate-enabled",
    type: "checkbox",
    checked: autoRotate.enabled,
    disabled: viewEditing,
  });
  autoRotateToggle.append(createEl("span", "", "开启自动旋转"), autoRotateEnabled);
  const autoRotateGrid = createEl("div", "inspector-grid two-columns");
  autoRotateGrid.hidden = !autoRotate.enabled;
  const autoRotateRow = createEl("div", "i3d-auto-rotate-row");
  const directionOptions = createEl("div", "navigation-segmented-options");
  directionOptions.setAttribute("role", "group");
  directionOptions.setAttribute("aria-label", "自动旋转方向");
  for (const [dirValue, dirLabel] of [
    ["clockwise", "顺时针"],
    ["counterclockwise", "逆时针"],
  ]) {
    const dirBtn = createEl("button", "", dirLabel);
    dirBtn.type = "button";
    dirBtn.disabled = viewEditing;
    dirBtn.classList.toggle("active", autoRotate.direction === dirValue);
    dirBtn.setAttribute("aria-pressed", String(autoRotate.direction === dirValue));
    dirBtn.addEventListener("click", () => {
      if (!viewEditing && autoRotate.direction !== dirValue) {
        autoRotate.direction = dirValue;
        for (const dirChild of directionOptions.children) {
          const isActiveDir = dirChild === dirBtn;
          dirChild.classList.toggle("active", isActiveDir);
          dirChild.setAttribute("aria-pressed", String(isActiveDir));
        }
        applyChange({
          properties: {
            autoRotate: {
              ...autoRotate,
            },
          },
        });
      }
    });
    directionOptions.append(dirBtn);
  }
  autoRotateRow.append(autoRotateToggle, directionOptions);
  autoRotateSection.append(autoRotateRow, autoRotateGrid);
  const addAutoRotateField = (arFieldLabel, arFieldKey, arMin, arMax, arStep) => {
    const arInput = createEl("input");
    Object.assign(arInput, {
      type: "number",
      min: String(arMin),
      max: String(arMax),
      step: String(arStep),
      name: "i3d-auto-rotate-" + arFieldKey,
      value: String(autoRotate[arFieldKey]),
      disabled: viewEditing || !autoRotate.enabled,
    });
    arInput.addEventListener("change", () => {
      const arNumber = arInput.valueAsNumber;
      if (Number.isFinite(arNumber)) {
        autoRotate[arFieldKey] = Math.max(
          arMin,
          Math.min(arMax, arFieldKey === "idleSeconds" ? Math.round(arNumber) : arNumber),
        );
        applyChange({
          properties: {
            autoRotate: {
              ...autoRotate,
            },
          },
        });
      }
      arInput.value = String(autoRotate[arFieldKey]);
    });
    appendLabeled(autoRotateGrid, arFieldLabel, arInput);
  };
  addAutoRotateField("等待时间（秒）", "idleSeconds", 1, 3600, 1);
  addAutoRotateField("旋转速度（°/秒）", "speed", 0.5, 30, 0.5);
  const returnDefaultToggle = createEl("label", "i3d-view-toggle i3d-return-default");
  const returnDefaultInput = createEl("input");
  Object.assign(returnDefaultInput, {
    name: "i3d-auto-rotate-return-default",
    type: "checkbox",
    checked: autoRotate.returnToDefault,
    disabled: viewEditing || !autoRotate.enabled,
  });
  returnDefaultToggle.append(createEl("span", "", "旋转前回到默认视角"), returnDefaultInput);
  autoRotateGrid.append(returnDefaultToggle);
  returnDefaultInput.addEventListener("change", () => {
    if (!returnDefaultInput.disabled) {
      autoRotate.returnToDefault = returnDefaultInput.checked;
      applyChange({
        properties: {
          autoRotate: {
            ...autoRotate,
          },
        },
      });
    }
  });
  autoRotateEnabled.addEventListener("change", () => {
    autoRotate.enabled = autoRotateEnabled.checked;
    autoRotateGrid.hidden = !autoRotate.enabled;
    for (const gridInput of autoRotateGrid.querySelectorAll("input")) {
      gridInput.disabled = viewEditing || !autoRotate.enabled;
    }
    applyChange({
      properties: {
        autoRotate: {
          ...autoRotate,
        },
      },
    });
  });
  const iconsSection = addSection("图标显示");
  const idleHideIcons = {
    enabled: properties.idleHideIcons?.enabled === true,
    idleSeconds: Number.isInteger(properties.idleHideIcons?.idleSeconds)
      ? Math.max(1, Math.min(3600, properties.idleHideIcons.idleSeconds))
      : 30,
  };
  const idleIconsToggle = createEl("label", "i3d-view-toggle");
  const idleIconsEnabled = createEl("input");
  Object.assign(idleIconsEnabled, {
    name: "i3d-idle-icons-enabled",
    type: "checkbox",
    checked: idleHideIcons.enabled,
    disabled: viewEditing,
  });
  idleIconsToggle.append(createEl("span", "", "闲置后隐藏图标"), idleIconsEnabled);
  const idleIconsGrid = createEl("div", "inspector-grid");
  idleIconsGrid.hidden = !idleHideIcons.enabled;
  const idleSecondsInput = createEl("input");
  Object.assign(idleSecondsInput, {
    name: "i3d-idle-icons-seconds",
    type: "number",
    min: "1",
    max: "3600",
    step: "1",
    value: String(idleHideIcons.idleSeconds),
    disabled: viewEditing || !idleHideIcons.enabled,
  });
  idleSecondsInput.addEventListener("change", () => {
    if (Number.isFinite(idleSecondsInput.valueAsNumber)) {
      idleHideIcons.idleSeconds = Math.max(
        1,
        Math.min(3600, Math.round(idleSecondsInput.valueAsNumber)),
      );
      applyChange({
        properties: {
          idleHideIcons: {
            ...idleHideIcons,
          },
        },
      });
    }
    idleSecondsInput.value = String(idleHideIcons.idleSeconds);
  });
  appendLabeled(idleIconsGrid, "等待时间（秒）", idleSecondsInput);
  idleIconsEnabled.addEventListener("change", () => {
    idleHideIcons.enabled = idleIconsEnabled.checked;
    idleIconsGrid.hidden = !idleHideIcons.enabled;
    idleSecondsInput.disabled = viewEditing || !idleHideIcons.enabled;
    applyChange({
      properties: {
        idleHideIcons: {
          ...idleHideIcons,
        },
      },
    });
  });
  iconsSection.append(idleIconsToggle, idleIconsGrid);
  const displaySection = addSection("画面");
  const bgControl = createEl("div", "navigation-property-control");
  const bgOptions = createEl("div", "navigation-segmented-options");
  bgOptions.setAttribute("role", "group");
  bgOptions.setAttribute("aria-label", "户型底图");
  for (const [bgVisible, bgLabel] of [
    [true, "显示"],
    [false, "隐藏"],
  ]) {
    const bgBtn = createEl("button", "", bgLabel);
    bgBtn.type = "button";
    const isActiveBg = (properties.backgroundVisible !== false) === bgVisible;
    bgBtn.classList.toggle("active", isActiveBg);
    bgBtn.setAttribute("aria-pressed", String(isActiveBg));
    bgBtn.addEventListener("click", () => {
      if (!isActiveBg) {
        applyChange({
          properties: {
            backgroundVisible: bgVisible,
          },
        });
      }
    });
    bgOptions.append(bgBtn);
  }
  bgControl.append(createEl("span", "", "户型底图"), bgOptions);
  displaySection.append(bgControl);
  const renderScaleSelect = createEl("select");
  renderScaleSelect.name = "i3d-render-scale";
  for (const [scaleValue, scaleLabel] of [
    [1.5, "高清 150%"],
    [1, "标准 100%"],
    [0.75, "均衡 75%"],
    [0.5, "流畅 50%"],
    [0.25, "低负载 25%"],
  ]) {
    const scaleOption = createEl("option", "", scaleLabel);
    scaleOption.value = String(scaleValue);
    renderScaleSelect.append(scaleOption);
  }
  renderScaleSelect.value = String(properties.renderScale ?? 1);
  renderScaleSelect.addEventListener(
    "change",
    () =>
      void applyChange({
        properties: {
          renderScale: Number(renderScaleSelect.value),
        },
      }),
  );
  appendLabeled(displaySection, "渲染分辨率", renderScaleSelect);
  displaySection.append(
    createEl("p", "inspector-section-note", "画面卡顿时，可降低渲染分辨率。"),
  );
  const popupTransparencyWrap = createEl("div", "i3d-vignette-setting");
  const popupTransparencyInput = createEl("input");
  const popupTransparencyOutput = createEl("output");
  const popupTransparency =
    100 -
    (Number.isFinite(properties.popupOpacity)
      ? Math.max(0, Math.min(100, properties.popupOpacity))
      : 74);
  Object.assign(popupTransparencyInput, {
    name: "i3d-popup-transparency",
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: String(popupTransparency),
  });
  popupTransparencyInput.setAttribute("aria-label", "弹窗透明度");
  popupTransparencyOutput.textContent = popupTransparency + "%";
  popupTransparencyInput.addEventListener("input", () => {
    popupTransparencyOutput.textContent = popupTransparencyInput.value + "%";
  });
  popupTransparencyInput.addEventListener("change", () => {
    const transparencyValue = Math.max(0, Math.min(100, Number(popupTransparencyInput.value)));
    if (Number.isFinite(transparencyValue)) {
      applyChange({
        properties: {
          popupOpacity: 100 - transparencyValue,
        },
      });
    }
  });
  popupTransparencyWrap.append(popupTransparencyInput, popupTransparencyOutput);
  appendLabeled(displaySection, "弹窗透明度", popupTransparencyWrap);
  const vignetteWrap = createEl("div", "i3d-vignette-setting");
  const vignetteInput = createEl("input");
  const vignetteOutput = createEl("output");
  const vignetteStrength = Number.isFinite(properties.focusVignetteStrength)
    ? Math.max(0, Math.min(60, properties.focusVignetteStrength))
    : 14;
  Object.assign(vignetteInput, {
    name: "i3d-focus-vignette",
    type: "range",
    min: "0",
    max: "60",
    step: "1",
    value: String(vignetteStrength),
  });
  vignetteInput.setAttribute("aria-label", "聚焦暗角强度");
  vignetteOutput.textContent = vignetteStrength + "%";
  vignetteInput.addEventListener("input", () => {
    vignetteOutput.textContent = vignetteInput.value + "%";
  });
  vignetteInput.addEventListener(
    "change",
    () =>
      void applyChange({
        properties: {
          focusVignetteStrength: Number(vignetteInput.value),
        },
      }),
  );
  vignetteWrap.append(vignetteInput, vignetteOutput);
  appendLabeled(displaySection, "聚焦暗角", vignetteWrap);
  if (viewEditing) {
    for (const lockSection of [layoutSection, lightsSection, displaySection]) {
      for (const lockControl of lockSection.querySelectorAll("input, select, button")) {
        lockControl.disabled = true;
      }
    }
  }
  sceneLoad.refresh();
  if (!properties.sceneId && sceneLoad.state === "idle") {
    loadScene();
  }
}
