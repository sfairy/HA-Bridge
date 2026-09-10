import { televisionState } from "./television-state.js";
const U = "M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z";
export function createTelevisionScreens({
  THREE: CanvasTexture,
  requestFrame: arg9 = () => {}
}) {
  let traverse2;
  let value9;
  let items = new Map();
  let map = new Map();
  let value10 = false;
  const value11 = floorId2 => JSON.stringify([floorId2.floorId, floorId2.modelId]);
  function fn(screen) {
    screen.generation++;
    if (screen.screen.material === screen.materials) {
      screen.screen.material = screen.original;
    }
    for (const [visible3, visible4] of screen.glows) {
      visible3.visible = visible4;
    }
    screen.texture.dispose();
    screen.material.dispose();
  }
  function fn2(texture) {
    if (value10) {
      return;
    }
    const {
      canvas: width2,
      context: fillStyle,
      state: on,
      image: naturalWidth
    } = texture;
    fillStyle.fillStyle = "#050609";
    fillStyle.fillRect(0, 0, width2.width, width2.height);
    if (on.on && naturalWidth) {
      const value6 = Math.min(width2.width / naturalWidth.naturalWidth, width2.height / naturalWidth.naturalHeight);
      const value7 = naturalWidth.naturalWidth * value6;
      const value8 = naturalWidth.naturalHeight * value6;
      fillStyle.drawImage(naturalWidth, (width2.width - value7) / 2, (width2.height - value8) / 2, value7, value8);
    } else if (on.on) {
      fillStyle.save();
      fillStyle.translate(width2.width / 2 - 36, 76);
      fillStyle.scale(3, 3);
      fillStyle.fillStyle = "#e2e5eb";
      fillStyle.fill(new Path2D(U));
      fillStyle.restore();
      fillStyle.textAlign = "center";
      fillStyle.fillStyle = "#9da5b1";
      fillStyle.font = "18px sans-serif";
      fillStyle.fillText("暂无播放内容", width2.width / 2, 196);
    }
    texture.texture.needsUpdate = true;
    arg9([texture.floorId]);
  }
  return {
    sync({
      root: arg3,
      revision: arg4,
      bindings: arg5 = [],
      states: arg6 = {},
      focusedModel: arg7 = "",
      dimStrength: arg8 = 70
    }) {
      if (value10) {
        return;
      }
      if (traverse2 !== arg3 || value9 !== arg4) {
        traverse2 = arg3;
        value9 = arg4;
        map = new Map();
        traverse2?.traverse(userData => {
          if (userData.userData?.environmentModelType === "tv") {
            map.set(JSON.stringify([userData.userData.environmentFloorId, userData.userData.environmentModelId]), userData);
          }
        });
      }
      const add = new Set();
      for (const visible2 of arg5) {
        if (visible2.visible === false || !visible2.entityId) {
          continue;
        }
        const value2 = value11(visible2);
        const traverse = map.get(value2);
        if (!traverse) {
          continue;
        }
        let material2;
        traverse.traverse(userData2 => {
          if (userData2.userData?.televisionScreen) {
            material2 = userData2;
          }
        });
        if (!material2) {
          continue;
        }
        add.add(value2);
        let image = items.get(value2);
        if (image && image.screen !== material2) {
          fn(image);
          items.delete(value2);
          image = null;
        }
        if (!image) {
          const width = document.createElement("canvas");
          width.width = 512;
          width.height = 288;
          const context = width.getContext("2d");
          if (!context) {
            continue;
          }
          const colorSpace = new CanvasTexture.CanvasTexture(width);
          colorSpace.colorSpace = CanvasTexture.SRGBColorSpace;
          const material = new CanvasTexture.MeshBasicMaterial({
            map: colorSpace,
            toneMapped: false,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2
          });
          const original = material2.material;
          const materials = Array.from({
            length: 6
          }, (arg, arg2) => arg2 === 4 ? material : Array.isArray(original) ? original[arg2] : original);
          const push = [];
          traverse.traverse(visible => {
            if (visible.userData?.televisionGlow) {
              push.push([visible, visible.visible]);
              visible.visible = false;
            }
          });
          image = {
            floorId: visible2.floorId,
            screen: material2,
            original,
            materials,
            material,
            canvas: width,
            context,
            texture: colorSpace,
            glows: push,
            generation: 0,
            artwork: "",
            signature: "",
            image: null
          };
          material2.material = materials;
          items.set(value2, image);
        }
        const artwork = televisionState(visible2, arg6);
        const signature = JSON.stringify([artwork.on, artwork.status, artwork.title, artwork.app, artwork.name, artwork.artwork]);
        image.state = artwork;
        const value3 = arg7 && arg7 !== value2 ? Math.max(0.1, 1 - arg8 / 100) : 1;
        if (image.material.color.r !== value3) {
          image.material.color.setRGB(value3, value3, value3);
          arg9([image.floorId]);
        }
        if (image.signature !== signature) {
          image.signature = signature;
          if (image.artwork !== artwork.artwork) {
            image.artwork = artwork.artwork;
            image.image = null;
            const value = ++image.generation;
            if (artwork.artwork) {
              const onload = new Image();
              onload.onload = () => {
                if (!value10 && value === image.generation && items.get(value2) === image) {
                  image.image = onload;
                  fn2(image);
                }
              };
              onload.onerror = () => {
                if (!value10 && value === image.generation && items.get(value2) === image) {
                  image.image = null;
                  fn2(image);
                }
              };
              onload.src = artwork.artwork;
            }
          }
          fn2(image);
        }
      }
      for (const [value4, floorId] of items) {
        if (!add.has(value4)) {
          fn(floorId);
          items.delete(value4);
          arg9([floorId.floorId]);
        }
      }
    },
    dispose() {
      value10 = true;
      for (const value5 of items.values()) {
        fn(value5);
      }
      items.clear();
      map.clear();
      traverse2 = null;
    }
  };
}
