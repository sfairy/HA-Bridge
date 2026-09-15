export function startSceneSync({
  eligible: isEligible,
  read: readSceneUpdate,
  apply: applySceneUpdate,
  interval: intervalMs = 5000,
  schedule: scheduleTimeout = setTimeout,
  cancel: cancelTimeout = clearTimeout
}) {
  let isStopped = false;
  let timerId;
  let abortController;
  let failureCount = 0;
  async function runSync() {
    if (!isStopped) {
      try {
        if (!isEligible()) {
          return;
        }
        abortController = new AbortController();
        const sceneUpdatePayload = await readSceneUpdate(abortController.signal);
        if (!isStopped && sceneUpdatePayload && isEligible()) {
          await applySceneUpdate(sceneUpdatePayload);
        }
        failureCount = 0;
      } catch {
        failureCount++;
      } finally {
        abortController = null;
        if (!isStopped) {
          timerId = scheduleTimeout(
            runSync,
            Math.min(60000, intervalMs * 2 ** Math.min(failureCount, 4))
          );
        }
      }
    }
  }
  timerId = scheduleTimeout(runSync, intervalMs);
  return () => {
    isStopped = true;
    cancelTimeout(timerId);
    abortController?.abort();
  };
}
