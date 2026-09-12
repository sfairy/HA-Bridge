const SVG_NS = "http://www.w3.org/2000/svg";
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const toFiniteNumber = (input, fallback = 0) => Number.isFinite(Number(input)) ? Number(input) : fallback;
const cloneJson = data => JSON.parse(JSON.stringify(data || {}));
const round = num => Math.round(num * 100) / 100;
const makeRegionKey = (floorId, itemId) => JSON.stringify([String(floorId), String(itemId)]);
export function resizeRegionDimensions(baseDims, nextWidth, nextDepth, handle, keepAspect = false) {
  if (["n", "s"].includes(handle)) {
    nextWidth = baseDims.width;
  }
  if (["w", "e"].includes(handle)) {
    nextDepth = baseDims.depth;
  }
  if (keepAspect) {
    const widthScale = nextWidth / baseDims.width;
    const depthScale = nextDepth / baseDims.depth;
    let uniformScale = ["w", "e"].includes(handle) ? widthScale : ["n", "s"].includes(handle) ? depthScale : Math.abs(widthScale - 1) >= Math.abs(depthScale - 1) ? widthScale : depthScale;
    uniformScale = clamp(uniformScale, Math.max(0.5 / baseDims.width, 0.5 / baseDims.depth), Math.min(20 / baseDims.width, 20 / baseDims.depth));
    return {
      width: round(baseDims.width * uniformScale),
      depth: round(baseDims.depth * uniformScale)
    };
  }
  return {
    width: round(clamp(nextWidth, 0.5, 20)),
    depth: round(clamp(nextDepth, 0.5, 20))
  };
}
export function mountRegionRangeEditor(host, {
  getConfig = () => ({}),
  onChange = () => {},
  onClose = () => {},
  wake = () => {},
  standalone = false
} = {}) {
  const doc = host.container.ownerDocument;
  const win = doc.defaultView;
  const THREE = host.THREE;
  const editorEl = doc.createElement("section");
  editorEl.className = "plan2-range-editor";
  editorEl.dataset.testid = "range-editor";
  editorEl.hidden = true;
  editorEl.setAttribute("aria-label", "平面光区编辑");
  editorEl.innerHTML = "\n    <svg aria-label=\"灯具与照射范围\" role=\"group\"></svg>\n    <header class=\"p2r-top\"><div class=\"p2r-title\">平面光区编辑<small>拖动边角调整范围，按住 Shift 等比例缩放</small></div><span class=\"p2r-compact-caption\">自由拖动 · Shift 等比</span></header>\n    <div class=\"p2r-panel\">\n      <h3>照射范围</h3>\n      <div class=\"p2r-selectors\">\n        <label class=\"p2r-field\">楼层<select data-field=\"floor\" aria-label=\"楼层\"></select></label>\n        <label class=\"p2r-field\">灯具<select data-field=\"fixture\" aria-label=\"灯具\"></select></label>\n      </div>\n      <div class=\"p2r-grid\">\n        <label class=\"p2r-field p2r-shape\">光区形状<select data-field=\"shape\" aria-label=\"光区形状\"><option value=\"circle\">圆形</option><option value=\"square\">方形</option></select></label>\n        <label class=\"p2r-field\"><span data-width-label>宽度（米）</span><input data-field=\"width\" aria-label=\"宽度（米）\" type=\"number\" min=\"0.5\" max=\"20\" step=\"0.1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field\"><span data-depth-label>深度（米）</span><input data-field=\"depth\" aria-label=\"深度（米）\" type=\"number\" min=\"0.5\" max=\"20\" step=\"0.1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field p2r-rotation\">旋转（度）<input data-field=\"rotation\" aria-label=\"旋转（度）\" type=\"number\" min=\"-180\" max=\"180\" step=\"1\" inputmode=\"decimal\"></label>\n        <label class=\"p2r-field p2r-soft-field\">边缘柔和度<span class=\"p2r-softness\"><input data-field=\"softness\" aria-label=\"边缘柔和度\" type=\"range\" min=\"5\" max=\"100\" step=\"1\"><output data-soft-value>35%</output></span></label>\n      </div>\n      <div class=\"p2r-options\">\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"moveCenter\" type=\"checkbox\">允许移动范围中心</label>\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"group\" type=\"checkbox\">同步本组范围</label>\n        <label class=\"p2r-check i3d-setting-toggle\"><input data-field=\"preview\" type=\"checkbox\"><span data-preview-label>仅预览当前灯</span></label>\n      </div>\n      <div class=\"p2r-actions\"><button type=\"button\" data-action=\"reset-center\">中心回到灯位</button><button type=\"button\" data-action=\"reset\">恢复模型默认</button><button type=\"button\" class=\"p2r-done\" data-action=\"close\">完成</button></div>\n      <p class=\"p2r-status\" role=\"status\" aria-live=\"polite\"></p>\n    </div>\n    <div class=\"p2r-help\">外边界为光照衰减到零的位置 · 范围不代表墙体挡光</div>";
  editorEl.querySelector("[data-action=close]").hidden = standalone;
  host.container.append(editorEl);
  const svg = editorEl.querySelector("svg");
  const panelEl = editorEl.querySelector(".p2r-panel");
  const fields = Object.fromEntries([...editorEl.querySelectorAll("[data-field]")].map(dataset => [dataset.dataset.field, dataset]));
  const statusEl = editorEl.querySelector(".p2r-status");
  const softValueEl = editorEl.querySelector("[data-soft-value]");
  const close = mountRangeFormControls(editorEl);
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let editorOpen = false;
  let disposed = false;
  let overrides = {};
  let regions = [];
  let selectedKey = "";
  let selectedFloorId = "";
  let saveError = "";
  let savedCamera = null;
  let savedFloorId = "";
  let savedControlsEnabled = true;
  let topViewCamera = null;
  let dragState = null;
  let redrawRaf = 0;
  let pendingFit = false;
  let fittingCamera = false;
  let unsubscribeCamera = null;
  let lastFitWidth = 0;
  let lastFitHeight = 0;
  const getRegionLighting = () => host.regionLighting;
  const selectedRegion = () => regions.find(key => key.key === selectedKey);
  const findFloor = floorId => (host.document?.floors || []).find(id => String(id.id) === String(floorId));
  const regionsInGroup = groupId => groupId ? regions.filter(floorId => String(floorId.floorId) === String(groupId.floorId) && (groupId.groupId ? floorId.groupId === groupId.groupId : floorId.key === groupId.key)) : [];
  const activeEditKeys = () => fields.group.checked ? regionsInGroup(selectedRegion()).map(key => key.key) : selectedRegion() ? [selectedKey] : [];
  function refreshRegions() {
    regions = (getRegionLighting()?.listRegions?.() || []).map(item => {
      const scene = findFloor(item.floorId);
      const lightGroupId = scene?.scene?.items?.find(id => String(id.id) === String(item.id));
      const groupId = lightGroupId?.lightGroupId || "";
      const label = (getConfig()?.lights || []).find(floorId => String(floorId.floorId) === String(item.floorId) && floorId.groupId === groupId);
      const name = scene?.scene?.lightGroups?.find(id => id.id === groupId);
      return {
        ...item,
        key: item.key || makeRegionKey(item.floorId, item.id),
        groupId,
        label: label?.label || name?.name || lightGroupId?.name || "灯具"
      };
    });
    for (const fixtureLabel of regions) {
      const length = regionsInGroup(fixtureLabel);
      fixtureLabel.fixtureLabel = "" + fixtureLabel.label + (length.length > 1 ? " · " + (length.findIndex(key => key.key === fixtureLabel.key) + 1) + "/" + length.length : "");
    }
    const some = regions.filter(floorId => String(floorId.floorId) === selectedFloorId);
    if (!some.some(key => key.key === selectedKey)) {
      selectedKey = some[0]?.key || "";
    }
  }
  function createOption(element, elementCurrent) {
    const optionEl = doc.createElement("option");
    optionEl.value = element;
    optionEl.textContent = elementCurrent;
    return optionEl;
  }
  function syncForm() {
    fields.floor.replaceChildren(...(host.document?.floors || []).map(id3 => createOption(String(id3.id), id3.name || "楼层")));
    fields.floor.value = selectedFloorId;
    fields.fixture.replaceChildren(...regions.filter(floorId => String(floorId.floorId) === selectedFloorId).map(key => createOption(key.key, key.fixtureLabel)));
    fields.fixture.value = selectedKey;
    const moveCenterEnabled = selectedRegion();
    const hasSelection = !!moveCenterEnabled;
    const length = regionsInGroup(moveCenterEnabled);
    for (const fieldKey of ["fixture", "shape", "width", "depth", "rotation", "softness", "preview", "moveCenter"]) {
      fields[fieldKey].disabled = !hasSelection;
    }
    fields.group.disabled = length.length < 2;
    editorEl.querySelector("[data-preview-label]").textContent = fields.group.checked && length.length > 1 ? "仅预览当前灯组" : "仅预览当前灯";
    editorEl.querySelector("[data-action=reset]").disabled = !hasSelection;
    editorEl.querySelector("[data-action=reset-center]").hidden = !moveCenterEnabled || !moveCenterEnabled.offsetX && !moveCenterEnabled.offsetZ;
    fields.moveCenter.checked = moveCenterEnabled?.moveCenterEnabled === true;
    if (moveCenterEnabled) {
      fields.shape.value = ["square", "strip"].includes(moveCenterEnabled.shape) ? "square" : "circle";
      for (const numericField of ["width", "depth", "rotation"]) {
        if (doc.activeElement !== fields[numericField]) {
          fields[numericField].value = round(moveCenterEnabled[numericField]);
        }
      }
      fields.softness.value = Math.round(moveCenterEnabled.softness * 100);
      softValueEl.value = fields.softness.value + "%";
      statusEl.textContent = fields.group.checked && length.length > 1 ? "本组 " + length.length + " 盏 · 修改会同步到各自灯位" : length.length > 1 ? "本组 " + length.length + " 盏 · 当前只调整这一盏" : moveCenterEnabled.moveCenterEnabled ? "拖动光区或中心十字移动范围 · 灯位不变" : "范围中心已锁定 · 可拖动边角调整大小";
    } else {
      statusEl.textContent = "当前楼层暂无可编辑灯具，请切换楼层。";
    }
    if (saveError) {
      statusEl.textContent = "本次保存未成功：" + saveError + "。当前预览仍保留。";
      statusEl.style.color = "#ffc28d";
    } else {
      statusEl.style.removeProperty("color");
    }
    close.sync();
  }
  function applyPreview() {
    const previewKeys = fields.preview.checked ? activeEditKeys() : null;
    getRegionLighting()?.setPreview?.(previewKeys);
    host.invalidateRegionLighting?.();
    wake();
  }
  function applyOverrides(patch, commit = false) {
    if (selectedRegion()) {
      for (const editKey of activeEditKeys()) {
        const width = regions.find(key => key.key === editKey);
        const shape = {
          width: width.width,
          depth: width.depth,
          rotation: width.rotation,
          softness: width.softness,
          shape: width.shape,
          offsetX: width.offsetX || 0,
          offsetZ: width.offsetZ || 0,
          moveCenterEnabled: width.moveCenterEnabled === true,
          ...(overrides[editKey] || {}),
          ...patch
        };
        shape.shape = ["square", "strip"].includes(shape.shape) ? "square" : "circle";
        overrides[editKey] = shape;
      }
      getRegionLighting()?.setOverrides?.(overrides);
      host.invalidateRegionLighting?.();
      wake();
      refreshRegions();
      syncForm();
      redrawOverlay();
      if (commit) {
        emitChange();
      }
    }
  }
  function emitChange() {
    overrides = cloneJson(getRegionLighting()?.getOverrides?.() || overrides);
    onChange(cloneJson(overrides));
  }
  function projectWorldToEditor(worldX, worldY, worldZ) {
    const left = host.canvas.getBoundingClientRect();
    const rect = editorEl.getBoundingClientRect();
    const x3 = new THREE.Vector3(worldX, worldY, worldZ).project(host.camera);
    return [left.left - rect.left + (x3.x + 1) * left.width / 2, left.top - rect.top + (1 - x3.y) * left.height / 2];
  }
  function planeHeight() {
    return toFiniteNumber(host.worldPoint?.(selectedFloorId, 0, 0, 0.065)?.y, 0.065);
  }
  function offsetOnPlaneToEditor(center, localX, localZ, heightY) {
    const [axisXComp, axisZComp] = center.axis;
    return projectWorldToEditor(center.center[0] + localX * axisXComp - localZ * axisZComp, heightY, center.center[2] + localX * axisZComp + localZ * axisXComp);
  }
  function createSvgNode(tagName, attrs, append = svg) {
    const setAttribute = doc.createElementNS(SVG_NS, tagName);
    for (const [attrName, attrValue] of Object.entries(attrs || {})) {
      setAttribute.setAttribute(attrName, String(attrValue));
    }
    append.append(setAttribute);
    return setAttribute;
  }
  function regionPathData(shape, pathHeight, scale = 1) {
    const halfWidth = shape.width * scale / 2;
    const halfDepth = shape.depth * scale / 2;
    const push = [];
    if (shape.shape === "square") {
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz], pointIndex) => {
        const value = offsetOnPlaneToEditor(shape, sx * halfWidth, sz * halfDepth, pathHeight);
        return "" + (pointIndex ? "L" : "M") + value[0].toFixed(2) + "," + value[1].toFixed(2);
      }).join("") + "Z";
    }
    for (let seg = 0; seg < 64; seg += 1) {
      const theta = seg * Math.PI * 2 / 64;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const minHalf = Math.min(halfWidth, halfDepth);
      const ellipseX = shape.shape === "strip" ? Math.sign(cosT) * (halfWidth - minHalf) + cosT * minHalf : cosT * halfWidth;
      const ellipseZ = shape.shape === "strip" ? Math.sign(sinT) * (halfDepth - minHalf) + sinT * minHalf : sinT * halfDepth;
      push.push(offsetOnPlaneToEditor(shape, ellipseX, ellipseZ, pathHeight));
    }
    return push.map((pt, ptIndex) => "" + (ptIndex ? "L" : "M") + pt[0].toFixed(2) + "," + pt[1].toFixed(2)).join("") + "Z";
  }
  function redrawOverlay() {
    if (!editorOpen || !host.camera) {
      return;
    }
    host.camera.updateMatrixWorld();
    const width = editorEl.getBoundingClientRect();
    const drawHeight = planeHeight();
    svg.setAttribute("viewBox", "0 0 " + (width.width || 1) + " " + (width.height || 1));
    svg.replaceChildren();
    const rangesGroup = createSvgNode("g");
    const markersGroup = createSvgNode("g");
    const depth = selectedRegion();
    const has = new Set(regionsInGroup(depth).map(key => key.key));
    const floorRegions = regions.filter(floorId => String(floorId.floorId) === selectedFloorId).sort((key, keyRight) => +(key.key === selectedKey) - +(keyRight.key === selectedKey));
    for (const key of floorRegions) {
      const isSelected = key.key === selectedKey;
      const inGroup = has.has(key.key);
      if (isSelected || inGroup) {
        createSvgNode("path", {
          ...(isSelected && key.moveCenterEnabled ? {
            "data-range-handle": "move",
            cursor: "move"
          } : {}),
          d: regionPathData(key, drawHeight),
          fill: isSelected ? "#edb06012" : "none",
          stroke: isSelected ? "#f2b768" : "#99afc0",
          "stroke-width": isSelected ? 1.6 : 1,
          "stroke-dasharray": isSelected ? "none" : "4 4",
          opacity: isSelected ? 1 : 0.45
        }, rangesGroup);
      }
      if (isSelected) {
        createSvgNode("path", {
          d: regionPathData(key, drawHeight, Math.max(0.05, 1 - key.softness)),
          fill: "none",
          stroke: "#efb56f",
          "stroke-width": 1,
          "stroke-dasharray": "3 5",
          opacity: 0.42
        }, rangesGroup);
      }
      const lampPos = key.lampCenter || key.center;
      const [cx, cy] = projectWorldToEditor(lampPos[0], drawHeight, lampPos[2]);
      const markerGroup = createSvgNode("g", {
        "data-region-key": key.key,
        role: "button",
        tabindex: "0",
        "aria-label": "选择" + key.fixtureLabel
      }, markersGroup);
      createSvgNode("circle", {
        cx,
        cy,
        r: 12,
        fill: "transparent"
      }, markerGroup);
      createSvgNode("circle", {
        cx,
        cy,
        r: isSelected ? 5 : 3.8,
        fill: isSelected ? "#ffd498" : "#e9f0f5",
        stroke: isSelected ? "#a87029" : "#536777",
        "stroke-width": 1.7,
        class: "p2r-marker"
      }, markerGroup);
      const textContent = createSvgNode("title", {}, markerGroup);
      textContent.textContent = key.fixtureLabel;
    }
    if (!depth) {
      return;
    }
    const centerScreen = offsetOnPlaneToEditor(depth, 0, 0, drawHeight);
    const lampWorld = depth.lampCenter || depth.center;
    const lampScreen = projectWorldToEditor(lampWorld[0], drawHeight, lampWorld[2]);
    if (depth.offsetX || depth.offsetZ) {
      createSvgNode("line", {
        x1: lampScreen[0],
        y1: lampScreen[1],
        x2: centerScreen[0],
        y2: centerScreen[1],
        stroke: "#e8b76e",
        "stroke-width": 1,
        "stroke-dasharray": "4 4",
        "pointer-events": "none"
      });
    }
    if (depth.moveCenterEnabled) {
      const [cx, cy] = centerScreen;
      const moveHandle = createSvgNode("g", {
        "data-range-handle": "move",
        role: "button",
        tabindex: "0",
        "aria-label": "拖动光区中心",
        cursor: "move"
      });
      createSvgNode("circle", {
        cx: cx,
        cy: cy,
        r: 14,
        fill: "#edb06033",
        stroke: "#f2b768"
      }, moveHandle);
      createSvgNode("path", {
        d: "M" + (cx - 8) + "," + cy + "H" + (cx + 8) + "M" + cx + "," + (cy - 8) + "V" + (cy + 8),
        stroke: "#ffe0ad",
        "stroke-width": 2,
        fill: "none"
      }, moveHandle);
    }
    const push = [["nw", -1, -1], ["ne", 1, -1], ["se", 1, 1], ["sw", -1, 1]];
    push.push(["w", -1, 0], ["e", 1, 0], ["n", 0, -1], ["s", 0, 1]);
    for (const [data_range_handle, hx, hz] of push) {
      const [cx, cy] = offsetOnPlaneToEditor(depth, hx * depth.width / 2, hz * depth.depth / 2, drawHeight);
      const resizeHandle = createSvgNode("g", {
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
      createSvgNode("circle", {
        cx: cx,
        cy: cy,
        r: 13,
        fill: "transparent"
      }, resizeHandle);
      createSvgNode("rect", {
        x: cx - 4.5,
        y: cy - 4.5,
        width: 9,
        height: 9,
        rx: 2,
        fill: "#ffe0ad",
        stroke: "#9f6e33",
        "stroke-width": 1.2,
        class: "p2r-handle"
      }, resizeHandle);
    }
    const rotateOrigin = offsetOnPlaneToEditor(depth, 0, 0, drawHeight);
    const rotateEdge = offsetOnPlaneToEditor(depth, 0, -depth.depth / 2, drawHeight);
    const rotateDx = rotateEdge[0] - rotateOrigin[0];
    const rotateDy = rotateEdge[1] - rotateOrigin[1];
    const rotateLen = Math.max(1, Math.hypot(rotateDx, rotateDy));
    const rotateHandlePos = [rotateEdge[0] + rotateDx / rotateLen * 27, rotateEdge[1] + rotateDy / rotateLen * 27];
    createSvgNode("line", {
      x1: rotateEdge[0],
      y1: rotateEdge[1],
      x2: rotateHandlePos[0],
      y2: rotateHandlePos[1],
      stroke: "#eabc7b",
      "stroke-width": 1.2
    });
    const rotateHandle = createSvgNode("g", {
      "data-range-handle": "rotate",
      role: "button",
      tabindex: "0",
      "aria-label": "拖动旋转照射范围"
    });
    createSvgNode("circle", {
      cx: rotateHandlePos[0],
      cy: rotateHandlePos[1],
      r: 14,
      fill: "transparent"
    }, rotateHandle);
    createSvgNode("circle", {
      cx: rotateHandlePos[0],
      cy: rotateHandlePos[1],
      r: 5,
      fill: "#f3c581",
      stroke: "#956527",
      "stroke-width": 1.2,
      class: "p2r-handle"
    }, rotateHandle);
  }
  function pickGroundPoint(clientX) {
    const width = host.canvas.getBoundingClientRect();
    if (!width.width || !width.height) {
      return null;
    } else {
      pointerNdc.set((clientX.clientX - width.left) / width.width * 2 - 1, 1 - (clientX.clientY - width.top) / width.height * 2);
      raycaster.setFromCamera(pointerNdc, host.camera);
      groundPlane.constant = -planeHeight();
      return raycaster.ray.intersectPlane(groundPlane, new THREE.Vector3());
    }
  }
  function onOverlayPointerDown(target) {
    if (target.button !== 0 || !editorOpen) {
      return;
    }
    const dataset = target.target.closest?.("[data-range-handle]");
    if (dataset && selectedRegion()) {
      if (dataset.dataset.rangeHandle === "move" && !selectedRegion().moveCenterEnabled) {
        return;
      }
      target.preventDefault();
      target.stopPropagation();
      dataset.focus?.();
      const dragRegion = selectedRegion();
      const point = pickGroundPoint(target);
      if (!point) {
        return;
      }
      dragState = {
        pointerId: target.pointerId,
        handle: dataset.dataset.rangeHandle,
        region: cloneJson(dragRegion),
        point: point,
        initial: cloneJson(overrides),
        changed: false
      };
      svg.setPointerCapture(target.pointerId);
    } else {
      const dataset = target.target.closest?.("[data-region-key]");
      if (dataset) {
        target.preventDefault();
        selectRegion(dataset.dataset.regionKey);
      }
    }
  }
  function onOverlayPointerMove(shiftKey) {
    if (!dragState || shiftKey.pointerId !== dragState.pointerId) {
      return;
    }
    const x4 = pickGroundPoint(shiftKey);
    if (!x4) {
      return;
    }
    shiftKey.preventDefault();
    const center = dragState.region;
    const [dragAxisX, dragAxisZ] = center.axis;
    const deltaX = x4.x - center.center[0];
    const deltaZ = x4.z - center.center[2];
    if (dragState.handle === "move") {
      applyOverrides({
        offsetX: round(clamp((center.offsetX || 0) + x4.x - dragState.point.x, -100, 100)),
        offsetZ: round(clamp((center.offsetZ || 0) + x4.z - dragState.point.z, -100, 100))
      });
    } else if (dragState.handle === "rotate") {
      const startAngle = Math.atan2(dragState.point.z - center.center[2], dragState.point.x - center.center[0]);
      const deltaAngle = Math.atan2(deltaZ, deltaX) - startAngle;
      let nextRotation = center.rotation + deltaAngle * 180 / Math.PI;
      nextRotation = ((nextRotation + 180) % 360 + 360) % 360 - 180;
      if (shiftKey.shiftKey) {
        nextRotation = Math.round(nextRotation / 15) * 15;
      }
      applyOverrides({
        rotation: round(nextRotation)
      });
    } else {
      const measuredWidth = Math.abs(deltaX * dragAxisX + deltaZ * dragAxisZ) * 2;
      const measuredDepth = Math.abs(-deltaX * dragAxisZ + deltaZ * dragAxisX) * 2;
      applyOverrides(resizeRegionDimensions(center, measuredWidth, measuredDepth, dragState.handle, shiftKey.shiftKey));
    }
    dragState.changed = true;
  }
  function endDrag(pointerId, cancel = false) {
    if (!dragState || pointerId && pointerId.pointerId !== dragState.pointerId) {
      return;
    }
    const pointerIdCurrent = dragState;
    dragState = null;
    if (svg.hasPointerCapture(pointerIdCurrent.pointerId)) {
      svg.releasePointerCapture(pointerIdCurrent.pointerId);
    }
    if (cancel) {
      overrides = pointerIdCurrent.initial;
      getRegionLighting()?.setOverrides?.(overrides);
      host.invalidateRegionLighting?.();
      refreshRegions();
      syncForm();
      redrawOverlay();
    } else if (pointerIdCurrent.changed) {
      emitChange();
    }
  }
  function selectRegion(regionKey) {
    if (dragState) {
      endDrag(null);
    }
    selectedKey = regionKey;
    syncForm();
    applyPreview();
    redrawOverlay();
  }
  function disableOrbitControls() {
    if (host.controls) {
      host.controls.enabled = false;
    }
  }
  function boundsOnAxes(axisX, axisZ) {
    const walls = findFloor(selectedFloorId)?.scene;
    const push = [];
    const pushCorner = (planX, planY, radius = 0) => {
      if (!Number.isFinite(Number(planX)) || !Number.isFinite(Number(planY))) {
        return;
      }
      const point = host.worldPoint?.(selectedFloorId, Number(planX), Number(planY), 0.065);
      if (point) {
        push.push({
          point,
          radius
        });
      }
    };
    for (const start of walls?.walls || []) {
      const halfThickness = Math.max(0, toFiniteNumber(start.thickness, 0.12)) / 2;
      pushCorner(start.start?.x, start.start?.y, halfThickness);
      pushCorner(start.end?.x, start.end?.y, halfThickness);
    }
    if (!push.length) {
      for (const x2 of walls?.items || []) {
        const x = host.worldPoint?.(selectedFloorId, x2.x, x2.y, 0.065);
        if (!x) {
          continue;
        }
        const itemRot = toFiniteNumber(x2.rotation) * Math.PI / 180;
        const itemCos = Math.cos(itemRot);
        const itemSin = Math.sin(itemRot);
        for (const signX of [-1, 1]) {
          for (const signZ of [-1, 1]) {
            const localOffsetX = signX * Math.max(0.1, toFiniteNumber(x2.width, 0.5)) / 2;
            const localOffsetZ = signZ * Math.max(0.1, toFiniteNumber(x2.depth, 0.5)) / 2;
            push.push({
              point: new THREE.Vector3(x.x + localOffsetX * itemCos - localOffsetZ * itemSin, x.y, x.z + localOffsetX * itemSin + localOffsetZ * itemCos),
              radius: 0
            });
          }
        }
      }
    }
    if (!push.length) {
      for (const center of regions.filter(floorId => String(floorId.floorId) === selectedFloorId)) {
        push.push({
          point: new THREE.Vector3().fromArray(center.center),
          radius: 0.5
        });
      }
    }
    if (!push.length) {
      push.push({
        point: new THREE.Vector3(0, 0, 0),
        radius: 2.5
      });
    }
    let left = Infinity;
    let right = -Infinity;
    let bottom = Infinity;
    let top = -Infinity;
    for (const {
      point: dot,
      radius: padRadius
    } of push) {
      const projX = dot.dot(axisX);
      const projZ = dot.dot(axisZ);
      left = Math.min(left, projX - padRadius);
      right = Math.max(right, projX + padRadius);
      bottom = Math.min(bottom, projZ - padRadius);
      top = Math.max(top, projZ + padRadius);
    }
    return {
      left: left,
      right: right,
      bottom,
      top
    };
  }
  function fitTopView() {
    if (!editorOpen || !topViewCamera || fittingCamera) {
      return;
    }
    const width = editorEl.getBoundingClientRect();
    const top = panelEl.getBoundingClientRect();
    if (!(width.width < 2) && !(width.height < 2)) {
      fittingCamera = true;
      try {
        const rect = width.width <= 620 ? {
          x: 14,
          y: 52,
          width: width.width - 28,
          height: Math.max(70, top.top - width.top - 62)
        } : {
          x: 18,
          y: 68,
          width: Math.max(70, top.left - width.left - 35),
          height: Math.max(70, width.height - 115)
        };
        const target = cloneJson(topViewCamera);
        const clone = new THREE.Vector3().fromArray(topViewCamera.up || [0, 0, -1]).normalize();
        const viewForward = new THREE.Vector3().fromArray(topViewCamera.target).sub(new THREE.Vector3().fromArray(topViewCamera.position)).normalize();
        const normalize = new THREE.Vector3().crossVectors(viewForward, clone).normalize();
        const right = boundsOnAxes(normalize, clone);
        const spanX = Math.max(1, right.right - right.left);
        const spanZ = Math.max(1, right.top - right.bottom);
        const worldPerPixel = Math.max((spanX + 0.4) / rect.width, (spanZ + 0.4) / rect.height) * 1.08;
        const offsetPxX = rect.x + rect.width / 2 - width.width / 2;
        const offsetPxY = rect.y + rect.height / 2 - width.height / 2;
        const y = normalize.clone().multiplyScalar((right.left + right.right) / 2).add(clone.clone().multiplyScalar((right.bottom + right.top) / 2));
        y.y = planeHeight() + 0.6;
        y.addScaledVector(normalize, -offsetPxX * worldPerPixel).addScaledVector(clone, offsetPxY * worldPerPixel);
        target.target = y.toArray();
        target.position = y.clone().addScaledVector(viewForward, -Math.max(20, spanX * 2, spanZ * 2)).toArray();
        target.frameSize = worldPerPixel * Math.min(width.width, width.height);
        target.zoom = 1;
        host.restoreCamera(target);
        disableOrbitControls();
        host.invalidateRegionLighting?.();
        wake();
        lastFitWidth = width.width;
        lastFitHeight = width.height;
        redrawOverlay();
      } finally {
        fittingCamera = false;
      }
    }
  }
  function scheduleRedraw({
    fit: fit = false
  } = {}) {
    if (editorOpen) {
      pendingFit ||= fit;
      if (redrawRaf) {
        win.cancelAnimationFrame(redrawRaf);
      }
      redrawRaf = win.requestAnimationFrame(() => {
        redrawRaf = 0;
        const shouldFit = pendingFit;
        pendingFit = false;
        if (editorOpen) {
          refreshRegions();
          syncForm();
          if (shouldFit) {
            fitTopView();
          } else {
            redrawOverlay();
          }
        }
      });
    }
  }
  function selectFloor(floorIdValue) {
    if (dragState) {
      endDrag(null);
    }
    selectedFloorId = String(floorIdValue);
    selectedKey = "";
    host.setFloor(selectedFloorId);
    host.setCameraProjection("orthographic");
    host.topView();
    topViewCamera = cloneJson(host.cameraState(true));
    disableOrbitControls();
    host.invalidateRegionLighting?.();
    refreshRegions();
    syncForm();
    applyPreview();
    scheduleRedraw({
      fit: true
    });
  }
  function onFieldChange(target) {
    const fieldEl = target.target;
    const fieldName = fieldEl.dataset.field;
    if (fieldName === "floor") {
      return selectFloor(fieldEl.value);
    }
    if (fieldName === "fixture") {
      return selectRegion(fieldEl.value);
    }
    if (fieldName === "group" || fieldName === "preview") {
      syncForm();
      applyPreview();
      redrawOverlay();
      return;
    }
    if (fieldName === "moveCenter") {
      return applyOverrides({
        moveCenterEnabled: fieldEl.checked
      }, true);
    }
    if (fieldName === "shape") {
      return applyOverrides({
        shape: fieldEl.value
      }, true);
    }
    if (fieldName === "softness") {
      return applyOverrides({
        softness: clamp(toFiniteNumber(fieldEl.value, 35) / 100, 0.05, 1)
      }, true);
    }
    if (["width", "depth", "rotation"].includes(fieldName)) {
      const prevFieldValue = selectedRegion()?.[fieldName];
      const parsedFieldValue = fieldEl.value.trim() === "" ? prevFieldValue : toFiniteNumber(fieldEl.value, prevFieldValue);
      fieldEl.value = round(clamp(parsedFieldValue, fieldName === "rotation" ? -180 : 0.5, fieldName === "rotation" ? 180 : 20));
      applyOverrides({
        [fieldName]: Number(fieldEl.value)
      }, true);
    }
  }
  function onEditorKeyDown(key) {
    if (!editorOpen || key.defaultPrevented) {
      return;
    }
    if (key.key === "Escape") {
      key.preventDefault();
      key.stopPropagation();
      closeEditor();
      return;
    }
    const dataset = key.target.closest?.("[data-region-key]");
    if (dataset && ["Enter", " "].includes(key.key)) {
      key.preventDefault();
      selectRegion(dataset.dataset.regionKey);
    }
    const datasetCurrent = key.target.closest?.("[data-range-handle]");
    if (!datasetCurrent || !selectedRegion() || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key.key)) {
      return;
    }
    key.preventDefault();
    const stepSign = ["ArrowUp", "ArrowRight"].includes(key.key) ? 1 : -1;
    if (datasetCurrent.dataset.rangeHandle === "move") {
      if (!selectedRegion().moveCenterEnabled) {
        return;
      }
      const offsetAxis = ["ArrowLeft", "ArrowRight"].includes(key.key) ? "offsetX" : "offsetZ";
      const offsetSign = ["ArrowRight", "ArrowDown"].includes(key.key) ? 1 : -1;
      applyOverrides({
        [offsetAxis]: round(clamp((selectedRegion()[offsetAxis] || 0) + offsetSign * (key.shiftKey ? 0.5 : 0.1), -100, 100))
      }, true);
    } else if (datasetCurrent.dataset.rangeHandle === "rotate") {
      applyOverrides({
        rotation: clamp(selectedRegion().rotation + stepSign * (key.shiftKey ? 15 : 1), -180, 180)
      }, true);
    } else {
      const handleName = datasetCurrent.dataset.rangeHandle;
      const dimKey = ["w", "e"].includes(handleName) ? "width" : ["n", "s"].includes(handleName) ? "depth" : ["ArrowLeft", "ArrowRight"].includes(key.key) ? "width" : "depth";
      const width = selectedRegion();
      const options = {
        width: width.width,
        depth: width.depth,
        [dimKey]: width[dimKey] + stepSign * 0.1
      };
      applyOverrides(resizeRegionDimensions(width, options.width, options.depth, dimKey === "width" ? "e" : "s", key.shiftKey), true);
    }
  }
  function onActionClick(target) {
    const actionName = target.target.closest?.("[data-action]")?.dataset.action;
    if (actionName === "close") {
      closeEditor();
    }
    if (actionName === "reset-center") {
      applyOverrides({
        offsetX: 0,
        offsetZ: 0
      }, true);
    }
    if (actionName === "reset") {
      for (const resetKey of activeEditKeys()) {
        delete overrides[resetKey];
      }
      getRegionLighting()?.setOverrides?.(overrides);
      host.invalidateRegionLighting?.();
      wake();
      refreshRegions();
      syncForm();
      redrawOverlay();
      emitChange();
    }
  }
  editorEl.addEventListener("change", onFieldChange);
  editorEl.addEventListener("input", target => {
    if (target.target === fields.softness) {
      applyOverrides({
        softness: clamp(toFiniteNumber(fields.softness.value, 35) / 100, 0.05, 1)
      });
    }
  });
  editorEl.addEventListener("click", onActionClick);
  svg.addEventListener("pointerdown", onOverlayPointerDown);
  svg.addEventListener("pointermove", onOverlayPointerMove);
  svg.addEventListener("pointerup", pointerUpEvent => endDrag(pointerUpEvent));
  svg.addEventListener("pointercancel", pointerCancelEvent => endDrag(pointerCancelEvent, true));
  svg.addEventListener("lostpointercapture", lostCaptureEvent => endDrag(lostCaptureEvent));
  const resizeObserver = new win.ResizeObserver(() => {
    if (!editorOpen || fittingCamera) {
      return;
    }
    const width = editorEl.getBoundingClientRect();
    if (Math.abs(width.width - lastFitWidth) > 1 || Math.abs(width.height - lastFitHeight) > 1) {
      scheduleRedraw({
        fit: true
      });
    } else {
      scheduleRedraw();
    }
  });
  resizeObserver.observe(host.container);
  function open() {
    if (!editorOpen && !disposed) {
      if (!getRegionLighting()?.listRegions) {
        throw new Error("区域灯光尚未准备好，请稍后重试。");
      }
      savedFloorId = String(getConfig()?.floorSelection || host.document?.activeFloorId || host.document?.floors?.[0]?.id || "");
      savedControlsEnabled = host.controls?.enabled;
      savedCamera = cloneJson(host.cameraState(true));
      editorOpen = true;
      editorEl.hidden = false;
      overrides = cloneJson(getConfig()?.lightRegionOverrides || getRegionLighting()?.getOverrides?.() || {});
      getRegionLighting().setOverrides(overrides);
      selectedFloorId = savedFloorId === "all" ? String(host.document?.activeFloorId || host.document?.floors?.[0]?.id || "") : savedFloorId;
      host.setFloor(selectedFloorId);
      host.setCameraProjection("orthographic");
      host.topView();
      topViewCamera = cloneJson(host.cameraState(true));
      disableOrbitControls();
      doc.addEventListener("keydown", onEditorKeyDown, true);
      unsubscribeCamera = host.onCameraChange?.(() => {
        if (!fittingCamera) {
          scheduleRedraw();
        }
      });
      host.invalidateRegionLighting?.();
      refreshRegions();
      syncForm();
      applyPreview();
      scheduleRedraw({
        fit: true
      });
      editorEl.querySelector("[data-action=close]").focus({
        preventScroll: true
      });
    }
  }
  function closeEditor() {
    if (editorOpen) {
      close.close();
      endDrag(null);
      editorOpen = false;
      editorEl.hidden = true;
      if (redrawRaf) {
        win.cancelAnimationFrame(redrawRaf);
        redrawRaf = 0;
      }
      unsubscribeCamera?.();
      unsubscribeCamera = null;
      doc.removeEventListener("keydown", onEditorKeyDown, true);
      getRegionLighting()?.setPreview?.(null);
      host.setFloor(savedFloorId);
      host.restoreCamera(savedCamera);
      if (host.controls) {
        host.controls.enabled = savedControlsEnabled !== false;
      }
      host.invalidateRegionLighting?.();
      wake();
      topViewCamera = null;
      onClose();
    }
  }
  function refresh() {
    if (editorOpen) {
      scheduleRedraw();
    }
  }
  function setSaveStatus(message) {
    saveError = message ? String(message.message || message) : "";
    if (editorOpen) {
      syncForm();
    }
  }
  function dispose() {
    if (!disposed) {
      closeEditor();
      disposed = true;
      close.dispose();
      resizeObserver.disconnect();
      editorEl.remove();
    }
  }
  return {
    open,
    close: closeEditor,
    flush() {
      close.close();
      endDrag(null);
      emitChange();
    },
    isOpen: () => editorOpen,
    refresh,
    dispose,
    setSaveStatus
  };
}
export function mountRangeFormControls(formRoot) {
  const formDoc = formRoot.ownerDocument;
  const formWin = formDoc.defaultView;
  const customSelects = [];
  const numberControls = [];
  const listenerCleanups = [];
  let openSelect = null;
  let stopRepeat = null;
  const createEl = (tag, element) => {
    const className = formDoc.createElement(tag);
    className.className = element;
    return className;
  };
  const listen = (addEventListener, eventName, handler, listenOpts) => {
    addEventListener.addEventListener(eventName, handler, listenOpts);
    listenerCleanups.push(() => addEventListener.removeEventListener(eventName, handler, listenOpts));
  };
  function closeMenu(restoreFocus = false) {
    if (!openSelect) {
      return;
    }
    const button = openSelect;
    openSelect = null;
    button.menu.hidden = true;
    button.button.setAttribute("aria-expanded", "false");
    if (restoreFocus) {
      button.button.focus({
        preventScroll: true
      });
    }
  }
  function positionMenu() {
    if (!openSelect) {
      return;
    }
    const {
      button: getBoundingClientRect,
      menu: style
    } = openSelect;
    const width = getBoundingClientRect.getBoundingClientRect();
    const maxMenuHeight = Math.max(40, Math.min(320, formWin.innerHeight - 16));
    Object.assign(style.style, {
      width: width.width + "px",
      maxHeight: maxMenuHeight + "px",
      left: Math.max(8, Math.min(formWin.innerWidth - width.width - 8, width.left)) + "px"
    });
    const menuHeight = Math.min(style.scrollHeight, maxMenuHeight);
    style.style.top = (width.bottom + menuHeight + 12 <= formWin.innerHeight ? width.bottom + 4 : Math.max(8, width.top - menuHeight - 4)) + "px";
  }
  function syncCustomSelect(signature) {
    const {
      select: disabled,
      button: textContent,
      menu: replaceChildren
    } = signature;
    textContent.textContent = disabled.selectedOptions[0]?.textContent || "请选择";
    textContent.disabled = disabled.disabled;
    textContent.setAttribute("aria-label", disabled.getAttribute("aria-label") || "打开选择菜单");
    const stringify = JSON.stringify([...disabled.options].map(opt => [opt.value, opt.textContent, opt.disabled, opt.hidden]));
    if (stringify !== signature.signature) {
      signature.signature = stringify;
      replaceChildren.replaceChildren(...[...disabled.options].filter(hidden => !hidden.hidden).map(nativeOpt => {
        const type = createEl("button", "custom-select-option");
        type.type = "button";
        type.dataset.value = nativeOpt.value;
        type.setAttribute("role", "option");
        type.textContent = nativeOpt.textContent;
        type.disabled = nativeOpt.disabled;
        return type;
      }));
    }
    for (const dataset of replaceChildren.children) {
      dataset.classList.toggle("active", dataset.dataset.value === disabled.value);
      dataset.setAttribute("aria-selected", String(dataset.dataset.value === disabled.value));
    }
    if (disabled.disabled && openSelect === signature) {
      closeMenu();
    }
  }
  function openMenu(menu, focusOption = false) {
    closeMenu();
    syncCustomSelect(menu);
    if (!menu.select.disabled) {
      openSelect = menu;
      menu.menu.hidden = false;
      menu.button.setAttribute("aria-expanded", "true");
      positionMenu();
      if (focusOption) {
        (menu.menu.querySelector(".active:not(:disabled)") || menu.menu.querySelector("button:not(:disabled)"))?.focus({
          preventScroll: true
        });
      }
    }
  }
  function chooseOption(select, disabled) {
    if (!disabled || disabled.disabled || select.select.disabled) {
      return;
    }
    const prevSelectValue = select.select.value;
    select.select.value = disabled.dataset.value;
    closeMenu(true);
    if (prevSelectValue !== select.select.value) {
      select.select.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }
    syncCustomSelect(select);
  }
  for (const before of formRoot.querySelectorAll("select")) {
    const append = createEl("span", "custom-select");
    const setAttribute = createEl("button", "custom-select-button");
    const id = createEl("div", "custom-select-menu");
    before.before(append);
    append.append(before, setAttribute);
    formRoot.append(id);
    before.classList.add("native-select-control");
    before.tabIndex = -1;
    before.setAttribute("aria-hidden", "true");
    setAttribute.type = "button";
    setAttribute.setAttribute("aria-haspopup", "listbox");
    setAttribute.setAttribute("aria-expanded", "false");
    id.id = "range-select-" + before.dataset.field + "-menu";
    id.setAttribute("role", "listbox");
    id.hidden = true;
    setAttribute.setAttribute("aria-controls", id.id);
    id.setAttribute("aria-label", before.getAttribute("aria-label") || "选项");
    const selectUi = {
      select: before,
      openSelect: append,
      button: setAttribute,
      menu: id
    };
    customSelects.push(selectUi);
    syncCustomSelect(selectUi);
    listen(setAttribute, "click", preventDefault => {
      preventDefault.preventDefault();
      if (openSelect === selectUi) {
        closeMenu();
      } else {
        openMenu(selectUi);
      }
    });
    listen(id, "click", preventDefault => {
      preventDefault.preventDefault();
      chooseOption(selectUi, preventDefault.target.closest(".custom-select-option"));
    });
    listen(before, "change", () => syncCustomSelect(selectUi));
  }
  function stepNumberInput(numberInput, stepDir) {
    if (numberInput.disabled || numberInput.readOnly) {
      return false;
    }
    const prevNumberValue = numberInput.value;
    try {
      if (stepDir > 0) {
        numberInput.stepUp();
      } else {
        numberInput.stepDown();
      }
    } catch {
      return false;
    }
    if (prevNumberValue === numberInput.value) {
      return false;
    } else {
      numberInput.dispatchEvent(new Event("input", {
        bubbles: true
      }));
      numberInput.dispatchEvent(new Event("change", {
        bubbles: true
      }));
      return true;
    }
  }
  for (const before of formRoot.querySelectorAll("input[type=number]")) {
    const append = createEl("span", "inspector-number-control");
    const el = createEl("span", "inspector-number-steppers");
    before.before(append);
    append.append(before, el);
    const push = [];
    for (const [stepDelta, title, iconPath] of [[1, "增加数值", "M1 5 5 1l4 4"], [-1, "减少数值", "M1 1 5 5l4-4"]]) {
      const type = createEl("button", "inspector-number-stepper");
      type.type = "button";
      type.tabIndex = -1;
      type.setAttribute("aria-label", title);
      type.title = title;
      type.innerHTML = "<svg viewBox=\"0 0 10 6\" aria-hidden=\"true\"><path d=\"" + iconPath + "\"></path></svg>";
      el.append(type);
      push.push(type);
      listen(type, "click", preventDefault => {
        preventDefault.preventDefault();
        if (preventDefault.detail === 0) {
          stepNumberInput(before, stepDelta);
        }
      });
      listen(type, "pointerdown", button => {
        if (button.button !== 0 || before.disabled || before.readOnly) {
          return;
        }
        button.preventDefault();
        stopRepeat?.();
        before.focus({
          preventScroll: true
        });
        stepNumberInput(before, stepDelta);
        let repeatTimeout;
        let repeatInterval;
        stopRepeat = () => {
          formWin.clearTimeout(repeatTimeout);
          formWin.clearInterval(repeatInterval);
          stopRepeat = null;
        };
        repeatTimeout = formWin.setTimeout(() => {
          repeatInterval = formWin.setInterval(() => stepNumberInput(before, stepDelta), 55);
        }, 320);
        try {
          type.setPointerCapture(button.pointerId);
        } catch {}
      });
      for (const releaseEvent of ["pointerup", "pointercancel", "lostpointercapture"]) {
        listen(type, releaseEvent, () => stopRepeat?.());
      }
    }
    listen(before, "keydown", key => {
      if (["ArrowUp", "ArrowDown"].includes(key.key)) {
        key.preventDefault();
        stepNumberInput(before, key.key === "ArrowUp" ? 1 : -1);
      }
    });
    numberControls.push({
      field: before,
      peers: push
    });
  }
  function onSelectKeyDown(key) {
    const menu = customSelects.find(button => button.button === key.target || button.menu.contains(key.target));
    if (!menu) {
      return;
    }
    if (key.key === "Escape" && openSelect) {
      key.preventDefault();
      key.stopImmediatePropagation();
      closeMenu(true);
      return;
    }
    if (key.key === "Tab") {
      closeMenu();
      return;
    }
    if (!["ArrowUp", "ArrowDown", "Home", "End", "Enter", " "].includes(key.key)) {
      return;
    }
    key.preventDefault();
    key.stopImmediatePropagation();
    if (openSelect !== menu) {
      openMenu(menu, true);
      return;
    }
    if (["Enter", " "].includes(key.key)) {
      chooseOption(menu, key.target.closest(".custom-select-option") || menu.menu.querySelector(".active"));
      return;
    }
    const length = [...menu.menu.children].filter(disabled => !disabled.disabled);
    const activeIndex = length.indexOf(formDoc.activeElement);
    const nextIndex = key.key === "Home" ? 0 : key.key === "End" ? length.length - 1 : (activeIndex + (key.key === "ArrowUp" ? -1 : 1) + length.length) % length.length;
    length[nextIndex]?.focus();
  }
  listen(formDoc, "keydown", onSelectKeyDown, true);
  listen(formDoc, "pointerdown", target => {
    if (openSelect && !openSelect.wrapper.contains(target.target) && !openSelect.menu.contains(target.target)) {
      closeMenu();
    }
  }, true);
  listen(formWin, "resize", () => closeMenu());
  listen(formWin, "blur", () => {
    stopRepeat?.();
    closeMenu();
  });
  listen(formDoc, "visibilitychange", () => {
    if (formDoc.hidden) {
      stopRepeat?.();
      closeMenu();
    }
  });
  listen(formRoot.querySelector(".p2r-panel"), "scroll", () => closeMenu(), {
    passive: true
  });
  return {
    sync() {
      customSelects.forEach(syncCustomSelect);
      for (const {
        field: disabledCurrent,
        peers: stepperButtons
      } of numberControls) {
        for (const disabled of stepperButtons) {
          disabled.disabled = disabledCurrent.disabled || disabledCurrent.readOnly;
        }
      }
    },
    close() {
      closeMenu();
      stopRepeat?.();
    },
    dispose() {
      closeMenu();
      stopRepeat?.();
      listenerCleanups.forEach(cleanup => cleanup());
      customSelects.forEach(menu => menu.menu.remove());
    }
  };
}
