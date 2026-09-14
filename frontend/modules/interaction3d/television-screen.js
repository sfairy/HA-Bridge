import { televisionState } from "./television-state.js";

const posterModuleUrl = import.meta.url.startsWith("file:")
  ? new URL("../../static/3d-studio/studio-television-poster.js?v=0.5.3", import.meta.url)
  : "/bridge-static/3d-studio/studio-television-poster.js?v=0.5.3";
const { drawTelevisionPoster } = await import(posterModuleUrl);

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
  function collectGlows(modelNode) {
    const glows = [];
    modelNode.traverse(child => {
      if (child.userData?.televisionGlow) {
        glows.push([child, child.visible]);
        child.visible = false;
      }
    });
    return glows;
  }
  function restoreGlows(entry) {
    for (const [glowNode, wasVisible] of entry.glows) {
      glowNode.visible = wasVisible;
    }
  }
  function attachMaterials(entry, screenMesh) {
    const original = screenMesh.material;
    const materials = Array.from({
      length: 6
    }, (_slot, faceIndex) => faceIndex === 4 ? entry.material : Array.isArray(original) ? original[faceIndex] : original);
    entry.screen = screenMesh;
    entry.original = original;
    entry.materials = materials;
    screenMesh.material = materials;
  }
  function disposeEntry(entry) {
    entry.generation++;
    if (entry.screen.material === entry.materials) {
      entry.screen.material = entry.original;
    }
    restoreGlows(entry);
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
    if (state.on && image) {
      context.fillStyle = "#050609";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
    } else if (state.on) {
      drawTelevisionPoster(canvas, context);
    } else {
      context.fillStyle = "#050609";
      context.fillRect(0, 0, canvas.width, canvas.height);
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
          if (entry.screen.material === entry.materials) {
            entry.screen.material = entry.original;
          }
          restoreGlows(entry);
          attachMaterials(entry, screenMesh);
          entry.glows = collectGlows(modelNode);
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
          entry = {
            floorId: binding.floorId,
            screen: screenMesh,
            original: screenMesh.material,
            materials: null,
            material,
            canvas,
            context,
            texture,
            glows: collectGlows(modelNode),
            generation: 0,
            artwork: "",
            signature: "",
            image: null,
            state: televisionState(binding, states)
          };
          paintEntry(entry);
          attachMaterials(entry, screenMesh);
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
