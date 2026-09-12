import { coverState, coverControl, coverStateLabel, resolveCoverDisplayPosition } from "./cover-state.js?v=20260910-curtain-default-open-v2";
export function createCoverPanel({
  element: host,
  onControl = async () => {},
  onPreview = () => {}
} = {}) {
  const doc = host?.ownerDocument || globalThis.document;
  const createEl = (tag, className = "", text = "") => {
    const node = doc.createElement(tag);
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
  const panel = host || createEl("section");
  panel.classList.add("i3d-cover-panel");
  const heading = createEl("div", "i3d-cover-heading");
  const titleEl = createEl("h3", "", "窗帘");
  const statusEl = createEl("p", "", "尚未绑定设备");
  heading.append(titleEl, statusEl);
  const controlsSlot = createEl("div", "i3d-cover-controls-slot");
  const controlsSection = createEl("section", "hb-cover-details-controls");
  const positionLabel = createEl("label", "hb-cover-details-position");
  const positionHeading = createEl("span", "hb-cover-details-position-heading");
  const positionOutput = createEl("output");
  positionOutput.setAttribute("aria-label", "当前开合位置");
  positionHeading.append(positionOutput);
  const positionSlider = createEl("input");
  positionSlider.type = "range";
  positionSlider.min = "0";
  positionSlider.max = "100";
  positionSlider.step = "1";
  positionSlider.setAttribute("aria-label", "目标开合位置");
  const positionLegend = createEl("span", "hb-cover-details-position-legend");
  positionLegend.append(createEl("small", "", "关闭"), createEl("small", "", "打开"));
  positionLabel.append(positionHeading, positionSlider, positionLegend);
  const actionsRow = createEl("div", "hb-cover-details-actions");
  const actionButtons = [];
  for (const [label, service, capability] of [["关闭", "close_cover", "closeSupported"], ["暂停", "stop_cover", "stopSupported"], ["打开", "open_cover", "openSupported"]]) {
    const button = createEl("button");
    button.type = "button";
    button.dataset.coverAction = service;
    button.setAttribute("aria-label", label);
    button.append(createEl("strong", "", label));
    button.addEventListener("click", () => invokeControl(service));
    actionButtons.push({
      button,
      service,
      capability
    });
    actionsRow.append(button);
  }
  controlsSection.append(positionLabel, actionsRow);
  controlsSlot.append(controlsSection);
  const feedbackEl = createEl("p", "i3d-cover-feedback");
  feedbackEl.hidden = true;
  setChildren(panel, heading, controlsSlot, feedbackEl);
  let item = {};
  let cover = coverState("", null);
  let disposed = false;
  let generation = 0;
  let ticketSeq = 0;
  let target = null;
  let confirmTimeout = null;
  let draftPosition = null;
  let sliderActive = false;
  let localError = "";
  let revision = 0;
  let stateFingerprint = "";
  const canControl = () => !disposed && !item.editing && item.item?.modelAvailable !== false && cover.available;
  const displayPosition = () => {
    const raw = draftPosition ?? item.presentation?.position ?? (target?.confirmed ? cover.position : target?.target ?? cover.position);
    return raw === null || raw === undefined ? resolveCoverDisplayPosition(cover.position, cover.state) : raw;
  };
  const displayState = () => item.presentation || (target && !target.confirmed ? {
    ...cover,
    opening: target.target !== null && target.target > resolveCoverDisplayPosition(cover.position, cover.state),
    closing: target.target !== null && target.target < resolveCoverDisplayPosition(cover.position, cover.state),
    state: target.service === "stop_cover" ? resolveCoverDisplayPosition(cover.position, cover.state) === 0 ? "closed" : "open" : target.target > resolveCoverDisplayPosition(cover.position, cover.state) ? "opening" : "closing"
  } : cover);
  function clearPendingTarget() {
    if (confirmTimeout !== null) {
      clearTimeout(confirmTimeout);
    }
    confirmTimeout = null;
    target = null;
  }
  function syncSlider() {
    const sliderValue = displayPosition();
    positionSlider.value = String(sliderValue ?? 100);
    positionSlider.style.setProperty("--hb-cover-position-progress", (sliderValue ?? 100) + "%");
    positionSlider.setAttribute("aria-valuetext", cover.position === null ? "当前位置未知，滑动设置目标" : "目标 " + Math.round(sliderValue) + "%，当前位置" + Math.round(cover.position) + "%");
    panel.setAttribute("aria-invalid", String(!!item.error || !!localError));
  }
  async function sendControl(command) {
    const expectedGeneration = generation;
    const ticket = ++ticketSeq;
    const hadPresentation = !!item.presentation;
    clearPendingTarget();
    draftPosition = null;
    sliderActive = false;
    localError = "";
    target = {
      ticket,
      revision,
      initialState: cover.state,
      initialPosition: cover.position,
      confirmed: false,
      wasMoving: false,
      service: command.service,
      target: command.service === "set_cover_position" ? command.data.position : command.service === "open_cover" ? 100 : command.service === "close_cover" ? 0 : null,
      sending: true
    };
    if (!hadPresentation) {
      confirmTimeout = setTimeout(() => {
        if (!disposed && generation === expectedGeneration && target?.ticket === ticket) {
          confirmTimeout = null;
          target = null;
          localError = "尚未收到设备确认，请查看窗帘状态后重试。";
          render();
        }
      }, 15000);
    }
    render();
    try {
      await onControl(command);
    } catch (error) {
      if (!disposed && generation === expectedGeneration && target?.ticket === ticket) {
        clearPendingTarget();
        localError = error?.message || "窗帘控制失败，请重试。";
        render();
      }
    } finally {
      if (!disposed && generation === expectedGeneration && target?.ticket === ticket) {
        if (hadPresentation) {
          clearPendingTarget();
        } else {
          target.sending = false;
        }
        render();
      }
    }
  }
  function invokeControl(service, positionArg) {
    if (canControl()) {
      try {
        return sendControl(coverControl(cover, service, positionArg));
      } catch (error) {
        localError = error.message;
        render();
      }
    }
  }
  positionSlider.addEventListener("pointerdown", () => {
    if (canControl() && cover.positionSupported) {
      sliderActive = true;
    }
  });
  positionSlider.addEventListener("input", () => {
    if (!canControl() || !cover.positionSupported) {
      return;
    }
    const rawValue = Number(positionSlider.value);
    if (!Number.isFinite(rawValue)) {
      return;
    }
    sliderActive = true;
    draftPosition = Math.max(0, Math.min(100, Math.round(rawValue)));
    const presentation = onPreview(item.item?.entityId, draftPosition);
    if (presentation) {
      item = {
        ...item,
        presentation
      };
    }
    render();
  });
  positionSlider.addEventListener("change", () => {
    if (draftPosition === null) {
      sliderActive = false;
      syncSlider();
      return;
    }
    const pendingPosition = draftPosition;
    draftPosition = null;
    sliderActive = false;
    if (canControl() && cover.positionSupported) {
      return invokeControl("set_cover_position", pendingPosition);
    }
    syncSlider();
  });
  function cancelDraft() {
    draftPosition = null;
    sliderActive = false;
    const presentation = onPreview(item.item?.entityId, null);
    if (presentation) {
      item = {
        ...item,
        presentation
      };
    }
    render();
  }
  positionSlider.addEventListener("pointercancel", cancelDraft);
  positionSlider.addEventListener("blur", () => {
    if (draftPosition !== null) {
      cancelDraft();
    }
  });
  function render() {
    if (disposed) {
      return;
    }
    titleEl.textContent = item.item?.label || cover.name || "窗帘";
    titleEl.title = titleEl.textContent;
    const view = displayState();
    statusEl.textContent = item.editing ? "控制预览" : item.item?.entityId ? cover.available ? coverStateLabel(view.state) : "设备不可用" : "尚未绑定设备";
    positionOutput.textContent = view.position === null ? "未知" : Math.round(view.position) + "%";
    positionSlider.disabled = !canControl() || !cover.positionSupported;
    for (const {
      button,
      service,
      capability
    } of actionButtons) {
      button.disabled = !canControl() || !cover[capability];
      const isBusy = !!target && !target.confirmed && target.service === service;
      button.setAttribute("aria-busy", String(isBusy));
      button.classList.toggle("is-active", service === "open_cover" && view.opening || service === "close_cover" && view.closing);
    }
    panel.setAttribute("aria-busy", String(!!(item.presentation ? item.presentation.preview : target && !target.confirmed)));
    syncSlider();
  }
  function update(state = {}) {
    if (disposed) {
      return;
    }
    const entityId = state.item?.entityId || "";
    if (entityId !== cover.entityId || state.item?.id !== item.item?.id) {
      if (sliderActive) {
        onPreview(item.item?.entityId, null);
      }
      generation++;
      clearPendingTarget();
      draftPosition = null;
      sliderActive = false;
      localError = "";
      revision = 0;
      stateFingerprint = "";
    }
    item = state;
    cover = state.state?.entityId === entityId && typeof state.state?.positionKnown == "boolean" ? state.state : coverState(entityId, state.state);
    const nextFingerprint = JSON.stringify([cover.state, cover.position, cover.raw.updatedAt ?? cover.raw.last_updated, cover.raw.lastChanged ?? cover.raw.last_changed]);
    if (stateFingerprint !== nextFingerprint) {
      stateFingerprint = nextFingerprint;
      revision++;
    }
    if (!canControl()) {
      draftPosition = null;
      sliderActive = false;
      clearPendingTarget();
    }
    if (target && revision > target.revision) {
      const reachedTarget = target.target !== null && cover.position !== null && Math.abs(cover.position - target.target) <= 0.5;
      const stopSettled = target.service === "stop_cover" && !cover.moving;
      const openConfirmed = target.service === "open_cover" && cover.position === null && cover.state === "open" && target.initialState !== "open";
      const finishedMoving = target.confirmed && target.wasMoving && !cover.moving;
      if (reachedTarget || stopSettled || openConfirmed || finishedMoving) {
        clearPendingTarget();
      } else if (target.target !== null) {
        const direction = target.initialPosition === null ? target.service === "open_cover" ? 1 : target.service === "close_cover" ? -1 : 0 : Math.sign(target.target - target.initialPosition);
        const movedTowardTarget = direction !== 0 && cover.position !== null && target.initialPosition !== null && (cover.position - target.initialPosition) * direction > 0.5;
        const stateChangedToward = cover.state !== target.initialState && (direction > 0 && cover.opening || direction < 0 && cover.closing);
        if (movedTowardTarget || stateChangedToward) {
          target.confirmed = true;
          if (confirmTimeout !== null) {
            clearTimeout(confirmTimeout);
          }
          confirmTimeout = null;
        }
        if (target.confirmed && cover.moving) {
          target.wasMoving = true;
        }
      }
    }
    if (!sliderActive) {
      draftPosition = null;
    }
    render();
  }
  function dispose() {
    if (!disposed) {
      disposed = true;
      if (sliderActive) {
        onPreview(item.item?.entityId, null);
      }
      generation++;
      clearPendingTarget();
      setChildren(panel);
    }
  }
  render();
  return {
    root: panel,
    update,
    dispose
  };
}
