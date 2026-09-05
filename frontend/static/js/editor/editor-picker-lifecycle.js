export function createEditorPickerLifecycle({
  getEntitiesLoaded,
  getEntityLoadPromise,
  loadEntities,
  reportError,
}) {
  const pendingHosts = new WeakSet();
  function deferUntilEntitiesLoaded(host, onReady, isCurrent = () => true) {
    if (getEntitiesLoaded()) {
      return false;
    }
    if (pendingHosts.has(host)) {
      return true;
    }
    const existing = getEntityLoadPromise();
    const reusedExisting = !!existing;
    const loading = existing || loadEntities();
    pendingHosts.add(host);
    host?.setAttribute("aria-busy", "true");
    Promise.resolve(loading)
      .then(() => {
        if (getEntitiesLoaded() && host?.isConnected && isCurrent()) {
          onReady();
        }
      })
      .catch((error) => {
        if (!reusedExisting) {
          reportError(error);
        }
      })
      .finally(() => {
        pendingHosts.delete(host);
        host?.removeAttribute("aria-busy");
      });
    return true;
  }
  return { deferUntilEntitiesLoaded };
}
