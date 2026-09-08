export const INTERACTION3D_TYPE = "interaction3d";
export const INTERACTION3D_FEATURE = "module.3d_interaction";

export const interaction3dTemplate = {
  id: INTERACTION3D_TYPE,
  type: INTERACTION3D_TYPE,
  name: "3D 交互",
  description: "在 3D 户型中查看和控制灯光、设备。",
  scopes: ["page"],
  create({ id, instanceName = "3D 交互", canvas }) {
    const canvasWidth = Number(canvas?.width || 2778);
    const canvasHeight = Number(canvas?.height || 1940);
    const width = canvasWidth * 0.56;
    const height = canvasHeight * 0.56;
    return {
      id,
      type: INTERACTION3D_TYPE,
      componentVersion: 1,
      position: {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2,
        width,
        height,
        rotation: 0,
        zIndex: 1,
      },
      properties: {
        label: instanceName,
        instanceName,
        layoutMode: "free",
        backgroundVisible: true,
        renderScale: 1,
        focusVignetteStrength: 14,
        popupOpacity: 74,
        interaction: {
          rotationMode: "free",
          panEnabled: false,
          zoomEnabled: false,
        },
        autoRotate: {
          enabled: false,
          idleSeconds: 30,
          speed: 6,
          direction: "clockwise",
        },
        idleHideIcons: {
          enabled: false,
          idleSeconds: 30,
        },
        lights: [],
      },
      bindings: {},
      actions: {},
      children: [],
      style: {
        scale: 1,
        visible: true,
      },
    };
  },
};
