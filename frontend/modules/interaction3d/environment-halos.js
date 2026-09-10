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
    const nextBindingsSignature = JSON.stringify(bindings.map(binding => [binding.id, binding.floorId, binding.modelId, binding.visible]));
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
