const COVER_DIRECTIONS = new Set(["left", "right", "split"]);
const CLOTH_PARTS = new Set(["cloth", "band"]);
const CURTAIN_PARTS = new Set(["rod", "cap", ...CLOTH_PARTS]);
const FRAME_INTERVAL_MS = 1000 / 30;
// Built-in easing is available for callers that omit { immediate: true }.
// Stage runtime owns travel timing in cover-feedback and pushes poses here with
// immediate:true each tick, so MOTION_DURATION_MS rarely drives stage animation.
const MOTION_DURATION_MS = 420;
const MIN_PANEL_SCALE = 0.12;
const FOLD_WIDTH = 0.15;
const foldCountForBinding = binding => Math.max(4, Math.min(96, Math.round((Number(binding.curtainWidth) || 1.8) / (resolveCoverDirection(binding) === "split" ? 2 : 1) / FOLD_WIDTH)));
const modelKey = (floorId, modelId) => JSON.stringify([String(floorId ?? ""), String(modelId ?? "")]);
const resolveCoverDirection = binding => COVER_DIRECTIONS.has(binding.coverDirection) ? binding.coverDirection : COVER_DIRECTIONS.has(binding.curtainPosition) ? binding.curtainPosition : "split";
const clampPosition = state => typeof state?.position == "number" && Number.isFinite(state.position) ? Math.max(0, Math.min(100, state.position)) : null;
const rigBasis = node => Array.isArray(node.userData?.curtainRigBasis) && node.userData.curtainRigBasis.length === 3 && node.userData.curtainRigBasis.every(n => typeof n == "number" && Number.isFinite(n) && n > 0) ? [...node.userData.curtainRigBasis] : [1.8, 2.4, 0.18];
function buildFoldGeometry(THREE, folds) {
  const segments = Math.max(64, folds * 6);
  const height = 2.28168;
  const waveAmp = 0.046;
  const thickness = 0.003;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const waveAt = t => waveAmp * Math.sin(t * folds * Math.PI * 2);
  const waveDerivAt = t => waveAmp * folds * Math.PI * 2 * Math.cos(t * folds * Math.PI * 2);
  const pushVertex = (x, y, z, nx, ny, nz, u, v) => {
    positions.push(x, y, z);
    normals.push(nx, ny, nz);
    uvs.push(u, v);
  };
  for (const face of ["front", "back", "top", "bottom"]) {
    const baseIndex = positions.length / 3;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const wave = waveAt(t);
      const deriv = waveDerivAt(t);
      const hyp = Math.hypot(deriv, 1);
      if (face === "front" || face === "back") {
        const side = face === "front" ? 1 : -1;
        for (const y of [0, height]) {
          pushVertex(t, y, wave + side * thickness / 2, -side * deriv / hyp, 0, side / hyp, t, y / height);
        }
      } else {
        const side = face === "top" ? 1 : -1;
        for (const z of [-thickness / 2, thickness / 2]) {
          pushVertex(t, side > 0 ? height : 0, wave + z, 0, side, 0, t, z > 0 ? 1 : 0);
        }
      }
      if (i < segments) {
        const idx = baseIndex + i * 2;
        if (face === "front" || face === "bottom") {
          indices.push(idx, idx + 2, idx + 1, idx + 1, idx + 2, idx + 3);
        } else {
          indices.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
        }
      }
    }
  }
  for (const end of [0, 1]) {
    const baseIndex = positions.length / 3;
    const nx = end === 0 ? -1 : 1;
    for (const y of [0, height]) {
      for (const z of [-thickness / 2, thickness / 2]) {
        pushVertex(end, y, waveAt(end) + z, nx, 0, 0, z > 0 ? 1 : 0, y / height);
      }
    }
    if (nx > 0) {
      indices.push(baseIndex, baseIndex + 2, baseIndex + 1, baseIndex + 1, baseIndex + 2, baseIndex + 3);
    } else {
      indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex + 1, baseIndex + 3, baseIndex + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
function isDescendantOf(node, ancestor) {
  for (let current = node; current; current = current.parent) {
    if (current === ancestor) {
      return true;
    }
  }
  return false;
}
function locateCurtainRig(modelNode) {
  const parts = [];
  const roots = [];
  function visit(node) {
    if (!node.userData?.curtainMotionRig && !node.userData?.curtainMotionPanel && (node === modelNode || node.userData?.environmentModelId == null)) {
      if (node.userData?.curtainRigRoot === true) {
        roots.push(node);
      }
      if (node.isMesh && CURTAIN_PARTS.has(node.userData?.curtainPart)) {
        parts.push(node);
      }
      for (const child of node.children || []) {
        visit(child);
      }
    }
  }
  visit(modelNode);
  if (!parts.some(part => CLOTH_PARTS.has(part.userData.curtainPart))) {
    return null;
  }
  let anchor = roots.find(root => parts.every(part => isDescendantOf(part, root)));
  if (!anchor) {
    for (anchor = parts[0].parent; anchor && !parts.every(part => isDescendantOf(part, anchor));) {
      anchor = anchor.parent;
    }
  }
  if (anchor && isDescendantOf(anchor, modelNode)) {
    return {
      anchor,
      parts
    };
  } else {
    return null;
  }
}
export function createCurtainMotion({
  THREE,
  requestRender = () => {}
} = {}) {
  let root = null;
  let sceneRevision;
  let bindingsSignature = "";
  let disposed = false;
  const geometryCache = new Map();
  function geometryForFolds(folds) {
    if (!geometryCache.has(folds)) {
      geometryCache.set(folds, buildFoldGeometry(THREE, folds));
    }
    return geometryCache.get(folds);
  }
  let entries = new Map();
  let pendingStates = new Map();
  let lastFrameAt = -Infinity;
  let poseDirty = true;
  let cachedPoseKey = "";
  let entityById = new Map();
  let nextGeneration = 1;
  let structureDirty = true;
  let cachedStructureKey = "";
  function markDirty() {
    poseDirty = true;
    requestRender();
  }
  function createEntry(modelNode, binding, located) {
    const clothParts = located.parts.filter(part => CLOTH_PARTS.has(part.userData.curtainPart));
    const sourceMaterials = clothParts.filter(part => part.userData.curtainPart === "cloth").flatMap(mesh => Array.isArray(mesh.material) ? mesh.material : [mesh.material]).filter(Boolean);
    const colorSum = material => material.color ? material.color.r + material.color.g + material.color.b : 0;
    const material = sourceMaterials.reduce((best, candidate) => !best || colorSum(candidate) > colorSum(best) ? candidate : best, null)?.clone?.() || new THREE.MeshStandardMaterial({
      color: 13094354,
      roughness: 0.94,
      metalness: 0
    });
    material.color?.lerp(new THREE.Color(16777215), 0.2);
    material.side = THREE.DoubleSide;
    material.forceSinglePass = true;
    const folds = foldCountForBinding(binding);
    const geometry = geometryForFolds(folds);
    const rig = new THREE.Group();
    const basis = rigBasis(located.anchor);
    rig.name = "curtain-motion-" + binding.id;
    rig.userData.curtainMotionRig = true;
    rig.scale.set(basis[0] / 1.8, basis[1] / 2.4, basis[2] / 0.18);
    located.anchor.add(rig);
    const panels = ["left", "right"].map(curtainSide => {
      const panel = new THREE.Mesh(geometry, material);
      panel.name = "curtain-motion-" + binding.id + "-" + curtainSide;
      panel.userData.curtainMotionPanel = true;
      panel.userData.curtainSide = curtainSide;
      panel.userData.externalModelSharedGeometry = true;
      panel.userData.externalModelSharedTextures = true;
      panel.userData.externalModelSharedMaterial = true;
      panel.position.set(curtainSide === "left" ? -0.9 : 0.9, 0.06, 0);
      panel.castShadow = clothParts.some(part => part.castShadow);
      panel.receiveShadow = clothParts.some(part => part.receiveShadow);
      panel.visible = false;
      rig.add(panel);
      return panel;
    });
    return {
      model: modelNode,
      binding,
      folds,
      anchor: located.anchor,
      parts: located.parts,
      rig,
      basis,
      generation: nextGeneration++,
      panels,
      material,
      originals: new Map(clothParts.map(part => [part, part.visible])),
      direction: resolveCoverDirection(binding),
      position: null,
      target: null,
      motionFrom: null,
      motionStart: null
    };
  }
  function disposeEntry(entry) {
    for (const [part, wasVisible] of entry.originals) {
      part.visible = wasVisible;
    }
    entry.rig.removeFromParent();
    entry.material.dispose();
  }
  function resetMotion(entry) {
    entry.position = null;
    entry.target = null;
    entry.motionFrom = null;
    entry.motionStart = null;
    applyPose(entry);
  }
  function applyPose(entry) {
    // Unconfigured / unknown cover position previews as open (retracted).
    const position = entry.position ?? 100;
    const isSplit = entry.direction === "split";
    const fullWidth = isSplit ? 0.906 : 1.8;
    const scaleX = 1 - (1 - MIN_PANEL_SCALE) * position / 100;
    for (const part of entry.originals.keys()) {
      part.visible = false;
    }
    for (const panel of entry.panels) {
      const isLeft = panel.userData.curtainSide === "left";
      panel.visible = isSplit || entry.direction === (isLeft ? "left" : "right");
      panel.scale.x = (isLeft ? 1 : -1) * fullWidth * scaleX;
      panel.updateMatrix();
    }
    poseDirty = true;
  }
  function setEntryTarget(entry, state, immediate = false) {
    const nextPosition = clampPosition(state);
    if (nextPosition === null) {
      const changed = entry.target !== entry.position;
      entry.target = entry.position;
      entry.motionStart = null;
      return changed;
    }
    if (entry.position === null || immediate) {
      const changed = entry.position !== nextPosition || entry.target !== nextPosition;
      entry.position = nextPosition;
      entry.target = nextPosition;
      entry.motionStart = null;
      if (changed) {
        applyPose(entry);
      }
      return changed;
    }
    if (entry.target === nextPosition) {
      return false;
    } else {
      entry.target = nextPosition;
      entry.motionFrom = entry.position;
      entry.motionStart = null;
      return true;
    }
  }
  function setBindings(nextRoot, rawBindings = [], revision) {
    if (disposed) {
      return;
    }
    const seenIds = new Set();
    const seenModelKeys = new Set();
    const bindings = (Array.isArray(rawBindings) ? rawBindings : []).filter(binding => {
      if (!binding || binding.id == null || binding.modelId == null) {
        return false;
      }
      const id = String(binding.id);
      const key = modelKey(binding.floorId, binding.modelId);
      if (seenIds.has(id) || seenModelKeys.has(key)) {
        return false;
      } else {
        seenIds.add(id);
        seenModelKeys.add(key);
        return true;
      }
    }).map(binding => ({
      id: String(binding.id),
      entityId: String(binding.entityId ?? ""),
      floorId: String(binding.floorId ?? ""),
      modelId: String(binding.modelId),
      curtainWidth: Number(binding.curtainWidth) > 0 ? Number(binding.curtainWidth) : 1.8,
      coverDirection: binding.coverDirection || "auto",
      curtainPosition: binding.curtainPosition || "split"
    }));
    const nextSignature = JSON.stringify(bindings);
    if (root === nextRoot && sceneRevision === revision && bindingsSignature === nextSignature) {
      return;
    }
    const nextEntityById = new Map(bindings.map(binding => [binding.id, binding.entityId]));
    for (const id of pendingStates.keys()) {
      if (!nextEntityById.has(id) || entityById.has(id) && entityById.get(id) !== nextEntityById.get(id)) {
        pendingStates.delete(id);
      }
    }
    entityById = nextEntityById;
    root = nextRoot || null;
    sceneRevision = revision;
    bindingsSignature = nextSignature;
    const modelNodes = new Map();
    if (bindings.length) {
      root?.traverse?.(node => {
        if (node.userData?.environmentModelType !== "curtain" || node.userData?.environmentModelId == null) {
          return;
        }
        let floorId = node.userData.environmentFloorId;
        for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
          floorId = parent.userData?.environmentFloorId;
        }
        modelNodes.set(modelKey(floorId, node.userData.environmentModelId), node);
      });
    }
    const locatedBindings = bindings.map(binding => {
      const modelNode = modelNodes.get(modelKey(binding.floorId, binding.modelId));
      const located = modelNode ? locateCurtainRig(modelNode) : null;
      if (located) {
        return {
          binding,
          model: modelNode,
          located
        };
      } else {
        return null;
      }
    }).filter(Boolean);
    const reused = new Map();
    for (const item of locatedBindings) {
      const existing = entries.get(item.binding.id);
      if (existing && existing.model === item.model && existing.anchor === item.located.anchor && existing.parts.length === item.located.parts.length && existing.parts.every((part, index) => part === item.located.parts[index])) {
        reused.set(item.binding.id, existing);
      }
    }
    for (const [id, entry] of entries) {
      if (!reused.has(id)) {
        disposeEntry(entry);
      }
    }
    entries = new Map();
    for (const {
      binding,
      model: modelNode,
      located
    } of locatedBindings) {
      const entry = reused.get(binding.id) || createEntry(modelNode, binding, located);
      const direction = resolveCoverDirection(binding);
      if (entry.binding.entityId !== binding.entityId) {
        resetMotion(entry);
      }
      entry.binding = binding;
      const folds = foldCountForBinding(binding);
      if (entry.folds !== folds) {
        entry.folds = folds;
        for (const panel of entry.panels) {
          panel.geometry = geometryForFolds(folds);
        }
      }
      entry.basis = rigBasis(entry.anchor);
      entry.rig.scale.set(entry.basis[0] / 1.8, entry.basis[1] / 2.4, entry.basis[2] / 0.18);
      if (entry.direction !== direction) {
        entry.direction = direction;
        applyPose(entry);
      }
      entries.set(binding.id, entry);
      if (pendingStates.has(binding.id)) {
        setEntryTarget(entry, pendingStates.get(binding.id));
      }
      if (entry.position === null) {
        applyPose(entry);
      }
    }
    structureDirty = true;
    markDirty();
  }
  function setState(id, state, {
    immediate = false
  } = {}) {
    if (disposed || id == null) {
      return;
    }
    const key = String(id);
    const nextState = {
      position: clampPosition(state)
    };
    pendingStates.set(key, nextState);
    const entry = entries.get(key);
    if (entry && setEntryTarget(entry, nextState, immediate)) {
      markDirty();
    }
  }
  function isMoving() {
    return !disposed && [...entries.values()].some(entry => entry.position !== null && entry.target !== entry.position);
  }
  function update(nowMs) {
    if (!isMoving() || (Number.isFinite(nowMs) || (nowMs = globalThis.performance?.now() ?? Date.now()), nowMs >= lastFrameAt && nowMs - lastFrameAt < FRAME_INTERVAL_MS)) {
      return false;
    }
    lastFrameAt = Number.isFinite(lastFrameAt) && nowMs >= lastFrameAt ? nowMs - (nowMs - lastFrameAt) % FRAME_INTERVAL_MS : nowMs;
    let changed = false;
    for (const entry of entries.values()) {
      if (entry.position === null || entry.target === entry.position) {
        continue;
      }
      if (entry.motionStart === null || nowMs < entry.motionStart) {
        entry.motionStart = nowMs;
      }
      const progress = Math.min(1, (nowMs - entry.motionStart) / MOTION_DURATION_MS);
      const eased = progress * progress * (3 - progress * 2);
      const nextPosition = progress === 1 ? entry.target : entry.motionFrom + (entry.target - entry.motionFrom) * eased;
      if (nextPosition !== entry.position) {
        entry.position = nextPosition;
        applyPose(entry);
        changed = true;
      }
    }
    return changed;
  }
  function poseKey() {
    if (poseDirty) {
      cachedPoseKey = JSON.stringify([...entries.values()].map(entry => [entry.binding.id, entry.binding.floorId, entry.binding.modelId, entry.binding.entityId, entry.generation, entry.direction, entry.basis, entry.folds, entry.position === null ? "preview-closed" : Math.round(entry.position * 100) / 100]).sort((a, b) => a[0].localeCompare(b[0])));
      poseDirty = false;
    }
    return cachedPoseKey;
  }
  function structureKey() {
    if (structureDirty) {
      cachedStructureKey = JSON.stringify([...entries.values()].map(entry => [entry.binding.id, entry.binding.floorId, entry.binding.modelId, entry.generation, entry.direction, entry.basis, entry.folds]).sort((a, b) => a[0].localeCompare(b[0])));
      structureDirty = false;
    }
    return cachedStructureKey;
  }
  function dispose() {
    if (!disposed) {
      disposed = true;
      for (const entry of entries.values()) {
        disposeEntry(entry);
      }
      entries.clear();
      pendingStates.clear();
      entityById.clear();
      for (const geometry of geometryCache.values()) {
        geometry.dispose();
      }
      geometryCache.clear();
      root = null;
      poseDirty = true;
      structureDirty = true;
      requestRender();
    }
  }
  return {
    setBindings,
    setState,
    update,
    isMoving,
    poseKey,
    structureKey,
    dispose
  };
}
