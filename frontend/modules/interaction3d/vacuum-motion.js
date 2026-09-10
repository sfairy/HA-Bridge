import { mapSource, vacuumStatusPresentation, vacuumBindingsForMap } from "./vacuum-map.js?v=20260909-curtain-action-v15";
const S = arg12 => typeof arg12 == "number" && Number.isFinite(arg12);
const z = x5 => x5 && S(x5.x) && S(x5.y) ? x5 : null;
export function vacuumMapPoint(x6, length2, width, width2) {
  if (!z(x6) || !Array.isArray(length2) || length2.length < 3 || !(width?.width > 0) || !(width?.height > 0) || !(width2?.width > 0) || !(width2?.depth > 0)) {
    return null;
  }
  const [vacuum2, vacuum3, vacuum4] = length2;
  if (![vacuum2, vacuum3, vacuum4].every(vacuum => z(vacuum?.vacuum) && z(vacuum?.map))) {
    return null;
  }
  const value26 = vacuum3.vacuum.x - vacuum2.vacuum.x;
  const value27 = vacuum3.vacuum.y - vacuum2.vacuum.y;
  const value28 = vacuum4.vacuum.x - vacuum2.vacuum.x;
  const value29 = vacuum4.vacuum.y - vacuum2.vacuum.y;
  const value30 = value26 * value29 - value27 * value28;
  if (Math.abs(value30) < 1e-8) {
    return null;
  }
  const value31 = x6.x - vacuum2.vacuum.x;
  const value32 = x6.y - vacuum2.vacuum.y;
  const value33 = (value31 * value29 - value32 * value28) / value30;
  const value34 = (value26 * value32 - value27 * value31) / value30;
  const value35 = vacuum2.map.x + value33 * (vacuum3.map.x - vacuum2.map.x) + value34 * (vacuum4.map.x - vacuum2.map.x);
  const value36 = vacuum2.map.y + value33 * (vacuum3.map.y - vacuum2.map.y) + value34 * (vacuum4.map.y - vacuum2.map.y);
  const value37 = (value35 / width.width - 0.5) * width2.width;
  const value38 = (value36 / width.height - 0.5) * width2.depth;
  const value39 = (width2.rotation || 0) * Math.PI / 180;
  return {
    x: (width2.x || 0) + value37 * Math.cos(value39) - value38 * Math.sin(value39),
    y: (width2.y || 0) + value37 * Math.sin(value39) + value38 * Math.cos(value39)
  };
}
export function vacuumTelemetry(map3, arg13, arg14) {
  if (map3.map?.sourceMapId && !vacuumBindingsForMap([map3], arg13).length) {
    return null;
  }
  const state = arg13[map3.entityId]?.newState || arg13[map3.entityId];
  const available = vacuumStatusPresentation(map3, arg13);
  const newState2 = arg13[map3.map?.entityId];
  const calibration_points2 = (newState2?.newState || newState2)?.attributes || {};
  const value40 = z(calibration_points2.charger_position);
  const value41 = z(calibration_points2.vacuum_position || calibration_points2.robot_position);
  if (!available.available || !value40 || !arg14) {
    return null;
  }
  const docked = ["docked", "charging", "charging_completed"].includes(state?.state) || state?.attributes?.charging === true;
  const value42 = docked ? value40 : value41;
  const x7 = vacuumMapPoint(value40, calibration_points2.calibration_points, arg14, map3.map);
  const x8 = vacuumMapPoint(value42, calibration_points2.calibration_points, arg14, map3.map);
  if (!x7 || !x8) {
    return null;
  }
  const value43 = a => {
    if (!S(a?.a)) {
      return null;
    }
    const value16 = a.a * Math.PI / 180;
    const y = vacuumMapPoint(a, calibration_points2.calibration_points, arg14, map3.map);
    const y2 = vacuumMapPoint({
      x: a.x + Math.cos(value16) * 100,
      y: a.y + Math.sin(value16) * 100
    }, calibration_points2.calibration_points, arg14, map3.map);
    if (y && y2) {
      return Math.atan2(y2.y - y.y, y2.x - y.x);
    } else {
      return null;
    }
  };
  const value44 = value43(value42);
  const value45 = value43(value40);
  return {
    x: x8.x - x7.x,
    y: x8.y - x7.y,
    angle: value44 !== null && value45 !== null ? Math.atan2(Math.sin(value44 - value45), Math.cos(value44 - value45)) : 0,
    docked,
    paused: state?.state === "paused",
    active: available.active
  };
}
export const VACUUM_CHAT = {
  working: ["我真勤快！", "主人真懒，还好有我。", "好累啊，再坚持一小会儿。", "灰尘别跑，我来啦！", "今天也在认真营业。", "这一片，交给我！"],
  returning: ["电量告急，回家吃饭！", "打工结束，回窝充电。", "基站，我回来啦！"],
  washing: ["洗个拖布，继续加油。", "爱干净，也要洗洗自己。"]
};
export function vacuumQuip(entityId, arg15, arg16) {
  if (entityId.funMessages === false) {
    return "";
  }
  const attributes = arg15[entityId.entityId]?.newState || arg15[entityId.entityId];
  const returning = attributes?.attributes || {};
  const length3 = attributes?.state === "returning" || returning.returning ? VACUUM_CHAT.returning : returning.washing || returning.drying ? VACUUM_CHAT.washing : VACUUM_CHAT.working;
  return length3[Math.floor(arg16 / 7000) % length3.length];
}
export function createVacuumMotion(setVacuumMoving, arg17) {
  const {
    THREE: Vector3
  } = setVacuumMoving;
  const items = new Map();
  const get2 = new Map();
  let value46 = [];
  let value47 = {};
  let value48 = false;
  let value49 = false;
  const value50 = floorId => {
    let value17;
    setVacuumMoving.modelRoot?.traverse(userData2 => {
      if (userData2.userData?.environmentFloorId === floorId.floorId && userData2.userData?.environmentModelId === floorId.modelId) {
        value17 = userData2;
      }
    });
    return value17;
  };
  function fn(updateWorldMatrix, floorId2) {
    updateWorldMatrix.updateWorldMatrix(true, true);
    const clone2 = updateWorldMatrix.matrixWorld.clone().invert();
    const forEach = [];
    const height = setVacuumMoving.document.floors.find(id => id.id === floorId2.floorId)?.scene.items.find(id3 => id3.id === floorId2.modelId);
    const value22 = height?.height || 0.85;
    const value23 = height?.depth || 0.5;
    updateWorldMatrix.traverse(geometry => {
      if (!geometry.isMesh || !geometry.geometry || geometry.userData?.environmentEffect) {
        return;
      }
      geometry.geometry.computeBoundingBox();
      const max = geometry.geometry.boundingBox?.clone().applyMatrix4(clone2.clone().multiply(geometry.matrixWorld));
      if (max && max.max.y < value22 * 0.3 && max.getCenter(new Vector3.Vector3()).z > value23 * 0.05) {
        forEach.push(geometry);
      }
    });
    if (!forEach.length) {
      return null;
    }
    const expandByObject = new Vector3.Box3();
    forEach.forEach(arg2 => expandByObject.expandByObject(arg2));
    const y3 = updateWorldMatrix.worldToLocal(expandByObject.getCenter(new Vector3.Vector3()));
    y3.y = 0;
    const position = new Vector3.Group();
    position.name = "vacuum-mobile-body";
    position.position.copy(y3);
    updateWorldMatrix.add(position);
    updateWorldMatrix.updateWorldMatrix(true, true);
    const originals = forEach.map(mesh => ({
      mesh,
      parent: mesh.parent,
      position: mesh.position.clone(),
      quaternion: mesh.quaternion.clone(),
      scale: mesh.scale.clone()
    }));
    forEach.forEach(arg3 => position.attach(arg3));
    const rest = position.position.clone();
    updateWorldMatrix.userData.vacuumMobileRoot = position;
    return {
      model: updateWorldMatrix,
      mobile: position,
      rest,
      originals,
      x: 0,
      y: 0,
      angle: 0,
      target: null,
      initialized: false
    };
  }
  function fn2(originals2) {
    for (const mesh2 of originals2.originals) {
      mesh2.parent.add(mesh2.mesh);
      mesh2.mesh.position.copy(mesh2.position);
      mesh2.mesh.quaternion.copy(mesh2.quaternion);
      mesh2.mesh.scale.copy(mesh2.scale);
    }
    originals2.mobile.removeFromParent();
    delete originals2.model.userData.vacuumMobileRoot;
    setVacuumMoving.invalidateReflections?.([originals2.item.floorId]);
    setVacuumMoving.setVacuumMoving?.(true);
    setVacuumMoving.requestRender?.();
  }
  function fn3(map2) {
    const value24 = map2.map?.entityId;
    if (!value24 || !mapSource(value24)) {
      return null;
    }
    const newState = value47[value24];
    const calibration_points = (newState?.newState || newState)?.attributes || {};
    if (!calibration_points.calibration_points || !calibration_points.charger_position) {
      return null;
    }
    const key = JSON.stringify([value24, calibration_points.calibration_points]);
    let retryAt = get2.get(value24);
    if (retryAt?.key === key && (!retryAt.retryAt || performance.now() < retryAt.retryAt)) {
      return retryAt.size;
    }
    const failures = retryAt?.key === key && retryAt.failures || 0;
    if (retryAt) {
      clearTimeout(retryAt.timer);
      retryAt.image.onload = retryAt.image.onerror = null;
      retryAt.image.src = "";
    }
    const image2 = new Image();
    retryAt = {
      key,
      image: image2,
      size: null,
      failures,
      retryAt: 0,
      timer: null
    };
    get2.set(value24, retryAt);
    image2.onload = () => {
      if (!value49 && get2.get(value24) === retryAt) {
        clearTimeout(retryAt.timer);
        retryAt.timer = null;
        retryAt.retryAt = 0;
        retryAt.failures = 0;
        retryAt.size = {
          width: image2.naturalWidth,
          height: image2.naturalHeight
        };
        fn4();
        arg17();
      }
    };
    image2.onerror = () => {
      if (value49 || get2.get(value24) !== retryAt) {
        return;
      }
      const value9 = Math.min(5000, 2 ** Math.min(retryAt.failures++, 3) * 1000);
      retryAt.retryAt = performance.now() + value9;
      retryAt.timer = setTimeout(() => {
        retryAt.timer = null;
        if (!value49 && value48 && get2.get(value24) === retryAt) {
          retryAt.retryAt = performance.now();
          fn4();
          arg17();
        }
      }, value9);
    };
    image2.src = mapSource(value24);
    return null;
  }
  function fn4() {
    for (const id4 of value46) {
      if (id4.motionEnabled === false || id4.visible === false || !value48) {
        continue;
      }
      const value13 = value50(id4);
      let target = items.get(id4.id);
      if (target?.model !== value13) {
        if (target) {
          fn2(target);
        }
        items.delete(id4.id);
        target = null;
      }
      if (!value13) {
        continue;
      }
      const x3 = vacuumTelemetry(id4, value47, fn3(id4));
      if (!x3) {
        if (target) {
          target.target = null;
        }
        continue;
      }
      if (!target) {
        target = fn(value13, id4);
        if (!target) {
          continue;
        }
        items.set(id4.id, target);
      }
      target.item = id4;
      if (x3.paused) {
        target.target = null;
        continue;
      }
      if (target.target?.x !== x3.x || target.target?.y !== x3.y || target.target?.angle !== x3.angle) {
        target.target = x3;
        if (!target.initialized) {
          target.x = x3.x;
          target.y = x3.y;
          target.angle = x3.angle;
          target.initialized = true;
          target.dirty = true;
        }
      }
    }
  }
  return {
    sync(filter, arg6, arg7) {
      value46 = filter;
      value47 = arg6;
      value48 = arg7 && !value49;
      const has = new Set(filter.filter(motionEnabled => motionEnabled.motionEnabled !== false && motionEnabled.visible !== false).map(id2 => id2.id));
      for (const [value10, value11] of items) {
        if (!has.has(value10) || !value48) {
          fn2(value11);
          items.delete(value10);
        }
      }
      if (value48) {
        fn4();
      } else {
        setVacuumMoving.setVacuumMoving?.(false);
      }
    },
    offset(replace) {
      const x4 = items.get(replace.replace(/^vacuum:/, ""));
      if (x4) {
        return {
          x: x4.x,
          y: x4.y
        };
      } else {
        return null;
      }
    },
    worldPosition(replace2) {
      const mobile = items.get(replace2.replace(/^vacuum:/, ""));
      if (mobile) {
        return mobile.mobile.getWorldPosition(new Vector3.Vector3());
      } else {
        return null;
      }
    },
    tick(arg8) {
      if (!value48) {
        return false;
      }
      let value18 = false;
      let value19 = false;
      for (const x2 of items.values()) {
        const x = x2.target;
        if (!x) {
          continue;
        }
        let value = x.x - x2.x;
        let value2 = x.y - x2.y;
        let value3 = Math.hypot(value, value2);
        if (setVacuumMoving.worldPoint(x2.item.floorId, x.x, x.y, 0)?.distanceTo(setVacuumMoving.worldPoint(x2.item.floorId, x2.x, x2.y, 0)) > 2.5) {
          x2.x = x.x;
          x2.y = x.y;
          value = value2 = value3 = 0;
          x2.dirty = true;
        }
        const value4 = 1 - Math.exp(-Math.min(arg8, 0.1) * 5);
        x2.x += value * value4;
        x2.y += value2 * value4;
        let value5 = Math.atan2(Math.sin(x.angle - x2.angle), Math.cos(x.angle - x2.angle));
        x2.angle += value5 * value4;
        if (value3 > 0.02 || Math.abs(value5) > 0.002) {
          value18 = true;
        } else {
          x2.x = x.x;
          x2.y = x.y;
          x2.angle = x.angle;
        }
        if (value3 < 0.000001 && Math.abs(value5) < 0.000001 && !x2.dirty) {
          continue;
        }
        x2.dirty = false;
        value19 = true;
        const value6 = setVacuumMoving.worldPoint(x2.item.floorId, 0, 0, 0);
        const sub = setVacuumMoving.worldPoint(x2.item.floorId, x2.x, x2.y, 0);
        if (!value6 || !sub) {
          continue;
        }
        x2.model.updateWorldMatrix(true, false);
        const add = x2.model.localToWorld(x2.rest.clone());
        const value7 = add.add(sub.sub(value6));
        x2.mobile.position.copy(x2.model.worldToLocal(value7));
        x2.mobile.rotation.y = -x2.angle;
        x2.mobile.updateWorldMatrix(true, true);
        setVacuumMoving.invalidateReflections?.([x2.item.floorId]);
      }
      setVacuumMoving.setVacuumMoving?.(value18 || value19);
      if (value19) {
        setVacuumMoving.requestRender?.();
      }
      return value18 || value19;
    },
    hasTracking(replace3) {
      return items.has(replace3.replace(/^vacuum:/, ""));
    },
    dispose() {
      value49 = true;
      for (const value12 of items.values()) {
        fn2(value12);
      }
      items.clear();
      for (const image of get2.values()) {
        clearTimeout(image.timer);
        image.image.onload = image.image.onerror = null;
        image.image.src = "";
      }
      get2.clear();
      setVacuumMoving.setVacuumMoving?.(false);
    }
  };
}
export function vacuumBirdCamera(position2, arg18) {
  const value51 = (position2?.position?.[0] || 0) - (position2?.target?.[0] || 0);
  const value52 = (position2?.position?.[2] || 1) - (position2?.target?.[2] || 0);
  const value53 = Math.hypot(value51, value52) || 1;
  return {
    ...position2,
    mode: "perspective",
    position: [arg18[0] + value51 / value53 * 2.5, arg18[1] + 6, arg18[2] + value52 / value53 * 2.5],
    target: [...arg18],
    up: [0, 1, 0],
    zoom: 1,
    focalLength: 40,
    frameSize: 5
  };
}
export function vacuumFollowPose(position3, arg19) {
  return {
    ...position3,
    target: [...arg19],
    position: position3.position.map((arg4, arg5) => arg19[arg5] + arg4 - position3.target[arg5])
  };
}
export function createVacuumFollowCamera(Raycaster) {
  const set = new Raycaster.Raycaster();
  const clear = new Map();
  let traverse = null;
  let value54 = null;
  let value55 = "";
  let push = [];
  function fn5(modelRoot, floorId3) {
    const value25 = JSON.stringify([floorId3.floorId, floorId3.modelId]);
    if (traverse !== modelRoot.modelRoot || value54 !== modelRoot.sceneRevision || value55 !== value25) {
      reset();
      traverse = modelRoot.modelRoot;
      value54 = modelRoot.sceneRevision;
      value55 = value25;
      push = [];
      traverse?.traverse(isMesh => {
        if (!!isMesh.isMesh && !!isMesh.geometry) {
          for (let userData = isMesh; userData; userData = userData.parent) {
            if (userData.userData?.environmentEffect || userData.userData?.environmentFloorId === floorId3.floorId && userData.userData?.environmentModelId === floorId3.modelId) {
              return;
            }
          }
          push.push(isMesh);
        }
      });
    }
  }
  function reset() {
    for (const [material, replacement] of clear) {
      if (material.material === replacement.replacement) {
        material.material = replacement.original;
      }
      replacement.clones.forEach(dispose2 => dispose2.dispose());
    }
    clear.clear();
  }
  function reveal(arg9, arg10, clone3, arg11) {
    fn5(arg9, arg10);
    const add2 = new Set();
    for (const [value20, value21] of [[0, 0], [0.18, 0], [-0.18, 0], [0, 0.18], [0, -0.18]]) {
      const sub2 = clone3.clone().add(new Raycaster.Vector3(value20, 0, value21));
      const length = sub2.sub(arg11);
      const value14 = length.length();
      set.set(arg11, length.normalize());
      set.near = 0;
      set.far = Math.max(0, value14 - 0.015);
      for (const object of set.intersectObjects(push, false)) {
        let value8 = true;
        for (let parent = object.object; parent; parent = parent.parent) {
          if (!parent.visible) {
            value8 = false;
          }
        }
        if (value8) {
          add2.add(object.object);
        }
      }
    }
    for (const [material2, replacement2] of clear) {
      if (!add2.has(material2)) {
        if (material2.material === replacement2.replacement) {
          material2.material = replacement2.original;
        }
        replacement2.clones.forEach(dispose => dispose.dispose());
        clear.delete(material2);
      }
    }
    for (const material3 of add2) {
      let original2 = clear.get(material3);
      if (!original2) {
        const original = material3.material;
        const map = Array.isArray(original) ? original : [original];
        const clones = map.map(clone => clone.clone());
        original2 = {
          original,
          clones,
          replacement: Array.isArray(original) ? clones : clones[0]
        };
        clear.set(material3, original2);
        material3.material = original2.replacement;
      }
      const value15 = Array.isArray(original2.original) ? original2.original : [original2.original];
      original2.clones.forEach((copy, arg) => {
        copy.copy(value15[arg]);
        copy.transparent = true;
        copy.opacity = Math.min(value15[arg].opacity, 0.1);
        copy.depthWrite = false;
      });
    }
  }
  return {
    reset,
    reveal
  };
}
