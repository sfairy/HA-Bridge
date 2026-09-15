export function createLightStream({
  onStates: onStates = () => {},
  onPatch: onPatch = null,
  createSocket: createSocket = socketUrl => new window.WebSocket(socketUrl),
  socketURL: resolveSocketUrl = () => {
    const endpointUrl = new URL("/api/v1/ws/runtime", location.origin);
    endpointUrl.protocol = endpointUrl.protocol === "https:" ? "wss:" : "ws:";
    return endpointUrl.href;
  },
  setTimer: setTimer = (timerCallback, timerDelayMs) => setTimeout(timerCallback, timerDelayMs),
  clearTimer: clearTimer = pendingTimerId => clearTimeout(pendingTimerId)
} = {}) {
  let subscribedEntityIds = [];
  let subscribedEntityIdSet = new Set();
  let statesByEntityId = new Map();
  let isStreamActive = false;
  let isDisposed = false;
  let hasSnapshot = false;
  let activeSocket = null;
  let removeSocketListeners = null;
  let connectionGeneration = 0;
  let reconnectAttempt = 0;
  let reconnectTimerId = null;
  let heartbeatTimerId = null;
  const unavailableState = unavailableEntityId => ({
    entityId: unavailableEntityId,
    state: "unavailable",
    available: false,
    attributes: {}
  });
  const emitStates = () =>
    onStates(
      hasSnapshot
        ? Object.fromEntries(
            subscribedEntityIds.map(clonedEntityId => [
              clonedEntityId,
              structuredClone(
                statesByEntityId.get(clonedEntityId) || unavailableState(clonedEntityId)
              )
            ])
          )
        : {}
    );
  const emitPatch = patchedEntityId =>
    typeof onPatch == "function"
      ? onPatch({
          [patchedEntityId]: structuredClone(
            statesByEntityId.get(patchedEntityId) || unavailableState(patchedEntityId)
          )
        })
      : emitStates();
  function resetStates() {
    statesByEntityId = new Map();
    hasSnapshot = false;
    emitStates();
  }
  function clearTimers() {
    if (reconnectTimerId !== null) {
      clearTimer(reconnectTimerId);
    }
    if (heartbeatTimerId !== null) {
      clearTimer(heartbeatTimerId);
    }
    reconnectTimerId = heartbeatTimerId = null;
  }
  function closeActiveSocket() {
    connectionGeneration += 1;
    clearTimers();
    const socketToClose = activeSocket;
    activeSocket = null;
    removeSocketListeners?.();
    removeSocketListeners = null;
    try {
      socketToClose?.close();
    } catch {}
  }
  function scheduleReconnect() {
    if (isDisposed || !isStreamActive || !subscribedEntityIds.length || reconnectTimerId !== null) {
      return;
    }
    const reconnectDelayMs = Math.min(15000, 2 ** Math.min(reconnectAttempt++, 5) * 500);
    reconnectTimerId = setTimer(() => {
      reconnectTimerId = null;
      openSocket();
    }, reconnectDelayMs);
  }
  function openSocket() {
    if (isDisposed || !isStreamActive || !subscribedEntityIds.length || activeSocket) {
      return;
    }
    const socketGeneration = ++connectionGeneration;
    let nextSocket;
    try {
      nextSocket = createSocket(
        typeof resolveSocketUrl == "function" ? resolveSocketUrl() : resolveSocketUrl
      );
    } catch {
      resetStates();
      scheduleReconnect();
      return;
    }
    activeSocket = nextSocket;
    const isCurrentSocket = () =>
      !isDisposed &&
      isStreamActive &&
      socketGeneration === connectionGeneration &&
      activeSocket === nextSocket;
    const handleSocketFailure = (closeCode = 0) => {
      if (isCurrentSocket()) {
        closeActiveSocket();
        resetStates();
        if (![4400, 4401, 4403].includes(closeCode)) {
          scheduleReconnect();
        }
      }
    };
    function scheduleHeartbeatTimeout(heartbeatTimeoutMs) {
      if (heartbeatTimerId !== null) {
        clearTimer(heartbeatTimerId);
      }
      heartbeatTimerId = setTimer(() => handleSocketFailure(), heartbeatTimeoutMs);
    }
    const socketHandlers = {
      open() {
        if (isCurrentSocket()) {
          try {
            nextSocket.send(
              JSON.stringify({
                type: "subscribe",
                entityIds: subscribedEntityIds
              })
            );
          } catch {
            handleSocketFailure();
          }
        }
      },
      message(messageEvent) {
        if (!isCurrentSocket()) {
          return;
        }
        let messagePayload;
        try {
          messagePayload = JSON.parse(messageEvent.data);
        } catch {
          return;
        }
        if (!!messagePayload && typeof messagePayload == "object") {
          if (messagePayload.type === "resync_required") {
            closeActiveSocket();
            resetStates();
            openSocket();
            return;
          }
          if (messagePayload.type === "snapshot" && Array.isArray(messagePayload.states)) {
            const snapshotStates = new Map();
            for (const snapshotState of messagePayload.states) {
              if (
                subscribedEntityIdSet.has(snapshotState?.entityId) &&
                typeof snapshotState.state == "string"
              ) {
                snapshotStates.set(snapshotState.entityId, structuredClone(snapshotState));
              }
            }
            statesByEntityId = snapshotStates;
            hasSnapshot = true;
            reconnectAttempt = 0;
            scheduleHeartbeatTimeout(65000);
            emitStates();
          } else if (
            hasSnapshot &&
            messagePayload.type === "state_changed" &&
            subscribedEntityIdSet.has(messagePayload.entityId) &&
            typeof messagePayload.state == "string"
          ) {
            statesByEntityId.set(messagePayload.entityId, structuredClone(messagePayload));
            scheduleHeartbeatTimeout(65000);
            emitPatch(messagePayload.entityId);
          } else if (
            hasSnapshot &&
            messagePayload.type === "state_removed" &&
            subscribedEntityIdSet.has(messagePayload.entityId)
          ) {
            statesByEntityId.delete(messagePayload.entityId);
            scheduleHeartbeatTimeout(65000);
            emitPatch(messagePayload.entityId);
          } else if (hasSnapshot && messagePayload.type === "ping") {
            scheduleHeartbeatTimeout(65000);
          }
        }
      },
      close(closeEvent) {
        handleSocketFailure(closeEvent.code);
      },
      error() {
        handleSocketFailure();
      }
    };
    for (const [addedHandlerName, addedHandler] of Object.entries(socketHandlers)) {
      nextSocket.addEventListener(addedHandlerName, addedHandler);
    }
    removeSocketListeners = () => {
      for (const [removedHandlerName, removedHandler] of Object.entries(socketHandlers)) {
        nextSocket.removeEventListener(removedHandlerName, removedHandler);
      }
    };
    scheduleHeartbeatTimeout(12000);
  }
  return {
    configure(entityIds = [], { additionalEntityIds: additionalEntityIds = [] } = {}) {
      if (isDisposed) {
        return;
      }
      const additionalEntityIdSet = new Set(
        additionalEntityIds.filter(
          additionalCandidateId =>
            typeof additionalCandidateId == "string" &&
            /^[a-z_]+\.[a-z0-9_]+$/.test(additionalCandidateId)
        )
      );
      const nextSubscribedEntityIds = [
        ...new Set(
          entityIds.filter(
            candidateEntityId =>
              typeof candidateEntityId == "string" &&
              (additionalEntityIdSet.has(candidateEntityId) ||
                /^(light|switch|climate|cover|binary_sensor|event|input_boolean|sensor|media_player|vacuum|camera|image|script|button)\.[a-z0-9_]+$/.test(
                  candidateEntityId
                ))
          )
        )
      ].sort();
      if (
        nextSubscribedEntityIds.length !== subscribedEntityIds.length ||
        !nextSubscribedEntityIds.every(
          (sortedEntityId, entityIdIndex) => sortedEntityId === subscribedEntityIds[entityIdIndex]
        )
      ) {
        closeActiveSocket();
        subscribedEntityIds = nextSubscribedEntityIds;
        subscribedEntityIdSet = new Set(subscribedEntityIds);
        reconnectAttempt = 0;
        resetStates();
        openSocket();
      }
    },
    setActive(isActiveNext) {
      if (!isDisposed && isStreamActive !== (isActiveNext === true)) {
        isStreamActive = isActiveNext === true;
        reconnectAttempt = 0;
        if (isStreamActive) {
          openSocket();
        } else {
          closeActiveSocket();
          resetStates();
        }
      }
    },
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        isStreamActive = false;
        closeActiveSocket();
        subscribedEntityIds = [];
        subscribedEntityIdSet.clear();
        statesByEntityId.clear();
      }
    }
  };
}
