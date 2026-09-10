import { randomUuid } from "../../utils/random-id.js?v=20260724-revert-hold-popup-shield-v324";
export function clone(value) {
  return structuredClone(value);
}
export function newId(prefix) {
  return prefix + "-" + randomUuid();
}
export function slugify(value) {
  return String(value || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "page-" + randomUuid().slice(0, 8);
}
export function normalizedHexColor(hexColor) {
  const raw = String(hexColor || "").trim();
  const hex = raw.startsWith("#") ? raw : "#" + raw;
  if (/^#[\da-f]{6}$/i.test(hex)) {
    return hex.toLowerCase();
  } else if (/^#[\da-f]{3}$/i.test(hex)) {
    return ("#" + [...hex.slice(1)].map(digit => digit.repeat(2)).join("")).toLowerCase();
  } else {
    return "";
  }
}
export function hexToRgb(hexColor) {
  const hex = normalizedHexColor(hexColor) || "#000000";
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}
export function rgbToHex(r, g, b) {
  const toHex = channel => Math.round(clampNumber(Number(channel) || 0, 0, 255)).toString(16).padStart(2, "0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
}
export function rgbToHsv({
  r,
  g,
  b
}) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red) {
      hue = (green - blue) / delta % 6 * 60;
    } else if (max === green) {
      hue = ((blue - red) / delta + 2) * 60;
    } else {
      hue = ((red - green) / delta + 4) * 60;
    }
  }
  if (hue < 0) {
    hue += 360;
  }
  return {
    h: hue,
    s: max ? delta / max : 0,
    v: max
  };
}
export function hsvToRgb(h, s, v) {
  const hue = (Number(h) % 360 + 360) % 360;
  const saturation = clampNumber(Number(s), 0, 1);
  const value = clampNumber(Number(v), 0, 1);
  const chroma = value * saturation;
  const hueSector = hue / 60;
  const x = chroma * (1 - Math.abs(hueSector % 2 - 1));
  const rgb = hueSector < 1 ? [chroma, x, 0] : hueSector < 2 ? [x, chroma, 0] : hueSector < 3 ? [0, chroma, x] : hueSector < 4 ? [0, x, chroma] : hueSector < 5 ? [x, 0, chroma] : [chroma, 0, x];
  const match = value - chroma;
  return {
    r: (rgb[0] + match) * 255,
    g: (rgb[1] + match) * 255,
    b: (rgb[2] + match) * 255
  };
}
export function roundField(value) {
  if (Number.isFinite(value)) {
    return String(Math.round(value * 100) / 100);
  } else {
    return "0";
  }
}
export function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
export function normalizedFontWeight(fontWeight, fallback = 0.4) {
  const numeric = Number(fontWeight);
  if (Number.isFinite(numeric)) {
    if (numeric > 1) {
      return clampNumber((numeric - 1) / 899, 0, 1);
    } else {
      return clampNumber(numeric, 0, 1);
    }
  } else {
    return fallback;
  }
}
