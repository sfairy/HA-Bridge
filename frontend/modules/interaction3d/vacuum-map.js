export function vacuumMapIdentity(cameraState, vacuumState) {
  const cameraAttrs = (cameraState?.newState || cameraState)?.attributes || {};
  const vacuumAttrs = (vacuumState?.newState || vacuumState)?.attributes || {};
  const isMapId = value => typeof value == "string" && value || typeof value == "number" && Number.isFinite(value);
  for (const candidate of [cameraAttrs.saved_map_id, cameraAttrs.selected_map_id, vacuumAttrs.selected_map_id]) {
    if (isMapId(candidate)) {
      return "saved:" + candidate;
    }
  }
  if (isMapId(cameraAttrs.map_index)) {
    return "index:" + cameraAttrs.map_index;
  }
  for (const key of ["map_id", "current_map_id", "map_index", "selected_map_id"]) {
    const candidate = cameraAttrs[key];
    if (typeof candidate == "string" && candidate || typeof candidate == "number" && Number.isFinite(candidate)) {
      return String(candidate);
    }
  }
  return "";
}
export function vacuumBindingsForMap(bindings, states) {
  return bindings.flatMap(binding => {
    const mapState = states[binding.map?.entityId];
    const vacuumState = states[binding.entityId];
    const mapAttrs = (mapState?.newState || mapState)?.attributes || {};
    const vacuumAttrs = (vacuumState?.newState || vacuumState)?.attributes || {};
    const identity = vacuumMapIdentity(mapState, vacuumState);
    const sourceMapId = binding.map?.sourceMapId;
    const sharesMapAcrossFloors = bindings.some(other => other !== binding && other.floorId !== binding.floorId && other.entityId === binding.entityId && other.map?.entityId === binding.map?.entityId);
    if (!sourceMapId) {
      if (sharesMapAcrossFloors) {
        return [];
      } else {
        return [binding];
      }
    }
    if (sourceMapId === identity) {
      return [binding];
    }
    const isPlainId = !sourceMapId.includes(":");
    if (isPlainId && String(mapAttrs.map_id ?? mapAttrs.current_map_id ?? "") === sourceMapId) {
      return [binding];
    } else if (isPlainId && !sharesMapAcrossFloors && vacuumAttrs.multi_floor_map === false && identity.startsWith("saved:")) {
      return [{
        ...binding,
        map: {
          ...binding.map,
          sourceMapId: identity
        }
      }];
    } else {
      return [];
    }
  });
}
export function mapCorners(map) {
  const radians = (map.rotation || 0) * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([u, v]) => ({
    x: map.x + u * map.width * cos - v * map.depth * sin,
    y: map.y + u * map.width * sin + v * map.depth * cos
  }));
}
export function mapSource(entityId, cacheBust = Date.now()) {
  if (/^(camera|image)\.[a-z0-9_]+$/.test(entityId || "")) {
    return "/api/" + (entityId.startsWith("camera.") ? "camera" : "image") + "_proxy/" + encodeURIComponent(entityId) + "?hb=" + encodeURIComponent(cacheBust) + (entityId.startsWith("camera.") ? "&hb_live=1" : "");
  } else {
    return "";
  }
}
export function createVacuumMaps(host, requestRender) {
  const {
    THREE
  } = host;
  const entries = new Map();
  let active = false;
  let disposed = false;
  let refreshTimer = null;
  let layoutSignature = "";
  let refreshIntervalMs = 5000;
  let lastFetchAt = -Infinity;
  let nextDueAt = Infinity;
  const revisionFor = (binding, states) => {
    const mapState = states[binding.map?.entityId];
    const mapRaw = mapState?.newState || mapState || {};
    const mapAttrs = mapRaw.attributes || {};
    const vacuumState = states[binding.entityId];
    const vacuumRaw = vacuumState?.newState || vacuumState || {};
    return JSON.stringify([mapRaw.state, mapRaw.last_updated, mapAttrs.entity_picture, mapAttrs.image_last_updated, mapAttrs.vacuum_position, mapAttrs.robot_position, mapAttrs.charger_position, vacuumRaw.state, vacuumRaw.last_updated]);
  };
  function scheduleRefresh(delayMs) {
    if (!active || disposed || document.hidden || !entries.size) {
      return;
    }
    const dueAt = performance.now() + delayMs;
    if (refreshTimer === null || !(nextDueAt <= dueAt)) {
      clearTimeout(refreshTimer);
      nextDueAt = dueAt;
      refreshTimer = setTimeout(fetchMaps, delayMs);
    }
  }
  const scheduleSoon = () => scheduleRefresh(Math.max(0, 1000 - (performance.now() - lastFetchAt)));
  const prefersReducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const cancelImageLoad = entry => {
    entry.generation++;
    if (entry.image) {
      entry.image.onload = entry.image.onerror = null;
      if (entry.loading) {
        entry.image.src = "";
      }
    }
    entry.loading = false;
  };
  const disposeEntry = entry => {
    cancelImageLoad(entry);
    entry.mesh.removeFromParent();
    entry.mesh.geometry.dispose();
    entry.mesh.material.map?.dispose();
    entry.mesh.material.dispose();
  };
  function positionEntry(entry) {
    const corners = mapCorners(entry.map).map(point => host.worldPoint(entry.floorId, point.x, point.y, entry.height));
    if (corners.some(point => !point)) {
      return false;
    }
    const positionAttr = entry.mesh.geometry.attributes.position;
    corners.forEach((point, index) => positionAttr.setXYZ(index, point.x, point.y, point.z));
    positionAttr.needsUpdate = true;
    entry.mesh.geometry.computeBoundingBox();
    entry.mesh.geometry.computeBoundingSphere();
    return true;
  }
  function applyVisibility(entry) {
    entry.mesh.visible = active && entry.positioned && !!entry.mesh.material.map;
    if (entry.mesh.visible) {
      entry.mesh.material.opacity = prefersReducedMotion() ? entry.opacity : 0;
      entry.fadeStart = null;
      entry.fading = entry.mesh.material.opacity < entry.opacity;
    }
  }
  function fetchMaps() {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    nextDueAt = Infinity;
    if (!!active && !disposed && !document.hidden) {
      for (const entry of entries.values()) {
        if (entry.loading) {
          continue;
        }
        entry.loading = true;
        entry.pending = false;
        lastFetchAt = performance.now();
        const generation = ++entry.generation;
        const image = new Image();
        entry.image = image;
        image.onload = () => {
          if (disposed || !active || generation !== entry.generation) {
            return;
          }
          entry.loading = false;
          const hadMap = !!entry.mesh.material.map;
          entry.mesh.material.map?.dispose();
          const texture = new THREE.Texture(image);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          entry.mesh.material.map = texture;
          entry.mesh.material.needsUpdate = true;
          if (!hadMap) {
            applyVisibility(entry);
          }
          if (entry.pending) {
            scheduleSoon();
          }
          requestRender();
        };
        image.onerror = () => {
          if (!disposed && !!active && generation === entry.generation) {
            entry.loading = false;
            if (!entry.mesh.material.map) {
              entry.mesh.visible = false;
            }
            if (entry.pending) {
              scheduleSoon();
            }
            requestRender();
          }
        };
        image.src = mapSource(entry.entityId);
      }
      scheduleRefresh(refreshIntervalMs);
    }
  }
  return {
    sync(bindings, enabled, floorFilter, states = {}) {
      if (!enabled || !!disposed || !!document.hidden) {
        if (active) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
          nextDueAt = Infinity;
          for (const entry of entries.values()) {
            cancelImageLoad(entry);
            entry.mesh.visible = false;
            entry.fading = false;
          }
          requestRender();
        }
        active = false;
        return;
      }
      const wasInactive = !active;
      active = true;
      refreshIntervalMs = bindings.some(binding => vacuumStatusPresentation(binding, states).active) ? 1000 : 5000;
      const visibleBindings = bindings.filter(binding => binding.visible !== false && binding.modelAvailable !== false && binding.map?.visible !== false && mapSource(binding.map?.entityId) && binding.map.width > 0 && binding.map.depth > 0 && (floorFilter === "all" || binding.floorId === floorFilter));
      const nextLayoutSignature = JSON.stringify([host.sceneRevision, floorFilter, visibleBindings.map(binding => [binding.id, binding.floorId, binding.map])]);
      const layoutChanged = nextLayoutSignature !== layoutSignature;
      if (layoutChanged) {
        for (const entry of entries.values()) {
          disposeEntry(entry);
        }
        entries.clear();
        layoutSignature = nextLayoutSignature;
        visibleBindings.forEach((binding, index) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(12), 3));
          geometry.setAttribute("uv", new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
          geometry.setIndex([0, 2, 1, 0, 3, 2]);
          const material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
            toneMapped: false
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.name = "vacuum-map-overlay";
          mesh.userData.environmentEffect = true;
          mesh.raycast = () => {};
          mesh.visible = false;
          host.overlayScene.add(mesh);
          const entry = {
            mesh,
            image: null,
            entityId: binding.map.entityId,
            generation: 0,
            loading: false,
            revision: revisionFor(binding, states),
            pending: false,
            floorId: binding.floorId,
            map: binding.map,
            height: 0.025 + index * 0.001,
            opacity: (binding.map.opacity ?? 45) / 100,
            fading: false
          };
          entry.positioned = positionEntry(entry);
          entries.set(binding.id, entry);
        });
      } else if (wasInactive) {
        for (const entry of entries.values()) {
          entry.positioned = positionEntry(entry);
          applyVisibility(entry);
        }
      }
      let needsRefresh = false;
      for (const binding of visibleBindings) {
        const entry = entries.get(binding.id);
        const revision = revisionFor(binding, states);
        if (entry && entry.revision !== revision) {
          entry.revision = revision;
          entry.pending = true;
          needsRefresh = true;
        }
      }
      if (layoutChanged || wasInactive) {
        fetchMaps();
        requestRender();
      } else if (needsRefresh) {
        scheduleSoon();
      } else {
        scheduleRefresh(refreshIntervalMs);
      }
    },
    tick(nowMs) {
      if (!active || disposed) {
        return false;
      }
      let stillFading = false;
      let opacityChanged = false;
      for (const entry of entries.values()) {
        if (entry.fading) {
          if (entry.fadeStart === null) {
            entry.fadeStart = nowMs;
          }
          const progress = prefersReducedMotion() ? 1 : Math.max(0, Math.min(1, (nowMs - entry.fadeStart) / 280));
          const opacity = entry.opacity * progress * progress * (3 - progress * 2);
          opacityChanged ||= entry.mesh.material.opacity !== opacity;
          entry.mesh.material.opacity = opacity;
          entry.fading = progress < 1;
          stillFading ||= entry.fading;
        }
      }
      if (opacityChanged) {
        requestRender();
      }
      return stillFading;
    },
    dispose() {
      disposed = true;
      active = false;
      clearTimeout(refreshTimer);
      for (const entry of entries.values()) {
        disposeEntry(entry);
      }
      entries.clear();
    }
  };
}
export function vacuumStatusPresentation(binding, states = {}) {
  const resolveState = raw => raw?.newState || raw || null;
  const entityState = resolveState(states[binding.entityId]);
  const attrs = entityState?.attributes || {};
  const rawState = String(entityState?.state || "unknown");
  const available = !["unknown", "unavailable"].includes(rawState);
  let status = {
    cleaning: "清扫中",
    sweeping: "扫地中",
    mopping: "拖地中",
    paused: "已暂停",
    returning: "回充中",
    docked: "已回充",
    charging: "充电中",
    charging_completed: "充电完成",
    idle: "待机",
    error: "设备异常",
    unavailable: "设备离线",
    unknown: "等待状态",
    washing: "清洗拖布",
    drying: "烘干拖布",
    mapping: "建图中"
  }[String(attrs.vacuum_state || rawState)] || rawState;
  if (available) {
    if (attrs.washing) {
      status = attrs.washing_paused ? "清洗已暂停" : "清洗拖布";
    } else if (attrs.drying) {
      status = "烘干拖布";
    } else if (attrs.returning) {
      status = "回充中";
    } else if (attrs.mapping) {
      status = "建图中";
    }
  }
  const relatedSensors = (binding.relatedEntityIds || []).filter(id => id.startsWith("sensor.")).map(id => ({
    id,
    state: resolveState(states[id])
  }));
  const batterySensor = relatedSensors.find(sensor => sensor.state?.attributes?.device_class === "battery") || relatedSensors.find(sensor => /(?:^|[._])battery(?:_|$)/.test(sensor.id) && !/filter|brush|mop|life|consumable/.test(sensor.id));
  const parseBattery = raw => raw == null || String(raw).trim() === "" || !Number.isFinite(parseFloat(raw)) ? null : Math.max(0, Math.min(100, parseFloat(raw)));
  const battery = available ? [attrs.battery_level, attrs.battery_percentage, attrs.battery, batterySensor?.state?.state].map(parseBattery).find(level => level !== null) ?? null : null;
  return {
    status,
    battery: battery === null ? "电量 —" : Math.round(battery) + "%",
    available,
    active: available && (["cleaning", "sweeping", "mopping", "returning", "washing", "drying", "mapping"].includes(rawState) || !!attrs.running || !!attrs.washing || !!attrs.drying || !!attrs.returning || !!attrs.mapping)
  };
}
