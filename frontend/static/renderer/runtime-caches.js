const MAX_HISTORY_CACHE_ENTRIES = 512;
export const HISTORY_FETCH_TIMEOUT_MS = 12000;
export function historySeriesCacheKey(entityKey, hours) {
  return String(entityKey || "") + ":" + (Number(hours) || 0);
}
export function cacheHistorySeries(cache, entityKey, series) {
  if (!!Array.isArray(series?.points) && series.points.length !== 0) {
    for (cache.set(historySeriesCacheKey(entityKey, series.hours), series); cache.size > 512;) {
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
  request(key, run) {
    if (this.running) {
      if (key === this.currentKey) {
        this.pendingKey = null;
        this.pendingRun = null;
      } else if (key !== this.pendingKey) {
        this.pendingKey = key;
        this.pendingRun = run;
      }
      return this.running;
    }
    this.pendingKey = key;
    this.pendingRun = run;
    const runQueue = async () => {
      while (this.pendingRun) {
        const pendingRun = this.pendingRun;
        this.currentKey = this.pendingKey;
        this.pendingKey = null;
        this.pendingRun = null;
        await pendingRun();
      }
    };
    this.running = runQueue().finally(() => {
      this.running = null;
      this.currentKey = null;
    });
    return this.running;
  }
}
export class RuntimeStaticImageCache {
  constructor({
    maxConcurrent = 2,
    maxDecoded = 32,
    idleDelay = 120,
    loadTimeout = 15000,
    createImage = () => new Image(),
    setTimer = (callback, delayMs) => globalThis.setTimeout(callback, delayMs),
    clearTimer = timerId => globalThis.clearTimeout(timerId)
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
  setSources(sources = [], priority = []) {
    if (!this.stopped) {
      this.desiredSources = new Set((sources || []).map(source => String(source || "")).filter(Boolean));
      this.prioritySources = new Set((priority || []).map(source => String(source || "")).filter(source => this.desiredSources.has(source)));
      this.queue = this.queue.filter(({
        source
      }) => this.desiredSources.has(source));
      for (const [source, {
        image,
        cancel: cancelLoad
      }] of [...this.activeLoads]) {
        if (!this.desiredSources.has(source)) {
          image.removeAttribute?.("src");
          cancelLoad();
        }
      }
      for (const source of [...this.loadedSources]) {
        if (!this.desiredSources.has(source)) {
          this.loadedSources.delete(source);
        }
      }
      for (const source of [...this.decodedImages.keys()]) {
        if (!this.desiredSources.has(source)) {
          this.decodedImages.delete(source);
        }
      }
      for (const source of this.prioritySources) {
        if (this.decodedImages.has(source)) {
          const image = this.decodedImages.get(source);
          this.decodedImages.delete(source);
          this.decodedImages.set(source, image);
        } else {
          this.enqueue(source, {
            active: true
          });
        }
      }
      for (const source of this.desiredSources) {
        this.enqueue(source);
      }
      this.trimDecodedImages();
    }
  }
  enqueue(rawSource, {
    active = false
  } = {}) {
    const source = String(rawSource || "");
    if (this.stopped || !source || !this.desiredSources.has(source) || this.decodedImages.has(source) || this.activeLoads.has(source) || this.loadedSources.has(source) && !active) {
      return false;
    }
    const existing = this.queue.find(item => item.source === source);
    if (existing) {
      existing.active = existing.active || !!active;
      this.schedule(existing.active ? 0 : this.idleDelay);
      return false;
    } else {
      this.queue.push({
        source,
        active: !!active,
        sequence: this.sequence++
      });
      this.schedule(active ? 0 : this.idleDelay);
      return true;
    }
  }
  schedule(delay = 0) {
    if (this.stopped) {
      return;
    }
    const count = Math.max(0, Number(delay) || 0);
    const dueAt = Date.now() + count;
    if (this.timer === null || !(dueAt >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = dueAt;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, count);
    }
  }
  drain() {
    if (!this.stopped) {
      for (this.queue.sort((left, right) => Number(right.active) - Number(left.active) || left.sequence - right.sequence); this.activeLoads.size < this.maxConcurrent && this.queue.length;) {
        const item = this.queue.shift();
        if (!!this.desiredSources.has(item.source) && !this.decodedImages.has(item.source)) {
          this.start(item);
        }
      }
    }
  }
  start({
    source,
    active
  }) {
    if (this.stopped || !source) {
      return;
    }
    const image = this.createImage();
    let settled = false;
    let loadHandled = false;
    let timeoutId = null;
    const finish = success => {
      if (!settled) {
        settled = true;
        if (timeoutId !== null) {
          this.clearTimer(timeoutId);
        }
        image.removeEventListener?.("load", onLoad);
        image.removeEventListener?.("error", onError);
        this.activeLoads.delete(source);
        if (success && this.desiredSources.has(source)) {
          this.loadedSources.add(source);
          this.decodedImages.delete(source);
          this.decodedImages.set(source, image);
          this.trimDecodedImages();
        }
        this.drain();
      }
    };
    const onLoad = () => {
      if (loadHandled) {
        return;
      }
      loadHandled = true;
      let decodePromise = null;
      try {
        decodePromise = typeof image.decode == "function" ? image.decode() : null;
      } catch {
        decodePromise = null;
      }
      if (decodePromise?.then) {
        Promise.resolve(decodePromise).catch(() => {}).finally(() => finish(true));
      } else {
        finish(true);
      }
    };
    const onError = () => finish(false);
    image.decoding = "async";
    image.fetchPriority = active ? "high" : "low";
    image.addEventListener?.("load", onLoad, {
      once: true
    });
    image.addEventListener?.("error", onError, {
      once: true
    });
    this.activeLoads.set(source, {
      image,
      cancel: () => finish(false)
    });
    image.src = source;
    timeoutId = this.setTimer(() => {
      image.removeAttribute?.("src");
      finish(false);
    }, this.loadTimeout);
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(onLoad);
    }
  }
  trimDecodedImages() {
    while (this.decodedImages.size > this.maxDecoded) {
      const evictionKey = [...this.decodedImages.keys()].find(key => !this.prioritySources.has(key)) || this.decodedImages.keys().next().value;
      if (!evictionKey) {
        break;
      }
      this.decodedImages.delete(evictionKey);
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
    for (const {
      image,
      cancel: cancelLoad
    } of [...this.activeLoads.values()]) {
      image.removeAttribute?.("src");
      cancelLoad();
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
    maxConcurrent = 4,
    idleDelay = 160,
    loadTimeout = 15000,
    setTimer = (callback, delayMs) => globalThis.setTimeout(callback, delayMs),
    clearTimer = timerId => globalThis.clearTimeout(timerId)
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(maxConcurrent) || 1);
    this.idleDelay = Math.max(0, Number(idleDelay) || 0);
    this.loadTimeout = Math.max(1000, Number(loadTimeout) || 15000);
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
    this.queue = [];
    this.inFlight = 0;
    this.sequence = 0;
    this.activeLoads = new Map();
    this.timer = null;
    this.timerDueAt = 0;
    this.loadedSources = new Set();
    this.stopped = false;
  }
  enqueue(image, rawSource, {
    active = false
  } = {}) {
    const source = String(rawSource || "");
    if (this.stopped || !image || !source) {
      return;
    }
    image.dataset ||= {};
    image.dataset.effectPendingSource = source;
    if (image.dataset.effectLoadedSource === source) {
      delete image.dataset.effectPendingSource;
      return;
    }
    if (this.loadedSources.has(source)) {
      image.dataset.effectLoadedSource = source;
      delete image.dataset.effectPendingSource;
      image.src = source;
      return;
    }
    const existing = this.queue.find(item => item.image === image && item.source === source);
    if (existing) {
      existing.active = existing.active || !!active;
    } else {
      this.queue.push({
        image,
        source,
        active: !!active,
        sequence: this.sequence++
      });
    }
    if (active) {
      this.drain(true);
    } else {
      this.schedule(this.idleDelay);
    }
  }
  schedule(delay = 0) {
    if (this.stopped) {
      return;
    }
    const count = Math.max(0, Number(delay) || 0);
    const dueAt = Date.now() + count;
    if (this.timer === null || !(dueAt >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = dueAt;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, count);
    }
  }
  drain(activeOnly = false) {
    if (!this.stopped) {
      for (this.queue.sort((left, right) => Number(right.active) - Number(left.active) || left.sequence - right.sequence); this.inFlight < this.maxConcurrent;) {
        const index = this.queue.findIndex(({
          image,
          source,
          active
        }) => image && image.dataset?.effectPendingSource === source && !image.dataset?.effectLoadingSource && (!activeOnly || active) && (image.isConnected === undefined || image.isConnected));
        if (index < 0) {
          break;
        }
        const [item] = this.queue.splice(index, 1);
        this.start(item);
      }
    }
  }
  start({
    image,
    source
  }) {
    if (this.stopped || !image || image.dataset?.effectPendingSource !== source) {
      return;
    }
    this.inFlight += 1;
    image.dataset.effectLoadingSource = source;
    let settled = false;
    let timeoutId = null;
    const finish = success => {
      if (!settled) {
        settled = true;
        if (timeoutId !== null) {
          this.clearTimer(timeoutId);
        }
        image.removeEventListener?.("load", onLoad);
        image.removeEventListener?.("error", onError);
        this.activeLoads.delete(image);
        if (image.dataset?.effectLoadingSource === source) {
          delete image.dataset.effectLoadingSource;
        }
        if (success && image.dataset?.effectPendingSource === source) {
          image.dataset.effectLoadedSource = source;
          delete image.dataset.effectPendingSource;
          this.loadedSources.add(source);
        }
        this.inFlight = Math.max(0, this.inFlight - 1);
        this.drain();
      }
    };
    const onLoad = () => finish(true);
    const onError = () => finish(false);
    image.addEventListener?.("load", onLoad, {
      once: true
    });
    image.addEventListener?.("error", onError, {
      once: true
    });
    this.activeLoads.set(image, () => finish(false));
    image.src = source;
    timeoutId = this.setTimer(() => {
      image.removeAttribute?.("src");
      finish(false);
    }, this.loadTimeout);
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(onLoad);
    }
  }
  promote(image) {
    const source = image?.dataset?.effectPendingSource || image?.dataset?.effectSource || "";
    if (source) {
      this.enqueue(image, source, {
        active: true
      });
    }
  }
  pruneDisconnected() {
    this.queue = this.queue.filter(({
      image,
      source
    }) => image && image.dataset?.effectPendingSource === source && (image.isConnected === undefined || image.isConnected));
    for (const [image, cancelLoad] of [...this.activeLoads]) {
      if (image.isConnected === false) {
        cancelLoad();
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
    for (const cancelLoad of [...this.activeLoads.values()]) {
      cancelLoad();
    }
    this.activeLoads.clear();
    this.inFlight = 0;
    this.loadedSources.clear();
  }
}
export class RuntimeVacuumMapImagePreloader {
  constructor({
    maxConcurrent = 1,
    retryDelay = 15000,
    createImage = () => new Image(),
    now = () => Date.now()
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(maxConcurrent) || 1);
    this.retryDelay = Math.max(1000, Number(retryDelay) || 15000);
    this.createImage = createImage;
    this.now = now;
    this.queue = [];
    this.queuedSources = new Set();
    this.loadedSources = new Set();
    this.loadedSourceByKey = new Map();
    this.failedAt = new Map();
    this.activeLoads = new Map();
    this.stopped = false;
  }
  enqueue(rawSource) {
    const source = String(rawSource || "");
    const key = source.split("?", 1)[0];
    if (this.stopped || !source || this.loadedSources.has(source) || this.queuedSources.has(source) || this.activeLoads.has(source)) {
      return false;
    }
    const numeric = Number(this.failedAt.get(source) || 0);
    if (numeric && this.now() - numeric < this.retryDelay) {
      return false;
    }
    for (const failedSource of this.failedAt.keys()) {
      if (failedSource !== source && failedSource.split("?", 1)[0] === key) {
        this.failedAt.delete(failedSource);
      }
    }
    const existingIndex = this.queue.findIndex(item => item.key === key);
    if (existingIndex >= 0) {
      this.queuedSources.delete(this.queue[existingIndex].source);
      this.queue[existingIndex] = {
        key,
        source
      };
    } else {
      this.queue.push({
        key,
        source
      });
    }
    this.queuedSources.add(source);
    this.drain();
    return true;
  }
  drain() {
    if (!this.stopped) {
      while (this.activeLoads.size < this.maxConcurrent && this.queue.length) {
        const {
          key,
          source
        } = this.queue.shift();
        this.queuedSources.delete(source);
        this.start(key, source);
      }
    }
  }
  start(key, source) {
    if (this.stopped || !source) {
      return;
    }
    const image = this.createImage();
    let settled = false;
    const finish = success => {
      if (!settled) {
        settled = true;
        image.removeEventListener?.("load", onLoad);
        image.removeEventListener?.("error", onError);
        this.activeLoads.delete(source);
        if (success) {
          const previousSource = this.loadedSourceByKey.get(key);
          if (previousSource && previousSource !== source) {
            this.loadedSources.delete(previousSource);
          }
          this.loadedSourceByKey.set(key, source);
          this.loadedSources.add(source);
          this.failedAt.delete(source);
        } else {
          this.failedAt.set(source, this.now());
        }
        this.drain();
      }
    };
    const onLoad = () => finish(true);
    const onError = () => finish(false);
    image.decoding = "async";
    image.fetchPriority = "low";
    image.addEventListener?.("load", onLoad, {
      once: true
    });
    image.addEventListener?.("error", onError, {
      once: true
    });
    this.activeLoads.set(source, {
      image,
      cancel: () => finish(false)
    });
    image.src = source;
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(onLoad);
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
    for (const {
      image,
      cancel: cancelLoad
    } of [...this.activeLoads.values()]) {
      image.removeAttribute?.("src");
      cancelLoad();
    }
    this.activeLoads.clear();
    this.loadedSources.clear();
    this.loadedSourceByKey.clear();
    this.failedAt.clear();
  }
}
export function historyRequestStillRelevant(request, current) {
  if (request.documentGeneration !== current.documentGeneration) {
    return false;
  } else if (request.shared || request.pagePath !== null && request.pagePath === current.pagePath) {
    return true;
  } else {
    return request.popupId !== null && request.popupId === current.popupId && request.popupGeneration === current.popupGeneration;
  }
}
