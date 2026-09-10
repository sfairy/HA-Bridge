import { televisionState, televisionTime, televisionPower, televisionMediaControl } from "./television-state.js";
export function createTelevisionPanel({
  onControl: arg3 = async () => {}
} = {}) {
  const value5 = (arg, element) => {
    const className = document.createElement(arg);
    className.className = element;
    return className;
  };
  const hidden = value5("div", "i3d-television-panel");
  const append = value5("div", "i3d-nas-heading");
  const textContent3 = value5("h3", "");
  const textContent4 = value5("span", "i3d-tv-status");
  const append2 = value5("div", "i3d-tv-content");
  const hidden2 = value5("img", "i3d-tv-artwork");
  const append3 = value5("div", "i3d-tv-details");
  const textContent5 = value5("strong", "");
  const textContent6 = value5("span", "");
  const hidden3 = value5("progress", "");
  const hidden4 = value5("span", "i3d-tv-time");
  const type2 = value5("button", "i3d-tv-power");
  const type3 = value5("button", "i3d-tv-power");
  const textContent7 = value5("p", "i3d-tv-error");
  type2.type = type3.type = "button";
  textContent7.setAttribute("role", "status");
  const setAttribute = value5("div", "i3d-tv-actions");
  setAttribute.setAttribute("role", "group");
  setAttribute.setAttribute("aria-label", "电视播放控制");
  const value6 = ["previous", "play", "next"].map(action => {
    const type = value5("button", "");
    type.type = "button";
    type.addEventListener("click", async () => {
      if (!item2 || value11 || item2.editing || value12 || value8 !== null) {
        return;
      }
      const enabled = televisionMediaControl(item2.item, item2.states, action);
      if (!enabled.enabled) {
        return;
      }
      const value = value10;
      value12 = true;
      textContent7.textContent = "";
      fn3();
      try {
        await arg3(enabled.command);
      } catch (message) {
        if (!value11 && value === value10) {
          textContent7.textContent = message?.message || "播放控制失败，请重试。";
        }
      } finally {
        if (!value11 && value === value10) {
          value12 = false;
          fn3();
        }
      }
    });
    setAttribute.append(type);
    return {
      action,
      button: type
    };
  });
  hidden2.hidden = true;
  hidden2.alt = "正在播放的内容封面";
  hidden2.addEventListener("error", () => {
    hidden2.hidden = true;
  });
  append.append(textContent3, textContent4, type2, type3);
  append3.append(textContent5, textContent6, hidden3, hidden4);
  append2.append(hidden2, append3);
  hidden.append(append, append2, setAttribute, textContent7);
  hidden.hidden = true;
  let item2;
  let src = "";
  let value7 = null;
  let value8 = null;
  let value9 = null;
  let value10 = 0;
  let value11 = false;
  let value12 = false;
  let value13 = false;
  function fn() {
    if (value9 !== null) {
      clearTimeout(value9);
    }
    value9 = null;
    value8 = null;
    value13 = false;
  }
  async function fn2(arg2) {
    if (!item2 || value11 || item2.editing || value12 || value8 !== null) {
      return;
    }
    const available2 = televisionPower(item2.item, item2.states, arg2);
    if (!available2.available || !available2.supported) {
      return;
    }
    const value4 = value10;
    value8 = arg2;
    value13 = false;
    textContent7.textContent = "";
    fn3();
    value9 = setTimeout(() => {
      if (!value11 && value10 === value4) {
        fn();
        textContent7.textContent = "命令已发送，暂未收到新的电源状态。";
        fn3();
      }
    }, 14000);
    try {
      await arg3(available2.command);
      if (!value11 && value4 === value10) {
        value13 = true;
        fn3();
      }
    } catch (message2) {
      if (!value11 && value4 === value10) {
        fn();
        textContent7.textContent = message2?.message || "开关机失败，请重试。";
        fn3();
      }
    }
  }
  type2.addEventListener("click", () => fn2(true));
  type3.addEventListener("click", () => fn2(false));
  function fn3() {
    if (!item2) {
      return;
    }
    const on = televisionState(item2.item, item2.states);
    const on2 = televisionPower(item2.item, item2.states);
    if (value13 && value8 !== null && value8 === on2.on && on2.available) {
      fn();
    }
    for (const [textContent, value2] of [[type2, true], [type3, false]]) {
      const available = televisionPower(item2.item, item2.states, value2);
      textContent.textContent = value8 === value2 ? value2 ? "开机中…" : "关机中…" : value2 ? "开机" : "关机";
      textContent.setAttribute("aria-label", value2 ? "开启电视" : "关闭电视");
      textContent.disabled = !!item2.editing || value12 || value8 !== null || !available.available || !available.supported;
      textContent.title = item2.editing ? "编辑预览不可控制设备" : available.reason;
    }
    hidden.setAttribute("aria-busy", String(value8 !== null));
    for (const {
      action: value3,
      button: textContent2
    } of value6) {
      const enabled2 = televisionMediaControl(item2.item, item2.states, value3);
      textContent2.textContent = value3 === "previous" ? "上一集" : value3 === "next" ? "下一集" : on.playing ? "暂停" : "播放";
      textContent2.setAttribute("aria-label", textContent2.textContent);
      textContent2.disabled = !!item2.editing || value12 || value8 !== null || !enabled2.enabled;
      textContent2.title = enabled2.enabled ? "" : "当前设备状态或播放器不支持此操作";
    }
    textContent3.textContent = on.name;
    textContent4.textContent = on.status;
    textContent5.textContent = on.on ? on.title : on.status;
    textContent6.textContent = [on.app, on.artist].filter(Boolean).join(" · ");
    textContent6.hidden = !on.on || on.idle || !textContent6.textContent;
    if (on.artwork !== src) {
      src = on.artwork;
      hidden2.hidden = !src;
      if (src) {
        hidden2.hidden = true;
        hidden2.onload = () => {
          if (item2 && src === on.artwork) {
            hidden2.hidden = false;
          }
        };
        hidden2.src = src;
      } else {
        hidden2.removeAttribute("src");
      }
    }
    hidden3.hidden = hidden4.hidden = !on.on || on.idle || on.duration === null || on.position === null;
    hidden3.max = on.duration || 1;
    hidden3.value = on.position || 0;
    hidden4.textContent = televisionTime(on.position) + " / " + televisionTime(on.duration);
    if (!on.playing && value7 !== null) {
      clearInterval(value7);
      value7 = null;
    }
  }
  return {
    root: hidden,
    update(item) {
      if (item2?.item.id !== item.item.id) {
        value10++;
        value12 = false;
        fn();
        textContent7.textContent = "";
      }
      item2 = item;
      fn3();
      if (televisionState(item.item, item.states).playing && value7 === null) {
        value7 = setInterval(fn3, 1000);
      }
    },
    hide() {
      hidden.hidden = true;
      if (value7 !== null) {
        clearInterval(value7);
      }
      value7 = null;
    },
    dispose() {
      value11 = true;
      value10++;
      fn();
      this.hide();
      item2 = null;
      hidden2.removeAttribute("src");
      hidden.remove();
    }
  };
}
