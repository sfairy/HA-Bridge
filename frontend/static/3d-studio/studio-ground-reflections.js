import { normalizeGroundReflection } from "../modules/interaction3d/reflection-settings.js";
import { createReflectionCulling } from "./studio-reflection-culling.js?v=20260909-reflection-scope-v1";
export function createGroundReflections({
  THREE,
  renderer,
  scene,
  getRoot,
  syncLighting,
  getStateKey = () => "",
  getSceneRevision = () => "",
  floorLighting = false,
  detail = null,
  cull = true,
  requestFrame = () => {}
}) {
  const settings = {
    ...normalizeGroundReflection(),
    fps: 30
  };
  const culling = createReflectionCulling(THREE);
  const stats = {
    captures: 0,
    renders: 0,
    lastMs: 0,
    totalMs: 0,
    allocations: 0,
    reuses: 0,
    cachedRecords: 0,
    cachedBytes: 0,
    inCapture: false
  };
  const transmissionClones = new WeakMap();
  const transmissionDisposers = new Map();
  function withoutTransmission(material) {
    if (!material || !(material.transmission > 0)) {
      return material;
    }
    if (!transmissionClones.has(material)) {
      const clone = material.clone();
      clone.transmission = 0;
      clone.forceSinglePass = true;
      clone.onBeforeCompile = material.onBeforeCompile;
      clone.customProgramCacheKey = () => material.customProgramCacheKey() + "|reflection-no-refraction";
      const onDispose = () => {
        material.removeEventListener("dispose", onDispose);
        transmissionClones.delete(material);
        transmissionDisposers.delete(clone);
        clone.dispose();
      };
      material.addEventListener("dispose", onDispose);
      transmissionClones.set(material, clone);
      transmissionDisposers.set(clone, onDispose);
    }
    return transmissionClones.get(material);
  }
  let overlays = [];
  let root = null;
  let firstChild = null;
  let dirty = true;
  let lastCaptureTime = -Infinity;
  let lastCameraKey = "";
  let lastLightingKey = "";
  let disposed = false;
  let globalRevision = 0;
  let sceneRevision;
  let suspended = false;
  let resumeFade = false;
  let fadeStart = null;
  let throttleTimer = null;
  let outsideFloorId = null;
  let useCounter = 0;
  const overlayBySource = new Map();
  const floorRevision = new Map();
  const maxCacheBytes = 33554432;
  let floorMaxHeight = new Map();
  let lightsByFloor = new Map();
  function floorIdOf(object) {
    for (let node = object; node; node = node.parent) {
      const floorId = node.userData?.floorId || node.userData?.regionFloorId || node.userData?.environmentFloorId || node.userData?.lightFloorId;
      if (floorId) {
        return String(floorId);
      }
    }
    return "";
  }
  const attributeIds = new WeakMap();
  let nextAttributeId = 0;
  function attributeId(attribute) {
    if (attribute) {
      if (!attributeIds.has(attribute)) {
        attributeIds.set(attribute, ++nextAttributeId);
      }
      return attributeIds.get(attribute);
    } else {
      return 0;
    }
  }
  function geometryKey(mesh) {
    const geometry = mesh.geometry;
    return [geometry.uuid, attributeId(geometry.index), geometry.index?.version, ...Object.entries(geometry.attributes).flatMap(([name, attribute]) => [name, attributeId(attribute), attribute.version, attribute.data?.version, attribute.count]), geometry.drawRange.start, geometry.drawRange.count].join("|");
  }
  function disposeOverlay(entry) {
    entry.geometry.removeEventListener("dispose", entry.onSourceDispose);
    entry.overlay.removeFromParent();
    entry.overlay.geometry.dispose();
    entry.overlay.material.dispose();
    entry.map.dispose();
    entry.scratch.dispose();
    overlayBySource.delete(entry.source);
  }
  function pruneCache() {
    const active = new Set(overlays);
    const cached = [...overlayBySource.values()].filter(entry => !active.has(entry)).sort((a, b) => b.used - a.used);
    let cachedBytes = 0;
    let cachedRecords = 0;
    for (const entry of cached) {
      const bytes = entry.map.width * entry.map.height * ((1 + entry.map.samples) * 12 + 8);
      if (entry.dead || cachedRecords >= 4 || cachedBytes + bytes > maxCacheBytes) {
        disposeOverlay(entry);
        continue;
      }
      cachedBytes += bytes;
      cachedRecords++;
    }
    stats.cachedRecords = cachedRecords;
    stats.cachedBytes = cachedBytes;
  }
  function lightsSignature(lights) {
    return lights.map(light => [light.uuid, isVisibleInHierarchy(light), light.intensity, light.color?.r, light.color?.g, light.color?.b, light.distance, light.decay, light.angle, light.penumbra, ...light.matrixWorld.elements, ...(light.target?.matrixWorld.elements || [])].join(",")).join(";");
  }
  function floorStateKey(entry, floorKeys) {
    return [...floorMaxHeight].filter(([floorId, height]) => !floorLighting || !floorId || height >= entry.height - 0.1).map(([floorId]) => floorKeys.get(floorId)).join("|");
  }
  function matchesOutsideFloor(object) {
    if (outsideFloorId === null) {
      return true;
    }
    for (let node = object; node; node = node.parent) {
      const floorId = node.userData?.floorId || node.userData?.regionFloorId;
      if (floorId) {
        return floorId === outsideFloorId;
      }
    }
    return false;
  }
  const blurScene = new THREE.Scene();
  const blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const blurMaterial = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      source: {
        value: null
      },
      step: {
        value: new THREE.Vector2()
      }
    },
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
    fragmentShader: "uniform sampler2D source; uniform vec2 step; varying vec2 vUv;\n      void main(){ gl_FragColor=texture2D(source,vUv)*.227027;\n      gl_FragColor+=(texture2D(source,vUv+step*1.384615)+texture2D(source,vUv-step*1.384615))*.316216;\n      gl_FragColor+=(texture2D(source,vUv+step*3.230769)+texture2D(source,vUv-step*3.230769))*.070270; }"
  });
  const blurQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMaterial);
  blurScene.add(blurQuad);
  const createTarget = (size, colorOnly = false) => new THREE.WebGLRenderTarget(size, size, {
    type: THREE.HalfFloatType,
    depthBuffer: !colorOnly,
    samples: colorOnly ? 0 : Math.min(2, renderer.capabilities.maxSamples)
  });
  function clearOverlays() {
    for (const entry of [...overlayBySource.values()]) {
      disposeOverlay(entry);
    }
    overlays = [];
    stats.cachedRecords = stats.cachedBytes = 0;
  }
  function rebuildOverlays(revision) {
    const nextRoot = getRoot();
    if (!nextRoot) {
      clearOverlays();
      root = firstChild = null;
      return;
    }
    if (sceneRevision === revision && root === nextRoot && firstChild === nextRoot.children[0] && overlays.every(entry => entry.source.parent && !entry.dead)) {
      return;
    }
    for (const entry of overlays) {
      entry.overlay.visible = false;
      entry.overlay.removeFromParent();
    }
    overlays = [];
    sceneRevision = revision;
    root = nextRoot;
    firstChild = nextRoot.children[0];
    root.updateWorldMatrix(true, true);
    floorMaxHeight = new Map();
    lightsByFloor = new Map();
    const worldBox = new THREE.Box3();
    root.traverse(object => {
      if (object.userData?.reflectionOverlay || object.userData?.environmentEffect) {
        return;
      }
      const floorId = floorIdOf(object);
      if (object.isLight) {
        if (!lightsByFloor.has(floorId)) {
          lightsByFloor.set(floorId, []);
        }
        lightsByFloor.get(floorId).push(object);
      }
      if (!object.isMesh || !object.geometry) {
        return;
      }
      if (!object.geometry.boundingBox) {
        object.geometry.computeBoundingBox();
      }
      if (object.isInstancedMesh) {
        object.computeBoundingBox();
      }
      const localBox = object.isInstancedMesh ? object.boundingBox : object.geometry.boundingBox;
      const maxY = object.isSkinnedMesh || object.morphTargetInfluences?.length ? Infinity : localBox ? worldBox.copy(localBox).applyMatrix4(object.matrixWorld).max.y : Infinity;
      floorMaxHeight.set(floorId, Math.max(floorMaxHeight.get(floorId) ?? -Infinity, maxY));
    });
    const floorMeshes = [];
    root.traverse(object => {
      if (object.isMesh && (object.userData.regionReceiverKind === "floor" || object.userData.exportRole === "background")) {
        floorMeshes.push(object);
      }
    });
    for (const mesh of floorMeshes) {
      const kind = mesh.userData.exportRole === "background" ? "outside" : "inside";
      if (settings.mode !== "all" && kind !== settings.mode || kind === "outside" && !matchesOutsideFloor(mesh)) {
        continue;
      }
      const bounds = new THREE.Box3().setFromObject(mesh);
      const height = bounds.max.y;
      const key = geometryKey(mesh);
      let entry = overlayBySource.get(mesh);
      if (entry && (entry.dead || entry.key !== key)) {
        disposeOverlay(entry);
        entry = null;
      }
      if (entry) {
        entry.height = height;
        entry.used = ++useCounter;
        entry.overlay.position.copy(mesh.position);
        entry.overlay.quaternion.copy(mesh.quaternion);
        entry.overlay.scale.copy(mesh.scale);
        mesh.parent.add(entry.overlay);
        overlays.push(entry);
        stats.reuses++;
        continue;
      }
      const map = createTarget(settings.resolution);
      const scratch = createTarget(settings.resolution, true);
      const reflectionMatrix = new THREE.Matrix4();
      const overlayMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -2,
        uniforms: {
          reflection: {
            value: map.texture
          },
          reflectionMatrix: {
            value: reflectionMatrix
          },
          strength: {
            value: settings.strength
          }
        },
        vertexShader: "uniform mat4 reflectionMatrix; varying vec4 reflected; varying float up;\n          void main(){vec4 world=modelMatrix*vec4(position,1.);reflected=reflectionMatrix*world;\n          up=normalize(mat3(modelMatrix)*normal).y;gl_Position=projectionMatrix*viewMatrix*world;}",
        fragmentShader: "uniform sampler2D reflection; uniform float strength; varying vec4 reflected; varying float up;\n          void main(){if(up<.9||reflected.w<=0.)discard;vec2 uv=reflected.xy/reflected.w;\n          if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))discard;\n          vec4 value=texture2D(reflection,uv);gl_FragColor=vec4(value.rgb/max(value.a,.001),clamp(value.a*strength,0.,.7));\n          #include <tonemapping_fragment>\n          #include <colorspace_fragment>\n          }"
      });
      const overlayMesh = new THREE.Mesh(mesh.geometry.clone(), overlayMaterial);
      overlayMesh.position.copy(mesh.position);
      overlayMesh.quaternion.copy(mesh.quaternion);
      overlayMesh.scale.copy(mesh.scale);
      overlayMesh.renderOrder = 1;
      overlayMesh.userData.environmentEffect = true;
      overlayMesh.userData.reflectionOverlay = true;
      overlayMesh.userData.externalModelSharedGeometry = overlayMesh.userData.externalModelSharedMaterial = overlayMesh.userData.externalModelSharedTextures = true;
      entry = {
        source: mesh,
        geometry: mesh.geometry,
        kind,
        height,
        overlay: overlayMesh,
        map,
        scratch,
        matrix: reflectionMatrix,
        key,
        used: ++useCounter,
        state: "",
        dead: false
      };
      entry.onSourceDispose = () => {
        entry.dead = true;
        overlayMesh.visible = false;
      };
      mesh.geometry.addEventListener("dispose", entry.onSourceDispose);
      overlayBySource.set(mesh, entry);
      stats.allocations++;
      mesh.parent.add(overlayMesh);
      overlays.push(entry);
    }
    detail?.prepare(root);
    pruneCache();
    dirty = true;
  }
  function isVisibleInHierarchy(object) {
    for (let node = object; node; node = node.parent) {
      if (!node.visible) {
        return false;
      }
    }
    return true;
  }
  function overlayAllowed(entry) {
    return (settings.mode === "all" || settings.mode === entry.kind) && (entry.kind !== "outside" || matchesOutsideFloor(entry.source));
  }
  function configure(options) {
    const next = normalizeGroundReflection(options);
    if (next.mode === settings.mode && next.resolution === settings.resolution && next.strength === settings.strength) {
      return false;
    }
    const resolutionChanged = settings.resolution !== next.resolution;
    const modeChanged = settings.mode !== next.mode;
    Object.assign(settings, next);
    if (resolutionChanged || next.mode === "off" || next.strength === 0) {
      clearOverlays();
      firstChild = null;
    }
    if (modeChanged) {
      firstChild = null;
    }
    dirty ||= resolutionChanged || modeChanged;
    requestFrame();
    return true;
  }
  function mirrorCamera(camera, planeY, reflectionMatrix) {
    const mirrored = camera.clone();
    mirrored.layers.mask = camera.layers.mask;
    const position = camera.getWorldPosition(new THREE.Vector3());
    const direction = camera.getWorldDirection(new THREE.Vector3());
    position.y = planeY * 2 - position.y;
    direction.y *= -1;
    mirrored.position.copy(position);
    mirrored.up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
    mirrored.up.y *= -1;
    mirrored.lookAt(position.clone().add(direction));
    mirrored.updateMatrixWorld(true);
    mirrored.projectionMatrix.copy(camera.projectionMatrix);
    mirrored.projectionMatrix.elements[8] *= -1;
    mirrored.projectionMatrix.elements[12] *= -1;
    reflectionMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(mirrored.projectionMatrix).multiply(mirrored.matrixWorldInverse);
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY).applyMatrix4(mirrored.matrixWorldInverse);
    const clipVector = new THREE.Vector4(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);
    const projection = mirrored.projectionMatrix.elements;
    const q = new THREE.Vector4(Math.sign(clipVector.x), Math.sign(clipVector.y), 1, 1).applyMatrix4(mirrored.projectionMatrix.clone().invert());
    clipVector.multiplyScalar(2 / clipVector.dot(q));
    projection[2] = clipVector.x - projection[3];
    projection[6] = clipVector.y - projection[7];
    projection[10] = clipVector.z - projection[11];
    projection[14] = clipVector.w - projection[15];
    mirrored.projectionMatrixInverse.copy(mirrored.projectionMatrix).invert();
    return mirrored;
  }
  function render(camera) {
    if (disposed || stats.inCapture || !camera || suspended || settings.mode === "off" || settings.strength === 0 || (rebuildOverlays(getSceneRevision()), !root)) {
      return;
    }
    const fade = resumeFade ? 0 : fadeStart === null ? 1 : Math.min(1, (performance.now() - fadeStart) / 260);
    if (fade < 1) {
      requestFrame();
    } else {
      fadeStart = null;
    }
    for (const entry of overlays) {
      entry.overlay.visible = isVisibleInHierarchy(entry.kind === "outside" ? entry.source.parent : entry.source) && overlayAllowed(entry);
      entry.overlay.material.uniforms.strength.value = settings.strength * fade;
    }
    if (settings.mode === "off" || !overlays.length) {
      return;
    }
    const now = performance.now();
    const cameraKey = camera.matrixWorld.elements.join(",") + camera.projectionMatrix.elements.join(",");
    const cameraChanged = cameraKey !== lastCameraKey;
    const resolution = settings.resolution;
    for (const entry of overlays) {
      if (entry.map.width !== resolution) {
        entry.map.setSize(resolution, resolution);
        entry.scratch.setSize(resolution, resolution);
        dirty = true;
      }
    }
    const lightingKey = getStateKey() + "|" + globalRevision + "|" + lightsSignature(lightsByFloor.get("") || []) + "|" + (floorLighting ? "" : lightsSignature([...lightsByFloor.values()].flat()));
    const contentChanged = dirty || cameraChanged || lightingKey !== lastLightingKey;
    const floorKeys = new Map([...floorMaxHeight.keys()].map(floorId => [floorId, floorId + ":" + (floorRevision.get(floorId) || 0) + ":" + (floorLighting ? lightsSignature(lightsByFloor.get(floorId) || []) : "")]));
    const entryStateKeys = new Map();
    const dirtyOverlays = overlays.filter(entry => {
      if (!entry.overlay.visible || camera.position.y <= entry.height) {
        return false;
      }
      const stateKey = floorStateKey(entry, floorKeys);
      entryStateKeys.set(entry, stateKey);
      return contentChanged || entry.state !== stateKey;
    });
    if (!dirtyOverlays.length) {
      return;
    }
    if (!dirty && !cameraChanged && now - lastCaptureTime < 1000 / settings.fps) {
      if (throttleTimer === null) {
        throttleTimer = setTimeout(() => {
          throttleTimer = null;
          requestFrame();
        }, 1000 / settings.fps - (now - lastCaptureTime));
      }
      return;
    }
    const previous = {
      target: renderer.getRenderTarget(),
      cubeFace: renderer.getActiveCubeFace(),
      mipmap: renderer.getActiveMipmapLevel(),
      webxrEnabled: renderer.xr.enabled,
      shadow: renderer.shadowMap.autoUpdate,
      alpha: renderer.getClearAlpha(),
      color: renderer.getClearColor(new THREE.Color()),
      background: scene.background,
      viewport: renderer.getViewport(new THREE.Vector4()),
      scissor: renderer.getScissor(new THREE.Vector4()),
      scissorTest: renderer.getScissorTest(),
      autoClear: renderer.autoClear
    };
    const hiddenVisibility = [];
    const swappedMaterials = [];
    const swappedGeometries = [];
    culling.reset();
    root.traverse(object => {
      if (object.name === "interaction3d-curtain-shadow-refresh" || object.userData.reflectionOverlay || ["background", "grid", "outline"].includes(object.userData.exportRole) || object.userData.regionReceiverKind === "floor" || object.userData.environmentEffect) {
        hiddenVisibility.push([object, object.visible]);
        object.visible = false;
      }
      if (cull) {
        culling.add(object, !floorLighting);
      }
      const simplified = detail?.get(object);
      if (simplified) {
        swappedGeometries.push([object, object.geometry]);
        object.geometry = simplified;
      }
      if (object.isMesh && object.material) {
        const original = object.material;
        const replacement = Array.isArray(original) ? original.map(withoutTransmission) : withoutTransmission(original);
        if (replacement !== original) {
          swappedMaterials.push([object, original]);
          object.material = replacement;
        }
      }
    });
    const captureStart = performance.now();
    stats.inCapture = true;
    stats.lastDrawCalls = stats.lastTriangles = 0;
    try {
      renderer.xr.enabled = false;
      renderer.shadowMap.autoUpdate = false;
      renderer.autoClear = true;
      scene.background = null;
      renderer.setClearColor(0, 0);
      renderer.setScissorTest(false);
      for (const entry of dirtyOverlays) {
        const mirrored = mirrorCamera(camera, entry.height, entry.matrix);
        syncLighting(mirrored);
        if (cull && !culling.begin(entry, mirrored)) {
          entry.state = entryStateKeys.get(entry);
          continue;
        }
        renderer.setRenderTarget(entry.map);
        renderer.clear();
        renderer.render(scene, mirrored);
        stats.renders++;
        stats.lastDrawCalls += renderer.info?.render.calls || 0;
        stats.lastTriangles += renderer.info?.render.triangles || 0;
        culling.restore();
        for (const [source, destination, stepX, stepY] of [[entry.map, entry.scratch, 1, 0], [entry.scratch, entry.map, 0, 1]]) {
          blurMaterial.uniforms.source.value = source.texture;
          blurMaterial.uniforms.step.value.set(stepX * 2 / 512, stepY * 2 / 512);
          renderer.setRenderTarget(destination);
          renderer.clear();
          renderer.render(blurScene, blurCamera);
        }
        stats.captures++;
        entry.state = entryStateKeys.get(entry);
      }
      if (resumeFade) {
        resumeFade = false;
        fadeStart = performance.now();
        requestFrame();
      }
      dirty = false;
      lastCaptureTime = now;
      lastCameraKey = cameraKey;
      lastLightingKey = lightingKey;
    } finally {
      culling.restore();
      stats.culling = {
        ...culling.stats
      };
      for (const [object, geometry] of swappedGeometries) {
        object.geometry = geometry;
      }
      for (const [object, visible] of hiddenVisibility) {
        object.visible = visible;
      }
      for (const [object, material] of swappedMaterials) {
        object.material = material;
      }
      scene.background = previous.background;
      renderer.setClearColor(previous.color, previous.alpha);
      renderer.setRenderTarget(previous.target, previous.cubeFace, previous.mipmap);
      renderer.setViewport(previous.viewport);
      renderer.setScissor(previous.scissor);
      renderer.setScissorTest(previous.scissorTest);
      renderer.xr.enabled = previous.webxrEnabled;
      renderer.shadowMap.autoUpdate = previous.shadow;
      renderer.autoClear = previous.autoClear;
      syncLighting(camera);
      stats.inCapture = false;
      stats.lastMs = performance.now() - captureStart;
      stats.totalMs += stats.lastMs;
    }
  }
  return {
    settings,
    stats,
    render,
    configure,
    setOutsideFloor(floorId) {
      const next = floorId == null ? null : String(floorId);
      if (next !== outsideFloorId) {
        outsideFloorId = next;
        for (const entry of overlays) {
          if (entry.kind === "outside" && !matchesOutsideFloor(entry.source)) {
            entry.overlay.visible = false;
          }
        }
        firstChild = null;
        dirty = true;
        requestFrame();
      }
    },
    setSuspended(nextSuspended) {
      if (suspended !== (nextSuspended === true)) {
        suspended = nextSuspended === true;
        fadeStart = null;
        resumeFade = !suspended;
        for (const entry of overlays) {
          entry.overlay.visible = false;
          if (suspended) {
            entry.overlay.removeFromParent();
          }
        }
        dirty = true;
        if (!suspended) {
          firstChild = null;
          requestFrame();
        }
      }
    },
    get records() {
      return overlays;
    },
    invalidate() {
      dirty = true;
    },
    changed(floorIds) {
      if (floorIds == null) {
        globalRevision++;
      } else {
        for (const floorId of new Set(floorIds)) {
          if (!floorId || !floorMaxHeight.has(String(floorId))) {
            globalRevision++;
            continue;
          }
          floorRevision.set(String(floorId), (floorRevision.get(String(floorId)) || 0) + 1);
        }
      }
    },
    dispose() {
      disposed = true;
      detail?.dispose();
      clearTimeout(throttleTimer);
      clearOverlays();
      blurQuad.geometry.dispose();
      blurMaterial.dispose();
      for (const disposeClone of [...transmissionDisposers.values()]) {
        disposeClone();
      }
      floorRevision.clear();
      floorMaxHeight.clear();
      lightsByFloor.clear();
    }
  };
}
