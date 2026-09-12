import { mountInteraction3d } from "./runtime.js?v=20260910-control-projectid-v1-20260911-security-camera-popup-v6";
import { requestInteraction3dAccess, subscribeInteraction3dAccess } from "/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1";
export async function openInteraction3dRangeEditor({
  component,
  document: panelDocument,
  states,
  onSave,
  onClose = () => {}
}) {
  await requestInteraction3dAccess();
  if (!component.properties?.sceneId) {
    throw new Error("请先载入 3D 户型。");
  }
  if (component.properties.lightingMode !== "region") {
    throw new Error("请先选择轻量柔光模式。");
  }
  const draft = structuredClone(component);
  const previouslyFocused = document.activeElement;
  const createEl = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const stylesheetLink = createEl("link");
  stylesheetLink.rel = "stylesheet";
  stylesheetLink.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15";
  document.head.append(stylesheetLink);
  const dialog = createEl("dialog", "i3d-editor i3d-range-dialog");
  dialog.setAttribute("aria-label", "照射范围");
  dialog.setAttribute("data-i3d-preview-scope", "");
  const header = createEl("header");
  const saveButton = createEl("button", "primary", "保存");
  const closeButton = createEl("button", "i3d-range-close", "×");
  closeButton.setAttribute("aria-label", "关闭照射范围");
  closeButton.title = "关闭";
  saveButton.type = closeButton.type = "button";
  saveButton.disabled = true;
  const statusEl = createEl("p", "i3d-range-status", "正在准备平面户型…");
  statusEl.setAttribute("role", "status");
  const reloadButton = createEl("button", "", "重新载入");
  reloadButton.type = "button";
  reloadButton.hidden = true;
  const body = createEl("div", "i3d-range-dialog-body");
  const mountHost = createEl("div");
  header.append(createEl("strong", "", "照射范围"), reloadButton, saveButton, closeButton);
  body.append(mountHost);
  dialog.append(header, statusEl, body);
  document.body.append(dialog);
  let closed = false;
  let saving = false;
  let editorReady = false;
  let rangeRuntime = null;
  let unsubscribeAccess = () => {};
  let loadGeneration = 0;
  let dirtyRevision = 0;
  let resolveReady;
  let rejectReady;
  const readyPromise = new Promise((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  // close() rejects this promise; absorb to avoid unhandledrejection noise.
  readyPromise.catch(() => {});
  function close() {
    if (!closed) {
      closed = true;
      loadGeneration++;
      unsubscribeAccess();
      rangeRuntime?.();
      rejectReady(new Error("照射范围编辑已关闭。"));
      window.removeEventListener("pagehide", close);
      dialog.close();
      dialog.remove();
      stylesheetLink.remove();
      document.dispatchEvent(new Event("hb-i3d-preview-scope"));
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
      onClose();
    }
  }
  function onLoadError(error) {
    if (!closed) {
      saveButton.disabled = true;
      reloadButton.hidden = false;
      statusEl.textContent = error.message || "照射范围载入失败，请重试。";
      statusEl.classList.add("is-error");
      rejectReady(error);
    }
  }
  function mountEditor() {
    const generation = ++loadGeneration;
    editorReady = false;
    rangeRuntime?.();
    saveButton.disabled = true;
    reloadButton.hidden = true;
    statusEl.classList.remove("is-error");
    statusEl.textContent = "正在准备平面户型…";
    rangeRuntime = mountInteraction3d(mountHost, {
      component: draft,
      context: {
        document: panelDocument,
        states
      },
      editing: true,
      rangeEditorOnly: true,
      async onPresented() {
        try {
          await rangeRuntime.openRangeEditor();
          if (closed || generation !== loadGeneration) {
            return;
          }
          editorReady = true;
          saveButton.disabled = false;
          statusEl.textContent = "选择灯具，可切换圆形或方形；拖动边界调整范围，保存后生效。";
          resolveReady();
        } catch (error) {
          if (generation === loadGeneration) {
            onLoadError(error);
          }
        }
      },
      onLoadError,
      onEdit(action) {
        if (!closed && generation === loadGeneration) {
          if (action.action === "light-region-overrides") {
            const lightRegionOverrides = structuredClone(action.overrides || {});
            if (JSON.stringify(lightRegionOverrides) !== JSON.stringify(draft.properties.lightRegionOverrides || {})) {
              dirtyRevision++;
              if (!saving) {
                statusEl.textContent = "范围已修改，点击保存应用。";
                statusEl.classList.remove("is-error");
              }
            }
            draft.properties.lightRegionOverrides = lightRegionOverrides;
          }
          if (action.action === "range-editor-state" && action.error) {
            onLoadError(new Error(action.error));
          } else if (action.action === "range-editor-state" && !action.active && editorReady && !saving) {
            close();
          }
        }
      }
    });
  }
  saveButton.addEventListener("click", async () => {
    if (!closed && !saving && !!editorReady && !saveButton.disabled) {
      saving = true;
      saveButton.disabled = true;
      closeButton.disabled = true;
      reloadButton.hidden = true;
      statusEl.textContent = "正在保存范围…";
      try {
        await rangeRuntime.flushRangeEditor();
        const overrides = structuredClone(draft.properties.lightRegionOverrides || {});
        const savedRevision = dirtyRevision;
        await requestInteraction3dAccess();
        if (closed) {
          return;
        }
        await onSave(overrides);
        if (!closed) {
          statusEl.textContent = savedRevision === dirtyRevision ? "已保存到灯光配置，可继续调整。关闭后点击“保存配置”完成保存。" : "已保存，另有新修改待保存。";
          statusEl.classList.remove("is-error");
        }
      } catch (error) {
        if (closed) {
          return;
        }
        statusEl.textContent = error.message || "保存失败，请重试。";
        statusEl.classList.add("is-error");
      } finally {
        saving = false;
        if (!closed) {
          closeButton.disabled = false;
          saveButton.disabled = !rangeRuntime.ready || !rangeRuntime.rangeEditing;
        }
      }
    }
  });
  closeButton.addEventListener("click", () => {
    if (!saving) {
      close();
    }
  });
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    if (!saving) {
      close();
    }
  });
  reloadButton.addEventListener("click", mountEditor);
  window.addEventListener("pagehide", close);
  dialog.showModal();
  document.dispatchEvent(new Event("hb-i3d-preview-scope"));
  mountEditor();
  unsubscribeAccess = subscribeInteraction3dAccess(access => {
    if (!access.allowed && ["denied", "unavailable"].includes(access.status)) {
      close();
    }
  });
  if (closed) {
    unsubscribeAccess();
  }
  return {
    close,
    ready: readyPromise
  };
}
