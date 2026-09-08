import { mountInteraction3d } from "./runtime.js?v=20260907-layout-v2-20260905-runtime-v1-20260906-i3d-preload-v1-20260906-i3d-marker-v1-20260907-capabilities-v1";
import { lightState } from "./light-state.js?v=20260906-i3d-render-recovery-v1";
import { randomUuid } from "/bridge-static/utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
import { interaction3dPreviewSize } from "/bridge-static/modules/interaction3d/preview-layout.js?v=20260906-i3d-preview-layout-v1";
import {
  requestInteraction3dAccess,
  getInteraction3dEditorView,
  subscribeInteraction3dAccess,
} from "/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6";
const APPEARANCE_LIGHTING_SECTIONS = [
  [
    "整体",
    [
      ["曝光", "exposure", 0.5, 2, 0.05],
      ["半球光", "hemisphereIntensity", 0, 3, 0.05],
      ["环境光", "ambientIntensity", 0, 2, 0.05],
    ],
  ],
  [
    "主光与阴影",
    [
      ["强度", "mainIntensity", 0, 5, 0.05],
      ["水平角", "mainAzimuth", -180, 180, 5],
      ["高度角", "mainElevation", 5, 89, 5],
      ["阴影浓度", "mainShadowIntensity", 0, 1, 0.05],
    ],
  ],
  [
    "侧面补光",
    [
      ["强度", "fillIntensity", 0, 3, 0.05],
      ["水平角", "fillAzimuth", -180, 180, 5],
      ["高度角", "fillElevation", 0, 89, 5],
    ],
  ],
  [
    "顶部补光",
    [
      ["强度", "topIntensity", 0, 3, 0.05],
      ["水平角", "topAzimuth", -180, 180, 5],
      ["高度角", "topElevation", 0, 89, 5],
    ],
  ],
];
export async function openInteraction3dEditor({
  component: component,
  document: doc,
  entities: entities = [],
  states: states,
  pickers: pickers,
  onSave: onSave,
}) {
  await requestInteraction3dAccess();
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href =
    "/api/v1/modules/interaction3d/runtime.css?v=20260907-hidden-switch-v2";
  document.head.append(stylesheet);
  const createEl = (tagName, className, text) => {
    const el = document.createElement(tagName);
    el.className = className || "";
    if (text) {
      el.textContent = text;
    }
    return el;
  };
  const createButton = (label, onClick) => {
    const button = createEl("button", "", label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const dialog = createEl("dialog", "i3d-editor");
  dialog.setAttribute("aria-label", "3D 灯光配置");
  const header = createEl("header");
  const body = createEl("div", "i3d-editor-body");
  const viewPane = createEl("div", "i3d-editor-view");
  const sidebar = createEl("aside");
  const aspectBox = createEl("div", "i3d-editor-aspect");
  const stage = createEl("div", "i3d-editor-stage");
  const statusNote = createEl("p", "i3d-editor-status");
  statusNote.setAttribute("role", "status");
  aspectBox.append(stage);
  viewPane.append(aspectBox, statusNote);
  const errorNote = createEl("p", "i3d-error");
  errorNote.setAttribute("role", "status");
  let draft = structuredClone(component.properties || {});
  let selectedLightId = "";
  let sceneMeta = null;
  let runtime = null;
  let closed = false;
  let accessAllowed = true;
  let focusEditing = false;
  let focusBusy = false;
  let draftFocusCamera = null;
  let readyGeneration = 0;
  let focusQueue = Promise.resolve();
  let addingLight = false;
  let pendingGroupKey = "";
  let activePicker = null;
  let pickerGeneration = 0;
  let effectRangeOpen = false;
  let saving = false;
  let draftRevision = 0;
  let liveStates = null;
  let refreshCapabilities = () => {};
  const capabilityCache = new Map();
  draft.lights = (draft.lights || [])
    .filter((light) => light.visible !== false)
    .map((rawLight) => {
      const buttonSize = Number.isFinite(rawLight.size) && rawLight.size > 0 ? rawLight.size : 44;
      return {
        ...rawLight,
        size: buttonSize,
        visible: true,
        icon: rawLight.icon || "mdi:lightbulb-outline",
        fadeDuration: rawLight.fadeDuration ?? 0.3,
        clickAction: ["turn-on-focus", "turn-on", "turn-on-panel"].includes(
          rawLight.clickAction,
        )
          ? rawLight.clickAction
          : "focus",
        iconSize:
          Number.isFinite(rawLight.iconSize) && rawLight.iconSize > 0
            ? rawLight.iconSize
            : Math.min(buttonSize, Math.max(4, buttonSize - 18)),
      };
    });
  const syncPreviewSize = () => {
    const previewSize = interaction3dPreviewSize(
      component,
      doc,
      viewPane.clientWidth,
      viewPane.clientHeight,
    );
    Object.assign(aspectBox.style, {
      width: previewSize.width + "px",
      height: previewSize.height + "px",
    });
  };
  const resizeObserver = new ResizeObserver(syncPreviewSize);
  resizeObserver.observe(viewPane);
  const closeEditor = () => {
    if (!closed) {
      closed = true;
      resizeObserver.disconnect();
      pickerGeneration++;
      activePicker?.close();
      runtime?.();
      unsubscribeAccess();
      dialog.remove();
      stylesheet.remove();
    }
  };
  const saveStatus = createEl("span", "i3d-save-status");
  saveStatus.setAttribute("role", "status");
  const saveButton = createButton("保存配置", async () => {
    if (saving || closed || !accessAllowed || focusEditing || focusBusy) {
      return;
    }
    const savedDraft = structuredClone(draft);
    const savedRevision = draftRevision;
    saving = true;
    saveStatus.textContent = "保存中…";
    saveButton.disabled = true;
    errorNote.textContent = "";
    try {
      await requestInteraction3dAccess();
      if (closed) {
        return;
      }
      await onSave(savedDraft);
      if (!closed) {
        saveStatus.textContent = savedRevision === draftRevision ? "已保存" : "已保存，另有新修改";
      }
    } catch (saveError) {
      if (!closed) {
        errorNote.textContent = saveError.message;
        saveStatus.textContent = "";
      }
    } finally {
      saving = false;
      if (!closed) {
        saveButton.disabled = !accessAllowed || focusEditing || focusBusy;
      }
    }
  });
  saveButton.className = "primary";
  header.append(createEl("strong", "", "3D 灯光配置"), saveStatus, saveButton, createButton("退出", closeEditor));
  body.append(viewPane, sidebar);
  dialog.append(header, body);
  document.body.append(dialog);
  dialog.addEventListener("cancel", (cancelEvent) => {
    cancelEvent.preventDefault();
    closeEditor();
  });
  function markDirty() {
    draftRevision++;
    if (!saving) {
      saveStatus.textContent = "";
    }
    runtime?.update(draft, selectedLightId);
  }
  function appendLabeled(parent, fieldLabel, control) {
    control.name = "i3d-light-" + (selectedLightId || "scene") + "-" + fieldLabel;
    const fieldWrap = createEl("label");
    fieldWrap.append(createEl("span", "", fieldLabel), control);
    parent.append(fieldWrap);
    return control;
  }
  function appendSelect(selectParent, selectLabel, options, currentValue, onChange) {
    const select = createEl("select");
    for (const [optValue, optLabel] of options) {
      const option = createEl("option", "", optLabel);
      option.value = optValue;
      select.append(option);
    }
    select.value = currentValue;
    select.addEventListener("change", () => onChange(select.value));
    return appendLabeled(selectParent, selectLabel, select);
  }
  function appendNumber(numParent, numLabel, numValue, numMin, numMax, numStep, onNumber, inputType = "number") {
    const numInput = createEl("input");
    Object.assign(numInput, {
      type: inputType,
      min: String(numMin),
      max: String(numMax),
      step: String(numStep),
      value: String(numValue),
    });
    numInput.addEventListener(inputType === "range" ? "input" : "change", () => {
      const parsed = numInput.value.trim() === "" ? NaN : Number(numInput.value);
      if (Number.isFinite(parsed)) {
        onNumber(Math.max(numMin, Math.min(numMax, parsed)));
      }
    });
    return appendLabeled(numParent, numLabel, numInput);
  }
  function appendPositiveNumber(posParent, posLabel, getValue, onPositive) {
    const posInput = createEl("input");
    Object.assign(posInput, {
      type: "number",
      step: "any",
      value: String(getValue()),
    });
    posInput.addEventListener("change", () => {
      const posParsed = posInput.value.trim() === "" ? NaN : Number(posInput.value);
      if (Number.isFinite(posParsed) && posParsed > 0) {
        posInput.value = String(posParsed);
        onPositive(posParsed);
      } else {
        posInput.value = String(getValue());
      }
    });
    return appendLabeled(posParent, posLabel, posInput);
  }
  function resolveLightCapability(lightConfig) {
    const entityId = lightConfig.entityId || "";
    const entityState = liveStates === null ? states?.get?.(entityId) : liveStates[entityId];
    const cachedCapability = capabilityCache.get(entityId);
    const attributes = (entityState?.newState || entityState)?.attributes || {};
    const supportedFeatures = attributes.supported_features;
    const hasFeatures =
      supportedFeatures != null &&
      supportedFeatures !== "" &&
      typeof supportedFeatures != "boolean" &&
      Number.isFinite(Number(supportedFeatures));
    const capability = lightState(entityId, entityState, cachedCapability);
    capability.known =
      entityId.startsWith("switch.") ||
      cachedCapability?.known === true ||
      (Array.isArray(attributes.supported_color_modes) &&
        attributes.supported_color_modes.some((mode) => mode !== "unknown")) ||
      hasFeatures ||
      capability.brightnessSupported ||
      capability.temperatureSupported;
    if (entityId && capability.known) {
      capabilityCache.set(entityId, capability);
    }
    return capability;
  }
  function renderEffectFields(container, lightItem, capabilityInfo) {
    container.replaceChildren();
    if (lightItem.entityId && !capabilityInfo.known) {
      const detectingNote = createEl("p", "i3d-note", "正在识别灯具能力…");
      detectingNote.setAttribute("role", "status");
      container.append(detectingNote);
    }
    if (
      lightItem.entityId &&
      capabilityInfo.known &&
      (!capabilityInfo.brightnessSupported || !capabilityInfo.temperatureSupported)
    ) {
      const defaultsSection = createEl("section", "i3d-focus-settings");
      defaultsSection.append(createEl("h4", "", "默认效果"));
      const defaultsGrid = createEl("div", "i3d-coordinate-grid");
      defaultsSection.append(defaultsGrid);
      for (const [defaultLabel, defaultKey, alreadySupported, defaultMin, defaultMax, defaultStep] of [
        ["默认亮度（%）", "brightness", capabilityInfo.brightnessSupported, 0, 100, 1],
        [
          "默认色温（K）",
          "kelvin",
          capabilityInfo.temperatureSupported,
          1000,
          20000,
          100,
        ],
      ]) {
        if (alreadySupported) {
          continue;
        }
        const defaultInput = createEl("input");
        Object.assign(defaultInput, {
          type: "number",
          min: String(defaultMin),
          max: String(defaultMax),
          step: String(defaultStep),
          value: Number.isFinite(lightItem.effectDefaults?.[defaultKey])
            ? String(lightItem.effectDefaults[defaultKey])
            : "",
          placeholder: "跟随模型",
        });
        defaultInput.addEventListener("change", () => {
          const rawText = defaultInput.value.trim();
          const rawNumber = Number(rawText);
          const nextDefaults = {
            ...lightItem.effectDefaults,
          };
          if (rawText) {
            if (Number.isFinite(rawNumber)) {
              nextDefaults[defaultKey] = Math.max(defaultMin, Math.min(defaultMax, rawNumber));
            }
          } else {
            delete nextDefaults[defaultKey];
          }
          defaultInput.value = Number.isFinite(nextDefaults[defaultKey]) ? String(nextDefaults[defaultKey]) : "";
          if (Object.keys(nextDefaults).length) {
            lightItem.effectDefaults = nextDefaults;
          } else {
            delete lightItem.effectDefaults;
          }
          markDirty();
        });
        appendLabeled(defaultsGrid, defaultLabel, defaultInput);
      }
      const defaultActions = createEl("div", "i3d-focus-actions");
      defaultsSection.append(defaultActions);
      defaultActions.append(
        createButton("预览默认效果", async () => {
          try {
            await runtime.focusCommand("preview-light-effect", lightItem.id, "defaults");
          } catch (previewDefaultsError) {
            errorNote.textContent = previewDefaultsError.message;
          }
        }),
        createButton("跟随模型", () => {
          delete lightItem.effectDefaults;
          markDirty();
          renderSidebar();
        }),
      );
      container.append(defaultsSection);
    }
    const effectDetails = createEl("details", "i3d-effect-settings");
    effectDetails.open = effectRangeOpen;
    effectDetails.addEventListener("toggle", () => {
      effectRangeOpen = effectDetails.open;
    });
    effectDetails.append(createEl("summary", "", "效果范围"));
    const effectRange = {
      brightnessMin: 1,
      brightnessMax: 100,
      temperatureMin: capabilityInfo.minimum,
      temperatureMax: capabilityInfo.maximum,
      ...lightItem.effectRange,
    };
    const effectGrid = createEl("div", "i3d-effect-grid");
    effectDetails.append(effectGrid);
    for (const [rangeLabel, rangeKey, peerKey, rangeMin, rangeMax, rangeStep] of [
      ["最暗亮度（%）", "brightnessMin", "brightnessMax", 0, 100, 1],
      ["最亮亮度（%）", "brightnessMax", "brightnessMin", 0, 100, 1],
      ["最低色温（K）", "temperatureMin", "temperatureMax", 1000, 20000, 100],
      ["最高色温（K）", "temperatureMax", "temperatureMin", 1000, 20000, 100],
    ]) {
      const rangeOption = createEl("div", "i3d-effect-option");
      effectGrid.append(rangeOption);
      const rangeInput = appendNumber(rangeOption, rangeLabel, effectRange[rangeKey], rangeMin, rangeMax, rangeStep, (clamped) => {
        effectRange[rangeKey] = rangeKey.endsWith("Min")
          ? Math.min(clamped, effectRange[peerKey])
          : Math.max(clamped, effectRange[peerKey]);
        rangeInput.value = String(effectRange[rangeKey]);
        lightItem.effectRange = {
          ...effectRange,
        };
        markDirty();
      });
      const previewRangeBtn = createButton("预览", async () => {
        try {
          await runtime.focusCommand("preview-light-effect", lightItem.id, rangeKey);
        } catch (previewRangeError) {
          errorNote.textContent = previewRangeError.message;
        }
      });
      previewRangeBtn.disabled = !lightItem.entityId;
      if (!lightItem.entityId) {
        previewRangeBtn.title = "绑定实体后预览效果";
      }
      previewRangeBtn.setAttribute("aria-label", "预览" + rangeLabel);
      rangeOption.append(previewRangeBtn);
    }
    effectDetails.append(
      createButton("恢复默认效果", () => {
        delete lightItem.effectRange;
        markDirty();
        renderSidebar();
      }),
    );
    container.append(effectDetails);
  }
  function renderSidebar() {
    refreshCapabilities = () => {};
    sidebar.replaceChildren();
    if (sceneMeta) {
      appendSelect(
        sidebar,
        "展示楼层",
        [
          ...sceneMeta.floors.map((floor) => [floor.id, floor.name]),
          ...(sceneMeta.floors.length > 1 ? [["all", "全楼"]] : []),
        ],
        draft.floorSelection,
        (floorId) => {
          draft.floorSelection = floorId;
          delete draft.camera;
          markDirty();
          renderSidebar();
        },
      );
      const lightHeading = createEl("div", "i3d-light-heading");
      const availableGroups = sceneMeta.floors
        .filter(
          (floorItem) =>
            draft.floorSelection === "all" || floorItem.id === draft.floorSelection,
        )
        .flatMap((floorEntry) =>
          floorEntry.groups
            .filter(
              (group) =>
                !draft.lights.some(
                  (existingLight) =>
                    existingLight.floorId === floorEntry.id && existingLight.groupId === group.id,
                ),
            )
            .map((groupEntry) => ({
              floor: floorEntry,
              group: groupEntry,
              key: floorEntry.id + "/" + groupEntry.id,
            })),
        );
      const addLightToggle = createButton(addingLight ? "收起" : "添加灯光", () => {
        addingLight = !addingLight;
        renderSidebar();
      });
      addLightToggle.disabled = !availableGroups.length || draft.lights.length >= 128;
      lightHeading.append(createEl("h4", "", "灯光按钮"), addLightToggle);
      sidebar.append(lightHeading);
      if (addingLight && availableGroups.length) {
        const addLightPanel = createEl("div", "i3d-light-add");
        if (!availableGroups.some((groupOption) => groupOption.key === pendingGroupKey)) {
          pendingGroupKey = availableGroups[0].key;
        }
        appendSelect(
          addLightPanel,
          "关联灯组",
          availableGroups.map((groupChoice) => [
            groupChoice.key,
            "" +
              (draft.floorSelection === "all" ? groupChoice.floor.name + " · " : "") +
              groupChoice.group.name,
          ]),
          pendingGroupKey,
          (selectedKey) => {
            pendingGroupKey = selectedKey;
          },
        );
        addLightPanel.append(
          createButton("确定添加", () => {
            const chosen = availableGroups.find((match) => match.key === pendingGroupKey);
            if (
              !chosen ||
              draft.lights.some(
                (duplicate) =>
                  duplicate.floorId === chosen.floor.id &&
                  duplicate.groupId === chosen.group.id,
              )
            ) {
              return;
            }
            const newLight = {
              id: randomUuid(),
              floorId: chosen.floor.id,
              groupId: chosen.group.id,
              entityId: "",
              label: chosen.group.name,
              x: chosen.group.x,
              y: chosen.group.y,
              height: chosen.group.height ?? chosen.floor.wallHeight ?? 2.8,
              size: 44,
              iconSize: 26,
              visible: true,
              icon: "mdi:lightbulb-outline",
              fadeDuration: 0.3,
              clickAction: "focus",
            };
            draft.lights.push(newLight);
            selectedLightId = newLight.id;
            addingLight = false;
            markDirty();
            renderSidebar();
          }),
        );
        sidebar.append(addLightPanel);
      }
      const visibleLights = draft.lights.filter(
        (lightEntry) =>
          draft.floorSelection === "all" || lightEntry.floorId === draft.floorSelection,
      );
      if (!visibleLights.some((selected) => selected.id === selectedLightId)) {
        selectedLightId = visibleLights[0]?.id || "";
      }
      if (visibleLights.length) {
        appendSelect(
          sidebar,
          "当前按钮",
          visibleLights.map((lightOption) => [lightOption.id, lightOption.label]),
          selectedLightId,
          (nextLightId) => {
            pickerGeneration++;
            activePicker?.close();
            selectedLightId = nextLightId;
            markDirty();
            renderSidebar();
          },
        );
      }
      const currentLight = draft.lights.find((lightMatch) => lightMatch.id === selectedLightId);
      if (currentLight) {
        const removeBtn = createButton("删除此灯光按钮", () => {
          pickerGeneration++;
          activePicker?.close();
          draft.lights = draft.lights.filter((remaining) => remaining.id !== currentLight.id);
          selectedLightId = "";
          markDirty();
          renderSidebar();
        });
        removeBtn.className = "i3d-remove-light";
        sidebar.append(removeBtn);
        const nameInput = createEl("input");
        nameInput.value = currentLight.label;
        nameInput.maxLength = 128;
        nameInput.addEventListener("change", () => {
          currentLight.label = nameInput.value.trim() || "灯光";
          markDirty();
        });
        appendLabeled(sidebar, "名称", nameInput);
        const openPicker = async (pickerKind, trigger) => {
          const pickerToken = ++pickerGeneration;
          errorNote.textContent = "";
          try {
            if (!pickers?.[pickerKind]) {
              throw new Error("选择器尚未准备好，请保存后刷新页面。");
            }
            const pickerHandle = await pickers[pickerKind]({
              trigger: trigger,
              current: pickerKind === "icon" ? currentLight.icon : currentLight.entityId,
              onSelect(pickedValue) {
                if (
                  !closed &&
                  !!accessAllowed &&
                  pickerToken === pickerGeneration &&
                  !!draft.lights.includes(currentLight)
                ) {
                  if (pickerKind === "icon") {
                    currentLight.icon = pickedValue;
                  } else {
                    currentLight.entityId = pickedValue;
                  }
                  markDirty();
                  renderSidebar();
                }
              },
            });
            if (closed || !accessAllowed || pickerToken !== pickerGeneration) {
              pickerHandle?.close();
            } else {
              activePicker = pickerHandle;
            }
          } catch (pickerError) {
            if (!closed && pickerToken === pickerGeneration) {
              errorNote.textContent = pickerError.message;
            }
          }
        };
        const boundEntity = entities.find((entityMatch) => entityMatch.entityId === currentLight.entityId);
        const entityButton = createButton("", () => void openPicker("entity", entityButton));
        entityButton.className = "i3d-picker-button";
        entityButton.title = currentLight.entityId || "选择灯或开关";
        entityButton.append(
          createEl("span", "", boundEntity?.name || currentLight.entityId || "选择灯或开关"),
        );
        appendLabeled(sidebar, "绑定实体", entityButton);
        appendSelect(
          sidebar,
          "点击灯光",
          [
            ["focus", "仅聚焦"],
            ["turn-on-focus", "聚焦并开灯"],
            ["turn-on", "仅开灯"],
            ["turn-on-panel", "开灯并弹窗"],
          ],
          currentLight.clickAction,
          (clickAction) => {
            currentLight.clickAction = [
              "turn-on-focus",
              "turn-on",
              "turn-on-panel",
            ].includes(clickAction)
              ? clickAction
              : "focus";
            markDirty();
          },
        );
        const hiddenClickable = createEl("input");
        Object.assign(hiddenClickable, {
          type: "checkbox",
          checked: currentLight.hiddenClickable === true,
        });
        hiddenClickable.addEventListener("change", () => {
          currentLight.hiddenClickable = hiddenClickable.checked;
          markDirty();
        });
        appendLabeled(sidebar, "隐藏（可点击）", hiddenClickable).parentElement.className =
          "i3d-hidden-clickable-setting";
        const iconButton = createButton("", () => void openPicker("icon", iconButton));
        iconButton.className = "i3d-picker-button i3d-icon-picker-button";
        const iconEl = createEl("i");
        iconEl.setAttribute("aria-hidden", "true");
        const iconUrl =
          "/bridge-static/vendor/mdi/7.4.47/svg/" +
          currentLight.icon.replace(/^mdi:/, "") +
          ".svg";
        iconEl.style.maskImage = 'url("' + iconUrl + '")';
        iconEl.style.webkitMaskImage = 'url("' + iconUrl + '")';
        iconButton.append(iconEl, createEl("span", "", currentLight.icon));
        appendLabeled(sidebar, "图标", iconButton);
        const sizeGrid = createEl("div", "i3d-coordinate-grid i3d-size-grid");
        sidebar.append(sizeGrid);
        const resolveHitSize = () =>
          Number.isFinite(currentLight.hitSize) && currentLight.hitSize > 0
            ? currentLight.hitSize
            : Math.max(44, currentLight.size);
        appendPositiveNumber(
          sizeGrid,
          "按钮大小（px）",
          () => currentLight.size,
          (nextSize) => {
            currentLight.size = nextSize;
            hitSizeInput.value = String(resolveHitSize());
            markDirty();
          },
        );
        appendPositiveNumber(
          sizeGrid,
          "图标大小（px）",
          () => currentLight.iconSize,
          (nextIconSize) => {
            currentLight.iconSize = nextIconSize;
            markDirty();
          },
        );
        const hitSizeInput = appendPositiveNumber(sizeGrid, "触控范围（px）", resolveHitSize, (nextHitSize) => {
          currentLight.hitSize = nextHitSize;
          markDirty();
        });
        const positionGrid = createEl("div", "i3d-coordinate-grid");
        sidebar.append(positionGrid);
        for (const axis of ["x", "y"]) {
          appendNumber(
            positionGrid,
            "位置 " + axis.toUpperCase(),
            currentLight[axis],
            -1000000,
            1000000,
            1,
            (axisValue) => {
              currentLight[axis] = axisValue;
              markDirty();
            },
          );
        }
        appendNumber(positionGrid, "高度（米）", currentLight.height, 0, 20, 0.1, (heightValue) => {
          currentLight.height = heightValue;
          markDirty();
        });
        appendNumber(sidebar, "缓开缓灭（秒）", currentLight.fadeDuration, 0, 10, 0.1, (fadeValue) => {
          currentLight.fadeDuration = fadeValue;
          markDirty();
        });
        const capabilityHost = createEl("div");
        sidebar.append(capabilityHost);
        const capabilitySignature = (cap) =>
          JSON.stringify([
            cap.known,
            cap.brightnessSupported,
            cap.temperatureSupported,
            cap.minimum,
            cap.maximum,
          ]);
        const currentCapability = resolveLightCapability(currentLight);
        let lastSignature = capabilitySignature(currentCapability);
        refreshCapabilities = () => {
          if (
            closed ||
            !accessAllowed ||
            focusEditing ||
            focusBusy ||
            capabilityHost.contains?.(document.activeElement)
          ) {
            return;
          }
          const nextCapability = resolveLightCapability(currentLight);
          const nextSignature = capabilitySignature(nextCapability);
          if (nextSignature !== lastSignature) {
            lastSignature = nextSignature;
            renderEffectFields(capabilityHost, currentLight, nextCapability);
          }
        };
        capabilityHost.addEventListener("focusout", () => queueMicrotask(refreshCapabilities));
        renderEffectFields(capabilityHost, currentLight, currentCapability);
        const focusSection = createEl("section", "i3d-focus-settings");
        sidebar.append(focusSection);
        focusSection.append(createEl("h4", "", "聚焦视角"));
        const runFocusCommand = async (focusCommand, focusArg) => {
          const focusGen = readyGeneration;
          const isFocalLength = focusCommand === "focus-focal-length";
          const previousQueue = focusQueue;
          let releaseQueue;
          focusQueue = new Promise((resolveQueue) => {
            releaseQueue = resolveQueue;
          });
          if (!isFocalLength) {
            focusBusy = true;
            errorNote.textContent = "";
            renderSidebar();
          }
          try {
            await previousQueue;
            if (closed || focusGen !== readyGeneration) {
              return;
            }
            const focusResult = await runtime.focusCommand(focusCommand, currentLight.id, focusArg);
            if (closed || focusGen !== readyGeneration) {
              return;
            }
            if (focusCommand === "save-light-camera") {
              currentLight.focusCamera = focusResult.camera;
              focusEditing = false;
              draftFocusCamera = null;
              markDirty();
            } else if (focusCommand === "cancel-light-camera") {
              focusEditing = false;
              draftFocusCamera = null;
            } else if (focusCommand !== "preview-light-camera") {
              focusEditing = true;
              draftFocusCamera = focusResult.camera;
            }
          } catch (focusError) {
            if (!closed && focusGen === readyGeneration) {
              errorNote.textContent = focusError.message;
            }
          } finally {
            releaseQueue();
            if (!closed && focusGen === readyGeneration && !isFocalLength) {
              focusBusy = false;
              renderSidebar();
            }
          }
        };
        const focusActions = createEl("div", "i3d-focus-actions");
        focusSection.append(focusActions);
        if (focusEditing) {
          const saveFocusBtn = createButton(
            "保存此灯视角",
            () => void runFocusCommand("save-light-camera"),
          );
          saveFocusBtn.className = "primary";
          focusActions.append(
            saveFocusBtn,
            createButton("取消调整", () => void runFocusCommand("cancel-light-camera")),
          );
          const projectionGroup = createEl("div", "i3d-focus-actions");
          projectionGroup.setAttribute("role", "group");
          projectionGroup.setAttribute("aria-label", "聚焦投影");
          focusSection.append(projectionGroup);
          for (const [projValue, projLabel] of [
            ["orthographic", "正交"],
            ["perspective", "透视"],
          ]) {
            const projBtn = createButton(projLabel, () => void runFocusCommand("focus-projection", projValue));
            projBtn.setAttribute(
              "aria-pressed",
              String((draftFocusCamera?.mode || "orthographic") === projValue),
            );
            projectionGroup.append(projBtn);
          }
          const focalInput = appendNumber(
            focusSection,
            "焦段（mm）",
            Math.round(draftFocusCamera?.focalLength || 50),
            18,
            120,
            1,
            (focalLength) => void runFocusCommand("focus-focal-length", focalLength),
          );
          focalInput.disabled = draftFocusCamera?.mode !== "perspective";
        } else {
          focusActions.append(
            createButton(
              currentLight.focusCamera ? "调整视角" : "设置视角",
              () => void runFocusCommand("edit-light-camera"),
            ),
            createButton("预览聚焦", () => void runFocusCommand("preview-light-camera")),
          );
          const resetFocusBtn = createButton(
            currentLight.focusCamera ? "恢复自动聚焦" : "自动聚焦",
            async () => {
              try {
                await runtime.focusCommand("cancel-light-camera", currentLight.id);
                delete currentLight.focusCamera;
                markDirty();
                renderSidebar();
              } catch (resetFocusError) {
                errorNote.textContent = resetFocusError.message;
              }
            },
          );
          resetFocusBtn.disabled = !currentLight.focusCamera;
          resetFocusBtn.className = "i3d-focus-reset";
          focusSection.append(resetFocusBtn);
        }
        if (focusBusy) {
          for (const focusControl of focusSection.querySelectorAll("button, input")) {
            focusControl.disabled = true;
          }
        }
      } else {
        sidebar.append(
          createEl(
            "p",
            "i3d-note",
            availableGroups.length
              ? "点击“添加灯光”，选择需要控制的灯组。"
              : "当前楼层暂无灯组，请在户型绘制中添加灯组后更新户型。",
          ),
        );
      }
    }
    sidebar.append(errorNote);
    saveButton.disabled = saving || !accessAllowed || focusEditing || focusBusy;
    if (focusEditing || focusBusy) {
      for (const sidebarControl of sidebar.querySelectorAll("input, select, button")) {
        if (!sidebarControl.closest(".i3d-focus-settings")) {
          sidebarControl.disabled = true;
        }
      }
    }
  }
  function mountRuntime() {
    runtime = mountInteraction3d(stage, {
      component: {
        ...component,
        properties: draft,
      },
      context: {
        document: doc,
        states: states,
      },
      editing: true,
      onStates(incomingStates) {
        if (!closed) {
          liveStates = incomingStates;
          for (const stateLight of draft.lights) {
            resolveLightCapability(stateLight);
          }
          refreshCapabilities();
        }
      },
      onReady(meta) {
        readyGeneration++;
        focusEditing = false;
        focusBusy = false;
        draftFocusCamera = null;
        sceneMeta = meta;
        if (
          !sceneMeta.floors.some((floorCheck) => floorCheck.id === draft.floorSelection) &&
          draft.floorSelection !== "all"
        ) {
          draft.floorSelection = sceneMeta.floors[0].id;
        }
        renderSidebar();
        markDirty();
      },
      onEdit(editEvent) {
        if (editEvent.action === "focus-exited") {
          focusEditing = false;
          draftFocusCamera = null;
          renderSidebar();
        }
        if (editEvent.action === "select") {
          selectedLightId = editEvent.id;
          renderSidebar();
          markDirty();
        }
        if (editEvent.action === "position") {
          const movedLight = draft.lights.find((movedMatch) => movedMatch.id === editEvent.id);
          if (movedLight) {
            movedLight.x = editEvent.x;
            movedLight.y = editEvent.y;
            renderSidebar();
            markDirty();
          }
        }
        if (editEvent.action === "camera") {
          draft.camera = editEvent.camera;
          errorNote.textContent = "默认视角已记录，保存配置后生效。";
        }
      },
    });
  }
  const unsubscribeAccess = subscribeInteraction3dAccess((access) => {
    if (!closed) {
      accessAllowed = access.allowed;
      saveButton.disabled = saving || !accessAllowed || focusEditing || focusBusy;
      sidebar.inert = !accessAllowed;
      statusNote.hidden = accessAllowed || (!!runtime && access.status !== "denied");
      statusNote.textContent =
        access.status === "denied" || access.status === "unavailable"
          ? access.message
          : "正在准备户型…";
      if (accessAllowed) {
        if (runtime) {
          runtime.setAuthorized(true);
        } else {
          mountRuntime();
        }
      } else {
        pickerGeneration++;
        activePicker?.close();
        readyGeneration++;
        focusEditing = false;
        focusBusy = false;
        draftFocusCamera = null;
        renderSidebar();
        runtime?.setAuthorized(false);
        if (access.status === "denied") {
          runtime?.();
          runtime = null;
          renderSidebar();
        }
      }
    }
  });
  renderSidebar();
  dialog.showModal();
  syncPreviewSize();
}
export async function openInteraction3dAppearanceEditor({
  component: appearanceComponent,
  onSave: appearanceOnSave,
}) {
  await requestInteraction3dAccess();
  const editorView = getInteraction3dEditorView(appearanceComponent.id);
  if (!editorView?.metadata) {
    throw new Error("户型还在加载，请稍候再打开进阶设置。");
  }
  const appearanceProps = structuredClone(appearanceComponent.properties || {});
  let baseLighting = structuredClone(appearanceProps.baseLighting || editorView.metadata.baseLighting);
  let appearanceClosed = false;
  const appearanceStylesheet = document.createElement("link");
  appearanceStylesheet.rel = "stylesheet";
  appearanceStylesheet.href =
    "/api/v1/modules/interaction3d/runtime.css?v=20260907-hidden-switch-v2";
  document.head.append(appearanceStylesheet);
  const createTextEl = (textTag, textContent = "") => {
    const textEl = document.createElement(textTag);
    textEl.textContent = textContent;
    return textEl;
  };
  const appearanceDialog = createTextEl("dialog");
  appearanceDialog.className = "i3d-editor i3d-appearance-editor";
  appearanceDialog.setAttribute("aria-label", "户型进阶设置");
  const appearanceHeader = createTextEl("header");
  const appearanceBody = createTextEl("div");
  appearanceBody.className = "i3d-appearance-body";
  const appearanceError = createTextEl("p");
  appearanceError.className = "i3d-error";
  appearanceError.setAttribute("role", "status");
  let dragState;
  const placeDialog = (left, top) => {
    const dialogRect = appearanceDialog.getBoundingClientRect();
    Object.assign(appearanceDialog.style, {
      margin: "0",
      right: "auto",
      bottom: "auto",
      left:
        Math.max(8, Math.min(left, window.innerWidth - dialogRect.width - 8)) + "px",
      top:
        Math.max(8, Math.min(top, window.innerHeight - dialogRect.height - 8)) +
        "px",
    });
  };
  const clampPosition = () => {
    const currentRect = appearanceDialog.getBoundingClientRect();
    placeDialog(currentRect.left, currentRect.top);
  };
  appearanceHeader.title = "按住标题栏拖动";
  appearanceHeader.addEventListener("pointerdown", (pointerEvent) => {
    if (pointerEvent.button !== 0 || pointerEvent.target.closest("button")) {
      return;
    }
    pointerEvent.preventDefault();
    const startRect = appearanceDialog.getBoundingClientRect();
    dragState = {
      id: pointerEvent.pointerId,
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
      left: startRect.left,
      top: startRect.top,
    };
    appearanceHeader.setPointerCapture(pointerEvent.pointerId);
  });
  appearanceHeader.addEventListener("pointermove", (moveEvent) => {
    if (!!dragState && dragState.id === moveEvent.pointerId) {
      placeDialog(dragState.left + moveEvent.clientX - dragState.x, dragState.top + moveEvent.clientY - dragState.y);
    }
  });
  for (const endEventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    appearanceHeader.addEventListener(endEventName, () => {
      dragState = null;
    });
  }
  window.addEventListener("resize", clampPosition);
  const previewLighting = () =>
    editorView.update({
      ...appearanceProps,
      baseLighting: baseLighting,
    });
  const closeAppearance = (keepPreview = false) => {
    if (!appearanceClosed) {
      appearanceClosed = true;
      if (!keepPreview) {
        editorView.update(appearanceProps);
      }
      window.removeEventListener("resize", clampPosition);
      appearanceDialog.close();
      appearanceDialog.remove();
      appearanceStylesheet.remove();
    }
  };
  const doneButton = createTextEl("button", "完成");
  doneButton.type = "button";
  doneButton.addEventListener("click", async () => {
    doneButton.disabled = true;
    try {
      await requestInteraction3dAccess();
      await appearanceOnSave(baseLighting);
      closeAppearance(true);
    } catch (doneError) {
      appearanceError.textContent = doneError.message;
      doneButton.disabled = false;
    }
  });
  const cancelButton = createTextEl("button", "取消");
  cancelButton.type = "button";
  cancelButton.addEventListener("click", () => closeAppearance());
  const dragHint = createTextEl("span", "拖动");
  dragHint.className = "i3d-drag-hint";
  appearanceHeader.append(createTextEl("strong", "户型进阶设置"), dragHint, doneButton, cancelButton);
  const fieldInputs = new Map();
  for (const [sectionTitle, sectionFields] of APPEARANCE_LIGHTING_SECTIONS) {
    const sectionEl = createTextEl("section");
    const fieldsGrid = createTextEl("div");
    fieldsGrid.className = "i3d-appearance-grid";
    sectionEl.append(createTextEl("h4", sectionTitle), fieldsGrid);
    for (const [fieldTitle, fieldKey, fieldMin, fieldMax, fieldStep] of sectionFields) {
      const fieldLabelEl = createTextEl("label");
      const fieldInput = createTextEl("input");
      Object.assign(fieldInput, {
        name: "i3d-base-light-" + fieldKey,
        type: "number",
        min: String(fieldMin),
        max: String(fieldMax),
        step: String(fieldStep),
        value: String(baseLighting[fieldKey]),
      });
      fieldInput.addEventListener("input", () => {
        if (Number.isFinite(fieldInput.valueAsNumber)) {
          baseLighting[fieldKey] = Math.max(fieldMin, Math.min(fieldMax, fieldInput.valueAsNumber));
          previewLighting();
        }
      });
      fieldLabelEl.append(createTextEl("span", fieldTitle), fieldInput);
      fieldsGrid.append(fieldLabelEl);
      fieldInputs.set(fieldKey, fieldInput);
    }
    appearanceBody.append(sectionEl);
  }
  const resetLightingBtn = createTextEl("button", "恢复默认光照");
  resetLightingBtn.type = "button";
  resetLightingBtn.addEventListener("click", () => {
    baseLighting = structuredClone(editorView.metadata.defaults);
    for (const [lightingKey, lightingInput] of fieldInputs) {
      lightingInput.value = String(baseLighting[lightingKey]);
    }
    previewLighting();
  });
  const helpNote = createTextEl(
    "p",
    "调整当前户型的整体光照与阴影。完成后点击页面上方保存，仅保存至当前 3D 控件。",
  );
  helpNote.className = "i3d-note";
  appearanceBody.append(resetLightingBtn, helpNote, appearanceError);
  appearanceDialog.append(appearanceHeader, appearanceBody);
  document.body.append(appearanceDialog);
  appearanceDialog.addEventListener("cancel", (appearanceCancelEvent) => {
    appearanceCancelEvent.preventDefault();
    closeAppearance();
  });
  appearanceDialog.showModal();
}
