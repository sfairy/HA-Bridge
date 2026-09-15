export const INTERACTION3D_TYPE = "interaction3d",
  INTERACTION3D_FEATURE = "module.3d_interaction",
  INTERACTION3D_LIGHTING_MODES = [
    ["standard", "\u6807\u51C6\u5149\u5F71"],
    ["region", "\u8F7B\u91CF\u67D4\u5149"]
  ],
  normalizeInteraction3dLightingMode = lightingMode =>
    lightingMode === "region" ? "region" : "standard",
  BACKGROUND_THEMES = [
    ["grid", "\u7ECF\u5178\u7F51\u683C"],
    ["dots", "\u5FAE\u5149\u661F\u5C18"]
  ],
  normalizeBackgroundTheme = themeName =>
    themeName === "dots" || themeName === "contours" ? "dots" : "grid",
  interaction3dTemplate = {
    id: INTERACTION3D_TYPE,
    type: INTERACTION3D_TYPE,
    name: "3D \u4EA4\u4E92",
    description:
      "\u5728 3D \u6237\u578B\u4E2D\u67E5\u770B\u548C\u63A7\u5236\u706F\u5149\u3001\u8BBE\u5907\u3002",
    scopes: ["page"],
    create({ id: instanceId, instanceName: displayName = "3D \u4EA4\u4E92", canvas: canvasSize }) {
      const canvasWidth = Number(canvasSize?.width || 2778),
        canvasHeight = Number(canvasSize?.height || 1940),
        componentWidth = canvasWidth * 0.56,
        componentHeight = canvasHeight * 0.56;
      return {
        id: instanceId,
        type: INTERACTION3D_TYPE,
        componentVersion: 1,
        position: {
          x: (canvasWidth - componentWidth) / 2,
          y: (canvasHeight - componentHeight) / 2,
          width: componentWidth,
          height: componentHeight,
          rotation: 0,
          zIndex: 1
        },
        properties: {
          label: displayName,
          instanceName: displayName,
          layoutMode: "free",
          backgroundVisible: !0,
          backgroundTheme: "grid",
          renderScale: 0.8,
          lightingMode: "region",
          groundReflection: { mode: "off", resolution: 512, strength: 0.18 },
          pageDimStrength: {
            overview: 0,
            light: 0,
            environment: 30,
            devices: 40,
            vacuum: 15,
            security: 31
          },
          focusDimStrength: 7,
          focusVignetteStrength: 14,
          popupOpacity: 74,
          interaction: { rotationMode: "free", panEnabled: !1, zoomEnabled: !1 },
          behaviorScope: "global",
          pageBehaviors: {},
          autoRotate: { enabled: !1, idleSeconds: 30, speed: 6, direction: "clockwise" },
          idleExitFocus: { enabled: !1, idleSeconds: 30 },
          idleHideIcons: { enabled: !1, idleSeconds: 30 },
          hideIconsWhileRotating: !1,
          lights: [],
          devices: { nas: [] },
          environment: { dimStrength: 70, airConditioners: [], curtains: [] }
        },
        bindings: {},
        actions: {},
        children: [],
        style: { scale: 1, visible: !0 }
      };
    }
  };
