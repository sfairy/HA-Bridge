import { createPresenceScene, createPresenceWaves } from "./presence-scene.js?v=20260910-presence-v1-20260911-presence-pages-v2-20260911-world-waves-v3-wave-settings-v1";
import { floorNavigationChoices } from "./floor-navigation.js?v=20260909-floor-numbers-v1";
import { createVacuumMotion, vacuumQuip, createVacuumFollowCamera, vacuumBirdCamera, vacuumFollowPose } from "./vacuum-motion.js?v=20260909-reflection-cache-v4";
import { createVacuumMaps, vacuumStatusPresentation, vacuumBindingsForMap } from "./vacuum-map.js?v=20260909-curtain-action-v15";
import { televisionState } from "./television-state.js";
import { createTelevisionPanel } from "./television-panel.js";
import { createTelevisionScreens } from "./television-screen.js?v=20260909-reflection-cache-v4";
import { createNasPanel } from "./nas-panel.js";
import { createNasStatus, nasDeviceState } from "./nas-status.js?v=20260908-nas-v1";
import { createCameraStatus, cameraOnline } from "./camera-status.js";
import { coverState, coverIconIsOn } from "./cover-state.js?v=20260910-curtain-default-open-v2";
import { createCoverFeedback } from "./cover-feedback.js?v=20260910-curtain-default-open-v2";
import { createCoverPanel } from "./cover-panel.js?v=20260910-curtain-default-open-v2";
import { createCurtainMotion } from "./curtain-motion.js?v=20260910-health-fixes-v2";
import { createEnvironmentAirflow } from "./environment-airflow.js?v=20260908-outlet-airflow-v1-20260909-page-behavior-airflow-zoom-v1";
import { mountRegionRangeEditor } from "./light-range-editor.js?v=20260909-curtain-action-v15";
import { climateState } from "./climate-state.js?v=20260908-climate-v1";
import { createClimatePanel } from "./climate-panel.js?v=20260908-climate-v1";
import { createEnvironmentScene, pageDimming, pageModelBindings } from "./environment-scene.js?v=20260909-reflection-cache-v4";
import { startSceneSync } from "./scene-sync.js?v=20260907-scene-sync-v1";
import { lightCommand, createLightPreview, createLightStateCache, lightRenderState } from "./light-state.js?v=20260907-demand-v1";
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
      clonedProperties.security.presenceSensors = clonedProperties.security.presenceSensors.map(focusCamera3 => ({
        ...focusCamera3,
        ...(focusCamera3.focusCamera ? {
          focusCamera: transformCameraForFloor(focusCamera3.focusCamera, clonedProperties.floorSelection)
        } : {})
      }));
    }
    if (clonedProperties.security?.cameras) {
      clonedProperties.security.cameras = clonedProperties.security.cameras.map(focusCamera4 => ({
        ...focusCamera4,
        ...(focusCamera4.focusCamera ? {
          focusCamera: transformCameraForFloor(focusCamera4.focusCamera, clonedProperties.floorSelection)
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
        clonedProperties.devices[deviceCollectionKey] = clonedProperties.devices[deviceCollectionKey].map(focusCamera2 => ({
          ...focusCamera2,
          ...(focusCamera2.focusCamera ? {
            focusCamera: transformCameraForFloor(focusCamera2.focusCamera, clonedProperties.floorSelection)
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
    const type10 = createEl("button", "", moduleLabel);
    type10.type = "button";
    type10.dataset.module = module;
    type10.style.setProperty("--i3d-tab-index", String(controls.size));
    type10.addEventListener("click", () => selectNavigationModule(module));
    moduleTabsEl.append(type10);
    controls.set(module, type10);
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
      const focusedLight = focusedLightBinding2();
      if (!!focusedLight && !editing && !!resolveLightEntityState(focusedLight.entityId).available) {
        reject4.set(focusedLight.entityId, kind, Number(input.value));
        wake();
        syncLightPanel2();
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
  const input2 = createSlider("色温", "temperature", "2000", "6500");
  const input3 = createSlider("亮度", "brightness", "1", "100");
  const lightPresetsEl = createEl("div", "i3d-light-presets");
  lightPresetsEl.setAttribute("role", "group");
  lightPresetsEl.setAttribute("aria-label", "灯光预设");
  const presetButtons = lightPresets.map(brightness => {
    const type9 = createEl("button", "i3d-light-preset");
    type9.type = "button";
    const detail = createEl("small", "", brightness.brightness + "%");
    type9.append(createEl("strong", "", brightness.label), detail);
    type9.addEventListener("click", () => void sendLightCommand("preset", brightness));
    lightPresetsEl.append(type9);
    return {
      ...brightness,
      button: type9,
      detail
    };
  });
  lightControlsEl.append(lightPresetsEl);
  const controlErrorEl = createEl("p", "i3d-control-error");
  controlErrorEl.setAttribute("role", "status");
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
  function moveFocusOut(root, errorMessage) {
    const timeout5 = fallback.get(root);
    if (timeout5) {
      clearTimeout(timeout5.timeout);
      fallback.delete(root);
      if (errorMessage) {
        timeout5.reject(new Error(errorMessage));
      } else {
        timeout5.resolve();
      }
    }
  }
  const map = new Map();
  const nextDelay = createCoverFeedback();
  const root2 = createCoverPanel({
    onPreview: (coverEntityId, coverPreview) => {
      nextDelay.preview(coverEntityId, coverPreview);
      syncCameraInteraction();
      wake();
      return nextDelay.read(coverEntityId);
    },
    onControl: entityId12 => new Promise((resolve2, reject2) => {
      const modelId2 = syncInputHold().find(entityId2 => idleCameraBase(entityId2) && entityId2.entityId === entityId12.entityId && entityId2.modelAvailable);
      if (!interactive || editing || disposed || preFocusCamera !== "environment" || !modelId2?.modelId) {
        reject2(new Error("当前窗帘不可控制。"));
        return;
      }
      const requestId2 = "cover-" + ++controlRequestSeq;
      const timeout2 = setTimeout(() => camerasEqual(requestId2, "请求超时，请检查设备状态。"), 14000);
      syncCurtainLayout();
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
      pruneMarkerElements();
      wake();
    })
  });
  function camerasEqual(requestId, failMessage) {
    const timeout6 = map.get(requestId);
    if (timeout6) {
      clearTimeout(timeout6.timeout);
      map.delete(requestId);
      if (failMessage) {
        nextDelay.fail(timeout6.entityId, requestId, failMessage);
        syncCameraInteraction();
        syncLightPanel2();
        wake();
        timeout6.reject(new Error(failMessage));
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
  lightPanelEl.append(lightPanelHeaderEl, lightControlsEl, controlErrorEl, root.root, root2.root, root3.root, root4.root);
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
    for (const entityId16 of coverBindings) {
      const coverStateValue = nextDelay.read(entityId16.entityId, coverState(entityId16.entityId, states[entityId16.entityId]));
      curtainMotion.setState(entityId16.id, coverStateValue, {
        immediate: true
      });
      const classList = rawProperties.get("cover:" + entityId16.id);
      if (classList) {
        classList.classList.toggle("is-on", coverIconIsOn(entityId16, coverStateValue));
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
    const map2 = [...syncInputHold(), ...previewCoverBindings()];
    coverBindings = map2;
    floorIds = [...new Set(map2.map(floorId2 => floorId2.floorId).filter(Boolean))];
    curtainMotion.setBindings(modelRoot, map2, sceneRevision);
    nextDelay.retain(map2.map(entityId13 => entityId13.entityId));
    for (const entityId17 of map2) {
      nextDelay.sync(entityId17.entityId, coverState(entityId17.entityId, states[entityId17.entityId]));
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
  let root5;
  function syncNasStatus() {
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
  const cameraStatus = createCameraStatus({
    THREE,
    requestFrame: () => options.requestRender?.()
  });
  let securityStatusKey;
  function syncSecurityStatus() {
    const hideClickable = !viewEditing && !active2;
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
  navigationEl.append(toolbarEl);
  container.append(focusVignetteEl, presentationRootEl);
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
    syncIdleAvailability2();
  }
  followRoamBtn.addEventListener("click", () => {
    if (presets) {
      displayLightState();
      return;
    }
    if (options.floorTransitionActive || presentedVisible?.owner === "floor") {
      return;
    }
    const find = (properties.devices?.vacuums || []).filter(id25 => idleCameraBase(id25) && hasTracking.hasTracking(id25.id));
    const id40 = find.find(id19 => "vacuum:" + id19.id === focusedLightId) || find.find(vacuumCandidate => vacuumStatusPresentation(vacuumCandidate, states).active) || find[0];
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
    clearFocus({
      immediate: true
    });
    presentedVisible = null;
    options.endCameraMotion();
    controlError = target;
    presets = id40.id;
    viewHelp = structuredClone(id40.followCamera || vacuumBirdCamera(properties.camera || target, options.environmentModelPose(id40.floorId, id40.modelId)?.center || target.target));
    options.setFocusViewport(0);
    options.beginCameraMotion(viewHelp.mode);
    followRoamBtn.textContent = "退出跟随";
    followRoamBtn.setAttribute("aria-pressed", "true");
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
    const modelCenter = options.environmentModelPose(floorId8.floorId, floorId8.modelId)?.center;
    const toArray = (modelCenter ? new THREE.Vector3(...modelCenter) : clone.clone()).add(new THREE.Vector3(0, 0.05, 0));
    const position = vacuumFollowPose(viewHelp, toArray.toArray());
    const cameraPosition = new THREE.Vector3(...position.position);
    vacuumFollowCamera.reveal(options, floorId8, toArray, cameraPosition);
    options.setFocusViewport(0);
    options.applyCameraPose(position);
  }
  const isDeviceFocusKind = deviceKind10 => ["nas", "television", "vacuum", "presence", "camera"].includes(deviceKind10?.deviceKind);
  const sync2 = createVacuumMaps(options, () => {
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
  const Math2 = new Map();
  function syncLightPanel() {
    if ((!editing || !presenceHitTesting) && !Math2.size) {
      return;
    }
    const map3 = editing && presenceHitTesting ? hitRects.hitRects(options.camera, canvas, properties.security?.presenceSensors || []) : [];
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
        kelvin = createEl("div", "i3d-presence-hit-box");
        Math2.set(preset.id, kelvin);
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
    const lightIds = presented && (!editing || preFocusCamera === "security") && !viewEditing && !active2 && markerWorldCache && !document.hidden && !options.floorTransitionActive && presentedVisible?.owner !== "floor";
    const every = [properties, states, options.sceneRevision, activeFloorId, lightIds, presenceEditorActive, preFocusCamera];
    if (!presenceSyncKey || !every.every((dep, depIndex) => dep === presenceSyncKey[depIndex])) {
      presenceSyncKey = every;
      hitRects.sync(properties.security?.presenceSensors || [], states, lightIds, activeFloorId, editing, presenceEditorActive, preFocusCamera);
    }
  }
  let vacuumMapSyncKey = null;
  function syncVacuumMap() {
    const vacuumMapActive = presented && !editing && !viewEditing && markerWorldCache && !document.hidden;
    const every2 = [properties, states, options.sceneRevision, vacuumMapActive];
    if (!vacuumMapSyncKey || !every2.every((dep2, dep2Index) => dep2 === vacuumMapSyncKey[dep2Index])) {
      vacuumMapSyncKey = every2;
      hasTracking.sync(vacuumBindingsForMap(properties.devices?.vacuums || [], states), states, vacuumMapActive);
    }
  }
  const entryMap = new Map();
  let vacuumMotionSyncKey = null;
  function collectMetadata() {
    const vacuumMotionActive = preFocusCamera === "vacuum" && !viewEditing && !active2 && !options.floorTransitionActive && presentedVisible?.owner !== "floor" && markerWorldCache && !document.hidden;
    const every3 = [properties, states, options.sceneRevision, activeFloorId, vacuumMotionActive];
    if (!vacuumMotionSyncKey || !every3.every((dep3, dep3Index) => dep3 === vacuumMotionSyncKey[dep3Index])) {
      vacuumMotionSyncKey = every3;
      sync2.sync(vacuumBindingsForMap(tickCameraMotion(), states), vacuumMotionActive, activeFloorId, states);
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
  function vacuumRoomBindings() {
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
  function previewCoverBindings() {
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
      return vacuumRoomBindings().filter(vacuumId => vacuumId.vacuumId === cameraMotion);
    } else if (preFocusCamera === "nas") {
      return clearInputHold();
    } else if (preFocusCamera === "vacuum") {
      return tickCameraMotion().filter(entityId5 => editing || entityId5.entityId).map(id22 => ({
        ...id22,
        id: editing ? id22.id : "vacuum:" + id22.id
      }));
    } else if (preFocusCamera === "television") {
      return startCameraMotion();
    } else if (preFocusCamera === "security") {
      return [...cameraBindings(), ...presenceBindings()];
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
  const visibleBindings = () => {
    let filter2 = preFocusCamera === "security" ? [...cameraBindings(), ...presenceBindings().filter(binding => editing && binding.modelId)] : preFocusCamera === "light" ? properties.lights || [] : [...focusLight(), ...(preFocusCamera === "vacuum" && !editing ? vacuumRoomBindings() : [])];
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
    navigationEl.hidden = editing || viewEditing || active2;
    floorTabsEl.hidden = navigationEl.hidden || options.document.floors.length < 2;
    const brightness = floorNavigationChoices(options.document.floors, properties.floorNumbers);
    options.groundReflections?.setOutsideFloor?.(activeFloorId === "all" ? brightness.find(([, floorLabel]) => floorLabel === "1F")?.[0] || "" : null);
    const temperatureRatio = JSON.stringify(brightness);
    if (temperatureRatio !== markerProjectionKey) {
      markerProjectionKey = temperatureRatio;
      floorTabsEl.replaceChildren();
      for (const [floor, floorTabLabel, title] of brightness) {
        const type8 = createEl("button", "", floorTabLabel);
        type8.type = "button";
        type8.dataset.floor = floor;
        type8.title = title;
        type8.setAttribute("aria-label", title);
        type8.addEventListener("click", () => updateMarkerPositions(floor));
        floorTabsEl.append(type8);
      }
    }
    for (const setAttribute of floorTabsEl.children) {
      setAttribute.setAttribute("aria-pressed", String(setAttribute.dataset.floor === activeFloorId));
    }
  }
  function updateMarkerPositions(floorSelection) {
    if (editing || viewEditing || active2 || toolbar || floorSelection === activeFloorId || floorSelection !== "all" && !options.document.floors.some(id26 => id26.id === floorSelection)) {
      return;
    }
    displayLightState(false);
    clearFocus({
      immediate: true
    });
    cancelMarkerDrag();
    const containerRect = options.cameraState(true);
    const layoutWidth = options.getOrbitCenter?.();
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
      options.restoreCamera(containerRect);
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
      syncIdleAvailability2();
    });
  }
  function openRangeEditor(event) {
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
    const rangeEditorBlockReason = markerFloorRef ? options.regionLighting ? presented ? toolbar ? "户型正在同步，请稍候再调整照射范围。" : viewEditing ? "请先完成户型视角调整，再编辑照射范围。" : "" : "户型还在加载，请稍候再调整照射范围。" : "请先选择轻量柔光模式。" : "请在已授权的控件编辑器中调整照射范围。";
    if (rangeEditorBlockReason) {
      point(false, rangeEditorBlockReason);
      return;
    }
    if (active2) {
      point(true);
      return;
    }
    clearFocus({
      immediate: true
    });
    active2 = true;
    markersConcealedAt = true;
    syncIdleAvailability2();
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
          active2 = false;
          presentationRootEl.style.display = "";
          presentationRootEl.removeAttribute("inert");
          focusVignetteEl.style.display = "";
          syncEditorEffects({
            immediate: true
          });
          pointerToFloorPoint();
          queueOrSendCommand();
          syncChromeInert();
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
      presentationRootEl.style.display = "";
      presentationRootEl.removeAttribute("inert");
      focusVignetteEl.style.display = "";
      pointerToFloorPoint();
      queueOrSendCommand();
      syncIdleAvailability2();
      point(false, message4.message || "范围编辑暂时不可用");
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
  const presenceBindings = () => (properties.security?.presenceSensors || []).map(route => ({
    ...route,
    id: "presence:" + route.id,
    deviceKind: "presence",
    clickAction: "focus",
    x: route.route?.[0]?.x || 0,
    y: route.route?.[0]?.y || 0,
    height: (route.size ?? 1) * 0.7
  }));
  const findBinding = bindingId => visibleBindings().find(id34 => id34.id === bindingId) || cameraBindings().find(id35 => id35.id === bindingId) || presenceBindings().find(id36 => id36.id === bindingId);
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
      enabled: preFocusCamera === "security" && !focusedLightId && !frameLoop && !viewEditing && !active2 && !options.floorTransitionActive && presentedVisible?.owner !== "floor"
    });
    collectMetadata();
    if (!options.floorTransitionActive && presentedVisible?.owner !== "floor") {
      syncCurtainLayout();
      syncNasStatus();
      syncSecurityStatus();
      syncPresentationChrome();
      syncVacuumMap();
      const focusableLights = focusLight().filter(idleCameraBase);
      const filter = (editing ? [...focusableLights, ...(["climate", "devices", "nas", "television", "vacuum"].includes(preFocusCamera) ? [] : previewCoverBindings())] : [...syncIdleAvailability(), ...syncInputHold(), ...clearInputHold(), ...startCameraMotion(), ...tickCameraMotion(), ...cameraBindings(), ...presenceBindings()].map(deviceKind3 => ({
        ...deviceKind3,
        id: ["camera", "presence"].includes(deviceKind3.deviceKind) ? deviceKind3.id : deviceKind3.deviceKind + ":" + deviceKind3.id
      })).concat(previewCoverBindings())).filter(modelAvailable => modelAvailable.modelAvailable && idleCameraBase(modelAvailable));
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
    moduleTabsEl.hidden = editing || viewEditing || active2;
    syncPowerButton();
    const baseCommand = activeFloorId === "all";
    const selectedModule = ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : "environment";
    moduleTabsEl.classList.toggle("is-all-floors", baseCommand);
    moduleTabsEl.style.setProperty("--i3d-tab-count", baseCommand ? "1" : String(controls.size));
    moduleTabsEl.style.setProperty("--i3d-selected-tab", String(baseCommand ? 0 : [...controls.keys()].indexOf(selectedModule)));
    for (const [moduleId, hidden2] of controls) {
      const element = baseCommand && moduleId !== "overview";
      if (element) {
        blurActiveWithin(hidden2);
      }
      hidden2.hidden = element;
      hidden2.disabled = element;
      hidden2.setAttribute("aria-pressed", String(moduleId === selectedModule));
    }
    moduleEmptyEl.hidden = moduleTabsEl.hidden || !activityVisible && (preFocusCamera === "security" ? [...(properties.security?.presenceSensors || []), ...(properties.security?.cameras || [])].some(idleCameraBase) : preFocusCamera === "overview" || preFocusCamera === "light" || pending.length > 0);
    moduleEmptyEl.textContent = activityVisible ? "请选择楼层，再使用" + (controls.get(activityVisible)?.textContent || "控制") + "。" : preFocusCamera === "security" ? "尚未配置安防相关设备" : preFocusCamera === "vacuum" ? "尚未配置扫地机，请在 3D 交互属性 → 扫地机中选择设备。" : preFocusCamera === "devices" ? "尚未配置设备，请在 3D 交互属性 → 设备中添加 NAS 或电视。" : "尚未配置环境设备，请在 3D 交互属性 → 环境中添加空调或窗帘。";
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
    const opacity = markersRootNode.animate ? getComputedStyle(markersRootNode) : null;
    const opacity2 = opacity ? Number(opacity.opacity) : 1;
    const transform = opacity?.transform || "none";
    finishCommand();
    if (!markersRootNode.animate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      event();
      return;
    }
    const setAttribute2 = markersRootNode.cloneNode(true);
    setAttribute2.setAttribute("aria-hidden", "true");
    setAttribute2.setAttribute("inert", "");
    setAttribute2.classList.add("i3d-module-outgoing");
    setAttribute2.style.pointerEvents = "none";
    for (const style3 of setAttribute2.querySelectorAll("button")) {
      style3.style.pointerEvents = "none";
      style3.removeAttribute("id");
    }
    markersRootNode.parentNode.append(setAttribute2);
    event();
    markersRootNode.setAttribute("inert", "");
    const out = pendingFloorTransition = {
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
    if (!markersRootNode.classList.contains("is-concealed")) {
      out.in = markersRootNode.animate([{
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
      if (pendingFloorTransition === out) {
        setAttribute2.remove();
        pendingFloorTransition = null;
        syncMarkerVisibility();
      }
    }).catch(error => {
      // Animation.cancel() rejects finished; only log unexpected failures.
      if (pendingFloorTransition === out) {
        pendingFloorTransition = null;
      }
      if (error?.name !== "AbortError") {
        console.warn("楼层切换动画未正常结束", error);
      }
    });
  }
  function selectNavigationModule(event) {
    if (!editing && !viewEditing && !active2 && !toolbar && !!controls.has(event) && (activeFloorId !== "all" || event === "overview")) {
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
        activity2.activity();
        activity3.activity();
        markersSuppressedByActivity.clear();
        queueOrSendCommand();
        pruneMarkerElements();
      });
    }
  }
  const focusedLightBinding2 = () => findBinding(focusedLightId);
  const readLightPanelState = lightEntityId => reject4.state(lightEntityId, resolveLightEntityState(lightEntityId));
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
      options.setLightStates((properties.lights || []).filter(entityId7 => entityId7.entityId).map(id27 => {
        const lightRenderPatch = applySceneUpdate(id27);
        return {
          ...id27,
          ...(editing && presentationScale?.id === id27.id ? lightRenderPatch : lightRenderState(lightRenderPatch)),
          ...(inEditorMode && id27.id !== focusedEditId ? {
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
  const focusPanelInset = () => isDeviceFocusKind(focusedLightBinding2()) && focusedLightBinding2()?.clickAction === "focus" ? 0 : Math.min(0.7, (lightPanelEl.getBoundingClientRect().width + previewState * 24) / Math.max(container.clientWidth, 1));
  function syncPresentationLayout() {
    const light = container.getBoundingClientRect();
    const pointerPoint = focusedLightBinding?.width || light.width;
    const hostHeight = focusedLightBinding?.height || light.height;
    if (!(pointerPoint > 0) || !(hostHeight > 0) || !(light.width > 0) || !(light.height > 0)) {
      return;
    }
    previewState = light.width / pointerPoint;
    const navTabBudget = (activeFloorId === "all" ? 1 : controls.size) * 50 + 6;
    const navigationScale = Math.min(2, (pointerPoint - 24) / navTabBudget);
    const floorScale = Math.min(2, (hostHeight - 24) / (floorTabsEl.scrollHeight || 240));
    presentationRootEl.style.setProperty("--i3d-navigation-scale", String(navigationScale));
    presentationRootEl.style.setProperty("--i3d-floor-scale", String(floorScale));
    const event = properties.navigation || {};
    const placeNavElement = (style2, navPos, defaultPct, scale, fallbackWidth, fallbackHeight) => {
      const navBaseWidth = (style2 === navigationEl ? navTabBudget : style2.offsetWidth || fallbackWidth) * scale;
      const navBaseHeight = (style2.offsetHeight || fallbackHeight) * scale;
      const readNavPct = (axis, fallbackPct) => Number.isFinite(navPos?.[axis]) ? Math.max(0, Math.min(100, navPos[axis])) : fallbackPct;
      const navLeft = Math.max(12 + navBaseWidth / 2, Math.min(pointerPoint - 12 - navBaseWidth / 2, pointerPoint * readNavPct("x", defaultPct[0]) / 100));
      const navTop = Math.max(12 + navBaseHeight / 2, Math.min(hostHeight - 12 - navBaseHeight / 2, hostHeight * readNavPct("y", defaultPct[1]) / 100));
      style2.style.left = navLeft + "px";
      style2.style.top = navTop + "px";
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
    updateMarkerPositions2(true);
  }
  function blurActiveWithin(contains, setAttribute3 = canvas) {
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
  function syncMarkerVisibility() {
    const hasHiddenClickable = !editing && !viewEditing && visibleBindings().some(visible => visible.visible !== false && visible.buttonHidden !== true && visible.hiddenClickable === true);
    const markersConcealed = presentedVisible?.owner === "floor" || restoreViewButton || temperatureSlider || lightHistoryStorage && !hasHiddenClickable || activePointers && focusMode.hideIconsWhileRotating === true || !!frameLoop && !["edit", "panel"].includes(frameLoop);
    for (const [markerId, classList3] of rawProperties) {
      const buttonHidden = !editing && findBinding(markerId)?.buttonHidden === true;
      const hiddenClickable = !editing && !viewEditing && !buttonHidden && findBinding(markerId)?.hiddenClickable === true;
      classList3.disabled = presentedVisible?.owner === "floor" || buttonHidden || !editing && idleReturning();
      const deviceKind9 = findBinding(markerId);
      const vacuumWorking = !editing && deviceKind9?.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind9, states).active;
      const append = vacuumWorking ? vacuumWorkingLayer : markersRootNode;
      if (classList3.parentElement !== append) {
        append.append(classList3);
      }
      const hideMarkerChrome = presentedVisible?.owner === "floor" || !vacuumWorking && (lightHistoryStorage || temperatureSlider) && !hiddenClickable && !editing && !viewEditing;
      classList3.classList.toggle("is-hidden-clickable", hiddenClickable);
      classList3.classList.toggle("is-idle-hidden", hideMarkerChrome);
      if (hideMarkerChrome || buttonHidden || !editing && idleReturning()) {
        blurActiveWithin(classList3);
        classList3.setAttribute("inert", "");
      } else {
        classList3.removeAttribute("inert");
      }
      classList3.title = hiddenClickable ? "" : classList3.getAttribute("aria-label") || "";
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
    markersRootNode.classList.toggle("is-concealed", markersConcealed);
  }
  function syncChromeInert() {
    const inert = !!focusedLightId && !!frameLoop && frameLoop !== "panel";
    for (const classList4 of [navigationEl, floorTabsEl]) {
      classList4.classList.toggle("is-focus-hidden", inert);
      classList4.inert = inert;
      classList4.setAttribute("aria-hidden", String(inert));
    }
    const popupOpacity = Number.isFinite(properties.popupOpacity) ? Math.max(0, Math.min(100, properties.popupOpacity)) : 74;
    lightPanelEl.style.setProperty("--i3d-panel-opacity", String(popupOpacity / 100));
    const vignetteStrength = Number.isFinite(properties.focusVignetteStrength) ? Math.max(0, Math.min(60, properties.focusVignetteStrength)) : 14;
    focusVignetteEl.style.setProperty("--i3d-vignette-opacity", String(vignetteStrength / 100));
    focusVignetteEl.hidden = viewEditing || frameLoop === "edit" || frameLoop === "panel";
    focusVignetteEl.classList.toggle("is-active", vignetteStrength > 0 && !!focusedLightId && !!frameLoop && !focusVignetteEl.hidden);
    viewHelpEl.hidden = !viewEditing && frameLoop !== "edit" && (!editing || !!frameLoop);
    viewHelpEl.textContent = frameLoop === "edit" ? "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后保存" + (focusedLightBinding2()?.deviceKind === "camera" ? "摄像头" : preFocusCamera === "television" ? "电视" : preFocusCamera === "nas" ? "NAS" : preFocusCamera === "cover" ? "窗帘" : preFocusCamera === "climate" ? "空调" : "此灯") + "视角。" : editing && !viewEditing ? "拖动空白处旋转 · 右键平移 · 滚轮缩放。临时查看不改变已保存视角。" : "拖动旋转 · 右键平移 · 滚轮缩放。调整完成后固定视角。";
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
    const transitionT = presentedVisible.duration ? Math.min(1, transitionElapsed / presentedVisible.duration) : 1;
    const transitionEase = presentedVisible.owner === "floor" ? transitionT * transitionT * (3 - transitionT * 2) : transitionT === 1 ? 1 : (1 - Math.exp(transitionElapsed * -5 / 1000)) / (1 - Math.exp(presentedVisible.duration * -5 / 1000));
    wakeFrameLoop = presentedVisible.inset + (presentedVisible.targetInset - presentedVisible.inset) * transitionEase;
    const transitionSample = presentedVisible.sample(transitionElapsed);
    if (presentedVisible.owner === "floor") {
      options.advanceFloorTransition?.(transitionEase, transitionSample);
    }
    if (options.applyCameraFrame) {
      options.applyCameraFrame(transitionSample, transitionEase, wakeFrameLoop);
    } else {
      options.applyCameraPose(transitionSample, transitionEase);
      options.setFocusViewport(wakeFrameLoop);
    }
    if (transitionT === 1 && presentedVisible === done) {
      presentedVisible = null;
      options.endCameraMotion();
      pointerToFloorPoint();
      done.done?.();
      syncIdleAvailability2();
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
  function animateCameraTo(cameraPose, focused2, immediate = false, done2, owner = "focus", motionOptions = null) {
    const mode = owner === "follow-return" ? cameraPose : normalizeCameraUp(cameraPose);
    const from = options.beginCameraMotion(mode.mode, mode);
    if (owner === "floor") {
      options.setFloorSlideCameras?.(from, mode);
    }
    const duration = immediate || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : owner === "floor" ? 650 : 1100;
    presentedVisible = {
      from,
      to: structuredClone(mode),
      inset: wakeFrameLoop,
      targetInset: focused2 ? focusPanelInset() : 0,
      sample: createFocusCameraSampler(THREE, from, mode, duration, owner, motionOptions),
      focused: focused2,
      owner,
      started: performance.now(),
      duration,
      done: done2
    };
    syncIdleAvailability2();
    pointerToFloorPoint();
    tickPresentedTransition(presentedVisible.started);
    wake();
  }
  function camerasNearlyEqual(mode2, mode3) {
    return mode2.mode === mode3.mode && Math.abs(mode2.zoom - mode3.zoom) < 0.000001 && ["position", "target", "up"].every(vectorKey => (mode2[vectorKey] || [0, 1, 0]).every((component, compIndex) => Math.abs(component - (mode3[vectorKey] || [0, 1, 0])[compIndex]) < 0.000001)) && ["frameSize", "focalLength"].every(scalarKey => Math.abs((mode2[scalarKey] || 0) - (mode3[scalarKey] || 0)) < 0.000001);
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
  const activity2 = createIdleIconVisibility({
    onChange(iconsHidden) {
      lightHistoryStorage = iconsHidden;
      syncMarkerVisibility();
    }
  });
  const activity3 = createIdleFocusExit({
    onExit: () => clearFocus()
  });
  function configureIdleBehaviors() {
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
    const idleIconsAllowed = presented && idleIconsHidden && interactive && !editing && !viewEditing && !active2 && !document.hidden && !disposed;
    if (!idleIconsAllowed) {
      clearLightPreviewHold();
    }
    activity.setAvailable(idleIconsAllowed && !presets && !focusedLightId && !frameLoop && (!presentedVisible || presentedVisible.owner === "idle"));
    activity3.setAvailable(idleIconsAllowed && !!focusedLightId && ["runtime", "panel"].includes(frameLoop) && !presentedVisible);
    activity2.setAvailable(idleIconsAllowed);
    markersById?.setAvailable(!document.hidden && (!pendingCommands || markerWorldCache));
    wake();
  }
  function syncIdleHold() {
    const shouldHoldIdle = lightStateCache || resolveLightState.size > 0 || effectPreview.size > 0;
    activity.hold(shouldHoldIdle);
    activity2.hold(shouldHoldIdle);
    activity3.hold(shouldHoldIdle);
    wake();
  }
  function onUserActivityEvent(type11) {
    if (presets && type11.key === "Escape") {
      displayLightState();
    }
    lightPanelHeader = performance.now();
    restoreViewButton = false;
    syncMarkerVisibility();
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
    document.addEventListener("visibilitychange", syncIdleAvailability2);
  }
  function clearFocus(immediate = {}) {
    if (focusedLightBinding2()?.deviceKind === "vacuum") {
      deviceStatus({
        type: "vacuum-popup-close"
      });
    }
    if (focusedLightBinding2()?.deviceKind === "camera") {
      deviceStatus({
        type: "camera-popup-close"
      });
    }
    root4.hide();
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
    if (activityTracked) {
      animateCameraTo(activityTracked, false, immediate.immediate === true, () => {
        activityTracked = null;
        options.setOrbitPivot(null);
      });
    }
    syncIdleAvailability2();
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
  function focusBinding(id41, focusSource = "runtime", skipCamera = false) {
    const modelId3 = findBinding(id41);
    if (!modelId3 || modelId3.modelAvailable === false) {
      return;
    }
    if (presentationScale) {
      presentationScale = null;
      syncEditorEffects();
    }
    if (focusedLightId === id41 && frameLoop === focusSource && focusSource === "runtime") {
      clearFocus();
      return;
    }
    if (["runtime", "panel"].includes(focusSource) && !interactive) {
      return;
    }
    activity3.activity();
    if (focusSource === "panel") {
      if (activityTracked || presentedVisible) {
        clearFocus({
          immediate: true
        });
      }
      focusedLightId = id41;
      frameLoop = "panel";
      controlErrorEl.textContent = "";
      lightPanelEl.removeAttribute("inert");
      lightPanelEl.classList.add("is-open");
      syncChromeInert();
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
    const focusWorldCenter = center?.center || options.worldPoint(modelId3.floorId, modelId3.x, modelId3.y, modelId3.height)?.toArray();
    if (!focusWorldCenter) {
      return;
    }
    focusedLightId = id41;
    frameLoop = focusSource;
    controlErrorEl.textContent = "";
    if (!isDeviceFocusKind(modelId3) || modelId3.clickAction !== "focus") {
      lightPanelEl.removeAttribute("inert");
      lightPanelEl.classList.add("is-open");
    } else {
      lightPanelEl.setAttribute("inert", "");
      lightPanelEl.classList.remove("is-open");
    }
    options.setOrbitPivot(null);
    syncChromeInert();
    syncLightPanel2();
    const overviewCamera = properties.camera || baseCameraState || activityTracked;
    const bindingFocusCamera = modelId3.focusCamera || (modelId3.modelId ? automaticAirConditionerCamera(THREE, {
      ...overviewCamera,
      viewportAspect: canvas.clientWidth / Math.max(1, canvas.clientHeight)
    }, focusWorldCenter, center?.forward, center?.size, modelId3.deviceKind === "nas" ? {
      minimumFrameSize: 0.7,
      minimumDistance: 0.6
    } : {}) : automaticLightCamera(THREE, overviewCamera, focusWorldCenter));
    animateCameraTo(bindingFocusCamera, true, skipCamera, () => onUserInput(modelId3));
    if (!editing) {
      deviceStatus({
        type: "focus-state",
        active: true,
        id: id41
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
    const entityId18 = focusedLightBinding2();
    if (entityId18) {
      sendLightCommand("power", !readLightPanelState(entityId18.entityId).on);
    }
  });
  function effectColorCss(on2) {
    const effectBrightness = Number.isFinite(on2.effectColor) ? Math.max(0, Math.min(100, Number(on2.brightness) || 0)) : Math.max(1, Math.min(100, Number(on2.brightness) || (on2.brightnessSupported ? 1 : 100)));
    const kelvinT = (Math.max(2000, Math.min(6500, Number(on2.kelvin) || 3000)) - 2000) / 4500;
    const map4 = [255, 132, 42];
    const coolRgb = [172, 225, 255];
    const join = map4.map((channel, channelIndex) => Math.round(channel + (coolRgb[channelIndex] - channel) * kelvinT));
    powerButtonEl.classList.toggle("is-on", on2.on);
    powerButtonEl.setAttribute("aria-pressed", String(on2.on));
    powerButtonEl.setAttribute("aria-label", "" + (focusedLightBinding2()?.label || on2.name) + (on2.available ? on2.on ? "已开启，点击关闭" : "已关闭，点击开启" : "当前不可用"));
    powerButtonEl.style.setProperty("--i3d-lamp-color", Number.isFinite(on2.effectColor) ? "#" + on2.effectColor.toString(16).padStart(6, "0") : "rgb(" + join.join(",") + ")");
    powerButtonEl.style.setProperty("--i3d-lamp-opacity", on2.on && effectBrightness > 0 ? String(0.08 + effectBrightness / 100 * 0.92) : "0");
    powerButtonEl.style.setProperty("--i3d-lamp-scale", String(0.62 + effectBrightness / 100 * 1.05));
  }
  function syncLightPanel2() {
    const entityId19 = focusedLightBinding2();
    if (["vacuum", "presence", "camera"].includes(entityId19?.deviceKind)) {
      lightPanelEl.classList.remove("is-open");
      lightPanelEl.setAttribute("inert", "");
      return;
    }
    const isNas = entityId19?.deviceKind === "nas";
    const isTelevision = entityId19?.deviceKind === "television";
    if (!isTelevision || !lightPanelEl.classList.contains("is-open")) {
      root4.hide();
    } else {
      root4.root.hidden = false;
    }
    root3.root.hidden = !isNas;
    lightPanelEl.classList.toggle("is-nas-panel", isNas);
    lightPanelEl.classList.toggle("is-television-panel", isTelevision);
    if (isNas || isTelevision) {
      lightPanelEl.classList.remove("is-cover-panel", "is-climate-panel", "has-light-controls", "has-error");
      lightPanelEl.setAttribute("aria-label", isTelevision ? "电视状态" : "NAS 状态");
      if (entityId19.clickAction === "focus") {
        lightPanelEl.classList.remove("is-open");
        lightPanelEl.setAttribute("inert", "");
      }
      root.root.hidden = root2.root.hidden = lightPanelHeaderEl.hidden = lightControlsEl.hidden = controlErrorEl.hidden = true;
      if (isTelevision) {
        if (entityId19.clickAction !== "focus" && lightPanelEl.classList.contains("is-open")) {
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
    const isCover = entityId19?.deviceKind === "cover";
    const isClimateModel = !!entityId19?.modelId && !isCover;
    root.root.hidden = !isClimateModel;
    root2.root.hidden = !isCover;
    lightPanelHeaderEl.hidden = lightControlsEl.hidden = controlErrorEl.hidden = isClimateModel || isCover;
    lightPanelEl.classList.toggle("is-cover-panel", isCover);
    lightPanelEl.classList.toggle("is-climate-panel", isClimateModel);
    lightPanelEl.setAttribute("aria-label", isCover ? "窗帘控制" : isClimateModel ? "空调控制" : "灯光控制");
    if (!entityId19) {
      return clearFocus();
    }
    if (isCover) {
      lightPanelEl.classList.remove("has-light-controls", "has-error");
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
    if (isClimateModel) {
      lightPanelEl.classList.remove("has-light-controls", "has-error");
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
    const isEditingThis = editing && presentationScale?.id === entityId19.id;
    let min = 1;
    let max = 100;
    if (isEditingThis) {
      const editLightSnapshot = {
        ...entityId19,
        ...available3
      };
      const kelvin2 = options.mapLightEffectState(editLightSnapshot);
      const brightness2 = options.mapLightEffectState({
        ...editLightSnapshot,
        brightness: 1,
        kelvin: available3.minimum
      });
      const brightness3 = options.mapLightEffectState({
        ...editLightSnapshot,
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
    powerButton.textContent = isEditingThis ? "效果预览" : entityId19.entityId ? available3.available ? available3.on ? "已开启" : "已关闭" : "设备不可用" : "尚未绑定设备";
    lightHeadingText.title = lightHeadingText.textContent;
    controlErrorEl.title = controlErrorEl.textContent;
    effectColorCss(available3);
    powerButton.classList.toggle("is-on", available3.available && available3.on);
    const controlBusy = [...sceneUpdating.values()].some(entityId14 => entityId14.entityId === entityId19.entityId);
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
    input3.input.min = min;
    input3.input.max = max;
    input2.input.min = available3.minimum;
    input2.input.max = available3.maximum;
    for (const [input, sliderSupported, sliderValue, sliderSuffix] of [[input3, available3.brightnessSupported, available3.brightness, "%"], [input2, available3.temperatureSupported, available3.kelvin, " K"]]) {
      input.root.hidden = !sliderSupported;
      input.input.disabled = editing || !available3.available || !available3.on;
      if (document.activeElement !== input.input) {
        input.input.value = sliderValue ?? (input === input3 ? 100 : available3.minimum);
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
    const requestId4 = String(++controlRequestSeq);
    const entityId20 = command.entityId;
    reject4.retain(entityId20, previewToken);
    const timeout7 = setTimeout(() => finishControlRequest(requestId4, "请求超时，请检查设备状态。", true), 14000);
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
  function handleControlResult(data3, previewToken2) {
    const next2 = [...sceneUpdating.values()].find(entityId15 => entityId15.entityId === data3.entityId);
    if (!next2) {
      return queueControlCommand(data3, previewToken2);
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
  function finishControlRequest(controlRequestId, resultError = "", timedOut = false) {
    const entityId21 = sceneUpdating.get(controlRequestId);
    if (!entityId21) {
      return;
    }
    clearTimeout(entityId21.timeout);
    sceneUpdating.delete(controlRequestId);
    const previewToken3 = entityId21.next;
    const shouldRetainPreview = previewToken3 && !timedOut && !disposed && !editing && interactive && preFocusCamera === "light" && activeFloorId !== "all" && (properties.lights || []).some(entityId9 => idleCameraBase(entityId9) && entityId9.entityId === entityId21.entityId) && resolveLightEntityState(entityId21.entityId).available;
    if (resultError) {
      reject4.reject(entityId21.entityId, entityId21.previewToken);
    } else {
      reject4.acknowledge(entityId21.entityId, entityId21.previewToken);
    }
    if (shouldRetainPreview) {
      queueControlCommand(previewToken3.command, previewToken3.previewToken);
    } else if (previewToken3) {
      reject4.reject(entityId21.entityId, previewToken3.previewToken);
    }
    if (focusedLightBinding2()?.entityId === entityId21.entityId) {
      controlErrorEl.textContent = shouldRetainPreview ? "" : resultError;
    }
    pruneMarkerElements();
  }
  async function sendLightCommand(commandName, brightness5, entityId22 = focusedLightBinding2()) {
    if (!!entityId22 && !editing && !disposed) {
      try {
        const brightnessSupported = resolveLightEntityState(entityId22.entityId);
        let data2;
        let kelvin = brightness5;
        if (commandName === "preset") {
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
          const map = push.map(([presetKey, presetValue]) => lightCommand(entityId22.entityId, presetKey, presetValue, brightnessSupported));
          data2 = {
            ...map[0],
            data: Object.assign({}, ...map.map(data => data.data))
          };
          if (brightnessSupported.brightnessSupported && brightness5.brightness < 100) {
            delete data2.data.brightness;
            data2.data.brightness_pct = brightness5.brightness;
          }
        } else {
          data2 = lightCommand(entityId22.entityId, commandName, brightness5, brightnessSupported);
        }
        const commandPreview = reject4.set(entityId22.entityId, commandName, kelvin, true);
        syncEditorEffects({
          preview: commandName !== "power"
        });
        handleControlResult(data2, commandPreview);
        controlErrorEl.textContent = "";
        pruneMarkerElements();
      } catch (message3) {
        controlErrorEl.textContent = message3.message;
        syncLightPanel2();
      }
    }
  }
  function activateBinding(id42, fromMarker = false) {
    if (!editing && (idleReturning() || activeFloorId === "all")) {
      return;
    }
    const entityId23 = findBinding(id42);
    if (!entityId23 || entityId23.modelAvailable === false || presets && !editing) {
      return;
    }
    const clickAction = entityId23.clickAction || "focus";
    if (editing) {
      selectedId = id42;
      deviceStatus({
        type: "edit",
        action: "select",
        id: id42
      });
      pruneMarkerElements();
      return;
    }
    if (entityId23.deviceKind === "vacuum-room") {
      if (!interactive || !entityId23.entityId || entryMap.has(id42)) {
        return;
      }
      const focusTimeout = setTimeout(() => {
        entryMap.delete(id42);
        const disabled = rawProperties.get(id42);
        if (disabled) {
          disabled.disabled = false;
          disabled.title = "请求超时，请检查设备状态";
        }
      }, 14000);
      entryMap.set(id42, focusTimeout);
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
    if (isDeviceFocusKind(entityId23)) {
      const openVacuumPopup = fromMarker && entityId23.deviceKind === "vacuum" && vacuumStatusPresentation(entityId23, states).active;
      focusBinding(id42, openVacuumPopup || entityId23.clickAction === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId23.deviceKind === "cover") {
      focusBinding(id42, clickAction === "panel" ? "panel" : "runtime");
      return;
    }
    if (entityId23.modelId) {
      if (clickAction === "turn-on") {
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
      focusBinding(id42, clickAction === "turn-on-panel" ? "panel" : "runtime");
      if (clickAction !== "focus" && focusedLightId === id42) {
        root.power?.({
          toggle: false
        });
      }
      return;
    }
    const available4 = readLightPanelState(entityId23.entityId);
    if (clickAction === "turn-on") {
      if (available4.available) {
        sendLightCommand("power", !available4.on, entityId23);
      }
      return;
    }
    if (clickAction === "turn-on-panel") {
      focusBinding(id42, "panel");
      if (available4.available && !available4.on) {
        sendLightCommand("power", true, entityId23);
      }
      return;
    }
    focusBinding(id42);
    if (focusedLightId === id42 && frameLoop === "runtime" && clickAction === "turn-on-focus" && available4.available && !available4.on) {
      sendLightCommand("power", true);
    }
  }
  let lastMarkerLayoutKey = "";
  function updateMarkerPositions2(forceLayout = false) {
    if (active2 || toolbar || disposed) {
      return;
    }
    if (currentCamera !== null && performance.now() - currentCamera >= 240 && !visibleBindings().some(deviceKind7 => deviceKind7.deviceKind === "vacuum" && vacuumStatusPresentation(deviceKind7, states).active)) {
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
    const layoutKey = layoutWidth + ":" + layoutHeight + ":" + options.camera.matrixWorld.elements + ":" + options.camera.projectionMatrix.elements;
    if (forceLayout === true || layoutKey !== lastMarkerLayoutKey) {
      lastMarkerLayoutKey = layoutKey;
      for (const id39 of visibleBindings()) {
        const floorId5 = dragState?.id === id39.id ? {
          ...id39,
          ...dragState.point
        } : id39;
        const bindingIdNode = floorId5.id;
        const hidden = rawProperties.get(bindingIdNode);
        if (!hidden) {
          continue;
        }
        const markerVisible = (editing || floorId5.visible !== false) && (editing || floorId5.buttonHidden !== true) && floorId5.modelAvailable !== false && (activeFloorId === "all" || floorId5.floorId === activeFloorId);
        let floorId6 = markersSuppressedByActivity.get(bindingIdNode);
        if (markerVisible && (!floorId6 || floorId6.floorId !== floorId5.floorId || floorId6.x !== floorId5.x || floorId6.y !== floorId5.y || floorId6.height !== floorId5.height)) {
          floorId6 = {
            floorId: floorId5.floorId,
            x: floorId5.x,
            y: floorId5.y,
            height: floorId5.height,
            point: options.worldPoint(floorId5.floorId, floorId5.x, floorId5.y, floorId5.height)
          };
          markersSuppressedByActivity.set(bindingIdNode, floorId6);
        }
        const hasScreenPoint = markerVisible && floorId6?.point;
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
    const has = new Set(visibleBindings().map(id32 => id32.id));
    for (const [markerEntryId, remove] of rawProperties) {
      if (!has.has(markerEntryId)) {
        remove.remove();
        rawProperties.delete(markerEntryId);
        markersSuppressedByActivity.delete(markerEntryId);
      }
    }
    for (const deviceKind11 of visibleBindings()) {
      let classList2 = rawProperties.get(deviceKind11.id);
      if (!classList2) {
        classList2 = createEl(deviceKind11.passiveSensor ? "div" : "button", "i3d-marker");
        classList2.type = "button";
        classList2.addEventListener("click", stopPropagation => {
          stopPropagation.stopPropagation();
          if (!deviceKind11.passiveSensor && !toolbar && !viewEditing && frameLoop !== "edit" && (!!editing || findBinding(deviceKind11.id)?.buttonHidden !== true)) {
            if (classList2.dataset.dragged === "true") {
              classList2.dataset.dragged = "";
              return;
            }
            activateBinding(deviceKind11.id, true);
          }
        });
        classList2.addEventListener("pointerdown", pointerEvent => onMarkerPointerDown(pointerEvent, deviceKind11.id));
        classList2.addEventListener("pointermove", onMarkerPointerMove);
        classList2.addEventListener("pointerup", onMarkerPointerUp);
        classList2.addEventListener("pointercancel", cancelMarkerDrag);
        markersRootNode.append(classList2);
        rawProperties.set(deviceKind11.id, classList2);
      }
      const slice2 = /^mdi:[a-z0-9-]+$/.test(deviceKind11.icon || "") ? deviceKind11.icon : "";
      const isVacuumMarker = deviceKind11.deviceKind === "vacuum";
      const isVacuumRoomMarker = deviceKind11.deviceKind === "vacuum-room";
      if (!isVacuumMarker && classList2.dataset.icon !== slice2) {
        classList2.dataset.icon = slice2;
        if (slice2) {
          const style = createEl("span", "i3d-marker-icon");
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
      } : deviceKind11.deviceKind === "television" ? televisionState(deviceKind11, states) : deviceKind11.deviceKind === "nas" ? nasDeviceState(deviceKind11, states) : deviceKind11.deviceKind === "cover" ? coverState(deviceKind11.entityId, states[deviceKind11.entityId]) : deviceKind11.modelId ? climateState(deviceKind11.entityId, states[deviceKind11.entityId]) : readLightPanelState(deviceKind11.entityId);
      const markerSize = Number.isFinite(deviceKind11.size) && deviceKind11.size > 0 ? deviceKind11.size : 44;
      const iconSizeNode = Number.isFinite(deviceKind11.iconSize) && deviceKind11.iconSize > 0 ? deviceKind11.iconSize : isVacuumMarker ? 26 : Math.min(markerSize, Math.max(4, markerSize - 18));
      const hitSizeNode = Number.isFinite(deviceKind11.hitSize) && deviceKind11.hitSize > 0 ? deviceKind11.hitSize : Math.max(44, markerSize);
      classList2.style.width = classList2.style.height = hitSizeNode + "px";
      classList2.classList.toggle("is-vacuum-status", isVacuumMarker);
      classList2.classList.toggle("is-overview-quip", deviceKind11.overviewQuip === true);
      classList2.classList.toggle("is-presence-wave", deviceKind11.passiveSensor === true);
      classList2.classList.toggle("is-security-label", deviceKind11.deviceKind === "camera" || deviceKind11.deviceKind === "presence" && editing);
      if (isVacuumMarker) {
        let querySelector = classList2.querySelector(".i3d-vacuum-status");
        if (!querySelector || querySelector.dataset.compact !== String(deviceKind11.overviewQuip === true)) {
          querySelector = createEl("span", "i3d-vacuum-status");
          querySelector.dataset.compact = String(deviceKind11.overviewQuip === true);
          if (!deviceKind11.overviewQuip) {
            querySelector.append(createEl("strong", "i3d-vacuum-status-name"), createEl("span", "i3d-vacuum-status-detail"));
            querySelector.lastElementChild.append(createEl("span", "i3d-vacuum-status-text"), createEl("span", "i3d-vacuum-status-battery"));
          }
          querySelector.append(createEl("span", "i3d-vacuum-quip"));
          classList2.replaceChildren(querySelector);
        }
        const status = vacuumStatusPresentation(deviceKind11, states);
        const markerScale = markerSize / 44;
        if (!deviceKind11.overviewQuip) {
          querySelector.querySelector(".i3d-vacuum-status-name").textContent = deviceKind11.label || "扫地机器人";
          querySelector.querySelector(".i3d-vacuum-status-text").textContent = status.status;
          querySelector.querySelector(".i3d-vacuum-status-battery").textContent = status.battery;
        }
        const textContent = querySelector.querySelector(".i3d-vacuum-quip");
        textContent.textContent = status.active ? vacuumQuip(deviceKind11, states, performance.now()) : "";
        textContent.hidden = !textContent.textContent;
        querySelector.style.transform = "translate(-50%,-50%) scale(" + markerScale + ")";
        querySelector.style.fontSize = Math.max(8, iconSizeNode / 2) + "px";
        const hitPadding = Math.max(deviceKind11.overviewQuip ? 28 : 50, querySelector.offsetHeight);
        classList2.style.width = Math.max(hitSizeNode, markerScale * 140) + "px";
        classList2.style.height = Math.max(hitSizeNode, hitPadding * markerScale) + "px";
        classList2.dataset.status = status.status;
        classList2.title = (deviceKind11.label || "扫地机器人") + " · " + status.status + " · " + status.battery;
        on.on = status.active;
        on.available = status.available;
      }
      if (deviceKind11.deviceKind === "camera" || deviceKind11.deviceKind === "presence") {
        const securityState = states[deviceKind11.entityId]?.newState || states[deviceKind11.entityId];
        const available = deviceKind11.deviceKind === "camera" ? cameraOnline(securityState) : securityState?.available !== false && !!securityState?.state && !["unknown", "unavailable"].includes(securityState.state);
        on.available = available;
        on.on = deviceKind11.deviceKind === "camera" ? securityState?.state === "recording" : securityState?.state === "on";
        if (deviceKind11.passiveSensor) {
          classList2.querySelector(".i3d-sensor-wave") || classList2.replaceChildren(...[0, 1, 2].map(() => createEl("span", "i3d-sensor-wave")));
          classList2.hidden = !available;
          classList2.setAttribute("aria-hidden", "true");
          classList2.classList.toggle("is-inactive", !available);
        } else {
          const isSensorChoice = deviceKind11.deviceKind === "presence" && editing;
          classList2.classList.toggle("is-sensor-choice", isSensorChoice);
          let securityLabel = classList2.querySelector(".i3d-security-label");
          securityLabel || (securityLabel = createEl("span", "i3d-security-label"), securityLabel.append(createEl("strong"), createEl("span")), classList2.append(securityLabel));
          securityLabel.children[0].textContent = deviceKind11.label || (deviceKind11.deviceKind === "camera" ? "摄像头" : "人体传感器");
          securityLabel.children[1].textContent = editing && !deviceKind11.entityId ? "未绑定实体" : available ? deviceKind11.deviceKind === "presence" ? securityState.state === "on" ? "有人" : "检测中" : "在线" : "离线";
          securityLabel.children[1].hidden = isSensorChoice;
          securityLabel.classList.toggle("is-camera-status", deviceKind11.deviceKind === "camera");
          securityLabel.classList.toggle("is-camera-offline", !available);
          securityLabel.style.fontSize = (deviceKind11.fontSize || 12) + "px";
          if (deviceKind11.deviceKind === "camera") {
            const markerIcon = classList2.querySelector(".i3d-marker-icon");
            markerIcon && markerIcon.parentNode !== securityLabel && securityLabel.append(markerIcon);
            securityLabel.style.setProperty("--i3d-marker-icon-size", iconSizeNode + "px");
          }
          classList2.style.setProperty("--i3d-security-scale", String(markerSize / 44));
          classList2.style.width = Math.max(hitSizeNode, (deviceKind11.deviceKind === "camera" ? securityLabel.offsetWidth || 0 : isSensorChoice ? 120 : 180) * markerSize / 44) + "px";
          classList2.style.height = Math.max(hitSizeNode, (deviceKind11.deviceKind === "camera" ? securityLabel.offsetHeight || 0 : isSensorChoice ? 32 : 58) * markerSize / 44) + "px";
        }
      }
      classList2.classList.toggle("i3d-vacuum-room", isVacuumRoomMarker);
      classList2.classList.toggle("is-icon-hidden", isVacuumRoomMarker && deviceKind11.iconHidden === true);
      if (isVacuumRoomMarker) {
        let textContent2 = classList2.querySelector(".i3d-room-label");
        if (!textContent2) {
          textContent2 = createEl("span", "i3d-room-label");
          classList2.append(textContent2);
        }
        textContent2.textContent = deviceKind11.label || "清扫";
        textContent2.hidden = deviceKind11.labelHidden === true;
        textContent2.style.fontSize = (deviceKind11.fontSize || 12) + "px";
      }
      classList2.style.setProperty("--i3d-marker-size", markerSize + "px");
      classList2.style.setProperty("--i3d-marker-icon-size", iconSizeNode + "px");
      classList2.setAttribute("aria-label", deviceKind11.overviewQuip ? vacuumQuip(deviceKind11, states, performance.now()) : deviceKind11.label || on.name || "灯光");
      if (!isVacuumMarker) {
        classList2.title = deviceKind11.label || on.name;
      }
      classList2.classList.toggle("is-on", deviceKind11.deviceKind === "cover" ? coverIconIsOn(deviceKind11, on) : on.on);
      classList2.classList.toggle("is-offline", !editing && !on.available);
      classList2.classList.toggle("is-nas", deviceKind11.deviceKind === "nas");
      classList2.classList.toggle("is-selected", editing && selectedId === deviceKind11.id);
    }
    syncEditorEffects();
    queueOrSendCommand();
    syncLightPanel2();
    syncPresentationLayout();
    syncMarkerVisibility();
    updateMarkerPositions2(true);
  }
  function screenPointFromWorld(clientX2, floorId9) {
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
  function onMarkerPointerDown(pointerId2, id43) {
    if (!editing || frameLoop || pointerId2.button !== 0) {
      return;
    }
    pointerId2.preventDefault();
    pointerId2.stopPropagation();
    const x15 = findBinding(id43);
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
    const x16 = screenPointFromWorld(pointerId2, x15);
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
  function onMarkerPointerMove(pointerId3) {
    if (!dragState || dragState.pointerId !== pointerId3.pointerId || Math.hypot(pointerId3.clientX - dragState.clientX, pointerId3.clientY - dragState.clientY) < 4 && !dragState.moved) {
      return;
    }
    const x17 = screenPointFromWorld(pointerId3, findBinding(dragState.id));
    if (x17) {
      dragState.moved = true;
      dragState.point = {
        x: Math.round((x17.x + dragState.offset.x) * 100) / 100,
        y: Math.round((x17.y + dragState.offset.y) * 100) / 100
      };
      if (preFocusCamera === "light") {
        Object.assign(findBinding(dragState.id), dragState.point);
      }
      updateMarkerPositions2(true);
    }
  }
  function onMarkerPointerUp(pointerId4) {
    if (!!dragState && dragState.pointerId === pointerId4.pointerId) {
      if (dragState.moved) {
        pointerId4.currentTarget.dataset.dragged = "true";
        const deviceKind8 = findBinding(dragState.id);
        const vacuumForRoom = deviceKind8.deviceKind === "camera" ? properties.security?.cameras?.find(id13 => "camera:" + id13.id === deviceKind8.id) : deviceKind8.deviceKind === "vacuum-room" ? properties.devices?.vacuums?.find(id6 => id6.id === deviceKind8.vacuumId)?.shortcuts?.find(id14 => id14.id === deviceKind8.shortcutId) : preFocusCamera === "light" ? deviceKind8 : (["nas", "television", "vacuum"].includes(preFocusCamera) ? properties.devices?.[preFocusCamera === "vacuum" ? "vacuums" : preFocusCamera === "television" ? "televisions" : "nas"] || [] : properties.environment?.[preFocusCamera === "cover" ? "curtains" : "airConditioners"] || []).find(id12 => id12.id === dragState.id);
        if (vacuumForRoom) {
          Object.assign(vacuumForRoom, dragState.point);
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
  function cancelMarkerDrag() {
    if (dragState && preFocusCamera === "light") {
      Object.assign(findBinding(dragState.id), dragState.original);
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
    const isTap = id44 && !id44.moved && id44.id === clientX.pointerId && Math.hypot(clientX.clientX - id44.x, clientX.clientY - id44.y) < 5;
    id44 = null;
    if (!!isTap && !presets && frameLoop !== "edit") {
      if (!editing && !viewEditing && interactive && !presentedVisible) {
        const presencePick = hitRects.pick(clientX.clientX, clientX.clientY, options.camera, canvas, properties.security?.presenceSensors || []);
        if (presencePick) {
          focusBinding("presence:" + presencePick);
          return;
        }
      }
      if (!idleReturning() && preFocusCamera !== "light" && !viewEditing && !presentedVisible && (editing || interactive)) {
        const floorId3 = options.pickEnvironmentModel?.(clientX.clientX, clientX.clientY, visibleBindings(), clientX.pointerType === "touch" ? 10 : 5);
        const id28 = floorId3 && visibleBindings().find(floorId => floorId.floorId === floorId3.floorId && floorId.modelId === floorId3.modelId);
        if (id28) {
          activateBinding(id28.id);
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
  function onParentMessage(data4) {
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
        syncPresentationLayout();
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
        requestId5.properties.camera = transformCameraForFloor(focusVignette.floorCameras?.[focusViewport] || null, focusViewport);
      }
      activity.activity();
      activity2.activity();
      activity3.activity();
      const viewEditingChanged = viewEditing && requestId5.viewEditing !== true || JSON.stringify(properties.camera) !== JSON.stringify(requestId5.properties.camera);
      if ((frameLoop || activityTracked || presentedVisible) && (viewEditingChanged || properties.floorSelection !== requestId5.properties.floorSelection || editing !== (requestId5.editing === true) || requestId5.viewEditing === true || editing && selectedId !== (requestId5.selectedId || ""))) {
        clearFocus({
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
      const moduleCandidates = editing ? ["security", "climate", "cover", "nas", "television", "vacuum", "vacuum-shortcut"].includes(requestId5.editingModule) ? requestId5.editingModule : "light" : ["overview", "security", "light", "devices", "vacuum"].includes(preFocusCamera) ? preFocusCamera : ["nas", "television"].includes(preFocusCamera) ? "devices" : "environment";
      if (preFocusCamera !== moduleCandidates) {
        clearFocus({
          immediate: true
        });
        preFocusCamera = moduleCandidates;
      }
      for (const next of sceneUpdating.values()) {
        if (next.next && (!interactive || !(properties.lights || []).some(entityId3 => entityId3.entityId === next.entityId))) {
          reject4.reject(next.entityId, next.next.previewToken);
          next.next = null;
        }
      }
      configureIdleBehaviors();
      syncIdleAvailability2();
      options.appearance(active2 ? {
        ...properties,
        lightRegionOverrides: options.regionLighting.getOverrides()
      } : properties);
      const floorExists = options.document.floors.some(id15 => id15.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
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
          syncIdleAvailability2();
          updateMarkerPositions2(true);
          deviceStatus({
            type: "presented",
            configId: requestId5.configId,
            camera: transformCameraForFloor(options.cameraState(), properties.floorSelection, true)
          });
        }
      }).catch(message2 => {
        if (!disposed && presentToken === presentGeneration) {
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
        moduleEmptyEl.hidden = false;
        moduleEmptyEl.textContent = requestId5.error;
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
        openRangeEditor(requestId5.requestId);
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
      syncMarkerVisibility();
      lightStateCache = requestId5.held === true;
      syncIdleHold();
    } else if (requestId5.type === "dismiss-focus") {
      activity.activity();
      activity2.activity();
      clearFocus({
        immediate: requestId5.immediate === true
      });
    } else if (requestId5.type === "states") {
      states = requestId5.patch === true ? {
        ...states,
        ...(requestId5.states || {})
      } : requestId5.states || {};
      for (const entityId4 of properties.lights || []) {
        if (requestId5.patch !== true || Object.hasOwn(requestId5.states || {}, entityId4.entityId)) {
          reject4.reconcile(entityId4.entityId, resolveLightEntityState(entityId4.entityId));
        }
      }
      pruneMarkerElements();
    } else if (requestId5.type === "control-result") {
      if (set2.has(requestId5.requestId)) {
        enqueueCommand(requestId5.requestId, requestId5.error);
      } else if (map.has(requestId5.requestId)) {
        camerasEqual(requestId5.requestId, requestId5.error);
      } else if (fallback.has(requestId5.requestId)) {
        moveFocusOut(requestId5.requestId, requestId5.error);
      } else {
        finishControlRequest(requestId5.requestId, requestId5.error || "", requestId5.timedOut === true);
      }
    } else if (requestId5.type === "editor-command" && editing) {
      try {
        if (requestId5.command === "presence-top-view") {
          const {
            floorId: presenceFloorId,
            box: x2
          } = requestId5.value || {};
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
        } else if (requestId5.command === "presence-3d-view") {
          options.setCameraView?.("free");
          options.restoreCamera(properties.camera || options.floorDefaultCamera?.(activeFloorId) || baseCameraState);
        } else if (requestId5.command === "presence-preview-walk") {
          presenceEditorActive = requestId5.value === true;
          syncMarkers();
        } else if (requestId5.command === "presence-show-hit-range") {
          presenceHitTesting = requestId5.value === true;
          syncLightPanel();
        } else if (requestId5.command === "edit-follow-camera") {
          const deviceKind = findBinding(requestId5.id);
          if (deviceKind?.deviceKind !== "vacuum") {
            throw new Error("请选择扫地机。");
          }
          focusBinding(requestId5.id, "edit", true);
          const value = options.environmentModelPose(deviceKind.floorId, deviceKind.modelId)?.center || options.cameraState().target;
          animateCameraTo(deviceKind.followCamera || vacuumBirdCamera(properties.camera || options.cameraState(), value), false, true);
        } else if (requestId5.command === "edit-light-camera") {
          focusBinding(requestId5.id, "edit", true);
        } else if (requestId5.command === "preview-light-camera") {
          focusBinding(requestId5.id, "preview");
        } else if (requestId5.command === "preview-light-effect") {
          if (!["brightnessMin", "brightnessMax", "temperatureMin", "temperatureMax", "defaults"].includes(requestId5.value)) {
            throw new Error("请选择要预览的效果。");
          }
          if (!findBinding(requestId5.id)) {
            throw new Error("灯光按钮已移除。");
          }
          if (!findBinding(requestId5.id).entityId) {
            throw new Error("请先绑定实体，再预览灯光效果。");
          }
          focusBinding(requestId5.id, "preview");
          presentationScale = {
            id: requestId5.id,
            kind: requestId5.value
          };
          syncEditorEffects({
            preview: true
          });
          syncLightPanel2();
        } else if (requestId5.command === "cancel-light-camera") {
          clearFocus({
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
          clearFocus({
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
  window.addEventListener("message", onParentMessage);
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
      const hasFloorSelection = options.document.floors.some(id13 => id13.id === properties.floorSelection) || properties.floorSelection === "all" ? properties.floorSelection : options.document.floors[0].id;
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
    eligible: () => !disposed && presented && idleIconsHidden && !document.hidden && !editing && !viewEditing && !frameLoop && !presentedVisible && !dragState && !active2 && !toolbar && !sceneUpdating.size && !fallback.size && !map.size && !set2.size && !curtainMotion.isMoving() && nextDelay.nextDelay() === Infinity && !lightStateCache && !resolveLightState.size && !effectPreview.size && performance.now() - lightPanelHeader > 1200,
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
        if (focusedLightBinding2()?.deviceKind === "cover") {
          syncLightPanel2();
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
    const vacuumTickMs = sync2.tick(frameTime);
    activity3.tick(frameTime);
    activity.tick(frameTime);
    activity2.tick(frameTime);
    if (reject4.expire()) {
      pruneMarkerElements();
    }
    const frameDeltaSec = brightnessSlider ? Math.min(0.1, (frameTime - brightnessSlider) / 1000) : 0;
    brightnessSlider = frameTime;
    const presenceTicked = !cameraBusy && hitRects.tick(frameDeltaSec);
    syncLightPanel();
    const vacuumMapTicked = !cameraBusy && hasTracking.tick(frameDeltaSec);
    if (vacuumMapTicked) {
      lastMarkerLayoutKey = "";
      updateMarkerPositions2(true);
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
      if (lightControls && !presentedVisible && !presets) {
        hideIconsUntilDeg = frameTime + 180;
      }
      lightControls = cameraQuatKey;
    }
    const hideIconsWhileOrbit = focusMode.hideIconsWhileRotating === true && !editing && !viewEditing && (userHeld || frameTime < hideIconsUntilDeg);
    if (hideIconsWhileOrbit !== temperatureSlider) {
      temperatureSlider = hideIconsWhileOrbit;
      syncMarkerVisibility();
    }
    const anyVacuumFollowing = (properties.devices?.vacuums || []).some(id36 => idleCameraBase(id36) && hasTracking.hasTracking(id36.id));
    followRoamBtn.hidden = editing || !presets && (preFocusCamera !== "vacuum" || !anyVacuumFollowing);
    toolbarEl.hidden = followRoamBtn.hidden;
    followRoamBtn.disabled = !presets && !anyVacuumFollowing;
    updateMarkerPositions2();
    canvas.dataset.stageFrameChecks = String(markersById.stats.frames);
    return Math.min(presenceWaveTicked ? 1000 / 30 : Infinity, presenceTicked ? 1000 / 30 : Infinity, vacuumMapTicked || presets ? 1000 / 30 : Infinity, temperatureSlider ? 100 : Infinity, anyVacuumActive ? 7000 - frameTime % 7000 : Infinity, presentedVisible || curtainTickMs || vacuumTickMs ? 0 : Infinity, curtainMotion.isMoving() ? 1000 / 30 : Infinity, nextDelay.nextDelay(frameTime), setRoot.nextDelay(), markersRoot.nextDelay(), activity3.nextDelay(frameTime), activity.nextDelay(frameTime), activity2.nextDelay(frameTime), reject4.nextDelay(frameTime));
  }
  markersById = options.createFrameLoop({
    step: frameDt => options.profileFrameWork ? options.profileFrameWork("stage-updates", () => tickStageFrame(frameDt)) : tickStageFrame(frameDt)
  });
  syncIdleAvailability2();
  window.addEventListener("pagehide", () => {
    finishCommand();
    document.removeEventListener("visibilitychange", collectMetadata);
    sync2.dispose();
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
    root2.dispose();
    curtainMotion.dispose();
    nextDelay.clear();
    for (const pendingControlId of set2.keys()) {
      enqueueCommand(pendingControlId, "页面已关闭。");
    }
    for (const pendingCameraRequestId of map.keys()) {
      camerasEqual(pendingCameraRequestId, "页面已关闭。");
    }
    presentationRoot.flush();
    sceneSync();
    root3.dispose();
    markersRoot.dispose();
    cameraStatus.dispose();
    root4.dispose();
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
    activity2.dispose();
    activity3.dispose();
    presentedVisible = null;
    deviceStatus({
      type: "focus-state",
      active: false
    });
    for (const activityEventName of activityEventTypes) {
      window.removeEventListener(activityEventName, onUserActivityEvent, true);
    }
    window.removeEventListener("blur", clearLightPreviewHold);
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
            walls: scene.scene.walls.map(start2 => ({
              start: start2.start,
              end: start2.end,
              thickness: start2.thickness
            }))
          },
          vacuums: scene.scene.items.filter(type => type.type === "robotvacuum").map((id7, vacuumIndex) => ({
            id: id7.id,
            name: id7.name || "扫地机 " + (vacuumIndex + 1),
            x: id7.x,
            y: id7.y,
            height: (Number(id7.elevation) || 0) + (Number(id7.height) || 0.85) / 2
          })),
          televisions: scene.scene.items.filter(type2 => type2.type === "tv").map((id8, tvIndex) => ({
            id: id8.id,
            name: id8.name || "电视 " + (tvIndex + 1),
            type: id8.type,
            x: id8.x,
            y: id8.y,
            height: (Number(id8.elevation) || 0) + (Number(id8.height) || 0.92) * 0.62
          })),
          nas: scene.scene.items.filter(type3 => type3.type === "nas").map((id9, nasIndex) => ({
            id: id9.id,
            name: id9.name || "NAS " + (nasIndex + 1),
            type: id9.type,
            x: id9.x,
            y: id9.y,
            height: (Number(id9.elevation) || 0) + (Number(id9.height) || 0.34) / 2
          })),
          curtains: scene.scene.items.filter(type4 => type4.type === "curtain").map((id10, curtainIndex) => ({
            id: id10.id,
            name: id10.name || "窗帘 " + (curtainIndex + 1),
            type: id10.type,
            x: id10.x,
            y: id10.y,
            height: (Number(id10.elevation) || 0) + (Number(id10.height) || 2.4) / 2,
            curtainPosition: id10.curtainPosition || "split"
          })),
          airConditioners: scene.scene.items.filter(type5 => ["wallac", "floorac", "airoutlet"].includes(type5.type)).map((type6, acIndex) => ({
            id: type6.id,
            name: type6.name || (type6.type === "airoutlet" ? "出风口" : type6.type === "wallac" ? "挂机空调" : "柜机空调") + " " + (acIndex + 1),
            type: type6.type,
            x: type6.x,
            y: type6.y,
            height: (Number(type6.elevation) || 0) + (Number(type6.height) || 0.28) / 2
          })),
          groups: (scene.scene.lightGroups || []).map(id11 => {
            const length = (scene.scene.items || []).filter(item => item.lightGroupId === id11.id);
            const length2 = length.length ? length : (scene.scene.walls || []).map(wall => wall.start).filter(Boolean);
            return {
              id: id11.id,
              name: id11.name,
              height: wallHeight,
              x: length2.length ? length2.reduce((sum, x) => sum + x.x, 0) / length2.length : 0,
              y: length2.length ? length2.reduce((sum, y) => sum + y.y, 0) / length2.length : 0
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
