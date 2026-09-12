import { createPresenceScene, createPresenceWaves } from "./presence-scene.js?v=20260910-presence-v1-20260911-world-waves-v3-wave-settings-v1-presence-pages-v2";
import { floorNavigationChoices } from "./floor-navigation.js?v=20260909-floor-numbers-v1-20260912-align-v1";
import { createVacuumMotion, vacuumQuip, createVacuumFollowCamera, vacuumBirdCamera, vacuumFollowPose } from "./vacuum-motion.js?v=20260909-reflection-cache-v4";
import { createVacuumMaps, vacuumStatusPresentation, vacuumBindingsForMap } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { televisionState } from "./television-state.js";
import { createTelevisionPanel } from "./television-panel.js?v=20260911-quiet-feedback-v1";
import { createTelevisionScreens } from "./television-screen.js?v=20260909-reflection-cache-v4";
import { createNasPanel } from "./nas-panel.js";
import { createNasStatus, nasDeviceState } from "./nas-status.js?v=20260908-nas-v1";
import { createCameraStatus, cameraOnline } from "./camera-status.js";
import { coverState, coverIconIsOn } from "./cover-state.js?v=20260910-curtain-default-open-v2-20260912-align-v1";
import { createCoverFeedback } from "./cover-feedback.js?v=20260910-curtain-default-open-v2-20260912-align-v1";
import { createCoverPanel } from "./cover-panel.js?v=20260910-curtain-default-open-v2-20260912-align-v1";
import { createCurtainMotion } from "./curtain-motion.js?v=20260910-health-fixes-v2";
import { createEnvironmentAirflow } from "./environment-airflow.js?v=20260908-outlet-airflow-v1-20260909-page-behavior-airflow-zoom-v1";
import { mountRegionRangeEditor } from "./light-range-editor.js?v=20260909-curtain-action-v15";
import { climateState } from "./climate-state.js?v=20260908-climate-v1";
import { createClimatePanel } from "./climate-panel.js?v=20260908-climate-v1";
import { createEnvironmentScene, pageDimming, pageModelBindings } from "./environment-scene.js?v=20260909-reflection-cache-v4";
import { startSceneSync } from "./scene-sync.js?v=20260907-scene-sync-v1";
import { lightCommand, createLightPreview, createLightStateCache, lightRenderState } from "./light-state.js?v=20260907-demand-v1";
import { createDampedCameraMotion, automaticLightCamera, automaticAirConditionerCamera } from "./camera-motion.js?v=20260911-focus-damped-compare-v2-navigation-light-v1";
import { createScreenOutlines } from "./environment-halos.js?v=20260911-screen-outline-pulse-v1";
import { resolvePageBehavior, createIdleRotation, createIdleIconVisibility, createIdleFocusExit } from "./idle-rotation.js?v=20260907-idle-focus-exit-v1-20260909-page-behavior-airflow-zoom-v1";
const defaultMarkerSvg = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" aria-hidden=\"true\"><path d=\"M8 15c0-2-3-3-3-7a7 7 0 0 1 14 0c0 4-3 5-3 7l-1 3H9l-1-3Z\"/><path d=\"M9 21h6M9 15h6\"/></svg>";
const lightPresets = [{
  label: "柔和",
  brightness: 25,
  temperaturePercent: 10
}, {
  label: "日常",
  brightness: 60,
  temperaturePercent: 50
}, {
  label: "明亮",
  brightness: 100,
  temperaturePercent: 100
}];
export function mountStage(options) {
  const {
    THREE,
    container,
    canvas
  } = options;
  let properties = {
    lights: []
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
  let focusMode = resolvePageBehavior();
  let preFocusCamera = "overview";
  let cameraMotion = "";
  let focusViewport = "";
  let activityVisible = "";
  let idleRotating = false;
  const idleReturning = () => preFocusCamera === "overview";
  const idleCameraBase = floorId => activeFloorId === "all" || floorId.floorId === activeFloorId;
  let frameLoop = "";
  let activityTracked = null;
  let presentedVisible = null;
  let wakeFrameLoop = 0;
  let idleIconsHidden = false;
  let userHeld = false;
  let activePointers = false;
  let activeKeys = null;
  let markersById = null;
  let pendingCommands = false;
  let markerWorldCache = true;
  let active = false;
  let markerDocRef = null;
  let markerFloorRef = false;
  let markersConcealedAt = false;
  let lightPreview = false;
  const wake = () => markersById?.wake();
  let lightHistoryStorage = false;
  let lightStateCache = false;
  const resolveLightState = new Set();
  const effectPreview = new Set();
  const rawProperties = new Map();
  const sceneUpdating = new Map();
  const markersSuppressedByActivity = new Map();
  const deferredMessage = new THREE.Vector3();
  let lastUserActivityAt;
  let transformCamera;
  let currentCamera = null;
  const reject = createLightPreview();
  const scope = document.body?.dataset?.i3dLightHistoryScope;
  let storage;
  if (scope) {
    try {
      storage = window.localStorage;
    } catch {}
  }
  const presentationRoot = createLightStateCache({
    storage,
    scope
  });
  const resolveLightEntityState = entityId => presentationRoot.resolve(entityId || "", states[entityId]);
  let presentationScale = null;
  let focusVignette = {
    lights: []
  };
  let toolbar = false;
  let restoreViewButton = false;
  let lightPanel = null;
  let lightPanelHeader = -Infinity;
  const transformCameraForFloor = (cameraState, floorId = properties.floorSelection, forTitle = false) => options.transformCamera?.(cameraState, floorId, forTitle) ?? cameraState;
  const lightTitle = () => transformCameraForFloor(options.cameraState(true), properties.floorSelection, true);
  function transformProperties(nextProperties) {
    const clonedProperties = structuredClone(nextProperties);
    clonedProperties.camera = transformCameraForFloor(clonedProperties.floorCameras?.[clonedProperties.floorSelection] || clonedProperties.camera, clonedProperties.floorSelection);
    clonedProperties.lights = (clonedProperties.lights || []).map(light => ({
      ...light,
      ...(light.focusCamera ? {
        focusCamera: transformCameraForFloor(light.focusCamera, clonedProperties.floorSelection)
      } : {})
    }));
    if (clonedProperties.security?.presenceSensors) {
      clonedProperties.security.presenceSensors = clonedProperties.security.presenceSensors.map(focusCamera => ({
        ...focusCamera,
        ...(focusCamera.focusCamera ? {
          focusCamera: transformCameraForFloor(focusCamera.focusCamera, clonedProperties.floorSelection)
        } : {})
      }));
    }
    if (clonedProperties.security?.cameras) {
      clonedProperties.security.cameras = clonedProperties.security.cameras.map(focusCamera => ({
        ...focusCamera,
        ...(focusCamera.focusCamera ? {
          focusCamera: transformCameraForFloor(focusCamera.focusCamera, clonedProperties.floorSelection)
        } : {})
      }));
    }
    if (clonedProperties.environment) {
      for (const envKey of ["airConditioners", "curtains"]) {
        clonedProperties.environment[envKey] = (clonedProperties.environment[envKey] || []).map(focusCamera => ({
          ...focusCamera,
          ...(focusCamera.focusCamera ? {
            focusCamera: transformCameraForFloor(focusCamera.focusCamera, clonedProperties.floorSelection)
          } : {})
        }));
      }
    }
    for (const deviceCollectionKey of ["nas", "televisions", "vacuums"]) {
      if (clonedProperties.devices?.[deviceCollectionKey]) {
        clonedProperties.devices[deviceCollectionKey] = clonedProperties.devices[deviceCollectionKey].map(focusCamera => ({
          ...focusCamera,
          ...(focusCamera.focusCamera ? {
            focusCamera: transformCameraForFloor(focusCamera.focusCamera, clonedProperties.floorSelection)
          } : {})
        }));
      }
    }
    if (clonedProperties.devices?.vacuums) {
      for (const followCamera of clonedProperties.devices.vacuums) {
        followCamera.followCamera &&= transformCameraForFloor(followCamera.followCamera, clonedProperties.floorSelection);
      }
    }
    return clonedProperties;
  }
  const deviceStatus = message => window.parent.postMessage({
    channel: "hb-i3d-v1",
    ...message
  }, location.origin);
  const createEl = (tagName, className, textContent) => {
    const el = document.createElement(tagName);
    el.className = className || "";
    if (textContent) {
      el.textContent = textContent;
    }
    return el;
  };
  const markersRootNode = createEl("div", "i3d-markers");
  const vacuumWorkingLayer = createEl("div", "i3d-vacuum-working-layer");
  let hideIconsUntilDeg = 0;
  let lightControls = "";
  const previousCameraQuaternion = new THREE.Quaternion();
  let previousCameraFrameTime = null;
  let temperatureSlider = false;
  let brightnessSlider = 0;
  let presetsRoot = -1;
  let presets = "";
  let controlError = null;
  let viewHelp = null;
  const presentationRootEl = createEl("div", "i3d-presentation");
  let focusedLightBinding = null;
  let previewState = 1;
  const focusVignetteEl = createEl("div", "i3d-focus-vignette");
  focusVignetteEl.setAttribute("aria-hidden", "true");
  const toolbarEl = createEl("nav", "i3d-toolbar");
  const navigationEl = createEl("div", "i3d-navigation");
  const floorTabsEl = createEl("nav", "i3d-floor-tabs");
  floorTabsEl.setAttribute("aria-label", "选择楼层");
  let markerProjectionKey = "";
  const moduleTabsEl = createEl("nav", "i3d-module-tabs");
  moduleTabsEl.setAttribute("aria-label", "3D 控制模块");
  const controls = new Map();
  for (const [module, moduleLabel] of [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]]) {
    const type = createEl("button", "", moduleLabel);
    type.type = "button";
    type.dataset.module = module;
    type.style.setProperty("--i3d-tab-index", String(controls.size));
    type.addEventListener("click", () => selectNavigationModule(module));
    moduleTabsEl.append(type);
    controls.set(module, type);
  }
  const moduleEmptyEl = createEl("p", "i3d-module-empty");
  moduleEmptyEl.setAttribute("role", "status");
  moduleEmptyEl.hidden = true;
  const restoreViewBtn = createEl("button", "", "恢复视角");
  restoreViewBtn.type = "button";
  restoreViewBtn.hidden = true;
  toolbarEl.append(restoreViewBtn);
  const lightPanelEl = createEl("section", "i3d-light-panel");
  lightPanelEl.setAttribute("aria-label", "灯光控制");
  lightPanelEl.setAttribute("inert", "");
  const lightPanelHeaderEl = createEl("header");
  const lightHeadingWrap = createEl("div", "i3d-light-heading-text");
  const lightHeadingText = createEl("strong", "", "灯光");
  const powerButton = createEl("p", "i3d-device-status");
  lightHeadingWrap.append(lightHeadingText, powerButton);
  const powerButtonEl = createEl("button", "i3d-power");
  powerButtonEl.type = "button";
  const lampDrawingEl = createEl("span", "i3d-lamp-drawing");
  lampDrawingEl.setAttribute("aria-hidden", "true");
  const lampAuraEl = createEl("span", "i3d-lamp-aura");
  const lampBodyEl = createEl("span", "i3d-lamp-body");
  for (const type of ["cord", "shade", "bulb", "filament"]) {
    lampBodyEl.append(createEl("i", "i3d-lamp-" + type));
  }
  lampDrawingEl.append(lampAuraEl, lampBodyEl);
  powerButtonEl.append(lampDrawingEl);
  lightPanelHeaderEl.append(lightHeadingWrap, powerButtonEl);
  const lightControlsEl = createEl("div", "i3d-light-controls");
  function createSlider(label, kind, min, max) {
    const root = createEl("label", "i3d-slider i3d-" + kind);
    const labelEl = createEl("span", "", label);
    const output = createEl("output");
    const input = createEl("input");
    input.name = "i3d-light-" + kind;
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = kind === "temperature" ? "10" : "1";
    input.setAttribute("aria-label", label);
    const heading = createEl("div", "i3d-slider-heading");
    heading.append(labelEl, output);
    const legend = createEl("span", "i3d-slider-legend");
    legend.append(createEl("small", "", kind === "temperature" ? "暖色" : "暗"), createEl("small", "", kind === "temperature" ? "冷色" : "亮"));
    root.append(heading, input, legend);
    input.addEventListener("input", () => {
      output.value = "" + input.value + (kind === "temperature" ? " K" : "%");
      const focusedLight = callback();
      if (!!focusedLight && !editing && !!resolveLightEntityState(focusedLight.entityId).available) {
        reject.set(focusedLight.entityId, kind, Number(input.value));
        wake();
        syncLightPanelCurrent();
        syncEditorEffects({
          preview: true
        });
      }
    });
    input.addEventListener("change", () => void sendLightCommand(kind, Number(input.value)));
    lightControlsEl.append(root);
    return {
      root,
      input,
      value: output
    };
  }
  const slider = createSlider("色温", "temperature", "2000", "6500");
  const inputCurrent = createSlider("亮度", "brightness", "1", "100");
  const lightPresetsEl = createEl("div", "i3d-light-presets");
  lightPresetsEl.setAttribute("role", "group");
  lightPresetsEl.setAttribute("aria-label", "灯光预设");
  const presetButtons = lightPresets.map(brightness => {
    const type = createEl("button", "i3d-light-preset");
    type.type = "button";
    const detail = createEl("small", "", brightness.brightness + "%");
    type.append(createEl("strong", "", brightness.label), detail);
    type.addEventListener("click", () => void sendLightCommand("preset", brightness));
    lightPresetsEl.append(type);
    return {
      ...brightness,
      button: type,
      detail
    };
  });
  lightControlsEl.append(lightPresetsEl);
  const controlErrorEl = createEl("p", "i3d-control-error");
  controlErrorEl.setAttribute("role", "status");
  const fallback = new Map();
  const root = createClimatePanel({
    onControl: entityIdCurrent => new Promise((resolve, reject) => {
      const modelId = syncIdleAvailability().find(entityId => idleCameraBase(entityId) && entityId.entityId === entityIdCurrent.entityId && entityId.modelAvailable);
      if (!interactive || editing || disposed || preFocusCamera !== "environment" || !modelId?.modelId || modelId.entityId !== entityIdCurrent.entityId || !modelId.modelAvailable) {
        reject(new Error("当前空调不可控制。"));
        return;
      }
      const requestId = "climate-" + ++controlRequestSeq;
      const timeout = setTimeout(() => moveFocusOut(requestId, "请求超时，请检查设备状态。"), 14000);
      fallback.set(requestId, {
        resolve,
        reject,
        timeout
      });
      deviceStatus({
        type: "control",
        requestId,
        command: entityIdCurrent
      });
    })
  });
  function moveFocusOut(root, errorMessage) {
    const timeout = fallback.get(root);
    if (timeout) {
      clearTimeout(timeout.timeout);
      fallback.delete(root);
      if (errorMessage) {
        timeout.reject(new Error(errorMessage));
      } else {
        timeout.resolve();
      }
    }
  }
  const map = new Map();
  const nextDelay = createCoverFeedback();
  const panel = createCoverPanel({
    onPreview: (coverEntityId, coverPreview) => {
      nextDelay.preview(coverEntityId, coverPreview);
      syncCameraInteraction();
      wake();
      return nextDelay.read(coverEntityId);
    },
    onControl: entityId => new Promise((resolve, reject) => {
      const modelId = syncInputHold().find(item => idleCameraBase(item) && item.entityId === entityId.entityId && item.modelAvailable);
      if (!interactive || editing || disposed || preFocusCamera !== "environment" || !modelId?.modelId) {
        reject(new Error("当前窗帘不可控制。"));
        return;
      }
      const requestId = "cover-" + ++controlRequestSeq;
      const timeout = setTimeout(() => camerasEqual(requestId, "请求超时，请检查设备状态。"), 14000);
      syncCurtainLayout();
      nextDelay.begin(entityId, requestId);
      syncCameraInteraction();
      map.set(requestId, {
        resolve: resolve,
        reject: reject,
        timeout: timeout,
        entityId: entityId.entityId
      });
      deviceStatus({
        type: "control",
        requestId: requestId,
        command: entityId
      });
      pruneMarkerElements();
      wake();
    })
  });
  function camerasEqual(requestId, failMessage) {
    const timeout = map.get(requestId);
    if (timeout) {
      clearTimeout(timeout.timeout);
      map.delete(requestId);
      if (failMessage) {
        nextDelay.fail(timeout.entityId, requestId, failMessage);
        syncCameraInteraction();
        syncLightPanelCurrent();
        wake();
        timeout.reject(new Error(failMessage));
      } else {
        timeout.resolve();
      }
    }
  }
  const set = new Map();
  const rootCurrent = createNasPanel();
  const rootNext = createTelevisionPanel({
    onControl: service => new Promise((resolve, reject) => {
      const deviceKind = callback();
      if (!interactive || editing || disposed || preFocusCamera !== "devices" || deviceKind?.deviceKind !== "television" || !deviceKind.modelAvailable || (["turn_on", "turn_off"].includes(service.service) && deviceKind.powerEntityId || deviceKind.entityId) !== service.entityId) {
        reject(new Error("当前电视不可控制。"));
        return;
      }
      const requestId = "television-" + ++controlRequestSeq;
      const timeout = setTimeout(() => enqueueCommand(requestId, "请求超时，请检查设备状态。"), 14000);
      set.set(requestId, {
        resolve: resolve,
        reject: reject,
        timeout: timeout
      });
      deviceStatus({
        type: "control",
        requestId: requestId,
        command: service
      });
    })
  });
  function enqueueCommand(command, previewToken) {
    const requestId = set.get(command);
    if (requestId) {
      clearTimeout(requestId.timeout);
      set.delete(command);
      if (previewToken) {
        requestId.reject(new Error(previewToken));
      } else {
        requestId.resolve();
      }
    }
  }
  lightPanelEl.append(lightPanelHeaderEl, lightControlsEl, controlErrorEl, root.root, panel.root, rootCurrent.root, rootNext.root);
  const curtainMotion = createCurtainMotion({
    THREE,
    requestRender: () => wake()
  });
  let curtainLayoutCache = null;
  let floorIds = [];
  let coverBindings = [];
  function syncCameraInteraction() {
    // cover-feedback owns open/close travel timing. Push its current pose into the
    // 3D rig immediately so cloth motion stays locked to the panel/HA preview.
    for (const entityId of coverBindings) {
      const coverStateValue = nextDelay.read(entityId.entityId, coverState(entityId.entityId, states[entityId.entityId]));
      curtainMotion.setState(entityId.id, coverStateValue, {
        immediate: true
      });
      const classList = rawProperties.get("cover:" + entityId.id);
      if (classList) {
        classList.classList.toggle("is-on", coverIconIsOn(entityId, coverStateValue));
      }
    }
  }
  function syncCurtainLayout() {
    const modelRoot = options.modelRoot;
    const sceneRevision = options.sceneRevision;
    const sceneDocument = options.document;
    if (
      curtainLayoutCache?.config === properties &&
      curtainLayoutCache.states === states &&
      curtainLayoutCache.root === modelRoot &&
      curtainLayoutCache.revision === sceneRevision &&
      curtainLayoutCache.source === sceneDocument
    ) {
      return;
    }
    curtainLayoutCache = {
      config: properties,
      states,
      root: modelRoot,
      revision: sceneRevision,
      source: sceneDocument
    };
    const map = [...syncInputHold(), ...previewCoverBindings()];
    coverBindings = map;
    floorIds = [...new Set(map.map(floorId => floorId.floorId).filter(Boolean))];
    curtainMotion.setBindings(modelRoot, map, sceneRevision);
    nextDelay.retain(map.map(entityId => entityId.entityId));
    for (const entityId of map) {
      nextDelay.sync(entityId.entityId, coverState(entityId.entityId, states[entityId.entityId]));
    }
    syncCameraInteraction();
    options.curtainFrame?.({
      key: curtainMotion.poseKey(),
      structure: curtainMotion.structureKey(),
      floorIds,
      moving: curtainMotion.isMoving() || nextDelay.nextDelay() <= 1000 / 30
    });
  }
  options.setCurtainSync?.(syncCurtainLayout);
  const markersRoot = createNasStatus({
    THREE,
    requestFrame: () => {
      options.requestRender?.();
      wake();
    }
  });
  let rootPrevious;
  function syncNasStatus() {
    const hasHiddenClickable = !viewEditing && !active;
    const concealMarkers = options.modelRoot;
    const revision = options.sceneRevision;
    const sizeScale = activeFloorId === "all" ? 0.75 : 1;
    const brightness = activeFloorId !== "all" && ["devices", "nas", "television"].includes(preFocusCamera) ? 1 : 0.6;
    if (rootPrevious?.root !== concealMarkers || rootPrevious.revision !== revision || rootPrevious.config !== properties || rootPrevious.states !== states || rootPrevious.enabled !== hasHiddenClickable || rootPrevious.sizeScale !== sizeScale || rootPrevious.brightness !== brightness) {
      rootPrevious = {
        root: concealMarkers,
        revision,
        config: properties,
        states,
        enabled: hasHiddenClickable,
        sizeScale,
        brightness
      };
      markersRoot.sync({
        root: concealMarkers,
        revision,
        bindings: clearInputHold(),
        states,
        enabled: hasHiddenClickable,
        sizeScale,
        brightness
      });
    }
  }
  const cameraStatus = createCameraStatus({
    THREE,
    requestFrame: () => options.requestRender?.()
  });
  let securityStatusKey;
  function syncSecurityStatus() {
    const hideClickable = !viewEditing && !active;
    const modelRoot = options.modelRoot;
    const revision = options.sceneRevision;
    const brightness = preFocusCamera === "security" && activeFloorId !== "all" ? 1 : 0.55;
    if (securityStatusKey?.root === modelRoot && securityStatusKey.revision === revision && securityStatusKey.config === properties && securityStatusKey.states === states && securityStatusKey.enabled === hideClickable && securityStatusKey.brightness === brightness) {
      return;
    }
    securityStatusKey = {
      root: modelRoot,
      revision,
      config: properties,
      states,
      enabled: hideClickable,
      brightness
    };
    const bindings = (properties.security?.cameras || []).map(camera => {
      const model = options.document.floors.find(floor => floor.id === camera.floorId)?.scene.items.find(item => item.id === camera.modelId && item.type === "camera");
      return {
        ...camera,
        width: model?.width || 0.2,
        height: model?.height || 0.3,
        depth: model?.depth || 0.2
      };
    });
    cameraStatus.sync({
      root: modelRoot,
      revision,
      bindings,
      states,
      enabled: hideClickable,
      brightness
    });
  }
  const sync = createTelevisionScreens({
    THREE,
    requestFrame: tvReason => {
      options.requestRender?.();
      options.invalidateReflections?.(tvReason);
      wake();
    }
  });
  let rootLocal;
  function syncPresentationChrome() {
    const popupOpacity = options.modelRoot;
    const vignetteStrength = options.sceneRevision;
    const focused = preFocusCamera !== "light" && !viewEditing && !active ? editing ? selectedId : focusedLightId : "";
    if (rootLocal?.root !== popupOpacity || rootLocal.revision !== vignetteStrength || rootLocal.config !== properties || rootLocal.states !== states || rootLocal.focused !== focused || rootLocal.module !== preFocusCamera) {
      rootLocal = {
        root: popupOpacity,
        revision: vignetteStrength,
        config: properties,
        states,
        focused,
        module: preFocusCamera
      };
      sync.sync({
        root: popupOpacity,
        revision: vignetteStrength,
        bindings: startCameraMotion(),
        states,
        focusedModel: "",
        dimStrength: 0
      });
    }
  }
  const isActive = createEnvironmentScene({
    THREE,
    requestFrame: envReason => {
      options.requestRender?.();
      options.invalidateReflections?.(envReason);
      wake();
    }
  });
  options.setEnvironmentScene?.(isActive);
  const setRoot = createEnvironmentAirflow({
    THREE,
    requestFrame: () => {
      options.requestRender?.();
      wake();
    }
  });
  options.setEnvironmentAirflow?.(setRoot);
  const viewHelpEl = createEl("p", "i3d-view-help", "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。");
  viewHelpEl.hidden = true;
  navigationEl.append(moduleTabsEl);
  presentationRootEl.append(markersRootNode, vacuumWorkingLayer, navigationEl, floorTabsEl, moduleEmptyEl, lightPanelEl, viewHelpEl);
  const screenOutlines = createScreenOutlines({
    THREE,
    container: presentationRootEl,
    getCamera: () => options.camera
  });
  navigationEl.append(toolbarEl);
  container.append(focusVignetteEl, presentationRootEl);
  function syncIdleAvailability() {
    return (properties.environment?.airConditioners || []).map(event => {
      const x5 = options.document.floors.find(id => id.id === event.floorId)?.scene.items.find(id => id.id === event.modelId && ["wallac", "floorac", "airoutlet"].includes(id.type));
      return {
        ...event,
        deviceKind: "climate",
        x: Number.isFinite(event.x) ? event.x : x5?.x ?? 0,
        y: Number.isFinite(event.y) ? event.y : x5?.y ?? 0,
        height: Number.isFinite(event.height) ? event.height : x5 ? (Number(x5.elevation) || 0) + (Number(x5.height) || 0.28) / 2 : 0,
        modelAvailable: !!x5,
        icon: event.icon || "mdi:air-conditioner"
      };
    });
  }
  function syncInputHold() {
    return (properties.environment?.curtains || []).map(event => {
      const x7 = options.document.floors.find(floor => floor.id === event.floorId)?.scene.items.find(id => id.id === event.modelId && id.type === "curtain");
      return {
        ...event,
        deviceKind: "cover",
        x: Number.isFinite(event.x) ? event.x : x7?.x ?? 0,
        y: Number.isFinite(event.y) ? event.y : x7?.y ?? 0,
        height: Number.isFinite(event.height) ? event.height : x7 ? (Number(x7.elevation) || 0) + (Number(x7.height) || 2.4) / 2 : 0,
        curtainWidth: Number(x7?.width) || 1.8,
        curtainPosition: x7?.curtainPosition || "split",
        modelAvailable: !!x7,
        icon: event.icon || "mdi:curtains"
      };
    });
  }
  function clearInputHold() {
    return (properties.devices?.nas || []).map(event => {
      const x9 = options.document.floors.find(floor => floor.id === event.floorId)?.scene.items.find(id => id.id === event.modelId && id.type === "nas");
      return {
        ...event,
        clickAction: event.clickAction || "focus",
        deviceKind: "nas",
        x: Number.isFinite(event.x) ? event.x : x9?.x ?? 0,
        y: Number.isFinite(event.y) ? event.y : x9?.y ?? 0,
        height: Number.isFinite(event.height) ? event.height : (Number(x9?.elevation) || 0) + (Number(x9?.height) || 0.34) / 2,
        modelAvailable: !!x9,
        icon: event.icon || "mdi:nas"
      };
    });
  }
  const followRoamBtn = createEl("button", "", "跟随漫游");
  followRoamBtn.type = "button";
  followRoamBtn.hidden = true;
  followRoamBtn.title = "以鸟瞰视角跟随扫地机";
  toolbarEl.append(followRoamBtn);
  function displayLightState(animateOut = true) {
    if (!presets) {
      return;
    }
    const state = controlError;
    presets = "";
    controlError = null;
    viewHelp = null;
    options.reset();
    deviceStatus({
      type: "vacuum-follow-state",
      active: false
    });
    followRoamBtn.textContent = "跟随漫游";
    followRoamBtn.setAttribute("aria-pressed", "false");
    options.endCameraMotion();
    if (animateOut && state) {
      animateCameraTo(state, false, false, () => options.restoreCamera(state), "follow-return");
    }
    pointerToFloorPoint();
    syncIdleAvailabilityCurrent();
  }
  followRoamBtn.addEventListener("click", () => {
    if (presets) {
      displayLightState();
      return;
    }
    if (options.floorTransitionActive || presentedVisible?.owner === "floor") {
      return;
    }
    const find = (properties.devices?.vacuums || []).filter(id => idleCameraBase(id) && hasTracking.hasTracking(id.id));
    const id = find.find(id => "vacuum:" + id.id === focusedLightId) || find.find(vacuumCandidate => vacuumStatusPresentation(vacuumCandidate, states).active) || find[0];
    if (!id) {
      return;
    }
    const target = structuredClone(options.cameraState(true));
    deviceStatus({
      type: "vacuum-follow-state",
      active: true
    });
    deviceStatus({
      type: "vacuum-popup-close"
    });
    clearFocus({
      immediate: true
    });
    presentedVisible = null;
    options.endCameraMotion();
    controlError = target;
    presets = id.id;
    viewHelp = structuredClone(id.followCamera || vacuumBirdCamera(properties.camera || target, options.environmentModelPose(id.floorId, id.modelId)?.center || target.target));
    options.setFocusViewport(0);
    options.beginCameraMotion(viewHelp.mode);
    followRoamBtn.textContent = "退出跟随";
    followRoamBtn.setAttribute("aria-pressed", "true");
    pointerToFloorPoint();
    syncIdleAvailabilityCurrent();
    wake();
  });
  const vacuumFollowCamera = createVacuumFollowCamera(THREE);
  function applyLightStates(applyOptions) {
    if (!presets) {
      return;
    }
    const clone = hasTracking.worldPosition(presets);
    const floorId = (properties.devices?.vacuums || []).find(id => id.id === presets);
    if (!clone || !floorId) {
      displayLightState();
      return;
    }
    const modelCenter = options.environmentModelPose(floorId.floorId, floorId.modelId)?.center;
    const toArray = (modelCenter ? new THREE.Vector3(...modelCenter) : clone.clone()).add(new THREE.Vector3(0, 0.05, 0));
    const position = vacuumFollowPose(viewHelp, toArray.toArray());
    const cameraPosition = new THREE.Vector3(...position.position);
    vacuumFollowCamera.reveal(options, floorId, toArray, cameraPosition);
    options.setFocusViewport(0);
    options.applyCameraPose(position);
  }
  const isDeviceFocusKind = deviceKind => ["nas", "television", "vacuum", "presence", "camera"].includes(deviceKind?.deviceKind);
  const maps = createVacuumMaps(options, () => {
    options.requestRender?.();
    wake();
  });
  const hasTracking = createVacuumMotion(options, wake);
  const hitRects = createPresenceScene(options, wake);
  const presenceWaves = createPresenceWaves(options);
  let presenceSyncKey = null;
  let presenceEditorActive = false;
  let presenceHitTesting = false;
  const presenceHitLayer = createEl("div", "i3d-presence-hit-layer");
  presenceHitLayer.setAttribute("aria-hidden", "true");
  container.append(presenceHitLayer);
  const MathCurrent = new Map();
  function syncLightPanel() {
    if ((!editing || !presenceHitTesting) && !MathCurrent.size) {
      return;
    }
    const map = editing && presenceHitTesting ? hitRects.hitRects(options.camera, canvas, properties.security?.presenceSensors || []) : [];
    const state = new Set(map.map(id => id.id));
    const effectPreviewActive = container.getBoundingClientRect();
    for (const [slider, supported] of MathCurrent) {
      if (!state.has(slider)) {
        supported.remove();
        MathCurrent.delete(slider);
      }
    }
    for (const preset of map) {
      let kelvin = MathCurrent.get(preset.id);
      if (!kelvin) {
        kelvin = createEl("div", "i3d-presence-hit-box");
        MathCurrent.set(preset.id, kelvin);
        presenceHitLayer.append(kelvin);
      }
      Object.assign(kelvin.style, {
        left: preset.left - effectPreviewActive.left - preset.padding + "px",
        top: preset.top - effectPreviewActive.top - preset.padding + "px",
        width: preset.width + preset.padding * 2 + "px",
        height: preset.height + preset.padding * 2 + "px",
        borderRadius: preset.padding + "px"
      });
    }
  }
  function syncMarkers() {
    const lightIds = presented && (!editing || preFocusCamera === "security") && !viewEditing && !active && markerWorldCache && !document.hidden && !options.floorTransitionActive && presentedVisible?.owner !== "floor";
    const every = [properties, states, options.sceneRevision, activeFloorId, lightIds, presenceEditorActive, preFocusCamera];
    if (!presenceSyncKey || !every.every((dep, depIndex) => dep === presenceSyncKey[depIndex])) {
      presenceSyncKey = every;
      hitRects.sync(properties.security?.presenceSensors || [], states, lightIds, activeFloorId, editing, presenceEditorActive, preFocusCamera);
    }
  }
  let vacuumMapSyncKey = null;
  function syncVacuumMap() {
    const vacuumMapActive = presented && !editing && !viewEditing && markerWorldCache && !document.hidden;
    const every = [properties, states, options.sceneRevision, vacuumMapActive];
    if (!vacuumMapSyncKey || !every.every((dep, dep2Index) => dep === vacuumMapSyncKey[dep2Index])) {
      vacuumMapSyncKey = every;
      hasTracking.sync(vacuumBindingsForMap(properties.devices?.vacuums || [], states), states, vacuumMapActive);
    }
  }
  const entryMap = new Map();
  let vacuumMotionSyncKey = null;
  function collectMetadata() {
    const vacuumMotionActive = preFocusCamera === "vacuum" && !viewEditing && !active && !options.floorTransitionActive && presentedVisible?.owner !== "floor" && markerWorldCache && !document.hidden;
    const every = [properties, states, options.sceneRevision, activeFloorId, vacuumMotionActive];
    if (!vacuumMotionSyncKey || !every.every((dep, dep3Index) => dep === vacuumMotionSyncKey[dep3Index])) {
      vacuumMotionSyncKey = every;
      maps.sync(vacuumBindingsForMap(tickCameraMotion(), states), vacuumMotionActive, activeFloorId, states);
    }
  }
  document.addEventListener("visibilitychange", collectMetadata);
  function tickCameraMotion() {
    return (properties.devices?.vacuums || []).map(group => {
      const x11 = options.document.floors.find(floor => floor.id === group.floorId)?.scene.items.find(id => id.id === group.modelId && id.type === "robotvacuum");
      const x12 = !editing && hasTracking.offset(group.id) || {
        x: 0,
        y: 0
      };
      return {
        ...group,
        deviceKind: "vacuum",
        clickAction: group.clickAction || "focus-panel",
        x: (Number.isFinite(group.x) ? group.x : x11?.x ?? 0) + x12.x,
        y: (Number.isFinite(group.y) ? group.y : x11?.y ?? 0) + x12.y,
        height: Number.isFinite(group.height) ? group.height : (Number(x11?.elevation) || 0) + (Number(x11?.height) || 0.85) + 0.25,
        modelAvailable: !!x11,
        icon: group.icon || "mdi:robot-vacuum"
      };
    });
  }
  function vacuumRoomBindings() {
    return tickCameraMotion().filter(entityId => entityId.visible !== false && (editing || entityId.entityId) && (editing || !vacuumStatusPresentation(entityId, states).active && (states[entityId.entityId]?.newState || states[entityId.entityId])?.state !== "paused")).flatMap(id => (id.shortcuts || []).filter(entityId => editing || entityId.entityId).map(item => ({
      ...item,
      id: "vacuum-room:" + id.id + ":" + item.id,
      vacuumId: id.id,
      shortcutId: item.id,
      floorId: id.floorId,
      height: item.height ?? 0.08,
      deviceKind: "vacuum-room",
      modelAvailable: id.modelAvailable,
      icon: item.icon || "mdi:broom",
      size: item.size ?? 44,
      iconSize: item.iconSize ?? 26,
      hitSize: item.hitSize ?? 44
    })));
  }
  function onUserInput(event) {
    if (!editing && interactive && event.deviceKind === "camera" && event.entityId && focusedLightId === event.id && frameLoop !== "edit") {
      deviceStatus({
        type: "camera-popup",
        id: event.id
      });
      return;
    }
    if (!presets && !editing && interactive && event.deviceKind === "vacuum" && event.entityId && (frameLoop === "panel" || event.clickAction !== "focus") && focusedLightId === event.id) {
      deviceStatus({
        type: "vacuum-popup",
        id: event.id
      });
    }
  }
  function startCameraMotion() {
    return (properties.devices?.televisions || []).map(x13 => {
      const x14 = options.document.floors.find(id => id.id === x13.floorId)?.scene.items.find(id => id.id === x13.modelId && id.type === "tv");
      return {
        ...x13,
        clickAction: x13.clickAction || "focus-panel",
        deviceKind: "television",
        x: Number.isFinite(x13.x) ? x13.x : x14?.x ?? 0,
        y: Number.isFinite(x13.y) ? x13.y : x14?.y ?? 0,
        height: Number.isFinite(x13.height) ? x13.height : (Number(x14?.elevation) || 0) + (Number(x14?.height) || 0.92) * 0.62,
        modelAvailable: !!x14,
        icon: x13.icon || "mdi:television"
      };
    });
  }
  function previewCoverBindings() {
    const hadEffectPreview = new Set(syncInputHold().map(floorId => JSON.stringify([floorId.floorId, floorId.modelId])));
    return options.document.floors.flatMap(id => (id.scene?.items || []).filter(type => type.type === "curtain" && !hadEffectPreview.has(JSON.stringify([id.id, type.id]))).map(item => ({
      id: "preview-cover:" + JSON.stringify([id.id, item.id]),
      floorId: id.id,
      modelId: item.id,
      entityId: "",
      deviceKind: "cover",
      curtainWidth: Number(item.width) || 1.8,
      curtainPosition: item.curtainPosition || "split",
      modelAvailable: true,
      previewOnly: true
    })));
  }
  function focusLight() {
    if (idleReturning()) {
      return [];
    } else if (preFocusCamera === "vacuum-shortcut") {
      return vacuumRoomBindings().filter(vacuumId => vacuumId.vacuumId === cameraMotion);
    } else if (preFocusCamera === "nas") {
      return clearInputHold();
    } else if (preFocusCamera === "vacuum") {
      return tickCameraMotion().filter(entityId => editing || entityId.entityId).map(id => ({
        ...id,
        id: editing ? id.id : "vacuum:" + id.id
      }));
    } else if (preFocusCamera === "television") {
      return startCameraMotion();
    } else if (preFocusCamera === "security") {
      return [...cameraBindings(), ...presenceBindings()];
    } else if (preFocusCamera === "devices") {
      return [...clearInputHold(), ...startCameraMotion()].map(deviceKind => ({
        ...deviceKind,
        id: deviceKind.deviceKind + ":" + deviceKind.id
      }));
    } else if (preFocusCamera === "cover") {
      return syncInputHold();
    } else if (preFocusCamera === "climate") {
      return syncIdleAvailability();
    } else {
      return [...syncIdleAvailability(), ...syncInputHold()].map(deviceKind => ({
        ...deviceKind,
        id: deviceKind.deviceKind + ":" + deviceKind.id
      }));
    }
  }
  const visibleBindings = () => {
    let filter = preFocusCamera === "security" ? [...cameraBindings(), ...presenceBindings().filter(binding => editing && binding.modelId)] : preFocusCamera === "light" ? properties.lights || [] : [...focusLight(), ...(preFocusCamera === "vacuum" && !editing ? vacuumRoomBindings() : [])];
    if (!editing && preFocusCamera === "overview") {
      filter = tickCameraMotion().filter(entityId => entityId.entityId && vacuumStatusPresentation(entityId, states).active && vacuumQuip(entityId, states, performance.now())).map(id => ({
        ...id,
        id: "vacuum:" + id.id,
        overviewQuip: true
      }));
    }
    return filter.filter(idleCameraBase);
  };
  function syncPowerButton() {
    navigationEl.hidden = editing || viewEditing || active;
    floorTabsEl.hidden = navigationEl.hidden || options.document.floors.length < 2;
    const brightness = floorNavigationChoices(options.document.floors, properties.floorNumbers);
    const reflectionFloorId = activeFloorId === "all" ? brightness.filter(([floorId]) => floorId !== "all").at(-1)?.[0] || "" : null;
    options.groundReflections?.setOutsideFloor?.(reflectionFloorId);
    options.groundReflections?.setVisibleFloor?.(reflectionFloorId);
    const temperatureRatio = JSON.stringify(brightness);
    if (temperatureRatio !== markerProjectionKey) {
      markerProjectionKey = temperatureRatio;
      floorTabsEl.replaceChildren();
      for (const [floor, floorTabLabel, title] of brightness) {
        const type = createEl("button", "", floorTabLabel);
        type.type = "button";
        type.dataset.floor = floor;
        type.title = title;
        type.setAttribute("aria-label", title);
        type.addEventListener("click", () => updateMarkerPositions(floor));
        floorTabsEl.append(type);
      }
    }
    for (const setAttribute of floorTabsEl.children) {
      setAttribute.setAttribute("aria-pressed", String(setAttribute.dataset.floor === activeFloorId));
    }
  }
  let moduleTabsAnimation = null;
  let moduleTabsHiddenState = null;
  function setModuleTabsHidden(hidden) {
    if (moduleTabsHiddenState === hidden) {
      return;
    }
    const wasInitial = moduleTabsHiddenState === null;
    const computed = !moduleTabsEl.hidden && moduleTabsEl.animate && typeof getComputedStyle === "function" ? getComputedStyle(moduleTabsEl) : null;
    const from = {
      clipPath: moduleTabsEl.hidden ? "inset(0 100% 0 0 round 12px)" : computed?.clipPath && computed.clipPath !== "none" ? computed.clipPath : "inset(0 0% 0 0 round 12px)",
      opacity: moduleTabsEl.hidden ? 0 : Number(computed?.opacity ?? 1),
      transform: moduleTabsEl.hidden ? "translateX(-6px)" : computed?.transform || "none"
    };
    moduleTabsAnimation?.cancel();
    moduleTabsAnimation = null;
    moduleTabsHiddenState = hidden;
    moduleTabsEl.inert = hidden;
    moduleTabsEl.setAttribute("aria-hidden", String(hidden));
    hidden && blurActiveWithin(moduleTabsEl);
    if (wasInitial || !moduleTabsEl.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      moduleTabsEl.hidden = hidden;
      return;
    }
    moduleTabsEl.hidden = false;
    const keyframes = hidden ? [from, {
      clipPath: "inset(0 100% 0 0 round 12px)",
      opacity: 0,
      transform: "translateX(-4px)"
    }] : [from, {
      clipPath: "inset(0 0% 0 0 round 12px)",
      opacity: 1,
      transform: "translateX(2px)",
      offset: 0.8
    }, {
      clipPath: "inset(0 0% 0 0 round 12px)",
      opacity: 1,
      transform: "translateX(0)"
    }];
    const animation = moduleTabsEl.animate(keyframes, {
      duration: hidden ? 380 : 480,
      easing: "cubic-bezier(.2,.7,.2,1)",
      fill: "both"
    });
    moduleTabsAnimation = animation;
    animation.onfinish = () => {
      if (moduleTabsAnimation === animation) {
        moduleTabsAnimation = null;
        moduleTabsEl.hidden = hidden;
        for (const tab of controls.values()) {
          tab.hidden = hidden;
        }
        animation.cancel();
      }
    };
  }
  function updateMarkerPositions(floorSelection) {
    if (editing || viewEditing || active || toolbar || floorSelection === activeFloorId || floorSelection !== "all" && !options.document.floors.some(id => id.id === floorSelection)) {
      return;
    }
    displayLightState(false);
    clearFocus({
      immediate: true,
      preserveCamera: true
    });
    cancelMarkerDrag();
    const containerRect = options.cameraState(true);
    const layoutWidth = options.getOrbitCenter?.();
    const motionState = options.getCameraMotionState?.();
    focusViewport = floorSelection;
    runMarkerTransition(() => {
      activeFloorId = floorSelection;
      const toPivot = options.transitionFloor ? options.transitionFloor(floorSelection) : (options.setFloor(floorSelection), options.getOrbitCenter?.());
      const floorCamera = transformCameraForFloor(focusVignette.floorCameras?.[floorSelection] || (floorSelection === focusVignette.floorSelection ? focusVignette.camera : null), floorSelection);
      const resolvedFloorCamera = floorCamera || options.floorDefaultCamera?.(floorSelection) || options.cameraState();
      baseCameraState = floorCamera || resolvedFloorCamera;
      properties = transformProperties({
        ...focusVignette,
        floorSelection
      });
      properties.camera = baseCameraState;
      if (floorSelection === "all") {
        preFocusCamera = "overview";
        activityVisible = "";
      } else if (activityVisible) {
        preFocusCamera = activityVisible;
        activityVisible = "";
      }
      options.restoreCamera(containerRect, motionState);
      animateCameraTo(resolvedFloorCamera, false, false, () => {
        options.finishFloorTransition?.();
        syncEditorEffects();
        queueOrSendCommand();
        collectMetadata();
        syncMarkerVisibility();
      }, "floor", {
        fromPivot: layoutWidth,
        toPivot
      });
      markersSuppressedByActivity.clear();
      syncEditorEffects({
        immediate: true
      });
      pruneMarkerElements();
      syncChromeInert();
      syncIdleAvailabilityCurrent();
    });
  }
  function openRangeEditor(event) {
    const point = (active, error = "") => deviceStatus({
      type: "range-editor-state",
      active,
      ...(event ? {
        requestId: event
      } : {}),
      ...(error ? {
        error: error
      } : {})
    });
    const rangeEditorBlockReason = markerFloorRef ? options.regionLighting ? presented ? toolbar ? "户型正在同步，请稍候再调整照射范围。" : viewEditing ? "请先完成户型视角调整，再编辑照射范围。" : "" : "户型还在加载，请稍候再调整照射范围。" : "请先选择轻量柔光模式。" : "请在已授权的控件编辑器中调整照射范围。";
    if (rangeEditorBlockReason) {
      point(false, rangeEditorBlockReason);
      return;
    }
    if (active) {
      point(true);
      return;
    }
    clearFocus({
      immediate: true
    });
    active = true;
    markersConcealedAt = true;
    syncIdleAvailabilityCurrent();
    pointerToFloorPoint();
    queueOrSendCommand();
    presentationRootEl.style.display = "none";
    presentationRootEl.setAttribute("inert", "");
    focusVignetteEl.style.display = "none";
    try {
      markerDocRef ||= mountRegionRangeEditor(options, {
        getConfig: () => properties,
        standalone: lightPreview,
        wake,
        onChange(overrides) {
          if (markerFloorRef) {
            properties.lightRegionOverrides = structuredClone(overrides);
            focusVignette.lightRegionOverrides = structuredClone(overrides);
            deviceStatus({
              type: "range-overrides",
              overrides
            });
          }
        },
        onClose() {
          active = false;
          presentationRootEl.style.display = "";
          presentationRootEl.removeAttribute("inert");
          focusVignetteEl.style.display = "";
          syncEditorEffects({
            immediate: true
          });
          pointerToFloorPoint();
          queueOrSendCommand();
          syncChromeInert();
          updateMarkerPositionsCurrent(true);
          syncIdleAvailabilityCurrent();
          if (!markersConcealedAt) {
            deviceStatus({
              type: "range-editor-state",
              active: false
            });
          }
        }
      });
      markerDocRef.open();
      point(true);
    } catch (error) {
      markerDocRef?.close();
      active = false;
      presentationRootEl.style.display = "";
      presentationRootEl.removeAttribute("inert");
      focusVignetteEl.style.display = "";
      pointerToFloorPoint();
      queueOrSendCommand();
      syncIdleAvailabilityCurrent();
      point(false, error.message || "范围编辑暂时不可用");
    } finally {
      markersConcealedAt = false;
    }
  }
  const cameraBindings = () => (properties.security?.cameras || []).map(camera => {
    const model = options.document.floors.find(floor => floor.id === camera.floorId)?.scene.items.find(item => item.id === camera.modelId && item.type === "camera");
    return {
      ...camera,
      buttonHidden: false,
      hiddenClickable: false,
      id: "camera:" + camera.id,
      deviceKind: "camera",
      clickAction: "focus",
      modelAvailable: !!model,
      icon: camera.icon || "mdi:cctv",
      x: Number.isFinite(camera.x) ? camera.x : model?.x ?? 0,
      y: Number.isFinite(camera.y) ? camera.y : model?.y ?? 0,
      height: Number.isFinite(camera.height) ? camera.height : (Number(model?.elevation) || 0) + (Number(model?.height) || 0.3) / 2
    };
  });
  const presenceBindings = () => (properties.security?.presenceSensors || []).map(route => {
    const model = options.document.floors.find(floor => floor.id === route.floorId)?.scene.items.find(item => item.id === route.modelId && item.type === "presence");
    return {
      ...route,
      modelAvailable: route.modelId ? !!model : undefined,
      id: "presence:" + route.id,
      deviceKind: "presence",
      clickAction: "focus",
      icon: "mdi:motion-sensor",
      size: route.modelId ? 36 : route.size,
      x: model?.x ?? route.route?.[0]?.x ?? 0,
      y: model?.y ?? route.route?.[0]?.y ?? 0,
      height: model ? (Number(model.elevation) || 0) + (Number(model.height) || 0.2) / 2 : (route.size ?? 1) * 0.7
    };
  });
  const findBinding = bindingId => visibleBindings().find(id => id.id === bindingId) || cameraBindings().find(id => id.id === bindingId) || presenceBindings().find(id => id.id === bindingId);
  function queueOrSendCommand() {
    configureIdleBehaviors();
    syncMarkers();
    presenceWaves.sync({
      bindings: (properties.security?.presenceSensors || []).filter(sensor => !editing || "presence:" + sensor.id === selectedId).map(sensor => {
        const model = options.document.floors.find(floor => floor.id === sensor.floorId)?.scene.items.find(item => item.id === sensor.modelId);
        return {
          ...sensor,
          width: model?.width,
          height: model?.height,
          depth: model?.depth
        };
      }),
      states,
      floorId: activeFloorId,
      preview: editing,
      enabled: preFocusCamera === "security" && !focusedLightId && !frameLoop && !viewEditing && !active && !options.floorTransitionActive && presentedVisible?.owner !== "floor"
    });
    collectMetadata();
    if (!options.floorTransitionActive && presentedVisible?.owner !== "floor" || presentedVisible?.presentationRevealed) {
      syncCurtainLayout();
      syncNasStatus();
      syncSecurityStatus();
      syncPresentationChrome();
      syncVacuumMap();
      const focusableLights = focusLight().filter(idleCameraBase);
      const filter = (editing ? [...focusableLights, ...(["climate", "devices", "nas", "television", "vacuum"].includes(preFocusCamera) ? [] : previewCoverBindings())] : [...syncIdleAvailability(), ...syncInputHold(), ...clearInputHold(), ...startCameraMotion(), ...tickCameraMotion(), ...cameraBindings(), ...presenceBindings()].map(deviceKind => ({
        ...deviceKind,
        id: ["camera", "presence"].includes(deviceKind.deviceKind) ? deviceKind.id : deviceKind.deviceKind + ":" + deviceKind.id
      })).concat(previewCoverBindings())).filter(modelAvailable => modelAvailable.modelAvailable && idleCameraBase(modelAvailable));
      const enabled = pageDimming(properties, preFocusCamera, !!focusedLightId && frameLoop !== "panel");
      const enabledCurrent = !viewEditing && !active && enabled.enabled;
      const bindings = pageModelBindings(options.document.floors, filter, enabled.page, activeFloorId);
      isActive.setRoot(options.modelRoot, options.environmentRevision ?? options.sceneRevision);
      setRoot.setRoot(options.modelRoot, options.sceneRevision);
      screenOutlines.sync(options.modelRoot, options.environmentRevision ?? options.sceneRevision, bindings.filter(binding => !selectedId || binding.id === selectedId), !focusedLightId && !viewEditing && !active && activeFloorId !== "all" && ["environment", "devices", "vacuum", "security"].includes(enabled.page));
      isActive.setMode({
        enabled: enabledCurrent,
        saturation: enabled.saturation,
        dimStrength: enabledCurrent ? enabled.strength : 0,
        bindings,
        animateBindings: !editing && !viewEditing,
        states,
        focusedId: focusedLightId,
        selectedId: editing ? selectedId : ""
      });
      setRoot.setState({
        enabled: !viewEditing && !active,
        bindings: filter.filter(deviceKind => deviceKind.deviceKind === "climate"),
        states,
        focusedId: focusedLightId,
        overview: !focusedLightId || frameLoop === "panel"
      });
      options.setEnvironmentActive?.(enabledCurrent || isActive.isActive);
    }
    const pending = focusLight().filter(idleCameraBase);
    syncPowerButton();
    const baseCommand = activeFloorId === "all";
    setModuleTabsHidden(editing || viewEditing || active || baseCommand);
    const selectedModule = ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : "environment";
    moduleTabsEl.classList.toggle("is-all-floors", baseCommand);
    moduleTabsEl.style.setProperty("--i3d-tab-count", String(controls.size));
    moduleTabsEl.style.setProperty("--i3d-selected-tab", String(baseCommand ? 0 : [...controls.keys()].indexOf(selectedModule)));
    for (const [moduleId, hidden] of controls) {
      baseCommand && blurActiveWithin(hidden);
      hidden.hidden = moduleTabsEl.hidden;
      hidden.disabled = baseCommand;
      hidden.setAttribute("aria-pressed", String(moduleId === selectedModule));
    }
    moduleEmptyEl.hidden = baseCommand || moduleTabsEl.hidden || !activityVisible && (preFocusCamera === "security" ? [...(properties.security?.presenceSensors || []), ...(properties.security?.cameras || [])].some(idleCameraBase) : preFocusCamera === "overview" || preFocusCamera === "light" || pending.length > 0);
    moduleEmptyEl.textContent = activityVisible ? "请选择楼层，再使用" + (controls.get(activityVisible)?.textContent || "控制") + "。" : preFocusCamera === "security" ? "尚未配置安防相关设备" : preFocusCamera === "vacuum" ? "尚未配置扫地机相关设备" : preFocusCamera === "devices" ? "尚未配置相关设备" : "尚未配置环境相关设备";
  }
  let pendingFloorTransition = null;
  function finishCommand() {
    const pending = pendingFloorTransition;
    pendingFloorTransition = null;
    if (pending) {
      pending.out?.cancel();
      pending.in?.cancel();
      pending.ghost.remove();
      markersRootNode.removeAttribute("inert");
    }
  }
  function runMarkerTransition(event) {
    const style = markersRootNode.animate ? getComputedStyle(markersRootNode) : null;
    const opacity = style ? Number(style.opacity) : 1;
    const transform = style?.transform || "none";
    finishCommand();
    if (!markersRootNode.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      event();
      return;
    }
    const outgoing = visibleBindings().map(binding => ({
      ...binding,
      index: [...markersRootNode.children].indexOf(rawProperties.get(binding.id))
    })).filter(entry => entry.index >= 0);
    const ghost = markersRootNode.cloneNode(true);
    ghost.setAttribute("aria-hidden", "true");
    ghost.setAttribute("inert", "");
    ghost.classList.add("i3d-module-outgoing");
    ghost.style.pointerEvents = "none";
    for (const style of ghost.querySelectorAll("button")) {
      style.style.pointerEvents = "none";
      style.removeAttribute("id");
    }
    markersRootNode.parentNode.append(ghost);
    event();
    markersRootNode.setAttribute("inert", "");
    const out = pendingFloorTransition = {
      ghost,
      outgoing: outgoing.map(entry => ({
        ...entry,
        node: ghost.children[entry.index]
      }))
    };
    out.out = ghost.animate([{
      opacity,
      transform
    }, {
      opacity: 0,
      transform
    }], {
      duration: 240,
      easing: "linear",
      fill: "forwards"
    });
    if (!markersRootNode.classList.contains("is-concealed")) {
      out.in = markersRootNode.animate([{
        opacity: 0
      }, {
        opacity: 1
      }], {
        duration: 240,
        easing: "linear",
        fill: "backwards"
      });
    }
    Promise.all([out.out.finished, out.in?.finished]).then(() => {
      if (pendingFloorTransition === out) {
        ghost.remove();
        pendingFloorTransition = null;
        syncMarkerVisibility();
      }
    }).catch(() => {});
  }
  function selectNavigationModule(event) {
    if (!editing && !viewEditing && !active && !toolbar && !!controls.has(event) && activeFloorId !== "all") {
      activityVisible = "";
      if (event === preFocusCamera) {
        queueOrSendCommand();
        return;
      }
      if (presets) {
        displayLightState();
      }
      clearFocus();
      runMarkerTransition(() => {
        preFocusCamera = event;
        activity.activity();
        visibility.activity();
        exit.activity();
        markersSuppressedByActivity.clear();
        queueOrSendCommand();
        pruneMarkerElements();
      });
    }
  }
  const callback = () => findBinding(focusedLightId);
  const readLightPanelState = lightEntityId => reject.state(lightEntityId, resolveLightEntityState(lightEntityId));
  function applySceneUpdate(scene) {
    const savedScene = readLightPanelState(scene.entityId);
    if (editing && presentationScale?.id === scene.id) {
      savedScene.on = true;
      savedScene.available = true;
      if (presentationScale.kind !== "defaults") {
        savedScene.brightness = presentationScale.kind === "brightnessMin" ? 1 : 100;
      }
      if (presentationScale.kind.startsWith("brightness")) {
        savedScene.brightnessSupported = true;
      }
      if (presentationScale.kind.startsWith("temperature")) {
        savedScene.temperatureSupported = true;
        savedScene.kelvin = presentationScale.kind.endsWith("Min") ? savedScene.minimum : savedScene.maximum;
      }
    }
    return savedScene;
  }
  function syncEditorEffects(kind) {
    const inEditorMode = editing || viewEditing;
    const focusedEditId = inEditorMode && !viewEditing && frameLoop !== "edit" ? presentationScale?.id : null;
    options.setEditorEffects?.(inEditorMode, !!focusedEditId);
    if (!options.floorTransitionActive && presentedVisible?.owner !== "floor" || !!options.floorEffectsFollow) {
      options.setLightStates((properties.lights || []).filter(entityId => entityId.entityId).map(id => {
        const lightRenderPatch = applySceneUpdate(id);
        return {
          ...id,
          ...(editing && presentationScale?.id === id.id ? lightRenderPatch : lightRenderState(lightRenderPatch)),
          ...(inEditorMode && id.id !== focusedEditId ? {
            on: false
          } : {})
        };
      }), inEditorMode ? {
        ...kind,
        editor: true,
        immediate: true
      } : kind);
    }
  }
  function pointerToFloorPoint() {
    if (active || presets) {
      options.setCameraInteraction({
        enabled: false,
        panEnabled: false,
        zoomEnabled: false
      });
      return;
    }
    const origin = {
      ...properties.camera,
      ...resolvePageBehavior(properties, preFocusCamera).interaction
    };
    const rect = viewEditing || frameLoop === "edit" || editing && !frameLoop && !presentedVisible;
    options.setCameraInteraction({
      enabled: !dragState && (rect || interactive && (!frameLoop || frameLoop === "panel") && !presentedVisible && !userHeld),
      rotationMode: rect ? "free" : origin.rotationMode,
      panEnabled: rect,
      zoomEnabled: rect
    });
  }
  const focusPanelInset = () => isDeviceFocusKind(callback()) && callback()?.clickAction === "focus" ? 0 : Math.min(0.7, (lightPanelEl.getBoundingClientRect().width + previewState * 24) / Math.max(container.clientWidth, 1));
  function syncPresentationLayout() {
    const light = container.getBoundingClientRect();
    const pointerPoint = focusedLightBinding?.width || light.width;
    const hostHeight = focusedLightBinding?.height || light.height;
    if (!(pointerPoint > 0) || !(hostHeight > 0) || !(light.width > 0) || !(light.height > 0)) {
      return;
    }
    previewState = light.width / pointerPoint;
    const navTabBudget = (activeFloorId === "all" ? 1 : controls.size) * 50 + 6;
    const navigationSettings = properties.navigation || {};
    const configuredScale = target => Number.isFinite(target?.scale) ? Math.max(0.5, Math.min(2, target.scale)) : 1;
    const navigationScale = Math.min(
      2 * configuredScale(navigationSettings.categories),
      (pointerPoint - 24) / navTabBudget,
      (hostHeight - 24) / (navigationEl.offsetHeight || 36),
    );
    const floorScale = Math.min(
      2 * configuredScale(navigationSettings.floors),
      (hostHeight - 24) / (floorTabsEl.scrollHeight || 240),
      (pointerPoint - 24) / (floorTabsEl.offsetWidth || 80),
    );
    presentationRootEl.style.setProperty("--i3d-navigation-scale", String(navigationScale));
    presentationRootEl.style.setProperty("--i3d-floor-scale", String(floorScale));
    const event = navigationSettings;
    const placeNavElement = (style, navPos, defaultPct, scale, fallbackWidth, fallbackHeight) => {
      const navBaseWidth = (style === navigationEl ? navTabBudget : style.offsetWidth || fallbackWidth) * scale;
      const navBaseHeight = (style.offsetHeight || fallbackHeight) * scale;
      const readNavPct = (axis, fallbackPct) => Number.isFinite(navPos?.[axis]) ? Math.max(0, Math.min(100, navPos[axis])) : fallbackPct;
      const navLeft = Math.max(12 + navBaseWidth / 2, Math.min(pointerPoint - 12 - navBaseWidth / 2, pointerPoint * readNavPct("x", defaultPct[0]) / 100));
      const navTop = Math.max(12 + navBaseHeight / 2, Math.min(hostHeight - 12 - navBaseHeight / 2, hostHeight * readNavPct("y", defaultPct[1]) / 100));
      style.style.left = navLeft + "px";
      style.style.top = navTop + "px";
      return navTop - navBaseHeight / 2;
    };
    const navTopY = placeNavElement(navigationEl, event.categories, [50, 94], navigationScale, 420, 36);
    const followOffset = Number.isFinite(event.followOffset) ? Math.max(0, Math.min(300, event.followOffset)) : 16;
    const toolbarHeight = (toolbarEl.offsetHeight || 30) * navigationScale;
    const toolbarAboveNav = navTopY >= toolbarHeight + 12;
    toolbarEl.style.bottom = toolbarAboveNav ? "calc(100% + " + Math.min(followOffset, navTopY - toolbarHeight - 12) / navigationScale + "px)" : "auto";
    toolbarEl.style.top = toolbarAboveNav ? "auto" : "calc(100% + 8px)";
    placeNavElement(floorTabsEl, event.floors, [96, 50], floorScale, 80, 120);
    const controlTop = Math.max(12, Math.min(hostHeight * 0.56 - 400, hostHeight - 812));
    presentationRootEl.style.setProperty("--i3d-navigation-bottom", Math.max(12, navTopY - navigationScale * 50) + "px");
    lightPanelEl.style.setProperty("--i3d-control-top", controlTop + "px");
    lightPanelEl.style.setProperty("--i3d-control-scale", String(Math.min(2, (pointerPoint - 32) / (lightPanelEl.offsetWidth || 360), Math.max(0.5, (hostHeight - controlTop - 100) / (lightPanelEl.offsetHeight || 400)))));
    Object.assign(presentationRootEl.style, {
      width: pointerPoint + "px",
      height: hostHeight + "px",
      transform: "scale(" + previewState + "," + light.height / hostHeight + ")"
    });
    if (presentedVisible?.focused) {
      presentedVisible.targetInset = focusPanelInset();
    }
    if (frameLoop && frameLoop !== "panel" && !presentedVisible) {
      wakeFrameLoop = focusPanelInset();
      options.setFocusViewport(wakeFrameLoop);
    }
    updateMarkerPositionsCurrent(true);
  }
  function blurActiveWithin(contains, setAttribute = canvas) {
    const blur = document.activeElement;
    if (!!blur && !!contains.contains(blur)) {
      setAttribute.setAttribute("tabindex", "-1");
      setAttribute.focus({
        preventScroll: true
      });
      if (contains.contains(document.activeElement) && setAttribute !== canvas) {
        canvas.setAttribute("tabindex", "-1");
        canvas.focus({
          preventScroll: true
        });
      }
      if (contains.contains(document.activeElement)) {
        blur.blur();
      }
    }
  }
  function syncMarkerVisibility() {
    const floorMarkersHidden = presentedVisible?.owner === "floor" && !presentedVisible.markersRevealed;
    const hasHiddenClickable = !editing && !viewEditing && visibleBindings().some(visible => visible.visible !== false && visible.buttonHidden !== true && visible.hiddenClickable === true);
    const markersConcealed = floorMarkersHidden || restoreViewButton || temperatureSlider || lightHistoryStorage && !hasHiddenClickable || activePointers && focusMode.hideIconsWhileRotating === true || !!frameLoop && !["edit", "panel"].includes(frameLoop);
    for (const [markerId, classList] of rawProperties) {
      const buttonHidden = !editing && findBinding(markerId)?.buttonHidden === true;
      const hiddenClickable = !editing && !viewEditing && !buttonHidden && findBinding(markerId)?.hiddenClickable === true;
      const overviewQuip = findBinding(markerId)?.overviewQuip === true;
      classList.disabled = presentedVisible?.owner === "floor" || buttonHidden || !editing && (idleReturning() || overviewQuip);
      const deviceKind = findBinding(markerId);
      const workingMarker = !editing && (deviceKind?.passiveSensor || deviceKind?.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind, states).active);
      const append = workingMarker ? vacuumWorkingLayer : markersRootNode;
      if (classList.parentElement !== append) {
        append.append(classList);
      }
      const hideMarkerChrome = floorMarkersHidden && workingMarker || !workingMarker && (lightHistoryStorage || temperatureSlider) && !hiddenClickable && !editing && !viewEditing;
      classList.classList.toggle("is-hidden-clickable", hiddenClickable);
      classList.classList.toggle("is-idle-hidden", hideMarkerChrome);
      if (hideMarkerChrome || buttonHidden || !editing && (idleReturning() || overviewQuip)) {
        blurActiveWithin(classList);
        classList.setAttribute("inert", "");
      } else {
        classList.removeAttribute("inert");
      }
      classList.title = hiddenClickable ? "" : classList.getAttribute("aria-label") || "";
    }
    if (markersConcealed) {
      blurActiveWithin(markersRootNode, lightPanelEl.classList.contains("is-open") ? lightPanelEl : canvas);
      markersRootNode.setAttribute("inert", "");
    } else if (pendingFloorTransition) {
      markersRootNode.setAttribute("inert", "");
    } else {
      markersRootNode.removeAttribute("inert");
    }
    markersRootNode.removeAttribute("aria-hidden");
    if (markersConcealed && currentCamera === null) {
      currentCamera = performance.now();
    } else if (!markersConcealed) {
      currentCamera = null;
    }
    markersRootNode.style.transition = floorMarkersHidden ? "none" : "";
    markersRootNode.style.opacity = floorMarkersHidden ? "0" : "";
    markersRootNode.classList.toggle("is-concealed", markersConcealed);
  }
  function syncChromeInert() {
    const inert = !!focusedLightId && !!frameLoop && frameLoop !== "panel";
    for (const classList of [navigationEl, floorTabsEl]) {
      classList.classList.toggle("is-focus-hidden", inert);
      classList.inert = inert;
      classList.setAttribute("aria-hidden", String(inert));
    }
    const popupOpacity = Number.isFinite(properties.popupOpacity) ? Math.max(0, Math.min(100, properties.popupOpacity)) : 74;
    lightPanelEl.style.setProperty("--i3d-panel-opacity", String(popupOpacity / 100));
    const vignetteStrength = Number.isFinite(properties.focusVignetteStrength) ? Math.max(0, Math.min(60, properties.focusVignetteStrength)) : 14;
    focusVignetteEl.style.setProperty("--i3d-vignette-opacity", String(vignetteStrength / 100));
    focusVignetteEl.hidden = viewEditing || frameLoop === "edit" || frameLoop === "panel";
    focusVignetteEl.classList.toggle("is-active", vignetteStrength > 0 && !!focusedLightId && !!frameLoop && !focusVignetteEl.hidden);
    viewHelpEl.hidden = !viewEditing && frameLoop !== "edit" && (!editing || !!frameLoop);
    viewHelpEl.textContent = frameLoop === "edit" ? "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后保存" + (callback()?.deviceKind === "camera" ? "摄像头" : preFocusCamera === "television" ? "电视" : preFocusCamera === "nas" ? "NAS" : preFocusCamera === "cover" ? "窗帘" : preFocusCamera === "climate" ? "空调" : "此灯") + "视角。" : editing && !viewEditing ? "拖动空白处旋转 · 右键平移 · 滚轮缩放。临时查看不改变已保存视角。" : "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。";
    markersRootNode.classList.toggle("is-view-editing", viewEditing || frameLoop === "edit");
    lightPanelEl.classList.toggle("is-preview", editing);
    queueOrSendCommand();
    syncMarkerVisibility();
  }
  function tickPresentedTransition(now) {
    if (!presentedVisible) {
      return;
    }
    const done = presentedVisible;
    const transitionElapsed = Math.max(0, now - presentedVisible.started);
    const transitionEase = presentedVisible.transition.progress(transitionElapsed);
    wakeFrameLoop = presentedVisible.inset + (presentedVisible.targetInset - presentedVisible.inset) * transitionEase;
    const transitionSample = presentedVisible.transition.sample(transitionElapsed);
    if (presentedVisible.owner === "floor") {
      options.advanceFloorTransition?.(transitionEase, transitionSample);
    }
    if (options.applyCameraFrame) {
      options.applyCameraFrame(transitionSample, transitionEase, wakeFrameLoop);
    } else {
      options.applyCameraPose(transitionSample, transitionEase);
      options.setFocusViewport(wakeFrameLoop);
    }
    if (presentedVisible.owner === "floor" && transitionEase >= 0.9 && !presentedVisible.presentationRevealed) {
      presentedVisible.presentationRevealed = true;
      queueOrSendCommand();
    }
    if (presentedVisible.owner === "floor" && transitionEase >= 0.9 && !presentedVisible.markersRevealed) {
      presentedVisible.markersRevealed = true;
      syncMarkerVisibility();
      updateMarkerPositionsCurrent(true);
    }
    if (presentedVisible.transition.settled(transitionElapsed) && presentedVisible === done) {
      presentedVisible = null;
      options.endCameraMotion();
      pointerToFloorPoint();
      done.done?.();
      syncIdleAvailabilityCurrent();
    }
  }
  function normalizeCameraUp(view) {
    if (view && view.view !== "top") {
      return {
        ...view,
        up: [0, 1, 0]
      };
    } else {
      return view;
    }
  }
  function animateCameraTo(cameraPose, focused, immediate = false, done, owner = "focus", motionOptions = null) {
    const mode = owner === "follow-return" ? cameraPose : normalizeCameraUp(cameraPose);
    const from = options.beginCameraMotion(mode.mode, mode);
    if (owner === "floor") {
      options.setFloorSlideCameras?.(from, mode);
    }
    const reducedMotion = immediate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    presentedVisible = {
      from,
      to: structuredClone(mode),
      inset: wakeFrameLoop,
      targetInset: focused ? focusPanelInset() : 0,
      transition: createDampedCameraMotion(THREE, from, mode, {
        immediate: reducedMotion,
        owner,
        floorFrame: motionOptions
      }),
      focused: focused,
      owner,
      started: performance.now(),
      done: done
    };
    syncIdleAvailabilityCurrent();
    pointerToFloorPoint();
    tickPresentedTransition(presentedVisible.started);
    wake();
  }
  function camerasNearlyEqual(mode, modeCurrent) {
    return mode.mode === modeCurrent.mode && Math.abs(mode.zoom - modeCurrent.zoom) < 0.000001 && ["position", "target", "up"].every(vectorKey => (mode[vectorKey] || [0, 1, 0]).every((component, compIndex) => Math.abs(component - (modeCurrent[vectorKey] || [0, 1, 0])[compIndex]) < 0.000001)) && ["frameSize", "focalLength"].every(scalarKey => Math.abs((mode[scalarKey] || 0) - (modeCurrent[scalarKey] || 0)) < 0.000001);
  }
  const activity = createIdleRotation({
    returnToBase(returnBase) {
      activePointers = true;
      activeKeys = structuredClone(focusMode.autoRotate.returnToDefault === true ? normalizeCameraUp(properties.camera || baseCameraState || options.cameraState()) : options.cameraState(true));
      const hadFocusedTarget = !!focusedLightId || !!frameLoop;
      focusedLightId = "";
      frameLoop = "";
      activityTracked = null;
      blurActiveWithin(lightPanelEl);
      lightPanelEl.classList.remove("is-open");
      lightPanelEl.setAttribute("inert", "");
      syncChromeInert();
      if (hadFocusedTarget) {
        deviceStatus({
          type: "focus-state",
          active: false
        });
      }
      options.setOrbitPivot(null);
      if (!presentedVisible && !wakeFrameLoop && camerasNearlyEqual(options.cameraState(), activeKeys)) {
        returnBase();
      } else {
        animateCameraTo(activeKeys, false, false, returnBase, "idle");
      }
    },
    start() {
      userHeld = true;
      options.beginCameraMotion(activeKeys.mode);
      pointerToFloorPoint();
    },
    rotate(yawDelta) {
      options.applyCameraPose(options.orbitCameraPose(activeKeys, yawDelta));
    },
    stop() {
      const wasIdlePresented = presentedVisible?.owner === "idle";
      const wasUserHeld = userHeld;
      userHeld = false;
      activePointers = false;
      temperatureSlider = false;
      hideIconsUntilDeg = 0;
      lightControls = options.camera.quaternion?.toArray?.().join(",") || "";
      syncMarkerVisibility();
      if (wasIdlePresented) {
        presentedVisible = null;
      }
      if (wasIdlePresented || wasUserHeld) {
        options.endCameraMotion();
      }
      pointerToFloorPoint();
    }
  });
  const visibility = createIdleIconVisibility({
    onChange(iconsHidden) {
      lightHistoryStorage = iconsHidden;
      syncMarkerVisibility();
    }
  });
  const exit = createIdleFocusExit({
    onExit: () => clearFocus()
  });
  function configureIdleBehaviors() {
    focusMode = resolvePageBehavior(properties, preFocusCamera);
    activity.configure(focusMode.autoRotate);
    visibility.configure(focusMode.idleHideIcons);
    exit.configure(focusMode.idleExitFocus);
    pointerToFloorPoint();
    if (!focusMode.hideIconsWhileRotating) {
      temperatureSlider = false;
      hideIconsUntilDeg = 0;
    }
  }
  function syncIdleAvailabilityCurrent() {
    const idleIconsAllowed = presented && idleIconsHidden && interactive && !editing && !viewEditing && !active && !document.hidden && !disposed;
    if (!idleIconsAllowed) {
      clearLightPreviewHold();
    }
    activity.setAvailable(idleIconsAllowed && !presets && !focusedLightId && !frameLoop && (!presentedVisible || presentedVisible.owner === "idle"));
    exit.setAvailable(idleIconsAllowed && !!focusedLightId && ["runtime", "panel"].includes(frameLoop) && !presentedVisible);
    visibility.setAvailable(idleIconsAllowed);
    markersById?.setAvailable(!document.hidden && (!pendingCommands || markerWorldCache));
    wake();
  }
  function syncIdleHold() {
    const shouldHoldIdle = lightStateCache || resolveLightState.size > 0 || effectPreview.size > 0;
    activity.hold(shouldHoldIdle);
    visibility.hold(shouldHoldIdle);
    exit.hold(shouldHoldIdle);
    wake();
  }
  function onUserActivityEvent(type) {
    if (presets && type.key === "Escape") {
      displayLightState();
    }
    lightPanelHeader = performance.now();
    restoreViewButton = false;
    syncMarkerVisibility();
    if (type.type === "pointerdown") {
      resolveLightState.add(type.pointerId);
    }
    if (type.type === "pointerup" || type.type === "pointercancel") {
      resolveLightState.delete(type.pointerId);
    }
    if (type.type === "keydown") {
      effectPreview.add(type.code || type.key);
    }
    if (type.type === "keyup") {
      effectPreview.delete(type.code || type.key);
    }
    syncIdleHold();
  }
  const activityEventTypes = ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"];
  for (const activityType of activityEventTypes) {
    window.addEventListener(activityType, onUserActivityEvent, {
      capture: true,
      passive: true
    });
  }
  function clearLightPreviewHold() {
    resolveLightState.clear();
    effectPreview.clear();
    lightStateCache = false;
    syncIdleHold();
  }
  window.addEventListener("blur", clearLightPreviewHold);
  if (document.addEventListener) {
    document.addEventListener("visibilitychange", syncIdleAvailabilityCurrent);
  }
  function clearFocus(immediate = {}) {
    if (callback()?.deviceKind === "vacuum") {
      deviceStatus({
        type: "vacuum-popup-close"
      });
    }
    if (callback()?.deviceKind === "camera") {
      deviceStatus({
        type: "camera-popup-close"
      });
    }
    rootNext.hide();
    if (!focusedLightId && !frameLoop && (!activityTracked || immediate.immediate !== true)) {
      return;
    }
    const hadFocus = !!presentationScale;
    presentationScale = null;
    const wasEditingFocus = !!frameLoop && !!editing;
    focusedLightId = "";
    frameLoop = "";
    blurActiveWithin(lightPanelEl);
    lightPanelEl.classList.remove("is-open");
    lightPanelEl.setAttribute("inert", "");
    syncChromeInert();
    deviceStatus({
      type: "focus-state",
      active: false
    });
    if (immediate.preserveCamera) {
      presentedVisible = null;
      activityTracked = null;
      options.setOrbitPivot(null);
    } else if (activityTracked) {
      animateCameraTo(activityTracked, false, immediate.immediate === true, () => {
        activityTracked = null;
        options.setOrbitPivot(null);
      });
    }
    syncIdleAvailabilityCurrent();
    if (wasEditingFocus) {
      deviceStatus({
        type: "edit",
        action: "focus-exited"
      });
    }
    if (hadFocus) {
      syncEditorEffects();
    }
    pointerToFloorPoint();
  }
  function focusBinding(id, focusSource = "runtime", skipCamera = false) {
    const modelId = findBinding(id);
    if (!modelId || modelId.modelAvailable === false) {
      return;
    }
    if (presentationScale) {
      presentationScale = null;
      syncEditorEffects();
    }
    if (focusedLightId === id && frameLoop === focusSource && focusSource === "runtime") {
      clearFocus();
      return;
    }
    if (["runtime", "panel"].includes(focusSource) && !interactive) {
      return;
    }
    exit.activity();
    if (focusSource === "panel") {
      if (activityTracked || presentedVisible) {
        clearFocus({
          immediate: true
        });
      }
      focusedLightId = id;
      frameLoop = "panel";
      controlErrorEl.textContent = "";
      lightPanelEl.removeAttribute("inert");
      lightPanelEl.classList.add("is-open");
      syncChromeInert();
      syncLightPanelCurrent();
      pointerToFloorPoint();
      syncIdleAvailabilityCurrent();
      deviceStatus({
        type: "focus-state",
        active: false,
        panelOpen: true,
        id: id
      });
      onUserInput(modelId);
      return;
    }
    activityTracked ||= options.cameraState(true);
    const center = modelId.deviceKind === "presence" ? hitRects.anchor(modelId.id.slice(9)) : modelId.modelId ? options.environmentModelPose?.(modelId.floorId, modelId.modelId) : null;
    const focusWorldCenter = center?.center || options.worldPoint(modelId.floorId, modelId.x, modelId.y, modelId.height)?.toArray();
    if (!focusWorldCenter) {
      return;
    }
    focusedLightId = id;
    frameLoop = focusSource;
    controlErrorEl.textContent = "";
    if (!isDeviceFocusKind(modelId) || modelId.clickAction !== "focus") {
      lightPanelEl.removeAttribute("inert");
      lightPanelEl.classList.add("is-open");
    } else {
      lightPanelEl.setAttribute("inert", "");
      lightPanelEl.classList.remove("is-open");
    }
    options.setOrbitPivot(null);
    syncChromeInert();
    syncLightPanelCurrent();
    const overviewCamera = properties.camera || baseCameraState || activityTracked;
    const bindingFocusCamera = modelId.focusCamera || (modelId.modelId ? automaticAirConditionerCamera(THREE, {
      ...overviewCamera,
      viewportAspect: canvas.clientWidth / Math.max(1, canvas.clientHeight)
    }, focusWorldCenter, center?.forward, center?.size, modelId.deviceKind === "nas" ? {
      minimumFrameSize: 0.7,
      minimumDistance: 0.6
    } : {}) : automaticLightCamera(THREE, overviewCamera, focusWorldCenter));
    animateCameraTo(bindingFocusCamera, true, skipCamera, () => onUserInput(modelId));
    if (!editing) {
      deviceStatus({
        type: "focus-state",
        active: true,
        id: id
      });
    }
  }
  restoreViewBtn.addEventListener("click", () => {
    if (frameLoop || activityTracked || presentedVisible) {
      clearFocus();
    } else {
      options.restoreCamera(normalizeCameraUp(properties.camera || baseCameraState));
    }
  });
  powerButtonEl.addEventListener("click", () => {
    const entityId = callback();
    if (entityId) {
      sendLightCommand("power", !readLightPanelState(entityId.entityId).on);
    }
  });
  function effectColorCss(on2) {
    const effectBrightness = Number.isFinite(on2.effectColor) ? Math.max(0, Math.min(100, Number(on2.brightness) || 0)) : Math.max(1, Math.min(100, Number(on2.brightness) || (on2.brightnessSupported ? 1 : 100)));
    const kelvinT = (Math.max(2000, Math.min(6500, Number(on2.kelvin) || 3000)) - 2000) / 4500;
    const map = [255, 132, 42];
    const coolRgb = [172, 225, 255];
    const join = map.map((channel, channelIndex) => Math.round(channel + (coolRgb[channelIndex] - channel) * kelvinT));
    powerButtonEl.classList.toggle("is-on", on2.on);
    powerButtonEl.setAttribute("aria-pressed", String(on2.on));
    powerButtonEl.setAttribute("aria-label", "" + (callback()?.label || on2.name) + (on2.available ? on2.on ? "已开启，点击关闭" : "已关闭，点击开启" : "当前不可用"));
    powerButtonEl.style.setProperty("--i3d-lamp-color", Number.isFinite(on2.effectColor) ? "#" + on2.effectColor.toString(16).padStart(6, "0") : "rgb(" + join.join(",") + ")");
    powerButtonEl.style.setProperty("--i3d-lamp-opacity", on2.on && effectBrightness > 0 ? String(0.08 + effectBrightness / 100 * 0.92) : "0");
    powerButtonEl.style.setProperty("--i3d-lamp-scale", String(0.62 + effectBrightness / 100 * 1.05));
  }
  function syncLightPanelCurrent() {
    const entityId = callback();
    if (["vacuum", "presence", "camera"].includes(entityId?.deviceKind)) {
      lightPanelEl.classList.remove("is-open");
      lightPanelEl.setAttribute("inert", "");
      return;
    }
    const isNas = entityId?.deviceKind === "nas";
    const isTelevision = entityId?.deviceKind === "television";
    if (!isTelevision || !lightPanelEl.classList.contains("is-open")) {
      rootNext.hide();
    } else {
      rootNext.root.hidden = false;
    }
    rootCurrent.root.hidden = !isNas;
    lightPanelEl.classList.toggle("is-nas-panel", isNas);
    lightPanelEl.classList.toggle("is-television-panel", isTelevision);
    if (isNas || isTelevision) {
      lightPanelEl.classList.remove("is-cover-panel", "is-climate-panel", "has-light-controls", "has-error");
      lightPanelEl.setAttribute("aria-label", isTelevision ? "电视状态" : "NAS 状态");
      if (entityId.clickAction === "focus") {
        lightPanelEl.classList.remove("is-open");
        lightPanelEl.setAttribute("inert", "");
      }
      root.root.hidden = panel.root.hidden = lightPanelHeaderEl.hidden = lightControlsEl.hidden = controlErrorEl.hidden = true;
      if (isTelevision) {
        if (entityId.clickAction !== "focus" && lightPanelEl.classList.contains("is-open")) {
          rootNext.update({
            item: entityId,
            states,
            editing: editing || !interactive
          });
        }
      } else {
        rootCurrent.update({
          item: entityId,
          states
        });
      }
      return;
    }
    const isCover = entityId?.deviceKind === "cover";
    const isClimateModel = !!entityId?.modelId && !isCover;
    root.root.hidden = !isClimateModel;
    panel.root.hidden = !isCover;
    lightPanelHeaderEl.hidden = lightControlsEl.hidden = controlErrorEl.hidden = isClimateModel || isCover;
    lightPanelEl.classList.toggle("is-cover-panel", isCover);
    lightPanelEl.classList.toggle("is-climate-panel", isClimateModel);
    lightPanelEl.setAttribute("aria-label", isCover ? "窗帘控制" : isClimateModel ? "空调控制" : "灯光控制");
    if (!entityId) {
      return clearFocus();
    }
    if (isCover) {
      lightPanelEl.classList.remove("has-light-controls", "has-error");
      const available = coverState(entityId.entityId, states[entityId.entityId]);
      if (!entityId.modelAvailable) {
        available.available = false;
      }
      const presentation = nextDelay.read(entityId.entityId, available);
      panel.update({
        item: entityId,
        state: available,
        presentation,
        editing,
        error: entityId.modelAvailable ? presentation.error || "" : "窗帘模型已移除，请重新配置。"
      });
      return;
    }
    if (isClimateModel) {
      lightPanelEl.classList.remove("has-light-controls", "has-error");
      const available = climateState(entityId.entityId, states[entityId.entityId]);
      if (!entityId.modelAvailable) {
        available.available = false;
      }
      root.update({
        item: entityId,
        state: available,
        editing,
        error: entityId.modelAvailable ? "" : "空调模型已移除，请重新配置。"
      });
      return;
    }
    let available3 = applySceneUpdate(entityId);
    const isEditingThis = editing && presentationScale?.id === entityId.id;
    let min = 1;
    let max = 100;
    if (isEditingThis) {
      const editLightSnapshot = {
        ...entityId,
        ...available3
      };
      const kelvin = options.mapLightEffectState(editLightSnapshot);
      const brightness = options.mapLightEffectState({
        ...editLightSnapshot,
        brightness: 1,
        kelvin: available3.minimum
      });
      const state = options.mapLightEffectState({
        ...editLightSnapshot,
        brightness: 100,
        kelvin: available3.maximum
      });
      min = brightness.brightness;
      max = state.brightness;
      available3 = {
        ...available3,
        brightness: Number.isFinite(kelvin.brightness) ? Math.round(kelvin.brightness) : kelvin.brightness,
        kelvin: Number.isFinite(kelvin.kelvin) ? Math.round(kelvin.kelvin) : kelvin.kelvin,
        minimum: brightness.kelvin,
        maximum: state.kelvin,
        effectColor: options.lightEffectColorHex(kelvin.kelvin)
      };
    }
    lightHeadingText.textContent = entityId.label || available3.name;
    powerButton.textContent = isEditingThis ? "效果预览" : entityId.entityId ? available3.available ? available3.on ? "已开启" : "已关闭" : "设备不可用" : "尚未绑定设备";
    lightHeadingText.title = lightHeadingText.textContent;
    controlErrorEl.title = controlErrorEl.textContent;
    effectColorCss(available3);
    powerButton.classList.toggle("is-on", available3.available && available3.on);
    const controlBusy = [...sceneUpdating.values()].some(item => item.entityId === entityId.entityId);
    lightPanelEl.classList.toggle("is-command-pending", controlBusy && available3.available && !editing);
    lightPanelEl.setAttribute("aria-busy", String(controlBusy));
    const showEffectPreview = available3.available && available3.on && (available3.brightnessSupported || available3.temperatureSupported);
    lightPanelEl.classList.toggle("has-light-controls", showEffectPreview);
    lightPanelEl.classList.toggle("has-error", !!controlErrorEl.textContent);
    if (showEffectPreview) {
      lightControlsEl.removeAttribute("inert");
    } else {
      blurActiveWithin(lightControlsEl, lightPanelEl);
      lightControlsEl.setAttribute("inert", "");
    }
    lightControlsEl.removeAttribute("aria-hidden");
    powerButtonEl.disabled = editing || !available3.available;
    inputCurrent.input.min = min;
    inputCurrent.input.max = max;
    slider.input.min = available3.minimum;
    slider.input.max = available3.maximum;
    for (const [input, sliderSupported, sliderValue, sliderSuffix] of [[inputCurrent, available3.brightnessSupported, available3.brightness, "%"], [slider, available3.temperatureSupported, available3.kelvin, " K"]]) {
      input.root.hidden = !sliderSupported;
      input.input.disabled = editing || !available3.available || !available3.on;
      if (document.activeElement !== input.input) {
        input.input.value = sliderValue ?? (input === inputCurrent ? 100 : available3.minimum);
        input.value.value = sliderValue === null ? "—" : "" + sliderValue + sliderSuffix;
      }
    }
    lightPresetsEl.hidden = !available3.brightnessSupported && !available3.temperatureSupported;
    for (const button of presetButtons) {
      const presetKelvin = Math.round(available3.minimum + (available3.maximum - available3.minimum) * button.temperaturePercent / 100);
      const presetMatches = !isEditingThis && available3.on && (!available3.brightnessSupported || Math.abs(available3.brightness - button.brightness) <= 4) && (!available3.temperatureSupported || Math.abs(available3.kelvin - presetKelvin) <= Math.max(50, (available3.maximum - available3.minimum) * 0.06));
      button.button.disabled = editing || !available3.available || !available3.on || lightPresetsEl.hidden;
      button.button.classList.toggle("is-active", presetMatches);
      button.button.setAttribute("aria-pressed", String(presetMatches));
      button.detail.textContent = available3.brightnessSupported ? button.brightness + "%" : "开启";
    }
  }
  function queueControlCommand(command, previewToken) {
    const requestId = String(++controlRequestSeq);
    const entityId = command.entityId;
    reject.retain(entityId, previewToken);
    const timeout = setTimeout(() => finishControlRequest(requestId, "请求超时，请检查设备状态。", true), 14000);
    sceneUpdating.set(requestId, {
      entityId: entityId,
      command,
      previewToken,
      timeout: timeout,
      next: null
    });
    deviceStatus({
      type: "control",
      requestId: requestId,
      command
    });
  }
  function handleControlResult(value, previewToken) {
    const next = [...sceneUpdating.values()].find(entityId => entityId.entityId === value.entityId);
    if (!next) {
      return queueControlCommand(value, previewToken);
    }
    const service = next.next?.command || next.command;
    if (service.service === "turn_on" && value.service === "turn_on") {
      const brightness = {
        ...service.data
      };
      if ("brightness" in value.data || "brightness_pct" in value.data) {
        delete brightness.brightness;
        delete brightness.brightness_pct;
      }
      value = {
        ...value,
        data: {
          ...brightness,
          ...value.data
        }
      };
    }
    next.next = {
      command: value,
      previewToken: previewToken
    };
    reject.hold(value.entityId, previewToken);
  }
  function finishControlRequest(controlRequestId, resultError = "", timedOut = false) {
    const entityId = sceneUpdating.get(controlRequestId);
    if (!entityId) {
      return;
    }
    clearTimeout(entityId.timeout);
    sceneUpdating.delete(controlRequestId);
    const previewToken = entityId.next;
    const shouldRetainPreview = previewToken && !timedOut && !disposed && !editing && interactive && preFocusCamera === "light" && activeFloorId !== "all" && (properties.lights || []).some(item => idleCameraBase(item) && item.entityId === entityId.entityId) && resolveLightEntityState(entityId.entityId).available;
    if (resultError) {
      reject.reject(entityId.entityId, entityId.previewToken);
    } else {
      reject.acknowledge(entityId.entityId, entityId.previewToken);
    }
    if (shouldRetainPreview) {
      queueControlCommand(previewToken.command, previewToken.previewToken);
    } else if (previewToken) {
      reject.reject(entityId.entityId, previewToken.previewToken);
    }
    if (callback()?.entityId === entityId.entityId) {
      controlErrorEl.textContent = shouldRetainPreview ? "" : resultError;
    }
    pruneMarkerElements();
  }
  async function sendLightCommand(commandName, brightness, entityId = callback()) {
    if (!!entityId && !editing && !disposed) {
      try {
        const brightnessSupported = resolveLightEntityState(entityId.entityId);
        let value;
        let kelvin = brightness;
        if (commandName === "preset") {
          if (!lightPresets.includes(brightness)) {
            throw new Error("灯光预设无效。");
          }
          const push = [];
          kelvin = {};
          if (brightnessSupported.brightnessSupported) {
            push.push(["brightness", brightness.brightness]);
            kelvin.brightness = brightness.brightness;
          }
          if (brightnessSupported.temperatureSupported) {
            kelvin.kelvin = Math.round(brightnessSupported.minimum + (brightnessSupported.maximum - brightnessSupported.minimum) * brightness.temperaturePercent / 100);
            push.push(["temperature", kelvin.kelvin]);
          }
          if (!push.length) {
            throw new Error("此设备不支持灯光预设。");
          }
          const map = push.map(([presetKey, presetValue]) => lightCommand(entityId.entityId, presetKey, presetValue, brightnessSupported));
          value = {
            ...map[0],
            data: Object.assign({}, ...map.map(data => data.data))
          };
          if (brightnessSupported.brightnessSupported && brightness.brightness < 100) {
            delete value.data.brightness;
            value.data.brightness_pct = brightness.brightness;
          }
        } else {
          value = lightCommand(entityId.entityId, commandName, brightness, brightnessSupported);
        }
        const commandPreview = reject.set(entityId.entityId, commandName, kelvin, true);
        syncEditorEffects({
          preview: commandName !== "power"
        });
        handleControlResult(value, commandPreview);
        controlErrorEl.textContent = "";
        pruneMarkerElements();
      } catch (error) {
        controlErrorEl.textContent = error.message;
        syncLightPanelCurrent();
      }
    }
  }
  function activateBinding(id, fromMarker = false) {
    if (!editing && (idleReturning() || activeFloorId === "all")) {
      return;
    }
    const entityId = findBinding(id);
    if (!entityId || entityId.modelAvailable === false || !editing && (entityId.overviewQuip || entityId.passiveSensor) || presets && !editing) {
      return;
    }
    const clickAction = entityId.clickAction || "focus";
    if (editing) {
      selectedId = id;
      deviceStatus({
        type: "edit",
        action: "select",
        id: id
      });
      pruneMarkerElements();
      return;
    }
    if (entityId.deviceKind === "camera") {
      interactive && entityId.entityId && focusBinding(id);
      return;
    }
    if (entityId.deviceKind === "vacuum-room") {
      if (!interactive || !entityId.entityId || entryMap.has(id)) {
        return;
      }
      const focusTimeout = setTimeout(() => {
        entryMap.delete(id);
        const disabled = rawProperties.get(id);
        if (disabled) {
          disabled.disabled = false;
          disabled.title = "请求超时，请检查设备状态";
        }
      }, 14000);
      entryMap.set(id, focusTimeout);
      if (rawProperties.get(id)) {
        rawProperties.get(id).disabled = true;
      }
      deviceStatus({
        type: "vacuum-room",
        id: id,
        vacuumId: entityId.vacuumId,
        shortcutId: entityId.shortcutId
      });
      return;
    }
    if (isDeviceFocusKind(entityId)) {
      const openVacuumPopup = fromMarker && entityId.deviceKind === "vacuum" && vacuumStatusPresentation(entityId, states).active;
      focusBinding(id, openVacuumPopup || entityId.clickAction === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId.deviceKind === "cover") {
      focusBinding(id, clickAction === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId.modelId) {
      if (clickAction === "turn-on") {
        root.update({
          item: entityId,
          state: climateState(entityId.entityId, states[entityId.entityId]),
          editing
        });
        root.power?.({
          toggle: true
        });
        return;
      }
      focusBinding(id, clickAction === "turn-on-panel" ? "panel" : "runtime");
      if (clickAction !== "focus" && focusedLightId === id) {
        root.power?.({
          toggle: false
        });
      }
      return;
    }
    const available = readLightPanelState(entityId.entityId);
    if (clickAction === "turn-on") {
      if (available.available) {
        sendLightCommand("power", !available.on, entityId);
      }
      return;
    }
    if (clickAction === "turn-on-panel") {
      focusBinding(id, "panel");
      if (available.available && !available.on) {
        sendLightCommand("power", true, entityId);
      }
      return;
    }
    focusBinding(id);
    if (focusedLightId === id && frameLoop === "runtime" && clickAction === "turn-on-focus" && available.available && !available.on) {
      sendLightCommand("power", true);
    }
  }
  let lastMarkerLayoutKey = "";
  function updateMarkerPositionsCurrent(forceLayout = false) {
    if (active || toolbar || disposed) {
      return;
    }
    if (options.floorTransitionActive || presentedVisible) {
      screenOutlines.pause();
    }
    screenOutlines.update();
    if (currentCamera !== null && performance.now() - currentCamera >= 240 && !visibleBindings().some(deviceKind => deviceKind.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind, states).active)) {
      lastMarkerLayoutKey = "";
      return;
    }
    options.camera.updateMatrixWorld();
    if (lastUserActivityAt !== options.document || transformCamera !== activeFloorId) {
      markersSuppressedByActivity.clear();
      lastUserActivityAt = options.document;
      transformCamera = activeFloorId;
    }
    const width = focusedLightBinding || container.getBoundingClientRect();
    const layoutWidth = focusedLightBinding?.width || width.width;
    const layoutHeight = focusedLightBinding?.height || width.height;
    if (pendingFloorTransition && options.presentationPoint) {
      for (const entry of pendingFloorTransition.outgoing) {
        if (!entry.node) {
          continue;
        }
        const point = options.presentationPoint(entry.floorId, entry.x, entry.y, entry.height);
        if (!point) {
          entry.node.hidden = true;
          continue;
        }
        const projected = point.project(options.camera);
        entry.node.hidden = projected.z < -1 || projected.z > 1 || Math.abs(projected.x) > 1.05 || Math.abs(projected.y) > 1.05;
        entry.node.style.left = (projected.x + 1) * layoutWidth / 2 + "px";
        entry.node.style.top = (1 - projected.y) * layoutHeight / 2 + "px";
      }
    }
    const layoutKey = layoutWidth + ":" + layoutHeight + ":" + options.camera.matrixWorld.elements + ":" + options.camera.projectionMatrix.elements;
    if (forceLayout === true || layoutKey !== lastMarkerLayoutKey) {
      lastMarkerLayoutKey = layoutKey;
      for (const id of visibleBindings()) {
        const floorId = dragState?.id === id.id ? {
          ...id,
          ...dragState.point
        } : id;
        const bindingIdNode = floorId.id;
        const hidden = rawProperties.get(bindingIdNode);
        if (!hidden) {
          continue;
        }
        const markerVisible = (editing || floorId.visible !== false) && (editing || floorId.buttonHidden !== true) && floorId.modelAvailable !== false && (activeFloorId === "all" || floorId.floorId === activeFloorId);
        let point = markersSuppressedByActivity.get(bindingIdNode);
        if (markerVisible && (!point || point.floorId !== floorId.floorId || point.x !== floorId.x || point.y !== floorId.y || point.height !== floorId.height)) {
          point = {
            floorId: floorId.floorId,
            x: floorId.x,
            y: floorId.y,
            height: floorId.height,
            point: options.worldPoint(floorId.floorId, floorId.x, floorId.y, floorId.height)
          };
          markersSuppressedByActivity.set(bindingIdNode, point);
        }
        const hasScreenPoint = markerVisible && (options.floorTransitionActive && options.presentationPoint ? options.presentationPoint(floorId.floorId, floorId.x, floorId.y, floorId.height) : point?.point);
        if (!hasScreenPoint) {
          hidden.hidden = true;
          continue;
        }
        const z3 = deferredMessage.copy(hasScreenPoint).project(options.camera);
        hidden.hidden = z3.z < -1 || z3.z > 1 || Math.abs(z3.x) > 1.05 || Math.abs(z3.y) > 1.05;
        hidden.style.left = (z3.x + 1) * layoutWidth / 2 + "px";
        hidden.style.top = (1 - z3.y) * layoutHeight / 2 + "px";
      }
    }
  }
  function pruneMarkerElements() {
    if (toolbar) {
      return;
    }
    wake();
    const has = new Set(visibleBindings().map(id => id.id));
    for (const [markerEntryId, remove] of rawProperties) {
      if (!has.has(markerEntryId)) {
        remove.remove();
        rawProperties.delete(markerEntryId);
        markersSuppressedByActivity.delete(markerEntryId);
      }
    }
    for (const deviceKind of visibleBindings()) {
      let classList = rawProperties.get(deviceKind.id);
      if (!classList) {
        classList = createEl(deviceKind.passiveSensor ? "div" : "button", "i3d-marker");
        classList.type = "button";
        classList.addEventListener("click", stopPropagation => {
          stopPropagation.stopPropagation();
          if (!deviceKind.passiveSensor && !toolbar && !viewEditing && frameLoop !== "edit" && (!!editing || findBinding(deviceKind.id)?.buttonHidden !== true)) {
            if (classList.dataset.dragged === "true") {
              classList.dataset.dragged = "";
              return;
            }
            activateBinding(deviceKind.id, true);
          }
        });
        classList.addEventListener("pointerdown", pointerEvent => onMarkerPointerDown(pointerEvent, deviceKind.id));
        classList.addEventListener("pointermove", onMarkerPointerMove);
        classList.addEventListener("pointerup", onMarkerPointerUp);
        classList.addEventListener("pointercancel", cancelMarkerDrag);
        markersRootNode.append(classList);
        rawProperties.set(deviceKind.id, classList);
      }
      const slice = /^mdi:[a-z0-9-]+$/.test(deviceKind.icon || "") ? deviceKind.icon : "";
      const isVacuumMarker = deviceKind.deviceKind === "vacuum";
      const isVacuumRoomMarker = deviceKind.deviceKind === "vacuum-room";
      if (!isVacuumMarker && classList.dataset.icon !== slice) {
        classList.dataset.icon = slice;
        if (slice) {
          const style = createEl("span", "i3d-marker-icon");
          style.setAttribute("aria-hidden", "true");
          style.style.maskImage = "url(\"/bridge-static/vendor/mdi/7.4.47/svg/" + slice.slice(4) + ".svg\")";
          style.style.webkitMaskImage = style.style.maskImage;
          classList.replaceChildren(style);
        } else {
          classList.innerHTML = defaultMarkerSvg;
        }
      }
      const on = deviceKind.deviceKind?.startsWith("vacuum") ? {
        available: !!states[deviceKind.entityId] && !["unknown", "unavailable"].includes(states[deviceKind.entityId].state),
        on: states[deviceKind.entityId]?.state === "cleaning"
      } : deviceKind.deviceKind === "television" ? televisionState(deviceKind, states) : deviceKind.deviceKind === "nas" ? nasDeviceState(deviceKind, states) : deviceKind.deviceKind === "cover" ? coverState(deviceKind.entityId, states[deviceKind.entityId]) : deviceKind.modelId ? climateState(deviceKind.entityId, states[deviceKind.entityId]) : readLightPanelState(deviceKind.entityId);
      const markerSize = Number.isFinite(deviceKind.size) && deviceKind.size > 0 ? deviceKind.size : 44;
      const iconSizeNode = Number.isFinite(deviceKind.iconSize) && deviceKind.iconSize > 0 ? deviceKind.iconSize : isVacuumMarker ? 26 : Math.min(markerSize, Math.max(4, markerSize - 18));
      const hitSizeNode = Number.isFinite(deviceKind.hitSize) && deviceKind.hitSize > 0 ? deviceKind.hitSize : Math.max(44, markerSize);
      classList.style.width = classList.style.height = hitSizeNode + "px";
      classList.classList.toggle("is-vacuum-status", isVacuumMarker);
      classList.classList.toggle("is-overview-quip", deviceKind.overviewQuip === true);
      classList.classList.toggle("is-presence-wave", deviceKind.passiveSensor === true);
      classList.classList.toggle("is-security-label", deviceKind.deviceKind === "camera" || deviceKind.deviceKind === "presence" && editing);
      if (isVacuumMarker) {
        let querySelector = classList.querySelector(".i3d-vacuum-status");
        if (!querySelector || querySelector.dataset.compact !== String(deviceKind.overviewQuip === true)) {
          querySelector = createEl("span", "i3d-vacuum-status");
          querySelector.dataset.compact = String(deviceKind.overviewQuip === true);
          if (!deviceKind.overviewQuip) {
            querySelector.append(createEl("strong", "i3d-vacuum-status-name"), createEl("span", "i3d-vacuum-status-detail"));
            querySelector.lastElementChild.append(createEl("span", "i3d-vacuum-status-text"), createEl("span", "i3d-vacuum-status-battery"));
          }
          querySelector.append(createEl("span", "i3d-vacuum-quip"));
          if (deviceKind.overviewQuip) {
            Object.assign(querySelector.style, {
              opacity: ".55",
              pointerEvents: "none",
              background: "none",
              border: "none",
              boxShadow: "none",
              backdropFilter: "none",
              webkitBackdropFilter: "none"
            });
            querySelector.lastElementChild.style.pointerEvents = "none";
          }
          classList.replaceChildren(querySelector);
        }
        const status = vacuumStatusPresentation(deviceKind, states);
        const markerScale = markerSize / 44;
        if (!deviceKind.overviewQuip) {
          querySelector.querySelector(".i3d-vacuum-status-name").textContent = deviceKind.label || "扫地机器人";
          querySelector.querySelector(".i3d-vacuum-status-text").textContent = status.status;
          querySelector.querySelector(".i3d-vacuum-status-battery").textContent = status.battery;
        }
        const textContent = querySelector.querySelector(".i3d-vacuum-quip");
        textContent.textContent = status.active ? vacuumQuip(deviceKind, states, performance.now()) : "";
        textContent.hidden = !textContent.textContent;
        querySelector.style.transform = "translate(-50%,-50%) scale(" + markerScale + ")";
        querySelector.style.fontSize = Math.max(8, iconSizeNode / 2) + "px";
        const hitPadding = Math.max(deviceKind.overviewQuip ? 28 : 50, querySelector.offsetHeight);
        classList.style.width = Math.max(hitSizeNode, markerScale * 140) + "px";
        classList.style.height = Math.max(hitSizeNode, hitPadding * markerScale) + "px";
        classList.dataset.status = status.status;
        classList.title = (deviceKind.label || "扫地机器人") + " · " + status.status + " · " + status.battery;
        on.on = status.active;
        on.available = status.available;
      }
      if (deviceKind.deviceKind === "camera" || deviceKind.deviceKind === "presence") {
        const securityState = states[deviceKind.entityId]?.newState || states[deviceKind.entityId];
        const available = deviceKind.deviceKind === "camera" ? cameraOnline(securityState) : securityState?.available !== false && !!securityState?.state && !["unknown", "unavailable"].includes(securityState.state);
        on.available = available;
        on.on = deviceKind.deviceKind === "camera" ? securityState?.state === "recording" : securityState?.state === "on";
        if (deviceKind.passiveSensor) {
          classList.querySelector(".i3d-sensor-wave") || classList.replaceChildren(...[0, 1, 2].map(() => createEl("span", "i3d-sensor-wave")));
          classList.hidden = !available;
          classList.setAttribute("aria-hidden", "true");
          classList.classList.toggle("is-inactive", !available);
        } else {
          const isSensorChoice = deviceKind.deviceKind === "presence" && editing;
          classList.classList.toggle("is-sensor-choice", isSensorChoice);
          let securityLabel = classList.querySelector(".i3d-security-label");
          securityLabel || (securityLabel = createEl("span", "i3d-security-label"), securityLabel.append(createEl("strong"), createEl("span")), classList.append(securityLabel));
          securityLabel.children[0].textContent = deviceKind.label || (deviceKind.deviceKind === "camera" ? "摄像头" : "人体传感器");
          securityLabel.children[1].textContent = editing && !deviceKind.entityId ? "未绑定实体" : available ? deviceKind.deviceKind === "presence" ? securityState.state === "on" ? "有人" : "检测中" : "在线" : "离线";
          securityLabel.children[1].hidden = isSensorChoice;
          securityLabel.classList.toggle("is-camera-status", deviceKind.deviceKind === "camera");
          securityLabel.classList.toggle("is-camera-offline", !available);
          securityLabel.style.fontSize = (deviceKind.fontSize || 12) + "px";
          if (deviceKind.deviceKind === "camera") {
            const markerIcon = classList.querySelector(".i3d-marker-icon");
            markerIcon && markerIcon.parentNode !== securityLabel && securityLabel.append(markerIcon);
            securityLabel.style.setProperty("--i3d-marker-icon-size", iconSizeNode + "px");
          }
          classList.style.setProperty("--i3d-security-scale", String(markerSize / 44));
          classList.style.width = Math.max(hitSizeNode, (deviceKind.deviceKind === "camera" ? securityLabel.offsetWidth || 0 : isSensorChoice ? 120 : 180) * markerSize / 44) + "px";
          classList.style.height = Math.max(hitSizeNode, (deviceKind.deviceKind === "camera" ? securityLabel.offsetHeight || 0 : isSensorChoice ? 32 : 58) * markerSize / 44) + "px";
        }
      }
      classList.classList.toggle("i3d-vacuum-room", isVacuumRoomMarker);
      classList.classList.toggle("is-icon-hidden", isVacuumRoomMarker && deviceKind.iconHidden === true);
      if (isVacuumRoomMarker) {
        let textContent = classList.querySelector(".i3d-room-label");
        if (!textContent) {
          textContent = createEl("span", "i3d-room-label");
          classList.append(textContent);
        }
        textContent.textContent = deviceKind.label || "清扫";
        textContent.hidden = deviceKind.labelHidden === true;
        textContent.style.fontSize = (deviceKind.fontSize || 12) + "px";
      }
      classList.style.setProperty("--i3d-marker-size", markerSize + "px");
      classList.style.setProperty("--i3d-marker-icon-size", iconSizeNode + "px");
      classList.setAttribute("aria-label", deviceKind.overviewQuip ? vacuumQuip(deviceKind, states, performance.now()) : deviceKind.label || on.name || "灯光");
      if (!isVacuumMarker) {
        classList.title = deviceKind.label || on.name;
      }
      classList.classList.toggle("is-on", deviceKind.deviceKind === "cover" ? coverIconIsOn(deviceKind, on) : on.on);
      classList.classList.toggle("is-offline", !editing && !on.available);
      classList.classList.toggle("is-nas", deviceKind.deviceKind === "nas");
      classList.classList.toggle("is-selected", editing && selectedId === deviceKind.id);
    }
    syncEditorEffects();
    queueOrSendCommand();
    syncLightPanelCurrent();
    syncPresentationLayout();
    syncMarkerVisibility();
    updateMarkerPositionsCurrent(true);
  }
  function screenPointFromWorld(clientX, floorId) {
    const y2 = options.worldPoint(floorId.floorId, 0, 0, floorId.height);
    if (!y2) {
      return null;
    }
    const left = container.getBoundingClientRect();
    const setFromCamera = new THREE.Raycaster();
    setFromCamera.setFromCamera(new THREE.Vector2((clientX.clientX - left.left) / left.width * 2 - 1, 1 - (clientX.clientY - left.top) / left.height * 2), options.camera);
    const sub = setFromCamera.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -y2.y), new THREE.Vector3());
    if (!sub) {
      return null;
    }
    const lengthSq = options.worldPoint(floorId.floorId, 1, 0, floorId.height).sub(y2);
    const lengthSqCurrent = options.worldPoint(floorId.floorId, 0, 1, floorId.height).sub(y2);
    const dot = sub.sub(y2);
    return {
      x: Math.round(dot.dot(lengthSq) / lengthSq.lengthSq() * 100) / 100,
      y: Math.round(dot.dot(lengthSqCurrent) / lengthSqCurrent.lengthSq() * 100) / 100
    };
  }
  function onMarkerPointerDown(pointerId, id) {
    if (!editing || frameLoop || pointerId.button !== 0) {
      return;
    }
    pointerId.preventDefault();
    pointerId.stopPropagation();
    const x15 = findBinding(id);
    if (!x15) {
      return;
    }
    selectedId = id;
    queueOrSendCommand();
    deviceStatus({
      type: "edit",
      action: "select",
      id: id
    });
    const x16 = screenPointFromWorld(pointerId, x15);
    dragState = {
      id: id,
      pointerId: pointerId.pointerId,
      clientX: pointerId.clientX,
      clientY: pointerId.clientY,
      original: {
        x: x15.x,
        y: x15.y
      },
      point: {
        x: x15.x,
        y: x15.y
      },
      height: x15.height,
      offset: x16 ? {
        x: x15.x - x16.x,
        y: x15.y - x16.y
      } : {
        x: 0,
        y: 0
      },
      moved: false
    };
    pointerId.currentTarget.setPointerCapture(pointerId.pointerId);
    options.controls.enabled = false;
  }
  function onMarkerPointerMove(pointerId) {
    if (!dragState || dragState.pointerId !== pointerId.pointerId || Math.hypot(pointerId.clientX - dragState.clientX, pointerId.clientY - dragState.clientY) < 4 && !dragState.moved) {
      return;
    }
    const x17 = screenPointFromWorld(pointerId, findBinding(dragState.id));
    if (x17) {
      dragState.moved = true;
      dragState.point = {
        x: Math.round((x17.x + dragState.offset.x) * 100) / 100,
        y: Math.round((x17.y + dragState.offset.y) * 100) / 100
      };
      if (preFocusCamera === "light") {
        Object.assign(findBinding(dragState.id), dragState.point);
      }
      updateMarkerPositionsCurrent(true);
    }
  }
  function onMarkerPointerUp(pointerId) {
    if (!!dragState && dragState.pointerId === pointerId.pointerId) {
      if (dragState.moved) {
        pointerId.currentTarget.dataset.dragged = "true";
        const deviceKind = findBinding(dragState.id);
        const vacuumForRoom = deviceKind.deviceKind === "camera" ? properties.security?.cameras?.find(id => "camera:" + id.id === deviceKind.id) : deviceKind.deviceKind === "vacuum-room" ? properties.devices?.vacuums?.find(id => id.id === deviceKind.vacuumId)?.shortcuts?.find(id => id.id === deviceKind.shortcutId) : preFocusCamera === "light" ? deviceKind : (["nas", "television", "vacuum"].includes(preFocusCamera) ? properties.devices?.[preFocusCamera === "vacuum" ? "vacuums" : preFocusCamera === "television" ? "televisions" : "nas"] || [] : properties.environment?.[preFocusCamera === "cover" ? "curtains" : "airConditioners"] || []).find(id => id.id === dragState.id);
        if (vacuumForRoom) {
          Object.assign(vacuumForRoom, dragState.point);
        }
        deviceStatus({
          type: "edit",
          action: "position",
          id: deviceKind.id,
          x: dragState.point.x,
          y: dragState.point.y
        });
      }
      dragState = null;
      pointerToFloorPoint();
    }
  }
  function cancelMarkerDrag() {
    if (dragState && preFocusCamera === "light") {
      Object.assign(findBinding(dragState.id), dragState.original);
    }
    dragState = null;
    pointerToFloorPoint();
    updateMarkerPositionsCurrent(true);
  }
  let id;
  canvas.addEventListener("pointerdown", button => {
    id = (button.button == null || button.button === 0) && button.isPrimary !== false ? {
      x: button.clientX,
      y: button.clientY,
      id: button.pointerId,
      moved: false
    } : null;
  });
  canvas.addEventListener("pointermove", pointerId => {
    if (id && (pointerId.pointerId !== id.id || Math.hypot(pointerId.clientX - id.x, pointerId.clientY - id.y) >= 5)) {
      id.moved = true;
    }
  });
  canvas.addEventListener("pointercancel", () => {
    id = null;
  });
  canvas.addEventListener("pointerup", clientX => {
    const isTap = id && !id.moved && id.id === clientX.pointerId && Math.hypot(clientX.clientX - id.x, clientX.clientY - id.y) < 5;
    id = null;
    if (!!isTap && !presets && frameLoop !== "edit") {
      if (!editing && !viewEditing && interactive && !presentedVisible) {
        const presencePick = hitRects.pick(clientX.clientX, clientX.clientY, options.camera, canvas, properties.security?.presenceSensors || []);
        if (presencePick) {
          focusBinding("presence:" + presencePick);
          return;
        }
      }
      if (!idleReturning() && preFocusCamera !== "light" && !viewEditing && !presentedVisible && (editing || interactive)) {
        const binding = options.pickEnvironmentModel?.(clientX.clientX, clientX.clientY, visibleBindings(), clientX.pointerType === "touch" ? 10 : 5);
        const id = binding && visibleBindings().find(floorId => floorId.floorId === binding.floorId && floorId.modelId === binding.modelId);
        if (id) {
          activateBinding(id.id);
          return;
        }
      }
      clearFocus();
    }
  });
  window.addEventListener("keydown", key => {
    if (key.key === "Escape") {
      clearFocus();
    }
  });
  function onParentMessage(value) {
    if (value.origin !== location.origin || value.source !== window.parent || value.data?.channel !== "hb-i3d-v1") {
      return;
    }
    const requestId = value.data;
    wake();
    if (requestId.type === "presentation-layout") {
      if (Number.isFinite(requestId.width) && requestId.width > 0 && Number.isFinite(requestId.height) && requestId.height > 0) {
        focusedLightBinding = {
          width: requestId.width,
          height: requestId.height
        };
        syncPresentationLayout();
      }
    } else if (requestId.type === "config") {
      if (toolbar) {
        lightPanel = value;
        return;
      }
      lightPreview = requestId.rangeEditorOnly === true;
      markerFloorRef = requestId.allowRangeEditing === true || requestId.editing === true;
      if (active && (!markerFloorRef || requestId.viewEditing === true || requestId.properties?.lightingMode !== "region" || requestId.properties?.floorSelection !== focusVignette.floorSelection || JSON.stringify(requestId.properties?.camera) !== JSON.stringify(focusVignette.camera) || JSON.stringify(requestId.properties?.lightRegionOverrides || {}) !== JSON.stringify(focusVignette.lightRegionOverrides || {}))) {
        markerDocRef?.close();
      }
      restoreViewButton = false;
      if (requestId.editing || requestId.viewEditing || focusVignette.floorSelection !== requestId.properties.floorSelection || JSON.stringify(focusVignette.floorCameras) !== JSON.stringify(requestId.properties.floorCameras)) {
        focusViewport = "";
        activityVisible = "";
      }
      focusVignette = structuredClone(requestId.properties);
      if (!idleRotating && !requestId.editing && !requestId.viewEditing) {
        idleRotating = true;
        if (options.document.floors.length > 1) {
          focusViewport = "all";
        }
      }
      if (focusViewport && focusViewport !== "all" && !options.document.floors.some(id => id.id === focusViewport)) {
        focusViewport = "";
      }
      if (requestId?.editing || requestId?.viewEditing || focusVignette.floorSelection !== properties.floorSelection && !focusViewport) {
        options.finishFloorTransition?.();
      }
      options.setFloorGap?.(focusVignette.floorGap);
      requestId.properties = transformProperties({
        ...focusVignette,
        ...(focusViewport ? {
          floorSelection: focusViewport
        } : {})
      });
      if (focusViewport && baseCameraState) {
        requestId.properties.camera = baseCameraState;
      } else if (focusViewport && focusViewport !== focusVignette.floorSelection) {
        requestId.properties.camera = transformCameraForFloor(focusVignette.floorCameras?.[focusViewport] || null, focusViewport);
      }
      activity.activity();
      visibility.activity();
      exit.activity();
      const viewEditingChanged = viewEditing && requestId.viewEditing !== true || JSON.stringify(properties.camera) !== JSON.stringify(requestId.properties.camera);
      if ((frameLoop || activityTracked || presentedVisible) && (viewEditingChanged || properties.floorSelection !== requestId.properties.floorSelection || editing !== (requestId.editing === true) || requestId.viewEditing === true || editing && selectedId !== (requestId.selectedId || ""))) {
        clearFocus({
          immediate: true
        });
      }
      properties = structuredClone(requestId.properties);
      editing = requestId.editing === true;
      viewEditing = requestId.viewEditing === true;
      selectedId = requestId.selectedId || "";
      states = requestId.states || {};
      interactive = !editing && requestId.interactive === true;
      cameraMotion = requestId.editingVacuumId || "";
      const moduleCandidates = editing ? ["security", "climate", "cover", "nas", "television", "vacuum", "vacuum-shortcut"].includes(requestId.editingModule) ? requestId.editingModule : "light" : ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : ["nas", "television"].includes(preFocusCamera) ? "devices" : "environment";
      if (preFocusCamera !== moduleCandidates) {
        clearFocus({
          immediate: true
        });
        preFocusCamera = moduleCandidates;
      }
      for (const next of sceneUpdating.values()) {
        if (next.next && (!interactive || !(properties.lights || []).some(entityId => entityId.entityId === next.entityId))) {
          reject.reject(next.entityId, next.next.previewToken);
          next.next = null;
        }
      }
      configureIdleBehaviors();
      syncIdleAvailabilityCurrent();
      options.appearance(active ? {
        ...properties,
        lightRegionOverrides: options.regionLighting.getOverrides()
      } : properties);
      const floorExists = options.document.floors.some(id => id.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
      if (!editing && floorExists === "all" && !idleReturning()) {
        preFocusCamera = "overview";
      }
      if (activeFloorId !== floorExists) {
        displayLightState(false);
        activeFloorId = floorExists;
        options.setFloor(floorExists);
        options.restoreCamera(normalizeCameraUp(properties.camera || options.floorDefaultCamera?.(floorExists)));
        baseCameraState = options.cameraState();
      } else if (viewEditingChanged) {
        options.restoreCamera(normalizeCameraUp(properties.camera || baseCameraState));
        baseCameraState = options.cameraState();
      }
      pointerToFloorPoint();
      toolbarEl.hidden = true;
      syncChromeInert();
      if (viewEditing || !editing && !interactive) {
        clearFocus({
          immediate: true
        });
      }
      pruneMarkerElements();
      const presentToken = ++presentGeneration;
      (presented ? Promise.resolve() : options.whenPresented()).then(() => {
        if (!disposed && presentToken === presentGeneration) {
          presented = true;
          syncIdleAvailabilityCurrent();
          updateMarkerPositionsCurrent(true);
          deviceStatus({
            type: "presented",
            configId: requestId.configId,
            camera: transformCameraForFloor(options.cameraState(), properties.floorSelection, true)
          });
        }
      }).catch(message => {
        if (!disposed && presentToken === presentGeneration) {
          deviceStatus({
            type: "error",
            message: message.message || "户型画面准备失败，请重新载入。"
          });
        }
      });
    } else if (requestId.type === "vacuum-room-result") {
      clearTimeout(entryMap.get(requestId.id));
      entryMap.delete(requestId.id);
      const disabled = rawProperties.get(requestId.id);
      if (disabled) {
        disabled.disabled = false;
        disabled.title = requestId.error || "";
      }
      if (requestId.error) {
        moduleEmptyEl.hidden = false;
        moduleEmptyEl.textContent = requestId.error;
      }
    } else if (requestId.type === "range-editor") {
      if (requestId.flush === true) {
        const error = !markerFloorRef || !active ? "请先打开照射范围编辑。" : "";
        if (!error) {
          markerDocRef.flush();
        }
        deviceStatus({
          type: "range-editor-state",
          active: active,
          requestId: requestId.requestId,
          ...(error ? {
            error
          } : {})
        });
      } else if (requestId.open === false) {
        markersConcealedAt = !!requestId.requestId;
        try {
          markerDocRef?.close();
        } finally {
          markersConcealedAt = false;
        }
        if (requestId.requestId) {
          deviceStatus({
            type: "range-editor-state",
            active: false,
            requestId: requestId.requestId
          });
        }
      } else {
        openRangeEditor(requestId.requestId);
      }
    } else if (requestId.type === "range-save-result") {
      markerDocRef?.setSaveStatus?.(requestId.error || "");
    } else if (requestId.type === "activity-state") {
      pendingCommands = true;
      idleIconsHidden = requestId.visible === true;
      markerWorldCache = requestId.presentedVisible === undefined ? idleIconsHidden : requestId.presentedVisible === true;
      options.setPresentedVisible?.(markerWorldCache);
      collectMetadata();
      if (!idleIconsHidden) {
        restoreViewButton = false;
      }
      syncIdleAvailabilityCurrent();
    } else if (requestId.type === "user-activity") {
      restoreViewButton = false;
      lightPanelHeader = performance.now();
      syncMarkerVisibility();
      lightStateCache = requestId.held === true;
      syncIdleHold();
    } else if (requestId.type === "dismiss-focus") {
      activity.activity();
      visibility.activity();
      clearFocus({
        immediate: requestId.immediate === true
      });
    } else if (requestId.type === "states") {
      states = requestId.patch === true ? {
        ...states,
        ...(requestId.states || {})
      } : requestId.states || {};
      for (const entityId of properties.lights || []) {
        if (requestId.patch !== true || Object.hasOwn(requestId.states || {}, entityId.entityId)) {
          reject.reconcile(entityId.entityId, resolveLightEntityState(entityId.entityId));
        }
      }
      pruneMarkerElements();
    } else if (requestId.type === "control-result") {
      if (set.has(requestId.requestId)) {
        enqueueCommand(requestId.requestId, requestId.error);
      } else if (map.has(requestId.requestId)) {
        camerasEqual(requestId.requestId, requestId.error);
      } else if (fallback.has(requestId.requestId)) {
        moveFocusOut(requestId.requestId, requestId.error);
      } else {
        finishControlRequest(requestId.requestId, requestId.error || "", requestId.timedOut === true);
      }
    } else if (requestId.type === "editor-command" && editing) {
      try {
        if (requestId.command === "presence-top-view") {
          const {
            floorId: presenceFloorId,
            box: x2
          } = requestId.value || {};
          if (!x2 || ![x2.x, x2.y, x2.w, x2.h].every(Number.isFinite) || x2.w <= 0 || x2.h <= 0) {
            throw new Error("顶视图范围无效。");
          }
          const x3 = options.worldPoint(presenceFloorId, x2.x + x2.w / 2, x2.y + x2.h / 2, 0);
          const z = options.worldPoint(presenceFloorId, x2.x, x2.y, 0);
          const z2 = options.worldPoint(presenceFloorId, x2.x + x2.w, x2.y + x2.h, 0);
          if (!x3 || !z || !z2) {
            throw new Error("请选择有效楼层。");
          }
          const frameSize = Math.max(Math.abs(z2.z - z.z), Math.abs(z2.x - z.x) / (canvas.clientWidth / Math.max(1, canvas.clientHeight)));
          clearFocus({
            immediate: true
          });
          options.restoreCamera({
            mode: "orthographic",
            view: "top",
            topRotation: 0,
            position: [x3.x, x3.y + Math.max(20, frameSize * 2), x3.z],
            target: x3.toArray(),
            up: [0, 0, -1],
            zoom: 1,
            frameSize
          });
        } else if (requestId.command === "presence-3d-view") {
          options.setCameraView?.("free");
          options.restoreCamera(properties.camera || options.floorDefaultCamera?.(activeFloorId) || baseCameraState);
        } else if (requestId.command === "presence-preview-walk") {
          presenceEditorActive = requestId.value === true;
          syncMarkers();
        } else if (requestId.command === "presence-show-hit-range") {
          presenceHitTesting = requestId.value === true;
          syncLightPanel();
        } else if (requestId.command === "edit-follow-camera") {
          const deviceKind = findBinding(requestId.id);
          if (deviceKind?.deviceKind !== "vacuum") {
            throw new Error("请选择扫地机。");
          }
          focusBinding(requestId.id, "edit", true);
          const value = options.environmentModelPose(deviceKind.floorId, deviceKind.modelId)?.center || options.cameraState().target;
          animateCameraTo(deviceKind.followCamera || vacuumBirdCamera(properties.camera || options.cameraState(), value), false, true);
        } else if (requestId.command === "edit-light-camera") {
          focusBinding(requestId.id, "edit", true);
        } else if (requestId.command === "preview-light-camera") {
          focusBinding(requestId.id, "preview");
        } else if (requestId.command === "preview-light-effect") {
          if (!["brightnessMin", "brightnessMax", "temperatureMin", "temperatureMax", "defaults"].includes(requestId.value)) {
            throw new Error("请选择要预览的效果。");
          }
          if (!findBinding(requestId.id)) {
            throw new Error("灯光按钮已移除。");
          }
          if (!findBinding(requestId.id).entityId) {
            throw new Error("请先绑定实体，再预览灯光效果。");
          }
          focusBinding(requestId.id, "preview");
          presentationScale = {
            id: requestId.id,
            kind: requestId.value
          };
          syncEditorEffects({
            preview: true
          });
          syncLightPanelCurrent();
        } else if (requestId.command === "cancel-light-camera") {
          clearFocus({
            immediate: true
          });
        } else {
          if (frameLoop !== "edit" || requestId.id !== focusedLightId) {
            throw new Error(preFocusCamera === "nas" ? "请先调整这台NAS的聚焦视角。" : preFocusCamera === "cover" ? "请先调整这幅窗帘的聚焦视角。" : preFocusCamera === "climate" ? "请先调整这台空调的聚焦视角。" : "请先调整这盏灯的聚焦视角。");
          }
          if (requestId.command === "focus-projection") {
            options.setCameraProjection(requestId.value);
          }
          if (requestId.command === "focus-focal-length") {
            options.setCameraFocalLength(requestId.value);
          }
        }
        pointerToFloorPoint();
        const camera = lightTitle();
        deviceStatus({
          type: "edit",
          action: "focus-camera",
          requestId: requestId.requestId,
          id: requestId.id,
          camera
        });
        if (requestId.command === "save-light-camera") {
          clearFocus({
            immediate: true
          });
        }
      } catch (message) {
        deviceStatus({
          type: "edit",
          action: "focus-camera",
          requestId: requestId.requestId,
          error: message.message
        });
      }
    } else if (requestId.type === "editor-command" && viewEditing) {
      if (requestId.command === "projection") {
        options.setCameraProjection(requestId.value);
      }
      if (requestId.command === "focal-length") {
        options.setCameraFocalLength(requestId.value);
      }
      pointerToFloorPoint();
      if (requestId.command === "save-camera" || requestId.requestId) {
        deviceStatus({
          type: "edit",
          action: "camera",
          requestId: requestId.requestId,
          camera: lightTitle()
        });
      }
    }
  }
  window.addEventListener("message", onParentMessage);
  const controlsCurrent = options.controls;
  const unsubscribeCameraChange = options.onCameraChange?.(() => {
    const cameraMoved = screenOutlines.cameraChanged();
    updateMarkerPositionsCurrent();
    syncLightPanel();
    if (cameraMoved || focusMode.hideIconsWhileRotating === true) {
      wake();
    }
  });
  if (!unsubscribeCameraChange) {
    controlsCurrent.addEventListener("change", updateMarkerPositionsCurrent);
  }
  const observe = new ResizeObserver(syncPresentationLayout);
  observe.observe(container);
  observe.observe(lightPanelEl);
  observe.observe(navigationEl);
  observe.observe(floorTabsEl);
  async function apply(sceneUpdate) {
    const savedScene = options.savedScene;
    const titleCamera = lightTitle();
    restoreViewButton = restoreViewButton || activePointers && focusMode.hideIconsWhileRotating === true || lightHistoryStorage;
    toolbar = true;
    activity.activity();
    syncMarkerVisibility();
    let cancelFloorWait = () => {};
    let floorWaitDone = false;
    const runFloorTransition = async floorTransitionFn => {
      options.finishFloorTransition?.();
      await options.replaceScene(floorTransitionFn);
      if (disposed) {
        return;
      }
      options.setFloorGap?.(focusVignette.floorGap);
      properties = transformProperties({
        ...focusVignette,
        ...(focusViewport ? {
          floorSelection: focusViewport
        } : {})
      });
      const hasFloorSelection = options.document.floors.some(id => id.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
      activeFloorId = hasFloorSelection;
      options.setFloor(hasFloorSelection);
      options.appearance(properties);
      baseCameraState = transformCameraForFloor(focusVignette.floorCameras?.[hasFloorSelection] || focusVignette.camera || titleCamera, hasFloorSelection);
      options.restoreCamera(transformCameraForFloor(titleCamera, hasFloorSelection));
      syncEditorEffects({
        immediate: true
      });
      await options.whenPresented();
    };
    try {
      cancelFloorWait = options.coverSceneUpdate();
      options.setCameraInteraction({
        enabled: false
      });
      floorWaitDone = true;
      await runFloorTransition(sceneUpdate);
      if (!disposed) {
        deviceStatus({
          type: "model-metadata",
          metadata: buildFloorHeightMap()
        });
      }
    } catch (floorTransitionError) {
      if (floorWaitDone && !disposed) {
        await runFloorTransition(savedScene);
      }
      throw floorTransitionError;
    } finally {
      cancelFloorWait();
      toolbar = false;
      markersSuppressedByActivity.clear();
      if (!disposed && (pointerToFloorPoint(), pruneMarkerElements(), lightPanel)) {
        const parentMessage = lightPanel;
        lightPanel = null;
        onParentMessage(parentMessage);
      }
    }
  }
  const sceneSync = options.readSceneUpdate ? startSceneSync({
    eligible: () => !disposed && presented && idleIconsHidden && !document.hidden && !editing && !viewEditing && !frameLoop && !presentedVisible && !dragState && !active && !toolbar && !sceneUpdating.size && !fallback.size && !map.size && !set.size && !curtainMotion.isMoving() && nextDelay.nextDelay() === Infinity && !lightStateCache && !resolveLightState.size && !effectPreview.size && performance.now() - lightPanelHeader > 1200,
    read: sceneId => options.readSceneUpdate(sceneId),
    apply
  }) : () => {};
  function tickStageFrame(frameTime) {
    if (disposed || document.hidden || toolbar) {
      return Infinity;
    }
    syncMarkers();
    const cameraBusy = options.floorTransitionActive || presentedVisible?.owner === "floor";
    options.recordFloorFrame?.(frameTime, !!cameraBusy);
    if (!cameraBusy) {
      syncCurtainLayout();
      syncNasStatus();
      syncSecurityStatus();
      syncPresentationChrome();
      syncVacuumMap();
      markersRoot.tick(frameTime);
      if (nextDelay.tick(frameTime)) {
        syncCameraInteraction();
        if (callback()?.deviceKind === "cover") {
          syncLightPanelCurrent();
        }
      }
      curtainMotion.update(frameTime);
    }
    collectMetadata();
    options.curtainFrame?.({
      key: curtainMotion.poseKey(),
      structure: curtainMotion.structureKey(),
      floorIds,
      moving: curtainMotion.isMoving() || nextDelay.nextDelay() <= 1000 / 30
    });
    const presenceWaveTicked = presenceWaves.tick(frameTime);
    const curtainTickMs = isActive.tick(frameTime);
    if (!cameraBusy) {
      setRoot.tick(frameTime);
    }
    options.setEnvironmentActive?.(isActive.isActive);
    tickPresentedTransition(frameTime);
    const vacuumTickMs = maps.tick(frameTime);
    exit.tick(frameTime);
    activity.tick(frameTime);
    visibility.tick(frameTime);
    if (reject.expire()) {
      pruneMarkerElements();
    }
    const frameDeltaSec = brightnessSlider ? Math.min(0.1, (frameTime - brightnessSlider) / 1000) : 0;
    brightnessSlider = frameTime;
    const presenceTicked = !cameraBusy && hitRects.tick(frameDeltaSec);
    syncLightPanel();
    const vacuumMapTicked = !cameraBusy && hasTracking.tick(frameDeltaSec);
    if (vacuumMapTicked) {
      lastMarkerLayoutKey = "";
      updateMarkerPositionsCurrent(true);
    }
    const anyVacuumActive = (properties.devices?.vacuums || []).some(vacuumItem => vacuumStatusPresentation(vacuumItem, states).active);
    const vacuumPulseSlot = Math.floor(frameTime / 7000);
    if (anyVacuumActive && vacuumPulseSlot !== presetsRoot) {
      presetsRoot = vacuumPulseSlot;
      pruneMarkerElements();
    }
    applyLightStates(frameDeltaSec);
    const cameraQuatKey = options.camera.quaternion?.toArray?.().join(",") || "";
    if (cameraQuatKey !== lightControls) {
      const frameSec = Math.min(100, Math.max(1, frameTime - (previousCameraFrameTime ?? frameTime - 16.7))) / 1000;
      const rotationSpeed = previousCameraQuaternion.angleTo(options.camera.quaternion) / frameSec;
      lightControls && !presentedVisible && !presets && (activePointers || userHeld || rotationSpeed > 0.035) && (hideIconsUntilDeg = frameTime + 60);
      lightControls = cameraQuatKey;
    }
    previousCameraQuaternion.copy(options.camera.quaternion);
    previousCameraFrameTime = frameTime;
    const hideIconsWhileOrbit = focusMode.hideIconsWhileRotating === true && !editing && !viewEditing && (userHeld || frameTime < hideIconsUntilDeg);
    if (hideIconsWhileOrbit !== temperatureSlider) {
      temperatureSlider = hideIconsWhileOrbit;
      syncMarkerVisibility();
    }
    const anyVacuumFollowing = (properties.devices?.vacuums || []).some(id => idleCameraBase(id) && hasTracking.hasTracking(id.id));
    followRoamBtn.hidden = editing || !presets && (preFocusCamera !== "vacuum" || !anyVacuumFollowing);
    toolbarEl.hidden = followRoamBtn.hidden;
    followRoamBtn.disabled = !presets && !anyVacuumFollowing;
    updateMarkerPositionsCurrent();
    canvas.dataset.stageFrameChecks = String(markersById.stats.frames);
    return Math.min(presenceWaveTicked ? 1000 / 30 : Infinity, presenceTicked ? 1000 / 30 : Infinity, vacuumMapTicked || presets ? 1000 / 30 : Infinity, temperatureSlider ? 100 : Infinity, anyVacuumActive ? 7000 - frameTime % 7000 : Infinity, presentedVisible || curtainTickMs || vacuumTickMs ? 0 : Infinity, curtainMotion.isMoving() ? 1000 / 30 : Infinity, nextDelay.nextDelay(frameTime), setRoot.nextDelay(), markersRoot.nextDelay(), screenOutlines.nextDelay(), exit.nextDelay(frameTime), activity.nextDelay(frameTime), visibility.nextDelay(frameTime), reject.nextDelay(frameTime));
  }
  markersById = options.createFrameLoop({
    step: frameDt => options.profileFrameWork ? options.profileFrameWork("stage-updates", () => tickStageFrame(frameDt)) : tickStageFrame(frameDt)
  });
  syncIdleAvailabilityCurrent();
  window.addEventListener("pagehide", () => {
    finishCommand();
    document.removeEventListener("visibilitychange", collectMetadata);
    maps.dispose();
    hasTracking.dispose();
    hitRects.dispose();
    presenceWaves.dispose();
    if (presets) {
      displayLightState(false);
    }
    for (const pendingCameraTween of entryMap.values()) {
      clearTimeout(pendingCameraTween);
    }
    entryMap.clear();
    markerFloorRef = false;
    markerDocRef?.dispose();
    options.setCurtainSync?.(null);
    panel.dispose();
    curtainMotion.dispose();
    nextDelay.clear();
    for (const pendingControlId of set.keys()) {
      enqueueCommand(pendingControlId, "页面已关闭。");
    }
    for (const pendingCameraRequestId of map.keys()) {
      camerasEqual(pendingCameraRequestId, "页面已关闭。");
    }
    presentationRoot.flush();
    sceneSync();
    rootCurrent.dispose();
    markersRoot.dispose();
    screenOutlines.dispose();
    cameraStatus.dispose();
    rootNext.dispose();
    sync.dispose();
    setRoot.dispose();
    isActive.dispose();
    root.dispose();
    for (const pendingFocusRequestId of fallback.keys()) {
      moveFocusOut(pendingFocusRequestId, "页面已关闭。");
    }
    options.finishFloorTransition?.();
    disposed = true;
    activity.dispose();
    visibility.dispose();
    exit.dispose();
    presentedVisible = null;
    deviceStatus({
      type: "focus-state",
      active: false
    });
    for (const activityEventName of activityEventTypes) {
      window.removeEventListener(activityEventName, onUserActivityEvent, true);
    }
    window.removeEventListener("blur", clearLightPreviewHold);
    document.removeEventListener?.("visibilitychange", syncIdleAvailabilityCurrent);
    markersById.dispose();
    unsubscribeCameraChange?.();
    if (!unsubscribeCameraChange) {
      controlsCurrent.removeEventListener("change", updateMarkerPositionsCurrent);
    }
    observe.disconnect();
    sceneUpdating.forEach(timeout => clearTimeout(timeout.timeout));
    sceneUpdating.clear();
  });
  function buildFloorHeightMap() {
    const get = new Map(floorNavigationChoices(options.document.floors).filter(([floorChoiceId]) => floorChoiceId !== "all").map(([floorChoiceKey, slice]) => [floorChoiceKey, slice.startsWith("B") ? -Number(slice.slice(1)) : Number(slice.slice(0, -1))]));
    options.regionLighting?.sync?.(options.camera);
    return {
      floorGap: options.document.previewFloorGap,
      appearanceCapabilities: {
        detailedLighting: (options.regionLighting?.stats?.detailedMaterials || 0) > 0
      },
      camera: transformCameraForFloor(options.cameraState(), properties.floorSelection || options.document.activeFloorId, true),
      baseLighting: options.document.baseLighting,
      defaults: options.defaults,
      floors: options.document.floors.map(scene => {
        const settingsWallHeight = scene.scene.settings?.wallHeight;
        const wallHeights = scene.scene.walls.map(height => height.height).filter(wallHeight => Number.isFinite(wallHeight) && wallHeight > 0);
        const wallHeight = Math.max(0.01, Math.min(6, Number.isFinite(settingsWallHeight) && settingsWallHeight > 0 ? settingsWallHeight : Math.max(0, ...wallHeights) || 2.8));
        return {
          id: scene.id,
          name: scene.name,
          elevation: scene.elevation,
          number: get.get(scene.id),
          wallHeight,
          plan: {
            pixelsPerMeter: scene.scene.calibration?.pixelsPerMeter || 1,
            walls: scene.scene.walls.map(start => ({
              start: start.start,
              end: start.end,
              thickness: start.thickness
            }))
          },
          cameras: scene.scene.items.filter(item => item.type === "camera").map((item, cameraIndex) => ({
            id: item.id,
            name: item.name || "摄像头 " + (cameraIndex + 1),
            x: item.x,
            y: item.y,
            height: (Number(item.elevation) || 0) + (Number(item.height) || 0.3) / 2
          })),
          presenceSensors: scene.scene.items.filter(item => item.type === "presence").map((item, presenceIndex) => ({
            id: item.id,
            name: item.name || "人体传感器 " + (presenceIndex + 1)
          })),
          vacuums: scene.scene.items.filter(type => type.type === "robotvacuum").map((id7, vacuumIndex) => ({
            id: id7.id,
            name: id7.name || "扫地机 " + (vacuumIndex + 1),
            x: id7.x,
            y: id7.y,
            height: (Number(id7.elevation) || 0) + (Number(id7.height) || 0.85) / 2
          })),
          televisions: scene.scene.items.filter(type => type.type === "tv").map((id8, tvIndex) => ({
            id: id8.id,
            name: id8.name || "电视 " + (tvIndex + 1),
            type: id8.type,
            x: id8.x,
            y: id8.y,
            height: (Number(id8.elevation) || 0) + (Number(id8.height) || 0.92) * 0.62
          })),
          nas: scene.scene.items.filter(type => type.type === "nas").map((id9, nasIndex) => ({
            id: id9.id,
            name: id9.name || "NAS " + (nasIndex + 1),
            type: id9.type,
            x: id9.x,
            y: id9.y,
            height: (Number(id9.elevation) || 0) + (Number(id9.height) || 0.34) / 2
          })),
          curtains: scene.scene.items.filter(type => type.type === "curtain").map((id10, curtainIndex) => ({
            id: id10.id,
            name: id10.name || "窗帘 " + (curtainIndex + 1),
            type: id10.type,
            x: id10.x,
            y: id10.y,
            height: (Number(id10.elevation) || 0) + (Number(id10.height) || 2.4) / 2,
            curtainPosition: id10.curtainPosition || "split"
          })),
          airConditioners: scene.scene.items.filter(type => ["wallac", "floorac", "airoutlet"].includes(type.type)).map((type6, acIndex) => ({
            id: type6.id,
            name: type6.name || (type6.type === "airoutlet" ? "出风口" : type6.type === "wallac" ? "挂机空调" : "柜机空调") + " " + (acIndex + 1),
            type: type6.type,
            x: type6.x,
            y: type6.y,
            height: (Number(type6.elevation) || 0) + (Number(type6.height) || 0.28) / 2
          })),
          groups: (scene.scene.lightGroups || []).map(id11 => {
            const length = (scene.scene.items || []).filter(item => item.lightGroupId === id11.id);
            const list = length.length ? length : (scene.scene.walls || []).map(wall => wall.start).filter(Boolean);
            return {
              id: id11.id,
              name: id11.name,
              height: wallHeight,
              x: list.length ? list.reduce((sum, x) => sum + x.x, 0) / list.length : 0,
              y: list.length ? list.reduce((sum, y) => sum + y.y, 0) / list.length : 0
            };
          })
        };
      })
    };
  }
  deviceStatus({
    type: "ready",
    statePatches: true,
    metadata: buildFloorHeightMap()
  });
}
