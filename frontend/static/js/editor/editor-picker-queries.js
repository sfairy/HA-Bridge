export function createEditorPickerQueries({
  entityPickerConfig,
  pickerEntitiesForComponentType,
  entityPickerText,
  entityDomain,
}) {
  function editorEntityMatches(component, query) {
    const config = entityPickerConfig(component);
    const needle = String(query || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    return pickerEntitiesForComponentType(component)
      .map((entity, index) => ({ entity, index }))
      .filter(
        ({ entity }) =>
          !entity.virtual &&
          (!needle ||
            `${entityPickerText(entity)} ${entityDomain(entity)}`
              .toLocaleLowerCase("zh-CN")
              .includes(needle)),
      )
      .sort((left, right) => {
        const rank = (entity) =>
          entity?.virtual ? 100 : Number(config.recommended(entity));
        return (
          rank(right.entity) - rank(left.entity) || left.index - right.index
        );
      })
      .map(({ entity }) => entity);
  }
  function editorPickerComponentTypeLabel(type) {
    return (
      {
        image: "图片",
        weather: "天气",
        "line-chart": "折线图",
        "title-button": "标题按钮",
        "light-statistics": "数量统计",
        "icon-button-effect": "图标按钮（效果）",
        "icon-button": "图标按钮",
        "device-button": "设备按钮",
        "presence-sensor": "传感器",
        "vacuum-map": "扫地机地图",
        camera: "摄像头",
        "air-conditioner": "空调",
        "navigation-button": "导航按钮",
      }[type] || "控件"
    );
  }
  return Object.freeze({
    editorEntityMatches,
    editorPickerComponentTypeLabel,
  });
}
