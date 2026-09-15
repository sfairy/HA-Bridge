export const BACKGROUND_THEMES = [
  ["grid", "经典网格"],
  ["dots", "微光星尘"]
];
export const normalizeBackgroundTheme = themeName =>
  themeName === "dots" || themeName === "contours" ? "dots" : "grid";
const GROUND_THEME_UNIFORM_CHUNK =
  "\nvarying vec2 vHbGround;\nuniform float hbGroundTheme;\nuniform float hbGroundSpan;\nuniform float hbGroundCoverage;\nuniform float hbGroundFallback;\nuniform vec2 hbGroundCenter;\nuniform vec3 hbGroundDeep;\nuniform float hbGroundActivity;\nuniform vec3 hbGroundPulse;\nuniform vec3 hbGroundInk;\nuniform vec3 hbGroundAccent;\n";
const GROUND_THEME_FRAGMENT_CHUNK =
  "\nif (hbGroundTheme > 0.5) {\ndiffuseColor.a = (hbGroundFallback >= 0.0 ? hbGroundFallback : diffuseColor.a) / hbGroundCoverage;\nvec2 bgP = vHbGround - hbGroundCenter;\nvec2 bgUV = bgP / hbGroundSpan;\nfloat bgR2 = dot(bgUV, bgUV);\nfloat bgHalo = exp(-bgR2 * 0.55);\nfloat bgCore = exp(-bgR2 * 2.4);\nfloat bgFade = 1.0 - smoothstep(2.2, 4.2, length(bgUV));\nfloat bgAge = hbGroundPulse.z;\n// A broad, quiet response; never a sharp concentric ring.\nvec2 bgTouch = (vHbGround - hbGroundPulse.xy) / (hbGroundSpan * 0.38);\nfloat bgFeedback = exp(-dot(bgTouch, bgTouch) * 0.6)\n  * max(0.0, 1.0 - bgAge / 1.25);\nvec3 bgBase = mix(diffuseColor.rgb * 0.34, hbGroundDeep, 0.84);\nbgBase *= mix(1.0, 0.62, smoothstep(0.65, 2.8, length(bgUV)));\nvec3 bgLight = hbGroundInk * bgHalo * 0.085 + hbGroundAccent * bgCore * 0.014;\n  // Uneven, widely separated motes. Fixed world size and pixel coverage keep\n  // far points from turning into a dense, equally bright dotted wallpaper.\n  vec2 bgCellP = bgUV / 0.44;\n  vec2 bgCell = floor(bgCellP);\n  float bgSeed = fract(sin(dot(bgCell, vec2(127.1, 311.7))) * 43758.5453);\n  float bgSeed2 = fract(sin(dot(bgCell, vec2(269.5, 183.3))) * 43758.5453);\n  vec2 bgOffset = vec2(bgSeed, bgSeed2) * 0.64 + 0.18;\n  float bgDistance = length(fract(bgCellP) - bgOffset);\n  float bgAA = max(length(fwidth(bgCellP)), 0.0001);\n  float bgRadius = mix(0.004, 0.012, bgSeed2);\n  float bgPoint = (1.0 - smoothstep(bgRadius, bgRadius + bgAA * 0.75, bgDistance))\n    * min(1.0, bgRadius / bgAA) * step(0.66, bgSeed);\n  float bgVeil = (0.2 + 0.8 * exp(-bgR2 * 0.22)) * bgFade;\n  bgLight += hbGroundAccent * bgPoint * bgVeil * (0.32 + hbGroundActivity * 0.06);\ndiffuseColor.rgb = bgBase + bgLight * (1.0 + hbGroundActivity * 0.12)\n  + hbGroundAccent * bgFeedback * bgFade * 0.009;\n}\n";
export function createBackgroundTheme(
  stageOptions,
  requestFrame = () => {},
  now = () => performance.now()
) {
  const { THREE: THREE } = stageOptions;
  const entriesByObject = new Map();
  const gridObjects = new Set();
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const inkColor = new THREE.Color("#6b8199");
  const accentColor = new THREE.Color("#b5cbd8");
  const deepColor = new THREE.Color("#182431");
  const prefersReducedMotion =
    globalThis.window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
  let activeTheme = "grid";
  let isSyncEnabled = true;
  let isDisposed = false;
  let isAnimating = false;
  let lastInteractionMs = -Infinity;
  let lastPulseMs = -Infinity;
  let pulsingObject = null;
  let lastOpaqueObject = null;
  const pulseNdc = new THREE.Vector2();
  const BLEND_PROPERTY_KEYS = [
    "blending",
    "blendEquation",
    "blendSrc",
    "blendDst",
    "blendEquationAlpha",
    "blendSrcAlpha",
    "blendDstAlpha"
  ];
  const shouldRemainVisible = candidateObject =>
    !candidateObject.userData.floorBackgroundHidden ||
    !!candidateObject.userData.backgroundThemeKeepVisible;
  function restoreMaterial(entry) {
    const {
      material: entryMaterial,
      beforeCompile: originalBeforeCompile,
      programKey: originalProgramKey
    } = entry;
    entry.uniforms.hbGroundTheme.value = 0;
    delete entry.object.userData.backgroundThemeKeepVisible;
    for (const blendProperty of BLEND_PROPERTY_KEYS) {
      entryMaterial[blendProperty] = entry.blend[blendProperty];
    }
    if (entryMaterial.onBeforeCompile === entry.compile) {
      entryMaterial.onBeforeCompile = originalBeforeCompile;
    }
    if (entryMaterial.customProgramCacheKey === entry.key) {
      entryMaterial.customProgramCacheKey = originalProgramKey;
    }
    entryMaterial.needsUpdate = true;
  }
  function applyGroundTheme(meshObject) {
    const meshMaterial = meshObject.material;
    if (!meshMaterial?.isMeshBasicMaterial || !meshObject.geometry?.parameters?.width) {
      return;
    }
    const groundThemeEntry = {
      object: meshObject,
      material: meshMaterial,
      beforeCompile: meshMaterial.onBeforeCompile,
      programKey: meshMaterial.customProgramCacheKey,
      blend: Object.fromEntries(
        BLEND_PROPERTY_KEYS.map(blendPropertyKey => [
          blendPropertyKey,
          meshMaterial[blendPropertyKey]
        ])
      ),
      uniforms: {
        hbGroundTheme: {
          value: activeTheme === "dots" ? 1 : 0
        },
        hbGroundCoverage: {
          value: 1
        },
        hbGroundFallback: {
          value: -1
        },
        hbGroundSpan: {
          value: Math.max(6, (meshObject.geometry.parameters.width / 16) * 0.7)
        },
        hbGroundCenter: {
          value: new THREE.Vector2()
        },
        hbGroundDeep: {
          value: deepColor
        },
        hbGroundActivity: {
          value: 0
        },
        hbGroundPulse: {
          value: new THREE.Vector3(0, 0, 2)
        },
        hbGroundInk: {
          value: inkColor
        },
        hbGroundAccent: {
          value: accentColor
        }
      }
    };
    const baseProgramKey = groundThemeEntry.programKey
      .call(meshMaterial)
      .replace(/:hb-ground-theme-v[0-9]+/g, "");
    groundThemeEntry.compile = function (shader, renderer) {
      groundThemeEntry.beforeCompile.call(this, shader, renderer);
      Object.assign(shader.uniforms, groundThemeEntry.uniforms);
      if (!shader.fragmentShader.includes("uniform float hbGroundTheme;")) {
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", "#include <common>\nvarying vec2 vHbGround;")
          .replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvHbGround = vec2(position.x, -position.y);"
          );
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", "#include <common>\n" + GROUND_THEME_UNIFORM_CHUNK)
          .replace(
            "#include <color_fragment>",
            "#include <color_fragment>\n" + GROUND_THEME_FRAGMENT_CHUNK
          );
      }
    };
    groundThemeEntry.key = () => baseProgramKey + ":hb-ground-theme-v5";
    meshMaterial.onBeforeCompile = groundThemeEntry.compile;
    meshMaterial.customProgramCacheKey = groundThemeEntry.key;
    meshMaterial.needsUpdate = true;
    entriesByObject.set(meshObject, groundThemeEntry);
  }
  function resetInteraction() {
    lastInteractionMs = lastPulseMs = -Infinity;
    pulsingObject = null;
    for (const entryToReset of entriesByObject.values()) {
      entryToReset.uniforms.hbGroundActivity.value = 0;
      entryToReset.uniforms.hbGroundPulse.value.z = 2;
    }
    if (isAnimating) {
      isAnimating = false;
      stageOptions.backgroundFrame?.(false);
    }
  }
  return {
    get theme() {
      return activeTheme;
    },
    get active() {
      return isAnimating;
    },
    get materialCount() {
      return entriesByObject.size;
    },
    configure(configuredTheme) {
      const normalizedTheme = normalizeBackgroundTheme(configuredTheme);
      if (isDisposed || normalizedTheme === activeTheme) {
        return false;
      }
      resetInteraction();
      activeTheme = normalizedTheme;
      for (const themeEntry of entriesByObject.values()) {
        themeEntry.uniforms.hbGroundTheme.value = normalizedTheme === "dots" ? 1 : 0;
      }
      requestFrame();
      return true;
    },
    sync(sceneObjects, isBackgroundEnabled) {
      if (isDisposed) {
        return;
      }
      isSyncEnabled = isBackgroundEnabled !== false;
      if (!isSyncEnabled) {
        resetInteraction();
      }
      const themedObjects = new Set();
      for (const themedObject of sceneObjects) {
        if (themedObject.userData.exportRole === "grid") {
          themedObject.userData.backgroundThemeHidden = activeTheme !== "grid";
          gridObjects.add(themedObject);
        } else if (themedObject.userData.exportRole === "background" && activeTheme !== "grid") {
          themedObjects.add(themedObject);
          const staleMaterialEntry = entriesByObject.get(themedObject);
          if (staleMaterialEntry && staleMaterialEntry.material !== themedObject.material) {
            restoreMaterial(staleMaterialEntry);
            entriesByObject.delete(themedObject);
          }
          if (!entriesByObject.has(themedObject)) {
            applyGroundTheme(themedObject);
          }
          const entryForObject = entriesByObject.get(themedObject);
          const orbitCenter = stageOptions.getOrbitCenter?.();
          if (entryForObject && orbitCenter?.length === 3 && orbitCenter.every(Number.isFinite)) {
            themedObject.updateWorldMatrix(true, false);
            const localOrbitCenter = themedObject.worldToLocal(new THREE.Vector3(...orbitCenter));
            entryForObject.uniforms.hbGroundCenter.value.set(
              localOrbitCenter.x,
              -localOrbitCenter.y
            );
          }
        }
      }
      for (const [trackedObject, trackedEntry] of entriesByObject) {
        if (!themedObjects.has(trackedObject) || trackedEntry.material !== trackedObject.material) {
          restoreMaterial(trackedEntry);
          entriesByObject.delete(trackedObject);
        }
      }
      for (const staleGridObject of gridObjects) {
        if (!sceneObjects.includes(staleGridObject)) {
          delete staleGridObject.userData.backgroundThemeHidden;
          gridObjects.delete(staleGridObject);
        }
      }
      for (const resetEntry of entriesByObject.values()) {
        delete resetEntry.object.userData.backgroundThemeKeepVisible;
        resetEntry.uniforms.hbGroundFallback.value = -1;
      }
      const visibleEntries = [...entriesByObject.values()].filter(visibleEntry =>
        shouldRemainVisible(visibleEntry.object)
      );
      let totalOpacity = visibleEntries.reduce(
        (opacityAccumulator, contributingEntry) =>
          opacityAccumulator + contributingEntry.material.opacity,
        0
      );
      const previousFallbackEntry = entriesByObject.get(lastOpaqueObject);
      const fallbackEntry =
        previousFallbackEntry?.material.transparent &&
        !visibleEntries.includes(previousFallbackEntry) &&
        previousFallbackEntry.material.opacity > 0
          ? previousFallbackEntry
          : [...entriesByObject.values()]
              .filter(
                transparentEntry =>
                  transparentEntry.material.transparent &&
                  !visibleEntries.includes(transparentEntry)
              )
              .sort(
                (firstEntry, secondEntry) =>
                  secondEntry.material.opacity - firstEntry.material.opacity
              )[0];
      if (
        fallbackEntry?.material.transparent &&
        !visibleEntries.includes(fallbackEntry) &&
        totalOpacity < 1
      ) {
        fallbackEntry.object.userData.backgroundThemeKeepVisible = true;
        fallbackEntry.uniforms.hbGroundFallback.value = 1 - totalOpacity;
        totalOpacity = 1;
      } else if (visibleEntries.length === 1 && visibleEntries[0].material.opacity > 0.999) {
        lastOpaqueObject = visibleEntries[0].object;
      }
      totalOpacity = Math.max(1, totalOpacity);
      for (const blendTargetEntry of entriesByObject.values()) {
        const { material: targetMaterial, uniforms: targetUniforms } = blendTargetEntry;
        targetUniforms.hbGroundCoverage.value = targetMaterial.transparent ? totalOpacity : 1;
        if (targetMaterial.transparent) {
          targetMaterial.blending = THREE.CustomBlending;
          targetMaterial.blendEquation = targetMaterial.blendEquationAlpha = THREE.AddEquation;
          targetMaterial.blendSrc = targetMaterial.premultipliedAlpha
            ? THREE.OneFactor
            : THREE.SrcAlphaFactor;
          targetMaterial.blendDst =
            targetMaterial.blendSrcAlpha =
            targetMaterial.blendDstAlpha =
              THREE.OneFactor;
        }
      }
    },
    interact(pointerEvent, shouldRaycast = false) {
      if (
        isDisposed ||
        !isSyncEnabled ||
        activeTheme === "grid" ||
        prefersReducedMotion ||
        !entriesByObject.size
      ) {
        return;
      }
      const interactionTimestampMs = now();
      lastInteractionMs = interactionTimestampMs;
      if (shouldRaycast) {
        const canvasRect = stageOptions.canvas.getBoundingClientRect();
        if (canvasRect.width && canvasRect.height) {
          pointerNdc.set(
            ((pointerEvent.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            1 - ((pointerEvent.clientY - canvasRect.top) / canvasRect.height) * 2
          );
          raycaster.setFromCamera(pointerNdc, stageOptions.camera);
          const raycastTargets = [...entriesByObject.keys()].filter(candidateMeshObject => {
            for (
              let visibilityAncestor = candidateMeshObject;
              visibilityAncestor;
              visibilityAncestor = visibilityAncestor.parent
            ) {
              if (!visibilityAncestor.visible) {
                return false;
              }
            }
            candidateMeshObject.updateWorldMatrix(true, false);
            return true;
          });
          const firstHit = raycaster.intersectObjects(raycastTargets, false)[0];
          if (firstHit) {
            const localHitPoint = firstHit.object.worldToLocal(firstHit.point);
            pulseNdc.set(localHitPoint.x, -localHitPoint.y);
            pulsingObject = firstHit.object;
            lastPulseMs = interactionTimestampMs;
          }
        }
      }
      requestFrame();
    },
    tick(frameTimestampMs) {
      if (isDisposed || !isSyncEnabled || activeTheme === "grid" || prefersReducedMotion) {
        resetInteraction();
        return Infinity;
      }
      const interactionStrength = Math.max(0, 1 - (frameTimestampMs - lastInteractionMs) / 400);
      const pulseAgeSeconds = Math.min(2, Math.max(0, (frameTimestampMs - lastPulseMs) / 1000));
      const isInteractionActive = interactionStrength > 0 || pulseAgeSeconds < 1.25;
      if (!isInteractionActive && !isAnimating) {
        return Infinity;
      }
      for (const [uniformTargetObject, uniformTargetEntry] of entriesByObject) {
        uniformTargetEntry.uniforms.hbGroundActivity.value = interactionStrength;
        uniformTargetEntry.uniforms.hbGroundPulse.value.set(
          pulseNdc.x,
          pulseNdc.y,
          uniformTargetObject === pulsingObject ? pulseAgeSeconds : 2
        );
      }
      isAnimating = isInteractionActive;
      stageOptions.backgroundFrame?.(isInteractionActive);
      if (isInteractionActive) {
        return 1000 / 30;
      } else {
        return Infinity;
      }
    },
    suspend() {
      resetInteraction();
    },
    dispose() {
      resetInteraction();
      isDisposed = true;
      for (const disposeEntry of entriesByObject.values()) {
        restoreMaterial(disposeEntry);
      }
      for (const hiddenGridObject of gridObjects) {
        delete hiddenGridObject.userData.backgroundThemeHidden;
      }
      entriesByObject.clear();
      gridObjects.clear();
    }
  };
}
