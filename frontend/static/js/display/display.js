import { PanelRenderer } from "../../renderer/renderer.js?v=20260909-curtain-action-v15-20260911-navigation-light-v14-20260911-security-camera-popup-v6-quiet-feedback-v1-stage-retain-v1";
import { ensureUiPackRuntime } from "../ui-packs/loader.js?v=20260811-water-heater-popup-v44-20260824-light-statistics-v4-20260828-count-statistics-v1-20260824-load-optimization-v1-20260902-camera-popup-ready-v1-20260902-floorplan-auto-diagram-v12-20260908-environment-v1-20260908-lighting-mode-v1";
import { createButtonSound } from "../shared/sound-effects.js?v=20260826-button-sound-v2";
const displayRoot = document.querySelector("#display-root");
const displayShell = document.querySelector("#display-shell");
const isCapturePreview = new URLSearchParams(window.location.search).get("capturePreview") === "1";
document.documentElement.classList.toggle("capture-preview", isCapturePreview);
let project = null;
let documentRevision = null;
let globalPopupRevision = null;
let renderer = null;
const buttonSound = createButtonSound();
let refreshPromise = null;
let uiPacks = [];
let p = null;
let entities = [];
let devices = [];
let translations = {};
let catalogSyncPromise = null;
let catalogFingerprint = null;
let translationsReady = false;
let appliedCatalogSignature = null;
let lastAssetCheckAt = 0;
let assetVersion = null;
function isAppleTouchDevice() {
  const userAgent = navigator.userAgent || "";
  return /iPad|iPhone|iPod/i.test(userAgent) || /Macintosh/i.test(userAgent) && Number(navigator.maxTouchPoints || 0) > 1;
}
function syncDisplaySize() {
  const appleTouch = isAppleTouchDevice();
  let width = Math.round(Number(appleTouch ? window.screen?.width : window.visualViewport?.width) || Number(window.innerWidth) || Number(document.documentElement.clientWidth));
  let height = Math.round(Number(appleTouch ? window.screen?.height : window.visualViewport?.height) || Number(window.innerHeight) || Number(document.documentElement.clientHeight));
  if (appleTouch && window.innerWidth >= window.innerHeight !== width >= height) {
    [width, height] = [height, width];
  }
  if (!!width && !!height) {
    displayShell.style.width = width + "px";
    displayShell.style.height = height + "px";
    if (appleTouch) {
      document.documentElement.style.width = width + "px";
      document.documentElement.style.height = height + "px";
      document.body.style.width = width + "px";
      document.body.style.height = height + "px";
    }
  }
}
function pairingUrl() {
  return "/pair?next=" + encodeURIComponent("" + window.location.pathname + window.location.search);
}
async function apiGet(path) {
  const joiner = path.includes("?") ? "&" : "?";
  const response = new AbortController();
  const payload = window.setTimeout(() => response.abort(), 20000);
  try {
    const status = await fetch("/api/v1" + path + joiner + "_=" + Date.now(), {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache"
      },
      signal: response.signal
    });
    const detail = status.status === 204 ? null : await status.json().catch(arg => {
      if (response.signal.aborted) {
        throw arg;
      }
      return {};
    });
    if (status.status === 401) {
      window.location.assign(pairingUrl());
      return null;
    }
    if (status.status === 403 && detail?.detail?.code === "LICENSE_RESTRICTED") {
      window.location.replace("/license");
      return null;
    }
    if (!status.ok) {
      const message = detail?.detail;
      const code = new Error(typeof message == "string" ? message : message?.message || "请求失败。");
      code.code = message?.code || "";
      throw window.HABridgeLog?.linkError(code, status) || code;
    }
    return detail;
  } catch (value) {
    throw response.signal.aborted ? new Error("仪表盘更新请求超时，请检查网络连接。") : value;
  } finally {
    window.clearTimeout(payload);
  }
}
async function ensureDocumentUiPack(document) {
  const packId = document?.uiPack?.id || "ui.base";
  let pack = uiPacks.find(item => item.id === packId);
  if (!pack) {
    const listing = await apiGet("/ui-packs?_=" + Date.now());
    if (!listing) {
      return null;
    }
    uiPacks = listing.items || [];
    pack = uiPacks.find(item => item.id === packId);
  }
  if (!pack?.allowed) {
    const error = new Error("当前授权尚未解锁该 UI 方案。");
    error.code = "UI_PACK_RESTRICTED";
    throw error;
  }
  await ensureUiPackRuntime(pack);
  return pack;
}
async function syncEntityCatalog() {
  return catalogSyncPromise || (catalogSyncPromise = (async () => {
    const status = await apiGet("/ha/sync/status");
    if (!status) {
      return;
    }
    const fingerprint = status.configured ? JSON.stringify([Number.isFinite(Number(status.catalogRevision)) ? Number(status.catalogRevision) : status.lastFullSyncAt || "", Number(status.counts?.entities || 0), Number(status.counts?.devices || 0), Number(status.counts?.areas || 0)]) : "not-configured";
    const catalogChanged = fingerprint !== catalogFingerprint;
    const shouldRefreshTranslations = !!status.configured && !!status.connected && (!translationsReady || !!catalogChanged);
    if (!!catalogChanged || !!shouldRefreshTranslations) {
      if (!status.configured) {
        entities = [];
        devices = [];
        translations = {};
        catalogFingerprint = fingerprint;
        translationsReady = true;
        applyEntityCatalog();
        return;
      }
      if (catalogChanged) {
        const collected = [];
        let offset = 0;
        let total = 0;
        do {
          const page = await apiGet("/ha/entities?limit=500&offset=" + offset);
          if (!page) {
            return;
          }
          collected.push(...(page.items || []));
          total = Number(page.total || 0);
          offset += Number(page.limit || 500);
        } while (collected.length < total);
        entities = collected;
        const deviceListing = await apiGet("/ha/devices").catch(() => null);
        if (deviceListing) {
          devices = deviceListing.items || [];
        }
        catalogFingerprint = fingerprint;
      }
      if (shouldRefreshTranslations) {
        const translationListing = await apiGet("/ha/translations").catch(() => null);
        if (translationListing) {
          translations = translationListing.resources || {};
          translationsReady = true;
        } else {
          translationsReady = false;
        }
      }
      applyEntityCatalog();
    }
  })().finally(() => {
    catalogSyncPromise = null;
  }), catalogSyncPromise);
}
function catalogSignature() {
  const entityRows = entities.map(metadata => [metadata.entityId || "", metadata.domain || "", metadata.name || "", metadata.icon || "", metadata.deviceId || "", metadata.platform || "", metadata.translationKey || "", metadata.uniqueId || "", metadata.originalName || "", metadata.status || "", metadata.disabledBy || ""]);
  const deviceRows = devices.map(device => [device.deviceId || "", device.name || "", device.manufacturer || "", device.model || "", device.status || ""]);
  const translationRows = Object.entries(translations).sort(([left], [right]) => left.localeCompare(right));
  return JSON.stringify([entityRows, deviceRows, translationRows]);
}
function applyEntityCatalog() {
  if (!renderer) {
    return;
  }
  const signature = catalogSignature();
  if (signature !== appliedCatalogSignature) {
    appliedCatalogSignature = signature;
    renderer.setEntityCatalog(entities, translations, devices);
  }
}
async function resolveProject() {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/display/")) {
    return {
      id: decodeURIComponent(pathname.slice(9)),
      name: ""
    };
  }
  if (!pathname.startsWith("/habridge/")) {
    throw new Error("仪表盘地址无效。");
  }
  const projectName = decodeURIComponent(pathname.slice(10)).trim();
  if (!projectName) {
    throw new Error("仪表盘名称不能为空。");
  }
  const listing = await apiGet("/projects");
  if (!listing) {
    return null;
  }
  const matches = (listing.items || []).filter(item => item.name === projectName);
  if (!matches.length) {
    throw new Error("找不到仪表盘“" + projectName + "”。");
  }
  if (matches.length > 1) {
    throw new Error("仪表盘名称“" + projectName + "”重复，请先在编辑器中改名。");
  }
  return matches[0];
}
async function refreshDisplay() {
  if (project) {
    return refreshPromise || (refreshPromise = (async () => {
      syncEntityCatalog().catch(() => null);
      let revision = null;
      let assetsChanged = p !== assetVersion;
      if (renderer) {
        revision = await apiGet("/projects/" + encodeURIComponent(project.id) + "/revision");
        if (!revision) {
          return;
        }
        const now = Date.now();
        if (now - lastAssetCheckAt >= 30000) {
          const versions = await apiGet("/assets/version");
          if (!versions) {
            return;
          }
          const nextAssetVersion = (versions.builtin || "") + ":" + (versions.user || "");
          assetsChanged = p !== nextAssetVersion;
          assetVersion = nextAssetVersion;
          lastAssetCheckAt = now;
        }
        if (!assetsChanged && revision.revision === documentRevision && revision.globalPopupRevision === globalPopupRevision) {
          return;
        }
      }
      const draft = await apiGet("/projects/" + encodeURIComponent(project.id) + "/draft");
      if (!draft) {
        return;
      }
      buttonSound.setEnabled(draft.document?.soundEnabled !== false);
      await ensureDocumentUiPack(draft.document);
      let nextAssetVersion = assetVersion;
      let builtinAssets = null;
      let userAssets = null;
      if (!renderer || assetsChanged || p !== nextAssetVersion) {
        const versions = assetVersion ? null : await apiGet("/assets/version");
        nextAssetVersion = versions ? (versions.builtin || "") + ":" + (versions.user || "") : nextAssetVersion;
        assetVersion = nextAssetVersion;
        lastAssetCheckAt = Date.now();
        [builtinAssets, userAssets] = await Promise.all([apiGet("/assets/builtin"), apiGet("/assets/user")]);
        if (!builtinAssets || !userAssets) {
          return;
        }
      }
      const title = project.name || draft.document?.name || "HA Bridge";
      document.title = title + " · HA Bridge";
      if (!renderer) {
        renderer = new PanelRenderer(displayRoot, {
          scaleMode: "contain",
          onRuntimeButtonPress() {
            buttonSound.play();
          }
        });
        applyEntityCatalog();
      }
      if (builtinAssets && userAssets) {
        renderer.refreshBuiltinAssets([...(builtinAssets.items || []), ...(userAssets.items || [])]);
        p = nextAssetVersion;
      }
      if (documentRevision === draft.revision && globalPopupRevision === draft.globalPopupRevision) {
        return;
      }
      const pagePath = renderer.page?.path || null;
      renderer.setDocument(draft.document, pagePath);
      documentRevision = draft.revision;
      globalPopupRevision = draft.globalPopupRevision;
    })().finally(() => {
      refreshPromise = null;
    }), refreshPromise);
  }
}
async function bootDisplay() {
  syncDisplaySize();
  project = await resolveProject();
  window.HABridgeLog?.setContext({
    projectId: project?.id || ""
  });
  if (project) {
    await refreshDisplay();
  }
}
function refreshIfVisible() {
  if (document.visibilityState === "visible") {
    refreshDisplay().catch(handleDisplayError);
  }
}
function S() {
  if (document.visibilityState === "visible") {
    lastAssetCheckAt = 0;
    refreshIfVisible();
  }
}
function handleDisplayError(code3) {
  window.HABridgeLog?.error(code3, {
    phase: "display-refresh"
  });
  if (code3?.code !== "UI_PACK_RESTRICTED") {
    return;
  }
  renderer?.destroy();
  renderer = null;
  documentRevision = null;
  const className2 = document.createElement("p");
  className2.className = "display-error";
  className2.textContent = code3.message;
  displayRoot.replaceChildren(className2);
}
window.addEventListener("pageshow", S);
document.addEventListener("visibilitychange", S);
window.addEventListener("online", S);
window.addEventListener("resize", syncDisplaySize);
window.visualViewport?.addEventListener("resize", syncDisplaySize);
window.addEventListener("orientationchange", () => window.setTimeout(syncDisplaySize, 100));
window.setInterval(refreshIfVisible, 10000);
bootDisplay().catch(code2 => {
  handleDisplayError(code2);
  if (code2?.code === "UI_PACK_RESTRICTED") {
    return;
  }
  const className = document.createElement("p");
  className.className = "display-error";
  className.textContent = code2.message;
  displayRoot.replaceChildren(className);
});
