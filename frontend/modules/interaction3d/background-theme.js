export const BACKGROUND_THEMES = [
  ['grid', '经典网格'],
  ['dots', '微光星尘']
];

export const normalizeBackgroundTheme = theme => (
  theme === 'dots' || theme === 'contours' ? 'dots' : 'grid'
);

const GROUND_THEME_UNIFORMS = `
varying vec2 vHbGround;
uniform float hbGroundTheme;
uniform float hbGroundSpan;
uniform float hbGroundCoverage;
uniform float hbGroundFallback;
uniform vec2 hbGroundCenter;
uniform vec3 hbGroundDeep;
uniform float hbGroundActivity;
uniform vec3 hbGroundPulse;
uniform vec3 hbGroundInk;
uniform vec3 hbGroundAccent;
`;

const GROUND_THEME_FRAGMENT = `
if (hbGroundTheme > 0.5) {
diffuseColor.a = (hbGroundFallback >= 0.0 ? hbGroundFallback : diffuseColor.a) / hbGroundCoverage;
vec2 bgP = vHbGround - hbGroundCenter;
vec2 bgUV = bgP / hbGroundSpan;
float bgR2 = dot(bgUV, bgUV);
float bgHalo = exp(-bgR2 * 0.55);
float bgCore = exp(-bgR2 * 2.4);
float bgFade = 1.0 - smoothstep(2.2, 4.2, length(bgUV));
float bgAge = hbGroundPulse.z;
// A broad, quiet response; never a sharp concentric ring.
vec2 bgTouch = (vHbGround - hbGroundPulse.xy) / (hbGroundSpan * 0.38);
float bgFeedback = exp(-dot(bgTouch, bgTouch) * 0.6)
  * max(0.0, 1.0 - bgAge / 1.25);
vec3 bgBase = mix(diffuseColor.rgb * 0.34, hbGroundDeep, 0.84);
bgBase *= mix(1.0, 0.62, smoothstep(0.65, 2.8, length(bgUV)));
vec3 bgLight = hbGroundInk * bgHalo * 0.085 + hbGroundAccent * bgCore * 0.014;
  // Uneven, widely separated motes. Fixed world size and pixel coverage keep
  // far points from turning into a dense, equally bright dotted wallpaper.
  vec2 bgCellP = bgUV / 0.44;
  vec2 bgCell = floor(bgCellP);
  float bgSeed = fract(sin(dot(bgCell, vec2(127.1, 311.7))) * 43758.5453);
  float bgSeed2 = fract(sin(dot(bgCell, vec2(269.5, 183.3))) * 43758.5453);
  vec2 bgOffset = vec2(bgSeed, bgSeed2) * 0.64 + 0.18;
  float bgDistance = length(fract(bgCellP) - bgOffset);
  float bgAA = max(length(fwidth(bgCellP)), 0.0001);
  float bgRadius = mix(0.004, 0.012, bgSeed2);
  float bgPoint = (1.0 - smoothstep(bgRadius, bgRadius + bgAA * 0.75, bgDistance))
    * min(1.0, bgRadius / bgAA) * step(0.66, bgSeed);
  float bgVeil = (0.2 + 0.8 * exp(-bgR2 * 0.22)) * bgFade;
  bgLight += hbGroundAccent * bgPoint * bgVeil * (0.32 + hbGroundActivity * 0.06);
diffuseColor.rgb = bgBase + bgLight * (1.0 + hbGroundActivity * 0.12)
  + hbGroundAccent * bgFeedback * bgFade * 0.009;
}
`;

export function createBackgroundTheme(stage, requestFrame = () => {}, now = () => performance.now()) {
  const { THREE } = stage;
  const themedMaterials = new Map();
  const gridObjects = new Set();
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const inkColor = new THREE.Color('#6b8199');
  const accentColor = new THREE.Color('#b5cbd8');
  const deepColor = new THREE.Color('#182431');
  const reducedMotion = globalThis.window?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  let theme = 'grid';
  let enabled = true;
  let disposed = false;
  let frameActive = false;
  let lastInteractAt = -Infinity;
  let lastPulseAt = -Infinity;
  let pulseObject = null;
  let coverageAnchor = null;
  const pulseLocal = new THREE.Vector2();
  const blendKeys = [
    'blending',
    'blendEquation',
    'blendSrc',
    'blendDst',
    'blendEquationAlpha',
    'blendSrcAlpha',
    'blendDstAlpha'
  ];
  const isVisibleBackground = object => !(
    object.userData.floorBackgroundHidden && !object.userData.backgroundThemeKeepVisible
  );

  function detachTheme(entry) {
    const { material, beforeCompile, programKey } = entry;
    entry.uniforms.hbGroundTheme.value = 0;
    delete entry.object.userData.backgroundThemeKeepVisible;
    for (const key of blendKeys) {
      material[key] = entry.blend[key];
    }
    if (material.onBeforeCompile === entry.compile) {
      material.onBeforeCompile = beforeCompile;
    }
    if (material.customProgramCacheKey === entry.key) {
      material.customProgramCacheKey = programKey;
    }
    material.needsUpdate = true;
  }

  function attachTheme(object) {
    const material = object.material;
    if (!material?.isMeshBasicMaterial || !object.geometry?.parameters?.width) {
      return;
    }
    const entry = {
      object,
      material,
      beforeCompile: material.onBeforeCompile,
      programKey: material.customProgramCacheKey,
      blend: Object.fromEntries(blendKeys.map(key => [key, material[key]])),
      uniforms: {
        hbGroundTheme: { value: theme === 'dots' ? 1 : 0 },
        hbGroundCoverage: { value: 1 },
        hbGroundFallback: { value: -1 },
        hbGroundSpan: { value: Math.max(6, object.geometry.parameters.width / 16 * 0.7) },
        hbGroundCenter: { value: new THREE.Vector2() },
        hbGroundDeep: { value: deepColor },
        hbGroundActivity: { value: 0 },
        hbGroundPulse: { value: new THREE.Vector3(0, 0, 2) },
        hbGroundInk: { value: inkColor },
        hbGroundAccent: { value: accentColor }
      }
    };
    const baseCacheKey = entry.programKey.call(material).replace(/:hb-ground-theme-v[0-9]+/g, '');
    entry.compile = function (shader, renderer) {
      entry.beforeCompile.call(this, shader, renderer);
      Object.assign(shader.uniforms, entry.uniforms);
      if (!shader.fragmentShader.includes('uniform float hbGroundTheme;')) {
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec2 vHbGround;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHbGround = vec2(position.x, -position.y);');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\n' + GROUND_THEME_UNIFORMS)
          .replace('#include <color_fragment>', '#include <color_fragment>\n' + GROUND_THEME_FRAGMENT);
      }
    };
    entry.key = () => baseCacheKey + ':hb-ground-theme-v5';
    material.onBeforeCompile = entry.compile;
    material.customProgramCacheKey = entry.key;
    material.needsUpdate = true;
    themedMaterials.set(object, entry);
  }

  function clearActivity() {
    lastInteractAt = lastPulseAt = -Infinity;
    pulseObject = null;
    for (const entry of themedMaterials.values()) {
      entry.uniforms.hbGroundActivity.value = 0;
      entry.uniforms.hbGroundPulse.value.z = 2;
    }
    if (frameActive) {
      frameActive = false;
      stage.backgroundFrame?.(false);
    }
  }

  return {
    get theme() {
      return theme;
    },
    get active() {
      return frameActive;
    },
    get materialCount() {
      return themedMaterials.size;
    },
    configure(nextTheme) {
      const normalized = normalizeBackgroundTheme(nextTheme);
      if (disposed || normalized === theme) {
        return false;
      }
      clearActivity();
      theme = normalized;
      for (const entry of themedMaterials.values()) {
        entry.uniforms.hbGroundTheme.value = normalized === 'dots' ? 1 : 0;
      }
      requestFrame();
      return true;
    },
    sync(objects, nextEnabled) {
      if (disposed) {
        return;
      }
      enabled = nextEnabled !== false;
      if (!enabled) {
        clearActivity();
      }
      const keep = new Set();
      for (const object of objects) {
        if (object.userData.exportRole === 'grid') {
          object.userData.backgroundThemeHidden = theme !== 'grid';
          gridObjects.add(object);
          continue;
        }
        if (object.userData.exportRole === 'background' && theme !== 'grid') {
          keep.add(object);
          const existing = themedMaterials.get(object);
          if (existing && existing.material !== object.material) {
            detachTheme(existing);
            themedMaterials.delete(object);
          }
          if (!themedMaterials.has(object)) {
            attachTheme(object);
          }
          const entry = themedMaterials.get(object);
          const orbitCenter = stage.getOrbitCenter?.();
          if (entry && orbitCenter?.length === 3 && orbitCenter.every(Number.isFinite)) {
            object.updateWorldMatrix(true, false);
            const local = object.worldToLocal(new THREE.Vector3(...orbitCenter));
            entry.uniforms.hbGroundCenter.value.set(local.x, -local.y);
          }
        }
      }
      for (const [object, entry] of themedMaterials) {
        if (!keep.has(object) || entry.material !== object.material) {
          detachTheme(entry);
          themedMaterials.delete(object);
        }
      }
      for (const object of gridObjects) {
        if (!objects.includes(object)) {
          delete object.userData.backgroundThemeHidden;
          gridObjects.delete(object);
        }
      }
      for (const entry of themedMaterials.values()) {
        delete entry.object.userData.backgroundThemeKeepVisible;
        entry.uniforms.hbGroundFallback.value = -1;
      }
      const visibleEntries = [...themedMaterials.values()].filter(entry => isVisibleBackground(entry.object));
      let coverage = visibleEntries.reduce((sum, entry) => sum + entry.material.opacity, 0);
      const anchored = themedMaterials.get(coverageAnchor);
      const fallbackCandidate = anchored?.material.transparent
        && !visibleEntries.includes(anchored)
        && anchored.material.opacity > 0
        ? anchored
        : [...themedMaterials.values()]
          .filter(entry => entry.material.transparent && !visibleEntries.includes(entry))
          .sort((a, b) => b.material.opacity - a.material.opacity)[0];
      if (fallbackCandidate?.material.transparent && !visibleEntries.includes(fallbackCandidate) && coverage < 1) {
        fallbackCandidate.object.userData.backgroundThemeKeepVisible = true;
        fallbackCandidate.uniforms.hbGroundFallback.value = 1 - coverage;
        coverage = 1;
      } else if (visibleEntries.length === 1 && visibleEntries[0].material.opacity > 0.999) {
        coverageAnchor = visibleEntries[0].object;
      }
      coverage = Math.max(1, coverage);
      for (const entry of themedMaterials.values()) {
        const { material, uniforms } = entry;
        uniforms.hbGroundCoverage.value = material.transparent ? coverage : 1;
        if (material.transparent) {
          material.blending = THREE.CustomBlending;
          material.blendEquation = material.blendEquationAlpha = THREE.AddEquation;
          material.blendSrc = material.premultipliedAlpha ? THREE.OneFactor : THREE.SrcAlphaFactor;
          material.blendDst = material.blendSrcAlpha = material.blendDstAlpha = THREE.OneFactor;
        }
      }
    },
    interact(event, hitTest = false) {
      if (disposed || !enabled || theme === 'grid' || reducedMotion || !themedMaterials.size) {
        return;
      }
      const timestamp = now();
      lastInteractAt = timestamp;
      if (hitTest) {
        const rect = stage.canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          pointerNdc.set(
            (event.clientX - rect.left) / rect.width * 2 - 1,
            1 - (event.clientY - rect.top) / rect.height * 2
          );
          raycaster.setFromCamera(pointerNdc, stage.camera);
          const targets = [...themedMaterials.keys()].filter(object => {
            for (let node = object; node; node = node.parent) {
              if (!node.visible) {
                return false;
              }
            }
            object.updateWorldMatrix(true, false);
            return true;
          });
          const hit = raycaster.intersectObjects(targets, false)[0];
          if (hit) {
            const local = hit.object.worldToLocal(hit.point);
            pulseLocal.set(local.x, -local.y);
            pulseObject = hit.object;
            lastPulseAt = timestamp;
          }
        }
      }
      requestFrame();
    },
    tick(timestamp) {
      if (disposed || !enabled || theme === 'grid' || reducedMotion) {
        clearActivity();
        return Infinity;
      }
      const activity = Math.max(0, 1 - (timestamp - lastInteractAt) / 400);
      const pulseAge = Math.min(2, Math.max(0, (timestamp - lastPulseAt) / 1000));
      const keepFrame = activity > 0 || pulseAge < 1.25;
      if (!keepFrame && !frameActive) {
        return Infinity;
      }
      for (const [object, entry] of themedMaterials) {
        entry.uniforms.hbGroundActivity.value = activity;
        entry.uniforms.hbGroundPulse.value.set(
          pulseLocal.x,
          pulseLocal.y,
          object === pulseObject ? pulseAge : 2
        );
      }
      frameActive = keepFrame;
      stage.backgroundFrame?.(keepFrame);
      return keepFrame ? 1000 / 30 : Infinity;
    },
    suspend() {
      clearActivity();
    },
    dispose() {
      clearActivity();
      disposed = true;
      for (const entry of themedMaterials.values()) {
        detachTheme(entry);
      }
      for (const object of gridObjects) {
        delete object.userData.backgroundThemeHidden;
      }
      themedMaterials.clear();
      gridObjects.clear();
    }
  };
}
