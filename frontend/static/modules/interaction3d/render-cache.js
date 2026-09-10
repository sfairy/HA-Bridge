export const RENDER_CACHE_VERSION = "i3d-light-delta-20260907-v5";
export function stableCacheJSON(value) {
  return JSON.stringify(value, (key, nested) => nested && typeof nested == "object" && !Array.isArray(nested) ? Object.fromEntries(Object.keys(nested).sort().map(sortedKey => [sortedKey, nested[sortedKey]])) : nested);
}
export function sha256(input) {
  const encoded = new TextEncoder().encode(input);
  const byteLength = encoded.length;
  const padded = new Uint8Array(Math.ceil((byteLength + 9) / 64) * 64);
  padded.set(encoded);
  padded[byteLength] = 128;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(byteLength / 536870912));
  view.setUint32(padded.length - 4, byteLength * 8);
  const primes = [];
  const roundConstants = [];
  const hashState = [];
  for (let candidate = 2; primes.length < 64; candidate++) {
    if (!primes.some(prime => candidate % prime === 0)) {
      primes.push(candidate);
      roundConstants.push(Math.cbrt(candidate) % 1 * 4294967296 >>> 0);
      if (hashState.length < 8) {
        hashState.push(Math.sqrt(candidate) % 1 * 4294967296 >>> 0);
      }
    }
  }
  const rotateRight = (value, bits) => value >>> bits | value << 32 - bits;
  const schedule = new Uint32Array(64);
  const workingHash = hashState;
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let wordIndex = 0; wordIndex < 16; wordIndex++) {
      schedule[wordIndex] = view.getUint32(offset + wordIndex * 4);
    }
    for (let wordIndex = 16; wordIndex < 64; wordIndex++) {
      const s0Word = schedule[wordIndex - 15];
      const s1Word = schedule[wordIndex - 2];
      schedule[wordIndex] = schedule[wordIndex - 16] + (rotateRight(s0Word, 7) ^ rotateRight(s0Word, 18) ^ s0Word >>> 3) + schedule[wordIndex - 7] + (rotateRight(s1Word, 17) ^ rotateRight(s1Word, 19) ^ s1Word >>> 10);
    }
    let [a, b, c, d, e, f, g, h] = workingHash;
    for (let round = 0; round < 64; round++) {
      const temp1 = h + (rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25)) + (e & f ^ ~e & g) + roundConstants[round] + schedule[round] >>> 0;
      const temp2 = (rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22)) + (a & b ^ a & c ^ b & c) >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    [a, b, c, d, e, f, g, h].forEach((lane, laneIndex) => {
      workingHash[laneIndex] = workingHash[laneIndex] + lane >>> 0;
    });
  }
  return workingHash.map(lane => lane.toString(16).padStart(8, "0")).join("");
}
export function lightLayerKey(baseDescriptor, lampEntry) {
  return sha256(stableCacheJSON({
    version: RENDER_CACHE_VERSION,
    base: baseDescriptor,
    lamp: lampEntry.item,
    floor: lampEntry.floor.id
  }));
}
export function cacheSceneDescriptor(floors) {
  const omitKeys = (object, keys) => Object.fromEntries(Object.entries(object || {}).filter(([key]) => !keys.includes(key)));
  return floors.map(floor => ({
    ...floor,
    name: undefined,
    scene: {
      ...floor.scene,
      settings: omitKeys(floor.scene.settings, ["cameraView", "cameraMode", "cameraFocalLength", "cameraTopRotation", "fixedCameraView", "planViewRotation", "livePreviewEnabled", "previewPanelRatio", "detailsPanelWidthRatio"]),
      lightGroups: floor.scene.lightGroups?.map(group => omitKeys(group, ["enabled", "name"])),
      items: floor.scene.items.map(item => ["downlight", "ceilinglight", "striplight"].includes(item.type) ? omitKeys(item, ["lightBrightness", "lightTemperature"]) : item)
    }
  }));
}
export function createRenderCache({
  sceneId,
  projectId,
  fetcher = globalThis.fetch,
  decode = blob => createImageBitmap(blob),
  maxBytes = 33554432,
  timeoutMs = 1800,
  now = Date.now,
  report = () => {},
  makeCanvas = () => document.createElement("canvas"),
  maxDecodedBytes = 33554432,
  maxDecodedFrames = 3
} = {}) {
  const memoryBlobs = new Map();
  const pendingControllers = new Set();
  const uploadQueue = new Map();
  const decodedFrames = new Map();
  const decodeWaiters = new Map();
  let decodedBytes = 0;
  let memoryBytes = 0;
  let pendingBytes = 0;
  let uploadRunning = false;
  let closed = false;
  let backoffUntil = 0;
  const stats = {
    memoryHits: 0,
    serverHits: 0,
    misses: 0,
    generated: 0,
    uploads: 0,
    errors: 0,
    decodedHits: 0
  };
  const emitStats = () => report({
    ...stats,
    memoryBytes,
    pendingBytes,
    decodedBytes,
    decodedFrames: decodedFrames.size
  });
  function releaseDecodedEntry(entry) {
    entry.refs--;
    if (!entry.retained && entry.refs === 0) {
      entry.image.close();
    }
  }
  function evictDecodedKey(key) {
    const entry = decodedFrames.get(key);
    if (entry) {
      decodedFrames.delete(key);
      decodedBytes -= entry.bytes;
      entry.retained = false;
      if (!entry.refs) {
        entry.image.close();
      }
    }
  }
  function retainDecodedFrame(key, image, width, height) {
    evictDecodedKey(key);
    const entry = {
      image,
      width,
      height,
      bytes: width * height * 4,
      refs: 1,
      retained: true
    };
    decodedFrames.set(key, entry);
    decodedBytes += entry.bytes;
    while (decodedBytes > maxDecodedBytes || decodedFrames.size > maxDecodedFrames) {
      evictDecodedKey(decodedFrames.keys().next().value);
    }
    return entry;
  }
  function borrowDecodedEntry(entry) {
    entry.refs++;
    let released = false;
    return {
      image: entry.image,
      width: entry.width,
      height: entry.height,
      close() {
        if (!released) {
          released = true;
          releaseDecodedEntry(entry);
        }
      }
    };
  }
  const cacheUrl = cacheKey => "/api/v1/modules/interaction3d/scenes/" + encodeURIComponent(sceneId) + "/render-cache/" + cacheKey + "?projectId=" + encodeURIComponent(projectId || "");
  function putMemoryBlob(cacheKey, blob) {
    if (memoryBlobs.has(cacheKey)) {
      memoryBytes -= memoryBlobs.get(cacheKey).size;
    }
    memoryBlobs.delete(cacheKey);
    if (blob.size <= maxBytes) {
      memoryBlobs.set(cacheKey, blob);
      memoryBytes += blob.size;
    }
    while (memoryBytes > maxBytes || memoryBlobs.size > 64) {
      const oldestKey = memoryBlobs.keys().next().value;
      memoryBytes -= memoryBlobs.get(oldestKey).size;
      memoryBlobs.delete(oldestKey);
    }
  }
  async function fetchCache(cacheKey, init = {}, isFresh = () => true) {
    if (closed || now() < backoffUntil) {
      return null;
    }
    const controller = new AbortController();
    pendingControllers.add(controller);
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const staleCheckId = init.method ? null : setInterval(() => {
      if (!isFresh()) {
        controller.abort("stale");
      }
    }, 50);
    try {
      const response = await fetcher(cacheUrl(cacheKey), {
        ...init,
        credentials: "same-origin",
        signal: controller.signal
      });
      const softMiss = !init.method && response.status === 404 && !response.headers?.get("content-type")?.includes("application/json");
      if (!response.ok && !softMiss) {
        throw new Error("cache unavailable");
      }
      if (!init.method && (response.status === 204 || softMiss)) {
        return null;
      } else if (init.method) {
        return response;
      } else if (response.ok) {
        return await response.blob();
      } else {
        return null;
      }
    } catch {
      if (!closed && isFresh()) {
        stats.errors++;
        backoffUntil = now() + 15000;
      }
      return null;
    } finally {
      clearTimeout(timeoutId);
      clearInterval(staleCheckId);
      pendingControllers.delete(controller);
    }
  }
  async function drainUploadQueue() {
    if (!uploadRunning && !closed) {
      uploadRunning = true;
      try {
        while (uploadQueue.size && !closed) {
          const [cacheKey, blob] = uploadQueue.entries().next().value;
          uploadQueue.delete(cacheKey);
          pendingBytes -= blob.size;
          if ((await fetchCache(cacheKey, {
            method: "PUT",
            headers: {
              "Content-Type": "image/png"
            },
            body: blob
          }))?.ok) {
            stats.uploads++;
          }
          emitStats();
        }
      } finally {
        uploadRunning = false;
      }
    }
  }
  const buildTiles = (cacheKey, width, height) => {
    const tiles = [];
    for (let y = 0; y < height; y += 1024) {
      for (let x = 0; x < width; x += 1024) {
        tiles.push({
          x,
          y,
          width: Math.min(1024, width - x),
          height: Math.min(1024, height - y),
          key: sha256(cacheKey + ":tile-v1:" + width + ":" + height + ":" + x + ":" + y)
        });
      }
    }
    return tiles;
  };
  const cacheApi = {
    stats,
    get closed() {
      return closed;
    },
    async acquire(cacheKey, width, height, isFresh = () => true) {
      if (closed || !cacheKey || !isFresh()) {
        return null;
      }
      const frameKey = cacheKey + ":" + width + ":" + height;
      const cachedFrame = decodedFrames.get(frameKey);
      if (cachedFrame) {
        decodedFrames.delete(frameKey);
        decodedFrames.set(frameKey, cachedFrame);
        stats.decodedHits++;
        emitStats();
        return borrowDecodedEntry(cachedFrame);
      }
      let waiterGroup = decodeWaiters.get(frameKey);
      if (!waiterGroup) {
        waiterGroup = {
          waiters: new Set(),
          entry: null
        };
        decodeWaiters.set(frameKey, waiterGroup);
      }
      const stillFresh = () => !closed && isFresh();
      waiterGroup.waiters.add(stillFresh);
      waiterGroup.promise ||= cacheApi.read(cacheKey, width, height, () => [...waiterGroup.waiters].some(waiter => waiter())).then(image => image ? closed || ![...waiterGroup.waiters].some(waiter => waiter()) ? (image.close(), null) : (waiterGroup.entry = retainDecodedFrame(frameKey, image, width, height), emitStats(), waiterGroup.entry) : null);
      try {
        const entry = await waiterGroup.promise;
        if (entry && stillFresh()) {
          return borrowDecodedEntry(entry);
        } else {
          return null;
        }
      } finally {
        waiterGroup.waiters.delete(stillFresh);
        if (!waiterGroup.waiters.size) {
          decodeWaiters.delete(frameKey);
          if (waiterGroup.entry) {
            releaseDecodedEntry(waiterGroup.entry);
          }
        }
      }
    },
    async read(cacheKey, width, height, isFresh = () => true) {
      if (closed || !cacheKey || !isFresh()) {
        return null;
      }
      if (width * height > 2097152) {
        const canvas = makeCanvas();
        canvas.width = width;
        canvas.height = height;
        let handedOff = false;
        try {
          const context = canvas.getContext("2d");
          if (!context) {
            return null;
          }
          for (const tile of buildTiles(cacheKey, width, height)) {
            const tileImage = await cacheApi.read(tile.key, tile.width, tile.height, isFresh);
            if (!tileImage) {
              return null;
            }
            try {
              if (closed || !isFresh()) {
                return null;
              }
              context.drawImage(tileImage, tile.x, tile.y);
            } finally {
              tileImage.close();
            }
          }
          canvas.close = () => {
            canvas.width = canvas.height = 0;
          };
          handedOff = true;
          return canvas;
        } finally {
          if (!handedOff) {
            canvas.width = canvas.height = 0;
          }
        }
      }
      let blob = memoryBlobs.get(cacheKey);
      let hitStat = blob ? "memoryHits" : "serverHits";
      blob ||= await fetchCache(cacheKey, {}, isFresh);
      if (closed || !isFresh()) {
        return null;
      }
      if (!blob || blob.size > 10485760 || blob.type !== "image/png") {
        stats.misses++;
        emitStats();
        return null;
      }
      let image;
      try {
        image = await decode(blob);
        if (closed || !isFresh() || image.width !== width || image.height !== height) {
          throw new Error("stale image");
        }
        putMemoryBlob(cacheKey, blob);
        stats[hitStat]++;
        emitStats();
        return image;
      } catch {
        image?.close?.();
        if (memoryBlobs.has(cacheKey)) {
          memoryBytes -= memoryBlobs.get(cacheKey).size;
          memoryBlobs.delete(cacheKey);
        }
        stats.misses++;
        emitStats();
        return null;
      }
    },
    async write(cacheKey, source, isFresh = () => true) {
      if (closed || !cacheKey || !isFresh()) {
        return;
      }
      if (source.width * source.height > 2097152) {
        const tileCanvas = makeCanvas();
        try {
          for (const tile of buildTiles(cacheKey, source.width, source.height)) {
            if (closed || !isFresh()) {
              return;
            }
            tileCanvas.width = tile.width;
            tileCanvas.height = tile.height;
            const context = tileCanvas.getContext("2d");
            if (!context) {
              return;
            }
            context.drawImage(source, tile.x, tile.y, tile.width, tile.height, 0, 0, tile.width, tile.height);
            await cacheApi.write(tile.key, tileCanvas, isFresh);
          }
        } finally {
          tileCanvas.width = tileCanvas.height = 0;
        }
        return;
      }
      let blob;
      try {
        blob = await new Promise(resolve => source.toBlob(resolve, "image/png"));
      } catch {
        stats.errors++;
        emitStats();
        return;
      }
      if (!closed && !!isFresh() && !!blob && !(blob.size > 10485760)) {
        putMemoryBlob(cacheKey, blob);
        stats.generated++;
        if (pendingBytes + blob.size <= 16777216 && uploadQueue.size < 32 && now() >= backoffUntil && !uploadQueue.has(cacheKey)) {
          uploadQueue.set(cacheKey, blob);
          pendingBytes += blob.size;
          drainUploadQueue();
        }
        emitStats();
      }
    },
    close() {
      closed = true;
      for (const controller of pendingControllers) {
        controller.abort();
      }
      for (const frameKey of decodedFrames.keys()) {
        evictDecodedKey(frameKey);
      }
      memoryBlobs.clear();
      uploadQueue.clear();
      memoryBytes = pendingBytes = 0;
      emitStats();
    }
  };
  return cacheApi;
}
