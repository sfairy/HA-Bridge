export function createMotionPresentation({
  reflections,
  shadows,
  liveCameraReflections = false
}) {
  let floorActive = false;
  let cameraActive = false;
  let advanced = false;
  let liveReflections = liveCameraReflections;
  function syncPresentation() {
    reflections((floorActive || cameraActive && !liveReflections) && !advanced);
    shadows(floorActive && !advanced);
  }
  return {
    floor(active) {
      floorActive = !!active;
      floorActive && (advanced = false);
      syncPresentation();
    },
    camera(active, {
      live = liveCameraReflections
    } = {}) {
      cameraActive = !!active;
      liveReflections = live;
      cameraActive && (advanced = false);
      syncPresentation();
    },
    advance(delta) {
      !(floorActive || cameraActive) || advanced || delta < 0.9 || (advanced = true, syncPresentation());
    }
  };
}
