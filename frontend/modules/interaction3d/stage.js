import { createPresenceScene } from "./presence-scene.js?v=20260910-presence-v1";
import { floorNavigationChoices } from "./floor-navigation.js?v=20260909-floor-numbers-v1";
import { createVacuumMotion, vacuumQuip, createVacuumFollowCamera, vacuumBirdCamera, vacuumFollowPose } from "./vacuum-motion.js?v=20260909-reflection-cache-v4";
import { createVacuumMaps, vacuumStatusPresentation, vacuumBindingsForMap } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { televisionState } from "./television-state.js";
import { createTelevisionPanel } from "./television-panel.js";
import { createTelevisionScreens } from "./television-screen.js?v=20260909-reflection-cache-v4";
import { createNasPanel } from "./nas-panel.js";
import { createNasStatus, nasDeviceState } from "./nas-status.js?v=20260908-nas-v1";
import { coverState, coverIconIsOn } from "./cover-state.js?v=20260909-curtain-action-v15";
import { createCoverFeedback } from "./cover-feedback.js?v=20260909-curtain-action-v15";
import { createCoverPanel } from "./cover-panel.js?v=20260909-curtain-action-v15";
import { createCurtainMotion } from "./curtain-motion.js?v=20260909-curtain-action-v15";
import { createEnvironmentAirflow } from "./environment-airflow.js?v=20260908-outlet-airflow-v1-20260909-page-behavior-airflow-zoom-v1";
import { mountRegionRangeEditor } from "./light-range-editor.js?v=20260909-curtain-action-v15";
import { climateState } from "./climate-state.js?v=20260908-climate-v1";
import { createClimatePanel } from "./climate-panel.js?v=20260908-climate-v1";
import { createEnvironmentScene, pageDimming, pageModelBindings } from "./environment-scene.js?v=20260909-reflection-cache-v4";
import { startSceneSync } from "./scene-sync.js?v=20260907-scene-sync-v1";
import { lightCommand, createLightPreview, createLightStateCache as value148, lightRenderState } from "./light-state.js?v=20260907-demand-v1";
import { createFocusCameraSampler, automaticLightCamera, automaticAirConditionerCamera } from "./camera-motion.js?v=20260908-environment-v1-20260909-floor-slide-v2-20260909-floor-camera-pivot-v4-20260909-floor-screen-slide-v5";
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
  const idleReturning = () => ["overview", "security"].includes(preFocusCamera);
  const idleCameraBase = floorId7 => activeFloorId === "all" || floorId7.floorId === activeFloorId;
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
  let active2 = false;
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
  const reject4 = createLightPreview();
  const scope = document.body?.dataset?.i3dLightHistoryScope;
  let storage;
  if (scope) {
    try {
      storage = window.localStorage;
    } catch {}
  }
  const presentationRoot = value148({
    storage,
    scope
  });
  const value128 = arg46 => presentationRoot.resolve(arg46 || "", states[arg46]);
  let presentationScale = null;
  let focusVignette = {
    lights: []
  };
  let toolbar = false;
  let restoreViewButton = false;
  let lightPanel = null;
  let lightPanelHeader = -Infinity;
  const value129 = (arg47, arg48 = properties.floorSelection, arg49 = false) => options.transformCamera?.(arg47, arg48, arg49) ?? arg47;
  const lightTitle = () => value129(options.cameraState(true), properties.floorSelection, true);
  function transformProperties(nextProperties) {
    const clonedProperties = structuredClone(nextProperties);
    clonedProperties.camera = value129(clonedProperties.floorCameras?.[clonedProperties.floorSelection] || clonedProperties.camera, clonedProperties.floorSelection);
    clonedProperties.lights = (clonedProperties.lights || []).map(light => ({
      ...light,
      ...(light.focusCamera ? {
        focusCamera: value129(light.focusCamera, clonedProperties.floorSelection)
      } : {})
    }));
    if (clonedProperties.security?.presenceSensors) {
      clonedProperties.security.presenceSensors = clonedProperties.security.presenceSensors.map(focusCamera3 => ({
        ...focusCamera3,
        ...(focusCamera3.focusCamera ? {
          focusCamera: value129(focusCamera3.focusCamera, clonedProperties.floorSelection)
        } : {})
      }));
    }
    if (clonedProperties.environment) {
      for (const value15 of ["airConditioners", "curtains"]) {
        clonedProperties.environment[value15] = (clonedProperties.environment[value15] || []).map(focusCamera => ({
          ...focusCamera,
          ...(focusCamera.focusCamera ? {
            focusCamera: value129(focusCamera.focusCamera, clonedProperties.floorSelection)
          } : {})
        }));
      }
    }
    for (const value54 of ["nas", "televisions", "vacuums"]) {
      if (clonedProperties.devices?.[value54]) {
        clonedProperties.devices[value54] = clonedProperties.devices[value54].map(focusCamera2 => ({
          ...focusCamera2,
          ...(focusCamera2.focusCamera ? {
            focusCamera: value129(focusCamera2.focusCamera, clonedProperties.floorSelection)
          } : {})
        }));
      }
    }
    if (clonedProperties.devices?.vacuums) {
      for (const followCamera of clonedProperties.devices.vacuums) {
        followCamera.followCamera &&= value129(followCamera.followCamera, clonedProperties.floorSelection);
      }
    }
    return clonedProperties;
  }
  const deviceStatus = arg50 => window.parent.postMessage({
    channel: "hb-i3d-v1",
    ...arg50
  }, location.origin);
  const value130 = (arg51, arg52, element2) => {
    const className = document.createElement(arg51);
    className.className = arg52 || "";
    if (element2) {
      className.textContent = element2;
    }
    return className;
  };
  const removeAttribute = value130("div", "i3d-markers");
  const lampAura = value130("div", "i3d-vacuum-working-layer");
  let hideIconsUntilDeg = 0;
  let lightControls = "";
  let temperatureSlider = false;
  let brightnessSlider = 0;
  let presetsRoot = -1;
  let presets = "";
  let controlError = null;
  let viewHelp = null;
  const style4 = value130("div", "i3d-presentation");
  let focusedLightBinding = null;
  let previewState = 1;
  const style5 = value130("div", "i3d-focus-vignette");
  style5.setAttribute("aria-hidden", "true");
  const append2 = value130("nav", "i3d-toolbar");
  const append3 = value130("div", "i3d-navigation");
  const inputEvents = value130("nav", "i3d-floor-tabs");
  inputEvents.setAttribute("aria-label", "选择楼层");
  let markerProjectionKey = "";
  const hidden3 = value130("nav", "i3d-module-tabs");
  hidden3.setAttribute("aria-label", "3D 控制模块");
  const controls = new Map();
  for (const [module, value62] of [["overview", "总览"], ["light", "灯光"], ["environment", "环境"], ["devices", "设备"], ["vacuum", "扫地机"], ["security", "安防"]]) {
    const type10 = value130("button", "", value62);
    type10.type = "button";
    type10.dataset.module = module;
    type10.style.setProperty("--i3d-tab-index", String(controls.size));
    type10.addEventListener("click", () => onParentMessage(module));
    hidden3.append(type10);
    controls.set(module, type10);
  }
  const hidden4 = value130("p", "i3d-module-empty");
  hidden4.setAttribute("role", "status");
  hidden4.hidden = true;
  const type12 = value130("button", "", "恢复视角");
  type12.type = "button";
  type12.hidden = true;
  append2.append(type12);
  const classList5 = value130("section", "i3d-light-panel");
  classList5.setAttribute("aria-label", "灯光控制");
  classList5.setAttribute("inert", "");
  const lightPanel2 = value130("header");
  const lightPanelHeader2 = value130("div", "i3d-light-heading-text");
  const lightHeadingText = value130("strong", "", "灯光");
  const powerButton = value130("p", "i3d-device-status");
  lightPanelHeader2.append(lightHeadingText, powerButton);
  const style6 = value130("button", "i3d-power");
  style6.type = "button";
  const setAttribute4 = value130("span", "i3d-lamp-drawing");
  setAttribute4.setAttribute("aria-hidden", "true");
  const presetsRoot2 = value130("span", "i3d-lamp-aura");
  const lampBodyEl = value130("span", "i3d-lamp-body");
  for (const type of ["cord", "shade", "bulb", "filament"]) {
    lampBodyEl.append(value130("i", "i3d-lamp-" + type));
  }
  setAttribute4.append(presetsRoot2, lampBodyEl);
  style6.append(setAttribute4);
  lightPanel2.append(lightPanelHeader2, style6);
  const append4 = value130("div", "i3d-light-controls");
  function createSlider(label, kind, min, max) {
    const root = value130("label", "i3d-slider i3d-" + kind);
    const labelEl = value130("span", "", label);
    const output = value130("output");
    const input = value130("input");
    input.name = "i3d-light-" + kind;
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = kind === "temperature" ? "10" : "1";
    input.setAttribute("aria-label", label);
    const heading = value130("div", "i3d-slider-heading");
    heading.append(labelEl, output);
    const legend = value130("span", "i3d-slider-legend");
    legend.append(value130("small", "", kind === "temperature" ? "暖色" : "暗"), value130("small", "", kind === "temperature" ? "冷色" : "亮"));
    root.append(heading, input, legend);
    input.addEventListener("input", () => {
      output.value = "" + input.value + (kind === "temperature" ? " K" : "%");
      const focusedLight = focusedLightBinding2();
      if (!!focusedLight && !editing && !!value128(focusedLight.entityId).available) {
        reject4.set(focusedLight.entityId, kind, Number(input.value));
        wake();
        syncLightPanel2();
        fn({
          preview: true
        });
      }
    });
    input.addEventListener("change", () => void sendLightCommand(kind, Number(input.value)));
    append4.append(root);
    return {
      root,
      input,
      value: output
    };
  }
  const input2 = createSlider("色温", "temperature", "2000", "6500");
  const input3 = createSlider("亮度", "brightness", "1", "100");
  const setAttribute5 = value130("div", "i3d-light-presets");
  setAttribute5.setAttribute("role", "group");
  setAttribute5.setAttribute("aria-label", "灯光预设");
  const value131 = lightPresets.map(brightness => {
    const type9 = value130("button", "i3d-light-preset");
    type9.type = "button";
    const detail = value130("small", "", brightness.brightness + "%");
    type9.append(value130("strong", "", brightness.label), detail);
    type9.addEventListener("click", () => void sendLightCommand("preset", brightness));
    setAttribute5.append(type9);
    return {
      ...brightness,
      button: type9,
      detail
    };
  });
  append4.append(setAttribute5);
  const window2 = value130("p", "i3d-control-error");
  window2.setAttribute("role", "status");
  const fallback = new Map();
  const root = createClimatePanel({
    onControl: entityId11 => new Promise((resolve, reject) => {
      const modelId = syncIdleAvailability().find(entityId => idleCameraBase(entityId) && entityId.entityId === entityId11.entityId && entityId.modelAvailable);
      if (!interactive || editing || disposed || preFocusCamera !== "environment" || !modelId?.modelId || modelId.entityId !== entityId11.entityId || !modelId.modelAvailable) {
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
        command: entityId11
      });
    })
  });
  function moveFocusOut(root, arg55) {
    const timeout5 = fallback.get(root);
    if (timeout5) {
      clearTimeout(timeout5.timeout);
      fallback.delete(root);
      if (arg55) {
        timeout5.reject(new Error(arg55));
      } else {
        timeout5.resolve();
      }
    }
  }
  const map = new Map();
  const nextDelay = createCoverFeedback();
  const root2 = createCoverPanel({
    onPreview: (arg28, arg29) => {
      nextDelay.preview(arg28, arg29);
      syncCameraInteraction();
      wake();
      return nextDelay.read(arg28);
    },
    onControl: entityId12 => new Promise((resolve2, reject2) => {
      const modelId2 = syncInputHold().find(entityId2 => idleCameraBase(entityId2) && entityId2.entityId === entityId12.entityId && entityId2.modelAvailable);
      if (!interactive || editing || disposed || preFocusCamera !== "environment" || !modelId2?.modelId) {
        reject2(new Error("当前窗帘不可控制。"));
        return;
      }
      const requestId2 = "cover-" + ++controlRequestSeq;
      const timeout2 = setTimeout(() => camerasEqual(requestId2, "请求超时，请检查设备状态。"), 14000);
      syncPresentationLayout();
      nextDelay.begin(entityId12, requestId2);
      syncCameraInteraction();
      map.set(requestId2, {
        resolve: resolve2,
        reject: reject2,
        timeout: timeout2,
        entityId: entityId12.entityId
      });
      deviceStatus({
        type: "control",
        requestId: requestId2,
        command: entityId12
      });
      fn20();
      wake();
    })
  });
  function camerasEqual(arg56, arg57) {
    const timeout6 = map.get(arg56);
    if (timeout6) {
      clearTimeout(timeout6.timeout);
      map.delete(arg56);
      if (arg57) {
        nextDelay.fail(timeout6.entityId, arg56, arg57);
        syncCameraInteraction();
        syncLightPanel2();
        wake();
        timeout6.reject(new Error(arg57));
      } else {
        timeout6.resolve();
      }
    }
  }
  const set2 = new Map();
  const root3 = createNasPanel();
  const root4 = createTelevisionPanel({
    onControl: service => new Promise((resolve3, reject3) => {
      const deviceKind6 = focusedLightBinding2();
      if (!interactive || editing || disposed || preFocusCamera !== "devices" || deviceKind6?.deviceKind !== "television" || !deviceKind6.modelAvailable || (["turn_on", "turn_off"].includes(service.service) && deviceKind6.powerEntityId || deviceKind6.entityId) !== service.entityId) {
        reject3(new Error("当前电视不可控制。"));
        return;
      }
      const requestId3 = "television-" + ++controlRequestSeq;
      const timeout3 = setTimeout(() => enqueueCommand(requestId3, "请求超时，请检查设备状态。"), 14000);
      set2.set(requestId3, {
        resolve: resolve3,
        reject: reject3,
        timeout: timeout3
      });
      deviceStatus({
        type: "control",
        requestId: requestId3,
        command: service
      });
    })
  });
  function enqueueCommand(command, previewToken) {
    const requestId = set2.get(command);
    if (requestId) {
      clearTimeout(requestId.timeout);
      set2.delete(command);
      if (previewToken) {
        requestId.reject(new Error(previewToken));
      } else {
        requestId.resolve();
      }
    }
  }
  classList5.append(lightPanel2, append4, window2, root.root, root2.root, root3.root, root4.root);
  const isMoving = createCurtainMotion({
    THREE,
    requestRender: () => wake()
  });
  let curtainLayoutCache = null;
  let floorIds = [];
  let value132 = [];
  function syncCameraInteraction() {
    for (const entityId16 of value132) {
      const value37 = nextDelay.read(entityId16.entityId, coverState(entityId16.entityId, states[entityId16.entityId]));
      isMoving.setState(entityId16.id, value37, {
        immediate: true
      });
      const classList = rawProperties.get("cover:" + entityId16.id);
      if (classList) {
        classList.classList.toggle("is-on", coverIconIsOn(entityId16, value37));
      }
    }
  }
  function syncPresentationLayout() {
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
    const map2 = [...syncInputHold(), ...clearFocus()];
    value132 = map2;
    floorIds = [...new Set(map2.map(floorId2 => floorId2.floorId).filter(Boolean))];
    isMoving.setBindings(modelRoot, map2, sceneRevision);
    nextDelay.retain(map2.map(entityId13 => entityId13.entityId));
    for (const entityId17 of map2) {
      nextDelay.sync(entityId17.entityId, coverState(entityId17.entityId, states[entityId17.entityId]));
    }
    syncCameraInteraction();
    options.curtainFrame?.({
      key: isMoving.poseKey(),
      structure: isMoving.structureKey(),
      floorIds,
      moving: isMoving.isMoving() || nextDelay.nextDelay() <= 1000 / 30
    });
  }
  options.setCurtainSync?.(syncPresentationLayout);
  const markersRoot = createNasStatus({
    THREE,
    requestFrame: () => {
      options.requestRender?.();
      wake();
    }
  });
  let root5;
  function syncMarkerVisibility() {
    const hasHiddenClickable = !viewEditing && !active2;
    const concealMarkers = options.modelRoot;
    const revision = options.sceneRevision;
    if (root5?.root !== concealMarkers || root5.revision !== revision || root5.config !== properties || root5.states !== states || root5.enabled !== hasHiddenClickable) {
      root5 = {
        root: concealMarkers,
        revision,
        config: properties,
        states,
        enabled: hasHiddenClickable
      };
      markersRoot.sync({
        root: concealMarkers,
        revision,
        bindings: clearInputHold(),
        states,
        enabled: hasHiddenClickable
      });
    }
  }
  const sync = createTelevisionScreens({
    THREE,
    requestFrame: arg30 => {
      options.requestRender?.();
      options.invalidateReflections?.(arg30);
      wake();
    }
  });
  let root6;
  function syncPresentationChrome() {
    const popupOpacity = options.modelRoot;
    const vignetteStrength = options.sceneRevision;
    const focused = preFocusCamera !== "light" && !viewEditing && !active2 ? editing ? selectedId : focusedLightId : "";
    if (root6?.root !== popupOpacity || root6.revision !== vignetteStrength || root6.config !== properties || root6.states !== states || root6.focused !== focused || root6.module !== preFocusCamera) {
      root6 = {
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
    requestFrame: arg31 => {
      options.requestRender?.();
      options.invalidateReflections?.(arg31);
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
  const hidden5 = value130("p", "i3d-view-help", "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。");
  hidden5.hidden = true;
  append3.append(hidden3);
  style4.append(removeAttribute, lampAura, append3, inputEvents, hidden4, classList5, hidden5);
  append3.append(append2);
  container.append(style5, style4);
  function syncIdleAvailability() {
    return (properties.environment?.airConditioners || []).map(event => {
      const x5 = options.document.floors.find(id => id.id === event.floorId)?.scene.items.find(id16 => id16.id === event.modelId && ["wallac", "floorac", "airoutlet"].includes(id16.type));
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
      const x7 = options.document.floors.find(floor => floor.id === event.floorId)?.scene.items.find(id17 => id17.id === event.modelId && id17.type === "curtain");
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
      const x9 = options.document.floors.find(floor => floor.id === event.floorId)?.scene.items.find(id18 => id18.id === event.modelId && id18.type === "nas");
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
  const hidden6 = value130("button", "", "跟随漫游");
  hidden6.type = "button";
  hidden6.hidden = true;
  hidden6.title = "以鸟瞰视角跟随扫地机";
  append2.append(hidden6);
  function displayLightState(arg58 = true) {
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
    hidden6.textContent = "跟随漫游";
    hidden6.setAttribute("aria-pressed", "false");
    options.endCameraMotion();
    if (arg58 && state) {
      fn7(state, false, false, () => options.restoreCamera(state), "follow-return");
    }
    pointerToFloorPoint();
    syncIdleAvailability2();
  }
  hidden6.addEventListener("click", () => {
    if (presets) {
      displayLightState();
      return;
    }
    if (options.floorTransitionActive || presentedVisible?.owner === "floor") {
      return;
    }
    const find = (properties.devices?.vacuums || []).filter(id25 => idleCameraBase(id25) && hasTracking.hasTracking(id25.id));
    const id40 = find.find(id19 => "vacuum:" + id19.id === focusedLightId) || find.find(arg11 => vacuumStatusPresentation(arg11, states).active) || find[0];
    if (!id40) {
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
    fn13({
      immediate: true
    });
    presentedVisible = null;
    options.endCameraMotion();
    controlError = target;
    presets = id40.id;
    viewHelp = structuredClone(id40.followCamera || vacuumBirdCamera(properties.camera || target, options.environmentModelPose(id40.floorId, id40.modelId)?.center || target.target));
    options.setFocusViewport(0);
    options.beginCameraMotion(viewHelp.mode);
    hidden6.textContent = "退出跟随";
    hidden6.setAttribute("aria-pressed", "true");
    pointerToFloorPoint();
    syncIdleAvailability2();
    wake();
  });
  const vacuumFollowCamera = createVacuumFollowCamera(THREE);
  function applyLightStates(applyOptions) {
    if (!presets) {
      return;
    }
    const clone = hasTracking.worldPosition(presets);
    const floorId8 = (properties.devices?.vacuums || []).find(id33 => id33.id === presets);
    if (!clone || !floorId8) {
      displayLightState();
      return;
    }
    const value63 = options.environmentModelPose(floorId8.floorId, floorId8.modelId)?.center;
    const toArray = (value63 ? new THREE.Vector3(...value63) : clone.clone()).add(new THREE.Vector3(0, 0.05, 0));
    const position = vacuumFollowPose(viewHelp, toArray.toArray());
    const value64 = new THREE.Vector3(...position.position);
    vacuumFollowCamera.reveal(options, floorId8, toArray, value64);
    options.setFocusViewport(0);
    options.applyCameraPose(position);
  }
  const value133 = deviceKind10 => ["nas", "television", "vacuum", "presence"].includes(deviceKind10?.deviceKind);
  const sync2 = createVacuumMaps(options, () => {
    options.requestRender?.();
    wake();
  });
  const hasTracking = createVacuumMotion(options, wake);
  const hitRects = createPresenceScene(options, wake);
  let value134 = null;
  let value135 = false;
  let value136 = false;
  const setAttribute6 = value130("div", "i3d-presence-hit-layer");
  setAttribute6.setAttribute("aria-hidden", "true");
  container.append(setAttribute6);
  const Math2 = new Map();
  function syncLightPanel() {
    if ((!editing || !value136) && !Math2.size) {
      return;
    }
    const map3 = editing && value136 ? hitRects.hitRects(options.camera, canvas, properties.security?.presenceSensors || []) : [];
    const state = new Set(map3.map(id29 => id29.id));
    const effectPreviewActive = container.getBoundingClientRect();
    for (const [slider, supported] of Math2) {
      if (!state.has(slider)) {
        supported.remove();
        Math2.delete(slider);
      }
    }
    for (const preset of map3) {
      let kelvin = Math2.get(preset.id);
      if (!kelvin) {
        kelvin = value130("div", "i3d-presence-hit-box");
        Math2.set(preset.id, kelvin);
        setAttribute6.append(kelvin);
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
    const lightIds = presented && (!editing || preFocusCamera === "security") && !viewEditing && !active2 && markerWorldCache && !document.hidden && !options.floorTransitionActive && presentedVisible?.owner !== "floor";
    const every = [properties, states, options.sceneRevision, activeFloorId, lightIds, value135, preFocusCamera];
    if (!value134 || !every.every((arg19, arg20) => arg19 === value134[arg20])) {
      value134 = every;
      hitRects.sync(properties.security?.presenceSensors || [], states, lightIds, activeFloorId, editing, value135, preFocusCamera);
    }
  }
  let value137 = null;
  function onMarkerPointerCancel() {
    const value65 = presented && !editing && !viewEditing && markerWorldCache && !document.hidden;
    const every2 = [properties, states, options.sceneRevision, value65];
    if (!value137 || !every2.every((arg21, arg22) => arg21 === value137[arg22])) {
      value137 = every2;
      hasTracking.sync(vacuumBindingsForMap(properties.devices?.vacuums || [], states), states, value65);
    }
  }
  const entryMap = new Map();
  let value138 = null;
  function collectMetadata() {
    const value66 = preFocusCamera === "vacuum" && !viewEditing && !active2 && !options.floorTransitionActive && presentedVisible?.owner !== "floor" && markerWorldCache && !document.hidden;
    const every3 = [properties, states, options.sceneRevision, activeFloorId, value66];
    if (!value138 || !every3.every((arg23, arg24) => arg23 === value138[arg24])) {
      value138 = every3;
      sync2.sync(vacuumBindingsForMap(tickCameraMotion(), states), value66, activeFloorId, states);
    }
  }
  document.addEventListener("visibilitychange", collectMetadata);
  function tickCameraMotion() {
    return (properties.devices?.vacuums || []).map(group => {
      const x11 = options.document.floors.find(floor => floor.id === group.floorId)?.scene.items.find(id20 => id20.id === group.modelId && id20.type === "robotvacuum");
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
  function normalizeCameraUp() {
    return tickCameraMotion().filter(entityId10 => entityId10.visible !== false && (editing || entityId10.entityId) && (editing || !vacuumStatusPresentation(entityId10, states).active && (states[entityId10.entityId]?.newState || states[entityId10.entityId])?.state !== "paused")).flatMap(id37 => (id37.shortcuts || []).filter(entityId8 => editing || entityId8.entityId).map(id30 => ({
      ...id30,
      id: "vacuum-room:" + id37.id + ":" + id30.id,
      vacuumId: id37.id,
      shortcutId: id30.id,
      floorId: id37.floorId,
      height: id30.height ?? 0.08,
      deviceKind: "vacuum-room",
      modelAvailable: id37.modelAvailable,
      icon: id30.icon || "mdi:broom",
      size: id30.size ?? 44,
      iconSize: id30.iconSize ?? 26,
      hitSize: id30.hitSize ?? 44
    })));
  }
  function onUserInput(event) {
    if (!presets && !editing && interactive && event.deviceKind === "vacuum" && event.entityId && (frameLoop === "panel" || event.clickAction !== "focus") && focusedLightId === event.id) {
      deviceStatus({
        type: "vacuum-popup",
        id: event.id
      });
    }
  }
  function startCameraMotion() {
    return (properties.devices?.televisions || []).map(x13 => {
      const x14 = options.document.floors.find(id5 => id5.id === x13.floorId)?.scene.items.find(id21 => id21.id === x13.modelId && id21.type === "tv");
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
  function clearFocus() {
    const hadEffectPreview = new Set(syncInputHold().map(floorId4 => JSON.stringify([floorId4.floorId, floorId4.modelId])));
    return options.document.floors.flatMap(id38 => (id38.scene?.items || []).filter(type7 => type7.type === "curtain" && !hadEffectPreview.has(JSON.stringify([id38.id, type7.id]))).map(id31 => ({
      id: "preview-cover:" + JSON.stringify([id38.id, id31.id]),
      floorId: id38.id,
      modelId: id31.id,
      entityId: "",
      deviceKind: "cover",
      curtainWidth: Number(id31.width) || 1.8,
      curtainPosition: id31.curtainPosition || "split",
      modelAvailable: true,
      previewOnly: true
    })));
  }
  function focusLight() {
    if (idleReturning()) {
      return [];
    } else if (preFocusCamera === "vacuum-shortcut") {
      return normalizeCameraUp().filter(vacuumId => vacuumId.vacuumId === cameraMotion);
    } else if (preFocusCamera === "nas") {
      return clearInputHold();
    } else if (preFocusCamera === "vacuum") {
      return tickCameraMotion().filter(entityId5 => editing || entityId5.entityId).map(id22 => ({
        ...id22,
        id: editing ? id22.id : "vacuum:" + id22.id
      }));
    } else if (preFocusCamera === "television") {
      return startCameraMotion();
    } else if (preFocusCamera === "devices") {
      return [...clearInputHold(), ...startCameraMotion()].map(deviceKind4 => ({
        ...deviceKind4,
        id: deviceKind4.deviceKind + ":" + deviceKind4.id
      }));
    } else if (preFocusCamera === "cover") {
      return syncInputHold();
    } else if (preFocusCamera === "climate") {
      return syncIdleAvailability();
    } else {
      return [...syncIdleAvailability(), ...syncInputHold()].map(deviceKind2 => ({
        ...deviceKind2,
        id: deviceKind2.deviceKind + ":" + deviceKind2.id
      }));
    }
  }
  const value139 = () => {
    let filter2 = preFocusCamera === "light" ? properties.lights || [] : [...focusLight(), ...(preFocusCamera === "vacuum" && !editing ? normalizeCameraUp() : [])];
    if (!editing && preFocusCamera === "overview") {
      filter2 = tickCameraMotion().filter(entityId6 => entityId6.entityId && vacuumStatusPresentation(entityId6, states).active && vacuumQuip(entityId6, states, performance.now())).map(id23 => ({
        ...id23,
        id: "vacuum:" + id23.id,
        overviewQuip: true
      }));
    }
    return filter2.filter(idleCameraBase);
  };
  function syncPowerButton() {
    append3.hidden = editing || viewEditing || active2;
    inputEvents.hidden = append3.hidden || options.document.floors.length < 2;
    const brightness = floorNavigationChoices(options.document.floors, properties.floorNumbers);
    options.groundReflections?.setOutsideFloor?.(activeFloorId === "all" ? brightness.find(([, arg12]) => arg12 === "1F")?.[0] || "" : null);
    const temperatureRatio = JSON.stringify(brightness);
    if (temperatureRatio !== markerProjectionKey) {
      markerProjectionKey = temperatureRatio;
      inputEvents.replaceChildren();
      for (const [floor, value16, title] of brightness) {
        const type8 = value130("button", "", value16);
        type8.type = "button";
        type8.dataset.floor = floor;
        type8.title = title;
        type8.setAttribute("aria-label", title);
        type8.addEventListener("click", () => updateMarkerPositions(floor));
        inputEvents.append(type8);
      }
    }
    for (const setAttribute of inputEvents.children) {
      setAttribute.setAttribute("aria-pressed", String(setAttribute.dataset.floor === activeFloorId));
    }
  }
  function updateMarkerPositions(floorSelection) {
    if (editing || viewEditing || active2 || toolbar || floorSelection === activeFloorId || floorSelection !== "all" && !options.document.floors.some(id26 => id26.id === floorSelection)) {
      return;
    }
    displayLightState(false);
    fn13({
      immediate: true
    });
    fn25();
    const containerRect = options.cameraState(true);
    const layoutWidth = options.getOrbitCenter?.();
    focusViewport = floorSelection;
    onMarkerPointerUp(() => {
      activeFloorId = floorSelection;
      const toPivot = options.transitionFloor ? options.transitionFloor(floorSelection) : (options.setFloor(floorSelection), options.getOrbitCenter?.());
      const value17 = value129(focusVignette.floorCameras?.[floorSelection] || (floorSelection === focusVignette.floorSelection ? focusVignette.camera : null), floorSelection);
      const value18 = value17 || options.floorDefaultCamera?.(floorSelection) || options.cameraState();
      baseCameraState = value17 || value18;
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
      options.restoreCamera(containerRect);
      fn7(value18, false, false, () => {
        options.finishFloorTransition?.();
        fn();
        queueOrSendCommand();
        collectMetadata();
        fn3();
      }, "floor", {
        fromPivot: layoutWidth,
        toPivot
      });
      markersSuppressedByActivity.clear();
      fn({
        immediate: true
      });
      fn20();
      fn4();
      syncIdleAvailability2();
    });
  }
  function onMarkerPointerMove(event) {
    const point = (active, error2 = "") => deviceStatus({
      type: "range-editor-state",
      active,
      ...(event ? {
        requestId: event
      } : {}),
      ...(error2 ? {
        error: error2
      } : {})
    });
    const value67 = markerFloorRef ? options.regionLighting ? presented ? toolbar ? "户型正在同步，请稍候再调整照射范围。" : viewEditing ? "请先完成户型视角调整，再编辑照射范围。" : "" : "户型还在加载，请稍候再调整照射范围。" : "请先选择轻量柔光模式。" : "请在已授权的控件编辑器中调整照射范围。";
    if (value67) {
      point(false, value67);
      return;
    }
    if (active2) {
      point(true);
      return;
    }
    fn13({
      immediate: true
    });
    active2 = true;
    markersConcealedAt = true;
    syncIdleAvailability2();
    pointerToFloorPoint();
    queueOrSendCommand();
    style4.style.display = "none";
    style4.setAttribute("inert", "");
    style5.style.display = "none";
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
          active2 = false;
          style4.style.display = "";
          style4.removeAttribute("inert");
          style5.style.display = "";
          fn({
            immediate: true
          });
          pointerToFloorPoint();
          queueOrSendCommand();
          fn4();
          updateMarkerPositions2(true);
          syncIdleAvailability2();
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
    } catch (message4) {
      markerDocRef?.close();
      active2 = false;
      style4.style.display = "";
      style4.removeAttribute("inert");
      style5.style.display = "";
      pointerToFloorPoint();
      queueOrSendCommand();
      syncIdleAvailability2();
      point(false, message4.message || "范围编辑暂时不可用");
    } finally {
      markersConcealedAt = false;
    }
  }
  const value140 = () => (properties.security?.presenceSensors || []).map(route => ({
    ...route,
    id: "presence:" + route.id,
    deviceKind: "presence",
    clickAction: "focus",
    x: route.route?.[0]?.x || 0,
    y: route.route?.[0]?.y || 0,
    height: (route.size ?? 1) * 0.7
  }));
  const value141 = arg53 => value139().find(id34 => id34.id === arg53) || value140().find(id35 => id35.id === arg53);
  function queueOrSendCommand() {
    fn9();
    syncMarkers();
    collectMetadata();
    if (!options.floorTransitionActive && presentedVisible?.owner !== "floor") {
      syncPresentationLayout();
      syncMarkerVisibility();
      syncPresentationChrome();
      onMarkerPointerCancel();
      const value38 = focusLight().filter(idleCameraBase);
      const filter = (editing ? [...value38, ...(["climate", "devices", "nas", "television", "vacuum"].includes(preFocusCamera) ? [] : clearFocus())] : [...syncIdleAvailability(), ...syncInputHold(), ...clearInputHold(), ...startCameraMotion(), ...tickCameraMotion()].map(deviceKind3 => ({
        ...deviceKind3,
        id: deviceKind3.deviceKind + ":" + deviceKind3.id
      })).concat(clearFocus())).filter(modelAvailable => modelAvailable.modelAvailable && idleCameraBase(modelAvailable));
      const enabled = pageDimming(properties, preFocusCamera, !!focusedLightId && frameLoop !== "panel");
      const enabled2 = !viewEditing && !active2 && enabled.enabled;
      const bindings = pageModelBindings(options.document.floors, filter, enabled.page, activeFloorId);
      isActive.setRoot(options.modelRoot, options.environmentRevision ?? options.sceneRevision);
      setRoot.setRoot(options.modelRoot, options.sceneRevision);
      isActive.setMode({
        enabled: enabled2,
        saturation: enabled.saturation,
        dimStrength: enabled2 ? enabled.strength : 0,
        bindings,
        animateBindings: !editing && !viewEditing,
        states,
        focusedId: focusedLightId,
        selectedId: editing ? selectedId : ""
      });
      setRoot.setState({
        enabled: !viewEditing && !active2,
        bindings: filter.filter(deviceKind5 => deviceKind5.deviceKind === "climate"),
        states,
        focusedId: focusedLightId,
        overview: !focusedLightId || frameLoop === "panel"
      });
      options.setEnvironmentActive?.(enabled2 || isActive.isActive);
    }
    const pending = focusLight().filter(idleCameraBase);
    hidden3.hidden = editing || viewEditing || active2;
    syncPowerButton();
    const baseCommand = activeFloorId === "all";
    const value68 = ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : "environment";
    hidden3.classList.toggle("is-all-floors", baseCommand);
    hidden3.style.setProperty("--i3d-tab-count", baseCommand ? "1" : String(controls.size));
    hidden3.style.setProperty("--i3d-selected-tab", String(baseCommand ? 0 : [...controls.keys()].indexOf(value68)));
    for (const [value55, hidden2] of controls) {
      const element = baseCommand && value55 !== "overview";
      if (element) {
        fn2(hidden2);
      }
      hidden2.hidden = element;
      hidden2.disabled = element;
      hidden2.setAttribute("aria-pressed", String(value55 === value68));
    }
    hidden4.hidden = hidden3.hidden || !activityVisible && (preFocusCamera === "security" ? (properties.security?.presenceSensors || []).some(idleCameraBase) : preFocusCamera === "overview" || preFocusCamera === "light" || pending.length > 0);
    hidden4.textContent = activityVisible ? "请选择楼层，再使用" + (controls.get(activityVisible)?.textContent || "控制") + "。" : preFocusCamera === "security" ? "尚未配置人在传感器，请在 3D 交互属性 → 安防 → 配置安防中添加。" : preFocusCamera === "vacuum" ? "尚未配置扫地机，请在 3D 交互属性 → 扫地机中选择设备。" : preFocusCamera === "devices" ? "尚未配置设备，请在 3D 交互属性 → 设备中添加 NAS 或电视。" : "尚未配置环境设备，请在 3D 交互属性 → 环境中添加空调或窗帘。";
  }
  let value142 = null;
  function finishCommand() {
    const pending = value142;
    value142 = null;
    if (pending) {
      pending.out?.cancel();
      pending.in?.cancel();
      pending.ghost.remove();
      removeAttribute.removeAttribute("inert");
    }
  }
  function onMarkerPointerUp(event) {
    const opacity = removeAttribute.animate ? getComputedStyle(removeAttribute) : null;
    const opacity2 = opacity ? Number(opacity.opacity) : 1;
    const transform = opacity?.transform || "none";
    finishCommand();
    if (!removeAttribute.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      event();
      return;
    }
    const setAttribute2 = removeAttribute.cloneNode(true);
    setAttribute2.setAttribute("aria-hidden", "true");
    setAttribute2.setAttribute("inert", "");
    setAttribute2.classList.add("i3d-module-outgoing");
    setAttribute2.style.pointerEvents = "none";
    for (const style3 of setAttribute2.querySelectorAll("button")) {
      style3.style.pointerEvents = "none";
      style3.removeAttribute("id");
    }
    removeAttribute.parentNode.append(setAttribute2);
    event();
    removeAttribute.setAttribute("inert", "");
    const out = value142 = {
      ghost: setAttribute2
    };
    out.out = setAttribute2.animate([{
      opacity: opacity2,
      transform
    }, {
      opacity: 0,
      transform: "translateY(14px)"
    }], {
      duration: 200,
      easing: "ease-in",
      fill: "forwards"
    });
    if (!removeAttribute.classList.contains("is-concealed")) {
      out.in = removeAttribute.animate([{
        opacity: 0,
        transform: "translateY(14px)"
      }, {
        opacity: 1,
        transform: "translateY(0)"
      }], {
        duration: 300,
        delay: 70,
        easing: "cubic-bezier(.22,.61,.36,1)",
        fill: "backwards"
      });
    }
    Promise.all([out.out.finished, out.in?.finished]).then(() => {
      if (value142 === out) {
        setAttribute2.remove();
        value142 = null;
        fn3();
      }
    }).catch(() => {});
  }
  function onParentMessage(event) {
    if (!editing && !viewEditing && !active2 && !toolbar && !!controls.has(event) && (activeFloorId !== "all" || event === "overview")) {
      activityVisible = "";
      if (event === preFocusCamera) {
        queueOrSendCommand();
        return;
      }
      if (presets) {
        displayLightState();
      }
      fn13();
      onMarkerPointerUp(() => {
        preFocusCamera = event;
        activity.activity();
        activity2.activity();
        activity3.activity();
        markersSuppressedByActivity.clear();
        queueOrSendCommand();
        fn20();
      });
    }
  }
  const focusedLightBinding2 = () => value141(focusedLightId);
  const value143 = arg54 => reject4.state(arg54, value128(arg54));
  function applySceneUpdate(scene) {
    const savedScene = value143(scene.entityId);
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
  function fn(kind) {
    const value69 = editing || viewEditing;
    const value70 = value69 && !viewEditing && frameLoop !== "edit" ? presentationScale?.id : null;
    options.setEditorEffects?.(value69, !!value70);
    if (!options.floorTransitionActive && presentedVisible?.owner !== "floor" || !!options.floorEffectsFollow) {
      options.setLightStates((properties.lights || []).filter(entityId7 => entityId7.entityId).map(id27 => {
        const value3 = applySceneUpdate(id27);
        return {
          ...id27,
          ...(editing && presentationScale?.id === id27.id ? value3 : lightRenderState(value3)),
          ...(value69 && id27.id !== value70 ? {
            on: false
          } : {})
        };
      }), value69 ? {
        ...kind,
        editor: true,
        immediate: true
      } : kind);
    }
  }
  function pointerToFloorPoint() {
    if (active2 || presets) {
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
  const value144 = () => value133(focusedLightBinding2()) && focusedLightBinding2()?.clickAction === "focus" ? 0 : Math.min(0.7, (classList5.getBoundingClientRect().width + previewState * 24) / Math.max(container.clientWidth, 1));
  function onMarkerPointerDown() {
    const light = container.getBoundingClientRect();
    const pointerPoint = focusedLightBinding?.width || light.width;
    const value71 = focusedLightBinding?.height || light.height;
    if (!(pointerPoint > 0) || !(value71 > 0) || !(light.width > 0) || !(light.height > 0)) {
      return;
    }
    previewState = light.width / pointerPoint;
    const value72 = (activeFloorId === "all" ? 1 : controls.size) * 50 + 6;
    const value73 = Math.min(2, (pointerPoint - 24) / value72);
    const value74 = Math.min(2, (value71 - 24) / (inputEvents.scrollHeight || 240));
    style4.style.setProperty("--i3d-navigation-scale", String(value73));
    style4.style.setProperty("--i3d-floor-scale", String(value74));
    const event = properties.navigation || {};
    const value75 = (style2, arg37, arg38, arg39, arg40, arg41) => {
      const value19 = (style2 === append3 ? value72 : style2.offsetWidth || arg40) * arg39;
      const value20 = (style2.offsetHeight || arg41) * arg39;
      const value21 = (arg13, arg14) => Number.isFinite(arg37?.[arg13]) ? Math.max(0, Math.min(100, arg37[arg13])) : arg14;
      const value22 = Math.max(12 + value19 / 2, Math.min(pointerPoint - 12 - value19 / 2, pointerPoint * value21("x", arg38[0]) / 100));
      const value23 = Math.max(12 + value20 / 2, Math.min(value71 - 12 - value20 / 2, value71 * value21("y", arg38[1]) / 100));
      style2.style.left = value22 + "px";
      style2.style.top = value23 + "px";
      return value23 - value20 / 2;
    };
    const value76 = value75(append3, event.categories, [50, 94], value73, 420, 36);
    const value77 = Number.isFinite(event.followOffset) ? Math.max(0, Math.min(300, event.followOffset)) : 16;
    const value78 = (append2.offsetHeight || 30) * value73;
    const value79 = value76 >= value78 + 12;
    append2.style.bottom = value79 ? "calc(100% + " + Math.min(value77, value76 - value78 - 12) / value73 + "px)" : "auto";
    append2.style.top = value79 ? "auto" : "calc(100% + 8px)";
    value75(inputEvents, event.floors, [96, 50], value74, 80, 120);
    const value80 = Math.max(12, Math.min(value71 * 0.56 - 400, value71 - 812));
    style4.style.setProperty("--i3d-navigation-bottom", Math.max(12, value76 - value73 * 50) + "px");
    classList5.style.setProperty("--i3d-control-top", value80 + "px");
    classList5.style.setProperty("--i3d-control-scale", String(Math.min(2, (pointerPoint - 32) / (classList5.offsetWidth || 360), Math.max(0.5, (value71 - value80 - 100) / (classList5.offsetHeight || 400)))));
    Object.assign(style4.style, {
      width: pointerPoint + "px",
      height: value71 + "px",
      transform: "scale(" + previewState + "," + light.height / value71 + ")"
    });
    if (presentedVisible?.focused) {
      presentedVisible.targetInset = value144();
    }
    if (frameLoop && frameLoop !== "panel" && !presentedVisible) {
      wakeFrameLoop = value144();
      options.setFocusViewport(wakeFrameLoop);
    }
    updateMarkerPositions2(true);
  }
  function fn2(contains, setAttribute3 = canvas) {
    const blur = document.activeElement;
    if (!!blur && !!contains.contains(blur)) {
      setAttribute3.setAttribute("tabindex", "-1");
      setAttribute3.focus({
        preventScroll: true
      });
      if (contains.contains(document.activeElement) && setAttribute3 !== canvas) {
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
  function fn3() {
    const value81 = !editing && !viewEditing && value139().some(visible => visible.visible !== false && visible.buttonHidden !== true && visible.hiddenClickable === true);
    const value82 = presentedVisible?.owner === "floor" || restoreViewButton || temperatureSlider || lightHistoryStorage && !value81 || activePointers && focusMode.hideIconsWhileRotating === true || !!frameLoop && !["edit", "panel"].includes(frameLoop);
    for (const [value56, classList3] of rawProperties) {
      const value39 = !editing && value141(value56)?.buttonHidden === true;
      const value40 = !editing && !viewEditing && !value39 && value141(value56)?.hiddenClickable === true;
      classList3.disabled = presentedVisible?.owner === "floor" || value39 || !editing && idleReturning();
      const deviceKind9 = value141(value56);
      const value41 = !editing && deviceKind9?.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind9, states).active;
      const append = value41 ? lampAura : removeAttribute;
      if (classList3.parentElement !== append) {
        append.append(classList3);
      }
      const value42 = presentedVisible?.owner === "floor" || !value41 && (lightHistoryStorage || temperatureSlider) && !value40 && !editing && !viewEditing;
      classList3.classList.toggle("is-hidden-clickable", value40);
      classList3.classList.toggle("is-idle-hidden", value42);
      if (value42 || value39 || !editing && idleReturning()) {
        fn2(classList3);
        classList3.setAttribute("inert", "");
      } else {
        classList3.removeAttribute("inert");
      }
      classList3.title = value40 ? "" : classList3.getAttribute("aria-label") || "";
    }
    if (value82) {
      fn2(removeAttribute, classList5.classList.contains("is-open") ? classList5 : canvas);
      removeAttribute.setAttribute("inert", "");
    } else if (value142) {
      removeAttribute.setAttribute("inert", "");
    } else {
      removeAttribute.removeAttribute("inert");
    }
    removeAttribute.removeAttribute("aria-hidden");
    if (value82 && currentCamera === null) {
      currentCamera = performance.now();
    } else if (!value82) {
      currentCamera = null;
    }
    removeAttribute.classList.toggle("is-concealed", value82);
  }
  function fn4() {
    const inert = !!focusedLightId && !!frameLoop && frameLoop !== "panel";
    for (const classList4 of [append3, inputEvents]) {
      classList4.classList.toggle("is-focus-hidden", inert);
      classList4.inert = inert;
      classList4.setAttribute("aria-hidden", String(inert));
    }
    const value83 = Number.isFinite(properties.popupOpacity) ? Math.max(0, Math.min(100, properties.popupOpacity)) : 74;
    classList5.style.setProperty("--i3d-panel-opacity", String(value83 / 100));
    const value84 = Number.isFinite(properties.focusVignetteStrength) ? Math.max(0, Math.min(60, properties.focusVignetteStrength)) : 14;
    style5.style.setProperty("--i3d-vignette-opacity", String(value84 / 100));
    style5.hidden = viewEditing || frameLoop === "edit" || frameLoop === "panel";
    style5.classList.toggle("is-active", value84 > 0 && !!focusedLightId && !!frameLoop && !style5.hidden);
    hidden5.hidden = !viewEditing && frameLoop !== "edit" && (!editing || !!frameLoop);
    hidden5.textContent = frameLoop === "edit" ? "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后保存" + (preFocusCamera === "television" ? "电视" : preFocusCamera === "nas" ? "NAS" : preFocusCamera === "cover" ? "窗帘" : preFocusCamera === "climate" ? "空调" : "此灯") + "视角。" : editing && !viewEditing ? "拖动空白处旋转 · 右键平移 · 滚轮缩放。临时查看不改变已保存视角。" : "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。";
    removeAttribute.classList.toggle("is-view-editing", viewEditing || frameLoop === "edit");
    classList5.classList.toggle("is-preview", editing);
    queueOrSendCommand();
    fn3();
  }
  function fn5(arg59) {
    if (!presentedVisible) {
      return;
    }
    const done = presentedVisible;
    const value85 = Math.max(0, arg59 - presentedVisible.started);
    const value86 = presentedVisible.duration ? Math.min(1, value85 / presentedVisible.duration) : 1;
    const value87 = presentedVisible.owner === "floor" ? value86 * value86 * (3 - value86 * 2) : value86 === 1 ? 1 : (1 - Math.exp(value85 * -5 / 1000)) / (1 - Math.exp(presentedVisible.duration * -5 / 1000));
    wakeFrameLoop = presentedVisible.inset + (presentedVisible.targetInset - presentedVisible.inset) * value87;
    const value88 = presentedVisible.sample(value85);
    if (presentedVisible.owner === "floor") {
      options.advanceFloorTransition?.(value87, value88);
    }
    if (options.applyCameraFrame) {
      options.applyCameraFrame(value88, value87, wakeFrameLoop);
    } else {
      options.applyCameraPose(value88, value87);
      options.setFocusViewport(wakeFrameLoop);
    }
    if (value86 === 1 && presentedVisible === done) {
      presentedVisible = null;
      options.endCameraMotion();
      pointerToFloorPoint();
      done.done?.();
      syncIdleAvailability2();
    }
  }
  function fn6(view) {
    if (view && view.view !== "top") {
      return {
        ...view,
        up: [0, 1, 0]
      };
    } else {
      return view;
    }
  }
  function fn7(arg60, focused2, arg61 = false, done2, owner = "focus", arg62 = null) {
    const mode = owner === "follow-return" ? arg60 : fn6(arg60);
    const from = options.beginCameraMotion(mode.mode, mode);
    if (owner === "floor") {
      options.setFloorSlideCameras?.(from, mode);
    }
    const duration = arg61 || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : owner === "floor" ? 650 : 1100;
    presentedVisible = {
      from,
      to: structuredClone(mode),
      inset: wakeFrameLoop,
      targetInset: focused2 ? value144() : 0,
      sample: createFocusCameraSampler(THREE, from, mode, duration, owner, arg62),
      focused: focused2,
      owner,
      started: performance.now(),
      duration,
      done: done2
    };
    syncIdleAvailability2();
    pointerToFloorPoint();
    fn5(presentedVisible.started);
    wake();
  }
  function fn8(mode2, mode3) {
    return mode2.mode === mode3.mode && Math.abs(mode2.zoom - mode3.zoom) < 0.000001 && ["position", "target", "up"].every(arg25 => (mode2[arg25] || [0, 1, 0]).every((arg15, arg16) => Math.abs(arg15 - (mode3[arg25] || [0, 1, 0])[arg16]) < 0.000001)) && ["frameSize", "focalLength"].every(arg32 => Math.abs((mode2[arg32] || 0) - (mode3[arg32] || 0)) < 0.000001);
  }
  const activity = createIdleRotation({
    returnToBase(arg42) {
      activePointers = true;
      activeKeys = structuredClone(focusMode.autoRotate.returnToDefault === true ? fn6(properties.camera || baseCameraState || options.cameraState()) : options.cameraState(true));
      const value24 = !!focusedLightId || !!frameLoop;
      focusedLightId = "";
      frameLoop = "";
      activityTracked = null;
      fn2(classList5);
      classList5.classList.remove("is-open");
      classList5.setAttribute("inert", "");
      fn4();
      if (value24) {
        deviceStatus({
          type: "focus-state",
          active: false
        });
      }
      options.setOrbitPivot(null);
      if (!presentedVisible && !wakeFrameLoop && fn8(options.cameraState(), activeKeys)) {
        arg42();
      } else {
        fn7(activeKeys, false, false, arg42, "idle");
      }
    },
    start() {
      userHeld = true;
      options.beginCameraMotion(activeKeys.mode);
      pointerToFloorPoint();
    },
    rotate(arg43) {
      options.applyCameraPose(options.orbitCameraPose(activeKeys, arg43));
    },
    stop() {
      const value25 = presentedVisible?.owner === "idle";
      const value26 = userHeld;
      userHeld = false;
      activePointers = false;
      temperatureSlider = false;
      hideIconsUntilDeg = 0;
      lightControls = options.camera.quaternion?.toArray?.().join(",") || "";
      fn3();
      if (value25) {
        presentedVisible = null;
      }
      if (value25 || value26) {
        options.endCameraMotion();
      }
      pointerToFloorPoint();
    }
  });
  const activity2 = createIdleIconVisibility({
    onChange(arg44) {
      lightHistoryStorage = arg44;
      fn3();
    }
  });
  const activity3 = createIdleFocusExit({
    onExit: () => fn13()
  });
  function fn9() {
    focusMode = resolvePageBehavior(properties, preFocusCamera);
    activity.configure(focusMode.autoRotate);
    activity2.configure(focusMode.idleHideIcons);
    activity3.configure(focusMode.idleExitFocus);
    pointerToFloorPoint();
    if (!focusMode.hideIconsWhileRotating) {
      temperatureSlider = false;
      hideIconsUntilDeg = 0;
    }
  }
  function syncIdleAvailability2() {
    const value89 = presented && idleIconsHidden && interactive && !editing && !viewEditing && !active2 && !document.hidden && !disposed;
    if (!value89) {
      fn12();
    }
    activity.setAvailable(value89 && !presets && !focusedLightId && !frameLoop && (!presentedVisible || presentedVisible.owner === "idle"));
    activity3.setAvailable(value89 && !!focusedLightId && ["runtime", "panel"].includes(frameLoop) && !presentedVisible);
    activity2.setAvailable(value89);
    markersById?.setAvailable(!document.hidden && (!pendingCommands || markerWorldCache));
    wake();
  }
  function fn10() {
    const value90 = lightStateCache || resolveLightState.size > 0 || effectPreview.size > 0;
    activity.hold(value90);
    activity2.hold(value90);
    activity3.hold(value90);
    wake();
  }
  function fn11(type11) {
    if (presets && type11.key === "Escape") {
      displayLightState();
    }
    lightPanelHeader = performance.now();
    restoreViewButton = false;
    fn3();
    if (type11.type === "pointerdown") {
      resolveLightState.add(type11.pointerId);
    }
    if (type11.type === "pointerup" || type11.type === "pointercancel") {
      resolveLightState.delete(type11.pointerId);
    }
    if (type11.type === "keydown") {
      effectPreview.add(type11.code || type11.key);
    }
    if (type11.type === "keyup") {
      effectPreview.delete(type11.code || type11.key);
    }
    fn10();
  }
  const value145 = ["pointerdown", "pointermove", "pointerup", "pointercancel", "wheel", "keydown", "keyup"];
  for (const value91 of value145) {
    window.addEventListener(value91, fn11, {
      capture: true,
      passive: true
    });
  }
  function fn12() {
    resolveLightState.clear();
    effectPreview.clear();
    lightStateCache = false;
    fn10();
  }
  window.addEventListener("blur", fn12);
  if (document.addEventListener) {
    document.addEventListener("visibilitychange", syncIdleAvailability2);
  }
  function fn13(immediate = {}) {
    if (focusedLightBinding2()?.deviceKind === "vacuum") {
      deviceStatus({
        type: "vacuum-popup-close"
      });
    }
    root4.hide();
    if (!focusedLightId && !frameLoop && (!activityTracked || immediate.immediate !== true)) {
      return;
    }
    const value92 = !!presentationScale;
    presentationScale = null;
    const value93 = !!frameLoop && !!editing;
    focusedLightId = "";
    frameLoop = "";
    fn2(classList5);
    classList5.classList.remove("is-open");
    classList5.setAttribute("inert", "");
    fn4();
    deviceStatus({
      type: "focus-state",
      active: false
    });
    if (activityTracked) {
      fn7(activityTracked, false, immediate.immediate === true, () => {
        activityTracked = null;
        options.setOrbitPivot(null);
      });
    }
    syncIdleAvailability2();
    if (value93) {
      deviceStatus({
        type: "edit",
        action: "focus-exited"
      });
    }
    if (value92) {
      fn();
    }
    pointerToFloorPoint();
  }
  function fn14(id41, arg63 = "runtime", arg64 = false) {
    const modelId3 = value141(id41);
    if (!modelId3 || modelId3.modelAvailable === false) {
      return;
    }
    if (presentationScale) {
      presentationScale = null;
      fn();
    }
    if (focusedLightId === id41 && frameLoop === arg63 && arg63 === "runtime") {
      fn13();
      return;
    }
    if (["runtime", "panel"].includes(arg63) && !interactive) {
      return;
    }
    activity3.activity();
    if (arg63 === "panel") {
      if (activityTracked || presentedVisible) {
        fn13({
          immediate: true
        });
      }
      focusedLightId = id41;
      frameLoop = "panel";
      window2.textContent = "";
      classList5.removeAttribute("inert");
      classList5.classList.add("is-open");
      fn4();
      syncLightPanel2();
      pointerToFloorPoint();
      syncIdleAvailability2();
      deviceStatus({
        type: "focus-state",
        active: false,
        panelOpen: true,
        id: id41
      });
      onUserInput(modelId3);
      return;
    }
    activityTracked ||= options.cameraState(true);
    const center = modelId3.deviceKind === "presence" ? hitRects.anchor(modelId3.id.slice(9)) : modelId3.modelId ? options.environmentModelPose?.(modelId3.floorId, modelId3.modelId) : null;
    const value94 = center?.center || options.worldPoint(modelId3.floorId, modelId3.x, modelId3.y, modelId3.height)?.toArray();
    if (!value94) {
      return;
    }
    focusedLightId = id41;
    frameLoop = arg63;
    window2.textContent = "";
    if (!value133(modelId3) || modelId3.clickAction !== "focus") {
      classList5.removeAttribute("inert");
      classList5.classList.add("is-open");
    } else {
      classList5.setAttribute("inert", "");
      classList5.classList.remove("is-open");
    }
    options.setOrbitPivot(null);
    fn4();
    syncLightPanel2();
    const value95 = properties.camera || baseCameraState || activityTracked;
    const value96 = modelId3.focusCamera || (modelId3.modelId ? automaticAirConditionerCamera(THREE, {
      ...value95,
      viewportAspect: canvas.clientWidth / Math.max(1, canvas.clientHeight)
    }, value94, center?.forward, center?.size, modelId3.deviceKind === "nas" ? {
      minimumFrameSize: 0.7,
      minimumDistance: 0.6
    } : {}) : automaticLightCamera(THREE, value95, value94));
    fn7(value96, true, arg64, () => onUserInput(modelId3));
    if (!editing) {
      deviceStatus({
        type: "focus-state",
        active: true,
        id: id41
      });
    }
  }
  type12.addEventListener("click", () => {
    if (frameLoop || activityTracked || presentedVisible) {
      fn13();
    } else {
      options.restoreCamera(fn6(properties.camera || baseCameraState));
    }
  });
  style6.addEventListener("click", () => {
    const entityId18 = focusedLightBinding2();
    if (entityId18) {
      sendLightCommand("power", !value143(entityId18.entityId).on);
    }
  });
  function fn15(on2) {
    const value97 = Number.isFinite(on2.effectColor) ? Math.max(0, Math.min(100, Number(on2.brightness) || 0)) : Math.max(1, Math.min(100, Number(on2.brightness) || (on2.brightnessSupported ? 1 : 100)));
    const value98 = (Math.max(2000, Math.min(6500, Number(on2.kelvin) || 3000)) - 2000) / 4500;
    const map4 = [255, 132, 42];
    const value99 = [172, 225, 255];
    const join = map4.map((arg33, arg34) => Math.round(arg33 + (value99[arg34] - arg33) * value98));
    style6.classList.toggle("is-on", on2.on);
    style6.setAttribute("aria-pressed", String(on2.on));
    style6.setAttribute("aria-label", "" + (focusedLightBinding2()?.label || on2.name) + (on2.available ? on2.on ? "已开启，点击关闭" : "已关闭，点击开启" : "当前不可用"));
    style6.style.setProperty("--i3d-lamp-color", Number.isFinite(on2.effectColor) ? "#" + on2.effectColor.toString(16).padStart(6, "0") : "rgb(" + join.join(",") + ")");
    style6.style.setProperty("--i3d-lamp-opacity", on2.on && value97 > 0 ? String(0.08 + value97 / 100 * 0.92) : "0");
    style6.style.setProperty("--i3d-lamp-scale", String(0.62 + value97 / 100 * 1.05));
  }
  function syncLightPanel2() {
    const entityId19 = focusedLightBinding2();
    if (["vacuum", "presence"].includes(entityId19?.deviceKind)) {
      classList5.classList.remove("is-open");
      classList5.setAttribute("inert", "");
      return;
    }
    const value100 = entityId19?.deviceKind === "nas";
    const value101 = entityId19?.deviceKind === "television";
    if (!value101 || !classList5.classList.contains("is-open")) {
      root4.hide();
    } else {
      root4.root.hidden = false;
    }
    root3.root.hidden = !value100;
    classList5.classList.toggle("is-nas-panel", value100);
    classList5.classList.toggle("is-television-panel", value101);
    if (value100 || value101) {
      classList5.classList.remove("is-cover-panel", "is-climate-panel", "has-light-controls", "has-error");
      classList5.setAttribute("aria-label", value101 ? "电视状态" : "NAS 状态");
      if (entityId19.clickAction === "focus") {
        classList5.classList.remove("is-open");
        classList5.setAttribute("inert", "");
      }
      root.root.hidden = root2.root.hidden = lightPanel2.hidden = append4.hidden = window2.hidden = true;
      if (value101) {
        if (entityId19.clickAction !== "focus" && classList5.classList.contains("is-open")) {
          root4.update({
            item: entityId19,
            states,
            editing: editing || !interactive
          });
        }
      } else {
        root3.update({
          item: entityId19,
          states
        });
      }
      return;
    }
    const value102 = entityId19?.deviceKind === "cover";
    const value103 = !!entityId19?.modelId && !value102;
    root.root.hidden = !value103;
    root2.root.hidden = !value102;
    lightPanel2.hidden = append4.hidden = window2.hidden = value103 || value102;
    classList5.classList.toggle("is-cover-panel", value102);
    classList5.classList.toggle("is-climate-panel", value103);
    classList5.setAttribute("aria-label", value102 ? "窗帘控制" : value103 ? "空调控制" : "灯光控制");
    if (!entityId19) {
      return fn13();
    }
    if (value102) {
      classList5.classList.remove("has-light-controls", "has-error");
      const available = coverState(entityId19.entityId, states[entityId19.entityId]);
      if (!entityId19.modelAvailable) {
        available.available = false;
      }
      const presentation = nextDelay.read(entityId19.entityId, available);
      root2.update({
        item: entityId19,
        state: available,
        presentation,
        editing,
        error: entityId19.modelAvailable ? presentation.error || "" : "窗帘模型已移除，请重新配置。"
      });
      return;
    }
    if (value103) {
      classList5.classList.remove("has-light-controls", "has-error");
      const available2 = climateState(entityId19.entityId, states[entityId19.entityId]);
      if (!entityId19.modelAvailable) {
        available2.available = false;
      }
      root.update({
        item: entityId19,
        state: available2,
        editing,
        error: entityId19.modelAvailable ? "" : "空调模型已移除，请重新配置。"
      });
      return;
    }
    let available3 = applySceneUpdate(entityId19);
    const value104 = editing && presentationScale?.id === entityId19.id;
    let min = 1;
    let max = 100;
    if (value104) {
      const value43 = {
        ...entityId19,
        ...available3
      };
      const kelvin2 = options.mapLightEffectState(value43);
      const brightness2 = options.mapLightEffectState({
        ...value43,
        brightness: 1,
        kelvin: available3.minimum
      });
      const brightness3 = options.mapLightEffectState({
        ...value43,
        brightness: 100,
        kelvin: available3.maximum
      });
      min = brightness2.brightness;
      max = brightness3.brightness;
      available3 = {
        ...available3,
        brightness: Number.isFinite(kelvin2.brightness) ? Math.round(kelvin2.brightness) : kelvin2.brightness,
        kelvin: Number.isFinite(kelvin2.kelvin) ? Math.round(kelvin2.kelvin) : kelvin2.kelvin,
        minimum: brightness2.kelvin,
        maximum: brightness3.kelvin,
        effectColor: options.lightEffectColorHex(kelvin2.kelvin)
      };
    }
    lightHeadingText.textContent = entityId19.label || available3.name;
    powerButton.textContent = value104 ? "效果预览" : entityId19.entityId ? available3.available ? available3.on ? "已开启" : "已关闭" : "设备不可用" : "尚未绑定设备";
    lightHeadingText.title = lightHeadingText.textContent;
    window2.title = window2.textContent;
    fn15(available3);
    powerButton.classList.toggle("is-on", available3.available && available3.on);
    const value105 = [...sceneUpdating.values()].some(entityId14 => entityId14.entityId === entityId19.entityId);
    classList5.classList.toggle("is-command-pending", value105 && available3.available && !editing);
    classList5.setAttribute("aria-busy", String(value105));
    const value106 = available3.available && available3.on && (available3.brightnessSupported || available3.temperatureSupported);
    classList5.classList.toggle("has-light-controls", value106);
    classList5.classList.toggle("has-error", !!window2.textContent);
    if (value106) {
      append4.removeAttribute("inert");
    } else {
      fn2(append4, classList5);
      append4.setAttribute("inert", "");
    }
    append4.removeAttribute("aria-hidden");
    style6.disabled = editing || !available3.available;
    input3.input.min = min;
    input3.input.max = max;
    input2.input.min = available3.minimum;
    input2.input.max = available3.maximum;
    for (const [input, value57, value58, value59] of [[input3, available3.brightnessSupported, available3.brightness, "%"], [input2, available3.temperatureSupported, available3.kelvin, " K"]]) {
      input.root.hidden = !value57;
      input.input.disabled = editing || !available3.available || !available3.on;
      if (document.activeElement !== input.input) {
        input.input.value = value58 ?? (input === input3 ? 100 : available3.minimum);
        input.value.value = value58 === null ? "—" : "" + value58 + value59;
      }
    }
    setAttribute5.hidden = !available3.brightnessSupported && !available3.temperatureSupported;
    for (const button of value131) {
      const value44 = Math.round(available3.minimum + (available3.maximum - available3.minimum) * button.temperaturePercent / 100);
      const value45 = !value104 && available3.on && (!available3.brightnessSupported || Math.abs(available3.brightness - button.brightness) <= 4) && (!available3.temperatureSupported || Math.abs(available3.kelvin - value44) <= Math.max(50, (available3.maximum - available3.minimum) * 0.06));
      button.button.disabled = editing || !available3.available || !available3.on || setAttribute5.hidden;
      button.button.classList.toggle("is-active", value45);
      button.button.setAttribute("aria-pressed", String(value45));
      button.detail.textContent = available3.brightnessSupported ? button.brightness + "%" : "开启";
    }
  }
  function fn16(command, previewToken) {
    const requestId4 = String(++controlRequestSeq);
    const entityId20 = command.entityId;
    reject4.retain(entityId20, previewToken);
    const timeout7 = setTimeout(() => fn18(requestId4, "请求超时，请检查设备状态。", true), 14000);
    sceneUpdating.set(requestId4, {
      entityId: entityId20,
      command,
      previewToken,
      timeout: timeout7,
      next: null
    });
    deviceStatus({
      type: "control",
      requestId: requestId4,
      command
    });
  }
  function fn17(data3, previewToken2) {
    const next2 = [...sceneUpdating.values()].find(entityId15 => entityId15.entityId === data3.entityId);
    if (!next2) {
      return fn16(data3, previewToken2);
    }
    const service2 = next2.next?.command || next2.command;
    if (service2.service === "turn_on" && data3.service === "turn_on") {
      const brightness4 = {
        ...service2.data
      };
      if ("brightness" in data3.data || "brightness_pct" in data3.data) {
        delete brightness4.brightness;
        delete brightness4.brightness_pct;
      }
      data3 = {
        ...data3,
        data: {
          ...brightness4,
          ...data3.data
        }
      };
    }
    next2.next = {
      command: data3,
      previewToken: previewToken2
    };
    reject4.hold(data3.entityId, previewToken2);
  }
  function fn18(arg65, arg66 = "", arg67 = false) {
    const entityId21 = sceneUpdating.get(arg65);
    if (!entityId21) {
      return;
    }
    clearTimeout(entityId21.timeout);
    sceneUpdating.delete(arg65);
    const previewToken3 = entityId21.next;
    const value107 = previewToken3 && !arg67 && !disposed && !editing && interactive && preFocusCamera === "light" && activeFloorId !== "all" && (properties.lights || []).some(entityId9 => idleCameraBase(entityId9) && entityId9.entityId === entityId21.entityId) && value128(entityId21.entityId).available;
    if (arg66) {
      reject4.reject(entityId21.entityId, entityId21.previewToken);
    } else {
      reject4.acknowledge(entityId21.entityId, entityId21.previewToken);
    }
    if (value107) {
      fn16(previewToken3.command, previewToken3.previewToken);
    } else if (previewToken3) {
      reject4.reject(entityId21.entityId, previewToken3.previewToken);
    }
    if (focusedLightBinding2()?.entityId === entityId21.entityId) {
      window2.textContent = value107 ? "" : arg66;
    }
    fn20();
  }
  async function sendLightCommand(arg68, brightness5, entityId22 = focusedLightBinding2()) {
    if (!!entityId22 && !editing && !disposed) {
      try {
        const brightnessSupported = value128(entityId22.entityId);
        let data2;
        let kelvin = brightness5;
        if (arg68 === "preset") {
          if (!lightPresets.includes(brightness5)) {
            throw new Error("灯光预设无效。");
          }
          const push = [];
          kelvin = {};
          if (brightnessSupported.brightnessSupported) {
            push.push(["brightness", brightness5.brightness]);
            kelvin.brightness = brightness5.brightness;
          }
          if (brightnessSupported.temperatureSupported) {
            kelvin.kelvin = Math.round(brightnessSupported.minimum + (brightnessSupported.maximum - brightnessSupported.minimum) * brightness5.temperaturePercent / 100);
            push.push(["temperature", kelvin.kelvin]);
          }
          if (!push.length) {
            throw new Error("此设备不支持灯光预设。");
          }
          const map = push.map(([arg8, arg9]) => lightCommand(entityId22.entityId, arg8, arg9, brightnessSupported));
          data2 = {
            ...map[0],
            data: Object.assign({}, ...map.map(data => data.data))
          };
          if (brightnessSupported.brightnessSupported && brightness5.brightness < 100) {
            delete data2.data.brightness;
            data2.data.brightness_pct = brightness5.brightness;
          }
        } else {
          data2 = lightCommand(entityId22.entityId, arg68, brightness5, brightnessSupported);
        }
        const value7 = reject4.set(entityId22.entityId, arg68, kelvin, true);
        fn({
          preview: arg68 !== "power"
        });
        fn17(data2, value7);
        window2.textContent = "";
        fn20();
      } catch (message3) {
        window2.textContent = message3.message;
        syncLightPanel2();
      }
    }
  }
  function fn19(id42, arg69 = false) {
    if (!editing && (idleReturning() || activeFloorId === "all")) {
      return;
    }
    const entityId23 = value141(id42);
    if (!entityId23 || entityId23.modelAvailable === false || presets && !editing) {
      return;
    }
    const value108 = entityId23.clickAction || "focus";
    if (editing) {
      selectedId = id42;
      deviceStatus({
        type: "edit",
        action: "select",
        id: id42
      });
      fn20();
      return;
    }
    if (entityId23.deviceKind === "vacuum-room") {
      if (!interactive || !entityId23.entityId || entryMap.has(id42)) {
        return;
      }
      const value46 = setTimeout(() => {
        entryMap.delete(id42);
        const disabled = rawProperties.get(id42);
        if (disabled) {
          disabled.disabled = false;
          disabled.title = "请求超时，请检查设备状态";
        }
      }, 14000);
      entryMap.set(id42, value46);
      if (rawProperties.get(id42)) {
        rawProperties.get(id42).disabled = true;
      }
      deviceStatus({
        type: "vacuum-room",
        id: id42,
        vacuumId: entityId23.vacuumId,
        shortcutId: entityId23.shortcutId
      });
      return;
    }
    if (value133(entityId23)) {
      const value47 = arg69 && entityId23.deviceKind === "vacuum" && vacuumStatusPresentation(entityId23, states).active;
      fn14(id42, value47 || entityId23.clickAction === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId23.deviceKind === "cover") {
      fn14(id42, value108 === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId23.modelId) {
      if (value108 === "turn-on") {
        root.update({
          item: entityId23,
          state: climateState(entityId23.entityId, states[entityId23.entityId]),
          editing
        });
        root.power?.({
          toggle: true
        });
        return;
      }
      fn14(id42, value108 === "turn-on-panel" ? "panel" : "runtime");
      if (value108 !== "focus" && focusedLightId === id42) {
        root.power?.({
          toggle: false
        });
      }
      return;
    }
    const available4 = value143(entityId23.entityId);
    if (value108 === "turn-on") {
      if (available4.available) {
        sendLightCommand("power", !available4.on, entityId23);
      }
      return;
    }
    if (value108 === "turn-on-panel") {
      fn14(id42, "panel");
      if (available4.available && !available4.on) {
        sendLightCommand("power", true, entityId23);
      }
      return;
    }
    fn14(id42);
    if (focusedLightId === id42 && frameLoop === "runtime" && value108 === "turn-on-focus" && available4.available && !available4.on) {
      sendLightCommand("power", true);
    }
  }
  let value146 = "";
  function updateMarkerPositions2(arg70 = false) {
    if (active2 || toolbar || disposed) {
      return;
    }
    if (currentCamera !== null && performance.now() - currentCamera >= 240 && !value139().some(deviceKind7 => deviceKind7.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind7, states).active)) {
      value146 = "";
      return;
    }
    options.camera.updateMatrixWorld();
    if (lastUserActivityAt !== options.document || transformCamera !== activeFloorId) {
      markersSuppressedByActivity.clear();
      lastUserActivityAt = options.document;
      transformCamera = activeFloorId;
    }
    const width = focusedLightBinding || container.getBoundingClientRect();
    const value109 = focusedLightBinding?.width || width.width;
    const value110 = focusedLightBinding?.height || width.height;
    const value111 = value109 + ":" + value110 + ":" + options.camera.matrixWorld.elements + ":" + options.camera.projectionMatrix.elements;
    if (arg70 === true || value111 !== value146) {
      value146 = value111;
      for (const id39 of value139()) {
        const floorId5 = dragState?.id === id39.id ? {
          ...id39,
          ...dragState.point
        } : id39;
        const value8 = floorId5.id;
        const hidden = rawProperties.get(value8);
        if (!hidden) {
          continue;
        }
        const value9 = (editing || floorId5.visible !== false) && (editing || floorId5.buttonHidden !== true) && floorId5.modelAvailable !== false && (activeFloorId === "all" || floorId5.floorId === activeFloorId);
        let floorId6 = markersSuppressedByActivity.get(value8);
        if (value9 && (!floorId6 || floorId6.floorId !== floorId5.floorId || floorId6.x !== floorId5.x || floorId6.y !== floorId5.y || floorId6.height !== floorId5.height)) {
          floorId6 = {
            floorId: floorId5.floorId,
            x: floorId5.x,
            y: floorId5.y,
            height: floorId5.height,
            point: options.worldPoint(floorId5.floorId, floorId5.x, floorId5.y, floorId5.height)
          };
          markersSuppressedByActivity.set(value8, floorId6);
        }
        const value10 = value9 && floorId6?.point;
        if (!value10) {
          hidden.hidden = true;
          continue;
        }
        const z3 = deferredMessage.copy(value10).project(options.camera);
        hidden.hidden = z3.z < -1 || z3.z > 1 || Math.abs(z3.x) > 1.05 || Math.abs(z3.y) > 1.05;
        hidden.style.left = (z3.x + 1) * value109 / 2 + "px";
        hidden.style.top = (1 - z3.y) * value110 / 2 + "px";
      }
    }
  }
  function fn20() {
    if (toolbar) {
      return;
    }
    wake();
    const has = new Set(value139().map(id32 => id32.id));
    for (const [value60, remove] of rawProperties) {
      if (!has.has(value60)) {
        remove.remove();
        rawProperties.delete(value60);
        markersSuppressedByActivity.delete(value60);
      }
    }
    for (const deviceKind11 of value139()) {
      let classList2 = rawProperties.get(deviceKind11.id);
      if (!classList2) {
        classList2 = value130("button", "i3d-marker");
        classList2.type = "button";
        classList2.addEventListener("click", stopPropagation => {
          stopPropagation.stopPropagation();
          if (!toolbar && !viewEditing && frameLoop !== "edit" && (!!editing || value141(deviceKind11.id)?.buttonHidden !== true)) {
            if (classList2.dataset.dragged === "true") {
              classList2.dataset.dragged = "";
              return;
            }
            fn19(deviceKind11.id, true);
          }
        });
        classList2.addEventListener("pointerdown", arg17 => fn22(arg17, deviceKind11.id));
        classList2.addEventListener("pointermove", fn23);
        classList2.addEventListener("pointerup", fn24);
        classList2.addEventListener("pointercancel", fn25);
        removeAttribute.append(classList2);
        rawProperties.set(deviceKind11.id, classList2);
      }
      const slice2 = /^mdi:[a-z0-9-]+$/.test(deviceKind11.icon || "") ? deviceKind11.icon : "";
      const value48 = deviceKind11.deviceKind === "vacuum";
      const value49 = deviceKind11.deviceKind === "vacuum-room";
      if (!value48 && classList2.dataset.icon !== slice2) {
        classList2.dataset.icon = slice2;
        if (slice2) {
          const style = value130("span", "i3d-marker-icon");
          style.setAttribute("aria-hidden", "true");
          style.style.maskImage = "url(\"/bridge-static/vendor/mdi/7.4.47/svg/" + slice2.slice(4) + ".svg\")";
          style.style.webkitMaskImage = style.style.maskImage;
          classList2.replaceChildren(style);
        } else {
          classList2.innerHTML = defaultMarkerSvg;
        }
      }
      const on = deviceKind11.deviceKind?.startsWith("vacuum") ? {
        available: !!states[deviceKind11.entityId] && !["unknown", "unavailable"].includes(states[deviceKind11.entityId].state),
        on: states[deviceKind11.entityId]?.state === "cleaning"
      } : deviceKind11.deviceKind === "television" ? televisionState(deviceKind11, states) : deviceKind11.deviceKind === "nas" ? nasDeviceState(deviceKind11, states) : deviceKind11.deviceKind === "cover" ? coverState(deviceKind11.entityId, states[deviceKind11.entityId]) : deviceKind11.modelId ? climateState(deviceKind11.entityId, states[deviceKind11.entityId]) : value143(deviceKind11.entityId);
      const value50 = Number.isFinite(deviceKind11.size) && deviceKind11.size > 0 ? deviceKind11.size : 44;
      const value51 = Number.isFinite(deviceKind11.iconSize) && deviceKind11.iconSize > 0 ? deviceKind11.iconSize : value48 ? 26 : Math.min(value50, Math.max(4, value50 - 18));
      const value52 = Number.isFinite(deviceKind11.hitSize) && deviceKind11.hitSize > 0 ? deviceKind11.hitSize : Math.max(44, value50);
      classList2.style.width = classList2.style.height = value52 + "px";
      classList2.classList.toggle("is-vacuum-status", value48);
      classList2.classList.toggle("is-overview-quip", deviceKind11.overviewQuip === true);
      if (value48) {
        let querySelector = classList2.querySelector(".i3d-vacuum-status");
        if (!querySelector || querySelector.dataset.compact !== String(deviceKind11.overviewQuip === true)) {
          querySelector = value130("span", "i3d-vacuum-status");
          querySelector.dataset.compact = String(deviceKind11.overviewQuip === true);
          if (!deviceKind11.overviewQuip) {
            querySelector.append(value130("strong", "i3d-vacuum-status-name"), value130("span", "i3d-vacuum-status-detail"));
            querySelector.lastElementChild.append(value130("span", "i3d-vacuum-status-text"), value130("span", "i3d-vacuum-status-battery"));
          }
          querySelector.append(value130("span", "i3d-vacuum-quip"));
          classList2.replaceChildren(querySelector);
        }
        const status = vacuumStatusPresentation(deviceKind11, states);
        const value11 = value50 / 44;
        if (!deviceKind11.overviewQuip) {
          querySelector.querySelector(".i3d-vacuum-status-name").textContent = deviceKind11.label || "扫地机器人";
          querySelector.querySelector(".i3d-vacuum-status-text").textContent = status.status;
          querySelector.querySelector(".i3d-vacuum-status-battery").textContent = status.battery;
        }
        const textContent = querySelector.querySelector(".i3d-vacuum-quip");
        textContent.textContent = status.active ? vacuumQuip(deviceKind11, states, performance.now()) : "";
        textContent.hidden = !textContent.textContent;
        querySelector.style.transform = "translate(-50%,-50%) scale(" + value11 + ")";
        querySelector.style.fontSize = Math.max(8, value51 / 2) + "px";
        const value12 = Math.max(deviceKind11.overviewQuip ? 28 : 50, querySelector.offsetHeight);
        classList2.style.width = Math.max(value52, value11 * 140) + "px";
        classList2.style.height = Math.max(value52, value12 * value11) + "px";
        classList2.dataset.status = status.status;
        classList2.title = (deviceKind11.label || "扫地机器人") + " · " + status.status + " · " + status.battery;
        on.on = status.active;
        on.available = status.available;
      }
      classList2.classList.toggle("i3d-vacuum-room", value49);
      classList2.classList.toggle("is-icon-hidden", value49 && deviceKind11.iconHidden === true);
      if (value49) {
        let textContent2 = classList2.querySelector(".i3d-room-label");
        if (!textContent2) {
          textContent2 = value130("span", "i3d-room-label");
          classList2.append(textContent2);
        }
        textContent2.textContent = deviceKind11.label || "清扫";
        textContent2.hidden = deviceKind11.labelHidden === true;
        textContent2.style.fontSize = (deviceKind11.fontSize || 12) + "px";
      }
      classList2.style.setProperty("--i3d-marker-size", value50 + "px");
      classList2.style.setProperty("--i3d-marker-icon-size", value51 + "px");
      classList2.setAttribute("aria-label", deviceKind11.overviewQuip ? vacuumQuip(deviceKind11, states, performance.now()) : deviceKind11.label || on.name || "灯光");
      if (!value48) {
        classList2.title = deviceKind11.label || on.name;
      }
      classList2.classList.toggle("is-on", deviceKind11.deviceKind === "cover" ? coverIconIsOn(deviceKind11, on) : on.on);
      classList2.classList.toggle("is-offline", !editing && !on.available);
      classList2.classList.toggle("is-nas", deviceKind11.deviceKind === "nas");
      classList2.classList.toggle("is-selected", editing && selectedId === deviceKind11.id);
    }
    fn();
    queueOrSendCommand();
    syncLightPanel2();
    onMarkerPointerDown();
    fn3();
    updateMarkerPositions2(true);
  }
  function fn21(clientX2, floorId9) {
    const y2 = options.worldPoint(floorId9.floorId, 0, 0, floorId9.height);
    if (!y2) {
      return null;
    }
    const left = container.getBoundingClientRect();
    const setFromCamera = new THREE.Raycaster();
    setFromCamera.setFromCamera(new THREE.Vector2((clientX2.clientX - left.left) / left.width * 2 - 1, 1 - (clientX2.clientY - left.top) / left.height * 2), options.camera);
    const sub = setFromCamera.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -y2.y), new THREE.Vector3());
    if (!sub) {
      return null;
    }
    const lengthSq = options.worldPoint(floorId9.floorId, 1, 0, floorId9.height).sub(y2);
    const lengthSq2 = options.worldPoint(floorId9.floorId, 0, 1, floorId9.height).sub(y2);
    const dot = sub.sub(y2);
    return {
      x: Math.round(dot.dot(lengthSq) / lengthSq.lengthSq() * 100) / 100,
      y: Math.round(dot.dot(lengthSq2) / lengthSq2.lengthSq() * 100) / 100
    };
  }
  function fn22(pointerId2, id43) {
    if (!editing || frameLoop || pointerId2.button !== 0) {
      return;
    }
    pointerId2.preventDefault();
    pointerId2.stopPropagation();
    const x15 = value141(id43);
    if (!x15) {
      return;
    }
    selectedId = id43;
    queueOrSendCommand();
    deviceStatus({
      type: "edit",
      action: "select",
      id: id43
    });
    const x16 = fn21(pointerId2, x15);
    dragState = {
      id: id43,
      pointerId: pointerId2.pointerId,
      clientX: pointerId2.clientX,
      clientY: pointerId2.clientY,
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
    pointerId2.currentTarget.setPointerCapture(pointerId2.pointerId);
    options.controls.enabled = false;
  }
  function fn23(pointerId3) {
    if (!dragState || dragState.pointerId !== pointerId3.pointerId || Math.hypot(pointerId3.clientX - dragState.clientX, pointerId3.clientY - dragState.clientY) < 4 && !dragState.moved) {
      return;
    }
    const x17 = fn21(pointerId3, value141(dragState.id));
    if (x17) {
      dragState.moved = true;
      dragState.point = {
        x: Math.round((x17.x + dragState.offset.x) * 100) / 100,
        y: Math.round((x17.y + dragState.offset.y) * 100) / 100
      };
      if (preFocusCamera === "light") {
        Object.assign(value141(dragState.id), dragState.point);
      }
      updateMarkerPositions2(true);
    }
  }
  function fn24(pointerId4) {
    if (!!dragState && dragState.pointerId === pointerId4.pointerId) {
      if (dragState.moved) {
        pointerId4.currentTarget.dataset.dragged = "true";
        const deviceKind8 = value141(dragState.id);
        const value13 = deviceKind8.deviceKind === "vacuum-room" ? properties.devices?.vacuums?.find(id6 => id6.id === deviceKind8.vacuumId)?.shortcuts?.find(id14 => id14.id === deviceKind8.shortcutId) : preFocusCamera === "light" ? deviceKind8 : (["nas", "television", "vacuum"].includes(preFocusCamera) ? properties.devices?.[preFocusCamera === "vacuum" ? "vacuums" : preFocusCamera === "television" ? "televisions" : "nas"] || [] : properties.environment?.[preFocusCamera === "cover" ? "curtains" : "airConditioners"] || []).find(id12 => id12.id === dragState.id);
        if (value13) {
          Object.assign(value13, dragState.point);
        }
        deviceStatus({
          type: "edit",
          action: "position",
          id: deviceKind8.id,
          x: dragState.point.x,
          y: dragState.point.y
        });
      }
      dragState = null;
      pointerToFloorPoint();
    }
  }
  function fn25() {
    if (dragState && preFocusCamera === "light") {
      Object.assign(value141(dragState.id), dragState.original);
    }
    dragState = null;
    pointerToFloorPoint();
    updateMarkerPositions2(true);
  }
  let id44;
  canvas.addEventListener("pointerdown", button2 => {
    id44 = (button2.button == null || button2.button === 0) && button2.isPrimary !== false ? {
      x: button2.clientX,
      y: button2.clientY,
      id: button2.pointerId,
      moved: false
    } : null;
  });
  canvas.addEventListener("pointermove", pointerId => {
    if (id44 && (pointerId.pointerId !== id44.id || Math.hypot(pointerId.clientX - id44.x, pointerId.clientY - id44.y) >= 5)) {
      id44.moved = true;
    }
  });
  canvas.addEventListener("pointercancel", () => {
    id44 = null;
  });
  canvas.addEventListener("pointerup", clientX => {
    const value61 = id44 && !id44.moved && id44.id === clientX.pointerId && Math.hypot(clientX.clientX - id44.x, clientX.clientY - id44.y) < 5;
    id44 = null;
    if (!!value61 && !presets && frameLoop !== "edit") {
      if (!editing && !viewEditing && interactive && !presentedVisible) {
        const value4 = hitRects.pick(clientX.clientX, clientX.clientY, options.camera, canvas, properties.security?.presenceSensors || []);
        if (value4) {
          fn14("presence:" + value4);
          return;
        }
      }
      if (!idleReturning() && preFocusCamera !== "light" && !viewEditing && !presentedVisible && (editing || interactive)) {
        const floorId3 = options.pickEnvironmentModel?.(clientX.clientX, clientX.clientY, value139(), clientX.pointerType === "touch" ? 10 : 5);
        const id28 = floorId3 && value139().find(floorId => floorId.floorId === floorId3.floorId && floorId.modelId === floorId3.modelId);
        if (id28) {
          fn19(id28.id);
          return;
        }
      }
      fn13();
    }
  });
  window.addEventListener("keydown", key => {
    if (key.key === "Escape") {
      fn13();
    }
  });
  function fn26(data4) {
    if (data4.origin !== location.origin || data4.source !== window.parent || data4.data?.channel !== "hb-i3d-v1") {
      return;
    }
    const requestId5 = data4.data;
    wake();
    if (requestId5.type === "presentation-layout") {
      if (Number.isFinite(requestId5.width) && requestId5.width > 0 && Number.isFinite(requestId5.height) && requestId5.height > 0) {
        focusedLightBinding = {
          width: requestId5.width,
          height: requestId5.height
        };
        onMarkerPointerDown();
      }
    } else if (requestId5.type === "config") {
      if (toolbar) {
        lightPanel = data4;
        return;
      }
      lightPreview = requestId5.rangeEditorOnly === true;
      markerFloorRef = requestId5.allowRangeEditing === true || requestId5.editing === true;
      if (active2 && (!markerFloorRef || requestId5.viewEditing === true || requestId5.properties?.lightingMode !== "region" || requestId5.properties?.floorSelection !== focusVignette.floorSelection || JSON.stringify(requestId5.properties?.camera) !== JSON.stringify(focusVignette.camera) || JSON.stringify(requestId5.properties?.lightRegionOverrides || {}) !== JSON.stringify(focusVignette.lightRegionOverrides || {}))) {
        markerDocRef?.close();
      }
      restoreViewButton = false;
      if (requestId5.editing || requestId5.viewEditing || focusVignette.floorSelection !== requestId5.properties.floorSelection || JSON.stringify(focusVignette.floorCameras) !== JSON.stringify(requestId5.properties.floorCameras)) {
        focusViewport = "";
        activityVisible = "";
      }
      focusVignette = structuredClone(requestId5.properties);
      if (!idleRotating && !requestId5.editing && !requestId5.viewEditing) {
        idleRotating = true;
        if (options.document.floors.length > 1) {
          focusViewport = "all";
        }
      }
      if (focusViewport && focusViewport !== "all" && !options.document.floors.some(id24 => id24.id === focusViewport)) {
        focusViewport = "";
      }
      if (requestId5?.editing || requestId5?.viewEditing || focusVignette.floorSelection !== properties.floorSelection && !focusViewport) {
        options.finishFloorTransition?.();
      }
      options.setFloorGap?.(focusVignette.floorGap);
      requestId5.properties = transformProperties({
        ...focusVignette,
        ...(focusViewport ? {
          floorSelection: focusViewport
        } : {})
      });
      if (focusViewport && baseCameraState) {
        requestId5.properties.camera = baseCameraState;
      } else if (focusViewport && focusViewport !== focusVignette.floorSelection) {
        requestId5.properties.camera = value129(focusVignette.floorCameras?.[focusViewport] || null, focusViewport);
      }
      activity.activity();
      activity2.activity();
      activity3.activity();
      const value27 = viewEditing && requestId5.viewEditing !== true || JSON.stringify(properties.camera) !== JSON.stringify(requestId5.properties.camera);
      if ((frameLoop || activityTracked || presentedVisible) && (value27 || properties.floorSelection !== requestId5.properties.floorSelection || editing !== (requestId5.editing === true) || requestId5.viewEditing === true || editing && selectedId !== (requestId5.selectedId || ""))) {
        fn13({
          immediate: true
        });
      }
      properties = structuredClone(requestId5.properties);
      editing = requestId5.editing === true;
      viewEditing = requestId5.viewEditing === true;
      selectedId = requestId5.selectedId || "";
      states = requestId5.states || {};
      interactive = !editing && requestId5.interactive === true;
      cameraMotion = requestId5.editingVacuumId || "";
      const value28 = editing ? ["security", "climate", "cover", "nas", "television", "vacuum", "vacuum-shortcut"].includes(requestId5.editingModule) ? requestId5.editingModule : "light" : ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : ["nas", "television"].includes(preFocusCamera) ? "devices" : "environment";
      if (preFocusCamera !== value28) {
        fn13({
          immediate: true
        });
        preFocusCamera = value28;
      }
      for (const next of sceneUpdating.values()) {
        if (next.next && (!interactive || !(properties.lights || []).some(entityId3 => entityId3.entityId === next.entityId))) {
          reject4.reject(next.entityId, next.next.previewToken);
          next.next = null;
        }
      }
      fn9();
      syncIdleAvailability2();
      options.appearance(active2 ? {
        ...properties,
        lightRegionOverrides: options.regionLighting.getOverrides()
      } : properties);
      const value29 = options.document.floors.some(id15 => id15.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
      if (!editing && value29 === "all" && !idleReturning()) {
        preFocusCamera = "overview";
      }
      if (activeFloorId !== value29) {
        displayLightState(false);
        activeFloorId = value29;
        options.setFloor(value29);
        options.restoreCamera(fn6(properties.camera || options.floorDefaultCamera?.(value29)));
        baseCameraState = options.cameraState();
      } else if (value27) {
        options.restoreCamera(fn6(properties.camera || baseCameraState));
        baseCameraState = options.cameraState();
      }
      pointerToFloorPoint();
      append2.hidden = true;
      fn4();
      if (viewEditing || !editing && !interactive) {
        fn13({
          immediate: true
        });
      }
      fn20();
      const value30 = ++presentGeneration;
      (presented ? Promise.resolve() : options.whenPresented()).then(() => {
        if (!disposed && value30 === presentGeneration) {
          presented = true;
          syncIdleAvailability2();
          updateMarkerPositions2(true);
          deviceStatus({
            type: "presented",
            configId: requestId5.configId,
            camera: value129(options.cameraState(), properties.floorSelection, true)
          });
        }
      }).catch(message2 => {
        if (!disposed && value30 === presentGeneration) {
          deviceStatus({
            type: "error",
            message: message2.message || "户型画面准备失败，请重新载入。"
          });
        }
      });
    } else if (requestId5.type === "vacuum-room-result") {
      clearTimeout(entryMap.get(requestId5.id));
      entryMap.delete(requestId5.id);
      const disabled2 = rawProperties.get(requestId5.id);
      if (disabled2) {
        disabled2.disabled = false;
        disabled2.title = requestId5.error || "指令已发送";
      }
      if (requestId5.error) {
        hidden4.hidden = false;
        hidden4.textContent = requestId5.error;
      }
    } else if (requestId5.type === "range-editor") {
      if (requestId5.flush === true) {
        const error = !markerFloorRef || !active2 ? "请先打开照射范围编辑。" : "";
        if (!error) {
          markerDocRef.flush();
        }
        deviceStatus({
          type: "range-editor-state",
          active: active2,
          requestId: requestId5.requestId,
          ...(error ? {
            error
          } : {})
        });
      } else if (requestId5.open === false) {
        markersConcealedAt = !!requestId5.requestId;
        try {
          markerDocRef?.close();
        } finally {
          markersConcealedAt = false;
        }
        if (requestId5.requestId) {
          deviceStatus({
            type: "range-editor-state",
            active: false,
            requestId: requestId5.requestId
          });
        }
      } else {
        onMarkerPointerMove(requestId5.requestId);
      }
    } else if (requestId5.type === "range-save-result") {
      markerDocRef?.setSaveStatus?.(requestId5.error || "");
    } else if (requestId5.type === "activity-state") {
      pendingCommands = true;
      idleIconsHidden = requestId5.visible === true;
      markerWorldCache = requestId5.presentedVisible === undefined ? idleIconsHidden : requestId5.presentedVisible === true;
      options.setPresentedVisible?.(markerWorldCache);
      collectMetadata();
      if (!idleIconsHidden) {
        restoreViewButton = false;
      }
      syncIdleAvailability2();
    } else if (requestId5.type === "user-activity") {
      restoreViewButton = false;
      lightPanelHeader = performance.now();
      fn3();
      lightStateCache = requestId5.held === true;
      fn10();
    } else if (requestId5.type === "dismiss-focus") {
      activity.activity();
      activity2.activity();
      fn13({
        immediate: requestId5.immediate === true
      });
    } else if (requestId5.type === "states") {
      states = requestId5.patch === true ? {
        ...states,
        ...(requestId5.states || {})
      } : requestId5.states || {};
      for (const entityId4 of properties.lights || []) {
        if (requestId5.patch !== true || Object.hasOwn(requestId5.states || {}, entityId4.entityId)) {
          reject4.reconcile(entityId4.entityId, value128(entityId4.entityId));
        }
      }
      fn20();
    } else if (requestId5.type === "control-result") {
      if (set2.has(requestId5.requestId)) {
        enqueueCommand(requestId5.requestId, requestId5.error);
      } else if (map.has(requestId5.requestId)) {
        camerasEqual(requestId5.requestId, requestId5.error);
      } else if (fallback.has(requestId5.requestId)) {
        moveFocusOut(requestId5.requestId, requestId5.error);
      } else {
        fn18(requestId5.requestId, requestId5.error || "", requestId5.timedOut === true);
      }
    } else if (requestId5.type === "editor-command" && editing) {
      try {
        if (requestId5.command === "presence-top-view") {
          const {
            floorId: value2,
            box: x2
          } = requestId5.value || {};
          if (!x2 || ![x2.x, x2.y, x2.w, x2.h].every(Number.isFinite) || x2.w <= 0 || x2.h <= 0) {
            throw new Error("顶视图范围无效。");
          }
          const x3 = options.worldPoint(value2, x2.x + x2.w / 2, x2.y + x2.h / 2, 0);
          const z = options.worldPoint(value2, x2.x, x2.y, 0);
          const z2 = options.worldPoint(value2, x2.x + x2.w, x2.y + x2.h, 0);
          if (!x3 || !z || !z2) {
            throw new Error("请选择有效楼层。");
          }
          const frameSize = Math.max(Math.abs(z2.z - z.z), Math.abs(z2.x - z.x) / (canvas.clientWidth / Math.max(1, canvas.clientHeight)));
          fn13({
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
        } else if (requestId5.command === "presence-3d-view") {
          options.setCameraView?.("free");
          options.restoreCamera(properties.camera || options.floorDefaultCamera?.(activeFloorId) || baseCameraState);
        } else if (requestId5.command === "presence-preview-walk") {
          value135 = requestId5.value === true;
          syncMarkers();
        } else if (requestId5.command === "presence-show-hit-range") {
          value136 = requestId5.value === true;
          syncLightPanel();
        } else if (requestId5.command === "edit-follow-camera") {
          const deviceKind = value141(requestId5.id);
          if (deviceKind?.deviceKind !== "vacuum") {
            throw new Error("请选择扫地机。");
          }
          fn14(requestId5.id, "edit", true);
          const value = options.environmentModelPose(deviceKind.floorId, deviceKind.modelId)?.center || options.cameraState().target;
          fn7(deviceKind.followCamera || vacuumBirdCamera(properties.camera || options.cameraState(), value), false, true);
        } else if (requestId5.command === "edit-light-camera") {
          fn14(requestId5.id, "edit", true);
        } else if (requestId5.command === "preview-light-camera") {
          fn14(requestId5.id, "preview");
        } else if (requestId5.command === "preview-light-effect") {
          if (!["brightnessMin", "brightnessMax", "temperatureMin", "temperatureMax", "defaults"].includes(requestId5.value)) {
            throw new Error("请选择要预览的效果。");
          }
          if (!value141(requestId5.id)) {
            throw new Error("灯光按钮已移除。");
          }
          if (!value141(requestId5.id).entityId) {
            throw new Error("请先绑定实体，再预览灯光效果。");
          }
          fn14(requestId5.id, "preview");
          presentationScale = {
            id: requestId5.id,
            kind: requestId5.value
          };
          fn({
            preview: true
          });
          syncLightPanel2();
        } else if (requestId5.command === "cancel-light-camera") {
          fn13({
            immediate: true
          });
        } else {
          if (frameLoop !== "edit" || requestId5.id !== focusedLightId) {
            throw new Error(preFocusCamera === "nas" ? "请先调整这台NAS的聚焦视角。" : preFocusCamera === "cover" ? "请先调整这幅窗帘的聚焦视角。" : preFocusCamera === "climate" ? "请先调整这台空调的聚焦视角。" : "请先调整这盏灯的聚焦视角。");
          }
          if (requestId5.command === "focus-projection") {
            options.setCameraProjection(requestId5.value);
          }
          if (requestId5.command === "focus-focal-length") {
            options.setCameraFocalLength(requestId5.value);
          }
        }
        pointerToFloorPoint();
        const camera = lightTitle();
        deviceStatus({
          type: "edit",
          action: "focus-camera",
          requestId: requestId5.requestId,
          id: requestId5.id,
          camera
        });
        if (requestId5.command === "save-light-camera") {
          fn13({
            immediate: true
          });
        }
      } catch (message) {
        deviceStatus({
          type: "edit",
          action: "focus-camera",
          requestId: requestId5.requestId,
          error: message.message
        });
      }
    } else if (requestId5.type === "editor-command" && viewEditing) {
      if (requestId5.command === "projection") {
        options.setCameraProjection(requestId5.value);
      }
      if (requestId5.command === "focal-length") {
        options.setCameraFocalLength(requestId5.value);
      }
      pointerToFloorPoint();
      if (requestId5.command === "save-camera" || requestId5.requestId) {
        deviceStatus({
          type: "edit",
          action: "camera",
          requestId: requestId5.requestId,
          camera: lightTitle()
        });
      }
    }
  }
  window.addEventListener("message", fn26);
  const controls2 = options.controls;
  const unsubscribeCameraChange = options.onCameraChange?.(() => {
    updateMarkerPositions2();
    syncLightPanel();
    if (focusMode.hideIconsWhileRotating === true) {
      wake();
    }
  });
  if (!unsubscribeCameraChange) {
    controls2.addEventListener("change", updateMarkerPositions2);
  }
  const observe = new ResizeObserver(onMarkerPointerDown);
  observe.observe(container);
  observe.observe(classList5);
  observe.observe(append3);
  observe.observe(inputEvents);
  async function apply(arg71) {
    const value112 = options.savedScene;
    const value113 = lightTitle();
    restoreViewButton = restoreViewButton || activePointers && focusMode.hideIconsWhileRotating === true || lightHistoryStorage;
    toolbar = true;
    activity.activity();
    fn3();
    let value114 = () => {};
    let value115 = false;
    const value116 = async arg45 => {
      options.finishFloorTransition?.();
      await options.replaceScene(arg45);
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
      const value31 = options.document.floors.some(id13 => id13.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
      activeFloorId = value31;
      options.setFloor(value31);
      options.appearance(properties);
      baseCameraState = value129(focusVignette.floorCameras?.[value31] || focusVignette.camera || value113, value31);
      options.restoreCamera(value129(value113, value31));
      fn({
        immediate: true
      });
      await options.whenPresented();
    };
    try {
      value114 = options.coverSceneUpdate();
      options.setCameraInteraction({
        enabled: false
      });
      value115 = true;
      await value116(arg71);
      if (!disposed) {
        deviceStatus({
          type: "model-metadata",
          metadata: fn28()
        });
      }
    } catch (value53) {
      if (value115 && !disposed) {
        await value116(value112);
      }
      throw value53;
    } finally {
      value114();
      toolbar = false;
      markersSuppressedByActivity.clear();
      if (!disposed && (pointerToFloorPoint(), fn20(), lightPanel)) {
        const value14 = lightPanel;
        lightPanel = null;
        fn26(value14);
      }
    }
  }
  const value147 = options.readSceneUpdate ? startSceneSync({
    eligible: () => !disposed && presented && idleIconsHidden && !document.hidden && !editing && !viewEditing && !frameLoop && !presentedVisible && !dragState && !active2 && !toolbar && !sceneUpdating.size && !fallback.size && !map.size && !set2.size && !isMoving.isMoving() && nextDelay.nextDelay() === Infinity && !lightStateCache && !resolveLightState.size && !effectPreview.size && performance.now() - lightPanelHeader > 1200,
    read: arg26 => options.readSceneUpdate(arg26),
    apply
  }) : () => {};
  function fn27(arg72) {
    if (disposed || document.hidden || toolbar) {
      return Infinity;
    }
    syncMarkers();
    const value117 = options.floorTransitionActive || presentedVisible?.owner === "floor";
    options.recordFloorFrame?.(arg72, !!value117);
    if (!value117) {
      syncPresentationLayout();
      syncMarkerVisibility();
      syncPresentationChrome();
      onMarkerPointerCancel();
      markersRoot.tick(arg72);
      if (nextDelay.tick(arg72)) {
        syncCameraInteraction();
        if (focusedLightBinding2()?.deviceKind === "cover") {
          syncLightPanel2();
        }
      }
      isMoving.update(arg72);
    }
    collectMetadata();
    options.curtainFrame?.({
      key: isMoving.poseKey(),
      structure: isMoving.structureKey(),
      floorIds,
      moving: isMoving.isMoving() || nextDelay.nextDelay() <= 1000 / 30
    });
    const value118 = isActive.tick(arg72);
    if (!value117) {
      setRoot.tick(arg72);
    }
    options.setEnvironmentActive?.(isActive.isActive);
    fn5(arg72);
    const value119 = sync2.tick(arg72);
    activity3.tick(arg72);
    activity.tick(arg72);
    activity2.tick(arg72);
    if (reject4.expire()) {
      fn20();
    }
    const value120 = brightnessSlider ? Math.min(0.1, (arg72 - brightnessSlider) / 1000) : 0;
    brightnessSlider = arg72;
    const value121 = !value117 && hitRects.tick(value120);
    syncLightPanel();
    const value122 = !value117 && hasTracking.tick(value120);
    if (value122) {
      value146 = "";
      updateMarkerPositions2(true);
    }
    const value123 = (properties.devices?.vacuums || []).some(arg35 => vacuumStatusPresentation(arg35, states).active);
    const value124 = Math.floor(arg72 / 7000);
    if (value123 && value124 !== presetsRoot) {
      presetsRoot = value124;
      fn20();
    }
    applyLightStates(value120);
    const value125 = options.camera.quaternion?.toArray?.().join(",") || "";
    if (value125 !== lightControls) {
      if (lightControls && !presentedVisible && !presets) {
        hideIconsUntilDeg = arg72 + 180;
      }
      lightControls = value125;
    }
    const value126 = focusMode.hideIconsWhileRotating === true && !editing && !viewEditing && (userHeld || arg72 < hideIconsUntilDeg);
    if (value126 !== temperatureSlider) {
      temperatureSlider = value126;
      fn3();
    }
    const value127 = (properties.devices?.vacuums || []).some(id36 => idleCameraBase(id36) && hasTracking.hasTracking(id36.id));
    hidden6.hidden = editing || !presets && (preFocusCamera !== "vacuum" || !value127);
    append2.hidden = hidden6.hidden;
    hidden6.disabled = !presets && !value127;
    updateMarkerPositions2();
    canvas.dataset.stageFrameChecks = String(markersById.stats.frames);
    return Math.min(value121 ? 1000 / 30 : Infinity, value122 || presets ? 1000 / 30 : Infinity, temperatureSlider ? 100 : Infinity, value123 ? 7000 - arg72 % 7000 : Infinity, presentedVisible || value118 || value119 ? 0 : Infinity, isMoving.isMoving() ? 1000 / 30 : Infinity, nextDelay.nextDelay(arg72), setRoot.nextDelay(), markersRoot.nextDelay(), activity3.nextDelay(arg72), activity.nextDelay(arg72), activity2.nextDelay(arg72), reject4.nextDelay(arg72));
  }
  markersById = options.createFrameLoop({
    step: arg36 => options.profileFrameWork ? options.profileFrameWork("stage-updates", () => fn27(arg36)) : fn27(arg36)
  });
  syncIdleAvailability2();
  window.addEventListener("pagehide", () => {
    finishCommand();
    document.removeEventListener("visibilitychange", collectMetadata);
    sync2.dispose();
    hasTracking.dispose();
    hitRects.dispose();
    if (presets) {
      displayLightState(false);
    }
    for (const value32 of entryMap.values()) {
      clearTimeout(value32);
    }
    entryMap.clear();
    markerFloorRef = false;
    markerDocRef?.dispose();
    options.setCurtainSync?.(null);
    root2.dispose();
    isMoving.dispose();
    nextDelay.clear();
    for (const value33 of set2.keys()) {
      enqueueCommand(value33, "页面已关闭。");
    }
    for (const value34 of map.keys()) {
      camerasEqual(value34, "页面已关闭。");
    }
    presentationRoot.flush();
    value147();
    root3.dispose();
    markersRoot.dispose();
    root4.dispose();
    sync.dispose();
    setRoot.dispose();
    isActive.dispose();
    root.dispose();
    for (const value35 of fallback.keys()) {
      moveFocusOut(value35, "页面已关闭。");
    }
    options.finishFloorTransition?.();
    disposed = true;
    activity.dispose();
    activity2.dispose();
    activity3.dispose();
    presentedVisible = null;
    deviceStatus({
      type: "focus-state",
      active: false
    });
    for (const value36 of value145) {
      window.removeEventListener(value36, fn11, true);
    }
    window.removeEventListener("blur", fn12);
    document.removeEventListener?.("visibilitychange", syncIdleAvailability2);
    markersById.dispose();
    unsubscribeCameraChange?.();
    if (!unsubscribeCameraChange) {
      controls2.removeEventListener("change", updateMarkerPositions2);
    }
    observe.disconnect();
    sceneUpdating.forEach(timeout4 => clearTimeout(timeout4.timeout));
    sceneUpdating.clear();
  });
  function fn28() {
    const get = new Map(floorNavigationChoices(options.document.floors).filter(([arg18]) => arg18 !== "all").map(([arg27, slice]) => [arg27, slice.startsWith("B") ? -Number(slice.slice(1)) : Number(slice.slice(0, -1))]));
    options.regionLighting?.sync?.(options.camera);
    return {
      floorGap: options.document.previewFloorGap,
      appearanceCapabilities: {
        detailedLighting: (options.regionLighting?.stats?.detailedMaterials || 0) > 0
      },
      camera: value129(options.cameraState(), properties.floorSelection || options.document.activeFloorId, true),
      baseLighting: options.document.baseLighting,
      defaults: options.defaults,
      floors: options.document.floors.map(scene => {
        const value5 = scene.scene.settings?.wallHeight;
        const value6 = scene.scene.walls.map(height => height.height).filter(arg10 => Number.isFinite(arg10) && arg10 > 0);
        const wallHeight = Math.max(0.01, Math.min(6, Number.isFinite(value5) && value5 > 0 ? value5 : Math.max(0, ...value6) || 2.8));
        return {
          id: scene.id,
          name: scene.name,
          elevation: scene.elevation,
          number: get.get(scene.id),
          wallHeight,
          plan: {
            pixelsPerMeter: scene.scene.calibration?.pixelsPerMeter || 1,
            walls: scene.scene.walls.map(start2 => ({
              start: start2.start,
              end: start2.end,
              thickness: start2.thickness
            }))
          },
          vacuums: scene.scene.items.filter(type => type.type === "robotvacuum").map((id7, arg3) => ({
            id: id7.id,
            name: id7.name || "扫地机 " + (arg3 + 1),
            x: id7.x,
            y: id7.y,
            height: (Number(id7.elevation) || 0) + (Number(id7.height) || 0.85) / 2
          })),
          televisions: scene.scene.items.filter(type2 => type2.type === "tv").map((id8, arg4) => ({
            id: id8.id,
            name: id8.name || "电视 " + (arg4 + 1),
            type: id8.type,
            x: id8.x,
            y: id8.y,
            height: (Number(id8.elevation) || 0) + (Number(id8.height) || 0.92) * 0.62
          })),
          nas: scene.scene.items.filter(type3 => type3.type === "nas").map((id9, arg5) => ({
            id: id9.id,
            name: id9.name || "NAS " + (arg5 + 1),
            type: id9.type,
            x: id9.x,
            y: id9.y,
            height: (Number(id9.elevation) || 0) + (Number(id9.height) || 0.34) / 2
          })),
          curtains: scene.scene.items.filter(type4 => type4.type === "curtain").map((id10, arg6) => ({
            id: id10.id,
            name: id10.name || "窗帘 " + (arg6 + 1),
            type: id10.type,
            x: id10.x,
            y: id10.y,
            height: (Number(id10.elevation) || 0) + (Number(id10.height) || 2.4) / 2,
            curtainPosition: id10.curtainPosition || "split"
          })),
          airConditioners: scene.scene.items.filter(type5 => ["wallac", "floorac", "airoutlet"].includes(type5.type)).map((type6, arg7) => ({
            id: type6.id,
            name: type6.name || (type6.type === "airoutlet" ? "出风口" : type6.type === "wallac" ? "挂机空调" : "柜机空调") + " " + (arg7 + 1),
            type: type6.type,
            x: type6.x,
            y: type6.y,
            height: (Number(type6.elevation) || 0) + (Number(type6.height) || 0.28) / 2
          })),
          groups: scene.scene.lightGroups.map(id11 => {
            const length = scene.scene.items.filter(lightGroupId => lightGroupId.lightGroupId === id11.id);
            const length2 = length.length ? length : scene.scene.walls.map(start => start.start);
            return {
              id: id11.id,
              name: id11.name,
              height: wallHeight,
              x: length2.length ? length2.reduce((arg, x) => arg + x.x, 0) / length2.length : 0,
              y: length2.length ? length2.reduce((arg2, y) => arg2 + y.y, 0) / length2.length : 0
            };
          })
        };
      })
    };
  }
  deviceStatus({
    type: "ready",
    statePatches: true,
    metadata: fn28()
  });
}
