export function createWallSideMaterial(THREE, materialParams, enhance = true, wallFeatures = "") {
  const featureSet = new Set(wallFeatures.split(","));
  const material =
    enhance && featureSet.has("shader")
      ? createDedicatedWallMaterial(THREE, materialParams)
      : new THREE.MeshPhysicalMaterial(materialParams);
  if (enhance && featureSet.has("single")) {
    material.forceSinglePass = true;
  }
  if (enhance && featureSet.has("depth")) {
    material.depthWrite = true;
  }
  if (!material.userData.hbDedicatedWall && !!enhance) {
    material.onBeforeCompile = shaderObject => {
      shaderObject.vertexShader =
        "attribute float hbWallHeight; varying float vHbWallHeight;\n" + shaderObject.vertexShader;
      shaderObject.vertexShader = shaderObject.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvHbWallHeight = hbWallHeight;"
      );
      shaderObject.fragmentShader = "varying float vHbWallHeight;\n" + shaderObject.fragmentShader;
      shaderObject.fragmentShader = shaderObject.fragmentShader.replace(
        "#include <opaque_fragment>",
        "\n      float wallHeightBlend = smoothstep(0.0, 0.65, vHbWallHeight);\n      outgoingLight *= mix(0.70, 1.0, wallHeightBlend);\n      diffuseColor.a += diffuseColor.a * (1.0 - diffuseColor.a) * 0.65 * (1.0 - wallHeightBlend);\n      #include <opaque_fragment>"
      );
    };
    material.customProgramCacheKey = () => "hb-wall-height-gradient-v3";
  }
  return material;
}
function createDedicatedWallMaterial(three, wallParams) {
  const shaderMaterial = new three.ShaderMaterial({
    uniforms: {
      diffuse: {
        value: new three.Color(wallParams.color)
      },
      opacity: {
        value: wallParams.opacity
      }
    },
    vertexShader:
      "\n      attribute float hbWallHeight;\n      attribute vec2 hbWallCornerDistance;\n      varying float vHbWallHeight;\n      varying vec2 vHbWallCornerDistance;\n      varying vec3 vHbNormal;\n      #include <common>\n      #include <clipping_planes_pars_vertex>\n      void main() {\n        vHbWallHeight = hbWallHeight;\n        vHbWallCornerDistance = hbWallCornerDistance;\n        vHbNormal = normalize(normalMatrix * normal);\n        #include <begin_vertex>\n        #include <project_vertex>\n        #include <clipping_planes_vertex>\n      }",
    fragmentShader:
      "\n      uniform vec3 diffuse;\n      uniform float opacity;\n      uniform mat4 plan2ViewToWorld;\n      varying float vHbWallHeight;\n      varying vec2 vHbWallCornerDistance;\n      varying vec3 vHbNormal;\n      #include <common>\n      #include <clipping_planes_pars_fragment>\n      void main() {\n        #include <clipping_planes_fragment>\n        // These are closed wall volumes. Their opposite surface would show\n        // its displaced bottom edge through the nearer translucent surface.\n        // Keep the camera-facing surface from either side of the wall.\n        if (!gl_FrontFacing) discard;\n        vec3 normal = normalize(vHbNormal) * (gl_FrontFacing ? 1.0 : -1.0);\n        vec3 worldNormal = normalize(mat3(plan2MotionToLayout) * mat3(plan2ViewToWorld) * normal);\n        float up = worldNormal.y * 0.5 + 0.5;\n        float key = max(dot(worldNormal, normalize(vec3(-0.4, 0.85, 0.32))), 0.0);\n        vec3 outgoingLight = diffuse * mix(vec3(0.82, 0.85, 0.91), vec3(1.0), up) * (0.30 + 0.40 * up + 0.18 * key);\n        outgoingLight += mix(diffuse, sqrt(max(diffuse, vec3(0.0))), 0.6) * plan2SurfaceLight(vPlan2WorldPosition) * plan2Gain;\n        // Height changes colour only. Changing coverage as well accentuates\n        // the draw-order boundaries between translucent door/window bands.\n        float wallRootShade = 1.0 - smoothstep(0.0, 0.55, vHbWallHeight);\n        // Retain the wall/light hue with a gentler neutral root tint.\n        outgoingLight *= 1.0 - 0.54 * wallRootShade;\n        float cornerDistance = min(vHbWallCornerDistance.x, vHbWallCornerDistance.y);\n        float cornerShade = 1.0 - smoothstep(0.0, 0.24, cornerDistance);\n        outgoingLight *= 1.0 - 0.28 * cornerShade;\n        gl_FragColor = vec4(outgoingLight, opacity);\n        #include <tonemapping_fragment>\n        #include <colorspace_fragment>\n      }",
    transparent: wallParams.transparent,
    depthWrite: wallParams.depthWrite ?? true,
    depthFunc: wallParams.depthFunc ?? three.LessEqualDepth,
    side: three.FrontSide,
    forceSinglePass: false
  });
  shaderMaterial.color = new three.Color(wallParams.color);
  shaderMaterial.opacity = wallParams.opacity;
  shaderMaterial.userData.hbDedicatedWall = true;
  shaderMaterial.defaultAttributeValues.hbWallCornerDistance = [100, 100];
  shaderMaterial.customProgramCacheKey = () => "hb-dedicated-wall-front-corner-balanced-v9";
  return shaderMaterial;
}
export function setWallCornerDistances(threeNamespace, geometry, loops) {
  const edgeSegments = [];
  for (const loop of loops) {
    let vertices = loop.filter(
      (point, pointIndex) =>
        !pointIndex ||
        Math.hypot(point.x - loop[pointIndex - 1].x, point.y - loop[pointIndex - 1].y) > 1e-7
    );
    if (
      vertices.length > 1 &&
      Math.hypot(vertices[0].x - vertices.at(-1).x, vertices[0].y - vertices.at(-1).y) < 1e-7
    ) {
      vertices = vertices.slice(0, -1);
    }
    vertices = vertices.filter((currentVertex, vertexIndex, vertexList) => {
      const previousVertex = vertexList[(vertexIndex + vertexList.length - 1) % vertexList.length];
      const nextVertex = vertexList[(vertexIndex + 1) % vertexList.length];
      const edgeToCurrentX = currentVertex.x - previousVertex.x;
      const edgeToCurrentY = currentVertex.y - previousVertex.y;
      const edgeToNextX = nextVertex.x - currentVertex.x;
      const edgeToNextY = nextVertex.y - currentVertex.y;
      return (
        edgeToCurrentX * edgeToNextX + edgeToCurrentY * edgeToNextY <= 0 ||
        Math.abs(edgeToCurrentX * edgeToNextY - edgeToCurrentY * edgeToNextX) >
          Math.hypot(edgeToCurrentX, edgeToCurrentY) *
            0.000001 *
            Math.hypot(edgeToNextX, edgeToNextY)
      );
    });
    for (let loopIndex = 0; loopIndex < vertices.length; loopIndex++) {
      const vertex = vertices[loopIndex];
      const followingVertex = vertices[(loopIndex + 1) % vertices.length];
      const edgeLength = Math.hypot(followingVertex.x - vertex.x, followingVertex.y - vertex.y);
      if (edgeLength > 1e-7) {
        edgeSegments.push({
          x: vertex.x,
          y: vertex.y,
          tx: (followingVertex.x - vertex.x) / edgeLength,
          ty: (followingVertex.y - vertex.y) / edgeLength,
          length: edgeLength
        });
      }
    }
  }
  const positionAttribute = geometry.attributes.position;
  const normalAttribute = geometry.attributes.normal;
  const cornerDistanceBuffer = new Float32Array(positionAttribute.count * 2).fill(100);
  for (let vertexCursor = 0; vertexCursor < positionAttribute.count; vertexCursor++) {
    if (!normalAttribute || Math.abs(normalAttribute.getZ(vertexCursor)) > 0.5) {
      continue;
    }
    let bestDistance = Infinity;
    for (const edge of edgeSegments) {
      const offsetX = positionAttribute.getX(vertexCursor) - edge.x;
      const offsetY = positionAttribute.getY(vertexCursor) - edge.y;
      const alongEdge = offsetX * edge.tx + offsetY * edge.ty;
      const distanceScore =
        Math.abs(offsetX * edge.ty - offsetY * edge.tx) +
        Math.max(-alongEdge, 0, alongEdge - edge.length) +
        Math.abs(
          normalAttribute.getX(vertexCursor) * edge.tx +
            normalAttribute.getY(vertexCursor) * edge.ty
        );
      if (distanceScore < bestDistance) {
        bestDistance = distanceScore;
        cornerDistanceBuffer[vertexCursor * 2] = Math.max(0, Math.min(edge.length, alongEdge));
        cornerDistanceBuffer[vertexCursor * 2 + 1] =
          edge.length - cornerDistanceBuffer[vertexCursor * 2];
      }
    }
  }
  geometry.setAttribute(
    "hbWallCornerDistance",
    new threeNamespace.BufferAttribute(cornerDistanceBuffer, 2)
  );
}
export function mergeWallBands(threeApi, bandRoot, mergeGeometries) {
  const bandBySignature = new Map();
  for (const child of bandRoot.children) {
    if (!child.userData.hbMergeWallBand || !Array.isArray(child.material)) {
      continue;
    }
    const bandMaterial = child.material[1];
    const bandSignature = JSON.stringify([
      bandMaterial.type,
      bandMaterial.color.getHex(),
      bandMaterial.opacity,
      bandMaterial.depthWrite,
      bandMaterial.depthFunc,
      bandMaterial.side,
      bandMaterial.forceSinglePass,
      bandMaterial.transparent,
      child.layers.mask,
      child.castShadow,
      child.receiveShadow,
      child.renderOrder
    ]);
    if (!bandBySignature.has(bandSignature)) {
      bandBySignature.set(bandSignature, []);
    }
    bandBySignature.get(bandSignature).push(child);
  }
  for (const bandChildren of bandBySignature.values()) {
    if (bandChildren.length < 2) {
      continue;
    }
    const mergedGeometries = [];
    for (const bandChild of bandChildren) {
      bandChild.updateMatrix();
      const sourceGeometry = bandChild.geometry.index
        ? bandChild.geometry.toNonIndexed()
        : bandChild.geometry;
      for (const geometryGroup of sourceGeometry.groups.filter(
        groupEntry => groupEntry.materialIndex === 1
      )) {
        const mergedPiece = new threeApi.BufferGeometry();
        for (const [attributeName, attribute] of Object.entries(sourceGeometry.attributes)) {
          mergedPiece.setAttribute(
            attributeName,
            new threeApi.BufferAttribute(
              attribute.array.slice(
                geometryGroup.start * attribute.itemSize,
                (geometryGroup.start + geometryGroup.count) * attribute.itemSize
              ),
              attribute.itemSize,
              attribute.normalized
            )
          );
        }
        mergedPiece.applyMatrix4(bandChild.matrix);
        mergedGeometries.push(mergedPiece);
      }
      if (sourceGeometry !== bandChild.geometry) {
        sourceGeometry.dispose();
      }
    }
    const mergedGeometry = mergedGeometries.length
      ? mergeGeometries(mergedGeometries, false)
      : null;
    for (const pieceGeometry of mergedGeometries) {
      pieceGeometry.dispose();
    }
    if (!mergedGeometry) {
      continue;
    }
    mergedGeometry.computeBoundingBox();
    mergedGeometry.computeBoundingSphere();
    const firstChild = bandChildren[0];
    const mergedMaterial = firstChild.material[1];
    const mergedMesh = new threeApi.Mesh(mergedGeometry, mergedMaterial);
    mergedMesh.userData = {
      ...firstChild.userData,
      hbMergedWallCount: bandChildren.length,
      regionReceiverKind: "wall"
    };
    mergedMesh.layers.mask = firstChild.layers.mask;
    mergedMesh.renderOrder = firstChild.renderOrder;
    mergedMesh.castShadow = firstChild.castShadow;
    mergedMesh.receiveShadow = firstChild.receiveShadow;
    const disposedMaterials = new Set();
    for (const removedChild of bandChildren) {
      bandRoot.remove(removedChild);
      removedChild.geometry.dispose();
      for (const childMaterial of removedChild.material) {
        if (childMaterial !== mergedMaterial && !disposedMaterials.has(childMaterial)) {
          disposedMaterials.add(childMaterial);
          childMaterial.dispose();
        }
      }
    }
    bandRoot.add(mergedMesh);
  }
}
export function setWallGradientHeight(threeModule, meshGeometry, axis, offset, scale, heightSpan) {
  const wallPositionAttribute = meshGeometry.attributes.position;
  const heightBuffer = new Float32Array(wallPositionAttribute.count);
  const clampedHeightSpan = Math.max(0.01, heightSpan);
  for (
    let heightVertexIndex = 0;
    heightVertexIndex < wallPositionAttribute.count;
    heightVertexIndex++
  ) {
    const axisValue =
      axis === "z"
        ? wallPositionAttribute.getZ(heightVertexIndex)
        : wallPositionAttribute.getY(heightVertexIndex);
    heightBuffer[heightVertexIndex] = Math.max(
      0,
      Math.min(1, (offset + scale * axisValue) / clampedHeightSpan)
    );
  }
  meshGeometry.setAttribute("hbWallHeight", new threeModule.BufferAttribute(heightBuffer, 1));
}
