const s = ["请移步商店购买3D交互包", "购买后请重启本项目"];
export function updateInteraction3dCoverMessage(a, c = s) {
  const e = a?.querySelector?.(".interaction3d-cover-message");
  if (e) {
    e.replaceChildren(...c.map(t => {
      const n = document.createElement("span");
      n.textContent = t;
      return n;
    }));
  }
}
export function createInteraction3dCover({
  showTitle: a = true
} = {}) {
  const c = document.createElement("span");
  c.className = "interaction3d-cover";
  const e = document.createElement("img");
  e.src = "/bridge-static/component-thumbnails/interaction3d.png?v=20260905-interaction3d-cover-v2-20260908-curtains-v1";
  e.alt = "";
  e.decoding = "async";
  const t = document.createElement("span");
  t.className = "interaction3d-cover-title";
  const n = document.createElement("span");
  n.className = "interaction3d-cover-lock";
  n.setAttribute("aria-hidden", "true");
  const o = document.createElement("span");
  o.className = "interaction3d-cover-message";
  for (const i of s) {
    const r = document.createElement("span");
    r.textContent = i;
    o.append(r);
  }
  t.append(n, o);
  t.hidden = !a;
  c.append(e, t);
  return c;
}
