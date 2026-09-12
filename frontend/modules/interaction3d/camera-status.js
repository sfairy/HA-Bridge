export function cameraOnline(entity) {
  const state = entity?.newState || entity;
  const rawState = String(state?.state || '').trim().toLowerCase();
  return state?.available !== false && !!rawState && !['unknown', 'unavailable', 'none'].includes(rawState);
}
export function createCameraStatus({
  THREE,
  requestFrame = () => {}
}) {
  const entries = new Map();
  const sharedGeometry = new THREE.SphereGeometry(1, 10, 8);
  const modelKey = (floorId, modelId) => JSON.stringify([floorId, modelId]);
  let root;
  let sceneRevision;
  let bindingsSignature;
  let disposed = false;
  function disposeEntry(entry) {
    entry.mesh.removeFromParent();
    entry.mesh.material.dispose();
  }
  function sync({
    root: nextRoot,
    revision,
    bindings = [],
    states = {},
    enabled = false,
    brightness = 1
  }) {
    if (disposed) {
      return;
    }
    let changed = false;
    const nextBindingsSignature = JSON.stringify(bindings.map(binding => [binding.id, binding.floorId, binding.modelId, binding.width, binding.height, binding.depth]));
    if (root !== nextRoot || sceneRevision !== revision || bindingsSignature !== nextBindingsSignature) {
      root = nextRoot;
      sceneRevision = revision;
      bindingsSignature = nextBindingsSignature;
      const modelNodes = new Map();
      root?.traverse(node => {
        if (node.userData?.environmentModelType !== 'camera') {
          return;
        }
        let floorId = node.userData.environmentFloorId;
        for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
          floorId = parent.userData.environmentFloorId;
        }
        modelNodes.set(modelKey(floorId, node.userData.environmentModelId), node);
      });
      const activeIds = new Set();
      for (const binding of bindings) {
        const modelNode = modelNodes.get(modelKey(binding.floorId, binding.modelId));
        if (!modelNode) {
          continue;
        }
        activeIds.add(binding.id);
        let entry = entries.get(binding.id);
        if (entry?.model !== modelNode) {
          if (entry) {
            disposeEntry(entry);
          }
          const material = new THREE.MeshBasicMaterial({
            color: 7830916,
            toneMapped: false,
            transparent: true,
            depthWrite: false
          });
          const mesh = new THREE.Mesh(sharedGeometry, material);
          mesh.name = 'camera-status-' + binding.id;
          Object.assign(mesh.userData, {
            environmentEffect: true,
            cameraStatus: true,
            externalModelSharedGeometry: true,
            externalModelSharedMaterial: true
          });
          mesh.raycast = () => {};
          modelNode.add(mesh);
          entry = {
            model: modelNode,
            mesh
          };
          entries.set(binding.id, entry);
          changed = true;
        }
        entry.mesh.position.set(0, binding.height * 0.84, binding.depth * 0.475);
        entry.mesh.scale.setScalar(Math.max(0.003, binding.width * 0.027));
      }
      for (const [id, entry] of entries) {
        if (!activeIds.has(id)) {
          disposeEntry(entry);
          entries.delete(id);
          changed = true;
        }
      }
    }
    for (const binding of bindings) {
      const entry = entries.get(binding.id);
      if (!entry) {
        continue;
      }
      const visible = enabled && !!binding.entityId;
      const color = cameraOnline(states[binding.entityId]) ? 8571275 : 7830916;
      changed = changed || entry.mesh.visible !== visible || entry.mesh.material.color.getHex() !== color || entry.mesh.material.opacity !== brightness;
      entry.mesh.visible = visible;
      entry.mesh.material.color.setHex(color);
      entry.mesh.material.opacity = brightness;
    }
    if (changed) {
      requestFrame();
    }
  }
  return {
    sync,
    dispose() {
      if (!disposed) {
        disposed = true;
        for (const entry of entries.values()) {
          disposeEntry(entry);
        }
        entries.clear();
        sharedGeometry.dispose();
      }
    }
  };
}
