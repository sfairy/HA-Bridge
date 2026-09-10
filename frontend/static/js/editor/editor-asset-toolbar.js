export function editorAssetFolders(assets) {
  return [...new Set((assets || []).map(asset => asset.folder).filter(Boolean))].sort((left, right) => left.localeCompare(right, "zh-CN"));
}
export function editorAssetSelectedFolder(current, folders) {
  return folders.includes(current) ? current : folders[0] || "";
}
export function createEditorAssetToolbar({
  documentObject,
  getSource,
  setSource,
  getFolder,
  setFolder,
  getAssets,
  getUploadInput,
  canDeleteFolder,
  onDeleteFolder
}) {
  return function (kind, {
    toolbar,
    controller
  }) {
    const tabs = documentObject.createElement("div");
    tabs.className = "asset-source-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "图片来源");
    for (const [source, label] of [["user", "我的图片"], ["builtin", "默认素材"]]) {
      const tab = documentObject.createElement("button");
      tab.type = "button";
      tab.textContent = label;
      tab.dataset.editorAssetSource = source;
      tab.addEventListener("click", () => {
        setSource(kind, source);
        const folders = editorAssetFolders(getAssets(source));
        setFolder(kind, editorAssetSelectedFolder(getFolder(kind), folders));
        controller.syncAssetToolbar?.();
        controller.refresh({
          resetPage: true
        });
      });
      tabs.append(tab);
    }
    const folderSelect = documentObject.createElement("select");
    folderSelect.className = "editor-paged-picker-folder";
    folderSelect.setAttribute("aria-label", "选择图片文件夹");
    folderSelect.addEventListener("change", () => {
      setFolder(kind, folderSelect.value);
      controller.syncAssetToolbar?.();
      controller.refresh({
        resetPage: true
      });
    });
    const deleteButton = documentObject.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "asset-folder-delete";
    deleteButton.textContent = "删除";
    deleteButton.setAttribute("aria-label", "删除当前自动导图文件夹");
    deleteButton.title = "删除当前自动导图文件夹";
    deleteButton.addEventListener("click", () => onDeleteFolder?.(kind, folderSelect.value));
    const folderRow = documentObject.createElement("div");
    folderRow.className = "editor-paged-picker-folder-row";
    folderRow.append(folderSelect, deleteButton);
    const uploadButton = documentObject.createElement("button");
    uploadButton.type = "button";
    uploadButton.className = "asset-upload-button";
    uploadButton.textContent = "上传";
    uploadButton.addEventListener("click", () => getUploadInput(kind).click());
    toolbar.append(tabs, folderRow, uploadButton);
    controller.syncAssetToolbar = () => {
      const source = getSource(kind);
      for (const tab of tabs.querySelectorAll("[data-editor-asset-source]")) {
        tab.classList.toggle("active", tab.dataset.editorAssetSource === source);
      }
      const folders = editorAssetFolders(getAssets(source));
      const folder = getFolder(kind);
      folderSelect.replaceChildren(...folders.map(name => new Option(name === "." ? "根目录" : name, name)));
      folderSelect.value = folder;
      folderRow.hidden = !folders.length;
      deleteButton.hidden = !canDeleteFolder?.(source, folder);
      uploadButton.hidden = source !== "user";
    };
    controller.syncAssetToolbar();
  };
}
