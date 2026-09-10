export function createFloorTransition({
  THREE,
  getRoot,
  dispose,
  release = () => false,
  suspendReflections = () => {},
  invalidate = () => {}
}) {
  let records = [];
  let active = false;
  let slideCameras = null;
  const decomposeTransform = matrix => {
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);
    return {
      position,
      quaternion,
      scale
    };
  };
  function capture(floorIds, getBaseFrame, filterByFloor) {
    const root = getRoot();
    root.updateMatrixWorld(true);
    return floorIds.map(floorId => {
      const group = new THREE.Group();
      group.name = "floor-transition-" + floorId;
      group.userData.floorId = group.userData.regionFloorId = floorId;
      const children = filterByFloor ? root.children.filter(child => child.userData.floorId === floorId) : [...root.children];
      root.add(group);
      for (const child of children) {
        group.attach(child);
      }
      const record = {
        id: floorId,
        node: group,
        baseFrame: getBaseFrame(floorId),
        ground: [],
        groundAlpha: 1
      };
      group.traverse(mesh => {
        if (!mesh.material || !["background", "grid", "contact-shadow"].includes(mesh.userData?.exportRole)) {
          return;
        }
        const originalMaterial = mesh.material;
        const cloneTransparent = material => {
          const cloned = material.clone();
          cloned.onBeforeCompile = material.onBeforeCompile;
          cloned.customProgramCacheKey = material.customProgramCacheKey.bind(material);
          cloned.transparent = true;
          cloned.depthWrite = false;
          return cloned;
        };
        mesh.material = Array.isArray(originalMaterial) ? originalMaterial.map(cloneTransparent) : cloneTransparent(originalMaterial);
        record.ground.push({
          node: mesh,
          followsFloor: mesh.userData.exportRole === "contact-shadow",
          original: originalMaterial,
          materials: Array.isArray(mesh.material) ? mesh.material : [mesh.material],
          opacity: (Array.isArray(originalMaterial) ? originalMaterial : [originalMaterial]).map(material => material.opacity)
        });
      });
      return record;
    });
  }
  function currentFrame(record) {
    record.node.updateMatrix();
    return record.node.matrix.clone().multiply(record.baseFrame);
  }
  function restoreGround(record) {
    for (const ground of record.ground) {
      ground.node.material = ground.original;
      for (const material of ground.materials) {
        material.dispose();
      }
    }
    record.ground = [];
  }
  function disposeRecord(record, tryRelease = true) {
    restoreGround(record);
    record.node.removeFromParent();
    if (!record.transferred && (!tryRelease || !release(record))) {
      dispose(record.node);
    }
  }
  function reuse(record, worldFrame) {
    restoreGround(record);
    const children = [...record.node.children];
    let floorGroup;
    if (children.length === 1 && children[0].userData.floorId === record.id) {
      floorGroup = children[0];
      record.node.remove(floorGroup);
    } else {
      floorGroup = new THREE.Group();
      floorGroup.name = "floor-" + record.id;
      floorGroup.userData.floorId = floorGroup.userData.regionFloorId = record.id;
      for (const child of children) {
        record.node.remove(child);
        floorGroup.add(child);
      }
    }
    floorGroup.applyMatrix4(worldFrame.clone().multiply(record.baseFrame.clone().invert()));
    getRoot().add(floorGroup);
    floorGroup.updateMatrixWorld(true);
    record.transferred = true;
    return floorGroup;
  }
  function take(floorIds, getBaseFrame, filterByFloor) {
    const taken = active ? records : capture(floorIds, getBaseFrame, filterByFloor);
    for (const record of taken) {
      record.frame = currentFrame(record);
      record.node.removeFromParent();
    }
    records = [];
    active = false;
    slideCameras = null;
    return taken;
  }
  function begin(fromRecords, toRecords, floorOrder, spread, useSlide = false, slideAxis = null) {
    const root = getRoot();
    const fromById = new Map(fromRecords.map(record => [record.id, record]));
    const toById = new Map(toRecords.map(record => [record.id, record]));
    const sharedTo = toRecords.find(record => fromById.has(record.id)) || toRecords[0];
    const sharedFrom = fromById.get(sharedTo.id) || fromRecords[0];
    const floorIndex = floorId => floorOrder.indexOf(floorId);
    const offsetFrame = (frame, indexDelta) => {
      const matrix = frame.clone();
      const offset = (useSlide ? Math.sign(indexDelta) : indexDelta) * spread;
      const axis = useSlide && slideAxis ? slideAxis : new THREE.Vector3(0, 1, 0);
      matrix.elements[12] += axis.x * offset;
      matrix.elements[13] += axis.y * offset;
      matrix.elements[14] += axis.z * offset;
      return matrix;
    };
    records = [];
    for (const record of toRecords) {
      const previous = fromById.get(record.id);
      const transform = (previous?.frame || offsetFrame(sharedFrom.frame, floorIndex(record.id) - floorIndex(sharedFrom.id))).clone().multiply(record.baseFrame.clone().invert());
      transform.decompose(record.node.position, record.node.quaternion, record.node.scale);
      record.from = decomposeTransform(transform);
      record.to = decomposeTransform(new THREE.Matrix4());
      record.keep = true;
      record.groundFrom = previous?.groundAlpha ?? 0;
      record.groundTo = 1;
      records.push(record);
      if (previous) {
        disposeRecord(previous, false);
      }
    }
    for (const record of fromRecords) {
      if (toById.has(record.id)) {
        continue;
      }
      root.add(record.node);
      const transform = offsetFrame(sharedTo.baseFrame, floorIndex(record.id) - floorIndex(sharedTo.id));
      record.from = decomposeTransform(record.node.matrix);
      record.to = decomposeTransform(transform.multiply(record.baseFrame.clone().invert()));
      record.keep = false;
      record.groundFrom = record.groundAlpha;
      record.groundTo = 0;
      records.push(record);
    }
    slideCameras = useSlide ? {
      direction: Math.sign(floorIndex(sharedTo.id) - floorIndex(sharedFrom.id)),
      spread
    } : null;
    active = true;
    suspendReflections(true);
    sample(0);
  }
  function finish() {
    if (!active && !records.length) {
      return;
    }
    const root = getRoot();
    for (const record of records) {
      if (record.keep && record.node.parent === root) {
        record.node.position.set(0, 0, 0);
        record.node.quaternion.identity();
        record.node.scale.set(1, 1, 1);
        record.node.updateMatrixWorld(true);
        restoreGround(record);
        for (const child of [...record.node.children]) {
          root.attach(child);
        }
        record.node.removeFromParent();
      } else {
        disposeRecord(record);
      }
    }
    records = [];
    active = false;
    slideCameras = null;
    suspendReflections(false);
    invalidate(true);
  }
  const cameraMatrixFromView = view => {
    const position = new THREE.Vector3().fromArray(view.position);
    const target = new THREE.Vector3().fromArray(view.target);
    return new THREE.Matrix4().lookAt(position, target, new THREE.Vector3().fromArray(view.up || [0, 1, 0])).setPosition(position);
  };
  function setSlideCameras(fromView, toView) {
    if (slideCameras) {
      slideCameras.from = cameraMatrixFromView(fromView).invert();
      slideCameras.to = cameraMatrixFromView(toView).invert();
      for (const record of records) {
        record.slideBase = record.keep ? new THREE.Matrix4() : new THREE.Matrix4().compose(record.from.position, record.from.quaternion, record.from.scale);
      }
    }
  }
  function sample(progress, cameraView = null) {
    if (!active) {
      return;
    }
    if (records.some(record => record.keep && record.node.parent !== getRoot())) {
      finish();
      return;
    }
    const t = Math.max(0, Math.min(1, progress));
    for (const record of records) {
      if (slideCameras?.from && cameraView) {
        const slideOffset = slideCameras.direction * slideCameras.spread * (record.keep ? 1 - t : -t);
        cameraMatrixFromView(cameraView).multiply(new THREE.Matrix4().makeTranslation(0, slideOffset, 0)).multiply(record.keep ? slideCameras.to : slideCameras.from).multiply(record.slideBase).decompose(record.node.position, record.node.quaternion, record.node.scale);
      } else {
        record.node.position.lerpVectors(record.from.position, record.to.position, t);
        record.node.quaternion.slerpQuaternions(record.from.quaternion, record.to.quaternion, t);
        record.node.scale.lerpVectors(record.from.scale, record.to.scale, t);
      }
      record.node.updateMatrixWorld(true);
      record.groundAlpha = record.groundFrom + (record.groundTo - record.groundFrom) * t;
      for (const ground of record.ground) {
        ground.materials.forEach((material, index) => {
          material.opacity = ground.opacity[index] * (ground.followsFloor ? 1 : record.groundAlpha);
        });
      }
    }
    invalidate(false);
    if (t === 1) {
      finish();
    }
  }
  return {
    capture,
    take,
    reuse,
    begin,
    sample,
    setSlideCameras,
    finish,
    get active() {
      return active;
    },
    get records() {
      return records;
    }
  };
}
