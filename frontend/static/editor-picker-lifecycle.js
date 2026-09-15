export function createEditorPickerLifecycle({
  getEntitiesLoaded: getEntitiesLoaded,
  getEntityLoadPromise: getEntityLoadPromise,
  loadEntities: loadEntities,
  reportError: reportError
}) {
  const busyElements = new WeakSet();
  function deferUntilEntitiesLoaded(hostElement, onEntitiesReady, shouldProceed = () => !0) {
    if (getEntitiesLoaded()) return !1;
    if (busyElements.has(hostElement)) return !0;
    const existingPromise = getEntityLoadPromise(),
      hasExistingPromise = !!existingPromise,
      loadPromise = existingPromise || loadEntities();
    return (
      busyElements.add(hostElement),
      hostElement?.setAttribute("aria-busy", "true"),
      Promise.resolve(loadPromise)
        .then(() => {
          !getEntitiesLoaded() ||
            !hostElement?.isConnected ||
            !shouldProceed() ||
            onEntitiesReady();
        })
        .catch(loadError => {
          hasExistingPromise || reportError(loadError);
        })
        .finally(() => {
          (busyElements.delete(hostElement), hostElement?.removeAttribute("aria-busy"));
        }),
      !0
    );
  }
  return { deferUntilEntitiesLoaded: deferUntilEntitiesLoaded };
}
