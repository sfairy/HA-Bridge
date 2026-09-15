const MAX_HISTORY_SERIES_CACHE_SIZE = 512;
export const HISTORY_FETCH_TIMEOUT_MS = 12000;
export function historySeriesCacheKey(cacheEntityId, hours) {
  return String(cacheEntityId || "") + ":" + (Number(hours) || 0);
}
export function cacheHistorySeries(cache, entityId, series) {
  if (!!Array.isArray(series?.points) && series.points.length !== 0) {
    for (cache.set(historySeriesCacheKey(entityId, series.hours), series); cache.size > 512;) {
      const oldestKey = cache.keys().next().value;
      if (!oldestKey) {
        break;
      }
      cache.delete(oldestKey);
    }
  }
}
export class HistoryRefreshCoordinator {
  constructor() {
    this.running = null;
    this.currentKey = null;
    this.pendingKey = null;
    this.pendingRun = null;
  }
  request(requestKey, run) {
    if (this.running) {
      if (requestKey === this.currentKey) {
        this.pendingKey = null;
        this.pendingRun = null;
      } else if (requestKey !== this.pendingKey) {
        this.pendingKey = requestKey;
        this.pendingRun = run;
      }
      return this.running;
    }
    this.pendingKey = requestKey;
    this.pendingRun = run;
    const drainPendingRuns = async () => {
      while (this.pendingRun) {
        const pendingRun = this.pendingRun;
        this.currentKey = this.pendingKey;
        this.pendingKey = null;
        this.pendingRun = null;
        await pendingRun();
      }
    };
    this.running = drainPendingRuns().finally(() => {
      this.running = null;
      this.currentKey = null;
    });
    return this.running;
  }
}
export class RuntimeStaticImageCache {
  constructor({
    maxConcurrent: maxConcurrent = 2,
    maxDecoded: maxDecoded = 32,
    idleDelay: idleDelay = 120,
    loadTimeout: loadTimeout = 15000,
    createImage: createImage = () => new Image(),
    setTimer: setTimer = (timerCallback, delayMs) => globalThis.setTimeout(timerCallback, delayMs),
    clearTimer: clearTimer = timerHandle => globalThis.clearTimeout(timerHandle)
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(maxConcurrent) || 1);
    this.maxDecoded = Math.max(1, Number(maxDecoded) || 1);
    this.idleDelay = Math.max(0, Number(idleDelay) || 0);
    this.loadTimeout = Math.max(1000, Number(loadTimeout) || 15000);
    this.createImage = createImage;
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
    this.desiredSources = new Set();
    this.prioritySources = new Set();
    this.loadedSources = new Set();
    this.decodedImages = new Map();
    this.queue = [];
    this.activeLoads = new Map();
    this.timer = null;
    this.timerDueAt = 0;
    this.sequence = 0;
    this.stopped = false;
  }
  setSources(sources = [], prioritySources = []) {
    if (!this.stopped) {
      this.desiredSources = new Set(
        (sources || []).map(desiredSource => String(desiredSource || "")).filter(Boolean)
      );
      this.prioritySources = new Set(
        (prioritySources || [])
          .map(prioritySource => String(prioritySource || ""))
          .filter(isDesiredSource => this.desiredSources.has(isDesiredSource))
      );
      this.queue = this.queue.filter(({ source: removedSource }) =>
        this.desiredSources.has(removedSource)
      );
      for (const [activeSource, { image: activeImage, cancel: cancelActiveLoad }] of [
        ...this.activeLoads
      ]) {
        if (!this.desiredSources.has(activeSource)) {
          activeImage.removeAttribute?.("src");
          cancelActiveLoad();
        }
      }
      for (const loadedSource of [...this.loadedSources]) {
        if (!this.desiredSources.has(loadedSource)) {
          this.loadedSources.delete(loadedSource);
        }
      }
      for (const decodedSourceKey of [...this.decodedImages.keys()]) {
        if (!this.desiredSources.has(decodedSourceKey)) {
          this.decodedImages.delete(decodedSourceKey);
        }
      }
      for (const retainedPrioritySource of this.prioritySources) {
        if (this.decodedImages.has(retainedPrioritySource)) {
          const retainedImage = this.decodedImages.get(retainedPrioritySource);
          this.decodedImages.delete(retainedPrioritySource);
          this.decodedImages.set(retainedPrioritySource, retainedImage);
        } else {
          this.enqueue(retainedPrioritySource, {
            active: true
          });
        }
      }
      for (const nextDesiredSource of this.desiredSources) {
        this.enqueue(nextDesiredSource);
      }
      this.trimDecodedImages();
    }
  }
  enqueue(source, { active: isActive = false } = {}) {
    const normalizedSource = String(source || "");
    if (
      this.stopped ||
      !normalizedSource ||
      !this.desiredSources.has(normalizedSource) ||
      this.decodedImages.has(normalizedSource) ||
      this.activeLoads.has(normalizedSource) ||
      (this.loadedSources.has(normalizedSource) && !isActive)
    ) {
      return false;
    }
    const staticQueuedEntry = this.queue.find(
      staticQueueCandidate => staticQueueCandidate.source === normalizedSource
    );
    if (staticQueuedEntry) {
      staticQueuedEntry.active = staticQueuedEntry.active || !!isActive;
      this.schedule(staticQueuedEntry.active ? 0 : this.idleDelay);
      return false;
    } else {
      this.queue.push({
        source: normalizedSource,
        active: !!isActive,
        sequence: this.sequence++
      });
      this.schedule(isActive ? 0 : this.idleDelay);
      return true;
    }
  }
  schedule(staticScheduleDelayMs = 0) {
    if (this.stopped) {
      return;
    }
    const normalizedDelay = Math.max(0, Number(staticScheduleDelayMs) || 0);
    const dueAt = Date.now() + normalizedDelay;
    if (this.timer === null || !(dueAt >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = dueAt;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, normalizedDelay);
    }
  }
  drain() {
    if (!this.stopped) {
      for (
        this.queue.sort(
          (leftQueuedEntry, rightQueuedEntry) =>
            Number(rightQueuedEntry.active) - Number(leftQueuedEntry.active) ||
            leftQueuedEntry.sequence - rightQueuedEntry.sequence
        );
        this.activeLoads.size < this.maxConcurrent && this.queue.length;
      ) {
        const drainEntry = this.queue.shift();
        if (
          !!this.desiredSources.has(drainEntry.source) &&
          !this.decodedImages.has(drainEntry.source)
        ) {
          this.start(drainEntry);
        }
      }
    }
  }
  start({ source: loadingSource, active: activeRequest }) {
    if (this.stopped || !loadingSource) {
      return;
    }
    const image = this.createImage();
    let isSettled = false;
    let hasDecodeStarted = false;
    let timeoutHandle = null;
    const finishStaticLoad = loaded => {
      if (!isSettled) {
        isSettled = true;
        if (timeoutHandle !== null) {
          this.clearTimer(timeoutHandle);
        }
        image.removeEventListener?.("load", handleStaticLoad);
        image.removeEventListener?.("error", handleStaticError);
        this.activeLoads.delete(loadingSource);
        if (loaded && this.desiredSources.has(loadingSource)) {
          this.loadedSources.add(loadingSource);
          this.decodedImages.delete(loadingSource);
          this.decodedImages.set(loadingSource, image);
          this.trimDecodedImages();
        }
        this.drain();
      }
    };
    const handleStaticLoad = () => {
      if (hasDecodeStarted) {
        return;
      }
      hasDecodeStarted = true;
      let decodePromise = null;
      try {
        decodePromise = typeof image.decode == "function" ? image.decode() : null;
      } catch {
        decodePromise = null;
      }
      if (decodePromise?.then) {
        Promise.resolve(decodePromise)
          .catch(() => {})
          .finally(() => finishStaticLoad(true));
      } else {
        finishStaticLoad(true);
      }
    };
    const handleStaticError = () => finishStaticLoad(false);
    image.decoding = "async";
    image.fetchPriority = activeRequest ? "high" : "low";
    image.addEventListener?.("load", handleStaticLoad, {
      once: true
    });
    image.addEventListener?.("error", handleStaticError, {
      once: true
    });
    this.activeLoads.set(loadingSource, {
      image: image,
      cancel: () => finishStaticLoad(false)
    });
    image.src = loadingSource;
    timeoutHandle = this.setTimer(() => {
      image.removeAttribute?.("src");
      finishStaticLoad(false);
    }, this.loadTimeout);
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(handleStaticLoad);
    }
  }
  trimDecodedImages() {
    while (this.decodedImages.size > this.maxDecoded) {
      const evictedSource =
        [...this.decodedImages.keys()].find(
          candidateDecodedSource => !this.prioritySources.has(candidateDecodedSource)
        ) || this.decodedImages.keys().next().value;
      if (!evictedSource) {
        break;
      }
      this.decodedImages.delete(evictedSource);
    }
  }
  reset() {
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
    if (this.timer !== null) {
      this.clearTimer(this.timer);
    }
    this.timer = null;
    this.timerDueAt = 0;
    this.queue.length = 0;
    for (const { image: stoppedImage, cancel: cancelLoadedImage } of [
      ...this.activeLoads.values()
    ]) {
      stoppedImage.removeAttribute?.("src");
      cancelLoadedImage();
    }
    this.activeLoads.clear();
    this.desiredSources.clear();
    this.prioritySources.clear();
    this.loadedSources.clear();
    this.decodedImages.clear();
  }
}
export class RuntimeEffectImageLoader {
  constructor({
    maxConcurrent: effectMaxConcurrent = 4,
    idleDelay: effectIdleDelay = 160,
    loadTimeout: effectLoadTimeout = 15000,
    setTimer: effectSetTimer = (effectTimerCallback, effectDelayMs) =>
      globalThis.setTimeout(effectTimerCallback, effectDelayMs),
    clearTimer: effectClearTimer = effectTimerHandle => globalThis.clearTimeout(effectTimerHandle)
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(effectMaxConcurrent) || 1);
    this.idleDelay = Math.max(0, Number(effectIdleDelay) || 0);
    this.loadTimeout = Math.max(1000, Number(effectLoadTimeout) || 15000);
    this.setTimer = effectSetTimer;
    this.clearTimer = effectClearTimer;
    this.queue = [];
    this.inFlight = 0;
    this.sequence = 0;
    this.activeLoads = new Map();
    this.timer = null;
    this.timerDueAt = 0;
    this.loadedSources = new Set();
    this.stopped = false;
  }
  enqueue(imageElement, requestedSource, { active: isPriority = false } = {}) {
    const effectSource = String(requestedSource || "");
    if (this.stopped || !imageElement || !effectSource) {
      return;
    }
    imageElement.dataset ||= {};
    imageElement.dataset.effectPendingSource = effectSource;
    if (imageElement.dataset.effectLoadedSource === effectSource) {
      delete imageElement.dataset.effectPendingSource;
      return;
    }
    if (this.loadedSources.has(effectSource)) {
      imageElement.dataset.effectLoadedSource = effectSource;
      delete imageElement.dataset.effectPendingSource;
      imageElement.src = effectSource;
      return;
    }
    const effectQueuedEntry = this.queue.find(
      effectQueueCandidate =>
        effectQueueCandidate.image === imageElement && effectQueueCandidate.source === effectSource
    );
    if (effectQueuedEntry) {
      effectQueuedEntry.active = effectQueuedEntry.active || !!isPriority;
    } else {
      this.queue.push({
        image: imageElement,
        source: effectSource,
        active: !!isPriority,
        sequence: this.sequence++
      });
    }
    if (isPriority) {
      this.drain(true);
    } else {
      this.schedule(this.idleDelay);
    }
  }
  schedule(effectScheduleDelayMs = 0) {
    if (this.stopped) {
      return;
    }
    const effectNormalizedDelay = Math.max(0, Number(effectScheduleDelayMs) || 0);
    const effectDueAt = Date.now() + effectNormalizedDelay;
    if (this.timer === null || !(effectDueAt >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = effectDueAt;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, effectNormalizedDelay);
    }
  }
  drain(activeOnly = false) {
    if (!this.stopped) {
      for (
        this.queue.sort(
          (leftPendingEntry, rightPendingEntry) =>
            Number(rightPendingEntry.active) - Number(leftPendingEntry.active) ||
            leftPendingEntry.sequence - rightPendingEntry.sequence
        );
        this.inFlight < this.maxConcurrent;
      ) {
        const queueIndex = this.queue.findIndex(
          ({ image: drainImage, source: entrySource, active: entryActive }) =>
            drainImage &&
            drainImage.dataset?.effectPendingSource === entrySource &&
            !drainImage.dataset?.effectLoadingSource &&
            (!activeOnly || entryActive) &&
            (drainImage.isConnected === undefined || drainImage.isConnected)
        );
        if (queueIndex < 0) {
          break;
        }
        const [queueEntry] = this.queue.splice(queueIndex, 1);
        this.start(queueEntry);
      }
    }
  }
  start({ image: pendingImage, source: pendingSource }) {
    if (
      this.stopped ||
      !pendingImage ||
      pendingImage.dataset?.effectPendingSource !== pendingSource
    ) {
      return;
    }
    this.inFlight += 1;
    pendingImage.dataset.effectLoadingSource = pendingSource;
    let isEffectSettled = false;
    let effectTimeoutHandle = null;
    const finishEffectLoad = effectLoaded => {
      if (!isEffectSettled) {
        isEffectSettled = true;
        if (effectTimeoutHandle !== null) {
          this.clearTimer(effectTimeoutHandle);
        }
        pendingImage.removeEventListener?.("load", handleEffectLoad);
        pendingImage.removeEventListener?.("error", handleEffectError);
        this.activeLoads.delete(pendingImage);
        if (pendingImage.dataset?.effectLoadingSource === pendingSource) {
          delete pendingImage.dataset.effectLoadingSource;
        }
        if (effectLoaded && pendingImage.dataset?.effectPendingSource === pendingSource) {
          pendingImage.dataset.effectLoadedSource = pendingSource;
          delete pendingImage.dataset.effectPendingSource;
          this.loadedSources.add(pendingSource);
        }
        this.inFlight = Math.max(0, this.inFlight - 1);
        this.drain();
      }
    };
    const handleEffectLoad = () => finishEffectLoad(true);
    const handleEffectError = () => finishEffectLoad(false);
    pendingImage.addEventListener?.("load", handleEffectLoad, {
      once: true
    });
    pendingImage.addEventListener?.("error", handleEffectError, {
      once: true
    });
    this.activeLoads.set(pendingImage, () => finishEffectLoad(false));
    pendingImage.src = pendingSource;
    effectTimeoutHandle = this.setTimer(() => {
      pendingImage.removeAttribute?.("src");
      finishEffectLoad(false);
    }, this.loadTimeout);
    if (pendingImage.complete && Number(pendingImage.naturalWidth || 0) > 0) {
      Promise.resolve().then(handleEffectLoad);
    }
  }
  promote(promotedImage) {
    const promotedSource =
      promotedImage?.dataset?.effectPendingSource || promotedImage?.dataset?.effectSource || "";
    if (promotedSource) {
      this.enqueue(promotedImage, promotedSource, {
        active: true
      });
    }
  }
  pruneDisconnected() {
    this.queue = this.queue.filter(
      ({ image: queuedImage, source: prunedSource }) =>
        queuedImage &&
        queuedImage.dataset?.effectPendingSource === prunedSource &&
        (queuedImage.isConnected === undefined || queuedImage.isConnected)
    );
    for (const [prunedImage, cancelEffectLoad] of [...this.activeLoads]) {
      if (prunedImage.isConnected === false) {
        cancelEffectLoad();
      }
    }
  }
  reset() {
    if (this.timer !== null) {
      this.clearTimer(this.timer);
    }
    this.timer = null;
    this.timerDueAt = 0;
    this.queue.length = 0;
    this.activeLoads.clear();
    this.inFlight = 0;
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
    if (this.timer !== null) {
      this.clearTimer(this.timer);
    }
    this.timer = null;
    this.timerDueAt = 0;
    this.queue.length = 0;
    for (const cancelStoppedLoad of [...this.activeLoads.values()]) {
      cancelStoppedLoad();
    }
    this.activeLoads.clear();
    this.inFlight = 0;
    this.loadedSources.clear();
  }
}
export class RuntimeVacuumMapImagePreloader {
  constructor({
    maxConcurrent: vacuumMaxConcurrent = 1,
    retryDelay: retryDelay = 15000,
    createImage: vacuumCreateImage = () => new Image(),
    now: now = () => Date.now()
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(vacuumMaxConcurrent) || 1);
    this.retryDelay = Math.max(1000, Number(retryDelay) || 15000);
    this.createImage = vacuumCreateImage;
    this.now = now;
    this.queue = [];
    this.queuedSources = new Set();
    this.loadedSources = new Set();
    this.loadedSourceByKey = new Map();
    this.failedAt = new Map();
    this.activeLoads = new Map();
    this.stopped = false;
  }
  enqueue(candidateSource) {
    const vacuumSource = String(candidateSource || "");
    const sourceKey = vacuumSource.split("?", 1)[0];
    if (
      this.stopped ||
      !vacuumSource ||
      this.loadedSources.has(vacuumSource) ||
      this.queuedSources.has(vacuumSource) ||
      this.activeLoads.has(vacuumSource)
    ) {
      return false;
    }
    const failedAt = Number(this.failedAt.get(vacuumSource) || 0);
    if (failedAt && this.now() - failedAt < this.retryDelay) {
      return false;
    }
    for (const failedSource of this.failedAt.keys()) {
      if (failedSource !== vacuumSource && failedSource.split("?", 1)[0] === sourceKey) {
        this.failedAt.delete(failedSource);
      }
    }
    const queuedIndex = this.queue.findIndex(queuedEntry => queuedEntry.key === sourceKey);
    if (queuedIndex >= 0) {
      this.queuedSources.delete(this.queue[queuedIndex].source);
      this.queue[queuedIndex] = {
        key: sourceKey,
        source: vacuumSource
      };
    } else {
      this.queue.push({
        key: sourceKey,
        source: vacuumSource
      });
    }
    this.queuedSources.add(vacuumSource);
    this.drain();
    return true;
  }
  drain() {
    if (!this.stopped) {
      while (this.activeLoads.size < this.maxConcurrent && this.queue.length) {
        const { key: entryKey, source: drainSource } = this.queue.shift();
        this.queuedSources.delete(drainSource);
        this.start(entryKey, drainSource);
      }
    }
  }
  start(loadKey, preloadSource) {
    if (this.stopped || !preloadSource) {
      return;
    }
    const preloaderImage = this.createImage();
    let isVacuumSettled = false;
    const finishVacuumLoad = vacuumLoaded => {
      if (!isVacuumSettled) {
        isVacuumSettled = true;
        preloaderImage.removeEventListener?.("load", handleVacuumLoad);
        preloaderImage.removeEventListener?.("error", handleVacuumError);
        this.activeLoads.delete(preloadSource);
        if (vacuumLoaded) {
          const previousSource = this.loadedSourceByKey.get(loadKey);
          if (previousSource && previousSource !== preloadSource) {
            this.loadedSources.delete(previousSource);
          }
          this.loadedSourceByKey.set(loadKey, preloadSource);
          this.loadedSources.add(preloadSource);
          this.failedAt.delete(preloadSource);
        } else {
          this.failedAt.set(preloadSource, this.now());
        }
        this.drain();
      }
    };
    const handleVacuumLoad = () => finishVacuumLoad(true);
    const handleVacuumError = () => finishVacuumLoad(false);
    preloaderImage.decoding = "async";
    preloaderImage.fetchPriority = "low";
    preloaderImage.addEventListener?.("load", handleVacuumLoad, {
      once: true
    });
    preloaderImage.addEventListener?.("error", handleVacuumError, {
      once: true
    });
    this.activeLoads.set(preloadSource, {
      image: preloaderImage,
      cancel: () => finishVacuumLoad(false)
    });
    preloaderImage.src = preloadSource;
    if (preloaderImage.complete && Number(preloaderImage.naturalWidth || 0) > 0) {
      Promise.resolve().then(handleVacuumLoad);
    }
  }
  reset() {
    this.queue.length = 0;
    this.queuedSources.clear();
    this.activeLoads.clear();
    this.stopped = false;
  }
  stop() {
    this.stopped = true;
    this.queue.length = 0;
    this.queuedSources.clear();
    for (const { image: loadingImage, cancel: cancelVacuumLoad } of [
      ...this.activeLoads.values()
    ]) {
      loadingImage.removeAttribute?.("src");
      cancelVacuumLoad();
    }
    this.activeLoads.clear();
    this.loadedSources.clear();
    this.loadedSourceByKey.clear();
    this.failedAt.clear();
  }
}
export function historyRequestStillRelevant(requestContext, currentContext) {
  if (requestContext.documentGeneration !== currentContext.documentGeneration) {
    return false;
  } else if (
    requestContext.shared ||
    (requestContext.pagePath !== null && requestContext.pagePath === currentContext.pagePath)
  ) {
    return true;
  } else {
    return (
      requestContext.popupId !== null &&
      requestContext.popupId === currentContext.popupId &&
      requestContext.popupGeneration === currentContext.popupGeneration
    );
  }
}
