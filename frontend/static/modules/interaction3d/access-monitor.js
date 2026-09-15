export function createAccessMonitor({
  requestGrant: requestGrant,
  now: now = () => performance.now(),
  setTimer: setTimer = setTimeout,
  clearTimer: clearTimer = clearTimeout
}) {
  const subscribers = new Set();
  let epoch = 0;
  let refreshTimerId;
  let expireTimerId;
  const pendingState = () => ({
    allowed: false,
    status: "checking",
    message: "正在验证 3D 交互授权…"
  });
  let state = pendingState();
  let isSuspended = false;
  const publishState = nextState => {
    state = nextState;
    for (const listener of subscribers) {
      listener(state);
    }
  };
  function stopTimers() {
    epoch += 1;
    clearTimer(refreshTimerId);
    clearTimer(expireTimerId);
  }
  async function refreshGrant() {
    if (!subscribers.size || isSuspended) {
      return;
    }
    const requestEpoch = ++epoch;
    const startedAt = now();
    try {
      const grant = await requestGrant();
      if (requestEpoch !== epoch || !subscribers.size || isSuspended) {
        return;
      }
      const lifetimeMs = Math.min(15000, Number(grant?.validForSeconds) * 1000);
      if (grant?.allowed !== true || !Number.isFinite(lifetimeMs) || lifetimeMs <= 0) {
        throw Object.assign(new Error("invalid grant"), {
          status: 403
        });
      }
      const remainingMs = lifetimeMs - (now() - startedAt);
      if (remainingMs <= 0) {
        throw new Error("grant response arrived too late");
      }
      clearTimer(expireTimerId);
      expireTimerId = setTimer(() => {
        publishState({
          allowed: false,
          status: "checking",
          message: "正在重新验证 3D 交互授权…"
        });
      }, remainingMs);
      publishState({
        allowed: true,
        status: "allowed",
        message: "",
        deadline: now() + remainingMs
      });
      refreshTimerId = setTimer(refreshGrant, Math.min(5000, Math.max(100, remainingMs / 2)));
    } catch (error) {
      if (requestEpoch !== epoch || !subscribers.size || isSuspended) {
        return;
      }
      clearTimer(expireTimerId);
      publishState(
        error?.status === 403
          ? {
              allowed: false,
              status: "denied",
              message: "3D 交互授权不可用，请在授权信息中查看。"
            }
          : {
              allowed: false,
              status: "unavailable",
              message:
                error?.status === 401
                  ? "登录状态已失效，请重新登录。"
                  : "连接暂时中断，正在重新验证…"
            }
      );
      refreshTimerId = setTimer(refreshGrant, 5000);
    }
  }
  return {
    subscribe(onStateChange) {
      subscribers.add(onStateChange);
      onStateChange(state);
      if (subscribers.size === 1) {
        refreshGrant();
      }
      return () => {
        subscribers.delete(onStateChange);
        if (!subscribers.size) {
          stopTimers();
          state = pendingState();
        }
      };
    },
    suspend() {
      isSuspended = true;
      stopTimers();
      publishState({
        allowed: false,
        status: "suspended",
        message: "3D 交互已暂停，返回页面后重新验证授权。"
      });
    },
    resume() {
      isSuspended = false;
      stopTimers();
      publishState(pendingState());
      refreshGrant();
    }
  };
}
