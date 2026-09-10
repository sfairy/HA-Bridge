import { mapCorners, mapSource } from "./vacuum-map.js?v=20260909-curtain-action-v15";
export function openVacuumMapEditor({
  item: map3,
  floor: plan,
  onSave: arg13
}) {
  const createElement = window.document;
  const value33 = "http://www.w3.org/2000/svg";
  const value34 = (arg2, element) => {
    const textContent = createElement.createElement(arg2);
    if (element) {
      textContent.textContent = element;
    }
    return textContent;
  };
  const value35 = (arg3, arg4 = {}) => {
    const setAttribute = createElement.createElementNS(value33, arg3);
    for (const [value10, value11] of Object.entries(arg4)) {
      setAttribute.setAttribute(value10, value11);
    }
    return setAttribute;
  };
  const flatMap = plan?.plan?.walls || [];
  const length = flatMap.flatMap(start => [start.start, start.end]);
  const value36 = length.length ? Math.min(...length.map(x5 => x5.x)) : 0;
  const value37 = length.length ? Math.min(...length.map(y4 => y4.y)) : 0;
  const width6 = Math.max(100, length.length ? Math.max(...length.map(x4 => x4.x)) - value36 : 1000);
  const depth2 = Math.max(100, length.length ? Math.max(...length.map(y3 => y3.y)) - value37 : 1000);
  const value38 = {
    x: value36 + width6 / 2,
    y: value37 + depth2 / 2,
    width: width6,
    depth: depth2,
    rotation: 0,
    opacity: 45,
    visible: true
  };
  const map4 = {
    map: {
      ...value38,
      ...structuredClone(map3.map || {})
    }
  };
  const className = value34("dialog");
  className.className = "i3d-vacuum-map-editor";
  className.setAttribute("aria-label", "底图对齐");
  const append3 = value34("header");
  const value39 = value34("strong", (plan?.name || "当前楼层") + " · 底图对齐");
  const setAttribute2 = value34("span");
  setAttribute2.setAttribute("role", "status");
  let value40 = false;
  let kind = null;
  const close = () => {
    if (!value40) {
      value40 = true;
      disconnect.disconnect();
      className.close();
      className.remove();
    }
  };
  const value41 = (arg5, arg6) => {
    const type = value34("button", arg5);
    type.type = "button";
    type.addEventListener("click", arg6);
    return type;
  };
  const className2 = value41("保存", () => {
    arg13(structuredClone(map4));
    setAttribute2.textContent = "已应用，最后保存扫地机配置";
  });
  className2.className = "primary";
  const setAttribute3 = value41("×", close);
  setAttribute3.setAttribute("aria-label", "关闭底图对齐");
  append3.append(value39, setAttribute2, className2, setAttribute3);
  const className3 = value34("div");
  className3.className = "i3d-vacuum-map-body";
  const append4 = value34("div");
  append4.className = "i3d-vacuum-plan";
  const value42 = Math.max(width6, depth2) * 0.12;
  const addEventListener = value35("svg", {
    viewBox: value36 - value42 + " " + (value37 - value42) + " " + (width6 + value42 * 2) + " " + (depth2 + value42 * 2),
    role: "img",
    "aria-label": "户型平面与扫地机地图"
  });
  let width7 = {
    x: value36 - value42,
    y: value37 - value42,
    width: width6 + value42 * 2,
    height: depth2 + value42 * 2
  };
  const value43 = () => {
    addEventListener.setAttribute("viewBox", width7.x + " " + width7.y + " " + width7.width + " " + width7.height);
    fn();
  };
  const value44 = arg7 => {
    const width2 = map4.map;
    const width3 = Math.max(0.01 / Math.min(width2.width, width2.depth), Math.min(1000000 / Math.max(width2.width, width2.depth), arg7));
    width2.width *= width3;
    width2.depth *= width3;
    fn();
  };
  const value45 = arg8 => {
    const width4 = Math.max(width6 * 0.15, Math.min(width6 * 10, width7.width * arg8));
    const value15 = width4 / width7.width;
    width7 = {
      x: width7.x + (width7.width - width4) / 2,
      y: width7.y + width7.height * (1 - value15) / 2,
      width: width4,
      height: width7.height * value15
    };
    value43();
  };
  const setAttribute4 = value35("image", {
    preserveAspectRatio: "none"
  });
  const append5 = value35("g");
  const append6 = value35("g");
  for (const start2 of flatMap) {
    append5.append(value35("line", {
      x1: start2.start.x,
      y1: start2.start.y,
      x2: start2.end.x,
      y2: start2.end.y,
      stroke: "#9fa9bc",
      "stroke-width": Math.max(2, start2.thickness || width6 * 0.006),
      "vector-effect": "non-scaling-stroke",
      "pointer-events": "none"
    }));
  }
  addEventListener.append(setAttribute4, append5, append6);
  append4.append(addEventListener);
  const className4 = value34("div");
  className4.className = "i3d-vacuum-view-tools";
  className4.append(value41("地图 −", () => value44(1 / 1.1)), value41("地图 +", () => value44(1.1)), value41("视图 −", () => value45(1.2)), value41("视图 +", () => value45(1 / 1.2)), value41("显示全部", () => {
    const map = [...length, ...mapCorners(map4.map)];
    const value12 = Math.max(width6, depth2) * 0.15;
    const value13 = Math.min(...map.map(x2 => x2.x));
    const value14 = Math.min(...map.map(y2 => y2.y));
    width7 = {
      x: value13 - value12,
      y: value14 - value12,
      width: Math.max(...map.map(x => x.x)) - value13 + value12 * 2,
      height: Math.max(...map.map(y => y.y)) - value14 + value12 * 2
    };
    value43();
  }));
  append4.append(className4);
  addEventListener.addEventListener("wheel", deltaY => {
    deltaY.preventDefault();
    if (deltaY.target.closest("[data-drag]")) {
      value44(deltaY.deltaY > 0 ? 1 / 1.08 : 1.08);
    } else {
      value45(deltaY.deltaY > 0 ? 1.12 : 1 / 1.12);
    }
  }, {
    passive: false
  });
  const append7 = value34("aside");
  const className5 = value34("p", "拖动地图移动，拖角点缩放，拖圆点旋转；Shift 等比缩放。地图上滚轮或双指缩放地图，空白处滚轮缩放视图。");
  className5.className = "i3d-note";
  append7.append(className5);
  const value46 = (arg9, arg10, arg11, min, max, arg12 = 1, append = append7) => {
    const append2 = value34("label");
    const value16 = value34("span", arg9);
    const value17 = value34("input");
    Object.assign(value17, {
      type: "number",
      min,
      max,
      step: "any",
      value: arg10[arg11]
    });
    value17.dataset.numberStep = String(arg12);
    value17.setAttribute("aria-label", arg9);
    value17.addEventListener("change", () => {
      const value2 = Number(value17.value);
      if (!Number.isFinite(value2) || value17.value.trim() === "") {
        value17.value = arg10[arg11];
        return;
      }
      arg10[arg11] = Math.max(min, Math.min(max, value2));
      value17.value = arg10[arg11];
      fn();
    });
    append2.append(value16, value17);
    append.append(append2);
    return value17;
  };
  const set = new Map();
  for (const [value25, value26, value27, value28] of [["位置 X", "x", -1000000, 1000000], ["位置 Y", "y", -1000000, 1000000], ["宽度", "width", 0.01, 1000000], ["高度", "depth", 0.01, 1000000], ["旋转角度", "rotation", -360, 360], ["地图显示强度（%）", "opacity", 0, 100]]) {
    set.set(value26, value46(value25, map4.map, value26, value27, value28, value26 === "rotation" ? 0.5 : 1));
  }
  const className6 = value34("label");
  const checked = value34("input");
  className6.className = "i3d-setting-toggle";
  checked.type = "checkbox";
  checked.checked = map4.map.visible;
  checked.setAttribute("aria-label", "显示地图");
  checked.addEventListener("change", () => {
    map4.map.visible = checked.checked;
    fn();
  });
  className6.append(value34("span", "显示地图"), checked);
  append7.append(className6);
  append7.append(value41("重置地图位置", () => {
    Object.assign(map4.map, value38);
    checked.checked = true;
    fn();
  }));
  const className7 = value34("p", map4.map.entityId ? "" : "尚未选择地图；仍可放置房间快捷按钮。");
  className7.className = "i3d-note";
  setAttribute4.addEventListener("error", () => {
    className7.textContent = "地图暂时无法载入，请检查地图实体；已保存的位置会保留。";
  });
  if (map4.map.entityId) {
    setAttribute4.setAttribute("href", mapSource(map4.map.entityId));
  }
  append7.append(className7);
  function fn() {
    const x14 = map4.map;
    const value29 = 1 / Math.max(0.001, addEventListener.getScreenCTM()?.a || 1);
    for (const [value18, value19] of set) {
      if (createElement.activeElement !== value19) {
        value19.value = Number(x14[value18].toFixed(2));
      }
    }
    for (const [value20, value21] of Object.entries({
      x: x14.x - x14.width / 2,
      y: x14.y - x14.depth / 2,
      width: x14.width,
      height: x14.depth,
      opacity: x14.opacity / 100,
      transform: "rotate(" + x14.rotation + " " + x14.x + " " + x14.y + ")"
    })) {
      setAttribute4.setAttribute(value20, value21);
    }
    setAttribute4.style.display = x14.visible === false ? "none" : "";
    append6.replaceChildren();
    const map2 = mapCorners(x14);
    append6.append(value35("polygon", {
      points: map2.map(x3 => x3.x + "," + x3.y).join(" "),
      fill: "transparent",
      stroke: "#73b3ff",
      "stroke-width": 1.5,
      "vector-effect": "non-scaling-stroke",
      "data-drag": "map"
    }));
    map2.forEach((x10, arg) => append6.append(value35("circle", {
      cx: x10.x,
      cy: x10.y,
      r: value29 * 8,
      fill: "#73b3ff",
      "data-drag": "corner:" + arg
    })));
    const value30 = x14.rotation * Math.PI / 180;
    const value31 = x14.depth / 2 + Math.max(width6, depth2) * 0.055;
    append6.append(value35("circle", {
      cx: x14.x + Math.sin(value30) * value31,
      cy: x14.y - Math.cos(value30) * value31,
      r: value29 * 10,
      fill: "#b8e77b",
      "data-drag": "rotate"
    }));
  }
  const value47 = clientX => {
    const x11 = addEventListener.createSVGPoint();
    x11.x = clientX.clientX;
    x11.y = clientX.clientY;
    return x11.matrixTransform(addEventListener.getScreenCTM().inverse());
  };
  const set2 = new Map();
  let width8 = null;
  addEventListener.addEventListener("pointerdown", pointerId2 => {
    set2.set(pointerId2.pointerId, {
      x: pointerId2.clientX,
      y: pointerId2.clientY
    });
    if (set2.size === 2) {
      pointerId2.preventDefault();
      const [x6, x7] = [...set2.values()];
      width8 = {
        distance: Math.max(1, Math.hypot(x6.x - x7.x, x6.y - x7.y)),
        width: map4.map.width,
        depth: map4.map.depth
      };
      kind = null;
      addEventListener.setPointerCapture(pointerId2.pointerId);
      return;
    }
    const value22 = pointerId2.target.closest("[data-drag]")?.getAttribute("data-drag");
    if (pointerId2.button === 0) {
      pointerId2.preventDefault();
      kind = {
        kind: value22 || "pan",
        start: value47(pointerId2),
        viewBox: {
          ...width7
        },
        clientX: pointerId2.clientX,
        clientY: pointerId2.clientY,
        map: {
          ...map4.map
        }
      };
      addEventListener.setPointerCapture(pointerId2.pointerId);
    }
  });
  addEventListener.addEventListener("pointermove", pointerId3 => {
    if (set2.has(pointerId3.pointerId)) {
      set2.set(pointerId3.pointerId, {
        x: pointerId3.clientX,
        y: pointerId3.clientY
      });
    }
    if (width8 && set2.size === 2) {
      const [x8, x9] = [...set2.values()];
      const value8 = Math.max(0.01 / Math.min(width8.width, width8.depth), Math.min(1000000 / Math.max(width8.width, width8.depth), Math.hypot(x8.x - x9.x, x8.y - x9.y) / width8.distance));
      map4.map.width = width8.width * value8;
      map4.map.depth = width8.depth * value8;
      fn();
      return;
    }
    if (!kind) {
      return;
    }
    const x12 = value47(pointerId3);
    const value23 = x12.x - kind.start.x;
    const value24 = x12.y - kind.start.y;
    const x13 = map4.map;
    const width5 = kind.map;
    if (kind.kind === "pan") {
      const value9 = addEventListener.getScreenCTM().a;
      width7 = {
        ...kind.viewBox,
        x: kind.viewBox.x - (pointerId3.clientX - kind.clientX) / value9,
        y: kind.viewBox.y - (pointerId3.clientY - kind.clientY) / value9
      };
      value43();
      return;
    }
    if (kind.kind === "map") {
      x13.x = width5.x + value23;
      x13.y = width5.y + value24;
    } else if (kind.kind === "rotate") {
      x13.rotation = Math.atan2(x12.x - width5.x, width5.y - x12.y) * 180 / Math.PI;
    } else {
      const value3 = Number(kind.kind.split(":")[1]);
      const value4 = [[-1, -1], [1, -1], [1, 1], [-1, 1]][value3];
      const value5 = width5.rotation * Math.PI / 180;
      const value6 = Math.cos(value5);
      const value7 = Math.sin(value5);
      let width = Math.max(0.01, width5.width + (value23 * value6 + value24 * value7) * value4[0]);
      let depth = Math.max(0.01, width5.depth + (-value23 * value7 + value24 * value6) * value4[1]);
      if (pointerId3.shiftKey) {
        const value = Math.max(width / width5.width, depth / width5.depth);
        width = width5.width * value;
        depth = width5.depth * value;
      }
      x13.width = width;
      x13.depth = depth;
      x13.x = width5.x + ((width - width5.width) * value4[0] * value6 - (depth - width5.depth) * value4[1] * value7) / 2;
      x13.y = width5.y + ((width - width5.width) * value4[0] * value7 + (depth - width5.depth) * value4[1] * value6) / 2;
    }
    fn();
  });
  for (const value32 of ["pointerup", "pointercancel"]) {
    addEventListener.addEventListener(value32, pointerId => {
      set2.delete(pointerId.pointerId);
      width8 = null;
      kind = null;
    });
  }
  const disconnect = new ResizeObserver(() => {
    if (!value40) {
      fn();
    }
  });
  className3.append(append4, append7);
  className.append(append3, className3);
  createElement.body.append(className);
  className.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    close();
  });
  className.showModal();
  className4.lastElementChild.click();
  disconnect.observe(addEventListener);
  return {
    close
  };
}
