import { climateState, climateControl, climatePowerControl, climateModeLabel, climateSwingModeLabel } from "./climate-state.js?v=20260908-climate-v1";
const fanModeLabels = {
  auto: "自动",
  low: "低风",
  medium: "中风",
  high: "高风",
  middle: "中风",
  quiet: "静音",
  silent: "静音",
  turbo: "强劲",
  diffuse: "柔风",
  focus: "集中"
};
export function createClimatePanel({
  element: hostElement,
  onControl = async () => {}
} = {}) {
  const doc = hostElement?.ownerDocument || globalThis.document;
  const createEl = (tagName, className, text = "") => {
    const node = doc.createElement(tagName);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const setChildren = (parent, ...children) => {
    if (typeof parent.replaceChildren == "function") {
      parent.replaceChildren(...children);
    } else {
      for (const child of [...(parent.children || [])]) {
        child.remove?.();
      }
      parent.append(...children);
    }
  };
  const root = hostElement || createEl("section", "");
  root.classList.add("i3d-climate-panel");
  const heading = createEl("div", "i3d-climate-heading");
  const titleEl = createEl("h3", "", "空调");
  const subtitleEl = createEl("p", "", "尚未绑定设备");
  const powerButton = createEl("button", "i3d-climate-power");
  powerButton.type = "button";
  const headingText = createEl("div", "i3d-climate-heading-text");
  headingText.append(titleEl, subtitleEl);
  heading.append(headingText, powerButton);
  const thermostatSlot = createEl("div", "i3d-climate-thermostat-slot");
  const thermostat = createEl("section", "hb-climate-thermostat");
  const decreaseButton = createEl("button", "hb-climate-temperature-step", "−");
  const increaseButton = createEl("button", "hb-climate-temperature-step", "+");
  decreaseButton.type = increaseButton.type = "button";
  decreaseButton.setAttribute("aria-label", "降低设定温度");
  increaseButton.setAttribute("aria-label", "提高设定温度");
  const temperatureContent = createEl("div", "i3d-climate-temperature-content");
  const targetOutput = createEl("output", "i3d-climate-target");
  const currentTempLabel = createEl("span", "", "当前温度 --");
  targetOutput.setAttribute("aria-label", "设定温度");
  temperatureContent.append(createEl("small", "", "设定温度"), targetOutput, currentTempLabel);
  thermostat.append(decreaseButton, temperatureContent, increaseButton);
  thermostatSlot.append(thermostat);
  const rangeInfo = createEl("p", "i3d-climate-temperature-interval");
  const optionGroups = createEl("div", "i3d-climate-groups");
  const emptyStatus = createEl("p", "i3d-climate-empty");
  const errorStatus = createEl("p", "i3d-climate-error");
  emptyStatus.setAttribute("role", "status");
  errorStatus.setAttribute("role", "status");
  setChildren(root, heading, thermostatSlot, rangeInfo, optionGroups, emptyStatus, errorStatus);
  let editing = {};
  let climate = climateState("", null);
  let disposed = false;
  let controlling = false;
  let controlError = "";
  let requestGeneration = 0;
  let pendingTemperature = null;
  let pendingTemperatureTimer = null;
  let lastActiveMode = "";
  let optionsSignature = "";
  let choiceButtons = [];
  const canControl = () => !disposed && !editing.editing && !editing.busy && !controlling && climate.available;
  const clearPendingTemperature = () => {
    if (pendingTemperatureTimer !== null) {
      clearTimeout(pendingTemperatureTimer);
    }
    pendingTemperatureTimer = null;
    pendingTemperature = null;
  };
  function getDisplayTemperature() {
    return pendingTemperature ?? climate.temperature;
  }
  function renderTemperature(temperature = getDisplayTemperature()) {
    targetOutput.value = temperature === null ? "" : String(temperature);
    targetOutput.textContent = temperature === null ? "--" : temperature + "°C";
    currentTempLabel.textContent = climate.currentTemperature === null ? "当前温度 --" : "当前温度 " + climate.currentTemperature + "°C";
    decreaseButton.disabled = !canControl() || temperature === null || temperature <= climate.minimum;
    increaseButton.disabled = !canControl() || temperature === null || temperature >= climate.maximum;
  }
  async function runControl(service) {
    if (!canControl()) {
      return;
    }
    const generationAtStart = requestGeneration;
    controlling = true;
    controlError = "";
    if (service.service === "set_temperature") {
      clearPendingTemperature();
      pendingTemperature = service.data.temperature;
      pendingTemperatureTimer = setTimeout(() => {
        pendingTemperatureTimer = null;
        pendingTemperature = null;
        if (!disposed) {
          render();
        }
      }, 8000);
    }
    render();
    try {
      await onControl(service);
    } catch (error) {
      if (!disposed && generationAtStart === requestGeneration) {
        controlError = error?.message || "空调控制失败，请重试。";
        clearPendingTemperature();
      }
    } finally {
      if (!disposed && generationAtStart === requestGeneration) {
        controlling = false;
        render();
      }
    }
  }
  function applyControl(action, value) {
    if (canControl()) {
      try {
        return runControl(climateControl(climate, action, value));
      } catch (error) {
        controlError = error.message;
        render();
      }
    }
  }
  function power({
    toggle = true
  } = {}) {
    if (!canControl() || !toggle && climate.on) {
      return Promise.resolve(false);
    }
    try {
      return runControl(climatePowerControl(climate, toggle ? !climate.on : true, lastActiveMode));
    } catch (error) {
      controlError = error.message;
      render();
      return Promise.resolve(false);
    }
  }
  powerButton.addEventListener("click", () => power());
  decreaseButton.addEventListener("click", () => applyControl("set_temperature", (getDisplayTemperature() ?? climate.minimum) - climate.step));
  increaseButton.addEventListener("click", () => applyControl("set_temperature", (getDisplayTemperature() ?? climate.minimum) + climate.step));
  function rebuildOptionGroups() {
    setChildren(optionGroups);
    choiceButtons = [];
    for (const [groupLabel, choices, field, action, labels] of [["运行模式", climate.modes.filter(mode => mode !== "off"), "mode", "set_hvac_mode", Object.fromEntries(climate.modes.map(mode => [mode, climateModeLabel(mode)]))], ["风速", climate.fanModes, "fanMode", "set_fan_mode", fanModeLabels], ["摆风", climate.swingModes, "swingMode", "set_swing_mode", Object.fromEntries(climate.swingModes.map(mode => [mode, climateSwingModeLabel(mode)]))]]) {
      if (!choices.length) {
        continue;
      }
      const group = createEl("section", "i3d-climate-option-group");
      const groupHeading = createEl("h4", "", groupLabel);
      group.append(groupHeading);
      const choicesEl = createEl("div", "i3d-climate-choices");
      choicesEl.setAttribute("role", "group");
      choicesEl.setAttribute("aria-label", groupLabel);
      for (const choice of choices) {
        const button = createEl("button", "i3d-climate-choice", labels[choice] || choice);
        button.type = "button";
        button.addEventListener("click", () => applyControl(action, choice));
        choiceButtons.push({
          element: button,
          field,
          value: choice
        });
        choicesEl.append(button);
      }
      group.append(choicesEl);
      optionGroups.append(group);
    }
  }
  function render() {
    if (disposed) {
      return;
    }
    const entity = editing.item || {};
    const hasEntity = !!entity.entityId;
    const interactive = canControl();
    titleEl.textContent = entity.label || climate.name || "空调";
    titleEl.title = titleEl.textContent;
    subtitleEl.textContent = editing.editing ? "控制预览" : hasEntity ? climate.available ? climate.on ? climateModeLabel(climate.mode) : "已关闭" : "设备不可用" : "尚未绑定设备";
    root.dataset.climateMode = climate.available ? climate.visualMode : "off";
    root.classList.toggle("is-on", climate.available && climate.on);
    root.classList.toggle("is-running", climate.available && climate.running);
    powerButton.textContent = climate.on ? "关闭" : "开启";
    root.setAttribute("aria-busy", String(controlling || !!editing.busy));
    powerButton.disabled = !interactive || !climate.modes.some(mode => mode !== "off") || climate.on && !climate.modes.includes("off");
    powerButton.setAttribute("aria-pressed", String(climate.on));
    powerButton.setAttribute("aria-label", titleEl.textContent + "，" + (climate.on ? "关闭空调" : "开启空调"));
    if (climate.on) {
      lastActiveMode = climate.mode;
    }
    thermostatSlot.hidden = targetOutput.hidden = !climate.temperatureSupported;
    renderTemperature();
    rangeInfo.hidden = !climate.rangeSupported || climate.temperatureSupported;
    rangeInfo.textContent = "设定温区 " + (climate.targetLow ?? "--") + "–" + (climate.targetHigh ?? "--") + "°C · 当前 " + (climate.currentTemperature ?? "--") + "°C";
    const signature = JSON.stringify([climate.entityId, climate.modes, climate.fanModes, climate.swingModes]);
    if (optionsSignature !== signature) {
      optionsSignature = signature;
      rebuildOptionGroups();
    }
    for (const choice of choiceButtons) {
      choice.element.disabled = !interactive;
      choice.element.setAttribute("aria-pressed", String(climate[choice.field] === choice.value));
    }
    emptyStatus.hidden = climate.available && (climate.temperatureSupported || choiceButtons.length > 0);
    emptyStatus.textContent = hasEntity ? climate.available ? "设备尚未提供控制能力，状态到达后会自动更新。" : "正在等待设备状态，连接恢复后会自动更新。" : "绑定空调实体后显示设备控制。";
    errorStatus.textContent = editing.error || controlError;
    errorStatus.hidden = !errorStatus.textContent;
  }
  function update(state = {}) {
    if (disposed) {
      return;
    }
    const entityId = state.item?.entityId || "";
    if (entityId !== climate.entityId) {
      requestGeneration++;
      controlling = false;
      controlError = "";
      lastActiveMode = "";
      clearPendingTemperature();
    }
    editing = state;
    climate = state.state?.entityId === entityId && Array.isArray(state.state?.modes) ? state.state : climateState(entityId, state.state);
    if (pendingTemperature !== null && climate.temperature !== null && Math.abs(climate.temperature - pendingTemperature) < climate.step / 2 + 0.001) {
      clearPendingTemperature();
    }
    render();
  }
  function dispose() {
    if (!disposed) {
      disposed = true;
      requestGeneration++;
      clearPendingTemperature();
      setChildren(root);
    }
  }
  render();
  return {
    root,
    update,
    power,
    dispose
  };
}
