import { mountInteraction3d } from "./runtime.js";
import { interaction3dPreviewSize } from "/bridge-static/modules/interaction3d/preview-layout.js?v=20260906-i3d-preview-layout-v1-20260908-curtains-v1";
export function openPresenceFocusEditor({
  component,
  properties,
  item,
  panelDocument,
  onSave
}) {
  const doc = window.document;
  const el = (tag, text) => {
    const node = doc.createElement(tag);
    if (text) {
      node.textContent = text;
    }
    return node;
  };
  const dialog = el("dialog");
  dialog.className = "i3d-editor";
  dialog.setAttribute("aria-label", "人在传感器聚焦视角");
  dialog.dataset.i3dPreviewScope = "presence-focus";
  const header = el("header");
  const body = el("div");
  body.className = "i3d-editor-body";
  const view = el("div");
  const aside = el("aside");
  const status = el("p", "正在加载户型…");
  view.className = "i3d-editor-view";
  const aspect = el("div");
  const stage = el("div");
  aspect.className = "i3d-editor-aspect";
  stage.className = "i3d-editor-stage";
  aspect.append(stage);
  view.append(aspect);
  const syncAspectSize = () => {
    const size = interaction3dPreviewSize(component, panelDocument, view.clientWidth, view.clientHeight);
    Object.assign(aspect.style, {
      width: size.width + "px",
      height: size.height + "px"
    });
  };
  const resizeObserver = new ResizeObserver(syncAspectSize);
  resizeObserver.observe(view);
  let focusCommand;
  let presented = false;
  let closed = false;
  let busy = false;
  let cameraState = null;
  let commandQueue = Promise.resolve();
  const actionButtons = [];
  const button = (label, onClick) => {
    const btn = el("button", label);
    btn.type = "button";
    btn.addEventListener("click", onClick);
    actionButtons.push(btn);
    return btn;
  };
  const close = () => {
    if (!closed) {
      closed = true;
      resizeObserver.disconnect();
      focusCommand?.();
      dialog.close();
      dialog.remove();
      doc.dispatchEvent(new Event("hb-i3d-preview-scope"));
    }
  };
  const syncControls = () => {
    actionButtons.forEach(btn => {
      btn.disabled = !presented || busy;
    });
    focalInput.disabled = !presented || busy || cameraState?.mode !== "perspective";
    if (doc.activeElement !== focalInput) {
      focalInput.value = String(Math.round(cameraState?.focalLength || 50));
    }
    for (const [mode, btn] of projectionButtons) {
      btn.setAttribute("aria-pressed", String((cameraState?.mode || "orthographic") === mode));
    }
  };
  const runCommand = async (command, payload) => {
    if (!presented || busy || closed) {
      return;
    }
    const isFocalLength = command === "focus-focal-length";
    const previous = commandQueue;
    let release;
    commandQueue = new Promise(resolve => {
      release = resolve;
    });
    if (!isFocalLength) {
      busy = true;
      syncControls();
    }
    try {
      await previous;
      if (closed) {
        return;
      }
      const result = await focusCommand.focusCommand(command, "presence:" + item.id, payload);
      if (closed) {
        return;
      }
      result?.camera && (cameraState = result.camera);
      if (command === "save-light-camera") {
        onSave(result.camera);
        close();
      } else {
        status.textContent = "拖动旋转，滚轮缩放；调整完成后保存此视角。";
      }
    } catch (error) {
      if (!closed) {
        status.textContent = error.message;
      }
    } finally {
      release();
      if (!isFocalLength) {
        busy = false;
      }
      if (!closed) {
        syncControls();
      }
    }
  };
  const saveBtn = button("保存此视角", () => runCommand("save-light-camera"));
  saveBtn.className = "primary";
  header.append(el("strong", "人在传感器 · 聚焦视角"), saveBtn, button("取消", close));
  const projectionActions = el("div");
  projectionActions.className = "i3d-focus-actions";
  projectionActions.setAttribute("role", "group");
  projectionActions.setAttribute("aria-label", "聚焦投影");
  const projectionButtons = new Map();
  for (const [mode, label] of [["orthographic", "正交"], ["perspective", "透视"]]) {
    const projectionBtn = button(label, () => runCommand("focus-projection", mode));
    projectionButtons.set(mode, projectionBtn);
    projectionActions.append(projectionBtn);
  }
  const focalInput = el("input");
  Object.assign(focalInput, {
    type: "number",
    min: "18",
    max: "120",
    step: "1",
    value: "50"
  });
  focalInput.setAttribute("aria-label", "焦段（mm）");
  focalInput.addEventListener("change", () => {
    const value = Number(focalInput.value);
    if (!focalInput.value.trim() || !Number.isFinite(value)) {
      focalInput.value = String(cameraState?.focalLength || 50);
      return;
    }
    focalInput.value = String(Math.max(18, Math.min(120, value)));
    runCommand("focus-focal-length", Number(focalInput.value));
  });
  const focalField = el("label");
  focalField.append(el("span", "焦段（mm）"), focalInput);
  syncControls();
  aside.append(status, projectionActions, focalField, el("p", "此视角用于点击小人后的聚焦展示，不弹出控制面板。"));
  body.append(view, aside);
  dialog.append(header, body);
  doc.body.append(dialog);
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });
  dialog.showModal();
  syncAspectSize();
  const security = structuredClone(properties);
  security.security = {
    presenceSensors: [structuredClone(item)]
  };
  security.floorSelection = item.floorId;
  security.camera = security.floorCameras?.[item.floorId] || (properties.floorSelection === item.floorId ? properties.camera : null);
  focusCommand = mountInteraction3d(stage, {
    component: {
      ...component,
      properties: security
    },
    context: {
      document: panelDocument,
      editable: true
    },
    editing: true,
    editingModule: "security",
    onPresented: () => {
      if (!presented && !closed) {
        presented = true;
        runCommand("edit-light-camera");
      }
    },
    onLoadError: error => {
      status.textContent = error.message || String(error);
    }
  });
  doc.dispatchEvent(new Event("hb-i3d-preview-scope"));
}
