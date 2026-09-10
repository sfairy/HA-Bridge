import { createWalker, animateWalker, disposeWalker } from "./presence-character.js";
import { validPresenceRoute, createPresenceTriggers, closedPath, sampleClosedPath, presenceVisibleOnPage } from "./presence-motion.js";
export function createPresenceScene(api, arg14 = () => {}, arg15) {
  const items = new Map();
  const entryMap = new Map();
  let value23 = 0;
  const visible = createPresenceTriggers(arg15);
  const y3 = new api.THREE.Vector3();
  const value24 = arg2 => {
    const routeLine2 = items.get(arg2);
    entryMap.set(arg2, {
      key: routeLine2.progressKey,
      distance: routeLine2.distance
    });
    disposeWalker(routeLine2.root);
    if (routeLine2.routeLine) {
      routeLine2.routeLine.geometry.dispose();
      routeLine2.routeLine.material.dispose();
      routeLine2.routeLine.removeFromParent();
    }
    items.delete(arg2);
  };
  function fn(root6) {
    const y2 = sampleClosedPath(root6.path, root6.distance);
    if (!y2) {
      return;
    }
    root6.root.position.set(y2.x, y2.y, y2.z);
    root6.root.rotation.y = y2.heading;
    animateWalker(root6.root, root6.distance / root6.size * 12, root6.preview ? 0 : 1, value23);
    root6.root.updateMatrixWorld(true);
    const value22 = Math.min(...root6.root.userData.parts.legs.map(foot => {
      foot.foot.getWorldPosition(y3);
      return y3.y - root6.root.userData.soleHeight * root6.size;
    }));
    root6.root.position.y += y2.y + root6.size * 0.014 - value22;
  }
  function hitRects(arg13, getBoundingClientRect2, find2) {
    const left2 = getBoundingClientRect2.getBoundingClientRect();
    const push2 = [];
    for (const [id6, root4] of items) {
      const clickToFocus = find2.find(id3 => id3.id === id6);
      if (!clickToFocus?.clickToFocus) {
        continue;
      }
      const min = new api.THREE.Box3().setFromObject(root4.root);
      const map = [];
      for (const value6 of [min.min.x, min.max.x]) {
        for (const value3 of [min.min.y, min.max.y]) {
          for (const value2 of [min.min.z, min.max.z]) {
            map.push(new api.THREE.Vector3(value6, value3, value2).project(arg13));
          }
        }
      }
      if (map.every(z => z.z < -1 || z.z > 1)) {
        continue;
      }
      const value16 = map.map(x4 => left2.left + (x4.x + 1) * left2.width / 2);
      const value17 = map.map(y => left2.top + (1 - y.y) * left2.height / 2);
      const left = Math.min(...value16);
      const top = Math.min(...value17);
      const width = Math.max(...value16) - left;
      const height = Math.max(...value17) - top;
      const padding = clickToFocus.hitPadding ?? 8;
      push2.push({
        id: id6,
        left,
        top,
        width,
        height,
        padding
      });
    }
    return push2;
  }
  return {
    sync(some2 = [], arg3 = {}, arg4 = false, arg5 = "all", simulated = false, arg6 = false, arg7 = "overview") {
      visible.sync(some2, arg3);
      const add2 = new Set();
      let value18 = false;
      if (api.overlayScene && api.worldPoint) {
        for (const id4 of some2) {
          if (id4.routeClosed === false || !simulated && !id4.entityId || !validPresenceRoute(id4.route) || !arg4 || arg5 !== "all" && id4.floorId !== arg5 || !simulated && (!visible.visible(id4.id) || !presenceVisibleOnPage(id4, arg7))) {
            continue;
          }
          const some = id4.route.map(x2 => api.worldPoint(id4.floorId, x2.x, x2.y, 0));
          if (some.some(x3 => !x3 || ![x3.x, x3.y, x3.z].every(Number.isFinite))) {
            continue;
          }
          const signature = JSON.stringify([id4, some, simulated, arg6]);
          let routeLine = items.get(id4.id);
          if (routeLine && routeLine.signature !== signature) {
            value24(id4.id);
            routeLine = null;
          }
          if (!routeLine) {
            const traverse = createWalker(api.THREE, id4.color === "orange" ? 15376452 : 5421233, id4.character);
            const add = new Set();
            traverse.traverse(isMesh => {
              if (isMesh.isMesh) {
                add.add(isMesh.material);
              }
            });
            for (const emissive of add) {
              if (!emissive.emissive?.getHex()) {
                emissive.emissive.copy(emissive.color);
                emissive.emissiveIntensity = 0.55;
              }
            }
            const size = id4.size ?? 1;
            traverse.scale.setScalar(size);
            traverse.userData.presenceId = id4.id;
            api.overlayScene.add(traverse);
            const progressKey = JSON.stringify([id4.entityId, id4.floorId, id4.route, simulated]);
            const key = entryMap.get(id4.id);
            routeLine = {
              root: traverse,
              size,
              path: closedPath(some),
              distance: key?.key === progressKey ? key.distance : 0,
              progressKey,
              speed: id4.speed ?? 0.45,
              signature,
              simulated,
              preview: simulated && !arg6
            };
            if (simulated) {
              const value = [...some, some[0]].map(x => new api.THREE.Vector3(x.x, x.y + 0.025, x.z));
              routeLine.routeLine = new api.THREE.Line(new api.THREE.BufferGeometry().setFromPoints(value), new api.THREE.LineBasicMaterial({
                color: id4.color === "orange" ? 15376452 : 5421233,
                depthTest: true
              }));
              routeLine.routeLine.name = "presence-route-preview";
              api.overlayScene.add(routeLine.routeLine);
            }
            items.set(id4.id, routeLine);
            fn(routeLine);
            value18 = true;
          }
          add2.add(id4.id);
        }
      }
      for (const value7 of items.keys()) {
        if (!add2.has(value7)) {
          value24(value7);
          value18 = true;
        }
      }
      for (const value8 of entryMap.keys()) {
        if (!some2.some(id2 => id2.id === value8) || !simulated && !visible.visible(value8)) {
          entryMap.delete(value8);
        }
      }
      if (value18) {
        api.requestRender?.();
        arg14();
      }
    },
    tick(arg8) {
      const value19 = Math.max(0, Math.min(0.1, Number(arg8) || 0));
      value23 += value19;
      let value20 = false;
      for (const value9 of items.keys()) {
        if (!items.get(value9).simulated && !visible.visible(value9)) {
          value24(value9);
          entryMap.delete(value9);
          value20 = true;
        }
      }
      for (const distance3 of items.values()) {
        if (!distance3.preview) {
          distance3.distance = (distance3.distance + value19 * distance3.speed) % distance3.path.length;
          fn(distance3);
        }
      }
      const value21 = [...items.values()].some(preview => !preview.preview);
      if (value21 || value20) {
        api.requestRender?.();
      }
      return value21;
    },
    anchor(arg9) {
      const root5 = items.get(arg9);
      if (root5) {
        return {
          center: [root5.root.position.x, root5.root.position.y + root5.size * 0.7, root5.root.position.z]
        };
      } else {
        return null;
      }
    },
    hitRects,
    pick(arg10, arg11, arg12, getBoundingClientRect, find) {
      const width2 = getBoundingClientRect.getBoundingClientRect();
      if (!width2.width || !width2.height) {
        return null;
      }
      const map2 = [...items.entries()].filter(([arg]) => find.find(id => id.id === arg)?.clickToFocus === true);
      const setFromCamera = new api.THREE.Raycaster();
      setFromCamera.setFromCamera(new api.THREE.Vector2((arg10 - width2.left) / width2.width * 2 - 1, 1 - (arg11 - width2.top) / width2.height * 2), arg12);
      for (const [, root3] of map2) {
        root3.root.updateMatrixWorld(true);
      }
      const length = setFromCamera.intersectObjects(map2.map(([, root2]) => root2.root), true);
      if (length.length) {
        return map2.find(([, root]) => {
          let parent = length[0].object;
          while (parent) {
            if (parent === root.root) {
              return true;
            }
            parent = parent.parent;
          }
          return false;
        })?.[0] || null;
      }
      const push = [];
      for (const {
        id: id5,
        left: value10,
        top: value11,
        width: value12,
        height: value13,
        padding: value14
      } of hitRects(arg12, getBoundingClientRect, find)) {
        if (!value14) {
          continue;
        }
        const value4 = Math.max(value10 - arg10, 0, arg10 - value10 - value12);
        const value5 = Math.max(value11 - arg11, 0, arg11 - value11 - value13);
        if (Math.hypot(value4, value5) <= value14) {
          push.push({
            id: id5,
            distance: Math.hypot(value4, value5)
          });
        }
      }
      return push.sort((distance, distance2) => distance.distance - distance2.distance)[0]?.id || null;
    },
    dispose() {
      for (const value15 of items.keys()) {
        value24(value15);
      }
      entryMap.clear();
    }
  };
}
