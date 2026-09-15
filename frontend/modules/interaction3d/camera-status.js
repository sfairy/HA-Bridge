export function cameraOnline(stateOrChange) {
  const stateEntry = stateOrChange?.newState || stateOrChange;
  const stateText = String(stateEntry?.state || "")
    .trim()
    .toLowerCase();
  return (
    stateEntry?.available !== false &&
    !!stateText &&
    !["unknown", "unavailable", "none"].includes(stateText)
  );
}
export function createCameraStatus({ THREE: THREE, requestFrame: requestFrame = () => {} }) {
  const entriesByBindingId = new Map();
  const dotGeometry = new THREE.SphereGeometry(1, 10, 8);
  const modelKey = (floorId, modelId) => JSON.stringify([floorId, modelId]);
  let cachedRoot;
  let cachedRevision;
  let cachedBindingsKey;
  let isDisposed = false;
  const disposeStatusEntry = entryToDispose => {
    entryToDispose.mesh.removeFromParent();
    entryToDispose.mesh.material.dispose();
  };
  function syncCameraStatus({
    root: root,
    revision: revision,
    bindings: bindings = [],
    states: states = {},
    enabled: enabled = false,
    brightness: brightness = 1
  }) {
    if (isDisposed) {
      return;
    }
    let didChange = false;
    const bindingsKey = JSON.stringify(
      bindings.map(bindingForKey => [
        bindingForKey.id,
        bindingForKey.floorId,
        bindingForKey.modelId,
        bindingForKey.width,
        bindingForKey.height,
        bindingForKey.depth
      ])
    );
    if (cachedRoot !== root || cachedRevision !== revision || cachedBindingsKey !== bindingsKey) {
      cachedRoot = root;
      cachedRevision = revision;
      cachedBindingsKey = bindingsKey;
      const modelsByKey = new Map();
      cachedRoot?.traverse(traversedObject => {
        if (traversedObject.userData?.environmentModelType !== "camera") {
          return;
        }
        let objectFloorId = traversedObject.userData.environmentFloorId;
        for (
          let ancestorObject = traversedObject.parent;
          objectFloorId == null && ancestorObject;
          ancestorObject = ancestorObject.parent
        ) {
          objectFloorId = ancestorObject.userData.environmentFloorId;
        }
        modelsByKey.set(
          modelKey(objectFloorId, traversedObject.userData.environmentModelId),
          traversedObject
        );
      });
      const activeBindingIds = new Set();
      for (const activeBinding of bindings) {
        const matchedModel = modelsByKey.get(
          modelKey(activeBinding.floorId, activeBinding.modelId)
        );
        if (!matchedModel) {
          continue;
        }
        activeBindingIds.add(activeBinding.id);
        let trackedEntry = entriesByBindingId.get(activeBinding.id);
        if (trackedEntry?.model !== matchedModel) {
          if (trackedEntry) {
            disposeStatusEntry(trackedEntry);
          }
          const dotMaterial = new THREE.MeshBasicMaterial({
            color: 7830916,
            toneMapped: false,
            transparent: true,
            depthWrite: false
          });
          const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial);
          dotMesh.name = "camera-status-" + activeBinding.id;
          Object.assign(dotMesh.userData, {
            environmentEffect: true,
            cameraStatus: true,
            externalModelSharedGeometry: true,
            externalModelSharedMaterial: true
          });
          dotMesh.raycast = () => {};
          matchedModel.add(dotMesh);
          trackedEntry = {
            model: matchedModel,
            mesh: dotMesh
          };
          entriesByBindingId.set(activeBinding.id, trackedEntry);
          didChange = true;
        }
        trackedEntry.mesh.position.set(0, activeBinding.height * 0.84, activeBinding.depth * 0.475);
        trackedEntry.mesh.scale.setScalar(Math.max(0.003, activeBinding.width * 0.027));
      }
      for (const [staleBindingId, staleEntry] of entriesByBindingId) {
        if (!activeBindingIds.has(staleBindingId)) {
          disposeStatusEntry(staleEntry);
          entriesByBindingId.delete(staleBindingId);
          didChange = true;
        }
      }
    }
    for (const binding of bindings) {
      const existingEntry = entriesByBindingId.get(binding.id);
      if (!existingEntry) {
        continue;
      }
      const isCameraVisible = enabled && !!binding.entityId;
      const statusColorHex = cameraOnline(states[binding.entityId]) ? 8571275 : 7830916;
      didChange =
        didChange ||
        existingEntry.mesh.visible !== isCameraVisible ||
        existingEntry.mesh.material.color.getHex() !== statusColorHex ||
        existingEntry.mesh.material.opacity !== brightness;
      existingEntry.mesh.visible = isCameraVisible;
      existingEntry.mesh.material.color.setHex(statusColorHex);
      existingEntry.mesh.material.opacity = brightness;
    }
    if (didChange) {
      requestFrame();
    }
  }
  return {
    sync: syncCameraStatus,
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        for (const disposedEntry of entriesByBindingId.values()) {
          disposeStatusEntry(disposedEntry);
        }
        entriesByBindingId.clear();
        dotGeometry.dispose();
      }
    }
  };
}
