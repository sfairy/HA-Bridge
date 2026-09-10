import { mapCorners, mapSource } from "./vacuum-map.js?v=20260909-curtain-action-v15";
export function openVacuumMapEditor({
  item,
  floor: plan,
  onSave
}) {
  const doc = window.document;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const createEl = (tag, text) => {
    const el = doc.createElement(tag);
    if (text) {
      el.textContent = text;
    }
    return el;
  };
  const createSvg = (tag, attrs = {}) => {
    const el = doc.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, value);
    }
    return el;
  };
  const walls = plan?.plan?.walls || [];
  const wallPoints = walls.flatMap(wall => [wall.start, wall.end]);
  const minX = wallPoints.length ? Math.min(...wallPoints.map(point => point.x)) : 0;
  const minY = wallPoints.length ? Math.min(...wallPoints.map(point => point.y)) : 0;
  const planWidth = Math.max(100, wallPoints.length ? Math.max(...wallPoints.map(point => point.x)) - minX : 1000);
  const planDepth = Math.max(100, wallPoints.length ? Math.max(...wallPoints.map(point => point.y)) - minY : 1000);
  const defaultMap = {
    x: minX + planWidth / 2,
    y: minY + planDepth / 2,
    width: planWidth,
    depth: planDepth,
    rotation: 0,
    opacity: 45,
    visible: true
  };
  const draft = {
    map: {
      ...defaultMap,
      ...structuredClone(item.map || {})
    }
  };
  const dialog = createEl("dialog");
  dialog.className = "i3d-vacuum-map-editor";
  dialog.setAttribute("aria-label", "底图对齐");
  const header = createEl("header");
  const titleEl = createEl("strong", (plan?.name || "当前楼层") + " · 底图对齐");
  const statusEl = createEl("span");
  statusEl.setAttribute("role", "status");
  let closed = false;
  let drag = null;
  const close = () => {
    if (!closed) {
      closed = true;
      resizeObserver.disconnect();
      dialog.close();
      dialog.remove();
    }
  };
  const createButton = (label, onClick) => {
    const button = createEl("button", label);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const saveButton = createButton("保存", () => {
    onSave(structuredClone(draft));
    statusEl.textContent = "已应用，最后保存扫地机配置";
  });
  saveButton.className = "primary";
  const closeButton = createButton("×", close);
  closeButton.setAttribute("aria-label", "关闭底图对齐");
  header.append(titleEl, statusEl, saveButton, closeButton);
  const body = createEl("div");
  body.className = "i3d-vacuum-map-body";
  const planPane = createEl("div");
  planPane.className = "i3d-vacuum-plan";
  const pad = Math.max(planWidth, planDepth) * 0.12;
  const svg = createSvg("svg", {
    viewBox: minX - pad + " " + (minY - pad) + " " + (planWidth + pad * 2) + " " + (planDepth + pad * 2),
    role: "img",
    "aria-label": "户型平面与扫地机地图"
  });
  let viewBox = {
    x: minX - pad,
    y: minY - pad,
    width: planWidth + pad * 2,
    height: planDepth + pad * 2
  };
  const applyViewBox = () => {
    svg.setAttribute("viewBox", viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height);
    render();
  };
  const scaleMap = factor => {
    const map = draft.map;
    const clamped = Math.max(0.01 / Math.min(map.width, map.depth), Math.min(1000000 / Math.max(map.width, map.depth), factor));
    map.width *= clamped;
    map.depth *= clamped;
    render();
  };
  const scaleView = factor => {
    const nextWidth = Math.max(planWidth * 0.15, Math.min(planWidth * 10, viewBox.width * factor));
    const ratio = nextWidth / viewBox.width;
    viewBox = {
      x: viewBox.x + (viewBox.width - nextWidth) / 2,
      y: viewBox.y + viewBox.height * (1 - ratio) / 2,
      width: nextWidth,
      height: viewBox.height * ratio
    };
    applyViewBox();
  };
  const mapImage = createSvg("image", {
    preserveAspectRatio: "none"
  });
  const wallsGroup = createSvg("g");
  const handlesGroup = createSvg("g");
  for (const wall of walls) {
    wallsGroup.append(createSvg("line", {
      x1: wall.start.x,
      y1: wall.start.y,
      x2: wall.end.x,
      y2: wall.end.y,
      stroke: "#9fa9bc",
      "stroke-width": Math.max(2, wall.thickness || planWidth * 0.006),
      "vector-effect": "non-scaling-stroke",
      "pointer-events": "none"
    }));
  }
  svg.append(mapImage, wallsGroup, handlesGroup);
  planPane.append(svg);
  const viewTools = createEl("div");
  viewTools.className = "i3d-vacuum-view-tools";
  viewTools.append(createButton("地图 −", () => scaleMap(1 / 1.1)), createButton("地图 +", () => scaleMap(1.1)), createButton("视图 −", () => scaleView(1.2)), createButton("视图 +", () => scaleView(1 / 1.2)), createButton("显示全部", () => {
    const points = [...wallPoints, ...mapCorners(draft.map)];
    const margin = Math.max(planWidth, planDepth) * 0.15;
    const fitMinX = Math.min(...points.map(point => point.x));
    const fitMinY = Math.min(...points.map(point => point.y));
    viewBox = {
      x: fitMinX - margin,
      y: fitMinY - margin,
      width: Math.max(...points.map(point => point.x)) - fitMinX + margin * 2,
      height: Math.max(...points.map(point => point.y)) - fitMinY + margin * 2
    };
    applyViewBox();
  }));
  planPane.append(viewTools);
  svg.addEventListener("wheel", event => {
    event.preventDefault();
    if (event.target.closest("[data-drag]")) {
      scaleMap(event.deltaY > 0 ? 1 / 1.08 : 1.08);
    } else {
      scaleView(event.deltaY > 0 ? 1.12 : 1 / 1.12);
    }
  }, {
    passive: false
  });
  const aside = createEl("aside");
  const noteEl = createEl("p", "拖动地图移动，拖角点缩放，拖圆点旋转；Shift 等比缩放。地图上滚轮或双指缩放地图，空白处滚轮缩放视图。");
  noteEl.className = "i3d-note";
  aside.append(noteEl);
  const addNumberField = (label, target, key, min, max, step = 1, parent = aside) => {
    const labelEl = createEl("label");
    const caption = createEl("span", label);
    const input = createEl("input");
    Object.assign(input, {
      type: "number",
      min,
      max,
      step: "any",
      value: target[key]
    });
    input.dataset.numberStep = String(step);
    input.setAttribute("aria-label", label);
    input.addEventListener("change", () => {
      const next = Number(input.value);
      if (!Number.isFinite(next) || input.value.trim() === "") {
        input.value = target[key];
        return;
      }
      target[key] = Math.max(min, Math.min(max, next));
      input.value = target[key];
      render();
    });
    labelEl.append(caption, input);
    parent.append(labelEl);
    return input;
  };
  const fieldInputs = new Map();
  for (const [label, key, min, max] of [["位置 X", "x", -1000000, 1000000], ["位置 Y", "y", -1000000, 1000000], ["宽度", "width", 0.01, 1000000], ["高度", "depth", 0.01, 1000000], ["旋转角度", "rotation", -360, 360], ["地图显示强度（%）", "opacity", 0, 100]]) {
    fieldInputs.set(key, addNumberField(label, draft.map, key, min, max, key === "rotation" ? 0.5 : 1));
  }
  const visibleLabel = createEl("label");
  const visibleCheckbox = createEl("input");
  visibleLabel.className = "i3d-setting-toggle";
  visibleCheckbox.type = "checkbox";
  visibleCheckbox.checked = draft.map.visible;
  visibleCheckbox.setAttribute("aria-label", "显示地图");
  visibleCheckbox.addEventListener("change", () => {
    draft.map.visible = visibleCheckbox.checked;
    render();
  });
  visibleLabel.append(createEl("span", "显示地图"), visibleCheckbox);
  aside.append(visibleLabel);
  aside.append(createButton("重置地图位置", () => {
    Object.assign(draft.map, defaultMap);
    visibleCheckbox.checked = true;
    render();
  }));
  const mapNote = createEl("p", draft.map.entityId ? "" : "尚未选择地图；仍可放置房间快捷按钮。");
  mapNote.className = "i3d-note";
  mapImage.addEventListener("error", () => {
    mapNote.textContent = "地图暂时无法载入，请检查地图实体；已保存的位置会保留。";
  });
  if (draft.map.entityId) {
    mapImage.setAttribute("href", mapSource(draft.map.entityId));
  }
  aside.append(mapNote);
  function render() {
    const map = draft.map;
    const handleRadius = 1 / Math.max(0.001, svg.getScreenCTM()?.a || 1);
    for (const [key, input] of fieldInputs) {
      if (doc.activeElement !== input) {
        input.value = Number(map[key].toFixed(2));
      }
    }
    for (const [name, value] of Object.entries({
      x: map.x - map.width / 2,
      y: map.y - map.depth / 2,
      width: map.width,
      height: map.depth,
      opacity: map.opacity / 100,
      transform: "rotate(" + map.rotation + " " + map.x + " " + map.y + ")"
    })) {
      mapImage.setAttribute(name, value);
    }
    mapImage.style.display = map.visible === false ? "none" : "";
    handlesGroup.replaceChildren();
    const corners = mapCorners(map);
    handlesGroup.append(createSvg("polygon", {
      points: corners.map(point => point.x + "," + point.y).join(" "),
      fill: "transparent",
      stroke: "#73b3ff",
      "stroke-width": 1.5,
      "vector-effect": "non-scaling-stroke",
      "data-drag": "map"
    }));
    corners.forEach((point, index) => handlesGroup.append(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: handleRadius * 8,
      fill: "#73b3ff",
      "data-drag": "corner:" + index
    })));
    const radians = map.rotation * Math.PI / 180;
    const rotateOffset = map.depth / 2 + Math.max(planWidth, planDepth) * 0.055;
    handlesGroup.append(createSvg("circle", {
      cx: map.x + Math.sin(radians) * rotateOffset,
      cy: map.y - Math.cos(radians) * rotateOffset,
      r: handleRadius * 10,
      fill: "#b8e77b",
      "data-drag": "rotate"
    }));
  }
  const clientToSvg = event => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  };
  const pointers = new Map();
  let pinch = null;
  svg.addEventListener("pointerdown", event => {
    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    });
    if (pointers.size === 2) {
      event.preventDefault();
      const [a, b] = [...pointers.values()];
      pinch = {
        distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        width: draft.map.width,
        depth: draft.map.depth
      };
      drag = null;
      svg.setPointerCapture(event.pointerId);
      return;
    }
    const dragKind = event.target.closest("[data-drag]")?.getAttribute("data-drag");
    if (event.button === 0) {
      event.preventDefault();
      drag = {
        kind: dragKind || "pan",
        start: clientToSvg(event),
        viewBox: {
          ...viewBox
        },
        clientX: event.clientX,
        clientY: event.clientY,
        map: {
          ...draft.map
        }
      };
      svg.setPointerCapture(event.pointerId);
    }
  });
  svg.addEventListener("pointermove", event => {
    if (pointers.has(event.pointerId)) {
      pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });
    }
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const scale = Math.max(0.01 / Math.min(pinch.width, pinch.depth), Math.min(1000000 / Math.max(pinch.width, pinch.depth), Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance));
      draft.map.width = pinch.width * scale;
      draft.map.depth = pinch.depth * scale;
      render();
      return;
    }
    if (!drag) {
      return;
    }
    const point = clientToSvg(event);
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;
    const map = draft.map;
    const startMap = drag.map;
    if (drag.kind === "pan") {
      const screenScale = svg.getScreenCTM().a;
      viewBox = {
        ...drag.viewBox,
        x: drag.viewBox.x - (event.clientX - drag.clientX) / screenScale,
        y: drag.viewBox.y - (event.clientY - drag.clientY) / screenScale
      };
      applyViewBox();
      return;
    }
    if (drag.kind === "map") {
      map.x = startMap.x + dx;
      map.y = startMap.y + dy;
    } else if (drag.kind === "rotate") {
      map.rotation = Math.atan2(point.x - startMap.x, startMap.y - point.y) * 180 / Math.PI;
    } else {
      const cornerIndex = Number(drag.kind.split(":")[1]);
      const cornerSign = [[-1, -1], [1, -1], [1, 1], [-1, 1]][cornerIndex];
      const radians = startMap.rotation * Math.PI / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      let width = Math.max(0.01, startMap.width + (dx * cos + dy * sin) * cornerSign[0]);
      let depth = Math.max(0.01, startMap.depth + (-dx * sin + dy * cos) * cornerSign[1]);
      if (event.shiftKey) {
        const uniform = Math.max(width / startMap.width, depth / startMap.depth);
        width = startMap.width * uniform;
        depth = startMap.depth * uniform;
      }
      map.width = width;
      map.depth = depth;
      map.x = startMap.x + ((width - startMap.width) * cornerSign[0] * cos - (depth - startMap.depth) * cornerSign[1] * sin) / 2;
      map.y = startMap.y + ((width - startMap.width) * cornerSign[0] * sin + (depth - startMap.depth) * cornerSign[1] * cos) / 2;
    }
    render();
  });
  for (const eventName of ["pointerup", "pointercancel"]) {
    svg.addEventListener(eventName, event => {
      pointers.delete(event.pointerId);
      pinch = null;
      drag = null;
    });
  }
  const resizeObserver = new ResizeObserver(() => {
    if (!closed) {
      render();
    }
  });
  body.append(planPane, aside);
  dialog.append(header, body);
  doc.body.append(dialog);
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });
  dialog.showModal();
  viewTools.lastElementChild.click();
  resizeObserver.observe(svg);
  return {
    close
  };
}
