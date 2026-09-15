export function vacuumMapIdentity(mapEntityEntry, vacuumEntityEntry) {
  const mapIdentityAttributes = (mapEntityEntry?.newState || mapEntityEntry)?.attributes || {};
  const vacuumIdentityAttributes =
    (vacuumEntityEntry?.newState || vacuumEntityEntry)?.attributes || {};
  const isUsableIdValue = idValue =>
    (typeof idValue == "string" && idValue) ||
    (typeof idValue == "number" && Number.isFinite(idValue));
  for (const savedMapIdCandidate of [
    mapIdentityAttributes.saved_map_id,
    mapIdentityAttributes.selected_map_id,
    vacuumIdentityAttributes.selected_map_id
  ]) {
    if (isUsableIdValue(savedMapIdCandidate)) {
      return "saved:" + savedMapIdCandidate;
    }
  }
  if (isUsableIdValue(mapIdentityAttributes.map_index)) {
    return "index:" + mapIdentityAttributes.map_index;
  }
  for (const mapIdKey of ["map_id", "current_map_id", "map_index", "selected_map_id"]) {
    const mapIdValue = mapIdentityAttributes[mapIdKey];
    if (
      (typeof mapIdValue == "string" && mapIdValue) ||
      (typeof mapIdValue == "number" && Number.isFinite(mapIdValue))
    ) {
      return String(mapIdValue);
    }
  }
  return "";
}
export function vacuumBindingsForMap(bindings, statesByEntityId) {
  return bindings.flatMap(binding => {
    const mapEntityState = statesByEntityId[binding.map?.entityId];
    const vacuumEntityState = statesByEntityId[binding.entityId];
    const mapAttributes = (mapEntityState?.newState || mapEntityState)?.attributes || {};
    const vacuumStateAttributes =
      (vacuumEntityState?.newState || vacuumEntityState)?.attributes || {};
    const mapIdentity = vacuumMapIdentity(mapEntityState, vacuumEntityState);
    const sourceMapId = binding.map?.sourceMapId;
    const hasSiblingBinding = bindings.some(
      sibling =>
        sibling !== binding &&
        sibling.floorId !== binding.floorId &&
        sibling.entityId === binding.entityId &&
        sibling.map?.entityId === binding.map?.entityId
    );
    if (!sourceMapId) {
      if (hasSiblingBinding) {
        return [];
      } else {
        return [binding];
      }
    }
    if (sourceMapId === mapIdentity) {
      return [binding];
    }
    const isPlainSourceMapId = !sourceMapId.includes(":");
    if (
      isPlainSourceMapId &&
      String(mapAttributes.map_id ?? mapAttributes.current_map_id ?? "") === sourceMapId
    ) {
      return [binding];
    } else if (
      isPlainSourceMapId &&
      !hasSiblingBinding &&
      vacuumStateAttributes.multi_floor_map === false &&
      mapIdentity.startsWith("saved:")
    ) {
      return [
        {
          ...binding,
          map: {
            ...binding.map,
            sourceMapId: mapIdentity
          }
        }
      ];
    } else {
      return [];
    }
  });
}
export function mapCorners(mapConfig) {
  const rotationRad = ((mapConfig.rotation || 0) * Math.PI) / 180;
  const cosRotation = Math.cos(rotationRad);
  const sinRotation = Math.sin(rotationRad);
  return [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5]
  ].map(([unitX, unitY]) => ({
    x: mapConfig.x + unitX * mapConfig.width * cosRotation - unitY * mapConfig.depth * sinRotation,
    y: mapConfig.y + unitX * mapConfig.width * sinRotation + unitY * mapConfig.depth * cosRotation
  }));
}
export function mapSource(entityId, cacheBustTimestamp = Date.now()) {
  if (/^(camera|image)\.[a-z0-9_]+$/.test(entityId || "")) {
    return (
      "/api/" +
      (entityId.startsWith("camera.") ? "camera" : "image") +
      "_proxy/" +
      encodeURIComponent(entityId) +
      "?hb=" +
      encodeURIComponent(cacheBustTimestamp) +
      (entityId.startsWith("camera.") ? "&hb_live=1" : "")
    );
  } else {
    return "";
  }
}
export function createVacuumMaps(sceneContext, requestRender) {
  const { THREE: THREE } = sceneContext;
  const entriesByItemId = new Map();
  let isActive = false;
  let isDisposed = false;
  let refreshTimerId = null;
  let cachedSelectionKey = "";
  let refreshIntervalMs = 5000;
  let lastLoadTimestamp = -Infinity;
  let nextRefreshAt = Infinity;
  const buildRevisionKey = (keyItem, revisionStates) => {
    const revisionMapState = revisionStates[keyItem.map?.entityId];
    const mapState = revisionMapState?.newState || revisionMapState || {};
    const revisionAttributes = mapState.attributes || {};
    const revisionVacuumState = revisionStates[keyItem.entityId];
    const vacuumState = revisionVacuumState?.newState || revisionVacuumState || {};
    return JSON.stringify([
      mapState.state,
      mapState.last_updated,
      revisionAttributes.entity_picture,
      revisionAttributes.image_last_updated,
      revisionAttributes.vacuum_position,
      revisionAttributes.robot_position,
      revisionAttributes.charger_position,
      vacuumState.state,
      vacuumState.last_updated
    ]);
  };
  function scheduleRefreshIn(delayMs) {
    if (!isActive || isDisposed || document.hidden || !entriesByItemId.size) {
      return;
    }
    const scheduledAt = performance.now() + delayMs;
    if (refreshTimerId === null || !(nextRefreshAt <= scheduledAt)) {
      clearTimeout(refreshTimerId);
      nextRefreshAt = scheduledAt;
      refreshTimerId = setTimeout(loadVisibleMaps, delayMs);
    }
  }
  const rescheduleRefresh = () =>
    scheduleRefreshIn(Math.max(0, 1000 - (performance.now() - lastLoadTimestamp)));
  const prefersReducedMotion = () =>
    globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const cancelImageLoad = loadingEntry => {
    loadingEntry.generation++;
    if (loadingEntry.image) {
      loadingEntry.image.onload = loadingEntry.image.onerror = null;
      if (loadingEntry.loading) {
        loadingEntry.image.src = "";
      }
    }
    loadingEntry.loading = false;
  };
  const disposeMapEntry = disposalTarget => {
    cancelImageLoad(disposalTarget);
    disposalTarget.mesh.removeFromParent();
    disposalTarget.mesh.geometry.dispose();
    disposalTarget.mesh.material.map?.dispose();
    disposalTarget.mesh.material.dispose();
  };
  function positionMesh(positionedEntry) {
    const worldCorners = mapCorners(positionedEntry.map).map(corner =>
      sceneContext.worldPoint(positionedEntry.floorId, corner.x, corner.y, positionedEntry.height)
    );
    if (worldCorners.some(validCorner => !validCorner)) {
      return false;
    }
    const positionAttribute = positionedEntry.mesh.geometry.attributes.position;
    worldCorners.forEach((cornerPoint, cornerIndex) =>
      positionAttribute.setXYZ(cornerIndex, cornerPoint.x, cornerPoint.y, cornerPoint.z)
    );
    positionAttribute.needsUpdate = true;
    positionedEntry.mesh.geometry.computeBoundingBox();
    positionedEntry.mesh.geometry.computeBoundingSphere();
    return true;
  }
  function applyVisibility(visibilityEntry) {
    visibilityEntry.mesh.visible =
      isActive && visibilityEntry.positioned && !!visibilityEntry.mesh.material.map;
    if (visibilityEntry.mesh.visible) {
      visibilityEntry.mesh.material.opacity = prefersReducedMotion() ? visibilityEntry.opacity : 0;
      visibilityEntry.fadeStart = null;
      visibilityEntry.fading = visibilityEntry.mesh.material.opacity < visibilityEntry.opacity;
    }
  }
  function loadVisibleMaps() {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
    nextRefreshAt = Infinity;
    if (!!isActive && !isDisposed && !document.hidden) {
      for (const refreshEntry of entriesByItemId.values()) {
        if (refreshEntry.loading) {
          continue;
        }
        refreshEntry.loading = true;
        refreshEntry.pending = false;
        lastLoadTimestamp = performance.now();
        const generation = ++refreshEntry.generation;
        const mapImage = new Image();
        refreshEntry.image = mapImage;
        mapImage.onload = () => {
          if (isDisposed || !isActive || generation !== refreshEntry.generation) {
            return;
          }
          refreshEntry.loading = false;
          const hadTexture = !!refreshEntry.mesh.material.map;
          refreshEntry.mesh.material.map?.dispose();
          const texture = new THREE.Texture(mapImage);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          refreshEntry.mesh.material.map = texture;
          refreshEntry.mesh.material.needsUpdate = true;
          if (!hadTexture) {
            applyVisibility(refreshEntry);
          }
          if (refreshEntry.pending) {
            rescheduleRefresh();
          }
          requestRender();
        };
        mapImage.onerror = () => {
          if (!isDisposed && !!isActive && generation === refreshEntry.generation) {
            refreshEntry.loading = false;
            if (!refreshEntry.mesh.material.map) {
              refreshEntry.mesh.visible = false;
            }
            if (refreshEntry.pending) {
              rescheduleRefresh();
            }
            requestRender();
          }
        };
        mapImage.src = mapSource(refreshEntry.entityId);
      }
      scheduleRefreshIn(refreshIntervalMs);
    }
  }
  return {
    sync(items, isEnabled, floorFilter, syncStates = {}) {
      if (!isEnabled || !!isDisposed || !!document.hidden) {
        if (isActive) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
          nextRefreshAt = Infinity;
          for (const hiddenEntry of entriesByItemId.values()) {
            cancelImageLoad(hiddenEntry);
            hiddenEntry.mesh.visible = false;
            hiddenEntry.fading = false;
          }
          requestRender();
        }
        isActive = false;
        return;
      }
      const wasInactive = !isActive;
      isActive = true;
      refreshIntervalMs = items.some(
        listedItem => vacuumStatusPresentation(listedItem, syncStates).active
      )
        ? 1000
        : 5000;
      const visibleItems = items.filter(
        candidateItem =>
          candidateItem.visible !== false &&
          candidateItem.modelAvailable !== false &&
          candidateItem.map?.visible !== false &&
          mapSource(candidateItem.map?.entityId) &&
          candidateItem.map.width > 0 &&
          candidateItem.map.depth > 0 &&
          (floorFilter === "all" || candidateItem.floorId === floorFilter)
      );
      const selectionKey = JSON.stringify([
        sceneContext.sceneRevision,
        floorFilter,
        visibleItems.map(mappedItem => [mappedItem.id, mappedItem.floorId, mappedItem.map])
      ]);
      const didSelectionChange = selectionKey !== cachedSelectionKey;
      if (didSelectionChange) {
        for (const staleEntry of entriesByItemId.values()) {
          disposeMapEntry(staleEntry);
        }
        entriesByItemId.clear();
        cachedSelectionKey = selectionKey;
        visibleItems.forEach((visibleItem, itemIndex) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(new Float32Array(12), 3)
          );
          geometry.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2)
          );
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
          const mapMesh = new THREE.Mesh(geometry, material);
          mapMesh.name = "vacuum-map-overlay";
          mapMesh.userData.environmentEffect = true;
          mapMesh.raycast = () => {};
          mapMesh.visible = false;
          sceneContext.overlayScene.add(mapMesh);
          const mapEntry = {
            mesh: mapMesh,
            image: null,
            entityId: visibleItem.map.entityId,
            generation: 0,
            loading: false,
            revision: buildRevisionKey(visibleItem, syncStates),
            pending: false,
            floorId: visibleItem.floorId,
            map: visibleItem.map,
            height: 0.025 + itemIndex * 0.001,
            opacity: (visibleItem.map.opacity ?? 45) / 100,
            fading: false
          };
          mapEntry.positioned = positionMesh(mapEntry);
          entriesByItemId.set(visibleItem.id, mapEntry);
        });
      } else if (wasInactive) {
        for (const restoredEntry of entriesByItemId.values()) {
          restoredEntry.positioned = positionMesh(restoredEntry);
          applyVisibility(restoredEntry);
        }
      }
      let hasPendingRevision = false;
      for (const changedItem of visibleItems) {
        const existingEntry = entriesByItemId.get(changedItem.id);
        const revisionKey = buildRevisionKey(changedItem, syncStates);
        if (existingEntry && existingEntry.revision !== revisionKey) {
          existingEntry.revision = revisionKey;
          existingEntry.pending = true;
          hasPendingRevision = true;
        }
      }
      if (didSelectionChange || wasInactive) {
        loadVisibleMaps();
        requestRender();
      } else if (hasPendingRevision) {
        rescheduleRefresh();
      } else {
        scheduleRefreshIn(refreshIntervalMs);
      }
    },
    tick(timestampMs) {
      if (!isActive || isDisposed) {
        return false;
      }
      let isFading = false;
      let didFade = false;
      for (const fadingEntry of entriesByItemId.values()) {
        if (fadingEntry.fading) {
          if (fadingEntry.fadeStart === null) {
            fadingEntry.fadeStart = timestampMs;
          }
          const fadeRatio = prefersReducedMotion()
            ? 1
            : Math.max(0, Math.min(1, (timestampMs - fadingEntry.fadeStart) / 280));
          const fadeOpacity = fadingEntry.opacity * fadeRatio * fadeRatio * (3 - fadeRatio * 2);
          didFade ||= fadingEntry.mesh.material.opacity !== fadeOpacity;
          fadingEntry.mesh.material.opacity = fadeOpacity;
          fadingEntry.fading = fadeRatio < 1;
          isFading ||= fadingEntry.fading;
        }
      }
      if (didFade) {
        requestRender();
      }
      return isFading;
    },
    dispose() {
      isDisposed = true;
      isActive = false;
      clearTimeout(refreshTimerId);
      for (const disposedEntry of entriesByItemId.values()) {
        disposeMapEntry(disposedEntry);
      }
      entriesByItemId.clear();
    }
  };
}
export function vacuumStatusPresentation(statusBinding, statusStates = {}) {
  const resolveEntityState = entityEntry => entityEntry?.newState || entityEntry || null;
  const vacuumStateEntry = resolveEntityState(statusStates[statusBinding.entityId]);
  const vacuumAttributes = vacuumStateEntry?.attributes || {};
  const stateText = String(vacuumStateEntry?.state || "unknown");
  const isAvailable = !["unknown", "unavailable"].includes(stateText);
  let statusLabel =
    {
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
    }[String(vacuumAttributes.vacuum_state || stateText)] || stateText;
  if (isAvailable) {
    if (vacuumAttributes.washing) {
      statusLabel = vacuumAttributes.washing_paused ? "清洗已暂停" : "清洗拖布";
    } else if (vacuumAttributes.drying) {
      statusLabel = "烘干拖布";
    } else if (vacuumAttributes.returning) {
      statusLabel = "回充中";
    } else if (vacuumAttributes.mapping) {
      statusLabel = "建图中";
    }
  }
  const relatedSensors = (statusBinding.relatedEntityIds || [])
    .filter(relatedEntityId => relatedEntityId.startsWith("sensor."))
    .map(sensorEntityId => ({
      id: sensorEntityId,
      state: resolveEntityState(statusStates[sensorEntityId])
    }));
  const batterySensor =
    relatedSensors.find(
      batteryCandidate => batteryCandidate.state?.attributes?.device_class === "battery"
    ) ||
    relatedSensors.find(
      batteryNameCandidate =>
        /(?:^|[._])battery(?:_|$)/.test(batteryNameCandidate.id) &&
        !/filter|brush|mop|life|consumable/.test(batteryNameCandidate.id)
    );
  const parseBatteryPercent = rawBatteryValue =>
    rawBatteryValue == null ||
    String(rawBatteryValue).trim() === "" ||
    !Number.isFinite(parseFloat(rawBatteryValue))
      ? null
      : Math.max(0, Math.min(100, parseFloat(rawBatteryValue)));
  const batteryPercent = isAvailable
    ? ([
        vacuumAttributes.battery_level,
        vacuumAttributes.battery_percentage,
        vacuumAttributes.battery,
        batterySensor?.state?.state
      ]
        .map(parseBatteryPercent)
        .find(percentValue => percentValue !== null) ?? null)
    : null;
  return {
    status: statusLabel,
    battery: batteryPercent === null ? "电量 —" : Math.round(batteryPercent) + "%",
    available: isAvailable,
    active:
      isAvailable &&
      (["cleaning", "sweeping", "mopping", "returning", "washing", "drying", "mapping"].includes(
        stateText
      ) ||
        !!vacuumAttributes.running ||
        !!vacuumAttributes.washing ||
        !!vacuumAttributes.drying ||
        !!vacuumAttributes.returning ||
        !!vacuumAttributes.mapping)
  };
}
