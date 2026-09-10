import { createLightStream } from "./light-stream.js?v=20260909-preview-sleep-v1";
const INTERACTION3D_API = "/api/v1/modules/interaction3d";
export function mountInteraction3d(classList, {
  component,
  context = {},
  editing = false,
  editingModule: onEdit = "light",
  editingVacuumId: onReady = "",
  rangeEditorOnly: onStates = false,
  onEdit: arg24 = () => {},
  onReady: onLoadError = () => {},
  onStates: onFocusChange = null,
  onPresented: arg25 = () => {},
  onLoadError: arg26 = () => {},
  onFocusChange: arg27 = () => {}
}) {
  classList.className = "hb-interaction3d-runtime";
  let properties = structuredClone(component.properties || {});
  let disposed = false;
  let authorized = true;
  let selectedId = "";
  let loadTimeoutId;
  let value34;
  let framePresented = false;
  let viewEditing = false;
  let viewRequestSerial = 0;
  let configSerial = 0;
  let stageCamera;
  let viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera;
  let focusActive = "";
  let focusPanelOpen = false;
  let frameReady = false;
  let everConnected = false;
  let streamPaused = false;
  let reloadGeneration = false;
  let pendingViewRequests = false;
  let frame = 0;
  let status = false;
  const projectId = new Map();
  const postToFrame = new Map();
  const interactiveVisible = new Set();
  const awaitingPresentation = arg11 => arg11 === "region" ? "region" : "standard";
  function isHostVisuallyPresented() {
    const bounds = document.createElement("iframe");
    bounds.title = "3D 交互户型";
    bounds.className = "i3d-frame";
    bounds.setAttribute("allow", "fullscreen");
    if (context.editable && !editing && !viewEditing && !status) {
      bounds.style.pointerEvents = "none";
    }
    return bounds;
  }
  let lastActivityVisible = isHostVisuallyPresented();
  const textContent = document.createElement("p");
  textContent.className = "i3d-loading";
  textContent.setAttribute("role", "status");
  classList.replaceChildren(lastActivityVisible, textContent);
  const pageHidden = context.document?.projectId || "";
  const lastUserActivityAt = arg12 => {
    if (!disposed && lastActivityVisible.contentWindow) {
      lastActivityVisible.contentWindow.postMessage({
        channel: "hb-i3d-v1",
        ...arg12
      }, location.origin);
    }
  };
  function syncActivityState(arg19) {
    arg24(arg19);
    for (const value8 of [...interactiveVisible]) {
      value8(arg19);
    }
  }
  function onUserActivity(event, error = "") {
    const wasHeld = event === true;
    if (wasHeld !== status || !!error) {
      status = wasHeld;
      classList.classList.toggle("is-range-editing", wasHeld);
      if (context.editable && !editing) {
        lastActivityVisible.style.pointerEvents = wasHeld || viewEditing ? "auto" : "none";
      }
      syncActivityState({
        action: "range-editor-state",
        active: wasHeld,
        ...(error ? {
          error
        } : {})
      });
    }
  }
  let heldPointers = false;
  let value35 = false;
  let hasHeldInput;
  let hostIntersecting;
  let streamedStates = false;
  let lightStream = -Infinity;
  const collectStates = new Set();
  const pushStates = new Set();
  const registeredEntityIds = () => collectStates.size > 0 || pushStates.size > 0;
  let controlAbortControllers = typeof IntersectionObserver === "undefined";
  function fn() {
    const wasHeld = [...(document.querySelectorAll?.("dialog[data-i3d-preview-scope][open]") || [])].at(-1);
    const value17 = !!wasHeld && !wasHeld.contains(classList);
    if (focusPanelOpen !== value17 && !disposed) {
      focusPanelOpen = value17;
      classList.setAttribute("data-preview-suspended", String(value17));
      clearTimeout(loadTimeoutId);
      if (!value17) {
        if (!framePresented && properties.sceneId && !pendingViewRequests) {
          fn10();
        }
        if (streamPaused) {
          lastLayoutPayload();
        }
        if (intersectionObserver) {
          onFocusChange?.(mutationObserver());
        }
        initialLayoutFrame?.updateStates?.(mutationObserver());
        reloadStage();
      }
      fn2();
    }
  }
  function onPageHide() {
    if (classList.isConnected === false || classList.hidden || classList.inert || lastActivityVisible.hidden || classList.checkVisibility?.({
      opacityProperty: true,
      visibilityProperty: true,
      contentVisibilityAuto: true
    }) === false) {
      return false;
    }
    for (let parentElement = classList; parentElement; parentElement = parentElement.parentElement) {
      if (parentElement.hidden || parentElement.inert || parentElement.getAttribute?.("aria-hidden") === "true") {
        return false;
      }
      const visibility = window.getComputedStyle?.(parentElement);
      if (visibility && (visibility.display === "none" || visibility.visibility === "hidden" || visibility.visibility === "collapse" || Number(visibility.opacity) === 0)) {
        return false;
      }
    }
    const width = classList.getBoundingClientRect();
    const value18 = document.documentElement?.clientWidth || window.innerWidth || Infinity;
    const value19 = document.documentElement?.clientHeight || window.innerHeight || Infinity;
    return width.width > 0 && width.height > 0 && (width.left || 0) < value18 && (width.top || 0) < value19 && (width.right ?? (width.left || 0) + width.width) > 0 && (width.bottom ?? (width.top || 0) + width.height) > 0;
  }
  function fn2(arg20 = false) {
    if (disposed) {
      return;
    }
    pushConfig();
    const visible = heldPointers && framePresented && authorized && !editing && !context.editable && !viewEditing && !focusPanelOpen && !streamedStates && document.hidden !== true && document.visibilityState !== "hidden" && controlAbortControllers && onPageHide();
    const presentedVisible = authorized && !focusPanelOpen && !streamedStates && document.hidden !== true && document.visibilityState !== "hidden" && controlAbortControllers && onPageHide();
    if (!visible) {
      collectStates.clear();
      pushStates.clear();
    }
    if (arg20 || visible !== hasHeldInput || presentedVisible !== hostIntersecting) {
      hasHeldInput = visible;
      hostIntersecting = presentedVisible;
      lightStream = -Infinity;
      lastUserActivityAt({
        type: "activity-state",
        visible,
        presentedVisible
      });
    }
  }
  function fn3(next) {
    if (disposed || next.isTrusted === false) {
      return;
    }
    const value20 = registeredEntityIds();
    if (next.type === "pointerdown") {
      collectStates.add(next.pointerId);
    }
    if (next.type === "pointerup" || next.type === "pointercancel") {
      collectStates.delete(next.pointerId);
    }
    if (next.type === "keydown") {
      pushStates.add(next.code || next.key);
    }
    if (next.type === "keyup") {
      pushStates.delete(next.code || next.key);
    }
    const value21 = globalThis.performance?.now?.() ?? Date.now();
    if (registeredEntityIds() !== value20 || !(value21 - lightStream < 200)) {
      fn2();
      if (hasHeldInput) {
        lightStream = value21;
        lastUserActivityAt({
          type: "user-activity",
          held: registeredEntityIds()
        });
      }
    }
  }
  function fn4() {
    if (disposed) {
      return;
    }
    const value22 = registeredEntityIds();
    collectStates.clear();
    pushStates.clear();
    fn2();
    if (value22 && hasHeldInput) {
      lightStream = globalThis.performance?.now?.() ?? Date.now();
      lastUserActivityAt({
        type: "user-activity",
        held: false
      });
    }
  }
  function fn5() {
    streamedStates = true;
    fn2();
  }
  function fn6(message) {
    streamedStates = false;
    if (message?.persisted && !disposed) {
      fn9();
    } else {
      fn2();
    }
  }
  function fn7() {
    fn2();
  }
  let activityTarget = {};
  let value36 = null;
  let activityListenerOptions = false;
  const intersectionObserver = typeof window.WebSocket == "function" ? createLightStream({
    onStates(arg8) {
      activityTarget = arg8;
      if (!focusPanelOpen) {
        initialLayoutFrame?.updateStates?.(arg8);
        onFocusChange?.(arg8);
        if (streamPaused) {
          lastLayoutPayload();
        }
      }
    },
    onPatch(arg9) {
      activityTarget = {
        ...activityTarget,
        ...arg9
      };
      if (!focusPanelOpen) {
        initialLayoutFrame?.updateStates?.(activityTarget);
        onFocusChange?.(activityTarget);
        if (streamPaused) {
          lastLayoutPayload(arg9);
        }
      }
    }
  }) : null;
  function pushConfig() {
    if (!intersectionObserver || disposed) {
      return;
    }
    if (classList.isConnected === true) {
      reloadGeneration = true;
    }
    let value23 = authorized && !pendingViewRequests && !!properties.sceneId && !streamedStates && document.hidden !== true && document.visibilityState !== "hidden" && (!reloadGeneration || classList.isConnected !== false);
    for (let parentElement2 = classList; value23 && parentElement2; parentElement2 = parentElement2.parentElement) {
      const display = window.getComputedStyle?.(parentElement2);
      if (parentElement2.hidden || parentElement2.inert || parentElement2.getAttribute?.("aria-hidden") === "true" || display?.display === "none" || ["hidden", "collapse"].includes(display?.visibility)) {
        value23 = false;
      }
    }
    intersectionObserver.setActive(value23);
  }
  const observedAncestors = () => [...(properties.security?.presenceSensors || []), ...(properties.devices?.vacuums || []), ...(properties.devices?.vacuums || []).flatMap(relatedEntityIds2 => [...(relatedEntityIds2.relatedEntityIds || []).map(entityId2 => ({
    entityId: entityId2
  })), relatedEntityIds2.map, ...(relatedEntityIds2.shortcuts || [])].filter(Boolean)), ...(properties.lights || []), ...(properties.environment?.airConditioners || []), ...(properties.environment?.curtains || []), ...(properties.devices?.nas || []), ...(properties.devices?.televisions || []), ...(properties.devices?.televisions || []).filter(powerEntityId2 => powerEntityId2.powerEntityId).map(powerEntityId3 => ({
    entityId: powerEntityId3.powerEntityId
  })), ...(properties.devices?.nas || []).flatMap(statusSource => {
    const visibleMetrics = statusSource.statusSource;
    return (visibleMetrics?.metrics || []).filter(entityId3 => !visibleMetrics.visibleMetrics || visibleMetrics.visibleMetrics.includes(entityId3.entityId) || entityId3.entityId === visibleMetrics.primaryEntityId);
  })];
  function dismissFocus(arg21) {
    if (typeof arg21 != "string" || !arg21) {
      return false;
    } else if ((properties.lights || []).some(controller => controller.id === arg21) || (properties.security?.presenceSensors || []).some(command => arg21 === "presence:" + command.id)) {
      return true;
    } else {
      return [["climate", properties.environment?.airConditioners], ["cover", properties.environment?.curtains], ["nas", properties.devices?.nas], ["television", properties.devices?.televisions], ["vacuum", properties.devices?.vacuums]].some(([arg, arg2]) => (arg2 || []).some(id => typeof id.id == "string" && id.id && arg21 === arg + ":" + id.id));
    }
  }
  const mutationObserver = () => intersectionObserver ? activityTarget : Object.fromEntries(observedAncestors().map(entityId6 => [entityId6.entityId, context.states?.get(entityId6.entityId) || null]));
  const lastLayoutPayload = (arg13 = null) => {
    if (focusPanelOpen) {
      return;
    }
    const value9 = mutationObserver();
    if (intersectionObserver && value9 === value36) {
      return;
    }
    const value10 = !!intersectionObserver && activityListenerOptions && arg13 !== null;
    lastUserActivityAt({
      type: "states",
      states: value10 ? arg13 : value9,
      ...(value10 ? {
        patch: true
      } : {})
    });
    value36 = value9;
    if (!intersectionObserver) {
      onFocusChange?.(value9);
    }
  };
  const resizeObserver = new Set();
  function syncBackgroundClass() {
    if (intersectionObserver) {
      intersectionObserver.configure(observedAncestors().map(entityId5 => entityId5.entityId), {
        additionalEntityIds: (properties.devices?.vacuums || []).flatMap(relatedEntityIds => [...(relatedEntityIds.relatedEntityIds || []), ...(relatedEntityIds.shortcuts || []).map(entityId => entityId.entityId)])
      });
      pushConfig();
      return;
    }
    for (const entityId7 of observedAncestors()) {
      if (entityId7.entityId && !resizeObserver.has(entityId7.entityId)) {
        resizeObserver.add(entityId7.entityId);
        context.registerRuntimeStateHandler?.(entityId7.entityId, lastLayoutPayload);
      }
    }
  }
  function reloadStage() {
    if (!streamPaused || disposed || focusPanelOpen) {
      return;
    }
    const value24 = {
      properties,
      editing,
      editingModule: onEdit,
      editingVacuumId: onReady,
      rangeEditorOnly: onStates,
      viewEditing,
      allowRangeEditing: authorized && (editing || !!context.editable),
      interactive: !editing && !context.editable,
      selectedId
    };
    const value25 = JSON.stringify(value24);
    if (value25 === focusActive) {
      fn13();
      fn2();
      lastLayoutPayload();
      return;
    }
    focusActive = value25;
    heldPointers = false;
    value35 = true;
    fn2(true);
    fn13(true);
    lastUserActivityAt({
      type: "config",
      configId: ++configSerial,
      ...value24,
      states: mutationObserver()
    });
    value36 = mutationObserver();
    if (!framePresented) {
      fn2(true);
    }
  }
  function refreshAncestorObservers() {
    classList.classList.toggle("is-background-hidden", properties.backgroundVisible === false);
  }
  function onOutsidePointerDown(event) {
    if (frameReady !== event) {
      frameReady = event;
      arg27(event);
    }
  }
  function onEscapeKey(event) {
    for (const timeout8 of projectId.values()) {
      clearTimeout(timeout8.timeout);
      timeout8.reject(new Error(event));
    }
    projectId.clear();
  }
  function failLoad(message) {
    for (const timeout9 of postToFrame.values()) {
      clearTimeout(timeout9.timeout);
      timeout9.reject(new Error(message));
    }
    postToFrame.clear();
  }
  function onFrameMessage(immediate = false) {
    value37();
    everConnected = false;
    onOutsidePointerDown(false);
    lastUserActivityAt({
      type: "dismiss-focus",
      immediate
    });
  }
  let initialLayoutFrame = null;
  let api = false;
  const value37 = () => {
    const close = initialLayoutFrame;
    initialLayoutFrame = null;
    close?.close?.();
  };
  function syncPresentationLayout(target2) {
    if (!initialLayoutFrame?.contains?.(target2.target)) {
      if ((frameReady || everConnected) && !classList.contains(target2.target)) {
        onFrameMessage();
      }
    }
  }
  function frame2(message) {
    if ((frameReady || everConnected) && message.key === "Escape") {
      onFrameMessage();
    }
  }
  function fn8(arg22) {
    pendingViewRequests = true;
    framePresented = false;
    heldPointers = false;
    value35 = false;
    fn2(true);
    failLoad(arg22 || "户型画面已关闭，请重新调整照射范围。");
    lastUserActivityAt({
      type: "range-editor",
      open: false
    });
    onUserActivity(false);
    forEach.forEach(abort3 => abort3.abort());
    onEscapeKey("户型加载失败，请重新载入后调整视角。");
    onFrameMessage(true);
    clearTimeout(loadTimeoutId);
    classList.classList.remove("is-loading");
    classList.classList.add("is-load-error");
    textContent.hidden = false;
    textContent.textContent = arg22 || "3D 户型加载失败，请重新载入户型。";
    arg26(new Error(textContent.textContent));
  }
  function fn9() {
    api = false;
    value37();
    focusActive = "";
    if (frame++) {
      lastActivityVisible.removeAttribute("src");
      lastActivityVisible = isHostVisuallyPresented();
      classList.replaceChildren(lastActivityVisible, textContent);
    }
    onUserActivity(false);
    forEach.forEach(abort4 => abort4.abort());
    onEscapeKey("户型已切换，请在新户型中重新调整视角。");
    failLoad("户型已切换，请在新户型中重新调整照射范围。");
    everConnected = false;
    onOutsidePointerDown(false);
    pendingViewRequests = false;
    framePresented = false;
    streamPaused = false;
    heldPointers = false;
    value35 = false;
    fn2(true);
    clearTimeout(loadTimeoutId);
    classList.classList.remove("is-ready", "is-load-error");
    classList.classList.toggle("is-loading", !!properties.sceneId);
    classList.setAttribute("aria-busy", String(!!properties.sceneId));
    refreshAncestorObservers();
    syncBackgroundClass();
    if (!properties.sceneId) {
      lastActivityVisible.hidden = true;
      textContent.hidden = false;
      textContent.textContent = "请在属性面板中配置 3D 户型";
      return;
    }
    lastActivityVisible.hidden = false;
    textContent.hidden = false;
    textContent.textContent = "";
    textContent.setAttribute("aria-label", "正在准备 3D 户型");
    lastActivityVisible.src = INTERACTION3D_API + "/stage.html?" + new URLSearchParams({
      sceneId: properties.sceneId,
      projectId: pageHidden,
      lighting: awaitingPresentation(properties.lightingMode),
      ...(new URLSearchParams(window.location.search).get("furniture-runtime") === "compact" ? {
        "furniture-runtime": "compact"
      } : {}),
      ...(new URLSearchParams(window.location.search).get("reflection-detail") === "low" ? {
        "reflection-detail": "low"
      } : {}),
      ...(new URLSearchParams(window.location.search).get("performance-diagnostics") === "1" ? {
        "performance-diagnostics": "1",
        ...(new URLSearchParams(window.location.search).get("reflection-work") === "baseline" ? {
          "reflection-work": "baseline"
        } : {})
      } : {})
    });
    if (!focusPanelOpen) {
      fn10();
    }
  }
  function fn10() {
    loadTimeoutId = setTimeout(() => fn8("3D 户型加载较慢，请稍候；若一直没有画面，请重新载入户型。"), 45000);
  }
  const forEach = new Set();
  async function fn11(data) {
    if (disposed || data.origin !== location.origin || data.source !== lastActivityVisible.contentWindow || data.data?.channel !== "hb-i3d-v1") {
      return;
    }
    const type = data.data;
    if (type.type === "vacuum-follow-state") {
      api = type.active === true;
      if (api) {
        value37();
      }
    }
    if (type.type === "vacuum-popup-close") {
      value37();
    }
    if (type.type === "vacuum-popup" && !api && authorized && framePresented && !editing && !context.editable) {
      const value3 = (properties.devices?.vacuums || []).find(id2 => "vacuum:" + id2.id === type.id && id2.visible !== false && id2.entityId);
      if (value3 && context.openVacuumDetails) {
        value37();
        initialLayoutFrame = context.openVacuumDetails(value3, () => {
          initialLayoutFrame = null;
          onFrameMessage();
        }, {
          states: mutationObserver(),
          root: classList,
          frame: lastActivityVisible,
          popupOpacity: properties.popupOpacity,
          getPresentationLayout: () => value39
        });
      }
    }
    if (type.type === "vacuum-room" && authorized && framePresented && !editing && !context.editable) {
      const shortcuts = (properties.devices?.vacuums || []).find(id3 => id3.id === type.vacuumId && id3.visible !== false && id3.entityId);
      const id7 = shortcuts?.shortcuts?.find(id4 => id4.id === type.shortcutId && id4.visible !== false && id4.entityId);
      if (!id7 || type.id !== "vacuum-room:" + shortcuts.id + ":" + id7.id) {
        return;
      }
      try {
        if (!context.runVacuumRoom) {
          throw new Error("清扫操作入口尚未准备好，请刷新页面。");
        }
        await context.runVacuumRoom(id7);
        lastUserActivityAt({
          type: "vacuum-room-result",
          id: type.id
        });
      } catch (message) {
        lastUserActivityAt({
          type: "vacuum-room-result",
          id: type.id,
          error: message.message
        });
      }
    }
    if (type.type === "focus-state" && !editing && !context.editable) {
      const value4 = authorized && framePresented && dismissFocus(type.id);
      everConnected = value4 && type.panelOpen === true;
      onOutsidePointerDown(value4 && type.active === true);
    }
    if (type.type === "model-metadata") {
      value34 = type.metadata;
      onLoadError(value34);
    }
    if (type.type === "ready") {
      activityListenerOptions = type.statePatches === true;
      value36 = null;
      focusActive = "";
      pendingViewRequests = false;
      streamPaused = true;
      value34 = type.metadata;
      stageCamera = type.metadata?.camera;
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
      reloadStage();
      if (focusPanelOpen) {
        fn2(true);
      }
      onLoadError(type.metadata);
    }
    if (type.type === "presented" && type.configId === configSerial && value35) {
      value35 = false;
      if (!framePresented) {
        framePresented = true;
        stageCamera = type.camera || stageCamera;
        viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
        clearTimeout(loadTimeoutId);
        classList.classList.remove("is-loading", "is-load-error");
        classList.classList.add("is-ready");
        classList.setAttribute("aria-busy", "false");
        arg25();
      }
      heldPointers = true;
      fn2();
    }
    if (type.type === "error") {
      fn8(type.message);
    }
    const value26 = authorized && framePresented && (editing || context.editable) && awaitingPresentation(properties.lightingMode) === "region";
    if (type.type === "range-editor-state" && value26) {
      const timeout6 = postToFrame.get(type.requestId);
      if (type.requestId && !timeout6) {
        return;
      }
      if (timeout6) {
        clearTimeout(timeout6.timeout);
        postToFrame.delete(type.requestId);
        if (type.active === timeout6.open && !type.error) {
          timeout6.resolve();
        } else {
          timeout6.reject(new Error(type.error || "照射范围编辑未能打开。"));
        }
      }
      onUserActivity(type.active === true && !type.error, type.error || "");
    }
    if (type.type === "range-overrides" && value26 && type.overrides && typeof type.overrides == "object" && !Array.isArray(type.overrides)) {
      properties.lightRegionOverrides = structuredClone(type.overrides);
      syncActivityState({
        action: "light-region-overrides",
        overrides: structuredClone(properties.lightRegionOverrides)
      });
    }
    if (type.type === "edit" && type.action === "camera" && context.editable && viewEditing) {
      const timeout7 = projectId.get(type.requestId);
      if (timeout7) {
        viewCamera = type.camera;
        clearTimeout(timeout7.timeout);
        projectId.delete(type.requestId);
        timeout7.resolve(type.camera);
      }
    }
    if (type.type === "edit" && editing && authorized && framePresented) {
      if (type.action === "focus-camera") {
        const timeout3 = projectId.get(type.requestId);
        if (!timeout3) {
          return;
        }
        if (timeout3) {
          clearTimeout(timeout3.timeout);
          projectId.delete(type.requestId);
          if (type.error) {
            timeout3.reject(new Error(type.error));
          } else {
            timeout3.resolve(type);
          }
        }
      }
      syncActivityState(type);
    }
    if (type.type === "control" && authorized && framePresented && !editing && !context.editable) {
      const trim = type.command?.entityId;
      if (typeof trim != "string" || !trim.trim() || ![...(properties.lights || []), ...(properties.environment?.airConditioners || []), ...(properties.environment?.curtains || []), ...(properties.devices?.televisions || []), ...(properties.devices?.televisions || []).map(powerEntityId => ({
        entityId: powerEntityId.powerEntityId || powerEntityId.entityId
      }))].some(entityId4 => entityId4.entityId === trim)) {
        return;
      }
      const value5 = frame;
      const value6 = arg5 => {
        if (value5 === frame && framePresented && authorized) {
          lastUserActivityAt(arg5);
        }
      };
      const abort5 = new AbortController();
      forEach.add(abort5);
      const value7 = setTimeout(() => abort5.abort(), 12000);
      try {
        const json = await fetch(INTERACTION3D_API + "/control", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            ...type.command,
            ...(["climate", "cover"].includes(type.command?.domain) || type.command?.deviceKind === "television" ? {
              projectId: pageHidden,
              componentId: component.id
            } : {})
          }),
          signal: abort5.signal
        });
        const detail = await json.json().catch(() => ({}));
        if (!json.ok) {
          throw new Error(typeof detail.detail == "string" ? detail.detail : detail.detail?.message || "设备操作失败。");
        }
        value6({
          type: "control-result",
          requestId: type.requestId
        });
      } catch (name) {
        value6({
          type: "control-result",
          requestId: type.requestId,
          error: name.name === "AbortError" ? "请求超时，请检查设备状态。" : name.message,
          timedOut: name.name === "AbortError"
        });
      } finally {
        clearTimeout(value7);
        forEach.delete(abort5);
      }
    }
  }
  window.addEventListener("message", fn11);
  window.addEventListener("pointerdown", syncPresentationLayout);
  window.addEventListener("keydown", frame2);
  const addEventListener = document.addEventListener ? document : window;
  addEventListener.addEventListener("hb-i3d-preview-scope", fn);
  const activityEventTypes = ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"];
  const activityListenerOptions2 = {
    capture: true,
    passive: true
  };
  for (const eventType of activityEventTypes) {
    addEventListener.addEventListener(eventType, fn3, activityListenerOptions2);
  }
  addEventListener.addEventListener("visibilitychange", fn7);
  addEventListener.addEventListener("transitionend", fn7, true);
  addEventListener.addEventListener("animationend", fn7, true);
  window.addEventListener("pagehide", fn5);
  window.addEventListener("pageshow", fn6);
  window.addEventListener("blur", fn4);
  const observe = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(arg10 => {
    for (const target of arg10) {
      if (target.target === classList) {
        controlAbortControllers = target.isIntersecting && target.intersectionRatio > 0;
      }
    }
    fn2();
  }, {
    threshold: [0, 0.001]
  });
  observe?.observe(classList);
  let length = [];
  function fn12() {
    if (disposed) {
      return;
    }
    const push = [];
    for (let parentElement3 = classList; parentElement3; parentElement3 = parentElement3.parentElement) {
      push.push(parentElement3);
    }
    if (push.length !== length.length || !push.every((arg6, arg7) => arg6 === length[arg7])) {
      length = push;
      disconnect?.disconnect();
      for (const value2 of push) {
        disconnect?.observe(value2, {
          attributes: true,
          childList: true,
          attributeFilter: ["hidden", "inert", "aria-hidden", "style", "class"]
        });
      }
    }
  }
  const disconnect = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
    fn12();
    fn13();
  });
  fn12();
  let value38 = "";
  let value39 = null;
  function fn13(arg23 = false) {
    fn2();
    const width2 = classList.getBoundingClientRect();
    if (!width2.width || !classList.clientWidth) {
      return;
    }
    const value27 = classList.clientWidth / width2.width;
    const value28 = classList.clientHeight > 0 && width2.height > 0 ? classList.clientHeight / width2.height : value27;
    lastActivityVisible.style.width = width2.width + "px";
    lastActivityVisible.style.height = width2.height + "px";
    lastActivityVisible.style.transform = value27 === value28 ? "scale(" + value27 + ")" : "scale(" + value27 + "," + value28 + ")";
    const clientWidth = classList.closest?.(".hb-renderer-canvas");
    const width3 = clientWidth?.getBoundingClientRect();
    const width4 = properties.layoutMode === "fill" ? context.document?.canvas : component.position;
    const value29 = properties.layoutMode === "fill" ? 1 : Math.max(0.01, Math.min(5, Number(component.style?.scale) || 1));
    const value30 = width3?.width > 0 && clientWidth.clientWidth > 0 ? width2.width * clientWidth.clientWidth / width3.width : Number(width4?.width) * value29;
    const value31 = width3?.height > 0 && clientWidth.clientHeight > 0 ? width2.height * clientWidth.clientHeight / width3.height : Number(width4?.height) * value29;
    const value32 = {
      type: "presentation-layout",
      width: value30 > 0 ? value30 : width2.width,
      height: value31 > 0 ? value31 : width2.height
    };
    value39 = value32;
    initialLayoutFrame?.updateLayout?.();
    const value33 = JSON.stringify(value32);
    if (arg23 === true || value33 !== value38) {
      value38 = value33;
      lastUserActivityAt(value32);
    }
  }
  const observe2 = new ResizeObserver(fn13);
  observe2.observe(classList);
  window.addEventListener("resize", fn13);
  fn();
  fn9();
  const value40 = requestAnimationFrame(fn13);
  const api2 = () => {
    if (!disposed) {
      heldPointers = false;
      fn2(true);
      onOutsidePointerDown(false);
      value37();
      intersectionObserver?.dispose();
      interactiveVisible.clear();
      status = false;
      classList.classList.remove("is-range-editing");
      disposed = true;
      clearTimeout(loadTimeoutId);
      cancelAnimationFrame(value40);
      observe2.disconnect();
      observe?.disconnect();
      disconnect?.disconnect();
      onEscapeKey("户型画面已关闭，请重新调整。");
      failLoad("户型画面已关闭，请重新调整照射范围。");
      window.removeEventListener("resize", fn13);
      window.removeEventListener("message", fn11);
      window.removeEventListener("pointerdown", syncPresentationLayout);
      window.removeEventListener("keydown", frame2);
      for (const value of activityEventTypes) {
        addEventListener.removeEventListener(value, fn3, activityListenerOptions2);
      }
      addEventListener.removeEventListener("visibilitychange", fn7);
      addEventListener.removeEventListener("hb-i3d-preview-scope", fn);
      addEventListener.removeEventListener("transitionend", fn7, true);
      addEventListener.removeEventListener("animationend", fn7, true);
      window.removeEventListener("pagehide", fn5);
      window.removeEventListener("pageshow", fn6);
      window.removeEventListener("blur", fn4);
      forEach.forEach(abort => abort.abort());
      lastActivityVisible.removeAttribute("src");
      classList.replaceChildren();
    }
  };
  api2.update = (arg14, arg15 = selectedId) => {
    const value11 = properties.sceneId;
    const value12 = JSON.stringify(properties.camera);
    const value13 = awaitingPresentation(properties.lightingMode);
    properties = structuredClone(arg14);
    selectedId = arg15;
    syncBackgroundClass();
    refreshAncestorObservers();
    if (viewEditing && (value11 !== properties.sceneId || value13 !== awaitingPresentation(properties.lightingMode) || value12 !== JSON.stringify(properties.camera))) {
      viewEditing = false;
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
      classList.classList.remove("is-view-editing");
      lastActivityVisible.style.pointerEvents = "none";
    }
    if (value11 !== properties.sceneId || value13 !== awaitingPresentation(properties.lightingMode)) {
      fn9();
    } else {
      reloadStage();
    }
  };
  api2.command = nextProperties => lastUserActivityAt({
    type: "editor-command",
    command: nextProperties
  });
  api2.subscribeEdit = command => disposed || typeof command != "function" ? () => {} : (interactiveVisible.add(command), () => interactiveVisible.delete(command));
  api2.openRangeEditor = () => {
    if (disposed || !authorized || !editing && !context.editable) {
      return Promise.reject(new Error("请在已授权的控件编辑器中调整照射范围。"));
    }
    if (!framePresented) {
      return Promise.reject(new Error("户型还在加载，请稍候再调整照射范围。"));
    }
    if (awaitingPresentation(properties.lightingMode) !== "region") {
      return Promise.reject(new Error("请先选择轻量柔光模式。"));
    }
    if (status) {
      return Promise.resolve();
    }
    const promise = postToFrame.values().next().value;
    if (promise) {
      return promise.promise;
    }
    if (viewEditing) {
      api2.setViewEditing(false);
    }
    const requestId3 = "range-" + ++viewRequestSerial;
    let resolve5;
    let reject5;
    const promise2 = new Promise((arg3, arg4) => {
      resolve5 = arg3;
      reject5 = arg4;
    });
    const timeout10 = setTimeout(() => {
      postToFrame.delete(requestId3);
      lastUserActivityAt({
        type: "range-editor",
        open: false
      });
      onUserActivity(false);
      reject5(new Error("打开照射范围编辑超时，请重试。"));
    }, 5000);
    postToFrame.set(requestId3, {
      resolve: resolve5,
      reject: reject5,
      timeout: timeout10,
      promise: promise2,
      open: true
    });
    lastUserActivityAt({
      type: "range-editor",
      open: true,
      requestId: requestId3
    });
    return promise2;
  };
  api2.flushRangeEditor = () => {
    if (disposed || !authorized || !framePresented || !status) {
      return Promise.reject(new Error("请先打开照射范围编辑。"));
    }
    const requestId4 = "range-" + ++viewRequestSerial;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        postToFrame.delete(requestId4);
        reject(new Error("读取照射范围超时，请重试。"));
      }, 5000);
      postToFrame.set(requestId4, {
        resolve,
        reject,
        timeout,
        open: true
      });
      lastUserActivityAt({
        type: "range-editor",
        flush: true,
        requestId: requestId4
      });
    });
  };
  api2.closeRangeEditor = ({
    flush: arg16 = false
  } = {}) => {
    failLoad("照射范围编辑已取消。");
    if (!arg16) {
      lastUserActivityAt({
        type: "range-editor",
        open: false
      });
      onUserActivity(false);
      return;
    }
    if (disposed || !authorized || !framePresented) {
      return Promise.reject(new Error("户型画面暂不可用，请重新打开照射范围。"));
    }
    const requestId5 = "range-" + ++viewRequestSerial;
    return new Promise((resolve2, reject2) => {
      const timeout2 = setTimeout(() => {
        postToFrame.delete(requestId5);
        reject2(new Error("读取照射范围超时，请重试。"));
      }, 5000);
      postToFrame.set(requestId5, {
        resolve: resolve2,
        reject: reject2,
        timeout: timeout2,
        open: false
      });
      lastUserActivityAt({
        type: "range-editor",
        open: false,
        requestId: requestId5
      });
    });
  };
  api2.setAuthorized = arg17 => {
    const value14 = authorized !== (arg17 === true);
    authorized = arg17 === true;
    classList.inert = !authorized;
    fn2();
    if (!authorized) {
      api2.closeRangeEditor();
      onEscapeKey("授权验证暂不可用，请恢复后重新调整。");
      onFrameMessage(true);
      forEach.forEach(abort2 => abort2.abort());
    }
    if (value14 && (editing || context.editable)) {
      reloadStage();
    }
  };
  Object.defineProperty(api2, "metadata", {
    get: () => value34
  });
  Object.defineProperty(api2, "ready", {
    get: () => framePresented && !disposed && authorized
  });
  Object.defineProperty(api2, "viewEditing", {
    get: () => viewEditing
  });
  Object.defineProperty(api2, "viewCamera", {
    get: () => viewCamera
  });
  Object.defineProperty(api2, "rangeEditing", {
    get: () => status && !disposed && authorized
  });
  api2.setViewEditing = arg18 => {
    if (!context.editable || disposed) {
      throw new Error("请在编辑器中调整户型视角。");
    }
    if (arg18 && !framePresented) {
      throw new Error("户型还在加载，请稍候再调整视角。");
    }
    if (arg18 && (status || postToFrame.size)) {
      api2.closeRangeEditor();
    }
    viewEditing = arg18 === true;
    if (!viewEditing) {
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
    }
    classList.classList.toggle("is-view-editing", viewEditing);
    lastActivityVisible.style.pointerEvents = viewEditing || status ? "auto" : "none";
    reloadStage();
  };
  api2.viewCommand = (command, value15) => new Promise((resolve3, reject3) => {
    if (!context.editable || !viewEditing || !framePresented || disposed) {
      reject3(new Error("请先进入户型视角调整。"));
      return;
    }
    const requestId = "view-" + ++viewRequestSerial;
    const timeout4 = setTimeout(() => {
      projectId.delete(requestId);
      reject3(new Error("读取视角超时，请重试。"));
    }, 5000);
    projectId.set(requestId, {
      resolve: resolve3,
      reject: reject3,
      timeout: timeout4
    });
    lastUserActivityAt({
      type: "editor-command",
      command,
      value: value15,
      requestId
    });
  });
  api2.captureView = () => api2.viewCommand("save-camera");
  api2.focusCommand = (command2, id8 = selectedId, value16) => new Promise((resolve4, reject4) => {
    if (!editing || !framePresented || disposed || !authorized) {
      reject4(new Error("户型还在加载，请稍候再设置聚焦视角。"));
      return;
    }
    const requestId2 = "focus-" + ++viewRequestSerial;
    const timeout5 = setTimeout(() => {
      projectId.delete(requestId2);
      reject4(new Error("读取聚焦视角超时，请重试。"));
    }, 5000);
    projectId.set(requestId2, {
      resolve: resolve4,
      reject: reject4,
      timeout: timeout5
    });
    lastUserActivityAt({
      type: "editor-command",
      command: command2,
      id: id8,
      value: value16,
      requestId: requestId2
    });
  });
  return api2;
}
