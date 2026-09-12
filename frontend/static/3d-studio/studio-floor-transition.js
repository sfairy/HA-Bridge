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
  let slide = null;
  let single = null;
  let anchor = null;
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
    suspendReflections(true);
    const taken = active ? records : capture(floorIds, getBaseFrame, filterByFloor);
    for (const record of taken) {
      record.frame = currentFrame(record);
      record.node.removeFromParent();
    }
    records = [];
    active = false;
    slide = null;
    single = null;
    anchor = null;
    return taken;
  }
  function begin(fromRecords, toRecords, floorOrder, spread, useSlide = false, slideAxis = null, anchorId = null) {
    const root = getRoot();
    const fromById = new Map(fromRecords.map(record => [record.id, record]));
    const toById = new Map(toRecords.map(record => [record.id, record]));
    const sharedTo = toRecords.find(record => record.id === anchorId) || toRecords.find(record => fromById.get(record.id)?.keep) || toRecords.find(record => fromById.has(record.id)) || toRecords[0];
    const sharedFrom = fromById.get(sharedTo.id) || fromRecords[0];
    const anchorFrame = !useSlide && toRecords.length > 1 ? sharedFrom.frame.clone().multiply(sharedTo.baseFrame.clone().invert()) : null;
    anchor = anchorFrame ? decomposeTransform(anchorFrame) : null;
    if (anchor) {
      anchor.anchorId = sharedTo.id;
    }
    const firstKept = fromRecords.find(record => record.keep) || fromRecords[0];
    const floorIndex = floorId => floorOrder.indexOf(floorId);
    const scrolled = fromRecords.find(record => Number.isFinite(record.scrollPosition));
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
      const targetFrame = previous?.frame || offsetFrame(sharedFrom.frame, floorIndex(record.id) - floorIndex(sharedFrom.id));
      record.assemblyOffset = !previous && anchorFrame ? (floorIndex(record.id) - floorIndex(sharedTo.id)) * spread : null;
      const transform = record.assemblyOffset !== null ? anchorFrame.clone().multiply(new THREE.Matrix4().makeTranslation(0, record.assemblyOffset, 0)) : targetFrame.clone().multiply(record.baseFrame.clone().invert());
      record.assemblyRelative = anchorFrame ? decomposeTransform(anchorFrame.clone().invert().multiply(transform)) : null;
      transform.decompose(record.node.position, record.node.quaternion, record.node.scale);
      record.scrollOffset = previous?.scrollOffset;
      record.wasVisible = !!previous;
      record.from = decomposeTransform(transform);
      record.to = decomposeTransform(new THREE.Matrix4());
      record.keep = !useSlide || record.id === sharedTo.id;
      record.node.userData.floorTransitionLeaving = !record.keep;
      record.groundFrom = previous?.groundAlpha ?? 0;
      record.groundTo = record.keep ? 1 : 0;
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
      record.node.userData.floorTransitionLeaving = true;
      record.wasVisible = true;
      record.groundFrom = record.groundAlpha;
      record.groundTo = 0;
      records.push(record);
    }
    slide = useSlide ? {
      spread: scrolled?.scrollSpacing || spread,
      order: [...floorOrder],
      screenSpacing: scrolled?.scrollScreenSpacing,
      scrollFrom: scrolled?.scrollPosition ?? floorIndex(firstKept.id),
      scrollTo: floorIndex(sharedTo.id)
    } : null;
    single = !useSlide && toRecords.length === 1 ? {
      target: sharedTo.id,
      order: [...floorOrder]
    } : null;
    if (!slide) {
      for (const record of records) {
        delete record.scrollPosition;
        delete record.scrollSpacing;
        delete record.scrollScreenSpacing;
        delete record.scrollOffset;
      }
    }
    for (const record of records) {
      record.departureEase = !useSlide && toRecords.length === 1 && !record.keep;
    }
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
    slide = null;
    single = null;
    anchor = null;
    suspendReflections(false);
    invalidate(true);
  }
  const cameraMatrixFromView = view => {
    const position = new THREE.Vector3().fromArray(view.position);
    const target = new THREE.Vector3().fromArray(view.target);
    return new THREE.Matrix4().lookAt(position, target, new THREE.Vector3().fromArray(view.up || [0, 1, 0])).setPosition(position);
  };
  function projectionRadius(view, z) {
    return Math.max(0.001, view.height * (1 - view.weight + view.weight * Math.max(0.001, z) / Math.max(0.001, view.distance)) / 2);
  }
  function measuredPivots() {
    const pivots = new Map(records.map(record => {
      const box = new THREE.Box3();
      record.node.updateWorldMatrix(true, true);
      const toLocal = record.node.matrixWorld.clone().invert();
      record.node.traverseVisible(mesh => {
        if (!mesh.isMesh || !mesh.geometry || ["background", "grid", "contact-shadow"].includes(mesh.userData?.exportRole)) {
          return;
        }
        mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox && !mesh.geometry.boundingBox.isEmpty()) {
          box.union(mesh.geometry.boundingBox.clone().applyMatrix4(toLocal.clone().multiply(mesh.matrixWorld)));
        }
      });
      return [record.id, box.isEmpty() ? new THREE.Vector3().setFromMatrixPosition(record.baseFrame) : box.getCenter(new THREE.Vector3())];
    }));
    return pivots;
  }
  function setSlideCameras(fromView, toView, projections = null) {
    if (anchor && projections) {
      const fromInverse = cameraMatrixFromView(fromView).invert();
      const toInverse = cameraMatrixFromView(toView).invert();
      const anchorRecord = records.find(record => record.id === anchor.anchorId);
      const pivots = measuredPivots();
      const anchorPivot = pivots.get(anchorRecord.id).clone().applyMatrix4(new THREE.Matrix4().compose(anchorRecord.from.position, anchorRecord.from.quaternion, anchorRecord.from.scale)).applyMatrix4(fromInverse);
      for (const record of records) {
        const pivot = pivots.get(record.id);
        const startMatrix = fromInverse.clone().multiply(new THREE.Matrix4().compose(record.from.position, record.from.quaternion, record.from.scale));
        const endMatrix = toInverse.clone();
        const start = pivot.clone().applyMatrix4(startMatrix);
        const end = pivot.clone().applyMatrix4(endMatrix);
        if (!record.wasVisible) {
          const depth = projectionRadius(projections.from, -anchorPivot.z);
          const direction = record.assemblyOffset / Math.max(0.001, Math.abs(record.assemblyOffset)) * 1.8;
          start.copy(anchorPivot);
          start.y += direction * depth;
          const hiddenBelow = records.filter(other => !other.wasVisible && Math.sign(other.assemblyOffset) === Math.sign(record.assemblyOffset) && Math.abs(other.assemblyOffset) < Math.abs(record.assemblyOffset)).length;
          start.y += direction * depth * hiddenBelow;
        }
        const project = (point, view) => {
          const radius = projectionRadius(view, -point.z);
          return new THREE.Vector3(point.x / radius, point.y / radius, -point.z);
        };
        const startScreen = project(start, projections.from);
        const endScreen = project(end, projections.to);
        if (!record.wasVisible) {
          startScreen.x = endScreen.x;
        }
        record.assemblyScreen = {
          pivot,
          from: decomposeTransform(record.wasVisible ? startMatrix : endMatrix),
          to: decomposeTransform(endMatrix),
          start: startScreen,
          end: endScreen
        };
      }
      return;
    }
    if (!slide) {
      if (!single || !projections) {
        return;
      }
      const fromInverse = cameraMatrixFromView(fromView).invert();
      for (const record of records) {
        if (record.keep) {
          continue;
        }
        const startMatrix = fromInverse.clone().multiply(new THREE.Matrix4().compose(record.from.position, record.from.quaternion, record.from.scale));
        const direction = Math.sign(single.order.indexOf(record.id) - single.order.indexOf(single.target));
        let extent = 0;
        record.node.updateWorldMatrix(true, true);
        const toLocal = record.node.matrixWorld.clone().invert();
        record.node.traverseVisible(mesh => {
          if (!mesh.isMesh || !mesh.geometry || ["background", "grid", "contact-shadow"].includes(mesh.userData?.exportRole)) {
            return;
          }
          mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();
          const box = mesh.geometry.boundingBox;
          if (!box || box.isEmpty()) {
            return;
          }
          const toWorld = startMatrix.clone().multiply(toLocal).multiply(mesh.matrixWorld);
          for (const x of [box.min.x, box.max.x]) {
            for (const y of [box.min.y, box.max.y]) {
              for (const z of [box.min.z, box.max.z]) {
                const corner = new THREE.Vector3(x, y, z).applyMatrix4(toWorld);
                for (const view of [projections.from, projections.to]) {
                  const radius = projectionRadius(view, corner.z);
                  extent = Math.max(extent, radius * 1.12 - direction * corner.y);
                }
              }
            }
          }
        });
        record.exitFrom = decomposeTransform(startMatrix);
        startMatrix.elements[13] += direction * extent;
        record.exitTo = decomposeTransform(startMatrix);
      }
      return;
    }
    slide.from = cameraMatrixFromView(fromView).invert();
    slide.to = cameraMatrixFromView(toView).invert();
    slide.projected = !!projections;
    slide.projections = projections;
    const translateFrame = (matrix, offsetY) => new THREE.Matrix4().makeTranslation(0, offsetY, 0).multiply(matrix);
    const measured = records.map(record => {
      const current = slide.from.clone().multiply(new THREE.Matrix4().compose(record.from.position, record.from.quaternion, record.from.scale));
      if (!projections) {
        return {
          record,
          current
        };
      }
      if (record.wasVisible) {
        current.elements[13] -= record.scrollOffset || 0;
      }
      record.node.updateWorldMatrix(true, true);
      const toLocal = record.node.matrixWorld.clone().invert();
      const box = new THREE.Box3();
      const corners = [];
      record.node.traverseVisible(mesh => {
        if (!mesh.isMesh || !mesh.geometry || ["background", "grid", "contact-shadow"].includes(mesh.userData?.exportRole)) {
          return;
        }
        mesh.geometry.boundingBox || mesh.geometry.computeBoundingBox();
        const geometryBox = mesh.geometry.boundingBox;
        if (!geometryBox || geometryBox.isEmpty()) {
          return;
        }
        const toWorld = toLocal.clone().multiply(mesh.matrixWorld);
        box.union(geometryBox.clone().applyMatrix4(toWorld));
        for (const x of [geometryBox.min.x, geometryBox.max.x]) {
          for (const y of [geometryBox.min.y, geometryBox.max.y]) {
            for (const z of [geometryBox.min.z, geometryBox.max.z]) {
              corners.push(new THREE.Vector3(x, y, z).applyMatrix4(toWorld));
            }
          }
        }
      });
      record.scrollCenter = box.isEmpty() ? new THREE.Vector3() : box.getCenter(new THREE.Vector3());
      record.projectionFrom = record.wasVisible ? projections.from : projections.to;
      record.projectionTo = record.keep || !record.wasVisible ? projections.to : projections.from;
      let extent = 0;
      if (!box.isEmpty()) {
        const positions = [[record.wasVisible ? current : slide.to, record.projectionFrom], [record.keep || !record.wasVisible ? slide.to : current, record.projectionTo]];
        for (const [matrix, view] of positions) {
          for (const corner of corners) {
            const transformed = corner.clone().applyMatrix4(matrix);
            const index = slide.order.indexOf(record.id);
            const offset = index === 0 ? transformed.y : index === slide.order.length - 1 ? -transformed.y : Math.abs(transformed.y);
            extent = Math.max(extent, offset / projectionRadius(view, transformed.z));
          }
        }
      }
      record.scrollExitExtent = extent;
      return {
        record,
        current,
        extent,
        corners
      };
    });
    if (projections && !Number.isFinite(slide.screenSpacing)) {
      slide.screenSpacing = Math.min(1.8, Math.max(1.24, ...measured.map(entry => 1 + entry.extent + 0.24)));
    }
    for (const { record, current, corners } of measured) {
      const index = slide.order.indexOf(record.id);
      if (projections) {
        if (record.wasVisible && !Number.isFinite(record.scrollOffset)) {
          const center = record.scrollCenter.clone().applyMatrix4(current);
          current.elements[13] -= (index - slide.scrollFrom) * slide.screenSpacing * projectionRadius(projections.from, center.z);
        }
        record.slideFrom = decomposeTransform(record.wasVisible ? current : slide.to);
        record.slideTo = decomposeTransform(record.keep || !record.wasVisible ? slide.to : current);
        if (!record.keep) {
          const targetMatrix = new THREE.Matrix4().compose(record.slideTo.position, record.slideTo.quaternion, record.slideTo.scale);
          const centerZ = -record.scrollCenter.clone().applyMatrix4(targetMatrix).z;
          const targetRadius = projectionRadius(projections.to, -centerZ);
          const scale = targetRadius / projectionRadius(record.projectionTo, -centerZ);
          targetMatrix.premultiply(new THREE.Matrix4().makeScale(scale, scale, scale));
          targetMatrix.elements[14] += centerZ * (scale - 1);
          targetMatrix.elements[13] += (index - slide.scrollTo) * slide.screenSpacing * targetRadius;
          const direction = Math.sign(index - slide.scrollTo);
          record.scrollExitExtra = Math.max(0, ...corners.map(corner => {
            const transformed = corner.clone().applyMatrix4(targetMatrix);
            return (1.14 * projectionRadius(projections.to, transformed.z) - direction * transformed.y) / targetRadius;
          }));
        }
      } else {
        record.slideFrom = decomposeTransform(record.wasVisible ? current : translateFrame(slide.to, (index - slide.scrollFrom) * slide.spread));
        record.slideTo = decomposeTransform(record.keep ? slide.to : record.wasVisible ? translateFrame(current, (slide.scrollFrom - slide.scrollTo) * slide.spread) : translateFrame(slide.to, (index - slide.scrollTo) * slide.spread));
      }
    }
  }
  function sample(progress, cameraView = null, projections = null) {
    if (!active) {
      return;
    }
    if (records.some(record => record.keep && record.node.parent !== getRoot())) {
      finish();
      return;
    }
    const t = Math.max(0, Math.min(1, progress));
    if (!projections && slide?.projections) {
      const { from, to } = slide.projections;
      projections = Object.fromEntries(["height", "weight", "distance"].map(key => [key, from[key] + (to[key] - from[key]) * t]));
    }
    for (const record of records) {
      if (slide) {
        record.scrollPosition = slide.scrollFrom + (slide.scrollTo - slide.scrollFrom) * t;
        record.scrollSpacing = slide.spread;
        record.scrollScreenSpacing = slide.screenSpacing;
      }
      if (anchor && record.assemblyScreen && cameraView && projections) {
        const assembly = record.assemblyScreen;
        const screen = assembly.start.clone().lerp(assembly.end, t);
        const radius = projectionRadius(projections, screen.z);
        const relative = new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion().slerpQuaternions(assembly.from.quaternion, assembly.to.quaternion, t), assembly.from.scale.clone().lerp(assembly.to.scale, t));
        const pivotWorld = assembly.pivot.clone().applyMatrix4(relative);
        relative.setPosition(new THREE.Vector3(screen.x * radius, screen.y * radius, -screen.z).sub(pivotWorld));
        cameraMatrixFromView(cameraView).multiply(relative).decompose(record.node.position, record.node.quaternion, record.node.scale);
      } else if (anchor && record.assemblyRelative) {
        const relative = record.assemblyRelative;
        const ease = 1 - (1 - t) * (1 - t);
        const local = new THREE.Matrix4().compose(new THREE.Vector3(relative.position.x * (1 - ease), relative.position.y * (1 - t), relative.position.z * (1 - ease)), new THREE.Quaternion().slerpQuaternions(relative.quaternion, new THREE.Quaternion(), ease), new THREE.Vector3().lerpVectors(relative.scale, new THREE.Vector3(1, 1, 1), ease));
        new THREE.Matrix4().compose(anchor.position.clone().multiplyScalar(1 - t), new THREE.Quaternion().slerpQuaternions(anchor.quaternion, new THREE.Quaternion(), t), new THREE.Vector3().lerpVectors(anchor.scale, new THREE.Vector3(1, 1, 1), t)).multiply(local).decompose(record.node.position, record.node.quaternion, record.node.scale);
      } else if (single && !record.keep && record.exitFrom && cameraView) {
        const ease = t * t;
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3().lerpVectors(record.exitFrom.position, record.exitTo.position, ease), record.exitFrom.quaternion, record.exitFrom.scale);
        cameraMatrixFromView(cameraView).multiply(matrix).decompose(record.node.position, record.node.quaternion, record.node.scale);
      } else if (slide?.from && cameraView) {
        const matrix = new THREE.Matrix4().compose(new THREE.Vector3().lerpVectors(record.slideFrom.position, record.slideTo.position, t), new THREE.Quaternion().slerpQuaternions(record.slideFrom.quaternion, record.slideTo.quaternion, t), new THREE.Vector3().lerpVectors(record.slideFrom.scale, record.slideTo.scale, t));
        if (slide.projected && projections) {
          const centerZ = -record.scrollCenter.clone().applyMatrix4(matrix).z;
          const startRadius = projectionRadius(projections, centerZ);
          const recordProjection = Object.fromEntries(["height", "weight", "distance"].map(key => [key, record.projectionFrom[key] + (record.projectionTo[key] - record.projectionFrom[key]) * t]));
          const endRadius = projectionRadius(recordProjection, centerZ);
          const ratio = startRadius / Math.max(0.001, endRadius);
          matrix.premultiply(new THREE.Matrix4().makeScale(ratio, ratio, ratio));
          matrix.elements[14] += centerZ * (ratio - 1);
          record.scrollOffset = (slide.order.indexOf(record.id) - record.scrollPosition) * slide.screenSpacing * startRadius;
          matrix.elements[13] += record.scrollOffset;
          if (!record.keep) {
            const direction = Math.sign(slide.order.indexOf(record.id) - slide.scrollTo);
            const extra = record.scrollExitExtra ?? Math.max(0, 1.14 + (record.scrollExitExtent || 0) - Math.abs(slide.order.indexOf(record.id) - slide.scrollTo) * slide.screenSpacing);
            const exitEase = Math.max(0, Math.min(1, (t - 0.75) / 0.21));
            matrix.elements[13] += direction * extra * startRadius * exitEase * exitEase * (3 - 2 * exitEase);
          }
        }
        cameraMatrixFromView(cameraView).multiply(matrix).decompose(record.node.position, record.node.quaternion, record.node.scale);
      } else {
        const eased = record.departureEase ? t * t : t;
        record.node.position.lerpVectors(record.from.position, record.to.position, eased);
        record.node.quaternion.slerpQuaternions(record.from.quaternion, record.to.quaternion, eased);
        record.node.scale.lerpVectors(record.from.scale, record.to.scale, eased);
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
