export const RENDER_CACHE_VERSION = "i3d-light-delta-20260907-v5";
export function stableCacheJSON(payload) {
  return JSON.stringify(payload, (key, rawValue) =>
    rawValue && typeof rawValue == "object" && !Array.isArray(rawValue)
      ? Object.fromEntries(
          Object.keys(rawValue)
            .sort()
            .map(objectKey => [objectKey, rawValue[objectKey]])
        )
      : rawValue
  );
}
export function sha256(text) {
  const messageBytes = new TextEncoder().encode(text);
  const byteLength = messageBytes.length;
  const paddedBytes = new Uint8Array(Math.ceil((byteLength + 9) / 64) * 64);
  paddedBytes.set(messageBytes);
  paddedBytes[byteLength] = 128;
  const dataView = new DataView(paddedBytes.buffer);
  dataView.setUint32(paddedBytes.length - 8, Math.floor(byteLength / 536870912));
  dataView.setUint32(paddedBytes.length - 4, byteLength * 8);
  const primes = [];
  const cubeRootConstants = [];
  const squareRootConstants = [];
  for (let candidate = 2; primes.length < 64; candidate++) {
    if (!primes.some(prime => candidate % prime === 0)) {
      primes.push(candidate);
      cubeRootConstants.push(((Math.cbrt(candidate) % 1) * 4294967296) >>> 0);
      if (squareRootConstants.length < 8) {
        squareRootConstants.push(((Math.sqrt(candidate) % 1) * 4294967296) >>> 0);
      }
    }
  }
  const rotateRight = (word, shift) => (word >>> shift) | (word << (32 - shift));
  const messageSchedule = new Uint32Array(64);
  const hashState = squareRootConstants;
  for (let chunkOffset = 0; chunkOffset < paddedBytes.length; chunkOffset += 64) {
    for (let scheduleIndex = 0; scheduleIndex < 16; scheduleIndex++) {
      messageSchedule[scheduleIndex] = dataView.getUint32(chunkOffset + scheduleIndex * 4);
    }
    for (let wordIndex = 16; wordIndex < 64; wordIndex++) {
      const word15 = messageSchedule[wordIndex - 15];
      const word2 = messageSchedule[wordIndex - 2];
      messageSchedule[wordIndex] =
        messageSchedule[wordIndex - 16] +
        (rotateRight(word15, 7) ^ rotateRight(word15, 18) ^ (word15 >>> 3)) +
        messageSchedule[wordIndex - 7] +
        (rotateRight(word2, 17) ^ rotateRight(word2, 19) ^ (word2 >>> 10));
    }
    let [stateA, stateB, stateC, stateD, stateE, stateF, stateG, stateH] = hashState;
    for (let roundIndex = 0; roundIndex < 64; roundIndex++) {
      const temp1 =
        (stateH +
          (rotateRight(stateE, 6) ^ rotateRight(stateE, 11) ^ rotateRight(stateE, 25)) +
          ((stateE & stateF) ^ (~stateE & stateG)) +
          cubeRootConstants[roundIndex] +
          messageSchedule[roundIndex]) >>>
        0;
      const temp2 =
        ((rotateRight(stateA, 2) ^ rotateRight(stateA, 13) ^ rotateRight(stateA, 22)) +
          ((stateA & stateB) ^ (stateA & stateC) ^ (stateB & stateC))) >>>
        0;
      stateH = stateG;
      stateG = stateF;
      stateF = stateE;
      stateE = (stateD + temp1) >>> 0;
      stateD = stateC;
      stateC = stateB;
      stateB = stateA;
      stateA = (temp1 + temp2) >>> 0;
    }
    [stateA, stateB, stateC, stateD, stateE, stateF, stateG, stateH].forEach(
      (stateWord, stateIndex) => {
        hashState[stateIndex] = (hashState[stateIndex] + stateWord) >>> 0;
      }
    );
  }
  return hashState.map(hexWord => hexWord.toString(16).padStart(8, "0")).join("");
}
export function lightLayerKey(baseKey, layerDescriptor) {
  return sha256(
    stableCacheJSON({
      version: RENDER_CACHE_VERSION,
      base: baseKey,
      lamp: layerDescriptor.item,
      floor: layerDescriptor.floor.id
    })
  );
}
export function cacheSceneDescriptor(floors) {
  const omitProperties = (source, omittedKeys) =>
    Object.fromEntries(
      Object.entries(source || {}).filter(([propertyName]) => !omittedKeys.includes(propertyName))
    );
  return floors.map(floor => ({
    ...floor,
    name: undefined,
    scene: {
      ...floor.scene,
      settings: omitProperties(floor.scene.settings, [
        "cameraView",
        "cameraMode",
        "cameraFocalLength",
        "cameraTopRotation",
        "fixedCameraView",
        "planViewRotation",
        "livePreviewEnabled",
        "previewPanelRatio",
        "detailsPanelWidthRatio"
      ]),
      lightGroups: floor.scene.lightGroups?.map(lightGroup =>
        omitProperties(lightGroup, ["enabled", "name"])
      ),
      items: floor.scene.items.map(sceneItem =>
        ["downlight", "ceilinglight", "striplight"].includes(sceneItem.type)
          ? omitProperties(sceneItem, ["lightBrightness", "lightTemperature"])
          : sceneItem
      )
    }
  }));
}
export function createRenderCache({
  sceneId: sceneId,
  projectId: projectId,
  fetcher: fetcher = globalThis.fetch,
  decode: decode = imageBlob => createImageBitmap(imageBlob),
  maxBytes: maxBytes = 33554432,
  timeoutMs: timeoutMs = 1800,
  now: now = Date.now,
  report: onReport = () => {},
  makeCanvas: makeCanvas = () => document.createElement("canvas"),
  maxDecodedBytes: maxDecodedBytes = 33554432,
  maxDecodedFrames: maxDecodedFrames = 3
} = {}) {
  const encodedBlobsByKey = new Map();
  const abortControllers = new Set();
  const pendingUploadsByKey = new Map();
  const decodedRecordsByKey = new Map();
  const inFlightReadsByKey = new Map();
  let decodedBytes = 0;
  let memoryBytes = 0;
  let pendingBytes = 0;
  let isUploading = false;
  let isClosed = false;
  let errorCooldownUntil = 0;
  const stats = {
    memoryHits: 0,
    serverHits: 0,
    misses: 0,
    generated: 0,
    uploads: 0,
    errors: 0,
    decodedHits: 0
  };
  const emitStats = () =>
    onReport({
      ...stats,
      memoryBytes: memoryBytes,
      pendingBytes: pendingBytes,
      decodedBytes: decodedBytes,
      decodedFrames: decodedRecordsByKey.size
    });
  function releaseEntry(leaseRecord) {
    leaseRecord.refs--;
    if (!leaseRecord.retained && leaseRecord.refs === 0) {
      leaseRecord.image.close();
    }
  }
  function evictDecodedEntry(evictedKey) {
    const cachedRecord = decodedRecordsByKey.get(evictedKey);
    if (cachedRecord) {
      decodedRecordsByKey.delete(evictedKey);
      decodedBytes -= cachedRecord.bytes;
      cachedRecord.retained = false;
      if (!cachedRecord.refs) {
        cachedRecord.image.close();
      }
    }
  }
  function storeDecodedImage(cacheKey, sourceImage, imageWidth, imageHeight) {
    evictDecodedEntry(cacheKey);
    const newRecord = {
      image: sourceImage,
      width: imageWidth,
      height: imageHeight,
      bytes: imageWidth * imageHeight * 4,
      refs: 1,
      retained: true
    };
    decodedRecordsByKey.set(cacheKey, newRecord);
    decodedBytes += newRecord.bytes;
    while (decodedBytes > maxDecodedBytes || decodedRecordsByKey.size > maxDecodedFrames) {
      evictDecodedEntry(decodedRecordsByKey.keys().next().value);
    }
    return newRecord;
  }
  function createDecodedLease(record) {
    record.refs++;
    let isReleased = false;
    return {
      image: record.image,
      width: record.width,
      height: record.height,
      close() {
        if (!isReleased) {
          isReleased = true;
          releaseEntry(record);
        }
      }
    };
  }
  const buildTileUrl = tileKey =>
    "/api/v1/modules/interaction3d/scenes/" +
    encodeURIComponent(sceneId) +
    "/render-cache/" +
    tileKey +
    "?projectId=" +
    encodeURIComponent(projectId || "");
  function cacheBlob(blobKey, blobValue) {
    if (encodedBlobsByKey.has(blobKey)) {
      memoryBytes -= encodedBlobsByKey.get(blobKey).size;
    }
    encodedBlobsByKey.delete(blobKey);
    if (blobValue.size <= maxBytes) {
      encodedBlobsByKey.set(blobKey, blobValue);
      memoryBytes += blobValue.size;
    }
    while (memoryBytes > maxBytes || encodedBlobsByKey.size > 64) {
      const oldestKey = encodedBlobsByKey.keys().next().value;
      memoryBytes -= encodedBlobsByKey.get(oldestKey).size;
      encodedBlobsByKey.delete(oldestKey);
    }
  }
  async function requestBlob(requestKey, requestOptions = {}, isRequestWanted = () => true) {
    if (isClosed || now() < errorCooldownUntil) {
      return null;
    }
    const requestAbortController = new AbortController();
    abortControllers.add(requestAbortController);
    const timeoutId = setTimeout(() => requestAbortController.abort(), timeoutMs);
    const stalePollId = requestOptions.method
      ? null
      : setInterval(() => {
          if (!isRequestWanted()) {
            requestAbortController.abort("stale");
          }
        }, 50);
    try {
      const response = await fetcher(buildTileUrl(requestKey), {
        ...requestOptions,
        credentials: "same-origin",
        signal: requestAbortController.signal
      });
      const isBinaryMiss =
        !requestOptions.method &&
        response.status === 404 &&
        !response.headers?.get("content-type")?.includes("application/json");
      if (!response.ok && !isBinaryMiss) {
        throw new Error("cache unavailable");
      }
      if (!requestOptions.method && (response.status === 204 || isBinaryMiss)) {
        return null;
      } else if (requestOptions.method) {
        return response;
      } else if (response.ok) {
        return await response.blob();
      } else {
        return null;
      }
    } catch {
      if (!isClosed && isRequestWanted()) {
        stats.errors++;
        errorCooldownUntil = now() + 15000;
      }
      return null;
    } finally {
      clearTimeout(timeoutId);
      clearInterval(stalePollId);
      abortControllers.delete(requestAbortController);
    }
  }
  async function flushPendingUploads() {
    if (!isUploading && !isClosed) {
      isUploading = true;
      try {
        while (pendingUploadsByKey.size && !isClosed) {
          const [uploadKey, uploadBlob] = pendingUploadsByKey.entries().next().value;
          pendingUploadsByKey.delete(uploadKey);
          pendingBytes -= uploadBlob.size;
          if (
            (
              await requestBlob(uploadKey, {
                method: "PUT",
                headers: {
                  "Content-Type": "image/png"
                },
                body: uploadBlob
              })
            )?.ok
          ) {
            stats.uploads++;
          }
          emitStats();
        }
      } finally {
        isUploading = false;
      }
    }
  }
  const createTilePlan = (tileHash, tileWidth, tileHeight) => {
    const tiles = [];
    for (let offsetY = 0; offsetY < tileHeight; offsetY += 1024) {
      for (let offsetX = 0; offsetX < tileWidth; offsetX += 1024) {
        tiles.push({
          x: offsetX,
          y: offsetY,
          width: Math.min(1024, tileWidth - offsetX),
          height: Math.min(1024, tileHeight - offsetY),
          key: sha256(
            tileHash + ":tile-v1:" + tileWidth + ":" + tileHeight + ":" + offsetX + ":" + offsetY
          )
        });
      }
    }
    return tiles;
  };
  const cache = {
    stats: stats,
    get closed() {
      return isClosed;
    },
    async acquire(acquireKey, acquireWidth, acquireHeight, isAcquireWanted = () => true) {
      if (isClosed || !acquireKey || !isAcquireWanted()) {
        return null;
      }
      const acquireRecordKey = acquireKey + ":" + acquireWidth + ":" + acquireHeight;
      const existingRecord = decodedRecordsByKey.get(acquireRecordKey);
      if (existingRecord) {
        decodedRecordsByKey.delete(acquireRecordKey);
        decodedRecordsByKey.set(acquireRecordKey, existingRecord);
        stats.decodedHits++;
        emitStats();
        return createDecodedLease(existingRecord);
      }
      let inFlightEntry = inFlightReadsByKey.get(acquireRecordKey);
      if (!inFlightEntry) {
        inFlightEntry = {
          waiters: new Set(),
          entry: null
        };
        inFlightReadsByKey.set(acquireRecordKey, inFlightEntry);
      }
      const isStillWanted = () => !isClosed && isAcquireWanted();
      inFlightEntry.waiters.add(isStillWanted);
      inFlightEntry.promise ||= cache
        .read(acquireKey, acquireWidth, acquireHeight, () =>
          [...inFlightEntry.waiters].some(waiterCheck => waiterCheck())
        )
        .then(fetchedRecord =>
          fetchedRecord
            ? isClosed ||
              ![...inFlightEntry.waiters].some(pendingWaiterCheck => pendingWaiterCheck())
              ? (fetchedRecord.close(), null)
              : ((inFlightEntry.entry = storeDecodedImage(
                  acquireRecordKey,
                  fetchedRecord,
                  acquireWidth,
                  acquireHeight
                )),
                emitStats(),
                inFlightEntry.entry)
            : null
        );
      try {
        const sharedRecord = await inFlightEntry.promise;
        if (sharedRecord && isStillWanted()) {
          return createDecodedLease(sharedRecord);
        } else {
          return null;
        }
      } finally {
        inFlightEntry.waiters.delete(isStillWanted);
        if (!inFlightEntry.waiters.size) {
          inFlightReadsByKey.delete(acquireRecordKey);
          if (inFlightEntry.entry) {
            releaseEntry(inFlightEntry.entry);
          }
        }
      }
    },
    async read(readKey, readWidth, readHeight, isReadWanted = () => true) {
      if (isClosed || !readKey || !isReadWanted()) {
        return null;
      }
      if (readWidth * readHeight > 2097152) {
        const canvasElement = makeCanvas();
        canvasElement.width = readWidth;
        canvasElement.height = readHeight;
        let isComplete = false;
        try {
          const readContext = canvasElement.getContext("2d");
          if (!readContext) {
            return null;
          }
          for (const sourceTile of createTilePlan(readKey, readWidth, readHeight)) {
            const tileImage = await cache.read(
              sourceTile.key,
              sourceTile.width,
              sourceTile.height,
              isReadWanted
            );
            if (!tileImage) {
              return null;
            }
            try {
              if (isClosed || !isReadWanted()) {
                return null;
              }
              readContext.drawImage(tileImage, sourceTile.x, sourceTile.y);
            } finally {
              tileImage.close();
            }
          }
          canvasElement.close = () => {
            canvasElement.width = canvasElement.height = 0;
          };
          isComplete = true;
          return canvasElement;
        } finally {
          if (!isComplete) {
            canvasElement.width = canvasElement.height = 0;
          }
        }
      }
      let cachedBlob = encodedBlobsByKey.get(readKey);
      let statsKey = cachedBlob ? "memoryHits" : "serverHits";
      cachedBlob ||= await requestBlob(readKey, {}, isReadWanted);
      if (isClosed || !isReadWanted()) {
        return null;
      }
      if (!cachedBlob || cachedBlob.size > 10485760 || cachedBlob.type !== "image/png") {
        stats.misses++;
        emitStats();
        return null;
      }
      let decodedImage;
      try {
        decodedImage = await decode(cachedBlob);
        if (
          isClosed ||
          !isReadWanted() ||
          decodedImage.width !== readWidth ||
          decodedImage.height !== readHeight
        ) {
          throw new Error("stale image");
        }
        cacheBlob(readKey, cachedBlob);
        stats[statsKey]++;
        emitStats();
        return decodedImage;
      } catch {
        decodedImage?.close?.();
        if (encodedBlobsByKey.has(readKey)) {
          memoryBytes -= encodedBlobsByKey.get(readKey).size;
          encodedBlobsByKey.delete(readKey);
        }
        stats.misses++;
        emitStats();
        return null;
      }
    },
    async write(writeKey, writeImage, isWriteWanted = () => true) {
      if (isClosed || !writeKey || !isWriteWanted()) {
        return;
      }
      if (writeImage.width * writeImage.height > 2097152) {
        const tileCanvas = makeCanvas();
        try {
          for (const tile of createTilePlan(writeKey, writeImage.width, writeImage.height)) {
            if (isClosed || !isWriteWanted()) {
              return;
            }
            tileCanvas.width = tile.width;
            tileCanvas.height = tile.height;
            const tileContext = tileCanvas.getContext("2d");
            if (!tileContext) {
              return;
            }
            tileContext.drawImage(
              writeImage,
              tile.x,
              tile.y,
              tile.width,
              tile.height,
              0,
              0,
              tile.width,
              tile.height
            );
            await cache.write(tile.key, tileCanvas, isWriteWanted);
          }
        } finally {
          tileCanvas.width = tileCanvas.height = 0;
        }
        return;
      }
      let blob;
      try {
        blob = await new Promise(resolveBlob => writeImage.toBlob(resolveBlob, "image/png"));
      } catch {
        stats.errors++;
        emitStats();
        return;
      }
      if (!isClosed && !!isWriteWanted() && !!blob && !(blob.size > 10485760)) {
        cacheBlob(writeKey, blob);
        stats.generated++;
        if (
          pendingBytes + blob.size <= 16777216 &&
          pendingUploadsByKey.size < 32 &&
          now() >= errorCooldownUntil &&
          !pendingUploadsByKey.has(writeKey)
        ) {
          pendingUploadsByKey.set(writeKey, blob);
          pendingBytes += blob.size;
          flushPendingUploads();
        }
        emitStats();
      }
    },
    close() {
      isClosed = true;
      for (const pendingController of abortControllers) {
        pendingController.abort();
      }
      for (const decodedKey of decodedRecordsByKey.keys()) {
        evictDecodedEntry(decodedKey);
      }
      encodedBlobsByKey.clear();
      pendingUploadsByKey.clear();
      memoryBytes = pendingBytes = 0;
      emitStats();
    }
  };
  return cache;
}
