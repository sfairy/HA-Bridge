export function vacuumProfiles(filter2 = [], find = []) {
  const filter3 = filter2.filter(disabledBy => disabledBy.disabledBy == null && disabledBy.disabled_by == null && disabledBy.enabled !== false && !["missing", "disabled"].includes(disabledBy.status));
  const map = new Map();
  for (const entityId5 of filter3.filter(entityId4 => /^vacuum\.[a-z0-9_]+$/.test(entityId4.entityId))) {
    const value = entityId5.deviceId || entityId5.device_id || "";
    const deviceId2 = value || entityId5.entityId;
    if (!map.has(deviceId2)) {
      const nameByUser = find.find(id => (id.id || id.deviceId) === value);
      const filter = value ? filter3.filter(deviceId => (deviceId.deviceId || deviceId.device_id) === value) : [entityId5];
      map.set(deviceId2, {
        deviceId: deviceId2,
        name: nameByUser?.nameByUser || nameByUser?.name || entityId5.name || entityId5.entityId,
        entities: [],
        maps: filter.filter(entityId2 => /^(camera|image)\./.test(entityId2.entityId)),
        relatedEntityIds: filter.filter(entityId => /^(sensor|binary_sensor|select|number|switch|button)\./.test(entityId.entityId)).map(entityId3 => entityId3.entityId)
      });
    }
    map.get(deviceId2).entities.push(entityId5);
  }
  return [...map.values()];
}
