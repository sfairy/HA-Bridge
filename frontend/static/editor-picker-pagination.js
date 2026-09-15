export const EDITOR_PICKER_PAGE_SIZES = Object.freeze({ icon: 84, entity: 33, asset: 16 });
export function editorEntityPickerInitialPage(selectedEntityIndex, hasClearOption) {
  return selectedEntityIndex < 0
    ? 1
    : Math.floor(
        (selectedEntityIndex + (hasClearOption ? 1 : 0)) / EDITOR_PICKER_PAGE_SIZES.entity
      ) + 1;
}
export function editorEntityPickerPage(entityList, pageNumber, withClearOption) {
  const pageSize = EDITOR_PICKER_PAGE_SIZES.entity,
    placeholderCount = withClearOption ? 1 : 0,
    startIndex = Math.max(0, (pageNumber - 1) * pageSize - placeholderCount),
    pageItemCount = pageSize - (pageNumber === 1 ? placeholderCount : 0);
  return {
    items: entityList.slice(startIndex, startIndex + pageItemCount),
    total: entityList.length + placeholderCount
  };
}
