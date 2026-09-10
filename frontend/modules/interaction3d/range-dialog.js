import { mountInteraction3d } from "./runtime.js?v=20260909-preview-sleep-v1";
import { requestInteraction3dAccess, subscribeInteraction3dAccess } from "/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1";
export async function openInteraction3dRangeEditor({
  component: properties,
  document: panelDocument,
  states,
  onSave: arg4,
  onClose: arg5 = () => {}
}) {
  await requestInteraction3dAccess();
  if (!properties.properties?.sceneId) {
    throw new Error("请先载入 3D 户型。");
  }
  if (properties.properties.lightingMode !== "region") {
    throw new Error("请先选择轻量柔光模式。");
  }
  const properties2 = structuredClone(properties);
  const isConnected = document.activeElement;
  const value5 = (arg3, element = "", element2 = "") => {
    const className = document.createElement(arg3);
    className.className = element;
    className.textContent = element2;
    return className;
  };
  const rel = value5("link");
  rel.rel = "stylesheet";
  rel.href = "/api/v1/modules/interaction3d/runtime.css?v=20260909-curtain-action-v15";
  document.head.append(rel);
  const setAttribute = value5("dialog", "i3d-editor i3d-range-dialog");
  setAttribute.setAttribute("aria-label", "照射范围");
  setAttribute.setAttribute("data-i3d-preview-scope", "");
  const append = value5("header");
  const disabled = value5("button", "primary", "保存");
  const disabled2 = value5("button", "i3d-range-close", "×");
  disabled2.setAttribute("aria-label", "关闭照射范围");
  disabled2.title = "关闭";
  disabled.type = disabled2.type = "button";
  disabled.disabled = true;
  const textContent = value5("p", "i3d-range-status", "正在准备平面户型…");
  textContent.setAttribute("role", "status");
  const hidden = value5("button", "", "重新载入");
  hidden.type = "button";
  hidden.hidden = true;
  const append2 = value5("div", "i3d-range-dialog-body");
  const value6 = value5("div");
  append.append(value5("strong", "", "照射范围"), hidden, disabled, disabled2);
  append2.append(value6);
  setAttribute.append(append, textContent, append2);
  document.body.append(setAttribute);
  let value7 = false;
  let value8 = false;
  let value9 = false;
  let openRangeEditor = null;
  let value10 = () => {};
  let value11 = 0;
  let value12 = 0;
  let value13;
  let value14;
  const rejectFn = new Promise((arg, arg2) => {
    value13 = arg;
    value14 = arg2;
  });
  rejectFn.catch(() => {});
  function close() {
    if (!value7) {
      value7 = true;
      value11++;
      value10();
      openRangeEditor?.();
      value14(new Error("照射范围编辑已关闭。"));
      window.removeEventListener("pagehide", close);
      setAttribute.close();
      setAttribute.remove();
      rel.remove();
      document.dispatchEvent(new Event("hb-i3d-preview-scope"));
      if (isConnected?.isConnected) {
        isConnected.focus();
      }
      arg5();
    }
  }
  function onLoadError(message2) {
    if (!value7) {
      disabled.disabled = true;
      hidden.hidden = false;
      textContent.textContent = message2.message || "照射范围载入失败，请重试。";
      textContent.classList.add("is-error");
      value14(message2);
    }
  }
  function fn() {
    const value4 = ++value11;
    value9 = false;
    openRangeEditor?.();
    disabled.disabled = true;
    hidden.hidden = true;
    textContent.classList.remove("is-error");
    textContent.textContent = "正在准备平面户型…";
    openRangeEditor = mountInteraction3d(value6, {
      component: properties2,
      context: {
        document: panelDocument,
        states
      },
      editing: true,
      rangeEditorOnly: true,
      async onPresented() {
        try {
          await openRangeEditor.openRangeEditor();
          if (value7 || value4 !== value11) {
            return;
          }
          value9 = true;
          disabled.disabled = false;
          textContent.textContent = "选择灯具，可切换圆形或方形；拖动边界调整范围，保存后生效。";
          value13();
        } catch (value) {
          if (value4 === value11) {
            onLoadError(value);
          }
        }
      },
      onLoadError,
      onEdit(action) {
        if (!value7 && value4 === value11) {
          if (action.action === "light-region-overrides") {
            const lightRegionOverrides = structuredClone(action.overrides || {});
            if (JSON.stringify(lightRegionOverrides) !== JSON.stringify(properties2.properties.lightRegionOverrides || {})) {
              value12++;
              if (!value8) {
                textContent.textContent = "范围已修改，点击保存应用。";
                textContent.classList.remove("is-error");
              }
            }
            properties2.properties.lightRegionOverrides = lightRegionOverrides;
          }
          if (action.action === "range-editor-state" && action.error) {
            onLoadError(new Error(action.error));
          } else if (action.action === "range-editor-state" && !action.active && value9 && !value8) {
            close();
          }
        }
      }
    });
  }
  disabled.addEventListener("click", async () => {
    if (!value7 && !value8 && !!value9 && !disabled.disabled) {
      value8 = true;
      disabled.disabled = true;
      disabled2.disabled = true;
      hidden.hidden = true;
      textContent.textContent = "正在保存范围…";
      try {
        await openRangeEditor.flushRangeEditor();
        const value2 = structuredClone(properties2.properties.lightRegionOverrides || {});
        const value3 = value12;
        await requestInteraction3dAccess();
        if (value7) {
          return;
        }
        await arg4(value2);
        if (!value7) {
          textContent.textContent = value3 === value12 ? "已保存到灯光配置，可继续调整。关闭后点击“保存配置”完成保存。" : "已保存，另有新修改待保存。";
          textContent.classList.remove("is-error");
        }
      } catch (message) {
        if (value7) {
          return;
        }
        textContent.textContent = message.message || "保存失败，请重试。";
        textContent.classList.add("is-error");
      } finally {
        value8 = false;
        if (!value7) {
          disabled2.disabled = false;
          disabled.disabled = !openRangeEditor.ready || !openRangeEditor.rangeEditing;
        }
      }
    }
  });
  disabled2.addEventListener("click", () => {
    if (!value8) {
      close();
    }
  });
  setAttribute.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    if (!value8) {
      close();
    }
  });
  hidden.addEventListener("click", fn);
  window.addEventListener("pagehide", close);
  setAttribute.showModal();
  document.dispatchEvent(new Event("hb-i3d-preview-scope"));
  fn();
  value10 = subscribeInteraction3dAccess(allowed => {
    if (!allowed.allowed && ["denied", "unavailable"].includes(allowed.status)) {
      close();
    }
  });
  if (value7) {
    value10();
  }
  return {
    close,
    ready: rejectFn
  };
}
