/** Shared save-status copy for 3D config editors (灯光 / 环境 / 设备 / 扫地机 / 安防). */
export const EDITOR_SAVE_STATUS = Object.freeze({
  saving: "保存中…",
  saved: "已保存，请再点顶部「保存」",
  savedWithMoreChanges: "已保存，另有新修改，请再点顶部「保存」",
  failed: "保存失败，请重试。",
  accessDenied: "3D 使用权限已失效，无法保存。",
  dirty: "配置已修改，请保存配置。",
  dirtyExitConfirm: "配置尚未保存，确定退出？"
});

export function serializeEditorDraft(value) {
  return JSON.stringify(value, (_propertyKey, nestedValue) => {
    if (nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)) {
      return Object.fromEntries(
        Object.entries(nestedValue)
          .filter(([, entryValue]) => entryValue !== undefined)
          .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      );
    }
    return nestedValue;
  });
}

export function editorDraftHasChanges(currentDraft, baselineDraft) {
  return serializeEditorDraft(currentDraft) !== serializeEditorDraft(baselineDraft);
}
