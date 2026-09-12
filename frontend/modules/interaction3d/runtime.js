import { createLightStream } from "./light-stream.js?v=20260909-preview-sleep-v1";
const INTERACTION3D_API = "/api/v1/modules/interaction3d";
export function mountInteraction3d(host, {
  component,
  context = {},
  editing = false,
  editingModule = "light",
  editingVacuumId = "",
  rangeEditorOnly = false,
  onEdit = () => {},
  onReady = () => {},
  onStates = null,
  onPresented = () => {},
  onLoadError = () => {},
  onFocusChange = () => {}
}) {
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
  let viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera;
  let lastConfigJson = "";
  let previewSuspended = false;
  let focusUiActive = false;
  let focusPanelOpen = false;
  let streamPaused = false;
  let reloadGeneration = false;
  let pendingViewRequests = false;
  let frame = 0;
  let rangeEditingActive = false;
  const viewRequestWaiters = new Map();
  const rangeRequestWaiters = new Map();
  const editSubscribers = new Set();
  const normalizeLightingMode = lightingMode => lightingMode === "region" ? "region" : "standard";
  function createFrameElement() {
    const iframeEl = document.createElement("iframe");
    iframeEl.title = "3D 交互户型";
    iframeEl.className = "i3d-frame";
    iframeEl.setAttribute("allow", "fullscreen");
    if (context.editable && !editing && !viewEditing && !rangeEditingActive) {
      iframeEl.style.pointerEvents = "none";
    }
    return iframeEl;
  }
  let frameEl = createFrameElement();
  const loadingEl = document.createElement("p");
  loadingEl.className = "i3d-loading";
  loadingEl.setAttribute("role", "status");
  host.replaceChildren(frameEl, loadingEl);
  const documentProjectId = context.document?.projectId || "";
  const postFrameMessage = payload => {
    if (!disposed && frameEl.contentWindow) {
      frameEl.contentWindow.postMessage({
        channel: "hb-i3d-v1",
        ...payload
      }, location.origin);
    }
  };
  function notifyEditListeners(editPayload) {
    onEdit(editPayload);
    for (const listener of [...editSubscribers]) {
      listener(editPayload);
    }
  }
  function setRangeEditingActive(event, error = "") {
    const wasHeld = event === true;
    if (wasHeld !== rangeEditingActive || !!error) {
      rangeEditingActive = wasHeld;
      host.classList.toggle("is-range-editing", wasHeld);
      if (context.editable && !editing) {
        frameEl.style.pointerEvents = wasHeld || viewEditing ? "auto" : "none";
      }
      notifyEditListeners({
        action: "range-editor-state",
        active: wasHeld,
        ...(error ? {
          error
        } : {})
      });
    }
  }
  let activityGateOpen = false;
  let awaitingPresented = false;
  let frameActivityVisible;
  let framePresentedVisible;
  let pageHiddenPaused = false;
  let lastActivityPostAt = -Infinity;
  const heldPointerIds = new Set();
  const heldKeyCodes = new Set();
  const hasHeldActivity = () => heldPointerIds.size > 0 || heldKeyCodes.size > 0;
  let hostIsIntersecting = typeof IntersectionObserver === "undefined";
  function syncPreviewScopeSuspension() {
    const wasHeld = [...(document.querySelectorAll?.("dialog[data-i3d-preview-scope][open]") || [])].at(-1);
    const suspendedByDialog = !!wasHeld && !wasHeld.contains(host);
    if (previewSuspended !== suspendedByDialog && !disposed) {
      previewSuspended = suspendedByDialog;
      host.setAttribute("data-preview-suspended", String(suspendedByDialog));
      clearTimeout(loadTimeoutId);
      if (!suspendedByDialog) {
        if (!framePresented && properties.sceneId && !pendingViewRequests) {
          scheduleLoadTimeout();
        }
        if (streamPaused) {
          pushStatesToFrame();
        }
        if (intersectionObserver) {
          onStates?.(readStates());
        }
        vacuumPopup?.updateStates?.(readStates());
        pushConfigToFrame();
      }
      syncActivityVisibility();
    }
  }
  function isHostVisiblyConnected() {
    if (host.isConnected === false || host.hidden || host.inert || frameEl.hidden || host.checkVisibility?.({
      opacityProperty: true,
      visibilityProperty: true,
      contentVisibilityAuto: true
    }) === false) {
      return false;
    }
    for (let parentElement = host; parentElement; parentElement = parentElement.parentElement) {
      if (parentElement.hidden || parentElement.inert || parentElement.getAttribute?.("aria-hidden") === "true") {
        return false;
      }
      const visibility = window.getComputedStyle?.(parentElement);
      if (visibility && (visibility.display === "none" || visibility.visibility === "hidden" || visibility.visibility === "collapse" || Number(visibility.opacity) === 0)) {
        return false;
      }
    }
    const width = host.getBoundingClientRect();
    const viewportWidth = document.documentElement?.clientWidth || window.innerWidth || Infinity;
    const viewportHeight = document.documentElement?.clientHeight || window.innerHeight || Infinity;
    return width.width > 0 && width.height > 0 && (width.left || 0) < viewportWidth && (width.top || 0) < viewportHeight && (width.right ?? (width.left || 0) + width.width) > 0 && (width.bottom ?? (width.top || 0) + width.height) > 0;
  }
  function syncActivityVisibility(force = false) {
    if (disposed) {
      return;
    }
    syncStreamActive();
    const visible = activityGateOpen && framePresented && authorized && !editing && !context.editable && !viewEditing && !previewSuspended && !pageHiddenPaused && document.hidden !== true && document.visibilityState !== "hidden" && hostIsIntersecting && isHostVisiblyConnected();
    const presentedVisible = authorized && !previewSuspended && !pageHiddenPaused && document.hidden !== true && document.visibilityState !== "hidden" && hostIsIntersecting && isHostVisiblyConnected();
    if (!visible) {
      heldPointerIds.clear();
      heldKeyCodes.clear();
    }
    if (force || visible !== frameActivityVisible || presentedVisible !== framePresentedVisible) {
      frameActivityVisible = visible;
      framePresentedVisible = presentedVisible;
      lastActivityPostAt = -Infinity;
      postFrameMessage({
        type: "activity-state",
        visible,
        presentedVisible
      });
    }
  }
  function onActivityPointerOrKey(next) {
    if (disposed || next.isTrusted === false) {
      return;
    }
    const wasHeldBefore = hasHeldActivity();
    if (next.type === "pointerdown") {
      heldPointerIds.add(next.pointerId);
    }
    if (next.type === "pointerup" || next.type === "pointercancel") {
      heldPointerIds.delete(next.pointerId);
    }
    if (next.type === "keydown") {
      heldKeyCodes.add(next.code || next.key);
    }
    if (next.type === "keyup") {
      heldKeyCodes.delete(next.code || next.key);
    }
    const nowMs = globalThis.performance?.now?.() ?? Date.now();
    if (hasHeldActivity() !== wasHeldBefore || !(nowMs - lastActivityPostAt < 200)) {
      syncActivityVisibility();
      if (frameActivityVisible) {
        lastActivityPostAt = nowMs;
        postFrameMessage({
          type: "user-activity",
          held: hasHeldActivity()
        });
      }
    }
  }
  function onWindowBlurClearHeld() {
    if (disposed) {
      return;
    }
    const hadHeldInput = hasHeldActivity();
    heldPointerIds.clear();
    heldKeyCodes.clear();
    syncActivityVisibility();
    if (hadHeldInput && frameActivityVisible) {
      lastActivityPostAt = globalThis.performance?.now?.() ?? Date.now();
      postFrameMessage({
        type: "user-activity",
        held: false
      });
    }
  }
  function onPageHidePause() {
    pageHiddenPaused = true;
    syncActivityVisibility();
  }
  function onPageShowResume(message) {
    pageHiddenPaused = false;
    if (message?.persisted && !disposed) {
      reloadFrame();
    } else {
      syncActivityVisibility();
    }
  }
  function onVisibilityOrTransition() {
    syncActivityVisibility();
  }
  let streamedStateMap = {};
  let lastPushedStates = null;
  let frameSupportsStatePatches = false;
  const intersectionObserver = typeof window.WebSocket == "function" ? createLightStream({
    onStates(nextStates) {
      streamedStateMap = nextStates;
      if (!previewSuspended) {
        vacuumPopup?.updateStates?.(nextStates);
        onStates?.(nextStates);
        if (streamPaused) {
          pushStatesToFrame();
        }
      }
    },
    onPatch(statePatch) {
      streamedStateMap = {
        ...streamedStateMap,
        ...statePatch
      };
      if (!previewSuspended) {
        vacuumPopup?.updateStates?.(streamedStateMap);
        onStates?.(streamedStateMap);
        if (streamPaused) {
          pushStatesToFrame(statePatch);
        }
      }
    }
  }) : null;
  function syncStreamActive() {
    if (!intersectionObserver || disposed) {
      return;
    }
    if (host.isConnected === true) {
      reloadGeneration = true;
    }
    let streamShouldBeActive = authorized && !pendingViewRequests && !!properties.sceneId && !pageHiddenPaused && document.hidden !== true && document.visibilityState !== "hidden" && (!reloadGeneration || host.isConnected !== false);
    for (let parentElement = host; streamShouldBeActive && parentElement; parentElement = parentElement.parentElement) {
      const display = window.getComputedStyle?.(parentElement);
      if (parentElement.hidden || parentElement.inert || parentElement.getAttribute?.("aria-hidden") === "true" || display?.display === "none" || ["hidden", "collapse"].includes(display?.visibility)) {
        streamShouldBeActive = false;
      }
    }
    intersectionObserver.setActive(streamShouldBeActive);
  }
  const collectObservedEntities = () => [...(properties.security?.cameras || []), ...(properties.security?.presenceSensors || []), ...(properties.devices?.vacuums || []), ...(properties.devices?.vacuums || []).flatMap(relatedEntityIds => [...(relatedEntityIds.relatedEntityIds || []).map(entityId => ({
    entityId: entityId
  })), relatedEntityIds.map, ...(relatedEntityIds.shortcuts || [])].filter(Boolean)), ...(properties.lights || []), ...(properties.environment?.airConditioners || []), ...(properties.environment?.curtains || []), ...(properties.devices?.nas || []), ...(properties.devices?.televisions || []), ...(properties.devices?.televisions || []).filter(powerEntityId => powerEntityId.powerEntityId).map(powerEntityId => ({
    entityId: powerEntityId.powerEntityId
  })), ...(properties.devices?.nas || []).flatMap(statusSource => {
    const visibleMetrics = statusSource.statusSource;
    return (visibleMetrics?.metrics || []).filter(entityId => !visibleMetrics.visibleMetrics || visibleMetrics.visibleMetrics.includes(entityId.entityId) || entityId.entityId === visibleMetrics.primaryEntityId);
  })];
  function isFocusTargetId(focusId) {
    if (typeof focusId != "string" || !focusId) {
      return false;
    } else if ((properties.lights || []).some(controller => controller.id === focusId) || (properties.security?.cameras || []).some(camera => focusId === "camera:" + camera.id) || (properties.security?.presenceSensors || []).some(command => focusId === "presence:" + command.id)) {
      return true;
    } else {
      return [["climate", properties.environment?.airConditioners], ["cover", properties.environment?.curtains], ["nas", properties.devices?.nas], ["television", properties.devices?.televisions], ["vacuum", properties.devices?.vacuums]].some(([deviceKind, deviceList]) => (deviceList || []).some(id => typeof id.id == "string" && id.id && focusId === deviceKind + ":" + id.id));
    }
  }
  const readStates = () => intersectionObserver ? streamedStateMap : Object.fromEntries(collectObservedEntities().map(entityId => [entityId.entityId, context.states?.get(entityId.entityId) || null]));
  const pushStatesToFrame = (patchStates = null) => {
    if (previewSuspended || pageHiddenPaused) {
      return;
    }
    const statesSnapshot = readStates();
    if (intersectionObserver && statesSnapshot === lastPushedStates) {
      return;
    }
    const isStatePatch = !!intersectionObserver && frameSupportsStatePatches && patchStates !== null;
    postFrameMessage({
      type: "states",
      states: isStatePatch ? patchStates : statesSnapshot,
      ...(isStatePatch ? {
        patch: true
      } : {})
    });
    lastPushedStates = statesSnapshot;
    if (!intersectionObserver) {
      onStates?.(statesSnapshot);
    }
  };
  const registeredStateEntityIds = new Set();
  function syncBackgroundVisibilityClass() {
    if (intersectionObserver) {
      intersectionObserver.configure(collectObservedEntities().map(entityId => entityId.entityId), {
        additionalEntityIds: (properties.devices?.vacuums || []).flatMap(relatedEntityIds => [...(relatedEntityIds.relatedEntityIds || []), ...(relatedEntityIds.shortcuts || []).map(entityId => entityId.entityId)])
      });
      syncStreamActive();
      return;
    }
    for (const entityId of collectObservedEntities()) {
      if (entityId.entityId && !registeredStateEntityIds.has(entityId.entityId)) {
        registeredStateEntityIds.add(entityId.entityId);
        context.registerRuntimeStateHandler?.(entityId.entityId, pushStatesToFrame);
      }
    }
  }
  function pushConfigToFrame() {
    if (!streamPaused || disposed || previewSuspended) {
      return;
    }
    const configPayload = {
      properties,
      editing,
      editingModule: editingModule,
      editingVacuumId: editingVacuumId,
      rangeEditorOnly: rangeEditorOnly,
      viewEditing,
      allowRangeEditing: authorized && (editing || !!context.editable),
      interactive: !editing && !context.editable,
      selectedId
    };
    const configJson = JSON.stringify(configPayload);
    if (configJson === lastConfigJson) {
      updatePresentationLayout();
      syncActivityVisibility();
      pushStatesToFrame();
      return;
    }
    lastConfigJson = configJson;
    activityGateOpen = false;
    awaitingPresented = true;
    syncActivityVisibility(true);
    updatePresentationLayout(true);
    postFrameMessage({
      type: "config",
      configId: ++configSerial,
      ...configPayload,
      states: readStates()
    });
    lastPushedStates = readStates();
    if (!framePresented) {
      syncActivityVisibility(true);
    }
  }
  function applyBackgroundHiddenClass() {
    host.classList.toggle("is-background-hidden", properties.backgroundVisible === false);
  }
  function setFocusUiActive(event) {
    if (focusUiActive !== event) {
      focusUiActive = event;
      onFocusChange(event);
    }
  }
  function rejectViewRequests(event) {
    for (const timeout of viewRequestWaiters.values()) {
      clearTimeout(timeout.timeout);
      timeout.reject(new Error(event));
    }
    viewRequestWaiters.clear();
  }
  function rejectRangeRequests(message) {
    for (const timeout of rangeRequestWaiters.values()) {
      clearTimeout(timeout.timeout);
      timeout.reject(new Error(message));
    }
    rangeRequestWaiters.clear();
  }
  function dismissFocusUi(immediate = false) {
    closeCameraPopup();
    focusedId = "";
    closeVacuumPopup();
    focusPanelOpen = false;
    setFocusUiActive(false);
    postFrameMessage({
      type: "dismiss-focus",
      immediate
    });
  }
  let vacuumPopup = null;
  let vacuumFollowActive = false;
  let cameraPopup = null;
  let cameraPopupId = "";
  let focusedId = "";
  const closeCameraPopup = () => {
    const close = cameraPopup;
    cameraPopup = null;
    cameraPopupId = "";
    close?.close?.();
  };
  const closeVacuumPopup = () => {
    const close = vacuumPopup;
    vacuumPopup = null;
    close?.close?.();
  };
  function onOutsidePointerDownDismiss(target) {
    if (!vacuumPopup?.contains?.(target.target)) {
      if ((focusUiActive || focusPanelOpen) && !host.contains(target.target)) {
        dismissFocusUi();
      }
    }
  }
  function onEscapeKeydown(message) {
    if ((focusUiActive || focusPanelOpen) && message.key === "Escape") {
      dismissFocusUi();
    }
  }
  function failFrameLoad(errorMessage) {
    pendingViewRequests = true;
    framePresented = false;
    activityGateOpen = false;
    awaitingPresented = false;
    syncActivityVisibility(true);
    rejectRangeRequests(errorMessage || "户型画面已关闭，请重新调整照射范围。");
    postFrameMessage({
      type: "range-editor",
      open: false
    });
    setRangeEditingActive(false);
    pendingControlAborts.forEach(abort => abort.abort());
    rejectViewRequests("户型加载失败，请重新载入后调整视角。");
    dismissFocusUi(true);
    clearTimeout(loadTimeoutId);
    host.classList.remove("is-loading");
    host.classList.add("is-load-error");
    loadingEl.hidden = false;
    loadingEl.textContent = errorMessage || "3D 户型加载失败，请重新载入户型。";
    onLoadError(new Error(loadingEl.textContent));
  }
  function reloadFrame() {
    vacuumFollowActive = false;
    closeVacuumPopup();
    lastConfigJson = "";
    if (frame++) {
      frameEl.removeAttribute("src");
      frameEl = createFrameElement();
      host.replaceChildren(frameEl, loadingEl);
    }
    setRangeEditingActive(false);
    pendingControlAborts.forEach(abort => abort.abort());
    rejectViewRequests("户型已切换，请在新户型中重新调整视角。");
    rejectRangeRequests("户型已切换，请在新户型中重新调整照射范围。");
    focusPanelOpen = false;
    setFocusUiActive(false);
    pendingViewRequests = false;
    framePresented = false;
    streamPaused = false;
    activityGateOpen = false;
    awaitingPresented = false;
    syncActivityVisibility(true);
    clearTimeout(loadTimeoutId);
    host.classList.remove("is-ready", "is-load-error");
    host.classList.toggle("is-loading", !!properties.sceneId);
    host.setAttribute("aria-busy", String(!!properties.sceneId));
    applyBackgroundHiddenClass();
    syncBackgroundVisibilityClass();
    if (!properties.sceneId) {
      frameEl.hidden = true;
      loadingEl.hidden = false;
      loadingEl.textContent = "请在属性面板中配置 3D 户型";
      return;
    }
    frameEl.hidden = false;
    loadingEl.hidden = false;
    loadingEl.textContent = "";
    loadingEl.setAttribute("aria-label", "正在准备 3D 户型");
    const wallTrial = (new URLSearchParams(window.location.search).get("wall-trial") || "").split(",").filter(entry => ["shader", "single", "depth", "merge"].includes(entry)).join(",");
    frameEl.src = INTERACTION3D_API + "/stage.html?" + new URLSearchParams({
      sceneId: properties.sceneId,
      projectId: documentProjectId,
      lighting: normalizeLightingMode(properties.lightingMode),
      ...(wallTrial ? {
        "wall-trial": wallTrial
      } : {}),
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
    if (!previewSuspended) {
      scheduleLoadTimeout();
    }
  }
  function scheduleLoadTimeout() {
    loadTimeoutId = setTimeout(() => failFrameLoad("3D 户型加载较慢，请稍候；若一直没有画面，请重新载入户型。"), 45000);
  }
  const pendingControlAborts = new Set();
  async function handleFrameMessage(data) {
    if (disposed || data.origin !== location.origin || data.source !== frameEl.contentWindow || data.data?.channel !== "hb-i3d-v1") {
      return;
    }
    const type = data.data;
    if (type.type === "vacuum-follow-state") {
      vacuumFollowActive = type.active === true;
      if (vacuumFollowActive) {
        closeVacuumPopup();
      }
    }
    if (type.type === "vacuum-popup-close") {
      closeVacuumPopup();
    }
    if (type.type === "camera-popup-close") {
      closeCameraPopup();
    }
    if (type.type === "camera-popup" && authorized && framePresented && !editing && !context.editable && focusedId === type.id) {
      const cameraBinding = (properties.security?.cameras || []).find(id => "camera:" + id.id === type.id && id.visible !== false && id.entityId);
      if (cameraBinding && context.openCameraPreview && cameraPopupId !== type.id) {
        closeCameraPopup();
        closeVacuumPopup();
        cameraPopupId = type.id;
        cameraPopup = context.openCameraPreview(cameraBinding, () => {
          cameraPopup = null;
          cameraPopupId = "";
          dismissFocusUi();
        }, {
          root: host,
          frame: frameEl,
          popupOpacity: properties.popupOpacity,
          getPresentationLayout: () => presentationLayout
        });
      }
    }
    if (type.type === "vacuum-popup" && !vacuumFollowActive && authorized && framePresented && !editing && !context.editable) {
      const vacuumBinding = (properties.devices?.vacuums || []).find(id => "vacuum:" + id.id === type.id && id.visible !== false && id.entityId);
      if (vacuumBinding && context.openVacuumDetails) {
        closeVacuumPopup();
        vacuumPopup = context.openVacuumDetails(vacuumBinding, () => {
          vacuumPopup = null;
          dismissFocusUi();
        }, {
          states: readStates(),
          root: host,
          frame: frameEl,
          popupOpacity: properties.popupOpacity,
          getPresentationLayout: () => presentationLayout
        });
      }
    }
    if (type.type === "vacuum-room" && authorized && framePresented && !editing && !context.editable) {
      const shortcuts = (properties.devices?.vacuums || []).find(id => id.id === type.vacuumId && id.visible !== false && id.entityId);
      const id = shortcuts?.shortcuts?.find(id => id.id === type.shortcutId && id.visible !== false && id.entityId);
      if (!id || type.id !== "vacuum-room:" + shortcuts.id + ":" + id.id) {
        return;
      }
      try {
        if (!context.runVacuumRoom) {
          throw new Error("清扫操作入口尚未准备好，请刷新页面。");
        }
        await context.runVacuumRoom(id);
        postFrameMessage({
          type: "vacuum-room-result",
          id: type.id
        });
      } catch (message) {
        postFrameMessage({
          type: "vacuum-room-result",
          id: type.id,
          error: message.message
        });
      }
    }
    if (type.type === "focus-state" && !editing && !context.editable) {
      const focusAllowed = authorized && framePresented && isFocusTargetId(type.id);
      focusedId = focusAllowed && type.active === true ? type.id : "";
      if (cameraPopupId && cameraPopupId !== focusedId) {
        closeCameraPopup();
      }
      focusPanelOpen = focusAllowed && type.panelOpen === true;
      setFocusUiActive(focusAllowed && type.active === true);
    }
    if (type.type === "model-metadata") {
      modelMetadata = type.metadata;
      onReady(modelMetadata);
    }
    if (type.type === "ready") {
      frameSupportsStatePatches = type.statePatches === true;
      lastPushedStates = null;
      lastConfigJson = "";
      pendingViewRequests = false;
      streamPaused = true;
      modelMetadata = type.metadata;
      stageCamera = type.metadata?.camera;
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
      pushConfigToFrame();
      if (previewSuspended) {
        syncActivityVisibility(true);
      }
      onReady(type.metadata);
    }
    if (type.type === "presented" && type.configId === configSerial && awaitingPresented) {
      awaitingPresented = false;
      if (!framePresented) {
        framePresented = true;
        stageCamera = type.camera || stageCamera;
        viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
        clearTimeout(loadTimeoutId);
        host.classList.remove("is-loading", "is-load-error");
        host.classList.add("is-ready");
        host.setAttribute("aria-busy", "false");
        onPresented();
      }
      activityGateOpen = true;
      syncActivityVisibility();
    }
    if (type.type === "error") {
      failFrameLoad(type.message);
    }
    const canEditRange = authorized && framePresented && (editing || context.editable) && normalizeLightingMode(properties.lightingMode) === "region";
    if (type.type === "range-editor-state" && canEditRange) {
      const timeout = rangeRequestWaiters.get(type.requestId);
      if (type.requestId && !timeout) {
        return;
      }
      if (timeout) {
        clearTimeout(timeout.timeout);
        rangeRequestWaiters.delete(type.requestId);
        if (type.active === timeout.open && !type.error) {
          timeout.resolve();
        } else {
          timeout.reject(new Error(type.error || "照射范围编辑未能打开。"));
        }
      }
      setRangeEditingActive(type.active === true && !type.error, type.error || "");
    }
    if (type.type === "range-overrides" && canEditRange && type.overrides && typeof type.overrides == "object" && !Array.isArray(type.overrides)) {
      properties.lightRegionOverrides = structuredClone(type.overrides);
      notifyEditListeners({
        action: "light-region-overrides",
        overrides: structuredClone(properties.lightRegionOverrides)
      });
    }
    if (type.type === "edit" && type.action === "camera" && context.editable && viewEditing) {
      const timeout = viewRequestWaiters.get(type.requestId);
      if (timeout) {
        viewCamera = type.camera;
        clearTimeout(timeout.timeout);
        viewRequestWaiters.delete(type.requestId);
        timeout.resolve(type.camera);
      }
    }
    if (type.type === "edit" && editing && authorized && framePresented) {
      if (type.action === "focus-camera") {
        const timeout = viewRequestWaiters.get(type.requestId);
        if (!timeout) {
          return;
        }
        if (timeout) {
          clearTimeout(timeout.timeout);
          viewRequestWaiters.delete(type.requestId);
          if (type.error) {
            timeout.reject(new Error(type.error));
          } else {
            timeout.resolve(type);
          }
        }
      }
      notifyEditListeners(type);
    }
    if (type.type === "control" && authorized && framePresented && !editing && !context.editable) {
      const controlEntityId = type.command?.entityId;
      if (typeof controlEntityId != "string" || !controlEntityId.trim()) {
        return;
      }
      if (![...(properties.lights || []), ...(properties.environment?.airConditioners || []), ...(properties.environment?.curtains || []), ...(properties.devices?.televisions || []), ...(properties.devices?.televisions || []).map(powerEntityId => ({
        entityId: powerEntityId.powerEntityId || powerEntityId.entityId
      }))].some(entityId => entityId.entityId === controlEntityId)) {
        postFrameMessage({
          type: "control-result",
          requestId: type.requestId,
          error: "此实体未绑定到当前 3D 控件，请检查设备配置。"
        });
        return;
      }
      const frameGeneration = frame;
      const postIfSameGeneration = resultMessage => {
        if (frameGeneration === frame && framePresented && authorized) {
          postFrameMessage(resultMessage);
        }
      };
      const abort = new AbortController();
      pendingControlAborts.add(abort);
      const controlTimeoutId = setTimeout(() => abort.abort(), 12000);
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
              projectId: documentProjectId,
              componentId: component.id
            } : {})
          }),
          signal: abort.signal
        });
        const detail = await json.json().catch(() => ({}));
        if (!json.ok) {
          throw new Error(typeof detail.detail == "string" ? detail.detail : detail.detail?.message || "设备操作失败。");
        }
        postIfSameGeneration({
          type: "control-result",
          requestId: type.requestId
        });
      } catch (name) {
        postIfSameGeneration({
          type: "control-result",
          requestId: type.requestId,
          error: name.name === "AbortError" ? "请求超时，请检查设备状态。" : name.message,
          timedOut: name.name === "AbortError"
        });
      } finally {
        clearTimeout(controlTimeoutId);
        pendingControlAborts.delete(abort);
      }
    }
  }
  window.addEventListener("message", handleFrameMessage);
  window.addEventListener("pointerdown", onOutsidePointerDownDismiss);
  window.addEventListener("keydown", onEscapeKeydown);
  const activityDoc = document.addEventListener ? document : window;
  activityDoc.addEventListener("hb-i3d-preview-scope", syncPreviewScopeSuspension);
  const activityEventTypes = ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"];
  const activityListenerOpts = {
    capture: true,
    passive: true
  };
  for (const eventType of activityEventTypes) {
    activityDoc.addEventListener(eventType, onActivityPointerOrKey, activityListenerOpts);
  }
  activityDoc.addEventListener("visibilitychange", onVisibilityOrTransition);
  activityDoc.addEventListener("transitionend", onVisibilityOrTransition, true);
  activityDoc.addEventListener("animationend", onVisibilityOrTransition, true);
  window.addEventListener("pagehide", onPageHidePause);
  window.addEventListener("pageshow", onPageShowResume);
  window.addEventListener("blur", onWindowBlurClearHeld);
  const hostIntersectionObserver = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
    for (const target of entries) {
      if (target.target === host) {
        hostIsIntersecting = target.isIntersecting && target.intersectionRatio > 0;
      }
    }
    syncActivityVisibility();
  }, {
    threshold: [0, 0.001]
  });
  hostIntersectionObserver?.observe(host);
  let ancestorChain = [];
  function syncAncestorMutationTargets() {
    if (disposed) {
      return;
    }
    const push = [];
    for (let parentElement = host; parentElement; parentElement = parentElement.parentElement) {
      push.push(parentElement);
    }
    if (push.length !== ancestorChain.length || !push.every((node, index) => node === ancestorChain[index])) {
      ancestorChain = push;
      ancestorMutationObserver?.disconnect();
      for (const ancestor of push) {
        ancestorMutationObserver?.observe(ancestor, {
          attributes: true,
          childList: true,
          attributeFilter: ["hidden", "inert", "aria-hidden", "style", "class"]
        });
      }
    }
  }
  const ancestorMutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
    syncAncestorMutationTargets();
    updatePresentationLayout();
  });
  syncAncestorMutationTargets();
  let lastLayoutJson = "";
  let presentationLayout = null;
  function updatePresentationLayout(forcePost = false) {
    syncActivityVisibility();
    const width = host.getBoundingClientRect();
    if (!width.width || !host.clientWidth) {
      return;
    }
    const scaleX = host.clientWidth / width.width;
    const scaleY = host.clientHeight > 0 && width.height > 0 ? host.clientHeight / width.height : scaleX;
    frameEl.style.width = width.width + "px";
    frameEl.style.height = width.height + "px";
    frameEl.style.transform = scaleX === scaleY ? "scale(" + scaleX + ")" : "scale(" + scaleX + "," + scaleY + ")";
    const clientWidth = host.closest?.(".hb-renderer-canvas");
    const rect = clientWidth?.getBoundingClientRect();
    const position = properties.layoutMode === "fill" ? context.document?.canvas : component.position;
    const styleScale = properties.layoutMode === "fill" ? 1 : Math.max(0.01, Math.min(5, Number(component.style?.scale) || 1));
    const layoutWidth = rect?.width > 0 && clientWidth.clientWidth > 0 ? width.width * clientWidth.clientWidth / rect.width : Number(position?.width) * styleScale;
    const layoutHeight = rect?.height > 0 && clientWidth.clientHeight > 0 ? width.height * clientWidth.clientHeight / rect.height : Number(position?.height) * styleScale;
    const layoutPayload = {
      type: "presentation-layout",
      width: layoutWidth > 0 ? layoutWidth : width.width,
      height: layoutHeight > 0 ? layoutHeight : width.height
    };
    presentationLayout = layoutPayload;
    vacuumPopup?.updateLayout?.();
    cameraPopup?.updateLayout?.();
    const layoutJson = JSON.stringify(layoutPayload);
    if (forcePost === true || layoutJson !== lastLayoutJson) {
      lastLayoutJson = layoutJson;
      postFrameMessage(layoutPayload);
    }
  }
  const hostResizeObserver = new ResizeObserver(updatePresentationLayout);
  hostResizeObserver.observe(host);
  window.addEventListener("resize", updatePresentationLayout);
  syncPreviewScopeSuspension();
  reloadFrame();
  const layoutRafId = requestAnimationFrame(updatePresentationLayout);
  const runtimeApi = () => {
    if (!disposed) {
      activityGateOpen = false;
      syncActivityVisibility(true);
      setFocusUiActive(false);
      closeVacuumPopup();
      closeCameraPopup();
      intersectionObserver?.dispose();
      editSubscribers.clear();
      rangeEditingActive = false;
      host.classList.remove("is-range-editing");
      disposed = true;
      clearTimeout(loadTimeoutId);
      cancelAnimationFrame(layoutRafId);
      hostResizeObserver.disconnect();
      hostIntersectionObserver?.disconnect();
      ancestorMutationObserver?.disconnect();
      rejectViewRequests("户型画面已关闭，请重新调整。");
      rejectRangeRequests("户型画面已关闭，请重新调整照射范围。");
      window.removeEventListener("resize", updatePresentationLayout);
      window.removeEventListener("message", handleFrameMessage);
      window.removeEventListener("pointerdown", onOutsidePointerDownDismiss);
      window.removeEventListener("keydown", onEscapeKeydown);
      for (const value of activityEventTypes) {
        activityDoc.removeEventListener(value, onActivityPointerOrKey, activityListenerOpts);
      }
      activityDoc.removeEventListener("visibilitychange", onVisibilityOrTransition);
      activityDoc.removeEventListener("hb-i3d-preview-scope", syncPreviewScopeSuspension);
      activityDoc.removeEventListener("transitionend", onVisibilityOrTransition, true);
      activityDoc.removeEventListener("animationend", onVisibilityOrTransition, true);
      window.removeEventListener("pagehide", onPageHidePause);
      window.removeEventListener("pageshow", onPageShowResume);
      window.removeEventListener("blur", onWindowBlurClearHeld);
      pendingControlAborts.forEach(abort => abort.abort());
      frameEl.removeAttribute("src");
      host.replaceChildren();
    }
  };
  runtimeApi.update = (nextProperties, nextSelectedId = selectedId) => {
    const prevSceneId = properties.sceneId;
    const prevCameraJson = JSON.stringify(properties.camera);
    const prevLightingMode = normalizeLightingMode(properties.lightingMode);
    const prevFloorSelection = properties.floorSelection;
    const prevCameraPopupJson = JSON.stringify((properties.security?.cameras || []).find(camera => "camera:" + camera.id === cameraPopupId));
    properties = structuredClone(nextProperties);
    selectedId = nextSelectedId;
    syncBackgroundVisibilityClass();
    applyBackgroundHiddenClass();
    if (cameraPopup && (prevFloorSelection !== properties.floorSelection || prevCameraPopupJson !== JSON.stringify((properties.security?.cameras || []).find(camera => "camera:" + camera.id === cameraPopupId)))) {
      dismissFocusUi(true);
    }
    if (viewEditing && (prevSceneId !== properties.sceneId || prevLightingMode !== normalizeLightingMode(properties.lightingMode) || prevCameraJson !== JSON.stringify(properties.camera))) {
      viewEditing = false;
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
      host.classList.remove("is-view-editing");
      frameEl.style.pointerEvents = "none";
    }
    if (prevSceneId !== properties.sceneId || prevLightingMode !== normalizeLightingMode(properties.lightingMode)) {
      reloadFrame();
    } else {
      pushConfigToFrame();
    }
  };
  runtimeApi.setPageVisible = nextPageVisible => {
    if (disposed || pageHiddenPaused === !nextPageVisible) {
      return;
    }
    pageHiddenPaused = !nextPageVisible;
    if (pageHiddenPaused) {
      dismissFocusUi(true);
    }
    syncActivityVisibility(true);
    if (!pageHiddenPaused) {
      updatePresentationLayout();
      if (!intersectionObserver) {
        pushStatesToFrame();
      }
    }
  };
  runtimeApi.setEditingModule = (nextEditingModule, nextEditingVacuumId = "") => {
    if (disposed) {
      return;
    }
    let module = editingModule;
    let vacuumId = editingVacuumId;
    if (editing && nextEditingModule && ["light", "climate", "cover", "nas", "television", "vacuum", "vacuum-shortcut"].includes(nextEditingModule)) {
      module = nextEditingModule;
      vacuumId = module === "vacuum-shortcut" ? String(nextEditingVacuumId || "") : "";
    }
    const changed = editingModule !== module || editingVacuumId !== vacuumId;
    editingModule = module;
    editingVacuumId = vacuumId;
    if (changed) {
      pushConfigToFrame();
    }
  };
  runtimeApi.command = nextProperties => postFrameMessage({
    type: "editor-command",
    command: nextProperties
  });
  runtimeApi.subscribeEdit = command => disposed || typeof command != "function" ? () => {} : (editSubscribers.add(command), () => editSubscribers.delete(command));
  runtimeApi.openRangeEditor = () => {
    if (disposed || !authorized || !editing && !context.editable) {
      return Promise.reject(new Error("请在已授权的控件编辑器中调整照射范围。"));
    }
    if (!framePresented) {
      return Promise.reject(new Error("户型还在加载，请稍候再调整照射范围。"));
    }
    if (normalizeLightingMode(properties.lightingMode) !== "region") {
      return Promise.reject(new Error("请先选择轻量柔光模式。"));
    }
    if (rangeEditingActive) {
      return Promise.resolve();
    }
    const promise = rangeRequestWaiters.values().next().value;
    if (promise) {
      return promise.promise;
    }
    if (viewEditing) {
      runtimeApi.setViewEditing(false);
    }
    const requestId = "range-" + ++viewRequestSerial;
    let resolve;
    let reject;
    const promiseCurrent = new Promise((resolveOpen, rejectOpen) => {
      resolve = resolveOpen;
      reject = rejectOpen;
    });
    const timeout = setTimeout(() => {
      rangeRequestWaiters.delete(requestId);
      postFrameMessage({
        type: "range-editor",
        open: false
      });
      setRangeEditingActive(false);
      reject(new Error("打开照射范围编辑超时，请重试。"));
    }, 5000);
    rangeRequestWaiters.set(requestId, {
      resolve: resolve,
      reject: reject,
      timeout: timeout,
      promise: promiseCurrent,
      open: true
    });
    postFrameMessage({
      type: "range-editor",
      open: true,
      requestId: requestId
    });
    return promiseCurrent;
  };
  runtimeApi.flushRangeEditor = () => {
    if (disposed || !authorized || !framePresented || !rangeEditingActive) {
      return Promise.reject(new Error("请先打开照射范围编辑。"));
    }
    const requestId = "range-" + ++viewRequestSerial;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        rangeRequestWaiters.delete(requestId);
        reject(new Error("读取照射范围超时，请重试。"));
      }, 5000);
      rangeRequestWaiters.set(requestId, {
        resolve,
        reject,
        timeout,
        open: true
      });
      postFrameMessage({
        type: "range-editor",
        flush: true,
        requestId: requestId
      });
    });
  };
  runtimeApi.closeRangeEditor = ({
    flush: shouldFlush = false
  } = {}) => {
    rejectRangeRequests("照射范围编辑已取消。");
    if (!shouldFlush) {
      postFrameMessage({
        type: "range-editor",
        open: false
      });
      setRangeEditingActive(false);
      return;
    }
    if (disposed || !authorized || !framePresented) {
      return Promise.reject(new Error("户型画面暂不可用，请重新打开照射范围。"));
    }
    const requestId = "range-" + ++viewRequestSerial;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        rangeRequestWaiters.delete(requestId);
        reject(new Error("读取照射范围超时，请重试。"));
      }, 5000);
      rangeRequestWaiters.set(requestId, {
        resolve: resolve,
        reject: reject,
        timeout: timeout,
        open: false
      });
      postFrameMessage({
        type: "range-editor",
        open: false,
        requestId: requestId
      });
    });
  };
  runtimeApi.setAuthorized = nextAuthorized => {
    const authorizedChanged = authorized !== (nextAuthorized === true);
    authorized = nextAuthorized === true;
    host.inert = !authorized;
    syncActivityVisibility();
    if (!authorized) {
      runtimeApi.closeRangeEditor();
      rejectViewRequests("授权验证暂不可用，请恢复后重新调整。");
      dismissFocusUi(true);
      pendingControlAborts.forEach(abort => abort.abort());
    }
    if (authorizedChanged && (editing || context.editable)) {
      pushConfigToFrame();
    }
  };
  Object.defineProperty(runtimeApi, "metadata", {
    get: () => modelMetadata
  });
  Object.defineProperty(runtimeApi, "ready", {
    get: () => framePresented && !disposed && authorized
  });
  Object.defineProperty(runtimeApi, "viewEditing", {
    get: () => viewEditing
  });
  Object.defineProperty(runtimeApi, "viewCamera", {
    get: () => viewCamera
  });
  Object.defineProperty(runtimeApi, "rangeEditing", {
    get: () => rangeEditingActive && !disposed && authorized
  });
  runtimeApi.setViewEditing = enabled => {
    if (!context.editable || disposed) {
      throw new Error("请在编辑器中调整户型视角。");
    }
    if (enabled && !framePresented) {
      throw new Error("户型还在加载，请稍候再调整视角。");
    }
    if (enabled && (rangeEditingActive || rangeRequestWaiters.size)) {
      runtimeApi.closeRangeEditor();
    }
    viewEditing = enabled === true;
    if (!viewEditing) {
      viewCamera = properties.floorCameras?.[properties.floorSelection] || properties.camera || stageCamera;
    }
    host.classList.toggle("is-view-editing", viewEditing);
    frameEl.style.pointerEvents = viewEditing || rangeEditingActive ? "auto" : "none";
    pushConfigToFrame();
  };
  runtimeApi.viewCommand = (command, commandValue) => new Promise((resolve, reject) => {
    if (!context.editable || !viewEditing || !framePresented || disposed) {
      reject(new Error("请先进入户型视角调整。"));
      return;
    }
    const requestId = "view-" + ++viewRequestSerial;
    const timeout = setTimeout(() => {
      viewRequestWaiters.delete(requestId);
      reject(new Error("读取视角超时，请重试。"));
    }, 5000);
    viewRequestWaiters.set(requestId, {
      resolve: resolve,
      reject: reject,
      timeout: timeout
    });
    postFrameMessage({
      type: "editor-command",
      command,
      value: commandValue,
      requestId
    });
  });
  runtimeApi.captureView = () => runtimeApi.viewCommand("save-camera");
  runtimeApi.focusCommand = (command, id = selectedId, focusValue) => new Promise((resolve, reject) => {
    if (!editing || !framePresented || disposed || !authorized) {
      reject(new Error("户型还在加载，请稍候再设置聚焦视角。"));
      return;
    }
    const requestId = "focus-" + ++viewRequestSerial;
    const timeout = setTimeout(() => {
      viewRequestWaiters.delete(requestId);
      reject(new Error("读取聚焦视角超时，请重试。"));
    }, 5000);
    viewRequestWaiters.set(requestId, {
      resolve: resolve,
      reject: reject,
      timeout: timeout
    });
    postFrameMessage({
      type: "editor-command",
      command: command,
      id: id,
      value: focusValue,
      requestId: requestId
    });
  });
  return runtimeApi;
}
