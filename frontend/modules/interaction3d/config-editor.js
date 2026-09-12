import { vacuumMapIdentity } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { openInteraction3dRangeEditor } from "./range-dialog.js?v=20260910-document-shadow-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
import { mountInteraction3d } from "./runtime.js?v=20260910-control-projectid-v1-20260911-workspace-switch-v1-20260911-security-camera-popup-v6";
import { lightState } from "./light-state.js?v=20260906-i3d-render-recovery-v1";
import { openVacuumMapEditor } from "./vacuum-map-editor.js?v=20260909-curtain-action-v15";
import { nasGroups } from "./nas-panel.js";
import { randomUuid } from "/bridge-static/utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { interaction3dPreviewSize } from "/bridge-static/modules/interaction3d/preview-layout.js?v=20260906-i3d-preview-layout-v1-20260908-curtains-v1";
import { requestInteraction3dAccess, getInteraction3dEditorView, subscribeInteraction3dAccess } from "/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
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
  if (deviceKindLocal === "environment") {
    deviceKindLocal = "climate";
  }
  if (deviceKindLocal === "devices") {
    deviceKindLocal = "nas";
  }
  let isEnvironmentKind = false;
  let isDeviceMode = false;
  let isVacuumShortcut = false;
  let isVacuum = false;
  let isDeviceLike = false;
  let isTelevision = false;
  let isClimate = false;
  let isCover = false;
  let isNas = false;
  let isNonLight = false;
  let stageLabel = "灯光";
  let dialogLabel = stageLabel;
  let statusNote = "airConditioners";
  let errorNote = "mdi:lightbulb-outline";
  let selectedLightId = "groupId";
  function applyKindFlags() {
    isEnvironmentKind = ["environment", "climate", "cover"].includes(deviceKindLocal);
    isDeviceMode = deviceKindLocal === "devices" || deviceKindLocal === "nas" || deviceKindLocal === "television";
    isVacuumShortcut = deviceKindLocal === "vacuum-shortcut";
    isVacuum = deviceKindLocal === "vacuum";
    isDeviceLike = isDeviceMode || isVacuum || isVacuumShortcut;
    isTelevision = deviceKindLocal === "television";
    isClimate = deviceKindLocal === "climate";
    isCover = deviceKindLocal === "cover";
    isNas = deviceKindLocal === "nas";
    isNonLight = isClimate || isCover || isNas || isTelevision || isVacuum || isVacuumShortcut;
    stageLabel = isVacuumShortcut ? "快捷指令" : isVacuum ? "扫地机" : isDeviceMode ? "设备" : isCover ? "窗帘" : isClimate ? "空调" : "灯光";
    dialogLabel = isEnvironmentKind ? "环境" : isVacuumShortcut ? "扫地机" : stageLabel;
    statusNote = isVacuum || isVacuumShortcut ? "vacuums" : isTelevision ? "televisions" : isNas ? "nas" : isCover ? "curtains" : "airConditioners";
    errorNote = isVacuumShortcut ? "mdi:broom" : isVacuum ? "mdi:robot-vacuum" : isTelevision ? "mdi:television" : isNas ? "mdi:nas" : isCover ? "mdi:curtains" : isClimate ? "mdi:air-conditioner" : "mdi:lightbulb-outline";
    selectedLightId = isNonLight ? "modelId" : "groupId";
  }
  const draft = name3 => name3.name || name3.label || stageLabel;
  const sceneMeta = clickActionValue => isDeviceLike ? ["focus", "focus-panel", "panel"].includes(clickActionValue) ? clickActionValue : "focus-panel" : isCover ? clickActionValue === "panel" ? "panel" : "focus" : ["turn-on-focus", "turn-on", "turn-on-panel"].includes(clickActionValue) ? clickActionValue : "focus";
  applyKindFlags();
  const rel = document.createElement("link");
  rel.rel = "stylesheet";
  rel.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15-20260911-unified-settings-v1-20260912-compact-list-note-v1";
  document.head.append(rel);
  const createEl = (tagName, elClassName, element) => {
    const className = document.createElement(tagName);
    className.className = elClassName || "";
    if (element) {
      className.textContent = element;
    }
    return className;
  };
  const accessAllowed = (buttonLabel, onClick) => {
    const type = createEl("button", "", buttonLabel);
    type.type = "button";
    type.addEventListener("click", onClick);
    return type;
  };
  const editorDialog = createEl("dialog", "i3d-editor");
  editorDialog.setAttribute("aria-label", "3D " + dialogLabel + "配置");
  editorDialog.setAttribute("data-i3d-preview-scope", "");
  editorDialog.className += " i3d-unified-settings";
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
  let close = null;
  let closeCurrent = null;
  let pickerSession = 0;
  let open = false;
  let isSavingConfig = false;
  let dirtyRevision = 0;
  let latestStatesByEntity = null;
  let refreshEffectCapabilityUi = () => {};
  const get = new Map();
  function ensureKindContainers() {
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
      for (const shortcuts of effectRangeOpen.devices?.vacuums || []) {
        shortcuts.shortcuts = (shortcuts.shortcuts || []).map(visible => visible.visible === false ? {
          ...visible,
          visible: true,
          buttonHidden: true,
          hiddenClickable: false
        } : visible);
      }
    }
    vacuumId ||= effectRangeOpen.devices?.vacuums?.[0]?.id || "";
  }
  const getCurrentVacuum = () => effectRangeOpen.devices?.vacuums?.find(id => id.id === vacuumId);
  const getCurrentItems = () => isVacuumShortcut ? getCurrentVacuum()?.shortcuts || [] : isDeviceLike ? effectRangeOpen.devices[statusNote] : isNonLight ? effectRangeOpen.environment[statusNote] : effectRangeOpen.lights;
  const setCurrentItems = shortcuts => {
    if (isVacuumShortcut) {
      if (getCurrentVacuum()) {
        getCurrentVacuum().shortcuts = shortcuts;
      }
    } else if (isDeviceLike) {
      effectRangeOpen.devices[statusNote] = shortcuts;
    } else if (isNonLight) {
      effectRangeOpen.environment[statusNote] = shortcuts;
    } else {
      effectRangeOpen.lights = shortcuts;
    }
  };
  function normalizeCurrentItems() {
    setCurrentItems((getCurrentItems() || []).filter(visible => isVacuumShortcut || visible.visible !== false).map(size => {
      const sizeCurrent = Number.isFinite(size.size) && size.size > 0 ? size.size : 44;
      return {
        ...size,
        size: sizeCurrent,
        visible: isVacuumShortcut ? size.visible !== false : true,
        icon: size.icon || errorNote,
        ...(isNonLight ? {} : {
          fadeDuration: size.fadeDuration ?? 0.3
        }),
        ...(isCover ? {
          coverDirection: ["left", "right", "split"].includes(size.coverDirection) ? size.coverDirection : "auto"
        } : {}),
        ...(isVacuumShortcut ? {} : {
          clickAction: sceneMeta(size.clickAction)
        }),
        iconSize: Number.isFinite(size.iconSize) && size.iconSize > 0 ? size.iconSize : Math.min(sizeCurrent, Math.max(4, sizeCurrent - 18))
      };
    }));
  }
  function buildFilter() {
    return isNonLight ? [...(isVacuum ? [] : [["icon", "图标", ""]]), ["size", isVacuum ? "状态框缩放" : "按钮大小", isVacuum ? "%" : "px"], ["iconSize", isVacuum ? "文字大小" : "图标大小", "px"], ["hitSize", "点击范围", "px"], ["buttonVisibility", "按钮显示", ""], ...(isVacuumShortcut ? [["fontSize", "文字大小", "px"], ["iconHidden", "隐藏图标", ""], ["labelHidden", "隐藏名称", ""]] : [])] : [["size", "按钮大小", "px"], ["iconSize", "图标大小", "px"], ["hitSize", "点击范围", "px"], ["fadeDuration", "缓开缓灭", "秒"], ["effectDefaults.brightness", "默认亮度", "%"], ["effectDefaults.kelvin", "默认色温", "K"], ["effectRange.brightnessMin", "最暗亮度", "%"], ["effectRange.brightnessMax", "最亮亮度", "%"], ["effectRange.temperatureMin", "最低色温", "K"], ["effectRange.temperatureMax", "最高色温", "K"]];
  }
  let filter = [];
  const map = new Map();
  const kindViewState = new Map();
  function rebuildCapabilityCache() {
    map.clear();
    for (const id of getCurrentItems()) {
      map.set(id.id, structuredClone(id));
    }
  }
  ensureKindContainers();
  normalizeCurrentItems();
  filter = buildFilter();
  rebuildCapabilityCache();
  let closeNext = null;
  let updateBatchApplyState = () => {};
  function markDirty(size, minimum = resolveEntityLightState(size)) {
    if (isNonLight) {
      return {
        icon: size.icon || errorNote,
        size: size.size ?? 44,
        iconSize: size.iconSize ?? 26,
        hitSize: size.hitSize ?? Math.max(44, size.size ?? 44),
        ...(isVacuumShortcut ? {
          fontSize: size.fontSize ?? 12,
          iconHidden: size.iconHidden === true,
          labelHidden: size.labelHidden === true
        } : {}),
        buttonVisibility: size.buttonHidden === true ? "隐藏（不可点击）" : size.hiddenClickable === true ? "隐藏（可点击）" : "显示"
      };
    } else {
      return {
        size: size.size ?? 44,
        iconSize: size.iconSize ?? 26,
        hitSize: size.hitSize ?? Math.max(44, size.size ?? 44),
        fadeDuration: size.fadeDuration ?? 0.3,
        effectDefaults: size.effectDefaults || {},
        effectRange: {
          brightnessMin: 1,
          brightnessMax: 100,
          temperatureMin: minimum.minimum,
          temperatureMax: minimum.maximum,
          ...size.effectRange
        }
      };
    }
  }
  const getByPath = (pathObject, split) => split.split(".").reduce((pathAcc, pathKey) => pathAcc?.[pathKey], pathObject);
  function resolveLightCapability(id) {
    if (!map.has(id.id)) {
      map.set(id.id, structuredClone(id));
    }
    const entityId = resolveEntityLightState(id);
    const entityState = markDirty(map.get(id.id), entityId);
    const cachedCapability = markDirty(id, entityId);
    return filter.filter(([diffFieldPath]) => getByPath(entityState, diffFieldPath) !== getByPath(cachedCapability, diffFieldPath));
  }
  function appendLabeled(parent, fieldLabel, control) {
    for (const split of control) {
      if (split === "buttonVisibility") {
        parent.buttonHidden = fieldLabel.buttonVisibility === "隐藏（不可点击）";
        parent.hiddenClickable = fieldLabel.buttonVisibility === "隐藏（可点击）";
        continue;
      }
      const [fieldRootKey, fieldChildKey] = split.split(".");
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
    closeNext?.close();
    closeNext?.remove();
    closeNext = null;
  }
  function appendSelect(selectParent) {
    const select = selectParent.statusSource;
    if (!select || refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || closeNext) {
      return;
    }
    const has = new Set(select.visibleMetrics || select.metrics.map(entityId => entityId.entityId));
    const push = [];
    const nasFieldsDialog = createEl("dialog", "settings-dialog i3d-add-dialog i3d-nas-fields-dialog");
    closeNext = nasFieldsDialog;
    nasFieldsDialog.setAttribute("aria-label", "选择 NAS 显示内容");
    const nasFieldsHeading = createEl("div", "dialog-heading");
    const nasFieldsTitle = createEl("h2", "", "选择显示内容");
    const className = accessAllowed("×", renderSidebar);
    className.className = "icon-button";
    className.setAttribute("aria-label", "关闭显示内容选择");
    nasFieldsHeading.append(nasFieldsTitle, className);
    const nasFieldsBody = createEl("div", "i3d-add-dialog-body");
    const nasFieldsToolbar = createEl("div", "dialog-actions");
    const nasFieldsCountEl = createEl("span", "i3d-note");
    const updateNasFieldsCount = () => {
      nasFieldsCountEl.textContent = "已选 " + has.size + " 项";
      for (const checked of push) {
        checked.checked = has.has(checked.value);
      }
    };
    nasFieldsToolbar.append(accessAllowed("全选", () => {
      select.metrics.forEach(entityId => has.add(entityId.entityId));
      updateNasFieldsCount();
    }), accessAllowed("全不选", () => {
      has.clear();
      updateNasFieldsCount();
    }), nasFieldsCountEl);
    const nasFieldsList = createEl("div", "i3d-nas-fields");
    const options = nasGroups(select).filter(([nasGroupId]) => select.metrics.some(group => group.group === nasGroupId));
    const get = new Map();
    const rerenderNasFieldGroups = () => {
      options.forEach(([nasGroupKey], nasGroupIndex) => {
        const {
          section: nasGroupSectionEl,
          up: disabled,
          down: entry
        } = get.get(nasGroupKey);
        disabled.disabled = nasGroupIndex === 0;
        entry.disabled = nasGroupIndex === options.length - 1;
        nasFieldsList.append(nasGroupSectionEl);
      });
    };
    for (const [optValue, optLabel] of options) {
      const option = select.metrics.filter(group => group.group === optValue);
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
      const nasGroupDownBtn = accessAllowed("↓", () => moveNasGroup(1));
      nasGroupUpBtn.setAttribute("aria-label", "上移" + optLabel + "分组");
      nasGroupDownBtn.setAttribute("aria-label", "下移" + optLabel + "分组");
      nasGroupUpBtn.title = "上移分组";
      nasGroupDownBtn.title = "下移分组";
      nasGroupHeading.append(createEl("h4", "", optLabel), nasGroupUpBtn, nasGroupDownBtn);
      nasGroupSection.append(nasGroupHeading);
      get.set(optValue, {
        section: nasGroupSection,
        up: nasGroupUpBtn,
        down: nasGroupDownBtn,
        metrics: option
      });
      const map = new Map();
      const rerenderNasGroupRows = () => option.forEach((entityId, nasMetricIndex) => {
        const up = map.get(entityId.entityId);
        up.up.disabled = nasMetricIndex === 0;
        up.down.disabled = nasMetricIndex === option.length - 1;
        nasGroupSection.append(up.row);
      });
      for (const label of option) {
        const row = createEl("div", "i3d-nas-fields-row");
        const title = createEl("label");
        const nasMetricCheckbox = createEl("input");
        nasMetricCheckbox.type = "checkbox";
        nasMetricCheckbox.value = label.entityId;
        nasMetricCheckbox.setAttribute("aria-label", label.label);
        title.title = label.entityId;
        nasMetricCheckbox.addEventListener("change", () => {
          if (nasMetricCheckbox.checked) {
            has.add(nasMetricCheckbox.value);
          } else {
            has.delete(nasMetricCheckbox.value);
          }
          updateNasFieldsCount();
        });
        const moveNasMetric = nasMetricDelta => {
          const nasMetricFromIndex = option.indexOf(label);
          const nasMetricToIndex = nasMetricFromIndex + nasMetricDelta;
          if (!(nasMetricToIndex < 0) && !(nasMetricToIndex >= option.length)) {
            [option[nasMetricFromIndex], option[nasMetricToIndex]] = [option[nasMetricToIndex], option[nasMetricFromIndex]];
            rerenderNasGroupRows();
          }
        };
        const nasMetricUpBtn = accessAllowed("↑", () => moveNasMetric(-1));
        const nasMetricDownBtn = accessAllowed("↓", () => moveNasMetric(1));
        nasMetricUpBtn.setAttribute("aria-label", "上移" + label.label);
        nasMetricDownBtn.setAttribute("aria-label", "下移" + label.label);
        nasMetricUpBtn.title = "上移内容";
        nasMetricDownBtn.title = "下移内容";
        map.set(label.entityId, {
          row,
          up: nasMetricUpBtn,
          down: nasMetricDownBtn
        });
        push.push(nasMetricCheckbox);
        title.append(nasMetricCheckbox, createEl("span", "", label.label));
        row.append(title, nasMetricUpBtn, nasMetricDownBtn);
        nasGroupSection.append(row);
      }
      rerenderNasGroupRows();
      nasFieldsList.append(nasGroupSection);
    }
    rerenderNasFieldGroups();
    const nasFieldsActions = createEl("div", "dialog-actions");
    const allowed = accessAllowed("确定", () => {
      if (refreshCapabilities || !capabilityCache || selectParent.statusSource !== select || !getCurrentItems().includes(selectParent)) {
        return renderSidebar();
      }
      select.metrics = options.flatMap(([nasConfirmGroupId]) => get.get(nasConfirmGroupId).metrics);
      select.visibleMetrics = select.metrics.filter(entityId => has.has(entityId.entityId)).map(entityId => entityId.entityId);
      select.groupOrder = options.map(([nasConfirmOrderId]) => nasConfirmOrderId);
      renderSidebar();
      mountRuntime();
      rebuildConfigSidebar();
      saveStatusEl.textContent = "显示内容已调整，待保存配置";
    });
    allowed.className = "primary";
    nasFieldsActions.append(accessAllowed("取消", renderSidebar), allowed);
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
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || closeNext) {
      return;
    }
    const numInput = isNonLight ? stageLabel : "灯光";
    const batchApplyTitle = isNonLight ? "图标设置" : "灯光设置";
    const length = resolveLightCapability(numParent);
    const filtered = getCurrentItems().filter(id => id.id !== numParent.id && (isVacuumShortcut || id.floorId === numParent.floorId));
    if (!length.length) {
      return;
    }
    const batchSourceSnapshot = structuredClone(markDirty(numParent));
    const Object = createEl("dialog", "settings-dialog navigation-style-apply-dialog i3d-batch-dialog");
    Object.setAttribute("aria-label", "应用" + batchApplyTitle);
    closeNext = Object;
    const batchHeading = createEl("div", "dialog-heading");
    const batchHeadingText = createEl("div");
    batchHeadingText.append(createEl("span", "", "BATCH APPLY"), createEl("h2", "", "应用" + batchApplyTitle));
    const className = accessAllowed("×", renderSidebar);
    className.className = "icon-button";
    className.setAttribute("aria-label", "关闭应用设置窗口");
    batchHeading.append(batchHeadingText, className);
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
    const push = [];
    const makeBatchOption = (element, batchOptionTitle, batchOptionHint, push) => {
      const batchOptionLabel = createEl("label", "navigation-style-apply-option");
      const type = createEl("input");
      const batchOptionText = createEl("span", "", batchOptionTitle);
      type.type = "checkbox";
      type.checked = true;
      type.value = element;
      type.setAttribute("aria-label", batchOptionTitle);
      push.push(type);
      batchOptionText.append(createEl("small", "", batchOptionHint));
      batchOptionLabel.append(type, batchOptionText);
      return batchOptionLabel;
    };
    const has = new Set(length.map(([batchFieldId]) => batchFieldId));
    const add = new Set(has);
    for (const replace of has) {
      if (replace.startsWith("effectRange.")) {
        add.add(replace.endsWith("Min") ? replace.replace(/Min$/, "Max") : replace.replace(/Max$/, "Min"));
      }
    }
    for (const [batchFieldPath, batchFieldLabel, batchFieldUnit] of filter.filter(([batchFilterPath]) => add.has(batchFilterPath))) {
      const batchFieldRaw = getByPath(batchSourceSnapshot, batchFieldPath);
      const batchFieldDisplay = isVacuum && batchFieldPath === "size" ? Math.round(batchFieldRaw / 44 * 100) : isVacuum && batchFieldPath === "iconSize" ? batchFieldRaw / 2 : batchFieldRaw;
      const element = has.has(batchFieldPath);
      batchFieldOptions.append(makeBatchOption(batchFieldPath, batchFieldLabel, typeof batchFieldDisplay == "boolean" ? batchFieldDisplay ? "是" : "否" : batchFieldDisplay === undefined ? "跟随模型" : "" + (element ? "" : "配套上/下限 · ") + (typeof batchFieldDisplay == "number" ? Math.round(batchFieldDisplay * 1000) / 1000 : batchFieldDisplay) + " " + batchFieldUnit, at));
      at.at(-1).checked = element;
    }
    const hasCurrent = new Map();
    for (const floorId of filtered) {
      const batchTargetFloorId = isVacuumShortcut ? getCurrentVacuum()?.floorId : floorId.floorId;
      if (!hasCurrent.has(batchTargetFloorId)) {
        hasCurrent.set(batchTargetFloorId, []);
      }
      hasCurrent.get(batchTargetFloorId).push(floorId);
    }
    for (const [batchFloorId, batchFloorItems] of hasCurrent) {
      const batchFloorGroup = createEl("section", "navigation-style-apply-page-group");
      const batchFloorHeading = createEl("div", "navigation-style-apply-page-heading");
      const batchFloorName = draftRevision?.floors.find(id => id.id === batchFloorId)?.name || "原楼层";
      const batchFloorControls = createEl("div", "navigation-style-apply-page-controls");
      const batchFloorCountEl = createEl("span");
      const batchFloorOptions = createEl("div", "navigation-style-apply-page-options");
      const length = [];
      for (const id of batchFloorItems) {
        batchFloorOptions.append(makeBatchOption(id.id, id.label || numInput, isNonLight ? "图标设置" : "灯光设置", length));
      }
      push.push(...length);
      const updateBatchFloorToggle = () => {
        const batchFloorCheckedCount = length.filter(checked => checked.checked).length;
        batchFloorCountEl.textContent = batchFloorCheckedCount + "/" + length.length + " 个" + numInput;
        batchFloorToggleBtn.textContent = batchFloorCheckedCount === length.length ? "取消全选" : "全选";
      };
      const batchFloorToggleBtn = accessAllowed("", () => {
        const element = !length.every(checked => checked.checked);
        length.forEach(checked => {
          checked.checked = element;
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
    hidden.hidden = filtered.length > 0;
    if (!filtered.length) {
      hidden.textContent = "当前配置中没有其他" + numInput + "可应用。";
    }
    hidden.setAttribute("role", "status");
    const batchActions = createEl("div", "dialog-actions");
    const disabled = accessAllowed("应用所选", async () => {
      const length = at.filter(checked => checked.checked).map(batchCheckedFieldInput => batchCheckedFieldInput.value);
      const size = new Set(push.filter(checked => checked.checked).map(batchCheckedTargetInput => batchCheckedTargetInput.value));
      if (!length.length || !size.size) {
        hidden.textContent = "请至少选择一项修改和一个目标" + numInput + "。";
        hidden.hidden = false;
        return;
      }
      disabled.disabled = true;
      try {
        await requestInteraction3dAccess();
        if (refreshCapabilities || !capabilityCache || closeNext !== Object) {
          return;
        }
        const list = getCurrentItems().filter(focalLength => size.has(focalLength.id) && focalLength.id !== numParent.id && (isVacuumShortcut || focalLength.floorId === numParent.floorId)).map(label => {
          const effectRange = structuredClone(label);
          appendLabeled(effectRange, batchSourceSnapshot, length);
          const brightnessMin = effectRange.effectRange;
          if (brightnessMin && (brightnessMin.brightnessMin > brightnessMin.brightnessMax || brightnessMin.temperatureMin > brightnessMin.temperatureMax)) {
            throw new Error("“" + (label.label || "灯光") + "”的上下限会冲突，请同时勾选对应的最小值与最大值。");
          }
          return effectRange;
        });
        if (!list.length) {
          throw new Error("目标" + numInput + "已不存在，请重新选择。");
        }
        const get = new Map(list.map(id => [id.id, id]));
        setCurrentItems(getCurrentItems().map(id => get.get(id.id) || id));
        for (const id of [numParent, ...list]) {
          const batchTargetCached = map.get(id.id) || structuredClone(id);
          appendLabeled(batchTargetCached, batchSourceSnapshot, length);
          map.set(id.id, batchTargetCached);
        }
        renderSidebar();
        mountRuntime();
        rebuildConfigSidebar();
        saveStatusEl.textContent = "已应用到 " + list.length + " 个" + numInput + "，待保存配置";
      } catch (error) {
        if (closeNext === Object) {
          hidden.textContent = error.message;
          hidden.hidden = false;
        }
      } finally {
        disabled.disabled = false;
      }
    });
    disabled.className = "primary";
    disabled.disabled = !filtered.length;
    batchActions.append(accessAllowed("取消", renderSidebar), disabled);
    batchBody.append(createEl("p", "navigation-style-apply-summary", isVacuumShortcut ? "将“" + (numParent.label || stageLabel) + "”的图标修改应用到勾选的快捷按钮，保留各自的指令绑定、名称、位置和高度。应用后点击“保存配置”。" : isNonLight ? "将“" + (numParent.label || stageLabel) + "”的图标修改应用到勾选的" + stageLabel + "。保留各自的模型、实体、位置、高度、点击行为、聚焦视角和状态内容。应用后点击“保存配置”完成保存。" : "将“" + (numParent.label || "灯光") + "”中选定的修改应用到勾选的灯光。保留各灯的实体、名称、位置、聚焦视角与照射范围。应用后点击“保存配置”完成保存。"), batchColumns, hidden, batchActions);
    Object.append(batchHeading, batchBody);
    document.body.append(Object);
    Object.addEventListener("cancel", preventDefault => {
      preventDefault.preventDefault();
      renderSidebar();
    });
    Object.showModal();
  }
  const fitPreviewAspect = () => {
    const width = interaction3dPreviewSize(component, doc, previewView.clientWidth, previewView.clientHeight);
    Object.assign(previewAspect.style, {
      width: width.width + "px",
      height: width.height + "px"
    });
  };
  const header = new ResizeObserver(fitPreviewAspect);
  header.observe(previewView);
  const closeMainEditor = () => {
    if (!refreshCapabilities) {
      refreshCapabilities = true;
      closeAddDialog();
      renderSidebar();
      closeEditor?.close();
      header.disconnect();
      pickerSession++;
      closeCurrent?.close();
      liveStates?.();
      unsubscribeAccessWatch();
      editorDialog.remove();
      rel.remove();
      document.dispatchEvent(new Event("hb-i3d-preview-scope"));
    }
  };
  const saveStatusEl = createEl("span", "i3d-save-status");
  saveStatusEl.setAttribute("role", "status");
  const disabled = accessAllowed("保存配置", async () => {
    if (isSavingConfig || refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess) {
      return;
    }
    const pendingSaveSnapshot = structuredClone(effectRangeOpen);
    const pendingSaveRevision = dirtyRevision;
    isSavingConfig = true;
    saveStatusEl.textContent = "保存中…";
    disabled.disabled = true;
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
    } catch (error) {
      if (!refreshCapabilities) {
        pickerGeneration.textContent = error.message;
        saveStatusEl.textContent = "";
      }
    } finally {
      isSavingConfig = false;
      if (!refreshCapabilities) {
        disabled.disabled = !capabilityCache || saveButton || unsubscribeAccess;
      }
    }
  });
  disabled.className = "primary";
  focusBusy.append(createEl("strong", "", "3D " + dialogLabel + "配置"), saveStatusEl, disabled, accessAllowed("退出", closeMainEditor));
  editorBody.append(previewView, focusQueue);
  editorDialog.append(focusBusy, editorBody);
  document.body.append(editorDialog);
  editorDialog.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    closeMainEditor();
  });
  const getPreviewProperties = () => {
    const floorSelection = isVacuumShortcut && getCurrentVacuum() ? getCurrentVacuum().floorId : syncPreviewSize;
    const camera = effectRangeOpen.floorCameras?.[floorSelection] || (floorSelection === effectRangeOpen.floorSelection ? effectRangeOpen.camera : null);
    return {
      ...effectRangeOpen,
      floorSelection,
      ...(camera === undefined ? {} : {
        camera: camera
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
    for (const [element, selectOptionLabel] of getValue) {
      const selectOptionEl = createEl("option", "", selectOptionLabel);
      selectOptionEl.value = element;
      posInput.append(selectOptionEl);
    }
    posInput.value = onPositive;
    posInput.addEventListener("change", () => onSelectChange(posInput.value));
    return appendSetting(posParent, posLabel, posInput);
  }
  function appendBoundedInput(boundedParent, boundedLabel, boundedValue, boundedMin, boundedMax, boundedStep, onBoundedChange, type = "number") {
    const boundedInputEl = createEl("input");
    Object.assign(boundedInputEl, {
      type: type,
      min: String(boundedMin),
      max: String(boundedMax),
      step: String(boundedStep),
      value: String(boundedValue)
    });
    boundedInputEl.addEventListener(type === "range" ? "input" : "change", () => {
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
  function resolveEntityLightState(entityId) {
    const startsWith = entityId.entityId || "";
    const newState = latestStatesByEntity === null ? states?.get?.(startsWith) : latestStatesByEntity[startsWith];
    const known = get.get(startsWith);
    const supported_color_modes = (newState?.newState || newState)?.attributes || {};
    const supportedFeaturesRaw = supported_color_modes.supported_features;
    const hasSupportedFeatures = supportedFeaturesRaw != null && supportedFeaturesRaw !== "" && typeof supportedFeaturesRaw != "boolean" && Number.isFinite(Number(supportedFeaturesRaw));
    const state = lightState(startsWith, newState, known);
    state.known = startsWith.startsWith("switch.") || known?.known === true || Array.isArray(supported_color_modes.supported_color_modes) && supported_color_modes.supported_color_modes.some(colorMode => colorMode !== "unknown") || hasSupportedFeatures || state.brightnessSupported || state.temperatureSupported;
    if (startsWith && state.known) {
      get.set(startsWith, state);
    }
    return state;
  }
  function renderLightEffectPanel(effectPanelHost, effectDefaultsCurrent, known) {
    effectPanelHost.replaceChildren();
    if (effectDefaultsCurrent.entityId && !known.known) {
      const effectDetectingNote = createEl("p", "i3d-note", "正在识别灯具能力…");
      effectDetectingNote.setAttribute("role", "status");
      effectPanelHost.append(effectDetectingNote);
    }
    if (effectDefaultsCurrent.entityId && known.known && (!known.brightnessSupported || !known.temperatureSupported)) {
      const defaultEffectSection = createEl("section", "i3d-focus-settings");
      defaultEffectSection.append(createEl("h4", "", "默认效果"));
      const defaultEffectGrid = createEl("div", "i3d-coordinate-grid");
      defaultEffectSection.append(defaultEffectGrid);
      for (const [defaultEffectLabel, defaultEffectKey, defaultEffectSupported, defaultEffectMin, defaultEffectMax, defaultEffectStep] of [["默认亮度（%）", "brightness", known.brightnessSupported, 0, 100, 1], ["默认色温（K）", "kelvin", known.temperatureSupported, 1000, 20000, 100]]) {
        if (defaultEffectSupported) {
          continue;
        }
        const defaultEffectInput = createEl("input");
        Object.assign(defaultEffectInput, {
          type: "number",
          min: String(defaultEffectMin),
          max: String(defaultEffectMax),
          step: String(defaultEffectStep),
          value: Number.isFinite(effectDefaultsCurrent.effectDefaults?.[defaultEffectKey]) ? String(effectDefaultsCurrent.effectDefaults[defaultEffectKey]) : "",
          placeholder: "跟随模型"
        });
        defaultEffectInput.addEventListener("change", () => {
          const defaultEffectRaw = defaultEffectInput.value.trim();
          const defaultEffectNumber = Number(defaultEffectRaw);
          const effectDefaults = {
            ...effectDefaultsCurrent.effectDefaults
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
            effectDefaultsCurrent.effectDefaults = effectDefaults;
          } else {
            delete effectDefaultsCurrent.effectDefaults;
          }
          mountRuntime();
        });
        appendSetting(defaultEffectGrid, defaultEffectLabel, defaultEffectInput);
      }
      const defaultEffectActions = createEl("div", "i3d-focus-actions");
      defaultEffectSection.append(defaultEffectActions);
      defaultEffectActions.append(accessAllowed("预览默认效果", async () => {
        try {
          await liveStates.focusCommand("preview-light-effect", effectDefaultsCurrent.id, "defaults");
        } catch (error) {
          pickerGeneration.textContent = error.message;
        }
      }), accessAllowed("跟随模型", () => {
        delete effectDefaultsCurrent.effectDefaults;
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
      temperatureMin: known.minimum,
      temperatureMax: known.maximum,
      ...effectDefaultsCurrent.effectRange
    };
    const effectRangeGrid = createEl("div", "i3d-effect-grid");
    effectRangeDetails.append(effectRangeGrid);
    for (const [effectRangeLabel, endsWith, effectRangeSiblingKey, effectRangeMin, effectRangeMax, effectRangeStep] of [["最暗亮度（%）", "brightnessMin", "brightnessMax", 0, 100, 1], ["最亮亮度（%）", "brightnessMax", "brightnessMin", 0, 100, 1], ["最低色温（K）", "temperatureMin", "temperatureMax", 1000, 20000, 100], ["最高色温（K）", "temperatureMax", "temperatureMin", 1000, 20000, 100]]) {
      const effectRangeOption = createEl("div", "i3d-effect-option");
      effectRangeGrid.append(effectRangeOption);
      const effectRangeInput = appendBoundedInput(effectRangeOption, effectRangeLabel, effectRangeValues[endsWith], effectRangeMin, effectRangeMax, effectRangeStep, effectRangeNext => {
        effectRangeValues[endsWith] = endsWith.endsWith("Min") ? Math.min(effectRangeNext, effectRangeValues[effectRangeSiblingKey]) : Math.max(effectRangeNext, effectRangeValues[effectRangeSiblingKey]);
        effectRangeInput.value = String(effectRangeValues[endsWith]);
        effectDefaultsCurrent.effectRange = {
          ...effectRangeValues
        };
        mountRuntime();
      });
      const disabled = accessAllowed("预览", async () => {
        try {
          await liveStates.focusCommand("preview-light-effect", effectDefaultsCurrent.id, endsWith);
        } catch (error) {
          pickerGeneration.textContent = error.message;
        }
      });
      disabled.disabled = !effectDefaultsCurrent.entityId;
      if (!effectDefaultsCurrent.entityId) {
        disabled.title = "绑定实体后预览效果";
      }
      disabled.setAttribute("aria-label", "预览" + effectRangeLabel);
      effectRangeOption.append(disabled);
    }
    effectRangeDetails.append(accessAllowed("恢复默认效果", () => {
      delete effectDefaultsCurrent.effectRange;
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
  function switchDeviceKind(nextKind, startAddingMode = false) {
    if (refreshCapabilities || isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess || nextKind === deviceKindLocal) {
      return;
    }
    const previousKind = deviceKindLocal;
    const previousSaving = saving;
    kindViewState.set(previousKind, {
      selectedId: saving,
      scrollTop: focusQueue.scrollTop,
      baselines: new Map(map)
    });
    deviceKindLocal = nextKind;
    applyKindFlags();
    if (previousKind === "vacuum" && isVacuumShortcut && previousSaving) {
      vacuumId = previousSaving;
    }
    ensureKindContainers();
    normalizeCurrentItems();
    filter = buildFilter();
    const savedKindState = kindViewState.get(nextKind);
    saving = isVacuumShortcut ? vacuumId : savedKindState?.selectedId || "";
    if (isVacuumShortcut && getCurrentVacuum()) {
      syncPreviewSize = getCurrentVacuum().floorId;
    }
    map.clear();
    if (savedKindState?.baselines) {
      for (const [key, value] of savedKindState.baselines) {
        map.set(key, value);
      }
    } else {
      rebuildCapabilityCache();
    }
    pickerSession++;
    closeCurrent?.close();
    closeAddDialog();
    liveStates?.setEditingModule?.(
      isDeviceLike ? deviceKindLocal : isCover ? "cover" : isClimate ? "climate" : "light",
      isVacuumShortcut && vacuumId ? vacuumId : ""
    );
    mountRuntime();
    rebuildConfigSidebar();
    focusQueue.scrollTop = savedKindState?.scrollTop || 0;
    if (startAddingMode) {
      queueMicrotask(openAddDialog);
    }
  }
  function closeAddDialog() {
    if (close) {
      pickerSession++;
      closeCurrent?.close();
      closeCurrent = null;
    }
    close?.close();
    close?.remove();
    close = null;
  }
  function openAddDialog(currentTarget) {
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || close) {
      return;
    }
    if (isVacuumShortcut) {
      openAddShortcutEntityPicker(currentTarget?.currentTarget || currentTarget?.target);
      return;
    }
    const length = listAvailableTargets();
    if (!length.length || getCurrentItems().length >= 128) {
      return;
    }
    pickerSession++;
    closeCurrent?.close();
    const addDialog = createEl("dialog", "settings-dialog i3d-add-dialog");
    close = addDialog;
    addDialog.setAttribute("aria-label", isDeviceMode ? "添加设备" : "添加" + stageLabel + "按钮");
    const addDialogHeading = createEl("div", "dialog-heading");
    const addDialogHeadingText = createEl("div");
    addDialogHeadingText.append(createEl("span", "", "ADD BUTTON"), createEl("h2", "", isDeviceMode ? "添加设备" : "添加" + stageLabel + "按钮"));
    const className = accessAllowed("×", closeAddDialog);
    className.className = "icon-button";
    className.setAttribute("aria-label", "关闭添加按钮窗口");
    addDialogHeading.append(addDialogHeadingText, className);
    const addDialogBody = createEl("div", "i3d-add-dialog-body");
    const addDialogError = createEl("p", "i3d-error");
    addDialogError.setAttribute("role", "status");
    if (isDeviceMode) {
      appendPositiveNumber(addDialogBody, "设备类型", [["nas", "NAS"], ["television", "电视"]], deviceKindLocal, deviceTypeChoice => {
        if (deviceTypeChoice !== deviceKindLocal) {
          switchDeviceKind(deviceTypeChoice, true);
        }
      }).setAttribute("aria-label", "设备类型");
    }
    const disabled = appendPositiveNumber(addDialogBody, isNonLight ? "关联" + stageLabel + "模型" : "关联灯组", length.map(key => [key.key, draft(key.group)]), length[0].key, () => {
      addDialogError.textContent = "";
    });
    disabled.setAttribute("aria-label", isNonLight ? "关联" + stageLabel + "模型" : "关联灯组");
    const addDialogActions = createEl("div", "dialog-actions");
    let isAddingItem = false;
    const allowed = accessAllowed("确定添加", async () => {
      if (isAddingItem || refreshCapabilities || !capabilityCache || close !== addDialog) {
        return;
      }
      isAddingItem = true;
      allowed.disabled = true;
      disabled.disabled = true;
      addDialogError.textContent = "";
      const selectedAddTargetKey = disabled.value;
      try {
        await requestInteraction3dAccess();
        if (refreshCapabilities || !capabilityCache || close !== addDialog) {
          return;
        }
        const group = listAvailableTargets().find(key => key.key === selectedAddTargetKey);
        if (!group || getCurrentItems().length >= 128) {
          throw new Error("该对象已添加或不再可用，请关闭窗口后重新选择。");
        }
        const id = {
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
        getCurrentItems().push(id);
        saving = id.id;
        closeAddDialog();
        mountRuntime();
        rebuildConfigSidebar();
      } catch (error) {
        if (close === addDialog) {
          addDialogError.textContent = error.message;
        }
      } finally {
        isAddingItem = false;
        allowed.disabled = false;
        disabled.disabled = false;
      }
    });
    allowed.className = "primary";
    addDialogActions.append(accessAllowed("取消", closeAddDialog), allowed);
    addDialogBody.append(createEl("p", "i3d-note", "添加后可继续设置" + stageLabel + "按钮，最后点击“保存配置”完成保存。"), addDialogError, addDialogActions);
    addDialog.append(addDialogHeading, addDialogBody);
    document.body.append(addDialog);
    addDialog.addEventListener("cancel", preventDefault => {
      preventDefault.preventDefault();
      closeAddDialog();
    });
    addDialog.showModal();
  }
  async function openAddShortcutEntityPicker(trigger) {
    const floorId = getCurrentVacuum();
    if (!floorId || getCurrentItems().length >= 64) {
      return;
    }
    const addShortcutPickerSession = ++pickerSession;
    closeCurrent?.close();
    try {
      const close = await pickers.entity({
        trigger: trigger,
        deviceKind: "vacuum-room",
        current: "",
        onSelect(entityId) {
          if (refreshCapabilities || !capabilityCache || addShortcutPickerSession !== pickerSession || getCurrentVacuum() !== floorId || getCurrentItems().length >= 64 || !entityId) {
            return;
          }
          const name = entities.find(item => item.entityId === entityId);
          const newState = states?.get?.(entityId);
          const attributes = newState?.newState || newState;
          const vacuums = draftRevision.floors.find(id => id.id === floorId.floorId);
          const vacuumModelOnFloor = vacuums?.vacuums?.find(id => id.id === floorId.modelId);
          const length = (vacuums?.plan?.walls || []).flatMap(start => [start.start, start.end]);
          const averageWallCoord = wallCoordAxis => length.length ? length.reduce((wallCoordSum, wallCoordPoint) => wallCoordSum + wallCoordPoint[wallCoordAxis], 0) / length.length : vacuumModelOnFloor?.[wallCoordAxis] || 0;
          const id = {
            id: randomUuid(),
            entityId: entityId,
            label: name?.name || attributes?.attributes?.friendly_name || entityId,
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
          setCurrentItems([...getCurrentItems(), id]);
          saving = id.id;
          pickerSession++;
          closeCurrent?.close();
          closeCurrent = null;
          rebuildConfigSidebar();
          mountRuntime();
        }
      });
      if (refreshCapabilities || addShortcutPickerSession !== pickerSession) {
        close?.close();
      } else {
        closeCurrent = close;
      }
    } catch (error) {
      if (!refreshCapabilities) {
        pickerGeneration.textContent = error.message;
      }
    }
  }
  function makeConfigSection(sectionLabel) {
    const sectionEl = createEl("section", "i3d-config-section");
    sectionEl.append(createEl("h4", "", sectionLabel));
    focusQueue.append(sectionEl);
    return sectionEl;
  }
  function makeConfigRow(rowParent) {
    const rowEl = createEl("div", "i3d-config-row");
    rowParent.append(rowEl);
    return rowEl;
  }
  function renderVacuumShortcutSidebar() {
    const scopeRow = makeConfigRow(makeConfigSection("配置范围"));
    appendPositiveNumber(scopeRow, "配置内容", [["vacuum", "设备与地图"], ["vacuum-shortcut", "快捷指令"]], deviceKindLocal, sidebarContentKind => {
      if (sidebarContentKind !== deviceKindLocal) {
        switchDeviceKind(sidebarContentKind);
      }
    });
    if (!draftRevision) {
      return;
    }
    const length = effectRangeOpen.devices?.vacuums || [];
    if (!length.length) {
      focusQueue.append(createEl("p", "i3d-note", "请先在扫地机配置中添加并绑定扫地机。"));
      return;
    }
    appendPositiveNumber(scopeRow, "所属扫地机", length.map(id => [id.id, id.label || id.deviceName || "扫地机"]), vacuumId, selectedVacuumId => {
      vacuumId = selectedVacuumId;
      saving = "";
      map.clear();
      liveStates?.();
      liveStates = null;
      mountPreviewRuntime();
      rebuildConfigSidebar();
    });
    const shortcutListSection = makeConfigSection("快捷按钮");
    shortcutListSection.className += " i3d-compact-list";
    const shortcutListHeading = createEl("div", "i3d-config-list-row");
    const disabled = accessAllowed("添加快捷指令", openAddDialog);
    disabled.disabled = getCurrentItems().length >= 64;
    shortcutListHeading.append(disabled);
    shortcutListSection.append(shortcutListHeading);
    if (!getCurrentItems().some(id => id.id === saving)) {
      saving = getCurrentItems()[0]?.id || "";
    }
    if (!saving) {
      focusQueue.append(createEl("p", "i3d-note", "添加按钮后，选择全部实体中的清扫指令，在户型中拖动按钮放置。"));
      return;
    }
    appendPositiveNumber(shortcutListHeading, "当前按钮", getCurrentItems().map(id => [id.id, id.label]), saving, selectedShortcutId => {
      saving = selectedShortcutId;
      pickerSession++;
      closeCurrent?.close();
      rebuildConfigSidebar();
      mountRuntime();
    });
    const binding = getCurrentItems().find(id => id.id === saving);
    const className = accessAllowed("删除此快捷按钮", () => {
      pickerSession++;
      closeCurrent?.close();
      setCurrentItems(getCurrentItems().filter(shortcutItem => shortcutItem !== binding));
      saving = "";
      rebuildConfigSidebar();
      mountRuntime();
    });
    className.className = "i3d-remove-light";
    const shortcutBaseSection = makeConfigSection("基础绑定");
    const shortcutBaseRow = makeConfigRow(shortcutBaseSection);
    const shortcutNameInput = createEl("input");
    shortcutNameInput.value = binding.label;
    shortcutNameInput.maxLength = 128;
    shortcutNameInput.onchange = () => {
      binding.label = shortcutNameInput.value.trim() || "房间清扫";
      rebuildConfigSidebar();
      mountRuntime();
    };
    appendSetting(shortcutBaseRow, "名称", shortcutNameInput);
    const openShortcutPicker = (shortcutPickerKind, trigger) => {
      const shortcutPickerSession = ++pickerSession;
      Promise.resolve(pickers[shortcutPickerKind]({
        trigger: trigger,
        deviceKind: "vacuum-room",
        current: shortcutPickerKind === "icon" ? binding.icon : binding.entityId,
        onSelect(icon) {
          if (!refreshCapabilities && !!capabilityCache && shortcutPickerSession === pickerSession && !!getCurrentItems().includes(binding)) {
            if (shortcutPickerKind === "icon") {
              binding.icon = icon;
            } else {
              binding.entityId = icon;
            }
            rebuildConfigSidebar();
            mountRuntime();
          }
        }
      })).then(close => {
        if (refreshCapabilities || shortcutPickerSession !== pickerSession) {
          close?.close();
        } else {
          closeCurrent = close;
        }
      }).catch(message => {
        pickerGeneration.textContent = message.message;
      });
    };
    const allowed = accessAllowed(binding.entityId || "选择实体（全部）", () => openShortcutPicker("entity", allowed));
    allowed.className = "i3d-picker-button";
    appendSetting(shortcutBaseRow, "指令实体", allowed);
    const shortcutAppearanceSection = makeConfigSection("按钮外观");
    const shortcutAppearanceRow = makeConfigRow(shortcutAppearanceSection);
    const classNameCurrent = accessAllowed("", () => openShortcutPicker("icon", classNameCurrent));
    classNameCurrent.className = "i3d-picker-button i3d-icon-picker-button";
    const style = createEl("i");
    style.style.maskImage = "url('/bridge-static/vendor/mdi/7.4.47/svg/" + (binding.icon || errorNote).slice(4) + ".svg')";
    style.style.webkitMaskImage = style.style.maskImage;
    classNameCurrent.append(style, createEl("span", "", binding.icon || errorNote));
    appendSetting(shortcutAppearanceRow, "图标", classNameCurrent);
    const shortcutVisibilityRow = createEl("div", "i3d-button-visibility-row i3d-shortcut-visibility");
    shortcutAppearanceSection.append(shortcutVisibilityRow);
    for (const [shortcutVisKey, shortcutVisLabel] of [["hiddenClickable", "隐藏（可点击）"], ["buttonHidden", "隐藏（不可点击）"]]) {
      const checked = createEl("input");
      checked.type = "checkbox";
      checked.checked = binding[shortcutVisKey] === true;
      checked.onchange = () => {
        binding[shortcutVisKey] = checked.checked;
        if (checked.checked) {
          binding[shortcutVisKey === "buttonHidden" ? "hiddenClickable" : "buttonHidden"] = false;
        }
        rebuildConfigSidebar();
        mountRuntime();
      };
      appendSetting(shortcutVisibilityRow, shortcutVisLabel, checked);
    }
    for (const [shortcutHideKey, shortcutHideLabel] of [["iconHidden", "隐藏图标"], ["labelHidden", "隐藏名称"]]) {
      const checked = createEl("input");
      checked.type = "checkbox";
      checked.checked = binding[shortcutHideKey] === true;
      checked.onchange = () => {
        binding[shortcutHideKey] = checked.checked;
        mountRuntime();
      };
      appendSetting(shortcutVisibilityRow, shortcutHideLabel, checked);
    }
    const shortcutSizeGrid = createEl("div", "i3d-coordinate-grid i3d-size-grid i3d-shortcut-size-grid");
    const shortcutSizeDetails = createEl("details");
    shortcutSizeDetails.append(createEl("summary", "", "更多尺寸设置"), shortcutSizeGrid);
    shortcutAppearanceSection.append(shortcutSizeDetails);
    for (const [shortcutSizeKey, shortcutSizeLabel, shortcutSizeDefault] of [["size", "按钮大小（px）", 44], ["iconSize", "图标大小（px）", 26], ["fontSize", "文字大小（px）", 12], ["hitSize", "触控范围（px）", 44]]) {
      appendPositiveInput(shortcutSizeKey === "size" ? shortcutAppearanceRow : shortcutSizeGrid, shortcutSizeLabel, () => binding[shortcutSizeKey] || shortcutSizeDefault, shortcutSizeValue => {
        binding[shortcutSizeKey] = shortcutSizeValue;
        mountRuntime();
      });
    }
    const shortcutPositionSection = makeConfigSection("按钮位置");
    const shortcutCoordGrid = createEl("div", "i3d-coordinate-grid");
    shortcutPositionSection.append(shortcutCoordGrid);
    for (const toUpperCase of ["x", "y"]) {
      appendBoundedInput(shortcutCoordGrid, "位置 " + toUpperCase.toUpperCase(), binding[toUpperCase], -1000000, 1000000, 1, shortcutCoordValue => {
        binding[toUpperCase] = shortcutCoordValue;
        mountRuntime();
      });
    }
    appendBoundedInput(shortcutCoordGrid, "高度（米）", binding.height ?? 0.08, 0, 20, 0.1, height => {
      binding.height = height;
      mountRuntime();
    });
    shortcutPositionSection.append(createEl("p", "i3d-note", "拖动按钮调整位置，拖动空白处旋转户型。点击只执行绑定指令，不弹窗、不聚焦。"));
    const shortcutBatchSection = createEl("section", "navigation-batch-section i3d-light-batch");
    const disabledCurrent = accessAllowed("一键应用到其他快捷按钮", () => appendNumber(binding));
    shortcutBatchSection.append(createEl("h4", "", "图标设置一键应用"), disabledCurrent);
    focusQueue.append(shortcutBatchSection);
    updateBatchApplyState = () => {
      disabledCurrent.disabled = !resolveLightCapability(binding).length || !capabilityCache;
    };
    updateBatchApplyState();
    makeConfigSection("绑定管理").append(className);
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
      const rangeSection = makeConfigSection("照射范围");
      const disabled = accessAllowed("编辑照射范围", async () => {
        if (!resizeObserver) {
          resizeObserver = true;
          disabled.disabled = true;
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
          } catch (error) {
            resizeObserver = false;
            if (!refreshCapabilities) {
              pickerGeneration.textContent = error.message;
            }
          } finally {
            if (!refreshCapabilities) {
              rebuildConfigSidebar();
            }
          }
        }
      });
      disabled.dataset.interaction3dRangeEditor = "true";
      disabled.disabled = resizeObserver || !effectRangeOpen.sceneId;
      rangeSection.append(disabled, createEl("p", "i3d-note", "在独立弹窗中拖动范围；保存范围后，再点击“保存配置”保存到当前控件。"));
    }
    if (draftRevision) {
      const scopeRow = makeConfigRow(makeConfigSection("配置范围"));
      appendPositiveNumber(scopeRow, "配置楼层", draftRevision.floors.map(id27 => [id27.id, id27.name]), syncPreviewSize, selectedFloorId => {
        syncPreviewSize = selectedFloorId;
        mountRuntime();
        rebuildConfigSidebar();
      });
      if (isDeviceMode) {
        appendPositiveNumber(scopeRow, "设备类别", [["nas", "NAS"], ["television", "电视"]], deviceKindLocal, sidebarDeviceKind => {
          if (sidebarDeviceKind !== deviceKindLocal) {
            switchDeviceKind(sidebarDeviceKind);
          }
        });
      }
      if (isEnvironmentKind) {
        appendPositiveNumber(scopeRow, "环境类别", [["climate", "空调"], ["cover", "窗帘"]], deviceKindLocal, sidebarEnvironmentKind => {
          if (sidebarEnvironmentKind !== deviceKindLocal) {
            switchDeviceKind(sidebarEnvironmentKind);
          }
        });
      }
      if (isVacuum) {
        appendPositiveNumber(scopeRow, "配置内容", [["vacuum", "设备与地图"], ["vacuum-shortcut", "快捷指令"]], deviceKindLocal, sidebarContentKind => {
          if (sidebarContentKind !== deviceKindLocal) {
            switchDeviceKind(sidebarContentKind);
          }
        });
      }
      const itemListSection = makeConfigSection(isNonLight ? "模型列表" : "灯光列表");
      itemListSection.className += " i3d-compact-list";
      const itemListHeading = createEl("div", "i3d-config-list-row");
      const length = listAvailableTargets();
      const disabled = accessAllowed("添加" + stageLabel, openAddDialog);
      disabled.disabled = !length.length || getCurrentItems().length >= 128;
      itemListHeading.append(disabled);
      itemListSection.append(itemListHeading);
      const some = getCurrentItems().filter(floorId => floorId.floorId === syncPreviewSize || isNonLight && !draftRevision.floors.some(id => id.id === floorId.floorId));
      if (!some.some(id => id.id === saving)) {
        saving = some[0]?.id || "";
      }
      if (some.length) {
        appendPositiveNumber(itemListHeading, isDeviceMode ? "当前设备" : "当前按钮", some.map(id => [id.id, id.label]), saving, selectedItemId => {
          pickerSession++;
          closeCurrent?.close();
          saving = selectedItemId;
          mountRuntime();
          rebuildConfigSidebar();
        });
      }
      const statusSource = getCurrentItems().find(id => id.id === saving);
      if (statusSource) {
        const className = accessAllowed(isDeviceMode ? "删除此设备" : "删除此" + stageLabel + "按钮", () => {
          pickerSession++;
          closeCurrent?.close();
          setCurrentItems(getCurrentItems().filter(id => id.id !== statusSource.id));
          saving = "";
          mountRuntime();
          rebuildConfigSidebar();
        });
        className.className = "i3d-remove-light";
        const baseSection = makeConfigSection("基础绑定");
        const baseRow = makeConfigRow(baseSection);
        if (isDeviceMode) {
          const deviceTypeReadonly = createEl("input");
          deviceTypeReadonly.value = isTelevision ? "电视" : "NAS";
          deviceTypeReadonly.readOnly = true;
          appendSetting(baseRow, "设备类型", deviceTypeReadonly);
        }
        const itemNameInput = createEl("input");
        itemNameInput.value = statusSource.label;
        itemNameInput.maxLength = 128;
        itemNameInput.addEventListener("change", () => {
          statusSource.label = itemNameInput.value.trim() || stageLabel;
          mountRuntime();
        });
        appendSetting(baseRow, "名称", itemNameInput);
        if (isNonLight) {
          const some = draftRevision.floors.filter(id => id.id === syncPreviewSize).flatMap(id => (id[statusNote] || []).filter(item => !getCurrentItems().some(floorId => floorId !== statusSource && floorId.floorId === id.id && floorId.modelId === item.id)).map(model => ({
            floor: id,
            model,
            key: id.id + "/" + model.id
          })));
          const boundModelKey = statusSource.floorId + "/" + statusSource.modelId;
          const boundModelStillExists = some.some(key => key.key === boundModelKey);
          const unshift = some.map(key => [key.key, draft(key.model)]);
          if (!boundModelStillExists) {
            unshift.unshift([boundModelKey, "原模型已移除，请重新选择"]);
          }
          appendPositiveNumber(baseRow, "关联" + stageLabel + "模型", unshift, boundModelKey, selectedModelKey => {
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
            baseSection.append(createEl("p", "i3d-note", "原模型已移除，请重新选择。已保存的实体绑定和按钮设置仍然保留。"));
          }
        }
        if (isCover) {
          appendPositiveNumber(baseSection, "开合方向", [["auto", "继承模型"], ["left", "单开 · 向左收拢"], ["right", "单开 · 向右收拢"], ["split", "双开 · 向两侧收拢"]], statusSource.coverDirection, coverDirectionChoice => {
            statusSource.coverDirection = ["left", "right", "split"].includes(coverDirectionChoice) ? coverDirectionChoice : "auto";
            mountRuntime();
          });
        }
        if (isCover) {
          const addEventListener = createEl("input");
          Object.assign(addEventListener, {
            type: "checkbox",
            checked: statusSource.iconStateReversed === true
          });
          addEventListener.addEventListener("change", () => {
            statusSource.iconStateReversed = addEventListener.checked;
            mountRuntime();
          });
          appendSetting(baseSection, "图标状态反向", addEventListener);
        }
        const openItemPicker = async (itemPickerKind, trigger) => {
          const itemPickerSession = ++pickerSession;
          pickerGeneration.textContent = "";
          try {
            const pickerOpener = pickers?.[itemPickerKind === "powerEntity" ? "entity" : itemPickerKind];
            if (!pickerOpener) {
              throw new Error("选择器尚未准备好，请保存后刷新页面。");
            }
            const close = await pickerOpener({
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
                      get.set(deviceId.deviceId, deviceId);
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
                        const items = new Map(statusSource.statusSource.metrics.map((entityId, arg) => [entityId.entityId, arg]));
                        deviceId.metrics.sort((entityId, entityIdRight) => (items.get(entityId.entityId) ?? Infinity) - (items.get(entityIdRight.entityId) ?? Infinity));
                      }
                      if (statusSource.statusSource?.deviceId === deviceId.deviceId && Array.isArray(statusSource.statusSource.groupOrder)) {
                        deviceId.groupOrder = [...statusSource.statusSource.groupOrder];
                      }
                      if (statusSource.statusSource?.deviceId === deviceId.deviceId && Array.isArray(statusSource.statusSource.visibleMetrics)) {
                        const has = new Set(statusSource.statusSource.visibleMetrics);
                        deviceId.visibleMetrics = deviceId.metrics.filter(entityId => has.has(entityId.entityId)).map(entityId => entityId.entityId);
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
              close?.close();
            } else {
              closeCurrent = close;
            }
          } catch (error) {
            if (!refreshCapabilities && itemPickerSession === pickerSession) {
              pickerGeneration.textContent = error.message;
            }
          }
        };
        const name2 = entities.find(entityId => entityId.entityId === statusSource.entityId);
        if (isNas) {
          const className = accessAllowed(statusSource.statusSource?.name || "选择飞牛或群晖", () => void openItemPicker("nas", className));
          className.className = "i3d-picker-button";
          appendSetting(baseSection, "NAS 数据来源", className);
          if (statusSource.statusSource) {
            const nasVisibleMetricCount = statusSource.statusSource.visibleMetrics?.length ?? statusSource.statusSource.metrics.length;
            const className = accessAllowed("选择显示内容（" + nasVisibleMetricCount + " 项）", () => appendSelect(statusSource));
            className.className = "i3d-picker-button";
            baseSection.append(className);
          }
          baseSection.append(createEl("p", "i3d-note", statusSource.statusSource ? "已匹配 " + statusSource.statusSource.metrics.length + " 项状态。点击数据来源可重新匹配；弹窗只展示状态。" : "选择整台 NAS，自动匹配 CPU、内存、温度、存储和网络。无需逐个选择传感器。"));
        }
        const allowed = accessAllowed("", () => void openItemPicker("entity", allowed));
        allowed.className = "i3d-picker-button";
        allowed.title = statusSource.entityId || (isNonLight ? "选择" + stageLabel + "实体" : "选择灯或开关");
        allowed.append(createEl("span", "", name2?.name || statusSource.entityId || (isNonLight ? "选择" + stageLabel + "实体" : "选择灯或开关")));
        if (!isVacuum && (!isNas || !statusSource.statusSource)) {
          appendSetting(baseSection, isNas ? "原开启实体（未关联 NAS）" : "绑定实体", allowed);
        }
        if (isVacuum) {
          const mapSection = makeConfigSection("地图与移动");
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
          appendSetting(mapSection, "跟随标签上移（px）", followOffsetInput);
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
            appendSetting(mapSection, vacuumToggleLabel, addEventListener);
          }
          const className = accessAllowed(statusSource.deviceName || "选择扫地机设备", () => void openItemPicker("vacuum", className));
          className.className = "i3d-picker-button";
          appendSetting(baseSection, "绑定设备", className);
          const entry = get.get(statusSource.deviceId) || {
            entities: entities.filter(entityId => /^vacuum\./.test(entityId.entityId) && (entityId.deviceId === statusSource.deviceId || entityId.entityId === statusSource.deviceId)),
            maps: entities.filter(entityId => /^(camera|image)\./.test(entityId.entityId) && entityId.deviceId === statusSource.deviceId)
          };
          if (entry?.entities.length > 1) {
            appendPositiveNumber(baseSection, "扫地机主实体", [["", "请选择主实体"], ...entry.entities.map(entityId7 => [entityId7.entityId, entityId7.name || entityId7.entityId])], statusSource.entityId, entityId => {
              statusSource.entityId = entityId;
              mountRuntime();
            });
          } else if (statusSource.entityId) {
            baseSection.append(createEl("p", "i3d-note", "已识别：" + statusSource.entityId));
          }
          if (entry?.maps.length > 1) {
            appendPositiveNumber(mapSection, "已识别的地图", [["", "请选择地图"], ...entry.maps.map(entityId8 => [entityId8.entityId, entityId8.name || entityId8.entityId])], statusSource.map?.entityId || "", entityId => {
              statusSource.map = {
                ...statusSource.map,
                entityId: entityId
              };
              mountRuntime();
              rebuildConfigSidebar();
            });
          }
          const trigger = accessAllowed(statusSource.map?.entityId || "选择扫地机地图", async () => {
            const mapPickerSession = ++pickerSession;
            try {
              closeCurrent = await pickers.entity({
                trigger: trigger,
                deviceKind: "vacuum-map",
                current: statusSource.map?.entityId || "",
                onSelect(entityId) {
                  if (!refreshCapabilities && !!capabilityCache && mapPickerSession === pickerSession && !!getCurrentItems().includes(statusSource)) {
                    statusSource.map = {
                      ...statusSource.map,
                      entityId: entityId
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
          trigger.className = "i3d-picker-button";
          appendSetting(mapSection, "地图来源", trigger);
          const openMapAlignButton = accessAllowed("底图对齐", () => {
            const mapEntityState = latestStatesByEntity === null ? states?.get?.(statusSource.map?.entityId) : latestStatesByEntity[statusSource.map?.entityId];
            const vacuumEntityState = latestStatesByEntity === null ? states?.get?.(statusSource.entityId) : latestStatesByEntity[statusSource.entityId];
            const sourceMapId = vacuumMapIdentity(mapEntityState, vacuumEntityState);
            const map = {
              ...statusSource,
              map: {
                ...statusSource.map
              }
            };
            if (sourceMapId) {
              map.map.sourceMapId = sourceMapId;
            } else {
              delete map.map.sourceMapId;
            }
            closeEditor = openVacuumMapEditor({
              item: map,
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
          mapSection.append(openMapAlignButton);
        }
        if (isTelevision) {
          const className = accessAllowed(statusSource.powerEntityId || "不单独绑定", () => void openItemPicker("powerEntity", className));
          className.className = "i3d-picker-button";
          appendSetting(baseSection, "电视电源状态（可选）", className);
          baseSection.append(createEl("p", "i3d-note", "绑定 Apple TV 的 media_player 实体，同步封面、应用、节目和播放状态。电源状态可单独绑定电视；弹窗只读，不同步实际视频。"));
        }
        if (isNas) {
          baseSection.append(createEl("p", "i3d-note", statusSource.statusSource ? "已选择 NAS 自身状态数据作为呼吸灯依据。安全状态只用于告警。" : "请先选择 NAS 数据来源。原来的试绑实体不会自动作为 NAS 数据来源。"));
        }
        const interactionSection = makeConfigSection("交互行为");
        appendPositiveNumber(interactionSection, "点击" + stageLabel, isDeviceLike ? [["focus-panel", "聚焦并显示状态"], ["panel", "仅显示状态"], ["focus", "仅聚焦"]] : isCover ? [["focus", "聚焦并显示控制"], ["panel", "仅显示控制"]] : isClimate ? [["focus", "聚焦并显示控制"], ["turn-on-focus", "聚焦并开启"], ["turn-on", "仅开关空调"], ["turn-on-panel", "开启并显示控制"]] : [["focus", "仅聚焦"], ["turn-on-focus", "聚焦并开灯"], ["turn-on", "仅开关灯"], ["turn-on-panel", "开灯并弹窗"]], statusSource.clickAction, clickActionChoice => {
          statusSource.clickAction = sceneMeta(clickActionChoice);
          mountRuntime();
        });
        const visibilityRow = createEl("div", "i3d-button-visibility-row");
        interactionSection.append(visibilityRow);
        const checked = createEl("input");
        Object.assign(checked, {
          type: "checkbox",
          checked: statusSource.hiddenClickable === true && statusSource.buttonHidden !== true
        });
        checked.addEventListener("change", () => {
          statusSource.hiddenClickable = checked.checked;
          if (checked.checked) {
            statusSource.buttonHidden = false;
            el.checked = false;
          }
          mountRuntime();
        });
        appendSetting(visibilityRow, "隐藏（可点击）", checked).parentElement.className += " i3d-hidden-clickable-setting";
        const el = createEl("input");
        Object.assign(el, {
          type: "checkbox",
          checked: statusSource.buttonHidden === true
        });
        el.addEventListener("change", () => {
          statusSource.buttonHidden = el.checked;
          if (el.checked) {
            statusSource.hiddenClickable = false;
            checked.checked = false;
          }
          mountRuntime();
        });
        appendSetting(visibilityRow, "隐藏（不可点击）", el).parentElement.className += " i3d-hidden-clickable-setting";
        const appearanceSection = makeConfigSection(isVacuum ? "状态标签" : "按钮外观");
        const appearanceRow = makeConfigRow(appearanceSection);
        if (!isVacuum) {
          const className = accessAllowed("", () => void openItemPicker("icon", className));
          className.className = "i3d-picker-button i3d-icon-picker-button";
          const style = createEl("i");
          style.setAttribute("aria-hidden", "true");
          const iconSvgUrl = "/bridge-static/vendor/mdi/7.4.47/svg/" + statusSource.icon.replace(/^mdi:/, "") + ".svg";
          style.style.maskImage = "url(\"" + iconSvgUrl + "\")";
          style.style.webkitMaskImage = "url(\"" + iconSvgUrl + "\")";
          className.append(style, createEl("span", "", statusSource.icon));
          appendSetting(appearanceRow, "图标", className);
        }
        const sizeGrid = createEl("div", "i3d-coordinate-grid i3d-size-grid");
        const sizeDetails = createEl("details");
        sizeDetails.append(createEl("summary", "", "更多尺寸设置"), sizeGrid);
        appearanceSection.append(sizeDetails);
        const resolveHitSize = () => Number.isFinite(statusSource.hitSize) && statusSource.hitSize > 0 ? statusSource.hitSize : Math.max(44, statusSource.size);
        appendPositiveInput(appearanceRow, isVacuum ? "状态框缩放（%）" : "按钮大小（px）", () => isVacuum ? Math.round(statusSource.size / 44 * 100) : statusSource.size, sizeInputValue => {
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
          const positionSection = makeConfigSection(isVacuum ? "标签位置" : "按钮位置");
          const elevation = draftRevision.floors.find(id => id.id === statusSource.floorId)?.[statusNote]?.find(id => id.id === statusSource.modelId);
          const modelCoordGrid = createEl("div", "i3d-coordinate-grid");
          positionSection.append(modelCoordGrid);
          const disabled = accessAllowed("恢复跟随模型", () => {
            delete statusSource.x;
            delete statusSource.y;
            delete statusSource.height;
            mountRuntime();
            rebuildConfigSidebar();
          });
          disabled.disabled = !["x", "y", "height"].some(positionKey => Number.isFinite(statusSource[positionKey]));
          for (const [coordKey, coordLabel, coordMin, coordMax, coordStep] of [["x", "位置 X", -1000000, 1000000, 1], ["y", "位置 Y", -1000000, 1000000, 1], ["height", "高度（米）", 0, 20, 0.1]]) {
            const coordCurrent = Number.isFinite(statusSource[coordKey]) ? statusSource[coordKey] : isVacuum && coordKey === "height" ? (Number(elevation?.elevation) || 0) + (Number(elevation?.height) || 0.85) + 0.25 : Number.isFinite(elevation?.[coordKey]) ? elevation[coordKey] : 0;
            appendBoundedInput(modelCoordGrid, isVacuum && coordKey === "height" ? "离地高度（米）" : coordLabel, coordCurrent, coordMin, coordMax, coordStep, positionValue => {
              statusSource[coordKey] = positionValue;
              disabled.disabled = false;
              mountRuntime();
            });
          }
          positionSection.append(disabled);
          const append = createEl("section", "navigation-batch-section i3d-light-batch");
          const batchSectionTitle = createEl("h4");
          const textContent = createEl("span");
          batchSectionTitle.append(createEl("span", "", "图标设置一键应用"), textContent);
          const allowed = accessAllowed("一键应用到其他" + stageLabel, () => appendNumber(statusSource));
          updateBatchApplyState = () => {
            const nonLightDirtyCount = resolveLightCapability(statusSource).length;
            textContent.textContent = nonLightDirtyCount + " 项修改";
            allowed.disabled = !nonLightDirtyCount || !capabilityCache || saveButton || unsubscribeAccess;
          };
          updateBatchApplyState();
          append.append(batchSectionTitle, allowed);
          positionSection.append(append);
        } else {
          const positionSection = makeConfigSection("按钮位置");
          const lightCoordGrid = createEl("div", "i3d-coordinate-grid");
          positionSection.append(lightCoordGrid);
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
          appendBoundedInput(positionSection, "缓开缓灭（秒）", statusSource.fadeDuration, 0, 10, 0.1, fadeDuration => {
            statusSource.fadeDuration = fadeDuration;
            mountRuntime();
          });
          const effectsSection = makeConfigSection("灯光效果");
          const contains = createEl("div");
          effectsSection.append(contains);
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
          const disabled = accessAllowed("一键应用到其他灯光", () => appendNumber(statusSource));
          updateBatchApplyState = () => {
            const lightDirtyCount = resolveLightCapability(statusSource).length;
            lightBatchCountEl.textContent = lightDirtyCount + " 项修改";
            disabled.disabled = !lightDirtyCount || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver;
          };
          updateBatchApplyState();
          lightBatchSection.append(lightBatchTitle, disabled);
          effectsSection.append(lightBatchSection);
        }
        const focusSettingsSection = createEl("section", "i3d-focus-settings i3d-config-section");
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
          } catch (error) {
            if (!refreshCapabilities && focusCommandGen === cameraCommandGeneration) {
              pickerGeneration.textContent = error.message;
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
          const className = accessAllowed(isNonLight ? "保存此" + stageLabel + "视角" : "保存此灯视角", () => void runFocusCameraCommand("save-light-camera"));
          className.className = "primary";
          focusActionsRow.append(className, accessAllowed("取消调整", () => void runFocusCameraCommand("cancel-light-camera")));
          const projectionGroup = createEl("div", "i3d-focus-actions");
          projectionGroup.setAttribute("role", "group");
          projectionGroup.setAttribute("aria-label", "聚焦投影");
          focusSettingsSection.append(projectionGroup);
          for (const [projectionMode, projectionLabel] of [["orthographic", "正交"], ["perspective", "透视"]]) {
            const projectionButton = accessAllowed(projectionLabel, () => void runFocusCameraCommand("focus-projection", projectionMode));
            projectionButton.setAttribute("aria-pressed", String((mode?.mode || "orthographic") === projectionMode));
            projectionGroup.append(projectionButton);
          }
          const disabled = appendBoundedInput(focusSettingsSection, "焦段（mm）", Math.round(mode?.focalLength || 50), 18, 120, 1, focalLengthValue => void runFocusCameraCommand("focus-focal-length", focalLengthValue));
          disabled.disabled = mode?.mode !== "perspective";
        } else {
          focusActionsRow.append(accessAllowed(statusSource[activeCameraKey] ? "调整视角" : "设置视角", () => void runFocusCameraCommand("edit-light-camera")), ...(activeCameraKey === "followCamera" ? [] : [accessAllowed("预览聚焦", () => void runFocusCameraCommand("preview-light-camera"))]));
          const disabled = accessAllowed(activeCameraKey === "followCamera" ? "恢复默认鸟瞰" : statusSource[activeCameraKey] ? "恢复自动聚焦" : "自动聚焦", async () => {
            try {
              await liveStates.focusCommand("cancel-light-camera", statusSource.id);
              delete statusSource[activeCameraKey];
              mountRuntime();
              rebuildConfigSidebar();
            } catch (error) {
              pickerGeneration.textContent = error.message;
            }
          });
          disabled.disabled = !statusSource[activeCameraKey];
          disabled.className = "i3d-focus-reset";
          focusSettingsSection.append(disabled);
        }
        if (unsubscribeAccess) {
          for (const disabled of focusSettingsSection.querySelectorAll("button, input")) {
            disabled.disabled = true;
          }
        }
        makeConfigSection("绑定管理").append(className);
      } else {
        const emptyListHint = length.length ? isVacuum ? "点击“添加扫地机”，选择模型后绑定扫地机设备。" : isTelevision || isNas ? "点击“添加设备”，选择" + (isTelevision ? "电视模型并绑定媒体播放器实体。" : "设备类型和模型，再绑定开启实体。") : isCover ? "点击“添加窗帘”，选择需要控制的窗帘模型。" : isClimate ? "点击“添加空调”，选择需要控制的空调模型。" : "点击“添加灯光”，选择需要控制的灯组。" : isVacuum ? "当前楼层暂无扫地机模型，请先在户型绘制中添加扫地机器人后更新户型。" : isTelevision ? "当前楼层暂无电视模型，请先在户型绘制中添加电视后更新户型。" : isNas ? "当前楼层暂无 NAS 模型，请先在户型绘制中添加模型后更新户型。" : isCover ? "当前楼层暂无窗帘模型，请在户型绘制中添加普通窗帘后更新户型。" : isClimate ? "当前楼层暂无空调模型，请在户型绘制中添加壁挂空调、柜机或出风口后更新户型。" : "当前楼层暂无灯组，请在户型绘制中添加灯组后更新户型。";
        focusQueue.append(createEl("p", "i3d-note", emptyListHint));
      }
    }
    focusQueue.append(pickerGeneration);
    disabled.disabled = isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess;
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
        if (!draftRevision.floors.some(id => id.id === syncPreviewSize)) {
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
        if (!refreshCapabilities && !!capabilityCache && !close && !closeNext) {
          if (action.action === "light-region-overrides") {
            effectRangeOpen.lightRegionOverrides = structuredClone(action.overrides || {});
            dirtyRevision++;
            if (!isSavingConfig) {
              saveStatusEl.textContent = "";
            }
          }
          if (isVacuumShortcut) {
            const id = getCurrentItems().find(id => "vacuum-room:" + vacuumId + ":" + id.id === action.id);
            if (id) {
              saving = id.id;
              if (action.action === "position") {
                id.x = action.x;
                id.y = action.y;
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
            const id = getCurrentItems().find(shortcuts => (shortcuts.shortcuts || []).some(id => "vacuum-room:" + shortcuts.id + ":" + id.id === action.id));
            const x = id?.shortcuts.find(item => "vacuum-room:" + id.id + ":" + item.id === action.id);
            if (x) {
              saving = id.id;
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
            const x2 = getCurrentItems().find(id => id.id === action.id);
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
      disabled.disabled = isSavingConfig || !capabilityCache || saveButton || unsubscribeAccess;
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
        closeCurrent?.close();
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
  const rel = document.createElement("link");
  rel.rel = "stylesheet";
  rel.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15-20260912-compact-list-note-v1";
  document.head.append(rel);
  const createEl = (appearanceTag, element = "") => {
    const appearanceNode = document.createElement(appearanceTag);
    appearanceNode.textContent = element;
    return appearanceNode;
  };
  const getBoundingClientRect = createEl("dialog");
  getBoundingClientRect.className = "i3d-editor i3d-appearance-editor";
  getBoundingClientRect.setAttribute("aria-label", "户型进阶设置");
  const addEventListener = createEl("header");
  const appearanceBody = createEl("div");
  appearanceBody.className = "i3d-appearance-body";
  const className = createEl("p");
  className.className = "i3d-error";
  className.setAttribute("role", "status");
  let id;
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
  addEventListener.title = "按住标题栏拖动";
  addEventListener.addEventListener("pointerdown", pointerEvent => {
    if (pointerEvent.button !== 0 || pointerEvent.target.closest("button")) {
      return;
    }
    pointerEvent.preventDefault();
    const startRect = getBoundingClientRect.getBoundingClientRect();
    id = {
      id: pointerEvent.pointerId,
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
      left: startRect.left,
      top: startRect.top
    };
    addEventListener.setPointerCapture(pointerEvent.pointerId);
  });
  addEventListener.addEventListener("pointermove", moveEvent => {
    if (!!id && id.id === moveEvent.pointerId) {
      positionAppearanceDialog(id.left + moveEvent.clientX - id.x, id.top + moveEvent.clientY - id.y);
    }
  });
  for (const endEventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    addEventListener.addEventListener(endEventName, () => {
      id = null;
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
      rel.remove();
    }
  };
  const disabled = createEl("button", "完成");
  disabled.type = "button";
  disabled.addEventListener("click", async () => {
    disabled.disabled = true;
    try {
      await requestInteraction3dAccess();
      await appearanceOnSave(floorBrightness);
      closeAppearanceEditor(true);
    } catch (doneError) {
      className.textContent = doneError.message;
      disabled.disabled = false;
    }
  });
  const type = createEl("button", "取消");
  type.type = "button";
  type.addEventListener("click", () => closeAppearanceEditor());
  const el = createEl("span", "拖动");
  el.className = "i3d-drag-hint";
  addEventListener.append(createEl("strong", "户型进阶设置"), el, disabled, type);
  const map = new Map();
  const helpNote = [];
  const lightingSections = baseLighting ? [["整体画面", APPEARANCE_LIGHTING_SECTIONS[0][1].filter(([, lightingFilterKey]) => lightingFilterKey === "exposure")]] : APPEARANCE_LIGHTING_SECTIONS;
  for (const [sectionTitle, sectionFields] of lightingSections) {
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
    const className = createEl("div");
    floorBrightnessSection.append(createEl("h4", "地面颜色"));
    className.className = "i3d-floor-brightness";
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
    className.append(createEl("span", "深"), floorBrightnessRange, createEl("span", "浅"), floorBrightnessNumber, createEl("span", "%"));
    floorBrightnessLabel.append(className);
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
  const helpNoteCurrent = createEl("p", baseLighting ? "曝光影响整体画面，地面颜色深浅独立调整。完成后点击页面上方保存。" : "调整当前户型的整体光照与阴影。完成后点击页面上方保存，仅保存至当前 3D 控件。");
  helpNoteCurrent.className = "i3d-note";
  appearanceBody.append(resetLightingBtn, helpNoteCurrent, className);
  getBoundingClientRect.append(addEventListener, appearanceBody);
  document.body.append(getBoundingClientRect);
  getBoundingClientRect.addEventListener("cancel", appearanceCancelEvent => {
    appearanceCancelEvent.preventDefault();
    closeAppearanceEditor();
  });
  getBoundingClientRect.showModal();
}
