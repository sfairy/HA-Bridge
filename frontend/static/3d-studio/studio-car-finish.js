export const CAR_LAMP_LENSES = {
  front: [
    [[208, 193], [238, 197], [257, 208], [215, 208]],
    [[376, 208], [404, 195], [421, 193], [416, 207]],
    [[90, 373], [117, 360], [141, 357], [123, 373]]
  ],
  rear: [
    [[461, 188], [470, 181], [482, 181], [482, 192]],
    [[630, 181], [655, 181], [675, 189], [654, 192]],
    [[626, 350], [639, 343], [657, 341], [655, 351]]
  ]
};

export const CAR_GLASS_ATLAS_REGIONS = [
  [0.3, 0.655, 0.96, 0.975],
  [0.38, 0.395, 0.81, 0.49]
];

const uvCoord = point => 'vec2(' + (point[0] / 700).toFixed(7) + ', ' + (point[1] / 700).toFixed(7) + ')';

const lensEdges = polygon => {
  const ordered = polygon.reduce((sum, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) > 0 ? polygon : [...polygon].reverse();
  return ordered.map((point, index) => (
    'hbCarLensEdge(carUv, ' + uvCoord(point) + ', ' + uvCoord(ordered[(index + 1) % ordered.length]) + ')'
  )).join(' * ');
};

const lensCoverage = lamp => CAR_LAMP_LENSES[lamp].map(lensEdges).map(expression => '(' + expression + ')').join(' + ');

const glassIslandExpression = CAR_GLASS_ATLAS_REGIONS.map(([x0, y0, x1, y1]) => (
  '(step(' + x0 + ', glassUv.x) * step(glassUv.x, ' + x1 + ') * step(' + y0 + ', glassUv.y) * step(glassUv.y, ' + y1 + '))'
)).join(' + ');

export function smoothCarSurfaceNormals(THREE, geometry) {
  const position = geometry?.attributes?.position;
  const normal = geometry?.attributes?.normal;
  if (!position || !normal || position.count !== normal.count) {
    return geometry;
  }
  const clusters = new Map();
  const weights = new Float64Array(position.count);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const cross = new THREE.Vector3();
  const index = geometry.index;
  const triangleCount = index?.count ?? position.count;
  for (let i = 0; i + 2 < triangleCount; i += 3) {
    const verts = [0, 1, 2].map(offset => (index ? index.getX(i + offset) : i + offset));
    a.fromBufferAttribute(position, verts[0]);
    b.fromBufferAttribute(position, verts[1]);
    c.fromBufferAttribute(position, verts[2]);
    const area = cross.subVectors(b, a).cross(c.sub(a)).length();
    for (const vertex of verts) {
      weights[vertex] += area;
    }
  }
  for (let i = 0; i < position.count; i++) {
    const key = [position.getX(i), position.getY(i), position.getZ(i)]
      .map(value => Math.round(value * 10000))
      .join('/');
    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key).push(i);
  }
  const next = geometry.clone();
  const smoothed = normal.clone();
  const accumulated = new THREE.Vector3();
  const cosineLimit = Math.cos(THREE.MathUtils.degToRad(50));
  for (const cluster of clusters.values()) {
    for (const vertex of cluster) {
      a.fromBufferAttribute(normal, vertex).normalize();
      accumulated.set(0, 0, 0);
      for (const other of cluster) {
        b.fromBufferAttribute(normal, other).normalize();
        if (a.dot(b) >= cosineLimit) {
          accumulated.addScaledVector(b, weights[other]);
        }
      }
      if (accumulated.lengthSq() > 1e-16) {
        accumulated.normalize();
        smoothed.setXYZ(vertex, accumulated.x, accumulated.y, accumulated.z);
      }
    }
  }
  next.setAttribute('normal', smoothed);
  smoothed.needsUpdate = true;
  return next;
}

export function applyCarFinish(material) {
  if (!material?.isMeshStandardMaterial || material.userData.hbCarFinish) {
    return material;
  }
  const previousOnBeforeCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey?.call(material) || '';
  material.onBeforeCompile = function (shader, renderer) {
    previousOnBeforeCompile?.call(this, shader, renderer);
    shader.vertexShader = 'varying float vHbCarHeight;\nvarying float vHbCarLength;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvHbCarHeight = position.z;\nvHbCarLength = position.y;'
    );
    shader.fragmentShader = '#define HB_CAR_GLASS_FINISH\n'
      + 'varying float vHbCarHeight;\n'
      + 'varying float vHbCarLength;\n'
      + 'float hbCarLensEdge(vec2 uv, vec2 a, vec2 b) {\n'
      + '  vec2 edge = b - a, offset = uv - a;\n'
      + '  float distance = (edge.x * offset.y - edge.y * offset.x) / length(edge);\n'
      + '  return smoothstep(-0.0005, 0.001, distance);\n'
      + '}\n'
      + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      float hbCarGlass = 0.0;
      #ifdef USE_MAP
        vec2 glassUv = fract(vMapUv);
        float glassIsland = clamp(${glassIslandExpression}, 0.0, 1.0);
        float glassValue = dot(sampledDiffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        hbCarGlass = glassIsland * smoothstep(0.88, 1.05, vHbCarHeight)
          * (1.0 - smoothstep(0.055, 0.13, glassValue));
        float glassSeams = max(1.0 - smoothstep(0.007, 0.019, abs(glassUv.x - 0.505)),
          max(1.0 - smoothstep(0.002, 0.006, abs(glassUv.x - 0.635)),
            1.0 - smoothstep(0.007, 0.020, abs(glassUv.x - 0.792))));
        float paneInterior = smoothstep(0.704, 0.74, glassUv.y)
          * (1.0 - smoothstep(0.907, 0.943, glassUv.y)) * (1.0 - glassSeams);
        vec3 glassAtlas = sampledDiffuseColor.rgb * 0.7 + vec3(0.012, 0.014, 0.017);
        vec3 paneColor = mix(vec3(0.026, 0.031, 0.038), sampledDiffuseColor.rgb, 0.15);
        diffuseColor.rgb = mix(diffuseColor.rgb,
          diffuse * mix(glassAtlas, paneColor, paneInterior), hbCarGlass);
      #endif
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      float carDark = 1.0 - smoothstep(0.035, 0.16, dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)));
      float carUpper = smoothstep(0.68, 1.02, vHbCarHeight);
      vec3 carView = normalize(vViewPosition);
      vec3 carReflection = inverseTransformDirection(reflect(-carView, normal), viewMatrix);
      float carSky = smoothstep(-0.15, 0.85, carReflection.y);
      float carSoftbox = pow(max(dot(carReflection, normalize(vec3(-0.35, 0.8, 0.48))), 0.0), 12.0);
      float carFresnel = pow(1.0 - max(dot(normal, carView), 0.0), 4.0);
      outgoingLight += carDark * carUpper * vec3(0.68, 0.79, 0.94)
        * (0.012 + 0.025 * carSky + 0.07 * carSoftbox + 0.035 * carFresnel);
      outgoingLight += hbCarGlass * vec3(0.76, 0.84, 0.94)
        * (0.008 + 0.014 * carSky + 0.02 * carSoftbox);
      #ifdef USE_MAP
        vec2 carUv = fract(vMapUv);
        float carFrontLamp = clamp(${lensCoverage('front')}, 0.0, 1.0)
          * (1.0 - smoothstep(-1.95, -1.85, vHbCarLength));
        float carRearLamp = clamp(${lensCoverage('rear')}, 0.0, 1.0)
          * smoothstep(1.85, 1.95, vHbCarLength);
        outgoingLight += carFrontLamp * vec3(2.0, 2.3, 2.6)
          + carRearLamp * vec3(0.84, 0.036, 0.018);
      #endif
      #include <opaque_fragment>`);
  };
  material.customProgramCacheKey = () => previousCacheKey + '|hb-car-finish-v7-glazing-detail';
  material.userData.hbCarFinish = true;
  material.userData.plan2SurfaceContact = false;
  return material;
}
