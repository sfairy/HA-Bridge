const METRIC_DEFINITIONS = {
  cpu_total_load: ["CPU 使用率", "system"],
  cpu_user_load: ["CPU 用户使用率", "system"],
  cpu_system_load: ["CPU 系统使用率", "system"],
  cpu_other_load: ["CPU 其他使用率", "system"],
  cpu_1min_load: ["平均负载 · 1 分钟", "system"],
  cpu_15min_load: ["平均负载 · 15 分钟", "system"],
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
const isUsableEntity = entity =>
  !entity.disabledBy && !["disabled", "missing"].includes(entity.status);
const normalizeNasPlatform = platform =>
  ["fnos", "synology_dsm"].includes(platform) ? platform : null;
const METRIC_KEYS_BY_LENGTH = Object.keys(METRIC_DEFINITIONS).sort(
  (keyA, keyB) => keyB.length - keyA.length
);
function resolveMetricIdentity(sourceEntity) {
  const uniqueId = sourceEntity.uniqueId || "";
  if (sourceEntity.platform === "synology_dsm") {
    const hostMatch = uniqueId.match(/^(.+)_[^:]+:([^:]+)$/);
    const synologyMetricKey =
      hostMatch &&
      METRIC_KEYS_BY_LENGTH.find(
        longestKey => hostMatch[2] === longestKey || hostMatch[2].startsWith(longestKey + "_")
      );
    return {
      key: sourceEntity.translationKey || synologyMetricKey,
      host: synologyMetricKey ? hostMatch[1] : null
    };
  }
  const metricKey = METRIC_KEYS_BY_LENGTH.find(candidateKey =>
    uniqueId.endsWith("_" + candidateKey)
  );
  return {
    key: sourceEntity.translationKey || metricKey,
    prefix: metricKey ? uniqueId.slice(0, -metricKey.length - 1) : null
  };
}
const metricDefinition = metric =>
  METRIC_DEFINITIONS[metric.key] || [
    metric.name || metric.originalName || metric.entityId,
    "system",
    metric.entityId.startsWith("binary_sensor.") ? "status" : "number"
  ];
const isSystemMetric = checkedMetric =>
  Object.hasOwn(METRIC_DEFINITIONS, checkedMetric.key) &&
  (METRIC_DEFINITIONS[checkedMetric.key][1] === "system" ||
    checkedMetric.key === "status" ||
    (checkedMetric.platform === "synology_dsm" &&
      METRIC_DEFINITIONS[checkedMetric.key][1] === "network"));
export function nasProfiles(entities = [], devices = []) {
  const devicesByDeviceId = new Map(
    devices.filter(isUsableEntity).map(device => [device.deviceId, device])
  );
  const platformsByDeviceId = new Map(
    [...devicesByDeviceId.values()].map(deviceEntry => [
      deviceEntry.deviceId,
      new Set((deviceEntry.registryMetadata?.integrations || []).filter(normalizeNasPlatform))
    ])
  );
  for (const entityRecord of entities) {
    if (entityRecord.status !== "missing" && normalizeNasPlatform(entityRecord.platform)) {
      platformsByDeviceId.get(entityRecord.deviceId)?.add(entityRecord.platform);
    }
  }
  const platformsOfDevice = sourceDevice => [
    ...(platformsByDeviceId.get(sourceDevice.deviceId) || [])
  ];
  const profilesByIdentity = new Map();
  const profilesByEntityKey = new Map();
  for (const chainDevice of devicesByDeviceId.values()) {
    if (!chainDevice.registryMetadata || chainDevice.registryMetadata.entryType === "service") {
      continue;
    }
    const platforms = platformsOfDevice(chainDevice);
    if (platforms.length !== 1) {
      continue;
    }
    const devicePlatform = platforms[0];
    const visitedDeviceIds = new Set();
    let currentDevice = chainDevice;
    let isChainValid = true;
    while (currentDevice.registryMetadata?.viaDeviceId) {
      if (visitedDeviceIds.has(currentDevice.deviceId)) {
        isChainValid = false;
        break;
      }
      visitedDeviceIds.add(currentDevice.deviceId);
      const parentDevice = devicesByDeviceId.get(currentDevice.registryMetadata.viaDeviceId);
      const configEntryIds = currentDevice.registryMetadata.configEntryIds || [];
      const parentConfigEntryIds = parentDevice?.registryMetadata?.configEntryIds || [];
      if (
        !parentDevice?.registryMetadata ||
        parentDevice.registryMetadata.entryType === "service" ||
        platformsOfDevice(parentDevice).length !== 1 ||
        platformsOfDevice(parentDevice)[0] !== devicePlatform ||
        (configEntryIds.length &&
          parentConfigEntryIds.length &&
          !configEntryIds.some(configEntryId => parentConfigEntryIds.includes(configEntryId)))
      ) {
        isChainValid = false;
        break;
      }
      currentDevice = parentDevice;
    }
    if (!isChainValid) {
      continue;
    }
    const profileKey = devicePlatform + ":" + currentDevice.deviceId;
    if (!profilesByIdentity.has(profileKey)) {
      profilesByIdentity.set(profileKey, {
        device: currentDevice,
        platform: devicePlatform,
        identities: new Set(),
        metrics: [],
        registry: true
      });
    }
    profilesByEntityKey.set(
      devicePlatform + ":" + chainDevice.deviceId,
      profilesByIdentity.get(profileKey)
    );
  }
  const metricEntities = entities
    .filter(
      candidateEntity =>
        /^(sensor|binary_sensor)\./.test(candidateEntity.entityId) &&
        normalizeNasPlatform(candidateEntity.platform) &&
        devicesByDeviceId.has(candidateEntity.deviceId) &&
        candidateEntity.status !== "missing"
    )
    .map(mappedEntity => ({
      ...mappedEntity,
      ...resolveMetricIdentity(mappedEntity)
    }))
    .filter(
      metricCandidate =>
        metricDefinition(metricCandidate)[2] !== "problem" ||
        metricCandidate.entityId.startsWith("binary_sensor.")
    );
  for (const legacyEntity of metricEntities.filter(
    legacyMetricEntity =>
      !devicesByDeviceId.get(legacyMetricEntity.deviceId).registryMetadata &&
      isSystemMetric(legacyMetricEntity)
  )) {
    const identityKey = legacyEntity.platform + ":" + legacyEntity.deviceId;
    if (!profilesByIdentity.has(identityKey)) {
      profilesByIdentity.set(identityKey, {
        device: devicesByDeviceId.get(legacyEntity.deviceId),
        platform: legacyEntity.platform,
        identities: new Set(),
        metrics: []
      });
    }
    const identityProfile = profilesByIdentity.get(identityKey);
    const hostIdentity = legacyEntity.host || legacyEntity.prefix;
    if (hostIdentity) {
      identityProfile.identities.add(hostIdentity);
    }
  }
  const profiles = [...profilesByIdentity.values()];
  for (const entityProfile of metricEntities.filter(isUsableEntity)) {
    let targetProfile = profilesByEntityKey.get(
      entityProfile.platform + ":" + entityProfile.deviceId
    );
    if (devicesByDeviceId.get(entityProfile.deviceId).registryMetadata) {
      if (targetProfile) {
        targetProfile.metrics.push(entityProfile);
      }
      continue;
    }
    if (!Object.hasOwn(METRIC_DEFINITIONS, entityProfile.key)) {
      continue;
    }
    const platformProfiles = profiles.filter(
      profile => !profile.registry && profile.platform === entityProfile.platform
    );
    targetProfile = platformProfiles.find(
      matchedProfile => matchedProfile.device.deviceId === entityProfile.deviceId
    );
    if (!targetProfile) {
      const identityMatches = platformProfiles.filter(candidateProfile =>
        [...candidateProfile.identities].some(hostValue =>
          entityProfile.host
            ? entityProfile.host === hostValue
            : entityProfile.prefix &&
              (entityProfile.prefix === hostValue ||
                entityProfile.prefix.startsWith(hostValue + "_"))
        )
      );
      if (identityMatches.length === 1) {
        targetProfile = identityMatches[0];
      } else if (!identityMatches.length) {
        const deviceName = devicesByDeviceId.get(entityProfile.deviceId)?.name;
        const deviceNameMatches = platformProfiles.filter(
          parentProfile =>
            (!parentProfile.identities.size || (!entityProfile.host && !entityProfile.prefix)) &&
            parentProfile.device.name &&
            deviceName?.startsWith(parentProfile.device.name + " (")
        );
        if (deviceNameMatches.length === 1) {
          targetProfile = deviceNameMatches[0];
        }
      }
    }
    if (targetProfile) {
      targetProfile.metrics.push(entityProfile);
    }
  }
  const metricKeyOrder = Object.keys(METRIC_DEFINITIONS);
  const metricRank = rankedMetric =>
    metricKeyOrder.includes(rankedMetric.key)
      ? metricKeyOrder.indexOf(rankedMetric.key)
      : metricKeyOrder.length;
  return profiles
    .filter(keptProfile => keptProfile.registry || keptProfile.metrics.length)
    .map(profileEntry => {
      profileEntry.metrics.sort(
        (metricA, metricB) =>
          metricRank(metricA) - metricRank(metricB) ||
          metricA.entityId.localeCompare(metricB.entityId)
      );
      const selectedMetrics = profileEntry.metrics.slice(0, 48);
      const primaryMetric = selectedMetrics.find(isSystemMetric) || selectedMetrics[0];
      return {
        deviceId: profileEntry.device.deviceId,
        name: profileEntry.device.name || primaryMetric?.name || "NAS",
        platform: profileEntry.platform,
        primaryEntityId: primaryMetric?.entityId || "",
        metrics: selectedMetrics.map(metricEntity => {
          const definition = metricDefinition(metricEntity);
          const metricDevice = devicesByDeviceId.get(metricEntity.deviceId);
          const deviceLabel =
            metricEntity.deviceId === profileEntry.device.deviceId
              ? ""
              : metricDevice?.name?.match(/\(([^)]+)\)$/)?.[1] || metricDevice?.name || "";
          return {
            entityId: metricEntity.entityId,
            label: "" + (deviceLabel ? deviceLabel + " · " : "") + definition[0],
            group: definition[1],
            kind: definition[2] || "number"
          };
        })
      };
    })
    .sort((leftProfile, rightProfile) => leftProfile.name.localeCompare(rightProfile.name));
}
