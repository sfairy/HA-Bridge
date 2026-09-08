export function createLightStream({
  onStates = () => {},
  createSocket = (url) => new window.WebSocket(url),
  socketURL = () => {
    const url = new URL("/api/v1/ws/runtime", location.origin);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return url.href;
  },
  setTimer = (callback, delay) => setTimeout(callback, delay),
  clearTimer = (timerId) => clearTimeout(timerId),
} = {}) {
  let entityIds = [];
  let entityIdSet = new Set();
  let stateByEntityId = new Map();
  let active = false;
  let disposed = false;
  let hasSnapshot = false;
  let socket = null;
  let removeSocketListeners = null;
  let connectionGeneration = 0;
  let reconnectAttempt = 0;
  let reconnectTimer = null;
  let idleTimer = null;
  const unavailableState = (entityId) => ({
    entityId: entityId,
    state: "unavailable",
    available: false,
    attributes: {},
  });
  const emitStates = () =>
    onStates(
      hasSnapshot
        ? Object.fromEntries(
            entityIds.map((entityId) => [
              entityId,
              structuredClone(
                stateByEntityId.get(entityId) || unavailableState(entityId),
              ),
            ]),
          )
        : {},
    );
  function clearStates() {
    stateByEntityId = new Map();
    hasSnapshot = false;
    emitStates();
  }
  function clearTimers() {
    if (reconnectTimer !== null) {
      clearTimer(reconnectTimer);
    }
    if (idleTimer !== null) {
      clearTimer(idleTimer);
    }
    reconnectTimer = idleTimer = null;
  }
  function closeSocket() {
    connectionGeneration += 1;
    clearTimers();
    const previousSocket = socket;
    socket = null;
    removeSocketListeners?.();
    removeSocketListeners = null;
    try {
      previousSocket?.close();
    } catch {}
  }
  function scheduleReconnect() {
    if (disposed || !active || !entityIds.length || reconnectTimer !== null) {
      return;
    }
    const delay = Math.min(15000, 2 ** Math.min(reconnectAttempt++, 5) * 500);
    reconnectTimer = setTimer(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }
  function connect() {
    if (disposed || !active || !entityIds.length || socket) {
      return;
    }
    const generation = ++connectionGeneration;
    let nextSocket;
    try {
      nextSocket = createSocket(
        typeof socketURL == "function" ? socketURL() : socketURL,
      );
    } catch {
      clearStates();
      scheduleReconnect();
      return;
    }
    socket = nextSocket;
    const isCurrent = () =>
      !disposed && active && generation === connectionGeneration && socket === nextSocket;
    const fail = (closeCode = 0) => {
      if (isCurrent()) {
        closeSocket();
        clearStates();
        if (![4400, 4401, 4403].includes(closeCode)) {
          scheduleReconnect();
        }
      }
    };
    function armIdleTimeout(delay) {
      if (idleTimer !== null) {
        clearTimer(idleTimer);
      }
      idleTimer = setTimer(() => fail(), delay);
    }
    const handlers = {
      open() {
        if (isCurrent()) {
          try {
            nextSocket.send(
              JSON.stringify({
                type: "subscribe",
                entityIds: entityIds,
              }),
            );
          } catch {
            fail();
          }
        }
      },
      message(event) {
        if (!isCurrent()) {
          return;
        }
        let message;
        try {
          message = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!!message && typeof message == "object") {
          if (message.type === "resync_required") {
            closeSocket();
            clearStates();
            connect();
            return;
          }
          if (message.type === "snapshot" && Array.isArray(message.states)) {
            const nextStates = new Map();
            for (const state of message.states) {
              if (
                entityIdSet.has(state?.entityId) &&
                typeof state.state == "string"
              ) {
                nextStates.set(state.entityId, structuredClone(state));
              }
            }
            stateByEntityId = nextStates;
            hasSnapshot = true;
            reconnectAttempt = 0;
            armIdleTimeout(65000);
            emitStates();
          } else if (
            hasSnapshot &&
            message.type === "state_changed" &&
            entityIdSet.has(message.entityId) &&
            typeof message.state == "string"
          ) {
            stateByEntityId.set(message.entityId, structuredClone(message));
            armIdleTimeout(65000);
            emitStates();
          } else if (
            hasSnapshot &&
            message.type === "state_removed" &&
            entityIdSet.has(message.entityId)
          ) {
            stateByEntityId.delete(message.entityId);
            armIdleTimeout(65000);
            emitStates();
          } else if (hasSnapshot && message.type === "ping") {
            armIdleTimeout(65000);
          }
        }
      },
      close(event) {
        fail(event.code);
      },
      error() {
        fail();
      },
    };
    for (const [eventName, handler] of Object.entries(handlers)) {
      nextSocket.addEventListener(eventName, handler);
    }
    removeSocketListeners = () => {
      for (const [eventName, handler] of Object.entries(handlers)) {
        nextSocket.removeEventListener(eventName, handler);
      }
    };
    armIdleTimeout(12000);
  }
  return {
    configure(nextEntityIds = []) {
      if (disposed) {
        return;
      }
      const normalized = [
        ...new Set(
          nextEntityIds.filter(
            (entityId) =>
              typeof entityId == "string" &&
              /^(light|switch)\.[a-z0-9_]+$/.test(entityId),
          ),
        ),
      ].sort();
      if (
        normalized.length !== entityIds.length ||
        !normalized.every((entityId, index) => entityId === entityIds[index])
      ) {
        closeSocket();
        entityIds = normalized;
        entityIdSet = new Set(entityIds);
        reconnectAttempt = 0;
        clearStates();
        connect();
      }
    },
    setActive(nextActive) {
      if (!disposed && active !== (nextActive === true)) {
        active = nextActive === true;
        reconnectAttempt = 0;
        if (active) {
          connect();
        } else {
          closeSocket();
          clearStates();
        }
      }
    },
    dispose() {
      if (!disposed) {
        disposed = true;
        active = false;
        closeSocket();
        entityIds = [];
        entityIdSet.clear();
        stateByEntityId.clear();
      }
    },
  };
}
