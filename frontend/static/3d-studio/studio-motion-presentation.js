export function createMotionPresentation({
  reflections: setReflections,
  shadows: setShadows,
  liveCameraReflections: liveCameraReflectionsEnabled = false
}) {
  let isFloorMotionActive = false;
  let isCameraMotionActive = false;
  let isMotionSettled = false;
  let shouldReflectLiveCamera = liveCameraReflectionsEnabled;
  function publishMotionState() {
    setReflections(
      (isFloorMotionActive || (isCameraMotionActive && !shouldReflectLiveCamera)) &&
        !isMotionSettled
    );
    setShadows(isFloorMotionActive && !isMotionSettled);
  }
  return {
    floor(isFloorActive) {
      isFloorMotionActive = !!isFloorActive;
      if (isFloorMotionActive) {
        isMotionSettled = false;
      }
      publishMotionState();
    },
    camera(isCameraActive, { live: liveReflections = liveCameraReflectionsEnabled } = {}) {
      isCameraMotionActive = !!isCameraActive;
      shouldReflectLiveCamera = liveReflections;
      if (isCameraMotionActive) {
        isMotionSettled = false;
      }
      publishMotionState();
    },
    advance(progress) {
      if (
        (!!isFloorMotionActive || !!isCameraMotionActive) &&
        !isMotionSettled &&
        !(progress < 0.9)
      ) {
        isMotionSettled = true;
        publishMotionState();
      }
    }
  };
}
