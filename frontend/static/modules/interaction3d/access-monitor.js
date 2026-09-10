export function createAccessMonitor({
  requestGrant,
  now = () => performance.now(),
  setTimer = setTimeout,
  clearTimer = clearTimeout
}) {
  const listeners = new Set();
  let requestGeneration = 0;
  let refreshTimer;
  let expireTimer;
  const checkingState = () => ({
    allowed: false,
    status: "checking",
    message: "正在验证 3D 交互授权…"
  });
  let state = checkingState();
  let suspended = false;
  const publish = next => {
    state = next;
    for (const listener of listeners) {
      listener(state);
    }
  };
  function clearTimers() {
    requestGeneration += 1;
    clearTimer(refreshTimer);
    clearTimer(expireTimer);
  }
  async function refresh() {
    if (!listeners.size || suspended) {
      return;
    }
    const generation = ++requestGeneration;
    const startedAt = now();
    try {
      const grant = await requestGrant();
      if (generation !== requestGeneration || !listeners.size || suspended) {
        return;
      }
      const validMs = Math.min(15000, Number(grant?.validForSeconds) * 1000);
      if (grant?.allowed !== true || !Number.isFinite(validMs) || validMs <= 0) {
        throw Object.assign(new Error("invalid grant"), {
          status: 403
        });
      }
      const remainingMs = validMs - (now() - startedAt);
      if (remainingMs <= 0) {
        throw new Error("grant response arrived too late");
      }
      clearTimer(expireTimer);
      expireTimer = setTimer(() => {
        publish({
          allowed: false,
          status: "checking",
          message: "正在重新验证 3D 交互授权…"
        });
      }, remainingMs);
      publish({
        allowed: true,
        status: "allowed",
        message: "",
        deadline: now() + remainingMs
      });
      refreshTimer = setTimer(refresh, Math.min(5000, Math.max(100, remainingMs / 2)));
    } catch (error) {
      if (generation !== requestGeneration || !listeners.size || suspended) {
        return;
      }
      clearTimer(expireTimer);
      publish(error?.status === 403 ? {
        allowed: false,
        status: "denied",
        message: "3D 交互授权不可用，请在授权信息中查看。"
      } : {
        allowed: false,
        status: "unavailable",
        message: error?.status === 401 ? "登录状态已失效，请重新登录。" : "连接暂时中断，正在重新验证…"
      });
      refreshTimer = setTimer(refresh, 5000);
    }
  }
  return {
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      if (listeners.size === 1) {
        refresh();
      }
      return () => {
        listeners.delete(listener);
        if (!listeners.size) {
          clearTimers();
          state = checkingState();
        }
      };
    },
    suspend() {
      suspended = true;
      clearTimers();
      publish({
        allowed: false,
        status: "suspended",
        message: "3D 交互已暂停，返回页面后重新验证授权。"
      });
    },
    resume() {
      suspended = false;
      clearTimers();
      publish(checkingState());
      refresh();
    }
  };
}
