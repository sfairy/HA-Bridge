const l = 512;
export const HISTORY_FETCH_TIMEOUT_MS = 12000;
export function historySeriesCacheKey(value, value2) {
  return String(value || "") + ":" + (Number(value2) || 0);
}
export function cacheHistorySeries(value, value2, value3) {
  if (!!Array.isArray(value3?.points) && value3.points.length !== 0) {
    for (
      value.set(historySeriesCacheKey(value2, value3.hours), value3);
      value.size > 512;
    ) {
      const value4 = value.keys().next().value;
      if (!value4) {
        break;
      }
      value.delete(value4);
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
  request(value, value2) {
    if (this.running) {
      if (value === this.currentKey) {
        this.pendingKey = null;
        this.pendingRun = null;
      } else if (value !== this.pendingKey) {
        this.pendingKey = value;
        this.pendingRun = value2;
      }
      return this.running;
    }
    this.pendingKey = value;
    this.pendingRun = value2;
    const fn = async () => {
      while (this.pendingRun) {
        const pendingRun = this.pendingRun;
        this.currentKey = this.pendingKey;
        this.pendingKey = null;
        this.pendingRun = null;
        await pendingRun();
      }
    };
    this.running = fn().finally(() => {
      this.running = null;
      this.currentKey = null;
    });
    return this.running;
  }
}
export class RuntimeStaticImageCache {
  constructor({
    maxConcurrent: value = 2,
    maxDecoded: value2 = 32,
    idleDelay: value3 = 120,
    loadTimeout: value4 = 15000,
    createImage: value5 = () => new Image(),
    setTimer: value6 = (setTimer, setTimer2) =>
      globalThis.setTimeout(setTimer, setTimer2),
    clearTimer: value7 = (clearTimer) => globalThis.clearTimeout(clearTimer),
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(value) || 1);
    this.maxDecoded = Math.max(1, Number(value2) || 1);
    this.idleDelay = Math.max(0, Number(value3) || 0);
    this.loadTimeout = Math.max(1000, Number(value4) || 15000);
    this.createImage = value5;
    this.setTimer = value6;
    this.clearTimer = value7;
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
  setSources(value = [], value2 = []) {
    if (!this.stopped) {
      this.desiredSources = new Set(
        (value || []).map((value3) => String(value3 || "")).filter(Boolean),
      );
      this.prioritySources = new Set(
        (value2 || [])
          .map((value3) => String(value3 || ""))
          .filter((value3) => this.desiredSources.has(value3)),
      );
      this.queue = this.queue.filter(({ source: value3 }) =>
        this.desiredSources.has(value3),
      );
      for (const [value3, { image: value4, cancel: fn }] of [
        ...this.activeLoads,
      ]) {
        if (!this.desiredSources.has(value3)) {
          value4.removeAttribute?.("src");
          fn();
        }
      }
      for (const value3 of [...this.loadedSources]) {
        if (!this.desiredSources.has(value3)) {
          this.loadedSources.delete(value3);
        }
      }
      for (const value3 of [...this.decodedImages.keys()]) {
        if (!this.desiredSources.has(value3)) {
          this.decodedImages.delete(value3);
        }
      }
      for (const value3 of this.prioritySources) {
        if (this.decodedImages.has(value3)) {
          const value4 = this.decodedImages.get(value3);
          this.decodedImages.delete(value3);
          this.decodedImages.set(value3, value4);
        } else {
          this.enqueue(value3, {
            active: true,
          });
        }
      }
      for (const value3 of this.desiredSources) {
        this.enqueue(value3);
      }
      this.trimDecodedImages();
    }
  }
  enqueue(value, { active: value2 = false } = {}) {
    const source = String(value || "");
    if (
      this.stopped ||
      !source ||
      !this.desiredSources.has(source) ||
      this.decodedImages.has(source) ||
      this.activeLoads.has(source) ||
      (this.loadedSources.has(source) && !value2)
    ) {
      return false;
    }
    const value3 = this.queue.find((value4) => value4.source === source);
    if (value3) {
      value3.active = value3.active || !!value2;
      this.schedule(value3.active ? 0 : this.idleDelay);
      return false;
    } else {
      this.queue.push({
        source: source,
        active: !!value2,
        sequence: this.sequence++,
      });
      this.schedule(value2 ? 0 : this.idleDelay);
      return true;
    }
  }
  schedule(value = 0) {
    if (this.stopped) {
      return;
    }
    const count = Math.max(0, Number(value) || 0);
    const value2 = Date.now() + count;
    if (this.timer === null || !(value2 >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = value2;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, count);
    }
  }
  drain() {
    if (!this.stopped) {
      for (
        this.queue.sort(
          (value, value2) =>
            Number(value2.active) - Number(value.active) ||
            value.sequence - value2.sequence,
        );
        this.activeLoads.size < this.maxConcurrent && this.queue.length;
      ) {
        const value = this.queue.shift();
        if (
          !!this.desiredSources.has(value.source) &&
          !this.decodedImages.has(value.source)
        ) {
          this.start(value);
        }
      }
    }
  }
  start({ source: value, active: value2 }) {
    if (this.stopped || !value) {
      return;
    }
    const image = this.createImage();
    let value3 = false;
    let value4 = false;
    let value5 = null;
    const fn = (value8) => {
      if (!value3) {
        value3 = true;
        if (value5 !== null) {
          this.clearTimer(value5);
        }
        image.removeEventListener?.("load", value6);
        image.removeEventListener?.("error", value7);
        this.activeLoads.delete(value);
        if (value8 && this.desiredSources.has(value)) {
          this.loadedSources.add(value);
          this.decodedImages.delete(value);
          this.decodedImages.set(value, image);
          this.trimDecodedImages();
        }
        this.drain();
      }
    };
    const value6 = () => {
      if (value4) {
        return;
      }
      value4 = true;
      let value8 = null;
      try {
        value8 = typeof image.decode == "function" ? image.decode() : null;
      } catch {
        value8 = null;
      }
      if (value8?.then) {
        Promise.resolve(value8)
          .catch(() => {})
          .finally(() => fn(true));
      } else {
        fn(true);
      }
    };
    const value7 = () => fn(false);
    image.decoding = "async";
    image.fetchPriority = value2 ? "high" : "low";
    image.addEventListener?.("load", value6, {
      once: true,
    });
    image.addEventListener?.("error", value7, {
      once: true,
    });
    this.activeLoads.set(value, {
      image: image,
      cancel: () => fn(false),
    });
    image.src = value;
    value5 = this.setTimer(() => {
      image.removeAttribute?.("src");
      fn(false);
    }, this.loadTimeout);
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(value6);
    }
  }
  trimDecodedImages() {
    while (this.decodedImages.size > this.maxDecoded) {
      const value =
        [...this.decodedImages.keys()].find(
          (value2) => !this.prioritySources.has(value2),
        ) || this.decodedImages.keys().next().value;
      if (!value) {
        break;
      }
      this.decodedImages.delete(value);
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
    for (const { image: value, cancel: fn } of [...this.activeLoads.values()]) {
      value.removeAttribute?.("src");
      fn();
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
    maxConcurrent: value = 4,
    idleDelay: value2 = 160,
    loadTimeout: value3 = 15000,
    setTimer: value4 = (setTimer, setTimer2) =>
      globalThis.setTimeout(setTimer, setTimer2),
    clearTimer: value5 = (clearTimer) => globalThis.clearTimeout(clearTimer),
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(value) || 1);
    this.idleDelay = Math.max(0, Number(value2) || 0);
    this.loadTimeout = Math.max(1000, Number(value3) || 15000);
    this.setTimer = value4;
    this.clearTimer = value5;
    this.queue = [];
    this.inFlight = 0;
    this.sequence = 0;
    this.activeLoads = new Map();
    this.timer = null;
    this.timerDueAt = 0;
    this.loadedSources = new Set();
    this.stopped = false;
  }
  enqueue(image, value, { active: value2 = false } = {}) {
    const source = String(value || "");
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
    const value3 = this.queue.find(
      (value4) => value4.image === image && value4.source === source,
    );
    if (value3) {
      value3.active = value3.active || !!value2;
    } else {
      this.queue.push({
        image: image,
        source: source,
        active: !!value2,
        sequence: this.sequence++,
      });
    }
    if (value2) {
      this.drain(true);
    } else {
      this.schedule(this.idleDelay);
    }
  }
  schedule(value = 0) {
    if (this.stopped) {
      return;
    }
    const count = Math.max(0, Number(value) || 0);
    const value2 = Date.now() + count;
    if (this.timer === null || !(value2 >= this.timerDueAt)) {
      if (this.timer !== null) {
        this.clearTimer(this.timer);
      }
      this.timerDueAt = value2;
      this.timer = this.setTimer(() => {
        this.timer = null;
        this.timerDueAt = 0;
        this.drain();
      }, count);
    }
  }
  drain(value = false) {
    if (!this.stopped) {
      for (
        this.queue.sort(
          (value2, value3) =>
            Number(value3.active) - Number(value2.active) ||
            value2.sequence - value3.sequence,
        );
        this.inFlight < this.maxConcurrent;
      ) {
        const value2 = this.queue.findIndex(
          ({ image: value4, source: value5, active: value6 }) =>
            value4 &&
            value4.dataset?.effectPendingSource === value5 &&
            !value4.dataset?.effectLoadingSource &&
            (!value || value6) &&
            (value4.isConnected === undefined || value4.isConnected),
        );
        if (value2 < 0) {
          break;
        }
        const [value3] = this.queue.splice(value2, 1);
        this.start(value3);
      }
    }
  }
  start({ image: value, source: value2 }) {
    if (
      this.stopped ||
      !value ||
      value.dataset?.effectPendingSource !== value2
    ) {
      return;
    }
    this.inFlight += 1;
    value.dataset.effectLoadingSource = value2;
    let value3 = false;
    let value4 = null;
    const fn = (value7) => {
      if (!value3) {
        value3 = true;
        if (value4 !== null) {
          this.clearTimer(value4);
        }
        value.removeEventListener?.("load", value5);
        value.removeEventListener?.("error", value6);
        this.activeLoads.delete(value);
        if (value.dataset?.effectLoadingSource === value2) {
          delete value.dataset.effectLoadingSource;
        }
        if (value7 && value.dataset?.effectPendingSource === value2) {
          value.dataset.effectLoadedSource = value2;
          delete value.dataset.effectPendingSource;
          this.loadedSources.add(value2);
        }
        this.inFlight = Math.max(0, this.inFlight - 1);
        this.drain();
      }
    };
    const value5 = () => fn(true);
    const value6 = () => fn(false);
    value.addEventListener?.("load", value5, {
      once: true,
    });
    value.addEventListener?.("error", value6, {
      once: true,
    });
    this.activeLoads.set(value, () => fn(false));
    value.src = value2;
    value4 = this.setTimer(() => {
      value.removeAttribute?.("src");
      fn(false);
    }, this.loadTimeout);
    if (value.complete && Number(value.naturalWidth || 0) > 0) {
      Promise.resolve().then(value5);
    }
  }
  promote(value) {
    const value2 =
      value?.dataset?.effectPendingSource || value?.dataset?.effectSource || "";
    if (value2) {
      this.enqueue(value, value2, {
        active: true,
      });
    }
  }
  pruneDisconnected() {
    this.queue = this.queue.filter(
      ({ image: value, source: value2 }) =>
        value &&
        value.dataset?.effectPendingSource === value2 &&
        (value.isConnected === undefined || value.isConnected),
    );
    for (const [value, fn] of [...this.activeLoads]) {
      if (value.isConnected === false) {
        fn();
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
    for (const fn of [...this.activeLoads.values()]) {
      fn();
    }
    this.activeLoads.clear();
    this.inFlight = 0;
    this.loadedSources.clear();
  }
}
export class RuntimeVacuumMapImagePreloader {
  constructor({
    maxConcurrent: value = 1,
    retryDelay: value2 = 15000,
    createImage: value3 = () => new Image(),
    now: value4 = () => Date.now(),
  } = {}) {
    this.maxConcurrent = Math.max(1, Number(value) || 1);
    this.retryDelay = Math.max(1000, Number(value2) || 15000);
    this.createImage = value3;
    this.now = value4;
    this.queue = [];
    this.queuedSources = new Set();
    this.loadedSources = new Set();
    this.loadedSourceByKey = new Map();
    this.failedAt = new Map();
    this.activeLoads = new Map();
    this.stopped = false;
  }
  enqueue(value) {
    const source = String(value || "");
    const key = source.split("?", 1)[0];
    if (
      this.stopped ||
      !source ||
      this.loadedSources.has(source) ||
      this.queuedSources.has(source) ||
      this.activeLoads.has(source)
    ) {
      return false;
    }
    const numeric = Number(this.failedAt.get(source) || 0);
    if (numeric && this.now() - numeric < this.retryDelay) {
      return false;
    }
    for (const value3 of this.failedAt.keys()) {
      if (value3 !== source && value3.split("?", 1)[0] === key) {
        this.failedAt.delete(value3);
      }
    }
    const value2 = this.queue.findIndex((value3) => value3.key === key);
    if (value2 >= 0) {
      this.queuedSources.delete(this.queue[value2].source);
      this.queue[value2] = {
        key: key,
        source: source,
      };
    } else {
      this.queue.push({
        key: key,
        source: source,
      });
    }
    this.queuedSources.add(source);
    this.drain();
    return true;
  }
  drain() {
    if (!this.stopped) {
      while (this.activeLoads.size < this.maxConcurrent && this.queue.length) {
        const { key: value, source: value2 } = this.queue.shift();
        this.queuedSources.delete(value2);
        this.start(value, value2);
      }
    }
  }
  start(value, value2) {
    if (this.stopped || !value2) {
      return;
    }
    const image = this.createImage();
    let value3 = false;
    const fn = (value6) => {
      if (!value3) {
        value3 = true;
        image.removeEventListener?.("load", value4);
        image.removeEventListener?.("error", value5);
        this.activeLoads.delete(value2);
        if (value6) {
          const value7 = this.loadedSourceByKey.get(value);
          if (value7 && value7 !== value2) {
            this.loadedSources.delete(value7);
          }
          this.loadedSourceByKey.set(value, value2);
          this.loadedSources.add(value2);
          this.failedAt.delete(value2);
        } else {
          this.failedAt.set(value2, this.now());
        }
        this.drain();
      }
    };
    const value4 = () => fn(true);
    const value5 = () => fn(false);
    image.decoding = "async";
    image.fetchPriority = "low";
    image.addEventListener?.("load", value4, {
      once: true,
    });
    image.addEventListener?.("error", value5, {
      once: true,
    });
    this.activeLoads.set(value2, {
      image: image,
      cancel: () => fn(false),
    });
    image.src = value2;
    if (image.complete && Number(image.naturalWidth || 0) > 0) {
      Promise.resolve().then(value4);
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
    for (const { image: value, cancel: fn } of [...this.activeLoads.values()]) {
      value.removeAttribute?.("src");
      fn();
    }
    this.activeLoads.clear();
    this.loadedSources.clear();
    this.loadedSourceByKey.clear();
    this.failedAt.clear();
  }
}
export function historyRequestStillRelevant(value, value2) {
  if (value.documentGeneration !== value2.documentGeneration) {
    return false;
  } else if (
    value.shared ||
    (value.pagePath !== null && value.pagePath === value2.pagePath)
  ) {
    return true;
  } else {
    return (
      value.popupId !== null &&
      value.popupId === value2.popupId &&
      value.popupGeneration === value2.popupGeneration
    );
  }
}
