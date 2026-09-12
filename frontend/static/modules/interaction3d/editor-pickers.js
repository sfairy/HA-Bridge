import { EDITOR_PICKER_PAGE_SIZES, editorEntityPickerInitialPage, editorEntityPickerPage } from "../../js/editor/editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries } from "../../js/editor/editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
import { vacuumProfiles } from "./vacuum-catalog.js";
import { nasProfiles } from "./nas-catalog.js";
const DEFAULT_LIGHT_ICON = "mdi:lightbulb-outline";
const isValidMdiIcon = iconId => typeof iconId == "string" && /^mdi:[a-z0-9][a-z0-9-]{0,119}$/.test(iconId);
export function presenceDeviceProfiles(entities = [], devices = [], getState = () => null) {
  const profiles = new Map();
  for (const entity of entities) {
    if (entity.disabledBy != null || entity.disabled_by != null || entity.enabled === false || ["missing", "disabled"].includes(entity.status) || !/^(binary_sensor|event)\.[a-z0-9_]+$/.test(entity.entityId || "")) {
      continue;
    }
    const deviceClass = entity.deviceClass || entity.device_class || entity.attributes?.device_class || getState(entity.entityId)?.attributes?.device_class;
    if (deviceClass && !["occupancy", "presence", "motion"].includes(deviceClass) || !deviceClass && !/occupancy|presence|motion|(?:^|_)pir(?:_|$)|有人|无人|移动检测|运动检测|人体检测/i.test(entity.entityId + " " + (entity.name || "")) || ["diagnostic", "config"].includes(entity.entityCategory || entity.entity_category)) {
      continue;
    }
    const deviceId = entity.deviceId || entity.device_id;
    if (!deviceId) {
      continue;
    }
    const device = devices.find(item => (item.id || item.deviceId) === deviceId);
    if (device?.disabledBy != null || device?.disabled_by != null) {
      continue;
    }
    if (!profiles.has(deviceId)) {
      profiles.set(deviceId, {
        deviceId,
        name: device?.nameByUser || device?.name_by_user || device?.name || entity.name || deviceId,
        entities: []
      });
    }
    profiles.get(deviceId).entities.push({
      entityId: entity.entityId,
      name: entity.name || entity.entityId,
      rank: deviceClass === "occupancy" || deviceClass === "presence" ? 0 : deviceClass === "motion" ? 1 : 2
    });
  }
  return [...profiles.values()].map(profile => ({
    ...profile,
    entities: profile.entities.sort((a, b) => a.rank - b.rank || a.entityId.localeCompare(b.entityId))
  }));
}
export function createInteraction3dEditorPickers({
  openPicker,
  fetchIcons,
  getEntities,
  getState: getEntityState = () => null,
  ensureEntities: ensureEntitiesLoaded,
  entityPickerText: elements,
  elements: elements2,
  deviceKind: defaultDeviceKind = "light",
  fetchAreas: fetchHaAreas = async () => {
    const response = await fetch("/api/v1/ha/areas");
    if (!response.ok) {
      throw new Error("房间目录暂时不可用");
    }
    return (await response.json()).items || [];
  },
  fetchDevices: fetchHaDevices = async () => {
    const ok = await fetch("/api/v1/ha/devices");
    if (!ok.ok) {
      throw new Error("设备目录暂时不可用，请稍后重试。");
    }
    return (await ok.json()).items || [];
  }
}) {
  async function loadDeviceCatalog() {
    const [devices, areas] = await Promise.all([fetchHaDevices(), fetchHaAreas().catch(() => null)]);
    const areaNames = new Map((areas || []).map(area => [area.areaId || area.id, area.name]));
    const platformsByDevice = new Map();
    for (const entity of getEntities()) {
      const deviceId = entity.deviceId || entity.device_id;
      if (!deviceId || !entity.platform) {
        continue;
      }
      if (!platformsByDevice.has(deviceId)) {
        platformsByDevice.set(deviceId, new Set());
      }
      platformsByDevice.get(deviceId).add(entity.platform);
    }
    return devices.map(device => ({
      ...device,
      integrationName: [...(platformsByDevice.get(device.deviceId || device.id) || [])].sort().join("、") || "未知集成",
      roomName: areaNames.get(device.areaId || device.area_id) || (device.areaId || device.area_id ? "房间名称暂不可用" : "未分配房间")
    }));
  }
  function deviceRoomName(device, catalog) {
    return catalog.find(item => (item.deviceId || item.id) === device.deviceId)?.roomName || "未分配房间";
  }
  function deviceIntegrationName(device, catalog) {
    return catalog.find(item => (item.deviceId || item.id) === device.deviceId)?.integrationName || "未知集成";
  }
  const roomIntegrationLabel = device => "房间：" + device.roomName + " · 集成：" + device.integrationName;
  function createEnrichedEntityPickerOption(device, currentEntityId, kindLabel = "设备") {
    const option = elements2.createEditorEntityPickerOption(device, currentEntityId);
    const kindEl = option.querySelector?.(".inspector-entity-kind");
    const idEl = option.querySelector?.(".inspector-entity-id");
    if (kindEl) {
      kindEl.textContent = "[" + kindLabel + "] ";
    }
    if (idEl) {
      idEl.textContent = roomIntegrationLabel(device);
    }
    return option;
  }
  function createEnrichedCurrentEntity(device) {
    const current = elements2.createEditorPickerCurrentEntity(device);
    const idEl = current.querySelector?.(".editor-paged-picker-current-entity-id");
    if (idEl && device) {
      idEl.textContent = roomIntegrationLabel(device);
    }
    return current;
  }
  return {
    presenceEntities(deviceId) {
      return presenceDeviceProfiles(getEntities(), [], getEntityState).find(profile => profile.deviceId === deviceId)?.entities || [];
    },
    async presence({
      trigger,
      current = "",
      onSelect
    }) {
      await ensureEntitiesLoaded();
      const deviceCatalog = await loadDeviceCatalog();
      if (!trigger.isConnected) {
        return null;
      }
      const profiles = presenceDeviceProfiles(getEntities(), deviceCatalog, getEntityState);
      const options = profiles.map(profile => ({
        entityId: profile.deviceId,
        name: profile.name,
        roomName: deviceRoomName(profile, deviceCatalog),
        integrationName: deviceIntegrationName(profile, deviceCatalog),
        icon: "mdi:motion-sensor",
        domain: "binary_sensor"
      }));
      return openPicker({
        kind: "entity",
        title: "选择人体传感器设备",
        subtitle: "按设备匹配人在或移动检测实体；多实体可在设备内选择。",
        searchPlaceholder: "搜索设备名称、房间或集成",
        triggerButton: trigger,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        itemClass: "entity-list",
        emptyText: "没有找到可用的人体传感器设备；无设备归属的模板实体可手动绑定。",
        getPage: ({
          query: searchQuery,
          page: pageNumber
        }) => editorEntityPickerPage(options.filter(item => (item.name + " " + (item.roomName || "") + " " + (item.integrationName || "") + " " + item.entityId).toLowerCase().includes(String(searchQuery || "").toLowerCase())), pageNumber, null),
        renderSelectedContent: () => [createEnrichedCurrentEntity(options.find(item => item.entityId === current))],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不绑定设备", !current)],
        renderItem: item => createEnrichedEntityPickerOption(item, current),
        onSelect: selectedDeviceId => {
          const matched = profiles.find(profile => profile.deviceId === selectedDeviceId);
          if (!selectedDeviceId || matched) {
            onSelect(matched ? structuredClone(matched) : null);
          }
        }
      });
    },
    async vacuum({
      trigger,
      current = "",
      onSelect
    }) {
      await ensureEntitiesLoaded();
      const devices = await fetchHaDevices();
      if (!trigger.isConnected) {
        return null;
      }
      const map = vacuumProfiles(getEntities(), devices);
      const filter = map.map(deviceId3 => ({
        entityId: deviceId3.deviceId,
        name: deviceId3.name,
        domain: "vacuum",
        icon: "mdi:robot-vacuum"
      }));
      return openPicker({
        kind: "entity",
        title: "选择扫地机设备",
        subtitle: "自动识别主实体、地图和相关状态；支持多台设备独立配置。",
        searchPlaceholder: "搜索设备名称",
        triggerButton: trigger,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        itemClass: "entity-list",
        emptyText: "没有找到扫地机，请先在 Home Assistant 中接入设备并启用 vacuum 实体。",
        getPage: ({
          query: searchQuery,
          page: iconId
        }) => editorEntityPickerPage(filter.filter(name => (name.name + " " + name.entityId).toLowerCase().includes(String(searchQuery || "").toLowerCase())), iconId, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(filter.find(entityId3 => entityId3.entityId === current))],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不绑定设备", !current)],
        renderItem: item => elements2.createEditorEntityPickerOption(item, current),
        onSelect: selectedDeviceId => {
          const matched = map.find(deviceId => deviceId.deviceId === selectedDeviceId);
          if (!selectedDeviceId || matched) {
            onSelect(matched ? structuredClone(matched) : null);
          }
        }
      });
    },
    async nas({
      trigger,
      current = "",
      onSelect
    }) {
      await ensureEntitiesLoaded();
      const missingCurrentEntity = await fetchHaDevices();
      if (!trigger.isConnected) {
        return null;
      }
      const matchedEntities = nasProfiles(getEntities(), missingCurrentEntity);
      const initialMatches = matchedEntities.map(deviceId4 => ({
        entityId: deviceId4.deviceId,
        name: (deviceId4.platform === "fnos" ? "飞牛" : "群晖") + " · " + deviceId4.name + " · " + deviceId4.metrics.length + " 项状态",
        domain: "sensor",
        icon: "mdi:nas"
      }));
      return openPicker({
        kind: "entity",
        title: "选择 NAS 数据来源",
        subtitle: "选择整台 NAS，自动匹配它的状态实体。",
        searchPlaceholder: "搜索 NAS 名称、飞牛或群晖",
        triggerButton: trigger,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        itemClass: "entity-list",
        emptyText: "未找到已启用状态实体的飞牛或群晖，请先在 Home Assistant 接入对应集成。",
        getPage: ({
          query: searchQuery,
          page: pageNumber
        }) => editorEntityPickerPage(initialMatches.filter(name2 => (name2.name + " " + name2.entityId).toLowerCase().includes(String(searchQuery || "").toLowerCase())), pageNumber, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(initialMatches.find(entityId4 => entityId4.entityId === current))],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不使用数据来源", !current)],
        renderItem: item => {
          const querySelector = elements2.createEditorEntityPickerOption(item, current);
          const textContent = querySelector.querySelector?.(".inspector-entity-kind");
          const textContent2 = querySelector.querySelector?.(".inspector-entity-id");
          if (textContent) {
            textContent.textContent = "[NAS] ";
          }
          if (textContent2) {
            textContent2.textContent = "自动匹配系统、存储、网络与健康状态";
          }
          return querySelector;
        },
        onSelect: entity => {
          const matchedNas = matchedEntities.find(deviceId2 => deviceId2.deviceId === entity);
          if (!entity || matchedNas) {
            onSelect(matchedNas ? structuredClone(matchedNas) : null);
          }
        }
      });
    },
    icon({
      trigger: triggerButton,
      current: currentIcon,
      onSelect: onIconSelect,
      deviceKind: iconDeviceKind = defaultDeviceKind
    }) {
      currentIcon ||= iconDeviceKind === "camera" ? "mdi:cctv" : iconDeviceKind === "vacuum" ? "mdi:robot-vacuum" : iconDeviceKind === "television" ? "mdi:television" : iconDeviceKind === "nas" ? "mdi:nas" : iconDeviceKind === "cover" ? "mdi:curtains" : iconDeviceKind === "climate" ? "mdi:air-conditioner" : DEFAULT_LIGHT_ICON;
      return openPicker({
        kind: "icon",
        title: iconDeviceKind === "camera" ? "选择摄像头按钮图标" : iconDeviceKind === "vacuum" ? "选择扫地机按钮图标" : iconDeviceKind === "television" ? "选择电视按钮图标" : iconDeviceKind === "nas" ? "选择NAS按钮图标" : iconDeviceKind === "cover" ? "选择窗帘按钮图标" : iconDeviceKind === "climate" ? "选择空调按钮图标" : "选择灯光按钮图标",
        searchPlaceholder: "搜索图标名称",
        triggerButton,
        pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
        emptyText: "没有匹配的图标",
        itemClass: "icon-grid",
        async getPage({
          query: searchQuery,
          page: pageNumber,
          pageSize: pageSize
        }) {
          const items = await fetchIcons(searchQuery, pageSize, (pageNumber - 1) * pageSize);
          return {
            items: items.items || [],
            total: Number(items.total) || 0
          };
        },
        renderSelectedActions: () => [elements2.createEditorPickerCurrentIcon(currentIcon || DEFAULT_LIGHT_ICON)],
        renderItem: iconItem => elements2.createIconPickerOption(iconItem, currentIcon, "editorPickerValue"),
        onSelect: selectedIcon => {
          if (isValidMdiIcon(selectedIcon)) {
            onIconSelect(selectedIcon);
          }
        }
      });
    },
    async entity({
      trigger: isConnected,
      current: entityId11 = "",
      onSelect: onEntitySelect,
      deviceKind: startsWith = defaultDeviceKind,
      domain: domainFilter
    }) {
      const isNas = startsWith === "nas";
      const isCamera = startsWith === "camera";
      const isTelevision = startsWith === "television";
      const isTelevisionPower = startsWith === "television-power";
      const isCover = startsWith === "cover" || domainFilter === "cover";
      const isClimate = !isCover && (startsWith === "climate" || domainFilter === "climate");
      const test = startsWith === "camera" ? /^camera\.[a-z0-9_]+$/ : startsWith === "presence" ? /^(binary_sensor|event)\.[a-z0-9_]+$/ : startsWith === "vacuum" ? /^vacuum\.[a-z0-9_]+$/ : startsWith === "vacuum-map" ? /^(camera|image)\.[a-z0-9_]+$/ : startsWith === "vacuum-room" ? /^[a-z_]+\.[a-z0-9_]+$/ : isTelevision ? /^media_player\.[a-z0-9_]+$/ : isTelevisionPower ? /^(media_player|switch|binary_sensor|input_boolean)\.[a-z0-9_]+$/ : isNas ? /^(binary_sensor|switch|input_boolean)\.[a-z0-9_]+$/ : isCover ? /^cover\.[a-z0-9_]+$/ : isClimate ? /^climate\.[a-z0-9_]+$/ : /^(light|switch)\.[a-z0-9_]+$/;
      const {
        editorEntityMatches: matchEntities
      } = createEditorPickerQueries({
        entityPickerConfig: () => ({
          recommended: entityId5 => startsWith === "presence" ? ["occupancy", "motion", "presence"].includes(entityId5.deviceClass || entityId5.device_class || entityId5.attributes?.device_class || getEntityState(entityId5.entityId)?.attributes?.device_class) : entityId5.entityId.startsWith(isTelevision || isTelevisionPower ? "media_player." : isNas || startsWith === "presence" ? "binary_sensor." : isCover ? "cover." : isClimate ? "climate." : isCamera ? "camera." : "light.")
        }),
        pickerEntitiesForComponentType: () => getEntities().filter(entityId6 => test.test(entityId6.entityId)),
        entityPickerText: elements,
        entityDomain: entityId9 => entityId9.entityId.split(".")[0]
      });
      await ensureEntitiesLoaded();
      if (!isConnected.isConnected) {
        return null;
      }
      const entityId12 = entityId11 && test.test(entityId11) && !getEntities().some(entityId7 => entityId7.entityId === entityId11) ? {
        entityId: entityId11,
        name: entityId11 + "（当前未找到）"
      } : null;
      const entitiesForQuery = searchQuery => {
        const push = matchEntities("interaction3d", searchQuery);
        if (entityId12 && (!searchQuery || elements(entityId12).toLocaleLowerCase("zh-CN").includes(String(searchQuery).trim().toLocaleLowerCase("zh-CN")))) {
          push.push(entityId12);
        }
        return push;
      };
      const find = entitiesForQuery("");
      const selectedEntity = find.find(entityId10 => entityId10.entityId === entityId11) || null;
      return openPicker({
        kind: "entity",
        title: startsWith === "camera" ? "选择摄像头实体" : startsWith === "presence" ? "选择人在传感器" : startsWith === "vacuum" ? "选择扫地机实体" : startsWith === "vacuum-map" ? "选择扫地机地图" : startsWith === "vacuum-room" ? "选择房间快捷指令" : isTelevision ? "选择电视媒体实体（Apple TV）" : isTelevisionPower ? "选择电视电源状态" : isNas ? "选择NAS开启实体" : isCover ? "选择窗帘实体" : isClimate ? "选择空调实体" : "选择灯光实体",
        searchPlaceholder: "搜索实体名称或 ID",
        triggerButton: isConnected,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        initialPage: editorEntityPickerInitialPage(find.findIndex(entityId8 => entityId8.entityId === entityId11), null),
        selectedText: entityId11 || "不使用实体",
        emptyText: startsWith === "camera" ? "没有匹配的摄像头实体，请先在 Home Assistant 接入设备" : startsWith === "presence" ? "没有匹配的人在传感器或移动事件，请先在 Home Assistant 接入设备" : startsWith.startsWith("vacuum") ? "没有匹配的实体，请先在 Home Assistant 中接入" : isTelevision ? "没有匹配的媒体播放器，请先在 Home Assistant 接入 Apple TV" : isTelevisionPower ? "没有匹配的电源状态实体" : isNas ? "没有匹配的开关或二元传感器" : isCover ? "没有匹配的窗帘" : isClimate ? "没有匹配的空调" : "没有匹配的灯光或开关",
        itemClass: "entity-list",
        getPage: ({
          query: searchQuery,
          page: pageNumber
        }) => editorEntityPickerPage(entitiesForQuery(searchQuery), pageNumber, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(selectedEntity)],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不使用实体", !entityId11)],
        renderItem: item => elements2.createEditorEntityPickerOption(item, entityId11),
        onSelect: selectedEntityId => {
          if (!selectedEntityId || selectedEntityId === entityId12?.entityId || getEntities().some(entityId2 => entityId2.entityId === selectedEntityId && test.test(selectedEntityId))) {
            onEntitySelect(selectedEntityId, startsWith === "presence" ? getEntities().find(entityId => entityId.entityId === selectedEntityId) : undefined);
          }
        }
      });
    }
  };
}
