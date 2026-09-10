const y = (get, arg3) => get instanceof Map ? get.get(arg3) : get?.[arg3];
export function televisionArtwork(entity_picture_local = {}) {
  return [entity_picture_local.entity_picture_local, entity_picture_local.entity_picture, entity_picture_local.media_image_url].find(arg => typeof arg == "string" && /^\/api\/(?:media_player_proxy|image_proxy)\/[^\s]+$/.test(arg)) || "";
}
export function televisionState(entityId, arg4 = {}, arg5 = Date.now()) {
  const newState = y(arg4, entityId.entityId);
  const attributes = newState?.newState || newState || {};
  const app_name = attributes.attributes || {};
  const state = String(attributes.state || "unknown").toLowerCase();
  const available = !!entityId.entityId && attributes.available !== false && !["unknown", "unavailable", ""].includes(state);
  const newState2 = y(arg4, entityId.powerEntityId);
  const state2 = newState2?.newState || newState2 || {};
  const value3 = entityId.powerEntityId && ["off", "standby"].includes(String(state2.state || "").toLowerCase());
  const on = available && !value3 && !["off", "standby"].includes(state);
  const idle = on && ["on", "idle"].includes(state);
  const value4 = arg2 => arg2 !== null && arg2 !== "" && Number.isFinite(Number(arg2)) ? Number(arg2) : null;
  const value5 = value4(app_name.media_duration);
  const value6 = value4(app_name.media_position);
  const value7 = Date.parse(app_name.media_position_updated_at || "");
  const value8 = on && state === "playing" && Number.isFinite(value7) ? Math.max(0, (arg5 - value7) / 1000) : 0;
  let includes = on && !idle ? televisionArtwork(app_name) : "";
  if (includes) {
    const length = JSON.stringify([app_name.media_content_id, app_name.media_title, app_name.media_series_title, app_name.media_season, app_name.media_episode, app_name.media_album_name, app_name.media_artist, app_name.app_name, app_name.source]);
    let value2 = 2166136261;
    for (let value = 0; value < length.length; value++) {
      value2 = Math.imul(value2 ^ length.charCodeAt(value), 16777619);
    }
    includes += (includes.includes("?") ? "&" : "?") + "hb_i3d=" + (value2 >>> 0).toString(36);
  }
  return {
    state,
    available,
    on,
    idle,
    playing: on && state === "playing",
    name: entityId.label || app_name.friendly_name || "电视",
    status: entityId.entityId ? available ? value3 ? "电视已关闭" : {
      playing: "播放中",
      paused: "已暂停",
      buffering: "缓冲中",
      idle: "空闲",
      on: "已开启",
      off: "已关闭",
      standby: "待机"
    }[state] || state : "设备不可用" : "尚未绑定媒体实体",
    title: idle ? "暂无播放内容" : String(app_name.media_title || app_name.media_series_title || app_name.app_name || app_name.source || "暂无播放内容"),
    app: String(app_name.app_name || app_name.source || ""),
    artist: String(app_name.media_artist || ""),
    artwork: includes,
    duration: value5 > 0 ? value5 : null,
    position: value6 !== null ? Math.min(value5 > 0 ? value5 : Infinity, Math.max(0, value6 + value8)) : null,
    updated: attributes.updatedAt || attributes.last_updated || ""
  };
}
export function televisionTime(arg6) {
  if (!Number.isFinite(arg6)) {
    return "—";
  }
  const value9 = Math.max(0, Math.floor(arg6));
  return Math.floor(value9 / 60) + ":" + String(value9 % 60).padStart(2, "0");
}
export function televisionPower(powerEntityId, arg7 = {}, arg8) {
  const entityId2 = powerEntityId.powerEntityId || powerEntityId.entityId || "";
  const domain = entityId2.split(".")[0];
  const newState3 = y(arg7, entityId2);
  const state3 = newState3?.newState || newState3 || {};
  const available2 = !!entityId2 && state3.available !== false && typeof state3.state == "string" && !["unknown", "unavailable", ""].includes(state3.state);
  const on2 = available2 && !["off", "standby"].includes(state3.state);
  const value10 = typeof arg8 == "boolean" ? arg8 : !on2;
  const service = value10 ? "turn_on" : "turn_off";
  const value11 = Number(state3.attributes?.supported_features) || 0;
  const supported = domain === "switch" || domain === "media_player" && !!(value11 & (value10 ? 128 : 256));
  return {
    entityId: entityId2,
    domain,
    on: on2,
    available: available2,
    supported,
    service,
    reason: available2 ? supported ? "" : "此实体不支持开关机" : "电源状态不可用",
    command: {
      entityId: entityId2,
      domain,
      service,
      data: {},
      deviceKind: "television"
    }
  };
}
export function televisionMediaControl(entityId3, arg9, arg10) {
  const newState4 = y(arg9, entityId3.entityId);
  const attributes2 = newState4?.newState || newState4 || {};
  const playing = televisionState(entityId3, arg9);
  const value12 = Number(attributes2.attributes?.supported_features) || 0;
  const service2 = arg10 === "previous" ? "media_previous_track" : arg10 === "next" ? "media_next_track" : playing.playing ? "media_pause" : "media_play";
  const value13 = {
    media_previous_track: 16,
    media_next_track: 32,
    media_pause: 1,
    media_play: 16384
  }[service2];
  return {
    enabled: playing.on && !!(value12 & value13),
    command: {
      domain: "media_player",
      entityId: entityId3.entityId,
      service: service2,
      data: {},
      deviceKind: "television"
    }
  };
}
