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
  const runCommand = async (command, payload) => {
    if (!!presented && !busy) {
      busy = true;
      actionButtons.forEach(btn => btn.disabled = true);
      try {
        const result = await focusCommand.focusCommand(command, "presence:" + item.id, payload);
        if (closed) {
          return;
        }
        if (command === "save-light-camera") {
          onSave(result.camera);
          close();
        } else {
          status.textContent = "拖动旋转，滚轮缩放；调整完成后保存此视角。";
        }
      } catch (error) {
        status.textContent = error.message;
      } finally {
        busy = false;
        actionButtons.forEach(btn => btn.disabled = false);
      }
    }
  };
  const saveBtn = button("保存此视角", () => runCommand("save-light-camera"));
  saveBtn.className = "primary";
  header.append(el("strong", "人在传感器 · 聚焦视角"), saveBtn, button("取消", close));
  const projectionActions = el("div");
  projectionActions.className = "i3d-focus-actions";
  projectionActions.append(button("正交", () => runCommand("focus-projection", "orthographic")), button("透视", () => runCommand("focus-projection", "perspective")));
  aside.append(status, projectionActions, el("p", "此视角用于点击小人后的聚焦展示，不弹出控制面板。"));
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
