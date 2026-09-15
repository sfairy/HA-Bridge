export function createFloorTransition({
  THREE: three,
  getRoot: getRootObject,
  dispose: onDispose,
  release: onRelease = () => false,
  suspendReflections: onSuspendReflections = () => {},
  invalidate: onInvalidate = () => {}
}) {
  let activeRecords = [];
  let isTransitionActive = false;
  let slideState = null;
  let exitState = null;
  let assemblyState = null;
  const decomposeMatrix = matrix => {
    const positionVector = new three.Vector3();
    const quaternionValue = new three.Quaternion();
    const scaleVector = new three.Vector3();
    matrix.decompose(positionVector, quaternionValue, scaleVector);
    return {
      position: positionVector,
      quaternion: quaternionValue,
      scale: scaleVector
    };
  };
  function captureFloors(captureFloorIds, getBaseFrame, groupByFloorId) {
    const rootObject = getRootObject();
    rootObject.updateMatrixWorld(true);
    return captureFloorIds.map(floorId => {
      const floorGroup = new three.Group();
      floorGroup.name = "floor-transition-" + floorId;
      floorGroup.userData.floorId = floorGroup.userData.regionFloorId = floorId;
      const sourceChildren = groupByFloorId
        ? rootObject.children.filter(matchedChild => matchedChild.userData.floorId === floorId)
        : [...rootObject.children];
      rootObject.add(floorGroup);
      for (const childObject of sourceChildren) {
        floorGroup.attach(childObject);
      }
      const record = {
        id: floorId,
        node: floorGroup,
        baseFrame: getBaseFrame(floorId),
        ground: [],
        groundAlpha: 1
      };
      floorGroup.traverse(sceneNode => {
        if (
          !sceneNode.material ||
          !["background", "grid", "contact-shadow"].includes(sceneNode.userData?.exportRole)
        ) {
          return;
        }
        const originalMaterial = sceneNode.material;
        const cloneGroundMaterial = material => {
          const clonedMaterial = material.clone();
          clonedMaterial.onBeforeCompile = material.onBeforeCompile;
          clonedMaterial.customProgramCacheKey = material.customProgramCacheKey.bind(material);
          clonedMaterial.transparent = true;
          clonedMaterial.depthWrite = false;
          return clonedMaterial;
        };
        sceneNode.material = Array.isArray(originalMaterial)
          ? originalMaterial.map(cloneGroundMaterial)
          : cloneGroundMaterial(originalMaterial);
        record.ground.push({
          node: sceneNode,
          followsFloor: sceneNode.userData.exportRole === "contact-shadow",
          original: originalMaterial,
          materials: Array.isArray(sceneNode.material) ? sceneNode.material : [sceneNode.material],
          opacity: (Array.isArray(originalMaterial) ? originalMaterial : [originalMaterial]).map(
            sourceMaterial => sourceMaterial.opacity
          )
        });
      });
      return record;
    });
  }
  function computeRecordFrame(capturedRecord) {
    capturedRecord.node.updateMatrix();
    return capturedRecord.node.matrix.clone().multiply(capturedRecord.baseFrame);
  }
  function restoreGroundMaterials(floorRecord) {
    for (const groundEntry of floorRecord.ground) {
      groundEntry.node.material = groundEntry.original;
      for (const disposableMaterial of groundEntry.materials) {
        disposableMaterial.dispose();
      }
    }
    floorRecord.ground = [];
  }
  function detachRecord(leavingRecord, shouldDispose = true) {
    restoreGroundMaterials(leavingRecord);
    leavingRecord.node.removeFromParent();
    if (!leavingRecord.transferred && (!shouldDispose || !onRelease(leavingRecord))) {
      onDispose(leavingRecord.node);
    }
  }
  function reuseRecord(cachedRecord, targetFrame) {
    restoreGroundMaterials(cachedRecord);
    const cachedChildren = [...cachedRecord.node.children];
    let reusedNode;
    if (cachedChildren.length === 1 && cachedChildren[0].userData.floorId === cachedRecord.id) {
      reusedNode = cachedChildren[0];
      cachedRecord.node.remove(reusedNode);
    } else {
      reusedNode = new three.Group();
      reusedNode.name = "floor-" + cachedRecord.id;
      reusedNode.userData.floorId = reusedNode.userData.regionFloorId = cachedRecord.id;
      for (const cachedChild of cachedChildren) {
        cachedRecord.node.remove(cachedChild);
        reusedNode.add(cachedChild);
      }
    }
    reusedNode.applyMatrix4(targetFrame.clone().multiply(cachedRecord.baseFrame.clone().invert()));
    getRootObject().add(reusedNode);
    reusedNode.updateMatrixWorld(true);
    cachedRecord.transferred = true;
    return reusedNode;
  }
  function takeRecords(takeFloorIds, resolveBaseFrame, takeGroupByFloorId) {
    onSuspendReflections(true);
    const takenRecords = isTransitionActive
      ? activeRecords
      : captureFloors(takeFloorIds, resolveBaseFrame, takeGroupByFloorId);
    for (const takenRecord of takenRecords) {
      takenRecord.frame = computeRecordFrame(takenRecord);
      takenRecord.node.removeFromParent();
    }
    activeRecords = [];
    isTransitionActive = false;
    slideState = null;
    exitState = null;
    assemblyState = null;
    return takenRecords;
  }
  function beginTransition(
    previousRecords,
    nextRecords,
    floorOrder,
    floorSpread,
    isScrollTransition = false,
    scrollAxis = null,
    targetFloorId = null
  ) {
    const sceneRoot = getRootObject();
    const previousById = new Map(
      previousRecords.map(previousEntry => [previousEntry.id, previousEntry])
    );
    const nextById = new Map(nextRecords.map(nextEntry => [nextEntry.id, nextEntry]));
    const focusRecord =
      nextRecords.find(targetCandidate => targetCandidate.id === targetFloorId) ||
      nextRecords.find(keptCandidate => previousById.get(keptCandidate.id)?.keep) ||
      nextRecords.find(sharedCandidate => previousById.has(sharedCandidate.id)) ||
      nextRecords[0];
    const anchorRecord = previousById.get(focusRecord.id) || previousRecords[0];
    const handoffMatrix =
      !isScrollTransition && nextRecords.length > 1
        ? anchorRecord.frame.clone().multiply(focusRecord.baseFrame.clone().invert())
        : null;
    assemblyState = handoffMatrix ? decomposeMatrix(handoffMatrix) : null;
    if (assemblyState) {
      assemblyState.anchorId = focusRecord.id;
    }
    const keptPreviousRecord =
      previousRecords.find(keptEntry => keptEntry.keep) || previousRecords[0];
    const orderIndexOf = orderFloorId => floorOrder.indexOf(orderFloorId);
    const scrollAnchorRecord = previousRecords.find(scrollingEntry =>
      Number.isFinite(scrollingEntry.scrollPosition)
    );
    const offsetFrameBySteps = (frameMatrix, stepDelta) => {
      const offsetFrame = frameMatrix.clone();
      const offsetMeters = stepDelta * floorSpread;
      const axisVector = isScrollTransition && scrollAxis ? scrollAxis : new three.Vector3(0, 1, 0);
      offsetFrame.elements[12] += axisVector.x * offsetMeters;
      offsetFrame.elements[13] += axisVector.y * offsetMeters;
      offsetFrame.elements[14] += axisVector.z * offsetMeters;
      return offsetFrame;
    };
    activeRecords = [];
    for (const nextRecord of nextRecords) {
      const previousRecord = previousById.get(nextRecord.id);
      const recordFrame =
        previousRecord?.frame ||
        offsetFrameBySteps(
          anchorRecord.frame,
          orderIndexOf(nextRecord.id) - orderIndexOf(anchorRecord.id)
        );
      nextRecord.assemblyOffset =
        !previousRecord && handoffMatrix
          ? (orderIndexOf(nextRecord.id) - orderIndexOf(focusRecord.id)) * floorSpread
          : null;
      const assemblyFrame =
        nextRecord.assemblyOffset !== null
          ? handoffMatrix
              .clone()
              .multiply(new three.Matrix4().makeTranslation(0, nextRecord.assemblyOffset, 0))
          : recordFrame.clone().multiply(nextRecord.baseFrame.clone().invert());
      nextRecord.assemblyRelative = handoffMatrix
        ? decomposeMatrix(handoffMatrix.clone().invert().multiply(assemblyFrame))
        : null;
      assemblyFrame.decompose(
        nextRecord.node.position,
        nextRecord.node.quaternion,
        nextRecord.node.scale
      );
      nextRecord.scrollOffset = previousRecord?.scrollOffset;
      nextRecord.wasVisible = !!previousRecord;
      nextRecord.from = decomposeMatrix(assemblyFrame);
      nextRecord.to = decomposeMatrix(new three.Matrix4());
      nextRecord.keep = !isScrollTransition || nextRecord.id === focusRecord.id;
      nextRecord.node.userData.floorTransitionLeaving = !nextRecord.keep;
      nextRecord.groundFrom = previousRecord?.groundAlpha ?? 0;
      nextRecord.groundTo = nextRecord.keep ? 1 : 0;
      activeRecords.push(nextRecord);
      if (previousRecord) {
        detachRecord(previousRecord, false);
      }
    }
    for (const restoredRecord of previousRecords) {
      if (nextById.has(restoredRecord.id)) {
        continue;
      }
      sceneRoot.add(restoredRecord.node);
      const restoredFrame = offsetFrameBySteps(
        focusRecord.baseFrame,
        orderIndexOf(restoredRecord.id) - orderIndexOf(focusRecord.id)
      );
      restoredRecord.from = decomposeMatrix(restoredRecord.node.matrix);
      restoredRecord.to = decomposeMatrix(
        restoredFrame.multiply(restoredRecord.baseFrame.clone().invert())
      );
      restoredRecord.keep = false;
      restoredRecord.node.userData.floorTransitionLeaving = true;
      restoredRecord.wasVisible = true;
      restoredRecord.groundFrom = restoredRecord.groundAlpha;
      restoredRecord.groundTo = 0;
      activeRecords.push(restoredRecord);
    }
    slideState = isScrollTransition
      ? {
          spread: scrollAnchorRecord?.scrollSpacing || floorSpread,
          order: [...floorOrder],
          screenSpacing: scrollAnchorRecord?.scrollScreenSpacing,
          scrollFrom: scrollAnchorRecord?.scrollPosition ?? orderIndexOf(keptPreviousRecord.id),
          scrollTo: orderIndexOf(focusRecord.id)
        }
      : null;
    exitState =
      !isScrollTransition && nextRecords.length === 1
        ? {
            target: focusRecord.id,
            order: [...floorOrder]
          }
        : null;
    if (!slideState) {
      for (const staleRecord of activeRecords) {
        delete staleRecord.scrollPosition;
        delete staleRecord.scrollSpacing;
        delete staleRecord.scrollScreenSpacing;
        delete staleRecord.scrollOffset;
      }
    }
    for (const easeRecord of activeRecords) {
      easeRecord.departureEase =
        !isScrollTransition && nextRecords.length === 1 && !easeRecord.keep;
    }
    isTransitionActive = true;
    onSuspendReflections(true);
    sampleTransition(0);
  }
  function finishTransition() {
    if (!isTransitionActive && !activeRecords.length) {
      return;
    }
    const finishRoot = getRootObject();
    for (const finishedRecord of activeRecords) {
      if (finishedRecord.keep && finishedRecord.node.parent === finishRoot) {
        finishedRecord.node.position.set(0, 0, 0);
        finishedRecord.node.quaternion.identity();
        finishedRecord.node.scale.set(1, 1, 1);
        finishedRecord.node.updateMatrixWorld(true);
        restoreGroundMaterials(finishedRecord);
        for (const releasedChild of [...finishedRecord.node.children]) {
          finishRoot.attach(releasedChild);
        }
        finishedRecord.node.removeFromParent();
      } else {
        detachRecord(finishedRecord);
      }
    }
    activeRecords = [];
    isTransitionActive = false;
    slideState = null;
    exitState = null;
    assemblyState = null;
    onSuspendReflections(false);
    onInvalidate(true);
  }
  const computeCameraFrame = cameraDescriptor => {
    const cameraPosition = new three.Vector3().fromArray(cameraDescriptor.position);
    const cameraTarget = new three.Vector3().fromArray(cameraDescriptor.target);
    return new three.Matrix4()
      .lookAt(
        cameraPosition,
        cameraTarget,
        new three.Vector3().fromArray(cameraDescriptor.up || [0, 1, 0])
      )
      .setPosition(cameraPosition);
  };
  function prepareSlideCameras(fromCameraSpec, toCameraSpec, projections = null) {
    if (assemblyState && projections) {
      const fromViewMatrix = computeCameraFrame(fromCameraSpec).invert();
      const toViewMatrix = computeCameraFrame(toCameraSpec).invert();
      const assemblyAnchorRecord = activeRecords.find(
        anchorEntry => anchorEntry.id === assemblyState.anchorId
      );
      const centersById = new Map(
        activeRecords.map(centerRecord => {
          const worldBounds = new three.Box3();
          centerRecord.node.updateWorldMatrix(true, true);
          const inverseNodeWorld = centerRecord.node.matrixWorld.clone().invert();
          centerRecord.node.traverseVisible(meshNode => {
            if (
              !!meshNode.isMesh &&
              !!meshNode.geometry &&
              !["background", "grid", "contact-shadow"].includes(meshNode.userData?.exportRole)
            ) {
              if (!meshNode.geometry.boundingBox) {
                meshNode.geometry.computeBoundingBox();
              }
              if (meshNode.geometry.boundingBox) {
                worldBounds.union(
                  meshNode.geometry.boundingBox
                    .clone()
                    .applyMatrix4(inverseNodeWorld.clone().multiply(meshNode.matrixWorld))
                );
              }
            }
          });
          return [
            centerRecord.id,
            worldBounds.isEmpty()
              ? new three.Vector3().setFromMatrixPosition(centerRecord.baseFrame)
              : worldBounds.getCenter(new three.Vector3())
          ];
        })
      );
      const anchorCenter = centersById
        .get(assemblyAnchorRecord.id)
        .clone()
        .applyMatrix4(
          new three.Matrix4().compose(
            assemblyAnchorRecord.from.position,
            assemblyAnchorRecord.from.quaternion,
            assemblyAnchorRecord.from.scale
          )
        )
        .applyMatrix4(fromViewMatrix);
      for (const assemblyRecord of activeRecords) {
        const recordCenter = centersById.get(assemblyRecord.id);
        const recordWorldFrame = fromViewMatrix
          .clone()
          .multiply(
            new three.Matrix4().compose(
              assemblyRecord.from.position,
              assemblyRecord.from.quaternion,
              assemblyRecord.from.scale
            )
          );
        const toViewFrame = toViewMatrix.clone();
        const screenFrom = recordCenter.clone().applyMatrix4(recordWorldFrame);
        const screenTo = recordCenter.clone().applyMatrix4(toViewFrame);
        if (!assemblyRecord.wasVisible) {
          const anchorProjectionScale = projectedScaleAtDepth(projections.from, -anchorCenter.z);
          const assemblySign =
            (assemblyRecord.assemblyOffset /
              Math.max(0.001, Math.abs(assemblyRecord.assemblyOffset))) *
            1.8;
          screenFrom.copy(anchorCenter);
          screenFrom.y += assemblySign * anchorProjectionScale;
          const closerCount = activeRecords.filter(
            otherRecord =>
              !otherRecord.wasVisible &&
              Math.sign(otherRecord.assemblyOffset) === Math.sign(assemblyRecord.assemblyOffset) &&
              Math.abs(otherRecord.assemblyOffset) < Math.abs(assemblyRecord.assemblyOffset)
          ).length;
          screenFrom.y += assemblySign * anchorProjectionScale * closerCount;
        }
        const projectToScreenSpace = (worldPoint, screenProjection) => {
          const depthScale = projectedScaleAtDepth(screenProjection, -worldPoint.z);
          return new three.Vector3(
            worldPoint.x / depthScale,
            worldPoint.y / depthScale,
            -worldPoint.z
          );
        };
        const screenStart = projectToScreenSpace(screenFrom, projections.from);
        const screenEnd = projectToScreenSpace(screenTo, projections.to);
        if (!assemblyRecord.wasVisible) {
          screenStart.x = screenEnd.x;
        }
        assemblyRecord.assemblyScreen = {
          pivot: recordCenter,
          from: decomposeMatrix(assemblyRecord.wasVisible ? recordWorldFrame : toViewFrame),
          to: decomposeMatrix(toViewFrame),
          start: screenStart,
          end: screenEnd
        };
      }
      return;
    }
    if (!slideState) {
      if (!exitState || !projections) {
        return;
      }
      const exitViewMatrix = computeCameraFrame(fromCameraSpec).invert();
      for (const exitingRecord of activeRecords) {
        if (exitingRecord.keep) {
          continue;
        }
        const exitStartFrame = exitViewMatrix
          .clone()
          .multiply(
            new three.Matrix4().compose(
              exitingRecord.from.position,
              exitingRecord.from.quaternion,
              exitingRecord.from.scale
            )
          );
        const exitSign = Math.sign(
          exitState.order.indexOf(exitingRecord.id) - exitState.order.indexOf(exitState.target)
        );
        let exitLift = 0;
        exitingRecord.node.updateWorldMatrix(true, true);
        const inverseExitWorld = exitingRecord.node.matrixWorld.clone().invert();
        exitingRecord.node.traverseVisible(exitMeshNode => {
          if (
            !exitMeshNode.isMesh ||
            !exitMeshNode.geometry ||
            ["background", "grid", "contact-shadow"].includes(exitMeshNode.userData?.exportRole)
          ) {
            return;
          }
          if (!exitMeshNode.geometry.boundingBox) {
            exitMeshNode.geometry.computeBoundingBox();
          }
          const exitMeshBounds = exitMeshNode.geometry.boundingBox;
          if (!exitMeshBounds || exitMeshBounds.isEmpty()) {
            return;
          }
          const boundsToWorld = exitStartFrame
            .clone()
            .multiply(inverseExitWorld)
            .multiply(exitMeshNode.matrixWorld);
          for (const exitCornerX of [exitMeshBounds.min.x, exitMeshBounds.max.x]) {
            for (const exitCornerY of [exitMeshBounds.min.y, exitMeshBounds.max.y]) {
              for (const exitCornerZ of [exitMeshBounds.min.z, exitMeshBounds.max.z]) {
                const cornerPoint = new three.Vector3(
                  exitCornerX,
                  exitCornerY,
                  exitCornerZ
                ).applyMatrix4(boundsToWorld);
                for (const exitProjection of [projections.from, projections.to]) {
                  const projectedHeight =
                    (exitProjection.height *
                      (1 -
                        exitProjection.weight +
                        (exitProjection.weight * Math.max(0.001, -cornerPoint.z)) /
                          Math.max(0.001, exitProjection.distance))) /
                    2;
                  exitLift = Math.max(exitLift, projectedHeight * 1.12 - exitSign * cornerPoint.y);
                }
              }
            }
          }
        });
        exitingRecord.exitFrom = decomposeMatrix(exitStartFrame);
        exitStartFrame.elements[13] += exitSign * exitLift;
        exitingRecord.exitTo = decomposeMatrix(exitStartFrame);
      }
      return;
    }
    slideState.from = computeCameraFrame(fromCameraSpec).invert();
    slideState.to = computeCameraFrame(toCameraSpec).invert();
    slideState.projected = !!projections;
    slideState.projections = projections;
    const withVerticalOffset = (baseSlideFrame, offsetY) =>
      new three.Matrix4().makeTranslation(0, offsetY, 0).multiply(baseSlideFrame);
    const projectedScaleAtZ = (slideProjection, worldZ) =>
      Math.max(
        0.001,
        (slideProjection.height *
          (1 -
            slideProjection.weight +
            (slideProjection.weight * Math.max(0.001, -worldZ)) /
              Math.max(0.001, slideProjection.distance))) /
          2
      );
    const slideCandidates = activeRecords.map(slideRecord => {
      const worldFrame = slideState.from
        .clone()
        .multiply(
          new three.Matrix4().compose(
            slideRecord.from.position,
            slideRecord.from.quaternion,
            slideRecord.from.scale
          )
        );
      if (!projections) {
        return {
          r: slideRecord,
          current: worldFrame
        };
      }
      if (slideRecord.wasVisible) {
        worldFrame.elements[13] -= slideRecord.scrollOffset || 0;
      }
      slideRecord.node.updateWorldMatrix(true, true);
      const inverseSlideWorld = slideRecord.node.matrixWorld.clone().invert();
      const recordBounds = new three.Box3();
      const boundCorners = [];
      slideRecord.node.traverseVisible(boundsMeshNode => {
        if (
          !!boundsMeshNode.isMesh &&
          !!boundsMeshNode.geometry &&
          !["background", "grid", "contact-shadow"].includes(boundsMeshNode.userData?.exportRole) &&
          (boundsMeshNode.geometry.boundingBox || boundsMeshNode.geometry.computeBoundingBox(),
          boundsMeshNode.geometry.boundingBox && !boundsMeshNode.geometry.boundingBox.isEmpty())
        ) {
          const meshToWorld = inverseSlideWorld.clone().multiply(boundsMeshNode.matrixWorld);
          const meshBoundingBox = boundsMeshNode.geometry.boundingBox;
          recordBounds.union(meshBoundingBox.clone().applyMatrix4(meshToWorld));
          for (const cornerX of [meshBoundingBox.min.x, meshBoundingBox.max.x]) {
            for (const cornerY of [meshBoundingBox.min.y, meshBoundingBox.max.y]) {
              for (const cornerZ of [meshBoundingBox.min.z, meshBoundingBox.max.z]) {
                boundCorners.push(
                  new three.Vector3(cornerX, cornerY, cornerZ).applyMatrix4(meshToWorld)
                );
              }
            }
          }
        }
      });
      slideRecord.scrollCenter = recordBounds.isEmpty()
        ? new three.Vector3()
        : recordBounds.getCenter(new three.Vector3());
      slideRecord.projectionFrom = slideRecord.wasVisible ? projections.from : projections.to;
      slideRecord.projectionTo =
        slideRecord.keep || !slideRecord.wasVisible ? projections.to : projections.from;
      let exitExtentValue = 0;
      if (!recordBounds.isEmpty()) {
        for (const [pairMatrix, pairProjection] of [
          [slideRecord.wasVisible ? worldFrame : slideState.to, slideRecord.projectionFrom],
          [
            slideRecord.keep || !slideRecord.wasVisible ? slideState.to : worldFrame,
            slideRecord.projectionTo
          ]
        ]) {
          for (const cornerVector of boundCorners) {
            const transformedCorner = cornerVector.clone().applyMatrix4(pairMatrix);
            const orderIndex = slideState.order.indexOf(slideRecord.id);
            const directionalExtent =
              orderIndex === 0
                ? transformedCorner.y
                : orderIndex === slideState.order.length - 1
                  ? -transformedCorner.y
                  : Math.abs(transformedCorner.y);
            exitExtentValue = Math.max(
              exitExtentValue,
              directionalExtent / projectedScaleAtZ(pairProjection, transformedCorner.z)
            );
          }
        }
      }
      slideRecord.scrollExitExtent = exitExtentValue;
      return {
        r: slideRecord,
        current: worldFrame,
        extent: exitExtentValue,
        corners: boundCorners
      };
    });
    if (projections && !Number.isFinite(slideState.screenSpacing)) {
      slideState.screenSpacing = Math.min(
        1.8,
        Math.max(1.24, ...slideCandidates.map(extentCandidate => 1 + extentCandidate.extent + 0.24))
      );
    }
    for (const {
      r: candidateRecord,
      current: candidateFrame,
      corners: candidateCorners
    } of slideCandidates) {
      const recordOrderIndex = slideState.order.indexOf(candidateRecord.id);
      if (projections) {
        if (candidateRecord.wasVisible && !Number.isFinite(candidateRecord.scrollOffset)) {
          const scrollCenterPoint = candidateRecord.scrollCenter
            .clone()
            .applyMatrix4(candidateFrame);
          candidateFrame.elements[13] -=
            (recordOrderIndex - slideState.scrollFrom) *
            slideState.screenSpacing *
            projectedScaleAtZ(projections.from, scrollCenterPoint.z);
        }
        candidateRecord.slideFrom = decomposeMatrix(
          candidateRecord.wasVisible ? candidateFrame : slideState.to
        );
        candidateRecord.slideTo = decomposeMatrix(
          candidateRecord.keep || !candidateRecord.wasVisible ? slideState.to : candidateFrame
        );
        if (!candidateRecord.keep) {
          const scaledSlideFrame = new three.Matrix4().compose(
            candidateRecord.slideTo.position,
            candidateRecord.slideTo.quaternion,
            candidateRecord.slideTo.scale
          );
          const slideExitDepth = -candidateRecord.scrollCenter
            .clone()
            .applyMatrix4(scaledSlideFrame).z;
          const slideExitScale = projectedScaleAtZ(projections.to, -slideExitDepth);
          const scaleRatio =
            slideExitScale / projectedScaleAtZ(candidateRecord.projectionTo, -slideExitDepth);
          scaledSlideFrame.premultiply(
            new three.Matrix4().makeScale(scaleRatio, scaleRatio, scaleRatio)
          );
          scaledSlideFrame.elements[14] += slideExitDepth * (scaleRatio - 1);
          scaledSlideFrame.elements[13] +=
            (recordOrderIndex - slideState.scrollTo) * slideState.screenSpacing * slideExitScale;
          const slideSign = Math.sign(recordOrderIndex - slideState.scrollTo);
          candidateRecord.scrollExitExtra = Math.max(
            0,
            ...candidateCorners.map(corner => {
              const cornerInFrame = corner.clone().applyMatrix4(scaledSlideFrame);
              return (
                (projectedScaleAtZ(projections.to, cornerInFrame.z) * 1.14 -
                  slideSign * cornerInFrame.y) /
                slideExitScale
              );
            })
          );
        }
      } else {
        candidateRecord.slideFrom = decomposeMatrix(
          candidateRecord.wasVisible
            ? candidateFrame
            : withVerticalOffset(
                slideState.to,
                (recordOrderIndex - slideState.scrollFrom) * slideState.spread
              )
        );
        candidateRecord.slideTo = decomposeMatrix(
          candidateRecord.keep
            ? slideState.to
            : candidateRecord.wasVisible
              ? withVerticalOffset(
                  candidateFrame,
                  (slideState.scrollFrom - slideState.scrollTo) * slideState.spread
                )
              : withVerticalOffset(
                  slideState.to,
                  (recordOrderIndex - slideState.scrollTo) * slideState.spread
                )
        );
      }
    }
  }
  function projectedScaleAtDepth(projectionSpec, depthValue) {
    return Math.max(
      0.001,
      (projectionSpec.height *
        (1 -
          projectionSpec.weight +
          (projectionSpec.weight * Math.max(0.001, depthValue)) /
            Math.max(0.001, projectionSpec.distance))) /
        2
    );
  }
  function sampleTransition(progressRatio, cameraSpec = null, projectionParams = null) {
    if (!isTransitionActive) {
      return;
    }
    if (
      activeRecords.some(
        staleEntry => staleEntry.keep && staleEntry.node.parent !== getRootObject()
      )
    ) {
      finishTransition();
      return;
    }
    const clampedProgress = Math.max(0, Math.min(1, progressRatio));
    if (!projectionParams && slideState?.projections) {
      const { from: projectionFrom, to: projectionTo } = slideState.projections;
      projectionParams = Object.fromEntries(
        ["height", "weight", "distance"].map(projectionKey => [
          projectionKey,
          projectionFrom[projectionKey] +
            (projectionTo[projectionKey] - projectionFrom[projectionKey]) * clampedProgress
        ])
      );
    }
    for (const sampledRecord of activeRecords) {
      if (slideState) {
        sampledRecord.scrollPosition =
          slideState.scrollFrom + (slideState.scrollTo - slideState.scrollFrom) * clampedProgress;
        sampledRecord.scrollSpacing = slideState.spread;
        sampledRecord.scrollScreenSpacing = slideState.screenSpacing;
      }
      if (assemblyState && sampledRecord.assemblyScreen && cameraSpec && projectionParams) {
        const assemblyScreen = sampledRecord.assemblyScreen;
        const screenPoint = assemblyScreen.start.clone().lerp(assemblyScreen.end, clampedProgress);
        const screenScale = projectedScaleAtDepth(projectionParams, screenPoint.z);
        const screenFrame = new three.Matrix4().compose(
          new three.Vector3(),
          new three.Quaternion().slerpQuaternions(
            assemblyScreen.from.quaternion,
            assemblyScreen.to.quaternion,
            clampedProgress
          ),
          assemblyScreen.from.scale.clone().lerp(assemblyScreen.to.scale, clampedProgress)
        );
        const pivotPoint = assemblyScreen.pivot.clone().applyMatrix4(screenFrame);
        screenFrame.setPosition(
          new three.Vector3(
            screenPoint.x * screenScale,
            screenPoint.y * screenScale,
            -screenPoint.z
          ).sub(pivotPoint)
        );
        computeCameraFrame(cameraSpec)
          .multiply(screenFrame)
          .decompose(
            sampledRecord.node.position,
            sampledRecord.node.quaternion,
            sampledRecord.node.scale
          );
      } else if (assemblyState && sampledRecord.assemblyRelative) {
        const assemblyRelative = sampledRecord.assemblyRelative;
        const assemblyEase = 1 - (1 - clampedProgress) * (1 - clampedProgress);
        const relativeFrame = new three.Matrix4().compose(
          new three.Vector3(
            assemblyRelative.position.x * (1 - assemblyEase),
            assemblyRelative.position.y * (1 - clampedProgress),
            assemblyRelative.position.z * (1 - assemblyEase)
          ),
          new three.Quaternion().slerpQuaternions(
            assemblyRelative.quaternion,
            new three.Quaternion(),
            assemblyEase
          ),
          new three.Vector3().lerpVectors(
            assemblyRelative.scale,
            new three.Vector3(1, 1, 1),
            assemblyEase
          )
        );
        new three.Matrix4()
          .compose(
            assemblyState.position.clone().multiplyScalar(1 - clampedProgress),
            new three.Quaternion().slerpQuaternions(
              assemblyState.quaternion,
              new three.Quaternion(),
              clampedProgress
            ),
            new three.Vector3().lerpVectors(
              assemblyState.scale,
              new three.Vector3(1, 1, 1),
              clampedProgress
            )
          )
          .multiply(relativeFrame)
          .decompose(
            sampledRecord.node.position,
            sampledRecord.node.quaternion,
            sampledRecord.node.scale
          );
      } else if (exitState && !sampledRecord.keep && sampledRecord.exitFrom && cameraSpec) {
        const exitEase = clampedProgress * clampedProgress;
        const exitFrame = new three.Matrix4().compose(
          new three.Vector3().lerpVectors(
            sampledRecord.exitFrom.position,
            sampledRecord.exitTo.position,
            exitEase
          ),
          sampledRecord.exitFrom.quaternion,
          sampledRecord.exitFrom.scale
        );
        computeCameraFrame(cameraSpec)
          .multiply(exitFrame)
          .decompose(
            sampledRecord.node.position,
            sampledRecord.node.quaternion,
            sampledRecord.node.scale
          );
      } else if (slideState?.from && cameraSpec) {
        const slideFrame = new three.Matrix4().compose(
          new three.Vector3().lerpVectors(
            sampledRecord.slideFrom.position,
            sampledRecord.slideTo.position,
            clampedProgress
          ),
          new three.Quaternion().slerpQuaternions(
            sampledRecord.slideFrom.quaternion,
            sampledRecord.slideTo.quaternion,
            clampedProgress
          ),
          new three.Vector3().lerpVectors(
            sampledRecord.slideFrom.scale,
            sampledRecord.slideTo.scale,
            clampedProgress
          )
        );
        if (slideState.projected && projectionParams) {
          const slideDepth = -sampledRecord.scrollCenter.clone().applyMatrix4(slideFrame).z;
          const slideScale =
            (projectionParams.height *
              (1 -
                projectionParams.weight +
                (projectionParams.weight * Math.max(0.001, slideDepth)) /
                  Math.max(0.001, projectionParams.distance))) /
            2;
          const projectionAtRecord = Object.fromEntries(
            ["height", "weight", "distance"].map(projectionField => [
              projectionField,
              sampledRecord.projectionFrom[projectionField] +
                (sampledRecord.projectionTo[projectionField] -
                  sampledRecord.projectionFrom[projectionField]) *
                  clampedProgress
            ])
          );
          const recordScale =
            (projectionAtRecord.height *
              (1 -
                projectionAtRecord.weight +
                (projectionAtRecord.weight * Math.max(0.001, slideDepth)) /
                  Math.max(0.001, projectionAtRecord.distance))) /
            2;
          const scaleCorrection = slideScale / Math.max(0.001, recordScale);
          slideFrame.premultiply(
            new three.Matrix4().makeScale(scaleCorrection, scaleCorrection, scaleCorrection)
          );
          slideFrame.elements[14] += slideDepth * (scaleCorrection - 1);
          sampledRecord.scrollOffset =
            (slideState.order.indexOf(sampledRecord.id) - sampledRecord.scrollPosition) *
            slideState.screenSpacing *
            slideScale;
          slideFrame.elements[13] += sampledRecord.scrollOffset;
          if (!sampledRecord.keep) {
            const exitDirection = Math.sign(
              slideState.order.indexOf(sampledRecord.id) - slideState.scrollTo
            );
            const exitExtra =
              sampledRecord.scrollExitExtra ??
              Math.max(
                0,
                1.14 +
                  (sampledRecord.scrollExitExtent || 0) -
                  Math.abs(slideState.order.indexOf(sampledRecord.id) - slideState.scrollTo) *
                    slideState.screenSpacing
              );
            const exitFade = Math.max(0, Math.min(1, (clampedProgress - 0.75) / 0.21));
            slideFrame.elements[13] +=
              exitDirection * exitExtra * slideScale * exitFade * exitFade * (3 - exitFade * 2);
          }
        }
        computeCameraFrame(cameraSpec)
          .multiply(slideFrame)
          .decompose(
            sampledRecord.node.position,
            sampledRecord.node.quaternion,
            sampledRecord.node.scale
          );
      } else {
        const easedProgress = sampledRecord.departureEase
          ? clampedProgress * clampedProgress
          : clampedProgress;
        sampledRecord.node.position.lerpVectors(
          sampledRecord.from.position,
          sampledRecord.to.position,
          easedProgress
        );
        sampledRecord.node.quaternion.slerpQuaternions(
          sampledRecord.from.quaternion,
          sampledRecord.to.quaternion,
          easedProgress
        );
        sampledRecord.node.scale.lerpVectors(
          sampledRecord.from.scale,
          sampledRecord.to.scale,
          easedProgress
        );
      }
      sampledRecord.node.updateMatrixWorld(true);
      sampledRecord.groundAlpha =
        sampledRecord.groundFrom +
        (sampledRecord.groundTo - sampledRecord.groundFrom) * clampedProgress;
      for (const recordGroundEntry of sampledRecord.ground) {
        recordGroundEntry.materials.forEach((groundMaterial, materialIndex) => {
          groundMaterial.opacity =
            recordGroundEntry.opacity[materialIndex] *
            (recordGroundEntry.followsFloor ? 1 : sampledRecord.groundAlpha);
        });
      }
    }
    onInvalidate(false);
    if (clampedProgress === 1) {
      finishTransition();
    }
  }
  return {
    capture: captureFloors,
    take: takeRecords,
    reuse: reuseRecord,
    begin: beginTransition,
    sample: sampleTransition,
    setSlideCameras: prepareSlideCameras,
    finish: finishTransition,
    get active() {
      return isTransitionActive;
    },
    get records() {
      return activeRecords;
    }
  };
}
