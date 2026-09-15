export function syncAppleDisplaySurface(docModel, win = window) {
  const { document: doc, navigator: nav } = win;
  const isApple =
    /iPad|iPhone|iPod/i.test(nav.userAgent || "") ||
    (/Macintosh/i.test(nav.userAgent || "") && Number(nav.maxTouchPoints || 0) > 1);
  const isStandalone =
    nav.standalone === true || win.matchMedia?.("(display-mode: standalone)").matches === true;
  if (!isApple || !isStandalone) {
    return;
  }
  const background = docModel?.canvas?.background;
  const surfaceColor =
    background?.type === "color" &&
    typeof background.color === "string" &&
    win.CSS?.supports("color", background.color)
      ? background.color
      : "#070b0e";
  doc.documentElement.style.setProperty("--display-surface-background", surfaceColor);
  doc.querySelector('meta[name="theme-color"]')?.setAttribute("content", surfaceColor);
}
