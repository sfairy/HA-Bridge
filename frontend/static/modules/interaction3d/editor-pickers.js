import { EDITOR_PICKER_PAGE_SIZES, editorEntityPickerInitialPage, editorEntityPickerPage } from "../../js/editor/editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries } from "../../js/editor/editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
import { vacuumProfiles } from "./vacuum-catalog.js";
import { nasProfiles } from "./nas-catalog.js";
const DEFAULT_LIGHT_ICON = "mdi:lightbulb-outline";
const isValidMdiIcon = iconId => typeof iconId == "string" && /^mdi:[a-z0-9][a-z0-9-]{0,119}$/.test(iconId);
export function createInteraction3dEditorPickers({
  openPicker,
  fetchIcons,
  getEntities,
  getState: arg23 = () => null,
  ensureEntities: arg22,
  entityPickerText: elements,
  elements: elements2,
  deviceKind: arg24 = "light",
  fetchDevices: arg25 = async () => {
    const ok = await fetch("/api/v1/ha/devices");
    if (!ok.ok) {
      throw new Error("设备目录暂时不可用，请稍后重试。");
    }
    return (await ok.json()).items || [];
  }
}) {
  return {
    async vacuum({
      trigger,
      current = "",
      onSelect
    }) {
      await arg22();
      const value3 = await arg25();
      if (!trigger.isConnected) {
        return null;
      }
      const map = vacuumProfiles(getEntities(), value3);
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
          query: arg,
          page: iconId
        }) => editorEntityPickerPage(filter.filter(name => (name.name + " " + name.entityId).toLowerCase().includes(String(arg || "").toLowerCase())), iconId, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(filter.find(entityId3 => entityId3.entityId === current))],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不绑定设备", !current)],
        renderItem: arg2 => elements2.createEditorEntityPickerOption(arg2, current),
        onSelect: arg3 => {
          const value = map.find(deviceId => deviceId.deviceId === arg3);
          if (!arg3 || value) {
            onSelect(value ? structuredClone(value) : null);
          }
        }
      });
    },
    async nas({
      trigger,
      current = "",
      onSelect
    }) {
      await arg22();
      const missingCurrentEntity = await arg25();
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
          query: arg4,
          page: arg5
        }) => editorEntityPickerPage(initialMatches.filter(name2 => (name2.name + " " + name2.entityId).toLowerCase().includes(String(arg4 || "").toLowerCase())), arg5, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(initialMatches.find(entityId4 => entityId4.entityId === current))],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不使用数据来源", !current)],
        renderItem: arg6 => {
          const querySelector = elements2.createEditorEntityPickerOption(arg6, current);
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
          const value2 = matchedEntities.find(deviceId2 => deviceId2.deviceId === entity);
          if (!entity || value2) {
            onSelect(value2 ? structuredClone(value2) : null);
          }
        }
      });
    },
    icon({
      trigger: triggerButton,
      current: arg17,
      onSelect: arg18,
      deviceKind: arg19 = arg24
    }) {
      arg17 ||= arg19 === "vacuum" ? "mdi:robot-vacuum" : arg19 === "television" ? "mdi:television" : arg19 === "nas" ? "mdi:nas" : arg19 === "cover" ? "mdi:curtains" : arg19 === "climate" ? "mdi:air-conditioner" : DEFAULT_LIGHT_ICON;
      return openPicker({
        kind: "icon",
        title: arg19 === "vacuum" ? "选择扫地机按钮图标" : arg19 === "television" ? "选择电视按钮图标" : arg19 === "nas" ? "选择NAS按钮图标" : arg19 === "cover" ? "选择窗帘按钮图标" : arg19 === "climate" ? "选择空调按钮图标" : "选择灯光按钮图标",
        searchPlaceholder: "搜索图标名称",
        triggerButton,
        pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
        emptyText: "没有匹配的图标",
        itemClass: "icon-grid",
        async getPage({
          query: arg13,
          page: arg14,
          pageSize: arg15
        }) {
          const items = await fetchIcons(arg13, arg15, (arg14 - 1) * arg15);
          return {
            items: items.items || [],
            total: Number(items.total) || 0
          };
        },
        renderSelectedActions: () => [elements2.createEditorPickerCurrentIcon(arg17 || DEFAULT_LIGHT_ICON)],
        renderItem: arg7 => elements2.createIconPickerOption(arg7, arg17, "editorPickerValue"),
        onSelect: arg8 => {
          if (isValidMdiIcon(arg8)) {
            arg18(arg8);
          }
        }
      });
    },
    async entity({
      trigger: isConnected,
      current: entityId11 = "",
      onSelect: arg20,
      deviceKind: startsWith = arg24,
      domain: arg21
    }) {
      const value4 = startsWith === "nas";
      const value5 = startsWith === "television";
      const value6 = startsWith === "television-power";
      const value7 = startsWith === "cover" || arg21 === "cover";
      const value8 = !value7 && (startsWith === "climate" || arg21 === "climate");
      const test = startsWith === "presence" ? /^(binary_sensor|event)\.[a-z0-9_]+$/ : startsWith === "vacuum" ? /^vacuum\.[a-z0-9_]+$/ : startsWith === "vacuum-map" ? /^(camera|image)\.[a-z0-9_]+$/ : startsWith === "vacuum-room" ? /^[a-z_]+\.[a-z0-9_]+$/ : value5 ? /^media_player\.[a-z0-9_]+$/ : value6 ? /^(media_player|switch|binary_sensor|input_boolean)\.[a-z0-9_]+$/ : value4 ? /^(binary_sensor|switch|input_boolean)\.[a-z0-9_]+$/ : value7 ? /^cover\.[a-z0-9_]+$/ : value8 ? /^climate\.[a-z0-9_]+$/ : /^(light|switch)\.[a-z0-9_]+$/;
      const {
        editorEntityMatches: value9
      } = createEditorPickerQueries({
        entityPickerConfig: () => ({
          recommended: entityId5 => startsWith === "presence" ? ["occupancy", "motion", "presence"].includes(entityId5.deviceClass || entityId5.device_class || entityId5.attributes?.device_class || arg23(entityId5.entityId)?.attributes?.device_class) : entityId5.entityId.startsWith(value5 || value6 ? "media_player." : value4 || startsWith === "presence" ? "binary_sensor." : value7 ? "cover." : value8 ? "climate." : "light.")
        }),
        pickerEntitiesForComponentType: () => getEntities().filter(entityId6 => test.test(entityId6.entityId)),
        entityPickerText: elements,
        entityDomain: entityId9 => entityId9.entityId.split(".")[0]
      });
      await arg22();
      if (!isConnected.isConnected) {
        return null;
      }
      const entityId12 = entityId11 && test.test(entityId11) && !getEntities().some(entityId7 => entityId7.entityId === entityId11) ? {
        entityId: entityId11,
        name: entityId11 + "（当前未找到）"
      } : null;
      const value10 = arg16 => {
        const push = value9("interaction3d", arg16);
        if (entityId12 && (!arg16 || elements(entityId12).toLocaleLowerCase("zh-CN").includes(String(arg16).trim().toLocaleLowerCase("zh-CN")))) {
          push.push(entityId12);
        }
        return push;
      };
      const find = value10("");
      const value11 = find.find(entityId10 => entityId10.entityId === entityId11) || null;
      return openPicker({
        kind: "entity",
        title: startsWith === "presence" ? "选择人在传感器" : startsWith === "vacuum" ? "选择扫地机实体" : startsWith === "vacuum-map" ? "选择扫地机地图" : startsWith === "vacuum-room" ? "选择房间快捷指令" : value5 ? "选择电视媒体实体（Apple TV）" : value6 ? "选择电视电源状态" : value4 ? "选择NAS开启实体" : value7 ? "选择窗帘实体" : value8 ? "选择空调实体" : "选择灯光实体",
        searchPlaceholder: "搜索实体名称或 ID",
        triggerButton: isConnected,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        initialPage: editorEntityPickerInitialPage(find.findIndex(entityId8 => entityId8.entityId === entityId11), null),
        selectedText: entityId11 || "不使用实体",
        emptyText: startsWith === "presence" ? "没有匹配的人在传感器或移动事件，请先在 Home Assistant 接入设备" : startsWith.startsWith("vacuum") ? "没有匹配的实体，请先在 Home Assistant 中接入" : value5 ? "没有匹配的媒体播放器，请先在 Home Assistant 接入 Apple TV" : value6 ? "没有匹配的电源状态实体" : value4 ? "没有匹配的开关或二元传感器" : value7 ? "没有匹配的窗帘" : value8 ? "没有匹配的空调" : "没有匹配的灯光或开关",
        itemClass: "entity-list",
        getPage: ({
          query: arg9,
          page: arg10
        }) => editorEntityPickerPage(value10(arg9), arg10, null),
        renderSelectedContent: () => [elements2.createEditorPickerCurrentEntity(value11)],
        renderSelectedActions: () => [elements2.editorPickerClearAction("不使用实体", !entityId11)],
        renderItem: arg11 => elements2.createEditorEntityPickerOption(arg11, entityId11),
        onSelect: arg12 => {
          if (!arg12 || arg12 === entityId12?.entityId || getEntities().some(entityId2 => entityId2.entityId === arg12 && test.test(arg12))) {
            arg20(arg12, startsWith === "presence" ? getEntities().find(entityId => entityId.entityId === arg12) : undefined);
          }
        }
      });
    }
  };
}
