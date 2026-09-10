import { createWalker, animateWalker, disposeWalker } from "./presence-character.js";
import { validPresenceRoute, createPresenceTriggers, closedPath, sampleClosedPath, presenceVisibleOnPage } from "./presence-motion.js";
export function createPresenceScene(api, wake = () => {}, getNow) {
  const walkers = new Map();
  const progressCache = new Map();
  let elapsed = 0;
  const triggers = createPresenceTriggers(getNow);
  const footWorld = new api.THREE.Vector3();
  const removeWalker = id => {
    const entry = walkers.get(id);
    progressCache.set(id, {
      key: entry.progressKey,
      distance: entry.distance
    });
    disposeWalker(entry.root);
    if (entry.routeLine) {
      entry.routeLine.geometry.dispose();
      entry.routeLine.material.dispose();
      entry.routeLine.removeFromParent();
    }
    walkers.delete(id);
  };
  function placeWalker(entry) {
    const sample = sampleClosedPath(entry.path, entry.distance);
    if (!sample) {
      return;
    }
    entry.root.position.set(sample.x, sample.y, sample.z);
    entry.root.rotation.y = sample.heading;
    animateWalker(entry.root, entry.distance / entry.size * 12, entry.preview ? 0 : 1, elapsed);
    entry.root.updateMatrixWorld(true);
    const lowestFootY = Math.min(...entry.root.userData.parts.legs.map(leg => {
      leg.foot.getWorldPosition(footWorld);
      return footWorld.y - entry.root.userData.soleHeight * entry.size;
    }));
    entry.root.position.y += sample.y + entry.size * 0.014 - lowestFootY;
  }
  function hitRects(camera, canvas, sensors) {
    const rect = canvas.getBoundingClientRect();
    const results = [];
    for (const [id, entry] of walkers) {
      const sensor = sensors.find(item => item.id === id);
      if (!sensor?.clickToFocus) {
        continue;
      }
      const box = new api.THREE.Box3().setFromObject(entry.root);
      const projected = [];
      for (const x of [box.min.x, box.max.x]) {
        for (const y of [box.min.y, box.max.y]) {
          for (const z of [box.min.z, box.max.z]) {
            projected.push(new api.THREE.Vector3(x, y, z).project(camera));
          }
        }
      }
      if (projected.every(point => point.z < -1 || point.z > 1)) {
        continue;
      }
      const screenXs = projected.map(point => rect.left + (point.x + 1) * rect.width / 2);
      const screenYs = projected.map(point => rect.top + (1 - point.y) * rect.height / 2);
      const left = Math.min(...screenXs);
      const top = Math.min(...screenYs);
      const width = Math.max(...screenXs) - left;
      const height = Math.max(...screenYs) - top;
      const padding = sensor.hitPadding ?? 8;
      results.push({
        id,
        left,
        top,
        width,
        height,
        padding
      });
    }
    return results;
  }
  return {
    sync(sensors = [], states = {}, visible = false, floorId = "all", simulated = false, previewWalk = false, page = "overview") {
      triggers.sync(sensors, states);
      const keepIds = new Set();
      let changed = false;
      if (api.overlayScene && api.worldPoint) {
        for (const sensor of sensors) {
          if (sensor.routeClosed === false || !simulated && !sensor.entityId || !validPresenceRoute(sensor.route) || !visible || floorId !== "all" && sensor.floorId !== floorId || !simulated && (!triggers.visible(sensor.id) || !presenceVisibleOnPage(sensor, page))) {
            continue;
          }
          const worldRoute = sensor.route.map(point => api.worldPoint(sensor.floorId, point.x, point.y, 0));
          if (worldRoute.some(point => !point || ![point.x, point.y, point.z].every(Number.isFinite))) {
            continue;
          }
          const signature = JSON.stringify([sensor, worldRoute, simulated, previewWalk]);
          let entry = walkers.get(sensor.id);
          if (entry && entry.signature !== signature) {
            removeWalker(sensor.id);
            entry = null;
          }
          if (!entry) {
            const root = createWalker(api.THREE, sensor.color === "orange" ? 15376452 : 5421233, sensor.character);
            const materials = new Set();
            root.traverse(object => {
              if (object.isMesh) {
                materials.add(object.material);
              }
            });
            for (const material of materials) {
              if (!material.emissive?.getHex()) {
                material.emissive.copy(material.color);
                material.emissiveIntensity = 0.55;
              }
            }
            const size = sensor.size ?? 1;
            root.scale.setScalar(size);
            root.userData.presenceId = sensor.id;
            api.overlayScene.add(root);
            const progressKey = JSON.stringify([sensor.entityId, sensor.floorId, sensor.route, simulated]);
            const cached = progressCache.get(sensor.id);
            entry = {
              root,
              size,
              path: closedPath(worldRoute),
              distance: cached?.key === progressKey ? cached.distance : 0,
              progressKey,
              speed: sensor.speed ?? 0.45,
              signature,
              simulated,
              preview: simulated && !previewWalk
            };
            if (simulated) {
              const linePoints = [...worldRoute, worldRoute[0]].map(point => new api.THREE.Vector3(point.x, point.y + 0.025, point.z));
              entry.routeLine = new api.THREE.Line(new api.THREE.BufferGeometry().setFromPoints(linePoints), new api.THREE.LineBasicMaterial({
                color: sensor.color === "orange" ? 15376452 : 5421233,
                depthTest: true
              }));
              entry.routeLine.name = "presence-route-preview";
              api.overlayScene.add(entry.routeLine);
            }
            walkers.set(sensor.id, entry);
            placeWalker(entry);
            changed = true;
          }
          keepIds.add(sensor.id);
        }
      }
      for (const id of walkers.keys()) {
        if (!keepIds.has(id)) {
          removeWalker(id);
          changed = true;
        }
      }
      for (const id of progressCache.keys()) {
        if (!sensors.some(sensor => sensor.id === id) || !simulated && !triggers.visible(id)) {
          progressCache.delete(id);
        }
      }
      if (changed) {
        api.requestRender?.();
        wake();
      }
    },
    tick(dt) {
      const delta = Math.max(0, Math.min(0.1, Number(dt) || 0));
      elapsed += delta;
      let removed = false;
      for (const id of walkers.keys()) {
        if (!walkers.get(id).simulated && !triggers.visible(id)) {
          removeWalker(id);
          progressCache.delete(id);
          removed = true;
        }
      }
      for (const entry of walkers.values()) {
        if (!entry.preview) {
          entry.distance = (entry.distance + delta * entry.speed) % entry.path.length;
          placeWalker(entry);
        }
      }
      const hasLive = [...walkers.values()].some(entry => !entry.preview);
      if (hasLive || removed) {
        api.requestRender?.();
      }
      return hasLive;
    },
    anchor(id) {
      const entry = walkers.get(id);
      if (entry) {
        return {
          center: [entry.root.position.x, entry.root.position.y + entry.size * 0.7, entry.root.position.z]
        };
      } else {
        return null;
      }
    },
    hitRects,
    pick(clientX, clientY, camera, canvas, sensors) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return null;
      }
      const focusable = [...walkers.entries()].filter(([id]) => sensors.find(sensor => sensor.id === id)?.clickToFocus === true);
      const raycaster = new api.THREE.Raycaster();
      raycaster.setFromCamera(new api.THREE.Vector2((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2), camera);
      for (const [, entry] of focusable) {
        entry.root.updateMatrixWorld(true);
      }
      const hits = raycaster.intersectObjects(focusable.map(([, entry]) => entry.root), true);
      if (hits.length) {
        return focusable.find(([, entry]) => {
          let parent = hits[0].object;
          while (parent) {
            if (parent === entry.root) {
              return true;
            }
            parent = parent.parent;
          }
          return false;
        })?.[0] || null;
      }
      const paddedHits = [];
      for (const {
        id,
        left,
        top,
        width,
        height,
        padding
      } of hitRects(camera, canvas, sensors)) {
        if (!padding) {
          continue;
        }
        const dx = Math.max(left - clientX, 0, clientX - left - width);
        const dy = Math.max(top - clientY, 0, clientY - top - height);
        if (Math.hypot(dx, dy) <= padding) {
          paddedHits.push({
            id,
            distance: Math.hypot(dx, dy)
          });
        }
      }
      return paddedHits.sort((a, b) => a.distance - b.distance)[0]?.id || null;
    },
    dispose() {
      for (const id of walkers.keys()) {
        removeWalker(id);
      }
      progressCache.clear();
    }
  };
}
