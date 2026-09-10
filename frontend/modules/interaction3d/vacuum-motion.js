import { mapSource, vacuumStatusPresentation, vacuumBindingsForMap } from "./vacuum-map.js?v=20260909-curtain-action-v15";
const isFiniteNumber = value => typeof value == "number" && Number.isFinite(value);
const asPoint = point => point && isFiniteNumber(point.x) && isFiniteNumber(point.y) ? point : null;
export function vacuumMapPoint(point, calibrationPoints, imageSize, mapPlacement) {
  if (!asPoint(point) || !Array.isArray(calibrationPoints) || calibrationPoints.length < 3 || !(imageSize?.width > 0) || !(imageSize?.height > 0) || !(mapPlacement?.width > 0) || !(mapPlacement?.depth > 0)) {
    return null;
  }
  const [p0, p1, p2] = calibrationPoints;
  if (![p0, p1, p2].every(entry => asPoint(entry?.vacuum) && asPoint(entry?.map))) {
    return null;
  }
  const v1x = p1.vacuum.x - p0.vacuum.x;
  const v1y = p1.vacuum.y - p0.vacuum.y;
  const v2x = p2.vacuum.x - p0.vacuum.x;
  const v2y = p2.vacuum.y - p0.vacuum.y;
  const det = v1x * v2y - v1y * v2x;
  if (Math.abs(det) < 1e-8) {
    return null;
  }
  const dx = point.x - p0.vacuum.x;
  const dy = point.y - p0.vacuum.y;
  const u = (dx * v2y - dy * v2x) / det;
  const v = (v1x * dy - v1y * dx) / det;
  const mapX = p0.map.x + u * (p1.map.x - p0.map.x) + v * (p2.map.x - p0.map.x);
  const mapY = p0.map.y + u * (p1.map.y - p0.map.y) + v * (p2.map.y - p0.map.y);
  const localX = (mapX / imageSize.width - 0.5) * mapPlacement.width;
  const localY = (mapY / imageSize.height - 0.5) * mapPlacement.depth;
  const radians = (mapPlacement.rotation || 0) * Math.PI / 180;
  return {
    x: (mapPlacement.x || 0) + localX * Math.cos(radians) - localY * Math.sin(radians),
    y: (mapPlacement.y || 0) + localX * Math.sin(radians) + localY * Math.cos(radians)
  };
}
export function vacuumTelemetry(binding, states, imageSize) {
  if (binding.map?.sourceMapId && !vacuumBindingsForMap([binding], states).length) {
    return null;
  }
  const entityState = states[binding.entityId]?.newState || states[binding.entityId];
  const presentation = vacuumStatusPresentation(binding, states);
  const mapState = states[binding.map?.entityId];
  const mapAttrs = (mapState?.newState || mapState)?.attributes || {};
  const charger = asPoint(mapAttrs.charger_position);
  const robot = asPoint(mapAttrs.vacuum_position || mapAttrs.robot_position);
  if (!presentation.available || !charger || !imageSize) {
    return null;
  }
  const docked = ["docked", "charging", "charging_completed"].includes(entityState?.state) || entityState?.attributes?.charging === true;
  const activePoint = docked ? charger : robot;
  const chargerWorld = vacuumMapPoint(charger, mapAttrs.calibration_points, imageSize, binding.map);
  const robotWorld = vacuumMapPoint(activePoint, mapAttrs.calibration_points, imageSize, binding.map);
  if (!chargerWorld || !robotWorld) {
    return null;
  }
  const headingAt = pose => {
    if (!isFiniteNumber(pose?.a)) {
      return null;
    }
    const radians = pose.a * Math.PI / 180;
    const origin = vacuumMapPoint(pose, mapAttrs.calibration_points, imageSize, binding.map);
    const ahead = vacuumMapPoint({
      x: pose.x + Math.cos(radians) * 100,
      y: pose.y + Math.sin(radians) * 100
    }, mapAttrs.calibration_points, imageSize, binding.map);
    if (origin && ahead) {
      return Math.atan2(ahead.y - origin.y, ahead.x - origin.x);
    } else {
      return null;
    }
  };
  const robotHeading = headingAt(activePoint);
  const chargerHeading = headingAt(charger);
  return {
    x: robotWorld.x - chargerWorld.x,
    y: robotWorld.y - chargerWorld.y,
    angle: robotHeading !== null && chargerHeading !== null ? Math.atan2(Math.sin(robotHeading - chargerHeading), Math.cos(robotHeading - chargerHeading)) : 0,
    docked,
    paused: entityState?.state === "paused",
    active: presentation.active
  };
}
export const VACUUM_CHAT = {
  working: ["我真勤快！", "主人真懒，还好有我。", "好累啊，再坚持一小会儿。", "灰尘别跑，我来啦！", "今天也在认真营业。", "这一片，交给我！"],
  returning: ["电量告急，回家吃饭！", "打工结束，回窝充电。", "基站，我回来啦！"],
  washing: ["洗个拖布，继续加油。", "爱干净，也要洗洗自己。"]
};
export function vacuumQuip(binding, states, nowMs) {
  if (binding.funMessages === false) {
    return "";
  }
  const entityState = states[binding.entityId]?.newState || states[binding.entityId];
  const attrs = entityState?.attributes || {};
  const lines = entityState?.state === "returning" || attrs.returning ? VACUUM_CHAT.returning : attrs.washing || attrs.drying ? VACUUM_CHAT.washing : VACUUM_CHAT.working;
  return lines[Math.floor(nowMs / 7000) % lines.length];
}
export function createVacuumMotion(host, requestRender) {
  const {
    THREE
  } = host;
  const entries = new Map();
  const imageSizes = new Map();
  let bindings = [];
  let states = {};
  let enabled = false;
  let disposed = false;
  const findModel = binding => {
    let found;
    host.modelRoot?.traverse(node => {
      if (node.userData?.environmentFloorId === binding.floorId && node.userData?.environmentModelId === binding.modelId) {
        found = node;
      }
    });
    return found;
  };
  function createEntry(modelNode, binding) {
    modelNode.updateWorldMatrix(true, true);
    const inverseWorld = modelNode.matrixWorld.clone().invert();
    const bodyMeshes = [];
    const item = host.document.floors.find(floor => floor.id === binding.floorId)?.scene.items.find(sceneItem => sceneItem.id === binding.modelId);
    const modelHeight = item?.height || 0.85;
    const modelDepth = item?.depth || 0.5;
    modelNode.traverse(mesh => {
      if (!mesh.isMesh || !mesh.geometry || mesh.userData?.environmentEffect) {
        return;
      }
      mesh.geometry.computeBoundingBox();
      const localBounds = mesh.geometry.boundingBox?.clone().applyMatrix4(inverseWorld.clone().multiply(mesh.matrixWorld));
      if (localBounds && localBounds.max.y < modelHeight * 0.3 && localBounds.getCenter(new THREE.Vector3()).z > modelDepth * 0.05) {
        bodyMeshes.push(mesh);
      }
    });
    if (!bodyMeshes.length) {
      return null;
    }
    const bodyBounds = new THREE.Box3();
    bodyMeshes.forEach(mesh => bodyBounds.expandByObject(mesh));
    const localCenter = modelNode.worldToLocal(bodyBounds.getCenter(new THREE.Vector3()));
    localCenter.y = 0;
    const mobile = new THREE.Group();
    mobile.name = "vacuum-mobile-body";
    mobile.position.copy(localCenter);
    modelNode.add(mobile);
    modelNode.updateWorldMatrix(true, true);
    const originals = bodyMeshes.map(mesh => ({
      mesh,
      parent: mesh.parent,
      position: mesh.position.clone(),
      quaternion: mesh.quaternion.clone(),
      scale: mesh.scale.clone()
    }));
    bodyMeshes.forEach(mesh => mobile.attach(mesh));
    const rest = mobile.position.clone();
    modelNode.userData.vacuumMobileRoot = mobile;
    return {
      model: modelNode,
      mobile,
      rest,
      originals,
      x: 0,
      y: 0,
      angle: 0,
      target: null,
      initialized: false
    };
  }
  function disposeEntry(entry) {
    for (const original of entry.originals) {
      original.parent.add(original.mesh);
      original.mesh.position.copy(original.position);
      original.mesh.quaternion.copy(original.quaternion);
      original.mesh.scale.copy(original.scale);
    }
    entry.mobile.removeFromParent();
    delete entry.model.userData.vacuumMobileRoot;
    host.invalidateReflections?.([entry.item.floorId]);
    host.setVacuumMoving?.(true);
    host.requestRender?.();
  }
  function mapImageSize(binding) {
    const entityId = binding.map?.entityId;
    if (!entityId || !mapSource(entityId)) {
      return null;
    }
    const mapState = states[entityId];
    const mapAttrs = (mapState?.newState || mapState)?.attributes || {};
    if (!mapAttrs.calibration_points || !mapAttrs.charger_position) {
      return null;
    }
    const key = JSON.stringify([entityId, mapAttrs.calibration_points]);
    let cache = imageSizes.get(entityId);
    if (cache?.key === key && (!cache.retryAt || performance.now() < cache.retryAt)) {
      return cache.size;
    }
    const failures = cache?.key === key && cache.failures || 0;
    if (cache) {
      clearTimeout(cache.timer);
      cache.image.onload = cache.image.onerror = null;
      cache.image.src = "";
    }
    const image = new Image();
    cache = {
      key,
      image,
      size: null,
      failures,
      retryAt: 0,
      timer: null
    };
    imageSizes.set(entityId, cache);
    image.onload = () => {
      if (!disposed && imageSizes.get(entityId) === cache) {
        clearTimeout(cache.timer);
        cache.timer = null;
        cache.retryAt = 0;
        cache.failures = 0;
        cache.size = {
          width: image.naturalWidth,
          height: image.naturalHeight
        };
        refreshTargets();
        requestRender();
      }
    };
    image.onerror = () => {
      if (disposed || imageSizes.get(entityId) !== cache) {
        return;
      }
      const delayMs = Math.min(5000, 2 ** Math.min(cache.failures++, 3) * 1000);
      cache.retryAt = performance.now() + delayMs;
      cache.timer = setTimeout(() => {
        cache.timer = null;
        if (!disposed && enabled && imageSizes.get(entityId) === cache) {
          cache.retryAt = performance.now();
          refreshTargets();
          requestRender();
        }
      }, delayMs);
    };
    image.src = mapSource(entityId);
    return null;
  }
  function refreshTargets() {
    for (const binding of bindings) {
      if (binding.motionEnabled === false || binding.visible === false || !enabled) {
        continue;
      }
      const modelNode = findModel(binding);
      let entry = entries.get(binding.id);
      if (entry?.model !== modelNode) {
        if (entry) {
          disposeEntry(entry);
        }
        entries.delete(binding.id);
        entry = null;
      }
      if (!modelNode) {
        continue;
      }
      const telemetry = vacuumTelemetry(binding, states, mapImageSize(binding));
      if (!telemetry) {
        if (entry) {
          entry.target = null;
        }
        continue;
      }
      if (!entry) {
        entry = createEntry(modelNode, binding);
        if (!entry) {
          continue;
        }
        entries.set(binding.id, entry);
      }
      entry.item = binding;
      if (telemetry.paused) {
        entry.target = null;
        continue;
      }
      if (entry.target?.x !== telemetry.x || entry.target?.y !== telemetry.y || entry.target?.angle !== telemetry.angle) {
        entry.target = telemetry;
        if (!entry.initialized) {
          entry.x = telemetry.x;
          entry.y = telemetry.y;
          entry.angle = telemetry.angle;
          entry.initialized = true;
          entry.dirty = true;
        }
      }
    }
  }
  return {
    sync(nextBindings, nextStates, nextEnabled) {
      bindings = nextBindings;
      states = nextStates;
      enabled = nextEnabled && !disposed;
      const activeIds = new Set(nextBindings.filter(binding => binding.motionEnabled !== false && binding.visible !== false).map(binding => binding.id));
      for (const [id, entry] of entries) {
        if (!activeIds.has(id) || !enabled) {
          disposeEntry(entry);
          entries.delete(id);
        }
      }
      if (enabled) {
        refreshTargets();
      } else {
        host.setVacuumMoving?.(false);
      }
    },
    offset(id) {
      const entry = entries.get(id.replace(/^vacuum:/, ""));
      if (entry) {
        return {
          x: entry.x,
          y: entry.y
        };
      } else {
        return null;
      }
    },
    worldPosition(id) {
      const entry = entries.get(id.replace(/^vacuum:/, ""));
      if (entry) {
        return entry.mobile.getWorldPosition(new THREE.Vector3());
      } else {
        return null;
      }
    },
    tick(deltaSeconds) {
      if (!enabled) {
        return false;
      }
      let moving = false;
      let posed = false;
      for (const entry of entries.values()) {
        const target = entry.target;
        if (!target) {
          continue;
        }
        let dx = target.x - entry.x;
        let dy = target.y - entry.y;
        let distance = Math.hypot(dx, dy);
        if (host.worldPoint(entry.item.floorId, target.x, target.y, 0)?.distanceTo(host.worldPoint(entry.item.floorId, entry.x, entry.y, 0)) > 2.5) {
          entry.x = target.x;
          entry.y = target.y;
          dx = dy = distance = 0;
          entry.dirty = true;
        }
        const blend = 1 - Math.exp(-Math.min(deltaSeconds, 0.1) * 5);
        entry.x += dx * blend;
        entry.y += dy * blend;
        let angleDelta = Math.atan2(Math.sin(target.angle - entry.angle), Math.cos(target.angle - entry.angle));
        entry.angle += angleDelta * blend;
        if (distance > 0.02 || Math.abs(angleDelta) > 0.002) {
          moving = true;
        } else {
          entry.x = target.x;
          entry.y = target.y;
          entry.angle = target.angle;
        }
        if (distance < 0.000001 && Math.abs(angleDelta) < 0.000001 && !entry.dirty) {
          continue;
        }
        entry.dirty = false;
        posed = true;
        const origin = host.worldPoint(entry.item.floorId, 0, 0, 0);
        const world = host.worldPoint(entry.item.floorId, entry.x, entry.y, 0);
        if (!origin || !world) {
          continue;
        }
        entry.model.updateWorldMatrix(true, false);
        const restWorld = entry.model.localToWorld(entry.rest.clone());
        const nextWorld = restWorld.add(world.sub(origin));
        entry.mobile.position.copy(entry.model.worldToLocal(nextWorld));
        entry.mobile.rotation.y = -entry.angle;
        entry.mobile.updateWorldMatrix(true, true);
        host.invalidateReflections?.([entry.item.floorId]);
      }
      host.setVacuumMoving?.(moving || posed);
      if (posed) {
        host.requestRender?.();
      }
      return moving || posed;
    },
    hasTracking(id) {
      return entries.has(id.replace(/^vacuum:/, ""));
    },
    dispose() {
      disposed = true;
      for (const entry of entries.values()) {
        disposeEntry(entry);
      }
      entries.clear();
      for (const cache of imageSizes.values()) {
        clearTimeout(cache.timer);
        cache.image.onload = cache.image.onerror = null;
        cache.image.src = "";
      }
      imageSizes.clear();
      host.setVacuumMoving?.(false);
    }
  };
}
export function vacuumBirdCamera(camera, target) {
  const offsetX = (camera?.position?.[0] || 0) - (camera?.target?.[0] || 0);
  const offsetZ = (camera?.position?.[2] || 1) - (camera?.target?.[2] || 0);
  const length = Math.hypot(offsetX, offsetZ) || 1;
  return {
    ...camera,
    mode: "perspective",
    position: [target[0] + offsetX / length * 2.5, target[1] + 6, target[2] + offsetZ / length * 2.5],
    target: [...target],
    up: [0, 1, 0],
    zoom: 1,
    focalLength: 40,
    frameSize: 5
  };
}
export function vacuumFollowPose(camera, target) {
  return {
    ...camera,
    target: [...target],
    position: camera.position.map((coord, index) => target[index] + coord - camera.target[index])
  };
}
export function createVacuumFollowCamera(THREE) {
  const raycaster = new THREE.Raycaster();
  const occluders = new Map();
  let modelRoot = null;
  let sceneRevision = null;
  let focusKey = "";
  let meshes = [];
  function ensureMeshes(host, focus) {
    const nextFocusKey = JSON.stringify([focus.floorId, focus.modelId]);
    if (modelRoot !== host.modelRoot || sceneRevision !== host.sceneRevision || focusKey !== nextFocusKey) {
      reset();
      modelRoot = host.modelRoot;
      sceneRevision = host.sceneRevision;
      focusKey = nextFocusKey;
      meshes = [];
      modelRoot?.traverse(mesh => {
        if (!!mesh.isMesh && !!mesh.geometry) {
          for (let node = mesh; node; node = node.parent) {
            if (node.userData?.environmentEffect || node.userData?.environmentFloorId === focus.floorId && node.userData?.environmentModelId === focus.modelId) {
              return;
            }
          }
          meshes.push(mesh);
        }
      });
    }
  }
  function reset() {
    for (const [mesh, entry] of occluders) {
      if (mesh.material === entry.replacement) {
        mesh.material = entry.original;
      }
      entry.clones.forEach(clone => clone.dispose());
    }
    occluders.clear();
  }
  function reveal(host, focus, cameraWorld, targetWorld) {
    ensureMeshes(host, focus);
    const hitMeshes = new Set();
    for (const [offsetX, offsetZ] of [[0, 0], [0.18, 0], [-0.18, 0], [0, 0.18], [0, -0.18]]) {
      const sample = cameraWorld.clone().add(new THREE.Vector3(offsetX, 0, offsetZ));
      const direction = sample.sub(targetWorld);
      const distance = direction.length();
      raycaster.set(targetWorld, direction.normalize());
      raycaster.near = 0;
      raycaster.far = Math.max(0, distance - 0.015);
      for (const hit of raycaster.intersectObjects(meshes, false)) {
        let isVisible = true;
        for (let parent = hit.object; parent; parent = parent.parent) {
          if (!parent.visible) {
            isVisible = false;
          }
        }
        if (isVisible) {
          hitMeshes.add(hit.object);
        }
      }
    }
    for (const [mesh, entry] of occluders) {
      if (!hitMeshes.has(mesh)) {
        if (mesh.material === entry.replacement) {
          mesh.material = entry.original;
        }
        entry.clones.forEach(clone => clone.dispose());
        occluders.delete(mesh);
      }
    }
    for (const mesh of hitMeshes) {
      let entry = occluders.get(mesh);
      if (!entry) {
        const original = mesh.material;
        const materials = Array.isArray(original) ? original : [original];
        const clones = materials.map(material => material.clone());
        entry = {
          original,
          clones,
          replacement: Array.isArray(original) ? clones : clones[0]
        };
        occluders.set(mesh, entry);
        mesh.material = entry.replacement;
      }
      const originals = Array.isArray(entry.original) ? entry.original : [entry.original];
      entry.clones.forEach((clone, index) => {
        clone.copy(originals[index]);
        clone.transparent = true;
        clone.opacity = Math.min(originals[index].opacity, 0.1);
        clone.depthWrite = false;
      });
    }
  }
  return {
    reset,
    reveal
  };
}
