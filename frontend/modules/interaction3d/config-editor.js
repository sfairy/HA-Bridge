import { vacuumMapIdentity } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { openInteraction3dRangeEditor } from "./range-dialog.js?v=20260910-document-shadow-v1";
import { mountInteraction3d } from "./runtime.js?v=20260910-control-projectid-v1";
import { lightState } from "./light-state.js?v=20260906-i3d-render-recovery-v1";
import { openVacuumMapEditor } from "./vacuum-map-editor.js?v=20260909-curtain-action-v15";
import { nasGroups } from "./nas-panel.js";
import { randomUuid } from "/bridge-static/utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { interaction3dPreviewSize } from "/bridge-static/modules/interaction3d/preview-layout.js?v=20260906-i3d-preview-layout-v1-20260908-curtains-v1";
import { requestInteraction3dAccess, getInteraction3dEditorView, subscribeInteraction3dAccess } from "/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
import { normalizeInteraction3dLightingMode } from "/bridge-static/modules/interaction3d/definition.js?v=20260909-curtain-action-v15";
const APPEARANCE_LIGHTING_SECTIONS = [["整体", [["曝光", "exposure", 0.5, 2, 0.05], ["半球光", "hemisphereIntensity", 0, 3, 0.05], ["环境光", "ambientIntensity", 0, 2, 0.05]]], ["主光与阴影", [["强度", "mainIntensity", 0, 5, 0.05], ["水平角", "mainAzimuth", -180, 180, 5], ["高度角", "mainElevation", 5, 89, 5], ["阴影浓度", "mainShadowIntensity", 0, 1, 0.05]]], ["侧面补光", [["强度", "fillIntensity", 0, 3, 0.05], ["水平角", "fillAzimuth", -180, 180, 5], ["高度角", "fillElevation", 0, 89, 5]]], ["顶部补光", [["强度", "topIntensity", 0, 3, 0.05], ["水平角", "topAzimuth", -180, 180, 5], ["高度角", "topElevation", 0, 89, 5]]]];
export async function openInteraction3dEditor({
  component,
  document: doc,
  entities = [],
  states,
  pickers,
  onSave,
  deviceKind = "light",
  startAdding = false,
  vacuumId = "",
  editingFloorId = ""
}) {
  await requestInteraction3dAccess();
  let deviceKindLocal = deviceKind;
  const isDeviceMode = deviceKindLocal === "devices" || deviceKindLocal === "nas" || deviceKindLocal === "television";
  if (deviceKindLocal === "devices") {
    deviceKindLocal = "nas";
  }
  const isVacuumShortcut = deviceKindLocal === "vacuum-shortcut";
  const isVacuum = deviceKindLocal === "vacuum";
  const isDeviceLike = isDeviceMode || isVacuum || isVacuumShortcut;
  const isTelevision = deviceKindLocal === "television";
  const isClimate = deviceKindLocal === "climate";
  const isCover = deviceKindLocal === "cover";
  const isNas = deviceKindLocal === "nas";
  const isNonLight = isClimate || isCover || isNas || isTelevision || isVacuum || isVacuumShortcut;
  const stageLabel = isVacuumShortcut ? "快捷指令" : isVacuum ? "扫地机" : isDeviceMode ? "设备" : isCover ? "窗帘" : isClimate ? "空调" : "灯光";
  const statusNote = isVacuum || isVacuumShortcut ? "vacuums" : isTelevision ? "televisions" : isNas ? "nas" : isCover ? "curtains" : "airConditioners";
  const errorNote = isVacuumShortcut ? "mdi:broom" : isVacuum ? "mdi:robot-vacuum" : isTelevision ? "mdi:television" : isNas ? "mdi:nas" : isCover ? "mdi:curtains" : isClimate ? "mdi:air-conditioner" : "mdi:lightbulb-outline";
  const draft = name3 => name3.name || name3.label || stageLabel;
  const selectedLightId = isNonLight ? "modelId" : "groupId";
  const sceneMeta = clickActionValue => isDeviceLike ? ["focus", "focus-panel", "panel"].includes(clickActionValue) ? clickActionValue : "focus-panel" : isCover ? clickActionValue === "panel" ? "panel" : "focus" : ["turn-on-focus", "turn-on", "turn-on-panel"].includes(clickActionValue) ? clickActionValue : "focus";
  const rel = document.createElement("link");
  rel.rel = "stylesheet";
  rel.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15";
  document.head.append(rel);
  const createEl = (tagName, elClassName, element4) => {
    const className9 = document.createElement(tagName);
    className9.className = elClassName || "";
    if (element4) {
      className9.textContent = element4;
    }
    return className9;
  };
  const accessAllowed = (buttonLabel, onClick) => {
    const type2 = createEl("button", "", buttonLabel);
    type2.type = "button";
    type2.addEventListener("click", onClick);
    return type2;
  };
  const editorDialog = createEl("dialog", "i3d-editor");
  editorDialog.setAttribute("aria-label", "3D " + stageLabel + "配置");
  editorDialog.setAttribute("data-i3d-preview-scope", "");
  const focusBusy = createEl("header");
  const editorBody = createEl("div", "i3d-editor-body");
  const previewView = createEl("div", "i3d-editor-view");
  const focusQueue = createEl("aside");
  const previewAspect = createEl("div", "i3d-editor-aspect");
  const previewHost = createEl("div", "i3d-editor-stage");
  const accessStatusEl = createEl("p", "i3d-editor-status");
  accessStatusEl.setAttribute("role", "status");
  previewAspect.append(previewHost);
  previewView.append(previewAspect, accessStatusEl);
  const pickerGeneration = createEl("p", "i3d-error");
  pickerGeneration.setAttribute("role", "status");
  let effectRangeOpen = structuredClone(component.properties || {});
  let saving = "";
  let draftRevision = null;
  let liveStates = null;
  let refreshCapabilities = false;
  let capabilityCache = true;
  let syncPreviewSize = editingFloorId || (effectRangeOpen.floorSelection !== "all" ? effectRangeOpen.floorSelection : "");
  effectRangeOpen.lightingMode = normalizeInteraction3dLightingMode(effectRangeOpen.lightingMode);
  let resizeObserver = false;
  let closeEditor = null;
  let saveStatus = "focus";
  let saveButton = false;
  let unsubscribeAccess = false;
  let mode = null;
  let cameraCommandGeneration = 0;
  let cameraCommandChain = Promise.resolve();
  let close5 = null;
  let close6 = null;
  let pickerSession = 0;
  let open = false;
  let isSavingConfig = false;
  let dirtyRevision = 0;
  let latestStatesByEntity = null;
  let refreshEffectCapabilityUi = () => {};
  const get5 = new Map();
  if (isDeviceLike) {
    effectRangeOpen.devices = {
      ...effectRangeOpen.devices,
      [statusNote]: effectRangeOpen.devices?.[statusNote] || []
    };
  }
  if (isNonLight && !isDeviceLike) {
    effectRangeOpen.environment = {
      ...effectRangeOpen.environment,
      dimStrength: Number.isFinite(effectRangeOpen.environment?.dimStrength) ? Math.max(0, Math.min(100, effectRangeOpen.environment.dimStrength)) : 70,
      [statusNote]: effectRangeOpen.environment?.[statusNote] || []
    };
  }
  if (isVacuumShortcut) {
    for (const shortcuts2 of effectRangeOpen.devices.vacuums) {
      shortcuts2.shortcuts = (shortcuts2.shortcuts || []).map(visible => visible.visible === false ? {
        ...visible,
        visible: true,
        buttonHidden: true,
        hiddenClickable: false
      } : visible);
    }
  }
  vacuumId ||= effectRangeOpen.devices?.vacuums?.[0]?.id || "";
  const getCurrentVacuum = () => effectRangeOpen.devices?.vacuums?.find(id36 => id36.id === vacuumId);
  const getCurrentItems = () => isVacuumShortcut ? getCurrentVacuum()?.shortcuts || [] : isDeviceLike ? effectRangeOpen.devices[statusNote] : isNonLight ? effectRangeOpen.environment[statusNote] : effectRangeOpen.lights;
  const setCurrentItems = shortcuts3 => {
    if (isVacuumShortcut) {
      if (getCurrentVacuum()) {
        getCurrentVacuum().shortcuts = shortcuts3;
      }
    } else if (isDeviceLike) {
      effectRangeOpen.devices[statusNote] = shortcuts3;
    } else if (isNonLight) {
      effectRangeOpen.environment[statusNote] = shortcuts3;
    } else {
      effectRangeOpen.lights = shortcuts3;
    }
  };
  setCurrentItems((getCurrentItems() || []).filter(visible2 => isVacuumShortcut || visible2.visible !== false).map(size2 => {
    const size3 = Number.isFinite(size2.size) && size2.size > 0 ? size2.size : 44;
    return {
      ...size2,
      size: size3,
      visible: isVacuumShortcut ? size2.visible !== false : true,
      icon: size2.icon || errorNote,
      ...(isNonLight ? {} : {
        fadeDuration: size2.fadeDuration ?? 0.3
      }),
      ...(isCover ? {
        coverDirection: ["left", "right", "split"].includes(size2.coverDirection) ? size2.coverDirection : "auto"
      } : {}),
      ...(isVacuumShortcut ? {} : {
        clickAction: sceneMeta(size2.clickAction)
      }),
      iconSize: Number.isFinite(size2.iconSize) && size2.iconSize > 0 ? size2.iconSize : Math.min(size3, Math.max(4, size3 - 18))
    };
  }));
  const filter = isNonLight ? [...(isVacuum ? [] : [["icon", "图标", ""]]), ["size", isVacuum ? "状态框缩放" : "按钮大小", isVacuum ? "%" : "px"], ["iconSize", isVacuum ? "文字大小" : "图标大小", "px"], ["hitSize", "点击范围", "px"], ["buttonVisibility", "按钮显示", ""], ...(isVacuumShortcut ? [["fontSize", "文字大小", "px"], ["iconHidden", "隐藏图标", ""], ["labelHidden", "隐藏名称", ""]] : [])] : [["size", "按钮大小", "px"], ["iconSize", "图标大小", "px"], ["hitSize", "点击范围", "px"], ["fadeDuration", "缓开缓灭", "秒"], ["effectDefaults.brightness", "默认亮度", "%"], ["effectDefaults.kelvin", "默认色温", "K"], ["effectRange.brightnessMin", "最暗亮度", "%"], ["effectRange.brightnessMax", "最亮亮度", "%"], ["effectRange.temperatureMin", "最低色温", "K"], ["effectRange.temperatureMax", "最高色温", "K"]];
  const capabilityCache2 = new Map(getCurrentItems().map(id37 => [id37.id, structuredClone(id37)]));
  let close7 = null;
  let updateBatchApplyState = () => {};
  function markDirty(size4, minimum = resolveEntityLightState(size4)) {
    if (isNonLight) {
      return {
        icon: size4.icon || errorNote,
        size: size4.size ?? 44,
        iconSize: size4.iconSize ?? 26,
        hitSize: size4.hitSize ?? Math.max(44, size4.size ?? 44),
        ...(isVacuumShortcut ? {
          fontSize: size4.fontSize ?? 12,
          iconHidden: size4.iconHidden === true,
          labelHidden: size4.labelHidden === true
        } : {}),
        buttonVisibility: size4.buttonHidden === true ? "隐藏（不可点击）" : size4.hiddenClickable === true ? "隐藏（可点击）" : "显示"
      };
    } else {
      return {
        size: size4.size ?? 44,
        iconSize: size4.iconSize ?? 26,
        hitSize: size4.hitSize ?? Math.max(44, size4.size ?? 44),
        fadeDuration: size4.fadeDuration ?? 0.3,
        effectDefaults: size4.effectDefaults || {},
        effectRange: {
          brightnessMin: 1,
          brightnessMax: 100,
          temperatureMin: minimum.minimum,
          temperatureMax: minimum.maximum,
          ...size4.effectRange
        }
      };
    }
  }
  const getByPath = (pathObject, split) => split.split(".").reduce((pathAcc, pathKey) => pathAcc?.[pathKey], pathObject);
  function resolveLightCapability(id40) {
    if (!capabilityCache2.has(id40.id)) {
      capabilityCache2.set(id40.id, structuredClone(id40));
    }
    const entityId = resolveEntityLightState(id40);
    const entityState = markDirty(capabilityCache2.get(id40.id), entityId);
    const cachedCapability = markDirty(id40, entityId);
    return filter.filter(([diffFieldPath]) => getByPath(entityState, diffFieldPath) !== getByPath(cachedCapability, diffFieldPath));
  }
  function appendLabeled(parent, fieldLabel, control) {
    for (const split2 of control) {
      if (split2 === "buttonVisibility") {
        parent.buttonHidden = fieldLabel.buttonVisibility === "隐藏（不可点击）";
        parent.hiddenClickable = fieldLabel.buttonVisibility === "隐藏（可点击）";
        continue;
      }
      const [fieldRootKey, fieldChildKey] = split2.split(".");
      if (!fieldChildKey) {
        parent[fieldRootKey] = fieldLabel[fieldRootKey];
        continue;
      }
      parent[fieldRootKey] = {
        ...(fieldRootKey === "effectRange" ? markDirty(parent).effectRange : parent[fieldRootKey])
      };
      if (fieldLabel[fieldRootKey][fieldChildKey] === undefined) {
        delete parent[fieldRootKey][fieldChildKey];
      } else {
        parent[fieldRootKey][fieldChildKey] = fieldLabel[fieldRootKey][fieldChildKey];
      }
      if (!Object.keys(parent[fieldRootKey]).length) {
        delete parent[fieldRootKey];
      }
    }
  }
  function renderSidebar() {
    close7?.close();
    close7?.remove();
    close7 = null;
  }
  function appendSelect(selectParent) {
    const select = selectParent.statusSource;
    if (!select || refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || close7) {
      return;
    }
    const has2 = new Set(select.visibleMetrics || select.metrics.map(entityId20 => entityId20.entityId));
    const push2 = [];
    const nasFieldsDialog = createEl("dialog", "settings-dialog i3d-add-dialog i3d-nas-fields-dialog");
    close7 = nasFieldsDialog;
    nasFieldsDialog.setAttribute("aria-label", "选择 NAS 显示内容");
    const nasFieldsHeading = createEl("div", "dialog-heading");
    const nasFieldsTitle = createEl("h2", "", "选择显示内容");
    const className11 = accessAllowed("×", renderSidebar);
    className11.className = "icon-button";
    className11.setAttribute("aria-label", "关闭显示内容选择");
    nasFieldsHeading.append(nasFieldsTitle, className11);
    const nasFieldsBody = createEl("div", "i3d-add-dialog-body");
    const nasFieldsToolbar = createEl("div", "dialog-actions");
    const nasFieldsCountEl = createEl("span", "i3d-note");
    const updateNasFieldsCount = () => {
      nasFieldsCountEl.textContent = "已选 " + has2.size + " 项";
      for (const checked6 of push2) {
        checked6.checked = has2.has(checked6.value);
      }
    };
    nasFieldsToolbar.append(accessAllowed("全选", () => {
      select.metrics.forEach(entityId16 => has2.add(entityId16.entityId));
      updateNasFieldsCount();
    }), accessAllowed("全不选", () => {
      has2.clear();
      updateNasFieldsCount();
    }), nasFieldsCountEl);
    const nasFieldsList = createEl("div", "i3d-nas-fields");
    const options = nasGroups(select).filter(([nasGroupId]) => select.metrics.some(group2 => group2.group === nasGroupId));
    const get4 = new Map();
    const rerenderNasFieldGroups = () => {
      options.forEach(([nasGroupKey], nasGroupIndex) => {
        const {
          section: nasGroupSectionEl,
          up: disabled,
          down: disabled2
        } = get4.get(nasGroupKey);
        disabled.disabled = nasGroupIndex === 0;
        disabled2.disabled = nasGroupIndex === options.length - 1;
        nasFieldsList.append(nasGroupSectionEl);
      });
    };
    for (const [optValue, optLabel] of options) {
      const option = select.metrics.filter(group3 => group3.group === optValue);
      const nasGroupSection = createEl("section");
      const nasGroupHeading = createEl("div", "i3d-nas-fields-heading");
      const moveNasGroup = nasGroupDelta => {
        const nasGroupFromIndex = options.findIndex(([nasGroupMatchId]) => nasGroupMatchId === optValue);
        const nasGroupToIndex = nasGroupFromIndex + nasGroupDelta;
        if (!(nasGroupToIndex < 0) && !(nasGroupToIndex >= options.length)) {
          [options[nasGroupFromIndex], options[nasGroupToIndex]] = [options[nasGroupToIndex], options[nasGroupFromIndex]];
          rerenderNasFieldGroups();
        }
      };
      const nasGroupUpBtn = accessAllowed("↑", () => moveNasGroup(-1));
      const select = accessAllowed("↓", () => moveNasGroup(1));
      nasGroupUpBtn.setAttribute("aria-label", "上移" + optLabel + "分组");
      select.setAttribute("aria-label", "下移" + optLabel + "分组");
      nasGroupUpBtn.title = "上移分组";
      select.title = "下移分组";
      nasGroupHeading.append(createEl("h4", "", optLabel), nasGroupUpBtn, select);
      nasGroupSection.append(nasGroupHeading);
      get4.set(optValue, {
        section: nasGroupSection,
        up: nasGroupUpBtn,
        down: select,
        metrics: option
      });
      const get3 = new Map();
      const rerenderNasGroupRows = () => option.forEach((entityId19, nasMetricIndex) => {
        const up = get3.get(entityId19.entityId);
        up.up.disabled = nasMetricIndex === 0;
        up.down.disabled = nasMetricIndex === option.length - 1;
        nasGroupSection.append(up.row);
      });
      for (const label2 of option) {
        const row = createEl("div", "i3d-nas-fields-row");
        const title = createEl("label");
        const nasMetricCheckbox = createEl("input");
        nasMetricCheckbox.type = "checkbox";
        nasMetricCheckbox.value = label2.entityId;
        nasMetricCheckbox.setAttribute("aria-label", label2.label);
        title.title = label2.entityId;
        nasMetricCheckbox.addEventListener("change", () => {
          if (nasMetricCheckbox.checked) {
            has2.add(nasMetricCheckbox.value);
          } else {
            has2.delete(nasMetricCheckbox.value);
          }
          updateNasFieldsCount();
        });
        const moveNasMetric = nasMetricDelta => {
          const nasMetricFromIndex = option.indexOf(label2);
          const nasMetricToIndex = nasMetricFromIndex + nasMetricDelta;
          if (!(nasMetricToIndex < 0) && !(nasMetricToIndex >= option.length)) {
            [option[nasMetricFromIndex], option[nasMetricToIndex]] = [option[nasMetricToIndex], option[nasMetricFromIndex]];
            rerenderNasGroupRows();
          }
        };
        const nasMetricUpBtn = accessAllowed("↑", () => moveNasMetric(-1));
        const nasMetricDownBtn = accessAllowed("↓", () => moveNasMetric(1));
        nasMetricUpBtn.setAttribute("aria-label", "上移" + label2.label);
        nasMetricDownBtn.setAttribute("aria-label", "下移" + label2.label);
        nasMetricUpBtn.title = "上移内容";
        nasMetricDownBtn.title = "下移内容";
        get3.set(label2.entityId, {
          row,
          up: nasMetricUpBtn,
          down: nasMetricDownBtn
        });
        push2.push(nasMetricCheckbox);
        title.append(nasMetricCheckbox, createEl("span", "", label2.label));
        row.append(title, nasMetricUpBtn, nasMetricDownBtn);
        nasGroupSection.append(row);
      }
      rerenderNasGroupRows();
      nasFieldsList.append(nasGroupSection);
    }
    rerenderNasFieldGroups();
    const nasFieldsActions = createEl("div", "dialog-actions");
    const className12 = accessAllowed("确定", () => {
      if (refreshCapabilities || !capabilityCache || selectParent.statusSource !== select || !getCurrentItems().includes(selectParent)) {
        return renderSidebar();
      }
      select.metrics = options.flatMap(([nasConfirmGroupId]) => get4.get(nasConfirmGroupId).metrics);
      select.visibleMetrics = select.metrics.filter(entityId12 => has2.has(entityId12.entityId)).map(entityId15 => entityId15.entityId);
      select.groupOrder = options.map(([nasConfirmOrderId]) => nasConfirmOrderId);
      renderSidebar();
      mountRuntime();
      rebuildConfigSidebar();
      saveStatusEl.textContent = "显示内容已调整，待保存配置";
    });
    className12.className = "primary";
    nasFieldsActions.append(accessAllowed("取消", renderSidebar), className12);
    nasFieldsBody.append(nasFieldsToolbar, nasFieldsList, createEl("p", "i3d-note", "用 ↑ ↓ 调整分组和组内内容顺序；确定后点击“保存配置”保存。"), nasFieldsActions);
    nasFieldsDialog.append(nasFieldsHeading, nasFieldsBody);
    document.body.append(nasFieldsDialog);
    updateNasFieldsCount();
    nasFieldsDialog.addEventListener("cancel", preventDefault => {
      preventDefault.preventDefault();
      renderSidebar();
    });
    nasFieldsDialog.showModal();
  }
  function appendNumber(numParent) {
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || close7) {
      return;
    }
    const numInput = isNonLight ? stageLabel : "灯光";
    const batchApplyTitle = isNonLight ? "图标设置" : "灯光设置";
    const length6 = resolveLightCapability(numParent);
    const length7 = getCurrentItems().filter(id31 => id31.id !== numParent.id && (isVacuumShortcut || id31.floorId === numParent.floorId));
    if (!length6.length) {
      return;
    }
    const batchSourceSnapshot = structuredClone(markDirty(numParent));
    const Object2 = createEl("dialog", "settings-dialog navigation-style-apply-dialog i3d-batch-dialog");
    Object2.setAttribute("aria-label", "应用" + batchApplyTitle);
    close7 = Object2;
    const batchHeading = createEl("div", "dialog-heading");
    const batchHeadingText = createEl("div");
    batchHeadingText.append(createEl("span", "", "BATCH APPLY"), createEl("h2", "", "应用" + batchApplyTitle));
    const className13 = accessAllowed("×", renderSidebar);
    className13.className = "icon-button";
    className13.setAttribute("aria-label", "关闭应用设置窗口");
    batchHeading.append(batchHeadingText, className13);
    const batchBody = createEl("div", "navigation-style-apply-body");
    const batchColumns = createEl("div", "navigation-style-apply-columns");
    const batchFieldsSection = createEl("section");
    const batchTargetsSection = createEl("section");
    const makeBatchSectionHeading = (batchHeadingTitle, batchHeadingHint) => {
      const batchSectionHeadingEl = createEl("div", "navigation-style-apply-heading");
      batchSectionHeadingEl.append(createEl("strong", "", batchHeadingTitle), createEl("span", "", batchHeadingHint));
      return batchSectionHeadingEl;
    };
    const batchFieldOptions = createEl("div", "navigation-style-apply-options");
    const batchTargetOptions = createEl("div", "navigation-style-apply-options grouped-by-page");
    const at = [];
    const push3 = [];
    const makeBatchOption = (element2, batchOptionTitle, batchOptionHint, push) => {
      const batchOptionLabel = createEl("label", "navigation-style-apply-option");
      const type = createEl("input");
      const batchOptionText = createEl("span", "", batchOptionTitle);
      type.type = "checkbox";
      type.checked = true;
      type.value = element2;
      type.setAttribute("aria-label", batchOptionTitle);
      push.push(type);
      batchOptionText.append(createEl("small", "", batchOptionHint));
      batchOptionLabel.append(type, batchOptionText);
      return batchOptionLabel;
    };
    const has3 = new Set(length6.map(([batchFieldId]) => batchFieldId));
    const add = new Set(has3);
    for (const replace of has3) {
      if (replace.startsWith("effectRange.")) {
        add.add(replace.endsWith("Min") ? replace.replace(/Min$/, "Max") : replace.replace(/Max$/, "Min"));
      }
    }
    for (const [batchFieldPath, batchFieldLabel, batchFieldUnit] of filter.filter(([batchFilterPath]) => add.has(batchFilterPath))) {
      const batchFieldRaw = getByPath(batchSourceSnapshot, batchFieldPath);
      const batchFieldDisplay = isVacuum && batchFieldPath === "size" ? Math.round(batchFieldRaw / 44 * 100) : isVacuum && batchFieldPath === "iconSize" ? batchFieldRaw / 2 : batchFieldRaw;
      const element3 = has3.has(batchFieldPath);
      batchFieldOptions.append(makeBatchOption(batchFieldPath, batchFieldLabel, typeof batchFieldDisplay == "boolean" ? batchFieldDisplay ? "是" : "否" : batchFieldDisplay === undefined ? "跟随模型" : "" + (element3 ? "" : "配套上/下限 · ") + (typeof batchFieldDisplay == "number" ? Math.round(batchFieldDisplay * 1000) / 1000 : batchFieldDisplay) + " " + batchFieldUnit, at));
      at.at(-1).checked = element3;
    }
    const has4 = new Map();
    for (const floorId4 of length7) {
      const batchTargetFloorId = isVacuumShortcut ? getCurrentVacuum()?.floorId : floorId4.floorId;
      if (!has4.has(batchTargetFloorId)) {
        has4.set(batchTargetFloorId, []);
      }
      has4.get(batchTargetFloorId).push(floorId4);
    }
    for (const [batchFloorId, batchFloorItems] of has4) {
      const batchFloorGroup = createEl("section", "navigation-style-apply-page-group");
      const batchFloorHeading = createEl("div", "navigation-style-apply-page-heading");
      const batchFloorName = draftRevision?.floors.find(id21 => id21.id === batchFloorId)?.name || "原楼层";
      const batchFloorControls = createEl("div", "navigation-style-apply-page-controls");
      const batchFloorCountEl = createEl("span");
      const batchFloorOptions = createEl("div", "navigation-style-apply-page-options");
      const length4 = [];
      for (const id38 of batchFloorItems) {
        batchFloorOptions.append(makeBatchOption(id38.id, id38.label || numInput, isNonLight ? "图标设置" : "灯光设置", length4));
      }
      push3.push(...length4);
      const updateBatchFloorToggle = () => {
        const batchFloorCheckedCount = length4.filter(checked3 => checked3.checked).length;
        batchFloorCountEl.textContent = batchFloorCheckedCount + "/" + length4.length + " 个" + numInput;
        batchFloorToggleBtn.textContent = batchFloorCheckedCount === length4.length ? "取消全选" : "全选";
      };
      const batchFloorToggleBtn = accessAllowed("", () => {
        const element = !length4.every(checked => checked.checked);
        length4.forEach(checked5 => {
          checked5.checked = element;
        });
        updateBatchFloorToggle();
      });
      batchFloorToggleBtn.className = "navigation-style-apply-page-toggle";
      batchFloorToggleBtn.setAttribute("aria-label", "全选或取消 " + batchFloorName + " 的" + numInput);
      batchFloorOptions.addEventListener("change", updateBatchFloorToggle);
      batchFloorControls.append(batchFloorCountEl, batchFloorToggleBtn);
      batchFloorHeading.append(createEl("strong", "", batchFloorName), batchFloorControls);
      batchFloorGroup.append(batchFloorHeading, batchFloorOptions);
      batchTargetOptions.append(batchFloorGroup);
      updateBatchFloorToggle();
    }
    batchFieldsSection.append(makeBatchSectionHeading("要应用的修改", "可单独取消"), batchFieldOptions);
    batchTargetsSection.append(makeBatchSectionHeading("应用到其他" + numInput, "按楼层区分"), batchTargetOptions);
    batchColumns.append(batchFieldsSection, batchTargetsSection);
    const hidden = createEl("p", "navigation-style-apply-message");
    hidden.hidden = length7.length > 0;
    if (!length7.length) {
      hidden.textContent = "当前配置中没有其他" + numInput + "可应用。";
    }
    hidden.setAttribute("role", "status");
    const batchActions = createEl("div", "dialog-actions");
    const disabled12 = accessAllowed("应用所选", async () => {
      const length3 = at.filter(checked4 => checked4.checked).map(batchCheckedFieldInput => batchCheckedFieldInput.value);
      const size = new Set(push3.filter(checked2 => checked2.checked).map(batchCheckedTargetInput => batchCheckedTargetInput.value));
      if (!length3.length || !size.size) {
        hidden.textContent = "请至少选择一项修改和一个目标" + numInput + "。";
        hidden.hidden = false;
        return;
      }
      disabled12.disabled = true;
      try {
        await requestInteraction3dAccess();
        if (refreshCapabilities || !capabilityCache || close7 !== Object2) {
          return;
        }
        const length2 = getCurrentItems().filter(focalLength => size.has(focalLength.id) && focalLength.id !== numParent.id && (isVacuumShortcut || focalLength.floorId === numParent.floorId)).map(label => {
          const effectRange = structuredClone(label);
          appendLabeled(effectRange, batchSourceSnapshot, length3);
          const brightnessMin = effectRange.effectRange;
          if (brightnessMin && (brightnessMin.brightnessMin > brightnessMin.brightnessMax || brightnessMin.temperatureMin > brightnessMin.temperatureMax)) {
            throw new Error("“" + (label.label || "灯光") + "”的上下限会冲突，请同时勾选对应的最小值与最大值。");
          }
          return effectRange;
        });
        if (!length2.length) {
          throw new Error("目标" + numInput + "已不存在，请重新选择。");
        }
        const get2 = new Map(length2.map(id12 => [id12.id, id12]));
        setCurrentItems(getCurrentItems().map(id14 => get2.get(id14.id) || id14));
        for (const id22 of [numParent, ...length2]) {
          const batchTargetCached = capabilityCache2.get(id22.id) || structuredClone(id22);
          appendLabeled(batchTargetCached, batchSourceSnapshot, length3);
          capabilityCache2.set(id22.id, batchTargetCached);
        }
        renderSidebar();
        mountRuntime();
        rebuildConfigSidebar();
        saveStatusEl.textContent = "已应用到 " + length2.length + " 个" + numInput + "，待保存配置";
      } catch (message8) {
        if (close7 === Object2) {
          hidden.textContent = message8.message;
          hidden.hidden = false;
        }
      } finally {
        disabled12.disabled = false;
      }
    });
    disabled12.className = "primary";
    disabled12.disabled = !length7.length;
    batchActions.append(accessAllowed("取消", renderSidebar), disabled12);
    batchBody.append(createEl("p", "navigation-style-apply-summary", isVacuumShortcut ? "将“" + (numParent.label || stageLabel) + "”的图标修改应用到勾选的快捷按钮，保留各自的指令绑定、名称、位置和高度。应用后点击“保存配置”。" : isNonLight ? "将“" + (numParent.label || stageLabel) + "”的图标修改应用到勾选的" + stageLabel + "。保留各自的模型、实体、位置、高度、点击行为、聚焦视角和状态内容。应用后点击“保存配置”完成保存。" : "将“" + (numParent.label || "灯光") + "”中选定的修改应用到勾选的灯光。保留各灯的实体、名称、位置、聚焦视角与照射范围。应用后点击“保存配置”完成保存。"), batchColumns, hidden, batchActions);
    Object2.append(batchHeading, batchBody);
    document.body.append(Object2);
    Object2.addEventListener("cancel", preventDefault2 => {
      preventDefault2.preventDefault();
      renderSidebar();
    });
    Object2.showModal();
  }
  const fitPreviewAspect = () => {
    const width = interaction3dPreviewSize(component, doc, previewView.clientWidth, previewView.clientHeight);
    Object.assign(previewAspect.style, {
      width: width.width + "px",
      height: width.height + "px"
    });
  };
  const header2 = new ResizeObserver(fitPreviewAspect);
  header2.observe(previewView);
  const closeMainEditor = () => {
    if (!refreshCapabilities) {
      refreshCapabilities = true;
      closeAddDialog();
      renderSidebar();
      closeEditor?.close();
      header2.disconnect();
      pickerSession++;
      close6?.close();
      liveStates?.();
      unsubscribeAccessWatch();
      editorDialog.remove();
      rel.remove();
      document.dispatchEvent(new Event("hb-i3d-preview-scope"));
    }
  };
  const saveStatusEl = createEl("span", "i3d-save-status");
  saveStatusEl.setAttribute("role", "status");
  const disabled17 = accessAllowed("保存配置", async () => {
    if (isSavingConfig || refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess) {
      return;
    }
    const pendingSaveSnapshot = structuredClone(effectRangeOpen);
    const pendingSaveRevision = dirtyRevision;
    isSavingConfig = true;
    saveStatusEl.textContent = "保存中…";
    disabled17.disabled = true;
    pickerGeneration.textContent = "";
    try {
      await requestInteraction3dAccess();
      if (refreshCapabilities) {
        return;
      }
      await onSave(pendingSaveSnapshot);
      if (!refreshCapabilities) {
        saveStatusEl.textContent = pendingSaveRevision === dirtyRevision ? "已保存" : "已保存，另有新修改";
      }
    } catch (message11) {
      if (!refreshCapabilities) {
        pickerGeneration.textContent = message11.message;
        saveStatusEl.textContent = "";
      }
    } finally {
      isSavingConfig = false;
      if (!refreshCapabilities) {
        disabled17.disabled = !capabilityCache || saveButton || unsubscribeAccess;
      }
    }
  });
  disabled17.className = "primary";
  focusBusy.append(createEl("strong", "", "3D " + stageLabel + "配置"), saveStatusEl, disabled17, accessAllowed("退出", closeMainEditor));
  editorBody.append(previewView, focusQueue);
  editorDialog.append(focusBusy, editorBody);
  document.body.append(editorDialog);
  editorDialog.addEventListener("cancel", preventDefault4 => {
    preventDefault4.preventDefault();
    closeMainEditor();
  });
  const getPreviewProperties = () => {
    const floorSelection = isVacuumShortcut && getCurrentVacuum() ? getCurrentVacuum().floorId : syncPreviewSize;
    const camera2 = effectRangeOpen.floorCameras?.[floorSelection] || (floorSelection === effectRangeOpen.floorSelection ? effectRangeOpen.camera : null);
    return {
      ...effectRangeOpen,
      floorSelection,
      ...(camera2 === undefined ? {} : {
        camera: camera2
      })
    };
  };
  function mountRuntime() {
    dirtyRevision++;
    if (!isSavingConfig) {
      saveStatusEl.textContent = "";
    }
    liveStates?.update(getPreviewProperties(), isVacuumShortcut && saving ? "vacuum-room:" + vacuumId + ":" + saving : saving);
    updateBatchApplyState();
  }
  function appendSetting(settingParent, lightItem, capabilityInfo) {
    capabilityInfo.name = "i3d-" + deviceKindLocal + "-" + (saving || "scene") + "-" + lightItem;
    const effectDetails = createEl("label", capabilityInfo.type === "checkbox" ? "i3d-setting-toggle" : "");
    effectDetails.append(createEl("span", "", lightItem), capabilityInfo);
    settingParent.append(effectDetails);
    return capabilityInfo;
  }
  function appendPositiveNumber(posParent, posLabel, getValue, onPositive, onSelectChange) {
    const posInput = createEl("select");
    for (const [element5, selectOptionLabel] of getValue) {
      const selectOptionEl = createEl("option", "", selectOptionLabel);
      selectOptionEl.value = element5;
      posInput.append(selectOptionEl);
    }
    posInput.value = onPositive;
    posInput.addEventListener("change", () => onSelectChange(posInput.value));
    return appendSetting(posParent, posLabel, posInput);
  }
  function appendBoundedInput(boundedParent, boundedLabel, boundedValue, boundedMin, boundedMax, boundedStep, onBoundedChange, type3 = "number") {
    const boundedInputEl = createEl("input");
    Object.assign(boundedInputEl, {
      type: type3,
      min: String(boundedMin),
      max: String(boundedMax),
      step: String(boundedStep),
      value: String(boundedValue)
    });
    boundedInputEl.addEventListener(type3 === "range" ? "input" : "change", () => {
      const boundedInputNumber = boundedInputEl.value.trim() === "" ? NaN : Number(boundedInputEl.value);
      if (Number.isFinite(boundedInputNumber)) {
        onBoundedChange(Math.max(boundedMin, Math.min(boundedMax, boundedInputNumber)));
      }
    });
    return appendSetting(boundedParent, boundedLabel, boundedInputEl);
  }
  function appendPositiveInput(positiveParent, positiveLabel, getPositiveValue, onPositiveChange) {
    const positiveInputEl = createEl("input");
    Object.assign(positiveInputEl, {
      type: "number",
      step: "any",
      value: String(Number(getPositiveValue().toPrecision(12)))
    });
    positiveInputEl.addEventListener("change", () => {
      const positiveInputNumber = positiveInputEl.value.trim() === "" ? NaN : Number(positiveInputEl.value);
      if (Number.isFinite(positiveInputNumber) && positiveInputNumber > 0) {
        positiveInputEl.value = String(positiveInputNumber);
        onPositiveChange(positiveInputNumber);
      } else {
        positiveInputEl.value = String(getPositiveValue());
      }
    });
    return appendSetting(positiveParent, positiveLabel, positiveInputEl);
  }
  function resolveEntityLightState(entityId21) {
    const startsWith = entityId21.entityId || "";
    const newState2 = latestStatesByEntity === null ? states?.get?.(startsWith) : latestStatesByEntity[startsWith];
    const known2 = get5.get(startsWith);
    const supported_color_modes = (newState2?.newState || newState2)?.attributes || {};
    const supportedFeaturesRaw = supported_color_modes.supported_features;
    const hasSupportedFeatures = supportedFeaturesRaw != null && supportedFeaturesRaw !== "" && typeof supportedFeaturesRaw != "boolean" && Number.isFinite(Number(supportedFeaturesRaw));
    const known3 = lightState(startsWith, newState2, known2);
    known3.known = startsWith.startsWith("switch.") || known2?.known === true || Array.isArray(supported_color_modes.supported_color_modes) && supported_color_modes.supported_color_modes.some(colorMode => colorMode !== "unknown") || hasSupportedFeatures || known3.brightnessSupported || known3.temperatureSupported;
    if (startsWith && known3.known) {
      get5.set(startsWith, known3);
    }
    return known3;
  }
  function renderLightEffectPanel(effectPanelHost, effectDefaults2, known4) {
    effectPanelHost.replaceChildren();
    if (effectDefaults2.entityId && !known4.known) {
      const effectDetectingNote = createEl("p", "i3d-note", "正在识别灯具能力…");
      effectDetectingNote.setAttribute("role", "status");
      effectPanelHost.append(effectDetectingNote);
    }
    if (effectDefaults2.entityId && known4.known && (!known4.brightnessSupported || !known4.temperatureSupported)) {
      const defaultEffectSection = createEl("section", "i3d-focus-settings");
      defaultEffectSection.append(createEl("h4", "", "默认效果"));
      const defaultEffectGrid = createEl("div", "i3d-coordinate-grid");
      defaultEffectSection.append(defaultEffectGrid);
      for (const [defaultEffectLabel, defaultEffectKey, defaultEffectSupported, defaultEffectMin, defaultEffectMax, defaultEffectStep] of [["默认亮度（%）", "brightness", known4.brightnessSupported, 0, 100, 1], ["默认色温（K）", "kelvin", known4.temperatureSupported, 1000, 20000, 100]]) {
        if (defaultEffectSupported) {
          continue;
        }
        const defaultEffectInput = createEl("input");
        Object.assign(defaultEffectInput, {
          type: "number",
          min: String(defaultEffectMin),
          max: String(defaultEffectMax),
          step: String(defaultEffectStep),
          value: Number.isFinite(effectDefaults2.effectDefaults?.[defaultEffectKey]) ? String(effectDefaults2.effectDefaults[defaultEffectKey]) : "",
          placeholder: "跟随模型"
        });
        defaultEffectInput.addEventListener("change", () => {
          const defaultEffectRaw = defaultEffectInput.value.trim();
          const defaultEffectNumber = Number(defaultEffectRaw);
          const effectDefaults = {
            ...effectDefaults2.effectDefaults
          };
          if (defaultEffectRaw) {
            if (Number.isFinite(defaultEffectNumber)) {
              effectDefaults[defaultEffectKey] = Math.max(defaultEffectMin, Math.min(defaultEffectMax, defaultEffectNumber));
            }
          } else {
            delete effectDefaults[defaultEffectKey];
          }
          defaultEffectInput.value = Number.isFinite(effectDefaults[defaultEffectKey]) ? String(effectDefaults[defaultEffectKey]) : "";
          if (Object.keys(effectDefaults).length) {
            effectDefaults2.effectDefaults = effectDefaults;
          } else {
            delete effectDefaults2.effectDefaults;
          }
          mountRuntime();
        });
        appendSetting(defaultEffectGrid, defaultEffectLabel, defaultEffectInput);
      }
      const defaultEffectActions = createEl("div", "i3d-focus-actions");
      defaultEffectSection.append(defaultEffectActions);
      defaultEffectActions.append(accessAllowed("预览默认效果", async () => {
        try {
          await liveStates.focusCommand("preview-light-effect", effectDefaults2.id, "defaults");
        } catch (message6) {
          pickerGeneration.textContent = message6.message;
        }
      }), accessAllowed("跟随模型", () => {
        delete effectDefaults2.effectDefaults;
        mountRuntime();
        rebuildConfigSidebar();
      }));
      effectPanelHost.append(defaultEffectSection);
    }
    const effectRangeDetails = createEl("details", "i3d-effect-settings");
    effectRangeDetails.open = open;
    effectRangeDetails.addEventListener("toggle", () => {
      open = effectRangeDetails.open;
    });
    effectRangeDetails.append(createEl("summary", "", "效果范围"));
    const effectRangeValues = {
      brightnessMin: 1,
      brightnessMax: 100,
      temperatureMin: known4.minimum,
      temperatureMax: known4.maximum,
      ...effectDefaults2.effectRange
    };
    const effectRangeGrid = createEl("div", "i3d-effect-grid");
    effectRangeDetails.append(effectRangeGrid);
    for (const [effectRangeLabel, endsWith, effectRangeSiblingKey, effectRangeMin, effectRangeMax, effectRangeStep] of [["最暗亮度（%）", "brightnessMin", "brightnessMax", 0, 100, 1], ["最亮亮度（%）", "brightnessMax", "brightnessMin", 0, 100, 1], ["最低色温（K）", "temperatureMin", "temperatureMax", 1000, 20000, 100], ["最高色温（K）", "temperatureMax", "temperatureMin", 1000, 20000, 100]]) {
      const effectRangeOption = createEl("div", "i3d-effect-option");
      effectRangeGrid.append(effectRangeOption);
      const effectRangeInput = appendBoundedInput(effectRangeOption, effectRangeLabel, effectRangeValues[endsWith], effectRangeMin, effectRangeMax, effectRangeStep, effectRangeNext => {
        effectRangeValues[endsWith] = endsWith.endsWith("Min") ? Math.min(effectRangeNext, effectRangeValues[effectRangeSiblingKey]) : Math.max(effectRangeNext, effectRangeValues[effectRangeSiblingKey]);
        effectRangeInput.value = String(effectRangeValues[endsWith]);
        effectDefaults2.effectRange = {
          ...effectRangeValues
        };
        mountRuntime();
      });
      const disabled9 = accessAllowed("预览", async () => {
        try {
          await liveStates.focusCommand("preview-light-effect", effectDefaults2.id, endsWith);
        } catch (message7) {
          pickerGeneration.textContent = message7.message;
        }
      });
      disabled9.disabled = !effectDefaults2.entityId;
      if (!effectDefaults2.entityId) {
        disabled9.title = "绑定实体后预览效果";
      }
      disabled9.setAttribute("aria-label", "预览" + effectRangeLabel);
      effectRangeOption.append(disabled9);
    }
    effectRangeDetails.append(accessAllowed("恢复默认效果", () => {
      delete effectDefaults2.effectRange;
      mountRuntime();
      rebuildConfigSidebar();
    }));
    effectPanelHost.append(effectRangeDetails);
  }
  function listFloorTargets() {
    return (draftRevision?.floors || []).filter(floor => floor.id === syncPreviewSize).flatMap(floor => (isNonLight ? floor[statusNote] || [] : floor.groups || []).map(group => ({
      floor,
      group,
      key: JSON.stringify([floor.id, group.id])
    })));
  }
  function listAvailableTargets() {
    return listFloorTargets().filter(target => !getCurrentItems().some(item => item.floorId === target.floor.id && item[selectedLightId] === target.group.id));
  }
  function unavailableAddHint(availableTargets = listAvailableTargets(), floorTargets = listFloorTargets()) {
    if (availableTargets.length) {
      return "";
    }
    if (getCurrentItems().length >= 128) {
      return "已达到 128 个上限。";
    }
    const targetNoun = isNonLight ? stageLabel + "模型" : "灯组";
    if (floorTargets.length) {
      return "当前楼层" + targetNoun + "均已添加；如需新增，请先在户型绘制中新建" + targetNoun + "并更新户型。";
    }
    return isVacuum ? "当前楼层暂无扫地机模型，请先在户型绘制中添加扫地机器人后更新户型。" : isTelevision ? "当前楼层暂无电视模型，请先在户型绘制中添加电视后更新户型。" : isNas ? "当前楼层暂无 NAS 模型，请先在户型绘制中添加模型后更新户型。" : isCover ? "当前楼层暂无窗帘模型，请在户型绘制中添加普通窗帘后更新户型。" : isClimate ? "当前楼层暂无空调模型，请在户型绘制中添加壁挂空调、柜机或出风口后更新户型。" : "当前楼层暂无灯组，请在户型绘制中添加灯组后更新户型。";
  }
  async function reopenEditorAs(deviceKind, startAdding = false) {
    if (refreshCapabilities || isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess) {
      return;
    }
    const properties = structuredClone(effectRangeOpen);
    closeMainEditor();
    await openInteraction3dEditor({
      component: {
        ...component,
        properties
      },
      document: doc,
      entities,
      states,
      pickers,
      onSave,
      deviceKind,
      startAdding,
      editingFloorId: syncPreviewSize,
      vacuumId: isVacuum ? saving : vacuumId
    });
  }
  function closeAddDialog() {
    if (close5) {
      pickerSession++;
      close6?.close();
      close6 = null;
    }
    close5?.close();
    close5?.remove();
    close5 = null;
  }
  function openAddDialog(currentTarget) {
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || close5) {
      return;
    }
    if (isVacuumShortcut) {
      openAddShortcutEntityPicker(currentTarget?.currentTarget || currentTarget?.target);
      return;
    }
    const length8 = listAvailableTargets();
    if (!length8.length || getCurrentItems().length >= 128) {
      return;
    }
    pickerSession++;
    close6?.close();
    const addDialog = createEl("dialog", "settings-dialog i3d-add-dialog");
    close5 = addDialog;
    addDialog.setAttribute("aria-label", isDeviceMode ? "添加设备" : "添加" + stageLabel + "按钮");
    const addDialogHeading = createEl("div", "dialog-heading");
    const addDialogHeadingText = createEl("div");
    addDialogHeadingText.append(createEl("span", "", "ADD BUTTON"), createEl("h2", "", isDeviceMode ? "添加设备" : "添加" + stageLabel + "按钮"));
    const className14 = accessAllowed("×", closeAddDialog);
    className14.className = "icon-button";
    className14.setAttribute("aria-label", "关闭添加按钮窗口");
    addDialogHeading.append(addDialogHeadingText, className14);
    const addDialogBody = createEl("div", "i3d-add-dialog-body");
    const addDialogError = createEl("p", "i3d-error");
    addDialogError.setAttribute("role", "status");
    if (isDeviceMode) {
      appendPositiveNumber(addDialogBody, "设备类型", [["nas", "NAS"], ["television", "电视"]], deviceKindLocal, deviceTypeChoice => {
        if (deviceTypeChoice !== deviceKindLocal) {
          reopenEditorAs(deviceTypeChoice, true);
        }
      }).setAttribute("aria-label", "设备类型");
    }
    const disabled13 = appendPositiveNumber(addDialogBody, isNonLight ? "关联" + stageLabel + "模型" : "关联灯组", length8.map(key5 => [key5.key, draft(key5.group)]), length8[0].key, () => {
      addDialogError.textContent = "";
    });
    disabled13.setAttribute("aria-label", isNonLight ? "关联" + stageLabel + "模型" : "关联灯组");
    const addDialogActions = createEl("div", "dialog-actions");
    let isAddingItem = false;
    const disabled14 = accessAllowed("确定添加", async () => {
      if (isAddingItem || refreshCapabilities || !capabilityCache || close5 !== addDialog) {
        return;
      }
      isAddingItem = true;
      disabled14.disabled = true;
      disabled13.disabled = true;
      addDialogError.textContent = "";
      const selectedAddTargetKey = disabled13.value;
      try {
        await requestInteraction3dAccess();
        if (refreshCapabilities || !capabilityCache || close5 !== addDialog) {
          return;
        }
        const group = listAvailableTargets().find(key2 => key2.key === selectedAddTargetKey);
        if (!group || getCurrentItems().length >= 128) {
          throw new Error("该对象已添加或不再可用，请关闭窗口后重新选择。");
        }
        const id26 = {
          id: randomUuid(),
          floorId: group.floor.id,
          [selectedLightId]: group.group.id,
          entityId: "",
          label: draft(group.group),
          ...(isNonLight ? {} : {
            x: group.group.x,
            y: group.group.y,
            height: group.group.height ?? group.floor.wallHeight ?? 2.8,
            fadeDuration: 0.3
          }),
          ...(isCover ? {
            coverDirection: "auto"
          } : {}),
          size: 44,
          iconSize: 26,
          visible: true,
          icon: errorNote,
          clickAction: isDeviceLike ? "focus-panel" : "focus"
        };
        getCurrentItems().push(id26);
        saving = id26.id;
        closeAddDialog();
        mountRuntime();
        rebuildConfigSidebar();
      } catch (message9) {
        if (close5 === addDialog) {
          addDialogError.textContent = message9.message;
        }
      } finally {
        isAddingItem = false;
        disabled14.disabled = false;
        disabled13.disabled = false;
      }
    });
    disabled14.className = "primary";
    addDialogActions.append(accessAllowed("取消", closeAddDialog), disabled14);
    addDialogBody.append(createEl("p", "i3d-note", "添加后可继续设置" + stageLabel + "按钮，最后点击“保存配置”完成保存。"), addDialogError, addDialogActions);
    addDialog.append(addDialogHeading, addDialogBody);
    document.body.append(addDialog);
    addDialog.addEventListener("cancel", preventDefault3 => {
      preventDefault3.preventDefault();
      closeAddDialog();
    });
    addDialog.showModal();
  }
  async function openAddShortcutEntityPicker(trigger4) {
    const floorId5 = getCurrentVacuum();
    if (!floorId5 || getCurrentItems().length >= 64) {
      return;
    }
    const addShortcutPickerSession = ++pickerSession;
    close6?.close();
    try {
      const close4 = await pickers.entity({
        trigger: trigger4,
        deviceKind: "vacuum-room",
        current: "",
        onSelect(entityId17) {
          if (refreshCapabilities || !capabilityCache || addShortcutPickerSession !== pickerSession || getCurrentVacuum() !== floorId5 || getCurrentItems().length >= 64 || !entityId17) {
            return;
          }
          const name = entities.find(entityId9 => entityId9.entityId === entityId17);
          const newState = states?.get?.(entityId17);
          const attributes = newState?.newState || newState;
          const vacuums = draftRevision.floors.find(id8 => id8.id === floorId5.floorId);
          const vacuumModelOnFloor = vacuums?.vacuums?.find(id9 => id9.id === floorId5.modelId);
          const length = (vacuums?.plan?.walls || []).flatMap(start => [start.start, start.end]);
          const averageWallCoord = wallCoordAxis => length.length ? length.reduce((wallCoordSum, wallCoordPoint) => wallCoordSum + wallCoordPoint[wallCoordAxis], 0) / length.length : vacuumModelOnFloor?.[wallCoordAxis] || 0;
          const id23 = {
            id: randomUuid(),
            entityId: entityId17,
            label: name?.name || attributes?.attributes?.friendly_name || entityId17,
            x: averageWallCoord("x"),
            y: averageWallCoord("y"),
            height: 0.08,
            size: 44,
            iconSize: 26,
            fontSize: 12,
            hitSize: 44,
            icon: "mdi:broom",
            visible: true
          };
          setCurrentItems([...getCurrentItems(), id23]);
          saving = id23.id;
          pickerSession++;
          close6?.close();
          close6 = null;
          rebuildConfigSidebar();
          mountRuntime();
        }
      });
      if (refreshCapabilities || addShortcutPickerSession !== pickerSession) {
        close4?.close();
      } else {
        close6 = close4;
      }
    } catch (message12) {
      if (!refreshCapabilities) {
        pickerGeneration.textContent = message12.message;
      }
    }
  }
  function renderVacuumShortcutSidebar() {
    focusQueue.append(accessAllowed("返回扫地机配置", () => void reopenEditorAs("vacuum")));
    if (!draftRevision) {
      return;
    }
    const length9 = effectRangeOpen.devices?.vacuums || [];
    if (!length9.length) {
      focusQueue.append(createEl("p", "i3d-note", "请先在扫地机配置中添加并绑定扫地机。"));
      return;
    }
    appendPositiveNumber(focusQueue, "所属扫地机", length9.map(id32 => [id32.id, id32.label || id32.deviceName || "扫地机"]), vacuumId, selectedVacuumId => {
      vacuumId = selectedVacuumId;
      saving = "";
      capabilityCache2.clear();
      liveStates?.();
      liveStates = null;
      mountPreviewRuntime();
      rebuildConfigSidebar();
    });
    const shortcutListHeading = createEl("div", "i3d-light-heading");
    const disabled15 = accessAllowed("添加快捷指令", openAddDialog);
    disabled15.disabled = getCurrentItems().length >= 64;
    shortcutListHeading.append(createEl("h4", "", "快捷按钮"), disabled15);
    focusQueue.append(shortcutListHeading);
    if (!getCurrentItems().some(id33 => id33.id === saving)) {
      saving = getCurrentItems()[0]?.id || "";
    }
    if (!saving) {
      focusQueue.append(createEl("p", "i3d-note", "添加按钮后，选择全部实体中的清扫指令，在户型中拖动按钮放置。"));
      return;
    }
    appendPositiveNumber(focusQueue, "当前按钮", getCurrentItems().map(id34 => [id34.id, id34.label]), saving, selectedShortcutId => {
      saving = selectedShortcutId;
      pickerSession++;
      close6?.close();
      rebuildConfigSidebar();
      mountRuntime();
    });
    const icon2 = getCurrentItems().find(id35 => id35.id === saving);
    const className15 = accessAllowed("删除此快捷按钮", () => {
      pickerSession++;
      close6?.close();
      setCurrentItems(getCurrentItems().filter(shortcutItem => shortcutItem !== icon2));
      saving = "";
      rebuildConfigSidebar();
      mountRuntime();
    });
    className15.className = "i3d-remove-light";
    focusQueue.append(className15);
    const shortcutNameInput = createEl("input");
    shortcutNameInput.value = icon2.label;
    shortcutNameInput.maxLength = 128;
    shortcutNameInput.onchange = () => {
      icon2.label = shortcutNameInput.value.trim() || "房间清扫";
      rebuildConfigSidebar();
      mountRuntime();
    };
    appendSetting(focusQueue, "名称", shortcutNameInput);
    const openShortcutPicker = (shortcutPickerKind, trigger3) => {
      const shortcutPickerSession = ++pickerSession;
      Promise.resolve(pickers[shortcutPickerKind]({
        trigger: trigger3,
        deviceKind: "vacuum-room",
        current: shortcutPickerKind === "icon" ? icon2.icon : icon2.entityId,
        onSelect(icon) {
          if (!refreshCapabilities && !!capabilityCache && shortcutPickerSession === pickerSession && !!getCurrentItems().includes(icon2)) {
            if (shortcutPickerKind === "icon") {
              icon2.icon = icon;
            } else {
              icon2.entityId = icon;
            }
            rebuildConfigSidebar();
            mountRuntime();
          }
        }
      })).then(close3 => {
        if (refreshCapabilities || shortcutPickerSession !== pickerSession) {
          close3?.close();
        } else {
          close6 = close3;
        }
      }).catch(message10 => {
        pickerGeneration.textContent = message10.message;
      });
    };
    const className16 = accessAllowed(icon2.entityId || "选择实体（全部）", () => openShortcutPicker("entity", className16));
    className16.className = "i3d-picker-button";
    appendSetting(focusQueue, "指令实体", className16);
    const className17 = accessAllowed("", () => openShortcutPicker("icon", className17));
    className17.className = "i3d-picker-button i3d-icon-picker-button";
    const style2 = createEl("i");
    style2.style.maskImage = "url('/bridge-static/vendor/mdi/7.4.47/svg/" + (icon2.icon || errorNote).slice(4) + ".svg')";
    style2.style.webkitMaskImage = style2.style.maskImage;
    className17.append(style2, createEl("span", "", icon2.icon || errorNote));
    appendSetting(focusQueue, "图标", className17);
    const shortcutVisibilityRow = createEl("div", "i3d-button-visibility-row i3d-shortcut-visibility");
    focusQueue.append(shortcutVisibilityRow);
    for (const [shortcutVisKey, shortcutVisLabel] of [["hiddenClickable", "隐藏（可点击）"], ["buttonHidden", "隐藏（不可点击）"]]) {
      const checked9 = createEl("input");
      checked9.type = "checkbox";
      checked9.checked = icon2[shortcutVisKey] === true;
      checked9.onchange = () => {
        icon2[shortcutVisKey] = checked9.checked;
        if (checked9.checked) {
          icon2[shortcutVisKey === "buttonHidden" ? "hiddenClickable" : "buttonHidden"] = false;
        }
        rebuildConfigSidebar();
        mountRuntime();
      };
      appendSetting(shortcutVisibilityRow, shortcutVisLabel, checked9);
    }
    for (const [shortcutHideKey, shortcutHideLabel] of [["iconHidden", "隐藏图标"], ["labelHidden", "隐藏名称"]]) {
      const checked10 = createEl("input");
      checked10.type = "checkbox";
      checked10.checked = icon2[shortcutHideKey] === true;
      checked10.onchange = () => {
        icon2[shortcutHideKey] = checked10.checked;
        mountRuntime();
      };
      appendSetting(shortcutVisibilityRow, shortcutHideLabel, checked10);
    }
    const shortcutSizeGrid = createEl("div", "i3d-coordinate-grid i3d-size-grid i3d-shortcut-size-grid");
    focusQueue.append(shortcutSizeGrid);
    for (const [shortcutSizeKey, shortcutSizeLabel, shortcutSizeDefault] of [["size", "按钮大小（px）", 44], ["iconSize", "图标大小（px）", 26], ["fontSize", "文字大小（px）", 12], ["hitSize", "触控范围（px）", 44]]) {
      appendPositiveInput(shortcutSizeGrid, shortcutSizeLabel, () => icon2[shortcutSizeKey] || shortcutSizeDefault, shortcutSizeValue => {
        icon2[shortcutSizeKey] = shortcutSizeValue;
        mountRuntime();
      });
    }
    const shortcutCoordGrid = createEl("div", "i3d-coordinate-grid");
    focusQueue.append(shortcutCoordGrid);
    for (const toUpperCase2 of ["x", "y"]) {
      appendBoundedInput(shortcutCoordGrid, "位置 " + toUpperCase2.toUpperCase(), icon2[toUpperCase2], -1000000, 1000000, 1, shortcutCoordValue => {
        icon2[toUpperCase2] = shortcutCoordValue;
        mountRuntime();
      });
    }
    appendBoundedInput(shortcutCoordGrid, "高度（米）", icon2.height ?? 0.08, 0, 20, 0.1, height2 => {
      icon2.height = height2;
      mountRuntime();
    });
    focusQueue.append(createEl("p", "i3d-note", "拖动按钮调整位置，拖动空白处旋转户型。点击只执行绑定指令，不弹窗、不聚焦。"));
    const shortcutBatchSection = createEl("section", "navigation-batch-section i3d-light-batch");
    const disabled16 = accessAllowed("一键应用到其他快捷按钮", () => appendNumber(icon2));
    shortcutBatchSection.append(createEl("h4", "", "图标设置一键应用"), disabled16);
    focusQueue.append(shortcutBatchSection);
    updateBatchApplyState = () => {
      disabled16.disabled = !resolveLightCapability(icon2).length || !capabilityCache;
    };
    updateBatchApplyState();
  }
  function rebuildConfigSidebar() {
    refreshEffectCapabilityUi = () => {};
    updateBatchApplyState = () => {};
    focusQueue.replaceChildren();
    if (isVacuumShortcut) {
      renderVacuumShortcutSidebar();
      return;
    }
    if (!isNonLight && effectRangeOpen.lightingMode === "region") {
      const disabled10 = accessAllowed("编辑照射范围", async () => {
        if (!resizeObserver) {
          resizeObserver = true;
          disabled10.disabled = true;
          try {
            const close = await openInteraction3dRangeEditor({
              component: {
                ...component,
                properties: structuredClone(getPreviewProperties())
              },
              document: doc,
              states,
              onSave(savedRegionOverrides) {
                if (refreshCapabilities || !capabilityCache) {
                  throw new Error("灯光配置已关闭，请重新打开。");
                }
                effectRangeOpen.lightRegionOverrides = structuredClone(savedRegionOverrides);
                mountRuntime();
              },
              onClose() {
                closeEditor = null;
                resizeObserver = false;
                if (!refreshCapabilities) {
                  rebuildConfigSidebar();
                }
              }
            });
            if (refreshCapabilities || !capabilityCache) {
              close.close();
              return;
            }
            closeEditor = close;
          } catch (message3) {
            resizeObserver = false;
            if (!refreshCapabilities) {
              pickerGeneration.textContent = message3.message;
            }
          } finally {
            if (!refreshCapabilities) {
              rebuildConfigSidebar();
            }
          }
        }
      });
      disabled10.dataset.interaction3dRangeEditor = "true";
      disabled10.disabled = resizeObserver || !effectRangeOpen.sceneId;
      focusQueue.append(disabled10, createEl("p", "i3d-note", "在独立弹窗中拖动范围；保存范围后，再点击“保存配置”保存到当前控件。"));
    }
    if (draftRevision) {
      if (isDeviceMode) {
        appendPositiveNumber(focusQueue, "设备类别", [["nas", "NAS"], ["television", "电视"]], deviceKindLocal, sidebarDeviceKind => {
          if (sidebarDeviceKind !== deviceKindLocal) {
            reopenEditorAs(sidebarDeviceKind);
          }
        });
      }
      appendPositiveNumber(focusQueue, "配置楼层", draftRevision.floors.map(id27 => [id27.id, id27.name]), syncPreviewSize, selectedFloorId => {
        syncPreviewSize = selectedFloorId;
        mountRuntime();
        rebuildConfigSidebar();
      });
      const itemListHeading = createEl("div", "i3d-light-heading");
      const floorTargets = listFloorTargets();
      const length5 = listAvailableTargets();
      const disabled11 = accessAllowed("添加" + stageLabel, openAddDialog);
      disabled11.disabled = !length5.length || getCurrentItems().length >= 128;
      const addBlockedHint = unavailableAddHint(length5, floorTargets);
      disabled11.title = addBlockedHint;
      itemListHeading.append(createEl("h4", "", isDeviceMode ? "设备列表" : stageLabel + "按钮"), disabled11);
      focusQueue.append(itemListHeading);
      const some2 = getCurrentItems().filter(floorId3 => floorId3.floorId === syncPreviewSize || isNonLight && !draftRevision.floors.some(id15 => id15.id === floorId3.floorId));
      if (addBlockedHint && !length5.length && some2.length) {
        focusQueue.append(createEl("p", "i3d-note", addBlockedHint));
      }
      if (!some2.some(id28 => id28.id === saving)) {
        saving = some2[0]?.id || "";
      }
      if (some2.length) {
        appendPositiveNumber(focusQueue, isDeviceMode ? "当前设备" : "当前按钮", some2.map(id24 => [id24.id, id24.label]), saving, selectedItemId => {
          pickerSession++;
          close6?.close();
          saving = selectedItemId;
          mountRuntime();
          rebuildConfigSidebar();
        });
      }
      const statusSource = getCurrentItems().find(id29 => id29.id === saving);
      if (statusSource) {
        const className7 = accessAllowed(isDeviceMode ? "删除此设备" : "删除此" + stageLabel + "按钮", () => {
          pickerSession++;
          close6?.close();
          setCurrentItems(getCurrentItems().filter(id10 => id10.id !== statusSource.id));
          saving = "";
          mountRuntime();
          rebuildConfigSidebar();
        });
        className7.className = "i3d-remove-light";
        focusQueue.append(className7);
        if (isDeviceMode) {
          const deviceTypeReadonly = createEl("input");
          deviceTypeReadonly.value = isTelevision ? "电视" : "NAS";
          deviceTypeReadonly.readOnly = true;
          appendSetting(focusQueue, "设备类型", deviceTypeReadonly);
        }
        const itemNameInput = createEl("input");
        itemNameInput.value = statusSource.label;
        itemNameInput.maxLength = 128;
        itemNameInput.addEventListener("change", () => {
          statusSource.label = itemNameInput.value.trim() || stageLabel;
          mountRuntime();
        });
        appendSetting(focusQueue, "名称", itemNameInput);
        if (isNonLight) {
          const some = draftRevision.floors.filter(id13 => id13.id === syncPreviewSize).flatMap(id16 => (id16[statusNote] || []).filter(id3 => !getCurrentItems().some(floorId => floorId !== statusSource && floorId.floorId === id16.id && floorId.modelId === id3.id)).map(model => ({
            floor: id16,
            model,
            key: id16.id + "/" + model.id
          })));
          const boundModelKey = statusSource.floorId + "/" + statusSource.modelId;
          const boundModelStillExists = some.some(key3 => key3.key === boundModelKey);
          const unshift = some.map(key4 => [key4.key, draft(key4.model)]);
          if (!boundModelStillExists) {
            unshift.unshift([boundModelKey, "原模型已移除，请重新选择"]);
          }
          appendPositiveNumber(focusQueue, "关联" + stageLabel + "模型", unshift, boundModelKey, selectedModelKey => {
            const floor = some.find(key => key.key === selectedModelKey);
            if (!!floor && selectedModelKey !== boundModelKey) {
              statusSource.floorId = floor.floor.id;
              statusSource.modelId = floor.model.id;
              delete statusSource.focusCamera;
              delete statusSource.followCamera;
              mountRuntime();
              rebuildConfigSidebar();
            }
          });
          if (!boundModelStillExists) {
            focusQueue.append(createEl("p", "i3d-note", "原模型已移除，请重新选择。已保存的实体绑定和按钮设置仍然保留。"));
          }
        }
        if (isCover) {
          appendPositiveNumber(focusQueue, "开合方向", [["auto", "继承模型"], ["left", "单开 · 向左收拢"], ["right", "单开 · 向右收拢"], ["split", "双开 · 向两侧收拢"]], statusSource.coverDirection, coverDirectionChoice => {
            statusSource.coverDirection = ["left", "right", "split"].includes(coverDirectionChoice) ? coverDirectionChoice : "auto";
            mountRuntime();
          });
        }
        if (isCover) {
          const addEventListener2 = createEl("input");
          Object.assign(addEventListener2, {
            type: "checkbox",
            checked: statusSource.iconStateReversed === true
          });
          addEventListener2.addEventListener("change", () => {
            statusSource.iconStateReversed = addEventListener2.checked;
            mountRuntime();
          });
          appendSetting(focusQueue, "图标状态反向", addEventListener2);
        }
        const openItemPicker = async (itemPickerKind, trigger) => {
          const itemPickerSession = ++pickerSession;
          pickerGeneration.textContent = "";
          try {
            const pickerOpener = pickers?.[itemPickerKind === "powerEntity" ? "entity" : itemPickerKind];
            if (!pickerOpener) {
              throw new Error("选择器尚未准备好，请保存后刷新页面。");
            }
            const close2 = await pickerOpener({
              trigger,
              deviceKind: itemPickerKind === "powerEntity" ? "television-power" : deviceKindLocal,
              current: itemPickerKind === "vacuum" ? statusSource.deviceId : itemPickerKind === "powerEntity" ? statusSource.powerEntityId : itemPickerKind === "nas" ? statusSource.statusSource?.deviceId : itemPickerKind === "icon" ? statusSource.icon : statusSource.entityId,
              onSelect(deviceId) {
                if (!refreshCapabilities && !!capabilityCache && itemPickerSession === pickerSession && !!getCurrentItems().includes(statusSource)) {
                  if (itemPickerKind === "vacuum") {
                    statusSource.deviceId = deviceId?.deviceId || "";
                    statusSource.deviceName = deviceId?.name || "";
                    statusSource.entityId = deviceId?.entities.length === 1 ? deviceId.entities[0].entityId : "";
                    statusSource.relatedEntityIds = deviceId?.relatedEntityIds || [];
                    statusSource.map = {
                      entityId: deviceId?.maps.length === 1 ? deviceId.maps[0].entityId : ""
                    };
                    if (deviceId) {
                      statusSource.label = deviceId.name;
                      get5.set(deviceId.deviceId, deviceId);
                    }
                  } else if (itemPickerKind === "powerEntity") {
                    if (deviceId) {
                      statusSource.powerEntityId = deviceId;
                    } else {
                      delete statusSource.powerEntityId;
                    }
                  } else if (itemPickerKind === "nas") {
                    if (deviceId) {
                      if (statusSource.statusSource?.deviceId === deviceId.deviceId) {
                        const items = new Map(statusSource.statusSource.metrics.map((entityId2, arg) => [entityId2.entityId, arg]));
                        deviceId.metrics.sort((entityId4, entityId5) => (items.get(entityId4.entityId) ?? Infinity) - (items.get(entityId5.entityId) ?? Infinity));
                      }
                      if (statusSource.statusSource?.deviceId === deviceId.deviceId && Array.isArray(statusSource.statusSource.groupOrder)) {
                        deviceId.groupOrder = [...statusSource.statusSource.groupOrder];
                      }
                      if (statusSource.statusSource?.deviceId === deviceId.deviceId && Array.isArray(statusSource.statusSource.visibleMetrics)) {
                        const has = new Set(statusSource.statusSource.visibleMetrics);
                        deviceId.visibleMetrics = deviceId.metrics.filter(entityId => has.has(entityId.entityId)).map(entityId3 => entityId3.entityId);
                      }
                      statusSource.statusSource = deviceId;
                      statusSource.entityId = "";
                      statusSource.clickAction = "focus-panel";
                    } else {
                      delete statusSource.statusSource;
                    }
                  } else if (itemPickerKind === "icon") {
                    statusSource.icon = deviceId;
                  } else {
                    statusSource.entityId = deviceId;
                  }
                  mountRuntime();
                  rebuildConfigSidebar();
                }
              }
            });
            if (refreshCapabilities || !capabilityCache || itemPickerSession !== pickerSession) {
              close2?.close();
            } else {
              close6 = close2;
            }
          } catch (message4) {
            if (!refreshCapabilities && itemPickerSession === pickerSession) {
              pickerGeneration.textContent = message4.message;
            }
          }
        };
        const name2 = entities.find(entityId18 => entityId18.entityId === statusSource.entityId);
        if (isNas) {
          const className2 = accessAllowed(statusSource.statusSource?.name || "选择飞牛或群晖", () => void openItemPicker("nas", className2));
          className2.className = "i3d-picker-button";
          appendSetting(focusQueue, "NAS 数据来源", className2);
          if (statusSource.statusSource) {
            const nasVisibleMetricCount = statusSource.statusSource.visibleMetrics?.length ?? statusSource.statusSource.metrics.length;
            const className = accessAllowed("选择显示内容（" + nasVisibleMetricCount + " 项）", () => appendSelect(statusSource));
            className.className = "i3d-picker-button";
            focusQueue.append(className);
          }
          focusQueue.append(createEl("p", "i3d-note", statusSource.statusSource ? "已匹配 " + statusSource.statusSource.metrics.length + " 项状态。点击数据来源可重新匹配；弹窗只展示状态。" : "选择整台 NAS，自动匹配 CPU、内存、温度、存储和网络。无需逐个选择传感器。"));
        }
        const className8 = accessAllowed("", () => void openItemPicker("entity", className8));
        className8.className = "i3d-picker-button";
        className8.title = statusSource.entityId || (isNonLight ? "选择" + stageLabel + "实体" : "选择灯或开关");
        className8.append(createEl("span", "", name2?.name || statusSource.entityId || (isNonLight ? "选择" + stageLabel + "实体" : "选择灯或开关")));
        if (!isVacuum && (!isNas || !statusSource.statusSource)) {
          appendSetting(focusQueue, isNas ? "原开启实体（未关联 NAS）" : "绑定实体", className8);
        }
        if (isVacuum) {
          const followOffsetInput = createEl("input");
          Object.assign(followOffsetInput, {
            type: "number",
            min: "0",
            max: "300",
            step: "1",
            value: String(effectRangeOpen.navigation?.followOffset ?? 16),
            title: "所有扫地机共用此标签偏移"
          });
          followOffsetInput.addEventListener("change", () => {
            if (!capabilityCache || refreshCapabilities) {
              return;
            }
            const followOffsetValue = followOffsetInput.value.trim() === "" ? NaN : Number(followOffsetInput.value);
            if (Number.isFinite(followOffsetValue)) {
              effectRangeOpen.navigation = {
                ...effectRangeOpen.navigation,
                followOffset: Math.max(0, Math.min(300, followOffsetValue))
              };
              mountRuntime();
            }
            followOffsetInput.value = String(effectRangeOpen.navigation?.followOffset ?? 16);
          });
          appendSetting(focusQueue, "跟随标签上移（px）", followOffsetInput);
          for (const [vacuumToggleKey, vacuumToggleLabel] of [["motionEnabled", "跟随真实位置移动"], ["funMessages", "工作时显示趣味短句"]]) {
            const addEventListener = createEl("input");
            Object.assign(addEventListener, {
              type: "checkbox",
              checked: statusSource[vacuumToggleKey] !== false
            });
            addEventListener.addEventListener("change", () => {
              statusSource[vacuumToggleKey] = addEventListener.checked;
              mountRuntime();
            });
            appendSetting(focusQueue, vacuumToggleLabel, addEventListener);
          }
          const className3 = accessAllowed(statusSource.deviceName || "选择扫地机设备", () => void openItemPicker("vacuum", className3));
          className3.className = "i3d-picker-button";
          appendSetting(focusQueue, "绑定设备", className3);
          const entities2 = get5.get(statusSource.deviceId) || {
            entities: entities.filter(entityId10 => /^vacuum\./.test(entityId10.entityId) && (entityId10.deviceId === statusSource.deviceId || entityId10.entityId === statusSource.deviceId)),
            maps: entities.filter(entityId11 => /^(camera|image)\./.test(entityId11.entityId) && entityId11.deviceId === statusSource.deviceId)
          };
          if (entities2?.entities.length > 1) {
            appendPositiveNumber(focusQueue, "扫地机主实体", [["", "请选择主实体"], ...entities2.entities.map(entityId7 => [entityId7.entityId, entityId7.name || entityId7.entityId])], statusSource.entityId, entityId13 => {
              statusSource.entityId = entityId13;
              mountRuntime();
            });
          } else if (statusSource.entityId) {
            focusQueue.append(createEl("p", "i3d-note", "已识别：" + statusSource.entityId));
          }
          if (entities2?.maps.length > 1) {
            appendPositiveNumber(focusQueue, "已识别的地图", [["", "请选择地图"], ...entities2.maps.map(entityId8 => [entityId8.entityId, entityId8.name || entityId8.entityId])], statusSource.map?.entityId || "", entityId14 => {
              statusSource.map = {
                ...statusSource.map,
                entityId: entityId14
              };
              mountRuntime();
              rebuildConfigSidebar();
            });
          }
          const trigger2 = accessAllowed(statusSource.map?.entityId || "选择扫地机地图", async () => {
            const mapPickerSession = ++pickerSession;
            try {
              close6 = await pickers.entity({
                trigger: trigger2,
                deviceKind: "vacuum-map",
                current: statusSource.map?.entityId || "",
                onSelect(entityId6) {
                  if (!refreshCapabilities && !!capabilityCache && mapPickerSession === pickerSession && !!getCurrentItems().includes(statusSource)) {
                    statusSource.map = {
                      ...statusSource.map,
                      entityId: entityId6
                    };
                    mountRuntime();
                    rebuildConfigSidebar();
                  }
                }
              });
            } catch (message) {
              pickerGeneration.textContent = message.message;
            }
          });
          trigger2.className = "i3d-picker-button";
          appendSetting(focusQueue, "地图来源", trigger2);
          const openMapAlignButton = accessAllowed("底图对齐", () => {
            const mapEntityState = latestStatesByEntity === null ? states?.get?.(statusSource.map?.entityId) : latestStatesByEntity[statusSource.map?.entityId];
            const vacuumEntityState = latestStatesByEntity === null ? states?.get?.(statusSource.entityId) : latestStatesByEntity[statusSource.entityId];
            const sourceMapId = vacuumMapIdentity(mapEntityState, vacuumEntityState);
            const map2 = {
              ...statusSource,
              map: {
                ...statusSource.map
              }
            };
            if (sourceMapId) {
              map2.map.sourceMapId = sourceMapId;
            } else {
              delete map2.map.sourceMapId;
            }
            closeEditor = openVacuumMapEditor({
              item: map2,
              floor: draftRevision.floors.find(id => id.id === statusSource.floorId),
              document: doc,
              pickers,
              onSave(map) {
                if (!refreshCapabilities && capabilityCache && getCurrentItems().includes(statusSource)) {
                  statusSource.map = map.map;
                  mountRuntime();
                  rebuildConfigSidebar();
                }
              }
            });
          });
          focusQueue.append(openMapAlignButton);
        }
        if (isTelevision) {
          const className4 = accessAllowed(statusSource.powerEntityId || "不单独绑定", () => void openItemPicker("powerEntity", className4));
          className4.className = "i3d-picker-button";
          appendSetting(focusQueue, "电视电源状态（可选）", className4);
          focusQueue.append(createEl("p", "i3d-note", "绑定 Apple TV 的 media_player 实体，同步封面、应用、节目和播放状态。电源状态可单独绑定电视；弹窗只读，不同步实际视频。"));
        }
        if (isNas) {
          focusQueue.append(createEl("p", "i3d-note", statusSource.statusSource ? "已选择 NAS 自身状态数据作为呼吸灯依据。安全状态只用于告警。" : "请先选择 NAS 数据来源。原来的试绑实体不会自动作为 NAS 数据来源。"));
        }
        appendPositiveNumber(focusQueue, "点击" + stageLabel, isDeviceLike ? [["focus-panel", "聚焦并显示状态"], ["panel", "仅显示状态"], ["focus", "仅聚焦"]] : isCover ? [["focus", "聚焦并显示控制"], ["panel", "仅显示控制"]] : isClimate ? [["focus", "聚焦并显示控制"], ["turn-on-focus", "聚焦并开启"], ["turn-on", "仅开关空调"], ["turn-on-panel", "开启并显示控制"]] : [["focus", "仅聚焦"], ["turn-on-focus", "聚焦并开灯"], ["turn-on", "仅开关灯"], ["turn-on-panel", "开灯并弹窗"]], statusSource.clickAction, clickActionChoice => {
          statusSource.clickAction = sceneMeta(clickActionChoice);
          mountRuntime();
        });
        const visibilityRow = createEl("div", "i3d-button-visibility-row");
        focusQueue.append(visibilityRow);
        const checked7 = createEl("input");
        Object.assign(checked7, {
          type: "checkbox",
          checked: statusSource.hiddenClickable === true && statusSource.buttonHidden !== true
        });
        checked7.addEventListener("change", () => {
          statusSource.hiddenClickable = checked7.checked;
          if (checked7.checked) {
            statusSource.buttonHidden = false;
            checked8.checked = false;
          }
          mountRuntime();
        });
        appendSetting(visibilityRow, "隐藏（可点击）", checked7).parentElement.className += " i3d-hidden-clickable-setting";
        const checked8 = createEl("input");
        Object.assign(checked8, {
          type: "checkbox",
          checked: statusSource.buttonHidden === true
        });
        checked8.addEventListener("change", () => {
          statusSource.buttonHidden = checked8.checked;
          if (checked8.checked) {
            statusSource.hiddenClickable = false;
            checked7.checked = false;
          }
          mountRuntime();
        });
        appendSetting(visibilityRow, "隐藏（不可点击）", checked8).parentElement.className += " i3d-hidden-clickable-setting";
        if (!isVacuum) {
          const className5 = accessAllowed("", () => void openItemPicker("icon", className5));
          className5.className = "i3d-picker-button i3d-icon-picker-button";
          const style = createEl("i");
          style.setAttribute("aria-hidden", "true");
          const iconSvgUrl = "/bridge-static/vendor/mdi/7.4.47/svg/" + statusSource.icon.replace(/^mdi:/, "") + ".svg";
          style.style.maskImage = "url(\"" + iconSvgUrl + "\")";
          style.style.webkitMaskImage = "url(\"" + iconSvgUrl + "\")";
          className5.append(style, createEl("span", "", statusSource.icon));
          appendSetting(focusQueue, "图标", className5);
        }
        const sizeGrid = createEl("div", "i3d-coordinate-grid i3d-size-grid");
        focusQueue.append(sizeGrid);
        const resolveHitSize = () => Number.isFinite(statusSource.hitSize) && statusSource.hitSize > 0 ? statusSource.hitSize : Math.max(44, statusSource.size);
        appendPositiveInput(sizeGrid, isVacuum ? "状态框缩放（%）" : "按钮大小（px）", () => isVacuum ? Math.round(statusSource.size / 44 * 100) : statusSource.size, sizeInputValue => {
          statusSource.size = isVacuum ? sizeInputValue / 100 * 44 : sizeInputValue;
          hitSizeInput.value = String(Number(resolveHitSize().toPrecision(12)));
          mountRuntime();
        });
        appendPositiveInput(sizeGrid, isVacuum ? "文字大小（px）" : "图标大小（px）", () => isVacuum ? statusSource.iconSize / 2 : statusSource.iconSize, iconSizeInputValue => {
          statusSource.iconSize = isVacuum ? iconSizeInputValue * 2 : iconSizeInputValue;
          mountRuntime();
        });
        const hitSizeInput = appendPositiveInput(sizeGrid, "触控范围（px）", resolveHitSize, hitSize => {
          statusSource.hitSize = hitSize;
          mountRuntime();
        });
        if (isNonLight) {
          const elevation = draftRevision.floors.find(id11 => id11.id === statusSource.floorId)?.[statusNote]?.find(id17 => id17.id === statusSource.modelId);
          const modelCoordGrid = createEl("div", "i3d-coordinate-grid");
          focusQueue.append(modelCoordGrid);
          const disabled4 = accessAllowed("恢复跟随模型", () => {
            delete statusSource.x;
            delete statusSource.y;
            delete statusSource.height;
            mountRuntime();
            rebuildConfigSidebar();
          });
          disabled4.disabled = !["x", "y", "height"].some(positionKey => Number.isFinite(statusSource[positionKey]));
          for (const [coordKey, coordLabel, coordMin, coordMax, coordStep] of [["x", "位置 X", -1000000, 1000000, 1], ["y", "位置 Y", -1000000, 1000000, 1], ["height", "高度（米）", 0, 20, 0.1]]) {
            const coordCurrent = Number.isFinite(statusSource[coordKey]) ? statusSource[coordKey] : isVacuum && coordKey === "height" ? (Number(elevation?.elevation) || 0) + (Number(elevation?.height) || 0.85) + 0.25 : Number.isFinite(elevation?.[coordKey]) ? elevation[coordKey] : 0;
            appendBoundedInput(modelCoordGrid, isVacuum && coordKey === "height" ? "离地高度（米）" : coordLabel, coordCurrent, coordMin, coordMax, coordStep, positionValue => {
              statusSource[coordKey] = positionValue;
              disabled4.disabled = false;
              mountRuntime();
            });
          }
          focusQueue.append(disabled4);
          const append = createEl("section", "navigation-batch-section i3d-light-batch");
          const batchSectionTitle = createEl("h4");
          const textContent = createEl("span");
          batchSectionTitle.append(createEl("span", "", "图标设置一键应用"), textContent);
          const disabled5 = accessAllowed("一键应用到其他" + stageLabel, () => appendNumber(statusSource));
          updateBatchApplyState = () => {
            const nonLightDirtyCount = resolveLightCapability(statusSource).length;
            textContent.textContent = nonLightDirtyCount + " 项修改";
            disabled5.disabled = !nonLightDirtyCount || !capabilityCache || saveButton || unsubscribeAccess;
          };
          updateBatchApplyState();
          append.append(batchSectionTitle, disabled5);
          focusQueue.append(append);
        } else {
          const lightCoordGrid = createEl("div", "i3d-coordinate-grid");
          focusQueue.append(lightCoordGrid);
          for (const toUpperCase of ["x", "y"]) {
            appendBoundedInput(lightCoordGrid, "位置 " + toUpperCase.toUpperCase(), statusSource[toUpperCase], -1000000, 1000000, 1, lightPositionValue => {
              statusSource[toUpperCase] = lightPositionValue;
              mountRuntime();
            });
          }
          appendBoundedInput(lightCoordGrid, "高度（米）", statusSource.height, 0, 20, 0.1, height => {
            statusSource.height = height;
            mountRuntime();
          });
          appendBoundedInput(focusQueue, "缓开缓灭（秒）", statusSource.fadeDuration, 0, 10, 0.1, fadeDuration => {
            statusSource.fadeDuration = fadeDuration;
            mountRuntime();
          });
          const contains = createEl("div");
          focusQueue.append(contains);
          const capabilitySignature = known => JSON.stringify([known.known, known.brightnessSupported, known.temperatureSupported, known.minimum, known.maximum]);
          const itemLightCapability = resolveEntityLightState(statusSource);
          let lastCapabilitySignature = capabilitySignature(itemLightCapability);
          refreshEffectCapabilityUi = () => {
            if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || contains.contains?.(document.activeElement)) {
              return;
            }
            const freshLightCapability = resolveEntityLightState(statusSource);
            const freshCapabilitySignature = capabilitySignature(freshLightCapability);
            if (freshCapabilitySignature !== lastCapabilitySignature) {
              lastCapabilitySignature = freshCapabilitySignature;
              renderLightEffectPanel(contains, statusSource, freshLightCapability);
            }
          };
          contains.addEventListener("focusout", () => queueMicrotask(refreshEffectCapabilityUi));
          renderLightEffectPanel(contains, statusSource, itemLightCapability);
          const lightBatchSection = createEl("section", "navigation-batch-section i3d-light-batch");
          const lightBatchTitle = createEl("h4");
          const lightBatchCountEl = createEl("span");
          lightBatchTitle.append(createEl("span", "", "灯光设置一键应用"), lightBatchCountEl);
          const disabled6 = accessAllowed("一键应用到其他灯光", () => appendNumber(statusSource));
          updateBatchApplyState = () => {
            const lightDirtyCount = resolveLightCapability(statusSource).length;
            lightBatchCountEl.textContent = lightDirtyCount + " 项修改";
            disabled6.disabled = !lightDirtyCount || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver;
          };
          updateBatchApplyState();
          lightBatchSection.append(lightBatchTitle, disabled6);
          focusQueue.append(lightBatchSection);
        }
        const focusSettingsSection = createEl("section", "i3d-focus-settings");
        focusQueue.append(focusSettingsSection);
        const activeCameraKey = isVacuum && saveStatus === "follow" ? "followCamera" : "focusCamera";
        focusSettingsSection.append(createEl("h4", "", activeCameraKey === "followCamera" ? "跟随视角" : "聚焦视角"));
        if (isVacuum && !saveButton) {
          const focusModeActions = createEl("div", "i3d-focus-actions");
          for (const [focusModeKey, focusModeLabel] of [["focus", "聚焦视角"], ["follow", "跟随视角"]]) {
            const setAttribute = accessAllowed(focusModeLabel, () => {
              saveStatus = focusModeKey;
              rebuildConfigSidebar();
            });
            setAttribute.setAttribute("aria-pressed", String(saveStatus === focusModeKey));
            setAttribute.disabled = unsubscribeAccess;
            focusModeActions.append(setAttribute);
          }
          focusSettingsSection.append(focusModeActions);
        }
        if (activeCameraKey === "followCamera") {
          focusSettingsSection.append(createEl("p", "i3d-note", "固定鸟瞰角度跟随机器人平移，不随机器人转向。调整角度和远近后保存；跟随时不弹出控制面板。"));
        }
        const runFocusCameraCommand = async (focusCommandName, focusCommandPayload) => {
          const focusCommandGen = cameraCommandGeneration;
          const isFocalLengthCommand = focusCommandName === "focus-focal-length";
          const priorCameraChain = cameraCommandChain;
          let resolveCameraChain;
          cameraCommandChain = new Promise(resolveCameraChainSettle => {
            resolveCameraChain = resolveCameraChainSettle;
          });
          if (!isFocalLengthCommand) {
            unsubscribeAccess = true;
            pickerGeneration.textContent = "";
            rebuildConfigSidebar();
          }
          try {
            await priorCameraChain;
            if (refreshCapabilities || focusCommandGen !== cameraCommandGeneration) {
              return;
            }
            const camera = await liveStates.focusCommand(activeCameraKey === "followCamera" && focusCommandName === "edit-light-camera" ? "edit-follow-camera" : focusCommandName, statusSource.id, focusCommandPayload);
            if (refreshCapabilities || focusCommandGen !== cameraCommandGeneration) {
              return;
            }
            if (focusCommandName === "save-light-camera") {
              statusSource[activeCameraKey] = camera.camera;
              saveButton = false;
              mode = null;
              mountRuntime();
            } else if (focusCommandName === "cancel-light-camera") {
              saveButton = false;
              mode = null;
            } else if (focusCommandName !== "preview-light-camera") {
              saveButton = true;
              mode = camera.camera;
            }
          } catch (message5) {
            if (!refreshCapabilities && focusCommandGen === cameraCommandGeneration) {
              pickerGeneration.textContent = message5.message;
            }
          } finally {
            resolveCameraChain();
            if (!refreshCapabilities && focusCommandGen === cameraCommandGeneration && !isFocalLengthCommand) {
              unsubscribeAccess = false;
              rebuildConfigSidebar();
            }
          }
        };
        const focusActionsRow = createEl("div", "i3d-focus-actions");
        focusSettingsSection.append(focusActionsRow);
        if (saveButton) {
          const className6 = accessAllowed(isNonLight ? "保存此" + stageLabel + "视角" : "保存此灯视角", () => void runFocusCameraCommand("save-light-camera"));
          className6.className = "primary";
          focusActionsRow.append(className6, accessAllowed("取消调整", () => void runFocusCameraCommand("cancel-light-camera")));
          const projectionGroup = createEl("div", "i3d-focus-actions");
          projectionGroup.setAttribute("role", "group");
          projectionGroup.setAttribute("aria-label", "聚焦投影");
          focusSettingsSection.append(projectionGroup);
          for (const [projectionMode, projectionLabel] of [["orthographic", "正交"], ["perspective", "透视"]]) {
            const projectionButton = accessAllowed(projectionLabel, () => void runFocusCameraCommand("focus-projection", projectionMode));
            projectionButton.setAttribute("aria-pressed", String((mode?.mode || "orthographic") === projectionMode));
            projectionGroup.append(projectionButton);
          }
          const disabled7 = appendBoundedInput(focusSettingsSection, "焦段（mm）", Math.round(mode?.focalLength || 50), 18, 120, 1, focalLengthValue => void runFocusCameraCommand("focus-focal-length", focalLengthValue));
          disabled7.disabled = mode?.mode !== "perspective";
        } else {
          focusActionsRow.append(accessAllowed(statusSource[activeCameraKey] ? "调整视角" : "设置视角", () => void runFocusCameraCommand("edit-light-camera")), ...(activeCameraKey === "followCamera" ? [] : [accessAllowed("预览聚焦", () => void runFocusCameraCommand("preview-light-camera"))]));
          const disabled8 = accessAllowed(activeCameraKey === "followCamera" ? "恢复默认鸟瞰" : statusSource[activeCameraKey] ? "恢复自动聚焦" : "自动聚焦", async () => {
            try {
              await liveStates.focusCommand("cancel-light-camera", statusSource.id);
              delete statusSource[activeCameraKey];
              mountRuntime();
              rebuildConfigSidebar();
            } catch (message2) {
              pickerGeneration.textContent = message2.message;
            }
          });
          disabled8.disabled = !statusSource[activeCameraKey];
          disabled8.className = "i3d-focus-reset";
          focusSettingsSection.append(disabled8);
        }
        if (unsubscribeAccess) {
          for (const disabled3 of focusSettingsSection.querySelectorAll("button, input")) {
            disabled3.disabled = true;
          }
        }
      } else {
        const emptyListHint = length5.length ? isVacuum ? "点击“添加扫地机”，选择模型后绑定扫地机设备。" : isTelevision || isNas ? "点击“添加设备”，选择" + (isTelevision ? "电视模型并绑定媒体播放器实体。" : "设备类型和模型，再绑定开启实体。") : isCover ? "点击“添加窗帘”，选择需要控制的窗帘模型。" : isClimate ? "点击“添加空调”，选择需要控制的空调模型。" : "点击“添加灯光”，选择需要控制的灯组。" : unavailableAddHint(length5, floorTargets);
        focusQueue.append(createEl("p", "i3d-note", emptyListHint));
      }
    }
    focusQueue.append(pickerGeneration);
    disabled17.disabled = isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess;
    if (saveButton || unsubscribeAccess) {
      for (const closest of focusQueue.querySelectorAll("input, select, button")) {
        if (!closest.closest(".i3d-focus-settings")) {
          closest.disabled = true;
        }
      }
    }
    if (resizeObserver) {
      for (const dataset of focusQueue.querySelectorAll("input, select, button")) {
        if (dataset.dataset.interaction3dRangeEditor !== "true") {
          dataset.disabled = true;
        }
      }
    }
  }
  function mountPreviewRuntime() {
    liveStates = mountInteraction3d(previewHost, {
      component: {
        ...component,
        properties: getPreviewProperties()
      },
      context: {
        document: doc,
        states
      },
      editing: true,
      editingVacuumId: isVacuumShortcut ? vacuumId : "",
      editingModule: isDeviceLike ? deviceKindLocal : isCover ? "cover" : isClimate ? "climate" : "light",
      onStates(incomingStates) {
        if (!refreshCapabilities) {
          latestStatesByEntity = incomingStates;
          if (!isNonLight) {
            for (const value of getCurrentItems()) {
              resolveEntityLightState(value);
            }
          }
          refreshEffectCapabilityUi();
        }
      },
      onReady(readyDraft) {
        cameraCommandGeneration++;
        saveButton = false;
        unsubscribeAccess = false;
        mode = null;
        draftRevision = readyDraft;
        if (!draftRevision.floors.some(id18 => id18.id === syncPreviewSize)) {
          syncPreviewSize = draftRevision.floors[0]?.id || "";
        }
        rebuildConfigSidebar();
        mountRuntime();
        if (startAdding) {
          startAdding = false;
          queueMicrotask(openAddDialog);
        }
      },
      onEdit(action) {
        if (!refreshCapabilities && !!capabilityCache && !close5 && !close7) {
          if (action.action === "light-region-overrides") {
            effectRangeOpen.lightRegionOverrides = structuredClone(action.overrides || {});
            dirtyRevision++;
            if (!isSavingConfig) {
              saveStatusEl.textContent = "";
            }
          }
          if (isVacuumShortcut) {
            const id19 = getCurrentItems().find(id4 => "vacuum-room:" + vacuumId + ":" + id4.id === action.id);
            if (id19) {
              saving = id19.id;
              if (action.action === "position") {
                id19.x = action.x;
                id19.y = action.y;
                mountRuntime();
              }
              rebuildConfigSidebar();
              if (action.action === "select") {
                mountRuntime();
              }
            }
            return;
          }
          if (isVacuum && action.id?.startsWith("vacuum-room:")) {
            const id20 = getCurrentItems().find(shortcuts => (shortcuts.shortcuts || []).some(id2 => "vacuum-room:" + shortcuts.id + ":" + id2.id === action.id));
            const x = id20?.shortcuts.find(id5 => "vacuum-room:" + id20.id + ":" + id5.id === action.id);
            if (x) {
              saving = id20.id;
              if (action.action === "position") {
                x.x = action.x;
                x.y = action.y;
                mountRuntime();
              }
              if (action.action === "select") {
                rebuildConfigSidebar();
              }
            }
            return;
          }
          if (action.action === "focus-exited") {
            saveButton = false;
            mode = null;
            rebuildConfigSidebar();
          }
          if (action.action === "select") {
            saving = action.id;
            rebuildConfigSidebar();
            mountRuntime();
          }
          if (action.action === "position") {
            const x2 = getCurrentItems().find(id6 => id6.id === action.id);
            if (x2) {
              x2.x = action.x;
              x2.y = action.y;
              rebuildConfigSidebar();
              mountRuntime();
            }
          }
          if (action.action === "camera") {
            effectRangeOpen.floorCameras = {
              ...effectRangeOpen.floorCameras,
              [syncPreviewSize]: action.camera
            };
            if (syncPreviewSize === effectRangeOpen.floorSelection) {
              effectRangeOpen.camera = action.camera;
            }
            pickerGeneration.textContent = "默认视角已记录，保存配置后生效。";
          }
        }
      }
    });
  }
  const unsubscribeAccessWatch = subscribeInteraction3dAccess(status => {
    if (!refreshCapabilities) {
      capabilityCache = status.allowed;
      disabled17.disabled = isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess;
      focusQueue.inert = !capabilityCache;
      accessStatusEl.hidden = capabilityCache || !!liveStates && status.status !== "denied";
      accessStatusEl.textContent = status.status === "denied" || status.status === "unavailable" ? status.message : "正在准备户型…";
      if (capabilityCache) {
        if (liveStates) {
          liveStates.setAuthorized(true);
        } else {
          mountPreviewRuntime();
        }
      } else {
        closeAddDialog();
        renderSidebar();
        closeEditor?.close();
        pickerSession++;
        close6?.close();
        cameraCommandGeneration++;
        saveButton = false;
        unsubscribeAccess = false;
        mode = null;
        rebuildConfigSidebar();
        liveStates?.setAuthorized(false);
        if (status.status === "denied") {
          liveStates?.();
          liveStates = null;
          rebuildConfigSidebar();
        }
      }
    }
  });
  rebuildConfigSidebar();
  editorDialog.showModal();
  document.dispatchEvent(new Event("hb-i3d-preview-scope"));
  fitPreviewAspect();
}
export async function openInteraction3dAppearanceEditor({
  component: appearanceComponent,
  onSave: appearanceOnSave
}) {
  await requestInteraction3dAccess();
  const editorView = getInteraction3dEditorView(appearanceComponent.id);
  if (!editorView?.metadata) {
    throw new Error("户型还在加载，请稍候再打开进阶设置。");
  }
  const appearanceProps = structuredClone(appearanceComponent.properties || {});
  const baseLighting = normalizeInteraction3dLightingMode(appearanceProps.lightingMode) === "region";
  let floorBrightness = {
    ...editorView.metadata.defaults,
    ...structuredClone(appearanceProps.baseLighting || editorView.metadata.baseLighting)
  };
  let appearanceStylesheet = false;
  if (baseLighting) {
    floorBrightness.floorBrightness ??= 100;
  }
  const rel2 = document.createElement("link");
  rel2.rel = "stylesheet";
  rel2.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15";
  document.head.append(rel2);
  const createEl = (appearanceTag, element6 = "") => {
    const appearanceNode = document.createElement(appearanceTag);
    appearanceNode.textContent = element6;
    return appearanceNode;
  };
  const getBoundingClientRect = createEl("dialog");
  getBoundingClientRect.className = "i3d-editor i3d-appearance-editor";
  getBoundingClientRect.setAttribute("aria-label", "户型进阶设置");
  const addEventListener3 = createEl("header");
  const appearanceBody = createEl("div");
  appearanceBody.className = "i3d-appearance-body";
  const className18 = createEl("p");
  className18.className = "i3d-error";
  className18.setAttribute("role", "status");
  let id41;
  const positionAppearanceDialog = (dialogLeft, dialogTop) => {
    const currentRect = getBoundingClientRect.getBoundingClientRect();
    Object.assign(getBoundingClientRect.style, {
      margin: "0",
      right: "auto",
      bottom: "auto",
      left: Math.max(8, Math.min(dialogLeft, window.innerWidth - currentRect.width - 8)) + "px",
      top: Math.max(8, Math.min(dialogTop, window.innerHeight - currentRect.height - 8)) + "px"
    });
  };
  const clampAppearanceDialog = () => {
    const left = getBoundingClientRect.getBoundingClientRect();
    positionAppearanceDialog(left.left, left.top);
  };
  addEventListener3.title = "按住标题栏拖动";
  addEventListener3.addEventListener("pointerdown", pointerEvent => {
    if (pointerEvent.button !== 0 || pointerEvent.target.closest("button")) {
      return;
    }
    pointerEvent.preventDefault();
    const startRect = getBoundingClientRect.getBoundingClientRect();
    id41 = {
      id: pointerEvent.pointerId,
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
      left: startRect.left,
      top: startRect.top
    };
    addEventListener3.setPointerCapture(pointerEvent.pointerId);
  });
  addEventListener3.addEventListener("pointermove", moveEvent => {
    if (!!id41 && id41.id === moveEvent.pointerId) {
      positionAppearanceDialog(id41.left + moveEvent.clientX - id41.x, id41.top + moveEvent.clientY - id41.y);
    }
  });
  for (const endEventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    addEventListener3.addEventListener(endEventName, () => {
      id41 = null;
    });
  }
  window.addEventListener("resize", clampAppearanceDialog);
  const previewAppearanceLighting = () => editorView.update({
    ...appearanceProps,
    baseLighting: floorBrightness
  });
  const closeAppearanceEditor = (keepAppearancePreview = false) => {
    if (!appearanceStylesheet) {
      appearanceStylesheet = true;
      if (!keepAppearancePreview) {
        editorView.update(appearanceProps);
      }
      window.removeEventListener("resize", clampAppearanceDialog);
      getBoundingClientRect.close();
      getBoundingClientRect.remove();
      rel2.remove();
    }
  };
  const disabled18 = createEl("button", "完成");
  disabled18.type = "button";
  disabled18.addEventListener("click", async () => {
    disabled18.disabled = true;
    try {
      await requestInteraction3dAccess();
      await appearanceOnSave(floorBrightness);
      closeAppearanceEditor(true);
    } catch (doneError) {
      className18.textContent = doneError.message;
      disabled18.disabled = false;
    }
  });
  const type4 = createEl("button", "取消");
  type4.type = "button";
  type4.addEventListener("click", () => closeAppearanceEditor());
  const className19 = createEl("span", "拖动");
  className19.className = "i3d-drag-hint";
  addEventListener3.append(createEl("strong", "户型进阶设置"), className19, disabled18, type4);
  const map = new Map();
  const helpNote = [];
  const APPEARANCE_LIGHTING_SECTIONS = baseLighting ? [["整体画面", APPEARANCE_LIGHTING_SECTIONS[0][1].filter(([, lightingFilterKey]) => lightingFilterKey === "exposure")]] : APPEARANCE_LIGHTING_SECTIONS;
  for (const [sectionTitle, sectionFields] of APPEARANCE_LIGHTING_SECTIONS) {
    const sectionEl = createEl("section");
    const fieldsGrid = createEl("div");
    fieldsGrid.className = "i3d-appearance-grid";
    sectionEl.append(createEl("h4", sectionTitle), fieldsGrid);
    for (const [fieldTitle, fieldKey, fieldMin, fieldMax, fieldStep] of sectionFields) {
      const fieldLabelEl = createEl("label");
      const fieldInput = createEl("input");
      Object.assign(fieldInput, {
        name: "i3d-base-light-" + fieldKey,
        type: "number",
        min: String(fieldMin),
        max: String(fieldMax),
        step: String(fieldStep),
        value: String(floorBrightness[fieldKey])
      });
      fieldInput.addEventListener("input", () => {
        if (Number.isFinite(fieldInput.valueAsNumber)) {
          floorBrightness[fieldKey] = Math.max(fieldMin, Math.min(fieldMax, fieldInput.valueAsNumber));
          previewAppearanceLighting();
        }
      });
      fieldLabelEl.append(createEl("span", fieldTitle), fieldInput);
      fieldsGrid.append(fieldLabelEl);
      map.set(fieldKey, fieldInput);
    }
    appearanceBody.append(sectionEl);
  }
  if (baseLighting) {
    const floorBrightnessSection = createEl("section");
    const floorBrightnessLabel = createEl("label");
    const className10 = createEl("div");
    floorBrightnessSection.append(createEl("h4", "地面颜色"));
    className10.className = "i3d-floor-brightness";
    const floorBrightnessRange = createEl("input");
    const floorBrightnessNumber = createEl("input");
    Object.assign(floorBrightnessRange, {
      type: "range",
      min: "50",
      max: "150",
      step: "1",
      value: String(floorBrightness.floorBrightness)
    });
    Object.assign(floorBrightnessNumber, {
      type: "number",
      name: "i3d-base-light-floorBrightness",
      min: "50",
      max: "150",
      step: "1",
      value: floorBrightnessRange.value
    });
    floorBrightnessRange.setAttribute("aria-label", "地面颜色深浅");
    floorBrightnessNumber.setAttribute("aria-label", "地面亮度百分比");
    const syncFloorBrightness = valueAsNumber => {
      if (Number.isFinite(valueAsNumber.valueAsNumber)) {
        floorBrightness.floorBrightness = Math.max(50, Math.min(150, valueAsNumber.valueAsNumber));
        floorBrightnessRange.value = floorBrightnessNumber.value = String(floorBrightness.floorBrightness);
        previewAppearanceLighting();
      }
    };
    floorBrightnessRange.addEventListener("input", () => syncFloorBrightness(floorBrightnessRange));
    floorBrightnessNumber.addEventListener("input", () => syncFloorBrightness(floorBrightnessNumber));
    className10.append(createEl("span", "深"), floorBrightnessRange, createEl("span", "浅"), floorBrightnessNumber, createEl("span", "%"));
    floorBrightnessLabel.append(className10);
    floorBrightnessSection.append(floorBrightnessLabel, createEl("p", "100% 为原色，仅调整户型地面，保留纹理与阴影。"));
    appearanceBody.insertBefore(floorBrightnessSection, appearanceBody.children[1] || null);
    map.set("floorBrightness", floorBrightnessNumber);
    helpNote.push(() => {
      floorBrightnessRange.value = "100";
    });
  }
  const resetLightingBtn = createEl("button", "恢复默认");
  resetLightingBtn.type = "button";
  resetLightingBtn.addEventListener("click", () => {
    for (const [lightingFieldKey, lightingInput] of map) {
      floorBrightness[lightingFieldKey] = lightingFieldKey === "floorBrightness" ? 100 : editorView.metadata.defaults[lightingFieldKey];
      lightingInput.value = String(floorBrightness[lightingFieldKey]);
    }
    helpNote.forEach(resetFloorBrightnessHook => resetFloorBrightnessHook());
    previewAppearanceLighting();
  });
  const helpNote2 = createEl("p", baseLighting ? "曝光影响整体画面，地面颜色深浅独立调整。完成后点击页面上方保存。" : "调整当前户型的整体光照与阴影。完成后点击页面上方保存，仅保存至当前 3D 控件。");
  helpNote2.className = "i3d-note";
  appearanceBody.append(resetLightingBtn, helpNote2, className18);
  getBoundingClientRect.append(addEventListener3, appearanceBody);
  document.body.append(getBoundingClientRect);
  getBoundingClientRect.addEventListener("cancel", appearanceCancelEvent => {
    appearanceCancelEvent.preventDefault();
    closeAppearanceEditor();
  });
  getBoundingClientRect.showModal();
}
