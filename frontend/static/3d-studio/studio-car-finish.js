export const CAR_LAMP_LENSES = {
  'front': [[[208, 193], [238, 197], [257, 208], [215, 208]], [[376, 208], [404, 195], [421, 193], [416, 207]], [[90, 373], [117, 360], [141, 357], [123, 373]]],
  'rear': [[[461, 188], [470, 181], [482, 181], [482, 192]], [[630, 181], [655, 181], [675, 189], [654, 192]], [[626, 350], [639, 343], [657, 341], [655, 351]]]
};
const uvCoord = point => 'vec2(' + (point[0] / 700).toFixed(7) + ', ' + (point[1] / 700).toFixed(7) + ')';
const lensEdges = polygon => {
  const ordered = polygon.reduce((sum, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) > 0 ? polygon : [...polygon].reverse();
  return ordered.map((point, index) => 'hbCarLensEdge(carUv, ' + uvCoord(point) + ', ' + uvCoord(ordered[(index + 1) % ordered.length]) + ')').join(' * ');
};
const lensCoverage = lamp => CAR_LAMP_LENSES[lamp].map(lensEdges).map(expression => '(' + expression + ')').join(' + ');
export function applyCarFinish(material) {
  if (!material?.isMeshStandardMaterial || material.userData.hbCarFinish) {
    return material;
  }
  const previousOnBeforeCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey?.call(material) || '';
  material.onBeforeCompile = function (shader, renderer) {
    previousOnBeforeCompile?.call(this, shader, renderer);
    shader.vertexShader = 'varying float vHbCarHeight;\nvarying float vHbCarLength;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvHbCarHeight = position.z;\nvHbCarLength = position.y;');
    shader.fragmentShader = 'varying float vHbCarHeight;\n      varying float vHbCarLength;\n      float hbCarLensEdge(vec2 uv, vec2 a, vec2 b) {\n        vec2 edge = b - a, offset = uv - a;\n        float distance = (edge.x * offset.y - edge.y * offset.x) / length(edge);\n        return smoothstep(-0.0005, 0.001, distance);\n      }\n      ' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', '\n      float carDark = 1.0 - smoothstep(0.035, 0.16, dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722)));\n      float carUpper = smoothstep(0.68, 1.02, vHbCarHeight);\n      vec3 carView = normalize(vViewPosition);\n      vec3 carReflection = inverseTransformDirection(reflect(-carView, normal), viewMatrix);\n      float carSky = smoothstep(-0.15, 0.85, carReflection.y);\n      float carSoftbox = pow(max(dot(carReflection, normalize(vec3(-0.35, 0.8, 0.48))), 0.0), 12.0);\n      float carFresnel = pow(1.0 - max(dot(normal, carView), 0.0), 4.0);\n      outgoingLight += carDark * carUpper * vec3(0.68, 0.79, 0.94)\n        * (0.012 + 0.025 * carSky + 0.07 * carSoftbox + 0.035 * carFresnel);\n      #ifdef USE_MAP\n        vec2 carUv = fract(vMapUv);\n        float carFrontLamp = clamp(' + lensCoverage('front') + ', 0.0, 1.0)\n          * (1.0 - smoothstep(-1.95, -1.85, vHbCarLength));\n        float carRearLamp = clamp(' + lensCoverage('rear') + ', 0.0, 1.0)\n          * smoothstep(1.85, 1.95, vHbCarLength);\n        outgoingLight += carFrontLamp * vec3(2.0, 2.3, 2.6)\n          + carRearLamp * vec3(0.84, 0.036, 0.018);\n      #endif\n      #include <opaque_fragment>');
  };
  material.customProgramCacheKey = () => previousCacheKey + '|hb-car-finish-v4-lamps';
  material.userData.hbCarFinish = true;
  return material;
}