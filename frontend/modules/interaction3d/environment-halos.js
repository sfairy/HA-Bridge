export function outlineHull(points) {
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (origin, a, b) => (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0]);
  const buildHull = list => {
    const hull = [];
    for (const point of list) {
      while (hull.length > 1 && cross(hull.at(-2), hull.at(-1), point) <= 0) {
        hull.pop();
      }
      hull.push(point);
    }
    return hull;
  };
  return [...buildHull(sorted).slice(0, -1), ...buildHull(sorted.reverse()).slice(0, -1)];
}
export function createScreenOutlines({
  THREE,
  container,
  camera,
  getCamera
}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const strokePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const glowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const softPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svg.setAttribute("class", "i3d-model-outlines");
  svg.setAttribute("aria-hidden", "true");
  for (const [path, width, opacity] of [[glowPath, 10, 0.14], [softPath, 6, 0.22], [strokePath, 2.6, 0.48]]) {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#d5dedb");
    path.setAttribute("stroke-width", String(width));
    path.setAttribute("stroke-opacity", String(opacity));
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
  }
  glowPath.style.filter = "blur(2px)";
  softPath.style.filter = "blur(.8px)";
  svg.append(glowPath);
  svg.append(softPath);
  svg.append(strokePath);
  container.append(svg);
  let lastRoot;
  let lastCamera;
  let lastBindingsSignature = "";
  let outlineModels = [];
  let active = false;
  let lastViewKey = "";
  let resumeAt = 0;
  let lastCameraSignature = "";
  let pointCache = new WeakMap();
  const pulseAnimations = globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true ? [] : [glowPath, softPath, strokePath].map(path => path.animate?.([{
    opacity: 1
  }, {
    opacity: 0.3
  }, {
    opacity: 1
  }], {
    duration: 2200,
    iterations: 1 / 0,
    easing: "ease-in-out"
  })).filter(Boolean);
  let pulsePlaying = false;
  pulseAnimations.forEach(animation => animation.pause());
  function setPulsePlaying(nextPlaying) {
    if (pulsePlaying !== nextPlaying) {
      pulsePlaying = nextPlaying;
      for (const animation of pulseAnimations) {
        if (nextPlaying) {
          animation.currentTime = 0;
          animation.play();
        } else {
          animation.pause();
        }
      }
    }
  }
  const modelKey = binding => JSON.stringify([binding.floorId, binding.modelId]);
  const hullDirections = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        if (x || y || z) {
          hullDirections.push(new THREE.Vector3(x, y, z));
        }
      }
    }
  }
  function computeOutlinePoints(modelNode) {
    const bestPerDirection = hullDirections.map(() => ({
      score: -1 / 0,
      point: null
    }));
    const point = new THREE.Vector3();
    function accumulate(node, worldMatrix) {
      if (node.userData?.environmentEffect || node === modelNode.userData?.vacuumMobileRoot || node !== modelNode && node.visible === false || node !== modelNode && node.userData?.environmentModelId != null) {
        return;
      }
      const position = node.isMesh && node.geometry?.attributes?.position;
      if (position) {
        for (let index = 0; index < position.count; index++) {
          point.fromBufferAttribute(position, index).applyMatrix4(worldMatrix);
          hullDirections.forEach((direction, directionIndex) => {
            const score = point.dot(direction);
            if (score > bestPerDirection[directionIndex].score) {
              bestPerDirection[directionIndex] = {
                score,
                point: point.clone()
              };
            }
          });
        }
      }
      for (const child of node.children || []) {
        if (child.matrixAutoUpdate) {
          child.updateMatrix();
        }
        accumulate(child, new THREE.Matrix4().multiplyMatrices(worldMatrix, child.matrix));
      }
    }
    accumulate(modelNode, new THREE.Matrix4());
    return bestPerDirection.filter(entry => entry.point).map(entry => entry.point);
  }
  function sync(nextRoot, nextCamera, bindings, nextActive) {
    active = nextActive;
    const shouldResume = nextActive && performance.now() >= resumeAt;
    svg.style.opacity = shouldResume ? "1" : "0";
    setPulsePlaying(shouldResume);
    const bindingsSignature = JSON.stringify(bindings.map(modelKey));
    if (lastRoot === nextRoot && lastCamera === nextCamera && lastBindingsSignature === bindingsSignature) {
      return;
    }
    if (lastRoot !== nextRoot || lastCamera !== nextCamera) {
      pointCache = new WeakMap();
    }
    lastRoot = nextRoot;
    lastCamera = nextCamera;
    lastBindingsSignature = bindingsSignature;
    lastViewKey = "";
    const nodesByKey = new Map();
    lastRoot?.traverse(node => {
      if (!["wallac", "floorac", "airoutlet", "curtain", "nas", "tv", "robotvacuum", "camera", "presence"].includes(node.userData?.environmentModelType)) {
        return;
      }
      let floorId = node.userData.environmentFloorId;
      for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
        floorId = parent.userData.environmentFloorId;
      }
      nodesByKey.set(modelKey({
        floorId,
        modelId: node.userData.environmentModelId
      }), node);
    });
    outlineModels = bindings.flatMap(binding => {
      const modelNode = nodesByKey.get(modelKey(binding));
      return modelNode ? [modelNode] : [];
    });
  }
  function outlineTargets(modelNode) {
    if (modelNode.userData.environmentModelType === "curtain") {
      const panels = [];
      modelNode.traverse(child => {
        if (child.userData?.curtainMotionPanel) {
          panels.push(child);
        }
      });
      if (panels.length) {
        return panels;
      }
    }
    return modelNode.userData.vacuumMobileRoot ? [modelNode, modelNode.userData.vacuumMobileRoot] : [modelNode];
  }
  function cachedOutlinePoints(node) {
    const geometry = node.geometry;
    const mobile = node.userData?.vacuumMobileRoot;
    const cached = pointCache.get(node);
    if (cached && cached.geometry === geometry && cached.mobile === mobile) {
      return cached.points;
    }
    const points = computeOutlinePoints(node);
    pointCache.set(node, {
      geometry,
      mobile,
      points
    });
    return points;
  }
  function update() {
    if (!active || performance.now() < resumeAt) {
      return;
    }
    svg.style.transition = "opacity .18s linear";
    svg.style.opacity = "1";
    setPulsePlaying(true);
    const activeCamera = getCamera?.() || camera;
    activeCamera.updateMatrixWorld();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const visibleTargets = outlineModels.flatMap(outlineTargets).filter(node => {
      for (let current = node; current; current = current.parent) {
        if (current.visible === false) {
          return false;
        }
      }
      return true;
    }).map(node => ({
      model: node,
      points: cachedOutlinePoints(node)
    }));
    for (const target of visibleTargets) {
      target.model.updateWorldMatrix(true, false);
    }
    const viewKey = width + ":" + height + ":" + activeCamera.matrixWorld.elements + ":" + activeCamera.projectionMatrix.elements + ":" + visibleTargets.map(target => target.model.uuid + ":" + (target.model.geometry?.uuid || "") + ":" + target.model.matrixWorld.elements).join("|");
    if (viewKey === lastViewKey) {
      return;
    }
    lastViewKey = viewKey;
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    const projectedPoint = new THREE.Vector3();
    const pathData = visibleTargets.map(target => {
      const projected = target.points.map(point => {
        projectedPoint.copy(point).applyMatrix4(target.model.matrixWorld).project(activeCamera);
        return [(projectedPoint.x + 1) * width / 2, (1 - projectedPoint.y) * height / 2, projectedPoint.z];
      });
      if (projected.some(point => point[2] < -1 || point[2] > 1)) {
        return "";
      }
      const hull = outlineHull(projected);
      return hull.length > 2 ? "M" + hull.map(point => point[0].toFixed(1) + "," + point[1].toFixed(1)).join("L") + "Z" : "";
    }).join("");
    for (const path of [glowPath, softPath, strokePath]) {
      path.setAttribute("d", pathData);
    }
  }
  function pause() {
    setPulsePlaying(false);
    resumeAt = performance.now() + 120;
    svg.style.transition = "none";
    svg.style.opacity = "0";
  }
  return {
    sync,
    update,
    pause,
    cameraChanged() {
      if (!active) {
        return false;
      }
      const currentCamera = getCamera?.() || camera;
      const signature = currentCamera.matrixWorld.elements + ":" + currentCamera.projectionMatrix.elements;
      if (signature === lastCameraSignature) {
        return false;
      }
      lastCameraSignature = signature;
      pause();
      return true;
    },
    nextDelay() {
      return active && performance.now() < resumeAt ? Math.max(1, resumeAt - performance.now()) : 1 / 0;
    },
    dispose() {
      pulseAnimations.forEach(animation => animation.cancel());
      svg.remove();
      outlineModels = [];
    }
  };
}
export function createEnvironmentHalos({
  THREE,
  modeAmount: haloMode
}) {
  const entries = new Map();
  let root;
  let sceneRevision;
  let bindingsSignature;
  let visible = false;
  const modelKey = (floorId, modelId) => JSON.stringify([String(floorId ?? ""), String(modelId ?? "")]);
  const sharedGeometry = new THREE.PlaneGeometry(1, 1);
  function modelBounds(modelNode) {
    const box = new THREE.Box3();
    function accumulate(node, worldMatrix) {
      if (!node.userData?.environmentEffect && !node.userData?.curtainMotionRig && (node === modelNode || node.userData?.environmentModelId == null)) {
        if (node.isMesh && node.geometry?.attributes?.position) {
          if (!node.geometry.boundingBox) {
            node.geometry.computeBoundingBox();
          }
          box.union(node.geometry.boundingBox.clone().applyMatrix4(worldMatrix));
        }
        for (const child of node.children || []) {
          if (child.matrixAutoUpdate) {
            child.updateMatrix();
          }
          accumulate(child, new THREE.Matrix4().multiplyMatrices(worldMatrix, child.matrix));
        }
      }
    }
    accumulate(modelNode, new THREE.Matrix4());
    if (box.isEmpty()) {
      return null;
    } else {
      return box;
    }
  }
  function disposeEntry(entry) {
    entry.mesh.removeFromParent();
    entry.mesh.material.dispose();
  }
  function sync(nextRoot, bindings, revision, modelNodeMap) {
    const nextBindingsSignature = JSON.stringify(bindings.map(binding => [binding.id, binding.floorId, binding.modelId, binding.visible, binding.deviceKind]));
    if (root === nextRoot && sceneRevision === revision && bindingsSignature === nextBindingsSignature) {
      return;
    }
    root = nextRoot;
    sceneRevision = revision;
    bindingsSignature = nextBindingsSignature;
    const nodesByKey = modelNodeMap || new Map();
    if (!modelNodeMap && bindings.length) {
      root?.traverse(node => {
        if (node.userData?.environmentModelId == null) {
          return;
        }
        let floorId = node.userData.environmentFloorId;
        for (let parent = node.parent; floorId == null && parent; parent = parent.parent) {
          floorId = parent.userData.environmentFloorId;
        }
        nodesByKey.set(modelKey(floorId, node.userData.environmentModelId), node);
      });
    }
    const activeIds = new Set();
    for (const binding of bindings) {
      if (binding.visible === false) {
        continue;
      }
      const modelNode = nodesByKey.get(modelKey(binding.floorId, binding.modelId));
      if (!modelNode) {
        continue;
      }
      const bounds = modelBounds(modelNode);
      if (!bounds) {
        continue;
      }
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const rotateForOutlet = modelNode.userData.environmentModelType === "airoutlet" && size.z > size.x;
      const width = rotateForOutlet ? size.z : size.x;
      const height = size.y;
      if (!(width > 0) || !(height > 0)) {
        continue;
      }
      activeIds.add(binding.id);
      let entry = entries.get(binding.id);
      if (entry && entry.model !== modelNode) {
        disposeEntry(entry);
        entries.delete(binding.id);
        entry = null;
      }
      if (!entry) {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            haloMode,
            haloColor: {
              value: new THREE.Color(0, 0, 0)
            },
            haloSize: {
              value: new THREE.Vector2()
            },
            haloFeather: {
              value: 0
            },
            haloRects: {
              value: Array.from({
                length: 3
              }, () => new THREE.Vector4())
            },
            haloRectCount: {
              value: 1
            }
          },
          vertexShader: "varying vec2 vHaloUv; void main(){ vHaloUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
          fragmentShader: "varying vec2 vHaloUv;\n            uniform float haloMode, haloFeather;\n            uniform vec2 haloSize;\n            uniform vec3 haloColor;\n            uniform vec4 haloRects[3];\n            uniform int haloRectCount;\n            void main() {\n              vec2 p = (vHaloUv - 0.5) * (haloSize + vec2(haloFeather * 2.0));\n              float d = 10000.0;\n              for (int i = 0; i < 3; i++) {\n                if (i >= haloRectCount) break;\n                vec4 rect = haloRects[i];\n                float radius = min(rect.z, rect.w) * 0.18;\n                vec2 q = abs(p - rect.xy) - rect.zw + vec2(radius);\n                d = min(d, length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius);\n              }\n              float outer = 1.0 - smoothstep(0.0, haloFeather, max(d, 0.0));\n              // Fade monotonically away from the surface. A bright peak at\n              // the bounding edge reads as an illuminated frame, not soft spill.\n              float alpha = outer * outer * haloMode * 0.025;\n              if (alpha < 0.001) discard;\n              gl_FragColor = vec4(haloColor, alpha);\n              #include <colorspace_fragment>\n            }",
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          forceSinglePass: true,
          toneMapped: false
        });
        const mesh = new THREE.Mesh(sharedGeometry, material);
        mesh.name = "environment-halo-" + binding.id;
        Object.assign(mesh.userData, {
          environmentEffect: true,
          environmentHalo: true,
          externalModelSharedGeometry: true,
          externalModelSharedMaterial: true
        });
        mesh.raycast = () => {};
        mesh.visible = false;
        modelNode.add(mesh);
        entry = {
          model: modelNode,
          mesh
        };
        entries.set(binding.id, entry);
      }
      const feather = Math.max(0.025, Math.min(0.07, Math.min(width, height) * 0.15));
      entry.mesh.material.uniforms.haloSize.value.set(width, height);
      entry.mesh.material.uniforms.haloFeather.value = feather;
      entry.mesh.scale.set(width + feather * 2, height + feather * 2, 1);
      entry.mesh.position.copy(center);
      entry.mesh.rotation.y = rotateForOutlet ? Math.PI / 2 : 0;
      if (rotateForOutlet) {
        entry.mesh.position.x = bounds.max.x + 0.006;
      } else {
        entry.mesh.position.z = bounds.max.z + 0.006;
      }
      entry.mesh.updateMatrix();
      entry.center = center;
      entry.bounds = bounds;
      entry.width = width;
      entry.height = height;
      entry.panels = [];
      if (modelNode.userData.environmentModelType === "curtain") {
        modelNode.traverse(child => {
          if (child.userData.curtainMotionPanel) {
            entry.panels.push(child);
          }
        });
      }
      entry.pose = null;
      syncPanelRects(entry);
    }
    for (const [id, entry] of entries) {
      if (!activeIds.has(id)) {
        disposeEntry(entry);
        entries.delete(id);
      }
    }
  }
  function syncPanelRects(entry) {
    const pose = entry.panels.map(panel => panel.visible + ":" + panel.scale.x).join("|");
    if (pose === entry.pose) {
      return;
    }
    entry.pose = pose;
    const uniforms = entry.mesh.material.uniforms;
    const rects = uniforms.haloRects.value;
    const visiblePanels = entry.panels.filter(panel => panel.visible);
    if (!visiblePanels.length) {
      uniforms.haloRectCount.value = 1;
      rects[0].set(0, 0, entry.width / 2, entry.height / 2);
      return;
    }
    let rectIndex = 0;
    for (const panel of visiblePanels.slice(0, 2)) {
      const ancestors = [];
      for (let node = panel; node && node !== entry.model; node = node.parent) {
        ancestors.unshift(node);
      }
      const localMatrix = new THREE.Matrix4();
      for (const ancestor of ancestors) {
        if (ancestor.matrixAutoUpdate) {
          ancestor.updateMatrix();
        }
        localMatrix.multiply(ancestor.matrix);
      }
      if (!panel.geometry.boundingBox) {
        panel.geometry.computeBoundingBox();
      }
      const panelBounds = panel.geometry.boundingBox.clone().applyMatrix4(localMatrix);
      const panelCenter = panelBounds.getCenter(new THREE.Vector3());
      const panelSize = panelBounds.getSize(new THREE.Vector3());
      rects[rectIndex++].set(panelCenter.x - entry.center.x, panelCenter.y - entry.center.y, panelSize.x / 2, panelSize.y / 2);
    }
    uniforms.haloRectCount.value = rectIndex;
  }
  function update() {
    if (visible) {
      for (const entry of entries.values()) {
        if (entry.panels.length) {
          syncPanelRects(entry);
        }
      }
    }
  }
  function setColor(id, color) {
    const entry = entries.get(id);
    if (entry) {
      entry.mesh.material.uniforms.haloColor.value.copy(color);
      entry.mesh.visible = visible && color.r + color.g + color.b > 0;
    }
  }
  function setVisible(nextVisible) {
    visible = nextVisible;
    for (const entry of entries.values()) {
      const color = entry.mesh.material.uniforms.haloColor.value;
      entry.mesh.visible = visible && color.r + color.g + color.b > 0;
    }
  }
  function clear() {
    for (const entry of entries.values()) {
      disposeEntry(entry);
    }
    entries.clear();
    root = null;
    sceneRevision = undefined;
    bindingsSignature = undefined;
  }
  return {
    sync,
    setColor,
    setVisible,
    clear,
    update,
    dispose() {
      clear();
      sharedGeometry.dispose();
    }
  };
}
