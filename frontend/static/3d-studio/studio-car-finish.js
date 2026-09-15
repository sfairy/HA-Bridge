export const CAR_LAMP_LENSES = {
  front: [
    [
      [208, 193],
      [238, 197],
      [257, 208],
      [215, 208]
    ],
    [
      [376, 208],
      [404, 195],
      [421, 193],
      [416, 207]
    ],
    [
      [90, 373],
      [117, 360],
      [141, 357],
      [123, 373]
    ]
  ],
  rear: [
    [
      [461, 188],
      [470, 181],
      [482, 181],
      [482, 192]
    ],
    [
      [630, 181],
      [655, 181],
      [675, 189],
      [654, 192]
    ],
    [
      [626, 350],
      [639, 343],
      [657, 341],
      [655, 351]
    ]
  ]
};
export const CAR_GLASS_ATLAS_REGIONS = [
  [0.3, 0.655, 0.96, 0.975],
  [0.38, 0.395, 0.81, 0.49]
];
const toGlslVec2 = uvPoint =>
  "vec2(" + (uvPoint[0] / 700).toFixed(7) + ", " + (uvPoint[1] / 700).toFixed(7) + ")";
const buildLensEdgeExpression = lens => {
  const windingOrdered =
    lens.reduce((signedArea, point, index) => {
      const nextPoint = lens[(index + 1) % lens.length];
      return signedArea + point[0] * nextPoint[1] - nextPoint[0] * point[1];
    }, 0) > 0
      ? lens
      : [...lens].reverse();
  return windingOrdered
    .map(
      (lensPoint, lensIndex) =>
        "hbCarLensEdge(carUv, " +
        toGlslVec2(lensPoint) +
        ", " +
        toGlslVec2(windingOrdered[(lensIndex + 1) % windingOrdered.length]) +
        ")"
    )
    .join(" * ");
};
const buildLampGlowExpression = lampId =>
  CAR_LAMP_LENSES[lampId]
    .map(buildLensEdgeExpression)
    .map(edgeExpression => "(" + edgeExpression + ")")
    .join(" + ");
export function smoothCarSurfaceNormals(THREE, geometry) {
  const positionAttribute = geometry?.attributes?.position;
  const normalAttribute = geometry?.attributes?.normal;
  if (!positionAttribute || !normalAttribute || positionAttribute.count !== normalAttribute.count) {
    return geometry;
  }
  const vertexIndexByPosition = new Map();
  const vertexWeights = new Float64Array(positionAttribute.count);
  const triangleA = new THREE.Vector3();
  const triangleB = new THREE.Vector3();
  const triangleC = new THREE.Vector3();
  const crossVector = new THREE.Vector3();
  const indexAttribute = geometry.index;
  const triangleVertexCount = indexAttribute?.count ?? positionAttribute.count;
  for (let triangleOffset = 0; triangleOffset + 2 < triangleVertexCount; triangleOffset += 3) {
    const triangleIndices = [0, 1, 2].map(corner =>
      indexAttribute ? indexAttribute.getX(triangleOffset + corner) : triangleOffset + corner
    );
    triangleA.fromBufferAttribute(positionAttribute, triangleIndices[0]);
    triangleB.fromBufferAttribute(positionAttribute, triangleIndices[1]);
    triangleC.fromBufferAttribute(positionAttribute, triangleIndices[2]);
    const triangleArea = crossVector
      .subVectors(triangleB, triangleA)
      .cross(triangleC.sub(triangleA))
      .length();
    for (const cornerIndex of triangleIndices) {
      vertexWeights[cornerIndex] += triangleArea;
    }
  }
  for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
    const positionKey = [
      positionAttribute.getX(vertexIndex),
      positionAttribute.getY(vertexIndex),
      positionAttribute.getZ(vertexIndex)
    ]
      .map(coordinate => Math.round(coordinate * 10000))
      .join("/");
    if (!vertexIndexByPosition.has(positionKey)) {
      vertexIndexByPosition.set(positionKey, []);
    }
    vertexIndexByPosition.get(positionKey).push(vertexIndex);
  }
  const smoothedGeometry = geometry.clone();
  const smoothedNormals = normalAttribute.clone();
  const accumulatedNormal = new THREE.Vector3();
  const cosineThreshold = Math.cos(THREE.MathUtils.degToRad(50));
  for (const samePositionIndices of vertexIndexByPosition.values()) {
    for (const sourceVertexIndex of samePositionIndices) {
      triangleA.fromBufferAttribute(normalAttribute, sourceVertexIndex).normalize();
      accumulatedNormal.set(0, 0, 0);
      for (const neighborIndex of samePositionIndices) {
        triangleB.fromBufferAttribute(normalAttribute, neighborIndex).normalize();
        if (triangleA.dot(triangleB) >= cosineThreshold) {
          accumulatedNormal.addScaledVector(triangleB, vertexWeights[neighborIndex]);
        }
      }
      if (accumulatedNormal.lengthSq() > 1e-16) {
        accumulatedNormal.normalize();
        smoothedNormals.setXYZ(
          sourceVertexIndex,
          accumulatedNormal.x,
          accumulatedNormal.y,
          accumulatedNormal.z
        );
      }
    }
  }
  smoothedGeometry.setAttribute("normal", smoothedNormals);
  smoothedNormals.needsUpdate = true;
  return smoothedGeometry;
}
export function applyCarFinish(material) {
  if (!material?.isMeshStandardMaterial || material.userData.hbCarFinish) {
    return material;
  }
  const previousOnBeforeCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey?.call(material) || "";
  material.onBeforeCompile = function (shader, renderer) {
    previousOnBeforeCompile?.call(this, shader, renderer);
    shader.vertexShader =
      "varying float vHbCarHeight;\nvarying float vHbCarLength;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvHbCarHeight = position.z;\nvHbCarLength = position.y;"
    );
    shader.fragmentShader =
      "#define HB_CAR_GLASS_FINISH\n      varying float vHbCarHeight;\n      varying float vHbCarLength;\n      float hbCarLensEdge(vec2 uv, vec2 a, vec2 b) {\n        vec2 edge = b - a, offset = uv - a;\n        float distance = (edge.x * offset.y - edge.y * offset.x) / length(edge);\n        return smoothstep(-0.0005, 0.001, distance);\n      }\n      " +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      "\n      #include <color_fragment>\n      float hbCarGlass = 0.0;\n      #ifdef USE_MAP\n        vec2 glassUv = fract(vMapUv);\n        float glassIsland = clamp(" +
        CAR_GLASS_ATLAS_REGIONS.map(
          ([minX, minY, maxX, maxY]) =>
            "(step(" +
            minX +
            ", glassUv.x) * step(glassUv.x, " +
            maxX +
            ") * step(" +
            minY +
            ", glassUv.y) * step(glassUv.y, " +
            maxY +
            "))"
        ).join(" + ") +
        ", 0.0, 1.0);\n        float glassValue = dot(sampledDiffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));\n        hbCarGlass = glassIsland * smoothstep(0.88, 1.05, vHbCarHeight)\n          * (1.0 - smoothstep(0.055, 0.13, glassValue));\n        // Preserve the windscreen, split sunroof and rear-window seals, and the\n        // outer glazing edges. Only soften photographed bands inside the panes.\n        // Side-window pillars keep the atlas detail as well.\n        float glassSeams = max(1.0 - smoothstep(0.007, 0.019, abs(glassUv.x - 0.505)),\n          max(1.0 - smoothstep(0.002, 0.006, abs(glassUv.x - 0.635)),\n              1.0 - smoothstep(0.007, 0.020, abs(glassUv.x - 0.792))));\n        float paneInterior = smoothstep(0.704, 0.74, glassUv.y)\n          * (1.0 - smoothstep(0.907, 0.943, glassUv.y)) * (1.0 - glassSeams);\n        vec3 glassAtlas = sampledDiffuseColor.rgb * 0.7 + vec3(0.012, 0.014, 0.017);\n        vec3 paneColor = mix(vec3(0.026, 0.031, 0.038), sampledDiffuseColor.rgb, 0.15);\n        diffuseColor.rgb = mix(diffuseColor.rgb,\n          diffuse * mix(glassAtlas, paneColor, paneInterior), hbCarGlass);\n      #endif"
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      "\n      float carDark = 1.0 - smoothstep(0.035, 0.16, dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)));\n      float carUpper = smoothstep(0.68, 1.02, vHbCarHeight);\n      vec3 carView = normalize(vViewPosition);\n      vec3 carReflection = inverseTransformDirection(reflect(-carView, normal), viewMatrix);\n      float carSky = smoothstep(-0.15, 0.85, carReflection.y);\n      float carSoftbox = pow(max(dot(carReflection, normalize(vec3(-0.35, 0.8, 0.48))), 0.0), 12.0);\n      float carFresnel = pow(1.0 - max(dot(normal, carView), 0.0), 4.0);\n      outgoingLight += carDark * carUpper * vec3(0.68, 0.79, 0.94)\n        * (0.012 + 0.025 * carSky + 0.07 * carSoftbox + 0.035 * carFresnel);\n      // Keep the sheen restrained so it cannot wash out the glazing seams.\n      outgoingLight += hbCarGlass * vec3(0.76, 0.84, 0.94)\n        * (0.008 + 0.014 * carSky + 0.02 * carSoftbox);\n      #ifdef USE_MAP\n        vec2 carUv = fract(vMapUv);\n        float carFrontLamp = clamp(" +
        buildLampGlowExpression("front") +
        ", 0.0, 1.0)\n          * (1.0 - smoothstep(-1.95, -1.85, vHbCarLength));\n        float carRearLamp = clamp(" +
        buildLampGlowExpression("rear") +
        ", 0.0, 1.0)\n          * smoothstep(1.85, 1.95, vHbCarLength);\n        outgoingLight += carFrontLamp * vec3(2.0, 2.3, 2.6)\n          + carRearLamp * vec3(0.84, 0.036, 0.018);\n      #endif\n      #include <opaque_fragment>"
    );
  };
  material.customProgramCacheKey = () => previousCacheKey + "|hb-car-finish-v7-glazing-detail";
  material.userData.hbCarFinish = true;
  material.userData.plan2SurfaceContact = false;
  return material;
}
