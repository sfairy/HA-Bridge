export function createRenderLightIndex() {
  let currentRoot = null;
  let needsRebuild = true;
  let isDisposed = false;
  let observedObjects = [];
  let shadowLightEntries = [];
  let sortedLights = [];
  let traversalLights = [];
  let traversalScores = [];
  const visibilityByObject = new Map();
  const stats = {
    builds: 0,
    sorts: 0,
    reads: 0,
    checkedLights: 0
  };
  const invalidateIndex = () => {
    needsRebuild = true;
  };
  function resetObservers() {
    for (const observedObject of observedObjects) {
      observedObject.removeEventListener("childadded", invalidateIndex);
      observedObject.removeEventListener("childremoved", invalidateIndex);
    }
    observedObjects = [];
    shadowLightEntries = [];
  }
  function rebuildIndex() {
    resetObservers();
    traversalLights = [];
    traversalScores = [];
    sortedLights = [];
    currentRoot.traverse(sceneObject => {
      observedObjects.push(sceneObject);
      sceneObject.addEventListener("childadded", invalidateIndex);
      sceneObject.addEventListener("childremoved", invalidateIndex);
      if (!sceneObject.isSpotLight) {
        return;
      }
      const parentPath = [];
      for (
        let node = sceneObject;
        node && (parentPath.push(node), node !== currentRoot);
        node = node.parent
      );
      shadowLightEntries.push({
        object: sceneObject,
        path: parentPath
      });
    });
    needsRebuild = false;
    stats.builds++;
  }
  return {
    stats: stats,
    read(root, camera) {
      if (isDisposed) {
        return [];
      }
      if (currentRoot !== root) {
        currentRoot = root;
        needsRebuild = true;
      }
      if (needsRebuild) {
        rebuildIndex();
      }
      stats.reads++;
      visibilityByObject.clear();
      let visibleLightCount = 0;
      let isOrderChanged = false;
      for (const { object: light, path: lightPath } of shadowLightEntries) {
        stats.checkedLights++;
        let isVisible = true;
        for (const ancestorNode of lightPath) {
          let cachedVisibility = visibilityByObject.get(ancestorNode);
          if (cachedVisibility === undefined) {
            cachedVisibility = ancestorNode.visible !== false;
            visibilityByObject.set(ancestorNode, cachedVisibility);
          }
          if (!cachedVisibility) {
            isVisible = false;
            break;
          }
        }
        if (!isVisible || !light.layers.test(camera.layers)) {
          continue;
        }
        const shadowScore = (light.castShadow ? 2 : 0) + (light.map ? 1 : 0);
        if (
          traversalLights[visibleLightCount] !== light ||
          traversalScores[visibleLightCount] !== shadowScore
        ) {
          isOrderChanged = true;
        }
        traversalLights[visibleLightCount] = light;
        traversalScores[visibleLightCount] = shadowScore;
        visibleLightCount++;
      }
      if (traversalLights.length !== visibleLightCount) {
        isOrderChanged = true;
      }
      traversalLights.length = traversalScores.length = visibleLightCount;
      if (isOrderChanged) {
        sortedLights.length = 0;
        for (const orderedLight of traversalLights) {
          sortedLights.push(orderedLight);
        }
        sortedLights.sort(
          (lightA, lightB) =>
            (lightB.castShadow ? 2 : 0) +
            (lightB.map ? 1 : 0) -
            ((lightA.castShadow ? 2 : 0) + (lightA.map ? 1 : 0))
        );
        stats.sorts++;
      }
      return sortedLights;
    },
    invalidate: invalidateIndex,
    dispose() {
      isDisposed = true;
      resetObservers();
      visibilityByObject.clear();
      currentRoot = null;
      sortedLights = traversalLights = traversalScores = [];
    }
  };
}
