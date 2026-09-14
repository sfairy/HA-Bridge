const EDITOR_MIN_WIDTH = 1020;
const TEMPLATE_DIALOG_SCALE_FACTOR = 1.1;
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export function syncEditorViewportFit({ editorHeader, editorShell } = {}) {
  const header = editorHeader || document.querySelector('.editor-header');
  const shell = editorShell || document.querySelector('.editor-shell');
  if (!header || !shell) {
    return;
  }
  const layoutHeight = Math.max(1, header.offsetHeight + shell.offsetHeight);
  const scale = Math.min(1, window.innerWidth / EDITOR_MIN_WIDTH, window.innerHeight / layoutHeight);
  const needsViewportFit = scale < 0.999;
  document.documentElement.classList.toggle('editor-viewport-fit', needsViewportFit);
  document.documentElement.style.setProperty('--editor-layout-height', `${layoutHeight}px`);
  document.documentElement.style.setProperty('--editor-viewport-scale', String(scale));
}

export function syncComponentTemplateDialogScale() {
  const scale = Math.max(
    0.1,
    TEMPLATE_DIALOG_SCALE_FACTOR * Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT),
  );
  document.documentElement.style.setProperty('--component-template-dialog-scale', String(scale));
}

export function installEditorViewportListeners() {
  const refresh = () => {
    syncEditorViewportFit();
    syncComponentTemplateDialogScale();
  };
  refresh();
  window.addEventListener('resize', refresh);
  return () => window.removeEventListener('resize', refresh);
}
