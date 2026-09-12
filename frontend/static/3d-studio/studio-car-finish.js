export const CAR_LAMP_LENSES = {
  'front': [[[208, 193], [238, 197], [257, 208], [215, 208]], [[376, 208], [404, 195], [421, 193], [416, 207]], [[90, 373], [117, 360], [141, 357], [123, 373]]],
  'rear': [[[461, 188], [470, 181], [482, 181], [482, 192]], [[630, 181], [655, 181], [675, 189], [654, 192]], [[626, 350], [639, 343], [657, 341], [655, 351]]]
};
const uvCoord = point => 'vec2(' + (point[0] / 700).toFixed(7) + ',\x20' + (point[1] / 700).toFixed(7) + ')';
const lensEdges = polygon => {
  const ordered = polygon.reduce((sum, point, index) => {
    const next = polygon[(index + 1) % polygon.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) > 0 ? polygon : [...polygon].reverse();
  return ordered.map((point, index) => 'hbCarLensEdge(carUv, ' + uvCoord(point) + ',\x20' + uvCoord(ordered[(index + 1) % ordered.length]) + ')').join(' * ');
};
const lensCoverage = lamp => CAR_LAMP_LENSES[lamp].map(lensEdges).map(expression => '(' + expression + ')').join('\x20+\x20');
export function applyCarFinish(material) {
  if (!material?.isMeshStandardMaterial || material.userData.hbCarFinish) {
    return material;
  }
  const previousOnBeforeCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey?.call(material) || '';
  material.onBeforeCompile = function (shader, renderer) {
    previousOnBeforeCompile?.call(this, shader, renderer);
    shader.vertexShader = 'varying\x20float\x20vHbCarHeight;\x0avarying\x20float\x20vHbCarLength;\x0a' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include\x20<begin_vertex>', '#include\x20<begin_vertex>\x0avHbCarHeight\x20=\x20position.z;\x0avHbCarLength\x20=\x20position.y;');
    shader.fragmentShader = 'varying\x20float\x20vHbCarHeight;\x0a\x20\x20\x20\x20\x20\x20varying\x20float\x20vHbCarLength;\x0a\x20\x20\x20\x20\x20\x20float\x20hbCarLensEdge(vec2\x20uv,\x20vec2\x20a,\x20vec2\x20b)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20edge\x20=\x20b\x20-\x20a,\x20offset\x20=\x20uv\x20-\x20a;\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20distance\x20=\x20(edge.x\x20*\x20offset.y\x20-\x20edge.y\x20*\x20offset.x)\x20/\x20length(edge);\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20smoothstep(-0.0005,\x200.001,\x20distance);\x0a\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include\x20<opaque_fragment>', '\x0a\x20\x20\x20\x20\x20\x20float\x20carDark\x20=\x201.0\x20-\x20smoothstep(0.035,\x200.16,\x20dot(diffuseColor.rgb,\x20vec3(0.2126,\x200.7152,\x200.0722)));\x0a\x20\x20\x20\x20\x20\x20float\x20carUpper\x20=\x20smoothstep(0.68,\x201.02,\x20vHbCarHeight);\x0a\x20\x20\x20\x20\x20\x20vec3\x20carView\x20=\x20normalize(vViewPosition);\x0a\x20\x20\x20\x20\x20\x20vec3\x20carReflection\x20=\x20inverseTransformDirection(reflect(-carView,\x20normal),\x20viewMatrix);\x0a\x20\x20\x20\x20\x20\x20float\x20carSky\x20=\x20smoothstep(-0.15,\x200.85,\x20carReflection.y);\x0a\x20\x20\x20\x20\x20\x20float\x20carSoftbox\x20=\x20pow(max(dot(carReflection,\x20normalize(vec3(-0.35,\x200.8,\x200.48))),\x200.0),\x2012.0);\x0a\x20\x20\x20\x20\x20\x20float\x20carFresnel\x20=\x20pow(1.0\x20-\x20max(dot(normal,\x20carView),\x200.0),\x204.0);\x0a\x20\x20\x20\x20\x20\x20outgoingLight\x20+=\x20carDark\x20*\x20carUpper\x20*\x20vec3(0.68,\x200.79,\x200.94)\x0a\x20\x20\x20\x20\x20\x20\x20\x20*\x20(0.012\x20+\x200.025\x20*\x20carSky\x20+\x200.07\x20*\x20carSoftbox\x20+\x200.035\x20*\x20carFresnel);\x0a\x20\x20\x20\x20\x20\x20#ifdef\x20USE_MAP\x0a\x20\x20\x20\x20\x20\x20\x20\x20vec2\x20carUv\x20=\x20fract(vMapUv);\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20carFrontLamp\x20=\x20clamp(' + lensCoverage('front') + ',\x200.0,\x201.0)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20*\x20(1.0\x20-\x20smoothstep(-1.95,\x20-1.85,\x20vHbCarLength));\x0a\x20\x20\x20\x20\x20\x20\x20\x20float\x20carRearLamp\x20=\x20clamp(' + lensCoverage('rear') + ', 0.0, 1.0)\n          * smoothstep(1.85, 1.95, vHbCarLength);\n        outgoingLight += carFrontLamp * vec3(2.0, 2.3, 2.6)\n          + carRearLamp * vec3(0.84, 0.036, 0.018);\n      #endif\n      #include <opaque_fragment>');
  };
  material.customProgramCacheKey = () => previousCacheKey + '|hb-car-finish-v4-lamps';
  material.userData.hbCarFinish = true;
  return material;
}