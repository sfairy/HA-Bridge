import { televisionState, televisionTime, televisionPower, televisionMediaControl } from "./television-state.js";
export function createTelevisionPanel({
  onControl = async () => {}
} = {}) {
  const createEl = (tag, className) => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
  };
  const root = createEl("div", "i3d-television-panel");
  const heading = createEl("div", "i3d-nas-heading");
  const titleEl = createEl("h3", "");
  const statusEl = createEl("span", "i3d-tv-status");
  const content = createEl("div", "i3d-tv-content");
  const artworkEl = createEl("img", "i3d-tv-artwork");
  const details = createEl("div", "i3d-tv-details");
  const mediaTitleEl = createEl("strong", "");
  const mediaMetaEl = createEl("span", "");
  const progressEl = createEl("progress", "");
  const timeEl = createEl("span", "i3d-tv-time");
  const powerOnButton = createEl("button", "i3d-tv-power");
  const powerOffButton = createEl("button", "i3d-tv-power");
  const errorEl = createEl("p", "i3d-tv-error");
  powerOnButton.type = powerOffButton.type = "button";
  errorEl.setAttribute("role", "status");
  const actions = createEl("div", "i3d-tv-actions");
  actions.setAttribute("role", "group");
  actions.setAttribute("aria-label", "电视播放控制");
  const mediaButtons = ["previous", "play", "next"].map(action => {
    const button = createEl("button", "");
    button.type = "button";
    button.addEventListener("click", async () => {
      if (!current || disposed || current.editing || mediaBusy || pendingPower !== null) {
        return;
      }
      const control = televisionMediaControl(current.item, current.states, action);
      if (!control.enabled) {
        return;
      }
      const requestToken = updateToken;
      mediaBusy = true;
      errorEl.textContent = "";
      render();
      try {
        await onControl(control.command);
      } catch (error) {
        if (!disposed && requestToken === updateToken) {
          errorEl.textContent = error?.message || "播放控制失败，请重试。";
        }
      } finally {
        if (!disposed && requestToken === updateToken) {
          mediaBusy = false;
          render();
        }
      }
    });
    actions.append(button);
    return {
      action,
      button
    };
  });
  artworkEl.hidden = true;
  artworkEl.alt = "正在播放的内容封面";
  artworkEl.addEventListener("error", () => {
    artworkEl.hidden = true;
  });
  heading.append(titleEl, statusEl, powerOnButton, powerOffButton);
  details.append(mediaTitleEl, mediaMetaEl, progressEl, timeEl);
  content.append(artworkEl, details);
  root.append(heading, content, actions, errorEl);
  root.hidden = true;
  let current;
  let artworkSrc = "";
  let progressTimer = null;
  let pendingPower = null;
  let powerTimeout = null;
  let updateToken = 0;
  let disposed = false;
  let mediaBusy = false;
  let powerCommandSent = false;
  function clearPendingPower() {
    if (powerTimeout !== null) {
      clearTimeout(powerTimeout);
    }
    powerTimeout = null;
    pendingPower = null;
    powerCommandSent = false;
  }
  async function requestPower(wantOn) {
    if (!current || disposed || current.editing || mediaBusy || pendingPower !== null) {
      return;
    }
    const power = televisionPower(current.item, current.states, wantOn);
    if (!power.available || !power.supported) {
      return;
    }
    const requestToken = updateToken;
    pendingPower = wantOn;
    powerCommandSent = false;
    errorEl.textContent = "";
    render();
    powerTimeout = setTimeout(() => {
      if (!disposed && updateToken === requestToken) {
        clearPendingPower();
        errorEl.textContent = "命令已发送，暂未收到新的电源状态。";
        render();
      }
    }, 14000);
    try {
      await onControl(power.command);
      if (!disposed && requestToken === updateToken) {
        powerCommandSent = true;
        render();
      }
    } catch (error) {
      if (!disposed && requestToken === updateToken) {
        clearPendingPower();
        errorEl.textContent = error?.message || "开关机失败，请重试。";
        render();
      }
    }
  }
  powerOnButton.addEventListener("click", () => requestPower(true));
  powerOffButton.addEventListener("click", () => requestPower(false));
  function render() {
    if (!current) {
      return;
    }
    const media = televisionState(current.item, current.states);
    const power = televisionPower(current.item, current.states);
    if (powerCommandSent && pendingPower !== null && pendingPower === power.on && power.available) {
      clearPendingPower();
    }
    for (const [button, wantOn] of [[powerOnButton, true], [powerOffButton, false]]) {
      const capability = televisionPower(current.item, current.states, wantOn);
      button.textContent = pendingPower === wantOn ? wantOn ? "开机中…" : "关机中…" : wantOn ? "开机" : "关机";
      button.setAttribute("aria-label", wantOn ? "开启电视" : "关闭电视");
      button.disabled = !!current.editing || mediaBusy || pendingPower !== null || !capability.available || !capability.supported;
      button.title = current.editing ? "编辑预览不可控制设备" : capability.reason;
    }
    root.setAttribute("aria-busy", String(pendingPower !== null));
    for (const {
      action,
      button
    } of mediaButtons) {
      const control = televisionMediaControl(current.item, current.states, action);
      button.textContent = action === "previous" ? "上一集" : action === "next" ? "下一集" : media.playing ? "暂停" : "播放";
      button.setAttribute("aria-label", button.textContent);
      button.disabled = !!current.editing || mediaBusy || pendingPower !== null || !control.enabled;
      button.title = control.enabled ? "" : "当前设备状态或播放器不支持此操作";
    }
    titleEl.textContent = media.name;
    statusEl.textContent = media.status;
    mediaTitleEl.textContent = media.on ? media.title : media.status;
    mediaMetaEl.textContent = [media.app, media.artist].filter(Boolean).join(" · ");
    mediaMetaEl.hidden = !media.on || media.idle || !mediaMetaEl.textContent;
    if (media.artwork !== artworkSrc) {
      artworkSrc = media.artwork;
      artworkEl.hidden = !artworkSrc;
      if (artworkSrc) {
        artworkEl.hidden = true;
        artworkEl.onload = () => {
          if (current && artworkSrc === media.artwork) {
            artworkEl.hidden = false;
          }
        };
        artworkEl.src = artworkSrc;
      } else {
        artworkEl.removeAttribute("src");
      }
    }
    progressEl.hidden = timeEl.hidden = !media.on || media.idle || media.duration === null || media.position === null;
    progressEl.max = media.duration || 1;
    progressEl.value = media.position || 0;
    timeEl.textContent = televisionTime(media.position) + " / " + televisionTime(media.duration);
    if (!media.playing && progressTimer !== null) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }
  return {
    root,
    update(item) {
      if (current?.item.id !== item.item.id) {
        updateToken++;
        mediaBusy = false;
        clearPendingPower();
        errorEl.textContent = "";
      }
      current = item;
      render();
      if (televisionState(item.item, item.states).playing && progressTimer === null) {
        progressTimer = setInterval(render, 1000);
      }
    },
    hide() {
      root.hidden = true;
      if (progressTimer !== null) {
        clearInterval(progressTimer);
      }
      progressTimer = null;
    },
    dispose() {
      disposed = true;
      updateToken++;
      clearPendingPower();
      this.hide();
      current = null;
      artworkEl.removeAttribute("src");
      root.remove();
    }
  };
}
