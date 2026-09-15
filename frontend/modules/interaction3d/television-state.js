const readState = (states, entityId) =>
  states instanceof Map ? states.get(entityId) : states?.[entityId];
export function televisionArtwork(entityAttributes = {}) {
  return (
    [
      entityAttributes.entity_picture_local,
      entityAttributes.entity_picture,
      entityAttributes.media_image_url
    ].find(
      candidateUrl =>
        typeof candidateUrl == "string" &&
        /^\/api\/(?:media_player_proxy|image_proxy)\/[^\s]+$/.test(candidateUrl)
    ) || ""
  );
}
export function televisionState(item, stateSources = {}, nowMs = Date.now()) {
  const receivedState = readState(stateSources, item.entityId);
  const stateObject = receivedState?.newState || receivedState || {};
  const attributes = stateObject.attributes || {};
  const stateValue = String(stateObject.state || "unknown").toLowerCase();
  const mediaAvailable =
    !!item.entityId &&
    stateObject.available !== false &&
    !["unknown", "unavailable", ""].includes(stateValue);
  const mediaOn = mediaAvailable && !["off", "standby"].includes(stateValue);
  const powerControl = televisionPower(item, stateSources);
  const available = item.powerEntityId ? powerControl.available : mediaAvailable;
  const isOn = item.powerEntityId ? powerControl.on : mediaOn;
  const idle = isOn && (!mediaOn || ["on", "idle"].includes(stateValue));
  const toFiniteNumber = input =>
    input !== null && input !== "" && Number.isFinite(Number(input)) ? Number(input) : null;
  const duration = toFiniteNumber(attributes.media_duration);
  const reportedPosition = toFiniteNumber(attributes.media_position);
  const positionUpdatedAt = Date.parse(attributes.media_position_updated_at || "");
  const elapsedSeconds =
    isOn && stateValue === "playing" && Number.isFinite(positionUpdatedAt)
      ? Math.max(0, (nowMs - positionUpdatedAt) / 1000)
      : 0;
  let artworkUrl = isOn && !idle ? televisionArtwork(attributes) : "";
  if (artworkUrl) {
    const artworkSignature = JSON.stringify([
      attributes.media_content_id,
      attributes.media_title,
      attributes.media_series_title,
      attributes.media_season,
      attributes.media_episode,
      attributes.media_album_name,
      attributes.media_artist,
      attributes.app_name,
      attributes.source
    ]);
    let hash = 2166136261;
    for (let index = 0; index < artworkSignature.length; index++) {
      hash = Math.imul(hash ^ artworkSignature.charCodeAt(index), 16777619);
    }
    artworkUrl += (artworkUrl.includes("?") ? "&" : "?") + "hb_i3d=" + (hash >>> 0).toString(36);
  }
  return {
    state: stateValue,
    available: available,
    on: isOn,
    idle: idle,
    mediaAvailable: mediaAvailable,
    playing: isOn && mediaOn && stateValue === "playing",
    name: item.label || attributes.friendly_name || "电视",
    status:
      !item.entityId && !item.powerEntityId
        ? "尚未绑定媒体实体"
        : available
          ? !isOn && item.powerEntityId
            ? "电视已关闭"
            : isOn && !mediaOn
              ? "已开启"
              : {
                  playing: "播放中",
                  paused: "已暂停",
                  buffering: "缓冲中",
                  idle: "空闲",
                  on: "已开启",
                  off: "已关闭",
                  standby: "待机"
                }[stateValue] || stateValue
          : "设备不可用",
    title: idle
      ? "暂无播放内容"
      : String(
          attributes.media_title ||
            attributes.media_series_title ||
            attributes.app_name ||
            attributes.source ||
            "暂无播放内容"
        ),
    app: String(attributes.app_name || attributes.source || ""),
    artist: String(attributes.media_artist || ""),
    artwork: artworkUrl,
    duration: duration > 0 ? duration : null,
    position:
      reportedPosition !== null
        ? Math.min(
            duration > 0 ? duration : Infinity,
            Math.max(0, reportedPosition + elapsedSeconds)
          )
        : null,
    updated: stateObject.updatedAt || stateObject.last_updated || ""
  };
}
export function televisionTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "—";
  }
  const totalSeconds = Math.max(0, Math.floor(seconds));
  return Math.floor(totalSeconds / 60) + ":" + String(totalSeconds % 60).padStart(2, "0");
}
export function televisionPower(powerItem, powerStates = {}, desiredOn) {
  const powerEntityId = powerItem.powerEntityId || powerItem.entityId || "";
  const domain = powerEntityId.split(".")[0];
  const powerState = readState(powerStates, powerEntityId);
  const powerStateObject = powerState?.newState || powerState || {};
  const powerAvailable =
    !!powerEntityId &&
    powerStateObject.available !== false &&
    typeof powerStateObject.state == "string" &&
    !["unknown", "unavailable", ""].includes(powerStateObject.state);
  const powerOn = powerAvailable && !["off", "standby"].includes(powerStateObject.state);
  const turnOn = typeof desiredOn == "boolean" ? desiredOn : !powerOn;
  const service = turnOn ? "turn_on" : "turn_off";
  const supportedFeatures = Number(powerStateObject.attributes?.supported_features) || 0;
  const supported =
    domain === "switch" ||
    (domain === "media_player" && !!(supportedFeatures & (turnOn ? 128 : 256)));
  return {
    entityId: powerEntityId,
    domain: domain,
    on: powerOn,
    available: powerAvailable,
    supported: supported,
    service: service,
    reason: powerAvailable ? (supported ? "" : "此实体不支持开关机") : "电源状态不可用",
    command: {
      entityId: powerEntityId,
      domain: domain,
      service: service,
      data: {},
      deviceKind: "television"
    }
  };
}
export function televisionMediaControl(mediaItem, mediaStates, action) {
  const mediaState = readState(mediaStates, mediaItem.entityId);
  const mediaStateObject = mediaState?.newState || mediaState || {};
  const mediaPlayerState = televisionState(mediaItem, mediaStates);
  const mediaSupportedFeatures = Number(mediaStateObject.attributes?.supported_features) || 0;
  const mediaService =
    action === "previous"
      ? "media_previous_track"
      : action === "next"
        ? "media_next_track"
        : mediaPlayerState.playing
          ? "media_pause"
          : "media_play";
  const requiredFeature = {
    media_previous_track: 16,
    media_next_track: 32,
    media_pause: 1,
    media_play: 16384
  }[mediaService];
  return {
    enabled:
      mediaPlayerState.on &&
      mediaPlayerState.mediaAvailable &&
      !["off", "standby"].includes(mediaPlayerState.state) &&
      !!(mediaSupportedFeatures & requiredFeature),
    command: {
      domain: "media_player",
      entityId: mediaItem.entityId,
      service: mediaService,
      data: {},
      deviceKind: "television"
    }
  };
}
