const Je = "http://www.w3.org/2000/svg";
const H = (arg38, arg39, arg40) => Math.max(arg39, Math.min(arg40, arg38));
const Y = (arg41, arg42 = 0) => Number.isFinite(Number(arg41)) ? Number(arg41) : arg42;
const T = arg43 => JSON.parse(JSON.stringify(arg43 || {}));
const B = arg44 => Math.round(arg44 * 100) / 100;
const Ye = (arg45, arg46) => JSON.stringify([String(arg45), String(arg46)]);
export function resizeRegionDimensions(width10, arg47, arg48, arg49, arg50 = false) {
  if (["n", "s"].includes(arg49)) {
    arg47 = width10.width;
  }
  if (["w", "e"].includes(arg49)) {
    arg48 = width10.depth;
  }
  if (arg50) {
    const value61 = arg47 / width10.width;
    const value62 = arg48 / width10.depth;
    let value63 = ["w", "e"].includes(arg49) ? value61 : ["n", "s"].includes(arg49) ? value62 : Math.abs(value61 - 1) >= Math.abs(value62 - 1) ? value61 : value62;
    value63 = H(value63, Math.max(0.5 / width10.width, 0.5 / width10.depth), Math.min(20 / width10.width, 20 / width10.depth));
    return {
      width: B(width10.width * value63),
      depth: B(width10.depth * value63)
    };
  }
  return {
    width: B(H(arg47, 0.5, 20)),
    depth: B(H(arg48, 0.5, 20))
  };
}
export function mountRegionRangeEditor(invalidateRegionLighting, {
  getConfig: arg51 = () => ({}),
  onChange: arg52 = () => {},
  onClose: arg53 = () => {},
  wake: arg54 = () => {},
  standalone: element4 = false
} = {}) {
  const createElement = invalidateRegionLighting.container.ownerDocument;
  const win = createElement.defaultView;
  const Vector3 = invalidateRegionLighting.THREE;
  const querySelector = createElement.createElement("section");
  querySelector.className = "plan2-range-editor";
  querySelector.dataset.testid = "range-editor";
  querySelector.hidden = true;
  querySelector.setAttribute("aria-label", "平面光区编辑");
  querySelector.innerHTML = "\n    <svg aria-label=\"灯具与照射范围\" role=\"group\"></svg>\n    <header class=\"p2r-top\"><div class=\"p2r-title\">平面光区编辑<small>拖动边角调整范围，按住 Shift 等比例缩放</small></div><span class=\"p2r-compact-caption\">自由拖动 · Shift 等比</span></header>\n    <div class=\"p2r-panel\">\n      <h3>照射范围</h3>\n      <div class=\"p2r-selectors\">\n        <label class=\"p2r-field\">楼层<select data-field=\"floor\" aria-label=\"楼层\"></select></label>\n        <label class=\"p2r-field\">灯具<select data-field=\"fixture\" aria-label=\"灯具\"></select></label>\n      </div>\n      <div class=\"p2r-grid\">\n        <label class=\"p2r-field p2r-shape\">光区形状<select data-field=\"shape\" aria-label=\"光区形状\"><option value=\"circle\">圆形</option><option value=\"square\">方形</option></select></label>\n        <label class=\"p2r-field\"><span data-width-label>宽度（米）</span><input data-field=\"width\" aria-label=\"宽度（米）\" type=\"number\" min=\"0.5\" max=\"20\" step=\"0.1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field\"><span data-depth-label>深度（米）</span><input data-field=\"depth\" aria-label=\"深度（米）\" type=\"number\" min=\"0.5\" max=\"20\" step=\"0.1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field p2r-rotation\">旋转（度）<input data-field=\"rotation\" aria-label=\"旋转（度）\" type=\"number\" min=\"-180\" max=\"180\" step=\"1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field p2r-soft-field\">边缘柔和度<span class=\"p2r-softness\"><input data-field=\"softness\" aria-label=\"边缘柔和度\" type=\"range\" min=\"5\" max=\"100\" step=\"1\"><output data-soft-value>35%</output></span></label>\n      </div>\n      <div class=\"p2r-options\">\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"moveCenter\" type=\"checkbox\">允许移动范围中心</label>\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"group\" type=\"checkbox\">同步本组范围</label>\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"preview\" type=\"checkbox\"><span data-preview-label>仅预览当前灯</span></label>\n      </div>\n      <div class=\"p2r-actions\"><button type=\"button\" data-action=\"reset-center\">中心回到灯位</button><button type=\"button\" data-action=\"reset\">恢复模型默认</button><button type=\"button\" class=\"p2r-done\" data-action=\"close\">完成</button></div>\n      <p class=\"p2r-status\" role=\"status\" aria-live=\"polite\"></p>\n    </div>\n    <div class=\"p2r-help\">外边界为光照衰减到零的位置 · 范围不代表墙体挡光</div>";
  querySelector.querySelector("[data-action=close]").hidden = element4;
  invalidateRegionLighting.container.append(querySelector);
  const addEventListener2 = querySelector.querySelector("svg");
  const getBoundingClientRect2 = querySelector.querySelector(".p2r-panel");
  const group = Object.fromEntries([...querySelector.querySelectorAll("[data-field]")].map(dataset => [dataset.dataset.field, dataset]));
  const textContent3 = querySelector.querySelector(".p2r-status");
  const value102 = querySelector.querySelector("[data-soft-value]");
  const close = mountRangeFormControls(querySelector);
  const setFromCamera = new Vector3.Raycaster();
  const set = new Vector3.Vector2();
  const constant = new Vector3.Plane(new Vector3.Vector3(0, 1, 0), 0);
  let value103 = false;
  let value104 = false;
  let value105 = {};
  let filter = [];
  let element5 = "";
  let element6 = "";
  let value106 = "";
  let value107 = null;
  let value108 = "";
  let value109 = true;
  let up = null;
  let point3 = null;
  let value110 = 0;
  let value111 = false;
  let value112 = false;
  let value113 = null;
  let value114 = 0;
  let value115 = 0;
  const value116 = () => invalidateRegionLighting.regionLighting;
  const value117 = () => filter.find(key9 => key9.key === element5);
  const value118 = arg9 => (invalidateRegionLighting.document?.floors || []).find(id4 => String(id4.id) === String(arg9));
  const value119 = groupId2 => groupId2 ? filter.filter(floorId5 => String(floorId5.floorId) === String(groupId2.floorId) && (groupId2.groupId ? floorId5.groupId === groupId2.groupId : floorId5.key === groupId2.key)) : [];
  const value120 = () => group.group.checked ? value119(value117()).map(key5 => key5.key) : value117() ? [element5] : [];
  function fn() {
    filter = (value116()?.listRegions?.() || []).map(floorId6 => {
      const scene = value118(floorId6.floorId);
      const lightGroupId = scene?.scene?.items?.find(id => String(id.id) === String(floorId6.id));
      const groupId = lightGroupId?.lightGroupId || "";
      const label = (arg51()?.lights || []).find(floorId => String(floorId.floorId) === String(floorId6.floorId) && floorId.groupId === groupId);
      const name = scene?.scene?.lightGroups?.find(id2 => id2.id === groupId);
      return {
        ...floorId6,
        key: floorId6.key || Ye(floorId6.floorId, floorId6.id),
        groupId,
        label: label?.label || name?.name || lightGroupId?.name || "灯具"
      };
    });
    for (const fixtureLabel of filter) {
      const length = value119(fixtureLabel);
      fixtureLabel.fixtureLabel = "" + fixtureLabel.label + (length.length > 1 ? " · " + (length.findIndex(key => key.key === fixtureLabel.key) + 1) + "/" + length.length : "");
    }
    const some = filter.filter(floorId7 => String(floorId7.floorId) === element6);
    if (!some.some(key6 => key6.key === element5)) {
      element5 = some[0]?.key || "";
    }
  }
  function fn2(element2, element3) {
    const value65 = createElement.createElement("option");
    value65.value = element2;
    value65.textContent = element3;
    return value65;
  }
  function fn3() {
    group.floor.replaceChildren(...(invalidateRegionLighting.document?.floors || []).map(id3 => fn2(String(id3.id), id3.name || "楼层")));
    group.floor.value = element6;
    group.fixture.replaceChildren(...filter.filter(floorId2 => String(floorId2.floorId) === element6).map(key3 => fn2(key3.key, key3.fixtureLabel)));
    group.fixture.value = element5;
    const moveCenterEnabled = value117();
    const value66 = !!moveCenterEnabled;
    const length2 = value119(moveCenterEnabled);
    for (const value52 of ["fixture", "shape", "width", "depth", "rotation", "softness", "preview", "moveCenter"]) {
      group[value52].disabled = !value66;
    }
    group.group.disabled = length2.length < 2;
    querySelector.querySelector("[data-preview-label]").textContent = group.group.checked && length2.length > 1 ? "仅预览当前灯组" : "仅预览当前灯";
    querySelector.querySelector("[data-action=reset]").disabled = !value66;
    querySelector.querySelector("[data-action=reset-center]").hidden = !moveCenterEnabled || !moveCenterEnabled.offsetX && !moveCenterEnabled.offsetZ;
    group.moveCenter.checked = moveCenterEnabled?.moveCenterEnabled === true;
    if (moveCenterEnabled) {
      group.shape.value = ["square", "strip"].includes(moveCenterEnabled.shape) ? "square" : "circle";
      for (const value20 of ["width", "depth", "rotation"]) {
        if (createElement.activeElement !== group[value20]) {
          group[value20].value = B(moveCenterEnabled[value20]);
        }
      }
      group.softness.value = Math.round(moveCenterEnabled.softness * 100);
      value102.value = group.softness.value + "%";
      textContent3.textContent = group.group.checked && length2.length > 1 ? "本组 " + length2.length + " 盏 · 修改会同步到各自灯位" : length2.length > 1 ? "本组 " + length2.length + " 盏 · 当前只调整这一盏" : moveCenterEnabled.moveCenterEnabled ? "拖动光区或中心十字移动范围 · 灯位不变" : "范围中心已锁定 · 可拖动边角调整大小";
    } else {
      textContent3.textContent = "当前楼层暂无可编辑灯具，请切换楼层。";
    }
    if (value106) {
      textContent3.textContent = "本次保存未成功：" + value106 + "。当前预览仍保留。";
      textContent3.style.color = "#ffc28d";
    } else {
      textContent3.style.removeProperty("color");
    }
    close.sync();
  }
  function fn4() {
    const value67 = group.preview.checked ? value120() : null;
    value116()?.setPreview?.(value67);
    invalidateRegionLighting.invalidateRegionLighting?.();
    arg54();
  }
  function fn5(arg17, arg18 = false) {
    if (value117()) {
      for (const value21 of value120()) {
        const width = filter.find(key2 => key2.key === value21);
        const shape = {
          width: width.width,
          depth: width.depth,
          rotation: width.rotation,
          softness: width.softness,
          shape: width.shape,
          offsetX: width.offsetX || 0,
          offsetZ: width.offsetZ || 0,
          moveCenterEnabled: width.moveCenterEnabled === true,
          ...(value105[value21] || {}),
          ...arg17
        };
        shape.shape = ["square", "strip"].includes(shape.shape) ? "square" : "circle";
        value105[value21] = shape;
      }
      value116()?.setOverrides?.(value105);
      invalidateRegionLighting.invalidateRegionLighting?.();
      arg54();
      fn();
      fn3();
      fn12();
      if (arg18) {
        fn6();
      }
    }
  }
  function fn6() {
    value105 = T(value116()?.getOverrides?.() || value105);
    arg52(T(value105));
  }
  function fn7(arg19, arg20, arg21) {
    const left = invalidateRegionLighting.canvas.getBoundingClientRect();
    const left2 = querySelector.getBoundingClientRect();
    const x3 = new Vector3.Vector3(arg19, arg20, arg21).project(invalidateRegionLighting.camera);
    return [left.left - left2.left + (x3.x + 1) * left.width / 2, left.top - left2.top + (1 - x3.y) * left.height / 2];
  }
  function fn8() {
    return Y(invalidateRegionLighting.worldPoint?.(element6, 0, 0, 0.065)?.y, 0.065);
  }
  function fn9(center2, arg22, arg23, arg24) {
    const [value68, value69] = center2.axis;
    return fn7(center2.center[0] + arg22 * value68 - arg23 * value69, arg24, center2.center[2] + arg22 * value69 + arg23 * value68);
  }
  function fn10(arg25, arg26, append4 = addEventListener2) {
    const setAttribute2 = createElement.createElementNS(Je, arg25);
    for (const [value53, value54] of Object.entries(arg26 || {})) {
      setAttribute2.setAttribute(value53, String(value54));
    }
    append4.append(setAttribute2);
    return setAttribute2;
  }
  function fn11(shape2, arg27, arg28 = 1) {
    const value70 = shape2.width * arg28 / 2;
    const value71 = shape2.depth * arg28 / 2;
    const push2 = [];
    if (shape2.shape === "square") {
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([arg, arg2], arg3) => {
        const value = fn9(shape2, arg * value70, arg2 * value71, arg27);
        return "" + (arg3 ? "L" : "M") + value[0].toFixed(2) + "," + value[1].toFixed(2);
      }).join("") + "Z";
    }
    for (let value55 = 0; value55 < 64; value55 += 1) {
      const value32 = value55 * Math.PI * 2 / 64;
      const value33 = Math.cos(value32);
      const value34 = Math.sin(value32);
      const value35 = Math.min(value70, value71);
      const value36 = shape2.shape === "strip" ? Math.sign(value33) * (value70 - value35) + value33 * value35 : value33 * value70;
      const value37 = shape2.shape === "strip" ? Math.sign(value34) * (value71 - value35) + value34 * value35 : value34 * value71;
      push2.push(fn9(shape2, value36, value37, arg27));
    }
    return push2.map((arg4, arg5) => "" + (arg5 ? "L" : "M") + arg4[0].toFixed(2) + "," + arg4[1].toFixed(2)).join("") + "Z";
  }
  function fn12() {
    if (!value103 || !invalidateRegionLighting.camera) {
      return;
    }
    invalidateRegionLighting.camera.updateMatrixWorld();
    const width6 = querySelector.getBoundingClientRect();
    const value72 = fn8();
    addEventListener2.setAttribute("viewBox", "0 0 " + (width6.width || 1) + " " + (width6.height || 1));
    addEventListener2.replaceChildren();
    const value73 = fn10("g");
    const value74 = fn10("g");
    const depth = value117();
    const has = new Set(value119(depth).map(key4 => key4.key));
    const value75 = filter.filter(floorId3 => String(floorId3.floorId) === element6).sort((key7, key8) => +(key7.key === element5) - +(key8.key === element5));
    for (const key11 of value75) {
      const value38 = key11.key === element5;
      const value39 = has.has(key11.key);
      if (value38 || value39) {
        fn10("path", {
          ...(value38 && key11.moveCenterEnabled ? {
            "data-range-handle": "move",
            cursor: "move"
          } : {}),
          d: fn11(key11, value72),
          fill: value38 ? "#edb06012" : "none",
          stroke: value38 ? "#f2b768" : "#99afc0",
          "stroke-width": value38 ? 1.6 : 1,
          "stroke-dasharray": value38 ? "none" : "4 4",
          opacity: value38 ? 1 : 0.45
        }, value73);
      }
      if (value38) {
        fn10("path", {
          d: fn11(key11, value72, Math.max(0.05, 1 - key11.softness)),
          fill: "none",
          stroke: "#efb56f",
          "stroke-width": 1,
          "stroke-dasharray": "3 5",
          opacity: 0.42
        }, value73);
      }
      const value40 = key11.lampCenter || key11.center;
      const [cx, cy] = fn7(value40[0], value72, value40[2]);
      const value41 = fn10("g", {
        "data-region-key": key11.key,
        role: "button",
        tabindex: "0",
        "aria-label": "选择" + key11.fixtureLabel
      }, value74);
      fn10("circle", {
        cx,
        cy,
        r: 12,
        fill: "transparent"
      }, value41);
      fn10("circle", {
        cx,
        cy,
        r: value38 ? 5 : 3.8,
        fill: value38 ? "#ffd498" : "#e9f0f5",
        stroke: value38 ? "#a87029" : "#536777",
        "stroke-width": 1.7,
        class: "p2r-marker"
      }, value41);
      const textContent = fn10("title", {}, value41);
      textContent.textContent = key11.fixtureLabel;
    }
    if (!depth) {
      return;
    }
    const value76 = fn9(depth, 0, 0, value72);
    const value77 = depth.lampCenter || depth.center;
    const value78 = fn7(value77[0], value72, value77[2]);
    if (depth.offsetX || depth.offsetZ) {
      fn10("line", {
        x1: value78[0],
        y1: value78[1],
        x2: value76[0],
        y2: value76[1],
        stroke: "#e8b76e",
        "stroke-width": 1,
        "stroke-dasharray": "4 4",
        "pointer-events": "none"
      });
    }
    if (depth.moveCenterEnabled) {
      const [cx2, cy2] = value76;
      const value42 = fn10("g", {
        "data-range-handle": "move",
        role: "button",
        tabindex: "0",
        "aria-label": "拖动光区中心",
        cursor: "move"
      });
      fn10("circle", {
        cx: cx2,
        cy: cy2,
        r: 14,
        fill: "#edb06033",
        stroke: "#f2b768"
      }, value42);
      fn10("path", {
        d: "M" + (cx2 - 8) + "," + cy2 + "H" + (cx2 + 8) + "M" + cx2 + "," + (cy2 - 8) + "V" + (cy2 + 8),
        stroke: "#ffe0ad",
        "stroke-width": 2,
        fill: "none"
      }, value42);
    }
    const push3 = [["nw", -1, -1], ["ne", 1, -1], ["se", 1, 1], ["sw", -1, 1]];
    push3.push(["w", -1, 0], ["e", 1, 0], ["n", 0, -1], ["s", 0, 1]);
    for (const [data_range_handle, value56, value57] of push3) {
      const [cx3, cy3] = fn9(depth, value56 * depth.width / 2, value57 * depth.depth / 2, value72);
      const value43 = fn10("g", {
        "data-range-handle": data_range_handle,
        role: "button",
        tabindex: "0",
        "aria-label": "拖动" + {
          nw: "左上角",
          ne: "右上角",
          se: "右下角",
          sw: "左下角",
          w: "左边调整宽度",
          e: "右边调整宽度",
          n: "上边调整深度",
          s: "下边调整深度"
        }[data_range_handle]
      });
      fn10("circle", {
        cx: cx3,
        cy: cy3,
        r: 13,
        fill: "transparent"
      }, value43);
      fn10("rect", {
        x: cx3 - 4.5,
        y: cy3 - 4.5,
        width: 9,
        height: 9,
        rx: 2,
        fill: "#ffe0ad",
        stroke: "#9f6e33",
        "stroke-width": 1.2,
        class: "p2r-handle"
      }, value43);
    }
    const value79 = fn9(depth, 0, 0, value72);
    const value80 = fn9(depth, 0, -depth.depth / 2, value72);
    const value81 = value80[0] - value79[0];
    const value82 = value80[1] - value79[1];
    const value83 = Math.max(1, Math.hypot(value81, value82));
    const value84 = [value80[0] + value81 / value83 * 27, value80[1] + value82 / value83 * 27];
    fn10("line", {
      x1: value80[0],
      y1: value80[1],
      x2: value84[0],
      y2: value84[1],
      stroke: "#eabc7b",
      "stroke-width": 1.2
    });
    const value85 = fn10("g", {
      "data-range-handle": "rotate",
      role: "button",
      tabindex: "0",
      "aria-label": "拖动旋转照射范围"
    });
    fn10("circle", {
      cx: value84[0],
      cy: value84[1],
      r: 14,
      fill: "transparent"
    }, value85);
    fn10("circle", {
      cx: value84[0],
      cy: value84[1],
      r: 5,
      fill: "#f3c581",
      stroke: "#956527",
      "stroke-width": 1.2,
      class: "p2r-handle"
    }, value85);
  }
  function fn13(clientX) {
    const width7 = invalidateRegionLighting.canvas.getBoundingClientRect();
    if (!width7.width || !width7.height) {
      return null;
    } else {
      set.set((clientX.clientX - width7.left) / width7.width * 2 - 1, 1 - (clientX.clientY - width7.top) / width7.height * 2);
      setFromCamera.setFromCamera(set, invalidateRegionLighting.camera);
      constant.constant = -fn8();
      return setFromCamera.ray.intersectPlane(constant, new Vector3.Vector3());
    }
  }
  function fn14(target4) {
    if (target4.button !== 0 || !value103) {
      return;
    }
    const dataset4 = target4.target.closest?.("[data-range-handle]");
    if (dataset4 && value117()) {
      if (dataset4.dataset.rangeHandle === "move" && !value117().moveCenterEnabled) {
        return;
      }
      target4.preventDefault();
      target4.stopPropagation();
      dataset4.focus?.();
      const value44 = value117();
      const point2 = fn13(target4);
      if (!point2) {
        return;
      }
      point3 = {
        pointerId: target4.pointerId,
        handle: dataset4.dataset.rangeHandle,
        region: T(value44),
        point: point2,
        initial: T(value105),
        changed: false
      };
      addEventListener2.setPointerCapture(target4.pointerId);
    } else {
      const dataset2 = target4.target.closest?.("[data-region-key]");
      if (dataset2) {
        target4.preventDefault();
        fn17(dataset2.dataset.regionKey);
      }
    }
  }
  function fn15(shiftKey) {
    if (!point3 || shiftKey.pointerId !== point3.pointerId) {
      return;
    }
    const x4 = fn13(shiftKey);
    if (!x4) {
      return;
    }
    shiftKey.preventDefault();
    const center3 = point3.region;
    const [value86, value87] = center3.axis;
    const value88 = x4.x - center3.center[0];
    const value89 = x4.z - center3.center[2];
    if (point3.handle === "move") {
      fn5({
        offsetX: B(H((center3.offsetX || 0) + x4.x - point3.point.x, -100, 100)),
        offsetZ: B(H((center3.offsetZ || 0) + x4.z - point3.point.z, -100, 100))
      });
    } else if (point3.handle === "rotate") {
      const value22 = Math.atan2(point3.point.z - center3.center[2], point3.point.x - center3.center[0]);
      const value23 = Math.atan2(value89, value88) - value22;
      let value24 = center3.rotation + value23 * 180 / Math.PI;
      value24 = ((value24 + 180) % 360 + 360) % 360 - 180;
      if (shiftKey.shiftKey) {
        value24 = Math.round(value24 / 15) * 15;
      }
      fn5({
        rotation: B(value24)
      });
    } else {
      const value25 = Math.abs(value88 * value86 + value89 * value87) * 2;
      const value26 = Math.abs(-value88 * value87 + value89 * value86) * 2;
      fn5(resizeRegionDimensions(center3, value25, value26, point3.handle, shiftKey.shiftKey));
    }
    point3.changed = true;
  }
  function fn16(pointerId, arg29 = false) {
    if (!point3 || pointerId && pointerId.pointerId !== point3.pointerId) {
      return;
    }
    const pointerId2 = point3;
    point3 = null;
    if (addEventListener2.hasPointerCapture(pointerId2.pointerId)) {
      addEventListener2.releasePointerCapture(pointerId2.pointerId);
    }
    if (arg29) {
      value105 = pointerId2.initial;
      value116()?.setOverrides?.(value105);
      invalidateRegionLighting.invalidateRegionLighting?.();
      fn();
      fn3();
      fn12();
    } else if (pointerId2.changed) {
      fn6();
    }
  }
  function fn17(arg30) {
    if (point3) {
      fn16(null);
    }
    element5 = arg30;
    fn3();
    fn4();
    fn12();
  }
  function fn18() {
    if (invalidateRegionLighting.controls) {
      invalidateRegionLighting.controls.enabled = false;
    }
  }
  function fn19(arg31, arg32) {
    const walls = value118(element6)?.scene;
    const push4 = [];
    const value90 = (arg7, arg8, radius = 0) => {
      if (!Number.isFinite(Number(arg7)) || !Number.isFinite(Number(arg8))) {
        return;
      }
      const point = invalidateRegionLighting.worldPoint?.(element6, Number(arg7), Number(arg8), 0.065);
      if (point) {
        push4.push({
          point,
          radius
        });
      }
    };
    for (const start of walls?.walls || []) {
      const value45 = Math.max(0, Y(start.thickness, 0.12)) / 2;
      value90(start.start?.x, start.start?.y, value45);
      value90(start.end?.x, start.end?.y, value45);
    }
    if (!push4.length) {
      for (const x2 of walls?.items || []) {
        const x = invalidateRegionLighting.worldPoint?.(element6, x2.x, x2.y, 0.065);
        if (!x) {
          continue;
        }
        const value11 = Y(x2.rotation) * Math.PI / 180;
        const value12 = Math.cos(value11);
        const value13 = Math.sin(value11);
        for (const value7 of [-1, 1]) {
          for (const value4 of [-1, 1]) {
            const value2 = value7 * Math.max(0.1, Y(x2.width, 0.5)) / 2;
            const value3 = value4 * Math.max(0.1, Y(x2.depth, 0.5)) / 2;
            push4.push({
              point: new Vector3.Vector3(x.x + value2 * value12 - value3 * value13, x.y, x.z + value2 * value13 + value3 * value12),
              radius: 0
            });
          }
        }
      }
    }
    if (!push4.length) {
      for (const center of filter.filter(floorId4 => String(floorId4.floorId) === element6)) {
        push4.push({
          point: new Vector3.Vector3().fromArray(center.center),
          radius: 0.5
        });
      }
    }
    if (!push4.length) {
      push4.push({
        point: new Vector3.Vector3(0, 0, 0),
        radius: 2.5
      });
    }
    let left3 = Infinity;
    let right2 = -Infinity;
    let bottom = Infinity;
    let top = -Infinity;
    for (const {
      point: dot,
      radius: value58
    } of push4) {
      const value46 = dot.dot(arg31);
      const value47 = dot.dot(arg32);
      left3 = Math.min(left3, value46 - value58);
      right2 = Math.max(right2, value46 + value58);
      bottom = Math.min(bottom, value47 - value58);
      top = Math.max(top, value47 + value58);
    }
    return {
      left: left3,
      right: right2,
      bottom,
      top
    };
  }
  function fn20() {
    if (!value103 || !up || value112) {
      return;
    }
    const width8 = querySelector.getBoundingClientRect();
    const top2 = getBoundingClientRect2.getBoundingClientRect();
    if (!(width8.width < 2) && !(width8.height < 2)) {
      value112 = true;
      try {
        const width2 = width8.width <= 620 ? {
          x: 14,
          y: 52,
          width: width8.width - 28,
          height: Math.max(70, top2.top - width8.top - 62)
        } : {
          x: 18,
          y: 68,
          width: Math.max(70, top2.left - width8.left - 35),
          height: Math.max(70, width8.height - 115)
        };
        const target = T(up);
        const clone = new Vector3.Vector3().fromArray(up.up || [0, 0, -1]).normalize();
        const value14 = new Vector3.Vector3().fromArray(up.target).sub(new Vector3.Vector3().fromArray(up.position)).normalize();
        const clone2 = new Vector3.Vector3().crossVectors(value14, clone).normalize();
        const right = fn19(clone2, clone);
        const value15 = Math.max(1, right.right - right.left);
        const value16 = Math.max(1, right.top - right.bottom);
        const value17 = Math.max((value15 + 0.4) / width2.width, (value16 + 0.4) / width2.height) * 1.08;
        const value18 = width2.x + width2.width / 2 - width8.width / 2;
        const value19 = width2.y + width2.height / 2 - width8.height / 2;
        const y = clone2.clone().multiplyScalar((right.left + right.right) / 2).add(clone.clone().multiplyScalar((right.bottom + right.top) / 2));
        y.y = fn8() + 0.6;
        y.addScaledVector(clone2, -value18 * value17).addScaledVector(clone, value19 * value17);
        target.target = y.toArray();
        target.position = y.clone().addScaledVector(value14, -Math.max(20, value15 * 2, value16 * 2)).toArray();
        target.frameSize = value17 * Math.min(width8.width, width8.height);
        target.zoom = 1;
        invalidateRegionLighting.restoreCamera(target);
        fn18();
        invalidateRegionLighting.invalidateRegionLighting?.();
        arg54();
        value114 = width8.width;
        value115 = width8.height;
        fn12();
      } finally {
        value112 = false;
      }
    }
  }
  function fn21({
    fit: arg33 = false
  } = {}) {
    if (value103) {
      value111 ||= arg33;
      if (value110) {
        win.cancelAnimationFrame(value110);
      }
      value110 = win.requestAnimationFrame(() => {
        value110 = 0;
        const value6 = value111;
        value111 = false;
        if (value103) {
          fn();
          fn3();
          if (value6) {
            fn20();
          } else {
            fn12();
          }
        }
      });
    }
  }
  function fn22(arg34) {
    if (point3) {
      fn16(null);
    }
    element6 = String(arg34);
    element5 = "";
    invalidateRegionLighting.setFloor(element6);
    invalidateRegionLighting.setCameraProjection("orthographic");
    invalidateRegionLighting.topView();
    up = T(invalidateRegionLighting.cameraState(true));
    fn18();
    invalidateRegionLighting.invalidateRegionLighting?.();
    fn();
    fn3();
    fn4();
    fn21({
      fit: true
    });
  }
  function fn23(target5) {
    const value91 = target5.target;
    const value92 = value91.dataset.field;
    if (value92 === "floor") {
      return fn22(value91.value);
    }
    if (value92 === "fixture") {
      return fn17(value91.value);
    }
    if (value92 === "group" || value92 === "preview") {
      fn3();
      fn4();
      fn12();
      return;
    }
    if (value92 === "moveCenter") {
      return fn5({
        moveCenterEnabled: value91.checked
      }, true);
    }
    if (value92 === "shape") {
      return fn5({
        shape: value91.value
      }, true);
    }
    if (value92 === "softness") {
      return fn5({
        softness: H(Y(value91.value, 35) / 100, 0.05, 1)
      }, true);
    }
    if (["width", "depth", "rotation"].includes(value92)) {
      const value48 = value117()?.[value92];
      const value49 = value91.value.trim() === "" ? value48 : Y(value91.value, value48);
      value91.value = B(H(value49, value92 === "rotation" ? -180 : 0.5, value92 === "rotation" ? 180 : 20));
      fn5({
        [value92]: Number(value91.value)
      }, true);
    }
  }
  function fn24(key12) {
    if (!value103 || key12.defaultPrevented) {
      return;
    }
    if (key12.key === "Escape") {
      key12.preventDefault();
      key12.stopPropagation();
      close2();
      return;
    }
    const dataset5 = key12.target.closest?.("[data-region-key]");
    if (dataset5 && ["Enter", " "].includes(key12.key)) {
      key12.preventDefault();
      fn17(dataset5.dataset.regionKey);
    }
    const dataset6 = key12.target.closest?.("[data-range-handle]");
    if (!dataset6 || !value117() || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key12.key)) {
      return;
    }
    key12.preventDefault();
    const value93 = ["ArrowUp", "ArrowRight"].includes(key12.key) ? 1 : -1;
    if (dataset6.dataset.rangeHandle === "move") {
      if (!value117().moveCenterEnabled) {
        return;
      }
      const value50 = ["ArrowLeft", "ArrowRight"].includes(key12.key) ? "offsetX" : "offsetZ";
      const value51 = ["ArrowRight", "ArrowDown"].includes(key12.key) ? 1 : -1;
      fn5({
        [value50]: B(H((value117()[value50] || 0) + value51 * (key12.shiftKey ? 0.5 : 0.1), -100, 100))
      }, true);
    } else if (dataset6.dataset.rangeHandle === "rotate") {
      fn5({
        rotation: H(value117().rotation + value93 * (key12.shiftKey ? 15 : 1), -180, 180)
      }, true);
    } else {
      const value27 = dataset6.dataset.rangeHandle;
      const value28 = ["w", "e"].includes(value27) ? "width" : ["n", "s"].includes(value27) ? "depth" : ["ArrowLeft", "ArrowRight"].includes(key12.key) ? "width" : "depth";
      const width3 = value117();
      const width4 = {
        width: width3.width,
        depth: width3.depth,
        [value28]: width3[value28] + value93 * 0.1
      };
      fn5(resizeRegionDimensions(width3, width4.width, width4.depth, value28 === "width" ? "e" : "s", key12.shiftKey), true);
    }
  }
  function fn25(target6) {
    const value94 = target6.target.closest?.("[data-action]")?.dataset.action;
    if (value94 === "close") {
      close2();
    }
    if (value94 === "reset-center") {
      fn5({
        offsetX: 0,
        offsetZ: 0
      }, true);
    }
    if (value94 === "reset") {
      for (const value29 of value120()) {
        delete value105[value29];
      }
      value116()?.setOverrides?.(value105);
      invalidateRegionLighting.invalidateRegionLighting?.();
      arg54();
      fn();
      fn3();
      fn12();
      fn6();
    }
  }
  querySelector.addEventListener("change", fn23);
  querySelector.addEventListener("input", target2 => {
    if (target2.target === group.softness) {
      fn5({
        softness: H(Y(group.softness.value, 35) / 100, 0.05, 1)
      });
    }
  });
  querySelector.addEventListener("click", fn25);
  addEventListener2.addEventListener("pointerdown", fn14);
  addEventListener2.addEventListener("pointermove", fn15);
  addEventListener2.addEventListener("pointerup", arg10 => fn16(arg10));
  addEventListener2.addEventListener("pointercancel", arg11 => fn16(arg11, true));
  addEventListener2.addEventListener("lostpointercapture", arg12 => fn16(arg12));
  const observe = new win.ResizeObserver(() => {
    if (!value103 || value112) {
      return;
    }
    const width5 = querySelector.getBoundingClientRect();
    if (Math.abs(width5.width - value114) > 1 || Math.abs(width5.height - value115) > 1) {
      fn21({
        fit: true
      });
    } else {
      fn21();
    }
  });
  observe.observe(invalidateRegionLighting.container);
  function open() {
    if (!value103 && !value104) {
      if (!value116()?.listRegions) {
        throw new Error("区域灯光尚未准备好，请稍后重试。");
      }
      value108 = String(arg51()?.floorSelection || invalidateRegionLighting.document?.activeFloorId || invalidateRegionLighting.document?.floors?.[0]?.id || "");
      value109 = invalidateRegionLighting.controls?.enabled;
      value107 = T(invalidateRegionLighting.cameraState(true));
      value103 = true;
      querySelector.hidden = false;
      value105 = T(arg51()?.lightRegionOverrides || value116()?.getOverrides?.() || {});
      value116().setOverrides(value105);
      element6 = value108 === "all" ? String(invalidateRegionLighting.document?.activeFloorId || invalidateRegionLighting.document?.floors?.[0]?.id || "") : value108;
      invalidateRegionLighting.setFloor(element6);
      invalidateRegionLighting.setCameraProjection("orthographic");
      invalidateRegionLighting.topView();
      up = T(invalidateRegionLighting.cameraState(true));
      fn18();
      createElement.addEventListener("keydown", fn24, true);
      value113 = invalidateRegionLighting.onCameraChange?.(() => {
        if (!value112) {
          fn21();
        }
      });
      invalidateRegionLighting.invalidateRegionLighting?.();
      fn();
      fn3();
      fn4();
      fn21({
        fit: true
      });
      querySelector.querySelector("[data-action=close]").focus({
        preventScroll: true
      });
    }
  }
  function close2() {
    if (value103) {
      close.close();
      fn16(null);
      value103 = false;
      querySelector.hidden = true;
      if (value110) {
        win.cancelAnimationFrame(value110);
        value110 = 0;
      }
      value113?.();
      value113 = null;
      createElement.removeEventListener("keydown", fn24, true);
      value116()?.setPreview?.(null);
      invalidateRegionLighting.setFloor(value108);
      invalidateRegionLighting.restoreCamera(value107);
      if (invalidateRegionLighting.controls) {
        invalidateRegionLighting.controls.enabled = value109 !== false;
      }
      invalidateRegionLighting.invalidateRegionLighting?.();
      arg54();
      up = null;
      arg53();
    }
  }
  function refresh() {
    if (value103) {
      fn21();
    }
  }
  function setSaveStatus(message) {
    value106 = message ? String(message.message || message) : "";
    if (value103) {
      fn3();
    }
  }
  function dispose() {
    if (!value104) {
      close2();
      value104 = true;
      close.dispose();
      observe.disconnect();
      querySelector.remove();
    }
  }
  return {
    open,
    close: close2,
    flush() {
      close.close();
      fn16(null);
      fn6();
    },
    isOpen: () => value103,
    refresh,
    dispose,
    setSaveStatus
  };
}
export function mountRangeFormControls(querySelectorAll) {
  const defaultView = querySelectorAll.ownerDocument;
  const viewWin = defaultView.defaultView;
  const forEach = [];
  const push5 = [];
  const push6 = [];
  let wrapper = null;
  let value121 = null;
  const value122 = (arg13, element) => {
    const className = defaultView.createElement(arg13);
    className.className = element;
    return className;
  };
  const value123 = (addEventListener, arg14, arg15, arg16) => {
    addEventListener.addEventListener(arg14, arg15, arg16);
    push6.push(() => addEventListener.removeEventListener(arg14, arg15, arg16));
  };
  function fn26(arg35 = false) {
    if (!wrapper) {
      return;
    }
    const button3 = wrapper;
    wrapper = null;
    button3.menu.hidden = true;
    button3.button.setAttribute("aria-expanded", "false");
    if (arg35) {
      button3.button.focus({
        preventScroll: true
      });
    }
  }
  function fn27() {
    if (!wrapper) {
      return;
    }
    const {
      button: getBoundingClientRect,
      menu: style
    } = wrapper;
    const width9 = getBoundingClientRect.getBoundingClientRect();
    const value95 = Math.max(40, Math.min(320, viewWin.innerHeight - 16));
    Object.assign(style.style, {
      width: width9.width + "px",
      maxHeight: value95 + "px",
      left: Math.max(8, Math.min(viewWin.innerWidth - width9.width - 8, width9.left)) + "px"
    });
    const value96 = Math.min(style.scrollHeight, value95);
    style.style.top = (width9.bottom + value96 + 12 <= viewWin.innerHeight ? width9.bottom + 4 : Math.max(8, width9.top - value96 - 4)) + "px";
  }
  function fn28(signature) {
    const {
      select: disabled4,
      button: textContent2,
      menu: replaceChildren
    } = signature;
    textContent2.textContent = disabled4.selectedOptions[0]?.textContent || "请选择";
    textContent2.disabled = disabled4.disabled;
    textContent2.setAttribute("aria-label", disabled4.getAttribute("aria-label") || "打开选择菜单");
    const signature2 = JSON.stringify([...disabled4.options].map(value8 => [value8.value, value8.textContent, value8.disabled, value8.hidden]));
    if (signature2 !== signature.signature) {
      signature.signature = signature2;
      replaceChildren.replaceChildren(...[...disabled4.options].filter(hidden => !hidden.hidden).map(value5 => {
        const type = value122("button", "custom-select-option");
        type.type = "button";
        type.dataset.value = value5.value;
        type.setAttribute("role", "option");
        type.textContent = value5.textContent;
        type.disabled = value5.disabled;
        return type;
      }));
    }
    for (const dataset3 of replaceChildren.children) {
      dataset3.classList.toggle("active", dataset3.dataset.value === disabled4.value);
      dataset3.setAttribute("aria-selected", String(dataset3.dataset.value === disabled4.value));
    }
    if (disabled4.disabled && wrapper === signature) {
      fn26();
    }
  }
  function fn29(menu2, arg36 = false) {
    fn26();
    fn28(menu2);
    if (!menu2.select.disabled) {
      wrapper = menu2;
      menu2.menu.hidden = false;
      menu2.button.setAttribute("aria-expanded", "true");
      fn27();
      if (arg36) {
        (menu2.menu.querySelector(".active:not(:disabled)") || menu2.menu.querySelector("button:not(:disabled)"))?.focus({
          preventScroll: true
        });
      }
    }
  }
  function fn30(select, disabled5) {
    if (!disabled5 || disabled5.disabled || select.select.disabled) {
      return;
    }
    const value97 = select.select.value;
    select.select.value = disabled5.dataset.value;
    fn26(true);
    if (value97 !== select.select.value) {
      select.select.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }
    fn28(select);
  }
  for (const before of querySelectorAll.querySelectorAll("select")) {
    const append = value122("span", "custom-select");
    const setAttribute = value122("button", "custom-select-button");
    const id5 = value122("div", "custom-select-menu");
    before.before(append);
    append.append(before, setAttribute);
    querySelectorAll.append(id5);
    before.classList.add("native-select-control");
    before.tabIndex = -1;
    before.setAttribute("aria-hidden", "true");
    setAttribute.type = "button";
    setAttribute.setAttribute("aria-haspopup", "listbox");
    setAttribute.setAttribute("aria-expanded", "false");
    id5.id = "range-select-" + before.dataset.field + "-menu";
    id5.setAttribute("role", "listbox");
    id5.hidden = true;
    setAttribute.setAttribute("aria-controls", id5.id);
    id5.setAttribute("aria-label", before.getAttribute("aria-label") || "选项");
    const value64 = {
      select: before,
      wrapper: append,
      button: setAttribute,
      menu: id5
    };
    forEach.push(value64);
    fn28(value64);
    value123(setAttribute, "click", preventDefault2 => {
      preventDefault2.preventDefault();
      if (wrapper === value64) {
        fn26();
      } else {
        fn29(value64);
      }
    });
    value123(id5, "click", preventDefault3 => {
      preventDefault3.preventDefault();
      fn30(value64, preventDefault3.target.closest(".custom-select-option"));
    });
    value123(before, "change", () => fn28(value64));
  }
  function fn31(value98, arg37) {
    if (value98.disabled || value98.readOnly) {
      return false;
    }
    const value99 = value98.value;
    try {
      if (arg37 > 0) {
        value98.stepUp();
      } else {
        value98.stepDown();
      }
    } catch {
      return false;
    }
    if (value99 === value98.value) {
      return false;
    } else {
      value98.dispatchEvent(new Event("input", {
        bubbles: true
      }));
      value98.dispatchEvent(new Event("change", {
        bubbles: true
      }));
      return true;
    }
  }
  for (const before2 of querySelectorAll.querySelectorAll("input[type=number]")) {
    const append2 = value122("span", "inspector-number-control");
    const append3 = value122("span", "inspector-number-steppers");
    before2.before(append2);
    append2.append(before2, append3);
    const push = [];
    for (const [value59, title, value60] of [[1, "增加数值", "M1 5 5 1l4 4"], [-1, "减少数值", "M1 1 5 5l4-4"]]) {
      const type2 = value122("button", "inspector-number-stepper");
      type2.type = "button";
      type2.tabIndex = -1;
      type2.setAttribute("aria-label", title);
      type2.title = title;
      type2.innerHTML = "<svg viewBox=\"0 0 10 6\" aria-hidden=\"true\"><path d=\"" + value60 + "\"></path></svg>";
      append3.append(type2);
      push.push(type2);
      value123(type2, "click", preventDefault => {
        preventDefault.preventDefault();
        if (preventDefault.detail === 0) {
          fn31(before2, value59);
        }
      });
      value123(type2, "pointerdown", button => {
        if (button.button !== 0 || before2.disabled || before2.readOnly) {
          return;
        }
        button.preventDefault();
        value121?.();
        before2.focus({
          preventScroll: true
        });
        fn31(before2, value59);
        let value9;
        let value10;
        value121 = () => {
          viewWin.clearTimeout(value9);
          viewWin.clearInterval(value10);
          value121 = null;
        };
        value9 = viewWin.setTimeout(() => {
          value10 = viewWin.setInterval(() => fn31(before2, value59), 55);
        }, 320);
        try {
          type2.setPointerCapture(button.pointerId);
        } catch {}
      });
      for (const value30 of ["pointerup", "pointercancel", "lostpointercapture"]) {
        value123(type2, value30, () => value121?.());
      }
    }
    value123(before2, "keydown", key10 => {
      if (["ArrowUp", "ArrowDown"].includes(key10.key)) {
        key10.preventDefault();
        fn31(before2, key10.key === "ArrowUp" ? 1 : -1);
      }
    });
    push5.push({
      field: before2,
      peers: push
    });
  }
  function fn32(key13) {
    const menu3 = forEach.find(button2 => button2.button === key13.target || button2.menu.contains(key13.target));
    if (!menu3) {
      return;
    }
    if (key13.key === "Escape" && wrapper) {
      key13.preventDefault();
      key13.stopImmediatePropagation();
      fn26(true);
      return;
    }
    if (key13.key === "Tab") {
      fn26();
      return;
    }
    if (!["ArrowUp", "ArrowDown", "Home", "End", "Enter", " "].includes(key13.key)) {
      return;
    }
    key13.preventDefault();
    key13.stopImmediatePropagation();
    if (wrapper !== menu3) {
      fn29(menu3, true);
      return;
    }
    if (["Enter", " "].includes(key13.key)) {
      fn30(menu3, key13.target.closest(".custom-select-option") || menu3.menu.querySelector(".active"));
      return;
    }
    const length3 = [...menu3.menu.children].filter(disabled2 => !disabled2.disabled);
    const value100 = length3.indexOf(defaultView.activeElement);
    const value101 = key13.key === "Home" ? 0 : key13.key === "End" ? length3.length - 1 : (value100 + (key13.key === "ArrowUp" ? -1 : 1) + length3.length) % length3.length;
    length3[value101]?.focus();
  }
  value123(defaultView, "keydown", fn32, true);
  value123(defaultView, "pointerdown", target3 => {
    if (wrapper && !wrapper.wrapper.contains(target3.target) && !wrapper.menu.contains(target3.target)) {
      fn26();
    }
  }, true);
  value123(viewWin, "resize", () => fn26());
  value123(viewWin, "blur", () => {
    value121?.();
    fn26();
  });
  value123(defaultView, "visibilitychange", () => {
    if (defaultView.hidden) {
      value121?.();
      fn26();
    }
  });
  value123(querySelectorAll.querySelector(".p2r-panel"), "scroll", () => fn26(), {
    passive: true
  });
  return {
    sync() {
      forEach.forEach(fn28);
      for (const {
        field: disabled3,
        peers: value31
      } of push5) {
        for (const disabled of value31) {
          disabled.disabled = disabled3.disabled || disabled3.readOnly;
        }
      }
    },
    close() {
      fn26();
      value121?.();
    },
    dispose() {
      fn26();
      value121?.();
      push6.forEach(arg6 => arg6());
      forEach.forEach(menu => menu.menu.remove());
    }
  };
}
