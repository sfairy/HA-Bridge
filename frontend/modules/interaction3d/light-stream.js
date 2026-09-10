export function createLightStream({
  onStates = () => {},
  onPatch: createSocket = null,
  createSocket: arg7 = arg3 => new window.WebSocket(arg3),
  socketURL: arg8 = () => {
    const protocol = new URL("/api/v1/ws/runtime", location.origin);
    protocol.protocol = protocol.protocol === "https:" ? "wss:" : "ws:";
    return protocol.href;
  },
  setTimer: arg9 = (timerId, arg4) => setTimeout(timerId, arg4),
  clearTimer = arg5 => clearTimeout(arg5)
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
  const unavailableState = entityId => ({
    entityId,
    state: "unavailable",
    available: false,
    attributes: {}
  });
  const emitStates = () => onStates(hasSnapshot ? Object.fromEntries(entityIds.map(entityId => [entityId, structuredClone(stateByEntityId.get(entityId) || unavailableState(entityId))])) : {});
  const emitStates2 = arg6 => typeof createSocket == "function" ? createSocket({
    [arg6]: structuredClone(stateByEntityId.get(arg6) || unavailableState(arg6))
  }) : emitStates();
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
    reconnectTimer = arg9(() => {
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
      nextSocket = arg7(typeof arg8 == "function" ? arg8() : arg8);
    } catch {
      clearStates();
      scheduleReconnect();
      return;
    }
    socket = nextSocket;
    const isCurrent = () => !disposed && active && generation === connectionGeneration && socket === nextSocket;
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
      idleTimer = arg9(() => fail(), delay);
    }
    const handlers = {
      open() {
        if (isCurrent()) {
          try {
            nextSocket.send(JSON.stringify({
              type: "subscribe",
              entityIds
            }));
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
              if (entityIdSet.has(state?.entityId) && typeof state.state == "string") {
                nextStates.set(state.entityId, structuredClone(state));
              }
            }
            stateByEntityId = nextStates;
            hasSnapshot = true;
            reconnectAttempt = 0;
            armIdleTimeout(65000);
            emitStates();
          } else if (hasSnapshot && message.type === "state_changed" && entityIdSet.has(message.entityId) && typeof message.state == "string") {
            stateByEntityId.set(message.entityId, structuredClone(message));
            armIdleTimeout(65000);
            emitStates2(message.entityId);
          } else if (hasSnapshot && message.type === "state_removed" && entityIdSet.has(message.entityId)) {
            stateByEntityId.delete(message.entityId);
            armIdleTimeout(65000);
            emitStates2(message.entityId);
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
      }
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
    configure(nextEntityIds = [], {
      additionalEntityIds: filter = []
    } = {}) {
      if (disposed) {
        return;
      }
      const normalized = new Set(filter.filter(arg2 => typeof arg2 == "string" && /^[a-z_]+\.[a-z0-9_]+$/.test(arg2)));
      const normalized2 = [...new Set(nextEntityIds.filter(arg => typeof arg == "string" && (normalized.has(arg) || /^(light|switch|climate|cover|binary_sensor|event|input_boolean|sensor|media_player|vacuum|camera|image|script|button)\.[a-z0-9_]+$/.test(arg))))].sort();
      if (normalized2.length !== entityIds.length || !normalized2.every((entityId, index) => entityId === entityIds[index])) {
        closeSocket();
        entityIds = normalized2;
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
    }
  };
}
