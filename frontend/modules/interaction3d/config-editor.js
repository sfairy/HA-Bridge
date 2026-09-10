import { vacuumMapIdentity } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { openInteraction3dRangeEditor } from "./range-dialog.js?v=20260910-document-shadow-v1";
import { mountInteraction3d } from "./runtime.js?v=20260909-preview-sleep-v1";
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
  deviceKind: arg75 = "light",
  startAdding: arg76 = false,
  vacuumId: arg77 = "",
  editingFloorId: arg78 = ""
}) {
  await requestInteraction3dAccess();
  const stylesheet = arg75 === "devices" || arg75 === "nas" || arg75 === "television";
  if (arg75 === "devices") {
    arg75 = "nas";
  }
  const createEl = arg75 === "vacuum-shortcut";
  const createButton = arg75 === "vacuum";
  const dialog = stylesheet || createButton || createEl;
  const header = arg75 === "television";
  const body = arg75 === "climate";
  const viewPane = arg75 === "cover";
  const sidebar = arg75 === "nas";
  const aspectBox = body || viewPane || sidebar || header || createButton || createEl;
  const stage = createEl ? "快捷指令" : createButton ? "扫地机" : stylesheet ? "设备" : viewPane ? "窗帘" : body ? "空调" : "灯光";
  const statusNote = createButton || createEl ? "vacuums" : header ? "televisions" : sidebar ? "nas" : viewPane ? "curtains" : "airConditioners";
  const errorNote = createEl ? "mdi:broom" : createButton ? "mdi:robot-vacuum" : header ? "mdi:television" : sidebar ? "mdi:nas" : viewPane ? "mdi:curtains" : body ? "mdi:air-conditioner" : "mdi:lightbulb-outline";
  const draft = name3 => name3.name || name3.label || stage;
  const selectedLightId = aspectBox ? "modelId" : "groupId";
  const sceneMeta = arg53 => dialog ? ["focus", "focus-panel", "panel"].includes(arg53) ? arg53 : "focus-panel" : viewPane ? arg53 === "panel" ? "panel" : "focus" : ["turn-on-focus", "turn-on", "turn-on-panel"].includes(arg53) ? arg53 : "focus";
  const rel = document.createElement("link");
  rel.rel = "stylesheet";
  rel.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15";
  document.head.append(rel);
  const value128 = (arg54, arg55, element4) => {
    const className9 = document.createElement(arg54);
    className9.className = arg55 || "";
    if (element4) {
      className9.textContent = element4;
    }
    return className9;
  };
  const accessAllowed = (arg56, arg57) => {
    const type2 = value128("button", "", arg56);
    type2.type = "button";
    type2.addEventListener("click", arg57);
    return type2;
  };
  const setAttribute11 = value128("dialog", "i3d-editor");
  setAttribute11.setAttribute("aria-label", "3D " + stage + "配置");
  setAttribute11.setAttribute("data-i3d-preview-scope", "");
  const focusBusy = value128("header");
  const append47 = value128("div", "i3d-editor-body");
  const append48 = value128("div", "i3d-editor-view");
  const focusQueue = value128("aside");
  const append49 = value128("div", "i3d-editor-aspect");
  const value129 = value128("div", "i3d-editor-stage");
  const setAttribute12 = value128("p", "i3d-editor-status");
  setAttribute12.setAttribute("role", "status");
  append49.append(value129);
  append48.append(append49, setAttribute12);
  const pickerGeneration = value128("p", "i3d-error");
  pickerGeneration.setAttribute("role", "status");
  let effectRangeOpen = structuredClone(component.properties || {});
  let saving = "";
  let draftRevision = null;
  let liveStates = null;
  let refreshCapabilities = false;
  let capabilityCache = true;
  let syncPreviewSize = arg78 || (effectRangeOpen.floorSelection !== "all" ? effectRangeOpen.floorSelection : "");
  effectRangeOpen.lightingMode = normalizeInteraction3dLightingMode(effectRangeOpen.lightingMode);
  let resizeObserver = false;
  let closeEditor = null;
  let saveStatus = "focus";
  let saveButton = false;
  let unsubscribeAccess = false;
  let mode = null;
  let value130 = 0;
  let value131 = Promise.resolve();
  let close5 = null;
  let close6 = null;
  let value132 = 0;
  let open = false;
  let value133 = false;
  let value134 = 0;
  let value135 = null;
  let value136 = () => {};
  const get5 = new Map();
  if (dialog) {
    effectRangeOpen.devices = {
      ...effectRangeOpen.devices,
      [statusNote]: effectRangeOpen.devices?.[statusNote] || []
    };
  }
  if (aspectBox && !dialog) {
    effectRangeOpen.environment = {
      ...effectRangeOpen.environment,
      dimStrength: Number.isFinite(effectRangeOpen.environment?.dimStrength) ? Math.max(0, Math.min(100, effectRangeOpen.environment.dimStrength)) : 70,
      [statusNote]: effectRangeOpen.environment?.[statusNote] || []
    };
  }
  if (createEl) {
    for (const shortcuts2 of effectRangeOpen.devices.vacuums) {
      shortcuts2.shortcuts = (shortcuts2.shortcuts || []).map(visible => visible.visible === false ? {
        ...visible,
        visible: true,
        buttonHidden: true,
        hiddenClickable: false
      } : visible);
    }
  }
  arg77 ||= effectRangeOpen.devices?.vacuums?.[0]?.id || "";
  const value137 = () => effectRangeOpen.devices?.vacuums?.find(id36 => id36.id === arg77);
  const value138 = () => createEl ? value137()?.shortcuts || [] : dialog ? effectRangeOpen.devices[statusNote] : aspectBox ? effectRangeOpen.environment[statusNote] : effectRangeOpen.lights;
  const value139 = shortcuts3 => {
    if (createEl) {
      if (value137()) {
        value137().shortcuts = shortcuts3;
      }
    } else if (dialog) {
      effectRangeOpen.devices[statusNote] = shortcuts3;
    } else if (aspectBox) {
      effectRangeOpen.environment[statusNote] = shortcuts3;
    } else {
      effectRangeOpen.lights = shortcuts3;
    }
  };
  value139((value138() || []).filter(visible2 => createEl || visible2.visible !== false).map(size2 => {
    const size3 = Number.isFinite(size2.size) && size2.size > 0 ? size2.size : 44;
    return {
      ...size2,
      size: size3,
      visible: createEl ? size2.visible !== false : true,
      icon: size2.icon || errorNote,
      ...(aspectBox ? {} : {
        fadeDuration: size2.fadeDuration ?? 0.3
      }),
      ...(viewPane ? {
        coverDirection: ["left", "right", "split"].includes(size2.coverDirection) ? size2.coverDirection : "auto"
      } : {}),
      ...(createEl ? {} : {
        clickAction: sceneMeta(size2.clickAction)
      }),
      iconSize: Number.isFinite(size2.iconSize) && size2.iconSize > 0 ? size2.iconSize : Math.min(size3, Math.max(4, size3 - 18))
    };
  }));
  const filter = aspectBox ? [...(createButton ? [] : [["icon", "图标", ""]]), ["size", createButton ? "状态框缩放" : "按钮大小", createButton ? "%" : "px"], ["iconSize", createButton ? "文字大小" : "图标大小", "px"], ["hitSize", "点击范围", "px"], ["buttonVisibility", "按钮显示", ""], ...(createEl ? [["fontSize", "文字大小", "px"], ["iconHidden", "隐藏图标", ""], ["labelHidden", "隐藏名称", ""]] : [])] : [["size", "按钮大小", "px"], ["iconSize", "图标大小", "px"], ["hitSize", "点击范围", "px"], ["fadeDuration", "缓开缓灭", "秒"], ["effectDefaults.brightness", "默认亮度", "%"], ["effectDefaults.kelvin", "默认色温", "K"], ["effectRange.brightnessMin", "最暗亮度", "%"], ["effectRange.brightnessMax", "最亮亮度", "%"], ["effectRange.temperatureMin", "最低色温", "K"], ["effectRange.temperatureMax", "最高色温", "K"]];
  const capabilityCache2 = new Map(value138().map(id37 => [id37.id, structuredClone(id37)]));
  let close7 = null;
  let value140 = () => {};
  function markDirty(size4, minimum = fn4(size4)) {
    if (aspectBox) {
      return {
        icon: size4.icon || errorNote,
        size: size4.size ?? 44,
        iconSize: size4.iconSize ?? 26,
        hitSize: size4.hitSize ?? Math.max(44, size4.size ?? 44),
        ...(createEl ? {
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
  const value141 = (arg58, split) => split.split(".").reduce((arg42, arg43) => arg42?.[arg43], arg58);
  function resolveLightCapability(id40) {
    if (!capabilityCache2.has(id40.id)) {
      capabilityCache2.set(id40.id, structuredClone(id40));
    }
    const entityId = fn4(id40);
    const entityState = markDirty(capabilityCache2.get(id40.id), entityId);
    const cachedCapability = markDirty(id40, entityId);
    return filter.filter(([arg44]) => value141(entityState, arg44) !== value141(cachedCapability, arg44));
  }
  function appendLabeled(parent, fieldLabel, control) {
    for (const split2 of control) {
      if (split2 === "buttonVisibility") {
        parent.buttonHidden = fieldLabel.buttonVisibility === "隐藏（不可点击）";
        parent.hiddenClickable = fieldLabel.buttonVisibility === "隐藏（可点击）";
        continue;
      }
      const [value75, value76] = split2.split(".");
      if (!value76) {
        parent[value75] = fieldLabel[value75];
        continue;
      }
      parent[value75] = {
        ...(value75 === "effectRange" ? markDirty(parent).effectRange : parent[value75])
      };
      if (fieldLabel[value75][value76] === undefined) {
        delete parent[value75][value76];
      } else {
        parent[value75][value76] = fieldLabel[value75][value76];
      }
      if (!Object.keys(parent[value75]).length) {
        delete parent[value75];
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
    const setAttribute9 = value128("dialog", "settings-dialog i3d-add-dialog i3d-nas-fields-dialog");
    close7 = setAttribute9;
    setAttribute9.setAttribute("aria-label", "选择 NAS 显示内容");
    const append23 = value128("div", "dialog-heading");
    const value109 = value128("h2", "", "选择显示内容");
    const className11 = accessAllowed("×", renderSidebar);
    className11.className = "icon-button";
    className11.setAttribute("aria-label", "关闭显示内容选择");
    append23.append(value109, className11);
    const append24 = value128("div", "i3d-add-dialog-body");
    const append25 = value128("div", "dialog-actions");
    const textContent6 = value128("span", "i3d-note");
    const value110 = () => {
      textContent6.textContent = "已选 " + has2.size + " 项";
      for (const checked6 of push2) {
        checked6.checked = has2.has(checked6.value);
      }
    };
    append25.append(accessAllowed("全选", () => {
      select.metrics.forEach(entityId16 => has2.add(entityId16.entityId));
      value110();
    }), accessAllowed("全不选", () => {
      has2.clear();
      value110();
    }), textContent6);
    const append26 = value128("div", "i3d-nas-fields");
    const options = nasGroups(select).filter(([arg41]) => select.metrics.some(group2 => group2.group === arg41));
    const get4 = new Map();
    const value111 = () => {
      options.forEach(([arg18], arg19) => {
        const {
          section: value18,
          up: disabled,
          down: disabled2
        } = get4.get(arg18);
        disabled.disabled = arg19 === 0;
        disabled2.disabled = arg19 === options.length - 1;
        append26.append(value18);
      });
    };
    for (const [optValue, optLabel] of options) {
      const option = select.metrics.filter(group3 => group3.group === optValue);
      const append11 = value128("section");
      const append12 = value128("div", "i3d-nas-fields-heading");
      const value77 = arg32 => {
        const value50 = options.findIndex(([arg10]) => arg10 === optValue);
        const value51 = value50 + arg32;
        if (!(value51 < 0) && !(value51 >= options.length)) {
          [options[value50], options[value51]] = [options[value51], options[value50]];
          value111();
        }
      };
      const setAttribute6 = accessAllowed("↑", () => value77(-1));
      const select = accessAllowed("↓", () => value77(1));
      setAttribute6.setAttribute("aria-label", "上移" + optLabel + "分组");
      select.setAttribute("aria-label", "下移" + optLabel + "分组");
      setAttribute6.title = "上移分组";
      select.title = "下移分组";
      append12.append(value128("h4", "", optLabel), setAttribute6, select);
      append11.append(append12);
      get4.set(optValue, {
        section: append11,
        up: setAttribute6,
        down: select,
        metrics: option
      });
      const get3 = new Map();
      const value78 = () => option.forEach((entityId19, arg20) => {
        const up = get3.get(entityId19.entityId);
        up.up.disabled = arg20 === 0;
        up.down.disabled = arg20 === option.length - 1;
        append11.append(up.row);
      });
      for (const label2 of option) {
        const row = value128("div", "i3d-nas-fields-row");
        const title = value128("label");
        const value53 = value128("input");
        value53.type = "checkbox";
        value53.value = label2.entityId;
        value53.setAttribute("aria-label", label2.label);
        title.title = label2.entityId;
        value53.addEventListener("change", () => {
          if (value53.checked) {
            has2.add(value53.value);
          } else {
            has2.delete(value53.value);
          }
          value110();
        });
        const value54 = arg21 => {
          const value19 = option.indexOf(label2);
          const value20 = value19 + arg21;
          if (!(value20 < 0) && !(value20 >= option.length)) {
            [option[value19], option[value20]] = [option[value20], option[value19]];
            value78();
          }
        };
        const setAttribute4 = accessAllowed("↑", () => value54(-1));
        const setAttribute5 = accessAllowed("↓", () => value54(1));
        setAttribute4.setAttribute("aria-label", "上移" + label2.label);
        setAttribute5.setAttribute("aria-label", "下移" + label2.label);
        setAttribute4.title = "上移内容";
        setAttribute5.title = "下移内容";
        get3.set(label2.entityId, {
          row,
          up: setAttribute4,
          down: setAttribute5
        });
        push2.push(value53);
        title.append(value53, value128("span", "", label2.label));
        row.append(title, setAttribute4, setAttribute5);
        append11.append(row);
      }
      value78();
      append26.append(append11);
    }
    value111();
    const append27 = value128("div", "dialog-actions");
    const className12 = accessAllowed("确定", () => {
      if (refreshCapabilities || !capabilityCache || selectParent.statusSource !== select || !value138().includes(selectParent)) {
        return renderSidebar();
      }
      select.metrics = options.flatMap(([arg12]) => get4.get(arg12).metrics);
      select.visibleMetrics = select.metrics.filter(entityId12 => has2.has(entityId12.entityId)).map(entityId15 => entityId15.entityId);
      select.groupOrder = options.map(([arg13]) => arg13);
      renderSidebar();
      mountRuntime();
      fn12();
      textContent8.textContent = "显示内容已调整，待保存配置";
    });
    className12.className = "primary";
    append27.append(accessAllowed("取消", renderSidebar), className12);
    append24.append(append25, append26, value128("p", "i3d-note", "用 ↑ ↓ 调整分组和组内内容顺序；确定后点击“保存配置”保存。"), append27);
    setAttribute9.append(append23, append24);
    document.body.append(setAttribute9);
    value110();
    setAttribute9.addEventListener("cancel", preventDefault => {
      preventDefault.preventDefault();
      renderSidebar();
    });
    setAttribute9.showModal();
  }
  function appendNumber(numParent) {
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || close7) {
      return;
    }
    const numInput = aspectBox ? stage : "灯光";
    const value112 = aspectBox ? "图标设置" : "灯光设置";
    const length6 = resolveLightCapability(numParent);
    const length7 = value138().filter(id31 => id31.id !== numParent.id && (createEl || id31.floorId === numParent.floorId));
    if (!length6.length) {
      return;
    }
    const value113 = structuredClone(markDirty(numParent));
    const Object2 = value128("dialog", "settings-dialog navigation-style-apply-dialog i3d-batch-dialog");
    Object2.setAttribute("aria-label", "应用" + value112);
    close7 = Object2;
    const append28 = value128("div", "dialog-heading");
    const append29 = value128("div");
    append29.append(value128("span", "", "BATCH APPLY"), value128("h2", "", "应用" + value112));
    const className13 = accessAllowed("×", renderSidebar);
    className13.className = "icon-button";
    className13.setAttribute("aria-label", "关闭应用设置窗口");
    append28.append(append29, className13);
    const append30 = value128("div", "navigation-style-apply-body");
    const append31 = value128("div", "navigation-style-apply-columns");
    const append32 = value128("section");
    const append33 = value128("section");
    const value114 = (arg45, arg46) => {
      const append8 = value128("div", "navigation-style-apply-heading");
      append8.append(value128("strong", "", arg45), value128("span", "", arg46));
      return append8;
    };
    const append34 = value128("div", "navigation-style-apply-options");
    const append35 = value128("div", "navigation-style-apply-options grouped-by-page");
    const at = [];
    const push3 = [];
    const value115 = (element2, arg47, arg48, push) => {
      const append9 = value128("label", "navigation-style-apply-option");
      const type = value128("input");
      const append10 = value128("span", "", arg47);
      type.type = "checkbox";
      type.checked = true;
      type.value = element2;
      type.setAttribute("aria-label", arg47);
      push.push(type);
      append10.append(value128("small", "", arg48));
      append9.append(type, append10);
      return append9;
    };
    const has3 = new Set(length6.map(([arg33]) => arg33));
    const add = new Set(has3);
    for (const replace of has3) {
      if (replace.startsWith("effectRange.")) {
        add.add(replace.endsWith("Min") ? replace.replace(/Min$/, "Max") : replace.replace(/Max$/, "Min"));
      }
    }
    for (const [value89, value90, value91] of filter.filter(([arg49]) => add.has(arg49))) {
      const value79 = value141(value113, value89);
      const value80 = createButton && value89 === "size" ? Math.round(value79 / 44 * 100) : createButton && value89 === "iconSize" ? value79 / 2 : value79;
      const element3 = has3.has(value89);
      append34.append(value115(value89, value90, typeof value80 == "boolean" ? value80 ? "是" : "否" : value80 === undefined ? "跟随模型" : "" + (element3 ? "" : "配套上/下限 · ") + (typeof value80 == "number" ? Math.round(value80 * 1000) / 1000 : value80) + " " + value91, at));
      at.at(-1).checked = element3;
    }
    const has4 = new Map();
    for (const floorId4 of length7) {
      const value81 = createEl ? value137()?.floorId : floorId4.floorId;
      if (!has4.has(value81)) {
        has4.set(value81, []);
      }
      has4.get(value81).push(floorId4);
    }
    for (const [value92, value93] of has4) {
      const append13 = value128("section", "navigation-style-apply-page-group");
      const append14 = value128("div", "navigation-style-apply-page-heading");
      const value82 = draftRevision?.floors.find(id21 => id21.id === value92)?.name || "原楼层";
      const append15 = value128("div", "navigation-style-apply-page-controls");
      const textContent3 = value128("span");
      const append16 = value128("div", "navigation-style-apply-page-options");
      const length4 = [];
      for (const id38 of value93) {
        append16.append(value115(id38.id, id38.label || numInput, aspectBox ? "图标设置" : "灯光设置", length4));
      }
      push3.push(...length4);
      const value83 = () => {
        const value52 = length4.filter(checked3 => checked3.checked).length;
        textContent3.textContent = value52 + "/" + length4.length + " 个" + numInput;
        textContent4.textContent = value52 === length4.length ? "取消全选" : "全选";
      };
      const textContent4 = accessAllowed("", () => {
        const element = !length4.every(checked => checked.checked);
        length4.forEach(checked5 => {
          checked5.checked = element;
        });
        value83();
      });
      textContent4.className = "navigation-style-apply-page-toggle";
      textContent4.setAttribute("aria-label", "全选或取消 " + value82 + " 的" + numInput);
      append16.addEventListener("change", value83);
      append15.append(textContent3, textContent4);
      append14.append(value128("strong", "", value82), append15);
      append13.append(append14, append16);
      append35.append(append13);
      value83();
    }
    append32.append(value114("要应用的修改", "可单独取消"), append34);
    append33.append(value114("应用到其他" + numInput, "按楼层区分"), append35);
    append31.append(append32, append33);
    const hidden = value128("p", "navigation-style-apply-message");
    hidden.hidden = length7.length > 0;
    if (!length7.length) {
      hidden.textContent = "当前配置中没有其他" + numInput + "可应用。";
    }
    hidden.setAttribute("role", "status");
    const append36 = value128("div", "dialog-actions");
    const disabled12 = accessAllowed("应用所选", async () => {
      const length3 = at.filter(checked4 => checked4.checked).map(value7 => value7.value);
      const size = new Set(push3.filter(checked2 => checked2.checked).map(value2 => value2.value));
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
        const length2 = value138().filter(focalLength => size.has(focalLength.id) && focalLength.id !== numParent.id && (createEl || focalLength.floorId === numParent.floorId)).map(label => {
          const effectRange = structuredClone(label);
          appendLabeled(effectRange, value113, length3);
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
        value139(value138().map(id14 => get2.get(id14.id) || id14));
        for (const id22 of [numParent, ...length2]) {
          const value8 = capabilityCache2.get(id22.id) || structuredClone(id22);
          appendLabeled(value8, value113, length3);
          capabilityCache2.set(id22.id, value8);
        }
        renderSidebar();
        mountRuntime();
        fn12();
        textContent8.textContent = "已应用到 " + length2.length + " 个" + numInput + "，待保存配置";
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
    append36.append(accessAllowed("取消", renderSidebar), disabled12);
    append30.append(value128("p", "navigation-style-apply-summary", createEl ? "将“" + (numParent.label || stage) + "”的图标修改应用到勾选的快捷按钮，保留各自的指令绑定、名称、位置和高度。应用后点击“保存配置”。" : aspectBox ? "将“" + (numParent.label || stage) + "”的图标修改应用到勾选的" + stage + "。保留各自的模型、实体、位置、高度、点击行为、聚焦视角和状态内容。应用后点击“保存配置”完成保存。" : "将“" + (numParent.label || "灯光") + "”中选定的修改应用到勾选的灯光。保留各灯的实体、名称、位置、聚焦视角与照射范围。应用后点击“保存配置”完成保存。"), append31, hidden, append36);
    Object2.append(append28, append30);
    document.body.append(Object2);
    Object2.addEventListener("cancel", preventDefault2 => {
      preventDefault2.preventDefault();
      renderSidebar();
    });
    Object2.showModal();
  }
  const value142 = () => {
    const width = interaction3dPreviewSize(component, doc, append48.clientWidth, append48.clientHeight);
    Object.assign(append49.style, {
      width: width.width + "px",
      height: width.height + "px"
    });
  };
  const header2 = new ResizeObserver(value142);
  header2.observe(append48);
  const value143 = () => {
    if (!refreshCapabilities) {
      refreshCapabilities = true;
      fn8();
      renderSidebar();
      closeEditor?.close();
      header2.disconnect();
      value132++;
      close6?.close();
      liveStates?.();
      value145();
      setAttribute11.remove();
      rel.remove();
      document.dispatchEvent(new Event("hb-i3d-preview-scope"));
    }
  };
  const textContent8 = value128("span", "i3d-save-status");
  textContent8.setAttribute("role", "status");
  const disabled17 = accessAllowed("保存配置", async () => {
    if (value133 || refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess) {
      return;
    }
    const value84 = structuredClone(effectRangeOpen);
    const value85 = value134;
    value133 = true;
    textContent8.textContent = "保存中…";
    disabled17.disabled = true;
    pickerGeneration.textContent = "";
    try {
      await requestInteraction3dAccess();
      if (refreshCapabilities) {
        return;
      }
      await onSave(value84);
      if (!refreshCapabilities) {
        textContent8.textContent = value85 === value134 ? "已保存" : "已保存，另有新修改";
      }
    } catch (message11) {
      if (!refreshCapabilities) {
        pickerGeneration.textContent = message11.message;
        textContent8.textContent = "";
      }
    } finally {
      value133 = false;
      if (!refreshCapabilities) {
        disabled17.disabled = !capabilityCache || saveButton || unsubscribeAccess;
      }
    }
  });
  disabled17.className = "primary";
  focusBusy.append(value128("strong", "", "3D " + stage + "配置"), textContent8, disabled17, accessAllowed("退出", value143));
  append47.append(append48, focusQueue);
  setAttribute11.append(focusBusy, append47);
  document.body.append(setAttribute11);
  setAttribute11.addEventListener("cancel", preventDefault4 => {
    preventDefault4.preventDefault();
    value143();
  });
  const value144 = () => {
    const floorSelection = createEl && value137() ? value137().floorId : syncPreviewSize;
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
    value134++;
    if (!value133) {
      textContent8.textContent = "";
    }
    liveStates?.update(value144(), createEl && saving ? "vacuum-room:" + arg77 + ":" + saving : saving);
    value140();
  }
  function fn(append37, lightItem, capabilityInfo) {
    capabilityInfo.name = "i3d-" + arg75 + "-" + (saving || "scene") + "-" + lightItem;
    const effectDetails = value128("label", capabilityInfo.type === "checkbox" ? "i3d-setting-toggle" : "");
    effectDetails.append(value128("span", "", lightItem), capabilityInfo);
    append37.append(effectDetails);
    return capabilityInfo;
  }
  function appendPositiveNumber(posParent, posLabel, getValue, onPositive, arg63) {
    const posInput = value128("select");
    for (const [element5, value94] of getValue) {
      const value86 = value128("option", "", value94);
      value86.value = element5;
      posInput.append(value86);
    }
    posInput.value = onPositive;
    posInput.addEventListener("change", () => arg63(posInput.value));
    return fn(posParent, posLabel, posInput);
  }
  function fn2(arg64, arg65, arg66, arg67, arg68, arg69, arg70, type3 = "number") {
    const value116 = value128("input");
    Object.assign(value116, {
      type: type3,
      min: String(arg67),
      max: String(arg68),
      step: String(arg69),
      value: String(arg66)
    });
    value116.addEventListener(type3 === "range" ? "input" : "change", () => {
      const value65 = value116.value.trim() === "" ? NaN : Number(value116.value);
      if (Number.isFinite(value65)) {
        arg70(Math.max(arg67, Math.min(arg68, value65)));
      }
    });
    return fn(arg64, arg65, value116);
  }
  function fn3(arg71, arg72, arg73, arg74) {
    const value117 = value128("input");
    Object.assign(value117, {
      type: "number",
      step: "any",
      value: String(Number(arg73().toPrecision(12)))
    });
    value117.addEventListener("change", () => {
      const value66 = value117.value.trim() === "" ? NaN : Number(value117.value);
      if (Number.isFinite(value66) && value66 > 0) {
        value117.value = String(value66);
        arg74(value66);
      } else {
        value117.value = String(arg73());
      }
    });
    return fn(arg71, arg72, value117);
  }
  function fn4(entityId21) {
    const startsWith = entityId21.entityId || "";
    const newState2 = value135 === null ? states?.get?.(startsWith) : value135[startsWith];
    const known2 = get5.get(startsWith);
    const supported_color_modes = (newState2?.newState || newState2)?.attributes || {};
    const value118 = supported_color_modes.supported_features;
    const value119 = value118 != null && value118 !== "" && typeof value118 != "boolean" && Number.isFinite(Number(value118));
    const known3 = lightState(startsWith, newState2, known2);
    known3.known = startsWith.startsWith("switch.") || known2?.known === true || Array.isArray(supported_color_modes.supported_color_modes) && supported_color_modes.supported_color_modes.some(arg14 => arg14 !== "unknown") || value119 || known3.brightnessSupported || known3.temperatureSupported;
    if (startsWith && known3.known) {
      get5.set(startsWith, known3);
    }
    return known3;
  }
  function fn5(append38, effectDefaults2, known4) {
    append38.replaceChildren();
    if (effectDefaults2.entityId && !known4.known) {
      const setAttribute7 = value128("p", "i3d-note", "正在识别灯具能力…");
      setAttribute7.setAttribute("role", "status");
      append38.append(setAttribute7);
    }
    if (effectDefaults2.entityId && known4.known && (!known4.brightnessSupported || !known4.temperatureSupported)) {
      const append17 = value128("section", "i3d-focus-settings");
      append17.append(value128("h4", "", "默认效果"));
      const value87 = value128("div", "i3d-coordinate-grid");
      append17.append(value87);
      for (const [value67, value68, value69, value70, value71, value72] of [["默认亮度（%）", "brightness", known4.brightnessSupported, 0, 100, 1], ["默认色温（K）", "kelvin", known4.temperatureSupported, 1000, 20000, 100]]) {
        if (value69) {
          continue;
        }
        const value55 = value128("input");
        Object.assign(value55, {
          type: "number",
          min: String(value70),
          max: String(value71),
          step: String(value72),
          value: Number.isFinite(effectDefaults2.effectDefaults?.[value68]) ? String(effectDefaults2.effectDefaults[value68]) : "",
          placeholder: "跟随模型"
        });
        value55.addEventListener("change", () => {
          const value21 = value55.value.trim();
          const value22 = Number(value21);
          const effectDefaults = {
            ...effectDefaults2.effectDefaults
          };
          if (value21) {
            if (Number.isFinite(value22)) {
              effectDefaults[value68] = Math.max(value70, Math.min(value71, value22));
            }
          } else {
            delete effectDefaults[value68];
          }
          value55.value = Number.isFinite(effectDefaults[value68]) ? String(effectDefaults[value68]) : "";
          if (Object.keys(effectDefaults).length) {
            effectDefaults2.effectDefaults = effectDefaults;
          } else {
            delete effectDefaults2.effectDefaults;
          }
          mountRuntime();
        });
        fn(value87, value67, value55);
      }
      const append18 = value128("div", "i3d-focus-actions");
      append17.append(append18);
      append18.append(accessAllowed("预览默认效果", async () => {
        try {
          await liveStates.focusCommand("preview-light-effect", effectDefaults2.id, "defaults");
        } catch (message6) {
          pickerGeneration.textContent = message6.message;
        }
      }), accessAllowed("跟随模型", () => {
        delete effectDefaults2.effectDefaults;
        mountRuntime();
        fn12();
      }));
      append38.append(append17);
    }
    const append39 = value128("details", "i3d-effect-settings");
    append39.open = open;
    append39.addEventListener("toggle", () => {
      open = append39.open;
    });
    append39.append(value128("summary", "", "效果范围"));
    const value120 = {
      brightnessMin: 1,
      brightnessMax: 100,
      temperatureMin: known4.minimum,
      temperatureMax: known4.maximum,
      ...effectDefaults2.effectRange
    };
    const append40 = value128("div", "i3d-effect-grid");
    append39.append(append40);
    for (const [value95, endsWith, value96, value97, value98, value99] of [["最暗亮度（%）", "brightnessMin", "brightnessMax", 0, 100, 1], ["最亮亮度（%）", "brightnessMax", "brightnessMin", 0, 100, 1], ["最低色温（K）", "temperatureMin", "temperatureMax", 1000, 20000, 100], ["最高色温（K）", "temperatureMax", "temperatureMin", 1000, 20000, 100]]) {
      const append19 = value128("div", "i3d-effect-option");
      append40.append(append19);
      const value88 = fn2(append19, value95, value120[endsWith], value97, value98, value99, arg31 => {
        value120[endsWith] = endsWith.endsWith("Min") ? Math.min(arg31, value120[value96]) : Math.max(arg31, value120[value96]);
        value88.value = String(value120[endsWith]);
        effectDefaults2.effectRange = {
          ...value120
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
      disabled9.setAttribute("aria-label", "预览" + value95);
      append19.append(disabled9);
    }
    append39.append(accessAllowed("恢复默认效果", () => {
      delete effectDefaults2.effectRange;
      mountRuntime();
      fn12();
    }));
    append38.append(append39);
  }
  function fn6() {
    return (draftRevision?.floors || []).filter(id30 => id30.id === syncPreviewSize).flatMap(id39 => (aspectBox ? id39[statusNote] || [] : id39.groups || []).filter(id25 => !value138().some(floorId2 => floorId2.floorId === id39.id && floorId2[selectedLightId] === id25.id)).map(group4 => ({
      floor: id39,
      group: group4,
      key: JSON.stringify([id39.id, group4.id])
    })));
  }
  async function fn7(deviceKind, startAdding = false) {
    if (refreshCapabilities || value133 || !capabilityCache || saveButton || unsubscribeAccess) {
      return;
    }
    const properties = structuredClone(effectRangeOpen);
    value143();
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
      vacuumId: createButton ? saving : arg77
    });
  }
  function fn8() {
    if (close5) {
      value132++;
      close6?.close();
      close6 = null;
    }
    close5?.close();
    close5?.remove();
    close5 = null;
  }
  function fn9(currentTarget) {
    if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver || close5) {
      return;
    }
    if (createEl) {
      fn10(currentTarget?.currentTarget || currentTarget?.target);
      return;
    }
    const length8 = fn6();
    if (!length8.length || value138().length >= 128) {
      return;
    }
    value132++;
    close6?.close();
    const setAttribute10 = value128("dialog", "settings-dialog i3d-add-dialog");
    close5 = setAttribute10;
    setAttribute10.setAttribute("aria-label", stylesheet ? "添加设备" : "添加" + stage + "按钮");
    const append41 = value128("div", "dialog-heading");
    const append42 = value128("div");
    append42.append(value128("span", "", "ADD BUTTON"), value128("h2", "", stylesheet ? "添加设备" : "添加" + stage + "按钮"));
    const className14 = accessAllowed("×", fn8);
    className14.className = "icon-button";
    className14.setAttribute("aria-label", "关闭添加按钮窗口");
    append41.append(append42, className14);
    const append43 = value128("div", "i3d-add-dialog-body");
    const textContent7 = value128("p", "i3d-error");
    textContent7.setAttribute("role", "status");
    if (stylesheet) {
      appendPositiveNumber(append43, "设备类型", [["nas", "NAS"], ["television", "电视"]], arg75, arg22 => {
        if (arg22 !== arg75) {
          fn7(arg22, true);
        }
      }).setAttribute("aria-label", "设备类型");
    }
    const disabled13 = appendPositiveNumber(append43, aspectBox ? "关联" + stage + "模型" : "关联灯组", length8.map(key5 => [key5.key, draft(key5.group)]), length8[0].key, () => {
      textContent7.textContent = "";
    });
    disabled13.setAttribute("aria-label", aspectBox ? "关联" + stage + "模型" : "关联灯组");
    const append44 = value128("div", "dialog-actions");
    let value121 = false;
    const disabled14 = accessAllowed("确定添加", async () => {
      if (value121 || refreshCapabilities || !capabilityCache || close5 !== setAttribute10) {
        return;
      }
      value121 = true;
      disabled14.disabled = true;
      disabled13.disabled = true;
      textContent7.textContent = "";
      const value56 = disabled13.value;
      try {
        await requestInteraction3dAccess();
        if (refreshCapabilities || !capabilityCache || close5 !== setAttribute10) {
          return;
        }
        const group = fn6().find(key2 => key2.key === value56);
        if (!group || value138().length >= 128) {
          throw new Error("该对象已添加或不再可用，请关闭窗口后重新选择。");
        }
        const id26 = {
          id: randomUuid(),
          floorId: group.floor.id,
          [selectedLightId]: group.group.id,
          entityId: "",
          label: draft(group.group),
          ...(aspectBox ? {} : {
            x: group.group.x,
            y: group.group.y,
            height: group.group.height ?? group.floor.wallHeight ?? 2.8,
            fadeDuration: 0.3
          }),
          ...(viewPane ? {
            coverDirection: "auto"
          } : {}),
          size: 44,
          iconSize: 26,
          visible: true,
          icon: errorNote,
          clickAction: dialog ? "focus-panel" : "focus"
        };
        value138().push(id26);
        saving = id26.id;
        fn8();
        mountRuntime();
        fn12();
      } catch (message9) {
        if (close5 === setAttribute10) {
          textContent7.textContent = message9.message;
        }
      } finally {
        value121 = false;
        disabled14.disabled = false;
        disabled13.disabled = false;
      }
    });
    disabled14.className = "primary";
    append44.append(accessAllowed("取消", fn8), disabled14);
    append43.append(value128("p", "i3d-note", "添加后可继续设置" + stage + "按钮，最后点击“保存配置”完成保存。"), textContent7, append44);
    setAttribute10.append(append41, append43);
    document.body.append(setAttribute10);
    setAttribute10.addEventListener("cancel", preventDefault3 => {
      preventDefault3.preventDefault();
      fn8();
    });
    setAttribute10.showModal();
  }
  async function fn10(trigger4) {
    const floorId5 = value137();
    if (!floorId5 || value138().length >= 64) {
      return;
    }
    const value122 = ++value132;
    close6?.close();
    try {
      const close4 = await pickers.entity({
        trigger: trigger4,
        deviceKind: "vacuum-room",
        current: "",
        onSelect(entityId17) {
          if (refreshCapabilities || !capabilityCache || value122 !== value132 || value137() !== floorId5 || value138().length >= 64 || !entityId17) {
            return;
          }
          const name = entities.find(entityId9 => entityId9.entityId === entityId17);
          const newState = states?.get?.(entityId17);
          const attributes = newState?.newState || newState;
          const vacuums = draftRevision.floors.find(id8 => id8.id === floorId5.floorId);
          const value14 = vacuums?.vacuums?.find(id9 => id9.id === floorId5.modelId);
          const length = (vacuums?.plan?.walls || []).flatMap(start => [start.start, start.end]);
          const value15 = arg5 => length.length ? length.reduce((arg3, arg4) => arg3 + arg4[arg5], 0) / length.length : value14?.[arg5] || 0;
          const id23 = {
            id: randomUuid(),
            entityId: entityId17,
            label: name?.name || attributes?.attributes?.friendly_name || entityId17,
            x: value15("x"),
            y: value15("y"),
            height: 0.08,
            size: 44,
            iconSize: 26,
            fontSize: 12,
            hitSize: 44,
            icon: "mdi:broom",
            visible: true
          };
          value139([...value138(), id23]);
          saving = id23.id;
          value132++;
          close6?.close();
          close6 = null;
          fn12();
          mountRuntime();
        }
      });
      if (refreshCapabilities || value122 !== value132) {
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
  function fn11() {
    focusQueue.append(accessAllowed("返回扫地机配置", () => void fn7("vacuum")));
    if (!draftRevision) {
      return;
    }
    const length9 = effectRangeOpen.devices?.vacuums || [];
    if (!length9.length) {
      focusQueue.append(value128("p", "i3d-note", "请先在扫地机配置中添加并绑定扫地机。"));
      return;
    }
    appendPositiveNumber(focusQueue, "所属扫地机", length9.map(id32 => [id32.id, id32.label || id32.deviceName || "扫地机"]), arg77, arg50 => {
      arg77 = arg50;
      saving = "";
      capabilityCache2.clear();
      liveStates?.();
      liveStates = null;
      fn13();
      fn12();
    });
    const append45 = value128("div", "i3d-light-heading");
    const disabled15 = accessAllowed("添加快捷指令", fn9);
    disabled15.disabled = value138().length >= 64;
    append45.append(value128("h4", "", "快捷按钮"), disabled15);
    focusQueue.append(append45);
    if (!value138().some(id33 => id33.id === saving)) {
      saving = value138()[0]?.id || "";
    }
    if (!saving) {
      focusQueue.append(value128("p", "i3d-note", "添加按钮后，选择全部实体中的清扫指令，在户型中拖动按钮放置。"));
      return;
    }
    appendPositiveNumber(focusQueue, "当前按钮", value138().map(id34 => [id34.id, id34.label]), saving, arg51 => {
      saving = arg51;
      value132++;
      close6?.close();
      fn12();
      mountRuntime();
    });
    const icon2 = value138().find(id35 => id35.id === saving);
    const className15 = accessAllowed("删除此快捷按钮", () => {
      value132++;
      close6?.close();
      value139(value138().filter(arg15 => arg15 !== icon2));
      saving = "";
      fn12();
      mountRuntime();
    });
    className15.className = "i3d-remove-light";
    focusQueue.append(className15);
    const value123 = value128("input");
    value123.value = icon2.label;
    value123.maxLength = 128;
    value123.onchange = () => {
      icon2.label = value123.value.trim() || "房间清扫";
      fn12();
      mountRuntime();
    };
    fn(focusQueue, "名称", value123);
    const value124 = (arg52, trigger3) => {
      const value73 = ++value132;
      Promise.resolve(pickers[arg52]({
        trigger: trigger3,
        deviceKind: "vacuum-room",
        current: arg52 === "icon" ? icon2.icon : icon2.entityId,
        onSelect(icon) {
          if (!refreshCapabilities && !!capabilityCache && value73 === value132 && !!value138().includes(icon2)) {
            if (arg52 === "icon") {
              icon2.icon = icon;
            } else {
              icon2.entityId = icon;
            }
            fn12();
            mountRuntime();
          }
        }
      })).then(close3 => {
        if (refreshCapabilities || value73 !== value132) {
          close3?.close();
        } else {
          close6 = close3;
        }
      }).catch(message10 => {
        pickerGeneration.textContent = message10.message;
      });
    };
    const className16 = accessAllowed(icon2.entityId || "选择实体（全部）", () => value124("entity", className16));
    className16.className = "i3d-picker-button";
    fn(focusQueue, "指令实体", className16);
    const className17 = accessAllowed("", () => value124("icon", className17));
    className17.className = "i3d-picker-button i3d-icon-picker-button";
    const style2 = value128("i");
    style2.style.maskImage = "url('/bridge-static/vendor/mdi/7.4.47/svg/" + (icon2.icon || errorNote).slice(4) + ".svg')";
    style2.style.webkitMaskImage = style2.style.maskImage;
    className17.append(style2, value128("span", "", icon2.icon || errorNote));
    fn(focusQueue, "图标", className17);
    const value125 = value128("div", "i3d-button-visibility-row i3d-shortcut-visibility");
    focusQueue.append(value125);
    for (const [value100, value101] of [["hiddenClickable", "隐藏（可点击）"], ["buttonHidden", "隐藏（不可点击）"]]) {
      const checked9 = value128("input");
      checked9.type = "checkbox";
      checked9.checked = icon2[value100] === true;
      checked9.onchange = () => {
        icon2[value100] = checked9.checked;
        if (checked9.checked) {
          icon2[value100 === "buttonHidden" ? "hiddenClickable" : "buttonHidden"] = false;
        }
        fn12();
        mountRuntime();
      };
      fn(value125, value101, checked9);
    }
    for (const [value102, value103] of [["iconHidden", "隐藏图标"], ["labelHidden", "隐藏名称"]]) {
      const checked10 = value128("input");
      checked10.type = "checkbox";
      checked10.checked = icon2[value102] === true;
      checked10.onchange = () => {
        icon2[value102] = checked10.checked;
        mountRuntime();
      };
      fn(value125, value103, checked10);
    }
    const value126 = value128("div", "i3d-coordinate-grid i3d-size-grid i3d-shortcut-size-grid");
    focusQueue.append(value126);
    for (const [value104, value105, value106] of [["size", "按钮大小（px）", 44], ["iconSize", "图标大小（px）", 26], ["fontSize", "文字大小（px）", 12], ["hitSize", "触控范围（px）", 44]]) {
      fn3(value126, value105, () => icon2[value104] || value106, arg34 => {
        icon2[value104] = arg34;
        mountRuntime();
      });
    }
    const value127 = value128("div", "i3d-coordinate-grid");
    focusQueue.append(value127);
    for (const toUpperCase2 of ["x", "y"]) {
      fn2(value127, "位置 " + toUpperCase2.toUpperCase(), icon2[toUpperCase2], -1000000, 1000000, 1, arg35 => {
        icon2[toUpperCase2] = arg35;
        mountRuntime();
      });
    }
    fn2(value127, "高度（米）", icon2.height ?? 0.08, 0, 20, 0.1, height2 => {
      icon2.height = height2;
      mountRuntime();
    });
    focusQueue.append(value128("p", "i3d-note", "拖动按钮调整位置，拖动空白处旋转户型。点击只执行绑定指令，不弹窗、不聚焦。"));
    const append46 = value128("section", "navigation-batch-section i3d-light-batch");
    const disabled16 = accessAllowed("一键应用到其他快捷按钮", () => appendNumber(icon2));
    append46.append(value128("h4", "", "图标设置一键应用"), disabled16);
    focusQueue.append(append46);
    value140 = () => {
      disabled16.disabled = !resolveLightCapability(icon2).length || !capabilityCache;
    };
    value140();
  }
  function fn12() {
    value136 = () => {};
    value140 = () => {};
    focusQueue.replaceChildren();
    if (createEl) {
      fn11();
      return;
    }
    if (!aspectBox && effectRangeOpen.lightingMode === "region") {
      const disabled10 = accessAllowed("编辑照射范围", async () => {
        if (!resizeObserver) {
          resizeObserver = true;
          disabled10.disabled = true;
          try {
            const close = await openInteraction3dRangeEditor({
              component: {
                ...component,
                properties: structuredClone(value144())
              },
              document: doc,
              states,
              onSave(arg2) {
                if (refreshCapabilities || !capabilityCache) {
                  throw new Error("灯光配置已关闭，请重新打开。");
                }
                effectRangeOpen.lightRegionOverrides = structuredClone(arg2);
                mountRuntime();
              },
              onClose() {
                closeEditor = null;
                resizeObserver = false;
                if (!refreshCapabilities) {
                  fn12();
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
              fn12();
            }
          }
        }
      });
      disabled10.dataset.interaction3dRangeEditor = "true";
      disabled10.disabled = resizeObserver || !effectRangeOpen.sceneId;
      focusQueue.append(disabled10, value128("p", "i3d-note", "在独立弹窗中拖动范围；保存范围后，再点击“保存配置”保存到当前控件。"));
    }
    if (draftRevision) {
      if (stylesheet) {
        appendPositiveNumber(focusQueue, "设备类别", [["nas", "NAS"], ["television", "电视"]], arg75, arg23 => {
          if (arg23 !== arg75) {
            fn7(arg23);
          }
        });
      }
      appendPositiveNumber(focusQueue, "配置楼层", draftRevision.floors.map(id27 => [id27.id, id27.name]), syncPreviewSize, arg36 => {
        syncPreviewSize = arg36;
        mountRuntime();
        fn12();
      });
      const append20 = value128("div", "i3d-light-heading");
      const length5 = fn6();
      const disabled11 = accessAllowed("添加" + stage, fn9);
      disabled11.disabled = !length5.length || value138().length >= 128;
      append20.append(value128("h4", "", stylesheet ? "设备列表" : stage + "按钮"), disabled11);
      focusQueue.append(append20);
      const some2 = value138().filter(floorId3 => floorId3.floorId === syncPreviewSize || aspectBox && !draftRevision.floors.some(id15 => id15.id === floorId3.floorId));
      if (!some2.some(id28 => id28.id === saving)) {
        saving = some2[0]?.id || "";
      }
      if (some2.length) {
        appendPositiveNumber(focusQueue, stylesheet ? "当前设备" : "当前按钮", some2.map(id24 => [id24.id, id24.label]), saving, arg24 => {
          value132++;
          close6?.close();
          saving = arg24;
          mountRuntime();
          fn12();
        });
      }
      const statusSource = value138().find(id29 => id29.id === saving);
      if (statusSource) {
        const className7 = accessAllowed(stylesheet ? "删除此设备" : "删除此" + stage + "按钮", () => {
          value132++;
          close6?.close();
          value139(value138().filter(id10 => id10.id !== statusSource.id));
          saving = "";
          mountRuntime();
          fn12();
        });
        className7.className = "i3d-remove-light";
        focusQueue.append(className7);
        if (stylesheet) {
          const value39 = value128("input");
          value39.value = header ? "电视" : "NAS";
          value39.readOnly = true;
          fn(focusQueue, "设备类型", value39);
        }
        const value57 = value128("input");
        value57.value = statusSource.label;
        value57.maxLength = 128;
        value57.addEventListener("change", () => {
          statusSource.label = value57.value.trim() || stage;
          mountRuntime();
        });
        fn(focusQueue, "名称", value57);
        if (aspectBox) {
          const some = draftRevision.floors.filter(id13 => id13.id === syncPreviewSize).flatMap(id16 => (id16[statusNote] || []).filter(id3 => !value138().some(floorId => floorId !== statusSource && floorId.floorId === id16.id && floorId.modelId === id3.id)).map(model => ({
            floor: id16,
            model,
            key: id16.id + "/" + model.id
          })));
          const value40 = statusSource.floorId + "/" + statusSource.modelId;
          const value41 = some.some(key3 => key3.key === value40);
          const unshift = some.map(key4 => [key4.key, draft(key4.model)]);
          if (!value41) {
            unshift.unshift([value40, "原模型已移除，请重新选择"]);
          }
          appendPositiveNumber(focusQueue, "关联" + stage + "模型", unshift, value40, arg16 => {
            const floor = some.find(key => key.key === arg16);
            if (!!floor && arg16 !== value40) {
              statusSource.floorId = floor.floor.id;
              statusSource.modelId = floor.model.id;
              delete statusSource.focusCamera;
              delete statusSource.followCamera;
              mountRuntime();
              fn12();
            }
          });
          if (!value41) {
            focusQueue.append(value128("p", "i3d-note", "原模型已移除，请重新选择。已保存的实体绑定和按钮设置仍然保留。"));
          }
        }
        if (viewPane) {
          appendPositiveNumber(focusQueue, "开合方向", [["auto", "继承模型"], ["left", "单开 · 向左收拢"], ["right", "单开 · 向右收拢"], ["split", "双开 · 向两侧收拢"]], statusSource.coverDirection, arg17 => {
            statusSource.coverDirection = ["left", "right", "split"].includes(arg17) ? arg17 : "auto";
            mountRuntime();
          });
        }
        if (viewPane) {
          const addEventListener2 = value128("input");
          Object.assign(addEventListener2, {
            type: "checkbox",
            checked: statusSource.iconStateReversed === true
          });
          addEventListener2.addEventListener("change", () => {
            statusSource.iconStateReversed = addEventListener2.checked;
            mountRuntime();
          });
          fn(focusQueue, "图标状态反向", addEventListener2);
        }
        const value58 = async (arg25, trigger) => {
          const value23 = ++value132;
          pickerGeneration.textContent = "";
          try {
            const value3 = pickers?.[arg25 === "powerEntity" ? "entity" : arg25];
            if (!value3) {
              throw new Error("选择器尚未准备好，请保存后刷新页面。");
            }
            const close2 = await value3({
              trigger,
              deviceKind: arg25 === "powerEntity" ? "television-power" : arg75,
              current: arg25 === "vacuum" ? statusSource.deviceId : arg25 === "powerEntity" ? statusSource.powerEntityId : arg25 === "nas" ? statusSource.statusSource?.deviceId : arg25 === "icon" ? statusSource.icon : statusSource.entityId,
              onSelect(deviceId) {
                if (!refreshCapabilities && !!capabilityCache && value23 === value132 && !!value138().includes(statusSource)) {
                  if (arg25 === "vacuum") {
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
                  } else if (arg25 === "powerEntity") {
                    if (deviceId) {
                      statusSource.powerEntityId = deviceId;
                    } else {
                      delete statusSource.powerEntityId;
                    }
                  } else if (arg25 === "nas") {
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
                  } else if (arg25 === "icon") {
                    statusSource.icon = deviceId;
                  } else {
                    statusSource.entityId = deviceId;
                  }
                  mountRuntime();
                  fn12();
                }
              }
            });
            if (refreshCapabilities || !capabilityCache || value23 !== value132) {
              close2?.close();
            } else {
              close6 = close2;
            }
          } catch (message4) {
            if (!refreshCapabilities && value23 === value132) {
              pickerGeneration.textContent = message4.message;
            }
          }
        };
        const name2 = entities.find(entityId18 => entityId18.entityId === statusSource.entityId);
        if (sidebar) {
          const className2 = accessAllowed(statusSource.statusSource?.name || "选择飞牛或群晖", () => void value58("nas", className2));
          className2.className = "i3d-picker-button";
          fn(focusQueue, "NAS 数据来源", className2);
          if (statusSource.statusSource) {
            const value16 = statusSource.statusSource.visibleMetrics?.length ?? statusSource.statusSource.metrics.length;
            const className = accessAllowed("选择显示内容（" + value16 + " 项）", () => appendSelect(statusSource));
            className.className = "i3d-picker-button";
            focusQueue.append(className);
          }
          focusQueue.append(value128("p", "i3d-note", statusSource.statusSource ? "已匹配 " + statusSource.statusSource.metrics.length + " 项状态。点击数据来源可重新匹配；弹窗只展示状态。" : "选择整台 NAS，自动匹配 CPU、内存、温度、存储和网络。无需逐个选择传感器。"));
        }
        const className8 = accessAllowed("", () => void value58("entity", className8));
        className8.className = "i3d-picker-button";
        className8.title = statusSource.entityId || (aspectBox ? "选择" + stage + "实体" : "选择灯或开关");
        className8.append(value128("span", "", name2?.name || statusSource.entityId || (aspectBox ? "选择" + stage + "实体" : "选择灯或开关")));
        if (!createButton && (!sidebar || !statusSource.statusSource)) {
          fn(focusQueue, sidebar ? "原开启实体（未关联 NAS）" : "绑定实体", className8);
        }
        if (createButton) {
          const value42 = value128("input");
          Object.assign(value42, {
            type: "number",
            min: "0",
            max: "300",
            step: "1",
            value: String(effectRangeOpen.navigation?.followOffset ?? 16),
            title: "所有扫地机共用此标签偏移"
          });
          value42.addEventListener("change", () => {
            if (!capabilityCache || refreshCapabilities) {
              return;
            }
            const value9 = value42.value.trim() === "" ? NaN : Number(value42.value);
            if (Number.isFinite(value9)) {
              effectRangeOpen.navigation = {
                ...effectRangeOpen.navigation,
                followOffset: Math.max(0, Math.min(300, value9))
              };
              mountRuntime();
            }
            value42.value = String(effectRangeOpen.navigation?.followOffset ?? 16);
          });
          fn(focusQueue, "跟随标签上移（px）", value42);
          for (const [value24, value25] of [["motionEnabled", "跟随真实位置移动"], ["funMessages", "工作时显示趣味短句"]]) {
            const addEventListener = value128("input");
            Object.assign(addEventListener, {
              type: "checkbox",
              checked: statusSource[value24] !== false
            });
            addEventListener.addEventListener("change", () => {
              statusSource[value24] = addEventListener.checked;
              mountRuntime();
            });
            fn(focusQueue, value25, addEventListener);
          }
          const className3 = accessAllowed(statusSource.deviceName || "选择扫地机设备", () => void value58("vacuum", className3));
          className3.className = "i3d-picker-button";
          fn(focusQueue, "绑定设备", className3);
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
            focusQueue.append(value128("p", "i3d-note", "已识别：" + statusSource.entityId));
          }
          if (entities2?.maps.length > 1) {
            appendPositiveNumber(focusQueue, "已识别的地图", [["", "请选择地图"], ...entities2.maps.map(entityId8 => [entityId8.entityId, entityId8.name || entityId8.entityId])], statusSource.map?.entityId || "", entityId14 => {
              statusSource.map = {
                ...statusSource.map,
                entityId: entityId14
              };
              mountRuntime();
              fn12();
            });
          }
          const trigger2 = accessAllowed(statusSource.map?.entityId || "选择扫地机地图", async () => {
            const value4 = ++value132;
            try {
              close6 = await pickers.entity({
                trigger: trigger2,
                deviceKind: "vacuum-map",
                current: statusSource.map?.entityId || "",
                onSelect(entityId6) {
                  if (!refreshCapabilities && !!capabilityCache && value4 === value132 && !!value138().includes(statusSource)) {
                    statusSource.map = {
                      ...statusSource.map,
                      entityId: entityId6
                    };
                    mountRuntime();
                    fn12();
                  }
                }
              });
            } catch (message) {
              pickerGeneration.textContent = message.message;
            }
          });
          trigger2.className = "i3d-picker-button";
          fn(focusQueue, "地图来源", trigger2);
          const value43 = accessAllowed("底图对齐", () => {
            const value5 = value135 === null ? states?.get?.(statusSource.map?.entityId) : value135[statusSource.map?.entityId];
            const value6 = value135 === null ? states?.get?.(statusSource.entityId) : value135[statusSource.entityId];
            const sourceMapId = vacuumMapIdentity(value5, value6);
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
                if (!refreshCapabilities && capabilityCache && value138().includes(statusSource)) {
                  statusSource.map = map.map;
                  mountRuntime();
                  fn12();
                }
              }
            });
          });
          focusQueue.append(value43);
        }
        if (header) {
          const className4 = accessAllowed(statusSource.powerEntityId || "不单独绑定", () => void value58("powerEntity", className4));
          className4.className = "i3d-picker-button";
          fn(focusQueue, "电视电源状态（可选）", className4);
          focusQueue.append(value128("p", "i3d-note", "绑定 Apple TV 的 media_player 实体，同步封面、应用、节目和播放状态。电源状态可单独绑定电视；弹窗只读，不同步实际视频。"));
        }
        if (sidebar) {
          focusQueue.append(value128("p", "i3d-note", statusSource.statusSource ? "已选择 NAS 自身状态数据作为呼吸灯依据。安全状态只用于告警。" : "请先选择 NAS 数据来源。原来的试绑实体不会自动作为 NAS 数据来源。"));
        }
        appendPositiveNumber(focusQueue, "点击" + stage, dialog ? [["focus-panel", "聚焦并显示状态"], ["panel", "仅显示状态"], ["focus", "仅聚焦"]] : viewPane ? [["focus", "聚焦并显示控制"], ["panel", "仅显示控制"]] : body ? [["focus", "聚焦并显示控制"], ["turn-on-focus", "聚焦并开启"], ["turn-on", "仅开关空调"], ["turn-on-panel", "开启并显示控制"]] : [["focus", "仅聚焦"], ["turn-on-focus", "聚焦并开灯"], ["turn-on", "仅开关灯"], ["turn-on-panel", "开灯并弹窗"]], statusSource.clickAction, arg26 => {
          statusSource.clickAction = sceneMeta(arg26);
          mountRuntime();
        });
        const value59 = value128("div", "i3d-button-visibility-row");
        focusQueue.append(value59);
        const checked7 = value128("input");
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
        fn(value59, "隐藏（可点击）", checked7).parentElement.className += " i3d-hidden-clickable-setting";
        const checked8 = value128("input");
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
        fn(value59, "隐藏（不可点击）", checked8).parentElement.className += " i3d-hidden-clickable-setting";
        if (!createButton) {
          const className5 = accessAllowed("", () => void value58("icon", className5));
          className5.className = "i3d-picker-button i3d-icon-picker-button";
          const style = value128("i");
          style.setAttribute("aria-hidden", "true");
          const value44 = "/bridge-static/vendor/mdi/7.4.47/svg/" + statusSource.icon.replace(/^mdi:/, "") + ".svg";
          style.style.maskImage = "url(\"" + value44 + "\")";
          style.style.webkitMaskImage = "url(\"" + value44 + "\")";
          className5.append(style, value128("span", "", statusSource.icon));
          fn(focusQueue, "图标", className5);
        }
        const value60 = value128("div", "i3d-coordinate-grid i3d-size-grid");
        focusQueue.append(value60);
        const value61 = () => Number.isFinite(statusSource.hitSize) && statusSource.hitSize > 0 ? statusSource.hitSize : Math.max(44, statusSource.size);
        fn3(value60, createButton ? "状态框缩放（%）" : "按钮大小（px）", () => createButton ? Math.round(statusSource.size / 44 * 100) : statusSource.size, arg27 => {
          statusSource.size = createButton ? arg27 / 100 * 44 : arg27;
          value62.value = String(Number(value61().toPrecision(12)));
          mountRuntime();
        });
        fn3(value60, createButton ? "文字大小（px）" : "图标大小（px）", () => createButton ? statusSource.iconSize / 2 : statusSource.iconSize, arg28 => {
          statusSource.iconSize = createButton ? arg28 * 2 : arg28;
          mountRuntime();
        });
        const value62 = fn3(value60, "触控范围（px）", value61, hitSize => {
          statusSource.hitSize = hitSize;
          mountRuntime();
        });
        if (aspectBox) {
          const elevation = draftRevision.floors.find(id11 => id11.id === statusSource.floorId)?.[statusNote]?.find(id17 => id17.id === statusSource.modelId);
          const value45 = value128("div", "i3d-coordinate-grid");
          focusQueue.append(value45);
          const disabled4 = accessAllowed("恢复跟随模型", () => {
            delete statusSource.x;
            delete statusSource.y;
            delete statusSource.height;
            mountRuntime();
            fn12();
          });
          disabled4.disabled = !["x", "y", "height"].some(arg7 => Number.isFinite(statusSource[arg7]));
          for (const [value26, value27, value28, value29, value30] of [["x", "位置 X", -1000000, 1000000, 1], ["y", "位置 Y", -1000000, 1000000, 1], ["height", "高度（米）", 0, 20, 0.1]]) {
            const value17 = Number.isFinite(statusSource[value26]) ? statusSource[value26] : createButton && value26 === "height" ? (Number(elevation?.elevation) || 0) + (Number(elevation?.height) || 0.85) + 0.25 : Number.isFinite(elevation?.[value26]) ? elevation[value26] : 0;
            fn2(value45, createButton && value26 === "height" ? "离地高度（米）" : value27, value17, value28, value29, value30, arg8 => {
              statusSource[value26] = arg8;
              disabled4.disabled = false;
              mountRuntime();
            });
          }
          focusQueue.append(disabled4);
          const append = value128("section", "navigation-batch-section i3d-light-batch");
          const append2 = value128("h4");
          const textContent = value128("span");
          append2.append(value128("span", "", "图标设置一键应用"), textContent);
          const disabled5 = accessAllowed("一键应用到其他" + stage, () => appendNumber(statusSource));
          value140 = () => {
            const value10 = resolveLightCapability(statusSource).length;
            textContent.textContent = value10 + " 项修改";
            disabled5.disabled = !value10 || !capabilityCache || saveButton || unsubscribeAccess;
          };
          value140();
          append.append(append2, disabled5);
          focusQueue.append(append);
        } else {
          const value46 = value128("div", "i3d-coordinate-grid");
          focusQueue.append(value46);
          for (const toUpperCase of ["x", "y"]) {
            fn2(value46, "位置 " + toUpperCase.toUpperCase(), statusSource[toUpperCase], -1000000, 1000000, 1, arg9 => {
              statusSource[toUpperCase] = arg9;
              mountRuntime();
            });
          }
          fn2(value46, "高度（米）", statusSource.height, 0, 20, 0.1, height => {
            statusSource.height = height;
            mountRuntime();
          });
          fn2(focusQueue, "缓开缓灭（秒）", statusSource.fadeDuration, 0, 10, 0.1, fadeDuration => {
            statusSource.fadeDuration = fadeDuration;
            mountRuntime();
          });
          const contains = value128("div");
          focusQueue.append(contains);
          const value47 = known => JSON.stringify([known.known, known.brightnessSupported, known.temperatureSupported, known.minimum, known.maximum]);
          const value48 = fn4(statusSource);
          let value49 = value47(value48);
          value136 = () => {
            if (refreshCapabilities || !capabilityCache || saveButton || unsubscribeAccess || contains.contains?.(document.activeElement)) {
              return;
            }
            const value11 = fn4(statusSource);
            const value12 = value47(value11);
            if (value12 !== value49) {
              value49 = value12;
              fn5(contains, statusSource, value11);
            }
          };
          contains.addEventListener("focusout", () => queueMicrotask(value136));
          fn5(contains, statusSource, value48);
          const append3 = value128("section", "navigation-batch-section i3d-light-batch");
          const append4 = value128("h4");
          const textContent2 = value128("span");
          append4.append(value128("span", "", "灯光设置一键应用"), textContent2);
          const disabled6 = accessAllowed("一键应用到其他灯光", () => appendNumber(statusSource));
          value140 = () => {
            const value13 = resolveLightCapability(statusSource).length;
            textContent2.textContent = value13 + " 项修改";
            disabled6.disabled = !value13 || !capabilityCache || saveButton || unsubscribeAccess || resizeObserver;
          };
          value140();
          append3.append(append4, disabled6);
          focusQueue.append(append3);
        }
        const append6 = value128("section", "i3d-focus-settings");
        focusQueue.append(append6);
        const value63 = createButton && saveStatus === "follow" ? "followCamera" : "focusCamera";
        append6.append(value128("h4", "", value63 === "followCamera" ? "跟随视角" : "聚焦视角"));
        if (createButton && !saveButton) {
          const append5 = value128("div", "i3d-focus-actions");
          for (const [value31, value32] of [["focus", "聚焦视角"], ["follow", "跟随视角"]]) {
            const setAttribute = accessAllowed(value32, () => {
              saveStatus = value31;
              fn12();
            });
            setAttribute.setAttribute("aria-pressed", String(saveStatus === value31));
            setAttribute.disabled = unsubscribeAccess;
            append5.append(setAttribute);
          }
          append6.append(append5);
        }
        if (value63 === "followCamera") {
          append6.append(value128("p", "i3d-note", "固定鸟瞰角度跟随机器人平移，不随机器人转向。调整角度和远近后保存；跟随时不弹出控制面板。"));
        }
        const value64 = async (arg29, arg30) => {
          const value33 = value130;
          const value34 = arg29 === "focus-focal-length";
          const value35 = value131;
          let value36;
          value131 = new Promise(arg6 => {
            value36 = arg6;
          });
          if (!value34) {
            unsubscribeAccess = true;
            pickerGeneration.textContent = "";
            fn12();
          }
          try {
            await value35;
            if (refreshCapabilities || value33 !== value130) {
              return;
            }
            const camera = await liveStates.focusCommand(value63 === "followCamera" && arg29 === "edit-light-camera" ? "edit-follow-camera" : arg29, statusSource.id, arg30);
            if (refreshCapabilities || value33 !== value130) {
              return;
            }
            if (arg29 === "save-light-camera") {
              statusSource[value63] = camera.camera;
              saveButton = false;
              mode = null;
              mountRuntime();
            } else if (arg29 === "cancel-light-camera") {
              saveButton = false;
              mode = null;
            } else if (arg29 !== "preview-light-camera") {
              saveButton = true;
              mode = camera.camera;
            }
          } catch (message5) {
            if (!refreshCapabilities && value33 === value130) {
              pickerGeneration.textContent = message5.message;
            }
          } finally {
            value36();
            if (!refreshCapabilities && value33 === value130 && !value34) {
              unsubscribeAccess = false;
              fn12();
            }
          }
        };
        const append7 = value128("div", "i3d-focus-actions");
        append6.append(append7);
        if (saveButton) {
          const className6 = accessAllowed(aspectBox ? "保存此" + stage + "视角" : "保存此灯视角", () => void value64("save-light-camera"));
          className6.className = "primary";
          append7.append(className6, accessAllowed("取消调整", () => void value64("cancel-light-camera")));
          const setAttribute3 = value128("div", "i3d-focus-actions");
          setAttribute3.setAttribute("role", "group");
          setAttribute3.setAttribute("aria-label", "聚焦投影");
          append6.append(setAttribute3);
          for (const [value37, value38] of [["orthographic", "正交"], ["perspective", "透视"]]) {
            const setAttribute2 = accessAllowed(value38, () => void value64("focus-projection", value37));
            setAttribute2.setAttribute("aria-pressed", String((mode?.mode || "orthographic") === value37));
            setAttribute3.append(setAttribute2);
          }
          const disabled7 = fn2(append6, "焦段（mm）", Math.round(mode?.focalLength || 50), 18, 120, 1, arg11 => void value64("focus-focal-length", arg11));
          disabled7.disabled = mode?.mode !== "perspective";
        } else {
          append7.append(accessAllowed(statusSource[value63] ? "调整视角" : "设置视角", () => void value64("edit-light-camera")), ...(value63 === "followCamera" ? [] : [accessAllowed("预览聚焦", () => void value64("preview-light-camera"))]));
          const disabled8 = accessAllowed(value63 === "followCamera" ? "恢复默认鸟瞰" : statusSource[value63] ? "恢复自动聚焦" : "自动聚焦", async () => {
            try {
              await liveStates.focusCommand("cancel-light-camera", statusSource.id);
              delete statusSource[value63];
              mountRuntime();
              fn12();
            } catch (message2) {
              pickerGeneration.textContent = message2.message;
            }
          });
          disabled8.disabled = !statusSource[value63];
          disabled8.className = "i3d-focus-reset";
          append6.append(disabled8);
        }
        if (unsubscribeAccess) {
          for (const disabled3 of append6.querySelectorAll("button, input")) {
            disabled3.disabled = true;
          }
        }
      } else {
        focusQueue.append(value128("p", "i3d-note", createButton ? length5.length ? "点击“添加扫地机”，选择模型后绑定扫地机设备。" : "当前楼层暂无扫地机模型，请先在户型绘制中添加扫地机器人后更新户型。" : header ? length5.length ? "点击“添加设备”，选择电视模型并绑定媒体播放器实体。" : "当前楼层暂无电视模型，请先在户型绘制中添加电视后更新户型。" : sidebar ? length5.length ? "点击“添加设备”，选择设备类型和模型，再绑定开启实体。" : "当前楼层暂无 NAS 模型，请先在户型绘制中添加模型后更新户型。" : viewPane ? length5.length ? "点击“添加窗帘”，选择需要控制的窗帘模型。" : "当前楼层暂无窗帘模型，请在户型绘制中添加普通窗帘后更新户型。" : body ? length5.length ? "点击“添加空调”，选择需要控制的空调模型。" : "当前楼层暂无空调模型，请在户型绘制中添加壁挂空调、柜机或出风口后更新户型。" : length5.length ? "点击“添加灯光”，选择需要控制的灯组。" : "当前楼层暂无灯组，请在户型绘制中添加灯组后更新户型。"));
      }
    }
    focusQueue.append(pickerGeneration);
    disabled17.disabled = value133 || !capabilityCache || saveButton || unsubscribeAccess;
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
  function fn13() {
    liveStates = mountInteraction3d(value129, {
      component: {
        ...component,
        properties: value144()
      },
      context: {
        document: doc,
        states
      },
      editing: true,
      editingVacuumId: createEl ? arg77 : "",
      editingModule: dialog ? arg75 : viewPane ? "cover" : body ? "climate" : "light",
      onStates(arg37) {
        if (!refreshCapabilities) {
          value135 = arg37;
          if (!aspectBox) {
            for (const value of value138()) {
              fn4(value);
            }
          }
          value136();
        }
      },
      onReady(arg38) {
        value130++;
        saveButton = false;
        unsubscribeAccess = false;
        mode = null;
        draftRevision = arg38;
        if (!draftRevision.floors.some(id18 => id18.id === syncPreviewSize)) {
          syncPreviewSize = draftRevision.floors[0]?.id || "";
        }
        fn12();
        mountRuntime();
        if (arg76) {
          arg76 = false;
          queueMicrotask(fn9);
        }
      },
      onEdit(action) {
        if (!refreshCapabilities && !!capabilityCache && !close5 && !close7) {
          if (action.action === "light-region-overrides") {
            effectRangeOpen.lightRegionOverrides = structuredClone(action.overrides || {});
            value134++;
            if (!value133) {
              textContent8.textContent = "";
            }
          }
          if (createEl) {
            const id19 = value138().find(id4 => "vacuum-room:" + arg77 + ":" + id4.id === action.id);
            if (id19) {
              saving = id19.id;
              if (action.action === "position") {
                id19.x = action.x;
                id19.y = action.y;
                mountRuntime();
              }
              fn12();
              if (action.action === "select") {
                mountRuntime();
              }
            }
            return;
          }
          if (createButton && action.id?.startsWith("vacuum-room:")) {
            const id20 = value138().find(shortcuts => (shortcuts.shortcuts || []).some(id2 => "vacuum-room:" + shortcuts.id + ":" + id2.id === action.id));
            const x = id20?.shortcuts.find(id5 => "vacuum-room:" + id20.id + ":" + id5.id === action.id);
            if (x) {
              saving = id20.id;
              if (action.action === "position") {
                x.x = action.x;
                x.y = action.y;
                mountRuntime();
              }
              if (action.action === "select") {
                fn12();
              }
            }
            return;
          }
          if (action.action === "focus-exited") {
            saveButton = false;
            mode = null;
            fn12();
          }
          if (action.action === "select") {
            saving = action.id;
            fn12();
            mountRuntime();
          }
          if (action.action === "position") {
            const x2 = value138().find(id6 => id6.id === action.id);
            if (x2) {
              x2.x = action.x;
              x2.y = action.y;
              fn12();
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
  const value145 = subscribeInteraction3dAccess(status => {
    if (!refreshCapabilities) {
      capabilityCache = status.allowed;
      disabled17.disabled = value133 || !capabilityCache || saveButton || unsubscribeAccess;
      focusQueue.inert = !capabilityCache;
      setAttribute12.hidden = capabilityCache || !!liveStates && status.status !== "denied";
      setAttribute12.textContent = status.status === "denied" || status.status === "unavailable" ? status.message : "正在准备户型…";
      if (capabilityCache) {
        if (liveStates) {
          liveStates.setAuthorized(true);
        } else {
          fn13();
        }
      } else {
        fn8();
        renderSidebar();
        closeEditor?.close();
        value132++;
        close6?.close();
        value130++;
        saveButton = false;
        unsubscribeAccess = false;
        mode = null;
        fn12();
        liveStates?.setAuthorized(false);
        if (status.status === "denied") {
          liveStates?.();
          liveStates = null;
          fn12();
        }
      }
    }
  });
  fn12();
  setAttribute11.showModal();
  document.dispatchEvent(new Event("hb-i3d-preview-scope"));
  value142();
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
  const value146 = (arg59, element6 = "") => {
    const textContent5 = document.createElement(arg59);
    textContent5.textContent = element6;
    return textContent5;
  };
  const getBoundingClientRect = value146("dialog");
  getBoundingClientRect.className = "i3d-editor i3d-appearance-editor";
  getBoundingClientRect.setAttribute("aria-label", "户型进阶设置");
  const addEventListener3 = value146("header");
  const append50 = value146("div");
  append50.className = "i3d-appearance-body";
  const className18 = value146("p");
  className18.className = "i3d-error";
  className18.setAttribute("role", "status");
  let id41;
  const value147 = (arg60, arg61) => {
    const currentRect = getBoundingClientRect.getBoundingClientRect();
    Object.assign(getBoundingClientRect.style, {
      margin: "0",
      right: "auto",
      bottom: "auto",
      left: Math.max(8, Math.min(arg60, window.innerWidth - currentRect.width - 8)) + "px",
      top: Math.max(8, Math.min(arg61, window.innerHeight - currentRect.height - 8)) + "px"
    });
  };
  const value148 = () => {
    const left = getBoundingClientRect.getBoundingClientRect();
    value147(left.left, left.top);
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
      value147(id41.left + moveEvent.clientX - id41.x, id41.top + moveEvent.clientY - id41.y);
    }
  });
  for (const endEventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    addEventListener3.addEventListener(endEventName, () => {
      id41 = null;
    });
  }
  window.addEventListener("resize", value148);
  const value149 = () => editorView.update({
    ...appearanceProps,
    baseLighting: floorBrightness
  });
  const value150 = (arg62 = false) => {
    if (!appearanceStylesheet) {
      appearanceStylesheet = true;
      if (!arg62) {
        editorView.update(appearanceProps);
      }
      window.removeEventListener("resize", value148);
      getBoundingClientRect.close();
      getBoundingClientRect.remove();
      rel2.remove();
    }
  };
  const disabled18 = value146("button", "完成");
  disabled18.type = "button";
  disabled18.addEventListener("click", async () => {
    disabled18.disabled = true;
    try {
      await requestInteraction3dAccess();
      await appearanceOnSave(floorBrightness);
      value150(true);
    } catch (doneError) {
      className18.textContent = doneError.message;
      disabled18.disabled = false;
    }
  });
  const type4 = value146("button", "取消");
  type4.type = "button";
  type4.addEventListener("click", () => value150());
  const className19 = value146("span", "拖动");
  className19.className = "i3d-drag-hint";
  addEventListener3.append(value146("strong", "户型进阶设置"), className19, disabled18, type4);
  const map = new Map();
  const helpNote = [];
  const APPEARANCE_LIGHTING_SECTIONS = baseLighting ? [["整体画面", APPEARANCE_LIGHTING_SECTIONS[0][1].filter(([, arg39]) => arg39 === "exposure")]] : APPEARANCE_LIGHTING_SECTIONS;
  for (const [sectionTitle, sectionFields] of APPEARANCE_LIGHTING_SECTIONS) {
    const sectionEl = value146("section");
    const fieldsGrid = value146("div");
    fieldsGrid.className = "i3d-appearance-grid";
    sectionEl.append(value146("h4", sectionTitle), fieldsGrid);
    for (const [fieldTitle, fieldKey, fieldMin, fieldMax, fieldStep] of sectionFields) {
      const fieldLabelEl = value146("label");
      const fieldInput = value146("input");
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
          value149();
        }
      });
      fieldLabelEl.append(value146("span", fieldTitle), fieldInput);
      fieldsGrid.append(fieldLabelEl);
      map.set(fieldKey, fieldInput);
    }
    append50.append(sectionEl);
  }
  if (baseLighting) {
    const append21 = value146("section");
    const append22 = value146("label");
    const className10 = value146("div");
    append21.append(value146("h4", "地面颜色"));
    className10.className = "i3d-floor-brightness";
    const value107 = value146("input");
    const setAttribute8 = value146("input");
    Object.assign(value107, {
      type: "range",
      min: "50",
      max: "150",
      step: "1",
      value: String(floorBrightness.floorBrightness)
    });
    Object.assign(setAttribute8, {
      type: "number",
      name: "i3d-base-light-floorBrightness",
      min: "50",
      max: "150",
      step: "1",
      value: value107.value
    });
    value107.setAttribute("aria-label", "地面颜色深浅");
    setAttribute8.setAttribute("aria-label", "地面亮度百分比");
    const value108 = valueAsNumber => {
      if (Number.isFinite(valueAsNumber.valueAsNumber)) {
        floorBrightness.floorBrightness = Math.max(50, Math.min(150, valueAsNumber.valueAsNumber));
        value107.value = setAttribute8.value = String(floorBrightness.floorBrightness);
        value149();
      }
    };
    value107.addEventListener("input", () => value108(value107));
    setAttribute8.addEventListener("input", () => value108(setAttribute8));
    className10.append(value146("span", "深"), value107, value146("span", "浅"), setAttribute8, value146("span", "%"));
    append22.append(className10);
    append21.append(append22, value146("p", "100% 为原色，仅调整户型地面，保留纹理与阴影。"));
    append50.insertBefore(append21, append50.children[1] || null);
    map.set("floorBrightness", setAttribute8);
    helpNote.push(() => {
      value107.value = "100";
    });
  }
  const resetLightingBtn = value146("button", "恢复默认");
  resetLightingBtn.type = "button";
  resetLightingBtn.addEventListener("click", () => {
    for (const [value74, lightingInput] of map) {
      floorBrightness[value74] = value74 === "floorBrightness" ? 100 : editorView.metadata.defaults[value74];
      lightingInput.value = String(floorBrightness[value74]);
    }
    helpNote.forEach(arg40 => arg40());
    value149();
  });
  const helpNote2 = value146("p", baseLighting ? "曝光影响整体画面，地面颜色深浅独立调整。完成后点击页面上方保存。" : "调整当前户型的整体光照与阴影。完成后点击页面上方保存，仅保存至当前 3D 控件。");
  helpNote2.className = "i3d-note";
  append50.append(resetLightingBtn, helpNote2, className18);
  getBoundingClientRect.append(addEventListener3, append50);
  document.body.append(getBoundingClientRect);
  getBoundingClientRect.addEventListener("cancel", appearanceCancelEvent => {
    appearanceCancelEvent.preventDefault();
    value150();
  });
  getBoundingClientRect.showModal();
}
