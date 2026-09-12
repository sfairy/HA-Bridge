export function createWallSideMaterial(THREE, params, enabled = true, flags = '') {
  const flagSet = new Set(flags.split(','));
  const material = enabled && flagSet.has('shader') ? createDedicatedWallShaderMaterial(THREE, params) : new THREE.MeshPhysicalMaterial(params);
  enabled && flagSet.has('single') && (material.forceSinglePass = true);
  enabled && flagSet.has('depth') && (material.depthWrite = true);
  material.userData.hbDedicatedWall || !enabled || (material.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float hbWallHeight; varying float vHbWallHeight;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvHbWallHeight = hbWallHeight;');
    shader.fragmentShader = 'varying float vHbWallHeight;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', '\n      float wallHeightBlend = smoothstep(0.0, 0.65, vHbWallHeight);\n      outgoingLight *= mix(0.70, 1.0, wallHeightBlend);\n      diffuseColor.a += diffuseColor.a * (1.0 - diffuseColor.a) * 0.65 * (1.0 - wallHeightBlend);\n      #include <opaque_fragment>');
  }, material.customProgramCacheKey = () => 'hb-wall-height-gradient-v3');
  return material;
}
function createDedicatedWallShaderMaterial(THREE, params) {
  const material = new THREE.ShaderMaterial({
    'uniforms': {
      'diffuse': {
        'value': new THREE.Color(params.color)
      },
      'opacity': {
        'value': params.opacity
      }
    },
    'vertexShader': '\n      attribute float hbWallHeight;\n      attribute vec2 hbWallCornerDistance;\n      varying float vHbWallHeight;\n      varying vec2 vHbWallCornerDistance;\n      varying vec3 vHbNormal;\n      #include <common>\n      #include <clipping_planes_pars_vertex>\n      void main() {\n        vHbWallHeight = hbWallHeight;\n        vHbWallCornerDistance = hbWallCornerDistance;\n        vHbNormal = normalize(normalMatrix * normal);\n        #include <begin_vertex>\n        #include <project_vertex>\n        #include <clipping_planes_vertex>\n      }',
    'fragmentShader': '\n      uniform vec3 diffuse;\n      uniform float opacity;\n      uniform mat4 plan2ViewToWorld;\n      varying float vHbWallHeight;\n      varying vec2 vHbWallCornerDistance;\n      varying vec3 vHbNormal;\n      #include <common>\n      #include <clipping_planes_pars_fragment>\n      void main() {\n        #include <clipping_planes_fragment>\n        // These are closed wall volumes. Their opposite surface would show\n        // its displaced bottom edge through the nearer translucent surface.\n        // Keep the camera-facing surface from either side of the wall.\n        if (!gl_FrontFacing) discard;\n        vec3 normal = normalize(vHbNormal) * (gl_FrontFacing ? 1.0 : -1.0);\n        vec3 worldNormal = normalize(mat3(plan2MotionToLayout) * mat3(plan2ViewToWorld) * normal);\n        float up = worldNormal.y * 0.5 + 0.5;\n        float key = max(dot(worldNormal, normalize(vec3(-0.4, 0.85, 0.32))), 0.0);\n        vec3 outgoingLight = diffuse * mix(vec3(0.82, 0.85, 0.91), vec3(1.0), up) * (0.30 + 0.40 * up + 0.18 * key);\n        outgoingLight += mix(diffuse, sqrt(max(diffuse, vec3(0.0))), 0.6) * plan2SurfaceLight(vPlan2WorldPosition) * plan2Gain;\n        // Height changes colour only. Changing coverage as well accentuates\n        // the draw-order boundaries between translucent door/window bands.\n        float wallRootShade = 1.0 - smoothstep(0.0, 0.55, vHbWallHeight);\n        // Retain the wall/light hue with a gentler neutral root tint.\n        outgoingLight *= 1.0 - 0.54 * wallRootShade;\n        float cornerDistance = min(vHbWallCornerDistance.x, vHbWallCornerDistance.y);\n        float cornerShade = 1.0 - smoothstep(0.0, 0.24, cornerDistance);\n        outgoingLight *= 1.0 - 0.28 * cornerShade;\n        gl_FragColor = vec4(outgoingLight, opacity);\n        #include <tonemapping_fragment>\n        #include <colorspace_fragment>\n      }',
    'transparent': params.transparent,
    'depthWrite': params.depthWrite ?? true,
    'depthFunc': params.depthFunc ?? THREE.LessEqualDepth,
    'side': THREE.FrontSide,
    'forceSinglePass': false
  });
  material.color = new THREE.Color(params.color);
  material.opacity = params.opacity;
  material.userData.hbDedicatedWall = true;
  material.defaultAttributeValues.hbWallCornerDistance = [100, 100];
  material.customProgramCacheKey = () => 'hb-dedicated-wall-front-corner-balanced-v9';
  return material;
}
export function setWallCornerDistances(THREE, mesh, loops) {
  const segments = [];
  for (const loop of loops) {
    let points = loop.filter((point, index) => !index || Math.hypot(point.x - loop[index - 1].x, point.y - loop[index - 1].y) > 1e-7);
    points.length > 1 && Math.hypot(points[0].x - points.at(-1).x, points[0].y - points.at(-1).y) < 1e-7 && (points = points.slice(0, -1));
    points = points.filter((point, index, array) => {
      const prev = array[(index + array.length - 1) % array.length];
      const next = array[(index + 1) % array.length];
      const toPointX = point.x - prev.x;
      const toPointY = point.y - prev.y;
      const toNextX = next.x - point.x;
      const toNextY = next.y - point.y;
      return toPointX * toNextX + toPointY * toNextY <= 0 || Math.abs(toPointX * toNextY - toPointY * toNextX) > 0.000001 * Math.hypot(toPointX, toPointY) * Math.hypot(toNextX, toNextY);
    });
    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];
      const segmentLength = Math.hypot(end.x - start.x, end.y - start.y);
      segmentLength > 1e-7 && segments.push({
        'x': start.x,
        'y': start.y,
        'tx': (end.x - start.x) / segmentLength,
        'ty': (end.y - start.y) / segmentLength,
        'length': segmentLength
      });
    }
  }
  const position = mesh.attributes.position;
  const normal = mesh.attributes.normal;
  const distances = new Float32Array(position.count * 2).fill(100);
  for (let i = 0; i < position.count; i++) {
    if (!normal || Math.abs(normal.getZ(i)) > 0.5) {
      continue;
    }
    let best = 1 / 0;
    for (const segment of segments) {
      const dx = position.getX(i) - segment.x;
      const dy = position.getY(i) - segment.y;
      const along = dx * segment.tx + dy * segment.ty;
      const offset = Math.abs(dx * segment.ty - dy * segment.tx) + Math.max(-along, 0, along - segment.length) + Math.abs(normal.getX(i) * segment.tx + normal.getY(i) * segment.ty);
      offset < best && (best = offset, distances[i * 2] = Math.max(0, Math.min(segment.length, along)), distances[i * 2 + 1] = segment.length - distances[i * 2]);
    }
  }
  mesh.setAttribute('hbWallCornerDistance', new THREE.BufferAttribute(distances, 2));
}
export function mergeWallBands(THREE, root, mergeFn) {
  const groups = new Map();
  for (const child of root.children) {
    if (!child.userData.hbMergeWallBand || !Array.isArray(child.material)) {
      continue;
    }
    const bandMaterial = child.material[1];
    const key = JSON.stringify([bandMaterial.type, bandMaterial.color.getHex(), bandMaterial.opacity, bandMaterial.depthWrite, bandMaterial.depthFunc, bandMaterial.side, bandMaterial.forceSinglePass, bandMaterial.transparent, child.layers.mask, child.castShadow, child.receiveShadow, child.renderOrder]);
    groups.has(key) || groups.set(key, []);
    groups.get(key).push(child);
  }
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    const geometries = [];
    for (const mesh of group) {
      mesh.updateMatrix();
      const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
      for (const range of geometry.groups.filter(rangeInfo => rangeInfo.materialIndex === 1)) {
        const bandGeometry = new THREE.BufferGeometry();
        for (const [name, attribute] of Object.entries(geometry.attributes)) {
          bandGeometry.setAttribute(name, new THREE.BufferAttribute(attribute.array.slice(range.start * attribute.itemSize, (range.start + range.count) * attribute.itemSize), attribute.itemSize, attribute.normalized));
        }
        bandGeometry.applyMatrix4(mesh.matrix);
        geometries.push(bandGeometry);
      }
      geometry !== mesh.geometry && geometry.dispose();
    }
    const merged = geometries.length ? mergeFn(geometries, false) : null;
    for (const geometry of geometries) {
      geometry.dispose();
    }
    if (!merged) {
      continue;
    }
    merged.computeBoundingBox();
    merged.computeBoundingSphere();
    const source = group[0];
    const material = source.material[1];
    const mergedMesh = new THREE.Mesh(merged, material);
    mergedMesh.userData = {
      ...source.userData,
      'hbMergedWallCount': group.length,
      'regionReceiverKind': 'wall'
    };
    mergedMesh.layers.mask = source.layers.mask;
    mergedMesh.renderOrder = source.renderOrder;
    mergedMesh.castShadow = source.castShadow;
    mergedMesh.receiveShadow = source.receiveShadow;
    const disposed = new Set();
    for (const mesh of group) {
      root.remove(mesh);
      mesh.geometry.dispose();
      for (const meshMaterial of mesh.material) {
        meshMaterial !== material && !disposed.has(meshMaterial) && (disposed.add(meshMaterial), meshMaterial.dispose());
      }
    }
    root.add(mergedMesh);
  }
}
export function setWallGradientHeight(THREE, geometry, axis, base, scale, height) {
  const position = geometry.attributes.position;
  const heights = new Float32Array(position.count);
  const safeHeight = Math.max(0.01, height);
  for (let i = 0; i < position.count; i++) {
    const coordinate = axis === 'z' ? position.getZ(i) : position.getY(i);
    heights[i] = Math.max(0, Math.min(1, (base + scale * coordinate) / safeHeight));
  }
  geometry.setAttribute('hbWallHeight', new THREE.BufferAttribute(heights, 1));
}