const p = new TextEncoder();
export const EXPORT_RENDER_SCALE = 1;
export const EXPORT_IMAGE_MIME_TYPE = "image/webp";
export const EXPORT_IMAGE_EXTENSION = "webp";
export const EXPORT_IMAGE_QUALITY = 0.95;
export function scaledExportResolution(
  value,
  value2,
  value3 = EXPORT_RENDER_SCALE,
) {
  const value4 =
    Number.isFinite(value3) && value3 > 0 ? value3 : EXPORT_RENDER_SCALE;
  return {
    width: Math.max(1, Math.round(Number(value) * value4)),
    height: Math.max(1, Math.round(Number(value2) * value4)),
  };
}
function E(value) {
  let value2 = 4294967295;
  for (const value3 of value) {
    value2 ^= value3;
    for (let value4 = 0; value4 < 8; value4 += 1) {
      value2 = (value2 >>> 1) ^ (-(value2 & 1) & -306674912);
    }
  }
  return (value2 ^ -1) >>> 0;
}
function fn(value, value2, value3) {
  value.setUint16(value2, value3, true);
}
function fn2(value, value2, value3) {
  value.setUint32(value2, value3 >>> 0, true);
}
function M(value) {
  const value2 = value.reduce((value5, value6) => value5 + value6.length, 0);
  const value3 = new Uint8Array(value2);
  let value4 = 0;
  for (const value5 of value) {
    value3.set(value5, value4);
    value4 += value5.length;
  }
  return value3;
}
export function buildStoredZip(value) {
  const value2 = [];
  const value3 = [];
  let value4 = 0;
  for (const value8 of value) {
    const value9 = p.encode(String(value8.name));
    const value10 =
      value8.data instanceof Uint8Array
        ? value8.data
        : new Uint8Array(value8.data);
    const value11 = E(value10);
    const value12 = new Uint8Array(30 + value9.length);
    const value13 = new DataView(value12.buffer);
    fn2(value13, 0, 67324752);
    fn(value13, 4, 20);
    fn(value13, 6, 2048);
    fn(value13, 8, 0);
    fn(value13, 10, 0);
    fn(value13, 12, 0);
    fn2(value13, 14, value11);
    fn2(value13, 18, value10.length);
    fn2(value13, 22, value10.length);
    fn(value13, 26, value9.length);
    fn(value13, 28, 0);
    value12.set(value9, 30);
    value2.push(value12, value10);
    const value14 = new Uint8Array(46 + value9.length);
    const value15 = new DataView(value14.buffer);
    fn2(value15, 0, 33639248);
    fn(value15, 4, 20);
    fn(value15, 6, 20);
    fn(value15, 8, 2048);
    fn(value15, 10, 0);
    fn(value15, 12, 0);
    fn(value15, 14, 0);
    fn2(value15, 16, value11);
    fn2(value15, 20, value10.length);
    fn2(value15, 24, value10.length);
    fn(value15, 28, value9.length);
    fn(value15, 30, 0);
    fn(value15, 32, 0);
    fn(value15, 34, 0);
    fn(value15, 36, 0);
    fn2(value15, 38, 0);
    fn2(value15, 42, value4);
    value14.set(value9, 46);
    value3.push(value14);
    value4 += value12.length + value10.length;
  }
  const value5 = M(value3);
  const value6 = new Uint8Array(22);
  const value7 = new DataView(value6.buffer);
  fn2(value7, 0, 101010256);
  fn(value7, 4, 0);
  fn(value7, 6, 0);
  fn(value7, 8, value.length);
  fn(value7, 10, value.length);
  fn2(value7, 12, value5.length);
  fn2(value7, 16, value4);
  fn(value7, 20, 0);
  return M([...value2, value5, value6]);
}
export function buildLightDeltaPixels(value, value2) {
  if (value.length !== value2.length) {
    throw new Error("Light layer frames must have matching dimensions.");
  }
  const value3 = new Uint8ClampedArray(value.length);
  for (let value4 = 0; value4 < value.length; value4 += 4) {
    const value5 = value[value4 + 3] / 255;
    const value6 = value2[value4 + 3] / 255;
    if (value5 < 0.999) {
      if (value6 <= 1 / 255) {
        continue;
      }
      value3[value4] = value2[value4];
      value3[value4 + 1] = value2[value4 + 1];
      value3[value4 + 2] = value2[value4 + 2];
      value3[value4 + 3] = value2[value4 + 3];
      continue;
    }
    let value7 = 0;
    const value8 =
      value[value4] * 0.2126 +
      value[value4 + 1] * 0.7152 +
      value[value4 + 2] * 0.0722;
    if (
      !(
        value2[value4] * 0.2126 +
          value2[value4 + 1] * 0.7152 +
          value2[value4 + 2] * 0.0722 -
          value8 <=
        1.5
      ) ||
      !(Math.abs(value6 - value5) <= 1 / 255)
    ) {
      for (let value9 = 0; value9 < 3; value9 += 1) {
        const value10 = value[value4 + value9];
        const value11 = value2[value4 + value9] - value10;
        const value12 =
          value11 >= 0
            ? value11 / Math.max(255 - value10, 1)
            : -value11 / Math.max(value10, 1);
        value7 = Math.max(value7, value12);
      }
      value7 = Math.min(Math.max(value7, Math.abs(value6 - value5)), 1);
      if (!(value7 < 1 / 255)) {
        for (let value9 = 0; value9 < 3; value9 += 1) {
          const value10 = value[value4 + value9];
          const value11 = value2[value4 + value9];
          value3[value4 + value9] = Math.round(
            Math.min(
              Math.max((value11 - value10 * (1 - value7)) / value7, 0),
              255,
            ),
          );
        }
        value3[value4 + 3] = Math.round(value7 * 255);
      }
    }
  }
  return value3;
}
