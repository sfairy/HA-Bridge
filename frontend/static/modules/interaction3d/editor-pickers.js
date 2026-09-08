import {
  EDITOR_PICKER_PAGE_SIZES,
  editorEntityPickerInitialPage,
  editorEntityPickerPage,
} from "../../js/editor/editor-picker-pagination.js?v=20260830-editor-picker-pagination-v1";
import { createEditorPickerQueries } from "../../js/editor/editor-picker-queries.js?v=20260830-editor-picker-queries-v1";
const DEFAULT_LIGHT_ICON = "mdi:lightbulb-outline";
const isValidMdiIcon = (iconId) =>
  typeof iconId == "string" && /^mdi:[a-z0-9][a-z0-9-]{0,119}$/.test(iconId);
export function createInteraction3dEditorPickers({
  openPicker,
  fetchIcons,
  getEntities,
  ensureEntities,
  entityPickerText,
  elements,
}) {
  const { editorEntityMatches } = createEditorPickerQueries({
    entityPickerConfig: () => ({
      recommended: (entity) => entity.entityId.startsWith("light."),
    }),
    pickerEntitiesForComponentType: () =>
      getEntities().filter((entity) =>
        /^(light|switch)\.[a-z0-9_]+$/.test(entity.entityId),
      ),
    entityPickerText,
    entityDomain: (entity) => entity.entityId.split(".")[0],
  });
  return {
    icon({ trigger, current = DEFAULT_LIGHT_ICON, onSelect }) {
      return openPicker({
        kind: "icon",
        title: "选择灯光按钮图标",
        searchPlaceholder: "搜索图标名称",
        triggerButton: trigger,
        pageSize: EDITOR_PICKER_PAGE_SIZES.icon,
        emptyText: "没有匹配的图标",
        itemClass: "icon-grid",
        async getPage({ query, page, pageSize }) {
          const result = await fetchIcons(query, pageSize, (page - 1) * pageSize);
          return {
            items: result.items || [],
            total: Number(result.total) || 0,
          };
        },
        renderSelectedActions: () => [
          elements.createEditorPickerCurrentIcon(current || DEFAULT_LIGHT_ICON),
        ],
        renderItem: (iconId) =>
          elements.createIconPickerOption(iconId, current, "editorPickerValue"),
        onSelect: (iconId) => {
          if (isValidMdiIcon(iconId)) {
            onSelect(iconId);
          }
        },
      });
    },
    async entity({ trigger, current = "", onSelect }) {
      await ensureEntities();
      if (!trigger.isConnected) {
        return null;
      }
      const missingCurrentEntity =
        current &&
        /^(light|switch)\.[a-z0-9_]+$/.test(current) &&
        !getEntities().some((entity) => entity.entityId === current)
          ? {
              entityId: current,
              name: current + "（当前未找到）",
            }
          : null;
      const matchedEntities = (query) => {
        const matches = editorEntityMatches("interaction3d", query);
        if (
          missingCurrentEntity &&
          (!query ||
            entityPickerText(missingCurrentEntity)
              .toLocaleLowerCase("zh-CN")
              .includes(String(query).trim().toLocaleLowerCase("zh-CN")))
        ) {
          matches.push(missingCurrentEntity);
        }
        return matches;
      };
      const initialMatches = matchedEntities("");
      const selectedEntity =
        initialMatches.find((entity) => entity.entityId === current) || null;
      return openPicker({
        kind: "entity",
        title: "选择灯光实体",
        searchPlaceholder: "搜索实体名称或 ID",
        triggerButton: trigger,
        pageSize: EDITOR_PICKER_PAGE_SIZES.entity,
        initialPage: editorEntityPickerInitialPage(
          initialMatches.findIndex((entity) => entity.entityId === current),
          null,
        ),
        selectedText: current || "不使用实体",
        emptyText: "没有匹配的灯光或开关",
        itemClass: "entity-list",
        getPage: ({ query, page }) =>
          editorEntityPickerPage(matchedEntities(query), page, null),
        renderSelectedContent: () => [
          elements.createEditorPickerCurrentEntity(selectedEntity),
        ],
        renderSelectedActions: () => [
          elements.editorPickerClearAction("不使用实体", !current),
        ],
        renderItem: (entity) =>
          elements.createEditorEntityPickerOption(entity, current),
        onSelect: (entityId) => {
          if (
            !entityId ||
            entityId === missingCurrentEntity?.entityId ||
            getEntities().some(
              (entity) =>
                entity.entityId === entityId &&
                /^(light|switch)\./.test(entityId),
            )
          ) {
            onSelect(entityId);
          }
        },
      });
    },
  };
}
