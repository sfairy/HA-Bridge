export function createEditorPickerQueries({
  entityPickerConfig: entityPickerConfig,
  pickerEntitiesForComponentType: pickerEntitiesForComponentType,
  entityPickerText: entityPickerText,
  entityDomain: entityDomain
}) {
  function editorEntityMatches(componentType, searchText) {
    const pickerConfig = entityPickerConfig(componentType),
      normalizedQuery = String(searchText || "")
        .trim()
        .toLocaleLowerCase("zh-CN");
    return pickerEntitiesForComponentType(componentType)
      .map((entity, entityIndex) => ({ entity: entity, index: entityIndex }))
      .filter(
        ({ entity: filterEntity }) =>
          !filterEntity.virtual &&
          (!normalizedQuery ||
            `${entityPickerText(filterEntity)} ${entityDomain(filterEntity)}`
              .toLocaleLowerCase("zh-CN")
              .includes(normalizedQuery))
      )
      .sort((leftEntity, rightEntity) => {
        const recommendationRank = rankedEntity =>
          rankedEntity?.virtual ? 100 : Number(pickerConfig.recommended(rankedEntity));
        return (
          recommendationRank(rightEntity.entity) - recommendationRank(leftEntity.entity) ||
          leftEntity.index - rightEntity.index
        );
      })
      .map(({ entity: sortedEntity }) => sortedEntity);
  }
  function editorPickerComponentTypeLabel(pickerComponentType) {
    return (
      {
        image: "\u56FE\u7247",
        weather: "\u5929\u6C14",
        "line-chart": "\u6298\u7EBF\u56FE",
        "title-button": "\u6807\u9898\u6309\u94AE",
        "light-statistics": "\u6570\u91CF\u7EDF\u8BA1",
        "icon-button-effect": "\u56FE\u6807\u6309\u94AE\uFF08\u6548\u679C\uFF09",
        "icon-button": "\u56FE\u6807\u6309\u94AE",
        "device-button": "\u8BBE\u5907\u6309\u94AE",
        "presence-sensor": "\u4F20\u611F\u5668",
        "vacuum-map": "\u626B\u5730\u673A\u5730\u56FE",
        camera: "\u6444\u50CF\u5934",
        "air-conditioner": "\u7A7A\u8C03",
        "navigation-button": "\u5BFC\u822A\u6309\u94AE"
      }[pickerComponentType] || "\u63A7\u4EF6"
    );
  }
  return Object.freeze({
    editorEntityMatches: editorEntityMatches,
    editorPickerComponentTypeLabel: editorPickerComponentTypeLabel
  });
}
