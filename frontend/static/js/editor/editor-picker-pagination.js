export const EDITOR_PICKER_PAGE_SIZES = Object.freeze({
  icon: 84,
  entity: 33,
  asset: 16
});
export function editorEntityPickerInitialPage(selectedIndex, hasClearOption) {
  if (selectedIndex < 0) {
    return 1;
  }
  return Math.floor((selectedIndex + (hasClearOption ? 1 : 0)) / EDITOR_PICKER_PAGE_SIZES.entity) + 1;
}
export function editorEntityPickerPage(items, page, hasClearOption) {
  const pageSize = EDITOR_PICKER_PAGE_SIZES.entity;
  const clearSlot = hasClearOption ? 1 : 0;
  const start = Math.max(0, (page - 1) * pageSize - clearSlot);
  const take = pageSize - (page === 1 ? clearSlot : 0);
  return {
    items: items.slice(start, start + take),
    total: items.length + clearSlot
  };
}
