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
const b = arg => ["fnos", "synology_dsm"].includes(arg) ? arg : null;
export function nasProfiles(filter = [], filter2 = []) {
  const filter3 = filter.filter(entityId4 => f(entityId4) && /^(sensor|binary_sensor)\./.test(entityId4.entityId) && b(entityId4.platform));
  const items = new Map(filter2.filter(f).map(deviceId4 => [deviceId4.deviceId, deviceId4]));
  const filter4 = filter3.filter(deviceId6 => deviceId6.translationKey === "cpu_total_load" && deviceId6.deviceId && items.has(deviceId6.deviceId));
  const has = new Set();
  return filter4.filter(deviceId2 => !has.has(deviceId2.deviceId) && has.add(deviceId2.deviceId)).map(entityId3 => {
    const deviceId5 = items.get(entityId3.deviceId);
    const value5 = entityId3.entityId.split(".")[1].replace(/_cpu_utilization_total$/, "");
    const metrics = {
      deviceId: deviceId5.deviceId,
      name: deviceId5.name || entityId3.name || "NAS",
      platform: entityId3.platform,
      primaryEntityId: entityId3.entityId,
      metrics: []
    };
    for (const deviceId3 of filter3) {
      if (deviceId3.platform !== entityId3.platform) {
        continue;
      }
      const name = items.get(deviceId3.deviceId);
      const value2 = deviceId3.deviceId === deviceId5.deviceId || name?.name?.startsWith(deviceId5.name + " (") || value5 !== entityId3.entityId.split(".")[1] && deviceId3.entityId.split(".")[1].startsWith(value5 + "_") && !filter4.some(deviceId => deviceId.deviceId !== deviceId5.deviceId && deviceId.deviceId === deviceId3.deviceId);
      const value3 = I[deviceId3.translationKey];
      if (!value2 || !value3 || value3[2] === "problem" && !deviceId3.entityId.startsWith("binary_sensor.")) {
        continue;
      }
      const value4 = name?.name?.match(/\(([^)]+)\)$/)?.[1] || "";
      metrics.metrics.push({
        entityId: deviceId3.entityId,
        label: "" + (value4 ? value4 + " · " : "") + value3[0],
        group: value3[1],
        kind: value3[2] || "number"
      });
    }
    const indexOf = Object.keys(I);
    metrics.metrics.sort((label, label2) => {
      const value = entityId2 => filter3.find(entityId => entityId.entityId === entityId2.entityId)?.translationKey;
      return indexOf.indexOf(value(label)) - indexOf.indexOf(value(label2)) || label.label.localeCompare(label2.label);
    });
    metrics.metrics = metrics.metrics.slice(0, 48);
    return metrics;
  }).sort((name2, name3) => name2.name.localeCompare(name3.name));
}
