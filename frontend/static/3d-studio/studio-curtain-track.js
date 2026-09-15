const clampNumber = (rawValue, fallbackValue, minValue, maxValue) => {
  const parsedValue = rawValue == null || rawValue === "" ? NaN : Number(rawValue);
  if (Number.isFinite(parsedValue)) {
    return Math.max(minValue, Math.min(maxValue, parsedValue));
  } else {
    return fallbackValue;
  }
};
export function normalizeCurtainTrack(inputOptions = {}) {
  return {
    curtainTrack: ["straight", "l", "u"].includes(inputOptions.curtainTrack)
      ? inputOptions.curtainTrack
      : "straight",
    curtainCorner: inputOptions.curtainCorner === "left" ? "left" : "right",
    curtainLeftLength: clampNumber(inputOptions.curtainLeftLength, 1.2, 0.2, 7.8),
    curtainRightLength: clampNumber(inputOptions.curtainRightLength, 1.2, 0.2, 7.8),
    curtainMeet: clampNumber(inputOptions.curtainMeet, 50, 5, 95),
    curtainPreview: clampNumber(inputOptions.curtainPreview, 0, 0, 100),
    ...(inputOptions.curtainFabric === "cloth" || inputOptions.curtainFabric === "sheer"
      ? {
          curtainFabric: inputOptions.curtainFabric
        }
      : {})
  };
}
export function curtainFootprintDepth(trackConfig) {
  const trackModel = normalizeCurtainTrack(trackConfig);
  if (trackModel.curtainTrack === "straight") {
    return clampNumber(trackConfig.depth, 0.18, 0.05, 8);
  } else {
    return (
      0.18 +
      (trackModel.curtainTrack === "u"
        ? Math.max(trackModel.curtainLeftLength, trackModel.curtainRightLength)
        : trackModel.curtainCorner === "left"
          ? trackModel.curtainLeftLength
          : trackModel.curtainRightLength)
    );
  }
}
export function createCurtainTrack(options = {}) {
  const normalizedTrack = normalizeCurtainTrack(options);
  const width = clampNumber(options.width ?? options.curtainWidth, 1.8, 0.2, 8);
  const leftReturnLength =
    normalizedTrack.curtainTrack === "u" ||
    (normalizedTrack.curtainTrack === "l" && normalizedTrack.curtainCorner === "left")
      ? normalizedTrack.curtainLeftLength
      : 0;
  const rightReturnLength =
    normalizedTrack.curtainTrack === "u" ||
    (normalizedTrack.curtainTrack === "l" && normalizedTrack.curtainCorner === "right")
      ? normalizedTrack.curtainRightLength
      : 0;
  const baseZ = -Math.max(leftReturnLength, rightReturnLength) / 2;
  const vertices = [
    ...(leftReturnLength
      ? [
          {
            x: -width / 2,
            z: baseZ + leftReturnLength
          }
        ]
      : []),
    {
      x: -width / 2,
      z: baseZ
    },
    {
      x: width / 2,
      z: baseZ
    },
    ...(rightReturnLength
      ? [
          {
            x: width / 2,
            z: baseZ + rightReturnLength
          }
        ]
      : [])
  ];
  const segments = [];
  let totalLength = 0;
  const addStraightSegment = (fromPoint, toPoint) => {
    const segmentLength = Math.hypot(toPoint.x - fromPoint.x, toPoint.z - fromPoint.z);
    if (segmentLength < 1e-8) {
      return;
    }
    const directionX = (toPoint.x - fromPoint.x) / segmentLength;
    const directionZ = (toPoint.z - fromPoint.z) / segmentLength;
    segments.push({
      start: totalLength,
      length: segmentLength,
      sample: distanceAlong => ({
        x: fromPoint.x + directionX * distanceAlong,
        z: fromPoint.z + directionZ * distanceAlong,
        tx: directionX,
        tz: directionZ
      })
    });
    totalLength += segmentLength;
  };
  let cursorPoint = vertices[0];
  for (let vertexIndex = 1; vertexIndex < vertices.length - 1; vertexIndex++) {
    const previousPoint = vertices[vertexIndex - 1];
    const cornerPoint = vertices[vertexIndex];
    const nextPoint = vertices[vertexIndex + 1];
    const previousLength = Math.hypot(
      cornerPoint.x - previousPoint.x,
      cornerPoint.z - previousPoint.z
    );
    const nextLength = Math.hypot(nextPoint.x - cornerPoint.x, nextPoint.z - cornerPoint.z);
    const filletRadius = Math.min(0.08, previousLength / 3, nextLength / 3);
    const previousDirectionX = (cornerPoint.x - previousPoint.x) / previousLength;
    const previousDirectionZ = (cornerPoint.z - previousPoint.z) / previousLength;
    const nextDirectionX = (nextPoint.x - cornerPoint.x) / nextLength;
    const nextDirectionZ = (nextPoint.z - cornerPoint.z) / nextLength;
    const arcStartPoint = {
      x: cornerPoint.x - previousDirectionX * filletRadius,
      z: cornerPoint.z - previousDirectionZ * filletRadius
    };
    addStraightSegment(cursorPoint, arcStartPoint);
    const arcCenter = {
      x: arcStartPoint.x + nextDirectionX * filletRadius,
      z: arcStartPoint.z + nextDirectionZ * filletRadius
    };
    const startAngle = Math.atan2(arcStartPoint.z - arcCenter.z, arcStartPoint.x - arcCenter.x);
    const turnSign = Math.sign(
      previousDirectionX * nextDirectionZ - previousDirectionZ * nextDirectionX
    );
    const arcLength = (filletRadius * Math.PI) / 2;
    segments.push({
      start: totalLength,
      length: arcLength,
      sample: arcDistance => {
        const arcAngle = startAngle + (turnSign * arcDistance) / filletRadius;
        return {
          x: arcCenter.x + filletRadius * Math.cos(arcAngle),
          z: arcCenter.z + filletRadius * Math.sin(arcAngle),
          tx: -turnSign * Math.sin(arcAngle),
          tz: turnSign * Math.cos(arcAngle)
        };
      }
    });
    totalLength += arcLength;
    cursorPoint = {
      x: cornerPoint.x + nextDirectionX * filletRadius,
      z: cornerPoint.z + nextDirectionZ * filletRadius
    };
  }
  addStraightSegment(cursorPoint, vertices.at(-1));
  return {
    ...normalizedTrack,
    width: width,
    length: totalLength,
    vertices: vertices,
    sample(distance) {
      const clampedDistance = clampNumber(distance, 0, 0, totalLength);
      const activeSegment =
        segments.find(segment => clampedDistance <= segment.start + segment.length) ||
        segments.at(-1);
      return activeSegment.sample(
        Math.max(0, Math.min(activeSegment.length, clampedDistance - activeSegment.start))
      );
    }
  };
}
export function curtainPanelRanges(panelTrack, previewPercent = 0, position = "split") {
  const coverageScale = 1 - (clampNumber(previewPercent, 0, 0, 100) * 0.88) / 100;
  const trackLength = panelTrack.length;
  const meetOffset = (trackLength * panelTrack.curtainMeet) / 100;
  return [
    {
      visible: position !== "right",
      start: 0,
      end: (position === "split" ? meetOffset : trackLength) * coverageScale
    },
    {
      visible: position !== "left",
      start:
        trackLength -
        (position === "split" ? trackLength - meetOffset : trackLength) * coverageScale,
      end: trackLength
    }
  ];
}
export function createTrackClothGeometry(THREE, clothTrack, clothHeight, fabric = "cloth") {
  const folds = Math.max(
    4,
    Math.min(160, Math.round(clothTrack.length / (fabric === "sheer" ? 0.1 : 0.15)))
  );
  const segmentCount = Math.max(64, folds * 8);
  const geometry = new THREE.PlaneGeometry(1, 1, segmentCount, 1);
  geometry.userData.curtainCloth = {
    segments: segmentCount,
    height: clothHeight,
    folds: folds,
    amplitude: fabric === "sheer" ? 0.023 : 0.046
  };
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  return geometry;
}
export function poseTrackCloth(clothGeometry, posedTrack, panel) {
  const {
    segments: meshSegments,
    height: height,
    folds: foldCount,
    amplitude: amplitude
  } = clothGeometry.userData.curtainCloth;
  const positionAttribute = clothGeometry.attributes.position;
  const foldRatio =
    panel.side === 0 ? posedTrack.curtainMeet / 100 : 1 - posedTrack.curtainMeet / 100;
  const panelFoldCount = Math.max(2, Math.round(foldCount * (panel.split ? foldRatio : 1)));
  for (let segmentIndex = 0; segmentIndex <= meshSegments; segmentIndex++) {
    const foldFraction = segmentIndex / meshSegments;
    const trackPoint = posedTrack.sample(panel.start + (panel.end - panel.start) * foldFraction);
    const waveOffset = amplitude * Math.sin(foldFraction * panelFoldCount * Math.PI * 2);
    for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
      positionAttribute.setXYZ(
        rowIndex * (meshSegments + 1) + segmentIndex,
        trackPoint.x - trackPoint.tz * waveOffset,
        0.06 + (rowIndex === 0 ? Math.max(0.1, height - 0.12) : 0),
        trackPoint.z + trackPoint.tx * waveOffset
      );
    }
  }
  positionAttribute.needsUpdate = true;
  clothGeometry.computeVertexNormals();
  clothGeometry.computeBoundingBox();
  clothGeometry.computeBoundingSphere();
}
export function addTrackCurtain(three, rigRoot, curtainOptions, colorOverrides = {}) {
  const curtainTrack = createCurtainTrack(curtainOptions);
  const curtainHeight = clampNumber(curtainOptions.height, 2.4, 0.2, 6);
  const curtainFabric = curtainOptions.curtainFabric || "cloth";
  rigRoot.userData.curtainRigRoot = true;
  rigRoot.userData.curtainTrackModel = true;
  rigRoot.userData.curtainRigBasis = [
    curtainTrack.width,
    curtainHeight,
    curtainFootprintDepth(curtainOptions)
  ];
  class CurtainTrackCurve extends three.Curve {
    getPoint(curveT, target = new three.Vector3()) {
      const curvePoint = curtainTrack.sample(curveT * curtainTrack.length);
      return target.set(curvePoint.x, curtainHeight - 0.025, curvePoint.z);
    }
  }
  const rodMaterial = new three.MeshStandardMaterial({
    color: colorOverrides.dark ?? 6647932,
    roughness: 0.38,
    metalness: 0.5
  });
  const rodMesh = new three.Mesh(
    new three.TubeGeometry(
      new CurtainTrackCurve(),
      Math.max(32, Math.ceil(curtainTrack.length * 24)),
      0.015,
      8,
      false
    ),
    rodMaterial
  );
  rodMesh.userData.curtainPart = "rod";
  rigRoot.add(rodMesh);
  const clothMaterial = new three.MeshStandardMaterial({
    color: curtainFabric === "sheer" ? 16118766 : (colorOverrides.light ?? 13094354),
    roughness: 0.94,
    side: three.DoubleSide,
    transparent: curtainFabric === "sheer",
    opacity: curtainFabric === "sheer" ? 0.48 : 1,
    depthWrite: curtainFabric !== "sheer"
  });
  clothMaterial.forceSinglePass = true;
  const panelPosition = ["left", "right", "split"].includes(curtainOptions.curtainPosition)
    ? curtainOptions.curtainPosition
    : "split";
  curtainPanelRanges(curtainTrack, curtainTrack.curtainPreview, panelPosition).forEach(
    (panelRange, sideIndex) => {
      const clothPieceGeometry = createTrackClothGeometry(
        three,
        curtainTrack,
        curtainHeight,
        curtainFabric
      );
      poseTrackCloth(clothPieceGeometry, curtainTrack, {
        ...panelRange,
        side: sideIndex,
        split: panelPosition === "split"
      });
      const clothMesh = new three.Mesh(clothPieceGeometry, clothMaterial);
      clothMesh.visible = panelRange.visible;
      clothMesh.userData.curtainPart = "cloth";
      clothMesh.castShadow = curtainFabric !== "sheer";
      clothMesh.receiveShadow = true;
      rigRoot.add(clothMesh);
    }
  );
  return rigRoot;
}
export function createDreamBladeGeometry(threeLib, bladeTrack, bladeHeight) {
  const bladeCount = Math.max(4, Math.min(160, Math.ceil(bladeTrack.length / 0.12)));
  const bladeGeometry = new threeLib.BufferGeometry();
  bladeGeometry.setAttribute(
    "position",
    new threeLib.Float32BufferAttribute(new Float32Array(bladeCount * 12), 3)
  );
  bladeGeometry.attributes.position.setUsage(threeLib.DynamicDrawUsage);
  const indices = [];
  for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex++) {
    const vertexOffset = bladeIndex * 4;
    indices.push(
      vertexOffset,
      vertexOffset + 1,
      vertexOffset + 2,
      vertexOffset + 2,
      vertexOffset + 1,
      vertexOffset + 3
    );
  }
  bladeGeometry.setIndex(indices);
  bladeGeometry.userData.dreamBlades = {
    count: bladeCount,
    height: bladeHeight,
    width: (bladeTrack.length / bladeCount) * 1.08
  };
  return bladeGeometry;
}
export function poseDreamBlades(bladeStripGeometry, dreamTrack, dreamPanel, tiltPercent = 50) {
  const {
    count: bladeTotal,
    height: bladeTopY,
    width: bladeWidth
  } = bladeStripGeometry.userData.dreamBlades;
  const bladePositions = bladeStripGeometry.attributes.position;
  const activeBladeCount = Math.max(
    2,
    Math.round(
      bladeTotal *
        (dreamPanel.split
          ? dreamPanel.side === 0
            ? dreamTrack.curtainMeet / 100
            : 1 - dreamTrack.curtainMeet / 100
          : 1)
    )
  );
  const tiltAngle = (clampNumber(tiltPercent, 50, 0, 100) * Math.PI) / 100;
  for (let bladeCursor = 0; bladeCursor < bladeTotal; bladeCursor++) {
    const bladeTrackPoint = dreamTrack.sample(
      dreamPanel.start +
        ((dreamPanel.end - dreamPanel.start) *
          (Math.min(bladeCursor, activeBladeCount - 1) + 0.5)) /
          activeBladeCount
    );
    const halfSpan = bladeCursor < activeBladeCount ? bladeWidth / 2 : 0;
    const offsetX =
      (bladeTrackPoint.tx * Math.cos(tiltAngle) - bladeTrackPoint.tz * Math.sin(tiltAngle)) *
      halfSpan;
    const offsetZ =
      (bladeTrackPoint.tz * Math.cos(tiltAngle) + bladeTrackPoint.tx * Math.sin(tiltAngle)) *
      halfSpan;
    bladePositions.setXYZ(
      bladeCursor * 4,
      bladeTrackPoint.x - offsetX,
      0.06,
      bladeTrackPoint.z - offsetZ
    );
    bladePositions.setXYZ(
      bladeCursor * 4 + 1,
      bladeTrackPoint.x + offsetX,
      0.06,
      bladeTrackPoint.z + offsetZ
    );
    bladePositions.setXYZ(
      bladeCursor * 4 + 2,
      bladeTrackPoint.x - offsetX,
      bladeTopY - 0.06,
      bladeTrackPoint.z - offsetZ
    );
    bladePositions.setXYZ(
      bladeCursor * 4 + 3,
      bladeTrackPoint.x + offsetX,
      bladeTopY - 0.06,
      bladeTrackPoint.z + offsetZ
    );
  }
  bladePositions.needsUpdate = true;
  bladeStripGeometry.computeVertexNormals();
  bladeStripGeometry.computeBoundingBox();
  bladeStripGeometry.computeBoundingSphere();
}
