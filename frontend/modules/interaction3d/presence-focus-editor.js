import { mountInteraction3d } from "./runtime.js";
import { interaction3dPreviewSize } from "/bridge-static/modules/interaction3d/preview-layout.js?v=20260906-i3d-preview-layout-v1-20260908-curtains-v1";
export function openPresenceFocusEditor({
  component: arg6,
  properties: floorSelection,
  item: floorId,
  panelDocument,
  onSave: arg7
}) {
  const dispatchEvent = window.document;
  const value = (arg, element) => {
    const textContent = dispatchEvent.createElement(arg);
    if (element) {
      textContent.textContent = element;
    }
    return textContent;
  };
  const className = value("dialog");
  className.className = "i3d-editor";
  className.setAttribute("aria-label", "人在传感器聚焦视角");
  className.dataset.i3dPreviewScope = "presence-focus";
  const append = value("header");
  const className2 = value("div");
  className2.className = "i3d-editor-body";
  const className3 = value("div");
  const append2 = value("aside");
  const textContent2 = value("p", "正在加载户型…");
  className3.className = "i3d-editor-view";
  const className4 = value("div");
  const className5 = value("div");
  className4.className = "i3d-editor-aspect";
  className5.className = "i3d-editor-stage";
  className4.append(className5);
  className3.append(className4);
  const value2 = () => {
    const width = interaction3dPreviewSize(arg6, panelDocument, className3.clientWidth, className3.clientHeight);
    Object.assign(className4.style, {
      width: width.width + "px",
      height: width.height + "px"
    });
  };
  const observe = new ResizeObserver(value2);
  observe.observe(className3);
  let focusCommand;
  let value3 = false;
  let value4 = false;
  let value5 = false;
  const forEach = [];
  const value6 = (arg2, arg3) => {
    const type = value("button", arg2);
    type.type = "button";
    type.addEventListener("click", arg3);
    forEach.push(type);
    return type;
  };
  const value7 = () => {
    if (!value4) {
      value4 = true;
      observe.disconnect();
      focusCommand?.();
      className.close();
      className.remove();
      dispatchEvent.dispatchEvent(new Event("hb-i3d-preview-scope"));
    }
  };
  const value8 = async (arg4, arg5) => {
    if (!!value3 && !value5) {
      value5 = true;
      forEach.forEach(disabled2 => disabled2.disabled = true);
      try {
        const camera = await focusCommand.focusCommand(arg4, "presence:" + floorId.id, arg5);
        if (value4) {
          return;
        }
        if (arg4 === "save-light-camera") {
          arg7(camera.camera);
          value7();
        } else {
          textContent2.textContent = "拖动旋转，滚轮缩放；调整完成后保存此视角。";
        }
      } catch (message) {
        textContent2.textContent = message.message;
      } finally {
        value5 = false;
        forEach.forEach(disabled => disabled.disabled = false);
      }
    }
  };
  const className6 = value6("保存此视角", () => value8("save-light-camera"));
  className6.className = "primary";
  append.append(value("strong", "人在传感器 · 聚焦视角"), className6, value6("取消", value7));
  const className7 = value("div");
  className7.className = "i3d-focus-actions";
  className7.append(value6("正交", () => value8("focus-projection", "orthographic")), value6("透视", () => value8("focus-projection", "perspective")));
  append2.append(textContent2, className7, value("p", "此视角用于点击小人后的聚焦展示，不弹出控制面板。"));
  className2.append(className3, append2);
  className.append(append, className2);
  dispatchEvent.body.append(className);
  className.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    value7();
  });
  className.showModal();
  value2();
  const security = structuredClone(floorSelection);
  security.security = {
    presenceSensors: [structuredClone(floorId)]
  };
  security.floorSelection = floorId.floorId;
  security.camera = security.floorCameras?.[floorId.floorId] || (floorSelection.floorSelection === floorId.floorId ? floorSelection.camera : null);
  focusCommand = mountInteraction3d(className5, {
    component: {
      ...arg6,
      properties: security
    },
    context: {
      document: panelDocument,
      editable: true
    },
    editing: true,
    editingModule: "security",
    onPresented: () => {
      if (!value3 && !value4) {
        value3 = true;
        value8("edit-light-camera");
      }
    },
    onLoadError: message2 => {
      textContent2.textContent = message2.message || String(message2);
    }
  });
  dispatchEvent.dispatchEvent(new Event("hb-i3d-preview-scope"));
}
