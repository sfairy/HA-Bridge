const textEncoder = new TextEncoder();
export const EXPORT_RENDER_SCALE = 1;
export const EXPORT_IMAGE_MIME_TYPE = "image/webp";
export const EXPORT_IMAGE_EXTENSION = "webp";
export const EXPORT_IMAGE_QUALITY = 0.95;
export function scaledExportResolution(width, height, scale = EXPORT_RENDER_SCALE) {
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : EXPORT_RENDER_SCALE;
  return {
    width: Math.max(1, Math.round(Number(width) * safeScale)),
    height: Math.max(1, Math.round(Number(height) * safeScale))
  };
}
function crc32(bytes) {
  let crc = 4294967295;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc >>> 1 ^ -(crc & 1) & -306674912;
    }
  }
  return (crc ^ -1) >>> 0;
}
function writeUint16(view, offset, value) {
  view.setUint16(offset, value, true);
}
function writeUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}
function concatBytes(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
export function buildStoredZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  for (const entry of entries) {
    const nameBytes = textEncoder.encode(String(entry.name));
    const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
    const checksum = crc32(data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    writeUint32(localView, 0, 67324752);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 2048);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, 0);
    writeUint16(localView, 12, 0);
    writeUint32(localView, 14, checksum);
    writeUint32(localView, 18, data.length);
    writeUint32(localView, 22, data.length);
    writeUint16(localView, 26, nameBytes.length);
    writeUint16(localView, 28, 0);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, data);
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32(centralView, 0, 33639248);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 2048);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, 0);
    writeUint16(centralView, 14, 0);
    writeUint32(centralView, 16, checksum);
    writeUint32(centralView, 20, data.length);
    writeUint32(centralView, 24, data.length);
    writeUint16(centralView, 28, nameBytes.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);
    offset += localHeader.length + data.length;
  }
  const centralDirectory = concatBytes(centralParts);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  writeUint32(endView, 0, 101010256);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralDirectory.length);
  writeUint32(endView, 16, offset);
  writeUint16(endView, 20, 0);
  return concatBytes([...localParts, centralDirectory, endRecord]);
}
export function buildLightDeltaPixels(basePixels, litPixels) {
  if (basePixels.length !== litPixels.length) {
    throw new Error("Light layer frames must have matching dimensions.");
  }
  const delta = new Uint8ClampedArray(basePixels.length);
  for (let index = 0; index < basePixels.length; index += 4) {
    const baseAlpha = basePixels[index + 3] / 255;
    const litAlpha = litPixels[index + 3] / 255;
    if (baseAlpha < 0.999) {
      if (litAlpha <= 1 / 255) {
        continue;
      }
      delta[index] = litPixels[index];
      delta[index + 1] = litPixels[index + 1];
      delta[index + 2] = litPixels[index + 2];
      delta[index + 3] = litPixels[index + 3];
      continue;
    }
    let blend = 0;
    const baseLuma = basePixels[index] * 0.2126 + basePixels[index + 1] * 0.7152 + basePixels[index + 2] * 0.0722;
    if (!(litPixels[index] * 0.2126 + litPixels[index + 1] * 0.7152 + litPixels[index + 2] * 0.0722 - baseLuma <= 1.5) || !(Math.abs(litAlpha - baseAlpha) <= 1 / 255)) {
      for (let channel = 0; channel < 3; channel += 1) {
        const baseValue = basePixels[index + channel];
        const channelDelta = litPixels[index + channel] - baseValue;
        const channelBlend = channelDelta >= 0 ? channelDelta / Math.max(255 - baseValue, 1) : -channelDelta / Math.max(baseValue, 1);
        blend = Math.max(blend, channelBlend);
      }
      blend = Math.min(Math.max(blend, Math.abs(litAlpha - baseAlpha)), 1);
      if (!(blend < 1 / 255)) {
        for (let channel = 0; channel < 3; channel += 1) {
          const baseValue = basePixels[index + channel];
          const litValue = litPixels[index + channel];
          delta[index + channel] = Math.round(Math.min(Math.max((litValue - baseValue * (1 - blend)) / blend, 0), 255));
        }
        delta[index + 3] = Math.round(blend * 255);
      }
    }
  }
  return delta;
}
