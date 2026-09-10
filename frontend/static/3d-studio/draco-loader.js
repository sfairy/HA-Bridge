import { DRACOLoader } from "/bridge-static/vendor/three/0.182.0/DRACOLoader.js?v=20260903-three-0182-draco-module-path-v1";
function workerStartError(error) {
  const message = String(error?.message || "").trim();
  return new Error(message || "Draco 同源解码 Worker 启动失败");
}
export class SameOriginDRACOLoader extends DRACOLoader {
  constructor(sameOriginWorkerUrl, manager) {
    super(manager);
    this.sameOriginWorkerUrl = sameOriginWorkerUrl;
  }
  _initDecoder() {
    if (this.sameOriginWorkerUrl) {
      this.decoderPending ||= Promise.resolve();
      return this.decoderPending;
    }
    return super._initDecoder();
  }
  _getWorker(taskCostId, taskCost) {
    if (!this.sameOriginWorkerUrl) {
      return super._getWorker(taskCostId, taskCost);
    }
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        let worker;
        try {
          worker = new Worker(this.sameOriginWorkerUrl, {
            name: "ha-bridge-draco"
          });
        } catch (error) {
          throw workerStartError(error);
        }
        worker._callbacks = {};
        worker._taskCosts = {};
        worker._taskLoad = 0;
        worker._fatalError = null;
        worker.onmessage = event => {
          const data = event.data;
          const callback = worker._callbacks[data?.id];
          if (data?.type === "decode") {
            callback?.resolve(data);
          } else if (data?.type === "error") {
            callback?.reject(new Error(data.error || "Draco 模型解码失败"));
          }
        };
        worker.onerror = event => {
          const error = workerStartError(event);
          worker._fatalError = error;
          for (const callback of Object.values(worker._callbacks)) {
            callback.reject(error);
          }
          event.preventDefault?.();
        };
        worker.postMessage({
          type: "init",
          decoderPath: this.decoderPath,
          decoderConfig: this.decoderConfig
        });
        this.workerPool.push(worker);
      } else {
        this.workerPool.sort((a, b) => a._taskLoad > b._taskLoad ? -1 : 1);
      }
      const worker = this.workerPool[this.workerPool.length - 1];
      if (worker._fatalError) {
        throw worker._fatalError;
      }
      worker._taskCosts[taskCostId] = taskCost;
      worker._taskLoad += taskCost;
      return worker;
    });
  }
}
