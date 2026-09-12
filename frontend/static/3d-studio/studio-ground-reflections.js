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
  blur = true,
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
  const materialArrayClones = new WeakMap();
  const mirrorCameras = new WeakMap();
  const positionVector = new THREE.Vector3();
  const directionVector = new THREE.Vector3();
  const lookTargetVector = new THREE.Vector3();
  const scissorsPlane = new THREE.Plane();
  const vector = new THREE.Vector4();
  const clipQVector = new THREE.Vector4();
  const scratchMatrix = new THREE.Matrix4();
  function withoutTransmission(material) {
    if (!material || (!(material.transmission > 0) && !material.userData?.alphaWallBand)) {
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
  function withoutTransmissionMaterial(material) {
    if (!Array.isArray(material)) {
      return withoutTransmission(material);
    }
    let record = materialArrayClones.get(material);
    record || (record = {
      next: []
    }, materialArrayClones.set(material, record));
    record.next.length = material.length;
    let changed = false;
    for (let index = 0; index < material.length; index++) {
      record.next[index] = withoutTransmission(material[index]);
      changed ||= record.next[index] !== material[index];
    }
    return changed ? record.next : material;
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
  let fadeOutStart = null;
  const FADE_DURATION = 240;
  let throttleTimer = null;
  let outsideFloorId = null;
  let visibleFloorId = null;
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
    entry.scratch?.dispose();
    overlayBySource.delete(entry.source);
  }
  function pruneCache() {
    const active = new Set(overlays);
    const cached = [...overlayBySource.values()].filter(entry => !active.has(entry)).sort((a, b) => b.used - a.used);
    let cachedBytes = 0;
    let cachedRecords = 0;
    for (const entry of cached) {
      const bytes = entry.map.width * entry.map.height * (12 * (1 + entry.map.samples) + (entry.scratch ? 8 : 0));
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
    return [...floorMaxHeight].filter(([floorId, height]) => (visibleFloorId === null || !floorId || floorId === visibleFloorId) && (!floorLighting || !floorId || height >= entry.height - 0.1)).map(([floorId]) => floorKeys.get(floorId)).join("|");
  }
  const matchesVisibleFloor = object => visibleFloorId === null || floorIdOf(object) === visibleFloorId;
  function isFloorTransitionLeaving(object) {
    for (let node = object; node; node = node.parent) {
      if (node.userData?.floorTransitionLeaving) {
        return true;
      }
    }
    return false;
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
      if (isFloorTransitionLeaving(mesh) || !matchesVisibleFloor(mesh) || settings.mode !== "all" && kind !== settings.mode || kind === "outside" && !matchesOutsideFloor(mesh)) {
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
        entry.hasCapture = false;
        entry.overlay.position.copy(mesh.position);
        entry.overlay.quaternion.copy(mesh.quaternion);
        entry.overlay.scale.copy(mesh.scale);
        mesh.parent.add(entry.overlay);
        overlays.push(entry);
        stats.reuses++;
        continue;
      }
      const map = createTarget(settings.resolution);
      const scratch = blur ? createTarget(settings.resolution, true) : null;
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
        dead: false,
        hasCapture: false
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
    return matchesVisibleFloor(entry.source) && (settings.mode === "all" || settings.mode === entry.kind) && (entry.kind !== "outside" || matchesOutsideFloor(entry.source));
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
  function mirrorCamera(camera, plane, reflectionMatrix) {
    let mirrored = mirrorCameras.get(camera);
    if (!mirrored) {
      mirrored = camera.clone(false);
      mirrorCameras.set(camera, mirrored);
    }
    mirrored.layers.mask = camera.layers.mask;
    for (const key of ["near", "far", "zoom", "fov", "aspect", "focus", "filmGauge", "filmOffset", "left", "right", "top", "bottom", "coordinateSystem"]) {
      if (key in camera) {
        mirrored[key] = camera[key];
      }
    }
    const position = positionVector.setFromMatrixPosition(camera.matrixWorld);
    const direction = directionVector.setFromMatrixColumn(camera.matrixWorld, 2).negate().normalize();
    position.addScaledVector(plane.normal, -2 * plane.distanceToPoint(position));
    direction.reflect(plane.normal);
    mirrored.position.copy(position);
    mirrored.up.setFromMatrixColumn(camera.matrixWorld, 1).normalize().reflect(plane.normal);
    mirrored.lookAt(lookTargetVector.copy(position).add(direction));
    mirrored.updateMatrixWorld(true);
    mirrored.projectionMatrix.copy(camera.projectionMatrix);
    mirrored.projectionMatrix.elements[8] *= -1;
    mirrored.projectionMatrix.elements[12] *= -1;
    reflectionMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1).multiply(mirrored.projectionMatrix).multiply(mirrored.matrixWorldInverse);
    const clipPlane = scissorsPlane.copy(plane).applyMatrix4(mirrored.matrixWorldInverse);
    const clipVector = vector.set(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);
    const projection = mirrored.projectionMatrix.elements;
    const q = clipQVector.set(Math.sign(clipVector.x), Math.sign(clipVector.y), 1, 1).applyMatrix4(scratchMatrix.copy(mirrored.projectionMatrix).invert());
    clipVector.multiplyScalar(2 / clipVector.dot(q));
    projection[2] = clipVector.x - projection[3];
    projection[6] = clipVector.y - projection[7];
    projection[10] = clipVector.z - projection[11];
    projection[14] = clipVector.w - projection[15];
    mirrored.projectionMatrixInverse.copy(mirrored.projectionMatrix).invert();
    return mirrored;
  }
  function render(camera, { worldMatricesCurrent = false } = {}) {
    if (disposed || stats.inCapture || !camera) {
      return;
    }
    if (suspended) {
      if (fadeOutStart === null) {
        return;
      }
      const fadeOut = Math.min(1, Math.max(0, (performance.now() - fadeOutStart) / FADE_DURATION));
      for (const entry of overlays) {
        let attachedToRoot = false;
        for (let node = entry.source; node; node = node.parent) {
          if (node === getRoot()) {
            attachedToRoot = true;
            break;
          }
        }
        if (fadeOut === 1 || !attachedToRoot || entry.dead || !entry.hasCapture || !entry.fadeOutStrength) {
          entry.overlay.visible = false;
          entry.overlay.removeFromParent();
          continue;
        }
        entry.source.updateWorldMatrix(true, false);
        entry.matrix.copy(entry.fadeOutMatrix).multiply(entry.fadeOutFrame).multiply(new THREE.Matrix4().copy(entry.source.matrixWorld).invert());
        entry.overlay.position.copy(entry.source.position);
        entry.overlay.quaternion.copy(entry.source.quaternion);
        entry.overlay.scale.copy(entry.source.scale);
        if (entry.overlay.parent !== entry.source.parent) {
          entry.source.parent.add(entry.overlay);
        }
        entry.overlay.updateWorldMatrix(true, false);
        entry.overlay.material.uniforms.strength.value = entry.fadeOutStrength * (1 - fadeOut);
        entry.overlay.visible = isVisibleInHierarchy(entry.kind === "outside" ? entry.source.parent : entry.source);
      }
      if (fadeOut < 1) {
        requestFrame();
      } else {
        fadeOutStart = null;
      }
      return;
    }
    if (settings.mode === "off" || settings.strength === 0 || (worldMatricesCurrent || (scene.matrixWorldAutoUpdate && scene.updateMatrixWorld(), camera.updateWorldMatrix(true, false)), rebuildOverlays(getSceneRevision()), !root)) {
      return;
    }
    const fade = resumeFade ? 0 : fadeStart === null ? 1 : Math.min(1, (performance.now() - fadeStart) / FADE_DURATION);
    if (fade < 1) {
      requestFrame();
    } else {
      fadeStart = null;
    }
    for (const entry of overlays) {
      if (!entry.sourceFrame?.equals(entry.source.matrixWorld)) {
        entry.sourceFrame = (entry.sourceFrame || new THREE.Matrix4()).copy(entry.source.matrixWorld);
        entry.source.geometry.boundingBox || entry.source.geometry.computeBoundingBox();
        const geometryBox = entry.source.geometry.boundingBox;
        const size = geometryBox.getSize(new THREE.Vector3());
        const axis = size.x <= size.y && size.x <= size.z ? "x" : size.y <= size.z ? "y" : "z";
        const normal = new THREE.Vector3();
        normal[axis] = 1;
        normal.applyMatrix3(new THREE.Matrix3().getNormalMatrix(entry.sourceFrame)).normalize();
        const center = geometryBox.getCenter(new THREE.Vector3());
        center[axis] = normal.y < 0 ? geometryBox.min[axis] : geometryBox.max[axis];
        if (normal.y < 0) {
          normal.negate();
        }
        entry.plane = (entry.plane || new THREE.Plane()).setFromNormalAndCoplanarPoint(normal, center.applyMatrix4(entry.sourceFrame));
        entry.height = new THREE.Box3().copy(geometryBox).applyMatrix4(entry.sourceFrame).max.y;
        dirty = true;
      }
      entry.eligible = !isFloorTransitionLeaving(entry.source) && isVisibleInHierarchy(entry.kind === "outside" ? entry.source.parent : entry.source) && overlayAllowed(entry) && entry.plane.distanceToPoint(camera.position) > 0;
      entry.overlay.visible = entry.eligible && entry.hasCapture;
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
        entry.scratch?.setSize(resolution, resolution);
        dirty = true;
      }
    }
    const lightingKey = getStateKey() + "|" + globalRevision + "|" + lightsSignature(lightsByFloor.get("") || []) + "|" + (floorLighting ? "" : lightsSignature([...lightsByFloor.values()].flat()));
    const contentChanged = dirty || cameraChanged || lightingKey !== lastLightingKey;
    const floorKeys = new Map([...floorMaxHeight.keys()].map(floorId => [floorId, floorId + ":" + (floorRevision.get(floorId) || 0) + ":" + (floorLighting ? lightsSignature(lightsByFloor.get(floorId) || []) : "")]));
    const entryStateKeys = new Map();
    const dirtyOverlays = overlays.filter(entry => {
      if (!entry.eligible) {
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
      autoClear: renderer.autoClear,
      matrixWorldAutoUpdate: scene.matrixWorldAutoUpdate
    };
    const hiddenVisibility = [];
    const swappedMaterials = [];
    const swappedGeometries = [];
    const wallNodes = [];
    const captureAllInside = dirtyOverlays.every(entry => entry.kind === "inside");
    culling.reset();
    const hideForCapture = object => {
      if (!object.visible) {
        return;
      }
      if (object !== root && visibleFloorId !== null && floorIdOf(object) && floorIdOf(object) !== visibleFloorId || object.userData.floorTransitionLeaving || object.name === "interaction3d-curtain-shadow-refresh" || object.userData.reflectionOverlay || ["background", "grid", "outline"].includes(object.userData.exportRole) || object.userData.regionReceiverKind === "floor" || object.userData.environmentEffect || captureAllInside && object.userData.reflectionRole === "wall") {
        hiddenVisibility.push([object, object.visible]);
        object.visible = false;
        return;
      }
      if (object.userData.reflectionRole === "wall") {
        wallNodes.push(object);
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
        const replacement = withoutTransmissionMaterial(original);
        if (replacement !== original) {
          swappedMaterials.push([object, original]);
          object.material = replacement;
        }
      }
      for (const child of object.children) {
        hideForCapture(child);
      }
    };
    hideForCapture(scene);
    scene.matrixWorldAutoUpdate = false;
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
        entry.hasCapture = false;
        const mirrored = mirrorCamera(camera, entry.plane, entry.matrix);
        syncLighting(mirrored);
        const hiddenWalls = [];
        try {
          if (cull && !culling.begin(entry, mirrored)) {
            entry.state = entryStateKeys.get(entry);
            continue;
          }
          if (entry.kind === "inside") {
            for (const wall of wallNodes) {
              if (wall.visible) {
                hiddenWalls.push(wall);
                wall.visible = false;
              }
            }
          }
          renderer.setRenderTarget(entry.map);
          renderer.clear();
          renderer.render(scene, mirrored);
          stats.renders++;
          stats.lastDrawCalls += renderer.info?.render.calls || 0;
          stats.lastTriangles += renderer.info?.render.triangles || 0;
        } finally {
          culling.restore();
          for (const wall of hiddenWalls) {
            wall.visible = true;
          }
        }
        if (entry.scratch) {
          for (const [source, destination, stepX, stepY] of [[entry.map, entry.scratch, 1, 0], [entry.scratch, entry.map, 0, 1]]) {
            blurMaterial.uniforms.source.value = source.texture;
            blurMaterial.uniforms.step.value.set(stepX * 2 / 512, stepY * 2 / 512);
            renderer.setRenderTarget(destination);
            renderer.clear();
            renderer.render(blurScene, blurCamera);
          }
        }
        stats.captures++;
        entry.hasCapture = true;
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
      scene.matrixWorldAutoUpdate = previous.matrixWorldAutoUpdate;
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
      for (const entry of overlays) {
        entry.overlay.visible = entry.eligible && entry.hasCapture;
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
    setVisibleFloor(floorId) {
      const next = floorId == null ? null : String(floorId);
      if (next !== visibleFloorId) {
        visibleFloorId = next;
        for (const entry of overlays) {
          if (!matchesVisibleFloor(entry.source)) {
            entry.overlay.visible = false;
            entry.overlay.removeFromParent();
          }
        }
        firstChild = null;
        dirty = true;
        requestFrame();
      }
    },
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
    setSuspended(nextSuspended, { fade = false } = {}) {
      const next = nextSuspended === true;
      if (suspended === next) {
        if (next) {
          for (const entry of overlays) {
            entry.overlay.visible = false;
            entry.overlay.removeFromParent();
          }
        }
        if (next && !fade) {
          fadeOutStart = null;
        }
        return;
      }
      suspended = next;
      fadeStart = null;
      resumeFade = !suspended;
      fadeOutStart = suspended && fade ? performance.now() : null;
      for (const entry of overlays) {
        if (suspended && fade) {
          entry.fadeOutStrength = entry.overlay.visible ? entry.overlay.material.uniforms.strength.value : 0;
          entry.fadeOutMatrix = entry.matrix.clone();
          entry.source.updateWorldMatrix(true, false);
          entry.fadeOutFrame = entry.source.matrixWorld.clone();
        }
        entry.overlay.visible = false;
        entry.overlay.removeFromParent();
      }
      dirty = true;
      if (!suspended) {
        firstChild = null;
      }
      requestFrame();
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
