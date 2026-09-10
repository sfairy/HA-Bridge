import { openPresenceFocusEditor } from "./presence-focus-editor.js?v=20260910-dashboard-aspect-v1";
import { mountInteraction3d } from "./runtime.js";
import { validPresenceRoute, snapsToPresenceStart, PRESENCE_PAGES } from "./presence-motion.js";
import { DESIGNS, createWalker, animateWalker, disposeWalker } from "./presence-character.js";
import { randomUuid } from "/bridge-static/utils/random-id.js";
export async function openPresenceEditor({
  component,
  panelDocument,
  floors = [],
  entities = [],
  pickers,
  onSave
}) {
  const doc = window.document;
  const security = structuredClone(component.properties || {});
  security.security = {
    ...security.security,
    presenceSensors: structuredClone(security.security?.presenceSensors || [])
  };
  const presenceSensors = security.security.presenceSensors;
  const entityNames = new Map(entities.map(entity => [entity.entityId, entity.name]));
  for (const sensor of presenceSensors) {
    Object.assign(sensor, {
      character: sensor.character ?? "traveler",
      color: sensor.color ?? "cyan",
      speed: sensor.speed ?? 0.45,
      size: sensor.size ?? 1,
      displayDuration: sensor.entityId?.startsWith("event.") ? sensor.displayDuration > 0 ? sensor.displayDuration : 30 : sensor.displayDuration ?? 0
    });
  }
  const el = (tag, text, className) => {
    const node = doc.createElement(tag);
    if (text) {
      node.textContent = text;
    }
    if (className) {
      node.className = className;
    }
    return node;
  };
  const svgEl = (tag, attrs) => {
    const node = doc.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [name, value] of Object.entries(attrs || {})) {
      node.setAttribute(name, value);
    }
    return node;
  };
  const stylesheet = el("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/api/v1/modules/interaction3d/presence-editor.css";
  const dialog = el("dialog", "", "i3d-editor i3d-presence-editor");
  dialog.setAttribute("aria-label", "配置安防");
  const previousFocus = doc.activeElement;
  let selected = presenceSensors[0] || null;
  let closed = false;
  let closedRoutes = new Set(presenceSensors.filter(sensor => sensor.routeClosed !== false && validPresenceRoute(sensor.route)).map(sensor => sensor.id));
  let dragPoint = null;
  let box;
  let preview = null;
  let previewKey = "";
  let rafId = 0;
  let lastFrameTime = 0;
  let walkPhase = 0;
  let animTime = 0;
  let focusCommand = null;
  let presented = false;
  let viewMode = "plan";
  let previewWalk = false;
  let showHitRange = false;
  let topViewTimer = 0;
  let pointerPlanPoint = null;
  let flushers = [];
  const flushInputs = () => {
    for (const flush of flushers) {
      flush();
    }
  };
  const status = el("span", "", "presence-status");
  status.setAttribute("role", "status");
  const button = (label, onClick) => {
    const btn = el("button", label);
    btn.type = "button";
    btn.addEventListener("click", onClick);
    return btn;
  };
  function close() {
    if (!closed) {
      closed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      clearTimeout(topViewTimer);
      focusCommand?.();
      doc.removeEventListener("visibilitychange", onVisibilityChange);
      if (preview) {
        disposeWalker(preview.root);
        preview.renderer.dispose();
        preview.renderer.forceContextLoss();
      }
      dialog.close();
      dialog.remove();
      stylesheet.remove();
      doc.dispatchEvent(new Event("hb-i3d-preview-scope"));
      previousFocus?.focus?.();
    }
  }
  const saveBtn = button("保存安防配置", async () => {
    flushInputs();
    for (const sensor of presenceSensors) {
      sensor.routeClosed = closedRoutes.has(sensor.id) && validPresenceRoute(sensor.route);
    }
    saveBtn.disabled = true;
    try {
      await onSave(structuredClone(security));
      if (!closed) {
        status.textContent = "已应用到编辑器，请在退出后保存仪表盘";
      }
    } catch (error) {
      if (!closed) {
        status.textContent = error.message || "保存失败，请重试。";
      }
    } finally {
      if (!closed) {
        saveBtn.disabled = false;
      }
    }
  });
  saveBtn.className = "primary";
  dialog.addEventListener("input", () => {
    status.textContent = "配置已修改，请保存安防配置。";
  });
  const header = el("header");
  header.append(el("strong", "配置安防"), status, saveBtn, button("退出", close));
  const body = el("div", "", "presence-body");
  const bindingsAside = el("aside", "", "presence-bindings");
  const controlsAside = el("aside", "", "presence-controls");
  const planSection = el("div", "", "presence-plan");
  const planTitle = el("strong", "行走路线");
  const planNote = el("p", "", "presence-note");
  const viewport = el("div", "", "presence-viewport");
  const runtimeHost = el("div", "", "presence-plan-runtime");
  const planSvg = svgEl("svg", {
    role: "img",
    "aria-label": "平面图行走路线",
    tabindex: "0"
  });
  const underlay = svgEl("g");
  const routeLayer = svgEl("g");
  planSvg.append(underlay, routeLayer);
  const routeTools = el("div", "", "presence-route-tools");
  routeTools.append(button("闭合路线", () => {
    if (selected && validPresenceRoute(selected.route)) {
      closedRoutes.add(selected.id);
      status.textContent = "";
      redrawPlan();
    } else {
      status.textContent = "至少绘制三个不共线的点，才能闭合路线。";
    }
  }), button("撤销一点", () => {
    if (selected) {
      closedRoutes.delete(selected.id);
      selected.route.pop();
      redrawPlan();
      syncRuntime();
    }
  }), button("重新绘制", () => {
    if (selected) {
      selected.route = [];
      closedRoutes.delete(selected.id);
      redrawPlan();
      syncRuntime();
    }
  }));
  const viewTools = el("div", "", "i3d-focus-actions presence-view-tools");
  const setViewMode = mode => {
    viewMode = mode;
    planSvg.toggleAttribute("hidden", mode !== "plan");
    routeTools.hidden = mode !== "plan";
    dragPoint = null;
    pointerPlanPoint = null;
    planBtn.setAttribute("aria-pressed", String(mode === "plan"));
    view3dBtn.setAttribute("aria-pressed", String(mode === "3d"));
    if (presented) {
      if (mode === "plan") {
        scheduleTopView();
      } else {
        focusCommand.focusCommand("presence-3d-view").catch(onLoadError);
      }
    }
    redrawPlan();
  };
  const planBtn = button("平面", () => setViewMode("plan"));
  const view3dBtn = button("3D", () => setViewMode("3d"));
  planBtn.setAttribute("aria-pressed", "true");
  view3dBtn.setAttribute("aria-pressed", "false");
  const previewWalkBtn = button("预览行走", () => {
    if (!selected || !closedRoutes.has(selected.id) || !validPresenceRoute(selected.route)) {
      status.textContent = "请先绘制路径并闭合，再预览行走。";
      return;
    }
    previewWalk = !previewWalk;
    previewWalkBtn.textContent = previewWalk ? "停止预览" : "预览行走";
    if (presented) {
      focusCommand.focusCommand("presence-preview-walk", "", previewWalk).catch(onLoadError);
    }
  });
  viewTools.append(planBtn, view3dBtn, previewWalkBtn);
  viewport.append(runtimeHost, planSvg);
  planSection.append(planTitle, planNote, viewTools, viewport, routeTools);
  body.append(bindingsAside, planSection, controlsAside);
  dialog.append(header, body);
  await new Promise((resolve, reject) => {
    stylesheet.addEventListener("load", resolve, {
      once: true
    });
    stylesheet.addEventListener("error", () => reject(new Error("安防样式加载失败，请重试。")), {
      once: true
    });
    doc.head.append(stylesheet);
  }).catch(error => {
    stylesheet.remove();
    throw error;
  });
  doc.body.append(dialog);
  dialog.dataset.i3dPreviewScope = "presence";
  function onLoadError(error) {
    if (!closed) {
      status.textContent = error.message || String(error);
    }
  }
  function activeFloor() {
    if (selected) {
      return floors.find(floor => floor.id === selected.floorId);
    } else {
      return floors.find(floor => floor.id === security.floorSelection) || floors[0];
    }
  }
  function scheduleTopView() {
    clearTimeout(topViewTimer);
    if (!!presented && !!activeFloor() && viewMode === "plan" && !!box) {
      topViewTimer = setTimeout(() => {
        const floor = activeFloor();
        if (!closed && presented && viewMode === "plan" && floor) {
          focusCommand.focusCommand("presence-top-view", "", {
            floorId: floor.id,
            box
          }).catch(onLoadError);
        }
      }, 30);
    }
  }
  function syncRuntime() {
    const floorSelection = activeFloor()?.id;
    if (!floorSelection) {
      return;
    }
    const properties = {
      ...structuredClone(security),
      floorSelection,
      camera: security.floorCameras?.[floorSelection] || (security.floorSelection === floorSelection ? security.camera : null),
      security: {
        presenceSensors: selected ? [{
          ...structuredClone(selected),
          routeClosed: closedRoutes.has(selected.id)
        }] : []
      },
      pageDimStrength: {
        overview: 0,
        security: 0
      },
      pageSaturation: {
        overview: 100,
        security: 100
      },
      autoRotate: {
        enabled: false
      }
    };
    if (focusCommand) {
      focusCommand.update(properties);
      return;
    }
    focusCommand = mountInteraction3d(runtimeHost, {
      component: {
        ...component,
        properties
      },
      context: {
        document: panelDocument,
        editable: true
      },
      editing: true,
      editingModule: "security",
      onPresented: () => {
        if (!closed) {
          presented = true;
          scheduleTopView();
          if (previewWalk) {
            focusCommand.focusCommand("presence-preview-walk", "", true).catch(onLoadError);
          }
          focusCommand.focusCommand("presence-show-hit-range", "", showHitRange).catch(onLoadError);
        }
      },
      onLoadError
    });
    doc.dispatchEvent(new Event("hb-i3d-preview-scope"));
  }
  function recomputeBox() {
    const floor = activeFloor();
    const points = [...(floor?.plan?.walls || []).flatMap(wall => [wall.start, wall.end]), ...(selected?.route || [])];
    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);
    const ppm = floor?.plan?.pixelsPerMeter || 100;
    const minX = points.length ? Math.min(...xs) : 0;
    const minY = points.length ? Math.min(...ys) : 0;
    const width = Math.max(ppm, points.length ? Math.max(...xs) - minX : ppm * 10);
    const height = Math.max(ppm, points.length ? Math.max(...ys) - minY : ppm * 8);
    const pad = Math.max(width, height) * 0.1;
    box = {
      x: minX - pad,
      y: minY - pad,
      w: width + pad * 2,
      h: height + pad * 2
    };
    redrawPlan();
  }
  function redrawPlan(scheduleView = true) {
    if (!box) {
      return;
    }
    const focusBtn = controlsAside.querySelector("[data-presence-focus]");
    if (focusBtn) {
      focusBtn.disabled = !selected || !closedRoutes.has(selected.id) || !validPresenceRoute(selected.route);
    }
    planSvg.setAttribute("viewBox", box.x + " " + box.y + " " + box.w + " " + box.h);
    underlay.replaceChildren();
    routeLayer.replaceChildren();
    const floor = activeFloor();
    previewWalkBtn.disabled = !selected || !closedRoutes.has(selected.id) || !validPresenceRoute(selected.route);
    for (const btn of routeTools.querySelectorAll("button")) {
      btn.disabled = !selected;
    }
    planNote.textContent = selected ? floor ? viewMode === "3d" ? "拖动旋转、滚轮缩放；调整人物大小，再预览行走效果。" : closedRoutes.has(selected.id) ? "路线已闭合 · 可拖动圆点调整路径；切换 3D 查看人物大小。" : "请绘制行走路径：依次点击至少三个点，靠近起点可吸附闭合。" : "请选择有效楼层。" : "添加人在传感器后，在顶视图中绘制行走路径。";
    planTitle.textContent = floor ? (floor.name || "楼层") + " · 行走路线" : "行走路线";
    if (scheduleView !== false) {
      scheduleTopView();
    }
    if (!selected) {
      return;
    }
    const stroke = selected.color === "orange" ? "#eaa044" : "#52b8b1";
    routeLayer.append(svgEl(closedRoutes.has(selected.id) ? "polygon" : "polyline", {
      points: selected.route.map(point => point.x + "," + point.y).join(" "),
      fill: closedRoutes.has(selected.id) ? stroke + "14" : "none",
      stroke,
      "stroke-width": 3,
      "vector-effect": "non-scaling-stroke",
      "pointer-events": "none",
      "stroke-linejoin": "round"
    }));
    const pixelScale = 1 / Math.max(0.0001, Math.abs(planSvg.getScreenCTM()?.a || 1));
    selected.route.forEach((point, pointIndex) => {
      routeLayer.append(svgEl("circle", {
        cx: point.x,
        cy: point.y,
        r: (pointIndex === 0 ? 8 : 6) * pixelScale,
        fill: pointIndex === 0 ? stroke : "#f7fafc",
        stroke,
        "stroke-width": 2,
        "vector-effect": "non-scaling-stroke",
        "data-point": pointIndex
      }));
      const label = svgEl("text", {
        x: point.x + pixelScale * 11,
        y: point.y - pixelScale * 9,
        fill: "#64748b",
        "font-size": pixelScale * 11,
        "pointer-events": "none"
      });
      label.textContent = String(pointIndex + 1);
      routeLayer.append(label);
    });
    if (!closedRoutes.has(selected.id) && pointerPlanPoint && selected.route.length) {
      const snapped = snapsToPresenceStart(selected.route, pointerPlanPoint, 1 / pixelScale);
      const hoverPoint = snapped ? selected.route[0] : pointerPlanPoint;
      const lastPoint = selected.route.at(-1);
      routeLayer.append(svgEl("line", {
        x1: lastPoint.x,
        y1: lastPoint.y,
        x2: hoverPoint.x,
        y2: hoverPoint.y,
        stroke,
        "stroke-width": 2,
        "stroke-dasharray": "5 4",
        "vector-effect": "non-scaling-stroke",
        "pointer-events": "none"
      }));
      if (snapped) {
        routeLayer.append(svgEl("circle", {
          cx: hoverPoint.x,
          cy: hoverPoint.y,
          r: pixelScale * 16,
          fill: stroke + "33",
          stroke,
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          "pointer-events": "none"
        }));
        planNote.textContent = "已吸附起点 · 点击即可闭合路线。";
      }
    }
  }
  function addField(label, control) {
    const field = el("label", "", "presence-field");
    field.append(el("span", label), control);
    controlsAside.append(field);
    return control;
  }
  function addNumberField(label, key, min, max, step, displayScale = 1) {
    const input = el("input");
    Object.assign(input, {
      type: "number",
      min,
      max,
      step,
      value: selected[key] * displayScale
    });
    input.setAttribute("aria-label", label);
    const target = selected;
    const commit = () => {
      const n = Number(input.value);
      if (input.value.trim() && Number.isFinite(n)) {
        target[key] = Math.max(min, Math.min(max, n)) / displayScale;
      }
      input.value = target[key] * displayScale;
    };
    flushers.push(commit);
    input.addEventListener("change", () => {
      commit();
      syncRuntime();
    });
    addField(label, input).parentElement.classList.add("presence-number-field");
  }
  function rebuildUi() {
    flushInputs();
    flushers = [];
    dragPoint = null;
    pointerPlanPoint = null;
    bindingsAside.replaceChildren();
    controlsAside.replaceChildren();
    bindingsAside.append(el("strong", "人在传感器"), el("p", "每个传感器独立设置路线和人物。", "presence-note"));
    const addBtn = button("＋ 添加人在传感器", () => {
      selected = {
        id: randomUuid(),
        label: "",
        entityId: "",
        floorId: floors.find(floor => floor.id === component.properties?.floorSelection)?.id || floors[0]?.id || "",
        route: [],
        speed: 0.45,
        size: 1,
        displayDuration: 0,
        clickToFocus: false,
        hitPadding: 8,
        character: "traveler",
        color: "cyan"
      };
      presenceSensors.push(selected);
      previewWalk = false;
      previewWalkBtn.textContent = "预览行走";
      setViewMode("plan");
      status.textContent = "选择人在传感器后，请在顶视图中绘制行走路径。";
      rebuildUi();
    });
    addBtn.disabled = presenceSensors.length >= 128 || !floors.length;
    bindingsAside.append(addBtn);
    for (const sensor of presenceSensors) {
      const selectBtn = button(sensor.label || entityNames.get(sensor.entityId) || sensor.entityId || "未选择传感器", () => {
        selected = sensor;
        rebuildUi();
      });
      selectBtn.setAttribute("aria-pressed", String(sensor === selected));
      bindingsAside.append(selectBtn);
    }
    if (!selected) {
      controlsAside.append(el("p", "有人时走动，无人时隐藏。", "presence-note"));
      recomputeBox();
      syncRuntime();
      return;
    }
    const sensor = selected;
    const trigger = button(entityNames.get(sensor.entityId) || sensor.entityId || "选择人在传感器", async () => {
      try {
        await pickers.entity({
          trigger,
          current: sensor.entityId,
          deviceKind: "presence",
          onSelect: (entityId, meta) => {
            flushInputs();
            flushers = [];
            sensor.entityId = entityId;
            if (entityId.startsWith("event.") && !(sensor.displayDuration > 0)) {
              sensor.displayDuration = 30;
            }
            if (meta?.name) {
              entityNames.set(entityId, meta.name);
            }
            if (!sensor.route.length) {
              status.textContent = "已选择传感器，请在顶视图中绘制行走路径。";
            }
            rebuildUi();
          }
        });
      } catch (error) {
        status.textContent = error.message;
      }
    });
    trigger.setAttribute("aria-label", "选择人在传感器");
    addField("人在传感器", trigger);
    const labelInput = el("input");
    labelInput.value = sensor.label;
    labelInput.maxLength = 128;
    labelInput.placeholder = "可选，自定义名称";
    labelInput.setAttribute("aria-label", "显示名称");
    const commitLabel = () => {
      sensor.label = labelInput.value.slice(0, 128);
    };
    flushers.push(commitLabel);
    labelInput.addEventListener("input", commitLabel);
    labelInput.addEventListener("change", () => {
      commitLabel();
      const listBtn = bindingsAside.querySelectorAll("button")[presenceSensors.indexOf(sensor) + 1];
      if (listBtn) {
        listBtn.textContent = sensor.label || entityNames.get(sensor.entityId) || sensor.entityId || "未选择传感器";
      }
    });
    addField("显示名称", labelInput);
    const floorSelect = el("select");
    floorSelect.setAttribute("aria-label", "路线楼层");
    if (!floors.some(floor => floor.id === sensor.floorId)) {
      const missingOption = el("option", "原楼层已不存在，请重新选择");
      missingOption.value = "";
      floorSelect.append(missingOption);
    }
    for (const floor of floors) {
      const option = el("option", floor.name || floor.id);
      option.value = floor.id;
      floorSelect.append(option);
    }
    floorSelect.value = sensor.floorId;
    floorSelect.addEventListener("change", () => {
      sensor.floorId = floorSelect.value;
      sensor.route = [];
      closedRoutes.delete(sensor.id);
      rebuildUi();
    });
    addField("路线楼层", floorSelect);
    const pagesSelect = el("select");
    pagesSelect.setAttribute("aria-label", "显示页面");
    for (const [value, label] of [["all", "全部页面"], ["custom", "指定页面"]]) {
      const option = el("option", label);
      option.value = value;
      pagesSelect.append(option);
    }
    pagesSelect.value = sensor.displayPages === "all" ? "all" : "custom";
    pagesSelect.addEventListener("change", () => {
      sensor.displayPages = pagesSelect.value === "all" ? "all" : ["overview", "security"];
      rebuildUi();
    });
    addField("显示页面", pagesSelect);
    if (sensor.displayPages !== "all") {
      const includes = sensor.displayPages ?? ["overview", "security"];
      const pagesGroup = el("div", "", "presence-pages");
      pagesGroup.setAttribute("role", "group");
      pagesGroup.setAttribute("aria-label", "指定显示页面");
      for (const [pageId, pageLabel] of PRESENCE_PAGES) {
        const pageBtn = button(pageLabel, () => {
          sensor.displayPages = includes.includes(pageId) ? includes.filter(id => id !== pageId) : [...includes, pageId];
          rebuildUi();
        });
        pageBtn.setAttribute("aria-pressed", String(includes.includes(pageId)));
        pageBtn.disabled = includes.length === 1 && includes.includes(pageId);
        pagesGroup.append(pageBtn);
      }
      controlsAside.append(pagesGroup);
    }
    controlsAside.append(el("strong", "人物方案"));
    const designs = el("div", "", "presence-designs");
    for (const [character, design] of Object.entries(DESIGNS)) {
      const designBtn = button(design.name, () => {
        sensor.character = character;
        rebuildUi();
      });
      designBtn.setAttribute("aria-pressed", String(sensor.character === character));
      designs.append(designBtn);
    }
    controlsAside.append(designs);
    const characterPreview = el("div", "", "presence-character-preview");
    characterPreview.setAttribute("aria-label", "人物行走预览");
    controlsAside.append(characterPreview);
    if (preview) {
      characterPreview.append(preview.renderer.domElement);
    }
    controlsAside.append(el("p", DESIGNS[sensor.character]?.description || "", "presence-note"));
    const colors = el("div", "", "presence-colors");
    for (const [color, label] of [["cyan", "统一青色"], ["orange", "统一橙色"]]) {
      const colorBtn = button(label, () => {
        sensor.color = color;
        rebuildUi();
      });
      colorBtn.dataset.color = color;
      colorBtn.setAttribute("aria-pressed", String(sensor.color === color));
      colors.append(colorBtn);
    }
    controlsAside.append(colors);
    const isEventEntity = sensor.entityId.startsWith("event.");
    addNumberField("每次触发显示时长（秒）", "displayDuration", isEventEntity ? 1 : 0, 3600, 1);
    controlsAside.append(el("p", isEventEntity ? "移动事件触发后显示，再次触发重新计时；到时隐藏。" : "0：随有人状态显示；其他值：到时隐藏，无人立即隐藏，下次触发重新计时。", "presence-note"));
    addNumberField("行走速度（米/秒）", "speed", 0.1, 2, 0.05);
    addNumberField("人物大小（%）", "size", 25, 300, 5, 100);
    controlsAside.append(el("p", (isEventEntity ? "事件触发后沿路线走动；计时结束或离线时隐藏。" : "有人时沿路线循环走动；无人或离线时隐藏。") + "路线是展示动画，不代表实际人员位置。", "presence-note"));
    const focusToggle = el("input");
    focusToggle.type = "checkbox";
    focusToggle.checked = sensor.clickToFocus === true;
    focusToggle.setAttribute("aria-label", "点击模型聚焦");
    focusToggle.addEventListener("change", () => {
      sensor.clickToFocus = focusToggle.checked;
      rebuildUi();
    });
    const focusField = addField("点击模型聚焦", focusToggle);
    focusField.parentElement.className = "i3d-setting-toggle";
    if (sensor.clickToFocus) {
      sensor.hitPadding ??= 8;
      addNumberField("触控范围扩展（px）", "hitPadding", 0, 80, 1);
      const hitRangeToggle = el("input");
      hitRangeToggle.type = "checkbox";
      hitRangeToggle.checked = showHitRange;
      hitRangeToggle.setAttribute("aria-label", "显示触控范围");
      hitRangeToggle.addEventListener("change", () => {
        showHitRange = hitRangeToggle.checked;
        if (presented) {
          focusCommand.focusCommand("presence-show-hit-range", "", showHitRange).catch(onLoadError);
        }
      });
      addField("显示触控范围", hitRangeToggle).parentElement.className = "i3d-setting-toggle";
      controlsAside.append(el("p", "在模型周围扩展点击范围，不改变人物大小。0 表示只点击模型本身。", "presence-note"));
      const focusCameraBtn = button(sensor.focusCamera ? "调整聚焦视角" : "设置聚焦视角", () => openPresenceFocusEditor({
        component,
        properties: security,
        item: sensor,
        panelDocument,
        onSave: focusCamera => {
          sensor.focusCamera = focusCamera;
          rebuildUi();
        }
      }));
      focusCameraBtn.dataset.presenceFocus = "true";
      focusCameraBtn.disabled = !closedRoutes.has(sensor.id) || !validPresenceRoute(sensor.route);
      controlsAside.append(focusCameraBtn);
      if (sensor.focusCamera) {
        controlsAside.append(button("恢复自动聚焦", () => {
          delete sensor.focusCamera;
          rebuildUi();
        }));
      }
    }
    controlsAside.append(button("删除此传感器", () => {
      presenceSensors.splice(presenceSensors.indexOf(sensor), 1);
      closedRoutes.delete(sensor.id);
      selected = presenceSensors[0] || null;
      rebuildUi();
    }));
    recomputeBox();
    syncRuntime();
  }
  const clientToPlan = event => {
    const point = planSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(planSvg.getScreenCTM().inverse());
  };
  planSvg.addEventListener("pointerdown", event => {
    if (viewMode !== "plan" || event.button !== 0 || !selected || !floors.some(floor => floor.id === selected.floorId)) {
      return;
    }
    const pointAttr = event.target.getAttribute("data-point");
    event.preventDefault();
    planSvg.setPointerCapture(event.pointerId);
    if (!closedRoutes.has(selected.id) && snapsToPresenceStart(selected.route, clientToPlan(event), planSvg.getScreenCTM()?.a || 1)) {
      closedRoutes.add(selected.id);
      pointerPlanPoint = null;
      status.textContent = "路径已吸附闭合，可以切换 3D 预览大小和行走效果。";
      redrawPlan();
      syncRuntime();
      return;
    }
    if (pointAttr !== null) {
      if (Number(pointAttr) === 0 && !closedRoutes.has(selected.id) && validPresenceRoute(selected.route)) {
        closedRoutes.add(selected.id);
        redrawPlan();
        return;
      }
      dragPoint = {
        index: Number(pointAttr)
      };
    } else if (!closedRoutes.has(selected.id) && selected.route.length < 128) {
      const point = clientToPlan(event);
      selected.route.push({
        x: point.x,
        y: point.y
      });
      redrawPlan();
    }
  });
  planSvg.addEventListener("pointermove", event => {
    if (viewMode !== "plan") {
      return;
    }
    const point = clientToPlan(event);
    if (!dragPoint) {
      if (selected && !closedRoutes.has(selected.id)) {
        pointerPlanPoint = point;
        redrawPlan(false);
      }
      return;
    }
    selected.route[dragPoint.index] = {
      x: point.x,
      y: point.y
    };
    redrawPlan(false);
  });
  planSvg.addEventListener("pointerleave", () => {
    pointerPlanPoint = null;
    if (!dragPoint) {
      redrawPlan(false);
    }
  });
  const endDrag = () => {
    dragPoint = null;
    syncRuntime();
  };
  for (const eventName of ["pointerup", "pointercancel", "lostpointercapture"]) {
    planSvg.addEventListener(eventName, endDrag);
  }
  const resizeObserver = new ResizeObserver(redrawPlan);
  resizeObserver.observe(planSvg);
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });
  function tickPreview(now) {
    if (!closed && !doc.hidden) {
      if (preview && selected) {
        const key = selected.character + ":" + selected.color;
        if (previewKey !== key) {
          disposeWalker(preview.root);
          preview.root = createWalker(preview.THREE, selected.color === "orange" ? 15376452 : 5421233, selected.character);
          preview.scene.add(preview.root);
          previewKey = key;
        }
        const dt = lastFrameTime ? Math.min(0.1, (now - lastFrameTime) / 1000) : 0;
        lastFrameTime = now;
        animTime += dt;
        walkPhase += dt * selected.speed * 12;
        animateWalker(preview.root, walkPhase, 1, animTime);
        preview.renderer.render(preview.scene, preview.camera);
      }
      rafId = requestAnimationFrame(tickPreview);
    }
  }
  function onVisibilityChange() {
    cancelAnimationFrame(rafId);
    lastFrameTime = 0;
    if (!doc.hidden && !closed) {
      rafId = requestAnimationFrame(tickPreview);
    }
  }
  doc.addEventListener("visibilitychange", onVisibilityChange);
  dialog.showModal();
  rebuildUi();
  try {
    const THREE = await import("/bridge-static/vendor/three/0.186.0/three.module.min.js");
    if (closed) {
      return;
    }
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(240, 160);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1.5, 0.1, 20);
    camera.position.set(2, 1.7, 3);
    camera.lookAt(0, 0.7, 0);
    scene.add(new THREE.HemisphereLight(16777215, 7831948, 2.5));
    const keyLight = new THREE.DirectionalLight(16772824, 3);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);
    const root = createWalker(THREE);
    scene.add(root);
    preview = {
      THREE,
      renderer,
      scene,
      camera,
      root
    };
    controlsAside.querySelector(".presence-character-preview")?.append(renderer.domElement);
    onVisibilityChange();
  } catch {}
  return {
    close
  };
}
