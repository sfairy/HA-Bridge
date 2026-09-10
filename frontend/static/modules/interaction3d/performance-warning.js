import { normalizeGroundReflection as b } from "./reflection-settings.js";
export function performanceWarnings(r, e) {
  const n = [];
  if (r.lightingMode === "region" && e.lightingMode === "standard") {
    n.push("标准光影需要计算更多实时光照与阴影。");
  }
  if (e.renderScale > 1 && e.renderScale > (r.renderScale ?? 1)) {
    n.push("高清渲染需要处理更多画面像素。");
  }
  if (e.motionRenderScale >= 0.8 && e.motionRenderScale > (r.motionRenderScale ?? 0)) {
    n.push("较高的转动分辨率会增加旋转和聚焦过渡时的绘制开销。");
  }
  if (e.groundReflection) {
    const f = b(r.groundReflection);
    const t = b(e.groundReflection);
    const s = a => a.strength === 0 || a.mode === "off" ? 0 : a.mode === "all" ? 2 : 1;
    const o = s(f);
    const i = s(t);
    if (i > o) {
      n.push(i === 2 ? "室内和室外同时反射，需要额外绘制两组倒影。" : "地面反射需要额外绘制倒影。");
    }
    if (i && t.resolution > 512 && (t.resolution > f.resolution || !o)) {
      n.push("高反射清晰度会增加倒影的绘制开销和显存占用。");
    }
  }
  return n;
}
export function confirmPerformanceWarning(r, {
  document: e = document,
  signal: n
} = {}) {
  if (r.length) {
    if (n?.aborted) {
      return Promise.resolve(false);
    } else {
      return new Promise(f => {
        const t = e.createElement("dialog");
        t.className = "settings-dialog i3d-performance-dialog";
        t.setAttribute("aria-labelledby", "i3d-performance-title");
        t.setAttribute("aria-describedby", "i3d-performance-description");
        const s = e.createElement("h2");
        s.id = "i3d-performance-title";
        s.textContent = "画质与流畅度提示";
        const o = e.createElement("div");
        o.id = "i3d-performance-description";
        for (const d of r) {
          const g = e.createElement("p");
          g.textContent = d;
          o.append(g);
        }
        const i = e.createElement("p");
        i.className = "i3d-performance-note";
        i.textContent = "手机、iPad 或性能较低的设备可能出现掉帧、发热或耗电增加。如果不够流畅，可以降低画质或关闭反射。";
        o.append(i);
        const a = e.createElement("div");
        a.className = "dialog-actions";
        const c = e.createElement("button");
        const l = e.createElement("button");
        c.type = l.type = "button";
        c.textContent = "取消";
        l.textContent = "继续应用";
        l.className = "primary";
        a.append(c, l);
        t.append(s, o, a);
        let u = false;
        const m = d => {
          if (!u) {
            u = true;
            n?.removeEventListener("abort", p);
            t.close();
            t.remove();
            f(d);
          }
        };
        const p = () => m(false);
        c.addEventListener("click", p);
        l.addEventListener("click", () => m(true));
        t.addEventListener("cancel", d => {
          d.preventDefault();
          m(false);
        });
        t.addEventListener("close", () => m(false));
        n?.addEventListener("abort", p, {
          once: true
        });
        e.body.append(t);
        t.showModal();
        c.focus();
      });
    }
  } else {
    return Promise.resolve(true);
  }
}
