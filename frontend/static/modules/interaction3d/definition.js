export const INTERACTION3D_TYPE = "interaction3d";
export const INTERACTION3D_FEATURE = "module.3d_interaction";
export const INTERACTION3D_LIGHTING_MODES = [["standard", "标准光影"], ["region", "轻量柔光"]];
export const normalizeInteraction3dLightingMode = e => e === "region" ? "region" : "standard";
export const interaction3dTemplate = {
  id: INTERACTION3D_TYPE,
  type: INTERACTION3D_TYPE,
  name: "3D 交互",
  description: "在 3D 户型中查看和控制灯光、设备。",
  scopes: ["page"],
  create({
    id: e,
    instanceName: t = "3D 交互",
    canvas: n
  }) {
    const o = Number(n?.width || 2778);
    const i = Number(n?.height || 1940);
    const r = o * 0.56;
    const s = i * 0.56;
    return {
      id: e,
      type: INTERACTION3D_TYPE,
      componentVersion: 1,
      position: {
        x: (o - r) / 2,
        y: (i - s) / 2,
        width: r,
        height: s,
        rotation: 0,
        zIndex: 1
      },
      properties: {
        label: t,
        instanceName: t,
        layoutMode: "free",
        backgroundVisible: true,
        renderScale: 0.8,
        lightingMode: "region",
        groundReflection: {
          mode: "off",
          resolution: 512,
          strength: 0.18
        },
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
        interaction: {
          rotationMode: "free",
          panEnabled: false,
          zoomEnabled: false
        },
        behaviorScope: "global",
        pageBehaviors: {},
        autoRotate: {
          enabled: false,
          idleSeconds: 30,
          speed: 6,
          direction: "clockwise"
        },
        idleExitFocus: {
          enabled: false,
          idleSeconds: 30
        },
        idleHideIcons: {
          enabled: false,
          idleSeconds: 30
        },
        hideIconsWhileRotating: false,
        lights: [],
        devices: {
          nas: []
        },
        environment: {
          dimStrength: 70,
          airConditioners: [],
          curtains: []
        }
      },
      bindings: {},
      actions: {},
      children: [],
      style: {
        scale: 1,
        visible: true
      }
    };
  }
};
