import { createAccessMonitor } from "./access-monitor.js?v=20260905-interaction3d-v1-20260905-i3d-polish-v1-20260906-access-state-v2";
import { createInteraction3dCover } from "./cover.js?v=20260905-interaction3d-cover-v1";
import { createInteraction3dFocusLayout } from "./focus-layout.js?v=20260906-i3d-complete-v6";
export async function requestInteraction3dAccess() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch("/api/v1/modules/interaction3d/access", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error(
        response.status === 403
          ? "3D 交互授权不可用，请在授权信息中查看。"
          : response.status === 401
            ? "登录状态已失效，请重新登录。"
            : "暂时无法验证 3D 交互授权，请稍候重试。",
      );
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
let accessMonitor;
const editorViews = new Map();
const viewWaiters = new Map();
function notifyViewWaiters(componentId, error) {
  for (const listener of viewWaiters.get(componentId) || []) {
    listener(error);
  }
}
export function getInteraction3dEditorView(componentId) {
  return editorViews.get(componentId);
}
export function waitInteraction3dEditorView(componentId) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeoutId);
      viewWaiters.get(componentId)?.delete(onNotify);
      if (!viewWaiters.get(componentId)?.size) {
        viewWaiters.delete(componentId);
      }
    };
    const onNotify = (error) => {
      const view = editorViews.get(componentId);
      if (error) {
        cleanup();
        reject(error);
      } else if (view?.ready && view.metadata) {
        cleanup();
        resolve(view);
      }
    };
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("户型准备较慢，请稍候重试。"));
    }, 25000);
    if (!viewWaiters.has(componentId)) {
      viewWaiters.set(componentId, new Set());
    }
    viewWaiters.get(componentId).add(onNotify);
    onNotify();
  });
}
export function cancelOtherInteraction3dViews(keepId) {
  for (const [componentId, view] of editorViews) {
    if (componentId !== keepId && view.viewEditing) {
      view.setViewEditing(false);
    }
  }
}
function getAccessMonitor() {
  return (
    accessMonitor ||
    ((accessMonitor = createAccessMonitor({
      requestGrant: requestInteraction3dAccess,
    })),
    document.addEventListener("visibilitychange", () =>
      document.hidden ? accessMonitor.suspend() : accessMonitor.resume(),
    ),
    window.addEventListener("pagehide", () => accessMonitor.suspend()),
    window.addEventListener("pageshow", () => {
      if (!document.hidden) {
        accessMonitor.resume();
      }
    }),
    document.hidden && accessMonitor.suspend(),
    accessMonitor)
  );
}
export function subscribeInteraction3dAccess(listener) {
  return getAccessMonitor().subscribe(listener);
}
export function renderInteraction3d(component, context = {}) {
  const host = document.createElement("section");
  host.className = "hb-interaction3d-host";
  host.setAttribute("aria-label", "3D 交互");
  let disposed = false;
  let loading = false;
  let mounted = false;
  let loadGeneration = 0;
  let runtimeView;
  let stylesheetLink;
  const focusLayout = createInteraction3dFocusLayout(host, context);
  host.classList.toggle(
    "is-background-hidden",
    component.properties?.backgroundVisible === false,
  );
  host.updateInteraction3d = (nextComponent, documentRef) => {
    component = nextComponent;
    context.document = documentRef;
    host.classList.toggle(
      "is-background-hidden",
      component.properties?.backgroundVisible === false,
    );
    runtimeView?.update(component.properties || {});
    focusLayout.refresh();
  };
  function lockView() {
    focusLayout.setActive(false);
    loadGeneration += 1;
    loading = false;
    mounted = false;
    if (editorViews.get(component.id) === runtimeView) {
      editorViews.delete(component.id);
    }
    if (!disposed) {
      notifyViewWaiters(component.id, new Error("3D 户型暂不可用，请检查授权或重新载入。"));
    }
    runtimeView?.();
    runtimeView = null;
    stylesheetLink?.remove();
    stylesheetLink = null;
    host.replaceChildren(createInteraction3dCover());
    host.dataset.access = "locked";
  }
  const unsubscribeAccess = subscribeInteraction3dAccess(async (grant) => {
    if (disposed) {
      return;
    }
    if (!grant.allowed) {
      if (grant.status === "denied") {
        return lockView(grant.message);
      }
      runtimeView?.setAuthorized(false);
      host.dataset.access = "pending";
      host.setAttribute("aria-busy", "true");
      if (!mounted) {
        loadGeneration += 1;
        loading = false;
        const pending = document.createElement("div");
        pending.className = "i3d-access-pending";
        pending.setAttribute("role", "status");
        pending.setAttribute("aria-label", "正在准备 3D 户型");
        host.replaceChildren(pending);
      }
      return;
    }
    if (mounted) {
      runtimeView?.setAuthorized(true);
      host.dataset.access = "allowed";
      host.setAttribute("aria-busy", "false");
      if (context.editable) {
        notifyViewWaiters(component.id);
      }
      return;
    }
    if (loading) {
      return;
    }
    loading = true;
    const generation = ++loadGeneration;
    try {
      const runtime = await import(
        "/api/v1/modules/interaction3d/runtime.js?v=20260907-layout-v2-20260905-interaction3d-v1-20260905-i3d-lighting-v1-20260906-i3d-preload-v1-20260906-i3d-marker-v1-20260907-coherence-v1"
      );
      if (disposed || generation !== loadGeneration || document.hidden) {
        return;
      }
      stylesheetLink = document.createElement("link");
      stylesheetLink.rel = "stylesheet";
      stylesheetLink.href =
        "/api/v1/modules/interaction3d/runtime.css?v=20260906-i3d-complete-v6";
      host.append(stylesheetLink);
      const mountRoot = document.createElement("div");
      host.replaceChildren(stylesheetLink, mountRoot);
      runtimeView = runtime.mountInteraction3d(mountRoot, {
        component,
        context,
        onPresented: () => {
          if (context.editable) {
            notifyViewWaiters(component.id);
          }
        },
        onLoadError: (error) => {
          if (context.editable) {
            notifyViewWaiters(component.id, error);
          }
        },
        onFocusChange: (focused) => focusLayout.setActive(focused),
      });
      if (context.editable) {
        editorViews.set(component.id, runtimeView);
      }
      host.dataset.access = "allowed";
      host.setAttribute("aria-busy", "false");
      mounted = true;
    } catch {
      if (!disposed && generation === loadGeneration) {
        stylesheetLink?.remove();
        stylesheetLink = null;
        const pending = document.createElement("div");
        pending.className = "i3d-access-pending";
        pending.textContent = "户型暂时无法载入，请稍候重试。";
        pending.setAttribute("role", "status");
        host.replaceChildren(pending);
        host.dataset.access = "pending";
        if (context.editable) {
          notifyViewWaiters(component.id, new Error(pending.textContent));
        }
      }
    } finally {
      if (generation === loadGeneration) {
        loading = false;
      }
    }
  });
  context.cleanup?.(() => {
    disposed = true;
    unsubscribeAccess();
    lockView("3D 交互已停止。");
    focusLayout.dispose();
  });
  return host;
}
