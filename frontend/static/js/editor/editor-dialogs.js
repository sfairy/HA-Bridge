export function deferHiddenEditorDialogs(
  dialogs = document.querySelectorAll("body > dialog.settings-dialog"),
) {
  for (const dialog of dialogs) {
    if (
      !(dialog instanceof HTMLDialogElement) ||
      dialog.dataset.lazyEditorDialog === "true"
    ) {
      continue;
    }
    dialog.dataset.lazyEditorDialog = "true";
    const show = dialog.show.bind(dialog);
    const showModal = dialog.showModal.bind(dialog);
    const ensureAttached = () => {
      if (!dialog.isConnected) {
        document.body.append(dialog);
      }
    };
    dialog.show = (...args) => (ensureAttached(), show(...args));
    dialog.showModal = (...args) => (ensureAttached(), showModal(...args));
    dialog.addEventListener("close", () => {
      window.requestAnimationFrame(() => {
        if (!dialog.open && dialog.isConnected) {
          dialog.remove();
        }
      });
    });
    dialog.remove();
  }
}
export function installSettingsDialogBackdropGuard() {
  const pointerStartedOnBackdrop = new WeakMap();
  document.addEventListener(
    "pointerdown",
    (event) => {
      const dialog = event.target?.closest?.("dialog.settings-dialog");
      if (dialog) {
        pointerStartedOnBackdrop.set(dialog, event.target === dialog);
      }
    },
    true,
  );
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLDialogElement) ||
        !target.matches(".settings-dialog")
      ) {
        return;
      }
      const startedOnBackdrop = pointerStartedOnBackdrop.get(target);
      pointerStartedOnBackdrop.delete(target);
      if (startedOnBackdrop === false) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
}
