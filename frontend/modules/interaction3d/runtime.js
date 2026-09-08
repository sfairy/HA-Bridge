import { createLightStream } from "./light-stream.js?v=20260906-i3d-light-stream-v1";
const INTERACTION3D_API = "/api/v1/modules/interaction3d";
export function mountInteraction3d(
  host,
  {
    component,
    context = {},
    editing = false,
    onEdit = () => {},
    onReady = () => {},
    onStates = null,
    onPresented = () => {},
    onLoadError = () => {},
    onFocusChange = () => {},
  },
) {
  host.className = "hb-interaction3d-runtime";
  let properties = structuredClone(component.properties || {});
  let disposed = false;
  let authorized = true;
  let selectedId = "";
  let loadTimeoutId;
  let modelMetadata;
  let framePresented = false;
  let viewEditing = false;
  let viewRequestSerial = 0;
  let configSerial = 0;
  let stageCamera;
  let viewCamera = properties.camera;
  let focusActive = false;
  let focusPanelOpen = false;
  let frameReady = false;
  let everConnected = false;
  let streamPaused = false;
  let reloadGeneration = 0;
  const pendingViewRequests = new Map();
  const frame = document.createElement("iframe");
  frame.title = "3D 交互户型";
  frame.className = "i3d-frame";
  frame.setAttribute("allow", "fullscreen");
  if (context.editable && !editing) {
    frame.style.pointerEvents = "none";
  }
  const status = document.createElement("p");
  status.className = "i3d-loading";
  status.setAttribute("role", "status");
  host.replaceChildren(frame, status);
  const projectId = context.document?.projectId || "";
  const postToFrame = (payload) => {
    if (!disposed && frame.contentWindow) {
      frame.contentWindow.postMessage(
        {
          channel: "hb-i3d-v1",
          ...payload,
        },
        location.origin,
      );
    }
  };
  let interactiveVisible = false;
  let awaitingPresentation = false;
  let lastActivityVisible;
  let lastPresentedVisible;
  let pageHidden = false;
  let lastUserActivityAt = -Infinity;
  const heldPointers = new Set();
  const heldKeys = new Set();
  const hasHeldInput = () => heldPointers.size > 0 || heldKeys.size > 0;
  let hostIntersecting = typeof IntersectionObserver === "undefined";
  function isHostVisuallyPresented() {
    if (
      host.isConnected === false ||
      host.hidden ||
      host.inert ||
      frame.hidden ||
      host.checkVisibility?.({
        opacityProperty: true,
        visibilityProperty: true,
        contentVisibilityAuto: true,
      }) === false
    ) {
      return false;
    }
    for (let ancestor = host; ancestor; ancestor = ancestor.parentElement) {
      if (
        ancestor.hidden ||
        ancestor.inert ||
        ancestor.getAttribute?.("aria-hidden") === "true"
      ) {
        return false;
      }
      const style = window.getComputedStyle?.(ancestor);
      if (
        style &&
        (style.display === "none" ||
          style.visibility === "hidden" ||
          style.visibility === "collapse" ||
          Number(style.opacity) === 0)
      ) {
        return false;
      }
    }
    const bounds = host.getBoundingClientRect();
    const viewportWidth =
      document.documentElement?.clientWidth || window.innerWidth || Infinity;
    const viewportHeight =
      document.documentElement?.clientHeight || window.innerHeight || Infinity;
    return (
      bounds.width > 0 &&
      bounds.height > 0 &&
      (bounds.left || 0) < viewportWidth &&
      (bounds.top || 0) < viewportHeight &&
      (bounds.right ?? (bounds.left || 0) + bounds.width) > 0 &&
      (bounds.bottom ?? (bounds.top || 0) + bounds.height) > 0
    );
  }
  function syncActivityState(force = false) {
    if (disposed) {
      return;
    }
    syncLightStreamActive();
    const nextActivityVisible =
      interactiveVisible &&
      framePresented &&
      authorized &&
      !editing &&
      !context.editable &&
      !viewEditing &&
      !pageHidden &&
      document.hidden !== true &&
      document.visibilityState !== "hidden" &&
      hostIntersecting &&
      isHostVisuallyPresented();
    const nextPresentedVisible =
      authorized &&
      !pageHidden &&
      document.hidden !== true &&
      document.visibilityState !== "hidden" &&
      hostIntersecting &&
      isHostVisuallyPresented();
    if (!nextActivityVisible) {
      heldPointers.clear();
      heldKeys.clear();
    }
    if (force || nextActivityVisible !== lastActivityVisible || nextPresentedVisible !== lastPresentedVisible) {
      lastActivityVisible = nextActivityVisible;
      lastPresentedVisible = nextPresentedVisible;
      lastUserActivityAt = -Infinity;
      postToFrame({
        type: "activity-state",
        visible: nextActivityVisible,
        presentedVisible: nextPresentedVisible,
      });
    }
  }
  function onUserActivity(event) {
    if (disposed || event.isTrusted === false) {
      return;
    }
    const wasHeld = hasHeldInput();
    if (event.type === "pointerdown") {
      heldPointers.add(event.pointerId);
    }
    if (event.type === "pointerup" || event.type === "pointercancel") {
      heldPointers.delete(event.pointerId);
    }
    if (event.type === "keydown") {
      heldKeys.add(event.code || event.key);
    }
    if (event.type === "keyup") {
      heldKeys.delete(event.code || event.key);
    }
    const now = globalThis.performance?.now?.() ?? Date.now();
    if (hasHeldInput() !== wasHeld || !(now - lastUserActivityAt < 200)) {
      syncActivityState();
      if (lastActivityVisible) {
        lastUserActivityAt = now;
        postToFrame({
          type: "user-activity",
          held: hasHeldInput(),
        });
      }
    }
  }
  function clearHeldInput() {
    if (disposed) {
      return;
    }
    const wasHeld = hasHeldInput();
    heldPointers.clear();
    heldKeys.clear();
    syncActivityState();
    if (wasHeld && lastActivityVisible) {
      lastUserActivityAt = globalThis.performance?.now?.() ?? Date.now();
      postToFrame({
        type: "user-activity",
        held: false,
      });
    }
  }
  function onPageHide() {
    pageHidden = true;
    syncActivityState();
  }
  function onPageShow(event) {
    pageHidden = false;
    if (event?.persisted && !disposed) {
      reloadStage();
    } else {
      syncActivityState();
    }
  }
  function onVisibilityChange() {
    syncActivityState();
  }
  let streamedStates = {};
  const lightStream =
    typeof window.WebSocket == "function"
      ? createLightStream({
          onStates(states) {
            streamedStates = states;
            onStates?.(states);
            if (frameReady) {
              pushStates();
            }
          },
        })
      : null;
  function syncLightStreamActive() {
    if (!lightStream || disposed) {
      return;
    }
    if (host.isConnected === true) {
      everConnected = true;
    }
    let active =
      authorized &&
      !streamPaused &&
      !!properties.sceneId &&
      !pageHidden &&
      document.hidden !== true &&
      document.visibilityState !== "hidden" &&
      (!everConnected || host.isConnected !== false);
    for (let ancestor = host; active && ancestor; ancestor = ancestor.parentElement) {
      const style = window.getComputedStyle?.(ancestor);
      if (
        ancestor.hidden ||
        ancestor.inert ||
        ancestor.getAttribute?.("aria-hidden") === "true" ||
        style?.display === "none" ||
        ["hidden", "collapse"].includes(style?.visibility)
      ) {
        active = false;
      }
    }
    lightStream.setActive(active);
  }
  const collectStates = () =>
    lightStream
      ? streamedStates
      : Object.fromEntries(
          (properties.lights || []).map((light) => [
            light.entityId,
            context.states?.get(light.entityId) || null,
          ]),
        );
  const pushStates = () => {
    const states = collectStates();
    postToFrame({
      type: "states",
      states,
    });
    if (!lightStream) {
      onStates?.(states);
    }
  };
  const registeredEntityIds = new Set();
  function configureLightBindings() {
    if (lightStream) {
      lightStream.configure((properties.lights || []).map((light) => light.entityId));
      syncLightStreamActive();
      return;
    }
    for (const light of properties.lights || []) {
      if (light.entityId && !registeredEntityIds.has(light.entityId)) {
        registeredEntityIds.add(light.entityId);
        context.registerRuntimeStateHandler?.(light.entityId, pushStates);
      }
    }
  }
  function pushConfig() {
    interactiveVisible = false;
    awaitingPresentation = true;
    syncActivityState(true);
    syncPresentationLayout(true);
    postToFrame({
      type: "config",
      configId: ++configSerial,
      properties,
      editing,
      viewEditing,
      interactive: !editing && !context.editable,
      selectedId,
      states: collectStates(),
    });
    if (!framePresented) {
      syncActivityState(true);
    }
  }
  function syncBackgroundClass() {
    host.classList.toggle(
      "is-background-hidden",
      properties.backgroundVisible === false,
    );
  }
  function setFocusActive(next) {
    if (focusActive !== next) {
      focusActive = next;
      onFocusChange(next);
    }
  }
  function rejectPendingViewRequests(message) {
    for (const pending of pendingViewRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error(message));
    }
    pendingViewRequests.clear();
  }
  function dismissFocus(immediate = false) {
    focusPanelOpen = false;
    setFocusActive(false);
    postToFrame({
      type: "dismiss-focus",
      immediate,
    });
  }
  function onOutsidePointerDown(event) {
    if ((focusActive || focusPanelOpen) && !host.contains(event.target)) {
      dismissFocus();
    }
  }
  function onEscapeKey(event) {
    if ((focusActive || focusPanelOpen) && event.key === "Escape") {
      dismissFocus();
    }
  }
  function failLoad(message) {
    streamPaused = true;
    framePresented = false;
    interactiveVisible = false;
    awaitingPresentation = false;
    syncActivityState(true);
    rejectPendingViewRequests("户型加载失败，请重新载入后调整视角。");
    dismissFocus(true);
    clearTimeout(loadTimeoutId);
    host.classList.remove("is-loading");
    host.classList.add("is-load-error");
    status.hidden = false;
    status.textContent = message || "3D 户型加载失败，请重新载入户型。";
    onLoadError(new Error(status.textContent));
  }
  function reloadStage() {
    reloadGeneration++;
    rejectPendingViewRequests("户型已切换，请在新户型中重新调整视角。");
    focusPanelOpen = false;
    setFocusActive(false);
    streamPaused = false;
    framePresented = false;
    frameReady = false;
    interactiveVisible = false;
    awaitingPresentation = false;
    syncActivityState(true);
    clearTimeout(loadTimeoutId);
    host.classList.remove("is-ready", "is-load-error");
    host.classList.toggle("is-loading", !!properties.sceneId);
    host.setAttribute("aria-busy", String(!!properties.sceneId));
    syncBackgroundClass();
    configureLightBindings();
    if (!properties.sceneId) {
      frame.hidden = true;
      status.hidden = false;
      status.textContent = "请在属性面板中配置 3D 户型";
      return;
    }
    frame.hidden = false;
    status.hidden = false;
    status.textContent = "";
    status.setAttribute("aria-label", "正在准备 3D 户型");
    frame.src =
      INTERACTION3D_API +
      "/stage.html?" +
      new URLSearchParams({
        sceneId: properties.sceneId,
        projectId,
      });
    loadTimeoutId = setTimeout(
      () => failLoad("3D 户型加载较慢，请稍候；若一直没有画面，请重新载入户型。"),
      45000,
    );
  }
  const controlAbortControllers = new Set();
  async function onFrameMessage(event) {
    if (
      disposed ||
      event.origin !== location.origin ||
      event.source !== frame.contentWindow ||
      event.data?.channel !== "hb-i3d-v1"
    ) {
      return;
    }
    const message = event.data;
    if (message.type === "focus-state" && !editing && !context.editable) {
      focusPanelOpen =
        authorized &&
        framePresented &&
        message.panelOpen === true &&
        (properties.lights || []).some((light) => light.id === message.id);
      setFocusActive(
        authorized &&
          framePresented &&
          message.active === true &&
          (properties.lights || []).some((light) => light.id === message.id),
      );
    }
    if (message.type === "model-metadata") {
      modelMetadata = message.metadata;
      onReady(modelMetadata);
    }
    if (message.type === "ready") {
      streamPaused = false;
      frameReady = true;
      modelMetadata = message.metadata;
      stageCamera = message.metadata?.camera;
      viewCamera = properties.camera || stageCamera;
      pushConfig();
      onReady(message.metadata);
    }
    if (message.type === "presented" && message.configId === configSerial && awaitingPresentation) {
      awaitingPresentation = false;
      if (!framePresented) {
        framePresented = true;
        stageCamera = message.camera || stageCamera;
        viewCamera = properties.camera || stageCamera;
        clearTimeout(loadTimeoutId);
        host.classList.remove("is-loading", "is-load-error");
        host.classList.add("is-ready");
        host.setAttribute("aria-busy", "false");
        onPresented();
      }
      interactiveVisible = true;
      syncActivityState();
    }
    if (message.type === "error") {
      failLoad(message.message);
    }
    if (message.type === "edit" && message.action === "camera" && context.editable && viewEditing) {
      const pending = pendingViewRequests.get(message.requestId);
      if (pending) {
        viewCamera = message.camera;
        clearTimeout(pending.timeout);
        pendingViewRequests.delete(message.requestId);
        pending.resolve(message.camera);
      }
    }
    if (message.type === "edit" && editing && authorized && framePresented) {
      if (message.action === "focus-camera") {
        const pending = pendingViewRequests.get(message.requestId);
        if (!pending) {
          return;
        }
        if (pending) {
          clearTimeout(pending.timeout);
          pendingViewRequests.delete(message.requestId);
          if (message.error) {
            pending.reject(new Error(message.error));
          } else {
            pending.resolve(message);
          }
        }
      }
      onEdit(message);
    }
    if (message.type === "control" && authorized && !editing && !context.editable) {
      if (
        !(properties.lights || []).some(
          (light) => light.entityId === message.command?.entityId,
        )
      ) {
        return;
      }
      const generation = reloadGeneration;
      const postIfCurrent = (payload) => {
        if (generation === reloadGeneration) {
          postToFrame(payload);
        }
      };
      const abortController = new AbortController();
      controlAbortControllers.add(abortController);
      const timeoutId = setTimeout(() => abortController.abort(), 12000);
      try {
        const response = await fetch(INTERACTION3D_API + "/control", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(message.command),
          signal: abortController.signal,
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            typeof payload.detail == "string"
              ? payload.detail
              : payload.detail?.message || "灯光操作失败。",
          );
        }
        postIfCurrent({
          type: "control-result",
          requestId: message.requestId,
        });
      } catch (error) {
        postIfCurrent({
          type: "control-result",
          requestId: message.requestId,
          error:
            error.name === "AbortError"
              ? "请求超时，请检查设备状态。"
              : error.message,
          timedOut: error.name === "AbortError",
        });
      } finally {
        clearTimeout(timeoutId);
        controlAbortControllers.delete(abortController);
      }
    }
  }
  window.addEventListener("message", onFrameMessage);
  window.addEventListener("pointerdown", onOutsidePointerDown);
  window.addEventListener("keydown", onEscapeKey);
  const activityTarget = document.addEventListener ? document : window;
  const activityEventTypes = [
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "wheel",
    "keydown",
    "keyup",
  ];
  const activityListenerOptions = {
    capture: true,
    passive: true,
  };
  for (const eventType of activityEventTypes) {
    activityTarget.addEventListener(eventType, onUserActivity, activityListenerOptions);
  }
  activityTarget.addEventListener("visibilitychange", onVisibilityChange);
  activityTarget.addEventListener("transitionend", onVisibilityChange, true);
  activityTarget.addEventListener("animationend", onVisibilityChange, true);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", onPageShow);
  window.addEventListener("blur", clearHeldInput);
  const intersectionObserver =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.target === host) {
                hostIntersecting = entry.isIntersecting && entry.intersectionRatio > 0;
              }
            }
            syncActivityState();
          },
          {
            threshold: [0, 0.001],
          },
        );
  intersectionObserver?.observe(host);
  let observedAncestors = [];
  function refreshAncestorObservers() {
    if (disposed) {
      return;
    }
    const ancestors = [];
    for (let ancestor = host; ancestor; ancestor = ancestor.parentElement) {
      ancestors.push(ancestor);
    }
    if (
      ancestors.length !== observedAncestors.length ||
      !ancestors.every((node, index) => node === observedAncestors[index])
    ) {
      observedAncestors = ancestors;
      mutationObserver?.disconnect();
      for (const ancestor of ancestors) {
        mutationObserver?.observe(ancestor, {
          attributes: true,
          childList: true,
          attributeFilter: ["hidden", "inert", "aria-hidden", "style", "class"],
        });
      }
    }
  }
  const mutationObserver =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(() => {
          refreshAncestorObservers();
          syncPresentationLayout();
        });
  refreshAncestorObservers();
  let lastLayoutPayload = "";
  function syncPresentationLayout(force = false) {
    syncActivityState();
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !host.clientWidth) {
      return;
    }
    const scaleX = host.clientWidth / bounds.width;
    const scaleY =
      host.clientHeight > 0 && bounds.height > 0
        ? host.clientHeight / bounds.height
        : scaleX;
    frame.style.width = bounds.width + "px";
    frame.style.height = bounds.height + "px";
    frame.style.transform =
      scaleX === scaleY
        ? "scale(" + scaleX + ")"
        : "scale(" + scaleX + "," + scaleY + ")";
    const canvas = host.closest?.(".hb-renderer-canvas");
    const canvasBounds = canvas?.getBoundingClientRect();
    const layoutBox = properties.layoutMode === "fill" ? context.document?.canvas : component.position;
    const styleScale =
      properties.layoutMode === "fill"
        ? 1
        : Math.max(0.01, Math.min(5, Number(component.style?.scale) || 1));
    const layoutWidth =
      canvasBounds?.width > 0 && canvas.clientWidth > 0
        ? (bounds.width * canvas.clientWidth) / canvasBounds.width
        : Number(layoutBox?.width) * styleScale;
    const layoutHeight =
      canvasBounds?.height > 0 && canvas.clientHeight > 0
        ? (bounds.height * canvas.clientHeight) / canvasBounds.height
        : Number(layoutBox?.height) * styleScale;
    const payload = {
      type: "presentation-layout",
      width: layoutWidth > 0 ? layoutWidth : bounds.width,
      height: layoutHeight > 0 ? layoutHeight : bounds.height,
    };
    const payloadJson = JSON.stringify(payload);
    if (force === true || payloadJson !== lastLayoutPayload) {
      lastLayoutPayload = payloadJson;
      postToFrame(payload);
    }
  }
  const resizeObserver = new ResizeObserver(syncPresentationLayout);
  resizeObserver.observe(host);
  window.addEventListener("resize", syncPresentationLayout);
  reloadStage();
  const initialLayoutFrame = requestAnimationFrame(syncPresentationLayout);
  const api = () => {
    if (!disposed) {
      interactiveVisible = false;
      syncActivityState(true);
      setFocusActive(false);
      lightStream?.dispose();
      disposed = true;
      clearTimeout(loadTimeoutId);
      cancelAnimationFrame(initialLayoutFrame);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      mutationObserver?.disconnect();
      rejectPendingViewRequests("户型画面已关闭，请重新调整。");
      window.removeEventListener("resize", syncPresentationLayout);
      window.removeEventListener("message", onFrameMessage);
      window.removeEventListener("pointerdown", onOutsidePointerDown);
      window.removeEventListener("keydown", onEscapeKey);
      for (const eventType of activityEventTypes) {
        activityTarget.removeEventListener(eventType, onUserActivity, activityListenerOptions);
      }
      activityTarget.removeEventListener("visibilitychange", onVisibilityChange);
      activityTarget.removeEventListener("transitionend", onVisibilityChange, true);
      activityTarget.removeEventListener("animationend", onVisibilityChange, true);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("blur", clearHeldInput);
      controlAbortControllers.forEach((controller) => controller.abort());
      frame.removeAttribute("src");
      host.replaceChildren();
    }
  };
  api.update = (nextProperties, nextSelectedId = selectedId) => {
    const previousSceneId = properties.sceneId;
    const previousCameraJson = JSON.stringify(properties.camera);
    properties = structuredClone(nextProperties);
    selectedId = nextSelectedId;
    configureLightBindings();
    syncBackgroundClass();
    if (viewEditing && (previousSceneId !== properties.sceneId || previousCameraJson !== JSON.stringify(properties.camera))) {
      viewEditing = false;
      viewCamera = properties.camera || stageCamera;
      host.classList.remove("is-view-editing");
      frame.style.pointerEvents = "none";
    }
    if (previousSceneId !== properties.sceneId) {
      reloadStage();
    } else {
      pushConfig();
    }
  };
  api.command = (command) =>
    postToFrame({
      type: "editor-command",
      command,
    });
  api.setAuthorized = (nextAuthorized) => {
    authorized = nextAuthorized === true;
    host.inert = !authorized;
    syncActivityState();
    if (!authorized) {
      rejectPendingViewRequests("授权验证暂不可用，请恢复后重新调整。");
      dismissFocus(true);
      controlAbortControllers.forEach((controller) => controller.abort());
    }
  };
  Object.defineProperty(api, "metadata", {
    get: () => modelMetadata,
  });
  Object.defineProperty(api, "ready", {
    get: () => framePresented && !disposed && authorized,
  });
  Object.defineProperty(api, "viewEditing", {
    get: () => viewEditing,
  });
  Object.defineProperty(api, "viewCamera", {
    get: () => viewCamera,
  });
  api.setViewEditing = (enabled) => {
    if (!context.editable || disposed) {
      throw new Error("请在编辑器中调整户型视角。");
    }
    if (enabled && !framePresented) {
      throw new Error("户型还在加载，请稍候再调整视角。");
    }
    viewEditing = enabled === true;
    if (!viewEditing) {
      viewCamera = properties.camera || stageCamera;
    }
    host.classList.toggle("is-view-editing", viewEditing);
    frame.style.pointerEvents = viewEditing ? "auto" : "none";
    pushConfig();
  };
  api.viewCommand = (command, value) =>
    new Promise((resolve, reject) => {
      if (!context.editable || !viewEditing || !framePresented || disposed) {
        reject(new Error("请先进入户型视角调整。"));
        return;
      }
      const requestId = "view-" + ++viewRequestSerial;
      const timeout = setTimeout(() => {
        pendingViewRequests.delete(requestId);
        reject(new Error("读取视角超时，请重试。"));
      }, 5000);
      pendingViewRequests.set(requestId, {
        resolve,
        reject,
        timeout,
      });
      postToFrame({
        type: "editor-command",
        command,
        value,
        requestId,
      });
    });
  api.captureView = () => api.viewCommand("save-camera");
  api.focusCommand = (command, id = selectedId, value) =>
    new Promise((resolve, reject) => {
      if (!editing || !framePresented || disposed || !authorized) {
        reject(new Error("户型还在加载，请稍候再设置聚焦视角。"));
        return;
      }
      const requestId = "focus-" + ++viewRequestSerial;
      const timeout = setTimeout(() => {
        pendingViewRequests.delete(requestId);
        reject(new Error("读取聚焦视角超时，请重试。"));
      }, 5000);
      pendingViewRequests.set(requestId, {
        resolve,
        reject,
        timeout,
      });
      postToFrame({
        type: "editor-command",
        command,
        id,
        value,
        requestId,
      });
    });
  return api;
}
