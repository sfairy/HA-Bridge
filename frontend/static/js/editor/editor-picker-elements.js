export function createEditorPickerElements({
  entityKindLabel,
  entityPickerPrimaryName,
  entityPickerText,
  enableEntityTextHoverScroll,
  assetDisplayName,
  assetPreviewUrl,
  bindEditorIconNameTooltip,
  mdiIconUrl
}) {
  function createIconPickerClearOption(selectedName, label, datasetKey) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `navigation-icon-option navigation-icon-clear${selectedName ? "" : " selected"}`;
    button.dataset[datasetKey] = "";
    button.textContent = label;
    return button;
  }
  function createIconPickerOption(icon, selectedName, datasetKey) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `navigation-icon-option${icon.name === selectedName ? " selected" : ""}`;
    button.dataset[datasetKey] = icon.name;
    button.setAttribute("aria-label", icon.name);
    button.dataset.iconName = icon.name;
    const glyph = document.createElement("i");
    glyph.setAttribute("aria-hidden", "true");
    glyph.style.maskImage = `url("${icon.previewUrl}")`;
    glyph.style.webkitMaskImage = `url("${icon.previewUrl}")`;
    button.append(glyph);
    bindEditorIconNameTooltip(button, icon.name);
    return button;
  }
  function createEditorPickerCurrentIcon(iconName, emptyLabel = "未使用图标") {
    const name = String(iconName || "").trim();
    const current = document.createElement("span");
    current.className = "editor-paged-picker-current-icon";
    current.title = name || emptyLabel;
    const glyph = document.createElement("i");
    glyph.setAttribute("aria-hidden", "true");
    const url = mdiIconUrl(name);
    if (url) {
      glyph.style.setProperty("mask-image", `url("${url}")`);
      glyph.style.setProperty("-webkit-mask-image", `url("${url}")`);
    }
    current.append(glyph);
    const label = document.createElement("strong");
    label.className = "editor-paged-picker-current-icon-name";
    label.textContent = name || emptyLabel;
    current.append(label);
    return current;
  }
  function createEditorEntityPickerOption(entity, selectedEntityId) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `inspector-entity-option${entity.entityId === selectedEntityId ? " selected" : ""}`;
    button.dataset.editorPickerValue = entity.entityId;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(entity.entityId === selectedEntityId));
    const content = document.createElement("span");
    content.className = "inspector-entity-option-content";
    content.title = entityPickerText(entity);
    const nameLine = document.createElement("span");
    nameLine.className = "inspector-entity-option-line inspector-entity-name-line";
    const kind = document.createElement("span");
    kind.className = "inspector-entity-kind";
    kind.textContent = `[${entityKindLabel(entity)}] `;
    const name = document.createElement("span");
    name.className = "inspector-entity-name";
    name.textContent = entityPickerPrimaryName(entity);
    nameLine.append(kind, name);
    const idLine = document.createElement("span");
    idLine.className = "inspector-entity-option-line inspector-entity-id";
    idLine.textContent = entity.entityId;
    content.append(nameLine, idLine);
    enableEntityTextHoverScroll(button, nameLine);
    button.append(content);
    return button;
  }
  function editorPickerClearOption(label, selected = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `editor-paged-picker-clear${selected ? " selected" : ""}`;
    button.dataset.editorPickerValue = "";
    button.textContent = label;
    return button;
  }
  function editorPickerClearAction(label = "不使用实体", selected = false) {
    const button = editorPickerClearOption(label, selected);
    button.className = "editor-paged-picker-selected-action";
    return button;
  }
  function editorPickerEntityAction(entity, selected = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `editor-paged-picker-selected-action${selected ? " selected" : ""}`;
    button.dataset.editorPickerValue = entity.entityId;
    button.title = entityPickerText(entity);
    button.textContent = entityPickerText(entity);
    return button;
  }
  function createEditorPickerCurrentEntity(entity, emptyLabel = "未选择实体") {
    const current = document.createElement("span");
    current.className = "editor-paged-picker-current-entity";
    const name = document.createElement("span");
    name.className = "editor-paged-picker-current-entity-name";
    const entityId = document.createElement("span");
    entityId.className = "editor-paged-picker-current-entity-id";
    if (entity) {
      name.textContent = entityPickerPrimaryName(entity);
      entityId.textContent = entity.entityId || "";
      current.title = entityPickerText(entity);
    } else {
      name.textContent = emptyLabel;
      entityId.textContent = "";
    }
    current.append(name);
    if (entityId.textContent) current.append(entityId);
    return current;
  }
  function createEditorPickerCurrentAsset(asset, emptyLabel = "未使用图片") {
    const current = document.createElement("span");
    current.className = "editor-paged-picker-current-asset";
    const image = document.createElement("img");
    image.alt = "";
    const name = document.createElement("span");
    name.className = "editor-paged-picker-current-asset-name";
    if (asset) {
      image.src = assetPreviewUrl(asset);
      name.textContent = assetDisplayName(asset) || emptyLabel;
      current.title = asset.name || asset.relativePath || asset.assetId || emptyLabel;
    } else {
      image.hidden = true;
      name.textContent = emptyLabel;
    }
    current.append(image, name);
    return current;
  }
  return Object.freeze({
    createIconPickerClearOption,
    createIconPickerOption,
    createEditorPickerCurrentIcon,
    createEditorEntityPickerOption,
    editorPickerClearOption,
    editorPickerClearAction,
    editorPickerEntityAction,
    createEditorPickerCurrentEntity,
    createEditorPickerCurrentAsset
  });
}
