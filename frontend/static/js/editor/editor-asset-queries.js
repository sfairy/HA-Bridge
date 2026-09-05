export function createEditorAssetMatcher({
  getImageSource,
  getImageFolder,
  getIbeSource,
  getIbeFolder,
  getUserAssets,
  getBuiltinAssets,
}) {
  return function (kind, query = "") {
    const isImage = kind === "image";
    const source = isImage ? getImageSource() : getIbeSource();
    const folder = isImage ? getImageFolder() : getIbeFolder();
    const assets = source === "user" ? getUserAssets() : getBuiltinAssets();
    const needle = String(query || "")
      .trim()
      .toLocaleLowerCase("zh-CN");
    return assets.filter(
      (asset) =>
        (!needle ||
          `${asset.name} ${asset.relativePath}`
            .toLocaleLowerCase("zh-CN")
            .includes(needle)) &&
        (!!needle || asset.folder === folder),
    );
  };
}
