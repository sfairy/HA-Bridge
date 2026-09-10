export function createRenderLightIndex() {
  let root = null;
  let dirty = true;
  let disposed = false;
  let listenedNodes = [];
  let lightEntries = [];
  let sortedLights = [];
  let visibleLights = [];
  let lightScores = [];
  const visibilityCache = new Map();
  const stats = {
    builds: 0,
    sorts: 0,
    reads: 0,
    checkedLights: 0
  };
  const invalidate = () => {
    dirty = true;
  };
  function detachListeners() {
    for (const node of listenedNodes) {
      node.removeEventListener("childadded", invalidate);
      node.removeEventListener("childremoved", invalidate);
    }
    listenedNodes = [];
    lightEntries = [];
  }
  function rebuild() {
    detachListeners();
    visibleLights = [];
    lightScores = [];
    sortedLights = [];
    root.traverse(object => {
      listenedNodes.push(object);
      object.addEventListener("childadded", invalidate);
      object.addEventListener("childremoved", invalidate);
      if (!object.isSpotLight) {
        return;
      }
      const path = [];
      for (let node = object; node && (path.push(node), node !== root); node = node.parent);
      lightEntries.push({
        object,
        path
      });
    });
    dirty = false;
    stats.builds++;
  }
  return {
    stats,
    read(scene, camera) {
      if (disposed) {
        return [];
      }
      if (root !== scene) {
        root = scene;
        dirty = true;
      }
      if (dirty) {
        rebuild();
      }
      stats.reads++;
      visibilityCache.clear();
      let visibleCount = 0;
      let orderChanged = false;
      for (const {
        object: light,
        path
      } of lightEntries) {
        stats.checkedLights++;
        let isVisible = true;
        for (const node of path) {
          let nodeVisible = visibilityCache.get(node);
          if (nodeVisible === undefined) {
            nodeVisible = node.visible !== false;
            visibilityCache.set(node, nodeVisible);
          }
          if (!nodeVisible) {
            isVisible = false;
            break;
          }
        }
        if (!isVisible || !light.layers.test(camera.layers)) {
          continue;
        }
        const score = (light.castShadow ? 2 : 0) + (light.map ? 1 : 0);
        if (visibleLights[visibleCount] !== light || lightScores[visibleCount] !== score) {
          orderChanged = true;
        }
        visibleLights[visibleCount] = light;
        lightScores[visibleCount] = score;
        visibleCount++;
      }
      if (visibleLights.length !== visibleCount) {
        orderChanged = true;
      }
      visibleLights.length = lightScores.length = visibleCount;
      if (orderChanged) {
        sortedLights.length = 0;
        for (const light of visibleLights) {
          sortedLights.push(light);
        }
        sortedLights.sort((a, b) => (b.castShadow ? 2 : 0) + (b.map ? 1 : 0) - ((a.castShadow ? 2 : 0) + (a.map ? 1 : 0)));
        stats.sorts++;
      }
      return sortedLights;
    },
    invalidate,
    dispose() {
      disposed = true;
      detachListeners();
      visibilityCache.clear();
      root = null;
      sortedLights = visibleLights = lightScores = [];
    }
  };
}
