export function createWallSideMaterial(THREE, params, enabled = true, flags = '') {
  const flagSet = new Set(flags.split(','));
  const material = enabled && flagSet.has('shader') ? createDedicatedWallShaderMaterial(THREE, params) : new THREE.MeshPhysicalMaterial(params);
  enabled && flagSet.has('single') && (material.forceSinglePass = true);
  enabled && flagSet.has('depth') && (material.depthWrite = true);
  material.userData.hbDedicatedWall || !enabled || (material.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float hbWallHeight; varying float vHbWallHeight;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include\x20<begin_vertex>', '#include <begin_vertex>\nvHbWallHeight = hbWallHeight;');
    shader.fragmentShader = 'varying\x20float\x20vHbWallHeight;\x0a' + shader.fragmentShader;
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
    'vertexShader': '\x0a\x20\x20\x20\x20\x20\x20attribute\x20float\x20hbWallHeight;\x0a\x20\x20\x20\x20\x20\x20attribute\x20vec2\x20hbWallCornerDistance;\x0a\x20\x20\x20\x20\x20\x20varying\x20float\x20vHbWallHeight;\x0a\x20\x20\x20\x20\x20\x20varying\x20vec2\x20vHbWallCornerDistance;\x0a\x20\x20\x20\x20\x20\x20varying\x20vec3\x20vHbNormal;\x0a\x20\x20\x20\x20\x20\x20#include\x20<common>\x0a\x20\x20\x20\x20\x20\x20#include\x20<clipping_planes_pars_vertex>\x0a\x20\x20\x20\x20\x20\x20void\x20main()\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vHbWallHeight\x20=\x20hbWallHeight;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vHbWallCornerDistance\x20=\x20hbWallCornerDistance;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vHbNormal\x20=\x20normalize(normalMatrix\x20*\x20normal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<begin_vertex>\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<project_vertex>\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<clipping_planes_vertex>\x0a\x20\x20\x20\x20\x20\x20}',
    'fragmentShader': '\x0a\x20\x20\x20\x20\x20\x20uniform\x20vec3\x20diffuse;\x0a\x20\x20\x20\x20\x20\x20uniform\x20float\x20opacity;\x0a\x20\x20\x20\x20\x20\x20uniform\x20mat4\x20plan2ViewToWorld;\x0a\x20\x20\x20\x20\x20\x20varying\x20float\x20vHbWallHeight;\x0a\x20\x20\x20\x20\x20\x20varying\x20vec2\x20vHbWallCornerDistance;\x0a\x20\x20\x20\x20\x20\x20varying\x20vec3\x20vHbNormal;\x0a\x20\x20\x20\x20\x20\x20#include\x20<common>\x0a\x20\x20\x20\x20\x20\x20#include\x20<clipping_planes_pars_fragment>\x0a\x20\x20\x20\x20\x20\x20void\x20main()\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<clipping_planes_fragment>\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20These\x20are\x20closed\x20wall\x20volumes.\x20Their\x20opposite\x20surface\x20would\x20show\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20its\x20displaced\x20bottom\x20edge\x20through\x20the\x20nearer\x20translucent\x20surface.\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Keep\x20the\x20camera-facing\x20surface\x20from\x20either\x20side\x20of\x20the\x20wall.\x0a\x20\x20\x20\x20\x20\x20\x20\x20if\x20(!gl_FrontFacing)\x20discard;\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20normal\x20=\x20normalize(vHbNormal)\x20*\x20(gl_FrontFacing\x20?\x201.0\x20:\x20-1.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20worldNormal\x20=\x20normalize(mat3(plan2MotionToLayout)\x20*\x20mat3(plan2ViewToWorld)\x20*\x20normal);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20up\x20=\x20worldNormal.y\x20*\x200.5\x20+\x200.5;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20key\x20=\x20max(dot(worldNormal,\x20normalize(vec3(-0.4,\x200.85,\x200.32))),\x200.0);\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec3\x20outgoingLight\x20=\x20diffuse\x20*\x20mix(vec3(0.82,\x200.85,\x200.91),\x20vec3(1.0),\x20up)\x20*\x20(0.30\x20+\x200.40\x20*\x20up\x20+\x200.18\x20*\x20key);\x0a\x20\x20\x20\x20\x20\x20\x20\x20outgoingLight\x20+=\x20mix(diffuse,\x20sqrt(max(diffuse,\x20vec3(0.0))),\x200.6)\x20*\x20plan2SurfaceLight(vPlan2WorldPosition)\x20*\x20plan2Gain;\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Height\x20changes\x20colour\x20only.\x20Changing\x20coverage\x20as\x20well\x20accentuates\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20the\x20draw-order\x20boundaries\x20between\x20translucent\x20door/window\x20bands.\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20wallRootShade\x20=\x201.0\x20-\x20smoothstep(0.0,\x200.55,\x20vHbWallHeight);\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Retain\x20the\x20wall/light\x20hue\x20with\x20a\x20gentler\x20neutral\x20root\x20tint.\x0a\x20\x20\x20\x20\x20\x20\x20\x20outgoingLight\x20*=\x201.0\x20-\x200.54\x20*\x20wallRootShade;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20cornerDistance\x20=\x20min(vHbWallCornerDistance.x,\x20vHbWallCornerDistance.y);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20cornerShade\x20=\x201.0\x20-\x20smoothstep(0.0,\x200.24,\x20cornerDistance);\x0a\x20\x20\x20\x20\x20\x20\x20\x20outgoingLight\x20*=\x201.0\x20-\x200.28\x20*\x20cornerShade;\x0a\x20\x20\x20\x20\x20\x20\x20\x20gl_FragColor\x20=\x20vec4(outgoingLight,\x20opacity);\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<tonemapping_fragment>\x0a\x20\x20\x20\x20\x20\x20\x20\x20#include\x20<colorspace_fragment>\x0a\x20\x20\x20\x20\x20\x20}',
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