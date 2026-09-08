import { startSceneSync } from "./scene-sync.js?v=20260907-scene-sync-v1";
import {
  lightCommand,
  createLightPreview,
  createLightStateCache,
  lightRenderState,
} from "./light-state.js?v=20260907-demand-v1";
import {
  createFocusCameraSampler,
  automaticLightCamera,
} from "./camera-motion.js?v=20260907-focus-work-v1";
import {
  createIdleRotation,
  createIdleIconVisibility,
} from "./idle-rotation.js?v=20260907-demand-v1";
const defaultMarkerSvg =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M8 15c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7l-1 3H9l-1-3Z"/><path d="M9 21h6M9 15h6"/></svg>';
const lightPresets = [
  {
    label: "柔和",
    brightness: 25,
    temperaturePercent: 10,
  },
  {
    label: "日常",
    brightness: 60,
    temperaturePercent: 50,
  },
  {
    label: "明亮",
    brightness: 100,
    temperaturePercent: 100,
  },
];
export function mountStage(options) {
  const { THREE, container, canvas } = options;
  let properties = {
    lights: [],
  };
  let states = {};
  let editing = false;
  let viewEditing = false;
  let interactive = false;
  let selectedId = "";
  let focusedLightId = "";
  let activeFloorId = "";
  let disposed = false;
  let controlRequestSeq = 0;
  let dragState = null;
  let baseCameraState = null;
  let presented = false;
  let presentGeneration = 0;
  let focusMode = "";
  let preFocusCamera = null;
  let cameraMotion = null;
  let focusViewport = 0;
  let activityVisible = false;
  let idleRotating = false;
  let idleReturning = false;
  let idleCameraBase = null;
  let frameLoop = null;
  let activityTracked = false;
  let presentedVisible = true;
  const wakeFrameLoop = () => frameLoop?.wake();
  let idleIconsHidden = false;
  let userHeld = false;
  const activePointers = new Set();
  const activeKeys = new Set();
  const markersById = new Map();
  const pendingCommands = new Map();
  const markerWorldCache = new Map();
  const projectedPoint = new THREE.Vector3();
  let markerDocRef;
  let markerFloorRef;
  let markersConcealedAt = null;
  const lightPreview = createLightPreview();
  const lightHistoryScope = document.body?.dataset?.i3dLightHistoryScope;
  let lightHistoryStorage;
  if (lightHistoryScope) {
    try {
      lightHistoryStorage = window.localStorage;
    } catch {}
  }
  const lightStateCache = createLightStateCache({
    storage: lightHistoryStorage,
    scope: lightHistoryScope,
  });
  const resolveLightState = (entityId) =>
    lightStateCache.resolve(entityId || "", states[entityId]);
  let effectPreview = null;
  let rawProperties = {
    lights: [],
  };
  let sceneUpdating = false;
  let markersSuppressedByActivity = false;
  let deferredMessage = null;
  let lastUserActivityAt = -Infinity;
  const transformCamera = (
    camera,
    floorSelection = properties.floorSelection,
    preserve = false,
  ) => options.transformCamera?.(camera, floorSelection, preserve) ?? camera;
  const currentCamera = () =>
    transformCamera(options.cameraState(true), properties.floorSelection, true);
  function transformProperties(nextProperties) {
    const clonedProperties = structuredClone(nextProperties);
    clonedProperties.camera = transformCamera(
      clonedProperties.camera,
      clonedProperties.floorSelection,
    );
    clonedProperties.lights = (clonedProperties.lights || []).map((light) => ({
      ...light,
      ...(light.focusCamera
        ? {
            focusCamera: transformCamera(
              light.focusCamera,
              clonedProperties.floorSelection,
            ),
          }
        : {}),
    }));
    return clonedProperties;
  }
  const postToParent = (payload) =>
    window.parent.postMessage(
      {
        channel: "hb-i3d-v1",
        ...payload,
      },
      location.origin,
    );
  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className || "";
    if (text) {
      element.textContent = text;
    }
    return element;
  };
  const markersRoot = createElement("div", "i3d-markers");
  const presentationRoot = createElement("div", "i3d-presentation");
  let presentationLayout = null;
  let presentationScale = 1;
  const focusVignette = createElement("div", "i3d-focus-vignette");
  focusVignette.setAttribute("aria-hidden", "true");
  const toolbar = createElement("nav", "i3d-toolbar");
  const restoreViewButton = createElement("button", "", "恢复视角");
  restoreViewButton.type = "button";
  toolbar.append(restoreViewButton);
  const lightPanel = createElement("section", "i3d-light-panel");
  lightPanel.setAttribute("aria-label", "灯光控制");
  lightPanel.setAttribute("inert", "");
  const lightPanelHeader = createElement("header");
  const lightHeadingText = createElement("div", "i3d-light-heading-text");
  const lightTitle = createElement("strong", "", "灯光");
  const deviceStatus = createElement("p", "i3d-device-status");
  lightHeadingText.append(lightTitle, deviceStatus);
  const powerButton = createElement("button", "i3d-power");
  powerButton.type = "button";
  const lampDrawing = createElement("span", "i3d-lamp-drawing");
  lampDrawing.setAttribute("aria-hidden", "true");
  const lampAura = createElement("span", "i3d-lamp-aura");
  const lampBody = createElement("span", "i3d-lamp-body");
  for (const lampPart of ["cord", "shade", "bulb", "filament"]) {
    lampBody.append(createElement("i", "i3d-lamp-" + lampPart));
  }
  lampDrawing.append(lampAura, lampBody);
  powerButton.append(lampDrawing);
  lightPanelHeader.append(lightHeadingText, powerButton);
  const lightControls = createElement("div", "i3d-light-controls");
  function createSlider(label, kind, min, max) {
    const root = createElement("label", "i3d-slider i3d-" + kind);
    const labelEl = createElement("span", "", label);
    const output = createElement("output");
    const input = createElement("input");
    input.name = "i3d-light-" + kind;
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = kind === "temperature" ? "10" : "1";
    input.setAttribute("aria-label", label);
    const heading = createElement("div", "i3d-slider-heading");
    heading.append(labelEl, output);
    const legend = createElement("span", "i3d-slider-legend");
    legend.append(
      createElement("small", "", kind === "temperature" ? "暖色" : "暗"),
      createElement("small", "", kind === "temperature" ? "冷色" : "亮"),
    );
    root.append(heading, input, legend);
    input.addEventListener("input", () => {
      output.value = "" + input.value + (kind === "temperature" ? " K" : "%");
      const focusedLight = focusedLightBinding();
      if (
        !!focusedLight &&
        !editing &&
        !!resolveLightState(focusedLight.entityId).available
      ) {
        lightPreview.set(focusedLight.entityId, kind, Number(input.value));
        wakeFrameLoop();
        syncLightPanel();
        applyLightStates({
          preview: true,
        });
      }
    });
    input.addEventListener(
      "change",
      () => void sendLightCommand(kind, Number(input.value)),
    );
    lightControls.append(root);
    return {
      root: root,
      input: input,
      value: output,
    };
  }
  const temperatureSlider = createSlider("色温", "temperature", "2000", "6500");
  const brightnessSlider = createSlider("亮度", "brightness", "1", "100");
  const presetsRoot = createElement("div", "i3d-light-presets");
  presetsRoot.setAttribute("role", "group");
  presetsRoot.setAttribute("aria-label", "灯光预设");
  const presets = lightPresets.map((preset) => {
    const button = createElement("button", "i3d-light-preset");
    button.type = "button";
    const detail = createElement("small", "", preset.brightness + "%");
    button.append(createElement("strong", "", preset.label), detail);
    button.addEventListener(
      "click",
      () => void sendLightCommand("preset", preset),
    );
    presetsRoot.append(button);
    return {
      ...preset,
      button: button,
      detail: detail,
    };
  });
  lightControls.append(presetsRoot);
  const controlError = createElement("p", "i3d-control-error");
  controlError.setAttribute("role", "status");
  lightPanel.append(lightPanelHeader, lightControls, controlError);
  const viewHelp = createElement(
    "p",
    "i3d-view-help",
    "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。",
  );
  viewHelp.hidden = true;
  presentationRoot.append(markersRoot, toolbar, lightPanel, viewHelp);
  container.append(focusVignette, presentationRoot);
  const findLight = (lightId) =>
    (properties.lights || []).find((light) => light.id === lightId);
  const focusedLightBinding = () => findLight(focusedLightId);
  const previewState = (entityId) =>
    lightPreview.state(entityId, resolveLightState(entityId));
  function displayLightState(light) {
    const state = previewState(light.entityId);
    if (editing && effectPreview?.id === light.id) {
      state.on = true;
      state.available = true;
      if (effectPreview.kind !== "defaults") {
        state.brightness = effectPreview.kind === "brightnessMin" ? 1 : 100;
      }
      if (effectPreview.kind.startsWith("brightness")) {
        state.brightnessSupported = true;
      }
      if (effectPreview.kind.startsWith("temperature")) {
        state.temperatureSupported = true;
        state.kelvin = effectPreview.kind.endsWith("Min")
          ? state.minimum
          : state.maximum;
      }
    }
    return state;
  }
  function applyLightStates(applyOptions) {
    options.setLightStates(
      (properties.lights || [])
        .filter((light) => light.entityId)
        .map((light) => {
          const state = displayLightState(light);
          return {
            ...light,
            ...(editing && effectPreview?.id === light.id
              ? state
              : lightRenderState(state)),
          };
        }),
      applyOptions,
    );
  }
  function syncCameraInteraction() {
    const interaction = {
      ...properties.camera,
      ...properties.interaction,
    };
    const freeCamera = viewEditing || focusMode === "edit";
    options.setCameraInteraction({
      enabled:
        freeCamera ||
        (interactive &&
          (!focusMode || focusMode === "panel") &&
          !cameraMotion &&
          !idleRotating),
      rotationMode: freeCamera ? "free" : interaction.rotationMode,
      panEnabled: freeCamera,
      zoomEnabled: freeCamera,
    });
  }
  const panelInset = () =>
    Math.min(
      0.7,
      (lightPanel.getBoundingClientRect().width + presentationScale * 24) /
        Math.max(container.clientWidth, 1),
    );
  function syncPresentationLayout() {
    const bounds = container.getBoundingClientRect();
    const layoutWidth = presentationLayout?.width || bounds.width;
    const layoutHeight = presentationLayout?.height || bounds.height;
    if (
      layoutWidth > 0 &&
      layoutHeight > 0 &&
      bounds.width > 0 &&
      bounds.height > 0
    ) {
      presentationScale = bounds.width / layoutWidth;
      Object.assign(presentationRoot.style, {
        width: layoutWidth + "px",
        height: layoutHeight + "px",
        transform:
          "scale(" +
          presentationScale +
          "," +
          bounds.height / layoutHeight +
          ")",
      });
      if (cameraMotion?.focused) {
        cameraMotion.targetInset = panelInset();
      }
      if (focusMode && focusMode !== "panel" && !cameraMotion) {
        focusViewport = panelInset();
        options.setFocusViewport(focusViewport);
      }
      updateMarkerPositions(true);
    }
  }
  function moveFocusOut(root, fallback = canvas) {
    const active = document.activeElement;
    if (!!active && !!root.contains(active)) {
      fallback.setAttribute("tabindex", "-1");
      fallback.focus({
        preventScroll: true,
      });
      if (root.contains(document.activeElement) && fallback !== canvas) {
        canvas.setAttribute("tabindex", "-1");
        canvas.focus({
          preventScroll: true,
        });
      }
      if (root.contains(document.activeElement)) {
        active.blur();
      }
    }
  }
  function syncMarkerVisibility() {
    const hasHiddenClickable =
      !editing &&
      !viewEditing &&
      (properties.lights || []).some(
        (light) => light.visible !== false && light.hiddenClickable === true,
      );
    const concealMarkers =
      markersSuppressedByActivity ||
      (idleIconsHidden && !hasHiddenClickable) ||
      idleReturning ||
      (!!focusMode && !["edit", "panel"].includes(focusMode));
    for (const [lightId, marker] of markersById) {
      const hiddenClickable =
        !editing &&
        !viewEditing &&
        findLight(lightId)?.hiddenClickable === true;
      const idleHidden =
        idleIconsHidden && !hiddenClickable && !editing && !viewEditing;
      marker.classList.toggle("is-hidden-clickable", hiddenClickable);
      marker.classList.toggle("is-idle-hidden", idleHidden);
      if (idleHidden) {
        moveFocusOut(marker);
        marker.setAttribute("inert", "");
      } else {
        marker.removeAttribute("inert");
      }
      marker.title = hiddenClickable
        ? ""
        : marker.getAttribute("aria-label") || "";
    }
    if (concealMarkers) {
      moveFocusOut(
        markersRoot,
        lightPanel.classList.contains("is-open") ? lightPanel : canvas,
      );
      markersRoot.setAttribute("inert", "");
    } else {
      markersRoot.removeAttribute("inert");
    }
    markersRoot.removeAttribute("aria-hidden");
    if (concealMarkers && markersConcealedAt === null) {
      markersConcealedAt = performance.now();
    } else if (!concealMarkers) {
      markersConcealedAt = null;
    }
    markersRoot.classList.toggle("is-concealed", concealMarkers);
  }
  function syncPresentationChrome() {
    const popupOpacity = Number.isFinite(properties.popupOpacity)
      ? Math.max(0, Math.min(100, properties.popupOpacity))
      : 74;
    lightPanel.style.setProperty(
      "--i3d-panel-opacity",
      String(popupOpacity / 100),
    );
    const vignetteStrength = Number.isFinite(properties.focusVignetteStrength)
      ? Math.max(0, Math.min(60, properties.focusVignetteStrength))
      : 14;
    focusVignette.style.setProperty(
      "--i3d-vignette-opacity",
      String(vignetteStrength / 100),
    );
    focusVignette.hidden =
      viewEditing || focusMode === "edit" || focusMode === "panel";
    focusVignette.classList.toggle(
      "is-active",
      vignetteStrength > 0 &&
        !!focusedLightId &&
        !!focusMode &&
        !focusVignette.hidden,
    );
    viewHelp.hidden = !viewEditing && focusMode !== "edit";
    viewHelp.textContent =
      focusMode === "edit"
        ? "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后保存此灯视角。"
        : "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。";
    markersRoot.classList.toggle(
      "is-view-editing",
      viewEditing || focusMode === "edit",
    );
    lightPanel.classList.toggle("is-preview", editing);
    syncMarkerVisibility();
  }
  function tickCameraMotion(now) {
    if (!cameraMotion) {
      return;
    }
    const motion = cameraMotion;
    const elapsed = Math.max(0, now - cameraMotion.started);
    const linearProgress = cameraMotion.duration
      ? Math.min(1, elapsed / cameraMotion.duration)
      : 1;
    const easedProgress =
      linearProgress === 1
        ? 1
        : (1 - Math.exp((elapsed * -5) / 1000)) /
          (1 - Math.exp((cameraMotion.duration * -5) / 1000));
    focusViewport =
      cameraMotion.inset +
      (cameraMotion.targetInset - cameraMotion.inset) * easedProgress;
    const sample = cameraMotion.sample(elapsed);
    if (options.applyCameraFrame) {
      options.applyCameraFrame(sample, easedProgress, focusViewport);
    } else {
      options.applyCameraPose(sample, easedProgress);
      options.setFocusViewport(focusViewport);
    }
    if (linearProgress === 1 && cameraMotion === motion) {
      cameraMotion = null;
      options.endCameraMotion();
      syncCameraInteraction();
      motion.done?.();
      syncIdleAvailability();
    }
  }
  function normalizeCameraUp(camera) {
    if (camera && camera.view !== "top") {
      return {
        ...camera,
        up: [0, 1, 0],
      };
    } else {
      return camera;
    }
  }
  function startCameraMotion(
    camera,
    focused,
    immediate = false,
    done,
    owner = "focus",
  ) {
    const targetCamera = normalizeCameraUp(camera);
    const fromCamera = options.beginCameraMotion(
      targetCamera.mode,
      targetCamera,
    );
    const duration =
      immediate ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 1100;
    cameraMotion = {
      from: fromCamera,
      to: structuredClone(targetCamera),
      inset: focusViewport,
      targetInset: focused ? panelInset() : 0,
      sample: createFocusCameraSampler(
        THREE,
        fromCamera,
        targetCamera,
        duration,
      ),
      focused: focused,
      owner: owner,
      started: performance.now(),
      duration: duration,
      done: done,
    };
    syncIdleAvailability();
    syncCameraInteraction();
    tickCameraMotion(cameraMotion.started);
    wakeFrameLoop();
  }
  function camerasEqual(a, b) {
    return (
      a.mode === b.mode &&
      Math.abs(a.zoom - b.zoom) < 0.000001 &&
      ["position", "target", "up"].every((key) =>
        (a[key] || [0, 1, 0]).every(
          (value, index) =>
            Math.abs(value - (b[key] || [0, 1, 0])[index]) < 0.000001,
        ),
      ) &&
      ["frameSize", "focalLength"].every(
        (key) => Math.abs((a[key] || 0) - (b[key] || 0)) < 0.000001,
      )
    );
  }
  const idleRotation = createIdleRotation({
    returnToBase(done) {
      idleReturning = true;
      idleCameraBase = structuredClone(
        properties.autoRotate?.returnToDefault === true
          ? normalizeCameraUp(
              properties.camera || baseCameraState || options.cameraState(),
            )
          : options.cameraState(true),
      );
      const hadFocus = !!focusedLightId || !!focusMode;
      focusedLightId = "";
      focusMode = "";
      preFocusCamera = null;
      moveFocusOut(lightPanel);
      lightPanel.classList.remove("is-open");
      lightPanel.setAttribute("inert", "");
      syncPresentationChrome();
      if (hadFocus) {
        postToParent({
          type: "focus-state",
          active: false,
        });
      }
      options.setOrbitPivot(null);
      if (
        !cameraMotion &&
        !focusViewport &&
        camerasEqual(options.cameraState(), idleCameraBase)
      ) {
        done();
      } else {
        startCameraMotion(idleCameraBase, false, false, done, "idle");
      }
    },
    start() {
      idleRotating = true;
      options.beginCameraMotion(idleCameraBase.mode);
      syncCameraInteraction();
    },
    rotate(angle) {
      options.applyCameraPose(options.orbitCameraPose(idleCameraBase, angle));
    },
    stop() {
      const idleMotion = cameraMotion?.owner === "idle";
      const wasRotating = idleRotating;
      idleRotating = false;
      idleReturning = false;
      syncMarkerVisibility();
      if (idleMotion) {
        cameraMotion = null;
      }
      if (idleMotion || wasRotating) {
        options.endCameraMotion();
      }
      syncCameraInteraction();
    },
  });
  const idleIconVisibility = createIdleIconVisibility({
    onChange(hidden) {
      idleIconsHidden = hidden;
      syncMarkerVisibility();
    },
  });
  function syncIdleAvailability() {
    const idleAllowed =
      presented &&
      activityVisible &&
      interactive &&
      !editing &&
      !viewEditing &&
      !document.hidden &&
      !disposed;
    if (!idleAllowed) {
      clearInputHold();
    }
    idleRotation.setAvailable(
      idleAllowed &&
        !focusedLightId &&
        !focusMode &&
        (!cameraMotion || cameraMotion.owner === "idle"),
    );
    idleIconVisibility.setAvailable(idleAllowed);
    frameLoop?.setAvailable(
      !document.hidden && (!activityTracked || presentedVisible),
    );
    wakeFrameLoop();
  }
  function syncInputHold() {
    const held = userHeld || activePointers.size > 0 || activeKeys.size > 0;
    idleRotation.hold(held);
    idleIconVisibility.hold(held);
    wakeFrameLoop();
  }
  function onUserInput(event) {
    lastUserActivityAt = performance.now();
    markersSuppressedByActivity = false;
    syncMarkerVisibility();
    if (event.type === "pointerdown") {
      activePointers.add(event.pointerId);
    }
    if (event.type === "pointerup" || event.type === "pointercancel") {
      activePointers.delete(event.pointerId);
    }
    if (event.type === "keydown") {
      activeKeys.add(event.code || event.key);
    }
    if (event.type === "keyup") {
      activeKeys.delete(event.code || event.key);
    }
    syncInputHold();
  }
  const inputEvents = [
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "wheel",
    "keydown",
    "keyup",
  ];
  for (const type of inputEvents) {
    window.addEventListener(type, onUserInput, {
      capture: true,
      passive: true,
    });
  }
  function clearInputHold() {
    activePointers.clear();
    activeKeys.clear();
    userHeld = false;
    syncInputHold();
  }
  window.addEventListener("blur", clearInputHold);
  if (document.addEventListener) {
    document.addEventListener("visibilitychange", syncIdleAvailability);
  }
  function clearFocus(clearOptions = {}) {
    if (
      !focusedLightId &&
      !focusMode &&
      (!preFocusCamera || clearOptions.immediate !== true)
    ) {
      return;
    }
    const hadEffectPreview = !!effectPreview;
    effectPreview = null;
    const wasEditingFocus = !!focusMode && !!editing;
    focusedLightId = "";
    focusMode = "";
    moveFocusOut(lightPanel);
    lightPanel.classList.remove("is-open");
    lightPanel.setAttribute("inert", "");
    syncPresentationChrome();
    postToParent({
      type: "focus-state",
      active: false,
    });
    if (preFocusCamera) {
      startCameraMotion(
        preFocusCamera,
        false,
        clearOptions.immediate === true,
        () => {
          preFocusCamera = null;
          options.setOrbitPivot(null);
        },
      );
    }
    syncIdleAvailability();
    if (wasEditingFocus) {
      postToParent({
        type: "edit",
        action: "focus-exited",
      });
    }
    if (hadEffectPreview) {
      applyLightStates();
    }
    syncCameraInteraction();
  }
  function focusLight(lightId, mode = "runtime", immediate = false) {
    const light = findLight(lightId);
    if (!light) {
      return;
    }
    if (effectPreview) {
      effectPreview = null;
      applyLightStates();
    }
    if (
      focusedLightId === lightId &&
      focusMode === mode &&
      mode === "runtime"
    ) {
      clearFocus();
      return;
    }
    if (["runtime", "panel"].includes(mode) && !interactive) {
      return;
    }
    if (mode === "panel") {
      if (preFocusCamera || cameraMotion) {
        clearFocus({
          immediate: true,
        });
      }
      focusedLightId = lightId;
      focusMode = "panel";
      controlError.textContent = "";
      lightPanel.removeAttribute("inert");
      lightPanel.classList.add("is-open");
      syncPresentationChrome();
      syncLightPanel();
      syncCameraInteraction();
      syncIdleAvailability();
      postToParent({
        type: "focus-state",
        active: false,
        panelOpen: true,
        id: lightId,
      });
      return;
    }
    preFocusCamera ||= options.cameraState(true);
    const worldTarget = options
      .worldPoint(light.floorId, light.x, light.y, light.height)
      ?.toArray();
    if (!worldTarget) {
      return;
    }
    focusedLightId = lightId;
    focusMode = mode;
    controlError.textContent = "";
    lightPanel.removeAttribute("inert");
    lightPanel.classList.add("is-open");
    options.setOrbitPivot(null);
    syncPresentationChrome();
    syncLightPanel();
    const focusCamera =
      light.focusCamera ||
      automaticLightCamera(
        THREE,
        properties.camera || baseCameraState || preFocusCamera,
        worldTarget,
      );
    startCameraMotion(focusCamera, true, immediate);
    if (!editing) {
      postToParent({
        type: "focus-state",
        active: true,
        id: lightId,
      });
    }
  }
  restoreViewButton.addEventListener("click", () => {
    if (focusMode || preFocusCamera || cameraMotion) {
      clearFocus();
    } else {
      options.restoreCamera(
        normalizeCameraUp(properties.camera || baseCameraState),
      );
    }
  });
  powerButton.addEventListener("click", () => {
    const light = focusedLightBinding();
    if (light) {
      sendLightCommand("power", !previewState(light.entityId).on);
    }
  });
  function syncPowerButton(state) {
    const brightness = Number.isFinite(state.effectColor)
      ? Math.max(0, Math.min(100, Number(state.brightness) || 0))
      : Math.max(
          1,
          Math.min(
            100,
            Number(state.brightness) || (state.brightnessSupported ? 1 : 100),
          ),
        );
    const temperatureRatio =
      (Math.max(2000, Math.min(6500, Number(state.kelvin) || 3000)) - 2000) /
      4500;
    const warmRgb = [255, 132, 42];
    const coolRgb = [172, 225, 255];
    const rgb = warmRgb.map((channel, index) =>
      Math.round(channel + (coolRgb[index] - channel) * temperatureRatio),
    );
    powerButton.classList.toggle("is-on", state.on);
    powerButton.setAttribute("aria-pressed", String(state.on));
    powerButton.setAttribute(
      "aria-label",
      "" +
        (focusedLightBinding()?.label || state.name) +
        (state.available
          ? state.on
            ? "已开启，点击关闭"
            : "已关闭，点击开启"
          : "当前不可用"),
    );
    powerButton.style.setProperty(
      "--i3d-lamp-color",
      Number.isFinite(state.effectColor)
        ? "#" + state.effectColor.toString(16).padStart(6, "0")
        : "rgb(" + rgb.join(",") + ")",
    );
    powerButton.style.setProperty(
      "--i3d-lamp-opacity",
      state.on && brightness > 0
        ? String(0.08 + (brightness / 100) * 0.92)
        : "0",
    );
    powerButton.style.setProperty(
      "--i3d-lamp-scale",
      String(0.62 + (brightness / 100) * 1.05),
    );
  }
  function syncLightPanel() {
    const light = focusedLightBinding();
    if (!light) {
      return clearFocus();
    }
    let state = displayLightState(light);
    const effectPreviewActive = editing && effectPreview?.id === light.id;
    let brightnessMin = 1;
    let brightnessMax = 100;
    if (effectPreviewActive) {
      const combined = {
        ...light,
        ...state,
      };
      const mapped = options.mapLightEffectState(combined);
      const mappedMin = options.mapLightEffectState({
        ...combined,
        brightness: 1,
        kelvin: state.minimum,
      });
      const mappedMax = options.mapLightEffectState({
        ...combined,
        brightness: 100,
        kelvin: state.maximum,
      });
      brightnessMin = mappedMin.brightness;
      brightnessMax = mappedMax.brightness;
      state = {
        ...state,
        brightness: Number.isFinite(mapped.brightness)
          ? Math.round(mapped.brightness)
          : mapped.brightness,
        kelvin: Number.isFinite(mapped.kelvin)
          ? Math.round(mapped.kelvin)
          : mapped.kelvin,
        minimum: mappedMin.kelvin,
        maximum: mappedMax.kelvin,
        effectColor: options.lightEffectColorHex(mapped.kelvin),
      };
    }
    lightTitle.textContent = light.label || state.name;
    deviceStatus.textContent = effectPreviewActive
      ? "效果预览"
      : light.entityId
        ? state.available
          ? state.on
            ? "已开启"
            : "已关闭"
          : "设备不可用"
        : "尚未绑定设备";
    lightTitle.title = lightTitle.textContent;
    controlError.title = controlError.textContent;
    syncPowerButton(state);
    deviceStatus.classList.toggle("is-on", state.available && state.on);
    const commandPending = [...pendingCommands.values()].some(
      (pending) => pending.entityId === light.entityId,
    );
    lightPanel.classList.toggle(
      "is-command-pending",
      commandPending && state.available && !editing,
    );
    lightPanel.setAttribute("aria-busy", String(commandPending));
    const showControls =
      state.available &&
      state.on &&
      (state.brightnessSupported || state.temperatureSupported);
    lightPanel.classList.toggle("has-light-controls", showControls);
    lightPanel.classList.toggle("has-error", !!controlError.textContent);
    if (showControls) {
      lightControls.removeAttribute("inert");
    } else {
      moveFocusOut(lightControls, lightPanel);
      lightControls.setAttribute("inert", "");
    }
    lightControls.removeAttribute("aria-hidden");
    powerButton.disabled = editing || !state.available;
    brightnessSlider.input.min = brightnessMin;
    brightnessSlider.input.max = brightnessMax;
    temperatureSlider.input.min = state.minimum;
    temperatureSlider.input.max = state.maximum;
    for (const [slider, supported, value, unit] of [
      [brightnessSlider, state.brightnessSupported, state.brightness, "%"],
      [temperatureSlider, state.temperatureSupported, state.kelvin, " K"],
    ]) {
      slider.root.hidden = !supported;
      slider.input.disabled = editing || !state.available || !state.on;
      if (document.activeElement !== slider.input) {
        slider.input.value =
          value ?? (slider === brightnessSlider ? 100 : state.minimum);
        slider.value.value = value === null ? "—" : "" + value + unit;
      }
    }
    presetsRoot.hidden =
      !state.brightnessSupported && !state.temperatureSupported;
    for (const preset of presets) {
      const kelvin = Math.round(
        state.minimum +
          ((state.maximum - state.minimum) * preset.temperaturePercent) / 100,
      );
      const active =
        !effectPreviewActive &&
        state.on &&
        (!state.brightnessSupported ||
          Math.abs(state.brightness - preset.brightness) <= 4) &&
        (!state.temperatureSupported ||
          Math.abs(state.kelvin - kelvin) <=
            Math.max(50, (state.maximum - state.minimum) * 0.06));
      preset.button.disabled =
        editing || !state.available || !state.on || presetsRoot.hidden;
      preset.button.classList.toggle("is-active", active);
      preset.button.setAttribute("aria-pressed", String(active));
      preset.detail.textContent = state.brightnessSupported
        ? preset.brightness + "%"
        : "开启";
    }
  }
  function enqueueCommand(command, previewToken) {
    const requestId = String(++controlRequestSeq);
    const entityId = command.entityId;
    lightPreview.retain(entityId, previewToken);
    const timeout = setTimeout(
      () => finishCommand(requestId, "请求超时，请检查设备状态。", true),
      14000,
    );
    pendingCommands.set(requestId, {
      entityId: entityId,
      command: command,
      previewToken: previewToken,
      timeout: timeout,
      next: null,
    });
    postToParent({
      type: "control",
      requestId: requestId,
      command: command,
    });
  }
  function queueOrSendCommand(command, previewToken) {
    const pending = [...pendingCommands.values()].find(
      (entry) => entry.entityId === command.entityId,
    );
    if (!pending) {
      return enqueueCommand(command, previewToken);
    }
    const baseCommand = pending.next?.command || pending.command;
    if (baseCommand.service === "turn_on" && command.service === "turn_on") {
      const data = {
        ...baseCommand.data,
      };
      if ("brightness" in command.data || "brightness_pct" in command.data) {
        delete data.brightness;
        delete data.brightness_pct;
      }
      command = {
        ...command,
        data: {
          ...data,
          ...command.data,
        },
      };
    }
    pending.next = {
      command: command,
      previewToken: previewToken,
    };
    lightPreview.hold(command.entityId, previewToken);
  }
  function finishCommand(requestId, error = "", timedOut = false) {
    const pending = pendingCommands.get(requestId);
    if (!pending) {
      return;
    }
    clearTimeout(pending.timeout);
    pendingCommands.delete(requestId);
    const next = pending.next;
    const shouldContinue =
      next &&
      !timedOut &&
      !disposed &&
      !editing &&
      interactive &&
      (properties.lights || []).some(
        (light) => light.entityId === pending.entityId,
      ) &&
      resolveLightState(pending.entityId).available;
    if (error) {
      lightPreview.reject(pending.entityId, pending.previewToken);
    } else {
      lightPreview.acknowledge(pending.entityId, pending.previewToken);
    }
    if (shouldContinue) {
      enqueueCommand(next.command, next.previewToken);
    } else if (next) {
      lightPreview.reject(pending.entityId, next.previewToken);
    }
    if (focusedLightBinding()?.entityId === pending.entityId) {
      controlError.textContent = shouldContinue ? "" : error;
    }
    syncMarkers();
  }
  async function sendLightCommand(kind, value, light = focusedLightBinding()) {
    if (!!light && !editing && !disposed) {
      try {
        const state = resolveLightState(light.entityId);
        let command;
        let previewValue = value;
        if (kind === "preset") {
          if (!lightPresets.includes(value)) {
            throw new Error("灯光预设无效。");
          }
          const fields = [];
          previewValue = {};
          if (state.brightnessSupported) {
            fields.push(["brightness", value.brightness]);
            previewValue.brightness = value.brightness;
          }
          if (state.temperatureSupported) {
            previewValue.kelvin = Math.round(
              state.minimum +
                ((state.maximum - state.minimum) * value.temperaturePercent) /
                  100,
            );
            fields.push(["temperature", previewValue.kelvin]);
          }
          if (!fields.length) {
            throw new Error("此设备不支持灯光预设。");
          }
          const commands = fields.map(([field, fieldValue]) =>
            lightCommand(light.entityId, field, fieldValue, state),
          );
          command = {
            ...commands[0],
            data: Object.assign({}, ...commands.map((part) => part.data)),
          };
          if (state.brightnessSupported && value.brightness < 100) {
            delete command.data.brightness;
            command.data.brightness_pct = value.brightness;
          }
        } else {
          command = lightCommand(light.entityId, kind, value, state);
        }
        const previewToken = lightPreview.set(
          light.entityId,
          kind,
          previewValue,
          true,
        );
        applyLightStates({
          preview: kind !== "power",
        });
        queueOrSendCommand(command, previewToken);
        controlError.textContent = "";
        syncMarkers();
      } catch (error) {
        controlError.textContent = error.message;
        syncLightPanel();
      }
    }
  }
  let markerProjectionKey = "";
  function updateMarkerPositions(force = false) {
    if (sceneUpdating || disposed) {
      return;
    }
    options.camera.updateMatrixWorld();
    if (
      markersConcealedAt !== null &&
      performance.now() - markersConcealedAt >= 240
    ) {
      markerProjectionKey = "";
      return;
    }
    if (markerDocRef !== options.document || markerFloorRef !== activeFloorId) {
      markerWorldCache.clear();
      markerDocRef = options.document;
      markerFloorRef = activeFloorId;
    }
    const containerRect = container.getBoundingClientRect();
    const layoutWidth = presentationLayout?.width || containerRect.width;
    const layoutHeight = presentationLayout?.height || containerRect.height;
    const projectionKey =
      layoutWidth +
      ":" +
      layoutHeight +
      ":" +
      options.camera.matrixWorld.elements +
      ":" +
      options.camera.projectionMatrix.elements;
    if (force === true || projectionKey !== markerProjectionKey) {
      markerProjectionKey = projectionKey;
      for (const light of properties.lights || []) {
        const lightId = light.id;
        const marker = markersById.get(lightId);
        if (!marker) {
          continue;
        }
        const onFloor =
          light.visible !== false &&
          (activeFloorId === "all" || light.floorId === activeFloorId);
        let cached = markerWorldCache.get(lightId);
        if (
          onFloor &&
          (!cached ||
            cached.floorId !== light.floorId ||
            cached.x !== light.x ||
            cached.y !== light.y ||
            cached.height !== light.height)
        ) {
          cached = {
            floorId: light.floorId,
            x: light.x,
            y: light.y,
            height: light.height,
            point: options.worldPoint(
              light.floorId,
              light.x,
              light.y,
              light.height,
            ),
          };
          markerWorldCache.set(lightId, cached);
        }
        const worldPoint = onFloor && cached?.point;
        if (!worldPoint) {
          marker.hidden = true;
          continue;
        }
        const projected = projectedPoint
          .copy(worldPoint)
          .project(options.camera);
        marker.hidden =
          projected.z < -1 ||
          projected.z > 1 ||
          Math.abs(projected.x) > 1.05 ||
          Math.abs(projected.y) > 1.05;
        marker.style.left = ((projected.x + 1) * layoutWidth) / 2 + "px";
        marker.style.top = ((1 - projected.y) * layoutHeight) / 2 + "px";
      }
    }
  }
  function syncMarkers() {
    if (sceneUpdating) {
      return;
    }
    wakeFrameLoop();
    const lightIds = new Set(
      (properties.lights || []).map((light) => light.id),
    );
    for (const [lightId, marker] of markersById) {
      if (!lightIds.has(lightId)) {
        marker.remove();
        markersById.delete(lightId);
        markerWorldCache.delete(lightId);
      }
    }
    for (const light of properties.lights || []) {
      let marker = markersById.get(light.id);
      if (!marker) {
        marker = createElement("button", "i3d-marker");
        marker.type = "button";
        marker.addEventListener("click", (event) => {
          event.stopPropagation();
          if (!sceneUpdating && !viewEditing && focusMode !== "edit") {
            if (marker.dataset.dragged === "true") {
              marker.dataset.dragged = "";
              return;
            }
            if (editing) {
              selectedId = light.id;
              postToParent({
                type: "edit",
                action: "select",
                id: light.id,
              });
              syncMarkers();
            } else {
              let targetLight = findLight(light.id);
              let state = targetLight && previewState(targetLight.entityId);
              if (
                ["turn-on", "turn-on-panel"].includes(targetLight?.clickAction)
              ) {
                if (targetLight.clickAction === "turn-on-panel") {
                  focusLight(targetLight.id, "panel");
                }
                if (state.available && !state.on) {
                  sendLightCommand("power", true, targetLight);
                }
                return;
              }
              focusLight(targetLight.id);
              targetLight = findLight(targetLight.id);
              state = targetLight && previewState(targetLight.entityId);
              if (
                focusedLightId === targetLight.id &&
                focusMode === "runtime" &&
                targetLight?.clickAction === "turn-on-focus" &&
                state.available &&
                !state.on
              ) {
                sendLightCommand("power", true);
              }
            }
          }
        });
        marker.addEventListener("pointerdown", (event) =>
          onMarkerPointerDown(event, light.id),
        );
        marker.addEventListener("pointermove", onMarkerPointerMove);
        marker.addEventListener("pointerup", onMarkerPointerUp);
        marker.addEventListener("pointercancel", onMarkerPointerCancel);
        markersRoot.append(marker);
        markersById.set(light.id, marker);
      }
      const icon = /^mdi:[a-z0-9-]+$/.test(light.icon || "") ? light.icon : "";
      if (marker.dataset.icon !== icon) {
        marker.dataset.icon = icon;
        if (icon) {
          const iconEl = createElement("span", "i3d-marker-icon");
          iconEl.setAttribute("aria-hidden", "true");
          iconEl.style.maskImage =
            'url("/bridge-static/vendor/mdi/7.4.47/svg/' +
            icon.slice(4) +
            '.svg")';
          iconEl.style.webkitMaskImage = iconEl.style.maskImage;
          marker.replaceChildren(iconEl);
        } else {
          marker.innerHTML = defaultMarkerSvg;
        }
      }
      const state = previewState(light.entityId);
      const markerSize =
        Number.isFinite(light.size) && light.size > 0 ? light.size : 44;
      const iconSize =
        Number.isFinite(light.iconSize) && light.iconSize > 0
          ? light.iconSize
          : Math.min(markerSize, Math.max(4, markerSize - 18));
      const hitSize =
        Number.isFinite(light.hitSize) && light.hitSize > 0
          ? light.hitSize
          : Math.max(44, markerSize);
      marker.style.width = marker.style.height = hitSize + "px";
      marker.style.setProperty("--i3d-marker-size", markerSize + "px");
      marker.style.setProperty("--i3d-marker-icon-size", iconSize + "px");
      marker.setAttribute("aria-label", light.label || state.name || "灯光");
      marker.title = light.label || state.name;
      marker.classList.toggle("is-on", state.on);
      marker.classList.toggle("is-offline", !editing && !state.available);
      marker.classList.toggle(
        "is-selected",
        editing && selectedId === light.id,
      );
    }
    applyLightStates();
    syncLightPanel();
    syncMarkerVisibility();
    updateMarkerPositions(true);
  }
  function pointerToFloorPoint(event, light) {
    const origin = options.worldPoint(light.floorId, 0, 0, light.height);
    if (!origin) {
      return null;
    }
    const rect = container.getBoundingClientRect();
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((event.clientY - rect.top) / rect.height) * 2,
      ),
      options.camera,
    );
    const hit = raycaster.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -origin.y),
      new THREE.Vector3(),
    );
    if (!hit) {
      return null;
    }
    const xAxis = options
      .worldPoint(light.floorId, 1, 0, light.height)
      .sub(origin);
    const yAxis = options
      .worldPoint(light.floorId, 0, 1, light.height)
      .sub(origin);
    const local = hit.sub(origin);
    return {
      x: Math.round((local.dot(xAxis) / xAxis.lengthSq()) * 100) / 100,
      y: Math.round((local.dot(yAxis) / yAxis.lengthSq()) * 100) / 100,
    };
  }
  function onMarkerPointerDown(event, lightId) {
    if (!editing || focusMode || event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const light = findLight(lightId);
    selectedId = lightId;
    postToParent({
      type: "edit",
      action: "select",
      id: lightId,
    });
    const pointerPoint = pointerToFloorPoint(event, light);
    dragState = {
      id: lightId,
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      original: {
        x: light.x,
        y: light.y,
      },
      offset: pointerPoint
        ? {
            x: light.x - pointerPoint.x,
            y: light.y - pointerPoint.y,
          }
        : {
            x: 0,
            y: 0,
          },
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    options.controls.enabled = false;
  }
  function onMarkerPointerMove(event) {
    if (
      !dragState ||
      dragState.pointerId !== event.pointerId ||
      (Math.hypot(
        event.clientX - dragState.clientX,
        event.clientY - dragState.clientY,
      ) < 4 &&
        !dragState.moved)
    ) {
      return;
    }
    const point = pointerToFloorPoint(event, findLight(dragState.id));
    if (point) {
      dragState.moved = true;
      Object.assign(findLight(dragState.id), {
        x: Math.round((point.x + dragState.offset.x) * 100) / 100,
        y: Math.round((point.y + dragState.offset.y) * 100) / 100,
      });
      updateMarkerPositions(true);
    }
  }
  function onMarkerPointerUp(event) {
    if (!!dragState && dragState.pointerId === event.pointerId) {
      if (dragState.moved) {
        event.currentTarget.dataset.dragged = "true";
        const light = findLight(dragState.id);
        postToParent({
          type: "edit",
          action: "position",
          id: light.id,
          x: light.x,
          y: light.y,
        });
      }
      dragState = null;
      syncCameraInteraction();
    }
  }
  function onMarkerPointerCancel() {
    if (dragState) {
      Object.assign(findLight(dragState.id), dragState.original);
    }
    dragState = null;
    syncCameraInteraction();
    updateMarkerPositions(true);
  }
  let canvasPointerDown;
  canvas.addEventListener("pointerdown", (event) => {
    canvasPointerDown = {
      x: event.clientX,
      y: event.clientY,
    };
  });
  canvas.addEventListener("pointerup", (event) => {
    if (
      focusMode !== "edit" &&
      canvasPointerDown &&
      Math.hypot(
        event.clientX - canvasPointerDown.x,
        event.clientY - canvasPointerDown.y,
      ) < 5
    ) {
      clearFocus();
    }
    canvasPointerDown = null;
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearFocus();
    }
  });
  function onParentMessage(event) {
    if (
      event.origin !== location.origin ||
      event.source !== window.parent ||
      event.data?.channel !== "hb-i3d-v1"
    ) {
      return;
    }
    const data = event.data;
    wakeFrameLoop();
    if (data.type === "presentation-layout") {
      if (
        Number.isFinite(data.width) &&
        data.width > 0 &&
        Number.isFinite(data.height) &&
        data.height > 0
      ) {
        presentationLayout = {
          width: data.width,
          height: data.height,
        };
        syncPresentationLayout();
      }
    } else if (data.type === "config") {
      if (sceneUpdating) {
        deferredMessage = event;
        return;
      }
      markersSuppressedByActivity = false;
      rawProperties = structuredClone(data.properties);
      data.properties = transformProperties(rawProperties);
      idleRotation.activity();
      idleIconVisibility.activity();
      const cameraChanged =
        (viewEditing && data.viewEditing !== true) ||
        JSON.stringify(properties.camera) !==
          JSON.stringify(data.properties.camera);
      if (
        (focusMode || preFocusCamera || cameraMotion) &&
        (cameraChanged ||
          properties.floorSelection !== data.properties.floorSelection ||
          editing !== (data.editing === true) ||
          data.viewEditing === true ||
          (editing && selectedId !== (data.selectedId || "")))
      ) {
        clearFocus({
          immediate: true,
        });
      }
      properties = structuredClone(data.properties);
      editing = data.editing === true;
      viewEditing = data.viewEditing === true;
      selectedId = data.selectedId || "";
      states = data.states || {};
      interactive = !editing && data.interactive === true;
      for (const pending of pendingCommands.values()) {
        if (
          pending.next &&
          (!interactive ||
            !(properties.lights || []).some(
              (light) => light.entityId === pending.entityId,
            ))
        ) {
          lightPreview.reject(pending.entityId, pending.next.previewToken);
          pending.next = null;
        }
      }
      idleRotation.configure(properties.autoRotate);
      idleIconVisibility.configure(properties.idleHideIcons);
      syncIdleAvailability();
      options.appearance(properties);
      const floorId =
        options.document.floors.some(
          (floor) => floor.id === properties.floorSelection,
        ) || properties.floorSelection === "all"
          ? properties.floorSelection
          : options.document.floors[0].id;
      if (activeFloorId !== floorId) {
        activeFloorId = floorId;
        options.setFloor(floorId);
        options.restoreCamera(normalizeCameraUp(properties.camera));
        baseCameraState = options.cameraState();
      } else if (cameraChanged) {
        options.restoreCamera(
          normalizeCameraUp(properties.camera || baseCameraState),
        );
        baseCameraState = options.cameraState();
      }
      syncCameraInteraction();
      toolbar.hidden = true;
      syncPresentationChrome();
      if (viewEditing || (!editing && !interactive)) {
        clearFocus({
          immediate: true,
        });
      }
      syncMarkers();
      const generation = ++presentGeneration;
      (presented ? Promise.resolve() : options.whenPresented())
        .then(() => {
          if (!disposed && generation === presentGeneration) {
            presented = true;
            syncIdleAvailability();
            updateMarkerPositions(true);
            postToParent({
              type: "presented",
              configId: data.configId,
              camera: transformCamera(
                options.cameraState(),
                properties.floorSelection,
                true,
              ),
            });
          }
        })
        .catch((error) => {
          if (!disposed && generation === presentGeneration) {
            postToParent({
              type: "error",
              message: error.message || "户型画面准备失败，请重新载入。",
            });
          }
        });
    } else if (data.type === "activity-state") {
      activityTracked = true;
      activityVisible = data.visible === true;
      presentedVisible =
        data.presentedVisible === undefined
          ? activityVisible
          : data.presentedVisible === true;
      options.setPresentedVisible?.(presentedVisible);
      if (!activityVisible) {
        markersSuppressedByActivity = false;
      }
      syncIdleAvailability();
    } else if (data.type === "user-activity") {
      markersSuppressedByActivity = false;
      lastUserActivityAt = performance.now();
      syncMarkerVisibility();
      userHeld = data.held === true;
      syncInputHold();
    } else if (data.type === "dismiss-focus") {
      idleRotation.activity();
      idleIconVisibility.activity();
      clearFocus({
        immediate: data.immediate === true,
      });
    } else if (data.type === "states") {
      states = data.states || {};
      for (const light of properties.lights || []) {
        lightPreview.reconcile(
          light.entityId,
          resolveLightState(light.entityId),
        );
      }
      syncMarkers();
    } else if (data.type === "control-result") {
      finishCommand(data.requestId, data.error || "", data.timedOut === true);
    } else if (data.type === "editor-command" && editing) {
      try {
        if (data.command === "edit-light-camera") {
          focusLight(data.id, "edit", true);
        } else if (data.command === "preview-light-camera") {
          focusLight(data.id, "preview");
        } else if (data.command === "preview-light-effect") {
          if (
            ![
              "brightnessMin",
              "brightnessMax",
              "temperatureMin",
              "temperatureMax",
              "defaults",
            ].includes(data.value)
          ) {
            throw new Error("请选择要预览的效果。");
          }
          if (!findLight(data.id)) {
            throw new Error("灯光按钮已移除。");
          }
          if (!findLight(data.id).entityId) {
            throw new Error("请先绑定实体，再预览灯光效果。");
          }
          focusLight(data.id, "preview");
          effectPreview = {
            id: data.id,
            kind: data.value,
          };
          applyLightStates({
            preview: true,
          });
          syncLightPanel();
        } else if (data.command === "cancel-light-camera") {
          clearFocus({
            immediate: true,
          });
        } else {
          if (focusMode !== "edit" || data.id !== focusedLightId) {
            throw new Error("请先调整这盏灯的聚焦视角。");
          }
          if (data.command === "focus-projection") {
            options.setCameraProjection(data.value);
          }
          if (data.command === "focus-focal-length") {
            options.setCameraFocalLength(data.value);
          }
        }
        syncCameraInteraction();
        const camera = currentCamera();
        postToParent({
          type: "edit",
          action: "focus-camera",
          requestId: data.requestId,
          id: data.id,
          camera: camera,
        });
        if (data.command === "save-light-camera") {
          clearFocus({
            immediate: true,
          });
        }
      } catch (error) {
        postToParent({
          type: "edit",
          action: "focus-camera",
          requestId: data.requestId,
          error: error.message,
        });
      }
    } else if (data.type === "editor-command" && viewEditing) {
      if (data.command === "projection") {
        options.setCameraProjection(data.value);
      }
      if (data.command === "focal-length") {
        options.setCameraFocalLength(data.value);
      }
      syncCameraInteraction();
      if (data.command === "save-camera" || data.requestId) {
        postToParent({
          type: "edit",
          action: "camera",
          requestId: data.requestId,
          camera: currentCamera(),
        });
      }
    }
  }
  window.addEventListener("message", onParentMessage);
  const controls = options.controls;
  const unsubscribeCameraChange = options.onCameraChange?.(
    updateMarkerPositions,
  );
  if (!unsubscribeCameraChange) {
    controls.addEventListener("change", updateMarkerPositions);
  }
  const resizeObserver = new ResizeObserver(syncPresentationLayout);
  resizeObserver.observe(container);
  async function applySceneUpdate(scene) {
    const savedScene = options.savedScene;
    const cameraBeforeUpdate = currentCamera();
    markersSuppressedByActivity =
      markersSuppressedByActivity || idleReturning || idleIconsHidden;
    sceneUpdating = true;
    idleRotation.activity();
    syncMarkerVisibility();
    let uncover = () => {};
    let replaced = false;
    const replaceAndRestore = async (nextScene) => {
      await options.replaceScene(nextScene);
      if (disposed) {
        return;
      }
      properties = transformProperties(rawProperties);
      const floorId =
        options.document.floors.some(
          (floor) => floor.id === properties.floorSelection,
        ) || properties.floorSelection === "all"
          ? properties.floorSelection
          : options.document.floors[0].id;
      activeFloorId = floorId;
      options.setFloor(floorId);
      options.appearance(properties);
      baseCameraState = transformCamera(
        rawProperties.camera || cameraBeforeUpdate,
        floorId,
      );
      options.restoreCamera(transformCamera(cameraBeforeUpdate, floorId));
      applyLightStates({
        immediate: true,
      });
      await options.whenPresented();
    };
    try {
      uncover = options.coverSceneUpdate();
      options.setCameraInteraction({
        enabled: false,
      });
      replaced = true;
      await replaceAndRestore(scene);
      if (!disposed) {
        postToParent({
          type: "model-metadata",
          metadata: collectMetadata(),
        });
      }
    } catch (error) {
      if (replaced && !disposed) {
        await replaceAndRestore(savedScene);
      }
      throw error;
    } finally {
      uncover();
      sceneUpdating = false;
      markerWorldCache.clear();
      if (
        !disposed &&
        (syncCameraInteraction(), syncMarkers(), deferredMessage)
      ) {
        const message = deferredMessage;
        deferredMessage = null;
        onParentMessage(message);
      }
    }
  }
  const stopSceneSync = options.readSceneUpdate
    ? startSceneSync({
        eligible: () =>
          !disposed &&
          presented &&
          activityVisible &&
          !document.hidden &&
          !editing &&
          !viewEditing &&
          !focusMode &&
          !cameraMotion &&
          !dragState &&
          !sceneUpdating &&
          !pendingCommands.size &&
          !userHeld &&
          !activePointers.size &&
          !activeKeys.size &&
          performance.now() - lastUserActivityAt > 1200,
        read: (signal) => options.readSceneUpdate(signal),
        apply: applySceneUpdate,
      })
    : () => {};
  frameLoop = options.createFrameLoop({
    step(now) {
      if (disposed || document.hidden || sceneUpdating) {
        return Infinity;
      } else {
        tickCameraMotion(now);
        idleRotation.tick(now);
        idleIconVisibility.tick(now);
        if (lightPreview.expire()) {
          syncMarkers();
        }
        updateMarkerPositions();
        canvas.dataset.stageFrameChecks = String(frameLoop.stats.frames);
        return Math.min(
          cameraMotion ? 0 : Infinity,
          idleRotation.nextDelay(now),
          idleIconVisibility.nextDelay(now),
          lightPreview.nextDelay(now),
        );
      }
    },
  });
  syncIdleAvailability();
  window.addEventListener("pagehide", () => {
    lightStateCache.flush();
    stopSceneSync();
    disposed = true;
    idleRotation.dispose();
    idleIconVisibility.dispose();
    cameraMotion = null;
    postToParent({
      type: "focus-state",
      active: false,
    });
    for (const type of inputEvents) {
      window.removeEventListener(type, onUserInput, true);
    }
    window.removeEventListener("blur", clearInputHold);
    document.removeEventListener?.("visibilitychange", syncIdleAvailability);
    frameLoop.dispose();
    unsubscribeCameraChange?.();
    if (!unsubscribeCameraChange) {
      controls.removeEventListener("change", updateMarkerPositions);
    }
    resizeObserver.disconnect();
    pendingCommands.forEach((pending) => clearTimeout(pending.timeout));
    pendingCommands.clear();
  });
  function collectMetadata() {
    return {
      camera: transformCamera(
        options.cameraState(),
        properties.floorSelection || options.document.activeFloorId,
        true,
      ),
      baseLighting: options.document.baseLighting,
      defaults: options.defaults,
      floors: options.document.floors.map((floor) => {
        const settingsWallHeight = floor.scene.settings?.wallHeight;
        const wallHeights = floor.scene.walls
          .map((wall) => wall.height)
          .filter((height) => Number.isFinite(height) && height > 0);
        const wallHeight = Math.max(
          0.01,
          Math.min(
            6,
            Number.isFinite(settingsWallHeight) && settingsWallHeight > 0
              ? settingsWallHeight
              : Math.max(0, ...wallHeights) || 2.8,
          ),
        );
        return {
          id: floor.id,
          name: floor.name,
          wallHeight: wallHeight,
          groups: floor.scene.lightGroups.map((group) => {
            const items = floor.scene.items.filter(
              (item) => item.lightGroupId === group.id,
            );
            const points = items.length
              ? items
              : floor.scene.walls.map((wall) => wall.start);
            return {
              id: group.id,
              name: group.name,
              height: wallHeight,
              x: points.length
                ? points.reduce((sum, point) => sum + point.x, 0) /
                  points.length
                : 0,
              y: points.length
                ? points.reduce((sum, point) => sum + point.y, 0) /
                  points.length
                : 0,
            };
          }),
        };
      }),
    };
  }
  postToParent({
    type: "ready",
    metadata: collectMetadata(),
  });
}
