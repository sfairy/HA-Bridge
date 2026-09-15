function findComponentInTree(componentTree, targetComponentId) {
  for (const childComponent of componentTree || []) {
    if (childComponent.id === targetComponentId) return childComponent;
    const nestedMatch = findComponentInTree(childComponent.children, targetComponentId);
    if (nestedMatch) return nestedMatch;
  }
  return null;
}
function findComponentAcrossDocument(editorDocument, searchedComponentId) {
  const sharedComponentMatch = findComponentInTree(
    editorDocument?.sharedComponents,
    searchedComponentId
  );
  if (sharedComponentMatch) return sharedComponentMatch;
  for (const documentPage of editorDocument?.pages || []) {
    const pageComponentMatch = findComponentInTree(documentPage.components, searchedComponentId);
    if (pageComponentMatch) return pageComponentMatch;
  }
  return null;
}
function locateComponentWithScope(scopedDocument, locatedComponentId) {
  const sharedScopeComponent = findComponentInTree(
    scopedDocument?.sharedComponents,
    locatedComponentId
  );
  if (sharedScopeComponent) return { component: sharedScopeComponent, scope: "shared", page: null };
  for (const scannedPage of scopedDocument?.pages || []) {
    const locatedComponent = findComponentInTree(scannedPage.components, locatedComponentId);
    if (locatedComponent) return { component: locatedComponent, scope: "page", page: scannedPage };
  }
  return null;
}
function collectComponentsByIds(documentTree, wantedComponentIds) {
  const wantedIdSet = new Set(wantedComponentIds || []),
    collectedComponents = [],
    walkComponents = walkComponentList => {
      for (const candidateComponent of walkComponentList || [])
        (wantedIdSet.has(candidateComponent.id) && collectedComponents.push(candidateComponent),
          walkComponents(candidateComponent.children));
    };
  walkComponents(documentTree?.sharedComponents);
  for (const documentTreePage of documentTree?.pages || [])
    walkComponents(documentTreePage.components);
  return collectedComponents;
}
export function copyComponentTargetPages(originDocument, copiedComponentId) {
  const locatedTarget = locateComponentWithScope(originDocument, copiedComponentId);
  return locatedTarget
    ? (originDocument?.pages || []).filter(
        otherPage => locatedTarget.scope === "shared" || otherPage !== locatedTarget.page
      )
    : [];
}
export function copyComponentTargets(pageSourceDocument, sourceComponentId) {
  const targetLocation = locateComponentWithScope(pageSourceDocument, sourceComponentId);
  if (!targetLocation) return [];
  const pageTargets = copyComponentTargetPages(pageSourceDocument, sourceComponentId).map(page => ({
    key: `page:${page.path}`,
    name: page.name,
    scope: "page",
    page: page
  }));
  return targetLocation.scope === "page"
    ? [{ key: "shared", name: "\u4FA7\u8FB9\u680F", scope: "shared" }, ...pageTargets]
    : pageTargets;
}
function assignFreshComponentIds(componentNode, createComponentId) {
  componentNode.id = createComponentId();
  for (const nestedChildComponent of componentNode.children || [])
    assignFreshComponentIds(nestedChildComponent, createComponentId);
  return componentNode;
}
function uniqueCopyLabel(labelSourceComponent, siblingComponents, labelOf) {
  const baseLabel =
      String(labelOf(labelSourceComponent) || "\u63A7\u4EF6")
        .trim()
        .replace(/_副本\d*$/, "") || "\u63A7\u4EF6",
    existingLabels = new Set(
      (siblingComponents || []).map(existingComponent => String(labelOf(existingComponent)).trim())
    );
  let candidateLabel = `${baseLabel}_\u526F\u672C`,
    copyIndex = 2;
  for (; existingLabels.has(candidateLabel);)
    ((candidateLabel = `${baseLabel}_\u526F\u672C${copyIndex}`), (copyIndex += 1));
  return candidateLabel;
}
function applyLayerOrder(components) {
  for (let layerIndex = 0; layerIndex < (components || []).length; layerIndex += 1) {
    const layeredComponent = components[layerIndex];
    layeredComponent.position = {
      ...(layeredComponent.position || {}),
      zIndex: components.length - layerIndex
    };
  }
}
function roundSixDecimals(numericValue) {
  return Math.round(Number(numericValue) * 1e6) / 1e6;
}
function positiveNumberOr(rawValue, fallbackValue) {
  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
}
function scaleComponentGeometry(geometryComponent, scaleX, scaleY, childScale, isRoot = !0) {
  if (!geometryComponent || typeof geometryComponent != "object") return;
  const position = geometryComponent.position || {},
    width = positiveNumberOr(position.width, 100),
    height = positiveNumberOr(position.height, 100),
    positionX = Number.isFinite(Number(position.x)) ? Number(position.x) : 0,
    positionY = Number.isFinite(Number(position.y)) ? Number(position.y) : 0,
    scaledWidth = width * childScale,
    scaledHeight = height * childScale;
  geometryComponent.position = {
    ...position,
    x: roundSixDecimals(
      isRoot ? (positionX + width / 2) * scaleX - scaledWidth / 2 : positionX * childScale
    ),
    y: roundSixDecimals(
      isRoot ? (positionY + height / 2) * scaleY - scaledHeight / 2 : positionY * childScale
    ),
    width: roundSixDecimals(scaledWidth),
    height: roundSixDecimals(scaledHeight)
  };
  for (const childNode of geometryComponent.children || [])
    scaleComponentGeometry(childNode, childScale, childScale, childScale, !1);
}
function fitComponentToCanvas(componentToFit, sourceCanvas, targetCanvas) {
  const sourceWidth = positiveNumberOr(sourceCanvas?.width, 2778),
    sourceHeight = positiveNumberOr(sourceCanvas?.height, 1940),
    targetWidth = positiveNumberOr(targetCanvas?.width, sourceWidth),
    targetHeight = positiveNumberOr(targetCanvas?.height, sourceHeight),
    widthRatio = targetWidth / sourceWidth,
    heightRatio = targetHeight / sourceHeight;
  return (
    scaleComponentGeometry(
      componentToFit,
      widthRatio,
      heightRatio,
      Math.min(widthRatio, heightRatio)
    ),
    componentToFit
  );
}
function pruneInvalidReferences(componentToPrune, pruneDocument, handleInvalidReference) {
  if (!componentToPrune || typeof componentToPrune != "object") return;
  const pagePaths = new Set((pruneDocument?.pages || []).map(existingPage => existingPage.path)),
    popupIds = new Set((pruneDocument?.customPopups || []).map(existingPopup => existingPopup.id));
  componentToPrune.properties?.targetPage &&
    !pagePaths.has(componentToPrune.properties.targetPage) &&
    (delete componentToPrune.properties.targetPage, handleInvalidReference?.("navigate"));
  for (const [actionKey, action] of Object.entries(componentToPrune.actions || {})) {
    const hasInvalidTarget = action?.type === "navigate" && !pagePaths.has(action.target),
      hasInvalidPopup =
        action?.type === "more-info" &&
        action.data?.popupSource === "custom" &&
        !popupIds.has(action.data?.popupId);
    (hasInvalidTarget || hasInvalidPopup) &&
      (delete componentToPrune.actions[actionKey],
      handleInvalidReference?.(hasInvalidTarget ? "navigate" : "popup"));
  }
  for (const childComponentToPrune of componentToPrune.children || [])
    pruneInvalidReferences(childComponentToPrune, pruneDocument, handleInvalidReference);
}
function resolveTargetComponentList(listDocument, scopeKey) {
  if (scopeKey === "shared")
    return listDocument.sharedComponents || (listDocument.sharedComponents = []);
  const targetPagePath = String(scopeKey || "").replace(/^page:/, ""),
    matchedPage = (listDocument.pages || []).find(
      pageCandidate => pageCandidate.path === targetPagePath
    );
  return matchedPage ? matchedPage.components || (matchedPage.components = []) : null;
}
function addSharedComponentRefsToPages(refDocument, sharedComponentIds) {
  if (sharedComponentIds.length)
    for (const updatedPage of refDocument.pages || [])
      updatedPage.sharedComponentIds = [
        ...new Set([...sharedComponentIds, ...(updatedPage.sharedComponentIds || [])])
      ];
}
export function copyComponentsAcrossDocuments(
  sourceDocumentToCopy,
  targetDocumentToCopy,
  componentIdsToCopy,
  targetScopeToCopy,
  {
    cloneValue: cloneValue = clonedValue => structuredClone(clonedValue),
    createId: createId,
    componentLabel: componentLabelOf = labelComponent =>
      labelComponent?.properties?.label || labelComponent?.type || "\u63A7\u4EF6",
    scaleMode: scaleMode = "none",
    onInvalidAction: handleInvalidAction
  } = {}
) {
  const requestedIds = [...new Set(componentIdsToCopy || [])].filter(Boolean);
  if (
    !sourceDocumentToCopy ||
    !targetDocumentToCopy ||
    !requestedIds.length ||
    typeof createId != "function"
  )
    return [];
  const sourceComponents = collectComponentsByIds(sourceDocumentToCopy, requestedIds),
    targetComponents = resolveTargetComponentList(targetDocumentToCopy, targetScopeToCopy);
  if (sourceComponents.length !== requestedIds.length || !targetComponents) return [];
  const copiedComponents = [];
  for (const sourceComponent of sourceComponents) {
    const copiedComponent = assignFreshComponentIds(cloneValue(sourceComponent), createId);
    ((copiedComponent.properties = {
      ...(copiedComponent.properties || {}),
      label: uniqueCopyLabel(
        sourceComponent,
        [...targetComponents, ...copiedComponents],
        componentLabelOf
      )
    }),
      delete copiedComponent.properties.previewState,
      pruneInvalidReferences(copiedComponent, targetDocumentToCopy, handleInvalidAction),
      scaleMode === "proportional" &&
        fitComponentToCanvas(
          copiedComponent,
          sourceDocumentToCopy.canvas,
          targetDocumentToCopy.canvas
        ),
      copiedComponents.push(copiedComponent));
  }
  return (
    targetComponents.unshift(...copiedComponents),
    applyLayerOrder(targetComponents),
    targetScopeToCopy === "shared" &&
      addSharedComponentRefsToPages(
        targetDocumentToCopy,
        copiedComponents.map(copiedChildId => copiedChildId.id)
      ),
    copiedComponents
  );
}
export function copyComponentAcrossDocuments(
  sourceDocument,
  targetDocument,
  componentId,
  targetScope,
  options = {}
) {
  return (
    copyComponentsAcrossDocuments(
      sourceDocument,
      targetDocument,
      [componentId],
      targetScope,
      options
    )[0] || null
  );
}
export function copyComponentToPage(
  copySourceDocument,
  copySourceComponentId,
  copyTargetPagePath,
  {
    cloneValue: cloneValueForPage = pageCloneValue => structuredClone(pageCloneValue),
    createId: createPageComponentId,
    componentLabel: componentLabelForPage = pageLabelComponent =>
      pageLabelComponent?.properties?.label || pageLabelComponent?.type || "\u63A7\u4EF6"
  } = {}
) {
  if (
    !copySourceDocument ||
    !copySourceComponentId ||
    !copyTargetPagePath ||
    typeof createPageComponentId != "function"
  )
    return null;
  const pageSourceComponent = findComponentAcrossDocument(
      copySourceDocument,
      copySourceComponentId
    ),
    copyTargetPage = (copySourceDocument.pages || []).find(
      targetPageMatch => targetPageMatch.path === copyTargetPagePath
    );
  if (!pageSourceComponent || !copyTargetPage) return null;
  const pageComponents = copyTargetPage.components || (copyTargetPage.components = []),
    pageCopiedComponent = assignFreshComponentIds(
      cloneValueForPage(pageSourceComponent),
      createPageComponentId
    );
  return (
    (pageCopiedComponent.properties = {
      ...(pageCopiedComponent.properties || {}),
      label: uniqueCopyLabel(pageSourceComponent, pageComponents, componentLabelForPage)
    }),
    delete pageCopiedComponent.properties.previewState,
    pageComponents.unshift(pageCopiedComponent),
    applyLayerOrder(pageComponents),
    pageCopiedComponent
  );
}
export function copyComponentToTarget(
  singleCopySourceDocument,
  singleCopyComponentId,
  singleCopyTargetScope,
  singleCopyOptions = {}
) {
  return (
    copyComponentsToTarget(
      singleCopySourceDocument,
      [singleCopyComponentId],
      singleCopyTargetScope,
      singleCopyOptions
    )[0] || null
  );
}
export function copyComponentsToTarget(
  batchCopySourceDocument,
  batchCopyComponentIds,
  batchCopyTargetScope,
  batchCopyOptions = {}
) {
  return copyComponentsAcrossDocuments(
    batchCopySourceDocument,
    batchCopySourceDocument,
    batchCopyComponentIds,
    batchCopyTargetScope,
    { ...batchCopyOptions, scaleMode: "none" }
  );
}
