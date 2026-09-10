import { televisionState } from "./television-state.js";
const APPLE_TV_PATH = "M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z";
export function createTelevisionScreens({
  THREE,
  requestFrame = () => {}
}) {
  let root;
  let sceneRevision;
  let items = new Map();
  let screenNodes = new Map();
  let disposed = false;
  const bindingKey = binding => JSON.stringify([binding.floorId, binding.modelId]);
  function disposeEntry(entry) {
    entry.generation++;
    if (entry.screen.material === entry.materials) {
      entry.screen.material = entry.original;
    }
    for (const [glowNode, wasVisible] of entry.glows) {
      glowNode.visible = wasVisible;
    }
    entry.texture.dispose();
    entry.material.dispose();
  }
  function paintEntry(entry) {
    if (disposed) {
      return;
    }
    const {
      canvas,
      context,
      state,
      image
    } = entry;
    context.fillStyle = "#050609";
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (state.on && image) {
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
    } else if (state.on) {
      context.save();
      context.translate(canvas.width / 2 - 36, 76);
      context.scale(3, 3);
      context.fillStyle = "#e2e5eb";
      context.fill(new Path2D(APPLE_TV_PATH));
      context.restore();
      context.textAlign = "center";
      context.fillStyle = "#9da5b1";
      context.font = "18px sans-serif";
      context.fillText("暂无播放内容", canvas.width / 2, 196);
    }
    entry.texture.needsUpdate = true;
    requestFrame([entry.floorId]);
  }
  return {
    sync({
      root: nextRoot,
      revision,
      bindings = [],
      states = {},
      focusedModel = "",
      dimStrength = 70
    }) {
      if (disposed) {
        return;
      }
      if (root !== nextRoot || sceneRevision !== revision) {
        root = nextRoot;
        sceneRevision = revision;
        screenNodes = new Map();
        root?.traverse(node => {
          if (node.userData?.environmentModelType === "tv") {
            screenNodes.set(JSON.stringify([node.userData.environmentFloorId, node.userData.environmentModelId]), node);
          }
        });
      }
      const activeKeys = new Set();
      for (const binding of bindings) {
        if (binding.visible === false || !binding.entityId) {
          continue;
        }
        const key = bindingKey(binding);
        const modelNode = screenNodes.get(key);
        if (!modelNode) {
          continue;
        }
        let screenMesh;
        modelNode.traverse(child => {
          if (child.userData?.televisionScreen) {
            screenMesh = child;
          }
        });
        if (!screenMesh) {
          continue;
        }
        activeKeys.add(key);
        let entry = items.get(key);
        if (entry && entry.screen !== screenMesh) {
          disposeEntry(entry);
          items.delete(key);
          entry = null;
        }
        if (!entry) {
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 288;
          const context = canvas.getContext("2d");
          if (!context) {
            continue;
          }
          const texture = new THREE.CanvasTexture(canvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            toneMapped: false,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2
          });
          const original = screenMesh.material;
          const materials = Array.from({
            length: 6
          }, (_slot, faceIndex) => faceIndex === 4 ? material : Array.isArray(original) ? original[faceIndex] : original);
          const glows = [];
          modelNode.traverse(child => {
            if (child.userData?.televisionGlow) {
              glows.push([child, child.visible]);
              child.visible = false;
            }
          });
          entry = {
            floorId: binding.floorId,
            screen: screenMesh,
            original,
            materials,
            material,
            canvas,
            context,
            texture,
            glows,
            generation: 0,
            artwork: "",
            signature: "",
            image: null
          };
          screenMesh.material = materials;
          items.set(key, entry);
        }
        const mediaState = televisionState(binding, states);
        const signature = JSON.stringify([mediaState.on, mediaState.status, mediaState.title, mediaState.app, mediaState.name, mediaState.artwork]);
        entry.state = mediaState;
        const dimFactor = focusedModel && focusedModel !== key ? Math.max(0.1, 1 - dimStrength / 100) : 1;
        if (entry.material.color.r !== dimFactor) {
          entry.material.color.setRGB(dimFactor, dimFactor, dimFactor);
          requestFrame([entry.floorId]);
        }
        if (entry.signature !== signature) {
          entry.signature = signature;
          if (entry.artwork !== mediaState.artwork) {
            entry.artwork = mediaState.artwork;
            entry.image = null;
            const generation = ++entry.generation;
            if (mediaState.artwork) {
              const img = new Image();
              img.onload = () => {
                if (!disposed && generation === entry.generation && items.get(key) === entry) {
                  entry.image = img;
                  paintEntry(entry);
                }
              };
              img.onerror = () => {
                if (!disposed && generation === entry.generation && items.get(key) === entry) {
                  entry.image = null;
                  paintEntry(entry);
                }
              };
              img.src = mediaState.artwork;
            }
          }
          paintEntry(entry);
        }
      }
      for (const [key, entry] of items) {
        if (!activeKeys.has(key)) {
          disposeEntry(entry);
          items.delete(key);
          requestFrame([entry.floorId]);
        }
      }
    },
    dispose() {
      disposed = true;
      for (const entry of items.values()) {
        disposeEntry(entry);
      }
      items.clear();
      screenNodes.clear();
      root = null;
    }
  };
}
