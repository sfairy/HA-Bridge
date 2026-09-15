export function vacuumProfiles(entities = [], devices = []) {
  const enabledEntities = entities.filter(
    entity =>
      entity.disabledBy == null &&
      entity.disabled_by == null &&
      entity.enabled !== false &&
      !["missing", "disabled"].includes(entity.status)
  );
  const profilesByDeviceId = new Map();
  for (const vacuumEntity of enabledEntities.filter(rawEntity =>
    /^vacuum\.[a-z0-9_]+$/.test(rawEntity.entityId)
  )) {
    const entityDeviceId = vacuumEntity.deviceId || vacuumEntity.device_id || "";
    const deviceKey = entityDeviceId || vacuumEntity.entityId;
    if (!profilesByDeviceId.has(deviceKey)) {
      const deviceEntry = devices.find(
        registryDevice => (registryDevice.id || registryDevice.deviceId) === entityDeviceId
      );
      const deviceEntities = entityDeviceId
        ? enabledEntities.filter(
            deviceEntity => (deviceEntity.deviceId || deviceEntity.device_id) === entityDeviceId
          )
        : [vacuumEntity];
      profilesByDeviceId.set(deviceKey, {
        deviceId: deviceKey,
        name:
          deviceEntry?.nameByUser ||
          deviceEntry?.name ||
          vacuumEntity.name ||
          vacuumEntity.entityId,
        entities: [],
        maps: deviceEntities.filter(mapEntity => /^(camera|image)\./.test(mapEntity.entityId)),
        relatedEntityIds: deviceEntities
          .filter(candidateEntity =>
            /^(sensor|binary_sensor|select|number|switch|button)\./.test(candidateEntity.entityId)
          )
          .map(relatedEntity => relatedEntity.entityId)
      });
    }
    profilesByDeviceId.get(deviceKey).entities.push(vacuumEntity);
  }
  return [...profilesByDeviceId.values()];
}
