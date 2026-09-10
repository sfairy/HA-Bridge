const lookupState = (states, entityId) => states instanceof Map ? states.get(entityId) : states?.[entityId];
export function televisionArtwork(attributes = {}) {
  return [attributes.entity_picture_local, attributes.entity_picture, attributes.media_image_url].find(url => typeof url == "string" && /^\/api\/(?:media_player_proxy|image_proxy)\/[^\s]+$/.test(url)) || "";
}
export function televisionState(binding, states = {}, nowMs = Date.now()) {
  const entry = lookupState(states, binding.entityId);
  const entity = entry?.newState || entry || {};
  const attributes = entity.attributes || {};
  const state = String(entity.state || "unknown").toLowerCase();
  const available = !!binding.entityId && entity.available !== false && !["unknown", "unavailable", ""].includes(state);
  const powerEntry = lookupState(states, binding.powerEntityId);
  const powerEntity = powerEntry?.newState || powerEntry || {};
  const powerOff = binding.powerEntityId && ["off", "standby"].includes(String(powerEntity.state || "").toLowerCase());
  const on = available && !powerOff && !["off", "standby"].includes(state);
  const idle = on && ["on", "idle"].includes(state);
  const toNumber = raw => raw !== null && raw !== "" && Number.isFinite(Number(raw)) ? Number(raw) : null;
  const duration = toNumber(attributes.media_duration);
  const position = toNumber(attributes.media_position);
  const positionUpdatedAt = Date.parse(attributes.media_position_updated_at || "");
  const elapsedSeconds = on && state === "playing" && Number.isFinite(positionUpdatedAt) ? Math.max(0, (nowMs - positionUpdatedAt) / 1000) : 0;
  let artwork = on && !idle ? televisionArtwork(attributes) : "";
  if (artwork) {
    const fingerprintSource = JSON.stringify([attributes.media_content_id, attributes.media_title, attributes.media_series_title, attributes.media_season, attributes.media_episode, attributes.media_album_name, attributes.media_artist, attributes.app_name, attributes.source]);
    let hash = 2166136261;
    for (let index = 0; index < fingerprintSource.length; index++) {
      hash = Math.imul(hash ^ fingerprintSource.charCodeAt(index), 16777619);
    }
    artwork += (artwork.includes("?") ? "&" : "?") + "hb_i3d=" + (hash >>> 0).toString(36);
  }
  return {
    state,
    available,
    on,
    idle,
    playing: on && state === "playing",
    name: binding.label || attributes.friendly_name || "电视",
    status: binding.entityId ? available ? powerOff ? "电视已关闭" : {
      playing: "播放中",
      paused: "已暂停",
      buffering: "缓冲中",
      idle: "空闲",
      on: "已开启",
      off: "已关闭",
      standby: "待机"
    }[state] || state : "设备不可用" : "尚未绑定媒体实体",
    title: idle ? "暂无播放内容" : String(attributes.media_title || attributes.media_series_title || attributes.app_name || attributes.source || "暂无播放内容"),
    app: String(attributes.app_name || attributes.source || ""),
    artist: String(attributes.media_artist || ""),
    artwork,
    duration: duration > 0 ? duration : null,
    position: position !== null ? Math.min(duration > 0 ? duration : Infinity, Math.max(0, position + elapsedSeconds)) : null,
    updated: entity.updatedAt || entity.last_updated || ""
  };
}
export function televisionTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "—";
  }
  const totalSeconds = Math.max(0, Math.floor(seconds));
  return Math.floor(totalSeconds / 60) + ":" + String(totalSeconds % 60).padStart(2, "0");
}
export function televisionPower(binding, states = {}, wantOn) {
  const entityId = binding.powerEntityId || binding.entityId || "";
  const domain = entityId.split(".")[0];
  const entry = lookupState(states, entityId);
  const entity = entry?.newState || entry || {};
  const available = !!entityId && entity.available !== false && typeof entity.state == "string" && !["unknown", "unavailable", ""].includes(entity.state);
  const on = available && !["off", "standby"].includes(entity.state);
  const turnOn = typeof wantOn == "boolean" ? wantOn : !on;
  const service = turnOn ? "turn_on" : "turn_off";
  const supportedFeatures = Number(entity.attributes?.supported_features) || 0;
  const supported = domain === "switch" || domain === "media_player" && !!(supportedFeatures & (turnOn ? 128 : 256));
  return {
    entityId,
    domain,
    on,
    available,
    supported,
    service,
    reason: available ? supported ? "" : "此实体不支持开关机" : "电源状态不可用",
    command: {
      entityId,
      domain,
      service,
      data: {},
      deviceKind: "television"
    }
  };
}
export function televisionMediaControl(binding, states, action) {
  const entry = lookupState(states, binding.entityId);
  const entity = entry?.newState || entry || {};
  const media = televisionState(binding, states);
  const supportedFeatures = Number(entity.attributes?.supported_features) || 0;
  const service = action === "previous" ? "media_previous_track" : action === "next" ? "media_next_track" : media.playing ? "media_pause" : "media_play";
  const featureBit = {
    media_previous_track: 16,
    media_next_track: 32,
    media_pause: 1,
    media_play: 16384
  }[service];
  return {
    enabled: media.on && !!(supportedFeatures & featureBit),
    command: {
      domain: "media_player",
      entityId: binding.entityId,
      service,
      data: {},
      deviceKind: "television"
    }
  };
}
