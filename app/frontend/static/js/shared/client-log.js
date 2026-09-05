(function (r) {
  "use strict";
  if (r.HABridgeLog || typeof r.fetch != "function") return;
  const S = r.fetch.bind(r),
    _ = "ha-bridge-client-log-v1",
    q = 50,
    N = 12e4,
    I = 900 * 1e3,
    p = new WeakSet(),
    x = new WeakSet(),
    M = new Set([
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
    ]),
    L = /^\/(?:login|setup|pair)(?:\/|$)/.test(r.location.pathname);
  let g = L,
    o = [],
    D = null,
    $ = !1,
    l = 1e3,
    u = 0,
    T = {};
  function m(t) {
    try {
      const e = new URL(String(t || ""), r.location.href);
      if (!["http:", "https:", "ws:", "wss:"].includes(e.protocol))
        return `[${e.protocol.replace(":", "")}]`;
      let n = e.pathname;
      try {
        n = decodeURIComponent(n);
      } catch {}
      return n
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
  function c(t, e = 1e3) {
    return String(t ?? "")
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
      .replace(/(?:https?|wss?|rtsps?):\/\/[^\s<>"']+/gi, (n) => m(n))
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
      .slice(0, e);
  }
  function y(t) {
    const e = {};
    for (const [n, a] of Object.entries(t || {}))
      !M.has(n) ||
        a == null ||
        !["string", "number", "boolean"].includes(typeof a) ||
        (e[n] = ["path", "page"].includes(n)
          ? m(a)
          : typeof a == "number" && Number.isFinite(a)
            ? a
            : c(a, 512));
    return e;
  }
  function Z() {
    return r.location.pathname.startsWith("/3d-studio")
      ? "3D 户型编辑器"
      : /^\/(?:display|habridge)\//.test(r.location.pathname)
        ? "展示设备"
        : L
          ? "登录与配对页面"
          : "仪表盘编辑器";
  }
  function O() {
    const t = Date.now() - I;
    for (
      o = o.filter((e) => e.queuedAt >= t).slice(-q);
      o.length && JSON.stringify(o).length > N;
    )
      o.shift();
  }
  function d() {
    O();
    try {
      o.length
        ? r.sessionStorage.setItem(_, JSON.stringify(o))
        : r.sessionStorage.removeItem(_);
    } catch {}
  }
  function A(t = 100) {
    D ||
      !o.length ||
      (D = r.setTimeout(() => {
        ((D = null), b());
      }, t));
  }
  function h(t, e, n, a = {}, f = "") {
    const i = {
      level: ["info", "success", "warning", "error"].includes(t) ? t : "error",
      source: Z(),
      category: c(e || "界面", 64),
      message: c(n || "未知异常", 1e3),
      details: c(f, 8e3),
      context: y({
        page: r.location.pathname,
        userAgent: r.navigator?.userAgent || "",
        ...T,
        ...a,
      }),
      clientTimestamp: new Date().toISOString(),
    };
    (g && !["warning", "error"].includes(i.level)) ||
      (o.push({ event: i, queuedAt: Date.now() }), d(), A());
  }
  function E(t, e = {}, n = "") {
    if (t && typeof t == "object") {
      if (p.has(t)) return;
      p.add(t);
    }
    h(
      "error",
      "界面",
      n || t?.message || String(t || "未知异常"),
      e,
      t?.stack || "",
    );
  }
  function R(t, e) {
    return (t && typeof t == "object" && x.has(e) && p.add(t), t);
  }
  async function b() {
    if ($ || r.navigator?.onLine === !1) return;
    if (Date.now() < u) {
      A(u - Date.now());
      return;
    }
    if ((O(), !o.length)) {
      d();
      return;
    }
    const t = (e) => {
      const n = o.indexOf(e);
      n >= 0 && o.splice(n, 1);
    };
    $ = !0;
    try {
      for (let e = 0; o.length && e < 5; e += 1) {
        const n = o[0];
        if (g && !["warning", "error"].includes(n.event.level)) {
          t(n);
          continue;
        }
        const a =
            typeof AbortController == "function" ? new AbortController() : null,
          f = r.setTimeout(() => a?.abort(), 8e3);
        let i;
        try {
          i = await S(`/api/v1/logs/${g ? "public-events" : "events"}`, {
            method: "POST",
            cache: "no-store",
            keepalive: !0,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n.event),
            ...(a ? { signal: a.signal } : {}),
          });
        } finally {
          r.clearTimeout(f);
        }
        if (i.ok) {
          (t(n), (l = 1e3));
          continue;
        }
        if (i.status === 401 && !g) {
          ((g = !0), (u = Date.now() + 1e3));
          break;
        }
        if (i.status === 429 || i.status >= 500) {
          const v = Number(i.headers?.get("Retry-After")) * 1e3;
          ((u = Date.now() + Math.min(6e4, Math.max(l, v || 0))),
            (l = Math.min(6e4, l * 2)));
          break;
        }
        t(n);
      }
    } catch {
      ((u = Date.now() + l), (l = Math.min(6e4, l * 2)));
    } finally {
      (($ = !1), d(), A(Math.max(100, u - Date.now())));
    }
  }
  ((r.fetch = async function (e, n = {}) {
    const { hbLogContext: a, ...f } = n || {},
      i = m(typeof e == "string" || e instanceof URL ? e : e?.url);
    if (/^\/api\/v1\/logs(?:\/|$)/.test(i)) return S(e, f);
    const v = Date.now(),
      k = { method: f.method || e?.method || "GET", path: i, ...y(a) };
    try {
      const s = await S(e, f),
        C = Date.now() - v;
      return (
        (!s.ok || C >= 5e3) &&
          (h(
            s.ok ? "warning" : "error",
            "网络请求",
            `${s.ok ? "请求耗时较长" : "请求失败"}：${k.method} ${i}${s.ok ? "" : `（HTTP ${s.status}）`}`,
            {
              ...k,
              status: s.status,
              durationMs: C,
              requestId: s.headers?.get("X-Request-ID") || "",
            },
          ),
          s.ok || x.add(s)),
        s
      );
    } catch (s) {
      throw (
        s?.name !== "AbortError" &&
          (h(
            "error",
            "网络请求",
            `网络连接失败：${k.method} ${i}`,
            { ...k, durationMs: Date.now() - v },
            s?.stack || s?.message || "",
          ),
          s && typeof s == "object" && p.add(s)),
        s
      );
    }
  }),
    (r.HABridgeLog = {
      report: h,
      error: E,
      linkError: R,
      flush: b,
      setContext: (t) => {
        T = y(t);
      },
    }),
    r.addEventListener(
      "error",
      (t) => {
        const e = t.target;
        if (e && e !== r && (e.src || e.href)) {
          h(
            "error",
            "资源加载",
            `资源加载失败：${m(e.src || e.href)}`,
            {
              path: e.src || e.href,
              phase: String(e.tagName || "resource").toLowerCase(),
            },
          );
          return;
        }
        E(
          t.error ||
            new Error(t.message || "页面脚本异常"),
          {
            path: t.filename || r.location.pathname,
            line: t.lineno,
            column: t.colno,
          },
        );
      },
      !0,
    ),
    r.addEventListener("unhandledrejection", (t) => E(t.reason)),
    r.addEventListener("online", () => {
      ((u = 0), b());
    }),
    r.addEventListener("pagehide", () => {
      (d(), b());
    }));
  try {
    const t = JSON.parse(r.sessionStorage.getItem(_) || "[]");
    if (Array.isArray(t))
      for (const e of t.slice(-q)) {
        if (
          !e?.event ||
          !Number.isFinite(e.queuedAt) ||
          Date.now() - e.queuedAt > I
        )
          continue;
        const n = e.event;
        o.push({
          queuedAt: e.queuedAt,
          event: {
            level: ["warning", "error", "info", "success"].includes(n.level)
              ? n.level
              : "error",
            source: c(n.source || Z(), 64),
            category: c(n.category || "界面", 64),
            message: c(n.message || "未知异常", 1e3),
            details: c(n.details, 8e3),
            context: y(n.context),
            clientTimestamp: new Date(e.queuedAt).toISOString(),
          },
        });
      }
  } catch {}
  (d(), A());
})(window);
