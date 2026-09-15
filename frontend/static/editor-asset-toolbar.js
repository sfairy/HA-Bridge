export function editorAssetFolders(assetList) {
  return [...new Set((assetList || []).map(assetEntry => assetEntry.folder).filter(Boolean))].sort(
    (rightFolderName, leftFolderName) => rightFolderName.localeCompare(leftFolderName, "zh-CN")
  );
}
export function editorAssetSelectedFolder(currentFolder, folderList) {
  return folderList.includes(currentFolder) ? currentFolder : folderList[0] || "";
}
export function createEditorAssetToolbar({
  documentObject: documentObject,
  getSource: getSource,
  setSource: setSource,
  getFolder: getFolder,
  setFolder: setFolder,
  getAssets: getAssets,
  getUploadInput: getUploadInput,
  canDeleteFolder: canDeleteFolder,
  onDeleteFolder: onDeleteFolder
}) {
  return function (pickerState, { toolbar: toolbarElement, controller: pickerController }) {
    const sourceTabsElement = documentObject.createElement("div");
    ((sourceTabsElement.className = "asset-source-tabs"),
      sourceTabsElement.setAttribute("role", "tablist"),
      sourceTabsElement.setAttribute("aria-label", "\u56FE\u7247\u6765\u6E90"));
    for (const [sourceKey, sourceLabel] of [
      ["user", "\u6211\u7684\u56FE\u7247"],
      ["builtin", "\u6816\u5149\u7D20\u6750"]
    ]) {
      const sourceButtonElement = documentObject.createElement("button");
      ((sourceButtonElement.type = "button"),
        (sourceButtonElement.textContent = sourceLabel),
        (sourceButtonElement.dataset.editorAssetSource = sourceKey),
        sourceButtonElement.addEventListener("click", () => {
          setSource(pickerState, sourceKey);
          const folders = editorAssetFolders(getAssets(sourceKey));
          (setFolder(pickerState, editorAssetSelectedFolder(getFolder(pickerState), folders)),
            pickerController.syncAssetToolbar?.(),
            pickerController.refresh({ resetPage: !0 }));
        }),
        sourceTabsElement.append(sourceButtonElement));
    }
    const folderSelectElement = documentObject.createElement("select");
    ((folderSelectElement.className = "editor-paged-picker-folder"),
      folderSelectElement.setAttribute("aria-label", "\u9009\u62E9\u56FE\u7247\u6587\u4EF6\u5939"),
      folderSelectElement.addEventListener("change", () => {
        (setFolder(pickerState, folderSelectElement.value),
          pickerController.syncAssetToolbar?.(),
          pickerController.refresh({ resetPage: !0 }));
      }));
    const deleteFolderButtonElement = documentObject.createElement("button");
    ((deleteFolderButtonElement.type = "button"),
      (deleteFolderButtonElement.className = "asset-folder-delete"),
      (deleteFolderButtonElement.textContent = "\u5220\u9664"),
      deleteFolderButtonElement.setAttribute(
        "aria-label",
        "\u5220\u9664\u5F53\u524D\u81EA\u52A8\u5BFC\u56FE\u6587\u4EF6\u5939"
      ),
      (deleteFolderButtonElement.title =
        "\u5220\u9664\u5F53\u524D\u81EA\u52A8\u5BFC\u56FE\u6587\u4EF6\u5939"),
      deleteFolderButtonElement.addEventListener("click", () =>
        onDeleteFolder?.(pickerState, folderSelectElement.value)
      ));
    const folderRowElement = documentObject.createElement("div");
    ((folderRowElement.className = "editor-paged-picker-folder-row"),
      folderRowElement.append(folderSelectElement, deleteFolderButtonElement));
    const uploadButtonElement = documentObject.createElement("button");
    ((uploadButtonElement.type = "button"),
      (uploadButtonElement.className = "asset-upload-button"),
      (uploadButtonElement.textContent = "\u4E0A\u4F20"),
      uploadButtonElement.addEventListener("click", () => getUploadInput(pickerState).click()),
      toolbarElement.append(sourceTabsElement, folderRowElement, uploadButtonElement),
      (pickerController.syncAssetToolbar = () => {
        const activeSource = getSource(pickerState);
        for (const sourceTabElement of sourceTabsElement.querySelectorAll(
          "[data-editor-asset-source]"
        ))
          sourceTabElement.classList.toggle(
            "active",
            sourceTabElement.dataset.editorAssetSource === activeSource
          );
        const availableFolders = editorAssetFolders(getAssets(activeSource)),
          selectedFolder = getFolder(pickerState);
        (folderSelectElement.replaceChildren(
          ...availableFolders.map(
            optionName =>
              new Option(optionName === "." ? "\u6839\u76EE\u5F55" : optionName, optionName)
          )
        ),
          (folderSelectElement.value = selectedFolder),
          (folderRowElement.hidden = !availableFolders.length),
          (deleteFolderButtonElement.hidden = !canDeleteFolder?.(activeSource, selectedFolder)),
          (uploadButtonElement.hidden = activeSource !== "user"));
      }),
      pickerController.syncAssetToolbar());
  };
}
