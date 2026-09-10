import { coverState, coverControl, coverStateLabel } from "./cover-state.js?v=20260909-curtain-action-v15";
export function createCoverPanel({
  element: ownerDocument,
  onControl: arg5 = async () => {},
  onPreview: arg6 = () => {}
} = {}) {
  const createElement = ownerDocument?.ownerDocument || globalThis.document;
  const value18 = (arg, element = "", element2 = "") => {
    const className = createElement.createElement(arg);
    className.className = element;
    className.textContent = element2;
    return className;
  };
  const value19 = (replaceChildren, ...arg2) => {
    if (typeof replaceChildren.replaceChildren == "function") {
      replaceChildren.replaceChildren(...arg2);
    } else {
      for (const remove of [...(replaceChildren.children || [])]) {
        remove.remove?.();
      }
      replaceChildren.append(...arg2);
    }
  };
  const setAttribute = ownerDocument || value18("section");
  setAttribute.classList.add("i3d-cover-panel");
  const append = value18("div", "i3d-cover-heading");
  const textContent = value18("h3", "", "窗帘");
  const textContent2 = value18("p", "", "尚未绑定设备");
  append.append(textContent, textContent2);
  const append2 = value18("div", "i3d-cover-controls-slot");
  const append3 = value18("section", "hb-cover-details-controls");
  const append4 = value18("label", "hb-cover-details-position");
  const append5 = value18("span", "hb-cover-details-position-heading");
  const setAttribute2 = value18("output");
  setAttribute2.setAttribute("aria-label", "当前开合位置");
  append5.append(setAttribute2);
  const addEventListener = value18("input");
  addEventListener.type = "range";
  addEventListener.min = "0";
  addEventListener.max = "100";
  addEventListener.step = "1";
  addEventListener.setAttribute("aria-label", "目标开合位置");
  const append6 = value18("span", "hb-cover-details-position-legend");
  append6.append(value18("small", "", "关闭"), value18("small", "", "打开"));
  append4.append(append5, addEventListener, append6);
  const append7 = value18("div", "hb-cover-details-actions");
  const push = [];
  for (const [value13, service, capability] of [["关闭", "close_cover", "closeSupported"], ["暂停", "stop_cover", "stopSupported"], ["打开", "open_cover", "openSupported"]]) {
    const type = value18("button");
    type.type = "button";
    type.dataset.coverAction = service;
    type.setAttribute("aria-label", value13);
    type.append(value18("strong", "", value13));
    type.addEventListener("click", () => fn4(service));
    push.push({
      button: type,
      service,
      capability
    });
    append7.append(type);
  }
  append3.append(append4, append7);
  append2.append(append3);
  const hidden = value18("p", "i3d-cover-feedback");
  hidden.hidden = true;
  value19(setAttribute, append, append2, hidden);
  let item = {};
  let position2 = coverState("", null);
  let value20 = false;
  let value21 = 0;
  let value22 = 0;
  let target = null;
  let value23 = null;
  let value24 = null;
  let value25 = false;
  let value26 = "";
  let revision = 0;
  let value27 = "";
  const value28 = () => !value20 && !item.editing && item.item?.modelAvailable !== false && position2.available;
  const value29 = () => value24 ?? item.presentation?.position ?? (target?.confirmed ? position2.position : target?.target ?? position2.position);
  const value30 = () => item.presentation || (target && !target.confirmed ? {
    ...position2,
    opening: target.target !== null && target.target > (position2.position ?? 0),
    closing: target.target !== null && target.target < (position2.position ?? 100),
    state: target.service === "stop_cover" ? position2.position === 0 ? "closed" : "open" : target.target > (position2.position ?? 0) ? "opening" : "closing"
  } : position2);
  function fn() {
    if (value23 !== null) {
      clearTimeout(value23);
    }
    value23 = null;
    target = null;
  }
  function fn2() {
    const value14 = value29();
    addEventListener.value = String(value14 ?? 0);
    addEventListener.style.setProperty("--hb-cover-position-progress", (value14 ?? 0) + "%");
    addEventListener.setAttribute("aria-valuetext", value14 === null ? "当前位置未知，滑动设置目标" : "目标 " + Math.round(value14) + "%，当前位置" + (position2.position === null ? "未知" : Math.round(position2.position) + "%"));
    setAttribute.setAttribute("aria-invalid", String(!!item.error || !!value26));
  }
  async function fn3(service2) {
    const value15 = value21;
    const ticket = ++value22;
    fn();
    value24 = null;
    value25 = false;
    value26 = "";
    target = {
      ticket,
      revision,
      initialState: position2.state,
      initialPosition: position2.position,
      confirmed: false,
      wasMoving: false,
      service: service2.service,
      target: service2.service === "set_cover_position" ? service2.data.position : service2.service === "open_cover" ? 100 : service2.service === "close_cover" ? 0 : null,
      sending: true
    };
    value23 = setTimeout(() => {
      if (!value20 && value21 === value15 && target?.ticket === ticket) {
        value23 = null;
        target = null;
        value26 = "尚未收到设备确认，请查看窗帘状态后重试。";
        fn6();
      }
    }, 15000);
    fn6();
    try {
      await arg5(service2);
    } catch (message2) {
      if (!value20 && value21 === value15 && target?.ticket === ticket) {
        fn();
        value26 = message2?.message || "窗帘控制失败，请重试。";
        fn6();
      }
    } finally {
      if (!value20 && value21 === value15 && target?.ticket === ticket) {
        target.sending = false;
        fn6();
      }
    }
  }
  function fn4(arg3, arg4) {
    if (value28()) {
      try {
        return fn3(coverControl(position2, arg3, arg4));
      } catch (message) {
        value26 = message.message;
        fn6();
      }
    }
  }
  addEventListener.addEventListener("pointerdown", () => {
    if (value28() && position2.positionSupported) {
      value25 = true;
    }
  });
  addEventListener.addEventListener("input", () => {
    if (!value28() || !position2.positionSupported) {
      return;
    }
    const value9 = Number(addEventListener.value);
    if (!Number.isFinite(value9)) {
      return;
    }
    value25 = true;
    value24 = Math.max(0, Math.min(100, Math.round(value9)));
    const presentation = arg6(item.item?.entityId, value24);
    if (presentation) {
      item = {
        ...item,
        presentation
      };
    }
    fn6();
  });
  addEventListener.addEventListener("change", () => {
    if (value24 === null) {
      value25 = false;
      fn2();
      return;
    }
    const value10 = value24;
    value24 = null;
    value25 = false;
    if (value28() && position2.positionSupported) {
      return fn4("set_cover_position", value10);
    }
    fn2();
  });
  function fn5() {
    value24 = null;
    value25 = false;
    const presentation2 = arg6(item.item?.entityId, null);
    if (presentation2) {
      item = {
        ...item,
        presentation: presentation2
      };
    }
    fn6();
  }
  addEventListener.addEventListener("pointercancel", fn5);
  addEventListener.addEventListener("blur", () => {
    if (value24 !== null) {
      fn5();
    }
  });
  function fn6() {
    if (value20) {
      return;
    }
    textContent.textContent = item.item?.label || position2.name || "窗帘";
    textContent.title = textContent.textContent;
    const position = value30();
    textContent2.textContent = item.editing ? "控制预览" : item.item?.entityId ? position2.available ? coverStateLabel(position.state) : "设备不可用" : "尚未绑定设备";
    setAttribute2.textContent = position.position === null ? "未知" : Math.round(position.position) + "%";
    addEventListener.disabled = !value28() || !position2.positionSupported;
    for (const {
      button: disabled,
      service: value11,
      capability: value12
    } of push) {
      disabled.disabled = !value28() || !position2[value12];
      const value4 = !!target && !target.confirmed && target.service === value11;
      disabled.setAttribute("aria-busy", String(value4));
      disabled.classList.toggle("is-active", value11 === "open_cover" && position.opening || value11 === "close_cover" && position.closing);
    }
    setAttribute.setAttribute("aria-busy", String(!!target && !target.confirmed));
    fn2();
  }
  function update(state = {}) {
    if (value20) {
      return;
    }
    const value16 = state.item?.entityId || "";
    if (value16 !== position2.entityId || state.item?.id !== item.item?.id) {
      if (value25) {
        arg6(item.item?.entityId, null);
      }
      value21++;
      fn();
      value24 = null;
      value25 = false;
      value26 = "";
      revision = 0;
      value27 = "";
    }
    item = state;
    position2 = state.state?.entityId === value16 && typeof state.state?.positionKnown == "boolean" ? state.state : coverState(value16, state.state);
    const value17 = JSON.stringify([position2.state, position2.position, position2.raw.updatedAt ?? position2.raw.last_updated, position2.raw.lastChanged ?? position2.raw.last_changed]);
    if (value27 !== value17) {
      value27 = value17;
      revision++;
    }
    if (!value28()) {
      value24 = null;
      value25 = false;
      fn();
    }
    if (target && revision > target.revision) {
      const value5 = target.target !== null && position2.position !== null && Math.abs(position2.position - target.target) <= 0.5;
      const value6 = target.service === "stop_cover" && !position2.moving;
      const value7 = target.service === "open_cover" && position2.position === null && position2.state === "open" && target.initialState !== "open";
      const value8 = target.confirmed && target.wasMoving && !position2.moving;
      if (value5 || value6 || value7 || value8) {
        fn();
      } else if (target.target !== null) {
        const value = target.initialPosition === null ? target.service === "open_cover" ? 1 : target.service === "close_cover" ? -1 : 0 : Math.sign(target.target - target.initialPosition);
        const value2 = value !== 0 && position2.position !== null && target.initialPosition !== null && (position2.position - target.initialPosition) * value > 0.5;
        const value3 = position2.state !== target.initialState && (value > 0 && position2.opening || value < 0 && position2.closing);
        if (value2 || value3) {
          target.confirmed = true;
          if (value23 !== null) {
            clearTimeout(value23);
          }
          value23 = null;
        }
        if (target.confirmed && position2.moving) {
          target.wasMoving = true;
        }
      }
    }
    if (!value25) {
      value24 = null;
    }
    fn6();
  }
  function dispose() {
    if (!value20) {
      value20 = true;
      if (value25) {
        arg6(item.item?.entityId, null);
      }
      value21++;
      fn();
      value19(setAttribute);
    }
  }
  fn6();
  return {
    root: setAttribute,
    update,
    dispose
  };
}
