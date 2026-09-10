import { openPresenceFocusEditor } from "./presence-focus-editor.js?v=20260910-dashboard-aspect-v1";
import { mountInteraction3d } from "./runtime.js";
import { validPresenceRoute, snapsToPresenceStart, PRESENCE_PAGES } from "./presence-motion.js";
import { DESIGNS, createWalker, animateWalker, disposeWalker } from "./presence-character.js";
import { randomUuid } from "/bridge-static/utils/random-id.js";
export async function openPresenceEditor({
  component: properties2,
  panelDocument,
  floors: find = [],
  entities: map = [],
  pickers: entity,
  onSave: arg19
}) {
  const dispatchEvent = window.document;
  const security = structuredClone(properties2.properties || {});
  security.security = {
    ...security.security,
    presenceSensors: structuredClone(security.security?.presenceSensors || [])
  };
  const indexOf = security.security.presenceSensors;
  const items = new Map(map.map(entityId => [entityId.entityId, entityId.name]));
  for (const displayDuration of indexOf) {
    Object.assign(displayDuration, {
      character: displayDuration.character ?? "traveler",
      color: displayDuration.color ?? "cyan",
      speed: displayDuration.speed ?? 0.45,
      size: displayDuration.size ?? 1,
      displayDuration: displayDuration.entityId?.startsWith("event.") ? displayDuration.displayDuration > 0 ? displayDuration.displayDuration : 30 : displayDuration.displayDuration ?? 0
    });
  }
  const value33 = (arg5, element, element2) => {
    const textContent3 = dispatchEvent.createElement(arg5);
    if (element) {
      textContent3.textContent = element;
    }
    if (element2) {
      textContent3.className = element2;
    }
    return textContent3;
  };
  const value34 = (arg6, arg7) => {
    const setAttribute5 = dispatchEvent.createElementNS("http://www.w3.org/2000/svg", arg6);
    for (const [value3, value4] of Object.entries(arg7 || {})) {
      setAttribute5.setAttribute(value3, value4);
    }
    return setAttribute5;
  };
  const remove = value33("link");
  remove.rel = "stylesheet";
  remove.href = "/api/v1/modules/interaction3d/presence-editor.css";
  const addEventListener = value33("dialog", "", "i3d-editor i3d-presence-editor");
  addEventListener.setAttribute("aria-label", "配置安防");
  const focus = dispatchEvent.activeElement;
  let route = indexOf[0] || null;
  let value35 = false;
  let map2 = new Set(indexOf.filter(routeClosed => routeClosed.routeClosed !== false && validPresenceRoute(routeClosed.route)).map(id7 => id7.id));
  let index = null;
  let box;
  let root2 = null;
  let value36 = "";
  let value37 = 0;
  let value38 = 0;
  let value39 = 0;
  let value40 = 0;
  let focusCommand = null;
  let value41 = false;
  let value42 = "plan";
  let value43 = false;
  let element4 = false;
  let value44 = 0;
  let value45 = null;
  let push = [];
  const value46 = () => {
    for (const value5 of push) {
      value5();
    }
  };
  const textContent4 = value33("span", "", "presence-status");
  textContent4.setAttribute("role", "status");
  const value47 = (arg8, arg9) => {
    const type = value33("button", arg8);
    type.type = "button";
    type.addEventListener("click", arg9);
    return type;
  };
  function close() {
    if (!value35) {
      value35 = true;
      cancelAnimationFrame(value37);
      disconnect.disconnect();
      clearTimeout(value44);
      focusCommand?.();
      dispatchEvent.removeEventListener("visibilitychange", fn10);
      if (root2) {
        disposeWalker(root2.root);
        root2.renderer.dispose();
        root2.renderer.forceContextLoss();
      }
      addEventListener.close();
      addEventListener.remove();
      remove.remove();
      dispatchEvent.dispatchEvent(new Event("hb-i3d-preview-scope"));
      focus?.focus?.();
    }
  }
  const disabled4 = value47("保存安防配置", async () => {
    value46();
    for (const routeClosed2 of indexOf) {
      routeClosed2.routeClosed = map2.has(routeClosed2.id) && validPresenceRoute(routeClosed2.route);
    }
    disabled4.disabled = true;
    try {
      await arg19(structuredClone(security));
      if (!value35) {
        textContent4.textContent = "已应用到编辑器，请在退出后保存仪表盘";
      }
    } catch (message2) {
      if (!value35) {
        textContent4.textContent = message2.message || "保存失败，请重试。";
      }
    } finally {
      if (!value35) {
        disabled4.disabled = false;
      }
    }
  });
  disabled4.className = "primary";
  addEventListener.addEventListener("input", () => {
    textContent4.textContent = "配置已修改，请保存安防配置。";
  });
  const append5 = value33("header");
  append5.append(value33("strong", "配置安防"), textContent4, disabled4, value47("退出", close));
  const append6 = value33("div", "", "presence-body");
  const append7 = value33("aside", "", "presence-bindings");
  const append8 = value33("aside", "", "presence-controls");
  const append9 = value33("div", "", "presence-plan");
  const textContent5 = value33("strong", "行走路线");
  const textContent6 = value33("p", "", "presence-note");
  const append10 = value33("div", "", "presence-viewport");
  const value48 = value33("div", "", "presence-plan-runtime");
  const addEventListener2 = value34("svg", {
    role: "img",
    "aria-label": "平面图行走路线",
    tabindex: "0"
  });
  const replaceChildren = value34("g");
  const append11 = value34("g");
  addEventListener2.append(replaceChildren, append11);
  const append12 = value33("div", "", "presence-route-tools");
  append12.append(value47("闭合路线", () => {
    if (route && validPresenceRoute(route.route)) {
      map2.add(route.id);
      textContent4.textContent = "";
      fn5();
    } else {
      textContent4.textContent = "至少绘制三个不共线的点，才能闭合路线。";
    }
  }), value47("撤销一点", () => {
    if (route) {
      map2.delete(route.id);
      route.route.pop();
      fn5();
      fn3();
    }
  }), value47("重新绘制", () => {
    if (route) {
      route.route = [];
      map2.delete(route.id);
      fn5();
      fn3();
    }
  }));
  const append13 = value33("div", "", "i3d-focus-actions presence-view-tools");
  const value49 = arg10 => {
    value42 = arg10;
    addEventListener2.toggleAttribute("hidden", arg10 !== "plan");
    append12.hidden = arg10 !== "plan";
    index = null;
    value45 = null;
    setAttribute7.setAttribute("aria-pressed", String(arg10 === "plan"));
    setAttribute8.setAttribute("aria-pressed", String(arg10 === "3d"));
    if (value41) {
      if (arg10 === "plan") {
        fn2();
      } else {
        focusCommand.focusCommand("presence-3d-view").catch(onLoadError);
      }
    }
    fn5();
  };
  const setAttribute7 = value47("平面", () => value49("plan"));
  const setAttribute8 = value47("3D", () => value49("3d"));
  setAttribute7.setAttribute("aria-pressed", "true");
  setAttribute8.setAttribute("aria-pressed", "false");
  const textContent7 = value47("预览行走", () => {
    if (!route || !map2.has(route.id) || !validPresenceRoute(route.route)) {
      textContent4.textContent = "请先绘制路径并闭合，再预览行走。";
      return;
    }
    value43 = !value43;
    textContent7.textContent = value43 ? "停止预览" : "预览行走";
    if (value41) {
      focusCommand.focusCommand("presence-preview-walk", "", value43).catch(onLoadError);
    }
  });
  append13.append(setAttribute7, setAttribute8, textContent7);
  append10.append(value48, addEventListener2);
  append9.append(textContent5, textContent6, append13, append10, append12);
  append6.append(append7, append9, append8);
  addEventListener.append(append5, append6);
  await new Promise((arg2, arg3) => {
    remove.addEventListener("load", arg2, {
      once: true
    });
    remove.addEventListener("error", () => arg3(new Error("安防样式加载失败，请重试。")), {
      once: true
    });
    dispatchEvent.head.append(remove);
  }).catch(arg4 => {
    remove.remove();
    throw arg4;
  });
  dispatchEvent.body.append(addEventListener);
  addEventListener.dataset.i3dPreviewScope = "presence";
  function onLoadError(message3) {
    if (!value35) {
      textContent4.textContent = message3.message || String(message3);
    }
  }
  function fn() {
    if (route) {
      return find.find(id5 => id5.id === route.floorId);
    } else {
      return find.find(id3 => id3.id === security.floorSelection) || find[0];
    }
  }
  function fn2() {
    clearTimeout(value44);
    if (!!value41 && !!fn() && value42 === "plan" && !!box) {
      value44 = setTimeout(() => {
        const id4 = fn();
        if (!value35 && value41 && value42 === "plan" && id4) {
          focusCommand.focusCommand("presence-top-view", "", {
            floorId: id4.id,
            box
          }).catch(onLoadError);
        }
      }, 30);
    }
  }
  function fn3() {
    const floorSelection = fn()?.id;
    if (!floorSelection) {
      return;
    }
    const properties = {
      ...structuredClone(security),
      floorSelection,
      camera: security.floorCameras?.[floorSelection] || (security.floorSelection === floorSelection ? security.camera : null),
      security: {
        presenceSensors: route ? [{
          ...structuredClone(route),
          routeClosed: map2.has(route.id)
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
    focusCommand = mountInteraction3d(value48, {
      component: {
        ...properties2,
        properties
      },
      context: {
        document: panelDocument,
        editable: true
      },
      editing: true,
      editingModule: "security",
      onPresented: () => {
        if (!value35) {
          value41 = true;
          fn2();
          if (value43) {
            focusCommand.focusCommand("presence-preview-walk", "", true).catch(onLoadError);
          }
          focusCommand.focusCommand("presence-show-hit-range", "", element4).catch(onLoadError);
        }
      },
      onLoadError
    });
    dispatchEvent.dispatchEvent(new Event("hb-i3d-preview-scope"));
  }
  function fn4() {
    const plan = fn();
    const length = [...(plan?.plan?.walls || []).flatMap(start => [start.start, start.end]), ...(route?.route || [])];
    const value16 = length.map(x3 => x3.x);
    const value17 = length.map(y => y.y);
    const value18 = plan?.plan?.pixelsPerMeter || 100;
    const value19 = length.length ? Math.min(...value16) : 0;
    const value20 = length.length ? Math.min(...value17) : 0;
    const value21 = Math.max(value18, length.length ? Math.max(...value16) - value19 : value18 * 10);
    const value22 = Math.max(value18, length.length ? Math.max(...value17) - value20 : value18 * 8);
    const value23 = Math.max(value21, value22) * 0.1;
    box = {
      x: value19 - value23,
      y: value20 - value23,
      w: value21 + value23 * 2,
      h: value22 + value23 * 2
    };
    fn5();
  }
  function fn5(arg12 = true) {
    if (!box) {
      return;
    }
    const disabled2 = append8.querySelector("[data-presence-focus]");
    if (disabled2) {
      disabled2.disabled = !route || !map2.has(route.id) || !validPresenceRoute(route.route);
    }
    addEventListener2.setAttribute("viewBox", box.x + " " + box.y + " " + box.w + " " + box.h);
    replaceChildren.replaceChildren();
    append11.replaceChildren();
    const name3 = fn();
    textContent7.disabled = !route || !map2.has(route.id) || !validPresenceRoute(route.route);
    for (const disabled of append12.querySelectorAll("button")) {
      disabled.disabled = !route;
    }
    textContent6.textContent = route ? name3 ? value42 === "3d" ? "拖动旋转、滚轮缩放；调整人物大小，再预览行走效果。" : map2.has(route.id) ? "路线已闭合 · 可拖动圆点调整路径；切换 3D 查看人物大小。" : "请绘制行走路径：依次点击至少三个点，靠近起点可吸附闭合。" : "请选择有效楼层。" : "添加人在传感器后，在顶视图中绘制行走路径。";
    textContent5.textContent = name3 ? (name3.name || "楼层") + " · 行走路线" : "行走路线";
    if (arg12 !== false) {
      fn2();
    }
    if (!route) {
      return;
    }
    const stroke = route.color === "orange" ? "#eaa044" : "#52b8b1";
    append11.append(value34(map2.has(route.id) ? "polygon" : "polyline", {
      points: route.route.map(x => x.x + "," + x.y).join(" "),
      fill: map2.has(route.id) ? stroke + "14" : "none",
      stroke,
      "stroke-width": 3,
      "vector-effect": "non-scaling-stroke",
      "pointer-events": "none",
      "stroke-linejoin": "round"
    }));
    const value24 = 1 / Math.max(0.0001, Math.abs(addEventListener2.getScreenCTM()?.a || 1));
    route.route.forEach((x4, data_point) => {
      append11.append(value34("circle", {
        cx: x4.x,
        cy: x4.y,
        r: (data_point === 0 ? 8 : 6) * value24,
        fill: data_point === 0 ? stroke : "#f7fafc",
        stroke,
        "stroke-width": 2,
        "vector-effect": "non-scaling-stroke",
        "data-point": data_point
      }));
      const textContent = value34("text", {
        x: x4.x + value24 * 11,
        y: x4.y - value24 * 9,
        fill: "#64748b",
        "font-size": value24 * 11,
        "pointer-events": "none"
      });
      textContent.textContent = String(data_point + 1);
      append11.append(textContent);
    });
    if (!map2.has(route.id) && value45 && route.route.length) {
      const value9 = snapsToPresenceStart(route.route, value45, 1 / value24);
      const x5 = value9 ? route.route[0] : value45;
      const x6 = route.route.at(-1);
      append11.append(value34("line", {
        x1: x6.x,
        y1: x6.y,
        x2: x5.x,
        y2: x5.y,
        stroke,
        "stroke-width": 2,
        "stroke-dasharray": "5 4",
        "vector-effect": "non-scaling-stroke",
        "pointer-events": "none"
      }));
      if (value9) {
        append11.append(value34("circle", {
          cx: x5.x,
          cy: x5.y,
          r: value24 * 16,
          fill: stroke + "33",
          stroke,
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          "pointer-events": "none"
        }));
        textContent6.textContent = "已吸附起点 · 点击即可闭合路线。";
      }
    }
  }
  function fn6(arg13, arg14) {
    const append = value33("label", "", "presence-field");
    append.append(value33("span", arg13), arg14);
    append8.append(append);
    return arg14;
  }
  function fn7(arg15, arg16, min, max, step, arg17 = 1) {
    const value25 = value33("input");
    Object.assign(value25, {
      type: "number",
      min,
      max,
      step,
      value: route[arg16] * arg17
    });
    value25.setAttribute("aria-label", arg15);
    const value26 = route;
    const value27 = () => {
      const value6 = Number(value25.value);
      if (value25.value.trim() && Number.isFinite(value6)) {
        value26[arg16] = Math.max(min, Math.min(max, value6)) / arg17;
      }
      value25.value = value26[arg16] * arg17;
    };
    push.push(value27);
    value25.addEventListener("change", () => {
      value27();
      fn3();
    });
    fn6(arg15, value25).parentElement.classList.add("presence-number-field");
  }
  function fn8() {
    value46();
    push = [];
    index = null;
    value45 = null;
    append7.replaceChildren();
    append8.replaceChildren();
    append7.append(value33("strong", "人在传感器"), value33("p", "每个传感器独立设置路线和人物。", "presence-note"));
    const disabled3 = value47("＋ 添加人在传感器", () => {
      route = {
        id: randomUuid(),
        label: "",
        entityId: "",
        floorId: find.find(id => id.id === properties2.properties?.floorSelection)?.id || find[0]?.id || "",
        route: [],
        speed: 0.45,
        size: 1,
        displayDuration: 0,
        clickToFocus: false,
        hitPadding: 8,
        character: "traveler",
        color: "cyan"
      };
      indexOf.push(route);
      value43 = false;
      textContent7.textContent = "预览行走";
      value49("plan");
      textContent4.textContent = "选择人在传感器后，请在顶视图中绘制行走路径。";
      fn8();
    });
    disabled3.disabled = indexOf.length >= 128 || !find.length;
    append7.append(disabled3);
    for (const entityId2 of indexOf) {
      const setAttribute2 = value47(entityId2.label || items.get(entityId2.entityId) || entityId2.entityId || "未选择传感器", () => {
        route = entityId2;
        fn8();
      });
      setAttribute2.setAttribute("aria-pressed", String(entityId2 === route));
      append7.append(setAttribute2);
    }
    if (!route) {
      append8.append(value33("p", "有人时走动，无人时隐藏。", "presence-note"));
      fn4();
      fn3();
      return;
    }
    const entityId3 = route;
    const trigger = value47(items.get(entityId3.entityId) || entityId3.entityId || "选择人在传感器", async () => {
      try {
        await entity.entity({
          trigger,
          current: entityId3.entityId,
          deviceKind: "presence",
          onSelect: (startsWith, name) => {
            value46();
            push = [];
            entityId3.entityId = startsWith;
            if (startsWith.startsWith("event.") && !(entityId3.displayDuration > 0)) {
              entityId3.displayDuration = 30;
            }
            if (name?.name) {
              items.set(startsWith, name.name);
            }
            if (!entityId3.route.length) {
              textContent4.textContent = "已选择传感器，请在顶视图中绘制行走路径。";
            }
            fn8();
          }
        });
      } catch (message) {
        textContent4.textContent = message.message;
      }
    });
    trigger.setAttribute("aria-label", "选择人在传感器");
    fn6("人在传感器", trigger);
    const value28 = value33("input");
    value28.value = entityId3.label;
    value28.maxLength = 128;
    value28.placeholder = "可选，自定义名称";
    value28.setAttribute("aria-label", "显示名称");
    const value29 = () => {
      entityId3.label = value28.value.slice(0, 128);
    };
    push.push(value29);
    value28.addEventListener("input", value29);
    value28.addEventListener("change", () => {
      value29();
      const textContent2 = append7.querySelectorAll("button")[indexOf.indexOf(entityId3) + 1];
      if (textContent2) {
        textContent2.textContent = entityId3.label || items.get(entityId3.entityId) || entityId3.entityId || "未选择传感器";
      }
    });
    fn6("显示名称", value28);
    const append2 = value33("select");
    append2.setAttribute("aria-label", "路线楼层");
    if (!find.some(id6 => id6.id === entityId3.floorId)) {
      const value10 = value33("option", "原楼层已不存在，请重新选择");
      value10.value = "";
      append2.append(value10);
    }
    for (const id8 of find) {
      const value11 = value33("option", id8.name || id8.id);
      value11.value = id8.id;
      append2.append(value11);
    }
    append2.value = entityId3.floorId;
    append2.addEventListener("change", () => {
      entityId3.floorId = append2.value;
      entityId3.route = [];
      map2.delete(entityId3.id);
      fn8();
    });
    fn6("路线楼层", append2);
    const value30 = value33("select");
    value30.setAttribute("aria-label", "显示页面");
    for (const [element3, value13] of [["all", "全部页面"], ["custom", "指定页面"]]) {
      const value12 = value33("option", value13);
      value12.value = element3;
      value30.append(value12);
    }
    value30.value = entityId3.displayPages === "all" ? "all" : "custom";
    value30.addEventListener("change", () => {
      entityId3.displayPages = value30.value === "all" ? "all" : ["overview", "security"];
      fn8();
    });
    fn6("显示页面", value30);
    if (entityId3.displayPages !== "all") {
      const includes = entityId3.displayPages ?? ["overview", "security"];
      const setAttribute3 = value33("div", "", "presence-pages");
      setAttribute3.setAttribute("role", "group");
      setAttribute3.setAttribute("aria-label", "指定显示页面");
      for (const [value7, value8] of PRESENCE_PAGES) {
        const setAttribute = value47(value8, () => {
          entityId3.displayPages = includes.includes(value7) ? includes.filter(arg => arg !== value7) : [...includes, value7];
          fn8();
        });
        setAttribute.setAttribute("aria-pressed", String(includes.includes(value7)));
        setAttribute.disabled = includes.length === 1 && includes.includes(value7);
        setAttribute3.append(setAttribute);
      }
      append8.append(setAttribute3);
    }
    append8.append(value33("strong", "人物方案"));
    const append3 = value33("div", "", "presence-designs");
    for (const [character, name2] of Object.entries(DESIGNS)) {
      const setAttribute4 = value47(name2.name, () => {
        entityId3.character = character;
        fn8();
      });
      setAttribute4.setAttribute("aria-pressed", String(entityId3.character === character));
      append3.append(setAttribute4);
    }
    append8.append(append3);
    const setAttribute6 = value33("div", "", "presence-character-preview");
    setAttribute6.setAttribute("aria-label", "人物行走预览");
    append8.append(setAttribute6);
    if (root2) {
      setAttribute6.append(root2.renderer.domElement);
    }
    append8.append(value33("p", DESIGNS[entityId3.character]?.description || "", "presence-note"));
    const append4 = value33("div", "", "presence-colors");
    for (const [color, value14] of [["cyan", "统一青色"], ["orange", "统一橙色"]]) {
      const dataset = value47(value14, () => {
        entityId3.color = color;
        fn8();
      });
      dataset.dataset.color = color;
      dataset.setAttribute("aria-pressed", String(entityId3.color === color));
      append4.append(dataset);
    }
    append8.append(append4);
    const value31 = entityId3.entityId.startsWith("event.");
    fn7("每次触发显示时长（秒）", "displayDuration", value31 ? 1 : 0, 3600, 1);
    append8.append(value33("p", value31 ? "移动事件触发后显示，再次触发重新计时；到时隐藏。" : "0：随有人状态显示；其他值：到时隐藏，无人立即隐藏，下次触发重新计时。", "presence-note"));
    fn7("行走速度（米/秒）", "speed", 0.1, 2, 0.05);
    fn7("人物大小（%）", "size", 25, 300, 5, 100);
    append8.append(value33("p", (value31 ? "事件触发后沿路线走动；计时结束或离线时隐藏。" : "有人时沿路线循环走动；无人或离线时隐藏。") + "路线是展示动画，不代表实际人员位置。", "presence-note"));
    const checked2 = value33("input");
    checked2.type = "checkbox";
    checked2.checked = entityId3.clickToFocus === true;
    checked2.setAttribute("aria-label", "点击模型聚焦");
    checked2.addEventListener("change", () => {
      entityId3.clickToFocus = checked2.checked;
      fn8();
    });
    const parentElement = fn6("点击模型聚焦", checked2);
    parentElement.parentElement.className = "i3d-setting-toggle";
    if (entityId3.clickToFocus) {
      entityId3.hitPadding ??= 8;
      fn7("触控范围扩展（px）", "hitPadding", 0, 80, 1);
      const checked = value33("input");
      checked.type = "checkbox";
      checked.checked = element4;
      checked.setAttribute("aria-label", "显示触控范围");
      checked.addEventListener("change", () => {
        element4 = checked.checked;
        if (value41) {
          focusCommand.focusCommand("presence-show-hit-range", "", element4).catch(onLoadError);
        }
      });
      fn6("显示触控范围", checked).parentElement.className = "i3d-setting-toggle";
      append8.append(value33("p", "在模型周围扩展点击范围，不改变人物大小。0 表示只点击模型本身。", "presence-note"));
      const dataset2 = value47(entityId3.focusCamera ? "调整聚焦视角" : "设置聚焦视角", () => openPresenceFocusEditor({
        component: properties2,
        properties: security,
        item: entityId3,
        panelDocument: panelDocument,
        onSave: focusCamera => {
          entityId3.focusCamera = focusCamera;
          fn8();
        }
      }));
      dataset2.dataset.presenceFocus = "true";
      dataset2.disabled = !map2.has(entityId3.id) || !validPresenceRoute(entityId3.route);
      append8.append(dataset2);
      if (entityId3.focusCamera) {
        append8.append(value47("恢复自动聚焦", () => {
          delete entityId3.focusCamera;
          fn8();
        }));
      }
    }
    append8.append(value47("删除此传感器", () => {
      indexOf.splice(indexOf.indexOf(entityId3), 1);
      map2.delete(entityId3.id);
      route = indexOf[0] || null;
      fn8();
    }));
    fn4();
    fn3();
  }
  const value50 = clientX => {
    const x7 = addEventListener2.createSVGPoint();
    x7.x = clientX.clientX;
    x7.y = clientX.clientY;
    return x7.matrixTransform(addEventListener2.getScreenCTM().inverse());
  };
  addEventListener2.addEventListener("pointerdown", button => {
    if (value42 !== "plan" || button.button !== 0 || !route || !find.some(id2 => id2.id === route.floorId)) {
      return;
    }
    const value15 = button.target.getAttribute("data-point");
    button.preventDefault();
    addEventListener2.setPointerCapture(button.pointerId);
    if (!map2.has(route.id) && snapsToPresenceStart(route.route, value50(button), addEventListener2.getScreenCTM()?.a || 1)) {
      map2.add(route.id);
      value45 = null;
      textContent4.textContent = "路径已吸附闭合，可以切换 3D 预览大小和行走效果。";
      fn5();
      fn3();
      return;
    }
    if (value15 !== null) {
      if (Number(value15) === 0 && !map2.has(route.id) && validPresenceRoute(route.route)) {
        map2.add(route.id);
        fn5();
        return;
      }
      index = {
        index: Number(value15)
      };
    } else if (!map2.has(route.id) && route.route.length < 128) {
      const x2 = value50(button);
      route.route.push({
        x: x2.x,
        y: x2.y
      });
      fn5();
    }
  });
  addEventListener2.addEventListener("pointermove", arg11 => {
    if (value42 !== "plan") {
      return;
    }
    const x8 = value50(arg11);
    if (!index) {
      if (route && !map2.has(route.id)) {
        value45 = x8;
        fn5(false);
      }
      return;
    }
    route.route[index.index] = {
      x: x8.x,
      y: x8.y
    };
    fn5(false);
  });
  addEventListener2.addEventListener("pointerleave", () => {
    value45 = null;
    if (!index) {
      fn5(false);
    }
  });
  const value51 = () => {
    index = null;
    fn3();
  };
  for (const value32 of ["pointerup", "pointercancel", "lostpointercapture"]) {
    addEventListener2.addEventListener(value32, value51);
  }
  const disconnect = new ResizeObserver(fn5);
  disconnect.observe(addEventListener2);
  addEventListener.addEventListener("cancel", preventDefault => {
    preventDefault.preventDefault();
    close();
  });
  function fn9(arg18) {
    if (!value35 && !dispatchEvent.hidden) {
      if (root2 && route) {
        const value = route.character + ":" + route.color;
        if (value36 !== value) {
          disposeWalker(root2.root);
          root2.root = createWalker(root2.THREE, route.color === "orange" ? 15376452 : 5421233, route.character);
          root2.scene.add(root2.root);
          value36 = value;
        }
        const value2 = value38 ? Math.min(0.1, (arg18 - value38) / 1000) : 0;
        value38 = arg18;
        value40 += value2;
        value39 += value2 * route.speed * 12;
        animateWalker(root2.root, value39, 1, value40);
        root2.renderer.render(root2.scene, root2.camera);
      }
      value37 = requestAnimationFrame(fn9);
    }
  }
  function fn10() {
    cancelAnimationFrame(value37);
    value38 = 0;
    if (!dispatchEvent.hidden && !value35) {
      value37 = requestAnimationFrame(fn9);
    }
  }
  dispatchEvent.addEventListener("visibilitychange", fn10);
  addEventListener.showModal();
  fn8();
  try {
    const WebGLRenderer = await import("/bridge-static/vendor/three/0.182.0/three.module.min.js");
    if (value35) {
      return;
    }
    const setPixelRatio = new WebGLRenderer.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    setPixelRatio.setPixelRatio(Math.min(devicePixelRatio, 2));
    setPixelRatio.setSize(240, 160);
    const add = new WebGLRenderer.Scene();
    const position = new WebGLRenderer.PerspectiveCamera(32, 1.5, 0.1, 20);
    position.position.set(2, 1.7, 3);
    position.lookAt(0, 0.7, 0);
    add.add(new WebGLRenderer.HemisphereLight(16777215, 7831948, 2.5));
    const position2 = new WebGLRenderer.DirectionalLight(16772824, 3);
    position2.position.set(3, 5, 3);
    add.add(position2);
    const root = createWalker(WebGLRenderer);
    add.add(root);
    root2 = {
      THREE: WebGLRenderer,
      renderer: setPixelRatio,
      scene: add,
      camera: position,
      root
    };
    append8.querySelector(".presence-character-preview")?.append(setPixelRatio.domElement);
    fn10();
  } catch {}
  return {
    close
  };
}
