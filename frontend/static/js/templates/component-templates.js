import { interaction3dTemplate } from "../../modules/interaction3d/definition.js?v=20260905-interaction3d-v1";

const templateRegistry = new Map();
const uiPackRegistry = new Map();
const COMPONENT_TYPE_GROUPS = {
  shared: [
    "time",
    "date",
    "weather",
    "line-chart",
    "panel-frame",
    "navigation-button",
  ],
  page: [
    "image",
    "floorplan-auto-diagram",
    "title-button",
    "light-statistics",
    "icon-button",
    "icon-button-effect",
    "device-button",
    "presence-sensor",
    "air-conditioner",
    "vacuum-map",
    "camera",
    "line-chart",
    "panel-frame",
    "interaction3d",
  ],
};
const componentDefaults = {
  image: {
    properties: {
      opacity: 1,
      layoutMode: "free",
      fit: "contain",
    },
    style: {
      scale: 1,
      visible: true,
    },
  },
  "floorplan-auto-diagram": {
    properties: {
      label: "户型图自动导图",
      exportFolder: "",
      layoutMode: "free",
      baseAssetId: "",
      floorPlanAssetId: "",
      previewReady: false,
      previewing: false,
      interactionMode: "position",
      cameraView: "free",
      cameraMode: "orthographic",
      floorSelection: "",
      cameraTopRotation: 0,
      cameraFocalLength: 50,
      generated: false,
      lightLayers: [],
    },
    style: {
      scale: 1,
      visible: true,
    },
  },
  "vacuum-map": {
    properties: {
      opacity: 0.5,
    },
    style: {
      scale: 1.049,
      visible: true,
    },
    dimensions: {
      width: 1555.68,
      height: 1605.684,
    },
  },
  "icon-button-effect": {
    properties: {
      icon: "mdi:lightbulb-outline",
      iconOffColor: "#4f4f4f",
      iconOnColor: "#ffffff",
      iconSize: 79,
      buttonOffColor: "#bababa",
      buttonOnColor: "#feae01",
      buttonOpacity: 0.8,
      frameColor: "#dcebf2",
      frameWidth: 0,
      frameOpacity: 0,
      radius: 50,
      glowColor: "#ffa200",
      glowOffStrength: 0,
      glowOnStrength: 3,
      effectAssetId: "",
      effectOpacity: 1,
      effectFadeDuration: 0.3,
      effectBlendMode: "normal",
      effectLayoutMode: "fill",
      effectLeft: 50,
      effectTop: 50,
      effectScale: 1,
      effectRotation: 0,
    },
    style: {
      scale: 0.19458752228421689,
      visible: true,
    },
    dimensions: {
      width: 208.35,
      height: 208.35,
    },
  },
  "title-button": {
    properties: {
      mainText: "房间",
      secondaryText: "ROOM\nLIGHTING",
      mainTextVisible: true,
      secondaryTextVisible: true,
      mainColor: "#b9bbc0",
      secondaryColor: "#70737b",
      mainSize: 45,
      secondarySize: 19,
      mainWeight: 0.3,
      secondaryWeight: 0,
      mainSpacing: 5.7,
      secondarySpacing: 1.9,
      secondaryLineGap: 6,
      mainTextTop: 43.3,
      secondaryTextTop: 42.2,
      iconVisible: false,
      icon: "mdi:home-account",
      iconSize: 55,
      iconLeft: 10.7,
      iconTop: 42.5,
      frameColor: "#60636a",
      frameWidth: 0.8,
      frameSize: 119,
      frameOffsetY: -6.1,
      markerVisible: true,
      markerColor: "#f2a20d",
      markerSize: 16,
      markerTop: 110,
      opacity: 1,
    },
    style: {
      scale: 0.9213987523473026,
      visible: true,
    },
    dimensions: {
      width: 500.04,
      height: 121.94,
    },
  },
  "icon-button": {
    properties: {
      mainText: "灯光",
      secondaryText: "LIGHTING",
      icon: "mdi:light-recessed",
      backgroundOffColor: "#24262c",
      backgroundOffOpacity: 0.82,
      backgroundOnColor: "#dfb64f",
      backgroundOnOpacity: 1,
      iconLeft: 46.7,
      iconTop: 31.3,
      iconOffColor: "#ffffff",
      iconOffOpacity: 0.5,
      iconOnColor: "#ffffff",
      iconOnOpacity: 0.9,
      iconSize: 72,
      mainOffColor: "#ffffff",
      mainOffOpacity: 0.5,
      mainOnColor: "#ffffff",
      mainOnOpacity: 0.9,
      mainSize: 20,
      mainSpacing: 0.1,
      mainTextLeft: 6,
      mainTextTop: 74.6,
      mainWeight: 0.68,
      secondaryOffColor: "#ffffff",
      secondaryOffOpacity: 0.5,
      secondaryOnColor: "#ffffff",
      secondaryOnOpacity: 0.9,
      secondarySize: 8,
      secondarySpacing: 1.5,
      secondaryTextLeft: 6,
      secondaryTextTop: 90.8,
      secondaryWeight: 0.67,
      onFillVisible: true,
      onFillColor: "#e4ad2c",
      onFillStrength: 1,
      onFillFadeDuration: 0.1,
      frameVisible: true,
      frameColor: "#81838a",
      frameWidth: 1.3,
      frameAngle: 71,
      frameOffOpacity: 0.6,
      frameOpacity: 0.8,
      cutCorner: 25,
      softLightVisible: true,
      softLightStrength: 2,
      softLightSize: 2,
      softLightAngle: 45,
      glowVisible: true,
      glowStrength: 1,
      glowSize: 1,
      glowAngle: 249,
      opacity: 1,
    },
    style: {
      scale: 0.779857559628849,
      visible: true,
    },
    dimensions: {
      width: 277.8,
      height: 300.16,
    },
  },
  "device-button": {
    properties: {
      mainText: "设备",
      secondaryText: "",
      icon: "",
      iconColor: "#d7d8da",
      iconOnColor: "#2372bf",
      iconOffOpacity: 0.72,
      iconOnOpacity: 1,
      iconLeft: 12.8,
      iconTop: 50,
      iconSize: 55,
      symbolSize: 35,
      badgeSize: 51,
      badgeOpacity: 0.36,
      mainColor: "#b0b0b0",
      mainOffOpacity: 0.82,
      mainOnOpacity: 1,
      mainSize: 21,
      mainWeight: 0.24,
      mainSpacing: 0.5,
      mainTextLeft: 39,
      mainTextTop: 40,
      secondaryColor: "#706f6f",
      secondaryOffOpacity: 0.64,
      secondaryOnOpacity: 0.82,
      secondarySize: 15,
      secondaryWeight: 0.12,
      secondarySpacing: 0.3,
      secondaryTextLeft: 39,
      secondaryTextTop: 66.2,
      onFillVisible: false,
      onFillColor: "#248eb2",
      onFillStrength: 0.16,
      frameVisible: true,
      frameWidth: 1,
      frameAngle: 45,
      frameOffOpacity: 0.35,
      frameOnOpacity: 0.8,
      cutCorner: 12,
      softLightVisible: true,
      softLightColor: "#ffffff",
      softLightStrength: 0.45,
      softLightSize: 1,
      softLightAngle: 45,
      glowVisible: false,
      glowColor: "#248eb2",
      glowStrength: 0.5,
      glowSize: 1,
      glowAngle: 220,
    },
    style: {
      scale: 0.7774703949015426,
      visible: true,
    },
    dimensions: {
      width: 277.8,
      height: 206.36,
    },
  },
  "presence-sensor": {
    properties: {
      sensorKind: "presence",
      mainText: "人在",
      secondaryText: "",
      occupiedColor: "#ffffff",
      waterLeakColor: "#42c8ff",
      smokeColor: "#ffffff",
      naturalGasColor: "#ffb347",
      clearColor: "#758189",
      animationStrength: 0.72,
      haloScale: 1,
      haloVisible: true,
      haloScaleX: 1,
      haloScaleY: 1,
      haloRotation: 0,
      haloOpacity: 1,
      personScale: 1,
      personVisible: true,
      personRotation: 0,
      personOpacity: 1,
      orbitDuration: 8,
      showDuration: true,
      historyHours: 24,
    },
    style: {
      scale: 1,
      visible: true,
    },
    dimensions: {
      width: 360,
      height: 240,
    },
  },
  camera: {
    properties: {
      fit: "fill",
      displayMode: "live",
      mediaVisible: true,
      frameVisible: true,
      opacity: 1,
      radius: 11,
      refreshInterval: 10,
    },
    style: {
      scale: 0.8252317102372743,
      visible: true,
    },
    dimensions: {
      width: 611.16,
      height: 343.7775,
    },
  },
  "air-conditioner": {
    properties: {
      deviceType: "auto",
      mainText: "空调",
      secondaryText: "",
      icon: "mdi:air-conditioner",
      iconOffColor: "#c2c2c2",
      iconOnColor: "#4581d2",
      badgeColor: "#c3c3c7",
      badgeOpacity: 0.3,
      symbolSize: 30,
      badgeSize: 39,
      iconLeft: 21.5,
      iconTop: 50,
      mainColor: "#c7c8cb",
      secondaryColor: "#969696",
      mainSize: 21,
      secondarySize: 12,
      mainWeight: 0.6,
      secondaryWeight: 0.12,
      mainSpacing: 6,
      secondarySpacing: 0.3,
      mainTextLeft: 39,
      mainTextTop: 40,
      secondaryTextLeft: 39,
      secondaryTextTop: 63.7,
      airflowVisible: true,
      airflowMotion: "dynamic",
      airflowColor: "#ffffff",
      airflowCoolColor: "#5baeed",
      airflowHeatColor: "#f67713",
      airflowAngle: 0,
      airflowCurve: 0,
      airflowLength: 200,
      airflowFadePosition: 50,
      airflowSpread: 100,
      airflowDensity: 60,
      airflowIrregularity: 50,
      airflowThickness: 40,
      airflowStrength: 219,
      airflowBlur: 6,
      airflowSpeed: 1,
      airflowHeight: 300,
      airflowScale: 0.4817745640382381,
    },
    style: {
      scale: 1.0190713138587422,
      visible: true,
    },
    dimensions: {
      width: 305.58,
      height: 150.08,
    },
  },
  time: {
    properties: {
      hour12: false,
      showSeconds: true,
      color: "#248eb2",
      fontSize: 89,
      fontWeight: 1,
      letterSpacing: 4.7,
      opacity: 1,
    },
    style: {
      scale: 0.576,
      visible: true,
    },
    dimensions: {
      width: 496.6612,
      height: 105.02,
    },
  },
  date: {
    properties: {
      showWeekday: true,
      showLunar: true,
      primaryColor: "#8d9296",
      primarySize: 36,
      primaryWeight: 0.5,
      primarySpacing: 1,
      lunarColor: "#7f878c",
      lunarSize: 24,
      lunarWeight: 0.5,
      lunarSpacing: 0.2,
      lineGap: 11,
      opacity: 1,
    },
    style: {
      scale: 0.642,
      visible: true,
    },
    dimensions: {
      width: 353.92,
      height: 81.08,
    },
  },
  weather: {
    properties: {
      iconVisible: true,
      temperatureVisible: true,
      conditionVisible: true,
      humidityVisible: true,
      iconSize: 109,
      iconGap: 0,
      temperatureColor: "#aeb3b7",
      temperatureSize: 32,
      temperatureWeight: 0.5,
      temperatureSpacing: 2.8,
      secondaryColor: "#8d9296",
      secondarySize: 18,
      secondaryWeight: 0.5,
      secondarySpacing: 1,
      lineGap: 7,
      opacity: 1,
    },
    style: {
      scale: 0.8056171554518585,
      visible: true,
    },
    dimensions: {
      width: 263.8,
      height: 109,
    },
  },
  "line-chart": {
    properties: {
      valueVisible: true,
      valueScale: 66,
      valueColor: "#94a5b3",
      valueOffsetX: -0.4,
      valueOffsetY: 1,
      updateInterval: 600,
      hours: 12,
      cornerRadius: 14,
    },
    style: {
      scale: 1,
      visible: true,
    },
    dimensions: {
      width: 525.042,
      height: 300.16,
    },
  },
  "panel-frame": {
    properties: {
      mainText: "温度",
      secondaryText: "TEMPERATURE",
      mainTextVisible: true,
      mainColor: "#ffffff",
      mainSize: 30,
      mainWeight: 0,
      mainSpacing: 2,
      secondaryTextVisible: true,
      secondaryColor: "#ffffff",
      secondarySize: 15,
      secondaryWeight: 0,
      secondarySpacing: 2.1,
      edgeVisible: true,
      edgeAngle: 45,
      glowVisible: true,
      glowColor: "#ffffff",
      glowAngle: 242,
    },
    style: {
      scale: 1,
      visible: true,
    },
    dimensions: {
      width: 527.82,
      height: 300.16,
    },
  },
  "navigation-button": {
    properties: {
      targetPage: "",
      mainText: "页面导航",
      secondaryText: "NAVIGATION",
      icon: "mdi:home-outline",
      mainTextVisible: true,
      secondaryTextVisible: true,
      iconVisible: true,
      frameVisible: true,
      glowVisible: true,
      mainColor: "#ffffff",
      secondaryColor: "#e9edf0",
      mainSize: 30,
      secondarySize: 10,
      mainWeight: 0.5,
      secondaryWeight: 0,
      secondarySpacing: 3,
      lineGap: 20,
      textIdleOpacity: 0.4,
      textActiveOpacity: 0.9,
      textAlign: "left",
      textLeft: 29.9,
      textTop: 81.8,
      iconColor: "#fcfcfc",
      iconSize: 50,
      iconLeft: 16.5,
      iconIdleOpacity: 0.3,
      iconActiveOpacity: 0.9,
      frameColor: "#ffffff",
      glowColor: "#f2f6fa",
      frameWidth: 1.5,
      frameIdleOpacity: 0.3,
      frameActiveOpacity: 1,
      frameAngle: 45,
      glowAngle: 90,
      glowIdleStrength: 1,
      glowActiveStrength: 2.4,
      glowIdleSize: 1.5,
      glowActiveSize: 2.2,
      textGlowVisible: false,
      textGlowIdleStrength: 1.5,
      textGlowActiveStrength: 1.5,
      textGlowIdleSize: 3,
      radius: 0.5,
      idleOpacity: 0.3,
      activeOpacity: 0.96,
    },
    style: {
      scale: 0.8533204506895217,
      visible: true,
    },
    dimensions: {
      width: 555.6,
      height: 153.832,
    },
  },
};
const KNOWN_PROPERTY_NAME_PATTERN =
  /(?:text|label|name|title|icon|assetid|targetpage|layoutmode|freelayout|naturalwidth|naturalheight|fit|refreshinterval|exportfolder|previewready|previewing|interactionmode|generated|lightlayers|exportresolution|exportcamera|floorselection)$/i;
export function registerUiPackDefinition(definition) {
  if (!definition?.id || !definition?.version) {
    throw new Error("UI 方案必须包含 id 和 version。");
  }
  uiPackRegistry.set(
    definition.id,
    Object.freeze({
      ...definition,
    }),
  );
}
export function hasUiPackDefinition(uiPackId) {
  return uiPackRegistry.has(uiPackId);
}
registerUiPackDefinition({
  id: "ui.base",
  version: "1.0.0",
  popupTemplate: "dwell-light",
  theme: {
    name: "dashboard-v1-dark",
    variables: {},
  },
  componentDefaults: componentDefaults,
});
registerComponentTemplate(interaction3dTemplate);
export function registerComponentTemplate(template) {
  if (!template?.id || typeof template.create != "function") {
    throw new Error("控件模板必须包含 id 和 create。");
  }
  const uiPackId = template.uiPackId || "ui.base";
  templateRegistry.set(
    uiPackId + ":" + template.id,
    Object.freeze({
      ...template,
      uiPackId: uiPackId,
    }),
  );
}
export function listComponentTemplates(scope, uiPackId = "ui.base") {
  const typeOrder = COMPONENT_TYPE_GROUPS[scope] || [];
  return [...templateRegistry.values()]
    .filter(
      (template) =>
        template.uiPackId === uiPackId && template.scopes?.includes(scope),
    )
    .sort((a, b) => {
      const orderA = typeOrder.indexOf(a.id);
      const orderB = typeOrder.indexOf(b.id);
      return (
        (orderA < 0 ? Number.MAX_SAFE_INTEGER : orderA) -
        (orderB < 0 ? Number.MAX_SAFE_INTEGER : orderB)
      );
    });
}
export function createComponentFromTemplate(templateId, options) {
  const uiPackId = options?.uiPackId || "ui.base";
  const template = templateRegistry.get(uiPackId + ":" + templateId);
  if (!template) {
    throw new Error("控件模板不存在。");
  }
  const component = {
    ...template.create(options),
    templateRef: {
      uiPackId: uiPackId,
      templateId: templateId,
      version: 1,
    },
  };
  const typeDefaults =
    uiPackRegistry.get(uiPackId)?.componentDefaults?.[component.type];
  if (!typeDefaults) {
    return component;
  }
  const defaultProperties = structuredClone(typeDefaults.properties || {});
  const defaultStyle = structuredClone(typeDefaults.style || {});
  const dimensions = typeDefaults.dimensions;
  const position = {
    ...component.position,
  };
  if (dimensions) {
    const canvasWidth = Number(options?.canvas?.width || 2778);
    const canvasHeight = Number(options?.canvas?.height || 1940);
    position.width = dimensions.width;
    position.height = dimensions.height;
    position.x = (canvasWidth - dimensions.width) / 2;
    position.y = (canvasHeight - dimensions.height) / 2;
  }
  return {
    ...component,
    position: position,
    properties: {
      ...component.properties,
      ...defaultProperties,
      instanceName: component.properties.instanceName,
    },
    style: {
      ...component.style,
      ...defaultStyle,
    },
  };
}
function pickKnownProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) =>
      KNOWN_PROPERTY_NAME_PATTERN.test(key),
    ),
  );
}
function applyUiPackToComponent(component, uiPack, canvas) {
  const templateId = component.templateRef?.templateId || component.type;
  let created = null;
  try {
    created = createComponentFromTemplate(templateId, {
      id: component.id,
      instanceName: component.properties?.instanceName,
      canvas: canvas,
      targetPage: component.properties?.targetPage,
      uiPackId: uiPack.id,
    });
  } catch (error) {
    if (templateRegistry.has("ui.base:" + templateId)) {
      throw error;
    }
  }
  const next = created
    ? {
        ...component,
        properties: {
          ...(created.properties || {}),
          ...pickKnownProperties(component.properties),
        },
        style: {
          ...(created.style || {}),
          ...(Object.prototype.hasOwnProperty.call(
            component.style || {},
            "scale",
          )
            ? {
                scale: component.style.scale,
              }
            : {}),
          ...(Object.prototype.hasOwnProperty.call(
            component.style || {},
            "visible",
          )
            ? {
                visible: component.style.visible,
              }
            : {}),
        },
        position: component.position,
        bindings: component.bindings || {},
        actions: component.actions || {},
      }
    : {
        ...component,
      };
  next.templateRef = {
    uiPackId: uiPack.id,
    templateId: templateId,
    version: Number(uiPack.templateVersion || 1),
  };
  next.children = (component.children || []).map((child) =>
    applyUiPackToComponent(child, uiPack, canvas),
  );
  return next;
}
export function applyUiPackToDocument(document, uiPack) {
  const definition = uiPackRegistry.get(uiPack.id);
  if (!definition) {
    throw new Error(
      "UI 方案“" + (uiPack.name || uiPack.id) + "”运行时未正确加载。",
    );
  }
  const canvas = document.canvas || {};
  document.sharedComponents = (document.sharedComponents || []).map(
    (component) => applyUiPackToComponent(component, uiPack, canvas),
  );
  document.pages = (document.pages || []).map((page) => ({
    ...page,
    components: (page.components || []).map((component) =>
      applyUiPackToComponent(component, uiPack, canvas),
    ),
  }));
  document.customPopups = (document.customPopups || []).map((popup) => ({
    ...popup,
    templateRef: {
      uiPackId: uiPack.id,
      templateId:
        uiPack.popupTemplate || definition.popupTemplate || "custom-popup",
      version: Number(uiPack.templateVersion || 1),
    },
  }));
  document.theme = structuredClone(
    uiPack.theme || definition.theme || document.theme || {},
  );
  document.uiPack = {
    id: uiPack.id,
    version: uiPack.version,
  };
  return document;
}
export function timeComponentDimensions(properties = {}) {
  const fontSize = Math.max(
    12,
    Math.min(500, Number(properties.fontSize || 96)),
  );
  const letterSpacing = Math.max(
    -20,
    Math.min(100, Number(properties.letterSpacing || 0)),
  );
  const showSeconds = properties.showSeconds === true;
  const digitSlots =
    properties.hour12 === true ? (showSeconds ? 11 : 8) : showSeconds ? 8 : 5;
  const fontWeight = Number(properties.fontWeight ?? 0.4);
  const weightFactor =
    (fontWeight > 1 ? (fontWeight - 1) / 899 : fontWeight) >= 0.67 ? 1.035 : 1;
  return {
    width: Math.max(
      fontSize,
      fontSize * 0.61 * digitSlots * weightFactor +
        letterSpacing * Math.max(0, digitSlots - 1) +
        fontSize * 0.16,
    ),
    height: Math.max(20, fontSize * 1.18),
  };
}
export function dateComponentDimensions(properties = {}) {
  const primarySize = Math.max(
    12,
    Math.min(500, Number(properties.primarySize || 36)),
  );
  const lunarSize = Math.max(
    10,
    Math.min(500, Number(properties.lunarSize || 24)),
  );
  const primarySpacing = Math.max(
    -20,
    Math.min(100, Number(properties.primarySpacing || 1)),
  );
  const lunarSpacing = Math.max(
    -20,
    Math.min(100, Number(properties.lunarSpacing || 1)),
  );
  const lineGap = Math.max(0, Math.min(200, Number(properties.lineGap ?? 8)));
  const weekdayCharFactor = properties.showWeekday === false ? 6.35 : 9.35;
  const lunarCharCount = 6;
  const primaryWidth = primarySize * weekdayCharFactor + primarySpacing * 13;
  const lunarWidth = lunarSize * lunarCharCount + lunarSpacing * 5;
  const showLunar = properties.showLunar === true;
  return {
    width:
      Math.max(primarySize, primaryWidth, showLunar ? lunarWidth : 0) +
      primarySize * 0.12,
    height:
      primarySize * 1.16 + (showLunar ? lunarSize * 1.18 + lineGap : 0),
  };
}
export function weatherComponentDimensions(properties = {}) {
  const iconSize = Math.max(
    12,
    Math.min(500, Number(properties.iconSize || 64)),
  );
  const temperatureSize = Math.max(
    12,
    Math.min(500, Number(properties.temperatureSize || 32)),
  );
  const secondarySize = Math.max(
    10,
    Math.min(500, Number(properties.secondarySize || 18)),
  );
  const iconGap = Math.max(0, Math.min(300, Number(properties.iconGap ?? 22)));
  const lineGap = Math.max(0, Math.min(200, Number(properties.lineGap ?? 7)));
  const hasText =
    properties.temperatureVisible !== false ||
    properties.conditionVisible !== false ||
    properties.humidityVisible !== false;
  const temperatureWidth =
    properties.temperatureVisible === false ? 0 : temperatureSize * 4.4;
  const secondaryWidth =
    properties.conditionVisible === false &&
    properties.humidityVisible === false
      ? 0
      : secondarySize * 8.6;
  const textWidth = hasText
    ? Math.max(temperatureWidth, secondaryWidth, secondarySize * 3)
    : 0;
  const textHeight =
    (properties.temperatureVisible === false ? 0 : temperatureSize * 1.12) +
    (properties.conditionVisible === false &&
    properties.humidityVisible === false
      ? 0
      : secondarySize * 1.14 + lineGap);
  return {
    width: Math.max(
      20,
      (properties.iconVisible === false
        ? 0
        : iconSize + (hasText ? iconGap : 0)) + textWidth,
    ),
    height: Math.max(
      20,
      properties.iconVisible === false ? 0 : iconSize,
      textHeight,
    ),
  };
}
registerComponentTemplate({
  id: "image",
  name: "图片",
  type: "image",
  description: "显示图片素材，可关联实体并设置点按动作。",
  scopes: ["page"],
  create({ id: id, instanceName = "图片", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = 320;
    const height = 240;
    return {
      id: id,
      type: "image",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        opacity: 1,
        layoutMode: "free",
        fit: "contain",
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "floorplan-auto-diagram",
  name: "户型图自动导图",
  type: "floorplan-auto-diagram",
  description: "把 3D 户型底图和灯组效果层合并为一个可交互的导图控件。",
  scopes: ["page"],
  create({ id: id, instanceName: label = "户型图自动导图", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.56;
    const height = canvasHeight * 0.56;
    return {
      id: id,
      type: "floorplan-auto-diagram",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: label,
        label: label,
        exportFolder: "",
        layoutMode: "free",
        baseAssetId: "",
        floorPlanAssetId: "",
        previewReady: false,
        previewing: false,
        interactionMode: "position",
        cameraView: "free",
        cameraMode: "orthographic",
        floorSelection: "",
        cameraTopRotation: 0,
        cameraFocalLength: 50,
        generated: false,
        lightLayers: [],
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "vacuum-map",
  name: "扫地机器人实时地图",
  type: "vacuum-map",
  description: "将扫地机器人实时地图作为透明图层叠加到底图上。",
  scopes: ["page"],
  create({
    id: id,
    instanceName = "扫地机器人实时地图",
    canvas,
    vacuumMapEntityId = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.56;
    const height = (width * 1156) / 1120;
    return {
      id: id,
      type: "vacuum-map",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: vacuumMapEntityId
        ? {
            entity: {
              entityId: vacuumMapEntityId,
            },
          }
        : {},
      properties: {
        instanceName: instanceName,
        opacity: 0.5,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "icon-button-effect",
  name: "图标按钮（效果）",
  type: "icon-button-effect",
  description: "同时包含可交互的图标按钮和跟随实体状态显隐的效果图片。",
  scopes: ["page"],
  create({
    id: id,
    instanceName = "图标按钮（效果）",
    canvas,
    lightEntityId = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.075;
    const height = width;
    return {
      id: id,
      type: "icon-button-effect",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: lightEntityId
        ? {
            entity: {
              entityId: lightEntityId,
            },
          }
        : {},
      properties: {
        instanceName: instanceName,
        buttonVisible: true,
        effectVisible: true,
        icon: "mdi:lightbulb-outline",
        iconOffColor: "#9aa5ad",
        iconOnColor: "#ffffff",
        iconSize: 44,
        buttonOffColor: "#17242d",
        buttonOnColor: "#1f91b8",
        buttonOpacity: 0.92,
        frameColor: "#dcebf2",
        frameWidth: 1.5,
        frameOpacity: 0.72,
        radius: 50,
        glowColor: "#43c8f0",
        glowOffStrength: 0,
        glowOnStrength: 1,
        effectAssetId: "",
        effectOpacity: 1,
        effectFadeDuration: 0.52,
        effectColorTemperatureRealtime: true,
        effectBrightnessRealtime: true,
        effectLayoutMode: "free",
        effectLeft: 50,
        effectTop: 50,
        effectScale: 1,
        effectRotation: 0,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: lightEntityId
        ? {
            tap: {
              type: "toggle",
            },
          }
        : {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "title-button",
  name: "标题按钮",
  type: "title-button",
  description: "中英文双标题、左右括号和下方三角指示的房间标题按钮。",
  scopes: ["page"],
  create({ id: id, instanceName = "标题按钮", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.18;
    const height = canvasHeight * 0.065;
    return {
      id: id,
      type: "title-button",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        mainTextVisible: true,
        secondaryTextVisible: true,
        mainText: "客厅",
        secondaryText: "LIVING ROOM\nLIGHTING",
        mainColor: "#b9bbc0",
        secondaryColor: "#70737b",
        mainSize: 45,
        secondarySize: 19,
        mainWeight: 0.3,
        secondaryWeight: 0,
        mainSpacing: 5.7,
        secondarySpacing: 1.9,
        secondaryLineGap: 6,
        mainTextLeft: 18.2,
        mainTextTop: 43.3,
        secondaryTextLeft: 42.9,
        secondaryTextTop: 42.2,
        iconVisible: true,
        icon: "mdi:home-account",
        iconColor: "#b9bbc0",
        iconSize: 55,
        iconLeft: 10.7,
        iconTop: 42.5,
        frameColor: "#60636a",
        frameVisible: true,
        frameWidth: 0.8,
        frameSize: 120,
        frameSpacing: 84,
        frameOffsetX: -7.2,
        frameOffsetY: -6.1,
        markerVisible: true,
        markerColor: "#f2a20d",
        markerSize: 16,
        markerLeft: 1.8,
        markerTop: 110,
      },
      style: {
        scale: 1.2932807744280563,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "light-statistics",
  name: "数量统计",
  type: "light-statistics",
  description: "统计灯光、开关、空调等设备当前开启或运行的数量。",
  thumbnailId: "light-statistics",
  scopes: ["page"],
  create({ id: id, instanceName = "数量统计", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.18;
    const height = canvasHeight * 0.065;
    return {
      id: id,
      type: "light-statistics",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        entityIds: [],
        entityLabels: {},
        title: "数量",
        iconVisible: true,
        icon: "mdi:lightbulb-group-outline",
        iconColor: "#8b9298",
        iconActiveColor: "#f2a20d",
        iconGap: 4.5,
        titleVisible: true,
        titleColor: "#b9bbc0",
        titleSize: 32,
        titleWeight: 0.3,
        titleSpacing: 1.2,
        countVisible: true,
        countColor: "#b9bbc0",
        countActiveColor: "#f2a20d",
        countSize: 34,
        countWeight: 0.35,
        countSpacing: 0,
        countGap: 4.5,
        iconSize: 42,
      },
      style: {
        scale: 1.2932807744280563,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "icon-button",
  name: "图标按钮",
  type: "icon-button",
  description: "跟随灯光实体状态变化的切角图标按钮。",
  scopes: ["page"],
  create({
    id: id,
    instanceName = "图标按钮",
    canvas,
    lightEntityId = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.1;
    const height = canvasHeight * 0.15;
    return {
      id: id,
      type: "icon-button",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: lightEntityId
        ? {
            entity: {
              entityId: lightEntityId,
            },
          }
        : {},
      properties: {
        instanceName: instanceName,
        mainText: "主灯",
        secondaryText: "MAIN LIGHT",
        icon: "mdi:ceiling-light",
        iconColor: "#d7d8da",
        mainColor: "#c7c8cb",
        secondaryColor: "#75777d",
        iconOffOpacity: 1,
        iconOnOpacity: 1,
        iconLeft: 50,
        iconTop: 34,
        mainOffOpacity: 1,
        mainOnOpacity: 1,
        secondaryOffOpacity: 1,
        secondaryOnOpacity: 1,
        onFillVisible: true,
        onFillColor: "#dfb64f",
        onFillStrength: 1,
        onFillFadeDuration: 0.3,
        frameVisible: true,
        frameWidth: 1,
        frameAngle: 45,
        frameOffOpacity: 0.8,
        frameOnOpacity: 1,
        cutCorner: 20,
        softLightVisible: true,
        softLightColor: "#ffffff",
        softLightStrength: 1,
        softLightSize: 1,
        softLightAngle: 45,
        glowVisible: true,
        glowColor: "#ffffff",
        glowStrength: 1,
        glowSize: 1,
        glowAngle: 220,
        iconSize: 42,
        mainSize: 25,
        secondarySize: 10,
        mainWeight: 0.25,
        secondaryWeight: 0.18,
        mainSpacing: 1,
        secondarySpacing: 0.7,
        mainTextLeft: 9,
        mainTextTop: 78,
        secondaryTextLeft: 9,
        secondaryTextTop: 91,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: lightEntityId
        ? {
            tap: {
              type: "toggle",
            },
          }
        : {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "device-button",
  name: "设备按钮",
  type: "device-button",
  description: "显示图标、标题和实时状态，点击可切换实体。",
  scopes: ["page"],
  create({ id: id, instanceName = "设备按钮", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.1;
    const height = canvasHeight * 0.11;
    return {
      id: id,
      type: "device-button",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        mainText: "",
        secondaryText: "",
        icon: "",
        iconVisible: true,
        mainTextVisible: true,
        secondaryTextVisible: true,
        iconColor: "#d7d8da",
        iconOnColor: "#379bff",
        badgeColor: "#5b5e66",
        badgeOpacity: 0.58,
        mainColor: "#c7c8cb",
        secondaryColor: "#75777d",
        iconLeft: 20,
        iconTop: 50,
        symbolSize: 14,
        badgeSize: 28,
        mainSize: 21,
        secondarySize: 12,
        mainWeight: 0.24,
        secondaryWeight: 0.12,
        mainSpacing: 0.5,
        secondarySpacing: 0.3,
        mainTextLeft: 39,
        mainTextTop: 40,
        secondaryTextLeft: 39,
        secondaryTextTop: 67,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "presence-sensor",
  name: "传感器",
  type: "presence-sensor",
  description:
    "添加后在属性中选择传感器类型，当前支持人在、门窗和水浸状态的动态显示。",
  scopes: ["page"],
  create({ id: id, instanceName = "传感器", canvas, entityId = "" }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = 360;
    const height = 240;
    return {
      id: id,
      type: "presence-sensor",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: entityId
        ? {
            entity: {
              entityId: entityId,
            },
          }
        : {},
      properties: {
        instanceName: instanceName,
        sensorKind: "presence",
        mainText: "人在",
        secondaryText: "",
        occupiedColor: "#ffffff",
        waterLeakColor: "#42c8ff",
        smokeColor: "#ffffff",
        naturalGasColor: "#ffb347",
        clearColor: "#758189",
        animationStrength: 0.72,
        haloScale: 1,
        haloVisible: true,
        haloScaleX: 1,
        haloScaleY: 1,
        haloRotation: 0,
        haloOpacity: 1,
        personScale: 1,
        personVisible: true,
        personRotation: 0,
        personOpacity: 1,
        orbitDuration: 8,
        showDuration: true,
        historyHours: 24,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "camera",
  name: "摄像头实时预览",
  type: "camera",
  description: "实时预览摄像头，点击可放大查看。",
  scopes: ["page"],
  create({ id: id, instanceName = "摄像头实时预览", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.22;
    const height = (width * 9) / 16;
    return {
      id: id,
      type: "camera",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        fit: "fill",
        displayMode: "live",
        refreshInterval: 10,
        mediaVisible: true,
        frameVisible: true,
        frameColor: "#d4d4d4",
        frameWidth: 1,
        frameAngle: 45,
        frameOpacity: 0.9,
        radius: 0.04,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {
        tap: {
          type: "more-info",
          data: {
            popupSource: "current",
          },
        },
      },
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "air-conditioner",
  name: "空调 / 浴霸",
  type: "air-conditioner",
  description:
    "显示空调或浴霸状态并按实体能力提供控制，内置可调整的动态出风效果。",
  scopes: ["page"],
  create({ id: id, instanceName = "空调", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.11;
    const height = canvasHeight * 0.08;
    return {
      id: id,
      type: "air-conditioner",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        deviceType: "auto",
        instanceName: instanceName,
        mainText: "",
        secondaryText: "",
        icon: "mdi:air-conditioner",
        iconOffColor: "#9aa5ad",
        iconOnColor: "#73c8ff",
        badgeColor: "#5b5e66",
        badgeOpacity: 0.58,
        symbolSize: 14,
        badgeSize: 28,
        iconLeft: 20,
        iconTop: 50,
        mainColor: "#c7c8cb",
        secondaryColor: "#75777d",
        mainSize: 21,
        secondarySize: 12,
        mainWeight: 0.24,
        secondaryWeight: 0.12,
        mainSpacing: 0.5,
        secondarySpacing: 0.3,
        mainTextLeft: 39,
        mainTextTop: 40,
        secondaryTextLeft: 39,
        secondaryTextTop: 67,
        airflowVisible: true,
        airflowMotion: "dynamic",
        airflowCoolColor: "#73c8ff",
        airflowHeatColor: "#ff8a65",
        airflowOtherColor: "#dce2e6",
        airflowAngle: 7,
        airflowCurve: 20,
        airflowLength: 200,
        airflowFadePosition: 50,
        airflowSpread: 100,
        airflowDensity: 60,
        airflowIrregularity: 50,
        airflowThickness: 40,
        airflowStrength: 200,
        airflowBlur: 6,
        airflowSpeed: 1,
        airflowOffsetX: -75,
        airflowOffsetY: 34,
        airflowWidth: 64,
        airflowHeight: 125,
        airflowScale: 1,
        airflowRotation: -3,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {
        tap: {
          type: "more-info",
        },
        doubleTap: {
          type: "toggle",
        },
      },
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "time",
  name: "时间",
  type: "time",
  description: "显示设备本地时间，不依赖 Home Assistant 实体。",
  scopes: ["shared"],
  create({ id: id, instanceName = "时间", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const properties = {
      instanceName: instanceName,
      hour12: false,
      showSeconds: false,
      color: "#248eb2",
      fontSize: 96,
      fontWeight: 0.4,
      letterSpacing: 2.2,
      opacity: 1,
    };
    const { width: width, height: height } =
      timeComponentDimensions(properties);
    return {
      id: id,
      type: "time",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: properties,
      style: {
        scale: 1.8,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "date",
  name: "日期",
  type: "date",
  description: "显示设备本地年月日、星期与农历。",
  scopes: ["shared"],
  create({ id: id, instanceName = "日期", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const properties = {
      instanceName: instanceName,
      showWeekday: true,
      showLunar: false,
      primaryColor: "#8d9296",
      primarySize: 36,
      primaryWeight: 0.4,
      primarySpacing: 1,
      lunarColor: "#7f878c",
      lunarSize: 24,
      lunarWeight: 0.4,
      lunarSpacing: 1,
      lineGap: 8,
      opacity: 1,
    };
    const { width: width, height: height } =
      dateComponentDimensions(properties);
    return {
      id: id,
      type: "date",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: properties,
      style: {
        scale: 2,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "weather",
  name: "天气",
  type: "weather",
  description: "显示彩云天气当前状态、温度和湿度。",
  scopes: ["shared"],
  create({
    id: id,
    instanceName = "天气",
    canvas,
    weatherEntityId = "",
    sunEntityId = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const properties = {
      instanceName: instanceName,
      iconVisible: true,
      temperatureVisible: true,
      conditionVisible: true,
      humidityVisible: true,
      iconSize: 64,
      iconGap: 22,
      temperatureColor: "#aeb3b7",
      temperatureSize: 32,
      temperatureWeight: 0.4,
      temperatureSpacing: 1,
      secondaryColor: "#8d9296",
      secondarySize: 18,
      secondaryWeight: 0.4,
      secondarySpacing: 1,
      lineGap: 7,
      opacity: 1,
    };
    const { width: width, height: height } =
      weatherComponentDimensions(properties);
    const bindings = {};
    if (weatherEntityId) {
      bindings.entity = {
        entityId: weatherEntityId,
      };
    }
    if (sunEntityId) {
      bindings.sun = {
        entityId: sunEntityId,
      };
    }
    return {
      id: id,
      type: "weather",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: bindings,
      properties: properties,
      style: {
        scale: 1.8,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "line-chart",
  name: "折线图",
  type: "line-chart",
  description: "显示温度或湿度实体的 24 小时趋势、当前值与极值。",
  scopes: ["shared", "page"],
  create({
    id: id,
    instanceName = "折线图",
    canvas,
    sensorEntityId = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.19;
    const height = canvasHeight * 0.16;
    return {
      id: id,
      type: "line-chart",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: sensorEntityId
        ? {
            entity: {
              entityId: sensorEntityId,
            },
          }
        : {},
      properties: {
        instanceName: instanceName,
        valueVisible: true,
        valueScale: 100,
        valueColor: "#dce1e5",
        valueOffsetX: 0,
        valueOffsetY: 0,
        updateInterval: 600,
        hours: 24,
        cornerRadius: 10,
        thresholdMode: "auto",
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {
        tap: {
          type: "more-info",
        },
      },
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "panel-frame",
  name: "底图框",
  type: "panel-frame",
  description: "双行标题、渐变外框和内向柔光容器。",
  scopes: ["shared", "page"],
  create({ id: id, instanceName = "底图框", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.19;
    const height = canvasHeight * 0.16;
    return {
      id: id,
      type: "panel-frame",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        mainTextVisible: true,
        mainText: "温度",
        mainColor: "#ffffff",
        mainSize: 30,
        mainWeight: 0,
        mainOpacity: 0.72,
        mainSpacing: 2,
        secondaryTextVisible: true,
        secondaryText: "TEMPERATURE",
        secondaryColor: "#ffffff",
        secondarySize: 15,
        secondaryWeight: 0,
        secondaryOpacity: 0.36,
        secondarySpacing: 2.1,
        mainTextLeft: 5.2,
        mainTextTop: 20,
        secondaryTextLeft: 5.2,
        secondaryTextTop: 28,
        edgeVisible: true,
        edgeColor: "#d4d4d4",
        edgeWidth: 0.9,
        edgeOpacity: 1,
        radius: 0.195,
        edgeAngle: 45,
        glowVisible: true,
        glowColor: "#ffffff",
        glowStrength: 0.5,
        glowSize: 1.5,
        glowAngle: 242,
      },
      style: {
        scale: 1,
        visible: true,
      },
      actions: {},
      children: [],
    };
  },
});
registerComponentTemplate({
  id: "navigation-button",
  name: "导航按钮",
  type: "navigation-button",
  description: "默认用于页面跳转，也可绑定实体执行切换或打开弹窗。",
  scopes: ["shared"],
  create({
    id: id,
    instanceName = "导航按钮",
    canvas,
    targetPage = "",
  }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.2;
    const height = canvasHeight * 0.085;
    const target = String(targetPage || "");
    return {
      id: id,
      type: "navigation-button",
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width: width,
        height: height,
        rotation: 0,
        zIndex: 1,
      },
      bindings: {},
      properties: {
        instanceName: instanceName,
        targetPage: target,
        mainText: "页面导航",
        secondaryText: "NAVIGATION",
        icon: "mdi:home-outline",
        mainTextVisible: true,
        secondaryTextVisible: true,
        iconVisible: true,
        frameVisible: true,
        glowVisible: true,
        mainColor: "#ffffff",
        secondaryColor: "#e9edf0",
        mainSize: 30,
        secondarySize: 10,
        mainWeight: 0.5,
        secondaryWeight: 0.4,
        mainSpacing: 4,
        secondarySpacing: 3,
        mainTextLeft: 29.9,
        mainTextTop: 53.832318210068365,
        secondaryTextLeft: 29.9,
        secondaryTextTop: 81.8,
        textIdleOpacity: 0.4,
        textActiveOpacity: 0.9,
        iconColor: "#fcfcfc",
        iconSize: 50,
        iconLeft: 16.5,
        iconTop: 50,
        iconIdleOpacity: 0.3,
        iconActiveOpacity: 0.9,
        frameColor: "#ffffff",
        glowColor: "#f2f6fa",
        frameWidth: 1.5,
        frameIdleOpacity: 0.3,
        frameActiveOpacity: 1,
        frameAngle: 45,
        glowAngle: 90,
        glowIdleStrength: 1,
        glowActiveStrength: 2.4,
        glowIdleSize: 1.5,
        glowActiveSize: 2.2,
        radius: 0.5,
      },
      style: {
        scale: 0.9232946236554526,
        visible: true,
      },
      actions: target
        ? {
            tap: {
              type: "navigate",
              target: target,
            },
          }
        : {},
      children: [],
    };
  },
});
