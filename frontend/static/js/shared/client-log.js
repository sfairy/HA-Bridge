(function (global) {
  "use strict";

  if (global.HABridgeLog || typeof global.fetch != "function") {
    return;
  }
  const nativeFetch = global.fetch.bind(global);
  const QUEUE_STORAGE_KEY = "ha-bridge-client-log-v1";
  const MAX_QUEUE_EVENTS = 50;
  const MAX_QUEUE_BYTES = 120000;
  const QUEUE_TTL_MS = 900000;
  const reportedErrors = new WeakSet();
  const failedResponses = new WeakSet();
  const ALLOWED_CONTEXT_KEYS = new Set(["page", "projectId", "componentId", "entityId", "service", "requestId", "method", "path", "status", "durationMs", "code", "line", "column", "userAgent", "phase"]);
  const isPublicAuthPage = /^\/(?:login|setup|pair)(?:\/|$)/.test(global.location.pathname);
  let usePublicLogEndpoint = isPublicAuthPage;
  let eventQueue = [];
  let flushTimer = null;
  let flushInFlight = false;
  let retryDelayMs = 1000;
  let retryAfterMs = 0;
  let sharedContext = {};
  function sanitizePath(rawPath) {
    try {
      const e = new URL(String(rawPath || ""), global.location.href);
      if (!["http:", "https:", "ws:", "wss:"].includes(e.protocol)) {
        return `[${e.protocol.replace(":", "")}]`;
      }
      let n = e.pathname;
      try {
        n = decodeURIComponent(n);
      } catch {}
      return n.split(/[?#]/, 1)[0].replace(/(\/api\/hls\/)[^/]+(?:\/.*)?/gi, "$1[stream]").replace(/[A-Z0-9.!#$%&'*+=^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi, "[email redacted]").replace(/\b(?:eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g, "[redacted]").slice(0, 512);
    } catch {
      return "[invalid path]";
    }
  }
  function redactText(text, maxLength = 1000) {
    return String(text ?? "").replace(/(\b(?:set-cookie|cookie)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\r\n]+)/gi, "$1[redacted]").replace(/-----BEGIN[\s\S]*?PRIVATE KEY-----[\s\S]*?-----END[\s\S]*?PRIVATE KEY-----/g, "[private key redacted]").replace(/[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi, "[email redacted]").replace(/(?:https?|wss?|rtsps?):\/\/[^\s<>"']+/gi, event => sanitizePath(event)).replace(/\bBearer\s+[^\s,;"']+/gi, "Bearer [redacted]").replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted]").replace(/((?:password|passwd|token|authorization|cookie|secret|api[_-]?key|access[_-]?token|refresh[_-]?token|pairing[_-]?code|activation[_-]?code|recovery[_-]?token|session[_-]?token|private[_-]?key|密码|激活码)\s*["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi, "$1[redacted]").replace(/\/api\/hls\/[^\s<>"'?#)]+(?:\?[^\s<>"')]+)?/gi, "/api/hls/[stream]").replace(/(\/[^\s?"'<>]*)\?[^\s"'<>]*/g, "$1").slice(0, maxLength);
  }
  function sanitizeContext(context) {
    const e = {};
    for (const [n, a] of Object.entries(context || {})) {
      if (!!ALLOWED_CONTEXT_KEYS.has(n) && a != null && !!["string", "number", "boolean"].includes(typeof a)) {
        e[n] = ["path", "page"].includes(n) ? sanitizePath(a) : typeof a == "number" && Number.isFinite(a) ? a : redactText(a, 512);
      }
    }
    return e;
  }
  function resolveLogSource() {
    if (global.location.pathname.startsWith("/3d-studio")) {
      return "3D 户型编辑器";
    } else if (/^\/(?:display|habridge)\//.test(global.location.pathname)) {
      return "展示设备";
    } else if (isPublicAuthPage) {
      return "登录与配对页面";
    } else {
      return "仪表盘编辑器";
    }
  }
  function trimQueue() {
    const t = Date.now() - QUEUE_TTL_MS;
    for (eventQueue = eventQueue.filter(target => target.queuedAt >= t).slice(-MAX_QUEUE_EVENTS); eventQueue.length && JSON.stringify(eventQueue).length > MAX_QUEUE_BYTES;) {
      eventQueue.shift();
    }
  }
  function persistQueue() {
    trimQueue();
    try {
      if (eventQueue.length) {
        global.sessionStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(eventQueue));
      } else {
        global.sessionStorage.removeItem(QUEUE_STORAGE_KEY);
      }
    } catch {}
  }
  function scheduleFlush(t = 100) {
    if (!flushTimer && !!eventQueue.length) {
      flushTimer = global.setTimeout(() => {
        flushTimer = null;
        flushQueue();
      }, t);
    }
  }
  function report(level, category, message, context = {}, details = "") {
    const event = {
      level: ["info", "success", "warning", "error"].includes(level) ? level : "error",
      source: resolveLogSource(),
      category: redactText(category || "界面", 64),
      message: redactText(message || "未知异常", 1000),
      details: redactText(details, 8000),
      context: sanitizeContext({
        page: global.location.pathname,
        userAgent: global.navigator?.userAgent || "",
        ...sharedContext,
        ...context
      }),
      clientTimestamp: new Date().toISOString()
    };
    if (!usePublicLogEndpoint || !!["warning", "error"].includes(event.level)) {
      eventQueue.push({
        event: event,
        queuedAt: Date.now()
      });
      persistQueue();
      scheduleFlush();
    }
  }
  function reportError(error, context = {}, fallbackMessage = "") {
    if (error && typeof error == "object") {
      if (reportedErrors.has(error)) {
        return;
      }
      reportedErrors.add(error);
    }
    report("error", "界面", fallbackMessage || error?.message || String(error || "未知异常"), context, error?.stack || "");
  }
  function linkError(error, response) {
    if (error && typeof error == "object" && failedResponses.has(response)) {
      reportedErrors.add(error);
    }
    return error;
  }
  async function flushQueue() {
    if (flushInFlight || global.navigator?.onLine === false) {
      return;
    }
    if (Date.now() < retryAfterMs) {
      scheduleFlush(retryAfterMs - Date.now());
      return;
    }
    trimQueue();
    if (!eventQueue.length) {
      persistQueue();
      return;
    }
    const t = entry => {
      const n = eventQueue.indexOf(entry);
      if (n >= 0) {
        eventQueue.splice(n, 1);
      }
    };
    flushInFlight = true;
    try {
      for (let e = 0; eventQueue.length && e < 5; e += 1) {
        const n = eventQueue[0];
        if (usePublicLogEndpoint && !["warning", "error"].includes(n.event.level)) {
          t(n);
          continue;
        }
        const controller = typeof AbortController == "function" ? new AbortController() : null;
        const fetchInit = global.setTimeout(() => controller?.abort(), 8000);
        let response;
        try {
          response = await nativeFetch(`/api/v1/logs/${usePublicLogEndpoint ? "public-events" : "events"}`, {
            method: "POST",
            cache: "no-store",
            keepalive: true,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(n.event),
            ...(controller ? {
              signal: controller.signal
            } : {})
          });
        } finally {
          global.clearTimeout(fetchInit);
        }
        if (response.ok) {
          t(n);
          retryDelayMs = 1000;
          continue;
        }
        if (response.status === 401 && !usePublicLogEndpoint) {
          usePublicLogEndpoint = true;
          retryAfterMs = Date.now() + 1000;
          break;
        }
        if (response.status === 429 || response.status >= 500) {
          const startedAt = Number(response.headers?.get("Retry-After")) * 1000;
          retryAfterMs = Date.now() + Math.min(60000, Math.max(retryDelayMs, startedAt || 0));
          retryDelayMs = Math.min(60000, retryDelayMs * 2);
          break;
        }
        t(n);
      }
    } catch {
      retryAfterMs = Date.now() + retryDelayMs;
      retryDelayMs = Math.min(60000, retryDelayMs * 2);
    } finally {
      flushInFlight = false;
      persistQueue();
      scheduleFlush(Math.max(100, retryAfterMs - Date.now()));
    }
  }
  global.fetch = async function (input, n = {}) {
    const {
      hbLogContext: a,
      ...f
    } = n || {};
    const i = sanitizePath(typeof input == "string" || input instanceof URL ? input : input?.url);
    if (/^\/api\/v1\/logs(?:\/|$)/.test(i)) {
      return nativeFetch(input, f);
    }
    const v = Date.now();
    const requestContext = {
      method: f.method || input?.method || "GET",
      path: i,
      ...sanitizeContext(a)
    };
    try {
      const response = await nativeFetch(input, f);
      const durationMs = Date.now() - v;
      if (!response.ok || durationMs >= 5000) {
        report(response.ok ? "warning" : "error", "网络请求", `${response.ok ? "请求耗时较长" : "请求失败"}：${requestContext.method} ${i}${response.ok ? "" : `（HTTP ${response.status}）`}`, {
          ...requestContext,
          status: response.status,
          durationMs,
          requestId: response.headers?.get("X-Request-ID") || ""
        });
        if (!response.ok) {
          failedResponses.add(response);
        }
      }
      return response;
    } catch (s) {
      const effectiveSignal = f.signal === undefined ? input?.signal : f.signal;
      if (s?.name !== "AbortError" && !(effectiveSignal?.aborted && s === effectiveSignal.reason)) {
        report("error", "网络请求", `网络连接失败：${requestContext.method} ${i}`, {
          ...requestContext,
          durationMs: Date.now() - v
        }, s?.stack || s?.message || "");
        if (s && typeof s == "object") {
          reportedErrors.add(s);
        }
      }
      throw s;
    }
  };
  global.HABridgeLog = {
    report,
    error: reportError,
    linkError,
    flush: flushQueue,
    setContext: error => {
      sharedContext = sanitizeContext(error);
    }
  };
  global.addEventListener("error", event => {
    const e = event.target;
    if (e && e !== global && (e.src || e.href)) {
      report("error", "资源加载", `资源加载失败：${sanitizePath(e.src || e.href)}`, {
        path: e.src || e.href,
        phase: String(e.tagName || "resource").toLowerCase()
      });
      return;
    }
    reportError(event.error || new Error(event.message || "页面脚本异常"), {
      path: event.filename || global.location.pathname,
      line: event.lineno,
      column: event.colno
    });
  }, true);
  global.addEventListener("unhandledrejection", event => reportError(event.reason));
  global.addEventListener("online", () => {
    retryAfterMs = 0;
    flushQueue();
  });
  global.addEventListener("pagehide", () => {
    persistQueue();
    flushQueue();
  });
  try {
    const t = JSON.parse(global.sessionStorage.getItem(QUEUE_STORAGE_KEY) || "[]");
    if (Array.isArray(t)) {
      for (const e of t.slice(-MAX_QUEUE_EVENTS)) {
        if (!e?.event || !Number.isFinite(e.queuedAt) || Date.now() - e.queuedAt > QUEUE_TTL_MS) {
          continue;
        }
        const n = e.event;
        eventQueue.push({
          queuedAt: e.queuedAt,
          event: {
            level: ["warning", "error", "info", "success"].includes(n.level) ? n.level : "error",
            source: redactText(n.source || resolveLogSource(), 64),
            category: redactText(n.category || "界面", 64),
            message: redactText(n.message || "未知异常", 1000),
            details: redactText(n.details, 8000),
            context: sanitizeContext(n.context),
            clientTimestamp: new Date(e.queuedAt).toISOString()
          }
        });
      }
    }
  } catch {}
  persistQueue();
  scheduleFlush();
})(window);
