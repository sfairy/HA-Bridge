export function vacuumProfiles(filter = [], find = []) {
  const list = filter.filter(disabledBy => disabledBy.disabledBy == null && disabledBy.disabled_by == null && disabledBy.enabled !== false && !["missing", "disabled"].includes(disabledBy.status));
  const map = new Map();
  for (const entityId5 of list.filter(entityId => /^vacuum\.[a-z0-9_]+$/.test(entityId.entityId))) {
    const value = entityId5.deviceId || entityId5.device_id || "";
    const deviceId = value || entityId5.entityId;
    if (!map.has(deviceId)) {
      const nameByUser = find.find(id => (id.id || id.deviceId) === value);
      const filter = value ? list.filter(deviceId => (deviceId.deviceId || deviceId.device_id) === value) : [entityId5];
      map.set(deviceId, {
        deviceId: deviceId,
        name: nameByUser?.nameByUser || nameByUser?.name || entityId5.name || entityId5.entityId,
        entities: [],
        maps: filter.filter(entityId => /^(camera|image)\./.test(entityId.entityId)),
        relatedEntityIds: filter.filter(entityId => /^(sensor|binary_sensor|select|number|switch|button)\./.test(entityId.entityId)).map(entityId => entityId.entityId)
      });
    }
    map.get(deviceId).entities.push(entityId5);
  }
  return [...map.values()];
}
