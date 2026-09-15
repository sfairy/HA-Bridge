export function createEditorAssetMatcher({
  getImageSource: getImageSource,
  getImageFolder: getImageFolder,
  getIbeSource: getIbeSource,
  getIbeFolder: getIbeFolder,
  getUserAssets: getUserAssets,
  getBuiltinAssets: getBuiltinAssets
}) {
  return function (assetKind, searchText = "") {
    const isImageKind = assetKind === "image",
      activeSource = isImageKind ? getImageSource() : getIbeSource(),
      activeFolder = isImageKind ? getImageFolder() : getIbeFolder(),
      sourceAssets = activeSource === "user" ? getUserAssets() : getBuiltinAssets(),
      normalizedQuery = String(searchText || "")
        .trim()
        .toLocaleLowerCase("zh-CN");
    return sourceAssets.filter(
      asset =>
        (!normalizedQuery ||
          `${asset.name} ${asset.relativePath}`
            .toLocaleLowerCase("zh-CN")
            .includes(normalizedQuery)) &&
        (!!normalizedQuery || asset.folder === activeFolder)
    );
  };
}
