export function vacuumMapIdentity(newState6, newState7) {
  const map_index = (newState6?.newState || newState6)?.attributes || {};
  const selected_map_id = (newState7?.newState || newState7)?.attributes || {};
  const value19 = arg6 => typeof arg6 == "string" && arg6 || typeof arg6 == "number" && Number.isFinite(arg6);
  for (const value16 of [map_index.saved_map_id, map_index.selected_map_id, selected_map_id.selected_map_id]) {
    if (value19(value16)) {
      return "saved:" + value16;
    }
  }
  if (value19(map_index.map_index)) {
    return "index:" + map_index.map_index;
  }
  for (const value17 of ["map_id", "current_map_id", "map_index", "selected_map_id"]) {
    const value15 = map_index[value17];
    if (typeof value15 == "string" && value15 || typeof value15 == "number" && Number.isFinite(value15)) {
      return String(value15);
    }
  }
  return "";
}
export function vacuumBindingsForMap(flatMap, arg15) {
  return flatMap.flatMap(map3 => {
    const newState = arg15[map3.map?.entityId];
    const newState2 = arg15[map3.entityId];
    const map_id = (newState?.newState || newState)?.attributes || {};
    const multi_floor_map = (newState2?.newState || newState2)?.attributes || {};
    const startsWith2 = vacuumMapIdentity(newState, newState2);
    const includes = map3.map?.sourceMapId;
    const value7 = flatMap.some(floorId => floorId !== map3 && floorId.floorId !== map3.floorId && floorId.entityId === map3.entityId && floorId.map?.entityId === map3.map?.entityId);
    if (!includes) {
      if (value7) {
        return [];
      } else {
        return [map3];
      }
    }
    if (includes === startsWith2) {
      return [map3];
    }
    const value8 = !includes.includes(":");
    if (value8 && String(map_id.map_id ?? map_id.current_map_id ?? "") === includes) {
      return [map3];
    } else if (value8 && !value7 && multi_floor_map.multi_floor_map === false && startsWith2.startsWith("saved:")) {
      return [{
        ...map3,
        map: {
          ...map3.map,
          sourceMapId: startsWith2
        }
      }];
    } else {
      return [];
    }
  });
}
export function mapCorners(width) {
  const value20 = (width.rotation || 0) * Math.PI / 180;
  const value21 = Math.cos(value20);
  const value22 = Math.sin(value20);
  return [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([arg7, arg8]) => ({
    x: width.x + arg7 * width.width * value21 - arg8 * width.depth * value22,
    y: width.y + arg7 * width.width * value22 + arg8 * width.depth * value21
  }));
}
export function mapSource(startsWith3, arg16 = Date.now()) {
  if (/^(camera|image)\.[a-z0-9_]+$/.test(startsWith3 || "")) {
    return "/api/" + (startsWith3.startsWith("camera.") ? "camera" : "image") + "_proxy/" + encodeURIComponent(startsWith3) + "?hb=" + encodeURIComponent(arg16) + (startsWith3.startsWith("camera.") ? "&hb_live=1" : "");
  } else {
    return "";
  }
}
export function createVacuumMaps(worldPoint, arg17) {
  const {
    THREE: Float32BufferAttribute
  } = worldPoint;
  const values = new Map();
  let value23 = false;
  let value24 = false;
  let value25 = null;
  let value26 = "";
  let value27 = 5000;
  let value28 = -Infinity;
  let value29 = Infinity;
  const value30 = (map4, arg9) => {
    const newState3 = arg9[map4.map?.entityId];
    const attributes = newState3?.newState || newState3 || {};
    const entity_picture = attributes.attributes || {};
    const newState4 = arg9[map4.entityId];
    const state2 = newState4?.newState || newState4 || {};
    return JSON.stringify([attributes.state, attributes.last_updated, entity_picture.entity_picture, entity_picture.image_last_updated, entity_picture.vacuum_position, entity_picture.robot_position, entity_picture.charger_position, state2.state, state2.last_updated]);
  };
  function fn(arg14) {
    if (!value23 || value24 || document.hidden || !values.size) {
      return;
    }
    const value18 = performance.now() + arg14;
    if (value25 === null || !(value29 <= value18)) {
      clearTimeout(value25);
      value29 = value18;
      value25 = setTimeout(fn4, arg14);
    }
  }
  const value31 = () => fn(Math.max(0, 1000 - (performance.now() - value28)));
  const value32 = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const value33 = image => {
    image.generation++;
    if (image.image) {
      image.image.onload = image.image.onerror = null;
      if (image.loading) {
        image.image.src = "";
      }
    }
    image.loading = false;
  };
  const value34 = mesh3 => {
    value33(mesh3);
    mesh3.mesh.removeFromParent();
    mesh3.mesh.geometry.dispose();
    mesh3.mesh.material.map?.dispose();
    mesh3.mesh.material.dispose();
  };
  function fn2(mesh4) {
    const some2 = mapCorners(mesh4.map).map(x => worldPoint.worldPoint(mesh4.floorId, x.x, x.y, mesh4.height));
    if (some2.some(arg4 => !arg4)) {
      return false;
    }
    const setXYZ = mesh4.mesh.geometry.attributes.position;
    some2.forEach((x2, arg5) => setXYZ.setXYZ(arg5, x2.x, x2.y, x2.z));
    setXYZ.needsUpdate = true;
    mesh4.mesh.geometry.computeBoundingBox();
    mesh4.mesh.geometry.computeBoundingSphere();
    return true;
  }
  function fn3(mesh5) {
    mesh5.mesh.visible = value23 && mesh5.positioned && !!mesh5.mesh.material.map;
    if (mesh5.mesh.visible) {
      mesh5.mesh.material.opacity = value32() ? mesh5.opacity : 0;
      mesh5.fadeStart = null;
      mesh5.fading = mesh5.mesh.material.opacity < mesh5.opacity;
    }
  }
  function fn4() {
    clearTimeout(value25);
    value25 = null;
    value29 = Infinity;
    if (!!value23 && !value24 && !document.hidden) {
      for (const mesh2 of values.values()) {
        if (mesh2.loading) {
          continue;
        }
        mesh2.loading = true;
        mesh2.pending = false;
        value28 = performance.now();
        const value5 = ++mesh2.generation;
        const onload = new Image();
        mesh2.image = onload;
        onload.onload = () => {
          if (value24 || !value23 || value5 !== mesh2.generation) {
            return;
          }
          mesh2.loading = false;
          const value = !!mesh2.mesh.material.map;
          mesh2.mesh.material.map?.dispose();
          const colorSpace = new Float32BufferAttribute.Texture(onload);
          colorSpace.colorSpace = Float32BufferAttribute.SRGBColorSpace;
          colorSpace.needsUpdate = true;
          mesh2.mesh.material.map = colorSpace;
          mesh2.mesh.material.needsUpdate = true;
          if (!value) {
            fn3(mesh2);
          }
          if (mesh2.pending) {
            value31();
          }
          arg17();
        };
        onload.onerror = () => {
          if (!value24 && !!value23 && value5 === mesh2.generation) {
            mesh2.loading = false;
            if (!mesh2.mesh.material.map) {
              mesh2.mesh.visible = false;
            }
            if (mesh2.pending) {
              value31();
            }
            arg17();
          }
        };
        onload.src = mapSource(mesh2.entityId);
      }
      fn(value27);
    }
  }
  return {
    sync(some, arg10, arg11, arg12 = {}) {
      if (!arg10 || !!value24 || !!document.hidden) {
        if (value23) {
          clearTimeout(value25);
          value25 = null;
          value29 = Infinity;
          for (const mesh of values.values()) {
            value33(mesh);
            mesh.mesh.visible = false;
            mesh.fading = false;
          }
          arg17();
        }
        value23 = false;
        return;
      }
      const value9 = !value23;
      value23 = true;
      value27 = some.some(arg => vacuumStatusPresentation(arg, arg12).active) ? 1000 : 5000;
      const map5 = some.filter(map2 => map2.visible !== false && map2.modelAvailable !== false && map2.map?.visible !== false && mapSource(map2.map?.entityId) && map2.map.width > 0 && map2.map.depth > 0 && (arg11 === "all" || map2.floorId === arg11));
      const value10 = JSON.stringify([worldPoint.sceneRevision, arg11, map5.map(id => [id.id, id.floorId, id.map])]);
      const value11 = value10 !== value26;
      if (value11) {
        for (const value4 of values.values()) {
          value34(value4);
        }
        values.clear();
        value26 = value10;
        map5.forEach((map, arg2) => {
          const setAttribute = new Float32BufferAttribute.BufferGeometry();
          setAttribute.setAttribute("position", new Float32BufferAttribute.Float32BufferAttribute(new Float32Array(12), 3));
          setAttribute.setAttribute("uv", new Float32BufferAttribute.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
          setAttribute.setIndex([0, 2, 1, 0, 3, 2]);
          const value2 = new Float32BufferAttribute.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: Float32BufferAttribute.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
            toneMapped: false
          });
          const name = new Float32BufferAttribute.Mesh(setAttribute, value2);
          name.name = "vacuum-map-overlay";
          name.userData.environmentEffect = true;
          name.raycast = () => {};
          name.visible = false;
          worldPoint.overlayScene.add(name);
          const positioned = {
            mesh: name,
            image: null,
            entityId: map.map.entityId,
            generation: 0,
            loading: false,
            revision: value30(map, arg12),
            pending: false,
            floorId: map.floorId,
            map: map.map,
            height: 0.025 + arg2 * 0.001,
            opacity: (map.map.opacity ?? 45) / 100,
            fading: false
          };
          positioned.positioned = fn2(positioned);
          values.set(map.id, positioned);
        });
      } else if (value9) {
        for (const positioned2 of values.values()) {
          positioned2.positioned = fn2(positioned2);
          fn3(positioned2);
        }
      }
      let value12 = false;
      for (const id2 of map5) {
        const revision = values.get(id2.id);
        const revision2 = value30(id2, arg12);
        if (revision && revision.revision !== revision2) {
          revision.revision = revision2;
          revision.pending = true;
          value12 = true;
        }
      }
      if (value11 || value9) {
        fn4();
        arg17();
      } else if (value12) {
        value31();
      } else {
        fn(value27);
      }
    },
    tick(fadeStart) {
      if (!value23 || value24) {
        return false;
      }
      let value13 = false;
      let value14 = false;
      for (const fading of values.values()) {
        if (fading.fading) {
          if (fading.fadeStart === null) {
            fading.fadeStart = fadeStart;
          }
          const value3 = value32() ? 1 : Math.max(0, Math.min(1, (fadeStart - fading.fadeStart) / 280));
          const opacity = fading.opacity * value3 * value3 * (3 - value3 * 2);
          value14 ||= fading.mesh.material.opacity !== opacity;
          fading.mesh.material.opacity = opacity;
          fading.fading = value3 < 1;
          value13 ||= fading.fading;
        }
      }
      if (value14) {
        arg17();
      }
      return value13;
    },
    dispose() {
      value24 = true;
      value23 = false;
      clearTimeout(value25);
      for (const value6 of values.values()) {
        value34(value6);
      }
      values.clear();
    }
  };
}
export function vacuumStatusPresentation(entityId, arg18 = {}) {
  const value35 = newState5 => newState5?.newState || newState5 || null;
  const attributes2 = value35(arg18[entityId.entityId]);
  const washing = attributes2?.attributes || {};
  const value36 = String(attributes2?.state || "unknown");
  const available = !["unknown", "unavailable"].includes(value36);
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
  }[String(washing.vacuum_state || value36)] || value36;
  if (available) {
    if (washing.washing) {
      status = washing.washing_paused ? "清洗已暂停" : "清洗拖布";
    } else if (washing.drying) {
      status = "烘干拖布";
    } else if (washing.returning) {
      status = "回充中";
    } else if (washing.mapping) {
      status = "建图中";
    }
  }
  const find = (entityId.relatedEntityIds || []).filter(startsWith => startsWith.startsWith("sensor.")).map(id4 => ({
    id: id4,
    state: value35(arg18[id4])
  }));
  const state3 = find.find(state => state.state?.attributes?.device_class === "battery") || find.find(id3 => /(?:^|[._])battery(?:_|$)/.test(id3.id) && !/filter|brush|mop|life|consumable/.test(id3.id));
  const value37 = arg13 => arg13 == null || String(arg13).trim() === "" || !Number.isFinite(parseFloat(arg13)) ? null : Math.max(0, Math.min(100, parseFloat(arg13)));
  const value38 = available ? [washing.battery_level, washing.battery_percentage, washing.battery, state3?.state?.state].map(value37).find(arg3 => arg3 !== null) ?? null : null;
  return {
    status,
    battery: value38 === null ? "电量 —" : Math.round(value38) + "%",
    available,
    active: available && (["cleaning", "sweeping", "mopping", "returning", "washing", "drying", "mapping"].includes(value36) || !!washing.running || !!washing.washing || !!washing.drying || !!washing.returning || !!washing.mapping)
  };
}
