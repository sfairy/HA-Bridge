(function (global) {
  "use strict";
  if (global.HABridgeLog || typeof global.fetch != "function") return;

  const nativeFetch = global.fetch.bind(global);
  const QUEUE_STORAGE_KEY = "ha-bridge-client-log-v1";
  const MAX_QUEUE_EVENTS = 50;
  const MAX_QUEUE_BYTES = 12e4;
  const QUEUE_TTL_MS = 900 * 1e3;
  const reportedErrors = new WeakSet();
  const failedResponses = new WeakSet();
  const ALLOWED_CONTEXT_KEYS = new Set([
    "page",
    "projectId",
    "componentId",
    "entityId",
    "service",
    "requestId",
    "method",
    "path",
    "status",
    "durationMs",
    "code",
    "line",
    "column",
    "userAgent",
    "phase",
  ]);
  const isPublicAuthPage = /^\/(?:login|setup|pair)(?:\/|$)/.test(
    global.location.pathname,
  );

  let usePublicLogEndpoint = isPublicAuthPage;
  let eventQueue = [];
  let flushTimer = null;
  let flushInFlight = false;
  let retryDelayMs = 1e3;
  let retryAfterMs = 0;
  let sharedContext = {};

  function sanitizePath(rawPath) {
    try {
      const url = new URL(String(rawPath || ""), global.location.href);
      if (!["http:", "https:", "ws:", "wss:"].includes(url.protocol)) {
        return `[${url.protocol.replace(":", "")}]`;
      }
      let pathname = url.pathname;
      try {
        pathname = decodeURIComponent(pathname);
      } catch {}
      return pathname
        .split(/[?#]/, 1)[0]
        .replace(/(\/api\/hls\/)[^/]+(?:\/.*)?/gi, "$1[stream]")
        .replace(
          /[A-Z0-9.!#$%&'*+=^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi,
          "[email redacted]",
        )
        .replace(
          /\b(?:eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)\b/g,
          "[redacted]",
        )
        .slice(0, 512);
    } catch {
      return "[invalid path]";
    }
  }

  function redactText(text, maxLength = 1e3) {
    return String(text ?? "")
      .replace(
        /(\b(?:set-cookie|cookie)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\r\n]+)/gi,
        "$1[redacted]",
      )
      .replace(
        /-----BEGIN[\s\S]*?PRIVATE KEY-----[\s\S]*?-----END[\s\S]*?PRIVATE KEY-----/g,
        "[private key redacted]",
      )
      .replace(
        /[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi,
        "[email redacted]",
      )
      .replace(/(?:https?|wss?|rtsps?):\/\/[^\s<>"']+/gi, (url) =>
        sanitizePath(url),
      )
      .replace(/\bBearer\s+[^\s,;"']+/gi, "Bearer [redacted]")
      .replace(
        /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
        "[redacted]",
      )
      .replace(
        /((?:password|passwd|token|authorization|cookie|secret|api[_-]?key|access[_-]?token|refresh[_-]?token|pairing[_-]?code|activation[_-]?code|recovery[_-]?token|session[_-]?token|private[_-]?key|密码|激活码)\s*["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi,
        "$1[redacted]",
      )
      .replace(
        /\/api\/hls\/[^\s<>"'?#)]+(?:\?[^\s<>"')]+)?/gi,
        "/api/hls/[stream]",
      )
      .replace(/(\/[^\s?"'<>]*)\?[^\s"'<>]*/g, "$1")
      .slice(0, maxLength);
  }

  function sanitizeContext(context) {
    const sanitized = {};
    for (const [key, contextValue] of Object.entries(context || {})) {
      if (
        !ALLOWED_CONTEXT_KEYS.has(key) ||
        contextValue == null ||
        !["string", "number", "boolean"].includes(typeof contextValue)
      ) {
        continue;
      }
      sanitized[key] = ["path", "page"].includes(key)
        ? sanitizePath(contextValue)
        : typeof contextValue == "number" && Number.isFinite(contextValue)
          ? contextValue
          : redactText(contextValue, 512);
    }
    return sanitized;
  }

  function resolveLogSource() {
    return global.location.pathname.startsWith("/3d-studio")
      ? "3D 户型编辑器"
      : /^\/(?:display|habridge)\//.test(global.location.pathname)
        ? "展示设备"
        : isPublicAuthPage
          ? "登录与配对页面"
          : "仪表盘编辑器";
  }

  function trimQueue() {
    const oldestAllowed = Date.now() - QUEUE_TTL_MS;
    eventQueue = eventQueue
      .filter((entry) => entry.queuedAt >= oldestAllowed)
      .slice(-MAX_QUEUE_EVENTS);
    while (eventQueue.length && JSON.stringify(eventQueue).length > MAX_QUEUE_BYTES) {
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

  function scheduleFlush(delayMs = 100) {
    if (flushTimer || !eventQueue.length) return;
    flushTimer = global.setTimeout(() => {
      flushTimer = null;
      flushQueue();
    }, delayMs);
  }

  function report(level, category, message, context = {}, details = "") {
    const event = {
      level: ["info", "success", "warning", "error"].includes(level)
        ? level
        : "error",
      source: resolveLogSource(),
      category: redactText(category || "界面", 64),
      message: redactText(message || "未知异常", 1e3),
      details: redactText(details, 8e3),
      context: sanitizeContext({
        page: global.location.pathname,
        userAgent: global.navigator?.userAgent || "",
        ...sharedContext,
        ...context,
      }),
      clientTimestamp: new Date().toISOString(),
    };
    if (usePublicLogEndpoint && !["warning", "error"].includes(event.level)) {
      return;
    }
    eventQueue.push({ event, queuedAt: Date.now() });
    persistQueue();
    scheduleFlush();
  }

  function reportError(error, context = {}, fallbackMessage = "") {
    if (error && typeof error == "object") {
      if (reportedErrors.has(error)) return;
      reportedErrors.add(error);
    }
    report(
      "error",
      "界面",
      fallbackMessage || error?.message || String(error || "未知异常"),
      context,
      error?.stack || "",
    );
  }

  function linkError(error, response) {
    if (error && typeof error == "object" && failedResponses.has(response)) {
      reportedErrors.add(error);
    }
    return error;
  }

  async function flushQueue() {
    if (flushInFlight || global.navigator?.onLine === false) return;
    if (Date.now() < retryAfterMs) {
      scheduleFlush(retryAfterMs - Date.now());
      return;
    }
    trimQueue();
    if (!eventQueue.length) {
      persistQueue();
      return;
    }

    const removeEntry = (entry) => {
      const index = eventQueue.indexOf(entry);
      if (index >= 0) eventQueue.splice(index, 1);
    };

    flushInFlight = true;
    try {
      for (let attempt = 0; eventQueue.length && attempt < 5; attempt += 1) {
        const entry = eventQueue[0];
        if (
          usePublicLogEndpoint &&
          !["warning", "error"].includes(entry.event.level)
        ) {
          removeEntry(entry);
          continue;
        }
        const controller =
          typeof AbortController == "function" ? new AbortController() : null;
        const timeoutId = global.setTimeout(() => controller?.abort(), 8e3);
        let response;
        try {
          response = await nativeFetch(
            `/api/v1/logs/${usePublicLogEndpoint ? "public-events" : "events"}`,
            {
              method: "POST",
              cache: "no-store",
              keepalive: true,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(entry.event),
              ...(controller ? { signal: controller.signal } : {}),
            },
          );
        } finally {
          global.clearTimeout(timeoutId);
        }
        if (response.ok) {
          removeEntry(entry);
          retryDelayMs = 1e3;
          continue;
        }
        if (response.status === 401 && !usePublicLogEndpoint) {
          usePublicLogEndpoint = true;
          retryAfterMs = Date.now() + 1e3;
          break;
        }
        if (response.status === 429 || response.status >= 500) {
          const retryAfterHeader =
            Number(response.headers?.get("Retry-After")) * 1e3;
          retryAfterMs =
            Date.now() + Math.min(6e4, Math.max(retryDelayMs, retryAfterHeader || 0));
          retryDelayMs = Math.min(6e4, retryDelayMs * 2);
          break;
        }
        removeEntry(entry);
      }
    } catch {
      retryAfterMs = Date.now() + retryDelayMs;
      retryDelayMs = Math.min(6e4, retryDelayMs * 2);
    } finally {
      flushInFlight = false;
      persistQueue();
      scheduleFlush(Math.max(100, retryAfterMs - Date.now()));
    }
  }

  global.fetch = async function (input, init = {}) {
    const { hbLogContext, ...fetchInit } = init || {};
    const path = sanitizePath(
      typeof input == "string" || input instanceof URL ? input : input?.url,
    );
    if (/^\/api\/v1\/logs(?:\/|$)/.test(path)) return nativeFetch(input, fetchInit);

    const startedAt = Date.now();
    const requestContext = {
      method: fetchInit.method || input?.method || "GET",
      path,
      ...sanitizeContext(hbLogContext),
    };
    try {
      const response = await nativeFetch(input, fetchInit);
      const durationMs = Date.now() - startedAt;
      if (!response.ok || durationMs >= 5e3) {
        report(
          response.ok ? "warning" : "error",
          "网络请求",
          `${response.ok ? "请求耗时较长" : "请求失败"}：${requestContext.method} ${path}${
            response.ok ? "" : `（HTTP ${response.status}）`
          }`,
          {
            ...requestContext,
            status: response.status,
            durationMs,
            requestId: response.headers?.get("X-Request-ID") || "",
          },
        );
        if (!response.ok) failedResponses.add(response);
      }
      return response;
    } catch (error) {
      if (error?.name !== "AbortError") {
        report(
          "error",
          "网络请求",
          `网络连接失败：${requestContext.method} ${path}`,
          { ...requestContext, durationMs: Date.now() - startedAt },
          error?.stack || error?.message || "",
        );
        if (error && typeof error == "object") reportedErrors.add(error);
      }
      throw error;
    }
  };

  global.HABridgeLog = {
    report,
    error: reportError,
    linkError,
    flush: flushQueue,
    setContext: (context) => {
      sharedContext = sanitizeContext(context);
    },
  };

  global.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (target && target !== global && (target.src || target.href)) {
        report(
          "error",
          "资源加载",
          `资源加载失败：${sanitizePath(target.src || target.href)}`,
          {
            path: target.src || target.href,
            phase: String(target.tagName || "resource").toLowerCase(),
          },
        );
        return;
      }
      reportError(
        event.error || new Error(event.message || "页面脚本异常"),
        {
          path: event.filename || global.location.pathname,
          line: event.lineno,
          column: event.colno,
        },
      );
    },
    true,
  );
  global.addEventListener("unhandledrejection", (event) =>
    reportError(event.reason),
  );
  global.addEventListener("online", () => {
    retryAfterMs = 0;
    flushQueue();
  });
  global.addEventListener("pagehide", () => {
    persistQueue();
    flushQueue();
  });

  try {
    const stored = JSON.parse(
      global.sessionStorage.getItem(QUEUE_STORAGE_KEY) || "[]",
    );
    if (Array.isArray(stored)) {
      for (const entry of stored.slice(-MAX_QUEUE_EVENTS)) {
        if (
          !entry?.event ||
          !Number.isFinite(entry.queuedAt) ||
          Date.now() - entry.queuedAt > QUEUE_TTL_MS
        ) {
          continue;
        }
        const event = entry.event;
        eventQueue.push({
          queuedAt: entry.queuedAt,
          event: {
            level: ["warning", "error", "info", "success"].includes(event.level)
              ? event.level
              : "error",
            source: redactText(event.source || resolveLogSource(), 64),
            category: redactText(event.category || "界面", 64),
            message: redactText(event.message || "未知异常", 1e3),
            details: redactText(event.details, 8e3),
            context: sanitizeContext(event.context),
            clientTimestamp: new Date(entry.queuedAt).toISOString(),
          },
        });
      }
    }
  } catch {}

  persistQueue();
  scheduleFlush();
})(window);
