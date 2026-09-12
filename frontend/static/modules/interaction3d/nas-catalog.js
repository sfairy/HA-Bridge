const I = {
  cpu_total_load: ["CPU 使用率", "system"],
  memory_real_usage: ["内存使用率", "system"],
  temperature: ["系统温度", "system"],
  cpu_temperature: ["CPU 温度", "system"],
  cpu_5min_load: ["平均负载 · 5 分钟", "system"],
  memory_available_real: ["可用内存", "system"],
  memory_total_real: ["总内存", "system"],
  uptime: ["上次启动", "system", "timestamp"],
  network_up: ["上传", "network"],
  network_down: ["下载", "network"],
  volume_percentage_used: ["使用率", "storage"],
  volume_size_used: ["已用空间", "storage"],
  volume_size_total: ["总容量", "storage"],
  volume_status: ["状态", "storage", "status"],
  volume_disk_temp_avg: ["平均磁盘温度", "storage"],
  disk_temp: ["温度", "storage"],
  disk_smart_status: ["S.M.A.R.T.", "health", "status"],
  status: ["安全状态", "health", "problem"],
  disk_exceed_bad_sector_thr: ["坏道告警", "health", "problem"],
  disk_below_remain_life_thr: ["寿命告警", "health", "problem"]
};
const f = disabledBy => !disabledBy.disabledBy && !["disabled", "missing"].includes(disabledBy.status);
const b = platform => ["fnos", "synology_dsm"].includes(platform) ? platform : null;
export function nasProfiles(filter = [], list = []) {
  const filtered = filter.filter(entityId => f(entityId) && /^(sensor|binary_sensor)\./.test(entityId.entityId) && b(entityId.platform));
  const items = new Map(list.filter(f).map(deviceId => [deviceId.deviceId, deviceId]));
  const filterCurrent = filtered.filter(deviceId => deviceId.translationKey === "cpu_total_load" && deviceId.deviceId && items.has(deviceId.deviceId));
  const has = new Set();
  return filterCurrent.filter(deviceId => !has.has(deviceId.deviceId) && has.add(deviceId.deviceId)).map(entityId3 => {
    const deviceId5 = items.get(entityId3.deviceId);
    const entityIdStem = entityId3.entityId.split(".")[1].replace(/_cpu_utilization_total$/, "");
    const metrics = {
      deviceId: deviceId5.deviceId,
      name: deviceId5.name || entityId3.name || "NAS",
      platform: entityId3.platform,
      primaryEntityId: entityId3.entityId,
      metrics: []
    };
    for (const deviceIdCurrent of filtered) {
      if (deviceIdCurrent.platform !== entityId3.platform) {
        continue;
      }
      const name = items.get(deviceIdCurrent.deviceId);
      const belongsToNas = deviceIdCurrent.deviceId === deviceId5.deviceId || name?.name?.startsWith(deviceId5.name + " (") || entityIdStem !== entityId3.entityId.split(".")[1] && deviceIdCurrent.entityId.split(".")[1].startsWith(entityIdStem + "_") && !filterCurrent.some(deviceId => deviceId.deviceId !== deviceId5.deviceId && deviceId.deviceId === deviceIdCurrent.deviceId);
      const metricMeta = I[deviceIdCurrent.translationKey];
      if (!belongsToNas || !metricMeta || metricMeta[2] === "problem" && !deviceIdCurrent.entityId.startsWith("binary_sensor.")) {
        continue;
      }
      const volumeLabel = name?.name?.match(/\(([^)]+)\)$/)?.[1] || "";
      metrics.metrics.push({
        entityId: deviceIdCurrent.entityId,
        label: "" + (volumeLabel ? volumeLabel + " · " : "") + metricMeta[0],
        group: metricMeta[1],
        kind: metricMeta[2] || "number"
      });
    }
    const indexOf = Object.keys(I);
    metrics.metrics.sort((label, labelRight) => {
      const value = entityIdCurrent => filtered.find(entityId => entityId.entityId === entityIdCurrent.entityId)?.translationKey;
      return indexOf.indexOf(value(label)) - indexOf.indexOf(value(labelRight)) || label.label.localeCompare(labelRight.label);
    });
    metrics.metrics = metrics.metrics.slice(0, 48);
    return metrics;
  }).sort((name2, name3) => name2.name.localeCompare(name3.name));
}
