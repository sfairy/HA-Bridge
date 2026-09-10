import { climateState, climateControl, climatePowerControl, climateModeLabel, climateSwingModeLabel } from "./climate-state.js?v=20260908-climate-v1";
const oe = {
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
  element: ownerDocument,
  onControl: arg11 = async () => {}
} = {}) {
  const createElement = ownerDocument?.ownerDocument || globalThis.document;
  const value11 = (arg5, element, element2 = "") => {
    const className = createElement.createElement(arg5);
    className.className = element;
    className.textContent = element2;
    return className;
  };
  const value12 = (replaceChildren, ...arg6) => {
    if (typeof replaceChildren.replaceChildren == "function") {
      replaceChildren.replaceChildren(...arg6);
    } else {
      for (const remove of [...(replaceChildren.children || [])]) {
        remove.remove?.();
      }
      replaceChildren.append(...arg6);
    }
  };
  const classList = ownerDocument || value11("section", "");
  classList.classList.add("i3d-climate-panel");
  const append2 = value11("div", "i3d-climate-heading");
  const textContent = value11("h3", "", "空调");
  const textContent2 = value11("p", "", "尚未绑定设备");
  const setAttribute2 = value11("button", "i3d-climate-power");
  setAttribute2.type = "button";
  const append3 = value11("div", "i3d-climate-heading-text");
  append3.append(textContent, textContent2);
  append2.append(append3, setAttribute2);
  const append4 = value11("div", "i3d-climate-thermostat-slot");
  const append5 = value11("section", "hb-climate-thermostat");
  const type2 = value11("button", "hb-climate-temperature-step", "−");
  const type3 = value11("button", "hb-climate-temperature-step", "+");
  type2.type = type3.type = "button";
  type2.setAttribute("aria-label", "降低设定温度");
  type3.setAttribute("aria-label", "提高设定温度");
  const append6 = value11("div", "i3d-climate-temperature-content");
  const setAttribute3 = value11("output", "i3d-climate-target");
  const textContent3 = value11("span", "", "当前温度 --");
  setAttribute3.setAttribute("aria-label", "设定温度");
  append6.append(value11("small", "", "设定温度"), setAttribute3, textContent3);
  append5.append(type2, append6, type3);
  append4.append(append5);
  const hidden = value11("p", "i3d-climate-temperature-interval");
  const append7 = value11("div", "i3d-climate-groups");
  const setAttribute4 = value11("p", "i3d-climate-empty");
  const textContent4 = value11("p", "i3d-climate-error");
  setAttribute4.setAttribute("role", "status");
  textContent4.setAttribute("role", "status");
  value12(classList, append2, append4, hidden, append7, setAttribute4, textContent4);
  let editing = {};
  let on = climateState("", null);
  let value13 = false;
  let value14 = false;
  let value15 = "";
  let value16 = 0;
  let value17 = null;
  let value18 = null;
  let value19 = "";
  let value20 = "";
  let push = [];
  const value21 = () => !value13 && !editing.editing && !editing.busy && !value14 && on.available;
  const value22 = () => {
    if (value18 !== null) {
      clearTimeout(value18);
    }
    value18 = null;
    value17 = null;
  };
  function fn() {
    return value17 ?? on.temperature;
  }
  function fn2(arg7 = fn()) {
    setAttribute3.value = arg7 === null ? "" : String(arg7);
    setAttribute3.textContent = arg7 === null ? "--" : arg7 + "°C";
    textContent3.textContent = on.currentTemperature === null ? "当前温度 --" : "当前温度 " + on.currentTemperature + "°C";
    type2.disabled = !value21() || arg7 === null || arg7 <= on.minimum;
    type3.disabled = !value21() || arg7 === null || arg7 >= on.maximum;
  }
  async function fn3(service) {
    if (!value21()) {
      return;
    }
    const value6 = value16;
    value14 = true;
    value15 = "";
    if (service.service === "set_temperature") {
      value22();
      value17 = service.data.temperature;
      value18 = setTimeout(() => {
        value18 = null;
        value17 = null;
        if (!value13) {
          fn6();
        }
      }, 8000);
    }
    fn6();
    try {
      await arg11(service);
    } catch (message2) {
      if (!value13 && value6 === value16) {
        value15 = message2?.message || "空调控制失败，请重试。";
        value22();
      }
    } finally {
      if (!value13 && value6 === value16) {
        value14 = false;
        fn6();
      }
    }
  }
  function fn4(arg8, arg9) {
    if (value21()) {
      try {
        return fn3(climateControl(on, arg8, arg9));
      } catch (message) {
        value15 = message.message;
        fn6();
      }
    }
  }
  function power({
    toggle: arg10 = true
  } = {}) {
    if (!value21() || !arg10 && on.on) {
      return Promise.resolve(false);
    }
    try {
      return fn3(climatePowerControl(on, arg10 ? !on.on : true, value19));
    } catch (message3) {
      value15 = message3.message;
      fn6();
      return Promise.resolve(false);
    }
  }
  setAttribute2.addEventListener("click", () => power());
  type2.addEventListener("click", () => fn4("set_temperature", (fn() ?? on.minimum) - on.step));
  type3.addEventListener("click", () => fn4("set_temperature", (fn() ?? on.minimum) + on.step));
  function fn5() {
    value12(append7);
    push = [];
    for (const [value3, length, field, value4, value5] of [["运行模式", on.modes.filter(arg4 => arg4 !== "off"), "mode", "set_hvac_mode", Object.fromEntries(on.modes.map(arg2 => [arg2, climateModeLabel(arg2)]))], ["风速", on.fanModes, "fanMode", "set_fan_mode", oe], ["摆风", on.swingModes, "swingMode", "set_swing_mode", Object.fromEntries(on.swingModes.map(arg3 => [arg3, climateSwingModeLabel(arg3)]))]]) {
      if (!length.length) {
        continue;
      }
      const append = value11("section", "i3d-climate-option-group");
      const value2 = value11("h4", "", value3);
      append.append(value2);
      const setAttribute = value11("div", "i3d-climate-choices");
      setAttribute.setAttribute("role", "group");
      setAttribute.setAttribute("aria-label", value3);
      for (const value of length) {
        const type = value11("button", "i3d-climate-choice", value5[value] || value);
        type.type = "button";
        type.addEventListener("click", () => fn4(value4, value));
        push.push({
          element: type,
          field,
          value
        });
        setAttribute.append(type);
      }
      append.append(setAttribute);
      append7.append(append);
    }
  }
  function fn6() {
    if (value13) {
      return;
    }
    const entityId = editing.item || {};
    const value7 = !!entityId.entityId;
    const value8 = value21();
    textContent.textContent = entityId.label || on.name || "空调";
    textContent.title = textContent.textContent;
    textContent2.textContent = editing.editing ? "控制预览" : value7 ? on.available ? on.on ? climateModeLabel(on.mode) : "已关闭" : "设备不可用" : "尚未绑定设备";
    classList.dataset.climateMode = on.available ? on.visualMode : "off";
    classList.classList.toggle("is-on", on.available && on.on);
    classList.classList.toggle("is-running", on.available && on.running);
    setAttribute2.textContent = on.on ? "关闭" : "开启";
    classList.setAttribute("aria-busy", String(value14 || !!editing.busy));
    setAttribute2.disabled = !value8 || !on.modes.some(arg => arg !== "off") || on.on && !on.modes.includes("off");
    setAttribute2.setAttribute("aria-pressed", String(on.on));
    setAttribute2.setAttribute("aria-label", textContent.textContent + "，" + (on.on ? "关闭空调" : "开启空调"));
    if (on.on) {
      value19 = on.mode;
    }
    append4.hidden = setAttribute3.hidden = !on.temperatureSupported;
    fn2();
    hidden.hidden = !on.rangeSupported || on.temperatureSupported;
    hidden.textContent = "设定温区 " + (on.targetLow ?? "--") + "–" + (on.targetHigh ?? "--") + "°C · 当前 " + (on.currentTemperature ?? "--") + "°C";
    const value9 = JSON.stringify([on.entityId, on.modes, on.fanModes, on.swingModes]);
    if (value20 !== value9) {
      value20 = value9;
      fn5();
    }
    for (const element3 of push) {
      element3.element.disabled = !value8;
      element3.element.setAttribute("aria-pressed", String(on[element3.field] === element3.value));
    }
    setAttribute4.hidden = on.available && (on.temperatureSupported || push.length > 0);
    setAttribute4.textContent = value7 ? on.available ? "设备尚未提供控制能力，状态到达后会自动更新。" : "正在等待设备状态，连接恢复后会自动更新。" : "绑定空调实体后显示设备控制。";
    textContent4.textContent = editing.error || value15;
    textContent4.hidden = !textContent4.textContent;
  }
  function update(state = {}) {
    if (value13) {
      return;
    }
    const value10 = state.item?.entityId || "";
    if (value10 !== on.entityId) {
      value16++;
      value14 = false;
      value15 = "";
      value19 = "";
      value22();
    }
    editing = state;
    on = state.state?.entityId === value10 && Array.isArray(state.state?.modes) ? state.state : climateState(value10, state.state);
    if (value17 !== null && on.temperature !== null && Math.abs(on.temperature - value17) < on.step / 2 + 0.001) {
      value22();
    }
    fn6();
  }
  function dispose() {
    if (!value13) {
      value13 = true;
      value16++;
      value22();
      value12(classList);
    }
  }
  fn6();
  return {
    root: classList,
    update,
    power,
    dispose
  };
}
