(() => {
  const root = document.documentElement;
  const isCapturePreview =
    new URLSearchParams(location.search).get("capturePreview") === "1";
  const themeStorageKey = `ha-bridge:display-theme:${location.pathname}`;

  root.classList.toggle("capture-preview", isCapturePreview);
  try {
    const saved = localStorage.getItem(themeStorageKey);
    if (saved === "dark" || saved === "light") {
      root.dataset.displayTheme = saved;
    }
  } catch {
    /* ignore */
  }

  let phase = isCapturePreview ? "done" : "loading";
  let pollTimer;
  let failTimer;
  let leaveTimer;
  let slowHintTimer;
  const bootStartedAt = performance.now();
  let displayRoot = null;
  const backgroundImageCache = new Map();

  const splashEl = () => document.getElementById("display-splash");
  const messageEl = () => document.getElementById("display-splash-message");
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clearTimers() {
    for (const timer of [pollTimer, failTimer, leaveTimer, slowHintTimer]) {
      clearTimeout(timer);
    }
  }

  function setDocument(documentPayload) {
    const background = documentPayload?.canvas?.background;
    const color =
      background?.type === "color" ? String(background.color || "") : "";
    let theme = "";
    const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
    const rgb = color.match(
      /^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)(?:\s*[,/]\s*1(?:\.0*)?)?\s*\)$/i,
    );
    let channels;
    if (hex) {
      const raw =
        hex[1].length === 3
          ? [...hex[1]].map((ch) => ch + ch).join("")
          : hex[1];
      channels = [0, 2, 4].map((offset) =>
        parseInt(raw.slice(offset, offset + 2), 16),
      );
    } else if (rgb) {
      channels = rgb.slice(1, 4).map(Number);
    }
    if (channels) {
      const luminance = channels.reduce(
        (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
        0,
      );
      theme = luminance >= 150 ? "light" : "dark";
    } else {
      const themeName = String(documentPayload?.theme?.name || "").toLowerCase();
      if (/(^|[-_])light($|[-_])/.test(themeName)) {
        theme = "light";
      } else if (/(^|[-_])dark($|[-_])/.test(themeName)) {
        theme = "dark";
      }
    }
    if (theme) {
      root.dataset.displayTheme = theme;
    } else {
      delete root.dataset.displayTheme;
    }
    try {
      if (theme) {
        localStorage.setItem(themeStorageKey, theme);
      } else {
        localStorage.removeItem(themeStorageKey);
      }
    } catch {
      /* ignore */
    }
  }

  function fail(error, allowEnter = false) {
    if (phase === "done" || phase === "error") {
      return;
    }
    clearTimers();
    phase = "error";
    splashEl()?.classList.remove("is-complete", "is-leaving");
    splashEl()?.classList.add("is-error");
    if (messageEl()) {
      messageEl().textContent =
        error?.message || "仪表盘加载失败，请检查网络后重试。";
    }
    const actions = document.getElementById("display-splash-actions");
    if (actions) {
      actions.hidden = false;
    }
    const enter = document.getElementById("display-splash-enter");
    if (enter) {
      enter.hidden = !allowEnter;
    }
  }

  function finish() {
    if (phase === "done" || phase === "leaving") {
      return;
    }
    clearTimers();
    phase = "leaving";
    splashEl()?.classList.remove("is-error");
    splashEl()?.classList.add("is-complete");
    const actions = document.getElementById("display-splash-actions");
    if (actions) {
      actions.hidden = true;
    }
    if (messageEl()) {
      messageEl().textContent = "准备就绪";
    }
    leaveTimer = setTimeout(() => {
      splashEl()?.classList.add("is-leaving");
      leaveTimer = setTimeout(() => {
        const splashHadFocus = splashEl()?.contains(document.activeElement);
        splashEl()?.remove();
        root.classList.remove("display-booting");
        phase = "done";
        backgroundImageCache.clear();
        if (splashHadFocus) {
          displayRoot?.focus({ preventScroll: true });
        }
      }, prefersReducedMotion() ? 100 : 550);
    }, prefersReducedMotion() ? 0 : 250);
  }

  function isVisuallyRelevant(element) {
    if (!element.isConnected || element.closest("[hidden]")) {
      return false;
    }
    const box = element.getBoundingClientRect();
    if (
      box.width <= 0 ||
      box.height <= 0 ||
      box.bottom <= 0 ||
      box.right <= 0 ||
      box.top >= innerHeight ||
      box.left >= innerWidth
    ) {
      return false;
    }
    for (
      let node = element;
      node && node !== displayRoot;
      node = node.parentElement
    ) {
      const style = getComputedStyle(node);
      if (
        style.visibility === "hidden" ||
        style.display === "none" ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
    }
    return true;
  }

  function hasPendingAssets() {
    const skipSelector = ".hb-camera-component, .hb-vacuum-map";
    for (const image of displayRoot.querySelectorAll("img[src]")) {
      if (!image.closest(skipSelector) && isVisuallyRelevant(image) && !image.complete) {
        return true;
      }
    }
    for (const host of displayRoot.querySelectorAll(".hb-interaction3d-host")) {
      if (
        !isVisuallyRelevant(host) ||
        host.dataset.access === "locked" ||
        host.querySelector(".is-load-error")
      ) {
        continue;
      }
      const runtime = host.querySelector(".hb-interaction3d-runtime");
      if (!runtime || runtime.classList.contains("is-loading")) {
        return true;
      }
    }
    let pendingBackground = false;
    for (const node of displayRoot.querySelectorAll('[style*="background"]')) {
      if (node.closest(skipSelector) || !isVisuallyRelevant(node)) {
        continue;
      }
      for (const match of node.style.backgroundImage.matchAll(
        /url\(["']?([^"')]+)["']?\)/g,
      )) {
        const url = match[1];
        if (!backgroundImageCache.has(url)) {
          const image = new Image();
          image.src = url;
          backgroundImageCache.set(url, image);
        }
        if (!backgroundImageCache.get(url).complete) {
          pendingBackground = true;
        }
      }
    }
    return pendingBackground;
  }

  function ready(rootElement) {
    if (phase !== "loading") {
      return;
    }
    displayRoot = rootElement;
    phase = "waiting";
    clearTimeout(failTimer);
    failTimer = setTimeout(
      () =>
        fail(
          new Error("首屏素材加载较慢，可以重试，或先进入仪表盘。"),
          true,
        ),
      30000,
    );
    let settledSince = 0;
    const poll = () => {
      if (phase !== "waiting") {
        return;
      }
      const now = performance.now();
      if (hasPendingAssets()) {
        settledSince = 0;
      } else if (!settledSince) {
        settledSince = now;
      }
      const minBootMs = prefersReducedMotion() ? 0 : 1350;
      if (settledSince && now - settledSince >= 120 && now - bootStartedAt >= minBootMs) {
        requestAnimationFrame(() => {
          if (phase === "waiting") {
            finish();
          }
        });
        return;
      }
      pollTimer = setTimeout(poll, 80);
    };
    poll();
  }

  window.HABridgeDisplayBoot = {
    setDocument,
    ready,
    fail,
    get pending() {
      return phase !== "done";
    },
    get failed() {
      return phase === "error";
    },
  };

  if (!isCapturePreview) {
    root.classList.add("display-booting");
    document.addEventListener("click", (event) => {
      if (event.target.closest("#display-splash-retry")) {
        location.reload();
      }
      if (event.target.closest("#display-splash-enter")) {
        finish();
      }
    });
    slowHintTimer = setTimeout(() => {
      if ((phase === "loading" || phase === "waiting") && messageEl()) {
        messageEl().textContent = "正在准备你的家，请稍候…";
      }
    }, 8000);
    failTimer = setTimeout(
      () => fail(new Error("仪表盘加载超时，请检查网络后重试。")),
      45000,
    );
    document.addEventListener("focusin", (event) => {
      if (
        phase !== "done" &&
        document.getElementById("display-shell")?.contains(event.target)
      ) {
        splashEl()?.focus({ preventScroll: true });
      }
    });
  }
})();
