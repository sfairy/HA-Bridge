export function normalizeGroundReflection(o = {}) {
  o = o && typeof o == "object" ? o : {};
  return {
    mode: ["off", "inside", "outside", "all"].includes(o.mode) ? o.mode : "off",
    resolution: [256, 512, 768].includes(o.resolution) ? o.resolution : 512,
    strength: Number.isFinite(o.strength) ? Math.max(0, Math.min(0.45, o.strength)) : 0.18
  };
}
