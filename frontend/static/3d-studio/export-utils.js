const textEncoder = new TextEncoder();
export const EXPORT_RENDER_SCALE = 1;
export const EXPORT_IMAGE_MIME_TYPE = "image/webp";
export const EXPORT_IMAGE_EXTENSION = "webp";
export const EXPORT_IMAGE_QUALITY = 0.95;
export function scaledExportResolution(width, height, scale = EXPORT_RENDER_SCALE) {
  const effectiveScale = Number.isFinite(scale) && scale > 0 ? scale : EXPORT_RENDER_SCALE;
  return {
    width: Math.max(1, Math.round(Number(width) * effectiveScale)),
    height: Math.max(1, Math.round(Number(height) * effectiveScale))
  };
}
function crc32(bytes) {
  let checksum = 4294967295;
  for (const byte of bytes) {
    checksum ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      checksum = (checksum >>> 1) ^ (-(checksum & 1) & -306674912);
    }
  }
  return (checksum ^ -1) >>> 0;
}
function writeUint16LE(view, offset, value) {
  view.setUint16(offset, value, true);
}
function writeUint32LE(dataView, byteOffset, int32Value) {
  dataView.setUint32(byteOffset, int32Value >>> 0, true);
}
function concatChunks(chunks) {
  const totalLength = chunks.reduce((chunkTotal, chunk) => chunkTotal + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let writeOffset = 0;
  for (const part of chunks) {
    merged.set(part, writeOffset);
    writeOffset += part.length;
  }
  return merged;
}
export function buildStoredZip(entries) {
  const localParts = [];
  const centralParts = [];
  let centralOffset = 0;
  for (const entry of entries) {
    const nameBytes = textEncoder.encode(String(entry.name));
    const dataBytes = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
    const crc32Value = crc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    writeUint32LE(localView, 0, 67324752);
    writeUint16LE(localView, 4, 20);
    writeUint16LE(localView, 6, 2048);
    writeUint16LE(localView, 8, 0);
    writeUint16LE(localView, 10, 0);
    writeUint16LE(localView, 12, 0);
    writeUint32LE(localView, 14, crc32Value);
    writeUint32LE(localView, 18, dataBytes.length);
    writeUint32LE(localView, 22, dataBytes.length);
    writeUint16LE(localView, 26, nameBytes.length);
    writeUint16LE(localView, 28, 0);
    localHeader.set(nameBytes, 30);
    localParts.push(localHeader, dataBytes);
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32LE(centralView, 0, 33639248);
    writeUint16LE(centralView, 4, 20);
    writeUint16LE(centralView, 6, 20);
    writeUint16LE(centralView, 8, 2048);
    writeUint16LE(centralView, 10, 0);
    writeUint16LE(centralView, 12, 0);
    writeUint16LE(centralView, 14, 0);
    writeUint32LE(centralView, 16, crc32Value);
    writeUint32LE(centralView, 20, dataBytes.length);
    writeUint32LE(centralView, 24, dataBytes.length);
    writeUint16LE(centralView, 28, nameBytes.length);
    writeUint16LE(centralView, 30, 0);
    writeUint16LE(centralView, 32, 0);
    writeUint16LE(centralView, 34, 0);
    writeUint16LE(centralView, 36, 0);
    writeUint32LE(centralView, 38, 0);
    writeUint32LE(centralView, 42, centralOffset);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);
    centralOffset += localHeader.length + dataBytes.length;
  }
  const centralDirectory = concatChunks(centralParts);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  writeUint32LE(endView, 0, 101010256);
  writeUint16LE(endView, 4, 0);
  writeUint16LE(endView, 6, 0);
  writeUint16LE(endView, 8, entries.length);
  writeUint16LE(endView, 10, entries.length);
  writeUint32LE(endView, 12, centralDirectory.length);
  writeUint32LE(endView, 16, centralOffset);
  writeUint16LE(endView, 20, 0);
  return concatChunks([...localParts, centralDirectory, endRecord]);
}
export function buildLightDeltaPixels(basePixels, litPixels) {
  if (basePixels.length !== litPixels.length) {
    throw new Error("Light layer frames must have matching dimensions.");
  }
  const deltaPixels = new Uint8ClampedArray(basePixels.length);
  for (let pixelOffset = 0; pixelOffset < basePixels.length; pixelOffset += 4) {
    const baseAlpha = basePixels[pixelOffset + 3] / 255;
    const litAlpha = litPixels[pixelOffset + 3] / 255;
    if (baseAlpha < 0.999) {
      if (litAlpha <= 1 / 255) {
        continue;
      }
      deltaPixels[pixelOffset] = litPixels[pixelOffset];
      deltaPixels[pixelOffset + 1] = litPixels[pixelOffset + 1];
      deltaPixels[pixelOffset + 2] = litPixels[pixelOffset + 2];
      deltaPixels[pixelOffset + 3] = litPixels[pixelOffset + 3];
      continue;
    }
    let maxDelta = 0;
    const baseLuma =
      basePixels[pixelOffset] * 0.2126 +
      basePixels[pixelOffset + 1] * 0.7152 +
      basePixels[pixelOffset + 2] * 0.0722;
    if (
      !(
        litPixels[pixelOffset] * 0.2126 +
          litPixels[pixelOffset + 1] * 0.7152 +
          litPixels[pixelOffset + 2] * 0.0722 -
          baseLuma <=
        1.5
      ) ||
      !(Math.abs(litAlpha - baseAlpha) <= 1 / 255)
    ) {
      for (let channelIndex = 0; channelIndex < 3; channelIndex += 1) {
        const baseChannel = basePixels[pixelOffset + channelIndex];
        const channelDelta = litPixels[pixelOffset + channelIndex] - baseChannel;
        const normalizedDelta =
          channelDelta >= 0
            ? channelDelta / Math.max(255 - baseChannel, 1)
            : -channelDelta / Math.max(baseChannel, 1);
        maxDelta = Math.max(maxDelta, normalizedDelta);
      }
      maxDelta = Math.min(Math.max(maxDelta, Math.abs(litAlpha - baseAlpha)), 1);
      if (!(maxDelta < 1 / 255)) {
        for (let channelOffset = 0; channelOffset < 3; channelOffset += 1) {
          const baseValue = basePixels[pixelOffset + channelOffset];
          const litValue = litPixels[pixelOffset + channelOffset];
          deltaPixels[pixelOffset + channelOffset] = Math.round(
            Math.min(Math.max((litValue - baseValue * (1 - maxDelta)) / maxDelta, 0), 255)
          );
        }
        deltaPixels[pixelOffset + 3] = Math.round(maxDelta * 255);
      }
    }
  }
  return deltaPixels;
}
